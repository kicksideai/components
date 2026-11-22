import { defineComponent as $e, computed as H, openBlock as n, createBlock as J, resolveDynamicComponent as ma, normalizeProps as Ui, guardReactiveProps as Ei, createSlots as il, withCtx as Y, createElementVNode as s, normalizeClass as $t, createElementBlock as p, Fragment as te, renderList as de, toDisplayString as T, createCommentVNode as S, unref as r, renderSlot as at, inject as nl, useModel as Ai, useSlots as Pi, watch as Te, createVNode as g, Transition as Fo, withDirectives as Vt, vShow as Rt, mergeModels as Oi, ref as q, onMounted as Oa, onUnmounted as Xl, resolveComponent as Lo, createTextVNode as G, onBeforeUnmount as At, useId as _t, withKeys as Ye, withModifiers as Me, normalizeStyle as Ri, watchEffect as Bo, nextTick as It, provide as jo } from "vue";
import { e as Bt, u as Ni, a as Mi, b as Fi, c as Li } from "./mount-eDIuPCQ9.js";
import "pinia";
import { m as Ha, h as po, s as pe, i as Bi, t as Ke, g as ji, j as oa, k as Yt, r as bo, w as Ft, f as pt, l as Sa, n as vt, o as Ze, q as jt, v as zo, x as Pe, y as Fe, z as Wo, A as zt, B as qo, C as Aa, D as sl, d as Go, E as Ra, c as Jl, F as zi, G as _a, H as Nl, I as Wi, J as ua, K as qi, L as Gi, _ as Ml, M as ho, N as Ki, O as Ko, P as Hi, Q as Yi, u as Xi, a as Ji, p as Zi, R as xl, S as Qi, T as ia, U as go, V as _i, W as en, X as yo, Y as tn, Z as an } from "./usePackDiscovery-BbfpJ_lh.js";
import fe from "primevue/select";
import le from "primevue/button";
import { Icon as ve } from "@iconify/vue";
import { api as Fl, host as Ho, on as ln, define as on } from "@wippy-fe/proxy";
import dt from "primevue/tag";
import rt from "primevue/toggleswitch";
import Qt from "primevue/checkbox";
import De from "primevue/inputtext";
import Pa from "primevue/textarea";
import Dt from "primevue/inputnumber";
import Zl from "primevue/selectbutton";
import nn from "primevue/message";
const Cl = (e, a) => e.x > a.x && e.x < a.x + a.width && e.y > a.y && e.y < a.y + a.height;
function sn(e, a, t) {
  return e.x === a.x ? e.x > t.x && e.x < t.x + t.width && Math.max(e.y, a.y) > t.y && Math.min(e.y, a.y) < t.y + t.height : e.y > t.y && e.y < t.y + t.height && Math.max(e.x, a.x) > t.x && Math.min(e.x, a.x) < t.x + t.width;
}
function Gt(e, a, t) {
  const l = [.../* @__PURE__ */ new Set([e.x, a.x, ...t.flatMap((V) => [V.x, V.x + V.width])])].sort((V, x) => V - x), o = [.../* @__PURE__ */ new Set([e.y, a.y, ...t.flatMap((V) => [V.y, V.y + V.height])])].sort((V, x) => V - x);
  l.unshift(l[0] - 24), l.push(l.at(-1) + 24), o.unshift(o[0] - 24), o.push(o.at(-1) + 24);
  const d = l.length, f = o.indexOf(a.y) * d + l.indexOf(a.x), u = o.indexOf(e.y) * d + l.indexOf(e.x), v = (V) => ({ x: l[V % d], y: o[Math.floor(V / d)] }), i = /* @__PURE__ */ new Map(), c = /* @__PURE__ */ new Map(), m = [];
  function $(V) {
    m.push(V);
    let x = m.length - 1;
    for (; x; ) {
      const E = x - 1 >> 1;
      if (m[E].priority <= V.priority) break;
      m[x] = m[E], x = E;
    }
    m[x] = V;
  }
  function h() {
    const V = m[0], x = m.pop();
    if (m.length) {
      let E = 0;
      for (; E * 2 + 1 < m.length; ) {
        let D = E * 2 + 1;
        if (D + 1 < m.length && m[D + 1].priority < m[D].priority && D++, x.priority <= m[D].priority) break;
        m[E] = m[D], E = D;
      }
      m[E] = x;
    }
    return V;
  }
  const k = (V) => Math.abs(V.x - a.x) + Math.abs(V.y - a.y);
  for (const V of [0, 1]) {
    const x = u * 2 + V;
    i.set(x, 0), $({ key: x, cost: 0, priority: k(e) });
  }
  const y = /* @__PURE__ */ new Map(), w = /* @__PURE__ */ new Map();
  for (; m.length; ) {
    const V = h(), x = Math.floor(V.key / 2), E = V.key % 2;
    if (V.cost !== i.get(V.key)) continue;
    if (x === f) {
      const L = [];
      let re = V.key;
      for (; re !== void 0; )
        L.push(v(Math.floor(re / 2))), re = c.get(re);
      return Yo(L.reverse());
    }
    const D = v(x), j = x % d, ie = Math.floor(x / d);
    for (const [L, re] of [[j > 0 ? x - 1 : -1, 0], [j + 1 < d ? x + 1 : -1, 0], [ie > 0 ? x - d : -1, 1], [ie + 1 < o.length ? x + d : -1, 1]]) {
      if (L < 0) continue;
      const ue = v(L);
      if (y.has(L) || y.set(L, !t.some((P) => Cl(ue, P))), !y.get(L)) continue;
      const me = `${Math.min(x, L)}:${Math.max(x, L)}`;
      if (w.has(me) || w.set(me, !t.some((P) => sn(D, ue, P))), !w.get(me)) continue;
      const ce = V.cost + Math.abs(D.x - ue.x) + Math.abs(D.y - ue.y) + (E === re ? 0 : 18), ne = L * 2 + re;
      ce >= (i.get(ne) ?? 1 / 0) || (i.set(ne, ce), c.set(ne, V.key), $({ key: ne, cost: ce, priority: ce + k(ue) }));
    }
  }
  throw new Error("Process map has no collision-free route between its ports: " + JSON.stringify({ start: e, end: a, startInside: t.filter((V) => Cl(e, V)), endInside: t.filter((V) => Cl(a, V)) }));
}
function Yo(e) {
  const a = [];
  for (const t of e) {
    const l = a.at(-1), o = a.at(-2);
    l && l.x === t.x && l.y === t.y || (o && l && (o.x === l.x && l.x === t.x || o.y === l.y && l.y === t.y) && a.pop(), a.push(t));
  }
  return a;
}
const ya = (e) => Array.from(e).reduce((a, t) => a + (/[^\x20-\x7e]/u.test(t) ? 16 : /[MW@%]/.test(t) ? 11 : /[ilI.,:;!| ']/.test(t) ? 4 : 7.5), 0);
function ca(e, a = 28) {
  const t = [];
  let l = "";
  for (const o of e.split(/\s+/u))
    for (let d = 0; d < o.length; d += a) {
      const f = o.slice(d, d + a);
      l && l.length + f.length + 1 > a && (t.push(l), l = ""), l = l ? l + " " + f : f;
    }
  return [...t, l].filter(Boolean);
}
function za(e) {
  if (e = Yo(e), !e.length) return "";
  let a = `M ${e[0].x} ${e[0].y}`;
  for (let l = 1; l < e.length - 1; l++) {
    const o = e[l - 1], d = e[l], f = e[l + 1], u = Math.hypot(d.x - o.x, d.y - o.y), v = Math.hypot(f.x - d.x, f.y - d.y), i = Math.min(8, u / 3, v / 3);
    i && (a += ` L ${d.x + (o.x - d.x) * i / u} ${d.y + (o.y - d.y) * i / u} Q ${d.x} ${d.y} ${d.x + (f.x - d.x) * i / v} ${d.y + (f.y - d.y) * i / v}`);
  }
  const t = e.at(-1);
  return a + ` L ${t.x} ${t.y}`;
}
function rn(e, a = {}, t = { width: 1400, height: 480 }) {
  const l = t.direction ?? (t.width < 750 || Ha(e).length > 8 ? "TB" : "LR"), o = t.direction === "LR" && Ha(e).length > 6, d = new po.graphlib.Graph({ multigraph: !0 });
  d.setGraph({ rankdir: l, ranker: "network-simplex", acyclicer: "greedy", nodesep: 32, edgesep: 32, ranksep: 24, marginx: 32, marginy: 32 }), d.setDefaultEdgeLabel(() => ({}));
  const f = Ha(e), u = new Map(f.map((b, A) => [b.id, A])), v = e.states.map((b) => {
    const A = (e.transitions ?? []).filter((O) => O.from === "any" && O.to === b.id), Z = ca(pe(b), o ? 13 : 28), X = ca(Bi(b, e), o ? 13 : 28), we = A.flatMap((O) => ca(Ke(O) + " works from any state")), xe = a.policy?.wip?.[b.id]?.limit, Oe = xe === void 0 ? 0 : ya(" · limit " + xe), N = Math.max(o ? 122 : 168, ...Z.map((O) => ya(O) + 58), ...X.map((O, M) => ya(O) + 32 + (M === X.length - 1 ? Oe : 0)), ...we.map((O) => ya(O) + 32)), se = Math.max(80, 42 + Z.length * 18 + X.length * 16 + we.length * 18);
    return d.setNode(b.id, { width: N + (l === "LR" ? 36 : 0), height: se + (l === "TB" ? 36 : 0) }), { state: b, x: 0, y: 0, width: N, height: se, title: Z, caption: X, badges: A, row: u.has(b.id) ? 0 : 1 };
  }), i = new Set(v.map((b) => b.state.id)), c = (e.transitions ?? []).flatMap((b) => b.from === "any" ? [] : b.from.filter((A) => i.has(A) && i.has(b.to)).map((A) => {
    const Z = `${b.id}-${A}`, X = ca(Ke(b), o ? 12 : 28), we = Math.max(o ? 60 : 72, ...X.map((Oe) => ya(Oe) + 24)), xe = Math.max(24, X.length * 16 + 10);
    return { transition: b, from: A, key: Z, lines: X, width: we, height: xe };
  })), m = /* @__PURE__ */ new Set(), $ = /* @__PURE__ */ new Set(), h = new Set(c.filter((b) => b.from === b.transition.to || b.transition.to === e.initial || ["completed", "canceled"].includes(v.find((A) => A.state.id === b.from).state.category)).map((b) => b.key));
  function k(b) {
    if (!$.has(b)) {
      m.add(b);
      for (const A of c.filter((Z) => Z.from === b))
        h.has(A.key) || (m.has(A.transition.to) ? h.add(A.key) : k(A.transition.to));
      m.delete(b), $.add(b);
    }
  }
  k(e.initial);
  for (const b of v) k(b.state.id);
  for (const b of c) if (!h.has(b.key)) {
    const A = u.get(b.from), Z = u.get(b.transition.to);
    d.setEdge(b.from, b.transition.to, { width: b.width, height: b.height, labelpos: "c", weight: A !== void 0 && Z === A + 1 ? 100 : 1 }, b.key);
  }
  for (const b of e.transitions ?? []) if (b.from === "any" && i.has(e.initial) && i.has(b.to) && !u.has(b.to)) {
    const A = e.states.find((Z) => Z.id === b.to);
    d.setEdge(e.initial, b.to, { minlen: ["completed", "canceled"].includes(A.category) ? Math.max(1, f.length - 1) : 1 }, `any:${b.id}`);
  }
  const y = e.states.flatMap((b) => (b.regions ?? []).filter((A) => i.has(A.initial)).map((A, Z) => {
    const X = `lane:${b.id}:${Z}`;
    return d.setEdge(b.id, A.initial, {}, X), { state: b, region: A, key: X };
  }));
  if (!v.length) return { nodes: v, edges: [], parallels: [], main: f, direction: l, width: 320, height: 160 };
  po.layout(d);
  for (const b of v) Object.assign(b, { x: d.node(b.state.id).x, y: d.node(b.state.id).y });
  const w = l === "TB", V = c.filter((b) => !h.has(b.key)).map((b) => d.edge({ v: b.from, w: b.transition.to, name: b.key })), x = [...v, ...V], E = Math.max(...x.map((b) => b.x + b.width / 2)), D = Math.max(...x.map((b) => b.y + b.height / 2)), j = (b) => v.find((A) => A.state.id === b), ie = c.filter((b) => h.has(b.key)).sort((b, A) => {
    const Z = w ? "y" : "x";
    return Math.abs(j(b.from)[Z] - j(b.transition.to)[Z]) - Math.abs(j(A.from)[Z] - j(A.transition.to)[Z]);
  }), L = /* @__PURE__ */ new Map(), re = Math.max(0, ...ie.map((b) => b.width));
  let ue = D + 32;
  for (const [b, A] of ie.entries()) {
    const Z = j(A.from), X = j(A.transition.to), we = w ? E + 16 + re + 28 + b * 18 : ue + A.height / 2, xe = w ? E + 16 + re / 2 : (Z.x + X.x) / 2;
    let Oe = w ? Z.y + Z.height / 2 + 18 : we;
    if (w) for (const N of [...L.values()].sort((se, O) => se.y - O.y))
      Oe + A.height / 2 + 10 > N.y - N.height / 2 - 10 && Oe - A.height / 2 - 10 < N.y + N.height / 2 + 10 && (Oe = N.y + N.height / 2 + 24 + A.height / 2);
    L.set(A.key, { x: xe, y: Oe, corridor: we, height: A.height }), ue = we + A.height / 2 + 24;
  }
  const me = c.map((b) => ({ ...b, ...L.get(b.key) ?? d.edge({ v: b.from, w: b.transition.to, name: b.key }) })), ce = (b, A) => ({ x: b.x - b.width / 2 - A, y: b.y - b.height / 2 - A, width: b.width + A * 2, height: b.height + A * 2 }), ne = [...v.map((b) => ce(b, 12)), ...me.map((b) => ce(b, 10))], P = (b, A) => ({
    start: w ? { x: b.x, y: b.y + b.height / 2 } : { x: b.x + b.width / 2, y: b.y },
    end: w ? { x: A.x, y: A.y - A.height / 2 } : { x: A.x - A.width / 2, y: A.y }
  }), ae = (b, A) => w ? { x: b.x, y: b.y + A } : { x: b.x + A, y: b.y }, z = me.map((b) => {
    const A = v.find((_) => _.state.id === b.from), Z = v.find((_) => _.state.id === b.transition.to), { start: X, end: we } = P(A, Z), xe = h.has(b.key), Oe = ae(X, 18), N = ae(we, -18), se = (xe || !w ? b.width : b.height) / 2 + 10, O = xe ? { x: b.x + (w ? -se : se), y: b.y } : ae(b, -se), M = xe ? { x: b.x + (w ? se : -se), y: b.y } : ae(b, se);
    let F;
    if (xe) {
      const { corridor: _ } = L.get(b.key), Ce = w ? { x: _, y: b.y } : { x: Oe.x, y: _ }, Ue = w ? { x: _, y: N.y } : { x: N.x, y: _ };
      F = w ? [
        [X, ...Gt(Oe, O, ne)],
        [M, Ce, Ue, ...Gt(Ue, N, ne), we]
      ] : [
        [X, ...Gt(Oe, Ce, ne), O],
        [M, ...Gt(Ue, N, ne), we]
      ];
    } else F = [
      [X, ...Gt(Oe, O, ne)],
      [...Gt(M, N, ne), we]
    ];
    const W = xe ? "return" : u.get(b.transition.to) === (u.get(b.from) ?? -2) + 1 ? "main" : "forward";
    return { ...b, points: F.flat(), segments: F, path: F.map(za).join(" "), type: W, targetOffset: 0 };
  }), ge = y.map((b) => {
    const A = v.find((Oe) => Oe.state.id === b.state.id), Z = v.find((Oe) => Oe.state.id === b.region.initial), { start: X, end: we } = P(A, Z), xe = [X, ...Gt(ae(X, 18), ae(we, -18), ne), we];
    return { state: b.state, key: b.key, points: xe, path: za(xe) };
  }), Ve = [...v.flatMap((b) => [{ x: b.x - b.width / 2, y: b.y - b.height / 2 }, { x: b.x + b.width / 2, y: b.y + b.height / 2 }]), ...z.flatMap((b) => [...b.points, { x: b.x - b.width / 2, y: b.y - b.height / 2 }, { x: b.x + b.width / 2, y: b.y + b.height / 2 }]), ...ge.flatMap((b) => b.points)], B = 32 - Math.min(...Ve.map((b) => b.x)), I = 32 - Math.min(...Ve.map((b) => b.y)), C = Math.max(...Ve.map((b) => b.x)) + B + 32, U = Math.max(...Ve.map((b) => b.y)) + I + 32, Q = (b) => ({ x: b.x + B, y: b.y + I });
  for (const b of v) Object.assign(b, Q(b));
  for (const b of z)
    Object.assign(b, Q(b)), b.segments = b.segments.map((A) => A.map(Q)), b.points = b.segments.flat(), b.path = b.segments.map(za).join(" ");
  for (const b of ge)
    b.points = b.points.map(Q), b.path = za(b.points);
  return { nodes: v, edges: z, parallels: ge, main: f, direction: l, width: C, height: U };
}
const dn = ["aria-label"], un = {
  key: 0,
  class: "kx-settings-rail-group"
}, cn = ["aria-current", "onClick"], vn = { class: "kx-settings-rail-label" }, fn = /* @__PURE__ */ $e({
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
    const a = e, t = H(() => a.leadingItem ? [{ items: [a.leadingItem] }, ...a.groups] : a.groups);
    function l(o) {
      const d = [...o.currentTarget.querySelectorAll(".kx-settings-rail-item")], f = d.indexOf(o.target);
      if (f < 0) return;
      let u;
      switch (o.key) {
        case "ArrowDown":
        case "ArrowRight":
          u = (f + 1) % d.length;
          break;
        case "ArrowUp":
        case "ArrowLeft":
          u = (f + d.length - 1) % d.length;
          break;
        case "Home":
          u = 0;
          break;
        case "End":
          u = d.length - 1;
          break;
        default:
          return;
      }
      o.preventDefault(), d[u]?.focus();
    }
    return (o, d) => (n(), J(ma(e.title ? ji : "div"), Ui(Ei(e.title ? { title: e.title, count: e.count, settings: !0 } : { class: "kx-settings-rail-standalone" })), il({
      default: Y(() => [
        s("nav", {
          class: $t(["kx-settings-rail", { "kx-settings-rail-framed": e.title }]),
          "aria-label": e.label,
          onKeydown: l
        }, [
          (n(!0), p(te, null, de(t.value, (f, u) => (n(), p("div", {
            key: f.items[0]?.value ?? u,
            class: $t(["kx-settings-rail-section", { "kx-settings-rail-leading": e.leadingItem && u === 0 }])
          }, [
            f.heading ? (n(), p("div", un, T(f.heading), 1)) : S("", !0),
            (n(!0), p(te, null, de(f.items, (v) => (n(), p("button", {
              key: v.value,
              type: "button",
              class: "kx-settings-rail-item",
              "aria-current": v.value === e.value ? "true" : void 0,
              onClick: (i) => o.$emit("update:value", v.value)
            }, [
              v.icon ? (n(), J(r(ve), {
                key: 0,
                class: "kx-settings-rail-icon",
                icon: v.icon,
                "aria-hidden": "true"
              }, null, 8, ["icon"])) : S("", !0),
              s("span", vn, T(v.label), 1)
            ], 8, cn))), 128))
          ], 2))), 128))
        ], 42, dn)
      ]),
      _: 2
    }, [
      e.title && o.$slots.actions ? {
        name: "actions",
        fn: Y(() => [
          at(o.$slots, "actions")
        ]),
        key: "0"
      } : void 0
    ]), 1040));
  }
}), Xo = Symbol("work-navigation");
function mn() {
  return nl(Xo, () => {
  });
}
function pn(e) {
  if (e.name === "boards") return "";
  const a = encodeURIComponent(e.board);
  return e.name === "settings" ? `${a}/settings` : a;
}
const na = (e) => `/api/v1/work/boards/${encodeURIComponent(e)}`, ko = (e) => ({ declaration: e.declaration, expected_generation: e.expected_generation, plugin_configs: e.plugin_configs }), Xt = {
  packPlan: (e, a) => oa(`${na(e)}/pack_plan`, a, "Pack plan"),
  packApply: (e, a, t) => oa(`${na(e)}/pack_apply`, { ...a, key: t }, "Apply pack"),
  plan: (e, a) => oa(`${na(e)}/plan_schema`, ko(a), "Schema plan"),
  apply: (e, a, t) => oa(`${na(e)}/apply_schema`, { ...ko(a), key: t }, "Apply schema"),
  resume: (e) => oa(`${na(e)}/resume_migration`, {}, "Resume migration"),
  configure: (e, a, t) => oa(`${na(e)}/configure_plugin`, { plugin: a, ...t === void 0 ? {} : { config: t } }, "Configure plugin")
}, Ql = /* @__PURE__ */ $e({
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
        const v = u.closest('[data-work-action], button, a, input, textarea, [role="combobox"], [role="checkbox"], [role="switch"], details');
        if (v && v !== f.currentTarget) return;
      }
      l("activate", f);
    }
    function d(f) {
      f.target !== f.currentTarget || !["Enter", " "].includes(f.key) || (f.preventDefault(), t.disabled || l("activate", f));
    }
    return (f, u) => (n(), J(ma(e.as), {
      "data-work-action": "",
      class: "work-content-action",
      type: e.as === "button" ? "button" : void 0,
      role: e.role,
      tabindex: e.disabled ? -1 : 0,
      disabled: e.as === "button" ? e.disabled : void 0,
      "aria-disabled": e.disabled || void 0,
      onClick: o,
      onKeydown: d
    }, {
      default: Y(() => [
        at(f.$slots, "default")
      ]),
      _: 3
    }, 40, ["type", "role", "tabindex", "disabled", "aria-disabled"]));
  }
}), rl = Symbol("section row"), bn = { class: "work-definition" }, hn = {
  key: 0,
  class: "work-definition-handle"
}, gn = { class: "work-definition-lead" }, yn = ["title"], kn = {
  key: 0,
  class: "work-definition-description"
}, wn = { class: "work-definition-details" }, $n = { class: "work-definition-code" }, Vn = ["title"], xn = { class: "work-definition-kind" }, Cn = {
  key: 0,
  class: "work-definition-kind-label"
}, Sn = { class: "work-definition-kind-value" }, Tn = { class: "work-definition-flags" }, In = { class: "work-definition-usage" }, Dn = { class: "work-definition-actions" }, Un = ["inert"], dl = /* @__PURE__ */ $e({
  __name: "DefinitionRow",
  props: /* @__PURE__ */ Oi({
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
    const a = e, t = Ai(e, "open");
    a.initialOpen && (t.value = !0);
    const l = Pi(), o = nl(rl, void 0);
    function d(u) {
      return !!a.routeSection && !!a.routeId && u === a.routeSection + "/" + a.routeId;
    }
    Te(() => o?.selected.value, (u, v) => {
      d(u) ? t.value = !0 : d(v) && (t.value = !1);
    }, { immediate: !0 });
    function f() {
      t.value = !t.value, a.routeSection && a.routeId && o?.choose(a.routeSection, a.routeId, t.value);
    }
    return (u, v) => (n(), p("article", bn, [
      s("header", {
        class: $t(["work-definition-head", { "work-definition-has-handle": r(l).handle }])
      }, [
        r(l).handle ? (n(), p("div", hn, [
          at(u.$slots, "handle")
        ])) : S("", !0),
        s("div", gn, [
          g(Ql, {
            class: "work-definition-toggle",
            "aria-expanded": t.value,
            onActivate: f
          }, {
            default: Y(() => [
              g(r(ve), {
                icon: "tabler:chevron-right",
                "aria-hidden": "true"
              }),
              s("span", {
                class: "work-row-title",
                title: e.title
              }, T(e.title), 9, yn)
            ]),
            _: 1
          }, 8, ["aria-expanded"]),
          e.description ? (n(), p("p", kn, T(e.description), 1)) : S("", !0)
        ]),
        s("div", wn, [
          s("span", $n, [
            e.code ? (n(), p("code", {
              key: 0,
              class: "work-mono",
              title: e.code
            }, T(e.code), 9, Vn)) : S("", !0)
          ]),
          s("span", xn, [
            e.kind ? (n(), J(r(dt), {
              key: 0,
              severity: "secondary"
            }, {
              default: Y(() => [
                e.kindLabel ? (n(), p("span", Cn, T(e.kindLabel) + ":", 1)) : S("", !0),
                s("span", Sn, T(e.kind), 1)
              ]),
              _: 1
            })) : S("", !0),
            at(u.$slots, "status")
          ]),
          s("span", Tn, [
            at(u.$slots, "flags")
          ]),
          s("div", In, [
            at(u.$slots, "usage")
          ])
        ]),
        s("div", Dn, [
          at(u.$slots, "actions")
        ])
      ], 2),
      g(Fo, {
        name: "work-panel",
        persisted: ""
      }, {
        default: Y(() => [
          Vt(s("div", {
            inert: !t.value,
            class: "work-definition-body work-stack"
          }, [
            at(u.$slots, "default")
          ], 8, Un), [
            [Rt, t.value]
          ])
        ]),
        _: 3
      })
    ]));
  }
}), En = { class: "work-definition-scroll" }, An = {
  key: 0,
  class: "work-definition-columns",
  "aria-hidden": "true"
}, Pn = { key: 0 }, On = { class: "work-definition-usage" }, ul = /* @__PURE__ */ $e({
  __name: "DefinitionList",
  props: {
    count: {},
    columns: {}
  },
  setup(e) {
    return (a, t) => (n(), p("div", En, [
      s("div", {
        class: $t(["work-field-builder", "work-definitions-" + e.columns])
      }, [
        e.count > 3 && e.columns !== "plugins" ? (n(), p("div", An, [
          t[0] || (t[0] = s("span", null, null, -1)),
          t[1] || (t[1] = s("span", null, "Name", -1)),
          t[2] || (t[2] = s("span", { class: "work-definition-code" }, "Identifier", -1)),
          s("span", null, T(e.columns === "types" ? "Workflow" : "Kind"), 1),
          e.columns === "fields" ? (n(), p("span", Pn, "Details")) : S("", !0),
          s("span", On, T(e.columns === "fields" ? "Used by" : "Details"), 1),
          t[3] || (t[3] = s("span", null, null, -1))
        ])) : S("", !0),
        at(a.$slots, "default")
      ], 2)
    ]));
  }
}), Rn = [
  { code: "key", form: "text", index: "key" },
  { code: "type", form: "text", index: "key" },
  { code: "state", form: "text", index: "key" },
  { code: "category", form: "text", index: "key" },
  { code: "rank", form: "text", index: "key" },
  { code: "parent", form: "text", index: "key" },
  { code: "created_at", form: "time", index: "key" },
  { code: "updated_at", form: "time", index: "key" }
];
function Nn(e) {
  const a = e.compiled.processes?.flatMap((t) => t.states.map((l) => ({ id: l.id, label: l.name }))) ?? [];
  return [...Rn.filter((t) => t.code !== "rank").map((t) => t.code === "state" ? { ...t, type: "option", options: a } : t.code === "category" ? { ...t, type: "option", options: ["triage", "backlog", "unstarted", "started", "completed", "canceled"].map((l) => ({ id: l })) } : t), ...(e.compiled.fields ?? []).filter((t) => t.index && t.index !== "none")];
}
function Mn(e) {
  if (e?.cardinality && e.cardinality !== "one") return ["has", "in", "nin", "is_null", ...e.type === "principal" ? ["member_of"] : []];
  const a = ["eq", "neq", "in", "nin", "is_null", ...e?.type === "principal" ? ["member_of"] : []];
  return e && (["int", "number", "dec", "time", "quantity"].includes(e.form ?? "") || e.index === "number") && a.push("lt", "lte", "gt", "gte", "between"), e?.form === "text" && e.type !== "option" && a.push("contains", "starts_with"), a;
}
const Fn = { class: "work-field-control" }, Ln = ["id"], Bn = {
  key: 1,
  class: "work-stack work-tight"
}, jn = { class: "work-chips" }, zn = {
  key: 5,
  class: "work-row"
}, Wn = ["inert"], qn = ["value"], Gn = {
  key: 1,
  class: "work-muted"
}, Kn = ["inert"], Hn = ["value"], Yn = {
  key: 1,
  class: "work-muted"
}, Xn = {
  key: 11,
  class: "work-stack work-tight"
}, Jn = {
  class: "work-stack work-tight",
  "aria-label": "Matching items"
}, Zn = { class: "work-mono" }, Qn = {
  key: 15,
  class: "work-error work-small",
  role: "alert"
}, Jo = /* @__PURE__ */ $e({
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
    const t = e, l = a, o = H(() => t.inputId ?? `field-${t.field.code}`), d = H(() => !!t.field.cardinality && t.field.cardinality !== "one"), f = H(() => Array.isArray(t.modelValue) ? t.modelValue : []), u = H(() => t.modelValue == null ? "" : typeof t.modelValue == "object" ? Yt(t.modelValue) : String(t.modelValue)), v = H(() => {
      const b = t.modelValue;
      return b && typeof b == "object" && "ref" in b && Array.isArray(b.ref) ? String(b.ref[1] ?? "") : "";
    }), i = H(() => t.disabled || bo(t.field)), c = q(!1), m = q(!1), $ = q(!1), h = q(""), k = q(""), y = q([]), w = Sa(), V = q([]);
    let x = 0, E;
    const D = /* @__PURE__ */ new Set();
    Te(f, (b) => {
      V.value = E ?? b.map((A, Z) => V.value[Z] ?? x++), E = void 0;
    }, { immediate: !0 });
    function j(b) {
      l("update:modelValue", b);
    }
    function ie(b, A) {
      const Z = [...f.value];
      Z[b] = A, j(Z);
    }
    function L(b, A) {
      A ? D.delete(b) : D.add(b), l("validity", !D.size);
    }
    function re(b) {
      D.delete(V.value[b]), l("validity", !D.size), E = V.value.filter((A, Z) => Z !== b), j(f.value.filter((A, Z) => Z !== b));
    }
    function ue() {
      E = [...V.value, x++], j([...f.value, t.field.form === "bool" ? !1 : t.field.form === "record" ? {} : ""]);
    }
    function me(b) {
      const A = b.detail, Z = A?.principal_id ?? A?.id;
      j(Z ? { kind: A.type ?? "user", id: Z } : void 0);
    }
    function ce(b) {
      const A = b.detail;
      j(A?.thread_id ? { ref: ["component", A.thread_id] } : void 0);
    }
    const ne = q("");
    let P = "";
    Te(() => t.modelValue, (b) => {
      const A = JSON.stringify(b ?? {}, null, 2);
      A !== P && (P = A, ne.value = A, h.value = "", l("validity", !0));
    }, { immediate: !0 });
    function ae(b) {
      ne.value = b;
      try {
        const A = JSON.parse(b);
        if (!A || typeof A != "object" || Array.isArray(A)) throw new Error("Enter a JSON object.");
        if (t.field.type === "rich_text" && !("type" in A && typeof A.type == "string")) throw new Error("The document needs a type.");
        P = JSON.stringify(A, null, 2), h.value = "", l("validity", !0), j(A);
      } catch (A) {
        h.value = A instanceof Error ? A.message : "Invalid JSON.", l("validity", !1);
      }
    }
    function z(b) {
      if (!b) {
        l("validity", !0), j(void 0);
        return;
      }
      const A = Number.isFinite(Number(b)) && (t.field.form !== "int" || Number.isSafeInteger(Number(b)));
      l("validity", A), A && j(t.field.form === "int" ? Number(b) : b);
    }
    const ge = H(() => t.field.config?.format === "date");
    function Ve(b) {
      j(b ? ge.value ? b : new Date(b).toISOString() : void 0);
    }
    const B = H(() => {
      if (typeof t.modelValue != "string") return "";
      if (ge.value) return t.modelValue.slice(0, 10);
      const b = new Date(t.modelValue);
      return Number.isNaN(b.getTime()) ? "" : new Date(b.getTime() - b.getTimezoneOffset() * 6e4).toISOString().slice(0, 16);
    });
    function I(b) {
      j(b.detail?.ref);
    }
    function C(b) {
      j(b.detail?.value);
    }
    let U;
    Te(k, () => {
      const b = w();
      if (clearTimeout(U), !k.value.trim()) {
        y.value = [];
        return;
      }
      U = setTimeout(async () => {
        try {
          const A = k.value.trim(), Z = /^[A-Z][A-Z0-9]{1,9}-[0-9]+$/.test(A) ? [(await Ft.item(t.boardId, { key: A })).item] : (await Ft.query(t.boardId, { where: { field: "title", op: "contains", value: A }, limit: 8 })).items;
          b() && (y.value = Z, h.value = "");
        } catch (A) {
          b() && (h.value = pt(A, "Could not search items."));
        }
      }, 200);
    });
    function Q(b) {
      j({ board: t.boardId, item: b.id }), k.value = "", y.value = [];
    }
    Oa(async () => {
      t.field.type === "principal" ? c.value = await Bt("wc-principal-picker") : t.field.config?.target === "component" && (c.value = await Bt("wc-component-picker"));
    });
    for (const [b, A] of [[() => t.editorTag, $], [() => t.linkTag, m]])
      Te(b, async (Z, X, we) => {
        let xe = !0;
        if (we(() => {
          xe = !1;
        }), A.value = !1, Z) {
          const Oe = await Bt(Z);
          xe && (A.value = Oe);
        }
      }, { immediate: !0 });
    return Xl(() => {
      clearTimeout(U), w();
    }), (b, A) => {
      const Z = Lo("FieldControl", !0);
      return n(), p("div", Fn, [
        r(bo)(e.field) ? (n(), p("output", {
          key: 0,
          id: o.value,
          class: "work-read-value"
        }, T(r(Yt)(e.modelValue, e.field)), 9, Ln)) : d.value ? (n(), p("div", Bn, [
          s("div", jn, [
            (n(!0), p(te, null, de(f.value, (X, we) => (n(), J(r(dt), {
              key: V.value[we],
              class: "kx-tag-sm",
              severity: "secondary"
            }, {
              default: Y(() => [
                G(T(r(Yt)(X, e.field)) + " ", 1),
                g(r(le), {
                  type: "button",
                  class: "work-icon-button",
                  disabled: i.value,
                  "aria-label": "Remove value " + (we + 1),
                  onClick: (xe) => re(we),
                  severity: "secondary",
                  text: "",
                  size: "small"
                }, {
                  default: Y(() => [
                    g(r(ve), {
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
          (n(!0), p(te, null, de(f.value, (X, we) => (n(), p("div", {
            key: V.value[we],
            class: "work-stack work-tight"
          }, [
            g(Z, {
              "board-id": e.boardId,
              field: { ...e.field, cardinality: "one" },
              "model-value": X,
              "input-id": o.value + "-" + V.value[we],
              disabled: i.value,
              "editor-tag": e.editorTag,
              "link-tag": e.linkTag,
              "onUpdate:modelValue": (xe) => ie(we, xe),
              onValidity: (xe) => L(V.value[we], xe)
            }, null, 8, ["board-id", "field", "model-value", "input-id", "disabled", "editor-tag", "link-tag", "onUpdate:modelValue", "onValidity"])
          ]))), 128)),
          g(r(le), {
            label: "Add value",
            severity: "secondary",
            size: "small",
            disabled: i.value,
            onClick: ue,
            outlined: ""
          }, {
            icon: Y(() => [
              g(r(ve), {
                icon: "tabler:plus",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled"])
        ])) : e.editorTag && $.value ? (n(), J(ma(e.editorTag), {
          key: 2,
          "board-id": e.boardId,
          value: JSON.stringify(e.modelValue ?? null),
          config: JSON.stringify(e.field.config ?? {}),
          readonly: i.value || void 0,
          onChange: C
        }, null, 40, ["board-id", "value", "config", "readonly"])) : e.linkTag && m.value ? (n(), J(ma(e.linkTag), {
          key: 3,
          "board-id": e.boardId,
          kind: e.field.config?.target ?? e.field.type,
          value: JSON.stringify(e.modelValue ?? null),
          readonly: i.value || void 0,
          onChange: I
        }, null, 40, ["board-id", "kind", "value", "readonly"])) : e.field.type === "option" ? (n(), J(r(fe), {
          key: 4,
          placeholder: "Not set",
          inputId: o.value,
          "model-value": e.modelValue ?? "",
          disabled: i.value,
          "onUpdate:modelValue": A[0] || (A[0] = (X) => j(X || void 0)),
          appendTo: "self",
          optionLabel: "label",
          optionValue: "value",
          optionDisabled: "disabled",
          options: [{ label: "Not set", value: "", disabled: !1 }, ...(e.field.options ?? []).map((X) => ({ label: X.label ?? X.id, value: X.id, disabled: !1 }))]
        }, null, 8, ["inputId", "model-value", "disabled", "options"])) : e.field.form === "bool" ? (n(), p("label", zn, [
          g(r(Qt), {
            inputId: o.value,
            "model-value": e.modelValue === !0,
            disabled: i.value,
            "onUpdate:modelValue": A[1] || (A[1] = (X) => j(X)),
            binary: ""
          }, null, 8, ["inputId", "model-value", "disabled"]),
          G(T(e.modelValue === !0 ? "Yes" : e.modelValue === !1 ? "No" : "Not set"), 1)
        ])) : e.field.form === "int" ? (n(), J(r(Dt), {
          key: 6,
          inputId: o.value,
          "model-value": u.value === "" ? null : Number(u.value),
          disabled: i.value,
          "onUpdate:modelValue": A[2] || (A[2] = (X) => z(X == null ? "" : String(X))),
          useGrouping: !1
        }, null, 8, ["inputId", "model-value", "disabled"])) : e.field.form === "dec" ? (n(), J(r(De), {
          key: 7,
          id: o.value,
          inputmode: "decimal",
          "model-value": u.value,
          disabled: i.value,
          "onUpdate:modelValue": A[3] || (A[3] = (X) => z(X ?? ""))
        }, null, 8, ["id", "model-value", "disabled"])) : e.field.form === "time" ? (n(), J(r(De), {
          key: 8,
          id: o.value,
          type: ge.value ? "date" : "datetime-local",
          value: B.value,
          disabled: i.value,
          onInput: A[4] || (A[4] = (X) => Ve(X.target.value))
        }, null, 8, ["id", "type", "value", "disabled"])) : e.field.type === "principal" ? (n(), p("div", {
          key: 9,
          inert: i.value || void 0,
          class: "work-stack work-tight"
        }, [
          c.value ? (n(), p("wc-principal-picker", {
            key: 0,
            value: JSON.stringify(e.modelValue ?? {}),
            kinds: "user,group",
            onConfigChanged: me
          }, null, 40, qn)) : (n(), p("span", Gn, T(r(Yt)(e.modelValue, e.field)) + " · Person picker is unavailable.", 1))
        ], 8, Wn)) : e.field.config?.target === "component" ? (n(), p("div", {
          key: 10,
          inert: i.value || void 0
        }, [
          c.value ? (n(), p("wc-component-picker", {
            key: 0,
            value: JSON.stringify({ thread_id: v.value }),
            onChange: ce
          }, null, 40, Hn)) : (n(), p("span", Yn, "Component picker is unavailable."))
        ], 8, Kn)) : e.field.type === "item" ? (n(), p("div", Xn, [
          g(r(dt), {
            class: "kx-tag-sm",
            severity: "secondary"
          }, {
            default: Y(() => [
              G(T(r(Yt)(e.modelValue, e.field)), 1)
            ]),
            _: 1
          }),
          g(r(De), {
            id: o.value,
            modelValue: k.value,
            "onUpdate:modelValue": A[5] || (A[5] = (X) => k.value = X),
            disabled: i.value,
            placeholder: "Search a title or enter an item key",
            "aria-label": "Search items"
          }, null, 8, ["id", "modelValue", "disabled"]),
          s("div", Jn, [
            (n(!0), p(te, null, de(y.value, (X) => (n(), J(Ql, {
              key: X.id,
              class: "work-match-item",
              disabled: i.value,
              onActivate: (we) => Q(X)
            }, {
              default: Y(() => [
                s("code", Zn, T(X.key), 1),
                s("span", null, T(r(Yt)(X.values.title)), 1)
              ]),
              _: 2
            }, 1032, ["disabled", "onActivate"]))), 128))
          ]),
          e.modelValue ? (n(), J(r(le), {
            key: 0,
            label: "Clear reference",
            severity: "secondary",
            size: "small",
            disabled: i.value,
            onClick: A[6] || (A[6] = (X) => j(void 0)),
            outlined: ""
          }, {
            icon: Y(() => [
              g(r(ve), {
                icon: "tabler:list-check",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled"])) : S("", !0)
        ])) : e.field.form === "record" || e.field.type === "rich_text" || e.field.form === "quantity" || e.field.form === "ref" ? (n(), J(r(Pa), {
          key: 12,
          id: o.value,
          "model-value": ne.value,
          rows: "3",
          disabled: i.value,
          "aria-invalid": !!h.value,
          "onUpdate:modelValue": A[7] || (A[7] = (X) => ae(X ?? ""))
        }, null, 8, ["id", "model-value", "disabled", "aria-invalid"])) : e.field.code === "description" ? (n(), J(r(Pa), {
          key: 13,
          id: o.value,
          "model-value": u.value,
          rows: "4",
          disabled: i.value,
          "onUpdate:modelValue": A[8] || (A[8] = (X) => j(X))
        }, null, 8, ["id", "model-value", "disabled"])) : (n(), J(r(De), {
          key: 14,
          id: o.value,
          "model-value": u.value,
          disabled: i.value,
          "onUpdate:modelValue": A[9] || (A[9] = (X) => j(X))
        }, null, 8, ["id", "model-value", "disabled"])),
        h.value ? (n(), p("span", Qn, T(h.value), 1)) : S("", !0)
      ]);
    };
  }
}), _n = { class: "work-stack work-tight work-operand-control" }, es = { class: "work-row work-small" }, ts = {
  key: 1,
  class: "work-muted work-small"
}, as = {
  key: 2,
  class: "work-stack work-tight"
}, ls = { class: "work-small" }, os = {
  key: 0,
  class: "work-error work-small",
  role: "alert"
}, ka = /* @__PURE__ */ $e({
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
    const t = e, l = a, o = H(() => "$actor" in vt(t.modelValue) ? "actor" : "$now" in vt(t.modelValue) ? "now" : "literal"), d = q(""), f = q("");
    Te(() => t.modelValue, (i) => {
      d.value = JSON.stringify(i ?? []), f.value = "";
    }, { immediate: !0 });
    function u(i) {
      l("update:modelValue", i === "actor" ? { $actor: "id" } : i === "now" ? { $now: "P0D" } : void 0), l("validity", !0);
    }
    function v(i) {
      d.value = i;
      try {
        const c = JSON.parse(i);
        if (!Array.isArray(c)) throw new Error("Enter a JSON list.");
        f.value = "", l("validity", !0), l("update:modelValue", c);
      } catch (c) {
        f.value = c instanceof Error ? c.message : "Invalid values.", l("validity", !1);
      }
    }
    return (i, c) => (n(), p("div", _n, [
      s("label", es, [
        G(T(e.label), 1),
        g(r(fe), {
          "aria-label": e.label + " operand",
          "model-value": o.value,
          disabled: e.disabled,
          "onUpdate:modelValue": c[0] || (c[0] = (m) => u(m)),
          appendTo: "self",
          optionLabel: "label",
          optionValue: "value",
          optionDisabled: "disabled",
          options: [{ label: "Value", value: "literal", disabled: !1 }, { label: "Current actor ($actor)", value: "actor", disabled: !1 }, { label: "Current time ($now)", value: "now", disabled: !1 }]
        }, null, 8, ["aria-label", "model-value", "disabled"])
      ]),
      o.value === "now" ? (n(), J(r(De), {
        key: 0,
        "aria-label": e.label + " time offset",
        value: r(vt)(e.modelValue).$now,
        disabled: e.disabled,
        placeholder: "-P7D",
        onInput: c[1] || (c[1] = (m) => l("update:modelValue", { $now: m.target.value }))
      }, null, 8, ["aria-label", "value", "disabled"])) : o.value === "actor" ? (n(), p("span", ts, "The signed-in actor’s id")) : e.multiple ? (n(), p("div", as, [
        s("label", ls, [
          c[5] || (c[5] = G("Values as JSON (operands may appear in the list)", -1)),
          g(r(Pa), {
            class: "work-mono",
            "aria-label": e.label + " values",
            value: d.value,
            disabled: e.disabled,
            rows: "2",
            onInput: c[2] || (c[2] = (m) => v(m.target.value))
          }, null, 8, ["aria-label", "value", "disabled"])
        ]),
        f.value ? (n(), p("p", os, T(f.value), 1)) : S("", !0)
      ])) : (n(), J(Jo, {
        key: 3,
        "board-id": e.boardId,
        field: { ...e.field, cardinality: "one" },
        "model-value": e.modelValue,
        disabled: e.disabled,
        "input-id": e.label.replace(/[^a-z0-9]/gi, "-"),
        "onUpdate:modelValue": c[3] || (c[3] = (m) => l("update:modelValue", m)),
        onValidity: c[4] || (c[4] = (m) => l("validity", m))
      }, null, 8, ["board-id", "field", "model-value", "disabled", "input-id"]))
    ]));
  }
}), is = ["disabled"], ns = { class: "work-small work-mono" }, ss = { class: "work-row work-small" }, rs = { class: "work-row work-wrap" }, ds = { key: 3 }, us = { class: "work-row work-wrap" }, cs = { class: "work-row" }, vs = { class: "work-row" }, fs = { class: "work-row" }, ms = {
  key: 3,
  class: "work-row work-wrap"
}, ps = { class: "work-row work-wrap" }, bs = /* @__PURE__ */ $e({
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
    const t = e, l = a, o = H(() => t.path ?? "where"), d = H(() => t.depth ?? 1), f = H(() => ["and", "or", "not", "history", "match", "rel", "children"].find((ne) => ne in t.modelValue) ?? "field"), u = H(() => Nn(t.schema)), v = H(() => u.value.find((ne) => ne.code === t.modelValue.field) ?? { code: "value", form: "text" }), i = H(() => vt(t.modelValue.history)), c = H(() => u.value.find((ne) => ne.code === i.value.field) ?? { code: "history", form: "text" }), m = H(() => Array.isArray(t.modelValue[f.value]) ? t.modelValue[f.value] : []), $ = {
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
    }, k = () => ({ field: "category", op: "eq", value: "unstarted" }), y = q(/* @__PURE__ */ new Set());
    function w(ne, P) {
      P ? y.value.delete(ne) : y.value.add(ne), l("validity", y.value.size === 0);
    }
    Te(f, () => {
      y.value.clear(), l("validity", !0);
    });
    function V(ne) {
      const P = /* @__PURE__ */ new Set();
      for (const ae of y.value) {
        const z = Number(ae);
        !Number.isNaN(z) && z !== ne && P.add(String(z > ne ? z - 1 : z));
      }
      y.value = P, l("validity", P.size === 0), E({ [f.value]: m.value.filter((ae, z) => z !== ne) });
    }
    function x(ne) {
      l("update:modelValue", ne);
    }
    function E(ne) {
      x({ ...t.modelValue, ...ne });
    }
    function D(ne) {
      x(ne === "field" ? k() : ne === "and" || ne === "or" ? { [ne]: [k()] } : ne === "not" ? { not: k() } : ne === "history" ? { history: { field: "state", changed: !0 } } : ne === "match" ? { match: "" } : ne === "children" ? { children: !0, q: "some", where: k() } : { rel: t.schema.compiled.relation_types?.[0]?.id ?? "", dir: "outward", q: "some", where: k() });
    }
    function j(ne, P) {
      E({ [f.value]: m.value.map((ae, z) => z === ne ? P : ae) });
    }
    function ie(ne, P) {
      const ae = { ...i.value };
      P === void 0 ? (delete ae[ne], w(ne, !0)) : ae[ne] = P, E({ history: ae });
    }
    function L(ne) {
      y.value.clear(), l("validity", !0);
      const P = { ...i.value };
      delete P.was, delete P.changed, delete P.from, delete P.to, P[ne] = ne === "changed" ? !0 : "", E({ history: P });
    }
    const re = { code: "actor", form: "text" }, ue = { code: "at", form: "time" }, me = H(() => Array.isArray(i.value.during) ? i.value.during : []);
    function ce(ne, P) {
      const ae = [...me.value];
      ae[ne] = P, ie("during", ae);
    }
    return (ne, P) => {
      const ae = Lo("FilterNode", !0);
      return n(), p("fieldset", {
        class: "work-filter-node",
        disabled: e.disabled
      }, [
        s("legend", ns, T(o.value), 1),
        s("label", ss, [
          P[21] || (P[21] = G("Condition", -1)),
          g(r(fe), {
            "aria-label": o.value + " condition",
            "model-value": f.value,
            "onUpdate:modelValue": P[0] || (P[0] = (z) => D(z)),
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            optionDisabled: "disabled",
            options: Object.entries(h).map(([z, ge]) => ({ label: ge, value: z, disabled: d.value >= 6 && ["and", "or", "not", "rel", "children"].includes(z) }))
          }, null, 8, ["aria-label", "model-value", "options"])
        ]),
        f.value === "and" || f.value === "or" ? (n(), p(te, { key: 0 }, [
          (n(!0), p(te, null, de(m.value, (z, ge) => (n(), p("div", {
            key: ge,
            class: "work-stack work-tight"
          }, [
            g(ae, {
              "board-id": e.boardId,
              schema: e.schema,
              "model-value": z,
              path: o.value + "." + f.value + "[" + ge + "]",
              depth: d.value + 1,
              "onUpdate:modelValue": (Ve) => j(ge, Ve),
              onValidity: (Ve) => w(String(ge), Ve)
            }, null, 8, ["board-id", "schema", "model-value", "path", "depth", "onUpdate:modelValue", "onValidity"]),
            g(r(le), {
              label: "Remove condition",
              size: "small",
              severity: "secondary",
              onClick: (Ve) => V(ge),
              outlined: ""
            }, {
              icon: Y(() => [
                g(r(ve), {
                  icon: "tabler:trash",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["onClick"])
          ]))), 128)),
          g(r(le), {
            label: "Add condition",
            size: "small",
            severity: "secondary",
            disabled: d.value >= 6,
            onClick: P[1] || (P[1] = (z) => E({ [f.value]: [...m.value, k()] })),
            outlined: ""
          }, {
            icon: Y(() => [
              g(r(ve), {
                icon: "tabler:plus",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled"])
        ], 64)) : f.value === "not" ? (n(), J(ae, {
          key: 1,
          "board-id": e.boardId,
          schema: e.schema,
          "model-value": r(vt)(e.modelValue.not),
          path: o.value + ".not",
          depth: d.value + 1,
          "onUpdate:modelValue": P[2] || (P[2] = (z) => E({ not: z })),
          onValidity: P[3] || (P[3] = (z) => w("nested", z))
        }, null, 8, ["board-id", "schema", "model-value", "path", "depth"])) : f.value === "field" ? (n(), p(te, { key: 2 }, [
          s("div", rs, [
            s("label", null, [
              P[22] || (P[22] = G("Field", -1)),
              g(r(fe), {
                "aria-label": o.value + " field",
                "model-value": e.modelValue.field,
                "onUpdate:modelValue": P[4] || (P[4] = (z) => E({ field: z, op: "eq", value: void 0 })),
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                optionDisabled: "disabled",
                options: [...(u.value ?? []).map((z) => ({ label: r(Ze)(z), value: z.code, disabled: !1 }))]
              }, null, 8, ["aria-label", "model-value", "options"])
            ]),
            s("label", null, [
              P[23] || (P[23] = G("Comparison", -1)),
              g(r(fe), {
                "aria-label": o.value + " operator",
                "model-value": e.modelValue.op,
                "onUpdate:modelValue": P[5] || (P[5] = (z) => E({ op: z, value: z === "is_null" ? !0 : void 0 })),
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                options: r(Mn)(v.value).map((z) => ({ value: z, label: $[z] }))
              }, null, 8, ["aria-label", "model-value", "options"])
            ])
          ]),
          g(ka, {
            "board-id": e.boardId,
            field: e.modelValue.op === "is_null" ? { code: "null", form: "bool" } : v.value,
            "model-value": e.modelValue.value,
            multiple: ["in", "nin", "between"].includes(String(e.modelValue.op)),
            label: o.value + " value",
            "onUpdate:modelValue": P[6] || (P[6] = (z) => E({ value: z })),
            onValidity: P[7] || (P[7] = (z) => w("value", z))
          }, null, 8, ["board-id", "field", "model-value", "multiple", "label"])
        ], 64)) : f.value === "match" ? (n(), p("label", ds, [
          P[24] || (P[24] = G("Search", -1)),
          g(r(De), {
            "aria-label": o.value + " search",
            value: e.modelValue.match,
            onInput: P[8] || (P[8] = (z) => E({ match: z.target.value }))
          }, null, 8, ["aria-label", "value"])
        ])) : f.value === "history" ? (n(), p(te, { key: 4 }, [
          s("div", us, [
            s("label", null, [
              P[25] || (P[25] = G("Field", -1)),
              g(r(fe), {
                "aria-label": o.value + " history field",
                "model-value": i.value.field,
                "onUpdate:modelValue": P[9] || (P[9] = (z) => ie("field", z)),
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                optionDisabled: "disabled",
                options: [...(u.value ?? []).map((z) => ({ label: r(Ze)(z), value: z.code, disabled: !1 }))]
              }, null, 8, ["aria-label", "model-value", "options"])
            ]),
            s("label", null, [
              P[26] || (P[26] = G("History", -1)),
              g(r(fe), {
                "aria-label": o.value + " history mode",
                "model-value": i.value.changed ? "changed" : "was",
                "onUpdate:modelValue": P[10] || (P[10] = (z) => L(z)),
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                optionDisabled: "disabled",
                options: [{ label: "Changed", value: "changed", disabled: !1 }, { label: "Was", value: "was", disabled: !1 }]
              }, null, 8, ["aria-label", "model-value"])
            ])
          ]),
          i.value.changed ? (n(), p(te, { key: 0 }, de(["from", "to"], (z) => s("div", { key: z }, [
            s("label", cs, [
              g(r(Qt), {
                "model-value": z in i.value,
                "aria-label": "Constrain " + z,
                "onUpdate:modelValue": (ge) => ie(z, ge ? "" : void 0),
                binary: ""
              }, null, 8, ["model-value", "aria-label", "onUpdate:modelValue"]),
              G(T(z), 1)
            ]),
            z in i.value ? (n(), J(ka, {
              key: 0,
              "board-id": e.boardId,
              field: c.value,
              "model-value": i.value[z],
              label: o.value + " history " + z,
              "onUpdate:modelValue": (ge) => ie(z, ge),
              onValidity: (ge) => w(z, ge)
            }, null, 8, ["board-id", "field", "model-value", "label", "onUpdate:modelValue", "onValidity"])) : S("", !0)
          ])), 64)) : (n(), J(ka, {
            key: 1,
            "board-id": e.boardId,
            field: c.value,
            "model-value": i.value.was,
            label: o.value + " history was",
            "onUpdate:modelValue": P[11] || (P[11] = (z) => ie("was", z)),
            onValidity: P[12] || (P[12] = (z) => w("was", z))
          }, null, 8, ["board-id", "field", "model-value", "label"])),
          s("label", vs, [
            g(r(Qt), {
              "model-value": "by" in i.value,
              "aria-label": "Constrain actor",
              "onUpdate:modelValue": P[13] || (P[13] = (z) => ie("by", z ? { $actor: "id" } : void 0)),
              binary: ""
            }, null, 8, ["model-value"]),
            P[27] || (P[27] = G("By actor", -1))
          ]),
          "by" in i.value ? (n(), J(ka, {
            key: 2,
            "board-id": e.boardId,
            field: re,
            "model-value": i.value.by,
            label: o.value + " history by",
            "onUpdate:modelValue": P[14] || (P[14] = (z) => ie("by", z))
          }, null, 8, ["board-id", "model-value", "label"])) : S("", !0),
          s("label", fs, [
            g(r(Qt), {
              "model-value": "during" in i.value,
              "aria-label": "Constrain time window",
              "onUpdate:modelValue": P[15] || (P[15] = (z) => ie("during", z ? [{ $now: "-P30D" }, { $now: "P0D" }] : void 0)),
              binary: ""
            }, null, 8, ["model-value"]),
            P[28] || (P[28] = G("During", -1))
          ]),
          "during" in i.value ? (n(), p("div", ms, [
            (n(), p(te, null, de(["start", "end"], (z, ge) => g(ka, {
              key: z,
              "board-id": e.boardId,
              field: ue,
              "model-value": me.value[ge],
              label: o.value + " during " + z,
              "onUpdate:modelValue": (Ve) => ce(ge, Ve)
            }, null, 8, ["board-id", "model-value", "label", "onUpdate:modelValue"])), 64))
          ])) : S("", !0)
        ], 64)) : (n(), p(te, { key: 5 }, [
          s("div", ps, [
            f.value === "rel" ? (n(), p(te, { key: 0 }, [
              s("label", null, [
                P[29] || (P[29] = G("Relation", -1)),
                g(r(fe), {
                  "model-value": e.modelValue.rel,
                  "onUpdate:modelValue": P[16] || (P[16] = (z) => E({ rel: z })),
                  appendTo: "self",
                  optionLabel: "label",
                  optionValue: "value",
                  optionDisabled: "disabled",
                  options: [...(e.schema.compiled.relation_types ?? []).map((z) => ({ label: z.outward ?? z.id, value: z.id, disabled: !1 }))]
                }, null, 8, ["model-value", "options"])
              ]),
              s("label", null, [
                P[30] || (P[30] = G("Direction", -1)),
                g(r(fe), {
                  "model-value": e.modelValue.dir,
                  "onUpdate:modelValue": P[17] || (P[17] = (z) => E({ dir: z })),
                  appendTo: "self",
                  optionLabel: "label",
                  optionValue: "value",
                  optionDisabled: "disabled",
                  options: [{ label: "Outward", value: "outward", disabled: !1 }, { label: "Inward", value: "inward", disabled: !1 }]
                }, null, 8, ["model-value"])
              ])
            ], 64)) : S("", !0),
            s("label", null, [
              P[31] || (P[31] = G("Quantifier", -1)),
              g(r(fe), {
                "model-value": e.modelValue.q,
                "onUpdate:modelValue": P[18] || (P[18] = (z) => E({ q: z })),
                appendTo: "self",
                options: ["some", "every", "none"]
              }, null, 8, ["model-value"])
            ])
          ]),
          g(ae, {
            "board-id": e.boardId,
            schema: e.schema,
            "model-value": r(vt)(e.modelValue.where),
            path: o.value + ".where",
            depth: d.value + 1,
            "onUpdate:modelValue": P[19] || (P[19] = (z) => E({ where: z })),
            onValidity: P[20] || (P[20] = (z) => w("nested", z))
          }, null, 8, ["board-id", "schema", "model-value", "path", "depth"])
        ], 64))
      ], 8, is);
    };
  }
}), hs = { class: "work-stack work-tight" }, gs = { class: "work-row work-small" }, _l = /* @__PURE__ */ $e({
  __name: "ConditionEditor",
  props: {
    modelValue: {},
    draft: {},
    boardId: {},
    label: {}
  },
  emits: ["update:modelValue", "validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = H(() => ({ declaration: t.draft, compiled: t.draft, generation: 0, as_of: 0, key_prefix: "" })), d = /* @__PURE__ */ new Set();
    function f(v, i) {
      i ? d.delete(v) : d.add(v), l("validity", !d.size);
    }
    function u(v) {
      l("update:modelValue", v ? { field: t.draft.fields?.[0]?.code ?? "state", op: "eq" } : void 0), v || (d.clear(), l("validity", !0));
    }
    return At(() => l("validity", !0)), (v, i) => (n(), p("section", hs, [
      s("label", gs, [
        g(r(rt), {
          "model-value": e.modelValue != null,
          "aria-label": e.label,
          "onUpdate:modelValue": u
        }, null, 8, ["model-value", "aria-label"]),
        G(T(e.label), 1)
      ]),
      e.modelValue != null ? (n(), J(bs, {
        key: 0,
        schema: o.value,
        "board-id": e.boardId ?? "",
        "model-value": r(vt)(e.modelValue),
        path: e.label,
        "onUpdate:modelValue": i[0] || (i[0] = (c) => l("update:modelValue", c)),
        onValidity: i[1] || (i[1] = (c) => f("structured", c))
      }, null, 8, ["schema", "board-id", "model-value", "path"])) : S("", !0),
      e.modelValue != null ? (n(), J(jt, {
        key: 1,
        label: e.label + " predicate",
        "model-value": e.modelValue,
        hint: "Use any predicate accepted by Work, including installed or deeply nested forms.",
        "onUpdate:modelValue": i[2] || (i[2] = (c) => l("update:modelValue", c)),
        onValidity: i[3] || (i[3] = (c) => f("raw", c))
      }, null, 8, ["label", "model-value"])) : S("", !0)
    ]));
  }
}), ys = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, ks = ["aria-label"], ws = { class: "work-field-label" }, $s = {
  key: 0,
  class: "work-chips"
}, Vs = ["kinds"], xs = {
  key: 2,
  class: "work-muted work-small"
}, eo = /* @__PURE__ */ $e({
  __name: "PrincipalsPicker",
  props: {
    modelValue: {},
    label: {},
    kinds: {},
    boardId: {}
  },
  emits: ["update:modelValue"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = q(!1), d = q(0), f = H(() => t.modelValue ?? []), { principalLabel: u, rememberPrincipal: v, nameError: i } = zo(() => t.boardId ?? "", () => f.value);
    Oa(async () => {
      o.value = await Bt("wc-principal-picker");
    });
    function c(m) {
      const $ = m.detail, h = $?.principal_id ?? $?.id;
      if (!h) return;
      const k = { kind: $.type ?? "user", id: h };
      $.label && v(k, $.label), f.value.some((y) => y.id === h && y.kind === k.kind) || l("update:modelValue", [...f.value, k]), d.value++;
    }
    return (m, $) => (n(), p(te, null, [
      r(i) ? (n(), p("p", ys, T(r(i)), 1)) : S("", !0),
      s("section", {
        class: "work-stack work-tight work-principals-picker",
        "aria-label": e.label
      }, [
        s("h4", ws, T(e.label), 1),
        f.value.length ? (n(), p("div", $s, [
          (n(!0), p(te, null, de(f.value, (h, k) => (n(), J(r(dt), {
            key: h.kind + h.id,
            severity: "secondary",
            class: "kx-tag-sm"
          }, {
            default: Y(() => [
              G(T(r(u)(h)), 1),
              g(r(le), {
                text: "",
                severity: "secondary",
                size: "small",
                "aria-label": "Remove " + r(u)(h),
                onClick: (y) => l("update:modelValue", f.value.filter((w, V) => V !== k))
              }, {
                default: Y(() => [
                  g(r(ve), { icon: "tabler:x" })
                ]),
                _: 1
              }, 8, ["aria-label", "onClick"])
            ]),
            _: 2
          }, 1024))), 128))
        ])) : S("", !0),
        o.value ? (n(), p("wc-principal-picker", {
          key: d.value,
          kinds: e.kinds ?? "user,group",
          onConfigChanged: c
        }, null, 40, Vs)) : (n(), p("p", xs, "People and group picker is unavailable."))
      ], 8, ks)
    ], 64));
  }
}), Cs = { class: "work-stack work-tight" }, Zo = /* @__PURE__ */ $e({
  __name: "HoldersPicker",
  props: {
    modelValue: {},
    label: {},
    boardId: {}
  },
  emits: ["update:modelValue", "validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = H(() => (t.modelValue ?? []).flatMap((f) => "user" in f ? [{ kind: "user", id: f.user }] : "group" in f ? [{ kind: "group", id: f.group }] : []));
    function d(f) {
      const u = [...(t.modelValue ?? []).filter((v) => "field" in v || "service" in v), ...f.map((v) => v.kind === "group" ? { group: v.id } : { user: v.id })];
      l("update:modelValue", u.length ? u : void 0);
    }
    return (f, u) => (n(), p("div", Cs, [
      g(eo, {
        "board-id": e.boardId,
        label: e.label,
        "model-value": o.value,
        "onUpdate:modelValue": d
      }, null, 8, ["board-id", "label", "model-value"]),
      g(jt, {
        label: e.label + " rules",
        "model-value": e.modelValue,
        shape: "array",
        example: [{ group: "selected-group" }],
        "onUpdate:modelValue": u[0] || (u[0] = (v) => l("update:modelValue", v)),
        onValidity: u[1] || (u[1] = (v) => l("validity", v))
      }, null, 8, ["label", "model-value"])
    ]));
  }
}), Ss = ["disabled"], Ts = { class: "work-chips" }, Is = {
  key: 1,
  class: "work-muted work-small"
}, bt = /* @__PURE__ */ $e({
  __name: "ChipPicker",
  props: {
    label: {},
    options: {},
    modelValue: {},
    disabled: { type: Boolean }
  },
  emits: ["update:modelValue"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = q(""), d = H(() => t.options.map((v) => typeof v == "string" ? { value: v } : v)), f = H(() => d.value.filter((v) => (v.label ?? Pe(v.value)).toLocaleLowerCase().includes(o.value.toLocaleLowerCase())));
    function u(v) {
      if (t.disabled) return;
      const i = t.modelValue ?? [];
      l("update:modelValue", i.includes(v) ? i.filter((c) => c !== v) : [...i, v]);
    }
    return (v, i) => (n(), p("fieldset", {
      class: "work-chip-picker",
      disabled: e.disabled
    }, [
      s("legend", null, T(e.label), 1),
      e.options.length > 10 ? (n(), J(r(De), {
        key: 0,
        modelValue: o.value,
        "onUpdate:modelValue": i[0] || (i[0] = (c) => o.value = c),
        type: "search",
        "aria-label": "Find " + e.label.toLowerCase(),
        placeholder: "Find a choice…"
      }, null, 8, ["modelValue", "aria-label"])) : S("", !0),
      s("div", Ts, [
        g(r(Zl), {
          "model-value": e.modelValue ?? [],
          options: f.value.map((c) => ({ value: c.value, label: c.label ?? r(Pe)(c.value) })),
          optionLabel: "label",
          optionValue: "value",
          multiple: "",
          disabled: e.disabled,
          "aria-label": e.label,
          "onUpdate:modelValue": i[1] || (i[1] = (c) => l("update:modelValue", c ?? []))
        }, null, 8, ["model-value", "options", "disabled", "aria-label"]),
        (n(!0), p(te, null, de(e.modelValue?.filter((c) => !d.value.some((m) => m.value === c)) ?? [], (c) => (n(), J(r(le), {
          severity: "secondary",
          text: "",
          size: "small",
          key: c,
          type: "button",
          class: "work-choice work-unavailable",
          "aria-label": "Remove unavailable " + c,
          onClick: (m) => u(c)
        }, {
          default: Y(() => [
            G(T(r(Pe)(c)) + " · unavailable ×", 1)
          ]),
          _: 2
        }, 1032, ["aria-label", "onClick"]))), 128))
      ]),
      e.options.length ? S("", !0) : (n(), p("span", Is, "No choices declared."))
    ], 8, Ss));
  }
});
/**!
 * Sortable 1.15.7
 * @author	RubaXa   <trash@rubaxa.org>
 * @author	owenm    <owen23355@gmail.com>
 * @license MIT
 */
function Ds(e, a, t) {
  return (a = Ps(a)) in e ? Object.defineProperty(e, a, {
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
function wo(e, a) {
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
    a % 2 ? wo(Object(t), !0).forEach(function(l) {
      Ds(e, l, t[l]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : wo(Object(t)).forEach(function(l) {
      Object.defineProperty(e, l, Object.getOwnPropertyDescriptor(t, l));
    });
  }
  return e;
}
function Us(e, a) {
  if (e == null) return {};
  var t, l, o = Es(e, a);
  if (Object.getOwnPropertySymbols) {
    var d = Object.getOwnPropertySymbols(e);
    for (l = 0; l < d.length; l++) t = d[l], a.indexOf(t) === -1 && {}.propertyIsEnumerable.call(e, t) && (o[t] = e[t]);
  }
  return o;
}
function Es(e, a) {
  if (e == null) return {};
  var t = {};
  for (var l in e) if ({}.hasOwnProperty.call(e, l)) {
    if (a.indexOf(l) !== -1) continue;
    t[l] = e[l];
  }
  return t;
}
function As(e, a) {
  if (typeof e != "object" || !e) return e;
  var t = e[Symbol.toPrimitive];
  if (t !== void 0) {
    var l = t.call(e, a);
    if (typeof l != "object") return l;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (a === "string" ? String : Number)(e);
}
function Ps(e) {
  var a = As(e, "string");
  return typeof a == "symbol" ? a : a + "";
}
function Ll(e) {
  "@babel/helpers - typeof";
  return Ll = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(a) {
    return typeof a;
  } : function(a) {
    return a && typeof Symbol == "function" && a.constructor === Symbol && a !== Symbol.prototype ? "symbol" : typeof a;
  }, Ll(e);
}
var Os = "1.15.7";
function Ut(e) {
  if (typeof window < "u" && window.navigator)
    return !!/* @__PURE__ */ navigator.userAgent.match(e);
}
var Pt = Ut(/(?:Trident.*rv[ :]?11\.|msie|iemobile|Windows Phone)/i), Na = Ut(/Edge/i), $o = Ut(/firefox/i), Ta = Ut(/safari/i) && !Ut(/chrome/i) && !Ut(/android/i), to = Ut(/iP(ad|od|hone)/i), Qo = Ut(/chrome/i) && Ut(/android/i), _o = {
  capture: !1,
  passive: !1
};
function Ie(e, a, t) {
  e.addEventListener(a, t, !Pt && _o);
}
function Se(e, a, t) {
  e.removeEventListener(a, t, !Pt && _o);
}
function el(e, a) {
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
function ei(e) {
  return e.host && e !== document && e.host.nodeType && e.host !== e ? e.host : e.parentNode;
}
function wt(e, a, t, l) {
  if (e) {
    t = t || document;
    do {
      if (a != null && (a[0] === ">" ? e.parentNode === t && el(e, a) : el(e, a)) || l && e === t)
        return e;
      if (e === t) break;
    } while (e = ei(e));
  }
  return null;
}
var Vo = /\s+/g;
function ut(e, a, t) {
  if (e && a)
    if (e.classList)
      e.classList[t ? "add" : "remove"](a);
    else {
      var l = (" " + e.className + " ").replace(Vo, " ").replace(" " + a + " ", " ");
      e.className = (l + (t ? " " + a : "")).replace(Vo, " ");
    }
}
function be(e, a, t) {
  var l = e && e.style;
  if (l) {
    if (t === void 0)
      return document.defaultView && document.defaultView.getComputedStyle ? t = document.defaultView.getComputedStyle(e, "") : e.currentStyle && (t = e.currentStyle), a === void 0 ? t : t[a];
    !(a in l) && a.indexOf("webkit") === -1 && (a = "-webkit-" + a), l[a] = t + (typeof t == "string" ? "" : "px");
  }
}
function fa(e, a) {
  var t = "";
  if (typeof e == "string")
    t = e;
  else
    do {
      var l = be(e, "transform");
      l && l !== "none" && (t = l + " " + t);
    } while (!a && (e = e.parentNode));
  var o = window.DOMMatrix || window.WebKitCSSMatrix || window.CSSMatrix || window.MSCSSMatrix;
  return o && new o(t);
}
function ti(e, a, t) {
  if (e) {
    var l = e.getElementsByTagName(a), o = 0, d = l.length;
    if (t)
      for (; o < d; o++)
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
    var d, f, u, v, i, c, m;
    if (e !== window && e.parentNode && e !== xt() ? (d = e.getBoundingClientRect(), f = d.top, u = d.left, v = d.bottom, i = d.right, c = d.height, m = d.width) : (f = 0, u = 0, v = window.innerHeight, i = window.innerWidth, c = window.innerHeight, m = window.innerWidth), (a || t) && e !== window && (o = o || e.parentNode, !Pt))
      do
        if (o && o.getBoundingClientRect && (be(o, "transform") !== "none" || t && be(o, "position") !== "static")) {
          var $ = o.getBoundingClientRect();
          f -= $.top + parseInt(be(o, "border-top-width")), u -= $.left + parseInt(be(o, "border-left-width")), v = f + d.height, i = u + d.width;
          break;
        }
      while (o = o.parentNode);
    if (l && e !== window) {
      var h = fa(o || e), k = h && h.a, y = h && h.d;
      h && (f /= y, u /= k, m /= k, c /= y, v = f + c, i = u + m);
    }
    return {
      top: f,
      left: u,
      bottom: v,
      right: i,
      width: m,
      height: c
    };
  }
}
function xo(e, a, t) {
  for (var l = Lt(e, !0), o = qe(e)[a]; l; ) {
    var d = qe(l)[t], f = void 0;
    if (f = o >= d, !f) return l;
    if (l === xt()) break;
    l = Lt(l, !1);
  }
  return !1;
}
function pa(e, a, t, l) {
  for (var o = 0, d = 0, f = e.children; d < f.length; ) {
    if (f[d].style.display !== "none" && f[d] !== he.ghost && (l || f[d] !== he.dragged) && wt(f[d], t.draggable, e, !1)) {
      if (o === a)
        return f[d];
      o++;
    }
    d++;
  }
  return null;
}
function ao(e, a) {
  for (var t = e.lastElementChild; t && (t === he.ghost || be(t, "display") === "none" || a && !el(t, a)); )
    t = t.previousElementSibling;
  return t || null;
}
function mt(e, a) {
  var t = 0;
  if (!e || !e.parentNode)
    return -1;
  for (; e = e.previousElementSibling; )
    e.nodeName.toUpperCase() !== "TEMPLATE" && e !== he.clone && (!a || el(e, a)) && t++;
  return t;
}
function Co(e) {
  var a = 0, t = 0, l = xt();
  if (e)
    do {
      var o = fa(e), d = o.a, f = o.d;
      a += e.scrollLeft * d, t += e.scrollTop * f;
    } while (e !== l && (e = e.parentNode));
  return [a, t];
}
function Rs(e, a) {
  for (var t in e)
    if (e.hasOwnProperty(t)) {
      for (var l in a)
        if (a.hasOwnProperty(l) && a[l] === e[t][l]) return Number(t);
    }
  return -1;
}
function Lt(e, a) {
  if (!e || !e.getBoundingClientRect) return xt();
  var t = e, l = !1;
  do
    if (t.clientWidth < t.scrollWidth || t.clientHeight < t.scrollHeight) {
      var o = be(t);
      if (t.clientWidth < t.scrollWidth && (o.overflowX == "auto" || o.overflowX == "scroll") || t.clientHeight < t.scrollHeight && (o.overflowY == "auto" || o.overflowY == "scroll")) {
        if (!t.getBoundingClientRect || t === document.body) return xt();
        if (l || a) return t;
        l = !0;
      }
    }
  while (t = t.parentNode);
  return xt();
}
function Ns(e, a) {
  if (e && a)
    for (var t in a)
      a.hasOwnProperty(t) && (e[t] = a[t]);
  return e;
}
function Sl(e, a) {
  return Math.round(e.top) === Math.round(a.top) && Math.round(e.left) === Math.round(a.left) && Math.round(e.height) === Math.round(a.height) && Math.round(e.width) === Math.round(a.width);
}
var Ia;
function ai(e, a) {
  return function() {
    if (!Ia) {
      var t = arguments, l = this;
      t.length === 1 ? e.call(l, t[0]) : e.apply(l, t), Ia = setTimeout(function() {
        Ia = void 0;
      }, a);
    }
  };
}
function Ms() {
  clearTimeout(Ia), Ia = void 0;
}
function li(e, a, t) {
  e.scrollLeft += a, e.scrollTop += t;
}
function oi(e) {
  var a = window.Polymer, t = window.jQuery || window.Zepto;
  return a && a.dom ? a.dom(e).cloneNode(!0) : t ? t(e).clone(!0)[0] : e.cloneNode(!0);
}
function ii(e, a, t) {
  var l = {};
  return Array.from(e.children).forEach(function(o) {
    var d, f, u, v;
    if (!(!wt(o, a.draggable, e, !1) || o.animated || o === t)) {
      var i = qe(o);
      l.left = Math.min((d = l.left) !== null && d !== void 0 ? d : 1 / 0, i.left), l.top = Math.min((f = l.top) !== null && f !== void 0 ? f : 1 / 0, i.top), l.right = Math.max((u = l.right) !== null && u !== void 0 ? u : -1 / 0, i.right), l.bottom = Math.max((v = l.bottom) !== null && v !== void 0 ? v : -1 / 0, i.bottom);
    }
  }), l.width = l.right - l.left, l.height = l.bottom - l.top, l.x = l.left, l.y = l.top, l;
}
var st = "Sortable" + (/* @__PURE__ */ new Date()).getTime();
function Fs() {
  var e = [], a;
  return {
    captureAnimationState: function() {
      if (e = [], !!this.options.animation) {
        var l = [].slice.call(this.el.children);
        l.forEach(function(o) {
          if (!(be(o, "display") === "none" || o === he.ghost)) {
            e.push({
              target: o,
              rect: qe(o)
            });
            var d = Ct({}, e[e.length - 1].rect);
            if (o.thisAnimationDuration) {
              var f = fa(o, !0);
              f && (d.top -= f.f, d.left -= f.e);
            }
            o.fromRect = d;
          }
        });
      }
    },
    addAnimationState: function(l) {
      e.push(l);
    },
    removeAnimationState: function(l) {
      e.splice(Rs(e, {
        target: l
      }), 1);
    },
    animateAll: function(l) {
      var o = this;
      if (!this.options.animation) {
        clearTimeout(a), typeof l == "function" && l();
        return;
      }
      var d = !1, f = 0;
      e.forEach(function(u) {
        var v = 0, i = u.target, c = i.fromRect, m = qe(i), $ = i.prevFromRect, h = i.prevToRect, k = u.rect, y = fa(i, !0);
        y && (m.top -= y.f, m.left -= y.e), i.toRect = m, i.thisAnimationDuration && Sl($, m) && !Sl(c, m) && // Make sure animatingRect is on line between toRect & fromRect
        (k.top - m.top) / (k.left - m.left) === (c.top - m.top) / (c.left - m.left) && (v = Bs(k, $, h, o.options)), Sl(m, c) || (i.prevFromRect = c, i.prevToRect = m, v || (v = o.options.animation), o.animate(i, k, m, v)), v && (d = !0, f = Math.max(f, v), clearTimeout(i.animationResetTimer), i.animationResetTimer = setTimeout(function() {
          i.animationTime = 0, i.prevFromRect = null, i.fromRect = null, i.prevToRect = null, i.thisAnimationDuration = null;
        }, v), i.thisAnimationDuration = v);
      }), clearTimeout(a), d ? a = setTimeout(function() {
        typeof l == "function" && l();
      }, f) : typeof l == "function" && l(), e = [];
    },
    animate: function(l, o, d, f) {
      if (f) {
        be(l, "transition", ""), be(l, "transform", "");
        var u = fa(this.el), v = u && u.a, i = u && u.d, c = (o.left - d.left) / (v || 1), m = (o.top - d.top) / (i || 1);
        l.animatingX = !!c, l.animatingY = !!m, be(l, "transform", "translate3d(" + c + "px," + m + "px,0)"), this.forRepaintDummy = Ls(l), be(l, "transition", "transform " + f + "ms" + (this.options.easing ? " " + this.options.easing : "")), be(l, "transform", "translate3d(0,0,0)"), typeof l.animated == "number" && clearTimeout(l.animated), l.animated = setTimeout(function() {
          be(l, "transition", ""), be(l, "transform", ""), l.animated = !1, l.animatingX = !1, l.animatingY = !1;
        }, f);
      }
    }
  };
}
function Ls(e) {
  return e.offsetWidth;
}
function Bs(e, a, t, l) {
  return Math.sqrt(Math.pow(a.top - e.top, 2) + Math.pow(a.left - e.left, 2)) / Math.sqrt(Math.pow(a.top - t.top, 2) + Math.pow(a.left - t.left, 2)) * l.animation;
}
var sa = [], Tl = {
  initializeByDefault: !0
}, Ma = {
  mount: function(a) {
    for (var t in Tl)
      Tl.hasOwnProperty(t) && !(t in a) && (a[t] = Tl[t]);
    sa.forEach(function(l) {
      if (l.pluginName === a.pluginName)
        throw "Sortable: Cannot mount plugin ".concat(a.pluginName, " more than once");
    }), sa.push(a);
  },
  pluginEvent: function(a, t, l) {
    var o = this;
    this.eventCanceled = !1, l.cancel = function() {
      o.eventCanceled = !0;
    };
    var d = a + "Global";
    sa.forEach(function(f) {
      t[f.pluginName] && (t[f.pluginName][d] && t[f.pluginName][d](Ct({
        sortable: t
      }, l)), t.options[f.pluginName] && t[f.pluginName][a] && t[f.pluginName][a](Ct({
        sortable: t
      }, l)));
    });
  },
  initializePlugins: function(a, t, l, o) {
    sa.forEach(function(u) {
      var v = u.pluginName;
      if (!(!a.options[v] && !u.initializeByDefault)) {
        var i = new u(a, t, a.options);
        i.sortable = a, i.options = a.options, a[v] = i, Et(l, i.defaults);
      }
    });
    for (var d in a.options)
      if (a.options.hasOwnProperty(d)) {
        var f = this.modifyOption(a, d, a.options[d]);
        typeof f < "u" && (a.options[d] = f);
      }
  },
  getEventProperties: function(a, t) {
    var l = {};
    return sa.forEach(function(o) {
      typeof o.eventProperties == "function" && Et(l, o.eventProperties.call(t[o.pluginName], a));
    }), l;
  },
  modifyOption: function(a, t, l) {
    var o;
    return sa.forEach(function(d) {
      a[d.pluginName] && d.optionListeners && typeof d.optionListeners[t] == "function" && (o = d.optionListeners[t].call(a[d.pluginName], l));
    }), o;
  }
};
function js(e) {
  var a = e.sortable, t = e.rootEl, l = e.name, o = e.targetEl, d = e.cloneEl, f = e.toEl, u = e.fromEl, v = e.oldIndex, i = e.newIndex, c = e.oldDraggableIndex, m = e.newDraggableIndex, $ = e.originalEvent, h = e.putSortable, k = e.extraEventProperties;
  if (a = a || t && t[st], !!a) {
    var y, w = a.options, V = "on" + l.charAt(0).toUpperCase() + l.substr(1);
    window.CustomEvent && !Pt && !Na ? y = new CustomEvent(l, {
      bubbles: !0,
      cancelable: !0
    }) : (y = document.createEvent("Event"), y.initEvent(l, !0, !0)), y.to = f || t, y.from = u || t, y.item = o || t, y.clone = d, y.oldIndex = v, y.newIndex = i, y.oldDraggableIndex = c, y.newDraggableIndex = m, y.originalEvent = $, y.pullMode = h ? h.lastPutMode : void 0;
    var x = Ct(Ct({}, k), Ma.getEventProperties(l, a));
    for (var E in x)
      y[E] = x[E];
    t && t.dispatchEvent(y), w[V] && w[V].call(a, y);
  }
}
var zs = ["evt"], nt = function(a, t) {
  var l = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, o = l.evt, d = Us(l, zs);
  Ma.pluginEvent.bind(he)(a, t, Ct({
    dragEl: oe,
    parentEl: je,
    ghostEl: ke,
    rootEl: Ne,
    nextEl: Jt,
    lastDownEl: Ya,
    cloneEl: Le,
    cloneHidden: Mt,
    dragStarted: wa,
    putSortable: Je,
    activeSortable: he.active,
    originalEvent: o,
    oldIndex: va,
    oldDraggableIndex: Da,
    newIndex: ct,
    newDraggableIndex: Nt,
    hideGhostForTarget: di,
    unhideGhostForTarget: ui,
    cloneNowHidden: function() {
      Mt = !0;
    },
    cloneNowShown: function() {
      Mt = !1;
    },
    dispatchSortableEvent: function(u) {
      tt({
        sortable: t,
        name: u,
        originalEvent: o
      });
    }
  }, d));
};
function tt(e) {
  js(Ct({
    putSortable: Je,
    cloneEl: Le,
    targetEl: oe,
    rootEl: Ne,
    oldIndex: va,
    oldDraggableIndex: Da,
    newIndex: ct,
    newDraggableIndex: Nt
  }, e));
}
var oe, je, ke, Ne, Jt, Ya, Le, Mt, va, ct, Da, Nt, Wa, Je, da = !1, tl = !1, al = [], Kt, kt, Il, Dl, So, To, wa, ra, Ua, Ea = !1, qa = !1, Xa, _e, Ul = [], Bl = !1, ll = [], cl = typeof document < "u", Ga = to, Io = Na || Pt ? "cssFloat" : "float", Ws = cl && !Qo && !to && "draggable" in document.createElement("div"), ni = (function() {
  if (cl) {
    if (Pt)
      return !1;
    var e = document.createElement("x");
    return e.style.cssText = "pointer-events:auto", e.style.pointerEvents === "auto";
  }
})(), si = function(a, t) {
  var l = be(a), o = parseInt(l.width) - parseInt(l.paddingLeft) - parseInt(l.paddingRight) - parseInt(l.borderLeftWidth) - parseInt(l.borderRightWidth), d = pa(a, 0, t), f = pa(a, 1, t), u = d && be(d), v = f && be(f), i = u && parseInt(u.marginLeft) + parseInt(u.marginRight) + qe(d).width, c = v && parseInt(v.marginLeft) + parseInt(v.marginRight) + qe(f).width;
  if (l.display === "flex")
    return l.flexDirection === "column" || l.flexDirection === "column-reverse" ? "vertical" : "horizontal";
  if (l.display === "grid")
    return l.gridTemplateColumns.split(" ").length <= 1 ? "vertical" : "horizontal";
  if (d && u.float && u.float !== "none") {
    var m = u.float === "left" ? "left" : "right";
    return f && (v.clear === "both" || v.clear === m) ? "vertical" : "horizontal";
  }
  return d && (u.display === "block" || u.display === "flex" || u.display === "table" || u.display === "grid" || i >= o && l[Io] === "none" || f && l[Io] === "none" && i + c > o) ? "vertical" : "horizontal";
}, qs = function(a, t, l) {
  var o = l ? a.left : a.top, d = l ? a.right : a.bottom, f = l ? a.width : a.height, u = l ? t.left : t.top, v = l ? t.right : t.bottom, i = l ? t.width : t.height;
  return o === u || d === v || o + f / 2 === u + i / 2;
}, Gs = function(a, t) {
  var l;
  return al.some(function(o) {
    var d = o[st].options.emptyInsertThreshold;
    if (!(!d || ao(o))) {
      var f = qe(o), u = a >= f.left - d && a <= f.right + d, v = t >= f.top - d && t <= f.bottom + d;
      if (u && v)
        return l = o;
    }
  }), l;
}, ri = function(a) {
  function t(d, f) {
    return function(u, v, i, c) {
      var m = u.options.group.name && v.options.group.name && u.options.group.name === v.options.group.name;
      if (d == null && (f || m))
        return !0;
      if (d == null || d === !1)
        return !1;
      if (f && d === "clone")
        return d;
      if (typeof d == "function")
        return t(d(u, v, i, c), f)(u, v, i, c);
      var $ = (f ? u : v).options.group.name;
      return d === !0 || typeof d == "string" && d === $ || d.join && d.indexOf($) > -1;
    };
  }
  var l = {}, o = a.group;
  (!o || Ll(o) != "object") && (o = {
    name: o
  }), l.name = o.name, l.checkPull = t(o.pull, !0), l.checkPut = t(o.put), l.revertClone = o.revertClone, a.group = l;
}, di = function() {
  !ni && ke && be(ke, "display", "none");
}, ui = function() {
  !ni && ke && be(ke, "display", "");
};
cl && !Qo && document.addEventListener("click", function(e) {
  if (tl)
    return e.preventDefault(), e.stopPropagation && e.stopPropagation(), e.stopImmediatePropagation && e.stopImmediatePropagation(), tl = !1, !1;
}, !0);
var Ht = function(a) {
  if (oe) {
    a = a.touches ? a.touches[0] : a;
    var t = Gs(a.clientX, a.clientY);
    if (t) {
      var l = {};
      for (var o in a)
        a.hasOwnProperty(o) && (l[o] = a[o]);
      l.target = l.rootEl = t, l.preventDefault = void 0, l.stopPropagation = void 0, t[st]._onDragOver(l);
    }
  }
}, Ks = function(a) {
  oe && oe.parentNode[st]._isOutsideThisEl(a.target);
};
function he(e, a) {
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
      return si(e, this.options);
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
    supportPointer: he.supportPointer !== !1 && "PointerEvent" in window && (!Ta || to),
    emptyInsertThreshold: 5
  };
  Ma.initializePlugins(this, e, t);
  for (var l in t)
    !(l in a) && (a[l] = t[l]);
  ri(a);
  for (var o in this)
    o.charAt(0) === "_" && typeof this[o] == "function" && (this[o] = this[o].bind(this));
  this.nativeDraggable = a.forceFallback ? !1 : Ws, this.nativeDraggable && (this.options.touchStartThreshold = 1), a.supportPointer ? Ie(e, "pointerdown", this._onTapStart) : (Ie(e, "mousedown", this._onTapStart), Ie(e, "touchstart", this._onTapStart)), this.nativeDraggable && (Ie(e, "dragover", this), Ie(e, "dragenter", this)), al.push(this.el), a.store && a.store.get && this.sort(a.store.get(this) || []), Et(this, Fs());
}
he.prototype = /** @lends Sortable.prototype */
{
  constructor: he,
  _isOutsideThisEl: function(a) {
    !this.el.contains(a) && a !== this.el && (ra = null);
  },
  _getDirection: function(a, t) {
    return typeof this.options.direction == "function" ? this.options.direction.call(this, a, t, oe) : this.options.direction;
  },
  _onTapStart: function(a) {
    if (a.cancelable) {
      var t = this, l = this.el, o = this.options, d = o.preventOnFilter, f = a.type, u = a.touches && a.touches[0] || a.pointerType && a.pointerType === "touch" && a, v = (u || a).target, i = a.target.shadowRoot && (a.path && a.path[0] || a.composedPath && a.composedPath()[0]) || v, c = o.filter;
      if (er(l), !oe && !(/mousedown|pointerdown/.test(f) && a.button !== 0 || o.disabled) && !i.isContentEditable && !(!this.nativeDraggable && Ta && v && v.tagName.toUpperCase() === "SELECT") && (v = wt(v, o.draggable, l, !1), !(v && v.animated) && Ya !== v)) {
        if (va = mt(v), Da = mt(v, o.draggable), typeof c == "function") {
          if (c.call(this, a, v, this)) {
            tt({
              sortable: t,
              rootEl: i,
              name: "filter",
              targetEl: v,
              toEl: l,
              fromEl: l
            }), nt("filter", t, {
              evt: a
            }), d && a.preventDefault();
            return;
          }
        } else if (c && (c = c.split(",").some(function(m) {
          if (m = wt(i, m.trim(), l, !1), m)
            return tt({
              sortable: t,
              rootEl: m,
              name: "filter",
              targetEl: v,
              fromEl: l,
              toEl: l
            }), nt("filter", t, {
              evt: a
            }), !0;
        }), c)) {
          d && a.preventDefault();
          return;
        }
        o.handle && !wt(i, o.handle, l, !1) || this._prepareDragStart(a, u, v);
      }
    }
  },
  _prepareDragStart: function(a, t, l) {
    var o = this, d = o.el, f = o.options, u = d.ownerDocument, v;
    if (l && !oe && l.parentNode === d) {
      var i = qe(l);
      if (Ne = d, oe = l, je = oe.parentNode, Jt = oe.nextSibling, Ya = l, Wa = f.group, he.dragged = oe, Kt = {
        target: oe,
        clientX: (t || a).clientX,
        clientY: (t || a).clientY
      }, So = Kt.clientX - i.left, To = Kt.clientY - i.top, this._lastX = (t || a).clientX, this._lastY = (t || a).clientY, oe.style["will-change"] = "all", v = function() {
        if (nt("delayEnded", o, {
          evt: a
        }), he.eventCanceled) {
          o._onDrop();
          return;
        }
        o._disableDelayedDragEvents(), !$o && o.nativeDraggable && (oe.draggable = !0), o._triggerDragStart(a, t), tt({
          sortable: o,
          name: "choose",
          originalEvent: a
        }), ut(oe, f.chosenClass, !0);
      }, f.ignore.split(",").forEach(function(c) {
        ti(oe, c.trim(), El);
      }), Ie(u, "dragover", Ht), Ie(u, "mousemove", Ht), Ie(u, "touchmove", Ht), f.supportPointer ? (Ie(u, "pointerup", o._onDrop), !this.nativeDraggable && Ie(u, "pointercancel", o._onDrop)) : (Ie(u, "mouseup", o._onDrop), Ie(u, "touchend", o._onDrop), Ie(u, "touchcancel", o._onDrop)), $o && this.nativeDraggable && (this.options.touchStartThreshold = 4, oe.draggable = !0), nt("delayStart", this, {
        evt: a
      }), f.delay && (!f.delayOnTouchOnly || t) && (!this.nativeDraggable || !(Na || Pt))) {
        if (he.eventCanceled) {
          this._onDrop();
          return;
        }
        f.supportPointer ? (Ie(u, "pointerup", o._disableDelayedDrag), Ie(u, "pointercancel", o._disableDelayedDrag)) : (Ie(u, "mouseup", o._disableDelayedDrag), Ie(u, "touchend", o._disableDelayedDrag), Ie(u, "touchcancel", o._disableDelayedDrag)), Ie(u, "mousemove", o._delayedDragTouchMoveHandler), Ie(u, "touchmove", o._delayedDragTouchMoveHandler), f.supportPointer && Ie(u, "pointermove", o._delayedDragTouchMoveHandler), o._dragStartTimer = setTimeout(v, f.delay);
      } else
        v();
    }
  },
  _delayedDragTouchMoveHandler: function(a) {
    var t = a.touches ? a.touches[0] : a;
    Math.max(Math.abs(t.clientX - this._lastX), Math.abs(t.clientY - this._lastY)) >= Math.floor(this.options.touchStartThreshold / (this.nativeDraggable && window.devicePixelRatio || 1)) && this._disableDelayedDrag();
  },
  _disableDelayedDrag: function() {
    oe && El(oe), clearTimeout(this._dragStartTimer), this._disableDelayedDragEvents();
  },
  _disableDelayedDragEvents: function() {
    var a = this.el.ownerDocument;
    Se(a, "mouseup", this._disableDelayedDrag), Se(a, "touchend", this._disableDelayedDrag), Se(a, "touchcancel", this._disableDelayedDrag), Se(a, "pointerup", this._disableDelayedDrag), Se(a, "pointercancel", this._disableDelayedDrag), Se(a, "mousemove", this._delayedDragTouchMoveHandler), Se(a, "touchmove", this._delayedDragTouchMoveHandler), Se(a, "pointermove", this._delayedDragTouchMoveHandler);
  },
  _triggerDragStart: function(a, t) {
    t = t || a.pointerType == "touch" && a, !this.nativeDraggable || t ? this.options.supportPointer ? Ie(document, "pointermove", this._onTouchMove) : t ? Ie(document, "touchmove", this._onTouchMove) : Ie(document, "mousemove", this._onTouchMove) : (Ie(oe, "dragend", this), Ie(Ne, "dragstart", this._onDragStart));
    try {
      document.selection ? Ja(function() {
        document.selection.empty();
      }) : window.getSelection().removeAllRanges();
    } catch {
    }
  },
  _dragStarted: function(a, t) {
    if (da = !1, Ne && oe) {
      nt("dragStarted", this, {
        evt: t
      }), this.nativeDraggable && Ie(document, "dragover", Ks);
      var l = this.options;
      !a && ut(oe, l.dragClass, !1), ut(oe, l.ghostClass, !0), he.active = this, a && this._appendGhost(), tt({
        sortable: this,
        name: "start",
        originalEvent: t
      });
    } else
      this._nulling();
  },
  _emulateDragOver: function() {
    if (kt) {
      this._lastX = kt.clientX, this._lastY = kt.clientY, di();
      for (var a = document.elementFromPoint(kt.clientX, kt.clientY), t = a; a && a.shadowRoot && (a = a.shadowRoot.elementFromPoint(kt.clientX, kt.clientY), a !== t); )
        t = a;
      if (oe.parentNode[st]._isOutsideThisEl(a), t)
        do {
          if (t[st]) {
            var l = void 0;
            if (l = t[st]._onDragOver({
              clientX: kt.clientX,
              clientY: kt.clientY,
              target: a,
              rootEl: t
            }), l && !this.options.dragoverBubble)
              break;
          }
          a = t;
        } while (t = ei(t));
      ui();
    }
  },
  _onTouchMove: function(a) {
    if (Kt) {
      var t = this.options, l = t.fallbackTolerance, o = t.fallbackOffset, d = a.touches ? a.touches[0] : a, f = ke && fa(ke, !0), u = ke && f && f.a, v = ke && f && f.d, i = Ga && _e && Co(_e), c = (d.clientX - Kt.clientX + o.x) / (u || 1) + (i ? i[0] - Ul[0] : 0) / (u || 1), m = (d.clientY - Kt.clientY + o.y) / (v || 1) + (i ? i[1] - Ul[1] : 0) / (v || 1);
      if (!he.active && !da) {
        if (l && Math.max(Math.abs(d.clientX - this._lastX), Math.abs(d.clientY - this._lastY)) < l)
          return;
        this._onDragStart(a, !0);
      }
      if (ke) {
        f ? (f.e += c - (Il || 0), f.f += m - (Dl || 0)) : f = {
          a: 1,
          b: 0,
          c: 0,
          d: 1,
          e: c,
          f: m
        };
        var $ = "matrix(".concat(f.a, ",").concat(f.b, ",").concat(f.c, ",").concat(f.d, ",").concat(f.e, ",").concat(f.f, ")");
        be(ke, "webkitTransform", $), be(ke, "mozTransform", $), be(ke, "msTransform", $), be(ke, "transform", $), Il = c, Dl = m, kt = d;
      }
      a.cancelable && a.preventDefault();
    }
  },
  _appendGhost: function() {
    if (!ke) {
      var a = this.options.fallbackOnBody ? document.body : Ne, t = qe(oe, !0, Ga, !0, a), l = this.options;
      if (Ga) {
        for (_e = a; be(_e, "position") === "static" && be(_e, "transform") === "none" && _e !== document; )
          _e = _e.parentNode;
        _e !== document.body && _e !== document.documentElement ? (_e === document && (_e = xt()), t.top += _e.scrollTop, t.left += _e.scrollLeft) : _e = xt(), Ul = Co(_e);
      }
      ke = oe.cloneNode(!0), ut(ke, l.ghostClass, !1), ut(ke, l.fallbackClass, !0), ut(ke, l.dragClass, !0), be(ke, "transition", ""), be(ke, "transform", ""), be(ke, "box-sizing", "border-box"), be(ke, "margin", 0), be(ke, "top", t.top), be(ke, "left", t.left), be(ke, "width", t.width), be(ke, "height", t.height), be(ke, "opacity", "0.8"), be(ke, "position", Ga ? "absolute" : "fixed"), be(ke, "zIndex", "100000"), be(ke, "pointerEvents", "none"), he.ghost = ke, a.appendChild(ke), be(ke, "transform-origin", So / parseInt(ke.style.width) * 100 + "% " + To / parseInt(ke.style.height) * 100 + "%");
    }
  },
  _onDragStart: function(a, t) {
    var l = this, o = a.dataTransfer, d = l.options;
    if (nt("dragStart", this, {
      evt: a
    }), he.eventCanceled) {
      this._onDrop();
      return;
    }
    nt("setupClone", this), he.eventCanceled || (Le = oi(oe), Le.removeAttribute("id"), Le.draggable = !1, Le.style["will-change"] = "", this._hideClone(), ut(Le, this.options.chosenClass, !1), he.clone = Le), l.cloneId = Ja(function() {
      nt("clone", l), !he.eventCanceled && (l.options.removeCloneOnHide || Ne.insertBefore(Le, oe), l._hideClone(), tt({
        sortable: l,
        name: "clone"
      }));
    }), !t && ut(oe, d.dragClass, !0), t ? (tl = !0, l._loopId = setInterval(l._emulateDragOver, 50)) : (Se(document, "mouseup", l._onDrop), Se(document, "touchend", l._onDrop), Se(document, "touchcancel", l._onDrop), o && (o.effectAllowed = "move", d.setData && d.setData.call(l, o, oe)), Ie(document, "drop", l), be(oe, "transform", "translateZ(0)")), da = !0, l._dragStartId = Ja(l._dragStarted.bind(l, t, a)), Ie(document, "selectstart", l), wa = !0, window.getSelection().removeAllRanges(), Ta && be(document.body, "user-select", "none");
  },
  // Returns true - if no further action is needed (either inserted or another condition)
  _onDragOver: function(a) {
    var t = this.el, l = a.target, o, d, f, u = this.options, v = u.group, i = he.active, c = Wa === v, m = u.sort, $ = Je || i, h, k = this, y = !1;
    if (Bl) return;
    function w(B, I) {
      nt(B, k, Ct({
        evt: a,
        isOwner: c,
        axis: h ? "vertical" : "horizontal",
        revert: f,
        dragRect: o,
        targetRect: d,
        canSort: m,
        fromSortable: $,
        target: l,
        completed: x,
        onMove: function(U, Q) {
          return Ka(Ne, t, oe, o, U, qe(U), a, Q);
        },
        changed: E
      }, I));
    }
    function V() {
      w("dragOverAnimationCapture"), k.captureAnimationState(), k !== $ && $.captureAnimationState();
    }
    function x(B) {
      return w("dragOverCompleted", {
        insertion: B
      }), B && (c ? i._hideClone() : i._showClone(k), k !== $ && (ut(oe, Je ? Je.options.ghostClass : i.options.ghostClass, !1), ut(oe, u.ghostClass, !0)), Je !== k && k !== he.active ? Je = k : k === he.active && Je && (Je = null), $ === k && (k._ignoreWhileAnimating = l), k.animateAll(function() {
        w("dragOverAnimationComplete"), k._ignoreWhileAnimating = null;
      }), k !== $ && ($.animateAll(), $._ignoreWhileAnimating = null)), (l === oe && !oe.animated || l === t && !l.animated) && (ra = null), !u.dragoverBubble && !a.rootEl && l !== document && (oe.parentNode[st]._isOutsideThisEl(a.target), !B && Ht(a)), !u.dragoverBubble && a.stopPropagation && a.stopPropagation(), y = !0;
    }
    function E() {
      ct = mt(oe), Nt = mt(oe, u.draggable), tt({
        sortable: k,
        name: "change",
        toEl: t,
        newIndex: ct,
        newDraggableIndex: Nt,
        originalEvent: a
      });
    }
    if (a.preventDefault !== void 0 && a.cancelable && a.preventDefault(), l = wt(l, u.draggable, t, !0), w("dragOver"), he.eventCanceled) return y;
    if (oe.contains(a.target) || l.animated && l.animatingX && l.animatingY || k._ignoreWhileAnimating === l)
      return x(!1);
    if (tl = !1, i && !u.disabled && (c ? m || (f = je !== Ne) : Je === this || (this.lastPutMode = Wa.checkPull(this, i, oe, a)) && v.checkPut(this, i, oe, a))) {
      if (h = this._getDirection(a, l) === "vertical", o = qe(oe), w("dragOverValid"), he.eventCanceled) return y;
      if (f)
        return je = Ne, V(), this._hideClone(), w("revert"), he.eventCanceled || (Jt ? Ne.insertBefore(oe, Jt) : Ne.appendChild(oe)), x(!0);
      var D = ao(t, u.draggable);
      if (!D || Js(a, h, this) && !D.animated) {
        if (D === oe)
          return x(!1);
        if (D && t === a.target && (l = D), l && (d = qe(l)), Ka(Ne, t, oe, o, l, d, a, !!l) !== !1)
          return V(), D && D.nextSibling ? t.insertBefore(oe, D.nextSibling) : t.appendChild(oe), je = t, E(), x(!0);
      } else if (D && Xs(a, h, this)) {
        var j = pa(t, 0, u, !0);
        if (j === oe)
          return x(!1);
        if (l = j, d = qe(l), Ka(Ne, t, oe, o, l, d, a, !1) !== !1)
          return V(), t.insertBefore(oe, j), je = t, E(), x(!0);
      } else if (l.parentNode === t) {
        d = qe(l);
        var ie = 0, L, re = oe.parentNode !== t, ue = !qs(oe.animated && oe.toRect || o, l.animated && l.toRect || d, h), me = h ? "top" : "left", ce = xo(l, "top", "top") || xo(oe, "top", "top"), ne = ce ? ce.scrollTop : void 0;
        ra !== l && (L = d[me], Ea = !1, qa = !ue && u.invertSwap || re), ie = Zs(a, l, d, h, ue ? 1 : u.swapThreshold, u.invertedSwapThreshold == null ? u.swapThreshold : u.invertedSwapThreshold, qa, ra === l);
        var P;
        if (ie !== 0) {
          var ae = mt(oe);
          do
            ae -= ie, P = je.children[ae];
          while (P && (be(P, "display") === "none" || P === ke));
        }
        if (ie === 0 || P === l)
          return x(!1);
        ra = l, Ua = ie;
        var z = l.nextElementSibling, ge = !1;
        ge = ie === 1;
        var Ve = Ka(Ne, t, oe, o, l, d, a, ge);
        if (Ve !== !1)
          return (Ve === 1 || Ve === -1) && (ge = Ve === 1), Bl = !0, setTimeout(Ys, 30), V(), ge && !z ? t.appendChild(oe) : l.parentNode.insertBefore(oe, ge ? z : l), ce && li(ce, 0, ne - ce.scrollTop), je = oe.parentNode, L !== void 0 && !qa && (Xa = Math.abs(L - qe(l)[me])), E(), x(!0);
      }
      if (t.contains(oe))
        return x(!1);
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
    if (ct = mt(oe), Nt = mt(oe, l.draggable), nt("drop", this, {
      evt: a
    }), je = oe && oe.parentNode, ct = mt(oe), Nt = mt(oe, l.draggable), he.eventCanceled) {
      this._nulling();
      return;
    }
    da = !1, qa = !1, Ea = !1, clearInterval(this._loopId), clearTimeout(this._dragStartTimer), jl(this.cloneId), jl(this._dragStartId), this.nativeDraggable && (Se(document, "drop", this), Se(t, "dragstart", this._onDragStart)), this._offMoveEvents(), this._offUpEvents(), Ta && be(document.body, "user-select", ""), be(oe, "transform", ""), a && (wa && (a.cancelable && a.preventDefault(), !l.dropBubble && a.stopPropagation()), ke && ke.parentNode && ke.parentNode.removeChild(ke), (Ne === je || Je && Je.lastPutMode !== "clone") && Le && Le.parentNode && Le.parentNode.removeChild(Le), oe && (this.nativeDraggable && Se(oe, "dragend", this), El(oe), oe.style["will-change"] = "", wa && !da && ut(oe, Je ? Je.options.ghostClass : this.options.ghostClass, !1), ut(oe, this.options.chosenClass, !1), tt({
      sortable: this,
      name: "unchoose",
      toEl: je,
      newIndex: null,
      newDraggableIndex: null,
      originalEvent: a
    }), Ne !== je ? (ct >= 0 && (tt({
      rootEl: je,
      name: "add",
      toEl: je,
      fromEl: Ne,
      originalEvent: a
    }), tt({
      sortable: this,
      name: "remove",
      toEl: je,
      originalEvent: a
    }), tt({
      rootEl: je,
      name: "sort",
      toEl: je,
      fromEl: Ne,
      originalEvent: a
    }), tt({
      sortable: this,
      name: "sort",
      toEl: je,
      originalEvent: a
    })), Je && Je.save()) : ct !== va && ct >= 0 && (tt({
      sortable: this,
      name: "update",
      toEl: je,
      originalEvent: a
    }), tt({
      sortable: this,
      name: "sort",
      toEl: je,
      originalEvent: a
    })), he.active && ((ct == null || ct === -1) && (ct = va, Nt = Da), tt({
      sortable: this,
      name: "end",
      toEl: je,
      originalEvent: a
    }), this.save()))), this._nulling();
  },
  _nulling: function() {
    nt("nulling", this), Ne = oe = je = ke = Jt = Le = Ya = Mt = Kt = kt = wa = ct = Nt = va = Da = ra = Ua = Je = Wa = he.dragged = he.ghost = he.clone = he.active = null;
    var a = this.el;
    ll.forEach(function(t) {
      a.contains(t) && (t.checked = !0);
    }), ll.length = Il = Dl = 0;
  },
  handleEvent: function(a) {
    switch (a.type) {
      case "drop":
      case "dragend":
        this._onDrop(a);
        break;
      case "dragenter":
      case "dragover":
        oe && (this._onDragOver(a), Hs(a));
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
    for (var a = [], t, l = this.el.children, o = 0, d = l.length, f = this.options; o < d; o++)
      t = l[o], wt(t, f.draggable, this.el, !1) && a.push(t.getAttribute(f.dataIdAttr) || _s(t));
    return a;
  },
  /**
   * Sorts the elements according to the array.
   * @param  {String[]}  order  order of the items
   */
  sort: function(a, t) {
    var l = {}, o = this.el;
    this.toArray().forEach(function(d, f) {
      var u = o.children[f];
      wt(u, this.options.draggable, o, !1) && (l[d] = u);
    }, this), t && this.captureAnimationState(), a.forEach(function(d) {
      l[d] && (o.removeChild(l[d]), o.appendChild(l[d]));
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
    return wt(a, t || this.options.draggable, this.el, !1);
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
    var o = Ma.modifyOption(this, a, t);
    typeof o < "u" ? l[a] = o : l[a] = t, a === "group" && ri(l);
  },
  /**
   * Destroy
   */
  destroy: function() {
    nt("destroy", this);
    var a = this.el;
    a[st] = null, Se(a, "mousedown", this._onTapStart), Se(a, "touchstart", this._onTapStart), Se(a, "pointerdown", this._onTapStart), this.nativeDraggable && (Se(a, "dragover", this), Se(a, "dragenter", this)), Array.prototype.forEach.call(a.querySelectorAll("[draggable]"), function(t) {
      t.removeAttribute("draggable");
    }), this._onDrop(), this._disableDelayedDragEvents(), al.splice(al.indexOf(this.el), 1), this.el = a = null;
  },
  _hideClone: function() {
    if (!Mt) {
      if (nt("hideClone", this), he.eventCanceled) return;
      be(Le, "display", "none"), this.options.removeCloneOnHide && Le.parentNode && Le.parentNode.removeChild(Le), Mt = !0;
    }
  },
  _showClone: function(a) {
    if (a.lastPutMode !== "clone") {
      this._hideClone();
      return;
    }
    if (Mt) {
      if (nt("showClone", this), he.eventCanceled) return;
      oe.parentNode == Ne && !this.options.group.revertClone ? Ne.insertBefore(Le, oe) : Jt ? Ne.insertBefore(Le, Jt) : Ne.appendChild(Le), this.options.group.revertClone && this.animate(oe, Le), be(Le, "display", ""), Mt = !1;
    }
  }
};
function Hs(e) {
  e.dataTransfer && (e.dataTransfer.dropEffect = "move"), e.cancelable && e.preventDefault();
}
function Ka(e, a, t, l, o, d, f, u) {
  var v, i = e[st], c = i.options.onMove, m;
  return window.CustomEvent && !Pt && !Na ? v = new CustomEvent("move", {
    bubbles: !0,
    cancelable: !0
  }) : (v = document.createEvent("Event"), v.initEvent("move", !0, !0)), v.to = a, v.from = e, v.dragged = t, v.draggedRect = l, v.related = o || a, v.relatedRect = d || qe(a), v.willInsertAfter = u, v.originalEvent = f, e.dispatchEvent(v), c && (m = c.call(i, v, f)), m;
}
function El(e) {
  e.draggable = !1;
}
function Ys() {
  Bl = !1;
}
function Xs(e, a, t) {
  var l = qe(pa(t.el, 0, t.options, !0)), o = ii(t.el, t.options, ke), d = 10;
  return a ? e.clientX < o.left - d || e.clientY < l.top && e.clientX < l.right : e.clientY < o.top - d || e.clientY < l.bottom && e.clientX < l.left;
}
function Js(e, a, t) {
  var l = qe(ao(t.el, t.options.draggable)), o = ii(t.el, t.options, ke), d = 10;
  return a ? e.clientX > o.right + d || e.clientY > l.bottom && e.clientX > l.left : e.clientY > o.bottom + d || e.clientX > l.right && e.clientY > l.top;
}
function Zs(e, a, t, l, o, d, f, u) {
  var v = l ? e.clientY : e.clientX, i = l ? t.height : t.width, c = l ? t.top : t.left, m = l ? t.bottom : t.right, $ = !1;
  if (!f) {
    if (u && Xa < i * o) {
      if (!Ea && (Ua === 1 ? v > c + i * d / 2 : v < m - i * d / 2) && (Ea = !0), Ea)
        $ = !0;
      else if (Ua === 1 ? v < c + Xa : v > m - Xa)
        return -Ua;
    } else if (v > c + i * (1 - o) / 2 && v < m - i * (1 - o) / 2)
      return Qs(a);
  }
  return $ = $ || f, $ && (v < c + i * d / 2 || v > m - i * d / 2) ? v > c + i / 2 ? 1 : -1 : 0;
}
function Qs(e) {
  return mt(oe) < mt(e) ? 1 : -1;
}
function _s(e) {
  for (var a = e.tagName + e.className + e.src + e.href + e.textContent, t = a.length, l = 0; t--; )
    l += a.charCodeAt(t);
  return l.toString(36);
}
function er(e) {
  ll.length = 0;
  for (var a = e.getElementsByTagName("input"), t = a.length; t--; ) {
    var l = a[t];
    l.checked && ll.push(l);
  }
}
function Ja(e) {
  return setTimeout(e, 0);
}
function jl(e) {
  return clearTimeout(e);
}
cl && Ie(document, "touchmove", function(e) {
  (he.active || da) && e.cancelable && e.preventDefault();
});
he.utils = {
  on: Ie,
  off: Se,
  css: be,
  find: ti,
  is: function(a, t) {
    return !!wt(a, t, a, !1);
  },
  extend: Ns,
  throttle: ai,
  closest: wt,
  toggleClass: ut,
  clone: oi,
  index: mt,
  nextTick: Ja,
  cancelNextTick: jl,
  detectDirection: si,
  getChild: pa,
  expando: st
};
he.get = function(e) {
  return e[st];
};
he.mount = function() {
  for (var e = arguments.length, a = new Array(e), t = 0; t < e; t++)
    a[t] = arguments[t];
  a[0].constructor === Array && (a = a[0]), a.forEach(function(l) {
    if (!l.prototype || !l.prototype.constructor)
      throw "Sortable: Mounted plugin must be a constructor function, not ".concat({}.toString.call(l));
    l.utils && (he.utils = Ct(Ct({}, he.utils), l.utils)), Ma.mount(l);
  });
};
he.create = function(e, a) {
  return new he(e, a);
};
he.version = Os;
var We = [], $a, zl, Wl = !1, Al, Pl, ol, Va;
function tr() {
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
      this.sortable.nativeDraggable ? Ie(document, "dragover", this._handleAutoScroll) : this.options.supportPointer ? Ie(document, "pointermove", this._handleFallbackAutoScroll) : l.touches ? Ie(document, "touchmove", this._handleFallbackAutoScroll) : Ie(document, "mousemove", this._handleFallbackAutoScroll);
    },
    dragOverCompleted: function(t) {
      var l = t.originalEvent;
      !this.options.dragOverBubble && !l.rootEl && this._handleAutoScroll(l);
    },
    drop: function() {
      this.sortable.nativeDraggable ? Se(document, "dragover", this._handleAutoScroll) : (Se(document, "pointermove", this._handleFallbackAutoScroll), Se(document, "touchmove", this._handleFallbackAutoScroll), Se(document, "mousemove", this._handleFallbackAutoScroll)), Do(), Za(), Ms();
    },
    nulling: function() {
      ol = zl = $a = Wl = Va = Al = Pl = null, We.length = 0;
    },
    _handleFallbackAutoScroll: function(t) {
      this._handleAutoScroll(t, !0);
    },
    _handleAutoScroll: function(t, l) {
      var o = this, d = (t.touches ? t.touches[0] : t).clientX, f = (t.touches ? t.touches[0] : t).clientY, u = document.elementFromPoint(d, f);
      if (ol = t, l || this.options.forceAutoScrollFallback || Na || Pt || Ta) {
        Ol(t, this.options, u, l);
        var v = Lt(u, !0);
        Wl && (!Va || d !== Al || f !== Pl) && (Va && Do(), Va = setInterval(function() {
          var i = Lt(document.elementFromPoint(d, f), !0);
          i !== v && (v = i, Za()), Ol(t, o.options, i, l);
        }, 10), Al = d, Pl = f);
      } else {
        if (!this.options.bubbleScroll || Lt(u, !0) === xt()) {
          Za();
          return;
        }
        Ol(t, this.options, Lt(u, !1), !1);
      }
    }
  }, Et(e, {
    pluginName: "scroll",
    initializeByDefault: !0
  });
}
function Za() {
  We.forEach(function(e) {
    clearInterval(e.pid);
  }), We = [];
}
function Do() {
  clearInterval(Va);
}
var Ol = ai(function(e, a, t, l) {
  if (a.scroll) {
    var o = (e.touches ? e.touches[0] : e).clientX, d = (e.touches ? e.touches[0] : e).clientY, f = a.scrollSensitivity, u = a.scrollSpeed, v = xt(), i = !1, c;
    zl !== t && (zl = t, Za(), $a = a.scroll, c = a.scrollFn, $a === !0 && ($a = Lt(t, !0)));
    var m = 0, $ = $a;
    do {
      var h = $, k = qe(h), y = k.top, w = k.bottom, V = k.left, x = k.right, E = k.width, D = k.height, j = void 0, ie = void 0, L = h.scrollWidth, re = h.scrollHeight, ue = be(h), me = h.scrollLeft, ce = h.scrollTop;
      h === v ? (j = E < L && (ue.overflowX === "auto" || ue.overflowX === "scroll" || ue.overflowX === "visible"), ie = D < re && (ue.overflowY === "auto" || ue.overflowY === "scroll" || ue.overflowY === "visible")) : (j = E < L && (ue.overflowX === "auto" || ue.overflowX === "scroll"), ie = D < re && (ue.overflowY === "auto" || ue.overflowY === "scroll"));
      var ne = j && (Math.abs(x - o) <= f && me + E < L) - (Math.abs(V - o) <= f && !!me), P = ie && (Math.abs(w - d) <= f && ce + D < re) - (Math.abs(y - d) <= f && !!ce);
      if (!We[m])
        for (var ae = 0; ae <= m; ae++)
          We[ae] || (We[ae] = {});
      (We[m].vx != ne || We[m].vy != P || We[m].el !== h) && (We[m].el = h, We[m].vx = ne, We[m].vy = P, clearInterval(We[m].pid), (ne != 0 || P != 0) && (i = !0, We[m].pid = setInterval(function() {
        l && this.layer === 0 && he.active._onTouchMove(ol);
        var z = We[this.layer].vy ? We[this.layer].vy * u : 0, ge = We[this.layer].vx ? We[this.layer].vx * u : 0;
        typeof c == "function" && c.call(he.dragged.parentNode[st], ge, z, e, ol, We[this.layer].el) !== "continue" || li(We[this.layer].el, ge, z);
      }.bind({
        layer: m
      }), 24))), m++;
    } while (a.bubbleScroll && $ !== v && ($ = Lt($, !1)));
    Wl = i;
  }
}, 30), ci = function(a) {
  var t = a.originalEvent, l = a.putSortable, o = a.dragEl, d = a.activeSortable, f = a.dispatchSortableEvent, u = a.hideGhostForTarget, v = a.unhideGhostForTarget;
  if (t) {
    var i = l || d;
    u();
    var c = t.changedTouches && t.changedTouches.length ? t.changedTouches[0] : t, m = document.elementFromPoint(c.clientX, c.clientY);
    v(), i && !i.el.contains(m) && (f("spill"), this.onSpill({
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
    var o = pa(this.sortable.el, this.startIndex, this.options);
    o ? this.sortable.el.insertBefore(t, o) : this.sortable.el.appendChild(t), this.sortable.animateAll(), l && l.animateAll();
  },
  drop: ci
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
  drop: ci
};
Et(oo, {
  pluginName: "removeOnSpill"
});
he.mount(new tr());
he.mount(oo, lo);
function ar(e, a) {
  const t = e.oldDraggableIndex ?? e.oldIndex;
  e.item.remove();
  const l = [...e.from.children].filter((o) => o.matches(a));
  e.from.insertBefore(e.item, l[t ?? l.length] ?? null);
}
function vi(e) {
  const a = /* @__PURE__ */ new Map();
  function t(l) {
    a.get(l)?.destroy(), a.delete(l);
  }
  return At(() => {
    for (const l of a.keys()) t(l);
  }), {
    mounted(l) {
      const o = l.querySelector(".work-field-builder") ?? l;
      a.set(l, new he(o, {
        draggable: ".work-reorder-entry",
        handle: ".work-reorder-handle",
        forceFallback: !0,
        fallbackOnBody: !1,
        ghostClass: "work-drag-ghost",
        onEnd(d) {
          const f = d.oldDraggableIndex, u = d.newDraggableIndex;
          ar(d, ".work-reorder-entry"), f !== void 0 && u !== void 0 && f !== u && e(f, u);
        }
      }));
    },
    unmounted: t
  };
}
const lr = { class: "work-stack work-tight work-option-builder" }, or = { class: "work-stack work-tight" }, ir = { class: "work-stack work-tight work-small" }, nr = { class: "work-stack work-tight work-small" }, sr = { class: "work-stack work-tight" }, rr = { class: "work-stack work-tight work-small" }, dr = { class: "work-row" }, ur = { class: "work-stack work-tight work-small" }, cr = { class: "work-row" }, vr = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, fr = { class: "work-add-option" }, mr = {
  key: 0,
  class: "work-muted work-small"
}, pr = /* @__PURE__ */ $e({
  __name: "OptionsEditor",
  props: {
    field: {}
  },
  emits: ["validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = "options:" + _t(), d = H(() => t.field.options ?? []), f = H(() => d.value.every((m, $) => !!m.id && d.value.findIndex((h) => h.id === m.id) === $));
    Te(f, (m) => l("validity", m, o), { immediate: !0 }), At(() => l("validity", !0, o));
    function u(m, $) {
      qo(d.value, m, $ - m), d.value.forEach((h, k) => h.order = k);
    }
    const v = vi(u), i = ["primary", "success", "info", "warn", "danger", "secondary"];
    function c() {
      let m = d.value.length + 1;
      for (; d.value.some(($) => $.id === `option_${m}`); ) m++;
      (t.field.options ??= []).push({ id: `option_${m}`, label: "New option", order: d.value.length });
    }
    return (m, $) => (n(), p("section", lr, [
      $[4] || ($[4] = s("header", { class: "work-row" }, [
        s("h4", null, "Options"),
        s("span", { class: "work-muted work-small" }, "Renaming a choice keeps it selected on existing items."),
        s("span", { class: "work-spacer" })
      ], -1)),
      Vt((n(), p("div", or, [
        (n(!0), p(te, null, de(d.value, (h, k) => (n(), p("div", {
          key: k,
          class: "work-option-row work-reorder-entry"
        }, [
          g(r(le), {
            type: "button",
            class: "work-icon-button work-reorder-handle",
            "aria-label": "Drag option; arrow keys reorder",
            onKeydown: [
              Ye(Me((y) => u(k, k - 1), ["prevent"]), ["up"]),
              Ye(Me((y) => u(k, k + 1), ["prevent"]), ["down"])
            ],
            severity: "secondary",
            text: "",
            size: "small"
          }, {
            default: Y(() => [
              g(r(ve), {
                icon: "tabler:grip-vertical",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["onKeydown"]),
          s("label", ir, [
            $[0] || ($[0] = G("Label", -1)),
            g(r(De), {
              modelValue: h.label,
              "onUpdate:modelValue": (y) => h.label = y,
              "aria-label": "Option label"
            }, null, 8, ["modelValue", "onUpdate:modelValue"])
          ]),
          g(Fe, {
            class: "work-disclosure",
            label: "Advanced"
          }, {
            default: Y(() => [
              s("label", nr, [
                $[1] || ($[1] = G("Integration identifier", -1)),
                g(r(De), {
                  modelValue: h.id,
                  "onUpdate:modelValue": (y) => h.id = y,
                  class: "work-option-code",
                  required: "",
                  "aria-label": "Option ID"
                }, null, 8, ["modelValue", "onUpdate:modelValue"])
              ])
            ]),
            _: 2
          }, 1024),
          s("div", sr, [
            s("label", rr, [
              $[2] || ($[2] = G("Color", -1)),
              s("span", dr, [
                s("span", {
                  class: $t(["work-color-swatch", "work-swatch-" + (h.color || "secondary")]),
                  "aria-hidden": "true"
                }, null, 2),
                g(r(fe), {
                  modelValue: h.color,
                  "onUpdate:modelValue": (y) => h.color = y,
                  "aria-label": "Option color",
                  appendTo: "self",
                  optionLabel: "label",
                  optionValue: "value",
                  optionDisabled: "disabled",
                  options: [{ label: "Default", value: void 0, disabled: !1 }, ...(i ?? []).map((y) => ({ label: y, value: y, disabled: !1 }))]
                }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
              ])
            ]),
            s("label", ur, [
              $[3] || ($[3] = G("Category", -1)),
              g(r(fe), {
                "model-value": h.category,
                "aria-label": "Option category",
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                showClear: "",
                options: ["triage", "backlog", ...r(Wo)].map((y) => ({ label: r(zt)(y), value: y })),
                "onUpdate:modelValue": (y) => h.category = y || void 0
              }, null, 8, ["model-value", "options", "onUpdate:modelValue"])
            ])
          ]),
          s("div", cr, [
            g(r(le), {
              "aria-label": "Option earlier",
              severity: "secondary",
              size: "small",
              disabled: k === 0,
              onClick: (y) => u(k, k - 1),
              text: ""
            }, {
              default: Y(() => [
                g(r(ve), {
                  icon: "tabler:arrow-up",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["disabled", "onClick"]),
            g(r(le), {
              "aria-label": "Option later",
              severity: "secondary",
              size: "small",
              disabled: k === d.value.length - 1,
              onClick: (y) => u(k, k + 1),
              text: ""
            }, {
              default: Y(() => [
                g(r(ve), {
                  icon: "tabler:arrow-down",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["disabled", "onClick"]),
            g(r(le), {
              label: "Remove",
              "aria-label": "Remove option",
              severity: "secondary",
              text: "",
              size: "small",
              onClick: (y) => d.value.splice(k, 1)
            }, {
              icon: Y(() => [
                g(r(ve), {
                  icon: "tabler:trash",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["onClick"])
          ])
        ]))), 128)),
        f.value ? S("", !0) : (n(), p("p", vr, "Each choice needs a unique integration identifier.")),
        s("div", fr, [
          g(r(le), {
            label: "Add option",
            severity: "secondary",
            size: "small",
            onClick: c,
            outlined: ""
          }, {
            icon: Y(() => [
              g(r(ve), {
                icon: "tabler:plus",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          })
        ])
      ])), [
        [r(v)]
      ]),
      d.value.length ? S("", !0) : (n(), p("p", mr, "Add the choices people can select for this field."))
    ]));
  }
}), br = {
  class: "work-stack",
  "aria-label": "Fields editor"
}, hr = { class: "work-form-actions work-wrap" }, gr = { class: "work-stack work-tight" }, yr = {
  key: 0,
  class: "work-settings-card work-muted"
}, kr = { class: "work-muted work-small" }, wr = {
  key: 0,
  class: "work-error work-small",
  role: "alert"
}, $r = { class: "work-settings-grid work-field-properties" }, Vr = { class: "work-stack work-tight" }, xr = { class: "work-stack work-tight" }, Cr = { class: "work-stack work-tight" }, Sr = {
  key: 1,
  class: "work-stack work-tight"
}, Tr = {
  key: 4,
  class: "work-stack work-tight"
}, Ir = {
  key: 5,
  class: "work-stack work-tight"
}, Dr = { class: "work-stack work-tight" }, Ur = { class: "work-stack work-tight" }, Er = { class: "work-stack work-tight" }, Ar = { class: "work-stack work-tight" }, Pr = { class: "work-stack" }, Or = { class: "work-stack work-tight" }, Rr = { class: "work-stack work-tight" }, Nr = { class: "work-stack work-tight work-field-history" }, Mr = { class: "work-settings-list" }, Fr = { class: "work-settings-row" }, Lr = { class: "work-settings-row" }, Br = { class: "work-stack" }, jr = /* @__PURE__ */ $e({
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
    const t = e, l = a, o = H(() => t.draft.fields ?? []), d = q("text"), f = q([]), u = H(() => (t.draft.item_types ?? []).map((I) => ({ value: I.id, label: I.title || Pe(I.id) }))), v = H(() => t.draft.item_types?.find((I) => I.id === t.itemType)), i = H(() => o.value.map((I, C) => ({ field: I, index: C })).filter(({ field: I }) => !v.value || v.value.fields.includes(I.code))), c = q(""), m = q({}), $ = vi((I, C) => {
      const U = i.value[I]?.index, Q = i.value[C]?.index;
      U !== void 0 && Q !== void 0 && ae(U, Q - U);
    });
    function h(I) {
      return (t.draft.item_types ?? []).filter((C) => C.fields.includes(I)).map((C) => C.title || Pe(C.id));
    }
    async function k(I) {
      if (!c.value) {
        c.value = I.code;
        try {
          const C = await t.guardRemoval?.("fields", I.code);
          m.value[I.code] = C ?? "", C || Ra(t.draft, "fields", I.code);
        } finally {
          c.value = "";
        }
      }
    }
    const y = Object.entries({ text: "Text", int: "Whole number", dec: "Decimal number", quantity: "Measurement", bool: "Yes or no", time: "Date or time", ref: "Reference", record: "Structured data", option: "Choice", principal: "Person or group", item: "Work item", rank: "Order", rich_text: "Formatted text", formula: "Formula", rollup: "Related item calculation", counter: "Counter" }).map(([I, C]) => ({ value: I, label: C })), w = [{ label: "None", value: "none" }, { label: "Exact matches", value: "key" }, { label: "Numeric ranges", value: "number" }], V = ["int", "dec", "quantity"], x = H(() => new Map(t.installedTypes?.map((I) => [I.id, I]))), E = H(() => [...y, ...(t.installedTypes ?? []).map((I) => ({ value: I.id, label: I.title }))]), D = {};
    function j(I) {
      return I.type && I.type !== "value" ? I.type : I.form ?? "text";
    }
    function ie(I) {
      return I.type ? x.value.get(I.type) : void 0;
    }
    function L(I) {
      const C = ie(I)?.config_schema;
      return C && Jl(C).length ? C : void 0;
    }
    function re(I) {
      const C = ie(I);
      return !!C?.config_schema || ["dec", "quantity", "ref", "time", "record"].includes(C?.form ?? I.form ?? "") || !!I.config;
    }
    function ue(I) {
      const C = ie(I), U = C?.form ?? I.form ?? "text";
      return w.filter(({ value: Q }) => Q === "none" || (!C?.indexes || C.indexes.includes(Q)) && U !== "record" && (Q !== "number" || V.includes(U) || I.type === "option"));
    }
    function me(I) {
      I.index && !ue(I).some((C) => C.value === I.index) && delete I.index;
    }
    function ce(I, C) {
      const U = x.value.get(C);
      if (U) {
        if (U.id === I.type) return;
        I.type = U.id, I.form = U.form, delete I.options, delete I.config, me(I);
        return;
      }
      ie(I) && delete I.config;
      const Q = { option: "text", principal: "ref", item: "ref", rank: "text", rich_text: "text", formula: "int", rollup: "int", counter: "int" };
      Q[C] ? (I.type = C, I.form = Q[C]) : (delete I.type, I.form = C), C !== "option" ? delete I.options : I.options ??= [], C === "rich_text" && (I.config = { format: "json" }), me(I);
    }
    function ne(I, C) {
      I.form = C, me(I);
    }
    function P(I, C) {
      const U = { ...I.config };
      C ? U.item_type = C : delete U.item_type, I.config = Object.keys(U).length ? U : void 0;
    }
    function ae(I, C) {
      qo(o.value, I, C);
      for (const U of t.draft.item_types ?? []) {
        const Q = new Set(U.fields);
        U.fields = o.value.filter((b) => Q.has(b.code)).map((b) => b.code);
      }
    }
    function z(I, C) {
      try {
        zi(t.draft, I, C.value), delete m.value[I.code];
      } catch (U) {
        m.value[I.code] = U.message, C.value = I.code;
      }
    }
    function ge() {
      d.value = "text", f.value = v.value ? [v.value.id] : [];
    }
    function Ve(I) {
      const C = I.normalize("NFKD").replace(/\p{Mark}/gu, "").toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, ""), U = (/^[a-z]/.test(C) ? C : `field_${C || "new"}`).slice(0, 40);
      let Q = U, b = 2;
      for (; o.value.some((Z) => Z.code === Q); ) {
        const Z = "_" + b++;
        Q = U.slice(0, 40 - Z.length) + Z;
      }
      const A = { code: Q, title: I, form: "text", cardinality: "one" };
      ce(A, d.value), (t.draft.fields ??= []).push(A);
      for (const Z of t.draft.item_types ?? []) f.value.includes(Z.id) && Z.fields.push(Q);
      v.value && !f.value.includes(v.value.id) && l("update:itemType", ""), B.value = Q, l("created");
    }
    const B = q("");
    return (I, C) => (n(), p("section", br, [
      s("div", hr, [
        g(r(fe), {
          "model-value": v.value?.id ?? "",
          "aria-label": "Filter fields by item type",
          placeholder: "All item types",
          appendTo: "self",
          optionLabel: "label",
          optionValue: "value",
          options: [{ value: "", label: "All item types" }, ...u.value],
          "onUpdate:modelValue": C[0] || (C[0] = (U) => l("update:itemType", U))
        }, null, 8, ["model-value", "options"]),
        g(Aa, {
          action: "Add field",
          label: "Field name",
          maxlength: 255,
          regular: "",
          "open-on-entry": e.createForItemType,
          onOpen: ge,
          onAdd: Ve,
          onCancel: C[3] || (C[3] = (U) => l("cancel-creation"))
        }, {
          default: Y(() => [
            s("label", gr, [
              C[5] || (C[5] = G("Kind", -1)),
              g(r(fe), {
                modelValue: d.value,
                "onUpdate:modelValue": C[1] || (C[1] = (U) => d.value = U),
                "aria-label": "New field kind",
                appendTo: "self",
                options: E.value,
                optionLabel: "label",
                optionValue: "value"
              }, null, 8, ["modelValue", "options"])
            ]),
            u.value.length ? (n(), J(bt, {
              key: 0,
              label: "Show on item types",
              options: u.value,
              modelValue: f.value,
              "onUpdate:modelValue": C[2] || (C[2] = (U) => f.value = U)
            }, null, 8, ["options", "modelValue"])) : S("", !0)
          ]),
          _: 1
        }, 8, ["open-on-entry"])
      ]),
      i.value.length ? S("", !0) : (n(), p("p", yr, "No fields here yet. Add a field to capture information.")),
      Vt((n(), J(ul, {
        columns: "fields",
        count: i.value.length
      }, {
        default: Y(() => [
          (n(!0), p(te, null, de(i.value, ({ field: U, index: Q }) => (n(), J(dl, {
            "route-section": "fields",
            "route-id": U.code,
            title: r(Ze)(U),
            "initial-open": B.value === U.code,
            kind: ie(U)?.title || r(y).find((b) => b.value === j(U))?.label || r(Pe)(j(U)),
            key: U.id ?? Q,
            class: "work-field-row work-reorder-entry work-stack"
          }, {
            handle: Y(() => [
              g(r(le), {
                type: "button",
                class: "work-reorder-handle work-icon-button",
                "aria-label": "Drag " + r(Ze)(U) + " or use the arrow keys to reorder",
                onKeydown: [
                  Ye(Me((b) => ae(Q, -1), ["prevent"]), ["up"]),
                  Ye(Me((b) => ae(Q, 1), ["prevent"]), ["down"])
                ],
                severity: "secondary",
                text: "",
                size: "small"
              }, {
                default: Y(() => [
                  g(r(ve), {
                    icon: "tabler:grip-vertical",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["aria-label", "onKeydown"])
            ]),
            flags: Y(() => [
              U.track ? (n(), J(r(dt), {
                key: 0,
                class: "kx-tag-sm",
                severity: "secondary",
                value: "Tracked"
              })) : S("", !0),
              U.intervals ? (n(), J(r(dt), {
                key: 1,
                class: "kx-tag-sm",
                severity: "secondary",
                value: "Intervals"
              })) : S("", !0)
            ]),
            usage: Y(() => [
              s("span", kr, T(h(U.code).length ? h(U.code).join(", ") : "Unused"), 1)
            ]),
            actions: Y(() => [
              g(r(le), {
                "aria-label": "Move " + r(Ze)(U) + " earlier",
                severity: "secondary",
                disabled: Q === 0,
                onClick: (b) => ae(Q, -1),
                text: "",
                size: "small"
              }, {
                default: Y(() => [
                  g(r(ve), {
                    icon: "tabler:arrow-up",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["aria-label", "disabled", "onClick"]),
              g(r(le), {
                "aria-label": "Move " + r(Ze)(U) + " later",
                severity: "secondary",
                disabled: Q === o.value.length - 1,
                onClick: (b) => ae(Q, 1),
                text: "",
                size: "small"
              }, {
                default: Y(() => [
                  g(r(ve), {
                    icon: "tabler:arrow-down",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["aria-label", "disabled", "onClick"])
            ]),
            default: Y(() => [
              m.value[U.code] ? (n(), p("p", wr, T(m.value[U.code]), 1)) : S("", !0),
              (n(!0), p(te, null, de(e.issues?.filter((b) => b.code === U.code) ?? [], (b) => (n(), p("p", {
                key: b.what,
                class: "work-error work-small",
                role: "alert"
              }, T(r(sl)(b)), 1))), 128)),
              s("div", $r, [
                s("label", Vr, [
                  C[6] || (C[6] = G("Title", -1)),
                  g(r(De), {
                    modelValue: U.title,
                    "onUpdate:modelValue": (b) => U.title = b,
                    "aria-label": "Field title",
                    maxlength: "255",
                    placeholder: r(Ze)(U)
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder"])
                ]),
                s("label", xr, [
                  C[7] || (C[7] = G("Kind", -1)),
                  g(r(fe), {
                    "aria-label": "Kind",
                    "model-value": j(U),
                    "onUpdate:modelValue": (b) => ce(U, b),
                    appendTo: "self",
                    options: E.value,
                    optionLabel: "label",
                    optionValue: "value"
                  }, null, 8, ["model-value", "onUpdate:modelValue", "options"])
                ]),
                s("label", Cr, [
                  C[8] || (C[8] = G("Values allowed", -1)),
                  g(r(fe), {
                    "aria-label": "Values allowed",
                    "model-value": U.cardinality ?? "one",
                    "onUpdate:modelValue": (b) => U.cardinality = b,
                    appendTo: "self",
                    options: [{ label: "One value", value: "one" }, { label: "Multiple unique values", value: "set" }, { label: "Ordered values", value: "list" }],
                    optionLabel: "label",
                    optionValue: "value"
                  }, null, 8, ["model-value", "onUpdate:modelValue"])
                ])
              ]),
              U.type === "item" ? (n(), p("label", Sr, [
                C[9] || (C[9] = G("Which items can be referenced? ", -1)),
                g(r(fe), {
                  "model-value": U.config?.item_type ?? "",
                  "aria-label": "Reference target",
                  appendTo: "self",
                  optionLabel: "label",
                  optionValue: "value",
                  options: [{ value: "", label: "Any item type" }, ...u.value],
                  "onUpdate:modelValue": (b) => P(U, b)
                }, null, 8, ["model-value", "options", "onUpdate:modelValue"]),
                C[10] || (C[10] = s("span", { class: "work-muted work-small" }, "A reference stores the selected item as a value. To show a named relationship on both items, use Links.", -1))
              ])) : S("", !0),
              L(U) ? (n(), J(Go, {
                key: U.type,
                schema: L(U),
                "model-value": U.config ?? D,
                "onUpdate:modelValue": (b) => U.config = b,
                onValidity: (b) => l("validity", "config-" + Q, b)
              }, null, 8, ["schema", "model-value", "onUpdate:modelValue", "onValidity"])) : S("", !0),
              U.type === "option" ? (n(), J(pr, {
                key: 3,
                field: U,
                onValidity: C[4] || (C[4] = (b, A) => l("validity", A, b))
              }, null, 8, ["field"])) : S("", !0),
              U.type === "formula" || U.type === "rollup" ? (n(), p("label", Tr, [
                C[11] || (C[11] = G("Result type", -1)),
                g(r(fe), {
                  "model-value": U.form,
                  "onUpdate:modelValue": (b) => ne(U, b),
                  "aria-label": "Result type",
                  options: r(y).slice(0, 8),
                  optionLabel: "label",
                  optionValue: "value",
                  appendTo: "self"
                }, null, 8, ["model-value", "onUpdate:modelValue", "options"])
              ])) : S("", !0),
              U.type === "formula" ? (n(), p("label", Ir, [
                C[12] || (C[12] = G("Expression", -1)),
                g(r(De), {
                  modelValue: U.expression,
                  "onUpdate:modelValue": (b) => U.expression = b,
                  "aria-label": "Expression"
                }, null, 8, ["modelValue", "onUpdate:modelValue"])
              ])) : S("", !0),
              U.type === "rollup" ? (n(), p(te, { key: 6 }, [
                s("label", Dr, [
                  C[13] || (C[13] = G("Of", -1)),
                  g(r(De), {
                    modelValue: U.of,
                    "onUpdate:modelValue": (b) => U.of = b,
                    "aria-label": "Related items"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                s("label", Ur, [
                  C[14] || (C[14] = G("Function", -1)),
                  g(r(De), {
                    modelValue: U.fn,
                    "onUpdate:modelValue": (b) => U.fn = b,
                    "aria-label": "Calculation"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                s("label", Er, [
                  C[15] || (C[15] = G("Field", -1)),
                  g(r(De), {
                    modelValue: U.field,
                    "onUpdate:modelValue": (b) => U.field = b,
                    "aria-label": "Calculated field"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                s("label", Ar, [
                  C[16] || (C[16] = G("Order by", -1)),
                  g(r(fe), {
                    "model-value": U.by,
                    "aria-label": "Rollup order",
                    options: ["rank", "time"],
                    showClear: "",
                    appendTo: "self",
                    "onUpdate:modelValue": (b) => U.by = b || void 0
                  }, null, 8, ["model-value", "onUpdate:modelValue"])
                ]),
                g(_l, {
                  modelValue: U.where,
                  "onUpdate:modelValue": (b) => U.where = b,
                  draft: e.draft,
                  "board-id": e.boardId,
                  label: "Include related items when",
                  onValidity: (b) => l("validity", "rollup-" + Q, b)
                }, null, 8, ["modelValue", "onUpdate:modelValue", "draft", "board-id", "onValidity"])
              ], 64)) : S("", !0),
              g(Fe, {
                class: "work-disclosure",
                label: "Advanced field settings"
              }, {
                default: Y(() => [
                  s("div", Pr, [
                    s("label", Or, [
                      C[17] || (C[17] = G("Field identifier for integrations", -1)),
                      g(r(De), {
                        value: U.code,
                        "aria-label": "Field code",
                        required: "",
                        pattern: "[a-z][a-z0-9_]*",
                        onInput: (b) => z(U, b.target)
                      }, null, 8, ["value", "onInput"])
                    ]),
                    s("label", Rr, [
                      C[18] || (C[18] = G("Allow filters to use", -1)),
                      g(r(fe), {
                        "aria-label": "Allow filters to use",
                        "model-value": U.index ?? "none",
                        "onUpdate:modelValue": (b) => U.index = b,
                        appendTo: "self",
                        options: ue(U),
                        optionLabel: "label",
                        optionValue: "value"
                      }, null, 8, ["model-value", "onUpdate:modelValue", "options"])
                    ]),
                    s("section", Nr, [
                      C[21] || (C[21] = s("h4", { class: "work-group-title" }, "History", -1)),
                      s("div", Mr, [
                        s("div", Fr, [
                          C[19] || (C[19] = s("div", { class: "work-row-main" }, [
                            s("strong", null, "Track changes"),
                            s("p", { class: "work-muted work-small" }, "Record each value change in the item history.")
                          ], -1)),
                          g(r(rt), {
                            modelValue: U.track,
                            "onUpdate:modelValue": (b) => U.track = b,
                            "aria-label": "Track changes"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        s("div", Lr, [
                          C[20] || (C[20] = s("div", { class: "work-row-main" }, [
                            s("strong", null, "Track intervals"),
                            s("p", { class: "work-muted work-small" }, "Measure how long each value stays in effect.")
                          ], -1)),
                          g(r(rt), {
                            modelValue: U.intervals,
                            "onUpdate:modelValue": (b) => U.intervals = b,
                            "aria-label": "Track intervals"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ])
                      ])
                    ]),
                    !L(U) && re(U) ? (n(), J(jt, {
                      key: 0,
                      label: "Field configuration",
                      "model-value": U.config,
                      shape: "object",
                      "onUpdate:modelValue": (b) => U.config = b,
                      onValidity: (b) => l("validity", "config-" + Q, b)
                    }, null, 8, ["model-value", "onUpdate:modelValue", "onValidity"])) : S("", !0),
                    s("section", Br, [
                      C[22] || (C[22] = s("h4", { class: "work-group-title" }, "Access", -1)),
                      (n(), p(te, null, de(["read", "write"], (b) => g(Zo, {
                        "board-id": e.boardId,
                        key: b,
                        label: b === "read" ? "Who can read" : "Who can edit",
                        "model-value": U.access?.[b],
                        "onUpdate:modelValue": (A) => U.access = { ...U.access, [b]: A },
                        onValidity: (A) => l("validity", "access-" + Q + b, A)
                      }, null, 8, ["board-id", "label", "model-value", "onUpdate:modelValue", "onValidity"])), 64))
                    ]),
                    g(r(le), {
                      label: "Remove field",
                      severity: "danger",
                      text: "",
                      disabled: !!c.value,
                      onClick: (b) => k(U)
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
        [r($)]
      ])
    ]));
  }
}), zr = {
  class: "work-stack",
  "aria-label": "Item types editor"
}, Wr = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, qr = { class: "work-definition-meta" }, Gr = { class: "work-settings-grid" }, Kr = { class: "work-stack work-tight" }, Hr = { class: "work-stack work-tight" }, Yr = {
  key: 0,
  class: "work-stack work-tight"
}, Xr = { key: 1 }, Jr = { class: "work-stack work-tight" }, Zr = { class: "work-stack" }, Qr = { class: "work-stack work-tight" }, _r = {
  key: 0,
  class: "work-row work-wrap"
}, ed = { class: "work-stack work-tight" }, td = {
  key: 1,
  class: "work-stack work-tight work-small"
}, ad = {
  key: 0,
  class: "kx-empty"
}, ld = /* @__PURE__ */ $e({
  __name: "TypesEditor",
  props: {
    draft: {},
    guardRemoval: { type: Function },
    issues: {}
  },
  emits: ["create-field", "create-workflow"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = H(() => t.draft.item_types ?? []), d = q(""), f = q(""), u = q("");
    function v(w) {
      const V = w.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, ""), x = /^[a-z]/.test(V) ? V : "type_" + (V || "new");
      let E = x.slice(0, 40), D = 2;
      for (; o.value.some((j) => j.id === E); ) {
        const j = "_" + D++;
        E = x.slice(0, 40 - j.length) + j;
      }
      return E;
    }
    function i(w) {
      const V = v(w);
      (t.draft.item_types ??= []).push({ id: V, title: w, process: t.draft.processes?.[0]?.id ?? "", fields: [] }), d.value = V;
    }
    function c(w, V) {
      const x = w.id;
      w.id = V;
      for (const E of o.value) E.parent_types && (E.parent_types = E.parent_types.map((D) => D === x ? V : D));
    }
    function m(w, V) {
      w.fields = V, w.inherit && (w.inherit = w.inherit.filter((x) => V.includes(x)));
    }
    function $(w) {
      return (w.parent_types ?? []).filter((V) => typeof V == "string");
    }
    function h(w, V, x) {
      w.parent_types = x && V.length ? [...V, !1] : V;
    }
    function k(w) {
      return o.value.filter((V) => V.id !== w.id && V.parent_types?.includes(w.id)).map((V) => V.title || Pe(V.id));
    }
    async function y(w) {
      if (!u.value) {
        if (k(w).length) {
          f.value = `${w.title || Pe(w.id)} is a parent type for ${k(w).join(", ")}. Remove those parent selections first.`;
          return;
        }
        u.value = w.id, f.value = "";
        try {
          const V = await t.guardRemoval?.("item_types", w.id);
          V ? f.value = V : Ra(t.draft, "item_types", w.id);
        } finally {
          u.value = "";
        }
      }
    }
    return (w, V) => (n(), p("section", zr, [
      f.value ? (n(), p("p", Wr, T(f.value), 1)) : S("", !0),
      g(ul, {
        columns: "types",
        count: o.value.length
      }, {
        default: Y(() => [
          (n(!0), p(te, null, de(o.value, (x, E) => (n(), J(dl, {
            "route-section": "items",
            "route-id": x.id,
            "initial-open": d.value === x.id,
            title: x.title || r(Pe)(x.id),
            "kind-label": "Workflow",
            kind: e.draft.processes?.find((D) => D.id === x.process)?.name || r(Pe)(x.process),
            key: E,
            class: "work-type-card"
          }, {
            usage: Y(() => [
              s("span", qr, [
                g(r(dt), {
                  class: "kx-tag-sm",
                  severity: "secondary"
                }, {
                  default: Y(() => [
                    G(T(x.fields.length) + " " + T(x.fields.length === 1 ? "field" : "fields"), 1)
                  ]),
                  _: 2
                }, 1024),
                k(x).length ? (n(), J(r(dt), {
                  key: 0,
                  class: "kx-tag-sm",
                  severity: "secondary"
                }, {
                  default: Y(() => [
                    G("Parent of " + T(k(x).join(", ")), 1)
                  ]),
                  _: 2
                }, 1024)) : S("", !0)
              ])
            ]),
            default: Y(() => [
              (n(!0), p(te, null, de(e.issues?.filter((D) => D.code === "item_type " + x.id) ?? [], (D) => (n(), p("p", {
                key: D.what,
                class: "work-error work-small",
                role: "alert"
              }, T(r(sl)(D)), 1))), 128)),
              s("div", Gr, [
                s("label", Kr, [
                  V[0] || (V[0] = G("Title", -1)),
                  g(r(De), {
                    modelValue: x.title,
                    "onUpdate:modelValue": (D) => x.title = D,
                    placeholder: r(Pe)(x.id)
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder"])
                ]),
                s("div", Hr, [
                  e.draft.processes?.length ? (n(), p("label", Yr, [
                    V[1] || (V[1] = G(" Workflow ", -1)),
                    g(r(fe), {
                      modelValue: x.process,
                      "onUpdate:modelValue": (D) => x.process = D,
                      "aria-label": "Workflow",
                      required: "",
                      appendTo: "self",
                      optionLabel: "label",
                      optionValue: "value",
                      options: e.draft.processes.map((D) => ({ label: D.name || r(Pe)(D.id), value: D.id }))
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                  ])) : (n(), p("span", Xr, "Workflow")),
                  s("div", null, [
                    g(r(le), {
                      label: "Create a workflow",
                      type: "button",
                      text: "",
                      size: "small",
                      onClick: (D) => l("create-workflow", x, D)
                    }, null, 8, ["onClick"])
                  ])
                ])
              ]),
              s("div", Jr, [
                g(bt, {
                  label: "Fields",
                  options: (e.draft.fields ?? []).map((D) => ({ value: D.code, label: r(Ze)(D) })),
                  "model-value": x.fields,
                  "onUpdate:modelValue": (D) => m(x, D)
                }, null, 8, ["options", "model-value", "onUpdate:modelValue"]),
                s("div", null, [
                  g(r(le), {
                    label: "Create a field",
                    type: "button",
                    text: "",
                    size: "small",
                    onClick: (D) => l("create-field", x, D)
                  }, null, 8, ["onClick"])
                ])
              ]),
              g(Fe, {
                class: "work-disclosure",
                label: "Advanced item type settings"
              }, {
                default: Y(() => [
                  s("div", Zr, [
                    s("label", Qr, [
                      V[2] || (V[2] = G("Identifier", -1)),
                      g(r(De), {
                        value: x.id,
                        onChange: (D) => c(x, D.target.value),
                        required: "",
                        pattern: "[a-z][a-z0-9_]*"
                      }, null, 8, ["value", "onChange"])
                    ]),
                    V[6] || (V[6] = G()),
                    g(bt, {
                      label: "Parent types",
                      options: o.value.map((D) => ({ value: D.id, label: D.title || r(Pe)(D.id) })),
                      "model-value": $(x),
                      "onUpdate:modelValue": (D) => h(x, D, !!x.parent_types?.includes(!1))
                    }, null, 8, ["options", "model-value", "onUpdate:modelValue"]),
                    $(x).length ? (n(), p("label", _r, [
                      g(r(rt), {
                        "model-value": !!x.parent_types?.includes(!1),
                        "aria-label": "Allow top-level items",
                        "onUpdate:modelValue": (D) => h(x, $(x), D)
                      }, null, 8, ["model-value", "onUpdate:modelValue"]),
                      V[3] || (V[3] = G("Allow top-level items", -1))
                    ])) : S("", !0),
                    s("div", ed, [
                      g(bt, {
                        label: "Inherit from parent",
                        options: x.fields.map((D) => ({ value: D, label: r(Ze)(e.draft.fields?.find((j) => j.code === D) ?? { code: D }) })),
                        modelValue: x.inherit,
                        "onUpdate:modelValue": (D) => x.inherit = D
                      }, null, 8, ["options", "modelValue", "onUpdate:modelValue"]),
                      V[4] || (V[4] = s("p", { class: "work-muted work-small" }, "These fields resolve from the parent when this item has no own value.", -1))
                    ]),
                    $(x).length ? (n(), p("label", td, [
                      V[5] || (V[5] = G("When the parent moves", -1)),
                      g(r(fe), {
                        modelValue: x.move_children,
                        "onUpdate:modelValue": (D) => x.move_children = D,
                        "aria-label": "When the parent moves",
                        appendTo: "self",
                        optionLabel: "label",
                        optionValue: "value",
                        optionDisabled: "disabled",
                        options: [{ label: "Default", value: void 0, disabled: !1 }, { label: "Move children", value: "move", disabled: !1 }, { label: "Refuse while children exist", value: "refuse", disabled: !1 }]
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ])) : S("", !0),
                    g(r(le), {
                      label: "Remove type",
                      severity: "danger",
                      text: "",
                      disabled: !!u.value,
                      onClick: (D) => y(x)
                    }, null, 8, ["disabled", "onClick"])
                  ])
                ]),
                _: 2
              }, 1024)
            ]),
            _: 2
          }, 1032, ["route-id", "initial-open", "title", "kind"]))), 128)),
          o.value.length ? S("", !0) : (n(), p("p", ad, "Add a type for the work people create, such as a delivery task or customer request.")),
          g(Aa, {
            action: "Add item type",
            label: "Item type name",
            onAdd: i
          })
        ]),
        _: 1
      }, 8, ["count"])
    ]));
  }
}), od = ".work-process-canvas>svg{height:480px;width:100%}.work-process-canvas:focus-visible{outline:var(--p-focus-ring-width) var(--p-focus-ring-style) var(--p-focus-ring-color);outline-offset:var(--p-focus-ring-offset)}.work-state-card{fill:var(--p-content-background);stroke:var(--p-content-border-color);stroke-width:1.5}.work-graph-node.work-selected .work-state-card{stroke:var(--p-primary-color);stroke-width:2.5;fill:color-mix(in srgb,var(--p-primary-color) 6%,var(--p-content-background))}.work-graph-node:focus-visible .work-state-card{stroke:var(--p-focus-ring-color);stroke-width:var(--p-focus-ring-width)}.work-process-canvas .work-edge-label{font-size:12px;fill:var(--p-text-color)}.work-process-canvas .work-edge-label-bg{fill:var(--p-content-background);stroke:var(--p-content-border-color);stroke-width:1}.work-edge-line{stroke:var(--p-primary-color);stroke-width:1.5}.work-edge-return .work-edge-line{stroke:var(--p-text-muted-color);stroke-dasharray:5 4}.work-graph-arrow{fill:context-stroke}.work-lane-line{fill:none;stroke:var(--p-text-muted-color);stroke-width:1.5;stroke-dasharray:2 4}.work-node-connector{fill:var(--p-content-background);stroke:var(--p-primary-color);stroke-width:1.5}.work-node-connector:hover,.work-node-connector:focus-visible,.work-node-connector[aria-pressed=true]{fill:var(--p-primary-color)}.work-any-transition:focus-visible text,.work-any-transition[aria-pressed=true] text{fill:var(--p-primary-color);text-decoration:underline}.work-process-legend{position:static;flex-wrap:wrap;padding:10px 16px;border-top:1px solid var(--p-content-border-color);background:var(--p-content-background)}@media(max-width:700px){.work-process-canvas>svg{height:420px}}.work-process-more{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:8px;padding:8px 16px;border-top:1px solid var(--p-content-border-color);background:var(--p-content-background);color:var(--p-text-muted-color);font-size:12px}.work-process-canvas .work-graph-edge.work-selected .work-edge-label-bg{fill:var(--p-primary-color);stroke:var(--p-primary-color)}.work-process-canvas .work-graph-edge.work-selected .work-edge-label{fill:var(--p-primary-contrast-color)}", Uo = /* @__PURE__ */ new WeakSet();
function id(e) {
  const a = e.getRootNode();
  if (a instanceof ShadowRoot && !Uo.has(a)) {
    const t = e.ownerDocument.createElement("style");
    t.textContent = od, a.append(t), Uo.add(a);
  }
}
const fi = 0.8;
function nd(e, a, t) {
  const l = Math.min(1, a.width / e.width, a.height / e.height);
  if (l >= fi) return { zoom: l, pan: { x: (e.width - a.width / l) / 2, y: (e.height - a.height / l) / 2 } };
  const o = e.nodes.find((f) => f.state.id === t) ?? e.nodes[0], d = Math.min(1, a.width / ((o?.width ?? 190) + 64));
  return { zoom: d, pan: o ? { x: e.direction === "TB" ? o.x - a.width / d / 2 : o.x - o.width / 2 - 32, y: e.direction === "TB" ? o.y - o.height / 2 - 32 : o.y - a.height / d / 2 } : { x: 0, y: 0 } };
}
const sd = ["onKeydown"], rd = {
  key: 0,
  class: "work-process-instruction",
  role: "status"
}, dd = ["viewBox"], ud = ["id"], cd = ["d", "marker-end"], vd = ["aria-label", "aria-pressed", "aria-keyshortcuts", "onKeydown", "onFocus", "onClick"], fd = ["d"], md = ["d", "marker-end"], pd = ["x", "y", "width", "height"], bd = ["x", "y"], hd = ["x", "dy"], gd = ["aria-label", "aria-pressed", "onClick", "onKeydown", "onFocus", "onPointerup"], yd = ["x", "y", "width", "height"], kd = ["cx", "cy"], wd = ["x", "y"], $d = ["x", "dy"], Vd = ["x", "y"], xd = ["x", "dy"], Cd = {
  key: 0,
  class: "work-limit-text"
}, Sd = ["aria-label", "aria-pressed", "aria-keyshortcuts", "onFocus", "onKeydown", "onClick"], Td = ["x", "y"], Id = ["x", "dy"], Dd = ["cx", "cy", "aria-label", "aria-pressed", "onFocus", "onPointerdown", "onClick", "onKeydown"], Ud = ["d"], Ed = {
  key: 1,
  class: "work-process-more",
  role: "status"
}, Ad = { class: "work-process-legend" }, Pd = /* @__PURE__ */ $e({
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
    const l = e, o = t, d = _t().replace(/:/g, "_"), f = q(""), u = q(), v = q();
    let i;
    const c = q(900), m = q(!1), $ = H(() => c.value < 700 ? 420 : 480), h = H(() => rn(l.process, l.draft, {
      width: c.value,
      height: $.value,
      direction: l.fitOnOpen ? "TB" : void 0
    })), k = q(1), y = q({ x: 0, y: 0 }), w = q({ x: 0, y: 0 }), V = H(() => {
      const N = Math.min(1, c.value / h.value.width);
      return l.fitOnOpen ? Math.max(fi, N) : N;
    }), x = H(() => ({
      width: c.value,
      height: m.value ? Math.max($.value, Math.ceil(h.value.height * V.value)) : $.value
    })), E = H(() => h.value.nodes.filter((N) => N.x - N.width / 2 >= y.value.x && N.x + N.width / 2 <= y.value.x + x.value.width / k.value && N.y - N.height / 2 >= y.value.y && N.y + N.height / 2 <= y.value.y + x.value.height / k.value).length);
    function D() {
      m.value = !1;
      const N = nd(h.value, x.value, l.process.initial);
      k.value = N.zoom, y.value = N.pan;
    }
    const j = H(() => `${y.value.x} ${y.value.y} ${x.value.width / k.value} ${x.value.height / k.value}`), ie = H(() => h.value.nodes.find((N) => N.state.id === f.value));
    function L() {
      m.value = !0, k.value = V.value;
      const N = x.value.width / k.value, se = h.value.nodes.find((O) => O.state.id === l.process.initial);
      y.value = {
        x: h.value.width > N && se ? se.x - N / 2 : (h.value.width - N) / 2,
        y: 0
      };
    }
    function re(N) {
      l.fitOnOpen && (m.value = !1);
      const se = Math.max(0.02, Math.min(3, k.value * N)), O = 1 / k.value - 1 / se;
      y.value = { x: y.value.x + x.value.width * O / 2, y: y.value.y + x.value.height * O / 2 }, k.value = se;
    }
    function ue(N) {
      const se = x.value.width / k.value, O = x.value.height / k.value;
      (N.x - N.width / 2 < y.value.x || N.x + N.width / 2 > y.value.x + se || N.y - N.height / 2 < y.value.y || N.y + N.height / 2 > y.value.y + O) && (y.value = { x: N.x - se / 2, y: N.y - O / 2 });
    }
    function me() {
      const N = h.value.nodes.find((se) => se.state === l.selectedState) ?? h.value.edges.find((se) => se.transition === l.selectedTransition);
      if (!N) {
        l.fitOnOpen && m.value && L();
        return;
      }
      ue(N);
    }
    Te([h, () => l.selectedState, () => l.selectedTransition], me, { flush: "post" });
    function ce() {
      l.fitOnOpen ? L() : D();
    }
    Te(() => l.process.id, () => {
      I(), ce();
    }, { flush: "post" });
    function ne(N) {
      if (N.target !== u.value) return;
      (N.key === "+" || N.key === "=") && (N.preventDefault(), re(1.2)), N.key === "-" && (N.preventDefault(), re(1 / 1.2)), N.key === "0" && (N.preventDefault(), L());
      const se = 60 / k.value;
      N.key.startsWith("Arrow") && (N.preventDefault(), y.value = { x: y.value.x + (N.key === "ArrowRight" ? se : N.key === "ArrowLeft" ? -se : 0), y: y.value.y + (N.key === "ArrowDown" ? se : N.key === "ArrowUp" ? -se : 0) });
    }
    function P(N, se) {
      const O = se.currentTarget;
      if (!f.value) o("state", N, O);
      else if (f.value !== N.id) {
        const M = f.value;
        f.value = "", o("connect", M, N.id, O);
      }
    }
    function ae(N) {
      f.value = N.state.id, w.value = { x: h.value.direction === "TB" ? N.x : N.x + N.width / 2, y: h.value.direction === "TB" ? N.y + N.height / 2 : N.y };
    }
    function z(N, se) {
      if (N.pointerType === "touch" || N.button !== 0) return;
      i = N.pointerId, ae(se);
      const O = N.currentTarget;
      O.hasPointerCapture?.(N.pointerId) && O.releasePointerCapture(N.pointerId);
    }
    function ge(N, se) {
      i === N.pointerId && (i = void 0, !(!f.value || f.value === se.id) && P(se, N));
    }
    function Ve(N, se) {
      if ((N.key === "Enter" || N.key === " ") && (N.preventDefault(), P(se, N)), ["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp"].includes(N.key)) {
        N.preventDefault();
        const O = Array.from(v.value?.querySelectorAll(".work-graph-node") ?? []), M = h.value.nodes.findIndex((W) => W.state === se), F = ["ArrowRight", "ArrowDown"].includes(N.key) ? 1 : -1;
        O[(M + F + O.length) % O.length]?.focus();
      }
    }
    function B(N, se) {
      l.selectedTransition === se && o("removeTransition", N);
    }
    function I() {
      f.value = "", i = void 0, U.clear(), Q = 0;
    }
    function C() {
      I(), o("clear");
    }
    const U = /* @__PURE__ */ new Map();
    let Q = 0;
    function b(N) {
      if (!N.target.closest('[role="button"]') && (U.set(N.pointerId, { x: N.clientX, y: N.clientY }), u.value?.setPointerCapture?.(N.pointerId), U.size === 2)) {
        const [se, O] = [...U.values()];
        Q = Math.hypot(se.x - O.x, se.y - O.y);
      }
    }
    function A(N) {
      const se = v.value?.getBoundingClientRect();
      if (!se?.width) return;
      if (i === N.pointerId && f.value) {
        w.value = { x: y.value.x + (N.clientX - se.left) * x.value.width / k.value / se.width, y: y.value.y + (N.clientY - se.top) * x.value.height / k.value / se.height };
        return;
      }
      const O = U.get(N.pointerId);
      if (O)
        if (U.set(N.pointerId, { x: N.clientX, y: N.clientY }), U.size === 2) {
          const [M, F] = [...U.values()], W = Math.hypot(M.x - F.x, M.y - F.y);
          Q && re(W / Q), Q = W;
        } else y.value = { x: y.value.x - (N.clientX - O.x) * x.value.width / k.value / se.width, y: y.value.y - (N.clientY - O.y) * x.value.height / k.value / se.height };
    }
    function Z(N) {
      i === N.pointerId && (f.value = "", i = void 0);
    }
    function X(N) {
      U.delete(N.pointerId), Q = 0, Z(N);
    }
    function we(N) {
      N.ctrlKey && (N.preventDefault(), re(Math.exp(-N.deltaY * 0.01)));
    }
    let xe;
    Oa(() => {
      if (u.value && id(u.value), typeof ResizeObserver < "u" && v.value) {
        let N = !0;
        xe = new ResizeObserver(() => {
          const se = v.value?.getBoundingClientRect();
          if (!se?.width || !se.height) return;
          const O = x.value.width;
          c.value = se.width, (N || Math.abs(se.width - O) > 1) && (N ? ce() : m.value ? L() : D(), N = !1), me();
        }), xe.observe(v.value);
      }
    }), At(() => xe?.disconnect()), a({ fit: L, focus: () => u.value?.focus(), zoomIn: () => re(1.2), zoomOut: () => re(1 / 1.2) });
    function Oe(N) {
      return N.category === "completed" ? "check" : N.category === "canceled" ? "x" : N.id === l.process.initial ? "arrow-bar-to-right" : { gate: "shield-check", automated: "bolt", parallel: "arrows-split" }[N.kind ?? ""] ?? "user";
    }
    return (N, se) => (n(), p("section", {
      ref_key: "canvas",
      ref: u,
      class: $t(["work-process-canvas", { "work-process-scrollable": e.fitOnOpen && m.value }]),
      "aria-label": "Process map",
      tabindex: "0",
      onKeydown: [
        ne,
        Ye(Me(C, ["stop"]), ["esc"])
      ],
      onPointerdown: b,
      onPointermove: A,
      onPointerup: X,
      onPointerleave: Z,
      onPointercancel: I,
      onWheel: we
    }, [
      f.value ? (n(), p("p", rd, "Choose the next stop. Escape cancels.")) : S("", !0),
      (n(), p("svg", {
        ref_key: "svg",
        ref: v,
        style: Ri({ height: x.value.height + "px" }),
        viewBox: j.value,
        role: "group",
        "aria-label": "States and transitions"
      }, [
        s("defs", null, [
          s("marker", {
            id: r(d) + "-arrow",
            viewBox: "0 0 8 8",
            refX: "7",
            refY: "4",
            markerWidth: "6",
            markerHeight: "6",
            orient: "auto"
          }, [...se[1] || (se[1] = [
            s("path", {
              d: "M0 0 L8 4 L0 8 z",
              class: "work-graph-arrow"
            }, null, -1)
          ])], 8, ud)
        ]),
        (n(!0), p(te, null, de(h.value.parallels, (O) => (n(), p("path", {
          key: O.key,
          d: O.path,
          class: "work-lane-line",
          "marker-end": `url(#${r(d)}-arrow)`
        }, [
          s("title", null, "Parallel lane from " + T(r(pe)(O.state)), 1)
        ], 8, cd))), 128)),
        (n(!0), p(te, null, de(h.value.edges, (O) => (n(), p("g", {
          key: O.key,
          class: $t(["work-graph-edge", ["work-edge-" + O.type, { "work-selected": e.selectedTransition === O.transition }]]),
          role: "button",
          tabindex: "0",
          "aria-label": "Edit transition " + r(Ke)(O.transition),
          "aria-pressed": e.selectedTransition === O.transition,
          "aria-keyshortcuts": e.selectedTransition === O.transition ? "Delete Backspace" : void 0,
          onKeydown: [
            Ye((M) => B(M, O.transition), ["delete"]),
            Ye((M) => B(M, O.transition), ["backspace"]),
            Ye(Me((M) => o("transition", O.transition, M.currentTarget), ["prevent"]), ["enter"]),
            Ye(Me((M) => o("transition", O.transition, M.currentTarget), ["prevent"]), ["space"])
          ],
          onFocus: (M) => ue(O),
          onClick: (M) => o("transition", O.transition, M.currentTarget)
        }, [
          s("path", {
            d: O.path,
            class: "work-edge-hit"
          }, null, 8, fd),
          s("path", {
            d: O.path,
            class: "work-edge-line",
            "marker-end": `url(#${r(d)}-arrow)`
          }, null, 8, md),
          s("rect", {
            x: O.x - O.width / 2,
            y: O.y - O.height / 2,
            width: O.width,
            height: O.height,
            rx: "6",
            class: "work-edge-label-bg"
          }, null, 8, pd),
          s("text", {
            x: O.x,
            y: O.y - (O.lines.length - 1) * 8 + 4,
            class: "work-edge-label",
            "text-anchor": "middle"
          }, [
            (n(!0), p(te, null, de(O.lines, (M, F) => (n(), p("tspan", {
              key: F,
              x: O.x,
              dy: F ? 16 : 0
            }, T(M), 9, hd))), 128))
          ], 8, bd)
        ], 42, vd))), 128)),
        (n(!0), p(te, null, de(h.value.nodes, (O) => (n(), p("g", {
          key: O.state.id,
          class: $t(["work-graph-node", ["work-stop-" + O.state.category, { "work-selected": e.selectedState === O.state }]]),
          role: "button",
          tabindex: "0",
          "aria-label": "Edit state " + r(pe)(O.state),
          "aria-pressed": e.selectedState === O.state,
          onClick: (M) => P(O.state, M),
          onKeydown: (M) => Ve(M, O.state),
          onFocus: (M) => ue(O),
          onPointerup: (M) => ge(M, O.state)
        }, [
          s("rect", {
            x: O.x - O.width / 2,
            y: O.y - O.height / 2,
            width: O.width,
            height: O.height,
            rx: "10",
            class: "work-state-card"
          }, null, 8, yd),
          s("circle", {
            cx: O.x - O.width / 2 + 22,
            cy: O.y - O.height / 2 + 25,
            r: "10",
            class: "work-stop-ring"
          }, null, 8, kd),
          g(r(ve), {
            icon: "tabler:" + Oe(O.state),
            x: O.x - O.width / 2 + 15,
            y: O.y - O.height / 2 + 18,
            width: "14",
            height: "14",
            class: "work-stop-icon",
            "aria-hidden": "true"
          }, null, 8, ["icon", "x", "y"]),
          s("text", {
            x: O.x - O.width / 2 + 42,
            y: O.y - O.height / 2 + 29,
            class: "work-node-name"
          }, [
            (n(!0), p(te, null, de(O.title, (M, F) => (n(), p("tspan", {
              key: F,
              x: O.x - O.width / 2 + 42,
              dy: F ? 18 : 0
            }, T(M), 9, $d))), 128))
          ], 8, wd),
          s("text", {
            x: O.x - O.width / 2 + 16,
            y: O.y - O.height / 2 + 33 + O.title.length * 18,
            class: "work-node-meta"
          }, [
            (n(!0), p(te, null, de(O.caption, (M, F) => (n(), p("tspan", {
              key: F,
              x: O.x - O.width / 2 + 16,
              dy: F ? 16 : 0
            }, T(M), 9, xd))), 128)),
            e.draft.policy?.wip?.[O.state.id] ? (n(), p("tspan", Cd, " · limit " + T(e.draft.policy.wip[O.state.id].limit), 1)) : S("", !0)
          ], 8, Vd),
          (n(!0), p(te, null, de(O.badges, (M, F) => (n(), p("g", {
            key: M.id,
            class: "work-any-transition",
            role: "button",
            tabindex: "0",
            "aria-label": "Edit transition " + r(Ke)(M),
            "aria-pressed": e.selectedTransition === M,
            "aria-keyshortcuts": e.selectedTransition === M ? "Delete Backspace" : void 0,
            onFocus: (W) => ue(O),
            onKeydown: [
              Ye((W) => B(W, M), ["delete"]),
              Ye((W) => B(W, M), ["backspace"]),
              Ye(Me((W) => o("transition", M, W.currentTarget), ["stop", "prevent"]), ["enter"]),
              Ye(Me((W) => o("transition", M, W.currentTarget), ["stop", "prevent"]), ["space"])
            ],
            onClick: Me((W) => o("transition", M, W.currentTarget), ["stop"])
          }, [
            s("text", {
              x: O.x - O.width / 2 + 16,
              y: O.y - O.height / 2 + 33 + O.title.length * 18 + O.caption.length * 16 + O.badges.slice(0, F).reduce((W, _) => W + r(ca)(r(Ke)(_) + " works from any state").length * 18, 0),
              class: "work-node-meta"
            }, [
              (n(!0), p(te, null, de(r(ca)(r(Ke)(M) + " works from any state"), (W, _) => (n(), p("tspan", {
                key: _,
                x: O.x - O.width / 2 + 16,
                dy: _ ? 18 : 0
              }, T(W), 9, Id))), 128))
            ], 8, Td)
          ], 40, Sd))), 128)),
          ["completed", "canceled"].includes(O.state.category) ? S("", !0) : (n(), p("circle", {
            key: 0,
            cx: h.value.direction === "TB" ? O.x : O.x + O.width / 2,
            cy: h.value.direction === "TB" ? O.y + O.height / 2 : O.y,
            r: "9",
            class: "work-node-connector",
            role: "button",
            tabindex: "0",
            "aria-label": "Connect from " + r(pe)(O.state),
            "aria-pressed": f.value === O.state.id,
            onFocus: (M) => ue(O),
            onPointerdown: Me((M) => z(M, O), ["stop"]),
            onClick: Me((M) => ae(O), ["stop"]),
            onKeydown: [
              Ye(Me((M) => ae(O), ["stop", "prevent"]), ["enter"]),
              Ye(Me((M) => ae(O), ["stop", "prevent"]), ["space"])
            ]
          }, null, 40, Dd))
        ], 42, gd))), 128)),
        ie.value ? (n(), p("path", {
          key: 0,
          d: `M ${h.value.direction === "TB" ? ie.value.x : ie.value.x + ie.value.width / 2} ${h.value.direction === "TB" ? ie.value.y + ie.value.height / 2 : ie.value.y} L ${w.value.x} ${w.value.y}`,
          class: "work-connect-ghost"
        }, null, 8, Ud)) : S("", !0)
      ], 12, dd)),
      E.value < e.process.states.length ? (n(), p("div", Ed, [
        s("span", null, T(E.value) + " of " + T(e.process.states.length) + " states in view · Pan to see more", 1),
        m.value ? S("", !0) : (n(), J(r(le), {
          key: 0,
          label: "Fit map",
          size: "small",
          text: "",
          onClick: se[0] || (se[0] = (O) => L())
        }))
      ])) : S("", !0),
      s("div", Ad, [
        s("span", null, T(e.process.states.length) + " states · " + T(Math.round(k.value * 100)) + "%", 1),
        se[2] || (se[2] = s("span", null, [
          s("i"),
          G("Transition")
        ], -1)),
        se[3] || (se[3] = s("span", null, [
          s("i", { class: "work-return-key" }),
          G("Return / loop")
        ], -1)),
        se[4] || (se[4] = s("span", null, "Drag to pan · Ctrl + scroll to zoom · Fit to reset the view", -1))
      ])
    ], 42, sd));
  }
}), ql = new Intl.ListFormat("en", { type: "conjunction" }), Od = new Intl.ListFormat("en", { type: "disjunction" }), Rd = {
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
}, Nd = { some: "At least one", every: "Every", none: "No" };
function Gl(e, a) {
  const t = a.fields?.find((l) => l.code === e);
  return t ? Ze(t) : Pe(e);
}
function Kl(e, a, t) {
  return Array.isArray(e) ? ql.format(e.map((l) => Kl(l, a, t))) : a === "category" && typeof e == "string" ? zt(e) : a === "state" && typeof e == "string" ? t.processes?.flatMap((l) => l.states).find((l) => l.id === e)?.name || Pe(e) : "$actor" in vt(e) ? "the person moving the item" : "$now" in vt(e) ? "the current time" : Yt(e, t.fields?.find((l) => l.code === a));
}
function Md(e) {
  const a = vt(e.where);
  if (!(e.rel !== "blocks" || e.dir !== "inward" || a.field !== "category" || a.op !== "nin" || !Array.isArray(a.value) || a.value.length !== 2 || !a.value.includes("completed") || !a.value.includes("canceled"))) {
    if (e.q === "none") return "Requires all blockers to be resolved.";
    if (e.q === "some") return "Requires an open blocker.";
  }
}
function Qa(e, a) {
  const t = vt(e), l = (d) => d.map((f) => Qa(f, a)), o = a.relation_types?.find((d) => d.id === t.rel);
  if (Array.isArray(t.and) && t.and.length) return `(${ql.format(l(t.and))})`;
  if (Array.isArray(t.or) && t.or.length) return `(${Od.format(l(t.or))})`;
  if (t.not) return `this condition is false (${Qa(t.not, a)})`;
  if (typeof t.match == "string" && t.match.trim()) return `the item matches “${t.match}”`;
  if (typeof t.rel == "string" || t.children) {
    const d = t.dir === "inward" && !o?.symmetric ? o?.inward : o?.outward, f = t.children ? "child item" : `item linked as “${d || Pe(String(t.rel))}”`;
    return `${Nd[String(t.q)] ?? "At least one"} ${f} matches (${Qa(t.where, a)})`;
  }
  if (t.history) {
    const d = vt(t.history);
    if (typeof d.field != "string") return "a value history condition";
    const f = Gl(d.field, a), u = (i) => Kl(i, String(d.field), a), v = Array.isArray(d.during) ? ` during ${ql.format(d.during.map((i) => String(i)))}` : "";
    if (d.changed === !0) {
      const i = d.from === void 0 ? "" : ` from ${u(d.from)}`, c = d.to === void 0 ? "" : ` to ${u(d.to)}`;
      return `${f} changed${i}${c}${v}`;
    }
    return d.was !== void 0 ? `${f} was ${u(d.was)}${v}` : `a change in the history of ${f}${v}`;
  }
  if (typeof t.field == "string") {
    const d = Gl(t.field, a);
    if (t.op === "is_null") return `${d} is ${t.value === !1 ? "filled" : "empty"}`;
    if (t.op === "is_state") {
      const u = { absent: "has never been filled", cleared: "was cleared", provided: "has a value" }[String(t.value)];
      if (u) return `${d} ${u}`;
    }
    const f = Rd[String(t.op)];
    return f && t.value !== void 0 ? `${d} ${f} ${Kl(t.value, t.field, a)}` : `a condition on ${d}`;
  }
  return "a custom condition";
}
function Fd(e, a, t, l = []) {
  const o = [], d = a.states.find((u) => u.id === e.to), f = [.../* @__PURE__ */ new Set([...e.require ?? [], ...d?.require ?? []])];
  f.length && o.push(`Required: ${f.map((u) => Gl(u, t)).join(", ")}`), e.when != null && o.push(Md(vt(e.when)) ?? `Only when ${Qa(e.when, t)}`);
  for (const u of e.guards ?? []) {
    const v = l.find((i) => i.id === u);
    o.push(v ? `Requires the “${v.title}” check to pass` : "Requires an unavailable check to pass");
  }
  return o;
}
const Ld = {
  key: 0,
  class: "work-stack work-tight work-muted work-small"
}, mi = /* @__PURE__ */ $e({
  __name: "TransitionRules",
  props: {
    transition: {},
    process: {},
    draft: {},
    guards: {}
  },
  setup(e) {
    const a = e, t = H(() => Fd(a.transition, a.process, a.draft, a.guards));
    return (l, o) => t.value.length ? (n(), p("div", Ld, [
      (n(!0), p(te, null, de(t.value, (d, f) => (n(), p("p", { key: f }, T(d), 1))), 128))
    ])) : S("", !0);
  }
}), Bd = {
  class: "work-process-list work-stack",
  "aria-label": "Process list"
}, jd = { class: "work-table-scroll" }, zd = {
  class: "work-settings-table work-process-table",
  role: "table",
  "aria-label": "States"
}, Wd = { role: "rowgroup" }, qd = ["aria-selected"], Gd = { role: "cell" }, Kd = {
  key: 0,
  class: "work-muted work-small"
}, Hd = { role: "cell" }, Yd = { role: "cell" }, Xd = {
  role: "cell",
  class: "work-process-list-actions"
}, Jd = { class: "work-table-scroll" }, Zd = {
  class: "work-settings-table work-process-table",
  role: "table",
  "aria-label": "Transitions"
}, Qd = { role: "rowgroup" }, _d = ["aria-selected"], eu = { role: "cell" }, tu = { role: "cell" }, au = { role: "cell" }, lu = {
  role: "cell",
  class: "work-process-list-actions"
}, ou = /* @__PURE__ */ $e({
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
    return (a, t) => (n(), p("section", Bd, [
      t[6] || (t[6] = s("h3", null, "States", -1)),
      s("div", jd, [
        s("table", zd, [
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
          s("tbody", Wd, [
            (n(!0), p(te, null, de(e.process.states, (l) => (n(), p("tr", {
              key: l.id,
              "aria-selected": e.selectedState === l,
              role: "row"
            }, [
              s("td", Gd, [
                g(r(De), {
                  modelValue: l.name,
                  "onUpdate:modelValue": (o) => l.name = o,
                  "aria-label": "Name of " + r(pe)(l)
                }, null, 8, ["modelValue", "onUpdate:modelValue", "aria-label"]),
                e.counts ? (n(), p("p", Kd, T(e.counts[l.id] ?? 0) + " here", 1)) : S("", !0)
              ]),
              s("td", Hd, [
                t[0] || (t[0] = s("span", {
                  class: "work-process-cell-label",
                  "aria-hidden": "true"
                }, "Phase", -1)),
                G(T(r(zt)(l.category)), 1)
              ]),
              s("td", Yd, [
                t[1] || (t[1] = s("span", {
                  class: "work-process-cell-label",
                  "aria-hidden": "true"
                }, "Kind", -1)),
                g(r(dt), { severity: "secondary" }, {
                  default: Y(() => [
                    G(T(r(_a)(l.kind)), 1)
                  ]),
                  _: 2
                }, 1024)
              ]),
              s("td", Xd, [
                g(r(le), {
                  size: "small",
                  text: "",
                  severity: "secondary",
                  "aria-label": "Edit state " + r(pe)(l),
                  onClick: (o) => a.$emit("state", l, o.currentTarget)
                }, {
                  default: Y(() => [
                    g(r(ve), { icon: "tabler:pencil" })
                  ]),
                  _: 1
                }, 8, ["aria-label", "onClick"]),
                g(r(le), {
                  size: "small",
                  text: "",
                  severity: "danger",
                  "aria-label": "Remove state " + r(pe)(l),
                  onClick: (o) => a.$emit("removeState", l)
                }, {
                  default: Y(() => [
                    g(r(ve), { icon: "tabler:trash" })
                  ]),
                  _: 1
                }, 8, ["aria-label", "onClick"])
              ])
            ], 8, qd))), 128))
          ])
        ])
      ]),
      t[7] || (t[7] = s("h3", null, "Transitions", -1)),
      s("div", Jd, [
        s("table", Zd, [
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
          s("tbody", Qd, [
            (n(!0), p(te, null, de(e.process.transitions ?? [], (l) => (n(), p("tr", {
              key: l.id,
              "aria-selected": e.selectedTransition === l,
              role: "row"
            }, [
              s("td", eu, [
                g(r(De), {
                  modelValue: l.name,
                  "onUpdate:modelValue": (o) => l.name = o,
                  placeholder: r(Ke)(l),
                  "aria-label": "Name of " + r(Ke)(l)
                }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder", "aria-label"]),
                g(mi, {
                  transition: l,
                  process: e.process,
                  draft: e.draft,
                  guards: e.guards
                }, null, 8, ["transition", "process", "draft", "guards"])
              ]),
              s("td", tu, [
                t[3] || (t[3] = s("span", {
                  class: "work-process-cell-label",
                  "aria-hidden": "true"
                }, "From", -1)),
                G(" " + T(l.from === "any" ? "Any state" : l.from.map((o) => r(pe)(e.process.states.find((d) => d.id === o))).join(", ")), 1)
              ]),
              s("td", au, [
                t[4] || (t[4] = s("span", {
                  class: "work-process-cell-label",
                  "aria-hidden": "true"
                }, "To", -1)),
                G(T(r(pe)(e.process.states.find((o) => o.id === l.to))), 1)
              ]),
              s("td", lu, [
                g(r(le), {
                  size: "small",
                  text: "",
                  severity: "secondary",
                  "aria-label": "Edit transition " + r(Ke)(l),
                  onClick: (o) => a.$emit("transition", l, o.currentTarget)
                }, {
                  default: Y(() => [
                    g(r(ve), { icon: "tabler:pencil" })
                  ]),
                  _: 1
                }, 8, ["aria-label", "onClick"]),
                g(r(le), {
                  size: "small",
                  text: "",
                  severity: "danger",
                  "aria-label": "Remove transition " + r(Ke)(l),
                  onClick: (o) => a.$emit("removeTransition", l)
                }, {
                  default: Y(() => [
                    g(r(ve), { icon: "tabler:trash" })
                  ]),
                  _: 1
                }, 8, ["aria-label", "onClick"])
              ])
            ], 8, _d))), 128))
          ])
        ])
      ])
    ]));
  }
}), iu = { class: "work-stack work-transition-settings" }, nu = { class: "work-stack work-tight" }, su = { class: "work-row" }, ru = { key: 0 }, du = { class: "work-stack" }, uu = { class: "work-row" }, cu = { class: "work-row" }, vu = { class: "work-stack work-tight" }, fu = { class: "work-row" }, mu = { class: "work-stack work-tight" }, pu = { class: "work-stack work-tight" }, bu = /* @__PURE__ */ $e({
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
    function d(f, u) {
      const v = t.transition.set?.[f];
      !v || !t.transition.set || (t.transition.set[f] = { field: v.field, ...u === "clear" ? { clear: !0 } : u === "copy" ? { copy: "" } : { value: "" } });
    }
    return (f, u) => (n(), p("div", iu, [
      s("label", nu, [
        u[15] || (u[15] = G("To state", -1)),
        g(r(fe), {
          modelValue: e.transition.to,
          "onUpdate:modelValue": u[0] || (u[0] = (v) => e.transition.to = v),
          "aria-label": "To state",
          appendTo: "self",
          optionLabel: "label",
          optionValue: "value",
          options: e.process.states.map((v) => ({ label: r(pe)(v), value: v.id }))
        }, null, 8, ["modelValue", "options"])
      ]),
      s("label", su, [
        u[16] || (u[16] = s("span", { class: "work-spacer" }, "Works from any state", -1)),
        g(r(rt), {
          "model-value": e.transition.from === "any",
          "aria-label": "Works from any state",
          "onUpdate:modelValue": u[1] || (u[1] = (v) => e.transition.from = v ? "any" : [])
        }, null, 8, ["model-value"])
      ]),
      e.transition.from !== "any" ? (n(), J(bt, {
        key: 0,
        label: "From states",
        options: e.process.states.map((v) => ({ value: v.id, label: r(pe)(v) })),
        modelValue: e.transition.from,
        "onUpdate:modelValue": u[2] || (u[2] = (v) => e.transition.from = v)
      }, null, 8, ["options", "modelValue"])) : S("", !0),
      u[24] || (u[24] = s("h4", { class: "work-process-group" }, "Must be filled", -1)),
      g(bt, {
        label: "Required fields",
        options: e.draft.fields?.map((v) => ({ value: v.code, label: v.title || v.code })) ?? [],
        modelValue: e.transition.require,
        "onUpdate:modelValue": u[3] || (u[3] = (v) => e.transition.require = v)
      }, null, 8, ["options", "modelValue"]),
      u[25] || (u[25] = s("h4", { class: "work-process-group" }, "Only when", -1)),
      g(_l, {
        label: "Allow this transition when",
        draft: e.draft,
        "board-id": e.boardId,
        "model-value": e.transition.when,
        "onUpdate:modelValue": u[4] || (u[4] = (v) => e.transition.when = v),
        onValidity: u[5] || (u[5] = (v) => l("validity", "when", v))
      }, null, 8, ["draft", "board-id", "model-value"]),
      e.guards?.length || e.transition.guards?.length ? (n(), J(bt, {
        key: 1,
        label: "Installed checks",
        options: [...(e.guards ?? []).map((v) => ({ value: v.id, label: v.title })), ...(e.transition.guards ?? []).filter((v) => !e.guards?.some((i) => i.id === v)).map((v) => ({ value: v, label: e.guards ? "Unavailable check" : "Configured check" }))],
        modelValue: e.transition.guards,
        "onUpdate:modelValue": u[6] || (u[6] = (v) => e.transition.guards = v)
      }, null, 8, ["options", "modelValue"])) : S("", !0),
      (n(!0), p(te, null, de(e.guards?.filter((v) => e.transition.guards?.includes(v.id)) ?? [], (v) => (n(), p("p", {
        key: v.id,
        class: "work-muted work-small"
      }, [
        G(T(v.description || v.title + " can stop this transition.") + " ", 1),
        v.reads?.length ? (n(), p("span", ru, " Checks " + T(v.reads.map((i) => e.draft.fields?.find((c) => c.code === i)?.title || "a configured field").join(", ")) + ".", 1)) : S("", !0)
      ]))), 128)),
      g(Fe, {
        class: "work-disclosure",
        label: "Advanced transition settings"
      }, {
        default: Y(() => [
          s("div", du, [
            s("label", uu, [
              u[17] || (u[17] = s("span", { class: "work-spacer" }, "Happens automatically", -1)),
              g(r(rt), {
                "model-value": e.transition.auto,
                "onUpdate:modelValue": u[7] || (u[7] = (v) => {
                  e.transition.auto = v, v || delete e.transition.default;
                }),
                "aria-label": "Automatic transition"
              }, null, 8, ["model-value"])
            ]),
            s("label", cu, [
              u[18] || (u[18] = s("span", { class: "work-spacer" }, "Default automatic transition", -1)),
              g(r(rt), {
                modelValue: e.transition.default,
                "onUpdate:modelValue": u[8] || (u[8] = (v) => e.transition.default = v),
                disabled: !e.transition.auto,
                "aria-label": "Default transition"
              }, null, 8, ["modelValue", "disabled"])
            ]),
            u[23] || (u[23] = s("h4", { class: "work-process-group" }, "Also sets", -1)),
            (n(!0), p(te, null, de(e.transition.set ?? [], (v, i) => (n(), p("div", {
              key: i,
              class: "work-process-value work-stack work-tight"
            }, [
              s("label", vu, [
                u[19] || (u[19] = G("Field", -1)),
                g(r(fe), {
                  modelValue: v.field,
                  "onUpdate:modelValue": (c) => v.field = c,
                  appendTo: "self",
                  optionLabel: "label",
                  optionValue: "value",
                  options: e.draft.fields?.map((c) => ({ value: c.code, label: c.title || c.code })) ?? []
                }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
              ]),
              s("div", fu, [
                g(r(fe), {
                  "model-value": v.clear ? "clear" : v.copy !== void 0 ? "copy" : "value",
                  "aria-label": "Value action",
                  appendTo: "self",
                  options: [
                    { label: "Set value", value: "value" },
                    { label: "Clear value", value: "clear" },
                    { label: "Copy field", value: "copy" }
                  ],
                  optionLabel: "label",
                  optionValue: "value",
                  "onUpdate:modelValue": (c) => d(i, c)
                }, null, 8, ["model-value", "onUpdate:modelValue"]),
                g(r(le), {
                  text: "",
                  severity: "danger",
                  "aria-label": "Remove value " + (i + 1),
                  onClick: (c) => e.transition.set?.splice(i, 1)
                }, {
                  default: Y(() => [
                    g(r(ve), { icon: "tabler:trash" })
                  ]),
                  _: 1
                }, 8, ["aria-label", "onClick"])
              ]),
              v.copy !== void 0 ? (n(), J(r(fe), {
                key: 0,
                modelValue: v.copy,
                "onUpdate:modelValue": (c) => v.copy = c,
                "aria-label": "Copy from field",
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                options: e.draft.fields?.map((c) => ({ value: c.code, label: c.title || c.code })) ?? []
              }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])) : v.clear ? S("", !0) : (n(!0), p(te, { key: 1 }, de(e.draft.fields?.filter((c) => c.code === v.field) ?? [], (c) => (n(), J(Jo, {
                key: c.code,
                "board-id": e.boardId ?? "",
                field: c,
                modelValue: v.value,
                "onUpdate:modelValue": (m) => v.value = m,
                onValidity: (m) => l("validity", "effect-" + i, m)
              }, null, 8, ["board-id", "field", "modelValue", "onUpdate:modelValue", "onValidity"]))), 128))
            ]))), 128)),
            g(r(le), {
              label: "Add value",
              severity: "secondary",
              outlined: "",
              size: "small",
              onClick: o
            }, {
              icon: Y(() => [
                g(r(ve), { icon: "tabler:plus" })
              ]),
              _: 1
            }),
            s("label", mu, [
              u[20] || (u[20] = G("Offer to people", -1)),
              g(r(fe), {
                "model-value": e.transition.people,
                "aria-label": "Offer to people",
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                options: [{ label: "Work default", value: void 0 }, { label: "Offer explicitly", value: !0 }, { label: "Process engine only", value: !1 }],
                "onUpdate:modelValue": u[9] || (u[9] = (v) => e.transition.people = v)
              }, null, 8, ["model-value"]),
              u[21] || (u[21] = s("span", { class: "work-muted work-small" }, "Work default can hide a stage route from the list while still allowing it by name. Process engine only reserves the route for the engine and board administrators using force.", -1))
            ]),
            s("label", pu, [
              u[22] || (u[22] = G("Evaluation order", -1)),
              g(r(Dt), {
                "model-value": e.transition.order ?? null,
                "aria-label": "Transition order",
                min: 0,
                useGrouping: !1,
                "onUpdate:modelValue": u[10] || (u[10] = (v) => e.transition.order = v ?? void 0)
              }, null, 8, ["model-value"])
            ]),
            g(jt, {
              label: "Set values",
              "model-value": e.transition.set,
              shape: "array",
              "onUpdate:modelValue": u[11] || (u[11] = (v) => e.transition.set = v),
              onValidity: u[12] || (u[12] = (v) => l("validity", "set", v))
            }, null, 8, ["model-value"]),
            g(jt, {
              label: "Guards",
              "model-value": e.transition.guards,
              shape: "array",
              "onUpdate:modelValue": u[13] || (u[13] = (v) => e.transition.guards = v),
              onValidity: u[14] || (u[14] = (v) => l("validity", "guards", v))
            }, null, 8, ["model-value"])
          ])
        ]),
        _: 1
      })
    ]));
  }
}), Eo = /* @__PURE__ */ $e({
  __name: "CapacityControl",
  props: {
    draft: {},
    state: {},
    label: {},
    hard: { type: Boolean }
  },
  setup(e) {
    const a = e, t = H(() => a.draft.policy?.wip?.[a.state]);
    function l(d) {
      if (d === null) {
        a.draft.policy?.wip && delete a.draft.policy.wip[a.state];
        return;
      }
      const f = a.draft.policy ??= {}, u = f.wip ??= {};
      u[a.state] = { ...u[a.state], limit: d };
    }
    function o(d) {
      t.value && (t.value.hard = d);
    }
    return (d, f) => e.hard ? (n(), J(r(rt), {
      key: 0,
      "aria-label": e.label,
      disabled: !t.value,
      "model-value": t.value?.hard ?? !1,
      "onUpdate:modelValue": o
    }, null, 8, ["aria-label", "disabled", "model-value"])) : (n(), J(r(Dt), {
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
async function Rl(e, a) {
  try {
    const { data: t } = await Fl.get(e, a ? { params: a } : void 0);
    if (!t?.success) {
      const l = t?.message || (typeof t?.error == "string" ? t.error : t?.error?.message) || "Could not read published Flow.";
      throw new Nl({ message: l, details: t?.details }, "Published Flow");
    }
    return t;
  } catch (t) {
    throw Wi(t, "Published Flow");
  }
}
const Ao = (e) => `/api/v1/workflows/${encodeURIComponent(e)}/versions`, Hl = {
  title: async (e) => (await Rl("/api/v1/workflows/published", { id: e })).item?.title,
  versions: async (e) => (await Rl(Ao(e))).versions ?? [],
  check: async (e) => {
    if ((await Rl(`${Ao(e.id)}/${e.version}`)).version?.version !== e.version) throw new Error("The published version is unavailable.");
  }
}, hu = {
  class: "work-stack work-tight",
  "aria-label": "Stage Flow"
}, gu = {
  key: 0,
  class: "work-muted work-small"
}, yu = {
  key: 1,
  class: "kx-err work-alert-actions"
}, ku = { role: "alert" }, wu = ["schema", "config", "title"], $u = {
  key: 3,
  class: "kx-err",
  role: "alert"
}, Vu = {
  key: 4,
  class: "work-stack work-tight"
}, xu = ["value", "aria-busy", "disabled"], Cu = {
  value: "",
  disabled: ""
}, Su = ["value"], Tu = {
  key: 5,
  class: "work-muted work-small",
  role: "status"
}, Iu = /* @__PURE__ */ $e({
  __name: "StageFlow",
  props: {
    modelValue: {}
  },
  emits: ["update:modelValue", "validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = q(!1), d = q(""), f = q([]), u = q(!1), v = q(""), i = q(!1), c = H(() => d.value || t.modelValue?.id), m = JSON.stringify({ properties: { flow_ref: { title: "Published Flow", picker: "wc-workflow-picker" } } }), $ = H(() => JSON.stringify(t.modelValue ? { flow_ref: t.modelValue } : {}));
    let h = 0;
    async function k() {
      o.value = await Bt("wc-workflow-picker");
    }
    k();
    async function y() {
      const E = ++h, D = c.value, j = t.modelValue;
      if (u.value = !!D, v.value = "", f.value = [], !!D)
        try {
          const [ie] = await Promise.all([Hl.versions(D), !i.value && j ? Hl.check(j) : Promise.resolve()]);
          if (E !== h) return;
          if (f.value = ie.filter((L) => Number.isInteger(L.version) && L.version > 0), !i.value && j && !f.value.some((L) => L.version === j.version)) throw new Error("The published version is unavailable.");
        } catch (ie) {
          E === h && (v.value = pt(ie, "Could not read published Flow."));
        } finally {
          E === h && (u.value = !1);
        }
    }
    Te([c, () => t.modelValue?.version, i], y, { immediate: !0 }), Te(i, (E) => l("validity", !E), { immediate: !0 });
    function w(E) {
      const D = E.detail?.flow_ref;
      D?.kind !== "flow" || !D.id || (i.value = !0, d.value = D.id);
    }
    function V(E) {
      !c.value || !f.value.some((D) => D.version === E) || (l("update:modelValue", { kind: "flow", id: c.value, version: E }), i.value = !1, d.value = "");
    }
    function x() {
      l("update:modelValue", void 0), i.value = !1, d.value = "";
    }
    return At(() => {
      h++, l("validity", !0);
    }), (E, D) => (n(), p("section", hu, [
      D[4] || (D[4] = s("h4", { class: "work-field-label" }, "What runs", -1)),
      e.modelValue ? S("", !0) : (n(), p("p", gu, "No Flow bound. This stage keeps its existing external execution contract.")),
      v.value ? (n(), p("div", yu, [
        s("p", ku, [
          G(T(i.value ? "Flow versions unavailable" : "Flow binding unavailable"), 1),
          !i.value && e.modelValue ? (n(), p(te, { key: 0 }, [
            G(" (v" + T(e.modelValue.version) + ")", 1)
          ], 64)) : S("", !0),
          G(". " + T(v.value), 1)
        ]),
        g(r(le), {
          label: "Reload Flow",
          severity: "secondary",
          text: "",
          onClick: y
        })
      ])) : S("", !0),
      o.value ? (n(), p("wc-workflow-picker", {
        key: 2,
        schema: r(m),
        config: $.value,
        title: e.modelValue?.id,
        onChange: w
      }, null, 40, wu)) : (n(), p("p", $u, [
        D[2] || (D[2] = G("Published Flow picker unavailable.", -1)),
        g(r(le), {
          label: "Reload Flow picker",
          text: "",
          severity: "secondary",
          onClick: k
        })
      ])),
      c.value ? (n(), p("label", Vu, [
        D[3] || (D[3] = G(" Published version ", -1)),
        s("select", {
          class: "p-inputtext work-flow-version",
          value: i.value ? "" : e.modelValue?.version,
          "aria-busy": u.value,
          disabled: u.value || !!v.value,
          onChange: D[0] || (D[0] = (j) => V(Number(j.target.value)))
        }, [
          s("option", Cu, T(u.value ? "Loading versions…" : "Choose a published version"), 1),
          (n(!0), p(te, null, de(f.value, (j) => (n(), p("option", {
            key: j.version,
            value: j.version
          }, "v" + T(j.version), 9, Su))), 128))
        ], 40, xu)
      ])) : S("", !0),
      i.value ? (n(), p("p", Tu, "Choose a published version to finish selecting the Flow.")) : S("", !0),
      e.modelValue || i.value ? (n(), J(r(le), {
        key: 6,
        label: i.value ? "Cancel Flow selection" : "Remove Flow binding",
        "aria-label": i.value ? "Cancel Flow selection" : "Remove Flow binding",
        severity: "secondary",
        text: "",
        onClick: D[1] || (D[1] = (j) => i.value ? (i.value = !1, d.value = "") : x())
      }, null, 8, ["label", "aria-label"])) : S("", !0)
    ]));
  }
}), Yl = { seconds: 1, minutes: 60, hours: 3600, days: 86400 };
function xa(e, a) {
  const t = /^P(\d+)W$/.exec(e), l = /^P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+\.?\d*)S)?)?$/.exec(e);
  if (!t && (!l || e === "P" || e.endsWith("T"))) return;
  const o = t ? Number(t[1]) * 604800 : Number(l[1] ?? 0) * 86400 + Number(l[2] ?? 0) * 3600 + Number(l[3] ?? 0) * 60 + Number(l[4] ?? 0);
  if (!Number.isFinite(o) || o <= 0) return;
  const d = a ?? (o % 86400 === 0 ? "days" : o % 3600 === 0 ? "hours" : o < 60 ? "seconds" : "minutes");
  return { amount: o / Yl[d], unit: d };
}
function Du(e, a) {
  if (e == null) return;
  if (!Number.isFinite(e * Yl[a]) || e <= 0) throw new Error("Enter a positive duration.");
  const t = (o) => o.toLocaleString("en-US", { useGrouping: !1, maximumSignificantDigits: 21 });
  if (!Number.isInteger(e)) return `PT${t(e * Yl[a])}S`;
  const l = { seconds: "S", minutes: "M", hours: "H", days: "D" }[a];
  return (a === "days" ? "P" : "PT") + t(e) + l;
}
const Uu = { class: "work-stack work-tight" }, Eu = {
  key: 0,
  class: "work-error",
  role: "alert"
}, Zt = /* @__PURE__ */ $e({
  __name: "DurationControl",
  props: {
    modelValue: {},
    label: {},
    disabled: { type: Boolean }
  },
  emits: ["update:modelValue", "validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = "duration:" + _t(), d = q(), f = q(""), u = H(() => t.modelValue ? xa(t.modelValue) : void 0), v = H(() => d.value ?? u.value?.unit ?? "days");
    Te(() => t.modelValue, (V) => {
      f.value = "", l("validity", !V || !!u.value, o);
    }, { immediate: !0 });
    const i = H(() => t.modelValue ? xa(t.modelValue, v.value)?.amount ?? null : null);
    function c(V) {
      try {
        const x = Du(V, v.value);
        f.value = "", l("update:modelValue", x), l("validity", !0, o);
      } catch (x) {
        f.value = x.message, l("validity", !1, o);
      }
    }
    let m;
    function $(V) {
      V.target instanceof HTMLInputElement && (m = V.target.value);
    }
    function h(V) {
      if (m === void 0) return;
      const x = m;
      m = void 0, y(V, x);
    }
    function k(V) {
      m = void 0;
      const x = V.originalEvent?.target instanceof HTMLInputElement ? V.originalEvent.target.value : V.formattedValue;
      y(V.value, x);
    }
    function y(V, x) {
      if (x.trim() && (typeof V != "number" || !Number.isFinite(V))) {
        f.value = "Enter a positive duration.", l("validity", !1, o);
        return;
      }
      d.value = v.value, c(typeof V == "number" ? V : null);
    }
    function w(V) {
      const x = i.value;
      d.value = V, !(t.modelValue && !u.value) && c(x);
    }
    return At(() => l("validity", !0, o)), (V, x) => (n(), p("label", Uu, [
      G(T(e.label), 1),
      s("span", {
        class: "work-duration-control",
        style: { "max-width": "360px" },
        onInputCapture: $
      }, [
        g(r(Dt), {
          "model-value": i.value,
          "aria-label": e.label,
          min: 0,
          "aria-invalid": !!f.value || !!e.modelValue && !r(xa)(e.modelValue),
          disabled: e.disabled,
          useGrouping: !1,
          "max-fraction-digits": v.value === "seconds" ? 20 : 3,
          onInput: k,
          "onUpdate:modelValue": h
        }, null, 8, ["model-value", "aria-label", "aria-invalid", "disabled", "max-fraction-digits"]),
        g(r(fe), {
          "model-value": v.value,
          "aria-label": e.label + " unit",
          disabled: e.disabled,
          options: [{ label: "Seconds", value: "seconds" }, { label: "Minutes", value: "minutes" }, { label: "Hours", value: "hours" }, { label: "Days", value: "days" }],
          optionLabel: "label",
          optionValue: "value",
          appendTo: "self",
          "onUpdate:modelValue": x[0] || (x[0] = (E) => w(E))
        }, null, 8, ["model-value", "aria-label", "disabled"])
      ], 32),
      f.value || e.modelValue && !r(xa)(e.modelValue) ? (n(), p("span", Eu, T(f.value || `Unsupported duration: ${e.modelValue}`), 1)) : S("", !0)
    ]));
  }
}), Au = { class: "work-stack" }, Pu = { class: "work-settings-grid" }, Ou = { class: "work-stack work-tight" }, Ru = { class: "work-stack work-tight" }, Nu = {
  key: 1,
  class: "work-stack work-tight"
}, Mu = { class: "work-stack work-tight" }, Fu = { class: "work-settings-grid" }, Lu = { class: "work-row" }, Bu = { class: "work-stack work-tight" }, ju = {
  key: 0,
  class: "work-stack work-tight"
}, zu = /* @__PURE__ */ $e({
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
    function d() {
      const i = t.state.timers ?? (t.state.timers = []);
      i.push({ id: ua("timer", i), after: "P1D", then: { emit: "reminder" } });
    }
    function f(i, c) {
      delete i.after, delete i.at_field, c === "after" ? i.after = "P1D" : i.at_field = "";
    }
    function u(i, c, m) {
      m ? i[c] = m : (delete i[c], delete i.table);
    }
    function v(i, c) {
      i.then = c === "emit" ? { emit: "" } : { transition: "" };
    }
    return (i, c) => (n(), p("section", Au, [
      c[8] || (c[8] = s("h4", null, "Timers", -1)),
      (n(!0), p(te, null, de(o(), (m, $) => (n(), p("article", {
        key: m.id,
        class: "work-settings-card work-stack"
      }, [
        s("div", Pu, [
          s("label", Ou, [
            c[2] || (c[2] = G("Timer ID", -1)),
            g(r(De), {
              modelValue: m.id,
              "onUpdate:modelValue": (h) => m.id = h,
              required: "",
              pattern: "[a-z][a-z0-9_]*"
            }, null, 8, ["modelValue", "onUpdate:modelValue"])
          ]),
          s("label", Ru, [
            c[3] || (c[3] = G("Deadline", -1)),
            g(r(fe), {
              "model-value": m.at_field !== void 0 ? "at_field" : "after",
              "onUpdate:modelValue": (h) => f(m, h),
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
          m.after !== void 0 ? (n(), J(Zt, {
            key: 0,
            modelValue: m.after,
            "onUpdate:modelValue": (h) => m.after = h,
            label: "After",
            onValidity: c[0] || (c[0] = (h, k) => l("validity", k, h))
          }, null, 8, ["modelValue", "onUpdate:modelValue"])) : (n(), p("label", Nu, [
            c[4] || (c[4] = G("At field", -1)),
            g(r(fe), {
              modelValue: m.at_field,
              "onUpdate:modelValue": (h) => m.at_field = h,
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
          s("label", Mu, [
            c[5] || (c[5] = G("Duration by field", -1)),
            g(r(fe), {
              "model-value": m.by ?? "",
              "onUpdate:modelValue": (h) => u(m, "by", h),
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
        m.by ? (n(), J(jt, {
          key: 0,
          label: "Duration table",
          hint: "Map field values to ISO durations.",
          "model-value": m.table,
          shape: "object",
          "onUpdate:modelValue": (h) => m.table = h,
          onValidity: (h) => l("validity", "table-" + $, h)
        }, null, 8, ["model-value", "onUpdate:modelValue", "onValidity"])) : S("", !0),
        s("div", Fu, [
          g(Zt, {
            modelValue: m.repeat,
            "onUpdate:modelValue": (h) => m.repeat = h,
            label: "Repeat every",
            onValidity: c[1] || (c[1] = (h, k) => l("validity", k, h)),
            disabled: m.interrupting
          }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"]),
          s("label", Lu, [
            g(r(Qt), {
              modelValue: m.interrupting,
              "onUpdate:modelValue": [(h) => m.interrupting = h, (h) => m.interrupting && delete m.repeat],
              binary: ""
            }, null, 8, ["modelValue", "onUpdate:modelValue"]),
            c[6] || (c[6] = G("Interrupting", -1))
          ]),
          s("label", Bu, [
            c[7] || (c[7] = G("Then", -1)),
            g(r(fe), {
              "model-value": m.then?.transition !== void 0 ? "transition" : "emit",
              "onUpdate:modelValue": (h) => v(m, h),
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
          m.then ? (n(), p("label", ju, [
            G(T(m.then.transition !== void 0 ? "Transition ID" : "Event name"), 1),
            m.then.transition !== void 0 ? (n(), J(r(De), {
              key: 0,
              modelValue: m.then.transition,
              "onUpdate:modelValue": (h) => m.then.transition = h
            }, null, 8, ["modelValue", "onUpdate:modelValue"])) : (n(), J(r(De), {
              key: 1,
              modelValue: m.then.emit,
              "onUpdate:modelValue": (h) => m.then.emit = h
            }, null, 8, ["modelValue", "onUpdate:modelValue"]))
          ])) : S("", !0)
        ]),
        g(r(le), {
          severity: "secondary",
          onClick: (h) => o().splice($, 1),
          "aria-label": "Remove timer",
          text: "",
          size: "small"
        }, {
          default: Y(() => [
            g(r(ve), {
              icon: "tabler:trash",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        }, 8, ["onClick"])
      ]))), 128)),
      g(r(le), {
        label: "Add timer",
        severity: "secondary",
        onClick: d,
        outlined: ""
      }, {
        icon: Y(() => [
          g(r(ve), {
            icon: "tabler:plus",
            "aria-hidden": "true"
          })
        ]),
        _: 1
      })
    ]));
  }
}), Wu = ["aria-label"], qu = { class: "work-stack work-tight" }, Gu = {
  key: 0,
  class: "work-stack work-tight"
}, Ku = /* @__PURE__ */ $e({
  __name: "PrincipalSourceEditor",
  props: {
    modelValue: {},
    draft: {},
    boardId: {},
    label: {}
  },
  emits: ["update:modelValue", "validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = H(() => Array.isArray(t.modelValue) ? "principals" : "field" in t.modelValue ? "field" : "group"), d = H(() => Array.isArray(t.modelValue) ? t.modelValue : "group" in t.modelValue && t.modelValue.group ? [{ kind: "group", id: t.modelValue.group }] : []);
    function f(v) {
      l("update:modelValue", v === "field" ? { field: "" } : v === "group" ? { group: "" } : []);
    }
    function u(v) {
      l("update:modelValue", o.value === "group" ? { group: v.at(-1)?.id ?? "" } : v);
    }
    return Bo(() => l("validity", Array.isArray(t.modelValue) ? t.modelValue.length > 0 : "field" in t.modelValue ? !!t.modelValue.field : !!t.modelValue.group)), At(() => l("validity", !0)), (v, i) => (n(), p("section", {
      class: "work-stack work-tight",
      "aria-label": e.label
    }, [
      s("label", qu, [
        G(T(e.label) + " source", 1),
        g(r(fe), {
          "model-value": o.value,
          "aria-label": e.label + " source",
          options: [{ label: "Group", value: "group" }, { label: "People and groups", value: "principals" }, { label: "Principal field", value: "field" }],
          optionLabel: "label",
          optionValue: "value",
          appendTo: "self",
          "onUpdate:modelValue": f
        }, null, 8, ["model-value", "aria-label"])
      ]),
      "field" in e.modelValue ? (n(), p("label", Gu, [
        i[1] || (i[1] = G("Principal field", -1)),
        g(r(fe), {
          "model-value": e.modelValue.field,
          "aria-label": e.label + " field",
          options: e.draft.fields?.filter((c) => c.type === "principal").map((c) => ({ label: c.title || c.code, value: c.code })) ?? [],
          optionLabel: "label",
          optionValue: "value",
          appendTo: "self",
          "onUpdate:modelValue": i[0] || (i[0] = (c) => l("update:modelValue", { field: c }))
        }, null, 8, ["model-value", "aria-label", "options"])
      ])) : (n(), J(eo, {
        key: 1,
        "board-id": e.boardId,
        label: e.label,
        kinds: o.value === "group" ? "group" : "user,group,service",
        "model-value": d.value,
        "onUpdate:modelValue": u
      }, null, 8, ["board-id", "label", "kinds", "model-value"]))
    ], 8, Wu));
  }
}), Hu = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, Yu = {
  class: "work-stack work-tight",
  "aria-label": "Approval sources"
}, Xu = { class: "work-stack work-tight" }, Ju = {
  key: 0,
  class: "work-stack work-tight"
}, Zu = ["kinds", "placeholder", "value"], Qu = {
  key: 2,
  class: "work-muted work-small",
  role: "status"
}, _u = {
  key: 3,
  class: "work-chips"
}, ec = {
  key: 4,
  class: "work-error work-small",
  role: "alert"
}, tc = {
  key: 5,
  class: "work-muted work-small"
}, ac = { class: "work-row" }, lc = { class: "work-row work-small" }, oc = /* @__PURE__ */ $e({
  __name: "ApproversEditor",
  props: {
    approvals: {},
    boardId: {}
  },
  emits: ["validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, { principalLabel: o, rememberPrincipal: d, nameError: f } = zo(() => t.boardId ?? "", () => {
      const y = t.approvals.from;
      return Array.isArray(y) ? qi(y) : "group" in y && y.group ? [{ kind: "group", id: y.group }] : [];
    }), u = q(), v = H(() => Array.isArray(t.approvals.from) ? "principals" : "field" in t.approvals.from ? "field" : "group"), i = H(() => {
      const y = t.approvals.from;
      return "group" in y && y.group ? JSON.stringify({ type: "group", principal_id: y.group }) : "{}";
    }), c = [
      { label: "Group members", value: "group" },
      { label: "People and groups", value: "principals" },
      { label: "Principal field", value: "field" }
    ], m = H(() => Array.isArray(t.approvals.from) ? t.approvals.from.some((y) => y.kind === "group") || t.approvals.from.length >= t.approvals.min : "field" in t.approvals.from ? !!t.approvals.from.field : !!t.approvals.from.group);
    Bo(() => l("validity", Number.isSafeInteger(t.approvals.min) && t.approvals.min > 0 && m.value)), At(() => l("validity", !0)), Oa(async () => {
      u.value = await Bt("wc-principal-picker");
    });
    function $(y) {
      t.approvals.from = y === "group" ? { group: "" } : y === "field" ? { field: "" } : [];
    }
    function h(y) {
      const w = y.detail, V = w?.principal_id ?? w?.id;
      if (v.value === "group") {
        t.approvals.from = { group: V ?? "" };
        return;
      }
      if (!V || !Array.isArray(t.approvals.from)) return;
      const x = { kind: w.type ?? w.kind ?? "user", id: V };
      w.label && d(x, w.label), t.approvals.from.some((E) => E.id === V && E.kind === x.kind) || t.approvals.from.push(x);
    }
    function k(y) {
      Array.isArray(t.approvals.from) && t.approvals.from.splice(y, 1);
    }
    return (y, w) => (n(), p(te, null, [
      r(f) ? (n(), p("p", Hu, T(r(f)), 1)) : S("", !0),
      s("section", Yu, [
        s("label", Xu, [
          w[4] || (w[4] = G("Approval source ", -1)),
          g(r(fe), {
            "model-value": v.value,
            "aria-label": "Approval source",
            "onUpdate:modelValue": w[0] || (w[0] = (V) => $(V)),
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            options: c
          }, null, 8, ["model-value"])
        ]),
        "field" in e.approvals.from ? (n(), p("label", Ju, [
          w[5] || (w[5] = G("Principal field", -1)),
          g(r(De), {
            modelValue: e.approvals.from.field,
            "onUpdate:modelValue": w[1] || (w[1] = (V) => e.approvals.from.field = V),
            "aria-label": "Principal field"
          }, null, 8, ["modelValue"])
        ])) : u.value ? (n(), p("wc-principal-picker", {
          key: v.value,
          kinds: v.value === "group" ? "group" : "user,group",
          placeholder: v.value === "group" ? "Select a group…" : "Select a person or group…",
          value: i.value,
          onConfigChanged: h
        }, null, 40, Zu)) : (n(), p("p", Qu, T(u.value === !1 ? "The principal picker is unavailable." : "Loading approver picker…"), 1)),
        Array.isArray(e.approvals.from) ? (n(), p("div", _u, [
          (n(!0), p(te, null, de(e.approvals.from, (V, x) => (n(), J(r(dt), {
            key: V.kind + ":" + V.id,
            class: "kx-tag-sm",
            severity: "secondary"
          }, {
            default: Y(() => [
              G(T(r(o)(V)), 1),
              g(r(le), {
                "aria-label": "Remove approver " + (x + 1),
                text: "",
                severity: "secondary",
                size: "small",
                onClick: (E) => k(x)
              }, {
                default: Y(() => [
                  g(r(ve), {
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
        Array.isArray(e.approvals.from) && !m.value ? (n(), p("p", ec, "Select at least " + T(e.approvals.min) + " distinct principals, or lower the minimum.", 1)) : "group" in e.approvals.from && !e.approvals.from.group ? (n(), p("p", tc, "Choose the group that can approve this state.")) : S("", !0),
        s("label", ac, [
          w[6] || (w[6] = s("span", { class: "work-spacer" }, "Approvals needed", -1)),
          g(r(Dt), {
            modelValue: e.approvals.min,
            "onUpdate:modelValue": w[2] || (w[2] = (V) => e.approvals.min = V),
            min: 1,
            required: "",
            useGrouping: !1
          }, null, 8, ["modelValue"])
        ]),
        s("label", lc, [
          w[7] || (w[7] = s("span", { class: "work-spacer" }, "The person who moves the item here cannot approve this visit", -1)),
          g(r(rt), {
            modelValue: e.approvals.prevent_self,
            "onUpdate:modelValue": w[3] || (w[3] = (V) => e.approvals.prevent_self = V),
            "aria-label": "The person who moves the item here cannot approve this visit"
          }, null, 8, ["modelValue"])
        ])
      ])
    ], 64));
  }
}), ic = {
  class: "work-state-settings work-stack",
  "aria-label": "State settings"
}, nc = { class: "work-process-kind" }, sc = { class: "work-stack" }, rc = { class: "work-row" }, dc = { class: "work-row" }, uc = { class: "work-row" }, cc = { class: "work-stack work-tight" }, vc = { class: "work-row" }, fc = { class: "work-stack work-tight" }, mc = { class: "work-row" }, pc = { class: "work-row" }, bc = { class: "work-stack work-tight" }, hc = { class: "work-stack" }, gc = { class: "work-row" }, yc = { class: "work-row" }, kc = { class: "work-stack work-tight" }, wc = { class: "work-stack work-tight" }, $c = {
  key: 0,
  class: "work-row"
}, Vc = { class: "work-stack" }, xc = { class: "work-stack work-tight" }, Cc = { class: "work-row" }, Sc = /* @__PURE__ */ $e({
  __name: "StateSettings",
  props: {
    state: {},
    process: {},
    draft: {},
    boardId: {}
  },
  emits: ["validity", "kind"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = H(() => (t.process.transitions ?? []).filter((v) => v.from === "any" || v.from.includes(t.state.id))), d = [{ value: "human", icon: "user" }, { value: "gate", icon: "shield-check" }, { value: "automated", icon: "bolt" }, { value: "parallel", icon: "arrows-split" }];
    function f(v) {
      const i = t.state;
      i.kind = v, delete i.run, delete i.release_when, delete i.regions, delete i.join, delete i.due, (v === "automated" || v === "gate") && delete i.awaiting, v === "automated" && (i.run = { stage: i.id, retry: { max: 1, backoff: "PT1M" } }), v === "gate" && (i.release_when = { approvals: { min: 1, from: { group: "" }, prevent_self: !0 } }), v === "parallel" && (i.regions = [{ id: "region_1", initial: t.process.states.find((c) => c.id !== i.id)?.id ?? "" }], i.join = "all"), l("kind", v);
    }
    function u(v) {
      t.state.run && (v ? t.state.run.on_fail = v : delete t.state.run.on_fail);
    }
    return (v, i) => (n(), p("section", ic, [
      i[57] || (i[57] = s("h4", { class: "work-process-group" }, "Who moves the item on", -1)),
      g(r(Zl), {
        class: "work-process-kinds",
        "model-value": e.state.kind ?? "human",
        options: d.map((c) => ({
          ...c,
          label: r(_a)(c.value)
        })),
        optionLabel: "label",
        optionValue: "value",
        optionDisabled: "disabled",
        "allow-empty": !1,
        "aria-label": "Who moves the item on",
        "onUpdate:modelValue": f
      }, {
        option: Y(({ option: c }) => [
          s("span", nc, [
            g(r(ve), {
              icon: "tabler:" + c.icon
            }, null, 8, ["icon"]),
            s("span", null, T(c.label), 1)
          ])
        ]),
        _: 1
      }, 8, ["model-value", "options"]),
      e.state.kind === "gate" && e.state.release_when ? (n(), p(te, { key: 0 }, [
        i[35] || (i[35] = s("h4", { class: "work-process-group" }, "Approval", -1)),
        e.state.release_when.approvals ? (n(), J(oc, {
          key: 0,
          "board-id": e.boardId,
          approvals: e.state.release_when.approvals,
          onValidity: i[0] || (i[0] = (c) => l("validity", "approvers", c))
        }, null, 8, ["board-id", "approvals"])) : S("", !0),
        g(Fe, {
          class: "work-process-options",
          label: "Release options"
        }, {
          default: Y(() => [
            s("div", sc, [
              s("label", rc, [
                i[34] || (i[34] = s("span", { class: "work-spacer" }, "Require approvals", -1)),
                g(r(rt), {
                  "model-value": !!e.state.release_when.approvals,
                  "aria-label": "Require approvals",
                  "onUpdate:modelValue": i[1] || (i[1] = (c) => e.state.release_when.approvals = c ? { min: 1, from: { group: "" }, prevent_self: !0 } : void 0)
                }, null, 8, ["model-value"])
              ]),
              g(Zt, {
                modelValue: e.state.release_when.wait,
                "onUpdate:modelValue": i[2] || (i[2] = (c) => e.state.release_when.wait = c),
                label: "Wait before release",
                onValidity: i[3] || (i[3] = (c, m) => l("validity", m, c))
              }, null, 8, ["modelValue"]),
              g(_l, {
                label: "Release when",
                draft: e.draft,
                "board-id": e.boardId,
                modelValue: e.state.release_when.when,
                "onUpdate:modelValue": i[4] || (i[4] = (c) => e.state.release_when.when = c),
                onValidity: i[5] || (i[5] = (c) => l("validity", "release", c))
              }, null, 8, ["draft", "board-id", "modelValue"])
            ])
          ]),
          _: 1
        })
      ], 64)) : S("", !0),
      i[58] || (i[58] = s("h4", { class: "work-process-group" }, "Limit", -1)),
      s("label", dc, [
        i[36] || (i[36] = s("span", { class: "work-spacer" }, "Items allowed here", -1)),
        g(Eo, {
          draft: e.draft,
          state: e.state.id,
          label: "Items allowed here"
        }, null, 8, ["draft", "state"])
      ]),
      s("label", uc, [
        i[37] || (i[37] = s("span", { class: "work-spacer" }, [
          G("Refuse moves over the limit"),
          s("small", { class: "work-muted work-block" }, "Off only warns")
        ], -1)),
        g(Eo, {
          draft: e.draft,
          state: e.state.id,
          label: "Refuse moves over the limit",
          hard: ""
        }, null, 8, ["draft", "state"])
      ]),
      i[59] || (i[59] = s("h4", { class: "work-process-group" }, "Required on entry", -1)),
      g(bt, {
        label: "Required fields",
        options: e.draft.fields?.map((c) => ({ value: c.code, label: c.title || c.code })) ?? [],
        modelValue: e.state.require,
        "onUpdate:modelValue": i[6] || (i[6] = (c) => e.state.require = c)
      }, null, 8, ["options", "modelValue"]),
      !e.state.kind || e.state.kind === "human" ? (n(), J(Zt, {
        key: 1,
        modelValue: e.state.due,
        "onUpdate:modelValue": i[7] || (i[7] = (c) => e.state.due = c),
        label: "Time allowed in this state",
        onValidity: i[8] || (i[8] = (c, m) => l("validity", m, c))
      }, null, 8, ["modelValue"])) : S("", !0),
      e.state.kind === "automated" && e.state.run ? (n(), p(te, { key: 2 }, [
        i[46] || (i[46] = s("h4", { class: "work-process-group" }, "Automation", -1)),
        s("label", cc, [
          i[38] || (i[38] = G("Run label", -1)),
          g(r(De), {
            modelValue: e.state.run.stage,
            "onUpdate:modelValue": i[9] || (i[9] = (c) => e.state.run.stage = c),
            "aria-label": "Run label",
            required: ""
          }, null, 8, ["modelValue"])
        ]),
        g(Iu, {
          modelValue: e.state.run.flow_ref,
          "onUpdate:modelValue": i[10] || (i[10] = (c) => e.state.run.flow_ref = c),
          onValidity: i[11] || (i[11] = (c) => l("validity", "flow", c))
        }, null, 8, ["modelValue"]),
        g(Zt, {
          modelValue: e.state.run.timeout,
          "onUpdate:modelValue": i[12] || (i[12] = (c) => e.state.run.timeout = c),
          label: "Attempt timeout",
          onValidity: i[13] || (i[13] = (c, m) => l("validity", m, c))
        }, null, 8, ["modelValue"]),
        i[47] || (i[47] = s("small", { class: "work-muted" }, "Blank uses the board timeout, or one hour.", -1)),
        s("label", vc, [
          i[39] || (i[39] = s("span", { class: "work-spacer" }, "Maximum visits", -1)),
          g(r(Dt), {
            "model-value": e.state.run.max_visits ?? null,
            "aria-label": "Maximum visits",
            min: 1,
            useGrouping: !1,
            placeholder: "Board default",
            "onUpdate:modelValue": i[14] || (i[14] = (c) => e.state.run.max_visits = c ?? void 0)
          }, null, 8, ["model-value"])
        ]),
        s("label", fc, [
          i[40] || (i[40] = G("When visits are exhausted", -1)),
          g(r(fe), {
            "model-value": e.state.run.on_exhausted,
            "aria-label": "When visits are exhausted",
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            showClear: "",
            options: (e.process.transitions ?? []).filter((c) => !c.auto).map((c) => ({ label: r(Ke)(c), value: c.id })),
            "onUpdate:modelValue": i[15] || (i[15] = (c) => e.state.run.on_exhausted = c || void 0)
          }, null, 8, ["model-value", "options"])
        ]),
        i[48] || (i[48] = s("small", { class: "work-muted" }, "Blank records a failed run and stops automation. A route must leave every incoming state or be global.", -1)),
        s("label", mc, [
          i[41] || (i[41] = s("span", { class: "work-spacer" }, "Retry if it fails", -1)),
          g(r(rt), {
            "model-value": !!e.state.run.retry,
            "aria-label": "Retry if it fails",
            "onUpdate:modelValue": i[16] || (i[16] = (c) => e.state.run.retry = c ? { max: 1, backoff: "PT1M" } : void 0)
          }, null, 8, ["model-value"])
        ]),
        e.state.run.retry ? (n(), p(te, { key: 0 }, [
          s("label", pc, [
            i[42] || (i[42] = s("span", { class: "work-spacer" }, "Maximum attempts", -1)),
            g(r(Dt), {
              modelValue: e.state.run.retry.max,
              "onUpdate:modelValue": i[17] || (i[17] = (c) => e.state.run.retry.max = c),
              min: 1,
              useGrouping: !1
            }, null, 8, ["modelValue"])
          ]),
          g(Zt, {
            modelValue: e.state.run.retry.backoff,
            "onUpdate:modelValue": i[18] || (i[18] = (c) => e.state.run.retry.backoff = c),
            label: "Wait between attempts",
            onValidity: i[19] || (i[19] = (c, m) => l("validity", m, c))
          }, null, 8, ["modelValue"])
        ], 64)) : S("", !0),
        (n(), p(te, null, de([{ key: "on_pass", label: "On success" }, { key: "on_cancel", label: "On cancellation" }], (c) => s("label", {
          key: c.key,
          class: "work-stack work-tight"
        }, [
          G(T(c.label), 1),
          g(r(fe), {
            "model-value": e.state.run[c.key],
            "aria-label": c.label,
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            showClear: "",
            options: o.value.map((m) => ({ label: r(Ke)(m), value: m.id })),
            "onUpdate:modelValue": (m) => e.state.run[c.key] = m || void 0
          }, null, 8, ["model-value", "aria-label", "options", "onUpdate:modelValue"])
        ])), 64)),
        s("label", bc, [
          i[43] || (i[43] = G("If it fails, go to", -1)),
          g(r(fe), {
            "aria-label": "If it fails, go to",
            "model-value": e.state.run.on_fail,
            "onUpdate:modelValue": u,
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            showClear: "",
            options: o.value.map((c) => ({
              label: r(Ke)(c) + " → " + r(pe)(e.process.states.find((m) => m.id === c.to)),
              value: c.id
            }))
          }, null, 8, ["model-value", "options"])
        ]),
        g(Fe, {
          class: "work-disclosure",
          label: "Board automation defaults"
        }, {
          default: Y(() => [
            s("div", hc, [
              i[45] || (i[45] = s("p", { class: "work-muted" }, "These values apply to automated states without their own limit.", -1)),
              g(Zt, {
                "model-value": e.draft.policy?.stage_timeout,
                label: "Default attempt timeout",
                "onUpdate:modelValue": i[20] || (i[20] = (c) => (e.draft.policy ??= {}).stage_timeout = c),
                onValidity: i[21] || (i[21] = (c, m) => l("validity", m, c))
              }, null, 8, ["model-value"]),
              s("label", gc, [
                i[44] || (i[44] = s("span", { class: "work-spacer" }, "Default maximum visits", -1)),
                g(r(Dt), {
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
      ], 64)) : S("", !0),
      e.state.kind === "parallel" && e.state.regions ? (n(), p(te, { key: 3 }, [
        i[53] || (i[53] = s("h4", { class: "work-process-group" }, "Lanes", -1)),
        (n(!0), p(te, null, de(e.state.regions, (c, m) => (n(), p("div", {
          key: m,
          class: "work-process-value work-stack work-tight"
        }, [
          s("div", yc, [
            s("span", null, "Lane " + T(m + 1), 1),
            i[49] || (i[49] = s("span", { class: "work-spacer" }, null, -1)),
            g(r(le), {
              severity: "danger",
              text: "",
              size: "small",
              "aria-label": "Remove lane",
              onClick: ($) => e.state.regions.splice(m, 1)
            }, {
              default: Y(() => [
                g(r(ve), { icon: "tabler:trash" })
              ]),
              _: 1
            }, 8, ["onClick"])
          ]),
          s("label", kc, [
            i[50] || (i[50] = G("Starts at", -1)),
            g(r(fe), {
              "aria-label": "Lane starts at",
              modelValue: c.initial,
              "onUpdate:modelValue": ($) => c.initial = $,
              appendTo: "self",
              optionLabel: "label",
              optionValue: "value",
              options: e.process.states.filter(($) => $.id !== e.state.id).map(($) => ({ label: r(pe)($), value: $.id }))
            }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
          ])
        ]))), 128)),
        g(r(le), {
          label: "Add lane",
          severity: "secondary",
          outlined: "",
          size: "small",
          onClick: i[23] || (i[23] = (c) => e.state.regions.push({
            id: r(ua)("region", e.state.regions),
            initial: e.process.states.find((m) => m.id !== e.state.id)?.id ?? ""
          }))
        }, {
          icon: Y(() => [
            g(r(ve), { icon: "tabler:plus" })
          ]),
          _: 1
        }),
        s("label", wc, [
          i[51] || (i[51] = G("Finish rule", -1)),
          g(r(fe), {
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
        typeof e.state.join == "number" ? (n(), p("label", $c, [
          i[52] || (i[52] = s("span", { class: "work-spacer" }, "Lanes needed", -1)),
          g(r(Dt), {
            modelValue: e.state.join,
            "onUpdate:modelValue": i[25] || (i[25] = (c) => e.state.join = c),
            min: 1,
            max: e.state.regions.length,
            useGrouping: !1
          }, null, 8, ["modelValue", "max"])
        ])) : S("", !0)
      ], 64)) : S("", !0),
      g(Fe, {
        class: "work-disclosure",
        label: "Advanced state settings"
      }, {
        default: Y(() => [
          s("div", Vc, [
            i[56] || (i[56] = s("h4", { class: "work-process-group" }, "Assignment and conditions", -1)),
            s("label", xc, [
              i[54] || (i[54] = G("Stage label", -1)),
              g(r(De), {
                "model-value": e.state.stage,
                "aria-label": "Stage label",
                "onUpdate:modelValue": i[26] || (i[26] = (c) => e.state.stage = c || void 0)
              }, null, 8, ["model-value"])
            ]),
            !e.state.kind || e.state.kind === "human" || e.state.kind === "parallel" ? (n(), p(te, { key: 0 }, [
              s("label", Cc, [
                g(r(rt), {
                  "model-value": !!e.state.awaiting,
                  "aria-label": "Awaiting people",
                  "onUpdate:modelValue": i[27] || (i[27] = (c) => e.state.awaiting = c ? { group: "" } : void 0)
                }, null, 8, ["model-value"]),
                i[55] || (i[55] = G("Awaiting people", -1))
              ]),
              e.state.awaiting ? (n(), J(Ku, {
                key: 0,
                modelValue: e.state.awaiting,
                "onUpdate:modelValue": i[28] || (i[28] = (c) => e.state.awaiting = c),
                draft: e.draft,
                "board-id": e.boardId,
                label: "Awaiting",
                onValidity: i[29] || (i[29] = (c) => l("validity", "awaiting", c))
              }, null, 8, ["modelValue", "draft", "board-id"])) : S("", !0)
            ], 64)) : S("", !0),
            g(eo, {
              "board-id": e.boardId,
              modelValue: e.state.assign,
              "onUpdate:modelValue": i[30] || (i[30] = (c) => e.state.assign = c),
              label: "Assign to"
            }, null, 8, ["board-id", "modelValue"]),
            g(jt, {
              label: "State checks",
              example: ["installed-check"],
              "model-value": e.state.invariants,
              shape: "array",
              "onUpdate:modelValue": i[31] || (i[31] = (c) => e.state.invariants = c),
              onValidity: i[32] || (i[32] = (c) => l("validity", "invariants", c))
            }, null, 8, ["model-value"]),
            g(zu, {
              state: e.state,
              draft: e.draft,
              onValidity: i[33] || (i[33] = (c, m) => l("validity", "timer-" + c, m))
            }, null, 8, ["state", "draft"])
          ])
        ]),
        _: 1
      })
    ]));
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
}, Ec = ["aria-label", "aria-keyshortcuts", "onKeydown"], Ac = { class: "work-row" }, Pc = {
  key: 0,
  class: "work-stack work-tight"
}, Oc = { class: "work-process-meaning" }, Rc = {
  key: 1,
  class: "work-muted"
}, Nc = { class: "work-stack work-tight" }, Mc = { class: "work-next-transition work-stack work-tight" }, Fc = { class: "work-row work-wrap" }, Lc = { class: "work-process-inspector-foot" }, Bc = { class: "work-row work-transition-actions" }, jc = { class: "work-process-meaning" }, zc = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, Wc = { class: "work-stack work-tight" }, qc = { class: "work-stack" }, Gc = { class: "work-stack work-tight" }, Kc = {
  key: 0,
  class: "work-muted"
}, Hc = { class: "work-stack work-tight" }, Yc = { class: "work-dialog-actions" }, Xc = /* @__PURE__ */ $e({
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
    const t = e, l = a, o = nl(rl, void 0), d = H(() => t.draft.processes ?? []), f = q(!1), u = q(""), v = q(""), i = q(""), c = q("Map"), m = q("");
    Te(() => t.createForItemType, (M, F) => {
      !M && !F || (u.value = "", f.value = !!M);
    }, { immediate: !0 });
    const $ = q(!1), h = q(), k = q(), y = q(), w = q(), V = q(), x = q(), E = q(!1), D = /* @__PURE__ */ new WeakMap();
    let j;
    async function ie() {
      E.value = !0, await It(), V.value?.querySelector('[aria-label="State name"]')?.focus();
    }
    const L = H(() => d.value.find((M) => M.id === v.value) ?? d.value[0]), re = H(() => {
      const M = h.value, F = L.value, W = M && D.get(M);
      if (!M || !F || !W) return;
      const { entry: _, continuation: Ce } = W;
      if (!F.transitions?.includes(_) || _.to !== M.id) return;
      const Ue = [
        _.from === "any" ? "Any state" : _.from.map((et) => pe(F.states.find((lt) => lt.id === et))).join(", "),
        pe(M)
      ];
      return Ce && F.transitions.includes(Ce) && (Ce.from === "any" || Ce.from.includes(M.id)) && Ue.push(pe(F.states.find((et) => et.id === Ce.to))), Ue.join(" → ");
    }), ue = q(!1);
    function me(M) {
      ue.value = !0, c.value = M;
    }
    function ce() {
      !ue.value && w.value?.clientWidth && (c.value = w.value.clientWidth < 480 && (L.value?.states.length ?? 0) > 6 ? "List" : "Map");
    }
    let ne;
    Oa(() => {
      ce(), w.value && typeof ResizeObserver < "u" && (ne = new ResizeObserver(ce), ne.observe(w.value));
    }), At(() => ne?.disconnect()), Te(L, () => {
      ue.value = !1, ce();
    });
    function P() {
      E.value = !1, $.value = !1, h.value = void 0, k.value = void 0, i.value = "", j = void 0;
    }
    async function ae() {
      const M = j, F = o?.selected.value;
      F?.startsWith("workflow/") && o?.choose("workflow", F.slice(9), !1), P(), await It(), M?.isConnected ? M.focus() : z();
    }
    function z() {
      c.value === "Map" ? y.value?.focus() : x.value?.focus();
    }
    async function ge() {
      await It(), V.value && (V.value.scrollTop = 0, V.value.focus({ preventScroll: !0 }), (V.value.closest(".work-settings-shell")?.clientWidth ?? 1 / 0) <= 700 && V.value.scrollIntoView?.({ block: "nearest" }));
    }
    function Ve(M, F) {
      j = F, E.value = !1, $.value = !1, h.value = M, k.value = void 0, m.value = "", i.value = "", L.value && o?.choose("workflow", L.value.id + ".state." + M.id, !0), ge();
    }
    async function B(M) {
      m.value = "", $.value = M, await It();
      const F = M ? '[role="combobox"]' : "button";
      V.value?.querySelector(".work-next-transition " + F)?.focus();
    }
    function I(M, F) {
      j = F, E.value = !1, k.value = M, h.value = void 0, i.value = "", L.value && o?.choose("workflow", L.value.id + ".transition." + M.id, !0), ge();
    }
    Te([L, c], P), Te([() => o?.selected.value, d], async ([M], F) => {
      if (!M?.startsWith("workflow/")) {
        F?.[0]?.startsWith("workflow/") && P();
        return;
      }
      const [W, _, Ce] = M.slice(9).split("."), Ue = d.value.find((Qe) => Qe.id === W);
      if (!Ue || L.value !== Ue && (v.value = Ue.id, await It(), o?.selected.value !== M))
        return;
      const et = _ === "state" ? Ue.states.find((Qe) => Qe.id === Ce) : void 0, lt = _ === "transition" ? Ue.transitions?.find((Qe) => Qe.id === Ce) : void 0;
      et === h.value && lt === k.value || (P(), h.value = et, k.value = lt);
    }, { immediate: !0, flush: "post" });
    const C = H(() => {
      if (!t.counts || !L.value) return;
      const M = t.countTypes?.filter((F) => F.process === L.value?.id) ?? [];
      return Object.fromEntries(L.value.states.map((F) => [
        F.id,
        M.reduce((W, _) => W + (t.counts?.[_.id]?.[F.id] ?? 0), 0)
      ]));
    }), U = H(() => (t.guards ?? []).filter((M) => t.draft.plugins?.some((F) => F.use === M.plugin))), Q = H(() => Object.keys(t.draft.policy?.wip ?? {}).filter((M) => !d.value.some((F) => F.states.some((W) => W.id === M))));
    function b() {
      const M = u.value.trim();
      if (!M) return;
      const F = M.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "") || "process", W = (/^[a-z]/.test(F) ? F : "process_" + F).slice(0, 40), _ = d.value.some((Ce) => Ce.id === W) ? ua(W, d.value) : W;
      (t.draft.processes ??= []).push({ id: _, name: M, initial: "todo", states: [{ id: "todo", name: "To do", category: "unstarted" }], transitions: [] }), v.value = _, u.value = "", f.value = !1, l("created", _);
    }
    function A() {
      f.value = !1, l("cancel-creation");
    }
    async function Z(M, F) {
      const W = { id: ua("state", M.states), name: "New state", category: "started" }, _ = Ha(M), Ce = _.at(-1), Ue = h.value ?? (Ce?.category === "completed" ? _.at(-2) : Ce), et = Ue ? M.states.indexOf(Ue) : -1, lt = Ue ? et + 1 : M.states.length, Qe = Ue && M.transitions?.filter((ze) => ze.from !== "any" && ze.from.length === 1 && ze.from[0] === Ue.id && !ho(M, ze).length), He = Qe?.find((ze) => ze.default) ?? Qe?.find((ze) => M.states.findIndex((ot) => ot.id === ze.to) > et);
      M.states.splice(lt, 0, W);
      const Ee = M.states[lt];
      if (Ue && Ue.category !== "completed" && Ue.category !== "canceled") {
        const ze = M.transitions ??= [], ot = He?.auto === !0 && He.default === !0, ht = {
          id: ua("transition", ze),
          name: "Continue",
          from: [He ? Ee.id : Ue.id],
          to: He?.to ?? Ee.id,
          ...ot ? { auto: !0, default: !0 } : {}
        };
        He && (He.to = Ee.id), ze.push(ht);
        const Ot = ze[ze.length - 1];
        D.set(Ee, { entry: He ?? Ot, continuation: He ? Ot : void 0, automatic: ot });
      }
      Ve(Ee, F), await ie();
    }
    function X(M, F) {
      const W = D.get(M), _ = W?.continuation;
      !_ || W.automatic || _.from === "any" || _.from.length !== 1 || _.from[0] !== M.id || (F === "gate" ? (_.auto = !0, _.default = !0) : (delete _.auto, delete _.default));
    }
    function we(M, F, W = j) {
      const _ = L.value;
      if (!_ || !F || M === F) return;
      const Ce = _.transitions ??= [], Ue = `to_${F}`;
      let et = Ue.slice(0, 40), lt = 2;
      for (; Ce.some((He) => He.id === et); ) {
        const He = `_${lt++}`;
        et = Ue.slice(0, 40 - He.length) + He;
      }
      const Qe = { id: et, name: `To ${pe(_.states.find((He) => He.id === F)).toLowerCase()}`, from: [M], to: F };
      Ce.push(Qe), I(Qe, W);
    }
    function xe(M, F) {
      const W = h.value ?? M.states.find((Ue) => Ue.id === M.initial) ?? M.states[0], _ = M.states.find((Ue) => Ue.id !== W?.id);
      if (!W || !_) return;
      const Ce = { id: ua("transition", M.transitions ?? []), name: "To " + pe(_), from: [W.id], to: _.id };
      (M.transitions ??= []).push(Ce), I(Ce, F);
    }
    async function Oe(M) {
      const F = L.value, W = F?.transitions?.indexOf(M) ?? -1;
      if (!F || W < 0) return;
      const _ = ho(F, M);
      if (_.length) {
        i.value = `Used by ${_.join(", ")}. Update those references first.`;
        return;
      }
      F.transitions.splice(W, 1), P(), await It(), z();
    }
    function N(M) {
      !k.value || M.defaultPrevented || M.repeat || (M.preventDefault(), Oe(k.value));
    }
    function se(M, F) {
      const W = Ki(M, F);
      if (W.length) {
        i.value = `${pe(F)} is used by ${W.join(", ")}. Update these references first.`;
        return;
      }
      M.states.splice(M.states.indexOf(F), 1), ae();
    }
    async function O(M) {
      const F = t.draft.item_types?.filter((_) => _.process === M.id).map((_) => _.title || "Untitled item type") ?? [];
      if (F.length) {
        i.value = `Used by ${F.join(", ")}. Choose a different process for those item types first.`;
        return;
      }
      const W = await t.guardRemoval?.("processes", M.id);
      if (W) {
        i.value = W;
        return;
      }
      Ra(t.draft, "processes", M.id), v.value = "", P();
    }
    return (M, F) => (n(), p("section", {
      ref_key: "editor",
      ref: w,
      class: "work-process-editor work-stack",
      "aria-label": "Process editor",
      onKeydown: F[17] || (F[17] = Ye((W) => V.value && ae(), ["esc"]))
    }, [
      i.value && !k.value ? (n(), p("p", Tc, T(i.value), 1)) : S("", !0),
      (n(!0), p(te, null, de(e.issues?.filter((W) => W.code === "process " + L.value?.id) ?? [], (W) => (n(), p("p", {
        key: W.what + W.detail,
        class: "work-error work-small",
        role: "alert"
      }, T(r(sl)(W)) + " · " + T(W.what), 1))), 128)),
      L.value ? (n(), p("div", {
        key: 1,
        class: $t(["work-process-builder", { "work-process-inspecting": h.value || k.value }])
      }, [
        s("div", {
          ref_key: "tools",
          ref: x,
          class: "work-process-controls",
          role: "toolbar",
          "aria-label": "Process tools",
          tabindex: "-1"
        }, [
          d.value.length > 1 ? (n(), J(r(fe), {
            key: 0,
            "model-value": L.value.id,
            "aria-label": "Process",
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            options: d.value.map((W) => ({ label: W.name || "Untitled process", value: W.id })),
            "onUpdate:modelValue": F[0] || (F[0] = (W) => v.value = W)
          }, null, 8, ["model-value", "options"])) : (n(), p("strong", Ic, T(L.value.name || "Untitled process"), 1)),
          g(r(le), {
            label: "Add state",
            severity: "secondary",
            outlined: "",
            onClick: F[1] || (F[1] = (W) => Z(L.value, W.currentTarget))
          }, {
            icon: Y(() => [
              g(r(ve), { icon: "tabler:plus" })
            ]),
            _: 1
          }),
          g(r(le), {
            label: "Add transition",
            severity: "secondary",
            outlined: "",
            disabled: L.value.states.length < 2,
            onClick: F[2] || (F[2] = (W) => xe(L.value, W.currentTarget))
          }, null, 8, ["disabled"]),
          g(r(fe), {
            modelValue: L.value.initial,
            "onUpdate:modelValue": F[3] || (F[3] = (W) => L.value.initial = W),
            "aria-label": "Starts in " + r(pe)(L.value.states.find((W) => W.id === L.value.initial)),
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            options: L.value.states.map((W) => ({ label: r(pe)(W), value: W.id }))
          }, {
            value: Y(() => [
              s("span", Dc, "Starts in " + T(r(pe)(L.value.states.find((W) => W.id === L.value.initial))), 1)
            ]),
            _: 1
          }, 8, ["modelValue", "aria-label", "options"]),
          F[18] || (F[18] = s("span", { class: "work-spacer" }, null, -1)),
          c.value === "Map" ? (n(), p("div", Uc, [
            g(r(le), {
              label: "Fit",
              title: "Fit the map to a readable width",
              text: "",
              severity: "secondary",
              size: "small",
              onClick: F[4] || (F[4] = (W) => y.value?.fit())
            }, {
              icon: Y(() => [
                g(r(ve), { icon: "tabler:arrows-maximize" })
              ]),
              _: 1
            }),
            c.value === "Map" ? (n(), J(r(le), {
              key: 0,
              "aria-label": "Zoom out",
              title: "Zoom out",
              text: "",
              severity: "secondary",
              size: "small",
              onClick: F[5] || (F[5] = (W) => y.value?.zoomOut())
            }, {
              default: Y(() => [
                g(r(ve), { icon: "tabler:minus" })
              ]),
              _: 1
            })) : S("", !0),
            c.value === "Map" ? (n(), J(r(le), {
              key: 1,
              "aria-label": "Zoom in",
              title: "Zoom in",
              text: "",
              severity: "secondary",
              size: "small",
              onClick: F[6] || (F[6] = (W) => y.value?.zoomIn())
            }, {
              default: Y(() => [
                g(r(ve), { icon: "tabler:plus" })
              ]),
              _: 1
            })) : S("", !0)
          ])) : S("", !0),
          g(r(Zl), {
            "model-value": c.value,
            "onUpdate:modelValue": me,
            options: ["Map", "List"],
            "allow-empty": !1,
            "aria-label": "Process layout"
          }, null, 8, ["model-value"]),
          g(r(le), {
            label: "New process",
            "aria-label": "New process",
            text: "",
            severity: "secondary",
            onClick: F[7] || (F[7] = (W) => f.value = !0)
          }, {
            icon: Y(() => [
              g(r(ve), { icon: "tabler:plus" })
            ]),
            _: 1
          })
        ], 512),
        c.value === "Map" ? (n(), J(Pd, {
          key: 0,
          ref_key: "graph",
          ref: y,
          process: L.value,
          draft: e.draft,
          "fit-on-open": "",
          "selected-state": h.value,
          "selected-transition": k.value,
          onState: Ve,
          onTransition: I,
          onRemoveTransition: N,
          onConnect: we,
          onClear: ae
        }, null, 8, ["process", "draft", "selected-state", "selected-transition"])) : (n(), J(ou, {
          key: 1,
          process: L.value,
          draft: e.draft,
          guards: U.value,
          "selected-state": h.value,
          "selected-transition": k.value,
          counts: C.value,
          onState: Ve,
          onTransition: I,
          onRemoveState: F[8] || (F[8] = (W) => se(L.value, W)),
          onRemoveTransition: Oe
        }, null, 8, ["process", "draft", "guards", "selected-state", "selected-transition", "counts"])),
        g(Fo, { name: "work-panel" }, {
          default: Y(() => [
            h.value || k.value ? (n(), p("aside", {
              key: 0,
              ref_key: "inspector",
              ref: V,
              class: "work-process-sideform",
              tabindex: "-1",
              "aria-label": h.value ? "State inspector" : "Transition inspector",
              "aria-keyshortcuts": k.value ? "Delete Backspace" : void 0,
              onKeydown: [
                Ye(Me(N, ["self"]), ["delete"]),
                Ye(Me(N, ["self"]), ["backspace"])
              ]
            }, [
              (n(!0), p(te, null, de(h.value ? [h.value] : [], (W) => (n(), p(te, {
                key: W.id
              }, [
                s("header", Ac, [
                  E.value ? (n(), J(r(De), {
                    key: 1,
                    modelValue: W.name,
                    "onUpdate:modelValue": (_) => W.name = _,
                    class: "work-process-name",
                    "aria-label": "State name",
                    onBlur: F[9] || (F[9] = (_) => E.value = !1)
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])) : (n(), J(Ql, {
                    key: 0,
                    class: "work-process-state-title",
                    "aria-label": "Rename state",
                    onActivate: ie
                  }, {
                    default: Y(() => [
                      s("span", null, T(r(pe)(W)), 1)
                    ]),
                    _: 2
                  }, 1024)),
                  g(r(le), {
                    severity: "secondary",
                    text: "",
                    size: "small",
                    "aria-label": "Close state editor",
                    onClick: ae
                  }, {
                    default: Y(() => [
                      g(r(ve), { icon: "tabler:x" })
                    ]),
                    _: 1
                  })
                ]),
                re.value ? (n(), p("div", Pc, [
                  F[19] || (F[19] = s("p", { class: "work-field-label" }, "New route", -1)),
                  s("p", null, T(re.value), 1)
                ])) : S("", !0),
                s("p", Oc, T(r(Gi)(W, e.draft)), 1),
                C.value ? (n(), p("p", Rc, T(C.value[W.id] ?? 0) + " " + T(C.value[W.id] === 1 ? "item" : "items") + " currently here", 1)) : S("", !0),
                g(Sc, {
                  state: W,
                  process: L.value,
                  draft: e.draft,
                  "board-id": e.boardId,
                  onKind: (_) => X(W, _),
                  onValidity: (_, Ce) => l("validity", _.includes("duration:") ? _ : L.value.id + ":" + W.id + ":" + _, Ce)
                }, null, 8, ["state", "process", "draft", "board-id", "onKind", "onValidity"]),
                s("label", Nc, [
                  F[20] || (F[20] = G("Phase", -1)),
                  g(r(fe), {
                    "aria-label": "Phase",
                    modelValue: W.category,
                    "onUpdate:modelValue": (_) => W.category = _,
                    appendTo: "self",
                    optionLabel: "label",
                    optionValue: "value",
                    options: ["triage", "backlog", ...r(Wo)].map((_) => ({ label: r(zt)(_), value: _ }))
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                ]),
                s("div", Mc, [
                  $.value ? (n(), p(te, { key: 1 }, [
                    g(r(fe), {
                      modelValue: m.value,
                      "onUpdate:modelValue": F[11] || (F[11] = (_) => m.value = _),
                      "aria-label": "Next state",
                      placeholder: "Choose the next state",
                      appendTo: "self",
                      optionLabel: "label",
                      optionValue: "value",
                      options: L.value.states.filter((_) => _ !== W).map((_) => ({ label: r(pe)(_), value: _.id }))
                    }, null, 8, ["modelValue", "options"]),
                    s("div", Fc, [
                      g(r(le), {
                        label: "Add transition",
                        size: "small",
                        disabled: !m.value,
                        onClick: (_) => we(W.id, m.value)
                      }, null, 8, ["disabled", "onClick"]),
                      g(r(le), {
                        label: "Cancel",
                        severity: "secondary",
                        text: "",
                        size: "small",
                        onClick: F[12] || (F[12] = (_) => B(!1))
                      })
                    ])
                  ], 64)) : (n(), J(r(le), {
                    key: 0,
                    label: "Add transition",
                    severity: "secondary",
                    outlined: "",
                    size: "small",
                    "aria-expanded": "false",
                    disabled: L.value.states.length < 2,
                    onClick: F[10] || (F[10] = (_) => B(!0))
                  }, {
                    icon: Y(() => [
                      g(r(ve), {
                        icon: "tabler:plus",
                        "aria-hidden": "true"
                      })
                    ]),
                    _: 1
                  }, 8, ["disabled"]))
                ]),
                s("footer", Lc, [
                  g(r(le), {
                    label: "Remove state",
                    severity: "danger",
                    text: "",
                    size: "small",
                    onClick: (_) => se(L.value, W)
                  }, {
                    icon: Y(() => [
                      g(r(ve), { icon: "tabler:trash" })
                    ]),
                    _: 1
                  }, 8, ["onClick"])
                ])
              ], 64))), 128)),
              (n(!0), p(te, null, de(k.value ? [k.value] : [], (W) => (n(), p(te, {
                key: W.id
              }, [
                s("header", Bc, [
                  F[21] || (F[21] = s("h3", null, "Transition", -1)),
                  g(r(le), {
                    type: "button",
                    label: "Remove transition",
                    severity: "danger",
                    text: "",
                    size: "small",
                    onClick: (_) => Oe(W)
                  }, {
                    icon: Y(() => [
                      g(r(ve), { icon: "tabler:trash" })
                    ]),
                    _: 1
                  }, 8, ["onClick"]),
                  g(r(le), {
                    severity: "secondary",
                    text: "",
                    size: "small",
                    "aria-label": "Close transition editor",
                    onClick: ae
                  }, {
                    default: Y(() => [
                      g(r(ve), { icon: "tabler:x" })
                    ]),
                    _: 1
                  })
                ]),
                s("p", jc, T(W.from === "any" ? "Any state" : W.from.map((_) => r(pe)(L.value.states.find((Ce) => Ce.id === _))).join(", ")) + " → " + T(r(pe)(L.value.states.find((_) => _.id === W.to))), 1),
                g(mi, {
                  transition: W,
                  process: L.value,
                  draft: e.draft,
                  guards: U.value
                }, null, 8, ["transition", "process", "draft", "guards"]),
                i.value ? (n(), p("p", zc, T(i.value), 1)) : S("", !0),
                s("label", Wc, [
                  F[22] || (F[22] = G("Name", -1)),
                  g(r(De), {
                    modelValue: W.name,
                    "onUpdate:modelValue": (_) => W.name = _,
                    placeholder: r(Ke)(W),
                    "aria-label": "Transition name"
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder"])
                ]),
                g(bu, {
                  transition: W,
                  process: L.value,
                  draft: e.draft,
                  "board-id": e.boardId,
                  guards: U.value,
                  onValidity: (_, Ce) => l("validity", L.value.id + ":transition-" + W.id + ":" + _, Ce)
                }, null, 8, ["transition", "process", "draft", "board-id", "guards", "onValidity"])
              ], 64))), 128))
            ], 40, Ec)) : S("", !0)
          ]),
          _: 1
        })
      ], 2)) : (n(), J(r(le), {
        key: 2,
        label: "New process",
        severity: "secondary",
        outlined: "",
        onClick: F[13] || (F[13] = (W) => f.value = !0)
      }, {
        icon: Y(() => [
          g(r(ve), { icon: "tabler:plus" })
        ]),
        _: 1
      })),
      L.value ? (n(), J(Fe, {
        key: 3,
        class: "work-disclosure",
        label: "Advanced workflow settings"
      }, {
        default: Y(() => [
          s("div", qc, [
            g(Fe, {
              class: "work-small",
              label: "Technical details"
            }, {
              default: Y(() => [...F[23] || (F[23] = [
                s("p", null, [
                  G("Workflow definitions are "),
                  s("code", null, "processes"),
                  G(" in "),
                  s("code", null, "WorkGetSchema"),
                  G(" and "),
                  s("code", null, "WorkApplySchema"),
                  G(".")
                ], -1)
              ])]),
              _: 1
            }),
            s("label", Gc, [
              F[24] || (F[24] = G("Workflow name", -1)),
              g(r(De), {
                modelValue: L.value.name,
                "onUpdate:modelValue": F[14] || (F[14] = (W) => L.value.name = W),
                "aria-label": "Workflow name"
              }, null, 8, ["modelValue"])
            ]),
            Q.value.length ? (n(), p("p", Kc, "Some item limits belong to removed states.")) : S("", !0),
            (n(!0), p(te, null, de(Q.value, (W, _) => (n(), J(r(le), {
              key: W,
              label: "Clear limit for removed state " + (_ + 1),
              severity: "secondary",
              text: "",
              onClick: (Ce) => delete e.draft.policy.wip[W]
            }, null, 8, ["label", "onClick"]))), 128)),
            g(r(le), {
              label: "Remove workflow",
              severity: "danger",
              text: "",
              size: "small",
              onClick: F[15] || (F[15] = (W) => O(L.value))
            })
          ])
        ]),
        _: 1
      })) : S("", !0),
      g(Ml, {
        visible: f.value,
        "return-focus": e.creationOpener,
        label: "New process",
        onClose: A
      }, {
        default: Y(() => [
          s("form", {
            class: "work-dialog-box",
            "aria-label": "New process",
            onSubmit: Me(b, ["stop", "prevent"])
          }, [
            F[26] || (F[26] = s("h2", null, "New process", -1)),
            s("label", Hc, [
              F[25] || (F[25] = G("Name", -1)),
              g(r(De), {
                modelValue: u.value,
                "onUpdate:modelValue": F[16] || (F[16] = (W) => u.value = W),
                "aria-label": "New process name",
                autofocus: "",
                required: ""
              }, null, 8, ["modelValue"])
            ]),
            s("div", Yc, [
              g(r(le), {
                label: "Cancel",
                severity: "secondary",
                outlined: "",
                onClick: A
              }),
              g(r(le), {
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
}), Jc = {
  class: "work-settings-card work-stack",
  "aria-label": "Existing items"
}, Zc = {
  key: 0,
  class: "work-stack work-tight"
}, Qc = { class: "work-row" }, _c = /* @__PURE__ */ $e({
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
    return (t, l) => (n(), p("section", Jc, [
      l[2] || (l[2] = s("h3", { class: "work-row-title" }, "Items in changed states", -1)),
      (n(!0), p(te, null, de(e.removed, ({ process: o, state: d, count: f }) => (n(), p("label", {
        key: o.id + "/" + d.id,
        class: "work-stack work-tight"
      }, [
        G(" Move " + T(a(f)) + " from " + T(r(pe)(d)) + " to ", 1),
        g(r(fe), {
          disabled: e.disabled,
          "model-value": o.map?.[d.id],
          "aria-label": "Move items from " + r(pe)(d) + " to",
          placeholder: "Choose a state",
          appendTo: "self",
          optionLabel: "label",
          optionValue: "value",
          options: o.states.map((u) => ({ label: r(pe)(u), value: u.id })),
          "onUpdate:modelValue": (u) => t.$emit("destination", o, d.id, u)
        }, null, 8, ["disabled", "model-value", "aria-label", "options", "onUpdate:modelValue"])
      ]))), 128)),
      e.renamed.length ? (n(), p("div", Zc, [
        (n(!0), p(te, null, de(e.renamed, ({ process: o, state: d, count: f, name: u }) => (n(), p("p", {
          key: o.id + "/" + d.id
        }, [
          G(T(r(pe)(d)) + " becomes ", 1),
          s("strong", null, T(u), 1),
          G(" for " + T(a(f)) + ". ", 1)
        ]))), 128)),
        s("label", Qc, [
          g(r(Qt), {
            binary: "",
            "model-value": e.confirmed,
            disabled: e.disabled,
            "onUpdate:modelValue": l[0] || (l[0] = (o) => t.$emit("update:confirmed", o))
          }, null, 8, ["model-value", "disabled"]),
          l[1] || (l[1] = G(" Keep these items in their renamed states ", -1))
        ])
      ])) : S("", !0)
    ]));
  }
}), ev = {
  class: "work-stack",
  "aria-label": "Links editor"
}, tv = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, av = { class: "work-definition-meta work-muted work-small" }, lv = { class: "work-settings-grid" }, ov = { class: "work-stack work-tight" }, iv = {
  key: 0,
  class: "work-stack work-tight"
}, nv = { class: "work-stack work-tight" }, sv = { class: "work-row" }, rv = {
  key: 0,
  class: "work-muted work-small"
}, dv = {
  key: 1,
  class: "work-stack work-tight"
}, uv = { class: "work-settings-grid" }, cv = {
  key: 0,
  class: "work-chips"
}, vv = { class: "work-stack work-tight" }, fv = { class: "work-relation-preview work-small" }, mv = {
  key: 0,
  class: "work-muted"
}, pv = {
  key: 0,
  class: "kx-empty"
}, bv = /* @__PURE__ */ $e({
  __name: "RelationsEditor",
  props: {
    draft: {},
    guardRemoval: { type: Function }
  },
  setup(e) {
    const a = e, t = H(() => a.draft.relation_types ?? []), l = H(() => (a.draft.item_types ?? []).map((k) => ({ value: k.id, label: k.title || Pe(k.id) })));
    function o(k, y, w) {
      w.length ? k[y] = w : delete k[y];
    }
    function d(k, y) {
      if (!/^[a-z][a-z0-9_]{0,39}$/.test(y)) return "Start with a lowercase letter and use only lowercase letters, numbers or underscores.";
      if (k.to_types?.includes(y)) return "This ID is already in use.";
    }
    function f(k, y) {
      o(k, "to_types", [...k.to_types ?? [], y]);
    }
    function u(k) {
      return (k.to_types ?? []).filter((y) => l.value.some((w) => w.value === y));
    }
    function v(k) {
      return (k.to_types ?? []).filter((y) => !l.value.some((w) => w.value === y));
    }
    const i = q(""), c = q(!1);
    function m(k) {
      const y = k.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, ""), w = (/^[a-z]/.test(y) ? y : "link_" + (y || "new")).slice(0, 40);
      let V = w, x = 2;
      for (; t.value.some((E) => E.id === V); ) {
        const E = "_" + x++;
        V = w.slice(0, 40 - E.length) + E;
      }
      return V;
    }
    function $(k) {
      (a.draft.relation_types ??= []).push({ id: m(k), outward: k, inward: k, cardinality: "many" });
    }
    async function h(k) {
      if (!c.value) {
        c.value = !0, i.value = "";
        try {
          const y = await a.guardRemoval?.("relation_types", k);
          y ? i.value = y : Ra(a.draft, "relation_types", k);
        } finally {
          c.value = !1;
        }
      }
    }
    return (k, y) => (n(), p("section", ev, [
      i.value ? (n(), p("p", tv, T(i.value), 1)) : S("", !0),
      g(ul, {
        columns: "relations",
        count: t.value.length
      }, {
        default: Y(() => [
          (n(!0), p(te, null, de(t.value, (w, V) => (n(), J(dl, {
            "route-section": "links",
            "route-id": w.id,
            title: w.outward || r(Pe)(w.id),
            kind: w.symmetric ? "Same both ways" : "Different each way",
            key: V,
            class: "work-stack"
          }, il({
            actions: Y(() => [
              g(r(le), {
                severity: "secondary",
                text: "",
                disabled: c.value,
                onClick: (x) => h(w.id),
                "aria-label": "Remove link type",
                size: "small"
              }, {
                default: Y(() => [
                  g(r(ve), {
                    icon: "tabler:trash",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["disabled", "onClick"])
            ]),
            default: Y(() => [
              s("div", lv, [
                s("label", ov, [
                  y[0] || (y[0] = G("Shown on this item ", -1)),
                  g(r(De), {
                    modelValue: w.outward,
                    "onUpdate:modelValue": (x) => w.outward = x,
                    "aria-label": "Shown on this item"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                w.symmetric ? S("", !0) : (n(), p("label", iv, [
                  y[1] || (y[1] = G("Shown on the other item ", -1)),
                  g(r(De), {
                    modelValue: w.inward,
                    "onUpdate:modelValue": (x) => w.inward = x,
                    "aria-label": "Shown on the other item"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ])),
                s("label", nv, [
                  y[2] || (y[2] = G("Links allowed ", -1)),
                  g(r(fe), {
                    "model-value": w.cardinality ?? "many",
                    "onUpdate:modelValue": (x) => w.cardinality = x,
                    "aria-label": "Links allowed",
                    appendTo: "self",
                    optionLabel: "label",
                    optionValue: "value",
                    optionDisabled: "disabled",
                    options: [{ label: "One link", value: "one", disabled: !1 }, { label: "Many links", value: "many", disabled: !1 }]
                  }, null, 8, ["model-value", "onUpdate:modelValue"])
                ]),
                s("label", sv, [
                  g(r(Qt), {
                    modelValue: w.symmetric,
                    "onUpdate:modelValue": (x) => w.symmetric = x,
                    disabled: !!(w.from_types?.length || w.to_types?.length),
                    "aria-label": "Same meaning in both directions",
                    binary: ""
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"]),
                  y[3] || (y[3] = G("Same meaning in both directions ", -1))
                ])
              ]),
              w.from_types?.length || w.to_types?.length ? (n(), p("p", rv, " Clear the source and target types to use the same meaning in both directions. ")) : S("", !0),
              w.symmetric ? S("", !0) : (n(), p("div", dv, [
                y[5] || (y[5] = s("p", { class: "work-muted work-small" }, "Leave either end empty to allow any item type there.", -1)),
                s("div", uv, [
                  g(bt, {
                    label: "Source item types",
                    options: l.value,
                    "model-value": w.from_types,
                    "onUpdate:modelValue": (x) => o(w, "from_types", x)
                  }, null, 8, ["options", "model-value", "onUpdate:modelValue"]),
                  g(bt, {
                    label: "Target item types",
                    options: l.value,
                    "model-value": u(w),
                    "onUpdate:modelValue": (x) => o(w, "to_types", [...x, ...v(w)])
                  }, null, 8, ["options", "model-value", "onUpdate:modelValue"])
                ]),
                g(Fe, {
                  class: "work-disclosure",
                  label: "Peer board target types"
                }, {
                  default: Y(() => [
                    y[4] || (y[4] = s("p", { class: "work-muted work-small" }, "Enter a type ID to allow that type from a peer board.", -1)),
                    v(w).length ? (n(), p("div", cv, [
                      (n(!0), p(te, null, de(v(w), (x) => (n(), J(r(le), {
                        key: x,
                        severity: "secondary",
                        text: "",
                        size: "small",
                        label: x + " ×",
                        "aria-label": "Remove target type " + x,
                        onClick: (E) => o(w, "to_types", w.to_types?.filter((D) => D !== x) ?? [])
                      }, null, 8, ["label", "aria-label", "onClick"]))), 128))
                    ])) : S("", !0),
                    g(Aa, {
                      action: "Add target type",
                      label: "Target type ID",
                      maxlength: 40,
                      validate: (x) => d(w, x),
                      onAdd: (x) => f(w, x)
                    }, null, 8, ["validate", "onAdd"])
                  ]),
                  _: 2
                }, 1024)
              ])),
              g(Fe, {
                class: "work-disclosure",
                label: "Advanced link settings"
              }, {
                default: Y(() => [
                  s("label", vv, [
                    y[6] || (y[6] = G("Identifier ", -1)),
                    g(r(De), {
                      modelValue: w.id,
                      "onUpdate:modelValue": (x) => w.id = x,
                      required: "",
                      pattern: "[a-z][a-z0-9_]*",
                      "aria-label": "Relation ID"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ])
                ]),
                _: 2
              }, 1024),
              s("p", fv, [
                y[7] || (y[7] = s("strong", null, "This item", -1)),
                G(" " + T(w.outward || "relates to") + " ", 1),
                y[8] || (y[8] = s("strong", null, "another item", -1)),
                !w.symmetric && w.inward && w.inward !== w.outward ? (n(), p("span", mv, " · reverse: " + T(w.inward), 1)) : S("", !0)
              ])
            ]),
            _: 2
          }, [
            !w.symmetric && w.inward && w.inward !== w.outward ? {
              name: "usage",
              fn: Y(() => [
                s("span", av, T(w.inward), 1)
              ]),
              key: "0"
            } : void 0
          ]), 1032, ["route-id", "title", "kind"]))), 128)),
          t.value.length ? S("", !0) : (n(), p("p", pv, "No link types yet. Add one to connect related work.")),
          g(Aa, {
            action: "Add link type",
            label: "Link name",
            onAdd: $
          })
        ]),
        _: 1
      }, 8, ["count"])
    ]));
  }
});
function pi(e) {
  return typeof e.error == "string" ? e.error : e.error?.message;
}
function Po(e, a) {
  const t = pi(e);
  return e.parked ? "Stopped: " + (t ?? "Projection is parked") : t ? "Degraded: " + t : e.bootstrapping ? "Initializing" : e.last_seq >= a ? "Up to date" : "Catching up";
}
function hv(e, a) {
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
  if (o.some((d) => d.parked)) return { kind: "reset", status: "Needs reset" };
  if (o.some(pi)) return { kind: "degraded", status: "Degraded" };
}
const gv = {
  class: "work-stack",
  "aria-label": "Plugins editor"
}, yv = {
  key: 0,
  class: "kx-loading"
}, kv = {
  key: 1,
  class: "kx-err",
  role: "alert"
}, wv = {
  key: 2,
  class: "work-notice",
  role: "status"
}, $v = { class: "work-block work-small work-error" }, Vv = {
  key: 0,
  class: "work-muted work-small"
}, xv = {
  key: 1,
  class: "work-notice"
}, Cv = {
  key: 2,
  class: "work-stack work-tight"
}, Sv = {
  key: 0,
  class: "work-muted"
}, Tv = {
  key: 1,
  class: "work-row"
}, Iv = {
  key: 2,
  class: "work-row"
}, Dv = {
  key: 0,
  class: "work-small"
}, Uv = {
  key: 5,
  class: "work-row"
}, Ev = {
  key: 6,
  class: "work-row"
}, Av = {
  key: 7,
  class: "work-row"
}, Pv = { class: "work-stack work-tight" }, Ov = { key: 0 }, Rv = { key: 1 }, Nv = { key: 2 }, Mv = {
  key: 4,
  class: "work-stack work-tight"
}, Fv = {
  key: 0,
  class: "work-muted"
}, Lv = { class: "work-form-actions" }, Bv = {
  key: 6,
  class: "work-muted work-small"
}, jv = "kickside.work.planning:plugin", Oo = /* @__PURE__ */ $e({
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
    const t = e, l = a, o = q(""), d = q(""), f = q(""), u = q({}), v = nl(rl, void 0), i = q(/* @__PURE__ */ new Set()), c = q({}), m = q(/* @__PURE__ */ new Set()), $ = H(() => t.options.map((B) => {
      const I = L(B.plugin), C = hv(B, I), U = ue(B.plugin), Q = I?.active === !0, b = U && i.value.has(B.plugin) ? "Configuration needed" : U !== Q ? U ? "Will enable on apply" : "Will disable on apply" : C?.status ?? (Q ? I.lifecycle.state === "ready" ? "Enabled" : "Setting up" : "Disabled");
      return { plugin: B, current: I, issue: C, chosen: U, status: b };
    })), h = H(() => !!o.value || t.disabled), k = H(() => h.value || t.activationLocked), y = {}, w = H(() => (t.draft.item_types ?? []).filter((B) => !["issue", "sprint", "milestone"].includes(B.id)).map((B) => ({ value: B.id, label: B.title || Pe(B.id) }))), V = H(() => ["current_sprint", "milestone"].every((B) => t.schema.compiled?.fields?.some((I) => I.code === B))), x = H(() => {
      const B = t.filters;
      return B ? (t.draft.scopes ?? []).filter((I) => !B.some((C) => C.id === I && t.options.some((U) => U.plugin === C.plugin))) : [];
    });
    function E(B) {
      return (t.filters ?? []).filter((I) => I.plugin === B);
    }
    function D(B, I) {
      const C = new Set(E(B).map((b) => b.id)), U = t.draft.scopes ?? [], Q = [...U.filter((b) => !C.has(b)), ...I];
      (Q.length !== U.length || Q.some((b) => !U.includes(b))) && (t.draft.scopes = Q);
    }
    function j(B, I) {
      P(B, { ...ne(B), issue_types: I });
    }
    function ie(B) {
      return !!B.config_schema && Jl(B.config_schema).length > 0;
    }
    function L(B) {
      return t.schema.plugins?.find((I) => I.plugin === B);
    }
    function re(B) {
      return L(B)?.active === !0;
    }
    function ue(B) {
      return t.draft.plugins?.some((I) => I.use === B) === !0;
    }
    function me(B, I) {
      const C = t.draft.plugins ?? [];
      I && !ue(B) && (t.draft.plugins = [...C, { use: B }], u.value[B] = !0, v?.choose("plugins", B, !0)), I || (t.draft.plugins = C.filter((U) => U.use !== B), delete t.configs[B], i.value.delete(B), l("validity", B, !0), D(B, []));
    }
    function ce(B, I) {
      me(B, !1), l("review", I.currentTarget);
    }
    function ne(B) {
      return t.configs[B] ?? L(B)?.config ?? y;
    }
    function P(B, I) {
      f.value = "", t.configs[B] = I;
    }
    function ae(B) {
      delete t.configs[B];
    }
    function z(B, I) {
      I ? i.value.delete(B) : i.value.add(B), l("validity", B, I || !ue(B) || re(B) && !t.configs[B]);
    }
    async function ge(B) {
      await Ho.confirm({
        header: "Reset projection?",
        message: "Resetting can rebuild from current items or replay retained events, depending on the projection.",
        acceptLabel: "Reset projection",
        rejectLabel: "Cancel"
      }) && await Ve(B);
    }
    async function Ve(B) {
      if (!h.value) {
        o.value = B, d.value = "", f.value = "";
        try {
          await Xt.configure(t.boardId, B), f.value = "Plugin recovery started.", l("configured");
        } catch (I) {
          d.value = pt(I, "Could not recover the plugin.");
        } finally {
          o.value = "";
        }
      }
    }
    return (B, I) => (n(), p("section", gv, [
      e.options.length ? S("", !0) : (n(), p("p", yv, "No installed plugins are visible to you.")),
      d.value ? (n(), p("div", kv, T(d.value), 1)) : S("", !0),
      f.value ? (n(), p("p", wv, T(f.value), 1)) : S("", !0),
      g(ul, {
        columns: "plugins",
        count: e.options.length
      }, {
        default: Y(() => [
          (n(!0), p(te, null, de($.value, ({ plugin: C, current: U, issue: Q, chosen: b, status: A }) => (n(), J(dl, {
            "route-section": "plugins",
            "route-id": C.plugin,
            key: C.plugin,
            open: u.value[C.plugin],
            "onUpdate:open": (Z) => u.value[C.plugin] = Z,
            title: C.installed === !1 ? C.plugin : C.title || C.plugin,
            description: C.description,
            kind: A,
            class: "work-stack"
          }, il({
            actions: Y(() => [
              Q?.kind !== "missing" ? (n(), J(r(rt), {
                key: 0,
                "model-value": ue(C.plugin),
                "aria-label": "Enable " + (C.title || C.plugin),
                disabled: k.value || !!C.problem && !ue(C.plugin),
                "onUpdate:modelValue": (Z) => me(C.plugin, Z)
              }, null, 8, ["model-value", "aria-label", "disabled", "onUpdate:modelValue"])) : S("", !0)
            ]),
            default: Y(() => [
              C.requires.length ? (n(), p("p", Vv, "Requires " + T(C.requires.map((Z) => e.options.find((X) => X.plugin === Z)?.title || "Another capability").join(", ")), 1)) : S("", !0),
              U?.outdated ? (n(), p("p", xv, "The stored declaration differs from the installed plugin. Review activation to update it.")) : S("", !0),
              Q ? (n(), p("div", Cv, [
                Q && "cause" in Q ? (n(), p("p", Sv, T(Q.cause), 1)) : S("", !0),
                Q?.kind === "setup" && U?.active ? (n(), p("div", Tv, [
                  g(r(le), {
                    label: "Retry setup",
                    severity: "secondary",
                    outlined: "",
                    disabled: h.value,
                    onClick: (Z) => Ve(C.plugin)
                  }, null, 8, ["disabled", "onClick"])
                ])) : Q?.kind === "provider" ? (n(), p("div", Iv, [
                  g(r(le), {
                    label: "Retry schema check",
                    severity: "secondary",
                    outlined: "",
                    disabled: h.value,
                    onClick: I[0] || (I[0] = (Z) => l("refresh"))
                  }, null, 8, ["disabled"])
                ])) : Q?.kind === "degraded" ? (n(), J(Fe, {
                  key: 3,
                  class: "work-small",
                  label: "Inspect worker"
                }, {
                  default: Y(() => [
                    I[1] || (I[1] = s("p", null, "Check the failing worker before resetting a projection.", -1)),
                    (n(!0), p(te, null, de(U?.projections, (Z, X) => (n(), p("p", { key: X }, T(X) + " · " + T(r(Po)(Z, e.schema.as_of)), 1))), 128))
                  ]),
                  _: 2
                }, 1024)) : Q?.kind === "history" ? (n(), p(te, { key: 4 }, [
                  Q.floor !== void 0 ? (n(), p("p", Dv, "Earliest retained event sequence is " + T(Q.floor) + ".", 1)) : S("", !0),
                  g(Fe, {
                    class: "work-small",
                    label: "Review retained history"
                  }, {
                    default: Y(() => [...I[2] || (I[2] = [
                      s("p", null, "Ask the plugin maintainer to review the event projection’s start sequence. The plugin needs a declaration that can run with the retained history.", -1)
                    ])]),
                    _: 1
                  })
                ], 64)) : Q?.kind === "reset" ? (n(), p("div", Uv, [
                  g(r(le), {
                    label: "Reset projection",
                    severity: "secondary",
                    outlined: "",
                    disabled: h.value,
                    onClick: (Z) => ge(C.plugin)
                  }, null, 8, ["disabled", "onClick"]),
                  I[3] || (I[3] = s("span", { class: "work-muted work-small" }, "Resolve the worker error before resetting.", -1))
                ])) : Q?.kind === "configuration" && ue(C.plugin) && ie(C) && !m.value.has(C.plugin) ? (n(), p("div", Ev, [
                  g(r(le), {
                    label: "Edit configuration",
                    severity: "secondary",
                    outlined: "",
                    disabled: h.value,
                    onClick: (Z) => m.value.add(C.plugin)
                  }, null, 8, ["disabled", "onClick"])
                ])) : Q?.kind === "missing" && ue(C.plugin) ? (n(), p("div", Av, [
                  g(r(le), {
                    label: "Review references",
                    severity: "secondary",
                    outlined: "",
                    disabled: k.value,
                    onClick: (Z) => ce(C.plugin, Z)
                  }, null, 8, ["disabled", "onClick"])
                ])) : S("", !0)
              ])) : S("", !0),
              C.installed ? (n(), J(Fe, {
                key: 3,
                class: "work-disclosure work-small",
                label: "Technical details"
              }, {
                default: Y(() => [
                  s("dl", Pv, [
                    s("div", null, [
                      I[4] || (I[4] = s("dt", null, "Plugin ID", -1)),
                      s("dd", null, [
                        s("code", null, T(C.plugin), 1)
                      ])
                    ]),
                    (U?.interface_version ?? C.interface_version) != null ? (n(), p("div", Ov, [
                      I[5] || (I[5] = s("dt", null, "Interface version", -1)),
                      s("dd", null, T(U?.interface_version ?? C.interface_version), 1)
                    ])) : S("", !0),
                    U?.version ? (n(), p("div", Rv, [
                      I[6] || (I[6] = s("dt", null, "Active schema version", -1)),
                      s("dd", null, T(U.version), 1)
                    ])) : S("", !0),
                    I[8] || (I[8] = s("div", null, [
                      s("dt", null, "Configuration tool"),
                      s("dd", null, [
                        s("code", null, "WorkConfigurePlugin")
                      ])
                    ], -1)),
                    C.tools.length ? (n(), p("div", Nv, [
                      I[7] || (I[7] = s("dt", null, "Plugin tools", -1)),
                      s("dd", null, [
                        (n(!0), p(te, null, de(C.tools, (Z) => (n(), p("code", {
                          key: Z,
                          class: "work-block"
                        }, T(Z), 1))), 128))
                      ])
                    ])) : S("", !0),
                    (n(!0), p(te, null, de(U?.projections, (Z, X) => (n(), p("div", { key: X }, [
                      s("dt", null, T(r(Pe)(X)), 1),
                      s("dd", null, T(r(Po)(Z, e.schema.as_of)) + " · Indexed through " + T(Z.last_seq) + " of " + T(e.schema.as_of) + " events.", 1)
                    ]))), 128))
                  ])
                ]),
                _: 2
              }, 1024)) : S("", !0),
              E(C.plugin).length && (ue(C.plugin) || re(C.plugin)) ? (n(), p("section", Mv, [
                I[9] || (I[9] = s("h4", null, "Query filters", -1)),
                I[10] || (I[10] = s("p", { class: "work-muted" }, "Choose which filters people can use to narrow down work on this board.", -1)),
                g(bt, {
                  label: "Available filters",
                  disabled: !!o.value || e.disabled || !ue(C.plugin),
                  options: E(C.plugin).map((Z) => ({ value: Z.id, label: Z.title })),
                  "model-value": e.draft.scopes?.filter((Z) => E(C.plugin).some((X) => X.id === Z)),
                  "onUpdate:modelValue": (Z) => D(C.plugin, Z)
                }, null, 8, ["disabled", "options", "model-value", "onUpdate:modelValue"])
              ])) : S("", !0),
              ue(C.plugin) && ie(C) && Q?.kind !== "manifest" && Q?.kind !== "missing" && (Q?.kind !== "configuration" || m.value.has(C.plugin)) ? (n(), J(ma(Q && Q.kind !== "configuration" ? Fe : "div"), {
                key: 5,
                label: Q && Q.kind !== "configuration" ? "Plugin settings" : void 0,
                class: "work-stack work-tight"
              }, {
                default: Y(() => [
                  C.plugin === jv ? (n(), p(te, { key: 0 }, [
                    V.value ? (n(), J(bt, {
                      key: 1,
                      label: "Plan these item types",
                      options: w.value,
                      "model-value": ne(C.plugin).issue_types,
                      disabled: !!o.value || e.disabled,
                      "onUpdate:modelValue": (Z) => j(C.plugin, Z)
                    }, null, 8, ["options", "model-value", "disabled", "onUpdate:modelValue"])) : (n(), p("p", Fv, "The Planning pack supplies sprint and milestone fields for item types.")),
                    I[11] || (I[11] = s("p", { class: "work-muted" }, "Selected types get Current sprint and Milestone fields.", -1))
                  ], 64)) : (n(), J(Go, {
                    key: 1,
                    disabled: !!o.value || e.disabled,
                    schema: C.config_schema,
                    "model-value": ne(C.plugin),
                    "suggest-defaults": "",
                    "onUpdate:modelValue": (Z) => P(C.plugin, Z),
                    onValidity: (Z) => z(C.plugin, Z),
                    onValidationMessage: (Z) => c.value[C.plugin] = Z
                  }, null, 8, ["disabled", "schema", "model-value", "onUpdate:modelValue", "onValidity", "onValidationMessage"])),
                  s("div", Lv, [
                    g(r(le), {
                      label: Q ? "Reset form values" : "Reset",
                      severity: "secondary",
                      outlined: "",
                      disabled: !!o.value || e.disabled,
                      onClick: (Z) => ae(C.plugin)
                    }, null, 8, ["label", "disabled", "onClick"])
                  ])
                ]),
                _: 2
              }, 1032, ["label"])) : S("", !0),
              !e.activationLocked && (b !== re(C.plugin) || b && (ie(C) || E(C.plugin).length)) ? (n(), p("p", Bv, " Use Review changes, then Apply changes to save. ")) : S("", !0)
            ]),
            _: 2
          }, [
            ue(C.plugin) && c.value[C.plugin] ? {
              name: "status",
              fn: Y(() => [
                s("span", $v, T(c.value[C.plugin]), 1)
              ]),
              key: "0"
            } : void 0
          ]), 1032, ["route-id", "open", "onUpdate:open", "title", "description", "kind"]))), 128))
        ]),
        _: 1
      }, 8, ["count"]),
      x.value.length ? (n(), J(Fe, {
        key: 3,
        class: "work-settings-card work-disclosure",
        label: "Unavailable query filters"
      }, {
        default: Y(() => [
          I[12] || (I[12] = s("p", { class: "work-muted" }, "These filters came from a plugin that is unavailable. Remove one to stop using it on this board.", -1)),
          (n(!0), p(te, null, de(x.value, (C, U) => (n(), J(r(le), {
            key: C,
            label: "Remove unavailable filter " + (U + 1),
            severity: "secondary",
            text: "",
            onClick: (Q) => e.draft.scopes = e.draft.scopes?.filter((b) => b !== C)
          }, null, 8, ["label", "onClick"]))), 128))
        ]),
        _: 1
      })) : S("", !0),
      (n(!0), p(te, null, de(e.draft.plugins?.filter((C) => !e.options.some((U) => U.plugin === C.use)) ?? [], (C) => (n(), p("article", {
        key: C.use,
        class: "work-settings-card work-stack"
      }, [
        s("p", null, [
          s("strong", null, T(C.use), 1),
          I[13] || (I[13] = G(" · Not installed", -1))
        ]),
        I[14] || (I[14] = s("p", { class: "work-muted" }, "This board still references a plugin that is no longer installed.", -1)),
        g(r(le), {
          label: "Review references",
          severity: "secondary",
          outlined: "",
          disabled: k.value,
          onClick: (U) => ce(C.use, U)
        }, null, 8, ["disabled", "onClick"])
      ]))), 128))
    ]));
  }
}), zv = { class: "system-section-head" }, Wv = { class: "system-section-head-text" }, qv = {
  key: 0,
  class: "kx-head-actions"
}, Gv = /* @__PURE__ */ $e({
  __name: "SettingsSectionHead",
  props: {
    title: {},
    description: {}
  },
  setup(e) {
    return (a, t) => (n(), p("header", zv, [
      s("div", Wv, [
        s("h1", null, T(e.title), 1),
        s("p", null, T(e.description), 1)
      ]),
      a.$slots.actions ? (n(), p("div", qv, [
        at(a.$slots, "actions")
      ])) : S("", !0)
    ]));
  }
}), Kv = /* @__PURE__ */ $e({
  __name: "SettingsDraftActions",
  props: {
    busy: { type: Boolean },
    discardDisabled: { type: Boolean },
    reviewDisabled: { type: Boolean }
  },
  emits: ["discard", "review"],
  setup(e) {
    return (a, t) => (n(), p(te, null, [
      g(r(dt), {
        severity: "warn",
        value: "Unsaved changes"
      }),
      g(r(le), {
        label: "Discard",
        type: "button",
        severity: "secondary",
        outlined: "",
        disabled: e.busy || e.discardDisabled,
        onClick: t[0] || (t[0] = (l) => a.$emit("discard"))
      }, {
        icon: Y(() => [
          g(r(ve), {
            icon: "tabler:restore",
            "aria-hidden": "true"
          })
        ]),
        _: 1
      }, 8, ["disabled"]),
      g(r(le), {
        label: "Review changes",
        type: "button",
        disabled: e.busy || e.reviewDisabled,
        loading: e.busy,
        onClick: t[1] || (t[1] = (l) => a.$emit("review", l.currentTarget))
      }, null, 8, ["disabled", "loading"])
    ], 64));
  }
}), Hv = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, Yv = ["config"], Xv = /* @__PURE__ */ $e({
  __name: "BoardShare",
  props: {
    board: {},
    busy: { type: Boolean }
  },
  emits: ["shared"],
  setup(e) {
    const a = e, t = q(!1), l = q(!1), o = q("");
    async function d() {
      const u = a.board;
      if (!(a.busy || l.value)) {
        l.value = !0, o.value = "";
        try {
          const v = await Bt("kickside-share");
          if (a.board.board_id !== u.board_id) return;
          v ? t.value = !0 : o.value = "Sharing is unavailable. Try opening it again.";
        } finally {
          l.value = !1;
        }
      }
    }
    Te(() => a.board.board_id, () => {
      t.value = !1, o.value = "";
    });
    const f = H(() => {
      const u = encodeURIComponent(a.board.board_id);
      return JSON.stringify({
        resource_id: a.board.board_id,
        title: a.board.title,
        access_url: "/api/v1/component-access/grants/" + u,
        share_url: "/api/v1/component-access/share/" + u
      });
    });
    return (u, v) => (n(), p(te, null, [
      g(r(le), {
        label: "Share board",
        severity: "secondary",
        outlined: "",
        loading: l.value,
        disabled: e.busy,
        onClick: d
      }, {
        icon: Y(() => [
          g(r(ve), {
            icon: "tabler:share",
            "aria-hidden": "true"
          })
        ]),
        _: 1
      }, 8, ["loading", "disabled"]),
      o.value ? (n(), p("p", Hv, T(o.value), 1)) : S("", !0),
      t.value ? (n(), p("kickside-share", {
        key: 1,
        config: f.value,
        onClose: v[0] || (v[0] = (i) => t.value = !1),
        onChanged: v[1] || (v[1] = (i) => u.$emit("shared"))
      }, null, 40, Yv)) : S("", !0)
    ], 64));
  }
}), Jv = {
  class: "work-stack",
  "aria-label": "Board visibility"
}, Zv = { class: "work-stack work-tight" }, Qv = {
  key: 0,
  class: "work-settings-list"
}, _v = { class: "work-row-main" }, ef = { class: "work-small work-muted" }, tf = { class: "work-row-control" }, af = { class: "work-row" }, lf = /* @__PURE__ */ $e({
  __name: "VisibilityEditor",
  props: {
    draft: {},
    boardId: {}
  },
  emits: ["validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = H(() => t.draft.visibility), d = H(() => (t.draft.fields ?? []).filter((m) => m.form === "text" && (!m.cardinality || m.cardinality === "one") && m.type !== "rollup" && m.index !== "number" && m.config?.case !== "insensitive")), f = H(() => d.value.find((m) => m.code === o.value?.field)?.type !== "option");
    function u(m) {
      if (o.value?.levels.some(($) => $.id === m)) return "This level is already in use.";
    }
    function v(m) {
      o.value?.levels.push({ id: m, holders: [] });
    }
    function i(m) {
      if (!m) {
        delete t.draft.visibility;
        return;
      }
      const $ = d.value.find((h) => h.code === m);
      t.draft.visibility = { field: m, levels: ($?.options ?? []).map((h) => ({ id: h.id, holders: [] })) };
    }
    function c(m, $) {
      const h = o.value?.levels.find((k) => k.id === m);
      h && (h.holders = $ ?? []);
    }
    return (m, $) => (n(), p("section", Jv, [
      $[7] || ($[7] = s("h3", { class: "work-group-title" }, "Board visibility", -1)),
      $[8] || ($[8] = s("p", { class: "work-small work-muted" }, "Restrict items by their visibility level. People still need access to the board.", -1)),
      s("label", Zv, [
        $[5] || ($[5] = G("Visibility field ", -1)),
        g(r(fe), {
          "aria-label": "Visibility field",
          "model-value": o.value?.field ?? "",
          placeholder: "No additional restriction",
          options: [{ label: "No additional restriction", value: "" }, ...d.value.map((h) => ({ label: r(Ze)(h), value: h.code }))],
          optionLabel: "label",
          optionValue: "value",
          appendTo: "self",
          "onUpdate:modelValue": i
        }, null, 8, ["model-value", "options"])
      ]),
      o.value ? (n(), p(te, { key: 0 }, [
        o.value.levels.length ? (n(), p("div", Qv, [
          (n(!0), p(te, null, de(o.value.levels, (h, k) => (n(), p("div", {
            key: h.id,
            class: "work-settings-row"
          }, [
            s("div", _v, [
              s("strong", null, T(d.value.find((y) => y.code === o.value.field)?.options?.find((y) => y.id === h.id)?.label || h.id), 1),
              s("p", ef, "Level " + T(k + 1), 1)
            ]),
            s("div", tf, [
              g(Zo, {
                "board-id": e.boardId,
                label: "Who can see these items",
                "model-value": h.holders,
                "onUpdate:modelValue": (y) => c(h.id, y),
                onValidity: $[0] || ($[0] = (y) => l("validity", y))
              }, null, 8, ["board-id", "model-value", "onUpdate:modelValue"])
            ])
          ]))), 128))
        ])) : S("", !0),
        f.value ? (n(), J(Aa, {
          key: o.value.field,
          action: "Add level",
          label: "New visibility level",
          validate: u,
          onAdd: v
        })) : S("", !0),
        s("label", af, [
          g(r(rt), {
            "model-value": o.value.bypass === "admin",
            "onUpdate:modelValue": $[1] || ($[1] = (h) => h ? o.value.bypass = "admin" : delete o.value.bypass)
          }, null, 8, ["model-value"]),
          $[6] || ($[6] = G(" Board administrators can see every level ", -1))
        ]),
        g(r(le), {
          label: "Remove visibility restriction",
          severity: "secondary",
          text: "",
          onClick: $[2] || ($[2] = (h) => delete e.draft.visibility)
        })
      ], 64)) : S("", !0),
      g(jt, {
        label: "Visibility rules",
        "model-value": o.value,
        shape: "object",
        example: { field: "visibility", levels: [{ id: "internal", holders: [] }], bypass: "admin" },
        "onUpdate:modelValue": $[3] || ($[3] = (h) => e.draft.visibility = h),
        onValidity: $[4] || ($[4] = (h) => l("validity", h))
      }, null, 8, ["model-value"])
    ]));
  }
}), of = { class: "work-ia-section" }, nf = {
  class: "work-settings-list",
  "aria-labelledby": "work-sharing-title"
}, sf = { class: "work-settings-row" }, rf = { class: "work-row-main" }, df = {
  key: 0,
  class: "work-muted work-small"
}, uf = {
  key: 0,
  class: "work-member-preview",
  "aria-label": "People and groups with direct access"
}, cf = { class: "work-spacer" }, vf = {
  key: 1,
  class: "work-settings-row work-muted work-small"
}, ff = {
  key: 2,
  class: "work-settings-row work-muted"
}, mf = {
  key: 3,
  class: "work-settings-row"
}, pf = {
  key: 4,
  class: "work-settings-row work-muted",
  role: "status"
}, bf = /* @__PURE__ */ $e({
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
    const a = e, t = q(), l = q([]), o = H(() => t.value?.filter((k) => k.subject_type === "group").length ?? 0), d = H(() => (t.value?.length ?? 0) - o.value), f = H(() => [...t.value ?? []].sort((k, y) => +!!y.owner - +!!k.owner || y.access_mask - k.access_mask).slice(0, 6).map((k) => ({ ...k, permissions: c(k) }))), u = H(() => f.value.map((k) => ({ id: k.subject_id, kind: k.subject_type ?? "user" }))), v = Ko(() => a.boardId, u);
    function i(k) {
      return k.full_name || v.label({ id: k.subject_id, kind: k.subject_type ?? "user", email: k.email });
    }
    function c(k) {
      return k.owner ? "Owner" : l.value.filter((y) => (k.access_mask & y.bit) === y.bit).map((y) => y.label).join(", ");
    }
    const m = q(!1), $ = Sa();
    async function h() {
      const k = $();
      m.value = !1;
      try {
        const [{ data: y }, w] = await Promise.all([
          Fl.get("/api/v1/component-access/grants/" + encodeURIComponent(a.boardId)),
          Fl.get("/api/v1/components/access-model")
        ]);
        if (!k()) return;
        if (!y?.success || !Array.isArray(y.access)) throw new Error("Grants unavailable");
        t.value = y.access, l.value = w.data?.success && Array.isArray(w.data.capabilities) ? w.data.capabilities : [];
      } catch {
        k() && (t.value = void 0, m.value = !0);
      }
    }
    return Xl(() => $()), Te(() => [a.active, a.boardId], () => {
      a.active && h();
    }, { immediate: !0 }), (k, y) => (n(), p("section", of, [
      s("section", nf, [
        s("div", sf, [
          s("div", rf, [
            y[1] || (y[1] = s("h3", {
              id: "work-sharing-title",
              class: "work-row-title"
            }, "Members and sharing", -1)),
            t.value ? (n(), p("p", df, T(d.value) + " " + T(d.value === 1 ? "person" : "people") + " and " + T(o.value) + " " + T(o.value === 1 ? "group" : "groups") + " with direct access", 1)) : S("", !0)
          ]),
          e.board ? (n(), J(Xv, {
            key: 0,
            board: e.board,
            busy: e.busy,
            onShared: h
          }, null, 8, ["board", "busy"])) : S("", !0)
        ]),
        f.value.length ? (n(), p("ul", uf, [
          (n(!0), p(te, null, de(f.value, (w) => (n(), p("li", {
            key: w.subject_type + w.subject_id,
            class: "work-settings-row"
          }, [
            g(r(ve), {
              icon: w.subject_type === "group" ? "tabler:users" : "tabler:user",
              "aria-hidden": "true"
            }, null, 8, ["icon"]),
            s("strong", cf, T(i(w)), 1),
            w.permissions ? (n(), J(r(dt), {
              key: 0,
              class: "kx-tag-sm",
              severity: "secondary",
              value: w.permissions
            }, null, 8, ["value"])) : S("", !0)
          ]))), 128))
        ])) : S("", !0),
        t.value && t.value.length > f.value.length ? (n(), p("p", vf, " See all " + T(t.value.length) + " people and groups under Share board. ", 1)) : t.value && !t.value.length ? (n(), p("p", ff, "No direct grants yet.")) : m.value ? (n(), p("div", mf, [
          y[2] || (y[2] = s("p", {
            class: "work-spacer work-muted",
            role: "alert"
          }, "Member summary is unavailable.", -1)),
          g(r(le), {
            label: "Reload members",
            severity: "secondary",
            text: "",
            onClick: h
          })
        ])) : t.value ? S("", !0) : (n(), p("p", pf, "Loading members…"))
      ]),
      g(Fe, {
        class: "work-disclosure work-visibility-disclosure",
        label: e.draft.visibility ? "Advanced · Item visibility rules set" : "Advanced · Item visibility"
      }, {
        default: Y(() => [
          g(lf, {
            "board-id": e.boardId,
            draft: e.draft,
            onValidity: y[0] || (y[0] = (w) => k.$emit("validity", w))
          }, null, 8, ["board-id", "draft"])
        ]),
        _: 1
      }, 8, ["label"])
    ]));
  }
}), hf = { class: "work-settings-row" }, gf = ["for"], yf = { class: "work-settings-row" }, kf = { class: "work-row-main" }, wf = ["id"], $f = { class: "work-settings-grid" }, Vf = { class: "work-stack work-tight" }, xf = { class: "work-stack work-tight" }, Cf = ["value", "inert"], Sf = {
  key: 1,
  class: "work-muted work-small"
}, Tf = {
  key: 0,
  class: "work-settings-row"
}, If = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, Df = {
  key: 1,
  class: "work-muted work-small",
  role: "status"
}, Uf = {
  key: 1,
  class: "work-board-identity work-stack work-tight"
}, Ef = { class: "work-stack work-tight" }, Af = { class: "work-stack work-tight" }, Pf = { class: "work-stack work-tight" }, Of = ["value", "inert"], Rf = {
  key: 1,
  class: "work-muted work-small"
}, Nf = { class: "work-row" }, Mf = { class: "work-row" }, Ff = { class: "work-row work-board-title" }, Lf = {
  key: 1,
  class: "work-identity-actions"
}, Bf = ["title"], jf = {
  key: 2,
  class: "kx-err work-inline",
  role: "alert"
}, zf = {
  key: 3,
  class: "work-muted work-small",
  role: "status"
}, Wf = /* @__PURE__ */ $e({
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
    const t = e, l = a, o = q(!1), d = q(!1), f = q(""), u = q(""), v = q(""), i = q(""), c = q(!1), m = q(!1), $ = q(""), h = q(""), k = H(() => t.board?.access?.admin === !0), y = _t(), w = _t(), V = q({ title: "", description: "", icon: "", app: "" }), x = H(() => [
      { id: "", title: "Default app" },
      ...t.boardApps ?? [],
      ...t.board?.ui_app && !t.boardApps?.some((P) => P.id === t.board?.ui_app) ? [{ id: t.board.ui_app, title: t.boardApps ? "Unavailable app" : "Configured board app", disabled: !0 }] : []
    ]), E = H(() => x.value.find((P) => P.id === i.value)?.title), D = H(() => !!t.boardApps?.length || !!t.board?.ui_app), j = H(() => ({
      title: t.board?.title ?? "",
      icon: t.board?.icon ?? "",
      description: t.board?.description ?? "",
      app: t.board?.ui_app ?? ""
    }));
    function ie() {
      V.value = j.value, f.value = j.value.title, v.value = j.value.icon, u.value = j.value.description, i.value = j.value.app;
    }
    function L() {
      Bt("wc-icon-picker").then((P) => c.value = P);
    }
    function re() {
      ie(), $.value = "", h.value = "", o.value = !0, L();
    }
    const ue = H(() => {
      const P = {};
      return f.value.trim() !== V.value.title && (P.title = f.value.trim()), u.value !== V.value.description && (P.description = u.value), v.value !== V.value.icon && (P.icon = v.value), i.value !== V.value.app && (P.ui_app = i.value), P;
    }), me = H(() => (t.detail || o.value) && Object.keys(ue.value).length > 0);
    Te(j, () => {
      t.detail && !me.value && ie();
    }, { immediate: !0 }), Te(d, (P) => {
      P && L();
    }), Te(k, (P) => {
      P || ce();
    }), Te(me, (P) => l("dirty-change", P));
    function ce() {
      o.value = !1, $.value = "", h.value = "", ie();
    }
    async function ne() {
      if (!k.value || !t.board || m.value || !f.value.trim()) return;
      const P = ue.value;
      if (!Object.keys(P).length) {
        o.value = !1, h.value = "Nothing changed.";
        return;
      }
      m.value = !0, $.value = "";
      try {
        const ae = await Ft.updateBoard(t.board.board_id, P);
        f.value = f.value.trim(), V.value = { title: f.value, description: u.value, icon: v.value, app: i.value }, o.value = !1, h.value = ae.status === "unchanged" ? "Nothing changed." : "Board saved.", l("saved");
      } catch (ae) {
        $.value = pt(ae, "Could not save the board.");
      } finally {
        m.value = !1;
      }
    }
    return (P, ae) => e.detail ? (n(), p("form", {
      key: 0,
      class: "work-board-identity",
      "aria-label": "Edit board details",
      onSubmit: Me(ne, ["prevent"])
    }, [
      s("div", hf, [
        s("label", {
          for: r(y),
          class: "work-row-main work-row-title"
        }, "Board name", 8, gf),
        g(r(De), {
          id: r(y),
          modelValue: f.value,
          "onUpdate:modelValue": ae[0] || (ae[0] = (z) => f.value = z),
          required: "",
          disabled: m.value || !k.value
        }, null, 8, ["id", "modelValue", "disabled"])
      ]),
      s("div", yf, [
        s("div", kf, [
          s("h3", {
            class: "work-row-title",
            id: r(w)
          }, "Board app", 8, wf),
          ae[9] || (ae[9] = s("p", { class: "work-muted work-small" }, "Opens the board from Work navigation.", -1))
        ]),
        g(r(fe), {
          modelValue: i.value,
          "onUpdate:modelValue": ae[1] || (ae[1] = (z) => i.value = z),
          "aria-labelledby": r(w),
          options: x.value,
          placeholder: E.value,
          optionLabel: "title",
          optionValue: "id",
          optionDisabled: "disabled",
          appendTo: "self",
          disabled: m.value || !k.value || !D.value
        }, null, 8, ["modelValue", "aria-labelledby", "options", "placeholder", "disabled"])
      ]),
      at(P.$slots, "default"),
      g(Fe, {
        open: d.value,
        "onUpdate:open": ae[4] || (ae[4] = (z) => d.value = z),
        class: "work-board-appearance",
        label: "Board description and icon"
      }, {
        default: Y(() => [
          s("div", $f, [
            s("label", Vf, [
              ae[10] || (ae[10] = G("Description", -1)),
              g(r(Pa), {
                modelValue: u.value,
                "onUpdate:modelValue": ae[2] || (ae[2] = (z) => u.value = z),
                rows: "1",
                disabled: m.value || !k.value
              }, null, 8, ["modelValue", "disabled"])
            ]),
            s("div", xf, [
              ae[11] || (ae[11] = s("span", null, "Board icon", -1)),
              c.value ? (n(), p("wc-icon-picker", {
                key: 0,
                value: v.value,
                fallback: "tabler:layout-kanban",
                inert: m.value || !k.value || void 0,
                onSelect: ae[3] || (ae[3] = (z) => v.value = z.detail)
              }, null, 40, Cf)) : (n(), p("p", Sf, "The icon picker is unavailable."))
            ])
          ])
        ]),
        _: 1
      }, 8, ["open"]),
      me.value || $.value || h.value ? (n(), p("div", Tf, [
        $.value ? (n(), p("p", If, T($.value), 1)) : h.value && !me.value ? (n(), p("p", Df, T(h.value), 1)) : S("", !0),
        me.value ? (n(), p(te, { key: 2 }, [
          g(r(le), {
            label: "Save board details",
            type: "submit",
            size: "small",
            disabled: !f.value.trim() || m.value || !k.value,
            loading: m.value
          }, null, 8, ["disabled", "loading"]),
          g(r(le), {
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
    ], 32)) : (n(), p("div", Uf, [
      o.value ? (n(), p("form", {
        key: 0,
        class: "work-identity-edit",
        "aria-label": "Edit board",
        onClick: ae[8] || (ae[8] = Me(() => {
        }, ["stop"])),
        onSubmit: Me(ne, ["prevent"])
      }, [
        s("label", Ef, [
          ae[12] || (ae[12] = G("Title", -1)),
          g(r(De), {
            modelValue: f.value,
            "onUpdate:modelValue": ae[5] || (ae[5] = (z) => f.value = z),
            required: "",
            autofocus: "",
            disabled: m.value
          }, null, 8, ["modelValue", "disabled"])
        ]),
        s("label", Af, [
          ae[13] || (ae[13] = G("Description", -1)),
          g(r(Pa), {
            modelValue: u.value,
            "onUpdate:modelValue": ae[6] || (ae[6] = (z) => u.value = z),
            rows: "1",
            disabled: m.value
          }, null, 8, ["modelValue", "disabled"])
        ]),
        s("div", Pf, [
          ae[14] || (ae[14] = s("span", null, "Board icon", -1)),
          c.value ? (n(), p("wc-icon-picker", {
            key: 0,
            value: v.value,
            fallback: "tabler:layout-kanban",
            inert: m.value || void 0,
            onSelect: ae[7] || (ae[7] = (z) => v.value = z.detail)
          }, null, 40, Of)) : (n(), p("p", Rf, "The icon picker is unavailable."))
        ]),
        s("div", Nf, [
          g(r(le), {
            label: "Save",
            severity: "secondary",
            type: "submit",
            disabled: !f.value.trim() || m.value,
            loading: m.value,
            outlined: ""
          }, {
            icon: Y(() => [
              g(r(ve), {
                icon: "tabler:device-floppy",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled", "loading"]),
          g(r(le), {
            label: "Cancel",
            severity: "secondary",
            disabled: m.value,
            onClick: ce,
            outlined: ""
          }, {
            icon: Y(() => [
              g(r(ve), {
                icon: "tabler:x",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled"])
        ])
      ], 32)) : (n(), p(te, { key: 1 }, [
        s("div", Mf, [
          s("div", Ff, [
            e.board?.icon ? (n(), J(r(ve), {
              key: 0,
              icon: e.board.icon,
              "aria-hidden": "true"
            }, null, 8, ["icon"])) : S("", !0),
            (n(), J(ma(e.compact ? "h2" : "h1"), {
              class: $t(e.compact ? "kx-card-name" : "kx-title")
            }, {
              default: Y(() => [
                G(T(e.board?.title || "Untitled board"), 1)
              ]),
              _: 1
            }, 8, ["class"]))
          ]),
          e.compact ? at(P.$slots, "title-end", {}, void 0, void 0, 0) : S("", !0),
          e.compact ? (n(), p("span", Lf, [
            k.value ? (n(), J(r(le), {
              key: 0,
              severity: "secondary",
              text: "",
              size: "small",
              onClick: Me(re, ["stop"]),
              "aria-label": "Edit board"
            }, {
              default: Y(() => [
                g(r(ve), {
                  icon: "tabler:pencil",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            })) : S("", !0),
            at(P.$slots, "actions")
          ])) : k.value ? (n(), J(r(le), {
            key: 2,
            severity: "secondary",
            text: "",
            size: "small",
            onClick: Me(re, ["stop"]),
            "aria-label": "Edit board"
          }, {
            default: Y(() => [
              g(r(ve), {
                icon: "tabler:pencil",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          })) : S("", !0),
          e.compact ? S("", !0) : at(P.$slots, "title-end", {}, void 0, void 0, 3)
        ]),
        !e.compact && (e.subtitle || e.board?.description) ? (n(), p("p", {
          key: 0,
          class: "kx-head-sub",
          title: e.subtitle || e.board?.description
        }, T(e.subtitle || e.board?.description), 9, Bf)) : S("", !0)
      ], 64)),
      $.value ? (n(), p("p", jf, T($.value), 1)) : S("", !0),
      h.value ? (n(), p("p", zf, T(h.value), 1)) : S("", !0)
    ]));
  }
}), qf = { class: "work-ia-section work-ia-general" }, Gf = {
  class: "work-settings-list work-board-details",
  "aria-label": "Board details"
}, Kf = {
  key: 0,
  class: "work-settings-row"
}, Hf = { class: "work-settings-row" }, Yf = { class: "work-row-main" }, Xf = ["for"], Jf = { class: "work-muted work-small" }, Zf = {
  class: "work-board-summary work-row work-wrap work-small",
  "aria-label": "Board summary"
}, Qf = { class: "work-muted" }, _f = { key: 0 }, em = { key: 1 }, tm = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, am = {
  key: 0,
  class: "work-stack work-tight"
}, lm = {
  key: 0,
  class: "work-stack work-tight"
}, om = {
  key: 1,
  class: "work-muted"
}, im = { class: "work-stack work-tight" }, nm = { class: "work-spacer" }, sm = /* @__PURE__ */ $e({
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
    const a = e, t = _t(), l = {
      comments_per_item: "Comments per item",
      audit: "Change history",
      audit_days: "Change history retention",
      interval_days: "Time-in-state history retention",
      trash_days: "Trash retention",
      tombstone_days: "Deletion record retention"
    }, o = H(() => Object.keys(l).filter((h) => a.draft.policy?.[h] !== void 0));
    function d(h) {
      const k = a.draft.policy?.[h];
      return h === "audit" ? k === "off" ? "Off" : "Track field changes" : h === "comments_per_item" ? k : k === 0 ? h === "audit_days" || h === "interval_days" ? "365 days" : "Clean up immediately" : k === 1 ? "1 day" : k + " days";
    }
    const f = q(), u = q(!1);
    let v = "";
    Te([() => a.active, () => a.board?.board_id, () => a.schema.generation], async ([h, k, y], w, V) => {
      if (!h || !k || v === k + "/" + y) return;
      f.value = void 0, u.value = !1;
      let x = !0;
      V(() => x = !1);
      try {
        const E = await Promise.all(Array.from(
          { length: Math.min(3, Math.max(0, y - 1)) },
          (D, j) => Ft.schema(k, y - j - 1)
        ));
        x && (f.value = E, v = k + "/" + y);
      } catch {
        x && (u.value = !0);
      }
    }, { immediate: !0 });
    function i(h) {
      return JSON.stringify(h, (k, y) => y && typeof y == "object" && !Array.isArray(y) ? Object.fromEntries(Object.entries(y).sort(([w], [V]) => w.localeCompare(V))) : y);
    }
    function c(h, k) {
      if (!k) return ["Initial board setup"];
      const y = h.declaration, w = k.declaration, V = [], x = [
        ["Fields", y.fields, w.fields],
        ["Item types", y.item_types, w.item_types],
        ["Workflow", y.processes, w.processes],
        ["Links", y.relation_types, w.relation_types],
        ["Plugins and filters", [y.plugins, y.scopes], [w.plugins, w.scopes]],
        ["Item visibility", y.visibility, w.visibility],
        ["Board rules", y.policy, w.policy],
        ["Starting pack", h.pack, k.pack],
        ["Item key prefix", h.key_prefix, k.key_prefix]
      ];
      if (i(y.fields) !== i(w.fields)) {
        const D = y.fields?.filter((j) => !w.fields?.some((ie) => ie.code === j.code)) ?? [];
        D.length === 1 && V.push("Added " + Ze(D[0]));
      }
      const E = x.filter(([, D, j]) => i(D) !== i(j)).map(([D]) => D).filter((D) => D !== "Fields" || !V.length);
      return E.length && V.push(E.join(", ") + " updated"), V.length ? V : ["Board setup updated"];
    }
    const m = q(!1), $ = H(() => {
      if (!f.value || a.schema.generation < 1) return [];
      const h = [a.schema, ...f.value];
      return h.slice(0, 3).map((k, y) => c(k, h[y + 1]));
    });
    return (h, k) => (n(), p("section", qf, [
      s("section", Gf, [
        e.board ? (n(), p("div", Kf, [
          k[8] || (k[8] = s("div", { class: "work-row-main" }, [
            s("h3", { class: "work-row-title" }, "Board access"),
            s("p", { class: "work-muted work-small" }, "Give people and groups access to this board.")
          ], -1)),
          s("div", null, [
            g(r(le), {
              label: "Share board",
              type: "button",
              severity: "secondary",
              outlined: "",
              onClick: k[0] || (k[0] = (y) => h.$emit("share"))
            }, {
              icon: Y(() => [
                g(r(ve), {
                  icon: "tabler:share",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            })
          ])
        ])) : S("", !0),
        (n(), J(Wf, {
          key: e.board?.board_id,
          board: e.board,
          "board-apps": e.boardApps,
          detail: "",
          onDirtyChange: k[2] || (k[2] = (y) => h.$emit("dirty-change", y)),
          onSaved: k[3] || (k[3] = (y) => h.$emit("saved"))
        }, {
          default: Y(() => [
            s("div", Hf, [
              s("div", Yf, [
                s("label", {
                  class: "work-row-title",
                  for: r(t)
                }, "Item key prefix", 8, Xf),
                s("p", Jf, "Shown on items, for example " + T(e.draft.key_prefix || "WORK") + "-1.", 1)
              ]),
              g(r(De), {
                id: r(t),
                modelValue: e.draft.key_prefix,
                "onUpdate:modelValue": k[1] || (k[1] = (y) => e.draft.key_prefix = y),
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
      s("section", Zf, [
        s("p", Qf, [
          e.board?.open_count !== void 0 && e.board.item_count !== void 0 ? (n(), p("span", _f, T(e.board.open_count) + " open · " + T(e.board.item_count) + " total · ", 1)) : S("", !0),
          G(" " + T(e.packTitle || "No pack installed"), 1),
          e.outdated ? (n(), p("span", em, " · Update available")) : S("", !0)
        ]),
        e.packError ? (n(), p("p", tm, T(e.packError), 1)) : S("", !0),
        e.packError ? (n(), J(r(le), {
          key: 1,
          label: "Reload packs",
          severity: "secondary",
          outlined: "",
          size: "small",
          onClick: k[4] || (k[4] = (y) => h.$emit("retry"))
        })) : S("", !0),
        e.packTitle ? e.outdated ? (n(), J(r(le), {
          key: 3,
          label: "Update pack",
          severity: "secondary",
          outlined: "",
          size: "small",
          disabled: !e.canUpgrade,
          title: e.upgradeReason,
          onClick: k[6] || (k[6] = (y) => h.$emit("upgrade"))
        }, null, 8, ["disabled", "title"])) : S("", !0) : (n(), J(r(le), {
          key: 2,
          label: "Install pack",
          severity: "secondary",
          outlined: "",
          size: "small",
          disabled: !e.canInstall,
          onClick: k[5] || (k[5] = (y) => h.$emit("install"))
        }, null, 8, ["disabled"]))
      ]),
      e.schema.pack ? (n(), J(Fe, {
        key: 0,
        open: m.value,
        "onUpdate:open": k[7] || (k[7] = (y) => m.value = y),
        class: "work-disclosure work-small",
        label: "Technical details"
      }, {
        default: Y(() => [
          m.value ? (n(), p("dl", am, [
            s("div", null, [
              k[9] || (k[9] = s("dt", null, "Pack ID", -1)),
              s("dd", null, [
                s("code", null, T(e.schema.pack.id), 1)
              ])
            ]),
            s("div", null, [
              k[10] || (k[10] = s("dt", null, "Pack version", -1)),
              s("dd", null, T(e.schema.pack.version), 1)
            ]),
            k[11] || (k[11] = s("div", null, [
              s("dt", null, "Pack tools"),
              s("dd", null, [
                s("code", null, "WorkPackPlan"),
                G(", "),
                s("code", null, "WorkPackApply")
              ])
            ], -1))
          ])) : S("", !0)
        ]),
        _: 1
      }, 8, ["open"])) : S("", !0),
      g(Fe, {
        class: "work-disclosure",
        label: "Recent setup changes"
      }, {
        default: Y(() => [
          $.value.length ? (n(), p("ul", lm, [
            (n(!0), p(te, null, de($.value, (y, w) => (n(), p("li", { key: w }, T(y.join(" · ")), 1))), 128))
          ])) : (n(), p("p", om, T(u.value ? "Recent changes are unavailable." : f.value ? "No setup changes yet." : "Loading recent changes…"), 1))
        ]),
        _: 1
      }),
      o.value.length ? (n(), J(Fe, {
        key: 1,
        class: "work-settings-card work-disclosure",
        label: "Advanced · Existing board overrides"
      }, {
        default: Y(() => [
          k[12] || (k[12] = s("p", { class: "work-muted" }, "Clear an override to use the Work application default.", -1)),
          s("ul", im, [
            (n(!0), p(te, null, de(o.value, (y) => (n(), p("li", {
              key: y,
              class: "work-row work-wrap"
            }, [
              s("span", nm, T(l[y]) + " · " + T(d(y)), 1),
              g(r(le), {
                label: "Use default for " + l[y].toLowerCase(),
                disabled: e.disabled,
                size: "small",
                text: "",
                onClick: (w) => delete e.draft.policy[y]
              }, null, 8, ["label", "disabled", "onClick"])
            ]))), 128))
          ])
        ]),
        _: 1
      })) : S("", !0)
    ]));
  }
}), Ge = (e, a) => `${e} → ${a}`, Ro = (e, a) => {
  const t = e.fields?.find((l) => l.code === a);
  return t ? Ze(t) : "Untitled field";
}, No = {
  comments_per_item: "Comments per item",
  stage_timeout: "Default attempt timeout",
  stage_max_visits: "Default maximum visits",
  audit: "Audit trail",
  audit_days: "Audit history",
  trash_days: "Keep trashed items",
  tombstone_days: "Keep deletion records",
  interval_days: "Keep state history"
};
function Mo(e, a) {
  if (a === void 0) return "Application default";
  if (e === "audit") return Pe(String(a));
  if (e === "stage_timeout") {
    const t = xa(String(a));
    if (t) return `${t.amount.toLocaleString()} ${t.amount === 1 ? t.unit.slice(0, -1) : t.unit}`;
  }
  if (e.endsWith("_days")) {
    const t = a === 0 && (e === "audit_days" || e === "interval_days") ? 365 : a;
    return `${t} ${t === 1 ? "day" : "days"}`;
  }
  return String(a);
}
function rm(e, a) {
  const t = e.policy ?? {}, l = a.policy ?? {}, o = Object.keys(No).flatMap((u) => t[u] === l[u] ? [] : [`${No[u]} · ${Ge(Mo(u, t[u]), Mo(u, l[u]))}`]), d = (u) => u ? `${u.limit}${u.hard ? " (hard limit)" : ""}` : "No limit", f = /* @__PURE__ */ new Set([...Object.keys(t.wip ?? {}), ...Object.keys(l.wip ?? {})]);
  for (const u of f) {
    const v = d(t.wip?.[u]), i = d(l.wip?.[u]);
    if (v === i) continue;
    const c = (a.processes ?? []).flatMap((m) => m.states).find((m) => m.id === u) ?? (e.processes ?? []).flatMap((m) => m.states).find((m) => m.id === u);
    o.push(`${pe(c)} limit · ${Ge(v, i)}`);
  }
  return o;
}
function dm(e, a, t) {
  const l = e.visibility, o = a.visibility, d = [];
  l?.field !== o?.field && d.push(Ge(
    l ? Ro(e, l.field) : "No additional restriction",
    o ? Ro(a, o.field) : "No additional restriction"
  ));
  const f = l?.levels ?? [], u = o?.levels ?? [], v = new Set([...f, ...u].map((i) => i.id));
  for (const i of v) {
    const c = f.find((y) => y.id === i), m = u.find((y) => y.id === i);
    if (c && m && JSON.stringify(c.holders) === JSON.stringify(m.holders)) continue;
    const $ = (y) => y.fields?.find((w) => w.code === y.visibility?.field)?.options?.find((w) => w.id === i)?.label, h = $(a) || $(e) || Pe(i), k = (y) => y ? y.holders.map(t).join(", ") || "No extra access" : "No level";
    d.push(`${h} · ${Ge(k(c), k(m))}`);
  }
  return l?.bypass !== o?.bypass && d.push(o?.bypass === "admin" ? "Board administrators can see every level." : "Visibility levels now apply to board administrators."), d;
}
const Ca = {
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
function um(e, a, t) {
  const { what: l, detail: o, to: d } = e, u = `${t?.name || a?.name || "Untitled workflow"} · ${Ca[l] ?? "Workflow changed"}`, v = l.startsWith("state.") ? a?.states.find((h) => h.id === o) : void 0, i = l.startsWith("state.") ? t?.states.find((h) => h.id === o) : void 0, c = l.startsWith("transition.") ? a?.transitions?.find((h) => h.id === o) : void 0, m = l.startsWith("transition.") ? t?.transitions?.find((h) => h.id === o) : void 0;
  let $ = "";
  if (l === "state.map") $ = Ge(pe(v), pe(t?.states.find((h) => h.id === d)));
  else if (l === "state.name") $ = Ge(pe(v), pe(i));
  else if (l === "state.kind") $ = `${pe(i)} · ${Ge(_a(v?.kind), _a(i?.kind))}`;
  else if (l === "state.category" && v && i) $ = `${pe(i)} · ${Ge(zt(v.category), zt(i.category))}`;
  else if (i || v) $ = pe(i ?? v);
  else if (l === "transition.name" && c && m) $ = Ge(Ke(c), Ke(m));
  else if (m && c && m.to !== c.to) {
    const h = pe(a?.states.find((y) => y.id === c.to)), k = pe(t?.states.find((y) => y.id === m.to));
    return { title: u, details: [Ke(m), `Destination changes from ${h} to ${k}.`] };
  } else if (l === "transition.add" && m && t) {
    const h = m.from === "any" ? "Any state" : m.from.map((y) => pe(t.states.find((w) => w.id === y))).join(", "), k = pe(t.states.find((y) => y.id === m.to));
    return { title: u, details: [Ke(m), Ge(h, k), ...m.auto ? ["Runs automatically."] : []] };
  } else m ? $ = Ke(m) : c ? $ = Ke(c) : l === "initial" ? $ = Ge(pe(a?.states.find((h) => h.id === a.initial)), pe(t?.states.find((h) => h.id === t.initial))) : l === "name" && ($ = Ge(a?.name || "Untitled workflow", t?.name || "Untitled workflow"));
  return { title: u, details: $ ? [$] : [] };
}
function cm(e, a, t, l) {
  const { code: o, what: d, detail: f } = e;
  if (o === "schema" || d === "visibility.remove")
    return d === "policy" ? { title: "Board limits and defaults", details: rm(a, t) } : d.startsWith("visibility") ? { title: "Who can see items", details: dm(a, t, l) } : d === "key_prefix" ? { title: "Item key prefix", details: [Ge(a.key_prefix ?? "Default", t.key_prefix ?? "Default")] } : { title: { plugins: "Board plugins changed", scopes: "Saved query filters changed", "rollup.recompute": "Calculated totals will update" }[d] ?? "Board settings changed", details: [] };
  if (o.startsWith("process ")) {
    const m = o.slice(8);
    return um(e, a.processes?.find(($) => $.id === m), t.processes?.find(($) => $.id === m));
  }
  if (o.startsWith("item_type ")) {
    const m = o.slice(10), $ = a.item_types?.find((y) => y.id === m), h = t.item_types?.find((y) => y.id === m);
    return { title: `${h?.title || $?.title || "Item type"} · ${Ca[d] ?? "Item type changed"}`, details: d === "title" ? [Ge($?.title || "Untitled item type", h?.title || "Untitled item type")] : [] };
  }
  if (o.startsWith("relation ")) {
    const m = o.slice(9), $ = a.relation_types?.find((y) => y.id === m), h = t.relation_types?.find((y) => y.id === m), k = d === "label" ? [Ge([$?.outward, $?.inward].filter(Boolean).join(" / "), [h?.outward, h?.inward].filter(Boolean).join(" / "))] : [];
    return { title: `${h?.outward || $?.outward || "Link type"} · ${Ca[d] ?? "Link type changed"}`, details: k };
  }
  const u = t.fields?.find((m) => m.code === o), v = a.fields?.find((m) => u?.id !== void 0 ? m.id === u.id : m.code === (d.startsWith("renamed from ") ? d.slice(13) : o)), i = u ?? v;
  if (!i) return { title: Ca[d] ?? "Board settings changed", details: [] };
  const c = `${Ze(i)} · ${d.startsWith("renamed from ") ? "Field key" : Ca[d] ?? "Field settings changed"}`;
  if (d.startsWith("options.")) {
    const m = v?.options ?? [], $ = u?.options ?? [], h = m.findIndex((E) => E.id === f), k = $.findIndex((E) => E.id === f), y = m[h], w = $[k], V = w?.label || y?.label || "Untitled choice", x = y && w && y.label !== w.label ? [] : [V];
    if (y && w) {
      y.label !== w.label && x.push(Ge(y.label || "Untitled choice", w.label || "Untitled choice")), y.category !== w.category && x.push(`Category · ${Ge(y.category ? zt(y.category) : "None", w.category ? zt(w.category) : "None")}`);
      const E = y.order ?? h + 1, D = w.order ?? k + 1;
      E !== D && x.push(`Order · ${Ge(E, D)}`), y.color !== w.color && x.push(`Color · ${Ge(y.color ?? "Default", w.color ?? "Default")}`);
    }
    return { title: c, details: x };
  }
  return d === "title" && v && u ? { title: c, details: [Ge(Ze(v), Ze(u))] } : { title: c, details: [] };
}
const vm = {
  key: 0,
  class: "work-settings-card work-schema-plan work-stack",
  "aria-label": "Schema review"
}, fm = { key: 0 }, mm = { class: "work-row work-wrap" }, pm = { class: "work-muted" }, bm = {
  key: 0,
  class: "work-stack work-tight",
  "aria-label": "Plugin configuration"
}, hm = {
  key: 1,
  class: "work-notice"
}, gm = {
  key: 2,
  class: "work-notice"
}, ym = {
  key: 3,
  class: "work-stack work-tight",
  "aria-label": "Reviewed Flow bindings"
}, km = { key: 4 }, wm = {
  key: 5,
  class: "work-settings-table"
}, $m = { key: 0 }, Vm = /* @__PURE__ */ $e({
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
    const a = e, t = {}, l = H(() => a.original ?? t), o = H(() => a.declaration ?? t), d = H(() => (a.plugins ?? []).flatMap((E) => {
      if (!E.config_schema) return [];
      const D = a.pluginConfigs?.[E.plugin], j = !l.value.plugins?.some((L) => L.use === E.plugin) && o.value.plugins?.some((L) => L.use === E.plugin);
      if (!D && !j) return [];
      const ie = Jl(E.config_schema).map((L) => {
        const re = D?.[L.key];
        return E.plugin === "kickside.work.planning:plugin" && L.key === "issue_types" ? { title: "Plan these item types", value: (Array.isArray(re) ? re.map((me) => o.value.item_types?.find((ce) => ce.id === me)?.title || Pe(me)) : []).join(", ") || "Uses default" } : re === void 0 ? { title: L.title, value: "Uses default" } : L.schema.writeOnly || L.schema.format === "password" || typeof re == "object" ? { title: L.title, value: "Set" } : { title: L.title, value: typeof re == "boolean" ? re ? "On" : "Off" : String(re) };
      });
      return ie.length ? [{ id: E.plugin, title: E.title || E.plugin, fields: ie }] : [];
    })), f = H(() => (o.value.processes ?? []).flatMap((E) => E.states.flatMap((D) => {
      const j = D.run?.flow_ref;
      return j ? [{ key: E.id + ":" + D.id, process: E.name || "Untitled process", state: pe(D), reference: j }] : [];
    }))), u = q(/* @__PURE__ */ new Map());
    Te(f, async (E, D, j) => {
      const ie = /* @__PURE__ */ new Map();
      u.value = ie;
      let L = !0;
      j(() => L = !1), await Promise.all([...new Set(E.map((re) => re.reference.id))].map(async (re) => {
        try {
          const ue = (await Hl.title(re))?.trim();
          L && ue && !Hi(ue) && u.value.set(re, ue);
        } catch {
          L && u.value.set(re, "Flow title unavailable");
        }
      }));
    }, { immediate: !0 });
    const v = H(() => [l.value, o.value].flatMap((E) => (E.visibility?.levels ?? []).flatMap((D) => D.holders.flatMap((j) => "group" in j ? [{ kind: "group", id: j.group }] : "user" in j ? [{ kind: "user", id: j.user }] : [])))), i = Ko(() => a.boardId ?? "", v);
    function c(E) {
      if ("user" in E) return i.label({ kind: "user", id: E.user });
      if ("group" in E) return i.label({ kind: "group", id: E.group });
      if ("field" in E) {
        const D = o.value.fields?.find((j) => j.code === E.field) ?? l.value.fields?.find((j) => j.code === E.field);
        return D ? Ze(D) : "People from a field";
      }
      return "Service";
    }
    const m = (E) => E.map((D) => {
      const j = cm(D, l.value, o.value, c);
      if (D.what === "plugins") {
        const ie = new Set(l.value.plugins?.map((re) => re.use)), L = new Set(o.value.plugins?.map((re) => re.use));
        for (const re of a.plugins ?? [])
          ie.has(re.plugin) !== L.has(re.plugin) && j.details.push((L.has(re.plugin) ? "Enable " : "Turn off ") + (re.title || "an available plugin"));
      }
      if (D.what === "plugin.config") {
        const ie = a.plugins?.find((L) => L.plugin === D.code);
        return { change: D, title: (ie?.title || "Plugin") + " settings changed", details: [] };
      }
      return { change: D, ...j };
    }), $ = H(() => m(a.plan?.changes.filter((E) => E.class !== "refused") ?? [])), h = H(() => m(a.plan?.refused ?? [])), k = H(() => {
      const E = a.plan?.migration;
      return !E || !h.value.length ? E : h.value.every((D) => D.change.what === "options.remove") ? "Add a new field with the choices you want to keep. Copy existing values into it before removing the old field." : h.value.every((D) => D.change.what === "state.remove") ? "Choose where existing items should move before removing their state." : E;
    }), y = {
      unchanged: ["No changes", "secondary"],
      cosmetic: ["Labels or settings", "secondary"],
      additive: ["New definitions", "success"],
      semantic: ["Affects existing items", "warn"],
      refused: ["Blocked", "danger"],
      initial: ["First setup", "secondary"]
    }, w = (E) => y[E]?.[0] ?? "Review needed", V = (E) => y[E]?.[1] ?? "secondary";
    function x(E) {
      const { detail: D, ...j } = E;
      return sl(E.what === "invalid" || E.what.startsWith("views.") || E.what.startsWith("automation") ? E : j);
    }
    return (E, D) => e.plan ? (n(), p("section", vm, [
      !e.plan.changes.length && !e.plan.refused.length && !e.configCount && !e.packReview ? (n(), p("p", fm, "No changes to apply.")) : (n(), p(te, { key: 1 }, [
        s("header", mm, [
          D[0] || (D[0] = s("h3", null, "Impact on this board", -1)),
          g(r(dt), {
            class: "kx-tag-sm",
            severity: V(e.plan.class)
          }, {
            default: Y(() => [
              G(T(w(e.plan.class)), 1)
            ]),
            _: 1
          }, 8, ["severity"])
        ]),
        s("p", pm, T(r(Yi)[e.plan.class] || "Review the changes below."), 1),
        d.value.length ? (n(), p("section", bm, [
          D[1] || (D[1] = s("h3", null, "Plugin configuration", -1)),
          (n(!0), p(te, null, de(d.value, (j) => (n(), p("div", {
            key: j.id
          }, [
            s("strong", null, T(j.title), 1),
            (n(!0), p(te, null, de(j.fields, (ie) => (n(), p("p", {
              key: ie.title
            }, T(ie.title) + " · " + T(ie.value), 1))), 128))
          ]))), 128))
        ])) : S("", !0),
        k.value ? (n(), p("p", hm, T(k.value), 1)) : e.follows.length ? (n(), p("p", gm, "Existing items in " + T(e.follows.join(", ")) + " will follow the updated workflow.", 1)) : S("", !0),
        f.value.length ? (n(), p("section", ym, [
          D[2] || (D[2] = s("h3", null, "Flow bindings", -1)),
          (n(!0), p(te, null, de(f.value, (j) => (n(), p("p", {
            key: j.key
          }, [
            G(T(j.process) + " / " + T(j.state) + " · ", 1),
            s("strong", null, T(u.value.get(j.reference.id) ?? "Published Flow") + " · v" + T(j.reference.version), 1)
          ]))), 128)),
          D[3] || (D[3] = s("p", { class: "work-muted work-small" }, "New entries use these exact published versions. Before replacing a binding, stop new entries, let existing runs and deliveries finish, pause the old launcher, save, then resume entries.", -1))
        ])) : S("", !0),
        at(E.$slots, "default"),
        h.value.length ? (n(), p("h3", km, "Blocked changes")) : S("", !0),
        (n(!0), p(te, null, de(h.value, (j, ie) => (n(), J(r(nn), {
          key: ie,
          severity: "error",
          role: "alert"
        }, {
          default: Y(() => [
            s("strong", null, T(j.title), 1),
            (n(!0), p(te, null, de(j.details, (L, re) => (n(), p("p", { key: re }, T(L), 1))), 128)),
            s("p", null, T(x(j.change)), 1),
            g(Fe, {
              class: "work-small",
              label: "Technical details"
            }, {
              default: Y(() => [
                s("code", null, T(j.change.what), 1)
              ]),
              _: 2
            }, 1024)
          ]),
          _: 2
        }, 1024))), 128)),
        $.value.length ? (n(), p("table", wm, [
          D[4] || (D[4] = s("thead", null, [
            s("tr", null, [
              s("th", { scope: "col" }, "Change"),
              s("th", { scope: "col" }, "Impact")
            ])
          ], -1)),
          s("tbody", null, [
            (n(!0), p(te, null, de($.value, (j, ie) => (n(), p("tr", { key: ie }, [
              s("td", null, [
                s("strong", null, T(j.title), 1),
                (n(!0), p(te, null, de(j.details, (L, re) => (n(), p("p", { key: re }, T(L), 1))), 128)),
                j.change.count ? (n(), p("p", $m, T(j.change.count) + " " + T(j.change.count === 1 ? "item" : "items"), 1)) : S("", !0)
              ]),
              s("td", null, [
                g(r(dt), {
                  class: "kx-tag-sm",
                  severity: V(j.change.class)
                }, {
                  default: Y(() => [
                    G(T(w(j.change.class)), 1)
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
}, Am = /* @__PURE__ */ $e({
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
    const t = e, l = a, o = H(() => [
      { label: "Saved views", entries: t.plan.views?.map((c) => ({ id: c.id, name: c.title || c.id })) },
      { label: "Automations", entries: t.plan.automations?.map((c) => ({ id: c.id, name: c.id })) },
      { label: "Traits", entries: t.plan.traits?.map((c) => ({ id: c, name: c })) },
      { label: "Required plugins", entries: t.plan.plugins?.map((c) => ({ id: c, name: t.plugins?.find((m) => m.plugin === c)?.title || c })) }
    ].filter((c) => c.entries?.length));
    function d(c) {
      return t.original.processes?.find((m) => m.id === c)?.name || Pe(c);
    }
    function f(c) {
      const [m, ...$] = c.split("."), h = $.join(".");
      return m === "processes" ? d(h) : m === "fields" ? t.original.fields?.find((k) => k.code === h)?.title || Pe(h) : m === "item_types" ? t.original.item_types?.find((k) => k.id === h)?.title || Pe(h) : Pe(m);
    }
    function u(c) {
      return JSON.stringify(c ?? null, null, 2);
    }
    function v(c, m) {
      (t.request.resolutions ??= {})[c] = m, l("change");
    }
    function i(c, m, $) {
      ((t.request.maps ??= {})[c] ??= {})[m] = $, l("change");
    }
    return (c, m) => (n(), p(te, null, [
      s("section", xm, [
        m[1] || (m[1] = s("h3", null, "Pack resources", -1)),
        s("p", null, [
          m[0] || (m[0] = G("Target version ", -1)),
          s("strong", null, T(e.plan.version), 1)
        ]),
        o.value.length ? (n(), p("p", Cm, "Resources included in this plan.")) : S("", !0),
        (n(!0), p(te, null, de(o.value, ($) => (n(), p("div", {
          key: $.label
        }, [
          s("h4", null, T($.label), 1),
          s("ul", null, [
            (n(!0), p(te, null, de($.entries, (h) => (n(), p("li", {
              key: h.id
            }, T(h.name), 1))), 128))
          ])
        ]))), 128))
      ]),
      e.plan.conflicts.length ? (n(), p("section", Sm, [
        m[4] || (m[4] = s("h3", null, "Local edits conflict", -1)),
        m[5] || (m[5] = s("p", { class: "work-muted work-small" }, "Choose which declaration to keep for each conflict, then review again.", -1)),
        (n(!0), p(te, null, de(e.plan.conflicts, ($) => (n(), p("div", {
          key: $.path,
          class: "work-stack work-tight"
        }, [
          s("label", Tm, [
            G(T(f($.path)), 1),
            g(r(fe), {
              "model-value": e.request.resolutions?.[$.path],
              "aria-label": "Resolution for " + f($.path),
              disabled: e.disabled,
              appendTo: "self",
              placeholder: "Choose a resolution",
              optionLabel: "label",
              optionValue: "value",
              options: [{ label: "Keep local edits", value: "local" }, { label: "Use pack changes", value: "incoming" }],
              "onUpdate:modelValue": (h) => v($.path, h)
            }, null, 8, ["model-value", "aria-label", "disabled", "onUpdate:modelValue"])
          ]),
          g(Fe, {
            class: "work-json-disclosure",
            label: "Compare declarations"
          }, {
            default: Y(() => [
              s("div", Im, [
                s("section", null, [
                  m[2] || (m[2] = s("h4", null, "Local edits", -1)),
                  s("pre", Dm, T(u($.local_value)), 1)
                ]),
                s("section", null, [
                  m[3] || (m[3] = s("h4", null, "Pack changes", -1)),
                  s("pre", Um, T(u($.incoming)), 1)
                ])
              ])
            ]),
            _: 2
          }, 1024)
        ]))), 128))
      ])) : S("", !0),
      Object.keys(e.plan.maps).length ? (n(), p("section", Em, [
        m[6] || (m[6] = s("h3", null, "Required state maps", -1)),
        m[7] || (m[7] = s("p", { class: "work-muted work-small" }, "Review the proposed destinations for existing items. Each destination is editable.", -1)),
        (n(!0), p(te, null, de(e.plan.maps, ($, h) => (n(), p("div", {
          key: h,
          class: "work-stack"
        }, [
          s("h4", null, T(d(h)), 1),
          (n(!0), p(te, null, de($, (k, y) => (n(), p("label", {
            key: y,
            class: "work-stack work-tight work-pack-review-field"
          }, [
            G("Move items from " + T(r(pe)(e.original.processes?.find((w) => w.id === h)?.states.find((w) => w.id === y))), 1),
            g(r(fe), {
              "model-value": e.request.maps?.[h]?.[y],
              "aria-label": "Move items from " + r(pe)(e.original.processes?.find((w) => w.id === h)?.states.find((w) => w.id === y)),
              disabled: e.disabled,
              appendTo: "self",
              optionLabel: "label",
              optionValue: "value",
              options: e.plan.declaration.processes?.find((w) => w.id === h)?.states.map((w) => ({ label: r(pe)(w), value: w.id })) ?? [],
              "onUpdate:modelValue": (w) => i(h, y, w)
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
}, jm = {
  key: 5,
  class: "work-settings-body"
}, zm = {
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
}, bp = { class: "work-dialog-actions" }, hp = /* @__PURE__ */ $e({
  __name: "BoardSettings",
  props: {
    boardId: {},
    embedded: { type: Boolean },
    focusBack: { type: Boolean },
    route: {}
  },
  emits: ["dirty-change", "navigate"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = mn(), d = _t(), f = q();
    let u, v = "";
    const i = () => JSON.stringify([St.value, Q.value, Ee.value, [...it.value]]), c = H(() => ({
      value: "all-boards",
      label: t.embedded ? "All boards" : "Back to board",
      icon: t.embedded ? "tabler:table" : "tabler:layout-kanban"
    })), m = q();
    Te(m, (K) => {
      t.focusBack && K?.$el.querySelector(".kx-settings-rail-item")?.focus();
    }, { flush: "post", once: !0 });
    const $ = [
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
    ], h = q("General"), k = {
      General: "general",
      "Item types": "items",
      Fields: "fields",
      Links: "links",
      Workflow: "workflow",
      Access: "access",
      Plugins: "plugins"
    }, y = q("");
    function w(K, R = "") {
      h.value = K, y.value = R ? k[K] + "/" + R : "";
    }
    function V(K, R = "") {
      w(K, R), t.route !== void 0 && l("navigate", [k[K], ...R ? [encodeURIComponent(R)] : []].join("/"));
    }
    function x(K, R, ee) {
      if (t.route === void 0 || k[h.value] !== K || !ee && y.value !== K + "/" + R) return;
      const ye = B.value?.declaration;
      (K === "items" ? ye?.item_types?.some((Ae) => Ae.id === R) : K === "fields" ? ye?.fields?.some((Ae) => Ae.code === R) : K === "links" ? ye?.relation_types?.some((Ae) => Ae.id === R) : K === "plugins" ? b.value?.schema_options.plugins.some((Ae) => Ae.plugin === R) : K === "workflow" && ye?.processes?.some((Ae) => Ae.states.some((Re) => Ae.id + ".state." + Re.id === R) || Ae.transitions?.some((Re) => Ae.id + ".transition." + Re.id === R))) && V(h.value, ee ? R : "");
    }
    jo(rl, { selected: y, choose: x });
    function E(K) {
      if (K === c.value.value) {
        Ti();
        return;
      }
      (K === "General" || $.some((R) => R.items.some((ee) => ee.value === K))) && V(K);
    }
    async function D() {
      V("Access"), await It(), f.value?.focus();
    }
    const j = {
      General: "Manage the board name, item key prefix and app.",
      "Item types": "Choose the fields, parent relationships and workflow for each kind of work.",
      Fields: "Choose what information people can capture on items.",
      Links: "Configure link types and how they appear on related items.",
      Workflow: "Select a state or transition to edit how work moves.",
      Access: "Who can use this board?",
      Plugins: "Choose which plugins this board uses."
    }, ie = q(""), L = q();
    function re(K, R, ee) {
      ee.currentTarget instanceof HTMLElement && (L.value = { section: K, type: R, opener: ee.currentTarget }, K === "Fields" && (ie.value = R.id), V(K));
    }
    function ue(K) {
      const R = L.value;
      if (!R) return;
      K !== void 0 && (R.type.process = K);
      const ee = R.type.id, ye = B.value?.declaration.item_types?.some((Be) => Be.id === ee);
      V("Item types", ye ? ee : ""), L.value = void 0, R.section === "Fields" && It(() => R.opener.focus());
    }
    const me = q(!1), ce = q(""), ne = q();
    Te(h, (K) => {
      f.value?.scrollTo({ top: 0 }), L.value && K !== L.value.section && (L.value = void 0);
    });
    function P() {
      me.value = !1, ce.value = "", La.value = !1;
    }
    function ae(K) {
      !vl.value || !Vi() || it.value.size || (ne.value = K, me.value = !0, wl());
    }
    const z = q(!1), ge = q(""), Ve = q(/* @__PURE__ */ new Set(["General"]));
    Te(h, (K) => Ve.value.add(K));
    const B = q(), I = q(), C = q(), U = q({}), Q = q({}), b = q(), A = q(!1), Z = q(!0), X = q(!1), we = q(""), xe = q(""), Oe = H(() => U.value.processes ?? []), N = H(() => A.value && B.value ? [
      { heading: C.value?.title || "Board settings", items: [{ value: "General", label: "General", icon: "tabler:settings" }] },
      ...$
    ] : []), se = q(), O = q(!1), M = Sa();
    async function F(K) {
      const R = M();
      O.value = !1;
      try {
        const ee = await Ft.stateCounts(K);
        R() && (se.value = ee);
      } catch {
        R() && (O.value = !0, se.value = void 0);
      }
    }
    Te(h, (K) => {
      A.value && K === "Workflow" && F(t.boardId);
    });
    const { packs: W, loading: _, error: Ce, load: Ue, reset: et } = Xi(), lt = H(() => W.value.filter(Ji)), Qe = H(() => W.value.map(Zi)), He = H(() => Qe.value.find((K) => K.id === ge.value && !K.disabled)), Ee = q(), ze = q(), ot = q(), ht = q(), Ot = q(""), ea = H(() => !!ht.value && ht.value.result.status !== "done"), ba = H(() => !X.value && !aa.value && !la.value && !ea.value), vl = H(() => aa.value && !(ea.value && Ee.value)), Xe = q(), Wt = q(), ta = q(""), fl = q([]), ml = H(() => [...fl.value, ...Xe.value?.refused ?? []]), gt = q(!1), io = q(0), it = q(/* @__PURE__ */ new Set()), pl = q(), no = Sa(), Fa = Sa(), St = H(() => xl(U.value, B.value?.declaration ?? {})), aa = H(() => it.value.size > 0 || !!Ee.value || !!B.value && (JSON.stringify(St.value) !== JSON.stringify(xl(B.value.declaration, B.value.declaration)) || Object.keys(Q.value).length > 0)), bl = q(!1), so = H(() => aa.value || bl.value);
    Te(so, (K) => l("dirty-change", K), { immediate: !0, flush: "sync" });
    const ft = H(() => !!B.value && !!I.value && B.value.generation !== I.value.generation), bi = H(() => (!ha.value.renamed.length || La.value) && A.value && !X.value && !gt.value && !la.value && !ft.value && !it.value.size && Xe.value && (Xe.value.changes.length > 0 || Object.keys(Q.value).length > 0) && Xe.value.class !== "refused" && !Xe.value.refused.length && Wt.value?.matches(St.value, B.value?.generation ?? -1, Q.value)), La = q(!1), ha = H(() => {
      const K = B.value?.declaration, R = [], ee = [];
      for (const ye of Oe.value) {
        const Be = K?.item_types?.filter((Re) => Re.process === ye.id) ?? [], Ae = K?.processes?.find((Re) => Re.id === ye.id);
        for (const Re of Ae?.states ?? []) {
          const ja = ye.states.find((qt) => qt.id === Re.id);
          if (ja && ja.name === Re.name) continue;
          const Vl = [...Xe.value?.refused ?? [], ...Xe.value?.changes ?? []].find((qt) => qt.code === "process " + ye.id && qt.detail === Re.id && ["state.remove", "state.map"].includes(qt.what))?.count ?? Be.reduce((qt, Di) => qt + (se.value?.[Di.id]?.[Re.id] ?? 0), 0);
          Vl && (ja ? ee.push({ process: ye, state: Re, name: pe(ja), count: Vl }) : R.push({ process: ye, state: Re, count: Vl }));
        }
      }
      return { removed: R, renamed: ee };
    });
    function hi(K, R, ee) {
      K.map = { ...K.map, [R]: ee }, wl();
    }
    const hl = H(() => lt.value.find((K) => K.id === Ee.value?.pack)?.plugins.filter((K) => !B.value?.plugins?.some((R) => R.plugin === K.plugin && R.active)).map((K) => ({ use: K.plugin })) ?? []), ro = H(() => !!ot.value && JSON.stringify(ot.value) === JSON.stringify(Ee.value)), uo = H(() => Ee.value ? A.value && !X.value && !it.value.size && !ft.value && !la.value && ro.value && Xe.value?.class !== "refused" && !Xe.value?.refused.length && ze.value?.conflicts.every((K) => !!Ee.value?.resolutions?.[K.path]) : bi.value), co = H(() => !!Xe.value && (!Ee.value || ro.value)), gi = H(() => lt.value.find((K) => K.id === B.value?.pack?.id)?.title || "Installed pack"), gl = H(() => !Ce.value && !!B.value?.outdated && !!Qe.value.find((K) => K.id === B.value?.pack?.id && !K.disabled)), yi = H(() => Ce.value ? "Reload packs to check available upgrades." : ea.value ? "Finish the current pack installation before upgrading." : gl.value ? aa.value ? "Discard the current draft before upgrading." : la.value ? "Finish the current migration before upgrading." : X.value ? "Wait for the current request to finish." : void 0 : "Install an available version of this pack to upgrade.");
    function vo() {
      Ee.value = void 0, ze.value = void 0, ot.value = void 0;
    }
    async function ki() {
      if (!B.value?.pack || !ba.value || !gl.value) return;
      const K = lt.value.find((R) => R.id === B.value.pack.id);
      K && (ne.value = void 0, Ee.value = go(K, B.value.generation), me.value = !0, await yl());
    }
    async function wi() {
      const K = lt.value.find((R) => R.id === ge.value);
      !B.value || !K || !He.value || !ba.value || _.value || (ne.value = void 0, Ee.value = go(K, B.value.generation), z.value = !1, me.value = !0, await yl());
    }
    async function yl() {
      if (!Ee.value || X.value || !A.value || ft.value || it.value.size) return;
      const K = Fa(), R = ia(Ee.value), ee = JSON.stringify(Ee.value);
      X.value = !0, ce.value = "", xe.value = "";
      try {
        const ye = await _i(R, (Be) => Xt.packPlan(t.boardId, Be));
        if (!K() || ee !== JSON.stringify(Ee.value)) return;
        ze.value = ye.plan, Xe.value = ye.plan, Ee.value = ye.request, ot.value = ia(Ee.value), ta.value = crypto.randomUUID(), me.value = !0;
      } catch (ye) {
        K() && (ot.value = void 0, ce.value = pt(ye, "Could not review the pack."));
      } finally {
        X.value = !1;
      }
    }
    const fo = H(() => ze.value?.declaration ?? Wt.value?.declaration), $i = H(() => {
      const K = fo.value;
      return !Xe.value || !K ? [] : Qi(Xe.value, K).map((R) => K.processes?.find((ee) => ee.id === R)?.name || "Untitled process");
    }), la = H(() => !!I.value?.migration_error || C.value?.status === "migrating");
    function Tt() {
      fl.value = [], Fa(), Xe.value = void 0, Wt.value = void 0, ot.value = void 0, ta.value = "";
    }
    Te([St, Q], Tt, { deep: !0, flush: "sync" }), Te(aa, (K) => {
      K && (xe.value = "");
    }), Te(Q, (K) => {
      Ee.value && (Object.keys(K).length ? Ee.value.plugin_configs = ia(K) : delete Ee.value.plugin_configs);
    }, { deep: !0, flush: "sync" });
    function ga(K, R) {
      R ? it.value.delete(K) : it.value.add(K), Tt();
    }
    function kl(K) {
      vo(), L.value = void 0, io.value++, B.value = K, U.value = ia(K.declaration), Q.value = {}, it.value.clear(), Tt();
    }
    async function yt(K = !1) {
      const R = no();
      try {
        const [ee, ye, Be] = await Promise.all([Ft.schema(t.boardId, void 0, !0).catch((Re) => {
          if (Re instanceof Nl && Re.details?.code === "board_schema_missing") return { generation: 0, declaration: {}, compiled: {}, key_prefix: "", as_of: 0 };
          throw Re;
        }), Ft.options(t.boardId), Ft.boards()]);
        if (!R()) return;
        if (A.value = ye.access.admin, b.value = ye, C.value = Be.find((Re) => Re.board_id === t.boardId), !A.value) {
          B.value = void 0, U.value = {}, Tt();
          return;
        }
        we.value = "";
        const Ae = en(ee);
        I.value = Ae, u !== void 0 && Ae.generation >= u ? (u = void 0, v === i() && kl(Ae), v = "") : (K || !B.value || !aa.value && Ae.generation !== B.value.generation) && kl(Ae), ft.value && Tt(), await Ue(R), R() && h.value === "Workflow" && F(t.boardId);
      } catch (ee) {
        if (!R()) return;
        ee instanceof Nl && (ee.status === 403 || ee.kind?.toLowerCase() === "permission_denied") && (A.value = !1), Tt(), we.value = pt(ee, "Could not load board settings.");
      } finally {
        R() && (Z.value = !1);
      }
    }
    function Vi() {
      for (const K of Array.from(pl.value?.elements ?? []))
        if ((K instanceof HTMLInputElement || K instanceof HTMLSelectElement || K instanceof HTMLTextAreaElement) && !(K.form !== pl.value || K.closest('[style*="display: none"]:not(.p-accordioncontent)')) && !K.reportValidity()) {
          const ee = K.closest('.p-accordioncontent[style*="display: none"]')?.closest(".kx-disclosure")?.querySelector('.kx-disclosure-toggle[aria-expanded="false"]');
          return ee && (ee.click(), It(() => K.reportValidity())), !1;
        }
      return !0;
    }
    async function wl() {
      if (Ee.value) return yl();
      if (!B.value || X.value || !A.value || ft.value || it.value.size) return;
      const K = Fa(), R = yo(St.value, B.value.generation, Q.value);
      X.value = !0, ce.value = "", xe.value = "";
      try {
        const ee = (R.declaration.processes ?? []).some((Be) => B.value?.declaration.processes?.find((Ae) => Ae.id === Be.id)?.states.some((Ae) => Be.states.some((Re) => Re.id === Ae.id && Re.name !== Ae.name))), [ye] = await Promise.all([
          Xt.plan(t.boardId, R),
          ee ? F(t.boardId) : void 0
        ]);
        if (ee && O.value) {
          Tt(), ce.value = "Could not check which items use the renamed states. Check the impact again.";
          return;
        }
        if (!K() || it.value.size || !R.matches(St.value, B.value.generation, Q.value)) return;
        Xe.value = ye, Wt.value = R, ta.value = crypto.randomUUID(), me.value = !0;
      } catch (ee) {
        K() && (Tt(), ce.value = pt(ee, "Could not review changes."), fl.value = tn(ee, St.value));
      } finally {
        X.value = !1;
      }
    }
    async function xi() {
      if (!uo.value) return;
      if (Ee.value && ot.value) {
        X.value = !0, ce.value = "";
        try {
          await mo(ia(ot.value), ta.value, i()), P();
        } catch (R) {
          ce.value = pt(R, "Could not apply the pack upgrade.");
        } finally {
          X.value = !1;
        }
        return;
      }
      if (!Wt.value) return;
      X.value = !0, ce.value = "", xe.value = "";
      const K = i();
      try {
        u = (await Xt.apply(t.boardId, Wt.value, ta.value)).generation, v = K, await yt(), xe.value = "Board changes applied.", P();
      } catch (R) {
        ce.value = pt(R, "Could not apply the board changes.");
      } finally {
        X.value = !1;
      }
    }
    async function mo(K, R, ee) {
      const ye = t.boardId, Be = await Xt.packApply(ye, K, R);
      t.boardId === ye && (ht.value = { request: K, key: R, result: Be, draft: ee }, ee === i() && (u = Be.generation, v = ee), await yt());
    }
    async function Ci() {
      const K = ht.value;
      if (!(!K || !ea.value || X.value || !A.value)) {
        X.value = !0, Ot.value = "";
        try {
          await mo(K.request, K.key, K.draft);
        } catch (R) {
          Ot.value = pt(R, "Could not continue the pack installation.");
        } finally {
          X.value = !1;
        }
      }
    }
    async function Si() {
      if (!X.value) {
        X.value = !0, we.value = "";
        try {
          const K = await Xt.resume(t.boardId);
          xe.value = K.resumed ? "Migration resumes." : "Migration is already running.", await yt();
        } catch (K) {
          we.value = pt(K, "Could not resume migration.");
        } finally {
          X.value = !1;
        }
      }
    }
    async function Ba(K, R) {
      if (!B.value || !A.value || X.value || gt.value) return "Wait for the current change to finish.";
      if (ft.value) return "Discard the stale draft before removing a definition.";
      const ee = B.value.generation, ye = JSON.stringify(St.value), Be = ia(U.value);
      Ra(Be, K, R), gt.value = !0;
      try {
        const Ae = await Xt.plan(t.boardId, yo(xl(Be, B.value.declaration), ee, Q.value));
        if (!A.value || ft.value || B.value.generation !== ee || JSON.stringify(St.value) !== ye) return "The draft changes during the check. Try the removal again.";
        const Re = an(Ae, K, R);
        if (Re) return Re;
        if (Ae.class === "refused") return "Resolve the blocked changes in your draft before removing this definition.";
      } catch (Ae) {
        return pt(Ae, "Could not check this removal.");
      } finally {
        gt.value = !1;
      }
    }
    async function Ti() {
      if (t.embedded) {
        o({ name: "boards" });
        return;
      }
      so.value && !await Ho.confirm({ header: "Discard changes?", message: "Your unsaved board settings will be discarded.", acceptLabel: "Discard", rejectLabel: "Keep editing" }) || o({ name: "board", board: t.boardId });
    }
    function Ii() {
      u = void 0, I.value && kl(I.value), xe.value = "", we.value = "", P();
    }
    Te(() => t.boardId, () => {
      bl.value = !1, u = void 0, vo(), et(), ht.value = void 0, Ot.value = "", B.value = void 0, I.value = void 0, C.value = void 0, Q.value = {}, it.value.clear(), M(), se.value = void 0, ie.value = "", L.value = void 0, Ve.value = /* @__PURE__ */ new Set(["General"]), w("General"), P(), A.value = !1, Z.value = !0, yt(!0);
    }), Te([() => t.route, () => t.boardId], ([K]) => {
      if (K === void 0) return;
      const [R, ee] = K.split("/"), ye = Object.keys(k).find((Ae) => k[Ae] === R) ?? "General";
      let Be = "";
      try {
        ee && (Be = decodeURIComponent(ee));
      } catch {
      }
      ye === "Fields" && Be && y.value !== "fields/" + Be && (ie.value = ""), w(ye, Be), Ve.value.add(ye);
    }, { immediate: !0 });
    let $l = () => {
    };
    return Te(() => t.boardId, (K) => {
      $l(), $l = ln(`component.${K}`, () => {
        yt();
      });
    }, { immediate: !0 }), Ni(yt), Xl(() => {
      $l(), no(), Fa(), M();
    }), (K, R) => (n(), p("section", {
      class: $t(["work-settings-shell work-ia", { "work-embedded": e.embedded }])
    }, [
      s("div", Pm, [
        g(fn, {
          ref_key: "rail",
          ref: m,
          label: "Board settings sections",
          value: h.value,
          groups: N.value,
          "leading-item": c.value,
          "onUpdate:value": E
        }, null, 8, ["value", "groups", "leading-item"]),
        s("div", Om, [
          s("div", {
            ref_key: "pane",
            ref: f,
            class: "kx-main-scroll work-settings-content",
            role: "region",
            "aria-label": h.value,
            tabindex: "-1"
          }, [
            A.value && B.value ? (n(), J(Gv, {
              key: 0,
              title: h.value,
              description: j[h.value]
            }, il({ _: 2 }, [
              vl.value || h.value === "Plugins" ? {
                name: "actions",
                fn: Y(() => [
                  h.value === "Plugins" ? (n(), J(r(le), {
                    key: 0,
                    label: "Refresh status",
                    severity: "secondary",
                    outlined: "",
                    disabled: X.value || Z.value,
                    onClick: R[0] || (R[0] = (ee) => yt())
                  }, {
                    icon: Y(() => [
                      g(r(ve), {
                        icon: "tabler:refresh",
                        "aria-hidden": "true"
                      })
                    ]),
                    _: 1
                  }, 8, ["disabled"])) : S("", !0),
                  vl.value ? (n(), J(Kv, {
                    key: 1,
                    busy: X.value,
                    "discard-disabled": gt.value,
                    "review-disabled": gt.value || la.value || ft.value || !!it.value.size,
                    onDiscard: Ii,
                    onReview: ae
                  }, null, 8, ["busy", "discard-disabled", "review-disabled"])) : S("", !0)
                ]),
                key: "0"
              } : void 0
            ]), 1032, ["title", "description"])) : S("", !0),
            we.value ? (n(), p("div", Nm, [
              s("p", Mm, T(we.value), 1),
              g(r(le), {
                label: "Retry",
                severity: "secondary",
                outlined: "",
                onClick: R[1] || (R[1] = (ee) => yt())
              })
            ])) : S("", !0),
            xe.value ? (n(), p("p", Fm, T(xe.value), 1)) : S("", !0),
            Z.value ? (n(), p("p", Lm, "Loading board settings…")) : !A.value && !we.value ? (n(), p("p", Bm, "Ask a board administrator to grant you access to these settings.")) : S("", !0),
            A.value && B.value ? (n(), p("div", jm, [
              ht.value ? (n(), p("section", zm, [
                ea.value ? (n(), p("p", Wm, [
                  R[27] || (R[27] = G("Pack installation status ", -1)),
                  s("strong", null, T(r(Pe)(ht.value.result.status)), 1)
                ])) : (n(), p("p", qm, "Pack applied.")),
                s("p", Gm, [
                  R[28] || (R[28] = G("Operation ", -1)),
                  s("code", null, T(ht.value.result.operation_id), 1),
                  R[29] || (R[29] = G(" · Job ", -1)),
                  s("code", null, T(ht.value.result.job_id), 1)
                ]),
                Ot.value ? (n(), p("p", Km, T(Ot.value), 1)) : S("", !0),
                ea.value ? (n(), p("div", Hm, [
                  g(r(le), {
                    label: "Continue pack installation",
                    severity: "secondary",
                    outlined: "",
                    loading: X.value,
                    disabled: X.value,
                    onClick: Ci
                  }, null, 8, ["loading", "disabled"])
                ])) : S("", !0)
              ])) : S("", !0),
              ft.value ? (n(), p("p", Ym, "Someone saved new settings while you were editing. Discard this draft to load their changes.")) : S("", !0),
              la.value ? (n(), p("div", Xm, [
                s("p", null, T(I.value?.migration_error ? "Updating existing items paused." : "Updating existing items…"), 1),
                I.value?.migration_error ? (n(), J(Fe, {
                  key: 0,
                  label: "Technical details"
                }, {
                  default: Y(() => [
                    G(T(I.value.migration_error), 1)
                  ]),
                  _: 1
                })) : S("", !0),
                I.value?.migration_error ? (n(), J(r(le), {
                  key: 1,
                  label: "Resume updating items",
                  severity: "secondary",
                  disabled: X.value,
                  outlined: "",
                  onClick: Si
                }, null, 8, ["disabled"])) : S("", !0)
              ])) : S("", !0),
              Vt(g(sm, {
                draft: U.value,
                schema: I.value ?? B.value,
                board: C.value,
                active: h.value === "General",
                "board-apps": b.value?.board_apps,
                "draft-form": r(d),
                disabled: X.value || gt.value,
                "pack-title": B.value.pack ? gi.value : void 0,
                outdated: B.value.outdated,
                "upgrade-reason": yi.value,
                "can-upgrade": gl.value && ba.value,
                "can-install": ba.value,
                "pack-error": r(Ce),
                onUpgrade: ki,
                onInstall: R[2] || (R[2] = (ee) => z.value = !0),
                onRetry: R[3] || (R[3] = (ee) => r(Ue)()),
                onDirtyChange: R[4] || (R[4] = (ee) => bl.value = ee),
                onSaved: R[5] || (R[5] = (ee) => yt()),
                onShare: D
              }, null, 8, ["draft", "schema", "board", "active", "board-apps", "draft-form", "disabled", "pack-title", "outdated", "upgrade-reason", "can-upgrade", "can-install", "pack-error"]), [
                [Rt, h.value === "General"]
              ]),
              s("form", {
                id: r(d),
                ref_key: "editor",
                ref: pl,
                onSubmit: R[19] || (R[19] = Me((ee) => ae(), ["prevent"]))
              }, [
                (n(), p("fieldset", {
                  key: io.value,
                  class: "work-settings-fieldset",
                  disabled: X.value || gt.value,
                  inert: X.value || gt.value || void 0
                }, [
                  Ve.value.has("Item types") ? Vt((n(), J(ld, {
                    key: 0,
                    class: "work-ia-section",
                    draft: U.value,
                    "guard-removal": Ba,
                    issues: ml.value,
                    onCreateField: R[6] || (R[6] = (ee, ye) => re("Fields", ee, ye)),
                    onCreateWorkflow: R[7] || (R[7] = (ee, ye) => re("Workflow", ee, ye))
                  }, null, 8, ["draft", "issues"])), [
                    [Rt, h.value === "Item types"]
                  ]) : S("", !0),
                  Ve.value.has("Fields") ? Vt((n(), J(jr, {
                    key: 1,
                    class: "work-ia-section",
                    "board-id": e.boardId,
                    "installed-types": b.value?.installed_types,
                    draft: U.value,
                    "guard-removal": Ba,
                    issues: ml.value,
                    "item-type": ie.value,
                    "onUpdate:itemType": R[8] || (R[8] = (ee) => ie.value = ee),
                    "create-for-item-type": L.value?.section === "Fields",
                    onCreated: R[9] || (R[9] = (ee) => ue()),
                    onCancelCreation: R[10] || (R[10] = (ee) => ue()),
                    onValidity: R[11] || (R[11] = (ee, ye) => ga("fields:" + ee, ye))
                  }, null, 8, ["board-id", "installed-types", "draft", "issues", "item-type", "create-for-item-type"])), [
                    [Rt, h.value === "Fields"]
                  ]) : S("", !0),
                  Ve.value.has("Links") ? Vt((n(), J(bv, {
                    key: 2,
                    class: "work-ia-section",
                    draft: U.value,
                    "guard-removal": Ba
                  }, null, 8, ["draft"])), [
                    [Rt, h.value === "Links"]
                  ]) : S("", !0),
                  Ve.value.has("Workflow") ? Vt((n(), p("section", Qm, [
                    O.value ? (n(), p("p", _m, [
                      R[30] || (R[30] = G("Item counts are unavailable. ", -1)),
                      g(r(le), {
                        label: "Reload counts",
                        text: "",
                        onClick: R[12] || (R[12] = (ee) => F(e.boardId))
                      })
                    ])) : S("", !0),
                    g(Xc, {
                      "board-id": e.boardId,
                      draft: U.value,
                      "guard-removal": Ba,
                      issues: ml.value,
                      counts: se.value,
                      "count-types": B.value.declaration.item_types,
                      guards: b.value?.guards,
                      "create-for-item-type": L.value?.section === "Workflow",
                      "creation-opener": L.value?.opener,
                      onCreated: ue,
                      onCancelCreation: R[13] || (R[13] = (ee) => ue()),
                      onValidity: R[14] || (R[14] = (ee, ye) => ga("process:" + ee, ye))
                    }, null, 8, ["board-id", "draft", "issues", "counts", "count-types", "guards", "create-for-item-type", "creation-opener"])
                  ], 512)), [
                    [Rt, h.value === "Workflow"]
                  ]) : S("", !0),
                  Ve.value.has("Access") ? Vt((n(), J(bf, {
                    key: 4,
                    active: h.value === "Access",
                    "board-id": e.boardId,
                    draft: U.value,
                    board: C.value,
                    busy: X.value,
                    onValidity: R[15] || (R[15] = (ee) => ga("visibility", ee))
                  }, null, 8, ["active", "board-id", "draft", "board", "busy"])), [
                    [Rt, h.value === "Access"]
                  ]) : S("", !0),
                  Ve.value.has("Plugins") ? Vt((n(), p("section", ep, [
                    g(Oo, {
                      "board-id": e.boardId,
                      draft: U.value,
                      schema: I.value ?? B.value,
                      options: b.value?.schema_options.plugins ?? [],
                      filters: b.value?.filters,
                      configs: Q.value,
                      disabled: X.value,
                      onConfigured: R[16] || (R[16] = (ee) => {
                        Tt(), yt();
                      }),
                      onRefresh: R[17] || (R[17] = (ee) => yt()),
                      onReview: ae,
                      onValidity: R[18] || (R[18] = (ee, ye) => ga("plugin:" + ee, ye))
                    }, null, 8, ["board-id", "draft", "schema", "options", "filters", "configs", "disabled"])
                  ], 512)), [
                    [Rt, h.value === "Plugins"]
                  ]) : S("", !0)
                ], 8, Zm))
              ], 40, Jm),
              g(Ml, {
                visible: me.value,
                label: "Review changes",
                busy: X.value,
                "return-focus": ne.value,
                class: "work-review-sheet",
                onClose: P
              }, {
                default: Y(() => [
                  s("div", tp, [
                    s("header", null, [
                      R[31] || (R[31] = s("h2", null, "Review changes", -1)),
                      s("p", ap, T(C.value?.title), 1)
                    ]),
                    s("div", {
                      class: "work-review-content work-stack",
                      "aria-busy": X.value
                    }, [
                      X.value ? (n(), p("p", op, T(Xe.value ? "Applying or checking changes…" : "Checking the impact on your board…"), 1)) : S("", !0),
                      ce.value ? (n(), p("p", ip, T(ce.value), 1)) : S("", !0),
                      ft.value ? (n(), p("p", np, "The board changed while you were editing. Close this review and discard the draft to load the latest settings.")) : S("", !0),
                      me.value && !Ee.value && (ha.value.removed.length || ha.value.renamed.length) ? (n(), J(_c, {
                        key: 3,
                        removed: ha.value.removed,
                        renamed: ha.value.renamed,
                        disabled: X.value || gt.value,
                        confirmed: La.value,
                        "onUpdate:confirmed": R[20] || (R[20] = (ee) => La.value = ee),
                        onDestination: hi
                      }, null, 8, ["removed", "renamed", "disabled", "confirmed"])) : S("", !0),
                      me.value && Ee.value && hl.value.length ? (n(), J(Oo, {
                        key: 4,
                        "board-id": e.boardId,
                        draft: { plugins: hl.value },
                        schema: I.value ?? B.value,
                        options: b.value?.schema_options.plugins.filter((ee) => hl.value.some((ye) => ye.use === ee.plugin)) ?? [],
                        configs: Q.value,
                        disabled: X.value,
                        "activation-locked": "",
                        onValidity: R[21] || (R[21] = (ee, ye) => ga("pack-plugin:" + ee, ye))
                      }, null, 8, ["board-id", "draft", "schema", "options", "configs", "disabled"])) : S("", !0),
                      me.value ? (n(), J(Vm, {
                        key: 5,
                        "board-id": e.boardId,
                        original: B.value.declaration,
                        declaration: fo.value,
                        plan: Xe.value,
                        follows: $i.value,
                        "config-count": Object.keys(Q.value).length,
                        "plugin-configs": Wt.value?.plugin_configs,
                        "pack-review": !!ze.value,
                        plugins: b.value?.schema_options.plugins
                      }, {
                        default: Y(() => [
                          ze.value && Ee.value ? (n(), J(Am, {
                            key: 0,
                            plan: ze.value,
                            request: Ee.value,
                            original: B.value.declaration,
                            plugins: b.value?.schema_options.plugins,
                            disabled: X.value,
                            onChange: R[22] || (R[22] = (ee) => {
                              ot.value = void 0, ta.value = "";
                            })
                          }, null, 8, ["plan", "request", "original", "plugins", "disabled"])) : S("", !0)
                        ]),
                        _: 1
                      }, 8, ["board-id", "original", "declaration", "plan", "follows", "config-count", "plugin-configs", "pack-review", "plugins"])) : S("", !0),
                      !X.value && !co.value && !ft.value && !ce.value ? (n(), p("p", sp, "Check the impact again before applying.")) : S("", !0)
                    ], 8, lp),
                    s("footer", rp, [
                      g(r(le), {
                        label: "Keep editing",
                        severity: "secondary",
                        outlined: "",
                        disabled: X.value,
                        onClick: P
                      }, null, 8, ["disabled"]),
                      co.value ? (n(), J(r(le), {
                        key: 1,
                        label: "Apply changes",
                        disabled: !uo.value,
                        loading: X.value,
                        onClick: xi
                      }, null, 8, ["disabled", "loading"])) : (n(), J(r(le), {
                        key: 0,
                        label: "Check impact",
                        disabled: X.value || ft.value || !!it.value.size,
                        onClick: wl
                      }, null, 8, ["disabled"]))
                    ])
                  ])
                ]),
                _: 1
              }, 8, ["visible", "busy", "return-focus"]),
              gt.value ? (n(), p("p", dp, "Checking what uses this setting…")) : S("", !0)
            ])) : S("", !0)
          ], 8, Rm)
        ])
      ]),
      A.value ? (n(), J(Ml, {
        key: 0,
        visible: z.value,
        label: "Install pack",
        busy: X.value,
        onClose: R[26] || (R[26] = (ee) => z.value = !1)
      }, {
        default: Y(() => [
          z.value ? (n(), p("form", {
            key: 0,
            class: "work-dialog-box work-stack",
            onSubmit: Me(wi, ["prevent"])
          }, [
            R[33] || (R[33] = s("h2", null, "Install a pack", -1)),
            R[34] || (R[34] = s("p", { class: "work-muted work-small" }, "Packs give an empty board a starting setup. Review checks whether this board is eligible.", -1)),
            r(_) ? (n(), p("p", up, "Loading packs…")) : r(Ce) ? (n(), p("div", cp, [
              s("p", vp, T(r(Ce)), 1),
              g(r(le), {
                label: "Reload packs",
                severity: "secondary",
                outlined: "",
                onClick: R[23] || (R[23] = (ee) => r(Ue)())
              })
            ])) : Qe.value.length ? (n(), p("label", fp, [
              R[32] || (R[32] = G("Pack ", -1)),
              g(r(fe), {
                modelValue: ge.value,
                "onUpdate:modelValue": R[24] || (R[24] = (ee) => ge.value = ee),
                "aria-label": "Pack to install",
                appendTo: "self",
                optionLabel: "title",
                optionValue: "id",
                optionDisabled: "disabled",
                options: Qe.value,
                pt: { option: ({ context: ee }) => ({ "aria-label": [ee.option.title, ee.option.unavailable].filter(Boolean).join(". ") }) }
              }, {
                option: Y(({ option: ee }) => [
                  s("span", null, [
                    G(T(ee.title), 1),
                    ee.unavailable ? (n(), p("small", mp, T(ee.unavailable), 1)) : S("", !0)
                  ])
                ]),
                _: 1
              }, 8, ["modelValue", "options", "pt"])
            ])) : (n(), p("p", pp, "No available packs were found.")),
            s("footer", bp, [
              g(r(le), {
                label: "Cancel",
                severity: "secondary",
                outlined: "",
                onClick: R[25] || (R[25] = (ee) => z.value = !1)
              }),
              g(r(le), {
                type: "submit",
                label: "Review pack",
                disabled: !He.value || !ba.value || r(_) || !!r(Ce)
              }, null, 8, ["disabled"])
            ])
          ], 32)) : S("", !0)
        ]),
        _: 1
      }, 8, ["visible", "busy"])) : S("", !0)
    ], 2));
  }
}), gp = /* @__PURE__ */ $e({
  __name: "SettingsRoot",
  setup(e) {
    const a = Mi(), t = Fi();
    return jo(Xo, (l) => {
      a.value.embedded && l.name === "boards" ? t("back-to-boards", {}) : t("navigate", { route: pn(l) });
    }), (l, o) => (n(), J(hp, {
      "board-id": r(a).boardId ?? "",
      embedded: r(a).embedded,
      "focus-back": r(a).focusBack,
      route: r(a).route,
      onNavigate: o[0] || (o[0] = (d) => r(t)("navigate", { route: d })),
      onDirtyChange: o[1] || (o[1] = (d) => r(t)("dirty-change", { dirty: d }))
    }, null, 8, ["board-id", "embedded", "focus-back", "route"]));
  }
}), yp = Li(gp, {
  type: "object",
  properties: {
    "board-id": { type: "string", default: "", description: "Board to administer." },
    "focus-back": { type: "boolean", default: !1, description: "Focus the first rail action when opening settings from the board picker." },
    route: { type: "string", description: "Section and selected row in System." },
    embedded: { type: "boolean", default: !1, description: "Fits in a System detail pane." }
  }
});
on(import.meta.url, yp);
//# sourceMappingURL=settings.js.map
