import { defineComponent as $e, computed as z, openBlock as n, createBlock as H, resolveDynamicComponent as aa, normalizeProps as vi, guardReactiveProps as fi, createSlots as Ka, withCtx as G, createElementVNode as r, normalizeClass as vt, createElementBlock as m, Fragment as ee, renderList as ue, toDisplayString as R, createCommentVNode as E, unref as c, renderSlot as Je, inject as Ha, useModel as mi, useSlots as pi, watch as Ce, createVNode as k, Transition as $o, withDirectives as ft, vShow as St, mergeModels as gi, ref as B, onMounted as ka, onUnmounted as Nl, resolveComponent as Vo, createTextVNode as W, onBeforeUnmount as $t, useId as At, withKeys as We, withModifiers as Oe, normalizeStyle as bi, watchEffect as xo, nextTick as ct, provide as Co, reactive as hi } from "vue";
import { e as Ut, u as yi, a as ki, b as wi, c as $i } from "./mount-Dm-3vIEJ.js";
import "pinia";
import { m as Pa, h as Ql, s as ge, i as Vi, t as ze, g as xi, j as Gt, k as Bt, r as _l, w as Dt, f as nt, l as ea, n as ot, o as He, q as Rt, v as So, x as Ae, y as Ne, z as To, A as Pt, B as Io, C as ha, D as Ya, d as Do, E as wa, c as Ml, F as Ci, G as Ba, H as Vl, I as Si, J as Jt, K as Ti, L as Ii, _ as xl, M as eo, N as Di, O as Eo, P as Ei, Q as Ui, u as Ai, a as Ri, p as Pi, R as Zt, S as Oi, T as to, U as cl, V as Ni, W as Mi, X as ao, Y as Fi, Z as Li } from "./usePackDiscovery-B_CfgTNy.js";
import fe from "primevue/select";
import te from "primevue/button";
import { Icon as me } from "@iconify/vue";
import { api as Cl, host as Uo, on as Bi, define as ji } from "@wippy-fe/proxy";
import tt from "primevue/tag";
import et from "primevue/toggleswitch";
import Wt from "primevue/checkbox";
import Te from "primevue/inputtext";
import ya from "primevue/textarea";
import yt from "primevue/inputnumber";
import Fl from "primevue/selectbutton";
import zi from "primevue/message";
const vl = (e, a) => e.x > a.x && e.x < a.x + a.width && e.y > a.y && e.y < a.y + a.height;
function qi(e, a, t) {
  return e.x === a.x ? e.x > t.x && e.x < t.x + t.width && Math.max(e.y, a.y) > t.y && Math.min(e.y, a.y) < t.y + t.height : e.y > t.y && e.y < t.y + t.height && Math.max(e.x, a.x) > t.x && Math.min(e.x, a.x) < t.x + t.width;
}
function Mt(e, a, t) {
  const l = [.../* @__PURE__ */ new Set([e.x, a.x, ...t.flatMap((x) => [x.x, x.x + x.width])])].sort((x, $) => x - $), o = [.../* @__PURE__ */ new Set([e.y, a.y, ...t.flatMap((x) => [x.y, x.y + x.height])])].sort((x, $) => x - $);
  l.unshift(l[0] - 24), l.push(l.at(-1) + 24), o.unshift(o[0] - 24), o.push(o.at(-1) + 24);
  const d = l.length, v = o.indexOf(a.y) * d + l.indexOf(a.x), p = o.indexOf(e.y) * d + l.indexOf(e.x), g = (x) => ({ x: l[x % d], y: o[Math.floor(x / d)] }), i = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Map(), u = [];
  function S(x) {
    u.push(x);
    let $ = u.length - 1;
    for (; $; ) {
      const D = $ - 1 >> 1;
      if (u[D].priority <= x.priority) break;
      u[$] = u[D], $ = D;
    }
    u[$] = x;
  }
  function y() {
    const x = u[0], $ = u.pop();
    if (u.length) {
      let D = 0;
      for (; D * 2 + 1 < u.length; ) {
        let A = D * 2 + 1;
        if (A + 1 < u.length && u[A + 1].priority < u[A].priority && A++, $.priority <= u[A].priority) break;
        u[D] = u[A], D = A;
      }
      u[D] = $;
    }
    return x;
  }
  const b = (x) => Math.abs(x.x - a.x) + Math.abs(x.y - a.y);
  for (const x of [0, 1]) {
    const $ = p * 2 + x;
    i.set($, 0), S({ key: $, cost: 0, priority: b(e) });
  }
  const f = /* @__PURE__ */ new Map(), w = /* @__PURE__ */ new Map();
  for (; u.length; ) {
    const x = y(), $ = Math.floor(x.key / 2), D = x.key % 2;
    if (x.cost !== i.get(x.key)) continue;
    if ($ === v) {
      const J = [];
      let se = x.key;
      for (; se !== void 0; )
        J.push(g(Math.floor(se / 2))), se = s.get(se);
      return Ao(J.reverse());
    }
    const A = g($), j = $ % d, ae = Math.floor($ / d);
    for (const [J, se] of [[j > 0 ? $ - 1 : -1, 0], [j + 1 < d ? $ + 1 : -1, 0], [ae > 0 ? $ - d : -1, 1], [ae + 1 < o.length ? $ + d : -1, 1]]) {
      if (J < 0) continue;
      const ce = g(J);
      if (f.has(J) || f.set(J, !t.some((O) => vl(ce, O))), !f.get(J)) continue;
      const pe = `${Math.min($, J)}:${Math.max($, J)}`;
      if (w.has(pe) || w.set(pe, !t.some((O) => qi(A, ce, O))), !w.get(pe)) continue;
      const ve = x.cost + Math.abs(A.x - ce.x) + Math.abs(A.y - ce.y) + (D === se ? 0 : 18), oe = J * 2 + se;
      ve >= (i.get(oe) ?? 1 / 0) || (i.set(oe, ve), s.set(oe, x.key), S({ key: oe, cost: ve, priority: ve + b(ce) }));
    }
  }
  throw new Error("Process map has no collision-free route between its ports: " + JSON.stringify({ start: e, end: a, startInside: t.filter((x) => vl(e, x)), endInside: t.filter((x) => vl(a, x)) }));
}
function Ao(e) {
  const a = [];
  for (const t of e) {
    const l = a.at(-1), o = a.at(-2);
    l && l.x === t.x && l.y === t.y || (o && l && (o.x === l.x && l.x === t.x || o.y === l.y && l.y === t.y) && a.pop(), a.push(t));
  }
  return a;
}
const na = (e) => Array.from(e).reduce((a, t) => a + (/[^\x20-\x7e]/u.test(t) ? 16 : /[MW@%]/.test(t) ? 11 : /[ilI.,:;!| ']/.test(t) ? 4 : 7.5), 0);
function Qt(e, a = 28) {
  const t = [];
  let l = "";
  for (const o of e.split(/\s+/u))
    for (let d = 0; d < o.length; d += a) {
      const v = o.slice(d, d + a);
      l && l.length + v.length + 1 > a && (t.push(l), l = ""), l = l ? l + " " + v : v;
    }
  return [...t, l].filter(Boolean);
}
function Da(e) {
  if (e = Ao(e), !e.length) return "";
  let a = `M ${e[0].x} ${e[0].y}`;
  for (let l = 1; l < e.length - 1; l++) {
    const o = e[l - 1], d = e[l], v = e[l + 1], p = Math.hypot(d.x - o.x, d.y - o.y), g = Math.hypot(v.x - d.x, v.y - d.y), i = Math.min(8, p / 3, g / 3);
    i && (a += ` L ${d.x + (o.x - d.x) * i / p} ${d.y + (o.y - d.y) * i / p} Q ${d.x} ${d.y} ${d.x + (v.x - d.x) * i / g} ${d.y + (v.y - d.y) * i / g}`);
  }
  const t = e.at(-1);
  return a + ` L ${t.x} ${t.y}`;
}
function Wi(e, a = {}, t = { width: 1400, height: 480 }) {
  const l = t.direction ?? (t.width < 750 || Pa(e).length > 8 ? "TB" : "LR"), o = t.direction === "LR" && Pa(e).length > 6, d = new Ql.graphlib.Graph({ multigraph: !0 });
  d.setGraph({ rankdir: l, ranker: "network-simplex", acyclicer: "greedy", nodesep: 32, edgesep: 32, ranksep: 24, marginx: 32, marginy: 32 }), d.setDefaultEdgeLabel(() => ({}));
  const v = Pa(e), p = new Map(v.map((h, P) => [h.id, P])), g = e.states.map((h) => {
    const P = (e.transitions ?? []).filter((T) => T.from === "any" && T.to === h.id), C = Qt(ge(h), o ? 13 : 28), V = Qt(Vi(h, e), o ? 13 : 28), I = P.flatMap((T) => Qt(ze(T) + " works from any state")), N = a.policy?.wip?.[h.id]?.limit, Z = N === void 0 ? 0 : na(" · limit " + N), U = Math.max(o ? 122 : 168, ...C.map((T) => na(T) + 58), ...V.map((T, le) => na(T) + 32 + (le === V.length - 1 ? Z : 0)), ...I.map((T) => na(T) + 32)), X = Math.max(80, 42 + C.length * 18 + V.length * 16 + I.length * 18);
    return d.setNode(h.id, { width: U + (l === "LR" ? 36 : 0), height: X + (l === "TB" ? 36 : 0) }), { state: h, x: 0, y: 0, width: U, height: X, title: C, caption: V, badges: P, row: p.has(h.id) ? 0 : 1 };
  }), i = new Set(g.map((h) => h.state.id)), s = (e.transitions ?? []).flatMap((h) => h.from === "any" ? [] : h.from.filter((P) => i.has(P) && i.has(h.to)).map((P) => {
    const C = `${h.id}-${P}`, V = Qt(ze(h), o ? 12 : 28), I = Math.max(o ? 60 : 72, ...V.map((Z) => na(Z) + 24)), N = Math.max(24, V.length * 16 + 10);
    return { transition: h, from: P, key: C, lines: V, width: I, height: N };
  })), u = /* @__PURE__ */ new Set(), S = /* @__PURE__ */ new Set(), y = new Set(s.filter((h) => h.from === h.transition.to || h.transition.to === e.initial || ["completed", "canceled"].includes(g.find((P) => P.state.id === h.from).state.category)).map((h) => h.key));
  function b(h) {
    if (!S.has(h)) {
      u.add(h);
      for (const P of s.filter((C) => C.from === h))
        y.has(P.key) || (u.has(P.transition.to) ? y.add(P.key) : b(P.transition.to));
      u.delete(h), S.add(h);
    }
  }
  b(e.initial);
  for (const h of g) b(h.state.id);
  for (const h of s) if (!y.has(h.key)) {
    const P = p.get(h.from), C = p.get(h.transition.to);
    d.setEdge(h.from, h.transition.to, { width: h.width, height: h.height, labelpos: "c", weight: P !== void 0 && C === P + 1 ? 100 : 1 }, h.key);
  }
  for (const h of e.transitions ?? []) if (h.from === "any" && i.has(e.initial) && i.has(h.to) && !p.has(h.to)) {
    const P = e.states.find((C) => C.id === h.to);
    d.setEdge(e.initial, h.to, { minlen: ["completed", "canceled"].includes(P.category) ? Math.max(1, v.length - 1) : 1 }, `any:${h.id}`);
  }
  const f = e.states.flatMap((h) => (h.regions ?? []).filter((P) => i.has(P.initial)).map((P, C) => {
    const V = `lane:${h.id}:${C}`;
    return d.setEdge(h.id, P.initial, {}, V), { state: h, region: P, key: V };
  }));
  if (!g.length) return { nodes: g, edges: [], parallels: [], main: v, direction: l, width: 320, height: 160 };
  Ql.layout(d);
  for (const h of g) Object.assign(h, { x: d.node(h.state.id).x, y: d.node(h.state.id).y });
  const w = l === "TB", x = s.filter((h) => !y.has(h.key)).map((h) => d.edge({ v: h.from, w: h.transition.to, name: h.key })), $ = [...g, ...x], D = Math.max(...$.map((h) => h.x + h.width / 2)), A = Math.max(...$.map((h) => h.y + h.height / 2)), j = (h) => g.find((P) => P.state.id === h), ae = s.filter((h) => y.has(h.key)).sort((h, P) => {
    const C = w ? "y" : "x";
    return Math.abs(j(h.from)[C] - j(h.transition.to)[C]) - Math.abs(j(P.from)[C] - j(P.transition.to)[C]);
  }), J = /* @__PURE__ */ new Map(), se = Math.max(0, ...ae.map((h) => h.width));
  let ce = A + 32;
  for (const [h, P] of ae.entries()) {
    const C = j(P.from), V = j(P.transition.to), I = w ? D + 16 + se + 28 + h * 18 : ce + P.height / 2, N = w ? D + 16 + se / 2 : (C.x + V.x) / 2;
    let Z = w ? C.y + C.height / 2 + 18 : I;
    if (w) for (const U of [...J.values()].sort((X, T) => X.y - T.y))
      Z + P.height / 2 + 10 > U.y - U.height / 2 - 10 && Z - P.height / 2 - 10 < U.y + U.height / 2 + 10 && (Z = U.y + U.height / 2 + 24 + P.height / 2);
    J.set(P.key, { x: N, y: Z, corridor: I, height: P.height }), ce = I + P.height / 2 + 24;
  }
  const pe = s.map((h) => ({ ...h, ...J.get(h.key) ?? d.edge({ v: h.from, w: h.transition.to, name: h.key }) })), ve = (h, P) => ({ x: h.x - h.width / 2 - P, y: h.y - h.height / 2 - P, width: h.width + P * 2, height: h.height + P * 2 }), oe = [...g.map((h) => ve(h, 12)), ...pe.map((h) => ve(h, 10))], O = (h, P) => ({
    start: w ? { x: h.x, y: h.y + h.height / 2 } : { x: h.x + h.width / 2, y: h.y },
    end: w ? { x: P.x, y: P.y - P.height / 2 } : { x: P.x - P.width / 2, y: P.y }
  }), Y = (h, P) => w ? { x: h.x, y: h.y + P } : { x: h.x + P, y: h.y }, F = pe.map((h) => {
    const P = g.find((Ue) => Ue.state.id === h.from), C = g.find((Ue) => Ue.state.id === h.transition.to), { start: V, end: I } = O(P, C), N = y.has(h.key), Z = Y(V, 18), U = Y(I, -18), X = (N || !w ? h.width : h.height) / 2 + 10, T = N ? { x: h.x + (w ? -X : X), y: h.y } : Y(h, -X), le = N ? { x: h.x + (w ? X : -X), y: h.y } : Y(h, X);
    let ke;
    if (N) {
      const { corridor: Ue } = J.get(h.key), qe = w ? { x: Ue, y: h.y } : { x: Z.x, y: Ue }, xt = w ? { x: Ue, y: U.y } : { x: U.x, y: Ue };
      ke = w ? [
        [V, ...Mt(Z, T, oe)],
        [le, qe, xt, ...Mt(xt, U, oe), I]
      ] : [
        [V, ...Mt(Z, qe, oe), T],
        [le, ...Mt(xt, U, oe), I]
      ];
    } else ke = [
      [V, ...Mt(Z, T, oe)],
      [...Mt(le, U, oe), I]
    ];
    const Ee = N ? "return" : p.get(h.transition.to) === (p.get(h.from) ?? -2) + 1 ? "main" : "forward";
    return { ...h, points: ke.flat(), segments: ke, path: ke.map(Da).join(" "), type: Ee, targetOffset: 0 };
  }), ne = f.map((h) => {
    const P = g.find((Z) => Z.state.id === h.state.id), C = g.find((Z) => Z.state.id === h.region.initial), { start: V, end: I } = O(P, C), N = [V, ...Mt(Y(V, 18), Y(I, -18), oe), I];
    return { state: h.state, key: h.key, points: N, path: Da(N) };
  }), be = [...g.flatMap((h) => [{ x: h.x - h.width / 2, y: h.y - h.height / 2 }, { x: h.x + h.width / 2, y: h.y + h.height / 2 }]), ...F.flatMap((h) => [...h.points, { x: h.x - h.width / 2, y: h.y - h.height / 2 }, { x: h.x + h.width / 2, y: h.y + h.height / 2 }]), ...ne.flatMap((h) => h.points)], Ie = 32 - Math.min(...be.map((h) => h.x)), K = 32 - Math.min(...be.map((h) => h.y)), q = Math.max(...be.map((h) => h.x)) + Ie + 32, M = Math.max(...be.map((h) => h.y)) + K + 32, de = (h) => ({ x: h.x + Ie, y: h.y + K });
  for (const h of g) Object.assign(h, de(h));
  for (const h of F)
    Object.assign(h, de(h)), h.segments = h.segments.map((P) => P.map(de)), h.points = h.segments.flat(), h.path = h.segments.map(Da).join(" ");
  for (const h of ne)
    h.points = h.points.map(de), h.path = Da(h.points);
  return { nodes: g, edges: F, parallels: ne, main: v, direction: l, width: q, height: M };
}
const Gi = ["aria-label"], Ki = {
  key: 0,
  class: "kx-settings-rail-group"
}, Hi = ["aria-current", "onClick"], Yi = { class: "kx-settings-rail-label" }, Xi = /* @__PURE__ */ $e({
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
    const a = e, t = z(() => a.leadingItem ? [{ items: [a.leadingItem] }, ...a.groups] : a.groups);
    function l(o) {
      const d = [...o.currentTarget.querySelectorAll(".kx-settings-rail-item")], v = d.indexOf(o.target);
      if (v < 0) return;
      let p;
      switch (o.key) {
        case "ArrowDown":
        case "ArrowRight":
          p = (v + 1) % d.length;
          break;
        case "ArrowUp":
        case "ArrowLeft":
          p = (v + d.length - 1) % d.length;
          break;
        case "Home":
          p = 0;
          break;
        case "End":
          p = d.length - 1;
          break;
        default:
          return;
      }
      o.preventDefault(), d[p]?.focus();
    }
    return (o, d) => (n(), H(aa(e.title ? xi : "div"), vi(fi(e.title ? { title: e.title, count: e.count, settings: !0 } : { class: "kx-settings-rail-standalone" })), Ka({
      default: G(() => [
        r("nav", {
          class: vt(["kx-settings-rail", { "kx-settings-rail-framed": e.title }]),
          "aria-label": e.label,
          onKeydown: l
        }, [
          (n(!0), m(ee, null, ue(t.value, (v, p) => (n(), m("div", {
            key: v.items[0]?.value ?? p,
            class: vt(["kx-settings-rail-section", { "kx-settings-rail-leading": e.leadingItem && p === 0 }])
          }, [
            v.heading ? (n(), m("div", Ki, R(v.heading), 1)) : E("", !0),
            (n(!0), m(ee, null, ue(v.items, (g) => (n(), m("button", {
              key: g.value,
              type: "button",
              class: "kx-settings-rail-item",
              "aria-current": g.value === e.value ? "true" : void 0,
              onClick: (i) => o.$emit("update:value", g.value)
            }, [
              g.icon ? (n(), H(c(me), {
                key: 0,
                class: "kx-settings-rail-icon",
                icon: g.icon,
                "aria-hidden": "true"
              }, null, 8, ["icon"])) : E("", !0),
              r("span", Yi, R(g.label), 1)
            ], 8, Hi))), 128))
          ], 2))), 128))
        ], 42, Gi)
      ]),
      _: 2
    }, [
      e.title && o.$slots.actions ? {
        name: "actions",
        fn: G(() => [
          Je(o.$slots, "actions")
        ]),
        key: "0"
      } : void 0
    ]), 1040));
  }
}), Ro = Symbol("work-navigation");
function Ji() {
  return Ha(Ro, () => {
  });
}
function Zi(e) {
  if (e.name === "boards") return "";
  const a = encodeURIComponent(e.board);
  return e.name === "settings" ? `${a}/settings` : a;
}
const Kt = (e) => `/api/v1/work/boards/${encodeURIComponent(e)}`, lo = (e) => ({ declaration: e.declaration, expected_generation: e.expected_generation, plugin_configs: e.plugin_configs }), qt = {
  packPlan: (e, a) => Gt(`${Kt(e)}/pack_plan`, a, "Pack plan"),
  packApply: (e, a, t) => Gt(`${Kt(e)}/pack_apply`, { ...a, key: t }, "Apply pack"),
  plan: (e, a) => Gt(`${Kt(e)}/plan_schema`, lo(a), "Schema plan"),
  apply: (e, a, t) => Gt(`${Kt(e)}/apply_schema`, { ...lo(a), key: t }, "Apply schema"),
  resume: (e) => Gt(`${Kt(e)}/resume_migration`, {}, "Resume migration"),
  configure: (e, a, t) => Gt(`${Kt(e)}/configure_plugin`, { plugin: a, ...t === void 0 ? {} : { config: t } }, "Configure plugin")
}, Ll = /* @__PURE__ */ $e({
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
      const p = v.target;
      if (p instanceof Element && p !== v.currentTarget) {
        const g = p.closest('[data-work-action], button, a, input, textarea, [role="combobox"], [role="checkbox"], [role="switch"], details');
        if (g && g !== v.currentTarget) return;
      }
      l("activate", v);
    }
    function d(v) {
      v.target !== v.currentTarget || !["Enter", " "].includes(v.key) || (v.preventDefault(), t.disabled || l("activate", v));
    }
    return (v, p) => (n(), H(aa(e.as), {
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
      default: G(() => [
        Je(v.$slots, "default")
      ]),
      _: 3
    }, 40, ["type", "role", "tabindex", "disabled", "aria-disabled"]));
  }
}), Xa = Symbol("section row"), Qi = { class: "work-definition" }, _i = {
  key: 0,
  class: "work-definition-handle"
}, en = { class: "work-definition-lead" }, tn = ["title"], an = {
  key: 0,
  class: "work-definition-description"
}, ln = { class: "work-definition-details" }, on = { class: "work-definition-code" }, nn = ["title"], sn = { class: "work-definition-kind" }, rn = {
  key: 0,
  class: "work-definition-kind-label"
}, dn = { class: "work-definition-kind-value" }, un = { class: "work-definition-flags" }, cn = { class: "work-definition-usage" }, vn = { class: "work-definition-actions" }, fn = ["inert"], Ja = /* @__PURE__ */ $e({
  __name: "DefinitionRow",
  props: /* @__PURE__ */ gi({
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
    const a = e, t = mi(e, "open");
    a.initialOpen && (t.value = !0);
    const l = pi(), o = Ha(Xa, void 0);
    function d(p) {
      return !!a.routeSection && !!a.routeId && p === a.routeSection + "/" + a.routeId;
    }
    Ce(() => o?.selected.value, (p, g) => {
      d(p) ? t.value = !0 : d(g) && (t.value = !1);
    }, { immediate: !0 });
    function v() {
      t.value = !t.value, a.routeSection && a.routeId && o?.choose(a.routeSection, a.routeId, t.value);
    }
    return (p, g) => (n(), m("article", Qi, [
      r("header", {
        class: vt(["work-definition-head", { "work-definition-has-handle": c(l).handle }])
      }, [
        c(l).handle ? (n(), m("div", _i, [
          Je(p.$slots, "handle")
        ])) : E("", !0),
        r("div", en, [
          k(Ll, {
            class: "work-definition-toggle",
            "aria-expanded": t.value,
            onActivate: v
          }, {
            default: G(() => [
              k(c(me), {
                icon: "tabler:chevron-right",
                "aria-hidden": "true"
              }),
              r("span", {
                class: "work-row-title",
                title: e.title
              }, R(e.title), 9, tn)
            ]),
            _: 1
          }, 8, ["aria-expanded"]),
          e.description ? (n(), m("p", an, R(e.description), 1)) : E("", !0)
        ]),
        r("div", ln, [
          r("span", on, [
            e.code ? (n(), m("code", {
              key: 0,
              class: "work-mono",
              title: e.code
            }, R(e.code), 9, nn)) : E("", !0)
          ]),
          r("span", sn, [
            e.kind ? (n(), H(c(tt), {
              key: 0,
              severity: "secondary"
            }, {
              default: G(() => [
                e.kindLabel ? (n(), m("span", rn, R(e.kindLabel) + ":", 1)) : E("", !0),
                r("span", dn, R(e.kind), 1)
              ]),
              _: 1
            })) : E("", !0),
            Je(p.$slots, "status")
          ]),
          r("span", un, [
            Je(p.$slots, "flags")
          ]),
          r("div", cn, [
            Je(p.$slots, "usage")
          ])
        ]),
        r("div", vn, [
          Je(p.$slots, "actions")
        ])
      ], 2),
      k($o, {
        name: "work-panel",
        persisted: ""
      }, {
        default: G(() => [
          ft(r("div", {
            inert: !t.value,
            class: "work-definition-body work-stack"
          }, [
            Je(p.$slots, "default")
          ], 8, fn), [
            [St, t.value]
          ])
        ]),
        _: 3
      })
    ]));
  }
}), mn = { class: "work-definition-scroll" }, pn = {
  key: 0,
  class: "work-definition-columns",
  "aria-hidden": "true"
}, gn = { key: 0 }, bn = { class: "work-definition-usage" }, Za = /* @__PURE__ */ $e({
  __name: "DefinitionList",
  props: {
    count: {},
    columns: {}
  },
  setup(e) {
    return (a, t) => (n(), m("div", mn, [
      r("div", {
        class: vt(["work-field-builder", "work-definitions-" + e.columns])
      }, [
        e.count > 3 && e.columns !== "plugins" ? (n(), m("div", pn, [
          t[0] || (t[0] = r("span", null, null, -1)),
          t[1] || (t[1] = r("span", null, "Name", -1)),
          t[2] || (t[2] = r("span", { class: "work-definition-code" }, "Identifier", -1)),
          r("span", null, R(e.columns === "types" ? "Workflow" : "Kind"), 1),
          e.columns === "fields" ? (n(), m("span", gn, "Details")) : E("", !0),
          r("span", bn, R(e.columns === "fields" ? "Used by" : "Details"), 1),
          t[3] || (t[3] = r("span", null, null, -1))
        ])) : E("", !0),
        Je(a.$slots, "default")
      ], 2)
    ]));
  }
}), hn = [
  { code: "key", form: "text", index: "key" },
  { code: "type", form: "text", index: "key" },
  { code: "state", form: "text", index: "key" },
  { code: "category", form: "text", index: "key" },
  { code: "rank", form: "text", index: "key" },
  { code: "parent", form: "text", index: "key" },
  { code: "created_at", form: "time", index: "key" },
  { code: "updated_at", form: "time", index: "key" }
];
function yn(e) {
  const a = e.compiled.processes?.flatMap((t) => t.states.map((l) => ({ id: l.id, label: l.name }))) ?? [];
  return [...hn.filter((t) => t.code !== "rank").map((t) => t.code === "state" ? { ...t, type: "option", options: a } : t.code === "category" ? { ...t, type: "option", options: ["triage", "backlog", "unstarted", "started", "completed", "canceled"].map((l) => ({ id: l })) } : t), ...(e.compiled.fields ?? []).filter((t) => t.index && t.index !== "none")];
}
function kn(e) {
  if (e?.cardinality && e.cardinality !== "one") return ["has", "in", "nin", "is_null", ...e.type === "principal" ? ["member_of"] : []];
  const a = ["eq", "neq", "in", "nin", "is_null", ...e?.type === "principal" ? ["member_of"] : []];
  return e && (["int", "number", "dec", "time", "quantity"].includes(e.form ?? "") || e.index === "number") && a.push("lt", "lte", "gt", "gte", "between"), e?.form === "text" && e.type !== "option" && a.push("contains", "starts_with"), a;
}
const wn = { class: "work-field-control" }, $n = ["id"], Vn = {
  key: 1,
  class: "work-stack work-tight"
}, xn = { class: "work-chips" }, Cn = {
  key: 5,
  class: "work-row"
}, Sn = ["inert"], Tn = ["value"], In = {
  key: 1,
  class: "work-muted"
}, Dn = ["inert"], En = ["value"], Un = {
  key: 1,
  class: "work-muted"
}, An = {
  key: 11,
  class: "work-stack work-tight"
}, Rn = {
  class: "work-stack work-tight",
  "aria-label": "Matching items"
}, Pn = { class: "work-mono" }, On = {
  key: 15,
  class: "work-error work-small",
  role: "alert"
}, Po = /* @__PURE__ */ $e({
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
    const t = e, l = a, o = z(() => t.inputId ?? `field-${t.field.code}`), d = z(() => !!t.field.cardinality && t.field.cardinality !== "one"), v = z(() => Array.isArray(t.modelValue) ? t.modelValue : []), p = z(() => t.modelValue == null ? "" : typeof t.modelValue == "object" ? Bt(t.modelValue) : String(t.modelValue)), g = z(() => {
      const h = t.modelValue;
      return h && typeof h == "object" && "ref" in h && Array.isArray(h.ref) ? String(h.ref[1] ?? "") : "";
    }), i = z(() => t.disabled || _l(t.field)), s = B(!1), u = B(!1), S = B(!1), y = B(""), b = B(""), f = B([]), w = ea(), x = B([]);
    let $ = 0, D;
    const A = /* @__PURE__ */ new Set();
    Ce(v, (h) => {
      x.value = D ?? h.map((P, C) => x.value[C] ?? $++), D = void 0;
    }, { immediate: !0 });
    function j(h) {
      l("update:modelValue", h);
    }
    function ae(h, P) {
      const C = [...v.value];
      C[h] = P, j(C);
    }
    function J(h, P) {
      P ? A.delete(h) : A.add(h), l("validity", !A.size);
    }
    function se(h) {
      A.delete(x.value[h]), l("validity", !A.size), D = x.value.filter((P, C) => C !== h), j(v.value.filter((P, C) => C !== h));
    }
    function ce() {
      D = [...x.value, $++], j([...v.value, t.field.form === "bool" ? !1 : t.field.form === "record" ? {} : ""]);
    }
    function pe(h) {
      const P = h.detail, C = P?.principal_id ?? P?.id;
      j(C ? { kind: P.type ?? "user", id: C } : void 0);
    }
    function ve(h) {
      const P = h.detail;
      j(P?.thread_id ? { ref: ["component", P.thread_id] } : void 0);
    }
    const oe = B("");
    let O = "";
    Ce(() => t.modelValue, (h) => {
      const P = JSON.stringify(h ?? {}, null, 2);
      P !== O && (O = P, oe.value = P, y.value = "", l("validity", !0));
    }, { immediate: !0 });
    function Y(h) {
      oe.value = h;
      try {
        const P = JSON.parse(h);
        if (!P || typeof P != "object" || Array.isArray(P)) throw new Error("Enter a JSON object.");
        if (t.field.type === "rich_text" && !("type" in P && typeof P.type == "string")) throw new Error("The document needs a type.");
        O = JSON.stringify(P, null, 2), y.value = "", l("validity", !0), j(P);
      } catch (P) {
        y.value = P instanceof Error ? P.message : "Invalid JSON.", l("validity", !1);
      }
    }
    function F(h) {
      if (!h) {
        l("validity", !0), j(void 0);
        return;
      }
      const P = Number.isFinite(Number(h)) && (t.field.form !== "int" || Number.isSafeInteger(Number(h)));
      l("validity", P), P && j(t.field.form === "int" ? Number(h) : h);
    }
    const ne = z(() => t.field.config?.format === "date");
    function be(h) {
      j(h ? ne.value ? h : new Date(h).toISOString() : void 0);
    }
    const Ie = z(() => {
      if (typeof t.modelValue != "string") return "";
      if (ne.value) return t.modelValue.slice(0, 10);
      const h = new Date(t.modelValue);
      return Number.isNaN(h.getTime()) ? "" : new Date(h.getTime() - h.getTimezoneOffset() * 6e4).toISOString().slice(0, 16);
    });
    function K(h) {
      j(h.detail?.ref);
    }
    function q(h) {
      j(h.detail?.value);
    }
    let M;
    Ce(b, () => {
      const h = w();
      if (clearTimeout(M), !b.value.trim()) {
        f.value = [];
        return;
      }
      M = setTimeout(async () => {
        try {
          const P = b.value.trim(), C = /^[A-Z][A-Z0-9]{1,9}-[0-9]+$/.test(P) ? [(await Dt.item(t.boardId, { key: P })).item] : (await Dt.query(t.boardId, { where: { field: "title", op: "contains", value: P }, limit: 8 })).items;
          h() && (f.value = C, y.value = "");
        } catch (P) {
          h() && (y.value = nt(P, "Could not search items."));
        }
      }, 200);
    });
    function de(h) {
      j({ board: t.boardId, item: h.id }), b.value = "", f.value = [];
    }
    ka(async () => {
      t.field.type === "principal" ? s.value = await Ut("wc-principal-picker") : t.field.config?.target === "component" && (s.value = await Ut("wc-component-picker"));
    });
    for (const [h, P] of [[() => t.editorTag, S], [() => t.linkTag, u]])
      Ce(h, async (C, V, I) => {
        let N = !0;
        if (I(() => {
          N = !1;
        }), P.value = !1, C) {
          const Z = await Ut(C);
          N && (P.value = Z);
        }
      }, { immediate: !0 });
    return Nl(() => {
      clearTimeout(M), w();
    }), (h, P) => {
      const C = Vo("FieldControl", !0);
      return n(), m("div", wn, [
        c(_l)(e.field) ? (n(), m("output", {
          key: 0,
          id: o.value,
          class: "work-read-value"
        }, R(c(Bt)(e.modelValue, e.field)), 9, $n)) : d.value ? (n(), m("div", Vn, [
          r("div", xn, [
            (n(!0), m(ee, null, ue(v.value, (V, I) => (n(), H(c(tt), {
              key: x.value[I],
              class: "kx-tag-sm",
              severity: "secondary"
            }, {
              default: G(() => [
                W(R(c(Bt)(V, e.field)) + " ", 1),
                k(c(te), {
                  type: "button",
                  class: "work-icon-button",
                  disabled: i.value,
                  "aria-label": "Remove value " + (I + 1),
                  onClick: (N) => se(I),
                  severity: "secondary",
                  text: "",
                  size: "small"
                }, {
                  default: G(() => [
                    k(c(me), {
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
          (n(!0), m(ee, null, ue(v.value, (V, I) => (n(), m("div", {
            key: x.value[I],
            class: "work-stack work-tight"
          }, [
            k(C, {
              "board-id": e.boardId,
              field: { ...e.field, cardinality: "one" },
              "model-value": V,
              "input-id": o.value + "-" + x.value[I],
              disabled: i.value,
              "editor-tag": e.editorTag,
              "link-tag": e.linkTag,
              "onUpdate:modelValue": (N) => ae(I, N),
              onValidity: (N) => J(x.value[I], N)
            }, null, 8, ["board-id", "field", "model-value", "input-id", "disabled", "editor-tag", "link-tag", "onUpdate:modelValue", "onValidity"])
          ]))), 128)),
          k(c(te), {
            label: "Add value",
            severity: "secondary",
            size: "small",
            disabled: i.value,
            onClick: ce,
            outlined: ""
          }, {
            icon: G(() => [
              k(c(me), {
                icon: "tabler:plus",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled"])
        ])) : e.editorTag && S.value ? (n(), H(aa(e.editorTag), {
          key: 2,
          "board-id": e.boardId,
          value: JSON.stringify(e.modelValue ?? null),
          config: JSON.stringify(e.field.config ?? {}),
          readonly: i.value || void 0,
          onChange: q
        }, null, 40, ["board-id", "value", "config", "readonly"])) : e.linkTag && u.value ? (n(), H(aa(e.linkTag), {
          key: 3,
          "board-id": e.boardId,
          kind: e.field.config?.target ?? e.field.type,
          value: JSON.stringify(e.modelValue ?? null),
          readonly: i.value || void 0,
          onChange: K
        }, null, 40, ["board-id", "kind", "value", "readonly"])) : e.field.type === "option" ? (n(), H(c(fe), {
          key: 4,
          placeholder: "Not set",
          inputId: o.value,
          "model-value": e.modelValue ?? "",
          disabled: i.value,
          "onUpdate:modelValue": P[0] || (P[0] = (V) => j(V || void 0)),
          appendTo: "self",
          optionLabel: "label",
          optionValue: "value",
          optionDisabled: "disabled",
          options: [{ label: "Not set", value: "", disabled: !1 }, ...(e.field.options ?? []).map((V) => ({ label: V.label ?? V.id, value: V.id, disabled: !1 }))]
        }, null, 8, ["inputId", "model-value", "disabled", "options"])) : e.field.form === "bool" ? (n(), m("label", Cn, [
          k(c(Wt), {
            inputId: o.value,
            "model-value": e.modelValue === !0,
            disabled: i.value,
            "onUpdate:modelValue": P[1] || (P[1] = (V) => j(V)),
            binary: ""
          }, null, 8, ["inputId", "model-value", "disabled"]),
          W(R(e.modelValue === !0 ? "Yes" : e.modelValue === !1 ? "No" : "Not set"), 1)
        ])) : e.field.form === "int" ? (n(), H(c(yt), {
          key: 6,
          inputId: o.value,
          "model-value": p.value === "" ? null : Number(p.value),
          disabled: i.value,
          "onUpdate:modelValue": P[2] || (P[2] = (V) => F(V == null ? "" : String(V))),
          useGrouping: !1
        }, null, 8, ["inputId", "model-value", "disabled"])) : e.field.form === "dec" ? (n(), H(c(Te), {
          key: 7,
          id: o.value,
          inputmode: "decimal",
          "model-value": p.value,
          disabled: i.value,
          "onUpdate:modelValue": P[3] || (P[3] = (V) => F(V ?? ""))
        }, null, 8, ["id", "model-value", "disabled"])) : e.field.form === "time" ? (n(), H(c(Te), {
          key: 8,
          id: o.value,
          type: ne.value ? "date" : "datetime-local",
          value: Ie.value,
          disabled: i.value,
          onInput: P[4] || (P[4] = (V) => be(V.target.value))
        }, null, 8, ["id", "type", "value", "disabled"])) : e.field.type === "principal" ? (n(), m("div", {
          key: 9,
          inert: i.value || void 0,
          class: "work-stack work-tight"
        }, [
          s.value ? (n(), m("wc-principal-picker", {
            key: 0,
            value: JSON.stringify(e.modelValue ?? {}),
            kinds: "user,group",
            onConfigChanged: pe
          }, null, 40, Tn)) : (n(), m("span", In, R(c(Bt)(e.modelValue, e.field)) + " · Person picker is unavailable.", 1))
        ], 8, Sn)) : e.field.config?.target === "component" ? (n(), m("div", {
          key: 10,
          inert: i.value || void 0
        }, [
          s.value ? (n(), m("wc-component-picker", {
            key: 0,
            value: JSON.stringify({ thread_id: g.value }),
            onChange: ve
          }, null, 40, En)) : (n(), m("span", Un, "Component picker is unavailable."))
        ], 8, Dn)) : e.field.type === "item" ? (n(), m("div", An, [
          k(c(tt), {
            class: "kx-tag-sm",
            severity: "secondary"
          }, {
            default: G(() => [
              W(R(c(Bt)(e.modelValue, e.field)), 1)
            ]),
            _: 1
          }),
          k(c(Te), {
            id: o.value,
            modelValue: b.value,
            "onUpdate:modelValue": P[5] || (P[5] = (V) => b.value = V),
            disabled: i.value,
            placeholder: "Search a title or enter an item key",
            "aria-label": "Search items"
          }, null, 8, ["id", "modelValue", "disabled"]),
          r("div", Rn, [
            (n(!0), m(ee, null, ue(f.value, (V) => (n(), H(Ll, {
              key: V.id,
              class: "work-match-item",
              disabled: i.value,
              onActivate: (I) => de(V)
            }, {
              default: G(() => [
                r("code", Pn, R(V.key), 1),
                r("span", null, R(c(Bt)(V.values.title)), 1)
              ]),
              _: 2
            }, 1032, ["disabled", "onActivate"]))), 128))
          ]),
          e.modelValue ? (n(), H(c(te), {
            key: 0,
            label: "Clear reference",
            severity: "secondary",
            size: "small",
            disabled: i.value,
            onClick: P[6] || (P[6] = (V) => j(void 0)),
            outlined: ""
          }, {
            icon: G(() => [
              k(c(me), {
                icon: "tabler:list-check",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled"])) : E("", !0)
        ])) : e.field.form === "record" || e.field.type === "rich_text" || e.field.form === "quantity" || e.field.form === "ref" ? (n(), H(c(ya), {
          key: 12,
          id: o.value,
          "model-value": oe.value,
          rows: "3",
          disabled: i.value,
          "aria-invalid": !!y.value,
          "onUpdate:modelValue": P[7] || (P[7] = (V) => Y(V ?? ""))
        }, null, 8, ["id", "model-value", "disabled", "aria-invalid"])) : e.field.code === "description" ? (n(), H(c(ya), {
          key: 13,
          id: o.value,
          "model-value": p.value,
          rows: "4",
          disabled: i.value,
          "onUpdate:modelValue": P[8] || (P[8] = (V) => j(V))
        }, null, 8, ["id", "model-value", "disabled"])) : (n(), H(c(Te), {
          key: 14,
          id: o.value,
          "model-value": p.value,
          disabled: i.value,
          "onUpdate:modelValue": P[9] || (P[9] = (V) => j(V))
        }, null, 8, ["id", "model-value", "disabled"])),
        y.value ? (n(), m("span", On, R(y.value), 1)) : E("", !0)
      ]);
    };
  }
}), Nn = { class: "work-stack work-tight work-operand-control" }, Mn = { class: "work-row work-small" }, Fn = {
  key: 1,
  class: "work-muted work-small"
}, Ln = {
  key: 2,
  class: "work-stack work-tight"
}, Bn = { class: "work-small" }, jn = {
  key: 0,
  class: "work-error work-small",
  role: "alert"
}, sa = /* @__PURE__ */ $e({
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
    const t = e, l = a, o = z(() => "$actor" in ot(t.modelValue) ? "actor" : "$now" in ot(t.modelValue) ? "now" : "literal"), d = B(""), v = B("");
    Ce(() => t.modelValue, (i) => {
      d.value = JSON.stringify(i ?? []), v.value = "";
    }, { immediate: !0 });
    function p(i) {
      l("update:modelValue", i === "actor" ? { $actor: "id" } : i === "now" ? { $now: "P0D" } : void 0), l("validity", !0);
    }
    function g(i) {
      d.value = i;
      try {
        const s = JSON.parse(i);
        if (!Array.isArray(s)) throw new Error("Enter a JSON list.");
        v.value = "", l("validity", !0), l("update:modelValue", s);
      } catch (s) {
        v.value = s instanceof Error ? s.message : "Invalid values.", l("validity", !1);
      }
    }
    return (i, s) => (n(), m("div", Nn, [
      r("label", Mn, [
        W(R(e.label), 1),
        k(c(fe), {
          "aria-label": e.label + " operand",
          "model-value": o.value,
          disabled: e.disabled,
          "onUpdate:modelValue": s[0] || (s[0] = (u) => p(u)),
          appendTo: "self",
          optionLabel: "label",
          optionValue: "value",
          optionDisabled: "disabled",
          options: [{ label: "Value", value: "literal", disabled: !1 }, { label: "Current actor ($actor)", value: "actor", disabled: !1 }, { label: "Current time ($now)", value: "now", disabled: !1 }]
        }, null, 8, ["aria-label", "model-value", "disabled"])
      ]),
      o.value === "now" ? (n(), H(c(Te), {
        key: 0,
        "aria-label": e.label + " time offset",
        value: c(ot)(e.modelValue).$now,
        disabled: e.disabled,
        placeholder: "-P7D",
        onInput: s[1] || (s[1] = (u) => l("update:modelValue", { $now: u.target.value }))
      }, null, 8, ["aria-label", "value", "disabled"])) : o.value === "actor" ? (n(), m("span", Fn, "The signed-in actor’s id")) : e.multiple ? (n(), m("div", Ln, [
        r("label", Bn, [
          s[5] || (s[5] = W("Values as JSON (operands may appear in the list)", -1)),
          k(c(ya), {
            class: "work-mono",
            "aria-label": e.label + " values",
            value: d.value,
            disabled: e.disabled,
            rows: "2",
            onInput: s[2] || (s[2] = (u) => g(u.target.value))
          }, null, 8, ["aria-label", "value", "disabled"])
        ]),
        v.value ? (n(), m("p", jn, R(v.value), 1)) : E("", !0)
      ])) : (n(), H(Po, {
        key: 3,
        "board-id": e.boardId,
        field: { ...e.field, cardinality: "one" },
        "model-value": e.modelValue,
        disabled: e.disabled,
        "input-id": e.label.replace(/[^a-z0-9]/gi, "-"),
        "onUpdate:modelValue": s[3] || (s[3] = (u) => l("update:modelValue", u)),
        onValidity: s[4] || (s[4] = (u) => l("validity", u))
      }, null, 8, ["board-id", "field", "model-value", "disabled", "input-id"]))
    ]));
  }
}), zn = ["disabled"], qn = { class: "work-small work-mono" }, Wn = { class: "work-row work-small" }, Gn = { class: "work-row work-wrap" }, Kn = { key: 3 }, Hn = { class: "work-row work-wrap" }, Yn = { class: "work-row" }, Xn = { class: "work-row" }, Jn = { class: "work-row" }, Zn = {
  key: 3,
  class: "work-row work-wrap"
}, Qn = { class: "work-row work-wrap" }, _n = /* @__PURE__ */ $e({
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
    const t = e, l = a, o = z(() => t.path ?? "where"), d = z(() => t.depth ?? 1), v = z(() => ["and", "or", "not", "history", "match", "rel", "children"].find((oe) => oe in t.modelValue) ?? "field"), p = z(() => yn(t.schema)), g = z(() => p.value.find((oe) => oe.code === t.modelValue.field) ?? { code: "value", form: "text" }), i = z(() => ot(t.modelValue.history)), s = z(() => p.value.find((oe) => oe.code === i.value.field) ?? { code: "history", form: "text" }), u = z(() => Array.isArray(t.modelValue[v.value]) ? t.modelValue[v.value] : []), S = {
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
    }, b = () => ({ field: "category", op: "eq", value: "unstarted" }), f = B(/* @__PURE__ */ new Set());
    function w(oe, O) {
      O ? f.value.delete(oe) : f.value.add(oe), l("validity", f.value.size === 0);
    }
    Ce(v, () => {
      f.value.clear(), l("validity", !0);
    });
    function x(oe) {
      const O = /* @__PURE__ */ new Set();
      for (const Y of f.value) {
        const F = Number(Y);
        !Number.isNaN(F) && F !== oe && O.add(String(F > oe ? F - 1 : F));
      }
      f.value = O, l("validity", O.size === 0), D({ [v.value]: u.value.filter((Y, F) => F !== oe) });
    }
    function $(oe) {
      l("update:modelValue", oe);
    }
    function D(oe) {
      $({ ...t.modelValue, ...oe });
    }
    function A(oe) {
      $(oe === "field" ? b() : oe === "and" || oe === "or" ? { [oe]: [b()] } : oe === "not" ? { not: b() } : oe === "history" ? { history: { field: "state", changed: !0 } } : oe === "match" ? { match: "" } : oe === "children" ? { children: !0, q: "some", where: b() } : { rel: t.schema.compiled.relation_types?.[0]?.id ?? "", dir: "outward", q: "some", where: b() });
    }
    function j(oe, O) {
      D({ [v.value]: u.value.map((Y, F) => F === oe ? O : Y) });
    }
    function ae(oe, O) {
      const Y = { ...i.value };
      O === void 0 ? (delete Y[oe], w(oe, !0)) : Y[oe] = O, D({ history: Y });
    }
    function J(oe) {
      f.value.clear(), l("validity", !0);
      const O = { ...i.value };
      delete O.was, delete O.changed, delete O.from, delete O.to, O[oe] = oe === "changed" ? !0 : "", D({ history: O });
    }
    const se = { code: "actor", form: "text" }, ce = { code: "at", form: "time" }, pe = z(() => Array.isArray(i.value.during) ? i.value.during : []);
    function ve(oe, O) {
      const Y = [...pe.value];
      Y[oe] = O, ae("during", Y);
    }
    return (oe, O) => {
      const Y = Vo("FilterNode", !0);
      return n(), m("fieldset", {
        class: "work-filter-node",
        disabled: e.disabled
      }, [
        r("legend", qn, R(o.value), 1),
        r("label", Wn, [
          O[21] || (O[21] = W("Condition", -1)),
          k(c(fe), {
            "aria-label": o.value + " condition",
            "model-value": v.value,
            "onUpdate:modelValue": O[0] || (O[0] = (F) => A(F)),
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            optionDisabled: "disabled",
            options: Object.entries(y).map(([F, ne]) => ({ label: ne, value: F, disabled: d.value >= 6 && ["and", "or", "not", "rel", "children"].includes(F) }))
          }, null, 8, ["aria-label", "model-value", "options"])
        ]),
        v.value === "and" || v.value === "or" ? (n(), m(ee, { key: 0 }, [
          (n(!0), m(ee, null, ue(u.value, (F, ne) => (n(), m("div", {
            key: ne,
            class: "work-stack work-tight"
          }, [
            k(Y, {
              "board-id": e.boardId,
              schema: e.schema,
              "model-value": F,
              path: o.value + "." + v.value + "[" + ne + "]",
              depth: d.value + 1,
              "onUpdate:modelValue": (be) => j(ne, be),
              onValidity: (be) => w(String(ne), be)
            }, null, 8, ["board-id", "schema", "model-value", "path", "depth", "onUpdate:modelValue", "onValidity"]),
            k(c(te), {
              label: "Remove condition",
              size: "small",
              severity: "secondary",
              onClick: (be) => x(ne),
              outlined: ""
            }, {
              icon: G(() => [
                k(c(me), {
                  icon: "tabler:trash",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["onClick"])
          ]))), 128)),
          k(c(te), {
            label: "Add condition",
            size: "small",
            severity: "secondary",
            disabled: d.value >= 6,
            onClick: O[1] || (O[1] = (F) => D({ [v.value]: [...u.value, b()] })),
            outlined: ""
          }, {
            icon: G(() => [
              k(c(me), {
                icon: "tabler:plus",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled"])
        ], 64)) : v.value === "not" ? (n(), H(Y, {
          key: 1,
          "board-id": e.boardId,
          schema: e.schema,
          "model-value": c(ot)(e.modelValue.not),
          path: o.value + ".not",
          depth: d.value + 1,
          "onUpdate:modelValue": O[2] || (O[2] = (F) => D({ not: F })),
          onValidity: O[3] || (O[3] = (F) => w("nested", F))
        }, null, 8, ["board-id", "schema", "model-value", "path", "depth"])) : v.value === "field" ? (n(), m(ee, { key: 2 }, [
          r("div", Gn, [
            r("label", null, [
              O[22] || (O[22] = W("Field", -1)),
              k(c(fe), {
                "aria-label": o.value + " field",
                "model-value": e.modelValue.field,
                "onUpdate:modelValue": O[4] || (O[4] = (F) => D({ field: F, op: "eq", value: void 0 })),
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                optionDisabled: "disabled",
                options: [...(p.value ?? []).map((F) => ({ label: c(He)(F), value: F.code, disabled: !1 }))]
              }, null, 8, ["aria-label", "model-value", "options"])
            ]),
            r("label", null, [
              O[23] || (O[23] = W("Comparison", -1)),
              k(c(fe), {
                "aria-label": o.value + " operator",
                "model-value": e.modelValue.op,
                "onUpdate:modelValue": O[5] || (O[5] = (F) => D({ op: F, value: F === "is_null" ? !0 : void 0 })),
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                options: c(kn)(g.value).map((F) => ({ value: F, label: S[F] }))
              }, null, 8, ["aria-label", "model-value", "options"])
            ])
          ]),
          k(sa, {
            "board-id": e.boardId,
            field: e.modelValue.op === "is_null" ? { code: "null", form: "bool" } : g.value,
            "model-value": e.modelValue.value,
            multiple: ["in", "nin", "between"].includes(String(e.modelValue.op)),
            label: o.value + " value",
            "onUpdate:modelValue": O[6] || (O[6] = (F) => D({ value: F })),
            onValidity: O[7] || (O[7] = (F) => w("value", F))
          }, null, 8, ["board-id", "field", "model-value", "multiple", "label"])
        ], 64)) : v.value === "match" ? (n(), m("label", Kn, [
          O[24] || (O[24] = W("Search", -1)),
          k(c(Te), {
            "aria-label": o.value + " search",
            value: e.modelValue.match,
            onInput: O[8] || (O[8] = (F) => D({ match: F.target.value }))
          }, null, 8, ["aria-label", "value"])
        ])) : v.value === "history" ? (n(), m(ee, { key: 4 }, [
          r("div", Hn, [
            r("label", null, [
              O[25] || (O[25] = W("Field", -1)),
              k(c(fe), {
                "aria-label": o.value + " history field",
                "model-value": i.value.field,
                "onUpdate:modelValue": O[9] || (O[9] = (F) => ae("field", F)),
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                optionDisabled: "disabled",
                options: [...(p.value ?? []).map((F) => ({ label: c(He)(F), value: F.code, disabled: !1 }))]
              }, null, 8, ["aria-label", "model-value", "options"])
            ]),
            r("label", null, [
              O[26] || (O[26] = W("History", -1)),
              k(c(fe), {
                "aria-label": o.value + " history mode",
                "model-value": i.value.changed ? "changed" : "was",
                "onUpdate:modelValue": O[10] || (O[10] = (F) => J(F)),
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                optionDisabled: "disabled",
                options: [{ label: "Changed", value: "changed", disabled: !1 }, { label: "Was", value: "was", disabled: !1 }]
              }, null, 8, ["aria-label", "model-value"])
            ])
          ]),
          i.value.changed ? (n(), m(ee, { key: 0 }, ue(["from", "to"], (F) => r("div", { key: F }, [
            r("label", Yn, [
              k(c(Wt), {
                "model-value": F in i.value,
                "aria-label": "Constrain " + F,
                "onUpdate:modelValue": (ne) => ae(F, ne ? "" : void 0),
                binary: ""
              }, null, 8, ["model-value", "aria-label", "onUpdate:modelValue"]),
              W(R(F), 1)
            ]),
            F in i.value ? (n(), H(sa, {
              key: 0,
              "board-id": e.boardId,
              field: s.value,
              "model-value": i.value[F],
              label: o.value + " history " + F,
              "onUpdate:modelValue": (ne) => ae(F, ne),
              onValidity: (ne) => w(F, ne)
            }, null, 8, ["board-id", "field", "model-value", "label", "onUpdate:modelValue", "onValidity"])) : E("", !0)
          ])), 64)) : (n(), H(sa, {
            key: 1,
            "board-id": e.boardId,
            field: s.value,
            "model-value": i.value.was,
            label: o.value + " history was",
            "onUpdate:modelValue": O[11] || (O[11] = (F) => ae("was", F)),
            onValidity: O[12] || (O[12] = (F) => w("was", F))
          }, null, 8, ["board-id", "field", "model-value", "label"])),
          r("label", Xn, [
            k(c(Wt), {
              "model-value": "by" in i.value,
              "aria-label": "Constrain actor",
              "onUpdate:modelValue": O[13] || (O[13] = (F) => ae("by", F ? { $actor: "id" } : void 0)),
              binary: ""
            }, null, 8, ["model-value"]),
            O[27] || (O[27] = W("By actor", -1))
          ]),
          "by" in i.value ? (n(), H(sa, {
            key: 2,
            "board-id": e.boardId,
            field: se,
            "model-value": i.value.by,
            label: o.value + " history by",
            "onUpdate:modelValue": O[14] || (O[14] = (F) => ae("by", F))
          }, null, 8, ["board-id", "model-value", "label"])) : E("", !0),
          r("label", Jn, [
            k(c(Wt), {
              "model-value": "during" in i.value,
              "aria-label": "Constrain time window",
              "onUpdate:modelValue": O[15] || (O[15] = (F) => ae("during", F ? [{ $now: "-P30D" }, { $now: "P0D" }] : void 0)),
              binary: ""
            }, null, 8, ["model-value"]),
            O[28] || (O[28] = W("During", -1))
          ]),
          "during" in i.value ? (n(), m("div", Zn, [
            (n(), m(ee, null, ue(["start", "end"], (F, ne) => k(sa, {
              key: F,
              "board-id": e.boardId,
              field: ce,
              "model-value": pe.value[ne],
              label: o.value + " during " + F,
              "onUpdate:modelValue": (be) => ve(ne, be)
            }, null, 8, ["board-id", "model-value", "label", "onUpdate:modelValue"])), 64))
          ])) : E("", !0)
        ], 64)) : (n(), m(ee, { key: 5 }, [
          r("div", Qn, [
            v.value === "rel" ? (n(), m(ee, { key: 0 }, [
              r("label", null, [
                O[29] || (O[29] = W("Relation", -1)),
                k(c(fe), {
                  "model-value": e.modelValue.rel,
                  "onUpdate:modelValue": O[16] || (O[16] = (F) => D({ rel: F })),
                  appendTo: "self",
                  optionLabel: "label",
                  optionValue: "value",
                  optionDisabled: "disabled",
                  options: [...(e.schema.compiled.relation_types ?? []).map((F) => ({ label: F.outward ?? F.id, value: F.id, disabled: !1 }))]
                }, null, 8, ["model-value", "options"])
              ]),
              r("label", null, [
                O[30] || (O[30] = W("Direction", -1)),
                k(c(fe), {
                  "model-value": e.modelValue.dir,
                  "onUpdate:modelValue": O[17] || (O[17] = (F) => D({ dir: F })),
                  appendTo: "self",
                  optionLabel: "label",
                  optionValue: "value",
                  optionDisabled: "disabled",
                  options: [{ label: "Outward", value: "outward", disabled: !1 }, { label: "Inward", value: "inward", disabled: !1 }]
                }, null, 8, ["model-value"])
              ])
            ], 64)) : E("", !0),
            r("label", null, [
              O[31] || (O[31] = W("Quantifier", -1)),
              k(c(fe), {
                "model-value": e.modelValue.q,
                "onUpdate:modelValue": O[18] || (O[18] = (F) => D({ q: F })),
                appendTo: "self",
                options: ["some", "every", "none"]
              }, null, 8, ["model-value"])
            ])
          ]),
          k(Y, {
            "board-id": e.boardId,
            schema: e.schema,
            "model-value": c(ot)(e.modelValue.where),
            path: o.value + ".where",
            depth: d.value + 1,
            "onUpdate:modelValue": O[19] || (O[19] = (F) => D({ where: F })),
            onValidity: O[20] || (O[20] = (F) => w("nested", F))
          }, null, 8, ["board-id", "schema", "model-value", "path", "depth"])
        ], 64))
      ], 8, zn);
    };
  }
}), es = { class: "work-stack work-tight" }, ts = { class: "work-row work-small" }, Bl = /* @__PURE__ */ $e({
  __name: "ConditionEditor",
  props: {
    modelValue: {},
    draft: {},
    boardId: {},
    label: {}
  },
  emits: ["update:modelValue", "validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = z(() => ({ declaration: t.draft, compiled: t.draft, generation: 0, as_of: 0, key_prefix: "" })), d = /* @__PURE__ */ new Set();
    function v(g, i) {
      i ? d.delete(g) : d.add(g), l("validity", !d.size);
    }
    function p(g) {
      l("update:modelValue", g ? { field: t.draft.fields?.[0]?.code ?? "state", op: "eq" } : void 0), g || (d.clear(), l("validity", !0));
    }
    return $t(() => l("validity", !0)), (g, i) => (n(), m("section", es, [
      r("label", ts, [
        k(c(et), {
          "model-value": e.modelValue != null,
          "aria-label": e.label,
          "onUpdate:modelValue": p
        }, null, 8, ["model-value", "aria-label"]),
        W(R(e.label), 1)
      ]),
      e.modelValue != null ? (n(), H(_n, {
        key: 0,
        schema: o.value,
        "board-id": e.boardId ?? "",
        "model-value": c(ot)(e.modelValue),
        path: e.label,
        "onUpdate:modelValue": i[0] || (i[0] = (s) => l("update:modelValue", s)),
        onValidity: i[1] || (i[1] = (s) => v("structured", s))
      }, null, 8, ["schema", "board-id", "model-value", "path"])) : E("", !0),
      e.modelValue != null ? (n(), H(Rt, {
        key: 1,
        label: e.label + " predicate",
        "model-value": e.modelValue,
        hint: "Use any predicate accepted by Work, including installed or deeply nested forms.",
        "onUpdate:modelValue": i[2] || (i[2] = (s) => l("update:modelValue", s)),
        onValidity: i[3] || (i[3] = (s) => v("raw", s))
      }, null, 8, ["label", "model-value"])) : E("", !0)
    ]));
  }
}), as = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, ls = ["aria-label"], os = { class: "work-field-label" }, is = {
  key: 0,
  class: "work-chips"
}, ns = ["kinds"], ss = {
  key: 2,
  class: "work-muted work-small"
}, jl = /* @__PURE__ */ $e({
  __name: "PrincipalsPicker",
  props: {
    modelValue: {},
    label: {},
    kinds: {},
    boardId: {}
  },
  emits: ["update:modelValue"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = B(!1), d = B(0), v = z(() => t.modelValue ?? []), { principalLabel: p, rememberPrincipal: g, nameError: i } = So(() => t.boardId ?? "", () => v.value);
    ka(async () => {
      o.value = await Ut("wc-principal-picker");
    });
    function s(u) {
      const S = u.detail, y = S?.principal_id ?? S?.id;
      if (!y) return;
      const b = { kind: S.type ?? "user", id: y };
      S.label && g(b, S.label), v.value.some((f) => f.id === y && f.kind === b.kind) || l("update:modelValue", [...v.value, b]), d.value++;
    }
    return (u, S) => (n(), m(ee, null, [
      c(i) ? (n(), m("p", as, R(c(i)), 1)) : E("", !0),
      r("section", {
        class: "work-stack work-tight work-principals-picker",
        "aria-label": e.label
      }, [
        r("h4", os, R(e.label), 1),
        v.value.length ? (n(), m("div", is, [
          (n(!0), m(ee, null, ue(v.value, (y, b) => (n(), H(c(tt), {
            key: y.kind + y.id,
            severity: "secondary",
            class: "kx-tag-sm"
          }, {
            default: G(() => [
              W(R(c(p)(y)), 1),
              k(c(te), {
                text: "",
                severity: "secondary",
                size: "small",
                "aria-label": "Remove " + c(p)(y),
                onClick: (f) => l("update:modelValue", v.value.filter((w, x) => x !== b))
              }, {
                default: G(() => [
                  k(c(me), { icon: "tabler:x" })
                ]),
                _: 1
              }, 8, ["aria-label", "onClick"])
            ]),
            _: 2
          }, 1024))), 128))
        ])) : E("", !0),
        o.value ? (n(), m("wc-principal-picker", {
          key: d.value,
          kinds: e.kinds ?? "user,group",
          onConfigChanged: s
        }, null, 40, ns)) : (n(), m("p", ss, "People and group picker is unavailable."))
      ], 8, ls)
    ], 64));
  }
}), rs = { class: "work-stack work-tight" }, Oo = /* @__PURE__ */ $e({
  __name: "HoldersPicker",
  props: {
    modelValue: {},
    label: {},
    boardId: {}
  },
  emits: ["update:modelValue", "validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = z(() => (t.modelValue ?? []).flatMap((v) => "user" in v ? [{ kind: "user", id: v.user }] : "group" in v ? [{ kind: "group", id: v.group }] : []));
    function d(v) {
      const p = [...(t.modelValue ?? []).filter((g) => "field" in g || "service" in g), ...v.map((g) => g.kind === "group" ? { group: g.id } : { user: g.id })];
      l("update:modelValue", p.length ? p : void 0);
    }
    return (v, p) => (n(), m("div", rs, [
      k(jl, {
        "board-id": e.boardId,
        label: e.label,
        "model-value": o.value,
        "onUpdate:modelValue": d
      }, null, 8, ["board-id", "label", "model-value"]),
      k(Rt, {
        label: e.label + " rules",
        "model-value": e.modelValue,
        shape: "array",
        example: [{ group: "selected-group" }],
        "onUpdate:modelValue": p[0] || (p[0] = (g) => l("update:modelValue", g)),
        onValidity: p[1] || (p[1] = (g) => l("validity", g))
      }, null, 8, ["label", "model-value"])
    ]));
  }
}), ds = ["disabled"], us = { class: "work-chips" }, cs = {
  key: 1,
  class: "work-muted work-small"
}, st = /* @__PURE__ */ $e({
  __name: "ChipPicker",
  props: {
    label: {},
    options: {},
    modelValue: {},
    disabled: { type: Boolean }
  },
  emits: ["update:modelValue"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = B(""), d = z(() => t.options.map((g) => typeof g == "string" ? { value: g } : g)), v = z(() => d.value.filter((g) => (g.label ?? Ae(g.value)).toLocaleLowerCase().includes(o.value.toLocaleLowerCase())));
    function p(g) {
      if (t.disabled) return;
      const i = t.modelValue ?? [];
      l("update:modelValue", i.includes(g) ? i.filter((s) => s !== g) : [...i, g]);
    }
    return (g, i) => (n(), m("fieldset", {
      class: "work-chip-picker",
      disabled: e.disabled
    }, [
      r("legend", null, R(e.label), 1),
      e.options.length > 10 ? (n(), H(c(Te), {
        key: 0,
        modelValue: o.value,
        "onUpdate:modelValue": i[0] || (i[0] = (s) => o.value = s),
        type: "search",
        "aria-label": "Find " + e.label.toLowerCase(),
        placeholder: "Find a choice…"
      }, null, 8, ["modelValue", "aria-label"])) : E("", !0),
      r("div", us, [
        k(c(Fl), {
          "model-value": e.modelValue ?? [],
          options: v.value.map((s) => ({ value: s.value, label: s.label ?? c(Ae)(s.value) })),
          optionLabel: "label",
          optionValue: "value",
          multiple: "",
          disabled: e.disabled,
          "aria-label": e.label,
          "onUpdate:modelValue": i[1] || (i[1] = (s) => l("update:modelValue", s ?? []))
        }, null, 8, ["model-value", "options", "disabled", "aria-label"]),
        (n(!0), m(ee, null, ue(e.modelValue?.filter((s) => !d.value.some((u) => u.value === s)) ?? [], (s) => (n(), H(c(te), {
          severity: "secondary",
          text: "",
          size: "small",
          key: s,
          type: "button",
          class: "work-choice work-unavailable",
          "aria-label": "Remove unavailable " + s,
          onClick: (u) => p(s)
        }, {
          default: G(() => [
            W(R(c(Ae)(s)) + " · unavailable ×", 1)
          ]),
          _: 2
        }, 1032, ["aria-label", "onClick"]))), 128))
      ]),
      e.options.length ? E("", !0) : (n(), m("span", cs, "No choices declared."))
    ], 8, ds));
  }
});
/**!
 * Sortable 1.15.7
 * @author	RubaXa   <trash@rubaxa.org>
 * @author	owenm    <owen23355@gmail.com>
 * @license MIT
 */
function vs(e, a, t) {
  return (a = gs(a)) in e ? Object.defineProperty(e, a, {
    value: t,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : e[a] = t, e;
}
function wt() {
  return wt = Object.assign ? Object.assign.bind() : function(e) {
    for (var a = 1; a < arguments.length; a++) {
      var t = arguments[a];
      for (var l in t) ({}).hasOwnProperty.call(t, l) && (e[l] = t[l]);
    }
    return e;
  }, wt.apply(null, arguments);
}
function oo(e, a) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(e);
    a && (l = l.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), t.push.apply(t, l);
  }
  return t;
}
function pt(e) {
  for (var a = 1; a < arguments.length; a++) {
    var t = arguments[a] != null ? arguments[a] : {};
    a % 2 ? oo(Object(t), !0).forEach(function(l) {
      vs(e, l, t[l]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : oo(Object(t)).forEach(function(l) {
      Object.defineProperty(e, l, Object.getOwnPropertyDescriptor(t, l));
    });
  }
  return e;
}
function fs(e, a) {
  if (e == null) return {};
  var t, l, o = ms(e, a);
  if (Object.getOwnPropertySymbols) {
    var d = Object.getOwnPropertySymbols(e);
    for (l = 0; l < d.length; l++) t = d[l], a.indexOf(t) === -1 && {}.propertyIsEnumerable.call(e, t) && (o[t] = e[t]);
  }
  return o;
}
function ms(e, a) {
  if (e == null) return {};
  var t = {};
  for (var l in e) if ({}.hasOwnProperty.call(e, l)) {
    if (a.indexOf(l) !== -1) continue;
    t[l] = e[l];
  }
  return t;
}
function ps(e, a) {
  if (typeof e != "object" || !e) return e;
  var t = e[Symbol.toPrimitive];
  if (t !== void 0) {
    var l = t.call(e, a);
    if (typeof l != "object") return l;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (a === "string" ? String : Number)(e);
}
function gs(e) {
  var a = ps(e, "string");
  return typeof a == "symbol" ? a : a + "";
}
function Sl(e) {
  "@babel/helpers - typeof";
  return Sl = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(a) {
    return typeof a;
  } : function(a) {
    return a && typeof Symbol == "function" && a.constructor === Symbol && a !== Symbol.prototype ? "symbol" : typeof a;
  }, Sl(e);
}
var bs = "1.15.7";
function kt(e) {
  if (typeof window < "u" && window.navigator)
    return !!/* @__PURE__ */ navigator.userAgent.match(e);
}
var Vt = kt(/(?:Trident.*rv[ :]?11\.|msie|iemobile|Windows Phone)/i), $a = kt(/Edge/i), io = kt(/firefox/i), fa = kt(/safari/i) && !kt(/chrome/i) && !kt(/android/i), zl = kt(/iP(ad|od|hone)/i), No = kt(/chrome/i) && kt(/android/i), Mo = {
  capture: !1,
  passive: !1
};
function Se(e, a, t) {
  e.addEventListener(a, t, !Vt && Mo);
}
function xe(e, a, t) {
  e.removeEventListener(a, t, !Vt && Mo);
}
function ja(e, a) {
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
function Fo(e) {
  return e.host && e !== document && e.host.nodeType && e.host !== e ? e.host : e.parentNode;
}
function ut(e, a, t, l) {
  if (e) {
    t = t || document;
    do {
      if (a != null && (a[0] === ">" ? e.parentNode === t && ja(e, a) : ja(e, a)) || l && e === t)
        return e;
      if (e === t) break;
    } while (e = Fo(e));
  }
  return null;
}
var no = /\s+/g;
function at(e, a, t) {
  if (e && a)
    if (e.classList)
      e.classList[t ? "add" : "remove"](a);
    else {
      var l = (" " + e.className + " ").replace(no, " ").replace(" " + a + " ", " ");
      e.className = (l + (t ? " " + a : "")).replace(no, " ");
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
function ta(e, a) {
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
function Lo(e, a, t) {
  if (e) {
    var l = e.getElementsByTagName(a), o = 0, d = l.length;
    if (t)
      for (; o < d; o++)
        t(l[o], o);
    return l;
  }
  return [];
}
function mt() {
  var e = document.scrollingElement;
  return e || document.documentElement;
}
function Be(e, a, t, l, o) {
  if (!(!e.getBoundingClientRect && e !== window)) {
    var d, v, p, g, i, s, u;
    if (e !== window && e.parentNode && e !== mt() ? (d = e.getBoundingClientRect(), v = d.top, p = d.left, g = d.bottom, i = d.right, s = d.height, u = d.width) : (v = 0, p = 0, g = window.innerHeight, i = window.innerWidth, s = window.innerHeight, u = window.innerWidth), (a || t) && e !== window && (o = o || e.parentNode, !Vt))
      do
        if (o && o.getBoundingClientRect && (he(o, "transform") !== "none" || t && he(o, "position") !== "static")) {
          var S = o.getBoundingClientRect();
          v -= S.top + parseInt(he(o, "border-top-width")), p -= S.left + parseInt(he(o, "border-left-width")), g = v + d.height, i = p + d.width;
          break;
        }
      while (o = o.parentNode);
    if (l && e !== window) {
      var y = ta(o || e), b = y && y.a, f = y && y.d;
      y && (v /= f, p /= b, u /= b, s /= f, g = v + s, i = p + u);
    }
    return {
      top: v,
      left: p,
      bottom: g,
      right: i,
      width: u,
      height: s
    };
  }
}
function so(e, a, t) {
  for (var l = Et(e, !0), o = Be(e)[a]; l; ) {
    var d = Be(l)[t], v = void 0;
    if (v = o >= d, !v) return l;
    if (l === mt()) break;
    l = Et(l, !1);
  }
  return !1;
}
function la(e, a, t, l) {
  for (var o = 0, d = 0, v = e.children; d < v.length; ) {
    if (v[d].style.display !== "none" && v[d] !== ye.ghost && (l || v[d] !== ye.dragged) && ut(v[d], t.draggable, e, !1)) {
      if (o === a)
        return v[d];
      o++;
    }
    d++;
  }
  return null;
}
function ql(e, a) {
  for (var t = e.lastElementChild; t && (t === ye.ghost || he(t, "display") === "none" || a && !ja(t, a)); )
    t = t.previousElementSibling;
  return t || null;
}
function it(e, a) {
  var t = 0;
  if (!e || !e.parentNode)
    return -1;
  for (; e = e.previousElementSibling; )
    e.nodeName.toUpperCase() !== "TEMPLATE" && e !== ye.clone && (!a || ja(e, a)) && t++;
  return t;
}
function ro(e) {
  var a = 0, t = 0, l = mt();
  if (e)
    do {
      var o = ta(e), d = o.a, v = o.d;
      a += e.scrollLeft * d, t += e.scrollTop * v;
    } while (e !== l && (e = e.parentNode));
  return [a, t];
}
function hs(e, a) {
  for (var t in e)
    if (e.hasOwnProperty(t)) {
      for (var l in a)
        if (a.hasOwnProperty(l) && a[l] === e[t][l]) return Number(t);
    }
  return -1;
}
function Et(e, a) {
  if (!e || !e.getBoundingClientRect) return mt();
  var t = e, l = !1;
  do
    if (t.clientWidth < t.scrollWidth || t.clientHeight < t.scrollHeight) {
      var o = he(t);
      if (t.clientWidth < t.scrollWidth && (o.overflowX == "auto" || o.overflowX == "scroll") || t.clientHeight < t.scrollHeight && (o.overflowY == "auto" || o.overflowY == "scroll")) {
        if (!t.getBoundingClientRect || t === document.body) return mt();
        if (l || a) return t;
        l = !0;
      }
    }
  while (t = t.parentNode);
  return mt();
}
function ys(e, a) {
  if (e && a)
    for (var t in a)
      a.hasOwnProperty(t) && (e[t] = a[t]);
  return e;
}
function fl(e, a) {
  return Math.round(e.top) === Math.round(a.top) && Math.round(e.left) === Math.round(a.left) && Math.round(e.height) === Math.round(a.height) && Math.round(e.width) === Math.round(a.width);
}
var ma;
function Bo(e, a) {
  return function() {
    if (!ma) {
      var t = arguments, l = this;
      t.length === 1 ? e.call(l, t[0]) : e.apply(l, t), ma = setTimeout(function() {
        ma = void 0;
      }, a);
    }
  };
}
function ks() {
  clearTimeout(ma), ma = void 0;
}
function jo(e, a, t) {
  e.scrollLeft += a, e.scrollTop += t;
}
function zo(e) {
  var a = window.Polymer, t = window.jQuery || window.Zepto;
  return a && a.dom ? a.dom(e).cloneNode(!0) : t ? t(e).clone(!0)[0] : e.cloneNode(!0);
}
function qo(e, a, t) {
  var l = {};
  return Array.from(e.children).forEach(function(o) {
    var d, v, p, g;
    if (!(!ut(o, a.draggable, e, !1) || o.animated || o === t)) {
      var i = Be(o);
      l.left = Math.min((d = l.left) !== null && d !== void 0 ? d : 1 / 0, i.left), l.top = Math.min((v = l.top) !== null && v !== void 0 ? v : 1 / 0, i.top), l.right = Math.max((p = l.right) !== null && p !== void 0 ? p : -1 / 0, i.right), l.bottom = Math.max((g = l.bottom) !== null && g !== void 0 ? g : -1 / 0, i.bottom);
    }
  }), l.width = l.right - l.left, l.height = l.bottom - l.top, l.x = l.left, l.y = l.top, l;
}
var _e = "Sortable" + (/* @__PURE__ */ new Date()).getTime();
function ws() {
  var e = [], a;
  return {
    captureAnimationState: function() {
      if (e = [], !!this.options.animation) {
        var l = [].slice.call(this.el.children);
        l.forEach(function(o) {
          if (!(he(o, "display") === "none" || o === ye.ghost)) {
            e.push({
              target: o,
              rect: Be(o)
            });
            var d = pt({}, e[e.length - 1].rect);
            if (o.thisAnimationDuration) {
              var v = ta(o, !0);
              v && (d.top -= v.f, d.left -= v.e);
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
      e.splice(hs(e, {
        target: l
      }), 1);
    },
    animateAll: function(l) {
      var o = this;
      if (!this.options.animation) {
        clearTimeout(a), typeof l == "function" && l();
        return;
      }
      var d = !1, v = 0;
      e.forEach(function(p) {
        var g = 0, i = p.target, s = i.fromRect, u = Be(i), S = i.prevFromRect, y = i.prevToRect, b = p.rect, f = ta(i, !0);
        f && (u.top -= f.f, u.left -= f.e), i.toRect = u, i.thisAnimationDuration && fl(S, u) && !fl(s, u) && // Make sure animatingRect is on line between toRect & fromRect
        (b.top - u.top) / (b.left - u.left) === (s.top - u.top) / (s.left - u.left) && (g = Vs(b, S, y, o.options)), fl(u, s) || (i.prevFromRect = s, i.prevToRect = u, g || (g = o.options.animation), o.animate(i, b, u, g)), g && (d = !0, v = Math.max(v, g), clearTimeout(i.animationResetTimer), i.animationResetTimer = setTimeout(function() {
          i.animationTime = 0, i.prevFromRect = null, i.fromRect = null, i.prevToRect = null, i.thisAnimationDuration = null;
        }, g), i.thisAnimationDuration = g);
      }), clearTimeout(a), d ? a = setTimeout(function() {
        typeof l == "function" && l();
      }, v) : typeof l == "function" && l(), e = [];
    },
    animate: function(l, o, d, v) {
      if (v) {
        he(l, "transition", ""), he(l, "transform", "");
        var p = ta(this.el), g = p && p.a, i = p && p.d, s = (o.left - d.left) / (g || 1), u = (o.top - d.top) / (i || 1);
        l.animatingX = !!s, l.animatingY = !!u, he(l, "transform", "translate3d(" + s + "px," + u + "px,0)"), this.forRepaintDummy = $s(l), he(l, "transition", "transform " + v + "ms" + (this.options.easing ? " " + this.options.easing : "")), he(l, "transform", "translate3d(0,0,0)"), typeof l.animated == "number" && clearTimeout(l.animated), l.animated = setTimeout(function() {
          he(l, "transition", ""), he(l, "transform", ""), l.animated = !1, l.animatingX = !1, l.animatingY = !1;
        }, v);
      }
    }
  };
}
function $s(e) {
  return e.offsetWidth;
}
function Vs(e, a, t, l) {
  return Math.sqrt(Math.pow(a.top - e.top, 2) + Math.pow(a.left - e.left, 2)) / Math.sqrt(Math.pow(a.top - t.top, 2) + Math.pow(a.left - t.left, 2)) * l.animation;
}
var Ht = [], ml = {
  initializeByDefault: !0
}, Va = {
  mount: function(a) {
    for (var t in ml)
      ml.hasOwnProperty(t) && !(t in a) && (a[t] = ml[t]);
    Ht.forEach(function(l) {
      if (l.pluginName === a.pluginName)
        throw "Sortable: Cannot mount plugin ".concat(a.pluginName, " more than once");
    }), Ht.push(a);
  },
  pluginEvent: function(a, t, l) {
    var o = this;
    this.eventCanceled = !1, l.cancel = function() {
      o.eventCanceled = !0;
    };
    var d = a + "Global";
    Ht.forEach(function(v) {
      t[v.pluginName] && (t[v.pluginName][d] && t[v.pluginName][d](pt({
        sortable: t
      }, l)), t.options[v.pluginName] && t[v.pluginName][a] && t[v.pluginName][a](pt({
        sortable: t
      }, l)));
    });
  },
  initializePlugins: function(a, t, l, o) {
    Ht.forEach(function(p) {
      var g = p.pluginName;
      if (!(!a.options[g] && !p.initializeByDefault)) {
        var i = new p(a, t, a.options);
        i.sortable = a, i.options = a.options, a[g] = i, wt(l, i.defaults);
      }
    });
    for (var d in a.options)
      if (a.options.hasOwnProperty(d)) {
        var v = this.modifyOption(a, d, a.options[d]);
        typeof v < "u" && (a.options[d] = v);
      }
  },
  getEventProperties: function(a, t) {
    var l = {};
    return Ht.forEach(function(o) {
      typeof o.eventProperties == "function" && wt(l, o.eventProperties.call(t[o.pluginName], a));
    }), l;
  },
  modifyOption: function(a, t, l) {
    var o;
    return Ht.forEach(function(d) {
      a[d.pluginName] && d.optionListeners && typeof d.optionListeners[t] == "function" && (o = d.optionListeners[t].call(a[d.pluginName], l));
    }), o;
  }
};
function xs(e) {
  var a = e.sortable, t = e.rootEl, l = e.name, o = e.targetEl, d = e.cloneEl, v = e.toEl, p = e.fromEl, g = e.oldIndex, i = e.newIndex, s = e.oldDraggableIndex, u = e.newDraggableIndex, S = e.originalEvent, y = e.putSortable, b = e.extraEventProperties;
  if (a = a || t && t[_e], !!a) {
    var f, w = a.options, x = "on" + l.charAt(0).toUpperCase() + l.substr(1);
    window.CustomEvent && !Vt && !$a ? f = new CustomEvent(l, {
      bubbles: !0,
      cancelable: !0
    }) : (f = document.createEvent("Event"), f.initEvent(l, !0, !0)), f.to = v || t, f.from = p || t, f.item = o || t, f.clone = d, f.oldIndex = g, f.newIndex = i, f.oldDraggableIndex = s, f.newDraggableIndex = u, f.originalEvent = S, f.pullMode = y ? y.lastPutMode : void 0;
    var $ = pt(pt({}, b), Va.getEventProperties(l, a));
    for (var D in $)
      f[D] = $[D];
    t && t.dispatchEvent(f), w[x] && w[x].call(a, f);
  }
}
var Cs = ["evt"], Qe = function(a, t) {
  var l = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, o = l.evt, d = fs(l, Cs);
  Va.pluginEvent.bind(ye)(a, t, pt({
    dragEl: ie,
    parentEl: Fe,
    ghostEl: we,
    rootEl: Pe,
    nextEl: jt,
    lastDownEl: Oa,
    cloneEl: Me,
    cloneHidden: It,
    dragStarted: ra,
    putSortable: Ke,
    activeSortable: ye.active,
    originalEvent: o,
    oldIndex: _t,
    oldDraggableIndex: pa,
    newIndex: lt,
    newDraggableIndex: Tt,
    hideGhostForTarget: Ho,
    unhideGhostForTarget: Yo,
    cloneNowHidden: function() {
      It = !0;
    },
    cloneNowShown: function() {
      It = !1;
    },
    dispatchSortableEvent: function(p) {
      Xe({
        sortable: t,
        name: p,
        originalEvent: o
      });
    }
  }, d));
};
function Xe(e) {
  xs(pt({
    putSortable: Ke,
    cloneEl: Me,
    targetEl: ie,
    rootEl: Pe,
    oldIndex: _t,
    oldDraggableIndex: pa,
    newIndex: lt,
    newDraggableIndex: Tt
  }, e));
}
var ie, Fe, we, Pe, jt, Oa, Me, It, _t, lt, pa, Tt, Ea, Ke, Xt = !1, za = !1, qa = [], Ft, dt, pl, gl, uo, co, ra, Yt, ga, ba = !1, Ua = !1, Na, Ye, bl = [], Tl = !1, Wa = [], Qa = typeof document < "u", Aa = zl, vo = $a || Vt ? "cssFloat" : "float", Ss = Qa && !No && !zl && "draggable" in document.createElement("div"), Wo = (function() {
  if (Qa) {
    if (Vt)
      return !1;
    var e = document.createElement("x");
    return e.style.cssText = "pointer-events:auto", e.style.pointerEvents === "auto";
  }
})(), Go = function(a, t) {
  var l = he(a), o = parseInt(l.width) - parseInt(l.paddingLeft) - parseInt(l.paddingRight) - parseInt(l.borderLeftWidth) - parseInt(l.borderRightWidth), d = la(a, 0, t), v = la(a, 1, t), p = d && he(d), g = v && he(v), i = p && parseInt(p.marginLeft) + parseInt(p.marginRight) + Be(d).width, s = g && parseInt(g.marginLeft) + parseInt(g.marginRight) + Be(v).width;
  if (l.display === "flex")
    return l.flexDirection === "column" || l.flexDirection === "column-reverse" ? "vertical" : "horizontal";
  if (l.display === "grid")
    return l.gridTemplateColumns.split(" ").length <= 1 ? "vertical" : "horizontal";
  if (d && p.float && p.float !== "none") {
    var u = p.float === "left" ? "left" : "right";
    return v && (g.clear === "both" || g.clear === u) ? "vertical" : "horizontal";
  }
  return d && (p.display === "block" || p.display === "flex" || p.display === "table" || p.display === "grid" || i >= o && l[vo] === "none" || v && l[vo] === "none" && i + s > o) ? "vertical" : "horizontal";
}, Ts = function(a, t, l) {
  var o = l ? a.left : a.top, d = l ? a.right : a.bottom, v = l ? a.width : a.height, p = l ? t.left : t.top, g = l ? t.right : t.bottom, i = l ? t.width : t.height;
  return o === p || d === g || o + v / 2 === p + i / 2;
}, Is = function(a, t) {
  var l;
  return qa.some(function(o) {
    var d = o[_e].options.emptyInsertThreshold;
    if (!(!d || ql(o))) {
      var v = Be(o), p = a >= v.left - d && a <= v.right + d, g = t >= v.top - d && t <= v.bottom + d;
      if (p && g)
        return l = o;
    }
  }), l;
}, Ko = function(a) {
  function t(d, v) {
    return function(p, g, i, s) {
      var u = p.options.group.name && g.options.group.name && p.options.group.name === g.options.group.name;
      if (d == null && (v || u))
        return !0;
      if (d == null || d === !1)
        return !1;
      if (v && d === "clone")
        return d;
      if (typeof d == "function")
        return t(d(p, g, i, s), v)(p, g, i, s);
      var S = (v ? p : g).options.group.name;
      return d === !0 || typeof d == "string" && d === S || d.join && d.indexOf(S) > -1;
    };
  }
  var l = {}, o = a.group;
  (!o || Sl(o) != "object") && (o = {
    name: o
  }), l.name = o.name, l.checkPull = t(o.pull, !0), l.checkPut = t(o.put), l.revertClone = o.revertClone, a.group = l;
}, Ho = function() {
  !Wo && we && he(we, "display", "none");
}, Yo = function() {
  !Wo && we && he(we, "display", "");
};
Qa && !No && document.addEventListener("click", function(e) {
  if (za)
    return e.preventDefault(), e.stopPropagation && e.stopPropagation(), e.stopImmediatePropagation && e.stopImmediatePropagation(), za = !1, !1;
}, !0);
var Lt = function(a) {
  if (ie) {
    a = a.touches ? a.touches[0] : a;
    var t = Is(a.clientX, a.clientY);
    if (t) {
      var l = {};
      for (var o in a)
        a.hasOwnProperty(o) && (l[o] = a[o]);
      l.target = l.rootEl = t, l.preventDefault = void 0, l.stopPropagation = void 0, t[_e]._onDragOver(l);
    }
  }
}, Ds = function(a) {
  ie && ie.parentNode[_e]._isOutsideThisEl(a.target);
};
function ye(e, a) {
  if (!(e && e.nodeType && e.nodeType === 1))
    throw "Sortable: `el` must be an HTMLElement, not ".concat({}.toString.call(e));
  this.el = e, this.options = a = wt({}, a), e[_e] = this;
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
      return Go(e, this.options);
    },
    ghostClass: "sortable-ghost",
    chosenClass: "sortable-chosen",
    dragClass: "sortable-drag",
    ignore: "a, img",
    filter: null,
    preventOnFilter: !0,
    animation: 0,
    easing: null,
    setData: function(v, p) {
      v.setData("Text", p.textContent);
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
    supportPointer: ye.supportPointer !== !1 && "PointerEvent" in window && (!fa || zl),
    emptyInsertThreshold: 5
  };
  Va.initializePlugins(this, e, t);
  for (var l in t)
    !(l in a) && (a[l] = t[l]);
  Ko(a);
  for (var o in this)
    o.charAt(0) === "_" && typeof this[o] == "function" && (this[o] = this[o].bind(this));
  this.nativeDraggable = a.forceFallback ? !1 : Ss, this.nativeDraggable && (this.options.touchStartThreshold = 1), a.supportPointer ? Se(e, "pointerdown", this._onTapStart) : (Se(e, "mousedown", this._onTapStart), Se(e, "touchstart", this._onTapStart)), this.nativeDraggable && (Se(e, "dragover", this), Se(e, "dragenter", this)), qa.push(this.el), a.store && a.store.get && this.sort(a.store.get(this) || []), wt(this, ws());
}
ye.prototype = /** @lends Sortable.prototype */
{
  constructor: ye,
  _isOutsideThisEl: function(a) {
    !this.el.contains(a) && a !== this.el && (Yt = null);
  },
  _getDirection: function(a, t) {
    return typeof this.options.direction == "function" ? this.options.direction.call(this, a, t, ie) : this.options.direction;
  },
  _onTapStart: function(a) {
    if (a.cancelable) {
      var t = this, l = this.el, o = this.options, d = o.preventOnFilter, v = a.type, p = a.touches && a.touches[0] || a.pointerType && a.pointerType === "touch" && a, g = (p || a).target, i = a.target.shadowRoot && (a.path && a.path[0] || a.composedPath && a.composedPath()[0]) || g, s = o.filter;
      if (Ms(l), !ie && !(/mousedown|pointerdown/.test(v) && a.button !== 0 || o.disabled) && !i.isContentEditable && !(!this.nativeDraggable && fa && g && g.tagName.toUpperCase() === "SELECT") && (g = ut(g, o.draggable, l, !1), !(g && g.animated) && Oa !== g)) {
        if (_t = it(g), pa = it(g, o.draggable), typeof s == "function") {
          if (s.call(this, a, g, this)) {
            Xe({
              sortable: t,
              rootEl: i,
              name: "filter",
              targetEl: g,
              toEl: l,
              fromEl: l
            }), Qe("filter", t, {
              evt: a
            }), d && a.preventDefault();
            return;
          }
        } else if (s && (s = s.split(",").some(function(u) {
          if (u = ut(i, u.trim(), l, !1), u)
            return Xe({
              sortable: t,
              rootEl: u,
              name: "filter",
              targetEl: g,
              fromEl: l,
              toEl: l
            }), Qe("filter", t, {
              evt: a
            }), !0;
        }), s)) {
          d && a.preventDefault();
          return;
        }
        o.handle && !ut(i, o.handle, l, !1) || this._prepareDragStart(a, p, g);
      }
    }
  },
  _prepareDragStart: function(a, t, l) {
    var o = this, d = o.el, v = o.options, p = d.ownerDocument, g;
    if (l && !ie && l.parentNode === d) {
      var i = Be(l);
      if (Pe = d, ie = l, Fe = ie.parentNode, jt = ie.nextSibling, Oa = l, Ea = v.group, ye.dragged = ie, Ft = {
        target: ie,
        clientX: (t || a).clientX,
        clientY: (t || a).clientY
      }, uo = Ft.clientX - i.left, co = Ft.clientY - i.top, this._lastX = (t || a).clientX, this._lastY = (t || a).clientY, ie.style["will-change"] = "all", g = function() {
        if (Qe("delayEnded", o, {
          evt: a
        }), ye.eventCanceled) {
          o._onDrop();
          return;
        }
        o._disableDelayedDragEvents(), !io && o.nativeDraggable && (ie.draggable = !0), o._triggerDragStart(a, t), Xe({
          sortable: o,
          name: "choose",
          originalEvent: a
        }), at(ie, v.chosenClass, !0);
      }, v.ignore.split(",").forEach(function(s) {
        Lo(ie, s.trim(), hl);
      }), Se(p, "dragover", Lt), Se(p, "mousemove", Lt), Se(p, "touchmove", Lt), v.supportPointer ? (Se(p, "pointerup", o._onDrop), !this.nativeDraggable && Se(p, "pointercancel", o._onDrop)) : (Se(p, "mouseup", o._onDrop), Se(p, "touchend", o._onDrop), Se(p, "touchcancel", o._onDrop)), io && this.nativeDraggable && (this.options.touchStartThreshold = 4, ie.draggable = !0), Qe("delayStart", this, {
        evt: a
      }), v.delay && (!v.delayOnTouchOnly || t) && (!this.nativeDraggable || !($a || Vt))) {
        if (ye.eventCanceled) {
          this._onDrop();
          return;
        }
        v.supportPointer ? (Se(p, "pointerup", o._disableDelayedDrag), Se(p, "pointercancel", o._disableDelayedDrag)) : (Se(p, "mouseup", o._disableDelayedDrag), Se(p, "touchend", o._disableDelayedDrag), Se(p, "touchcancel", o._disableDelayedDrag)), Se(p, "mousemove", o._delayedDragTouchMoveHandler), Se(p, "touchmove", o._delayedDragTouchMoveHandler), v.supportPointer && Se(p, "pointermove", o._delayedDragTouchMoveHandler), o._dragStartTimer = setTimeout(g, v.delay);
      } else
        g();
    }
  },
  _delayedDragTouchMoveHandler: function(a) {
    var t = a.touches ? a.touches[0] : a;
    Math.max(Math.abs(t.clientX - this._lastX), Math.abs(t.clientY - this._lastY)) >= Math.floor(this.options.touchStartThreshold / (this.nativeDraggable && window.devicePixelRatio || 1)) && this._disableDelayedDrag();
  },
  _disableDelayedDrag: function() {
    ie && hl(ie), clearTimeout(this._dragStartTimer), this._disableDelayedDragEvents();
  },
  _disableDelayedDragEvents: function() {
    var a = this.el.ownerDocument;
    xe(a, "mouseup", this._disableDelayedDrag), xe(a, "touchend", this._disableDelayedDrag), xe(a, "touchcancel", this._disableDelayedDrag), xe(a, "pointerup", this._disableDelayedDrag), xe(a, "pointercancel", this._disableDelayedDrag), xe(a, "mousemove", this._delayedDragTouchMoveHandler), xe(a, "touchmove", this._delayedDragTouchMoveHandler), xe(a, "pointermove", this._delayedDragTouchMoveHandler);
  },
  _triggerDragStart: function(a, t) {
    t = t || a.pointerType == "touch" && a, !this.nativeDraggable || t ? this.options.supportPointer ? Se(document, "pointermove", this._onTouchMove) : t ? Se(document, "touchmove", this._onTouchMove) : Se(document, "mousemove", this._onTouchMove) : (Se(ie, "dragend", this), Se(Pe, "dragstart", this._onDragStart));
    try {
      document.selection ? Ma(function() {
        document.selection.empty();
      }) : window.getSelection().removeAllRanges();
    } catch {
    }
  },
  _dragStarted: function(a, t) {
    if (Xt = !1, Pe && ie) {
      Qe("dragStarted", this, {
        evt: t
      }), this.nativeDraggable && Se(document, "dragover", Ds);
      var l = this.options;
      !a && at(ie, l.dragClass, !1), at(ie, l.ghostClass, !0), ye.active = this, a && this._appendGhost(), Xe({
        sortable: this,
        name: "start",
        originalEvent: t
      });
    } else
      this._nulling();
  },
  _emulateDragOver: function() {
    if (dt) {
      this._lastX = dt.clientX, this._lastY = dt.clientY, Ho();
      for (var a = document.elementFromPoint(dt.clientX, dt.clientY), t = a; a && a.shadowRoot && (a = a.shadowRoot.elementFromPoint(dt.clientX, dt.clientY), a !== t); )
        t = a;
      if (ie.parentNode[_e]._isOutsideThisEl(a), t)
        do {
          if (t[_e]) {
            var l = void 0;
            if (l = t[_e]._onDragOver({
              clientX: dt.clientX,
              clientY: dt.clientY,
              target: a,
              rootEl: t
            }), l && !this.options.dragoverBubble)
              break;
          }
          a = t;
        } while (t = Fo(t));
      Yo();
    }
  },
  _onTouchMove: function(a) {
    if (Ft) {
      var t = this.options, l = t.fallbackTolerance, o = t.fallbackOffset, d = a.touches ? a.touches[0] : a, v = we && ta(we, !0), p = we && v && v.a, g = we && v && v.d, i = Aa && Ye && ro(Ye), s = (d.clientX - Ft.clientX + o.x) / (p || 1) + (i ? i[0] - bl[0] : 0) / (p || 1), u = (d.clientY - Ft.clientY + o.y) / (g || 1) + (i ? i[1] - bl[1] : 0) / (g || 1);
      if (!ye.active && !Xt) {
        if (l && Math.max(Math.abs(d.clientX - this._lastX), Math.abs(d.clientY - this._lastY)) < l)
          return;
        this._onDragStart(a, !0);
      }
      if (we) {
        v ? (v.e += s - (pl || 0), v.f += u - (gl || 0)) : v = {
          a: 1,
          b: 0,
          c: 0,
          d: 1,
          e: s,
          f: u
        };
        var S = "matrix(".concat(v.a, ",").concat(v.b, ",").concat(v.c, ",").concat(v.d, ",").concat(v.e, ",").concat(v.f, ")");
        he(we, "webkitTransform", S), he(we, "mozTransform", S), he(we, "msTransform", S), he(we, "transform", S), pl = s, gl = u, dt = d;
      }
      a.cancelable && a.preventDefault();
    }
  },
  _appendGhost: function() {
    if (!we) {
      var a = this.options.fallbackOnBody ? document.body : Pe, t = Be(ie, !0, Aa, !0, a), l = this.options;
      if (Aa) {
        for (Ye = a; he(Ye, "position") === "static" && he(Ye, "transform") === "none" && Ye !== document; )
          Ye = Ye.parentNode;
        Ye !== document.body && Ye !== document.documentElement ? (Ye === document && (Ye = mt()), t.top += Ye.scrollTop, t.left += Ye.scrollLeft) : Ye = mt(), bl = ro(Ye);
      }
      we = ie.cloneNode(!0), at(we, l.ghostClass, !1), at(we, l.fallbackClass, !0), at(we, l.dragClass, !0), he(we, "transition", ""), he(we, "transform", ""), he(we, "box-sizing", "border-box"), he(we, "margin", 0), he(we, "top", t.top), he(we, "left", t.left), he(we, "width", t.width), he(we, "height", t.height), he(we, "opacity", "0.8"), he(we, "position", Aa ? "absolute" : "fixed"), he(we, "zIndex", "100000"), he(we, "pointerEvents", "none"), ye.ghost = we, a.appendChild(we), he(we, "transform-origin", uo / parseInt(we.style.width) * 100 + "% " + co / parseInt(we.style.height) * 100 + "%");
    }
  },
  _onDragStart: function(a, t) {
    var l = this, o = a.dataTransfer, d = l.options;
    if (Qe("dragStart", this, {
      evt: a
    }), ye.eventCanceled) {
      this._onDrop();
      return;
    }
    Qe("setupClone", this), ye.eventCanceled || (Me = zo(ie), Me.removeAttribute("id"), Me.draggable = !1, Me.style["will-change"] = "", this._hideClone(), at(Me, this.options.chosenClass, !1), ye.clone = Me), l.cloneId = Ma(function() {
      Qe("clone", l), !ye.eventCanceled && (l.options.removeCloneOnHide || Pe.insertBefore(Me, ie), l._hideClone(), Xe({
        sortable: l,
        name: "clone"
      }));
    }), !t && at(ie, d.dragClass, !0), t ? (za = !0, l._loopId = setInterval(l._emulateDragOver, 50)) : (xe(document, "mouseup", l._onDrop), xe(document, "touchend", l._onDrop), xe(document, "touchcancel", l._onDrop), o && (o.effectAllowed = "move", d.setData && d.setData.call(l, o, ie)), Se(document, "drop", l), he(ie, "transform", "translateZ(0)")), Xt = !0, l._dragStartId = Ma(l._dragStarted.bind(l, t, a)), Se(document, "selectstart", l), ra = !0, window.getSelection().removeAllRanges(), fa && he(document.body, "user-select", "none");
  },
  // Returns true - if no further action is needed (either inserted or another condition)
  _onDragOver: function(a) {
    var t = this.el, l = a.target, o, d, v, p = this.options, g = p.group, i = ye.active, s = Ea === g, u = p.sort, S = Ke || i, y, b = this, f = !1;
    if (Tl) return;
    function w(Ie, K) {
      Qe(Ie, b, pt({
        evt: a,
        isOwner: s,
        axis: y ? "vertical" : "horizontal",
        revert: v,
        dragRect: o,
        targetRect: d,
        canSort: u,
        fromSortable: S,
        target: l,
        completed: $,
        onMove: function(M, de) {
          return Ra(Pe, t, ie, o, M, Be(M), a, de);
        },
        changed: D
      }, K));
    }
    function x() {
      w("dragOverAnimationCapture"), b.captureAnimationState(), b !== S && S.captureAnimationState();
    }
    function $(Ie) {
      return w("dragOverCompleted", {
        insertion: Ie
      }), Ie && (s ? i._hideClone() : i._showClone(b), b !== S && (at(ie, Ke ? Ke.options.ghostClass : i.options.ghostClass, !1), at(ie, p.ghostClass, !0)), Ke !== b && b !== ye.active ? Ke = b : b === ye.active && Ke && (Ke = null), S === b && (b._ignoreWhileAnimating = l), b.animateAll(function() {
        w("dragOverAnimationComplete"), b._ignoreWhileAnimating = null;
      }), b !== S && (S.animateAll(), S._ignoreWhileAnimating = null)), (l === ie && !ie.animated || l === t && !l.animated) && (Yt = null), !p.dragoverBubble && !a.rootEl && l !== document && (ie.parentNode[_e]._isOutsideThisEl(a.target), !Ie && Lt(a)), !p.dragoverBubble && a.stopPropagation && a.stopPropagation(), f = !0;
    }
    function D() {
      lt = it(ie), Tt = it(ie, p.draggable), Xe({
        sortable: b,
        name: "change",
        toEl: t,
        newIndex: lt,
        newDraggableIndex: Tt,
        originalEvent: a
      });
    }
    if (a.preventDefault !== void 0 && a.cancelable && a.preventDefault(), l = ut(l, p.draggable, t, !0), w("dragOver"), ye.eventCanceled) return f;
    if (ie.contains(a.target) || l.animated && l.animatingX && l.animatingY || b._ignoreWhileAnimating === l)
      return $(!1);
    if (za = !1, i && !p.disabled && (s ? u || (v = Fe !== Pe) : Ke === this || (this.lastPutMode = Ea.checkPull(this, i, ie, a)) && g.checkPut(this, i, ie, a))) {
      if (y = this._getDirection(a, l) === "vertical", o = Be(ie), w("dragOverValid"), ye.eventCanceled) return f;
      if (v)
        return Fe = Pe, x(), this._hideClone(), w("revert"), ye.eventCanceled || (jt ? Pe.insertBefore(ie, jt) : Pe.appendChild(ie)), $(!0);
      var A = ql(t, p.draggable);
      if (!A || Rs(a, y, this) && !A.animated) {
        if (A === ie)
          return $(!1);
        if (A && t === a.target && (l = A), l && (d = Be(l)), Ra(Pe, t, ie, o, l, d, a, !!l) !== !1)
          return x(), A && A.nextSibling ? t.insertBefore(ie, A.nextSibling) : t.appendChild(ie), Fe = t, D(), $(!0);
      } else if (A && As(a, y, this)) {
        var j = la(t, 0, p, !0);
        if (j === ie)
          return $(!1);
        if (l = j, d = Be(l), Ra(Pe, t, ie, o, l, d, a, !1) !== !1)
          return x(), t.insertBefore(ie, j), Fe = t, D(), $(!0);
      } else if (l.parentNode === t) {
        d = Be(l);
        var ae = 0, J, se = ie.parentNode !== t, ce = !Ts(ie.animated && ie.toRect || o, l.animated && l.toRect || d, y), pe = y ? "top" : "left", ve = so(l, "top", "top") || so(ie, "top", "top"), oe = ve ? ve.scrollTop : void 0;
        Yt !== l && (J = d[pe], ba = !1, Ua = !ce && p.invertSwap || se), ae = Ps(a, l, d, y, ce ? 1 : p.swapThreshold, p.invertedSwapThreshold == null ? p.swapThreshold : p.invertedSwapThreshold, Ua, Yt === l);
        var O;
        if (ae !== 0) {
          var Y = it(ie);
          do
            Y -= ae, O = Fe.children[Y];
          while (O && (he(O, "display") === "none" || O === we));
        }
        if (ae === 0 || O === l)
          return $(!1);
        Yt = l, ga = ae;
        var F = l.nextElementSibling, ne = !1;
        ne = ae === 1;
        var be = Ra(Pe, t, ie, o, l, d, a, ne);
        if (be !== !1)
          return (be === 1 || be === -1) && (ne = be === 1), Tl = !0, setTimeout(Us, 30), x(), ne && !F ? t.appendChild(ie) : l.parentNode.insertBefore(ie, ne ? F : l), ve && jo(ve, 0, oe - ve.scrollTop), Fe = ie.parentNode, J !== void 0 && !Ua && (Na = Math.abs(J - Be(l)[pe])), D(), $(!0);
      }
      if (t.contains(ie))
        return $(!1);
    }
    return !1;
  },
  _ignoreWhileAnimating: null,
  _offMoveEvents: function() {
    xe(document, "mousemove", this._onTouchMove), xe(document, "touchmove", this._onTouchMove), xe(document, "pointermove", this._onTouchMove), xe(document, "dragover", Lt), xe(document, "mousemove", Lt), xe(document, "touchmove", Lt);
  },
  _offUpEvents: function() {
    var a = this.el.ownerDocument;
    xe(a, "mouseup", this._onDrop), xe(a, "touchend", this._onDrop), xe(a, "pointerup", this._onDrop), xe(a, "pointercancel", this._onDrop), xe(a, "touchcancel", this._onDrop), xe(document, "selectstart", this);
  },
  _onDrop: function(a) {
    var t = this.el, l = this.options;
    if (lt = it(ie), Tt = it(ie, l.draggable), Qe("drop", this, {
      evt: a
    }), Fe = ie && ie.parentNode, lt = it(ie), Tt = it(ie, l.draggable), ye.eventCanceled) {
      this._nulling();
      return;
    }
    Xt = !1, Ua = !1, ba = !1, clearInterval(this._loopId), clearTimeout(this._dragStartTimer), Il(this.cloneId), Il(this._dragStartId), this.nativeDraggable && (xe(document, "drop", this), xe(t, "dragstart", this._onDragStart)), this._offMoveEvents(), this._offUpEvents(), fa && he(document.body, "user-select", ""), he(ie, "transform", ""), a && (ra && (a.cancelable && a.preventDefault(), !l.dropBubble && a.stopPropagation()), we && we.parentNode && we.parentNode.removeChild(we), (Pe === Fe || Ke && Ke.lastPutMode !== "clone") && Me && Me.parentNode && Me.parentNode.removeChild(Me), ie && (this.nativeDraggable && xe(ie, "dragend", this), hl(ie), ie.style["will-change"] = "", ra && !Xt && at(ie, Ke ? Ke.options.ghostClass : this.options.ghostClass, !1), at(ie, this.options.chosenClass, !1), Xe({
      sortable: this,
      name: "unchoose",
      toEl: Fe,
      newIndex: null,
      newDraggableIndex: null,
      originalEvent: a
    }), Pe !== Fe ? (lt >= 0 && (Xe({
      rootEl: Fe,
      name: "add",
      toEl: Fe,
      fromEl: Pe,
      originalEvent: a
    }), Xe({
      sortable: this,
      name: "remove",
      toEl: Fe,
      originalEvent: a
    }), Xe({
      rootEl: Fe,
      name: "sort",
      toEl: Fe,
      fromEl: Pe,
      originalEvent: a
    }), Xe({
      sortable: this,
      name: "sort",
      toEl: Fe,
      originalEvent: a
    })), Ke && Ke.save()) : lt !== _t && lt >= 0 && (Xe({
      sortable: this,
      name: "update",
      toEl: Fe,
      originalEvent: a
    }), Xe({
      sortable: this,
      name: "sort",
      toEl: Fe,
      originalEvent: a
    })), ye.active && ((lt == null || lt === -1) && (lt = _t, Tt = pa), Xe({
      sortable: this,
      name: "end",
      toEl: Fe,
      originalEvent: a
    }), this.save()))), this._nulling();
  },
  _nulling: function() {
    Qe("nulling", this), Pe = ie = Fe = we = jt = Me = Oa = It = Ft = dt = ra = lt = Tt = _t = pa = Yt = ga = Ke = Ea = ye.dragged = ye.ghost = ye.clone = ye.active = null;
    var a = this.el;
    Wa.forEach(function(t) {
      a.contains(t) && (t.checked = !0);
    }), Wa.length = pl = gl = 0;
  },
  handleEvent: function(a) {
    switch (a.type) {
      case "drop":
      case "dragend":
        this._onDrop(a);
        break;
      case "dragenter":
      case "dragover":
        ie && (this._onDragOver(a), Es(a));
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
    for (var a = [], t, l = this.el.children, o = 0, d = l.length, v = this.options; o < d; o++)
      t = l[o], ut(t, v.draggable, this.el, !1) && a.push(t.getAttribute(v.dataIdAttr) || Ns(t));
    return a;
  },
  /**
   * Sorts the elements according to the array.
   * @param  {String[]}  order  order of the items
   */
  sort: function(a, t) {
    var l = {}, o = this.el;
    this.toArray().forEach(function(d, v) {
      var p = o.children[v];
      ut(p, this.options.draggable, o, !1) && (l[d] = p);
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
    return ut(a, t || this.options.draggable, this.el, !1);
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
    var o = Va.modifyOption(this, a, t);
    typeof o < "u" ? l[a] = o : l[a] = t, a === "group" && Ko(l);
  },
  /**
   * Destroy
   */
  destroy: function() {
    Qe("destroy", this);
    var a = this.el;
    a[_e] = null, xe(a, "mousedown", this._onTapStart), xe(a, "touchstart", this._onTapStart), xe(a, "pointerdown", this._onTapStart), this.nativeDraggable && (xe(a, "dragover", this), xe(a, "dragenter", this)), Array.prototype.forEach.call(a.querySelectorAll("[draggable]"), function(t) {
      t.removeAttribute("draggable");
    }), this._onDrop(), this._disableDelayedDragEvents(), qa.splice(qa.indexOf(this.el), 1), this.el = a = null;
  },
  _hideClone: function() {
    if (!It) {
      if (Qe("hideClone", this), ye.eventCanceled) return;
      he(Me, "display", "none"), this.options.removeCloneOnHide && Me.parentNode && Me.parentNode.removeChild(Me), It = !0;
    }
  },
  _showClone: function(a) {
    if (a.lastPutMode !== "clone") {
      this._hideClone();
      return;
    }
    if (It) {
      if (Qe("showClone", this), ye.eventCanceled) return;
      ie.parentNode == Pe && !this.options.group.revertClone ? Pe.insertBefore(Me, ie) : jt ? Pe.insertBefore(Me, jt) : Pe.appendChild(Me), this.options.group.revertClone && this.animate(ie, Me), he(Me, "display", ""), It = !1;
    }
  }
};
function Es(e) {
  e.dataTransfer && (e.dataTransfer.dropEffect = "move"), e.cancelable && e.preventDefault();
}
function Ra(e, a, t, l, o, d, v, p) {
  var g, i = e[_e], s = i.options.onMove, u;
  return window.CustomEvent && !Vt && !$a ? g = new CustomEvent("move", {
    bubbles: !0,
    cancelable: !0
  }) : (g = document.createEvent("Event"), g.initEvent("move", !0, !0)), g.to = a, g.from = e, g.dragged = t, g.draggedRect = l, g.related = o || a, g.relatedRect = d || Be(a), g.willInsertAfter = p, g.originalEvent = v, e.dispatchEvent(g), s && (u = s.call(i, g, v)), u;
}
function hl(e) {
  e.draggable = !1;
}
function Us() {
  Tl = !1;
}
function As(e, a, t) {
  var l = Be(la(t.el, 0, t.options, !0)), o = qo(t.el, t.options, we), d = 10;
  return a ? e.clientX < o.left - d || e.clientY < l.top && e.clientX < l.right : e.clientY < o.top - d || e.clientY < l.bottom && e.clientX < l.left;
}
function Rs(e, a, t) {
  var l = Be(ql(t.el, t.options.draggable)), o = qo(t.el, t.options, we), d = 10;
  return a ? e.clientX > o.right + d || e.clientY > l.bottom && e.clientX > l.left : e.clientY > o.bottom + d || e.clientX > l.right && e.clientY > l.top;
}
function Ps(e, a, t, l, o, d, v, p) {
  var g = l ? e.clientY : e.clientX, i = l ? t.height : t.width, s = l ? t.top : t.left, u = l ? t.bottom : t.right, S = !1;
  if (!v) {
    if (p && Na < i * o) {
      if (!ba && (ga === 1 ? g > s + i * d / 2 : g < u - i * d / 2) && (ba = !0), ba)
        S = !0;
      else if (ga === 1 ? g < s + Na : g > u - Na)
        return -ga;
    } else if (g > s + i * (1 - o) / 2 && g < u - i * (1 - o) / 2)
      return Os(a);
  }
  return S = S || v, S && (g < s + i * d / 2 || g > u - i * d / 2) ? g > s + i / 2 ? 1 : -1 : 0;
}
function Os(e) {
  return it(ie) < it(e) ? 1 : -1;
}
function Ns(e) {
  for (var a = e.tagName + e.className + e.src + e.href + e.textContent, t = a.length, l = 0; t--; )
    l += a.charCodeAt(t);
  return l.toString(36);
}
function Ms(e) {
  Wa.length = 0;
  for (var a = e.getElementsByTagName("input"), t = a.length; t--; ) {
    var l = a[t];
    l.checked && Wa.push(l);
  }
}
function Ma(e) {
  return setTimeout(e, 0);
}
function Il(e) {
  return clearTimeout(e);
}
Qa && Se(document, "touchmove", function(e) {
  (ye.active || Xt) && e.cancelable && e.preventDefault();
});
ye.utils = {
  on: Se,
  off: xe,
  css: he,
  find: Lo,
  is: function(a, t) {
    return !!ut(a, t, a, !1);
  },
  extend: ys,
  throttle: Bo,
  closest: ut,
  toggleClass: at,
  clone: zo,
  index: it,
  nextTick: Ma,
  cancelNextTick: Il,
  detectDirection: Go,
  getChild: la,
  expando: _e
};
ye.get = function(e) {
  return e[_e];
};
ye.mount = function() {
  for (var e = arguments.length, a = new Array(e), t = 0; t < e; t++)
    a[t] = arguments[t];
  a[0].constructor === Array && (a = a[0]), a.forEach(function(l) {
    if (!l.prototype || !l.prototype.constructor)
      throw "Sortable: Mounted plugin must be a constructor function, not ".concat({}.toString.call(l));
    l.utils && (ye.utils = pt(pt({}, ye.utils), l.utils)), Va.mount(l);
  });
};
ye.create = function(e, a) {
  return new ye(e, a);
};
ye.version = bs;
var Le = [], da, Dl, El = !1, yl, kl, Ga, ua;
function Fs() {
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
      this.sortable.nativeDraggable ? Se(document, "dragover", this._handleAutoScroll) : this.options.supportPointer ? Se(document, "pointermove", this._handleFallbackAutoScroll) : l.touches ? Se(document, "touchmove", this._handleFallbackAutoScroll) : Se(document, "mousemove", this._handleFallbackAutoScroll);
    },
    dragOverCompleted: function(t) {
      var l = t.originalEvent;
      !this.options.dragOverBubble && !l.rootEl && this._handleAutoScroll(l);
    },
    drop: function() {
      this.sortable.nativeDraggable ? xe(document, "dragover", this._handleAutoScroll) : (xe(document, "pointermove", this._handleFallbackAutoScroll), xe(document, "touchmove", this._handleFallbackAutoScroll), xe(document, "mousemove", this._handleFallbackAutoScroll)), fo(), Fa(), ks();
    },
    nulling: function() {
      Ga = Dl = da = El = ua = yl = kl = null, Le.length = 0;
    },
    _handleFallbackAutoScroll: function(t) {
      this._handleAutoScroll(t, !0);
    },
    _handleAutoScroll: function(t, l) {
      var o = this, d = (t.touches ? t.touches[0] : t).clientX, v = (t.touches ? t.touches[0] : t).clientY, p = document.elementFromPoint(d, v);
      if (Ga = t, l || this.options.forceAutoScrollFallback || $a || Vt || fa) {
        wl(t, this.options, p, l);
        var g = Et(p, !0);
        El && (!ua || d !== yl || v !== kl) && (ua && fo(), ua = setInterval(function() {
          var i = Et(document.elementFromPoint(d, v), !0);
          i !== g && (g = i, Fa()), wl(t, o.options, i, l);
        }, 10), yl = d, kl = v);
      } else {
        if (!this.options.bubbleScroll || Et(p, !0) === mt()) {
          Fa();
          return;
        }
        wl(t, this.options, Et(p, !1), !1);
      }
    }
  }, wt(e, {
    pluginName: "scroll",
    initializeByDefault: !0
  });
}
function Fa() {
  Le.forEach(function(e) {
    clearInterval(e.pid);
  }), Le = [];
}
function fo() {
  clearInterval(ua);
}
var wl = Bo(function(e, a, t, l) {
  if (a.scroll) {
    var o = (e.touches ? e.touches[0] : e).clientX, d = (e.touches ? e.touches[0] : e).clientY, v = a.scrollSensitivity, p = a.scrollSpeed, g = mt(), i = !1, s;
    Dl !== t && (Dl = t, Fa(), da = a.scroll, s = a.scrollFn, da === !0 && (da = Et(t, !0)));
    var u = 0, S = da;
    do {
      var y = S, b = Be(y), f = b.top, w = b.bottom, x = b.left, $ = b.right, D = b.width, A = b.height, j = void 0, ae = void 0, J = y.scrollWidth, se = y.scrollHeight, ce = he(y), pe = y.scrollLeft, ve = y.scrollTop;
      y === g ? (j = D < J && (ce.overflowX === "auto" || ce.overflowX === "scroll" || ce.overflowX === "visible"), ae = A < se && (ce.overflowY === "auto" || ce.overflowY === "scroll" || ce.overflowY === "visible")) : (j = D < J && (ce.overflowX === "auto" || ce.overflowX === "scroll"), ae = A < se && (ce.overflowY === "auto" || ce.overflowY === "scroll"));
      var oe = j && (Math.abs($ - o) <= v && pe + D < J) - (Math.abs(x - o) <= v && !!pe), O = ae && (Math.abs(w - d) <= v && ve + A < se) - (Math.abs(f - d) <= v && !!ve);
      if (!Le[u])
        for (var Y = 0; Y <= u; Y++)
          Le[Y] || (Le[Y] = {});
      (Le[u].vx != oe || Le[u].vy != O || Le[u].el !== y) && (Le[u].el = y, Le[u].vx = oe, Le[u].vy = O, clearInterval(Le[u].pid), (oe != 0 || O != 0) && (i = !0, Le[u].pid = setInterval(function() {
        l && this.layer === 0 && ye.active._onTouchMove(Ga);
        var F = Le[this.layer].vy ? Le[this.layer].vy * p : 0, ne = Le[this.layer].vx ? Le[this.layer].vx * p : 0;
        typeof s == "function" && s.call(ye.dragged.parentNode[_e], ne, F, e, Ga, Le[this.layer].el) !== "continue" || jo(Le[this.layer].el, ne, F);
      }.bind({
        layer: u
      }), 24))), u++;
    } while (a.bubbleScroll && S !== g && (S = Et(S, !1)));
    El = i;
  }
}, 30), Xo = function(a) {
  var t = a.originalEvent, l = a.putSortable, o = a.dragEl, d = a.activeSortable, v = a.dispatchSortableEvent, p = a.hideGhostForTarget, g = a.unhideGhostForTarget;
  if (t) {
    var i = l || d;
    p();
    var s = t.changedTouches && t.changedTouches.length ? t.changedTouches[0] : t, u = document.elementFromPoint(s.clientX, s.clientY);
    g(), i && !i.el.contains(u) && (v("spill"), this.onSpill({
      dragEl: o,
      putSortable: l
    }));
  }
};
function Wl() {
}
Wl.prototype = {
  startIndex: null,
  dragStart: function(a) {
    var t = a.oldDraggableIndex;
    this.startIndex = t;
  },
  onSpill: function(a) {
    var t = a.dragEl, l = a.putSortable;
    this.sortable.captureAnimationState(), l && l.captureAnimationState();
    var o = la(this.sortable.el, this.startIndex, this.options);
    o ? this.sortable.el.insertBefore(t, o) : this.sortable.el.appendChild(t), this.sortable.animateAll(), l && l.animateAll();
  },
  drop: Xo
};
wt(Wl, {
  pluginName: "revertOnSpill"
});
function Gl() {
}
Gl.prototype = {
  onSpill: function(a) {
    var t = a.dragEl, l = a.putSortable, o = l || this.sortable;
    o.captureAnimationState(), t.parentNode && t.parentNode.removeChild(t), o.animateAll();
  },
  drop: Xo
};
wt(Gl, {
  pluginName: "removeOnSpill"
});
ye.mount(new Fs());
ye.mount(Gl, Wl);
function Ls(e, a) {
  const t = e.oldDraggableIndex ?? e.oldIndex;
  e.item.remove();
  const l = [...e.from.children].filter((o) => o.matches(a));
  e.from.insertBefore(e.item, l[t ?? l.length] ?? null);
}
function Jo(e) {
  const a = /* @__PURE__ */ new Map();
  function t(l) {
    a.get(l)?.destroy(), a.delete(l);
  }
  return $t(() => {
    for (const l of a.keys()) t(l);
  }), {
    mounted(l) {
      const o = l.querySelector(".work-field-builder") ?? l;
      a.set(l, new ye(o, {
        draggable: ".work-reorder-entry",
        handle: ".work-reorder-handle",
        forceFallback: !0,
        fallbackOnBody: !1,
        ghostClass: "work-drag-ghost",
        onEnd(d) {
          const v = d.oldDraggableIndex, p = d.newDraggableIndex;
          Ls(d, ".work-reorder-entry"), v !== void 0 && p !== void 0 && v !== p && e(v, p);
        }
      }));
    },
    unmounted: t
  };
}
const Bs = { class: "work-stack work-tight work-option-builder" }, js = { class: "work-stack work-tight" }, zs = { class: "work-stack work-tight work-small" }, qs = { class: "work-stack work-tight work-small" }, Ws = { class: "work-stack work-tight" }, Gs = { class: "work-stack work-tight work-small" }, Ks = { class: "work-row" }, Hs = { class: "work-stack work-tight work-small" }, Ys = { class: "work-row" }, Xs = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, Js = { class: "work-add-option" }, Zs = {
  key: 0,
  class: "work-muted work-small"
}, Qs = /* @__PURE__ */ $e({
  __name: "OptionsEditor",
  props: {
    field: {}
  },
  emits: ["validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = "options:" + At(), d = z(() => t.field.options ?? []), v = z(() => d.value.every((u, S) => !!u.id && d.value.findIndex((y) => y.id === u.id) === S));
    Ce(v, (u) => l("validity", u, o), { immediate: !0 }), $t(() => l("validity", !0, o));
    function p(u, S) {
      Io(d.value, u, S - u), d.value.forEach((y, b) => y.order = b);
    }
    const g = Jo(p), i = ["primary", "success", "info", "warn", "danger", "secondary"];
    function s() {
      let u = d.value.length + 1;
      for (; d.value.some((S) => S.id === `option_${u}`); ) u++;
      (t.field.options ??= []).push({ id: `option_${u}`, label: "New option", order: d.value.length });
    }
    return (u, S) => (n(), m("section", Bs, [
      S[4] || (S[4] = r("header", { class: "work-row" }, [
        r("h4", null, "Options"),
        r("span", { class: "work-muted work-small" }, "Renaming a choice keeps it selected on existing items."),
        r("span", { class: "work-spacer" })
      ], -1)),
      ft((n(), m("div", js, [
        (n(!0), m(ee, null, ue(d.value, (y, b) => (n(), m("div", {
          key: b,
          class: "work-option-row work-reorder-entry"
        }, [
          k(c(te), {
            type: "button",
            class: "work-icon-button work-reorder-handle",
            "aria-label": "Drag option; arrow keys reorder",
            onKeydown: [
              We(Oe((f) => p(b, b - 1), ["prevent"]), ["up"]),
              We(Oe((f) => p(b, b + 1), ["prevent"]), ["down"])
            ],
            severity: "secondary",
            text: "",
            size: "small"
          }, {
            default: G(() => [
              k(c(me), {
                icon: "tabler:grip-vertical",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["onKeydown"]),
          r("label", zs, [
            S[0] || (S[0] = W("Label", -1)),
            k(c(Te), {
              modelValue: y.label,
              "onUpdate:modelValue": (f) => y.label = f,
              "aria-label": "Option label"
            }, null, 8, ["modelValue", "onUpdate:modelValue"])
          ]),
          k(Ne, {
            class: "work-disclosure",
            label: "Advanced"
          }, {
            default: G(() => [
              r("label", qs, [
                S[1] || (S[1] = W("Integration identifier", -1)),
                k(c(Te), {
                  modelValue: y.id,
                  "onUpdate:modelValue": (f) => y.id = f,
                  class: "work-option-code",
                  required: "",
                  "aria-label": "Option ID"
                }, null, 8, ["modelValue", "onUpdate:modelValue"])
              ])
            ]),
            _: 2
          }, 1024),
          r("div", Ws, [
            r("label", Gs, [
              S[2] || (S[2] = W("Color", -1)),
              r("span", Ks, [
                r("span", {
                  class: vt(["work-color-swatch", "work-swatch-" + (y.color || "secondary")]),
                  "aria-hidden": "true"
                }, null, 2),
                k(c(fe), {
                  modelValue: y.color,
                  "onUpdate:modelValue": (f) => y.color = f,
                  "aria-label": "Option color",
                  appendTo: "self",
                  optionLabel: "label",
                  optionValue: "value",
                  optionDisabled: "disabled",
                  options: [{ label: "Default", value: void 0, disabled: !1 }, ...(i ?? []).map((f) => ({ label: f, value: f, disabled: !1 }))]
                }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
              ])
            ]),
            r("label", Hs, [
              S[3] || (S[3] = W("Category", -1)),
              k(c(fe), {
                "model-value": y.category,
                "aria-label": "Option category",
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                showClear: "",
                options: ["triage", "backlog", ...c(To)].map((f) => ({ label: c(Pt)(f), value: f })),
                "onUpdate:modelValue": (f) => y.category = f || void 0
              }, null, 8, ["model-value", "options", "onUpdate:modelValue"])
            ])
          ]),
          r("div", Ys, [
            k(c(te), {
              "aria-label": "Option earlier",
              severity: "secondary",
              size: "small",
              disabled: b === 0,
              onClick: (f) => p(b, b - 1),
              text: ""
            }, {
              default: G(() => [
                k(c(me), {
                  icon: "tabler:arrow-up",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["disabled", "onClick"]),
            k(c(te), {
              "aria-label": "Option later",
              severity: "secondary",
              size: "small",
              disabled: b === d.value.length - 1,
              onClick: (f) => p(b, b + 1),
              text: ""
            }, {
              default: G(() => [
                k(c(me), {
                  icon: "tabler:arrow-down",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["disabled", "onClick"]),
            k(c(te), {
              label: "Remove",
              "aria-label": "Remove option",
              severity: "secondary",
              text: "",
              size: "small",
              onClick: (f) => d.value.splice(b, 1)
            }, {
              icon: G(() => [
                k(c(me), {
                  icon: "tabler:trash",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["onClick"])
          ])
        ]))), 128)),
        v.value ? E("", !0) : (n(), m("p", Xs, "Each choice needs a unique integration identifier.")),
        r("div", Js, [
          k(c(te), {
            label: "Add option",
            severity: "secondary",
            size: "small",
            onClick: s,
            outlined: ""
          }, {
            icon: G(() => [
              k(c(me), {
                icon: "tabler:plus",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          })
        ])
      ])), [
        [c(g)]
      ]),
      d.value.length ? E("", !0) : (n(), m("p", Zs, "Add the choices people can select for this field."))
    ]));
  }
}), _s = {
  class: "work-stack",
  "aria-label": "Fields editor"
}, er = { class: "work-form-actions work-wrap" }, tr = { class: "work-stack work-tight" }, ar = {
  key: 0,
  class: "work-settings-card work-muted"
}, lr = { class: "work-muted work-small" }, or = {
  key: 0,
  class: "work-error work-small",
  role: "alert"
}, ir = { class: "work-settings-grid work-field-properties" }, nr = { class: "work-stack work-tight" }, sr = { class: "work-stack work-tight" }, rr = { class: "work-stack work-tight" }, dr = {
  key: 1,
  class: "work-stack work-tight"
}, ur = {
  key: 4,
  class: "work-stack work-tight"
}, cr = {
  key: 5,
  class: "work-stack work-tight"
}, vr = { class: "work-stack work-tight" }, fr = { class: "work-stack work-tight" }, mr = { class: "work-stack work-tight" }, pr = { class: "work-stack work-tight" }, gr = { class: "work-stack" }, br = { class: "work-stack work-tight" }, hr = { class: "work-stack work-tight" }, yr = { class: "work-stack work-tight work-field-history" }, kr = { class: "work-settings-list" }, wr = { class: "work-settings-row" }, $r = { class: "work-settings-row" }, Vr = { class: "work-stack" }, xr = /* @__PURE__ */ $e({
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
    const t = e, l = a, o = z(() => t.draft.fields ?? []), d = B("text"), v = B([]), p = z(() => (t.draft.item_types ?? []).map((K) => ({ value: K.id, label: K.title || Ae(K.id) }))), g = z(() => t.draft.item_types?.find((K) => K.id === t.itemType)), i = z(() => o.value.map((K, q) => ({ field: K, index: q })).filter(({ field: K }) => !g.value || g.value.fields.includes(K.code))), s = B(""), u = B({}), S = Jo((K, q) => {
      const M = i.value[K]?.index, de = i.value[q]?.index;
      M !== void 0 && de !== void 0 && Y(M, de - M);
    });
    function y(K) {
      return (t.draft.item_types ?? []).filter((q) => q.fields.includes(K)).map((q) => q.title || Ae(q.id));
    }
    async function b(K) {
      if (!s.value) {
        s.value = K.code;
        try {
          const q = await t.guardRemoval?.("fields", K.code);
          u.value[K.code] = q ?? "", q || wa(t.draft, "fields", K.code);
        } finally {
          s.value = "";
        }
      }
    }
    const f = Object.entries({ text: "Text", int: "Whole number", dec: "Decimal number", quantity: "Measurement", bool: "Yes or no", time: "Date or time", ref: "Reference", record: "Structured data", option: "Choice", principal: "Person or group", item: "Work item", rank: "Order", rich_text: "Formatted text", formula: "Formula", rollup: "Related item calculation", counter: "Counter" }).map(([K, q]) => ({ value: K, label: q })), w = [{ label: "None", value: "none" }, { label: "Exact matches", value: "key" }, { label: "Numeric ranges", value: "number" }], x = ["int", "dec", "quantity"], $ = z(() => new Map(t.installedTypes?.map((K) => [K.id, K]))), D = z(() => [...f, ...(t.installedTypes ?? []).map((K) => ({ value: K.id, label: K.title }))]), A = {};
    function j(K) {
      return K.type && K.type !== "value" ? K.type : K.form ?? "text";
    }
    function ae(K) {
      return K.type ? $.value.get(K.type) : void 0;
    }
    function J(K) {
      const q = ae(K)?.config_schema;
      return q && Ml(q).length ? q : void 0;
    }
    function se(K) {
      const q = ae(K);
      return !!q?.config_schema || ["dec", "quantity", "ref", "time", "record"].includes(q?.form ?? K.form ?? "") || !!K.config;
    }
    function ce(K) {
      const q = ae(K), M = q?.form ?? K.form ?? "text";
      return w.filter(({ value: de }) => de === "none" || (!q?.indexes || q.indexes.includes(de)) && M !== "record" && (de !== "number" || x.includes(M) || K.type === "option"));
    }
    function pe(K) {
      K.index && !ce(K).some((q) => q.value === K.index) && delete K.index;
    }
    function ve(K, q) {
      const M = $.value.get(q);
      if (M) {
        if (M.id === K.type) return;
        K.type = M.id, K.form = M.form, delete K.options, delete K.config, pe(K);
        return;
      }
      ae(K) && delete K.config;
      const de = { option: "text", principal: "ref", item: "ref", rank: "text", rich_text: "text", formula: "int", rollup: "int", counter: "int" };
      de[q] ? (K.type = q, K.form = de[q]) : (delete K.type, K.form = q), q !== "option" ? delete K.options : K.options ??= [], q === "rich_text" && (K.config = { format: "json" }), pe(K);
    }
    function oe(K, q) {
      K.form = q, pe(K);
    }
    function O(K, q) {
      const M = { ...K.config };
      q ? M.item_type = q : delete M.item_type, K.config = Object.keys(M).length ? M : void 0;
    }
    function Y(K, q) {
      Io(o.value, K, q);
      for (const M of t.draft.item_types ?? []) {
        const de = new Set(M.fields);
        M.fields = o.value.filter((h) => de.has(h.code)).map((h) => h.code);
      }
    }
    function F(K, q) {
      try {
        Ci(t.draft, K, q.value), delete u.value[K.code];
      } catch (M) {
        u.value[K.code] = M.message, q.value = K.code;
      }
    }
    function ne() {
      d.value = "text", v.value = g.value ? [g.value.id] : [];
    }
    function be(K) {
      const q = K.normalize("NFKD").replace(/\p{Mark}/gu, "").toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, ""), M = (/^[a-z]/.test(q) ? q : `field_${q || "new"}`).slice(0, 40);
      let de = M, h = 2;
      for (; o.value.some((C) => C.code === de); ) {
        const C = "_" + h++;
        de = M.slice(0, 40 - C.length) + C;
      }
      const P = { code: de, title: K, form: "text", cardinality: "one" };
      ve(P, d.value), (t.draft.fields ??= []).push(P);
      for (const C of t.draft.item_types ?? []) v.value.includes(C.id) && C.fields.push(de);
      g.value && !v.value.includes(g.value.id) && l("update:itemType", ""), Ie.value = de, l("created");
    }
    const Ie = B("");
    return (K, q) => (n(), m("section", _s, [
      r("div", er, [
        k(c(fe), {
          "model-value": g.value?.id ?? "",
          "aria-label": "Filter fields by item type",
          placeholder: "All item types",
          appendTo: "self",
          optionLabel: "label",
          optionValue: "value",
          options: [{ value: "", label: "All item types" }, ...p.value],
          "onUpdate:modelValue": q[0] || (q[0] = (M) => l("update:itemType", M))
        }, null, 8, ["model-value", "options"]),
        k(ha, {
          action: "Add field",
          label: "Field name",
          maxlength: 255,
          regular: "",
          "open-on-entry": e.createForItemType,
          onOpen: ne,
          onAdd: be,
          onCancel: q[3] || (q[3] = (M) => l("cancel-creation"))
        }, {
          default: G(() => [
            r("label", tr, [
              q[5] || (q[5] = W("Kind", -1)),
              k(c(fe), {
                modelValue: d.value,
                "onUpdate:modelValue": q[1] || (q[1] = (M) => d.value = M),
                "aria-label": "New field kind",
                appendTo: "self",
                options: D.value,
                optionLabel: "label",
                optionValue: "value"
              }, null, 8, ["modelValue", "options"])
            ]),
            p.value.length ? (n(), H(st, {
              key: 0,
              label: "Show on item types",
              options: p.value,
              modelValue: v.value,
              "onUpdate:modelValue": q[2] || (q[2] = (M) => v.value = M)
            }, null, 8, ["options", "modelValue"])) : E("", !0)
          ]),
          _: 1
        }, 8, ["open-on-entry"])
      ]),
      i.value.length ? E("", !0) : (n(), m("p", ar, "No fields here yet. Add a field to capture information.")),
      ft((n(), H(Za, {
        columns: "fields",
        count: i.value.length
      }, {
        default: G(() => [
          (n(!0), m(ee, null, ue(i.value, ({ field: M, index: de }) => (n(), H(Ja, {
            "route-section": "fields",
            "route-id": M.code,
            title: c(He)(M),
            "initial-open": Ie.value === M.code,
            kind: ae(M)?.title || c(f).find((h) => h.value === j(M))?.label || c(Ae)(j(M)),
            key: M.id ?? de,
            class: "work-field-row work-reorder-entry work-stack"
          }, {
            handle: G(() => [
              k(c(te), {
                type: "button",
                class: "work-reorder-handle work-icon-button",
                "aria-label": "Drag " + c(He)(M) + " or use the arrow keys to reorder",
                onKeydown: [
                  We(Oe((h) => Y(de, -1), ["prevent"]), ["up"]),
                  We(Oe((h) => Y(de, 1), ["prevent"]), ["down"])
                ],
                severity: "secondary",
                text: "",
                size: "small"
              }, {
                default: G(() => [
                  k(c(me), {
                    icon: "tabler:grip-vertical",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["aria-label", "onKeydown"])
            ]),
            flags: G(() => [
              M.track ? (n(), H(c(tt), {
                key: 0,
                class: "kx-tag-sm",
                severity: "secondary",
                value: "Tracked"
              })) : E("", !0),
              M.intervals ? (n(), H(c(tt), {
                key: 1,
                class: "kx-tag-sm",
                severity: "secondary",
                value: "Intervals"
              })) : E("", !0)
            ]),
            usage: G(() => [
              r("span", lr, R(y(M.code).length ? y(M.code).join(", ") : "Unused"), 1)
            ]),
            actions: G(() => [
              k(c(te), {
                "aria-label": "Move " + c(He)(M) + " earlier",
                severity: "secondary",
                disabled: de === 0,
                onClick: (h) => Y(de, -1),
                text: "",
                size: "small"
              }, {
                default: G(() => [
                  k(c(me), {
                    icon: "tabler:arrow-up",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["aria-label", "disabled", "onClick"]),
              k(c(te), {
                "aria-label": "Move " + c(He)(M) + " later",
                severity: "secondary",
                disabled: de === o.value.length - 1,
                onClick: (h) => Y(de, 1),
                text: "",
                size: "small"
              }, {
                default: G(() => [
                  k(c(me), {
                    icon: "tabler:arrow-down",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["aria-label", "disabled", "onClick"])
            ]),
            default: G(() => [
              u.value[M.code] ? (n(), m("p", or, R(u.value[M.code]), 1)) : E("", !0),
              (n(!0), m(ee, null, ue(e.issues?.filter((h) => h.code === M.code) ?? [], (h) => (n(), m("p", {
                key: h.what,
                class: "work-error work-small",
                role: "alert"
              }, R(c(Ya)(h)), 1))), 128)),
              r("div", ir, [
                r("label", nr, [
                  q[6] || (q[6] = W("Title", -1)),
                  k(c(Te), {
                    modelValue: M.title,
                    "onUpdate:modelValue": (h) => M.title = h,
                    "aria-label": "Field title",
                    maxlength: "255",
                    placeholder: c(He)(M)
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder"])
                ]),
                r("label", sr, [
                  q[7] || (q[7] = W("Kind", -1)),
                  k(c(fe), {
                    "aria-label": "Kind",
                    "model-value": j(M),
                    "onUpdate:modelValue": (h) => ve(M, h),
                    appendTo: "self",
                    options: D.value,
                    optionLabel: "label",
                    optionValue: "value"
                  }, null, 8, ["model-value", "onUpdate:modelValue", "options"])
                ]),
                r("label", rr, [
                  q[8] || (q[8] = W("Values allowed", -1)),
                  k(c(fe), {
                    "aria-label": "Values allowed",
                    "model-value": M.cardinality ?? "one",
                    "onUpdate:modelValue": (h) => M.cardinality = h,
                    appendTo: "self",
                    options: [{ label: "One value", value: "one" }, { label: "Multiple unique values", value: "set" }, { label: "Ordered values", value: "list" }],
                    optionLabel: "label",
                    optionValue: "value"
                  }, null, 8, ["model-value", "onUpdate:modelValue"])
                ])
              ]),
              M.type === "item" ? (n(), m("label", dr, [
                q[9] || (q[9] = W("Which items can be referenced? ", -1)),
                k(c(fe), {
                  "model-value": M.config?.item_type ?? "",
                  "aria-label": "Reference target",
                  appendTo: "self",
                  optionLabel: "label",
                  optionValue: "value",
                  options: [{ value: "", label: "Any item type" }, ...p.value],
                  "onUpdate:modelValue": (h) => O(M, h)
                }, null, 8, ["model-value", "options", "onUpdate:modelValue"]),
                q[10] || (q[10] = r("span", { class: "work-muted work-small" }, "A reference stores the selected item as a value. To show a named relationship on both items, use Links.", -1))
              ])) : E("", !0),
              J(M) ? (n(), H(Do, {
                key: M.type,
                schema: J(M),
                "model-value": M.config ?? A,
                "onUpdate:modelValue": (h) => M.config = h,
                onValidity: (h) => l("validity", "config-" + de, h)
              }, null, 8, ["schema", "model-value", "onUpdate:modelValue", "onValidity"])) : E("", !0),
              M.type === "option" ? (n(), H(Qs, {
                key: 3,
                field: M,
                onValidity: q[4] || (q[4] = (h, P) => l("validity", P, h))
              }, null, 8, ["field"])) : E("", !0),
              M.type === "formula" || M.type === "rollup" ? (n(), m("label", ur, [
                q[11] || (q[11] = W("Result type", -1)),
                k(c(fe), {
                  "model-value": M.form,
                  "onUpdate:modelValue": (h) => oe(M, h),
                  "aria-label": "Result type",
                  options: c(f).slice(0, 8),
                  optionLabel: "label",
                  optionValue: "value",
                  appendTo: "self"
                }, null, 8, ["model-value", "onUpdate:modelValue", "options"])
              ])) : E("", !0),
              M.type === "formula" ? (n(), m("label", cr, [
                q[12] || (q[12] = W("Expression", -1)),
                k(c(Te), {
                  modelValue: M.expression,
                  "onUpdate:modelValue": (h) => M.expression = h,
                  "aria-label": "Expression"
                }, null, 8, ["modelValue", "onUpdate:modelValue"])
              ])) : E("", !0),
              M.type === "rollup" ? (n(), m(ee, { key: 6 }, [
                r("label", vr, [
                  q[13] || (q[13] = W("Of", -1)),
                  k(c(Te), {
                    modelValue: M.of,
                    "onUpdate:modelValue": (h) => M.of = h,
                    "aria-label": "Related items"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                r("label", fr, [
                  q[14] || (q[14] = W("Function", -1)),
                  k(c(Te), {
                    modelValue: M.fn,
                    "onUpdate:modelValue": (h) => M.fn = h,
                    "aria-label": "Calculation"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                r("label", mr, [
                  q[15] || (q[15] = W("Field", -1)),
                  k(c(Te), {
                    modelValue: M.field,
                    "onUpdate:modelValue": (h) => M.field = h,
                    "aria-label": "Calculated field"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                r("label", pr, [
                  q[16] || (q[16] = W("Order by", -1)),
                  k(c(fe), {
                    "model-value": M.by,
                    "aria-label": "Rollup order",
                    options: ["rank", "time"],
                    showClear: "",
                    appendTo: "self",
                    "onUpdate:modelValue": (h) => M.by = h || void 0
                  }, null, 8, ["model-value", "onUpdate:modelValue"])
                ]),
                k(Bl, {
                  modelValue: M.where,
                  "onUpdate:modelValue": (h) => M.where = h,
                  draft: e.draft,
                  "board-id": e.boardId,
                  label: "Include related items when",
                  onValidity: (h) => l("validity", "rollup-" + de, h)
                }, null, 8, ["modelValue", "onUpdate:modelValue", "draft", "board-id", "onValidity"])
              ], 64)) : E("", !0),
              k(Ne, {
                class: "work-disclosure",
                label: "Advanced field settings"
              }, {
                default: G(() => [
                  r("div", gr, [
                    r("label", br, [
                      q[17] || (q[17] = W("Field identifier for integrations", -1)),
                      k(c(Te), {
                        value: M.code,
                        "aria-label": "Field code",
                        required: "",
                        pattern: "[a-z][a-z0-9_]*",
                        onInput: (h) => F(M, h.target)
                      }, null, 8, ["value", "onInput"])
                    ]),
                    r("label", hr, [
                      q[18] || (q[18] = W("Allow filters to use", -1)),
                      k(c(fe), {
                        "aria-label": "Allow filters to use",
                        "model-value": M.index ?? "none",
                        "onUpdate:modelValue": (h) => M.index = h,
                        appendTo: "self",
                        options: ce(M),
                        optionLabel: "label",
                        optionValue: "value"
                      }, null, 8, ["model-value", "onUpdate:modelValue", "options"])
                    ]),
                    r("section", yr, [
                      q[21] || (q[21] = r("h4", { class: "work-group-title" }, "History", -1)),
                      r("div", kr, [
                        r("div", wr, [
                          q[19] || (q[19] = r("div", { class: "work-row-main" }, [
                            r("strong", null, "Track changes"),
                            r("p", { class: "work-muted work-small" }, "Record each value change in the item history.")
                          ], -1)),
                          k(c(et), {
                            modelValue: M.track,
                            "onUpdate:modelValue": (h) => M.track = h,
                            "aria-label": "Track changes"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        r("div", $r, [
                          q[20] || (q[20] = r("div", { class: "work-row-main" }, [
                            r("strong", null, "Track intervals"),
                            r("p", { class: "work-muted work-small" }, "Measure how long each value stays in effect.")
                          ], -1)),
                          k(c(et), {
                            modelValue: M.intervals,
                            "onUpdate:modelValue": (h) => M.intervals = h,
                            "aria-label": "Track intervals"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ])
                      ])
                    ]),
                    !J(M) && se(M) ? (n(), H(Rt, {
                      key: 0,
                      label: "Field configuration",
                      "model-value": M.config,
                      shape: "object",
                      "onUpdate:modelValue": (h) => M.config = h,
                      onValidity: (h) => l("validity", "config-" + de, h)
                    }, null, 8, ["model-value", "onUpdate:modelValue", "onValidity"])) : E("", !0),
                    r("section", Vr, [
                      q[22] || (q[22] = r("h4", { class: "work-group-title" }, "Access", -1)),
                      (n(), m(ee, null, ue(["read", "write"], (h) => k(Oo, {
                        "board-id": e.boardId,
                        key: h,
                        label: h === "read" ? "Who can read" : "Who can edit",
                        "model-value": M.access?.[h],
                        "onUpdate:modelValue": (P) => M.access = { ...M.access, [h]: P },
                        onValidity: (P) => l("validity", "access-" + de + h, P)
                      }, null, 8, ["board-id", "label", "model-value", "onUpdate:modelValue", "onValidity"])), 64))
                    ]),
                    k(c(te), {
                      label: "Remove field",
                      severity: "danger",
                      text: "",
                      disabled: !!s.value,
                      onClick: (h) => b(M)
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
        [c(S)]
      ])
    ]));
  }
}), Cr = {
  class: "work-stack",
  "aria-label": "Item types editor"
}, Sr = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, Tr = { class: "work-definition-meta" }, Ir = { class: "work-settings-grid" }, Dr = { class: "work-stack work-tight" }, Er = { class: "work-stack work-tight" }, Ur = {
  key: 0,
  class: "work-stack work-tight"
}, Ar = { key: 1 }, Rr = { class: "work-stack work-tight" }, Pr = { class: "work-stack" }, Or = { class: "work-stack work-tight" }, Nr = {
  key: 0,
  class: "work-row work-wrap"
}, Mr = { class: "work-stack work-tight" }, Fr = {
  key: 1,
  class: "work-stack work-tight work-small"
}, Lr = {
  key: 0,
  class: "kx-empty"
}, Br = /* @__PURE__ */ $e({
  __name: "TypesEditor",
  props: {
    draft: {},
    guardRemoval: { type: Function },
    issues: {}
  },
  emits: ["create-field", "create-workflow"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = z(() => t.draft.item_types ?? []), d = B(""), v = B(""), p = B("");
    function g(w) {
      const x = w.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, ""), $ = /^[a-z]/.test(x) ? x : "type_" + (x || "new");
      let D = $.slice(0, 40), A = 2;
      for (; o.value.some((j) => j.id === D); ) {
        const j = "_" + A++;
        D = $.slice(0, 40 - j.length) + j;
      }
      return D;
    }
    function i(w) {
      const x = g(w);
      (t.draft.item_types ??= []).push({ id: x, title: w, process: t.draft.processes?.[0]?.id ?? "", fields: [] }), d.value = x;
    }
    function s(w, x) {
      const $ = w.id;
      w.id = x;
      for (const D of o.value) D.parent_types && (D.parent_types = D.parent_types.map((A) => A === $ ? x : A));
    }
    function u(w, x) {
      w.fields = x, w.inherit && (w.inherit = w.inherit.filter(($) => x.includes($)));
    }
    function S(w) {
      return (w.parent_types ?? []).filter((x) => typeof x == "string");
    }
    function y(w, x, $) {
      w.parent_types = $ && x.length ? [...x, !1] : x;
    }
    function b(w) {
      return o.value.filter((x) => x.id !== w.id && x.parent_types?.includes(w.id)).map((x) => x.title || Ae(x.id));
    }
    async function f(w) {
      if (!p.value) {
        if (b(w).length) {
          v.value = `${w.title || Ae(w.id)} is a parent type for ${b(w).join(", ")}. Remove those parent selections first.`;
          return;
        }
        p.value = w.id, v.value = "";
        try {
          const x = await t.guardRemoval?.("item_types", w.id);
          x ? v.value = x : wa(t.draft, "item_types", w.id);
        } finally {
          p.value = "";
        }
      }
    }
    return (w, x) => (n(), m("section", Cr, [
      v.value ? (n(), m("p", Sr, R(v.value), 1)) : E("", !0),
      k(Za, {
        columns: "types",
        count: o.value.length
      }, {
        default: G(() => [
          (n(!0), m(ee, null, ue(o.value, ($, D) => (n(), H(Ja, {
            "route-section": "items",
            "route-id": $.id,
            "initial-open": d.value === $.id,
            title: $.title || c(Ae)($.id),
            "kind-label": "Workflow",
            kind: e.draft.processes?.find((A) => A.id === $.process)?.name || c(Ae)($.process),
            key: D,
            class: "work-type-card"
          }, {
            usage: G(() => [
              r("span", Tr, [
                k(c(tt), {
                  class: "kx-tag-sm",
                  severity: "secondary"
                }, {
                  default: G(() => [
                    W(R($.fields.length) + " " + R($.fields.length === 1 ? "field" : "fields"), 1)
                  ]),
                  _: 2
                }, 1024),
                b($).length ? (n(), H(c(tt), {
                  key: 0,
                  class: "kx-tag-sm",
                  severity: "secondary"
                }, {
                  default: G(() => [
                    W("Parent of " + R(b($).join(", ")), 1)
                  ]),
                  _: 2
                }, 1024)) : E("", !0)
              ])
            ]),
            default: G(() => [
              (n(!0), m(ee, null, ue(e.issues?.filter((A) => A.code === "item_type " + $.id) ?? [], (A) => (n(), m("p", {
                key: A.what,
                class: "work-error work-small",
                role: "alert"
              }, R(c(Ya)(A)), 1))), 128)),
              r("div", Ir, [
                r("label", Dr, [
                  x[0] || (x[0] = W("Title", -1)),
                  k(c(Te), {
                    modelValue: $.title,
                    "onUpdate:modelValue": (A) => $.title = A,
                    placeholder: c(Ae)($.id)
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder"])
                ]),
                r("div", Er, [
                  e.draft.processes?.length ? (n(), m("label", Ur, [
                    x[1] || (x[1] = W(" Workflow ", -1)),
                    k(c(fe), {
                      modelValue: $.process,
                      "onUpdate:modelValue": (A) => $.process = A,
                      "aria-label": "Workflow",
                      required: "",
                      appendTo: "self",
                      optionLabel: "label",
                      optionValue: "value",
                      options: e.draft.processes.map((A) => ({ label: A.name || c(Ae)(A.id), value: A.id }))
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                  ])) : (n(), m("span", Ar, "Workflow")),
                  r("div", null, [
                    k(c(te), {
                      label: "Create a workflow",
                      type: "button",
                      text: "",
                      size: "small",
                      onClick: (A) => l("create-workflow", $, A)
                    }, null, 8, ["onClick"])
                  ])
                ])
              ]),
              r("div", Rr, [
                k(st, {
                  label: "Fields",
                  options: (e.draft.fields ?? []).map((A) => ({ value: A.code, label: c(He)(A) })),
                  "model-value": $.fields,
                  "onUpdate:modelValue": (A) => u($, A)
                }, null, 8, ["options", "model-value", "onUpdate:modelValue"]),
                r("div", null, [
                  k(c(te), {
                    label: "Create a field",
                    type: "button",
                    text: "",
                    size: "small",
                    onClick: (A) => l("create-field", $, A)
                  }, null, 8, ["onClick"])
                ])
              ]),
              k(Ne, {
                class: "work-disclosure",
                label: "Advanced item type settings"
              }, {
                default: G(() => [
                  r("div", Pr, [
                    r("label", Or, [
                      x[2] || (x[2] = W("Identifier", -1)),
                      k(c(Te), {
                        value: $.id,
                        onChange: (A) => s($, A.target.value),
                        required: "",
                        pattern: "[a-z][a-z0-9_]*"
                      }, null, 8, ["value", "onChange"])
                    ]),
                    x[6] || (x[6] = W()),
                    k(st, {
                      label: "Parent types",
                      options: o.value.map((A) => ({ value: A.id, label: A.title || c(Ae)(A.id) })),
                      "model-value": S($),
                      "onUpdate:modelValue": (A) => y($, A, !!$.parent_types?.includes(!1))
                    }, null, 8, ["options", "model-value", "onUpdate:modelValue"]),
                    S($).length ? (n(), m("label", Nr, [
                      k(c(et), {
                        "model-value": !!$.parent_types?.includes(!1),
                        "aria-label": "Allow top-level items",
                        "onUpdate:modelValue": (A) => y($, S($), A)
                      }, null, 8, ["model-value", "onUpdate:modelValue"]),
                      x[3] || (x[3] = W("Allow top-level items", -1))
                    ])) : E("", !0),
                    r("div", Mr, [
                      k(st, {
                        label: "Inherit from parent",
                        options: $.fields.map((A) => ({ value: A, label: c(He)(e.draft.fields?.find((j) => j.code === A) ?? { code: A }) })),
                        modelValue: $.inherit,
                        "onUpdate:modelValue": (A) => $.inherit = A
                      }, null, 8, ["options", "modelValue", "onUpdate:modelValue"]),
                      x[4] || (x[4] = r("p", { class: "work-muted work-small" }, "These fields resolve from the parent when this item has no own value.", -1))
                    ]),
                    S($).length ? (n(), m("label", Fr, [
                      x[5] || (x[5] = W("When the parent moves", -1)),
                      k(c(fe), {
                        modelValue: $.move_children,
                        "onUpdate:modelValue": (A) => $.move_children = A,
                        "aria-label": "When the parent moves",
                        appendTo: "self",
                        optionLabel: "label",
                        optionValue: "value",
                        optionDisabled: "disabled",
                        options: [{ label: "Default", value: void 0, disabled: !1 }, { label: "Move children", value: "move", disabled: !1 }, { label: "Refuse while children exist", value: "refuse", disabled: !1 }]
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ])) : E("", !0),
                    k(c(te), {
                      label: "Remove type",
                      severity: "danger",
                      text: "",
                      disabled: !!p.value,
                      onClick: (A) => f($)
                    }, null, 8, ["disabled", "onClick"])
                  ])
                ]),
                _: 2
              }, 1024)
            ]),
            _: 2
          }, 1032, ["route-id", "initial-open", "title", "kind"]))), 128)),
          o.value.length ? E("", !0) : (n(), m("p", Lr, "Add a type for the work people create, such as a delivery task or customer request.")),
          k(ha, {
            action: "Add item type",
            label: "Item type name",
            onAdd: i
          })
        ]),
        _: 1
      }, 8, ["count"])
    ]));
  }
}), jr = ".work-process-canvas>svg{height:480px;width:100%}.work-process-canvas:focus-visible{outline:var(--p-focus-ring-width) var(--p-focus-ring-style) var(--p-focus-ring-color);outline-offset:var(--p-focus-ring-offset)}.work-state-card{fill:var(--p-content-background);stroke:var(--p-content-border-color);stroke-width:1.5}.work-graph-node.work-selected .work-state-card{stroke:var(--p-primary-color);stroke-width:2.5;fill:color-mix(in srgb,var(--p-primary-color) 6%,var(--p-content-background))}.work-graph-node:focus-visible .work-state-card{stroke:var(--p-focus-ring-color);stroke-width:var(--p-focus-ring-width)}.work-process-canvas .work-edge-label{font-size:12px;fill:var(--p-text-color)}.work-process-canvas .work-edge-label-bg{fill:var(--p-content-background);stroke:var(--p-content-border-color);stroke-width:1}.work-edge-line{stroke:var(--p-primary-color);stroke-width:1.5}.work-edge-return .work-edge-line{stroke:var(--p-text-muted-color);stroke-dasharray:5 4}.work-graph-arrow{fill:context-stroke}.work-lane-line{fill:none;stroke:var(--p-text-muted-color);stroke-width:1.5;stroke-dasharray:2 4}.work-node-connector{fill:var(--p-content-background);stroke:var(--p-primary-color);stroke-width:1.5}.work-node-connector:hover,.work-node-connector:focus-visible,.work-node-connector[aria-pressed=true]{fill:var(--p-primary-color)}.work-any-transition:focus-visible text,.work-any-transition[aria-pressed=true] text{fill:var(--p-primary-color);text-decoration:underline}.work-process-legend{position:static;flex-wrap:wrap;padding:10px 16px;border-top:1px solid var(--p-content-border-color);background:var(--p-content-background)}@media(max-width:700px){.work-process-canvas>svg{height:420px}}.work-process-more{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:8px;padding:8px 16px;border-top:1px solid var(--p-content-border-color);background:var(--p-content-background);color:var(--p-text-muted-color);font-size:12px}.work-process-canvas .work-graph-edge.work-selected .work-edge-label-bg{fill:var(--p-primary-color);stroke:var(--p-primary-color)}.work-process-canvas .work-graph-edge.work-selected .work-edge-label{fill:var(--p-primary-contrast-color)}", mo = /* @__PURE__ */ new WeakSet();
function zr(e) {
  const a = e.getRootNode();
  if (a instanceof ShadowRoot && !mo.has(a)) {
    const t = e.ownerDocument.createElement("style");
    t.textContent = jr, a.append(t), mo.add(a);
  }
}
const Zo = 0.8;
function qr(e, a, t) {
  const l = Math.min(1, a.width / e.width, a.height / e.height);
  if (l >= Zo) return { zoom: l, pan: { x: (e.width - a.width / l) / 2, y: (e.height - a.height / l) / 2 } };
  const o = e.nodes.find((v) => v.state.id === t) ?? e.nodes[0], d = Math.min(1, a.width / ((o?.width ?? 190) + 64));
  return { zoom: d, pan: o ? { x: e.direction === "TB" ? o.x - a.width / d / 2 : o.x - o.width / 2 - 32, y: e.direction === "TB" ? o.y - o.height / 2 - 32 : o.y - a.height / d / 2 } : { x: 0, y: 0 } };
}
const Wr = ["onKeydown"], Gr = {
  key: 0,
  class: "work-process-instruction",
  role: "status"
}, Kr = ["viewBox"], Hr = ["id"], Yr = ["d", "marker-end"], Xr = ["aria-label", "aria-pressed", "aria-keyshortcuts", "onKeydown", "onFocus", "onClick"], Jr = ["d"], Zr = ["d", "marker-end"], Qr = ["x", "y", "width", "height"], _r = ["x", "y"], ed = ["x", "dy"], td = ["aria-label", "aria-pressed", "onClick", "onKeydown", "onFocus", "onPointerup"], ad = ["x", "y", "width", "height"], ld = ["cx", "cy"], od = ["x", "y"], id = ["x", "dy"], nd = ["x", "y"], sd = ["x", "dy"], rd = {
  key: 0,
  class: "work-limit-text"
}, dd = ["aria-label", "aria-pressed", "aria-keyshortcuts", "onFocus", "onKeydown", "onClick"], ud = ["x", "y"], cd = ["x", "dy"], vd = ["cx", "cy", "aria-label", "aria-pressed", "onFocus", "onPointerdown", "onClick", "onKeydown"], fd = ["d"], md = {
  key: 1,
  class: "work-process-more",
  role: "status"
}, pd = { class: "work-process-legend" }, gd = /* @__PURE__ */ $e({
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
    const l = e, o = t, d = At().replace(/:/g, "_"), v = B(""), p = B(), g = B();
    let i;
    const s = B(900), u = B(!1), S = z(() => s.value < 700 ? 420 : 480), y = z(() => Wi(l.process, l.draft, {
      width: s.value,
      height: S.value,
      direction: l.fitOnOpen ? "TB" : void 0
    })), b = B(1), f = B({ x: 0, y: 0 }), w = B({ x: 0, y: 0 }), x = z(() => {
      const U = Math.min(1, s.value / y.value.width);
      return l.fitOnOpen ? Math.max(Zo, U) : U;
    }), $ = z(() => ({
      width: s.value,
      height: u.value ? Math.max(S.value, Math.ceil(y.value.height * x.value)) : S.value
    })), D = z(() => y.value.nodes.filter((U) => U.x - U.width / 2 >= f.value.x && U.x + U.width / 2 <= f.value.x + $.value.width / b.value && U.y - U.height / 2 >= f.value.y && U.y + U.height / 2 <= f.value.y + $.value.height / b.value).length);
    function A() {
      u.value = !1;
      const U = qr(y.value, $.value, l.process.initial);
      b.value = U.zoom, f.value = U.pan;
    }
    const j = z(() => `${f.value.x} ${f.value.y} ${$.value.width / b.value} ${$.value.height / b.value}`), ae = z(() => y.value.nodes.find((U) => U.state.id === v.value));
    function J() {
      u.value = !0, b.value = x.value;
      const U = $.value.width / b.value, X = y.value.nodes.find((T) => T.state.id === l.process.initial);
      f.value = {
        x: y.value.width > U && X ? X.x - U / 2 : (y.value.width - U) / 2,
        y: 0
      };
    }
    function se(U) {
      l.fitOnOpen && (u.value = !1);
      const X = Math.max(0.02, Math.min(3, b.value * U)), T = 1 / b.value - 1 / X;
      f.value = { x: f.value.x + $.value.width * T / 2, y: f.value.y + $.value.height * T / 2 }, b.value = X;
    }
    function ce(U) {
      const X = $.value.width / b.value, T = $.value.height / b.value;
      (U.x - U.width / 2 < f.value.x || U.x + U.width / 2 > f.value.x + X || U.y - U.height / 2 < f.value.y || U.y + U.height / 2 > f.value.y + T) && (f.value = { x: U.x - X / 2, y: U.y - T / 2 });
    }
    function pe() {
      const U = y.value.nodes.find((X) => X.state === l.selectedState) ?? y.value.edges.find((X) => X.transition === l.selectedTransition);
      if (!U) {
        l.fitOnOpen && u.value && J();
        return;
      }
      ce(U);
    }
    Ce([y, () => l.selectedState, () => l.selectedTransition], pe, { flush: "post" });
    function ve() {
      l.fitOnOpen ? J() : A();
    }
    Ce(() => l.process.id, () => {
      K(), ve();
    }, { flush: "post" });
    function oe(U) {
      if (U.target !== p.value) return;
      (U.key === "+" || U.key === "=") && (U.preventDefault(), se(1.2)), U.key === "-" && (U.preventDefault(), se(1 / 1.2)), U.key === "0" && (U.preventDefault(), J());
      const X = 60 / b.value;
      U.key.startsWith("Arrow") && (U.preventDefault(), f.value = { x: f.value.x + (U.key === "ArrowRight" ? X : U.key === "ArrowLeft" ? -X : 0), y: f.value.y + (U.key === "ArrowDown" ? X : U.key === "ArrowUp" ? -X : 0) });
    }
    function O(U, X) {
      const T = X.currentTarget;
      if (!v.value) o("state", U, T);
      else if (v.value !== U.id) {
        const le = v.value;
        v.value = "", o("connect", le, U.id, T);
      }
    }
    function Y(U) {
      v.value = U.state.id, w.value = { x: y.value.direction === "TB" ? U.x : U.x + U.width / 2, y: y.value.direction === "TB" ? U.y + U.height / 2 : U.y };
    }
    function F(U, X) {
      if (U.pointerType === "touch" || U.button !== 0) return;
      i = U.pointerId, Y(X);
      const T = U.currentTarget;
      T.hasPointerCapture?.(U.pointerId) && T.releasePointerCapture(U.pointerId);
    }
    function ne(U, X) {
      i === U.pointerId && (i = void 0, !(!v.value || v.value === X.id) && O(X, U));
    }
    function be(U, X) {
      if ((U.key === "Enter" || U.key === " ") && (U.preventDefault(), O(X, U)), ["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp"].includes(U.key)) {
        U.preventDefault();
        const T = Array.from(g.value?.querySelectorAll(".work-graph-node") ?? []), le = y.value.nodes.findIndex((Ee) => Ee.state === X), ke = ["ArrowRight", "ArrowDown"].includes(U.key) ? 1 : -1;
        T[(le + ke + T.length) % T.length]?.focus();
      }
    }
    function Ie(U, X) {
      l.selectedTransition === X && o("removeTransition", U);
    }
    function K() {
      v.value = "", i = void 0, M.clear(), de = 0;
    }
    function q() {
      K(), o("clear");
    }
    const M = /* @__PURE__ */ new Map();
    let de = 0;
    function h(U) {
      if (!U.target.closest('[role="button"]') && (M.set(U.pointerId, { x: U.clientX, y: U.clientY }), p.value?.setPointerCapture?.(U.pointerId), M.size === 2)) {
        const [X, T] = [...M.values()];
        de = Math.hypot(X.x - T.x, X.y - T.y);
      }
    }
    function P(U) {
      const X = g.value?.getBoundingClientRect();
      if (!X?.width) return;
      if (i === U.pointerId && v.value) {
        w.value = { x: f.value.x + (U.clientX - X.left) * $.value.width / b.value / X.width, y: f.value.y + (U.clientY - X.top) * $.value.height / b.value / X.height };
        return;
      }
      const T = M.get(U.pointerId);
      if (T)
        if (M.set(U.pointerId, { x: U.clientX, y: U.clientY }), M.size === 2) {
          const [le, ke] = [...M.values()], Ee = Math.hypot(le.x - ke.x, le.y - ke.y);
          de && se(Ee / de), de = Ee;
        } else f.value = { x: f.value.x - (U.clientX - T.x) * $.value.width / b.value / X.width, y: f.value.y - (U.clientY - T.y) * $.value.height / b.value / X.height };
    }
    function C(U) {
      i === U.pointerId && (v.value = "", i = void 0);
    }
    function V(U) {
      M.delete(U.pointerId), de = 0, C(U);
    }
    function I(U) {
      U.ctrlKey && (U.preventDefault(), se(Math.exp(-U.deltaY * 0.01)));
    }
    let N;
    ka(() => {
      if (p.value && zr(p.value), typeof ResizeObserver < "u" && g.value) {
        let U = !0;
        N = new ResizeObserver(() => {
          const X = g.value?.getBoundingClientRect();
          if (!X?.width || !X.height) return;
          const T = $.value.width;
          s.value = X.width, (U || Math.abs(X.width - T) > 1) && (U ? ve() : u.value ? J() : A(), U = !1), pe();
        }), N.observe(g.value);
      }
    }), $t(() => N?.disconnect()), a({ fit: J, focus: () => p.value?.focus(), zoomIn: () => se(1.2), zoomOut: () => se(1 / 1.2) });
    function Z(U) {
      return U.category === "completed" ? "check" : U.category === "canceled" ? "x" : U.id === l.process.initial ? "arrow-bar-to-right" : { gate: "shield-check", automated: "bolt", parallel: "arrows-split" }[U.kind ?? ""] ?? "user";
    }
    return (U, X) => (n(), m("section", {
      ref_key: "canvas",
      ref: p,
      class: vt(["work-process-canvas", { "work-process-scrollable": e.fitOnOpen && u.value }]),
      "aria-label": "Process map",
      tabindex: "0",
      onKeydown: [
        oe,
        We(Oe(q, ["stop"]), ["esc"])
      ],
      onPointerdown: h,
      onPointermove: P,
      onPointerup: V,
      onPointerleave: C,
      onPointercancel: K,
      onWheel: I
    }, [
      v.value ? (n(), m("p", Gr, "Choose the next stop. Escape cancels.")) : E("", !0),
      (n(), m("svg", {
        ref_key: "svg",
        ref: g,
        style: bi({ height: $.value.height + "px" }),
        viewBox: j.value,
        role: "group",
        "aria-label": "States and transitions"
      }, [
        r("defs", null, [
          r("marker", {
            id: c(d) + "-arrow",
            viewBox: "0 0 8 8",
            refX: "7",
            refY: "4",
            markerWidth: "6",
            markerHeight: "6",
            orient: "auto"
          }, [...X[1] || (X[1] = [
            r("path", {
              d: "M0 0 L8 4 L0 8 z",
              class: "work-graph-arrow"
            }, null, -1)
          ])], 8, Hr)
        ]),
        (n(!0), m(ee, null, ue(y.value.parallels, (T) => (n(), m("path", {
          key: T.key,
          d: T.path,
          class: "work-lane-line",
          "marker-end": `url(#${c(d)}-arrow)`
        }, [
          r("title", null, "Parallel lane from " + R(c(ge)(T.state)), 1)
        ], 8, Yr))), 128)),
        (n(!0), m(ee, null, ue(y.value.edges, (T) => (n(), m("g", {
          key: T.key,
          class: vt(["work-graph-edge", ["work-edge-" + T.type, { "work-selected": e.selectedTransition === T.transition }]]),
          role: "button",
          tabindex: "0",
          "aria-label": "Edit transition " + c(ze)(T.transition),
          "aria-pressed": e.selectedTransition === T.transition,
          "aria-keyshortcuts": e.selectedTransition === T.transition ? "Delete Backspace" : void 0,
          onKeydown: [
            We((le) => Ie(le, T.transition), ["delete"]),
            We((le) => Ie(le, T.transition), ["backspace"]),
            We(Oe((le) => o("transition", T.transition, le.currentTarget), ["prevent"]), ["enter"]),
            We(Oe((le) => o("transition", T.transition, le.currentTarget), ["prevent"]), ["space"])
          ],
          onFocus: (le) => ce(T),
          onClick: (le) => o("transition", T.transition, le.currentTarget)
        }, [
          r("path", {
            d: T.path,
            class: "work-edge-hit"
          }, null, 8, Jr),
          r("path", {
            d: T.path,
            class: "work-edge-line",
            "marker-end": `url(#${c(d)}-arrow)`
          }, null, 8, Zr),
          r("rect", {
            x: T.x - T.width / 2,
            y: T.y - T.height / 2,
            width: T.width,
            height: T.height,
            rx: "6",
            class: "work-edge-label-bg"
          }, null, 8, Qr),
          r("text", {
            x: T.x,
            y: T.y - (T.lines.length - 1) * 8 + 4,
            class: "work-edge-label",
            "text-anchor": "middle"
          }, [
            (n(!0), m(ee, null, ue(T.lines, (le, ke) => (n(), m("tspan", {
              key: ke,
              x: T.x,
              dy: ke ? 16 : 0
            }, R(le), 9, ed))), 128))
          ], 8, _r)
        ], 42, Xr))), 128)),
        (n(!0), m(ee, null, ue(y.value.nodes, (T) => (n(), m("g", {
          key: T.state.id,
          class: vt(["work-graph-node", ["work-stop-" + T.state.category, { "work-selected": e.selectedState === T.state }]]),
          role: "button",
          tabindex: "0",
          "aria-label": "Edit state " + c(ge)(T.state),
          "aria-pressed": e.selectedState === T.state,
          onClick: (le) => O(T.state, le),
          onKeydown: (le) => be(le, T.state),
          onFocus: (le) => ce(T),
          onPointerup: (le) => ne(le, T.state)
        }, [
          r("rect", {
            x: T.x - T.width / 2,
            y: T.y - T.height / 2,
            width: T.width,
            height: T.height,
            rx: "10",
            class: "work-state-card"
          }, null, 8, ad),
          r("circle", {
            cx: T.x - T.width / 2 + 22,
            cy: T.y - T.height / 2 + 25,
            r: "10",
            class: "work-stop-ring"
          }, null, 8, ld),
          k(c(me), {
            icon: "tabler:" + Z(T.state),
            x: T.x - T.width / 2 + 15,
            y: T.y - T.height / 2 + 18,
            width: "14",
            height: "14",
            class: "work-stop-icon",
            "aria-hidden": "true"
          }, null, 8, ["icon", "x", "y"]),
          r("text", {
            x: T.x - T.width / 2 + 42,
            y: T.y - T.height / 2 + 29,
            class: "work-node-name"
          }, [
            (n(!0), m(ee, null, ue(T.title, (le, ke) => (n(), m("tspan", {
              key: ke,
              x: T.x - T.width / 2 + 42,
              dy: ke ? 18 : 0
            }, R(le), 9, id))), 128))
          ], 8, od),
          r("text", {
            x: T.x - T.width / 2 + 16,
            y: T.y - T.height / 2 + 33 + T.title.length * 18,
            class: "work-node-meta"
          }, [
            (n(!0), m(ee, null, ue(T.caption, (le, ke) => (n(), m("tspan", {
              key: ke,
              x: T.x - T.width / 2 + 16,
              dy: ke ? 16 : 0
            }, R(le), 9, sd))), 128)),
            e.draft.policy?.wip?.[T.state.id] ? (n(), m("tspan", rd, " · limit " + R(e.draft.policy.wip[T.state.id].limit), 1)) : E("", !0)
          ], 8, nd),
          (n(!0), m(ee, null, ue(T.badges, (le, ke) => (n(), m("g", {
            key: le.id,
            class: "work-any-transition",
            role: "button",
            tabindex: "0",
            "aria-label": "Edit transition " + c(ze)(le),
            "aria-pressed": e.selectedTransition === le,
            "aria-keyshortcuts": e.selectedTransition === le ? "Delete Backspace" : void 0,
            onFocus: (Ee) => ce(T),
            onKeydown: [
              We((Ee) => Ie(Ee, le), ["delete"]),
              We((Ee) => Ie(Ee, le), ["backspace"]),
              We(Oe((Ee) => o("transition", le, Ee.currentTarget), ["stop", "prevent"]), ["enter"]),
              We(Oe((Ee) => o("transition", le, Ee.currentTarget), ["stop", "prevent"]), ["space"])
            ],
            onClick: Oe((Ee) => o("transition", le, Ee.currentTarget), ["stop"])
          }, [
            r("text", {
              x: T.x - T.width / 2 + 16,
              y: T.y - T.height / 2 + 33 + T.title.length * 18 + T.caption.length * 16 + T.badges.slice(0, ke).reduce((Ee, Ue) => Ee + c(Qt)(c(ze)(Ue) + " works from any state").length * 18, 0),
              class: "work-node-meta"
            }, [
              (n(!0), m(ee, null, ue(c(Qt)(c(ze)(le) + " works from any state"), (Ee, Ue) => (n(), m("tspan", {
                key: Ue,
                x: T.x - T.width / 2 + 16,
                dy: Ue ? 18 : 0
              }, R(Ee), 9, cd))), 128))
            ], 8, ud)
          ], 40, dd))), 128)),
          ["completed", "canceled"].includes(T.state.category) ? E("", !0) : (n(), m("circle", {
            key: 0,
            cx: y.value.direction === "TB" ? T.x : T.x + T.width / 2,
            cy: y.value.direction === "TB" ? T.y + T.height / 2 : T.y,
            r: "9",
            class: "work-node-connector",
            role: "button",
            tabindex: "0",
            "aria-label": "Connect from " + c(ge)(T.state),
            "aria-pressed": v.value === T.state.id,
            onFocus: (le) => ce(T),
            onPointerdown: Oe((le) => F(le, T), ["stop"]),
            onClick: Oe((le) => Y(T), ["stop"]),
            onKeydown: [
              We(Oe((le) => Y(T), ["stop", "prevent"]), ["enter"]),
              We(Oe((le) => Y(T), ["stop", "prevent"]), ["space"])
            ]
          }, null, 40, vd))
        ], 42, td))), 128)),
        ae.value ? (n(), m("path", {
          key: 0,
          d: `M ${y.value.direction === "TB" ? ae.value.x : ae.value.x + ae.value.width / 2} ${y.value.direction === "TB" ? ae.value.y + ae.value.height / 2 : ae.value.y} L ${w.value.x} ${w.value.y}`,
          class: "work-connect-ghost"
        }, null, 8, fd)) : E("", !0)
      ], 12, Kr)),
      D.value < e.process.states.length ? (n(), m("div", md, [
        r("span", null, R(D.value) + " of " + R(e.process.states.length) + " states in view · Pan to see more", 1),
        u.value ? E("", !0) : (n(), H(c(te), {
          key: 0,
          label: "Fit map",
          size: "small",
          text: "",
          onClick: X[0] || (X[0] = (T) => J())
        }))
      ])) : E("", !0),
      r("div", pd, [
        r("span", null, R(e.process.states.length) + " states · " + R(Math.round(b.value * 100)) + "%", 1),
        X[2] || (X[2] = r("span", null, [
          r("i"),
          W("Transition")
        ], -1)),
        X[3] || (X[3] = r("span", null, [
          r("i", { class: "work-return-key" }),
          W("Return / loop")
        ], -1)),
        X[4] || (X[4] = r("span", null, "Drag to pan · Ctrl + scroll to zoom · Fit to reset the view", -1))
      ])
    ], 42, Wr));
  }
}), Ul = new Intl.ListFormat("en", { type: "conjunction" }), bd = new Intl.ListFormat("en", { type: "disjunction" }), hd = {
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
}, yd = { some: "At least one", every: "Every", none: "No" };
function Al(e, a) {
  const t = a.fields?.find((l) => l.code === e);
  return t ? He(t) : Ae(e);
}
function Rl(e, a, t) {
  return Array.isArray(e) ? Ul.format(e.map((l) => Rl(l, a, t))) : a === "category" && typeof e == "string" ? Pt(e) : a === "state" && typeof e == "string" ? t.processes?.flatMap((l) => l.states).find((l) => l.id === e)?.name || Ae(e) : "$actor" in ot(e) ? "the person moving the item" : "$now" in ot(e) ? "the current time" : Bt(e, t.fields?.find((l) => l.code === a));
}
function kd(e) {
  const a = ot(e.where);
  if (!(e.rel !== "blocks" || e.dir !== "inward" || a.field !== "category" || a.op !== "nin" || !Array.isArray(a.value) || a.value.length !== 2 || !a.value.includes("completed") || !a.value.includes("canceled"))) {
    if (e.q === "none") return "Requires all blockers to be resolved.";
    if (e.q === "some") return "Requires an open blocker.";
  }
}
function La(e, a) {
  const t = ot(e), l = (d) => d.map((v) => La(v, a)), o = a.relation_types?.find((d) => d.id === t.rel);
  if (Array.isArray(t.and) && t.and.length) return `(${Ul.format(l(t.and))})`;
  if (Array.isArray(t.or) && t.or.length) return `(${bd.format(l(t.or))})`;
  if (t.not) return `this condition is false (${La(t.not, a)})`;
  if (typeof t.match == "string" && t.match.trim()) return `the item matches “${t.match}”`;
  if (typeof t.rel == "string" || t.children) {
    const d = t.dir === "inward" && !o?.symmetric ? o?.inward : o?.outward, v = t.children ? "child item" : `item linked as “${d || Ae(String(t.rel))}”`;
    return `${yd[String(t.q)] ?? "At least one"} ${v} matches (${La(t.where, a)})`;
  }
  if (t.history) {
    const d = ot(t.history);
    if (typeof d.field != "string") return "a value history condition";
    const v = Al(d.field, a), p = (i) => Rl(i, String(d.field), a), g = Array.isArray(d.during) ? ` during ${Ul.format(d.during.map((i) => String(i)))}` : "";
    if (d.changed === !0) {
      const i = d.from === void 0 ? "" : ` from ${p(d.from)}`, s = d.to === void 0 ? "" : ` to ${p(d.to)}`;
      return `${v} changed${i}${s}${g}`;
    }
    return d.was !== void 0 ? `${v} was ${p(d.was)}${g}` : `a change in the history of ${v}${g}`;
  }
  if (typeof t.field == "string") {
    const d = Al(t.field, a);
    if (t.op === "is_null") return `${d} is ${t.value === !1 ? "filled" : "empty"}`;
    if (t.op === "is_state") {
      const p = { absent: "has never been filled", cleared: "was cleared", provided: "has a value" }[String(t.value)];
      if (p) return `${d} ${p}`;
    }
    const v = hd[String(t.op)];
    return v && t.value !== void 0 ? `${d} ${v} ${Rl(t.value, t.field, a)}` : `a condition on ${d}`;
  }
  return "a custom condition";
}
function wd(e, a, t, l = []) {
  const o = [], d = a.states.find((p) => p.id === e.to), v = [.../* @__PURE__ */ new Set([...e.require ?? [], ...d?.require ?? []])];
  v.length && o.push(`Required: ${v.map((p) => Al(p, t)).join(", ")}`), e.when != null && o.push(kd(ot(e.when)) ?? `Only when ${La(e.when, t)}`);
  for (const p of e.guards ?? []) {
    const g = l.find((i) => i.id === p);
    o.push(g ? `Requires the “${g.title}” check to pass` : "Requires an unavailable check to pass");
  }
  return o;
}
const $d = {
  key: 0,
  class: "work-stack work-tight work-muted work-small"
}, Qo = /* @__PURE__ */ $e({
  __name: "TransitionRules",
  props: {
    transition: {},
    process: {},
    draft: {},
    guards: {}
  },
  setup(e) {
    const a = e, t = z(() => wd(a.transition, a.process, a.draft, a.guards));
    return (l, o) => t.value.length ? (n(), m("div", $d, [
      (n(!0), m(ee, null, ue(t.value, (d, v) => (n(), m("p", { key: v }, R(d), 1))), 128))
    ])) : E("", !0);
  }
}), Vd = {
  class: "work-process-list work-stack",
  "aria-label": "Process list"
}, xd = { class: "work-table-scroll" }, Cd = {
  class: "work-settings-table work-process-table",
  role: "table",
  "aria-label": "States"
}, Sd = { role: "rowgroup" }, Td = ["aria-selected"], Id = { role: "cell" }, Dd = {
  key: 0,
  class: "work-muted work-small"
}, Ed = { role: "cell" }, Ud = { role: "cell" }, Ad = {
  role: "cell",
  class: "work-process-list-actions"
}, Rd = { class: "work-table-scroll" }, Pd = {
  class: "work-settings-table work-process-table",
  role: "table",
  "aria-label": "Transitions"
}, Od = { role: "rowgroup" }, Nd = ["aria-selected"], Md = { role: "cell" }, Fd = { role: "cell" }, Ld = { role: "cell" }, Bd = {
  role: "cell",
  class: "work-process-list-actions"
}, jd = /* @__PURE__ */ $e({
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
    return (a, t) => (n(), m("section", Vd, [
      t[6] || (t[6] = r("h3", null, "States", -1)),
      r("div", xd, [
        r("table", Cd, [
          t[2] || (t[2] = r("thead", { role: "rowgroup" }, [
            r("tr", { role: "row" }, [
              r("th", {
                role: "columnheader",
                scope: "col"
              }, "Name"),
              r("th", {
                role: "columnheader",
                scope: "col"
              }, "Phase"),
              r("th", {
                role: "columnheader",
                scope: "col"
              }, "Kind"),
              r("th", {
                role: "columnheader",
                scope: "col"
              }, "Actions")
            ])
          ], -1)),
          r("tbody", Sd, [
            (n(!0), m(ee, null, ue(e.process.states, (l) => (n(), m("tr", {
              key: l.id,
              "aria-selected": e.selectedState === l,
              role: "row"
            }, [
              r("td", Id, [
                k(c(Te), {
                  modelValue: l.name,
                  "onUpdate:modelValue": (o) => l.name = o,
                  "aria-label": "Name of " + c(ge)(l)
                }, null, 8, ["modelValue", "onUpdate:modelValue", "aria-label"]),
                e.counts ? (n(), m("p", Dd, R(e.counts[l.id] ?? 0) + " here", 1)) : E("", !0)
              ]),
              r("td", Ed, [
                t[0] || (t[0] = r("span", {
                  class: "work-process-cell-label",
                  "aria-hidden": "true"
                }, "Phase", -1)),
                W(R(c(Pt)(l.category)), 1)
              ]),
              r("td", Ud, [
                t[1] || (t[1] = r("span", {
                  class: "work-process-cell-label",
                  "aria-hidden": "true"
                }, "Kind", -1)),
                k(c(tt), { severity: "secondary" }, {
                  default: G(() => [
                    W(R(c(Ba)(l.kind)), 1)
                  ]),
                  _: 2
                }, 1024)
              ]),
              r("td", Ad, [
                k(c(te), {
                  size: "small",
                  text: "",
                  severity: "secondary",
                  "aria-label": "Edit state " + c(ge)(l),
                  onClick: (o) => a.$emit("state", l, o.currentTarget)
                }, {
                  default: G(() => [
                    k(c(me), { icon: "tabler:pencil" })
                  ]),
                  _: 1
                }, 8, ["aria-label", "onClick"]),
                k(c(te), {
                  size: "small",
                  text: "",
                  severity: "danger",
                  "aria-label": "Remove state " + c(ge)(l),
                  onClick: (o) => a.$emit("removeState", l)
                }, {
                  default: G(() => [
                    k(c(me), { icon: "tabler:trash" })
                  ]),
                  _: 1
                }, 8, ["aria-label", "onClick"])
              ])
            ], 8, Td))), 128))
          ])
        ])
      ]),
      t[7] || (t[7] = r("h3", null, "Transitions", -1)),
      r("div", Rd, [
        r("table", Pd, [
          t[5] || (t[5] = r("thead", { role: "rowgroup" }, [
            r("tr", { role: "row" }, [
              r("th", {
                role: "columnheader",
                scope: "col"
              }, "Name"),
              r("th", {
                role: "columnheader",
                scope: "col"
              }, "From"),
              r("th", {
                role: "columnheader",
                scope: "col"
              }, "To"),
              r("th", {
                role: "columnheader",
                scope: "col"
              }, "Actions")
            ])
          ], -1)),
          r("tbody", Od, [
            (n(!0), m(ee, null, ue(e.process.transitions ?? [], (l) => (n(), m("tr", {
              key: l.id,
              "aria-selected": e.selectedTransition === l,
              role: "row"
            }, [
              r("td", Md, [
                k(c(Te), {
                  modelValue: l.name,
                  "onUpdate:modelValue": (o) => l.name = o,
                  placeholder: c(ze)(l),
                  "aria-label": "Name of " + c(ze)(l)
                }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder", "aria-label"]),
                k(Qo, {
                  transition: l,
                  process: e.process,
                  draft: e.draft,
                  guards: e.guards
                }, null, 8, ["transition", "process", "draft", "guards"])
              ]),
              r("td", Fd, [
                t[3] || (t[3] = r("span", {
                  class: "work-process-cell-label",
                  "aria-hidden": "true"
                }, "From", -1)),
                W(" " + R(l.from === "any" ? "Any state" : l.from.map((o) => c(ge)(e.process.states.find((d) => d.id === o))).join(", ")), 1)
              ]),
              r("td", Ld, [
                t[4] || (t[4] = r("span", {
                  class: "work-process-cell-label",
                  "aria-hidden": "true"
                }, "To", -1)),
                W(R(c(ge)(e.process.states.find((o) => o.id === l.to))), 1)
              ]),
              r("td", Bd, [
                k(c(te), {
                  size: "small",
                  text: "",
                  severity: "secondary",
                  "aria-label": "Edit transition " + c(ze)(l),
                  onClick: (o) => a.$emit("transition", l, o.currentTarget)
                }, {
                  default: G(() => [
                    k(c(me), { icon: "tabler:pencil" })
                  ]),
                  _: 1
                }, 8, ["aria-label", "onClick"]),
                k(c(te), {
                  size: "small",
                  text: "",
                  severity: "danger",
                  "aria-label": "Remove transition " + c(ze)(l),
                  onClick: (o) => a.$emit("removeTransition", l)
                }, {
                  default: G(() => [
                    k(c(me), { icon: "tabler:trash" })
                  ]),
                  _: 1
                }, 8, ["aria-label", "onClick"])
              ])
            ], 8, Nd))), 128))
          ])
        ])
      ])
    ]));
  }
}), po = /* @__PURE__ */ $e({
  __name: "CapacityControl",
  props: {
    draft: {},
    state: {},
    label: {},
    hard: { type: Boolean }
  },
  setup(e) {
    const a = e, t = z(() => a.draft.policy?.wip?.[a.state]);
    function l(d) {
      if (d === null) {
        a.draft.policy?.wip && delete a.draft.policy.wip[a.state];
        return;
      }
      const v = a.draft.policy ??= {}, p = v.wip ??= {};
      p[a.state] = { ...p[a.state], limit: d };
    }
    function o(d) {
      t.value && (t.value.hard = d);
    }
    return (d, v) => e.hard ? (n(), H(c(et), {
      key: 0,
      "aria-label": e.label,
      disabled: !t.value,
      "model-value": t.value?.hard ?? !1,
      "onUpdate:modelValue": o
    }, null, 8, ["aria-label", "disabled", "model-value"])) : (n(), H(c(yt), {
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
async function $l(e, a) {
  try {
    const { data: t } = await Cl.get(e, a ? { params: a } : void 0);
    if (!t?.success) {
      const l = t?.message || (typeof t?.error == "string" ? t.error : t?.error?.message) || "Could not read published Flow.";
      throw new Vl({ message: l, details: t?.details }, "Published Flow");
    }
    return t;
  } catch (t) {
    throw Si(t, "Published Flow");
  }
}
const go = (e) => `/api/v1/workflows/${encodeURIComponent(e)}/versions`, Pl = {
  title: async (e) => (await $l("/api/v1/workflows/published", { id: e })).item?.title,
  versions: async (e) => (await $l(go(e))).versions ?? [],
  check: async (e) => {
    if ((await $l(`${go(e.id)}/${e.version}`)).version?.version !== e.version) throw new Error("The published version is unavailable.");
  }
}, zd = {
  class: "work-stack work-tight",
  "aria-label": "Stage Flow"
}, qd = {
  key: 0,
  class: "work-muted work-small"
}, Wd = {
  key: 1,
  class: "kx-err work-alert-actions"
}, Gd = { role: "alert" }, Kd = ["schema", "config", "title"], Hd = {
  key: 3,
  class: "kx-err",
  role: "alert"
}, Yd = {
  key: 4,
  class: "work-stack work-tight"
}, Xd = ["value", "aria-busy", "disabled"], Jd = {
  value: "",
  disabled: ""
}, Zd = ["value"], Qd = {
  key: 5,
  class: "work-muted work-small",
  role: "status"
}, _d = /* @__PURE__ */ $e({
  __name: "StageFlow",
  props: {
    modelValue: {}
  },
  emits: ["update:modelValue", "validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = B(!1), d = B(""), v = B([]), p = B(!1), g = B(""), i = B(!1), s = z(() => d.value || t.modelValue?.id), u = JSON.stringify({ properties: { flow_ref: { title: "Published Flow", picker: "wc-workflow-picker" } } }), S = z(() => JSON.stringify(t.modelValue ? { flow_ref: t.modelValue } : {}));
    let y = 0;
    async function b() {
      o.value = await Ut("wc-workflow-picker");
    }
    b();
    async function f() {
      const D = ++y, A = s.value, j = t.modelValue;
      if (p.value = !!A, g.value = "", v.value = [], !!A)
        try {
          const [ae] = await Promise.all([Pl.versions(A), !i.value && j ? Pl.check(j) : Promise.resolve()]);
          if (D !== y) return;
          if (v.value = ae.filter((J) => Number.isInteger(J.version) && J.version > 0), !i.value && j && !v.value.some((J) => J.version === j.version)) throw new Error("The published version is unavailable.");
        } catch (ae) {
          D === y && (g.value = nt(ae, "Could not read published Flow."));
        } finally {
          D === y && (p.value = !1);
        }
    }
    Ce([s, () => t.modelValue?.version, i], f, { immediate: !0 }), Ce(i, (D) => l("validity", !D), { immediate: !0 });
    function w(D) {
      const A = D.detail?.flow_ref;
      A?.kind !== "flow" || !A.id || (i.value = !0, d.value = A.id);
    }
    function x(D) {
      !s.value || !v.value.some((A) => A.version === D) || (l("update:modelValue", { kind: "flow", id: s.value, version: D }), i.value = !1, d.value = "");
    }
    function $() {
      l("update:modelValue", void 0), i.value = !1, d.value = "";
    }
    return $t(() => {
      y++, l("validity", !0);
    }), (D, A) => (n(), m("section", zd, [
      A[4] || (A[4] = r("h4", { class: "work-field-label" }, "What runs", -1)),
      e.modelValue ? E("", !0) : (n(), m("p", qd, "No Flow bound. This stage keeps its existing external execution contract.")),
      g.value ? (n(), m("div", Wd, [
        r("p", Gd, [
          W(R(i.value ? "Flow versions unavailable" : "Flow binding unavailable"), 1),
          !i.value && e.modelValue ? (n(), m(ee, { key: 0 }, [
            W(" (v" + R(e.modelValue.version) + ")", 1)
          ], 64)) : E("", !0),
          W(". " + R(g.value), 1)
        ]),
        k(c(te), {
          label: "Reload Flow",
          severity: "secondary",
          text: "",
          onClick: f
        })
      ])) : E("", !0),
      o.value ? (n(), m("wc-workflow-picker", {
        key: 2,
        schema: c(u),
        config: S.value,
        title: e.modelValue?.id,
        onChange: w
      }, null, 40, Kd)) : (n(), m("p", Hd, [
        A[2] || (A[2] = W("Published Flow picker unavailable.", -1)),
        k(c(te), {
          label: "Reload Flow picker",
          text: "",
          severity: "secondary",
          onClick: b
        })
      ])),
      s.value ? (n(), m("label", Yd, [
        A[3] || (A[3] = W(" Published version ", -1)),
        r("select", {
          class: "p-inputtext work-flow-version",
          value: i.value ? "" : e.modelValue?.version,
          "aria-busy": p.value,
          disabled: p.value || !!g.value,
          onChange: A[0] || (A[0] = (j) => x(Number(j.target.value)))
        }, [
          r("option", Jd, R(p.value ? "Loading versions…" : "Choose a published version"), 1),
          (n(!0), m(ee, null, ue(v.value, (j) => (n(), m("option", {
            key: j.version,
            value: j.version
          }, "v" + R(j.version), 9, Zd))), 128))
        ], 40, Xd)
      ])) : E("", !0),
      i.value ? (n(), m("p", Qd, "Choose a published version to finish selecting the Flow.")) : E("", !0),
      e.modelValue || i.value ? (n(), H(c(te), {
        key: 6,
        label: i.value ? "Cancel Flow selection" : "Remove Flow binding",
        "aria-label": i.value ? "Cancel Flow selection" : "Remove Flow binding",
        severity: "secondary",
        text: "",
        onClick: A[1] || (A[1] = (j) => i.value ? (i.value = !1, d.value = "") : $())
      }, null, 8, ["label", "aria-label"])) : E("", !0)
    ]));
  }
}), Ol = { seconds: 1, minutes: 60, hours: 3600, days: 86400 };
function ca(e, a) {
  const t = /^P(\d+)W$/.exec(e), l = /^P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+\.?\d*)S)?)?$/.exec(e);
  if (!t && (!l || e === "P" || e.endsWith("T"))) return;
  const o = t ? Number(t[1]) * 604800 : Number(l[1] ?? 0) * 86400 + Number(l[2] ?? 0) * 3600 + Number(l[3] ?? 0) * 60 + Number(l[4] ?? 0);
  if (!Number.isFinite(o) || o <= 0) return;
  const d = a ?? (o % 86400 === 0 ? "days" : o % 3600 === 0 ? "hours" : o < 60 ? "seconds" : "minutes");
  return { amount: o / Ol[d], unit: d };
}
function eu(e, a) {
  if (e == null) return;
  if (!Number.isFinite(e * Ol[a]) || e <= 0) throw new Error("Enter a positive duration.");
  const t = (o) => o.toLocaleString("en-US", { useGrouping: !1, maximumSignificantDigits: 21 });
  if (!Number.isInteger(e)) return `PT${t(e * Ol[a])}S`;
  const l = { seconds: "S", minutes: "M", hours: "H", days: "D" }[a];
  return (a === "days" ? "P" : "PT") + t(e) + l;
}
const tu = { class: "work-stack work-tight" }, au = {
  key: 0,
  class: "work-error",
  role: "alert"
}, zt = /* @__PURE__ */ $e({
  __name: "DurationControl",
  props: {
    modelValue: {},
    label: {},
    disabled: { type: Boolean }
  },
  emits: ["update:modelValue", "validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = "duration:" + At(), d = B(), v = B(""), p = z(() => t.modelValue ? ca(t.modelValue) : void 0), g = z(() => d.value ?? p.value?.unit ?? "days");
    Ce(() => t.modelValue, (x) => {
      v.value = "", l("validity", !x || !!p.value, o);
    }, { immediate: !0 });
    const i = z(() => t.modelValue ? ca(t.modelValue, g.value)?.amount ?? null : null);
    function s(x) {
      try {
        const $ = eu(x, g.value);
        v.value = "", l("update:modelValue", $), l("validity", !0, o);
      } catch ($) {
        v.value = $.message, l("validity", !1, o);
      }
    }
    let u;
    function S(x) {
      x.target instanceof HTMLInputElement && (u = x.target.value);
    }
    function y(x) {
      if (u === void 0) return;
      const $ = u;
      u = void 0, f(x, $);
    }
    function b(x) {
      u = void 0;
      const $ = x.originalEvent?.target instanceof HTMLInputElement ? x.originalEvent.target.value : x.formattedValue;
      f(x.value, $);
    }
    function f(x, $) {
      if ($.trim() && (typeof x != "number" || !Number.isFinite(x))) {
        v.value = "Enter a positive duration.", l("validity", !1, o);
        return;
      }
      d.value = g.value, s(typeof x == "number" ? x : null);
    }
    function w(x) {
      const $ = i.value;
      d.value = x, !(t.modelValue && !p.value) && s($);
    }
    return $t(() => l("validity", !0, o)), (x, $) => (n(), m("label", tu, [
      W(R(e.label), 1),
      r("span", {
        class: "work-duration-control",
        style: { "max-width": "360px" },
        onInputCapture: S
      }, [
        k(c(yt), {
          "model-value": i.value,
          "aria-label": e.label,
          min: 0,
          "aria-invalid": !!v.value || !!e.modelValue && !c(ca)(e.modelValue),
          disabled: e.disabled,
          useGrouping: !1,
          "max-fraction-digits": g.value === "seconds" ? 20 : 3,
          onInput: b,
          "onUpdate:modelValue": y
        }, null, 8, ["model-value", "aria-label", "aria-invalid", "disabled", "max-fraction-digits"]),
        k(c(fe), {
          "model-value": g.value,
          "aria-label": e.label + " unit",
          disabled: e.disabled,
          options: [{ label: "Seconds", value: "seconds" }, { label: "Minutes", value: "minutes" }, { label: "Hours", value: "hours" }, { label: "Days", value: "days" }],
          optionLabel: "label",
          optionValue: "value",
          appendTo: "self",
          "onUpdate:modelValue": $[0] || ($[0] = (D) => w(D))
        }, null, 8, ["model-value", "aria-label", "disabled"])
      ], 32),
      v.value || e.modelValue && !c(ca)(e.modelValue) ? (n(), m("span", au, R(v.value || `Unsupported duration: ${e.modelValue}`), 1)) : E("", !0)
    ]));
  }
}), lu = { class: "work-stack" }, ou = { class: "work-settings-grid" }, iu = { class: "work-stack work-tight" }, nu = { class: "work-stack work-tight" }, su = {
  key: 1,
  class: "work-stack work-tight"
}, ru = { class: "work-stack work-tight" }, du = { class: "work-settings-grid" }, uu = { class: "work-row" }, cu = { class: "work-stack work-tight" }, vu = {
  key: 0,
  class: "work-stack work-tight"
}, fu = /* @__PURE__ */ $e({
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
      i.push({ id: Jt("timer", i), after: "P1D", then: { emit: "reminder" } });
    }
    function v(i, s) {
      delete i.after, delete i.at_field, s === "after" ? i.after = "P1D" : i.at_field = "";
    }
    function p(i, s, u) {
      u ? i[s] = u : (delete i[s], delete i.table);
    }
    function g(i, s) {
      i.then = s === "emit" ? { emit: "" } : { transition: "" };
    }
    return (i, s) => (n(), m("section", lu, [
      s[8] || (s[8] = r("h4", null, "Timers", -1)),
      (n(!0), m(ee, null, ue(o(), (u, S) => (n(), m("article", {
        key: u.id,
        class: "work-settings-card work-stack"
      }, [
        r("div", ou, [
          r("label", iu, [
            s[2] || (s[2] = W("Timer ID", -1)),
            k(c(Te), {
              modelValue: u.id,
              "onUpdate:modelValue": (y) => u.id = y,
              required: "",
              pattern: "[a-z][a-z0-9_]*"
            }, null, 8, ["modelValue", "onUpdate:modelValue"])
          ]),
          r("label", nu, [
            s[3] || (s[3] = W("Deadline", -1)),
            k(c(fe), {
              "model-value": u.at_field !== void 0 ? "at_field" : "after",
              "onUpdate:modelValue": (y) => v(u, y),
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
          u.after !== void 0 ? (n(), H(zt, {
            key: 0,
            modelValue: u.after,
            "onUpdate:modelValue": (y) => u.after = y,
            label: "After",
            onValidity: s[0] || (s[0] = (y, b) => l("validity", b, y))
          }, null, 8, ["modelValue", "onUpdate:modelValue"])) : (n(), m("label", su, [
            s[4] || (s[4] = W("At field", -1)),
            k(c(fe), {
              modelValue: u.at_field,
              "onUpdate:modelValue": (y) => u.at_field = y,
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
          r("label", ru, [
            s[5] || (s[5] = W("Duration by field", -1)),
            k(c(fe), {
              "model-value": u.by ?? "",
              "onUpdate:modelValue": (y) => p(u, "by", y),
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
        u.by ? (n(), H(Rt, {
          key: 0,
          label: "Duration table",
          hint: "Map field values to ISO durations.",
          "model-value": u.table,
          shape: "object",
          "onUpdate:modelValue": (y) => u.table = y,
          onValidity: (y) => l("validity", "table-" + S, y)
        }, null, 8, ["model-value", "onUpdate:modelValue", "onValidity"])) : E("", !0),
        r("div", du, [
          k(zt, {
            modelValue: u.repeat,
            "onUpdate:modelValue": (y) => u.repeat = y,
            label: "Repeat every",
            onValidity: s[1] || (s[1] = (y, b) => l("validity", b, y)),
            disabled: u.interrupting
          }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"]),
          r("label", uu, [
            k(c(Wt), {
              modelValue: u.interrupting,
              "onUpdate:modelValue": [(y) => u.interrupting = y, (y) => u.interrupting && delete u.repeat],
              binary: ""
            }, null, 8, ["modelValue", "onUpdate:modelValue"]),
            s[6] || (s[6] = W("Interrupting", -1))
          ]),
          r("label", cu, [
            s[7] || (s[7] = W("Then", -1)),
            k(c(fe), {
              "model-value": u.then?.transition !== void 0 ? "transition" : "emit",
              "onUpdate:modelValue": (y) => g(u, y),
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
          u.then ? (n(), m("label", vu, [
            W(R(u.then.transition !== void 0 ? "Transition ID" : "Event name"), 1),
            u.then.transition !== void 0 ? (n(), H(c(Te), {
              key: 0,
              modelValue: u.then.transition,
              "onUpdate:modelValue": (y) => u.then.transition = y
            }, null, 8, ["modelValue", "onUpdate:modelValue"])) : (n(), H(c(Te), {
              key: 1,
              modelValue: u.then.emit,
              "onUpdate:modelValue": (y) => u.then.emit = y
            }, null, 8, ["modelValue", "onUpdate:modelValue"]))
          ])) : E("", !0)
        ]),
        k(c(te), {
          severity: "secondary",
          onClick: (y) => o().splice(S, 1),
          "aria-label": "Remove timer",
          text: "",
          size: "small"
        }, {
          default: G(() => [
            k(c(me), {
              icon: "tabler:trash",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        }, 8, ["onClick"])
      ]))), 128)),
      k(c(te), {
        label: "Add timer",
        severity: "secondary",
        onClick: d,
        outlined: ""
      }, {
        icon: G(() => [
          k(c(me), {
            icon: "tabler:plus",
            "aria-hidden": "true"
          })
        ]),
        _: 1
      })
    ]));
  }
}), mu = ["aria-label"], pu = { class: "work-stack work-tight" }, gu = {
  key: 0,
  class: "work-stack work-tight"
}, bu = /* @__PURE__ */ $e({
  __name: "PrincipalSourceEditor",
  props: {
    modelValue: {},
    draft: {},
    boardId: {},
    label: {}
  },
  emits: ["update:modelValue", "validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = z(() => Array.isArray(t.modelValue) ? "principals" : "field" in t.modelValue ? "field" : "group"), d = z(() => Array.isArray(t.modelValue) ? t.modelValue : "group" in t.modelValue && t.modelValue.group ? [{ kind: "group", id: t.modelValue.group }] : []);
    function v(g) {
      l("update:modelValue", g === "field" ? { field: "" } : g === "group" ? { group: "" } : []);
    }
    function p(g) {
      l("update:modelValue", o.value === "group" ? { group: g.at(-1)?.id ?? "" } : g);
    }
    return xo(() => l("validity", Array.isArray(t.modelValue) ? t.modelValue.length > 0 : "field" in t.modelValue ? !!t.modelValue.field : !!t.modelValue.group)), $t(() => l("validity", !0)), (g, i) => (n(), m("section", {
      class: "work-stack work-tight",
      "aria-label": e.label
    }, [
      r("label", pu, [
        W(R(e.label) + " source", 1),
        k(c(fe), {
          "model-value": o.value,
          "aria-label": e.label + " source",
          options: [{ label: "Group", value: "group" }, { label: "People and groups", value: "principals" }, { label: "Principal field", value: "field" }],
          optionLabel: "label",
          optionValue: "value",
          appendTo: "self",
          "onUpdate:modelValue": v
        }, null, 8, ["model-value", "aria-label"])
      ]),
      "field" in e.modelValue ? (n(), m("label", gu, [
        i[1] || (i[1] = W("Principal field", -1)),
        k(c(fe), {
          "model-value": e.modelValue.field,
          "aria-label": e.label + " field",
          options: e.draft.fields?.filter((s) => s.type === "principal").map((s) => ({ label: s.title || s.code, value: s.code })) ?? [],
          optionLabel: "label",
          optionValue: "value",
          appendTo: "self",
          "onUpdate:modelValue": i[0] || (i[0] = (s) => l("update:modelValue", { field: s }))
        }, null, 8, ["model-value", "aria-label", "options"])
      ])) : (n(), H(jl, {
        key: 1,
        "board-id": e.boardId,
        label: e.label,
        kinds: o.value === "group" ? "group" : "user,group,service",
        "model-value": d.value,
        "onUpdate:modelValue": p
      }, null, 8, ["board-id", "label", "kinds", "model-value"]))
    ], 8, mu));
  }
}), hu = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, yu = {
  class: "work-stack work-tight",
  "aria-label": "Approval sources"
}, ku = { class: "work-stack work-tight" }, wu = {
  key: 0,
  class: "work-stack work-tight"
}, $u = ["kinds", "placeholder", "value"], Vu = {
  key: 2,
  class: "work-muted work-small",
  role: "status"
}, xu = {
  key: 3,
  class: "work-chips"
}, Cu = {
  key: 4,
  class: "work-error work-small",
  role: "alert"
}, Su = {
  key: 5,
  class: "work-muted work-small"
}, Tu = { class: "work-row" }, Iu = { class: "work-row work-small" }, Du = /* @__PURE__ */ $e({
  __name: "ApproversEditor",
  props: {
    approvals: {},
    boardId: {}
  },
  emits: ["validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, { principalLabel: o, rememberPrincipal: d, nameError: v } = So(() => t.boardId ?? "", () => {
      const f = t.approvals.from;
      return Array.isArray(f) ? Ti(f) : "group" in f && f.group ? [{ kind: "group", id: f.group }] : [];
    }), p = B(), g = z(() => Array.isArray(t.approvals.from) ? "principals" : "field" in t.approvals.from ? "field" : "group"), i = z(() => {
      const f = t.approvals.from;
      return "group" in f && f.group ? JSON.stringify({ type: "group", principal_id: f.group }) : "{}";
    }), s = [
      { label: "Group members", value: "group" },
      { label: "People and groups", value: "principals" },
      { label: "Principal field", value: "field" }
    ], u = z(() => Array.isArray(t.approvals.from) ? t.approvals.from.some((f) => f.kind === "group") || t.approvals.from.length >= t.approvals.min : "field" in t.approvals.from ? !!t.approvals.from.field : !!t.approvals.from.group);
    xo(() => l("validity", Number.isSafeInteger(t.approvals.min) && t.approvals.min > 0 && u.value)), $t(() => l("validity", !0)), ka(async () => {
      p.value = await Ut("wc-principal-picker");
    });
    function S(f) {
      t.approvals.from = f === "group" ? { group: "" } : f === "field" ? { field: "" } : [];
    }
    function y(f) {
      const w = f.detail, x = w?.principal_id ?? w?.id;
      if (g.value === "group") {
        t.approvals.from = { group: x ?? "" };
        return;
      }
      if (!x || !Array.isArray(t.approvals.from)) return;
      const $ = { kind: w.type ?? w.kind ?? "user", id: x };
      w.label && d($, w.label), t.approvals.from.some((D) => D.id === x && D.kind === $.kind) || t.approvals.from.push($);
    }
    function b(f) {
      Array.isArray(t.approvals.from) && t.approvals.from.splice(f, 1);
    }
    return (f, w) => (n(), m(ee, null, [
      c(v) ? (n(), m("p", hu, R(c(v)), 1)) : E("", !0),
      r("section", yu, [
        r("label", ku, [
          w[4] || (w[4] = W("Approval source ", -1)),
          k(c(fe), {
            "model-value": g.value,
            "aria-label": "Approval source",
            "onUpdate:modelValue": w[0] || (w[0] = (x) => S(x)),
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            options: s
          }, null, 8, ["model-value"])
        ]),
        "field" in e.approvals.from ? (n(), m("label", wu, [
          w[5] || (w[5] = W("Principal field", -1)),
          k(c(Te), {
            modelValue: e.approvals.from.field,
            "onUpdate:modelValue": w[1] || (w[1] = (x) => e.approvals.from.field = x),
            "aria-label": "Principal field"
          }, null, 8, ["modelValue"])
        ])) : p.value ? (n(), m("wc-principal-picker", {
          key: g.value,
          kinds: g.value === "group" ? "group" : "user,group",
          placeholder: g.value === "group" ? "Select a group…" : "Select a person or group…",
          value: i.value,
          onConfigChanged: y
        }, null, 40, $u)) : (n(), m("p", Vu, R(p.value === !1 ? "The principal picker is unavailable." : "Loading approver picker…"), 1)),
        Array.isArray(e.approvals.from) ? (n(), m("div", xu, [
          (n(!0), m(ee, null, ue(e.approvals.from, (x, $) => (n(), H(c(tt), {
            key: x.kind + ":" + x.id,
            class: "kx-tag-sm",
            severity: "secondary"
          }, {
            default: G(() => [
              W(R(c(o)(x)), 1),
              k(c(te), {
                "aria-label": "Remove approver " + ($ + 1),
                text: "",
                severity: "secondary",
                size: "small",
                onClick: (D) => b($)
              }, {
                default: G(() => [
                  k(c(me), {
                    icon: "tabler:x",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["aria-label", "onClick"])
            ]),
            _: 2
          }, 1024))), 128))
        ])) : E("", !0),
        Array.isArray(e.approvals.from) && !u.value ? (n(), m("p", Cu, "Select at least " + R(e.approvals.min) + " distinct principals, or lower the minimum.", 1)) : "group" in e.approvals.from && !e.approvals.from.group ? (n(), m("p", Su, "Choose the group that can approve this state.")) : E("", !0),
        r("label", Tu, [
          w[6] || (w[6] = r("span", { class: "work-spacer" }, "Approvals needed", -1)),
          k(c(yt), {
            modelValue: e.approvals.min,
            "onUpdate:modelValue": w[2] || (w[2] = (x) => e.approvals.min = x),
            min: 1,
            required: "",
            useGrouping: !1
          }, null, 8, ["modelValue"])
        ]),
        r("label", Iu, [
          w[7] || (w[7] = r("span", { class: "work-spacer" }, "The person who moves the item here cannot approve this visit", -1)),
          k(c(et), {
            modelValue: e.approvals.prevent_self,
            "onUpdate:modelValue": w[3] || (w[3] = (x) => e.approvals.prevent_self = x),
            "aria-label": "The person who moves the item here cannot approve this visit"
          }, null, 8, ["modelValue"])
        ])
      ])
    ], 64));
  }
}), Eu = {
  class: "work-state-settings work-stack",
  "aria-label": "State settings"
}, Uu = { class: "work-process-kind" }, Au = { class: "work-stack" }, Ru = { class: "work-row" }, Pu = { class: "work-row" }, Ou = { class: "work-row" }, Nu = { class: "work-stack work-tight" }, Mu = { class: "work-row" }, Fu = { class: "work-stack work-tight" }, Lu = { class: "work-row" }, Bu = { class: "work-row" }, ju = { class: "work-stack work-tight" }, zu = { class: "work-stack" }, qu = { class: "work-row" }, Wu = { class: "work-row" }, Gu = { class: "work-stack work-tight" }, Ku = { class: "work-stack work-tight" }, Hu = {
  key: 0,
  class: "work-row"
}, Yu = { class: "work-stack" }, Xu = { class: "work-stack work-tight" }, Ju = { class: "work-row" }, Zu = /* @__PURE__ */ $e({
  __name: "StateSettings",
  props: {
    state: {},
    process: {},
    draft: {},
    boardId: {}
  },
  emits: ["validity", "kind"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = z(() => (t.process.transitions ?? []).filter((g) => g.from === "any" || g.from.includes(t.state.id))), d = [{ value: "human", icon: "user" }, { value: "gate", icon: "shield-check" }, { value: "automated", icon: "bolt" }, { value: "parallel", icon: "arrows-split" }];
    function v(g) {
      const i = t.state;
      i.kind = g, delete i.run, delete i.release_when, delete i.regions, delete i.join, delete i.due, (g === "automated" || g === "gate") && delete i.awaiting, g === "automated" && (i.run = { stage: i.id, retry: { max: 1, backoff: "PT1M" } }), g === "gate" && (i.release_when = { approvals: { min: 1, from: { group: "" }, prevent_self: !0 } }), g === "parallel" && (i.regions = [{ id: "region_1", initial: t.process.states.find((s) => s.id !== i.id)?.id ?? "" }], i.join = "all"), l("kind", g);
    }
    function p(g) {
      t.state.run && (g ? t.state.run.on_fail = g : delete t.state.run.on_fail);
    }
    return (g, i) => (n(), m("section", Eu, [
      i[57] || (i[57] = r("h4", { class: "work-process-group" }, "Who moves the item on", -1)),
      k(c(Fl), {
        class: "work-process-kinds",
        "model-value": e.state.kind ?? "human",
        options: d.map((s) => ({
          ...s,
          label: c(Ba)(s.value)
        })),
        optionLabel: "label",
        optionValue: "value",
        optionDisabled: "disabled",
        "allow-empty": !1,
        "aria-label": "Who moves the item on",
        "onUpdate:modelValue": v
      }, {
        option: G(({ option: s }) => [
          r("span", Uu, [
            k(c(me), {
              icon: "tabler:" + s.icon
            }, null, 8, ["icon"]),
            r("span", null, R(s.label), 1)
          ])
        ]),
        _: 1
      }, 8, ["model-value", "options"]),
      e.state.kind === "gate" && e.state.release_when ? (n(), m(ee, { key: 0 }, [
        i[35] || (i[35] = r("h4", { class: "work-process-group" }, "Approval", -1)),
        e.state.release_when.approvals ? (n(), H(Du, {
          key: 0,
          "board-id": e.boardId,
          approvals: e.state.release_when.approvals,
          onValidity: i[0] || (i[0] = (s) => l("validity", "approvers", s))
        }, null, 8, ["board-id", "approvals"])) : E("", !0),
        k(Ne, {
          class: "work-process-options",
          label: "Release options"
        }, {
          default: G(() => [
            r("div", Au, [
              r("label", Ru, [
                i[34] || (i[34] = r("span", { class: "work-spacer" }, "Require approvals", -1)),
                k(c(et), {
                  "model-value": !!e.state.release_when.approvals,
                  "aria-label": "Require approvals",
                  "onUpdate:modelValue": i[1] || (i[1] = (s) => e.state.release_when.approvals = s ? { min: 1, from: { group: "" }, prevent_self: !0 } : void 0)
                }, null, 8, ["model-value"])
              ]),
              k(zt, {
                modelValue: e.state.release_when.wait,
                "onUpdate:modelValue": i[2] || (i[2] = (s) => e.state.release_when.wait = s),
                label: "Wait before release",
                onValidity: i[3] || (i[3] = (s, u) => l("validity", u, s))
              }, null, 8, ["modelValue"]),
              k(Bl, {
                label: "Release when",
                draft: e.draft,
                "board-id": e.boardId,
                modelValue: e.state.release_when.when,
                "onUpdate:modelValue": i[4] || (i[4] = (s) => e.state.release_when.when = s),
                onValidity: i[5] || (i[5] = (s) => l("validity", "release", s))
              }, null, 8, ["draft", "board-id", "modelValue"])
            ])
          ]),
          _: 1
        })
      ], 64)) : E("", !0),
      i[58] || (i[58] = r("h4", { class: "work-process-group" }, "Limit", -1)),
      r("label", Pu, [
        i[36] || (i[36] = r("span", { class: "work-spacer" }, "Items allowed here", -1)),
        k(po, {
          draft: e.draft,
          state: e.state.id,
          label: "Items allowed here"
        }, null, 8, ["draft", "state"])
      ]),
      r("label", Ou, [
        i[37] || (i[37] = r("span", { class: "work-spacer" }, [
          W("Refuse moves over the limit"),
          r("small", { class: "work-muted work-block" }, "Off only warns")
        ], -1)),
        k(po, {
          draft: e.draft,
          state: e.state.id,
          label: "Refuse moves over the limit",
          hard: ""
        }, null, 8, ["draft", "state"])
      ]),
      i[59] || (i[59] = r("h4", { class: "work-process-group" }, "Required on entry", -1)),
      k(st, {
        label: "Required fields",
        options: e.draft.fields?.map((s) => ({ value: s.code, label: s.title || s.code })) ?? [],
        modelValue: e.state.require,
        "onUpdate:modelValue": i[6] || (i[6] = (s) => e.state.require = s)
      }, null, 8, ["options", "modelValue"]),
      !e.state.kind || e.state.kind === "human" ? (n(), H(zt, {
        key: 1,
        modelValue: e.state.due,
        "onUpdate:modelValue": i[7] || (i[7] = (s) => e.state.due = s),
        label: "Time allowed in this state",
        onValidity: i[8] || (i[8] = (s, u) => l("validity", u, s))
      }, null, 8, ["modelValue"])) : E("", !0),
      e.state.kind === "automated" && e.state.run ? (n(), m(ee, { key: 2 }, [
        i[46] || (i[46] = r("h4", { class: "work-process-group" }, "Automation", -1)),
        r("label", Nu, [
          i[38] || (i[38] = W("Run label", -1)),
          k(c(Te), {
            modelValue: e.state.run.stage,
            "onUpdate:modelValue": i[9] || (i[9] = (s) => e.state.run.stage = s),
            "aria-label": "Run label",
            required: ""
          }, null, 8, ["modelValue"])
        ]),
        k(_d, {
          modelValue: e.state.run.flow_ref,
          "onUpdate:modelValue": i[10] || (i[10] = (s) => e.state.run.flow_ref = s),
          onValidity: i[11] || (i[11] = (s) => l("validity", "flow", s))
        }, null, 8, ["modelValue"]),
        k(zt, {
          modelValue: e.state.run.timeout,
          "onUpdate:modelValue": i[12] || (i[12] = (s) => e.state.run.timeout = s),
          label: "Attempt timeout",
          onValidity: i[13] || (i[13] = (s, u) => l("validity", u, s))
        }, null, 8, ["modelValue"]),
        i[47] || (i[47] = r("small", { class: "work-muted" }, "Blank uses the board timeout, or one hour.", -1)),
        r("label", Mu, [
          i[39] || (i[39] = r("span", { class: "work-spacer" }, "Maximum visits", -1)),
          k(c(yt), {
            "model-value": e.state.run.max_visits ?? null,
            "aria-label": "Maximum visits",
            min: 1,
            useGrouping: !1,
            placeholder: "Board default",
            "onUpdate:modelValue": i[14] || (i[14] = (s) => e.state.run.max_visits = s ?? void 0)
          }, null, 8, ["model-value"])
        ]),
        r("label", Fu, [
          i[40] || (i[40] = W("When visits are exhausted", -1)),
          k(c(fe), {
            "model-value": e.state.run.on_exhausted,
            "aria-label": "When visits are exhausted",
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            showClear: "",
            options: (e.process.transitions ?? []).filter((s) => !s.auto).map((s) => ({ label: c(ze)(s), value: s.id })),
            "onUpdate:modelValue": i[15] || (i[15] = (s) => e.state.run.on_exhausted = s || void 0)
          }, null, 8, ["model-value", "options"])
        ]),
        i[48] || (i[48] = r("small", { class: "work-muted" }, "Blank records a failed run and stops automation. A route must leave every incoming state or be global.", -1)),
        r("label", Lu, [
          i[41] || (i[41] = r("span", { class: "work-spacer" }, "Retry if it fails", -1)),
          k(c(et), {
            "model-value": !!e.state.run.retry,
            "aria-label": "Retry if it fails",
            "onUpdate:modelValue": i[16] || (i[16] = (s) => e.state.run.retry = s ? { max: 1, backoff: "PT1M" } : void 0)
          }, null, 8, ["model-value"])
        ]),
        e.state.run.retry ? (n(), m(ee, { key: 0 }, [
          r("label", Bu, [
            i[42] || (i[42] = r("span", { class: "work-spacer" }, "Maximum attempts", -1)),
            k(c(yt), {
              modelValue: e.state.run.retry.max,
              "onUpdate:modelValue": i[17] || (i[17] = (s) => e.state.run.retry.max = s),
              min: 1,
              useGrouping: !1
            }, null, 8, ["modelValue"])
          ]),
          k(zt, {
            modelValue: e.state.run.retry.backoff,
            "onUpdate:modelValue": i[18] || (i[18] = (s) => e.state.run.retry.backoff = s),
            label: "Wait between attempts",
            onValidity: i[19] || (i[19] = (s, u) => l("validity", u, s))
          }, null, 8, ["modelValue"])
        ], 64)) : E("", !0),
        (n(), m(ee, null, ue([{ key: "on_pass", label: "On success" }, { key: "on_cancel", label: "On cancellation" }], (s) => r("label", {
          key: s.key,
          class: "work-stack work-tight"
        }, [
          W(R(s.label), 1),
          k(c(fe), {
            "model-value": e.state.run[s.key],
            "aria-label": s.label,
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            showClear: "",
            options: o.value.map((u) => ({ label: c(ze)(u), value: u.id })),
            "onUpdate:modelValue": (u) => e.state.run[s.key] = u || void 0
          }, null, 8, ["model-value", "aria-label", "options", "onUpdate:modelValue"])
        ])), 64)),
        r("label", ju, [
          i[43] || (i[43] = W("If it fails, go to", -1)),
          k(c(fe), {
            "aria-label": "If it fails, go to",
            "model-value": e.state.run.on_fail,
            "onUpdate:modelValue": p,
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            showClear: "",
            options: o.value.map((s) => ({
              label: c(ze)(s) + " → " + c(ge)(e.process.states.find((u) => u.id === s.to)),
              value: s.id
            }))
          }, null, 8, ["model-value", "options"])
        ]),
        k(Ne, {
          class: "work-disclosure",
          label: "Board automation defaults"
        }, {
          default: G(() => [
            r("div", zu, [
              i[45] || (i[45] = r("p", { class: "work-muted" }, "These values apply to automated states without their own limit.", -1)),
              k(zt, {
                "model-value": e.draft.policy?.stage_timeout,
                label: "Default attempt timeout",
                "onUpdate:modelValue": i[20] || (i[20] = (s) => (e.draft.policy ??= {}).stage_timeout = s),
                onValidity: i[21] || (i[21] = (s, u) => l("validity", u, s))
              }, null, 8, ["model-value"]),
              r("label", qu, [
                i[44] || (i[44] = r("span", { class: "work-spacer" }, "Default maximum visits", -1)),
                k(c(yt), {
                  "model-value": e.draft.policy?.stage_max_visits ?? null,
                  "aria-label": "Default maximum visits",
                  min: 1,
                  useGrouping: !1,
                  placeholder: "5",
                  "onUpdate:modelValue": i[22] || (i[22] = (s) => (e.draft.policy ??= {}).stage_max_visits = s ?? void 0)
                }, null, 8, ["model-value"])
              ])
            ])
          ]),
          _: 1
        })
      ], 64)) : E("", !0),
      e.state.kind === "parallel" && e.state.regions ? (n(), m(ee, { key: 3 }, [
        i[53] || (i[53] = r("h4", { class: "work-process-group" }, "Lanes", -1)),
        (n(!0), m(ee, null, ue(e.state.regions, (s, u) => (n(), m("div", {
          key: u,
          class: "work-process-value work-stack work-tight"
        }, [
          r("div", Wu, [
            r("span", null, "Lane " + R(u + 1), 1),
            i[49] || (i[49] = r("span", { class: "work-spacer" }, null, -1)),
            k(c(te), {
              severity: "danger",
              text: "",
              size: "small",
              "aria-label": "Remove lane",
              onClick: (S) => e.state.regions.splice(u, 1)
            }, {
              default: G(() => [
                k(c(me), { icon: "tabler:trash" })
              ]),
              _: 1
            }, 8, ["onClick"])
          ]),
          r("label", Gu, [
            i[50] || (i[50] = W("Starts at", -1)),
            k(c(fe), {
              "aria-label": "Lane starts at",
              modelValue: s.initial,
              "onUpdate:modelValue": (S) => s.initial = S,
              appendTo: "self",
              optionLabel: "label",
              optionValue: "value",
              options: e.process.states.filter((S) => S.id !== e.state.id).map((S) => ({ label: c(ge)(S), value: S.id }))
            }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
          ])
        ]))), 128)),
        k(c(te), {
          label: "Add lane",
          severity: "secondary",
          outlined: "",
          size: "small",
          onClick: i[23] || (i[23] = (s) => e.state.regions.push({
            id: c(Jt)("region", e.state.regions),
            initial: e.process.states.find((u) => u.id !== e.state.id)?.id ?? ""
          }))
        }, {
          icon: G(() => [
            k(c(me), { icon: "tabler:plus" })
          ]),
          _: 1
        }),
        r("label", Ku, [
          i[51] || (i[51] = W("Finish rule", -1)),
          k(c(fe), {
            "model-value": typeof e.state.join == "number" ? "count" : e.state.join ?? "all",
            appendTo: "self",
            options: [
              { label: "All must pass", value: "all" },
              { label: "Any may pass", value: "any" },
              { label: "A number must pass", value: "count" }
            ],
            optionLabel: "label",
            optionValue: "value",
            "onUpdate:modelValue": i[24] || (i[24] = (s) => e.state.join = s === "count" ? 1 : s)
          }, null, 8, ["model-value"])
        ]),
        typeof e.state.join == "number" ? (n(), m("label", Hu, [
          i[52] || (i[52] = r("span", { class: "work-spacer" }, "Lanes needed", -1)),
          k(c(yt), {
            modelValue: e.state.join,
            "onUpdate:modelValue": i[25] || (i[25] = (s) => e.state.join = s),
            min: 1,
            max: e.state.regions.length,
            useGrouping: !1
          }, null, 8, ["modelValue", "max"])
        ])) : E("", !0)
      ], 64)) : E("", !0),
      k(Ne, {
        class: "work-disclosure",
        label: "Advanced state settings"
      }, {
        default: G(() => [
          r("div", Yu, [
            i[56] || (i[56] = r("h4", { class: "work-process-group" }, "Assignment and conditions", -1)),
            r("label", Xu, [
              i[54] || (i[54] = W("Stage label", -1)),
              k(c(Te), {
                "model-value": e.state.stage,
                "aria-label": "Stage label",
                "onUpdate:modelValue": i[26] || (i[26] = (s) => e.state.stage = s || void 0)
              }, null, 8, ["model-value"])
            ]),
            !e.state.kind || e.state.kind === "human" || e.state.kind === "parallel" ? (n(), m(ee, { key: 0 }, [
              r("label", Ju, [
                k(c(et), {
                  "model-value": !!e.state.awaiting,
                  "aria-label": "Awaiting people",
                  "onUpdate:modelValue": i[27] || (i[27] = (s) => e.state.awaiting = s ? { group: "" } : void 0)
                }, null, 8, ["model-value"]),
                i[55] || (i[55] = W("Awaiting people", -1))
              ]),
              e.state.awaiting ? (n(), H(bu, {
                key: 0,
                modelValue: e.state.awaiting,
                "onUpdate:modelValue": i[28] || (i[28] = (s) => e.state.awaiting = s),
                draft: e.draft,
                "board-id": e.boardId,
                label: "Awaiting",
                onValidity: i[29] || (i[29] = (s) => l("validity", "awaiting", s))
              }, null, 8, ["modelValue", "draft", "board-id"])) : E("", !0)
            ], 64)) : E("", !0),
            k(jl, {
              "board-id": e.boardId,
              modelValue: e.state.assign,
              "onUpdate:modelValue": i[30] || (i[30] = (s) => e.state.assign = s),
              label: "Assign to"
            }, null, 8, ["board-id", "modelValue"]),
            k(Rt, {
              label: "State checks",
              example: ["installed-check"],
              "model-value": e.state.invariants,
              shape: "array",
              "onUpdate:modelValue": i[31] || (i[31] = (s) => e.state.invariants = s),
              onValidity: i[32] || (i[32] = (s) => l("validity", "invariants", s))
            }, null, 8, ["model-value"]),
            k(fu, {
              state: e.state,
              draft: e.draft,
              onValidity: i[33] || (i[33] = (s, u) => l("validity", "timer-" + s, u))
            }, null, 8, ["state", "draft"])
          ])
        ]),
        _: 1
      })
    ]));
  }
}), Qu = { class: "work-stack work-transition-settings" }, _u = { class: "work-stack work-tight" }, ec = { class: "work-row" }, tc = { key: 0 }, ac = { class: "work-stack" }, lc = { class: "work-row" }, oc = { class: "work-row" }, ic = { class: "work-stack work-tight" }, nc = { class: "work-row" }, sc = { class: "work-stack work-tight" }, rc = { class: "work-stack work-tight" }, dc = /* @__PURE__ */ $e({
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
    function d(i, s) {
      const u = t.transition.set?.[i];
      !u || !t.transition.set || (t.transition.set[i] = { field: u.field, ...s === "clear" ? { clear: !0 } : s === "copy" ? { copy: "" } : { value: "" } });
    }
    function v(i) {
      return !i || typeof i != "object" || !("field" in i) || typeof i.field != "string" ? !1 : "clear" in i ? i.clear === !0 && !("copy" in i) && !("value" in i) : "copy" in i ? typeof i.copy == "string" && !("value" in i) : "value" in i;
    }
    function p(i) {
      if (i !== void 0 && (!Array.isArray(i) || !i.every(v)))
        return "Each effect needs a field and exactly one of value, clear (true), or copy (a source field).";
      t.transition.set = i;
    }
    function g(i) {
      if (i !== void 0 && (!Array.isArray(i) || !i.every((s) => typeof s == "string")))
        return "Enter guard IDs as strings.";
      t.transition.guards = i;
    }
    return (i, s) => (n(), m("div", Qu, [
      r("label", _u, [
        s[13] || (s[13] = W("To state", -1)),
        k(c(fe), {
          modelValue: e.transition.to,
          "onUpdate:modelValue": s[0] || (s[0] = (u) => e.transition.to = u),
          "aria-label": "To state",
          appendTo: "self",
          optionLabel: "label",
          optionValue: "value",
          options: e.process.states.map((u) => ({ label: c(ge)(u), value: u.id }))
        }, null, 8, ["modelValue", "options"])
      ]),
      r("label", ec, [
        s[14] || (s[14] = r("span", { class: "work-spacer" }, "Works from any state", -1)),
        k(c(et), {
          "model-value": e.transition.from === "any",
          "aria-label": "Works from any state",
          "onUpdate:modelValue": s[1] || (s[1] = (u) => e.transition.from = u ? "any" : [])
        }, null, 8, ["model-value"])
      ]),
      e.transition.from !== "any" ? (n(), H(st, {
        key: 0,
        label: "From states",
        options: e.process.states.map((u) => ({ value: u.id, label: c(ge)(u) })),
        modelValue: e.transition.from,
        "onUpdate:modelValue": s[2] || (s[2] = (u) => e.transition.from = u)
      }, null, 8, ["options", "modelValue"])) : E("", !0),
      s[22] || (s[22] = r("h4", { class: "work-process-group" }, "Must be filled", -1)),
      k(st, {
        label: "Required fields",
        options: e.draft.fields?.map((u) => ({ value: u.code, label: u.title || u.code })) ?? [],
        modelValue: e.transition.require,
        "onUpdate:modelValue": s[3] || (s[3] = (u) => e.transition.require = u)
      }, null, 8, ["options", "modelValue"]),
      s[23] || (s[23] = r("h4", { class: "work-process-group" }, "Only when", -1)),
      k(Bl, {
        label: "Allow this transition when",
        draft: e.draft,
        "board-id": e.boardId,
        "model-value": e.transition.when,
        "onUpdate:modelValue": s[4] || (s[4] = (u) => e.transition.when = u),
        onValidity: s[5] || (s[5] = (u) => l("validity", "when", u))
      }, null, 8, ["draft", "board-id", "model-value"]),
      e.guards?.length || e.transition.guards?.length ? (n(), H(st, {
        key: 1,
        label: "Installed checks",
        options: [...(e.guards ?? []).map((u) => ({ value: u.id, label: u.title })), ...(e.transition.guards ?? []).filter((u) => !e.guards?.some((S) => S.id === u)).map((u) => ({ value: u, label: e.guards ? "Unavailable check" : "Configured check" }))],
        modelValue: e.transition.guards,
        "onUpdate:modelValue": s[6] || (s[6] = (u) => e.transition.guards = u)
      }, null, 8, ["options", "modelValue"])) : E("", !0),
      (n(!0), m(ee, null, ue(e.guards?.filter((u) => e.transition.guards?.includes(u.id)) ?? [], (u) => (n(), m("p", {
        key: u.id,
        class: "work-muted work-small"
      }, [
        W(R(u.description || u.title + " can stop this transition.") + " ", 1),
        u.reads?.length ? (n(), m("span", tc, " Checks " + R(u.reads.map((S) => e.draft.fields?.find((y) => y.code === S)?.title || "a configured field").join(", ")) + ".", 1)) : E("", !0)
      ]))), 128)),
      k(Ne, {
        class: "work-disclosure",
        label: "Advanced transition settings"
      }, {
        default: G(() => [
          r("div", ac, [
            r("label", lc, [
              s[15] || (s[15] = r("span", { class: "work-spacer" }, "Happens automatically", -1)),
              k(c(et), {
                "model-value": e.transition.auto,
                "onUpdate:modelValue": s[7] || (s[7] = (u) => {
                  e.transition.auto = u, u || delete e.transition.default;
                }),
                "aria-label": "Automatic transition"
              }, null, 8, ["model-value"])
            ]),
            r("label", oc, [
              s[16] || (s[16] = r("span", { class: "work-spacer" }, "Default automatic transition", -1)),
              k(c(et), {
                modelValue: e.transition.default,
                "onUpdate:modelValue": s[8] || (s[8] = (u) => e.transition.default = u),
                disabled: !e.transition.auto,
                "aria-label": "Default transition"
              }, null, 8, ["modelValue", "disabled"])
            ]),
            s[21] || (s[21] = r("h4", { class: "work-process-group" }, "Also sets", -1)),
            (n(!0), m(ee, null, ue(e.transition.set ?? [], (u, S) => (n(), m("div", {
              key: S,
              class: "work-process-value work-stack work-tight"
            }, [
              r("label", ic, [
                s[17] || (s[17] = W("Field", -1)),
                k(c(fe), {
                  modelValue: u.field,
                  "onUpdate:modelValue": (y) => u.field = y,
                  appendTo: "self",
                  optionLabel: "label",
                  optionValue: "value",
                  options: e.draft.fields?.map((y) => ({ value: y.code, label: y.title || y.code })) ?? []
                }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
              ]),
              r("div", nc, [
                k(c(fe), {
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
                  "onUpdate:modelValue": (y) => d(S, y)
                }, null, 8, ["model-value", "onUpdate:modelValue"]),
                k(c(te), {
                  text: "",
                  severity: "danger",
                  "aria-label": "Remove value " + (S + 1),
                  onClick: (y) => e.transition.set?.splice(S, 1)
                }, {
                  default: G(() => [
                    k(c(me), { icon: "tabler:trash" })
                  ]),
                  _: 1
                }, 8, ["aria-label", "onClick"])
              ]),
              u.copy !== void 0 ? (n(), H(c(fe), {
                key: 0,
                modelValue: u.copy,
                "onUpdate:modelValue": (y) => u.copy = y,
                "aria-label": "Copy from field",
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                options: e.draft.fields?.map((y) => ({ value: y.code, label: y.title || y.code })) ?? []
              }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])) : u.clear ? E("", !0) : (n(!0), m(ee, { key: 1 }, ue(e.draft.fields?.filter((y) => y.code === u.field) ?? [], (y) => (n(), H(Po, {
                key: y.code,
                "board-id": e.boardId ?? "",
                field: y,
                modelValue: u.value,
                "onUpdate:modelValue": (b) => u.value = b,
                onValidity: (b) => l("validity", "effect-" + S, b)
              }, null, 8, ["board-id", "field", "modelValue", "onUpdate:modelValue", "onValidity"]))), 128))
            ]))), 128)),
            k(c(te), {
              label: "Add value",
              severity: "secondary",
              outlined: "",
              size: "small",
              onClick: o
            }, {
              icon: G(() => [
                k(c(me), { icon: "tabler:plus" })
              ]),
              _: 1
            }),
            r("label", sc, [
              s[18] || (s[18] = W("Offer to people", -1)),
              k(c(fe), {
                "model-value": e.transition.people,
                "aria-label": "Offer to people",
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                options: [{ label: "Work default", value: void 0 }, { label: "Offer explicitly", value: !0 }, { label: "Process engine only", value: !1 }],
                "onUpdate:modelValue": s[9] || (s[9] = (u) => e.transition.people = u)
              }, null, 8, ["model-value"]),
              s[19] || (s[19] = r("span", { class: "work-muted work-small" }, "Work default can hide a stage route from the list while still allowing it by name. Process engine only reserves the route for the engine and board administrators using force.", -1))
            ]),
            r("label", rc, [
              s[20] || (s[20] = W("Evaluation order", -1)),
              k(c(yt), {
                "model-value": e.transition.order ?? null,
                "aria-label": "Transition order",
                min: 0,
                useGrouping: !1,
                "onUpdate:modelValue": s[10] || (s[10] = (u) => e.transition.order = u ?? void 0)
              }, null, 8, ["model-value"])
            ]),
            k(Rt, {
              label: "Set values",
              "model-value": e.transition.set,
              shape: "array",
              commit: p,
              onValidity: s[11] || (s[11] = (u) => l("validity", "set", u))
            }, null, 8, ["model-value"]),
            k(Rt, {
              label: "Guards",
              "model-value": e.transition.guards,
              shape: "array",
              commit: g,
              onValidity: s[12] || (s[12] = (u) => l("validity", "guards", u))
            }, null, 8, ["model-value"])
          ])
        ]),
        _: 1
      })
    ]));
  }
}), uc = ["aria-label", "aria-keyshortcuts", "onKeydown"], cc = { class: "work-row" }, vc = {
  key: 0,
  class: "work-stack work-tight"
}, fc = { class: "work-process-meaning" }, mc = {
  key: 1,
  class: "work-muted"
}, pc = { class: "work-stack work-tight" }, gc = { class: "work-next-transition work-stack work-tight" }, bc = { class: "work-row work-wrap" }, hc = { class: "work-process-inspector-foot" }, yc = { class: "work-row work-transition-actions" }, kc = { class: "work-process-meaning" }, wc = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, $c = { class: "work-stack work-tight" }, Vc = /* @__PURE__ */ $e({
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
    const l = e, o = t, d = B(), v = B(!1), p = B(!1), g = B("");
    let i;
    function s() {
      i = void 0, v.value = !1, p.value = !1, g.value = "";
    }
    async function u(w) {
      s(), i = w, await ct(), d.value && (d.value.scrollTop = 0, d.value.focus({ preventScroll: !0 }), (d.value.closest(".work-settings-shell")?.clientWidth ?? 1 / 0) <= 700 && d.value.scrollIntoView?.({ block: "nearest" }));
    }
    async function S() {
      const w = i;
      o("close"), await ct(), w?.isConnected ? w.focus() : o("focus-editor");
    }
    async function y() {
      v.value = !0, await ct(), d.value?.querySelector('[aria-label="State name"]')?.focus();
    }
    async function b(w) {
      g.value = "", p.value = w, await ct();
      const x = w ? '[role="combobox"]' : "button";
      d.value?.querySelector(".work-next-transition " + x)?.focus();
    }
    function f(w) {
      !l.selectedTransition || w.defaultPrevented || w.repeat || (w.preventDefault(), o("remove-transition", l.selectedTransition));
    }
    return a({ open: u, close: S, reset: s, editName: y, removeByShortcut: f }), (w, x) => (n(), H($o, { name: "work-panel" }, {
      default: G(() => [
        e.selectedState || e.selectedTransition ? (n(), m("aside", {
          key: 0,
          ref_key: "panel",
          ref: d,
          class: "work-process-sideform",
          tabindex: "-1",
          "aria-label": e.selectedState ? "State inspector" : "Transition inspector",
          "aria-keyshortcuts": e.selectedTransition ? "Delete Backspace" : void 0,
          onKeydown: [
            We(Oe(f, ["self"]), ["delete"]),
            We(Oe(f, ["self"]), ["backspace"])
          ]
        }, [
          (n(!0), m(ee, null, ue(e.selectedState ? [e.selectedState] : [], ($) => (n(), m(ee, {
            key: $.id
          }, [
            r("header", cc, [
              v.value ? (n(), H(c(Te), {
                key: 1,
                modelValue: $.name,
                "onUpdate:modelValue": (D) => $.name = D,
                class: "work-process-name",
                "aria-label": "State name",
                onBlur: x[0] || (x[0] = (D) => v.value = !1)
              }, null, 8, ["modelValue", "onUpdate:modelValue"])) : (n(), H(Ll, {
                key: 0,
                class: "work-process-state-title",
                "aria-label": "Rename state",
                onActivate: y
              }, {
                default: G(() => [
                  r("span", null, R(c(ge)($)), 1)
                ]),
                _: 2
              }, 1024)),
              k(c(te), {
                severity: "secondary",
                text: "",
                size: "small",
                "aria-label": "Close state editor",
                onClick: S
              }, {
                default: G(() => [
                  k(c(me), { icon: "tabler:x" })
                ]),
                _: 1
              })
            ]),
            e.insertedRoute ? (n(), m("div", vc, [
              x[4] || (x[4] = r("p", { class: "work-field-label" }, "New route", -1)),
              r("p", null, R(e.insertedRoute), 1)
            ])) : E("", !0),
            r("p", fc, R(c(Ii)($, e.draft)), 1),
            e.processCounts ? (n(), m("p", mc, R(e.processCounts[$.id] ?? 0) + " " + R(e.processCounts[$.id] === 1 ? "item" : "items") + " currently here", 1)) : E("", !0),
            k(Zu, {
              state: $,
              process: e.process,
              draft: e.draft,
              "board-id": e.boardId,
              onKind: (D) => o("kind", $, D),
              onValidity: (D, A) => o("validity", D.includes("duration:") ? D : e.process.id + ":" + $.id + ":" + D, A)
            }, null, 8, ["state", "process", "draft", "board-id", "onKind", "onValidity"]),
            r("label", pc, [
              x[5] || (x[5] = W("Phase", -1)),
              k(c(fe), {
                "aria-label": "Phase",
                modelValue: $.category,
                "onUpdate:modelValue": (D) => $.category = D,
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                options: ["triage", "backlog", ...c(To)].map((D) => ({ label: c(Pt)(D), value: D }))
              }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
            ]),
            r("div", gc, [
              p.value ? (n(), m(ee, { key: 1 }, [
                k(c(fe), {
                  modelValue: g.value,
                  "onUpdate:modelValue": x[2] || (x[2] = (D) => g.value = D),
                  "aria-label": "Next state",
                  placeholder: "Choose the next state",
                  appendTo: "self",
                  optionLabel: "label",
                  optionValue: "value",
                  options: e.process.states.filter((D) => D !== $).map((D) => ({ label: c(ge)(D), value: D.id }))
                }, null, 8, ["modelValue", "options"]),
                r("div", bc, [
                  k(c(te), {
                    label: "Add transition",
                    size: "small",
                    disabled: !g.value,
                    onClick: (D) => o("connect", $.id, g.value, c(i))
                  }, null, 8, ["disabled", "onClick"]),
                  k(c(te), {
                    label: "Cancel",
                    severity: "secondary",
                    text: "",
                    size: "small",
                    onClick: x[3] || (x[3] = (D) => b(!1))
                  })
                ])
              ], 64)) : (n(), H(c(te), {
                key: 0,
                label: "Add transition",
                severity: "secondary",
                outlined: "",
                size: "small",
                "aria-expanded": "false",
                disabled: e.process.states.length < 2,
                onClick: x[1] || (x[1] = (D) => b(!0))
              }, {
                icon: G(() => [
                  k(c(me), {
                    icon: "tabler:plus",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["disabled"]))
            ]),
            r("footer", hc, [
              k(c(te), {
                label: "Remove state",
                severity: "danger",
                text: "",
                size: "small",
                onClick: (D) => o("remove-state", $)
              }, {
                icon: G(() => [
                  k(c(me), { icon: "tabler:trash" })
                ]),
                _: 1
              }, 8, ["onClick"])
            ])
          ], 64))), 128)),
          (n(!0), m(ee, null, ue(e.selectedTransition ? [e.selectedTransition] : [], ($) => (n(), m(ee, {
            key: $.id
          }, [
            r("header", yc, [
              x[6] || (x[6] = r("h3", null, "Transition", -1)),
              k(c(te), {
                type: "button",
                label: "Remove transition",
                severity: "danger",
                text: "",
                size: "small",
                onClick: (D) => o("remove-transition", $)
              }, {
                icon: G(() => [
                  k(c(me), { icon: "tabler:trash" })
                ]),
                _: 1
              }, 8, ["onClick"]),
              k(c(te), {
                severity: "secondary",
                text: "",
                size: "small",
                "aria-label": "Close transition editor",
                onClick: S
              }, {
                default: G(() => [
                  k(c(me), { icon: "tabler:x" })
                ]),
                _: 1
              })
            ]),
            r("p", kc, R($.from === "any" ? "Any state" : $.from.map((D) => c(ge)(e.process.states.find((A) => A.id === D))).join(", ")) + " → " + R(c(ge)(e.process.states.find((D) => D.id === $.to))), 1),
            k(Qo, {
              transition: $,
              process: e.process,
              draft: e.draft,
              guards: e.guards
            }, null, 8, ["transition", "process", "draft", "guards"]),
            e.error ? (n(), m("p", wc, R(e.error), 1)) : E("", !0),
            r("label", $c, [
              x[7] || (x[7] = W("Name", -1)),
              k(c(Te), {
                modelValue: $.name,
                "onUpdate:modelValue": (D) => $.name = D,
                placeholder: c(ze)($),
                "aria-label": "Transition name"
              }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder"])
            ]),
            k(dc, {
              transition: $,
              process: e.process,
              draft: e.draft,
              "board-id": e.boardId,
              guards: e.guards,
              onValidity: (D, A) => o("validity", e.process.id + ":transition-" + $.id + ":" + D, A)
            }, null, 8, ["transition", "process", "draft", "board-id", "guards", "onValidity"])
          ], 64))), 128))
        ], 40, uc)) : E("", !0)
      ]),
      _: 1
    }));
  }
}), xc = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, Cc = { key: 1 }, Sc = { class: "work-muted" }, Tc = {
  key: 2,
  class: "work-map-zoom",
  role: "group",
  "aria-label": "Map zoom"
}, Ic = { class: "work-stack" }, Dc = { class: "work-stack work-tight" }, Ec = {
  key: 0,
  class: "work-muted"
}, Uc = { class: "work-stack work-tight" }, Ac = { class: "work-dialog-actions" }, Rc = /* @__PURE__ */ $e({
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
    const t = e, l = a, o = Ha(Xa, void 0), d = z(() => t.draft.processes ?? []), v = B(!1), p = B(""), g = B(""), i = B(""), s = B("Map");
    Ce(() => t.createForItemType, (C, V) => {
      !C && !V || (p.value = "", v.value = !!C);
    }, { immediate: !0 });
    const u = B(), S = B(), y = B(), b = B(), f = B(), w = B(), x = /* @__PURE__ */ new WeakMap(), $ = z(() => d.value.find((C) => C.id === g.value) ?? d.value[0]), D = z(() => {
      const C = u.value, V = $.value, I = C && x.get(C);
      if (!C || !V || !I) return;
      const { entry: N, continuation: Z } = I;
      if (!V.transitions?.includes(N) || N.to !== C.id) return;
      const U = [
        N.from === "any" ? "Any state" : N.from.map((X) => ge(V.states.find((T) => T.id === X))).join(", "),
        ge(C)
      ];
      return Z && V.transitions.includes(Z) && (Z.from === "any" || Z.from.includes(C.id)) && U.push(ge(V.states.find((X) => X.id === Z.to))), U.join(" → ");
    }), A = B(!1);
    function j(C) {
      A.value = !0, s.value = C;
    }
    function ae() {
      !A.value && b.value?.clientWidth && (s.value = b.value.clientWidth < 480 && ($.value?.states.length ?? 0) > 6 ? "List" : "Map");
    }
    let J;
    ka(() => {
      ae(), b.value && typeof ResizeObserver < "u" && (J = new ResizeObserver(ae), J.observe(b.value));
    }), $t(() => J?.disconnect()), Ce($, () => {
      A.value = !1, ae();
    });
    function se() {
      f.value?.reset(), u.value = void 0, S.value = void 0, i.value = "";
    }
    function ce() {
      const C = o?.selected.value;
      C?.startsWith("workflow/") && o?.choose("workflow", C.slice(9), !1), se();
    }
    function pe() {
      s.value === "Map" ? y.value?.focus() : w.value?.focus();
    }
    function ve(C, V) {
      u.value = C, S.value = void 0, i.value = "", $.value && o?.choose("workflow", $.value.id + ".state." + C.id, !0), f.value?.open(V);
    }
    function oe(C, V) {
      S.value = C, u.value = void 0, i.value = "", $.value && o?.choose("workflow", $.value.id + ".transition." + C.id, !0), f.value?.open(V);
    }
    Ce([$, s], se), Ce([() => o?.selected.value, d], async ([C], V) => {
      if (!C?.startsWith("workflow/")) {
        V?.[0]?.startsWith("workflow/") && se();
        return;
      }
      const [I, N, Z] = C.slice(9).split("."), U = d.value.find((le) => le.id === I);
      if (!U || $.value !== U && (g.value = U.id, await ct(), o?.selected.value !== C))
        return;
      const X = N === "state" ? U.states.find((le) => le.id === Z) : void 0, T = N === "transition" ? U.transitions?.find((le) => le.id === Z) : void 0;
      X === u.value && T === S.value || (se(), u.value = X, S.value = T);
    }, { immediate: !0, flush: "post" });
    const O = z(() => {
      if (!t.counts || !$.value) return;
      const C = t.countTypes?.filter((V) => V.process === $.value?.id) ?? [];
      return Object.fromEntries($.value.states.map((V) => [
        V.id,
        C.reduce((I, N) => I + (t.counts?.[N.id]?.[V.id] ?? 0), 0)
      ]));
    }), Y = z(() => (t.guards ?? []).filter((C) => t.draft.plugins?.some((V) => V.use === C.plugin))), F = z(() => Object.keys(t.draft.policy?.wip ?? {}).filter((C) => !d.value.some((V) => V.states.some((I) => I.id === C))));
    function ne() {
      const C = p.value.trim();
      if (!C) return;
      const V = C.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "") || "process", I = (/^[a-z]/.test(V) ? V : "process_" + V).slice(0, 40), N = d.value.some((Z) => Z.id === I) ? Jt(I, d.value) : I;
      (t.draft.processes ??= []).push({ id: N, name: C, initial: "todo", states: [{ id: "todo", name: "To do", category: "unstarted" }], transitions: [] }), g.value = N, p.value = "", v.value = !1, l("created", N);
    }
    function be() {
      v.value = !1, l("cancel-creation");
    }
    async function Ie(C, V) {
      const I = { id: Jt("state", C.states), name: "New state", category: "started" }, N = Pa(C), Z = N.at(-1), U = u.value ?? (Z?.category === "completed" ? N.at(-2) : Z), X = U ? C.states.indexOf(U) : -1, T = U ? X + 1 : C.states.length, le = U && C.transitions?.filter((Ue) => Ue.from !== "any" && Ue.from.length === 1 && Ue.from[0] === U.id && !eo(C, Ue).length), ke = le?.find((Ue) => Ue.default) ?? le?.find((Ue) => C.states.findIndex((qe) => qe.id === Ue.to) > X);
      C.states.splice(T, 0, I);
      const Ee = C.states[T];
      if (U && U.category !== "completed" && U.category !== "canceled") {
        const Ue = C.transitions ??= [], qe = ke?.auto === !0 && ke.default === !0, xt = {
          id: Jt("transition", Ue),
          name: "Continue",
          from: [ke ? Ee.id : U.id],
          to: ke?.to ?? Ee.id,
          ...qe ? { auto: !0, default: !0 } : {}
        };
        ke && (ke.to = Ee.id), Ue.push(xt);
        const Ze = Ue[Ue.length - 1];
        x.set(Ee, { entry: ke ?? Ze, continuation: ke ? Ze : void 0, automatic: qe });
      }
      ve(Ee, V), await f.value?.editName();
    }
    function K(C, V) {
      const I = x.get(C), N = I?.continuation;
      !N || I.automatic || N.from === "any" || N.from.length !== 1 || N.from[0] !== C.id || (V === "gate" ? (N.auto = !0, N.default = !0) : (delete N.auto, delete N.default));
    }
    function q(C, V, I) {
      const N = $.value;
      if (!N || !V || C === V) return;
      const Z = N.transitions ??= [], U = `to_${V}`;
      let X = U.slice(0, 40), T = 2;
      for (; Z.some((ke) => ke.id === X); ) {
        const ke = `_${T++}`;
        X = U.slice(0, 40 - ke.length) + ke;
      }
      const le = { id: X, name: `To ${ge(N.states.find((ke) => ke.id === V)).toLowerCase()}`, from: [C], to: V };
      Z.push(le), oe(le, I);
    }
    function M(C, V) {
      const I = u.value ?? C.states.find((U) => U.id === C.initial) ?? C.states[0], N = C.states.find((U) => U.id !== I?.id);
      if (!I || !N) return;
      const Z = { id: Jt("transition", C.transitions ?? []), name: "To " + ge(N), from: [I.id], to: N.id };
      (C.transitions ??= []).push(Z), oe(Z, V);
    }
    async function de(C) {
      const V = $.value, I = V?.transitions?.indexOf(C) ?? -1;
      if (!V || I < 0) return;
      const N = eo(V, C);
      if (N.length) {
        i.value = `Used by ${N.join(", ")}. Update those references first.`;
        return;
      }
      V.transitions.splice(I, 1), se(), await ct(), pe();
    }
    function h(C, V) {
      const I = Di(C, V);
      if (I.length) {
        i.value = `${ge(V)} is used by ${I.join(", ")}. Update these references first.`;
        return;
      }
      C.states.splice(C.states.indexOf(V), 1), f.value?.close();
    }
    async function P(C) {
      const V = t.draft.item_types?.filter((N) => N.process === C.id).map((N) => N.title || "Untitled item type") ?? [];
      if (V.length) {
        i.value = `Used by ${V.join(", ")}. Choose a different workflow for those item types first.`;
        return;
      }
      const I = await t.guardRemoval?.("processes", C.id);
      if (I) {
        i.value = I;
        return;
      }
      wa(t.draft, "processes", C.id), g.value = "", se();
    }
    return (C, V) => (n(), m("section", {
      ref_key: "editor",
      ref: b,
      class: "work-process-editor work-stack",
      "aria-label": "Workflow editor",
      onKeydown: V[17] || (V[17] = We((I) => (u.value || S.value) && f.value?.close(), ["esc"]))
    }, [
      i.value && !S.value ? (n(), m("p", xc, R(i.value), 1)) : E("", !0),
      (n(!0), m(ee, null, ue(e.issues?.filter((I) => I.code === "process " + $.value?.id) ?? [], (I) => (n(), m("p", {
        key: I.what + I.detail,
        class: "work-error work-small",
        role: "alert"
      }, R(c(Ya)(I)) + " · " + R(I.what), 1))), 128)),
      $.value ? (n(), m("div", {
        key: 1,
        class: vt(["work-process-builder", { "work-process-inspecting": u.value || S.value }])
      }, [
        r("div", {
          ref_key: "tools",
          ref: w,
          class: "work-process-controls",
          role: "toolbar",
          "aria-label": "Workflow tools",
          tabindex: "-1"
        }, [
          d.value.length > 1 ? (n(), H(c(fe), {
            key: 0,
            "model-value": $.value.id,
            "aria-label": "Workflow",
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            options: d.value.map((I) => ({ label: I.name || "Untitled workflow", value: I.id })),
            "onUpdate:modelValue": V[0] || (V[0] = (I) => g.value = I)
          }, null, 8, ["model-value", "options"])) : (n(), m("strong", Cc, R($.value.name || "Untitled workflow"), 1)),
          k(c(te), {
            label: "Add state",
            severity: "secondary",
            outlined: "",
            onClick: V[1] || (V[1] = (I) => Ie($.value, I.currentTarget))
          }, {
            icon: G(() => [
              k(c(me), { icon: "tabler:plus" })
            ]),
            _: 1
          }),
          k(c(te), {
            label: "Add transition",
            severity: "secondary",
            outlined: "",
            disabled: $.value.states.length < 2,
            onClick: V[2] || (V[2] = (I) => M($.value, I.currentTarget))
          }, null, 8, ["disabled"]),
          k(c(fe), {
            modelValue: $.value.initial,
            "onUpdate:modelValue": V[3] || (V[3] = (I) => $.value.initial = I),
            "aria-label": "Starts in " + c(ge)($.value.states.find((I) => I.id === $.value.initial)),
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            options: $.value.states.map((I) => ({ label: c(ge)(I), value: I.id }))
          }, {
            value: G(() => [
              r("span", Sc, "Starts in " + R(c(ge)($.value.states.find((I) => I.id === $.value.initial))), 1)
            ]),
            _: 1
          }, 8, ["modelValue", "aria-label", "options"]),
          V[18] || (V[18] = r("span", { class: "work-spacer" }, null, -1)),
          s.value === "Map" ? (n(), m("div", Tc, [
            k(c(te), {
              label: "Fit",
              title: "Fit the map to a readable width",
              text: "",
              severity: "secondary",
              size: "small",
              onClick: V[4] || (V[4] = (I) => y.value?.fit())
            }, {
              icon: G(() => [
                k(c(me), { icon: "tabler:arrows-maximize" })
              ]),
              _: 1
            }),
            s.value === "Map" ? (n(), H(c(te), {
              key: 0,
              "aria-label": "Zoom out",
              title: "Zoom out",
              text: "",
              severity: "secondary",
              size: "small",
              onClick: V[5] || (V[5] = (I) => y.value?.zoomOut())
            }, {
              default: G(() => [
                k(c(me), { icon: "tabler:minus" })
              ]),
              _: 1
            })) : E("", !0),
            s.value === "Map" ? (n(), H(c(te), {
              key: 1,
              "aria-label": "Zoom in",
              title: "Zoom in",
              text: "",
              severity: "secondary",
              size: "small",
              onClick: V[6] || (V[6] = (I) => y.value?.zoomIn())
            }, {
              default: G(() => [
                k(c(me), { icon: "tabler:plus" })
              ]),
              _: 1
            })) : E("", !0)
          ])) : E("", !0),
          k(c(Fl), {
            "model-value": s.value,
            "onUpdate:modelValue": j,
            options: ["Map", "List"],
            "allow-empty": !1,
            "aria-label": "Workflow layout"
          }, null, 8, ["model-value"]),
          k(c(te), {
            label: "New process",
            "aria-label": "New process",
            text: "",
            severity: "secondary",
            onClick: V[7] || (V[7] = (I) => v.value = !0)
          }, {
            icon: G(() => [
              k(c(me), { icon: "tabler:plus" })
            ]),
            _: 1
          })
        ], 512),
        s.value === "Map" ? (n(), H(gd, {
          key: 0,
          ref_key: "graph",
          ref: y,
          process: $.value,
          draft: e.draft,
          "fit-on-open": "",
          "selected-state": u.value,
          "selected-transition": S.value,
          onState: ve,
          onTransition: oe,
          onRemoveTransition: V[8] || (V[8] = (I) => f.value?.removeByShortcut(I)),
          onConnect: q,
          onClear: V[9] || (V[9] = (I) => f.value?.close())
        }, null, 8, ["process", "draft", "selected-state", "selected-transition"])) : (n(), H(jd, {
          key: 1,
          process: $.value,
          draft: e.draft,
          guards: Y.value,
          "selected-state": u.value,
          "selected-transition": S.value,
          counts: O.value,
          onState: ve,
          onTransition: oe,
          onRemoveState: V[10] || (V[10] = (I) => h($.value, I)),
          onRemoveTransition: de
        }, null, 8, ["process", "draft", "guards", "selected-state", "selected-transition", "counts"])),
        k(Vc, {
          ref_key: "inspector",
          ref: f,
          process: $.value,
          draft: e.draft,
          "board-id": e.boardId,
          guards: Y.value,
          error: i.value,
          "selected-state": u.value,
          "selected-transition": S.value,
          "inserted-route": D.value,
          "process-counts": O.value,
          onClose: ce,
          onFocusEditor: pe,
          onKind: K,
          onConnect: q,
          onRemoveState: V[11] || (V[11] = (I) => h($.value, I)),
          onRemoveTransition: de,
          onValidity: V[12] || (V[12] = (I, N) => l("validity", I, N))
        }, null, 8, ["process", "draft", "board-id", "guards", "error", "selected-state", "selected-transition", "inserted-route", "process-counts"])
      ], 2)) : (n(), H(c(te), {
        key: 2,
        label: "New process",
        severity: "secondary",
        outlined: "",
        onClick: V[13] || (V[13] = (I) => v.value = !0)
      }, {
        icon: G(() => [
          k(c(me), { icon: "tabler:plus" })
        ]),
        _: 1
      })),
      $.value ? (n(), H(Ne, {
        key: 3,
        class: "work-disclosure",
        label: "Advanced workflow settings"
      }, {
        default: G(() => [
          r("div", Ic, [
            k(Ne, {
              class: "work-small",
              label: "Technical details"
            }, {
              default: G(() => [...V[19] || (V[19] = [
                r("p", null, [
                  W("Workflow definitions are "),
                  r("code", null, "processes"),
                  W(" in "),
                  r("code", null, "WorkGetSchema"),
                  W(" and "),
                  r("code", null, "WorkApplySchema"),
                  W(".")
                ], -1)
              ])]),
              _: 1
            }),
            r("label", Dc, [
              V[20] || (V[20] = W("Workflow name", -1)),
              k(c(Te), {
                modelValue: $.value.name,
                "onUpdate:modelValue": V[14] || (V[14] = (I) => $.value.name = I),
                "aria-label": "Workflow name"
              }, null, 8, ["modelValue"])
            ]),
            F.value.length ? (n(), m("p", Ec, "Some item limits belong to removed states.")) : E("", !0),
            (n(!0), m(ee, null, ue(F.value, (I, N) => (n(), H(c(te), {
              key: I,
              label: "Clear limit for removed state " + (N + 1),
              severity: "secondary",
              text: "",
              onClick: (Z) => delete e.draft.policy.wip[I]
            }, null, 8, ["label", "onClick"]))), 128)),
            k(c(te), {
              label: "Remove workflow",
              severity: "danger",
              text: "",
              size: "small",
              onClick: V[15] || (V[15] = (I) => P($.value))
            })
          ])
        ]),
        _: 1
      })) : E("", !0),
      k(xl, {
        visible: v.value,
        "return-focus": e.creationOpener,
        label: "New process",
        onClose: be
      }, {
        default: G(() => [
          r("form", {
            class: "work-dialog-box",
            "aria-label": "New process",
            onSubmit: Oe(ne, ["stop", "prevent"])
          }, [
            V[22] || (V[22] = r("h2", null, "New process", -1)),
            r("label", Uc, [
              V[21] || (V[21] = W("Name", -1)),
              k(c(Te), {
                modelValue: p.value,
                "onUpdate:modelValue": V[16] || (V[16] = (I) => p.value = I),
                "aria-label": "New process name",
                autofocus: "",
                required: ""
              }, null, 8, ["modelValue"])
            ]),
            r("div", Ac, [
              k(c(te), {
                label: "Cancel",
                severity: "secondary",
                outlined: "",
                onClick: be
              }),
              k(c(te), {
                label: "Create process",
                type: "submit",
                disabled: !p.value.trim()
              }, null, 8, ["disabled"])
            ])
          ], 32)
        ]),
        _: 1
      }, 8, ["visible", "return-focus"])
    ], 544));
  }
}), Pc = {
  class: "work-settings-card work-stack",
  "aria-label": "Existing items"
}, Oc = {
  key: 0,
  class: "work-stack work-tight"
}, Nc = { class: "work-row" }, Mc = /* @__PURE__ */ $e({
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
    return (t, l) => (n(), m("section", Pc, [
      l[2] || (l[2] = r("h3", { class: "work-row-title" }, "Items in changed states", -1)),
      (n(!0), m(ee, null, ue(e.removed, ({ process: o, state: d, count: v }) => (n(), m("label", {
        key: o.id + "/" + d.id,
        class: "work-stack work-tight"
      }, [
        W(" Move " + R(a(v)) + " from " + R(c(ge)(d)) + " to ", 1),
        k(c(fe), {
          disabled: e.disabled,
          "model-value": o.map?.[d.id],
          "aria-label": "Move items from " + c(ge)(d) + " to",
          placeholder: "Choose a state",
          appendTo: "self",
          optionLabel: "label",
          optionValue: "value",
          options: o.states.map((p) => ({ label: c(ge)(p), value: p.id })),
          "onUpdate:modelValue": (p) => t.$emit("destination", o, d.id, p)
        }, null, 8, ["disabled", "model-value", "aria-label", "options", "onUpdate:modelValue"])
      ]))), 128)),
      e.renamed.length ? (n(), m("div", Oc, [
        (n(!0), m(ee, null, ue(e.renamed, ({ process: o, state: d, count: v, name: p }) => (n(), m("p", {
          key: o.id + "/" + d.id
        }, [
          W(R(c(ge)(d)) + " becomes ", 1),
          r("strong", null, R(p), 1),
          W(" for " + R(a(v)) + ". ", 1)
        ]))), 128)),
        r("label", Nc, [
          k(c(Wt), {
            binary: "",
            "model-value": e.confirmed,
            disabled: e.disabled,
            "onUpdate:modelValue": l[0] || (l[0] = (o) => t.$emit("update:confirmed", o))
          }, null, 8, ["model-value", "disabled"]),
          l[1] || (l[1] = W(" Keep these items in their renamed states ", -1))
        ])
      ])) : E("", !0)
    ]));
  }
}), Fc = {
  class: "work-stack",
  "aria-label": "Links editor"
}, Lc = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, Bc = { class: "work-definition-meta work-muted work-small" }, jc = { class: "work-settings-grid" }, zc = { class: "work-stack work-tight" }, qc = {
  key: 0,
  class: "work-stack work-tight"
}, Wc = { class: "work-stack work-tight" }, Gc = { class: "work-row" }, Kc = {
  key: 0,
  class: "work-muted work-small"
}, Hc = {
  key: 1,
  class: "work-stack work-tight"
}, Yc = { class: "work-settings-grid" }, Xc = {
  key: 0,
  class: "work-chips"
}, Jc = { class: "work-stack work-tight" }, Zc = { class: "work-relation-preview work-small" }, Qc = {
  key: 0,
  class: "work-muted"
}, _c = {
  key: 0,
  class: "kx-empty"
}, ev = /* @__PURE__ */ $e({
  __name: "RelationsEditor",
  props: {
    draft: {},
    guardRemoval: { type: Function }
  },
  setup(e) {
    const a = e, t = z(() => a.draft.relation_types ?? []), l = z(() => (a.draft.item_types ?? []).map((b) => ({ value: b.id, label: b.title || Ae(b.id) })));
    function o(b, f, w) {
      w.length ? b[f] = w : delete b[f];
    }
    function d(b, f) {
      if (!/^[a-z][a-z0-9_]{0,39}$/.test(f)) return "Start with a lowercase letter and use only lowercase letters, numbers or underscores.";
      if (b.to_types?.includes(f)) return "This ID is already in use.";
    }
    function v(b, f) {
      o(b, "to_types", [...b.to_types ?? [], f]);
    }
    function p(b) {
      return (b.to_types ?? []).filter((f) => l.value.some((w) => w.value === f));
    }
    function g(b) {
      return (b.to_types ?? []).filter((f) => !l.value.some((w) => w.value === f));
    }
    const i = B(""), s = B(!1);
    function u(b) {
      const f = b.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, ""), w = (/^[a-z]/.test(f) ? f : "link_" + (f || "new")).slice(0, 40);
      let x = w, $ = 2;
      for (; t.value.some((D) => D.id === x); ) {
        const D = "_" + $++;
        x = w.slice(0, 40 - D.length) + D;
      }
      return x;
    }
    function S(b) {
      (a.draft.relation_types ??= []).push({ id: u(b), outward: b, inward: b, cardinality: "many" });
    }
    async function y(b) {
      if (!s.value) {
        s.value = !0, i.value = "";
        try {
          const f = await a.guardRemoval?.("relation_types", b);
          f ? i.value = f : wa(a.draft, "relation_types", b);
        } finally {
          s.value = !1;
        }
      }
    }
    return (b, f) => (n(), m("section", Fc, [
      i.value ? (n(), m("p", Lc, R(i.value), 1)) : E("", !0),
      k(Za, {
        columns: "relations",
        count: t.value.length
      }, {
        default: G(() => [
          (n(!0), m(ee, null, ue(t.value, (w, x) => (n(), H(Ja, {
            "route-section": "links",
            "route-id": w.id,
            title: w.outward || c(Ae)(w.id),
            kind: w.symmetric ? "Same both ways" : "Different each way",
            key: x,
            class: "work-stack"
          }, Ka({
            actions: G(() => [
              k(c(te), {
                severity: "secondary",
                text: "",
                disabled: s.value,
                onClick: ($) => y(w.id),
                "aria-label": "Remove link type",
                size: "small"
              }, {
                default: G(() => [
                  k(c(me), {
                    icon: "tabler:trash",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["disabled", "onClick"])
            ]),
            default: G(() => [
              r("div", jc, [
                r("label", zc, [
                  f[0] || (f[0] = W("Shown on this item ", -1)),
                  k(c(Te), {
                    modelValue: w.outward,
                    "onUpdate:modelValue": ($) => w.outward = $,
                    "aria-label": "Shown on this item"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                w.symmetric ? E("", !0) : (n(), m("label", qc, [
                  f[1] || (f[1] = W("Shown on the other item ", -1)),
                  k(c(Te), {
                    modelValue: w.inward,
                    "onUpdate:modelValue": ($) => w.inward = $,
                    "aria-label": "Shown on the other item"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ])),
                r("label", Wc, [
                  f[2] || (f[2] = W("Links allowed ", -1)),
                  k(c(fe), {
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
                r("label", Gc, [
                  k(c(Wt), {
                    modelValue: w.symmetric,
                    "onUpdate:modelValue": ($) => w.symmetric = $,
                    disabled: !!(w.from_types?.length || w.to_types?.length),
                    "aria-label": "Same meaning in both directions",
                    binary: ""
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"]),
                  f[3] || (f[3] = W("Same meaning in both directions ", -1))
                ])
              ]),
              w.from_types?.length || w.to_types?.length ? (n(), m("p", Kc, " Clear the source and target types to use the same meaning in both directions. ")) : E("", !0),
              w.symmetric ? E("", !0) : (n(), m("div", Hc, [
                f[5] || (f[5] = r("p", { class: "work-muted work-small" }, "Leave either end empty to allow any item type there.", -1)),
                r("div", Yc, [
                  k(st, {
                    label: "Source item types",
                    options: l.value,
                    "model-value": w.from_types,
                    "onUpdate:modelValue": ($) => o(w, "from_types", $)
                  }, null, 8, ["options", "model-value", "onUpdate:modelValue"]),
                  k(st, {
                    label: "Target item types",
                    options: l.value,
                    "model-value": p(w),
                    "onUpdate:modelValue": ($) => o(w, "to_types", [...$, ...g(w)])
                  }, null, 8, ["options", "model-value", "onUpdate:modelValue"])
                ]),
                k(Ne, {
                  class: "work-disclosure",
                  label: "Peer board target types"
                }, {
                  default: G(() => [
                    f[4] || (f[4] = r("p", { class: "work-muted work-small" }, "Enter a type ID to allow that type from a peer board.", -1)),
                    g(w).length ? (n(), m("div", Xc, [
                      (n(!0), m(ee, null, ue(g(w), ($) => (n(), H(c(te), {
                        key: $,
                        severity: "secondary",
                        text: "",
                        size: "small",
                        label: $ + " ×",
                        "aria-label": "Remove target type " + $,
                        onClick: (D) => o(w, "to_types", w.to_types?.filter((A) => A !== $) ?? [])
                      }, null, 8, ["label", "aria-label", "onClick"]))), 128))
                    ])) : E("", !0),
                    k(ha, {
                      action: "Add target type",
                      label: "Target type ID",
                      maxlength: 40,
                      validate: ($) => d(w, $),
                      onAdd: ($) => v(w, $)
                    }, null, 8, ["validate", "onAdd"])
                  ]),
                  _: 2
                }, 1024)
              ])),
              k(Ne, {
                class: "work-disclosure",
                label: "Advanced link settings"
              }, {
                default: G(() => [
                  r("label", Jc, [
                    f[6] || (f[6] = W("Identifier ", -1)),
                    k(c(Te), {
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
              r("p", Zc, [
                f[7] || (f[7] = r("strong", null, "This item", -1)),
                W(" " + R(w.outward || "relates to") + " ", 1),
                f[8] || (f[8] = r("strong", null, "another item", -1)),
                !w.symmetric && w.inward && w.inward !== w.outward ? (n(), m("span", Qc, " · reverse: " + R(w.inward), 1)) : E("", !0)
              ])
            ]),
            _: 2
          }, [
            !w.symmetric && w.inward && w.inward !== w.outward ? {
              name: "usage",
              fn: G(() => [
                r("span", Bc, R(w.inward), 1)
              ]),
              key: "0"
            } : void 0
          ]), 1032, ["route-id", "title", "kind"]))), 128)),
          t.value.length ? E("", !0) : (n(), m("p", _c, "No link types yet. Add one to connect related work.")),
          k(ha, {
            action: "Add link type",
            label: "Link name",
            onAdd: S
          })
        ]),
        _: 1
      }, 8, ["count"])
    ]));
  }
});
function _o(e) {
  return typeof e.error == "string" ? e.error : e.error?.message;
}
function bo(e, a) {
  const t = _o(e);
  return e.parked ? "Stopped: " + (t ?? "Projection is parked") : t ? "Degraded: " + t : e.bootstrapping ? "Initializing" : e.last_seq >= a ? "Up to date" : "Catching up";
}
function tv(e, a) {
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
  if (o.some(_o)) return { kind: "degraded", status: "Degraded" };
}
const av = {
  class: "work-stack",
  "aria-label": "Plugins editor"
}, lv = {
  key: 0,
  class: "kx-loading"
}, ov = {
  key: 1,
  class: "kx-err",
  role: "alert"
}, iv = {
  key: 2,
  class: "work-notice",
  role: "status"
}, nv = { class: "work-block work-small work-error" }, sv = {
  key: 0,
  class: "work-muted work-small"
}, rv = {
  key: 1,
  class: "work-notice"
}, dv = {
  key: 2,
  class: "work-stack work-tight"
}, uv = {
  key: 0,
  class: "work-muted"
}, cv = {
  key: 1,
  class: "work-row"
}, vv = {
  key: 2,
  class: "work-row"
}, fv = {
  key: 0,
  class: "work-small"
}, mv = {
  key: 5,
  class: "work-row"
}, pv = {
  key: 6,
  class: "work-row"
}, gv = {
  key: 7,
  class: "work-row"
}, bv = { class: "work-stack work-tight" }, hv = { key: 0 }, yv = { key: 1 }, kv = { key: 2 }, wv = {
  key: 4,
  class: "work-stack work-tight"
}, $v = {
  key: 0,
  class: "work-muted"
}, Vv = ["id"], xv = { class: "work-form-actions" }, Cv = {
  key: 6,
  class: "work-muted work-small"
}, Sv = "kickside.work.planning:plugin", ho = /* @__PURE__ */ $e({
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
  emits: ["configured", "refresh", "review", "validity", "widget-validity"],
  setup(e, { expose: a, emit: t }) {
    const l = e, o = t, d = B(""), v = B(""), p = B(""), g = B({}), i = Ha(Xa, void 0), s = B(/* @__PURE__ */ new Set()), u = B(/* @__PURE__ */ new Set()), S = B({}), y = /* @__PURE__ */ new Map(), b = B({}), f = B(/* @__PURE__ */ new Set()), w = z(() => l.options.map((C) => {
      const V = oe(C.plugin), I = tv(C, V), N = Y(C.plugin), Z = V?.active === !0, U = N && s.value.has(C.plugin) ? "Configuration needed" : N !== Z ? N ? "Will enable on apply" : "Will disable on apply" : I?.status ?? (Z ? V.lifecycle.state === "ready" ? "Enabled" : "Setting up" : "Disabled");
      return { plugin: C, current: V, issue: I, chosen: N, status: U };
    })), x = z(() => !!d.value || l.disabled), $ = z(() => x.value || l.activationLocked), D = {}, A = At(), j = z(() => (l.draft.item_types ?? []).filter((C) => !["issue", "sprint", "milestone"].includes(C.id)).map((C) => ({ value: C.id, label: C.title || Ae(C.id) }))), ae = z(() => ["current_sprint", "milestone"].every((C) => l.schema.compiled?.fields?.some((V) => V.code === C))), J = z(() => {
      const C = l.filters;
      return C ? (l.draft.scopes ?? []).filter((V) => !C.some((I) => I.id === V && l.options.some((N) => N.plugin === I.plugin))) : [];
    });
    function se(C) {
      return (l.filters ?? []).filter((V) => V.plugin === C);
    }
    function ce(C, V) {
      const I = new Set(se(C).map((U) => U.id)), N = l.draft.scopes ?? [], Z = [...N.filter((U) => !I.has(U)), ...V];
      (Z.length !== N.length || Z.some((U) => !N.includes(U))) && (l.draft.scopes = Z);
    }
    function pe(C, V) {
      Ie(C, { ...be(C), issue_types: V });
    }
    function ve(C) {
      return !!C.config_schema && Ml(C.config_schema).length > 0;
    }
    function oe(C) {
      return l.schema.plugins?.find((V) => V.plugin === C);
    }
    function O(C) {
      return oe(C)?.active === !0;
    }
    function Y(C) {
      return l.draft.plugins?.some((V) => V.use === C) === !0;
    }
    function F(C, V) {
      const I = l.draft.plugins ?? [];
      V && !Y(C) && (l.draft.plugins = [...I, { use: C }], g.value[C] = !0, i?.choose("plugins", C, !0)), V || (l.draft.plugins = I.filter((N) => N.use !== C), delete l.configs[C], s.value.delete(C), o("validity", C, !0), q(C, !0), ce(C, []));
    }
    function ne(C, V) {
      F(C, !1), o("review", V.currentTarget);
    }
    function be(C) {
      return l.configs[C] ?? oe(C)?.config ?? D;
    }
    function Ie(C, V) {
      p.value = "", l.configs[C] = V;
    }
    function K(C) {
      delete l.configs[C], S.value[C] = (S.value[C] ?? 0) + 1;
    }
    function q(C, V) {
      V || !Y(C) ? u.value.delete(C) : u.value.add(C), o("widget-validity", C, !u.value.has(C));
    }
    async function M() {
      const C = w.value.find(({ plugin: V, chosen: I }) => I && u.value.has(V.plugin));
      return C ? (g.value[C.plugin.plugin] = !0, await ct(), y.get(C.plugin.plugin)?.reportValidity(), !1) : !0;
    }
    a({ reportValidity: M });
    function de(C, V) {
      V ? s.value.delete(C) : s.value.add(C), o("validity", C, V || !Y(C) || O(C) && !l.configs[C]);
    }
    async function h(C) {
      await Uo.confirm({
        header: "Reset projection?",
        message: "Resetting can rebuild from current items or replay retained events, depending on the projection.",
        acceptLabel: "Reset projection",
        rejectLabel: "Cancel"
      }) && await P(C);
    }
    async function P(C) {
      if (!x.value) {
        d.value = C, v.value = "", p.value = "";
        try {
          await qt.configure(l.boardId, C), p.value = "Plugin recovery started.", o("configured");
        } catch (V) {
          v.value = nt(V, "Could not recover the plugin.");
        } finally {
          d.value = "";
        }
      }
    }
    return (C, V) => (n(), m("section", av, [
      e.options.length ? E("", !0) : (n(), m("p", lv, "No installed plugins are visible to you.")),
      v.value ? (n(), m("div", ov, R(v.value), 1)) : E("", !0),
      p.value ? (n(), m("p", iv, R(p.value), 1)) : E("", !0),
      k(Za, {
        columns: "plugins",
        count: e.options.length
      }, {
        default: G(() => [
          (n(!0), m(ee, null, ue(w.value, ({ plugin: I, current: N, issue: Z, chosen: U, status: X }) => (n(), H(Ja, {
            "route-section": "plugins",
            "route-id": I.plugin,
            key: I.plugin,
            open: g.value[I.plugin],
            "onUpdate:open": (T) => g.value[I.plugin] = T,
            title: I.installed === !1 ? I.plugin : I.title || I.plugin,
            description: I.description,
            kind: X,
            class: "work-stack"
          }, Ka({
            actions: G(() => [
              Z?.kind !== "missing" ? (n(), H(c(et), {
                key: 0,
                "model-value": Y(I.plugin),
                "aria-label": "Enable " + (I.title || I.plugin),
                disabled: $.value || !!I.problem && !Y(I.plugin),
                "onUpdate:modelValue": (T) => F(I.plugin, T)
              }, null, 8, ["model-value", "aria-label", "disabled", "onUpdate:modelValue"])) : E("", !0)
            ]),
            default: G(() => [
              I.requires.length ? (n(), m("p", sv, "Requires " + R(I.requires.map((T) => e.options.find((le) => le.plugin === T)?.title || "Another capability").join(", ")), 1)) : E("", !0),
              N?.outdated ? (n(), m("p", rv, "The stored declaration differs from the installed plugin. Review activation to update it.")) : E("", !0),
              Z ? (n(), m("div", dv, [
                Z && "cause" in Z ? (n(), m("p", uv, R(Z.cause), 1)) : E("", !0),
                Z?.kind === "setup" && N?.active ? (n(), m("div", cv, [
                  k(c(te), {
                    label: "Retry setup",
                    severity: "secondary",
                    outlined: "",
                    disabled: x.value,
                    onClick: (T) => P(I.plugin)
                  }, null, 8, ["disabled", "onClick"])
                ])) : Z?.kind === "provider" ? (n(), m("div", vv, [
                  k(c(te), {
                    label: "Retry schema check",
                    severity: "secondary",
                    outlined: "",
                    disabled: x.value,
                    onClick: V[0] || (V[0] = (T) => o("refresh"))
                  }, null, 8, ["disabled"])
                ])) : Z?.kind === "degraded" ? (n(), H(Ne, {
                  key: 3,
                  class: "work-small",
                  label: "Inspect worker"
                }, {
                  default: G(() => [
                    V[1] || (V[1] = r("p", null, "Check the failing worker before resetting a projection.", -1)),
                    (n(!0), m(ee, null, ue(N?.projections, (T, le) => (n(), m("p", { key: le }, R(le) + " · " + R(c(bo)(T, e.schema.as_of)), 1))), 128))
                  ]),
                  _: 2
                }, 1024)) : Z?.kind === "history" ? (n(), m(ee, { key: 4 }, [
                  Z.floor !== void 0 ? (n(), m("p", fv, "Earliest retained event sequence is " + R(Z.floor) + ".", 1)) : E("", !0),
                  k(Ne, {
                    class: "work-small",
                    label: "Review retained history"
                  }, {
                    default: G(() => [...V[2] || (V[2] = [
                      r("p", null, "Ask the plugin maintainer to review the event projection’s start sequence. The plugin needs a declaration that can run with the retained history.", -1)
                    ])]),
                    _: 1
                  })
                ], 64)) : Z?.kind === "reset" ? (n(), m("div", mv, [
                  k(c(te), {
                    label: "Reset projection",
                    severity: "secondary",
                    outlined: "",
                    disabled: x.value,
                    onClick: (T) => h(I.plugin)
                  }, null, 8, ["disabled", "onClick"]),
                  V[3] || (V[3] = r("span", { class: "work-muted work-small" }, "Resolve the worker error before resetting.", -1))
                ])) : Z?.kind === "configuration" && Y(I.plugin) && ve(I) && !f.value.has(I.plugin) ? (n(), m("div", pv, [
                  k(c(te), {
                    label: "Edit configuration",
                    severity: "secondary",
                    outlined: "",
                    disabled: x.value,
                    onClick: (T) => f.value.add(I.plugin)
                  }, null, 8, ["disabled", "onClick"])
                ])) : Z?.kind === "missing" && Y(I.plugin) ? (n(), m("div", gv, [
                  k(c(te), {
                    label: "Review references",
                    severity: "secondary",
                    outlined: "",
                    disabled: $.value,
                    onClick: (T) => ne(I.plugin, T)
                  }, null, 8, ["disabled", "onClick"])
                ])) : E("", !0)
              ])) : E("", !0),
              I.installed ? (n(), H(Ne, {
                key: 3,
                class: "work-disclosure work-small",
                label: "Technical details"
              }, {
                default: G(() => [
                  r("dl", bv, [
                    r("div", null, [
                      V[4] || (V[4] = r("dt", null, "Plugin ID", -1)),
                      r("dd", null, [
                        r("code", null, R(I.plugin), 1)
                      ])
                    ]),
                    (N?.interface_version ?? I.interface_version) != null ? (n(), m("div", hv, [
                      V[5] || (V[5] = r("dt", null, "Interface version", -1)),
                      r("dd", null, R(N?.interface_version ?? I.interface_version), 1)
                    ])) : E("", !0),
                    N?.version ? (n(), m("div", yv, [
                      V[6] || (V[6] = r("dt", null, "Active schema version", -1)),
                      r("dd", null, R(N.version), 1)
                    ])) : E("", !0),
                    V[8] || (V[8] = r("div", null, [
                      r("dt", null, "Configuration tool"),
                      r("dd", null, [
                        r("code", null, "WorkConfigurePlugin")
                      ])
                    ], -1)),
                    I.tools.length ? (n(), m("div", kv, [
                      V[7] || (V[7] = r("dt", null, "Plugin tools", -1)),
                      r("dd", null, [
                        (n(!0), m(ee, null, ue(I.tools, (T) => (n(), m("code", {
                          key: T,
                          class: "work-block"
                        }, R(T), 1))), 128))
                      ])
                    ])) : E("", !0),
                    (n(!0), m(ee, null, ue(N?.projections, (T, le) => (n(), m("div", { key: le }, [
                      r("dt", null, R(c(Ae)(le)), 1),
                      r("dd", null, R(c(bo)(T, e.schema.as_of)) + " · Indexed through " + R(T.last_seq) + " of " + R(e.schema.as_of) + " events.", 1)
                    ]))), 128))
                  ])
                ]),
                _: 2
              }, 1024)) : E("", !0),
              se(I.plugin).length && (Y(I.plugin) || O(I.plugin)) ? (n(), m("section", wv, [
                V[9] || (V[9] = r("h4", null, "Query filters", -1)),
                V[10] || (V[10] = r("p", { class: "work-muted" }, "Choose which filters people can use to narrow down work on this board.", -1)),
                k(st, {
                  label: "Available filters",
                  disabled: !!d.value || e.disabled || !Y(I.plugin),
                  options: se(I.plugin).map((T) => ({ value: T.id, label: T.title })),
                  "model-value": e.draft.scopes?.filter((T) => se(I.plugin).some((le) => le.id === T)),
                  "onUpdate:modelValue": (T) => ce(I.plugin, T)
                }, null, 8, ["disabled", "options", "model-value", "onUpdate:modelValue"])
              ])) : E("", !0),
              Y(I.plugin) && ve(I) && Z?.kind !== "manifest" && Z?.kind !== "missing" && (Z?.kind !== "configuration" || f.value.has(I.plugin)) ? (n(), H(aa(Z && Z.kind !== "configuration" ? Ne : "div"), {
                key: 5,
                label: Z && Z.kind !== "configuration" ? "Plugin settings" : void 0,
                class: "work-stack work-tight"
              }, {
                default: G(() => [
                  I.plugin === Sv ? (n(), m(ee, { key: 0 }, [
                    ae.value ? (n(), H(st, {
                      key: 1,
                      label: "Plan these item types",
                      "aria-describedby": c(A),
                      options: j.value,
                      "model-value": be(I.plugin).issue_types,
                      disabled: !!d.value || e.disabled,
                      "onUpdate:modelValue": (T) => pe(I.plugin, T)
                    }, null, 8, ["aria-describedby", "options", "model-value", "disabled", "onUpdate:modelValue"])) : (n(), m("p", $v, "The Planning pack supplies sprint and milestone fields for item types.")),
                    r("p", {
                      id: c(A),
                      class: "work-muted"
                    }, "Selected types get Current sprint and Milestone fields.", 8, Vv)
                  ], 64)) : (n(), H(Do, {
                    key: S.value[I.plugin],
                    ref_for: !0,
                    ref: (T) => {
                      T ? c(y).set(I.plugin, T) : c(y).delete(I.plugin);
                    },
                    disabled: !!d.value || e.disabled,
                    schema: I.config_schema,
                    "model-value": be(I.plugin),
                    "suggest-defaults": "",
                    "onUpdate:modelValue": (T) => Ie(I.plugin, T),
                    onValidity: (T) => de(I.plugin, T),
                    onWidgetValidity: (T) => q(I.plugin, T),
                    onValidationMessage: (T) => b.value[I.plugin] = T
                  }, null, 8, ["disabled", "schema", "model-value", "onUpdate:modelValue", "onValidity", "onWidgetValidity", "onValidationMessage"])),
                  r("div", xv, [
                    k(c(te), {
                      label: Z ? "Reset form values" : "Reset",
                      severity: "secondary",
                      outlined: "",
                      disabled: !!d.value || e.disabled,
                      onClick: (T) => K(I.plugin)
                    }, null, 8, ["label", "disabled", "onClick"])
                  ])
                ]),
                _: 2
              }, 1032, ["label"])) : E("", !0),
              !e.activationLocked && (U !== O(I.plugin) || U && (ve(I) || se(I.plugin).length)) ? (n(), m("p", Cv, " Use Review changes, then Apply changes to save. ")) : E("", !0)
            ]),
            _: 2
          }, [
            Y(I.plugin) && b.value[I.plugin] ? {
              name: "status",
              fn: G(() => [
                r("span", nv, R(b.value[I.plugin]), 1)
              ]),
              key: "0"
            } : void 0
          ]), 1032, ["route-id", "open", "onUpdate:open", "title", "description", "kind"]))), 128))
        ]),
        _: 1
      }, 8, ["count"]),
      J.value.length ? (n(), H(Ne, {
        key: 3,
        class: "work-settings-card work-disclosure",
        label: "Unavailable query filters"
      }, {
        default: G(() => [
          V[11] || (V[11] = r("p", { class: "work-muted" }, "These filters came from a plugin that is unavailable. Remove one to stop using it on this board.", -1)),
          (n(!0), m(ee, null, ue(J.value, (I, N) => (n(), H(c(te), {
            key: I,
            label: "Remove unavailable filter " + (N + 1),
            severity: "secondary",
            text: "",
            onClick: (Z) => e.draft.scopes = e.draft.scopes?.filter((U) => U !== I)
          }, null, 8, ["label", "onClick"]))), 128))
        ]),
        _: 1
      })) : E("", !0),
      (n(!0), m(ee, null, ue(e.draft.plugins?.filter((I) => !e.options.some((N) => N.plugin === I.use)) ?? [], (I) => (n(), m("article", {
        key: I.use,
        class: "work-settings-card work-stack"
      }, [
        r("p", null, [
          r("strong", null, R(I.use), 1),
          V[12] || (V[12] = W(" · Not installed", -1))
        ]),
        V[13] || (V[13] = r("p", { class: "work-muted" }, "This board still references a plugin that is no longer installed.", -1)),
        k(c(te), {
          label: "Review references",
          severity: "secondary",
          outlined: "",
          disabled: $.value,
          onClick: (N) => ne(I.use, N)
        }, null, 8, ["disabled", "onClick"])
      ]))), 128))
    ]));
  }
}), Tv = { class: "system-section-head" }, Iv = { class: "system-section-head-text" }, Dv = {
  key: 0,
  class: "kx-head-actions"
}, Ev = /* @__PURE__ */ $e({
  __name: "SettingsSectionHead",
  props: {
    title: {},
    description: {}
  },
  setup(e) {
    return (a, t) => (n(), m("header", Tv, [
      r("div", Iv, [
        r("h1", null, R(e.title), 1),
        r("p", null, R(e.description), 1)
      ]),
      a.$slots.actions ? (n(), m("div", Dv, [
        Je(a.$slots, "actions")
      ])) : E("", !0)
    ]));
  }
}), Uv = /* @__PURE__ */ $e({
  __name: "SettingsDraftActions",
  props: {
    busy: { type: Boolean },
    discardDisabled: { type: Boolean },
    reviewDisabled: { type: Boolean }
  },
  emits: ["discard", "review"],
  setup(e) {
    return (a, t) => (n(), m(ee, null, [
      k(c(tt), {
        severity: "warn",
        value: "Unsaved changes"
      }),
      k(c(te), {
        label: "Discard",
        type: "button",
        severity: "secondary",
        outlined: "",
        disabled: e.busy || e.discardDisabled,
        onClick: t[0] || (t[0] = (l) => a.$emit("discard"))
      }, {
        icon: G(() => [
          k(c(me), {
            icon: "tabler:restore",
            "aria-hidden": "true"
          })
        ]),
        _: 1
      }, 8, ["disabled"]),
      k(c(te), {
        label: "Review changes",
        type: "button",
        disabled: e.busy || e.reviewDisabled,
        loading: e.busy,
        onClick: t[1] || (t[1] = (l) => a.$emit("review", l.currentTarget))
      }, null, 8, ["disabled", "loading"])
    ], 64));
  }
}), Av = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, Rv = ["config"], Pv = /* @__PURE__ */ $e({
  __name: "BoardShare",
  props: {
    board: {},
    busy: { type: Boolean }
  },
  emits: ["shared"],
  setup(e) {
    const a = e, t = B(!1), l = B(!1), o = B("");
    async function d() {
      const p = a.board;
      if (!(a.busy || l.value)) {
        l.value = !0, o.value = "";
        try {
          const g = await Ut("kickside-share");
          if (a.board.board_id !== p.board_id) return;
          g ? t.value = !0 : o.value = "Sharing is unavailable. Try opening it again.";
        } finally {
          l.value = !1;
        }
      }
    }
    Ce(() => a.board.board_id, () => {
      t.value = !1, o.value = "";
    });
    const v = z(() => {
      const p = encodeURIComponent(a.board.board_id);
      return JSON.stringify({
        resource_id: a.board.board_id,
        title: a.board.title,
        access_url: "/api/v1/component-access/grants/" + p,
        share_url: "/api/v1/component-access/share/" + p
      });
    });
    return (p, g) => (n(), m(ee, null, [
      k(c(te), {
        label: "Share board",
        severity: "secondary",
        outlined: "",
        loading: l.value,
        disabled: e.busy,
        onClick: d
      }, {
        icon: G(() => [
          k(c(me), {
            icon: "tabler:share",
            "aria-hidden": "true"
          })
        ]),
        _: 1
      }, 8, ["loading", "disabled"]),
      o.value ? (n(), m("p", Av, R(o.value), 1)) : E("", !0),
      t.value ? (n(), m("kickside-share", {
        key: 1,
        config: v.value,
        onClose: g[0] || (g[0] = (i) => t.value = !1),
        onChanged: g[1] || (g[1] = (i) => p.$emit("shared"))
      }, null, 40, Rv)) : E("", !0)
    ], 64));
  }
}), Ov = {
  class: "work-stack",
  "aria-label": "Board visibility"
}, Nv = { class: "work-stack work-tight" }, Mv = {
  key: 0,
  class: "work-settings-list"
}, Fv = { class: "work-row-main" }, Lv = { class: "work-small work-muted" }, Bv = { class: "work-row-control" }, jv = { class: "work-row" }, zv = /* @__PURE__ */ $e({
  __name: "VisibilityEditor",
  props: {
    draft: {},
    boardId: {}
  },
  emits: ["validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = z(() => t.draft.visibility), d = z(() => (t.draft.fields ?? []).filter((b) => b.form === "text" && (!b.cardinality || b.cardinality === "one") && b.type !== "rollup" && b.index !== "number" && b.config?.case !== "insensitive")), v = z(() => d.value.find((b) => b.code === o.value?.field)?.type !== "option");
    function p(b) {
      if (o.value?.levels.some((f) => f.id === b)) return "This level is already in use.";
    }
    function g(b) {
      o.value?.levels.push({ id: b, holders: [] });
    }
    function i(b) {
      if (!b) {
        delete t.draft.visibility;
        return;
      }
      const f = d.value.find((w) => w.code === b);
      t.draft.visibility = { field: b, levels: (f?.options ?? []).map((w) => ({ id: w.id, holders: [] })) };
    }
    function s(b, f) {
      const w = o.value?.levels.find((x) => x.id === b);
      w && (w.holders = f ?? []);
    }
    function u(b) {
      if (!b || typeof b != "object" || Array.isArray(b)) return !1;
      const f = Object.entries(b);
      if (f.length !== 1) return !1;
      const [w, x] = f[0];
      return ["group", "user", "service", "field"].includes(w) && typeof x == "string" && x.length > 0;
    }
    function S(b) {
      return !!b && typeof b == "object" && "field" in b && typeof b.field == "string" && (!("bypass" in b) || b.bypass === "admin") && "levels" in b && Array.isArray(b.levels) && b.levels.every((f) => !!f && typeof f == "object" && "id" in f && typeof f.id == "string" && f.id.length > 0 && "holders" in f && Array.isArray(f.holders) && f.holders.every(u));
    }
    function y(b) {
      if (b !== void 0 && !S(b)) return "Enter a field and levels with valid holder rules. Omit bypass or set it to admin.";
      t.draft.visibility = b;
    }
    return (b, f) => (n(), m("section", Ov, [
      f[6] || (f[6] = r("h3", { class: "work-group-title" }, "Board visibility", -1)),
      f[7] || (f[7] = r("p", { class: "work-small work-muted" }, "Restrict items by their visibility level. People still need access to the board.", -1)),
      r("label", Nv, [
        f[4] || (f[4] = W("Visibility field ", -1)),
        k(c(fe), {
          "aria-label": "Visibility field",
          "model-value": o.value?.field ?? "",
          placeholder: "No additional restriction",
          options: [{ label: "No additional restriction", value: "" }, ...d.value.map((w) => ({ label: c(He)(w), value: w.code }))],
          optionLabel: "label",
          optionValue: "value",
          appendTo: "self",
          "onUpdate:modelValue": i
        }, null, 8, ["model-value", "options"])
      ]),
      o.value ? (n(), m(ee, { key: 0 }, [
        o.value.levels.length ? (n(), m("div", Mv, [
          (n(!0), m(ee, null, ue(o.value.levels, (w, x) => (n(), m("div", {
            key: w.id,
            class: "work-settings-row"
          }, [
            r("div", Fv, [
              r("strong", null, R(d.value.find(($) => $.code === o.value.field)?.options?.find(($) => $.id === w.id)?.label || w.id), 1),
              r("p", Lv, "Level " + R(x + 1), 1)
            ]),
            r("div", Bv, [
              k(Oo, {
                "board-id": e.boardId,
                label: "Who can see these items",
                "model-value": w.holders,
                "onUpdate:modelValue": ($) => s(w.id, $),
                onValidity: f[0] || (f[0] = ($) => l("validity", $))
              }, null, 8, ["board-id", "model-value", "onUpdate:modelValue"])
            ])
          ]))), 128))
        ])) : E("", !0),
        v.value ? (n(), H(ha, {
          key: o.value.field,
          action: "Add level",
          label: "New visibility level",
          validate: p,
          onAdd: g
        })) : E("", !0),
        r("label", jv, [
          k(c(et), {
            "model-value": o.value.bypass === "admin",
            "onUpdate:modelValue": f[1] || (f[1] = (w) => w ? o.value.bypass = "admin" : delete o.value.bypass)
          }, null, 8, ["model-value"]),
          f[5] || (f[5] = W(" Board administrators can see every level ", -1))
        ]),
        k(c(te), {
          label: "Remove visibility restriction",
          severity: "secondary",
          text: "",
          onClick: f[2] || (f[2] = (w) => delete e.draft.visibility)
        })
      ], 64)) : E("", !0),
      k(Rt, {
        label: "Visibility rules",
        "model-value": o.value,
        shape: "object",
        example: { field: "visibility", levels: [{ id: "internal", holders: [] }], bypass: "admin" },
        commit: y,
        onValidity: f[3] || (f[3] = (w) => l("validity", w))
      }, null, 8, ["model-value"])
    ]));
  }
}), qv = { class: "work-ia-section" }, Wv = {
  class: "work-settings-list",
  "aria-labelledby": "work-sharing-title"
}, Gv = { class: "work-settings-row" }, Kv = { class: "work-row-main" }, Hv = {
  key: 0,
  class: "work-muted work-small"
}, Yv = {
  key: 0,
  class: "work-member-preview",
  "aria-label": "People and groups with direct access"
}, Xv = { class: "work-spacer" }, Jv = {
  key: 1,
  class: "work-settings-row work-muted work-small"
}, Zv = {
  key: 2,
  class: "work-settings-row work-muted"
}, Qv = {
  key: 3,
  class: "work-settings-row"
}, _v = {
  key: 4,
  class: "work-settings-row work-muted",
  role: "status"
}, ef = /* @__PURE__ */ $e({
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
    const a = e, t = B(), l = B([]), o = z(() => t.value?.filter((b) => b.subject_type === "group").length ?? 0), d = z(() => (t.value?.length ?? 0) - o.value), v = z(() => [...t.value ?? []].sort((b, f) => +!!f.owner - +!!b.owner || f.access_mask - b.access_mask).slice(0, 6).map((b) => ({ ...b, permissions: s(b) }))), p = z(() => v.value.map((b) => ({ id: b.subject_id, kind: b.subject_type ?? "user" }))), g = Eo(() => a.boardId, p);
    function i(b) {
      return b.full_name || g.label({ id: b.subject_id, kind: b.subject_type ?? "user", email: b.email });
    }
    function s(b) {
      return b.owner ? "Owner" : l.value.filter((f) => (b.access_mask & f.bit) === f.bit).map((f) => f.label).join(", ");
    }
    const u = B(!1), S = ea();
    async function y() {
      const b = S();
      u.value = !1;
      try {
        const [{ data: f }, w] = await Promise.all([
          Cl.get("/api/v1/component-access/grants/" + encodeURIComponent(a.boardId)),
          Cl.get("/api/v1/components/access-model")
        ]);
        if (!b()) return;
        if (!f?.success || !Array.isArray(f.access)) throw new Error("Grants unavailable");
        t.value = f.access, l.value = w.data?.success && Array.isArray(w.data.capabilities) ? w.data.capabilities : [];
      } catch {
        b() && (t.value = void 0, u.value = !0);
      }
    }
    return Nl(() => S()), Ce(() => [a.active, a.boardId], () => {
      a.active && y();
    }, { immediate: !0 }), (b, f) => (n(), m("section", qv, [
      r("section", Wv, [
        r("div", Gv, [
          r("div", Kv, [
            f[1] || (f[1] = r("h3", {
              id: "work-sharing-title",
              class: "work-row-title"
            }, "Members and sharing", -1)),
            t.value ? (n(), m("p", Hv, R(d.value) + " " + R(d.value === 1 ? "person" : "people") + " and " + R(o.value) + " " + R(o.value === 1 ? "group" : "groups") + " with direct access", 1)) : E("", !0)
          ]),
          e.board ? (n(), H(Pv, {
            key: 0,
            board: e.board,
            busy: e.busy,
            onShared: y
          }, null, 8, ["board", "busy"])) : E("", !0)
        ]),
        v.value.length ? (n(), m("ul", Yv, [
          (n(!0), m(ee, null, ue(v.value, (w) => (n(), m("li", {
            key: w.subject_type + w.subject_id,
            class: "work-settings-row"
          }, [
            k(c(me), {
              icon: w.subject_type === "group" ? "tabler:users" : "tabler:user",
              "aria-hidden": "true"
            }, null, 8, ["icon"]),
            r("strong", Xv, R(i(w)), 1),
            w.permissions ? (n(), H(c(tt), {
              key: 0,
              class: "kx-tag-sm",
              severity: "secondary",
              value: w.permissions
            }, null, 8, ["value"])) : E("", !0)
          ]))), 128))
        ])) : E("", !0),
        t.value && t.value.length > v.value.length ? (n(), m("p", Jv, " See all " + R(t.value.length) + " people and groups under Share board. ", 1)) : t.value && !t.value.length ? (n(), m("p", Zv, "No direct grants yet.")) : u.value ? (n(), m("div", Qv, [
          f[2] || (f[2] = r("p", {
            class: "work-spacer work-muted",
            role: "alert"
          }, "Member summary is unavailable.", -1)),
          k(c(te), {
            label: "Reload members",
            severity: "secondary",
            text: "",
            onClick: y
          })
        ])) : t.value ? E("", !0) : (n(), m("p", _v, "Loading members…"))
      ]),
      k(Ne, {
        class: "work-disclosure work-visibility-disclosure",
        label: e.draft.visibility ? "Advanced · Item visibility rules set" : "Advanced · Item visibility"
      }, {
        default: G(() => [
          k(zv, {
            "board-id": e.boardId,
            draft: e.draft,
            onValidity: f[0] || (f[0] = (w) => b.$emit("validity", w))
          }, null, 8, ["board-id", "draft"])
        ]),
        _: 1
      }, 8, ["label"])
    ]));
  }
}), tf = { class: "work-settings-row" }, af = ["for"], lf = { class: "work-settings-row" }, of = { class: "work-row-main" }, nf = ["id"], sf = { class: "work-settings-grid" }, rf = { class: "work-stack work-tight" }, df = { class: "work-stack work-tight" }, uf = ["value", "inert"], cf = {
  key: 1,
  class: "work-muted work-small"
}, vf = {
  key: 0,
  class: "work-settings-row"
}, ff = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, mf = {
  key: 1,
  class: "work-muted work-small",
  role: "status"
}, pf = {
  key: 1,
  class: "work-board-identity work-stack work-tight"
}, gf = { class: "work-stack work-tight" }, bf = { class: "work-stack work-tight" }, hf = { class: "work-stack work-tight" }, yf = ["value", "inert"], kf = {
  key: 1,
  class: "work-muted work-small"
}, wf = { class: "work-row" }, $f = { class: "work-row" }, Vf = { class: "work-row work-board-title" }, xf = {
  key: 1,
  class: "work-identity-actions"
}, Cf = ["title"], Sf = {
  key: 2,
  class: "kx-err work-inline",
  role: "alert"
}, Tf = {
  key: 3,
  class: "work-muted work-small",
  role: "status"
}, If = /* @__PURE__ */ $e({
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
    const t = e, l = a, o = B(!1), d = B(!1), v = B(""), p = B(""), g = B(""), i = B(""), s = B(!1), u = B(!1), S = B(""), y = B(""), b = z(() => t.board?.access?.admin === !0), f = At(), w = At(), x = B({ title: "", description: "", icon: "", app: "" }), $ = z(() => [
      { id: "", title: "Default app" },
      ...t.boardApps ?? [],
      ...t.board?.ui_app && !t.boardApps?.some((O) => O.id === t.board?.ui_app) ? [{ id: t.board.ui_app, title: t.boardApps ? "Unavailable app" : "Configured board app", disabled: !0 }] : []
    ]), D = z(() => $.value.find((O) => O.id === i.value)?.title), A = z(() => !!t.boardApps?.length || !!t.board?.ui_app), j = z(() => ({
      title: t.board?.title ?? "",
      icon: t.board?.icon ?? "",
      description: t.board?.description ?? "",
      app: t.board?.ui_app ?? ""
    }));
    function ae() {
      x.value = j.value, v.value = j.value.title, g.value = j.value.icon, p.value = j.value.description, i.value = j.value.app;
    }
    function J() {
      Ut("wc-icon-picker").then((O) => s.value = O);
    }
    function se() {
      ae(), S.value = "", y.value = "", o.value = !0, J();
    }
    const ce = z(() => {
      const O = {};
      return v.value.trim() !== x.value.title && (O.title = v.value.trim()), p.value !== x.value.description && (O.description = p.value), g.value !== x.value.icon && (O.icon = g.value), i.value !== x.value.app && (O.ui_app = i.value), O;
    }), pe = z(() => (t.detail || o.value) && Object.keys(ce.value).length > 0);
    Ce(j, () => {
      t.detail && !pe.value && ae();
    }, { immediate: !0 }), Ce(d, (O) => {
      O && J();
    }), Ce(b, (O) => {
      O || ve();
    }), Ce(pe, (O) => l("dirty-change", O));
    function ve() {
      o.value = !1, S.value = "", y.value = "", ae();
    }
    async function oe() {
      if (!b.value || !t.board || u.value || !v.value.trim()) return;
      const O = ce.value;
      if (!Object.keys(O).length) {
        o.value = !1, y.value = "Nothing changed.";
        return;
      }
      u.value = !0, S.value = "";
      try {
        const Y = await Dt.updateBoard(t.board.board_id, O);
        v.value = v.value.trim(), x.value = { title: v.value, description: p.value, icon: g.value, app: i.value }, o.value = !1, y.value = Y.status === "unchanged" ? "Nothing changed." : "Board saved.", l("saved");
      } catch (Y) {
        S.value = nt(Y, "Could not save the board.");
      } finally {
        u.value = !1;
      }
    }
    return (O, Y) => e.detail ? (n(), m("form", {
      key: 0,
      class: "work-board-identity",
      "aria-label": "Edit board details",
      onSubmit: Oe(oe, ["prevent"])
    }, [
      r("div", tf, [
        r("label", {
          for: c(f),
          class: "work-row-main work-row-title"
        }, "Board name", 8, af),
        k(c(Te), {
          id: c(f),
          modelValue: v.value,
          "onUpdate:modelValue": Y[0] || (Y[0] = (F) => v.value = F),
          required: "",
          disabled: u.value || !b.value
        }, null, 8, ["id", "modelValue", "disabled"])
      ]),
      r("div", lf, [
        r("div", of, [
          r("h3", {
            class: "work-row-title",
            id: c(w)
          }, "Board app", 8, nf),
          Y[9] || (Y[9] = r("p", { class: "work-muted work-small" }, "Opens the board from Work navigation.", -1))
        ]),
        k(c(fe), {
          modelValue: i.value,
          "onUpdate:modelValue": Y[1] || (Y[1] = (F) => i.value = F),
          "aria-labelledby": c(w),
          options: $.value,
          placeholder: D.value,
          optionLabel: "title",
          optionValue: "id",
          optionDisabled: "disabled",
          appendTo: "self",
          disabled: u.value || !b.value || !A.value
        }, null, 8, ["modelValue", "aria-labelledby", "options", "placeholder", "disabled"])
      ]),
      Je(O.$slots, "default"),
      k(Ne, {
        open: d.value,
        "onUpdate:open": Y[4] || (Y[4] = (F) => d.value = F),
        class: "work-board-appearance",
        label: "Board description and icon"
      }, {
        default: G(() => [
          r("div", sf, [
            r("label", rf, [
              Y[10] || (Y[10] = W("Description", -1)),
              k(c(ya), {
                modelValue: p.value,
                "onUpdate:modelValue": Y[2] || (Y[2] = (F) => p.value = F),
                rows: "1",
                disabled: u.value || !b.value
              }, null, 8, ["modelValue", "disabled"])
            ]),
            r("div", df, [
              Y[11] || (Y[11] = r("span", null, "Board icon", -1)),
              s.value ? (n(), m("wc-icon-picker", {
                key: 0,
                value: g.value,
                fallback: "tabler:layout-kanban",
                inert: u.value || !b.value || void 0,
                onSelect: Y[3] || (Y[3] = (F) => g.value = F.detail)
              }, null, 40, uf)) : (n(), m("p", cf, "The icon picker is unavailable."))
            ])
          ])
        ]),
        _: 1
      }, 8, ["open"]),
      pe.value || S.value || y.value ? (n(), m("div", vf, [
        S.value ? (n(), m("p", ff, R(S.value), 1)) : y.value && !pe.value ? (n(), m("p", mf, R(y.value), 1)) : E("", !0),
        pe.value ? (n(), m(ee, { key: 2 }, [
          k(c(te), {
            label: "Save board details",
            type: "submit",
            size: "small",
            disabled: !v.value.trim() || u.value || !b.value,
            loading: u.value
          }, null, 8, ["disabled", "loading"]),
          k(c(te), {
            label: "Cancel",
            type: "button",
            severity: "secondary",
            text: "",
            size: "small",
            disabled: u.value,
            onClick: ve
          }, null, 8, ["disabled"])
        ], 64)) : E("", !0)
      ])) : E("", !0)
    ], 32)) : (n(), m("div", pf, [
      o.value ? (n(), m("form", {
        key: 0,
        class: "work-identity-edit",
        "aria-label": "Edit board",
        onClick: Y[8] || (Y[8] = Oe(() => {
        }, ["stop"])),
        onSubmit: Oe(oe, ["prevent"])
      }, [
        r("label", gf, [
          Y[12] || (Y[12] = W("Title", -1)),
          k(c(Te), {
            modelValue: v.value,
            "onUpdate:modelValue": Y[5] || (Y[5] = (F) => v.value = F),
            required: "",
            autofocus: "",
            disabled: u.value
          }, null, 8, ["modelValue", "disabled"])
        ]),
        r("label", bf, [
          Y[13] || (Y[13] = W("Description", -1)),
          k(c(ya), {
            modelValue: p.value,
            "onUpdate:modelValue": Y[6] || (Y[6] = (F) => p.value = F),
            rows: "1",
            disabled: u.value
          }, null, 8, ["modelValue", "disabled"])
        ]),
        r("div", hf, [
          Y[14] || (Y[14] = r("span", null, "Board icon", -1)),
          s.value ? (n(), m("wc-icon-picker", {
            key: 0,
            value: g.value,
            fallback: "tabler:layout-kanban",
            inert: u.value || void 0,
            onSelect: Y[7] || (Y[7] = (F) => g.value = F.detail)
          }, null, 40, yf)) : (n(), m("p", kf, "The icon picker is unavailable."))
        ]),
        r("div", wf, [
          k(c(te), {
            label: "Save",
            severity: "secondary",
            type: "submit",
            disabled: !v.value.trim() || u.value,
            loading: u.value,
            outlined: ""
          }, {
            icon: G(() => [
              k(c(me), {
                icon: "tabler:device-floppy",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled", "loading"]),
          k(c(te), {
            label: "Cancel",
            severity: "secondary",
            disabled: u.value,
            onClick: ve,
            outlined: ""
          }, {
            icon: G(() => [
              k(c(me), {
                icon: "tabler:x",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled"])
        ])
      ], 32)) : (n(), m(ee, { key: 1 }, [
        r("div", $f, [
          r("div", Vf, [
            e.board?.icon ? (n(), H(c(me), {
              key: 0,
              icon: e.board.icon,
              "aria-hidden": "true"
            }, null, 8, ["icon"])) : E("", !0),
            (n(), H(aa(e.compact ? "h2" : "h1"), {
              class: vt(e.compact ? "kx-card-name" : "kx-title")
            }, {
              default: G(() => [
                W(R(e.board?.title || "Untitled board"), 1)
              ]),
              _: 1
            }, 8, ["class"]))
          ]),
          e.compact ? Je(O.$slots, "title-end", {}, void 0, void 0, 0) : E("", !0),
          e.compact ? (n(), m("span", xf, [
            b.value ? (n(), H(c(te), {
              key: 0,
              severity: "secondary",
              text: "",
              size: "small",
              onClick: Oe(se, ["stop"]),
              "aria-label": "Edit board"
            }, {
              default: G(() => [
                k(c(me), {
                  icon: "tabler:pencil",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            })) : E("", !0),
            Je(O.$slots, "actions")
          ])) : b.value ? (n(), H(c(te), {
            key: 2,
            severity: "secondary",
            text: "",
            size: "small",
            onClick: Oe(se, ["stop"]),
            "aria-label": "Edit board"
          }, {
            default: G(() => [
              k(c(me), {
                icon: "tabler:pencil",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          })) : E("", !0),
          e.compact ? E("", !0) : Je(O.$slots, "title-end", {}, void 0, void 0, 3)
        ]),
        !e.compact && (e.subtitle || e.board?.description) ? (n(), m("p", {
          key: 0,
          class: "kx-head-sub",
          title: e.subtitle || e.board?.description
        }, R(e.subtitle || e.board?.description), 9, Cf)) : E("", !0)
      ], 64)),
      S.value ? (n(), m("p", Sf, R(S.value), 1)) : E("", !0),
      y.value ? (n(), m("p", Tf, R(y.value), 1)) : E("", !0)
    ]));
  }
}), Df = { class: "work-ia-section work-ia-general" }, Ef = {
  class: "work-settings-list work-board-details",
  "aria-label": "Board details"
}, Uf = {
  key: 0,
  class: "work-settings-row"
}, Af = { class: "work-settings-row" }, Rf = { class: "work-row-main" }, Pf = ["for"], Of = { class: "work-muted work-small" }, Nf = {
  class: "work-board-summary work-row work-wrap work-small",
  "aria-label": "Board summary"
}, Mf = { class: "work-muted" }, Ff = { key: 0 }, Lf = { key: 1 }, Bf = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, jf = {
  key: 0,
  class: "work-stack work-tight"
}, zf = {
  key: 0,
  class: "work-stack work-tight"
}, qf = {
  key: 1,
  class: "work-muted"
}, Wf = { class: "work-stack work-tight" }, Gf = { class: "work-spacer" }, Kf = /* @__PURE__ */ $e({
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
    const a = e, t = At(), l = {
      comments_per_item: "Comments per item",
      audit: "Change history",
      audit_days: "Change history retention",
      interval_days: "Time-in-state history retention",
      trash_days: "Trash retention",
      tombstone_days: "Deletion record retention"
    }, o = z(() => Object.keys(l).filter((y) => a.draft.policy?.[y] !== void 0));
    function d(y) {
      const b = a.draft.policy?.[y];
      return y === "audit" ? b === "off" ? "Off" : "Track field changes" : y === "comments_per_item" ? b : b === 0 ? y === "audit_days" || y === "interval_days" ? "365 days" : "Clean up immediately" : b === 1 ? "1 day" : b + " days";
    }
    const v = B(), p = B(!1);
    let g = "";
    Ce([() => a.active, () => a.board?.board_id, () => a.schema.generation], async ([y, b, f], w, x) => {
      if (!y || !b || g === b + "/" + f) return;
      v.value = void 0, p.value = !1;
      let $ = !0;
      x(() => $ = !1);
      try {
        const D = await Promise.all(Array.from(
          { length: Math.min(3, Math.max(0, f - 1)) },
          (A, j) => Dt.schema(b, f - j - 1)
        ));
        $ && (v.value = D, g = b + "/" + f);
      } catch {
        $ && (p.value = !0);
      }
    }, { immediate: !0 });
    function i(y) {
      return JSON.stringify(y, (b, f) => f && typeof f == "object" && !Array.isArray(f) ? Object.fromEntries(Object.entries(f).sort(([w], [x]) => w.localeCompare(x))) : f);
    }
    function s(y, b) {
      if (!b) return ["Initial board setup"];
      const f = y.declaration, w = b.declaration, x = [], $ = [
        ["Fields", f.fields, w.fields],
        ["Item types", f.item_types, w.item_types],
        ["Workflow", f.processes, w.processes],
        ["Links", f.relation_types, w.relation_types],
        ["Plugins and filters", [f.plugins, f.scopes], [w.plugins, w.scopes]],
        ["Item visibility", f.visibility, w.visibility],
        ["Board rules", f.policy, w.policy],
        ["Starting pack", y.pack, b.pack],
        ["Item key prefix", y.key_prefix, b.key_prefix]
      ];
      if (i(f.fields) !== i(w.fields)) {
        const A = f.fields?.filter((j) => !w.fields?.some((ae) => ae.code === j.code)) ?? [];
        A.length === 1 && x.push("Added " + He(A[0]));
      }
      const D = $.filter(([, A, j]) => i(A) !== i(j)).map(([A]) => A).filter((A) => A !== "Fields" || !x.length);
      return D.length && x.push(D.join(", ") + " updated"), x.length ? x : ["Board setup updated"];
    }
    const u = B(!1), S = z(() => {
      if (!v.value || a.schema.generation < 1) return [];
      const y = [a.schema, ...v.value];
      return y.slice(0, 3).map((b, f) => s(b, y[f + 1]));
    });
    return (y, b) => (n(), m("section", Df, [
      r("section", Ef, [
        e.board ? (n(), m("div", Uf, [
          b[8] || (b[8] = r("div", { class: "work-row-main" }, [
            r("h3", { class: "work-row-title" }, "Board access"),
            r("p", { class: "work-muted work-small" }, "Give people and groups access to this board.")
          ], -1)),
          r("div", null, [
            k(c(te), {
              label: "Share board",
              type: "button",
              severity: "secondary",
              outlined: "",
              onClick: b[0] || (b[0] = (f) => y.$emit("share"))
            }, {
              icon: G(() => [
                k(c(me), {
                  icon: "tabler:share",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            })
          ])
        ])) : E("", !0),
        (n(), H(If, {
          key: e.board?.board_id,
          board: e.board,
          "board-apps": e.boardApps,
          detail: "",
          onDirtyChange: b[2] || (b[2] = (f) => y.$emit("dirty-change", f)),
          onSaved: b[3] || (b[3] = (f) => y.$emit("saved"))
        }, {
          default: G(() => [
            r("div", Af, [
              r("div", Rf, [
                r("label", {
                  class: "work-row-title",
                  for: c(t)
                }, "Item key prefix", 8, Pf),
                r("p", Of, "Shown on items, for example " + R(e.draft.key_prefix || "WORK") + "-1.", 1)
              ]),
              k(c(Te), {
                id: c(t),
                modelValue: e.draft.key_prefix,
                "onUpdate:modelValue": b[1] || (b[1] = (f) => e.draft.key_prefix = f),
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
      r("section", Nf, [
        r("p", Mf, [
          e.board?.open_count !== void 0 && e.board.item_count !== void 0 ? (n(), m("span", Ff, R(e.board.open_count) + " open · " + R(e.board.item_count) + " total · ", 1)) : E("", !0),
          W(" " + R(e.packTitle || "No pack installed"), 1),
          e.outdated ? (n(), m("span", Lf, " · Update available")) : E("", !0)
        ]),
        e.packError ? (n(), m("p", Bf, R(e.packError), 1)) : E("", !0),
        e.packError ? (n(), H(c(te), {
          key: 1,
          label: "Reload packs",
          severity: "secondary",
          outlined: "",
          size: "small",
          onClick: b[4] || (b[4] = (f) => y.$emit("retry"))
        })) : E("", !0),
        e.packTitle ? e.outdated ? (n(), H(c(te), {
          key: 3,
          label: "Update pack",
          severity: "secondary",
          outlined: "",
          size: "small",
          disabled: !e.canUpgrade,
          title: e.upgradeReason,
          onClick: b[6] || (b[6] = (f) => y.$emit("upgrade"))
        }, null, 8, ["disabled", "title"])) : E("", !0) : (n(), H(c(te), {
          key: 2,
          label: "Install pack",
          severity: "secondary",
          outlined: "",
          size: "small",
          disabled: !e.canInstall,
          onClick: b[5] || (b[5] = (f) => y.$emit("install"))
        }, null, 8, ["disabled"]))
      ]),
      e.schema.pack ? (n(), H(Ne, {
        key: 0,
        open: u.value,
        "onUpdate:open": b[7] || (b[7] = (f) => u.value = f),
        class: "work-disclosure work-small",
        label: "Technical details"
      }, {
        default: G(() => [
          u.value ? (n(), m("dl", jf, [
            r("div", null, [
              b[9] || (b[9] = r("dt", null, "Pack ID", -1)),
              r("dd", null, [
                r("code", null, R(e.schema.pack.id), 1)
              ])
            ]),
            r("div", null, [
              b[10] || (b[10] = r("dt", null, "Pack version", -1)),
              r("dd", null, R(e.schema.pack.version), 1)
            ]),
            b[11] || (b[11] = r("div", null, [
              r("dt", null, "Pack tools"),
              r("dd", null, [
                r("code", null, "WorkPackPlan"),
                W(", "),
                r("code", null, "WorkPackApply")
              ])
            ], -1))
          ])) : E("", !0)
        ]),
        _: 1
      }, 8, ["open"])) : E("", !0),
      k(Ne, {
        class: "work-disclosure",
        label: "Recent setup changes"
      }, {
        default: G(() => [
          S.value.length ? (n(), m("ul", zf, [
            (n(!0), m(ee, null, ue(S.value, (f, w) => (n(), m("li", { key: w }, R(f.join(" · ")), 1))), 128))
          ])) : (n(), m("p", qf, R(p.value ? "Recent changes are unavailable." : v.value ? "No setup changes yet." : "Loading recent changes…"), 1))
        ]),
        _: 1
      }),
      o.value.length ? (n(), H(Ne, {
        key: 1,
        class: "work-settings-card work-disclosure",
        label: "Advanced · Existing board overrides"
      }, {
        default: G(() => [
          b[12] || (b[12] = r("p", { class: "work-muted" }, "Clear an override to use the Work application default.", -1)),
          r("ul", Wf, [
            (n(!0), m(ee, null, ue(o.value, (f) => (n(), m("li", {
              key: f,
              class: "work-row work-wrap"
            }, [
              r("span", Gf, R(l[f]) + " · " + R(d(f)), 1),
              k(c(te), {
                label: "Use default for " + l[f].toLowerCase(),
                disabled: e.disabled,
                size: "small",
                text: "",
                onClick: (w) => delete e.draft.policy[f]
              }, null, 8, ["label", "disabled", "onClick"])
            ]))), 128))
          ])
        ]),
        _: 1
      })) : E("", !0)
    ]));
  }
}), je = (e, a) => `${e} → ${a}`, yo = (e, a) => {
  const t = e.fields?.find((l) => l.code === a);
  return t ? He(t) : "Untitled field";
}, ko = {
  comments_per_item: "Comments per item",
  stage_timeout: "Default attempt timeout",
  stage_max_visits: "Default maximum visits",
  audit: "Audit trail",
  audit_days: "Audit history",
  trash_days: "Keep trashed items",
  tombstone_days: "Keep deletion records",
  interval_days: "Keep state history"
};
function wo(e, a) {
  if (a === void 0) return "Application default";
  if (e === "audit") return Ae(String(a));
  if (e === "stage_timeout") {
    const t = ca(String(a));
    if (t) return `${t.amount.toLocaleString()} ${t.amount === 1 ? t.unit.slice(0, -1) : t.unit}`;
  }
  if (e.endsWith("_days")) {
    const t = a === 0 && (e === "audit_days" || e === "interval_days") ? 365 : a;
    return `${t} ${t === 1 ? "day" : "days"}`;
  }
  return String(a);
}
function Hf(e, a) {
  const t = e.policy ?? {}, l = a.policy ?? {}, o = Object.keys(ko).flatMap((p) => t[p] === l[p] ? [] : [`${ko[p]} · ${je(wo(p, t[p]), wo(p, l[p]))}`]), d = (p) => p ? `${p.limit}${p.hard ? " (hard limit)" : ""}` : "No limit", v = /* @__PURE__ */ new Set([...Object.keys(t.wip ?? {}), ...Object.keys(l.wip ?? {})]);
  for (const p of v) {
    const g = d(t.wip?.[p]), i = d(l.wip?.[p]);
    if (g === i) continue;
    const s = (a.processes ?? []).flatMap((u) => u.states).find((u) => u.id === p) ?? (e.processes ?? []).flatMap((u) => u.states).find((u) => u.id === p);
    o.push(`${ge(s)} limit · ${je(g, i)}`);
  }
  return o;
}
function Yf(e, a, t) {
  const l = e.visibility, o = a.visibility, d = [];
  l?.field !== o?.field && d.push(je(
    l ? yo(e, l.field) : "No additional restriction",
    o ? yo(a, o.field) : "No additional restriction"
  ));
  const v = l?.levels ?? [], p = o?.levels ?? [], g = new Set([...v, ...p].map((i) => i.id));
  for (const i of g) {
    const s = v.find((f) => f.id === i), u = p.find((f) => f.id === i);
    if (s && u && JSON.stringify(s.holders) === JSON.stringify(u.holders)) continue;
    const S = (f) => f.fields?.find((w) => w.code === f.visibility?.field)?.options?.find((w) => w.id === i)?.label, y = S(a) || S(e) || Ae(i), b = (f) => f ? f.holders.map(t).join(", ") || "No extra access" : "No level";
    d.push(`${y} · ${je(b(s), b(u))}`);
  }
  return l?.bypass !== o?.bypass && d.push(o?.bypass === "admin" ? "Board administrators can see every level." : "Visibility levels now apply to board administrators."), d;
}
const va = {
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
function Xf(e, a, t) {
  const { what: l, detail: o, to: d } = e, p = `${t?.name || a?.name || "Untitled workflow"} · ${va[l] ?? "Workflow changed"}`, g = l.startsWith("state.") ? a?.states.find((y) => y.id === o) : void 0, i = l.startsWith("state.") ? t?.states.find((y) => y.id === o) : void 0, s = l.startsWith("transition.") ? a?.transitions?.find((y) => y.id === o) : void 0, u = l.startsWith("transition.") ? t?.transitions?.find((y) => y.id === o) : void 0;
  let S = "";
  if (l === "state.map") S = je(ge(g), ge(t?.states.find((y) => y.id === d)));
  else if (l === "state.name") S = je(ge(g), ge(i));
  else if (l === "state.kind") S = `${ge(i)} · ${je(Ba(g?.kind), Ba(i?.kind))}`;
  else if (l === "state.category" && g && i) S = `${ge(i)} · ${je(Pt(g.category), Pt(i.category))}`;
  else if (i || g) S = ge(i ?? g);
  else if (l === "transition.name" && s && u) S = je(ze(s), ze(u));
  else if (u && s && u.to !== s.to) {
    const y = ge(a?.states.find((f) => f.id === s.to)), b = ge(t?.states.find((f) => f.id === u.to));
    return { title: p, details: [ze(u), `Destination changes from ${y} to ${b}.`] };
  } else if (l === "transition.add" && u && t) {
    const y = u.from === "any" ? "Any state" : u.from.map((f) => ge(t.states.find((w) => w.id === f))).join(", "), b = ge(t.states.find((f) => f.id === u.to));
    return { title: p, details: [ze(u), je(y, b), ...u.auto ? ["Runs automatically."] : []] };
  } else u ? S = ze(u) : s ? S = ze(s) : l === "initial" ? S = je(ge(a?.states.find((y) => y.id === a.initial)), ge(t?.states.find((y) => y.id === t.initial))) : l === "name" && (S = je(a?.name || "Untitled workflow", t?.name || "Untitled workflow"));
  return { title: p, details: S ? [S] : [] };
}
function Jf(e, a, t, l) {
  const { code: o, what: d, detail: v } = e;
  if (o === "schema" || d === "visibility.remove")
    return d === "policy" ? { title: "Board limits and defaults", details: Hf(a, t) } : d.startsWith("visibility") ? { title: "Who can see items", details: Yf(a, t, l) } : d === "key_prefix" ? { title: "Item key prefix", details: [je(a.key_prefix ?? "Default", t.key_prefix ?? "Default")] } : { title: { plugins: "Board plugins changed", scopes: "Saved query filters changed", "rollup.recompute": "Calculated totals will update" }[d] ?? "Board settings changed", details: [] };
  if (o.startsWith("process ")) {
    const u = o.slice(8);
    return Xf(e, a.processes?.find((S) => S.id === u), t.processes?.find((S) => S.id === u));
  }
  if (o.startsWith("item_type ")) {
    const u = o.slice(10), S = a.item_types?.find((f) => f.id === u), y = t.item_types?.find((f) => f.id === u);
    return { title: `${y?.title || S?.title || "Item type"} · ${va[d] ?? "Item type changed"}`, details: d === "title" ? [je(S?.title || "Untitled item type", y?.title || "Untitled item type")] : [] };
  }
  if (o.startsWith("relation ")) {
    const u = o.slice(9), S = a.relation_types?.find((f) => f.id === u), y = t.relation_types?.find((f) => f.id === u), b = d === "label" ? [je([S?.outward, S?.inward].filter(Boolean).join(" / "), [y?.outward, y?.inward].filter(Boolean).join(" / "))] : [];
    return { title: `${y?.outward || S?.outward || "Link type"} · ${va[d] ?? "Link type changed"}`, details: b };
  }
  const p = t.fields?.find((u) => u.code === o), g = a.fields?.find((u) => p?.id !== void 0 ? u.id === p.id : u.code === (d.startsWith("renamed from ") ? d.slice(13) : o)), i = p ?? g;
  if (!i) return { title: va[d] ?? "Board settings changed", details: [] };
  const s = `${He(i)} · ${d.startsWith("renamed from ") ? "Field key" : va[d] ?? "Field settings changed"}`;
  if (d.startsWith("options.")) {
    const u = g?.options ?? [], S = p?.options ?? [], y = u.findIndex((D) => D.id === v), b = S.findIndex((D) => D.id === v), f = u[y], w = S[b], x = w?.label || f?.label || "Untitled choice", $ = f && w && f.label !== w.label ? [] : [x];
    if (f && w) {
      f.label !== w.label && $.push(je(f.label || "Untitled choice", w.label || "Untitled choice")), f.category !== w.category && $.push(`Category · ${je(f.category ? Pt(f.category) : "None", w.category ? Pt(w.category) : "None")}`);
      const D = f.order ?? y + 1, A = w.order ?? b + 1;
      D !== A && $.push(`Order · ${je(D, A)}`), f.color !== w.color && $.push(`Color · ${je(f.color ?? "Default", w.color ?? "Default")}`);
    }
    return { title: s, details: $ };
  }
  return d === "title" && g && p ? { title: s, details: [je(He(g), He(p))] } : { title: s, details: [] };
}
const Zf = {
  key: 0,
  class: "work-settings-card work-schema-plan work-stack",
  "aria-label": "Schema review"
}, Qf = { key: 0 }, _f = { class: "work-row work-wrap" }, em = { class: "work-muted" }, tm = {
  key: 0,
  class: "work-stack work-tight",
  "aria-label": "Plugin configuration"
}, am = {
  key: 1,
  class: "work-notice"
}, lm = {
  key: 2,
  class: "work-notice"
}, om = {
  key: 3,
  class: "work-stack work-tight",
  "aria-label": "Reviewed Flow bindings"
}, im = { key: 4 }, nm = {
  key: 5,
  class: "work-settings-table"
}, sm = { key: 0 }, rm = /* @__PURE__ */ $e({
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
    const a = e, t = {}, l = z(() => a.original ?? t), o = z(() => a.declaration ?? t), d = z(() => (a.plugins ?? []).flatMap((D) => {
      if (!D.config_schema) return [];
      const A = a.pluginConfigs?.[D.plugin], j = !l.value.plugins?.some((J) => J.use === D.plugin) && o.value.plugins?.some((J) => J.use === D.plugin);
      if (!A && !j) return [];
      const ae = Ml(D.config_schema).map((J) => {
        const se = A?.[J.key];
        return D.plugin === "kickside.work.planning:plugin" && J.key === "issue_types" ? { title: "Plan these item types", value: (Array.isArray(se) ? se.map((pe) => o.value.item_types?.find((ve) => ve.id === pe)?.title || Ae(pe)) : []).join(", ") || "Uses default" } : se === void 0 ? { title: J.title, value: "Uses default" } : J.schema.writeOnly || J.schema.format === "password" || typeof se == "object" ? { title: J.title, value: "Set" } : { title: J.title, value: typeof se == "boolean" ? se ? "On" : "Off" : String(se) };
      });
      return ae.length ? [{ id: D.plugin, title: D.title || D.plugin, fields: ae }] : [];
    })), v = z(() => (o.value.processes ?? []).flatMap((D) => D.states.flatMap((A) => {
      const j = A.run?.flow_ref;
      return j ? [{ key: D.id + ":" + A.id, process: D.name || "Untitled process", state: ge(A), reference: j }] : [];
    }))), p = B(/* @__PURE__ */ new Map());
    Ce(v, async (D, A, j) => {
      const ae = /* @__PURE__ */ new Map();
      p.value = ae;
      let J = !0;
      j(() => J = !1), await Promise.all([...new Set(D.map((se) => se.reference.id))].map(async (se) => {
        try {
          const ce = (await Pl.title(se))?.trim();
          J && ce && !Ei(ce) && p.value.set(se, ce);
        } catch {
          J && p.value.set(se, "Flow title unavailable");
        }
      }));
    }, { immediate: !0 });
    const g = z(() => [l.value, o.value].flatMap((D) => (D.visibility?.levels ?? []).flatMap((A) => A.holders.flatMap((j) => "group" in j ? [{ kind: "group", id: j.group }] : "user" in j ? [{ kind: "user", id: j.user }] : [])))), i = Eo(() => a.boardId ?? "", g);
    function s(D) {
      if ("user" in D) return i.label({ kind: "user", id: D.user });
      if ("group" in D) return i.label({ kind: "group", id: D.group });
      if ("field" in D) {
        const A = o.value.fields?.find((j) => j.code === D.field) ?? l.value.fields?.find((j) => j.code === D.field);
        return A ? He(A) : "People from a field";
      }
      return "Service";
    }
    const u = (D) => D.map((A) => {
      const j = Jf(A, l.value, o.value, s);
      if (A.what === "plugins") {
        const ae = new Set(l.value.plugins?.map((se) => se.use)), J = new Set(o.value.plugins?.map((se) => se.use));
        for (const se of a.plugins ?? [])
          ae.has(se.plugin) !== J.has(se.plugin) && j.details.push((J.has(se.plugin) ? "Enable " : "Turn off ") + (se.title || "an available plugin"));
      }
      if (A.what === "plugin.config") {
        const ae = a.plugins?.find((J) => J.plugin === A.code);
        return { change: A, title: (ae?.title || "Plugin") + " settings changed", details: [] };
      }
      return { change: A, ...j };
    }), S = z(() => u(a.plan?.changes.filter((D) => D.class !== "refused") ?? [])), y = z(() => u(a.plan?.refused ?? [])), b = z(() => {
      const D = a.plan?.migration;
      return !D || !y.value.length ? D : y.value.every((A) => A.change.what === "options.remove") ? "Add a new field with the choices you want to keep. Copy existing values into it before removing the old field." : y.value.every((A) => A.change.what === "state.remove") ? "Choose where existing items should move before removing their state." : D;
    }), f = {
      unchanged: ["No changes", "secondary"],
      cosmetic: ["Labels or settings", "secondary"],
      additive: ["New definitions", "success"],
      semantic: ["Affects existing items", "warn"],
      refused: ["Blocked", "danger"],
      initial: ["First setup", "secondary"]
    }, w = (D) => f[D]?.[0] ?? "Review needed", x = (D) => f[D]?.[1] ?? "secondary";
    function $(D) {
      const { detail: A, ...j } = D;
      return Ya(D.what === "invalid" || D.what.startsWith("views.") || D.what.startsWith("automation") ? D : j);
    }
    return (D, A) => e.plan ? (n(), m("section", Zf, [
      !e.plan.changes.length && !e.plan.refused.length && !e.configCount && !e.packReview ? (n(), m("p", Qf, "No changes to apply.")) : (n(), m(ee, { key: 1 }, [
        r("header", _f, [
          A[0] || (A[0] = r("h3", null, "Impact on this board", -1)),
          k(c(tt), {
            class: "kx-tag-sm",
            severity: x(e.plan.class)
          }, {
            default: G(() => [
              W(R(w(e.plan.class)), 1)
            ]),
            _: 1
          }, 8, ["severity"])
        ]),
        r("p", em, R(c(Ui)[e.plan.class] || "Review the changes below."), 1),
        d.value.length ? (n(), m("section", tm, [
          A[1] || (A[1] = r("h3", null, "Plugin configuration", -1)),
          (n(!0), m(ee, null, ue(d.value, (j) => (n(), m("div", {
            key: j.id
          }, [
            r("strong", null, R(j.title), 1),
            (n(!0), m(ee, null, ue(j.fields, (ae) => (n(), m("p", {
              key: ae.title
            }, R(ae.title) + " · " + R(ae.value), 1))), 128))
          ]))), 128))
        ])) : E("", !0),
        b.value ? (n(), m("p", am, R(b.value), 1)) : e.follows.length ? (n(), m("p", lm, "Existing items in " + R(e.follows.join(", ")) + " will follow the updated workflow.", 1)) : E("", !0),
        v.value.length ? (n(), m("section", om, [
          A[2] || (A[2] = r("h3", null, "Flow bindings", -1)),
          (n(!0), m(ee, null, ue(v.value, (j) => (n(), m("p", {
            key: j.key
          }, [
            W(R(j.process) + " / " + R(j.state) + " · ", 1),
            r("strong", null, R(p.value.get(j.reference.id) ?? "Published Flow") + " · v" + R(j.reference.version), 1)
          ]))), 128)),
          A[3] || (A[3] = r("p", { class: "work-muted work-small" }, "New entries use these exact published versions. Before replacing a binding, stop new entries, let existing runs and deliveries finish, pause the old launcher, save, then resume entries.", -1))
        ])) : E("", !0),
        Je(D.$slots, "default"),
        y.value.length ? (n(), m("h3", im, "Blocked changes")) : E("", !0),
        (n(!0), m(ee, null, ue(y.value, (j, ae) => (n(), H(c(zi), {
          key: ae,
          severity: "error",
          role: "alert"
        }, {
          default: G(() => [
            r("strong", null, R(j.title), 1),
            (n(!0), m(ee, null, ue(j.details, (J, se) => (n(), m("p", { key: se }, R(J), 1))), 128)),
            r("p", null, R($(j.change)), 1),
            k(Ne, {
              class: "work-small",
              label: "Technical details"
            }, {
              default: G(() => [
                r("code", null, R(j.change.what), 1)
              ]),
              _: 2
            }, 1024)
          ]),
          _: 2
        }, 1024))), 128)),
        S.value.length ? (n(), m("table", nm, [
          A[4] || (A[4] = r("thead", null, [
            r("tr", null, [
              r("th", { scope: "col" }, "Change"),
              r("th", { scope: "col" }, "Impact")
            ])
          ], -1)),
          r("tbody", null, [
            (n(!0), m(ee, null, ue(S.value, (j, ae) => (n(), m("tr", { key: ae }, [
              r("td", null, [
                r("strong", null, R(j.title), 1),
                (n(!0), m(ee, null, ue(j.details, (J, se) => (n(), m("p", { key: se }, R(J), 1))), 128)),
                j.change.count ? (n(), m("p", sm, R(j.change.count) + " " + R(j.change.count === 1 ? "item" : "items"), 1)) : E("", !0)
              ]),
              r("td", null, [
                k(c(tt), {
                  class: "kx-tag-sm",
                  severity: x(j.change.class)
                }, {
                  default: G(() => [
                    W(R(w(j.change.class)), 1)
                  ]),
                  _: 2
                }, 1032, ["severity"])
              ])
            ]))), 128))
          ])
        ])) : E("", !0)
      ], 64))
    ])) : E("", !0);
  }
}), dm = {
  class: "work-stack work-tight",
  "aria-label": "Pack resources"
}, um = {
  key: 0,
  class: "work-muted work-small"
}, cm = {
  key: 0,
  class: "work-stack",
  "aria-label": "Pack conflicts"
}, vm = { class: "work-stack work-tight work-pack-review-field" }, fm = { class: "work-config-fields" }, mm = { class: "work-json-example" }, pm = { class: "work-json-example" }, gm = {
  key: 1,
  class: "work-stack",
  "aria-label": "Pack state maps"
}, bm = /* @__PURE__ */ $e({
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
    const t = e, l = a, o = z(() => [
      { label: "Saved views", entries: t.plan.views?.map((s) => ({ id: s.id, name: s.title || s.id })) },
      { label: "Automations", entries: t.plan.automations?.map((s) => ({ id: s.id, name: s.id })) },
      { label: "Traits", entries: t.plan.traits?.map((s) => ({ id: s, name: s })) },
      { label: "Required plugins", entries: t.plan.plugins?.map((s) => ({ id: s, name: t.plugins?.find((u) => u.plugin === s)?.title || s })) }
    ].filter((s) => s.entries?.length));
    function d(s) {
      return t.original.processes?.find((u) => u.id === s)?.name || Ae(s);
    }
    function v(s) {
      const [u, ...S] = s.split("."), y = S.join(".");
      return u === "processes" ? d(y) : u === "fields" ? t.original.fields?.find((b) => b.code === y)?.title || Ae(y) : u === "item_types" ? t.original.item_types?.find((b) => b.id === y)?.title || Ae(y) : Ae(u);
    }
    function p(s) {
      return JSON.stringify(s ?? null, null, 2);
    }
    function g(s, u) {
      (t.request.resolutions ??= {})[s] = u, l("change");
    }
    function i(s, u, S) {
      ((t.request.maps ??= {})[s] ??= {})[u] = S, l("change");
    }
    return (s, u) => (n(), m(ee, null, [
      r("section", dm, [
        u[1] || (u[1] = r("h3", null, "Pack resources", -1)),
        r("p", null, [
          u[0] || (u[0] = W("Target version ", -1)),
          r("strong", null, R(e.plan.version), 1)
        ]),
        o.value.length ? (n(), m("p", um, "Resources included in this plan.")) : E("", !0),
        (n(!0), m(ee, null, ue(o.value, (S) => (n(), m("div", {
          key: S.label
        }, [
          r("h4", null, R(S.label), 1),
          r("ul", null, [
            (n(!0), m(ee, null, ue(S.entries, (y) => (n(), m("li", {
              key: y.id
            }, R(y.name), 1))), 128))
          ])
        ]))), 128))
      ]),
      e.plan.conflicts.length ? (n(), m("section", cm, [
        u[4] || (u[4] = r("h3", null, "Local edits conflict", -1)),
        u[5] || (u[5] = r("p", { class: "work-muted work-small" }, "Choose which declaration to keep for each conflict, then review again.", -1)),
        (n(!0), m(ee, null, ue(e.plan.conflicts, (S) => (n(), m("div", {
          key: S.path,
          class: "work-stack work-tight"
        }, [
          r("label", vm, [
            W(R(v(S.path)), 1),
            k(c(fe), {
              "model-value": e.request.resolutions?.[S.path],
              "aria-label": "Resolution for " + v(S.path),
              disabled: e.disabled,
              appendTo: "self",
              placeholder: "Choose a resolution",
              optionLabel: "label",
              optionValue: "value",
              options: [{ label: "Keep local edits", value: "local" }, { label: "Use pack changes", value: "incoming" }],
              "onUpdate:modelValue": (y) => g(S.path, y)
            }, null, 8, ["model-value", "aria-label", "disabled", "onUpdate:modelValue"])
          ]),
          k(Ne, {
            class: "work-json-disclosure",
            label: "Compare declarations"
          }, {
            default: G(() => [
              r("div", fm, [
                r("section", null, [
                  u[2] || (u[2] = r("h4", null, "Local edits", -1)),
                  r("pre", mm, R(p(S.local_value)), 1)
                ]),
                r("section", null, [
                  u[3] || (u[3] = r("h4", null, "Pack changes", -1)),
                  r("pre", pm, R(p(S.incoming)), 1)
                ])
              ])
            ]),
            _: 2
          }, 1024)
        ]))), 128))
      ])) : E("", !0),
      Object.keys(e.plan.maps).length ? (n(), m("section", gm, [
        u[6] || (u[6] = r("h3", null, "Required state maps", -1)),
        u[7] || (u[7] = r("p", { class: "work-muted work-small" }, "Review the proposed destinations for existing items. Each destination is editable.", -1)),
        (n(!0), m(ee, null, ue(e.plan.maps, (S, y) => (n(), m("div", {
          key: y,
          class: "work-stack"
        }, [
          r("h4", null, R(d(y)), 1),
          (n(!0), m(ee, null, ue(S, (b, f) => (n(), m("label", {
            key: f,
            class: "work-stack work-tight work-pack-review-field"
          }, [
            W("Move items from " + R(c(ge)(e.original.processes?.find((w) => w.id === y)?.states.find((w) => w.id === f))), 1),
            k(c(fe), {
              "model-value": e.request.maps?.[y]?.[f],
              "aria-label": "Move items from " + c(ge)(e.original.processes?.find((w) => w.id === y)?.states.find((w) => w.id === f)),
              disabled: e.disabled,
              appendTo: "self",
              optionLabel: "label",
              optionValue: "value",
              options: e.plan.declaration.processes?.find((w) => w.id === y)?.states.map((w) => ({ label: c(ge)(w), value: w.id })) ?? [],
              "onUpdate:modelValue": (w) => i(y, f, w)
            }, null, 8, ["model-value", "aria-label", "disabled", "options", "onUpdate:modelValue"])
          ]))), 128))
        ]))), 128))
      ])) : E("", !0)
    ], 64));
  }
});
function hm(e) {
  const { schema: a, configs: t, busy: l } = e, { packs: o, loading: d, error: v, load: p, reset: g } = Ai(), i = z(() => o.value.filter(Ri)), s = z(() => o.value.map(Pi)), u = B(!1), S = B(""), y = z(() => s.value.find((N) => N.id === S.value && !N.disabled)), b = B(), f = B(), w = B(), x = B(!1), $ = B(""), D = B(), A = B(""), j = z(() => D.value?.result), ae = z(() => !!j.value && j.value.status !== "done"), J = z(() => !!b.value || e.schemaDirty()), se = z(() => !l.value && !J.value && !e.migrationPending() && !ae.value), ce = z(() => x.value ? f.value : void 0), pe = z(() => !!ce.value && !!w.value && JSON.stringify(w.value.request) === JSON.stringify(b.value)), ve = z(() => e.canReview() && !e.migrationPending() && !l.value && pe.value && ce.value?.class !== "refused" && !ce.value?.refused.length && f.value?.conflicts.every((N) => !!b.value?.resolutions?.[N.path])), oe = z(() => i.value.find((N) => N.id === b.value?.pack)?.plugins.filter((N) => !a.value?.plugins?.some((Z) => Z.plugin === N.plugin && Z.active)).map((N) => ({ use: N.plugin })) ?? []), O = z(() => i.value.find((N) => N.id === a.value?.pack?.id)?.title || "Installed pack"), Y = z(() => !v.value && !!a.value?.outdated && s.value.some((N) => N.id === a.value?.pack?.id && !N.disabled)), F = z(() => v.value ? "Reload packs to check available upgrades." : ae.value ? "Finish the current pack installation before upgrading." : Y.value ? J.value ? "Discard the current draft before upgrading." : e.migrationPending() ? "Finish the current migration before upgrading." : l.value ? "Wait for the current request to finish." : void 0 : "Install an available version of this pack to upgrade."), ne = ea();
  function be() {
    w.value = void 0;
  }
  function Ie() {
    ne(), be(), x.value = !1;
  }
  function K() {
    b.value = void 0, f.value = void 0, Ie();
  }
  function q() {
    K(), g(), D.value = void 0, A.value = "";
  }
  function M() {
    $.value = "";
  }
  Ce(t, (N) => {
    b.value && (Object.keys(N).length ? b.value.plugin_configs = Zt(N) : delete b.value.plugin_configs);
  }, { deep: !0, flush: "sync" });
  async function de() {
    if (!b.value || l.value || !e.canReview()) return;
    const N = ne(), Z = Zt(b.value), U = JSON.stringify(b.value);
    l.value = !0, M(), e.clearSaved();
    try {
      const X = await Oi(Z, (T) => qt.packPlan(e.boardId(), T));
      if (!N() || U !== JSON.stringify(b.value)) return;
      f.value = X.plan, x.value = !0, b.value = X.request, w.value = { request: Zt(X.request), key: crypto.randomUUID() };
    } catch (X) {
      N() && (be(), $.value = nt(X, "Could not review the pack."));
    } finally {
      l.value = !1;
    }
  }
  async function h() {
    if (!a.value?.pack || !se.value || !Y.value) return;
    const N = i.value.find((Z) => Z.id === a.value?.pack?.id);
    N && (b.value = to(N, a.value.generation), e.openReview(), await de());
  }
  async function P() {
    const N = i.value.find((Z) => Z.id === S.value);
    !a.value || !N || !y.value || !se.value || d.value || (b.value = to(N, a.value.generation), u.value = !1, e.openReview(), await de());
  }
  async function C(N, Z, U) {
    const X = e.boardId(), T = await qt.packApply(X, N, Z);
    e.boardId() === X && (D.value = { request: N, key: Z, result: T, draft: U }, await e.applied(T.generation, U));
  }
  async function V() {
    if (!ve.value || !w.value) return !1;
    l.value = !0, M();
    try {
      return await C(Zt(w.value.request), w.value.key, e.draftSnapshot()), !0;
    } catch (N) {
      return $.value = nt(N, "Could not apply the pack upgrade."), !1;
    } finally {
      l.value = !1;
    }
  }
  async function I() {
    const N = D.value;
    if (!(!N || !ae.value || l.value || !e.authorized())) {
      l.value = !0, A.value = "";
      try {
        await C(N.request, N.key, N.draft);
      } catch (Z) {
        A.value = nt(Z, "Could not continue the pack installation.");
      } finally {
        l.value = !1;
      }
    }
  }
  return {
    choices: s,
    loading: d,
    error: v,
    load: p,
    installing: u,
    installPack: S,
    installChoice: y,
    canManage: se,
    title: O,
    upgradeAvailable: Y,
    upgradeReason: F,
    request: b,
    preview: f,
    plan: ce,
    reviewError: $,
    isReviewed: pe,
    canApply: ve,
    plugins: oe,
    result: j,
    inProgress: ae,
    operationError: A,
    install: P,
    upgrade: h,
    review: de,
    apply: V,
    continueInstallation: I,
    changed: be,
    invalidate: Ie,
    clearReviewError: M,
    clear: K,
    reset: q
  };
}
const ym = { class: "work-section-layout" }, km = { class: "kx-main" }, wm = ["aria-label"], $m = {
  key: 1,
  class: "kx-err work-alert-actions"
}, Vm = { role: "alert" }, xm = {
  key: 2,
  class: "work-notice",
  role: "status"
}, Cm = {
  key: 3,
  class: "kx-loading",
  role: "status"
}, Sm = {
  key: 4,
  class: "work-notice",
  role: "alert"
}, Tm = {
  key: 5,
  class: "work-settings-body"
}, Im = {
  key: 0,
  class: "work-notice work-stack work-tight",
  "aria-label": "Pack installation"
}, Dm = {
  key: 0,
  role: "status"
}, Em = {
  key: 1,
  role: "status"
}, Um = { class: "work-small" }, Am = {
  key: 2,
  class: "kx-err",
  role: "alert"
}, Rm = { key: 3 }, Pm = {
  key: 1,
  class: "work-notice",
  role: "alert"
}, Om = {
  key: 2,
  class: "work-notice"
}, Nm = ["id"], Mm = ["disabled", "inert"], Fm = {
  key: 3,
  class: "work-ia-section"
}, Lm = {
  key: 0,
  class: "work-muted"
}, Bm = {
  key: 5,
  class: "work-ia-section"
}, jm = { class: "work-review-layout" }, zm = { class: "work-muted" }, qm = ["aria-busy"], Wm = {
  key: 0,
  role: "status"
}, Gm = {
  key: 1,
  role: "alert",
  class: "kx-err"
}, Km = {
  key: 2,
  role: "alert"
}, Hm = { key: 6 }, Ym = { class: "work-dialog-actions" }, Xm = {
  key: 3,
  class: "work-muted",
  role: "status"
}, Jm = {
  key: 0,
  class: "work-muted",
  role: "status"
}, Zm = {
  key: 1,
  class: "kx-err work-alert-actions"
}, Qm = { role: "alert" }, _m = {
  key: 2,
  class: "work-stack work-tight"
}, ep = {
  key: 0,
  class: "work-pack-unavailable work-block"
}, tp = {
  key: 3,
  class: "work-muted"
}, ap = { class: "work-dialog-actions" }, lp = /* @__PURE__ */ $e({
  __name: "BoardSettings",
  props: {
    boardId: {},
    embedded: { type: Boolean },
    focusBack: { type: Boolean },
    route: {}
  },
  emits: ["dirty-change", "navigate"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = Ji(), d = At(), v = B();
    let p, g = "";
    const i = () => JSON.stringify([gt.value, q.value, re.request, [...Ze.value]]), s = z(() => ({
      value: "all-boards",
      label: t.embedded ? "All boards" : "Back to board",
      icon: t.embedded ? "tabler:table" : "tabler:layout-kanban"
    })), u = B();
    Ce(u, (Q) => {
      t.focusBack && Q?.$el.querySelector(".kx-settings-rail-item")?.focus();
    }, { flush: "post", once: !0 });
    const S = [
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
    }, f = B("");
    function w(Q, L = "") {
      y.value = Q, f.value = L ? b[Q] + "/" + L : "";
    }
    function x(Q, L = "") {
      w(Q, L), t.route !== void 0 && l("navigate", [b[Q], ...L ? [encodeURIComponent(L)] : []].join("/"));
    }
    function $(Q, L, _) {
      if (t.route === void 0 || b[y.value] !== Q || !_ && f.value !== Q + "/" + L) return;
      const Ve = ne.value?.declaration;
      (Q === "items" ? Ve?.item_types?.some((De) => De.id === L) : Q === "fields" ? Ve?.fields?.some((De) => De.code === L) : Q === "links" ? Ve?.relation_types?.some((De) => De.id === L) : Q === "plugins" ? M.value?.schema_options.plugins.some((De) => De.plugin === L) : Q === "workflow" && Ve?.processes?.some((De) => De.states.some((Re) => De.id + ".state." + Re.id === L) || De.transitions?.some((Re) => De.id + ".transition." + Re.id === L))) && x(y.value, _ ? L : "");
    }
    Co(Xa, { selected: f, choose: $ });
    function D(Q) {
      if (Q === s.value.value) {
        di();
        return;
      }
      (Q === "General" || S.some((L) => L.items.some((_) => _.value === Q))) && x(Q);
    }
    async function A() {
      x("Access"), await ct(), v.value?.focus();
    }
    const j = {
      General: "Manage the board name, item key prefix and app.",
      "Item types": "Choose the fields, parent relationships and workflow for each kind of work.",
      Fields: "Choose what information people can capture on items.",
      Links: "Configure link types and how they appear on related items.",
      Workflow: "Select a state or transition to edit how work moves.",
      Access: "Who can use this board?",
      Plugins: "Choose which plugins this board uses."
    }, ae = B(""), J = B();
    function se(Q, L, _) {
      _.currentTarget instanceof HTMLElement && (J.value = { section: Q, type: L, opener: _.currentTarget }, Q === "Fields" && (ae.value = L.id), x(Q));
    }
    function ce(Q) {
      const L = J.value;
      if (!L) return;
      Q !== void 0 && (L.type.process = Q);
      const _ = L.type.id, Ve = ne.value?.declaration.item_types?.some((Ge) => Ge.id === _);
      x("Item types", Ve ? _ : ""), J.value = void 0, L.section === "Fields" && ct(() => L.opener.focus());
    }
    const pe = B(!1), ve = B(""), oe = B();
    Ce(y, (Q) => {
      v.value?.scrollTo({ top: 0 }), J.value && Q !== J.value.section && (J.value = void 0);
    });
    function O() {
      pe.value = !1, ve.value = "", re.clearReviewError(), Sa.value = !1;
    }
    async function Y(Q) {
      il.value && (Ct.value.size && (y.value !== "Plugins" && (x("Plugins"), await ct()), el.value && !await el.value.reportValidity()) || !ii() || Ze.value.size || (oe.value = Q, pe.value = !0, rl()));
    }
    const F = B(/* @__PURE__ */ new Set(["General"]));
    Ce(y, (Q) => F.value.add(Q));
    const ne = B(), be = B(), Ie = B(), K = B({}), q = B({}), M = B(), de = B(!1), h = B(!0), P = B(!1), C = B(""), V = B(""), I = z(() => K.value.processes ?? []), N = z(() => de.value && ne.value ? [
      { heading: Ie.value?.title || "Board settings", items: [{ value: "General", label: "General", icon: "tabler:settings" }] },
      ...S
    ] : []), Z = B(), U = B(!1), X = ea();
    async function T(Q) {
      const L = X();
      U.value = !1;
      try {
        const _ = await Dt.stateCounts(Q);
        L() && (Z.value = _);
      } catch {
        L() && (U.value = !0, Z.value = void 0);
      }
    }
    Ce(y, (Q) => {
      de.value && Q === "Workflow" && T(t.boardId);
    });
    const le = B(), ke = B(), Ee = B(""), Ue = B([]), qe = B(!1), xt = B(0), Ze = B(/* @__PURE__ */ new Set()), _a = B(), el = B(), Ct = B(/* @__PURE__ */ new Set()), ei = z(() => [...Ze.value].some((Q) => !Ct.value.has(Q)));
    function ti(Q, L) {
      const _ = "plugin:" + Q;
      L ? Ct.value.delete(_) : Ct.value.add(_);
    }
    const Kl = ea(), tl = ea(), gt = z(() => cl(K.value, ne.value?.declaration ?? {})), Hl = z(() => Ze.value.size > 0 || Ct.value.size > 0 || !!ne.value && (JSON.stringify(gt.value) !== JSON.stringify(cl(ne.value.declaration, ne.value.declaration)) || Object.keys(q.value).length > 0)), xa = z(() => !!be.value?.migration_error || Ie.value?.status === "migrating"), bt = z(() => !!ne.value && !!be.value && ne.value.generation !== be.value.generation), al = () => de.value && !bt.value && !Ze.value.size && !Ct.value.size, re = hi(hm({
      boardId: () => t.boardId,
      schema: ne,
      configs: q,
      busy: P,
      schemaDirty: () => Hl.value,
      migrationPending: () => xa.value,
      canReview: al,
      authorized: () => de.value,
      draftSnapshot: i,
      openReview: () => {
        oe.value = void 0, pe.value = !0;
      },
      clearSaved: () => {
        V.value = "";
      },
      applied: si
    })), Ot = z(() => re.request ? re.plan : le.value), ll = z(() => re.request ? re.reviewError : ve.value), ol = z(() => [...Ue.value, ...Ot.value?.refused ?? []]), Ca = z(() => !!re.request || Hl.value), il = z(() => Ca.value && !(re.inProgress && re.request)), nl = B(!1), Yl = z(() => Ca.value || nl.value);
    Ce(Yl, (Q) => l("dirty-change", Q), { immediate: !0, flush: "sync" });
    const ai = z(() => (!oa.value.renamed.length || Sa.value) && al() && !P.value && !qe.value && !xa.value && le.value && (le.value.changes.length > 0 || Object.keys(q.value).length > 0) && le.value.class !== "refused" && !le.value.refused.length && ke.value?.matches(gt.value, ne.value?.generation ?? -1, q.value)), Xl = z(() => re.request ? re.canApply : ai.value), Jl = z(() => re.request ? re.isReviewed : !!le.value), Sa = B(!1), oa = z(() => {
      const Q = ne.value?.declaration, L = [], _ = [];
      for (const Ve of I.value) {
        const Ge = Q?.item_types?.filter((Re) => Re.process === Ve.id) ?? [], De = Q?.processes?.find((Re) => Re.id === Ve.id);
        for (const Re of De?.states ?? []) {
          const Ia = Ve.states.find((Nt) => Nt.id === Re.id);
          if (Ia && Ia.name === Re.name) continue;
          const ul = [...Ot.value?.refused ?? [], ...Ot.value?.changes ?? []].find((Nt) => Nt.code === "process " + Ve.id && Nt.detail === Re.id && ["state.remove", "state.map"].includes(Nt.what))?.count ?? Ge.reduce((Nt, ci) => Nt + (Z.value?.[ci.id]?.[Re.id] ?? 0), 0);
          ul && (Ia ? _.push({ process: Ve, state: Re, name: ge(Ia), count: ul }) : L.push({ process: Ve, state: Re, count: ul }));
        }
      }
      return { removed: L, renamed: _ };
    });
    function li(Q, L, _) {
      Q.map = { ...Q.map, [L]: _ }, rl();
    }
    const Zl = z(() => re.preview?.declaration ?? ke.value?.declaration), oi = z(() => {
      const Q = Zl.value;
      return !Ot.value || !Q ? [] : Ni(Ot.value, Q).map((L) => Q.processes?.find((_) => _.id === L)?.name || "Untitled process");
    });
    function ht() {
      Ue.value = [], tl(), le.value = void 0, ke.value = void 0, Ee.value = "", re.invalidate();
    }
    Ce([gt, q], ht, { deep: !0, flush: "sync" }), Ce(Ca, (Q) => {
      Q && (V.value = "");
    });
    function ia(Q, L) {
      L ? Ze.value.delete(Q) : Ze.value.add(Q), ht();
    }
    function sl(Q) {
      re.clear(), J.value = void 0, xt.value++, ne.value = Q, K.value = Zt(Q.declaration), q.value = {}, Ze.value.clear(), Ct.value.clear(), ht();
    }
    async function rt(Q = !1) {
      const L = Kl();
      try {
        const [_, Ve, Ge] = await Promise.all([Dt.schema(t.boardId, void 0, !0).catch((Re) => {
          if (Re instanceof Vl && Re.details?.code === "board_schema_missing") return { generation: 0, declaration: {}, compiled: {}, key_prefix: "", as_of: 0 };
          throw Re;
        }), Dt.options(t.boardId), Dt.boards()]);
        if (!L()) return;
        if (de.value = Ve.access.admin, M.value = Ve, Ie.value = Ge.find((Re) => Re.board_id === t.boardId), !de.value) {
          ne.value = void 0, K.value = {}, ht();
          return;
        }
        C.value = "";
        const De = Mi(_);
        be.value = De, p !== void 0 && De.generation >= p ? (p = void 0, g === i() && sl(De), g = "") : (Q || !ne.value || !Ca.value && De.generation !== ne.value.generation) && sl(De), bt.value && ht(), await re.load(L), L() && y.value === "Workflow" && T(t.boardId);
      } catch (_) {
        if (!L()) return;
        _ instanceof Vl && (_.status === 403 || _.kind?.toLowerCase() === "permission_denied") && (de.value = !1), ht(), C.value = nt(_, "Could not load board settings.");
      } finally {
        L() && (h.value = !1);
      }
    }
    function ii() {
      for (const Q of Array.from(_a.value?.elements ?? []))
        if ((Q instanceof HTMLInputElement || Q instanceof HTMLSelectElement || Q instanceof HTMLTextAreaElement) && !(Q.form !== _a.value || Q.closest('[style*="display: none"]:not(.p-accordioncontent)')) && !Q.reportValidity()) {
          const _ = Q.closest('.p-accordioncontent[style*="display: none"]')?.closest(".kx-disclosure")?.querySelector('.kx-disclosure-toggle[aria-expanded="false"]');
          return _ && (_.click(), ct(() => Q.reportValidity())), !1;
        }
      return !0;
    }
    async function rl() {
      if (re.request) return re.review();
      if (!ne.value || P.value || !al()) return;
      const Q = tl(), L = ao(gt.value, ne.value.generation, q.value);
      P.value = !0, ve.value = "", V.value = "";
      try {
        const _ = (L.declaration.processes ?? []).some((Ge) => ne.value?.declaration.processes?.find((De) => De.id === Ge.id)?.states.some((De) => Ge.states.some((Re) => Re.id === De.id && Re.name !== De.name))), [Ve] = await Promise.all([
          qt.plan(t.boardId, L),
          _ ? T(t.boardId) : void 0
        ]);
        if (_ && U.value) {
          ht(), ve.value = "Could not check which items use the renamed states. Check the impact again.";
          return;
        }
        if (!Q() || Ze.value.size || !L.matches(gt.value, ne.value.generation, q.value)) return;
        le.value = Ve, ke.value = L, Ee.value = crypto.randomUUID(), pe.value = !0;
      } catch (_) {
        Q() && (ht(), ve.value = nt(_, "Could not review changes."), Ue.value = Fi(_, gt.value));
      } finally {
        P.value = !1;
      }
    }
    async function ni() {
      if (!Xl.value) return;
      if (re.request) {
        await re.apply() && O();
        return;
      }
      if (!ke.value) return;
      P.value = !0, ve.value = "", V.value = "";
      const Q = i();
      try {
        p = (await qt.apply(t.boardId, ke.value, Ee.value)).generation, g = Q, await rt(), V.value = "Board changes applied.", O();
      } catch (L) {
        ve.value = nt(L, "Could not apply the board changes.");
      } finally {
        P.value = !1;
      }
    }
    async function si(Q, L) {
      L === i() && (p = Q, g = L), await rt();
    }
    async function ri() {
      if (!P.value) {
        P.value = !0, C.value = "";
        try {
          const Q = await qt.resume(t.boardId);
          V.value = Q.resumed ? "Migration resumes." : "Migration is already running.", await rt();
        } catch (Q) {
          C.value = nt(Q, "Could not resume migration.");
        } finally {
          P.value = !1;
        }
      }
    }
    async function Ta(Q, L) {
      if (!ne.value || !de.value || P.value || qe.value) return "Wait for the current change to finish.";
      if (bt.value) return "Discard the stale draft before removing a definition.";
      const _ = ne.value.generation, Ve = JSON.stringify(gt.value), Ge = Zt(K.value);
      wa(Ge, Q, L), qe.value = !0;
      try {
        const De = await qt.plan(t.boardId, ao(cl(Ge, ne.value.declaration), _, q.value));
        if (!de.value || bt.value || ne.value.generation !== _ || JSON.stringify(gt.value) !== Ve) return "The draft changes during the check. Try the removal again.";
        const Re = Li(De, Q, L);
        if (Re) return Re;
        if (De.class === "refused") return "Resolve the blocked changes in your draft before removing this definition.";
      } catch (De) {
        return nt(De, "Could not check this removal.");
      } finally {
        qe.value = !1;
      }
    }
    async function di() {
      if (t.embedded) {
        o({ name: "boards" });
        return;
      }
      Yl.value && !await Uo.confirm({ header: "Discard changes?", message: "Your unsaved board settings will be discarded.", acceptLabel: "Discard", rejectLabel: "Keep editing" }) || o({ name: "board", board: t.boardId });
    }
    function ui() {
      p = void 0, be.value && sl(be.value), V.value = "", C.value = "", O();
    }
    Ce(() => t.boardId, () => {
      nl.value = !1, p = void 0, re.reset(), ne.value = void 0, be.value = void 0, Ie.value = void 0, q.value = {}, Ze.value.clear(), Ct.value.clear(), X(), Z.value = void 0, ae.value = "", J.value = void 0, F.value = /* @__PURE__ */ new Set(["General"]), w("General"), O(), de.value = !1, h.value = !0, rt(!0);
    }), Ce([() => t.route, () => t.boardId], ([Q]) => {
      if (Q === void 0) return;
      const [L, _] = Q.split("/"), Ve = Object.keys(b).find((De) => b[De] === L) ?? "General";
      let Ge = "";
      try {
        _ && (Ge = decodeURIComponent(_));
      } catch {
      }
      Ve === "Fields" && Ge && f.value !== "fields/" + Ge && (ae.value = ""), w(Ve, Ge), F.value.add(Ve);
    }, { immediate: !0 });
    let dl = () => {
    };
    return Ce(() => t.boardId, (Q) => {
      dl(), dl = Bi(`component.${Q}`, () => {
        rt();
      });
    }, { immediate: !0 }), yi(rt), Nl(() => {
      dl(), Kl(), tl(), X(), re.invalidate();
    }), (Q, L) => (n(), m("section", {
      class: vt(["work-settings-shell work-ia", { "work-embedded": e.embedded }])
    }, [
      r("div", ym, [
        k(Xi, {
          ref_key: "rail",
          ref: u,
          label: "Board settings sections",
          value: y.value,
          groups: N.value,
          "leading-item": s.value,
          "onUpdate:value": D
        }, null, 8, ["value", "groups", "leading-item"]),
        r("div", km, [
          r("div", {
            ref_key: "pane",
            ref: v,
            class: "kx-main-scroll work-settings-content",
            role: "region",
            "aria-label": y.value,
            tabindex: "-1"
          }, [
            de.value && ne.value ? (n(), H(Ev, {
              key: 0,
              title: y.value,
              description: j[y.value]
            }, Ka({ _: 2 }, [
              il.value || y.value === "Plugins" ? {
                name: "actions",
                fn: G(() => [
                  y.value === "Plugins" ? (n(), H(c(te), {
                    key: 0,
                    label: "Refresh status",
                    severity: "secondary",
                    outlined: "",
                    disabled: P.value || h.value,
                    onClick: L[0] || (L[0] = (_) => rt())
                  }, {
                    icon: G(() => [
                      k(c(me), {
                        icon: "tabler:refresh",
                        "aria-hidden": "true"
                      })
                    ]),
                    _: 1
                  }, 8, ["disabled"])) : E("", !0),
                  il.value ? (n(), H(Uv, {
                    key: 1,
                    busy: P.value,
                    "discard-disabled": qe.value,
                    "review-disabled": qe.value || xa.value || bt.value || ei.value,
                    onDiscard: ui,
                    onReview: Y
                  }, null, 8, ["busy", "discard-disabled", "review-disabled"])) : E("", !0)
                ]),
                key: "0"
              } : void 0
            ]), 1032, ["title", "description"])) : E("", !0),
            C.value ? (n(), m("div", $m, [
              r("p", Vm, R(C.value), 1),
              k(c(te), {
                label: "Retry",
                severity: "secondary",
                outlined: "",
                onClick: L[1] || (L[1] = (_) => rt())
              })
            ])) : E("", !0),
            V.value ? (n(), m("p", xm, R(V.value), 1)) : E("", !0),
            h.value ? (n(), m("p", Cm, "Loading board settings…")) : !de.value && !C.value ? (n(), m("p", Sm, "Ask a board administrator to grant you access to these settings.")) : E("", !0),
            de.value && ne.value ? (n(), m("div", Tm, [
              re.result ? (n(), m("section", Im, [
                re.inProgress ? (n(), m("p", Dm, [
                  L[27] || (L[27] = W("Pack installation status ", -1)),
                  r("strong", null, R(c(Ae)(re.result.status)), 1)
                ])) : (n(), m("p", Em, "Pack applied.")),
                r("p", Um, [
                  L[28] || (L[28] = W("Operation ", -1)),
                  r("code", null, R(re.result.operation_id), 1),
                  L[29] || (L[29] = W(" · Job ", -1)),
                  r("code", null, R(re.result.job_id), 1)
                ]),
                re.operationError ? (n(), m("p", Am, R(re.operationError), 1)) : E("", !0),
                re.inProgress ? (n(), m("div", Rm, [
                  k(c(te), {
                    label: "Continue pack installation",
                    severity: "secondary",
                    outlined: "",
                    loading: P.value,
                    disabled: P.value,
                    onClick: re.continueInstallation
                  }, null, 8, ["loading", "disabled", "onClick"])
                ])) : E("", !0)
              ])) : E("", !0),
              bt.value ? (n(), m("p", Pm, "Someone saved new settings while you were editing. Discard this draft to load their changes.")) : E("", !0),
              xa.value ? (n(), m("div", Om, [
                r("p", null, R(be.value?.migration_error ? "Updating existing items paused." : "Updating existing items…"), 1),
                be.value?.migration_error ? (n(), H(Ne, {
                  key: 0,
                  label: "Technical details"
                }, {
                  default: G(() => [
                    W(R(be.value.migration_error), 1)
                  ]),
                  _: 1
                })) : E("", !0),
                be.value?.migration_error ? (n(), H(c(te), {
                  key: 1,
                  label: "Resume updating items",
                  severity: "secondary",
                  disabled: P.value,
                  outlined: "",
                  onClick: ri
                }, null, 8, ["disabled"])) : E("", !0)
              ])) : E("", !0),
              ft(k(Kf, {
                draft: K.value,
                schema: be.value ?? ne.value,
                board: Ie.value,
                active: y.value === "General",
                "board-apps": M.value?.board_apps,
                "draft-form": c(d),
                disabled: P.value || qe.value,
                "pack-title": ne.value.pack ? re.title : void 0,
                outdated: ne.value.outdated,
                "upgrade-reason": re.upgradeReason,
                "can-upgrade": re.upgradeAvailable && re.canManage,
                "can-install": re.canManage,
                "pack-error": re.error,
                onUpgrade: re.upgrade,
                onInstall: L[2] || (L[2] = (_) => re.installing = !0),
                onRetry: L[3] || (L[3] = (_) => re.load()),
                onDirtyChange: L[4] || (L[4] = (_) => nl.value = _),
                onSaved: L[5] || (L[5] = (_) => rt()),
                onShare: A
              }, null, 8, ["draft", "schema", "board", "active", "board-apps", "draft-form", "disabled", "pack-title", "outdated", "upgrade-reason", "can-upgrade", "can-install", "pack-error", "onUpgrade"]), [
                [St, y.value === "General"]
              ]),
              r("form", {
                id: c(d),
                ref_key: "editor",
                ref: _a,
                onSubmit: L[19] || (L[19] = Oe((_) => Y(), ["prevent"]))
              }, [
                (n(), m("fieldset", {
                  key: xt.value,
                  class: "work-settings-fieldset",
                  disabled: P.value || qe.value,
                  inert: P.value || qe.value || void 0
                }, [
                  F.value.has("Item types") ? ft((n(), H(Br, {
                    key: 0,
                    class: "work-ia-section",
                    draft: K.value,
                    "guard-removal": Ta,
                    issues: ol.value,
                    onCreateField: L[6] || (L[6] = (_, Ve) => se("Fields", _, Ve)),
                    onCreateWorkflow: L[7] || (L[7] = (_, Ve) => se("Workflow", _, Ve))
                  }, null, 8, ["draft", "issues"])), [
                    [St, y.value === "Item types"]
                  ]) : E("", !0),
                  F.value.has("Fields") ? ft((n(), H(xr, {
                    key: 1,
                    class: "work-ia-section",
                    "board-id": e.boardId,
                    "installed-types": M.value?.installed_types,
                    draft: K.value,
                    "guard-removal": Ta,
                    issues: ol.value,
                    "item-type": ae.value,
                    "onUpdate:itemType": L[8] || (L[8] = (_) => ae.value = _),
                    "create-for-item-type": J.value?.section === "Fields",
                    onCreated: L[9] || (L[9] = (_) => ce()),
                    onCancelCreation: L[10] || (L[10] = (_) => ce()),
                    onValidity: L[11] || (L[11] = (_, Ve) => ia("fields:" + _, Ve))
                  }, null, 8, ["board-id", "installed-types", "draft", "issues", "item-type", "create-for-item-type"])), [
                    [St, y.value === "Fields"]
                  ]) : E("", !0),
                  F.value.has("Links") ? ft((n(), H(ev, {
                    key: 2,
                    class: "work-ia-section",
                    draft: K.value,
                    "guard-removal": Ta
                  }, null, 8, ["draft"])), [
                    [St, y.value === "Links"]
                  ]) : E("", !0),
                  F.value.has("Workflow") ? ft((n(), m("section", Fm, [
                    U.value ? (n(), m("p", Lm, [
                      L[30] || (L[30] = W("Item counts are unavailable. ", -1)),
                      k(c(te), {
                        label: "Reload counts",
                        text: "",
                        onClick: L[12] || (L[12] = (_) => T(e.boardId))
                      })
                    ])) : E("", !0),
                    k(Rc, {
                      "board-id": e.boardId,
                      draft: K.value,
                      "guard-removal": Ta,
                      issues: ol.value,
                      counts: Z.value,
                      "count-types": ne.value.declaration.item_types,
                      guards: M.value?.guards,
                      "create-for-item-type": J.value?.section === "Workflow",
                      "creation-opener": J.value?.opener,
                      onCreated: ce,
                      onCancelCreation: L[13] || (L[13] = (_) => ce()),
                      onValidity: L[14] || (L[14] = (_, Ve) => ia("process:" + _, Ve))
                    }, null, 8, ["board-id", "draft", "issues", "counts", "count-types", "guards", "create-for-item-type", "creation-opener"])
                  ], 512)), [
                    [St, y.value === "Workflow"]
                  ]) : E("", !0),
                  F.value.has("Access") ? ft((n(), H(ef, {
                    key: 4,
                    active: y.value === "Access",
                    "board-id": e.boardId,
                    draft: K.value,
                    board: Ie.value,
                    busy: P.value,
                    onValidity: L[15] || (L[15] = (_) => ia("visibility", _))
                  }, null, 8, ["active", "board-id", "draft", "board", "busy"])), [
                    [St, y.value === "Access"]
                  ]) : E("", !0),
                  F.value.has("Plugins") ? ft((n(), m("section", Bm, [
                    k(ho, {
                      ref_key: "pluginEditor",
                      ref: el,
                      "board-id": e.boardId,
                      draft: K.value,
                      schema: be.value ?? ne.value,
                      options: M.value?.schema_options.plugins ?? [],
                      filters: M.value?.filters,
                      configs: q.value,
                      disabled: P.value,
                      onConfigured: L[16] || (L[16] = (_) => {
                        ht(), rt();
                      }),
                      onRefresh: L[17] || (L[17] = (_) => rt()),
                      onReview: Y,
                      onValidity: L[18] || (L[18] = (_, Ve) => ia("plugin:" + _, Ve)),
                      onWidgetValidity: ti
                    }, null, 8, ["board-id", "draft", "schema", "options", "filters", "configs", "disabled"])
                  ], 512)), [
                    [St, y.value === "Plugins"]
                  ]) : E("", !0)
                ], 8, Mm))
              ], 40, Nm),
              k(xl, {
                visible: pe.value,
                label: "Review changes",
                busy: P.value,
                "return-focus": oe.value,
                class: "work-review-sheet",
                onClose: O
              }, {
                default: G(() => [
                  r("div", jm, [
                    r("header", null, [
                      L[31] || (L[31] = r("h2", null, "Review changes", -1)),
                      r("p", zm, R(Ie.value?.title), 1)
                    ]),
                    r("div", {
                      class: "work-review-content work-stack",
                      "aria-busy": P.value
                    }, [
                      P.value ? (n(), m("p", Wm, R(Ot.value ? "Applying or checking changes…" : "Checking the impact on your board…"), 1)) : E("", !0),
                      ll.value ? (n(), m("p", Gm, R(ll.value), 1)) : E("", !0),
                      bt.value ? (n(), m("p", Km, "The board changed while you were editing. Close this review and discard the draft to load the latest settings.")) : E("", !0),
                      pe.value && !re.request && (oa.value.removed.length || oa.value.renamed.length) ? (n(), H(Mc, {
                        key: 3,
                        removed: oa.value.removed,
                        renamed: oa.value.renamed,
                        disabled: P.value || qe.value,
                        confirmed: Sa.value,
                        "onUpdate:confirmed": L[20] || (L[20] = (_) => Sa.value = _),
                        onDestination: li
                      }, null, 8, ["removed", "renamed", "disabled", "confirmed"])) : E("", !0),
                      pe.value && re.request && re.plugins.length ? (n(), H(ho, {
                        key: 4,
                        "board-id": e.boardId,
                        draft: { plugins: re.plugins },
                        schema: be.value ?? ne.value,
                        options: M.value?.schema_options.plugins.filter((_) => re.plugins.some((Ve) => Ve.use === _.plugin)) ?? [],
                        configs: q.value,
                        disabled: P.value,
                        "activation-locked": "",
                        onValidity: L[21] || (L[21] = (_, Ve) => ia("pack-plugin:" + _, Ve))
                      }, null, 8, ["board-id", "draft", "schema", "options", "configs", "disabled"])) : E("", !0),
                      pe.value ? (n(), H(rm, {
                        key: 5,
                        "board-id": e.boardId,
                        original: ne.value.declaration,
                        declaration: Zl.value,
                        plan: Ot.value,
                        follows: oi.value,
                        "config-count": Object.keys(q.value).length,
                        "plugin-configs": ke.value?.plugin_configs,
                        "pack-review": !!re.preview,
                        plugins: M.value?.schema_options.plugins
                      }, {
                        default: G(() => [
                          re.preview && re.request ? (n(), H(bm, {
                            key: 0,
                            plan: re.preview,
                            request: re.request,
                            original: ne.value.declaration,
                            plugins: M.value?.schema_options.plugins,
                            disabled: P.value,
                            onChange: re.changed
                          }, null, 8, ["plan", "request", "original", "plugins", "disabled", "onChange"])) : E("", !0)
                        ]),
                        _: 1
                      }, 8, ["board-id", "original", "declaration", "plan", "follows", "config-count", "plugin-configs", "pack-review", "plugins"])) : E("", !0),
                      !P.value && !Jl.value && !bt.value && !ll.value ? (n(), m("p", Hm, "Check the impact again before applying.")) : E("", !0)
                    ], 8, qm),
                    r("footer", Ym, [
                      k(c(te), {
                        label: "Keep editing",
                        severity: "secondary",
                        outlined: "",
                        disabled: P.value,
                        onClick: O
                      }, null, 8, ["disabled"]),
                      Jl.value ? (n(), H(c(te), {
                        key: 1,
                        label: "Apply changes",
                        disabled: !Xl.value,
                        loading: P.value,
                        onClick: ni
                      }, null, 8, ["disabled", "loading"])) : (n(), H(c(te), {
                        key: 0,
                        label: "Check impact",
                        disabled: P.value || bt.value || !!Ze.value.size,
                        onClick: rl
                      }, null, 8, ["disabled"]))
                    ])
                  ])
                ]),
                _: 1
              }, 8, ["visible", "busy", "return-focus"]),
              qe.value ? (n(), m("p", Xm, "Checking what uses this setting…")) : E("", !0)
            ])) : E("", !0)
          ], 8, wm)
        ])
      ]),
      de.value ? (n(), H(xl, {
        key: 0,
        visible: re.installing,
        label: "Install pack",
        busy: P.value,
        onClose: L[26] || (L[26] = (_) => re.installing = !1)
      }, {
        default: G(() => [
          re.installing ? (n(), m("form", {
            key: 0,
            class: "work-dialog-box work-stack",
            onSubmit: L[25] || (L[25] = Oe(
              //@ts-ignore
              (..._) => re.install && re.install(..._),
              ["prevent"]
            ))
          }, [
            L[33] || (L[33] = r("h2", null, "Install a pack", -1)),
            L[34] || (L[34] = r("p", { class: "work-muted work-small" }, "Packs give an empty board a starting setup. Review checks whether this board is eligible.", -1)),
            re.loading ? (n(), m("p", Jm, "Loading packs…")) : re.error ? (n(), m("div", Zm, [
              r("p", Qm, R(re.error), 1),
              k(c(te), {
                label: "Reload packs",
                severity: "secondary",
                outlined: "",
                onClick: L[22] || (L[22] = (_) => re.load())
              })
            ])) : re.choices.length ? (n(), m("label", _m, [
              L[32] || (L[32] = W("Pack ", -1)),
              k(c(fe), {
                modelValue: re.installPack,
                "onUpdate:modelValue": L[23] || (L[23] = (_) => re.installPack = _),
                "aria-label": "Pack to install",
                appendTo: "self",
                optionLabel: "title",
                optionValue: "id",
                optionDisabled: "disabled",
                options: re.choices,
                pt: { option: ({ context: _ }) => ({ "aria-label": [_.option.title, _.option.unavailable].filter(Boolean).join(". ") }) }
              }, {
                option: G(({ option: _ }) => [
                  r("span", null, [
                    W(R(_.title), 1),
                    _.unavailable ? (n(), m("small", ep, R(_.unavailable), 1)) : E("", !0)
                  ])
                ]),
                _: 1
              }, 8, ["modelValue", "options", "pt"])
            ])) : (n(), m("p", tp, "No available packs were found.")),
            r("footer", ap, [
              k(c(te), {
                label: "Cancel",
                severity: "secondary",
                outlined: "",
                onClick: L[24] || (L[24] = (_) => re.installing = !1)
              }),
              k(c(te), {
                type: "submit",
                label: "Review pack",
                disabled: !re.installChoice || !re.canManage || re.loading || !!re.error
              }, null, 8, ["disabled"])
            ])
          ], 32)) : E("", !0)
        ]),
        _: 1
      }, 8, ["visible", "busy"])) : E("", !0)
    ], 2));
  }
}), op = /* @__PURE__ */ $e({
  __name: "SettingsRoot",
  setup(e) {
    const a = ki(), t = wi();
    return Co(Ro, (l) => {
      a.value.embedded && l.name === "boards" ? t("back-to-boards", {}) : t("navigate", { route: Zi(l) });
    }), (l, o) => (n(), H(lp, {
      "board-id": c(a).boardId ?? "",
      embedded: c(a).embedded,
      "focus-back": c(a).focusBack,
      route: c(a).route,
      onNavigate: o[0] || (o[0] = (d) => c(t)("navigate", { route: d })),
      onDirtyChange: o[1] || (o[1] = (d) => c(t)("dirty-change", { dirty: d }))
    }, null, 8, ["board-id", "embedded", "focus-back", "route"]));
  }
}), ip = $i(op, {
  type: "object",
  properties: {
    "board-id": { type: "string", default: "", description: "Board to administer." },
    "focus-back": { type: "boolean", default: !1, description: "Focus the first rail action when opening settings from the board picker." },
    route: { type: "string", description: "Section and selected row in System." },
    embedded: { type: "boolean", default: !1, description: "Fits in a System detail pane." }
  }
});
ji(import.meta.url, ip);
//# sourceMappingURL=settings.js.map
