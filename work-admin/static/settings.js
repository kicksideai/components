import { defineComponent as ke, computed as W, openBlock as n, createBlock as H, resolveDynamicComponent as Zt, normalizeProps as Qo, guardReactiveProps as _o, createSlots as cl, withCtx as j, createElementVNode as d, normalizeClass as st, createElementBlock as b, Fragment as te, renderList as re, toDisplayString as E, createCommentVNode as U, unref as s, renderSlot as et, inject as ei, ref as M, useSlots as ti, createVNode as g, Transition as ro, withDirectives as ct, vShow as Vt, watch as Ie, onMounted as pa, onUnmounted as Vl, resolveComponent as uo, createTextVNode as F, onBeforeUnmount as kt, useId as Ba, withKeys as Ee, withModifiers as Te, nextTick as Ht, normalizeStyle as ai, watchEffect as co, reactive as li, provide as oi } from "vue";
import { e as Tt, u as ii, b as ni, c as si, a as ri } from "./mount-DH3Id7d9.js";
import "pinia";
import { m as Ia, i as Bl, s as he, j as di, t as je, g as ui, p as zt, k as jt, r as zl, w as bt, f as lt, l as da, n as Ft, o as Ge, q as It, u as vo, v as Ne, x as Le, y as mo, z as Bt, A as fo, B as za, d as po, C as ba, c as bo, D as ci, E as Oa, F as vl, G as vi, H as Nt, I as mi, _ as ml, J as fi, K as pi, L as Pt, M as ho, N as bi, O as hi, P as _a, Q as gi, h as yi, R as jl, S as ki, T as wi, a as Vi, U as Wl, V as $i, W as xi } from "./latestRequest-DmAg0i5K.js";
import ve from "primevue/select";
import Z from "primevue/button";
import { Icon as ce } from "@iconify/vue";
import { api as fl, on as Ci, host as Si, define as Ti } from "@wippy-fe/proxy";
import Ye from "primevue/tag";
import Ze from "primevue/toggleswitch";
import Lt from "primevue/checkbox";
import ye from "primevue/inputtext";
import Pa from "primevue/textarea";
import ht from "primevue/inputnumber";
import $l from "primevue/selectbutton";
import Ii from "primevue/message";
const el = (e, a) => e.x > a.x && e.x < a.x + a.width && e.y > a.y && e.y < a.y + a.height;
function Di(e, a, t) {
  return e.x === a.x ? e.x > t.x && e.x < t.x + t.width && Math.max(e.y, a.y) > t.y && Math.min(e.y, a.y) < t.y + t.height : e.y > t.y && e.y < t.y + t.height && Math.max(e.x, a.x) > t.x && Math.min(e.x, a.x) < t.x + t.width;
}
function Et(e, a, t) {
  const l = [.../* @__PURE__ */ new Set([e.x, a.x, ...t.flatMap((V) => [V.x, V.x + V.width])])].sort((V, x) => V - x), o = [.../* @__PURE__ */ new Set([e.y, a.y, ...t.flatMap((V) => [V.y, V.y + V.height])])].sort((V, x) => V - x);
  l.unshift(l[0] - 24), l.push(l.at(-1) + 24), o.unshift(o[0] - 24), o.push(o.at(-1) + 24);
  const r = l.length, p = o.indexOf(a.y) * r + l.indexOf(a.x), m = o.indexOf(e.y) * r + l.indexOf(e.x), u = (V) => ({ x: l[V % r], y: o[Math.floor(V / r)] }), i = /* @__PURE__ */ new Map(), c = /* @__PURE__ */ new Map(), f = [];
  function y(V) {
    f.push(V);
    let x = f.length - 1;
    for (; x; ) {
      const A = x - 1 >> 1;
      if (f[A].priority <= V.priority) break;
      f[x] = f[A], x = A;
    }
    f[x] = V;
  }
  function h() {
    const V = f[0], x = f.pop();
    if (f.length) {
      let A = 0;
      for (; A * 2 + 1 < f.length; ) {
        let S = A * 2 + 1;
        if (S + 1 < f.length && f[S + 1].priority < f[S].priority && S++, x.priority <= f[S].priority) break;
        f[A] = f[S], A = S;
      }
      f[A] = x;
    }
    return V;
  }
  const $ = (V) => Math.abs(V.x - a.x) + Math.abs(V.y - a.y);
  for (const V of [0, 1]) {
    const x = m * 2 + V;
    i.set(x, 0), y({ key: x, cost: 0, priority: $(e) });
  }
  const k = /* @__PURE__ */ new Map(), I = /* @__PURE__ */ new Map();
  for (; f.length; ) {
    const V = h(), x = Math.floor(V.key / 2), A = V.key % 2;
    if (V.cost !== i.get(V.key)) continue;
    if (x === p) {
      const K = [];
      let de = V.key;
      for (; de !== void 0; )
        K.push(u(Math.floor(de / 2))), de = c.get(de);
      return go(K.reverse());
    }
    const S = u(x), oe = x % r, X = Math.floor(x / r);
    for (const [K, de] of [[oe > 0 ? x - 1 : -1, 0], [oe + 1 < r ? x + 1 : -1, 0], [X > 0 ? x - r : -1, 1], [X + 1 < o.length ? x + r : -1, 1]]) {
      if (K < 0) continue;
      const Q = u(K);
      if (k.has(K) || k.set(K, !t.some((P) => el(Q, P))), !k.get(K)) continue;
      const me = `${Math.min(x, K)}:${Math.max(x, K)}`;
      if (I.has(me) || I.set(me, !t.some((P) => Di(S, Q, P))), !I.get(me)) continue;
      const ge = V.cost + Math.abs(S.x - Q.x) + Math.abs(S.y - Q.y) + (A === de ? 0 : 18), ae = K * 2 + de;
      ge >= (i.get(ae) ?? 1 / 0) || (i.set(ae, ge), c.set(ae, V.key), y({ key: ae, cost: ge, priority: ge + $(Q) }));
    }
  }
  throw new Error("Process map has no collision-free route between its ports: " + JSON.stringify({ start: e, end: a, startInside: t.filter((V) => el(e, V)), endInside: t.filter((V) => el(a, V)) }));
}
function go(e) {
  const a = [];
  for (const t of e) {
    const l = a.at(-1), o = a.at(-2);
    l && l.x === t.x && l.y === t.y || (o && l && (o.x === l.x && l.x === t.x || o.y === l.y && l.y === t.y) && a.pop(), a.push(t));
  }
  return a;
}
const aa = (e) => Array.from(e).reduce((a, t) => a + (/[^\x20-\x7e]/u.test(t) ? 16 : /[MW@%]/.test(t) ? 11 : /[ilI.,:;!| ']/.test(t) ? 4 : 7.5), 0);
function Yt(e, a = 28) {
  const t = [];
  let l = "";
  for (const o of e.split(/\s+/u))
    for (let r = 0; r < o.length; r += a) {
      const p = o.slice(r, r + a);
      l && l.length + p.length + 1 > a && (t.push(l), l = ""), l = l ? l + " " + p : p;
    }
  return [...t, l].filter(Boolean);
}
function $a(e) {
  if (e = go(e), !e.length) return "";
  let a = `M ${e[0].x} ${e[0].y}`;
  for (let l = 1; l < e.length - 1; l++) {
    const o = e[l - 1], r = e[l], p = e[l + 1], m = Math.hypot(r.x - o.x, r.y - o.y), u = Math.hypot(p.x - r.x, p.y - r.y), i = Math.min(8, m / 3, u / 3);
    i && (a += ` L ${r.x + (o.x - r.x) * i / m} ${r.y + (o.y - r.y) * i / m} Q ${r.x} ${r.y} ${r.x + (p.x - r.x) * i / u} ${r.y + (p.y - r.y) * i / u}`);
  }
  const t = e.at(-1);
  return a + ` L ${t.x} ${t.y}`;
}
function Ui(e, a = {}, t = { width: 1400, height: 480 }) {
  const l = t.direction ?? (t.width < 750 || Ia(e).length > 8 ? "TB" : "LR"), o = t.direction === "LR" && Ia(e).length > 6, r = new Bl.graphlib.Graph({ multigraph: !0 });
  r.setGraph({ rankdir: l, ranker: "network-simplex", acyclicer: "greedy", nodesep: 32, edgesep: 32, ranksep: 24, marginx: 32, marginy: 32 }), r.setDefaultEdgeLabel(() => ({}));
  const p = Ia(e), m = new Map(p.map((v, w) => [v.id, w])), u = e.states.map((v) => {
    const w = (e.transitions ?? []).filter((D) => D.from === "any" && D.to === v.id), _ = Yt(he(v), o ? 13 : 28), R = Yt(di(v, e), o ? 13 : 28), B = w.flatMap((D) => Yt(je(D) + " works from any state")), O = a.policy?.wip?.[v.id]?.limit, N = O === void 0 ? 0 : aa(" · limit " + O), C = Math.max(o ? 122 : 168, ..._.map((D) => aa(D) + 58), ...R.map((D, ne) => aa(D) + 32 + (ne === R.length - 1 ? N : 0)), ...B.map((D) => aa(D) + 32)), G = Math.max(80, 42 + _.length * 18 + R.length * 16 + B.length * 18);
    return r.setNode(v.id, { width: C + (l === "LR" ? 36 : 0), height: G + (l === "TB" ? 36 : 0) }), { state: v, x: 0, y: 0, width: C, height: G, title: _, caption: R, badges: w, row: m.has(v.id) ? 0 : 1 };
  }), i = new Set(u.map((v) => v.state.id)), c = (e.transitions ?? []).flatMap((v) => v.from === "any" ? [] : v.from.filter((w) => i.has(w) && i.has(v.to)).map((w) => {
    const _ = `${v.id}-${w}`, R = Yt(je(v), o ? 12 : 28), B = Math.max(o ? 60 : 72, ...R.map((N) => aa(N) + 24)), O = Math.max(24, R.length * 16 + 10);
    return { transition: v, from: w, key: _, lines: R, width: B, height: O };
  })), f = /* @__PURE__ */ new Set(), y = /* @__PURE__ */ new Set(), h = new Set(c.filter((v) => v.from === v.transition.to || v.transition.to === e.initial || ["completed", "canceled"].includes(u.find((w) => w.state.id === v.from).state.category)).map((v) => v.key));
  function $(v) {
    if (!y.has(v)) {
      f.add(v);
      for (const w of c.filter((_) => _.from === v))
        h.has(w.key) || (f.has(w.transition.to) ? h.add(w.key) : $(w.transition.to));
      f.delete(v), y.add(v);
    }
  }
  $(e.initial);
  for (const v of u) $(v.state.id);
  for (const v of c) if (!h.has(v.key)) {
    const w = m.get(v.from), _ = m.get(v.transition.to);
    r.setEdge(v.from, v.transition.to, { width: v.width, height: v.height, labelpos: "c", weight: w !== void 0 && _ === w + 1 ? 100 : 1 }, v.key);
  }
  for (const v of e.transitions ?? []) if (v.from === "any" && i.has(e.initial) && i.has(v.to) && !m.has(v.to)) {
    const w = e.states.find((_) => _.id === v.to);
    r.setEdge(e.initial, v.to, { minlen: ["completed", "canceled"].includes(w.category) ? Math.max(1, p.length - 1) : 1 }, `any:${v.id}`);
  }
  const k = e.states.flatMap((v) => (v.regions ?? []).filter((w) => i.has(w.initial)).map((w, _) => {
    const R = `lane:${v.id}:${_}`;
    return r.setEdge(v.id, w.initial, {}, R), { state: v, region: w, key: R };
  }));
  if (!u.length) return { nodes: u, edges: [], parallels: [], main: p, direction: l, width: 320, height: 160 };
  Bl.layout(r);
  for (const v of u) Object.assign(v, { x: r.node(v.state.id).x, y: r.node(v.state.id).y });
  const I = l === "TB", V = c.filter((v) => !h.has(v.key)).map((v) => r.edge({ v: v.from, w: v.transition.to, name: v.key })), x = [...u, ...V], A = Math.max(...x.map((v) => v.x + v.width / 2)), S = Math.max(...x.map((v) => v.y + v.height / 2)), oe = (v) => u.find((w) => w.state.id === v), X = c.filter((v) => h.has(v.key)).sort((v, w) => {
    const _ = I ? "y" : "x";
    return Math.abs(oe(v.from)[_] - oe(v.transition.to)[_]) - Math.abs(oe(w.from)[_] - oe(w.transition.to)[_]);
  }), K = /* @__PURE__ */ new Map(), de = Math.max(0, ...X.map((v) => v.width));
  let Q = S + 32;
  for (const [v, w] of X.entries()) {
    const _ = oe(w.from), R = oe(w.transition.to), B = I ? A + 16 + de + 28 + v * 18 : Q + w.height / 2, O = I ? A + 16 + de / 2 : (_.x + R.x) / 2;
    let N = I ? _.y + _.height / 2 + 18 : B;
    if (I) for (const C of [...K.values()].sort((G, D) => G.y - D.y))
      N + w.height / 2 + 10 > C.y - C.height / 2 - 10 && N - w.height / 2 - 10 < C.y + C.height / 2 + 10 && (N = C.y + C.height / 2 + 24 + w.height / 2);
    K.set(w.key, { x: O, y: N, corridor: B, height: w.height }), Q = B + w.height / 2 + 24;
  }
  const me = c.map((v) => ({ ...v, ...K.get(v.key) ?? r.edge({ v: v.from, w: v.transition.to, name: v.key }) })), ge = (v, w) => ({ x: v.x - v.width / 2 - w, y: v.y - v.height / 2 - w, width: v.width + w * 2, height: v.height + w * 2 }), ae = [...u.map((v) => ge(v, 12)), ...me.map((v) => ge(v, 10))], P = (v, w) => ({
    start: I ? { x: v.x, y: v.y + v.height / 2 } : { x: v.x + v.width / 2, y: v.y },
    end: I ? { x: w.x, y: w.y - w.height / 2 } : { x: w.x - w.width / 2, y: w.y }
  }), L = (v, w) => I ? { x: v.x, y: v.y + w } : { x: v.x + w, y: v.y }, T = me.map((v) => {
    const w = u.find((xe) => xe.state.id === v.from), _ = u.find((xe) => xe.state.id === v.transition.to), { start: R, end: B } = P(w, _), O = h.has(v.key), N = L(R, 18), C = L(B, -18), G = (O || !I ? v.width : v.height) / 2 + 10, D = O ? { x: v.x + (I ? -G : G), y: v.y } : L(v, -G), ne = O ? { x: v.x + (I ? G : -G), y: v.y } : L(v, G);
    let we;
    if (O) {
      const { corridor: xe } = K.get(v.key), _t = I ? { x: xe, y: v.y } : { x: N.x, y: xe }, ze = I ? { x: xe, y: C.y } : { x: C.x, y: xe };
      we = I ? [
        [R, ...Et(N, D, ae)],
        [ne, _t, ze, ...Et(ze, C, ae), B]
      ] : [
        [R, ...Et(N, _t, ae), D],
        [ne, ...Et(ze, C, ae), B]
      ];
    } else we = [
      [R, ...Et(N, D, ae)],
      [...Et(ne, C, ae), B]
    ];
    const Se = O ? "return" : m.get(v.transition.to) === (m.get(v.from) ?? -2) + 1 ? "main" : "forward";
    return { ...v, points: we.flat(), segments: we, path: we.map($a).join(" "), type: Se, targetOffset: 0 };
  }), z = k.map((v) => {
    const w = u.find((N) => N.state.id === v.state.id), _ = u.find((N) => N.state.id === v.region.initial), { start: R, end: B } = P(w, _), O = [R, ...Et(L(R, 18), L(B, -18), ae), B];
    return { state: v.state, key: v.key, points: O, path: $a(O) };
  }), J = [...u.flatMap((v) => [{ x: v.x - v.width / 2, y: v.y - v.height / 2 }, { x: v.x + v.width / 2, y: v.y + v.height / 2 }]), ...T.flatMap((v) => [...v.points, { x: v.x - v.width / 2, y: v.y - v.height / 2 }, { x: v.x + v.width / 2, y: v.y + v.height / 2 }]), ...z.flatMap((v) => v.points)], ue = 32 - Math.min(...J.map((v) => v.x)), se = 32 - Math.min(...J.map((v) => v.y)), Oe = Math.max(...J.map((v) => v.x)) + ue + 32, De = Math.max(...J.map((v) => v.y)) + se + 32, q = (v) => ({ x: v.x + ue, y: v.y + se });
  for (const v of u) Object.assign(v, q(v));
  for (const v of T)
    Object.assign(v, q(v)), v.segments = v.segments.map((w) => w.map(q)), v.points = v.segments.flat(), v.path = v.segments.map($a).join(" ");
  for (const v of z)
    v.points = v.points.map(q), v.path = $a(v.points);
  return { nodes: u, edges: T, parallels: z, main: p, direction: l, width: Oe, height: De };
}
const Ei = ["aria-label"], Ai = {
  key: 0,
  class: "kx-settings-rail-group"
}, Oi = ["aria-current", "onClick"], Pi = { class: "kx-settings-rail-label" }, Ri = /* @__PURE__ */ ke({
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
    const a = e, t = W(() => a.leadingItem ? [{ items: [a.leadingItem] }, ...a.groups] : a.groups);
    function l(o) {
      const r = [...o.currentTarget.querySelectorAll(".kx-settings-rail-item")], p = r.indexOf(o.target);
      if (p < 0) return;
      let m;
      switch (o.key) {
        case "ArrowDown":
        case "ArrowRight":
          m = (p + 1) % r.length;
          break;
        case "ArrowUp":
        case "ArrowLeft":
          m = (p + r.length - 1) % r.length;
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
    return (o, r) => (n(), H(Zt(e.title ? ui : "div"), Qo(_o(e.title ? { title: e.title, count: e.count, settings: !0 } : { class: "kx-settings-rail-standalone" })), cl({
      default: j(() => [
        d("nav", {
          class: st(["kx-settings-rail", { "kx-settings-rail-framed": e.title }]),
          "aria-label": e.label,
          onKeydown: l
        }, [
          (n(!0), b(te, null, re(t.value, (p, m) => (n(), b("div", {
            key: p.items[0]?.value ?? m,
            class: st(["kx-settings-rail-section", { "kx-settings-rail-leading": e.leadingItem && m === 0 }])
          }, [
            p.heading ? (n(), b("div", Ai, E(p.heading), 1)) : U("", !0),
            (n(!0), b(te, null, re(p.items, (u) => (n(), b("button", {
              key: u.value,
              type: "button",
              class: "kx-settings-rail-item",
              "aria-current": u.value === e.value ? "true" : void 0,
              onClick: (i) => o.$emit("update:value", u.value)
            }, [
              u.icon ? (n(), H(s(ce), {
                key: 0,
                class: "kx-settings-rail-icon",
                icon: u.icon,
                "aria-hidden": "true"
              }, null, 8, ["icon"])) : U("", !0),
              d("span", Pi, E(u.label), 1)
            ], 8, Oi))), 128))
          ], 2))), 128))
        ], 42, Ei)
      ]),
      _: 2
    }, [
      e.title && o.$slots.actions ? {
        name: "actions",
        fn: j(() => [
          et(o.$slots, "actions")
        ]),
        key: "0"
      } : void 0
    ]), 1040));
  }
}), yo = Symbol("work-navigation");
function Ni() {
  return ei(yo, () => {
  });
}
function Mi(e) {
  if (e.name === "boards") return "";
  const a = encodeURIComponent(e.board);
  return e.name === "settings" ? `${a}/settings` : a;
}
const Wt = (e) => `/api/v1/work/boards/${encodeURIComponent(e)}`, ql = (e) => ({ declaration: e.declaration, expected_generation: e.expected_generation, plugin_configs: e.plugin_configs }), $t = {
  packPlan: (e, a) => zt(`${Wt(e)}/pack_plan`, a, "Pack plan"),
  packApply: (e, a, t) => zt(`${Wt(e)}/pack_apply`, { ...a, key: t }, "Apply pack"),
  plan: (e, a) => zt(`${Wt(e)}/plan_schema`, ql(a), "Schema plan"),
  apply: (e, a, t) => zt(`${Wt(e)}/apply_schema`, { ...ql(a), key: t }, "Apply schema"),
  resume: (e) => zt(`${Wt(e)}/resume_migration`, {}, "Resume migration"),
  configure: (e, a, t) => zt(`${Wt(e)}/configure_plugin`, { plugin: a, ...t === void 0 ? {} : { config: t } }, "Configure plugin")
}, xl = /* @__PURE__ */ ke({
  __name: "ContentAction",
  props: {
    as: { default: "button" },
    disabled: { type: Boolean },
    role: { default: "button" }
  },
  emits: ["activate"],
  setup(e, { emit: a }) {
    const t = e, l = a;
    function o(p) {
      if (t.disabled || p.defaultPrevented) return;
      const m = p.target;
      if (m instanceof Element && m !== p.currentTarget) {
        const u = m.closest('[data-work-action], button, a, input, textarea, [role="combobox"], [role="checkbox"], [role="switch"], details');
        if (u && u !== p.currentTarget) return;
      }
      l("activate", p);
    }
    function r(p) {
      p.target !== p.currentTarget || !["Enter", " "].includes(p.key) || (p.preventDefault(), t.disabled || l("activate", p));
    }
    return (p, m) => (n(), H(Zt(e.as), {
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
      default: j(() => [
        et(p.$slots, "default")
      ]),
      _: 3
    }, 40, ["type", "role", "tabindex", "disabled", "aria-disabled"]));
  }
}), Fi = { class: "work-definition" }, Li = {
  key: 0,
  class: "work-definition-handle"
}, Bi = ["title"], zi = { class: "work-definition-details" }, ji = { class: "work-definition-code" }, Wi = ["title"], qi = { class: "work-definition-kind" }, Ki = { class: "work-definition-flags" }, Gi = { class: "work-definition-usage" }, Hi = { class: "work-definition-actions" }, Yi = {
  key: 1,
  class: "work-definition-description"
}, Xi = ["inert"], ja = /* @__PURE__ */ ke({
  __name: "DefinitionRow",
  props: {
    title: {},
    code: {},
    kind: {},
    description: {},
    initialOpen: { type: Boolean }
  },
  setup(e) {
    const t = M(!!e.initialOpen), l = ti();
    return (o, r) => (n(), b("article", Fi, [
      d("header", {
        class: st(["work-definition-head", { "work-definition-has-handle": s(l).handle }])
      }, [
        s(l).handle ? (n(), b("div", Li, [
          et(o.$slots, "handle")
        ])) : U("", !0),
        g(xl, {
          class: "work-definition-toggle",
          "aria-expanded": t.value,
          onActivate: r[0] || (r[0] = (p) => t.value = !t.value)
        }, {
          default: j(() => [
            g(s(ce), {
              icon: "tabler:chevron-right",
              "aria-hidden": "true"
            }),
            d("span", {
              class: "work-row-title",
              title: e.title
            }, E(e.title), 9, Bi)
          ]),
          _: 1
        }, 8, ["aria-expanded"]),
        d("div", zi, [
          d("span", ji, [
            e.code ? (n(), b("code", {
              key: 0,
              class: "work-mono",
              title: e.code
            }, E(e.code), 9, Wi)) : U("", !0)
          ]),
          d("span", qi, [
            e.kind ? (n(), H(s(Ye), {
              key: 0,
              severity: "secondary",
              value: e.kind
            }, null, 8, ["value"])) : U("", !0)
          ]),
          d("span", Ki, [
            et(o.$slots, "flags")
          ]),
          d("div", Gi, [
            et(o.$slots, "usage")
          ])
        ]),
        d("div", Hi, [
          et(o.$slots, "actions")
        ]),
        e.description ? (n(), b("p", Yi, E(e.description), 1)) : U("", !0)
      ], 2),
      g(ro, {
        name: "work-panel",
        persisted: ""
      }, {
        default: j(() => [
          ct(d("div", {
            inert: !t.value,
            class: "work-definition-body work-stack"
          }, [
            et(o.$slots, "default")
          ], 8, Xi), [
            [Vt, t.value]
          ])
        ]),
        _: 3
      })
    ]));
  }
}), Ji = { class: "work-definition-scroll" }, Zi = {
  key: 0,
  class: "work-definition-columns",
  "aria-hidden": "true"
}, Qi = {
  key: 0,
  class: "work-definition-code"
}, _i = { key: 1 }, en = {
  key: 2,
  class: "work-definition-usage"
}, Wa = /* @__PURE__ */ ke({
  __name: "DefinitionList",
  props: {
    count: {},
    columns: {}
  },
  setup(e) {
    return (a, t) => (n(), b("div", Ji, [
      d("div", {
        class: st(["work-field-builder", "work-definitions-" + e.columns])
      }, [
        e.count > 3 ? (n(), b("div", Zi, [
          t[0] || (t[0] = d("span", null, null, -1)),
          t[1] || (t[1] = d("span", null, "Name", -1)),
          e.columns !== "plugins" ? (n(), b("span", Qi, "Identifier")) : U("", !0),
          d("span", null, E(e.columns === "plugins" ? "State" : e.columns === "types" ? "Workflow" : "Kind"), 1),
          e.columns === "fields" || e.columns === "plugins" ? (n(), b("span", _i, "Details")) : U("", !0),
          e.columns !== "plugins" ? (n(), b("span", en, E(e.columns === "fields" ? "Used by" : "Details"), 1)) : U("", !0),
          t[2] || (t[2] = d("span", null, null, -1))
        ])) : U("", !0),
        et(a.$slots, "default")
      ], 2)
    ]));
  }
}), tn = [
  { code: "key", form: "text", index: "key" },
  { code: "type", form: "text", index: "key" },
  { code: "state", form: "text", index: "key" },
  { code: "category", form: "text", index: "key" },
  { code: "rank", form: "text", index: "key" },
  { code: "parent", form: "text", index: "key" },
  { code: "created_at", form: "time", index: "key" },
  { code: "updated_at", form: "time", index: "key" }
];
function an(e) {
  const a = e.compiled.processes?.flatMap((t) => t.states.map((l) => ({ id: l.id, label: l.name }))) ?? [];
  return [...tn.filter((t) => t.code !== "rank").map((t) => t.code === "state" ? { ...t, type: "option", options: a } : t.code === "category" ? { ...t, type: "option", options: ["triage", "backlog", "unstarted", "started", "completed", "canceled"].map((l) => ({ id: l })) } : t), ...(e.compiled.fields ?? []).filter((t) => t.index && t.index !== "none")];
}
function ln(e) {
  if (e?.cardinality && e.cardinality !== "one") return ["has", "in", "nin", "is_null", ...e.type === "principal" ? ["member_of"] : []];
  const a = ["eq", "neq", "in", "nin", "is_null", ...e?.type === "principal" ? ["member_of"] : []];
  return e && (["int", "number", "dec", "time", "quantity"].includes(e.form ?? "") || e.index === "number") && a.push("lt", "lte", "gt", "gte", "between"), e?.form === "text" && e.type !== "option" && a.push("contains", "starts_with"), a;
}
const on = { class: "work-field-control" }, nn = ["id"], sn = {
  key: 1,
  class: "work-stack work-tight"
}, rn = { class: "work-chips" }, dn = {
  key: 5,
  class: "work-row"
}, un = ["inert"], cn = ["value"], vn = {
  key: 1,
  class: "work-muted"
}, mn = ["inert"], fn = ["value"], pn = {
  key: 1,
  class: "work-muted"
}, bn = {
  key: 11,
  class: "work-stack work-tight"
}, hn = {
  class: "work-stack work-tight",
  "aria-label": "Matching items"
}, gn = { class: "work-mono" }, yn = {
  key: 15,
  class: "work-error work-small",
  role: "alert"
}, ko = /* @__PURE__ */ ke({
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
    const t = e, l = a, o = W(() => t.inputId ?? `field-${t.field.code}`), r = W(() => !!t.field.cardinality && t.field.cardinality !== "one"), p = W(() => Array.isArray(t.modelValue) ? t.modelValue : []), m = W(() => t.modelValue == null ? "" : typeof t.modelValue == "object" ? jt(t.modelValue) : String(t.modelValue)), u = W(() => {
      const v = t.modelValue;
      return v && typeof v == "object" && "ref" in v && Array.isArray(v.ref) ? String(v.ref[1] ?? "") : "";
    }), i = W(() => t.disabled || zl(t.field)), c = M(!1), f = M(!1), y = M(!1), h = M(""), $ = M(""), k = M([]), I = da(), V = M([]);
    let x = 0, A;
    const S = /* @__PURE__ */ new Set();
    Ie(p, (v) => {
      V.value = A ?? v.map((w, _) => V.value[_] ?? x++), A = void 0;
    }, { immediate: !0 });
    function oe(v) {
      l("update:modelValue", v);
    }
    function X(v, w) {
      const _ = [...p.value];
      _[v] = w, oe(_);
    }
    function K(v, w) {
      w ? S.delete(v) : S.add(v), l("validity", !S.size);
    }
    function de(v) {
      S.delete(V.value[v]), l("validity", !S.size), A = V.value.filter((w, _) => _ !== v), oe(p.value.filter((w, _) => _ !== v));
    }
    function Q() {
      A = [...V.value, x++], oe([...p.value, t.field.form === "bool" ? !1 : t.field.form === "record" ? {} : ""]);
    }
    function me(v) {
      const w = v.detail, _ = w?.principal_id ?? w?.id;
      oe(_ ? { kind: w.type ?? "user", id: _ } : void 0);
    }
    function ge(v) {
      const w = v.detail;
      oe(w?.thread_id ? { ref: ["component", w.thread_id] } : void 0);
    }
    const ae = M("");
    let P = "";
    Ie(() => t.modelValue, (v) => {
      const w = JSON.stringify(v ?? {}, null, 2);
      w !== P && (P = w, ae.value = w, h.value = "", l("validity", !0));
    }, { immediate: !0 });
    function L(v) {
      ae.value = v;
      try {
        const w = JSON.parse(v);
        if (!w || typeof w != "object" || Array.isArray(w)) throw new Error("Enter a JSON object.");
        if (t.field.type === "rich_text" && !("type" in w && typeof w.type == "string")) throw new Error("The document needs a type.");
        P = JSON.stringify(w, null, 2), h.value = "", l("validity", !0), oe(w);
      } catch (w) {
        h.value = w instanceof Error ? w.message : "Invalid JSON.", l("validity", !1);
      }
    }
    function T(v) {
      if (!v) {
        l("validity", !0), oe(void 0);
        return;
      }
      const w = Number.isFinite(Number(v)) && (t.field.form !== "int" || Number.isSafeInteger(Number(v)));
      l("validity", w), w && oe(t.field.form === "int" ? Number(v) : v);
    }
    const z = W(() => t.field.config?.format === "date");
    function J(v) {
      oe(v ? z.value ? v : new Date(v).toISOString() : void 0);
    }
    const ue = W(() => {
      if (typeof t.modelValue != "string") return "";
      if (z.value) return t.modelValue.slice(0, 10);
      const v = new Date(t.modelValue);
      return Number.isNaN(v.getTime()) ? "" : new Date(v.getTime() - v.getTimezoneOffset() * 6e4).toISOString().slice(0, 16);
    });
    function se(v) {
      oe(v.detail?.ref);
    }
    function Oe(v) {
      oe(v.detail?.value);
    }
    let De;
    Ie($, () => {
      const v = I();
      if (clearTimeout(De), !$.value.trim()) {
        k.value = [];
        return;
      }
      De = setTimeout(async () => {
        try {
          const w = $.value.trim(), _ = /^[A-Z][A-Z0-9]{1,9}-[0-9]+$/.test(w) ? [(await bt.item(t.boardId, { key: w })).item] : (await bt.query(t.boardId, { where: { field: "title", op: "contains", value: w }, limit: 8 })).items;
          v() && (k.value = _, h.value = "");
        } catch (w) {
          v() && (h.value = lt(w, "Could not search items."));
        }
      }, 200);
    });
    function q(v) {
      oe({ board: t.boardId, item: v.id }), $.value = "", k.value = [];
    }
    pa(async () => {
      t.field.type === "principal" ? c.value = await Tt("wc-principal-picker") : t.field.config?.target === "component" && (c.value = await Tt("wc-component-picker"));
    });
    for (const [v, w] of [[() => t.editorTag, y], [() => t.linkTag, f]])
      Ie(v, async (_, R, B) => {
        let O = !0;
        if (B(() => {
          O = !1;
        }), w.value = !1, _) {
          const N = await Tt(_);
          O && (w.value = N);
        }
      }, { immediate: !0 });
    return Vl(() => {
      clearTimeout(De), I();
    }), (v, w) => {
      const _ = uo("FieldControl", !0);
      return n(), b("div", on, [
        s(zl)(e.field) ? (n(), b("output", {
          key: 0,
          id: o.value,
          class: "work-read-value"
        }, E(s(jt)(e.modelValue, e.field)), 9, nn)) : r.value ? (n(), b("div", sn, [
          d("div", rn, [
            (n(!0), b(te, null, re(p.value, (R, B) => (n(), H(s(Ye), {
              key: V.value[B],
              class: "kx-tag-sm",
              severity: "secondary"
            }, {
              default: j(() => [
                F(E(s(jt)(R, e.field)) + " ", 1),
                g(s(Z), {
                  type: "button",
                  class: "work-icon-button",
                  disabled: i.value,
                  "aria-label": "Remove value " + (B + 1),
                  onClick: (O) => de(B),
                  severity: "secondary",
                  text: "",
                  size: "small"
                }, {
                  default: j(() => [
                    g(s(ce), {
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
          (n(!0), b(te, null, re(p.value, (R, B) => (n(), b("div", {
            key: V.value[B],
            class: "work-stack work-tight"
          }, [
            g(_, {
              "board-id": e.boardId,
              field: { ...e.field, cardinality: "one" },
              "model-value": R,
              "input-id": o.value + "-" + V.value[B],
              disabled: i.value,
              "editor-tag": e.editorTag,
              "link-tag": e.linkTag,
              "onUpdate:modelValue": (O) => X(B, O),
              onValidity: (O) => K(V.value[B], O)
            }, null, 8, ["board-id", "field", "model-value", "input-id", "disabled", "editor-tag", "link-tag", "onUpdate:modelValue", "onValidity"])
          ]))), 128)),
          g(s(Z), {
            label: "Add value",
            severity: "secondary",
            size: "small",
            disabled: i.value,
            onClick: Q,
            outlined: ""
          }, {
            icon: j(() => [
              g(s(ce), {
                icon: "tabler:plus",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled"])
        ])) : e.editorTag && y.value ? (n(), H(Zt(e.editorTag), {
          key: 2,
          "board-id": e.boardId,
          value: JSON.stringify(e.modelValue ?? null),
          config: JSON.stringify(e.field.config ?? {}),
          readonly: i.value || void 0,
          onChange: Oe
        }, null, 40, ["board-id", "value", "config", "readonly"])) : e.linkTag && f.value ? (n(), H(Zt(e.linkTag), {
          key: 3,
          "board-id": e.boardId,
          kind: e.field.config?.target ?? e.field.type,
          value: JSON.stringify(e.modelValue ?? null),
          readonly: i.value || void 0,
          onChange: se
        }, null, 40, ["board-id", "kind", "value", "readonly"])) : e.field.type === "option" ? (n(), H(s(ve), {
          key: 4,
          placeholder: "Not set",
          inputId: o.value,
          "model-value": e.modelValue ?? "",
          disabled: i.value,
          "onUpdate:modelValue": w[0] || (w[0] = (R) => oe(R || void 0)),
          appendTo: "self",
          optionLabel: "label",
          optionValue: "value",
          optionDisabled: "disabled",
          options: [{ label: "Not set", value: "", disabled: !1 }, ...(e.field.options ?? []).map((R) => ({ label: R.label ?? R.id, value: R.id, disabled: !1 }))]
        }, null, 8, ["inputId", "model-value", "disabled", "options"])) : e.field.form === "bool" ? (n(), b("label", dn, [
          g(s(Lt), {
            inputId: o.value,
            "model-value": e.modelValue === !0,
            disabled: i.value,
            "onUpdate:modelValue": w[1] || (w[1] = (R) => oe(R)),
            binary: ""
          }, null, 8, ["inputId", "model-value", "disabled"]),
          F(E(e.modelValue === !0 ? "Yes" : e.modelValue === !1 ? "No" : "Not set"), 1)
        ])) : e.field.form === "int" ? (n(), H(s(ht), {
          key: 6,
          inputId: o.value,
          "model-value": m.value === "" ? null : Number(m.value),
          disabled: i.value,
          "onUpdate:modelValue": w[2] || (w[2] = (R) => T(R == null ? "" : String(R))),
          useGrouping: !1
        }, null, 8, ["inputId", "model-value", "disabled"])) : e.field.form === "dec" ? (n(), H(s(ye), {
          key: 7,
          id: o.value,
          inputmode: "decimal",
          "model-value": m.value,
          disabled: i.value,
          "onUpdate:modelValue": w[3] || (w[3] = (R) => T(R ?? ""))
        }, null, 8, ["id", "model-value", "disabled"])) : e.field.form === "time" ? (n(), H(s(ye), {
          key: 8,
          id: o.value,
          type: z.value ? "date" : "datetime-local",
          value: ue.value,
          disabled: i.value,
          onInput: w[4] || (w[4] = (R) => J(R.target.value))
        }, null, 8, ["id", "type", "value", "disabled"])) : e.field.type === "principal" ? (n(), b("div", {
          key: 9,
          inert: i.value || void 0,
          class: "work-stack work-tight"
        }, [
          c.value ? (n(), b("wc-principal-picker", {
            key: 0,
            value: JSON.stringify(e.modelValue ?? {}),
            kinds: "user,group",
            onConfigChanged: me
          }, null, 40, cn)) : (n(), b("span", vn, E(s(jt)(e.modelValue, e.field)) + " · Person picker is unavailable.", 1))
        ], 8, un)) : e.field.config?.target === "component" ? (n(), b("div", {
          key: 10,
          inert: i.value || void 0
        }, [
          c.value ? (n(), b("wc-component-picker", {
            key: 0,
            value: JSON.stringify({ thread_id: u.value }),
            onChange: ge
          }, null, 40, fn)) : (n(), b("span", pn, "Component picker is unavailable."))
        ], 8, mn)) : e.field.type === "item" ? (n(), b("div", bn, [
          g(s(Ye), {
            class: "kx-tag-sm",
            severity: "secondary"
          }, {
            default: j(() => [
              F(E(s(jt)(e.modelValue, e.field)), 1)
            ]),
            _: 1
          }),
          g(s(ye), {
            id: o.value,
            modelValue: $.value,
            "onUpdate:modelValue": w[5] || (w[5] = (R) => $.value = R),
            disabled: i.value,
            placeholder: "Search a title or enter an item key",
            "aria-label": "Search items"
          }, null, 8, ["id", "modelValue", "disabled"]),
          d("div", hn, [
            (n(!0), b(te, null, re(k.value, (R) => (n(), H(xl, {
              key: R.id,
              class: "work-match-item",
              disabled: i.value,
              onActivate: (B) => q(R)
            }, {
              default: j(() => [
                d("code", gn, E(R.key), 1),
                d("span", null, E(s(jt)(R.values.title)), 1)
              ]),
              _: 2
            }, 1032, ["disabled", "onActivate"]))), 128))
          ]),
          e.modelValue ? (n(), H(s(Z), {
            key: 0,
            label: "Clear reference",
            severity: "secondary",
            size: "small",
            disabled: i.value,
            onClick: w[6] || (w[6] = (R) => oe(void 0)),
            outlined: ""
          }, {
            icon: j(() => [
              g(s(ce), {
                icon: "tabler:list-check",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled"])) : U("", !0)
        ])) : e.field.form === "record" || e.field.type === "rich_text" || e.field.form === "quantity" || e.field.form === "ref" ? (n(), H(s(Pa), {
          key: 12,
          id: o.value,
          "model-value": ae.value,
          rows: "3",
          disabled: i.value,
          "aria-invalid": !!h.value,
          "onUpdate:modelValue": w[7] || (w[7] = (R) => L(R ?? ""))
        }, null, 8, ["id", "model-value", "disabled", "aria-invalid"])) : e.field.code === "description" ? (n(), H(s(Pa), {
          key: 13,
          id: o.value,
          "model-value": m.value,
          rows: "4",
          disabled: i.value,
          "onUpdate:modelValue": w[8] || (w[8] = (R) => oe(R))
        }, null, 8, ["id", "model-value", "disabled"])) : (n(), H(s(ye), {
          key: 14,
          id: o.value,
          "model-value": m.value,
          disabled: i.value,
          "onUpdate:modelValue": w[9] || (w[9] = (R) => oe(R))
        }, null, 8, ["id", "model-value", "disabled"])),
        h.value ? (n(), b("span", yn, E(h.value), 1)) : U("", !0)
      ]);
    };
  }
}), kn = { class: "work-stack work-tight work-operand-control" }, wn = { class: "work-row work-small" }, Vn = {
  key: 1,
  class: "work-muted work-small"
}, $n = {
  key: 2,
  class: "work-stack work-tight"
}, xn = { class: "work-small" }, Cn = {
  key: 0,
  class: "work-error work-small",
  role: "alert"
}, la = /* @__PURE__ */ ke({
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
    const t = e, l = a, o = W(() => "$actor" in Ft(t.modelValue) ? "actor" : "$now" in Ft(t.modelValue) ? "now" : "literal"), r = M(""), p = M("");
    Ie(() => t.modelValue, (i) => {
      r.value = JSON.stringify(i ?? []), p.value = "";
    }, { immediate: !0 });
    function m(i) {
      l("update:modelValue", i === "actor" ? { $actor: "id" } : i === "now" ? { $now: "P0D" } : void 0), l("validity", !0);
    }
    function u(i) {
      r.value = i;
      try {
        const c = JSON.parse(i);
        if (!Array.isArray(c)) throw new Error("Enter a JSON list.");
        p.value = "", l("validity", !0), l("update:modelValue", c);
      } catch (c) {
        p.value = c instanceof Error ? c.message : "Invalid values.", l("validity", !1);
      }
    }
    return (i, c) => (n(), b("div", kn, [
      d("label", wn, [
        F(E(e.label), 1),
        g(s(ve), {
          "aria-label": e.label + " operand",
          "model-value": o.value,
          disabled: e.disabled,
          "onUpdate:modelValue": c[0] || (c[0] = (f) => m(f)),
          appendTo: "self",
          optionLabel: "label",
          optionValue: "value",
          optionDisabled: "disabled",
          options: [{ label: "Value", value: "literal", disabled: !1 }, { label: "Current actor ($actor)", value: "actor", disabled: !1 }, { label: "Current time ($now)", value: "now", disabled: !1 }]
        }, null, 8, ["aria-label", "model-value", "disabled"])
      ]),
      o.value === "now" ? (n(), H(s(ye), {
        key: 0,
        "aria-label": e.label + " time offset",
        value: s(Ft)(e.modelValue).$now,
        disabled: e.disabled,
        placeholder: "-P7D",
        onInput: c[1] || (c[1] = (f) => l("update:modelValue", { $now: f.target.value }))
      }, null, 8, ["aria-label", "value", "disabled"])) : o.value === "actor" ? (n(), b("span", Vn, "The signed-in actor’s id")) : e.multiple ? (n(), b("div", $n, [
        d("label", xn, [
          c[5] || (c[5] = F("Values as JSON (operands may appear in the list)", -1)),
          g(s(Pa), {
            class: "work-mono",
            "aria-label": e.label + " values",
            value: r.value,
            disabled: e.disabled,
            rows: "2",
            onInput: c[2] || (c[2] = (f) => u(f.target.value))
          }, null, 8, ["aria-label", "value", "disabled"])
        ]),
        p.value ? (n(), b("p", Cn, E(p.value), 1)) : U("", !0)
      ])) : (n(), H(ko, {
        key: 3,
        "board-id": e.boardId,
        field: { ...e.field, cardinality: "one" },
        "model-value": e.modelValue,
        disabled: e.disabled,
        "input-id": e.label.replace(/[^a-z0-9]/gi, "-"),
        "onUpdate:modelValue": c[3] || (c[3] = (f) => l("update:modelValue", f)),
        onValidity: c[4] || (c[4] = (f) => l("validity", f))
      }, null, 8, ["board-id", "field", "model-value", "disabled", "input-id"]))
    ]));
  }
}), Sn = ["disabled"], Tn = { class: "work-small work-mono" }, In = { class: "work-row work-small" }, Dn = { class: "work-row work-wrap" }, Un = { key: 3 }, En = { class: "work-row work-wrap" }, An = { class: "work-row" }, On = { class: "work-row" }, Pn = { class: "work-row" }, Rn = {
  key: 3,
  class: "work-row work-wrap"
}, Nn = { class: "work-row work-wrap" }, Mn = /* @__PURE__ */ ke({
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
    const t = e, l = a, o = W(() => t.path ?? "where"), r = W(() => t.depth ?? 1), p = W(() => ["and", "or", "not", "history", "match", "rel", "children"].find((ae) => ae in t.modelValue) ?? "field"), m = W(() => an(t.schema)), u = W(() => m.value.find((ae) => ae.code === t.modelValue.field) ?? { code: "value", form: "text" }), i = W(() => Ft(t.modelValue.history)), c = W(() => m.value.find((ae) => ae.code === i.value.field) ?? { code: "history", form: "text" }), f = W(() => Array.isArray(t.modelValue[p.value]) ? t.modelValue[p.value] : []), y = {
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
    }, h = {
      field: "Field value",
      and: "All conditions",
      or: "Any condition",
      not: "Condition is false",
      history: "Value history",
      rel: "Linked items",
      children: "Child items",
      match: "Search text"
    }, $ = () => ({ field: "category", op: "eq", value: "unstarted" }), k = M(/* @__PURE__ */ new Set());
    function I(ae, P) {
      P ? k.value.delete(ae) : k.value.add(ae), l("validity", k.value.size === 0);
    }
    Ie(p, () => {
      k.value.clear(), l("validity", !0);
    });
    function V(ae) {
      const P = /* @__PURE__ */ new Set();
      for (const L of k.value) {
        const T = Number(L);
        !Number.isNaN(T) && T !== ae && P.add(String(T > ae ? T - 1 : T));
      }
      k.value = P, l("validity", P.size === 0), A({ [p.value]: f.value.filter((L, T) => T !== ae) });
    }
    function x(ae) {
      l("update:modelValue", ae);
    }
    function A(ae) {
      x({ ...t.modelValue, ...ae });
    }
    function S(ae) {
      x(ae === "field" ? $() : ae === "and" || ae === "or" ? { [ae]: [$()] } : ae === "not" ? { not: $() } : ae === "history" ? { history: { field: "state", changed: !0 } } : ae === "match" ? { match: "" } : ae === "children" ? { children: !0, q: "some", where: $() } : { rel: t.schema.compiled.relation_types?.[0]?.id ?? "", dir: "outward", q: "some", where: $() });
    }
    function oe(ae, P) {
      A({ [p.value]: f.value.map((L, T) => T === ae ? P : L) });
    }
    function X(ae, P) {
      const L = { ...i.value };
      P === void 0 ? (delete L[ae], I(ae, !0)) : L[ae] = P, A({ history: L });
    }
    function K(ae) {
      k.value.clear(), l("validity", !0);
      const P = { ...i.value };
      delete P.was, delete P.changed, delete P.from, delete P.to, P[ae] = ae === "changed" ? !0 : "", A({ history: P });
    }
    const de = { code: "actor", form: "text" }, Q = { code: "at", form: "time" }, me = W(() => Array.isArray(i.value.during) ? i.value.during : []);
    function ge(ae, P) {
      const L = [...me.value];
      L[ae] = P, X("during", L);
    }
    return (ae, P) => {
      const L = uo("FilterNode", !0);
      return n(), b("fieldset", {
        class: "work-filter-node",
        disabled: e.disabled
      }, [
        d("legend", Tn, E(o.value), 1),
        d("label", In, [
          P[21] || (P[21] = F("Condition", -1)),
          g(s(ve), {
            "aria-label": o.value + " condition",
            "model-value": p.value,
            "onUpdate:modelValue": P[0] || (P[0] = (T) => S(T)),
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            optionDisabled: "disabled",
            options: Object.entries(h).map(([T, z]) => ({ label: z, value: T, disabled: r.value >= 6 && ["and", "or", "not", "rel", "children"].includes(T) }))
          }, null, 8, ["aria-label", "model-value", "options"])
        ]),
        p.value === "and" || p.value === "or" ? (n(), b(te, { key: 0 }, [
          (n(!0), b(te, null, re(f.value, (T, z) => (n(), b("div", {
            key: z,
            class: "work-stack work-tight"
          }, [
            g(L, {
              "board-id": e.boardId,
              schema: e.schema,
              "model-value": T,
              path: o.value + "." + p.value + "[" + z + "]",
              depth: r.value + 1,
              "onUpdate:modelValue": (J) => oe(z, J),
              onValidity: (J) => I(String(z), J)
            }, null, 8, ["board-id", "schema", "model-value", "path", "depth", "onUpdate:modelValue", "onValidity"]),
            g(s(Z), {
              label: "Remove condition",
              size: "small",
              severity: "secondary",
              onClick: (J) => V(z),
              outlined: ""
            }, {
              icon: j(() => [
                g(s(ce), {
                  icon: "tabler:trash",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["onClick"])
          ]))), 128)),
          g(s(Z), {
            label: "Add condition",
            size: "small",
            severity: "secondary",
            disabled: r.value >= 6,
            onClick: P[1] || (P[1] = (T) => A({ [p.value]: [...f.value, $()] })),
            outlined: ""
          }, {
            icon: j(() => [
              g(s(ce), {
                icon: "tabler:plus",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled"])
        ], 64)) : p.value === "not" ? (n(), H(L, {
          key: 1,
          "board-id": e.boardId,
          schema: e.schema,
          "model-value": s(Ft)(e.modelValue.not),
          path: o.value + ".not",
          depth: r.value + 1,
          "onUpdate:modelValue": P[2] || (P[2] = (T) => A({ not: T })),
          onValidity: P[3] || (P[3] = (T) => I("nested", T))
        }, null, 8, ["board-id", "schema", "model-value", "path", "depth"])) : p.value === "field" ? (n(), b(te, { key: 2 }, [
          d("div", Dn, [
            d("label", null, [
              P[22] || (P[22] = F("Field", -1)),
              g(s(ve), {
                "aria-label": o.value + " field",
                "model-value": e.modelValue.field,
                "onUpdate:modelValue": P[4] || (P[4] = (T) => A({ field: T, op: "eq", value: void 0 })),
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                optionDisabled: "disabled",
                options: [...(m.value ?? []).map((T) => ({ label: s(Ge)(T), value: T.code, disabled: !1 }))]
              }, null, 8, ["aria-label", "model-value", "options"])
            ]),
            d("label", null, [
              P[23] || (P[23] = F("Comparison", -1)),
              g(s(ve), {
                "aria-label": o.value + " operator",
                "model-value": e.modelValue.op,
                "onUpdate:modelValue": P[5] || (P[5] = (T) => A({ op: T, value: T === "is_null" ? !0 : void 0 })),
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                options: s(ln)(u.value).map((T) => ({ value: T, label: y[T] }))
              }, null, 8, ["aria-label", "model-value", "options"])
            ])
          ]),
          g(la, {
            "board-id": e.boardId,
            field: e.modelValue.op === "is_null" ? { code: "null", form: "bool" } : u.value,
            "model-value": e.modelValue.value,
            multiple: ["in", "nin", "between"].includes(String(e.modelValue.op)),
            label: o.value + " value",
            "onUpdate:modelValue": P[6] || (P[6] = (T) => A({ value: T })),
            onValidity: P[7] || (P[7] = (T) => I("value", T))
          }, null, 8, ["board-id", "field", "model-value", "multiple", "label"])
        ], 64)) : p.value === "match" ? (n(), b("label", Un, [
          P[24] || (P[24] = F("Search", -1)),
          g(s(ye), {
            "aria-label": o.value + " search",
            value: e.modelValue.match,
            onInput: P[8] || (P[8] = (T) => A({ match: T.target.value }))
          }, null, 8, ["aria-label", "value"])
        ])) : p.value === "history" ? (n(), b(te, { key: 4 }, [
          d("div", En, [
            d("label", null, [
              P[25] || (P[25] = F("Field", -1)),
              g(s(ve), {
                "aria-label": o.value + " history field",
                "model-value": i.value.field,
                "onUpdate:modelValue": P[9] || (P[9] = (T) => X("field", T)),
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                optionDisabled: "disabled",
                options: [...(m.value ?? []).map((T) => ({ label: s(Ge)(T), value: T.code, disabled: !1 }))]
              }, null, 8, ["aria-label", "model-value", "options"])
            ]),
            d("label", null, [
              P[26] || (P[26] = F("History", -1)),
              g(s(ve), {
                "aria-label": o.value + " history mode",
                "model-value": i.value.changed ? "changed" : "was",
                "onUpdate:modelValue": P[10] || (P[10] = (T) => K(T)),
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                optionDisabled: "disabled",
                options: [{ label: "Changed", value: "changed", disabled: !1 }, { label: "Was", value: "was", disabled: !1 }]
              }, null, 8, ["aria-label", "model-value"])
            ])
          ]),
          i.value.changed ? (n(), b(te, { key: 0 }, re(["from", "to"], (T) => d("div", { key: T }, [
            d("label", An, [
              g(s(Lt), {
                "model-value": T in i.value,
                "aria-label": "Constrain " + T,
                "onUpdate:modelValue": (z) => X(T, z ? "" : void 0),
                binary: ""
              }, null, 8, ["model-value", "aria-label", "onUpdate:modelValue"]),
              F(E(T), 1)
            ]),
            T in i.value ? (n(), H(la, {
              key: 0,
              "board-id": e.boardId,
              field: c.value,
              "model-value": i.value[T],
              label: o.value + " history " + T,
              "onUpdate:modelValue": (z) => X(T, z),
              onValidity: (z) => I(T, z)
            }, null, 8, ["board-id", "field", "model-value", "label", "onUpdate:modelValue", "onValidity"])) : U("", !0)
          ])), 64)) : (n(), H(la, {
            key: 1,
            "board-id": e.boardId,
            field: c.value,
            "model-value": i.value.was,
            label: o.value + " history was",
            "onUpdate:modelValue": P[11] || (P[11] = (T) => X("was", T)),
            onValidity: P[12] || (P[12] = (T) => I("was", T))
          }, null, 8, ["board-id", "field", "model-value", "label"])),
          d("label", On, [
            g(s(Lt), {
              "model-value": "by" in i.value,
              "aria-label": "Constrain actor",
              "onUpdate:modelValue": P[13] || (P[13] = (T) => X("by", T ? { $actor: "id" } : void 0)),
              binary: ""
            }, null, 8, ["model-value"]),
            P[27] || (P[27] = F("By actor", -1))
          ]),
          "by" in i.value ? (n(), H(la, {
            key: 2,
            "board-id": e.boardId,
            field: de,
            "model-value": i.value.by,
            label: o.value + " history by",
            "onUpdate:modelValue": P[14] || (P[14] = (T) => X("by", T))
          }, null, 8, ["board-id", "model-value", "label"])) : U("", !0),
          d("label", Pn, [
            g(s(Lt), {
              "model-value": "during" in i.value,
              "aria-label": "Constrain time window",
              "onUpdate:modelValue": P[15] || (P[15] = (T) => X("during", T ? [{ $now: "-P30D" }, { $now: "P0D" }] : void 0)),
              binary: ""
            }, null, 8, ["model-value"]),
            P[28] || (P[28] = F("During", -1))
          ]),
          "during" in i.value ? (n(), b("div", Rn, [
            (n(), b(te, null, re(["start", "end"], (T, z) => g(la, {
              key: T,
              "board-id": e.boardId,
              field: Q,
              "model-value": me.value[z],
              label: o.value + " during " + T,
              "onUpdate:modelValue": (J) => ge(z, J)
            }, null, 8, ["board-id", "model-value", "label", "onUpdate:modelValue"])), 64))
          ])) : U("", !0)
        ], 64)) : (n(), b(te, { key: 5 }, [
          d("div", Nn, [
            p.value === "rel" ? (n(), b(te, { key: 0 }, [
              d("label", null, [
                P[29] || (P[29] = F("Relation", -1)),
                g(s(ve), {
                  "model-value": e.modelValue.rel,
                  "onUpdate:modelValue": P[16] || (P[16] = (T) => A({ rel: T })),
                  appendTo: "self",
                  optionLabel: "label",
                  optionValue: "value",
                  optionDisabled: "disabled",
                  options: [...(e.schema.compiled.relation_types ?? []).map((T) => ({ label: T.outward ?? T.id, value: T.id, disabled: !1 }))]
                }, null, 8, ["model-value", "options"])
              ]),
              d("label", null, [
                P[30] || (P[30] = F("Direction", -1)),
                g(s(ve), {
                  "model-value": e.modelValue.dir,
                  "onUpdate:modelValue": P[17] || (P[17] = (T) => A({ dir: T })),
                  appendTo: "self",
                  optionLabel: "label",
                  optionValue: "value",
                  optionDisabled: "disabled",
                  options: [{ label: "Outward", value: "outward", disabled: !1 }, { label: "Inward", value: "inward", disabled: !1 }]
                }, null, 8, ["model-value"])
              ])
            ], 64)) : U("", !0),
            d("label", null, [
              P[31] || (P[31] = F("Quantifier", -1)),
              g(s(ve), {
                "model-value": e.modelValue.q,
                "onUpdate:modelValue": P[18] || (P[18] = (T) => A({ q: T })),
                appendTo: "self",
                options: ["some", "every", "none"]
              }, null, 8, ["model-value"])
            ])
          ]),
          g(L, {
            "board-id": e.boardId,
            schema: e.schema,
            "model-value": s(Ft)(e.modelValue.where),
            path: o.value + ".where",
            depth: r.value + 1,
            "onUpdate:modelValue": P[19] || (P[19] = (T) => A({ where: T })),
            onValidity: P[20] || (P[20] = (T) => I("nested", T))
          }, null, 8, ["board-id", "schema", "model-value", "path", "depth"])
        ], 64))
      ], 8, Sn);
    };
  }
}), Fn = { class: "work-stack work-tight" }, Ln = { class: "work-row work-small" }, Cl = /* @__PURE__ */ ke({
  __name: "ConditionEditor",
  props: {
    modelValue: {},
    draft: {},
    boardId: {},
    label: {}
  },
  emits: ["update:modelValue", "validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = W(() => ({ declaration: t.draft, compiled: t.draft, generation: 0, as_of: 0, key_prefix: "" })), r = /* @__PURE__ */ new Set();
    function p(u, i) {
      i ? r.delete(u) : r.add(u), l("validity", !r.size);
    }
    function m(u) {
      l("update:modelValue", u ? { field: t.draft.fields?.[0]?.code ?? "state", op: "eq" } : void 0), u || (r.clear(), l("validity", !0));
    }
    return kt(() => l("validity", !0)), (u, i) => (n(), b("section", Fn, [
      d("label", Ln, [
        g(s(Ze), {
          "model-value": e.modelValue != null,
          "aria-label": e.label,
          "onUpdate:modelValue": m
        }, null, 8, ["model-value", "aria-label"]),
        F(E(e.label), 1)
      ]),
      e.modelValue != null ? (n(), H(Mn, {
        key: 0,
        schema: o.value,
        "board-id": e.boardId ?? "",
        "model-value": s(Ft)(e.modelValue),
        path: e.label,
        "onUpdate:modelValue": i[0] || (i[0] = (c) => l("update:modelValue", c)),
        onValidity: i[1] || (i[1] = (c) => p("structured", c))
      }, null, 8, ["schema", "board-id", "model-value", "path"])) : U("", !0),
      e.modelValue != null ? (n(), H(It, {
        key: 1,
        label: e.label + " predicate",
        "model-value": e.modelValue,
        hint: "Use any predicate accepted by Work, including installed or deeply nested forms.",
        "onUpdate:modelValue": i[2] || (i[2] = (c) => l("update:modelValue", c)),
        onValidity: i[3] || (i[3] = (c) => p("raw", c))
      }, null, 8, ["label", "model-value"])) : U("", !0)
    ]));
  }
}), Bn = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, zn = ["aria-label"], jn = { class: "work-field-label" }, Wn = {
  key: 0,
  class: "work-chips"
}, qn = ["kinds"], Kn = {
  key: 2,
  class: "work-muted work-small"
}, Sl = /* @__PURE__ */ ke({
  __name: "PrincipalsPicker",
  props: {
    modelValue: {},
    label: {},
    kinds: {},
    boardId: {}
  },
  emits: ["update:modelValue"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = M(!1), r = M(0), p = W(() => t.modelValue ?? []), { principalLabel: m, rememberPrincipal: u, nameError: i } = vo(() => t.boardId ?? "", () => p.value);
    pa(async () => {
      o.value = await Tt("wc-principal-picker");
    });
    function c(f) {
      const y = f.detail, h = y?.principal_id ?? y?.id;
      if (!h) return;
      const $ = { kind: y.type ?? "user", id: h };
      y.label && u($, y.label), p.value.some((k) => k.id === h && k.kind === $.kind) || l("update:modelValue", [...p.value, $]), r.value++;
    }
    return (f, y) => (n(), b(te, null, [
      s(i) ? (n(), b("p", Bn, E(s(i)), 1)) : U("", !0),
      d("section", {
        class: "work-stack work-tight work-principals-picker",
        "aria-label": e.label
      }, [
        d("h4", jn, E(e.label), 1),
        p.value.length ? (n(), b("div", Wn, [
          (n(!0), b(te, null, re(p.value, (h, $) => (n(), H(s(Ye), {
            key: h.kind + h.id,
            severity: "secondary",
            class: "kx-tag-sm"
          }, {
            default: j(() => [
              F(E(s(m)(h)), 1),
              g(s(Z), {
                text: "",
                severity: "secondary",
                size: "small",
                "aria-label": "Remove " + s(m)(h),
                onClick: (k) => l("update:modelValue", p.value.filter((I, V) => V !== $))
              }, {
                default: j(() => [
                  g(s(ce), { icon: "tabler:x" })
                ]),
                _: 1
              }, 8, ["aria-label", "onClick"])
            ]),
            _: 2
          }, 1024))), 128))
        ])) : U("", !0),
        o.value ? (n(), b("wc-principal-picker", {
          key: r.value,
          kinds: e.kinds ?? "user,group",
          onConfigChanged: c
        }, null, 40, qn)) : (n(), b("p", Kn, "People and group picker is unavailable."))
      ], 8, zn)
    ], 64));
  }
}), Gn = { class: "work-stack work-tight" }, wo = /* @__PURE__ */ ke({
  __name: "HoldersPicker",
  props: {
    modelValue: {},
    label: {},
    boardId: {}
  },
  emits: ["update:modelValue", "validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = W(() => (t.modelValue ?? []).flatMap((p) => "user" in p ? [{ kind: "user", id: p.user }] : "group" in p ? [{ kind: "group", id: p.group }] : []));
    function r(p) {
      const m = [...(t.modelValue ?? []).filter((u) => "field" in u || "service" in u), ...p.map((u) => u.kind === "group" ? { group: u.id } : { user: u.id })];
      l("update:modelValue", m.length ? m : void 0);
    }
    return (p, m) => (n(), b("div", Gn, [
      g(Sl, {
        "board-id": e.boardId,
        label: e.label,
        "model-value": o.value,
        "onUpdate:modelValue": r
      }, null, 8, ["board-id", "label", "model-value"]),
      g(It, {
        label: e.label + " rules",
        "model-value": e.modelValue,
        shape: "array",
        example: [{ group: "selected-group" }],
        "onUpdate:modelValue": m[0] || (m[0] = (u) => l("update:modelValue", u)),
        onValidity: m[1] || (m[1] = (u) => l("validity", u))
      }, null, 8, ["label", "model-value"])
    ]));
  }
}), Hn = ["disabled"], Yn = { class: "work-chips" }, Xn = {
  key: 1,
  class: "work-muted work-small"
}, rt = /* @__PURE__ */ ke({
  __name: "ChipPicker",
  props: {
    label: {},
    options: {},
    modelValue: {},
    disabled: { type: Boolean }
  },
  emits: ["update:modelValue"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = M(""), r = W(() => t.options.map((u) => typeof u == "string" ? { value: u } : u)), p = W(() => r.value.filter((u) => (u.label ?? Ne(u.value)).toLocaleLowerCase().includes(o.value.toLocaleLowerCase())));
    function m(u) {
      if (t.disabled) return;
      const i = t.modelValue ?? [];
      l("update:modelValue", i.includes(u) ? i.filter((c) => c !== u) : [...i, u]);
    }
    return (u, i) => (n(), b("fieldset", {
      class: "work-chip-picker",
      disabled: e.disabled
    }, [
      d("legend", null, E(e.label), 1),
      e.options.length > 10 ? (n(), H(s(ye), {
        key: 0,
        modelValue: o.value,
        "onUpdate:modelValue": i[0] || (i[0] = (c) => o.value = c),
        type: "search",
        "aria-label": "Find " + e.label.toLowerCase(),
        placeholder: "Find a choice…"
      }, null, 8, ["modelValue", "aria-label"])) : U("", !0),
      d("div", Yn, [
        g(s($l), {
          "model-value": e.modelValue ?? [],
          options: p.value.map((c) => ({ value: c.value, label: c.label ?? s(Ne)(c.value) })),
          optionLabel: "label",
          optionValue: "value",
          multiple: "",
          disabled: e.disabled,
          "aria-label": e.label,
          "onUpdate:modelValue": i[1] || (i[1] = (c) => l("update:modelValue", c ?? []))
        }, null, 8, ["model-value", "options", "disabled", "aria-label"]),
        (n(!0), b(te, null, re(e.modelValue?.filter((c) => !r.value.some((f) => f.value === c)) ?? [], (c) => (n(), H(s(Z), {
          severity: "secondary",
          text: "",
          size: "small",
          key: c,
          type: "button",
          class: "work-choice work-unavailable",
          "aria-label": "Remove unavailable " + c,
          onClick: (f) => m(c)
        }, {
          default: j(() => [
            F(E(s(Ne)(c)) + " · unavailable ×", 1)
          ]),
          _: 2
        }, 1032, ["aria-label", "onClick"]))), 128))
      ]),
      e.options.length ? U("", !0) : (n(), b("span", Xn, "No choices declared."))
    ], 8, Hn));
  }
});
/**!
 * Sortable 1.15.7
 * @author	RubaXa   <trash@rubaxa.org>
 * @author	owenm    <owen23355@gmail.com>
 * @license MIT
 */
function Jn(e, a, t) {
  return (a = es(a)) in e ? Object.defineProperty(e, a, {
    value: t,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : e[a] = t, e;
}
function yt() {
  return yt = Object.assign ? Object.assign.bind() : function(e) {
    for (var a = 1; a < arguments.length; a++) {
      var t = arguments[a];
      for (var l in t) ({}).hasOwnProperty.call(t, l) && (e[l] = t[l]);
    }
    return e;
  }, yt.apply(null, arguments);
}
function Kl(e, a) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(e);
    a && (l = l.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), t.push.apply(t, l);
  }
  return t;
}
function mt(e) {
  for (var a = 1; a < arguments.length; a++) {
    var t = arguments[a] != null ? arguments[a] : {};
    a % 2 ? Kl(Object(t), !0).forEach(function(l) {
      Jn(e, l, t[l]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : Kl(Object(t)).forEach(function(l) {
      Object.defineProperty(e, l, Object.getOwnPropertyDescriptor(t, l));
    });
  }
  return e;
}
function Zn(e, a) {
  if (e == null) return {};
  var t, l, o = Qn(e, a);
  if (Object.getOwnPropertySymbols) {
    var r = Object.getOwnPropertySymbols(e);
    for (l = 0; l < r.length; l++) t = r[l], a.indexOf(t) === -1 && {}.propertyIsEnumerable.call(e, t) && (o[t] = e[t]);
  }
  return o;
}
function Qn(e, a) {
  if (e == null) return {};
  var t = {};
  for (var l in e) if ({}.hasOwnProperty.call(e, l)) {
    if (a.indexOf(l) !== -1) continue;
    t[l] = e[l];
  }
  return t;
}
function _n(e, a) {
  if (typeof e != "object" || !e) return e;
  var t = e[Symbol.toPrimitive];
  if (t !== void 0) {
    var l = t.call(e, a);
    if (typeof l != "object") return l;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (a === "string" ? String : Number)(e);
}
function es(e) {
  var a = _n(e, "string");
  return typeof a == "symbol" ? a : a + "";
}
function pl(e) {
  "@babel/helpers - typeof";
  return pl = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(a) {
    return typeof a;
  } : function(a) {
    return a && typeof Symbol == "function" && a.constructor === Symbol && a !== Symbol.prototype ? "symbol" : typeof a;
  }, pl(e);
}
var ts = "1.15.7";
function gt(e) {
  if (typeof window < "u" && window.navigator)
    return !!/* @__PURE__ */ navigator.userAgent.match(e);
}
var wt = gt(/(?:Trident.*rv[ :]?11\.|msie|iemobile|Windows Phone)/i), ha = gt(/Edge/i), Gl = gt(/firefox/i), ua = gt(/safari/i) && !gt(/chrome/i) && !gt(/android/i), Tl = gt(/iP(ad|od|hone)/i), Vo = gt(/chrome/i) && gt(/android/i), $o = {
  capture: !1,
  passive: !1
};
function $e(e, a, t) {
  e.addEventListener(a, t, !wt && $o);
}
function Ve(e, a, t) {
  e.removeEventListener(a, t, !wt && $o);
}
function Ra(e, a) {
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
function xo(e) {
  return e.host && e !== document && e.host.nodeType && e.host !== e ? e.host : e.parentNode;
}
function nt(e, a, t, l) {
  if (e) {
    t = t || document;
    do {
      if (a != null && (a[0] === ">" ? e.parentNode === t && Ra(e, a) : Ra(e, a)) || l && e === t)
        return e;
      if (e === t) break;
    } while (e = xo(e));
  }
  return null;
}
var Hl = /\s+/g;
function Qe(e, a, t) {
  if (e && a)
    if (e.classList)
      e.classList[t ? "add" : "remove"](a);
    else {
      var l = (" " + e.className + " ").replace(Hl, " ").replace(" " + a + " ", " ");
      e.className = (l + (t ? " " + a : "")).replace(Hl, " ");
    }
}
function fe(e, a, t) {
  var l = e && e.style;
  if (l) {
    if (t === void 0)
      return document.defaultView && document.defaultView.getComputedStyle ? t = document.defaultView.getComputedStyle(e, "") : e.currentStyle && (t = e.currentStyle), a === void 0 ? t : t[a];
    !(a in l) && a.indexOf("webkit") === -1 && (a = "-webkit-" + a), l[a] = t + (typeof t == "string" ? "" : "px");
  }
}
function Jt(e, a) {
  var t = "";
  if (typeof e == "string")
    t = e;
  else
    do {
      var l = fe(e, "transform");
      l && l !== "none" && (t = l + " " + t);
    } while (!a && (e = e.parentNode));
  var o = window.DOMMatrix || window.WebKitCSSMatrix || window.CSSMatrix || window.MSCSSMatrix;
  return o && new o(t);
}
function Co(e, a, t) {
  if (e) {
    var l = e.getElementsByTagName(a), o = 0, r = l.length;
    if (t)
      for (; o < r; o++)
        t(l[o], o);
    return l;
  }
  return [];
}
function vt() {
  var e = document.scrollingElement;
  return e || document.documentElement;
}
function Fe(e, a, t, l, o) {
  if (!(!e.getBoundingClientRect && e !== window)) {
    var r, p, m, u, i, c, f;
    if (e !== window && e.parentNode && e !== vt() ? (r = e.getBoundingClientRect(), p = r.top, m = r.left, u = r.bottom, i = r.right, c = r.height, f = r.width) : (p = 0, m = 0, u = window.innerHeight, i = window.innerWidth, c = window.innerHeight, f = window.innerWidth), (a || t) && e !== window && (o = o || e.parentNode, !wt))
      do
        if (o && o.getBoundingClientRect && (fe(o, "transform") !== "none" || t && fe(o, "position") !== "static")) {
          var y = o.getBoundingClientRect();
          p -= y.top + parseInt(fe(o, "border-top-width")), m -= y.left + parseInt(fe(o, "border-left-width")), u = p + r.height, i = m + r.width;
          break;
        }
      while (o = o.parentNode);
    if (l && e !== window) {
      var h = Jt(o || e), $ = h && h.a, k = h && h.d;
      h && (p /= k, m /= $, f /= $, c /= k, u = p + c, i = m + f);
    }
    return {
      top: p,
      left: m,
      bottom: u,
      right: i,
      width: f,
      height: c
    };
  }
}
function Yl(e, a, t) {
  for (var l = St(e, !0), o = Fe(e)[a]; l; ) {
    var r = Fe(l)[t], p = void 0;
    if (p = o >= r, !p) return l;
    if (l === vt()) break;
    l = St(l, !1);
  }
  return !1;
}
function Qt(e, a, t, l) {
  for (var o = 0, r = 0, p = e.children; r < p.length; ) {
    if (p[r].style.display !== "none" && p[r] !== pe.ghost && (l || p[r] !== pe.dragged) && nt(p[r], t.draggable, e, !1)) {
      if (o === a)
        return p[r];
      o++;
    }
    r++;
  }
  return null;
}
function Il(e, a) {
  for (var t = e.lastElementChild; t && (t === pe.ghost || fe(t, "display") === "none" || a && !Ra(t, a)); )
    t = t.previousElementSibling;
  return t || null;
}
function at(e, a) {
  var t = 0;
  if (!e || !e.parentNode)
    return -1;
  for (; e = e.previousElementSibling; )
    e.nodeName.toUpperCase() !== "TEMPLATE" && e !== pe.clone && (!a || Ra(e, a)) && t++;
  return t;
}
function Xl(e) {
  var a = 0, t = 0, l = vt();
  if (e)
    do {
      var o = Jt(e), r = o.a, p = o.d;
      a += e.scrollLeft * r, t += e.scrollTop * p;
    } while (e !== l && (e = e.parentNode));
  return [a, t];
}
function as(e, a) {
  for (var t in e)
    if (e.hasOwnProperty(t)) {
      for (var l in a)
        if (a.hasOwnProperty(l) && a[l] === e[t][l]) return Number(t);
    }
  return -1;
}
function St(e, a) {
  if (!e || !e.getBoundingClientRect) return vt();
  var t = e, l = !1;
  do
    if (t.clientWidth < t.scrollWidth || t.clientHeight < t.scrollHeight) {
      var o = fe(t);
      if (t.clientWidth < t.scrollWidth && (o.overflowX == "auto" || o.overflowX == "scroll") || t.clientHeight < t.scrollHeight && (o.overflowY == "auto" || o.overflowY == "scroll")) {
        if (!t.getBoundingClientRect || t === document.body) return vt();
        if (l || a) return t;
        l = !0;
      }
    }
  while (t = t.parentNode);
  return vt();
}
function ls(e, a) {
  if (e && a)
    for (var t in a)
      a.hasOwnProperty(t) && (e[t] = a[t]);
  return e;
}
function tl(e, a) {
  return Math.round(e.top) === Math.round(a.top) && Math.round(e.left) === Math.round(a.left) && Math.round(e.height) === Math.round(a.height) && Math.round(e.width) === Math.round(a.width);
}
var ca;
function So(e, a) {
  return function() {
    if (!ca) {
      var t = arguments, l = this;
      t.length === 1 ? e.call(l, t[0]) : e.apply(l, t), ca = setTimeout(function() {
        ca = void 0;
      }, a);
    }
  };
}
function os() {
  clearTimeout(ca), ca = void 0;
}
function To(e, a, t) {
  e.scrollLeft += a, e.scrollTop += t;
}
function Io(e) {
  var a = window.Polymer, t = window.jQuery || window.Zepto;
  return a && a.dom ? a.dom(e).cloneNode(!0) : t ? t(e).clone(!0)[0] : e.cloneNode(!0);
}
function Do(e, a, t) {
  var l = {};
  return Array.from(e.children).forEach(function(o) {
    var r, p, m, u;
    if (!(!nt(o, a.draggable, e, !1) || o.animated || o === t)) {
      var i = Fe(o);
      l.left = Math.min((r = l.left) !== null && r !== void 0 ? r : 1 / 0, i.left), l.top = Math.min((p = l.top) !== null && p !== void 0 ? p : 1 / 0, i.top), l.right = Math.max((m = l.right) !== null && m !== void 0 ? m : -1 / 0, i.right), l.bottom = Math.max((u = l.bottom) !== null && u !== void 0 ? u : -1 / 0, i.bottom);
    }
  }), l.width = l.right - l.left, l.height = l.bottom - l.top, l.x = l.left, l.y = l.top, l;
}
var Je = "Sortable" + (/* @__PURE__ */ new Date()).getTime();
function is() {
  var e = [], a;
  return {
    captureAnimationState: function() {
      if (e = [], !!this.options.animation) {
        var l = [].slice.call(this.el.children);
        l.forEach(function(o) {
          if (!(fe(o, "display") === "none" || o === pe.ghost)) {
            e.push({
              target: o,
              rect: Fe(o)
            });
            var r = mt({}, e[e.length - 1].rect);
            if (o.thisAnimationDuration) {
              var p = Jt(o, !0);
              p && (r.top -= p.f, r.left -= p.e);
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
      e.splice(as(e, {
        target: l
      }), 1);
    },
    animateAll: function(l) {
      var o = this;
      if (!this.options.animation) {
        clearTimeout(a), typeof l == "function" && l();
        return;
      }
      var r = !1, p = 0;
      e.forEach(function(m) {
        var u = 0, i = m.target, c = i.fromRect, f = Fe(i), y = i.prevFromRect, h = i.prevToRect, $ = m.rect, k = Jt(i, !0);
        k && (f.top -= k.f, f.left -= k.e), i.toRect = f, i.thisAnimationDuration && tl(y, f) && !tl(c, f) && // Make sure animatingRect is on line between toRect & fromRect
        ($.top - f.top) / ($.left - f.left) === (c.top - f.top) / (c.left - f.left) && (u = ss($, y, h, o.options)), tl(f, c) || (i.prevFromRect = c, i.prevToRect = f, u || (u = o.options.animation), o.animate(i, $, f, u)), u && (r = !0, p = Math.max(p, u), clearTimeout(i.animationResetTimer), i.animationResetTimer = setTimeout(function() {
          i.animationTime = 0, i.prevFromRect = null, i.fromRect = null, i.prevToRect = null, i.thisAnimationDuration = null;
        }, u), i.thisAnimationDuration = u);
      }), clearTimeout(a), r ? a = setTimeout(function() {
        typeof l == "function" && l();
      }, p) : typeof l == "function" && l(), e = [];
    },
    animate: function(l, o, r, p) {
      if (p) {
        fe(l, "transition", ""), fe(l, "transform", "");
        var m = Jt(this.el), u = m && m.a, i = m && m.d, c = (o.left - r.left) / (u || 1), f = (o.top - r.top) / (i || 1);
        l.animatingX = !!c, l.animatingY = !!f, fe(l, "transform", "translate3d(" + c + "px," + f + "px,0)"), this.forRepaintDummy = ns(l), fe(l, "transition", "transform " + p + "ms" + (this.options.easing ? " " + this.options.easing : "")), fe(l, "transform", "translate3d(0,0,0)"), typeof l.animated == "number" && clearTimeout(l.animated), l.animated = setTimeout(function() {
          fe(l, "transition", ""), fe(l, "transform", ""), l.animated = !1, l.animatingX = !1, l.animatingY = !1;
        }, p);
      }
    }
  };
}
function ns(e) {
  return e.offsetWidth;
}
function ss(e, a, t, l) {
  return Math.sqrt(Math.pow(a.top - e.top, 2) + Math.pow(a.left - e.left, 2)) / Math.sqrt(Math.pow(a.top - t.top, 2) + Math.pow(a.left - t.left, 2)) * l.animation;
}
var qt = [], al = {
  initializeByDefault: !0
}, ga = {
  mount: function(a) {
    for (var t in al)
      al.hasOwnProperty(t) && !(t in a) && (a[t] = al[t]);
    qt.forEach(function(l) {
      if (l.pluginName === a.pluginName)
        throw "Sortable: Cannot mount plugin ".concat(a.pluginName, " more than once");
    }), qt.push(a);
  },
  pluginEvent: function(a, t, l) {
    var o = this;
    this.eventCanceled = !1, l.cancel = function() {
      o.eventCanceled = !0;
    };
    var r = a + "Global";
    qt.forEach(function(p) {
      t[p.pluginName] && (t[p.pluginName][r] && t[p.pluginName][r](mt({
        sortable: t
      }, l)), t.options[p.pluginName] && t[p.pluginName][a] && t[p.pluginName][a](mt({
        sortable: t
      }, l)));
    });
  },
  initializePlugins: function(a, t, l, o) {
    qt.forEach(function(m) {
      var u = m.pluginName;
      if (!(!a.options[u] && !m.initializeByDefault)) {
        var i = new m(a, t, a.options);
        i.sortable = a, i.options = a.options, a[u] = i, yt(l, i.defaults);
      }
    });
    for (var r in a.options)
      if (a.options.hasOwnProperty(r)) {
        var p = this.modifyOption(a, r, a.options[r]);
        typeof p < "u" && (a.options[r] = p);
      }
  },
  getEventProperties: function(a, t) {
    var l = {};
    return qt.forEach(function(o) {
      typeof o.eventProperties == "function" && yt(l, o.eventProperties.call(t[o.pluginName], a));
    }), l;
  },
  modifyOption: function(a, t, l) {
    var o;
    return qt.forEach(function(r) {
      a[r.pluginName] && r.optionListeners && typeof r.optionListeners[t] == "function" && (o = r.optionListeners[t].call(a[r.pluginName], l));
    }), o;
  }
};
function rs(e) {
  var a = e.sortable, t = e.rootEl, l = e.name, o = e.targetEl, r = e.cloneEl, p = e.toEl, m = e.fromEl, u = e.oldIndex, i = e.newIndex, c = e.oldDraggableIndex, f = e.newDraggableIndex, y = e.originalEvent, h = e.putSortable, $ = e.extraEventProperties;
  if (a = a || t && t[Je], !!a) {
    var k, I = a.options, V = "on" + l.charAt(0).toUpperCase() + l.substr(1);
    window.CustomEvent && !wt && !ha ? k = new CustomEvent(l, {
      bubbles: !0,
      cancelable: !0
    }) : (k = document.createEvent("Event"), k.initEvent(l, !0, !0)), k.to = p || t, k.from = m || t, k.item = o || t, k.clone = r, k.oldIndex = u, k.newIndex = i, k.oldDraggableIndex = c, k.newDraggableIndex = f, k.originalEvent = y, k.pullMode = h ? h.lastPutMode : void 0;
    var x = mt(mt({}, $), ga.getEventProperties(l, a));
    for (var A in x)
      k[A] = x[A];
    t && t.dispatchEvent(k), I[V] && I[V].call(a, k);
  }
}
var ds = ["evt"], Xe = function(a, t) {
  var l = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, o = l.evt, r = Zn(l, ds);
  ga.pluginEvent.bind(pe)(a, t, mt({
    dragEl: le,
    parentEl: Re,
    ghostEl: be,
    rootEl: Ue,
    nextEl: Rt,
    lastDownEl: Da,
    cloneEl: Ae,
    cloneHidden: Ct,
    dragStarted: oa,
    putSortable: qe,
    activeSortable: pe.active,
    originalEvent: o,
    oldIndex: Xt,
    oldDraggableIndex: va,
    newIndex: _e,
    newDraggableIndex: xt,
    hideGhostForTarget: Oo,
    unhideGhostForTarget: Po,
    cloneNowHidden: function() {
      Ct = !0;
    },
    cloneNowShown: function() {
      Ct = !1;
    },
    dispatchSortableEvent: function(m) {
      He({
        sortable: t,
        name: m,
        originalEvent: o
      });
    }
  }, r));
};
function He(e) {
  rs(mt({
    putSortable: qe,
    cloneEl: Ae,
    targetEl: le,
    rootEl: Ue,
    oldIndex: Xt,
    oldDraggableIndex: va,
    newIndex: _e,
    newDraggableIndex: xt
  }, e));
}
var le, Re, be, Ue, Rt, Da, Ae, Ct, Xt, _e, va, xt, xa, qe, Gt = !1, Na = !1, Ma = [], At, it, ll, ol, Jl, Zl, oa, Kt, ma, fa = !1, Ca = !1, Ua, Ke, il = [], bl = !1, Fa = [], qa = typeof document < "u", Sa = Tl, Ql = ha || wt ? "cssFloat" : "float", us = qa && !Vo && !Tl && "draggable" in document.createElement("div"), Uo = (function() {
  if (qa) {
    if (wt)
      return !1;
    var e = document.createElement("x");
    return e.style.cssText = "pointer-events:auto", e.style.pointerEvents === "auto";
  }
})(), Eo = function(a, t) {
  var l = fe(a), o = parseInt(l.width) - parseInt(l.paddingLeft) - parseInt(l.paddingRight) - parseInt(l.borderLeftWidth) - parseInt(l.borderRightWidth), r = Qt(a, 0, t), p = Qt(a, 1, t), m = r && fe(r), u = p && fe(p), i = m && parseInt(m.marginLeft) + parseInt(m.marginRight) + Fe(r).width, c = u && parseInt(u.marginLeft) + parseInt(u.marginRight) + Fe(p).width;
  if (l.display === "flex")
    return l.flexDirection === "column" || l.flexDirection === "column-reverse" ? "vertical" : "horizontal";
  if (l.display === "grid")
    return l.gridTemplateColumns.split(" ").length <= 1 ? "vertical" : "horizontal";
  if (r && m.float && m.float !== "none") {
    var f = m.float === "left" ? "left" : "right";
    return p && (u.clear === "both" || u.clear === f) ? "vertical" : "horizontal";
  }
  return r && (m.display === "block" || m.display === "flex" || m.display === "table" || m.display === "grid" || i >= o && l[Ql] === "none" || p && l[Ql] === "none" && i + c > o) ? "vertical" : "horizontal";
}, cs = function(a, t, l) {
  var o = l ? a.left : a.top, r = l ? a.right : a.bottom, p = l ? a.width : a.height, m = l ? t.left : t.top, u = l ? t.right : t.bottom, i = l ? t.width : t.height;
  return o === m || r === u || o + p / 2 === m + i / 2;
}, vs = function(a, t) {
  var l;
  return Ma.some(function(o) {
    var r = o[Je].options.emptyInsertThreshold;
    if (!(!r || Il(o))) {
      var p = Fe(o), m = a >= p.left - r && a <= p.right + r, u = t >= p.top - r && t <= p.bottom + r;
      if (m && u)
        return l = o;
    }
  }), l;
}, Ao = function(a) {
  function t(r, p) {
    return function(m, u, i, c) {
      var f = m.options.group.name && u.options.group.name && m.options.group.name === u.options.group.name;
      if (r == null && (p || f))
        return !0;
      if (r == null || r === !1)
        return !1;
      if (p && r === "clone")
        return r;
      if (typeof r == "function")
        return t(r(m, u, i, c), p)(m, u, i, c);
      var y = (p ? m : u).options.group.name;
      return r === !0 || typeof r == "string" && r === y || r.join && r.indexOf(y) > -1;
    };
  }
  var l = {}, o = a.group;
  (!o || pl(o) != "object") && (o = {
    name: o
  }), l.name = o.name, l.checkPull = t(o.pull, !0), l.checkPut = t(o.put), l.revertClone = o.revertClone, a.group = l;
}, Oo = function() {
  !Uo && be && fe(be, "display", "none");
}, Po = function() {
  !Uo && be && fe(be, "display", "");
};
qa && !Vo && document.addEventListener("click", function(e) {
  if (Na)
    return e.preventDefault(), e.stopPropagation && e.stopPropagation(), e.stopImmediatePropagation && e.stopImmediatePropagation(), Na = !1, !1;
}, !0);
var Ot = function(a) {
  if (le) {
    a = a.touches ? a.touches[0] : a;
    var t = vs(a.clientX, a.clientY);
    if (t) {
      var l = {};
      for (var o in a)
        a.hasOwnProperty(o) && (l[o] = a[o]);
      l.target = l.rootEl = t, l.preventDefault = void 0, l.stopPropagation = void 0, t[Je]._onDragOver(l);
    }
  }
}, ms = function(a) {
  le && le.parentNode[Je]._isOutsideThisEl(a.target);
};
function pe(e, a) {
  if (!(e && e.nodeType && e.nodeType === 1))
    throw "Sortable: `el` must be an HTMLElement, not ".concat({}.toString.call(e));
  this.el = e, this.options = a = yt({}, a), e[Je] = this;
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
      return Eo(e, this.options);
    },
    ghostClass: "sortable-ghost",
    chosenClass: "sortable-chosen",
    dragClass: "sortable-drag",
    ignore: "a, img",
    filter: null,
    preventOnFilter: !0,
    animation: 0,
    easing: null,
    setData: function(p, m) {
      p.setData("Text", m.textContent);
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
    supportPointer: pe.supportPointer !== !1 && "PointerEvent" in window && (!ua || Tl),
    emptyInsertThreshold: 5
  };
  ga.initializePlugins(this, e, t);
  for (var l in t)
    !(l in a) && (a[l] = t[l]);
  Ao(a);
  for (var o in this)
    o.charAt(0) === "_" && typeof this[o] == "function" && (this[o] = this[o].bind(this));
  this.nativeDraggable = a.forceFallback ? !1 : us, this.nativeDraggable && (this.options.touchStartThreshold = 1), a.supportPointer ? $e(e, "pointerdown", this._onTapStart) : ($e(e, "mousedown", this._onTapStart), $e(e, "touchstart", this._onTapStart)), this.nativeDraggable && ($e(e, "dragover", this), $e(e, "dragenter", this)), Ma.push(this.el), a.store && a.store.get && this.sort(a.store.get(this) || []), yt(this, is());
}
pe.prototype = /** @lends Sortable.prototype */
{
  constructor: pe,
  _isOutsideThisEl: function(a) {
    !this.el.contains(a) && a !== this.el && (Kt = null);
  },
  _getDirection: function(a, t) {
    return typeof this.options.direction == "function" ? this.options.direction.call(this, a, t, le) : this.options.direction;
  },
  _onTapStart: function(a) {
    if (a.cancelable) {
      var t = this, l = this.el, o = this.options, r = o.preventOnFilter, p = a.type, m = a.touches && a.touches[0] || a.pointerType && a.pointerType === "touch" && a, u = (m || a).target, i = a.target.shadowRoot && (a.path && a.path[0] || a.composedPath && a.composedPath()[0]) || u, c = o.filter;
      if (ws(l), !le && !(/mousedown|pointerdown/.test(p) && a.button !== 0 || o.disabled) && !i.isContentEditable && !(!this.nativeDraggable && ua && u && u.tagName.toUpperCase() === "SELECT") && (u = nt(u, o.draggable, l, !1), !(u && u.animated) && Da !== u)) {
        if (Xt = at(u), va = at(u, o.draggable), typeof c == "function") {
          if (c.call(this, a, u, this)) {
            He({
              sortable: t,
              rootEl: i,
              name: "filter",
              targetEl: u,
              toEl: l,
              fromEl: l
            }), Xe("filter", t, {
              evt: a
            }), r && a.preventDefault();
            return;
          }
        } else if (c && (c = c.split(",").some(function(f) {
          if (f = nt(i, f.trim(), l, !1), f)
            return He({
              sortable: t,
              rootEl: f,
              name: "filter",
              targetEl: u,
              fromEl: l,
              toEl: l
            }), Xe("filter", t, {
              evt: a
            }), !0;
        }), c)) {
          r && a.preventDefault();
          return;
        }
        o.handle && !nt(i, o.handle, l, !1) || this._prepareDragStart(a, m, u);
      }
    }
  },
  _prepareDragStart: function(a, t, l) {
    var o = this, r = o.el, p = o.options, m = r.ownerDocument, u;
    if (l && !le && l.parentNode === r) {
      var i = Fe(l);
      if (Ue = r, le = l, Re = le.parentNode, Rt = le.nextSibling, Da = l, xa = p.group, pe.dragged = le, At = {
        target: le,
        clientX: (t || a).clientX,
        clientY: (t || a).clientY
      }, Jl = At.clientX - i.left, Zl = At.clientY - i.top, this._lastX = (t || a).clientX, this._lastY = (t || a).clientY, le.style["will-change"] = "all", u = function() {
        if (Xe("delayEnded", o, {
          evt: a
        }), pe.eventCanceled) {
          o._onDrop();
          return;
        }
        o._disableDelayedDragEvents(), !Gl && o.nativeDraggable && (le.draggable = !0), o._triggerDragStart(a, t), He({
          sortable: o,
          name: "choose",
          originalEvent: a
        }), Qe(le, p.chosenClass, !0);
      }, p.ignore.split(",").forEach(function(c) {
        Co(le, c.trim(), nl);
      }), $e(m, "dragover", Ot), $e(m, "mousemove", Ot), $e(m, "touchmove", Ot), p.supportPointer ? ($e(m, "pointerup", o._onDrop), !this.nativeDraggable && $e(m, "pointercancel", o._onDrop)) : ($e(m, "mouseup", o._onDrop), $e(m, "touchend", o._onDrop), $e(m, "touchcancel", o._onDrop)), Gl && this.nativeDraggable && (this.options.touchStartThreshold = 4, le.draggable = !0), Xe("delayStart", this, {
        evt: a
      }), p.delay && (!p.delayOnTouchOnly || t) && (!this.nativeDraggable || !(ha || wt))) {
        if (pe.eventCanceled) {
          this._onDrop();
          return;
        }
        p.supportPointer ? ($e(m, "pointerup", o._disableDelayedDrag), $e(m, "pointercancel", o._disableDelayedDrag)) : ($e(m, "mouseup", o._disableDelayedDrag), $e(m, "touchend", o._disableDelayedDrag), $e(m, "touchcancel", o._disableDelayedDrag)), $e(m, "mousemove", o._delayedDragTouchMoveHandler), $e(m, "touchmove", o._delayedDragTouchMoveHandler), p.supportPointer && $e(m, "pointermove", o._delayedDragTouchMoveHandler), o._dragStartTimer = setTimeout(u, p.delay);
      } else
        u();
    }
  },
  _delayedDragTouchMoveHandler: function(a) {
    var t = a.touches ? a.touches[0] : a;
    Math.max(Math.abs(t.clientX - this._lastX), Math.abs(t.clientY - this._lastY)) >= Math.floor(this.options.touchStartThreshold / (this.nativeDraggable && window.devicePixelRatio || 1)) && this._disableDelayedDrag();
  },
  _disableDelayedDrag: function() {
    le && nl(le), clearTimeout(this._dragStartTimer), this._disableDelayedDragEvents();
  },
  _disableDelayedDragEvents: function() {
    var a = this.el.ownerDocument;
    Ve(a, "mouseup", this._disableDelayedDrag), Ve(a, "touchend", this._disableDelayedDrag), Ve(a, "touchcancel", this._disableDelayedDrag), Ve(a, "pointerup", this._disableDelayedDrag), Ve(a, "pointercancel", this._disableDelayedDrag), Ve(a, "mousemove", this._delayedDragTouchMoveHandler), Ve(a, "touchmove", this._delayedDragTouchMoveHandler), Ve(a, "pointermove", this._delayedDragTouchMoveHandler);
  },
  _triggerDragStart: function(a, t) {
    t = t || a.pointerType == "touch" && a, !this.nativeDraggable || t ? this.options.supportPointer ? $e(document, "pointermove", this._onTouchMove) : t ? $e(document, "touchmove", this._onTouchMove) : $e(document, "mousemove", this._onTouchMove) : ($e(le, "dragend", this), $e(Ue, "dragstart", this._onDragStart));
    try {
      document.selection ? Ea(function() {
        document.selection.empty();
      }) : window.getSelection().removeAllRanges();
    } catch {
    }
  },
  _dragStarted: function(a, t) {
    if (Gt = !1, Ue && le) {
      Xe("dragStarted", this, {
        evt: t
      }), this.nativeDraggable && $e(document, "dragover", ms);
      var l = this.options;
      !a && Qe(le, l.dragClass, !1), Qe(le, l.ghostClass, !0), pe.active = this, a && this._appendGhost(), He({
        sortable: this,
        name: "start",
        originalEvent: t
      });
    } else
      this._nulling();
  },
  _emulateDragOver: function() {
    if (it) {
      this._lastX = it.clientX, this._lastY = it.clientY, Oo();
      for (var a = document.elementFromPoint(it.clientX, it.clientY), t = a; a && a.shadowRoot && (a = a.shadowRoot.elementFromPoint(it.clientX, it.clientY), a !== t); )
        t = a;
      if (le.parentNode[Je]._isOutsideThisEl(a), t)
        do {
          if (t[Je]) {
            var l = void 0;
            if (l = t[Je]._onDragOver({
              clientX: it.clientX,
              clientY: it.clientY,
              target: a,
              rootEl: t
            }), l && !this.options.dragoverBubble)
              break;
          }
          a = t;
        } while (t = xo(t));
      Po();
    }
  },
  _onTouchMove: function(a) {
    if (At) {
      var t = this.options, l = t.fallbackTolerance, o = t.fallbackOffset, r = a.touches ? a.touches[0] : a, p = be && Jt(be, !0), m = be && p && p.a, u = be && p && p.d, i = Sa && Ke && Xl(Ke), c = (r.clientX - At.clientX + o.x) / (m || 1) + (i ? i[0] - il[0] : 0) / (m || 1), f = (r.clientY - At.clientY + o.y) / (u || 1) + (i ? i[1] - il[1] : 0) / (u || 1);
      if (!pe.active && !Gt) {
        if (l && Math.max(Math.abs(r.clientX - this._lastX), Math.abs(r.clientY - this._lastY)) < l)
          return;
        this._onDragStart(a, !0);
      }
      if (be) {
        p ? (p.e += c - (ll || 0), p.f += f - (ol || 0)) : p = {
          a: 1,
          b: 0,
          c: 0,
          d: 1,
          e: c,
          f
        };
        var y = "matrix(".concat(p.a, ",").concat(p.b, ",").concat(p.c, ",").concat(p.d, ",").concat(p.e, ",").concat(p.f, ")");
        fe(be, "webkitTransform", y), fe(be, "mozTransform", y), fe(be, "msTransform", y), fe(be, "transform", y), ll = c, ol = f, it = r;
      }
      a.cancelable && a.preventDefault();
    }
  },
  _appendGhost: function() {
    if (!be) {
      var a = this.options.fallbackOnBody ? document.body : Ue, t = Fe(le, !0, Sa, !0, a), l = this.options;
      if (Sa) {
        for (Ke = a; fe(Ke, "position") === "static" && fe(Ke, "transform") === "none" && Ke !== document; )
          Ke = Ke.parentNode;
        Ke !== document.body && Ke !== document.documentElement ? (Ke === document && (Ke = vt()), t.top += Ke.scrollTop, t.left += Ke.scrollLeft) : Ke = vt(), il = Xl(Ke);
      }
      be = le.cloneNode(!0), Qe(be, l.ghostClass, !1), Qe(be, l.fallbackClass, !0), Qe(be, l.dragClass, !0), fe(be, "transition", ""), fe(be, "transform", ""), fe(be, "box-sizing", "border-box"), fe(be, "margin", 0), fe(be, "top", t.top), fe(be, "left", t.left), fe(be, "width", t.width), fe(be, "height", t.height), fe(be, "opacity", "0.8"), fe(be, "position", Sa ? "absolute" : "fixed"), fe(be, "zIndex", "100000"), fe(be, "pointerEvents", "none"), pe.ghost = be, a.appendChild(be), fe(be, "transform-origin", Jl / parseInt(be.style.width) * 100 + "% " + Zl / parseInt(be.style.height) * 100 + "%");
    }
  },
  _onDragStart: function(a, t) {
    var l = this, o = a.dataTransfer, r = l.options;
    if (Xe("dragStart", this, {
      evt: a
    }), pe.eventCanceled) {
      this._onDrop();
      return;
    }
    Xe("setupClone", this), pe.eventCanceled || (Ae = Io(le), Ae.removeAttribute("id"), Ae.draggable = !1, Ae.style["will-change"] = "", this._hideClone(), Qe(Ae, this.options.chosenClass, !1), pe.clone = Ae), l.cloneId = Ea(function() {
      Xe("clone", l), !pe.eventCanceled && (l.options.removeCloneOnHide || Ue.insertBefore(Ae, le), l._hideClone(), He({
        sortable: l,
        name: "clone"
      }));
    }), !t && Qe(le, r.dragClass, !0), t ? (Na = !0, l._loopId = setInterval(l._emulateDragOver, 50)) : (Ve(document, "mouseup", l._onDrop), Ve(document, "touchend", l._onDrop), Ve(document, "touchcancel", l._onDrop), o && (o.effectAllowed = "move", r.setData && r.setData.call(l, o, le)), $e(document, "drop", l), fe(le, "transform", "translateZ(0)")), Gt = !0, l._dragStartId = Ea(l._dragStarted.bind(l, t, a)), $e(document, "selectstart", l), oa = !0, window.getSelection().removeAllRanges(), ua && fe(document.body, "user-select", "none");
  },
  // Returns true - if no further action is needed (either inserted or another condition)
  _onDragOver: function(a) {
    var t = this.el, l = a.target, o, r, p, m = this.options, u = m.group, i = pe.active, c = xa === u, f = m.sort, y = qe || i, h, $ = this, k = !1;
    if (bl) return;
    function I(ue, se) {
      Xe(ue, $, mt({
        evt: a,
        isOwner: c,
        axis: h ? "vertical" : "horizontal",
        revert: p,
        dragRect: o,
        targetRect: r,
        canSort: f,
        fromSortable: y,
        target: l,
        completed: x,
        onMove: function(De, q) {
          return Ta(Ue, t, le, o, De, Fe(De), a, q);
        },
        changed: A
      }, se));
    }
    function V() {
      I("dragOverAnimationCapture"), $.captureAnimationState(), $ !== y && y.captureAnimationState();
    }
    function x(ue) {
      return I("dragOverCompleted", {
        insertion: ue
      }), ue && (c ? i._hideClone() : i._showClone($), $ !== y && (Qe(le, qe ? qe.options.ghostClass : i.options.ghostClass, !1), Qe(le, m.ghostClass, !0)), qe !== $ && $ !== pe.active ? qe = $ : $ === pe.active && qe && (qe = null), y === $ && ($._ignoreWhileAnimating = l), $.animateAll(function() {
        I("dragOverAnimationComplete"), $._ignoreWhileAnimating = null;
      }), $ !== y && (y.animateAll(), y._ignoreWhileAnimating = null)), (l === le && !le.animated || l === t && !l.animated) && (Kt = null), !m.dragoverBubble && !a.rootEl && l !== document && (le.parentNode[Je]._isOutsideThisEl(a.target), !ue && Ot(a)), !m.dragoverBubble && a.stopPropagation && a.stopPropagation(), k = !0;
    }
    function A() {
      _e = at(le), xt = at(le, m.draggable), He({
        sortable: $,
        name: "change",
        toEl: t,
        newIndex: _e,
        newDraggableIndex: xt,
        originalEvent: a
      });
    }
    if (a.preventDefault !== void 0 && a.cancelable && a.preventDefault(), l = nt(l, m.draggable, t, !0), I("dragOver"), pe.eventCanceled) return k;
    if (le.contains(a.target) || l.animated && l.animatingX && l.animatingY || $._ignoreWhileAnimating === l)
      return x(!1);
    if (Na = !1, i && !m.disabled && (c ? f || (p = Re !== Ue) : qe === this || (this.lastPutMode = xa.checkPull(this, i, le, a)) && u.checkPut(this, i, le, a))) {
      if (h = this._getDirection(a, l) === "vertical", o = Fe(le), I("dragOverValid"), pe.eventCanceled) return k;
      if (p)
        return Re = Ue, V(), this._hideClone(), I("revert"), pe.eventCanceled || (Rt ? Ue.insertBefore(le, Rt) : Ue.appendChild(le)), x(!0);
      var S = Il(t, m.draggable);
      if (!S || hs(a, h, this) && !S.animated) {
        if (S === le)
          return x(!1);
        if (S && t === a.target && (l = S), l && (r = Fe(l)), Ta(Ue, t, le, o, l, r, a, !!l) !== !1)
          return V(), S && S.nextSibling ? t.insertBefore(le, S.nextSibling) : t.appendChild(le), Re = t, A(), x(!0);
      } else if (S && bs(a, h, this)) {
        var oe = Qt(t, 0, m, !0);
        if (oe === le)
          return x(!1);
        if (l = oe, r = Fe(l), Ta(Ue, t, le, o, l, r, a, !1) !== !1)
          return V(), t.insertBefore(le, oe), Re = t, A(), x(!0);
      } else if (l.parentNode === t) {
        r = Fe(l);
        var X = 0, K, de = le.parentNode !== t, Q = !cs(le.animated && le.toRect || o, l.animated && l.toRect || r, h), me = h ? "top" : "left", ge = Yl(l, "top", "top") || Yl(le, "top", "top"), ae = ge ? ge.scrollTop : void 0;
        Kt !== l && (K = r[me], fa = !1, Ca = !Q && m.invertSwap || de), X = gs(a, l, r, h, Q ? 1 : m.swapThreshold, m.invertedSwapThreshold == null ? m.swapThreshold : m.invertedSwapThreshold, Ca, Kt === l);
        var P;
        if (X !== 0) {
          var L = at(le);
          do
            L -= X, P = Re.children[L];
          while (P && (fe(P, "display") === "none" || P === be));
        }
        if (X === 0 || P === l)
          return x(!1);
        Kt = l, ma = X;
        var T = l.nextElementSibling, z = !1;
        z = X === 1;
        var J = Ta(Ue, t, le, o, l, r, a, z);
        if (J !== !1)
          return (J === 1 || J === -1) && (z = J === 1), bl = !0, setTimeout(ps, 30), V(), z && !T ? t.appendChild(le) : l.parentNode.insertBefore(le, z ? T : l), ge && To(ge, 0, ae - ge.scrollTop), Re = le.parentNode, K !== void 0 && !Ca && (Ua = Math.abs(K - Fe(l)[me])), A(), x(!0);
      }
      if (t.contains(le))
        return x(!1);
    }
    return !1;
  },
  _ignoreWhileAnimating: null,
  _offMoveEvents: function() {
    Ve(document, "mousemove", this._onTouchMove), Ve(document, "touchmove", this._onTouchMove), Ve(document, "pointermove", this._onTouchMove), Ve(document, "dragover", Ot), Ve(document, "mousemove", Ot), Ve(document, "touchmove", Ot);
  },
  _offUpEvents: function() {
    var a = this.el.ownerDocument;
    Ve(a, "mouseup", this._onDrop), Ve(a, "touchend", this._onDrop), Ve(a, "pointerup", this._onDrop), Ve(a, "pointercancel", this._onDrop), Ve(a, "touchcancel", this._onDrop), Ve(document, "selectstart", this);
  },
  _onDrop: function(a) {
    var t = this.el, l = this.options;
    if (_e = at(le), xt = at(le, l.draggable), Xe("drop", this, {
      evt: a
    }), Re = le && le.parentNode, _e = at(le), xt = at(le, l.draggable), pe.eventCanceled) {
      this._nulling();
      return;
    }
    Gt = !1, Ca = !1, fa = !1, clearInterval(this._loopId), clearTimeout(this._dragStartTimer), hl(this.cloneId), hl(this._dragStartId), this.nativeDraggable && (Ve(document, "drop", this), Ve(t, "dragstart", this._onDragStart)), this._offMoveEvents(), this._offUpEvents(), ua && fe(document.body, "user-select", ""), fe(le, "transform", ""), a && (oa && (a.cancelable && a.preventDefault(), !l.dropBubble && a.stopPropagation()), be && be.parentNode && be.parentNode.removeChild(be), (Ue === Re || qe && qe.lastPutMode !== "clone") && Ae && Ae.parentNode && Ae.parentNode.removeChild(Ae), le && (this.nativeDraggable && Ve(le, "dragend", this), nl(le), le.style["will-change"] = "", oa && !Gt && Qe(le, qe ? qe.options.ghostClass : this.options.ghostClass, !1), Qe(le, this.options.chosenClass, !1), He({
      sortable: this,
      name: "unchoose",
      toEl: Re,
      newIndex: null,
      newDraggableIndex: null,
      originalEvent: a
    }), Ue !== Re ? (_e >= 0 && (He({
      rootEl: Re,
      name: "add",
      toEl: Re,
      fromEl: Ue,
      originalEvent: a
    }), He({
      sortable: this,
      name: "remove",
      toEl: Re,
      originalEvent: a
    }), He({
      rootEl: Re,
      name: "sort",
      toEl: Re,
      fromEl: Ue,
      originalEvent: a
    }), He({
      sortable: this,
      name: "sort",
      toEl: Re,
      originalEvent: a
    })), qe && qe.save()) : _e !== Xt && _e >= 0 && (He({
      sortable: this,
      name: "update",
      toEl: Re,
      originalEvent: a
    }), He({
      sortable: this,
      name: "sort",
      toEl: Re,
      originalEvent: a
    })), pe.active && ((_e == null || _e === -1) && (_e = Xt, xt = va), He({
      sortable: this,
      name: "end",
      toEl: Re,
      originalEvent: a
    }), this.save()))), this._nulling();
  },
  _nulling: function() {
    Xe("nulling", this), Ue = le = Re = be = Rt = Ae = Da = Ct = At = it = oa = _e = xt = Xt = va = Kt = ma = qe = xa = pe.dragged = pe.ghost = pe.clone = pe.active = null;
    var a = this.el;
    Fa.forEach(function(t) {
      a.contains(t) && (t.checked = !0);
    }), Fa.length = ll = ol = 0;
  },
  handleEvent: function(a) {
    switch (a.type) {
      case "drop":
      case "dragend":
        this._onDrop(a);
        break;
      case "dragenter":
      case "dragover":
        le && (this._onDragOver(a), fs(a));
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
    for (var a = [], t, l = this.el.children, o = 0, r = l.length, p = this.options; o < r; o++)
      t = l[o], nt(t, p.draggable, this.el, !1) && a.push(t.getAttribute(p.dataIdAttr) || ks(t));
    return a;
  },
  /**
   * Sorts the elements according to the array.
   * @param  {String[]}  order  order of the items
   */
  sort: function(a, t) {
    var l = {}, o = this.el;
    this.toArray().forEach(function(r, p) {
      var m = o.children[p];
      nt(m, this.options.draggable, o, !1) && (l[r] = m);
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
    return nt(a, t || this.options.draggable, this.el, !1);
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
    var o = ga.modifyOption(this, a, t);
    typeof o < "u" ? l[a] = o : l[a] = t, a === "group" && Ao(l);
  },
  /**
   * Destroy
   */
  destroy: function() {
    Xe("destroy", this);
    var a = this.el;
    a[Je] = null, Ve(a, "mousedown", this._onTapStart), Ve(a, "touchstart", this._onTapStart), Ve(a, "pointerdown", this._onTapStart), this.nativeDraggable && (Ve(a, "dragover", this), Ve(a, "dragenter", this)), Array.prototype.forEach.call(a.querySelectorAll("[draggable]"), function(t) {
      t.removeAttribute("draggable");
    }), this._onDrop(), this._disableDelayedDragEvents(), Ma.splice(Ma.indexOf(this.el), 1), this.el = a = null;
  },
  _hideClone: function() {
    if (!Ct) {
      if (Xe("hideClone", this), pe.eventCanceled) return;
      fe(Ae, "display", "none"), this.options.removeCloneOnHide && Ae.parentNode && Ae.parentNode.removeChild(Ae), Ct = !0;
    }
  },
  _showClone: function(a) {
    if (a.lastPutMode !== "clone") {
      this._hideClone();
      return;
    }
    if (Ct) {
      if (Xe("showClone", this), pe.eventCanceled) return;
      le.parentNode == Ue && !this.options.group.revertClone ? Ue.insertBefore(Ae, le) : Rt ? Ue.insertBefore(Ae, Rt) : Ue.appendChild(Ae), this.options.group.revertClone && this.animate(le, Ae), fe(Ae, "display", ""), Ct = !1;
    }
  }
};
function fs(e) {
  e.dataTransfer && (e.dataTransfer.dropEffect = "move"), e.cancelable && e.preventDefault();
}
function Ta(e, a, t, l, o, r, p, m) {
  var u, i = e[Je], c = i.options.onMove, f;
  return window.CustomEvent && !wt && !ha ? u = new CustomEvent("move", {
    bubbles: !0,
    cancelable: !0
  }) : (u = document.createEvent("Event"), u.initEvent("move", !0, !0)), u.to = a, u.from = e, u.dragged = t, u.draggedRect = l, u.related = o || a, u.relatedRect = r || Fe(a), u.willInsertAfter = m, u.originalEvent = p, e.dispatchEvent(u), c && (f = c.call(i, u, p)), f;
}
function nl(e) {
  e.draggable = !1;
}
function ps() {
  bl = !1;
}
function bs(e, a, t) {
  var l = Fe(Qt(t.el, 0, t.options, !0)), o = Do(t.el, t.options, be), r = 10;
  return a ? e.clientX < o.left - r || e.clientY < l.top && e.clientX < l.right : e.clientY < o.top - r || e.clientY < l.bottom && e.clientX < l.left;
}
function hs(e, a, t) {
  var l = Fe(Il(t.el, t.options.draggable)), o = Do(t.el, t.options, be), r = 10;
  return a ? e.clientX > o.right + r || e.clientY > l.bottom && e.clientX > l.left : e.clientY > o.bottom + r || e.clientX > l.right && e.clientY > l.top;
}
function gs(e, a, t, l, o, r, p, m) {
  var u = l ? e.clientY : e.clientX, i = l ? t.height : t.width, c = l ? t.top : t.left, f = l ? t.bottom : t.right, y = !1;
  if (!p) {
    if (m && Ua < i * o) {
      if (!fa && (ma === 1 ? u > c + i * r / 2 : u < f - i * r / 2) && (fa = !0), fa)
        y = !0;
      else if (ma === 1 ? u < c + Ua : u > f - Ua)
        return -ma;
    } else if (u > c + i * (1 - o) / 2 && u < f - i * (1 - o) / 2)
      return ys(a);
  }
  return y = y || p, y && (u < c + i * r / 2 || u > f - i * r / 2) ? u > c + i / 2 ? 1 : -1 : 0;
}
function ys(e) {
  return at(le) < at(e) ? 1 : -1;
}
function ks(e) {
  for (var a = e.tagName + e.className + e.src + e.href + e.textContent, t = a.length, l = 0; t--; )
    l += a.charCodeAt(t);
  return l.toString(36);
}
function ws(e) {
  Fa.length = 0;
  for (var a = e.getElementsByTagName("input"), t = a.length; t--; ) {
    var l = a[t];
    l.checked && Fa.push(l);
  }
}
function Ea(e) {
  return setTimeout(e, 0);
}
function hl(e) {
  return clearTimeout(e);
}
qa && $e(document, "touchmove", function(e) {
  (pe.active || Gt) && e.cancelable && e.preventDefault();
});
pe.utils = {
  on: $e,
  off: Ve,
  css: fe,
  find: Co,
  is: function(a, t) {
    return !!nt(a, t, a, !1);
  },
  extend: ls,
  throttle: So,
  closest: nt,
  toggleClass: Qe,
  clone: Io,
  index: at,
  nextTick: Ea,
  cancelNextTick: hl,
  detectDirection: Eo,
  getChild: Qt,
  expando: Je
};
pe.get = function(e) {
  return e[Je];
};
pe.mount = function() {
  for (var e = arguments.length, a = new Array(e), t = 0; t < e; t++)
    a[t] = arguments[t];
  a[0].constructor === Array && (a = a[0]), a.forEach(function(l) {
    if (!l.prototype || !l.prototype.constructor)
      throw "Sortable: Mounted plugin must be a constructor function, not ".concat({}.toString.call(l));
    l.utils && (pe.utils = mt(mt({}, pe.utils), l.utils)), ga.mount(l);
  });
};
pe.create = function(e, a) {
  return new pe(e, a);
};
pe.version = ts;
var Me = [], ia, gl, yl = !1, sl, rl, La, na;
function Vs() {
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
      this.sortable.nativeDraggable ? $e(document, "dragover", this._handleAutoScroll) : this.options.supportPointer ? $e(document, "pointermove", this._handleFallbackAutoScroll) : l.touches ? $e(document, "touchmove", this._handleFallbackAutoScroll) : $e(document, "mousemove", this._handleFallbackAutoScroll);
    },
    dragOverCompleted: function(t) {
      var l = t.originalEvent;
      !this.options.dragOverBubble && !l.rootEl && this._handleAutoScroll(l);
    },
    drop: function() {
      this.sortable.nativeDraggable ? Ve(document, "dragover", this._handleAutoScroll) : (Ve(document, "pointermove", this._handleFallbackAutoScroll), Ve(document, "touchmove", this._handleFallbackAutoScroll), Ve(document, "mousemove", this._handleFallbackAutoScroll)), _l(), Aa(), os();
    },
    nulling: function() {
      La = gl = ia = yl = na = sl = rl = null, Me.length = 0;
    },
    _handleFallbackAutoScroll: function(t) {
      this._handleAutoScroll(t, !0);
    },
    _handleAutoScroll: function(t, l) {
      var o = this, r = (t.touches ? t.touches[0] : t).clientX, p = (t.touches ? t.touches[0] : t).clientY, m = document.elementFromPoint(r, p);
      if (La = t, l || this.options.forceAutoScrollFallback || ha || wt || ua) {
        dl(t, this.options, m, l);
        var u = St(m, !0);
        yl && (!na || r !== sl || p !== rl) && (na && _l(), na = setInterval(function() {
          var i = St(document.elementFromPoint(r, p), !0);
          i !== u && (u = i, Aa()), dl(t, o.options, i, l);
        }, 10), sl = r, rl = p);
      } else {
        if (!this.options.bubbleScroll || St(m, !0) === vt()) {
          Aa();
          return;
        }
        dl(t, this.options, St(m, !1), !1);
      }
    }
  }, yt(e, {
    pluginName: "scroll",
    initializeByDefault: !0
  });
}
function Aa() {
  Me.forEach(function(e) {
    clearInterval(e.pid);
  }), Me = [];
}
function _l() {
  clearInterval(na);
}
var dl = So(function(e, a, t, l) {
  if (a.scroll) {
    var o = (e.touches ? e.touches[0] : e).clientX, r = (e.touches ? e.touches[0] : e).clientY, p = a.scrollSensitivity, m = a.scrollSpeed, u = vt(), i = !1, c;
    gl !== t && (gl = t, Aa(), ia = a.scroll, c = a.scrollFn, ia === !0 && (ia = St(t, !0)));
    var f = 0, y = ia;
    do {
      var h = y, $ = Fe(h), k = $.top, I = $.bottom, V = $.left, x = $.right, A = $.width, S = $.height, oe = void 0, X = void 0, K = h.scrollWidth, de = h.scrollHeight, Q = fe(h), me = h.scrollLeft, ge = h.scrollTop;
      h === u ? (oe = A < K && (Q.overflowX === "auto" || Q.overflowX === "scroll" || Q.overflowX === "visible"), X = S < de && (Q.overflowY === "auto" || Q.overflowY === "scroll" || Q.overflowY === "visible")) : (oe = A < K && (Q.overflowX === "auto" || Q.overflowX === "scroll"), X = S < de && (Q.overflowY === "auto" || Q.overflowY === "scroll"));
      var ae = oe && (Math.abs(x - o) <= p && me + A < K) - (Math.abs(V - o) <= p && !!me), P = X && (Math.abs(I - r) <= p && ge + S < de) - (Math.abs(k - r) <= p && !!ge);
      if (!Me[f])
        for (var L = 0; L <= f; L++)
          Me[L] || (Me[L] = {});
      (Me[f].vx != ae || Me[f].vy != P || Me[f].el !== h) && (Me[f].el = h, Me[f].vx = ae, Me[f].vy = P, clearInterval(Me[f].pid), (ae != 0 || P != 0) && (i = !0, Me[f].pid = setInterval(function() {
        l && this.layer === 0 && pe.active._onTouchMove(La);
        var T = Me[this.layer].vy ? Me[this.layer].vy * m : 0, z = Me[this.layer].vx ? Me[this.layer].vx * m : 0;
        typeof c == "function" && c.call(pe.dragged.parentNode[Je], z, T, e, La, Me[this.layer].el) !== "continue" || To(Me[this.layer].el, z, T);
      }.bind({
        layer: f
      }), 24))), f++;
    } while (a.bubbleScroll && y !== u && (y = St(y, !1)));
    yl = i;
  }
}, 30), Ro = function(a) {
  var t = a.originalEvent, l = a.putSortable, o = a.dragEl, r = a.activeSortable, p = a.dispatchSortableEvent, m = a.hideGhostForTarget, u = a.unhideGhostForTarget;
  if (t) {
    var i = l || r;
    m();
    var c = t.changedTouches && t.changedTouches.length ? t.changedTouches[0] : t, f = document.elementFromPoint(c.clientX, c.clientY);
    u(), i && !i.el.contains(f) && (p("spill"), this.onSpill({
      dragEl: o,
      putSortable: l
    }));
  }
};
function Dl() {
}
Dl.prototype = {
  startIndex: null,
  dragStart: function(a) {
    var t = a.oldDraggableIndex;
    this.startIndex = t;
  },
  onSpill: function(a) {
    var t = a.dragEl, l = a.putSortable;
    this.sortable.captureAnimationState(), l && l.captureAnimationState();
    var o = Qt(this.sortable.el, this.startIndex, this.options);
    o ? this.sortable.el.insertBefore(t, o) : this.sortable.el.appendChild(t), this.sortable.animateAll(), l && l.animateAll();
  },
  drop: Ro
};
yt(Dl, {
  pluginName: "revertOnSpill"
});
function Ul() {
}
Ul.prototype = {
  onSpill: function(a) {
    var t = a.dragEl, l = a.putSortable, o = l || this.sortable;
    o.captureAnimationState(), t.parentNode && t.parentNode.removeChild(t), o.animateAll();
  },
  drop: Ro
};
yt(Ul, {
  pluginName: "removeOnSpill"
});
pe.mount(new Vs());
pe.mount(Ul, Dl);
function $s(e, a) {
  const t = e.oldDraggableIndex ?? e.oldIndex;
  e.item.remove();
  const l = [...e.from.children].filter((o) => o.matches(a));
  e.from.insertBefore(e.item, l[t ?? l.length] ?? null);
}
function No(e) {
  const a = /* @__PURE__ */ new Map();
  function t(l) {
    a.get(l)?.destroy(), a.delete(l);
  }
  return kt(() => {
    for (const l of a.keys()) t(l);
  }), {
    mounted(l) {
      const o = l.querySelector(".work-field-builder") ?? l;
      a.set(l, new pe(o, {
        draggable: ".work-reorder-entry",
        handle: ".work-reorder-handle",
        forceFallback: !0,
        fallbackOnBody: !1,
        ghostClass: "work-drag-ghost",
        onEnd(r) {
          const p = r.oldDraggableIndex, m = r.newDraggableIndex;
          $s(r, ".work-reorder-entry"), p !== void 0 && m !== void 0 && p !== m && e(p, m);
        }
      }));
    },
    unmounted: t
  };
}
const xs = { class: "work-stack work-tight work-option-builder" }, Cs = { class: "work-stack work-tight" }, Ss = { class: "work-stack work-tight work-small" }, Ts = { class: "work-stack work-tight work-small" }, Is = { class: "work-stack work-tight" }, Ds = { class: "work-stack work-tight work-small" }, Us = { class: "work-row" }, Es = { class: "work-stack work-tight work-small" }, As = { class: "work-row" }, Os = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, Ps = { class: "work-add-option" }, Rs = {
  key: 0,
  class: "work-muted work-small"
}, Ns = /* @__PURE__ */ ke({
  __name: "OptionsEditor",
  props: {
    field: {}
  },
  emits: ["validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = "options:" + Ba(), r = W(() => t.field.options ?? []), p = W(() => r.value.every((f, y) => !!f.id && r.value.findIndex((h) => h.id === f.id) === y));
    Ie(p, (f) => l("validity", f, o), { immediate: !0 }), kt(() => l("validity", !0, o));
    function m(f, y) {
      fo(r.value, f, y - f), r.value.forEach((h, $) => h.order = $);
    }
    const u = No(m), i = ["primary", "success", "info", "warn", "danger", "secondary"];
    function c() {
      let f = r.value.length + 1;
      for (; r.value.some((y) => y.id === `option_${f}`); ) f++;
      (t.field.options ??= []).push({ id: `option_${f}`, label: "New option", order: r.value.length });
    }
    return (f, y) => (n(), b("section", xs, [
      y[4] || (y[4] = d("header", { class: "work-row" }, [
        d("h4", null, "Options"),
        d("span", { class: "work-muted work-small" }, "Renaming a choice keeps it selected on existing items."),
        d("span", { class: "work-spacer" })
      ], -1)),
      ct((n(), b("div", Cs, [
        (n(!0), b(te, null, re(r.value, (h, $) => (n(), b("div", {
          key: $,
          class: "work-option-row work-reorder-entry"
        }, [
          g(s(Z), {
            type: "button",
            class: "work-icon-button work-reorder-handle",
            "aria-label": "Drag option; arrow keys reorder",
            onKeydown: [
              Ee(Te((k) => m($, $ - 1), ["prevent"]), ["up"]),
              Ee(Te((k) => m($, $ + 1), ["prevent"]), ["down"])
            ],
            severity: "secondary",
            text: "",
            size: "small"
          }, {
            default: j(() => [
              g(s(ce), {
                icon: "tabler:grip-vertical",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["onKeydown"]),
          d("label", Ss, [
            y[0] || (y[0] = F("Label", -1)),
            g(s(ye), {
              modelValue: h.label,
              "onUpdate:modelValue": (k) => h.label = k,
              "aria-label": "Option label"
            }, null, 8, ["modelValue", "onUpdate:modelValue"])
          ]),
          g(Le, {
            class: "work-disclosure",
            label: "Advanced"
          }, {
            default: j(() => [
              d("label", Ts, [
                y[1] || (y[1] = F("Integration identifier", -1)),
                g(s(ye), {
                  modelValue: h.id,
                  "onUpdate:modelValue": (k) => h.id = k,
                  class: "work-option-code",
                  required: "",
                  "aria-label": "Option ID"
                }, null, 8, ["modelValue", "onUpdate:modelValue"])
              ])
            ]),
            _: 2
          }, 1024),
          d("div", Is, [
            d("label", Ds, [
              y[2] || (y[2] = F("Color", -1)),
              d("span", Us, [
                d("span", {
                  class: st(["work-color-swatch", "work-swatch-" + (h.color || "secondary")]),
                  "aria-hidden": "true"
                }, null, 2),
                g(s(ve), {
                  modelValue: h.color,
                  "onUpdate:modelValue": (k) => h.color = k,
                  "aria-label": "Option color",
                  appendTo: "self",
                  optionLabel: "label",
                  optionValue: "value",
                  optionDisabled: "disabled",
                  options: [{ label: "Default", value: void 0, disabled: !1 }, ...(i ?? []).map((k) => ({ label: k, value: k, disabled: !1 }))]
                }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
              ])
            ]),
            d("label", Es, [
              y[3] || (y[3] = F("Category", -1)),
              g(s(ve), {
                "model-value": h.category,
                "aria-label": "Option category",
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                showClear: "",
                options: ["triage", "backlog", ...s(mo)].map((k) => ({ label: s(Bt)(k), value: k })),
                "onUpdate:modelValue": (k) => h.category = k || void 0
              }, null, 8, ["model-value", "options", "onUpdate:modelValue"])
            ])
          ]),
          d("div", As, [
            g(s(Z), {
              "aria-label": "Option earlier",
              severity: "secondary",
              size: "small",
              disabled: $ === 0,
              onClick: (k) => m($, $ - 1),
              text: ""
            }, {
              default: j(() => [
                g(s(ce), {
                  icon: "tabler:arrow-up",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["disabled", "onClick"]),
            g(s(Z), {
              "aria-label": "Option later",
              severity: "secondary",
              size: "small",
              disabled: $ === r.value.length - 1,
              onClick: (k) => m($, $ + 1),
              text: ""
            }, {
              default: j(() => [
                g(s(ce), {
                  icon: "tabler:arrow-down",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["disabled", "onClick"]),
            g(s(Z), {
              label: "Remove",
              "aria-label": "Remove option",
              severity: "secondary",
              text: "",
              size: "small",
              onClick: (k) => r.value.splice($, 1)
            }, {
              icon: j(() => [
                g(s(ce), {
                  icon: "tabler:trash",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["onClick"])
          ])
        ]))), 128)),
        p.value ? U("", !0) : (n(), b("p", Os, "Each choice needs a unique integration identifier.")),
        d("div", Ps, [
          g(s(Z), {
            label: "Add option",
            severity: "secondary",
            size: "small",
            onClick: c,
            outlined: ""
          }, {
            icon: j(() => [
              g(s(ce), {
                icon: "tabler:plus",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          })
        ])
      ])), [
        [s(u)]
      ]),
      r.value.length ? U("", !0) : (n(), b("p", Rs, "Add the choices people can select for this field."))
    ]));
  }
}), Ms = {
  class: "work-stack",
  "aria-label": "Fields editor"
}, Fs = { class: "work-form-actions work-wrap" }, Ls = { class: "work-stack work-tight" }, Bs = { class: "work-stack work-tight" }, zs = { class: "work-dialog-actions" }, js = {
  key: 1,
  class: "work-settings-card work-muted"
}, Ws = { class: "work-muted work-small" }, qs = {
  key: 0,
  class: "work-error work-small",
  role: "alert"
}, Ks = { class: "work-settings-grid work-field-properties" }, Gs = { class: "work-stack work-tight" }, Hs = { class: "work-stack work-tight" }, Ys = { class: "work-stack work-tight" }, Xs = {
  key: 1,
  class: "work-stack work-tight"
}, Js = {
  key: 4,
  class: "work-stack work-tight"
}, Zs = {
  key: 5,
  class: "work-stack work-tight"
}, Qs = { class: "work-stack work-tight" }, _s = { class: "work-stack work-tight" }, er = { class: "work-stack work-tight" }, tr = { class: "work-stack work-tight" }, ar = { class: "work-stack" }, lr = { class: "work-stack work-tight" }, or = { class: "work-stack work-tight" }, ir = { class: "work-stack work-tight work-field-history" }, nr = { class: "work-settings-list" }, sr = { class: "work-settings-row" }, rr = { class: "work-settings-row" }, dr = { class: "work-stack" }, ur = /* @__PURE__ */ ke({
  __name: "FieldsEditor",
  props: {
    draft: {},
    guardRemoval: { type: Function },
    issues: {},
    boardId: {},
    installedTypes: {},
    itemType: {}
  },
  emits: ["validity", "update:itemType"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = W(() => t.draft.fields ?? []), r = M(), p = M(""), m = M(!1), u = M("text"), i = M([]), c = W(() => (t.draft.item_types ?? []).map((q) => ({ value: q.id, label: q.title || Ne(q.id) }))), f = W(() => t.draft.item_types?.find((q) => q.id === t.itemType)), y = W(() => o.value.map((q, v) => ({ field: q, index: v })).filter(({ field: q }) => !f.value || f.value.fields.includes(q.code))), h = M(""), $ = M({}), k = No((q, v) => {
      const w = y.value[q]?.index, _ = y.value[v]?.index;
      w !== void 0 && _ !== void 0 && J(w, _ - w);
    });
    function I(q) {
      return (t.draft.item_types ?? []).filter((v) => v.fields.includes(q)).map((v) => v.title || Ne(v.id));
    }
    async function V(q) {
      if (!h.value) {
        h.value = q.code;
        try {
          const v = await t.guardRemoval?.("fields", q.code);
          $.value[q.code] = v ?? "", v || ba(t.draft, "fields", q.code);
        } finally {
          h.value = "";
        }
      }
    }
    const x = Object.entries({ text: "Text", int: "Whole number", dec: "Decimal number", quantity: "Measurement", bool: "Yes or no", time: "Date or time", ref: "Reference", record: "Structured data", option: "Choice", principal: "Person or group", item: "Work item", rank: "Order", rich_text: "Formatted text", formula: "Formula", rollup: "Related item calculation", counter: "Counter" }).map(([q, v]) => ({ value: q, label: v })), A = [{ label: "None", value: "none" }, { label: "Exact matches", value: "key" }, { label: "Numeric ranges", value: "number" }], S = ["int", "dec", "quantity"], oe = W(() => new Map(t.installedTypes?.map((q) => [q.id, q]))), X = W(() => [...x, ...(t.installedTypes ?? []).map((q) => ({ value: q.id, label: q.title }))]), K = {};
    function de(q) {
      return q.type && q.type !== "value" ? q.type : q.form ?? "text";
    }
    function Q(q) {
      return q.type ? oe.value.get(q.type) : void 0;
    }
    function me(q) {
      const v = Q(q)?.config_schema;
      return v && bo(v).length ? v : void 0;
    }
    function ge(q) {
      const v = Q(q);
      return !!v?.config_schema || ["dec", "quantity", "ref", "time", "record"].includes(v?.form ?? q.form ?? "") || !!q.config;
    }
    function ae(q) {
      const v = Q(q), w = v?.form ?? q.form ?? "text";
      return A.filter(({ value: _ }) => _ === "none" || (!v?.indexes || v.indexes.includes(_)) && w !== "record" && (_ !== "number" || S.includes(w) || q.type === "option"));
    }
    function P(q) {
      q.index && !ae(q).some((v) => v.value === q.index) && delete q.index;
    }
    function L(q, v) {
      const w = oe.value.get(v);
      if (w) {
        if (w.id === q.type) return;
        q.type = w.id, q.form = w.form, delete q.options, delete q.config, P(q);
        return;
      }
      Q(q) && delete q.config;
      const _ = { option: "text", principal: "ref", item: "ref", rank: "text", rich_text: "text", formula: "int", rollup: "int", counter: "int" };
      _[v] ? (q.type = v, q.form = _[v]) : (delete q.type, q.form = v), v !== "option" ? delete q.options : q.options ??= [], v === "rich_text" && (q.config = { format: "json" }), P(q);
    }
    function T(q, v) {
      q.form = v, P(q);
    }
    function z(q, v) {
      const w = { ...q.config };
      v ? w.item_type = v : delete w.item_type, q.config = Object.keys(w).length ? w : void 0;
    }
    function J(q, v) {
      fo(o.value, q, v);
      for (const w of t.draft.item_types ?? []) {
        const _ = new Set(w.fields);
        w.fields = o.value.filter((R) => _.has(R.code)).map((R) => R.code);
      }
    }
    function ue(q, v) {
      try {
        ci(t.draft, q, v.value), delete $.value[q.code];
      } catch (w) {
        $.value[q.code] = w.message, v.value = q.code;
      }
    }
    async function se() {
      p.value = "", u.value = "text", i.value = f.value ? [f.value.id] : [], m.value = !0, await Ht(), r.value?.querySelector("input")?.focus();
    }
    function Oe() {
      const q = p.value.trim();
      if (!q) return;
      const v = q.normalize("NFKD").replace(/\p{Mark}/gu, "").toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, ""), w = (/^[a-z]/.test(v) ? v : `field_${v || "new"}`).slice(0, 40);
      let _ = w, R = 2;
      for (; o.value.some((O) => O.code === _); ) {
        const O = "_" + R++;
        _ = w.slice(0, 40 - O.length) + O;
      }
      const B = { code: _, title: q, form: "text", cardinality: "one" };
      L(B, u.value), (t.draft.fields ??= []).push(B);
      for (const O of t.draft.item_types ?? []) i.value.includes(O.id) && O.fields.push(_);
      f.value && !i.value.includes(f.value.id) && l("update:itemType", ""), De.value = _, m.value = !1;
    }
    const De = M("");
    return (q, v) => (n(), b("section", Ms, [
      d("div", Fs, [
        g(s(ve), {
          "model-value": f.value?.id ?? "",
          "aria-label": "Filter fields by item type",
          placeholder: "All item types",
          appendTo: "self",
          optionLabel: "label",
          optionValue: "value",
          options: [{ value: "", label: "All item types" }, ...c.value],
          "onUpdate:modelValue": v[0] || (v[0] = (w) => l("update:itemType", w))
        }, null, 8, ["model-value", "options"]),
        g(s(Z), {
          label: "Add field",
          "aria-expanded": m.value,
          disabled: m.value,
          onClick: se
        }, {
          icon: j(() => [
            g(s(ce), {
              icon: "tabler:plus",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        }, 8, ["aria-expanded", "disabled"])
      ]),
      m.value ? (n(), b("section", {
        key: 0,
        ref_key: "addArea",
        ref: r,
        class: "work-settings-card work-stack",
        "aria-label": "Add field",
        onKeydown: v[5] || (v[5] = Ee(Te((w) => m.value = !1, ["stop"]), ["esc"]))
      }, [
        v[9] || (v[9] = d("header", null, [
          d("h3", null, "Add field"),
          d("p", { class: "work-muted" }, "Choose what the field captures and which items show it.")
        ], -1)),
        d("label", Ls, [
          v[7] || (v[7] = F("Field name", -1)),
          g(s(ye), {
            modelValue: p.value,
            "onUpdate:modelValue": v[1] || (v[1] = (w) => p.value = w),
            "aria-label": "Field name",
            maxlength: "255",
            onKeydown: Ee(Te(Oe, ["prevent"]), ["enter"])
          }, null, 8, ["modelValue", "onKeydown"])
        ]),
        d("label", Bs, [
          v[8] || (v[8] = F("Kind", -1)),
          g(s(ve), {
            modelValue: u.value,
            "onUpdate:modelValue": v[2] || (v[2] = (w) => u.value = w),
            "aria-label": "New field kind",
            appendTo: "self",
            options: X.value,
            optionLabel: "label",
            optionValue: "value"
          }, null, 8, ["modelValue", "options"])
        ]),
        c.value.length ? (n(), H(rt, {
          key: 0,
          label: "Show on item types",
          options: c.value,
          modelValue: i.value,
          "onUpdate:modelValue": v[3] || (v[3] = (w) => i.value = w)
        }, null, 8, ["options", "modelValue"])) : U("", !0),
        d("footer", zs, [
          g(s(Z), {
            label: "Cancel",
            severity: "secondary",
            outlined: "",
            onClick: v[4] || (v[4] = (w) => m.value = !1)
          }),
          g(s(Z), {
            label: "Add to draft",
            disabled: !p.value.trim(),
            onClick: Oe
          }, null, 8, ["disabled"])
        ])
      ], 544)) : U("", !0),
      y.value.length ? U("", !0) : (n(), b("p", js, "No fields here yet. Add a field to capture information.")),
      ct((n(), H(Wa, {
        columns: "fields",
        count: y.value.length
      }, {
        default: j(() => [
          (n(!0), b(te, null, re(y.value, ({ field: w, index: _ }) => (n(), H(ja, {
            title: s(Ge)(w),
            "initial-open": De.value === w.code,
            kind: Q(w)?.title || s(x).find((R) => R.value === de(w))?.label || s(Ne)(de(w)),
            key: w.id ?? _,
            class: "work-field-row work-reorder-entry work-stack"
          }, {
            handle: j(() => [
              g(s(Z), {
                type: "button",
                class: "work-reorder-handle work-icon-button",
                "aria-label": "Drag " + s(Ge)(w) + " or use the arrow keys to reorder",
                onKeydown: [
                  Ee(Te((R) => J(_, -1), ["prevent"]), ["up"]),
                  Ee(Te((R) => J(_, 1), ["prevent"]), ["down"])
                ],
                severity: "secondary",
                text: "",
                size: "small"
              }, {
                default: j(() => [
                  g(s(ce), {
                    icon: "tabler:grip-vertical",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["aria-label", "onKeydown"])
            ]),
            flags: j(() => [
              w.track ? (n(), H(s(Ye), {
                key: 0,
                class: "kx-tag-sm",
                severity: "secondary",
                value: "Tracked"
              })) : U("", !0),
              w.intervals ? (n(), H(s(Ye), {
                key: 1,
                class: "kx-tag-sm",
                severity: "secondary",
                value: "Intervals"
              })) : U("", !0)
            ]),
            usage: j(() => [
              d("span", Ws, E(I(w.code).length ? I(w.code).join(", ") : "Unused"), 1)
            ]),
            actions: j(() => [
              g(s(Z), {
                "aria-label": "Move " + s(Ge)(w) + " earlier",
                severity: "secondary",
                disabled: _ === 0,
                onClick: (R) => J(_, -1),
                text: "",
                size: "small"
              }, {
                default: j(() => [
                  g(s(ce), {
                    icon: "tabler:arrow-up",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["aria-label", "disabled", "onClick"]),
              g(s(Z), {
                "aria-label": "Move " + s(Ge)(w) + " later",
                severity: "secondary",
                disabled: _ === o.value.length - 1,
                onClick: (R) => J(_, 1),
                text: "",
                size: "small"
              }, {
                default: j(() => [
                  g(s(ce), {
                    icon: "tabler:arrow-down",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["aria-label", "disabled", "onClick"])
            ]),
            default: j(() => [
              $.value[w.code] ? (n(), b("p", qs, E($.value[w.code]), 1)) : U("", !0),
              (n(!0), b(te, null, re(e.issues?.filter((R) => R.code === w.code) ?? [], (R) => (n(), b("p", {
                key: R.what,
                class: "work-error work-small",
                role: "alert"
              }, E(s(za)(R)), 1))), 128)),
              d("div", Ks, [
                d("label", Gs, [
                  v[10] || (v[10] = F("Title", -1)),
                  g(s(ye), {
                    modelValue: w.title,
                    "onUpdate:modelValue": (R) => w.title = R,
                    "aria-label": "Field title",
                    maxlength: "255",
                    placeholder: s(Ge)(w)
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder"])
                ]),
                d("label", Hs, [
                  v[11] || (v[11] = F("Kind", -1)),
                  g(s(ve), {
                    "aria-label": "Kind",
                    "model-value": de(w),
                    "onUpdate:modelValue": (R) => L(w, R),
                    appendTo: "self",
                    options: X.value,
                    optionLabel: "label",
                    optionValue: "value"
                  }, null, 8, ["model-value", "onUpdate:modelValue", "options"])
                ]),
                d("label", Ys, [
                  v[12] || (v[12] = F("Values allowed", -1)),
                  g(s(ve), {
                    "aria-label": "Values allowed",
                    "model-value": w.cardinality ?? "one",
                    "onUpdate:modelValue": (R) => w.cardinality = R,
                    appendTo: "self",
                    options: [{ label: "One value", value: "one" }, { label: "Multiple unique values", value: "set" }, { label: "Ordered values", value: "list" }],
                    optionLabel: "label",
                    optionValue: "value"
                  }, null, 8, ["model-value", "onUpdate:modelValue"])
                ])
              ]),
              w.type === "item" ? (n(), b("label", Xs, [
                v[13] || (v[13] = F("Which items can be referenced? ", -1)),
                g(s(ve), {
                  "model-value": w.config?.item_type ?? "",
                  "aria-label": "Reference target",
                  appendTo: "self",
                  optionLabel: "label",
                  optionValue: "value",
                  options: [{ value: "", label: "Any item type" }, ...c.value],
                  "onUpdate:modelValue": (R) => z(w, R)
                }, null, 8, ["model-value", "options", "onUpdate:modelValue"]),
                v[14] || (v[14] = d("span", { class: "work-muted work-small" }, "A reference stores the selected item as a value. To show a named relationship on both items, use Links.", -1))
              ])) : U("", !0),
              me(w) ? (n(), H(po, {
                key: w.type,
                schema: me(w),
                "model-value": w.config ?? K,
                "onUpdate:modelValue": (R) => w.config = R,
                onValidity: (R) => l("validity", "config-" + _, R)
              }, null, 8, ["schema", "model-value", "onUpdate:modelValue", "onValidity"])) : U("", !0),
              w.type === "option" ? (n(), H(Ns, {
                key: 3,
                field: w,
                onValidity: v[6] || (v[6] = (R, B) => l("validity", B, R))
              }, null, 8, ["field"])) : U("", !0),
              w.type === "formula" || w.type === "rollup" ? (n(), b("label", Js, [
                v[15] || (v[15] = F("Result type", -1)),
                g(s(ve), {
                  "model-value": w.form,
                  "onUpdate:modelValue": (R) => T(w, R),
                  "aria-label": "Result type",
                  options: s(x).slice(0, 8),
                  optionLabel: "label",
                  optionValue: "value",
                  appendTo: "self"
                }, null, 8, ["model-value", "onUpdate:modelValue", "options"])
              ])) : U("", !0),
              w.type === "formula" ? (n(), b("label", Zs, [
                v[16] || (v[16] = F("Expression", -1)),
                g(s(ye), {
                  modelValue: w.expression,
                  "onUpdate:modelValue": (R) => w.expression = R,
                  "aria-label": "Expression"
                }, null, 8, ["modelValue", "onUpdate:modelValue"])
              ])) : U("", !0),
              w.type === "rollup" ? (n(), b(te, { key: 6 }, [
                d("label", Qs, [
                  v[17] || (v[17] = F("Of", -1)),
                  g(s(ye), {
                    modelValue: w.of,
                    "onUpdate:modelValue": (R) => w.of = R,
                    "aria-label": "Related items"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                d("label", _s, [
                  v[18] || (v[18] = F("Function", -1)),
                  g(s(ye), {
                    modelValue: w.fn,
                    "onUpdate:modelValue": (R) => w.fn = R,
                    "aria-label": "Calculation"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                d("label", er, [
                  v[19] || (v[19] = F("Field", -1)),
                  g(s(ye), {
                    modelValue: w.field,
                    "onUpdate:modelValue": (R) => w.field = R,
                    "aria-label": "Calculated field"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                d("label", tr, [
                  v[20] || (v[20] = F("Order by", -1)),
                  g(s(ve), {
                    "model-value": w.by,
                    "aria-label": "Rollup order",
                    options: ["rank", "time"],
                    showClear: "",
                    appendTo: "self",
                    "onUpdate:modelValue": (R) => w.by = R || void 0
                  }, null, 8, ["model-value", "onUpdate:modelValue"])
                ]),
                g(Cl, {
                  modelValue: w.where,
                  "onUpdate:modelValue": (R) => w.where = R,
                  draft: e.draft,
                  "board-id": e.boardId,
                  label: "Include related items when",
                  onValidity: (R) => l("validity", "rollup-" + _, R)
                }, null, 8, ["modelValue", "onUpdate:modelValue", "draft", "board-id", "onValidity"])
              ], 64)) : U("", !0),
              g(Le, {
                class: "work-disclosure",
                label: "Advanced field settings"
              }, {
                default: j(() => [
                  d("div", ar, [
                    d("label", lr, [
                      v[21] || (v[21] = F("Field identifier for integrations", -1)),
                      g(s(ye), {
                        value: w.code,
                        "aria-label": "Field code",
                        required: "",
                        pattern: "[a-z][a-z0-9_]*",
                        onInput: (R) => ue(w, R.target)
                      }, null, 8, ["value", "onInput"])
                    ]),
                    d("label", or, [
                      v[22] || (v[22] = F("Allow filters to use", -1)),
                      g(s(ve), {
                        "aria-label": "Allow filters to use",
                        "model-value": w.index ?? "none",
                        "onUpdate:modelValue": (R) => w.index = R,
                        appendTo: "self",
                        options: ae(w),
                        optionLabel: "label",
                        optionValue: "value"
                      }, null, 8, ["model-value", "onUpdate:modelValue", "options"])
                    ]),
                    d("section", ir, [
                      v[25] || (v[25] = d("h4", { class: "work-group-title" }, "History", -1)),
                      d("div", nr, [
                        d("div", sr, [
                          v[23] || (v[23] = d("div", { class: "work-row-main" }, [
                            d("strong", null, "Track changes"),
                            d("p", { class: "work-muted work-small" }, "Record each value change in the item history.")
                          ], -1)),
                          g(s(Ze), {
                            modelValue: w.track,
                            "onUpdate:modelValue": (R) => w.track = R,
                            "aria-label": "Track changes"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        d("div", rr, [
                          v[24] || (v[24] = d("div", { class: "work-row-main" }, [
                            d("strong", null, "Track intervals"),
                            d("p", { class: "work-muted work-small" }, "Measure how long each value stays in effect.")
                          ], -1)),
                          g(s(Ze), {
                            modelValue: w.intervals,
                            "onUpdate:modelValue": (R) => w.intervals = R,
                            "aria-label": "Track intervals"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ])
                      ])
                    ]),
                    !me(w) && ge(w) ? (n(), H(It, {
                      key: 0,
                      label: "Field configuration",
                      "model-value": w.config,
                      shape: "object",
                      "onUpdate:modelValue": (R) => w.config = R,
                      onValidity: (R) => l("validity", "config-" + _, R)
                    }, null, 8, ["model-value", "onUpdate:modelValue", "onValidity"])) : U("", !0),
                    d("section", dr, [
                      v[26] || (v[26] = d("h4", { class: "work-group-title" }, "Access", -1)),
                      (n(), b(te, null, re(["read", "write"], (R) => g(wo, {
                        "board-id": e.boardId,
                        key: R,
                        label: R === "read" ? "Who can read" : "Who can edit",
                        "model-value": w.access?.[R],
                        "onUpdate:modelValue": (B) => w.access = { ...w.access, [R]: B },
                        onValidity: (B) => l("validity", "access-" + _ + R, B)
                      }, null, 8, ["board-id", "label", "model-value", "onUpdate:modelValue", "onValidity"])), 64))
                    ]),
                    g(s(Z), {
                      label: "Remove field",
                      severity: "danger",
                      text: "",
                      disabled: !!h.value,
                      onClick: (R) => V(w)
                    }, null, 8, ["disabled", "onClick"])
                  ])
                ]),
                _: 2
              }, 1024)
            ]),
            _: 2
          }, 1032, ["title", "initial-open", "kind"]))), 128))
        ]),
        _: 1
      }, 8, ["count"])), [
        [s(k)]
      ])
    ]));
  }
}), cr = {
  class: "work-stack",
  "aria-label": "Item types editor"
}, vr = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, mr = { class: "work-definition-meta" }, fr = { class: "work-settings-grid" }, pr = { class: "work-stack work-tight" }, br = { class: "work-stack work-tight" }, hr = { class: "work-stack" }, gr = { class: "work-stack work-tight" }, yr = {
  key: 0,
  class: "work-row work-wrap"
}, kr = { class: "work-stack work-tight" }, wr = {
  key: 1,
  class: "work-stack work-tight work-small"
}, Vr = {
  key: 0,
  class: "kx-empty"
}, $r = { class: "work-row work-add-definition" }, xr = { class: "work-stack work-tight" }, Cr = /* @__PURE__ */ ke({
  __name: "TypesEditor",
  props: {
    draft: {},
    guardRemoval: { type: Function },
    issues: {}
  },
  setup(e) {
    const a = e, t = W(() => a.draft.item_types ?? []), l = M(""), o = M(""), r = M(""), p = W(() => l.value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "").slice(0, 40)), m = W(() => !!l.value.trim());
    function u() {
      const I = /^[a-z]/.test(p.value) ? p.value : "type_" + (p.value || "new");
      let V = I.slice(0, 40), x = 2;
      for (; t.value.some((A) => A.id === V); ) {
        const A = "_" + x++;
        V = I.slice(0, 40 - A.length) + A;
      }
      return V;
    }
    function i() {
      m.value && ((a.draft.item_types ??= []).push({ id: u(), title: l.value.trim(), process: a.draft.processes?.[0]?.id ?? "", fields: [] }), l.value = "");
    }
    function c(I, V) {
      const x = I.id;
      I.id = V;
      for (const A of t.value) A.parent_types && (A.parent_types = A.parent_types.map((S) => S === x ? V : S));
    }
    function f(I, V) {
      I.fields = V, I.inherit && (I.inherit = I.inherit.filter((x) => V.includes(x)));
    }
    function y(I) {
      return (I.parent_types ?? []).filter((V) => typeof V == "string");
    }
    function h(I, V, x) {
      I.parent_types = x && V.length ? [...V, !1] : V;
    }
    function $(I) {
      return t.value.filter((V) => V.id !== I.id && V.parent_types?.includes(I.id)).map((V) => V.title || Ne(V.id));
    }
    async function k(I) {
      if (!r.value) {
        if ($(I).length) {
          o.value = `${I.title || Ne(I.id)} is a parent type for ${$(I).join(", ")}. Remove those parent selections first.`;
          return;
        }
        r.value = I.id, o.value = "";
        try {
          const V = await a.guardRemoval?.("item_types", I.id);
          V ? o.value = V : ba(a.draft, "item_types", I.id);
        } finally {
          r.value = "";
        }
      }
    }
    return (I, V) => (n(), b("section", cr, [
      o.value ? (n(), b("p", vr, E(o.value), 1)) : U("", !0),
      g(Wa, {
        columns: "types",
        count: t.value.length
      }, {
        default: j(() => [
          (n(!0), b(te, null, re(t.value, (x, A) => (n(), H(ja, {
            title: x.title || s(Ne)(x.id),
            kind: e.draft.processes?.find((S) => S.id === x.process)?.name || s(Ne)(x.process),
            key: A,
            class: "work-type-card"
          }, {
            usage: j(() => [
              d("span", mr, [
                g(s(Ye), {
                  class: "kx-tag-sm",
                  severity: "secondary"
                }, {
                  default: j(() => [
                    F(E(x.fields.length) + " " + E(x.fields.length === 1 ? "field" : "fields"), 1)
                  ]),
                  _: 2
                }, 1024),
                $(x).length ? (n(), H(s(Ye), {
                  key: 0,
                  class: "kx-tag-sm",
                  severity: "secondary"
                }, {
                  default: j(() => [
                    F("Parent of " + E($(x).join(", ")), 1)
                  ]),
                  _: 2
                }, 1024)) : U("", !0)
              ])
            ]),
            default: j(() => [
              (n(!0), b(te, null, re(e.issues?.filter((S) => S.code === "item_type " + x.id) ?? [], (S) => (n(), b("p", {
                key: S.what,
                class: "work-error work-small",
                role: "alert"
              }, E(s(za)(S)), 1))), 128)),
              d("div", fr, [
                d("label", pr, [
                  V[1] || (V[1] = F("Title", -1)),
                  g(s(ye), {
                    modelValue: x.title,
                    "onUpdate:modelValue": (S) => x.title = S,
                    placeholder: s(Ne)(x.id)
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder"])
                ]),
                d("label", br, [
                  V[2] || (V[2] = F("Workflow", -1)),
                  g(s(ve), {
                    modelValue: x.process,
                    "onUpdate:modelValue": (S) => x.process = S,
                    "aria-label": "Workflow",
                    required: "",
                    appendTo: "self",
                    optionLabel: "label",
                    optionValue: "value",
                    optionDisabled: "disabled",
                    options: [...(e.draft.processes ?? []).map((S) => ({ label: S.name || s(Ne)(S.id), value: S.id, disabled: !1 }))]
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                ])
              ]),
              g(rt, {
                label: "Fields",
                options: (e.draft.fields ?? []).map((S) => ({ value: S.code, label: s(Ge)(S) })),
                "model-value": x.fields,
                "onUpdate:modelValue": (S) => f(x, S)
              }, null, 8, ["options", "model-value", "onUpdate:modelValue"]),
              g(Le, {
                class: "work-disclosure",
                label: "Advanced item type settings"
              }, {
                default: j(() => [
                  d("div", hr, [
                    d("label", gr, [
                      V[3] || (V[3] = F("Identifier", -1)),
                      g(s(ye), {
                        value: x.id,
                        onChange: (S) => c(x, S.target.value),
                        required: "",
                        pattern: "[a-z][a-z0-9_]*"
                      }, null, 8, ["value", "onChange"])
                    ]),
                    V[7] || (V[7] = F()),
                    g(rt, {
                      label: "Parent types",
                      options: t.value.map((S) => ({ value: S.id, label: S.title || s(Ne)(S.id) })),
                      "model-value": y(x),
                      "onUpdate:modelValue": (S) => h(x, S, !!x.parent_types?.includes(!1))
                    }, null, 8, ["options", "model-value", "onUpdate:modelValue"]),
                    y(x).length ? (n(), b("label", yr, [
                      g(s(Ze), {
                        "model-value": !!x.parent_types?.includes(!1),
                        "aria-label": "Allow top-level items",
                        "onUpdate:modelValue": (S) => h(x, y(x), S)
                      }, null, 8, ["model-value", "onUpdate:modelValue"]),
                      V[4] || (V[4] = F("Allow top-level items", -1))
                    ])) : U("", !0),
                    d("div", kr, [
                      g(rt, {
                        label: "Inherit from parent",
                        options: x.fields.map((S) => ({ value: S, label: s(Ge)(e.draft.fields?.find((oe) => oe.code === S) ?? { code: S }) })),
                        modelValue: x.inherit,
                        "onUpdate:modelValue": (S) => x.inherit = S
                      }, null, 8, ["options", "modelValue", "onUpdate:modelValue"]),
                      V[5] || (V[5] = d("p", { class: "work-muted work-small" }, "These fields resolve from the parent when this item has no own value.", -1))
                    ]),
                    y(x).length ? (n(), b("label", wr, [
                      V[6] || (V[6] = F("When the parent moves", -1)),
                      g(s(ve), {
                        modelValue: x.move_children,
                        "onUpdate:modelValue": (S) => x.move_children = S,
                        "aria-label": "When the parent moves",
                        appendTo: "self",
                        optionLabel: "label",
                        optionValue: "value",
                        optionDisabled: "disabled",
                        options: [{ label: "Default", value: void 0, disabled: !1 }, { label: "Move children", value: "move", disabled: !1 }, { label: "Refuse while children exist", value: "refuse", disabled: !1 }]
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ])) : U("", !0),
                    g(s(Z), {
                      label: "Remove type",
                      severity: "danger",
                      text: "",
                      disabled: !!r.value,
                      onClick: (S) => k(x)
                    }, null, 8, ["disabled", "onClick"])
                  ])
                ]),
                _: 2
              }, 1024)
            ]),
            _: 2
          }, 1032, ["title", "kind"]))), 128)),
          t.value.length ? U("", !0) : (n(), b("p", Vr, "Add a type for the work people create, such as a delivery task or customer request.")),
          d("div", $r, [
            d("label", xr, [
              V[8] || (V[8] = F("New item type name", -1)),
              g(s(ye), {
                modelValue: l.value,
                "onUpdate:modelValue": V[0] || (V[0] = (x) => l.value = x),
                placeholder: "e.g. Customer request",
                onKeydown: Ee(Te(i, ["prevent"]), ["enter"])
              }, null, 8, ["modelValue", "onKeydown"])
            ]),
            g(s(Z), {
              label: "Add type",
              severity: "secondary",
              disabled: !m.value,
              onClick: i,
              outlined: ""
            }, {
              icon: j(() => [
                g(s(ce), {
                  icon: "tabler:plus",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["disabled"])
          ])
        ]),
        _: 1
      }, 8, ["count"])
    ]));
  }
}), Sr = ".work-process-canvas>svg{height:480px;width:100%}.work-process-canvas:focus-visible{outline:var(--p-focus-ring-width) var(--p-focus-ring-style) var(--p-focus-ring-color);outline-offset:var(--p-focus-ring-offset)}.work-state-card{fill:var(--p-content-background);stroke:var(--p-content-border-color);stroke-width:1.5}.work-graph-node.work-selected .work-state-card{stroke:var(--p-primary-color);stroke-width:2.5;fill:color-mix(in srgb,var(--p-primary-color) 6%,var(--p-content-background))}.work-graph-node:focus-visible .work-state-card{stroke:var(--p-focus-ring-color);stroke-width:var(--p-focus-ring-width)}.work-process-canvas .work-edge-label{font-size:12px;fill:var(--p-text-color)}.work-process-canvas .work-edge-label-bg{fill:var(--p-content-background);stroke:var(--p-content-border-color);stroke-width:1}.work-edge-line{stroke:var(--p-primary-color);stroke-width:1.5}.work-edge-return .work-edge-line{stroke:var(--p-text-muted-color);stroke-dasharray:5 4}.work-graph-arrow{fill:context-stroke}.work-lane-line{fill:none;stroke:var(--p-text-muted-color);stroke-width:1.5;stroke-dasharray:2 4}.work-node-connector{fill:var(--p-content-background);stroke:var(--p-primary-color);stroke-width:1.5}.work-node-connector:hover,.work-node-connector:focus-visible,.work-node-connector[aria-pressed=true]{fill:var(--p-primary-color)}.work-any-transition:focus-visible text,.work-any-transition[aria-pressed=true] text{fill:var(--p-primary-color);text-decoration:underline}.work-process-legend{position:static;flex-wrap:wrap;padding:10px 16px;border-top:1px solid var(--p-content-border-color);background:var(--p-content-background)}@media(max-width:700px){.work-process-canvas>svg{height:420px}}.work-process-more{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:8px;padding:8px 16px;border-top:1px solid var(--p-content-border-color);background:var(--p-content-background);color:var(--p-text-muted-color);font-size:12px}.work-process-canvas .work-graph-edge.work-selected .work-edge-label-bg{fill:var(--p-primary-color);stroke:var(--p-primary-color)}.work-process-canvas .work-graph-edge.work-selected .work-edge-label{fill:var(--p-primary-contrast-color)}", eo = /* @__PURE__ */ new WeakSet();
function Tr(e) {
  const a = e.getRootNode();
  if (a instanceof ShadowRoot && !eo.has(a)) {
    const t = e.ownerDocument.createElement("style");
    t.textContent = Sr, a.append(t), eo.add(a);
  }
}
const Mo = 0.8;
function Ir(e, a, t) {
  const l = Math.min(1, a.width / e.width, a.height / e.height);
  if (l >= Mo) return { zoom: l, pan: { x: (e.width - a.width / l) / 2, y: (e.height - a.height / l) / 2 } };
  const o = e.nodes.find((p) => p.state.id === t) ?? e.nodes[0], r = Math.min(1, a.width / ((o?.width ?? 190) + 64));
  return { zoom: r, pan: o ? { x: e.direction === "TB" ? o.x - a.width / r / 2 : o.x - o.width / 2 - 32, y: e.direction === "TB" ? o.y - o.height / 2 - 32 : o.y - a.height / r / 2 } : { x: 0, y: 0 } };
}
const Dr = ["onKeydown"], Ur = {
  key: 0,
  class: "work-process-instruction",
  role: "status"
}, Er = ["viewBox"], Ar = ["id"], Or = ["d", "marker-end"], Pr = ["aria-label", "aria-pressed", "aria-keyshortcuts", "onKeydown", "onFocus", "onClick"], Rr = ["d"], Nr = ["d", "marker-end"], Mr = ["x", "y", "width", "height"], Fr = ["x", "y"], Lr = ["x", "dy"], Br = ["aria-label", "aria-pressed", "onClick", "onKeydown", "onFocus", "onPointerup"], zr = ["x", "y", "width", "height"], jr = ["cx", "cy"], Wr = ["x", "y"], qr = ["x", "dy"], Kr = ["x", "y"], Gr = ["x", "dy"], Hr = {
  key: 0,
  class: "work-limit-text"
}, Yr = ["aria-label", "aria-pressed", "aria-keyshortcuts", "onFocus", "onKeydown", "onClick"], Xr = ["x", "y"], Jr = ["x", "dy"], Zr = ["cx", "cy", "aria-label", "aria-pressed", "onFocus", "onPointerdown", "onClick", "onKeydown"], Qr = ["d"], _r = {
  key: 1,
  class: "work-process-more",
  role: "status"
}, ed = { class: "work-process-legend" }, td = /* @__PURE__ */ ke({
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
    const l = e, o = t, r = Ba().replace(/:/g, "_"), p = M(""), m = M(), u = M();
    let i;
    const c = M(900), f = M(!1), y = W(() => c.value < 700 ? 420 : 480), h = W(() => Ui(l.process, l.draft, {
      width: c.value,
      height: y.value,
      direction: l.fitOnOpen ? "TB" : void 0
    })), $ = M(1), k = M({ x: 0, y: 0 }), I = M({ x: 0, y: 0 }), V = W(() => {
      const C = Math.min(1, c.value / h.value.width);
      return l.fitOnOpen ? Math.max(Mo, C) : C;
    }), x = W(() => ({
      width: c.value,
      height: f.value ? Math.max(y.value, Math.ceil(h.value.height * V.value)) : y.value
    })), A = W(() => h.value.nodes.filter((C) => C.x - C.width / 2 >= k.value.x && C.x + C.width / 2 <= k.value.x + x.value.width / $.value && C.y - C.height / 2 >= k.value.y && C.y + C.height / 2 <= k.value.y + x.value.height / $.value).length);
    function S() {
      f.value = !1;
      const C = Ir(h.value, x.value, l.process.initial);
      $.value = C.zoom, k.value = C.pan;
    }
    const oe = W(() => `${k.value.x} ${k.value.y} ${x.value.width / $.value} ${x.value.height / $.value}`), X = W(() => h.value.nodes.find((C) => C.state.id === p.value));
    function K() {
      f.value = !0, $.value = V.value;
      const C = x.value.width / $.value, G = h.value.nodes.find((D) => D.state.id === l.process.initial);
      k.value = {
        x: h.value.width > C && G ? G.x - C / 2 : (h.value.width - C) / 2,
        y: 0
      };
    }
    function de(C) {
      l.fitOnOpen && (f.value = !1);
      const G = Math.max(0.02, Math.min(3, $.value * C)), D = 1 / $.value - 1 / G;
      k.value = { x: k.value.x + x.value.width * D / 2, y: k.value.y + x.value.height * D / 2 }, $.value = G;
    }
    function Q(C) {
      const G = x.value.width / $.value, D = x.value.height / $.value;
      (C.x - C.width / 2 < k.value.x || C.x + C.width / 2 > k.value.x + G || C.y - C.height / 2 < k.value.y || C.y + C.height / 2 > k.value.y + D) && (k.value = { x: C.x - G / 2, y: C.y - D / 2 });
    }
    function me() {
      const C = h.value.nodes.find((G) => G.state === l.selectedState) ?? h.value.edges.find((G) => G.transition === l.selectedTransition);
      if (!C) {
        l.fitOnOpen && f.value && K();
        return;
      }
      Q(C);
    }
    Ie([h, () => l.selectedState, () => l.selectedTransition], me, { flush: "post" });
    function ge() {
      l.fitOnOpen ? K() : S();
    }
    Ie(() => l.process.id, () => {
      se(), ge();
    }, { flush: "post" });
    function ae(C) {
      if (C.target !== m.value) return;
      (C.key === "+" || C.key === "=") && (C.preventDefault(), de(1.2)), C.key === "-" && (C.preventDefault(), de(1 / 1.2)), C.key === "0" && (C.preventDefault(), K());
      const G = 60 / $.value;
      C.key.startsWith("Arrow") && (C.preventDefault(), k.value = { x: k.value.x + (C.key === "ArrowRight" ? G : C.key === "ArrowLeft" ? -G : 0), y: k.value.y + (C.key === "ArrowDown" ? G : C.key === "ArrowUp" ? -G : 0) });
    }
    function P(C, G) {
      const D = G.currentTarget;
      if (!p.value) o("state", C, D);
      else if (p.value !== C.id) {
        const ne = p.value;
        p.value = "", o("connect", ne, C.id, D);
      }
    }
    function L(C) {
      p.value = C.state.id, I.value = { x: h.value.direction === "TB" ? C.x : C.x + C.width / 2, y: h.value.direction === "TB" ? C.y + C.height / 2 : C.y };
    }
    function T(C, G) {
      if (C.pointerType === "touch" || C.button !== 0) return;
      i = C.pointerId, L(G);
      const D = C.currentTarget;
      D.hasPointerCapture?.(C.pointerId) && D.releasePointerCapture(C.pointerId);
    }
    function z(C, G) {
      i === C.pointerId && (i = void 0, !(!p.value || p.value === G.id) && P(G, C));
    }
    function J(C, G) {
      if ((C.key === "Enter" || C.key === " ") && (C.preventDefault(), P(G, C)), ["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp"].includes(C.key)) {
        C.preventDefault();
        const D = Array.from(u.value?.querySelectorAll(".work-graph-node") ?? []), ne = h.value.nodes.findIndex((Se) => Se.state === G), we = ["ArrowRight", "ArrowDown"].includes(C.key) ? 1 : -1;
        D[(ne + we + D.length) % D.length]?.focus();
      }
    }
    function ue(C, G) {
      l.selectedTransition === G && o("removeTransition", C);
    }
    function se() {
      p.value = "", i = void 0, De.clear(), q = 0;
    }
    function Oe() {
      se(), o("clear");
    }
    const De = /* @__PURE__ */ new Map();
    let q = 0;
    function v(C) {
      if (!C.target.closest('[role="button"]') && (De.set(C.pointerId, { x: C.clientX, y: C.clientY }), m.value?.setPointerCapture?.(C.pointerId), De.size === 2)) {
        const [G, D] = [...De.values()];
        q = Math.hypot(G.x - D.x, G.y - D.y);
      }
    }
    function w(C) {
      const G = u.value?.getBoundingClientRect();
      if (!G?.width) return;
      if (i === C.pointerId && p.value) {
        I.value = { x: k.value.x + (C.clientX - G.left) * x.value.width / $.value / G.width, y: k.value.y + (C.clientY - G.top) * x.value.height / $.value / G.height };
        return;
      }
      const D = De.get(C.pointerId);
      if (D)
        if (De.set(C.pointerId, { x: C.clientX, y: C.clientY }), De.size === 2) {
          const [ne, we] = [...De.values()], Se = Math.hypot(ne.x - we.x, ne.y - we.y);
          q && de(Se / q), q = Se;
        } else k.value = { x: k.value.x - (C.clientX - D.x) * x.value.width / $.value / G.width, y: k.value.y - (C.clientY - D.y) * x.value.height / $.value / G.height };
    }
    function _(C) {
      i === C.pointerId && (p.value = "", i = void 0);
    }
    function R(C) {
      De.delete(C.pointerId), q = 0, _(C);
    }
    function B(C) {
      C.ctrlKey && (C.preventDefault(), de(Math.exp(-C.deltaY * 0.01)));
    }
    let O;
    pa(() => {
      if (m.value && Tr(m.value), typeof ResizeObserver < "u" && u.value) {
        let C = !0;
        O = new ResizeObserver(() => {
          const G = u.value?.getBoundingClientRect();
          if (!G?.width || !G.height) return;
          const D = x.value.width;
          c.value = G.width, (C || Math.abs(G.width - D) > 1) && (C ? ge() : f.value ? K() : S(), C = !1), me();
        }), O.observe(u.value);
      }
    }), kt(() => O?.disconnect()), a({ fit: K, focus: () => m.value?.focus(), zoomIn: () => de(1.2), zoomOut: () => de(1 / 1.2) });
    function N(C) {
      return C.category === "completed" ? "check" : C.category === "canceled" ? "x" : C.id === l.process.initial ? "arrow-bar-to-right" : { gate: "shield-check", automated: "bolt", parallel: "arrows-split" }[C.kind ?? ""] ?? "user";
    }
    return (C, G) => (n(), b("section", {
      ref_key: "canvas",
      ref: m,
      class: st(["work-process-canvas", { "work-process-scrollable": e.fitOnOpen && f.value }]),
      "aria-label": "Process map",
      tabindex: "0",
      onKeydown: [
        ae,
        Ee(Te(Oe, ["stop"]), ["esc"])
      ],
      onPointerdown: v,
      onPointermove: w,
      onPointerup: R,
      onPointerleave: _,
      onPointercancel: se,
      onWheel: B
    }, [
      p.value ? (n(), b("p", Ur, "Choose the next stop. Escape cancels.")) : U("", !0),
      (n(), b("svg", {
        ref_key: "svg",
        ref: u,
        style: ai({ height: x.value.height + "px" }),
        viewBox: oe.value,
        role: "group",
        "aria-label": "States and transitions"
      }, [
        d("defs", null, [
          d("marker", {
            id: s(r) + "-arrow",
            viewBox: "0 0 8 8",
            refX: "7",
            refY: "4",
            markerWidth: "6",
            markerHeight: "6",
            orient: "auto"
          }, [...G[1] || (G[1] = [
            d("path", {
              d: "M0 0 L8 4 L0 8 z",
              class: "work-graph-arrow"
            }, null, -1)
          ])], 8, Ar)
        ]),
        (n(!0), b(te, null, re(h.value.parallels, (D) => (n(), b("path", {
          key: D.key,
          d: D.path,
          class: "work-lane-line",
          "marker-end": `url(#${s(r)}-arrow)`
        }, [
          d("title", null, "Parallel lane from " + E(s(he)(D.state)), 1)
        ], 8, Or))), 128)),
        (n(!0), b(te, null, re(h.value.edges, (D) => (n(), b("g", {
          key: D.key,
          class: st(["work-graph-edge", ["work-edge-" + D.type, { "work-selected": e.selectedTransition === D.transition }]]),
          role: "button",
          tabindex: "0",
          "aria-label": "Edit transition " + s(je)(D.transition),
          "aria-pressed": e.selectedTransition === D.transition,
          "aria-keyshortcuts": e.selectedTransition === D.transition ? "Delete Backspace" : void 0,
          onKeydown: [
            Ee((ne) => ue(ne, D.transition), ["delete"]),
            Ee((ne) => ue(ne, D.transition), ["backspace"]),
            Ee(Te((ne) => o("transition", D.transition, ne.currentTarget), ["prevent"]), ["enter"]),
            Ee(Te((ne) => o("transition", D.transition, ne.currentTarget), ["prevent"]), ["space"])
          ],
          onFocus: (ne) => Q(D),
          onClick: (ne) => o("transition", D.transition, ne.currentTarget)
        }, [
          d("path", {
            d: D.path,
            class: "work-edge-hit"
          }, null, 8, Rr),
          d("path", {
            d: D.path,
            class: "work-edge-line",
            "marker-end": `url(#${s(r)}-arrow)`
          }, null, 8, Nr),
          d("rect", {
            x: D.x - D.width / 2,
            y: D.y - D.height / 2,
            width: D.width,
            height: D.height,
            rx: "6",
            class: "work-edge-label-bg"
          }, null, 8, Mr),
          d("text", {
            x: D.x,
            y: D.y - (D.lines.length - 1) * 8 + 4,
            class: "work-edge-label",
            "text-anchor": "middle"
          }, [
            (n(!0), b(te, null, re(D.lines, (ne, we) => (n(), b("tspan", {
              key: we,
              x: D.x,
              dy: we ? 16 : 0
            }, E(ne), 9, Lr))), 128))
          ], 8, Fr)
        ], 42, Pr))), 128)),
        (n(!0), b(te, null, re(h.value.nodes, (D) => (n(), b("g", {
          key: D.state.id,
          class: st(["work-graph-node", ["work-stop-" + D.state.category, { "work-selected": e.selectedState === D.state }]]),
          role: "button",
          tabindex: "0",
          "aria-label": "Edit state " + s(he)(D.state),
          "aria-pressed": e.selectedState === D.state,
          onClick: (ne) => P(D.state, ne),
          onKeydown: (ne) => J(ne, D.state),
          onFocus: (ne) => Q(D),
          onPointerup: (ne) => z(ne, D.state)
        }, [
          d("rect", {
            x: D.x - D.width / 2,
            y: D.y - D.height / 2,
            width: D.width,
            height: D.height,
            rx: "10",
            class: "work-state-card"
          }, null, 8, zr),
          d("circle", {
            cx: D.x - D.width / 2 + 22,
            cy: D.y - D.height / 2 + 25,
            r: "10",
            class: "work-stop-ring"
          }, null, 8, jr),
          g(s(ce), {
            icon: "tabler:" + N(D.state),
            x: D.x - D.width / 2 + 15,
            y: D.y - D.height / 2 + 18,
            width: "14",
            height: "14",
            class: "work-stop-icon",
            "aria-hidden": "true"
          }, null, 8, ["icon", "x", "y"]),
          d("text", {
            x: D.x - D.width / 2 + 42,
            y: D.y - D.height / 2 + 29,
            class: "work-node-name"
          }, [
            (n(!0), b(te, null, re(D.title, (ne, we) => (n(), b("tspan", {
              key: we,
              x: D.x - D.width / 2 + 42,
              dy: we ? 18 : 0
            }, E(ne), 9, qr))), 128))
          ], 8, Wr),
          d("text", {
            x: D.x - D.width / 2 + 16,
            y: D.y - D.height / 2 + 33 + D.title.length * 18,
            class: "work-node-meta"
          }, [
            (n(!0), b(te, null, re(D.caption, (ne, we) => (n(), b("tspan", {
              key: we,
              x: D.x - D.width / 2 + 16,
              dy: we ? 16 : 0
            }, E(ne), 9, Gr))), 128)),
            e.draft.policy?.wip?.[D.state.id] ? (n(), b("tspan", Hr, " · limit " + E(e.draft.policy.wip[D.state.id].limit), 1)) : U("", !0)
          ], 8, Kr),
          (n(!0), b(te, null, re(D.badges, (ne, we) => (n(), b("g", {
            key: ne.id,
            class: "work-any-transition",
            role: "button",
            tabindex: "0",
            "aria-label": "Edit transition " + s(je)(ne),
            "aria-pressed": e.selectedTransition === ne,
            "aria-keyshortcuts": e.selectedTransition === ne ? "Delete Backspace" : void 0,
            onFocus: (Se) => Q(D),
            onKeydown: [
              Ee((Se) => ue(Se, ne), ["delete"]),
              Ee((Se) => ue(Se, ne), ["backspace"]),
              Ee(Te((Se) => o("transition", ne, Se.currentTarget), ["stop", "prevent"]), ["enter"]),
              Ee(Te((Se) => o("transition", ne, Se.currentTarget), ["stop", "prevent"]), ["space"])
            ],
            onClick: Te((Se) => o("transition", ne, Se.currentTarget), ["stop"])
          }, [
            d("text", {
              x: D.x - D.width / 2 + 16,
              y: D.y - D.height / 2 + 33 + D.title.length * 18 + D.caption.length * 16 + D.badges.slice(0, we).reduce((Se, xe) => Se + s(Yt)(s(je)(xe) + " works from any state").length * 18, 0),
              class: "work-node-meta"
            }, [
              (n(!0), b(te, null, re(s(Yt)(s(je)(ne) + " works from any state"), (Se, xe) => (n(), b("tspan", {
                key: xe,
                x: D.x - D.width / 2 + 16,
                dy: xe ? 18 : 0
              }, E(Se), 9, Jr))), 128))
            ], 8, Xr)
          ], 40, Yr))), 128)),
          ["completed", "canceled"].includes(D.state.category) ? U("", !0) : (n(), b("circle", {
            key: 0,
            cx: h.value.direction === "TB" ? D.x : D.x + D.width / 2,
            cy: h.value.direction === "TB" ? D.y + D.height / 2 : D.y,
            r: "9",
            class: "work-node-connector",
            role: "button",
            tabindex: "0",
            "aria-label": "Connect from " + s(he)(D.state),
            "aria-pressed": p.value === D.state.id,
            onFocus: (ne) => Q(D),
            onPointerdown: Te((ne) => T(ne, D), ["stop"]),
            onClick: Te((ne) => L(D), ["stop"]),
            onKeydown: [
              Ee(Te((ne) => L(D), ["stop", "prevent"]), ["enter"]),
              Ee(Te((ne) => L(D), ["stop", "prevent"]), ["space"])
            ]
          }, null, 40, Zr))
        ], 42, Br))), 128)),
        X.value ? (n(), b("path", {
          key: 0,
          d: `M ${h.value.direction === "TB" ? X.value.x : X.value.x + X.value.width / 2} ${h.value.direction === "TB" ? X.value.y + X.value.height / 2 : X.value.y} L ${I.value.x} ${I.value.y}`,
          class: "work-connect-ghost"
        }, null, 8, Qr)) : U("", !0)
      ], 12, Er)),
      A.value < e.process.states.length ? (n(), b("div", _r, [
        d("span", null, E(A.value) + " of " + E(e.process.states.length) + " states in view · Pan to see more", 1),
        f.value ? U("", !0) : (n(), H(s(Z), {
          key: 0,
          label: "Fit map",
          size: "small",
          text: "",
          onClick: G[0] || (G[0] = (D) => K())
        }))
      ])) : U("", !0),
      d("div", ed, [
        d("span", null, E(e.process.states.length) + " states · " + E(Math.round($.value * 100)) + "%", 1),
        G[2] || (G[2] = d("span", null, [
          d("i"),
          F("Transition")
        ], -1)),
        G[3] || (G[3] = d("span", null, [
          d("i", { class: "work-return-key" }),
          F("Return / loop")
        ], -1)),
        G[4] || (G[4] = d("span", null, "Drag to pan · Ctrl + scroll to zoom · Fit to reset the view", -1))
      ])
    ], 42, Dr));
  }
}), ad = {
  class: "work-process-list work-stack",
  "aria-label": "Process list"
}, ld = { class: "work-table-scroll" }, od = {
  class: "work-settings-table work-process-table",
  role: "table",
  "aria-label": "States"
}, id = { role: "rowgroup" }, nd = ["aria-selected"], sd = { role: "cell" }, rd = {
  key: 0,
  class: "work-muted work-small"
}, dd = { role: "cell" }, ud = { role: "cell" }, cd = {
  role: "cell",
  class: "work-process-list-actions"
}, vd = { class: "work-table-scroll" }, md = {
  class: "work-settings-table work-process-table",
  role: "table",
  "aria-label": "Transitions"
}, fd = { role: "rowgroup" }, pd = ["aria-selected"], bd = { role: "cell" }, hd = {
  key: 0,
  class: "work-muted"
}, gd = { role: "cell" }, yd = { role: "cell" }, kd = {
  role: "cell",
  class: "work-process-list-actions"
}, wd = /* @__PURE__ */ ke({
  __name: "ProcessList",
  props: {
    process: {},
    selectedState: {},
    selectedTransition: {},
    counts: {}
  },
  emits: ["state", "transition", "removeState", "removeTransition"],
  setup(e) {
    return (a, t) => (n(), b("section", ad, [
      t[6] || (t[6] = d("h3", null, "States", -1)),
      d("div", ld, [
        d("table", od, [
          t[2] || (t[2] = d("thead", { role: "rowgroup" }, [
            d("tr", { role: "row" }, [
              d("th", {
                role: "columnheader",
                scope: "col"
              }, "Name"),
              d("th", {
                role: "columnheader",
                scope: "col"
              }, "Phase"),
              d("th", {
                role: "columnheader",
                scope: "col"
              }, "Kind"),
              d("th", {
                role: "columnheader",
                scope: "col"
              }, "Actions")
            ])
          ], -1)),
          d("tbody", id, [
            (n(!0), b(te, null, re(e.process.states, (l) => (n(), b("tr", {
              key: l.id,
              "aria-selected": e.selectedState === l,
              role: "row"
            }, [
              d("td", sd, [
                g(s(ye), {
                  modelValue: l.name,
                  "onUpdate:modelValue": (o) => l.name = o,
                  "aria-label": "Name of " + s(he)(l)
                }, null, 8, ["modelValue", "onUpdate:modelValue", "aria-label"]),
                e.counts ? (n(), b("p", rd, E(e.counts[l.id] ?? 0) + " here", 1)) : U("", !0)
              ]),
              d("td", dd, [
                t[0] || (t[0] = d("span", {
                  class: "work-process-cell-label",
                  "aria-hidden": "true"
                }, "Phase", -1)),
                F(E(s(Bt)(l.category)), 1)
              ]),
              d("td", ud, [
                t[1] || (t[1] = d("span", {
                  class: "work-process-cell-label",
                  "aria-hidden": "true"
                }, "Kind", -1)),
                g(s(Ye), { severity: "secondary" }, {
                  default: j(() => [
                    F(E(s(Oa)(l.kind)), 1)
                  ]),
                  _: 2
                }, 1024)
              ]),
              d("td", cd, [
                g(s(Z), {
                  size: "small",
                  text: "",
                  severity: "secondary",
                  "aria-label": "Edit state " + s(he)(l),
                  onClick: (o) => a.$emit("state", l, o.currentTarget)
                }, {
                  default: j(() => [
                    g(s(ce), { icon: "tabler:pencil" })
                  ]),
                  _: 1
                }, 8, ["aria-label", "onClick"]),
                g(s(Z), {
                  size: "small",
                  text: "",
                  severity: "danger",
                  "aria-label": "Remove state " + s(he)(l),
                  onClick: (o) => a.$emit("removeState", l)
                }, {
                  default: j(() => [
                    g(s(ce), { icon: "tabler:trash" })
                  ]),
                  _: 1
                }, 8, ["aria-label", "onClick"])
              ])
            ], 8, nd))), 128))
          ])
        ])
      ]),
      t[7] || (t[7] = d("h3", null, "Transitions", -1)),
      d("div", vd, [
        d("table", md, [
          t[5] || (t[5] = d("thead", { role: "rowgroup" }, [
            d("tr", { role: "row" }, [
              d("th", {
                role: "columnheader",
                scope: "col"
              }, "Name"),
              d("th", {
                role: "columnheader",
                scope: "col"
              }, "From"),
              d("th", {
                role: "columnheader",
                scope: "col"
              }, "To"),
              d("th", {
                role: "columnheader",
                scope: "col"
              }, "Actions")
            ])
          ], -1)),
          d("tbody", fd, [
            (n(!0), b(te, null, re(e.process.transitions ?? [], (l) => (n(), b("tr", {
              key: l.id,
              "aria-selected": e.selectedTransition === l,
              role: "row"
            }, [
              d("td", bd, [
                g(s(ye), {
                  modelValue: l.name,
                  "onUpdate:modelValue": (o) => l.name = o,
                  placeholder: s(je)(l),
                  "aria-label": "Name of " + s(je)(l)
                }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder", "aria-label"]),
                l.when || l.require?.length || l.guards?.length ? (n(), b("p", hd, "Has requirements")) : U("", !0)
              ]),
              d("td", gd, [
                t[3] || (t[3] = d("span", {
                  class: "work-process-cell-label",
                  "aria-hidden": "true"
                }, "From", -1)),
                F(" " + E(l.from === "any" ? "Any state" : l.from.map((o) => s(he)(e.process.states.find((r) => r.id === o))).join(", ")), 1)
              ]),
              d("td", yd, [
                t[4] || (t[4] = d("span", {
                  class: "work-process-cell-label",
                  "aria-hidden": "true"
                }, "To", -1)),
                F(E(s(he)(e.process.states.find((o) => o.id === l.to))), 1)
              ]),
              d("td", kd, [
                g(s(Z), {
                  size: "small",
                  text: "",
                  severity: "secondary",
                  "aria-label": "Edit transition " + s(je)(l),
                  onClick: (o) => a.$emit("transition", l, o.currentTarget)
                }, {
                  default: j(() => [
                    g(s(ce), { icon: "tabler:pencil" })
                  ]),
                  _: 1
                }, 8, ["aria-label", "onClick"]),
                g(s(Z), {
                  size: "small",
                  text: "",
                  severity: "danger",
                  "aria-label": "Remove transition " + s(je)(l),
                  onClick: (o) => a.$emit("removeTransition", l)
                }, {
                  default: j(() => [
                    g(s(ce), { icon: "tabler:trash" })
                  ]),
                  _: 1
                }, 8, ["aria-label", "onClick"])
              ])
            ], 8, pd))), 128))
          ])
        ])
      ])
    ]));
  }
}), Vd = { class: "work-stack work-transition-settings" }, $d = { class: "work-stack work-tight" }, xd = { class: "work-row" }, Cd = { key: 0 }, Sd = { class: "work-stack" }, Td = { class: "work-row" }, Id = { class: "work-row" }, Dd = { class: "work-stack work-tight" }, Ud = { class: "work-row" }, Ed = { class: "work-stack work-tight" }, Ad = { class: "work-stack work-tight" }, Od = /* @__PURE__ */ ke({
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
    function r(p, m) {
      const u = t.transition.set?.[p];
      !u || !t.transition.set || (t.transition.set[p] = { field: u.field, ...m === "clear" ? { clear: !0 } : m === "copy" ? { copy: "" } : { value: "" } });
    }
    return (p, m) => (n(), b("div", Vd, [
      d("label", $d, [
        m[15] || (m[15] = F("To state", -1)),
        g(s(ve), {
          modelValue: e.transition.to,
          "onUpdate:modelValue": m[0] || (m[0] = (u) => e.transition.to = u),
          "aria-label": "To state",
          appendTo: "self",
          optionLabel: "label",
          optionValue: "value",
          options: e.process.states.map((u) => ({ label: s(he)(u), value: u.id }))
        }, null, 8, ["modelValue", "options"])
      ]),
      d("label", xd, [
        m[16] || (m[16] = d("span", { class: "work-spacer" }, "Works from any state", -1)),
        g(s(Ze), {
          "model-value": e.transition.from === "any",
          "aria-label": "Works from any state",
          "onUpdate:modelValue": m[1] || (m[1] = (u) => e.transition.from = u ? "any" : [])
        }, null, 8, ["model-value"])
      ]),
      e.transition.from !== "any" ? (n(), H(rt, {
        key: 0,
        label: "From states",
        options: e.process.states.map((u) => ({ value: u.id, label: s(he)(u) })),
        modelValue: e.transition.from,
        "onUpdate:modelValue": m[2] || (m[2] = (u) => e.transition.from = u)
      }, null, 8, ["options", "modelValue"])) : U("", !0),
      m[24] || (m[24] = d("h4", { class: "work-process-group" }, "Must be filled", -1)),
      g(rt, {
        label: "Required fields",
        options: e.draft.fields?.map((u) => ({ value: u.code, label: u.title || u.code })) ?? [],
        modelValue: e.transition.require,
        "onUpdate:modelValue": m[3] || (m[3] = (u) => e.transition.require = u)
      }, null, 8, ["options", "modelValue"]),
      m[25] || (m[25] = d("h4", { class: "work-process-group" }, "Only when", -1)),
      g(Cl, {
        label: "Allow this transition when",
        draft: e.draft,
        "board-id": e.boardId,
        "model-value": e.transition.when,
        "onUpdate:modelValue": m[4] || (m[4] = (u) => e.transition.when = u),
        onValidity: m[5] || (m[5] = (u) => l("validity", "when", u))
      }, null, 8, ["draft", "board-id", "model-value"]),
      e.guards?.length || e.transition.guards?.length ? (n(), H(rt, {
        key: 1,
        label: "Installed checks",
        options: [...(e.guards ?? []).map((u) => ({ value: u.id, label: u.title })), ...(e.transition.guards ?? []).filter((u) => !e.guards?.some((i) => i.id === u)).map((u) => ({ value: u, label: e.guards ? "Unavailable check" : "Configured check" }))],
        modelValue: e.transition.guards,
        "onUpdate:modelValue": m[6] || (m[6] = (u) => e.transition.guards = u)
      }, null, 8, ["options", "modelValue"])) : U("", !0),
      (n(!0), b(te, null, re(e.guards?.filter((u) => e.transition.guards?.includes(u.id)) ?? [], (u) => (n(), b("p", {
        key: u.id,
        class: "work-muted work-small"
      }, [
        F(E(u.description || u.title + " can stop this transition.") + " ", 1),
        u.reads?.length ? (n(), b("span", Cd, " Checks " + E(u.reads.map((i) => e.draft.fields?.find((c) => c.code === i)?.title || "a configured field").join(", ")) + ".", 1)) : U("", !0)
      ]))), 128)),
      g(Le, {
        class: "work-disclosure",
        label: "Advanced transition settings"
      }, {
        default: j(() => [
          d("div", Sd, [
            d("label", Td, [
              m[17] || (m[17] = d("span", { class: "work-spacer" }, "Happens automatically", -1)),
              g(s(Ze), {
                "model-value": e.transition.auto,
                "onUpdate:modelValue": m[7] || (m[7] = (u) => {
                  e.transition.auto = u, u || delete e.transition.default;
                }),
                "aria-label": "Automatic transition"
              }, null, 8, ["model-value"])
            ]),
            d("label", Id, [
              m[18] || (m[18] = d("span", { class: "work-spacer" }, "Default automatic transition", -1)),
              g(s(Ze), {
                modelValue: e.transition.default,
                "onUpdate:modelValue": m[8] || (m[8] = (u) => e.transition.default = u),
                disabled: !e.transition.auto,
                "aria-label": "Default transition"
              }, null, 8, ["modelValue", "disabled"])
            ]),
            m[23] || (m[23] = d("h4", { class: "work-process-group" }, "Also sets", -1)),
            (n(!0), b(te, null, re(e.transition.set ?? [], (u, i) => (n(), b("div", {
              key: i,
              class: "work-process-value work-stack work-tight"
            }, [
              d("label", Dd, [
                m[19] || (m[19] = F("Field", -1)),
                g(s(ve), {
                  modelValue: u.field,
                  "onUpdate:modelValue": (c) => u.field = c,
                  appendTo: "self",
                  optionLabel: "label",
                  optionValue: "value",
                  options: e.draft.fields?.map((c) => ({ value: c.code, label: c.title || c.code })) ?? []
                }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
              ]),
              d("div", Ud, [
                g(s(ve), {
                  "model-value": u.clear ? "clear" : u.copy !== void 0 ? "copy" : "value",
                  "aria-label": "Value action",
                  appendTo: "self",
                  options: [
                    { label: "Set value", value: "value" },
                    { label: "Clear value", value: "clear" },
                    { label: "Copy field", value: "copy" }
                  ],
                  optionLabel: "label",
                  optionValue: "value",
                  "onUpdate:modelValue": (c) => r(i, c)
                }, null, 8, ["model-value", "onUpdate:modelValue"]),
                g(s(Z), {
                  text: "",
                  severity: "danger",
                  "aria-label": "Remove value " + (i + 1),
                  onClick: (c) => e.transition.set?.splice(i, 1)
                }, {
                  default: j(() => [
                    g(s(ce), { icon: "tabler:trash" })
                  ]),
                  _: 1
                }, 8, ["aria-label", "onClick"])
              ]),
              u.copy !== void 0 ? (n(), H(s(ve), {
                key: 0,
                modelValue: u.copy,
                "onUpdate:modelValue": (c) => u.copy = c,
                "aria-label": "Copy from field",
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                options: e.draft.fields?.map((c) => ({ value: c.code, label: c.title || c.code })) ?? []
              }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])) : u.clear ? U("", !0) : (n(!0), b(te, { key: 1 }, re(e.draft.fields?.filter((c) => c.code === u.field) ?? [], (c) => (n(), H(ko, {
                key: c.code,
                "board-id": e.boardId ?? "",
                field: c,
                modelValue: u.value,
                "onUpdate:modelValue": (f) => u.value = f,
                onValidity: (f) => l("validity", "effect-" + i, f)
              }, null, 8, ["board-id", "field", "modelValue", "onUpdate:modelValue", "onValidity"]))), 128))
            ]))), 128)),
            g(s(Z), {
              label: "Add value",
              severity: "secondary",
              outlined: "",
              size: "small",
              onClick: o
            }, {
              icon: j(() => [
                g(s(ce), { icon: "tabler:plus" })
              ]),
              _: 1
            }),
            d("label", Ed, [
              m[20] || (m[20] = F("Offer to people", -1)),
              g(s(ve), {
                "model-value": e.transition.people,
                "aria-label": "Offer to people",
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                options: [{ label: "Work default", value: void 0 }, { label: "Offer explicitly", value: !0 }, { label: "Process engine only", value: !1 }],
                "onUpdate:modelValue": m[9] || (m[9] = (u) => e.transition.people = u)
              }, null, 8, ["model-value"]),
              m[21] || (m[21] = d("span", { class: "work-muted work-small" }, "Work default can hide a stage route from the list while still allowing it by name. Process engine only reserves the route for the engine and board administrators using force.", -1))
            ]),
            d("label", Ad, [
              m[22] || (m[22] = F("Evaluation order", -1)),
              g(s(ht), {
                "model-value": e.transition.order ?? null,
                "aria-label": "Transition order",
                min: 0,
                useGrouping: !1,
                "onUpdate:modelValue": m[10] || (m[10] = (u) => e.transition.order = u ?? void 0)
              }, null, 8, ["model-value"])
            ]),
            g(It, {
              label: "Set values",
              "model-value": e.transition.set,
              shape: "array",
              "onUpdate:modelValue": m[11] || (m[11] = (u) => e.transition.set = u),
              onValidity: m[12] || (m[12] = (u) => l("validity", "set", u))
            }, null, 8, ["model-value"]),
            g(It, {
              label: "Guards",
              "model-value": e.transition.guards,
              shape: "array",
              "onUpdate:modelValue": m[13] || (m[13] = (u) => e.transition.guards = u),
              onValidity: m[14] || (m[14] = (u) => l("validity", "guards", u))
            }, null, 8, ["model-value"])
          ])
        ]),
        _: 1
      })
    ]));
  }
}), to = /* @__PURE__ */ ke({
  __name: "CapacityControl",
  props: {
    draft: {},
    state: {},
    label: {},
    hard: { type: Boolean }
  },
  setup(e) {
    const a = e, t = W(() => a.draft.policy?.wip?.[a.state]);
    function l(r) {
      if (r === null) {
        a.draft.policy?.wip && delete a.draft.policy.wip[a.state];
        return;
      }
      const p = a.draft.policy ??= {}, m = p.wip ??= {};
      m[a.state] = { ...m[a.state], limit: r };
    }
    function o(r) {
      t.value && (t.value.hard = r);
    }
    return (r, p) => e.hard ? (n(), H(s(Ze), {
      key: 0,
      "aria-label": e.label,
      disabled: !t.value,
      "model-value": t.value?.hard ?? !1,
      "onUpdate:modelValue": o
    }, null, 8, ["aria-label", "disabled", "model-value"])) : (n(), H(s(ht), {
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
async function ul(e, a) {
  try {
    const { data: t } = await fl.get(e, a ? { params: a } : void 0);
    if (!t?.success) {
      const l = t?.message || (typeof t?.error == "string" ? t.error : t?.error?.message) || "Could not read published Flow.";
      throw new vl({ message: l, details: t?.details }, "Published Flow");
    }
    return t;
  } catch (t) {
    throw vi(t, "Published Flow");
  }
}
const ao = (e) => `/api/v1/workflows/${encodeURIComponent(e)}/versions`, kl = {
  title: async (e) => (await ul("/api/v1/workflows/published", { id: e })).item?.title,
  versions: async (e) => (await ul(ao(e))).versions ?? [],
  check: async (e) => {
    if ((await ul(`${ao(e.id)}/${e.version}`)).version?.version !== e.version) throw new Error("The published version is unavailable.");
  }
}, Pd = {
  class: "work-stack work-tight",
  "aria-label": "Stage Flow"
}, Rd = {
  key: 0,
  class: "work-muted work-small"
}, Nd = {
  key: 1,
  class: "kx-err work-alert-actions"
}, Md = { role: "alert" }, Fd = ["schema", "config", "title"], Ld = {
  key: 3,
  class: "kx-err",
  role: "alert"
}, Bd = {
  key: 4,
  class: "work-stack work-tight"
}, zd = ["value", "aria-busy", "disabled"], jd = {
  value: "",
  disabled: ""
}, Wd = ["value"], qd = {
  key: 5,
  class: "work-muted work-small",
  role: "status"
}, Kd = /* @__PURE__ */ ke({
  __name: "StageFlow",
  props: {
    modelValue: {}
  },
  emits: ["update:modelValue", "validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = M(!1), r = M(""), p = M([]), m = M(!1), u = M(""), i = M(!1), c = W(() => r.value || t.modelValue?.id), f = JSON.stringify({ properties: { flow_ref: { title: "Published Flow", picker: "wc-workflow-picker" } } }), y = W(() => JSON.stringify(t.modelValue ? { flow_ref: t.modelValue } : {}));
    let h = 0;
    async function $() {
      o.value = await Tt("wc-workflow-picker");
    }
    $();
    async function k() {
      const A = ++h, S = c.value, oe = t.modelValue;
      if (m.value = !!S, u.value = "", p.value = [], !!S)
        try {
          const [X] = await Promise.all([kl.versions(S), !i.value && oe ? kl.check(oe) : Promise.resolve()]);
          if (A !== h) return;
          if (p.value = X.filter((K) => Number.isInteger(K.version) && K.version > 0), !i.value && oe && !p.value.some((K) => K.version === oe.version)) throw new Error("The published version is unavailable.");
        } catch (X) {
          A === h && (u.value = lt(X, "Could not read published Flow."));
        } finally {
          A === h && (m.value = !1);
        }
    }
    Ie([c, () => t.modelValue?.version, i], k, { immediate: !0 }), Ie(i, (A) => l("validity", !A), { immediate: !0 });
    function I(A) {
      const S = A.detail?.flow_ref;
      S?.kind !== "flow" || !S.id || (i.value = !0, r.value = S.id);
    }
    function V(A) {
      !c.value || !p.value.some((S) => S.version === A) || (l("update:modelValue", { kind: "flow", id: c.value, version: A }), i.value = !1, r.value = "");
    }
    function x() {
      l("update:modelValue", void 0), i.value = !1, r.value = "";
    }
    return kt(() => {
      h++, l("validity", !0);
    }), (A, S) => (n(), b("section", Pd, [
      S[4] || (S[4] = d("h4", { class: "work-field-label" }, "What runs", -1)),
      e.modelValue ? U("", !0) : (n(), b("p", Rd, "No Flow bound. This stage keeps its existing external execution contract.")),
      u.value ? (n(), b("div", Nd, [
        d("p", Md, [
          F(E(i.value ? "Flow versions unavailable" : "Flow binding unavailable"), 1),
          !i.value && e.modelValue ? (n(), b(te, { key: 0 }, [
            F(" (v" + E(e.modelValue.version) + ")", 1)
          ], 64)) : U("", !0),
          F(". " + E(u.value), 1)
        ]),
        g(s(Z), {
          label: "Reload Flow",
          severity: "secondary",
          text: "",
          onClick: k
        })
      ])) : U("", !0),
      o.value ? (n(), b("wc-workflow-picker", {
        key: 2,
        schema: s(f),
        config: y.value,
        title: e.modelValue?.id,
        onChange: I
      }, null, 40, Fd)) : (n(), b("p", Ld, [
        S[2] || (S[2] = F("Published Flow picker unavailable.", -1)),
        g(s(Z), {
          label: "Reload Flow picker",
          text: "",
          severity: "secondary",
          onClick: $
        })
      ])),
      c.value ? (n(), b("label", Bd, [
        S[3] || (S[3] = F(" Published version ", -1)),
        d("select", {
          class: "p-inputtext work-flow-version",
          value: i.value ? "" : e.modelValue?.version,
          "aria-busy": m.value,
          disabled: m.value || !!u.value,
          onChange: S[0] || (S[0] = (oe) => V(Number(oe.target.value)))
        }, [
          d("option", jd, E(m.value ? "Loading versions…" : "Choose a published version"), 1),
          (n(!0), b(te, null, re(p.value, (oe) => (n(), b("option", {
            key: oe.version,
            value: oe.version
          }, "v" + E(oe.version), 9, Wd))), 128))
        ], 40, zd)
      ])) : U("", !0),
      i.value ? (n(), b("p", qd, "Choose a published version to finish selecting the Flow.")) : U("", !0),
      e.modelValue || i.value ? (n(), H(s(Z), {
        key: 6,
        label: i.value ? "Cancel Flow selection" : "Remove Flow binding",
        "aria-label": i.value ? "Cancel Flow selection" : "Remove Flow binding",
        severity: "secondary",
        text: "",
        onClick: S[1] || (S[1] = (oe) => i.value ? (i.value = !1, r.value = "") : x())
      }, null, 8, ["label", "aria-label"])) : U("", !0)
    ]));
  }
}), wl = { seconds: 1, minutes: 60, hours: 3600, days: 86400 };
function sa(e, a) {
  const t = /^P(\d+)W$/.exec(e), l = /^P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+\.?\d*)S)?)?$/.exec(e);
  if (!t && (!l || e === "P" || e.endsWith("T"))) return;
  const o = t ? Number(t[1]) * 604800 : Number(l[1] ?? 0) * 86400 + Number(l[2] ?? 0) * 3600 + Number(l[3] ?? 0) * 60 + Number(l[4] ?? 0);
  if (!Number.isFinite(o) || o <= 0) return;
  const r = a ?? (o % 86400 === 0 ? "days" : o % 3600 === 0 ? "hours" : o < 60 ? "seconds" : "minutes");
  return { amount: o / wl[r], unit: r };
}
function Gd(e, a) {
  if (e == null) return;
  if (!Number.isFinite(e * wl[a]) || e <= 0) throw new Error("Enter a positive duration.");
  const t = (o) => o.toLocaleString("en-US", { useGrouping: !1, maximumSignificantDigits: 21 });
  if (!Number.isInteger(e)) return `PT${t(e * wl[a])}S`;
  const l = { seconds: "S", minutes: "M", hours: "H", days: "D" }[a];
  return (a === "days" ? "P" : "PT") + t(e) + l;
}
const Hd = { class: "work-stack work-tight" }, Yd = {
  key: 0,
  class: "work-error",
  role: "alert"
}, Mt = /* @__PURE__ */ ke({
  __name: "DurationControl",
  props: {
    modelValue: {},
    label: {},
    disabled: { type: Boolean }
  },
  emits: ["update:modelValue", "validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = "duration:" + Ba(), r = M(), p = M(""), m = W(() => t.modelValue ? sa(t.modelValue) : void 0), u = W(() => r.value ?? m.value?.unit ?? "days");
    Ie(() => t.modelValue, (V) => {
      p.value = "", l("validity", !V || !!m.value, o);
    }, { immediate: !0 });
    const i = W(() => t.modelValue ? sa(t.modelValue, u.value)?.amount ?? null : null);
    function c(V) {
      try {
        const x = Gd(V, u.value);
        p.value = "", l("update:modelValue", x), l("validity", !0, o);
      } catch (x) {
        p.value = x.message, l("validity", !1, o);
      }
    }
    let f;
    function y(V) {
      V.target instanceof HTMLInputElement && (f = V.target.value);
    }
    function h(V) {
      if (f === void 0) return;
      const x = f;
      f = void 0, k(V, x);
    }
    function $(V) {
      f = void 0;
      const x = V.originalEvent?.target instanceof HTMLInputElement ? V.originalEvent.target.value : V.formattedValue;
      k(V.value, x);
    }
    function k(V, x) {
      if (x.trim() && (typeof V != "number" || !Number.isFinite(V))) {
        p.value = "Enter a positive duration.", l("validity", !1, o);
        return;
      }
      r.value = u.value, c(typeof V == "number" ? V : null);
    }
    function I(V) {
      const x = i.value;
      r.value = V, !(t.modelValue && !m.value) && c(x);
    }
    return kt(() => l("validity", !0, o)), (V, x) => (n(), b("label", Hd, [
      F(E(e.label), 1),
      d("span", {
        class: "work-duration-control",
        style: { "max-width": "360px" },
        onInputCapture: y
      }, [
        g(s(ht), {
          "model-value": i.value,
          "aria-label": e.label,
          min: 0,
          "aria-invalid": !!p.value || !!e.modelValue && !s(sa)(e.modelValue),
          disabled: e.disabled,
          useGrouping: !1,
          "max-fraction-digits": u.value === "seconds" ? 20 : 3,
          onInput: $,
          "onUpdate:modelValue": h
        }, null, 8, ["model-value", "aria-label", "aria-invalid", "disabled", "max-fraction-digits"]),
        g(s(ve), {
          "model-value": u.value,
          "aria-label": e.label + " unit",
          disabled: e.disabled,
          options: [{ label: "Seconds", value: "seconds" }, { label: "Minutes", value: "minutes" }, { label: "Hours", value: "hours" }, { label: "Days", value: "days" }],
          optionLabel: "label",
          optionValue: "value",
          appendTo: "self",
          "onUpdate:modelValue": x[0] || (x[0] = (A) => I(A))
        }, null, 8, ["model-value", "aria-label", "disabled"])
      ], 32),
      p.value || e.modelValue && !s(sa)(e.modelValue) ? (n(), b("span", Yd, E(p.value || `Unsupported duration: ${e.modelValue}`), 1)) : U("", !0)
    ]));
  }
}), Xd = { class: "work-stack" }, Jd = { class: "work-settings-grid" }, Zd = { class: "work-stack work-tight" }, Qd = { class: "work-stack work-tight" }, _d = {
  key: 1,
  class: "work-stack work-tight"
}, eu = { class: "work-stack work-tight" }, tu = { class: "work-settings-grid" }, au = { class: "work-row" }, lu = { class: "work-stack work-tight" }, ou = {
  key: 0,
  class: "work-stack work-tight"
}, iu = /* @__PURE__ */ ke({
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
      i.push({ id: Nt("timer", i), after: "P1D", then: { emit: "reminder" } });
    }
    function p(i, c) {
      delete i.after, delete i.at_field, c === "after" ? i.after = "P1D" : i.at_field = "";
    }
    function m(i, c, f) {
      f ? i[c] = f : (delete i[c], delete i.table);
    }
    function u(i, c) {
      i.then = c === "emit" ? { emit: "" } : { transition: "" };
    }
    return (i, c) => (n(), b("section", Xd, [
      c[8] || (c[8] = d("h4", null, "Timers", -1)),
      (n(!0), b(te, null, re(o(), (f, y) => (n(), b("article", {
        key: f.id,
        class: "work-settings-card work-stack"
      }, [
        d("div", Jd, [
          d("label", Zd, [
            c[2] || (c[2] = F("Timer ID", -1)),
            g(s(ye), {
              modelValue: f.id,
              "onUpdate:modelValue": (h) => f.id = h,
              required: "",
              pattern: "[a-z][a-z0-9_]*"
            }, null, 8, ["modelValue", "onUpdate:modelValue"])
          ]),
          d("label", Qd, [
            c[3] || (c[3] = F("Deadline", -1)),
            g(s(ve), {
              "model-value": f.at_field !== void 0 ? "at_field" : "after",
              "onUpdate:modelValue": (h) => p(f, h),
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
          f.after !== void 0 ? (n(), H(Mt, {
            key: 0,
            modelValue: f.after,
            "onUpdate:modelValue": (h) => f.after = h,
            label: "After",
            onValidity: c[0] || (c[0] = (h, $) => l("validity", $, h))
          }, null, 8, ["modelValue", "onUpdate:modelValue"])) : (n(), b("label", _d, [
            c[4] || (c[4] = F("At field", -1)),
            g(s(ve), {
              modelValue: f.at_field,
              "onUpdate:modelValue": (h) => f.at_field = h,
              appendTo: "self",
              optionLabel: "label",
              optionValue: "value",
              optionDisabled: "disabled",
              options: [
                ...(e.draft.fields?.filter((h) => h.form === "time") ?? []).map((h) => ({
                  label: h.code,
                  value: h.code,
                  disabled: !1
                }))
              ]
            }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
          ])),
          d("label", eu, [
            c[5] || (c[5] = F("Duration by field", -1)),
            g(s(ve), {
              "model-value": f.by ?? "",
              "onUpdate:modelValue": (h) => m(f, "by", h),
              appendTo: "self",
              optionLabel: "label",
              optionValue: "value",
              optionDisabled: "disabled",
              options: [
                { label: "Fixed duration", value: "", disabled: !1 },
                ...(e.draft.fields ?? []).map((h) => ({
                  label: h.code,
                  value: h.code,
                  disabled: !1
                }))
              ]
            }, null, 8, ["model-value", "onUpdate:modelValue", "options"])
          ])
        ]),
        f.by ? (n(), H(It, {
          key: 0,
          label: "Duration table",
          hint: "Map field values to ISO durations.",
          "model-value": f.table,
          shape: "object",
          "onUpdate:modelValue": (h) => f.table = h,
          onValidity: (h) => l("validity", "table-" + y, h)
        }, null, 8, ["model-value", "onUpdate:modelValue", "onValidity"])) : U("", !0),
        d("div", tu, [
          g(Mt, {
            modelValue: f.repeat,
            "onUpdate:modelValue": (h) => f.repeat = h,
            label: "Repeat every",
            onValidity: c[1] || (c[1] = (h, $) => l("validity", $, h)),
            disabled: f.interrupting
          }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"]),
          d("label", au, [
            g(s(Lt), {
              modelValue: f.interrupting,
              "onUpdate:modelValue": [(h) => f.interrupting = h, (h) => f.interrupting && delete f.repeat],
              binary: ""
            }, null, 8, ["modelValue", "onUpdate:modelValue"]),
            c[6] || (c[6] = F("Interrupting", -1))
          ]),
          d("label", lu, [
            c[7] || (c[7] = F("Then", -1)),
            g(s(ve), {
              "model-value": f.then?.transition !== void 0 ? "transition" : "emit",
              "onUpdate:modelValue": (h) => u(f, h),
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
          f.then ? (n(), b("label", ou, [
            F(E(f.then.transition !== void 0 ? "Transition ID" : "Event name"), 1),
            f.then.transition !== void 0 ? (n(), H(s(ye), {
              key: 0,
              modelValue: f.then.transition,
              "onUpdate:modelValue": (h) => f.then.transition = h
            }, null, 8, ["modelValue", "onUpdate:modelValue"])) : (n(), H(s(ye), {
              key: 1,
              modelValue: f.then.emit,
              "onUpdate:modelValue": (h) => f.then.emit = h
            }, null, 8, ["modelValue", "onUpdate:modelValue"]))
          ])) : U("", !0)
        ]),
        g(s(Z), {
          severity: "secondary",
          onClick: (h) => o().splice(y, 1),
          "aria-label": "Remove timer",
          text: "",
          size: "small"
        }, {
          default: j(() => [
            g(s(ce), {
              icon: "tabler:trash",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        }, 8, ["onClick"])
      ]))), 128)),
      g(s(Z), {
        label: "Add timer",
        severity: "secondary",
        onClick: r,
        outlined: ""
      }, {
        icon: j(() => [
          g(s(ce), {
            icon: "tabler:plus",
            "aria-hidden": "true"
          })
        ]),
        _: 1
      })
    ]));
  }
}), nu = ["aria-label"], su = { class: "work-stack work-tight" }, ru = {
  key: 0,
  class: "work-stack work-tight"
}, du = /* @__PURE__ */ ke({
  __name: "PrincipalSourceEditor",
  props: {
    modelValue: {},
    draft: {},
    boardId: {},
    label: {}
  },
  emits: ["update:modelValue", "validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = W(() => Array.isArray(t.modelValue) ? "principals" : "field" in t.modelValue ? "field" : "group"), r = W(() => Array.isArray(t.modelValue) ? t.modelValue : "group" in t.modelValue && t.modelValue.group ? [{ kind: "group", id: t.modelValue.group }] : []);
    function p(u) {
      l("update:modelValue", u === "field" ? { field: "" } : u === "group" ? { group: "" } : []);
    }
    function m(u) {
      l("update:modelValue", o.value === "group" ? { group: u.at(-1)?.id ?? "" } : u);
    }
    return co(() => l("validity", Array.isArray(t.modelValue) ? t.modelValue.length > 0 : "field" in t.modelValue ? !!t.modelValue.field : !!t.modelValue.group)), kt(() => l("validity", !0)), (u, i) => (n(), b("section", {
      class: "work-stack work-tight",
      "aria-label": e.label
    }, [
      d("label", su, [
        F(E(e.label) + " source", 1),
        g(s(ve), {
          "model-value": o.value,
          "aria-label": e.label + " source",
          options: [{ label: "Group", value: "group" }, { label: "People and groups", value: "principals" }, { label: "Principal field", value: "field" }],
          optionLabel: "label",
          optionValue: "value",
          appendTo: "self",
          "onUpdate:modelValue": p
        }, null, 8, ["model-value", "aria-label"])
      ]),
      "field" in e.modelValue ? (n(), b("label", ru, [
        i[1] || (i[1] = F("Principal field", -1)),
        g(s(ve), {
          "model-value": e.modelValue.field,
          "aria-label": e.label + " field",
          options: e.draft.fields?.filter((c) => c.type === "principal").map((c) => ({ label: c.title || c.code, value: c.code })) ?? [],
          optionLabel: "label",
          optionValue: "value",
          appendTo: "self",
          "onUpdate:modelValue": i[0] || (i[0] = (c) => l("update:modelValue", { field: c }))
        }, null, 8, ["model-value", "aria-label", "options"])
      ])) : (n(), H(Sl, {
        key: 1,
        "board-id": e.boardId,
        label: e.label,
        kinds: o.value === "group" ? "group" : "user,group,service",
        "model-value": r.value,
        "onUpdate:modelValue": m
      }, null, 8, ["board-id", "label", "kinds", "model-value"]))
    ], 8, nu));
  }
}), uu = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, cu = {
  class: "work-stack work-tight",
  "aria-label": "Approval sources"
}, vu = { class: "work-row" }, mu = {
  key: 0,
  class: "work-stack work-tight"
}, fu = ["kinds", "value"], pu = {
  key: 2,
  class: "work-muted work-small",
  role: "status"
}, bu = {
  key: 3,
  class: "work-chips"
}, hu = { class: "work-row work-small" }, gu = { class: "work-stack work-tight" }, yu = {
  key: 4,
  class: "work-error work-small",
  role: "alert"
}, ku = {
  key: 5,
  class: "work-muted work-small"
}, wu = /* @__PURE__ */ ke({
  __name: "ApproversEditor",
  props: {
    approvals: {},
    boardId: {}
  },
  emits: ["validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, { principalLabel: o, rememberPrincipal: r, nameError: p } = vo(() => t.boardId ?? "", () => Array.isArray(t.approvals.from) ? t.approvals.from : "group" in t.approvals.from ? [{ kind: "group", id: t.approvals.from.group }] : []), m = M(!1), u = W(() => Array.isArray(t.approvals.from) ? "principals" : "field" in t.approvals.from ? "field" : "group"), i = W(() => Array.isArray(t.approvals.from) ? t.approvals.from.some((h) => h.kind === "group") || t.approvals.from.length >= t.approvals.min : "field" in t.approvals.from ? !!t.approvals.from.field : !!t.approvals.from.group);
    co(() => l("validity", Number.isSafeInteger(t.approvals.min) && t.approvals.min > 0 && i.value)), kt(() => l("validity", !0)), pa(async () => {
      m.value = await Tt("wc-principal-picker");
    });
    function c(h) {
      t.approvals.from = h === "group" ? { group: "" } : h === "field" ? { field: "" } : [];
    }
    function f(h) {
      const $ = h.detail, k = $?.principal_id ?? $?.id;
      if (u.value === "group") {
        t.approvals.from = { group: k ?? "" };
        return;
      }
      if (!k || !Array.isArray(t.approvals.from)) return;
      const I = { kind: $.type ?? $.kind ?? "user", id: k };
      $.label && r(I, $.label), t.approvals.from.some((V) => V.id === k && V.kind === I.kind) || t.approvals.from.push(I);
    }
    function y(h) {
      Array.isArray(t.approvals.from) && t.approvals.from.splice(h, 1);
    }
    return (h, $) => (n(), b(te, null, [
      s(p) ? (n(), b("p", uu, E(s(p)), 1)) : U("", !0),
      d("section", cu, [
        d("label", vu, [
          $[4] || ($[4] = d("span", { class: "work-spacer" }, "Approvals needed", -1)),
          g(s(ht), {
            modelValue: e.approvals.min,
            "onUpdate:modelValue": $[0] || ($[0] = (k) => e.approvals.min = k),
            min: 1,
            required: "",
            useGrouping: !1
          }, null, 8, ["modelValue"])
        ]),
        $[8] || ($[8] = d("span", { class: "work-field-label" }, "Approvers", -1)),
        "field" in e.approvals.from ? (n(), b("label", mu, [
          $[5] || ($[5] = F("Principal field", -1)),
          g(s(ye), {
            modelValue: e.approvals.from.field,
            "onUpdate:modelValue": $[1] || ($[1] = (k) => e.approvals.from.field = k),
            "aria-label": "Principal field"
          }, null, 8, ["modelValue"])
        ])) : m.value ? (n(), b("wc-principal-picker", {
          key: u.value,
          kinds: u.value === "group" ? "group" : "user,group,service",
          value: JSON.stringify("group" in e.approvals.from ? { type: "group", principal_id: e.approvals.from.group } : {}),
          onConfigChanged: f
        }, null, 40, fu)) : (n(), b("p", pu, "The principal picker is unavailable.")),
        Array.isArray(e.approvals.from) ? (n(), b("div", bu, [
          (n(!0), b(te, null, re(e.approvals.from, (k, I) => (n(), H(s(Ye), {
            key: k.kind + ":" + k.id,
            class: "kx-tag-sm",
            severity: "secondary"
          }, {
            default: j(() => [
              F(E(s(o)(k)), 1),
              g(s(Z), {
                "aria-label": "Remove approver " + (I + 1),
                text: "",
                severity: "secondary",
                size: "small",
                onClick: (V) => y(I)
              }, {
                default: j(() => [
                  g(s(ce), {
                    icon: "tabler:x",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["aria-label", "onClick"])
            ]),
            _: 2
          }, 1024))), 128))
        ])) : U("", !0),
        d("label", hu, [
          $[6] || ($[6] = d("span", { class: "work-spacer" }, "The person who moves the item here cannot approve this visit", -1)),
          g(s(Ze), {
            modelValue: e.approvals.prevent_self,
            "onUpdate:modelValue": $[2] || ($[2] = (k) => e.approvals.prevent_self = k),
            "aria-label": "The person who moves the item here cannot approve this visit"
          }, null, 8, ["modelValue"])
        ]),
        g(Le, {
          class: "work-process-options",
          label: "Approval options"
        }, {
          default: j(() => [
            d("label", gu, [
              $[7] || ($[7] = F("Approval source", -1)),
              g(s(ve), {
                "model-value": u.value,
                "onUpdate:modelValue": $[3] || ($[3] = (k) => c(k)),
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                options: [{ label: "Group members", value: "group" }, { label: "People and groups", value: "principals" }, { label: "Principal field", value: "field" }]
              }, null, 8, ["model-value"])
            ])
          ]),
          _: 1
        }),
        Array.isArray(e.approvals.from) && !i.value ? (n(), b("p", yu, "Select at least " + E(e.approvals.min) + " distinct principals, or lower the minimum.", 1)) : "group" in e.approvals.from && !e.approvals.from.group ? (n(), b("p", ku, "Choose the group that can approve this state.")) : U("", !0)
      ])
    ], 64));
  }
}), Vu = {
  class: "work-state-settings work-stack",
  "aria-label": "State settings"
}, $u = { class: "work-process-kind" }, xu = { class: "work-row" }, Cu = { class: "work-row" }, Su = { class: "work-stack" }, Tu = { class: "work-row" }, Iu = { class: "work-stack work-tight" }, Du = { class: "work-row" }, Uu = { class: "work-stack work-tight" }, Eu = { class: "work-row" }, Au = { class: "work-row" }, Ou = { class: "work-stack work-tight" }, Pu = { class: "work-stack" }, Ru = { class: "work-row" }, Nu = { class: "work-row" }, Mu = { class: "work-stack work-tight" }, Fu = { class: "work-stack work-tight" }, Lu = {
  key: 0,
  class: "work-row"
}, Bu = { class: "work-stack" }, zu = { class: "work-stack work-tight" }, ju = { class: "work-row" }, Wu = /* @__PURE__ */ ke({
  __name: "StateSettings",
  props: {
    state: {},
    process: {},
    draft: {},
    boardId: {}
  },
  emits: ["validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = W(() => (t.process.transitions ?? []).filter((u) => u.from === "any" || u.from.includes(t.state.id))), r = [{ value: "human", icon: "user" }, { value: "gate", icon: "shield-check" }, { value: "automated", icon: "bolt" }, { value: "parallel", icon: "arrows-split" }];
    function p(u) {
      const i = t.state;
      i.kind = u, delete i.run, delete i.release_when, delete i.regions, delete i.join, delete i.due, (u === "automated" || u === "gate") && delete i.awaiting, u === "automated" && (i.run = { stage: i.id, retry: { max: 1, backoff: "PT1M" } }), u === "gate" && (i.release_when = { approvals: { min: 1, from: { group: "" }, prevent_self: !0 } }), u === "parallel" && (i.regions = [{ id: "region_1", initial: t.process.states.find((c) => c.id !== i.id)?.id ?? "" }], i.join = "all");
    }
    function m(u) {
      t.state.run && (u ? t.state.run.on_fail = u : delete t.state.run.on_fail);
    }
    return (u, i) => (n(), b("section", Vu, [
      i[57] || (i[57] = d("h4", { class: "work-process-group" }, "Who moves the item on", -1)),
      g(s($l), {
        class: "work-process-kinds",
        "model-value": e.state.kind ?? "human",
        options: r.map((c) => ({
          ...c,
          label: s(Oa)(c.value)
        })),
        optionLabel: "label",
        optionValue: "value",
        optionDisabled: "disabled",
        "allow-empty": !1,
        "aria-label": "Who moves the item on",
        "onUpdate:modelValue": p
      }, {
        option: j(({ option: c }) => [
          d("span", $u, [
            g(s(ce), {
              icon: "tabler:" + c.icon
            }, null, 8, ["icon"]),
            d("span", null, E(c.label), 1)
          ])
        ]),
        _: 1
      }, 8, ["model-value", "options"]),
      i[58] || (i[58] = d("h4", { class: "work-process-group" }, "Limit", -1)),
      d("label", xu, [
        i[34] || (i[34] = d("span", { class: "work-spacer" }, "Items allowed here", -1)),
        g(to, {
          draft: e.draft,
          state: e.state.id,
          label: "Items allowed here"
        }, null, 8, ["draft", "state"])
      ]),
      d("label", Cu, [
        i[35] || (i[35] = d("span", { class: "work-spacer" }, [
          F("Refuse moves over the limit"),
          d("small", { class: "work-muted work-block" }, "Off only warns")
        ], -1)),
        g(to, {
          draft: e.draft,
          state: e.state.id,
          label: "Refuse moves over the limit",
          hard: ""
        }, null, 8, ["draft", "state"])
      ]),
      i[59] || (i[59] = d("h4", { class: "work-process-group" }, "Required on entry", -1)),
      g(rt, {
        label: "Required fields",
        options: e.draft.fields?.map((c) => ({ value: c.code, label: c.title || c.code })) ?? [],
        modelValue: e.state.require,
        "onUpdate:modelValue": i[0] || (i[0] = (c) => e.state.require = c)
      }, null, 8, ["options", "modelValue"]),
      !e.state.kind || e.state.kind === "human" ? (n(), H(Mt, {
        key: 0,
        modelValue: e.state.due,
        "onUpdate:modelValue": i[1] || (i[1] = (c) => e.state.due = c),
        label: "Time allowed in this state",
        onValidity: i[2] || (i[2] = (c, f) => l("validity", f, c))
      }, null, 8, ["modelValue"])) : U("", !0),
      e.state.kind === "gate" && e.state.release_when ? (n(), b(te, { key: 1 }, [
        i[37] || (i[37] = d("h4", { class: "work-process-group" }, "Approval", -1)),
        e.state.release_when.approvals ? (n(), H(wu, {
          key: 0,
          "board-id": e.boardId,
          approvals: e.state.release_when.approvals,
          onValidity: i[3] || (i[3] = (c) => l("validity", "approvers", c))
        }, null, 8, ["board-id", "approvals"])) : U("", !0),
        g(Le, {
          class: "work-process-options",
          label: "Release options"
        }, {
          default: j(() => [
            d("div", Su, [
              d("label", Tu, [
                i[36] || (i[36] = d("span", { class: "work-spacer" }, "Require approvals", -1)),
                g(s(Ze), {
                  "model-value": !!e.state.release_when.approvals,
                  "aria-label": "Require approvals",
                  "onUpdate:modelValue": i[4] || (i[4] = (c) => e.state.release_when.approvals = c ? { min: 1, from: { group: "" }, prevent_self: !0 } : void 0)
                }, null, 8, ["model-value"])
              ]),
              g(Mt, {
                modelValue: e.state.release_when.wait,
                "onUpdate:modelValue": i[5] || (i[5] = (c) => e.state.release_when.wait = c),
                label: "Wait before release",
                onValidity: i[6] || (i[6] = (c, f) => l("validity", f, c))
              }, null, 8, ["modelValue"]),
              g(Cl, {
                label: "Release when",
                draft: e.draft,
                "board-id": e.boardId,
                modelValue: e.state.release_when.when,
                "onUpdate:modelValue": i[7] || (i[7] = (c) => e.state.release_when.when = c),
                onValidity: i[8] || (i[8] = (c) => l("validity", "release", c))
              }, null, 8, ["draft", "board-id", "modelValue"])
            ])
          ]),
          _: 1
        })
      ], 64)) : U("", !0),
      e.state.kind === "automated" && e.state.run ? (n(), b(te, { key: 2 }, [
        i[46] || (i[46] = d("h4", { class: "work-process-group" }, "Automation", -1)),
        d("label", Iu, [
          i[38] || (i[38] = F("Run label", -1)),
          g(s(ye), {
            modelValue: e.state.run.stage,
            "onUpdate:modelValue": i[9] || (i[9] = (c) => e.state.run.stage = c),
            "aria-label": "Run label",
            required: ""
          }, null, 8, ["modelValue"])
        ]),
        g(Kd, {
          modelValue: e.state.run.flow_ref,
          "onUpdate:modelValue": i[10] || (i[10] = (c) => e.state.run.flow_ref = c),
          onValidity: i[11] || (i[11] = (c) => l("validity", "flow", c))
        }, null, 8, ["modelValue"]),
        g(Mt, {
          modelValue: e.state.run.timeout,
          "onUpdate:modelValue": i[12] || (i[12] = (c) => e.state.run.timeout = c),
          label: "Attempt timeout",
          onValidity: i[13] || (i[13] = (c, f) => l("validity", f, c))
        }, null, 8, ["modelValue"]),
        i[47] || (i[47] = d("small", { class: "work-muted" }, "Blank uses the board timeout, or one hour.", -1)),
        d("label", Du, [
          i[39] || (i[39] = d("span", { class: "work-spacer" }, "Maximum visits", -1)),
          g(s(ht), {
            "model-value": e.state.run.max_visits ?? null,
            "aria-label": "Maximum visits",
            min: 1,
            useGrouping: !1,
            placeholder: "Board default",
            "onUpdate:modelValue": i[14] || (i[14] = (c) => e.state.run.max_visits = c ?? void 0)
          }, null, 8, ["model-value"])
        ]),
        d("label", Uu, [
          i[40] || (i[40] = F("When visits are exhausted", -1)),
          g(s(ve), {
            "model-value": e.state.run.on_exhausted,
            "aria-label": "When visits are exhausted",
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            showClear: "",
            options: (e.process.transitions ?? []).filter((c) => !c.auto).map((c) => ({ label: s(je)(c), value: c.id })),
            "onUpdate:modelValue": i[15] || (i[15] = (c) => e.state.run.on_exhausted = c || void 0)
          }, null, 8, ["model-value", "options"])
        ]),
        i[48] || (i[48] = d("small", { class: "work-muted" }, "Blank records a failed run and stops automation. A route must leave every incoming state or be global.", -1)),
        d("label", Eu, [
          i[41] || (i[41] = d("span", { class: "work-spacer" }, "Retry if it fails", -1)),
          g(s(Ze), {
            "model-value": !!e.state.run.retry,
            "aria-label": "Retry if it fails",
            "onUpdate:modelValue": i[16] || (i[16] = (c) => e.state.run.retry = c ? { max: 1, backoff: "PT1M" } : void 0)
          }, null, 8, ["model-value"])
        ]),
        e.state.run.retry ? (n(), b(te, { key: 0 }, [
          d("label", Au, [
            i[42] || (i[42] = d("span", { class: "work-spacer" }, "Maximum attempts", -1)),
            g(s(ht), {
              modelValue: e.state.run.retry.max,
              "onUpdate:modelValue": i[17] || (i[17] = (c) => e.state.run.retry.max = c),
              min: 1,
              useGrouping: !1
            }, null, 8, ["modelValue"])
          ]),
          g(Mt, {
            modelValue: e.state.run.retry.backoff,
            "onUpdate:modelValue": i[18] || (i[18] = (c) => e.state.run.retry.backoff = c),
            label: "Wait between attempts",
            onValidity: i[19] || (i[19] = (c, f) => l("validity", f, c))
          }, null, 8, ["modelValue"])
        ], 64)) : U("", !0),
        (n(), b(te, null, re([{ key: "on_pass", label: "On success" }, { key: "on_cancel", label: "On cancellation" }], (c) => d("label", {
          key: c.key,
          class: "work-stack work-tight"
        }, [
          F(E(c.label), 1),
          g(s(ve), {
            "model-value": e.state.run[c.key],
            "aria-label": c.label,
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            showClear: "",
            options: o.value.map((f) => ({ label: s(je)(f), value: f.id })),
            "onUpdate:modelValue": (f) => e.state.run[c.key] = f || void 0
          }, null, 8, ["model-value", "aria-label", "options", "onUpdate:modelValue"])
        ])), 64)),
        d("label", Ou, [
          i[43] || (i[43] = F("If it fails, go to", -1)),
          g(s(ve), {
            "aria-label": "If it fails, go to",
            "model-value": e.state.run.on_fail,
            "onUpdate:modelValue": m,
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            showClear: "",
            options: o.value.map((c) => ({
              label: s(je)(c) + " → " + s(he)(e.process.states.find((f) => f.id === c.to)),
              value: c.id
            }))
          }, null, 8, ["model-value", "options"])
        ]),
        g(Le, {
          class: "work-disclosure",
          label: "Board automation defaults"
        }, {
          default: j(() => [
            d("div", Pu, [
              i[45] || (i[45] = d("p", { class: "work-muted" }, "These values apply to automated states without their own limit.", -1)),
              g(Mt, {
                "model-value": e.draft.policy?.stage_timeout,
                label: "Default attempt timeout",
                "onUpdate:modelValue": i[20] || (i[20] = (c) => (e.draft.policy ??= {}).stage_timeout = c),
                onValidity: i[21] || (i[21] = (c, f) => l("validity", f, c))
              }, null, 8, ["model-value"]),
              d("label", Ru, [
                i[44] || (i[44] = d("span", { class: "work-spacer" }, "Default maximum visits", -1)),
                g(s(ht), {
                  "model-value": e.draft.policy?.stage_max_visits ?? null,
                  "aria-label": "Default maximum visits",
                  min: 1,
                  useGrouping: !1,
                  placeholder: "5",
                  "onUpdate:modelValue": i[22] || (i[22] = (c) => (e.draft.policy ??= {}).stage_max_visits = c ?? void 0)
                }, null, 8, ["model-value"])
              ])
            ])
          ]),
          _: 1
        })
      ], 64)) : U("", !0),
      e.state.kind === "parallel" && e.state.regions ? (n(), b(te, { key: 3 }, [
        i[53] || (i[53] = d("h4", { class: "work-process-group" }, "Lanes", -1)),
        (n(!0), b(te, null, re(e.state.regions, (c, f) => (n(), b("div", {
          key: f,
          class: "work-process-value work-stack work-tight"
        }, [
          d("div", Nu, [
            d("span", null, "Lane " + E(f + 1), 1),
            i[49] || (i[49] = d("span", { class: "work-spacer" }, null, -1)),
            g(s(Z), {
              severity: "danger",
              text: "",
              size: "small",
              "aria-label": "Remove lane",
              onClick: (y) => e.state.regions.splice(f, 1)
            }, {
              default: j(() => [
                g(s(ce), { icon: "tabler:trash" })
              ]),
              _: 1
            }, 8, ["onClick"])
          ]),
          d("label", Mu, [
            i[50] || (i[50] = F("Starts at", -1)),
            g(s(ve), {
              "aria-label": "Lane starts at",
              modelValue: c.initial,
              "onUpdate:modelValue": (y) => c.initial = y,
              appendTo: "self",
              optionLabel: "label",
              optionValue: "value",
              options: e.process.states.filter((y) => y.id !== e.state.id).map((y) => ({ label: s(he)(y), value: y.id }))
            }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
          ])
        ]))), 128)),
        g(s(Z), {
          label: "Add lane",
          severity: "secondary",
          outlined: "",
          size: "small",
          onClick: i[23] || (i[23] = (c) => e.state.regions.push({
            id: s(Nt)("region", e.state.regions),
            initial: e.process.states.find((f) => f.id !== e.state.id)?.id ?? ""
          }))
        }, {
          icon: j(() => [
            g(s(ce), { icon: "tabler:plus" })
          ]),
          _: 1
        }),
        d("label", Fu, [
          i[51] || (i[51] = F("Finish rule", -1)),
          g(s(ve), {
            "model-value": typeof e.state.join == "number" ? "count" : e.state.join ?? "all",
            appendTo: "self",
            options: [
              { label: "All must pass", value: "all" },
              { label: "Any may pass", value: "any" },
              { label: "A number must pass", value: "count" }
            ],
            optionLabel: "label",
            optionValue: "value",
            "onUpdate:modelValue": i[24] || (i[24] = (c) => e.state.join = c === "count" ? 1 : c)
          }, null, 8, ["model-value"])
        ]),
        typeof e.state.join == "number" ? (n(), b("label", Lu, [
          i[52] || (i[52] = d("span", { class: "work-spacer" }, "Lanes needed", -1)),
          g(s(ht), {
            modelValue: e.state.join,
            "onUpdate:modelValue": i[25] || (i[25] = (c) => e.state.join = c),
            min: 1,
            max: e.state.regions.length,
            useGrouping: !1
          }, null, 8, ["modelValue", "max"])
        ])) : U("", !0)
      ], 64)) : U("", !0),
      g(Le, {
        class: "work-disclosure",
        label: "Advanced state settings"
      }, {
        default: j(() => [
          d("div", Bu, [
            i[56] || (i[56] = d("h4", { class: "work-process-group" }, "Assignment and conditions", -1)),
            d("label", zu, [
              i[54] || (i[54] = F("Stage label", -1)),
              g(s(ye), {
                "model-value": e.state.stage,
                "aria-label": "Stage label",
                "onUpdate:modelValue": i[26] || (i[26] = (c) => e.state.stage = c || void 0)
              }, null, 8, ["model-value"])
            ]),
            !e.state.kind || e.state.kind === "human" || e.state.kind === "parallel" ? (n(), b(te, { key: 0 }, [
              d("label", ju, [
                g(s(Ze), {
                  "model-value": !!e.state.awaiting,
                  "aria-label": "Awaiting people",
                  "onUpdate:modelValue": i[27] || (i[27] = (c) => e.state.awaiting = c ? { group: "" } : void 0)
                }, null, 8, ["model-value"]),
                i[55] || (i[55] = F("Awaiting people", -1))
              ]),
              e.state.awaiting ? (n(), H(du, {
                key: 0,
                modelValue: e.state.awaiting,
                "onUpdate:modelValue": i[28] || (i[28] = (c) => e.state.awaiting = c),
                draft: e.draft,
                "board-id": e.boardId,
                label: "Awaiting",
                onValidity: i[29] || (i[29] = (c) => l("validity", "awaiting", c))
              }, null, 8, ["modelValue", "draft", "board-id"])) : U("", !0)
            ], 64)) : U("", !0),
            g(Sl, {
              "board-id": e.boardId,
              modelValue: e.state.assign,
              "onUpdate:modelValue": i[30] || (i[30] = (c) => e.state.assign = c),
              label: "Assign to"
            }, null, 8, ["board-id", "modelValue"]),
            g(It, {
              label: "State checks",
              example: ["installed-check"],
              "model-value": e.state.invariants,
              shape: "array",
              "onUpdate:modelValue": i[31] || (i[31] = (c) => e.state.invariants = c),
              onValidity: i[32] || (i[32] = (c) => l("validity", "invariants", c))
            }, null, 8, ["model-value"]),
            g(iu, {
              state: e.state,
              draft: e.draft,
              onValidity: i[33] || (i[33] = (c, f) => l("validity", "timer-" + c, f))
            }, null, 8, ["state", "draft"])
          ])
        ]),
        _: 1
      })
    ]));
  }
}), qu = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, Ku = { key: 1 }, Gu = { class: "work-muted" }, Hu = {
  key: 2,
  class: "work-map-zoom",
  role: "group",
  "aria-label": "Map zoom"
}, Yu = ["aria-label", "aria-keyshortcuts", "onKeydown"], Xu = { class: "work-row" }, Ju = { class: "work-process-meaning" }, Zu = {
  key: 0,
  class: "work-muted"
}, Qu = { class: "work-stack work-tight" }, _u = { class: "work-process-inspector-foot" }, ec = { class: "work-row work-transition-actions" }, tc = { class: "work-process-meaning" }, ac = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, lc = { class: "work-stack work-tight" }, oc = { class: "work-stack" }, ic = { class: "work-stack work-tight" }, nc = {
  key: 0,
  class: "work-muted"
}, sc = { class: "work-stack work-tight" }, rc = { class: "work-dialog-actions" }, dc = /* @__PURE__ */ ke({
  __name: "ProcessEditor",
  props: {
    draft: {},
    guardRemoval: { type: Function },
    issues: {},
    boardId: {},
    counts: {},
    countTypes: {},
    guards: {}
  },
  emits: ["validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = W(() => t.draft.processes ?? []), r = M(!1), p = M(""), m = M(""), u = M(""), i = M("Map"), c = M(""), f = M(), y = M(), h = M(), $ = M(), k = M(), I = M(), V = M(!1);
    let x;
    async function A() {
      V.value = !0, await Ht(), k.value?.querySelector('[aria-label="State name"]')?.focus();
    }
    const S = W(() => o.value.find((B) => B.id === m.value) ?? o.value[0]), oe = M(!1);
    function X(B) {
      oe.value = !0, i.value = B;
    }
    function K() {
      !oe.value && $.value?.clientWidth && (i.value = $.value.clientWidth < 480 && (S.value?.states.length ?? 0) > 6 ? "List" : "Map");
    }
    let de;
    pa(() => {
      K(), $.value && typeof ResizeObserver < "u" && (de = new ResizeObserver(K), de.observe($.value));
    }), kt(() => de?.disconnect()), Ie(S, () => {
      oe.value = !1, K();
    });
    function Q() {
      V.value = !1, f.value = void 0, y.value = void 0, u.value = "", x = void 0;
    }
    async function me() {
      const B = x;
      Q(), await Ht(), B?.isConnected ? B.focus() : ge();
    }
    function ge() {
      i.value === "Map" ? h.value?.focus() : I.value?.focus();
    }
    async function ae() {
      await Ht(), k.value && (k.value.scrollTop = 0, k.value.focus({ preventScroll: !0 }), (k.value.closest(".work-settings-shell")?.clientWidth ?? 1 / 0) <= 700 && k.value.scrollIntoView?.({ block: "nearest" }));
    }
    function P(B, O) {
      x = O, V.value = !1, f.value = B, y.value = void 0, c.value = "", u.value = "", ae();
    }
    function L(B, O) {
      x = O, V.value = !1, y.value = B, f.value = void 0, u.value = "", ae();
    }
    Ie([S, i], Q);
    const T = W(() => {
      if (!t.counts || !S.value) return;
      const B = t.countTypes?.filter((O) => O.process === S.value?.id) ?? [];
      return Object.fromEntries(S.value.states.map((O) => [
        O.id,
        B.reduce((N, C) => N + (t.counts?.[C.id]?.[O.id] ?? 0), 0)
      ]));
    }), z = W(() => (t.guards ?? []).filter((B) => t.draft.plugins?.some((O) => O.use === B.plugin))), J = W(() => Object.keys(t.draft.policy?.wip ?? {}).filter((B) => !o.value.some((O) => O.states.some((N) => N.id === B))));
    function ue(B) {
      B === "__new" ? r.value = !0 : m.value = B;
    }
    function se() {
      const B = p.value.trim();
      if (!B) return;
      const O = B.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "") || "process", N = (/^[a-z]/.test(O) ? O : "process_" + O).slice(0, 40), C = o.value.some((G) => G.id === N) ? Nt(N, o.value) : N;
      (t.draft.processes ??= []).push({ id: C, name: B, initial: "todo", states: [{ id: "todo", name: "To do", category: "unstarted" }], transitions: [] }), m.value = C, p.value = "", r.value = !1;
    }
    async function Oe(B, O) {
      const N = { id: Nt("state", B.states), name: "New state", category: "started" }, C = Ia(B), G = C.at(-1), D = f.value ?? (G?.category === "completed" ? C.at(-2) : G), ne = D && (B.transitions?.find((we) => we.default && we.from !== "any" && we.from.includes(D.id)) ?? B.transitions?.find((we) => we.from !== "any" && we.from.includes(D.id) && B.states.findIndex((Se) => Se.id === we.to) > B.states.indexOf(D)));
      if (B.states.splice(D ? B.states.indexOf(D) + 1 : B.states.length, 0, N), D && D.category !== "completed" && D.category !== "canceled")
        if (ne) {
          const we = ne.to;
          ne.to = N.id, (B.transitions ??= []).push({ id: Nt("transition", B.transitions ?? []), name: "Continue", from: [N.id], to: we, ...ne.auto && ne.default ? { auto: !0, default: !0 } : {} });
        } else (B.transitions ??= []).push({ id: Nt("transition", B.transitions ?? []), name: "Continue", from: [D.id], to: N.id });
      P(N, O), await A();
    }
    function De(B, O, N = x) {
      const C = S.value;
      if (!C || !O || B === O) return;
      const G = C.transitions ??= [], D = `to_${O}`;
      let ne = D.slice(0, 40), we = 2;
      for (; G.some((xe) => xe.id === ne); ) {
        const xe = `_${we++}`;
        ne = D.slice(0, 40 - xe.length) + xe;
      }
      const Se = { id: ne, name: `To ${he(C.states.find((xe) => xe.id === O)).toLowerCase()}`, from: [B], to: O };
      G.push(Se), L(Se, N);
    }
    function q(B, O) {
      const N = f.value ?? B.states.find((D) => D.id === B.initial) ?? B.states[0], C = B.states.find((D) => D.id !== N?.id);
      if (!N || !C) return;
      const G = { id: Nt("transition", B.transitions ?? []), name: "To " + he(C), from: [N.id], to: C.id };
      (B.transitions ??= []).push(G), L(G, O);
    }
    async function v(B) {
      const O = S.value, N = O?.transitions?.indexOf(B) ?? -1;
      if (!O || N < 0) return;
      const C = fi(O, B);
      if (C.length) {
        u.value = `Used by ${C.join(", ")}. Update those references first.`;
        return;
      }
      O.transitions.splice(N, 1), Q(), await Ht(), ge();
    }
    function w(B) {
      !y.value || B.defaultPrevented || B.repeat || (B.preventDefault(), v(y.value));
    }
    function _(B, O) {
      const N = pi(B, O);
      if (N.length) {
        u.value = `${he(O)} is used by ${N.join(", ")}. Update these references first.`;
        return;
      }
      B.states.splice(B.states.indexOf(O), 1), me();
    }
    async function R(B) {
      const O = t.draft.item_types?.filter((C) => C.process === B.id).map((C) => C.title || "Untitled item type") ?? [];
      if (O.length) {
        u.value = `Used by ${O.join(", ")}. Choose a different process for those item types first.`;
        return;
      }
      const N = await t.guardRemoval?.("processes", B.id);
      if (N) {
        u.value = N;
        return;
      }
      ba(t.draft, "processes", B.id), m.value = "", Q();
    }
    return (B, O) => (n(), b("section", {
      ref_key: "editor",
      ref: $,
      class: "work-process-editor work-stack",
      "aria-label": "Process editor",
      onKeydown: O[16] || (O[16] = Ee((N) => k.value && me(), ["esc"]))
    }, [
      u.value && !y.value ? (n(), b("p", qu, E(u.value), 1)) : U("", !0),
      (n(!0), b(te, null, re(e.issues?.filter((N) => N.code === "process " + S.value?.id) ?? [], (N) => (n(), b("p", {
        key: N.what + N.detail,
        class: "work-error work-small",
        role: "alert"
      }, E(s(za)(N)) + " · " + E(N.what), 1))), 128)),
      S.value ? (n(), b("div", {
        key: 1,
        class: st(["work-process-builder", { "work-process-inspecting": f.value || y.value }])
      }, [
        d("div", {
          ref_key: "tools",
          ref: I,
          class: "work-process-controls",
          role: "toolbar",
          "aria-label": "Process tools",
          tabindex: "-1"
        }, [
          o.value.length > 1 ? (n(), H(s(ve), {
            key: 0,
            "model-value": S.value.id,
            "aria-label": "Process",
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            options: [
              ...o.value.map((N) => ({ label: N.name || "Untitled process", value: N.id })),
              { label: "New process…", value: "__new" }
            ],
            "onUpdate:modelValue": ue
          }, null, 8, ["model-value", "options"])) : (n(), b("strong", Ku, E(S.value.name || "Untitled process"), 1)),
          g(s(Z), {
            label: "Add state",
            severity: "secondary",
            outlined: "",
            size: "small",
            onClick: O[0] || (O[0] = (N) => Oe(S.value, N.currentTarget))
          }, {
            icon: j(() => [
              g(s(ce), { icon: "tabler:plus" })
            ]),
            _: 1
          }),
          g(s(Z), {
            label: "Add transition",
            severity: "secondary",
            outlined: "",
            size: "small",
            disabled: S.value.states.length < 2,
            onClick: O[1] || (O[1] = (N) => q(S.value, N.currentTarget))
          }, null, 8, ["disabled"]),
          g(s(ve), {
            modelValue: S.value.initial,
            "onUpdate:modelValue": O[2] || (O[2] = (N) => S.value.initial = N),
            "aria-label": "Starts in " + s(he)(S.value.states.find((N) => N.id === S.value.initial)),
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            options: S.value.states.map((N) => ({ label: s(he)(N), value: N.id }))
          }, {
            value: j(() => [
              d("span", Gu, "Starts in " + E(s(he)(S.value.states.find((N) => N.id === S.value.initial))), 1)
            ]),
            _: 1
          }, 8, ["modelValue", "aria-label", "options"]),
          O[17] || (O[17] = d("span", { class: "work-spacer" }, null, -1)),
          i.value === "Map" ? (n(), b("div", Hu, [
            g(s(Z), {
              label: "Fit",
              title: "Fit the map to a readable width",
              text: "",
              severity: "secondary",
              size: "small",
              onClick: O[3] || (O[3] = (N) => h.value?.fit())
            }, {
              icon: j(() => [
                g(s(ce), { icon: "tabler:arrows-maximize" })
              ]),
              _: 1
            }),
            i.value === "Map" ? (n(), H(s(Z), {
              key: 0,
              "aria-label": "Zoom out",
              title: "Zoom out",
              text: "",
              severity: "secondary",
              size: "small",
              onClick: O[4] || (O[4] = (N) => h.value?.zoomOut())
            }, {
              default: j(() => [
                g(s(ce), { icon: "tabler:minus" })
              ]),
              _: 1
            })) : U("", !0),
            i.value === "Map" ? (n(), H(s(Z), {
              key: 1,
              "aria-label": "Zoom in",
              title: "Zoom in",
              text: "",
              severity: "secondary",
              size: "small",
              onClick: O[5] || (O[5] = (N) => h.value?.zoomIn())
            }, {
              default: j(() => [
                g(s(ce), { icon: "tabler:plus" })
              ]),
              _: 1
            })) : U("", !0)
          ])) : U("", !0),
          g(s($l), {
            "model-value": i.value,
            "onUpdate:modelValue": X,
            options: ["Map", "List"],
            "allow-empty": !1,
            "aria-label": "Process layout"
          }, null, 8, ["model-value"]),
          o.value.length === 1 ? (n(), H(s(Z), {
            key: 3,
            label: "New process",
            "aria-label": "New process",
            text: "",
            severity: "secondary",
            size: "small",
            onClick: O[6] || (O[6] = (N) => r.value = !0)
          }, {
            icon: j(() => [
              g(s(ce), { icon: "tabler:plus" })
            ]),
            _: 1
          })) : U("", !0)
        ], 512),
        i.value === "Map" ? (n(), H(td, {
          key: 0,
          ref_key: "graph",
          ref: h,
          process: S.value,
          draft: e.draft,
          "fit-on-open": "",
          "selected-state": f.value,
          "selected-transition": y.value,
          onState: P,
          onTransition: L,
          onRemoveTransition: w,
          onConnect: De,
          onClear: me
        }, null, 8, ["process", "draft", "selected-state", "selected-transition"])) : (n(), H(wd, {
          key: 1,
          process: S.value,
          "selected-state": f.value,
          "selected-transition": y.value,
          counts: T.value,
          onState: P,
          onTransition: L,
          onRemoveState: O[7] || (O[7] = (N) => _(S.value, N)),
          onRemoveTransition: v
        }, null, 8, ["process", "selected-state", "selected-transition", "counts"])),
        g(ro, { name: "work-panel" }, {
          default: j(() => [
            f.value || y.value ? (n(), b("aside", {
              key: 0,
              ref_key: "inspector",
              ref: k,
              class: "work-process-sideform",
              tabindex: "-1",
              "aria-label": f.value ? "State inspector" : "Transition inspector",
              "aria-keyshortcuts": y.value ? "Delete Backspace" : void 0,
              onKeydown: [
                Ee(Te(w, ["self"]), ["delete"]),
                Ee(Te(w, ["self"]), ["backspace"])
              ]
            }, [
              (n(!0), b(te, null, re(f.value ? [f.value] : [], (N) => (n(), b(te, {
                key: N.id
              }, [
                d("header", Xu, [
                  V.value ? (n(), H(s(ye), {
                    key: 1,
                    modelValue: N.name,
                    "onUpdate:modelValue": (C) => N.name = C,
                    class: "work-process-name",
                    "aria-label": "State name",
                    onBlur: O[8] || (O[8] = (C) => V.value = !1)
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])) : (n(), H(xl, {
                    key: 0,
                    class: "work-process-state-title",
                    "aria-label": "Rename state",
                    onActivate: A
                  }, {
                    default: j(() => [
                      d("span", null, E(s(he)(N)), 1)
                    ]),
                    _: 2
                  }, 1024)),
                  g(s(Z), {
                    severity: "secondary",
                    text: "",
                    size: "small",
                    "aria-label": "Close state editor",
                    onClick: me
                  }, {
                    default: j(() => [
                      g(s(ce), { icon: "tabler:x" })
                    ]),
                    _: 1
                  })
                ]),
                d("p", Ju, E(s(mi)(N, e.draft)), 1),
                T.value ? (n(), b("p", Zu, E(T.value[N.id] ?? 0) + " " + E(T.value[N.id] === 1 ? "item" : "items") + " currently here", 1)) : U("", !0),
                g(Wu, {
                  state: N,
                  process: S.value,
                  draft: e.draft,
                  "board-id": e.boardId,
                  onValidity: (C, G) => l("validity", C.includes("duration:") ? C : S.value.id + ":" + N.id + ":" + C, G)
                }, null, 8, ["state", "process", "draft", "board-id", "onValidity"]),
                d("label", Qu, [
                  O[18] || (O[18] = F("Phase", -1)),
                  g(s(ve), {
                    "aria-label": "Phase",
                    modelValue: N.category,
                    "onUpdate:modelValue": (C) => N.category = C,
                    appendTo: "self",
                    optionLabel: "label",
                    optionValue: "value",
                    options: ["triage", "backlog", ...s(mo)].map((C) => ({ label: s(Bt)(C), value: C }))
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                ]),
                O[19] || (O[19] = d("h4", { class: "work-process-group" }, "Next stop", -1)),
                g(s(ve), {
                  modelValue: c.value,
                  "onUpdate:modelValue": O[9] || (O[9] = (C) => c.value = C),
                  "aria-label": "Add transition to…",
                  placeholder: "Add transition to…",
                  appendTo: "self",
                  optionLabel: "label",
                  optionValue: "value",
                  options: S.value.states.filter((C) => C !== N).map((C) => ({ label: s(he)(C), value: C.id }))
                }, null, 8, ["modelValue", "options"]),
                g(s(Z), {
                  label: "Add transition",
                  severity: "secondary",
                  outlined: "",
                  size: "small",
                  disabled: !c.value,
                  onClick: (C) => De(N.id, c.value)
                }, {
                  icon: j(() => [
                    g(s(ce), { icon: "tabler:arrow-right" })
                  ]),
                  _: 1
                }, 8, ["disabled", "onClick"]),
                d("footer", _u, [
                  g(s(Z), {
                    label: "Remove state",
                    severity: "danger",
                    text: "",
                    size: "small",
                    onClick: (C) => _(S.value, N)
                  }, {
                    icon: j(() => [
                      g(s(ce), { icon: "tabler:trash" })
                    ]),
                    _: 1
                  }, 8, ["onClick"])
                ])
              ], 64))), 128)),
              (n(!0), b(te, null, re(y.value ? [y.value] : [], (N) => (n(), b(te, {
                key: N.id
              }, [
                d("header", ec, [
                  O[20] || (O[20] = d("h3", null, "Transition", -1)),
                  g(s(Z), {
                    type: "button",
                    label: "Remove transition",
                    severity: "danger",
                    text: "",
                    size: "small",
                    onClick: (C) => v(N)
                  }, {
                    icon: j(() => [
                      g(s(ce), { icon: "tabler:trash" })
                    ]),
                    _: 1
                  }, 8, ["onClick"]),
                  g(s(Z), {
                    severity: "secondary",
                    text: "",
                    size: "small",
                    "aria-label": "Close transition editor",
                    onClick: me
                  }, {
                    default: j(() => [
                      g(s(ce), { icon: "tabler:x" })
                    ]),
                    _: 1
                  })
                ]),
                d("p", tc, E(N.from === "any" ? "Any state" : N.from.map((C) => s(he)(S.value.states.find((G) => G.id === C))).join(", ")) + " → " + E(s(he)(S.value.states.find((C) => C.id === N.to))), 1),
                u.value ? (n(), b("p", ac, E(u.value), 1)) : U("", !0),
                d("label", lc, [
                  O[21] || (O[21] = F("Name", -1)),
                  g(s(ye), {
                    modelValue: N.name,
                    "onUpdate:modelValue": (C) => N.name = C,
                    placeholder: s(je)(N),
                    "aria-label": "Transition name"
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder"])
                ]),
                g(Od, {
                  transition: N,
                  process: S.value,
                  draft: e.draft,
                  "board-id": e.boardId,
                  guards: z.value,
                  onValidity: (C, G) => l("validity", S.value.id + ":transition-" + N.id + ":" + C, G)
                }, null, 8, ["transition", "process", "draft", "board-id", "guards", "onValidity"])
              ], 64))), 128))
            ], 40, Yu)) : U("", !0)
          ]),
          _: 1
        })
      ], 2)) : (n(), H(s(Z), {
        key: 2,
        label: "New process",
        severity: "secondary",
        outlined: "",
        onClick: O[10] || (O[10] = (N) => r.value = !0)
      }, {
        icon: j(() => [
          g(s(ce), { icon: "tabler:plus" })
        ]),
        _: 1
      })),
      S.value ? (n(), H(Le, {
        key: 3,
        class: "work-settings-card work-disclosure",
        label: "Advanced workflow settings"
      }, {
        default: j(() => [
          d("div", oc, [
            d("label", ic, [
              O[22] || (O[22] = F("Workflow name", -1)),
              g(s(ye), {
                modelValue: S.value.name,
                "onUpdate:modelValue": O[11] || (O[11] = (N) => S.value.name = N),
                "aria-label": "Workflow name"
              }, null, 8, ["modelValue"])
            ]),
            J.value.length ? (n(), b("p", nc, "Some item limits belong to removed states.")) : U("", !0),
            (n(!0), b(te, null, re(J.value, (N, C) => (n(), H(s(Z), {
              key: N,
              label: "Clear limit for removed state " + (C + 1),
              severity: "secondary",
              text: "",
              onClick: (G) => delete e.draft.policy.wip[N]
            }, null, 8, ["label", "onClick"]))), 128)),
            g(s(Z), {
              label: "Remove workflow",
              severity: "danger",
              text: "",
              size: "small",
              onClick: O[12] || (O[12] = (N) => R(S.value))
            })
          ])
        ]),
        _: 1
      })) : U("", !0),
      g(ml, {
        visible: r.value,
        label: "New process",
        onClose: O[15] || (O[15] = (N) => r.value = !1)
      }, {
        default: j(() => [
          d("form", {
            class: "work-dialog-box",
            "aria-label": "New process",
            onSubmit: Te(se, ["stop", "prevent"])
          }, [
            O[24] || (O[24] = d("h2", null, "New process", -1)),
            d("label", sc, [
              O[23] || (O[23] = F("Name", -1)),
              g(s(ye), {
                modelValue: p.value,
                "onUpdate:modelValue": O[13] || (O[13] = (N) => p.value = N),
                "aria-label": "New process name",
                autofocus: "",
                required: ""
              }, null, 8, ["modelValue"])
            ]),
            d("div", rc, [
              g(s(Z), {
                label: "Cancel",
                severity: "secondary",
                outlined: "",
                onClick: O[14] || (O[14] = (N) => r.value = !1)
              }),
              g(s(Z), {
                label: "Create process",
                type: "submit",
                disabled: !p.value.trim()
              }, null, 8, ["disabled"])
            ])
          ], 32)
        ]),
        _: 1
      }, 8, ["visible"])
    ], 544));
  }
}), uc = {
  class: "work-settings-card work-stack",
  "aria-label": "Existing items"
}, cc = {
  key: 0,
  class: "work-stack work-tight"
}, vc = { class: "work-row" }, mc = /* @__PURE__ */ ke({
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
    return (t, l) => (n(), b("section", uc, [
      l[2] || (l[2] = d("h3", { class: "work-row-title" }, "Items in changed states", -1)),
      (n(!0), b(te, null, re(e.removed, ({ process: o, state: r, count: p }) => (n(), b("label", {
        key: o.id + "/" + r.id,
        class: "work-stack work-tight"
      }, [
        F(" Move " + E(a(p)) + " from " + E(s(he)(r)) + " to ", 1),
        g(s(ve), {
          disabled: e.disabled,
          "model-value": o.map?.[r.id],
          "aria-label": "Move items from " + s(he)(r) + " to",
          placeholder: "Choose a state",
          appendTo: "self",
          optionLabel: "label",
          optionValue: "value",
          options: o.states.map((m) => ({ label: s(he)(m), value: m.id })),
          "onUpdate:modelValue": (m) => t.$emit("destination", o, r.id, m)
        }, null, 8, ["disabled", "model-value", "aria-label", "options", "onUpdate:modelValue"])
      ]))), 128)),
      e.renamed.length ? (n(), b("div", cc, [
        (n(!0), b(te, null, re(e.renamed, ({ process: o, state: r, count: p, name: m }) => (n(), b("p", {
          key: o.id + "/" + r.id
        }, [
          F(E(s(he)(r)) + " becomes ", 1),
          d("strong", null, E(m), 1),
          F(" for " + E(a(p)) + ". ", 1)
        ]))), 128)),
        d("label", vc, [
          g(s(Lt), {
            binary: "",
            "model-value": e.confirmed,
            disabled: e.disabled,
            "onUpdate:modelValue": l[0] || (l[0] = (o) => t.$emit("update:confirmed", o))
          }, null, 8, ["model-value", "disabled"]),
          l[1] || (l[1] = F(" Keep these items in their renamed states ", -1))
        ])
      ])) : U("", !0)
    ]));
  }
}), fc = {
  class: "work-stack",
  "aria-label": "Links editor"
}, pc = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, bc = { class: "work-definition-meta work-muted work-small" }, hc = { class: "work-settings-grid" }, gc = { class: "work-stack work-tight" }, yc = { class: "work-stack work-tight" }, kc = { class: "work-stack work-tight" }, wc = { class: "work-row" }, Vc = {
  key: 0,
  class: "work-muted work-small"
}, $c = {
  key: 1,
  class: "work-settings-grid"
}, xc = { class: "work-stack work-tight" }, Cc = { class: "work-stack work-tight" }, Sc = {
  key: 0,
  class: "work-chips"
}, Tc = { class: "work-stack work-tight" }, Ic = { class: "work-relation-preview work-small" }, Dc = { class: "work-muted" }, Uc = {
  key: 0,
  class: "kx-empty"
}, Ec = { class: "work-row work-add-definition" }, Ac = { class: "work-stack work-tight" }, Oc = /* @__PURE__ */ ke({
  __name: "RelationsEditor",
  props: {
    draft: {},
    guardRemoval: { type: Function }
  },
  setup(e) {
    const a = e, t = W(() => a.draft.relation_types ?? []), l = W(() => (a.draft.item_types ?? []).map((k) => ({ value: k.id, label: k.title || Ne(k.id) }))), o = li(/* @__PURE__ */ new WeakMap());
    function r(k, I, V) {
      V.length ? k[I] = V : delete k[I];
    }
    function p(k, I = "") {
      const V = I.trim();
      return /^[a-z][a-z0-9_]{0,39}$/.test(V) && !k.to_types?.includes(V);
    }
    function m(k) {
      const I = o.get(k)?.trim();
      !I || !p(k, I) || (r(k, "to_types", [...k.to_types ?? [], I]), o.delete(k));
    }
    const u = M(""), i = M(""), c = M(!1), f = W(() => !!u.value.trim());
    function y() {
      const k = u.value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "").slice(0, 40), I = /^[a-z]/.test(k) ? k : "link_" + (k || "new");
      let V = I, x = 2;
      for (; t.value.some((A) => A.id === V); ) V = I + "_" + x++;
      return V;
    }
    function h() {
      f.value && ((a.draft.relation_types ??= []).push({ id: y(), outward: u.value.trim(), inward: u.value.trim(), cardinality: "many" }), u.value = "");
    }
    async function $(k) {
      if (!c.value) {
        c.value = !0, i.value = "";
        try {
          const I = await a.guardRemoval?.("relation_types", k);
          I ? i.value = I : ba(a.draft, "relation_types", k);
        } finally {
          c.value = !1;
        }
      }
    }
    return (k, I) => (n(), b("section", fc, [
      i.value ? (n(), b("p", pc, E(i.value), 1)) : U("", !0),
      g(Wa, {
        columns: "relations",
        count: t.value.length
      }, {
        default: j(() => [
          (n(!0), b(te, null, re(t.value, (V, x) => (n(), H(ja, {
            title: V.outward || s(Ne)(V.id),
            kind: V.symmetric ? "Same both ways" : "Different each way",
            key: x,
            class: "work-stack"
          }, {
            usage: j(() => [
              d("span", bc, E(V.outward || "Related work") + " · " + E(V.inward || "Reverse relation"), 1)
            ]),
            actions: j(() => [
              g(s(Z), {
                severity: "secondary",
                text: "",
                disabled: c.value,
                onClick: (A) => $(V.id),
                "aria-label": "Remove link type",
                size: "small"
              }, {
                default: j(() => [
                  g(s(ce), {
                    icon: "tabler:trash",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["disabled", "onClick"])
            ]),
            default: j(() => [
              d("div", hc, [
                d("label", gc, [
                  I[1] || (I[1] = F("Shown on this item ", -1)),
                  g(s(ye), {
                    modelValue: V.outward,
                    "onUpdate:modelValue": (A) => V.outward = A,
                    "aria-label": "Shown on this item"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                d("label", yc, [
                  I[2] || (I[2] = F("Shown on the other item ", -1)),
                  g(s(ye), {
                    modelValue: V.inward,
                    "onUpdate:modelValue": (A) => V.inward = A,
                    "aria-label": "Shown on the other item"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                d("label", kc, [
                  I[3] || (I[3] = F("Links allowed ", -1)),
                  g(s(ve), {
                    "model-value": V.cardinality ?? "many",
                    "onUpdate:modelValue": (A) => V.cardinality = A,
                    "aria-label": "Links allowed",
                    appendTo: "self",
                    optionLabel: "label",
                    optionValue: "value",
                    optionDisabled: "disabled",
                    options: [{ label: "One link", value: "one", disabled: !1 }, { label: "Many links", value: "many", disabled: !1 }]
                  }, null, 8, ["model-value", "onUpdate:modelValue"])
                ]),
                d("label", wc, [
                  g(s(Lt), {
                    modelValue: V.symmetric,
                    "onUpdate:modelValue": (A) => V.symmetric = A,
                    disabled: !!(V.from_types?.length || V.to_types?.length),
                    "aria-label": "Same meaning in both directions",
                    binary: ""
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"]),
                  I[4] || (I[4] = F("Same meaning in both directions ", -1))
                ])
              ]),
              V.from_types?.length || V.to_types?.length ? (n(), b("p", Vc, " Clear the source and target types to use the same meaning in both directions. ")) : U("", !0),
              V.symmetric ? U("", !0) : (n(), b("div", $c, [
                g(rt, {
                  label: "Source item types",
                  options: l.value,
                  "model-value": V.from_types,
                  "onUpdate:modelValue": (A) => r(V, "from_types", A)
                }, null, 8, ["options", "model-value", "onUpdate:modelValue"]),
                d("div", xc, [
                  d("label", Cc, [
                    I[5] || (I[5] = F("Target type ID ", -1)),
                    g(s(ye), {
                      "model-value": o.get(V) ?? "",
                      "onUpdate:modelValue": (A) => o.set(V, A ?? ""),
                      "aria-label": "Target type ID",
                      placeholder: "e.g. release",
                      maxlength: "40",
                      onKeydown: Ee(Te((A) => m(V), ["stop", "prevent"]), ["enter"])
                    }, null, 8, ["model-value", "onUpdate:modelValue", "onKeydown"])
                  ]),
                  I[6] || (I[6] = d("p", { class: "work-muted work-small" }, "Use the type ID from this board or a peer board. Leave either end empty to allow any type there.", -1)),
                  g(s(Z), {
                    label: "Add target type",
                    severity: "secondary",
                    outlined: "",
                    size: "small",
                    disabled: !p(V, o.get(V)),
                    onClick: (A) => m(V)
                  }, null, 8, ["disabled", "onClick"]),
                  V.to_types?.length ? (n(), b("div", Sc, [
                    (n(!0), b(te, null, re(V.to_types, (A) => (n(), H(s(Z), {
                      key: A,
                      severity: "secondary",
                      text: "",
                      size: "small",
                      label: A + " ×",
                      "aria-label": "Remove target type " + A,
                      onClick: (S) => r(V, "to_types", V.to_types.filter((oe) => oe !== A))
                    }, null, 8, ["label", "aria-label", "onClick"]))), 128))
                  ])) : U("", !0)
                ])
              ])),
              g(Le, {
                class: "work-disclosure",
                label: "Advanced link settings"
              }, {
                default: j(() => [
                  d("label", Tc, [
                    I[7] || (I[7] = F("Identifier ", -1)),
                    g(s(ye), {
                      modelValue: V.id,
                      "onUpdate:modelValue": (A) => V.id = A,
                      required: "",
                      pattern: "[a-z][a-z0-9_]*",
                      "aria-label": "Relation ID"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ])
                ]),
                _: 2
              }, 1024),
              d("p", Ic, [
                I[8] || (I[8] = d("strong", null, "This item", -1)),
                F(" " + E(V.outward || "relates to") + " ", 1),
                I[9] || (I[9] = d("strong", null, "another item", -1)),
                d("span", Dc, " · reverse: " + E(V.symmetric ? V.outward : V.inward), 1)
              ])
            ]),
            _: 2
          }, 1032, ["title", "kind"]))), 128)),
          t.value.length ? U("", !0) : (n(), b("p", Uc, "No link types yet. Add one to connect related work.")),
          d("div", Ec, [
            d("label", Ac, [
              I[10] || (I[10] = F("New link name ", -1)),
              g(s(ye), {
                modelValue: u.value,
                "onUpdate:modelValue": I[0] || (I[0] = (V) => u.value = V),
                placeholder: "e.g. Blocks",
                onKeydown: Ee(Te(h, ["prevent"]), ["enter"])
              }, null, 8, ["modelValue", "onKeydown"])
            ]),
            g(s(Z), {
              label: "Add link type",
              severity: "secondary",
              disabled: !f.value,
              onClick: h,
              outlined: ""
            }, {
              icon: j(() => [
                g(s(ce), {
                  icon: "tabler:plus",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["disabled"])
          ])
        ]),
        _: 1
      }, 8, ["count"])
    ]));
  }
});
function Fo(e) {
  return typeof e.error == "string" ? e.error : e.error?.message;
}
function lo(e, a) {
  const t = Fo(e);
  return e.parked ? "Stopped: " + (t ?? "Projection is parked") : t ? "Degraded: " + t : e.bootstrapping ? "Initializing" : e.last_seq >= a ? "Up to date" : "Catching up";
}
function Pc(e, a) {
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
  if (o.some(Fo)) return { kind: "degraded", status: "Degraded" };
}
const Rc = {
  class: "work-stack",
  "aria-label": "Plugins editor"
}, Nc = { class: "work-form-actions" }, Mc = {
  key: 0,
  class: "kx-loading"
}, Fc = {
  key: 1,
  class: "kx-err",
  role: "alert"
}, Lc = {
  key: 2,
  class: "work-notice",
  role: "status"
}, Bc = {
  key: 0,
  class: "work-row"
}, zc = {
  key: 0,
  class: "work-muted work-small"
}, jc = {
  key: 1,
  class: "work-notice"
}, Wc = {
  key: 2,
  class: "work-stack work-tight work-plugin-status"
}, qc = {
  key: 0,
  class: "work-muted"
}, Kc = { key: 1 }, Gc = {
  key: 2,
  class: "work-row"
}, Hc = {
  key: 3,
  class: "work-row"
}, Yc = {
  key: 0,
  class: "work-small"
}, Xc = {
  key: 6,
  class: "work-row"
}, Jc = {
  key: 7,
  class: "work-row"
}, Zc = {
  key: 8,
  class: "work-row"
}, Qc = {
  key: 3,
  class: "work-stack work-tight"
}, _c = {
  key: 0,
  class: "work-muted"
}, ev = { class: "work-form-actions" }, tv = "kickside.work.planning:plugin", oo = /* @__PURE__ */ ke({
  __name: "PluginsEditor",
  props: {
    boardId: {},
    draft: {},
    schema: {},
    options: {},
    configs: {},
    disabled: { type: Boolean },
    activationLocked: { type: Boolean },
    filters: {}
  },
  emits: ["configured", "refresh", "review", "validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = M({}), r = M(""), p = M(""), m = M(""), u = M(/* @__PURE__ */ new Set()), i = M(/* @__PURE__ */ new Set()), c = W(() => t.options.map((L) => {
      const T = oe(L.plugin);
      return { plugin: L, current: T, issue: Pc(L, T) };
    })), f = W(() => !!r.value || t.disabled), y = W(() => f.value || t.activationLocked), h = {}, $ = W(() => (t.draft.item_types ?? []).filter((L) => !["issue", "sprint", "milestone"].includes(L.id)).map((L) => ({ value: L.id, label: L.title || Ne(L.id) }))), k = W(() => ["current_sprint", "milestone"].every((L) => t.schema.compiled?.fields?.some((T) => T.code === L))), I = W(() => {
      const L = t.filters;
      return L ? (t.draft.scopes ?? []).filter((T) => !L.some((z) => z.id === T && t.options.some((J) => J.plugin === z.plugin))) : [];
    });
    function V(L) {
      return (t.filters ?? []).filter((T) => T.plugin === L);
    }
    function x(L, T) {
      const z = new Set(V(L).map((se) => se.id)), J = t.draft.scopes ?? [], ue = [...J.filter((se) => !z.has(se)), ...T];
      (ue.length !== J.length || ue.some((se) => !J.includes(se))) && (t.draft.scopes = ue);
    }
    function A(L, T) {
      ge(L, { ...me(L), issue_types: T });
    }
    function S(L) {
      return !!L.config_schema && bo(L.config_schema).length > 0;
    }
    function oe(L) {
      return t.schema.plugins?.find((T) => T.plugin === L);
    }
    function X(L) {
      return oe(L)?.active === !0;
    }
    function K(L) {
      return t.draft.plugins?.some((T) => T.use === L) === !0;
    }
    function de(L, T) {
      const z = t.draft.plugins ?? [];
      T && !K(L) && (t.draft.plugins = [...z, { use: L }]), T || (t.draft.plugins = z.filter((J) => J.use !== L), delete t.configs[L], u.value.delete(L), l("validity", L, !0), x(L, []));
    }
    function Q(L, T) {
      de(L, !1), l("review", T.currentTarget);
    }
    function me(L) {
      return X(L) ? o.value[L] ?? oe(L)?.config ?? h : t.configs[L] ?? h;
    }
    function ge(L, T) {
      X(L) ? o.value[L] = T : t.configs[L] = T;
    }
    function ae(L, T) {
      T ? u.value.delete(L) : u.value.add(L), X(L) || l("validity", L, T);
    }
    async function P(L, T = !1) {
      if (!(f.value || !T && u.value.has(L))) {
        r.value = L, p.value = "", m.value = "";
        try {
          T ? await $t.configure(t.boardId, L) : (await $t.configure(t.boardId, L, me(L)), delete o.value[L], i.value.delete(L)), m.value = T ? "Plugin recovery started." : "Plugin configuration saved.", l("configured");
        } catch (z) {
          p.value = lt(z, T ? "Could not recover the plugin." : "Could not configure plugin.");
        } finally {
          r.value = "";
        }
      }
    }
    return (L, T) => (n(), b("section", Rc, [
      d("div", Nc, [
        g(s(Z), {
          label: "Refresh status",
          severity: "secondary",
          outlined: "",
          disabled: !!r.value || e.disabled,
          onClick: T[0] || (T[0] = (z) => l("refresh"))
        }, {
          icon: j(() => [
            g(s(ce), {
              icon: "tabler:refresh",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        }, 8, ["disabled"])
      ]),
      e.options.length ? U("", !0) : (n(), b("p", Mc, "No installed plugins are visible to you.")),
      p.value ? (n(), b("div", Fc, E(p.value), 1)) : U("", !0),
      m.value ? (n(), b("p", Lc, E(m.value), 1)) : U("", !0),
      g(Wa, {
        columns: "plugins",
        count: e.options.length
      }, {
        default: j(() => [
          (n(!0), b(te, null, re(c.value, ({ plugin: z, current: J, issue: ue }) => (n(), H(ja, {
            key: z.plugin,
            title: z.installed === !1 ? z.plugin : z.title || z.plugin,
            description: z.description,
            kind: K(z.plugin) !== X(z.plugin) ? "Pending review" : ue?.status,
            class: "work-stack"
          }, {
            actions: j(() => [
              ue?.kind !== "missing" ? (n(), b("label", Bc, [
                g(s(Ze), {
                  "model-value": K(z.plugin),
                  "aria-label": "Enable " + (z.title || "plugin"),
                  disabled: y.value || !!z.problem && !K(z.plugin),
                  "onUpdate:modelValue": (se) => de(z.plugin, se)
                }, null, 8, ["model-value", "aria-label", "disabled", "onUpdate:modelValue"]),
                T[2] || (T[2] = F("On this board ", -1))
              ])) : U("", !0)
            ]),
            default: j(() => [
              z.requires.length ? (n(), b("p", zc, "Requires " + E(z.requires.map((se) => e.options.find((Oe) => Oe.plugin === se)?.title || "Another capability").join(", ")), 1)) : U("", !0),
              J?.outdated ? (n(), b("p", jc, "The stored declaration differs from the installed plugin. Review activation to update it.")) : U("", !0),
              ue || J?.active ? (n(), b("div", Wc, [
                ue && "cause" in ue ? (n(), b("p", qc, E(ue.cause), 1)) : ue ? U("", !0) : (n(), b("p", Kc, E(J?.lifecycle.state === "ready" ? "Ready to use" : "Getting ready"), 1)),
                (n(!0), b(te, null, re(J?.projections, (se, Oe) => (n(), b("div", {
                  key: Oe,
                  class: "work-stack work-tight"
                }, [
                  d("p", null, E(s(lo)(se, e.schema.as_of)) + " · Indexed through " + E(se.last_seq) + " of " + E(e.schema.as_of) + " events.", 1)
                ]))), 128)),
                ue?.kind === "setup" && J?.active ? (n(), b("div", Gc, [
                  g(s(Z), {
                    label: "Retry setup",
                    severity: "secondary",
                    outlined: "",
                    disabled: f.value,
                    onClick: (se) => P(z.plugin, !0)
                  }, null, 8, ["disabled", "onClick"])
                ])) : ue?.kind === "provider" ? (n(), b("div", Hc, [
                  g(s(Z), {
                    label: "Retry schema check",
                    severity: "secondary",
                    outlined: "",
                    disabled: f.value,
                    onClick: T[1] || (T[1] = (se) => l("refresh"))
                  }, null, 8, ["disabled"])
                ])) : ue?.kind === "degraded" ? (n(), H(Le, {
                  key: 4,
                  class: "work-small",
                  label: "Inspect worker"
                }, {
                  default: j(() => [
                    T[3] || (T[3] = d("p", null, "Check the failing worker before resetting a projection.", -1)),
                    (n(!0), b(te, null, re(J?.projections, (se, Oe) => (n(), b("p", { key: Oe }, E(Oe) + " · " + E(s(lo)(se, e.schema.as_of)), 1))), 128))
                  ]),
                  _: 2
                }, 1024)) : ue?.kind === "history" ? (n(), b(te, { key: 5 }, [
                  ue.floor !== void 0 ? (n(), b("p", Yc, "Earliest retained event sequence is " + E(ue.floor) + ".", 1)) : U("", !0),
                  g(Le, {
                    class: "work-small",
                    label: "Review retained history"
                  }, {
                    default: j(() => [...T[4] || (T[4] = [
                      d("p", null, "Ask the plugin maintainer to review the event projection’s start sequence. The plugin needs a declaration that can run with the retained history.", -1)
                    ])]),
                    _: 1
                  })
                ], 64)) : ue?.kind === "reset" ? (n(), b("div", Xc, [
                  g(s(Z), {
                    label: "Reset projection",
                    severity: "secondary",
                    outlined: "",
                    disabled: f.value,
                    onClick: (se) => P(z.plugin, !0)
                  }, null, 8, ["disabled", "onClick"]),
                  T[5] || (T[5] = d("span", { class: "work-muted work-small" }, "Resolve the worker error before resetting.", -1))
                ])) : ue?.kind === "configuration" && K(z.plugin) && S(z) && !i.value.has(z.plugin) ? (n(), b("div", Jc, [
                  g(s(Z), {
                    label: "Edit configuration",
                    severity: "secondary",
                    outlined: "",
                    disabled: f.value,
                    onClick: (se) => i.value.add(z.plugin)
                  }, null, 8, ["disabled", "onClick"])
                ])) : ue?.kind === "missing" && K(z.plugin) ? (n(), b("div", Zc, [
                  g(s(Z), {
                    label: "Review references",
                    severity: "secondary",
                    outlined: "",
                    disabled: y.value,
                    onClick: (se) => Q(z.plugin, se)
                  }, null, 8, ["disabled", "onClick"])
                ])) : U("", !0)
              ])) : U("", !0),
              V(z.plugin).length && (K(z.plugin) || X(z.plugin)) ? (n(), b("section", Qc, [
                T[6] || (T[6] = d("h4", null, "Query filters", -1)),
                T[7] || (T[7] = d("p", { class: "work-muted" }, "Choose which filters people can use to narrow down work on this board.", -1)),
                g(rt, {
                  label: "Available filters",
                  disabled: !!r.value || e.disabled || !K(z.plugin),
                  options: V(z.plugin).map((se) => ({ value: se.id, label: se.title })),
                  "model-value": e.draft.scopes?.filter((se) => V(z.plugin).some((Oe) => Oe.id === se)),
                  "onUpdate:modelValue": (se) => x(z.plugin, se)
                }, null, 8, ["disabled", "options", "model-value", "onUpdate:modelValue"])
              ])) : U("", !0),
              K(z.plugin) && S(z) && ue?.kind !== "manifest" && ue?.kind !== "missing" && (ue?.kind !== "configuration" || i.value.has(z.plugin)) ? (n(), H(Zt(ue && ue.kind !== "configuration" ? Le : "div"), {
                key: 4,
                label: ue && ue.kind !== "configuration" ? "Plugin settings" : void 0,
                class: "work-stack work-tight"
              }, {
                default: j(() => [
                  z.plugin === tv ? (n(), b(te, { key: 0 }, [
                    k.value ? (n(), H(rt, {
                      key: 1,
                      label: "Plan these item types",
                      options: $.value,
                      "model-value": me(z.plugin).issue_types,
                      disabled: !!r.value || e.disabled,
                      "onUpdate:modelValue": (se) => A(z.plugin, se)
                    }, null, 8, ["options", "model-value", "disabled", "onUpdate:modelValue"])) : (n(), b("p", _c, "The Planning pack supplies sprint and milestone fields for item types.")),
                    T[8] || (T[8] = d("p", { class: "work-muted" }, "Selected types get Current sprint and Milestone fields.", -1))
                  ], 64)) : (n(), H(po, {
                    key: 1,
                    disabled: !!r.value || e.disabled,
                    schema: z.config_schema,
                    "model-value": me(z.plugin),
                    "onUpdate:modelValue": (se) => ge(z.plugin, se),
                    onValidity: (se) => ae(z.plugin, se)
                  }, null, 8, ["disabled", "schema", "model-value", "onUpdate:modelValue", "onValidity"])),
                  d("div", ev, [
                    g(s(Z), {
                      label: ue ? "Reset form values" : "Reset",
                      severity: "secondary",
                      outlined: "",
                      disabled: !!r.value || e.disabled,
                      onClick: (se) => ge(z.plugin, X(z.plugin) ? s(Pt)(oe(z.plugin)?.config ?? {}) : {})
                    }, null, 8, ["label", "disabled", "onClick"]),
                    X(z.plugin) ? (n(), H(s(Z), {
                      key: 0,
                      label: "Save plugin settings",
                      disabled: !!r.value || e.disabled || u.value.has(z.plugin) || !o.value[z.plugin],
                      loading: r.value === z.plugin,
                      onClick: (se) => P(z.plugin)
                    }, null, 8, ["disabled", "loading", "onClick"])) : U("", !0)
                  ])
                ]),
                _: 2
              }, 1032, ["label"])) : U("", !0)
            ]),
            _: 2
          }, 1032, ["title", "description", "kind"]))), 128))
        ]),
        _: 1
      }, 8, ["count"]),
      I.value.length ? (n(), H(Le, {
        key: 3,
        class: "work-settings-card work-disclosure",
        label: "Unavailable query filters"
      }, {
        default: j(() => [
          T[9] || (T[9] = d("p", { class: "work-muted" }, "These filters came from a plugin that is unavailable. Remove one to stop using it on this board.", -1)),
          (n(!0), b(te, null, re(I.value, (z, J) => (n(), H(s(Z), {
            key: z,
            label: "Remove unavailable filter " + (J + 1),
            severity: "secondary",
            text: "",
            onClick: (ue) => e.draft.scopes = e.draft.scopes?.filter((se) => se !== z)
          }, null, 8, ["label", "onClick"]))), 128))
        ]),
        _: 1
      })) : U("", !0),
      (n(!0), b(te, null, re(e.draft.plugins?.filter((z) => !e.options.some((J) => J.plugin === z.use)) ?? [], (z) => (n(), b("article", {
        key: z.use,
        class: "work-settings-card work-stack"
      }, [
        d("p", null, [
          d("strong", null, E(z.use), 1),
          T[10] || (T[10] = F(" · Not installed", -1))
        ]),
        T[11] || (T[11] = d("p", { class: "work-muted" }, "This board still references a plugin that is no longer installed.", -1)),
        g(s(Z), {
          label: "Review references",
          severity: "secondary",
          outlined: "",
          disabled: y.value,
          onClick: (J) => Q(z.use, J)
        }, null, 8, ["disabled", "onClick"])
      ]))), 128))
    ]));
  }
}), av = { class: "system-section-head" }, lv = { class: "system-section-head-text" }, ov = {
  key: 0,
  class: "kx-head-actions"
}, iv = /* @__PURE__ */ ke({
  __name: "SettingsSectionHead",
  props: {
    title: {},
    description: {}
  },
  setup(e) {
    return (a, t) => (n(), b("header", av, [
      d("div", lv, [
        d("h1", null, E(e.title), 1),
        d("p", null, E(e.description), 1)
      ]),
      a.$slots.actions ? (n(), b("div", ov, [
        et(a.$slots, "actions")
      ])) : U("", !0)
    ]));
  }
}), nv = /* @__PURE__ */ ke({
  __name: "SettingsDraftActions",
  props: {
    busy: { type: Boolean },
    discardDisabled: { type: Boolean },
    reviewDisabled: { type: Boolean }
  },
  emits: ["discard", "review"],
  setup(e) {
    return (a, t) => (n(), b(te, null, [
      g(s(Ye), {
        severity: "warn",
        value: "Unsaved changes"
      }),
      g(s(Z), {
        label: "Discard",
        type: "button",
        severity: "secondary",
        outlined: "",
        disabled: e.busy || e.discardDisabled,
        onClick: t[0] || (t[0] = (l) => a.$emit("discard"))
      }, {
        icon: j(() => [
          g(s(ce), {
            icon: "tabler:restore",
            "aria-hidden": "true"
          })
        ]),
        _: 1
      }, 8, ["disabled"]),
      g(s(Z), {
        label: "Review changes",
        type: "button",
        disabled: e.busy || e.reviewDisabled,
        loading: e.busy,
        onClick: t[1] || (t[1] = (l) => a.$emit("review", l.currentTarget))
      }, null, 8, ["disabled", "loading"])
    ], 64));
  }
}), sv = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, rv = ["config"], dv = /* @__PURE__ */ ke({
  __name: "BoardShare",
  props: {
    board: {},
    busy: { type: Boolean }
  },
  emits: ["shared"],
  setup(e) {
    const a = e, t = M(!1), l = M(!1), o = M("");
    async function r() {
      const m = a.board;
      if (!(a.busy || l.value)) {
        l.value = !0, o.value = "";
        try {
          const u = await Tt("kickside-share");
          if (a.board.board_id !== m.board_id) return;
          u ? t.value = !0 : o.value = "Sharing is unavailable. Try opening it again.";
        } finally {
          l.value = !1;
        }
      }
    }
    Ie(() => a.board.board_id, () => {
      t.value = !1, o.value = "";
    });
    const p = W(() => {
      const m = encodeURIComponent(a.board.board_id);
      return JSON.stringify({
        resource_id: a.board.board_id,
        title: a.board.title,
        access_url: "/api/v1/component-access/grants/" + m,
        share_url: "/api/v1/component-access/share/" + m
      });
    });
    return (m, u) => (n(), b(te, null, [
      g(s(Z), {
        label: "Share board",
        severity: "secondary",
        outlined: "",
        loading: l.value,
        disabled: e.busy,
        onClick: r
      }, {
        icon: j(() => [
          g(s(ce), {
            icon: "tabler:share",
            "aria-hidden": "true"
          })
        ]),
        _: 1
      }, 8, ["loading", "disabled"]),
      o.value ? (n(), b("p", sv, E(o.value), 1)) : U("", !0),
      t.value ? (n(), b("kickside-share", {
        key: 1,
        config: p.value,
        onClose: u[0] || (u[0] = (i) => t.value = !1),
        onChanged: u[1] || (u[1] = (i) => m.$emit("shared"))
      }, null, 40, rv)) : U("", !0)
    ], 64));
  }
}), uv = {
  class: "work-stack",
  "aria-label": "Board visibility"
}, cv = { class: "work-stack work-tight" }, vv = {
  key: 0,
  class: "work-row"
}, mv = { class: "work-stack work-tight" }, fv = { class: "work-settings-list" }, pv = { class: "work-row-main" }, bv = { class: "work-small work-muted" }, hv = { class: "work-row-control" }, gv = { class: "work-row" }, yv = /* @__PURE__ */ ke({
  __name: "VisibilityEditor",
  props: {
    draft: {},
    boardId: {}
  },
  emits: ["validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = W(() => t.draft.visibility), r = W(() => (t.draft.fields ?? []).filter((f) => f.form === "text" && (!f.cardinality || f.cardinality === "one") && f.type !== "rollup" && f.index !== "number" && f.config?.case !== "insensitive")), p = M(""), m = W(() => r.value.find((f) => f.code === o.value?.field)?.type !== "option");
    function u() {
      !p.value || !o.value || o.value.levels.some((f) => f.id === p.value) || (o.value.levels.push({ id: p.value, holders: [] }), p.value = "");
    }
    function i(f) {
      if (!f) {
        delete t.draft.visibility;
        return;
      }
      const y = r.value.find((h) => h.code === f);
      t.draft.visibility = { field: f, levels: (y?.options ?? []).map((h) => ({ id: h.id, holders: [] })) };
    }
    function c(f, y) {
      const h = o.value?.levels.find(($) => $.id === f);
      h && (h.holders = y ?? []);
    }
    return (f, y) => (n(), b("section", uv, [
      y[10] || (y[10] = d("h3", { class: "work-group-title" }, "Board visibility", -1)),
      y[11] || (y[11] = d("p", { class: "work-small work-muted" }, "Restrict items by their visibility level. People still need access to the board.", -1)),
      d("label", cv, [
        y[7] || (y[7] = F("Visibility field", -1)),
        g(s(ve), {
          "aria-label": "Visibility field",
          placeholder: "No additional restriction",
          "model-value": o.value?.field ?? "",
          options: [{ label: "No additional restriction", value: "" }, ...r.value.map((h) => ({ label: s(Ge)(h), value: h.code }))],
          optionLabel: "label",
          optionValue: "value",
          appendTo: "self",
          "onUpdate:modelValue": y[0] || (y[0] = (h) => i(h))
        }, null, 8, ["model-value", "options"])
      ]),
      o.value ? (n(), b(te, { key: 0 }, [
        m.value ? (n(), b("div", vv, [
          d("label", mv, [
            y[8] || (y[8] = F("Level ID", -1)),
            g(s(ye), {
              modelValue: p.value,
              "onUpdate:modelValue": y[1] || (y[1] = (h) => p.value = h),
              "aria-label": "New visibility level",
              onKeydown: Ee(Te(u, ["prevent"]), ["enter"])
            }, null, 8, ["modelValue", "onKeydown"])
          ]),
          g(s(Z), {
            label: "Add level",
            severity: "secondary",
            outlined: "",
            disabled: !p.value || o.value.levels.some((h) => h.id === p.value),
            onClick: u
          }, null, 8, ["disabled"])
        ])) : U("", !0),
        d("div", fv, [
          (n(!0), b(te, null, re(o.value.levels, (h, $) => (n(), b("div", {
            key: h.id,
            class: "work-settings-row"
          }, [
            d("div", pv, [
              d("strong", null, E(r.value.find((k) => k.code === o.value.field)?.options?.find((k) => k.id === h.id)?.label || h.id), 1),
              d("p", bv, "Level " + E($ + 1), 1)
            ]),
            d("div", hv, [
              g(wo, {
                "board-id": e.boardId,
                label: "Who can see these items",
                "model-value": h.holders,
                "onUpdate:modelValue": (k) => c(h.id, k),
                onValidity: y[2] || (y[2] = (k) => l("validity", k))
              }, null, 8, ["board-id", "model-value", "onUpdate:modelValue"])
            ])
          ]))), 128))
        ]),
        d("label", gv, [
          g(s(Ze), {
            "model-value": o.value.bypass === "admin",
            "onUpdate:modelValue": y[3] || (y[3] = (h) => h ? o.value.bypass = "admin" : delete o.value.bypass)
          }, null, 8, ["model-value"]),
          y[9] || (y[9] = F("Board administrators can see every level", -1))
        ]),
        g(s(Z), {
          label: "Remove visibility restriction",
          severity: "secondary",
          text: "",
          onClick: y[4] || (y[4] = (h) => delete e.draft.visibility)
        })
      ], 64)) : U("", !0),
      g(It, {
        label: "Visibility rules",
        "model-value": o.value,
        shape: "object",
        example: { field: "visibility", levels: [{ id: "internal", holders: [] }], bypass: "admin" },
        "onUpdate:modelValue": y[5] || (y[5] = (h) => e.draft.visibility = h),
        onValidity: y[6] || (y[6] = (h) => l("validity", h))
      }, null, 8, ["model-value"])
    ]));
  }
}), kv = { class: "work-ia-section" }, wv = {
  class: "work-settings-list",
  "aria-labelledby": "work-sharing-title"
}, Vv = { class: "work-settings-row" }, $v = { class: "work-row-main" }, xv = {
  key: 0,
  class: "work-muted work-small"
}, Cv = {
  key: 0,
  class: "work-member-preview",
  "aria-label": "People and groups with direct access"
}, Sv = { class: "work-spacer" }, Tv = {
  key: 1,
  class: "work-chips"
}, Iv = {
  key: 1,
  class: "work-settings-row work-muted work-small"
}, Dv = {
  key: 2,
  class: "work-settings-row work-muted"
}, Uv = {
  key: 3,
  class: "work-settings-row"
}, Ev = {
  key: 4,
  class: "work-settings-row work-muted",
  role: "status"
}, Av = /* @__PURE__ */ ke({
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
    const a = e, t = M(), l = M([]), o = W(() => t.value?.filter(($) => $.subject_type === "group").length ?? 0), r = W(() => (t.value?.length ?? 0) - o.value), p = W(() => [...t.value ?? []].sort(($, k) => +!!k.owner - +!!$.owner || k.access_mask - $.access_mask).slice(0, 6)), m = W(() => p.value.map(($) => ({ id: $.subject_id, kind: $.subject_type ?? "user" }))), u = ho(() => a.boardId, m);
    function i($) {
      return $.full_name || u.label({ id: $.subject_id, kind: $.subject_type ?? "user", email: $.email });
    }
    function c($) {
      return l.value.filter((k) => ($.access_mask & k.bit) === k.bit);
    }
    const f = M(!1), y = da();
    async function h() {
      const $ = y();
      f.value = !1;
      try {
        const [{ data: k }, I] = await Promise.all([
          fl.get("/api/v1/component-access/grants/" + encodeURIComponent(a.boardId)),
          fl.get("/api/v1/components/access-model")
        ]);
        if (!$()) return;
        if (!k?.success || !Array.isArray(k.access)) throw new Error("Grants unavailable");
        t.value = k.access, l.value = I.data?.success && Array.isArray(I.data.capabilities) ? I.data.capabilities : [];
      } catch {
        $() && (t.value = void 0, f.value = !0);
      }
    }
    return Vl(() => y()), Ie(() => [a.active, a.boardId], () => {
      a.active && h();
    }, { immediate: !0 }), ($, k) => (n(), b("section", kv, [
      d("section", wv, [
        d("div", Vv, [
          d("div", $v, [
            k[1] || (k[1] = d("h3", {
              id: "work-sharing-title",
              class: "work-row-title"
            }, "Members and sharing", -1)),
            t.value ? (n(), b("p", xv, E(r.value) + " " + E(r.value === 1 ? "person" : "people") + " and " + E(o.value) + " " + E(o.value === 1 ? "group" : "groups") + " with direct access", 1)) : U("", !0)
          ]),
          e.board ? (n(), H(dv, {
            key: 0,
            board: e.board,
            busy: e.busy,
            onShared: h
          }, null, 8, ["board", "busy"])) : U("", !0)
        ]),
        p.value.length ? (n(), b("ul", Cv, [
          (n(!0), b(te, null, re(p.value, (I) => (n(), b("li", {
            key: I.subject_type + I.subject_id,
            class: "work-settings-row"
          }, [
            g(s(ce), {
              icon: I.subject_type === "group" ? "tabler:users" : "tabler:user",
              "aria-hidden": "true"
            }, null, 8, ["icon"]),
            d("strong", Sv, E(i(I)), 1),
            I.owner ? (n(), H(s(Ye), {
              key: 0,
              severity: "secondary",
              value: "Owner"
            })) : (n(), b("span", Tv, [
              (n(!0), b(te, null, re(c(I), (V) => (n(), H(s(Ye), {
                key: V.key,
                severity: "secondary",
                value: V.label
              }, null, 8, ["value"]))), 128))
            ]))
          ]))), 128))
        ])) : U("", !0),
        t.value && t.value.length > p.value.length ? (n(), b("p", Iv, " See all " + E(t.value.length) + " people and groups under Share board. ", 1)) : t.value && !t.value.length ? (n(), b("p", Dv, "No direct grants yet.")) : f.value ? (n(), b("div", Uv, [
          k[2] || (k[2] = d("p", {
            class: "work-spacer work-muted",
            role: "alert"
          }, "Member summary is unavailable.", -1)),
          g(s(Z), {
            label: "Reload members",
            severity: "secondary",
            text: "",
            onClick: h
          })
        ])) : t.value ? U("", !0) : (n(), b("p", Ev, "Loading members…"))
      ]),
      g(Le, {
        class: "work-settings-card work-disclosure",
        label: e.draft.visibility ? "Advanced · Item visibility rules set" : "Advanced · Item visibility"
      }, {
        default: j(() => [
          g(yv, {
            "board-id": e.boardId,
            draft: e.draft,
            onValidity: k[0] || (k[0] = (I) => $.$emit("validity", I))
          }, null, 8, ["board-id", "draft"])
        ]),
        _: 1
      }, 8, ["label"])
    ]));
  }
}), Ov = { class: "work-board-identity work-stack work-tight" }, Pv = { class: "work-stack work-tight" }, Rv = { class: "work-stack work-tight" }, Nv = { class: "work-stack work-tight" }, Mv = ["value", "inert"], Fv = {
  key: 1,
  class: "work-muted work-small"
}, Lv = {
  key: 0,
  class: "work-stack work-tight"
}, Bv = { class: "work-row" }, zv = {
  key: 1,
  class: "work-row work-wrap"
}, jv = { class: "work-spacer" }, Wv = { class: "work-muted work-small" }, qv = { class: "work-row" }, Kv = { class: "work-row work-board-title" }, Gv = {
  key: 1,
  class: "work-identity-actions"
}, Hv = ["title"], Yv = {
  key: 3,
  class: "kx-err work-inline",
  role: "alert"
}, Xv = {
  key: 4,
  class: "work-muted work-small",
  role: "status"
}, Jv = /* @__PURE__ */ ke({
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
    const t = e, l = a, o = M(!1), r = M(""), p = M(""), m = M(""), u = M(""), i = M(!1), c = M(!1), f = M(""), y = M(""), h = W(() => t.board?.access?.admin === !0), $ = M({ title: "", description: "", icon: "", app: "" }), k = W(() => [
      { id: "", title: "Default app" },
      ...t.boardApps ?? [],
      ...t.board?.ui_app && !t.boardApps?.some((X) => X.id === t.board?.ui_app) ? [{ id: t.board.ui_app, title: t.boardApps ? "Unavailable app" : "Configured board app", disabled: !0 }] : []
    ]), I = W(() => k.value.find((X) => X.id === (t.board?.ui_app ?? ""))?.title), V = W(() => !!t.boardApps?.length || !!t.board?.ui_app);
    function x() {
      $.value = { title: t.board?.title ?? "", icon: t.board?.icon ?? "", description: t.board?.description ?? "", app: t.board?.ui_app ?? "" }, r.value = $.value.title, m.value = $.value.icon, p.value = $.value.description, u.value = $.value.app, f.value = "", y.value = "", o.value = !0, Tt("wc-icon-picker").then((X) => i.value = X);
    }
    const A = W(() => {
      const X = {};
      return r.value.trim() !== $.value.title && (X.title = r.value.trim()), p.value !== $.value.description && (X.description = p.value), m.value !== $.value.icon && (X.icon = m.value), u.value !== $.value.app && (X.ui_app = u.value), X;
    });
    Ie(h, (X) => {
      X || S();
    }), Ie(() => o.value && Object.keys(A.value).length > 0, (X) => l("dirty-change", X));
    function S() {
      o.value = !1, f.value = "";
    }
    async function oe() {
      if (!h.value || !t.board || c.value || !r.value.trim()) return;
      const X = A.value;
      if (!Object.keys(X).length) {
        o.value = !1, y.value = "Nothing changed.";
        return;
      }
      c.value = !0, f.value = "";
      try {
        const K = await bt.updateBoard(t.board.board_id, X);
        o.value = !1, y.value = K.status === "unchanged" ? "Nothing changed." : "Board saved.", l("saved");
      } catch (K) {
        f.value = lt(K, "Could not save the board.");
      } finally {
        c.value = !1;
      }
    }
    return (X, K) => (n(), b("div", Ov, [
      o.value ? (n(), b("form", {
        key: 0,
        class: "work-identity-edit",
        "aria-label": "Edit board",
        onClick: K[4] || (K[4] = Te(() => {
        }, ["stop"])),
        onSubmit: Te(oe, ["prevent"])
      }, [
        d("label", Pv, [
          K[5] || (K[5] = F("Title", -1)),
          g(s(ye), {
            modelValue: r.value,
            "onUpdate:modelValue": K[0] || (K[0] = (de) => r.value = de),
            required: "",
            autofocus: "",
            disabled: c.value
          }, null, 8, ["modelValue", "disabled"])
        ]),
        d("label", Rv, [
          K[6] || (K[6] = F("Description", -1)),
          g(s(Pa), {
            modelValue: p.value,
            "onUpdate:modelValue": K[1] || (K[1] = (de) => p.value = de),
            rows: "1",
            disabled: c.value
          }, null, 8, ["modelValue", "disabled"])
        ]),
        d("div", Nv, [
          K[7] || (K[7] = d("span", null, "Board icon", -1)),
          i.value ? (n(), b("wc-icon-picker", {
            key: 0,
            value: m.value,
            fallback: "tabler:layout-kanban",
            inert: c.value || void 0,
            onSelect: K[2] || (K[2] = (de) => m.value = de.detail)
          }, null, 40, Mv)) : (n(), b("p", Fv, "The icon picker is unavailable."))
        ]),
        e.detail && V.value ? (n(), b("label", Lv, [
          K[8] || (K[8] = F("Open board in ", -1)),
          g(s(ve), {
            modelValue: u.value,
            "onUpdate:modelValue": K[3] || (K[3] = (de) => u.value = de),
            "aria-label": "Open board in",
            options: k.value,
            optionLabel: "title",
            optionValue: "id",
            optionDisabled: "disabled",
            appendTo: "self",
            disabled: c.value
          }, null, 8, ["modelValue", "options", "disabled"]),
          K[9] || (K[9] = d("span", { class: "work-muted work-small" }, "This is where people open the board from Work navigation.", -1))
        ])) : U("", !0),
        d("div", Bv, [
          g(s(Z), {
            label: "Save",
            severity: "secondary",
            type: "submit",
            disabled: !r.value.trim() || c.value,
            loading: c.value,
            outlined: ""
          }, {
            icon: j(() => [
              g(s(ce), {
                icon: "tabler:device-floppy",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled", "loading"]),
          g(s(Z), {
            label: "Cancel",
            severity: "secondary",
            disabled: c.value,
            onClick: S,
            outlined: ""
          }, {
            icon: j(() => [
              g(s(ce), {
                icon: "tabler:x",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled"])
        ])
      ], 32)) : e.detail ? (n(), b("div", zv, [
        d("div", jv, [
          K[10] || (K[10] = d("h3", { class: "work-row-title" }, "Board app", -1)),
          d("p", Wv, E(I.value), 1)
        ]),
        h.value ? (n(), H(s(Z), {
          key: 0,
          label: "Edit board",
          severity: "secondary",
          outlined: "",
          onClick: Te(x, ["stop"])
        }, {
          icon: j(() => [
            g(s(ce), {
              icon: "tabler:pencil",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        })) : U("", !0)
      ])) : (n(), b(te, { key: 2 }, [
        d("div", qv, [
          d("div", Kv, [
            e.board?.icon ? (n(), H(s(ce), {
              key: 0,
              icon: e.board.icon,
              "aria-hidden": "true"
            }, null, 8, ["icon"])) : U("", !0),
            (n(), H(Zt(e.compact ? "h2" : "h1"), {
              class: st(e.compact ? "kx-card-name" : "kx-title")
            }, {
              default: j(() => [
                F(E(e.board?.title || "Untitled board"), 1)
              ]),
              _: 1
            }, 8, ["class"]))
          ]),
          e.compact ? et(X.$slots, "title-end", {}, void 0, void 0, 0) : U("", !0),
          e.compact ? (n(), b("span", Gv, [
            h.value ? (n(), H(s(Z), {
              key: 0,
              severity: "secondary",
              text: "",
              size: "small",
              onClick: Te(x, ["stop"]),
              "aria-label": "Edit board"
            }, {
              default: j(() => [
                g(s(ce), {
                  icon: "tabler:pencil",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            })) : U("", !0),
            et(X.$slots, "actions")
          ])) : h.value ? (n(), H(s(Z), {
            key: 2,
            severity: "secondary",
            text: "",
            size: "small",
            onClick: Te(x, ["stop"]),
            "aria-label": "Edit board"
          }, {
            default: j(() => [
              g(s(ce), {
                icon: "tabler:pencil",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          })) : U("", !0),
          e.compact ? U("", !0) : et(X.$slots, "title-end", {}, void 0, void 0, 3)
        ]),
        !e.compact && (e.subtitle || e.board?.description) ? (n(), b("p", {
          key: 0,
          class: "kx-head-sub",
          title: e.subtitle || e.board?.description
        }, E(e.subtitle || e.board?.description), 9, Hv)) : U("", !0)
      ], 64)),
      f.value ? (n(), b("p", Yv, E(f.value), 1)) : U("", !0),
      y.value ? (n(), b("p", Xv, E(y.value), 1)) : U("", !0)
    ]));
  }
}), Zv = { class: "work-ia-section work-ia-general" }, Qv = {
  class: "work-settings-list work-board-details",
  "aria-label": "Board details"
}, _v = { class: "work-settings-row work-board-details-identity" }, em = { class: "work-stack work-tight" }, tm = {
  key: 0,
  class: "work-muted work-small"
}, am = { class: "work-settings-row" }, lm = { class: "work-row-main" }, om = { class: "work-muted work-small" }, im = {
  class: "work-settings-list",
  "aria-label": "Board summary"
}, nm = { class: "work-settings-row" }, sm = {
  key: 0,
  class: "work-muted"
}, rm = { class: "work-settings-row" }, dm = { class: "work-row-main" }, um = { class: "work-muted work-small" }, cm = { key: 0 }, vm = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, mm = {
  key: 0,
  class: "work-stack work-tight"
}, fm = {
  key: 1,
  class: "work-muted"
}, pm = { class: "work-stack work-tight" }, bm = { class: "work-spacer" }, hm = /* @__PURE__ */ ke({
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
  emits: ["upgrade", "install", "retry", "saved", "dirty-change"],
  setup(e) {
    const a = e, t = {
      comments_per_item: "Comments per item",
      audit: "Change history",
      audit_days: "Change history retention",
      interval_days: "Time-in-state history retention",
      trash_days: "Trash retention",
      tombstone_days: "Deletion record retention"
    }, l = W(() => Object.keys(t).filter((f) => a.draft.policy?.[f] !== void 0));
    function o(f) {
      const y = a.draft.policy?.[f];
      return f === "audit" ? y === "off" ? "Off" : "Track field changes" : f === "comments_per_item" ? y : y === 0 ? f === "audit_days" || f === "interval_days" ? "365 days" : "Clean up immediately" : y === 1 ? "1 day" : y + " days";
    }
    const r = M(), p = M(!1);
    let m = "";
    Ie([() => a.active, () => a.board?.board_id, () => a.schema.generation], async ([f, y, h], $, k) => {
      if (!f || !y || m === y + "/" + h) return;
      r.value = void 0, p.value = !1;
      let I = !0;
      k(() => I = !1);
      try {
        const V = await Promise.all(Array.from(
          { length: Math.min(3, Math.max(0, h - 1)) },
          (x, A) => bt.schema(y, h - A - 1)
        ));
        I && (r.value = V, m = y + "/" + h);
      } catch {
        I && (p.value = !0);
      }
    }, { immediate: !0 });
    function u(f) {
      return JSON.stringify(f, (y, h) => h && typeof h == "object" && !Array.isArray(h) ? Object.fromEntries(Object.entries(h).sort(([$], [k]) => $.localeCompare(k))) : h);
    }
    function i(f, y) {
      if (!y) return ["Initial board setup"];
      const h = f.declaration, $ = y.declaration, k = [], I = [
        ["Fields", h.fields, $.fields],
        ["Item types", h.item_types, $.item_types],
        ["Workflow", h.processes, $.processes],
        ["Links", h.relation_types, $.relation_types],
        ["Plugins and filters", [h.plugins, h.scopes], [$.plugins, $.scopes]],
        ["Item visibility", h.visibility, $.visibility],
        ["Board rules", h.policy, $.policy],
        ["Starting pack", f.pack, y.pack],
        ["Item key prefix", f.key_prefix, y.key_prefix]
      ];
      if (u(h.fields) !== u($.fields)) {
        const x = h.fields?.filter((A) => !$.fields?.some((S) => S.code === A.code)) ?? [];
        x.length === 1 && k.push("Added " + Ge(x[0]));
      }
      const V = I.filter(([, x, A]) => u(x) !== u(A)).map(([x]) => x).filter((x) => x !== "Fields" || !k.length);
      return V.length && k.push(V.join(", ") + " updated"), k.length ? k : ["Board setup updated"];
    }
    const c = W(() => {
      if (!r.value || a.schema.generation < 1) return [];
      const f = [a.schema, ...r.value];
      return f.slice(0, 3).map((y, h) => i(y, f[h + 1]));
    });
    return (f, y) => (n(), b("section", Zv, [
      d("section", Qv, [
        d("div", _v, [
          d("div", em, [
            y[6] || (y[6] = d("h3", { class: "work-row-title" }, "Board name", -1)),
            d("p", null, E(e.board?.title), 1),
            e.board?.description ? (n(), b("p", tm, E(e.board.description), 1)) : U("", !0)
          ]),
          (n(), H(Jv, {
            key: e.board?.board_id,
            board: e.board,
            "board-apps": e.boardApps,
            detail: "",
            onDirtyChange: y[0] || (y[0] = (h) => f.$emit("dirty-change", h)),
            onSaved: y[1] || (y[1] = (h) => f.$emit("saved"))
          }, null, 8, ["board", "board-apps"]))
        ]),
        d("div", am, [
          d("div", lm, [
            y[7] || (y[7] = d("h3", { class: "work-row-title" }, "Item key prefix", -1)),
            d("p", om, "Shown on items, for example " + E(e.draft.key_prefix || "WORK") + "-1.", 1)
          ]),
          g(s(ye), {
            modelValue: e.draft.key_prefix,
            "onUpdate:modelValue": y[2] || (y[2] = (h) => e.draft.key_prefix = h),
            form: e.draftForm,
            disabled: e.disabled,
            "aria-label": "Item key prefix",
            required: "",
            pattern: "[A-Z][A-Z0-9]{1,9}",
            maxlength: "10"
          }, null, 8, ["modelValue", "form", "disabled"])
        ])
      ]),
      d("section", im, [
        d("header", nm, [
          y[8] || (y[8] = d("h3", { class: "work-row-main work-row-title" }, "Board summary", -1)),
          e.board?.open_count !== void 0 && e.board.item_count !== void 0 ? (n(), b("p", sm, E(e.board.open_count) + " open · " + E(e.board.item_count) + " total ", 1)) : U("", !0)
        ]),
        d("div", rm, [
          d("div", dm, [
            y[9] || (y[9] = d("h4", { class: "work-row-title" }, "Board pack", -1)),
            d("p", um, [
              F(E(e.packTitle || "No pack installed"), 1),
              e.outdated ? (n(), b("span", cm, " · Update available")) : U("", !0)
            ])
          ]),
          e.packError ? (n(), b("p", vm, E(e.packError), 1)) : U("", !0),
          e.packError ? (n(), H(s(Z), {
            key: 1,
            label: "Reload packs",
            severity: "secondary",
            outlined: "",
            onClick: y[3] || (y[3] = (h) => f.$emit("retry"))
          })) : e.packTitle ? e.outdated ? (n(), H(s(Z), {
            key: 3,
            label: "Update pack",
            severity: "secondary",
            outlined: "",
            disabled: !e.canUpgrade,
            title: e.upgradeReason,
            onClick: y[5] || (y[5] = (h) => f.$emit("upgrade"))
          }, null, 8, ["disabled", "title"])) : U("", !0) : (n(), H(s(Z), {
            key: 2,
            label: "Install pack",
            severity: "secondary",
            outlined: "",
            disabled: !e.canInstall,
            onClick: y[4] || (y[4] = (h) => f.$emit("install"))
          }, null, 8, ["disabled"]))
        ])
      ]),
      g(Le, {
        class: "work-disclosure",
        label: "Recent setup changes"
      }, {
        default: j(() => [
          c.value.length ? (n(), b("ul", mm, [
            (n(!0), b(te, null, re(c.value, (h, $) => (n(), b("li", { key: $ }, E(h.join(" · ")), 1))), 128))
          ])) : (n(), b("p", fm, E(p.value ? "Recent changes are unavailable." : r.value ? "No setup changes yet." : "Loading recent changes…"), 1))
        ]),
        _: 1
      }),
      l.value.length ? (n(), H(Le, {
        key: 0,
        class: "work-settings-card work-disclosure",
        label: "Advanced · Existing board overrides"
      }, {
        default: j(() => [
          y[10] || (y[10] = d("p", { class: "work-muted" }, "Clear an override to use the Work application default.", -1)),
          d("ul", pm, [
            (n(!0), b(te, null, re(l.value, (h) => (n(), b("li", {
              key: h,
              class: "work-row work-wrap"
            }, [
              d("span", bm, E(t[h]) + " · " + E(o(h)), 1),
              g(s(Z), {
                label: "Use default for " + t[h].toLowerCase(),
                disabled: e.disabled,
                size: "small",
                text: "",
                onClick: ($) => delete e.draft.policy[h]
              }, null, 8, ["label", "disabled", "onClick"])
            ]))), 128))
          ])
        ]),
        _: 1
      })) : U("", !0)
    ]));
  }
}), Be = (e, a) => `${e} → ${a}`, io = (e, a) => {
  const t = e.fields?.find((l) => l.code === a);
  return t ? Ge(t) : "Untitled field";
}, no = {
  comments_per_item: "Comments per item",
  stage_timeout: "Default attempt timeout",
  stage_max_visits: "Default maximum visits",
  audit: "Audit trail",
  audit_days: "Audit history",
  trash_days: "Keep trashed items",
  tombstone_days: "Keep deletion records",
  interval_days: "Keep state history"
};
function so(e, a) {
  if (a === void 0) return "Application default";
  if (e === "audit") return Ne(String(a));
  if (e === "stage_timeout") {
    const t = sa(String(a));
    if (t) return `${t.amount.toLocaleString()} ${t.amount === 1 ? t.unit.slice(0, -1) : t.unit}`;
  }
  if (e.endsWith("_days")) {
    const t = a === 0 && (e === "audit_days" || e === "interval_days") ? 365 : a;
    return `${t} ${t === 1 ? "day" : "days"}`;
  }
  return String(a);
}
function gm(e, a) {
  const t = e.policy ?? {}, l = a.policy ?? {}, o = Object.keys(no).flatMap((m) => t[m] === l[m] ? [] : [`${no[m]} · ${Be(so(m, t[m]), so(m, l[m]))}`]), r = (m) => m ? `${m.limit}${m.hard ? " (hard limit)" : ""}` : "No limit", p = /* @__PURE__ */ new Set([...Object.keys(t.wip ?? {}), ...Object.keys(l.wip ?? {})]);
  for (const m of p) {
    const u = r(t.wip?.[m]), i = r(l.wip?.[m]);
    if (u === i) continue;
    const c = (a.processes ?? []).flatMap((f) => f.states).find((f) => f.id === m) ?? (e.processes ?? []).flatMap((f) => f.states).find((f) => f.id === m);
    o.push(`${he(c)} limit · ${Be(u, i)}`);
  }
  return o;
}
function ym(e, a, t) {
  const l = e.visibility, o = a.visibility, r = [];
  l?.field !== o?.field && r.push(Be(
    l ? io(e, l.field) : "No additional restriction",
    o ? io(a, o.field) : "No additional restriction"
  ));
  const p = l?.levels ?? [], m = o?.levels ?? [], u = new Set([...p, ...m].map((i) => i.id));
  for (const i of u) {
    const c = p.find((k) => k.id === i), f = m.find((k) => k.id === i);
    if (c && f && JSON.stringify(c.holders) === JSON.stringify(f.holders)) continue;
    const y = (k) => k.fields?.find((I) => I.code === k.visibility?.field)?.options?.find((I) => I.id === i)?.label, h = y(a) || y(e) || Ne(i), $ = (k) => k ? k.holders.map(t).join(", ") || "No extra access" : "No level";
    r.push(`${h} · ${Be($(c), $(f))}`);
  }
  return l?.bypass !== o?.bypass && r.push(o?.bypass === "admin" ? "Board administrators can see every level." : "Visibility levels now apply to board administrators."), r;
}
const ra = {
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
function km(e, a, t) {
  const { what: l, detail: o, to: r } = e, m = `${t?.name || a?.name || "Untitled workflow"} · ${ra[l] ?? "Workflow changed"}`, u = l.startsWith("state.") ? a?.states.find((h) => h.id === o) : void 0, i = l.startsWith("state.") ? t?.states.find((h) => h.id === o) : void 0, c = l.startsWith("transition.") ? a?.transitions?.find((h) => h.id === o) : void 0, f = l.startsWith("transition.") ? t?.transitions?.find((h) => h.id === o) : void 0;
  let y = "";
  return l === "state.map" ? y = Be(he(u), he(t?.states.find((h) => h.id === r))) : l === "state.name" ? y = Be(he(u), he(i)) : l === "state.kind" ? y = `${he(i)} · ${Be(Oa(u?.kind), Oa(i?.kind))}` : l === "state.category" && u && i ? y = `${he(i)} · ${Be(Bt(u.category), Bt(i.category))}` : i || u ? y = he(i ?? u) : l === "transition.name" && c && f ? y = Be(je(c), je(f)) : f ? y = je(f) : c ? y = je(c) : l === "initial" ? y = Be(he(a?.states.find((h) => h.id === a.initial)), he(t?.states.find((h) => h.id === t.initial))) : l === "name" && (y = Be(a?.name || "Untitled workflow", t?.name || "Untitled workflow")), { title: m, details: y ? [y] : [] };
}
function wm(e, a, t, l) {
  const { code: o, what: r, detail: p } = e;
  if (o === "schema" || r === "visibility.remove")
    return r === "policy" ? { title: "Board limits and defaults", details: gm(a, t) } : r.startsWith("visibility") ? { title: "Who can see items", details: ym(a, t, l) } : r === "key_prefix" ? { title: "Item key prefix", details: [Be(a.key_prefix ?? "Default", t.key_prefix ?? "Default")] } : { title: { plugins: "Board plugins changed", scopes: "Saved query filters changed", "rollup.recompute": "Calculated totals will update" }[r] ?? "Board settings changed", details: [] };
  if (o.startsWith("process ")) {
    const f = o.slice(8);
    return km(e, a.processes?.find((y) => y.id === f), t.processes?.find((y) => y.id === f));
  }
  if (o.startsWith("item_type ")) {
    const f = o.slice(10), y = a.item_types?.find((k) => k.id === f), h = t.item_types?.find((k) => k.id === f);
    return { title: `${h?.title || y?.title || "Item type"} · ${ra[r] ?? "Item type changed"}`, details: r === "title" ? [Be(y?.title || "Untitled item type", h?.title || "Untitled item type")] : [] };
  }
  if (o.startsWith("relation ")) {
    const f = o.slice(9), y = a.relation_types?.find((k) => k.id === f), h = t.relation_types?.find((k) => k.id === f), $ = r === "label" ? [Be([y?.outward, y?.inward].filter(Boolean).join(" / "), [h?.outward, h?.inward].filter(Boolean).join(" / "))] : [];
    return { title: `${h?.outward || y?.outward || "Link type"} · ${ra[r] ?? "Link type changed"}`, details: $ };
  }
  const m = t.fields?.find((f) => f.code === o), u = a.fields?.find((f) => m?.id !== void 0 ? f.id === m.id : f.code === (r.startsWith("renamed from ") ? r.slice(13) : o)), i = m ?? u;
  if (!i) return { title: ra[r] ?? "Board settings changed", details: [] };
  const c = `${Ge(i)} · ${r.startsWith("renamed from ") ? "Field key" : ra[r] ?? "Field settings changed"}`;
  if (r.startsWith("options.")) {
    const f = u?.options ?? [], y = m?.options ?? [], h = f.findIndex((A) => A.id === p), $ = y.findIndex((A) => A.id === p), k = f[h], I = y[$], V = I?.label || k?.label || "Untitled choice", x = k && I && k.label !== I.label ? [] : [V];
    if (k && I) {
      k.label !== I.label && x.push(Be(k.label || "Untitled choice", I.label || "Untitled choice")), k.category !== I.category && x.push(`Category · ${Be(k.category ? Bt(k.category) : "None", I.category ? Bt(I.category) : "None")}`);
      const A = k.order ?? h + 1, S = I.order ?? $ + 1;
      A !== S && x.push(`Order · ${Be(A, S)}`), k.color !== I.color && x.push(`Color · ${Be(k.color ?? "Default", I.color ?? "Default")}`);
    }
    return { title: c, details: x };
  }
  return r === "title" && u && m ? { title: c, details: [Be(Ge(u), Ge(m))] } : { title: c, details: [] };
}
const Vm = {
  key: 0,
  class: "work-settings-card work-schema-plan work-stack",
  "aria-label": "Schema review"
}, $m = { key: 0 }, xm = { class: "work-row work-wrap" }, Cm = { class: "work-muted" }, Sm = {
  key: 0,
  class: "work-notice"
}, Tm = {
  key: 1,
  class: "work-notice"
}, Im = {
  key: 2,
  class: "work-stack work-tight",
  "aria-label": "Reviewed Flow bindings"
}, Dm = { key: 3 }, Um = {
  key: 4,
  class: "work-settings-table"
}, Em = { key: 0 }, Am = /* @__PURE__ */ ke({
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
    const a = e, t = {}, l = W(() => a.original ?? t), o = W(() => a.declaration ?? t), r = W(() => (o.value.processes ?? []).flatMap((x) => x.states.flatMap((A) => {
      const S = A.run?.flow_ref;
      return S ? [{ key: x.id + ":" + A.id, process: x.name || "Untitled process", state: he(A), reference: S }] : [];
    }))), p = M(/* @__PURE__ */ new Map());
    Ie(r, async (x, A, S) => {
      const oe = /* @__PURE__ */ new Map();
      p.value = oe;
      let X = !0;
      S(() => X = !1), await Promise.all([...new Set(x.map((K) => K.reference.id))].map(async (K) => {
        try {
          const de = (await kl.title(K))?.trim();
          X && de && !bi(de) && p.value.set(K, de);
        } catch {
          X && p.value.set(K, "Flow title unavailable");
        }
      }));
    }, { immediate: !0 });
    const m = W(() => [l.value, o.value].flatMap((x) => (x.visibility?.levels ?? []).flatMap((A) => A.holders.flatMap((S) => "group" in S ? [{ kind: "group", id: S.group }] : "user" in S ? [{ kind: "user", id: S.user }] : [])))), u = ho(() => a.boardId ?? "", m);
    function i(x) {
      if ("user" in x) return u.label({ kind: "user", id: x.user });
      if ("group" in x) return u.label({ kind: "group", id: x.group });
      if ("field" in x) {
        const A = o.value.fields?.find((S) => S.code === x.field) ?? l.value.fields?.find((S) => S.code === x.field);
        return A ? Ge(A) : "People from a field";
      }
      return "Service";
    }
    const c = (x) => x.map((A) => {
      const S = wm(A, l.value, o.value, i);
      if (A.what === "plugins") {
        const oe = new Set(l.value.plugins?.map((K) => K.use)), X = new Set(o.value.plugins?.map((K) => K.use));
        for (const K of a.plugins ?? [])
          oe.has(K.plugin) !== X.has(K.plugin) && S.details.push((X.has(K.plugin) ? "Enable " : "Turn off ") + (K.title || "an available plugin"));
      }
      return { change: A, ...S };
    }), f = W(() => c(a.plan?.changes.filter((x) => x.class !== "refused") ?? [])), y = W(() => c(a.plan?.refused ?? [])), h = W(() => {
      const x = a.plan?.migration;
      return !x || !y.value.length ? x : y.value.every((A) => A.change.what === "options.remove") ? "Add a new field with the choices you want to keep. Copy existing values into it before removing the old field." : y.value.every((A) => A.change.what === "state.remove") ? "Choose where existing items should move before removing their state." : x;
    }), $ = {
      unchanged: ["No changes", "secondary"],
      cosmetic: ["Labels or settings", "secondary"],
      additive: ["New definitions", "success"],
      semantic: ["Affects existing items", "warn"],
      refused: ["Blocked", "danger"],
      initial: ["First setup", "secondary"]
    }, k = (x) => $[x]?.[0] ?? "Review needed", I = (x) => $[x]?.[1] ?? "secondary";
    function V(x) {
      const { detail: A, ...S } = x;
      return za(x.what === "invalid" || x.what.startsWith("views.") || x.what.startsWith("automation") ? x : S);
    }
    return (x, A) => e.plan ? (n(), b("section", Vm, [
      !e.plan.changes.length && !e.plan.refused.length && !e.configCount && !e.packReview ? (n(), b("p", $m, "No changes to apply.")) : (n(), b(te, { key: 1 }, [
        d("header", xm, [
          A[0] || (A[0] = d("h3", null, "Impact on this board", -1)),
          g(s(Ye), {
            class: "kx-tag-sm",
            severity: I(e.plan.class)
          }, {
            default: j(() => [
              F(E(k(e.plan.class)), 1)
            ]),
            _: 1
          }, 8, ["severity"])
        ]),
        d("p", Cm, E(s(hi)[e.plan.class] || "Review the changes below."), 1),
        h.value ? (n(), b("p", Sm, E(h.value), 1)) : e.follows.length ? (n(), b("p", Tm, "Existing items in " + E(e.follows.join(", ")) + " will follow the updated workflow.", 1)) : U("", !0),
        r.value.length ? (n(), b("section", Im, [
          A[1] || (A[1] = d("h3", null, "Flow bindings", -1)),
          (n(!0), b(te, null, re(r.value, (S) => (n(), b("p", {
            key: S.key
          }, [
            F(E(S.process) + " / " + E(S.state) + " · ", 1),
            d("strong", null, E(p.value.get(S.reference.id) ?? "Published Flow") + " · v" + E(S.reference.version), 1)
          ]))), 128)),
          A[2] || (A[2] = d("p", { class: "work-muted work-small" }, "New entries use these exact published versions. Before replacing a binding, stop new entries, let existing runs and deliveries finish, pause the old launcher, save, then resume entries.", -1))
        ])) : U("", !0),
        et(x.$slots, "default"),
        y.value.length ? (n(), b("h3", Dm, "Blocked changes")) : U("", !0),
        (n(!0), b(te, null, re(y.value, (S, oe) => (n(), H(s(Ii), {
          key: oe,
          severity: "error",
          role: "alert"
        }, {
          default: j(() => [
            d("strong", null, E(S.title), 1),
            (n(!0), b(te, null, re(S.details, (X, K) => (n(), b("p", { key: K }, E(X), 1))), 128)),
            d("p", null, E(V(S.change)), 1),
            g(Le, {
              class: "work-small",
              label: "Technical details"
            }, {
              default: j(() => [
                d("code", null, E(S.change.what), 1)
              ]),
              _: 2
            }, 1024)
          ]),
          _: 2
        }, 1024))), 128)),
        f.value.length ? (n(), b("table", Um, [
          A[3] || (A[3] = d("thead", null, [
            d("tr", null, [
              d("th", { scope: "col" }, "Change"),
              d("th", { scope: "col" }, "Impact")
            ])
          ], -1)),
          d("tbody", null, [
            (n(!0), b(te, null, re(f.value, (S, oe) => (n(), b("tr", { key: oe }, [
              d("td", null, [
                d("strong", null, E(S.title), 1),
                (n(!0), b(te, null, re(S.details, (X, K) => (n(), b("p", { key: K }, E(X), 1))), 128)),
                S.change.count ? (n(), b("p", Em, E(S.change.count) + " " + E(S.change.count === 1 ? "item" : "items"), 1)) : U("", !0)
              ]),
              d("td", null, [
                g(s(Ye), {
                  class: "kx-tag-sm",
                  severity: I(S.change.class)
                }, {
                  default: j(() => [
                    F(E(k(S.change.class)), 1)
                  ]),
                  _: 2
                }, 1032, ["severity"])
              ])
            ]))), 128))
          ])
        ])) : U("", !0)
      ], 64))
    ])) : U("", !0);
  }
}), Om = {
  key: 0,
  class: "work-stack",
  "aria-label": "Pack conflicts"
}, Pm = { class: "work-stack work-tight work-pack-review-field" }, Rm = { class: "work-config-fields" }, Nm = { class: "work-json-example" }, Mm = { class: "work-json-example" }, Fm = {
  key: 1,
  class: "work-stack",
  "aria-label": "Pack state maps"
}, Lm = /* @__PURE__ */ ke({
  __name: "PackReview",
  props: {
    plan: {},
    request: {},
    original: {},
    disabled: { type: Boolean }
  },
  emits: ["change"],
  setup(e, { emit: a }) {
    const t = e, l = a;
    function o(i) {
      return t.original.processes?.find((c) => c.id === i)?.name || Ne(i);
    }
    function r(i) {
      const [c, ...f] = i.split("."), y = f.join(".");
      return c === "processes" ? o(y) : c === "fields" ? t.original.fields?.find((h) => h.code === y)?.title || Ne(y) : c === "item_types" ? t.original.item_types?.find((h) => h.id === y)?.title || Ne(y) : Ne(c);
    }
    function p(i) {
      return JSON.stringify(i ?? null, null, 2);
    }
    function m(i, c) {
      (t.request.resolutions ??= {})[i] = c, l("change");
    }
    function u(i, c, f) {
      ((t.request.maps ??= {})[i] ??= {})[c] = f, l("change");
    }
    return (i, c) => (n(), b(te, null, [
      e.plan.conflicts.length ? (n(), b("section", Om, [
        c[2] || (c[2] = d("h3", null, "Local edits conflict", -1)),
        c[3] || (c[3] = d("p", { class: "work-muted work-small" }, "Choose which declaration to keep for each conflict, then review again.", -1)),
        (n(!0), b(te, null, re(e.plan.conflicts, (f) => (n(), b("div", {
          key: f.path,
          class: "work-stack work-tight"
        }, [
          d("label", Pm, [
            F(E(r(f.path)), 1),
            g(s(ve), {
              "model-value": e.request.resolutions?.[f.path],
              "aria-label": "Resolution for " + r(f.path),
              disabled: e.disabled,
              appendTo: "self",
              placeholder: "Choose a resolution",
              optionLabel: "label",
              optionValue: "value",
              options: [{ label: "Keep local edits", value: "local" }, { label: "Use pack changes", value: "incoming" }],
              "onUpdate:modelValue": (y) => m(f.path, y)
            }, null, 8, ["model-value", "aria-label", "disabled", "onUpdate:modelValue"])
          ]),
          g(Le, {
            class: "work-json-disclosure",
            label: "Compare declarations"
          }, {
            default: j(() => [
              d("div", Rm, [
                d("section", null, [
                  c[0] || (c[0] = d("h4", null, "Local edits", -1)),
                  d("pre", Nm, E(p(f.local_value)), 1)
                ]),
                d("section", null, [
                  c[1] || (c[1] = d("h4", null, "Pack changes", -1)),
                  d("pre", Mm, E(p(f.incoming)), 1)
                ])
              ])
            ]),
            _: 2
          }, 1024)
        ]))), 128))
      ])) : U("", !0),
      Object.keys(e.plan.maps).length ? (n(), b("section", Fm, [
        c[4] || (c[4] = d("h3", null, "Required state maps", -1)),
        c[5] || (c[5] = d("p", { class: "work-muted work-small" }, "Review the proposed destinations for existing items. Each destination is editable.", -1)),
        (n(!0), b(te, null, re(e.plan.maps, (f, y) => (n(), b("div", {
          key: y,
          class: "work-stack"
        }, [
          d("h4", null, E(o(y)), 1),
          (n(!0), b(te, null, re(f, (h, $) => (n(), b("label", {
            key: $,
            class: "work-stack work-tight work-pack-review-field"
          }, [
            F("Move items from " + E(s(he)(e.original.processes?.find((k) => k.id === y)?.states.find((k) => k.id === $))), 1),
            g(s(ve), {
              "model-value": e.request.maps?.[y]?.[$],
              "aria-label": "Move items from " + s(he)(e.original.processes?.find((k) => k.id === y)?.states.find((k) => k.id === $)),
              disabled: e.disabled,
              appendTo: "self",
              optionLabel: "label",
              optionValue: "value",
              options: e.plan.declaration.processes?.find((k) => k.id === y)?.states.map((k) => ({ label: s(he)(k), value: k.id })) ?? [],
              "onUpdate:modelValue": (k) => u(y, $, k)
            }, null, 8, ["model-value", "aria-label", "disabled", "options", "onUpdate:modelValue"])
          ]))), 128))
        ]))), 128))
      ])) : U("", !0)
    ], 64));
  }
}), Bm = { class: "work-section-layout" }, zm = { class: "kx-main" }, jm = ["aria-label"], Wm = {
  key: 1,
  class: "kx-err work-alert-actions"
}, qm = { role: "alert" }, Km = {
  key: 2,
  class: "work-notice",
  role: "status"
}, Gm = {
  key: 3,
  class: "kx-loading",
  role: "status"
}, Hm = {
  key: 4,
  class: "work-notice",
  role: "alert"
}, Ym = {
  key: 5,
  class: "work-settings-body"
}, Xm = {
  key: 0,
  class: "work-notice",
  role: "alert"
}, Jm = {
  key: 1,
  class: "work-notice"
}, Zm = ["id"], Qm = ["disabled", "inert"], _m = {
  key: 3,
  class: "work-ia-section"
}, ef = {
  key: 0,
  class: "work-muted"
}, tf = {
  key: 5,
  class: "work-ia-section"
}, af = { class: "work-review-layout" }, lf = { class: "work-muted" }, of = ["aria-busy"], nf = {
  key: 0,
  role: "status"
}, sf = {
  key: 1,
  role: "alert",
  class: "kx-err"
}, rf = {
  key: 2,
  role: "alert"
}, df = { key: 6 }, uf = { class: "work-dialog-actions" }, cf = {
  key: 2,
  class: "work-muted",
  role: "status"
}, vf = { class: "work-stack work-tight" }, mf = {
  key: 0,
  class: "work-muted"
}, ff = { class: "work-dialog-actions" }, pf = /* @__PURE__ */ ke({
  __name: "BoardSettings",
  props: {
    boardId: {},
    embedded: { type: Boolean },
    focusBack: { type: Boolean },
    directoryCount: {}
  },
  emits: ["dirty-change", "directory-action"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = Ni(), r = Ba(), p = M();
    let m, u = "";
    const i = () => JSON.stringify([ft.value, P.value, O.value, [...ze.value]]), c = W(() => ({
      value: "all-boards",
      label: t.embedded ? "All boards" : "Back to board",
      icon: t.embedded ? "tabler:table" : "tabler:layout-kanban"
    })), f = M();
    Ie(f, (ee) => {
      t.focusBack && ee?.$el.querySelector(".kx-settings-rail-item")?.focus();
    }, { flush: "post", once: !0 });
    const y = [
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
    ], h = M("General");
    function $(ee) {
      if (ee === c.value.value) {
        Xo();
        return;
      }
      (ee === "General" || y.some((Y) => Y.items.some((ie) => ie.value === ee))) && (h.value = ee);
    }
    const k = {
      General: "Manage the board name, item key prefix and app.",
      "Item types": "Choose the fields, parent relationships and workflow for each kind of work.",
      Fields: "Choose what information people can capture on items.",
      Links: "Show relationships on both items, such as “Blocks” and “Blocked by.”",
      Workflow: "Select a state or transition to edit how work moves.",
      Access: "Who can use this board?",
      Plugins: "Choose which plugins this board uses."
    }, I = M(""), V = M(!1), x = M(""), A = M();
    Ie(h, () => p.value?.scrollTo({ top: 0 }));
    function S() {
      V.value = !1, x.value = "", ka.value = !1;
    }
    function oe(ee) {
      !dt.value || !Go() || ze.value.size || (A.value = ee, V.value = !0, Ja());
    }
    const X = M(!1), K = M(""), de = M(/* @__PURE__ */ new Set(["General"]));
    Ie(h, (ee) => de.value.add(ee));
    const Q = M(), me = M(), ge = M(), ae = M({}), P = M({}), L = M(), T = M(!1), z = M(!0), J = M(!1), ue = M(""), se = M(""), Oe = W(() => ae.value.processes ?? []), De = W(() => T.value && Q.value ? [
      { heading: ge.value?.title || "Board settings", items: [{ value: "General", label: "General", icon: "tabler:settings" }] },
      ...y
    ] : []), q = M(), v = M(!1), w = da();
    async function _(ee) {
      const Y = w();
      v.value = !1;
      try {
        const ie = await bt.stateCounts(ee);
        Y() && (q.value = ie);
      } catch {
        Y() && (v.value = !0, q.value = void 0);
      }
    }
    Ie(h, (ee) => {
      T.value && ee === "Workflow" && _(t.boardId);
    });
    const R = M(""), B = M([]), O = M(), N = M(), C = M(), G = M(), D = M(), ne = M(""), we = M([]), Se = W(() => [...we.value, ...G.value?.refused ?? []]), xe = M(!1), _t = M(0), ze = M(/* @__PURE__ */ new Set()), Ka = M(), El = da(), ya = da(), ft = W(() => _a(ae.value, Q.value?.declaration ?? {})), dt = W(() => ze.value.size > 0 || !!O.value || !!Q.value && (JSON.stringify(ft.value) !== JSON.stringify(_a(Q.value.declaration, Q.value.declaration)) || Object.keys(P.value).length > 0)), Ga = M(!1), Al = W(() => dt.value || Ga.value);
    Ie(Al, (ee) => l("dirty-change", ee), { immediate: !0, flush: "sync" });
    const tt = W(() => !!Q.value && !!me.value && Q.value.generation !== me.value.generation), Lo = W(() => (!ea.value.renamed.length || ka.value) && T.value && !J.value && !xe.value && !Dt.value && !tt.value && !ze.value.size && G.value && (G.value.changes.length > 0 || Object.keys(P.value).length > 0) && G.value.class !== "refused" && !G.value.refused.length && D.value?.matches(ft.value, Q.value?.generation ?? -1, P.value)), ka = M(!1), ea = W(() => {
      const ee = Q.value?.declaration, Y = [], ie = [];
      for (const Ce of Oe.value) {
        const ot = ee?.item_types?.filter((Pe) => Pe.process === Ce.id) ?? [], We = ee?.processes?.find((Pe) => Pe.id === Ce.id);
        for (const Pe of We?.states ?? []) {
          const Va = Ce.states.find((Ut) => Ut.id === Pe.id);
          if (Va && Va.name === Pe.name) continue;
          const Qa = [...G.value?.refused ?? [], ...G.value?.changes ?? []].find((Ut) => Ut.code === "process " + Ce.id && Ut.detail === Pe.id && ["state.remove", "state.map"].includes(Ut.what))?.count ?? ot.reduce((Ut, Zo) => Ut + (q.value?.[Zo.id]?.[Pe.id] ?? 0), 0);
          Qa && (Va ? ie.push({ process: Ce, state: Pe, name: he(Va), count: Qa }) : Y.push({ process: Ce, state: Pe, count: Qa }));
        }
      }
      return { removed: Y, renamed: ie };
    });
    function Bo(ee, Y, ie) {
      ee.map = { ...ee.map, [Y]: ie }, Ja();
    }
    const Ha = W(() => B.value.find((ee) => ee.id === O.value?.pack)?.plugins.filter((ee) => !Q.value?.plugins?.some((Y) => Y.plugin === ee.plugin && Y.active)).map((ee) => ({ use: ee.plugin })) ?? []), Ol = W(() => !!C.value && JSON.stringify(C.value) === JSON.stringify(O.value)), Pl = W(() => O.value ? T.value && !J.value && !ze.value.size && !tt.value && !Dt.value && Ol.value && G.value?.class !== "refused" && !G.value?.refused.length && N.value?.conflicts.every((ee) => !!O.value?.resolutions?.[ee.path]) : Lo.value), Rl = W(() => !!G.value && (!O.value || Ol.value)), zo = W(() => B.value.find((ee) => ee.id === Q.value?.pack?.id)?.title || "Installed pack"), Nl = W(() => !R.value && !!Q.value?.outdated && !!B.value.find((ee) => ee.id === Q.value?.pack?.id)), jo = W(() => R.value ? "Reload packs to check available upgrades." : Nl.value ? dt.value ? "Discard the current draft before upgrading." : Dt.value ? "Finish the current migration before upgrading." : J.value ? "Wait for the current request to finish." : void 0 : "Install an available version of this pack to upgrade.");
    function Ml() {
      O.value = void 0, N.value = void 0, C.value = void 0;
    }
    async function Wo() {
      if (!Q.value?.pack || J.value || dt.value) return;
      const ee = B.value.find((Y) => Y.id === Q.value.pack.id);
      ee && (A.value = void 0, O.value = jl(ee, Q.value.generation), V.value = !0, await Ya());
    }
    async function qo() {
      const ee = B.value.find((Y) => Y.id === K.value);
      !Q.value || !ee || ee.plugins.some((Y) => !Y.installed) || J.value || dt.value || (A.value = void 0, O.value = jl(ee, Q.value.generation), X.value = !1, V.value = !0, await Ya());
    }
    async function Ya() {
      if (!O.value || J.value || !T.value || tt.value || ze.value.size) return;
      const ee = ya(), Y = Pt(O.value), ie = JSON.stringify(O.value);
      J.value = !0, x.value = "", se.value = "";
      try {
        const Ce = await ki(Y, (ot) => $t.packPlan(t.boardId, ot));
        if (!ee() || ie !== JSON.stringify(O.value)) return;
        N.value = Ce.plan, G.value = Ce.plan, O.value = Ce.request, C.value = Pt(O.value), ne.value = crypto.randomUUID(), V.value = !0;
      } catch (Ce) {
        ee() && (C.value = void 0, x.value = lt(Ce, "Could not review the pack."));
      } finally {
        J.value = !1;
      }
    }
    const Fl = W(() => N.value?.declaration ?? D.value?.declaration), Ko = W(() => {
      const ee = Fl.value;
      return !G.value || !ee ? [] : gi(G.value, ee).map((Y) => ee.processes?.find((ie) => ie.id === Y)?.name || "Untitled process");
    }), Dt = W(() => !!me.value?.migration_error || ge.value?.status === "migrating");
    function pt() {
      we.value = [], ya(), G.value = void 0, D.value = void 0, C.value = void 0, ne.value = "";
    }
    Ie([ft, P], pt, { deep: !0, flush: "sync" }), Ie(P, (ee) => {
      O.value && (Object.keys(ee).length ? O.value.plugin_configs = Pt(ee) : delete O.value.plugin_configs);
    }, { deep: !0, flush: "sync" });
    function ta(ee, Y) {
      Y ? ze.value.delete(ee) : ze.value.add(ee), pt();
    }
    function Xa(ee) {
      Ml(), _t.value++, Q.value = ee, ae.value = Pt(ee.declaration), P.value = {}, ze.value.clear(), pt();
    }
    async function ut(ee = !1) {
      const Y = El();
      try {
        const [ie, Ce, ot] = await Promise.all([bt.schema(t.boardId, void 0, !0).catch((Pe) => {
          if (Pe instanceof vl && Pe.details?.code === "board_schema_missing") return { generation: 0, declaration: {}, compiled: {}, key_prefix: "", as_of: 0 };
          throw Pe;
        }), bt.options(t.boardId), bt.boards()]);
        if (!Y()) return;
        if (T.value = Ce.access.admin, L.value = Ce, ge.value = ot.find((Pe) => Pe.board_id === t.boardId), !T.value) {
          Q.value = void 0, ae.value = {}, pt();
          return;
        }
        ue.value = "";
        const We = wi(ie);
        me.value = We, m !== void 0 && We.generation >= m ? (m = void 0, u === i() && Xa(We), u = "") : (ee || !Q.value || !dt.value && We.generation !== Q.value.generation) && Xa(We), tt.value && pt(), await Ll(Y), Y() && h.value === "Workflow" && _(t.boardId);
      } catch (ie) {
        if (!Y()) return;
        ie instanceof vl && (ie.status === 403 || ie.kind?.toLowerCase() === "permission_denied") && (T.value = !1), pt(), ue.value = lt(ie, "Could not load board settings.");
      } finally {
        Y() && (z.value = !1);
      }
    }
    async function Ll(ee = () => !0) {
      R.value = "";
      try {
        const Y = await bt.packs();
        ee() && (B.value = Y.filter(Vi));
      } catch (Y) {
        ee() && (R.value = lt(Y, "Could not load packs."));
      }
    }
    function Go() {
      for (const ee of Array.from(Ka.value?.elements ?? []))
        if ((ee instanceof HTMLInputElement || ee instanceof HTMLSelectElement || ee instanceof HTMLTextAreaElement) && !(ee.form !== Ka.value || ee.closest('[style*="display: none"]:not(.p-accordioncontent)')) && !ee.reportValidity()) {
          const ie = ee.closest('.p-accordioncontent[style*="display: none"]')?.closest(".kx-disclosure")?.querySelector('.kx-disclosure-toggle[aria-expanded="false"]');
          return ie && (ie.click(), Ht(() => ee.reportValidity())), !1;
        }
      return !0;
    }
    async function Ja() {
      if (O.value) return Ya();
      if (!Q.value || J.value || !T.value || tt.value || ze.value.size) return;
      const ee = ya(), Y = Wl(ft.value, Q.value.generation, P.value);
      J.value = !0, x.value = "", se.value = "";
      try {
        const ie = (Y.declaration.processes ?? []).some((ot) => Q.value?.declaration.processes?.find((We) => We.id === ot.id)?.states.some((We) => ot.states.some((Pe) => Pe.id === We.id && Pe.name !== We.name))), [Ce] = await Promise.all([
          $t.plan(t.boardId, Y),
          ie ? _(t.boardId) : void 0
        ]);
        if (ie && v.value) {
          pt(), x.value = "Could not check which items use the renamed states. Check the impact again.";
          return;
        }
        if (!ee() || ze.value.size || !Y.matches(ft.value, Q.value.generation, P.value)) return;
        G.value = Ce, D.value = Y, ne.value = crypto.randomUUID(), V.value = !0;
      } catch (ie) {
        ee() && (pt(), x.value = lt(ie, "Could not review changes."), we.value = $i(ie, ft.value));
      } finally {
        J.value = !1;
      }
    }
    async function Ho() {
      if (!Pl.value) return;
      if (O.value && C.value) {
        J.value = !0, x.value = "";
        const Y = i();
        try {
          const ie = await $t.packApply(t.boardId, Pt(C.value), ne.value);
          m = ie.generation, u = Y, await ut(), se.value = ie.status === "done" ? "Pack applied." : "Pack installation continues in the background.", S();
        } catch (ie) {
          x.value = lt(ie, "Could not apply the pack upgrade.");
        } finally {
          J.value = !1;
        }
        return;
      }
      if (!D.value) return;
      J.value = !0, x.value = "", se.value = "";
      const ee = i();
      try {
        m = (await $t.apply(t.boardId, D.value, ne.value)).generation, u = ee, await ut(), se.value = "Board changes applied.", S();
      } catch (Y) {
        x.value = lt(Y, "Could not apply the board changes.");
      } finally {
        J.value = !1;
      }
    }
    async function Yo() {
      if (!J.value) {
        J.value = !0, ue.value = "";
        try {
          const ee = await $t.resume(t.boardId);
          se.value = ee.resumed ? "Migration resumes." : "Migration is already running.", await ut();
        } catch (ee) {
          ue.value = lt(ee, "Could not resume migration.");
        } finally {
          J.value = !1;
        }
      }
    }
    async function wa(ee, Y) {
      if (!Q.value || !T.value || J.value || xe.value) return "Wait for the current change to finish.";
      if (tt.value) return "Discard the stale draft before removing a definition.";
      const ie = Q.value.generation, Ce = JSON.stringify(ft.value), ot = Pt(ae.value);
      ba(ot, ee, Y), xe.value = !0;
      try {
        const We = await $t.plan(t.boardId, Wl(_a(ot, Q.value.declaration), ie, P.value));
        if (!T.value || tt.value || Q.value.generation !== ie || JSON.stringify(ft.value) !== Ce) return "The draft changes during the check. Try the removal again.";
        const Pe = xi(We, ee, Y);
        if (Pe) return Pe;
        if (We.class === "refused") return "Resolve the blocked changes in your draft before removing this definition.";
      } catch (We) {
        return lt(We, "Could not check this removal.");
      } finally {
        xe.value = !1;
      }
    }
    async function Xo() {
      if (t.embedded) {
        o({ name: "boards" });
        return;
      }
      Al.value && !await Si.confirm({ header: "Discard changes?", message: "Your unsaved board settings will be discarded.", acceptLabel: "Discard", rejectLabel: "Keep editing" }) || o({ name: "board", board: t.boardId });
    }
    function Jo() {
      m = void 0, me.value && Xa(me.value), se.value = "", ue.value = "", S();
    }
    Ie(() => t.boardId, () => {
      Ga.value = !1, m = void 0, Ml(), B.value = [], Q.value = void 0, me.value = void 0, ge.value = void 0, P.value = {}, ze.value.clear(), w(), q.value = void 0, I.value = "", de.value = /* @__PURE__ */ new Set(["General"]), $("General"), S(), T.value = !1, z.value = !0, ut(!0);
    });
    let Za = () => {
    };
    return Ie(() => t.boardId, (ee) => {
      Za(), Za = Ci(`component.${ee}`, () => {
        ut();
      });
    }, { immediate: !0 }), ii(ut), Vl(() => {
      Za(), El(), ya(), w();
    }), (ee, Y) => (n(), b("section", {
      class: st(["work-settings-shell work-ia", { "work-embedded": e.embedded }])
    }, [
      d("div", Bm, [
        g(Ri, {
          ref_key: "rail",
          ref: f,
          label: "Board settings sections",
          value: h.value,
          title: e.embedded ? "Boards" : void 0,
          count: e.directoryCount,
          groups: De.value,
          "leading-item": c.value,
          "onUpdate:value": $
        }, cl({ _: 2 }, [
          e.embedded ? {
            name: "actions",
            fn: j(() => [
              g(yi, {
                "create-label": "Create board",
                onCreate: Y[0] || (Y[0] = (ie) => l("directory-action", "create")),
                onDefaults: Y[1] || (Y[1] = (ie) => l("directory-action", "defaults"))
              })
            ]),
            key: "0"
          } : void 0
        ]), 1032, ["value", "title", "count", "groups", "leading-item"]),
        d("div", zm, [
          d("div", {
            ref_key: "pane",
            ref: p,
            class: "kx-main-scroll work-settings-content",
            role: "region",
            "aria-label": h.value
          }, [
            T.value && Q.value ? (n(), H(iv, {
              key: 0,
              title: h.value,
              description: k[h.value]
            }, cl({ _: 2 }, [
              dt.value ? {
                name: "actions",
                fn: j(() => [
                  g(nv, {
                    busy: J.value,
                    "discard-disabled": xe.value,
                    "review-disabled": xe.value || Dt.value || tt.value || !!ze.value.size,
                    onDiscard: Jo,
                    onReview: oe
                  }, null, 8, ["busy", "discard-disabled", "review-disabled"])
                ]),
                key: "0"
              } : void 0
            ]), 1032, ["title", "description"])) : U("", !0),
            ue.value ? (n(), b("div", Wm, [
              d("p", qm, E(ue.value), 1),
              g(s(Z), {
                label: "Retry",
                severity: "secondary",
                outlined: "",
                onClick: Y[2] || (Y[2] = (ie) => ut())
              })
            ])) : U("", !0),
            se.value ? (n(), b("p", Km, E(se.value), 1)) : U("", !0),
            z.value ? (n(), b("p", Gm, "Loading board settings…")) : !T.value && !ue.value ? (n(), b("p", Hm, "Ask a board administrator to grant you access to these settings.")) : U("", !0),
            T.value && Q.value ? (n(), b("div", Ym, [
              tt.value ? (n(), b("p", Xm, "Someone saved new settings while you were editing. Discard this draft to load their changes.")) : U("", !0),
              Dt.value ? (n(), b("div", Jm, [
                d("p", null, E(me.value?.migration_error ? "Updating existing items paused." : "Updating existing items…"), 1),
                me.value?.migration_error ? (n(), H(Le, {
                  key: 0,
                  label: "Technical details"
                }, {
                  default: j(() => [
                    F(E(me.value.migration_error), 1)
                  ]),
                  _: 1
                })) : U("", !0),
                me.value?.migration_error ? (n(), H(s(Z), {
                  key: 1,
                  label: "Resume updating items",
                  severity: "secondary",
                  disabled: J.value,
                  outlined: "",
                  onClick: Yo
                }, null, 8, ["disabled"])) : U("", !0)
              ])) : U("", !0),
              ct(g(hm, {
                draft: ae.value,
                schema: me.value ?? Q.value,
                board: ge.value,
                active: h.value === "General",
                "board-apps": L.value?.board_apps,
                "draft-form": s(r),
                disabled: J.value || xe.value,
                "pack-title": Q.value.pack ? zo.value : void 0,
                outdated: Q.value.outdated,
                "upgrade-reason": jo.value,
                "can-upgrade": Nl.value && !dt.value && !J.value && !Dt.value,
                "can-install": !dt.value && !J.value && !Dt.value,
                "pack-error": R.value,
                onUpgrade: Wo,
                onInstall: Y[3] || (Y[3] = (ie) => X.value = !0),
                onRetry: Y[4] || (Y[4] = (ie) => Ll()),
                onDirtyChange: Y[5] || (Y[5] = (ie) => Ga.value = ie),
                onSaved: Y[6] || (Y[6] = (ie) => ut())
              }, null, 8, ["draft", "schema", "board", "active", "board-apps", "draft-form", "disabled", "pack-title", "outdated", "upgrade-reason", "can-upgrade", "can-install", "pack-error"]), [
                [Vt, h.value === "General"]
              ]),
              d("form", {
                id: s(r),
                ref_key: "editor",
                ref: Ka,
                onSubmit: Y[15] || (Y[15] = Te((ie) => oe(), ["prevent"]))
              }, [
                (n(), b("fieldset", {
                  key: _t.value,
                  class: "work-settings-fieldset",
                  disabled: J.value || xe.value,
                  inert: J.value || xe.value || void 0
                }, [
                  de.value.has("Item types") ? ct((n(), H(Cr, {
                    key: 0,
                    class: "work-ia-section",
                    draft: ae.value,
                    "guard-removal": wa,
                    issues: Se.value
                  }, null, 8, ["draft", "issues"])), [
                    [Vt, h.value === "Item types"]
                  ]) : U("", !0),
                  de.value.has("Fields") ? ct((n(), H(ur, {
                    key: 1,
                    class: "work-ia-section",
                    "board-id": e.boardId,
                    "installed-types": L.value?.installed_types,
                    draft: ae.value,
                    "guard-removal": wa,
                    issues: Se.value,
                    "item-type": I.value,
                    "onUpdate:itemType": Y[7] || (Y[7] = (ie) => I.value = ie),
                    onValidity: Y[8] || (Y[8] = (ie, Ce) => ta("fields:" + ie, Ce))
                  }, null, 8, ["board-id", "installed-types", "draft", "issues", "item-type"])), [
                    [Vt, h.value === "Fields"]
                  ]) : U("", !0),
                  de.value.has("Links") ? ct((n(), H(Oc, {
                    key: 2,
                    class: "work-ia-section",
                    draft: ae.value,
                    "guard-removal": wa
                  }, null, 8, ["draft"])), [
                    [Vt, h.value === "Links"]
                  ]) : U("", !0),
                  de.value.has("Workflow") ? ct((n(), b("section", _m, [
                    v.value ? (n(), b("p", ef, [
                      Y[22] || (Y[22] = F("Item counts are unavailable. ", -1)),
                      g(s(Z), {
                        label: "Reload counts",
                        text: "",
                        onClick: Y[9] || (Y[9] = (ie) => _(e.boardId))
                      })
                    ])) : U("", !0),
                    g(dc, {
                      "board-id": e.boardId,
                      draft: ae.value,
                      "guard-removal": wa,
                      issues: Se.value,
                      counts: q.value,
                      "count-types": Q.value.declaration.item_types,
                      guards: L.value?.guards,
                      onValidity: Y[10] || (Y[10] = (ie, Ce) => ta("process:" + ie, Ce))
                    }, null, 8, ["board-id", "draft", "issues", "counts", "count-types", "guards"])
                  ], 512)), [
                    [Vt, h.value === "Workflow"]
                  ]) : U("", !0),
                  de.value.has("Access") ? ct((n(), H(Av, {
                    key: 4,
                    active: h.value === "Access",
                    "board-id": e.boardId,
                    draft: ae.value,
                    board: ge.value,
                    busy: J.value,
                    onValidity: Y[11] || (Y[11] = (ie) => ta("visibility", ie))
                  }, null, 8, ["active", "board-id", "draft", "board", "busy"])), [
                    [Vt, h.value === "Access"]
                  ]) : U("", !0),
                  de.value.has("Plugins") ? ct((n(), b("section", tf, [
                    g(oo, {
                      "board-id": e.boardId,
                      draft: ae.value,
                      schema: me.value ?? Q.value,
                      options: L.value?.schema_options.plugins ?? [],
                      filters: L.value?.filters,
                      configs: P.value,
                      disabled: J.value,
                      onConfigured: Y[12] || (Y[12] = (ie) => {
                        pt(), ut();
                      }),
                      onRefresh: Y[13] || (Y[13] = (ie) => ut()),
                      onReview: oe,
                      onValidity: Y[14] || (Y[14] = (ie, Ce) => ta("plugin:" + ie, Ce))
                    }, null, 8, ["board-id", "draft", "schema", "options", "filters", "configs", "disabled"])
                  ], 512)), [
                    [Vt, h.value === "Plugins"]
                  ]) : U("", !0)
                ], 8, Qm))
              ], 40, Zm),
              g(ml, {
                visible: V.value,
                label: "Review changes",
                busy: J.value,
                "return-focus": A.value,
                class: "work-review-sheet",
                onClose: S
              }, {
                default: j(() => [
                  d("div", af, [
                    d("header", null, [
                      Y[23] || (Y[23] = d("h2", null, "Review changes", -1)),
                      d("p", lf, E(ge.value?.title), 1)
                    ]),
                    d("div", {
                      class: "work-review-content work-stack",
                      "aria-busy": J.value
                    }, [
                      J.value ? (n(), b("p", nf, E(G.value ? "Applying or checking changes…" : "Checking the impact on your board…"), 1)) : U("", !0),
                      x.value ? (n(), b("p", sf, E(x.value), 1)) : U("", !0),
                      tt.value ? (n(), b("p", rf, "The board changed while you were editing. Close this review and discard the draft to load the latest settings.")) : U("", !0),
                      V.value && !O.value && (ea.value.removed.length || ea.value.renamed.length) ? (n(), H(mc, {
                        key: 3,
                        removed: ea.value.removed,
                        renamed: ea.value.renamed,
                        disabled: J.value || xe.value,
                        confirmed: ka.value,
                        "onUpdate:confirmed": Y[16] || (Y[16] = (ie) => ka.value = ie),
                        onDestination: Bo
                      }, null, 8, ["removed", "renamed", "disabled", "confirmed"])) : U("", !0),
                      V.value && O.value && Ha.value.length ? (n(), H(oo, {
                        key: 4,
                        "board-id": e.boardId,
                        draft: { plugins: Ha.value },
                        schema: me.value ?? Q.value,
                        options: L.value?.schema_options.plugins.filter((ie) => Ha.value.some((Ce) => Ce.use === ie.plugin)) ?? [],
                        configs: P.value,
                        disabled: J.value,
                        "activation-locked": "",
                        onValidity: Y[17] || (Y[17] = (ie, Ce) => ta("pack-plugin:" + ie, Ce))
                      }, null, 8, ["board-id", "draft", "schema", "options", "configs", "disabled"])) : U("", !0),
                      V.value ? (n(), H(Am, {
                        key: 5,
                        "board-id": e.boardId,
                        original: Q.value.declaration,
                        declaration: Fl.value,
                        plan: G.value,
                        follows: Ko.value,
                        "config-count": Object.keys(P.value).length,
                        "pack-review": !!N.value,
                        plugins: L.value?.schema_options.plugins
                      }, {
                        default: j(() => [
                          N.value && O.value ? (n(), H(Lm, {
                            key: 0,
                            plan: N.value,
                            request: O.value,
                            original: Q.value.declaration,
                            disabled: J.value,
                            onChange: Y[18] || (Y[18] = (ie) => {
                              C.value = void 0, ne.value = "";
                            })
                          }, null, 8, ["plan", "request", "original", "disabled"])) : U("", !0)
                        ]),
                        _: 1
                      }, 8, ["board-id", "original", "declaration", "plan", "follows", "config-count", "pack-review", "plugins"])) : U("", !0),
                      !J.value && !Rl.value && !tt.value && !x.value ? (n(), b("p", df, "Check the impact again before applying.")) : U("", !0)
                    ], 8, of),
                    d("footer", uf, [
                      g(s(Z), {
                        label: "Keep editing",
                        severity: "secondary",
                        outlined: "",
                        disabled: J.value,
                        onClick: S
                      }, null, 8, ["disabled"]),
                      Rl.value ? (n(), H(s(Z), {
                        key: 1,
                        label: "Apply changes",
                        disabled: !Pl.value,
                        loading: J.value,
                        onClick: Ho
                      }, null, 8, ["disabled", "loading"])) : (n(), H(s(Z), {
                        key: 0,
                        label: "Check impact",
                        disabled: J.value || tt.value || !!ze.value.size,
                        onClick: Ja
                      }, null, 8, ["disabled"]))
                    ])
                  ])
                ]),
                _: 1
              }, 8, ["visible", "busy", "return-focus"]),
              xe.value ? (n(), b("p", cf, "Checking what uses this setting…")) : U("", !0)
            ])) : U("", !0)
          ], 8, jm)
        ])
      ]),
      T.value ? (n(), H(ml, {
        key: 0,
        visible: X.value,
        label: "Install pack",
        busy: J.value,
        onClose: Y[21] || (Y[21] = (ie) => X.value = !1)
      }, {
        default: j(() => [
          d("form", {
            class: "work-dialog-box work-stack",
            onSubmit: Te(qo, ["prevent"])
          }, [
            Y[25] || (Y[25] = d("h2", null, "Install a pack", -1)),
            Y[26] || (Y[26] = d("p", { class: "work-muted work-small" }, "Packs give an empty board a starting setup. Review checks whether this board is eligible.", -1)),
            d("label", vf, [
              Y[24] || (Y[24] = F("Pack", -1)),
              g(s(ve), {
                modelValue: K.value,
                "onUpdate:modelValue": Y[19] || (Y[19] = (ie) => K.value = ie),
                "aria-label": "Pack to install",
                appendTo: "self",
                optionLabel: "title",
                optionValue: "id",
                optionDisabled: "disabled",
                options: B.value.map((ie) => ({ ...ie, disabled: ie.plugins.some((Ce) => !Ce.installed) }))
              }, null, 8, ["modelValue", "options"])
            ]),
            B.value.length ? U("", !0) : (n(), b("p", mf, "No available packs were found.")),
            d("footer", ff, [
              g(s(Z), {
                label: "Cancel",
                severity: "secondary",
                outlined: "",
                onClick: Y[20] || (Y[20] = (ie) => X.value = !1)
              }),
              g(s(Z), {
                type: "submit",
                label: "Review pack",
                disabled: !K.value || J.value || dt.value
              }, null, 8, ["disabled"])
            ])
          ], 32)
        ]),
        _: 1
      }, 8, ["visible", "busy"])) : U("", !0)
    ], 2));
  }
}), bf = /* @__PURE__ */ ke({
  __name: "SettingsRoot",
  setup(e) {
    const a = ni(), t = si();
    return oi(yo, (l) => {
      a.value.embedded && l.name === "boards" ? t("back-to-boards", {}) : t("navigate", { route: Mi(l) });
    }), (l, o) => (n(), H(pf, {
      "board-id": s(a).boardId ?? "",
      embedded: s(a).embedded,
      "focus-back": s(a).focusBack,
      "directory-count": s(a).directoryCount,
      onDirectoryAction: o[0] || (o[0] = (r) => s(t)("directory-action", { name: r })),
      onDirtyChange: o[1] || (o[1] = (r) => s(t)("dirty-change", { dirty: r }))
    }, null, 8, ["board-id", "embedded", "focus-back", "directory-count"]));
  }
}), hf = ri(bf, {
  type: "object",
  properties: {
    "board-id": { type: "string", default: "", description: "Board to administer." },
    "focus-back": { type: "boolean", default: !1, description: "Focus the first rail action when opening settings from the board picker." },
    "directory-count": { type: "number", description: "Board count in the System picker." },
    embedded: { type: "boolean", default: !1, description: "Fits in a System detail pane." }
  }
});
Ti(import.meta.url, hf);
//# sourceMappingURL=settings.js.map
