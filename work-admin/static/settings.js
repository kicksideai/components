import { defineComponent as ye, computed as L, openBlock as n, createElementBlock as b, Fragment as te, renderList as se, normalizeClass as ft, toDisplayString as D, createCommentVNode as I, createBlock as J, unref as r, createElementVNode as s, inject as gi, resolveDynamicComponent as Ta, withCtx as K, renderSlot as it, ref as M, useSlots as yi, createVNode as h, Transition as To, withDirectives as ct, vShow as wt, watch as Te, onMounted as Ia, onUnmounted as Fl, resolveComponent as Io, createTextVNode as B, onBeforeUnmount as St, useId as el, withKeys as Oe, withModifiers as Ie, nextTick as aa, normalizeStyle as ki, watchEffect as Uo, reactive as wi, provide as Vi } from "vue";
import { e as At, u as $i, b as xi, c as Ci, a as Si } from "./mount--O3y-Bty.js";
import "pinia";
import { m as ja, g as oo, s as he, h as Ti, t as je, p as Jt, i as Zt, r as io, w as Vt, f as ot, l as ka, j as qt, k as Ye, n as Ot, u as Do, o as Re, q as ze, v as Eo, x as Gt, y as Ao, z as tl, d as Oo, A as Ua, c as Po, B as Ii, C as Ha, D as Il, E as Ui, F as jt, G as Di, _ as Ul, H as Ei, I as Ai, J as Bt, K as Ro, L as Oi, M as Pi, N as bl, O as Ri, P as no, Q as Ni, R as Mi, a as Fi, S as so, T as Li, U as Bi } from "./latestRequest-DDkHJpUA.js";
import me from "primevue/select";
import _ from "primevue/button";
import { Icon as de } from "@iconify/vue";
import { api as Dl, on as zi, host as ji, define as Wi } from "@wippy-fe/proxy";
import We from "primevue/tag";
import _e from "primevue/toggleswitch";
import Kt from "primevue/checkbox";
import ge from "primevue/inputtext";
import Ya from "primevue/textarea";
import $t from "primevue/inputnumber";
import Ll from "primevue/selectbutton";
import qi from "primevue/tabs";
import Ki from "primevue/tablist";
import Gi from "primevue/tab";
import Hi from "primevue/message";
const hl = (e, a) => e.x > a.x && e.x < a.x + a.width && e.y > a.y && e.y < a.y + a.height;
function Yi(e, a, t) {
  return e.x === a.x ? e.x > t.x && e.x < t.x + t.width && Math.max(e.y, a.y) > t.y && Math.min(e.y, a.y) < t.y + t.height : e.y > t.y && e.y < t.y + t.height && Math.max(e.x, a.x) > t.x && Math.min(e.x, a.x) < t.x + t.width;
}
function Mt(e, a, t) {
  const l = [.../* @__PURE__ */ new Set([e.x, a.x, ...t.flatMap(($) => [$.x, $.x + $.width])])].sort(($, g) => $ - g), o = [.../* @__PURE__ */ new Set([e.y, a.y, ...t.flatMap(($) => [$.y, $.y + $.height])])].sort(($, g) => $ - g);
  l.unshift(l[0] - 24), l.push(l.at(-1) + 24), o.unshift(o[0] - 24), o.push(o.at(-1) + 24);
  const d = l.length, f = o.indexOf(a.y) * d + l.indexOf(a.x), m = o.indexOf(e.y) * d + l.indexOf(e.x), u = ($) => ({ x: l[$ % d], y: o[Math.floor($ / d)] }), i = /* @__PURE__ */ new Map(), c = /* @__PURE__ */ new Map(), p = [];
  function x($) {
    p.push($);
    let g = p.length - 1;
    for (; g; ) {
      const k = g - 1 >> 1;
      if (p[k].priority <= $.priority) break;
      p[g] = p[k], g = k;
    }
    p[g] = $;
  }
  function y() {
    const $ = p[0], g = p.pop();
    if (p.length) {
      let k = 0;
      for (; k * 2 + 1 < p.length; ) {
        let C = k * 2 + 1;
        if (C + 1 < p.length && p[C + 1].priority < p[C].priority && C++, g.priority <= p[C].priority) break;
        p[k] = p[C], k = C;
      }
      p[k] = g;
    }
    return $;
  }
  const S = ($) => Math.abs($.x - a.x) + Math.abs($.y - a.y);
  for (const $ of [0, 1]) {
    const g = m * 2 + $;
    i.set(g, 0), x({ key: g, cost: 0, priority: S(e) });
  }
  const w = /* @__PURE__ */ new Map(), A = /* @__PURE__ */ new Map();
  for (; p.length; ) {
    const $ = y(), g = Math.floor($.key / 2), k = $.key % 2;
    if ($.cost !== i.get($.key)) continue;
    if (g === f) {
      const G = [];
      let ne = $.key;
      for (; ne !== void 0; )
        G.push(u(Math.floor(ne / 2))), ne = c.get(ne);
      return No(G.reverse());
    }
    const C = u(g), H = g % d, P = Math.floor(g / d);
    for (const [G, ne] of [[H > 0 ? g - 1 : -1, 0], [H + 1 < d ? g + 1 : -1, 0], [P > 0 ? g - d : -1, 1], [P + 1 < o.length ? g + d : -1, 1]]) {
      if (G < 0) continue;
      const re = u(G);
      if (w.has(G) || w.set(G, !t.some((z) => hl(re, z))), !w.get(G)) continue;
      const ve = `${Math.min(g, G)}:${Math.max(g, G)}`;
      if (A.has(ve) || A.set(ve, !t.some((z) => Yi(C, re, z))), !A.get(ve)) continue;
      const ke = $.cost + Math.abs(C.x - re.x) + Math.abs(C.y - re.y) + (k === ne ? 0 : 18), oe = G * 2 + ne;
      ke >= (i.get(oe) ?? 1 / 0) || (i.set(oe, ke), c.set(oe, $.key), x({ key: oe, cost: ke, priority: ke + S(re) }));
    }
  }
  throw new Error("Process map has no collision-free route between its ports: " + JSON.stringify({ start: e, end: a, startInside: t.filter(($) => hl(e, $)), endInside: t.filter(($) => hl(a, $)) }));
}
function No(e) {
  const a = [];
  for (const t of e) {
    const l = a.at(-1), o = a.at(-2);
    l && l.x === t.x && l.y === t.y || (o && l && (o.x === l.x && l.x === t.x || o.y === l.y && l.y === t.y) && a.pop(), a.push(t));
  }
  return a;
}
const ma = (e) => Array.from(e).reduce((a, t) => a + (/[^\x20-\x7e]/u.test(t) ? 16 : /[MW@%]/.test(t) ? 11 : /[ilI.,:;!| ']/.test(t) ? 4 : 7.5), 0);
function la(e, a = 28) {
  const t = [];
  let l = "";
  for (const o of e.split(/\s+/u))
    for (let d = 0; d < o.length; d += a) {
      const f = o.slice(d, d + a);
      l && l.length + f.length + 1 > a && (t.push(l), l = ""), l = l ? l + " " + f : f;
    }
  return [...t, l].filter(Boolean);
}
function Ma(e) {
  if (e = No(e), !e.length) return "";
  let a = `M ${e[0].x} ${e[0].y}`;
  for (let l = 1; l < e.length - 1; l++) {
    const o = e[l - 1], d = e[l], f = e[l + 1], m = Math.hypot(d.x - o.x, d.y - o.y), u = Math.hypot(f.x - d.x, f.y - d.y), i = Math.min(8, m / 3, u / 3);
    i && (a += ` L ${d.x + (o.x - d.x) * i / m} ${d.y + (o.y - d.y) * i / m} Q ${d.x} ${d.y} ${d.x + (f.x - d.x) * i / u} ${d.y + (f.y - d.y) * i / u}`);
  }
  const t = e.at(-1);
  return a + ` L ${t.x} ${t.y}`;
}
function Xi(e, a = {}, t = { width: 1400, height: 480 }) {
  const l = t.direction ?? (t.width < 750 || ja(e).length > 8 ? "TB" : "LR"), o = t.direction === "LR" && ja(e).length > 6, d = new oo.graphlib.Graph({ multigraph: !0 });
  d.setGraph({ rankdir: l, ranker: "network-simplex", acyclicer: "greedy", nodesep: 32, edgesep: 32, ranksep: 24, marginx: 32, marginy: 32 }), d.setDefaultEdgeLabel(() => ({}));
  const f = ja(e), m = new Map(f.map((v, V) => [v.id, V])), u = e.states.map((v) => {
    const V = (e.transitions ?? []).filter((E) => E.from === "any" && E.to === v.id), Z = la(he(v), o ? 13 : 28), N = la(Ti(v, e), o ? 13 : 28), O = V.flatMap((E) => la(je(E) + " works from any state")), R = a.policy?.wip?.[v.id]?.limit, F = R === void 0 ? 0 : ma(" · limit " + R), T = Math.max(o ? 122 : 168, ...Z.map((E) => ma(E) + 58), ...N.map((E, ie) => ma(E) + 32 + (ie === N.length - 1 ? F : 0)), ...O.map((E) => ma(E) + 32)), ee = Math.max(80, 42 + Z.length * 18 + N.length * 16 + O.length * 18);
    return d.setNode(v.id, { width: T + (l === "LR" ? 36 : 0), height: ee + (l === "TB" ? 36 : 0) }), { state: v, x: 0, y: 0, width: T, height: ee, title: Z, caption: N, badges: V, row: m.has(v.id) ? 0 : 1 };
  }), i = new Set(u.map((v) => v.state.id)), c = (e.transitions ?? []).flatMap((v) => v.from === "any" ? [] : v.from.filter((V) => i.has(V) && i.has(v.to)).map((V) => {
    const Z = `${v.id}-${V}`, N = la(je(v), o ? 12 : 28), O = Math.max(o ? 60 : 72, ...N.map((F) => ma(F) + 24)), R = Math.max(24, N.length * 16 + 10);
    return { transition: v, from: V, key: Z, lines: N, width: O, height: R };
  })), p = /* @__PURE__ */ new Set(), x = /* @__PURE__ */ new Set(), y = new Set(c.filter((v) => v.from === v.transition.to || v.transition.to === e.initial || ["completed", "canceled"].includes(u.find((V) => V.state.id === v.from).state.category)).map((v) => v.key));
  function S(v) {
    if (!x.has(v)) {
      p.add(v);
      for (const V of c.filter((Z) => Z.from === v))
        y.has(V.key) || (p.has(V.transition.to) ? y.add(V.key) : S(V.transition.to));
      p.delete(v), x.add(v);
    }
  }
  S(e.initial);
  for (const v of u) S(v.state.id);
  for (const v of c) if (!y.has(v.key)) {
    const V = m.get(v.from), Z = m.get(v.transition.to);
    d.setEdge(v.from, v.transition.to, { width: v.width, height: v.height, labelpos: "c", weight: V !== void 0 && Z === V + 1 ? 100 : 1 }, v.key);
  }
  for (const v of e.transitions ?? []) if (v.from === "any" && i.has(e.initial) && i.has(v.to) && !m.has(v.to)) {
    const V = e.states.find((Z) => Z.id === v.to);
    d.setEdge(e.initial, v.to, { minlen: ["completed", "canceled"].includes(V.category) ? Math.max(1, f.length - 1) : 1 }, `any:${v.id}`);
  }
  const w = e.states.flatMap((v) => (v.regions ?? []).filter((V) => i.has(V.initial)).map((V, Z) => {
    const N = `lane:${v.id}:${Z}`;
    return d.setEdge(v.id, V.initial, {}, N), { state: v, region: V, key: N };
  }));
  if (!u.length) return { nodes: u, edges: [], parallels: [], main: f, direction: l, width: 320, height: 160 };
  oo.layout(d);
  for (const v of u) Object.assign(v, { x: d.node(v.state.id).x, y: d.node(v.state.id).y });
  const A = l === "TB", $ = c.filter((v) => !y.has(v.key)).map((v) => d.edge({ v: v.from, w: v.transition.to, name: v.key })), g = [...u, ...$], k = Math.max(...g.map((v) => v.x + v.width / 2)), C = Math.max(...g.map((v) => v.y + v.height / 2)), H = (v) => u.find((V) => V.state.id === v), P = c.filter((v) => y.has(v.key)).sort((v, V) => {
    const Z = A ? "y" : "x";
    return Math.abs(H(v.from)[Z] - H(v.transition.to)[Z]) - Math.abs(H(V.from)[Z] - H(V.transition.to)[Z]);
  }), G = /* @__PURE__ */ new Map(), ne = Math.max(0, ...P.map((v) => v.width));
  let re = C + 32;
  for (const [v, V] of P.entries()) {
    const Z = H(V.from), N = H(V.transition.to), O = A ? k + 16 + ne + 28 + v * 18 : re + V.height / 2, R = A ? k + 16 + ne / 2 : (Z.x + N.x) / 2;
    let F = A ? Z.y + Z.height / 2 + 18 : O;
    if (A) for (const T of [...G.values()].sort((ee, E) => ee.y - E.y))
      F + V.height / 2 + 10 > T.y - T.height / 2 - 10 && F - V.height / 2 - 10 < T.y + T.height / 2 + 10 && (F = T.y + T.height / 2 + 24 + V.height / 2);
    G.set(V.key, { x: R, y: F, corridor: O, height: V.height }), re = O + V.height / 2 + 24;
  }
  const ve = c.map((v) => ({ ...v, ...G.get(v.key) ?? d.edge({ v: v.from, w: v.transition.to, name: v.key }) })), ke = (v, V) => ({ x: v.x - v.width / 2 - V, y: v.y - v.height / 2 - V, width: v.width + V * 2, height: v.height + V * 2 }), oe = [...u.map((v) => ke(v, 12)), ...ve.map((v) => ke(v, 10))], z = (v, V) => ({
    start: A ? { x: v.x, y: v.y + v.height / 2 } : { x: v.x + v.width / 2, y: v.y },
    end: A ? { x: V.x, y: V.y - V.height / 2 } : { x: V.x - V.width / 2, y: V.y }
  }), W = (v, V) => A ? { x: v.x, y: v.y + V } : { x: v.x + V, y: v.y }, U = ve.map((v) => {
    const V = u.find((Ee) => Ee.state.id === v.from), Z = u.find((Ee) => Ee.state.id === v.transition.to), { start: N, end: O } = z(V, Z), R = y.has(v.key), F = W(N, 18), T = W(O, -18), ee = (R || !A ? v.width : v.height) / 2 + 10, E = R ? { x: v.x + (A ? -ee : ee), y: v.y } : W(v, -ee), ie = R ? { x: v.x + (A ? ee : -ee), y: v.y } : W(v, ee);
    let Ve;
    if (R) {
      const { corridor: Ee } = G.get(v.key), Aa = A ? { x: Ee, y: v.y } : { x: F.x, y: Ee }, sa = A ? { x: Ee, y: T.y } : { x: T.x, y: Ee };
      Ve = A ? [
        [N, ...Mt(F, E, oe)],
        [ie, Aa, sa, ...Mt(sa, T, oe), O]
      ] : [
        [N, ...Mt(F, Aa, oe), E],
        [ie, ...Mt(sa, T, oe), O]
      ];
    } else Ve = [
      [N, ...Mt(F, E, oe)],
      [...Mt(ie, T, oe), O]
    ];
    const Ue = R ? "return" : m.get(v.transition.to) === (m.get(v.from) ?? -2) + 1 ? "main" : "forward";
    return { ...v, points: Ve.flat(), segments: Ve, path: Ve.map(Ma).join(" "), type: Ue, targetOffset: 0 };
  }), q = w.map((v) => {
    const V = u.find((F) => F.state.id === v.state.id), Z = u.find((F) => F.state.id === v.region.initial), { start: N, end: O } = z(V, Z), R = [N, ...Mt(W(N, 18), W(O, -18), oe), O];
    return { state: v.state, key: v.key, points: R, path: Ma(R) };
  }), ce = [...u.flatMap((v) => [{ x: v.x - v.width / 2, y: v.y - v.height / 2 }, { x: v.x + v.width / 2, y: v.y + v.height / 2 }]), ...U.flatMap((v) => [...v.points, { x: v.x - v.width / 2, y: v.y - v.height / 2 }, { x: v.x + v.width / 2, y: v.y + v.height / 2 }]), ...q.flatMap((v) => v.points)], ue = 32 - Math.min(...ce.map((v) => v.x)), Q = 32 - Math.min(...ce.map((v) => v.y)), we = Math.max(...ce.map((v) => v.x)) + ue + 32, Se = Math.max(...ce.map((v) => v.y)) + Q + 32, j = (v) => ({ x: v.x + ue, y: v.y + Q });
  for (const v of u) Object.assign(v, j(v));
  for (const v of U)
    Object.assign(v, j(v)), v.segments = v.segments.map((V) => V.map(j)), v.points = v.segments.flat(), v.path = v.segments.map(Ma).join(" ");
  for (const v of q)
    v.points = v.points.map(j), v.path = Ma(v.points);
  return { nodes: u, edges: U, parallels: q, main: f, direction: l, width: we, height: Se };
}
const Ji = ["aria-label"], Zi = {
  key: 0,
  class: "kx-settings-rail-group"
}, Qi = ["aria-current", "onClick"], _i = { class: "kx-settings-rail-label" }, en = /* @__PURE__ */ ye({
  __name: "SettingsRail",
  props: {
    label: {},
    value: {},
    groups: {},
    leadingItem: {}
  },
  emits: ["update:value"],
  setup(e) {
    const a = e, t = L(() => a.leadingItem ? [{ items: [a.leadingItem] }, ...a.groups] : a.groups);
    function l(o) {
      const d = [...o.currentTarget.querySelectorAll(".kx-settings-rail-item")], f = d.indexOf(o.target);
      if (f < 0) return;
      let m;
      switch (o.key) {
        case "ArrowDown":
        case "ArrowRight":
          m = (f + 1) % d.length;
          break;
        case "ArrowUp":
        case "ArrowLeft":
          m = (f + d.length - 1) % d.length;
          break;
        case "Home":
          m = 0;
          break;
        case "End":
          m = d.length - 1;
          break;
        default:
          return;
      }
      o.preventDefault(), d[m]?.focus();
    }
    return (o, d) => (n(), b("nav", {
      class: "kx-settings-rail",
      "aria-label": e.label,
      onKeydown: l
    }, [
      (n(!0), b(te, null, se(t.value, (f, m) => (n(), b("div", {
        key: f.items[0]?.value ?? m,
        class: ft(["kx-settings-rail-section", { "kx-settings-rail-leading": e.leadingItem && m === 0 }])
      }, [
        f.heading ? (n(), b("div", Zi, D(f.heading), 1)) : I("", !0),
        (n(!0), b(te, null, se(f.items, (u) => (n(), b("button", {
          key: u.value,
          type: "button",
          class: "kx-settings-rail-item",
          "aria-current": u.value === e.value ? "true" : void 0,
          onClick: (i) => o.$emit("update:value", u.value)
        }, [
          u.icon ? (n(), J(r(de), {
            key: 0,
            class: "kx-settings-rail-icon",
            icon: u.icon,
            "aria-hidden": "true"
          }, null, 8, ["icon"])) : I("", !0),
          s("span", _i, D(u.label), 1)
        ], 8, Qi))), 128))
      ], 2))), 128))
    ], 40, Ji));
  }
}), Mo = Symbol("work-navigation");
function tn() {
  return gi(Mo, () => {
  });
}
function an(e) {
  if (e.name === "boards") return "";
  const a = encodeURIComponent(e.board);
  return e.name === "settings" ? `${a}/settings` : a;
}
const Qt = (e) => `/api/v1/work/boards/${encodeURIComponent(e)}`, ro = (e) => ({ declaration: e.declaration, expected_generation: e.expected_generation, plugin_configs: e.plugin_configs }), It = {
  packPlan: (e, a) => Jt(`${Qt(e)}/pack_plan`, a, "Pack plan"),
  packApply: (e, a, t) => Jt(`${Qt(e)}/pack_apply`, { ...a, key: t }, "Apply pack"),
  plan: (e, a) => Jt(`${Qt(e)}/plan_schema`, ro(a), "Schema plan"),
  apply: (e, a, t) => Jt(`${Qt(e)}/apply_schema`, { ...ro(a), key: t }, "Apply schema"),
  resume: (e) => Jt(`${Qt(e)}/resume_migration`, {}, "Resume migration"),
  configure: (e, a, t) => Jt(`${Qt(e)}/configure_plugin`, { plugin: a, ...t === void 0 ? {} : { config: t } }, "Configure plugin")
}, Bl = /* @__PURE__ */ ye({
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
      const m = f.target;
      if (m instanceof Element && m !== f.currentTarget) {
        const u = m.closest('[data-work-action], button, a, input, textarea, [role="combobox"], [role="checkbox"], [role="switch"], details');
        if (u && u !== f.currentTarget) return;
      }
      l("activate", f);
    }
    function d(f) {
      f.target !== f.currentTarget || !["Enter", " "].includes(f.key) || (f.preventDefault(), t.disabled || l("activate", f));
    }
    return (f, m) => (n(), J(Ta(e.as), {
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
      default: K(() => [
        it(f.$slots, "default")
      ]),
      _: 3
    }, 40, ["type", "role", "tabindex", "disabled", "aria-disabled"]));
  }
}), ln = { class: "work-definition" }, on = {
  key: 0,
  class: "work-definition-handle"
}, nn = ["title"], sn = { class: "work-definition-details" }, rn = { class: "work-definition-code" }, dn = ["title"], un = { class: "work-definition-kind" }, cn = { class: "work-definition-flags" }, vn = { class: "work-definition-usage" }, mn = { class: "work-definition-actions" }, fn = {
  key: 1,
  class: "work-definition-description"
}, pn = ["inert"], al = /* @__PURE__ */ ye({
  __name: "DefinitionRow",
  props: {
    title: {},
    code: {},
    kind: {},
    description: {},
    initialOpen: { type: Boolean }
  },
  setup(e) {
    const t = M(!!e.initialOpen), l = yi();
    return (o, d) => (n(), b("article", ln, [
      s("header", {
        class: ft(["work-definition-head", { "work-definition-has-handle": r(l).handle }])
      }, [
        r(l).handle ? (n(), b("div", on, [
          it(o.$slots, "handle")
        ])) : I("", !0),
        h(Bl, {
          class: "work-definition-toggle",
          "aria-expanded": t.value,
          onActivate: d[0] || (d[0] = (f) => t.value = !t.value)
        }, {
          default: K(() => [
            h(r(de), {
              icon: "tabler:chevron-right",
              "aria-hidden": "true"
            }),
            s("span", {
              class: "work-row-title",
              title: e.title
            }, D(e.title), 9, nn)
          ]),
          _: 1
        }, 8, ["aria-expanded"]),
        s("div", sn, [
          s("span", rn, [
            e.code ? (n(), b("code", {
              key: 0,
              class: "work-mono",
              title: e.code
            }, D(e.code), 9, dn)) : I("", !0)
          ]),
          s("span", un, [
            e.kind ? (n(), J(r(We), {
              key: 0,
              severity: "secondary",
              value: e.kind
            }, null, 8, ["value"])) : I("", !0)
          ]),
          s("span", cn, [
            it(o.$slots, "flags")
          ]),
          s("div", vn, [
            it(o.$slots, "usage")
          ])
        ]),
        s("div", mn, [
          it(o.$slots, "actions")
        ]),
        e.description ? (n(), b("p", fn, D(e.description), 1)) : I("", !0)
      ], 2),
      h(To, {
        name: "work-panel",
        persisted: ""
      }, {
        default: K(() => [
          ct(s("div", {
            inert: !t.value,
            class: "work-definition-body work-stack"
          }, [
            it(o.$slots, "default")
          ], 8, pn), [
            [wt, t.value]
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
}, gn = {
  key: 0,
  class: "work-definition-code"
}, yn = { key: 1 }, kn = {
  key: 2,
  class: "work-definition-usage"
}, ll = /* @__PURE__ */ ye({
  __name: "DefinitionList",
  props: {
    count: {},
    columns: {}
  },
  setup(e) {
    return (a, t) => (n(), b("div", bn, [
      s("div", {
        class: ft(["work-field-builder", "work-definitions-" + e.columns])
      }, [
        e.count > 3 ? (n(), b("div", hn, [
          t[0] || (t[0] = s("span", null, null, -1)),
          t[1] || (t[1] = s("span", null, "Name", -1)),
          e.columns !== "plugins" ? (n(), b("span", gn, "Identifier")) : I("", !0),
          s("span", null, D(e.columns === "plugins" ? "State" : e.columns === "types" ? "Workflow" : "Kind"), 1),
          e.columns === "fields" || e.columns === "plugins" ? (n(), b("span", yn, "Details")) : I("", !0),
          e.columns !== "plugins" ? (n(), b("span", kn, D(e.columns === "fields" ? "Used by" : "Details"), 1)) : I("", !0),
          t[2] || (t[2] = s("span", null, null, -1))
        ])) : I("", !0),
        it(a.$slots, "default")
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
function Vn(e) {
  const a = e.compiled.processes?.flatMap((t) => t.states.map((l) => ({ id: l.id, label: l.name }))) ?? [];
  return [...wn.filter((t) => t.code !== "rank").map((t) => t.code === "state" ? { ...t, type: "option", options: a } : t.code === "category" ? { ...t, type: "option", options: ["triage", "backlog", "unstarted", "started", "completed", "canceled"].map((l) => ({ id: l })) } : t), ...(e.compiled.fields ?? []).filter((t) => t.index && t.index !== "none")];
}
function $n(e) {
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
}, Un = ["inert"], Dn = ["value"], En = {
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
}, Fo = /* @__PURE__ */ ye({
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
    const t = e, l = a, o = L(() => t.inputId ?? `field-${t.field.code}`), d = L(() => !!t.field.cardinality && t.field.cardinality !== "one"), f = L(() => Array.isArray(t.modelValue) ? t.modelValue : []), m = L(() => t.modelValue == null ? "" : typeof t.modelValue == "object" ? Zt(t.modelValue) : String(t.modelValue)), u = L(() => {
      const v = t.modelValue;
      return v && typeof v == "object" && "ref" in v && Array.isArray(v.ref) ? String(v.ref[1] ?? "") : "";
    }), i = L(() => t.disabled || io(t.field)), c = M(!1), p = M(!1), x = M(!1), y = M(""), S = M(""), w = M([]), A = ka(), $ = M([]);
    let g = 0, k;
    const C = /* @__PURE__ */ new Set();
    Te(f, (v) => {
      $.value = k ?? v.map((V, Z) => $.value[Z] ?? g++), k = void 0;
    }, { immediate: !0 });
    function H(v) {
      l("update:modelValue", v);
    }
    function P(v, V) {
      const Z = [...f.value];
      Z[v] = V, H(Z);
    }
    function G(v, V) {
      V ? C.delete(v) : C.add(v), l("validity", !C.size);
    }
    function ne(v) {
      C.delete($.value[v]), l("validity", !C.size), k = $.value.filter((V, Z) => Z !== v), H(f.value.filter((V, Z) => Z !== v));
    }
    function re() {
      k = [...$.value, g++], H([...f.value, t.field.form === "bool" ? !1 : t.field.form === "record" ? {} : ""]);
    }
    function ve(v) {
      const V = v.detail, Z = V?.principal_id ?? V?.id;
      H(Z ? { kind: V.type ?? "user", id: Z } : void 0);
    }
    function ke(v) {
      const V = v.detail;
      H(V?.thread_id ? { ref: ["component", V.thread_id] } : void 0);
    }
    const oe = M("");
    let z = "";
    Te(() => t.modelValue, (v) => {
      const V = JSON.stringify(v ?? {}, null, 2);
      V !== z && (z = V, oe.value = V, y.value = "", l("validity", !0));
    }, { immediate: !0 });
    function W(v) {
      oe.value = v;
      try {
        const V = JSON.parse(v);
        if (!V || typeof V != "object" || Array.isArray(V)) throw new Error("Enter a JSON object.");
        if (t.field.type === "rich_text" && !("type" in V && typeof V.type == "string")) throw new Error("The document needs a type.");
        z = JSON.stringify(V, null, 2), y.value = "", l("validity", !0), H(V);
      } catch (V) {
        y.value = V instanceof Error ? V.message : "Invalid JSON.", l("validity", !1);
      }
    }
    function U(v) {
      if (!v) {
        l("validity", !0), H(void 0);
        return;
      }
      const V = Number.isFinite(Number(v)) && (t.field.form !== "int" || Number.isSafeInteger(Number(v)));
      l("validity", V), V && H(t.field.form === "int" ? Number(v) : v);
    }
    const q = L(() => t.field.config?.format === "date");
    function ce(v) {
      H(v ? q.value ? v : new Date(v).toISOString() : void 0);
    }
    const ue = L(() => {
      if (typeof t.modelValue != "string") return "";
      if (q.value) return t.modelValue.slice(0, 10);
      const v = new Date(t.modelValue);
      return Number.isNaN(v.getTime()) ? "" : new Date(v.getTime() - v.getTimezoneOffset() * 6e4).toISOString().slice(0, 16);
    });
    function Q(v) {
      H(v.detail?.ref);
    }
    function we(v) {
      H(v.detail?.value);
    }
    let Se;
    Te(S, () => {
      const v = A();
      if (clearTimeout(Se), !S.value.trim()) {
        w.value = [];
        return;
      }
      Se = setTimeout(async () => {
        try {
          const V = S.value.trim(), Z = /^[A-Z][A-Z0-9]{1,9}-[0-9]+$/.test(V) ? [(await Vt.item(t.boardId, { key: V })).item] : (await Vt.query(t.boardId, { where: { field: "title", op: "contains", value: V }, limit: 8 })).items;
          v() && (w.value = Z, y.value = "");
        } catch (V) {
          v() && (y.value = ot(V, "Could not search items."));
        }
      }, 200);
    });
    function j(v) {
      H({ board: t.boardId, item: v.id }), S.value = "", w.value = [];
    }
    Ia(async () => {
      t.field.type === "principal" ? c.value = await At("wc-principal-picker") : t.field.config?.target === "component" && (c.value = await At("wc-component-picker"));
    });
    for (const [v, V] of [[() => t.editorTag, x], [() => t.linkTag, p]])
      Te(v, async (Z, N, O) => {
        let R = !0;
        if (O(() => {
          R = !1;
        }), V.value = !1, Z) {
          const F = await At(Z);
          R && (V.value = F);
        }
      }, { immediate: !0 });
    return Fl(() => {
      clearTimeout(Se), A();
    }), (v, V) => {
      const Z = Io("FieldControl", !0);
      return n(), b("div", xn, [
        r(io)(e.field) ? (n(), b("output", {
          key: 0,
          id: o.value,
          class: "work-read-value"
        }, D(r(Zt)(e.modelValue, e.field)), 9, Cn)) : d.value ? (n(), b("div", Sn, [
          s("div", Tn, [
            (n(!0), b(te, null, se(f.value, (N, O) => (n(), J(r(We), {
              key: $.value[O],
              class: "kx-tag-sm",
              severity: "secondary"
            }, {
              default: K(() => [
                B(D(r(Zt)(N, e.field)) + " ", 1),
                h(r(_), {
                  type: "button",
                  class: "work-icon-button",
                  disabled: i.value,
                  "aria-label": "Remove value " + (O + 1),
                  onClick: (R) => ne(O),
                  severity: "secondary",
                  text: "",
                  size: "small"
                }, {
                  default: K(() => [
                    h(r(de), {
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
          (n(!0), b(te, null, se(f.value, (N, O) => (n(), b("div", {
            key: $.value[O],
            class: "work-stack work-tight"
          }, [
            h(Z, {
              "board-id": e.boardId,
              field: { ...e.field, cardinality: "one" },
              "model-value": N,
              "input-id": o.value + "-" + $.value[O],
              disabled: i.value,
              "editor-tag": e.editorTag,
              "link-tag": e.linkTag,
              "onUpdate:modelValue": (R) => P(O, R),
              onValidity: (R) => G($.value[O], R)
            }, null, 8, ["board-id", "field", "model-value", "input-id", "disabled", "editor-tag", "link-tag", "onUpdate:modelValue", "onValidity"])
          ]))), 128)),
          h(r(_), {
            label: "Add value",
            severity: "secondary",
            size: "small",
            disabled: i.value,
            onClick: re,
            outlined: ""
          }, {
            icon: K(() => [
              h(r(de), {
                icon: "tabler:plus",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled"])
        ])) : e.editorTag && x.value ? (n(), J(Ta(e.editorTag), {
          key: 2,
          "board-id": e.boardId,
          value: JSON.stringify(e.modelValue ?? null),
          config: JSON.stringify(e.field.config ?? {}),
          readonly: i.value || void 0,
          onChange: we
        }, null, 40, ["board-id", "value", "config", "readonly"])) : e.linkTag && p.value ? (n(), J(Ta(e.linkTag), {
          key: 3,
          "board-id": e.boardId,
          kind: e.field.config?.target ?? e.field.type,
          value: JSON.stringify(e.modelValue ?? null),
          readonly: i.value || void 0,
          onChange: Q
        }, null, 40, ["board-id", "kind", "value", "readonly"])) : e.field.type === "option" ? (n(), J(r(me), {
          key: 4,
          placeholder: "Not set",
          inputId: o.value,
          "model-value": e.modelValue ?? "",
          disabled: i.value,
          "onUpdate:modelValue": V[0] || (V[0] = (N) => H(N || void 0)),
          appendTo: "self",
          optionLabel: "label",
          optionValue: "value",
          optionDisabled: "disabled",
          options: [{ label: "Not set", value: "", disabled: !1 }, ...(e.field.options ?? []).map((N) => ({ label: N.label ?? N.id, value: N.id, disabled: !1 }))]
        }, null, 8, ["inputId", "model-value", "disabled", "options"])) : e.field.form === "bool" ? (n(), b("label", In, [
          h(r(Kt), {
            inputId: o.value,
            "model-value": e.modelValue === !0,
            disabled: i.value,
            "onUpdate:modelValue": V[1] || (V[1] = (N) => H(N)),
            binary: ""
          }, null, 8, ["inputId", "model-value", "disabled"]),
          B(D(e.modelValue === !0 ? "Yes" : e.modelValue === !1 ? "No" : "Not set"), 1)
        ])) : e.field.form === "int" ? (n(), J(r($t), {
          key: 6,
          inputId: o.value,
          "model-value": m.value === "" ? null : Number(m.value),
          disabled: i.value,
          "onUpdate:modelValue": V[2] || (V[2] = (N) => U(N == null ? "" : String(N))),
          useGrouping: !1
        }, null, 8, ["inputId", "model-value", "disabled"])) : e.field.form === "dec" ? (n(), J(r(ge), {
          key: 7,
          id: o.value,
          inputmode: "decimal",
          "model-value": m.value,
          disabled: i.value,
          "onUpdate:modelValue": V[3] || (V[3] = (N) => U(N ?? ""))
        }, null, 8, ["id", "model-value", "disabled"])) : e.field.form === "time" ? (n(), J(r(ge), {
          key: 8,
          id: o.value,
          type: q.value ? "date" : "datetime-local",
          value: ue.value,
          disabled: i.value,
          onInput: V[4] || (V[4] = (N) => ce(N.target.value))
        }, null, 8, ["id", "type", "value", "disabled"])) : e.field.type === "principal" ? (n(), b("div", {
          key: 9,
          inert: i.value || void 0,
          class: "work-stack work-tight"
        }, [
          c.value ? (n(), b("wc-principal-picker", {
            key: 0,
            value: JSON.stringify(e.modelValue ?? {}),
            kinds: "user,group",
            onConfigChanged: ve
          }, null, 40, Dn)) : (n(), b("span", En, D(r(Zt)(e.modelValue, e.field)) + " · Person picker is unavailable.", 1))
        ], 8, Un)) : e.field.config?.target === "component" ? (n(), b("div", {
          key: 10,
          inert: i.value || void 0
        }, [
          c.value ? (n(), b("wc-component-picker", {
            key: 0,
            value: JSON.stringify({ thread_id: u.value }),
            onChange: ke
          }, null, 40, On)) : (n(), b("span", Pn, "Component picker is unavailable."))
        ], 8, An)) : e.field.type === "item" ? (n(), b("div", Rn, [
          h(r(We), {
            class: "kx-tag-sm",
            severity: "secondary"
          }, {
            default: K(() => [
              B(D(r(Zt)(e.modelValue, e.field)), 1)
            ]),
            _: 1
          }),
          h(r(ge), {
            id: o.value,
            modelValue: S.value,
            "onUpdate:modelValue": V[5] || (V[5] = (N) => S.value = N),
            disabled: i.value,
            placeholder: "Search a title or enter an item key",
            "aria-label": "Search items"
          }, null, 8, ["id", "modelValue", "disabled"]),
          s("div", Nn, [
            (n(!0), b(te, null, se(w.value, (N) => (n(), J(Bl, {
              key: N.id,
              class: "work-match-item",
              disabled: i.value,
              onActivate: (O) => j(N)
            }, {
              default: K(() => [
                s("code", Mn, D(N.key), 1),
                s("span", null, D(r(Zt)(N.values.title)), 1)
              ]),
              _: 2
            }, 1032, ["disabled", "onActivate"]))), 128))
          ]),
          e.modelValue ? (n(), J(r(_), {
            key: 0,
            label: "Clear reference",
            severity: "secondary",
            size: "small",
            disabled: i.value,
            onClick: V[6] || (V[6] = (N) => H(void 0)),
            outlined: ""
          }, {
            icon: K(() => [
              h(r(de), {
                icon: "tabler:list-check",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled"])) : I("", !0)
        ])) : e.field.form === "record" || e.field.type === "rich_text" || e.field.form === "quantity" || e.field.form === "ref" ? (n(), J(r(Ya), {
          key: 12,
          id: o.value,
          "model-value": oe.value,
          rows: "3",
          disabled: i.value,
          "aria-invalid": !!y.value,
          "onUpdate:modelValue": V[7] || (V[7] = (N) => W(N ?? ""))
        }, null, 8, ["id", "model-value", "disabled", "aria-invalid"])) : e.field.code === "description" ? (n(), J(r(Ya), {
          key: 13,
          id: o.value,
          "model-value": m.value,
          rows: "4",
          disabled: i.value,
          "onUpdate:modelValue": V[8] || (V[8] = (N) => H(N))
        }, null, 8, ["id", "model-value", "disabled"])) : (n(), J(r(ge), {
          key: 14,
          id: o.value,
          "model-value": m.value,
          disabled: i.value,
          "onUpdate:modelValue": V[9] || (V[9] = (N) => H(N))
        }, null, 8, ["id", "model-value", "disabled"])),
        y.value ? (n(), b("span", Fn, D(y.value), 1)) : I("", !0)
      ]);
    };
  }
}), Ln = { class: "work-stack work-tight work-operand-control" }, Bn = { class: "work-row work-small" }, zn = {
  key: 1,
  class: "work-muted work-small"
}, jn = {
  key: 2,
  class: "work-stack work-tight"
}, Wn = { class: "work-small" }, qn = {
  key: 0,
  class: "work-error work-small",
  role: "alert"
}, fa = /* @__PURE__ */ ye({
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
    const t = e, l = a, o = L(() => "$actor" in qt(t.modelValue) ? "actor" : "$now" in qt(t.modelValue) ? "now" : "literal"), d = M(""), f = M("");
    Te(() => t.modelValue, (i) => {
      d.value = JSON.stringify(i ?? []), f.value = "";
    }, { immediate: !0 });
    function m(i) {
      l("update:modelValue", i === "actor" ? { $actor: "id" } : i === "now" ? { $now: "P0D" } : void 0), l("validity", !0);
    }
    function u(i) {
      d.value = i;
      try {
        const c = JSON.parse(i);
        if (!Array.isArray(c)) throw new Error("Enter a JSON list.");
        f.value = "", l("validity", !0), l("update:modelValue", c);
      } catch (c) {
        f.value = c instanceof Error ? c.message : "Invalid values.", l("validity", !1);
      }
    }
    return (i, c) => (n(), b("div", Ln, [
      s("label", Bn, [
        B(D(e.label), 1),
        h(r(me), {
          "aria-label": e.label + " operand",
          "model-value": o.value,
          disabled: e.disabled,
          "onUpdate:modelValue": c[0] || (c[0] = (p) => m(p)),
          appendTo: "self",
          optionLabel: "label",
          optionValue: "value",
          optionDisabled: "disabled",
          options: [{ label: "Value", value: "literal", disabled: !1 }, { label: "Current actor ($actor)", value: "actor", disabled: !1 }, { label: "Current time ($now)", value: "now", disabled: !1 }]
        }, null, 8, ["aria-label", "model-value", "disabled"])
      ]),
      o.value === "now" ? (n(), J(r(ge), {
        key: 0,
        "aria-label": e.label + " time offset",
        value: r(qt)(e.modelValue).$now,
        disabled: e.disabled,
        placeholder: "-P7D",
        onInput: c[1] || (c[1] = (p) => l("update:modelValue", { $now: p.target.value }))
      }, null, 8, ["aria-label", "value", "disabled"])) : o.value === "actor" ? (n(), b("span", zn, "The signed-in actor’s id")) : e.multiple ? (n(), b("div", jn, [
        s("label", Wn, [
          c[5] || (c[5] = B("Values as JSON (operands may appear in the list)", -1)),
          h(r(Ya), {
            class: "work-mono",
            "aria-label": e.label + " values",
            value: d.value,
            disabled: e.disabled,
            rows: "2",
            onInput: c[2] || (c[2] = (p) => u(p.target.value))
          }, null, 8, ["aria-label", "value", "disabled"])
        ]),
        f.value ? (n(), b("p", qn, D(f.value), 1)) : I("", !0)
      ])) : (n(), J(Fo, {
        key: 3,
        "board-id": e.boardId,
        field: { ...e.field, cardinality: "one" },
        "model-value": e.modelValue,
        disabled: e.disabled,
        "input-id": e.label.replace(/[^a-z0-9]/gi, "-"),
        "onUpdate:modelValue": c[3] || (c[3] = (p) => l("update:modelValue", p)),
        onValidity: c[4] || (c[4] = (p) => l("validity", p))
      }, null, 8, ["board-id", "field", "model-value", "disabled", "input-id"]))
    ]));
  }
}), Kn = ["disabled"], Gn = { class: "work-small work-mono" }, Hn = { class: "work-row work-small" }, Yn = { class: "work-row work-wrap" }, Xn = { key: 3 }, Jn = { class: "work-row work-wrap" }, Zn = { class: "work-row" }, Qn = { class: "work-row" }, _n = { class: "work-row" }, es = {
  key: 3,
  class: "work-row work-wrap"
}, ts = { class: "work-row work-wrap" }, as = /* @__PURE__ */ ye({
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
    const t = e, l = a, o = L(() => t.path ?? "where"), d = L(() => t.depth ?? 1), f = L(() => ["and", "or", "not", "history", "match", "rel", "children"].find((oe) => oe in t.modelValue) ?? "field"), m = L(() => Vn(t.schema)), u = L(() => m.value.find((oe) => oe.code === t.modelValue.field) ?? { code: "value", form: "text" }), i = L(() => qt(t.modelValue.history)), c = L(() => m.value.find((oe) => oe.code === i.value.field) ?? { code: "history", form: "text" }), p = L(() => Array.isArray(t.modelValue[f.value]) ? t.modelValue[f.value] : []), x = {
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
    }, S = () => ({ field: "category", op: "eq", value: "unstarted" }), w = M(/* @__PURE__ */ new Set());
    function A(oe, z) {
      z ? w.value.delete(oe) : w.value.add(oe), l("validity", w.value.size === 0);
    }
    Te(f, () => {
      w.value.clear(), l("validity", !0);
    });
    function $(oe) {
      const z = /* @__PURE__ */ new Set();
      for (const W of w.value) {
        const U = Number(W);
        !Number.isNaN(U) && U !== oe && z.add(String(U > oe ? U - 1 : U));
      }
      w.value = z, l("validity", z.size === 0), k({ [f.value]: p.value.filter((W, U) => U !== oe) });
    }
    function g(oe) {
      l("update:modelValue", oe);
    }
    function k(oe) {
      g({ ...t.modelValue, ...oe });
    }
    function C(oe) {
      g(oe === "field" ? S() : oe === "and" || oe === "or" ? { [oe]: [S()] } : oe === "not" ? { not: S() } : oe === "history" ? { history: { field: "state", changed: !0 } } : oe === "match" ? { match: "" } : oe === "children" ? { children: !0, q: "some", where: S() } : { rel: t.schema.compiled.relation_types?.[0]?.id ?? "", dir: "outward", q: "some", where: S() });
    }
    function H(oe, z) {
      k({ [f.value]: p.value.map((W, U) => U === oe ? z : W) });
    }
    function P(oe, z) {
      const W = { ...i.value };
      z === void 0 ? (delete W[oe], A(oe, !0)) : W[oe] = z, k({ history: W });
    }
    function G(oe) {
      w.value.clear(), l("validity", !0);
      const z = { ...i.value };
      delete z.was, delete z.changed, delete z.from, delete z.to, z[oe] = oe === "changed" ? !0 : "", k({ history: z });
    }
    const ne = { code: "actor", form: "text" }, re = { code: "at", form: "time" }, ve = L(() => Array.isArray(i.value.during) ? i.value.during : []);
    function ke(oe, z) {
      const W = [...ve.value];
      W[oe] = z, P("during", W);
    }
    return (oe, z) => {
      const W = Io("FilterNode", !0);
      return n(), b("fieldset", {
        class: "work-filter-node",
        disabled: e.disabled
      }, [
        s("legend", Gn, D(o.value), 1),
        s("label", Hn, [
          z[21] || (z[21] = B("Condition", -1)),
          h(r(me), {
            "aria-label": o.value + " condition",
            "model-value": f.value,
            "onUpdate:modelValue": z[0] || (z[0] = (U) => C(U)),
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            optionDisabled: "disabled",
            options: Object.entries(y).map(([U, q]) => ({ label: q, value: U, disabled: d.value >= 6 && ["and", "or", "not", "rel", "children"].includes(U) }))
          }, null, 8, ["aria-label", "model-value", "options"])
        ]),
        f.value === "and" || f.value === "or" ? (n(), b(te, { key: 0 }, [
          (n(!0), b(te, null, se(p.value, (U, q) => (n(), b("div", {
            key: q,
            class: "work-stack work-tight"
          }, [
            h(W, {
              "board-id": e.boardId,
              schema: e.schema,
              "model-value": U,
              path: o.value + "." + f.value + "[" + q + "]",
              depth: d.value + 1,
              "onUpdate:modelValue": (ce) => H(q, ce),
              onValidity: (ce) => A(String(q), ce)
            }, null, 8, ["board-id", "schema", "model-value", "path", "depth", "onUpdate:modelValue", "onValidity"]),
            h(r(_), {
              label: "Remove condition",
              size: "small",
              severity: "secondary",
              onClick: (ce) => $(q),
              outlined: ""
            }, {
              icon: K(() => [
                h(r(de), {
                  icon: "tabler:trash",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["onClick"])
          ]))), 128)),
          h(r(_), {
            label: "Add condition",
            size: "small",
            severity: "secondary",
            disabled: d.value >= 6,
            onClick: z[1] || (z[1] = (U) => k({ [f.value]: [...p.value, S()] })),
            outlined: ""
          }, {
            icon: K(() => [
              h(r(de), {
                icon: "tabler:plus",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled"])
        ], 64)) : f.value === "not" ? (n(), J(W, {
          key: 1,
          "board-id": e.boardId,
          schema: e.schema,
          "model-value": r(qt)(e.modelValue.not),
          path: o.value + ".not",
          depth: d.value + 1,
          "onUpdate:modelValue": z[2] || (z[2] = (U) => k({ not: U })),
          onValidity: z[3] || (z[3] = (U) => A("nested", U))
        }, null, 8, ["board-id", "schema", "model-value", "path", "depth"])) : f.value === "field" ? (n(), b(te, { key: 2 }, [
          s("div", Yn, [
            s("label", null, [
              z[22] || (z[22] = B("Field", -1)),
              h(r(me), {
                "aria-label": o.value + " field",
                "model-value": e.modelValue.field,
                "onUpdate:modelValue": z[4] || (z[4] = (U) => k({ field: U, op: "eq", value: void 0 })),
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                optionDisabled: "disabled",
                options: [...(m.value ?? []).map((U) => ({ label: r(Ye)(U), value: U.code, disabled: !1 }))]
              }, null, 8, ["aria-label", "model-value", "options"])
            ]),
            s("label", null, [
              z[23] || (z[23] = B("Comparison", -1)),
              h(r(me), {
                "aria-label": o.value + " operator",
                "model-value": e.modelValue.op,
                "onUpdate:modelValue": z[5] || (z[5] = (U) => k({ op: U, value: U === "is_null" ? !0 : void 0 })),
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                options: r($n)(u.value).map((U) => ({ value: U, label: x[U] }))
              }, null, 8, ["aria-label", "model-value", "options"])
            ])
          ]),
          h(fa, {
            "board-id": e.boardId,
            field: e.modelValue.op === "is_null" ? { code: "null", form: "bool" } : u.value,
            "model-value": e.modelValue.value,
            multiple: ["in", "nin", "between"].includes(String(e.modelValue.op)),
            label: o.value + " value",
            "onUpdate:modelValue": z[6] || (z[6] = (U) => k({ value: U })),
            onValidity: z[7] || (z[7] = (U) => A("value", U))
          }, null, 8, ["board-id", "field", "model-value", "multiple", "label"])
        ], 64)) : f.value === "match" ? (n(), b("label", Xn, [
          z[24] || (z[24] = B("Search", -1)),
          h(r(ge), {
            "aria-label": o.value + " search",
            value: e.modelValue.match,
            onInput: z[8] || (z[8] = (U) => k({ match: U.target.value }))
          }, null, 8, ["aria-label", "value"])
        ])) : f.value === "history" ? (n(), b(te, { key: 4 }, [
          s("div", Jn, [
            s("label", null, [
              z[25] || (z[25] = B("Field", -1)),
              h(r(me), {
                "aria-label": o.value + " history field",
                "model-value": i.value.field,
                "onUpdate:modelValue": z[9] || (z[9] = (U) => P("field", U)),
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                optionDisabled: "disabled",
                options: [...(m.value ?? []).map((U) => ({ label: r(Ye)(U), value: U.code, disabled: !1 }))]
              }, null, 8, ["aria-label", "model-value", "options"])
            ]),
            s("label", null, [
              z[26] || (z[26] = B("History", -1)),
              h(r(me), {
                "aria-label": o.value + " history mode",
                "model-value": i.value.changed ? "changed" : "was",
                "onUpdate:modelValue": z[10] || (z[10] = (U) => G(U)),
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                optionDisabled: "disabled",
                options: [{ label: "Changed", value: "changed", disabled: !1 }, { label: "Was", value: "was", disabled: !1 }]
              }, null, 8, ["aria-label", "model-value"])
            ])
          ]),
          i.value.changed ? (n(), b(te, { key: 0 }, se(["from", "to"], (U) => s("div", { key: U }, [
            s("label", Zn, [
              h(r(Kt), {
                "model-value": U in i.value,
                "aria-label": "Constrain " + U,
                "onUpdate:modelValue": (q) => P(U, q ? "" : void 0),
                binary: ""
              }, null, 8, ["model-value", "aria-label", "onUpdate:modelValue"]),
              B(D(U), 1)
            ]),
            U in i.value ? (n(), J(fa, {
              key: 0,
              "board-id": e.boardId,
              field: c.value,
              "model-value": i.value[U],
              label: o.value + " history " + U,
              "onUpdate:modelValue": (q) => P(U, q),
              onValidity: (q) => A(U, q)
            }, null, 8, ["board-id", "field", "model-value", "label", "onUpdate:modelValue", "onValidity"])) : I("", !0)
          ])), 64)) : (n(), J(fa, {
            key: 1,
            "board-id": e.boardId,
            field: c.value,
            "model-value": i.value.was,
            label: o.value + " history was",
            "onUpdate:modelValue": z[11] || (z[11] = (U) => P("was", U)),
            onValidity: z[12] || (z[12] = (U) => A("was", U))
          }, null, 8, ["board-id", "field", "model-value", "label"])),
          s("label", Qn, [
            h(r(Kt), {
              "model-value": "by" in i.value,
              "aria-label": "Constrain actor",
              "onUpdate:modelValue": z[13] || (z[13] = (U) => P("by", U ? { $actor: "id" } : void 0)),
              binary: ""
            }, null, 8, ["model-value"]),
            z[27] || (z[27] = B("By actor", -1))
          ]),
          "by" in i.value ? (n(), J(fa, {
            key: 2,
            "board-id": e.boardId,
            field: ne,
            "model-value": i.value.by,
            label: o.value + " history by",
            "onUpdate:modelValue": z[14] || (z[14] = (U) => P("by", U))
          }, null, 8, ["board-id", "model-value", "label"])) : I("", !0),
          s("label", _n, [
            h(r(Kt), {
              "model-value": "during" in i.value,
              "aria-label": "Constrain time window",
              "onUpdate:modelValue": z[15] || (z[15] = (U) => P("during", U ? [{ $now: "-P30D" }, { $now: "P0D" }] : void 0)),
              binary: ""
            }, null, 8, ["model-value"]),
            z[28] || (z[28] = B("During", -1))
          ]),
          "during" in i.value ? (n(), b("div", es, [
            (n(), b(te, null, se(["start", "end"], (U, q) => h(fa, {
              key: U,
              "board-id": e.boardId,
              field: re,
              "model-value": ve.value[q],
              label: o.value + " during " + U,
              "onUpdate:modelValue": (ce) => ke(q, ce)
            }, null, 8, ["board-id", "model-value", "label", "onUpdate:modelValue"])), 64))
          ])) : I("", !0)
        ], 64)) : (n(), b(te, { key: 5 }, [
          s("div", ts, [
            f.value === "rel" ? (n(), b(te, { key: 0 }, [
              s("label", null, [
                z[29] || (z[29] = B("Relation", -1)),
                h(r(me), {
                  "model-value": e.modelValue.rel,
                  "onUpdate:modelValue": z[16] || (z[16] = (U) => k({ rel: U })),
                  appendTo: "self",
                  optionLabel: "label",
                  optionValue: "value",
                  optionDisabled: "disabled",
                  options: [...(e.schema.compiled.relation_types ?? []).map((U) => ({ label: U.outward ?? U.id, value: U.id, disabled: !1 }))]
                }, null, 8, ["model-value", "options"])
              ]),
              s("label", null, [
                z[30] || (z[30] = B("Direction", -1)),
                h(r(me), {
                  "model-value": e.modelValue.dir,
                  "onUpdate:modelValue": z[17] || (z[17] = (U) => k({ dir: U })),
                  appendTo: "self",
                  optionLabel: "label",
                  optionValue: "value",
                  optionDisabled: "disabled",
                  options: [{ label: "Outward", value: "outward", disabled: !1 }, { label: "Inward", value: "inward", disabled: !1 }]
                }, null, 8, ["model-value"])
              ])
            ], 64)) : I("", !0),
            s("label", null, [
              z[31] || (z[31] = B("Quantifier", -1)),
              h(r(me), {
                "model-value": e.modelValue.q,
                "onUpdate:modelValue": z[18] || (z[18] = (U) => k({ q: U })),
                appendTo: "self",
                options: ["some", "every", "none"]
              }, null, 8, ["model-value"])
            ])
          ]),
          h(W, {
            "board-id": e.boardId,
            schema: e.schema,
            "model-value": r(qt)(e.modelValue.where),
            path: o.value + ".where",
            depth: d.value + 1,
            "onUpdate:modelValue": z[19] || (z[19] = (U) => k({ where: U })),
            onValidity: z[20] || (z[20] = (U) => A("nested", U))
          }, null, 8, ["board-id", "schema", "model-value", "path", "depth"])
        ], 64))
      ], 8, Kn);
    };
  }
}), ls = { class: "work-stack work-tight" }, os = { class: "work-row work-small" }, zl = /* @__PURE__ */ ye({
  __name: "ConditionEditor",
  props: {
    modelValue: {},
    draft: {},
    boardId: {},
    label: {}
  },
  emits: ["update:modelValue", "validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = L(() => ({ declaration: t.draft, compiled: t.draft, generation: 0, as_of: 0, key_prefix: "" })), d = /* @__PURE__ */ new Set();
    function f(u, i) {
      i ? d.delete(u) : d.add(u), l("validity", !d.size);
    }
    function m(u) {
      l("update:modelValue", u ? { field: t.draft.fields?.[0]?.code ?? "state", op: "eq" } : void 0), u || (d.clear(), l("validity", !0));
    }
    return St(() => l("validity", !0)), (u, i) => (n(), b("section", ls, [
      s("label", os, [
        h(r(_e), {
          "model-value": e.modelValue != null,
          "aria-label": e.label,
          "onUpdate:modelValue": m
        }, null, 8, ["model-value", "aria-label"]),
        B(D(e.label), 1)
      ]),
      e.modelValue != null ? (n(), J(as, {
        key: 0,
        schema: o.value,
        "board-id": e.boardId ?? "",
        "model-value": r(qt)(e.modelValue),
        path: e.label,
        "onUpdate:modelValue": i[0] || (i[0] = (c) => l("update:modelValue", c)),
        onValidity: i[1] || (i[1] = (c) => f("structured", c))
      }, null, 8, ["schema", "board-id", "model-value", "path"])) : I("", !0),
      e.modelValue != null ? (n(), J(Ot, {
        key: 1,
        label: e.label + " predicate",
        "model-value": e.modelValue,
        hint: "Use any predicate accepted by Work, including installed or deeply nested forms.",
        "onUpdate:modelValue": i[2] || (i[2] = (c) => l("update:modelValue", c)),
        onValidity: i[3] || (i[3] = (c) => f("raw", c))
      }, null, 8, ["label", "model-value"])) : I("", !0)
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
}, jl = /* @__PURE__ */ ye({
  __name: "PrincipalsPicker",
  props: {
    modelValue: {},
    label: {},
    kinds: {},
    boardId: {}
  },
  emits: ["update:modelValue"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = M(!1), d = M(0), f = L(() => t.modelValue ?? []), { principalLabel: m, rememberPrincipal: u, nameError: i } = Do(() => t.boardId ?? "", () => f.value);
    Ia(async () => {
      o.value = await At("wc-principal-picker");
    });
    function c(p) {
      const x = p.detail, y = x?.principal_id ?? x?.id;
      if (!y) return;
      const S = { kind: x.type ?? "user", id: y };
      x.label && u(S, x.label), f.value.some((w) => w.id === y && w.kind === S.kind) || l("update:modelValue", [...f.value, S]), d.value++;
    }
    return (p, x) => (n(), b(te, null, [
      r(i) ? (n(), b("p", is, D(r(i)), 1)) : I("", !0),
      s("section", {
        class: "work-stack work-tight work-principals-picker",
        "aria-label": e.label
      }, [
        s("h4", ss, D(e.label), 1),
        f.value.length ? (n(), b("div", rs, [
          (n(!0), b(te, null, se(f.value, (y, S) => (n(), J(r(We), {
            key: y.kind + y.id,
            severity: "secondary",
            class: "kx-tag-sm"
          }, {
            default: K(() => [
              B(D(r(m)(y)), 1),
              h(r(_), {
                text: "",
                severity: "secondary",
                size: "small",
                "aria-label": "Remove " + r(m)(y),
                onClick: (w) => l("update:modelValue", f.value.filter((A, $) => $ !== S))
              }, {
                default: K(() => [
                  h(r(de), { icon: "tabler:x" })
                ]),
                _: 1
              }, 8, ["aria-label", "onClick"])
            ]),
            _: 2
          }, 1024))), 128))
        ])) : I("", !0),
        o.value ? (n(), b("wc-principal-picker", {
          key: d.value,
          kinds: e.kinds ?? "user,group",
          onConfigChanged: c
        }, null, 40, ds)) : (n(), b("p", us, "People and group picker is unavailable."))
      ], 8, ns)
    ], 64));
  }
}), cs = { class: "work-stack work-tight" }, Lo = /* @__PURE__ */ ye({
  __name: "HoldersPicker",
  props: {
    modelValue: {},
    label: {},
    boardId: {}
  },
  emits: ["update:modelValue", "validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = L(() => (t.modelValue ?? []).flatMap((f) => "user" in f ? [{ kind: "user", id: f.user }] : "group" in f ? [{ kind: "group", id: f.group }] : []));
    function d(f) {
      const m = [...(t.modelValue ?? []).filter((u) => "field" in u || "service" in u), ...f.map((u) => u.kind === "group" ? { group: u.id } : { user: u.id })];
      l("update:modelValue", m.length ? m : void 0);
    }
    return (f, m) => (n(), b("div", cs, [
      h(jl, {
        "board-id": e.boardId,
        label: e.label,
        "model-value": o.value,
        "onUpdate:modelValue": d
      }, null, 8, ["board-id", "label", "model-value"]),
      h(Ot, {
        label: e.label + " rules",
        "model-value": e.modelValue,
        shape: "array",
        example: [{ group: "selected-group" }],
        "onUpdate:modelValue": m[0] || (m[0] = (u) => l("update:modelValue", u)),
        onValidity: m[1] || (m[1] = (u) => l("validity", u))
      }, null, 8, ["label", "model-value"])
    ]));
  }
}), vs = ["disabled"], ms = { class: "work-chips" }, fs = {
  key: 1,
  class: "work-muted work-small"
}, mt = /* @__PURE__ */ ye({
  __name: "ChipPicker",
  props: {
    label: {},
    options: {},
    modelValue: {},
    disabled: { type: Boolean }
  },
  emits: ["update:modelValue"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = M(""), d = L(() => t.options.map((u) => typeof u == "string" ? { value: u } : u)), f = L(() => d.value.filter((u) => (u.label ?? Re(u.value)).toLocaleLowerCase().includes(o.value.toLocaleLowerCase())));
    function m(u) {
      if (t.disabled) return;
      const i = t.modelValue ?? [];
      l("update:modelValue", i.includes(u) ? i.filter((c) => c !== u) : [...i, u]);
    }
    return (u, i) => (n(), b("fieldset", {
      class: "work-chip-picker",
      disabled: e.disabled
    }, [
      s("legend", null, D(e.label), 1),
      e.options.length > 10 ? (n(), J(r(ge), {
        key: 0,
        modelValue: o.value,
        "onUpdate:modelValue": i[0] || (i[0] = (c) => o.value = c),
        type: "search",
        "aria-label": "Find " + e.label.toLowerCase(),
        placeholder: "Find a choice…"
      }, null, 8, ["modelValue", "aria-label"])) : I("", !0),
      s("div", ms, [
        h(r(Ll), {
          "model-value": e.modelValue ?? [],
          options: f.value.map((c) => ({ value: c.value, label: c.label ?? r(Re)(c.value) })),
          optionLabel: "label",
          optionValue: "value",
          multiple: "",
          disabled: e.disabled,
          "aria-label": e.label,
          "onUpdate:modelValue": i[1] || (i[1] = (c) => l("update:modelValue", c ?? []))
        }, null, 8, ["model-value", "options", "disabled", "aria-label"]),
        (n(!0), b(te, null, se(e.modelValue?.filter((c) => !d.value.some((p) => p.value === c)) ?? [], (c) => (n(), J(r(_), {
          severity: "secondary",
          text: "",
          size: "small",
          key: c,
          type: "button",
          class: "work-choice work-unavailable",
          "aria-label": "Remove unavailable " + c,
          onClick: (p) => m(c)
        }, {
          default: K(() => [
            B(D(r(Re)(c)) + " · unavailable ×", 1)
          ]),
          _: 2
        }, 1032, ["aria-label", "onClick"]))), 128))
      ]),
      e.options.length ? I("", !0) : (n(), b("span", fs, "No choices declared."))
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
function Ct() {
  return Ct = Object.assign ? Object.assign.bind() : function(e) {
    for (var a = 1; a < arguments.length; a++) {
      var t = arguments[a];
      for (var l in t) ({}).hasOwnProperty.call(t, l) && (e[l] = t[l]);
    }
    return e;
  }, Ct.apply(null, arguments);
}
function uo(e, a) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(e);
    a && (l = l.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), t.push.apply(t, l);
  }
  return t;
}
function bt(e) {
  for (var a = 1; a < arguments.length; a++) {
    var t = arguments[a] != null ? arguments[a] : {};
    a % 2 ? uo(Object(t), !0).forEach(function(l) {
      ps(e, l, t[l]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : uo(Object(t)).forEach(function(l) {
      Object.defineProperty(e, l, Object.getOwnPropertyDescriptor(t, l));
    });
  }
  return e;
}
function bs(e, a) {
  if (e == null) return {};
  var t, l, o = hs(e, a);
  if (Object.getOwnPropertySymbols) {
    var d = Object.getOwnPropertySymbols(e);
    for (l = 0; l < d.length; l++) t = d[l], a.indexOf(t) === -1 && {}.propertyIsEnumerable.call(e, t) && (o[t] = e[t]);
  }
  return o;
}
function hs(e, a) {
  if (e == null) return {};
  var t = {};
  for (var l in e) if ({}.hasOwnProperty.call(e, l)) {
    if (a.indexOf(l) !== -1) continue;
    t[l] = e[l];
  }
  return t;
}
function gs(e, a) {
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
  var a = gs(e, "string");
  return typeof a == "symbol" ? a : a + "";
}
function El(e) {
  "@babel/helpers - typeof";
  return El = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(a) {
    return typeof a;
  } : function(a) {
    return a && typeof Symbol == "function" && a.constructor === Symbol && a !== Symbol.prototype ? "symbol" : typeof a;
  }, El(e);
}
var ks = "1.15.7";
function xt(e) {
  if (typeof window < "u" && window.navigator)
    return !!/* @__PURE__ */ navigator.userAgent.match(e);
}
var Tt = xt(/(?:Trident.*rv[ :]?11\.|msie|iemobile|Windows Phone)/i), Da = xt(/Edge/i), co = xt(/firefox/i), wa = xt(/safari/i) && !xt(/chrome/i) && !xt(/android/i), Wl = xt(/iP(ad|od|hone)/i), Bo = xt(/chrome/i) && xt(/android/i), zo = {
  capture: !1,
  passive: !1
};
function Ce(e, a, t) {
  e.addEventListener(a, t, !Tt && zo);
}
function xe(e, a, t) {
  e.removeEventListener(a, t, !Tt && zo);
}
function Xa(e, a) {
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
function jo(e) {
  return e.host && e !== document && e.host.nodeType && e.host !== e ? e.host : e.parentNode;
}
function vt(e, a, t, l) {
  if (e) {
    t = t || document;
    do {
      if (a != null && (a[0] === ">" ? e.parentNode === t && Xa(e, a) : Xa(e, a)) || l && e === t)
        return e;
      if (e === t) break;
    } while (e = jo(e));
  }
  return null;
}
var vo = /\s+/g;
function et(e, a, t) {
  if (e && a)
    if (e.classList)
      e.classList[t ? "add" : "remove"](a);
    else {
      var l = (" " + e.className + " ").replace(vo, " ").replace(" " + a + " ", " ");
      e.className = (l + (t ? " " + a : "")).replace(vo, " ");
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
function ia(e, a) {
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
function Wo(e, a, t) {
  if (e) {
    var l = e.getElementsByTagName(a), o = 0, d = l.length;
    if (t)
      for (; o < d; o++)
        t(l[o], o);
    return l;
  }
  return [];
}
function pt() {
  var e = document.scrollingElement;
  return e || document.documentElement;
}
function Le(e, a, t, l, o) {
  if (!(!e.getBoundingClientRect && e !== window)) {
    var d, f, m, u, i, c, p;
    if (e !== window && e.parentNode && e !== pt() ? (d = e.getBoundingClientRect(), f = d.top, m = d.left, u = d.bottom, i = d.right, c = d.height, p = d.width) : (f = 0, m = 0, u = window.innerHeight, i = window.innerWidth, c = window.innerHeight, p = window.innerWidth), (a || t) && e !== window && (o = o || e.parentNode, !Tt))
      do
        if (o && o.getBoundingClientRect && (fe(o, "transform") !== "none" || t && fe(o, "position") !== "static")) {
          var x = o.getBoundingClientRect();
          f -= x.top + parseInt(fe(o, "border-top-width")), m -= x.left + parseInt(fe(o, "border-left-width")), u = f + d.height, i = m + d.width;
          break;
        }
      while (o = o.parentNode);
    if (l && e !== window) {
      var y = ia(o || e), S = y && y.a, w = y && y.d;
      y && (f /= w, m /= S, p /= S, c /= w, u = f + c, i = m + p);
    }
    return {
      top: f,
      left: m,
      bottom: u,
      right: i,
      width: p,
      height: c
    };
  }
}
function mo(e, a, t) {
  for (var l = Et(e, !0), o = Le(e)[a]; l; ) {
    var d = Le(l)[t], f = void 0;
    if (f = o >= d, !f) return l;
    if (l === pt()) break;
    l = Et(l, !1);
  }
  return !1;
}
function na(e, a, t, l) {
  for (var o = 0, d = 0, f = e.children; d < f.length; ) {
    if (f[d].style.display !== "none" && f[d] !== pe.ghost && (l || f[d] !== pe.dragged) && vt(f[d], t.draggable, e, !1)) {
      if (o === a)
        return f[d];
      o++;
    }
    d++;
  }
  return null;
}
function ql(e, a) {
  for (var t = e.lastElementChild; t && (t === pe.ghost || fe(t, "display") === "none" || a && !Xa(t, a)); )
    t = t.previousElementSibling;
  return t || null;
}
function lt(e, a) {
  var t = 0;
  if (!e || !e.parentNode)
    return -1;
  for (; e = e.previousElementSibling; )
    e.nodeName.toUpperCase() !== "TEMPLATE" && e !== pe.clone && (!a || Xa(e, a)) && t++;
  return t;
}
function fo(e) {
  var a = 0, t = 0, l = pt();
  if (e)
    do {
      var o = ia(e), d = o.a, f = o.d;
      a += e.scrollLeft * d, t += e.scrollTop * f;
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
function Et(e, a) {
  if (!e || !e.getBoundingClientRect) return pt();
  var t = e, l = !1;
  do
    if (t.clientWidth < t.scrollWidth || t.clientHeight < t.scrollHeight) {
      var o = fe(t);
      if (t.clientWidth < t.scrollWidth && (o.overflowX == "auto" || o.overflowX == "scroll") || t.clientHeight < t.scrollHeight && (o.overflowY == "auto" || o.overflowY == "scroll")) {
        if (!t.getBoundingClientRect || t === document.body) return pt();
        if (l || a) return t;
        l = !0;
      }
    }
  while (t = t.parentNode);
  return pt();
}
function Vs(e, a) {
  if (e && a)
    for (var t in a)
      a.hasOwnProperty(t) && (e[t] = a[t]);
  return e;
}
function gl(e, a) {
  return Math.round(e.top) === Math.round(a.top) && Math.round(e.left) === Math.round(a.left) && Math.round(e.height) === Math.round(a.height) && Math.round(e.width) === Math.round(a.width);
}
var Va;
function qo(e, a) {
  return function() {
    if (!Va) {
      var t = arguments, l = this;
      t.length === 1 ? e.call(l, t[0]) : e.apply(l, t), Va = setTimeout(function() {
        Va = void 0;
      }, a);
    }
  };
}
function $s() {
  clearTimeout(Va), Va = void 0;
}
function Ko(e, a, t) {
  e.scrollLeft += a, e.scrollTop += t;
}
function Go(e) {
  var a = window.Polymer, t = window.jQuery || window.Zepto;
  return a && a.dom ? a.dom(e).cloneNode(!0) : t ? t(e).clone(!0)[0] : e.cloneNode(!0);
}
function Ho(e, a, t) {
  var l = {};
  return Array.from(e.children).forEach(function(o) {
    var d, f, m, u;
    if (!(!vt(o, a.draggable, e, !1) || o.animated || o === t)) {
      var i = Le(o);
      l.left = Math.min((d = l.left) !== null && d !== void 0 ? d : 1 / 0, i.left), l.top = Math.min((f = l.top) !== null && f !== void 0 ? f : 1 / 0, i.top), l.right = Math.max((m = l.right) !== null && m !== void 0 ? m : -1 / 0, i.right), l.bottom = Math.max((u = l.bottom) !== null && u !== void 0 ? u : -1 / 0, i.bottom);
    }
  }), l.width = l.right - l.left, l.height = l.bottom - l.top, l.x = l.left, l.y = l.top, l;
}
var Qe = "Sortable" + (/* @__PURE__ */ new Date()).getTime();
function xs() {
  var e = [], a;
  return {
    captureAnimationState: function() {
      if (e = [], !!this.options.animation) {
        var l = [].slice.call(this.el.children);
        l.forEach(function(o) {
          if (!(fe(o, "display") === "none" || o === pe.ghost)) {
            e.push({
              target: o,
              rect: Le(o)
            });
            var d = bt({}, e[e.length - 1].rect);
            if (o.thisAnimationDuration) {
              var f = ia(o, !0);
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
      var d = !1, f = 0;
      e.forEach(function(m) {
        var u = 0, i = m.target, c = i.fromRect, p = Le(i), x = i.prevFromRect, y = i.prevToRect, S = m.rect, w = ia(i, !0);
        w && (p.top -= w.f, p.left -= w.e), i.toRect = p, i.thisAnimationDuration && gl(x, p) && !gl(c, p) && // Make sure animatingRect is on line between toRect & fromRect
        (S.top - p.top) / (S.left - p.left) === (c.top - p.top) / (c.left - p.left) && (u = Ss(S, x, y, o.options)), gl(p, c) || (i.prevFromRect = c, i.prevToRect = p, u || (u = o.options.animation), o.animate(i, S, p, u)), u && (d = !0, f = Math.max(f, u), clearTimeout(i.animationResetTimer), i.animationResetTimer = setTimeout(function() {
          i.animationTime = 0, i.prevFromRect = null, i.fromRect = null, i.prevToRect = null, i.thisAnimationDuration = null;
        }, u), i.thisAnimationDuration = u);
      }), clearTimeout(a), d ? a = setTimeout(function() {
        typeof l == "function" && l();
      }, f) : typeof l == "function" && l(), e = [];
    },
    animate: function(l, o, d, f) {
      if (f) {
        fe(l, "transition", ""), fe(l, "transform", "");
        var m = ia(this.el), u = m && m.a, i = m && m.d, c = (o.left - d.left) / (u || 1), p = (o.top - d.top) / (i || 1);
        l.animatingX = !!c, l.animatingY = !!p, fe(l, "transform", "translate3d(" + c + "px," + p + "px,0)"), this.forRepaintDummy = Cs(l), fe(l, "transition", "transform " + f + "ms" + (this.options.easing ? " " + this.options.easing : "")), fe(l, "transform", "translate3d(0,0,0)"), typeof l.animated == "number" && clearTimeout(l.animated), l.animated = setTimeout(function() {
          fe(l, "transition", ""), fe(l, "transform", ""), l.animated = !1, l.animatingX = !1, l.animatingY = !1;
        }, f);
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
var _t = [], yl = {
  initializeByDefault: !0
}, Ea = {
  mount: function(a) {
    for (var t in yl)
      yl.hasOwnProperty(t) && !(t in a) && (a[t] = yl[t]);
    _t.forEach(function(l) {
      if (l.pluginName === a.pluginName)
        throw "Sortable: Cannot mount plugin ".concat(a.pluginName, " more than once");
    }), _t.push(a);
  },
  pluginEvent: function(a, t, l) {
    var o = this;
    this.eventCanceled = !1, l.cancel = function() {
      o.eventCanceled = !0;
    };
    var d = a + "Global";
    _t.forEach(function(f) {
      t[f.pluginName] && (t[f.pluginName][d] && t[f.pluginName][d](bt({
        sortable: t
      }, l)), t.options[f.pluginName] && t[f.pluginName][a] && t[f.pluginName][a](bt({
        sortable: t
      }, l)));
    });
  },
  initializePlugins: function(a, t, l, o) {
    _t.forEach(function(m) {
      var u = m.pluginName;
      if (!(!a.options[u] && !m.initializeByDefault)) {
        var i = new m(a, t, a.options);
        i.sortable = a, i.options = a.options, a[u] = i, Ct(l, i.defaults);
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
    return _t.forEach(function(o) {
      typeof o.eventProperties == "function" && Ct(l, o.eventProperties.call(t[o.pluginName], a));
    }), l;
  },
  modifyOption: function(a, t, l) {
    var o;
    return _t.forEach(function(d) {
      a[d.pluginName] && d.optionListeners && typeof d.optionListeners[t] == "function" && (o = d.optionListeners[t].call(a[d.pluginName], l));
    }), o;
  }
};
function Ts(e) {
  var a = e.sortable, t = e.rootEl, l = e.name, o = e.targetEl, d = e.cloneEl, f = e.toEl, m = e.fromEl, u = e.oldIndex, i = e.newIndex, c = e.oldDraggableIndex, p = e.newDraggableIndex, x = e.originalEvent, y = e.putSortable, S = e.extraEventProperties;
  if (a = a || t && t[Qe], !!a) {
    var w, A = a.options, $ = "on" + l.charAt(0).toUpperCase() + l.substr(1);
    window.CustomEvent && !Tt && !Da ? w = new CustomEvent(l, {
      bubbles: !0,
      cancelable: !0
    }) : (w = document.createEvent("Event"), w.initEvent(l, !0, !0)), w.to = f || t, w.from = m || t, w.item = o || t, w.clone = d, w.oldIndex = u, w.newIndex = i, w.oldDraggableIndex = c, w.newDraggableIndex = p, w.originalEvent = x, w.pullMode = y ? y.lastPutMode : void 0;
    var g = bt(bt({}, S), Ea.getEventProperties(l, a));
    for (var k in g)
      w[k] = g[k];
    t && t.dispatchEvent(w), A[$] && A[$].call(a, w);
  }
}
var Is = ["evt"], Ze = function(a, t) {
  var l = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, o = l.evt, d = bs(l, Is);
  Ea.pluginEvent.bind(pe)(a, t, bt({
    dragEl: le,
    parentEl: Me,
    ghostEl: be,
    rootEl: Ae,
    nextEl: zt,
    lastDownEl: Wa,
    cloneEl: Pe,
    cloneHidden: Dt,
    dragStarted: pa,
    putSortable: Ge,
    activeSortable: pe.active,
    originalEvent: o,
    oldIndex: oa,
    oldDraggableIndex: $a,
    newIndex: tt,
    newDraggableIndex: Ut,
    hideGhostForTarget: Zo,
    unhideGhostForTarget: Qo,
    cloneNowHidden: function() {
      Dt = !0;
    },
    cloneNowShown: function() {
      Dt = !1;
    },
    dispatchSortableEvent: function(m) {
      Xe({
        sortable: t,
        name: m,
        originalEvent: o
      });
    }
  }, d));
};
function Xe(e) {
  Ts(bt({
    putSortable: Ge,
    cloneEl: Pe,
    targetEl: le,
    rootEl: Ae,
    oldIndex: oa,
    oldDraggableIndex: $a,
    newIndex: tt,
    newDraggableIndex: Ut
  }, e));
}
var le, Me, be, Ae, zt, Wa, Pe, Dt, oa, tt, $a, Ut, Fa, Ge, ta = !1, Ja = !1, Za = [], Ft, ut, kl, wl, po, bo, pa, ea, xa, Ca = !1, La = !1, qa, He, Vl = [], Al = !1, Qa = [], ol = typeof document < "u", Ba = Wl, ho = Da || Tt ? "cssFloat" : "float", Us = ol && !Bo && !Wl && "draggable" in document.createElement("div"), Yo = (function() {
  if (ol) {
    if (Tt)
      return !1;
    var e = document.createElement("x");
    return e.style.cssText = "pointer-events:auto", e.style.pointerEvents === "auto";
  }
})(), Xo = function(a, t) {
  var l = fe(a), o = parseInt(l.width) - parseInt(l.paddingLeft) - parseInt(l.paddingRight) - parseInt(l.borderLeftWidth) - parseInt(l.borderRightWidth), d = na(a, 0, t), f = na(a, 1, t), m = d && fe(d), u = f && fe(f), i = m && parseInt(m.marginLeft) + parseInt(m.marginRight) + Le(d).width, c = u && parseInt(u.marginLeft) + parseInt(u.marginRight) + Le(f).width;
  if (l.display === "flex")
    return l.flexDirection === "column" || l.flexDirection === "column-reverse" ? "vertical" : "horizontal";
  if (l.display === "grid")
    return l.gridTemplateColumns.split(" ").length <= 1 ? "vertical" : "horizontal";
  if (d && m.float && m.float !== "none") {
    var p = m.float === "left" ? "left" : "right";
    return f && (u.clear === "both" || u.clear === p) ? "vertical" : "horizontal";
  }
  return d && (m.display === "block" || m.display === "flex" || m.display === "table" || m.display === "grid" || i >= o && l[ho] === "none" || f && l[ho] === "none" && i + c > o) ? "vertical" : "horizontal";
}, Ds = function(a, t, l) {
  var o = l ? a.left : a.top, d = l ? a.right : a.bottom, f = l ? a.width : a.height, m = l ? t.left : t.top, u = l ? t.right : t.bottom, i = l ? t.width : t.height;
  return o === m || d === u || o + f / 2 === m + i / 2;
}, Es = function(a, t) {
  var l;
  return Za.some(function(o) {
    var d = o[Qe].options.emptyInsertThreshold;
    if (!(!d || ql(o))) {
      var f = Le(o), m = a >= f.left - d && a <= f.right + d, u = t >= f.top - d && t <= f.bottom + d;
      if (m && u)
        return l = o;
    }
  }), l;
}, Jo = function(a) {
  function t(d, f) {
    return function(m, u, i, c) {
      var p = m.options.group.name && u.options.group.name && m.options.group.name === u.options.group.name;
      if (d == null && (f || p))
        return !0;
      if (d == null || d === !1)
        return !1;
      if (f && d === "clone")
        return d;
      if (typeof d == "function")
        return t(d(m, u, i, c), f)(m, u, i, c);
      var x = (f ? m : u).options.group.name;
      return d === !0 || typeof d == "string" && d === x || d.join && d.indexOf(x) > -1;
    };
  }
  var l = {}, o = a.group;
  (!o || El(o) != "object") && (o = {
    name: o
  }), l.name = o.name, l.checkPull = t(o.pull, !0), l.checkPut = t(o.put), l.revertClone = o.revertClone, a.group = l;
}, Zo = function() {
  !Yo && be && fe(be, "display", "none");
}, Qo = function() {
  !Yo && be && fe(be, "display", "");
};
ol && !Bo && document.addEventListener("click", function(e) {
  if (Ja)
    return e.preventDefault(), e.stopPropagation && e.stopPropagation(), e.stopImmediatePropagation && e.stopImmediatePropagation(), Ja = !1, !1;
}, !0);
var Lt = function(a) {
  if (le) {
    a = a.touches ? a.touches[0] : a;
    var t = Es(a.clientX, a.clientY);
    if (t) {
      var l = {};
      for (var o in a)
        a.hasOwnProperty(o) && (l[o] = a[o]);
      l.target = l.rootEl = t, l.preventDefault = void 0, l.stopPropagation = void 0, t[Qe]._onDragOver(l);
    }
  }
}, As = function(a) {
  le && le.parentNode[Qe]._isOutsideThisEl(a.target);
};
function pe(e, a) {
  if (!(e && e.nodeType && e.nodeType === 1))
    throw "Sortable: `el` must be an HTMLElement, not ".concat({}.toString.call(e));
  this.el = e, this.options = a = Ct({}, a), e[Qe] = this;
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
      return Xo(e, this.options);
    },
    ghostClass: "sortable-ghost",
    chosenClass: "sortable-chosen",
    dragClass: "sortable-drag",
    ignore: "a, img",
    filter: null,
    preventOnFilter: !0,
    animation: 0,
    easing: null,
    setData: function(f, m) {
      f.setData("Text", m.textContent);
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
    supportPointer: pe.supportPointer !== !1 && "PointerEvent" in window && (!wa || Wl),
    emptyInsertThreshold: 5
  };
  Ea.initializePlugins(this, e, t);
  for (var l in t)
    !(l in a) && (a[l] = t[l]);
  Jo(a);
  for (var o in this)
    o.charAt(0) === "_" && typeof this[o] == "function" && (this[o] = this[o].bind(this));
  this.nativeDraggable = a.forceFallback ? !1 : Us, this.nativeDraggable && (this.options.touchStartThreshold = 1), a.supportPointer ? Ce(e, "pointerdown", this._onTapStart) : (Ce(e, "mousedown", this._onTapStart), Ce(e, "touchstart", this._onTapStart)), this.nativeDraggable && (Ce(e, "dragover", this), Ce(e, "dragenter", this)), Za.push(this.el), a.store && a.store.get && this.sort(a.store.get(this) || []), Ct(this, xs());
}
pe.prototype = /** @lends Sortable.prototype */
{
  constructor: pe,
  _isOutsideThisEl: function(a) {
    !this.el.contains(a) && a !== this.el && (ea = null);
  },
  _getDirection: function(a, t) {
    return typeof this.options.direction == "function" ? this.options.direction.call(this, a, t, le) : this.options.direction;
  },
  _onTapStart: function(a) {
    if (a.cancelable) {
      var t = this, l = this.el, o = this.options, d = o.preventOnFilter, f = a.type, m = a.touches && a.touches[0] || a.pointerType && a.pointerType === "touch" && a, u = (m || a).target, i = a.target.shadowRoot && (a.path && a.path[0] || a.composedPath && a.composedPath()[0]) || u, c = o.filter;
      if (Bs(l), !le && !(/mousedown|pointerdown/.test(f) && a.button !== 0 || o.disabled) && !i.isContentEditable && !(!this.nativeDraggable && wa && u && u.tagName.toUpperCase() === "SELECT") && (u = vt(u, o.draggable, l, !1), !(u && u.animated) && Wa !== u)) {
        if (oa = lt(u), $a = lt(u, o.draggable), typeof c == "function") {
          if (c.call(this, a, u, this)) {
            Xe({
              sortable: t,
              rootEl: i,
              name: "filter",
              targetEl: u,
              toEl: l,
              fromEl: l
            }), Ze("filter", t, {
              evt: a
            }), d && a.preventDefault();
            return;
          }
        } else if (c && (c = c.split(",").some(function(p) {
          if (p = vt(i, p.trim(), l, !1), p)
            return Xe({
              sortable: t,
              rootEl: p,
              name: "filter",
              targetEl: u,
              fromEl: l,
              toEl: l
            }), Ze("filter", t, {
              evt: a
            }), !0;
        }), c)) {
          d && a.preventDefault();
          return;
        }
        o.handle && !vt(i, o.handle, l, !1) || this._prepareDragStart(a, m, u);
      }
    }
  },
  _prepareDragStart: function(a, t, l) {
    var o = this, d = o.el, f = o.options, m = d.ownerDocument, u;
    if (l && !le && l.parentNode === d) {
      var i = Le(l);
      if (Ae = d, le = l, Me = le.parentNode, zt = le.nextSibling, Wa = l, Fa = f.group, pe.dragged = le, Ft = {
        target: le,
        clientX: (t || a).clientX,
        clientY: (t || a).clientY
      }, po = Ft.clientX - i.left, bo = Ft.clientY - i.top, this._lastX = (t || a).clientX, this._lastY = (t || a).clientY, le.style["will-change"] = "all", u = function() {
        if (Ze("delayEnded", o, {
          evt: a
        }), pe.eventCanceled) {
          o._onDrop();
          return;
        }
        o._disableDelayedDragEvents(), !co && o.nativeDraggable && (le.draggable = !0), o._triggerDragStart(a, t), Xe({
          sortable: o,
          name: "choose",
          originalEvent: a
        }), et(le, f.chosenClass, !0);
      }, f.ignore.split(",").forEach(function(c) {
        Wo(le, c.trim(), $l);
      }), Ce(m, "dragover", Lt), Ce(m, "mousemove", Lt), Ce(m, "touchmove", Lt), f.supportPointer ? (Ce(m, "pointerup", o._onDrop), !this.nativeDraggable && Ce(m, "pointercancel", o._onDrop)) : (Ce(m, "mouseup", o._onDrop), Ce(m, "touchend", o._onDrop), Ce(m, "touchcancel", o._onDrop)), co && this.nativeDraggable && (this.options.touchStartThreshold = 4, le.draggable = !0), Ze("delayStart", this, {
        evt: a
      }), f.delay && (!f.delayOnTouchOnly || t) && (!this.nativeDraggable || !(Da || Tt))) {
        if (pe.eventCanceled) {
          this._onDrop();
          return;
        }
        f.supportPointer ? (Ce(m, "pointerup", o._disableDelayedDrag), Ce(m, "pointercancel", o._disableDelayedDrag)) : (Ce(m, "mouseup", o._disableDelayedDrag), Ce(m, "touchend", o._disableDelayedDrag), Ce(m, "touchcancel", o._disableDelayedDrag)), Ce(m, "mousemove", o._delayedDragTouchMoveHandler), Ce(m, "touchmove", o._delayedDragTouchMoveHandler), f.supportPointer && Ce(m, "pointermove", o._delayedDragTouchMoveHandler), o._dragStartTimer = setTimeout(u, f.delay);
      } else
        u();
    }
  },
  _delayedDragTouchMoveHandler: function(a) {
    var t = a.touches ? a.touches[0] : a;
    Math.max(Math.abs(t.clientX - this._lastX), Math.abs(t.clientY - this._lastY)) >= Math.floor(this.options.touchStartThreshold / (this.nativeDraggable && window.devicePixelRatio || 1)) && this._disableDelayedDrag();
  },
  _disableDelayedDrag: function() {
    le && $l(le), clearTimeout(this._dragStartTimer), this._disableDelayedDragEvents();
  },
  _disableDelayedDragEvents: function() {
    var a = this.el.ownerDocument;
    xe(a, "mouseup", this._disableDelayedDrag), xe(a, "touchend", this._disableDelayedDrag), xe(a, "touchcancel", this._disableDelayedDrag), xe(a, "pointerup", this._disableDelayedDrag), xe(a, "pointercancel", this._disableDelayedDrag), xe(a, "mousemove", this._delayedDragTouchMoveHandler), xe(a, "touchmove", this._delayedDragTouchMoveHandler), xe(a, "pointermove", this._delayedDragTouchMoveHandler);
  },
  _triggerDragStart: function(a, t) {
    t = t || a.pointerType == "touch" && a, !this.nativeDraggable || t ? this.options.supportPointer ? Ce(document, "pointermove", this._onTouchMove) : t ? Ce(document, "touchmove", this._onTouchMove) : Ce(document, "mousemove", this._onTouchMove) : (Ce(le, "dragend", this), Ce(Ae, "dragstart", this._onDragStart));
    try {
      document.selection ? Ka(function() {
        document.selection.empty();
      }) : window.getSelection().removeAllRanges();
    } catch {
    }
  },
  _dragStarted: function(a, t) {
    if (ta = !1, Ae && le) {
      Ze("dragStarted", this, {
        evt: t
      }), this.nativeDraggable && Ce(document, "dragover", As);
      var l = this.options;
      !a && et(le, l.dragClass, !1), et(le, l.ghostClass, !0), pe.active = this, a && this._appendGhost(), Xe({
        sortable: this,
        name: "start",
        originalEvent: t
      });
    } else
      this._nulling();
  },
  _emulateDragOver: function() {
    if (ut) {
      this._lastX = ut.clientX, this._lastY = ut.clientY, Zo();
      for (var a = document.elementFromPoint(ut.clientX, ut.clientY), t = a; a && a.shadowRoot && (a = a.shadowRoot.elementFromPoint(ut.clientX, ut.clientY), a !== t); )
        t = a;
      if (le.parentNode[Qe]._isOutsideThisEl(a), t)
        do {
          if (t[Qe]) {
            var l = void 0;
            if (l = t[Qe]._onDragOver({
              clientX: ut.clientX,
              clientY: ut.clientY,
              target: a,
              rootEl: t
            }), l && !this.options.dragoverBubble)
              break;
          }
          a = t;
        } while (t = jo(t));
      Qo();
    }
  },
  _onTouchMove: function(a) {
    if (Ft) {
      var t = this.options, l = t.fallbackTolerance, o = t.fallbackOffset, d = a.touches ? a.touches[0] : a, f = be && ia(be, !0), m = be && f && f.a, u = be && f && f.d, i = Ba && He && fo(He), c = (d.clientX - Ft.clientX + o.x) / (m || 1) + (i ? i[0] - Vl[0] : 0) / (m || 1), p = (d.clientY - Ft.clientY + o.y) / (u || 1) + (i ? i[1] - Vl[1] : 0) / (u || 1);
      if (!pe.active && !ta) {
        if (l && Math.max(Math.abs(d.clientX - this._lastX), Math.abs(d.clientY - this._lastY)) < l)
          return;
        this._onDragStart(a, !0);
      }
      if (be) {
        f ? (f.e += c - (kl || 0), f.f += p - (wl || 0)) : f = {
          a: 1,
          b: 0,
          c: 0,
          d: 1,
          e: c,
          f: p
        };
        var x = "matrix(".concat(f.a, ",").concat(f.b, ",").concat(f.c, ",").concat(f.d, ",").concat(f.e, ",").concat(f.f, ")");
        fe(be, "webkitTransform", x), fe(be, "mozTransform", x), fe(be, "msTransform", x), fe(be, "transform", x), kl = c, wl = p, ut = d;
      }
      a.cancelable && a.preventDefault();
    }
  },
  _appendGhost: function() {
    if (!be) {
      var a = this.options.fallbackOnBody ? document.body : Ae, t = Le(le, !0, Ba, !0, a), l = this.options;
      if (Ba) {
        for (He = a; fe(He, "position") === "static" && fe(He, "transform") === "none" && He !== document; )
          He = He.parentNode;
        He !== document.body && He !== document.documentElement ? (He === document && (He = pt()), t.top += He.scrollTop, t.left += He.scrollLeft) : He = pt(), Vl = fo(He);
      }
      be = le.cloneNode(!0), et(be, l.ghostClass, !1), et(be, l.fallbackClass, !0), et(be, l.dragClass, !0), fe(be, "transition", ""), fe(be, "transform", ""), fe(be, "box-sizing", "border-box"), fe(be, "margin", 0), fe(be, "top", t.top), fe(be, "left", t.left), fe(be, "width", t.width), fe(be, "height", t.height), fe(be, "opacity", "0.8"), fe(be, "position", Ba ? "absolute" : "fixed"), fe(be, "zIndex", "100000"), fe(be, "pointerEvents", "none"), pe.ghost = be, a.appendChild(be), fe(be, "transform-origin", po / parseInt(be.style.width) * 100 + "% " + bo / parseInt(be.style.height) * 100 + "%");
    }
  },
  _onDragStart: function(a, t) {
    var l = this, o = a.dataTransfer, d = l.options;
    if (Ze("dragStart", this, {
      evt: a
    }), pe.eventCanceled) {
      this._onDrop();
      return;
    }
    Ze("setupClone", this), pe.eventCanceled || (Pe = Go(le), Pe.removeAttribute("id"), Pe.draggable = !1, Pe.style["will-change"] = "", this._hideClone(), et(Pe, this.options.chosenClass, !1), pe.clone = Pe), l.cloneId = Ka(function() {
      Ze("clone", l), !pe.eventCanceled && (l.options.removeCloneOnHide || Ae.insertBefore(Pe, le), l._hideClone(), Xe({
        sortable: l,
        name: "clone"
      }));
    }), !t && et(le, d.dragClass, !0), t ? (Ja = !0, l._loopId = setInterval(l._emulateDragOver, 50)) : (xe(document, "mouseup", l._onDrop), xe(document, "touchend", l._onDrop), xe(document, "touchcancel", l._onDrop), o && (o.effectAllowed = "move", d.setData && d.setData.call(l, o, le)), Ce(document, "drop", l), fe(le, "transform", "translateZ(0)")), ta = !0, l._dragStartId = Ka(l._dragStarted.bind(l, t, a)), Ce(document, "selectstart", l), pa = !0, window.getSelection().removeAllRanges(), wa && fe(document.body, "user-select", "none");
  },
  // Returns true - if no further action is needed (either inserted or another condition)
  _onDragOver: function(a) {
    var t = this.el, l = a.target, o, d, f, m = this.options, u = m.group, i = pe.active, c = Fa === u, p = m.sort, x = Ge || i, y, S = this, w = !1;
    if (Al) return;
    function A(ue, Q) {
      Ze(ue, S, bt({
        evt: a,
        isOwner: c,
        axis: y ? "vertical" : "horizontal",
        revert: f,
        dragRect: o,
        targetRect: d,
        canSort: p,
        fromSortable: x,
        target: l,
        completed: g,
        onMove: function(Se, j) {
          return za(Ae, t, le, o, Se, Le(Se), a, j);
        },
        changed: k
      }, Q));
    }
    function $() {
      A("dragOverAnimationCapture"), S.captureAnimationState(), S !== x && x.captureAnimationState();
    }
    function g(ue) {
      return A("dragOverCompleted", {
        insertion: ue
      }), ue && (c ? i._hideClone() : i._showClone(S), S !== x && (et(le, Ge ? Ge.options.ghostClass : i.options.ghostClass, !1), et(le, m.ghostClass, !0)), Ge !== S && S !== pe.active ? Ge = S : S === pe.active && Ge && (Ge = null), x === S && (S._ignoreWhileAnimating = l), S.animateAll(function() {
        A("dragOverAnimationComplete"), S._ignoreWhileAnimating = null;
      }), S !== x && (x.animateAll(), x._ignoreWhileAnimating = null)), (l === le && !le.animated || l === t && !l.animated) && (ea = null), !m.dragoverBubble && !a.rootEl && l !== document && (le.parentNode[Qe]._isOutsideThisEl(a.target), !ue && Lt(a)), !m.dragoverBubble && a.stopPropagation && a.stopPropagation(), w = !0;
    }
    function k() {
      tt = lt(le), Ut = lt(le, m.draggable), Xe({
        sortable: S,
        name: "change",
        toEl: t,
        newIndex: tt,
        newDraggableIndex: Ut,
        originalEvent: a
      });
    }
    if (a.preventDefault !== void 0 && a.cancelable && a.preventDefault(), l = vt(l, m.draggable, t, !0), A("dragOver"), pe.eventCanceled) return w;
    if (le.contains(a.target) || l.animated && l.animatingX && l.animatingY || S._ignoreWhileAnimating === l)
      return g(!1);
    if (Ja = !1, i && !m.disabled && (c ? p || (f = Me !== Ae) : Ge === this || (this.lastPutMode = Fa.checkPull(this, i, le, a)) && u.checkPut(this, i, le, a))) {
      if (y = this._getDirection(a, l) === "vertical", o = Le(le), A("dragOverValid"), pe.eventCanceled) return w;
      if (f)
        return Me = Ae, $(), this._hideClone(), A("revert"), pe.eventCanceled || (zt ? Ae.insertBefore(le, zt) : Ae.appendChild(le)), g(!0);
      var C = ql(t, m.draggable);
      if (!C || Ns(a, y, this) && !C.animated) {
        if (C === le)
          return g(!1);
        if (C && t === a.target && (l = C), l && (d = Le(l)), za(Ae, t, le, o, l, d, a, !!l) !== !1)
          return $(), C && C.nextSibling ? t.insertBefore(le, C.nextSibling) : t.appendChild(le), Me = t, k(), g(!0);
      } else if (C && Rs(a, y, this)) {
        var H = na(t, 0, m, !0);
        if (H === le)
          return g(!1);
        if (l = H, d = Le(l), za(Ae, t, le, o, l, d, a, !1) !== !1)
          return $(), t.insertBefore(le, H), Me = t, k(), g(!0);
      } else if (l.parentNode === t) {
        d = Le(l);
        var P = 0, G, ne = le.parentNode !== t, re = !Ds(le.animated && le.toRect || o, l.animated && l.toRect || d, y), ve = y ? "top" : "left", ke = mo(l, "top", "top") || mo(le, "top", "top"), oe = ke ? ke.scrollTop : void 0;
        ea !== l && (G = d[ve], Ca = !1, La = !re && m.invertSwap || ne), P = Ms(a, l, d, y, re ? 1 : m.swapThreshold, m.invertedSwapThreshold == null ? m.swapThreshold : m.invertedSwapThreshold, La, ea === l);
        var z;
        if (P !== 0) {
          var W = lt(le);
          do
            W -= P, z = Me.children[W];
          while (z && (fe(z, "display") === "none" || z === be));
        }
        if (P === 0 || z === l)
          return g(!1);
        ea = l, xa = P;
        var U = l.nextElementSibling, q = !1;
        q = P === 1;
        var ce = za(Ae, t, le, o, l, d, a, q);
        if (ce !== !1)
          return (ce === 1 || ce === -1) && (q = ce === 1), Al = !0, setTimeout(Ps, 30), $(), q && !U ? t.appendChild(le) : l.parentNode.insertBefore(le, q ? U : l), ke && Ko(ke, 0, oe - ke.scrollTop), Me = le.parentNode, G !== void 0 && !La && (qa = Math.abs(G - Le(l)[ve])), k(), g(!0);
      }
      if (t.contains(le))
        return g(!1);
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
    if (tt = lt(le), Ut = lt(le, l.draggable), Ze("drop", this, {
      evt: a
    }), Me = le && le.parentNode, tt = lt(le), Ut = lt(le, l.draggable), pe.eventCanceled) {
      this._nulling();
      return;
    }
    ta = !1, La = !1, Ca = !1, clearInterval(this._loopId), clearTimeout(this._dragStartTimer), Ol(this.cloneId), Ol(this._dragStartId), this.nativeDraggable && (xe(document, "drop", this), xe(t, "dragstart", this._onDragStart)), this._offMoveEvents(), this._offUpEvents(), wa && fe(document.body, "user-select", ""), fe(le, "transform", ""), a && (pa && (a.cancelable && a.preventDefault(), !l.dropBubble && a.stopPropagation()), be && be.parentNode && be.parentNode.removeChild(be), (Ae === Me || Ge && Ge.lastPutMode !== "clone") && Pe && Pe.parentNode && Pe.parentNode.removeChild(Pe), le && (this.nativeDraggable && xe(le, "dragend", this), $l(le), le.style["will-change"] = "", pa && !ta && et(le, Ge ? Ge.options.ghostClass : this.options.ghostClass, !1), et(le, this.options.chosenClass, !1), Xe({
      sortable: this,
      name: "unchoose",
      toEl: Me,
      newIndex: null,
      newDraggableIndex: null,
      originalEvent: a
    }), Ae !== Me ? (tt >= 0 && (Xe({
      rootEl: Me,
      name: "add",
      toEl: Me,
      fromEl: Ae,
      originalEvent: a
    }), Xe({
      sortable: this,
      name: "remove",
      toEl: Me,
      originalEvent: a
    }), Xe({
      rootEl: Me,
      name: "sort",
      toEl: Me,
      fromEl: Ae,
      originalEvent: a
    }), Xe({
      sortable: this,
      name: "sort",
      toEl: Me,
      originalEvent: a
    })), Ge && Ge.save()) : tt !== oa && tt >= 0 && (Xe({
      sortable: this,
      name: "update",
      toEl: Me,
      originalEvent: a
    }), Xe({
      sortable: this,
      name: "sort",
      toEl: Me,
      originalEvent: a
    })), pe.active && ((tt == null || tt === -1) && (tt = oa, Ut = $a), Xe({
      sortable: this,
      name: "end",
      toEl: Me,
      originalEvent: a
    }), this.save()))), this._nulling();
  },
  _nulling: function() {
    Ze("nulling", this), Ae = le = Me = be = zt = Pe = Wa = Dt = Ft = ut = pa = tt = Ut = oa = $a = ea = xa = Ge = Fa = pe.dragged = pe.ghost = pe.clone = pe.active = null;
    var a = this.el;
    Qa.forEach(function(t) {
      a.contains(t) && (t.checked = !0);
    }), Qa.length = kl = wl = 0;
  },
  handleEvent: function(a) {
    switch (a.type) {
      case "drop":
      case "dragend":
        this._onDrop(a);
        break;
      case "dragenter":
      case "dragover":
        le && (this._onDragOver(a), Os(a));
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
      t = l[o], vt(t, f.draggable, this.el, !1) && a.push(t.getAttribute(f.dataIdAttr) || Ls(t));
    return a;
  },
  /**
   * Sorts the elements according to the array.
   * @param  {String[]}  order  order of the items
   */
  sort: function(a, t) {
    var l = {}, o = this.el;
    this.toArray().forEach(function(d, f) {
      var m = o.children[f];
      vt(m, this.options.draggable, o, !1) && (l[d] = m);
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
    return vt(a, t || this.options.draggable, this.el, !1);
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
    var o = Ea.modifyOption(this, a, t);
    typeof o < "u" ? l[a] = o : l[a] = t, a === "group" && Jo(l);
  },
  /**
   * Destroy
   */
  destroy: function() {
    Ze("destroy", this);
    var a = this.el;
    a[Qe] = null, xe(a, "mousedown", this._onTapStart), xe(a, "touchstart", this._onTapStart), xe(a, "pointerdown", this._onTapStart), this.nativeDraggable && (xe(a, "dragover", this), xe(a, "dragenter", this)), Array.prototype.forEach.call(a.querySelectorAll("[draggable]"), function(t) {
      t.removeAttribute("draggable");
    }), this._onDrop(), this._disableDelayedDragEvents(), Za.splice(Za.indexOf(this.el), 1), this.el = a = null;
  },
  _hideClone: function() {
    if (!Dt) {
      if (Ze("hideClone", this), pe.eventCanceled) return;
      fe(Pe, "display", "none"), this.options.removeCloneOnHide && Pe.parentNode && Pe.parentNode.removeChild(Pe), Dt = !0;
    }
  },
  _showClone: function(a) {
    if (a.lastPutMode !== "clone") {
      this._hideClone();
      return;
    }
    if (Dt) {
      if (Ze("showClone", this), pe.eventCanceled) return;
      le.parentNode == Ae && !this.options.group.revertClone ? Ae.insertBefore(Pe, le) : zt ? Ae.insertBefore(Pe, zt) : Ae.appendChild(Pe), this.options.group.revertClone && this.animate(le, Pe), fe(Pe, "display", ""), Dt = !1;
    }
  }
};
function Os(e) {
  e.dataTransfer && (e.dataTransfer.dropEffect = "move"), e.cancelable && e.preventDefault();
}
function za(e, a, t, l, o, d, f, m) {
  var u, i = e[Qe], c = i.options.onMove, p;
  return window.CustomEvent && !Tt && !Da ? u = new CustomEvent("move", {
    bubbles: !0,
    cancelable: !0
  }) : (u = document.createEvent("Event"), u.initEvent("move", !0, !0)), u.to = a, u.from = e, u.dragged = t, u.draggedRect = l, u.related = o || a, u.relatedRect = d || Le(a), u.willInsertAfter = m, u.originalEvent = f, e.dispatchEvent(u), c && (p = c.call(i, u, f)), p;
}
function $l(e) {
  e.draggable = !1;
}
function Ps() {
  Al = !1;
}
function Rs(e, a, t) {
  var l = Le(na(t.el, 0, t.options, !0)), o = Ho(t.el, t.options, be), d = 10;
  return a ? e.clientX < o.left - d || e.clientY < l.top && e.clientX < l.right : e.clientY < o.top - d || e.clientY < l.bottom && e.clientX < l.left;
}
function Ns(e, a, t) {
  var l = Le(ql(t.el, t.options.draggable)), o = Ho(t.el, t.options, be), d = 10;
  return a ? e.clientX > o.right + d || e.clientY > l.bottom && e.clientX > l.left : e.clientY > o.bottom + d || e.clientX > l.right && e.clientY > l.top;
}
function Ms(e, a, t, l, o, d, f, m) {
  var u = l ? e.clientY : e.clientX, i = l ? t.height : t.width, c = l ? t.top : t.left, p = l ? t.bottom : t.right, x = !1;
  if (!f) {
    if (m && qa < i * o) {
      if (!Ca && (xa === 1 ? u > c + i * d / 2 : u < p - i * d / 2) && (Ca = !0), Ca)
        x = !0;
      else if (xa === 1 ? u < c + qa : u > p - qa)
        return -xa;
    } else if (u > c + i * (1 - o) / 2 && u < p - i * (1 - o) / 2)
      return Fs(a);
  }
  return x = x || f, x && (u < c + i * d / 2 || u > p - i * d / 2) ? u > c + i / 2 ? 1 : -1 : 0;
}
function Fs(e) {
  return lt(le) < lt(e) ? 1 : -1;
}
function Ls(e) {
  for (var a = e.tagName + e.className + e.src + e.href + e.textContent, t = a.length, l = 0; t--; )
    l += a.charCodeAt(t);
  return l.toString(36);
}
function Bs(e) {
  Qa.length = 0;
  for (var a = e.getElementsByTagName("input"), t = a.length; t--; ) {
    var l = a[t];
    l.checked && Qa.push(l);
  }
}
function Ka(e) {
  return setTimeout(e, 0);
}
function Ol(e) {
  return clearTimeout(e);
}
ol && Ce(document, "touchmove", function(e) {
  (pe.active || ta) && e.cancelable && e.preventDefault();
});
pe.utils = {
  on: Ce,
  off: xe,
  css: fe,
  find: Wo,
  is: function(a, t) {
    return !!vt(a, t, a, !1);
  },
  extend: Vs,
  throttle: qo,
  closest: vt,
  toggleClass: et,
  clone: Go,
  index: lt,
  nextTick: Ka,
  cancelNextTick: Ol,
  detectDirection: Xo,
  getChild: na,
  expando: Qe
};
pe.get = function(e) {
  return e[Qe];
};
pe.mount = function() {
  for (var e = arguments.length, a = new Array(e), t = 0; t < e; t++)
    a[t] = arguments[t];
  a[0].constructor === Array && (a = a[0]), a.forEach(function(l) {
    if (!l.prototype || !l.prototype.constructor)
      throw "Sortable: Mounted plugin must be a constructor function, not ".concat({}.toString.call(l));
    l.utils && (pe.utils = bt(bt({}, pe.utils), l.utils)), Ea.mount(l);
  });
};
pe.create = function(e, a) {
  return new pe(e, a);
};
pe.version = ks;
var Fe = [], ba, Pl, Rl = !1, xl, Cl, _a, ha;
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
      this.sortable.nativeDraggable ? Ce(document, "dragover", this._handleAutoScroll) : this.options.supportPointer ? Ce(document, "pointermove", this._handleFallbackAutoScroll) : l.touches ? Ce(document, "touchmove", this._handleFallbackAutoScroll) : Ce(document, "mousemove", this._handleFallbackAutoScroll);
    },
    dragOverCompleted: function(t) {
      var l = t.originalEvent;
      !this.options.dragOverBubble && !l.rootEl && this._handleAutoScroll(l);
    },
    drop: function() {
      this.sortable.nativeDraggable ? xe(document, "dragover", this._handleAutoScroll) : (xe(document, "pointermove", this._handleFallbackAutoScroll), xe(document, "touchmove", this._handleFallbackAutoScroll), xe(document, "mousemove", this._handleFallbackAutoScroll)), go(), Ga(), $s();
    },
    nulling: function() {
      _a = Pl = ba = Rl = ha = xl = Cl = null, Fe.length = 0;
    },
    _handleFallbackAutoScroll: function(t) {
      this._handleAutoScroll(t, !0);
    },
    _handleAutoScroll: function(t, l) {
      var o = this, d = (t.touches ? t.touches[0] : t).clientX, f = (t.touches ? t.touches[0] : t).clientY, m = document.elementFromPoint(d, f);
      if (_a = t, l || this.options.forceAutoScrollFallback || Da || Tt || wa) {
        Sl(t, this.options, m, l);
        var u = Et(m, !0);
        Rl && (!ha || d !== xl || f !== Cl) && (ha && go(), ha = setInterval(function() {
          var i = Et(document.elementFromPoint(d, f), !0);
          i !== u && (u = i, Ga()), Sl(t, o.options, i, l);
        }, 10), xl = d, Cl = f);
      } else {
        if (!this.options.bubbleScroll || Et(m, !0) === pt()) {
          Ga();
          return;
        }
        Sl(t, this.options, Et(m, !1), !1);
      }
    }
  }, Ct(e, {
    pluginName: "scroll",
    initializeByDefault: !0
  });
}
function Ga() {
  Fe.forEach(function(e) {
    clearInterval(e.pid);
  }), Fe = [];
}
function go() {
  clearInterval(ha);
}
var Sl = qo(function(e, a, t, l) {
  if (a.scroll) {
    var o = (e.touches ? e.touches[0] : e).clientX, d = (e.touches ? e.touches[0] : e).clientY, f = a.scrollSensitivity, m = a.scrollSpeed, u = pt(), i = !1, c;
    Pl !== t && (Pl = t, Ga(), ba = a.scroll, c = a.scrollFn, ba === !0 && (ba = Et(t, !0)));
    var p = 0, x = ba;
    do {
      var y = x, S = Le(y), w = S.top, A = S.bottom, $ = S.left, g = S.right, k = S.width, C = S.height, H = void 0, P = void 0, G = y.scrollWidth, ne = y.scrollHeight, re = fe(y), ve = y.scrollLeft, ke = y.scrollTop;
      y === u ? (H = k < G && (re.overflowX === "auto" || re.overflowX === "scroll" || re.overflowX === "visible"), P = C < ne && (re.overflowY === "auto" || re.overflowY === "scroll" || re.overflowY === "visible")) : (H = k < G && (re.overflowX === "auto" || re.overflowX === "scroll"), P = C < ne && (re.overflowY === "auto" || re.overflowY === "scroll"));
      var oe = H && (Math.abs(g - o) <= f && ve + k < G) - (Math.abs($ - o) <= f && !!ve), z = P && (Math.abs(A - d) <= f && ke + C < ne) - (Math.abs(w - d) <= f && !!ke);
      if (!Fe[p])
        for (var W = 0; W <= p; W++)
          Fe[W] || (Fe[W] = {});
      (Fe[p].vx != oe || Fe[p].vy != z || Fe[p].el !== y) && (Fe[p].el = y, Fe[p].vx = oe, Fe[p].vy = z, clearInterval(Fe[p].pid), (oe != 0 || z != 0) && (i = !0, Fe[p].pid = setInterval(function() {
        l && this.layer === 0 && pe.active._onTouchMove(_a);
        var U = Fe[this.layer].vy ? Fe[this.layer].vy * m : 0, q = Fe[this.layer].vx ? Fe[this.layer].vx * m : 0;
        typeof c == "function" && c.call(pe.dragged.parentNode[Qe], q, U, e, _a, Fe[this.layer].el) !== "continue" || Ko(Fe[this.layer].el, q, U);
      }.bind({
        layer: p
      }), 24))), p++;
    } while (a.bubbleScroll && x !== u && (x = Et(x, !1)));
    Rl = i;
  }
}, 30), _o = function(a) {
  var t = a.originalEvent, l = a.putSortable, o = a.dragEl, d = a.activeSortable, f = a.dispatchSortableEvent, m = a.hideGhostForTarget, u = a.unhideGhostForTarget;
  if (t) {
    var i = l || d;
    m();
    var c = t.changedTouches && t.changedTouches.length ? t.changedTouches[0] : t, p = document.elementFromPoint(c.clientX, c.clientY);
    u(), i && !i.el.contains(p) && (f("spill"), this.onSpill({
      dragEl: o,
      putSortable: l
    }));
  }
};
function Kl() {
}
Kl.prototype = {
  startIndex: null,
  dragStart: function(a) {
    var t = a.oldDraggableIndex;
    this.startIndex = t;
  },
  onSpill: function(a) {
    var t = a.dragEl, l = a.putSortable;
    this.sortable.captureAnimationState(), l && l.captureAnimationState();
    var o = na(this.sortable.el, this.startIndex, this.options);
    o ? this.sortable.el.insertBefore(t, o) : this.sortable.el.appendChild(t), this.sortable.animateAll(), l && l.animateAll();
  },
  drop: _o
};
Ct(Kl, {
  pluginName: "revertOnSpill"
});
function Gl() {
}
Gl.prototype = {
  onSpill: function(a) {
    var t = a.dragEl, l = a.putSortable, o = l || this.sortable;
    o.captureAnimationState(), t.parentNode && t.parentNode.removeChild(t), o.animateAll();
  },
  drop: _o
};
Ct(Gl, {
  pluginName: "removeOnSpill"
});
pe.mount(new zs());
pe.mount(Gl, Kl);
function js(e, a) {
  const t = e.oldDraggableIndex ?? e.oldIndex;
  e.item.remove();
  const l = [...e.from.children].filter((o) => o.matches(a));
  e.from.insertBefore(e.item, l[t ?? l.length] ?? null);
}
function ei(e) {
  const a = /* @__PURE__ */ new Map();
  function t(l) {
    a.get(l)?.destroy(), a.delete(l);
  }
  return St(() => {
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
        onEnd(d) {
          const f = d.oldDraggableIndex, m = d.newDraggableIndex;
          js(d, ".work-reorder-entry"), f !== void 0 && m !== void 0 && f !== m && e(f, m);
        }
      }));
    },
    unmounted: t
  };
}
const Ws = { class: "work-stack work-tight work-option-builder" }, qs = { class: "work-stack work-tight" }, Ks = { class: "work-stack work-tight work-small" }, Gs = { class: "work-stack work-tight work-small" }, Hs = { class: "work-stack work-tight" }, Ys = { class: "work-stack work-tight work-small" }, Xs = { class: "work-row" }, Js = { class: "work-stack work-tight work-small" }, Zs = { class: "work-row" }, Qs = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, _s = { class: "work-add-option" }, er = {
  key: 0,
  class: "work-muted work-small"
}, tr = /* @__PURE__ */ ye({
  __name: "OptionsEditor",
  props: {
    field: {}
  },
  emits: ["validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = "options:" + el(), d = L(() => t.field.options ?? []), f = L(() => d.value.every((p, x) => !!p.id && d.value.findIndex((y) => y.id === p.id) === x));
    Te(f, (p) => l("validity", p, o), { immediate: !0 }), St(() => l("validity", !0, o));
    function m(p, x) {
      Ao(d.value, p, x - p), d.value.forEach((y, S) => y.order = S);
    }
    const u = ei(m), i = ["primary", "success", "info", "warn", "danger", "secondary"];
    function c() {
      let p = d.value.length + 1;
      for (; d.value.some((x) => x.id === `option_${p}`); ) p++;
      (t.field.options ??= []).push({ id: `option_${p}`, label: "New option", order: d.value.length });
    }
    return (p, x) => (n(), b("section", Ws, [
      x[4] || (x[4] = s("header", { class: "work-row" }, [
        s("h4", null, "Options"),
        s("span", { class: "work-muted work-small" }, "Renaming a choice keeps it selected on existing items."),
        s("span", { class: "work-spacer" })
      ], -1)),
      ct((n(), b("div", qs, [
        (n(!0), b(te, null, se(d.value, (y, S) => (n(), b("div", {
          key: S,
          class: "work-option-row work-reorder-entry"
        }, [
          h(r(_), {
            type: "button",
            class: "work-icon-button work-reorder-handle",
            "aria-label": "Drag option; arrow keys reorder",
            onKeydown: [
              Oe(Ie((w) => m(S, S - 1), ["prevent"]), ["up"]),
              Oe(Ie((w) => m(S, S + 1), ["prevent"]), ["down"])
            ],
            severity: "secondary",
            text: "",
            size: "small"
          }, {
            default: K(() => [
              h(r(de), {
                icon: "tabler:grip-vertical",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["onKeydown"]),
          s("label", Ks, [
            x[0] || (x[0] = B("Label", -1)),
            h(r(ge), {
              modelValue: y.label,
              "onUpdate:modelValue": (w) => y.label = w,
              "aria-label": "Option label"
            }, null, 8, ["modelValue", "onUpdate:modelValue"])
          ]),
          h(ze, {
            class: "work-disclosure",
            label: "Advanced"
          }, {
            default: K(() => [
              s("label", Gs, [
                x[1] || (x[1] = B("Integration identifier", -1)),
                h(r(ge), {
                  modelValue: y.id,
                  "onUpdate:modelValue": (w) => y.id = w,
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
              x[2] || (x[2] = B("Color", -1)),
              s("span", Xs, [
                s("span", {
                  class: ft(["work-color-swatch", "work-swatch-" + (y.color || "secondary")]),
                  "aria-hidden": "true"
                }, null, 2),
                h(r(me), {
                  modelValue: y.color,
                  "onUpdate:modelValue": (w) => y.color = w,
                  "aria-label": "Option color",
                  appendTo: "self",
                  optionLabel: "label",
                  optionValue: "value",
                  optionDisabled: "disabled",
                  options: [{ label: "Default", value: void 0, disabled: !1 }, ...(i ?? []).map((w) => ({ label: w, value: w, disabled: !1 }))]
                }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
              ])
            ]),
            s("label", Js, [
              x[3] || (x[3] = B("Category", -1)),
              h(r(me), {
                "model-value": y.category,
                "aria-label": "Option category",
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                showClear: "",
                options: ["triage", "backlog", ...r(Eo)].map((w) => ({ label: r(Gt)(w), value: w })),
                "onUpdate:modelValue": (w) => y.category = w || void 0
              }, null, 8, ["model-value", "options", "onUpdate:modelValue"])
            ])
          ]),
          s("div", Zs, [
            h(r(_), {
              "aria-label": "Option earlier",
              severity: "secondary",
              size: "small",
              disabled: S === 0,
              onClick: (w) => m(S, S - 1),
              text: ""
            }, {
              default: K(() => [
                h(r(de), {
                  icon: "tabler:arrow-up",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["disabled", "onClick"]),
            h(r(_), {
              "aria-label": "Option later",
              severity: "secondary",
              size: "small",
              disabled: S === d.value.length - 1,
              onClick: (w) => m(S, S + 1),
              text: ""
            }, {
              default: K(() => [
                h(r(de), {
                  icon: "tabler:arrow-down",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["disabled", "onClick"]),
            h(r(_), {
              label: "Remove",
              "aria-label": "Remove option",
              severity: "secondary",
              text: "",
              size: "small",
              onClick: (w) => d.value.splice(S, 1)
            }, {
              icon: K(() => [
                h(r(de), {
                  icon: "tabler:trash",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["onClick"])
          ])
        ]))), 128)),
        f.value ? I("", !0) : (n(), b("p", Qs, "Each choice needs a unique integration identifier.")),
        s("div", _s, [
          h(r(_), {
            label: "Add option",
            severity: "secondary",
            size: "small",
            onClick: c,
            outlined: ""
          }, {
            icon: K(() => [
              h(r(de), {
                icon: "tabler:plus",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          })
        ])
      ])), [
        [r(u)]
      ]),
      d.value.length ? I("", !0) : (n(), b("p", er, "Add the choices people can select for this field."))
    ]));
  }
}), ar = {
  class: "work-stack",
  "aria-label": "Fields editor"
}, lr = { class: "work-ia-toolbar" }, or = { class: "work-stack work-tight" }, ir = { class: "work-stack work-tight" }, nr = { class: "work-dialog-actions" }, sr = {
  key: 1,
  class: "work-settings-card work-muted"
}, rr = { class: "work-muted work-small" }, dr = {
  key: 0,
  class: "work-error work-small",
  role: "alert"
}, ur = { class: "work-settings-grid work-field-properties" }, cr = { class: "work-stack work-tight" }, vr = { class: "work-stack work-tight" }, mr = { class: "work-stack work-tight" }, fr = {
  key: 1,
  class: "work-stack work-tight"
}, pr = {
  key: 4,
  class: "work-stack work-tight"
}, br = {
  key: 5,
  class: "work-stack work-tight"
}, hr = { class: "work-stack work-tight" }, gr = { class: "work-stack work-tight" }, yr = { class: "work-stack work-tight" }, kr = { class: "work-stack work-tight" }, wr = { class: "work-stack" }, Vr = { class: "work-stack work-tight" }, $r = { class: "work-stack work-tight" }, xr = { class: "work-stack work-tight work-field-history" }, Cr = { class: "work-settings-list" }, Sr = { class: "work-settings-row" }, Tr = { class: "work-settings-row" }, Ir = { class: "work-stack" }, Ur = /* @__PURE__ */ ye({
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
    const t = e, l = a, o = L(() => t.draft.fields ?? []), d = M(), f = M(""), m = M(!1), u = M("text"), i = M([]), c = L(() => (t.draft.item_types ?? []).map((j) => ({ value: j.id, label: j.title || Re(j.id) }))), p = L(() => t.draft.item_types?.find((j) => j.id === t.itemType)), x = L(() => o.value.map((j, v) => ({ field: j, index: v })).filter(({ field: j }) => !p.value || p.value.fields.includes(j.code))), y = M(""), S = M({}), w = ei((j, v) => {
      const V = x.value[j]?.index, Z = x.value[v]?.index;
      V !== void 0 && Z !== void 0 && ce(V, Z - V);
    });
    function A(j) {
      return (t.draft.item_types ?? []).filter((v) => v.fields.includes(j)).map((v) => v.title || Re(v.id));
    }
    async function $(j) {
      if (!y.value) {
        y.value = j.code;
        try {
          const v = await t.guardRemoval?.("fields", j.code);
          S.value[j.code] = v ?? "", v || Ua(t.draft, "fields", j.code);
        } finally {
          y.value = "";
        }
      }
    }
    const g = Object.entries({ text: "Text", int: "Whole number", dec: "Decimal number", quantity: "Measurement", bool: "Yes or no", time: "Date or time", ref: "Reference", record: "Structured data", option: "Choice", principal: "Person or group", item: "Work item", rank: "Order", rich_text: "Formatted text", formula: "Formula", rollup: "Related item calculation", counter: "Counter" }).map(([j, v]) => ({ value: j, label: v })), k = [{ label: "None", value: "none" }, { label: "Exact matches", value: "key" }, { label: "Numeric ranges", value: "number" }], C = ["int", "dec", "quantity"], H = L(() => new Map(t.installedTypes?.map((j) => [j.id, j]))), P = L(() => [...g, ...(t.installedTypes ?? []).map((j) => ({ value: j.id, label: j.title }))]), G = {};
    function ne(j) {
      return j.type && j.type !== "value" ? j.type : j.form ?? "text";
    }
    function re(j) {
      return j.type ? H.value.get(j.type) : void 0;
    }
    function ve(j) {
      const v = re(j)?.config_schema;
      return v && Po(v).length ? v : void 0;
    }
    function ke(j) {
      const v = re(j);
      return !!v?.config_schema || ["dec", "quantity", "ref", "time", "record"].includes(v?.form ?? j.form ?? "") || !!j.config;
    }
    function oe(j) {
      const v = re(j), V = v?.form ?? j.form ?? "text";
      return k.filter(({ value: Z }) => Z === "none" || (!v?.indexes || v.indexes.includes(Z)) && V !== "record" && (Z !== "number" || C.includes(V) || j.type === "option"));
    }
    function z(j) {
      j.index && !oe(j).some((v) => v.value === j.index) && delete j.index;
    }
    function W(j, v) {
      const V = H.value.get(v);
      if (V) {
        if (V.id === j.type) return;
        j.type = V.id, j.form = V.form, delete j.options, delete j.config, z(j);
        return;
      }
      re(j) && delete j.config;
      const Z = { option: "text", principal: "ref", item: "ref", rank: "text", rich_text: "text", formula: "int", rollup: "int", counter: "int" };
      Z[v] ? (j.type = v, j.form = Z[v]) : (delete j.type, j.form = v), v !== "option" ? delete j.options : j.options ??= [], v === "rich_text" && (j.config = { format: "json" }), z(j);
    }
    function U(j, v) {
      j.form = v, z(j);
    }
    function q(j, v) {
      const V = { ...j.config };
      v ? V.item_type = v : delete V.item_type, j.config = Object.keys(V).length ? V : void 0;
    }
    function ce(j, v) {
      Ao(o.value, j, v);
      for (const V of t.draft.item_types ?? []) {
        const Z = new Set(V.fields);
        V.fields = o.value.filter((N) => Z.has(N.code)).map((N) => N.code);
      }
    }
    function ue(j, v) {
      try {
        Ii(t.draft, j, v.value), delete S.value[j.code];
      } catch (V) {
        S.value[j.code] = V.message, v.value = j.code;
      }
    }
    async function Q() {
      f.value = "", u.value = "text", i.value = p.value ? [p.value.id] : [], m.value = !0, await aa(), d.value?.querySelector("input")?.focus();
    }
    function we() {
      const j = f.value.trim();
      if (!j) return;
      const v = j.normalize("NFKD").replace(/\p{Mark}/gu, "").toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, ""), V = (/^[a-z]/.test(v) ? v : `field_${v || "new"}`).slice(0, 40);
      let Z = V, N = 2;
      for (; o.value.some((R) => R.code === Z); ) {
        const R = "_" + N++;
        Z = V.slice(0, 40 - R.length) + R;
      }
      const O = { code: Z, title: j, form: "text", cardinality: "one" };
      W(O, u.value), (t.draft.fields ??= []).push(O);
      for (const R of t.draft.item_types ?? []) i.value.includes(R.id) && R.fields.push(Z);
      p.value && !i.value.includes(p.value.id) && l("update:itemType", ""), Se.value = Z, m.value = !1;
    }
    const Se = M("");
    return (j, v) => (n(), b("section", ar, [
      s("header", lr, [
        v[7] || (v[7] = s("div", null, [
          s("h3", null, "Fields"),
          s("p", { class: "work-muted" }, "Choose what people can capture on each item.")
        ], -1)),
        h(r(me), {
          "model-value": p.value?.id ?? "",
          "aria-label": "Filter fields by item type",
          appendTo: "self",
          optionLabel: "label",
          optionValue: "value",
          options: [{ value: "", label: "All item types" }, ...c.value],
          "onUpdate:modelValue": v[0] || (v[0] = (V) => l("update:itemType", V))
        }, null, 8, ["model-value", "options"]),
        h(r(_), {
          label: "Add field",
          "aria-expanded": m.value,
          disabled: m.value,
          onClick: Q
        }, {
          icon: K(() => [
            h(r(de), {
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
        ref: d,
        class: "work-settings-card work-stack",
        "aria-label": "Add field",
        onKeydown: v[5] || (v[5] = Oe(Ie((V) => m.value = !1, ["stop"]), ["esc"]))
      }, [
        v[10] || (v[10] = s("header", null, [
          s("h3", null, "Add field"),
          s("p", { class: "work-muted" }, "Choose what the field captures and which items show it.")
        ], -1)),
        s("label", or, [
          v[8] || (v[8] = B("Field name", -1)),
          h(r(ge), {
            modelValue: f.value,
            "onUpdate:modelValue": v[1] || (v[1] = (V) => f.value = V),
            "aria-label": "Field name",
            maxlength: "255",
            onKeydown: Oe(Ie(we, ["prevent"]), ["enter"])
          }, null, 8, ["modelValue", "onKeydown"])
        ]),
        s("label", ir, [
          v[9] || (v[9] = B("Kind", -1)),
          h(r(me), {
            modelValue: u.value,
            "onUpdate:modelValue": v[2] || (v[2] = (V) => u.value = V),
            "aria-label": "New field kind",
            appendTo: "self",
            options: P.value,
            optionLabel: "label",
            optionValue: "value"
          }, null, 8, ["modelValue", "options"])
        ]),
        c.value.length ? (n(), J(mt, {
          key: 0,
          label: "Show on item types",
          options: c.value,
          modelValue: i.value,
          "onUpdate:modelValue": v[3] || (v[3] = (V) => i.value = V)
        }, null, 8, ["options", "modelValue"])) : I("", !0),
        s("footer", nr, [
          h(r(_), {
            label: "Cancel",
            severity: "secondary",
            outlined: "",
            onClick: v[4] || (v[4] = (V) => m.value = !1)
          }),
          h(r(_), {
            label: "Add to draft",
            disabled: !f.value.trim(),
            onClick: we
          }, null, 8, ["disabled"])
        ])
      ], 544)) : I("", !0),
      x.value.length ? I("", !0) : (n(), b("p", sr, "No fields here yet. Add a field to capture information.")),
      ct((n(), J(ll, {
        columns: "fields",
        count: x.value.length
      }, {
        default: K(() => [
          (n(!0), b(te, null, se(x.value, ({ field: V, index: Z }) => (n(), J(al, {
            title: r(Ye)(V),
            "initial-open": Se.value === V.code,
            kind: re(V)?.title || r(g).find((N) => N.value === ne(V))?.label || r(Re)(ne(V)),
            key: V.id ?? Z,
            class: "work-field-row work-reorder-entry work-stack"
          }, {
            handle: K(() => [
              h(r(_), {
                type: "button",
                class: "work-reorder-handle work-icon-button",
                "aria-label": "Drag " + r(Ye)(V) + " or use the arrow keys to reorder",
                onKeydown: [
                  Oe(Ie((N) => ce(Z, -1), ["prevent"]), ["up"]),
                  Oe(Ie((N) => ce(Z, 1), ["prevent"]), ["down"])
                ],
                severity: "secondary",
                text: "",
                size: "small"
              }, {
                default: K(() => [
                  h(r(de), {
                    icon: "tabler:grip-vertical",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["aria-label", "onKeydown"])
            ]),
            flags: K(() => [
              V.track ? (n(), J(r(We), {
                key: 0,
                class: "kx-tag-sm",
                severity: "secondary",
                value: "Tracked"
              })) : I("", !0),
              V.intervals ? (n(), J(r(We), {
                key: 1,
                class: "kx-tag-sm",
                severity: "secondary",
                value: "Intervals"
              })) : I("", !0)
            ]),
            usage: K(() => [
              s("span", rr, D(A(V.code).length ? A(V.code).join(", ") : "Unused"), 1)
            ]),
            actions: K(() => [
              h(r(_), {
                "aria-label": "Move " + r(Ye)(V) + " earlier",
                severity: "secondary",
                disabled: Z === 0,
                onClick: (N) => ce(Z, -1),
                text: "",
                size: "small"
              }, {
                default: K(() => [
                  h(r(de), {
                    icon: "tabler:arrow-up",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["aria-label", "disabled", "onClick"]),
              h(r(_), {
                "aria-label": "Move " + r(Ye)(V) + " later",
                severity: "secondary",
                disabled: Z === o.value.length - 1,
                onClick: (N) => ce(Z, 1),
                text: "",
                size: "small"
              }, {
                default: K(() => [
                  h(r(de), {
                    icon: "tabler:arrow-down",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["aria-label", "disabled", "onClick"])
            ]),
            default: K(() => [
              S.value[V.code] ? (n(), b("p", dr, D(S.value[V.code]), 1)) : I("", !0),
              (n(!0), b(te, null, se(e.issues?.filter((N) => N.code === V.code) ?? [], (N) => (n(), b("p", {
                key: N.what,
                class: "work-error work-small",
                role: "alert"
              }, D(r(tl)(N)), 1))), 128)),
              s("div", ur, [
                s("label", cr, [
                  v[11] || (v[11] = B("Title", -1)),
                  h(r(ge), {
                    modelValue: V.title,
                    "onUpdate:modelValue": (N) => V.title = N,
                    "aria-label": "Field title",
                    maxlength: "255",
                    placeholder: r(Ye)(V)
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder"])
                ]),
                s("label", vr, [
                  v[12] || (v[12] = B("Kind", -1)),
                  h(r(me), {
                    "aria-label": "Kind",
                    "model-value": ne(V),
                    "onUpdate:modelValue": (N) => W(V, N),
                    appendTo: "self",
                    options: P.value,
                    optionLabel: "label",
                    optionValue: "value"
                  }, null, 8, ["model-value", "onUpdate:modelValue", "options"])
                ]),
                s("label", mr, [
                  v[13] || (v[13] = B("Values allowed", -1)),
                  h(r(me), {
                    "aria-label": "Values allowed",
                    "model-value": V.cardinality ?? "one",
                    "onUpdate:modelValue": (N) => V.cardinality = N,
                    appendTo: "self",
                    options: [{ label: "One value", value: "one" }, { label: "Multiple unique values", value: "set" }, { label: "Ordered values", value: "list" }],
                    optionLabel: "label",
                    optionValue: "value"
                  }, null, 8, ["model-value", "onUpdate:modelValue"])
                ])
              ]),
              V.type === "item" ? (n(), b("label", fr, [
                v[14] || (v[14] = B("Which items can be referenced? ", -1)),
                h(r(me), {
                  "model-value": V.config?.item_type ?? "",
                  "aria-label": "Reference target",
                  appendTo: "self",
                  optionLabel: "label",
                  optionValue: "value",
                  options: [{ value: "", label: "Any item type" }, ...c.value],
                  "onUpdate:modelValue": (N) => q(V, N)
                }, null, 8, ["model-value", "options", "onUpdate:modelValue"]),
                v[15] || (v[15] = s("span", { class: "work-muted work-small" }, "A reference stores the selected item as a value. To show a named relationship on both items, use Links.", -1))
              ])) : I("", !0),
              ve(V) ? (n(), J(Oo, {
                key: V.type,
                schema: ve(V),
                "model-value": V.config ?? G,
                "onUpdate:modelValue": (N) => V.config = N,
                onValidity: (N) => l("validity", "config-" + Z, N)
              }, null, 8, ["schema", "model-value", "onUpdate:modelValue", "onValidity"])) : I("", !0),
              V.type === "option" ? (n(), J(tr, {
                key: 3,
                field: V,
                onValidity: v[6] || (v[6] = (N, O) => l("validity", O, N))
              }, null, 8, ["field"])) : I("", !0),
              V.type === "formula" || V.type === "rollup" ? (n(), b("label", pr, [
                v[16] || (v[16] = B("Result type", -1)),
                h(r(me), {
                  "model-value": V.form,
                  "onUpdate:modelValue": (N) => U(V, N),
                  "aria-label": "Result type",
                  options: r(g).slice(0, 8),
                  optionLabel: "label",
                  optionValue: "value",
                  appendTo: "self"
                }, null, 8, ["model-value", "onUpdate:modelValue", "options"])
              ])) : I("", !0),
              V.type === "formula" ? (n(), b("label", br, [
                v[17] || (v[17] = B("Expression", -1)),
                h(r(ge), {
                  modelValue: V.expression,
                  "onUpdate:modelValue": (N) => V.expression = N,
                  "aria-label": "Expression"
                }, null, 8, ["modelValue", "onUpdate:modelValue"])
              ])) : I("", !0),
              V.type === "rollup" ? (n(), b(te, { key: 6 }, [
                s("label", hr, [
                  v[18] || (v[18] = B("Of", -1)),
                  h(r(ge), {
                    modelValue: V.of,
                    "onUpdate:modelValue": (N) => V.of = N,
                    "aria-label": "Related items"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                s("label", gr, [
                  v[19] || (v[19] = B("Function", -1)),
                  h(r(ge), {
                    modelValue: V.fn,
                    "onUpdate:modelValue": (N) => V.fn = N,
                    "aria-label": "Calculation"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                s("label", yr, [
                  v[20] || (v[20] = B("Field", -1)),
                  h(r(ge), {
                    modelValue: V.field,
                    "onUpdate:modelValue": (N) => V.field = N,
                    "aria-label": "Calculated field"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                s("label", kr, [
                  v[21] || (v[21] = B("Order by", -1)),
                  h(r(me), {
                    "model-value": V.by,
                    "aria-label": "Rollup order",
                    options: ["rank", "time"],
                    showClear: "",
                    appendTo: "self",
                    "onUpdate:modelValue": (N) => V.by = N || void 0
                  }, null, 8, ["model-value", "onUpdate:modelValue"])
                ]),
                h(zl, {
                  modelValue: V.where,
                  "onUpdate:modelValue": (N) => V.where = N,
                  draft: e.draft,
                  "board-id": e.boardId,
                  label: "Include related items when",
                  onValidity: (N) => l("validity", "rollup-" + Z, N)
                }, null, 8, ["modelValue", "onUpdate:modelValue", "draft", "board-id", "onValidity"])
              ], 64)) : I("", !0),
              h(ze, {
                class: "work-disclosure",
                label: "Advanced field settings"
              }, {
                default: K(() => [
                  s("div", wr, [
                    s("label", Vr, [
                      v[22] || (v[22] = B("Field identifier for integrations", -1)),
                      h(r(ge), {
                        value: V.code,
                        "aria-label": "Field code",
                        required: "",
                        pattern: "[a-z][a-z0-9_]*",
                        onInput: (N) => ue(V, N.target)
                      }, null, 8, ["value", "onInput"])
                    ]),
                    s("label", $r, [
                      v[23] || (v[23] = B("Allow filters to use", -1)),
                      h(r(me), {
                        "aria-label": "Allow filters to use",
                        "model-value": V.index ?? "none",
                        "onUpdate:modelValue": (N) => V.index = N,
                        appendTo: "self",
                        options: oe(V),
                        optionLabel: "label",
                        optionValue: "value"
                      }, null, 8, ["model-value", "onUpdate:modelValue", "options"])
                    ]),
                    s("section", xr, [
                      v[26] || (v[26] = s("h4", { class: "work-group-title" }, "History", -1)),
                      s("div", Cr, [
                        s("div", Sr, [
                          v[24] || (v[24] = s("div", { class: "work-row-main" }, [
                            s("strong", null, "Track changes"),
                            s("p", { class: "work-muted work-small" }, "Record each value change in the item history.")
                          ], -1)),
                          h(r(_e), {
                            modelValue: V.track,
                            "onUpdate:modelValue": (N) => V.track = N,
                            "aria-label": "Track changes"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        s("div", Tr, [
                          v[25] || (v[25] = s("div", { class: "work-row-main" }, [
                            s("strong", null, "Track intervals"),
                            s("p", { class: "work-muted work-small" }, "Measure how long each value stays in effect.")
                          ], -1)),
                          h(r(_e), {
                            modelValue: V.intervals,
                            "onUpdate:modelValue": (N) => V.intervals = N,
                            "aria-label": "Track intervals"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ])
                      ])
                    ]),
                    !ve(V) && ke(V) ? (n(), J(Ot, {
                      key: 0,
                      label: "Field configuration",
                      "model-value": V.config,
                      shape: "object",
                      "onUpdate:modelValue": (N) => V.config = N,
                      onValidity: (N) => l("validity", "config-" + Z, N)
                    }, null, 8, ["model-value", "onUpdate:modelValue", "onValidity"])) : I("", !0),
                    s("section", Ir, [
                      v[27] || (v[27] = s("h4", { class: "work-group-title" }, "Access", -1)),
                      (n(), b(te, null, se(["read", "write"], (N) => h(Lo, {
                        "board-id": e.boardId,
                        key: N,
                        label: N === "read" ? "Who can read" : "Who can edit",
                        "model-value": V.access?.[N],
                        "onUpdate:modelValue": (O) => V.access = { ...V.access, [N]: O },
                        onValidity: (O) => l("validity", "access-" + Z + N, O)
                      }, null, 8, ["board-id", "label", "model-value", "onUpdate:modelValue", "onValidity"])), 64))
                    ]),
                    h(r(_), {
                      label: "Remove field",
                      severity: "danger",
                      text: "",
                      disabled: !!y.value,
                      onClick: (N) => $(V)
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
        [r(w)]
      ])
    ]));
  }
}), Dr = {
  class: "work-stack",
  "aria-label": "Item types editor"
}, Er = { class: "work-section-heading" }, Ar = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, Or = { class: "work-definition-meta" }, Pr = { class: "work-settings-grid" }, Rr = { class: "work-stack work-tight" }, Nr = { class: "work-stack work-tight" }, Mr = { class: "work-stack" }, Fr = { class: "work-stack work-tight" }, Lr = {
  key: 0,
  class: "work-row work-wrap"
}, Br = { class: "work-stack work-tight" }, zr = {
  key: 1,
  class: "work-stack work-tight work-small"
}, jr = {
  key: 0,
  class: "kx-empty"
}, Wr = { class: "work-row work-add-definition" }, qr = { class: "work-stack work-tight" }, Kr = /* @__PURE__ */ ye({
  __name: "TypesEditor",
  props: {
    draft: {},
    guardRemoval: { type: Function },
    issues: {}
  },
  emits: ["fields"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = L(() => t.draft.item_types ?? []), d = M(""), f = M(""), m = M(""), u = L(() => d.value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "").slice(0, 40)), i = L(() => !!d.value.trim());
    function c() {
      const g = /^[a-z]/.test(u.value) ? u.value : "type_" + (u.value || "new");
      let k = g.slice(0, 40), C = 2;
      for (; o.value.some((H) => H.id === k); ) {
        const H = "_" + C++;
        k = g.slice(0, 40 - H.length) + H;
      }
      return k;
    }
    function p() {
      i.value && ((t.draft.item_types ??= []).push({ id: c(), title: d.value.trim(), process: t.draft.processes?.[0]?.id ?? "", fields: [] }), d.value = "");
    }
    function x(g, k) {
      const C = g.id;
      g.id = k;
      for (const H of o.value) H.parent_types && (H.parent_types = H.parent_types.map((P) => P === C ? k : P));
    }
    function y(g, k) {
      g.fields = k, g.inherit && (g.inherit = g.inherit.filter((C) => k.includes(C)));
    }
    function S(g) {
      return (g.parent_types ?? []).filter((k) => typeof k == "string");
    }
    function w(g, k, C) {
      g.parent_types = C && k.length ? [...k, !1] : k;
    }
    function A(g) {
      return o.value.filter((k) => k.id !== g.id && k.parent_types?.includes(g.id)).map((k) => k.title || Re(k.id));
    }
    async function $(g) {
      if (!m.value) {
        if (A(g).length) {
          f.value = `${g.title || Re(g.id)} is a parent type for ${A(g).join(", ")}. Remove those parent selections first.`;
          return;
        }
        m.value = g.id, f.value = "";
        try {
          const k = await t.guardRemoval?.("item_types", g.id);
          k ? f.value = k : Ua(t.draft, "item_types", g.id);
        } finally {
          m.value = "";
        }
      }
    }
    return (g, k) => (n(), b("section", Dr, [
      s("header", Er, [
        k[1] || (k[1] = s("div", null, [
          s("h2", null, "Item types"),
          s("p", { class: "work-muted work-small" }, "Choose the fields, parent relationships and workflow for each kind of work.")
        ], -1)),
        h(r(We), {
          class: "kx-tag-sm",
          severity: "secondary"
        }, {
          default: K(() => [
            B(D(o.value.length) + " " + D(o.value.length === 1 ? "type" : "types"), 1)
          ]),
          _: 1
        })
      ]),
      f.value ? (n(), b("p", Ar, D(f.value), 1)) : I("", !0),
      h(ll, {
        columns: "types",
        count: o.value.length
      }, {
        default: K(() => [
          (n(!0), b(te, null, se(o.value, (C, H) => (n(), J(al, {
            title: C.title || r(Re)(C.id),
            kind: e.draft.processes?.find((P) => P.id === C.process)?.name || r(Re)(C.process),
            key: H,
            class: "work-type-card"
          }, {
            usage: K(() => [
              s("span", Or, [
                h(r(We), {
                  class: "kx-tag-sm",
                  severity: "secondary"
                }, {
                  default: K(() => [
                    B(D(C.fields.length) + " " + D(C.fields.length === 1 ? "field" : "fields"), 1)
                  ]),
                  _: 2
                }, 1024),
                A(C).length ? (n(), J(r(We), {
                  key: 0,
                  class: "kx-tag-sm",
                  severity: "secondary"
                }, {
                  default: K(() => [
                    B("Parent of " + D(A(C).join(", ")), 1)
                  ]),
                  _: 2
                }, 1024)) : I("", !0)
              ])
            ]),
            actions: K(() => [
              h(r(_), {
                "aria-label": "Fields for " + (C.title || r(Re)(C.id)),
                label: "Fields",
                severity: "secondary",
                outlined: "",
                size: "small",
                onClick: (P) => l("fields", C.id)
              }, null, 8, ["aria-label", "onClick"])
            ]),
            default: K(() => [
              (n(!0), b(te, null, se(e.issues?.filter((P) => P.code === "item_type " + C.id) ?? [], (P) => (n(), b("p", {
                key: P.what,
                class: "work-error work-small",
                role: "alert"
              }, D(r(tl)(P)), 1))), 128)),
              s("div", Pr, [
                s("label", Rr, [
                  k[2] || (k[2] = B("Title", -1)),
                  h(r(ge), {
                    modelValue: C.title,
                    "onUpdate:modelValue": (P) => C.title = P,
                    placeholder: r(Re)(C.id)
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder"])
                ]),
                s("label", Nr, [
                  k[3] || (k[3] = B("Workflow", -1)),
                  h(r(me), {
                    modelValue: C.process,
                    "onUpdate:modelValue": (P) => C.process = P,
                    "aria-label": "Workflow",
                    required: "",
                    appendTo: "self",
                    optionLabel: "label",
                    optionValue: "value",
                    optionDisabled: "disabled",
                    options: [...(e.draft.processes ?? []).map((P) => ({ label: P.name || r(Re)(P.id), value: P.id, disabled: !1 }))]
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                ])
              ]),
              h(mt, {
                label: "Fields",
                options: (e.draft.fields ?? []).map((P) => ({ value: P.code, label: r(Ye)(P) })),
                "model-value": C.fields,
                "onUpdate:modelValue": (P) => y(C, P)
              }, null, 8, ["options", "model-value", "onUpdate:modelValue"]),
              h(ze, {
                class: "work-disclosure",
                label: "Advanced item type settings"
              }, {
                default: K(() => [
                  s("div", Mr, [
                    s("label", Fr, [
                      k[4] || (k[4] = B("Identifier", -1)),
                      h(r(ge), {
                        value: C.id,
                        onChange: (P) => x(C, P.target.value),
                        required: "",
                        pattern: "[a-z][a-z0-9_]*"
                      }, null, 8, ["value", "onChange"])
                    ]),
                    k[8] || (k[8] = B()),
                    h(mt, {
                      label: "Parent types",
                      options: o.value.map((P) => ({ value: P.id, label: P.title || r(Re)(P.id) })),
                      "model-value": S(C),
                      "onUpdate:modelValue": (P) => w(C, P, !!C.parent_types?.includes(!1))
                    }, null, 8, ["options", "model-value", "onUpdate:modelValue"]),
                    S(C).length ? (n(), b("label", Lr, [
                      h(r(_e), {
                        "model-value": !!C.parent_types?.includes(!1),
                        "aria-label": "Allow top-level items",
                        "onUpdate:modelValue": (P) => w(C, S(C), P)
                      }, null, 8, ["model-value", "onUpdate:modelValue"]),
                      k[5] || (k[5] = B("Allow top-level items", -1))
                    ])) : I("", !0),
                    s("div", Br, [
                      h(mt, {
                        label: "Inherit from parent",
                        options: C.fields.map((P) => ({ value: P, label: r(Ye)(e.draft.fields?.find((G) => G.code === P) ?? { code: P }) })),
                        modelValue: C.inherit,
                        "onUpdate:modelValue": (P) => C.inherit = P
                      }, null, 8, ["options", "modelValue", "onUpdate:modelValue"]),
                      k[6] || (k[6] = s("p", { class: "work-muted work-small" }, "These fields resolve from the parent when this item has no own value.", -1))
                    ]),
                    S(C).length ? (n(), b("label", zr, [
                      k[7] || (k[7] = B("When the parent moves", -1)),
                      h(r(me), {
                        modelValue: C.move_children,
                        "onUpdate:modelValue": (P) => C.move_children = P,
                        "aria-label": "When the parent moves",
                        appendTo: "self",
                        optionLabel: "label",
                        optionValue: "value",
                        optionDisabled: "disabled",
                        options: [{ label: "Default", value: void 0, disabled: !1 }, { label: "Move children", value: "move", disabled: !1 }, { label: "Refuse while children exist", value: "refuse", disabled: !1 }]
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ])) : I("", !0),
                    h(r(_), {
                      label: "Remove type",
                      severity: "danger",
                      text: "",
                      disabled: !!m.value,
                      onClick: (P) => $(C)
                    }, null, 8, ["disabled", "onClick"])
                  ])
                ]),
                _: 2
              }, 1024)
            ]),
            _: 2
          }, 1032, ["title", "kind"]))), 128)),
          o.value.length ? I("", !0) : (n(), b("p", jr, "Add a type for the work people create, such as a delivery task or customer request.")),
          s("div", Wr, [
            s("label", qr, [
              k[9] || (k[9] = B("New item type name", -1)),
              h(r(ge), {
                modelValue: d.value,
                "onUpdate:modelValue": k[0] || (k[0] = (C) => d.value = C),
                placeholder: "e.g. Customer request",
                onKeydown: Oe(Ie(p, ["prevent"]), ["enter"])
              }, null, 8, ["modelValue", "onKeydown"])
            ]),
            h(r(_), {
              label: "Add type",
              severity: "secondary",
              disabled: !i.value,
              onClick: p,
              outlined: ""
            }, {
              icon: K(() => [
                h(r(de), {
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
}), Gr = ".work-process-canvas>svg{height:480px;width:100%}.work-process-canvas:focus-visible{outline:var(--p-focus-ring-width) var(--p-focus-ring-style) var(--p-focus-ring-color);outline-offset:var(--p-focus-ring-offset)}.work-state-card{fill:var(--p-content-background);stroke:var(--p-content-border-color);stroke-width:1.5}.work-graph-node.work-selected .work-state-card{stroke:var(--p-primary-color);stroke-width:2.5;fill:color-mix(in srgb,var(--p-primary-color) 6%,var(--p-content-background))}.work-graph-node:focus-visible .work-state-card{stroke:var(--p-focus-ring-color);stroke-width:var(--p-focus-ring-width)}.work-process-canvas .work-edge-label{font-size:12px;fill:var(--p-text-color)}.work-process-canvas .work-edge-label-bg{fill:var(--p-content-background);stroke:var(--p-content-border-color);stroke-width:1}.work-edge-line{stroke:var(--p-primary-color);stroke-width:1.5}.work-edge-return .work-edge-line{stroke:var(--p-text-muted-color);stroke-dasharray:5 4}.work-graph-arrow{fill:context-stroke}.work-lane-line{fill:none;stroke:var(--p-text-muted-color);stroke-width:1.5;stroke-dasharray:2 4}.work-node-connector{fill:var(--p-content-background);stroke:var(--p-primary-color);stroke-width:1.5}.work-node-connector:hover,.work-node-connector:focus-visible,.work-node-connector[aria-pressed=true]{fill:var(--p-primary-color)}.work-any-transition:focus-visible text,.work-any-transition[aria-pressed=true] text{fill:var(--p-primary-color);text-decoration:underline}.work-process-legend{position:static;flex-wrap:wrap;padding:10px 16px;border-top:1px solid var(--p-content-border-color);background:var(--p-content-background)}@media(max-width:700px){.work-process-canvas>svg{height:420px}}.work-process-more{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:8px;padding:8px 16px;border-top:1px solid var(--p-content-border-color);background:var(--p-content-background);color:var(--p-text-muted-color);font-size:12px}.work-process-canvas .work-graph-edge.work-selected .work-edge-label-bg{fill:var(--p-primary-color);stroke:var(--p-primary-color)}.work-process-canvas .work-graph-edge.work-selected .work-edge-label{fill:var(--p-primary-contrast-color)}", yo = /* @__PURE__ */ new WeakSet();
function Hr(e) {
  const a = e.getRootNode();
  if (a instanceof ShadowRoot && !yo.has(a)) {
    const t = e.ownerDocument.createElement("style");
    t.textContent = Gr, a.append(t), yo.add(a);
  }
}
const ti = 0.8;
function Yr(e, a, t) {
  const l = Math.min(1, a.width / e.width, a.height / e.height);
  if (l >= ti) return { zoom: l, pan: { x: (e.width - a.width / l) / 2, y: (e.height - a.height / l) / 2 } };
  const o = e.nodes.find((f) => f.state.id === t) ?? e.nodes[0], d = Math.min(1, a.width / ((o?.width ?? 190) + 64));
  return { zoom: d, pan: o ? { x: e.direction === "TB" ? o.x - a.width / d / 2 : o.x - o.width / 2 - 32, y: e.direction === "TB" ? o.y - o.height / 2 - 32 : o.y - a.height / d / 2 } : { x: 0, y: 0 } };
}
const Xr = ["onKeydown"], Jr = {
  key: 0,
  class: "work-process-instruction",
  role: "status"
}, Zr = ["viewBox"], Qr = ["id"], _r = ["d", "marker-end"], ed = ["aria-label", "aria-pressed", "aria-keyshortcuts", "onKeydown", "onFocus", "onClick"], td = ["d"], ad = ["d", "marker-end"], ld = ["x", "y", "width", "height"], od = ["x", "y"], id = ["x", "dy"], nd = ["aria-label", "aria-pressed", "onClick", "onKeydown", "onFocus", "onPointerup"], sd = ["x", "y", "width", "height"], rd = ["cx", "cy"], dd = ["x", "y"], ud = ["x", "dy"], cd = ["x", "y"], vd = ["x", "dy"], md = {
  key: 0,
  class: "work-limit-text"
}, fd = ["aria-label", "aria-pressed", "aria-keyshortcuts", "onFocus", "onKeydown", "onClick"], pd = ["x", "y"], bd = ["x", "dy"], hd = ["cx", "cy", "aria-label", "aria-pressed", "onFocus", "onPointerdown", "onClick", "onKeydown"], gd = ["d"], yd = {
  key: 1,
  class: "work-process-more",
  role: "status"
}, kd = { class: "work-process-legend" }, wd = /* @__PURE__ */ ye({
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
    const l = e, o = t, d = el().replace(/:/g, "_"), f = M(""), m = M(), u = M();
    let i;
    const c = M(900), p = M(!1), x = L(() => c.value < 700 ? 420 : 480), y = L(() => Xi(l.process, l.draft, {
      width: c.value,
      height: x.value,
      direction: l.fitOnOpen ? "TB" : void 0
    })), S = M(1), w = M({ x: 0, y: 0 }), A = M({ x: 0, y: 0 }), $ = L(() => {
      const T = Math.min(1, c.value / y.value.width);
      return l.fitOnOpen ? Math.max(ti, T) : T;
    }), g = L(() => ({
      width: c.value,
      height: p.value ? Math.max(x.value, Math.ceil(y.value.height * $.value)) : x.value
    })), k = L(() => y.value.nodes.filter((T) => T.x - T.width / 2 >= w.value.x && T.x + T.width / 2 <= w.value.x + g.value.width / S.value && T.y - T.height / 2 >= w.value.y && T.y + T.height / 2 <= w.value.y + g.value.height / S.value).length);
    function C() {
      p.value = !1;
      const T = Yr(y.value, g.value, l.process.initial);
      S.value = T.zoom, w.value = T.pan;
    }
    const H = L(() => `${w.value.x} ${w.value.y} ${g.value.width / S.value} ${g.value.height / S.value}`), P = L(() => y.value.nodes.find((T) => T.state.id === f.value));
    function G() {
      p.value = !0, S.value = $.value;
      const T = g.value.width / S.value, ee = y.value.nodes.find((E) => E.state.id === l.process.initial);
      w.value = {
        x: y.value.width > T && ee ? ee.x - T / 2 : (y.value.width - T) / 2,
        y: 0
      };
    }
    function ne(T) {
      l.fitOnOpen && (p.value = !1);
      const ee = Math.max(0.02, Math.min(3, S.value * T)), E = 1 / S.value - 1 / ee;
      w.value = { x: w.value.x + g.value.width * E / 2, y: w.value.y + g.value.height * E / 2 }, S.value = ee;
    }
    function re(T) {
      const ee = g.value.width / S.value, E = g.value.height / S.value;
      (T.x - T.width / 2 < w.value.x || T.x + T.width / 2 > w.value.x + ee || T.y - T.height / 2 < w.value.y || T.y + T.height / 2 > w.value.y + E) && (w.value = { x: T.x - ee / 2, y: T.y - E / 2 });
    }
    function ve() {
      const T = y.value.nodes.find((ee) => ee.state === l.selectedState) ?? y.value.edges.find((ee) => ee.transition === l.selectedTransition);
      if (!T) {
        l.fitOnOpen && p.value && G();
        return;
      }
      re(T);
    }
    Te([y, () => l.selectedState, () => l.selectedTransition], ve, { flush: "post" });
    function ke() {
      l.fitOnOpen ? G() : C();
    }
    Te(() => l.process.id, () => {
      Q(), ke();
    }, { flush: "post" });
    function oe(T) {
      if (T.target !== m.value) return;
      (T.key === "+" || T.key === "=") && (T.preventDefault(), ne(1.2)), T.key === "-" && (T.preventDefault(), ne(1 / 1.2)), T.key === "0" && (T.preventDefault(), G());
      const ee = 60 / S.value;
      T.key.startsWith("Arrow") && (T.preventDefault(), w.value = { x: w.value.x + (T.key === "ArrowRight" ? ee : T.key === "ArrowLeft" ? -ee : 0), y: w.value.y + (T.key === "ArrowDown" ? ee : T.key === "ArrowUp" ? -ee : 0) });
    }
    function z(T, ee) {
      const E = ee.currentTarget;
      if (!f.value) o("state", T, E);
      else if (f.value !== T.id) {
        const ie = f.value;
        f.value = "", o("connect", ie, T.id, E);
      }
    }
    function W(T) {
      f.value = T.state.id, A.value = { x: y.value.direction === "TB" ? T.x : T.x + T.width / 2, y: y.value.direction === "TB" ? T.y + T.height / 2 : T.y };
    }
    function U(T, ee) {
      if (T.pointerType === "touch" || T.button !== 0) return;
      i = T.pointerId, W(ee);
      const E = T.currentTarget;
      E.hasPointerCapture?.(T.pointerId) && E.releasePointerCapture(T.pointerId);
    }
    function q(T, ee) {
      i === T.pointerId && (i = void 0, !(!f.value || f.value === ee.id) && z(ee, T));
    }
    function ce(T, ee) {
      if ((T.key === "Enter" || T.key === " ") && (T.preventDefault(), z(ee, T)), ["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp"].includes(T.key)) {
        T.preventDefault();
        const E = Array.from(u.value?.querySelectorAll(".work-graph-node") ?? []), ie = y.value.nodes.findIndex((Ue) => Ue.state === ee), Ve = ["ArrowRight", "ArrowDown"].includes(T.key) ? 1 : -1;
        E[(ie + Ve + E.length) % E.length]?.focus();
      }
    }
    function ue(T, ee) {
      l.selectedTransition === ee && o("removeTransition", T);
    }
    function Q() {
      f.value = "", i = void 0, Se.clear(), j = 0;
    }
    function we() {
      Q(), o("clear");
    }
    const Se = /* @__PURE__ */ new Map();
    let j = 0;
    function v(T) {
      if (!T.target.closest('[role="button"]') && (Se.set(T.pointerId, { x: T.clientX, y: T.clientY }), m.value?.setPointerCapture?.(T.pointerId), Se.size === 2)) {
        const [ee, E] = [...Se.values()];
        j = Math.hypot(ee.x - E.x, ee.y - E.y);
      }
    }
    function V(T) {
      const ee = u.value?.getBoundingClientRect();
      if (!ee?.width) return;
      if (i === T.pointerId && f.value) {
        A.value = { x: w.value.x + (T.clientX - ee.left) * g.value.width / S.value / ee.width, y: w.value.y + (T.clientY - ee.top) * g.value.height / S.value / ee.height };
        return;
      }
      const E = Se.get(T.pointerId);
      if (E)
        if (Se.set(T.pointerId, { x: T.clientX, y: T.clientY }), Se.size === 2) {
          const [ie, Ve] = [...Se.values()], Ue = Math.hypot(ie.x - Ve.x, ie.y - Ve.y);
          j && ne(Ue / j), j = Ue;
        } else w.value = { x: w.value.x - (T.clientX - E.x) * g.value.width / S.value / ee.width, y: w.value.y - (T.clientY - E.y) * g.value.height / S.value / ee.height };
    }
    function Z(T) {
      i === T.pointerId && (f.value = "", i = void 0);
    }
    function N(T) {
      Se.delete(T.pointerId), j = 0, Z(T);
    }
    function O(T) {
      T.ctrlKey && (T.preventDefault(), ne(Math.exp(-T.deltaY * 0.01)));
    }
    let R;
    Ia(() => {
      if (m.value && Hr(m.value), typeof ResizeObserver < "u" && u.value) {
        let T = !0;
        R = new ResizeObserver(() => {
          const ee = u.value?.getBoundingClientRect();
          if (!ee?.width || !ee.height) return;
          const E = g.value.width;
          c.value = ee.width, (T || Math.abs(ee.width - E) > 1) && (T ? ke() : p.value ? G() : C(), T = !1), ve();
        }), R.observe(u.value);
      }
    }), St(() => R?.disconnect()), a({ fit: G, focus: () => m.value?.focus(), zoomIn: () => ne(1.2), zoomOut: () => ne(1 / 1.2) });
    function F(T) {
      return T.category === "completed" ? "check" : T.category === "canceled" ? "x" : T.id === l.process.initial ? "arrow-bar-to-right" : { gate: "shield-check", automated: "bolt", parallel: "arrows-split" }[T.kind ?? ""] ?? "user";
    }
    return (T, ee) => (n(), b("section", {
      ref_key: "canvas",
      ref: m,
      class: ft(["work-process-canvas", { "work-process-scrollable": e.fitOnOpen && p.value }]),
      "aria-label": "Process map",
      tabindex: "0",
      onKeydown: [
        oe,
        Oe(Ie(we, ["stop"]), ["esc"])
      ],
      onPointerdown: v,
      onPointermove: V,
      onPointerup: N,
      onPointerleave: Z,
      onPointercancel: Q,
      onWheel: O
    }, [
      f.value ? (n(), b("p", Jr, "Choose the next stop. Escape cancels.")) : I("", !0),
      (n(), b("svg", {
        ref_key: "svg",
        ref: u,
        style: ki({ height: g.value.height + "px" }),
        viewBox: H.value,
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
          }, [...ee[1] || (ee[1] = [
            s("path", {
              d: "M0 0 L8 4 L0 8 z",
              class: "work-graph-arrow"
            }, null, -1)
          ])], 8, Qr)
        ]),
        (n(!0), b(te, null, se(y.value.parallels, (E) => (n(), b("path", {
          key: E.key,
          d: E.path,
          class: "work-lane-line",
          "marker-end": `url(#${r(d)}-arrow)`
        }, [
          s("title", null, "Parallel lane from " + D(r(he)(E.state)), 1)
        ], 8, _r))), 128)),
        (n(!0), b(te, null, se(y.value.edges, (E) => (n(), b("g", {
          key: E.key,
          class: ft(["work-graph-edge", ["work-edge-" + E.type, { "work-selected": e.selectedTransition === E.transition }]]),
          role: "button",
          tabindex: "0",
          "aria-label": "Edit transition " + r(je)(E.transition),
          "aria-pressed": e.selectedTransition === E.transition,
          "aria-keyshortcuts": e.selectedTransition === E.transition ? "Delete Backspace" : void 0,
          onKeydown: [
            Oe((ie) => ue(ie, E.transition), ["delete"]),
            Oe((ie) => ue(ie, E.transition), ["backspace"]),
            Oe(Ie((ie) => o("transition", E.transition, ie.currentTarget), ["prevent"]), ["enter"]),
            Oe(Ie((ie) => o("transition", E.transition, ie.currentTarget), ["prevent"]), ["space"])
          ],
          onFocus: (ie) => re(E),
          onClick: (ie) => o("transition", E.transition, ie.currentTarget)
        }, [
          s("path", {
            d: E.path,
            class: "work-edge-hit"
          }, null, 8, td),
          s("path", {
            d: E.path,
            class: "work-edge-line",
            "marker-end": `url(#${r(d)}-arrow)`
          }, null, 8, ad),
          s("rect", {
            x: E.x - E.width / 2,
            y: E.y - E.height / 2,
            width: E.width,
            height: E.height,
            rx: "6",
            class: "work-edge-label-bg"
          }, null, 8, ld),
          s("text", {
            x: E.x,
            y: E.y - (E.lines.length - 1) * 8 + 4,
            class: "work-edge-label",
            "text-anchor": "middle"
          }, [
            (n(!0), b(te, null, se(E.lines, (ie, Ve) => (n(), b("tspan", {
              key: Ve,
              x: E.x,
              dy: Ve ? 16 : 0
            }, D(ie), 9, id))), 128))
          ], 8, od)
        ], 42, ed))), 128)),
        (n(!0), b(te, null, se(y.value.nodes, (E) => (n(), b("g", {
          key: E.state.id,
          class: ft(["work-graph-node", ["work-stop-" + E.state.category, { "work-selected": e.selectedState === E.state }]]),
          role: "button",
          tabindex: "0",
          "aria-label": "Edit state " + r(he)(E.state),
          "aria-pressed": e.selectedState === E.state,
          onClick: (ie) => z(E.state, ie),
          onKeydown: (ie) => ce(ie, E.state),
          onFocus: (ie) => re(E),
          onPointerup: (ie) => q(ie, E.state)
        }, [
          s("rect", {
            x: E.x - E.width / 2,
            y: E.y - E.height / 2,
            width: E.width,
            height: E.height,
            rx: "10",
            class: "work-state-card"
          }, null, 8, sd),
          s("circle", {
            cx: E.x - E.width / 2 + 22,
            cy: E.y - E.height / 2 + 25,
            r: "10",
            class: "work-stop-ring"
          }, null, 8, rd),
          h(r(de), {
            icon: "tabler:" + F(E.state),
            x: E.x - E.width / 2 + 15,
            y: E.y - E.height / 2 + 18,
            width: "14",
            height: "14",
            class: "work-stop-icon",
            "aria-hidden": "true"
          }, null, 8, ["icon", "x", "y"]),
          s("text", {
            x: E.x - E.width / 2 + 42,
            y: E.y - E.height / 2 + 29,
            class: "work-node-name"
          }, [
            (n(!0), b(te, null, se(E.title, (ie, Ve) => (n(), b("tspan", {
              key: Ve,
              x: E.x - E.width / 2 + 42,
              dy: Ve ? 18 : 0
            }, D(ie), 9, ud))), 128))
          ], 8, dd),
          s("text", {
            x: E.x - E.width / 2 + 16,
            y: E.y - E.height / 2 + 33 + E.title.length * 18,
            class: "work-node-meta"
          }, [
            (n(!0), b(te, null, se(E.caption, (ie, Ve) => (n(), b("tspan", {
              key: Ve,
              x: E.x - E.width / 2 + 16,
              dy: Ve ? 16 : 0
            }, D(ie), 9, vd))), 128)),
            e.draft.policy?.wip?.[E.state.id] ? (n(), b("tspan", md, " · limit " + D(e.draft.policy.wip[E.state.id].limit), 1)) : I("", !0)
          ], 8, cd),
          (n(!0), b(te, null, se(E.badges, (ie, Ve) => (n(), b("g", {
            key: ie.id,
            class: "work-any-transition",
            role: "button",
            tabindex: "0",
            "aria-label": "Edit transition " + r(je)(ie),
            "aria-pressed": e.selectedTransition === ie,
            "aria-keyshortcuts": e.selectedTransition === ie ? "Delete Backspace" : void 0,
            onFocus: (Ue) => re(E),
            onKeydown: [
              Oe((Ue) => ue(Ue, ie), ["delete"]),
              Oe((Ue) => ue(Ue, ie), ["backspace"]),
              Oe(Ie((Ue) => o("transition", ie, Ue.currentTarget), ["stop", "prevent"]), ["enter"]),
              Oe(Ie((Ue) => o("transition", ie, Ue.currentTarget), ["stop", "prevent"]), ["space"])
            ],
            onClick: Ie((Ue) => o("transition", ie, Ue.currentTarget), ["stop"])
          }, [
            s("text", {
              x: E.x - E.width / 2 + 16,
              y: E.y - E.height / 2 + 33 + E.title.length * 18 + E.caption.length * 16 + E.badges.slice(0, Ve).reduce((Ue, Ee) => Ue + r(la)(r(je)(Ee) + " works from any state").length * 18, 0),
              class: "work-node-meta"
            }, [
              (n(!0), b(te, null, se(r(la)(r(je)(ie) + " works from any state"), (Ue, Ee) => (n(), b("tspan", {
                key: Ee,
                x: E.x - E.width / 2 + 16,
                dy: Ee ? 18 : 0
              }, D(Ue), 9, bd))), 128))
            ], 8, pd)
          ], 40, fd))), 128)),
          ["completed", "canceled"].includes(E.state.category) ? I("", !0) : (n(), b("circle", {
            key: 0,
            cx: y.value.direction === "TB" ? E.x : E.x + E.width / 2,
            cy: y.value.direction === "TB" ? E.y + E.height / 2 : E.y,
            r: "9",
            class: "work-node-connector",
            role: "button",
            tabindex: "0",
            "aria-label": "Connect from " + r(he)(E.state),
            "aria-pressed": f.value === E.state.id,
            onFocus: (ie) => re(E),
            onPointerdown: Ie((ie) => U(ie, E), ["stop"]),
            onClick: Ie((ie) => W(E), ["stop"]),
            onKeydown: [
              Oe(Ie((ie) => W(E), ["stop", "prevent"]), ["enter"]),
              Oe(Ie((ie) => W(E), ["stop", "prevent"]), ["space"])
            ]
          }, null, 40, hd))
        ], 42, nd))), 128)),
        P.value ? (n(), b("path", {
          key: 0,
          d: `M ${y.value.direction === "TB" ? P.value.x : P.value.x + P.value.width / 2} ${y.value.direction === "TB" ? P.value.y + P.value.height / 2 : P.value.y} L ${A.value.x} ${A.value.y}`,
          class: "work-connect-ghost"
        }, null, 8, gd)) : I("", !0)
      ], 12, Zr)),
      k.value < e.process.states.length ? (n(), b("div", yd, [
        s("span", null, D(k.value) + " of " + D(e.process.states.length) + " states in view · Pan to see more", 1),
        p.value ? I("", !0) : (n(), J(r(_), {
          key: 0,
          label: "Fit map",
          size: "small",
          text: "",
          onClick: ee[0] || (ee[0] = (E) => G())
        }))
      ])) : I("", !0),
      s("div", kd, [
        s("span", null, D(e.process.states.length) + " states · " + D(Math.round(S.value * 100)) + "%", 1),
        ee[2] || (ee[2] = s("span", null, [
          s("i"),
          B("Transition")
        ], -1)),
        ee[3] || (ee[3] = s("span", null, [
          s("i", { class: "work-return-key" }),
          B("Return / loop")
        ], -1)),
        ee[4] || (ee[4] = s("span", null, "Drag to pan · Ctrl + scroll to zoom · Fit to reset the view", -1))
      ])
    ], 42, Xr));
  }
}), Vd = {
  class: "work-process-list work-stack",
  "aria-label": "Process list"
}, $d = { class: "work-table-scroll" }, xd = {
  class: "work-settings-table work-process-table",
  role: "table",
  "aria-label": "States"
}, Cd = { role: "rowgroup" }, Sd = ["aria-selected"], Td = { role: "cell" }, Id = {
  key: 0,
  class: "work-muted work-small"
}, Ud = { role: "cell" }, Dd = { role: "cell" }, Ed = {
  role: "cell",
  class: "work-process-list-actions"
}, Ad = { class: "work-table-scroll" }, Od = {
  class: "work-settings-table work-process-table",
  role: "table",
  "aria-label": "Transitions"
}, Pd = { role: "rowgroup" }, Rd = ["aria-selected"], Nd = { role: "cell" }, Md = {
  key: 0,
  class: "work-muted"
}, Fd = { role: "cell" }, Ld = { role: "cell" }, Bd = {
  role: "cell",
  class: "work-process-list-actions"
}, zd = /* @__PURE__ */ ye({
  __name: "ProcessList",
  props: {
    process: {},
    selectedState: {},
    selectedTransition: {},
    counts: {}
  },
  emits: ["state", "transition", "removeState", "removeTransition"],
  setup(e) {
    return (a, t) => (n(), b("section", Vd, [
      t[6] || (t[6] = s("h3", null, "States", -1)),
      s("div", $d, [
        s("table", xd, [
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
          s("tbody", Cd, [
            (n(!0), b(te, null, se(e.process.states, (l) => (n(), b("tr", {
              key: l.id,
              "aria-selected": e.selectedState === l,
              role: "row"
            }, [
              s("td", Td, [
                h(r(ge), {
                  modelValue: l.name,
                  "onUpdate:modelValue": (o) => l.name = o,
                  "aria-label": "Name of " + r(he)(l)
                }, null, 8, ["modelValue", "onUpdate:modelValue", "aria-label"]),
                e.counts ? (n(), b("p", Id, D(e.counts[l.id] ?? 0) + " here", 1)) : I("", !0)
              ]),
              s("td", Ud, [
                t[0] || (t[0] = s("span", {
                  class: "work-process-cell-label",
                  "aria-hidden": "true"
                }, "Phase", -1)),
                B(D(r(Gt)(l.category)), 1)
              ]),
              s("td", Dd, [
                t[1] || (t[1] = s("span", {
                  class: "work-process-cell-label",
                  "aria-hidden": "true"
                }, "Kind", -1)),
                h(r(We), { severity: "secondary" }, {
                  default: K(() => [
                    B(D(r(Ha)(l.kind)), 1)
                  ]),
                  _: 2
                }, 1024)
              ]),
              s("td", Ed, [
                h(r(_), {
                  size: "small",
                  text: "",
                  severity: "secondary",
                  "aria-label": "Edit state " + r(he)(l),
                  onClick: (o) => a.$emit("state", l, o.currentTarget)
                }, {
                  default: K(() => [
                    h(r(de), { icon: "tabler:pencil" })
                  ]),
                  _: 1
                }, 8, ["aria-label", "onClick"]),
                h(r(_), {
                  size: "small",
                  text: "",
                  severity: "danger",
                  "aria-label": "Remove state " + r(he)(l),
                  onClick: (o) => a.$emit("removeState", l)
                }, {
                  default: K(() => [
                    h(r(de), { icon: "tabler:trash" })
                  ]),
                  _: 1
                }, 8, ["aria-label", "onClick"])
              ])
            ], 8, Sd))), 128))
          ])
        ])
      ]),
      t[7] || (t[7] = s("h3", null, "Transitions", -1)),
      s("div", Ad, [
        s("table", Od, [
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
          s("tbody", Pd, [
            (n(!0), b(te, null, se(e.process.transitions ?? [], (l) => (n(), b("tr", {
              key: l.id,
              "aria-selected": e.selectedTransition === l,
              role: "row"
            }, [
              s("td", Nd, [
                h(r(ge), {
                  modelValue: l.name,
                  "onUpdate:modelValue": (o) => l.name = o,
                  placeholder: r(je)(l),
                  "aria-label": "Name of " + r(je)(l)
                }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder", "aria-label"]),
                l.when || l.require?.length || l.guards?.length ? (n(), b("p", Md, "Has requirements")) : I("", !0)
              ]),
              s("td", Fd, [
                t[3] || (t[3] = s("span", {
                  class: "work-process-cell-label",
                  "aria-hidden": "true"
                }, "From", -1)),
                B(" " + D(l.from === "any" ? "Any state" : l.from.map((o) => r(he)(e.process.states.find((d) => d.id === o))).join(", ")), 1)
              ]),
              s("td", Ld, [
                t[4] || (t[4] = s("span", {
                  class: "work-process-cell-label",
                  "aria-hidden": "true"
                }, "To", -1)),
                B(D(r(he)(e.process.states.find((o) => o.id === l.to))), 1)
              ]),
              s("td", Bd, [
                h(r(_), {
                  size: "small",
                  text: "",
                  severity: "secondary",
                  "aria-label": "Edit transition " + r(je)(l),
                  onClick: (o) => a.$emit("transition", l, o.currentTarget)
                }, {
                  default: K(() => [
                    h(r(de), { icon: "tabler:pencil" })
                  ]),
                  _: 1
                }, 8, ["aria-label", "onClick"]),
                h(r(_), {
                  size: "small",
                  text: "",
                  severity: "danger",
                  "aria-label": "Remove transition " + r(je)(l),
                  onClick: (o) => a.$emit("removeTransition", l)
                }, {
                  default: K(() => [
                    h(r(de), { icon: "tabler:trash" })
                  ]),
                  _: 1
                }, 8, ["aria-label", "onClick"])
              ])
            ], 8, Rd))), 128))
          ])
        ])
      ])
    ]));
  }
}), jd = { class: "work-stack work-transition-settings" }, Wd = { class: "work-stack work-tight" }, qd = { class: "work-row" }, Kd = { key: 0 }, Gd = { class: "work-stack" }, Hd = { class: "work-row" }, Yd = { class: "work-row" }, Xd = { class: "work-stack work-tight" }, Jd = { class: "work-row" }, Zd = { class: "work-stack work-tight" }, Qd = { class: "work-stack work-tight" }, _d = /* @__PURE__ */ ye({
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
    function d(f, m) {
      const u = t.transition.set?.[f];
      !u || !t.transition.set || (t.transition.set[f] = { field: u.field, ...m === "clear" ? { clear: !0 } : m === "copy" ? { copy: "" } : { value: "" } });
    }
    return (f, m) => (n(), b("div", jd, [
      s("label", Wd, [
        m[15] || (m[15] = B("To state", -1)),
        h(r(me), {
          modelValue: e.transition.to,
          "onUpdate:modelValue": m[0] || (m[0] = (u) => e.transition.to = u),
          "aria-label": "To state",
          appendTo: "self",
          optionLabel: "label",
          optionValue: "value",
          options: e.process.states.map((u) => ({ label: r(he)(u), value: u.id }))
        }, null, 8, ["modelValue", "options"])
      ]),
      s("label", qd, [
        m[16] || (m[16] = s("span", { class: "work-spacer" }, "Works from any state", -1)),
        h(r(_e), {
          "model-value": e.transition.from === "any",
          "aria-label": "Works from any state",
          "onUpdate:modelValue": m[1] || (m[1] = (u) => e.transition.from = u ? "any" : [])
        }, null, 8, ["model-value"])
      ]),
      e.transition.from !== "any" ? (n(), J(mt, {
        key: 0,
        label: "From states",
        options: e.process.states.map((u) => ({ value: u.id, label: r(he)(u) })),
        modelValue: e.transition.from,
        "onUpdate:modelValue": m[2] || (m[2] = (u) => e.transition.from = u)
      }, null, 8, ["options", "modelValue"])) : I("", !0),
      m[24] || (m[24] = s("h4", { class: "work-process-group" }, "Must be filled", -1)),
      h(mt, {
        label: "Required fields",
        options: e.draft.fields?.map((u) => ({ value: u.code, label: u.title || u.code })) ?? [],
        modelValue: e.transition.require,
        "onUpdate:modelValue": m[3] || (m[3] = (u) => e.transition.require = u)
      }, null, 8, ["options", "modelValue"]),
      m[25] || (m[25] = s("h4", { class: "work-process-group" }, "Only when", -1)),
      h(zl, {
        label: "Allow this transition when",
        draft: e.draft,
        "board-id": e.boardId,
        "model-value": e.transition.when,
        "onUpdate:modelValue": m[4] || (m[4] = (u) => e.transition.when = u),
        onValidity: m[5] || (m[5] = (u) => l("validity", "when", u))
      }, null, 8, ["draft", "board-id", "model-value"]),
      e.guards?.length || e.transition.guards?.length ? (n(), J(mt, {
        key: 1,
        label: "Installed checks",
        options: [...(e.guards ?? []).map((u) => ({ value: u.id, label: u.title })), ...(e.transition.guards ?? []).filter((u) => !e.guards?.some((i) => i.id === u)).map((u) => ({ value: u, label: e.guards ? "Unavailable check" : "Configured check" }))],
        modelValue: e.transition.guards,
        "onUpdate:modelValue": m[6] || (m[6] = (u) => e.transition.guards = u)
      }, null, 8, ["options", "modelValue"])) : I("", !0),
      (n(!0), b(te, null, se(e.guards?.filter((u) => e.transition.guards?.includes(u.id)) ?? [], (u) => (n(), b("p", {
        key: u.id,
        class: "work-muted work-small"
      }, [
        B(D(u.description || u.title + " can stop this transition.") + " ", 1),
        u.reads?.length ? (n(), b("span", Kd, " Checks " + D(u.reads.map((i) => e.draft.fields?.find((c) => c.code === i)?.title || "a configured field").join(", ")) + ".", 1)) : I("", !0)
      ]))), 128)),
      h(ze, {
        class: "work-disclosure",
        label: "Advanced transition settings"
      }, {
        default: K(() => [
          s("div", Gd, [
            s("label", Hd, [
              m[17] || (m[17] = s("span", { class: "work-spacer" }, "Happens automatically", -1)),
              h(r(_e), {
                "model-value": e.transition.auto,
                "onUpdate:modelValue": m[7] || (m[7] = (u) => {
                  e.transition.auto = u, u || delete e.transition.default;
                }),
                "aria-label": "Automatic transition"
              }, null, 8, ["model-value"])
            ]),
            s("label", Yd, [
              m[18] || (m[18] = s("span", { class: "work-spacer" }, "Default automatic transition", -1)),
              h(r(_e), {
                modelValue: e.transition.default,
                "onUpdate:modelValue": m[8] || (m[8] = (u) => e.transition.default = u),
                disabled: !e.transition.auto,
                "aria-label": "Default transition"
              }, null, 8, ["modelValue", "disabled"])
            ]),
            m[23] || (m[23] = s("h4", { class: "work-process-group" }, "Also sets", -1)),
            (n(!0), b(te, null, se(e.transition.set ?? [], (u, i) => (n(), b("div", {
              key: i,
              class: "work-process-value work-stack work-tight"
            }, [
              s("label", Xd, [
                m[19] || (m[19] = B("Field", -1)),
                h(r(me), {
                  modelValue: u.field,
                  "onUpdate:modelValue": (c) => u.field = c,
                  appendTo: "self",
                  optionLabel: "label",
                  optionValue: "value",
                  options: e.draft.fields?.map((c) => ({ value: c.code, label: c.title || c.code })) ?? []
                }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
              ]),
              s("div", Jd, [
                h(r(me), {
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
                  "onUpdate:modelValue": (c) => d(i, c)
                }, null, 8, ["model-value", "onUpdate:modelValue"]),
                h(r(_), {
                  text: "",
                  severity: "danger",
                  "aria-label": "Remove value " + (i + 1),
                  onClick: (c) => e.transition.set?.splice(i, 1)
                }, {
                  default: K(() => [
                    h(r(de), { icon: "tabler:trash" })
                  ]),
                  _: 1
                }, 8, ["aria-label", "onClick"])
              ]),
              u.copy !== void 0 ? (n(), J(r(me), {
                key: 0,
                modelValue: u.copy,
                "onUpdate:modelValue": (c) => u.copy = c,
                "aria-label": "Copy from field",
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                options: e.draft.fields?.map((c) => ({ value: c.code, label: c.title || c.code })) ?? []
              }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])) : u.clear ? I("", !0) : (n(!0), b(te, { key: 1 }, se(e.draft.fields?.filter((c) => c.code === u.field) ?? [], (c) => (n(), J(Fo, {
                key: c.code,
                "board-id": e.boardId ?? "",
                field: c,
                modelValue: u.value,
                "onUpdate:modelValue": (p) => u.value = p,
                onValidity: (p) => l("validity", "effect-" + i, p)
              }, null, 8, ["board-id", "field", "modelValue", "onUpdate:modelValue", "onValidity"]))), 128))
            ]))), 128)),
            h(r(_), {
              label: "Add value",
              severity: "secondary",
              outlined: "",
              size: "small",
              onClick: o
            }, {
              icon: K(() => [
                h(r(de), { icon: "tabler:plus" })
              ]),
              _: 1
            }),
            s("label", Zd, [
              m[20] || (m[20] = B("Offer to people", -1)),
              h(r(me), {
                "model-value": e.transition.people,
                "aria-label": "Offer to people",
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                options: [{ label: "Work default", value: void 0 }, { label: "Offer explicitly", value: !0 }, { label: "Process engine only", value: !1 }],
                "onUpdate:modelValue": m[9] || (m[9] = (u) => e.transition.people = u)
              }, null, 8, ["model-value"]),
              m[21] || (m[21] = s("span", { class: "work-muted work-small" }, "Work default can hide a stage route from the list while still allowing it by name. Process engine only reserves the route for the engine and board administrators using force.", -1))
            ]),
            s("label", Qd, [
              m[22] || (m[22] = B("Evaluation order", -1)),
              h(r($t), {
                "model-value": e.transition.order ?? null,
                "aria-label": "Transition order",
                min: 0,
                useGrouping: !1,
                "onUpdate:modelValue": m[10] || (m[10] = (u) => e.transition.order = u ?? void 0)
              }, null, 8, ["model-value"])
            ]),
            h(Ot, {
              label: "Set values",
              "model-value": e.transition.set,
              shape: "array",
              "onUpdate:modelValue": m[11] || (m[11] = (u) => e.transition.set = u),
              onValidity: m[12] || (m[12] = (u) => l("validity", "set", u))
            }, null, 8, ["model-value"]),
            h(Ot, {
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
}), ko = /* @__PURE__ */ ye({
  __name: "CapacityControl",
  props: {
    draft: {},
    state: {},
    label: {},
    hard: { type: Boolean }
  },
  setup(e) {
    const a = e, t = L(() => a.draft.policy?.wip?.[a.state]);
    function l(d) {
      if (d === null) {
        a.draft.policy?.wip && delete a.draft.policy.wip[a.state];
        return;
      }
      const f = a.draft.policy ??= {}, m = f.wip ??= {};
      m[a.state] = { ...m[a.state], limit: d };
    }
    function o(d) {
      t.value && (t.value.hard = d);
    }
    return (d, f) => e.hard ? (n(), J(r(_e), {
      key: 0,
      "aria-label": e.label,
      disabled: !t.value,
      "model-value": t.value?.hard ?? !1,
      "onUpdate:modelValue": o
    }, null, 8, ["aria-label", "disabled", "model-value"])) : (n(), J(r($t), {
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
async function Tl(e, a) {
  try {
    const { data: t } = await Dl.get(e, a ? { params: a } : void 0);
    if (!t?.success) {
      const l = t?.message || (typeof t?.error == "string" ? t.error : t?.error?.message) || "Could not read published Flow.";
      throw new Il({ message: l, details: t?.details }, "Published Flow");
    }
    return t;
  } catch (t) {
    throw Ui(t, "Published Flow");
  }
}
const wo = (e) => `/api/v1/workflows/${encodeURIComponent(e)}/versions`, Nl = {
  title: async (e) => (await Tl("/api/v1/workflows/published", { id: e })).item?.title,
  versions: async (e) => (await Tl(wo(e))).versions ?? [],
  check: async (e) => {
    if ((await Tl(`${wo(e.id)}/${e.version}`)).version?.version !== e.version) throw new Error("The published version is unavailable.");
  }
}, eu = {
  class: "work-stack work-tight",
  "aria-label": "Stage Flow"
}, tu = {
  key: 0,
  class: "work-muted work-small"
}, au = {
  key: 1,
  class: "kx-err work-alert-actions"
}, lu = { role: "alert" }, ou = ["schema", "config", "title"], iu = {
  key: 3,
  class: "kx-err",
  role: "alert"
}, nu = {
  key: 4,
  class: "work-stack work-tight"
}, su = ["value", "aria-busy", "disabled"], ru = {
  value: "",
  disabled: ""
}, du = ["value"], uu = {
  key: 5,
  class: "work-muted work-small",
  role: "status"
}, cu = /* @__PURE__ */ ye({
  __name: "StageFlow",
  props: {
    modelValue: {}
  },
  emits: ["update:modelValue", "validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = M(!1), d = M(""), f = M([]), m = M(!1), u = M(""), i = M(!1), c = L(() => d.value || t.modelValue?.id), p = JSON.stringify({ properties: { flow_ref: { title: "Published Flow", picker: "wc-workflow-picker" } } }), x = L(() => JSON.stringify(t.modelValue ? { flow_ref: t.modelValue } : {}));
    let y = 0;
    async function S() {
      o.value = await At("wc-workflow-picker");
    }
    S();
    async function w() {
      const k = ++y, C = c.value, H = t.modelValue;
      if (m.value = !!C, u.value = "", f.value = [], !!C)
        try {
          const [P] = await Promise.all([Nl.versions(C), !i.value && H ? Nl.check(H) : Promise.resolve()]);
          if (k !== y) return;
          if (f.value = P.filter((G) => Number.isInteger(G.version) && G.version > 0), !i.value && H && !f.value.some((G) => G.version === H.version)) throw new Error("The published version is unavailable.");
        } catch (P) {
          k === y && (u.value = ot(P, "Could not read published Flow."));
        } finally {
          k === y && (m.value = !1);
        }
    }
    Te([c, () => t.modelValue?.version, i], w, { immediate: !0 }), Te(i, (k) => l("validity", !k), { immediate: !0 });
    function A(k) {
      const C = k.detail?.flow_ref;
      C?.kind !== "flow" || !C.id || (i.value = !0, d.value = C.id);
    }
    function $(k) {
      !c.value || !f.value.some((C) => C.version === k) || (l("update:modelValue", { kind: "flow", id: c.value, version: k }), i.value = !1, d.value = "");
    }
    function g() {
      l("update:modelValue", void 0), i.value = !1, d.value = "";
    }
    return St(() => {
      y++, l("validity", !0);
    }), (k, C) => (n(), b("section", eu, [
      C[4] || (C[4] = s("h4", { class: "work-field-label" }, "What runs", -1)),
      e.modelValue ? I("", !0) : (n(), b("p", tu, "No Flow bound. This stage keeps its existing external execution contract.")),
      u.value ? (n(), b("div", au, [
        s("p", lu, [
          B(D(i.value ? "Flow versions unavailable" : "Flow binding unavailable"), 1),
          !i.value && e.modelValue ? (n(), b(te, { key: 0 }, [
            B(" (v" + D(e.modelValue.version) + ")", 1)
          ], 64)) : I("", !0),
          B(". " + D(u.value), 1)
        ]),
        h(r(_), {
          label: "Reload Flow",
          severity: "secondary",
          text: "",
          onClick: w
        })
      ])) : I("", !0),
      o.value ? (n(), b("wc-workflow-picker", {
        key: 2,
        schema: r(p),
        config: x.value,
        title: e.modelValue?.id,
        onChange: A
      }, null, 40, ou)) : (n(), b("p", iu, [
        C[2] || (C[2] = B("Published Flow picker unavailable.", -1)),
        h(r(_), {
          label: "Reload Flow picker",
          text: "",
          severity: "secondary",
          onClick: S
        })
      ])),
      c.value ? (n(), b("label", nu, [
        C[3] || (C[3] = B(" Published version ", -1)),
        s("select", {
          class: "p-inputtext work-flow-version",
          value: i.value ? "" : e.modelValue?.version,
          "aria-busy": m.value,
          disabled: m.value || !!u.value,
          onChange: C[0] || (C[0] = (H) => $(Number(H.target.value)))
        }, [
          s("option", ru, D(m.value ? "Loading versions…" : "Choose a published version"), 1),
          (n(!0), b(te, null, se(f.value, (H) => (n(), b("option", {
            key: H.version,
            value: H.version
          }, "v" + D(H.version), 9, du))), 128))
        ], 40, su)
      ])) : I("", !0),
      i.value ? (n(), b("p", uu, "Choose a published version to finish selecting the Flow.")) : I("", !0),
      e.modelValue || i.value ? (n(), J(r(_), {
        key: 6,
        label: i.value ? "Cancel Flow selection" : "Remove Flow binding",
        "aria-label": i.value ? "Cancel Flow selection" : "Remove Flow binding",
        severity: "secondary",
        text: "",
        onClick: C[1] || (C[1] = (H) => i.value ? (i.value = !1, d.value = "") : g())
      }, null, 8, ["label", "aria-label"])) : I("", !0)
    ]));
  }
}), Ml = { seconds: 1, minutes: 60, hours: 3600, days: 86400 };
function ga(e, a) {
  const t = /^P(\d+)W$/.exec(e), l = /^P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+\.?\d*)S)?)?$/.exec(e);
  if (!t && (!l || e === "P" || e.endsWith("T"))) return;
  const o = t ? Number(t[1]) * 604800 : Number(l[1] ?? 0) * 86400 + Number(l[2] ?? 0) * 3600 + Number(l[3] ?? 0) * 60 + Number(l[4] ?? 0);
  if (!Number.isFinite(o) || o <= 0) return;
  const d = a ?? (o % 86400 === 0 ? "days" : o % 3600 === 0 ? "hours" : o < 60 ? "seconds" : "minutes");
  return { amount: o / Ml[d], unit: d };
}
function vu(e, a) {
  if (e == null) return;
  if (!Number.isFinite(e * Ml[a]) || e <= 0) throw new Error("Enter a positive duration.");
  const t = (o) => o.toLocaleString("en-US", { useGrouping: !1, maximumSignificantDigits: 21 });
  if (!Number.isInteger(e)) return `PT${t(e * Ml[a])}S`;
  const l = { seconds: "S", minutes: "M", hours: "H", days: "D" }[a];
  return (a === "days" ? "P" : "PT") + t(e) + l;
}
const mu = { class: "work-stack work-tight" }, fu = {
  key: 0,
  class: "work-error",
  role: "alert"
}, Wt = /* @__PURE__ */ ye({
  __name: "DurationControl",
  props: {
    modelValue: {},
    label: {},
    disabled: { type: Boolean }
  },
  emits: ["update:modelValue", "validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = "duration:" + el(), d = M(), f = M(""), m = L(() => t.modelValue ? ga(t.modelValue) : void 0), u = L(() => d.value ?? m.value?.unit ?? "days");
    Te(() => t.modelValue, ($) => {
      f.value = "", l("validity", !$ || !!m.value, o);
    }, { immediate: !0 });
    const i = L(() => t.modelValue ? ga(t.modelValue, u.value)?.amount ?? null : null);
    function c($) {
      try {
        const g = vu($, u.value);
        f.value = "", l("update:modelValue", g), l("validity", !0, o);
      } catch (g) {
        f.value = g.message, l("validity", !1, o);
      }
    }
    let p;
    function x($) {
      $.target instanceof HTMLInputElement && (p = $.target.value);
    }
    function y($) {
      if (p === void 0) return;
      const g = p;
      p = void 0, w($, g);
    }
    function S($) {
      p = void 0;
      const g = $.originalEvent?.target instanceof HTMLInputElement ? $.originalEvent.target.value : $.formattedValue;
      w($.value, g);
    }
    function w($, g) {
      if (g.trim() && (typeof $ != "number" || !Number.isFinite($))) {
        f.value = "Enter a positive duration.", l("validity", !1, o);
        return;
      }
      d.value = u.value, c(typeof $ == "number" ? $ : null);
    }
    function A($) {
      const g = i.value;
      d.value = $, !(t.modelValue && !m.value) && c(g);
    }
    return St(() => l("validity", !0, o)), ($, g) => (n(), b("label", mu, [
      B(D(e.label), 1),
      s("span", {
        class: "work-duration-control",
        style: { "max-width": "360px" },
        onInputCapture: x
      }, [
        h(r($t), {
          "model-value": i.value,
          "aria-label": e.label,
          min: 0,
          "aria-invalid": !!f.value || !!e.modelValue && !r(ga)(e.modelValue),
          disabled: e.disabled,
          useGrouping: !1,
          "max-fraction-digits": u.value === "seconds" ? 20 : 3,
          onInput: S,
          "onUpdate:modelValue": y
        }, null, 8, ["model-value", "aria-label", "aria-invalid", "disabled", "max-fraction-digits"]),
        h(r(me), {
          "model-value": u.value,
          "aria-label": e.label + " unit",
          disabled: e.disabled,
          options: [{ label: "Seconds", value: "seconds" }, { label: "Minutes", value: "minutes" }, { label: "Hours", value: "hours" }, { label: "Days", value: "days" }],
          optionLabel: "label",
          optionValue: "value",
          appendTo: "self",
          "onUpdate:modelValue": g[0] || (g[0] = (k) => A(k))
        }, null, 8, ["model-value", "aria-label", "disabled"])
      ], 32),
      f.value || e.modelValue && !r(ga)(e.modelValue) ? (n(), b("span", fu, D(f.value || `Unsupported duration: ${e.modelValue}`), 1)) : I("", !0)
    ]));
  }
}), pu = { class: "work-stack" }, bu = { class: "work-settings-grid" }, hu = { class: "work-stack work-tight" }, gu = { class: "work-stack work-tight" }, yu = {
  key: 1,
  class: "work-stack work-tight"
}, ku = { class: "work-stack work-tight" }, wu = { class: "work-settings-grid" }, Vu = { class: "work-row" }, $u = { class: "work-stack work-tight" }, xu = {
  key: 0,
  class: "work-stack work-tight"
}, Cu = /* @__PURE__ */ ye({
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
      i.push({ id: jt("timer", i), after: "P1D", then: { emit: "reminder" } });
    }
    function f(i, c) {
      delete i.after, delete i.at_field, c === "after" ? i.after = "P1D" : i.at_field = "";
    }
    function m(i, c, p) {
      p ? i[c] = p : (delete i[c], delete i.table);
    }
    function u(i, c) {
      i.then = c === "emit" ? { emit: "" } : { transition: "" };
    }
    return (i, c) => (n(), b("section", pu, [
      c[8] || (c[8] = s("h4", null, "Timers", -1)),
      (n(!0), b(te, null, se(o(), (p, x) => (n(), b("article", {
        key: p.id,
        class: "work-settings-card work-stack"
      }, [
        s("div", bu, [
          s("label", hu, [
            c[2] || (c[2] = B("Timer ID", -1)),
            h(r(ge), {
              modelValue: p.id,
              "onUpdate:modelValue": (y) => p.id = y,
              required: "",
              pattern: "[a-z][a-z0-9_]*"
            }, null, 8, ["modelValue", "onUpdate:modelValue"])
          ]),
          s("label", gu, [
            c[3] || (c[3] = B("Deadline", -1)),
            h(r(me), {
              "model-value": p.at_field !== void 0 ? "at_field" : "after",
              "onUpdate:modelValue": (y) => f(p, y),
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
          p.after !== void 0 ? (n(), J(Wt, {
            key: 0,
            modelValue: p.after,
            "onUpdate:modelValue": (y) => p.after = y,
            label: "After",
            onValidity: c[0] || (c[0] = (y, S) => l("validity", S, y))
          }, null, 8, ["modelValue", "onUpdate:modelValue"])) : (n(), b("label", yu, [
            c[4] || (c[4] = B("At field", -1)),
            h(r(me), {
              modelValue: p.at_field,
              "onUpdate:modelValue": (y) => p.at_field = y,
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
          s("label", ku, [
            c[5] || (c[5] = B("Duration by field", -1)),
            h(r(me), {
              "model-value": p.by ?? "",
              "onUpdate:modelValue": (y) => m(p, "by", y),
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
        p.by ? (n(), J(Ot, {
          key: 0,
          label: "Duration table",
          hint: "Map field values to ISO durations.",
          "model-value": p.table,
          shape: "object",
          "onUpdate:modelValue": (y) => p.table = y,
          onValidity: (y) => l("validity", "table-" + x, y)
        }, null, 8, ["model-value", "onUpdate:modelValue", "onValidity"])) : I("", !0),
        s("div", wu, [
          h(Wt, {
            modelValue: p.repeat,
            "onUpdate:modelValue": (y) => p.repeat = y,
            label: "Repeat every",
            onValidity: c[1] || (c[1] = (y, S) => l("validity", S, y)),
            disabled: p.interrupting
          }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"]),
          s("label", Vu, [
            h(r(Kt), {
              modelValue: p.interrupting,
              "onUpdate:modelValue": [(y) => p.interrupting = y, (y) => p.interrupting && delete p.repeat],
              binary: ""
            }, null, 8, ["modelValue", "onUpdate:modelValue"]),
            c[6] || (c[6] = B("Interrupting", -1))
          ]),
          s("label", $u, [
            c[7] || (c[7] = B("Then", -1)),
            h(r(me), {
              "model-value": p.then?.transition !== void 0 ? "transition" : "emit",
              "onUpdate:modelValue": (y) => u(p, y),
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
          p.then ? (n(), b("label", xu, [
            B(D(p.then.transition !== void 0 ? "Transition ID" : "Event name"), 1),
            p.then.transition !== void 0 ? (n(), J(r(ge), {
              key: 0,
              modelValue: p.then.transition,
              "onUpdate:modelValue": (y) => p.then.transition = y
            }, null, 8, ["modelValue", "onUpdate:modelValue"])) : (n(), J(r(ge), {
              key: 1,
              modelValue: p.then.emit,
              "onUpdate:modelValue": (y) => p.then.emit = y
            }, null, 8, ["modelValue", "onUpdate:modelValue"]))
          ])) : I("", !0)
        ]),
        h(r(_), {
          severity: "secondary",
          onClick: (y) => o().splice(x, 1),
          "aria-label": "Remove timer",
          text: "",
          size: "small"
        }, {
          default: K(() => [
            h(r(de), {
              icon: "tabler:trash",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        }, 8, ["onClick"])
      ]))), 128)),
      h(r(_), {
        label: "Add timer",
        severity: "secondary",
        onClick: d,
        outlined: ""
      }, {
        icon: K(() => [
          h(r(de), {
            icon: "tabler:plus",
            "aria-hidden": "true"
          })
        ]),
        _: 1
      })
    ]));
  }
}), Su = ["aria-label"], Tu = { class: "work-stack work-tight" }, Iu = {
  key: 0,
  class: "work-stack work-tight"
}, Uu = /* @__PURE__ */ ye({
  __name: "PrincipalSourceEditor",
  props: {
    modelValue: {},
    draft: {},
    boardId: {},
    label: {}
  },
  emits: ["update:modelValue", "validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = L(() => Array.isArray(t.modelValue) ? "principals" : "field" in t.modelValue ? "field" : "group"), d = L(() => Array.isArray(t.modelValue) ? t.modelValue : "group" in t.modelValue && t.modelValue.group ? [{ kind: "group", id: t.modelValue.group }] : []);
    function f(u) {
      l("update:modelValue", u === "field" ? { field: "" } : u === "group" ? { group: "" } : []);
    }
    function m(u) {
      l("update:modelValue", o.value === "group" ? { group: u.at(-1)?.id ?? "" } : u);
    }
    return Uo(() => l("validity", Array.isArray(t.modelValue) ? t.modelValue.length > 0 : "field" in t.modelValue ? !!t.modelValue.field : !!t.modelValue.group)), St(() => l("validity", !0)), (u, i) => (n(), b("section", {
      class: "work-stack work-tight",
      "aria-label": e.label
    }, [
      s("label", Tu, [
        B(D(e.label) + " source", 1),
        h(r(me), {
          "model-value": o.value,
          "aria-label": e.label + " source",
          options: [{ label: "Group", value: "group" }, { label: "People and groups", value: "principals" }, { label: "Principal field", value: "field" }],
          optionLabel: "label",
          optionValue: "value",
          appendTo: "self",
          "onUpdate:modelValue": f
        }, null, 8, ["model-value", "aria-label"])
      ]),
      "field" in e.modelValue ? (n(), b("label", Iu, [
        i[1] || (i[1] = B("Principal field", -1)),
        h(r(me), {
          "model-value": e.modelValue.field,
          "aria-label": e.label + " field",
          options: e.draft.fields?.filter((c) => c.type === "principal").map((c) => ({ label: c.title || c.code, value: c.code })) ?? [],
          optionLabel: "label",
          optionValue: "value",
          appendTo: "self",
          "onUpdate:modelValue": i[0] || (i[0] = (c) => l("update:modelValue", { field: c }))
        }, null, 8, ["model-value", "aria-label", "options"])
      ])) : (n(), J(jl, {
        key: 1,
        "board-id": e.boardId,
        label: e.label,
        kinds: o.value === "group" ? "group" : "user,group,service",
        "model-value": d.value,
        "onUpdate:modelValue": m
      }, null, 8, ["board-id", "label", "kinds", "model-value"]))
    ], 8, Su));
  }
}), Du = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, Eu = {
  class: "work-stack work-tight",
  "aria-label": "Approval sources"
}, Au = { class: "work-row" }, Ou = {
  key: 0,
  class: "work-stack work-tight"
}, Pu = ["kinds", "value"], Ru = {
  key: 2,
  class: "work-muted work-small",
  role: "status"
}, Nu = {
  key: 3,
  class: "work-chips"
}, Mu = { class: "work-row work-small" }, Fu = { class: "work-stack work-tight" }, Lu = {
  key: 4,
  class: "work-error work-small",
  role: "alert"
}, Bu = {
  key: 5,
  class: "work-muted work-small"
}, zu = /* @__PURE__ */ ye({
  __name: "ApproversEditor",
  props: {
    approvals: {},
    boardId: {}
  },
  emits: ["validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, { principalLabel: o, rememberPrincipal: d, nameError: f } = Do(() => t.boardId ?? "", () => Array.isArray(t.approvals.from) ? t.approvals.from : "group" in t.approvals.from ? [{ kind: "group", id: t.approvals.from.group }] : []), m = M(!1), u = L(() => Array.isArray(t.approvals.from) ? "principals" : "field" in t.approvals.from ? "field" : "group"), i = L(() => Array.isArray(t.approvals.from) ? t.approvals.from.some((y) => y.kind === "group") || t.approvals.from.length >= t.approvals.min : "field" in t.approvals.from ? !!t.approvals.from.field : !!t.approvals.from.group);
    Uo(() => l("validity", Number.isSafeInteger(t.approvals.min) && t.approvals.min > 0 && i.value)), St(() => l("validity", !0)), Ia(async () => {
      m.value = await At("wc-principal-picker");
    });
    function c(y) {
      t.approvals.from = y === "group" ? { group: "" } : y === "field" ? { field: "" } : [];
    }
    function p(y) {
      const S = y.detail, w = S?.principal_id ?? S?.id;
      if (u.value === "group") {
        t.approvals.from = { group: w ?? "" };
        return;
      }
      if (!w || !Array.isArray(t.approvals.from)) return;
      const A = { kind: S.type ?? S.kind ?? "user", id: w };
      S.label && d(A, S.label), t.approvals.from.some(($) => $.id === w && $.kind === A.kind) || t.approvals.from.push(A);
    }
    function x(y) {
      Array.isArray(t.approvals.from) && t.approvals.from.splice(y, 1);
    }
    return (y, S) => (n(), b(te, null, [
      r(f) ? (n(), b("p", Du, D(r(f)), 1)) : I("", !0),
      s("section", Eu, [
        s("label", Au, [
          S[4] || (S[4] = s("span", { class: "work-spacer" }, "Approvals needed", -1)),
          h(r($t), {
            modelValue: e.approvals.min,
            "onUpdate:modelValue": S[0] || (S[0] = (w) => e.approvals.min = w),
            min: 1,
            required: "",
            useGrouping: !1
          }, null, 8, ["modelValue"])
        ]),
        S[8] || (S[8] = s("span", { class: "work-field-label" }, "Approvers", -1)),
        "field" in e.approvals.from ? (n(), b("label", Ou, [
          S[5] || (S[5] = B("Principal field", -1)),
          h(r(ge), {
            modelValue: e.approvals.from.field,
            "onUpdate:modelValue": S[1] || (S[1] = (w) => e.approvals.from.field = w),
            "aria-label": "Principal field"
          }, null, 8, ["modelValue"])
        ])) : m.value ? (n(), b("wc-principal-picker", {
          key: u.value,
          kinds: u.value === "group" ? "group" : "user,group,service",
          value: JSON.stringify("group" in e.approvals.from ? { type: "group", principal_id: e.approvals.from.group } : {}),
          onConfigChanged: p
        }, null, 40, Pu)) : (n(), b("p", Ru, "The principal picker is unavailable.")),
        Array.isArray(e.approvals.from) ? (n(), b("div", Nu, [
          (n(!0), b(te, null, se(e.approvals.from, (w, A) => (n(), J(r(We), {
            key: w.kind + ":" + w.id,
            class: "kx-tag-sm",
            severity: "secondary"
          }, {
            default: K(() => [
              B(D(r(o)(w)), 1),
              h(r(_), {
                "aria-label": "Remove approver " + (A + 1),
                text: "",
                severity: "secondary",
                size: "small",
                onClick: ($) => x(A)
              }, {
                default: K(() => [
                  h(r(de), {
                    icon: "tabler:x",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["aria-label", "onClick"])
            ]),
            _: 2
          }, 1024))), 128))
        ])) : I("", !0),
        s("label", Mu, [
          S[6] || (S[6] = s("span", { class: "work-spacer" }, "The person who moves the item here cannot approve this visit", -1)),
          h(r(_e), {
            modelValue: e.approvals.prevent_self,
            "onUpdate:modelValue": S[2] || (S[2] = (w) => e.approvals.prevent_self = w),
            "aria-label": "The person who moves the item here cannot approve this visit"
          }, null, 8, ["modelValue"])
        ]),
        h(ze, {
          class: "work-process-options",
          label: "Approval options"
        }, {
          default: K(() => [
            s("label", Fu, [
              S[7] || (S[7] = B("Approval source", -1)),
              h(r(me), {
                "model-value": u.value,
                "onUpdate:modelValue": S[3] || (S[3] = (w) => c(w)),
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                options: [{ label: "Group members", value: "group" }, { label: "People and groups", value: "principals" }, { label: "Principal field", value: "field" }]
              }, null, 8, ["model-value"])
            ])
          ]),
          _: 1
        }),
        Array.isArray(e.approvals.from) && !i.value ? (n(), b("p", Lu, "Select at least " + D(e.approvals.min) + " distinct principals, or lower the minimum.", 1)) : "group" in e.approvals.from && !e.approvals.from.group ? (n(), b("p", Bu, "Choose the group that can approve this state.")) : I("", !0)
      ])
    ], 64));
  }
}), ju = {
  class: "work-state-settings work-stack",
  "aria-label": "State settings"
}, Wu = { class: "work-process-kind" }, qu = { class: "work-row" }, Ku = { class: "work-row" }, Gu = { class: "work-stack" }, Hu = { class: "work-row" }, Yu = { class: "work-stack work-tight" }, Xu = { class: "work-row" }, Ju = { class: "work-stack work-tight" }, Zu = { class: "work-row" }, Qu = { class: "work-row" }, _u = { class: "work-stack work-tight" }, ec = { class: "work-stack" }, tc = { class: "work-row" }, ac = { class: "work-row" }, lc = { class: "work-stack work-tight" }, oc = { class: "work-stack work-tight" }, ic = {
  key: 0,
  class: "work-row"
}, nc = { class: "work-stack" }, sc = { class: "work-stack work-tight" }, rc = { class: "work-row" }, dc = /* @__PURE__ */ ye({
  __name: "StateSettings",
  props: {
    state: {},
    process: {},
    draft: {},
    boardId: {}
  },
  emits: ["validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = L(() => (t.process.transitions ?? []).filter((u) => u.from === "any" || u.from.includes(t.state.id))), d = [{ value: "human", icon: "user" }, { value: "gate", icon: "shield-check" }, { value: "automated", icon: "bolt" }, { value: "parallel", icon: "arrows-split" }];
    function f(u) {
      const i = t.state;
      i.kind = u, delete i.run, delete i.release_when, delete i.regions, delete i.join, delete i.due, (u === "automated" || u === "gate") && delete i.awaiting, u === "automated" && (i.run = { stage: i.id, retry: { max: 1, backoff: "PT1M" } }), u === "gate" && (i.release_when = { approvals: { min: 1, from: { group: "" }, prevent_self: !0 } }), u === "parallel" && (i.regions = [{ id: "region_1", initial: t.process.states.find((c) => c.id !== i.id)?.id ?? "" }], i.join = "all");
    }
    function m(u) {
      t.state.run && (u ? t.state.run.on_fail = u : delete t.state.run.on_fail);
    }
    return (u, i) => (n(), b("section", ju, [
      i[57] || (i[57] = s("h4", { class: "work-process-group" }, "Who moves the item on", -1)),
      h(r(Ll), {
        class: "work-process-kinds",
        "model-value": e.state.kind ?? "human",
        options: d.map((c) => ({
          ...c,
          label: r(Ha)(c.value)
        })),
        optionLabel: "label",
        optionValue: "value",
        optionDisabled: "disabled",
        "allow-empty": !1,
        "aria-label": "Who moves the item on",
        "onUpdate:modelValue": f
      }, {
        option: K(({ option: c }) => [
          s("span", Wu, [
            h(r(de), {
              icon: "tabler:" + c.icon
            }, null, 8, ["icon"]),
            s("span", null, D(c.label), 1)
          ])
        ]),
        _: 1
      }, 8, ["model-value", "options"]),
      i[58] || (i[58] = s("h4", { class: "work-process-group" }, "Limit", -1)),
      s("label", qu, [
        i[34] || (i[34] = s("span", { class: "work-spacer" }, "Items allowed here", -1)),
        h(ko, {
          draft: e.draft,
          state: e.state.id,
          label: "Items allowed here"
        }, null, 8, ["draft", "state"])
      ]),
      s("label", Ku, [
        i[35] || (i[35] = s("span", { class: "work-spacer" }, [
          B("Refuse moves over the limit"),
          s("small", { class: "work-muted work-block" }, "Off only warns")
        ], -1)),
        h(ko, {
          draft: e.draft,
          state: e.state.id,
          label: "Refuse moves over the limit",
          hard: ""
        }, null, 8, ["draft", "state"])
      ]),
      i[59] || (i[59] = s("h4", { class: "work-process-group" }, "Required on entry", -1)),
      h(mt, {
        label: "Required fields",
        options: e.draft.fields?.map((c) => ({ value: c.code, label: c.title || c.code })) ?? [],
        modelValue: e.state.require,
        "onUpdate:modelValue": i[0] || (i[0] = (c) => e.state.require = c)
      }, null, 8, ["options", "modelValue"]),
      !e.state.kind || e.state.kind === "human" ? (n(), J(Wt, {
        key: 0,
        modelValue: e.state.due,
        "onUpdate:modelValue": i[1] || (i[1] = (c) => e.state.due = c),
        label: "Time allowed in this state",
        onValidity: i[2] || (i[2] = (c, p) => l("validity", p, c))
      }, null, 8, ["modelValue"])) : I("", !0),
      e.state.kind === "gate" && e.state.release_when ? (n(), b(te, { key: 1 }, [
        i[37] || (i[37] = s("h4", { class: "work-process-group" }, "Approval", -1)),
        e.state.release_when.approvals ? (n(), J(zu, {
          key: 0,
          "board-id": e.boardId,
          approvals: e.state.release_when.approvals,
          onValidity: i[3] || (i[3] = (c) => l("validity", "approvers", c))
        }, null, 8, ["board-id", "approvals"])) : I("", !0),
        h(ze, {
          class: "work-process-options",
          label: "Release options"
        }, {
          default: K(() => [
            s("div", Gu, [
              s("label", Hu, [
                i[36] || (i[36] = s("span", { class: "work-spacer" }, "Require approvals", -1)),
                h(r(_e), {
                  "model-value": !!e.state.release_when.approvals,
                  "aria-label": "Require approvals",
                  "onUpdate:modelValue": i[4] || (i[4] = (c) => e.state.release_when.approvals = c ? { min: 1, from: { group: "" }, prevent_self: !0 } : void 0)
                }, null, 8, ["model-value"])
              ]),
              h(Wt, {
                modelValue: e.state.release_when.wait,
                "onUpdate:modelValue": i[5] || (i[5] = (c) => e.state.release_when.wait = c),
                label: "Wait before release",
                onValidity: i[6] || (i[6] = (c, p) => l("validity", p, c))
              }, null, 8, ["modelValue"]),
              h(zl, {
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
      ], 64)) : I("", !0),
      e.state.kind === "automated" && e.state.run ? (n(), b(te, { key: 2 }, [
        i[46] || (i[46] = s("h4", { class: "work-process-group" }, "Automation", -1)),
        s("label", Yu, [
          i[38] || (i[38] = B("Run label", -1)),
          h(r(ge), {
            modelValue: e.state.run.stage,
            "onUpdate:modelValue": i[9] || (i[9] = (c) => e.state.run.stage = c),
            "aria-label": "Run label",
            required: ""
          }, null, 8, ["modelValue"])
        ]),
        h(cu, {
          modelValue: e.state.run.flow_ref,
          "onUpdate:modelValue": i[10] || (i[10] = (c) => e.state.run.flow_ref = c),
          onValidity: i[11] || (i[11] = (c) => l("validity", "flow", c))
        }, null, 8, ["modelValue"]),
        h(Wt, {
          modelValue: e.state.run.timeout,
          "onUpdate:modelValue": i[12] || (i[12] = (c) => e.state.run.timeout = c),
          label: "Attempt timeout",
          onValidity: i[13] || (i[13] = (c, p) => l("validity", p, c))
        }, null, 8, ["modelValue"]),
        i[47] || (i[47] = s("small", { class: "work-muted" }, "Blank uses the board timeout, or one hour.", -1)),
        s("label", Xu, [
          i[39] || (i[39] = s("span", { class: "work-spacer" }, "Maximum visits", -1)),
          h(r($t), {
            "model-value": e.state.run.max_visits ?? null,
            "aria-label": "Maximum visits",
            min: 1,
            useGrouping: !1,
            placeholder: "Board default",
            "onUpdate:modelValue": i[14] || (i[14] = (c) => e.state.run.max_visits = c ?? void 0)
          }, null, 8, ["model-value"])
        ]),
        s("label", Ju, [
          i[40] || (i[40] = B("When visits are exhausted", -1)),
          h(r(me), {
            "model-value": e.state.run.on_exhausted,
            "aria-label": "When visits are exhausted",
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            showClear: "",
            options: (e.process.transitions ?? []).filter((c) => !c.auto).map((c) => ({ label: r(je)(c), value: c.id })),
            "onUpdate:modelValue": i[15] || (i[15] = (c) => e.state.run.on_exhausted = c || void 0)
          }, null, 8, ["model-value", "options"])
        ]),
        i[48] || (i[48] = s("small", { class: "work-muted" }, "Blank records a failed run and stops automation. A route must leave every incoming state or be global.", -1)),
        s("label", Zu, [
          i[41] || (i[41] = s("span", { class: "work-spacer" }, "Retry if it fails", -1)),
          h(r(_e), {
            "model-value": !!e.state.run.retry,
            "aria-label": "Retry if it fails",
            "onUpdate:modelValue": i[16] || (i[16] = (c) => e.state.run.retry = c ? { max: 1, backoff: "PT1M" } : void 0)
          }, null, 8, ["model-value"])
        ]),
        e.state.run.retry ? (n(), b(te, { key: 0 }, [
          s("label", Qu, [
            i[42] || (i[42] = s("span", { class: "work-spacer" }, "Maximum attempts", -1)),
            h(r($t), {
              modelValue: e.state.run.retry.max,
              "onUpdate:modelValue": i[17] || (i[17] = (c) => e.state.run.retry.max = c),
              min: 1,
              useGrouping: !1
            }, null, 8, ["modelValue"])
          ]),
          h(Wt, {
            modelValue: e.state.run.retry.backoff,
            "onUpdate:modelValue": i[18] || (i[18] = (c) => e.state.run.retry.backoff = c),
            label: "Wait between attempts",
            onValidity: i[19] || (i[19] = (c, p) => l("validity", p, c))
          }, null, 8, ["modelValue"])
        ], 64)) : I("", !0),
        (n(), b(te, null, se([{ key: "on_pass", label: "On success" }, { key: "on_cancel", label: "On cancellation" }], (c) => s("label", {
          key: c.key,
          class: "work-stack work-tight"
        }, [
          B(D(c.label), 1),
          h(r(me), {
            "model-value": e.state.run[c.key],
            "aria-label": c.label,
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            showClear: "",
            options: o.value.map((p) => ({ label: r(je)(p), value: p.id })),
            "onUpdate:modelValue": (p) => e.state.run[c.key] = p || void 0
          }, null, 8, ["model-value", "aria-label", "options", "onUpdate:modelValue"])
        ])), 64)),
        s("label", _u, [
          i[43] || (i[43] = B("If it fails, go to", -1)),
          h(r(me), {
            "aria-label": "If it fails, go to",
            "model-value": e.state.run.on_fail,
            "onUpdate:modelValue": m,
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            showClear: "",
            options: o.value.map((c) => ({
              label: r(je)(c) + " → " + r(he)(e.process.states.find((p) => p.id === c.to)),
              value: c.id
            }))
          }, null, 8, ["model-value", "options"])
        ]),
        h(ze, {
          class: "work-disclosure",
          label: "Board automation defaults"
        }, {
          default: K(() => [
            s("div", ec, [
              i[45] || (i[45] = s("p", { class: "work-muted" }, "These values apply to automated states without their own limit.", -1)),
              h(Wt, {
                "model-value": e.draft.policy?.stage_timeout,
                label: "Default attempt timeout",
                "onUpdate:modelValue": i[20] || (i[20] = (c) => (e.draft.policy ??= {}).stage_timeout = c),
                onValidity: i[21] || (i[21] = (c, p) => l("validity", p, c))
              }, null, 8, ["model-value"]),
              s("label", tc, [
                i[44] || (i[44] = s("span", { class: "work-spacer" }, "Default maximum visits", -1)),
                h(r($t), {
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
      ], 64)) : I("", !0),
      e.state.kind === "parallel" && e.state.regions ? (n(), b(te, { key: 3 }, [
        i[53] || (i[53] = s("h4", { class: "work-process-group" }, "Lanes", -1)),
        (n(!0), b(te, null, se(e.state.regions, (c, p) => (n(), b("div", {
          key: p,
          class: "work-process-value work-stack work-tight"
        }, [
          s("div", ac, [
            s("span", null, "Lane " + D(p + 1), 1),
            i[49] || (i[49] = s("span", { class: "work-spacer" }, null, -1)),
            h(r(_), {
              severity: "danger",
              text: "",
              size: "small",
              "aria-label": "Remove lane",
              onClick: (x) => e.state.regions.splice(p, 1)
            }, {
              default: K(() => [
                h(r(de), { icon: "tabler:trash" })
              ]),
              _: 1
            }, 8, ["onClick"])
          ]),
          s("label", lc, [
            i[50] || (i[50] = B("Starts at", -1)),
            h(r(me), {
              "aria-label": "Lane starts at",
              modelValue: c.initial,
              "onUpdate:modelValue": (x) => c.initial = x,
              appendTo: "self",
              optionLabel: "label",
              optionValue: "value",
              options: e.process.states.filter((x) => x.id !== e.state.id).map((x) => ({ label: r(he)(x), value: x.id }))
            }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
          ])
        ]))), 128)),
        h(r(_), {
          label: "Add lane",
          severity: "secondary",
          outlined: "",
          size: "small",
          onClick: i[23] || (i[23] = (c) => e.state.regions.push({
            id: r(jt)("region", e.state.regions),
            initial: e.process.states.find((p) => p.id !== e.state.id)?.id ?? ""
          }))
        }, {
          icon: K(() => [
            h(r(de), { icon: "tabler:plus" })
          ]),
          _: 1
        }),
        s("label", oc, [
          i[51] || (i[51] = B("Finish rule", -1)),
          h(r(me), {
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
        typeof e.state.join == "number" ? (n(), b("label", ic, [
          i[52] || (i[52] = s("span", { class: "work-spacer" }, "Lanes needed", -1)),
          h(r($t), {
            modelValue: e.state.join,
            "onUpdate:modelValue": i[25] || (i[25] = (c) => e.state.join = c),
            min: 1,
            max: e.state.regions.length,
            useGrouping: !1
          }, null, 8, ["modelValue", "max"])
        ])) : I("", !0)
      ], 64)) : I("", !0),
      h(ze, {
        class: "work-disclosure",
        label: "Advanced state settings"
      }, {
        default: K(() => [
          s("div", nc, [
            i[56] || (i[56] = s("h4", { class: "work-process-group" }, "Assignment and conditions", -1)),
            s("label", sc, [
              i[54] || (i[54] = B("Stage label", -1)),
              h(r(ge), {
                "model-value": e.state.stage,
                "aria-label": "Stage label",
                "onUpdate:modelValue": i[26] || (i[26] = (c) => e.state.stage = c || void 0)
              }, null, 8, ["model-value"])
            ]),
            !e.state.kind || e.state.kind === "human" || e.state.kind === "parallel" ? (n(), b(te, { key: 0 }, [
              s("label", rc, [
                h(r(_e), {
                  "model-value": !!e.state.awaiting,
                  "aria-label": "Awaiting people",
                  "onUpdate:modelValue": i[27] || (i[27] = (c) => e.state.awaiting = c ? { group: "" } : void 0)
                }, null, 8, ["model-value"]),
                i[55] || (i[55] = B("Awaiting people", -1))
              ]),
              e.state.awaiting ? (n(), J(Uu, {
                key: 0,
                modelValue: e.state.awaiting,
                "onUpdate:modelValue": i[28] || (i[28] = (c) => e.state.awaiting = c),
                draft: e.draft,
                "board-id": e.boardId,
                label: "Awaiting",
                onValidity: i[29] || (i[29] = (c) => l("validity", "awaiting", c))
              }, null, 8, ["modelValue", "draft", "board-id"])) : I("", !0)
            ], 64)) : I("", !0),
            h(jl, {
              "board-id": e.boardId,
              modelValue: e.state.assign,
              "onUpdate:modelValue": i[30] || (i[30] = (c) => e.state.assign = c),
              label: "Assign to"
            }, null, 8, ["board-id", "modelValue"]),
            h(Ot, {
              label: "State checks",
              example: ["installed-check"],
              "model-value": e.state.invariants,
              shape: "array",
              "onUpdate:modelValue": i[31] || (i[31] = (c) => e.state.invariants = c),
              onValidity: i[32] || (i[32] = (c) => l("validity", "invariants", c))
            }, null, 8, ["model-value"]),
            h(Cu, {
              state: e.state,
              draft: e.draft,
              onValidity: i[33] || (i[33] = (c, p) => l("validity", "timer-" + c, p))
            }, null, 8, ["state", "draft"])
          ])
        ]),
        _: 1
      })
    ]));
  }
}), uc = {
  key: 0,
  class: "work-ia-toolbar"
}, cc = {
  key: 1,
  class: "kx-err",
  role: "alert"
}, vc = { class: "work-muted" }, mc = {
  key: 1,
  class: "work-map-zoom",
  role: "group",
  "aria-label": "Map zoom"
}, fc = ["aria-label", "aria-keyshortcuts", "onKeydown"], pc = { class: "work-row" }, bc = { class: "work-process-meaning" }, hc = {
  key: 0,
  class: "work-muted"
}, gc = { class: "work-stack work-tight" }, yc = { class: "work-process-inspector-foot" }, kc = { class: "work-row work-transition-actions" }, wc = { class: "work-process-meaning" }, Vc = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, $c = { class: "work-stack work-tight" }, xc = { class: "work-stack" }, Cc = { class: "work-stack work-tight" }, Sc = {
  key: 0,
  class: "work-muted"
}, Tc = { class: "work-stack work-tight" }, Ic = { class: "work-dialog-actions" }, Uc = /* @__PURE__ */ ye({
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
    const t = e, l = a, o = L(() => t.draft.processes ?? []), d = M(!1), f = M(""), m = M(""), u = M(""), i = M("Map"), c = M(""), p = M(), x = M(), y = M(), S = M(), w = M(), A = M(), $ = M(!1);
    let g;
    async function k() {
      $.value = !0, await aa(), w.value?.querySelector('[aria-label="State name"]')?.focus();
    }
    const C = L(() => o.value.find((O) => O.id === m.value) ?? o.value[0]), H = M(!1);
    function P(O) {
      H.value = !0, i.value = O;
    }
    function G() {
      !H.value && S.value?.clientWidth && (i.value = S.value.clientWidth < 480 && (C.value?.states.length ?? 0) > 6 ? "List" : "Map");
    }
    let ne;
    Ia(() => {
      G(), S.value && typeof ResizeObserver < "u" && (ne = new ResizeObserver(G), ne.observe(S.value));
    }), St(() => ne?.disconnect()), Te(C, () => {
      H.value = !1, G();
    });
    function re() {
      $.value = !1, p.value = void 0, x.value = void 0, u.value = "", g = void 0;
    }
    async function ve() {
      const O = g;
      re(), await aa(), O?.isConnected ? O.focus() : ke();
    }
    function ke() {
      i.value === "Map" ? y.value?.focus() : A.value?.focus();
    }
    async function oe() {
      await aa(), w.value && (w.value.scrollTop = 0, w.value.focus({ preventScroll: !0 }), (w.value.closest(".work-settings-shell")?.clientWidth ?? 1 / 0) <= 700 && w.value.scrollIntoView?.({ block: "nearest" }));
    }
    function z(O, R) {
      g = R, $.value = !1, p.value = O, x.value = void 0, c.value = "", u.value = "", oe();
    }
    function W(O, R) {
      g = R, $.value = !1, x.value = O, p.value = void 0, u.value = "", oe();
    }
    Te([C, i], re);
    const U = L(() => {
      if (!t.counts || !C.value) return;
      const O = t.countTypes?.filter((R) => R.process === C.value?.id) ?? [];
      return Object.fromEntries(C.value.states.map((R) => [
        R.id,
        O.reduce((F, T) => F + (t.counts?.[T.id]?.[R.id] ?? 0), 0)
      ]));
    }), q = L(() => (t.guards ?? []).filter((O) => t.draft.plugins?.some((R) => R.use === O.plugin))), ce = L(() => Object.keys(t.draft.policy?.wip ?? {}).filter((O) => !o.value.some((R) => R.states.some((F) => F.id === O))));
    function ue(O) {
      O === "__new" ? d.value = !0 : m.value = O;
    }
    function Q() {
      const O = f.value.trim();
      if (!O) return;
      const R = O.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "") || "process", F = (/^[a-z]/.test(R) ? R : "process_" + R).slice(0, 40), T = o.value.some((ee) => ee.id === F) ? jt(F, o.value) : F;
      (t.draft.processes ??= []).push({ id: T, name: O, initial: "todo", states: [{ id: "todo", name: "To do", category: "unstarted" }], transitions: [] }), m.value = T, f.value = "", d.value = !1;
    }
    async function we(O, R) {
      const F = { id: jt("state", O.states), name: "New state", category: "started" }, T = ja(O), ee = T.at(-1), E = p.value ?? (ee?.category === "completed" ? T.at(-2) : ee), ie = E && (O.transitions?.find((Ve) => Ve.default && Ve.from !== "any" && Ve.from.includes(E.id)) ?? O.transitions?.find((Ve) => Ve.from !== "any" && Ve.from.includes(E.id) && O.states.findIndex((Ue) => Ue.id === Ve.to) > O.states.indexOf(E)));
      if (O.states.splice(E ? O.states.indexOf(E) + 1 : O.states.length, 0, F), E && E.category !== "completed" && E.category !== "canceled")
        if (ie) {
          const Ve = ie.to;
          ie.to = F.id, (O.transitions ??= []).push({ id: jt("transition", O.transitions ?? []), name: "Continue", from: [F.id], to: Ve, ...ie.auto && ie.default ? { auto: !0, default: !0 } : {} });
        } else (O.transitions ??= []).push({ id: jt("transition", O.transitions ?? []), name: "Continue", from: [E.id], to: F.id });
      z(F, R), await k();
    }
    function Se(O, R, F = g) {
      const T = C.value;
      if (!T || !R || O === R) return;
      const ee = T.transitions ??= [], E = `to_${R}`;
      let ie = E.slice(0, 40), Ve = 2;
      for (; ee.some((Ee) => Ee.id === ie); ) {
        const Ee = `_${Ve++}`;
        ie = E.slice(0, 40 - Ee.length) + Ee;
      }
      const Ue = { id: ie, name: `To ${he(T.states.find((Ee) => Ee.id === R)).toLowerCase()}`, from: [O], to: R };
      ee.push(Ue), W(Ue, F);
    }
    function j(O, R) {
      const F = p.value ?? O.states.find((E) => E.id === O.initial) ?? O.states[0], T = O.states.find((E) => E.id !== F?.id);
      if (!F || !T) return;
      const ee = { id: jt("transition", O.transitions ?? []), name: "To " + he(T), from: [F.id], to: T.id };
      (O.transitions ??= []).push(ee), W(ee, R);
    }
    async function v(O) {
      const R = C.value, F = R?.transitions?.indexOf(O) ?? -1;
      if (!R || F < 0) return;
      const T = Ei(R, O);
      if (T.length) {
        u.value = `Used by ${T.join(", ")}. Update those references first.`;
        return;
      }
      R.transitions.splice(F, 1), re(), await aa(), ke();
    }
    function V(O) {
      !x.value || O.defaultPrevented || O.repeat || (O.preventDefault(), v(x.value));
    }
    function Z(O, R) {
      const F = Ai(O, R);
      if (F.length) {
        u.value = `${he(R)} is used by ${F.join(", ")}. Update these references first.`;
        return;
      }
      O.states.splice(O.states.indexOf(R), 1), ve();
    }
    async function N(O) {
      const R = t.draft.item_types?.filter((T) => T.process === O.id).map((T) => T.title || "Untitled item type") ?? [];
      if (R.length) {
        u.value = `Used by ${R.join(", ")}. Choose a different process for those item types first.`;
        return;
      }
      const F = await t.guardRemoval?.("processes", O.id);
      if (F) {
        u.value = F;
        return;
      }
      Ua(t.draft, "processes", O.id), m.value = "", re();
    }
    return (O, R) => (n(), b("section", {
      ref_key: "editor",
      ref: S,
      class: "work-process-editor work-stack",
      "aria-label": "Process editor",
      onKeydown: R[16] || (R[16] = Oe((F) => w.value && ve(), ["esc"]))
    }, [
      C.value ? (n(), b("div", uc, [
        s("div", null, [
          s("h3", null, D(C.value.name || "Workflow"), 1),
          R[17] || (R[17] = s("p", { class: "work-muted" }, "Select a state or a named transition to edit it.", -1))
        ])
      ])) : I("", !0),
      u.value && !x.value ? (n(), b("p", cc, D(u.value), 1)) : I("", !0),
      (n(!0), b(te, null, se(e.issues?.filter((F) => F.code === "process " + C.value?.id) ?? [], (F) => (n(), b("p", {
        key: F.what + F.detail,
        class: "work-error work-small",
        role: "alert"
      }, D(r(tl)(F)) + " · " + D(F.what), 1))), 128)),
      C.value ? (n(), b("div", {
        key: 2,
        class: ft(["work-process-builder", { "work-process-inspecting": p.value || x.value }])
      }, [
        s("div", {
          ref_key: "tools",
          ref: A,
          class: "work-process-controls",
          role: "toolbar",
          "aria-label": "Process tools",
          tabindex: "-1"
        }, [
          o.value.length > 1 ? (n(), J(r(me), {
            key: 0,
            "model-value": C.value.id,
            "aria-label": "Process",
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            options: [
              ...o.value.map((F) => ({ label: F.name || "Untitled process", value: F.id })),
              { label: "New process…", value: "__new" }
            ],
            "onUpdate:modelValue": ue
          }, null, 8, ["model-value", "options"])) : I("", !0),
          h(r(_), {
            label: "Add state",
            severity: "secondary",
            outlined: "",
            size: "small",
            onClick: R[0] || (R[0] = (F) => we(C.value, F.currentTarget))
          }, {
            icon: K(() => [
              h(r(de), { icon: "tabler:plus" })
            ]),
            _: 1
          }),
          h(r(_), {
            label: "Add transition",
            severity: "secondary",
            outlined: "",
            size: "small",
            disabled: C.value.states.length < 2,
            onClick: R[1] || (R[1] = (F) => j(C.value, F.currentTarget))
          }, null, 8, ["disabled"]),
          h(r(me), {
            modelValue: C.value.initial,
            "onUpdate:modelValue": R[2] || (R[2] = (F) => C.value.initial = F),
            "aria-label": "Starts in " + r(he)(C.value.states.find((F) => F.id === C.value.initial)),
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            options: C.value.states.map((F) => ({ label: r(he)(F), value: F.id }))
          }, {
            value: K(() => [
              s("span", vc, "Starts in " + D(r(he)(C.value.states.find((F) => F.id === C.value.initial))), 1)
            ]),
            _: 1
          }, 8, ["modelValue", "aria-label", "options"]),
          R[18] || (R[18] = s("span", { class: "work-spacer" }, null, -1)),
          i.value === "Map" ? (n(), b("div", mc, [
            h(r(_), {
              label: "Fit",
              title: "Fit the map to a readable width",
              text: "",
              severity: "secondary",
              size: "small",
              onClick: R[3] || (R[3] = (F) => y.value?.fit())
            }, {
              icon: K(() => [
                h(r(de), { icon: "tabler:arrows-maximize" })
              ]),
              _: 1
            }),
            i.value === "Map" ? (n(), J(r(_), {
              key: 0,
              "aria-label": "Zoom out",
              title: "Zoom out",
              text: "",
              severity: "secondary",
              size: "small",
              onClick: R[4] || (R[4] = (F) => y.value?.zoomOut())
            }, {
              default: K(() => [
                h(r(de), { icon: "tabler:minus" })
              ]),
              _: 1
            })) : I("", !0),
            i.value === "Map" ? (n(), J(r(_), {
              key: 1,
              "aria-label": "Zoom in",
              title: "Zoom in",
              text: "",
              severity: "secondary",
              size: "small",
              onClick: R[5] || (R[5] = (F) => y.value?.zoomIn())
            }, {
              default: K(() => [
                h(r(de), { icon: "tabler:plus" })
              ]),
              _: 1
            })) : I("", !0)
          ])) : I("", !0),
          h(r(Ll), {
            "model-value": i.value,
            "onUpdate:modelValue": P,
            options: ["Map", "List"],
            "allow-empty": !1,
            "aria-label": "Process layout"
          }, null, 8, ["model-value"]),
          o.value.length === 1 ? (n(), J(r(_), {
            key: 2,
            label: "New process",
            "aria-label": "New process",
            text: "",
            severity: "secondary",
            size: "small",
            onClick: R[6] || (R[6] = (F) => d.value = !0)
          }, {
            icon: K(() => [
              h(r(de), { icon: "tabler:plus" })
            ]),
            _: 1
          })) : I("", !0)
        ], 512),
        i.value === "Map" ? (n(), J(wd, {
          key: 0,
          ref_key: "graph",
          ref: y,
          process: C.value,
          draft: e.draft,
          "fit-on-open": "",
          "selected-state": p.value,
          "selected-transition": x.value,
          onState: z,
          onTransition: W,
          onRemoveTransition: V,
          onConnect: Se,
          onClear: ve
        }, null, 8, ["process", "draft", "selected-state", "selected-transition"])) : (n(), J(zd, {
          key: 1,
          process: C.value,
          "selected-state": p.value,
          "selected-transition": x.value,
          counts: U.value,
          onState: z,
          onTransition: W,
          onRemoveState: R[7] || (R[7] = (F) => Z(C.value, F)),
          onRemoveTransition: v
        }, null, 8, ["process", "selected-state", "selected-transition", "counts"])),
        h(To, { name: "work-panel" }, {
          default: K(() => [
            p.value || x.value ? (n(), b("aside", {
              key: 0,
              ref_key: "inspector",
              ref: w,
              class: "work-process-sideform",
              tabindex: "-1",
              "aria-label": p.value ? "State inspector" : "Transition inspector",
              "aria-keyshortcuts": x.value ? "Delete Backspace" : void 0,
              onKeydown: [
                Oe(Ie(V, ["self"]), ["delete"]),
                Oe(Ie(V, ["self"]), ["backspace"])
              ]
            }, [
              (n(!0), b(te, null, se(p.value ? [p.value] : [], (F) => (n(), b(te, {
                key: F.id
              }, [
                s("header", pc, [
                  $.value ? (n(), J(r(ge), {
                    key: 1,
                    modelValue: F.name,
                    "onUpdate:modelValue": (T) => F.name = T,
                    class: "work-process-name",
                    "aria-label": "State name",
                    onBlur: R[8] || (R[8] = (T) => $.value = !1)
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])) : (n(), J(Bl, {
                    key: 0,
                    class: "work-process-state-title",
                    "aria-label": "Rename state",
                    onActivate: k
                  }, {
                    default: K(() => [
                      s("span", null, D(r(he)(F)), 1)
                    ]),
                    _: 2
                  }, 1024)),
                  h(r(_), {
                    severity: "secondary",
                    text: "",
                    size: "small",
                    "aria-label": "Close state editor",
                    onClick: ve
                  }, {
                    default: K(() => [
                      h(r(de), { icon: "tabler:x" })
                    ]),
                    _: 1
                  })
                ]),
                s("p", bc, D(r(Di)(F, e.draft)), 1),
                U.value ? (n(), b("p", hc, D(U.value[F.id] ?? 0) + " " + D(U.value[F.id] === 1 ? "item" : "items") + " currently here", 1)) : I("", !0),
                h(dc, {
                  state: F,
                  process: C.value,
                  draft: e.draft,
                  "board-id": e.boardId,
                  onValidity: (T, ee) => l("validity", T.includes("duration:") ? T : C.value.id + ":" + F.id + ":" + T, ee)
                }, null, 8, ["state", "process", "draft", "board-id", "onValidity"]),
                s("label", gc, [
                  R[19] || (R[19] = B("Phase", -1)),
                  h(r(me), {
                    "aria-label": "Phase",
                    modelValue: F.category,
                    "onUpdate:modelValue": (T) => F.category = T,
                    appendTo: "self",
                    optionLabel: "label",
                    optionValue: "value",
                    options: ["triage", "backlog", ...r(Eo)].map((T) => ({ label: r(Gt)(T), value: T }))
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                ]),
                R[20] || (R[20] = s("h4", { class: "work-process-group" }, "Next stop", -1)),
                h(r(me), {
                  modelValue: c.value,
                  "onUpdate:modelValue": R[9] || (R[9] = (T) => c.value = T),
                  "aria-label": "Add transition to…",
                  placeholder: "Add transition to…",
                  appendTo: "self",
                  optionLabel: "label",
                  optionValue: "value",
                  options: C.value.states.filter((T) => T !== F).map((T) => ({ label: r(he)(T), value: T.id }))
                }, null, 8, ["modelValue", "options"]),
                h(r(_), {
                  label: "Add transition",
                  severity: "secondary",
                  outlined: "",
                  size: "small",
                  disabled: !c.value,
                  onClick: (T) => Se(F.id, c.value)
                }, {
                  icon: K(() => [
                    h(r(de), { icon: "tabler:arrow-right" })
                  ]),
                  _: 1
                }, 8, ["disabled", "onClick"]),
                s("footer", yc, [
                  h(r(_), {
                    label: "Remove state",
                    severity: "danger",
                    text: "",
                    size: "small",
                    onClick: (T) => Z(C.value, F)
                  }, {
                    icon: K(() => [
                      h(r(de), { icon: "tabler:trash" })
                    ]),
                    _: 1
                  }, 8, ["onClick"])
                ])
              ], 64))), 128)),
              (n(!0), b(te, null, se(x.value ? [x.value] : [], (F) => (n(), b(te, {
                key: F.id
              }, [
                s("header", kc, [
                  R[21] || (R[21] = s("h3", null, "Transition", -1)),
                  h(r(_), {
                    type: "button",
                    label: "Remove transition",
                    severity: "danger",
                    text: "",
                    size: "small",
                    onClick: (T) => v(F)
                  }, {
                    icon: K(() => [
                      h(r(de), { icon: "tabler:trash" })
                    ]),
                    _: 1
                  }, 8, ["onClick"]),
                  h(r(_), {
                    severity: "secondary",
                    text: "",
                    size: "small",
                    "aria-label": "Close transition editor",
                    onClick: ve
                  }, {
                    default: K(() => [
                      h(r(de), { icon: "tabler:x" })
                    ]),
                    _: 1
                  })
                ]),
                s("p", wc, D(F.from === "any" ? "Any state" : F.from.map((T) => r(he)(C.value.states.find((ee) => ee.id === T))).join(", ")) + " → " + D(r(he)(C.value.states.find((T) => T.id === F.to))), 1),
                u.value ? (n(), b("p", Vc, D(u.value), 1)) : I("", !0),
                s("label", $c, [
                  R[22] || (R[22] = B("Name", -1)),
                  h(r(ge), {
                    modelValue: F.name,
                    "onUpdate:modelValue": (T) => F.name = T,
                    placeholder: r(je)(F),
                    "aria-label": "Transition name"
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder"])
                ]),
                h(_d, {
                  transition: F,
                  process: C.value,
                  draft: e.draft,
                  "board-id": e.boardId,
                  guards: q.value,
                  onValidity: (T, ee) => l("validity", C.value.id + ":transition-" + F.id + ":" + T, ee)
                }, null, 8, ["transition", "process", "draft", "board-id", "guards", "onValidity"])
              ], 64))), 128))
            ], 40, fc)) : I("", !0)
          ]),
          _: 1
        })
      ], 2)) : (n(), J(r(_), {
        key: 3,
        label: "New process",
        severity: "secondary",
        outlined: "",
        onClick: R[10] || (R[10] = (F) => d.value = !0)
      }, {
        icon: K(() => [
          h(r(de), { icon: "tabler:plus" })
        ]),
        _: 1
      })),
      C.value ? (n(), J(ze, {
        key: 4,
        class: "work-settings-card work-disclosure",
        label: "Advanced workflow settings"
      }, {
        default: K(() => [
          s("div", xc, [
            s("label", Cc, [
              R[23] || (R[23] = B("Workflow name", -1)),
              h(r(ge), {
                modelValue: C.value.name,
                "onUpdate:modelValue": R[11] || (R[11] = (F) => C.value.name = F),
                "aria-label": "Workflow name"
              }, null, 8, ["modelValue"])
            ]),
            ce.value.length ? (n(), b("p", Sc, "Some item limits belong to removed states.")) : I("", !0),
            (n(!0), b(te, null, se(ce.value, (F, T) => (n(), J(r(_), {
              key: F,
              label: "Clear limit for removed state " + (T + 1),
              severity: "secondary",
              text: "",
              onClick: (ee) => delete e.draft.policy.wip[F]
            }, null, 8, ["label", "onClick"]))), 128)),
            h(r(_), {
              label: "Remove workflow",
              severity: "danger",
              text: "",
              size: "small",
              onClick: R[12] || (R[12] = (F) => N(C.value))
            })
          ])
        ]),
        _: 1
      })) : I("", !0),
      h(Ul, {
        visible: d.value,
        label: "New process",
        onClose: R[15] || (R[15] = (F) => d.value = !1)
      }, {
        default: K(() => [
          s("form", {
            class: "work-dialog-box",
            "aria-label": "New process",
            onSubmit: Ie(Q, ["stop", "prevent"])
          }, [
            R[25] || (R[25] = s("h2", null, "New process", -1)),
            s("label", Tc, [
              R[24] || (R[24] = B("Name", -1)),
              h(r(ge), {
                modelValue: f.value,
                "onUpdate:modelValue": R[13] || (R[13] = (F) => f.value = F),
                "aria-label": "New process name",
                autofocus: "",
                required: ""
              }, null, 8, ["modelValue"])
            ]),
            s("div", Ic, [
              h(r(_), {
                label: "Cancel",
                severity: "secondary",
                outlined: "",
                onClick: R[14] || (R[14] = (F) => d.value = !1)
              }),
              h(r(_), {
                label: "Create process",
                type: "submit",
                disabled: !f.value.trim()
              }, null, 8, ["disabled"])
            ])
          ], 32)
        ]),
        _: 1
      }, 8, ["visible"])
    ], 544));
  }
}), Dc = {
  class: "work-settings-card work-stack",
  "aria-label": "Existing items"
}, Ec = {
  key: 0,
  class: "work-stack work-tight"
}, Ac = { class: "work-row" }, Oc = /* @__PURE__ */ ye({
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
    return (t, l) => (n(), b("section", Dc, [
      l[2] || (l[2] = s("h3", { class: "work-row-title" }, "Items in changed states", -1)),
      (n(!0), b(te, null, se(e.removed, ({ process: o, state: d, count: f }) => (n(), b("label", {
        key: o.id + "/" + d.id,
        class: "work-stack work-tight"
      }, [
        B(" Move " + D(a(f)) + " from " + D(r(he)(d)) + " to ", 1),
        h(r(me), {
          disabled: e.disabled,
          "model-value": o.map?.[d.id],
          "aria-label": "Move items from " + r(he)(d) + " to",
          placeholder: "Choose a state",
          appendTo: "self",
          optionLabel: "label",
          optionValue: "value",
          options: o.states.map((m) => ({ label: r(he)(m), value: m.id })),
          "onUpdate:modelValue": (m) => t.$emit("destination", o, d.id, m)
        }, null, 8, ["disabled", "model-value", "aria-label", "options", "onUpdate:modelValue"])
      ]))), 128)),
      e.renamed.length ? (n(), b("div", Ec, [
        (n(!0), b(te, null, se(e.renamed, ({ process: o, state: d, count: f, name: m }) => (n(), b("p", {
          key: o.id + "/" + d.id
        }, [
          B(D(r(he)(d)) + " becomes ", 1),
          s("strong", null, D(m), 1),
          B(" for " + D(a(f)) + ". ", 1)
        ]))), 128)),
        s("label", Ac, [
          h(r(Kt), {
            binary: "",
            "model-value": e.confirmed,
            disabled: e.disabled,
            "onUpdate:modelValue": l[0] || (l[0] = (o) => t.$emit("update:confirmed", o))
          }, null, 8, ["model-value", "disabled"]),
          l[1] || (l[1] = B(" Keep these items in their renamed states ", -1))
        ])
      ])) : I("", !0)
    ]));
  }
}), Pc = {
  class: "work-stack",
  "aria-label": "Links editor"
}, Rc = { class: "work-section-heading" }, Nc = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, Mc = { class: "work-definition-meta work-muted work-small" }, Fc = { class: "work-settings-grid" }, Lc = { class: "work-stack work-tight" }, Bc = { class: "work-stack work-tight" }, zc = { class: "work-stack work-tight" }, jc = { class: "work-row" }, Wc = {
  key: 0,
  class: "work-muted work-small"
}, qc = {
  key: 1,
  class: "work-settings-grid"
}, Kc = { class: "work-stack work-tight" }, Gc = { class: "work-stack work-tight" }, Hc = {
  key: 0,
  class: "work-chips"
}, Yc = { class: "work-stack work-tight" }, Xc = { class: "work-relation-preview work-small" }, Jc = { class: "work-muted" }, Zc = {
  key: 0,
  class: "kx-empty"
}, Qc = { class: "work-row work-add-definition" }, _c = { class: "work-stack work-tight" }, ev = /* @__PURE__ */ ye({
  __name: "RelationsEditor",
  props: {
    draft: {},
    guardRemoval: { type: Function }
  },
  setup(e) {
    const a = e, t = L(() => a.draft.relation_types ?? []), l = L(() => (a.draft.item_types ?? []).map((w) => ({ value: w.id, label: w.title || Re(w.id) }))), o = wi(/* @__PURE__ */ new WeakMap());
    function d(w, A, $) {
      $.length ? w[A] = $ : delete w[A];
    }
    function f(w, A = "") {
      const $ = A.trim();
      return /^[a-z][a-z0-9_]{0,39}$/.test($) && !w.to_types?.includes($);
    }
    function m(w) {
      const A = o.get(w)?.trim();
      !A || !f(w, A) || (d(w, "to_types", [...w.to_types ?? [], A]), o.delete(w));
    }
    const u = M(""), i = M(""), c = M(!1), p = L(() => !!u.value.trim());
    function x() {
      const w = u.value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "").slice(0, 40), A = /^[a-z]/.test(w) ? w : "link_" + (w || "new");
      let $ = A, g = 2;
      for (; t.value.some((k) => k.id === $); ) $ = A + "_" + g++;
      return $;
    }
    function y() {
      p.value && ((a.draft.relation_types ??= []).push({ id: x(), outward: u.value.trim(), inward: u.value.trim(), cardinality: "many" }), u.value = "");
    }
    async function S(w) {
      if (!c.value) {
        c.value = !0, i.value = "";
        try {
          const A = await a.guardRemoval?.("relation_types", w);
          A ? i.value = A : Ua(a.draft, "relation_types", w);
        } finally {
          c.value = !1;
        }
      }
    }
    return (w, A) => (n(), b("section", Pc, [
      s("header", Rc, [
        A[1] || (A[1] = s("div", null, [
          s("h3", null, "Links between items"),
          s("p", { class: "work-muted work-small" }, "Use a link to show a relationship on both items, such as “Blocks” and “Blocked by.” Use an item reference field to store a selected item as a value, such as “Epic.”")
        ], -1)),
        h(r(We), {
          class: "kx-tag-sm",
          severity: "secondary"
        }, {
          default: K(() => [
            B(D(t.value.length) + " " + D(t.value.length === 1 ? "relation" : "relations"), 1)
          ]),
          _: 1
        })
      ]),
      i.value ? (n(), b("p", Nc, D(i.value), 1)) : I("", !0),
      h(ll, {
        columns: "relations",
        count: t.value.length
      }, {
        default: K(() => [
          (n(!0), b(te, null, se(t.value, ($, g) => (n(), J(al, {
            title: $.outward || r(Re)($.id),
            kind: $.symmetric ? "Same both ways" : "Different each way",
            key: g,
            class: "work-stack"
          }, {
            usage: K(() => [
              s("span", Mc, D($.outward || "Related work") + " · " + D($.inward || "Reverse relation"), 1)
            ]),
            actions: K(() => [
              h(r(_), {
                severity: "secondary",
                text: "",
                disabled: c.value,
                onClick: (k) => S($.id),
                "aria-label": "Remove link type",
                size: "small"
              }, {
                default: K(() => [
                  h(r(de), {
                    icon: "tabler:trash",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["disabled", "onClick"])
            ]),
            default: K(() => [
              s("div", Fc, [
                s("label", Lc, [
                  A[2] || (A[2] = B("Shown on this item ", -1)),
                  h(r(ge), {
                    modelValue: $.outward,
                    "onUpdate:modelValue": (k) => $.outward = k,
                    "aria-label": "Shown on this item"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                s("label", Bc, [
                  A[3] || (A[3] = B("Shown on the other item ", -1)),
                  h(r(ge), {
                    modelValue: $.inward,
                    "onUpdate:modelValue": (k) => $.inward = k,
                    "aria-label": "Shown on the other item"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                s("label", zc, [
                  A[4] || (A[4] = B("Links allowed ", -1)),
                  h(r(me), {
                    "model-value": $.cardinality ?? "many",
                    "onUpdate:modelValue": (k) => $.cardinality = k,
                    "aria-label": "Links allowed",
                    appendTo: "self",
                    optionLabel: "label",
                    optionValue: "value",
                    optionDisabled: "disabled",
                    options: [{ label: "One link", value: "one", disabled: !1 }, { label: "Many links", value: "many", disabled: !1 }]
                  }, null, 8, ["model-value", "onUpdate:modelValue"])
                ]),
                s("label", jc, [
                  h(r(Kt), {
                    modelValue: $.symmetric,
                    "onUpdate:modelValue": (k) => $.symmetric = k,
                    disabled: !!($.from_types?.length || $.to_types?.length),
                    "aria-label": "Same meaning in both directions",
                    binary: ""
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"]),
                  A[5] || (A[5] = B("Same meaning in both directions ", -1))
                ])
              ]),
              $.from_types?.length || $.to_types?.length ? (n(), b("p", Wc, " Clear the source and target types to use the same meaning in both directions. ")) : I("", !0),
              $.symmetric ? I("", !0) : (n(), b("div", qc, [
                h(mt, {
                  label: "Source item types",
                  options: l.value,
                  "model-value": $.from_types,
                  "onUpdate:modelValue": (k) => d($, "from_types", k)
                }, null, 8, ["options", "model-value", "onUpdate:modelValue"]),
                s("div", Kc, [
                  s("label", Gc, [
                    A[6] || (A[6] = B("Target type ID ", -1)),
                    h(r(ge), {
                      "model-value": o.get($) ?? "",
                      "onUpdate:modelValue": (k) => o.set($, k ?? ""),
                      "aria-label": "Target type ID",
                      placeholder: "e.g. release",
                      maxlength: "40",
                      onKeydown: Oe(Ie((k) => m($), ["stop", "prevent"]), ["enter"])
                    }, null, 8, ["model-value", "onUpdate:modelValue", "onKeydown"])
                  ]),
                  A[7] || (A[7] = s("p", { class: "work-muted work-small" }, "Use the type ID from this board or a peer board. Leave either end empty to allow any type there.", -1)),
                  h(r(_), {
                    label: "Add target type",
                    severity: "secondary",
                    outlined: "",
                    size: "small",
                    disabled: !f($, o.get($)),
                    onClick: (k) => m($)
                  }, null, 8, ["disabled", "onClick"]),
                  $.to_types?.length ? (n(), b("div", Hc, [
                    (n(!0), b(te, null, se($.to_types, (k) => (n(), J(r(_), {
                      key: k,
                      severity: "secondary",
                      text: "",
                      size: "small",
                      label: k + " ×",
                      "aria-label": "Remove target type " + k,
                      onClick: (C) => d($, "to_types", $.to_types.filter((H) => H !== k))
                    }, null, 8, ["label", "aria-label", "onClick"]))), 128))
                  ])) : I("", !0)
                ])
              ])),
              h(ze, {
                class: "work-disclosure",
                label: "Advanced link settings"
              }, {
                default: K(() => [
                  s("label", Yc, [
                    A[8] || (A[8] = B("Identifier ", -1)),
                    h(r(ge), {
                      modelValue: $.id,
                      "onUpdate:modelValue": (k) => $.id = k,
                      required: "",
                      pattern: "[a-z][a-z0-9_]*",
                      "aria-label": "Relation ID"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ])
                ]),
                _: 2
              }, 1024),
              s("p", Xc, [
                A[9] || (A[9] = s("strong", null, "This item", -1)),
                B(" " + D($.outward || "relates to") + " ", 1),
                A[10] || (A[10] = s("strong", null, "another item", -1)),
                s("span", Jc, " · reverse: " + D($.symmetric ? $.outward : $.inward), 1)
              ])
            ]),
            _: 2
          }, 1032, ["title", "kind"]))), 128)),
          t.value.length ? I("", !0) : (n(), b("p", Zc, "No link types yet. Add one to connect related work.")),
          s("div", Qc, [
            s("label", _c, [
              A[11] || (A[11] = B("New link name ", -1)),
              h(r(ge), {
                modelValue: u.value,
                "onUpdate:modelValue": A[0] || (A[0] = ($) => u.value = $),
                placeholder: "e.g. Blocks",
                onKeydown: Oe(Ie(y, ["prevent"]), ["enter"])
              }, null, 8, ["modelValue", "onKeydown"])
            ]),
            h(r(_), {
              label: "Add link type",
              severity: "secondary",
              disabled: !p.value,
              onClick: y,
              outlined: ""
            }, {
              icon: K(() => [
                h(r(de), {
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
function ai(e) {
  return typeof e.error == "string" ? e.error : e.error?.message;
}
function Vo(e, a) {
  const t = ai(e);
  return e.parked ? "Stopped: " + (t ?? "Projection is parked") : t ? "Degraded: " + t : e.bootstrapping ? "Initializing" : e.last_seq >= a ? "Up to date" : "Catching up";
}
function li(e, a) {
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
  if (o.some(ai)) return { kind: "degraded", status: "Degraded" };
}
const tv = {
  class: "work-stack",
  "aria-label": "Plugins editor"
}, av = { class: "work-ia-toolbar" }, lv = {
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
}, nv = {
  key: 0,
  class: "work-row"
}, sv = {
  key: 0,
  class: "work-muted work-small"
}, rv = {
  key: 1,
  class: "work-notice"
}, dv = {
  key: 2,
  class: "work-stack work-tight work-plugin-status"
}, uv = {
  key: 0,
  class: "work-muted"
}, cv = { key: 1 }, vv = {
  key: 2,
  class: "work-row"
}, mv = {
  key: 3,
  class: "work-row"
}, fv = {
  key: 0,
  class: "work-small"
}, pv = {
  key: 6,
  class: "work-row"
}, bv = {
  key: 7,
  class: "work-row"
}, hv = {
  key: 8,
  class: "work-row"
}, gv = {
  key: 3,
  class: "work-stack work-tight"
}, yv = {
  key: 0,
  class: "work-muted"
}, kv = { class: "work-form-actions" }, wv = "kickside.work.planning:plugin", $o = /* @__PURE__ */ ye({
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
    const t = e, l = a, o = M({}), d = M(""), f = M(""), m = M(""), u = M(/* @__PURE__ */ new Set()), i = M(/* @__PURE__ */ new Set()), c = L(() => t.options.map((W) => {
      const U = H(W.plugin);
      return { plugin: W, current: U, issue: li(W, U) };
    })), p = L(() => !!d.value || t.disabled), x = L(() => p.value || t.activationLocked), y = {}, S = L(() => (t.draft.item_types ?? []).filter((W) => !["issue", "sprint", "milestone"].includes(W.id)).map((W) => ({ value: W.id, label: W.title || Re(W.id) }))), w = L(() => ["current_sprint", "milestone"].every((W) => t.schema.compiled?.fields?.some((U) => U.code === W))), A = L(() => {
      const W = t.filters;
      return W ? (t.draft.scopes ?? []).filter((U) => !W.some((q) => q.id === U && t.options.some((ce) => ce.plugin === q.plugin))) : [];
    });
    function $(W) {
      return (t.filters ?? []).filter((U) => U.plugin === W);
    }
    function g(W, U) {
      const q = new Set($(W).map((Q) => Q.id)), ce = t.draft.scopes ?? [], ue = [...ce.filter((Q) => !q.has(Q)), ...U];
      (ue.length !== ce.length || ue.some((Q) => !ce.includes(Q))) && (t.draft.scopes = ue);
    }
    function k(W, U) {
      ke(W, { ...ve(W), issue_types: U });
    }
    function C(W) {
      return !!W.config_schema && Po(W.config_schema).length > 0;
    }
    function H(W) {
      return t.schema.plugins?.find((U) => U.plugin === W);
    }
    function P(W) {
      return H(W)?.active === !0;
    }
    function G(W) {
      return t.draft.plugins?.some((U) => U.use === W) === !0;
    }
    function ne(W, U) {
      const q = t.draft.plugins ?? [];
      U && !G(W) && (t.draft.plugins = [...q, { use: W }]), U || (t.draft.plugins = q.filter((ce) => ce.use !== W), delete t.configs[W], u.value.delete(W), l("validity", W, !0), g(W, []));
    }
    function re(W, U) {
      ne(W, !1), l("review", U.currentTarget);
    }
    function ve(W) {
      return P(W) ? o.value[W] ?? H(W)?.config ?? y : t.configs[W] ?? y;
    }
    function ke(W, U) {
      P(W) ? o.value[W] = U : t.configs[W] = U;
    }
    function oe(W, U) {
      U ? u.value.delete(W) : u.value.add(W), P(W) || l("validity", W, U);
    }
    async function z(W, U = !1) {
      if (!(p.value || !U && u.value.has(W))) {
        d.value = W, f.value = "", m.value = "";
        try {
          U ? await It.configure(t.boardId, W) : (await It.configure(t.boardId, W, ve(W)), delete o.value[W], i.value.delete(W)), m.value = U ? "Plugin recovery started." : "Plugin configuration saved.", l("configured");
        } catch (q) {
          f.value = ot(q, U ? "Could not recover the plugin." : "Could not configure plugin.");
        } finally {
          d.value = "";
        }
      }
    }
    return (W, U) => (n(), b("section", tv, [
      s("header", av, [
        U[2] || (U[2] = s("div", null, [
          s("h3", null, "Board capabilities"),
          s("p", { class: "work-muted" }, "Turn on tools for this board and choose where they apply.")
        ], -1)),
        h(r(_), {
          label: "Refresh status",
          severity: "secondary",
          outlined: "",
          disabled: !!d.value || e.disabled,
          onClick: U[0] || (U[0] = (q) => l("refresh"))
        }, {
          icon: K(() => [
            h(r(de), {
              icon: "tabler:refresh",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        }, 8, ["disabled"])
      ]),
      e.options.length ? I("", !0) : (n(), b("p", lv, "No installed plugins are visible to you.")),
      f.value ? (n(), b("div", ov, D(f.value), 1)) : I("", !0),
      m.value ? (n(), b("p", iv, D(m.value), 1)) : I("", !0),
      h(ll, {
        columns: "plugins",
        count: e.options.length
      }, {
        default: K(() => [
          (n(!0), b(te, null, se(c.value, ({ plugin: q, current: ce, issue: ue }) => (n(), J(al, {
            key: q.plugin,
            title: q.installed === !1 ? q.plugin : q.title || q.plugin,
            description: q.description,
            kind: G(q.plugin) !== P(q.plugin) ? "Pending review" : ue?.status ?? (P(q.plugin) ? "On" : "Off"),
            class: "work-stack"
          }, {
            actions: K(() => [
              ue?.kind !== "missing" ? (n(), b("label", nv, [
                h(r(_e), {
                  "model-value": G(q.plugin),
                  "aria-label": "Enable " + (q.title || "plugin"),
                  disabled: x.value || !!q.problem && !G(q.plugin),
                  "onUpdate:modelValue": (Q) => ne(q.plugin, Q)
                }, null, 8, ["model-value", "aria-label", "disabled", "onUpdate:modelValue"]),
                U[3] || (U[3] = B("On this board ", -1))
              ])) : I("", !0)
            ]),
            default: K(() => [
              q.requires.length ? (n(), b("p", sv, "Requires " + D(q.requires.map((Q) => e.options.find((we) => we.plugin === Q)?.title || "Another capability").join(", ")), 1)) : I("", !0),
              ce?.outdated ? (n(), b("p", rv, "The stored declaration differs from the installed plugin. Review activation to update it.")) : I("", !0),
              ue || ce?.active ? (n(), b("div", dv, [
                ue && "cause" in ue ? (n(), b("p", uv, D(ue.cause), 1)) : ue ? I("", !0) : (n(), b("p", cv, D(ce?.lifecycle.state === "ready" ? "Ready to use" : "Getting ready"), 1)),
                (n(!0), b(te, null, se(ce?.projections, (Q, we) => (n(), b("div", {
                  key: we,
                  class: "work-stack work-tight"
                }, [
                  s("p", null, D(r(Vo)(Q, e.schema.as_of)) + " · Indexed through " + D(Q.last_seq) + " of " + D(e.schema.as_of) + " events.", 1)
                ]))), 128)),
                ue?.kind === "setup" && ce?.active ? (n(), b("div", vv, [
                  h(r(_), {
                    label: "Retry setup",
                    severity: "secondary",
                    outlined: "",
                    disabled: p.value,
                    onClick: (Q) => z(q.plugin, !0)
                  }, null, 8, ["disabled", "onClick"])
                ])) : ue?.kind === "provider" ? (n(), b("div", mv, [
                  h(r(_), {
                    label: "Retry schema check",
                    severity: "secondary",
                    outlined: "",
                    disabled: p.value,
                    onClick: U[1] || (U[1] = (Q) => l("refresh"))
                  }, null, 8, ["disabled"])
                ])) : ue?.kind === "degraded" ? (n(), J(ze, {
                  key: 4,
                  class: "work-small",
                  label: "Inspect worker"
                }, {
                  default: K(() => [
                    U[4] || (U[4] = s("p", null, "Check the failing worker before resetting a projection.", -1)),
                    (n(!0), b(te, null, se(ce?.projections, (Q, we) => (n(), b("p", { key: we }, D(we) + " · " + D(r(Vo)(Q, e.schema.as_of)), 1))), 128))
                  ]),
                  _: 2
                }, 1024)) : ue?.kind === "history" ? (n(), b(te, { key: 5 }, [
                  ue.floor !== void 0 ? (n(), b("p", fv, "Earliest retained event sequence is " + D(ue.floor) + ".", 1)) : I("", !0),
                  h(ze, {
                    class: "work-small",
                    label: "Review retained history"
                  }, {
                    default: K(() => [...U[5] || (U[5] = [
                      s("p", null, "Ask the plugin maintainer to review the event projection’s start sequence. The plugin needs a declaration that can run with the retained history.", -1)
                    ])]),
                    _: 1
                  })
                ], 64)) : ue?.kind === "reset" ? (n(), b("div", pv, [
                  h(r(_), {
                    label: "Reset projection",
                    severity: "secondary",
                    outlined: "",
                    disabled: p.value,
                    onClick: (Q) => z(q.plugin, !0)
                  }, null, 8, ["disabled", "onClick"]),
                  U[6] || (U[6] = s("span", { class: "work-muted work-small" }, "Resolve the worker error before resetting.", -1))
                ])) : ue?.kind === "configuration" && G(q.plugin) && C(q) && !i.value.has(q.plugin) ? (n(), b("div", bv, [
                  h(r(_), {
                    label: "Edit configuration",
                    severity: "secondary",
                    outlined: "",
                    disabled: p.value,
                    onClick: (Q) => i.value.add(q.plugin)
                  }, null, 8, ["disabled", "onClick"])
                ])) : ue?.kind === "missing" && G(q.plugin) ? (n(), b("div", hv, [
                  h(r(_), {
                    label: "Review references",
                    severity: "secondary",
                    outlined: "",
                    disabled: x.value,
                    onClick: (Q) => re(q.plugin, Q)
                  }, null, 8, ["disabled", "onClick"])
                ])) : I("", !0)
              ])) : I("", !0),
              $(q.plugin).length && (G(q.plugin) || P(q.plugin)) ? (n(), b("section", gv, [
                U[7] || (U[7] = s("h4", null, "Query filters", -1)),
                U[8] || (U[8] = s("p", { class: "work-muted" }, "Choose which filters people can use to narrow down work on this board.", -1)),
                h(mt, {
                  label: "Available filters",
                  disabled: !!d.value || e.disabled || !G(q.plugin),
                  options: $(q.plugin).map((Q) => ({ value: Q.id, label: Q.title })),
                  "model-value": e.draft.scopes?.filter((Q) => $(q.plugin).some((we) => we.id === Q)),
                  "onUpdate:modelValue": (Q) => g(q.plugin, Q)
                }, null, 8, ["disabled", "options", "model-value", "onUpdate:modelValue"])
              ])) : I("", !0),
              G(q.plugin) && C(q) && ue?.kind !== "manifest" && ue?.kind !== "missing" && (ue?.kind !== "configuration" || i.value.has(q.plugin)) ? (n(), J(Ta(ue && ue.kind !== "configuration" ? ze : "div"), {
                key: 4,
                label: ue && ue.kind !== "configuration" ? "Plugin settings" : void 0,
                class: "work-stack work-tight"
              }, {
                default: K(() => [
                  q.plugin === wv ? (n(), b(te, { key: 0 }, [
                    w.value ? (n(), J(mt, {
                      key: 1,
                      label: "Plan these item types",
                      options: S.value,
                      "model-value": ve(q.plugin).issue_types,
                      disabled: !!d.value || e.disabled,
                      "onUpdate:modelValue": (Q) => k(q.plugin, Q)
                    }, null, 8, ["options", "model-value", "disabled", "onUpdate:modelValue"])) : (n(), b("p", yv, "The Planning pack supplies sprint and milestone fields for item types.")),
                    U[9] || (U[9] = s("p", { class: "work-muted" }, "Selected types get Current sprint and Milestone fields.", -1))
                  ], 64)) : (n(), J(Oo, {
                    key: 1,
                    disabled: !!d.value || e.disabled,
                    schema: q.config_schema,
                    "model-value": ve(q.plugin),
                    "onUpdate:modelValue": (Q) => ke(q.plugin, Q),
                    onValidity: (Q) => oe(q.plugin, Q)
                  }, null, 8, ["disabled", "schema", "model-value", "onUpdate:modelValue", "onValidity"])),
                  s("div", kv, [
                    h(r(_), {
                      label: ue ? "Reset form values" : "Reset",
                      severity: "secondary",
                      outlined: "",
                      disabled: !!d.value || e.disabled,
                      onClick: (Q) => ke(q.plugin, P(q.plugin) ? r(Bt)(H(q.plugin)?.config ?? {}) : {})
                    }, null, 8, ["label", "disabled", "onClick"]),
                    P(q.plugin) ? (n(), J(r(_), {
                      key: 0,
                      label: "Save plugin settings",
                      disabled: !!d.value || e.disabled || u.value.has(q.plugin) || !o.value[q.plugin],
                      loading: d.value === q.plugin,
                      onClick: (Q) => z(q.plugin)
                    }, null, 8, ["disabled", "loading", "onClick"])) : I("", !0)
                  ])
                ]),
                _: 2
              }, 1032, ["label"])) : I("", !0)
            ]),
            _: 2
          }, 1032, ["title", "description", "kind"]))), 128))
        ]),
        _: 1
      }, 8, ["count"]),
      A.value.length ? (n(), J(ze, {
        key: 3,
        class: "work-settings-card work-disclosure",
        label: "Unavailable query filters"
      }, {
        default: K(() => [
          U[10] || (U[10] = s("p", { class: "work-muted" }, "These filters came from a plugin that is unavailable. Remove one to stop using it on this board.", -1)),
          (n(!0), b(te, null, se(A.value, (q, ce) => (n(), J(r(_), {
            key: q,
            label: "Remove unavailable filter " + (ce + 1),
            severity: "secondary",
            text: "",
            onClick: (ue) => e.draft.scopes = e.draft.scopes?.filter((Q) => Q !== q)
          }, null, 8, ["label", "onClick"]))), 128))
        ]),
        _: 1
      })) : I("", !0),
      (n(!0), b(te, null, se(e.draft.plugins?.filter((q) => !e.options.some((ce) => ce.plugin === q.use)) ?? [], (q) => (n(), b("article", {
        key: q.use,
        class: "work-settings-card work-stack"
      }, [
        s("p", null, [
          s("strong", null, D(q.use), 1),
          U[11] || (U[11] = B(" · Not installed", -1))
        ]),
        U[12] || (U[12] = s("p", { class: "work-muted" }, "This board still references a plugin that is no longer installed.", -1)),
        h(r(_), {
          label: "Review references",
          severity: "secondary",
          outlined: "",
          disabled: x.value,
          onClick: (ce) => re(q.use, ce)
        }, null, 8, ["disabled", "onClick"])
      ]))), 128))
    ]));
  }
}), Vv = {
  key: 0,
  class: "work-dirty"
}, $v = /* @__PURE__ */ ye({
  __name: "SettingsActions",
  props: {
    dirty: { type: Boolean },
    busy: { type: Boolean },
    checkingRemoval: { type: Boolean },
    disabled: { type: Boolean }
  },
  emits: ["discard", "primary"],
  setup(e) {
    return (a, t) => (n(), b(te, null, [
      e.dirty ? (n(), b("span", Vv, "Unsaved changes")) : I("", !0),
      h(r(_), {
        class: "work-discard",
        label: "Discard",
        "aria-label": "Discard",
        title: "Discard",
        severity: "secondary",
        outlined: "",
        disabled: !e.dirty || e.busy || e.checkingRemoval,
        onClick: t[0] || (t[0] = (l) => a.$emit("discard"))
      }, {
        icon: K(() => [
          h(r(de), { icon: "tabler:restore" })
        ]),
        _: 1
      }, 8, ["disabled"]),
      h(r(_), {
        label: "Review changes",
        disabled: e.disabled,
        loading: e.busy,
        onClick: t[1] || (t[1] = (l) => a.$emit("primary", l.currentTarget))
      }, null, 8, ["disabled", "loading"])
    ], 64));
  }
}), xv = { class: "system-section-head work-ia-head" }, Cv = { class: "system-section-head-text" }, Sv = {
  key: 0,
  class: "kx-head-actions"
}, Tv = {
  key: 0,
  class: "kx-err work-ia-share-error",
  role: "alert"
}, Iv = ["config"], Uv = /* @__PURE__ */ ye({
  __name: "SettingsHead",
  props: {
    title: {},
    description: {},
    board: {},
    authorized: { type: Boolean },
    busy: { type: Boolean }
  },
  emits: ["shared"],
  setup(e, { expose: a }) {
    const t = e, l = M(!1), o = M(!1), d = M("");
    async function f() {
      const u = t.board;
      if (!(!t.authorized || !u || t.busy || o.value)) {
        o.value = !0, d.value = "";
        try {
          const i = await At("kickside-share");
          if (t.board?.board_id !== u.board_id || !t.authorized) return;
          i ? l.value = !0 : d.value = "Sharing is unavailable. Try opening it again.";
        } finally {
          o.value = !1;
        }
      }
    }
    Te([() => t.authorized, () => t.board?.board_id], () => {
      l.value = !1, d.value = "";
    });
    const m = L(() => {
      const u = encodeURIComponent(t.board?.board_id ?? "");
      return JSON.stringify({
        resource_id: t.board?.board_id,
        title: t.board?.title,
        access_url: "/api/v1/component-access/grants/" + u,
        share_url: "/api/v1/component-access/share/" + u
      });
    });
    return a({ share: f }), (u, i) => (n(), b(te, null, [
      s("header", xv, [
        s("div", Cv, [
          s("h1", null, D(e.title), 1),
          s("p", null, D(e.description), 1)
        ]),
        e.authorized && e.board ? (n(), b("div", Sv, [
          h(r(_), {
            label: "Share board",
            severity: "secondary",
            outlined: "",
            loading: o.value,
            disabled: e.busy,
            onClick: f
          }, {
            icon: K(() => [
              h(r(de), {
                icon: "tabler:share",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["loading", "disabled"]),
          it(u.$slots, "default")
        ])) : I("", !0)
      ]),
      d.value ? (n(), b("p", Tv, D(d.value), 1)) : I("", !0),
      l.value && e.authorized ? (n(), b("kickside-share", {
        key: 1,
        config: m.value,
        onClose: i[0] || (i[0] = (c) => l.value = !1),
        onChanged: i[1] || (i[1] = (c) => u.$emit("shared"))
      }, null, 40, Iv)) : I("", !0)
    ], 64));
  }
}), Dv = {
  key: 0,
  class: "work-muted"
}, Sa = /* @__PURE__ */ ye({
  __name: "SectionSummary",
  props: {
    facts: {}
  },
  setup(e) {
    return (a, t) => e.facts.length ? (n(), b("p", Dv, D(e.facts.join(" · ")), 1)) : I("", !0);
  }
}), Ev = {
  class: "work-stack",
  "aria-label": "Board visibility"
}, Av = { class: "work-stack work-tight" }, Ov = {
  key: 0,
  class: "work-row"
}, Pv = { class: "work-stack work-tight" }, Rv = { class: "work-settings-list" }, Nv = { class: "work-row-main" }, Mv = { class: "work-small work-muted" }, Fv = { class: "work-row-control" }, Lv = { class: "work-row" }, Bv = /* @__PURE__ */ ye({
  __name: "VisibilityEditor",
  props: {
    draft: {},
    boardId: {}
  },
  emits: ["validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = L(() => t.draft.visibility), d = L(() => (t.draft.fields ?? []).filter((p) => p.form === "text" && (!p.cardinality || p.cardinality === "one") && p.type !== "rollup" && p.index !== "number" && p.config?.case !== "insensitive")), f = M(""), m = L(() => d.value.find((p) => p.code === o.value?.field)?.type !== "option");
    function u() {
      !f.value || !o.value || o.value.levels.some((p) => p.id === f.value) || (o.value.levels.push({ id: f.value, holders: [] }), f.value = "");
    }
    function i(p) {
      if (!p) {
        delete t.draft.visibility;
        return;
      }
      const x = d.value.find((y) => y.code === p);
      t.draft.visibility = { field: p, levels: (x?.options ?? []).map((y) => ({ id: y.id, holders: [] })) };
    }
    function c(p, x) {
      const y = o.value?.levels.find((S) => S.id === p);
      y && (y.holders = x ?? []);
    }
    return (p, x) => (n(), b("section", Ev, [
      x[10] || (x[10] = s("h3", { class: "work-group-title" }, "Board visibility", -1)),
      x[11] || (x[11] = s("p", { class: "work-small work-muted" }, "Restrict items by their visibility level. People still need access to the board.", -1)),
      s("label", Av, [
        x[7] || (x[7] = B("Visibility field", -1)),
        h(r(me), {
          "aria-label": "Visibility field",
          placeholder: "No additional restriction",
          "model-value": o.value?.field ?? "",
          options: [{ label: "No additional restriction", value: "" }, ...d.value.map((y) => ({ label: r(Ye)(y), value: y.code }))],
          optionLabel: "label",
          optionValue: "value",
          appendTo: "self",
          "onUpdate:modelValue": x[0] || (x[0] = (y) => i(y))
        }, null, 8, ["model-value", "options"])
      ]),
      o.value ? (n(), b(te, { key: 0 }, [
        m.value ? (n(), b("div", Ov, [
          s("label", Pv, [
            x[8] || (x[8] = B("Level ID", -1)),
            h(r(ge), {
              modelValue: f.value,
              "onUpdate:modelValue": x[1] || (x[1] = (y) => f.value = y),
              "aria-label": "New visibility level",
              onKeydown: Oe(Ie(u, ["prevent"]), ["enter"])
            }, null, 8, ["modelValue", "onKeydown"])
          ]),
          h(r(_), {
            label: "Add level",
            severity: "secondary",
            outlined: "",
            disabled: !f.value || o.value.levels.some((y) => y.id === f.value),
            onClick: u
          }, null, 8, ["disabled"])
        ])) : I("", !0),
        s("div", Rv, [
          (n(!0), b(te, null, se(o.value.levels, (y, S) => (n(), b("div", {
            key: y.id,
            class: "work-settings-row"
          }, [
            s("div", Nv, [
              s("strong", null, D(d.value.find((w) => w.code === o.value.field)?.options?.find((w) => w.id === y.id)?.label || y.id), 1),
              s("p", Mv, "Level " + D(S + 1), 1)
            ]),
            s("div", Fv, [
              h(Lo, {
                "board-id": e.boardId,
                label: "Who can see these items",
                "model-value": y.holders,
                "onUpdate:modelValue": (w) => c(y.id, w),
                onValidity: x[2] || (x[2] = (w) => l("validity", w))
              }, null, 8, ["board-id", "model-value", "onUpdate:modelValue"])
            ])
          ]))), 128))
        ]),
        s("label", Lv, [
          h(r(_e), {
            "model-value": o.value.bypass === "admin",
            "onUpdate:modelValue": x[3] || (x[3] = (y) => y ? o.value.bypass = "admin" : delete o.value.bypass)
          }, null, 8, ["model-value"]),
          x[9] || (x[9] = B("Board administrators can see every level", -1))
        ]),
        h(r(_), {
          label: "Remove visibility restriction",
          severity: "secondary",
          text: "",
          onClick: x[4] || (x[4] = (y) => delete e.draft.visibility)
        })
      ], 64)) : I("", !0),
      h(Ot, {
        label: "Visibility rules",
        "model-value": o.value,
        shape: "object",
        example: { field: "visibility", levels: [{ id: "internal", holders: [] }], bypass: "admin" },
        "onUpdate:modelValue": x[5] || (x[5] = (y) => e.draft.visibility = y),
        onValidity: x[6] || (x[6] = (y) => l("validity", y))
      }, null, 8, ["model-value"])
    ]));
  }
}), zv = { class: "work-ia-section" }, jv = {
  class: "work-settings-list",
  "aria-labelledby": "work-sharing-title"
}, Wv = { class: "work-settings-row" }, qv = {
  key: 0,
  class: "work-member-preview",
  "aria-label": "People and groups with direct access"
}, Kv = { class: "work-spacer" }, Gv = {
  key: 1,
  class: "work-chips"
}, Hv = {
  key: 1,
  class: "work-settings-row work-muted work-small"
}, Yv = {
  key: 2,
  class: "work-settings-row work-muted"
}, Xv = {
  key: 3,
  class: "work-settings-row"
}, Jv = {
  key: 4,
  class: "work-settings-row work-muted",
  role: "status"
}, Zv = /* @__PURE__ */ ye({
  __name: "BoardAccessSettings",
  props: {
    boardId: {},
    draft: {},
    active: { type: Boolean },
    grantsVersion: {}
  },
  emits: ["share", "validity"],
  setup(e) {
    const a = e, t = M(), l = M([]), o = L(() => t.value?.filter((w) => w.subject_type === "group").length ?? 0), d = L(() => (t.value?.length ?? 0) - o.value), f = L(() => [...t.value ?? []].sort((w, A) => +!!A.owner - +!!w.owner || A.access_mask - w.access_mask).slice(0, 6)), m = L(() => f.value.map((w) => ({ id: w.subject_id, kind: w.subject_type ?? "user" }))), u = Ro(() => a.boardId, m);
    function i(w) {
      return w.full_name || u.label({ id: w.subject_id, kind: w.subject_type ?? "user", email: w.email });
    }
    function c(w) {
      return l.value.filter((A) => (w.access_mask & A.bit) === A.bit);
    }
    const p = M(!1), x = ka(), y = L(() => [
      ...t.value ? [
        d.value + (d.value === 1 ? " person with direct access" : " people with direct access"),
        o.value + (o.value === 1 ? " group with access" : " groups with access")
      ] : [p.value ? "Member summary unavailable" : "Loading members…"],
      a.draft.visibility ? "Item visibility rules set" : "No item visibility rules"
    ]);
    async function S() {
      const w = x();
      p.value = !1;
      try {
        const [{ data: A }, $] = await Promise.all([
          Dl.get("/api/v1/component-access/grants/" + encodeURIComponent(a.boardId)),
          Dl.get("/api/v1/components/access-model")
        ]);
        if (!w()) return;
        if (!A?.success || !Array.isArray(A.access)) throw new Error("Grants unavailable");
        t.value = A.access, l.value = $.data?.success && Array.isArray($.data.capabilities) ? $.data.capabilities : [];
      } catch {
        w() && (t.value = void 0, p.value = !0);
      }
    }
    return Fl(() => x()), Te(() => [a.active, a.boardId, a.grantsVersion], () => {
      a.active && S();
    }, { immediate: !0 }), (w, A) => (n(), b("section", zv, [
      h(Sa, { facts: y.value }, null, 8, ["facts"]),
      s("section", jv, [
        s("div", Wv, [
          A[2] || (A[2] = s("div", { class: "work-row-main" }, [
            s("h3", {
              id: "work-sharing-title",
              class: "work-row-title"
            }, "Members and sharing"),
            s("p", { class: "work-muted work-small" }, "Invite people and groups, or change the access they already have.")
          ], -1)),
          h(r(_), {
            label: "Manage access",
            severity: "secondary",
            outlined: "",
            onClick: A[0] || (A[0] = ($) => w.$emit("share"))
          }, {
            icon: K(() => [
              h(r(de), {
                icon: "tabler:users",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          })
        ]),
        f.value.length ? (n(), b("ul", qv, [
          (n(!0), b(te, null, se(f.value, ($) => (n(), b("li", {
            key: $.subject_type + $.subject_id,
            class: "work-settings-row"
          }, [
            h(r(de), {
              icon: $.subject_type === "group" ? "tabler:users" : "tabler:user",
              "aria-hidden": "true"
            }, null, 8, ["icon"]),
            s("strong", Kv, D(i($)), 1),
            $.owner ? (n(), J(r(We), {
              key: 0,
              severity: "secondary",
              value: "Owner"
            })) : (n(), b("span", Gv, [
              (n(!0), b(te, null, se(c($), (g) => (n(), J(r(We), {
                key: g.key,
                severity: "secondary",
                value: g.label
              }, null, 8, ["value"]))), 128))
            ]))
          ]))), 128))
        ])) : I("", !0),
        t.value && t.value.length > f.value.length ? (n(), b("p", Hv, " See all " + D(t.value.length) + " people and groups in Manage access. ", 1)) : t.value && !t.value.length ? (n(), b("p", Yv, "No direct grants yet.")) : p.value ? (n(), b("div", Xv, [
          A[3] || (A[3] = s("p", {
            class: "work-spacer work-muted",
            role: "alert"
          }, "Member summary is unavailable.", -1)),
          h(r(_), {
            label: "Reload members",
            severity: "secondary",
            text: "",
            onClick: S
          })
        ])) : t.value ? I("", !0) : (n(), b("p", Jv, "Loading members…"))
      ]),
      h(ze, {
        class: "work-settings-card work-disclosure",
        label: "Advanced · Item visibility"
      }, {
        default: K(() => [
          h(Bv, {
            "board-id": e.boardId,
            draft: e.draft,
            onValidity: A[1] || (A[1] = ($) => w.$emit("validity", $))
          }, null, 8, ["board-id", "draft"])
        ]),
        _: 1
      })
    ]));
  }
}), Qv = { class: "work-board-identity work-stack work-tight" }, _v = { class: "work-stack work-tight" }, em = { class: "work-stack work-tight" }, tm = { class: "work-stack work-tight" }, am = ["value", "inert"], lm = {
  key: 1,
  class: "work-muted work-small"
}, om = {
  key: 0,
  class: "work-stack work-tight"
}, im = { class: "work-row" }, nm = {
  key: 1,
  class: "work-row work-wrap work-identity-detail"
}, sm = { class: "work-spacer" }, rm = { class: "work-row" }, dm = { class: "work-row work-board-title" }, um = {
  key: 1,
  class: "work-identity-actions"
}, cm = ["title"], vm = {
  key: 3,
  class: "kx-err work-inline",
  role: "alert"
}, mm = {
  key: 4,
  class: "work-muted work-small",
  role: "status"
}, fm = /* @__PURE__ */ ye({
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
    const t = e, l = a, o = M(!1), d = M(""), f = M(""), m = M(""), u = M(""), i = M(!1), c = M(!1), p = M(""), x = M(""), y = L(() => t.board?.access?.admin === !0), S = M({ title: "", description: "", icon: "", app: "" }), w = L(() => [
      { id: "", title: "Installation default" },
      ...t.boardApps ?? [],
      ...t.board?.ui_app && !t.boardApps?.some((P) => P.id === t.board?.ui_app) ? [{ id: t.board.ui_app, title: t.boardApps ? "Unavailable app" : "Configured board app", disabled: !0 }] : []
    ]), A = L(() => w.value.find((P) => P.id === (t.board?.ui_app ?? ""))?.title), $ = L(() => !!t.boardApps?.length || !!t.board?.ui_app);
    function g() {
      S.value = { title: t.board?.title ?? "", icon: t.board?.icon ?? "", description: t.board?.description ?? "", app: t.board?.ui_app ?? "" }, d.value = S.value.title, m.value = S.value.icon, f.value = S.value.description, u.value = S.value.app, p.value = "", x.value = "", o.value = !0, At("wc-icon-picker").then((P) => i.value = P);
    }
    const k = L(() => {
      const P = {};
      return d.value.trim() !== S.value.title && (P.title = d.value.trim()), f.value !== S.value.description && (P.description = f.value), m.value !== S.value.icon && (P.icon = m.value), u.value !== S.value.app && (P.ui_app = u.value), P;
    });
    Te(y, (P) => {
      P || C();
    }), Te(() => o.value && Object.keys(k.value).length > 0, (P) => l("dirty-change", P));
    function C() {
      o.value = !1, p.value = "";
    }
    async function H() {
      if (!y.value || !t.board || c.value || !d.value.trim()) return;
      const P = k.value;
      if (!Object.keys(P).length) {
        o.value = !1, x.value = "Nothing changed.";
        return;
      }
      c.value = !0, p.value = "";
      try {
        const G = await Vt.updateBoard(t.board.board_id, P);
        o.value = !1, x.value = G.status === "unchanged" ? "Nothing changed." : "Board saved.", l("saved");
      } catch (G) {
        p.value = ot(G, "Could not save the board.");
      } finally {
        c.value = !1;
      }
    }
    return (P, G) => (n(), b("div", Qv, [
      o.value ? (n(), b("form", {
        key: 0,
        class: "work-identity-edit",
        "aria-label": "Edit board",
        onClick: G[4] || (G[4] = Ie(() => {
        }, ["stop"])),
        onSubmit: Ie(H, ["prevent"])
      }, [
        s("label", _v, [
          G[5] || (G[5] = B("Title", -1)),
          h(r(ge), {
            modelValue: d.value,
            "onUpdate:modelValue": G[0] || (G[0] = (ne) => d.value = ne),
            required: "",
            autofocus: "",
            disabled: c.value
          }, null, 8, ["modelValue", "disabled"])
        ]),
        s("label", em, [
          G[6] || (G[6] = B("Description", -1)),
          h(r(Ya), {
            modelValue: f.value,
            "onUpdate:modelValue": G[1] || (G[1] = (ne) => f.value = ne),
            rows: "1",
            disabled: c.value
          }, null, 8, ["modelValue", "disabled"])
        ]),
        s("div", tm, [
          G[7] || (G[7] = s("span", null, "Board icon", -1)),
          i.value ? (n(), b("wc-icon-picker", {
            key: 0,
            value: m.value,
            fallback: "tabler:layout-kanban",
            inert: c.value || void 0,
            onSelect: G[2] || (G[2] = (ne) => m.value = ne.detail)
          }, null, 40, am)) : (n(), b("p", lm, "The icon picker is unavailable."))
        ]),
        e.detail && $.value ? (n(), b("label", om, [
          G[8] || (G[8] = B("Open board in ", -1)),
          h(r(me), {
            modelValue: u.value,
            "onUpdate:modelValue": G[3] || (G[3] = (ne) => u.value = ne),
            "aria-label": "Open board in",
            options: w.value,
            optionLabel: "title",
            optionValue: "id",
            optionDisabled: "disabled",
            appendTo: "self",
            disabled: c.value
          }, null, 8, ["modelValue", "options", "disabled"]),
          G[9] || (G[9] = s("span", { class: "work-muted work-small" }, "This is where people open the board from Work navigation.", -1))
        ])) : I("", !0),
        s("div", im, [
          h(r(_), {
            label: "Save",
            severity: "secondary",
            type: "submit",
            disabled: !d.value.trim() || c.value,
            loading: c.value,
            outlined: ""
          }, {
            icon: K(() => [
              h(r(de), {
                icon: "tabler:device-floppy",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled", "loading"]),
          h(r(_), {
            label: "Cancel",
            severity: "secondary",
            disabled: c.value,
            onClick: C,
            outlined: ""
          }, {
            icon: K(() => [
              h(r(de), {
                icon: "tabler:x",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled"])
        ])
      ], 32)) : e.detail ? (n(), b("div", nm, [
        s("p", sm, [
          G[10] || (G[10] = B("Opens in ", -1)),
          s("strong", null, D(A.value), 1)
        ]),
        y.value ? (n(), J(r(_), {
          key: 0,
          label: "Edit board",
          severity: "secondary",
          outlined: "",
          onClick: Ie(g, ["stop"])
        }, {
          icon: K(() => [
            h(r(de), {
              icon: "tabler:pencil",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        })) : I("", !0)
      ])) : (n(), b(te, { key: 2 }, [
        s("div", rm, [
          s("div", dm, [
            e.board?.icon ? (n(), J(r(de), {
              key: 0,
              icon: e.board.icon,
              "aria-hidden": "true"
            }, null, 8, ["icon"])) : I("", !0),
            (n(), J(Ta(e.compact ? "h2" : "h1"), {
              class: ft(e.compact ? "kx-card-name" : "kx-title")
            }, {
              default: K(() => [
                B(D(e.board?.title || "Untitled board"), 1)
              ]),
              _: 1
            }, 8, ["class"]))
          ]),
          e.compact ? it(P.$slots, "title-end", {}, void 0, void 0, 0) : I("", !0),
          e.compact ? (n(), b("span", um, [
            y.value ? (n(), J(r(_), {
              key: 0,
              severity: "secondary",
              text: "",
              size: "small",
              onClick: Ie(g, ["stop"]),
              "aria-label": "Edit board"
            }, {
              default: K(() => [
                h(r(de), {
                  icon: "tabler:pencil",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            })) : I("", !0),
            it(P.$slots, "actions")
          ])) : y.value ? (n(), J(r(_), {
            key: 2,
            severity: "secondary",
            text: "",
            size: "small",
            onClick: Ie(g, ["stop"]),
            "aria-label": "Edit board"
          }, {
            default: K(() => [
              h(r(de), {
                icon: "tabler:pencil",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          })) : I("", !0),
          e.compact ? I("", !0) : it(P.$slots, "title-end", {}, void 0, void 0, 3)
        ]),
        !e.compact && (e.subtitle || e.board?.description) ? (n(), b("p", {
          key: 0,
          class: "kx-head-sub",
          title: e.subtitle || e.board?.description
        }, D(e.subtitle || e.board?.description), 9, cm)) : I("", !0)
      ], 64)),
      p.value ? (n(), b("p", vm, D(p.value), 1)) : I("", !0),
      x.value ? (n(), b("p", mm, D(x.value), 1)) : I("", !0)
    ]));
  }
}), pm = { class: "work-ia-section work-ia-general" }, bm = { class: "work-overview" }, hm = { class: "work-overview-main work-stack" }, gm = {
  class: "work-settings-list",
  "aria-label": "Board at a glance"
}, ym = { class: "work-settings-row" }, km = { class: "work-row-main" }, wm = {
  key: 0,
  class: "work-small work-muted"
}, Vm = {
  key: 0,
  class: "work-overview-breakdown"
}, $m = { class: "work-overview-counts" }, xm = {
  key: 0,
  class: "work-muted work-small"
}, Cm = { class: "work-overview-counts" }, Sm = {
  key: 0,
  class: "work-muted"
}, Tm = {
  key: 0,
  class: "work-muted work-small"
}, Im = {
  key: 1,
  class: "work-settings-row"
}, Um = { class: "work-muted" }, Dm = {
  class: "work-settings-list",
  "aria-label": "Recent setup changes"
}, Em = {
  key: 0,
  class: "work-settings-row work-muted"
}, Am = { class: "work-overview-details work-stack" }, Om = {
  class: "work-settings-list",
  "aria-label": "Board details"
}, Pm = { class: "work-settings-row work-overview-identity" }, Rm = { class: "work-stack work-tight" }, Nm = { class: "work-row-title" }, Mm = {
  key: 0,
  class: "work-muted"
}, Fm = { class: "work-settings-row" }, Lm = { class: "work-row-main" }, Bm = { class: "work-muted work-small" }, zm = { class: "work-settings-row" }, jm = { class: "work-row-main" }, Wm = { class: "work-muted work-small" }, qm = { key: 0 }, Km = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, Gm = {
  class: "work-settings-list",
  "aria-label": "Board plugins"
}, Hm = { class: "work-spacer" }, Ym = {
  key: 0,
  class: "work-settings-row work-muted"
}, Xm = { class: "work-stack work-tight" }, Jm = { class: "work-spacer" }, Zm = /* @__PURE__ */ ye({
  __name: "GeneralSettings",
  props: {
    draft: {},
    schema: {},
    board: {},
    boardApps: {},
    active: { type: Boolean },
    counts: {},
    countsError: { type: Boolean },
    draftForm: {},
    disabled: { type: Boolean },
    packTitle: {},
    outdated: { type: Boolean },
    upgradeReason: {},
    canUpgrade: { type: Boolean },
    canInstall: { type: Boolean },
    packError: {}
  },
  emits: ["upgrade", "install", "retry", "reloadCounts", "saved", "dirty-change"],
  setup(e) {
    const a = e, t = {
      comments_per_item: "Comments per item",
      audit: "Change history",
      audit_days: "Change history retention",
      interval_days: "Time-in-state history retention",
      trash_days: "Trash retention",
      tombstone_days: "Deletion record retention"
    }, l = L(() => Object.keys(t).filter(($) => a.draft.policy?.[$] !== void 0));
    function o($) {
      const g = a.draft.policy?.[$];
      return $ === "audit" ? g === "off" ? "Off" : "Track field changes" : $ === "comments_per_item" ? g : g === 0 ? $ === "audit_days" || $ === "interval_days" ? "365 days" : "Clean up immediately" : g === 1 ? "1 day" : g + " days";
    }
    const d = L(() => (a.schema.plugins ?? []).filter(($) => $.active).map(($) => ({ plugin: $, issue: li($, $) }))), f = L(() => d.value.filter(({ plugin: $ }) => $.installed).length), m = L(() => a.schema.declaration.item_types ?? []), u = L(() => m.value.map(($) => ({
      id: $.id,
      title: $.title || "Untitled item type",
      count: Object.values(a.counts?.[$.id] ?? {}).reduce((g, k) => g + k, 0)
    }))), i = L(() => (a.schema.declaration.processes ?? []).flatMap(($) => {
      const g = m.value.filter((k) => k.process === $.id);
      return $.states.map((k) => ({
        id: $.id + "/" + k.id,
        title: he(k),
        process: $.name || "Untitled workflow",
        count: g.reduce((C, H) => C + (a.counts?.[H.id]?.[k.id] ?? 0), 0)
      }));
    })), c = L(() => [
      ...typeof a.board?.item_count == "number" ? [a.board.item_count + " items"] : [],
      m.value.length + (m.value.length === 1 ? " item type" : " item types"),
      i.value.length + (i.value.length === 1 ? " state" : " states"),
      f.value + (f.value === 1 ? " plugin on" : " plugins on")
    ]), p = M(), x = M(!1);
    let y = "";
    Te([() => a.active, () => a.board?.board_id, () => a.schema.generation], async ([$, g, k], C, H) => {
      if (!$ || !g || y === g + "/" + k) return;
      p.value = void 0, x.value = !1;
      let P = !0;
      H(() => P = !1);
      try {
        const G = await Promise.all(Array.from(
          { length: Math.min(3, Math.max(0, k - 1)) },
          (ne, re) => Vt.schema(g, k - re - 1)
        ));
        P && (p.value = G, y = g + "/" + k);
      } catch {
        P && (x.value = !0);
      }
    }, { immediate: !0 });
    function S($) {
      return JSON.stringify($, (g, k) => k && typeof k == "object" && !Array.isArray(k) ? Object.fromEntries(Object.entries(k).sort(([C], [H]) => C.localeCompare(H))) : k);
    }
    function w($, g) {
      if (!g) return ["Initial board setup"];
      const k = $.declaration, C = g.declaration, H = [], P = [
        ["Fields", k.fields, C.fields],
        ["Item types", k.item_types, C.item_types],
        ["Workflow", k.processes, C.processes],
        ["Links", k.relation_types, C.relation_types],
        ["Plugins and filters", [k.plugins, k.scopes], [C.plugins, C.scopes]],
        ["Item visibility", k.visibility, C.visibility],
        ["Board rules", k.policy, C.policy],
        ["Starting pack", $.pack, g.pack],
        ["Item key prefix", $.key_prefix, g.key_prefix]
      ];
      if (S(k.fields) !== S(C.fields)) {
        const ne = k.fields?.filter((re) => !C.fields?.some((ve) => ve.code === re.code)) ?? [];
        ne.length === 1 && H.push("Added " + Ye(ne[0]));
      }
      const G = P.filter(([, ne, re]) => S(ne) !== S(re)).map(([ne]) => ne).filter((ne) => ne !== "Fields" || !H.length);
      return G.length && H.push(G.join(", ") + " updated"), H.length ? H : ["Board setup updated"];
    }
    const A = L(() => {
      if (!p.value || a.schema.generation < 1) return [];
      const $ = [a.schema, ...p.value];
      return $.slice(0, 3).map((g, k) => w(g, $[k + 1]));
    });
    return ($, g) => (n(), b("section", pm, [
      h(Sa, { facts: c.value }, null, 8, ["facts"]),
      s("div", bm, [
        s("div", hm, [
          s("section", gm, [
            s("header", ym, [
              s("div", km, [
                g[7] || (g[7] = s("h3", { class: "work-row-title" }, "Board at a glance", -1)),
                e.board?.open_count !== void 0 ? (n(), b("p", wm, D(e.board.open_count) + " open · " + D(e.board.item_count) + " total", 1)) : I("", !0)
              ])
            ]),
            e.counts ? (n(), b("div", Vm, [
              s("section", null, [
                g[8] || (g[8] = s("h4", { class: "work-group-title" }, "Items by type", -1)),
                s("dl", $m, [
                  (n(!0), b(te, null, se(u.value, (k) => (n(), b("div", {
                    key: k.id
                  }, [
                    s("dt", null, D(k.title), 1),
                    s("dd", null, D(k.count), 1)
                  ]))), 128))
                ]),
                u.value.length ? I("", !0) : (n(), b("p", xm, "No item types yet."))
              ]),
              s("section", null, [
                g[9] || (g[9] = s("h4", { class: "work-group-title" }, "Items by state", -1)),
                s("dl", Cm, [
                  (n(!0), b(te, null, se(i.value, (k) => (n(), b("div", {
                    key: k.id
                  }, [
                    s("dt", null, [
                      B(D(k.title) + " ", 1),
                      (e.schema.declaration.processes?.length ?? 0) > 1 ? (n(), b("small", Sm, D(k.process), 1)) : I("", !0)
                    ]),
                    s("dd", null, D(k.count), 1)
                  ]))), 128))
                ]),
                i.value.length ? I("", !0) : (n(), b("p", Tm, "No workflow states yet."))
              ])
            ])) : (n(), b("div", Im, [
              s("p", Um, D(e.countsError ? "Item breakdown is unavailable." : "Loading item breakdown…"), 1),
              e.countsError ? (n(), J(r(_), {
                key: 0,
                label: "Reload counts",
                severity: "secondary",
                text: "",
                onClick: g[0] || (g[0] = (k) => $.$emit("reloadCounts"))
              })) : I("", !0)
            ]))
          ]),
          s("section", Dm, [
            g[10] || (g[10] = s("header", { class: "work-settings-row" }, [
              s("h3", { class: "work-row-title" }, "Recent setup changes")
            ], -1)),
            (n(!0), b(te, null, se(A.value, (k, C) => (n(), b("div", {
              key: C,
              class: "work-settings-row work-overview-change"
            }, [
              h(r(de), {
                icon: "tabler:history",
                "aria-hidden": "true"
              }),
              s("span", null, D(k.join(" · ")), 1),
              C === 0 && A.value.length > 1 ? (n(), J(r(We), {
                key: 0,
                severity: "secondary",
                value: "Latest"
              })) : I("", !0)
            ]))), 128)),
            A.value.length ? I("", !0) : (n(), b("p", Em, D(x.value ? "Recent changes are unavailable." : p.value ? "No setup changes yet." : "Loading recent changes…"), 1))
          ])
        ]),
        s("div", Am, [
          s("section", Om, [
            s("div", Pm, [
              s("div", Rm, [
                s("h3", Nm, D(e.board?.title || "Board details"), 1),
                e.board?.description ? (n(), b("p", Mm, D(e.board.description), 1)) : I("", !0)
              ]),
              (n(), J(fm, {
                key: e.board?.board_id,
                board: e.board,
                "board-apps": e.boardApps,
                detail: "",
                onDirtyChange: g[1] || (g[1] = (k) => $.$emit("dirty-change", k)),
                onSaved: g[2] || (g[2] = (k) => $.$emit("saved"))
              }, null, 8, ["board", "board-apps"]))
            ]),
            s("div", Fm, [
              s("div", Lm, [
                g[11] || (g[11] = s("h3", { class: "work-row-title" }, "Item key prefix", -1)),
                s("p", Bm, "Shown on items, for example " + D(e.draft.key_prefix || "WORK") + "-1.", 1)
              ]),
              h(r(ge), {
                modelValue: e.draft.key_prefix,
                "onUpdate:modelValue": g[3] || (g[3] = (k) => e.draft.key_prefix = k),
                form: e.draftForm,
                disabled: e.disabled,
                "aria-label": "Item key prefix",
                required: "",
                pattern: "[A-Z][A-Z0-9]{1,9}",
                maxlength: "10"
              }, null, 8, ["modelValue", "form", "disabled"])
            ]),
            s("div", zm, [
              s("div", jm, [
                g[12] || (g[12] = s("h3", { class: "work-row-title" }, "Starting setup", -1)),
                s("p", Wm, [
                  B(D(e.packTitle || "Custom setup"), 1),
                  e.outdated ? (n(), b("span", qm, " · Update available")) : I("", !0)
                ])
              ]),
              e.packError ? (n(), b("p", Km, D(e.packError), 1)) : I("", !0),
              e.packError ? (n(), J(r(_), {
                key: 1,
                label: "Reload packs",
                severity: "secondary",
                outlined: "",
                onClick: g[4] || (g[4] = (k) => $.$emit("retry"))
              })) : e.packTitle ? e.outdated ? (n(), J(r(_), {
                key: 3,
                label: "Update pack",
                severity: "secondary",
                outlined: "",
                disabled: !e.canUpgrade,
                title: e.upgradeReason,
                onClick: g[6] || (g[6] = (k) => $.$emit("upgrade"))
              }, null, 8, ["disabled", "title"])) : I("", !0) : (n(), J(r(_), {
                key: 2,
                label: "Install pack",
                severity: "secondary",
                outlined: "",
                disabled: !e.canInstall,
                onClick: g[5] || (g[5] = (k) => $.$emit("install"))
              }, null, 8, ["disabled"]))
            ])
          ]),
          s("section", Gm, [
            g[13] || (g[13] = s("header", { class: "work-settings-row" }, [
              s("h3", { class: "work-row-title" }, "Board plugins")
            ], -1)),
            (n(!0), b(te, null, se(d.value, ({ plugin: k, issue: C }) => (n(), b("div", {
              key: k.plugin,
              class: "work-settings-row work-overview-plugin"
            }, [
              h(r(de), {
                icon: k.icon || "tabler:puzzle",
                "aria-hidden": "true"
              }, null, 8, ["icon"]),
              s("span", Hm, D(k.installed === !1 ? k.plugin : k.title || k.plugin), 1),
              h(r(We), {
                severity: C ? "warn" : "secondary",
                value: C?.status ?? "On"
              }, null, 8, ["severity", "value"])
            ]))), 128)),
            d.value.length ? I("", !0) : (n(), b("p", Ym, "No plugins enabled."))
          ])
        ])
      ]),
      l.value.length ? (n(), J(ze, {
        key: 0,
        class: "work-settings-card work-disclosure",
        label: "Advanced · Existing board overrides"
      }, {
        default: K(() => [
          g[14] || (g[14] = s("p", { class: "work-muted" }, "Clear an override to use the Work application default.", -1)),
          s("ul", Xm, [
            (n(!0), b(te, null, se(l.value, (k) => (n(), b("li", {
              key: k,
              class: "work-row work-wrap"
            }, [
              s("span", Jm, D(t[k]) + " · " + D(o(k)), 1),
              h(r(_), {
                label: "Use default for " + t[k].toLowerCase(),
                disabled: e.disabled,
                size: "small",
                text: "",
                onClick: (C) => delete e.draft.policy[k]
              }, null, 8, ["label", "disabled", "onClick"])
            ]))), 128))
          ])
        ]),
        _: 1
      })) : I("", !0)
    ]));
  }
}), Be = (e, a) => `${e} → ${a}`, xo = (e, a) => {
  const t = e.fields?.find((l) => l.code === a);
  return t ? Ye(t) : "Untitled field";
}, Co = {
  comments_per_item: "Comments per item",
  stage_timeout: "Default attempt timeout",
  stage_max_visits: "Default maximum visits",
  audit: "Audit trail",
  audit_days: "Audit history",
  trash_days: "Keep trashed items",
  tombstone_days: "Keep deletion records",
  interval_days: "Keep state history"
};
function So(e, a) {
  if (a === void 0) return "Application default";
  if (e === "audit") return Re(String(a));
  if (e === "stage_timeout") {
    const t = ga(String(a));
    if (t) return `${t.amount.toLocaleString()} ${t.amount === 1 ? t.unit.slice(0, -1) : t.unit}`;
  }
  if (e.endsWith("_days")) {
    const t = a === 0 && (e === "audit_days" || e === "interval_days") ? 365 : a;
    return `${t} ${t === 1 ? "day" : "days"}`;
  }
  return String(a);
}
function Qm(e, a) {
  const t = e.policy ?? {}, l = a.policy ?? {}, o = Object.keys(Co).flatMap((m) => t[m] === l[m] ? [] : [`${Co[m]} · ${Be(So(m, t[m]), So(m, l[m]))}`]), d = (m) => m ? `${m.limit}${m.hard ? " (hard limit)" : ""}` : "No limit", f = /* @__PURE__ */ new Set([...Object.keys(t.wip ?? {}), ...Object.keys(l.wip ?? {})]);
  for (const m of f) {
    const u = d(t.wip?.[m]), i = d(l.wip?.[m]);
    if (u === i) continue;
    const c = (a.processes ?? []).flatMap((p) => p.states).find((p) => p.id === m) ?? (e.processes ?? []).flatMap((p) => p.states).find((p) => p.id === m);
    o.push(`${he(c)} limit · ${Be(u, i)}`);
  }
  return o;
}
function _m(e, a, t) {
  const l = e.visibility, o = a.visibility, d = [];
  l?.field !== o?.field && d.push(Be(
    l ? xo(e, l.field) : "No additional restriction",
    o ? xo(a, o.field) : "No additional restriction"
  ));
  const f = l?.levels ?? [], m = o?.levels ?? [], u = new Set([...f, ...m].map((i) => i.id));
  for (const i of u) {
    const c = f.find((w) => w.id === i), p = m.find((w) => w.id === i);
    if (c && p && JSON.stringify(c.holders) === JSON.stringify(p.holders)) continue;
    const x = (w) => w.fields?.find((A) => A.code === w.visibility?.field)?.options?.find((A) => A.id === i)?.label, y = x(a) || x(e) || Re(i), S = (w) => w ? w.holders.map(t).join(", ") || "No extra access" : "No level";
    d.push(`${y} · ${Be(S(c), S(p))}`);
  }
  return l?.bypass !== o?.bypass && d.push(o?.bypass === "admin" ? "Board administrators can see every level." : "Visibility levels now apply to board administrators."), d;
}
const ya = {
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
function ef(e, a, t) {
  const { what: l, detail: o, to: d } = e, m = `${t?.name || a?.name || "Untitled workflow"} · ${ya[l] ?? "Workflow changed"}`, u = l.startsWith("state.") ? a?.states.find((y) => y.id === o) : void 0, i = l.startsWith("state.") ? t?.states.find((y) => y.id === o) : void 0, c = l.startsWith("transition.") ? a?.transitions?.find((y) => y.id === o) : void 0, p = l.startsWith("transition.") ? t?.transitions?.find((y) => y.id === o) : void 0;
  let x = "";
  return l === "state.map" ? x = Be(he(u), he(t?.states.find((y) => y.id === d))) : l === "state.name" ? x = Be(he(u), he(i)) : l === "state.kind" ? x = `${he(i)} · ${Be(Ha(u?.kind), Ha(i?.kind))}` : l === "state.category" && u && i ? x = `${he(i)} · ${Be(Gt(u.category), Gt(i.category))}` : i || u ? x = he(i ?? u) : l === "transition.name" && c && p ? x = Be(je(c), je(p)) : p ? x = je(p) : c ? x = je(c) : l === "initial" ? x = Be(he(a?.states.find((y) => y.id === a.initial)), he(t?.states.find((y) => y.id === t.initial))) : l === "name" && (x = Be(a?.name || "Untitled workflow", t?.name || "Untitled workflow")), { title: m, details: x ? [x] : [] };
}
function tf(e, a, t, l) {
  const { code: o, what: d, detail: f } = e;
  if (o === "schema" || d === "visibility.remove")
    return d === "policy" ? { title: "Board limits and defaults", details: Qm(a, t) } : d.startsWith("visibility") ? { title: "Who can see items", details: _m(a, t, l) } : d === "key_prefix" ? { title: "Item key prefix", details: [Be(a.key_prefix ?? "Default", t.key_prefix ?? "Default")] } : { title: { plugins: "Board plugins changed", scopes: "Saved query filters changed", "rollup.recompute": "Calculated totals will update" }[d] ?? "Board settings changed", details: [] };
  if (o.startsWith("process ")) {
    const p = o.slice(8);
    return ef(e, a.processes?.find((x) => x.id === p), t.processes?.find((x) => x.id === p));
  }
  if (o.startsWith("item_type ")) {
    const p = o.slice(10), x = a.item_types?.find((w) => w.id === p), y = t.item_types?.find((w) => w.id === p);
    return { title: `${y?.title || x?.title || "Item type"} · ${ya[d] ?? "Item type changed"}`, details: d === "title" ? [Be(x?.title || "Untitled item type", y?.title || "Untitled item type")] : [] };
  }
  if (o.startsWith("relation ")) {
    const p = o.slice(9), x = a.relation_types?.find((w) => w.id === p), y = t.relation_types?.find((w) => w.id === p), S = d === "label" ? [Be([x?.outward, x?.inward].filter(Boolean).join(" / "), [y?.outward, y?.inward].filter(Boolean).join(" / "))] : [];
    return { title: `${y?.outward || x?.outward || "Link type"} · ${ya[d] ?? "Link type changed"}`, details: S };
  }
  const m = t.fields?.find((p) => p.code === o), u = a.fields?.find((p) => m?.id !== void 0 ? p.id === m.id : p.code === (d.startsWith("renamed from ") ? d.slice(13) : o)), i = m ?? u;
  if (!i) return { title: ya[d] ?? "Board settings changed", details: [] };
  const c = `${Ye(i)} · ${d.startsWith("renamed from ") ? "Field key" : ya[d] ?? "Field settings changed"}`;
  if (d.startsWith("options.")) {
    const p = u?.options ?? [], x = m?.options ?? [], y = p.findIndex((k) => k.id === f), S = x.findIndex((k) => k.id === f), w = p[y], A = x[S], $ = A?.label || w?.label || "Untitled choice", g = w && A && w.label !== A.label ? [] : [$];
    if (w && A) {
      w.label !== A.label && g.push(Be(w.label || "Untitled choice", A.label || "Untitled choice")), w.category !== A.category && g.push(`Category · ${Be(w.category ? Gt(w.category) : "None", A.category ? Gt(A.category) : "None")}`);
      const k = w.order ?? y + 1, C = A.order ?? S + 1;
      k !== C && g.push(`Order · ${Be(k, C)}`), w.color !== A.color && g.push(`Color · ${Be(w.color ?? "Default", A.color ?? "Default")}`);
    }
    return { title: c, details: g };
  }
  return d === "title" && u && m ? { title: c, details: [Be(Ye(u), Ye(m))] } : { title: c, details: [] };
}
const af = {
  key: 0,
  class: "work-settings-card work-schema-plan work-stack",
  "aria-label": "Schema review"
}, lf = { key: 0 }, of = { class: "work-row work-wrap" }, nf = { class: "work-muted" }, sf = {
  key: 0,
  class: "work-notice"
}, rf = {
  key: 1,
  class: "work-notice"
}, df = {
  key: 2,
  class: "work-stack work-tight",
  "aria-label": "Reviewed Flow bindings"
}, uf = { key: 3 }, cf = {
  key: 4,
  class: "work-settings-table"
}, vf = { key: 0 }, mf = /* @__PURE__ */ ye({
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
    const a = e, t = {}, l = L(() => a.original ?? t), o = L(() => a.declaration ?? t), d = L(() => (o.value.processes ?? []).flatMap((g) => g.states.flatMap((k) => {
      const C = k.run?.flow_ref;
      return C ? [{ key: g.id + ":" + k.id, process: g.name || "Untitled process", state: he(k), reference: C }] : [];
    }))), f = M(/* @__PURE__ */ new Map());
    Te(d, async (g, k, C) => {
      const H = /* @__PURE__ */ new Map();
      f.value = H;
      let P = !0;
      C(() => P = !1), await Promise.all([...new Set(g.map((G) => G.reference.id))].map(async (G) => {
        try {
          const ne = (await Nl.title(G))?.trim();
          P && ne && !Oi(ne) && f.value.set(G, ne);
        } catch {
          P && f.value.set(G, "Flow title unavailable");
        }
      }));
    }, { immediate: !0 });
    const m = L(() => [l.value, o.value].flatMap((g) => (g.visibility?.levels ?? []).flatMap((k) => k.holders.flatMap((C) => "group" in C ? [{ kind: "group", id: C.group }] : "user" in C ? [{ kind: "user", id: C.user }] : [])))), u = Ro(() => a.boardId ?? "", m);
    function i(g) {
      if ("user" in g) return u.label({ kind: "user", id: g.user });
      if ("group" in g) return u.label({ kind: "group", id: g.group });
      if ("field" in g) {
        const k = o.value.fields?.find((C) => C.code === g.field) ?? l.value.fields?.find((C) => C.code === g.field);
        return k ? Ye(k) : "People from a field";
      }
      return "Service";
    }
    const c = (g) => g.map((k) => {
      const C = tf(k, l.value, o.value, i);
      if (k.what === "plugins") {
        const H = new Set(l.value.plugins?.map((G) => G.use)), P = new Set(o.value.plugins?.map((G) => G.use));
        for (const G of a.plugins ?? [])
          H.has(G.plugin) !== P.has(G.plugin) && C.details.push((P.has(G.plugin) ? "Enable " : "Turn off ") + (G.title || "an available plugin"));
      }
      return { change: k, ...C };
    }), p = L(() => c(a.plan?.changes.filter((g) => g.class !== "refused") ?? [])), x = L(() => c(a.plan?.refused ?? [])), y = L(() => {
      const g = a.plan?.migration;
      return !g || !x.value.length ? g : x.value.every((k) => k.change.what === "options.remove") ? "Add a new field with the choices you want to keep. Copy existing values into it before removing the old field." : x.value.every((k) => k.change.what === "state.remove") ? "Choose where existing items should move before removing their state." : g;
    }), S = {
      unchanged: ["No changes", "secondary"],
      cosmetic: ["Labels or settings", "secondary"],
      additive: ["New definitions", "success"],
      semantic: ["Affects existing items", "warn"],
      refused: ["Blocked", "danger"],
      initial: ["First setup", "secondary"]
    }, w = (g) => S[g]?.[0] ?? "Review needed", A = (g) => S[g]?.[1] ?? "secondary";
    function $(g) {
      const { detail: k, ...C } = g;
      return tl(g.what === "invalid" || g.what.startsWith("views.") || g.what.startsWith("automation") ? g : C);
    }
    return (g, k) => e.plan ? (n(), b("section", af, [
      !e.plan.changes.length && !e.plan.refused.length && !e.configCount && !e.packReview ? (n(), b("p", lf, "No changes to apply.")) : (n(), b(te, { key: 1 }, [
        s("header", of, [
          k[0] || (k[0] = s("h3", null, "Impact on this board", -1)),
          h(r(We), {
            class: "kx-tag-sm",
            severity: A(e.plan.class)
          }, {
            default: K(() => [
              B(D(w(e.plan.class)), 1)
            ]),
            _: 1
          }, 8, ["severity"])
        ]),
        s("p", nf, D(r(Pi)[e.plan.class] || "Review the changes below."), 1),
        y.value ? (n(), b("p", sf, D(y.value), 1)) : e.follows.length ? (n(), b("p", rf, "Existing items in " + D(e.follows.join(", ")) + " will follow the updated workflow.", 1)) : I("", !0),
        d.value.length ? (n(), b("section", df, [
          k[1] || (k[1] = s("h3", null, "Flow bindings", -1)),
          (n(!0), b(te, null, se(d.value, (C) => (n(), b("p", {
            key: C.key
          }, [
            B(D(C.process) + " / " + D(C.state) + " · ", 1),
            s("strong", null, D(f.value.get(C.reference.id) ?? "Published Flow") + " · v" + D(C.reference.version), 1)
          ]))), 128)),
          k[2] || (k[2] = s("p", { class: "work-muted work-small" }, "New entries use these exact published versions. Before replacing a binding, stop new entries, let existing runs and deliveries finish, pause the old launcher, save, then resume entries.", -1))
        ])) : I("", !0),
        it(g.$slots, "default"),
        x.value.length ? (n(), b("h3", uf, "Blocked changes")) : I("", !0),
        (n(!0), b(te, null, se(x.value, (C, H) => (n(), J(r(Hi), {
          key: H,
          severity: "error",
          role: "alert"
        }, {
          default: K(() => [
            s("strong", null, D(C.title), 1),
            (n(!0), b(te, null, se(C.details, (P, G) => (n(), b("p", { key: G }, D(P), 1))), 128)),
            s("p", null, D($(C.change)), 1),
            h(ze, {
              class: "work-small",
              label: "Technical details"
            }, {
              default: K(() => [
                s("code", null, D(C.change.what), 1)
              ]),
              _: 2
            }, 1024)
          ]),
          _: 2
        }, 1024))), 128)),
        p.value.length ? (n(), b("table", cf, [
          k[3] || (k[3] = s("thead", null, [
            s("tr", null, [
              s("th", { scope: "col" }, "Change"),
              s("th", { scope: "col" }, "Impact")
            ])
          ], -1)),
          s("tbody", null, [
            (n(!0), b(te, null, se(p.value, (C, H) => (n(), b("tr", { key: H }, [
              s("td", null, [
                s("strong", null, D(C.title), 1),
                (n(!0), b(te, null, se(C.details, (P, G) => (n(), b("p", { key: G }, D(P), 1))), 128)),
                C.change.count ? (n(), b("p", vf, D(C.change.count) + " " + D(C.change.count === 1 ? "item" : "items"), 1)) : I("", !0)
              ]),
              s("td", null, [
                h(r(We), {
                  class: "kx-tag-sm",
                  severity: A(C.change.class)
                }, {
                  default: K(() => [
                    B(D(w(C.change.class)), 1)
                  ]),
                  _: 2
                }, 1032, ["severity"])
              ])
            ]))), 128))
          ])
        ])) : I("", !0)
      ], 64))
    ])) : I("", !0);
  }
}), ff = {
  key: 0,
  class: "work-stack",
  "aria-label": "Pack conflicts"
}, pf = { class: "work-stack work-tight work-pack-review-field" }, bf = { class: "work-config-fields" }, hf = { class: "work-json-example" }, gf = { class: "work-json-example" }, yf = {
  key: 1,
  class: "work-stack",
  "aria-label": "Pack state maps"
}, kf = /* @__PURE__ */ ye({
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
      return t.original.processes?.find((c) => c.id === i)?.name || Re(i);
    }
    function d(i) {
      const [c, ...p] = i.split("."), x = p.join(".");
      return c === "processes" ? o(x) : c === "fields" ? t.original.fields?.find((y) => y.code === x)?.title || Re(x) : c === "item_types" ? t.original.item_types?.find((y) => y.id === x)?.title || Re(x) : Re(c);
    }
    function f(i) {
      return JSON.stringify(i ?? null, null, 2);
    }
    function m(i, c) {
      (t.request.resolutions ??= {})[i] = c, l("change");
    }
    function u(i, c, p) {
      ((t.request.maps ??= {})[i] ??= {})[c] = p, l("change");
    }
    return (i, c) => (n(), b(te, null, [
      e.plan.conflicts.length ? (n(), b("section", ff, [
        c[2] || (c[2] = s("h3", null, "Local edits conflict", -1)),
        c[3] || (c[3] = s("p", { class: "work-muted work-small" }, "Choose which declaration to keep for each conflict, then review again.", -1)),
        (n(!0), b(te, null, se(e.plan.conflicts, (p) => (n(), b("div", {
          key: p.path,
          class: "work-stack work-tight"
        }, [
          s("label", pf, [
            B(D(d(p.path)), 1),
            h(r(me), {
              "model-value": e.request.resolutions?.[p.path],
              "aria-label": "Resolution for " + d(p.path),
              disabled: e.disabled,
              appendTo: "self",
              placeholder: "Choose a resolution",
              optionLabel: "label",
              optionValue: "value",
              options: [{ label: "Keep local edits", value: "local" }, { label: "Use pack changes", value: "incoming" }],
              "onUpdate:modelValue": (x) => m(p.path, x)
            }, null, 8, ["model-value", "aria-label", "disabled", "onUpdate:modelValue"])
          ]),
          h(ze, {
            class: "work-json-disclosure",
            label: "Compare declarations"
          }, {
            default: K(() => [
              s("div", bf, [
                s("section", null, [
                  c[0] || (c[0] = s("h4", null, "Local edits", -1)),
                  s("pre", hf, D(f(p.local_value)), 1)
                ]),
                s("section", null, [
                  c[1] || (c[1] = s("h4", null, "Pack changes", -1)),
                  s("pre", gf, D(f(p.incoming)), 1)
                ])
              ])
            ]),
            _: 2
          }, 1024)
        ]))), 128))
      ])) : I("", !0),
      Object.keys(e.plan.maps).length ? (n(), b("section", yf, [
        c[4] || (c[4] = s("h3", null, "Required state maps", -1)),
        c[5] || (c[5] = s("p", { class: "work-muted work-small" }, "Review the proposed destinations for existing items. Each destination is editable.", -1)),
        (n(!0), b(te, null, se(e.plan.maps, (p, x) => (n(), b("div", {
          key: x,
          class: "work-stack"
        }, [
          s("h4", null, D(o(x)), 1),
          (n(!0), b(te, null, se(p, (y, S) => (n(), b("label", {
            key: S,
            class: "work-stack work-tight work-pack-review-field"
          }, [
            B("Move items from " + D(r(he)(e.original.processes?.find((w) => w.id === x)?.states.find((w) => w.id === S))), 1),
            h(r(me), {
              "model-value": e.request.maps?.[x]?.[S],
              "aria-label": "Move items from " + r(he)(e.original.processes?.find((w) => w.id === x)?.states.find((w) => w.id === S)),
              disabled: e.disabled,
              appendTo: "self",
              optionLabel: "label",
              optionValue: "value",
              options: e.plan.declaration.processes?.find((w) => w.id === x)?.states.map((w) => ({ label: r(he)(w), value: w.id })) ?? [],
              "onUpdate:modelValue": (w) => u(x, S, w)
            }, null, 8, ["model-value", "aria-label", "disabled", "options", "onUpdate:modelValue"])
          ]))), 128))
        ]))), 128))
      ])) : I("", !0)
    ], 64));
  }
}), wf = { class: "work-section-layout" }, Vf = { class: "kx-main" }, $f = ["aria-label"], xf = {
  key: 1,
  class: "kx-err work-alert-actions"
}, Cf = { role: "alert" }, Sf = {
  key: 2,
  class: "work-notice",
  role: "status"
}, Tf = {
  key: 3,
  class: "kx-loading",
  role: "status"
}, If = {
  key: 4,
  class: "work-notice",
  role: "alert"
}, Uf = {
  key: 5,
  class: "work-settings-body"
}, Df = {
  key: 0,
  class: "work-notice",
  role: "alert"
}, Ef = {
  key: 1,
  class: "work-notice"
}, Af = ["id"], Of = ["disabled", "inert"], Pf = {
  key: 0,
  class: "work-ia-section"
}, Rf = ["id", "aria-labelledby"], Nf = ["id", "aria-labelledby"], Mf = ["id", "aria-labelledby"], Ff = {
  key: 1,
  class: "work-ia-section"
}, Lf = {
  key: 0,
  class: "work-muted"
}, Bf = {
  key: 3,
  class: "work-ia-section"
}, zf = { class: "work-review-layout" }, jf = { class: "work-muted" }, Wf = ["aria-busy"], qf = {
  key: 0,
  role: "status"
}, Kf = {
  key: 1,
  role: "alert",
  class: "kx-err"
}, Gf = {
  key: 2,
  role: "alert"
}, Hf = { key: 6 }, Yf = { class: "work-dialog-actions" }, Xf = {
  key: 2,
  class: "work-muted",
  role: "status"
}, Jf = { class: "work-stack work-tight" }, Zf = {
  key: 0,
  class: "work-muted"
}, Qf = { class: "work-dialog-actions" }, _f = /* @__PURE__ */ ye({
  __name: "BoardSettings",
  props: {
    boardId: {},
    embedded: { type: Boolean },
    focusBack: { type: Boolean }
  },
  emits: ["dirty-change"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = tn(), d = el(), f = M(), m = (Y) => d + "-" + Y.toLowerCase().replaceAll(" ", "-"), u = (Y) => m(Y) + "-tab", i = M(), c = M(0);
    function p() {
      c.value++, rt();
    }
    let x, y = "";
    const S = () => JSON.stringify([yt.value, v.value, De.value, [...Je.value]]), w = L(() => ({
      value: "all-boards",
      label: t.embedded ? "All boards" : "Back to board",
      icon: t.embedded ? "tabler:table" : "tabler:layout-kanban"
    })), A = M();
    Te(A, (Y) => {
      t.focusBack && Y?.$el.querySelector(".kx-settings-rail-item")?.focus();
    }, { flush: "post", once: !0 });
    const $ = [
      { heading: "Board setup", items: [
        { value: "Items", label: "Items", icon: "tabler:list-details" },
        { value: "Workflow", label: "Workflow", icon: "tabler:route" }
      ] },
      { heading: "Management", items: [
        { value: "Access", label: "Access", icon: "tabler:users" },
        { value: "Plugins", label: "Plugins", icon: "tabler:puzzle" }
      ] }
    ], g = M("General");
    function k(Y) {
      if (Y === w.value.value) {
        fi();
        return;
      }
      (Y === "General" || $.some((X) => X.items.some((ae) => ae.value === Y))) && (g.value = Y);
    }
    const C = ["Item types", "Fields", "Links"], H = M("Item types"), P = {
      "Item types": "What kinds of work can this board track?",
      Fields: "What information can items capture?",
      Links: "How can items relate to each other?"
    }, G = L(() => ({
      General: "What is this board for?",
      Items: P[H.value],
      Workflow: "How does work move?",
      Access: "Who can use this board?",
      Plugins: "What can this board do?"
    })), ne = M(""), re = M(!1), ve = M(""), ke = M(), oe = M(/* @__PURE__ */ new Set(["Item types"]));
    Te(H, (Y) => oe.value.add(Y)), Te([g, H], () => f.value?.scrollTo({ top: 0 }));
    function z(Y) {
      ne.value = Y, H.value = "Fields";
    }
    function W() {
      re.value = !1, ve.value = "", Pa.value = !1;
    }
    function U(Y) {
      !st.value || !ci() || Je.value.size || (ke.value = Y, re.value = !0, ml());
    }
    const q = M(!1), ce = M(""), ue = M(/* @__PURE__ */ new Set(["General"]));
    Te(g, (Y) => ue.value.add(Y));
    const Q = M(), we = M(), Se = M(), j = M({}), v = M({}), V = M(), Z = M(!1), N = M(!0), O = M(!1), R = M(""), F = M(""), T = L(() => j.value.item_types ?? []), ee = L(() => j.value.fields ?? []), E = L(() => j.value.relation_types ?? []), ie = L(() => j.value.processes ?? []), Ve = L(() => j.value.plugins?.length ?? 0), Ue = L(() => V.value?.schema_options.plugins.filter((Y) => Y.installed).length ?? 0), Ee = L(() => ee.value.filter((Y) => !T.value.some((X) => X.fields.includes(Y.code))).length), Aa = L(() => Z.value && Q.value ? [
      { heading: Se.value?.title || "Board settings", items: [{ value: "General", label: "General", icon: "tabler:settings" }] },
      ...$
    ] : []), sa = L(() => {
      switch (H.value) {
        case "Item types":
          return [T.value.length + (T.value.length === 1 ? " item type" : " item types")];
        case "Fields":
          return [
            ee.value.length + (ee.value.length === 1 ? " field" : " fields"),
            ...Ee.value ? [Ee.value + (Ee.value === 1 ? " unused field" : " unused fields")] : []
          ];
        case "Links":
          return [E.value.length + (E.value.length === 1 ? " link type" : " link types")];
      }
    }), Hl = L(() => ie.value.flatMap((Y) => Y.transitions ?? []).filter((Y) => Y.when || Y.guards?.length || Y.require?.length).length), Ht = M(), ra = M(!1), il = ka();
    async function da(Y) {
      const X = il();
      ra.value = !1;
      try {
        const ae = await Vt.stateCounts(Y);
        X() && (Ht.value = ae);
      } catch {
        X() && (ra.value = !0, Ht.value = void 0);
      }
    }
    Te(g, (Y) => {
      Z.value && (Y === "General" || Y === "Workflow") && da(t.boardId);
    });
    const ua = M(""), ht = M([]), De = M(), Pt = M(), gt = M(), qe = M(), Yt = M(), Xt = M(""), nl = M([]), sl = L(() => [...nl.value, ...qe.value?.refused ?? []]), nt = M(!1), Yl = M(0), Je = M(/* @__PURE__ */ new Set()), rl = M(), Xl = ka(), Oa = ka(), yt = L(() => bl(j.value, Q.value?.declaration ?? {})), st = L(() => Je.value.size > 0 || !!De.value || !!Q.value && (JSON.stringify(yt.value) !== JSON.stringify(bl(Q.value.declaration, Q.value.declaration)) || Object.keys(v.value).length > 0)), dl = M(!1), Jl = L(() => st.value || dl.value);
    Te(Jl, (Y) => l("dirty-change", Y), { immediate: !0, flush: "sync" });
    const at = L(() => !!Q.value && !!we.value && Q.value.generation !== we.value.generation), oi = L(() => (!ca.value.renamed.length || Pa.value) && Z.value && !O.value && !nt.value && !Rt.value && !at.value && !Je.value.size && qe.value && (qe.value.changes.length > 0 || Object.keys(v.value).length > 0) && qe.value.class !== "refused" && !qe.value.refused.length && Yt.value?.matches(yt.value, Q.value?.generation ?? -1, v.value)), Pa = M(!1), ca = L(() => {
      const Y = Q.value?.declaration, X = [], ae = [];
      for (const $e of ie.value) {
        const dt = Y?.item_types?.filter((Ne) => Ne.process === $e.id) ?? [], Ke = Y?.processes?.find((Ne) => Ne.id === $e.id);
        for (const Ne of Ke?.states ?? []) {
          const Na = $e.states.find((Nt) => Nt.id === Ne.id);
          if (Na && Na.name === Ne.name) continue;
          const pl = [...qe.value?.refused ?? [], ...qe.value?.changes ?? []].find((Nt) => Nt.code === "process " + $e.id && Nt.detail === Ne.id && ["state.remove", "state.map"].includes(Nt.what))?.count ?? dt.reduce((Nt, hi) => Nt + (Ht.value?.[hi.id]?.[Ne.id] ?? 0), 0);
          pl && (Na ? ae.push({ process: $e, state: Ne, name: he(Na), count: pl }) : X.push({ process: $e, state: Ne, count: pl }));
        }
      }
      return { removed: X, renamed: ae };
    });
    function ii(Y, X, ae) {
      Y.map = { ...Y.map, [X]: ae }, ml();
    }
    const ul = L(() => ht.value.find((Y) => Y.id === De.value?.pack)?.plugins.filter((Y) => !Q.value?.plugins?.some((X) => X.plugin === Y.plugin && X.active)).map((Y) => ({ use: Y.plugin })) ?? []), Zl = L(() => !!gt.value && JSON.stringify(gt.value) === JSON.stringify(De.value)), Ql = L(() => De.value ? Z.value && !O.value && !Je.value.size && !at.value && !Rt.value && Zl.value && qe.value?.class !== "refused" && !qe.value?.refused.length && Pt.value?.conflicts.every((Y) => !!De.value?.resolutions?.[Y.path]) : oi.value), _l = L(() => !!qe.value && (!De.value || Zl.value)), ni = L(() => ht.value.find((Y) => Y.id === Q.value?.pack?.id)?.title || "Installed pack"), eo = L(() => !ua.value && !!Q.value?.outdated && !!ht.value.find((Y) => Y.id === Q.value?.pack?.id)), si = L(() => ua.value ? "Reload packs to check available upgrades." : eo.value ? st.value ? "Discard the current draft before upgrading." : Rt.value ? "Finish the current migration before upgrading." : O.value ? "Wait for the current request to finish." : void 0 : "Install an available version of this pack to upgrade.");
    function to() {
      De.value = void 0, Pt.value = void 0, gt.value = void 0;
    }
    async function ri() {
      if (!Q.value?.pack || O.value || st.value) return;
      const Y = ht.value.find((X) => X.id === Q.value.pack.id);
      Y && (ke.value = void 0, De.value = no(Y, Q.value.generation), re.value = !0, await cl());
    }
    async function di() {
      const Y = ht.value.find((X) => X.id === ce.value);
      !Q.value || !Y || Y.plugins.some((X) => !X.installed) || O.value || st.value || (ke.value = void 0, De.value = no(Y, Q.value.generation), q.value = !1, re.value = !0, await cl());
    }
    async function cl() {
      if (!De.value || O.value || !Z.value || at.value || Je.value.size) return;
      const Y = Oa(), X = Bt(De.value), ae = JSON.stringify(De.value);
      O.value = !0, ve.value = "", F.value = "";
      try {
        const $e = await Ni(X, (dt) => It.packPlan(t.boardId, dt));
        if (!Y() || ae !== JSON.stringify(De.value)) return;
        Pt.value = $e.plan, qe.value = $e.plan, De.value = $e.request, gt.value = Bt(De.value), Xt.value = crypto.randomUUID(), re.value = !0;
      } catch ($e) {
        Y() && (gt.value = void 0, ve.value = ot($e, "Could not review the pack."));
      } finally {
        O.value = !1;
      }
    }
    const ao = L(() => Pt.value?.declaration ?? Yt.value?.declaration), ui = L(() => {
      const Y = ao.value;
      return !qe.value || !Y ? [] : Ri(qe.value, Y).map((X) => Y.processes?.find((ae) => ae.id === X)?.name || "Untitled process");
    }), Rt = L(() => !!we.value?.migration_error || Se.value?.status === "migrating");
    function kt() {
      nl.value = [], Oa(), qe.value = void 0, Yt.value = void 0, gt.value = void 0, Xt.value = "";
    }
    Te([yt, v], kt, { deep: !0, flush: "sync" }), Te(v, (Y) => {
      De.value && (Object.keys(Y).length ? De.value.plugin_configs = Bt(Y) : delete De.value.plugin_configs);
    }, { deep: !0, flush: "sync" });
    function va(Y, X) {
      X ? Je.value.delete(Y) : Je.value.add(Y), kt();
    }
    function vl(Y) {
      to(), Yl.value++, Q.value = Y, j.value = Bt(Y.declaration), v.value = {}, Je.value.clear(), kt();
    }
    async function rt(Y = !1) {
      const X = Xl();
      try {
        const [ae, $e, dt] = await Promise.all([Vt.schema(t.boardId, void 0, !0).catch((Ne) => {
          if (Ne instanceof Il && Ne.details?.code === "board_schema_missing") return { generation: 0, declaration: {}, compiled: {}, key_prefix: "", as_of: 0 };
          throw Ne;
        }), Vt.options(t.boardId), Vt.boards()]);
        if (!X()) return;
        if (Z.value = $e.access.admin, V.value = $e, Se.value = dt.find((Ne) => Ne.board_id === t.boardId), !Z.value) {
          Q.value = void 0, j.value = {}, kt();
          return;
        }
        R.value = "";
        const Ke = Mi(ae);
        we.value = Ke, x !== void 0 && Ke.generation >= x ? (x = void 0, y === S() && vl(Ke), y = "") : (Y || !Q.value || !st.value && Ke.generation !== Q.value.generation) && vl(Ke), at.value && kt(), await lo(X), X() && (g.value === "General" || g.value === "Workflow") && da(t.boardId);
      } catch (ae) {
        if (!X()) return;
        ae instanceof Il && (ae.status === 403 || ae.kind?.toLowerCase() === "permission_denied") && (Z.value = !1), kt(), R.value = ot(ae, "Could not load board settings.");
      } finally {
        X() && (N.value = !1);
      }
    }
    async function lo(Y = () => !0) {
      ua.value = "";
      try {
        const X = await Vt.packs();
        Y() && (ht.value = X.filter(Fi));
      } catch (X) {
        Y() && (ua.value = ot(X, "Could not load packs."));
      }
    }
    function ci() {
      for (const Y of Array.from(rl.value?.elements ?? []))
        if ((Y instanceof HTMLInputElement || Y instanceof HTMLSelectElement || Y instanceof HTMLTextAreaElement) && !(Y.form !== rl.value || Y.closest('[style*="display: none"]:not(.p-accordioncontent)')) && !Y.reportValidity()) {
          const ae = Y.closest('.p-accordioncontent[style*="display: none"]')?.closest(".kx-disclosure")?.querySelector('.kx-disclosure-toggle[aria-expanded="false"]');
          return ae && (ae.click(), aa(() => Y.reportValidity())), !1;
        }
      return !0;
    }
    async function ml() {
      if (De.value) return cl();
      if (!Q.value || O.value || !Z.value || at.value || Je.value.size) return;
      const Y = Oa(), X = so(yt.value, Q.value.generation, v.value);
      O.value = !0, ve.value = "", F.value = "";
      try {
        const ae = (X.declaration.processes ?? []).some((dt) => Q.value?.declaration.processes?.find((Ke) => Ke.id === dt.id)?.states.some((Ke) => dt.states.some((Ne) => Ne.id === Ke.id && Ne.name !== Ke.name))), [$e] = await Promise.all([
          It.plan(t.boardId, X),
          ae ? da(t.boardId) : void 0
        ]);
        if (ae && ra.value) {
          kt(), ve.value = "Could not check which items use the renamed states. Check the impact again.";
          return;
        }
        if (!Y() || Je.value.size || !X.matches(yt.value, Q.value.generation, v.value)) return;
        qe.value = $e, Yt.value = X, Xt.value = crypto.randomUUID(), re.value = !0;
      } catch (ae) {
        Y() && (kt(), ve.value = ot(ae, "Could not review changes."), nl.value = Li(ae, yt.value));
      } finally {
        O.value = !1;
      }
    }
    async function vi() {
      if (!Ql.value) return;
      if (De.value && gt.value) {
        O.value = !0, ve.value = "";
        const X = S();
        try {
          const ae = await It.packApply(t.boardId, Bt(gt.value), Xt.value);
          x = ae.generation, y = X, await rt(), F.value = ae.status === "done" ? "Pack applied." : "Pack installation continues in the background.", W();
        } catch (ae) {
          ve.value = ot(ae, "Could not apply the pack upgrade.");
        } finally {
          O.value = !1;
        }
        return;
      }
      if (!Yt.value) return;
      O.value = !0, ve.value = "", F.value = "";
      const Y = S();
      try {
        x = (await It.apply(t.boardId, Yt.value, Xt.value)).generation, y = Y, await rt(), F.value = "Board changes applied.", W();
      } catch (X) {
        ve.value = ot(X, "Could not apply the board changes.");
      } finally {
        O.value = !1;
      }
    }
    async function mi() {
      if (!O.value) {
        O.value = !0, R.value = "";
        try {
          const Y = await It.resume(t.boardId);
          F.value = Y.resumed ? "Migration resumes." : "Migration is already running.", await rt();
        } catch (Y) {
          R.value = ot(Y, "Could not resume migration.");
        } finally {
          O.value = !1;
        }
      }
    }
    async function Ra(Y, X) {
      if (!Q.value || !Z.value || O.value || nt.value) return "Wait for the current change to finish.";
      if (at.value) return "Discard the stale draft before removing a definition.";
      const ae = Q.value.generation, $e = JSON.stringify(yt.value), dt = Bt(j.value);
      Ua(dt, Y, X), nt.value = !0;
      try {
        const Ke = await It.plan(t.boardId, so(bl(dt, Q.value.declaration), ae, v.value));
        if (!Z.value || at.value || Q.value.generation !== ae || JSON.stringify(yt.value) !== $e) return "The draft changes during the check. Try the removal again.";
        const Ne = Bi(Ke, Y, X);
        if (Ne) return Ne;
        if (Ke.class === "refused") return "Resolve the blocked changes in your draft before removing this definition.";
      } catch (Ke) {
        return ot(Ke, "Could not check this removal.");
      } finally {
        nt.value = !1;
      }
    }
    async function fi() {
      if (t.embedded) {
        o({ name: "boards" });
        return;
      }
      Jl.value && !await ji.confirm({ header: "Discard changes?", message: "Your unsaved board settings will be discarded.", acceptLabel: "Discard", rejectLabel: "Keep editing" }) || o({ name: "board", board: t.boardId });
    }
    function pi() {
      x = void 0, we.value && vl(we.value), F.value = "", R.value = "", W();
    }
    Te(() => t.boardId, () => {
      dl.value = !1, x = void 0, to(), ht.value = [], Q.value = void 0, we.value = void 0, Se.value = void 0, v.value = {}, Je.value.clear(), il(), Ht.value = void 0, oe.value = /* @__PURE__ */ new Set(["Item types"]), H.value = "Item types", ne.value = "", ue.value = /* @__PURE__ */ new Set(["General"]), k("General"), W(), Z.value = !1, N.value = !0, rt(!0);
    });
    let fl = () => {
    };
    Te(() => t.boardId, (Y) => {
      fl(), fl = zi(`component.${Y}`, () => {
        rt();
      });
    }, { immediate: !0 }), $i(rt), Fl(() => {
      fl(), Xl(), Oa(), il();
    });
    function bi(Y) {
      Y.button === 0 && Y.target instanceof Element && Y.target.closest(".kx-settings-rail-item:focus-visible")?.blur();
    }
    return (Y, X) => (n(), b("section", {
      class: ft(["work-settings-shell work-ia", { "work-embedded": e.embedded }])
    }, [
      s("div", wf, [
        h(en, {
          ref_key: "rail",
          ref: A,
          label: "Board settings sections",
          value: g.value,
          groups: Aa.value,
          "leading-item": w.value,
          "onUpdate:value": k,
          onPointerdown: bi
        }, null, 8, ["value", "groups", "leading-item"]),
        s("div", Vf, [
          s("div", {
            ref_key: "pane",
            ref: f,
            class: "kx-main-scroll work-settings-content",
            role: "region",
            "aria-label": g.value
          }, [
            Z.value && Q.value ? (n(), J(Uv, {
              key: 0,
              ref_key: "head",
              ref: i,
              title: g.value,
              description: G.value[g.value],
              board: Se.value,
              authorized: Z.value,
              busy: O.value,
              onShared: p
            }, {
              default: K(() => [
                h($v, {
                  dirty: st.value,
                  busy: O.value,
                  "checking-removal": nt.value,
                  disabled: !st.value || O.value || nt.value || Rt.value || at.value || !!Je.value.size,
                  onDiscard: pi,
                  onPrimary: U
                }, null, 8, ["dirty", "busy", "checking-removal", "disabled"])
              ]),
              _: 1
            }, 8, ["title", "description", "board", "authorized", "busy"])) : I("", !0),
            R.value ? (n(), b("div", xf, [
              s("p", Cf, D(R.value), 1),
              h(r(_), {
                label: "Retry",
                severity: "secondary",
                outlined: "",
                onClick: X[0] || (X[0] = (ae) => rt())
              })
            ])) : I("", !0),
            F.value ? (n(), b("p", Sf, D(F.value), 1)) : I("", !0),
            N.value ? (n(), b("p", Tf, "Loading board settings…")) : !Z.value && !R.value ? (n(), b("p", If, "Ask a board administrator to grant you access to these settings.")) : I("", !0),
            Z.value && Q.value ? (n(), b("div", Uf, [
              at.value ? (n(), b("p", Df, "Someone saved new settings while you were editing. Discard this draft to load their changes.")) : I("", !0),
              Rt.value ? (n(), b("div", Ef, [
                s("p", null, D(we.value?.migration_error ? "Updating existing items paused." : "Updating existing items…"), 1),
                we.value?.migration_error ? (n(), J(ze, {
                  key: 0,
                  label: "Technical details"
                }, {
                  default: K(() => [
                    B(D(we.value.migration_error), 1)
                  ]),
                  _: 1
                })) : I("", !0),
                we.value?.migration_error ? (n(), J(r(_), {
                  key: 1,
                  label: "Resume updating items",
                  severity: "secondary",
                  disabled: O.value,
                  outlined: "",
                  onClick: mi
                }, null, 8, ["disabled"])) : I("", !0)
              ])) : I("", !0),
              ct(h(Zm, {
                draft: j.value,
                schema: we.value ?? Q.value,
                board: Se.value,
                active: g.value === "General",
                "board-apps": V.value?.board_apps,
                counts: Ht.value,
                "counts-error": ra.value,
                "draft-form": r(d),
                disabled: O.value || nt.value,
                "pack-title": Q.value.pack ? ni.value : void 0,
                outdated: Q.value.outdated,
                "upgrade-reason": si.value,
                "can-upgrade": eo.value && !st.value && !O.value && !Rt.value,
                "can-install": !st.value && !O.value && !Rt.value,
                "pack-error": ua.value,
                onUpgrade: ri,
                onInstall: X[1] || (X[1] = (ae) => q.value = !0),
                onRetry: X[2] || (X[2] = (ae) => lo()),
                onReloadCounts: X[3] || (X[3] = (ae) => da(e.boardId)),
                onDirtyChange: X[4] || (X[4] = (ae) => dl.value = ae),
                onSaved: X[5] || (X[5] = (ae) => rt())
              }, null, 8, ["draft", "schema", "board", "active", "board-apps", "counts", "counts-error", "draft-form", "disabled", "pack-title", "outdated", "upgrade-reason", "can-upgrade", "can-install", "pack-error"]), [
                [wt, g.value === "General"]
              ]),
              s("form", {
                id: r(d),
                ref_key: "editor",
                ref: rl,
                onSubmit: X[16] || (X[16] = Ie((ae) => U(), ["prevent"]))
              }, [
                (n(), b("fieldset", {
                  key: Yl.value,
                  class: "work-settings-fieldset",
                  disabled: O.value || nt.value,
                  inert: O.value || nt.value || void 0
                }, [
                  ue.value.has("Items") ? ct((n(), b("section", Pf, [
                    h(Sa, { facts: sa.value }, null, 8, ["facts"]),
                    h(r(qi), {
                      value: H.value,
                      "onUpdate:value": X[6] || (X[6] = (ae) => H.value = ae),
                      class: "work-ia-subnav"
                    }, {
                      default: K(() => [
                        h(r(Ki), { "aria-label": "Item settings" }, {
                          default: K(() => [
                            (n(), b(te, null, se(C, (ae) => h(r(Gi), {
                              key: ae,
                              value: ae,
                              pt: { root: { id: u(ae), "aria-controls": m(ae) } }
                            }, {
                              default: K(() => [
                                B(D(ae), 1)
                              ]),
                              _: 2
                            }, 1032, ["value", "pt"])), 64))
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }, 8, ["value"]),
                    oe.value.has("Item types") ? ct((n(), b("div", {
                      key: 0,
                      role: "tabpanel",
                      id: m("Item types"),
                      "aria-labelledby": u("Item types")
                    }, [
                      h(Kr, {
                        draft: j.value,
                        "guard-removal": Ra,
                        issues: sl.value,
                        onFields: z
                      }, null, 8, ["draft", "issues"])
                    ], 8, Rf)), [
                      [wt, H.value === "Item types"]
                    ]) : I("", !0),
                    oe.value.has("Fields") ? ct((n(), b("div", {
                      key: 1,
                      role: "tabpanel",
                      id: m("Fields"),
                      "aria-labelledby": u("Fields")
                    }, [
                      h(Ur, {
                        "board-id": e.boardId,
                        "installed-types": V.value?.installed_types,
                        draft: j.value,
                        "guard-removal": Ra,
                        issues: sl.value,
                        "item-type": ne.value,
                        "onUpdate:itemType": X[7] || (X[7] = (ae) => ne.value = ae),
                        onValidity: X[8] || (X[8] = (ae, $e) => va("fields:" + ae, $e))
                      }, null, 8, ["board-id", "installed-types", "draft", "issues", "item-type"])
                    ], 8, Nf)), [
                      [wt, H.value === "Fields"]
                    ]) : I("", !0),
                    oe.value.has("Links") ? ct((n(), b("div", {
                      key: 2,
                      role: "tabpanel",
                      id: m("Links"),
                      "aria-labelledby": u("Links")
                    }, [
                      h(ev, {
                        draft: j.value,
                        "guard-removal": Ra
                      }, null, 8, ["draft"])
                    ], 8, Mf)), [
                      [wt, H.value === "Links"]
                    ]) : I("", !0)
                  ], 512)), [
                    [wt, g.value === "Items"]
                  ]) : I("", !0),
                  ue.value.has("Workflow") ? ct((n(), b("section", Ff, [
                    h(Sa, {
                      facts: [
                        ie.value.length + (ie.value.length === 1 ? " workflow" : " workflows"),
                        ie.value.reduce((ae, $e) => ae + $e.states.length, 0) + " states",
                        Hl.value + (Hl.value === 1 ? " move has requirements" : " moves have requirements"),
                        ...typeof Se.value?.open_count == "number" ? [Se.value.open_count + " open items"] : []
                      ]
                    }, null, 8, ["facts"]),
                    ra.value ? (n(), b("p", Lf, [
                      X[23] || (X[23] = B("Item counts are unavailable. ", -1)),
                      h(r(_), {
                        label: "Reload counts",
                        text: "",
                        onClick: X[9] || (X[9] = (ae) => da(e.boardId))
                      })
                    ])) : I("", !0),
                    h(Uc, {
                      "board-id": e.boardId,
                      draft: j.value,
                      "guard-removal": Ra,
                      issues: sl.value,
                      counts: Ht.value,
                      "count-types": Q.value.declaration.item_types,
                      guards: V.value?.guards,
                      onValidity: X[10] || (X[10] = (ae, $e) => va("process:" + ae, $e))
                    }, null, 8, ["board-id", "draft", "issues", "counts", "count-types", "guards"])
                  ], 512)), [
                    [wt, g.value === "Workflow"]
                  ]) : I("", !0),
                  ue.value.has("Access") ? ct((n(), J(Zv, {
                    key: 2,
                    active: g.value === "Access",
                    "board-id": e.boardId,
                    draft: j.value,
                    "grants-version": c.value,
                    onShare: X[11] || (X[11] = (ae) => i.value?.share()),
                    onValidity: X[12] || (X[12] = (ae) => va("visibility", ae))
                  }, null, 8, ["active", "board-id", "draft", "grants-version"])), [
                    [wt, g.value === "Access"]
                  ]) : I("", !0),
                  ue.value.has("Plugins") ? ct((n(), b("section", Bf, [
                    h(Sa, {
                      facts: [
                        Ve.value + (Ve.value === 1 ? " plugin enabled in this setup" : " plugins enabled in this setup"),
                        Ue.value + " installed",
                        ...(we.value ?? Q.value).plugins?.some((ae) => ae.lifecycle.state === "failed" || Object.values(ae.projections).some(($e) => $e.parked || $e.error)) ? ["Some plugins need attention"] : []
                      ]
                    }, null, 8, ["facts"]),
                    h($o, {
                      "board-id": e.boardId,
                      draft: j.value,
                      schema: we.value ?? Q.value,
                      options: V.value?.schema_options.plugins ?? [],
                      filters: V.value?.filters,
                      configs: v.value,
                      disabled: O.value,
                      onConfigured: X[13] || (X[13] = (ae) => {
                        kt(), rt();
                      }),
                      onRefresh: X[14] || (X[14] = (ae) => rt()),
                      onReview: U,
                      onValidity: X[15] || (X[15] = (ae, $e) => va("plugin:" + ae, $e))
                    }, null, 8, ["board-id", "draft", "schema", "options", "filters", "configs", "disabled"])
                  ], 512)), [
                    [wt, g.value === "Plugins"]
                  ]) : I("", !0)
                ], 8, Of))
              ], 40, Af),
              h(Ul, {
                visible: re.value,
                label: "Review changes",
                busy: O.value,
                "return-focus": ke.value,
                class: "work-review-sheet",
                onClose: W
              }, {
                default: K(() => [
                  s("div", zf, [
                    s("header", null, [
                      X[24] || (X[24] = s("h2", null, "Review changes", -1)),
                      s("p", jf, D(Se.value?.title), 1)
                    ]),
                    s("div", {
                      class: "work-review-content work-stack",
                      "aria-busy": O.value
                    }, [
                      O.value ? (n(), b("p", qf, D(qe.value ? "Applying or checking changes…" : "Checking the impact on your board…"), 1)) : I("", !0),
                      ve.value ? (n(), b("p", Kf, D(ve.value), 1)) : I("", !0),
                      at.value ? (n(), b("p", Gf, "The board changed while you were editing. Close this review and discard the draft to load the latest settings.")) : I("", !0),
                      re.value && !De.value && (ca.value.removed.length || ca.value.renamed.length) ? (n(), J(Oc, {
                        key: 3,
                        removed: ca.value.removed,
                        renamed: ca.value.renamed,
                        disabled: O.value || nt.value,
                        confirmed: Pa.value,
                        "onUpdate:confirmed": X[17] || (X[17] = (ae) => Pa.value = ae),
                        onDestination: ii
                      }, null, 8, ["removed", "renamed", "disabled", "confirmed"])) : I("", !0),
                      re.value && De.value && ul.value.length ? (n(), J($o, {
                        key: 4,
                        "board-id": e.boardId,
                        draft: { plugins: ul.value },
                        schema: we.value ?? Q.value,
                        options: V.value?.schema_options.plugins.filter((ae) => ul.value.some(($e) => $e.use === ae.plugin)) ?? [],
                        configs: v.value,
                        disabled: O.value,
                        "activation-locked": "",
                        onValidity: X[18] || (X[18] = (ae, $e) => va("pack-plugin:" + ae, $e))
                      }, null, 8, ["board-id", "draft", "schema", "options", "configs", "disabled"])) : I("", !0),
                      re.value ? (n(), J(mf, {
                        key: 5,
                        "board-id": e.boardId,
                        original: Q.value.declaration,
                        declaration: ao.value,
                        plan: qe.value,
                        follows: ui.value,
                        "config-count": Object.keys(v.value).length,
                        "pack-review": !!Pt.value,
                        plugins: V.value?.schema_options.plugins
                      }, {
                        default: K(() => [
                          Pt.value && De.value ? (n(), J(kf, {
                            key: 0,
                            plan: Pt.value,
                            request: De.value,
                            original: Q.value.declaration,
                            disabled: O.value,
                            onChange: X[19] || (X[19] = (ae) => {
                              gt.value = void 0, Xt.value = "";
                            })
                          }, null, 8, ["plan", "request", "original", "disabled"])) : I("", !0)
                        ]),
                        _: 1
                      }, 8, ["board-id", "original", "declaration", "plan", "follows", "config-count", "pack-review", "plugins"])) : I("", !0),
                      !O.value && !_l.value && !at.value && !ve.value ? (n(), b("p", Hf, "Check the impact again before applying.")) : I("", !0)
                    ], 8, Wf),
                    s("footer", Yf, [
                      h(r(_), {
                        label: "Keep editing",
                        severity: "secondary",
                        outlined: "",
                        disabled: O.value,
                        onClick: W
                      }, null, 8, ["disabled"]),
                      _l.value ? (n(), J(r(_), {
                        key: 1,
                        label: "Apply changes",
                        disabled: !Ql.value,
                        loading: O.value,
                        onClick: vi
                      }, null, 8, ["disabled", "loading"])) : (n(), J(r(_), {
                        key: 0,
                        label: "Check impact",
                        disabled: O.value || at.value || !!Je.value.size,
                        onClick: ml
                      }, null, 8, ["disabled"]))
                    ])
                  ])
                ]),
                _: 1
              }, 8, ["visible", "busy", "return-focus"]),
              nt.value ? (n(), b("p", Xf, "Checking what uses this setting…")) : I("", !0)
            ])) : I("", !0)
          ], 8, $f)
        ])
      ]),
      Z.value ? (n(), J(Ul, {
        key: 0,
        visible: q.value,
        label: "Install pack",
        busy: O.value,
        onClose: X[22] || (X[22] = (ae) => q.value = !1)
      }, {
        default: K(() => [
          s("form", {
            class: "work-dialog-box work-stack",
            onSubmit: Ie(di, ["prevent"])
          }, [
            X[26] || (X[26] = s("h2", null, "Install a pack", -1)),
            X[27] || (X[27] = s("p", { class: "work-muted work-small" }, "Packs give an empty board a starting setup. Review checks whether this board is eligible.", -1)),
            s("label", Jf, [
              X[25] || (X[25] = B("Pack", -1)),
              h(r(me), {
                modelValue: ce.value,
                "onUpdate:modelValue": X[20] || (X[20] = (ae) => ce.value = ae),
                "aria-label": "Pack to install",
                appendTo: "self",
                optionLabel: "title",
                optionValue: "id",
                optionDisabled: "disabled",
                options: ht.value.map((ae) => ({ ...ae, disabled: ae.plugins.some(($e) => !$e.installed) }))
              }, null, 8, ["modelValue", "options"])
            ]),
            ht.value.length ? I("", !0) : (n(), b("p", Zf, "No available packs were found.")),
            s("footer", Qf, [
              h(r(_), {
                label: "Cancel",
                severity: "secondary",
                outlined: "",
                onClick: X[21] || (X[21] = (ae) => q.value = !1)
              }),
              h(r(_), {
                type: "submit",
                label: "Review pack",
                disabled: !ce.value || O.value || st.value
              }, null, 8, ["disabled"])
            ])
          ], 32)
        ]),
        _: 1
      }, 8, ["visible", "busy"])) : I("", !0)
    ], 2));
  }
}), ep = /* @__PURE__ */ ye({
  __name: "SettingsRoot",
  setup(e) {
    const a = xi(), t = Ci();
    return Vi(Mo, (l) => {
      a.value.embedded && l.name === "boards" ? t("back-to-boards", {}) : t("navigate", { route: an(l) });
    }), (l, o) => (n(), J(_f, {
      "board-id": r(a).boardId ?? "",
      embedded: r(a).embedded,
      "focus-back": r(a).focusBack,
      onDirtyChange: o[0] || (o[0] = (d) => r(t)("dirty-change", { dirty: d }))
    }, null, 8, ["board-id", "embedded", "focus-back"]));
  }
}), tp = Si(ep, {
  type: "object",
  properties: {
    "board-id": { type: "string", default: "", description: "Board to administer." },
    "focus-back": { type: "boolean", default: !1, description: "Focus the back arrow when opening settings from the board picker." },
    embedded: { type: "boolean", default: !1, description: "Fits in a System detail pane." }
  }
});
Wi(import.meta.url, tp);
//# sourceMappingURL=settings.js.map
