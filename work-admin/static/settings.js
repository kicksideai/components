import { defineComponent as Ve, computed as z, openBlock as n, createBlock as H, resolveDynamicComponent as ta, normalizeProps as ri, guardReactiveProps as di, createSlots as Ga, withCtx as W, createElementVNode as r, normalizeClass as ct, createElementBlock as m, Fragment as _, renderList as ce, toDisplayString as D, createCommentVNode as T, unref as c, renderSlot as Je, inject as Ka, useModel as ui, useSlots as ci, watch as Se, createVNode as k, Transition as ko, withDirectives as vt, vShow as Ct, mergeModels as vi, ref as j, onMounted as ya, onUnmounted as Pl, resolveComponent as wo, createTextVNode as q, onBeforeUnmount as $t, useId as qt, withKeys as We, withModifiers as Oe, normalizeStyle as fi, watchEffect as $o, nextTick as ht, provide as Vo, reactive as mi } from "vue";
import { e as Et, u as pi, a as bi, b as gi, c as hi } from "./mount-Dm-3vIEJ.js";
import "pinia";
import { m as Ra, h as Jl, s as ge, i as yi, t as ze, g as ki, j as Wt, k as Ft, r as Zl, w as It, f as nt, l as _t, n as ot, o as He, q as Ut, v as xo, x as Ae, y as Ne, z as Co, A as At, B as So, C as ga, D as Ha, d as To, E as ka, c as Ol, F as wi, G as La, H as wl, I as $i, J as Xt, K as Vi, L as xi, _ as $l, M as Ql, N as Ci, O as Io, P as Si, Q as Ti, u as Ii, a as Di, p as Ei, R as Jt, S as Ui, T as _l, U as dl, V as Ai, W as Ri, X as eo, Y as Pi, Z as Oi } from "./usePackDiscovery-B-gbOGcR.js";
import me from "primevue/select";
import te from "primevue/button";
import { Icon as pe } from "@iconify/vue";
import { api as Vl, host as Do, on as Ni, define as Mi } from "@wippy-fe/proxy";
import tt from "primevue/tag";
import et from "primevue/toggleswitch";
import zt from "primevue/checkbox";
import Ie from "primevue/inputtext";
import ha from "primevue/textarea";
import yt from "primevue/inputnumber";
import Nl from "primevue/selectbutton";
import Fi from "primevue/message";
const ul = (e, a) => e.x > a.x && e.x < a.x + a.width && e.y > a.y && e.y < a.y + a.height;
function Li(e, a, t) {
  return e.x === a.x ? e.x > t.x && e.x < t.x + t.width && Math.max(e.y, a.y) > t.y && Math.min(e.y, a.y) < t.y + t.height : e.y > t.y && e.y < t.y + t.height && Math.max(e.x, a.x) > t.x && Math.min(e.x, a.x) < t.x + t.width;
}
function Ot(e, a, t) {
  const l = [.../* @__PURE__ */ new Set([e.x, a.x, ...t.flatMap((V) => [V.x, V.x + V.width])])].sort((V, $) => V - $), o = [.../* @__PURE__ */ new Set([e.y, a.y, ...t.flatMap((V) => [V.y, V.y + V.height])])].sort((V, $) => V - $);
  l.unshift(l[0] - 24), l.push(l.at(-1) + 24), o.unshift(o[0] - 24), o.push(o.at(-1) + 24);
  const d = l.length, v = o.indexOf(a.y) * d + l.indexOf(a.x), p = o.indexOf(e.y) * d + l.indexOf(e.x), h = (V) => ({ x: l[V % d], y: o[Math.floor(V / d)] }), i = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Map(), u = [];
  function x(V) {
    u.push(V);
    let $ = u.length - 1;
    for (; $; ) {
      const S = $ - 1 >> 1;
      if (u[S].priority <= V.priority) break;
      u[$] = u[S], $ = S;
    }
    u[$] = V;
  }
  function y() {
    const V = u[0], $ = u.pop();
    if (u.length) {
      let S = 0;
      for (; S * 2 + 1 < u.length; ) {
        let I = S * 2 + 1;
        if (I + 1 < u.length && u[I + 1].priority < u[I].priority && I++, $.priority <= u[I].priority) break;
        u[S] = u[I], S = I;
      }
      u[S] = $;
    }
    return V;
  }
  const g = (V) => Math.abs(V.x - a.x) + Math.abs(V.y - a.y);
  for (const V of [0, 1]) {
    const $ = p * 2 + V;
    i.set($, 0), x({ key: $, cost: 0, priority: g(e) });
  }
  const f = /* @__PURE__ */ new Map(), w = /* @__PURE__ */ new Map();
  for (; u.length; ) {
    const V = y(), $ = Math.floor(V.key / 2), S = V.key % 2;
    if (V.cost !== i.get(V.key)) continue;
    if ($ === v) {
      const J = [];
      let se = V.key;
      for (; se !== void 0; )
        J.push(h(Math.floor(se / 2))), se = s.get(se);
      return Eo(J.reverse());
    }
    const I = h($), B = $ % d, le = Math.floor($ / d);
    for (const [J, se] of [[B > 0 ? $ - 1 : -1, 0], [B + 1 < d ? $ + 1 : -1, 0], [le > 0 ? $ - d : -1, 1], [le + 1 < o.length ? $ + d : -1, 1]]) {
      if (J < 0) continue;
      const ue = h(J);
      if (f.has(J) || f.set(J, !t.some((M) => ul(ue, M))), !f.get(J)) continue;
      const fe = `${Math.min($, J)}:${Math.max($, J)}`;
      if (w.has(fe) || w.set(fe, !t.some((M) => Li(I, ue, M))), !w.get(fe)) continue;
      const be = V.cost + Math.abs(I.x - ue.x) + Math.abs(I.y - ue.y) + (S === se ? 0 : 18), oe = J * 2 + se;
      be >= (i.get(oe) ?? 1 / 0) || (i.set(oe, be), s.set(oe, V.key), x({ key: oe, cost: be, priority: be + g(ue) }));
    }
  }
  throw new Error("Process map has no collision-free route between its ports: " + JSON.stringify({ start: e, end: a, startInside: t.filter((V) => ul(e, V)), endInside: t.filter((V) => ul(a, V)) }));
}
function Eo(e) {
  const a = [];
  for (const t of e) {
    const l = a.at(-1), o = a.at(-2);
    l && l.x === t.x && l.y === t.y || (o && l && (o.x === l.x && l.x === t.x || o.y === l.y && l.y === t.y) && a.pop(), a.push(t));
  }
  return a;
}
const ia = (e) => Array.from(e).reduce((a, t) => a + (/[^\x20-\x7e]/u.test(t) ? 16 : /[MW@%]/.test(t) ? 11 : /[ilI.,:;!| ']/.test(t) ? 4 : 7.5), 0);
function Zt(e, a = 28) {
  const t = [];
  let l = "";
  for (const o of e.split(/\s+/u))
    for (let d = 0; d < o.length; d += a) {
      const v = o.slice(d, d + a);
      l && l.length + v.length + 1 > a && (t.push(l), l = ""), l = l ? l + " " + v : v;
    }
  return [...t, l].filter(Boolean);
}
function Ia(e) {
  if (e = Eo(e), !e.length) return "";
  let a = `M ${e[0].x} ${e[0].y}`;
  for (let l = 1; l < e.length - 1; l++) {
    const o = e[l - 1], d = e[l], v = e[l + 1], p = Math.hypot(d.x - o.x, d.y - o.y), h = Math.hypot(v.x - d.x, v.y - d.y), i = Math.min(8, p / 3, h / 3);
    i && (a += ` L ${d.x + (o.x - d.x) * i / p} ${d.y + (o.y - d.y) * i / p} Q ${d.x} ${d.y} ${d.x + (v.x - d.x) * i / h} ${d.y + (v.y - d.y) * i / h}`);
  }
  const t = e.at(-1);
  return a + ` L ${t.x} ${t.y}`;
}
function Bi(e, a = {}, t = { width: 1400, height: 480 }) {
  const l = t.direction ?? (t.width < 750 || Ra(e).length > 8 ? "TB" : "LR"), o = t.direction === "LR" && Ra(e).length > 6, d = new Jl.graphlib.Graph({ multigraph: !0 });
  d.setGraph({ rankdir: l, ranker: "network-simplex", acyclicer: "greedy", nodesep: 32, edgesep: 32, ranksep: 24, marginx: 32, marginy: 32 }), d.setDefaultEdgeLabel(() => ({}));
  const v = Ra(e), p = new Map(v.map((b, R) => [b.id, R])), h = e.states.map((b) => {
    const R = (e.transitions ?? []).filter((N) => N.from === "any" && N.to === b.id), E = Zt(ge(b), o ? 13 : 28), U = Zt(yi(b, e), o ? 13 : 28), G = R.flatMap((N) => Zt(ze(N) + " works from any state")), K = a.policy?.wip?.[b.id]?.limit, ve = K === void 0 ? 0 : ia(" · limit " + K), P = Math.max(o ? 122 : 168, ...E.map((N) => ia(N) + 58), ...U.map((N, re) => ia(N) + 32 + (re === U.length - 1 ? ve : 0)), ...G.map((N) => ia(N) + 32)), Z = Math.max(80, 42 + E.length * 18 + U.length * 16 + G.length * 18);
    return d.setNode(b.id, { width: P + (l === "LR" ? 36 : 0), height: Z + (l === "TB" ? 36 : 0) }), { state: b, x: 0, y: 0, width: P, height: Z, title: E, caption: U, badges: R, row: p.has(b.id) ? 0 : 1 };
  }), i = new Set(h.map((b) => b.state.id)), s = (e.transitions ?? []).flatMap((b) => b.from === "any" ? [] : b.from.filter((R) => i.has(R) && i.has(b.to)).map((R) => {
    const E = `${b.id}-${R}`, U = Zt(ze(b), o ? 12 : 28), G = Math.max(o ? 60 : 72, ...U.map((ve) => ia(ve) + 24)), K = Math.max(24, U.length * 16 + 10);
    return { transition: b, from: R, key: E, lines: U, width: G, height: K };
  })), u = /* @__PURE__ */ new Set(), x = /* @__PURE__ */ new Set(), y = new Set(s.filter((b) => b.from === b.transition.to || b.transition.to === e.initial || ["completed", "canceled"].includes(h.find((R) => R.state.id === b.from).state.category)).map((b) => b.key));
  function g(b) {
    if (!x.has(b)) {
      u.add(b);
      for (const R of s.filter((E) => E.from === b))
        y.has(R.key) || (u.has(R.transition.to) ? y.add(R.key) : g(R.transition.to));
      u.delete(b), x.add(b);
    }
  }
  g(e.initial);
  for (const b of h) g(b.state.id);
  for (const b of s) if (!y.has(b.key)) {
    const R = p.get(b.from), E = p.get(b.transition.to);
    d.setEdge(b.from, b.transition.to, { width: b.width, height: b.height, labelpos: "c", weight: R !== void 0 && E === R + 1 ? 100 : 1 }, b.key);
  }
  for (const b of e.transitions ?? []) if (b.from === "any" && i.has(e.initial) && i.has(b.to) && !p.has(b.to)) {
    const R = e.states.find((E) => E.id === b.to);
    d.setEdge(e.initial, b.to, { minlen: ["completed", "canceled"].includes(R.category) ? Math.max(1, v.length - 1) : 1 }, `any:${b.id}`);
  }
  const f = e.states.flatMap((b) => (b.regions ?? []).filter((R) => i.has(R.initial)).map((R, E) => {
    const U = `lane:${b.id}:${E}`;
    return d.setEdge(b.id, R.initial, {}, U), { state: b, region: R, key: U };
  }));
  if (!h.length) return { nodes: h, edges: [], parallels: [], main: v, direction: l, width: 320, height: 160 };
  Jl.layout(d);
  for (const b of h) Object.assign(b, { x: d.node(b.state.id).x, y: d.node(b.state.id).y });
  const w = l === "TB", V = s.filter((b) => !y.has(b.key)).map((b) => d.edge({ v: b.from, w: b.transition.to, name: b.key })), $ = [...h, ...V], S = Math.max(...$.map((b) => b.x + b.width / 2)), I = Math.max(...$.map((b) => b.y + b.height / 2)), B = (b) => h.find((R) => R.state.id === b), le = s.filter((b) => y.has(b.key)).sort((b, R) => {
    const E = w ? "y" : "x";
    return Math.abs(B(b.from)[E] - B(b.transition.to)[E]) - Math.abs(B(R.from)[E] - B(R.transition.to)[E]);
  }), J = /* @__PURE__ */ new Map(), se = Math.max(0, ...le.map((b) => b.width));
  let ue = I + 32;
  for (const [b, R] of le.entries()) {
    const E = B(R.from), U = B(R.transition.to), G = w ? S + 16 + se + 28 + b * 18 : ue + R.height / 2, K = w ? S + 16 + se / 2 : (E.x + U.x) / 2;
    let ve = w ? E.y + E.height / 2 + 18 : G;
    if (w) for (const P of [...J.values()].sort((Z, N) => Z.y - N.y))
      ve + R.height / 2 + 10 > P.y - P.height / 2 - 10 && ve - R.height / 2 - 10 < P.y + P.height / 2 + 10 && (ve = P.y + P.height / 2 + 24 + R.height / 2);
    J.set(R.key, { x: K, y: ve, corridor: G, height: R.height }), ue = G + R.height / 2 + 24;
  }
  const fe = s.map((b) => ({ ...b, ...J.get(b.key) ?? d.edge({ v: b.from, w: b.transition.to, name: b.key }) })), be = (b, R) => ({ x: b.x - b.width / 2 - R, y: b.y - b.height / 2 - R, width: b.width + R * 2, height: b.height + R * 2 }), oe = [...h.map((b) => be(b, 12)), ...fe.map((b) => be(b, 10))], M = (b, R) => ({
    start: w ? { x: b.x, y: b.y + b.height / 2 } : { x: b.x + b.width / 2, y: b.y },
    end: w ? { x: R.x, y: R.y - R.height / 2 } : { x: R.x - R.width / 2, y: R.y }
  }), Q = (b, R) => w ? { x: b.x, y: b.y + R } : { x: b.x + R, y: b.y }, F = fe.map((b) => {
    const R = h.find((Ue) => Ue.state.id === b.from), E = h.find((Ue) => Ue.state.id === b.transition.to), { start: U, end: G } = M(R, E), K = y.has(b.key), ve = Q(U, 18), P = Q(G, -18), Z = (K || !w ? b.width : b.height) / 2 + 10, N = K ? { x: b.x + (w ? -Z : Z), y: b.y } : Q(b, -Z), re = K ? { x: b.x + (w ? Z : -Z), y: b.y } : Q(b, Z);
    let we;
    if (K) {
      const { corridor: Ue } = J.get(b.key), qe = w ? { x: Ue, y: b.y } : { x: ve.x, y: Ue }, xt = w ? { x: Ue, y: P.y } : { x: P.x, y: Ue };
      we = w ? [
        [U, ...Ot(ve, N, oe)],
        [re, qe, xt, ...Ot(xt, P, oe), G]
      ] : [
        [U, ...Ot(ve, qe, oe), N],
        [re, ...Ot(xt, P, oe), G]
      ];
    } else we = [
      [U, ...Ot(ve, N, oe)],
      [...Ot(re, P, oe), G]
    ];
    const Ee = K ? "return" : p.get(b.transition.to) === (p.get(b.from) ?? -2) + 1 ? "main" : "forward";
    return { ...b, points: we.flat(), segments: we, path: we.map(Ia).join(" "), type: Ee, targetOffset: 0 };
  }), ne = f.map((b) => {
    const R = h.find((ve) => ve.state.id === b.state.id), E = h.find((ve) => ve.state.id === b.region.initial), { start: U, end: G } = M(R, E), K = [U, ...Ot(Q(U, 18), Q(G, -18), oe), G];
    return { state: b.state, key: b.key, points: K, path: Ia(K) };
  }), ke = [...h.flatMap((b) => [{ x: b.x - b.width / 2, y: b.y - b.height / 2 }, { x: b.x + b.width / 2, y: b.y + b.height / 2 }]), ...F.flatMap((b) => [...b.points, { x: b.x - b.width / 2, y: b.y - b.height / 2 }, { x: b.x + b.width / 2, y: b.y + b.height / 2 }]), ...ne.flatMap((b) => b.points)], X = 32 - Math.min(...ke.map((b) => b.x)), A = 32 - Math.min(...ke.map((b) => b.y)), C = Math.max(...ke.map((b) => b.x)) + X + 32, O = Math.max(...ke.map((b) => b.y)) + A + 32, Y = (b) => ({ x: b.x + X, y: b.y + A });
  for (const b of h) Object.assign(b, Y(b));
  for (const b of F)
    Object.assign(b, Y(b)), b.segments = b.segments.map((R) => R.map(Y)), b.points = b.segments.flat(), b.path = b.segments.map(Ia).join(" ");
  for (const b of ne)
    b.points = b.points.map(Y), b.path = Ia(b.points);
  return { nodes: h, edges: F, parallels: ne, main: v, direction: l, width: C, height: O };
}
const ji = ["aria-label"], zi = {
  key: 0,
  class: "kx-settings-rail-group"
}, qi = ["aria-current", "onClick"], Wi = { class: "kx-settings-rail-label" }, Gi = /* @__PURE__ */ Ve({
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
    return (o, d) => (n(), H(ta(e.title ? ki : "div"), ri(di(e.title ? { title: e.title, count: e.count, settings: !0 } : { class: "kx-settings-rail-standalone" })), Ga({
      default: W(() => [
        r("nav", {
          class: ct(["kx-settings-rail", { "kx-settings-rail-framed": e.title }]),
          "aria-label": e.label,
          onKeydown: l
        }, [
          (n(!0), m(_, null, ce(t.value, (v, p) => (n(), m("div", {
            key: v.items[0]?.value ?? p,
            class: ct(["kx-settings-rail-section", { "kx-settings-rail-leading": e.leadingItem && p === 0 }])
          }, [
            v.heading ? (n(), m("div", zi, D(v.heading), 1)) : T("", !0),
            (n(!0), m(_, null, ce(v.items, (h) => (n(), m("button", {
              key: h.value,
              type: "button",
              class: "kx-settings-rail-item",
              "aria-current": h.value === e.value ? "true" : void 0,
              onClick: (i) => o.$emit("update:value", h.value)
            }, [
              h.icon ? (n(), H(c(pe), {
                key: 0,
                class: "kx-settings-rail-icon",
                icon: h.icon,
                "aria-hidden": "true"
              }, null, 8, ["icon"])) : T("", !0),
              r("span", Wi, D(h.label), 1)
            ], 8, qi))), 128))
          ], 2))), 128))
        ], 42, ji)
      ]),
      _: 2
    }, [
      e.title && o.$slots.actions ? {
        name: "actions",
        fn: W(() => [
          Je(o.$slots, "actions")
        ]),
        key: "0"
      } : void 0
    ]), 1040));
  }
}), Uo = Symbol("work-navigation");
function Ki() {
  return Ka(Uo, () => {
  });
}
function Hi(e) {
  if (e.name === "boards") return "";
  const a = encodeURIComponent(e.board);
  return e.name === "settings" ? `${a}/settings` : a;
}
const Gt = (e) => `/api/v1/work/boards/${encodeURIComponent(e)}`, to = (e) => ({ declaration: e.declaration, expected_generation: e.expected_generation, plugin_configs: e.plugin_configs }), jt = {
  packPlan: (e, a) => Wt(`${Gt(e)}/pack_plan`, a, "Pack plan"),
  packApply: (e, a, t) => Wt(`${Gt(e)}/pack_apply`, { ...a, key: t }, "Apply pack"),
  plan: (e, a) => Wt(`${Gt(e)}/plan_schema`, to(a), "Schema plan"),
  apply: (e, a, t) => Wt(`${Gt(e)}/apply_schema`, { ...to(a), key: t }, "Apply schema"),
  resume: (e) => Wt(`${Gt(e)}/resume_migration`, {}, "Resume migration"),
  configure: (e, a, t) => Wt(`${Gt(e)}/configure_plugin`, { plugin: a, ...t === void 0 ? {} : { config: t } }, "Configure plugin")
}, Ml = /* @__PURE__ */ Ve({
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
        const h = p.closest('[data-work-action], button, a, input, textarea, [role="combobox"], [role="checkbox"], [role="switch"], details');
        if (h && h !== v.currentTarget) return;
      }
      l("activate", v);
    }
    function d(v) {
      v.target !== v.currentTarget || !["Enter", " "].includes(v.key) || (v.preventDefault(), t.disabled || l("activate", v));
    }
    return (v, p) => (n(), H(ta(e.as), {
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
      default: W(() => [
        Je(v.$slots, "default")
      ]),
      _: 3
    }, 40, ["type", "role", "tabindex", "disabled", "aria-disabled"]));
  }
}), Ya = Symbol("section row"), Yi = { class: "work-definition" }, Xi = {
  key: 0,
  class: "work-definition-handle"
}, Ji = { class: "work-definition-lead" }, Zi = ["title"], Qi = {
  key: 0,
  class: "work-definition-description"
}, _i = { class: "work-definition-details" }, en = { class: "work-definition-code" }, tn = ["title"], an = { class: "work-definition-kind" }, ln = {
  key: 0,
  class: "work-definition-kind-label"
}, on = { class: "work-definition-kind-value" }, nn = { class: "work-definition-flags" }, sn = { class: "work-definition-usage" }, rn = { class: "work-definition-actions" }, dn = ["inert"], Xa = /* @__PURE__ */ Ve({
  __name: "DefinitionRow",
  props: /* @__PURE__ */ vi({
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
    const a = e, t = ui(e, "open");
    a.initialOpen && (t.value = !0);
    const l = ci(), o = Ka(Ya, void 0);
    function d(p) {
      return !!a.routeSection && !!a.routeId && p === a.routeSection + "/" + a.routeId;
    }
    Se(() => o?.selected.value, (p, h) => {
      d(p) ? t.value = !0 : d(h) && (t.value = !1);
    }, { immediate: !0 });
    function v() {
      t.value = !t.value, a.routeSection && a.routeId && o?.choose(a.routeSection, a.routeId, t.value);
    }
    return (p, h) => (n(), m("article", Yi, [
      r("header", {
        class: ct(["work-definition-head", { "work-definition-has-handle": c(l).handle }])
      }, [
        c(l).handle ? (n(), m("div", Xi, [
          Je(p.$slots, "handle")
        ])) : T("", !0),
        r("div", Ji, [
          k(Ml, {
            class: "work-definition-toggle",
            "aria-expanded": t.value,
            onActivate: v
          }, {
            default: W(() => [
              k(c(pe), {
                icon: "tabler:chevron-right",
                "aria-hidden": "true"
              }),
              r("span", {
                class: "work-row-title",
                title: e.title
              }, D(e.title), 9, Zi)
            ]),
            _: 1
          }, 8, ["aria-expanded"]),
          e.description ? (n(), m("p", Qi, D(e.description), 1)) : T("", !0)
        ]),
        r("div", _i, [
          r("span", en, [
            e.code ? (n(), m("code", {
              key: 0,
              class: "work-mono",
              title: e.code
            }, D(e.code), 9, tn)) : T("", !0)
          ]),
          r("span", an, [
            e.kind ? (n(), H(c(tt), {
              key: 0,
              severity: "secondary"
            }, {
              default: W(() => [
                e.kindLabel ? (n(), m("span", ln, D(e.kindLabel) + ":", 1)) : T("", !0),
                r("span", on, D(e.kind), 1)
              ]),
              _: 1
            })) : T("", !0),
            Je(p.$slots, "status")
          ]),
          r("span", nn, [
            Je(p.$slots, "flags")
          ]),
          r("div", sn, [
            Je(p.$slots, "usage")
          ])
        ]),
        r("div", rn, [
          Je(p.$slots, "actions")
        ])
      ], 2),
      k(ko, {
        name: "work-panel",
        persisted: ""
      }, {
        default: W(() => [
          vt(r("div", {
            inert: !t.value,
            class: "work-definition-body work-stack"
          }, [
            Je(p.$slots, "default")
          ], 8, dn), [
            [Ct, t.value]
          ])
        ]),
        _: 3
      })
    ]));
  }
}), un = { class: "work-definition-scroll" }, cn = {
  key: 0,
  class: "work-definition-columns",
  "aria-hidden": "true"
}, vn = { key: 0 }, fn = { class: "work-definition-usage" }, Ja = /* @__PURE__ */ Ve({
  __name: "DefinitionList",
  props: {
    count: {},
    columns: {}
  },
  setup(e) {
    return (a, t) => (n(), m("div", un, [
      r("div", {
        class: ct(["work-field-builder", "work-definitions-" + e.columns])
      }, [
        e.count > 3 && e.columns !== "plugins" ? (n(), m("div", cn, [
          t[0] || (t[0] = r("span", null, null, -1)),
          t[1] || (t[1] = r("span", null, "Name", -1)),
          t[2] || (t[2] = r("span", { class: "work-definition-code" }, "Identifier", -1)),
          r("span", null, D(e.columns === "types" ? "Workflow" : "Kind"), 1),
          e.columns === "fields" ? (n(), m("span", vn, "Details")) : T("", !0),
          r("span", fn, D(e.columns === "fields" ? "Used by" : "Details"), 1),
          t[3] || (t[3] = r("span", null, null, -1))
        ])) : T("", !0),
        Je(a.$slots, "default")
      ], 2)
    ]));
  }
}), mn = [
  { code: "key", form: "text", index: "key" },
  { code: "type", form: "text", index: "key" },
  { code: "state", form: "text", index: "key" },
  { code: "category", form: "text", index: "key" },
  { code: "rank", form: "text", index: "key" },
  { code: "parent", form: "text", index: "key" },
  { code: "created_at", form: "time", index: "key" },
  { code: "updated_at", form: "time", index: "key" }
];
function pn(e) {
  const a = e.compiled.processes?.flatMap((t) => t.states.map((l) => ({ id: l.id, label: l.name }))) ?? [];
  return [...mn.filter((t) => t.code !== "rank").map((t) => t.code === "state" ? { ...t, type: "option", options: a } : t.code === "category" ? { ...t, type: "option", options: ["triage", "backlog", "unstarted", "started", "completed", "canceled"].map((l) => ({ id: l })) } : t), ...(e.compiled.fields ?? []).filter((t) => t.index && t.index !== "none")];
}
function bn(e) {
  if (e?.cardinality && e.cardinality !== "one") return ["has", "in", "nin", "is_null", ...e.type === "principal" ? ["member_of"] : []];
  const a = ["eq", "neq", "in", "nin", "is_null", ...e?.type === "principal" ? ["member_of"] : []];
  return e && (["int", "number", "dec", "time", "quantity"].includes(e.form ?? "") || e.index === "number") && a.push("lt", "lte", "gt", "gte", "between"), e?.form === "text" && e.type !== "option" && a.push("contains", "starts_with"), a;
}
const gn = { class: "work-field-control" }, hn = ["id"], yn = {
  key: 1,
  class: "work-stack work-tight"
}, kn = { class: "work-chips" }, wn = {
  key: 5,
  class: "work-row"
}, $n = ["inert"], Vn = ["value"], xn = {
  key: 1,
  class: "work-muted"
}, Cn = ["inert"], Sn = ["value"], Tn = {
  key: 1,
  class: "work-muted"
}, In = {
  key: 11,
  class: "work-stack work-tight"
}, Dn = {
  class: "work-stack work-tight",
  "aria-label": "Matching items"
}, En = { class: "work-mono" }, Un = {
  key: 15,
  class: "work-error work-small",
  role: "alert"
}, Ao = /* @__PURE__ */ Ve({
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
    const t = e, l = a, o = z(() => t.inputId ?? `field-${t.field.code}`), d = z(() => !!t.field.cardinality && t.field.cardinality !== "one"), v = z(() => Array.isArray(t.modelValue) ? t.modelValue : []), p = z(() => t.modelValue == null ? "" : typeof t.modelValue == "object" ? Ft(t.modelValue) : String(t.modelValue)), h = z(() => {
      const b = t.modelValue;
      return b && typeof b == "object" && "ref" in b && Array.isArray(b.ref) ? String(b.ref[1] ?? "") : "";
    }), i = z(() => t.disabled || Zl(t.field)), s = j(!1), u = j(!1), x = j(!1), y = j(""), g = j(""), f = j([]), w = _t(), V = j([]);
    let $ = 0, S;
    const I = /* @__PURE__ */ new Set();
    Se(v, (b) => {
      V.value = S ?? b.map((R, E) => V.value[E] ?? $++), S = void 0;
    }, { immediate: !0 });
    function B(b) {
      l("update:modelValue", b);
    }
    function le(b, R) {
      const E = [...v.value];
      E[b] = R, B(E);
    }
    function J(b, R) {
      R ? I.delete(b) : I.add(b), l("validity", !I.size);
    }
    function se(b) {
      I.delete(V.value[b]), l("validity", !I.size), S = V.value.filter((R, E) => E !== b), B(v.value.filter((R, E) => E !== b));
    }
    function ue() {
      S = [...V.value, $++], B([...v.value, t.field.form === "bool" ? !1 : t.field.form === "record" ? {} : ""]);
    }
    function fe(b) {
      const R = b.detail, E = R?.principal_id ?? R?.id;
      B(E ? { kind: R.type ?? "user", id: E } : void 0);
    }
    function be(b) {
      const R = b.detail;
      B(R?.thread_id ? { ref: ["component", R.thread_id] } : void 0);
    }
    const oe = j("");
    let M = "";
    Se(() => t.modelValue, (b) => {
      const R = JSON.stringify(b ?? {}, null, 2);
      R !== M && (M = R, oe.value = R, y.value = "", l("validity", !0));
    }, { immediate: !0 });
    function Q(b) {
      oe.value = b;
      try {
        const R = JSON.parse(b);
        if (!R || typeof R != "object" || Array.isArray(R)) throw new Error("Enter a JSON object.");
        if (t.field.type === "rich_text" && !("type" in R && typeof R.type == "string")) throw new Error("The document needs a type.");
        M = JSON.stringify(R, null, 2), y.value = "", l("validity", !0), B(R);
      } catch (R) {
        y.value = R instanceof Error ? R.message : "Invalid JSON.", l("validity", !1);
      }
    }
    function F(b) {
      if (!b) {
        l("validity", !0), B(void 0);
        return;
      }
      const R = Number.isFinite(Number(b)) && (t.field.form !== "int" || Number.isSafeInteger(Number(b)));
      l("validity", R), R && B(t.field.form === "int" ? Number(b) : b);
    }
    const ne = z(() => t.field.config?.format === "date");
    function ke(b) {
      B(b ? ne.value ? b : new Date(b).toISOString() : void 0);
    }
    const X = z(() => {
      if (typeof t.modelValue != "string") return "";
      if (ne.value) return t.modelValue.slice(0, 10);
      const b = new Date(t.modelValue);
      return Number.isNaN(b.getTime()) ? "" : new Date(b.getTime() - b.getTimezoneOffset() * 6e4).toISOString().slice(0, 16);
    });
    function A(b) {
      B(b.detail?.ref);
    }
    function C(b) {
      B(b.detail?.value);
    }
    let O;
    Se(g, () => {
      const b = w();
      if (clearTimeout(O), !g.value.trim()) {
        f.value = [];
        return;
      }
      O = setTimeout(async () => {
        try {
          const R = g.value.trim(), E = /^[A-Z][A-Z0-9]{1,9}-[0-9]+$/.test(R) ? [(await It.item(t.boardId, { key: R })).item] : (await It.query(t.boardId, { where: { field: "title", op: "contains", value: R }, limit: 8 })).items;
          b() && (f.value = E, y.value = "");
        } catch (R) {
          b() && (y.value = nt(R, "Could not search items."));
        }
      }, 200);
    });
    function Y(b) {
      B({ board: t.boardId, item: b.id }), g.value = "", f.value = [];
    }
    ya(async () => {
      t.field.type === "principal" ? s.value = await Et("wc-principal-picker") : t.field.config?.target === "component" && (s.value = await Et("wc-component-picker"));
    });
    for (const [b, R] of [[() => t.editorTag, x], [() => t.linkTag, u]])
      Se(b, async (E, U, G) => {
        let K = !0;
        if (G(() => {
          K = !1;
        }), R.value = !1, E) {
          const ve = await Et(E);
          K && (R.value = ve);
        }
      }, { immediate: !0 });
    return Pl(() => {
      clearTimeout(O), w();
    }), (b, R) => {
      const E = wo("FieldControl", !0);
      return n(), m("div", gn, [
        c(Zl)(e.field) ? (n(), m("output", {
          key: 0,
          id: o.value,
          class: "work-read-value"
        }, D(c(Ft)(e.modelValue, e.field)), 9, hn)) : d.value ? (n(), m("div", yn, [
          r("div", kn, [
            (n(!0), m(_, null, ce(v.value, (U, G) => (n(), H(c(tt), {
              key: V.value[G],
              class: "kx-tag-sm",
              severity: "secondary"
            }, {
              default: W(() => [
                q(D(c(Ft)(U, e.field)) + " ", 1),
                k(c(te), {
                  type: "button",
                  class: "work-icon-button",
                  disabled: i.value,
                  "aria-label": "Remove value " + (G + 1),
                  onClick: (K) => se(G),
                  severity: "secondary",
                  text: "",
                  size: "small"
                }, {
                  default: W(() => [
                    k(c(pe), {
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
          (n(!0), m(_, null, ce(v.value, (U, G) => (n(), m("div", {
            key: V.value[G],
            class: "work-stack work-tight"
          }, [
            k(E, {
              "board-id": e.boardId,
              field: { ...e.field, cardinality: "one" },
              "model-value": U,
              "input-id": o.value + "-" + V.value[G],
              disabled: i.value,
              "editor-tag": e.editorTag,
              "link-tag": e.linkTag,
              "onUpdate:modelValue": (K) => le(G, K),
              onValidity: (K) => J(V.value[G], K)
            }, null, 8, ["board-id", "field", "model-value", "input-id", "disabled", "editor-tag", "link-tag", "onUpdate:modelValue", "onValidity"])
          ]))), 128)),
          k(c(te), {
            label: "Add value",
            severity: "secondary",
            size: "small",
            disabled: i.value,
            onClick: ue,
            outlined: ""
          }, {
            icon: W(() => [
              k(c(pe), {
                icon: "tabler:plus",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled"])
        ])) : e.editorTag && x.value ? (n(), H(ta(e.editorTag), {
          key: 2,
          "board-id": e.boardId,
          value: JSON.stringify(e.modelValue ?? null),
          config: JSON.stringify(e.field.config ?? {}),
          readonly: i.value || void 0,
          onChange: C
        }, null, 40, ["board-id", "value", "config", "readonly"])) : e.linkTag && u.value ? (n(), H(ta(e.linkTag), {
          key: 3,
          "board-id": e.boardId,
          kind: e.field.config?.target ?? e.field.type,
          value: JSON.stringify(e.modelValue ?? null),
          readonly: i.value || void 0,
          onChange: A
        }, null, 40, ["board-id", "kind", "value", "readonly"])) : e.field.type === "option" ? (n(), H(c(me), {
          key: 4,
          placeholder: "Not set",
          inputId: o.value,
          "model-value": e.modelValue ?? "",
          disabled: i.value,
          "onUpdate:modelValue": R[0] || (R[0] = (U) => B(U || void 0)),
          appendTo: "self",
          optionLabel: "label",
          optionValue: "value",
          optionDisabled: "disabled",
          options: [{ label: "Not set", value: "", disabled: !1 }, ...(e.field.options ?? []).map((U) => ({ label: U.label ?? U.id, value: U.id, disabled: !1 }))]
        }, null, 8, ["inputId", "model-value", "disabled", "options"])) : e.field.form === "bool" ? (n(), m("label", wn, [
          k(c(zt), {
            inputId: o.value,
            "model-value": e.modelValue === !0,
            disabled: i.value,
            "onUpdate:modelValue": R[1] || (R[1] = (U) => B(U)),
            binary: ""
          }, null, 8, ["inputId", "model-value", "disabled"]),
          q(D(e.modelValue === !0 ? "Yes" : e.modelValue === !1 ? "No" : "Not set"), 1)
        ])) : e.field.form === "int" ? (n(), H(c(yt), {
          key: 6,
          inputId: o.value,
          "model-value": p.value === "" ? null : Number(p.value),
          disabled: i.value,
          "onUpdate:modelValue": R[2] || (R[2] = (U) => F(U == null ? "" : String(U))),
          useGrouping: !1
        }, null, 8, ["inputId", "model-value", "disabled"])) : e.field.form === "dec" ? (n(), H(c(Ie), {
          key: 7,
          id: o.value,
          inputmode: "decimal",
          "model-value": p.value,
          disabled: i.value,
          "onUpdate:modelValue": R[3] || (R[3] = (U) => F(U ?? ""))
        }, null, 8, ["id", "model-value", "disabled"])) : e.field.form === "time" ? (n(), H(c(Ie), {
          key: 8,
          id: o.value,
          type: ne.value ? "date" : "datetime-local",
          value: X.value,
          disabled: i.value,
          onInput: R[4] || (R[4] = (U) => ke(U.target.value))
        }, null, 8, ["id", "type", "value", "disabled"])) : e.field.type === "principal" ? (n(), m("div", {
          key: 9,
          inert: i.value || void 0,
          class: "work-stack work-tight"
        }, [
          s.value ? (n(), m("wc-principal-picker", {
            key: 0,
            value: JSON.stringify(e.modelValue ?? {}),
            kinds: "user,group",
            onConfigChanged: fe
          }, null, 40, Vn)) : (n(), m("span", xn, D(c(Ft)(e.modelValue, e.field)) + " · Person picker is unavailable.", 1))
        ], 8, $n)) : e.field.config?.target === "component" ? (n(), m("div", {
          key: 10,
          inert: i.value || void 0
        }, [
          s.value ? (n(), m("wc-component-picker", {
            key: 0,
            value: JSON.stringify({ thread_id: h.value }),
            onChange: be
          }, null, 40, Sn)) : (n(), m("span", Tn, "Component picker is unavailable."))
        ], 8, Cn)) : e.field.type === "item" ? (n(), m("div", In, [
          k(c(tt), {
            class: "kx-tag-sm",
            severity: "secondary"
          }, {
            default: W(() => [
              q(D(c(Ft)(e.modelValue, e.field)), 1)
            ]),
            _: 1
          }),
          k(c(Ie), {
            id: o.value,
            modelValue: g.value,
            "onUpdate:modelValue": R[5] || (R[5] = (U) => g.value = U),
            disabled: i.value,
            placeholder: "Search a title or enter an item key",
            "aria-label": "Search items"
          }, null, 8, ["id", "modelValue", "disabled"]),
          r("div", Dn, [
            (n(!0), m(_, null, ce(f.value, (U) => (n(), H(Ml, {
              key: U.id,
              class: "work-match-item",
              disabled: i.value,
              onActivate: (G) => Y(U)
            }, {
              default: W(() => [
                r("code", En, D(U.key), 1),
                r("span", null, D(c(Ft)(U.values.title)), 1)
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
            onClick: R[6] || (R[6] = (U) => B(void 0)),
            outlined: ""
          }, {
            icon: W(() => [
              k(c(pe), {
                icon: "tabler:list-check",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled"])) : T("", !0)
        ])) : e.field.form === "record" || e.field.type === "rich_text" || e.field.form === "quantity" || e.field.form === "ref" ? (n(), H(c(ha), {
          key: 12,
          id: o.value,
          "model-value": oe.value,
          rows: "3",
          disabled: i.value,
          "aria-invalid": !!y.value,
          "onUpdate:modelValue": R[7] || (R[7] = (U) => Q(U ?? ""))
        }, null, 8, ["id", "model-value", "disabled", "aria-invalid"])) : e.field.code === "description" ? (n(), H(c(ha), {
          key: 13,
          id: o.value,
          "model-value": p.value,
          rows: "4",
          disabled: i.value,
          "onUpdate:modelValue": R[8] || (R[8] = (U) => B(U))
        }, null, 8, ["id", "model-value", "disabled"])) : (n(), H(c(Ie), {
          key: 14,
          id: o.value,
          "model-value": p.value,
          disabled: i.value,
          "onUpdate:modelValue": R[9] || (R[9] = (U) => B(U))
        }, null, 8, ["id", "model-value", "disabled"])),
        y.value ? (n(), m("span", Un, D(y.value), 1)) : T("", !0)
      ]);
    };
  }
}), An = { class: "work-stack work-tight work-operand-control" }, Rn = { class: "work-row work-small" }, Pn = {
  key: 1,
  class: "work-muted work-small"
}, On = {
  key: 2,
  class: "work-stack work-tight"
}, Nn = { class: "work-small" }, Mn = {
  key: 0,
  class: "work-error work-small",
  role: "alert"
}, na = /* @__PURE__ */ Ve({
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
    const t = e, l = a, o = z(() => "$actor" in ot(t.modelValue) ? "actor" : "$now" in ot(t.modelValue) ? "now" : "literal"), d = j(""), v = j("");
    Se(() => t.modelValue, (i) => {
      d.value = JSON.stringify(i ?? []), v.value = "";
    }, { immediate: !0 });
    function p(i) {
      l("update:modelValue", i === "actor" ? { $actor: "id" } : i === "now" ? { $now: "P0D" } : void 0), l("validity", !0);
    }
    function h(i) {
      d.value = i;
      try {
        const s = JSON.parse(i);
        if (!Array.isArray(s)) throw new Error("Enter a JSON list.");
        v.value = "", l("validity", !0), l("update:modelValue", s);
      } catch (s) {
        v.value = s instanceof Error ? s.message : "Invalid values.", l("validity", !1);
      }
    }
    return (i, s) => (n(), m("div", An, [
      r("label", Rn, [
        q(D(e.label), 1),
        k(c(me), {
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
      o.value === "now" ? (n(), H(c(Ie), {
        key: 0,
        "aria-label": e.label + " time offset",
        value: c(ot)(e.modelValue).$now,
        disabled: e.disabled,
        placeholder: "-P7D",
        onInput: s[1] || (s[1] = (u) => l("update:modelValue", { $now: u.target.value }))
      }, null, 8, ["aria-label", "value", "disabled"])) : o.value === "actor" ? (n(), m("span", Pn, "The signed-in actor’s id")) : e.multiple ? (n(), m("div", On, [
        r("label", Nn, [
          s[5] || (s[5] = q("Values as JSON (operands may appear in the list)", -1)),
          k(c(ha), {
            class: "work-mono",
            "aria-label": e.label + " values",
            value: d.value,
            disabled: e.disabled,
            rows: "2",
            onInput: s[2] || (s[2] = (u) => h(u.target.value))
          }, null, 8, ["aria-label", "value", "disabled"])
        ]),
        v.value ? (n(), m("p", Mn, D(v.value), 1)) : T("", !0)
      ])) : (n(), H(Ao, {
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
}), Fn = ["disabled"], Ln = { class: "work-small work-mono" }, Bn = { class: "work-row work-small" }, jn = { class: "work-row work-wrap" }, zn = { key: 3 }, qn = { class: "work-row work-wrap" }, Wn = { class: "work-row" }, Gn = { class: "work-row" }, Kn = { class: "work-row" }, Hn = {
  key: 3,
  class: "work-row work-wrap"
}, Yn = { class: "work-row work-wrap" }, Xn = /* @__PURE__ */ Ve({
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
    const t = e, l = a, o = z(() => t.path ?? "where"), d = z(() => t.depth ?? 1), v = z(() => ["and", "or", "not", "history", "match", "rel", "children"].find((oe) => oe in t.modelValue) ?? "field"), p = z(() => pn(t.schema)), h = z(() => p.value.find((oe) => oe.code === t.modelValue.field) ?? { code: "value", form: "text" }), i = z(() => ot(t.modelValue.history)), s = z(() => p.value.find((oe) => oe.code === i.value.field) ?? { code: "history", form: "text" }), u = z(() => Array.isArray(t.modelValue[v.value]) ? t.modelValue[v.value] : []), x = {
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
    }, g = () => ({ field: "category", op: "eq", value: "unstarted" }), f = j(/* @__PURE__ */ new Set());
    function w(oe, M) {
      M ? f.value.delete(oe) : f.value.add(oe), l("validity", f.value.size === 0);
    }
    Se(v, () => {
      f.value.clear(), l("validity", !0);
    });
    function V(oe) {
      const M = /* @__PURE__ */ new Set();
      for (const Q of f.value) {
        const F = Number(Q);
        !Number.isNaN(F) && F !== oe && M.add(String(F > oe ? F - 1 : F));
      }
      f.value = M, l("validity", M.size === 0), S({ [v.value]: u.value.filter((Q, F) => F !== oe) });
    }
    function $(oe) {
      l("update:modelValue", oe);
    }
    function S(oe) {
      $({ ...t.modelValue, ...oe });
    }
    function I(oe) {
      $(oe === "field" ? g() : oe === "and" || oe === "or" ? { [oe]: [g()] } : oe === "not" ? { not: g() } : oe === "history" ? { history: { field: "state", changed: !0 } } : oe === "match" ? { match: "" } : oe === "children" ? { children: !0, q: "some", where: g() } : { rel: t.schema.compiled.relation_types?.[0]?.id ?? "", dir: "outward", q: "some", where: g() });
    }
    function B(oe, M) {
      S({ [v.value]: u.value.map((Q, F) => F === oe ? M : Q) });
    }
    function le(oe, M) {
      const Q = { ...i.value };
      M === void 0 ? (delete Q[oe], w(oe, !0)) : Q[oe] = M, S({ history: Q });
    }
    function J(oe) {
      f.value.clear(), l("validity", !0);
      const M = { ...i.value };
      delete M.was, delete M.changed, delete M.from, delete M.to, M[oe] = oe === "changed" ? !0 : "", S({ history: M });
    }
    const se = { code: "actor", form: "text" }, ue = { code: "at", form: "time" }, fe = z(() => Array.isArray(i.value.during) ? i.value.during : []);
    function be(oe, M) {
      const Q = [...fe.value];
      Q[oe] = M, le("during", Q);
    }
    return (oe, M) => {
      const Q = wo("FilterNode", !0);
      return n(), m("fieldset", {
        class: "work-filter-node",
        disabled: e.disabled
      }, [
        r("legend", Ln, D(o.value), 1),
        r("label", Bn, [
          M[21] || (M[21] = q("Condition", -1)),
          k(c(me), {
            "aria-label": o.value + " condition",
            "model-value": v.value,
            "onUpdate:modelValue": M[0] || (M[0] = (F) => I(F)),
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            optionDisabled: "disabled",
            options: Object.entries(y).map(([F, ne]) => ({ label: ne, value: F, disabled: d.value >= 6 && ["and", "or", "not", "rel", "children"].includes(F) }))
          }, null, 8, ["aria-label", "model-value", "options"])
        ]),
        v.value === "and" || v.value === "or" ? (n(), m(_, { key: 0 }, [
          (n(!0), m(_, null, ce(u.value, (F, ne) => (n(), m("div", {
            key: ne,
            class: "work-stack work-tight"
          }, [
            k(Q, {
              "board-id": e.boardId,
              schema: e.schema,
              "model-value": F,
              path: o.value + "." + v.value + "[" + ne + "]",
              depth: d.value + 1,
              "onUpdate:modelValue": (ke) => B(ne, ke),
              onValidity: (ke) => w(String(ne), ke)
            }, null, 8, ["board-id", "schema", "model-value", "path", "depth", "onUpdate:modelValue", "onValidity"]),
            k(c(te), {
              label: "Remove condition",
              size: "small",
              severity: "secondary",
              onClick: (ke) => V(ne),
              outlined: ""
            }, {
              icon: W(() => [
                k(c(pe), {
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
            onClick: M[1] || (M[1] = (F) => S({ [v.value]: [...u.value, g()] })),
            outlined: ""
          }, {
            icon: W(() => [
              k(c(pe), {
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
          "model-value": c(ot)(e.modelValue.not),
          path: o.value + ".not",
          depth: d.value + 1,
          "onUpdate:modelValue": M[2] || (M[2] = (F) => S({ not: F })),
          onValidity: M[3] || (M[3] = (F) => w("nested", F))
        }, null, 8, ["board-id", "schema", "model-value", "path", "depth"])) : v.value === "field" ? (n(), m(_, { key: 2 }, [
          r("div", jn, [
            r("label", null, [
              M[22] || (M[22] = q("Field", -1)),
              k(c(me), {
                "aria-label": o.value + " field",
                "model-value": e.modelValue.field,
                "onUpdate:modelValue": M[4] || (M[4] = (F) => S({ field: F, op: "eq", value: void 0 })),
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                optionDisabled: "disabled",
                options: [...(p.value ?? []).map((F) => ({ label: c(He)(F), value: F.code, disabled: !1 }))]
              }, null, 8, ["aria-label", "model-value", "options"])
            ]),
            r("label", null, [
              M[23] || (M[23] = q("Comparison", -1)),
              k(c(me), {
                "aria-label": o.value + " operator",
                "model-value": e.modelValue.op,
                "onUpdate:modelValue": M[5] || (M[5] = (F) => S({ op: F, value: F === "is_null" ? !0 : void 0 })),
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                options: c(bn)(h.value).map((F) => ({ value: F, label: x[F] }))
              }, null, 8, ["aria-label", "model-value", "options"])
            ])
          ]),
          k(na, {
            "board-id": e.boardId,
            field: e.modelValue.op === "is_null" ? { code: "null", form: "bool" } : h.value,
            "model-value": e.modelValue.value,
            multiple: ["in", "nin", "between"].includes(String(e.modelValue.op)),
            label: o.value + " value",
            "onUpdate:modelValue": M[6] || (M[6] = (F) => S({ value: F })),
            onValidity: M[7] || (M[7] = (F) => w("value", F))
          }, null, 8, ["board-id", "field", "model-value", "multiple", "label"])
        ], 64)) : v.value === "match" ? (n(), m("label", zn, [
          M[24] || (M[24] = q("Search", -1)),
          k(c(Ie), {
            "aria-label": o.value + " search",
            value: e.modelValue.match,
            onInput: M[8] || (M[8] = (F) => S({ match: F.target.value }))
          }, null, 8, ["aria-label", "value"])
        ])) : v.value === "history" ? (n(), m(_, { key: 4 }, [
          r("div", qn, [
            r("label", null, [
              M[25] || (M[25] = q("Field", -1)),
              k(c(me), {
                "aria-label": o.value + " history field",
                "model-value": i.value.field,
                "onUpdate:modelValue": M[9] || (M[9] = (F) => le("field", F)),
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                optionDisabled: "disabled",
                options: [...(p.value ?? []).map((F) => ({ label: c(He)(F), value: F.code, disabled: !1 }))]
              }, null, 8, ["aria-label", "model-value", "options"])
            ]),
            r("label", null, [
              M[26] || (M[26] = q("History", -1)),
              k(c(me), {
                "aria-label": o.value + " history mode",
                "model-value": i.value.changed ? "changed" : "was",
                "onUpdate:modelValue": M[10] || (M[10] = (F) => J(F)),
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                optionDisabled: "disabled",
                options: [{ label: "Changed", value: "changed", disabled: !1 }, { label: "Was", value: "was", disabled: !1 }]
              }, null, 8, ["aria-label", "model-value"])
            ])
          ]),
          i.value.changed ? (n(), m(_, { key: 0 }, ce(["from", "to"], (F) => r("div", { key: F }, [
            r("label", Wn, [
              k(c(zt), {
                "model-value": F in i.value,
                "aria-label": "Constrain " + F,
                "onUpdate:modelValue": (ne) => le(F, ne ? "" : void 0),
                binary: ""
              }, null, 8, ["model-value", "aria-label", "onUpdate:modelValue"]),
              q(D(F), 1)
            ]),
            F in i.value ? (n(), H(na, {
              key: 0,
              "board-id": e.boardId,
              field: s.value,
              "model-value": i.value[F],
              label: o.value + " history " + F,
              "onUpdate:modelValue": (ne) => le(F, ne),
              onValidity: (ne) => w(F, ne)
            }, null, 8, ["board-id", "field", "model-value", "label", "onUpdate:modelValue", "onValidity"])) : T("", !0)
          ])), 64)) : (n(), H(na, {
            key: 1,
            "board-id": e.boardId,
            field: s.value,
            "model-value": i.value.was,
            label: o.value + " history was",
            "onUpdate:modelValue": M[11] || (M[11] = (F) => le("was", F)),
            onValidity: M[12] || (M[12] = (F) => w("was", F))
          }, null, 8, ["board-id", "field", "model-value", "label"])),
          r("label", Gn, [
            k(c(zt), {
              "model-value": "by" in i.value,
              "aria-label": "Constrain actor",
              "onUpdate:modelValue": M[13] || (M[13] = (F) => le("by", F ? { $actor: "id" } : void 0)),
              binary: ""
            }, null, 8, ["model-value"]),
            M[27] || (M[27] = q("By actor", -1))
          ]),
          "by" in i.value ? (n(), H(na, {
            key: 2,
            "board-id": e.boardId,
            field: se,
            "model-value": i.value.by,
            label: o.value + " history by",
            "onUpdate:modelValue": M[14] || (M[14] = (F) => le("by", F))
          }, null, 8, ["board-id", "model-value", "label"])) : T("", !0),
          r("label", Kn, [
            k(c(zt), {
              "model-value": "during" in i.value,
              "aria-label": "Constrain time window",
              "onUpdate:modelValue": M[15] || (M[15] = (F) => le("during", F ? [{ $now: "-P30D" }, { $now: "P0D" }] : void 0)),
              binary: ""
            }, null, 8, ["model-value"]),
            M[28] || (M[28] = q("During", -1))
          ]),
          "during" in i.value ? (n(), m("div", Hn, [
            (n(), m(_, null, ce(["start", "end"], (F, ne) => k(na, {
              key: F,
              "board-id": e.boardId,
              field: ue,
              "model-value": fe.value[ne],
              label: o.value + " during " + F,
              "onUpdate:modelValue": (ke) => be(ne, ke)
            }, null, 8, ["board-id", "model-value", "label", "onUpdate:modelValue"])), 64))
          ])) : T("", !0)
        ], 64)) : (n(), m(_, { key: 5 }, [
          r("div", Yn, [
            v.value === "rel" ? (n(), m(_, { key: 0 }, [
              r("label", null, [
                M[29] || (M[29] = q("Relation", -1)),
                k(c(me), {
                  "model-value": e.modelValue.rel,
                  "onUpdate:modelValue": M[16] || (M[16] = (F) => S({ rel: F })),
                  appendTo: "self",
                  optionLabel: "label",
                  optionValue: "value",
                  optionDisabled: "disabled",
                  options: [...(e.schema.compiled.relation_types ?? []).map((F) => ({ label: F.outward ?? F.id, value: F.id, disabled: !1 }))]
                }, null, 8, ["model-value", "options"])
              ]),
              r("label", null, [
                M[30] || (M[30] = q("Direction", -1)),
                k(c(me), {
                  "model-value": e.modelValue.dir,
                  "onUpdate:modelValue": M[17] || (M[17] = (F) => S({ dir: F })),
                  appendTo: "self",
                  optionLabel: "label",
                  optionValue: "value",
                  optionDisabled: "disabled",
                  options: [{ label: "Outward", value: "outward", disabled: !1 }, { label: "Inward", value: "inward", disabled: !1 }]
                }, null, 8, ["model-value"])
              ])
            ], 64)) : T("", !0),
            r("label", null, [
              M[31] || (M[31] = q("Quantifier", -1)),
              k(c(me), {
                "model-value": e.modelValue.q,
                "onUpdate:modelValue": M[18] || (M[18] = (F) => S({ q: F })),
                appendTo: "self",
                options: ["some", "every", "none"]
              }, null, 8, ["model-value"])
            ])
          ]),
          k(Q, {
            "board-id": e.boardId,
            schema: e.schema,
            "model-value": c(ot)(e.modelValue.where),
            path: o.value + ".where",
            depth: d.value + 1,
            "onUpdate:modelValue": M[19] || (M[19] = (F) => S({ where: F })),
            onValidity: M[20] || (M[20] = (F) => w("nested", F))
          }, null, 8, ["board-id", "schema", "model-value", "path", "depth"])
        ], 64))
      ], 8, Fn);
    };
  }
}), Jn = { class: "work-stack work-tight" }, Zn = { class: "work-row work-small" }, Fl = /* @__PURE__ */ Ve({
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
    function v(h, i) {
      i ? d.delete(h) : d.add(h), l("validity", !d.size);
    }
    function p(h) {
      l("update:modelValue", h ? { field: t.draft.fields?.[0]?.code ?? "state", op: "eq" } : void 0), h || (d.clear(), l("validity", !0));
    }
    return $t(() => l("validity", !0)), (h, i) => (n(), m("section", Jn, [
      r("label", Zn, [
        k(c(et), {
          "model-value": e.modelValue != null,
          "aria-label": e.label,
          "onUpdate:modelValue": p
        }, null, 8, ["model-value", "aria-label"]),
        q(D(e.label), 1)
      ]),
      e.modelValue != null ? (n(), H(Xn, {
        key: 0,
        schema: o.value,
        "board-id": e.boardId ?? "",
        "model-value": c(ot)(e.modelValue),
        path: e.label,
        "onUpdate:modelValue": i[0] || (i[0] = (s) => l("update:modelValue", s)),
        onValidity: i[1] || (i[1] = (s) => v("structured", s))
      }, null, 8, ["schema", "board-id", "model-value", "path"])) : T("", !0),
      e.modelValue != null ? (n(), H(Ut, {
        key: 1,
        label: e.label + " predicate",
        "model-value": e.modelValue,
        hint: "Use any predicate accepted by Work, including installed or deeply nested forms.",
        "onUpdate:modelValue": i[2] || (i[2] = (s) => l("update:modelValue", s)),
        onValidity: i[3] || (i[3] = (s) => v("raw", s))
      }, null, 8, ["label", "model-value"])) : T("", !0)
    ]));
  }
}), Qn = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, _n = ["aria-label"], es = { class: "work-field-label" }, ts = {
  key: 0,
  class: "work-chips"
}, as = ["kinds"], ls = {
  key: 2,
  class: "work-muted work-small"
}, Ll = /* @__PURE__ */ Ve({
  __name: "PrincipalsPicker",
  props: {
    modelValue: {},
    label: {},
    kinds: {},
    boardId: {}
  },
  emits: ["update:modelValue"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = j(!1), d = j(0), v = z(() => t.modelValue ?? []), { principalLabel: p, rememberPrincipal: h, nameError: i } = xo(() => t.boardId ?? "", () => v.value);
    ya(async () => {
      o.value = await Et("wc-principal-picker");
    });
    function s(u) {
      const x = u.detail, y = x?.principal_id ?? x?.id;
      if (!y) return;
      const g = { kind: x.type ?? "user", id: y };
      x.label && h(g, x.label), v.value.some((f) => f.id === y && f.kind === g.kind) || l("update:modelValue", [...v.value, g]), d.value++;
    }
    return (u, x) => (n(), m(_, null, [
      c(i) ? (n(), m("p", Qn, D(c(i)), 1)) : T("", !0),
      r("section", {
        class: "work-stack work-tight work-principals-picker",
        "aria-label": e.label
      }, [
        r("h4", es, D(e.label), 1),
        v.value.length ? (n(), m("div", ts, [
          (n(!0), m(_, null, ce(v.value, (y, g) => (n(), H(c(tt), {
            key: y.kind + y.id,
            severity: "secondary",
            class: "kx-tag-sm"
          }, {
            default: W(() => [
              q(D(c(p)(y)), 1),
              k(c(te), {
                text: "",
                severity: "secondary",
                size: "small",
                "aria-label": "Remove " + c(p)(y),
                onClick: (f) => l("update:modelValue", v.value.filter((w, V) => V !== g))
              }, {
                default: W(() => [
                  k(c(pe), { icon: "tabler:x" })
                ]),
                _: 1
              }, 8, ["aria-label", "onClick"])
            ]),
            _: 2
          }, 1024))), 128))
        ])) : T("", !0),
        o.value ? (n(), m("wc-principal-picker", {
          key: d.value,
          kinds: e.kinds ?? "user,group",
          onConfigChanged: s
        }, null, 40, as)) : (n(), m("p", ls, "People and group picker is unavailable."))
      ], 8, _n)
    ], 64));
  }
}), os = { class: "work-stack work-tight" }, Ro = /* @__PURE__ */ Ve({
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
      const p = [...(t.modelValue ?? []).filter((h) => "field" in h || "service" in h), ...v.map((h) => h.kind === "group" ? { group: h.id } : { user: h.id })];
      l("update:modelValue", p.length ? p : void 0);
    }
    return (v, p) => (n(), m("div", os, [
      k(Ll, {
        "board-id": e.boardId,
        label: e.label,
        "model-value": o.value,
        "onUpdate:modelValue": d
      }, null, 8, ["board-id", "label", "model-value"]),
      k(Ut, {
        label: e.label + " rules",
        "model-value": e.modelValue,
        shape: "array",
        example: [{ group: "selected-group" }],
        "onUpdate:modelValue": p[0] || (p[0] = (h) => l("update:modelValue", h)),
        onValidity: p[1] || (p[1] = (h) => l("validity", h))
      }, null, 8, ["label", "model-value"])
    ]));
  }
}), is = ["disabled"], ns = { class: "work-chips" }, ss = {
  key: 1,
  class: "work-muted work-small"
}, st = /* @__PURE__ */ Ve({
  __name: "ChipPicker",
  props: {
    label: {},
    options: {},
    modelValue: {},
    disabled: { type: Boolean }
  },
  emits: ["update:modelValue"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = j(""), d = z(() => t.options.map((h) => typeof h == "string" ? { value: h } : h)), v = z(() => d.value.filter((h) => (h.label ?? Ae(h.value)).toLocaleLowerCase().includes(o.value.toLocaleLowerCase())));
    function p(h) {
      if (t.disabled) return;
      const i = t.modelValue ?? [];
      l("update:modelValue", i.includes(h) ? i.filter((s) => s !== h) : [...i, h]);
    }
    return (h, i) => (n(), m("fieldset", {
      class: "work-chip-picker",
      disabled: e.disabled
    }, [
      r("legend", null, D(e.label), 1),
      e.options.length > 10 ? (n(), H(c(Ie), {
        key: 0,
        modelValue: o.value,
        "onUpdate:modelValue": i[0] || (i[0] = (s) => o.value = s),
        type: "search",
        "aria-label": "Find " + e.label.toLowerCase(),
        placeholder: "Find a choice…"
      }, null, 8, ["modelValue", "aria-label"])) : T("", !0),
      r("div", ns, [
        k(c(Nl), {
          "model-value": e.modelValue ?? [],
          options: v.value.map((s) => ({ value: s.value, label: s.label ?? c(Ae)(s.value) })),
          optionLabel: "label",
          optionValue: "value",
          multiple: "",
          disabled: e.disabled,
          "aria-label": e.label,
          "onUpdate:modelValue": i[1] || (i[1] = (s) => l("update:modelValue", s ?? []))
        }, null, 8, ["model-value", "options", "disabled", "aria-label"]),
        (n(!0), m(_, null, ce(e.modelValue?.filter((s) => !d.value.some((u) => u.value === s)) ?? [], (s) => (n(), H(c(te), {
          severity: "secondary",
          text: "",
          size: "small",
          key: s,
          type: "button",
          class: "work-choice work-unavailable",
          "aria-label": "Remove unavailable " + s,
          onClick: (u) => p(s)
        }, {
          default: W(() => [
            q(D(c(Ae)(s)) + " · unavailable ×", 1)
          ]),
          _: 2
        }, 1032, ["aria-label", "onClick"]))), 128))
      ]),
      e.options.length ? T("", !0) : (n(), m("span", ss, "No choices declared."))
    ], 8, is));
  }
});
/**!
 * Sortable 1.15.7
 * @author	RubaXa   <trash@rubaxa.org>
 * @author	owenm    <owen23355@gmail.com>
 * @license MIT
 */
function rs(e, a, t) {
  return (a = vs(a)) in e ? Object.defineProperty(e, a, {
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
function ao(e, a) {
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
    a % 2 ? ao(Object(t), !0).forEach(function(l) {
      rs(e, l, t[l]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ao(Object(t)).forEach(function(l) {
      Object.defineProperty(e, l, Object.getOwnPropertyDescriptor(t, l));
    });
  }
  return e;
}
function ds(e, a) {
  if (e == null) return {};
  var t, l, o = us(e, a);
  if (Object.getOwnPropertySymbols) {
    var d = Object.getOwnPropertySymbols(e);
    for (l = 0; l < d.length; l++) t = d[l], a.indexOf(t) === -1 && {}.propertyIsEnumerable.call(e, t) && (o[t] = e[t]);
  }
  return o;
}
function us(e, a) {
  if (e == null) return {};
  var t = {};
  for (var l in e) if ({}.hasOwnProperty.call(e, l)) {
    if (a.indexOf(l) !== -1) continue;
    t[l] = e[l];
  }
  return t;
}
function cs(e, a) {
  if (typeof e != "object" || !e) return e;
  var t = e[Symbol.toPrimitive];
  if (t !== void 0) {
    var l = t.call(e, a);
    if (typeof l != "object") return l;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (a === "string" ? String : Number)(e);
}
function vs(e) {
  var a = cs(e, "string");
  return typeof a == "symbol" ? a : a + "";
}
function xl(e) {
  "@babel/helpers - typeof";
  return xl = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(a) {
    return typeof a;
  } : function(a) {
    return a && typeof Symbol == "function" && a.constructor === Symbol && a !== Symbol.prototype ? "symbol" : typeof a;
  }, xl(e);
}
var fs = "1.15.7";
function kt(e) {
  if (typeof window < "u" && window.navigator)
    return !!/* @__PURE__ */ navigator.userAgent.match(e);
}
var Vt = kt(/(?:Trident.*rv[ :]?11\.|msie|iemobile|Windows Phone)/i), wa = kt(/Edge/i), lo = kt(/firefox/i), va = kt(/safari/i) && !kt(/chrome/i) && !kt(/android/i), Bl = kt(/iP(ad|od|hone)/i), Po = kt(/chrome/i) && kt(/android/i), Oo = {
  capture: !1,
  passive: !1
};
function Te(e, a, t) {
  e.addEventListener(a, t, !Vt && Oo);
}
function Ce(e, a, t) {
  e.removeEventListener(a, t, !Vt && Oo);
}
function Ba(e, a) {
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
function No(e) {
  return e.host && e !== document && e.host.nodeType && e.host !== e ? e.host : e.parentNode;
}
function ut(e, a, t, l) {
  if (e) {
    t = t || document;
    do {
      if (a != null && (a[0] === ">" ? e.parentNode === t && Ba(e, a) : Ba(e, a)) || l && e === t)
        return e;
      if (e === t) break;
    } while (e = No(e));
  }
  return null;
}
var oo = /\s+/g;
function at(e, a, t) {
  if (e && a)
    if (e.classList)
      e.classList[t ? "add" : "remove"](a);
    else {
      var l = (" " + e.className + " ").replace(oo, " ").replace(" " + a + " ", " ");
      e.className = (l + (t ? " " + a : "")).replace(oo, " ");
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
function ea(e, a) {
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
function Mo(e, a, t) {
  if (e) {
    var l = e.getElementsByTagName(a), o = 0, d = l.length;
    if (t)
      for (; o < d; o++)
        t(l[o], o);
    return l;
  }
  return [];
}
function ft() {
  var e = document.scrollingElement;
  return e || document.documentElement;
}
function Be(e, a, t, l, o) {
  if (!(!e.getBoundingClientRect && e !== window)) {
    var d, v, p, h, i, s, u;
    if (e !== window && e.parentNode && e !== ft() ? (d = e.getBoundingClientRect(), v = d.top, p = d.left, h = d.bottom, i = d.right, s = d.height, u = d.width) : (v = 0, p = 0, h = window.innerHeight, i = window.innerWidth, s = window.innerHeight, u = window.innerWidth), (a || t) && e !== window && (o = o || e.parentNode, !Vt))
      do
        if (o && o.getBoundingClientRect && (he(o, "transform") !== "none" || t && he(o, "position") !== "static")) {
          var x = o.getBoundingClientRect();
          v -= x.top + parseInt(he(o, "border-top-width")), p -= x.left + parseInt(he(o, "border-left-width")), h = v + d.height, i = p + d.width;
          break;
        }
      while (o = o.parentNode);
    if (l && e !== window) {
      var y = ea(o || e), g = y && y.a, f = y && y.d;
      y && (v /= f, p /= g, u /= g, s /= f, h = v + s, i = p + u);
    }
    return {
      top: v,
      left: p,
      bottom: h,
      right: i,
      width: u,
      height: s
    };
  }
}
function io(e, a, t) {
  for (var l = Dt(e, !0), o = Be(e)[a]; l; ) {
    var d = Be(l)[t], v = void 0;
    if (v = o >= d, !v) return l;
    if (l === ft()) break;
    l = Dt(l, !1);
  }
  return !1;
}
function aa(e, a, t, l) {
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
function jl(e, a) {
  for (var t = e.lastElementChild; t && (t === ye.ghost || he(t, "display") === "none" || a && !Ba(t, a)); )
    t = t.previousElementSibling;
  return t || null;
}
function it(e, a) {
  var t = 0;
  if (!e || !e.parentNode)
    return -1;
  for (; e = e.previousElementSibling; )
    e.nodeName.toUpperCase() !== "TEMPLATE" && e !== ye.clone && (!a || Ba(e, a)) && t++;
  return t;
}
function no(e) {
  var a = 0, t = 0, l = ft();
  if (e)
    do {
      var o = ea(e), d = o.a, v = o.d;
      a += e.scrollLeft * d, t += e.scrollTop * v;
    } while (e !== l && (e = e.parentNode));
  return [a, t];
}
function ms(e, a) {
  for (var t in e)
    if (e.hasOwnProperty(t)) {
      for (var l in a)
        if (a.hasOwnProperty(l) && a[l] === e[t][l]) return Number(t);
    }
  return -1;
}
function Dt(e, a) {
  if (!e || !e.getBoundingClientRect) return ft();
  var t = e, l = !1;
  do
    if (t.clientWidth < t.scrollWidth || t.clientHeight < t.scrollHeight) {
      var o = he(t);
      if (t.clientWidth < t.scrollWidth && (o.overflowX == "auto" || o.overflowX == "scroll") || t.clientHeight < t.scrollHeight && (o.overflowY == "auto" || o.overflowY == "scroll")) {
        if (!t.getBoundingClientRect || t === document.body) return ft();
        if (l || a) return t;
        l = !0;
      }
    }
  while (t = t.parentNode);
  return ft();
}
function ps(e, a) {
  if (e && a)
    for (var t in a)
      a.hasOwnProperty(t) && (e[t] = a[t]);
  return e;
}
function cl(e, a) {
  return Math.round(e.top) === Math.round(a.top) && Math.round(e.left) === Math.round(a.left) && Math.round(e.height) === Math.round(a.height) && Math.round(e.width) === Math.round(a.width);
}
var fa;
function Fo(e, a) {
  return function() {
    if (!fa) {
      var t = arguments, l = this;
      t.length === 1 ? e.call(l, t[0]) : e.apply(l, t), fa = setTimeout(function() {
        fa = void 0;
      }, a);
    }
  };
}
function bs() {
  clearTimeout(fa), fa = void 0;
}
function Lo(e, a, t) {
  e.scrollLeft += a, e.scrollTop += t;
}
function Bo(e) {
  var a = window.Polymer, t = window.jQuery || window.Zepto;
  return a && a.dom ? a.dom(e).cloneNode(!0) : t ? t(e).clone(!0)[0] : e.cloneNode(!0);
}
function jo(e, a, t) {
  var l = {};
  return Array.from(e.children).forEach(function(o) {
    var d, v, p, h;
    if (!(!ut(o, a.draggable, e, !1) || o.animated || o === t)) {
      var i = Be(o);
      l.left = Math.min((d = l.left) !== null && d !== void 0 ? d : 1 / 0, i.left), l.top = Math.min((v = l.top) !== null && v !== void 0 ? v : 1 / 0, i.top), l.right = Math.max((p = l.right) !== null && p !== void 0 ? p : -1 / 0, i.right), l.bottom = Math.max((h = l.bottom) !== null && h !== void 0 ? h : -1 / 0, i.bottom);
    }
  }), l.width = l.right - l.left, l.height = l.bottom - l.top, l.x = l.left, l.y = l.top, l;
}
var _e = "Sortable" + (/* @__PURE__ */ new Date()).getTime();
function gs() {
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
            var d = mt({}, e[e.length - 1].rect);
            if (o.thisAnimationDuration) {
              var v = ea(o, !0);
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
      e.splice(ms(e, {
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
        var h = 0, i = p.target, s = i.fromRect, u = Be(i), x = i.prevFromRect, y = i.prevToRect, g = p.rect, f = ea(i, !0);
        f && (u.top -= f.f, u.left -= f.e), i.toRect = u, i.thisAnimationDuration && cl(x, u) && !cl(s, u) && // Make sure animatingRect is on line between toRect & fromRect
        (g.top - u.top) / (g.left - u.left) === (s.top - u.top) / (s.left - u.left) && (h = ys(g, x, y, o.options)), cl(u, s) || (i.prevFromRect = s, i.prevToRect = u, h || (h = o.options.animation), o.animate(i, g, u, h)), h && (d = !0, v = Math.max(v, h), clearTimeout(i.animationResetTimer), i.animationResetTimer = setTimeout(function() {
          i.animationTime = 0, i.prevFromRect = null, i.fromRect = null, i.prevToRect = null, i.thisAnimationDuration = null;
        }, h), i.thisAnimationDuration = h);
      }), clearTimeout(a), d ? a = setTimeout(function() {
        typeof l == "function" && l();
      }, v) : typeof l == "function" && l(), e = [];
    },
    animate: function(l, o, d, v) {
      if (v) {
        he(l, "transition", ""), he(l, "transform", "");
        var p = ea(this.el), h = p && p.a, i = p && p.d, s = (o.left - d.left) / (h || 1), u = (o.top - d.top) / (i || 1);
        l.animatingX = !!s, l.animatingY = !!u, he(l, "transform", "translate3d(" + s + "px," + u + "px,0)"), this.forRepaintDummy = hs(l), he(l, "transition", "transform " + v + "ms" + (this.options.easing ? " " + this.options.easing : "")), he(l, "transform", "translate3d(0,0,0)"), typeof l.animated == "number" && clearTimeout(l.animated), l.animated = setTimeout(function() {
          he(l, "transition", ""), he(l, "transform", ""), l.animated = !1, l.animatingX = !1, l.animatingY = !1;
        }, v);
      }
    }
  };
}
function hs(e) {
  return e.offsetWidth;
}
function ys(e, a, t, l) {
  return Math.sqrt(Math.pow(a.top - e.top, 2) + Math.pow(a.left - e.left, 2)) / Math.sqrt(Math.pow(a.top - t.top, 2) + Math.pow(a.left - t.left, 2)) * l.animation;
}
var Kt = [], vl = {
  initializeByDefault: !0
}, $a = {
  mount: function(a) {
    for (var t in vl)
      vl.hasOwnProperty(t) && !(t in a) && (a[t] = vl[t]);
    Kt.forEach(function(l) {
      if (l.pluginName === a.pluginName)
        throw "Sortable: Cannot mount plugin ".concat(a.pluginName, " more than once");
    }), Kt.push(a);
  },
  pluginEvent: function(a, t, l) {
    var o = this;
    this.eventCanceled = !1, l.cancel = function() {
      o.eventCanceled = !0;
    };
    var d = a + "Global";
    Kt.forEach(function(v) {
      t[v.pluginName] && (t[v.pluginName][d] && t[v.pluginName][d](mt({
        sortable: t
      }, l)), t.options[v.pluginName] && t[v.pluginName][a] && t[v.pluginName][a](mt({
        sortable: t
      }, l)));
    });
  },
  initializePlugins: function(a, t, l, o) {
    Kt.forEach(function(p) {
      var h = p.pluginName;
      if (!(!a.options[h] && !p.initializeByDefault)) {
        var i = new p(a, t, a.options);
        i.sortable = a, i.options = a.options, a[h] = i, wt(l, i.defaults);
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
    return Kt.forEach(function(o) {
      typeof o.eventProperties == "function" && wt(l, o.eventProperties.call(t[o.pluginName], a));
    }), l;
  },
  modifyOption: function(a, t, l) {
    var o;
    return Kt.forEach(function(d) {
      a[d.pluginName] && d.optionListeners && typeof d.optionListeners[t] == "function" && (o = d.optionListeners[t].call(a[d.pluginName], l));
    }), o;
  }
};
function ks(e) {
  var a = e.sortable, t = e.rootEl, l = e.name, o = e.targetEl, d = e.cloneEl, v = e.toEl, p = e.fromEl, h = e.oldIndex, i = e.newIndex, s = e.oldDraggableIndex, u = e.newDraggableIndex, x = e.originalEvent, y = e.putSortable, g = e.extraEventProperties;
  if (a = a || t && t[_e], !!a) {
    var f, w = a.options, V = "on" + l.charAt(0).toUpperCase() + l.substr(1);
    window.CustomEvent && !Vt && !wa ? f = new CustomEvent(l, {
      bubbles: !0,
      cancelable: !0
    }) : (f = document.createEvent("Event"), f.initEvent(l, !0, !0)), f.to = v || t, f.from = p || t, f.item = o || t, f.clone = d, f.oldIndex = h, f.newIndex = i, f.oldDraggableIndex = s, f.newDraggableIndex = u, f.originalEvent = x, f.pullMode = y ? y.lastPutMode : void 0;
    var $ = mt(mt({}, g), $a.getEventProperties(l, a));
    for (var S in $)
      f[S] = $[S];
    t && t.dispatchEvent(f), w[V] && w[V].call(a, f);
  }
}
var ws = ["evt"], Qe = function(a, t) {
  var l = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, o = l.evt, d = ds(l, ws);
  $a.pluginEvent.bind(ye)(a, t, mt({
    dragEl: ie,
    parentEl: Fe,
    ghostEl: $e,
    rootEl: Pe,
    nextEl: Lt,
    lastDownEl: Pa,
    cloneEl: Me,
    cloneHidden: Tt,
    dragStarted: sa,
    putSortable: Ke,
    activeSortable: ye.active,
    originalEvent: o,
    oldIndex: Qt,
    oldDraggableIndex: ma,
    newIndex: lt,
    newDraggableIndex: St,
    hideGhostForTarget: Go,
    unhideGhostForTarget: Ko,
    cloneNowHidden: function() {
      Tt = !0;
    },
    cloneNowShown: function() {
      Tt = !1;
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
  ks(mt({
    putSortable: Ke,
    cloneEl: Me,
    targetEl: ie,
    rootEl: Pe,
    oldIndex: Qt,
    oldDraggableIndex: ma,
    newIndex: lt,
    newDraggableIndex: St
  }, e));
}
var ie, Fe, $e, Pe, Lt, Pa, Me, Tt, Qt, lt, ma, St, Da, Ke, Yt = !1, ja = !1, za = [], Nt, dt, fl, ml, so, ro, sa, Ht, pa, ba = !1, Ea = !1, Oa, Ye, pl = [], Cl = !1, qa = [], Za = typeof document < "u", Ua = Bl, uo = wa || Vt ? "cssFloat" : "float", $s = Za && !Po && !Bl && "draggable" in document.createElement("div"), zo = (function() {
  if (Za) {
    if (Vt)
      return !1;
    var e = document.createElement("x");
    return e.style.cssText = "pointer-events:auto", e.style.pointerEvents === "auto";
  }
})(), qo = function(a, t) {
  var l = he(a), o = parseInt(l.width) - parseInt(l.paddingLeft) - parseInt(l.paddingRight) - parseInt(l.borderLeftWidth) - parseInt(l.borderRightWidth), d = aa(a, 0, t), v = aa(a, 1, t), p = d && he(d), h = v && he(v), i = p && parseInt(p.marginLeft) + parseInt(p.marginRight) + Be(d).width, s = h && parseInt(h.marginLeft) + parseInt(h.marginRight) + Be(v).width;
  if (l.display === "flex")
    return l.flexDirection === "column" || l.flexDirection === "column-reverse" ? "vertical" : "horizontal";
  if (l.display === "grid")
    return l.gridTemplateColumns.split(" ").length <= 1 ? "vertical" : "horizontal";
  if (d && p.float && p.float !== "none") {
    var u = p.float === "left" ? "left" : "right";
    return v && (h.clear === "both" || h.clear === u) ? "vertical" : "horizontal";
  }
  return d && (p.display === "block" || p.display === "flex" || p.display === "table" || p.display === "grid" || i >= o && l[uo] === "none" || v && l[uo] === "none" && i + s > o) ? "vertical" : "horizontal";
}, Vs = function(a, t, l) {
  var o = l ? a.left : a.top, d = l ? a.right : a.bottom, v = l ? a.width : a.height, p = l ? t.left : t.top, h = l ? t.right : t.bottom, i = l ? t.width : t.height;
  return o === p || d === h || o + v / 2 === p + i / 2;
}, xs = function(a, t) {
  var l;
  return za.some(function(o) {
    var d = o[_e].options.emptyInsertThreshold;
    if (!(!d || jl(o))) {
      var v = Be(o), p = a >= v.left - d && a <= v.right + d, h = t >= v.top - d && t <= v.bottom + d;
      if (p && h)
        return l = o;
    }
  }), l;
}, Wo = function(a) {
  function t(d, v) {
    return function(p, h, i, s) {
      var u = p.options.group.name && h.options.group.name && p.options.group.name === h.options.group.name;
      if (d == null && (v || u))
        return !0;
      if (d == null || d === !1)
        return !1;
      if (v && d === "clone")
        return d;
      if (typeof d == "function")
        return t(d(p, h, i, s), v)(p, h, i, s);
      var x = (v ? p : h).options.group.name;
      return d === !0 || typeof d == "string" && d === x || d.join && d.indexOf(x) > -1;
    };
  }
  var l = {}, o = a.group;
  (!o || xl(o) != "object") && (o = {
    name: o
  }), l.name = o.name, l.checkPull = t(o.pull, !0), l.checkPut = t(o.put), l.revertClone = o.revertClone, a.group = l;
}, Go = function() {
  !zo && $e && he($e, "display", "none");
}, Ko = function() {
  !zo && $e && he($e, "display", "");
};
Za && !Po && document.addEventListener("click", function(e) {
  if (ja)
    return e.preventDefault(), e.stopPropagation && e.stopPropagation(), e.stopImmediatePropagation && e.stopImmediatePropagation(), ja = !1, !1;
}, !0);
var Mt = function(a) {
  if (ie) {
    a = a.touches ? a.touches[0] : a;
    var t = xs(a.clientX, a.clientY);
    if (t) {
      var l = {};
      for (var o in a)
        a.hasOwnProperty(o) && (l[o] = a[o]);
      l.target = l.rootEl = t, l.preventDefault = void 0, l.stopPropagation = void 0, t[_e]._onDragOver(l);
    }
  }
}, Cs = function(a) {
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
      return qo(e, this.options);
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
    supportPointer: ye.supportPointer !== !1 && "PointerEvent" in window && (!va || Bl),
    emptyInsertThreshold: 5
  };
  $a.initializePlugins(this, e, t);
  for (var l in t)
    !(l in a) && (a[l] = t[l]);
  Wo(a);
  for (var o in this)
    o.charAt(0) === "_" && typeof this[o] == "function" && (this[o] = this[o].bind(this));
  this.nativeDraggable = a.forceFallback ? !1 : $s, this.nativeDraggable && (this.options.touchStartThreshold = 1), a.supportPointer ? Te(e, "pointerdown", this._onTapStart) : (Te(e, "mousedown", this._onTapStart), Te(e, "touchstart", this._onTapStart)), this.nativeDraggable && (Te(e, "dragover", this), Te(e, "dragenter", this)), za.push(this.el), a.store && a.store.get && this.sort(a.store.get(this) || []), wt(this, gs());
}
ye.prototype = /** @lends Sortable.prototype */
{
  constructor: ye,
  _isOutsideThisEl: function(a) {
    !this.el.contains(a) && a !== this.el && (Ht = null);
  },
  _getDirection: function(a, t) {
    return typeof this.options.direction == "function" ? this.options.direction.call(this, a, t, ie) : this.options.direction;
  },
  _onTapStart: function(a) {
    if (a.cancelable) {
      var t = this, l = this.el, o = this.options, d = o.preventOnFilter, v = a.type, p = a.touches && a.touches[0] || a.pointerType && a.pointerType === "touch" && a, h = (p || a).target, i = a.target.shadowRoot && (a.path && a.path[0] || a.composedPath && a.composedPath()[0]) || h, s = o.filter;
      if (Rs(l), !ie && !(/mousedown|pointerdown/.test(v) && a.button !== 0 || o.disabled) && !i.isContentEditable && !(!this.nativeDraggable && va && h && h.tagName.toUpperCase() === "SELECT") && (h = ut(h, o.draggable, l, !1), !(h && h.animated) && Pa !== h)) {
        if (Qt = it(h), ma = it(h, o.draggable), typeof s == "function") {
          if (s.call(this, a, h, this)) {
            Xe({
              sortable: t,
              rootEl: i,
              name: "filter",
              targetEl: h,
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
              targetEl: h,
              fromEl: l,
              toEl: l
            }), Qe("filter", t, {
              evt: a
            }), !0;
        }), s)) {
          d && a.preventDefault();
          return;
        }
        o.handle && !ut(i, o.handle, l, !1) || this._prepareDragStart(a, p, h);
      }
    }
  },
  _prepareDragStart: function(a, t, l) {
    var o = this, d = o.el, v = o.options, p = d.ownerDocument, h;
    if (l && !ie && l.parentNode === d) {
      var i = Be(l);
      if (Pe = d, ie = l, Fe = ie.parentNode, Lt = ie.nextSibling, Pa = l, Da = v.group, ye.dragged = ie, Nt = {
        target: ie,
        clientX: (t || a).clientX,
        clientY: (t || a).clientY
      }, so = Nt.clientX - i.left, ro = Nt.clientY - i.top, this._lastX = (t || a).clientX, this._lastY = (t || a).clientY, ie.style["will-change"] = "all", h = function() {
        if (Qe("delayEnded", o, {
          evt: a
        }), ye.eventCanceled) {
          o._onDrop();
          return;
        }
        o._disableDelayedDragEvents(), !lo && o.nativeDraggable && (ie.draggable = !0), o._triggerDragStart(a, t), Xe({
          sortable: o,
          name: "choose",
          originalEvent: a
        }), at(ie, v.chosenClass, !0);
      }, v.ignore.split(",").forEach(function(s) {
        Mo(ie, s.trim(), bl);
      }), Te(p, "dragover", Mt), Te(p, "mousemove", Mt), Te(p, "touchmove", Mt), v.supportPointer ? (Te(p, "pointerup", o._onDrop), !this.nativeDraggable && Te(p, "pointercancel", o._onDrop)) : (Te(p, "mouseup", o._onDrop), Te(p, "touchend", o._onDrop), Te(p, "touchcancel", o._onDrop)), lo && this.nativeDraggable && (this.options.touchStartThreshold = 4, ie.draggable = !0), Qe("delayStart", this, {
        evt: a
      }), v.delay && (!v.delayOnTouchOnly || t) && (!this.nativeDraggable || !(wa || Vt))) {
        if (ye.eventCanceled) {
          this._onDrop();
          return;
        }
        v.supportPointer ? (Te(p, "pointerup", o._disableDelayedDrag), Te(p, "pointercancel", o._disableDelayedDrag)) : (Te(p, "mouseup", o._disableDelayedDrag), Te(p, "touchend", o._disableDelayedDrag), Te(p, "touchcancel", o._disableDelayedDrag)), Te(p, "mousemove", o._delayedDragTouchMoveHandler), Te(p, "touchmove", o._delayedDragTouchMoveHandler), v.supportPointer && Te(p, "pointermove", o._delayedDragTouchMoveHandler), o._dragStartTimer = setTimeout(h, v.delay);
      } else
        h();
    }
  },
  _delayedDragTouchMoveHandler: function(a) {
    var t = a.touches ? a.touches[0] : a;
    Math.max(Math.abs(t.clientX - this._lastX), Math.abs(t.clientY - this._lastY)) >= Math.floor(this.options.touchStartThreshold / (this.nativeDraggable && window.devicePixelRatio || 1)) && this._disableDelayedDrag();
  },
  _disableDelayedDrag: function() {
    ie && bl(ie), clearTimeout(this._dragStartTimer), this._disableDelayedDragEvents();
  },
  _disableDelayedDragEvents: function() {
    var a = this.el.ownerDocument;
    Ce(a, "mouseup", this._disableDelayedDrag), Ce(a, "touchend", this._disableDelayedDrag), Ce(a, "touchcancel", this._disableDelayedDrag), Ce(a, "pointerup", this._disableDelayedDrag), Ce(a, "pointercancel", this._disableDelayedDrag), Ce(a, "mousemove", this._delayedDragTouchMoveHandler), Ce(a, "touchmove", this._delayedDragTouchMoveHandler), Ce(a, "pointermove", this._delayedDragTouchMoveHandler);
  },
  _triggerDragStart: function(a, t) {
    t = t || a.pointerType == "touch" && a, !this.nativeDraggable || t ? this.options.supportPointer ? Te(document, "pointermove", this._onTouchMove) : t ? Te(document, "touchmove", this._onTouchMove) : Te(document, "mousemove", this._onTouchMove) : (Te(ie, "dragend", this), Te(Pe, "dragstart", this._onDragStart));
    try {
      document.selection ? Na(function() {
        document.selection.empty();
      }) : window.getSelection().removeAllRanges();
    } catch {
    }
  },
  _dragStarted: function(a, t) {
    if (Yt = !1, Pe && ie) {
      Qe("dragStarted", this, {
        evt: t
      }), this.nativeDraggable && Te(document, "dragover", Cs);
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
      this._lastX = dt.clientX, this._lastY = dt.clientY, Go();
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
        } while (t = No(t));
      Ko();
    }
  },
  _onTouchMove: function(a) {
    if (Nt) {
      var t = this.options, l = t.fallbackTolerance, o = t.fallbackOffset, d = a.touches ? a.touches[0] : a, v = $e && ea($e, !0), p = $e && v && v.a, h = $e && v && v.d, i = Ua && Ye && no(Ye), s = (d.clientX - Nt.clientX + o.x) / (p || 1) + (i ? i[0] - pl[0] : 0) / (p || 1), u = (d.clientY - Nt.clientY + o.y) / (h || 1) + (i ? i[1] - pl[1] : 0) / (h || 1);
      if (!ye.active && !Yt) {
        if (l && Math.max(Math.abs(d.clientX - this._lastX), Math.abs(d.clientY - this._lastY)) < l)
          return;
        this._onDragStart(a, !0);
      }
      if ($e) {
        v ? (v.e += s - (fl || 0), v.f += u - (ml || 0)) : v = {
          a: 1,
          b: 0,
          c: 0,
          d: 1,
          e: s,
          f: u
        };
        var x = "matrix(".concat(v.a, ",").concat(v.b, ",").concat(v.c, ",").concat(v.d, ",").concat(v.e, ",").concat(v.f, ")");
        he($e, "webkitTransform", x), he($e, "mozTransform", x), he($e, "msTransform", x), he($e, "transform", x), fl = s, ml = u, dt = d;
      }
      a.cancelable && a.preventDefault();
    }
  },
  _appendGhost: function() {
    if (!$e) {
      var a = this.options.fallbackOnBody ? document.body : Pe, t = Be(ie, !0, Ua, !0, a), l = this.options;
      if (Ua) {
        for (Ye = a; he(Ye, "position") === "static" && he(Ye, "transform") === "none" && Ye !== document; )
          Ye = Ye.parentNode;
        Ye !== document.body && Ye !== document.documentElement ? (Ye === document && (Ye = ft()), t.top += Ye.scrollTop, t.left += Ye.scrollLeft) : Ye = ft(), pl = no(Ye);
      }
      $e = ie.cloneNode(!0), at($e, l.ghostClass, !1), at($e, l.fallbackClass, !0), at($e, l.dragClass, !0), he($e, "transition", ""), he($e, "transform", ""), he($e, "box-sizing", "border-box"), he($e, "margin", 0), he($e, "top", t.top), he($e, "left", t.left), he($e, "width", t.width), he($e, "height", t.height), he($e, "opacity", "0.8"), he($e, "position", Ua ? "absolute" : "fixed"), he($e, "zIndex", "100000"), he($e, "pointerEvents", "none"), ye.ghost = $e, a.appendChild($e), he($e, "transform-origin", so / parseInt($e.style.width) * 100 + "% " + ro / parseInt($e.style.height) * 100 + "%");
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
    Qe("setupClone", this), ye.eventCanceled || (Me = Bo(ie), Me.removeAttribute("id"), Me.draggable = !1, Me.style["will-change"] = "", this._hideClone(), at(Me, this.options.chosenClass, !1), ye.clone = Me), l.cloneId = Na(function() {
      Qe("clone", l), !ye.eventCanceled && (l.options.removeCloneOnHide || Pe.insertBefore(Me, ie), l._hideClone(), Xe({
        sortable: l,
        name: "clone"
      }));
    }), !t && at(ie, d.dragClass, !0), t ? (ja = !0, l._loopId = setInterval(l._emulateDragOver, 50)) : (Ce(document, "mouseup", l._onDrop), Ce(document, "touchend", l._onDrop), Ce(document, "touchcancel", l._onDrop), o && (o.effectAllowed = "move", d.setData && d.setData.call(l, o, ie)), Te(document, "drop", l), he(ie, "transform", "translateZ(0)")), Yt = !0, l._dragStartId = Na(l._dragStarted.bind(l, t, a)), Te(document, "selectstart", l), sa = !0, window.getSelection().removeAllRanges(), va && he(document.body, "user-select", "none");
  },
  // Returns true - if no further action is needed (either inserted or another condition)
  _onDragOver: function(a) {
    var t = this.el, l = a.target, o, d, v, p = this.options, h = p.group, i = ye.active, s = Da === h, u = p.sort, x = Ke || i, y, g = this, f = !1;
    if (Cl) return;
    function w(X, A) {
      Qe(X, g, mt({
        evt: a,
        isOwner: s,
        axis: y ? "vertical" : "horizontal",
        revert: v,
        dragRect: o,
        targetRect: d,
        canSort: u,
        fromSortable: x,
        target: l,
        completed: $,
        onMove: function(O, Y) {
          return Aa(Pe, t, ie, o, O, Be(O), a, Y);
        },
        changed: S
      }, A));
    }
    function V() {
      w("dragOverAnimationCapture"), g.captureAnimationState(), g !== x && x.captureAnimationState();
    }
    function $(X) {
      return w("dragOverCompleted", {
        insertion: X
      }), X && (s ? i._hideClone() : i._showClone(g), g !== x && (at(ie, Ke ? Ke.options.ghostClass : i.options.ghostClass, !1), at(ie, p.ghostClass, !0)), Ke !== g && g !== ye.active ? Ke = g : g === ye.active && Ke && (Ke = null), x === g && (g._ignoreWhileAnimating = l), g.animateAll(function() {
        w("dragOverAnimationComplete"), g._ignoreWhileAnimating = null;
      }), g !== x && (x.animateAll(), x._ignoreWhileAnimating = null)), (l === ie && !ie.animated || l === t && !l.animated) && (Ht = null), !p.dragoverBubble && !a.rootEl && l !== document && (ie.parentNode[_e]._isOutsideThisEl(a.target), !X && Mt(a)), !p.dragoverBubble && a.stopPropagation && a.stopPropagation(), f = !0;
    }
    function S() {
      lt = it(ie), St = it(ie, p.draggable), Xe({
        sortable: g,
        name: "change",
        toEl: t,
        newIndex: lt,
        newDraggableIndex: St,
        originalEvent: a
      });
    }
    if (a.preventDefault !== void 0 && a.cancelable && a.preventDefault(), l = ut(l, p.draggable, t, !0), w("dragOver"), ye.eventCanceled) return f;
    if (ie.contains(a.target) || l.animated && l.animatingX && l.animatingY || g._ignoreWhileAnimating === l)
      return $(!1);
    if (ja = !1, i && !p.disabled && (s ? u || (v = Fe !== Pe) : Ke === this || (this.lastPutMode = Da.checkPull(this, i, ie, a)) && h.checkPut(this, i, ie, a))) {
      if (y = this._getDirection(a, l) === "vertical", o = Be(ie), w("dragOverValid"), ye.eventCanceled) return f;
      if (v)
        return Fe = Pe, V(), this._hideClone(), w("revert"), ye.eventCanceled || (Lt ? Pe.insertBefore(ie, Lt) : Pe.appendChild(ie)), $(!0);
      var I = jl(t, p.draggable);
      if (!I || Ds(a, y, this) && !I.animated) {
        if (I === ie)
          return $(!1);
        if (I && t === a.target && (l = I), l && (d = Be(l)), Aa(Pe, t, ie, o, l, d, a, !!l) !== !1)
          return V(), I && I.nextSibling ? t.insertBefore(ie, I.nextSibling) : t.appendChild(ie), Fe = t, S(), $(!0);
      } else if (I && Is(a, y, this)) {
        var B = aa(t, 0, p, !0);
        if (B === ie)
          return $(!1);
        if (l = B, d = Be(l), Aa(Pe, t, ie, o, l, d, a, !1) !== !1)
          return V(), t.insertBefore(ie, B), Fe = t, S(), $(!0);
      } else if (l.parentNode === t) {
        d = Be(l);
        var le = 0, J, se = ie.parentNode !== t, ue = !Vs(ie.animated && ie.toRect || o, l.animated && l.toRect || d, y), fe = y ? "top" : "left", be = io(l, "top", "top") || io(ie, "top", "top"), oe = be ? be.scrollTop : void 0;
        Ht !== l && (J = d[fe], ba = !1, Ea = !ue && p.invertSwap || se), le = Es(a, l, d, y, ue ? 1 : p.swapThreshold, p.invertedSwapThreshold == null ? p.swapThreshold : p.invertedSwapThreshold, Ea, Ht === l);
        var M;
        if (le !== 0) {
          var Q = it(ie);
          do
            Q -= le, M = Fe.children[Q];
          while (M && (he(M, "display") === "none" || M === $e));
        }
        if (le === 0 || M === l)
          return $(!1);
        Ht = l, pa = le;
        var F = l.nextElementSibling, ne = !1;
        ne = le === 1;
        var ke = Aa(Pe, t, ie, o, l, d, a, ne);
        if (ke !== !1)
          return (ke === 1 || ke === -1) && (ne = ke === 1), Cl = !0, setTimeout(Ts, 30), V(), ne && !F ? t.appendChild(ie) : l.parentNode.insertBefore(ie, ne ? F : l), be && Lo(be, 0, oe - be.scrollTop), Fe = ie.parentNode, J !== void 0 && !Ea && (Oa = Math.abs(J - Be(l)[fe])), S(), $(!0);
      }
      if (t.contains(ie))
        return $(!1);
    }
    return !1;
  },
  _ignoreWhileAnimating: null,
  _offMoveEvents: function() {
    Ce(document, "mousemove", this._onTouchMove), Ce(document, "touchmove", this._onTouchMove), Ce(document, "pointermove", this._onTouchMove), Ce(document, "dragover", Mt), Ce(document, "mousemove", Mt), Ce(document, "touchmove", Mt);
  },
  _offUpEvents: function() {
    var a = this.el.ownerDocument;
    Ce(a, "mouseup", this._onDrop), Ce(a, "touchend", this._onDrop), Ce(a, "pointerup", this._onDrop), Ce(a, "pointercancel", this._onDrop), Ce(a, "touchcancel", this._onDrop), Ce(document, "selectstart", this);
  },
  _onDrop: function(a) {
    var t = this.el, l = this.options;
    if (lt = it(ie), St = it(ie, l.draggable), Qe("drop", this, {
      evt: a
    }), Fe = ie && ie.parentNode, lt = it(ie), St = it(ie, l.draggable), ye.eventCanceled) {
      this._nulling();
      return;
    }
    Yt = !1, Ea = !1, ba = !1, clearInterval(this._loopId), clearTimeout(this._dragStartTimer), Sl(this.cloneId), Sl(this._dragStartId), this.nativeDraggable && (Ce(document, "drop", this), Ce(t, "dragstart", this._onDragStart)), this._offMoveEvents(), this._offUpEvents(), va && he(document.body, "user-select", ""), he(ie, "transform", ""), a && (sa && (a.cancelable && a.preventDefault(), !l.dropBubble && a.stopPropagation()), $e && $e.parentNode && $e.parentNode.removeChild($e), (Pe === Fe || Ke && Ke.lastPutMode !== "clone") && Me && Me.parentNode && Me.parentNode.removeChild(Me), ie && (this.nativeDraggable && Ce(ie, "dragend", this), bl(ie), ie.style["will-change"] = "", sa && !Yt && at(ie, Ke ? Ke.options.ghostClass : this.options.ghostClass, !1), at(ie, this.options.chosenClass, !1), Xe({
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
    })), Ke && Ke.save()) : lt !== Qt && lt >= 0 && (Xe({
      sortable: this,
      name: "update",
      toEl: Fe,
      originalEvent: a
    }), Xe({
      sortable: this,
      name: "sort",
      toEl: Fe,
      originalEvent: a
    })), ye.active && ((lt == null || lt === -1) && (lt = Qt, St = ma), Xe({
      sortable: this,
      name: "end",
      toEl: Fe,
      originalEvent: a
    }), this.save()))), this._nulling();
  },
  _nulling: function() {
    Qe("nulling", this), Pe = ie = Fe = $e = Lt = Me = Pa = Tt = Nt = dt = sa = lt = St = Qt = ma = Ht = pa = Ke = Da = ye.dragged = ye.ghost = ye.clone = ye.active = null;
    var a = this.el;
    qa.forEach(function(t) {
      a.contains(t) && (t.checked = !0);
    }), qa.length = fl = ml = 0;
  },
  handleEvent: function(a) {
    switch (a.type) {
      case "drop":
      case "dragend":
        this._onDrop(a);
        break;
      case "dragenter":
      case "dragover":
        ie && (this._onDragOver(a), Ss(a));
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
      t = l[o], ut(t, v.draggable, this.el, !1) && a.push(t.getAttribute(v.dataIdAttr) || As(t));
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
    var o = $a.modifyOption(this, a, t);
    typeof o < "u" ? l[a] = o : l[a] = t, a === "group" && Wo(l);
  },
  /**
   * Destroy
   */
  destroy: function() {
    Qe("destroy", this);
    var a = this.el;
    a[_e] = null, Ce(a, "mousedown", this._onTapStart), Ce(a, "touchstart", this._onTapStart), Ce(a, "pointerdown", this._onTapStart), this.nativeDraggable && (Ce(a, "dragover", this), Ce(a, "dragenter", this)), Array.prototype.forEach.call(a.querySelectorAll("[draggable]"), function(t) {
      t.removeAttribute("draggable");
    }), this._onDrop(), this._disableDelayedDragEvents(), za.splice(za.indexOf(this.el), 1), this.el = a = null;
  },
  _hideClone: function() {
    if (!Tt) {
      if (Qe("hideClone", this), ye.eventCanceled) return;
      he(Me, "display", "none"), this.options.removeCloneOnHide && Me.parentNode && Me.parentNode.removeChild(Me), Tt = !0;
    }
  },
  _showClone: function(a) {
    if (a.lastPutMode !== "clone") {
      this._hideClone();
      return;
    }
    if (Tt) {
      if (Qe("showClone", this), ye.eventCanceled) return;
      ie.parentNode == Pe && !this.options.group.revertClone ? Pe.insertBefore(Me, ie) : Lt ? Pe.insertBefore(Me, Lt) : Pe.appendChild(Me), this.options.group.revertClone && this.animate(ie, Me), he(Me, "display", ""), Tt = !1;
    }
  }
};
function Ss(e) {
  e.dataTransfer && (e.dataTransfer.dropEffect = "move"), e.cancelable && e.preventDefault();
}
function Aa(e, a, t, l, o, d, v, p) {
  var h, i = e[_e], s = i.options.onMove, u;
  return window.CustomEvent && !Vt && !wa ? h = new CustomEvent("move", {
    bubbles: !0,
    cancelable: !0
  }) : (h = document.createEvent("Event"), h.initEvent("move", !0, !0)), h.to = a, h.from = e, h.dragged = t, h.draggedRect = l, h.related = o || a, h.relatedRect = d || Be(a), h.willInsertAfter = p, h.originalEvent = v, e.dispatchEvent(h), s && (u = s.call(i, h, v)), u;
}
function bl(e) {
  e.draggable = !1;
}
function Ts() {
  Cl = !1;
}
function Is(e, a, t) {
  var l = Be(aa(t.el, 0, t.options, !0)), o = jo(t.el, t.options, $e), d = 10;
  return a ? e.clientX < o.left - d || e.clientY < l.top && e.clientX < l.right : e.clientY < o.top - d || e.clientY < l.bottom && e.clientX < l.left;
}
function Ds(e, a, t) {
  var l = Be(jl(t.el, t.options.draggable)), o = jo(t.el, t.options, $e), d = 10;
  return a ? e.clientX > o.right + d || e.clientY > l.bottom && e.clientX > l.left : e.clientY > o.bottom + d || e.clientX > l.right && e.clientY > l.top;
}
function Es(e, a, t, l, o, d, v, p) {
  var h = l ? e.clientY : e.clientX, i = l ? t.height : t.width, s = l ? t.top : t.left, u = l ? t.bottom : t.right, x = !1;
  if (!v) {
    if (p && Oa < i * o) {
      if (!ba && (pa === 1 ? h > s + i * d / 2 : h < u - i * d / 2) && (ba = !0), ba)
        x = !0;
      else if (pa === 1 ? h < s + Oa : h > u - Oa)
        return -pa;
    } else if (h > s + i * (1 - o) / 2 && h < u - i * (1 - o) / 2)
      return Us(a);
  }
  return x = x || v, x && (h < s + i * d / 2 || h > u - i * d / 2) ? h > s + i / 2 ? 1 : -1 : 0;
}
function Us(e) {
  return it(ie) < it(e) ? 1 : -1;
}
function As(e) {
  for (var a = e.tagName + e.className + e.src + e.href + e.textContent, t = a.length, l = 0; t--; )
    l += a.charCodeAt(t);
  return l.toString(36);
}
function Rs(e) {
  qa.length = 0;
  for (var a = e.getElementsByTagName("input"), t = a.length; t--; ) {
    var l = a[t];
    l.checked && qa.push(l);
  }
}
function Na(e) {
  return setTimeout(e, 0);
}
function Sl(e) {
  return clearTimeout(e);
}
Za && Te(document, "touchmove", function(e) {
  (ye.active || Yt) && e.cancelable && e.preventDefault();
});
ye.utils = {
  on: Te,
  off: Ce,
  css: he,
  find: Mo,
  is: function(a, t) {
    return !!ut(a, t, a, !1);
  },
  extend: ps,
  throttle: Fo,
  closest: ut,
  toggleClass: at,
  clone: Bo,
  index: it,
  nextTick: Na,
  cancelNextTick: Sl,
  detectDirection: qo,
  getChild: aa,
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
    l.utils && (ye.utils = mt(mt({}, ye.utils), l.utils)), $a.mount(l);
  });
};
ye.create = function(e, a) {
  return new ye(e, a);
};
ye.version = fs;
var Le = [], ra, Tl, Il = !1, gl, hl, Wa, da;
function Ps() {
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
      this.sortable.nativeDraggable ? Ce(document, "dragover", this._handleAutoScroll) : (Ce(document, "pointermove", this._handleFallbackAutoScroll), Ce(document, "touchmove", this._handleFallbackAutoScroll), Ce(document, "mousemove", this._handleFallbackAutoScroll)), co(), Ma(), bs();
    },
    nulling: function() {
      Wa = Tl = ra = Il = da = gl = hl = null, Le.length = 0;
    },
    _handleFallbackAutoScroll: function(t) {
      this._handleAutoScroll(t, !0);
    },
    _handleAutoScroll: function(t, l) {
      var o = this, d = (t.touches ? t.touches[0] : t).clientX, v = (t.touches ? t.touches[0] : t).clientY, p = document.elementFromPoint(d, v);
      if (Wa = t, l || this.options.forceAutoScrollFallback || wa || Vt || va) {
        yl(t, this.options, p, l);
        var h = Dt(p, !0);
        Il && (!da || d !== gl || v !== hl) && (da && co(), da = setInterval(function() {
          var i = Dt(document.elementFromPoint(d, v), !0);
          i !== h && (h = i, Ma()), yl(t, o.options, i, l);
        }, 10), gl = d, hl = v);
      } else {
        if (!this.options.bubbleScroll || Dt(p, !0) === ft()) {
          Ma();
          return;
        }
        yl(t, this.options, Dt(p, !1), !1);
      }
    }
  }, wt(e, {
    pluginName: "scroll",
    initializeByDefault: !0
  });
}
function Ma() {
  Le.forEach(function(e) {
    clearInterval(e.pid);
  }), Le = [];
}
function co() {
  clearInterval(da);
}
var yl = Fo(function(e, a, t, l) {
  if (a.scroll) {
    var o = (e.touches ? e.touches[0] : e).clientX, d = (e.touches ? e.touches[0] : e).clientY, v = a.scrollSensitivity, p = a.scrollSpeed, h = ft(), i = !1, s;
    Tl !== t && (Tl = t, Ma(), ra = a.scroll, s = a.scrollFn, ra === !0 && (ra = Dt(t, !0)));
    var u = 0, x = ra;
    do {
      var y = x, g = Be(y), f = g.top, w = g.bottom, V = g.left, $ = g.right, S = g.width, I = g.height, B = void 0, le = void 0, J = y.scrollWidth, se = y.scrollHeight, ue = he(y), fe = y.scrollLeft, be = y.scrollTop;
      y === h ? (B = S < J && (ue.overflowX === "auto" || ue.overflowX === "scroll" || ue.overflowX === "visible"), le = I < se && (ue.overflowY === "auto" || ue.overflowY === "scroll" || ue.overflowY === "visible")) : (B = S < J && (ue.overflowX === "auto" || ue.overflowX === "scroll"), le = I < se && (ue.overflowY === "auto" || ue.overflowY === "scroll"));
      var oe = B && (Math.abs($ - o) <= v && fe + S < J) - (Math.abs(V - o) <= v && !!fe), M = le && (Math.abs(w - d) <= v && be + I < se) - (Math.abs(f - d) <= v && !!be);
      if (!Le[u])
        for (var Q = 0; Q <= u; Q++)
          Le[Q] || (Le[Q] = {});
      (Le[u].vx != oe || Le[u].vy != M || Le[u].el !== y) && (Le[u].el = y, Le[u].vx = oe, Le[u].vy = M, clearInterval(Le[u].pid), (oe != 0 || M != 0) && (i = !0, Le[u].pid = setInterval(function() {
        l && this.layer === 0 && ye.active._onTouchMove(Wa);
        var F = Le[this.layer].vy ? Le[this.layer].vy * p : 0, ne = Le[this.layer].vx ? Le[this.layer].vx * p : 0;
        typeof s == "function" && s.call(ye.dragged.parentNode[_e], ne, F, e, Wa, Le[this.layer].el) !== "continue" || Lo(Le[this.layer].el, ne, F);
      }.bind({
        layer: u
      }), 24))), u++;
    } while (a.bubbleScroll && x !== h && (x = Dt(x, !1)));
    Il = i;
  }
}, 30), Ho = function(a) {
  var t = a.originalEvent, l = a.putSortable, o = a.dragEl, d = a.activeSortable, v = a.dispatchSortableEvent, p = a.hideGhostForTarget, h = a.unhideGhostForTarget;
  if (t) {
    var i = l || d;
    p();
    var s = t.changedTouches && t.changedTouches.length ? t.changedTouches[0] : t, u = document.elementFromPoint(s.clientX, s.clientY);
    h(), i && !i.el.contains(u) && (v("spill"), this.onSpill({
      dragEl: o,
      putSortable: l
    }));
  }
};
function zl() {
}
zl.prototype = {
  startIndex: null,
  dragStart: function(a) {
    var t = a.oldDraggableIndex;
    this.startIndex = t;
  },
  onSpill: function(a) {
    var t = a.dragEl, l = a.putSortable;
    this.sortable.captureAnimationState(), l && l.captureAnimationState();
    var o = aa(this.sortable.el, this.startIndex, this.options);
    o ? this.sortable.el.insertBefore(t, o) : this.sortable.el.appendChild(t), this.sortable.animateAll(), l && l.animateAll();
  },
  drop: Ho
};
wt(zl, {
  pluginName: "revertOnSpill"
});
function ql() {
}
ql.prototype = {
  onSpill: function(a) {
    var t = a.dragEl, l = a.putSortable, o = l || this.sortable;
    o.captureAnimationState(), t.parentNode && t.parentNode.removeChild(t), o.animateAll();
  },
  drop: Ho
};
wt(ql, {
  pluginName: "removeOnSpill"
});
ye.mount(new Ps());
ye.mount(ql, zl);
function Os(e, a) {
  const t = e.oldDraggableIndex ?? e.oldIndex;
  e.item.remove();
  const l = [...e.from.children].filter((o) => o.matches(a));
  e.from.insertBefore(e.item, l[t ?? l.length] ?? null);
}
function Yo(e) {
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
          Os(d, ".work-reorder-entry"), v !== void 0 && p !== void 0 && v !== p && e(v, p);
        }
      }));
    },
    unmounted: t
  };
}
const Ns = { class: "work-stack work-tight work-option-builder" }, Ms = { class: "work-stack work-tight" }, Fs = { class: "work-stack work-tight work-small" }, Ls = { class: "work-stack work-tight work-small" }, Bs = { class: "work-stack work-tight" }, js = { class: "work-stack work-tight work-small" }, zs = { class: "work-row" }, qs = { class: "work-stack work-tight work-small" }, Ws = { class: "work-row" }, Gs = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, Ks = { class: "work-add-option" }, Hs = {
  key: 0,
  class: "work-muted work-small"
}, Ys = /* @__PURE__ */ Ve({
  __name: "OptionsEditor",
  props: {
    field: {}
  },
  emits: ["validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = "options:" + qt(), d = z(() => t.field.options ?? []), v = z(() => d.value.every((u, x) => !!u.id && d.value.findIndex((y) => y.id === u.id) === x));
    Se(v, (u) => l("validity", u, o), { immediate: !0 }), $t(() => l("validity", !0, o));
    function p(u, x) {
      So(d.value, u, x - u), d.value.forEach((y, g) => y.order = g);
    }
    const h = Yo(p), i = ["primary", "success", "info", "warn", "danger", "secondary"];
    function s() {
      let u = d.value.length + 1;
      for (; d.value.some((x) => x.id === `option_${u}`); ) u++;
      (t.field.options ??= []).push({ id: `option_${u}`, label: "New option", order: d.value.length });
    }
    return (u, x) => (n(), m("section", Ns, [
      x[4] || (x[4] = r("header", { class: "work-row" }, [
        r("h4", null, "Options"),
        r("span", { class: "work-muted work-small" }, "Renaming a choice keeps it selected on existing items."),
        r("span", { class: "work-spacer" })
      ], -1)),
      vt((n(), m("div", Ms, [
        (n(!0), m(_, null, ce(d.value, (y, g) => (n(), m("div", {
          key: g,
          class: "work-option-row work-reorder-entry"
        }, [
          k(c(te), {
            type: "button",
            class: "work-icon-button work-reorder-handle",
            "aria-label": "Drag option; arrow keys reorder",
            onKeydown: [
              We(Oe((f) => p(g, g - 1), ["prevent"]), ["up"]),
              We(Oe((f) => p(g, g + 1), ["prevent"]), ["down"])
            ],
            severity: "secondary",
            text: "",
            size: "small"
          }, {
            default: W(() => [
              k(c(pe), {
                icon: "tabler:grip-vertical",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["onKeydown"]),
          r("label", Fs, [
            x[0] || (x[0] = q("Label", -1)),
            k(c(Ie), {
              modelValue: y.label,
              "onUpdate:modelValue": (f) => y.label = f,
              "aria-label": "Option label"
            }, null, 8, ["modelValue", "onUpdate:modelValue"])
          ]),
          k(Ne, {
            class: "work-disclosure",
            label: "Advanced"
          }, {
            default: W(() => [
              r("label", Ls, [
                x[1] || (x[1] = q("Integration identifier", -1)),
                k(c(Ie), {
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
          r("div", Bs, [
            r("label", js, [
              x[2] || (x[2] = q("Color", -1)),
              r("span", zs, [
                r("span", {
                  class: ct(["work-color-swatch", "work-swatch-" + (y.color || "secondary")]),
                  "aria-hidden": "true"
                }, null, 2),
                k(c(me), {
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
            r("label", qs, [
              x[3] || (x[3] = q("Category", -1)),
              k(c(me), {
                "model-value": y.category,
                "aria-label": "Option category",
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                showClear: "",
                options: ["triage", "backlog", ...c(Co)].map((f) => ({ label: c(At)(f), value: f })),
                "onUpdate:modelValue": (f) => y.category = f || void 0
              }, null, 8, ["model-value", "options", "onUpdate:modelValue"])
            ])
          ]),
          r("div", Ws, [
            k(c(te), {
              "aria-label": "Option earlier",
              severity: "secondary",
              size: "small",
              disabled: g === 0,
              onClick: (f) => p(g, g - 1),
              text: ""
            }, {
              default: W(() => [
                k(c(pe), {
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
              disabled: g === d.value.length - 1,
              onClick: (f) => p(g, g + 1),
              text: ""
            }, {
              default: W(() => [
                k(c(pe), {
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
              onClick: (f) => d.value.splice(g, 1)
            }, {
              icon: W(() => [
                k(c(pe), {
                  icon: "tabler:trash",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["onClick"])
          ])
        ]))), 128)),
        v.value ? T("", !0) : (n(), m("p", Gs, "Each choice needs a unique integration identifier.")),
        r("div", Ks, [
          k(c(te), {
            label: "Add option",
            severity: "secondary",
            size: "small",
            onClick: s,
            outlined: ""
          }, {
            icon: W(() => [
              k(c(pe), {
                icon: "tabler:plus",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          })
        ])
      ])), [
        [c(h)]
      ]),
      d.value.length ? T("", !0) : (n(), m("p", Hs, "Add the choices people can select for this field."))
    ]));
  }
}), Xs = {
  class: "work-stack",
  "aria-label": "Fields editor"
}, Js = { class: "work-form-actions work-wrap" }, Zs = { class: "work-stack work-tight" }, Qs = {
  key: 0,
  class: "work-settings-card work-muted"
}, _s = { class: "work-muted work-small" }, er = {
  key: 0,
  class: "work-error work-small",
  role: "alert"
}, tr = { class: "work-settings-grid work-field-properties" }, ar = { class: "work-stack work-tight" }, lr = { class: "work-stack work-tight" }, or = { class: "work-stack work-tight" }, ir = {
  key: 1,
  class: "work-stack work-tight"
}, nr = {
  key: 4,
  class: "work-stack work-tight"
}, sr = {
  key: 5,
  class: "work-stack work-tight"
}, rr = { class: "work-stack work-tight" }, dr = { class: "work-stack work-tight" }, ur = { class: "work-stack work-tight" }, cr = { class: "work-stack work-tight" }, vr = { class: "work-stack" }, fr = { class: "work-stack work-tight" }, mr = { class: "work-stack work-tight" }, pr = { class: "work-stack work-tight work-field-history" }, br = { class: "work-settings-list" }, gr = { class: "work-settings-row" }, hr = { class: "work-settings-row" }, yr = { class: "work-stack" }, kr = /* @__PURE__ */ Ve({
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
    const t = e, l = a, o = z(() => t.draft.fields ?? []), d = j("text"), v = j([]), p = z(() => (t.draft.item_types ?? []).map((A) => ({ value: A.id, label: A.title || Ae(A.id) }))), h = z(() => t.draft.item_types?.find((A) => A.id === t.itemType)), i = z(() => o.value.map((A, C) => ({ field: A, index: C })).filter(({ field: A }) => !h.value || h.value.fields.includes(A.code))), s = j(""), u = j({}), x = Yo((A, C) => {
      const O = i.value[A]?.index, Y = i.value[C]?.index;
      O !== void 0 && Y !== void 0 && Q(O, Y - O);
    });
    function y(A) {
      return (t.draft.item_types ?? []).filter((C) => C.fields.includes(A)).map((C) => C.title || Ae(C.id));
    }
    async function g(A) {
      if (!s.value) {
        s.value = A.code;
        try {
          const C = await t.guardRemoval?.("fields", A.code);
          u.value[A.code] = C ?? "", C || ka(t.draft, "fields", A.code);
        } finally {
          s.value = "";
        }
      }
    }
    const f = Object.entries({ text: "Text", int: "Whole number", dec: "Decimal number", quantity: "Measurement", bool: "Yes or no", time: "Date or time", ref: "Reference", record: "Structured data", option: "Choice", principal: "Person or group", item: "Work item", rank: "Order", rich_text: "Formatted text", formula: "Formula", rollup: "Related item calculation", counter: "Counter" }).map(([A, C]) => ({ value: A, label: C })), w = [{ label: "None", value: "none" }, { label: "Exact matches", value: "key" }, { label: "Numeric ranges", value: "number" }], V = ["int", "dec", "quantity"], $ = z(() => new Map(t.installedTypes?.map((A) => [A.id, A]))), S = z(() => [...f, ...(t.installedTypes ?? []).map((A) => ({ value: A.id, label: A.title }))]), I = {};
    function B(A) {
      return A.type && A.type !== "value" ? A.type : A.form ?? "text";
    }
    function le(A) {
      return A.type ? $.value.get(A.type) : void 0;
    }
    function J(A) {
      const C = le(A)?.config_schema;
      return C && Ol(C).length ? C : void 0;
    }
    function se(A) {
      const C = le(A);
      return !!C?.config_schema || ["dec", "quantity", "ref", "time", "record"].includes(C?.form ?? A.form ?? "") || !!A.config;
    }
    function ue(A) {
      const C = le(A), O = C?.form ?? A.form ?? "text";
      return w.filter(({ value: Y }) => Y === "none" || (!C?.indexes || C.indexes.includes(Y)) && O !== "record" && (Y !== "number" || V.includes(O) || A.type === "option"));
    }
    function fe(A) {
      A.index && !ue(A).some((C) => C.value === A.index) && delete A.index;
    }
    function be(A, C) {
      const O = $.value.get(C);
      if (O) {
        if (O.id === A.type) return;
        A.type = O.id, A.form = O.form, delete A.options, delete A.config, fe(A);
        return;
      }
      le(A) && delete A.config;
      const Y = { option: "text", principal: "ref", item: "ref", rank: "text", rich_text: "text", formula: "int", rollup: "int", counter: "int" };
      Y[C] ? (A.type = C, A.form = Y[C]) : (delete A.type, A.form = C), C !== "option" ? delete A.options : A.options ??= [], C === "rich_text" && (A.config = { format: "json" }), fe(A);
    }
    function oe(A, C) {
      A.form = C, fe(A);
    }
    function M(A, C) {
      const O = { ...A.config };
      C ? O.item_type = C : delete O.item_type, A.config = Object.keys(O).length ? O : void 0;
    }
    function Q(A, C) {
      So(o.value, A, C);
      for (const O of t.draft.item_types ?? []) {
        const Y = new Set(O.fields);
        O.fields = o.value.filter((b) => Y.has(b.code)).map((b) => b.code);
      }
    }
    function F(A, C) {
      try {
        wi(t.draft, A, C.value), delete u.value[A.code];
      } catch (O) {
        u.value[A.code] = O.message, C.value = A.code;
      }
    }
    function ne() {
      d.value = "text", v.value = h.value ? [h.value.id] : [];
    }
    function ke(A) {
      const C = A.normalize("NFKD").replace(/\p{Mark}/gu, "").toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, ""), O = (/^[a-z]/.test(C) ? C : `field_${C || "new"}`).slice(0, 40);
      let Y = O, b = 2;
      for (; o.value.some((E) => E.code === Y); ) {
        const E = "_" + b++;
        Y = O.slice(0, 40 - E.length) + E;
      }
      const R = { code: Y, title: A, form: "text", cardinality: "one" };
      be(R, d.value), (t.draft.fields ??= []).push(R);
      for (const E of t.draft.item_types ?? []) v.value.includes(E.id) && E.fields.push(Y);
      h.value && !v.value.includes(h.value.id) && l("update:itemType", ""), X.value = Y, l("created");
    }
    const X = j("");
    return (A, C) => (n(), m("section", Xs, [
      r("div", Js, [
        k(c(me), {
          "model-value": h.value?.id ?? "",
          "aria-label": "Filter fields by item type",
          placeholder: "All item types",
          appendTo: "self",
          optionLabel: "label",
          optionValue: "value",
          options: [{ value: "", label: "All item types" }, ...p.value],
          "onUpdate:modelValue": C[0] || (C[0] = (O) => l("update:itemType", O))
        }, null, 8, ["model-value", "options"]),
        k(ga, {
          action: "Add field",
          label: "Field name",
          maxlength: 255,
          regular: "",
          "open-on-entry": e.createForItemType,
          onOpen: ne,
          onAdd: ke,
          onCancel: C[3] || (C[3] = (O) => l("cancel-creation"))
        }, {
          default: W(() => [
            r("label", Zs, [
              C[5] || (C[5] = q("Kind", -1)),
              k(c(me), {
                modelValue: d.value,
                "onUpdate:modelValue": C[1] || (C[1] = (O) => d.value = O),
                "aria-label": "New field kind",
                appendTo: "self",
                options: S.value,
                optionLabel: "label",
                optionValue: "value"
              }, null, 8, ["modelValue", "options"])
            ]),
            p.value.length ? (n(), H(st, {
              key: 0,
              label: "Show on item types",
              options: p.value,
              modelValue: v.value,
              "onUpdate:modelValue": C[2] || (C[2] = (O) => v.value = O)
            }, null, 8, ["options", "modelValue"])) : T("", !0)
          ]),
          _: 1
        }, 8, ["open-on-entry"])
      ]),
      i.value.length ? T("", !0) : (n(), m("p", Qs, "No fields here yet. Add a field to capture information.")),
      vt((n(), H(Ja, {
        columns: "fields",
        count: i.value.length
      }, {
        default: W(() => [
          (n(!0), m(_, null, ce(i.value, ({ field: O, index: Y }) => (n(), H(Xa, {
            "route-section": "fields",
            "route-id": O.code,
            title: c(He)(O),
            "initial-open": X.value === O.code,
            kind: le(O)?.title || c(f).find((b) => b.value === B(O))?.label || c(Ae)(B(O)),
            key: O.id ?? Y,
            class: "work-field-row work-reorder-entry work-stack"
          }, {
            handle: W(() => [
              k(c(te), {
                type: "button",
                class: "work-reorder-handle work-icon-button",
                "aria-label": "Drag " + c(He)(O) + " or use the arrow keys to reorder",
                onKeydown: [
                  We(Oe((b) => Q(Y, -1), ["prevent"]), ["up"]),
                  We(Oe((b) => Q(Y, 1), ["prevent"]), ["down"])
                ],
                severity: "secondary",
                text: "",
                size: "small"
              }, {
                default: W(() => [
                  k(c(pe), {
                    icon: "tabler:grip-vertical",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["aria-label", "onKeydown"])
            ]),
            flags: W(() => [
              O.track ? (n(), H(c(tt), {
                key: 0,
                class: "kx-tag-sm",
                severity: "secondary",
                value: "Tracked"
              })) : T("", !0),
              O.intervals ? (n(), H(c(tt), {
                key: 1,
                class: "kx-tag-sm",
                severity: "secondary",
                value: "Intervals"
              })) : T("", !0)
            ]),
            usage: W(() => [
              r("span", _s, D(y(O.code).length ? y(O.code).join(", ") : "Unused"), 1)
            ]),
            actions: W(() => [
              k(c(te), {
                "aria-label": "Move " + c(He)(O) + " earlier",
                severity: "secondary",
                disabled: Y === 0,
                onClick: (b) => Q(Y, -1),
                text: "",
                size: "small"
              }, {
                default: W(() => [
                  k(c(pe), {
                    icon: "tabler:arrow-up",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["aria-label", "disabled", "onClick"]),
              k(c(te), {
                "aria-label": "Move " + c(He)(O) + " later",
                severity: "secondary",
                disabled: Y === o.value.length - 1,
                onClick: (b) => Q(Y, 1),
                text: "",
                size: "small"
              }, {
                default: W(() => [
                  k(c(pe), {
                    icon: "tabler:arrow-down",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["aria-label", "disabled", "onClick"])
            ]),
            default: W(() => [
              u.value[O.code] ? (n(), m("p", er, D(u.value[O.code]), 1)) : T("", !0),
              (n(!0), m(_, null, ce(e.issues?.filter((b) => b.code === O.code) ?? [], (b) => (n(), m("p", {
                key: b.what,
                class: "work-error work-small",
                role: "alert"
              }, D(c(Ha)(b)), 1))), 128)),
              r("div", tr, [
                r("label", ar, [
                  C[6] || (C[6] = q("Title", -1)),
                  k(c(Ie), {
                    modelValue: O.title,
                    "onUpdate:modelValue": (b) => O.title = b,
                    "aria-label": "Field title",
                    maxlength: "255",
                    placeholder: c(He)(O)
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder"])
                ]),
                r("label", lr, [
                  C[7] || (C[7] = q("Kind", -1)),
                  k(c(me), {
                    "aria-label": "Kind",
                    "model-value": B(O),
                    "onUpdate:modelValue": (b) => be(O, b),
                    appendTo: "self",
                    options: S.value,
                    optionLabel: "label",
                    optionValue: "value"
                  }, null, 8, ["model-value", "onUpdate:modelValue", "options"])
                ]),
                r("label", or, [
                  C[8] || (C[8] = q("Values allowed", -1)),
                  k(c(me), {
                    "aria-label": "Values allowed",
                    "model-value": O.cardinality ?? "one",
                    "onUpdate:modelValue": (b) => O.cardinality = b,
                    appendTo: "self",
                    options: [{ label: "One value", value: "one" }, { label: "Multiple unique values", value: "set" }, { label: "Ordered values", value: "list" }],
                    optionLabel: "label",
                    optionValue: "value"
                  }, null, 8, ["model-value", "onUpdate:modelValue"])
                ])
              ]),
              O.type === "item" ? (n(), m("label", ir, [
                C[9] || (C[9] = q("Which items can be referenced? ", -1)),
                k(c(me), {
                  "model-value": O.config?.item_type ?? "",
                  "aria-label": "Reference target",
                  appendTo: "self",
                  optionLabel: "label",
                  optionValue: "value",
                  options: [{ value: "", label: "Any item type" }, ...p.value],
                  "onUpdate:modelValue": (b) => M(O, b)
                }, null, 8, ["model-value", "options", "onUpdate:modelValue"]),
                C[10] || (C[10] = r("span", { class: "work-muted work-small" }, "A reference stores the selected item as a value. To show a named relationship on both items, use Links.", -1))
              ])) : T("", !0),
              J(O) ? (n(), H(To, {
                key: O.type,
                schema: J(O),
                "model-value": O.config ?? I,
                "onUpdate:modelValue": (b) => O.config = b,
                onValidity: (b) => l("validity", "config-" + Y, b)
              }, null, 8, ["schema", "model-value", "onUpdate:modelValue", "onValidity"])) : T("", !0),
              O.type === "option" ? (n(), H(Ys, {
                key: 3,
                field: O,
                onValidity: C[4] || (C[4] = (b, R) => l("validity", R, b))
              }, null, 8, ["field"])) : T("", !0),
              O.type === "formula" || O.type === "rollup" ? (n(), m("label", nr, [
                C[11] || (C[11] = q("Result type", -1)),
                k(c(me), {
                  "model-value": O.form,
                  "onUpdate:modelValue": (b) => oe(O, b),
                  "aria-label": "Result type",
                  options: c(f).slice(0, 8),
                  optionLabel: "label",
                  optionValue: "value",
                  appendTo: "self"
                }, null, 8, ["model-value", "onUpdate:modelValue", "options"])
              ])) : T("", !0),
              O.type === "formula" ? (n(), m("label", sr, [
                C[12] || (C[12] = q("Expression", -1)),
                k(c(Ie), {
                  modelValue: O.expression,
                  "onUpdate:modelValue": (b) => O.expression = b,
                  "aria-label": "Expression"
                }, null, 8, ["modelValue", "onUpdate:modelValue"])
              ])) : T("", !0),
              O.type === "rollup" ? (n(), m(_, { key: 6 }, [
                r("label", rr, [
                  C[13] || (C[13] = q("Of", -1)),
                  k(c(Ie), {
                    modelValue: O.of,
                    "onUpdate:modelValue": (b) => O.of = b,
                    "aria-label": "Related items"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                r("label", dr, [
                  C[14] || (C[14] = q("Function", -1)),
                  k(c(Ie), {
                    modelValue: O.fn,
                    "onUpdate:modelValue": (b) => O.fn = b,
                    "aria-label": "Calculation"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                r("label", ur, [
                  C[15] || (C[15] = q("Field", -1)),
                  k(c(Ie), {
                    modelValue: O.field,
                    "onUpdate:modelValue": (b) => O.field = b,
                    "aria-label": "Calculated field"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                r("label", cr, [
                  C[16] || (C[16] = q("Order by", -1)),
                  k(c(me), {
                    "model-value": O.by,
                    "aria-label": "Rollup order",
                    options: ["rank", "time"],
                    showClear: "",
                    appendTo: "self",
                    "onUpdate:modelValue": (b) => O.by = b || void 0
                  }, null, 8, ["model-value", "onUpdate:modelValue"])
                ]),
                k(Fl, {
                  modelValue: O.where,
                  "onUpdate:modelValue": (b) => O.where = b,
                  draft: e.draft,
                  "board-id": e.boardId,
                  label: "Include related items when",
                  onValidity: (b) => l("validity", "rollup-" + Y, b)
                }, null, 8, ["modelValue", "onUpdate:modelValue", "draft", "board-id", "onValidity"])
              ], 64)) : T("", !0),
              k(Ne, {
                class: "work-disclosure",
                label: "Advanced field settings"
              }, {
                default: W(() => [
                  r("div", vr, [
                    r("label", fr, [
                      C[17] || (C[17] = q("Field identifier for integrations", -1)),
                      k(c(Ie), {
                        value: O.code,
                        "aria-label": "Field code",
                        required: "",
                        pattern: "[a-z][a-z0-9_]*",
                        onInput: (b) => F(O, b.target)
                      }, null, 8, ["value", "onInput"])
                    ]),
                    r("label", mr, [
                      C[18] || (C[18] = q("Allow filters to use", -1)),
                      k(c(me), {
                        "aria-label": "Allow filters to use",
                        "model-value": O.index ?? "none",
                        "onUpdate:modelValue": (b) => O.index = b,
                        appendTo: "self",
                        options: ue(O),
                        optionLabel: "label",
                        optionValue: "value"
                      }, null, 8, ["model-value", "onUpdate:modelValue", "options"])
                    ]),
                    r("section", pr, [
                      C[21] || (C[21] = r("h4", { class: "work-group-title" }, "History", -1)),
                      r("div", br, [
                        r("div", gr, [
                          C[19] || (C[19] = r("div", { class: "work-row-main" }, [
                            r("strong", null, "Track changes"),
                            r("p", { class: "work-muted work-small" }, "Record each value change in the item history.")
                          ], -1)),
                          k(c(et), {
                            modelValue: O.track,
                            "onUpdate:modelValue": (b) => O.track = b,
                            "aria-label": "Track changes"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        r("div", hr, [
                          C[20] || (C[20] = r("div", { class: "work-row-main" }, [
                            r("strong", null, "Track intervals"),
                            r("p", { class: "work-muted work-small" }, "Measure how long each value stays in effect.")
                          ], -1)),
                          k(c(et), {
                            modelValue: O.intervals,
                            "onUpdate:modelValue": (b) => O.intervals = b,
                            "aria-label": "Track intervals"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ])
                      ])
                    ]),
                    !J(O) && se(O) ? (n(), H(Ut, {
                      key: 0,
                      label: "Field configuration",
                      "model-value": O.config,
                      shape: "object",
                      "onUpdate:modelValue": (b) => O.config = b,
                      onValidity: (b) => l("validity", "config-" + Y, b)
                    }, null, 8, ["model-value", "onUpdate:modelValue", "onValidity"])) : T("", !0),
                    r("section", yr, [
                      C[22] || (C[22] = r("h4", { class: "work-group-title" }, "Access", -1)),
                      (n(), m(_, null, ce(["read", "write"], (b) => k(Ro, {
                        "board-id": e.boardId,
                        key: b,
                        label: b === "read" ? "Who can read" : "Who can edit",
                        "model-value": O.access?.[b],
                        "onUpdate:modelValue": (R) => O.access = { ...O.access, [b]: R },
                        onValidity: (R) => l("validity", "access-" + Y + b, R)
                      }, null, 8, ["board-id", "label", "model-value", "onUpdate:modelValue", "onValidity"])), 64))
                    ]),
                    k(c(te), {
                      label: "Remove field",
                      severity: "danger",
                      text: "",
                      disabled: !!s.value,
                      onClick: (b) => g(O)
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
        [c(x)]
      ])
    ]));
  }
}), wr = {
  class: "work-stack",
  "aria-label": "Item types editor"
}, $r = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, Vr = { class: "work-definition-meta" }, xr = { class: "work-settings-grid" }, Cr = { class: "work-stack work-tight" }, Sr = { class: "work-stack work-tight" }, Tr = {
  key: 0,
  class: "work-stack work-tight"
}, Ir = { key: 1 }, Dr = { class: "work-stack work-tight" }, Er = { class: "work-stack" }, Ur = { class: "work-stack work-tight" }, Ar = {
  key: 0,
  class: "work-row work-wrap"
}, Rr = { class: "work-stack work-tight" }, Pr = {
  key: 1,
  class: "work-stack work-tight work-small"
}, Or = {
  key: 0,
  class: "kx-empty"
}, Nr = /* @__PURE__ */ Ve({
  __name: "TypesEditor",
  props: {
    draft: {},
    guardRemoval: { type: Function },
    issues: {}
  },
  emits: ["create-field", "create-workflow"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = z(() => t.draft.item_types ?? []), d = j(""), v = j(""), p = j("");
    function h(w) {
      const V = w.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, ""), $ = /^[a-z]/.test(V) ? V : "type_" + (V || "new");
      let S = $.slice(0, 40), I = 2;
      for (; o.value.some((B) => B.id === S); ) {
        const B = "_" + I++;
        S = $.slice(0, 40 - B.length) + B;
      }
      return S;
    }
    function i(w) {
      const V = h(w);
      (t.draft.item_types ??= []).push({ id: V, title: w, process: t.draft.processes?.[0]?.id ?? "", fields: [] }), d.value = V;
    }
    function s(w, V) {
      const $ = w.id;
      w.id = V;
      for (const S of o.value) S.parent_types && (S.parent_types = S.parent_types.map((I) => I === $ ? V : I));
    }
    function u(w, V) {
      w.fields = V, w.inherit && (w.inherit = w.inherit.filter(($) => V.includes($)));
    }
    function x(w) {
      return (w.parent_types ?? []).filter((V) => typeof V == "string");
    }
    function y(w, V, $) {
      w.parent_types = $ && V.length ? [...V, !1] : V;
    }
    function g(w) {
      return o.value.filter((V) => V.id !== w.id && V.parent_types?.includes(w.id)).map((V) => V.title || Ae(V.id));
    }
    async function f(w) {
      if (!p.value) {
        if (g(w).length) {
          v.value = `${w.title || Ae(w.id)} is a parent type for ${g(w).join(", ")}. Remove those parent selections first.`;
          return;
        }
        p.value = w.id, v.value = "";
        try {
          const V = await t.guardRemoval?.("item_types", w.id);
          V ? v.value = V : ka(t.draft, "item_types", w.id);
        } finally {
          p.value = "";
        }
      }
    }
    return (w, V) => (n(), m("section", wr, [
      v.value ? (n(), m("p", $r, D(v.value), 1)) : T("", !0),
      k(Ja, {
        columns: "types",
        count: o.value.length
      }, {
        default: W(() => [
          (n(!0), m(_, null, ce(o.value, ($, S) => (n(), H(Xa, {
            "route-section": "items",
            "route-id": $.id,
            "initial-open": d.value === $.id,
            title: $.title || c(Ae)($.id),
            "kind-label": "Workflow",
            kind: e.draft.processes?.find((I) => I.id === $.process)?.name || c(Ae)($.process),
            key: S,
            class: "work-type-card"
          }, {
            usage: W(() => [
              r("span", Vr, [
                k(c(tt), {
                  class: "kx-tag-sm",
                  severity: "secondary"
                }, {
                  default: W(() => [
                    q(D($.fields.length) + " " + D($.fields.length === 1 ? "field" : "fields"), 1)
                  ]),
                  _: 2
                }, 1024),
                g($).length ? (n(), H(c(tt), {
                  key: 0,
                  class: "kx-tag-sm",
                  severity: "secondary"
                }, {
                  default: W(() => [
                    q("Parent of " + D(g($).join(", ")), 1)
                  ]),
                  _: 2
                }, 1024)) : T("", !0)
              ])
            ]),
            default: W(() => [
              (n(!0), m(_, null, ce(e.issues?.filter((I) => I.code === "item_type " + $.id) ?? [], (I) => (n(), m("p", {
                key: I.what,
                class: "work-error work-small",
                role: "alert"
              }, D(c(Ha)(I)), 1))), 128)),
              r("div", xr, [
                r("label", Cr, [
                  V[0] || (V[0] = q("Title", -1)),
                  k(c(Ie), {
                    modelValue: $.title,
                    "onUpdate:modelValue": (I) => $.title = I,
                    placeholder: c(Ae)($.id)
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder"])
                ]),
                r("div", Sr, [
                  e.draft.processes?.length ? (n(), m("label", Tr, [
                    V[1] || (V[1] = q(" Workflow ", -1)),
                    k(c(me), {
                      modelValue: $.process,
                      "onUpdate:modelValue": (I) => $.process = I,
                      "aria-label": "Workflow",
                      required: "",
                      appendTo: "self",
                      optionLabel: "label",
                      optionValue: "value",
                      options: e.draft.processes.map((I) => ({ label: I.name || c(Ae)(I.id), value: I.id }))
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                  ])) : (n(), m("span", Ir, "Workflow")),
                  r("div", null, [
                    k(c(te), {
                      label: "Create a workflow",
                      type: "button",
                      text: "",
                      size: "small",
                      onClick: (I) => l("create-workflow", $, I)
                    }, null, 8, ["onClick"])
                  ])
                ])
              ]),
              r("div", Dr, [
                k(st, {
                  label: "Fields",
                  options: (e.draft.fields ?? []).map((I) => ({ value: I.code, label: c(He)(I) })),
                  "model-value": $.fields,
                  "onUpdate:modelValue": (I) => u($, I)
                }, null, 8, ["options", "model-value", "onUpdate:modelValue"]),
                r("div", null, [
                  k(c(te), {
                    label: "Create a field",
                    type: "button",
                    text: "",
                    size: "small",
                    onClick: (I) => l("create-field", $, I)
                  }, null, 8, ["onClick"])
                ])
              ]),
              k(Ne, {
                class: "work-disclosure",
                label: "Advanced item type settings"
              }, {
                default: W(() => [
                  r("div", Er, [
                    r("label", Ur, [
                      V[2] || (V[2] = q("Identifier", -1)),
                      k(c(Ie), {
                        value: $.id,
                        onChange: (I) => s($, I.target.value),
                        required: "",
                        pattern: "[a-z][a-z0-9_]*"
                      }, null, 8, ["value", "onChange"])
                    ]),
                    V[6] || (V[6] = q()),
                    k(st, {
                      label: "Parent types",
                      options: o.value.map((I) => ({ value: I.id, label: I.title || c(Ae)(I.id) })),
                      "model-value": x($),
                      "onUpdate:modelValue": (I) => y($, I, !!$.parent_types?.includes(!1))
                    }, null, 8, ["options", "model-value", "onUpdate:modelValue"]),
                    x($).length ? (n(), m("label", Ar, [
                      k(c(et), {
                        "model-value": !!$.parent_types?.includes(!1),
                        "aria-label": "Allow top-level items",
                        "onUpdate:modelValue": (I) => y($, x($), I)
                      }, null, 8, ["model-value", "onUpdate:modelValue"]),
                      V[3] || (V[3] = q("Allow top-level items", -1))
                    ])) : T("", !0),
                    r("div", Rr, [
                      k(st, {
                        label: "Inherit from parent",
                        options: $.fields.map((I) => ({ value: I, label: c(He)(e.draft.fields?.find((B) => B.code === I) ?? { code: I }) })),
                        modelValue: $.inherit,
                        "onUpdate:modelValue": (I) => $.inherit = I
                      }, null, 8, ["options", "modelValue", "onUpdate:modelValue"]),
                      V[4] || (V[4] = r("p", { class: "work-muted work-small" }, "These fields resolve from the parent when this item has no own value.", -1))
                    ]),
                    x($).length ? (n(), m("label", Pr, [
                      V[5] || (V[5] = q("When the parent moves", -1)),
                      k(c(me), {
                        modelValue: $.move_children,
                        "onUpdate:modelValue": (I) => $.move_children = I,
                        "aria-label": "When the parent moves",
                        appendTo: "self",
                        optionLabel: "label",
                        optionValue: "value",
                        optionDisabled: "disabled",
                        options: [{ label: "Default", value: void 0, disabled: !1 }, { label: "Move children", value: "move", disabled: !1 }, { label: "Refuse while children exist", value: "refuse", disabled: !1 }]
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ])) : T("", !0),
                    k(c(te), {
                      label: "Remove type",
                      severity: "danger",
                      text: "",
                      disabled: !!p.value,
                      onClick: (I) => f($)
                    }, null, 8, ["disabled", "onClick"])
                  ])
                ]),
                _: 2
              }, 1024)
            ]),
            _: 2
          }, 1032, ["route-id", "initial-open", "title", "kind"]))), 128)),
          o.value.length ? T("", !0) : (n(), m("p", Or, "Add a type for the work people create, such as a delivery task or customer request.")),
          k(ga, {
            action: "Add item type",
            label: "Item type name",
            onAdd: i
          })
        ]),
        _: 1
      }, 8, ["count"])
    ]));
  }
}), Mr = ".work-process-canvas>svg{height:480px;width:100%}.work-process-canvas:focus-visible{outline:var(--p-focus-ring-width) var(--p-focus-ring-style) var(--p-focus-ring-color);outline-offset:var(--p-focus-ring-offset)}.work-state-card{fill:var(--p-content-background);stroke:var(--p-content-border-color);stroke-width:1.5}.work-graph-node.work-selected .work-state-card{stroke:var(--p-primary-color);stroke-width:2.5;fill:color-mix(in srgb,var(--p-primary-color) 6%,var(--p-content-background))}.work-graph-node:focus-visible .work-state-card{stroke:var(--p-focus-ring-color);stroke-width:var(--p-focus-ring-width)}.work-process-canvas .work-edge-label{font-size:12px;fill:var(--p-text-color)}.work-process-canvas .work-edge-label-bg{fill:var(--p-content-background);stroke:var(--p-content-border-color);stroke-width:1}.work-edge-line{stroke:var(--p-primary-color);stroke-width:1.5}.work-edge-return .work-edge-line{stroke:var(--p-text-muted-color);stroke-dasharray:5 4}.work-graph-arrow{fill:context-stroke}.work-lane-line{fill:none;stroke:var(--p-text-muted-color);stroke-width:1.5;stroke-dasharray:2 4}.work-node-connector{fill:var(--p-content-background);stroke:var(--p-primary-color);stroke-width:1.5}.work-node-connector:hover,.work-node-connector:focus-visible,.work-node-connector[aria-pressed=true]{fill:var(--p-primary-color)}.work-any-transition:focus-visible text,.work-any-transition[aria-pressed=true] text{fill:var(--p-primary-color);text-decoration:underline}.work-process-legend{position:static;flex-wrap:wrap;padding:10px 16px;border-top:1px solid var(--p-content-border-color);background:var(--p-content-background)}@media(max-width:700px){.work-process-canvas>svg{height:420px}}.work-process-more{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:8px;padding:8px 16px;border-top:1px solid var(--p-content-border-color);background:var(--p-content-background);color:var(--p-text-muted-color);font-size:12px}.work-process-canvas .work-graph-edge.work-selected .work-edge-label-bg{fill:var(--p-primary-color);stroke:var(--p-primary-color)}.work-process-canvas .work-graph-edge.work-selected .work-edge-label{fill:var(--p-primary-contrast-color)}", vo = /* @__PURE__ */ new WeakSet();
function Fr(e) {
  const a = e.getRootNode();
  if (a instanceof ShadowRoot && !vo.has(a)) {
    const t = e.ownerDocument.createElement("style");
    t.textContent = Mr, a.append(t), vo.add(a);
  }
}
const Xo = 0.8;
function Lr(e, a, t) {
  const l = Math.min(1, a.width / e.width, a.height / e.height);
  if (l >= Xo) return { zoom: l, pan: { x: (e.width - a.width / l) / 2, y: (e.height - a.height / l) / 2 } };
  const o = e.nodes.find((v) => v.state.id === t) ?? e.nodes[0], d = Math.min(1, a.width / ((o?.width ?? 190) + 64));
  return { zoom: d, pan: o ? { x: e.direction === "TB" ? o.x - a.width / d / 2 : o.x - o.width / 2 - 32, y: e.direction === "TB" ? o.y - o.height / 2 - 32 : o.y - a.height / d / 2 } : { x: 0, y: 0 } };
}
const Br = ["onKeydown"], jr = {
  key: 0,
  class: "work-process-instruction",
  role: "status"
}, zr = ["viewBox"], qr = ["id"], Wr = ["d", "marker-end"], Gr = ["aria-label", "aria-pressed", "aria-keyshortcuts", "onKeydown", "onFocus", "onClick"], Kr = ["d"], Hr = ["d", "marker-end"], Yr = ["x", "y", "width", "height"], Xr = ["x", "y"], Jr = ["x", "dy"], Zr = ["aria-label", "aria-pressed", "onClick", "onKeydown", "onFocus", "onPointerup"], Qr = ["x", "y", "width", "height"], _r = ["cx", "cy"], ed = ["x", "y"], td = ["x", "dy"], ad = ["x", "y"], ld = ["x", "dy"], od = {
  key: 0,
  class: "work-limit-text"
}, id = ["aria-label", "aria-pressed", "aria-keyshortcuts", "onFocus", "onKeydown", "onClick"], nd = ["x", "y"], sd = ["x", "dy"], rd = ["cx", "cy", "aria-label", "aria-pressed", "onFocus", "onPointerdown", "onClick", "onKeydown"], dd = ["d"], ud = {
  key: 1,
  class: "work-process-more",
  role: "status"
}, cd = { class: "work-process-legend" }, vd = /* @__PURE__ */ Ve({
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
    const l = e, o = t, d = qt().replace(/:/g, "_"), v = j(""), p = j(), h = j();
    let i;
    const s = j(900), u = j(!1), x = z(() => s.value < 700 ? 420 : 480), y = z(() => Bi(l.process, l.draft, {
      width: s.value,
      height: x.value,
      direction: l.fitOnOpen ? "TB" : void 0
    })), g = j(1), f = j({ x: 0, y: 0 }), w = j({ x: 0, y: 0 }), V = z(() => {
      const P = Math.min(1, s.value / y.value.width);
      return l.fitOnOpen ? Math.max(Xo, P) : P;
    }), $ = z(() => ({
      width: s.value,
      height: u.value ? Math.max(x.value, Math.ceil(y.value.height * V.value)) : x.value
    })), S = z(() => y.value.nodes.filter((P) => P.x - P.width / 2 >= f.value.x && P.x + P.width / 2 <= f.value.x + $.value.width / g.value && P.y - P.height / 2 >= f.value.y && P.y + P.height / 2 <= f.value.y + $.value.height / g.value).length);
    function I() {
      u.value = !1;
      const P = Lr(y.value, $.value, l.process.initial);
      g.value = P.zoom, f.value = P.pan;
    }
    const B = z(() => `${f.value.x} ${f.value.y} ${$.value.width / g.value} ${$.value.height / g.value}`), le = z(() => y.value.nodes.find((P) => P.state.id === v.value));
    function J() {
      u.value = !0, g.value = V.value;
      const P = $.value.width / g.value, Z = y.value.nodes.find((N) => N.state.id === l.process.initial);
      f.value = {
        x: y.value.width > P && Z ? Z.x - P / 2 : (y.value.width - P) / 2,
        y: 0
      };
    }
    function se(P) {
      l.fitOnOpen && (u.value = !1);
      const Z = Math.max(0.02, Math.min(3, g.value * P)), N = 1 / g.value - 1 / Z;
      f.value = { x: f.value.x + $.value.width * N / 2, y: f.value.y + $.value.height * N / 2 }, g.value = Z;
    }
    function ue(P) {
      const Z = $.value.width / g.value, N = $.value.height / g.value;
      (P.x - P.width / 2 < f.value.x || P.x + P.width / 2 > f.value.x + Z || P.y - P.height / 2 < f.value.y || P.y + P.height / 2 > f.value.y + N) && (f.value = { x: P.x - Z / 2, y: P.y - N / 2 });
    }
    function fe() {
      const P = y.value.nodes.find((Z) => Z.state === l.selectedState) ?? y.value.edges.find((Z) => Z.transition === l.selectedTransition);
      if (!P) {
        l.fitOnOpen && u.value && J();
        return;
      }
      ue(P);
    }
    Se([y, () => l.selectedState, () => l.selectedTransition], fe, { flush: "post" });
    function be() {
      l.fitOnOpen ? J() : I();
    }
    Se(() => l.process.id, () => {
      A(), be();
    }, { flush: "post" });
    function oe(P) {
      if (P.target !== p.value) return;
      (P.key === "+" || P.key === "=") && (P.preventDefault(), se(1.2)), P.key === "-" && (P.preventDefault(), se(1 / 1.2)), P.key === "0" && (P.preventDefault(), J());
      const Z = 60 / g.value;
      P.key.startsWith("Arrow") && (P.preventDefault(), f.value = { x: f.value.x + (P.key === "ArrowRight" ? Z : P.key === "ArrowLeft" ? -Z : 0), y: f.value.y + (P.key === "ArrowDown" ? Z : P.key === "ArrowUp" ? -Z : 0) });
    }
    function M(P, Z) {
      const N = Z.currentTarget;
      if (!v.value) o("state", P, N);
      else if (v.value !== P.id) {
        const re = v.value;
        v.value = "", o("connect", re, P.id, N);
      }
    }
    function Q(P) {
      v.value = P.state.id, w.value = { x: y.value.direction === "TB" ? P.x : P.x + P.width / 2, y: y.value.direction === "TB" ? P.y + P.height / 2 : P.y };
    }
    function F(P, Z) {
      if (P.pointerType === "touch" || P.button !== 0) return;
      i = P.pointerId, Q(Z);
      const N = P.currentTarget;
      N.hasPointerCapture?.(P.pointerId) && N.releasePointerCapture(P.pointerId);
    }
    function ne(P, Z) {
      i === P.pointerId && (i = void 0, !(!v.value || v.value === Z.id) && M(Z, P));
    }
    function ke(P, Z) {
      if ((P.key === "Enter" || P.key === " ") && (P.preventDefault(), M(Z, P)), ["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp"].includes(P.key)) {
        P.preventDefault();
        const N = Array.from(h.value?.querySelectorAll(".work-graph-node") ?? []), re = y.value.nodes.findIndex((Ee) => Ee.state === Z), we = ["ArrowRight", "ArrowDown"].includes(P.key) ? 1 : -1;
        N[(re + we + N.length) % N.length]?.focus();
      }
    }
    function X(P, Z) {
      l.selectedTransition === Z && o("removeTransition", P);
    }
    function A() {
      v.value = "", i = void 0, O.clear(), Y = 0;
    }
    function C() {
      A(), o("clear");
    }
    const O = /* @__PURE__ */ new Map();
    let Y = 0;
    function b(P) {
      if (!P.target.closest('[role="button"]') && (O.set(P.pointerId, { x: P.clientX, y: P.clientY }), p.value?.setPointerCapture?.(P.pointerId), O.size === 2)) {
        const [Z, N] = [...O.values()];
        Y = Math.hypot(Z.x - N.x, Z.y - N.y);
      }
    }
    function R(P) {
      const Z = h.value?.getBoundingClientRect();
      if (!Z?.width) return;
      if (i === P.pointerId && v.value) {
        w.value = { x: f.value.x + (P.clientX - Z.left) * $.value.width / g.value / Z.width, y: f.value.y + (P.clientY - Z.top) * $.value.height / g.value / Z.height };
        return;
      }
      const N = O.get(P.pointerId);
      if (N)
        if (O.set(P.pointerId, { x: P.clientX, y: P.clientY }), O.size === 2) {
          const [re, we] = [...O.values()], Ee = Math.hypot(re.x - we.x, re.y - we.y);
          Y && se(Ee / Y), Y = Ee;
        } else f.value = { x: f.value.x - (P.clientX - N.x) * $.value.width / g.value / Z.width, y: f.value.y - (P.clientY - N.y) * $.value.height / g.value / Z.height };
    }
    function E(P) {
      i === P.pointerId && (v.value = "", i = void 0);
    }
    function U(P) {
      O.delete(P.pointerId), Y = 0, E(P);
    }
    function G(P) {
      P.ctrlKey && (P.preventDefault(), se(Math.exp(-P.deltaY * 0.01)));
    }
    let K;
    ya(() => {
      if (p.value && Fr(p.value), typeof ResizeObserver < "u" && h.value) {
        let P = !0;
        K = new ResizeObserver(() => {
          const Z = h.value?.getBoundingClientRect();
          if (!Z?.width || !Z.height) return;
          const N = $.value.width;
          s.value = Z.width, (P || Math.abs(Z.width - N) > 1) && (P ? be() : u.value ? J() : I(), P = !1), fe();
        }), K.observe(h.value);
      }
    }), $t(() => K?.disconnect()), a({ fit: J, focus: () => p.value?.focus(), zoomIn: () => se(1.2), zoomOut: () => se(1 / 1.2) });
    function ve(P) {
      return P.category === "completed" ? "check" : P.category === "canceled" ? "x" : P.id === l.process.initial ? "arrow-bar-to-right" : { gate: "shield-check", automated: "bolt", parallel: "arrows-split" }[P.kind ?? ""] ?? "user";
    }
    return (P, Z) => (n(), m("section", {
      ref_key: "canvas",
      ref: p,
      class: ct(["work-process-canvas", { "work-process-scrollable": e.fitOnOpen && u.value }]),
      "aria-label": "Process map",
      tabindex: "0",
      onKeydown: [
        oe,
        We(Oe(C, ["stop"]), ["esc"])
      ],
      onPointerdown: b,
      onPointermove: R,
      onPointerup: U,
      onPointerleave: E,
      onPointercancel: A,
      onWheel: G
    }, [
      v.value ? (n(), m("p", jr, "Choose the next stop. Escape cancels.")) : T("", !0),
      (n(), m("svg", {
        ref_key: "svg",
        ref: h,
        style: fi({ height: $.value.height + "px" }),
        viewBox: B.value,
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
          }, [...Z[1] || (Z[1] = [
            r("path", {
              d: "M0 0 L8 4 L0 8 z",
              class: "work-graph-arrow"
            }, null, -1)
          ])], 8, qr)
        ]),
        (n(!0), m(_, null, ce(y.value.parallels, (N) => (n(), m("path", {
          key: N.key,
          d: N.path,
          class: "work-lane-line",
          "marker-end": `url(#${c(d)}-arrow)`
        }, [
          r("title", null, "Parallel lane from " + D(c(ge)(N.state)), 1)
        ], 8, Wr))), 128)),
        (n(!0), m(_, null, ce(y.value.edges, (N) => (n(), m("g", {
          key: N.key,
          class: ct(["work-graph-edge", ["work-edge-" + N.type, { "work-selected": e.selectedTransition === N.transition }]]),
          role: "button",
          tabindex: "0",
          "aria-label": "Edit transition " + c(ze)(N.transition),
          "aria-pressed": e.selectedTransition === N.transition,
          "aria-keyshortcuts": e.selectedTransition === N.transition ? "Delete Backspace" : void 0,
          onKeydown: [
            We((re) => X(re, N.transition), ["delete"]),
            We((re) => X(re, N.transition), ["backspace"]),
            We(Oe((re) => o("transition", N.transition, re.currentTarget), ["prevent"]), ["enter"]),
            We(Oe((re) => o("transition", N.transition, re.currentTarget), ["prevent"]), ["space"])
          ],
          onFocus: (re) => ue(N),
          onClick: (re) => o("transition", N.transition, re.currentTarget)
        }, [
          r("path", {
            d: N.path,
            class: "work-edge-hit"
          }, null, 8, Kr),
          r("path", {
            d: N.path,
            class: "work-edge-line",
            "marker-end": `url(#${c(d)}-arrow)`
          }, null, 8, Hr),
          r("rect", {
            x: N.x - N.width / 2,
            y: N.y - N.height / 2,
            width: N.width,
            height: N.height,
            rx: "6",
            class: "work-edge-label-bg"
          }, null, 8, Yr),
          r("text", {
            x: N.x,
            y: N.y - (N.lines.length - 1) * 8 + 4,
            class: "work-edge-label",
            "text-anchor": "middle"
          }, [
            (n(!0), m(_, null, ce(N.lines, (re, we) => (n(), m("tspan", {
              key: we,
              x: N.x,
              dy: we ? 16 : 0
            }, D(re), 9, Jr))), 128))
          ], 8, Xr)
        ], 42, Gr))), 128)),
        (n(!0), m(_, null, ce(y.value.nodes, (N) => (n(), m("g", {
          key: N.state.id,
          class: ct(["work-graph-node", ["work-stop-" + N.state.category, { "work-selected": e.selectedState === N.state }]]),
          role: "button",
          tabindex: "0",
          "aria-label": "Edit state " + c(ge)(N.state),
          "aria-pressed": e.selectedState === N.state,
          onClick: (re) => M(N.state, re),
          onKeydown: (re) => ke(re, N.state),
          onFocus: (re) => ue(N),
          onPointerup: (re) => ne(re, N.state)
        }, [
          r("rect", {
            x: N.x - N.width / 2,
            y: N.y - N.height / 2,
            width: N.width,
            height: N.height,
            rx: "10",
            class: "work-state-card"
          }, null, 8, Qr),
          r("circle", {
            cx: N.x - N.width / 2 + 22,
            cy: N.y - N.height / 2 + 25,
            r: "10",
            class: "work-stop-ring"
          }, null, 8, _r),
          k(c(pe), {
            icon: "tabler:" + ve(N.state),
            x: N.x - N.width / 2 + 15,
            y: N.y - N.height / 2 + 18,
            width: "14",
            height: "14",
            class: "work-stop-icon",
            "aria-hidden": "true"
          }, null, 8, ["icon", "x", "y"]),
          r("text", {
            x: N.x - N.width / 2 + 42,
            y: N.y - N.height / 2 + 29,
            class: "work-node-name"
          }, [
            (n(!0), m(_, null, ce(N.title, (re, we) => (n(), m("tspan", {
              key: we,
              x: N.x - N.width / 2 + 42,
              dy: we ? 18 : 0
            }, D(re), 9, td))), 128))
          ], 8, ed),
          r("text", {
            x: N.x - N.width / 2 + 16,
            y: N.y - N.height / 2 + 33 + N.title.length * 18,
            class: "work-node-meta"
          }, [
            (n(!0), m(_, null, ce(N.caption, (re, we) => (n(), m("tspan", {
              key: we,
              x: N.x - N.width / 2 + 16,
              dy: we ? 16 : 0
            }, D(re), 9, ld))), 128)),
            e.draft.policy?.wip?.[N.state.id] ? (n(), m("tspan", od, " · limit " + D(e.draft.policy.wip[N.state.id].limit), 1)) : T("", !0)
          ], 8, ad),
          (n(!0), m(_, null, ce(N.badges, (re, we) => (n(), m("g", {
            key: re.id,
            class: "work-any-transition",
            role: "button",
            tabindex: "0",
            "aria-label": "Edit transition " + c(ze)(re),
            "aria-pressed": e.selectedTransition === re,
            "aria-keyshortcuts": e.selectedTransition === re ? "Delete Backspace" : void 0,
            onFocus: (Ee) => ue(N),
            onKeydown: [
              We((Ee) => X(Ee, re), ["delete"]),
              We((Ee) => X(Ee, re), ["backspace"]),
              We(Oe((Ee) => o("transition", re, Ee.currentTarget), ["stop", "prevent"]), ["enter"]),
              We(Oe((Ee) => o("transition", re, Ee.currentTarget), ["stop", "prevent"]), ["space"])
            ],
            onClick: Oe((Ee) => o("transition", re, Ee.currentTarget), ["stop"])
          }, [
            r("text", {
              x: N.x - N.width / 2 + 16,
              y: N.y - N.height / 2 + 33 + N.title.length * 18 + N.caption.length * 16 + N.badges.slice(0, we).reduce((Ee, Ue) => Ee + c(Zt)(c(ze)(Ue) + " works from any state").length * 18, 0),
              class: "work-node-meta"
            }, [
              (n(!0), m(_, null, ce(c(Zt)(c(ze)(re) + " works from any state"), (Ee, Ue) => (n(), m("tspan", {
                key: Ue,
                x: N.x - N.width / 2 + 16,
                dy: Ue ? 18 : 0
              }, D(Ee), 9, sd))), 128))
            ], 8, nd)
          ], 40, id))), 128)),
          ["completed", "canceled"].includes(N.state.category) ? T("", !0) : (n(), m("circle", {
            key: 0,
            cx: y.value.direction === "TB" ? N.x : N.x + N.width / 2,
            cy: y.value.direction === "TB" ? N.y + N.height / 2 : N.y,
            r: "9",
            class: "work-node-connector",
            role: "button",
            tabindex: "0",
            "aria-label": "Connect from " + c(ge)(N.state),
            "aria-pressed": v.value === N.state.id,
            onFocus: (re) => ue(N),
            onPointerdown: Oe((re) => F(re, N), ["stop"]),
            onClick: Oe((re) => Q(N), ["stop"]),
            onKeydown: [
              We(Oe((re) => Q(N), ["stop", "prevent"]), ["enter"]),
              We(Oe((re) => Q(N), ["stop", "prevent"]), ["space"])
            ]
          }, null, 40, rd))
        ], 42, Zr))), 128)),
        le.value ? (n(), m("path", {
          key: 0,
          d: `M ${y.value.direction === "TB" ? le.value.x : le.value.x + le.value.width / 2} ${y.value.direction === "TB" ? le.value.y + le.value.height / 2 : le.value.y} L ${w.value.x} ${w.value.y}`,
          class: "work-connect-ghost"
        }, null, 8, dd)) : T("", !0)
      ], 12, zr)),
      S.value < e.process.states.length ? (n(), m("div", ud, [
        r("span", null, D(S.value) + " of " + D(e.process.states.length) + " states in view · Pan to see more", 1),
        u.value ? T("", !0) : (n(), H(c(te), {
          key: 0,
          label: "Fit map",
          size: "small",
          text: "",
          onClick: Z[0] || (Z[0] = (N) => J())
        }))
      ])) : T("", !0),
      r("div", cd, [
        r("span", null, D(e.process.states.length) + " states · " + D(Math.round(g.value * 100)) + "%", 1),
        Z[2] || (Z[2] = r("span", null, [
          r("i"),
          q("Transition")
        ], -1)),
        Z[3] || (Z[3] = r("span", null, [
          r("i", { class: "work-return-key" }),
          q("Return / loop")
        ], -1)),
        Z[4] || (Z[4] = r("span", null, "Drag to pan · Ctrl + scroll to zoom · Fit to reset the view", -1))
      ])
    ], 42, Br));
  }
}), Dl = new Intl.ListFormat("en", { type: "conjunction" }), fd = new Intl.ListFormat("en", { type: "disjunction" }), md = {
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
}, pd = { some: "At least one", every: "Every", none: "No" };
function El(e, a) {
  const t = a.fields?.find((l) => l.code === e);
  return t ? He(t) : Ae(e);
}
function Ul(e, a, t) {
  return Array.isArray(e) ? Dl.format(e.map((l) => Ul(l, a, t))) : a === "category" && typeof e == "string" ? At(e) : a === "state" && typeof e == "string" ? t.processes?.flatMap((l) => l.states).find((l) => l.id === e)?.name || Ae(e) : "$actor" in ot(e) ? "the person moving the item" : "$now" in ot(e) ? "the current time" : Ft(e, t.fields?.find((l) => l.code === a));
}
function bd(e) {
  const a = ot(e.where);
  if (!(e.rel !== "blocks" || e.dir !== "inward" || a.field !== "category" || a.op !== "nin" || !Array.isArray(a.value) || a.value.length !== 2 || !a.value.includes("completed") || !a.value.includes("canceled"))) {
    if (e.q === "none") return "Requires all blockers to be resolved.";
    if (e.q === "some") return "Requires an open blocker.";
  }
}
function Fa(e, a) {
  const t = ot(e), l = (d) => d.map((v) => Fa(v, a)), o = a.relation_types?.find((d) => d.id === t.rel);
  if (Array.isArray(t.and) && t.and.length) return `(${Dl.format(l(t.and))})`;
  if (Array.isArray(t.or) && t.or.length) return `(${fd.format(l(t.or))})`;
  if (t.not) return `this condition is false (${Fa(t.not, a)})`;
  if (typeof t.match == "string" && t.match.trim()) return `the item matches “${t.match}”`;
  if (typeof t.rel == "string" || t.children) {
    const d = t.dir === "inward" && !o?.symmetric ? o?.inward : o?.outward, v = t.children ? "child item" : `item linked as “${d || Ae(String(t.rel))}”`;
    return `${pd[String(t.q)] ?? "At least one"} ${v} matches (${Fa(t.where, a)})`;
  }
  if (t.history) {
    const d = ot(t.history);
    if (typeof d.field != "string") return "a value history condition";
    const v = El(d.field, a), p = (i) => Ul(i, String(d.field), a), h = Array.isArray(d.during) ? ` during ${Dl.format(d.during.map((i) => String(i)))}` : "";
    if (d.changed === !0) {
      const i = d.from === void 0 ? "" : ` from ${p(d.from)}`, s = d.to === void 0 ? "" : ` to ${p(d.to)}`;
      return `${v} changed${i}${s}${h}`;
    }
    return d.was !== void 0 ? `${v} was ${p(d.was)}${h}` : `a change in the history of ${v}${h}`;
  }
  if (typeof t.field == "string") {
    const d = El(t.field, a);
    if (t.op === "is_null") return `${d} is ${t.value === !1 ? "filled" : "empty"}`;
    if (t.op === "is_state") {
      const p = { absent: "has never been filled", cleared: "was cleared", provided: "has a value" }[String(t.value)];
      if (p) return `${d} ${p}`;
    }
    const v = md[String(t.op)];
    return v && t.value !== void 0 ? `${d} ${v} ${Ul(t.value, t.field, a)}` : `a condition on ${d}`;
  }
  return "a custom condition";
}
function gd(e, a, t, l = []) {
  const o = [], d = a.states.find((p) => p.id === e.to), v = [.../* @__PURE__ */ new Set([...e.require ?? [], ...d?.require ?? []])];
  v.length && o.push(`Required: ${v.map((p) => El(p, t)).join(", ")}`), e.when != null && o.push(bd(ot(e.when)) ?? `Only when ${Fa(e.when, t)}`);
  for (const p of e.guards ?? []) {
    const h = l.find((i) => i.id === p);
    o.push(h ? `Requires the “${h.title}” check to pass` : "Requires an unavailable check to pass");
  }
  return o;
}
const hd = {
  key: 0,
  class: "work-stack work-tight work-muted work-small"
}, Jo = /* @__PURE__ */ Ve({
  __name: "TransitionRules",
  props: {
    transition: {},
    process: {},
    draft: {},
    guards: {}
  },
  setup(e) {
    const a = e, t = z(() => gd(a.transition, a.process, a.draft, a.guards));
    return (l, o) => t.value.length ? (n(), m("div", hd, [
      (n(!0), m(_, null, ce(t.value, (d, v) => (n(), m("p", { key: v }, D(d), 1))), 128))
    ])) : T("", !0);
  }
}), yd = {
  class: "work-process-list work-stack",
  "aria-label": "Process list"
}, kd = { class: "work-table-scroll" }, wd = {
  class: "work-settings-table work-process-table",
  role: "table",
  "aria-label": "States"
}, $d = { role: "rowgroup" }, Vd = ["aria-selected"], xd = { role: "cell" }, Cd = {
  key: 0,
  class: "work-muted work-small"
}, Sd = { role: "cell" }, Td = { role: "cell" }, Id = {
  role: "cell",
  class: "work-process-list-actions"
}, Dd = { class: "work-table-scroll" }, Ed = {
  class: "work-settings-table work-process-table",
  role: "table",
  "aria-label": "Transitions"
}, Ud = { role: "rowgroup" }, Ad = ["aria-selected"], Rd = { role: "cell" }, Pd = { role: "cell" }, Od = { role: "cell" }, Nd = {
  role: "cell",
  class: "work-process-list-actions"
}, Md = /* @__PURE__ */ Ve({
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
    return (a, t) => (n(), m("section", yd, [
      t[6] || (t[6] = r("h3", null, "States", -1)),
      r("div", kd, [
        r("table", wd, [
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
          r("tbody", $d, [
            (n(!0), m(_, null, ce(e.process.states, (l) => (n(), m("tr", {
              key: l.id,
              "aria-selected": e.selectedState === l,
              role: "row"
            }, [
              r("td", xd, [
                k(c(Ie), {
                  modelValue: l.name,
                  "onUpdate:modelValue": (o) => l.name = o,
                  "aria-label": "Name of " + c(ge)(l)
                }, null, 8, ["modelValue", "onUpdate:modelValue", "aria-label"]),
                e.counts ? (n(), m("p", Cd, D(e.counts[l.id] ?? 0) + " here", 1)) : T("", !0)
              ]),
              r("td", Sd, [
                t[0] || (t[0] = r("span", {
                  class: "work-process-cell-label",
                  "aria-hidden": "true"
                }, "Phase", -1)),
                q(D(c(At)(l.category)), 1)
              ]),
              r("td", Td, [
                t[1] || (t[1] = r("span", {
                  class: "work-process-cell-label",
                  "aria-hidden": "true"
                }, "Kind", -1)),
                k(c(tt), { severity: "secondary" }, {
                  default: W(() => [
                    q(D(c(La)(l.kind)), 1)
                  ]),
                  _: 2
                }, 1024)
              ]),
              r("td", Id, [
                k(c(te), {
                  size: "small",
                  text: "",
                  severity: "secondary",
                  "aria-label": "Edit state " + c(ge)(l),
                  onClick: (o) => a.$emit("state", l, o.currentTarget)
                }, {
                  default: W(() => [
                    k(c(pe), { icon: "tabler:pencil" })
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
                  default: W(() => [
                    k(c(pe), { icon: "tabler:trash" })
                  ]),
                  _: 1
                }, 8, ["aria-label", "onClick"])
              ])
            ], 8, Vd))), 128))
          ])
        ])
      ]),
      t[7] || (t[7] = r("h3", null, "Transitions", -1)),
      r("div", Dd, [
        r("table", Ed, [
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
          r("tbody", Ud, [
            (n(!0), m(_, null, ce(e.process.transitions ?? [], (l) => (n(), m("tr", {
              key: l.id,
              "aria-selected": e.selectedTransition === l,
              role: "row"
            }, [
              r("td", Rd, [
                k(c(Ie), {
                  modelValue: l.name,
                  "onUpdate:modelValue": (o) => l.name = o,
                  placeholder: c(ze)(l),
                  "aria-label": "Name of " + c(ze)(l)
                }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder", "aria-label"]),
                k(Jo, {
                  transition: l,
                  process: e.process,
                  draft: e.draft,
                  guards: e.guards
                }, null, 8, ["transition", "process", "draft", "guards"])
              ]),
              r("td", Pd, [
                t[3] || (t[3] = r("span", {
                  class: "work-process-cell-label",
                  "aria-hidden": "true"
                }, "From", -1)),
                q(" " + D(l.from === "any" ? "Any state" : l.from.map((o) => c(ge)(e.process.states.find((d) => d.id === o))).join(", ")), 1)
              ]),
              r("td", Od, [
                t[4] || (t[4] = r("span", {
                  class: "work-process-cell-label",
                  "aria-hidden": "true"
                }, "To", -1)),
                q(D(c(ge)(e.process.states.find((o) => o.id === l.to))), 1)
              ]),
              r("td", Nd, [
                k(c(te), {
                  size: "small",
                  text: "",
                  severity: "secondary",
                  "aria-label": "Edit transition " + c(ze)(l),
                  onClick: (o) => a.$emit("transition", l, o.currentTarget)
                }, {
                  default: W(() => [
                    k(c(pe), { icon: "tabler:pencil" })
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
                  default: W(() => [
                    k(c(pe), { icon: "tabler:trash" })
                  ]),
                  _: 1
                }, 8, ["aria-label", "onClick"])
              ])
            ], 8, Ad))), 128))
          ])
        ])
      ])
    ]));
  }
}), fo = /* @__PURE__ */ Ve({
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
async function kl(e, a) {
  try {
    const { data: t } = await Vl.get(e, a ? { params: a } : void 0);
    if (!t?.success) {
      const l = t?.message || (typeof t?.error == "string" ? t.error : t?.error?.message) || "Could not read published Flow.";
      throw new wl({ message: l, details: t?.details }, "Published Flow");
    }
    return t;
  } catch (t) {
    throw $i(t, "Published Flow");
  }
}
const mo = (e) => `/api/v1/workflows/${encodeURIComponent(e)}/versions`, Al = {
  title: async (e) => (await kl("/api/v1/workflows/published", { id: e })).item?.title,
  versions: async (e) => (await kl(mo(e))).versions ?? [],
  check: async (e) => {
    if ((await kl(`${mo(e.id)}/${e.version}`)).version?.version !== e.version) throw new Error("The published version is unavailable.");
  }
}, Fd = {
  class: "work-stack work-tight",
  "aria-label": "Stage Flow"
}, Ld = {
  key: 0,
  class: "work-muted work-small"
}, Bd = {
  key: 1,
  class: "kx-err work-alert-actions"
}, jd = { role: "alert" }, zd = ["schema", "config", "title"], qd = {
  key: 3,
  class: "kx-err",
  role: "alert"
}, Wd = {
  key: 4,
  class: "work-stack work-tight"
}, Gd = ["value", "aria-busy", "disabled"], Kd = {
  value: "",
  disabled: ""
}, Hd = ["value"], Yd = {
  key: 5,
  class: "work-muted work-small",
  role: "status"
}, Xd = /* @__PURE__ */ Ve({
  __name: "StageFlow",
  props: {
    modelValue: {}
  },
  emits: ["update:modelValue", "validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = j(!1), d = j(""), v = j([]), p = j(!1), h = j(""), i = j(!1), s = z(() => d.value || t.modelValue?.id), u = JSON.stringify({ properties: { flow_ref: { title: "Published Flow", picker: "wc-workflow-picker" } } }), x = z(() => JSON.stringify(t.modelValue ? { flow_ref: t.modelValue } : {}));
    let y = 0;
    async function g() {
      o.value = await Et("wc-workflow-picker");
    }
    g();
    async function f() {
      const S = ++y, I = s.value, B = t.modelValue;
      if (p.value = !!I, h.value = "", v.value = [], !!I)
        try {
          const [le] = await Promise.all([Al.versions(I), !i.value && B ? Al.check(B) : Promise.resolve()]);
          if (S !== y) return;
          if (v.value = le.filter((J) => Number.isInteger(J.version) && J.version > 0), !i.value && B && !v.value.some((J) => J.version === B.version)) throw new Error("The published version is unavailable.");
        } catch (le) {
          S === y && (h.value = nt(le, "Could not read published Flow."));
        } finally {
          S === y && (p.value = !1);
        }
    }
    Se([s, () => t.modelValue?.version, i], f, { immediate: !0 }), Se(i, (S) => l("validity", !S), { immediate: !0 });
    function w(S) {
      const I = S.detail?.flow_ref;
      I?.kind !== "flow" || !I.id || (i.value = !0, d.value = I.id);
    }
    function V(S) {
      !s.value || !v.value.some((I) => I.version === S) || (l("update:modelValue", { kind: "flow", id: s.value, version: S }), i.value = !1, d.value = "");
    }
    function $() {
      l("update:modelValue", void 0), i.value = !1, d.value = "";
    }
    return $t(() => {
      y++, l("validity", !0);
    }), (S, I) => (n(), m("section", Fd, [
      I[4] || (I[4] = r("h4", { class: "work-field-label" }, "What runs", -1)),
      e.modelValue ? T("", !0) : (n(), m("p", Ld, "No Flow bound. This stage keeps its existing external execution contract.")),
      h.value ? (n(), m("div", Bd, [
        r("p", jd, [
          q(D(i.value ? "Flow versions unavailable" : "Flow binding unavailable"), 1),
          !i.value && e.modelValue ? (n(), m(_, { key: 0 }, [
            q(" (v" + D(e.modelValue.version) + ")", 1)
          ], 64)) : T("", !0),
          q(". " + D(h.value), 1)
        ]),
        k(c(te), {
          label: "Reload Flow",
          severity: "secondary",
          text: "",
          onClick: f
        })
      ])) : T("", !0),
      o.value ? (n(), m("wc-workflow-picker", {
        key: 2,
        schema: c(u),
        config: x.value,
        title: e.modelValue?.id,
        onChange: w
      }, null, 40, zd)) : (n(), m("p", qd, [
        I[2] || (I[2] = q("Published Flow picker unavailable.", -1)),
        k(c(te), {
          label: "Reload Flow picker",
          text: "",
          severity: "secondary",
          onClick: g
        })
      ])),
      s.value ? (n(), m("label", Wd, [
        I[3] || (I[3] = q(" Published version ", -1)),
        r("select", {
          class: "p-inputtext work-flow-version",
          value: i.value ? "" : e.modelValue?.version,
          "aria-busy": p.value,
          disabled: p.value || !!h.value,
          onChange: I[0] || (I[0] = (B) => V(Number(B.target.value)))
        }, [
          r("option", Kd, D(p.value ? "Loading versions…" : "Choose a published version"), 1),
          (n(!0), m(_, null, ce(v.value, (B) => (n(), m("option", {
            key: B.version,
            value: B.version
          }, "v" + D(B.version), 9, Hd))), 128))
        ], 40, Gd)
      ])) : T("", !0),
      i.value ? (n(), m("p", Yd, "Choose a published version to finish selecting the Flow.")) : T("", !0),
      e.modelValue || i.value ? (n(), H(c(te), {
        key: 6,
        label: i.value ? "Cancel Flow selection" : "Remove Flow binding",
        "aria-label": i.value ? "Cancel Flow selection" : "Remove Flow binding",
        severity: "secondary",
        text: "",
        onClick: I[1] || (I[1] = (B) => i.value ? (i.value = !1, d.value = "") : $())
      }, null, 8, ["label", "aria-label"])) : T("", !0)
    ]));
  }
}), Rl = { seconds: 1, minutes: 60, hours: 3600, days: 86400 };
function ua(e, a) {
  const t = /^P(\d+)W$/.exec(e), l = /^P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+\.?\d*)S)?)?$/.exec(e);
  if (!t && (!l || e === "P" || e.endsWith("T"))) return;
  const o = t ? Number(t[1]) * 604800 : Number(l[1] ?? 0) * 86400 + Number(l[2] ?? 0) * 3600 + Number(l[3] ?? 0) * 60 + Number(l[4] ?? 0);
  if (!Number.isFinite(o) || o <= 0) return;
  const d = a ?? (o % 86400 === 0 ? "days" : o % 3600 === 0 ? "hours" : o < 60 ? "seconds" : "minutes");
  return { amount: o / Rl[d], unit: d };
}
function Jd(e, a) {
  if (e == null) return;
  if (!Number.isFinite(e * Rl[a]) || e <= 0) throw new Error("Enter a positive duration.");
  const t = (o) => o.toLocaleString("en-US", { useGrouping: !1, maximumSignificantDigits: 21 });
  if (!Number.isInteger(e)) return `PT${t(e * Rl[a])}S`;
  const l = { seconds: "S", minutes: "M", hours: "H", days: "D" }[a];
  return (a === "days" ? "P" : "PT") + t(e) + l;
}
const Zd = { class: "work-stack work-tight" }, Qd = {
  key: 0,
  class: "work-error",
  role: "alert"
}, Bt = /* @__PURE__ */ Ve({
  __name: "DurationControl",
  props: {
    modelValue: {},
    label: {},
    disabled: { type: Boolean }
  },
  emits: ["update:modelValue", "validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = "duration:" + qt(), d = j(), v = j(""), p = z(() => t.modelValue ? ua(t.modelValue) : void 0), h = z(() => d.value ?? p.value?.unit ?? "days");
    Se(() => t.modelValue, (V) => {
      v.value = "", l("validity", !V || !!p.value, o);
    }, { immediate: !0 });
    const i = z(() => t.modelValue ? ua(t.modelValue, h.value)?.amount ?? null : null);
    function s(V) {
      try {
        const $ = Jd(V, h.value);
        v.value = "", l("update:modelValue", $), l("validity", !0, o);
      } catch ($) {
        v.value = $.message, l("validity", !1, o);
      }
    }
    let u;
    function x(V) {
      V.target instanceof HTMLInputElement && (u = V.target.value);
    }
    function y(V) {
      if (u === void 0) return;
      const $ = u;
      u = void 0, f(V, $);
    }
    function g(V) {
      u = void 0;
      const $ = V.originalEvent?.target instanceof HTMLInputElement ? V.originalEvent.target.value : V.formattedValue;
      f(V.value, $);
    }
    function f(V, $) {
      if ($.trim() && (typeof V != "number" || !Number.isFinite(V))) {
        v.value = "Enter a positive duration.", l("validity", !1, o);
        return;
      }
      d.value = h.value, s(typeof V == "number" ? V : null);
    }
    function w(V) {
      const $ = i.value;
      d.value = V, !(t.modelValue && !p.value) && s($);
    }
    return $t(() => l("validity", !0, o)), (V, $) => (n(), m("label", Zd, [
      q(D(e.label), 1),
      r("span", {
        class: "work-duration-control",
        style: { "max-width": "360px" },
        onInputCapture: x
      }, [
        k(c(yt), {
          "model-value": i.value,
          "aria-label": e.label,
          min: 0,
          "aria-invalid": !!v.value || !!e.modelValue && !c(ua)(e.modelValue),
          disabled: e.disabled,
          useGrouping: !1,
          "max-fraction-digits": h.value === "seconds" ? 20 : 3,
          onInput: g,
          "onUpdate:modelValue": y
        }, null, 8, ["model-value", "aria-label", "aria-invalid", "disabled", "max-fraction-digits"]),
        k(c(me), {
          "model-value": h.value,
          "aria-label": e.label + " unit",
          disabled: e.disabled,
          options: [{ label: "Seconds", value: "seconds" }, { label: "Minutes", value: "minutes" }, { label: "Hours", value: "hours" }, { label: "Days", value: "days" }],
          optionLabel: "label",
          optionValue: "value",
          appendTo: "self",
          "onUpdate:modelValue": $[0] || ($[0] = (S) => w(S))
        }, null, 8, ["model-value", "aria-label", "disabled"])
      ], 32),
      v.value || e.modelValue && !c(ua)(e.modelValue) ? (n(), m("span", Qd, D(v.value || `Unsupported duration: ${e.modelValue}`), 1)) : T("", !0)
    ]));
  }
}), _d = { class: "work-stack" }, eu = { class: "work-settings-grid" }, tu = { class: "work-stack work-tight" }, au = { class: "work-stack work-tight" }, lu = {
  key: 1,
  class: "work-stack work-tight"
}, ou = { class: "work-stack work-tight" }, iu = { class: "work-settings-grid" }, nu = { class: "work-row" }, su = { class: "work-stack work-tight" }, ru = {
  key: 0,
  class: "work-stack work-tight"
}, du = /* @__PURE__ */ Ve({
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
      i.push({ id: Xt("timer", i), after: "P1D", then: { emit: "reminder" } });
    }
    function v(i, s) {
      delete i.after, delete i.at_field, s === "after" ? i.after = "P1D" : i.at_field = "";
    }
    function p(i, s, u) {
      u ? i[s] = u : (delete i[s], delete i.table);
    }
    function h(i, s) {
      i.then = s === "emit" ? { emit: "" } : { transition: "" };
    }
    return (i, s) => (n(), m("section", _d, [
      s[8] || (s[8] = r("h4", null, "Timers", -1)),
      (n(!0), m(_, null, ce(o(), (u, x) => (n(), m("article", {
        key: u.id,
        class: "work-settings-card work-stack"
      }, [
        r("div", eu, [
          r("label", tu, [
            s[2] || (s[2] = q("Timer ID", -1)),
            k(c(Ie), {
              modelValue: u.id,
              "onUpdate:modelValue": (y) => u.id = y,
              required: "",
              pattern: "[a-z][a-z0-9_]*"
            }, null, 8, ["modelValue", "onUpdate:modelValue"])
          ]),
          r("label", au, [
            s[3] || (s[3] = q("Deadline", -1)),
            k(c(me), {
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
          u.after !== void 0 ? (n(), H(Bt, {
            key: 0,
            modelValue: u.after,
            "onUpdate:modelValue": (y) => u.after = y,
            label: "After",
            onValidity: s[0] || (s[0] = (y, g) => l("validity", g, y))
          }, null, 8, ["modelValue", "onUpdate:modelValue"])) : (n(), m("label", lu, [
            s[4] || (s[4] = q("At field", -1)),
            k(c(me), {
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
          r("label", ou, [
            s[5] || (s[5] = q("Duration by field", -1)),
            k(c(me), {
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
        u.by ? (n(), H(Ut, {
          key: 0,
          label: "Duration table",
          hint: "Map field values to ISO durations.",
          "model-value": u.table,
          shape: "object",
          "onUpdate:modelValue": (y) => u.table = y,
          onValidity: (y) => l("validity", "table-" + x, y)
        }, null, 8, ["model-value", "onUpdate:modelValue", "onValidity"])) : T("", !0),
        r("div", iu, [
          k(Bt, {
            modelValue: u.repeat,
            "onUpdate:modelValue": (y) => u.repeat = y,
            label: "Repeat every",
            onValidity: s[1] || (s[1] = (y, g) => l("validity", g, y)),
            disabled: u.interrupting
          }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"]),
          r("label", nu, [
            k(c(zt), {
              modelValue: u.interrupting,
              "onUpdate:modelValue": [(y) => u.interrupting = y, (y) => u.interrupting && delete u.repeat],
              binary: ""
            }, null, 8, ["modelValue", "onUpdate:modelValue"]),
            s[6] || (s[6] = q("Interrupting", -1))
          ]),
          r("label", su, [
            s[7] || (s[7] = q("Then", -1)),
            k(c(me), {
              "model-value": u.then?.transition !== void 0 ? "transition" : "emit",
              "onUpdate:modelValue": (y) => h(u, y),
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
          u.then ? (n(), m("label", ru, [
            q(D(u.then.transition !== void 0 ? "Transition ID" : "Event name"), 1),
            u.then.transition !== void 0 ? (n(), H(c(Ie), {
              key: 0,
              modelValue: u.then.transition,
              "onUpdate:modelValue": (y) => u.then.transition = y
            }, null, 8, ["modelValue", "onUpdate:modelValue"])) : (n(), H(c(Ie), {
              key: 1,
              modelValue: u.then.emit,
              "onUpdate:modelValue": (y) => u.then.emit = y
            }, null, 8, ["modelValue", "onUpdate:modelValue"]))
          ])) : T("", !0)
        ]),
        k(c(te), {
          severity: "secondary",
          onClick: (y) => o().splice(x, 1),
          "aria-label": "Remove timer",
          text: "",
          size: "small"
        }, {
          default: W(() => [
            k(c(pe), {
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
        icon: W(() => [
          k(c(pe), {
            icon: "tabler:plus",
            "aria-hidden": "true"
          })
        ]),
        _: 1
      })
    ]));
  }
}), uu = ["aria-label"], cu = { class: "work-stack work-tight" }, vu = {
  key: 0,
  class: "work-stack work-tight"
}, fu = /* @__PURE__ */ Ve({
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
    function v(h) {
      l("update:modelValue", h === "field" ? { field: "" } : h === "group" ? { group: "" } : []);
    }
    function p(h) {
      l("update:modelValue", o.value === "group" ? { group: h.at(-1)?.id ?? "" } : h);
    }
    return $o(() => l("validity", Array.isArray(t.modelValue) ? t.modelValue.length > 0 : "field" in t.modelValue ? !!t.modelValue.field : !!t.modelValue.group)), $t(() => l("validity", !0)), (h, i) => (n(), m("section", {
      class: "work-stack work-tight",
      "aria-label": e.label
    }, [
      r("label", cu, [
        q(D(e.label) + " source", 1),
        k(c(me), {
          "model-value": o.value,
          "aria-label": e.label + " source",
          options: [{ label: "Group", value: "group" }, { label: "People and groups", value: "principals" }, { label: "Principal field", value: "field" }],
          optionLabel: "label",
          optionValue: "value",
          appendTo: "self",
          "onUpdate:modelValue": v
        }, null, 8, ["model-value", "aria-label"])
      ]),
      "field" in e.modelValue ? (n(), m("label", vu, [
        i[1] || (i[1] = q("Principal field", -1)),
        k(c(me), {
          "model-value": e.modelValue.field,
          "aria-label": e.label + " field",
          options: e.draft.fields?.filter((s) => s.type === "principal").map((s) => ({ label: s.title || s.code, value: s.code })) ?? [],
          optionLabel: "label",
          optionValue: "value",
          appendTo: "self",
          "onUpdate:modelValue": i[0] || (i[0] = (s) => l("update:modelValue", { field: s }))
        }, null, 8, ["model-value", "aria-label", "options"])
      ])) : (n(), H(Ll, {
        key: 1,
        "board-id": e.boardId,
        label: e.label,
        kinds: o.value === "group" ? "group" : "user,group,service",
        "model-value": d.value,
        "onUpdate:modelValue": p
      }, null, 8, ["board-id", "label", "kinds", "model-value"]))
    ], 8, uu));
  }
}), mu = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, pu = {
  class: "work-stack work-tight",
  "aria-label": "Approval sources"
}, bu = { class: "work-stack work-tight" }, gu = {
  key: 0,
  class: "work-stack work-tight"
}, hu = ["kinds", "placeholder", "value"], yu = {
  key: 2,
  class: "work-muted work-small",
  role: "status"
}, ku = {
  key: 3,
  class: "work-chips"
}, wu = {
  key: 4,
  class: "work-error work-small",
  role: "alert"
}, $u = {
  key: 5,
  class: "work-muted work-small"
}, Vu = { class: "work-row" }, xu = { class: "work-row work-small" }, Cu = /* @__PURE__ */ Ve({
  __name: "ApproversEditor",
  props: {
    approvals: {},
    boardId: {}
  },
  emits: ["validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, { principalLabel: o, rememberPrincipal: d, nameError: v } = xo(() => t.boardId ?? "", () => {
      const f = t.approvals.from;
      return Array.isArray(f) ? Vi(f) : "group" in f && f.group ? [{ kind: "group", id: f.group }] : [];
    }), p = j(), h = z(() => Array.isArray(t.approvals.from) ? "principals" : "field" in t.approvals.from ? "field" : "group"), i = z(() => {
      const f = t.approvals.from;
      return "group" in f && f.group ? JSON.stringify({ type: "group", principal_id: f.group }) : "{}";
    }), s = [
      { label: "Group members", value: "group" },
      { label: "People and groups", value: "principals" },
      { label: "Principal field", value: "field" }
    ], u = z(() => Array.isArray(t.approvals.from) ? t.approvals.from.some((f) => f.kind === "group") || t.approvals.from.length >= t.approvals.min : "field" in t.approvals.from ? !!t.approvals.from.field : !!t.approvals.from.group);
    $o(() => l("validity", Number.isSafeInteger(t.approvals.min) && t.approvals.min > 0 && u.value)), $t(() => l("validity", !0)), ya(async () => {
      p.value = await Et("wc-principal-picker");
    });
    function x(f) {
      t.approvals.from = f === "group" ? { group: "" } : f === "field" ? { field: "" } : [];
    }
    function y(f) {
      const w = f.detail, V = w?.principal_id ?? w?.id;
      if (h.value === "group") {
        t.approvals.from = { group: V ?? "" };
        return;
      }
      if (!V || !Array.isArray(t.approvals.from)) return;
      const $ = { kind: w.type ?? w.kind ?? "user", id: V };
      w.label && d($, w.label), t.approvals.from.some((S) => S.id === V && S.kind === $.kind) || t.approvals.from.push($);
    }
    function g(f) {
      Array.isArray(t.approvals.from) && t.approvals.from.splice(f, 1);
    }
    return (f, w) => (n(), m(_, null, [
      c(v) ? (n(), m("p", mu, D(c(v)), 1)) : T("", !0),
      r("section", pu, [
        r("label", bu, [
          w[4] || (w[4] = q("Approval source ", -1)),
          k(c(me), {
            "model-value": h.value,
            "aria-label": "Approval source",
            "onUpdate:modelValue": w[0] || (w[0] = (V) => x(V)),
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            options: s
          }, null, 8, ["model-value"])
        ]),
        "field" in e.approvals.from ? (n(), m("label", gu, [
          w[5] || (w[5] = q("Principal field", -1)),
          k(c(Ie), {
            modelValue: e.approvals.from.field,
            "onUpdate:modelValue": w[1] || (w[1] = (V) => e.approvals.from.field = V),
            "aria-label": "Principal field"
          }, null, 8, ["modelValue"])
        ])) : p.value ? (n(), m("wc-principal-picker", {
          key: h.value,
          kinds: h.value === "group" ? "group" : "user,group",
          placeholder: h.value === "group" ? "Select a group…" : "Select a person or group…",
          value: i.value,
          onConfigChanged: y
        }, null, 40, hu)) : (n(), m("p", yu, D(p.value === !1 ? "The principal picker is unavailable." : "Loading approver picker…"), 1)),
        Array.isArray(e.approvals.from) ? (n(), m("div", ku, [
          (n(!0), m(_, null, ce(e.approvals.from, (V, $) => (n(), H(c(tt), {
            key: V.kind + ":" + V.id,
            class: "kx-tag-sm",
            severity: "secondary"
          }, {
            default: W(() => [
              q(D(c(o)(V)), 1),
              k(c(te), {
                "aria-label": "Remove approver " + ($ + 1),
                text: "",
                severity: "secondary",
                size: "small",
                onClick: (S) => g($)
              }, {
                default: W(() => [
                  k(c(pe), {
                    icon: "tabler:x",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["aria-label", "onClick"])
            ]),
            _: 2
          }, 1024))), 128))
        ])) : T("", !0),
        Array.isArray(e.approvals.from) && !u.value ? (n(), m("p", wu, "Select at least " + D(e.approvals.min) + " distinct principals, or lower the minimum.", 1)) : "group" in e.approvals.from && !e.approvals.from.group ? (n(), m("p", $u, "Choose the group that can approve this state.")) : T("", !0),
        r("label", Vu, [
          w[6] || (w[6] = r("span", { class: "work-spacer" }, "Approvals needed", -1)),
          k(c(yt), {
            modelValue: e.approvals.min,
            "onUpdate:modelValue": w[2] || (w[2] = (V) => e.approvals.min = V),
            min: 1,
            required: "",
            useGrouping: !1
          }, null, 8, ["modelValue"])
        ]),
        r("label", xu, [
          w[7] || (w[7] = r("span", { class: "work-spacer" }, "The person who moves the item here cannot approve this visit", -1)),
          k(c(et), {
            modelValue: e.approvals.prevent_self,
            "onUpdate:modelValue": w[3] || (w[3] = (V) => e.approvals.prevent_self = V),
            "aria-label": "The person who moves the item here cannot approve this visit"
          }, null, 8, ["modelValue"])
        ])
      ])
    ], 64));
  }
}), Su = {
  class: "work-state-settings work-stack",
  "aria-label": "State settings"
}, Tu = { class: "work-process-kind" }, Iu = { class: "work-stack" }, Du = { class: "work-row" }, Eu = { class: "work-row" }, Uu = { class: "work-row" }, Au = { class: "work-stack work-tight" }, Ru = { class: "work-row" }, Pu = { class: "work-stack work-tight" }, Ou = { class: "work-row" }, Nu = { class: "work-row" }, Mu = { class: "work-stack work-tight" }, Fu = { class: "work-stack" }, Lu = { class: "work-row" }, Bu = { class: "work-row" }, ju = { class: "work-stack work-tight" }, zu = { class: "work-stack work-tight" }, qu = {
  key: 0,
  class: "work-row"
}, Wu = { class: "work-stack" }, Gu = { class: "work-stack work-tight" }, Ku = { class: "work-row" }, Hu = /* @__PURE__ */ Ve({
  __name: "StateSettings",
  props: {
    state: {},
    process: {},
    draft: {},
    boardId: {}
  },
  emits: ["validity", "kind"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = z(() => (t.process.transitions ?? []).filter((h) => h.from === "any" || h.from.includes(t.state.id))), d = [{ value: "human", icon: "user" }, { value: "gate", icon: "shield-check" }, { value: "automated", icon: "bolt" }, { value: "parallel", icon: "arrows-split" }];
    function v(h) {
      const i = t.state;
      i.kind = h, delete i.run, delete i.release_when, delete i.regions, delete i.join, delete i.due, (h === "automated" || h === "gate") && delete i.awaiting, h === "automated" && (i.run = { stage: i.id, retry: { max: 1, backoff: "PT1M" } }), h === "gate" && (i.release_when = { approvals: { min: 1, from: { group: "" }, prevent_self: !0 } }), h === "parallel" && (i.regions = [{ id: "region_1", initial: t.process.states.find((s) => s.id !== i.id)?.id ?? "" }], i.join = "all"), l("kind", h);
    }
    function p(h) {
      t.state.run && (h ? t.state.run.on_fail = h : delete t.state.run.on_fail);
    }
    return (h, i) => (n(), m("section", Su, [
      i[57] || (i[57] = r("h4", { class: "work-process-group" }, "Who moves the item on", -1)),
      k(c(Nl), {
        class: "work-process-kinds",
        "model-value": e.state.kind ?? "human",
        options: d.map((s) => ({
          ...s,
          label: c(La)(s.value)
        })),
        optionLabel: "label",
        optionValue: "value",
        optionDisabled: "disabled",
        "allow-empty": !1,
        "aria-label": "Who moves the item on",
        "onUpdate:modelValue": v
      }, {
        option: W(({ option: s }) => [
          r("span", Tu, [
            k(c(pe), {
              icon: "tabler:" + s.icon
            }, null, 8, ["icon"]),
            r("span", null, D(s.label), 1)
          ])
        ]),
        _: 1
      }, 8, ["model-value", "options"]),
      e.state.kind === "gate" && e.state.release_when ? (n(), m(_, { key: 0 }, [
        i[35] || (i[35] = r("h4", { class: "work-process-group" }, "Approval", -1)),
        e.state.release_when.approvals ? (n(), H(Cu, {
          key: 0,
          "board-id": e.boardId,
          approvals: e.state.release_when.approvals,
          onValidity: i[0] || (i[0] = (s) => l("validity", "approvers", s))
        }, null, 8, ["board-id", "approvals"])) : T("", !0),
        k(Ne, {
          class: "work-process-options",
          label: "Release options"
        }, {
          default: W(() => [
            r("div", Iu, [
              r("label", Du, [
                i[34] || (i[34] = r("span", { class: "work-spacer" }, "Require approvals", -1)),
                k(c(et), {
                  "model-value": !!e.state.release_when.approvals,
                  "aria-label": "Require approvals",
                  "onUpdate:modelValue": i[1] || (i[1] = (s) => e.state.release_when.approvals = s ? { min: 1, from: { group: "" }, prevent_self: !0 } : void 0)
                }, null, 8, ["model-value"])
              ]),
              k(Bt, {
                modelValue: e.state.release_when.wait,
                "onUpdate:modelValue": i[2] || (i[2] = (s) => e.state.release_when.wait = s),
                label: "Wait before release",
                onValidity: i[3] || (i[3] = (s, u) => l("validity", u, s))
              }, null, 8, ["modelValue"]),
              k(Fl, {
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
      ], 64)) : T("", !0),
      i[58] || (i[58] = r("h4", { class: "work-process-group" }, "Limit", -1)),
      r("label", Eu, [
        i[36] || (i[36] = r("span", { class: "work-spacer" }, "Items allowed here", -1)),
        k(fo, {
          draft: e.draft,
          state: e.state.id,
          label: "Items allowed here"
        }, null, 8, ["draft", "state"])
      ]),
      r("label", Uu, [
        i[37] || (i[37] = r("span", { class: "work-spacer" }, [
          q("Refuse moves over the limit"),
          r("small", { class: "work-muted work-block" }, "Off only warns")
        ], -1)),
        k(fo, {
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
      !e.state.kind || e.state.kind === "human" ? (n(), H(Bt, {
        key: 1,
        modelValue: e.state.due,
        "onUpdate:modelValue": i[7] || (i[7] = (s) => e.state.due = s),
        label: "Time allowed in this state",
        onValidity: i[8] || (i[8] = (s, u) => l("validity", u, s))
      }, null, 8, ["modelValue"])) : T("", !0),
      e.state.kind === "automated" && e.state.run ? (n(), m(_, { key: 2 }, [
        i[46] || (i[46] = r("h4", { class: "work-process-group" }, "Automation", -1)),
        r("label", Au, [
          i[38] || (i[38] = q("Run label", -1)),
          k(c(Ie), {
            modelValue: e.state.run.stage,
            "onUpdate:modelValue": i[9] || (i[9] = (s) => e.state.run.stage = s),
            "aria-label": "Run label",
            required: ""
          }, null, 8, ["modelValue"])
        ]),
        k(Xd, {
          modelValue: e.state.run.flow_ref,
          "onUpdate:modelValue": i[10] || (i[10] = (s) => e.state.run.flow_ref = s),
          onValidity: i[11] || (i[11] = (s) => l("validity", "flow", s))
        }, null, 8, ["modelValue"]),
        k(Bt, {
          modelValue: e.state.run.timeout,
          "onUpdate:modelValue": i[12] || (i[12] = (s) => e.state.run.timeout = s),
          label: "Attempt timeout",
          onValidity: i[13] || (i[13] = (s, u) => l("validity", u, s))
        }, null, 8, ["modelValue"]),
        i[47] || (i[47] = r("small", { class: "work-muted" }, "Blank uses the board timeout, or one hour.", -1)),
        r("label", Ru, [
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
        r("label", Pu, [
          i[40] || (i[40] = q("When visits are exhausted", -1)),
          k(c(me), {
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
        r("label", Ou, [
          i[41] || (i[41] = r("span", { class: "work-spacer" }, "Retry if it fails", -1)),
          k(c(et), {
            "model-value": !!e.state.run.retry,
            "aria-label": "Retry if it fails",
            "onUpdate:modelValue": i[16] || (i[16] = (s) => e.state.run.retry = s ? { max: 1, backoff: "PT1M" } : void 0)
          }, null, 8, ["model-value"])
        ]),
        e.state.run.retry ? (n(), m(_, { key: 0 }, [
          r("label", Nu, [
            i[42] || (i[42] = r("span", { class: "work-spacer" }, "Maximum attempts", -1)),
            k(c(yt), {
              modelValue: e.state.run.retry.max,
              "onUpdate:modelValue": i[17] || (i[17] = (s) => e.state.run.retry.max = s),
              min: 1,
              useGrouping: !1
            }, null, 8, ["modelValue"])
          ]),
          k(Bt, {
            modelValue: e.state.run.retry.backoff,
            "onUpdate:modelValue": i[18] || (i[18] = (s) => e.state.run.retry.backoff = s),
            label: "Wait between attempts",
            onValidity: i[19] || (i[19] = (s, u) => l("validity", u, s))
          }, null, 8, ["modelValue"])
        ], 64)) : T("", !0),
        (n(), m(_, null, ce([{ key: "on_pass", label: "On success" }, { key: "on_cancel", label: "On cancellation" }], (s) => r("label", {
          key: s.key,
          class: "work-stack work-tight"
        }, [
          q(D(s.label), 1),
          k(c(me), {
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
        r("label", Mu, [
          i[43] || (i[43] = q("If it fails, go to", -1)),
          k(c(me), {
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
          default: W(() => [
            r("div", Fu, [
              i[45] || (i[45] = r("p", { class: "work-muted" }, "These values apply to automated states without their own limit.", -1)),
              k(Bt, {
                "model-value": e.draft.policy?.stage_timeout,
                label: "Default attempt timeout",
                "onUpdate:modelValue": i[20] || (i[20] = (s) => (e.draft.policy ??= {}).stage_timeout = s),
                onValidity: i[21] || (i[21] = (s, u) => l("validity", u, s))
              }, null, 8, ["model-value"]),
              r("label", Lu, [
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
      ], 64)) : T("", !0),
      e.state.kind === "parallel" && e.state.regions ? (n(), m(_, { key: 3 }, [
        i[53] || (i[53] = r("h4", { class: "work-process-group" }, "Lanes", -1)),
        (n(!0), m(_, null, ce(e.state.regions, (s, u) => (n(), m("div", {
          key: u,
          class: "work-process-value work-stack work-tight"
        }, [
          r("div", Bu, [
            r("span", null, "Lane " + D(u + 1), 1),
            i[49] || (i[49] = r("span", { class: "work-spacer" }, null, -1)),
            k(c(te), {
              severity: "danger",
              text: "",
              size: "small",
              "aria-label": "Remove lane",
              onClick: (x) => e.state.regions.splice(u, 1)
            }, {
              default: W(() => [
                k(c(pe), { icon: "tabler:trash" })
              ]),
              _: 1
            }, 8, ["onClick"])
          ]),
          r("label", ju, [
            i[50] || (i[50] = q("Starts at", -1)),
            k(c(me), {
              "aria-label": "Lane starts at",
              modelValue: s.initial,
              "onUpdate:modelValue": (x) => s.initial = x,
              appendTo: "self",
              optionLabel: "label",
              optionValue: "value",
              options: e.process.states.filter((x) => x.id !== e.state.id).map((x) => ({ label: c(ge)(x), value: x.id }))
            }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
          ])
        ]))), 128)),
        k(c(te), {
          label: "Add lane",
          severity: "secondary",
          outlined: "",
          size: "small",
          onClick: i[23] || (i[23] = (s) => e.state.regions.push({
            id: c(Xt)("region", e.state.regions),
            initial: e.process.states.find((u) => u.id !== e.state.id)?.id ?? ""
          }))
        }, {
          icon: W(() => [
            k(c(pe), { icon: "tabler:plus" })
          ]),
          _: 1
        }),
        r("label", zu, [
          i[51] || (i[51] = q("Finish rule", -1)),
          k(c(me), {
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
        typeof e.state.join == "number" ? (n(), m("label", qu, [
          i[52] || (i[52] = r("span", { class: "work-spacer" }, "Lanes needed", -1)),
          k(c(yt), {
            modelValue: e.state.join,
            "onUpdate:modelValue": i[25] || (i[25] = (s) => e.state.join = s),
            min: 1,
            max: e.state.regions.length,
            useGrouping: !1
          }, null, 8, ["modelValue", "max"])
        ])) : T("", !0)
      ], 64)) : T("", !0),
      k(Ne, {
        class: "work-disclosure",
        label: "Advanced state settings"
      }, {
        default: W(() => [
          r("div", Wu, [
            i[56] || (i[56] = r("h4", { class: "work-process-group" }, "Assignment and conditions", -1)),
            r("label", Gu, [
              i[54] || (i[54] = q("Stage label", -1)),
              k(c(Ie), {
                "model-value": e.state.stage,
                "aria-label": "Stage label",
                "onUpdate:modelValue": i[26] || (i[26] = (s) => e.state.stage = s || void 0)
              }, null, 8, ["model-value"])
            ]),
            !e.state.kind || e.state.kind === "human" || e.state.kind === "parallel" ? (n(), m(_, { key: 0 }, [
              r("label", Ku, [
                k(c(et), {
                  "model-value": !!e.state.awaiting,
                  "aria-label": "Awaiting people",
                  "onUpdate:modelValue": i[27] || (i[27] = (s) => e.state.awaiting = s ? { group: "" } : void 0)
                }, null, 8, ["model-value"]),
                i[55] || (i[55] = q("Awaiting people", -1))
              ]),
              e.state.awaiting ? (n(), H(fu, {
                key: 0,
                modelValue: e.state.awaiting,
                "onUpdate:modelValue": i[28] || (i[28] = (s) => e.state.awaiting = s),
                draft: e.draft,
                "board-id": e.boardId,
                label: "Awaiting",
                onValidity: i[29] || (i[29] = (s) => l("validity", "awaiting", s))
              }, null, 8, ["modelValue", "draft", "board-id"])) : T("", !0)
            ], 64)) : T("", !0),
            k(Ll, {
              "board-id": e.boardId,
              modelValue: e.state.assign,
              "onUpdate:modelValue": i[30] || (i[30] = (s) => e.state.assign = s),
              label: "Assign to"
            }, null, 8, ["board-id", "modelValue"]),
            k(Ut, {
              label: "State checks",
              example: ["installed-check"],
              "model-value": e.state.invariants,
              shape: "array",
              "onUpdate:modelValue": i[31] || (i[31] = (s) => e.state.invariants = s),
              onValidity: i[32] || (i[32] = (s) => l("validity", "invariants", s))
            }, null, 8, ["model-value"]),
            k(du, {
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
}), Yu = { class: "work-stack work-transition-settings" }, Xu = { class: "work-stack work-tight" }, Ju = { class: "work-row" }, Zu = { key: 0 }, Qu = { class: "work-stack" }, _u = { class: "work-row" }, ec = { class: "work-row" }, tc = { class: "work-stack work-tight" }, ac = { class: "work-row" }, lc = { class: "work-stack work-tight" }, oc = { class: "work-stack work-tight" }, ic = /* @__PURE__ */ Ve({
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
    function h(i) {
      if (i !== void 0 && (!Array.isArray(i) || !i.every((s) => typeof s == "string")))
        return "Enter guard IDs as strings.";
      t.transition.guards = i;
    }
    return (i, s) => (n(), m("div", Yu, [
      r("label", Xu, [
        s[13] || (s[13] = q("To state", -1)),
        k(c(me), {
          modelValue: e.transition.to,
          "onUpdate:modelValue": s[0] || (s[0] = (u) => e.transition.to = u),
          "aria-label": "To state",
          appendTo: "self",
          optionLabel: "label",
          optionValue: "value",
          options: e.process.states.map((u) => ({ label: c(ge)(u), value: u.id }))
        }, null, 8, ["modelValue", "options"])
      ]),
      r("label", Ju, [
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
      }, null, 8, ["options", "modelValue"])) : T("", !0),
      s[22] || (s[22] = r("h4", { class: "work-process-group" }, "Must be filled", -1)),
      k(st, {
        label: "Required fields",
        options: e.draft.fields?.map((u) => ({ value: u.code, label: u.title || u.code })) ?? [],
        modelValue: e.transition.require,
        "onUpdate:modelValue": s[3] || (s[3] = (u) => e.transition.require = u)
      }, null, 8, ["options", "modelValue"]),
      s[23] || (s[23] = r("h4", { class: "work-process-group" }, "Only when", -1)),
      k(Fl, {
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
        options: [...(e.guards ?? []).map((u) => ({ value: u.id, label: u.title })), ...(e.transition.guards ?? []).filter((u) => !e.guards?.some((x) => x.id === u)).map((u) => ({ value: u, label: e.guards ? "Unavailable check" : "Configured check" }))],
        modelValue: e.transition.guards,
        "onUpdate:modelValue": s[6] || (s[6] = (u) => e.transition.guards = u)
      }, null, 8, ["options", "modelValue"])) : T("", !0),
      (n(!0), m(_, null, ce(e.guards?.filter((u) => e.transition.guards?.includes(u.id)) ?? [], (u) => (n(), m("p", {
        key: u.id,
        class: "work-muted work-small"
      }, [
        q(D(u.description || u.title + " can stop this transition.") + " ", 1),
        u.reads?.length ? (n(), m("span", Zu, " Checks " + D(u.reads.map((x) => e.draft.fields?.find((y) => y.code === x)?.title || "a configured field").join(", ")) + ".", 1)) : T("", !0)
      ]))), 128)),
      k(Ne, {
        class: "work-disclosure",
        label: "Advanced transition settings"
      }, {
        default: W(() => [
          r("div", Qu, [
            r("label", _u, [
              s[15] || (s[15] = r("span", { class: "work-spacer" }, "Happens automatically", -1)),
              k(c(et), {
                "model-value": e.transition.auto,
                "onUpdate:modelValue": s[7] || (s[7] = (u) => {
                  e.transition.auto = u, u || delete e.transition.default;
                }),
                "aria-label": "Automatic transition"
              }, null, 8, ["model-value"])
            ]),
            r("label", ec, [
              s[16] || (s[16] = r("span", { class: "work-spacer" }, "Default automatic transition", -1)),
              k(c(et), {
                modelValue: e.transition.default,
                "onUpdate:modelValue": s[8] || (s[8] = (u) => e.transition.default = u),
                disabled: !e.transition.auto,
                "aria-label": "Default transition"
              }, null, 8, ["modelValue", "disabled"])
            ]),
            s[21] || (s[21] = r("h4", { class: "work-process-group" }, "Also sets", -1)),
            (n(!0), m(_, null, ce(e.transition.set ?? [], (u, x) => (n(), m("div", {
              key: x,
              class: "work-process-value work-stack work-tight"
            }, [
              r("label", tc, [
                s[17] || (s[17] = q("Field", -1)),
                k(c(me), {
                  modelValue: u.field,
                  "onUpdate:modelValue": (y) => u.field = y,
                  appendTo: "self",
                  optionLabel: "label",
                  optionValue: "value",
                  options: e.draft.fields?.map((y) => ({ value: y.code, label: y.title || y.code })) ?? []
                }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
              ]),
              r("div", ac, [
                k(c(me), {
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
                  "onUpdate:modelValue": (y) => d(x, y)
                }, null, 8, ["model-value", "onUpdate:modelValue"]),
                k(c(te), {
                  text: "",
                  severity: "danger",
                  "aria-label": "Remove value " + (x + 1),
                  onClick: (y) => e.transition.set?.splice(x, 1)
                }, {
                  default: W(() => [
                    k(c(pe), { icon: "tabler:trash" })
                  ]),
                  _: 1
                }, 8, ["aria-label", "onClick"])
              ]),
              u.copy !== void 0 ? (n(), H(c(me), {
                key: 0,
                modelValue: u.copy,
                "onUpdate:modelValue": (y) => u.copy = y,
                "aria-label": "Copy from field",
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                options: e.draft.fields?.map((y) => ({ value: y.code, label: y.title || y.code })) ?? []
              }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])) : u.clear ? T("", !0) : (n(!0), m(_, { key: 1 }, ce(e.draft.fields?.filter((y) => y.code === u.field) ?? [], (y) => (n(), H(Ao, {
                key: y.code,
                "board-id": e.boardId ?? "",
                field: y,
                modelValue: u.value,
                "onUpdate:modelValue": (g) => u.value = g,
                onValidity: (g) => l("validity", "effect-" + x, g)
              }, null, 8, ["board-id", "field", "modelValue", "onUpdate:modelValue", "onValidity"]))), 128))
            ]))), 128)),
            k(c(te), {
              label: "Add value",
              severity: "secondary",
              outlined: "",
              size: "small",
              onClick: o
            }, {
              icon: W(() => [
                k(c(pe), { icon: "tabler:plus" })
              ]),
              _: 1
            }),
            r("label", lc, [
              s[18] || (s[18] = q("Offer to people", -1)),
              k(c(me), {
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
            r("label", oc, [
              s[20] || (s[20] = q("Evaluation order", -1)),
              k(c(yt), {
                "model-value": e.transition.order ?? null,
                "aria-label": "Transition order",
                min: 0,
                useGrouping: !1,
                "onUpdate:modelValue": s[10] || (s[10] = (u) => e.transition.order = u ?? void 0)
              }, null, 8, ["model-value"])
            ]),
            k(Ut, {
              label: "Set values",
              "model-value": e.transition.set,
              shape: "array",
              commit: p,
              onValidity: s[11] || (s[11] = (u) => l("validity", "set", u))
            }, null, 8, ["model-value"]),
            k(Ut, {
              label: "Guards",
              "model-value": e.transition.guards,
              shape: "array",
              commit: h,
              onValidity: s[12] || (s[12] = (u) => l("validity", "guards", u))
            }, null, 8, ["model-value"])
          ])
        ]),
        _: 1
      })
    ]));
  }
}), nc = ["aria-label", "aria-keyshortcuts", "onKeydown"], sc = { class: "work-row" }, rc = {
  key: 0,
  class: "work-stack work-tight"
}, dc = { class: "work-process-meaning" }, uc = {
  key: 1,
  class: "work-muted"
}, cc = { class: "work-stack work-tight" }, vc = { class: "work-next-transition work-stack work-tight" }, fc = { class: "work-row work-wrap" }, mc = { class: "work-process-inspector-foot" }, pc = { class: "work-row work-transition-actions" }, bc = { class: "work-process-meaning" }, gc = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, hc = { class: "work-stack work-tight" }, yc = /* @__PURE__ */ Ve({
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
    const l = e, o = t, d = j(), v = j(!1), p = j(!1), h = j("");
    let i;
    function s() {
      i = void 0, v.value = !1, p.value = !1, h.value = "";
    }
    async function u(w) {
      s(), i = w, await ht(), d.value && (d.value.scrollTop = 0, d.value.focus({ preventScroll: !0 }), (d.value.closest(".work-settings-shell")?.clientWidth ?? 1 / 0) <= 700 && d.value.scrollIntoView?.({ block: "nearest" }));
    }
    async function x() {
      const w = i;
      o("close"), await ht(), w?.isConnected ? w.focus() : o("focus-editor");
    }
    async function y() {
      v.value = !0, await ht(), d.value?.querySelector('[aria-label="State name"]')?.focus();
    }
    async function g(w) {
      h.value = "", p.value = w, await ht();
      const V = w ? '[role="combobox"]' : "button";
      d.value?.querySelector(".work-next-transition " + V)?.focus();
    }
    function f(w) {
      !l.selectedTransition || w.defaultPrevented || w.repeat || (w.preventDefault(), o("remove-transition", l.selectedTransition));
    }
    return a({ open: u, close: x, reset: s, editName: y, removeByShortcut: f }), (w, V) => (n(), H(ko, { name: "work-panel" }, {
      default: W(() => [
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
          (n(!0), m(_, null, ce(e.selectedState ? [e.selectedState] : [], ($) => (n(), m(_, {
            key: $.id
          }, [
            r("header", sc, [
              v.value ? (n(), H(c(Ie), {
                key: 1,
                modelValue: $.name,
                "onUpdate:modelValue": (S) => $.name = S,
                class: "work-process-name",
                "aria-label": "State name",
                onBlur: V[0] || (V[0] = (S) => v.value = !1)
              }, null, 8, ["modelValue", "onUpdate:modelValue"])) : (n(), H(Ml, {
                key: 0,
                class: "work-process-state-title",
                "aria-label": "Rename state",
                onActivate: y
              }, {
                default: W(() => [
                  r("span", null, D(c(ge)($)), 1)
                ]),
                _: 2
              }, 1024)),
              k(c(te), {
                severity: "secondary",
                text: "",
                size: "small",
                "aria-label": "Close state editor",
                onClick: x
              }, {
                default: W(() => [
                  k(c(pe), { icon: "tabler:x" })
                ]),
                _: 1
              })
            ]),
            e.insertedRoute ? (n(), m("div", rc, [
              V[4] || (V[4] = r("p", { class: "work-field-label" }, "New route", -1)),
              r("p", null, D(e.insertedRoute), 1)
            ])) : T("", !0),
            r("p", dc, D(c(xi)($, e.draft)), 1),
            e.processCounts ? (n(), m("p", uc, D(e.processCounts[$.id] ?? 0) + " " + D(e.processCounts[$.id] === 1 ? "item" : "items") + " currently here", 1)) : T("", !0),
            k(Hu, {
              state: $,
              process: e.process,
              draft: e.draft,
              "board-id": e.boardId,
              onKind: (S) => o("kind", $, S),
              onValidity: (S, I) => o("validity", S.includes("duration:") ? S : e.process.id + ":" + $.id + ":" + S, I)
            }, null, 8, ["state", "process", "draft", "board-id", "onKind", "onValidity"]),
            r("label", cc, [
              V[5] || (V[5] = q("Phase", -1)),
              k(c(me), {
                "aria-label": "Phase",
                modelValue: $.category,
                "onUpdate:modelValue": (S) => $.category = S,
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                options: ["triage", "backlog", ...c(Co)].map((S) => ({ label: c(At)(S), value: S }))
              }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
            ]),
            r("div", vc, [
              p.value ? (n(), m(_, { key: 1 }, [
                k(c(me), {
                  modelValue: h.value,
                  "onUpdate:modelValue": V[2] || (V[2] = (S) => h.value = S),
                  "aria-label": "Next state",
                  placeholder: "Choose the next state",
                  appendTo: "self",
                  optionLabel: "label",
                  optionValue: "value",
                  options: e.process.states.filter((S) => S !== $).map((S) => ({ label: c(ge)(S), value: S.id }))
                }, null, 8, ["modelValue", "options"]),
                r("div", fc, [
                  k(c(te), {
                    label: "Add transition",
                    size: "small",
                    disabled: !h.value,
                    onClick: (S) => o("connect", $.id, h.value, c(i))
                  }, null, 8, ["disabled", "onClick"]),
                  k(c(te), {
                    label: "Cancel",
                    severity: "secondary",
                    text: "",
                    size: "small",
                    onClick: V[3] || (V[3] = (S) => g(!1))
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
                onClick: V[1] || (V[1] = (S) => g(!0))
              }, {
                icon: W(() => [
                  k(c(pe), {
                    icon: "tabler:plus",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["disabled"]))
            ]),
            r("footer", mc, [
              k(c(te), {
                label: "Remove state",
                severity: "danger",
                text: "",
                size: "small",
                onClick: (S) => o("remove-state", $)
              }, {
                icon: W(() => [
                  k(c(pe), { icon: "tabler:trash" })
                ]),
                _: 1
              }, 8, ["onClick"])
            ])
          ], 64))), 128)),
          (n(!0), m(_, null, ce(e.selectedTransition ? [e.selectedTransition] : [], ($) => (n(), m(_, {
            key: $.id
          }, [
            r("header", pc, [
              V[6] || (V[6] = r("h3", null, "Transition", -1)),
              k(c(te), {
                type: "button",
                label: "Remove transition",
                severity: "danger",
                text: "",
                size: "small",
                onClick: (S) => o("remove-transition", $)
              }, {
                icon: W(() => [
                  k(c(pe), { icon: "tabler:trash" })
                ]),
                _: 1
              }, 8, ["onClick"]),
              k(c(te), {
                severity: "secondary",
                text: "",
                size: "small",
                "aria-label": "Close transition editor",
                onClick: x
              }, {
                default: W(() => [
                  k(c(pe), { icon: "tabler:x" })
                ]),
                _: 1
              })
            ]),
            r("p", bc, D($.from === "any" ? "Any state" : $.from.map((S) => c(ge)(e.process.states.find((I) => I.id === S))).join(", ")) + " → " + D(c(ge)(e.process.states.find((S) => S.id === $.to))), 1),
            k(Jo, {
              transition: $,
              process: e.process,
              draft: e.draft,
              guards: e.guards
            }, null, 8, ["transition", "process", "draft", "guards"]),
            e.error ? (n(), m("p", gc, D(e.error), 1)) : T("", !0),
            r("label", hc, [
              V[7] || (V[7] = q("Name", -1)),
              k(c(Ie), {
                modelValue: $.name,
                "onUpdate:modelValue": (S) => $.name = S,
                placeholder: c(ze)($),
                "aria-label": "Transition name"
              }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder"])
            ]),
            k(ic, {
              transition: $,
              process: e.process,
              draft: e.draft,
              "board-id": e.boardId,
              guards: e.guards,
              onValidity: (S, I) => o("validity", e.process.id + ":transition-" + $.id + ":" + S, I)
            }, null, 8, ["transition", "process", "draft", "board-id", "guards", "onValidity"])
          ], 64))), 128))
        ], 40, nc)) : T("", !0)
      ]),
      _: 1
    }));
  }
}), kc = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, wc = { key: 1 }, $c = { class: "work-muted" }, Vc = {
  key: 2,
  class: "work-map-zoom",
  role: "group",
  "aria-label": "Map zoom"
}, xc = { class: "work-stack" }, Cc = { class: "work-stack work-tight" }, Sc = {
  key: 0,
  class: "work-muted"
}, Tc = { class: "work-stack work-tight" }, Ic = { class: "work-dialog-actions" }, Dc = /* @__PURE__ */ Ve({
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
    const t = e, l = a, o = Ka(Ya, void 0), d = z(() => t.draft.processes ?? []), v = j(!1), p = j(""), h = j(""), i = j(""), s = j("Map");
    Se(() => t.createForItemType, (E, U) => {
      !E && !U || (p.value = "", v.value = !!E);
    }, { immediate: !0 });
    const u = j(), x = j(), y = j(), g = j(), f = j(), w = j(), V = /* @__PURE__ */ new WeakMap(), $ = z(() => d.value.find((E) => E.id === h.value) ?? d.value[0]), S = z(() => {
      const E = u.value, U = $.value, G = E && V.get(E);
      if (!E || !U || !G) return;
      const { entry: K, continuation: ve } = G;
      if (!U.transitions?.includes(K) || K.to !== E.id) return;
      const P = [
        K.from === "any" ? "Any state" : K.from.map((Z) => ge(U.states.find((N) => N.id === Z))).join(", "),
        ge(E)
      ];
      return ve && U.transitions.includes(ve) && (ve.from === "any" || ve.from.includes(E.id)) && P.push(ge(U.states.find((Z) => Z.id === ve.to))), P.join(" → ");
    }), I = j(!1);
    function B(E) {
      I.value = !0, s.value = E;
    }
    function le() {
      !I.value && g.value?.clientWidth && (s.value = g.value.clientWidth < 480 && ($.value?.states.length ?? 0) > 6 ? "List" : "Map");
    }
    let J;
    ya(() => {
      le(), g.value && typeof ResizeObserver < "u" && (J = new ResizeObserver(le), J.observe(g.value));
    }), $t(() => J?.disconnect()), Se($, () => {
      I.value = !1, le();
    });
    function se() {
      f.value?.reset(), u.value = void 0, x.value = void 0, i.value = "";
    }
    function ue() {
      const E = o?.selected.value;
      E?.startsWith("workflow/") && o?.choose("workflow", E.slice(9), !1), se();
    }
    function fe() {
      s.value === "Map" ? y.value?.focus() : w.value?.focus();
    }
    function be(E, U) {
      u.value = E, x.value = void 0, i.value = "", $.value && o?.choose("workflow", $.value.id + ".state." + E.id, !0), f.value?.open(U);
    }
    function oe(E, U) {
      x.value = E, u.value = void 0, i.value = "", $.value && o?.choose("workflow", $.value.id + ".transition." + E.id, !0), f.value?.open(U);
    }
    Se([$, s], se), Se([() => o?.selected.value, d], async ([E], U) => {
      if (!E?.startsWith("workflow/")) {
        U?.[0]?.startsWith("workflow/") && se();
        return;
      }
      const [G, K, ve] = E.slice(9).split("."), P = d.value.find((re) => re.id === G);
      if (!P || $.value !== P && (h.value = P.id, await ht(), o?.selected.value !== E))
        return;
      const Z = K === "state" ? P.states.find((re) => re.id === ve) : void 0, N = K === "transition" ? P.transitions?.find((re) => re.id === ve) : void 0;
      Z === u.value && N === x.value || (se(), u.value = Z, x.value = N);
    }, { immediate: !0, flush: "post" });
    const M = z(() => {
      if (!t.counts || !$.value) return;
      const E = t.countTypes?.filter((U) => U.process === $.value?.id) ?? [];
      return Object.fromEntries($.value.states.map((U) => [
        U.id,
        E.reduce((G, K) => G + (t.counts?.[K.id]?.[U.id] ?? 0), 0)
      ]));
    }), Q = z(() => (t.guards ?? []).filter((E) => t.draft.plugins?.some((U) => U.use === E.plugin))), F = z(() => Object.keys(t.draft.policy?.wip ?? {}).filter((E) => !d.value.some((U) => U.states.some((G) => G.id === E))));
    function ne() {
      const E = p.value.trim();
      if (!E) return;
      const U = E.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "") || "process", G = (/^[a-z]/.test(U) ? U : "process_" + U).slice(0, 40), K = d.value.some((ve) => ve.id === G) ? Xt(G, d.value) : G;
      (t.draft.processes ??= []).push({ id: K, name: E, initial: "todo", states: [{ id: "todo", name: "To do", category: "unstarted" }], transitions: [] }), h.value = K, p.value = "", v.value = !1, l("created", K);
    }
    function ke() {
      v.value = !1, l("cancel-creation");
    }
    async function X(E, U) {
      const G = { id: Xt("state", E.states), name: "New state", category: "started" }, K = Ra(E), ve = K.at(-1), P = u.value ?? (ve?.category === "completed" ? K.at(-2) : ve), Z = P ? E.states.indexOf(P) : -1, N = P ? Z + 1 : E.states.length, re = P && E.transitions?.filter((Ue) => Ue.from !== "any" && Ue.from.length === 1 && Ue.from[0] === P.id && !Ql(E, Ue).length), we = re?.find((Ue) => Ue.default) ?? re?.find((Ue) => E.states.findIndex((qe) => qe.id === Ue.to) > Z);
      E.states.splice(N, 0, G);
      const Ee = E.states[N];
      if (P && P.category !== "completed" && P.category !== "canceled") {
        const Ue = E.transitions ??= [], qe = we?.auto === !0 && we.default === !0, xt = {
          id: Xt("transition", Ue),
          name: "Continue",
          from: [we ? Ee.id : P.id],
          to: we?.to ?? Ee.id,
          ...qe ? { auto: !0, default: !0 } : {}
        };
        we && (we.to = Ee.id), Ue.push(xt);
        const Ze = Ue[Ue.length - 1];
        V.set(Ee, { entry: we ?? Ze, continuation: we ? Ze : void 0, automatic: qe });
      }
      be(Ee, U), await f.value?.editName();
    }
    function A(E, U) {
      const G = V.get(E), K = G?.continuation;
      !K || G.automatic || K.from === "any" || K.from.length !== 1 || K.from[0] !== E.id || (U === "gate" ? (K.auto = !0, K.default = !0) : (delete K.auto, delete K.default));
    }
    function C(E, U, G) {
      const K = $.value;
      if (!K || !U || E === U) return;
      const ve = K.transitions ??= [], P = `to_${U}`;
      let Z = P.slice(0, 40), N = 2;
      for (; ve.some((we) => we.id === Z); ) {
        const we = `_${N++}`;
        Z = P.slice(0, 40 - we.length) + we;
      }
      const re = { id: Z, name: `To ${ge(K.states.find((we) => we.id === U)).toLowerCase()}`, from: [E], to: U };
      ve.push(re), oe(re, G);
    }
    function O(E, U) {
      const G = u.value ?? E.states.find((P) => P.id === E.initial) ?? E.states[0], K = E.states.find((P) => P.id !== G?.id);
      if (!G || !K) return;
      const ve = { id: Xt("transition", E.transitions ?? []), name: "To " + ge(K), from: [G.id], to: K.id };
      (E.transitions ??= []).push(ve), oe(ve, U);
    }
    async function Y(E) {
      const U = $.value, G = U?.transitions?.indexOf(E) ?? -1;
      if (!U || G < 0) return;
      const K = Ql(U, E);
      if (K.length) {
        i.value = `Used by ${K.join(", ")}. Update those references first.`;
        return;
      }
      U.transitions.splice(G, 1), se(), await ht(), fe();
    }
    function b(E, U) {
      const G = Ci(E, U);
      if (G.length) {
        i.value = `${ge(U)} is used by ${G.join(", ")}. Update these references first.`;
        return;
      }
      E.states.splice(E.states.indexOf(U), 1), f.value?.close();
    }
    async function R(E) {
      const U = t.draft.item_types?.filter((K) => K.process === E.id).map((K) => K.title || "Untitled item type") ?? [];
      if (U.length) {
        i.value = `Used by ${U.join(", ")}. Choose a different workflow for those item types first.`;
        return;
      }
      const G = await t.guardRemoval?.("processes", E.id);
      if (G) {
        i.value = G;
        return;
      }
      ka(t.draft, "processes", E.id), h.value = "", se();
    }
    return (E, U) => (n(), m("section", {
      ref_key: "editor",
      ref: g,
      class: "work-process-editor work-stack",
      "aria-label": "Workflow editor",
      onKeydown: U[17] || (U[17] = We((G) => (u.value || x.value) && f.value?.close(), ["esc"]))
    }, [
      i.value && !x.value ? (n(), m("p", kc, D(i.value), 1)) : T("", !0),
      (n(!0), m(_, null, ce(e.issues?.filter((G) => G.code === "process " + $.value?.id) ?? [], (G) => (n(), m("p", {
        key: G.what + G.detail,
        class: "work-error work-small",
        role: "alert"
      }, D(c(Ha)(G)) + " · " + D(G.what), 1))), 128)),
      $.value ? (n(), m("div", {
        key: 1,
        class: ct(["work-process-builder", { "work-process-inspecting": u.value || x.value }])
      }, [
        r("div", {
          ref_key: "tools",
          ref: w,
          class: "work-process-controls",
          role: "toolbar",
          "aria-label": "Workflow tools",
          tabindex: "-1"
        }, [
          d.value.length > 1 ? (n(), H(c(me), {
            key: 0,
            "model-value": $.value.id,
            "aria-label": "Workflow",
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            options: d.value.map((G) => ({ label: G.name || "Untitled workflow", value: G.id })),
            "onUpdate:modelValue": U[0] || (U[0] = (G) => h.value = G)
          }, null, 8, ["model-value", "options"])) : (n(), m("strong", wc, D($.value.name || "Untitled workflow"), 1)),
          k(c(te), {
            label: "Add state",
            severity: "secondary",
            outlined: "",
            onClick: U[1] || (U[1] = (G) => X($.value, G.currentTarget))
          }, {
            icon: W(() => [
              k(c(pe), { icon: "tabler:plus" })
            ]),
            _: 1
          }),
          k(c(te), {
            label: "Add transition",
            severity: "secondary",
            outlined: "",
            disabled: $.value.states.length < 2,
            onClick: U[2] || (U[2] = (G) => O($.value, G.currentTarget))
          }, null, 8, ["disabled"]),
          k(c(me), {
            modelValue: $.value.initial,
            "onUpdate:modelValue": U[3] || (U[3] = (G) => $.value.initial = G),
            "aria-label": "Starts in " + c(ge)($.value.states.find((G) => G.id === $.value.initial)),
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            options: $.value.states.map((G) => ({ label: c(ge)(G), value: G.id }))
          }, {
            value: W(() => [
              r("span", $c, "Starts in " + D(c(ge)($.value.states.find((G) => G.id === $.value.initial))), 1)
            ]),
            _: 1
          }, 8, ["modelValue", "aria-label", "options"]),
          U[18] || (U[18] = r("span", { class: "work-spacer" }, null, -1)),
          s.value === "Map" ? (n(), m("div", Vc, [
            k(c(te), {
              label: "Fit",
              title: "Fit the map to a readable width",
              text: "",
              severity: "secondary",
              size: "small",
              onClick: U[4] || (U[4] = (G) => y.value?.fit())
            }, {
              icon: W(() => [
                k(c(pe), { icon: "tabler:arrows-maximize" })
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
              onClick: U[5] || (U[5] = (G) => y.value?.zoomOut())
            }, {
              default: W(() => [
                k(c(pe), { icon: "tabler:minus" })
              ]),
              _: 1
            })) : T("", !0),
            s.value === "Map" ? (n(), H(c(te), {
              key: 1,
              "aria-label": "Zoom in",
              title: "Zoom in",
              text: "",
              severity: "secondary",
              size: "small",
              onClick: U[6] || (U[6] = (G) => y.value?.zoomIn())
            }, {
              default: W(() => [
                k(c(pe), { icon: "tabler:plus" })
              ]),
              _: 1
            })) : T("", !0)
          ])) : T("", !0),
          k(c(Nl), {
            "model-value": s.value,
            "onUpdate:modelValue": B,
            options: ["Map", "List"],
            "allow-empty": !1,
            "aria-label": "Workflow layout"
          }, null, 8, ["model-value"]),
          k(c(te), {
            label: "New process",
            "aria-label": "New process",
            text: "",
            severity: "secondary",
            onClick: U[7] || (U[7] = (G) => v.value = !0)
          }, {
            icon: W(() => [
              k(c(pe), { icon: "tabler:plus" })
            ]),
            _: 1
          })
        ], 512),
        s.value === "Map" ? (n(), H(vd, {
          key: 0,
          ref_key: "graph",
          ref: y,
          process: $.value,
          draft: e.draft,
          "fit-on-open": "",
          "selected-state": u.value,
          "selected-transition": x.value,
          onState: be,
          onTransition: oe,
          onRemoveTransition: U[8] || (U[8] = (G) => f.value?.removeByShortcut(G)),
          onConnect: C,
          onClear: U[9] || (U[9] = (G) => f.value?.close())
        }, null, 8, ["process", "draft", "selected-state", "selected-transition"])) : (n(), H(Md, {
          key: 1,
          process: $.value,
          draft: e.draft,
          guards: Q.value,
          "selected-state": u.value,
          "selected-transition": x.value,
          counts: M.value,
          onState: be,
          onTransition: oe,
          onRemoveState: U[10] || (U[10] = (G) => b($.value, G)),
          onRemoveTransition: Y
        }, null, 8, ["process", "draft", "guards", "selected-state", "selected-transition", "counts"])),
        k(yc, {
          ref_key: "inspector",
          ref: f,
          process: $.value,
          draft: e.draft,
          "board-id": e.boardId,
          guards: Q.value,
          error: i.value,
          "selected-state": u.value,
          "selected-transition": x.value,
          "inserted-route": S.value,
          "process-counts": M.value,
          onClose: ue,
          onFocusEditor: fe,
          onKind: A,
          onConnect: C,
          onRemoveState: U[11] || (U[11] = (G) => b($.value, G)),
          onRemoveTransition: Y,
          onValidity: U[12] || (U[12] = (G, K) => l("validity", G, K))
        }, null, 8, ["process", "draft", "board-id", "guards", "error", "selected-state", "selected-transition", "inserted-route", "process-counts"])
      ], 2)) : (n(), H(c(te), {
        key: 2,
        label: "New process",
        severity: "secondary",
        outlined: "",
        onClick: U[13] || (U[13] = (G) => v.value = !0)
      }, {
        icon: W(() => [
          k(c(pe), { icon: "tabler:plus" })
        ]),
        _: 1
      })),
      $.value ? (n(), H(Ne, {
        key: 3,
        class: "work-disclosure",
        label: "Advanced workflow settings"
      }, {
        default: W(() => [
          r("div", xc, [
            k(Ne, {
              class: "work-small",
              label: "Technical details"
            }, {
              default: W(() => [...U[19] || (U[19] = [
                r("p", null, [
                  q("Workflow definitions are "),
                  r("code", null, "processes"),
                  q(" in "),
                  r("code", null, "WorkGetSchema"),
                  q(" and "),
                  r("code", null, "WorkApplySchema"),
                  q(".")
                ], -1)
              ])]),
              _: 1
            }),
            r("label", Cc, [
              U[20] || (U[20] = q("Workflow name", -1)),
              k(c(Ie), {
                modelValue: $.value.name,
                "onUpdate:modelValue": U[14] || (U[14] = (G) => $.value.name = G),
                "aria-label": "Workflow name"
              }, null, 8, ["modelValue"])
            ]),
            F.value.length ? (n(), m("p", Sc, "Some item limits belong to removed states.")) : T("", !0),
            (n(!0), m(_, null, ce(F.value, (G, K) => (n(), H(c(te), {
              key: G,
              label: "Clear limit for removed state " + (K + 1),
              severity: "secondary",
              text: "",
              onClick: (ve) => delete e.draft.policy.wip[G]
            }, null, 8, ["label", "onClick"]))), 128)),
            k(c(te), {
              label: "Remove workflow",
              severity: "danger",
              text: "",
              size: "small",
              onClick: U[15] || (U[15] = (G) => R($.value))
            })
          ])
        ]),
        _: 1
      })) : T("", !0),
      k($l, {
        visible: v.value,
        "return-focus": e.creationOpener,
        label: "New process",
        onClose: ke
      }, {
        default: W(() => [
          r("form", {
            class: "work-dialog-box",
            "aria-label": "New process",
            onSubmit: Oe(ne, ["stop", "prevent"])
          }, [
            U[22] || (U[22] = r("h2", null, "New process", -1)),
            r("label", Tc, [
              U[21] || (U[21] = q("Name", -1)),
              k(c(Ie), {
                modelValue: p.value,
                "onUpdate:modelValue": U[16] || (U[16] = (G) => p.value = G),
                "aria-label": "New process name",
                autofocus: "",
                required: ""
              }, null, 8, ["modelValue"])
            ]),
            r("div", Ic, [
              k(c(te), {
                label: "Cancel",
                severity: "secondary",
                outlined: "",
                onClick: ke
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
}), Ec = {
  class: "work-settings-card work-stack",
  "aria-label": "Existing items"
}, Uc = {
  key: 0,
  class: "work-stack work-tight"
}, Ac = { class: "work-row" }, Rc = /* @__PURE__ */ Ve({
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
    return (t, l) => (n(), m("section", Ec, [
      l[2] || (l[2] = r("h3", { class: "work-row-title" }, "Items in changed states", -1)),
      (n(!0), m(_, null, ce(e.removed, ({ process: o, state: d, count: v }) => (n(), m("label", {
        key: o.id + "/" + d.id,
        class: "work-stack work-tight"
      }, [
        q(" Move " + D(a(v)) + " from " + D(c(ge)(d)) + " to ", 1),
        k(c(me), {
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
      e.renamed.length ? (n(), m("div", Uc, [
        (n(!0), m(_, null, ce(e.renamed, ({ process: o, state: d, count: v, name: p }) => (n(), m("p", {
          key: o.id + "/" + d.id
        }, [
          q(D(c(ge)(d)) + " becomes ", 1),
          r("strong", null, D(p), 1),
          q(" for " + D(a(v)) + ". ", 1)
        ]))), 128)),
        r("label", Ac, [
          k(c(zt), {
            binary: "",
            "model-value": e.confirmed,
            disabled: e.disabled,
            "onUpdate:modelValue": l[0] || (l[0] = (o) => t.$emit("update:confirmed", o))
          }, null, 8, ["model-value", "disabled"]),
          l[1] || (l[1] = q(" Keep these items in their renamed states ", -1))
        ])
      ])) : T("", !0)
    ]));
  }
}), Pc = {
  class: "work-stack",
  "aria-label": "Links editor"
}, Oc = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, Nc = { class: "work-definition-meta work-muted work-small" }, Mc = { class: "work-settings-grid" }, Fc = { class: "work-stack work-tight" }, Lc = {
  key: 0,
  class: "work-stack work-tight"
}, Bc = { class: "work-stack work-tight" }, jc = { class: "work-row" }, zc = {
  key: 0,
  class: "work-muted work-small"
}, qc = {
  key: 1,
  class: "work-stack work-tight"
}, Wc = { class: "work-settings-grid" }, Gc = {
  key: 0,
  class: "work-chips"
}, Kc = { class: "work-stack work-tight" }, Hc = { class: "work-relation-preview work-small" }, Yc = {
  key: 0,
  class: "work-muted"
}, Xc = {
  key: 0,
  class: "kx-empty"
}, Jc = /* @__PURE__ */ Ve({
  __name: "RelationsEditor",
  props: {
    draft: {},
    guardRemoval: { type: Function }
  },
  setup(e) {
    const a = e, t = z(() => a.draft.relation_types ?? []), l = z(() => (a.draft.item_types ?? []).map((g) => ({ value: g.id, label: g.title || Ae(g.id) })));
    function o(g, f, w) {
      w.length ? g[f] = w : delete g[f];
    }
    function d(g, f) {
      if (!/^[a-z][a-z0-9_]{0,39}$/.test(f)) return "Start with a lowercase letter and use only lowercase letters, numbers or underscores.";
      if (g.to_types?.includes(f)) return "This ID is already in use.";
    }
    function v(g, f) {
      o(g, "to_types", [...g.to_types ?? [], f]);
    }
    function p(g) {
      return (g.to_types ?? []).filter((f) => l.value.some((w) => w.value === f));
    }
    function h(g) {
      return (g.to_types ?? []).filter((f) => !l.value.some((w) => w.value === f));
    }
    const i = j(""), s = j(!1);
    function u(g) {
      const f = g.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, ""), w = (/^[a-z]/.test(f) ? f : "link_" + (f || "new")).slice(0, 40);
      let V = w, $ = 2;
      for (; t.value.some((S) => S.id === V); ) {
        const S = "_" + $++;
        V = w.slice(0, 40 - S.length) + S;
      }
      return V;
    }
    function x(g) {
      (a.draft.relation_types ??= []).push({ id: u(g), outward: g, inward: g, cardinality: "many" });
    }
    async function y(g) {
      if (!s.value) {
        s.value = !0, i.value = "";
        try {
          const f = await a.guardRemoval?.("relation_types", g);
          f ? i.value = f : ka(a.draft, "relation_types", g);
        } finally {
          s.value = !1;
        }
      }
    }
    return (g, f) => (n(), m("section", Pc, [
      i.value ? (n(), m("p", Oc, D(i.value), 1)) : T("", !0),
      k(Ja, {
        columns: "relations",
        count: t.value.length
      }, {
        default: W(() => [
          (n(!0), m(_, null, ce(t.value, (w, V) => (n(), H(Xa, {
            "route-section": "links",
            "route-id": w.id,
            title: w.outward || c(Ae)(w.id),
            kind: w.symmetric ? "Same both ways" : "Different each way",
            key: V,
            class: "work-stack"
          }, Ga({
            actions: W(() => [
              k(c(te), {
                severity: "secondary",
                text: "",
                disabled: s.value,
                onClick: ($) => y(w.id),
                "aria-label": "Remove link type",
                size: "small"
              }, {
                default: W(() => [
                  k(c(pe), {
                    icon: "tabler:trash",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["disabled", "onClick"])
            ]),
            default: W(() => [
              r("div", Mc, [
                r("label", Fc, [
                  f[0] || (f[0] = q("Shown on this item ", -1)),
                  k(c(Ie), {
                    modelValue: w.outward,
                    "onUpdate:modelValue": ($) => w.outward = $,
                    "aria-label": "Shown on this item"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                w.symmetric ? T("", !0) : (n(), m("label", Lc, [
                  f[1] || (f[1] = q("Shown on the other item ", -1)),
                  k(c(Ie), {
                    modelValue: w.inward,
                    "onUpdate:modelValue": ($) => w.inward = $,
                    "aria-label": "Shown on the other item"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ])),
                r("label", Bc, [
                  f[2] || (f[2] = q("Links allowed ", -1)),
                  k(c(me), {
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
                r("label", jc, [
                  k(c(zt), {
                    modelValue: w.symmetric,
                    "onUpdate:modelValue": ($) => w.symmetric = $,
                    disabled: !!(w.from_types?.length || w.to_types?.length),
                    "aria-label": "Same meaning in both directions",
                    binary: ""
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"]),
                  f[3] || (f[3] = q("Same meaning in both directions ", -1))
                ])
              ]),
              w.from_types?.length || w.to_types?.length ? (n(), m("p", zc, " Clear the source and target types to use the same meaning in both directions. ")) : T("", !0),
              w.symmetric ? T("", !0) : (n(), m("div", qc, [
                f[5] || (f[5] = r("p", { class: "work-muted work-small" }, "Leave either end empty to allow any item type there.", -1)),
                r("div", Wc, [
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
                    "onUpdate:modelValue": ($) => o(w, "to_types", [...$, ...h(w)])
                  }, null, 8, ["options", "model-value", "onUpdate:modelValue"])
                ]),
                k(Ne, {
                  class: "work-disclosure",
                  label: "Peer board target types"
                }, {
                  default: W(() => [
                    f[4] || (f[4] = r("p", { class: "work-muted work-small" }, "Enter a type ID to allow that type from a peer board.", -1)),
                    h(w).length ? (n(), m("div", Gc, [
                      (n(!0), m(_, null, ce(h(w), ($) => (n(), H(c(te), {
                        key: $,
                        severity: "secondary",
                        text: "",
                        size: "small",
                        label: $ + " ×",
                        "aria-label": "Remove target type " + $,
                        onClick: (S) => o(w, "to_types", w.to_types?.filter((I) => I !== $) ?? [])
                      }, null, 8, ["label", "aria-label", "onClick"]))), 128))
                    ])) : T("", !0),
                    k(ga, {
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
                default: W(() => [
                  r("label", Kc, [
                    f[6] || (f[6] = q("Identifier ", -1)),
                    k(c(Ie), {
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
              r("p", Hc, [
                f[7] || (f[7] = r("strong", null, "This item", -1)),
                q(" " + D(w.outward || "relates to") + " ", 1),
                f[8] || (f[8] = r("strong", null, "another item", -1)),
                !w.symmetric && w.inward && w.inward !== w.outward ? (n(), m("span", Yc, " · reverse: " + D(w.inward), 1)) : T("", !0)
              ])
            ]),
            _: 2
          }, [
            !w.symmetric && w.inward && w.inward !== w.outward ? {
              name: "usage",
              fn: W(() => [
                r("span", Nc, D(w.inward), 1)
              ]),
              key: "0"
            } : void 0
          ]), 1032, ["route-id", "title", "kind"]))), 128)),
          t.value.length ? T("", !0) : (n(), m("p", Xc, "No link types yet. Add one to connect related work.")),
          k(ga, {
            action: "Add link type",
            label: "Link name",
            onAdd: x
          })
        ]),
        _: 1
      }, 8, ["count"])
    ]));
  }
});
function Zo(e) {
  return typeof e.error == "string" ? e.error : e.error?.message;
}
function po(e, a) {
  const t = Zo(e);
  return e.parked ? "Stopped: " + (t ?? "Projection is parked") : t ? "Degraded: " + t : e.bootstrapping ? "Initializing" : e.last_seq >= a ? "Up to date" : "Catching up";
}
function Zc(e, a) {
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
  if (o.some(Zo)) return { kind: "degraded", status: "Degraded" };
}
const Qc = {
  class: "work-stack",
  "aria-label": "Plugins editor"
}, _c = {
  key: 0,
  class: "kx-loading"
}, ev = {
  key: 1,
  class: "kx-err",
  role: "alert"
}, tv = {
  key: 2,
  class: "work-notice",
  role: "status"
}, av = { class: "work-block work-small work-error" }, lv = {
  key: 0,
  class: "work-muted work-small"
}, ov = {
  key: 1,
  class: "work-notice"
}, iv = {
  key: 2,
  class: "work-stack work-tight"
}, nv = {
  key: 0,
  class: "work-muted"
}, sv = {
  key: 1,
  class: "work-row"
}, rv = {
  key: 2,
  class: "work-row"
}, dv = {
  key: 0,
  class: "work-small"
}, uv = {
  key: 5,
  class: "work-row"
}, cv = {
  key: 6,
  class: "work-row"
}, vv = {
  key: 7,
  class: "work-row"
}, fv = { class: "work-stack work-tight" }, mv = { key: 0 }, pv = { key: 1 }, bv = { key: 2 }, gv = {
  key: 4,
  class: "work-stack work-tight"
}, hv = {
  key: 0,
  class: "work-muted"
}, yv = { class: "work-form-actions" }, kv = {
  key: 6,
  class: "work-muted work-small"
}, wv = "kickside.work.planning:plugin", bo = /* @__PURE__ */ Ve({
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
    const t = e, l = a, o = j(""), d = j(""), v = j(""), p = j({}), h = Ka(Ya, void 0), i = j(/* @__PURE__ */ new Set()), s = j({}), u = j(/* @__PURE__ */ new Set()), x = z(() => t.options.map((X) => {
      const A = J(X.plugin), C = Zc(X, A), O = ue(X.plugin), Y = A?.active === !0, b = O && i.value.has(X.plugin) ? "Configuration needed" : O !== Y ? O ? "Will enable on apply" : "Will disable on apply" : C?.status ?? (Y ? A.lifecycle.state === "ready" ? "Enabled" : "Setting up" : "Disabled");
      return { plugin: X, current: A, issue: C, chosen: O, status: b };
    })), y = z(() => !!o.value || t.disabled), g = z(() => y.value || t.activationLocked), f = {}, w = z(() => (t.draft.item_types ?? []).filter((X) => !["issue", "sprint", "milestone"].includes(X.id)).map((X) => ({ value: X.id, label: X.title || Ae(X.id) }))), V = z(() => ["current_sprint", "milestone"].every((X) => t.schema.compiled?.fields?.some((A) => A.code === X))), $ = z(() => {
      const X = t.filters;
      return X ? (t.draft.scopes ?? []).filter((A) => !X.some((C) => C.id === A && t.options.some((O) => O.plugin === C.plugin))) : [];
    });
    function S(X) {
      return (t.filters ?? []).filter((A) => A.plugin === X);
    }
    function I(X, A) {
      const C = new Set(S(X).map((b) => b.id)), O = t.draft.scopes ?? [], Y = [...O.filter((b) => !C.has(b)), ...A];
      (Y.length !== O.length || Y.some((b) => !O.includes(b))) && (t.draft.scopes = Y);
    }
    function B(X, A) {
      M(X, { ...oe(X), issue_types: A });
    }
    function le(X) {
      return !!X.config_schema && Ol(X.config_schema).length > 0;
    }
    function J(X) {
      return t.schema.plugins?.find((A) => A.plugin === X);
    }
    function se(X) {
      return J(X)?.active === !0;
    }
    function ue(X) {
      return t.draft.plugins?.some((A) => A.use === X) === !0;
    }
    function fe(X, A) {
      const C = t.draft.plugins ?? [];
      A && !ue(X) && (t.draft.plugins = [...C, { use: X }], p.value[X] = !0, h?.choose("plugins", X, !0)), A || (t.draft.plugins = C.filter((O) => O.use !== X), delete t.configs[X], i.value.delete(X), l("validity", X, !0), I(X, []));
    }
    function be(X, A) {
      fe(X, !1), l("review", A.currentTarget);
    }
    function oe(X) {
      return t.configs[X] ?? J(X)?.config ?? f;
    }
    function M(X, A) {
      v.value = "", t.configs[X] = A;
    }
    function Q(X) {
      delete t.configs[X];
    }
    function F(X, A) {
      A ? i.value.delete(X) : i.value.add(X), l("validity", X, A || !ue(X) || se(X) && !t.configs[X]);
    }
    async function ne(X) {
      await Do.confirm({
        header: "Reset projection?",
        message: "Resetting can rebuild from current items or replay retained events, depending on the projection.",
        acceptLabel: "Reset projection",
        rejectLabel: "Cancel"
      }) && await ke(X);
    }
    async function ke(X) {
      if (!y.value) {
        o.value = X, d.value = "", v.value = "";
        try {
          await jt.configure(t.boardId, X), v.value = "Plugin recovery started.", l("configured");
        } catch (A) {
          d.value = nt(A, "Could not recover the plugin.");
        } finally {
          o.value = "";
        }
      }
    }
    return (X, A) => (n(), m("section", Qc, [
      e.options.length ? T("", !0) : (n(), m("p", _c, "No installed plugins are visible to you.")),
      d.value ? (n(), m("div", ev, D(d.value), 1)) : T("", !0),
      v.value ? (n(), m("p", tv, D(v.value), 1)) : T("", !0),
      k(Ja, {
        columns: "plugins",
        count: e.options.length
      }, {
        default: W(() => [
          (n(!0), m(_, null, ce(x.value, ({ plugin: C, current: O, issue: Y, chosen: b, status: R }) => (n(), H(Xa, {
            "route-section": "plugins",
            "route-id": C.plugin,
            key: C.plugin,
            open: p.value[C.plugin],
            "onUpdate:open": (E) => p.value[C.plugin] = E,
            title: C.installed === !1 ? C.plugin : C.title || C.plugin,
            description: C.description,
            kind: R,
            class: "work-stack"
          }, Ga({
            actions: W(() => [
              Y?.kind !== "missing" ? (n(), H(c(et), {
                key: 0,
                "model-value": ue(C.plugin),
                "aria-label": "Enable " + (C.title || C.plugin),
                disabled: g.value || !!C.problem && !ue(C.plugin),
                "onUpdate:modelValue": (E) => fe(C.plugin, E)
              }, null, 8, ["model-value", "aria-label", "disabled", "onUpdate:modelValue"])) : T("", !0)
            ]),
            default: W(() => [
              C.requires.length ? (n(), m("p", lv, "Requires " + D(C.requires.map((E) => e.options.find((U) => U.plugin === E)?.title || "Another capability").join(", ")), 1)) : T("", !0),
              O?.outdated ? (n(), m("p", ov, "The stored declaration differs from the installed plugin. Review activation to update it.")) : T("", !0),
              Y ? (n(), m("div", iv, [
                Y && "cause" in Y ? (n(), m("p", nv, D(Y.cause), 1)) : T("", !0),
                Y?.kind === "setup" && O?.active ? (n(), m("div", sv, [
                  k(c(te), {
                    label: "Retry setup",
                    severity: "secondary",
                    outlined: "",
                    disabled: y.value,
                    onClick: (E) => ke(C.plugin)
                  }, null, 8, ["disabled", "onClick"])
                ])) : Y?.kind === "provider" ? (n(), m("div", rv, [
                  k(c(te), {
                    label: "Retry schema check",
                    severity: "secondary",
                    outlined: "",
                    disabled: y.value,
                    onClick: A[0] || (A[0] = (E) => l("refresh"))
                  }, null, 8, ["disabled"])
                ])) : Y?.kind === "degraded" ? (n(), H(Ne, {
                  key: 3,
                  class: "work-small",
                  label: "Inspect worker"
                }, {
                  default: W(() => [
                    A[1] || (A[1] = r("p", null, "Check the failing worker before resetting a projection.", -1)),
                    (n(!0), m(_, null, ce(O?.projections, (E, U) => (n(), m("p", { key: U }, D(U) + " · " + D(c(po)(E, e.schema.as_of)), 1))), 128))
                  ]),
                  _: 2
                }, 1024)) : Y?.kind === "history" ? (n(), m(_, { key: 4 }, [
                  Y.floor !== void 0 ? (n(), m("p", dv, "Earliest retained event sequence is " + D(Y.floor) + ".", 1)) : T("", !0),
                  k(Ne, {
                    class: "work-small",
                    label: "Review retained history"
                  }, {
                    default: W(() => [...A[2] || (A[2] = [
                      r("p", null, "Ask the plugin maintainer to review the event projection’s start sequence. The plugin needs a declaration that can run with the retained history.", -1)
                    ])]),
                    _: 1
                  })
                ], 64)) : Y?.kind === "reset" ? (n(), m("div", uv, [
                  k(c(te), {
                    label: "Reset projection",
                    severity: "secondary",
                    outlined: "",
                    disabled: y.value,
                    onClick: (E) => ne(C.plugin)
                  }, null, 8, ["disabled", "onClick"]),
                  A[3] || (A[3] = r("span", { class: "work-muted work-small" }, "Resolve the worker error before resetting.", -1))
                ])) : Y?.kind === "configuration" && ue(C.plugin) && le(C) && !u.value.has(C.plugin) ? (n(), m("div", cv, [
                  k(c(te), {
                    label: "Edit configuration",
                    severity: "secondary",
                    outlined: "",
                    disabled: y.value,
                    onClick: (E) => u.value.add(C.plugin)
                  }, null, 8, ["disabled", "onClick"])
                ])) : Y?.kind === "missing" && ue(C.plugin) ? (n(), m("div", vv, [
                  k(c(te), {
                    label: "Review references",
                    severity: "secondary",
                    outlined: "",
                    disabled: g.value,
                    onClick: (E) => be(C.plugin, E)
                  }, null, 8, ["disabled", "onClick"])
                ])) : T("", !0)
              ])) : T("", !0),
              C.installed ? (n(), H(Ne, {
                key: 3,
                class: "work-disclosure work-small",
                label: "Technical details"
              }, {
                default: W(() => [
                  r("dl", fv, [
                    r("div", null, [
                      A[4] || (A[4] = r("dt", null, "Plugin ID", -1)),
                      r("dd", null, [
                        r("code", null, D(C.plugin), 1)
                      ])
                    ]),
                    (O?.interface_version ?? C.interface_version) != null ? (n(), m("div", mv, [
                      A[5] || (A[5] = r("dt", null, "Interface version", -1)),
                      r("dd", null, D(O?.interface_version ?? C.interface_version), 1)
                    ])) : T("", !0),
                    O?.version ? (n(), m("div", pv, [
                      A[6] || (A[6] = r("dt", null, "Active schema version", -1)),
                      r("dd", null, D(O.version), 1)
                    ])) : T("", !0),
                    A[8] || (A[8] = r("div", null, [
                      r("dt", null, "Configuration tool"),
                      r("dd", null, [
                        r("code", null, "WorkConfigurePlugin")
                      ])
                    ], -1)),
                    C.tools.length ? (n(), m("div", bv, [
                      A[7] || (A[7] = r("dt", null, "Plugin tools", -1)),
                      r("dd", null, [
                        (n(!0), m(_, null, ce(C.tools, (E) => (n(), m("code", {
                          key: E,
                          class: "work-block"
                        }, D(E), 1))), 128))
                      ])
                    ])) : T("", !0),
                    (n(!0), m(_, null, ce(O?.projections, (E, U) => (n(), m("div", { key: U }, [
                      r("dt", null, D(c(Ae)(U)), 1),
                      r("dd", null, D(c(po)(E, e.schema.as_of)) + " · Indexed through " + D(E.last_seq) + " of " + D(e.schema.as_of) + " events.", 1)
                    ]))), 128))
                  ])
                ]),
                _: 2
              }, 1024)) : T("", !0),
              S(C.plugin).length && (ue(C.plugin) || se(C.plugin)) ? (n(), m("section", gv, [
                A[9] || (A[9] = r("h4", null, "Query filters", -1)),
                A[10] || (A[10] = r("p", { class: "work-muted" }, "Choose which filters people can use to narrow down work on this board.", -1)),
                k(st, {
                  label: "Available filters",
                  disabled: !!o.value || e.disabled || !ue(C.plugin),
                  options: S(C.plugin).map((E) => ({ value: E.id, label: E.title })),
                  "model-value": e.draft.scopes?.filter((E) => S(C.plugin).some((U) => U.id === E)),
                  "onUpdate:modelValue": (E) => I(C.plugin, E)
                }, null, 8, ["disabled", "options", "model-value", "onUpdate:modelValue"])
              ])) : T("", !0),
              ue(C.plugin) && le(C) && Y?.kind !== "manifest" && Y?.kind !== "missing" && (Y?.kind !== "configuration" || u.value.has(C.plugin)) ? (n(), H(ta(Y && Y.kind !== "configuration" ? Ne : "div"), {
                key: 5,
                label: Y && Y.kind !== "configuration" ? "Plugin settings" : void 0,
                class: "work-stack work-tight"
              }, {
                default: W(() => [
                  C.plugin === wv ? (n(), m(_, { key: 0 }, [
                    V.value ? (n(), H(st, {
                      key: 1,
                      label: "Plan these item types",
                      options: w.value,
                      "model-value": oe(C.plugin).issue_types,
                      disabled: !!o.value || e.disabled,
                      "onUpdate:modelValue": (E) => B(C.plugin, E)
                    }, null, 8, ["options", "model-value", "disabled", "onUpdate:modelValue"])) : (n(), m("p", hv, "The Planning pack supplies sprint and milestone fields for item types.")),
                    A[11] || (A[11] = r("p", { class: "work-muted" }, "Selected types get Current sprint and Milestone fields.", -1))
                  ], 64)) : (n(), H(To, {
                    key: 1,
                    disabled: !!o.value || e.disabled,
                    schema: C.config_schema,
                    "model-value": oe(C.plugin),
                    "suggest-defaults": "",
                    "onUpdate:modelValue": (E) => M(C.plugin, E),
                    onValidity: (E) => F(C.plugin, E),
                    onValidationMessage: (E) => s.value[C.plugin] = E
                  }, null, 8, ["disabled", "schema", "model-value", "onUpdate:modelValue", "onValidity", "onValidationMessage"])),
                  r("div", yv, [
                    k(c(te), {
                      label: Y ? "Reset form values" : "Reset",
                      severity: "secondary",
                      outlined: "",
                      disabled: !!o.value || e.disabled,
                      onClick: (E) => Q(C.plugin)
                    }, null, 8, ["label", "disabled", "onClick"])
                  ])
                ]),
                _: 2
              }, 1032, ["label"])) : T("", !0),
              !e.activationLocked && (b !== se(C.plugin) || b && (le(C) || S(C.plugin).length)) ? (n(), m("p", kv, " Use Review changes, then Apply changes to save. ")) : T("", !0)
            ]),
            _: 2
          }, [
            ue(C.plugin) && s.value[C.plugin] ? {
              name: "status",
              fn: W(() => [
                r("span", av, D(s.value[C.plugin]), 1)
              ]),
              key: "0"
            } : void 0
          ]), 1032, ["route-id", "open", "onUpdate:open", "title", "description", "kind"]))), 128))
        ]),
        _: 1
      }, 8, ["count"]),
      $.value.length ? (n(), H(Ne, {
        key: 3,
        class: "work-settings-card work-disclosure",
        label: "Unavailable query filters"
      }, {
        default: W(() => [
          A[12] || (A[12] = r("p", { class: "work-muted" }, "These filters came from a plugin that is unavailable. Remove one to stop using it on this board.", -1)),
          (n(!0), m(_, null, ce($.value, (C, O) => (n(), H(c(te), {
            key: C,
            label: "Remove unavailable filter " + (O + 1),
            severity: "secondary",
            text: "",
            onClick: (Y) => e.draft.scopes = e.draft.scopes?.filter((b) => b !== C)
          }, null, 8, ["label", "onClick"]))), 128))
        ]),
        _: 1
      })) : T("", !0),
      (n(!0), m(_, null, ce(e.draft.plugins?.filter((C) => !e.options.some((O) => O.plugin === C.use)) ?? [], (C) => (n(), m("article", {
        key: C.use,
        class: "work-settings-card work-stack"
      }, [
        r("p", null, [
          r("strong", null, D(C.use), 1),
          A[13] || (A[13] = q(" · Not installed", -1))
        ]),
        A[14] || (A[14] = r("p", { class: "work-muted" }, "This board still references a plugin that is no longer installed.", -1)),
        k(c(te), {
          label: "Review references",
          severity: "secondary",
          outlined: "",
          disabled: g.value,
          onClick: (O) => be(C.use, O)
        }, null, 8, ["disabled", "onClick"])
      ]))), 128))
    ]));
  }
}), $v = { class: "system-section-head" }, Vv = { class: "system-section-head-text" }, xv = {
  key: 0,
  class: "kx-head-actions"
}, Cv = /* @__PURE__ */ Ve({
  __name: "SettingsSectionHead",
  props: {
    title: {},
    description: {}
  },
  setup(e) {
    return (a, t) => (n(), m("header", $v, [
      r("div", Vv, [
        r("h1", null, D(e.title), 1),
        r("p", null, D(e.description), 1)
      ]),
      a.$slots.actions ? (n(), m("div", xv, [
        Je(a.$slots, "actions")
      ])) : T("", !0)
    ]));
  }
}), Sv = /* @__PURE__ */ Ve({
  __name: "SettingsDraftActions",
  props: {
    busy: { type: Boolean },
    discardDisabled: { type: Boolean },
    reviewDisabled: { type: Boolean }
  },
  emits: ["discard", "review"],
  setup(e) {
    return (a, t) => (n(), m(_, null, [
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
        icon: W(() => [
          k(c(pe), {
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
}), Tv = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, Iv = ["config"], Dv = /* @__PURE__ */ Ve({
  __name: "BoardShare",
  props: {
    board: {},
    busy: { type: Boolean }
  },
  emits: ["shared"],
  setup(e) {
    const a = e, t = j(!1), l = j(!1), o = j("");
    async function d() {
      const p = a.board;
      if (!(a.busy || l.value)) {
        l.value = !0, o.value = "";
        try {
          const h = await Et("kickside-share");
          if (a.board.board_id !== p.board_id) return;
          h ? t.value = !0 : o.value = "Sharing is unavailable. Try opening it again.";
        } finally {
          l.value = !1;
        }
      }
    }
    Se(() => a.board.board_id, () => {
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
    return (p, h) => (n(), m(_, null, [
      k(c(te), {
        label: "Share board",
        severity: "secondary",
        outlined: "",
        loading: l.value,
        disabled: e.busy,
        onClick: d
      }, {
        icon: W(() => [
          k(c(pe), {
            icon: "tabler:share",
            "aria-hidden": "true"
          })
        ]),
        _: 1
      }, 8, ["loading", "disabled"]),
      o.value ? (n(), m("p", Tv, D(o.value), 1)) : T("", !0),
      t.value ? (n(), m("kickside-share", {
        key: 1,
        config: v.value,
        onClose: h[0] || (h[0] = (i) => t.value = !1),
        onChanged: h[1] || (h[1] = (i) => p.$emit("shared"))
      }, null, 40, Iv)) : T("", !0)
    ], 64));
  }
}), Ev = {
  class: "work-stack",
  "aria-label": "Board visibility"
}, Uv = { class: "work-stack work-tight" }, Av = {
  key: 0,
  class: "work-settings-list"
}, Rv = { class: "work-row-main" }, Pv = { class: "work-small work-muted" }, Ov = { class: "work-row-control" }, Nv = { class: "work-row" }, Mv = /* @__PURE__ */ Ve({
  __name: "VisibilityEditor",
  props: {
    draft: {},
    boardId: {}
  },
  emits: ["validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = z(() => t.draft.visibility), d = z(() => (t.draft.fields ?? []).filter((g) => g.form === "text" && (!g.cardinality || g.cardinality === "one") && g.type !== "rollup" && g.index !== "number" && g.config?.case !== "insensitive")), v = z(() => d.value.find((g) => g.code === o.value?.field)?.type !== "option");
    function p(g) {
      if (o.value?.levels.some((f) => f.id === g)) return "This level is already in use.";
    }
    function h(g) {
      o.value?.levels.push({ id: g, holders: [] });
    }
    function i(g) {
      if (!g) {
        delete t.draft.visibility;
        return;
      }
      const f = d.value.find((w) => w.code === g);
      t.draft.visibility = { field: g, levels: (f?.options ?? []).map((w) => ({ id: w.id, holders: [] })) };
    }
    function s(g, f) {
      const w = o.value?.levels.find((V) => V.id === g);
      w && (w.holders = f ?? []);
    }
    function u(g) {
      if (!g || typeof g != "object" || Array.isArray(g)) return !1;
      const f = Object.entries(g);
      if (f.length !== 1) return !1;
      const [w, V] = f[0];
      return ["group", "user", "service", "field"].includes(w) && typeof V == "string" && V.length > 0;
    }
    function x(g) {
      return !!g && typeof g == "object" && "field" in g && typeof g.field == "string" && (!("bypass" in g) || g.bypass === "admin") && "levels" in g && Array.isArray(g.levels) && g.levels.every((f) => !!f && typeof f == "object" && "id" in f && typeof f.id == "string" && f.id.length > 0 && "holders" in f && Array.isArray(f.holders) && f.holders.every(u));
    }
    function y(g) {
      if (g !== void 0 && !x(g)) return "Enter a field and levels with valid holder rules. Omit bypass or set it to admin.";
      t.draft.visibility = g;
    }
    return (g, f) => (n(), m("section", Ev, [
      f[6] || (f[6] = r("h3", { class: "work-group-title" }, "Board visibility", -1)),
      f[7] || (f[7] = r("p", { class: "work-small work-muted" }, "Restrict items by their visibility level. People still need access to the board.", -1)),
      r("label", Uv, [
        f[4] || (f[4] = q("Visibility field ", -1)),
        k(c(me), {
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
      o.value ? (n(), m(_, { key: 0 }, [
        o.value.levels.length ? (n(), m("div", Av, [
          (n(!0), m(_, null, ce(o.value.levels, (w, V) => (n(), m("div", {
            key: w.id,
            class: "work-settings-row"
          }, [
            r("div", Rv, [
              r("strong", null, D(d.value.find(($) => $.code === o.value.field)?.options?.find(($) => $.id === w.id)?.label || w.id), 1),
              r("p", Pv, "Level " + D(V + 1), 1)
            ]),
            r("div", Ov, [
              k(Ro, {
                "board-id": e.boardId,
                label: "Who can see these items",
                "model-value": w.holders,
                "onUpdate:modelValue": ($) => s(w.id, $),
                onValidity: f[0] || (f[0] = ($) => l("validity", $))
              }, null, 8, ["board-id", "model-value", "onUpdate:modelValue"])
            ])
          ]))), 128))
        ])) : T("", !0),
        v.value ? (n(), H(ga, {
          key: o.value.field,
          action: "Add level",
          label: "New visibility level",
          validate: p,
          onAdd: h
        })) : T("", !0),
        r("label", Nv, [
          k(c(et), {
            "model-value": o.value.bypass === "admin",
            "onUpdate:modelValue": f[1] || (f[1] = (w) => w ? o.value.bypass = "admin" : delete o.value.bypass)
          }, null, 8, ["model-value"]),
          f[5] || (f[5] = q(" Board administrators can see every level ", -1))
        ]),
        k(c(te), {
          label: "Remove visibility restriction",
          severity: "secondary",
          text: "",
          onClick: f[2] || (f[2] = (w) => delete e.draft.visibility)
        })
      ], 64)) : T("", !0),
      k(Ut, {
        label: "Visibility rules",
        "model-value": o.value,
        shape: "object",
        example: { field: "visibility", levels: [{ id: "internal", holders: [] }], bypass: "admin" },
        commit: y,
        onValidity: f[3] || (f[3] = (w) => l("validity", w))
      }, null, 8, ["model-value"])
    ]));
  }
}), Fv = { class: "work-ia-section" }, Lv = {
  class: "work-settings-list",
  "aria-labelledby": "work-sharing-title"
}, Bv = { class: "work-settings-row" }, jv = { class: "work-row-main" }, zv = {
  key: 0,
  class: "work-muted work-small"
}, qv = {
  key: 0,
  class: "work-member-preview",
  "aria-label": "People and groups with direct access"
}, Wv = { class: "work-spacer" }, Gv = {
  key: 1,
  class: "work-settings-row work-muted work-small"
}, Kv = {
  key: 2,
  class: "work-settings-row work-muted"
}, Hv = {
  key: 3,
  class: "work-settings-row"
}, Yv = {
  key: 4,
  class: "work-settings-row work-muted",
  role: "status"
}, Xv = /* @__PURE__ */ Ve({
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
    const a = e, t = j(), l = j([]), o = z(() => t.value?.filter((g) => g.subject_type === "group").length ?? 0), d = z(() => (t.value?.length ?? 0) - o.value), v = z(() => [...t.value ?? []].sort((g, f) => +!!f.owner - +!!g.owner || f.access_mask - g.access_mask).slice(0, 6).map((g) => ({ ...g, permissions: s(g) }))), p = z(() => v.value.map((g) => ({ id: g.subject_id, kind: g.subject_type ?? "user" }))), h = Io(() => a.boardId, p);
    function i(g) {
      return g.full_name || h.label({ id: g.subject_id, kind: g.subject_type ?? "user", email: g.email });
    }
    function s(g) {
      return g.owner ? "Owner" : l.value.filter((f) => (g.access_mask & f.bit) === f.bit).map((f) => f.label).join(", ");
    }
    const u = j(!1), x = _t();
    async function y() {
      const g = x();
      u.value = !1;
      try {
        const [{ data: f }, w] = await Promise.all([
          Vl.get("/api/v1/component-access/grants/" + encodeURIComponent(a.boardId)),
          Vl.get("/api/v1/components/access-model")
        ]);
        if (!g()) return;
        if (!f?.success || !Array.isArray(f.access)) throw new Error("Grants unavailable");
        t.value = f.access, l.value = w.data?.success && Array.isArray(w.data.capabilities) ? w.data.capabilities : [];
      } catch {
        g() && (t.value = void 0, u.value = !0);
      }
    }
    return Pl(() => x()), Se(() => [a.active, a.boardId], () => {
      a.active && y();
    }, { immediate: !0 }), (g, f) => (n(), m("section", Fv, [
      r("section", Lv, [
        r("div", Bv, [
          r("div", jv, [
            f[1] || (f[1] = r("h3", {
              id: "work-sharing-title",
              class: "work-row-title"
            }, "Members and sharing", -1)),
            t.value ? (n(), m("p", zv, D(d.value) + " " + D(d.value === 1 ? "person" : "people") + " and " + D(o.value) + " " + D(o.value === 1 ? "group" : "groups") + " with direct access", 1)) : T("", !0)
          ]),
          e.board ? (n(), H(Dv, {
            key: 0,
            board: e.board,
            busy: e.busy,
            onShared: y
          }, null, 8, ["board", "busy"])) : T("", !0)
        ]),
        v.value.length ? (n(), m("ul", qv, [
          (n(!0), m(_, null, ce(v.value, (w) => (n(), m("li", {
            key: w.subject_type + w.subject_id,
            class: "work-settings-row"
          }, [
            k(c(pe), {
              icon: w.subject_type === "group" ? "tabler:users" : "tabler:user",
              "aria-hidden": "true"
            }, null, 8, ["icon"]),
            r("strong", Wv, D(i(w)), 1),
            w.permissions ? (n(), H(c(tt), {
              key: 0,
              class: "kx-tag-sm",
              severity: "secondary",
              value: w.permissions
            }, null, 8, ["value"])) : T("", !0)
          ]))), 128))
        ])) : T("", !0),
        t.value && t.value.length > v.value.length ? (n(), m("p", Gv, " See all " + D(t.value.length) + " people and groups under Share board. ", 1)) : t.value && !t.value.length ? (n(), m("p", Kv, "No direct grants yet.")) : u.value ? (n(), m("div", Hv, [
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
        ])) : t.value ? T("", !0) : (n(), m("p", Yv, "Loading members…"))
      ]),
      k(Ne, {
        class: "work-disclosure work-visibility-disclosure",
        label: e.draft.visibility ? "Advanced · Item visibility rules set" : "Advanced · Item visibility"
      }, {
        default: W(() => [
          k(Mv, {
            "board-id": e.boardId,
            draft: e.draft,
            onValidity: f[0] || (f[0] = (w) => g.$emit("validity", w))
          }, null, 8, ["board-id", "draft"])
        ]),
        _: 1
      }, 8, ["label"])
    ]));
  }
}), Jv = { class: "work-settings-row" }, Zv = ["for"], Qv = { class: "work-settings-row" }, _v = { class: "work-row-main" }, ef = ["id"], tf = { class: "work-settings-grid" }, af = { class: "work-stack work-tight" }, lf = { class: "work-stack work-tight" }, of = ["value", "inert"], nf = {
  key: 1,
  class: "work-muted work-small"
}, sf = {
  key: 0,
  class: "work-settings-row"
}, rf = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, df = {
  key: 1,
  class: "work-muted work-small",
  role: "status"
}, uf = {
  key: 1,
  class: "work-board-identity work-stack work-tight"
}, cf = { class: "work-stack work-tight" }, vf = { class: "work-stack work-tight" }, ff = { class: "work-stack work-tight" }, mf = ["value", "inert"], pf = {
  key: 1,
  class: "work-muted work-small"
}, bf = { class: "work-row" }, gf = { class: "work-row" }, hf = { class: "work-row work-board-title" }, yf = {
  key: 1,
  class: "work-identity-actions"
}, kf = ["title"], wf = {
  key: 2,
  class: "kx-err work-inline",
  role: "alert"
}, $f = {
  key: 3,
  class: "work-muted work-small",
  role: "status"
}, Vf = /* @__PURE__ */ Ve({
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
    const t = e, l = a, o = j(!1), d = j(!1), v = j(""), p = j(""), h = j(""), i = j(""), s = j(!1), u = j(!1), x = j(""), y = j(""), g = z(() => t.board?.access?.admin === !0), f = qt(), w = qt(), V = j({ title: "", description: "", icon: "", app: "" }), $ = z(() => [
      { id: "", title: "Default app" },
      ...t.boardApps ?? [],
      ...t.board?.ui_app && !t.boardApps?.some((M) => M.id === t.board?.ui_app) ? [{ id: t.board.ui_app, title: t.boardApps ? "Unavailable app" : "Configured board app", disabled: !0 }] : []
    ]), S = z(() => $.value.find((M) => M.id === i.value)?.title), I = z(() => !!t.boardApps?.length || !!t.board?.ui_app), B = z(() => ({
      title: t.board?.title ?? "",
      icon: t.board?.icon ?? "",
      description: t.board?.description ?? "",
      app: t.board?.ui_app ?? ""
    }));
    function le() {
      V.value = B.value, v.value = B.value.title, h.value = B.value.icon, p.value = B.value.description, i.value = B.value.app;
    }
    function J() {
      Et("wc-icon-picker").then((M) => s.value = M);
    }
    function se() {
      le(), x.value = "", y.value = "", o.value = !0, J();
    }
    const ue = z(() => {
      const M = {};
      return v.value.trim() !== V.value.title && (M.title = v.value.trim()), p.value !== V.value.description && (M.description = p.value), h.value !== V.value.icon && (M.icon = h.value), i.value !== V.value.app && (M.ui_app = i.value), M;
    }), fe = z(() => (t.detail || o.value) && Object.keys(ue.value).length > 0);
    Se(B, () => {
      t.detail && !fe.value && le();
    }, { immediate: !0 }), Se(d, (M) => {
      M && J();
    }), Se(g, (M) => {
      M || be();
    }), Se(fe, (M) => l("dirty-change", M));
    function be() {
      o.value = !1, x.value = "", y.value = "", le();
    }
    async function oe() {
      if (!g.value || !t.board || u.value || !v.value.trim()) return;
      const M = ue.value;
      if (!Object.keys(M).length) {
        o.value = !1, y.value = "Nothing changed.";
        return;
      }
      u.value = !0, x.value = "";
      try {
        const Q = await It.updateBoard(t.board.board_id, M);
        v.value = v.value.trim(), V.value = { title: v.value, description: p.value, icon: h.value, app: i.value }, o.value = !1, y.value = Q.status === "unchanged" ? "Nothing changed." : "Board saved.", l("saved");
      } catch (Q) {
        x.value = nt(Q, "Could not save the board.");
      } finally {
        u.value = !1;
      }
    }
    return (M, Q) => e.detail ? (n(), m("form", {
      key: 0,
      class: "work-board-identity",
      "aria-label": "Edit board details",
      onSubmit: Oe(oe, ["prevent"])
    }, [
      r("div", Jv, [
        r("label", {
          for: c(f),
          class: "work-row-main work-row-title"
        }, "Board name", 8, Zv),
        k(c(Ie), {
          id: c(f),
          modelValue: v.value,
          "onUpdate:modelValue": Q[0] || (Q[0] = (F) => v.value = F),
          required: "",
          disabled: u.value || !g.value
        }, null, 8, ["id", "modelValue", "disabled"])
      ]),
      r("div", Qv, [
        r("div", _v, [
          r("h3", {
            class: "work-row-title",
            id: c(w)
          }, "Board app", 8, ef),
          Q[9] || (Q[9] = r("p", { class: "work-muted work-small" }, "Opens the board from Work navigation.", -1))
        ]),
        k(c(me), {
          modelValue: i.value,
          "onUpdate:modelValue": Q[1] || (Q[1] = (F) => i.value = F),
          "aria-labelledby": c(w),
          options: $.value,
          placeholder: S.value,
          optionLabel: "title",
          optionValue: "id",
          optionDisabled: "disabled",
          appendTo: "self",
          disabled: u.value || !g.value || !I.value
        }, null, 8, ["modelValue", "aria-labelledby", "options", "placeholder", "disabled"])
      ]),
      Je(M.$slots, "default"),
      k(Ne, {
        open: d.value,
        "onUpdate:open": Q[4] || (Q[4] = (F) => d.value = F),
        class: "work-board-appearance",
        label: "Board description and icon"
      }, {
        default: W(() => [
          r("div", tf, [
            r("label", af, [
              Q[10] || (Q[10] = q("Description", -1)),
              k(c(ha), {
                modelValue: p.value,
                "onUpdate:modelValue": Q[2] || (Q[2] = (F) => p.value = F),
                rows: "1",
                disabled: u.value || !g.value
              }, null, 8, ["modelValue", "disabled"])
            ]),
            r("div", lf, [
              Q[11] || (Q[11] = r("span", null, "Board icon", -1)),
              s.value ? (n(), m("wc-icon-picker", {
                key: 0,
                value: h.value,
                fallback: "tabler:layout-kanban",
                inert: u.value || !g.value || void 0,
                onSelect: Q[3] || (Q[3] = (F) => h.value = F.detail)
              }, null, 40, of)) : (n(), m("p", nf, "The icon picker is unavailable."))
            ])
          ])
        ]),
        _: 1
      }, 8, ["open"]),
      fe.value || x.value || y.value ? (n(), m("div", sf, [
        x.value ? (n(), m("p", rf, D(x.value), 1)) : y.value && !fe.value ? (n(), m("p", df, D(y.value), 1)) : T("", !0),
        fe.value ? (n(), m(_, { key: 2 }, [
          k(c(te), {
            label: "Save board details",
            type: "submit",
            size: "small",
            disabled: !v.value.trim() || u.value || !g.value,
            loading: u.value
          }, null, 8, ["disabled", "loading"]),
          k(c(te), {
            label: "Cancel",
            type: "button",
            severity: "secondary",
            text: "",
            size: "small",
            disabled: u.value,
            onClick: be
          }, null, 8, ["disabled"])
        ], 64)) : T("", !0)
      ])) : T("", !0)
    ], 32)) : (n(), m("div", uf, [
      o.value ? (n(), m("form", {
        key: 0,
        class: "work-identity-edit",
        "aria-label": "Edit board",
        onClick: Q[8] || (Q[8] = Oe(() => {
        }, ["stop"])),
        onSubmit: Oe(oe, ["prevent"])
      }, [
        r("label", cf, [
          Q[12] || (Q[12] = q("Title", -1)),
          k(c(Ie), {
            modelValue: v.value,
            "onUpdate:modelValue": Q[5] || (Q[5] = (F) => v.value = F),
            required: "",
            autofocus: "",
            disabled: u.value
          }, null, 8, ["modelValue", "disabled"])
        ]),
        r("label", vf, [
          Q[13] || (Q[13] = q("Description", -1)),
          k(c(ha), {
            modelValue: p.value,
            "onUpdate:modelValue": Q[6] || (Q[6] = (F) => p.value = F),
            rows: "1",
            disabled: u.value
          }, null, 8, ["modelValue", "disabled"])
        ]),
        r("div", ff, [
          Q[14] || (Q[14] = r("span", null, "Board icon", -1)),
          s.value ? (n(), m("wc-icon-picker", {
            key: 0,
            value: h.value,
            fallback: "tabler:layout-kanban",
            inert: u.value || void 0,
            onSelect: Q[7] || (Q[7] = (F) => h.value = F.detail)
          }, null, 40, mf)) : (n(), m("p", pf, "The icon picker is unavailable."))
        ]),
        r("div", bf, [
          k(c(te), {
            label: "Save",
            severity: "secondary",
            type: "submit",
            disabled: !v.value.trim() || u.value,
            loading: u.value,
            outlined: ""
          }, {
            icon: W(() => [
              k(c(pe), {
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
            onClick: be,
            outlined: ""
          }, {
            icon: W(() => [
              k(c(pe), {
                icon: "tabler:x",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled"])
        ])
      ], 32)) : (n(), m(_, { key: 1 }, [
        r("div", gf, [
          r("div", hf, [
            e.board?.icon ? (n(), H(c(pe), {
              key: 0,
              icon: e.board.icon,
              "aria-hidden": "true"
            }, null, 8, ["icon"])) : T("", !0),
            (n(), H(ta(e.compact ? "h2" : "h1"), {
              class: ct(e.compact ? "kx-card-name" : "kx-title")
            }, {
              default: W(() => [
                q(D(e.board?.title || "Untitled board"), 1)
              ]),
              _: 1
            }, 8, ["class"]))
          ]),
          e.compact ? Je(M.$slots, "title-end", {}, void 0, void 0, 0) : T("", !0),
          e.compact ? (n(), m("span", yf, [
            g.value ? (n(), H(c(te), {
              key: 0,
              severity: "secondary",
              text: "",
              size: "small",
              onClick: Oe(se, ["stop"]),
              "aria-label": "Edit board"
            }, {
              default: W(() => [
                k(c(pe), {
                  icon: "tabler:pencil",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            })) : T("", !0),
            Je(M.$slots, "actions")
          ])) : g.value ? (n(), H(c(te), {
            key: 2,
            severity: "secondary",
            text: "",
            size: "small",
            onClick: Oe(se, ["stop"]),
            "aria-label": "Edit board"
          }, {
            default: W(() => [
              k(c(pe), {
                icon: "tabler:pencil",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          })) : T("", !0),
          e.compact ? T("", !0) : Je(M.$slots, "title-end", {}, void 0, void 0, 3)
        ]),
        !e.compact && (e.subtitle || e.board?.description) ? (n(), m("p", {
          key: 0,
          class: "kx-head-sub",
          title: e.subtitle || e.board?.description
        }, D(e.subtitle || e.board?.description), 9, kf)) : T("", !0)
      ], 64)),
      x.value ? (n(), m("p", wf, D(x.value), 1)) : T("", !0),
      y.value ? (n(), m("p", $f, D(y.value), 1)) : T("", !0)
    ]));
  }
}), xf = { class: "work-ia-section work-ia-general" }, Cf = {
  class: "work-settings-list work-board-details",
  "aria-label": "Board details"
}, Sf = {
  key: 0,
  class: "work-settings-row"
}, Tf = { class: "work-settings-row" }, If = { class: "work-row-main" }, Df = ["for"], Ef = { class: "work-muted work-small" }, Uf = {
  class: "work-board-summary work-row work-wrap work-small",
  "aria-label": "Board summary"
}, Af = { class: "work-muted" }, Rf = { key: 0 }, Pf = { key: 1 }, Of = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, Nf = {
  key: 0,
  class: "work-stack work-tight"
}, Mf = {
  key: 0,
  class: "work-stack work-tight"
}, Ff = {
  key: 1,
  class: "work-muted"
}, Lf = { class: "work-stack work-tight" }, Bf = { class: "work-spacer" }, jf = /* @__PURE__ */ Ve({
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
    const a = e, t = qt(), l = {
      comments_per_item: "Comments per item",
      audit: "Change history",
      audit_days: "Change history retention",
      interval_days: "Time-in-state history retention",
      trash_days: "Trash retention",
      tombstone_days: "Deletion record retention"
    }, o = z(() => Object.keys(l).filter((y) => a.draft.policy?.[y] !== void 0));
    function d(y) {
      const g = a.draft.policy?.[y];
      return y === "audit" ? g === "off" ? "Off" : "Track field changes" : y === "comments_per_item" ? g : g === 0 ? y === "audit_days" || y === "interval_days" ? "365 days" : "Clean up immediately" : g === 1 ? "1 day" : g + " days";
    }
    const v = j(), p = j(!1);
    let h = "";
    Se([() => a.active, () => a.board?.board_id, () => a.schema.generation], async ([y, g, f], w, V) => {
      if (!y || !g || h === g + "/" + f) return;
      v.value = void 0, p.value = !1;
      let $ = !0;
      V(() => $ = !1);
      try {
        const S = await Promise.all(Array.from(
          { length: Math.min(3, Math.max(0, f - 1)) },
          (I, B) => It.schema(g, f - B - 1)
        ));
        $ && (v.value = S, h = g + "/" + f);
      } catch {
        $ && (p.value = !0);
      }
    }, { immediate: !0 });
    function i(y) {
      return JSON.stringify(y, (g, f) => f && typeof f == "object" && !Array.isArray(f) ? Object.fromEntries(Object.entries(f).sort(([w], [V]) => w.localeCompare(V))) : f);
    }
    function s(y, g) {
      if (!g) return ["Initial board setup"];
      const f = y.declaration, w = g.declaration, V = [], $ = [
        ["Fields", f.fields, w.fields],
        ["Item types", f.item_types, w.item_types],
        ["Workflow", f.processes, w.processes],
        ["Links", f.relation_types, w.relation_types],
        ["Plugins and filters", [f.plugins, f.scopes], [w.plugins, w.scopes]],
        ["Item visibility", f.visibility, w.visibility],
        ["Board rules", f.policy, w.policy],
        ["Starting pack", y.pack, g.pack],
        ["Item key prefix", y.key_prefix, g.key_prefix]
      ];
      if (i(f.fields) !== i(w.fields)) {
        const I = f.fields?.filter((B) => !w.fields?.some((le) => le.code === B.code)) ?? [];
        I.length === 1 && V.push("Added " + He(I[0]));
      }
      const S = $.filter(([, I, B]) => i(I) !== i(B)).map(([I]) => I).filter((I) => I !== "Fields" || !V.length);
      return S.length && V.push(S.join(", ") + " updated"), V.length ? V : ["Board setup updated"];
    }
    const u = j(!1), x = z(() => {
      if (!v.value || a.schema.generation < 1) return [];
      const y = [a.schema, ...v.value];
      return y.slice(0, 3).map((g, f) => s(g, y[f + 1]));
    });
    return (y, g) => (n(), m("section", xf, [
      r("section", Cf, [
        e.board ? (n(), m("div", Sf, [
          g[8] || (g[8] = r("div", { class: "work-row-main" }, [
            r("h3", { class: "work-row-title" }, "Board access"),
            r("p", { class: "work-muted work-small" }, "Give people and groups access to this board.")
          ], -1)),
          r("div", null, [
            k(c(te), {
              label: "Share board",
              type: "button",
              severity: "secondary",
              outlined: "",
              onClick: g[0] || (g[0] = (f) => y.$emit("share"))
            }, {
              icon: W(() => [
                k(c(pe), {
                  icon: "tabler:share",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            })
          ])
        ])) : T("", !0),
        (n(), H(Vf, {
          key: e.board?.board_id,
          board: e.board,
          "board-apps": e.boardApps,
          detail: "",
          onDirtyChange: g[2] || (g[2] = (f) => y.$emit("dirty-change", f)),
          onSaved: g[3] || (g[3] = (f) => y.$emit("saved"))
        }, {
          default: W(() => [
            r("div", Tf, [
              r("div", If, [
                r("label", {
                  class: "work-row-title",
                  for: c(t)
                }, "Item key prefix", 8, Df),
                r("p", Ef, "Shown on items, for example " + D(e.draft.key_prefix || "WORK") + "-1.", 1)
              ]),
              k(c(Ie), {
                id: c(t),
                modelValue: e.draft.key_prefix,
                "onUpdate:modelValue": g[1] || (g[1] = (f) => e.draft.key_prefix = f),
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
      r("section", Uf, [
        r("p", Af, [
          e.board?.open_count !== void 0 && e.board.item_count !== void 0 ? (n(), m("span", Rf, D(e.board.open_count) + " open · " + D(e.board.item_count) + " total · ", 1)) : T("", !0),
          q(" " + D(e.packTitle || "No pack installed"), 1),
          e.outdated ? (n(), m("span", Pf, " · Update available")) : T("", !0)
        ]),
        e.packError ? (n(), m("p", Of, D(e.packError), 1)) : T("", !0),
        e.packError ? (n(), H(c(te), {
          key: 1,
          label: "Reload packs",
          severity: "secondary",
          outlined: "",
          size: "small",
          onClick: g[4] || (g[4] = (f) => y.$emit("retry"))
        })) : T("", !0),
        e.packTitle ? e.outdated ? (n(), H(c(te), {
          key: 3,
          label: "Update pack",
          severity: "secondary",
          outlined: "",
          size: "small",
          disabled: !e.canUpgrade,
          title: e.upgradeReason,
          onClick: g[6] || (g[6] = (f) => y.$emit("upgrade"))
        }, null, 8, ["disabled", "title"])) : T("", !0) : (n(), H(c(te), {
          key: 2,
          label: "Install pack",
          severity: "secondary",
          outlined: "",
          size: "small",
          disabled: !e.canInstall,
          onClick: g[5] || (g[5] = (f) => y.$emit("install"))
        }, null, 8, ["disabled"]))
      ]),
      e.schema.pack ? (n(), H(Ne, {
        key: 0,
        open: u.value,
        "onUpdate:open": g[7] || (g[7] = (f) => u.value = f),
        class: "work-disclosure work-small",
        label: "Technical details"
      }, {
        default: W(() => [
          u.value ? (n(), m("dl", Nf, [
            r("div", null, [
              g[9] || (g[9] = r("dt", null, "Pack ID", -1)),
              r("dd", null, [
                r("code", null, D(e.schema.pack.id), 1)
              ])
            ]),
            r("div", null, [
              g[10] || (g[10] = r("dt", null, "Pack version", -1)),
              r("dd", null, D(e.schema.pack.version), 1)
            ]),
            g[11] || (g[11] = r("div", null, [
              r("dt", null, "Pack tools"),
              r("dd", null, [
                r("code", null, "WorkPackPlan"),
                q(", "),
                r("code", null, "WorkPackApply")
              ])
            ], -1))
          ])) : T("", !0)
        ]),
        _: 1
      }, 8, ["open"])) : T("", !0),
      k(Ne, {
        class: "work-disclosure",
        label: "Recent setup changes"
      }, {
        default: W(() => [
          x.value.length ? (n(), m("ul", Mf, [
            (n(!0), m(_, null, ce(x.value, (f, w) => (n(), m("li", { key: w }, D(f.join(" · ")), 1))), 128))
          ])) : (n(), m("p", Ff, D(p.value ? "Recent changes are unavailable." : v.value ? "No setup changes yet." : "Loading recent changes…"), 1))
        ]),
        _: 1
      }),
      o.value.length ? (n(), H(Ne, {
        key: 1,
        class: "work-settings-card work-disclosure",
        label: "Advanced · Existing board overrides"
      }, {
        default: W(() => [
          g[12] || (g[12] = r("p", { class: "work-muted" }, "Clear an override to use the Work application default.", -1)),
          r("ul", Lf, [
            (n(!0), m(_, null, ce(o.value, (f) => (n(), m("li", {
              key: f,
              class: "work-row work-wrap"
            }, [
              r("span", Bf, D(l[f]) + " · " + D(d(f)), 1),
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
      })) : T("", !0)
    ]));
  }
}), je = (e, a) => `${e} → ${a}`, go = (e, a) => {
  const t = e.fields?.find((l) => l.code === a);
  return t ? He(t) : "Untitled field";
}, ho = {
  comments_per_item: "Comments per item",
  stage_timeout: "Default attempt timeout",
  stage_max_visits: "Default maximum visits",
  audit: "Audit trail",
  audit_days: "Audit history",
  trash_days: "Keep trashed items",
  tombstone_days: "Keep deletion records",
  interval_days: "Keep state history"
};
function yo(e, a) {
  if (a === void 0) return "Application default";
  if (e === "audit") return Ae(String(a));
  if (e === "stage_timeout") {
    const t = ua(String(a));
    if (t) return `${t.amount.toLocaleString()} ${t.amount === 1 ? t.unit.slice(0, -1) : t.unit}`;
  }
  if (e.endsWith("_days")) {
    const t = a === 0 && (e === "audit_days" || e === "interval_days") ? 365 : a;
    return `${t} ${t === 1 ? "day" : "days"}`;
  }
  return String(a);
}
function zf(e, a) {
  const t = e.policy ?? {}, l = a.policy ?? {}, o = Object.keys(ho).flatMap((p) => t[p] === l[p] ? [] : [`${ho[p]} · ${je(yo(p, t[p]), yo(p, l[p]))}`]), d = (p) => p ? `${p.limit}${p.hard ? " (hard limit)" : ""}` : "No limit", v = /* @__PURE__ */ new Set([...Object.keys(t.wip ?? {}), ...Object.keys(l.wip ?? {})]);
  for (const p of v) {
    const h = d(t.wip?.[p]), i = d(l.wip?.[p]);
    if (h === i) continue;
    const s = (a.processes ?? []).flatMap((u) => u.states).find((u) => u.id === p) ?? (e.processes ?? []).flatMap((u) => u.states).find((u) => u.id === p);
    o.push(`${ge(s)} limit · ${je(h, i)}`);
  }
  return o;
}
function qf(e, a, t) {
  const l = e.visibility, o = a.visibility, d = [];
  l?.field !== o?.field && d.push(je(
    l ? go(e, l.field) : "No additional restriction",
    o ? go(a, o.field) : "No additional restriction"
  ));
  const v = l?.levels ?? [], p = o?.levels ?? [], h = new Set([...v, ...p].map((i) => i.id));
  for (const i of h) {
    const s = v.find((f) => f.id === i), u = p.find((f) => f.id === i);
    if (s && u && JSON.stringify(s.holders) === JSON.stringify(u.holders)) continue;
    const x = (f) => f.fields?.find((w) => w.code === f.visibility?.field)?.options?.find((w) => w.id === i)?.label, y = x(a) || x(e) || Ae(i), g = (f) => f ? f.holders.map(t).join(", ") || "No extra access" : "No level";
    d.push(`${y} · ${je(g(s), g(u))}`);
  }
  return l?.bypass !== o?.bypass && d.push(o?.bypass === "admin" ? "Board administrators can see every level." : "Visibility levels now apply to board administrators."), d;
}
const ca = {
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
function Wf(e, a, t) {
  const { what: l, detail: o, to: d } = e, p = `${t?.name || a?.name || "Untitled workflow"} · ${ca[l] ?? "Workflow changed"}`, h = l.startsWith("state.") ? a?.states.find((y) => y.id === o) : void 0, i = l.startsWith("state.") ? t?.states.find((y) => y.id === o) : void 0, s = l.startsWith("transition.") ? a?.transitions?.find((y) => y.id === o) : void 0, u = l.startsWith("transition.") ? t?.transitions?.find((y) => y.id === o) : void 0;
  let x = "";
  if (l === "state.map") x = je(ge(h), ge(t?.states.find((y) => y.id === d)));
  else if (l === "state.name") x = je(ge(h), ge(i));
  else if (l === "state.kind") x = `${ge(i)} · ${je(La(h?.kind), La(i?.kind))}`;
  else if (l === "state.category" && h && i) x = `${ge(i)} · ${je(At(h.category), At(i.category))}`;
  else if (i || h) x = ge(i ?? h);
  else if (l === "transition.name" && s && u) x = je(ze(s), ze(u));
  else if (u && s && u.to !== s.to) {
    const y = ge(a?.states.find((f) => f.id === s.to)), g = ge(t?.states.find((f) => f.id === u.to));
    return { title: p, details: [ze(u), `Destination changes from ${y} to ${g}.`] };
  } else if (l === "transition.add" && u && t) {
    const y = u.from === "any" ? "Any state" : u.from.map((f) => ge(t.states.find((w) => w.id === f))).join(", "), g = ge(t.states.find((f) => f.id === u.to));
    return { title: p, details: [ze(u), je(y, g), ...u.auto ? ["Runs automatically."] : []] };
  } else u ? x = ze(u) : s ? x = ze(s) : l === "initial" ? x = je(ge(a?.states.find((y) => y.id === a.initial)), ge(t?.states.find((y) => y.id === t.initial))) : l === "name" && (x = je(a?.name || "Untitled workflow", t?.name || "Untitled workflow"));
  return { title: p, details: x ? [x] : [] };
}
function Gf(e, a, t, l) {
  const { code: o, what: d, detail: v } = e;
  if (o === "schema" || d === "visibility.remove")
    return d === "policy" ? { title: "Board limits and defaults", details: zf(a, t) } : d.startsWith("visibility") ? { title: "Who can see items", details: qf(a, t, l) } : d === "key_prefix" ? { title: "Item key prefix", details: [je(a.key_prefix ?? "Default", t.key_prefix ?? "Default")] } : { title: { plugins: "Board plugins changed", scopes: "Saved query filters changed", "rollup.recompute": "Calculated totals will update" }[d] ?? "Board settings changed", details: [] };
  if (o.startsWith("process ")) {
    const u = o.slice(8);
    return Wf(e, a.processes?.find((x) => x.id === u), t.processes?.find((x) => x.id === u));
  }
  if (o.startsWith("item_type ")) {
    const u = o.slice(10), x = a.item_types?.find((f) => f.id === u), y = t.item_types?.find((f) => f.id === u);
    return { title: `${y?.title || x?.title || "Item type"} · ${ca[d] ?? "Item type changed"}`, details: d === "title" ? [je(x?.title || "Untitled item type", y?.title || "Untitled item type")] : [] };
  }
  if (o.startsWith("relation ")) {
    const u = o.slice(9), x = a.relation_types?.find((f) => f.id === u), y = t.relation_types?.find((f) => f.id === u), g = d === "label" ? [je([x?.outward, x?.inward].filter(Boolean).join(" / "), [y?.outward, y?.inward].filter(Boolean).join(" / "))] : [];
    return { title: `${y?.outward || x?.outward || "Link type"} · ${ca[d] ?? "Link type changed"}`, details: g };
  }
  const p = t.fields?.find((u) => u.code === o), h = a.fields?.find((u) => p?.id !== void 0 ? u.id === p.id : u.code === (d.startsWith("renamed from ") ? d.slice(13) : o)), i = p ?? h;
  if (!i) return { title: ca[d] ?? "Board settings changed", details: [] };
  const s = `${He(i)} · ${d.startsWith("renamed from ") ? "Field key" : ca[d] ?? "Field settings changed"}`;
  if (d.startsWith("options.")) {
    const u = h?.options ?? [], x = p?.options ?? [], y = u.findIndex((S) => S.id === v), g = x.findIndex((S) => S.id === v), f = u[y], w = x[g], V = w?.label || f?.label || "Untitled choice", $ = f && w && f.label !== w.label ? [] : [V];
    if (f && w) {
      f.label !== w.label && $.push(je(f.label || "Untitled choice", w.label || "Untitled choice")), f.category !== w.category && $.push(`Category · ${je(f.category ? At(f.category) : "None", w.category ? At(w.category) : "None")}`);
      const S = f.order ?? y + 1, I = w.order ?? g + 1;
      S !== I && $.push(`Order · ${je(S, I)}`), f.color !== w.color && $.push(`Color · ${je(f.color ?? "Default", w.color ?? "Default")}`);
    }
    return { title: s, details: $ };
  }
  return d === "title" && h && p ? { title: s, details: [je(He(h), He(p))] } : { title: s, details: [] };
}
const Kf = {
  key: 0,
  class: "work-settings-card work-schema-plan work-stack",
  "aria-label": "Schema review"
}, Hf = { key: 0 }, Yf = { class: "work-row work-wrap" }, Xf = { class: "work-muted" }, Jf = {
  key: 0,
  class: "work-stack work-tight",
  "aria-label": "Plugin configuration"
}, Zf = {
  key: 1,
  class: "work-notice"
}, Qf = {
  key: 2,
  class: "work-notice"
}, _f = {
  key: 3,
  class: "work-stack work-tight",
  "aria-label": "Reviewed Flow bindings"
}, em = { key: 4 }, tm = {
  key: 5,
  class: "work-settings-table"
}, am = { key: 0 }, lm = /* @__PURE__ */ Ve({
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
    const a = e, t = {}, l = z(() => a.original ?? t), o = z(() => a.declaration ?? t), d = z(() => (a.plugins ?? []).flatMap((S) => {
      if (!S.config_schema) return [];
      const I = a.pluginConfigs?.[S.plugin], B = !l.value.plugins?.some((J) => J.use === S.plugin) && o.value.plugins?.some((J) => J.use === S.plugin);
      if (!I && !B) return [];
      const le = Ol(S.config_schema).map((J) => {
        const se = I?.[J.key];
        return S.plugin === "kickside.work.planning:plugin" && J.key === "issue_types" ? { title: "Plan these item types", value: (Array.isArray(se) ? se.map((fe) => o.value.item_types?.find((be) => be.id === fe)?.title || Ae(fe)) : []).join(", ") || "Uses default" } : se === void 0 ? { title: J.title, value: "Uses default" } : J.schema.writeOnly || J.schema.format === "password" || typeof se == "object" ? { title: J.title, value: "Set" } : { title: J.title, value: typeof se == "boolean" ? se ? "On" : "Off" : String(se) };
      });
      return le.length ? [{ id: S.plugin, title: S.title || S.plugin, fields: le }] : [];
    })), v = z(() => (o.value.processes ?? []).flatMap((S) => S.states.flatMap((I) => {
      const B = I.run?.flow_ref;
      return B ? [{ key: S.id + ":" + I.id, process: S.name || "Untitled process", state: ge(I), reference: B }] : [];
    }))), p = j(/* @__PURE__ */ new Map());
    Se(v, async (S, I, B) => {
      const le = /* @__PURE__ */ new Map();
      p.value = le;
      let J = !0;
      B(() => J = !1), await Promise.all([...new Set(S.map((se) => se.reference.id))].map(async (se) => {
        try {
          const ue = (await Al.title(se))?.trim();
          J && ue && !Si(ue) && p.value.set(se, ue);
        } catch {
          J && p.value.set(se, "Flow title unavailable");
        }
      }));
    }, { immediate: !0 });
    const h = z(() => [l.value, o.value].flatMap((S) => (S.visibility?.levels ?? []).flatMap((I) => I.holders.flatMap((B) => "group" in B ? [{ kind: "group", id: B.group }] : "user" in B ? [{ kind: "user", id: B.user }] : [])))), i = Io(() => a.boardId ?? "", h);
    function s(S) {
      if ("user" in S) return i.label({ kind: "user", id: S.user });
      if ("group" in S) return i.label({ kind: "group", id: S.group });
      if ("field" in S) {
        const I = o.value.fields?.find((B) => B.code === S.field) ?? l.value.fields?.find((B) => B.code === S.field);
        return I ? He(I) : "People from a field";
      }
      return "Service";
    }
    const u = (S) => S.map((I) => {
      const B = Gf(I, l.value, o.value, s);
      if (I.what === "plugins") {
        const le = new Set(l.value.plugins?.map((se) => se.use)), J = new Set(o.value.plugins?.map((se) => se.use));
        for (const se of a.plugins ?? [])
          le.has(se.plugin) !== J.has(se.plugin) && B.details.push((J.has(se.plugin) ? "Enable " : "Turn off ") + (se.title || "an available plugin"));
      }
      if (I.what === "plugin.config") {
        const le = a.plugins?.find((J) => J.plugin === I.code);
        return { change: I, title: (le?.title || "Plugin") + " settings changed", details: [] };
      }
      return { change: I, ...B };
    }), x = z(() => u(a.plan?.changes.filter((S) => S.class !== "refused") ?? [])), y = z(() => u(a.plan?.refused ?? [])), g = z(() => {
      const S = a.plan?.migration;
      return !S || !y.value.length ? S : y.value.every((I) => I.change.what === "options.remove") ? "Add a new field with the choices you want to keep. Copy existing values into it before removing the old field." : y.value.every((I) => I.change.what === "state.remove") ? "Choose where existing items should move before removing their state." : S;
    }), f = {
      unchanged: ["No changes", "secondary"],
      cosmetic: ["Labels or settings", "secondary"],
      additive: ["New definitions", "success"],
      semantic: ["Affects existing items", "warn"],
      refused: ["Blocked", "danger"],
      initial: ["First setup", "secondary"]
    }, w = (S) => f[S]?.[0] ?? "Review needed", V = (S) => f[S]?.[1] ?? "secondary";
    function $(S) {
      const { detail: I, ...B } = S;
      return Ha(S.what === "invalid" || S.what.startsWith("views.") || S.what.startsWith("automation") ? S : B);
    }
    return (S, I) => e.plan ? (n(), m("section", Kf, [
      !e.plan.changes.length && !e.plan.refused.length && !e.configCount && !e.packReview ? (n(), m("p", Hf, "No changes to apply.")) : (n(), m(_, { key: 1 }, [
        r("header", Yf, [
          I[0] || (I[0] = r("h3", null, "Impact on this board", -1)),
          k(c(tt), {
            class: "kx-tag-sm",
            severity: V(e.plan.class)
          }, {
            default: W(() => [
              q(D(w(e.plan.class)), 1)
            ]),
            _: 1
          }, 8, ["severity"])
        ]),
        r("p", Xf, D(c(Ti)[e.plan.class] || "Review the changes below."), 1),
        d.value.length ? (n(), m("section", Jf, [
          I[1] || (I[1] = r("h3", null, "Plugin configuration", -1)),
          (n(!0), m(_, null, ce(d.value, (B) => (n(), m("div", {
            key: B.id
          }, [
            r("strong", null, D(B.title), 1),
            (n(!0), m(_, null, ce(B.fields, (le) => (n(), m("p", {
              key: le.title
            }, D(le.title) + " · " + D(le.value), 1))), 128))
          ]))), 128))
        ])) : T("", !0),
        g.value ? (n(), m("p", Zf, D(g.value), 1)) : e.follows.length ? (n(), m("p", Qf, "Existing items in " + D(e.follows.join(", ")) + " will follow the updated workflow.", 1)) : T("", !0),
        v.value.length ? (n(), m("section", _f, [
          I[2] || (I[2] = r("h3", null, "Flow bindings", -1)),
          (n(!0), m(_, null, ce(v.value, (B) => (n(), m("p", {
            key: B.key
          }, [
            q(D(B.process) + " / " + D(B.state) + " · ", 1),
            r("strong", null, D(p.value.get(B.reference.id) ?? "Published Flow") + " · v" + D(B.reference.version), 1)
          ]))), 128)),
          I[3] || (I[3] = r("p", { class: "work-muted work-small" }, "New entries use these exact published versions. Before replacing a binding, stop new entries, let existing runs and deliveries finish, pause the old launcher, save, then resume entries.", -1))
        ])) : T("", !0),
        Je(S.$slots, "default"),
        y.value.length ? (n(), m("h3", em, "Blocked changes")) : T("", !0),
        (n(!0), m(_, null, ce(y.value, (B, le) => (n(), H(c(Fi), {
          key: le,
          severity: "error",
          role: "alert"
        }, {
          default: W(() => [
            r("strong", null, D(B.title), 1),
            (n(!0), m(_, null, ce(B.details, (J, se) => (n(), m("p", { key: se }, D(J), 1))), 128)),
            r("p", null, D($(B.change)), 1),
            k(Ne, {
              class: "work-small",
              label: "Technical details"
            }, {
              default: W(() => [
                r("code", null, D(B.change.what), 1)
              ]),
              _: 2
            }, 1024)
          ]),
          _: 2
        }, 1024))), 128)),
        x.value.length ? (n(), m("table", tm, [
          I[4] || (I[4] = r("thead", null, [
            r("tr", null, [
              r("th", { scope: "col" }, "Change"),
              r("th", { scope: "col" }, "Impact")
            ])
          ], -1)),
          r("tbody", null, [
            (n(!0), m(_, null, ce(x.value, (B, le) => (n(), m("tr", { key: le }, [
              r("td", null, [
                r("strong", null, D(B.title), 1),
                (n(!0), m(_, null, ce(B.details, (J, se) => (n(), m("p", { key: se }, D(J), 1))), 128)),
                B.change.count ? (n(), m("p", am, D(B.change.count) + " " + D(B.change.count === 1 ? "item" : "items"), 1)) : T("", !0)
              ]),
              r("td", null, [
                k(c(tt), {
                  class: "kx-tag-sm",
                  severity: V(B.change.class)
                }, {
                  default: W(() => [
                    q(D(w(B.change.class)), 1)
                  ]),
                  _: 2
                }, 1032, ["severity"])
              ])
            ]))), 128))
          ])
        ])) : T("", !0)
      ], 64))
    ])) : T("", !0);
  }
}), om = {
  class: "work-stack work-tight",
  "aria-label": "Pack resources"
}, im = {
  key: 0,
  class: "work-muted work-small"
}, nm = {
  key: 0,
  class: "work-stack",
  "aria-label": "Pack conflicts"
}, sm = { class: "work-stack work-tight work-pack-review-field" }, rm = { class: "work-config-fields" }, dm = { class: "work-json-example" }, um = { class: "work-json-example" }, cm = {
  key: 1,
  class: "work-stack",
  "aria-label": "Pack state maps"
}, vm = /* @__PURE__ */ Ve({
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
      const [u, ...x] = s.split("."), y = x.join(".");
      return u === "processes" ? d(y) : u === "fields" ? t.original.fields?.find((g) => g.code === y)?.title || Ae(y) : u === "item_types" ? t.original.item_types?.find((g) => g.id === y)?.title || Ae(y) : Ae(u);
    }
    function p(s) {
      return JSON.stringify(s ?? null, null, 2);
    }
    function h(s, u) {
      (t.request.resolutions ??= {})[s] = u, l("change");
    }
    function i(s, u, x) {
      ((t.request.maps ??= {})[s] ??= {})[u] = x, l("change");
    }
    return (s, u) => (n(), m(_, null, [
      r("section", om, [
        u[1] || (u[1] = r("h3", null, "Pack resources", -1)),
        r("p", null, [
          u[0] || (u[0] = q("Target version ", -1)),
          r("strong", null, D(e.plan.version), 1)
        ]),
        o.value.length ? (n(), m("p", im, "Resources included in this plan.")) : T("", !0),
        (n(!0), m(_, null, ce(o.value, (x) => (n(), m("div", {
          key: x.label
        }, [
          r("h4", null, D(x.label), 1),
          r("ul", null, [
            (n(!0), m(_, null, ce(x.entries, (y) => (n(), m("li", {
              key: y.id
            }, D(y.name), 1))), 128))
          ])
        ]))), 128))
      ]),
      e.plan.conflicts.length ? (n(), m("section", nm, [
        u[4] || (u[4] = r("h3", null, "Local edits conflict", -1)),
        u[5] || (u[5] = r("p", { class: "work-muted work-small" }, "Choose which declaration to keep for each conflict, then review again.", -1)),
        (n(!0), m(_, null, ce(e.plan.conflicts, (x) => (n(), m("div", {
          key: x.path,
          class: "work-stack work-tight"
        }, [
          r("label", sm, [
            q(D(v(x.path)), 1),
            k(c(me), {
              "model-value": e.request.resolutions?.[x.path],
              "aria-label": "Resolution for " + v(x.path),
              disabled: e.disabled,
              appendTo: "self",
              placeholder: "Choose a resolution",
              optionLabel: "label",
              optionValue: "value",
              options: [{ label: "Keep local edits", value: "local" }, { label: "Use pack changes", value: "incoming" }],
              "onUpdate:modelValue": (y) => h(x.path, y)
            }, null, 8, ["model-value", "aria-label", "disabled", "onUpdate:modelValue"])
          ]),
          k(Ne, {
            class: "work-json-disclosure",
            label: "Compare declarations"
          }, {
            default: W(() => [
              r("div", rm, [
                r("section", null, [
                  u[2] || (u[2] = r("h4", null, "Local edits", -1)),
                  r("pre", dm, D(p(x.local_value)), 1)
                ]),
                r("section", null, [
                  u[3] || (u[3] = r("h4", null, "Pack changes", -1)),
                  r("pre", um, D(p(x.incoming)), 1)
                ])
              ])
            ]),
            _: 2
          }, 1024)
        ]))), 128))
      ])) : T("", !0),
      Object.keys(e.plan.maps).length ? (n(), m("section", cm, [
        u[6] || (u[6] = r("h3", null, "Required state maps", -1)),
        u[7] || (u[7] = r("p", { class: "work-muted work-small" }, "Review the proposed destinations for existing items. Each destination is editable.", -1)),
        (n(!0), m(_, null, ce(e.plan.maps, (x, y) => (n(), m("div", {
          key: y,
          class: "work-stack"
        }, [
          r("h4", null, D(d(y)), 1),
          (n(!0), m(_, null, ce(x, (g, f) => (n(), m("label", {
            key: f,
            class: "work-stack work-tight work-pack-review-field"
          }, [
            q("Move items from " + D(c(ge)(e.original.processes?.find((w) => w.id === y)?.states.find((w) => w.id === f))), 1),
            k(c(me), {
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
      ])) : T("", !0)
    ], 64));
  }
});
function fm(e) {
  const { schema: a, configs: t, busy: l } = e, { packs: o, loading: d, error: v, load: p, reset: h } = Ii(), i = z(() => o.value.filter(Di)), s = z(() => o.value.map(Ei)), u = j(!1), x = j(""), y = z(() => s.value.find((K) => K.id === x.value && !K.disabled)), g = j(), f = j(), w = j(), V = j(!1), $ = j(""), S = j(), I = j(""), B = z(() => S.value?.result), le = z(() => !!B.value && B.value.status !== "done"), J = z(() => !!g.value || e.schemaDirty()), se = z(() => !l.value && !J.value && !e.migrationPending() && !le.value), ue = z(() => V.value ? f.value : void 0), fe = z(() => !!ue.value && !!w.value && JSON.stringify(w.value.request) === JSON.stringify(g.value)), be = z(() => e.canReview() && !e.migrationPending() && !l.value && fe.value && ue.value?.class !== "refused" && !ue.value?.refused.length && f.value?.conflicts.every((K) => !!g.value?.resolutions?.[K.path])), oe = z(() => i.value.find((K) => K.id === g.value?.pack)?.plugins.filter((K) => !a.value?.plugins?.some((ve) => ve.plugin === K.plugin && ve.active)).map((K) => ({ use: K.plugin })) ?? []), M = z(() => i.value.find((K) => K.id === a.value?.pack?.id)?.title || "Installed pack"), Q = z(() => !v.value && !!a.value?.outdated && s.value.some((K) => K.id === a.value?.pack?.id && !K.disabled)), F = z(() => v.value ? "Reload packs to check available upgrades." : le.value ? "Finish the current pack installation before upgrading." : Q.value ? J.value ? "Discard the current draft before upgrading." : e.migrationPending() ? "Finish the current migration before upgrading." : l.value ? "Wait for the current request to finish." : void 0 : "Install an available version of this pack to upgrade."), ne = _t();
  function ke() {
    w.value = void 0;
  }
  function X() {
    ne(), ke(), V.value = !1;
  }
  function A() {
    g.value = void 0, f.value = void 0, X();
  }
  function C() {
    A(), h(), S.value = void 0, I.value = "";
  }
  function O() {
    $.value = "";
  }
  Se(t, (K) => {
    g.value && (Object.keys(K).length ? g.value.plugin_configs = Jt(K) : delete g.value.plugin_configs);
  }, { deep: !0, flush: "sync" });
  async function Y() {
    if (!g.value || l.value || !e.canReview()) return;
    const K = ne(), ve = Jt(g.value), P = JSON.stringify(g.value);
    l.value = !0, O(), e.clearSaved();
    try {
      const Z = await Ui(ve, (N) => jt.packPlan(e.boardId(), N));
      if (!K() || P !== JSON.stringify(g.value)) return;
      f.value = Z.plan, V.value = !0, g.value = Z.request, w.value = { request: Jt(Z.request), key: crypto.randomUUID() };
    } catch (Z) {
      K() && (ke(), $.value = nt(Z, "Could not review the pack."));
    } finally {
      l.value = !1;
    }
  }
  async function b() {
    if (!a.value?.pack || !se.value || !Q.value) return;
    const K = i.value.find((ve) => ve.id === a.value?.pack?.id);
    K && (g.value = _l(K, a.value.generation), e.openReview(), await Y());
  }
  async function R() {
    const K = i.value.find((ve) => ve.id === x.value);
    !a.value || !K || !y.value || !se.value || d.value || (g.value = _l(K, a.value.generation), u.value = !1, e.openReview(), await Y());
  }
  async function E(K, ve, P) {
    const Z = e.boardId(), N = await jt.packApply(Z, K, ve);
    e.boardId() === Z && (S.value = { request: K, key: ve, result: N, draft: P }, await e.applied(N.generation, P));
  }
  async function U() {
    if (!be.value || !w.value) return !1;
    l.value = !0, O();
    try {
      return await E(Jt(w.value.request), w.value.key, e.draftSnapshot()), !0;
    } catch (K) {
      return $.value = nt(K, "Could not apply the pack upgrade."), !1;
    } finally {
      l.value = !1;
    }
  }
  async function G() {
    const K = S.value;
    if (!(!K || !le.value || l.value || !e.authorized())) {
      l.value = !0, I.value = "";
      try {
        await E(K.request, K.key, K.draft);
      } catch (ve) {
        I.value = nt(ve, "Could not continue the pack installation.");
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
    installPack: x,
    installChoice: y,
    canManage: se,
    title: M,
    upgradeAvailable: Q,
    upgradeReason: F,
    request: g,
    preview: f,
    plan: ue,
    reviewError: $,
    isReviewed: fe,
    canApply: be,
    plugins: oe,
    result: B,
    inProgress: le,
    operationError: I,
    install: R,
    upgrade: b,
    review: Y,
    apply: U,
    continueInstallation: G,
    changed: ke,
    invalidate: X,
    clearReviewError: O,
    clear: A,
    reset: C
  };
}
const mm = { class: "work-section-layout" }, pm = { class: "kx-main" }, bm = ["aria-label"], gm = {
  key: 1,
  class: "kx-err work-alert-actions"
}, hm = { role: "alert" }, ym = {
  key: 2,
  class: "work-notice",
  role: "status"
}, km = {
  key: 3,
  class: "kx-loading",
  role: "status"
}, wm = {
  key: 4,
  class: "work-notice",
  role: "alert"
}, $m = {
  key: 5,
  class: "work-settings-body"
}, Vm = {
  key: 0,
  class: "work-notice work-stack work-tight",
  "aria-label": "Pack installation"
}, xm = {
  key: 0,
  role: "status"
}, Cm = {
  key: 1,
  role: "status"
}, Sm = { class: "work-small" }, Tm = {
  key: 2,
  class: "kx-err",
  role: "alert"
}, Im = { key: 3 }, Dm = {
  key: 1,
  class: "work-notice",
  role: "alert"
}, Em = {
  key: 2,
  class: "work-notice"
}, Um = ["id"], Am = ["disabled", "inert"], Rm = {
  key: 3,
  class: "work-ia-section"
}, Pm = {
  key: 0,
  class: "work-muted"
}, Om = {
  key: 5,
  class: "work-ia-section"
}, Nm = { class: "work-review-layout" }, Mm = { class: "work-muted" }, Fm = ["aria-busy"], Lm = {
  key: 0,
  role: "status"
}, Bm = {
  key: 1,
  role: "alert",
  class: "kx-err"
}, jm = {
  key: 2,
  role: "alert"
}, zm = { key: 6 }, qm = { class: "work-dialog-actions" }, Wm = {
  key: 3,
  class: "work-muted",
  role: "status"
}, Gm = {
  key: 0,
  class: "work-muted",
  role: "status"
}, Km = {
  key: 1,
  class: "kx-err work-alert-actions"
}, Hm = { role: "alert" }, Ym = {
  key: 2,
  class: "work-stack work-tight"
}, Xm = {
  key: 0,
  class: "work-pack-unavailable work-block"
}, Jm = {
  key: 3,
  class: "work-muted"
}, Zm = { class: "work-dialog-actions" }, Qm = /* @__PURE__ */ Ve({
  __name: "BoardSettings",
  props: {
    boardId: {},
    embedded: { type: Boolean },
    focusBack: { type: Boolean },
    route: {}
  },
  emits: ["dirty-change", "navigate"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = Ki(), d = qt(), v = j();
    let p, h = "";
    const i = () => JSON.stringify([pt.value, C.value, de.request, [...Ze.value]]), s = z(() => ({
      value: "all-boards",
      label: t.embedded ? "All boards" : "Back to board",
      icon: t.embedded ? "tabler:table" : "tabler:layout-kanban"
    })), u = j();
    Se(u, (ae) => {
      t.focusBack && ae?.$el.querySelector(".kx-settings-rail-item")?.focus();
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
    ], y = j("General"), g = {
      General: "general",
      "Item types": "items",
      Fields: "fields",
      Links: "links",
      Workflow: "workflow",
      Access: "access",
      Plugins: "plugins"
    }, f = j("");
    function w(ae, L = "") {
      y.value = ae, f.value = L ? g[ae] + "/" + L : "";
    }
    function V(ae, L = "") {
      w(ae, L), t.route !== void 0 && l("navigate", [g[ae], ...L ? [encodeURIComponent(L)] : []].join("/"));
    }
    function $(ae, L, ee) {
      if (t.route === void 0 || g[y.value] !== ae || !ee && f.value !== ae + "/" + L) return;
      const xe = ne.value?.declaration;
      (ae === "items" ? xe?.item_types?.some((De) => De.id === L) : ae === "fields" ? xe?.fields?.some((De) => De.code === L) : ae === "links" ? xe?.relation_types?.some((De) => De.id === L) : ae === "plugins" ? O.value?.schema_options.plugins.some((De) => De.plugin === L) : ae === "workflow" && xe?.processes?.some((De) => De.states.some((Re) => De.id + ".state." + Re.id === L) || De.transitions?.some((Re) => De.id + ".transition." + Re.id === L))) && V(y.value, ee ? L : "");
    }
    Vo(Ya, { selected: f, choose: $ });
    function S(ae) {
      if (ae === s.value.value) {
        ii();
        return;
      }
      (ae === "General" || x.some((L) => L.items.some((ee) => ee.value === ae))) && V(ae);
    }
    async function I() {
      V("Access"), await ht(), v.value?.focus();
    }
    const B = {
      General: "Manage the board name, item key prefix and app.",
      "Item types": "Choose the fields, parent relationships and workflow for each kind of work.",
      Fields: "Choose what information people can capture on items.",
      Links: "Configure link types and how they appear on related items.",
      Workflow: "Select a state or transition to edit how work moves.",
      Access: "Who can use this board?",
      Plugins: "Choose which plugins this board uses."
    }, le = j(""), J = j();
    function se(ae, L, ee) {
      ee.currentTarget instanceof HTMLElement && (J.value = { section: ae, type: L, opener: ee.currentTarget }, ae === "Fields" && (le.value = L.id), V(ae));
    }
    function ue(ae) {
      const L = J.value;
      if (!L) return;
      ae !== void 0 && (L.type.process = ae);
      const ee = L.type.id, xe = ne.value?.declaration.item_types?.some((Ge) => Ge.id === ee);
      V("Item types", xe ? ee : ""), J.value = void 0, L.section === "Fields" && ht(() => L.opener.focus());
    }
    const fe = j(!1), be = j(""), oe = j();
    Se(y, (ae) => {
      v.value?.scrollTo({ top: 0 }), J.value && ae !== J.value.section && (J.value = void 0);
    });
    function M() {
      fe.value = !1, be.value = "", de.clearReviewError(), Ca.value = !1;
    }
    function Q(ae) {
      !ll.value || !ti() || Ze.value.size || (oe.value = ae, fe.value = !0, nl());
    }
    const F = j(/* @__PURE__ */ new Set(["General"]));
    Se(y, (ae) => F.value.add(ae));
    const ne = j(), ke = j(), X = j(), A = j({}), C = j({}), O = j(), Y = j(!1), b = j(!0), R = j(!1), E = j(""), U = j(""), G = z(() => A.value.processes ?? []), K = z(() => Y.value && ne.value ? [
      { heading: X.value?.title || "Board settings", items: [{ value: "General", label: "General", icon: "tabler:settings" }] },
      ...x
    ] : []), ve = j(), P = j(!1), Z = _t();
    async function N(ae) {
      const L = Z();
      P.value = !1;
      try {
        const ee = await It.stateCounts(ae);
        L() && (ve.value = ee);
      } catch {
        L() && (P.value = !0, ve.value = void 0);
      }
    }
    Se(y, (ae) => {
      Y.value && ae === "Workflow" && N(t.boardId);
    });
    const re = j(), we = j(), Ee = j(""), Ue = j([]), qe = j(!1), xt = j(0), Ze = j(/* @__PURE__ */ new Set()), Qa = j(), Wl = _t(), _a = _t(), pt = z(() => dl(A.value, ne.value?.declaration ?? {})), Gl = z(() => Ze.value.size > 0 || !!ne.value && (JSON.stringify(pt.value) !== JSON.stringify(dl(ne.value.declaration, ne.value.declaration)) || Object.keys(C.value).length > 0)), Va = z(() => !!ke.value?.migration_error || X.value?.status === "migrating"), bt = z(() => !!ne.value && !!ke.value && ne.value.generation !== ke.value.generation), el = () => Y.value && !bt.value && !Ze.value.size, de = mi(fm({
      boardId: () => t.boardId,
      schema: ne,
      configs: C,
      busy: R,
      schemaDirty: () => Gl.value,
      migrationPending: () => Va.value,
      canReview: el,
      authorized: () => Y.value,
      draftSnapshot: i,
      openReview: () => {
        oe.value = void 0, fe.value = !0;
      },
      clearSaved: () => {
        U.value = "";
      },
      applied: li
    })), Rt = z(() => de.request ? de.plan : re.value), tl = z(() => de.request ? de.reviewError : be.value), al = z(() => [...Ue.value, ...Rt.value?.refused ?? []]), xa = z(() => !!de.request || Gl.value), ll = z(() => xa.value && !(de.inProgress && de.request)), ol = j(!1), Kl = z(() => xa.value || ol.value);
    Se(Kl, (ae) => l("dirty-change", ae), { immediate: !0, flush: "sync" });
    const Qo = z(() => (!la.value.renamed.length || Ca.value) && el() && !R.value && !qe.value && !Va.value && re.value && (re.value.changes.length > 0 || Object.keys(C.value).length > 0) && re.value.class !== "refused" && !re.value.refused.length && we.value?.matches(pt.value, ne.value?.generation ?? -1, C.value)), Hl = z(() => de.request ? de.canApply : Qo.value), Yl = z(() => de.request ? de.isReviewed : !!re.value), Ca = j(!1), la = z(() => {
      const ae = ne.value?.declaration, L = [], ee = [];
      for (const xe of G.value) {
        const Ge = ae?.item_types?.filter((Re) => Re.process === xe.id) ?? [], De = ae?.processes?.find((Re) => Re.id === xe.id);
        for (const Re of De?.states ?? []) {
          const Ta = xe.states.find((Pt) => Pt.id === Re.id);
          if (Ta && Ta.name === Re.name) continue;
          const rl = [...Rt.value?.refused ?? [], ...Rt.value?.changes ?? []].find((Pt) => Pt.code === "process " + xe.id && Pt.detail === Re.id && ["state.remove", "state.map"].includes(Pt.what))?.count ?? Ge.reduce((Pt, si) => Pt + (ve.value?.[si.id]?.[Re.id] ?? 0), 0);
          rl && (Ta ? ee.push({ process: xe, state: Re, name: ge(Ta), count: rl }) : L.push({ process: xe, state: Re, count: rl }));
        }
      }
      return { removed: L, renamed: ee };
    });
    function _o(ae, L, ee) {
      ae.map = { ...ae.map, [L]: ee }, nl();
    }
    const Xl = z(() => de.preview?.declaration ?? we.value?.declaration), ei = z(() => {
      const ae = Xl.value;
      return !Rt.value || !ae ? [] : Ai(Rt.value, ae).map((L) => ae.processes?.find((ee) => ee.id === L)?.name || "Untitled process");
    });
    function gt() {
      Ue.value = [], _a(), re.value = void 0, we.value = void 0, Ee.value = "", de.invalidate();
    }
    Se([pt, C], gt, { deep: !0, flush: "sync" }), Se(xa, (ae) => {
      ae && (U.value = "");
    });
    function oa(ae, L) {
      L ? Ze.value.delete(ae) : Ze.value.add(ae), gt();
    }
    function il(ae) {
      de.clear(), J.value = void 0, xt.value++, ne.value = ae, A.value = Jt(ae.declaration), C.value = {}, Ze.value.clear(), gt();
    }
    async function rt(ae = !1) {
      const L = Wl();
      try {
        const [ee, xe, Ge] = await Promise.all([It.schema(t.boardId, void 0, !0).catch((Re) => {
          if (Re instanceof wl && Re.details?.code === "board_schema_missing") return { generation: 0, declaration: {}, compiled: {}, key_prefix: "", as_of: 0 };
          throw Re;
        }), It.options(t.boardId), It.boards()]);
        if (!L()) return;
        if (Y.value = xe.access.admin, O.value = xe, X.value = Ge.find((Re) => Re.board_id === t.boardId), !Y.value) {
          ne.value = void 0, A.value = {}, gt();
          return;
        }
        E.value = "";
        const De = Ri(ee);
        ke.value = De, p !== void 0 && De.generation >= p ? (p = void 0, h === i() && il(De), h = "") : (ae || !ne.value || !xa.value && De.generation !== ne.value.generation) && il(De), bt.value && gt(), await de.load(L), L() && y.value === "Workflow" && N(t.boardId);
      } catch (ee) {
        if (!L()) return;
        ee instanceof wl && (ee.status === 403 || ee.kind?.toLowerCase() === "permission_denied") && (Y.value = !1), gt(), E.value = nt(ee, "Could not load board settings.");
      } finally {
        L() && (b.value = !1);
      }
    }
    function ti() {
      for (const ae of Array.from(Qa.value?.elements ?? []))
        if ((ae instanceof HTMLInputElement || ae instanceof HTMLSelectElement || ae instanceof HTMLTextAreaElement) && !(ae.form !== Qa.value || ae.closest('[style*="display: none"]:not(.p-accordioncontent)')) && !ae.reportValidity()) {
          const ee = ae.closest('.p-accordioncontent[style*="display: none"]')?.closest(".kx-disclosure")?.querySelector('.kx-disclosure-toggle[aria-expanded="false"]');
          return ee && (ee.click(), ht(() => ae.reportValidity())), !1;
        }
      return !0;
    }
    async function nl() {
      if (de.request) return de.review();
      if (!ne.value || R.value || !el()) return;
      const ae = _a(), L = eo(pt.value, ne.value.generation, C.value);
      R.value = !0, be.value = "", U.value = "";
      try {
        const ee = (L.declaration.processes ?? []).some((Ge) => ne.value?.declaration.processes?.find((De) => De.id === Ge.id)?.states.some((De) => Ge.states.some((Re) => Re.id === De.id && Re.name !== De.name))), [xe] = await Promise.all([
          jt.plan(t.boardId, L),
          ee ? N(t.boardId) : void 0
        ]);
        if (ee && P.value) {
          gt(), be.value = "Could not check which items use the renamed states. Check the impact again.";
          return;
        }
        if (!ae() || Ze.value.size || !L.matches(pt.value, ne.value.generation, C.value)) return;
        re.value = xe, we.value = L, Ee.value = crypto.randomUUID(), fe.value = !0;
      } catch (ee) {
        ae() && (gt(), be.value = nt(ee, "Could not review changes."), Ue.value = Pi(ee, pt.value));
      } finally {
        R.value = !1;
      }
    }
    async function ai() {
      if (!Hl.value) return;
      if (de.request) {
        await de.apply() && M();
        return;
      }
      if (!we.value) return;
      R.value = !0, be.value = "", U.value = "";
      const ae = i();
      try {
        p = (await jt.apply(t.boardId, we.value, Ee.value)).generation, h = ae, await rt(), U.value = "Board changes applied.", M();
      } catch (L) {
        be.value = nt(L, "Could not apply the board changes.");
      } finally {
        R.value = !1;
      }
    }
    async function li(ae, L) {
      L === i() && (p = ae, h = L), await rt();
    }
    async function oi() {
      if (!R.value) {
        R.value = !0, E.value = "";
        try {
          const ae = await jt.resume(t.boardId);
          U.value = ae.resumed ? "Migration resumes." : "Migration is already running.", await rt();
        } catch (ae) {
          E.value = nt(ae, "Could not resume migration.");
        } finally {
          R.value = !1;
        }
      }
    }
    async function Sa(ae, L) {
      if (!ne.value || !Y.value || R.value || qe.value) return "Wait for the current change to finish.";
      if (bt.value) return "Discard the stale draft before removing a definition.";
      const ee = ne.value.generation, xe = JSON.stringify(pt.value), Ge = Jt(A.value);
      ka(Ge, ae, L), qe.value = !0;
      try {
        const De = await jt.plan(t.boardId, eo(dl(Ge, ne.value.declaration), ee, C.value));
        if (!Y.value || bt.value || ne.value.generation !== ee || JSON.stringify(pt.value) !== xe) return "The draft changes during the check. Try the removal again.";
        const Re = Oi(De, ae, L);
        if (Re) return Re;
        if (De.class === "refused") return "Resolve the blocked changes in your draft before removing this definition.";
      } catch (De) {
        return nt(De, "Could not check this removal.");
      } finally {
        qe.value = !1;
      }
    }
    async function ii() {
      if (t.embedded) {
        o({ name: "boards" });
        return;
      }
      Kl.value && !await Do.confirm({ header: "Discard changes?", message: "Your unsaved board settings will be discarded.", acceptLabel: "Discard", rejectLabel: "Keep editing" }) || o({ name: "board", board: t.boardId });
    }
    function ni() {
      p = void 0, ke.value && il(ke.value), U.value = "", E.value = "", M();
    }
    Se(() => t.boardId, () => {
      ol.value = !1, p = void 0, de.reset(), ne.value = void 0, ke.value = void 0, X.value = void 0, C.value = {}, Ze.value.clear(), Z(), ve.value = void 0, le.value = "", J.value = void 0, F.value = /* @__PURE__ */ new Set(["General"]), w("General"), M(), Y.value = !1, b.value = !0, rt(!0);
    }), Se([() => t.route, () => t.boardId], ([ae]) => {
      if (ae === void 0) return;
      const [L, ee] = ae.split("/"), xe = Object.keys(g).find((De) => g[De] === L) ?? "General";
      let Ge = "";
      try {
        ee && (Ge = decodeURIComponent(ee));
      } catch {
      }
      xe === "Fields" && Ge && f.value !== "fields/" + Ge && (le.value = ""), w(xe, Ge), F.value.add(xe);
    }, { immediate: !0 });
    let sl = () => {
    };
    return Se(() => t.boardId, (ae) => {
      sl(), sl = Ni(`component.${ae}`, () => {
        rt();
      });
    }, { immediate: !0 }), pi(rt), Pl(() => {
      sl(), Wl(), _a(), Z(), de.invalidate();
    }), (ae, L) => (n(), m("section", {
      class: ct(["work-settings-shell work-ia", { "work-embedded": e.embedded }])
    }, [
      r("div", mm, [
        k(Gi, {
          ref_key: "rail",
          ref: u,
          label: "Board settings sections",
          value: y.value,
          groups: K.value,
          "leading-item": s.value,
          "onUpdate:value": S
        }, null, 8, ["value", "groups", "leading-item"]),
        r("div", pm, [
          r("div", {
            ref_key: "pane",
            ref: v,
            class: "kx-main-scroll work-settings-content",
            role: "region",
            "aria-label": y.value,
            tabindex: "-1"
          }, [
            Y.value && ne.value ? (n(), H(Cv, {
              key: 0,
              title: y.value,
              description: B[y.value]
            }, Ga({ _: 2 }, [
              ll.value || y.value === "Plugins" ? {
                name: "actions",
                fn: W(() => [
                  y.value === "Plugins" ? (n(), H(c(te), {
                    key: 0,
                    label: "Refresh status",
                    severity: "secondary",
                    outlined: "",
                    disabled: R.value || b.value,
                    onClick: L[0] || (L[0] = (ee) => rt())
                  }, {
                    icon: W(() => [
                      k(c(pe), {
                        icon: "tabler:refresh",
                        "aria-hidden": "true"
                      })
                    ]),
                    _: 1
                  }, 8, ["disabled"])) : T("", !0),
                  ll.value ? (n(), H(Sv, {
                    key: 1,
                    busy: R.value,
                    "discard-disabled": qe.value,
                    "review-disabled": qe.value || Va.value || bt.value || !!Ze.value.size,
                    onDiscard: ni,
                    onReview: Q
                  }, null, 8, ["busy", "discard-disabled", "review-disabled"])) : T("", !0)
                ]),
                key: "0"
              } : void 0
            ]), 1032, ["title", "description"])) : T("", !0),
            E.value ? (n(), m("div", gm, [
              r("p", hm, D(E.value), 1),
              k(c(te), {
                label: "Retry",
                severity: "secondary",
                outlined: "",
                onClick: L[1] || (L[1] = (ee) => rt())
              })
            ])) : T("", !0),
            U.value ? (n(), m("p", ym, D(U.value), 1)) : T("", !0),
            b.value ? (n(), m("p", km, "Loading board settings…")) : !Y.value && !E.value ? (n(), m("p", wm, "Ask a board administrator to grant you access to these settings.")) : T("", !0),
            Y.value && ne.value ? (n(), m("div", $m, [
              de.result ? (n(), m("section", Vm, [
                de.inProgress ? (n(), m("p", xm, [
                  L[27] || (L[27] = q("Pack installation status ", -1)),
                  r("strong", null, D(c(Ae)(de.result.status)), 1)
                ])) : (n(), m("p", Cm, "Pack applied.")),
                r("p", Sm, [
                  L[28] || (L[28] = q("Operation ", -1)),
                  r("code", null, D(de.result.operation_id), 1),
                  L[29] || (L[29] = q(" · Job ", -1)),
                  r("code", null, D(de.result.job_id), 1)
                ]),
                de.operationError ? (n(), m("p", Tm, D(de.operationError), 1)) : T("", !0),
                de.inProgress ? (n(), m("div", Im, [
                  k(c(te), {
                    label: "Continue pack installation",
                    severity: "secondary",
                    outlined: "",
                    loading: R.value,
                    disabled: R.value,
                    onClick: de.continueInstallation
                  }, null, 8, ["loading", "disabled", "onClick"])
                ])) : T("", !0)
              ])) : T("", !0),
              bt.value ? (n(), m("p", Dm, "Someone saved new settings while you were editing. Discard this draft to load their changes.")) : T("", !0),
              Va.value ? (n(), m("div", Em, [
                r("p", null, D(ke.value?.migration_error ? "Updating existing items paused." : "Updating existing items…"), 1),
                ke.value?.migration_error ? (n(), H(Ne, {
                  key: 0,
                  label: "Technical details"
                }, {
                  default: W(() => [
                    q(D(ke.value.migration_error), 1)
                  ]),
                  _: 1
                })) : T("", !0),
                ke.value?.migration_error ? (n(), H(c(te), {
                  key: 1,
                  label: "Resume updating items",
                  severity: "secondary",
                  disabled: R.value,
                  outlined: "",
                  onClick: oi
                }, null, 8, ["disabled"])) : T("", !0)
              ])) : T("", !0),
              vt(k(jf, {
                draft: A.value,
                schema: ke.value ?? ne.value,
                board: X.value,
                active: y.value === "General",
                "board-apps": O.value?.board_apps,
                "draft-form": c(d),
                disabled: R.value || qe.value,
                "pack-title": ne.value.pack ? de.title : void 0,
                outdated: ne.value.outdated,
                "upgrade-reason": de.upgradeReason,
                "can-upgrade": de.upgradeAvailable && de.canManage,
                "can-install": de.canManage,
                "pack-error": de.error,
                onUpgrade: de.upgrade,
                onInstall: L[2] || (L[2] = (ee) => de.installing = !0),
                onRetry: L[3] || (L[3] = (ee) => de.load()),
                onDirtyChange: L[4] || (L[4] = (ee) => ol.value = ee),
                onSaved: L[5] || (L[5] = (ee) => rt()),
                onShare: I
              }, null, 8, ["draft", "schema", "board", "active", "board-apps", "draft-form", "disabled", "pack-title", "outdated", "upgrade-reason", "can-upgrade", "can-install", "pack-error", "onUpgrade"]), [
                [Ct, y.value === "General"]
              ]),
              r("form", {
                id: c(d),
                ref_key: "editor",
                ref: Qa,
                onSubmit: L[19] || (L[19] = Oe((ee) => Q(), ["prevent"]))
              }, [
                (n(), m("fieldset", {
                  key: xt.value,
                  class: "work-settings-fieldset",
                  disabled: R.value || qe.value,
                  inert: R.value || qe.value || void 0
                }, [
                  F.value.has("Item types") ? vt((n(), H(Nr, {
                    key: 0,
                    class: "work-ia-section",
                    draft: A.value,
                    "guard-removal": Sa,
                    issues: al.value,
                    onCreateField: L[6] || (L[6] = (ee, xe) => se("Fields", ee, xe)),
                    onCreateWorkflow: L[7] || (L[7] = (ee, xe) => se("Workflow", ee, xe))
                  }, null, 8, ["draft", "issues"])), [
                    [Ct, y.value === "Item types"]
                  ]) : T("", !0),
                  F.value.has("Fields") ? vt((n(), H(kr, {
                    key: 1,
                    class: "work-ia-section",
                    "board-id": e.boardId,
                    "installed-types": O.value?.installed_types,
                    draft: A.value,
                    "guard-removal": Sa,
                    issues: al.value,
                    "item-type": le.value,
                    "onUpdate:itemType": L[8] || (L[8] = (ee) => le.value = ee),
                    "create-for-item-type": J.value?.section === "Fields",
                    onCreated: L[9] || (L[9] = (ee) => ue()),
                    onCancelCreation: L[10] || (L[10] = (ee) => ue()),
                    onValidity: L[11] || (L[11] = (ee, xe) => oa("fields:" + ee, xe))
                  }, null, 8, ["board-id", "installed-types", "draft", "issues", "item-type", "create-for-item-type"])), [
                    [Ct, y.value === "Fields"]
                  ]) : T("", !0),
                  F.value.has("Links") ? vt((n(), H(Jc, {
                    key: 2,
                    class: "work-ia-section",
                    draft: A.value,
                    "guard-removal": Sa
                  }, null, 8, ["draft"])), [
                    [Ct, y.value === "Links"]
                  ]) : T("", !0),
                  F.value.has("Workflow") ? vt((n(), m("section", Rm, [
                    P.value ? (n(), m("p", Pm, [
                      L[30] || (L[30] = q("Item counts are unavailable. ", -1)),
                      k(c(te), {
                        label: "Reload counts",
                        text: "",
                        onClick: L[12] || (L[12] = (ee) => N(e.boardId))
                      })
                    ])) : T("", !0),
                    k(Dc, {
                      "board-id": e.boardId,
                      draft: A.value,
                      "guard-removal": Sa,
                      issues: al.value,
                      counts: ve.value,
                      "count-types": ne.value.declaration.item_types,
                      guards: O.value?.guards,
                      "create-for-item-type": J.value?.section === "Workflow",
                      "creation-opener": J.value?.opener,
                      onCreated: ue,
                      onCancelCreation: L[13] || (L[13] = (ee) => ue()),
                      onValidity: L[14] || (L[14] = (ee, xe) => oa("process:" + ee, xe))
                    }, null, 8, ["board-id", "draft", "issues", "counts", "count-types", "guards", "create-for-item-type", "creation-opener"])
                  ], 512)), [
                    [Ct, y.value === "Workflow"]
                  ]) : T("", !0),
                  F.value.has("Access") ? vt((n(), H(Xv, {
                    key: 4,
                    active: y.value === "Access",
                    "board-id": e.boardId,
                    draft: A.value,
                    board: X.value,
                    busy: R.value,
                    onValidity: L[15] || (L[15] = (ee) => oa("visibility", ee))
                  }, null, 8, ["active", "board-id", "draft", "board", "busy"])), [
                    [Ct, y.value === "Access"]
                  ]) : T("", !0),
                  F.value.has("Plugins") ? vt((n(), m("section", Om, [
                    k(bo, {
                      "board-id": e.boardId,
                      draft: A.value,
                      schema: ke.value ?? ne.value,
                      options: O.value?.schema_options.plugins ?? [],
                      filters: O.value?.filters,
                      configs: C.value,
                      disabled: R.value,
                      onConfigured: L[16] || (L[16] = (ee) => {
                        gt(), rt();
                      }),
                      onRefresh: L[17] || (L[17] = (ee) => rt()),
                      onReview: Q,
                      onValidity: L[18] || (L[18] = (ee, xe) => oa("plugin:" + ee, xe))
                    }, null, 8, ["board-id", "draft", "schema", "options", "filters", "configs", "disabled"])
                  ], 512)), [
                    [Ct, y.value === "Plugins"]
                  ]) : T("", !0)
                ], 8, Am))
              ], 40, Um),
              k($l, {
                visible: fe.value,
                label: "Review changes",
                busy: R.value,
                "return-focus": oe.value,
                class: "work-review-sheet",
                onClose: M
              }, {
                default: W(() => [
                  r("div", Nm, [
                    r("header", null, [
                      L[31] || (L[31] = r("h2", null, "Review changes", -1)),
                      r("p", Mm, D(X.value?.title), 1)
                    ]),
                    r("div", {
                      class: "work-review-content work-stack",
                      "aria-busy": R.value
                    }, [
                      R.value ? (n(), m("p", Lm, D(Rt.value ? "Applying or checking changes…" : "Checking the impact on your board…"), 1)) : T("", !0),
                      tl.value ? (n(), m("p", Bm, D(tl.value), 1)) : T("", !0),
                      bt.value ? (n(), m("p", jm, "The board changed while you were editing. Close this review and discard the draft to load the latest settings.")) : T("", !0),
                      fe.value && !de.request && (la.value.removed.length || la.value.renamed.length) ? (n(), H(Rc, {
                        key: 3,
                        removed: la.value.removed,
                        renamed: la.value.renamed,
                        disabled: R.value || qe.value,
                        confirmed: Ca.value,
                        "onUpdate:confirmed": L[20] || (L[20] = (ee) => Ca.value = ee),
                        onDestination: _o
                      }, null, 8, ["removed", "renamed", "disabled", "confirmed"])) : T("", !0),
                      fe.value && de.request && de.plugins.length ? (n(), H(bo, {
                        key: 4,
                        "board-id": e.boardId,
                        draft: { plugins: de.plugins },
                        schema: ke.value ?? ne.value,
                        options: O.value?.schema_options.plugins.filter((ee) => de.plugins.some((xe) => xe.use === ee.plugin)) ?? [],
                        configs: C.value,
                        disabled: R.value,
                        "activation-locked": "",
                        onValidity: L[21] || (L[21] = (ee, xe) => oa("pack-plugin:" + ee, xe))
                      }, null, 8, ["board-id", "draft", "schema", "options", "configs", "disabled"])) : T("", !0),
                      fe.value ? (n(), H(lm, {
                        key: 5,
                        "board-id": e.boardId,
                        original: ne.value.declaration,
                        declaration: Xl.value,
                        plan: Rt.value,
                        follows: ei.value,
                        "config-count": Object.keys(C.value).length,
                        "plugin-configs": we.value?.plugin_configs,
                        "pack-review": !!de.preview,
                        plugins: O.value?.schema_options.plugins
                      }, {
                        default: W(() => [
                          de.preview && de.request ? (n(), H(vm, {
                            key: 0,
                            plan: de.preview,
                            request: de.request,
                            original: ne.value.declaration,
                            plugins: O.value?.schema_options.plugins,
                            disabled: R.value,
                            onChange: de.changed
                          }, null, 8, ["plan", "request", "original", "plugins", "disabled", "onChange"])) : T("", !0)
                        ]),
                        _: 1
                      }, 8, ["board-id", "original", "declaration", "plan", "follows", "config-count", "plugin-configs", "pack-review", "plugins"])) : T("", !0),
                      !R.value && !Yl.value && !bt.value && !tl.value ? (n(), m("p", zm, "Check the impact again before applying.")) : T("", !0)
                    ], 8, Fm),
                    r("footer", qm, [
                      k(c(te), {
                        label: "Keep editing",
                        severity: "secondary",
                        outlined: "",
                        disabled: R.value,
                        onClick: M
                      }, null, 8, ["disabled"]),
                      Yl.value ? (n(), H(c(te), {
                        key: 1,
                        label: "Apply changes",
                        disabled: !Hl.value,
                        loading: R.value,
                        onClick: ai
                      }, null, 8, ["disabled", "loading"])) : (n(), H(c(te), {
                        key: 0,
                        label: "Check impact",
                        disabled: R.value || bt.value || !!Ze.value.size,
                        onClick: nl
                      }, null, 8, ["disabled"]))
                    ])
                  ])
                ]),
                _: 1
              }, 8, ["visible", "busy", "return-focus"]),
              qe.value ? (n(), m("p", Wm, "Checking what uses this setting…")) : T("", !0)
            ])) : T("", !0)
          ], 8, bm)
        ])
      ]),
      Y.value ? (n(), H($l, {
        key: 0,
        visible: de.installing,
        label: "Install pack",
        busy: R.value,
        onClose: L[26] || (L[26] = (ee) => de.installing = !1)
      }, {
        default: W(() => [
          de.installing ? (n(), m("form", {
            key: 0,
            class: "work-dialog-box work-stack",
            onSubmit: L[25] || (L[25] = Oe(
              //@ts-ignore
              (...ee) => de.install && de.install(...ee),
              ["prevent"]
            ))
          }, [
            L[33] || (L[33] = r("h2", null, "Install a pack", -1)),
            L[34] || (L[34] = r("p", { class: "work-muted work-small" }, "Packs give an empty board a starting setup. Review checks whether this board is eligible.", -1)),
            de.loading ? (n(), m("p", Gm, "Loading packs…")) : de.error ? (n(), m("div", Km, [
              r("p", Hm, D(de.error), 1),
              k(c(te), {
                label: "Reload packs",
                severity: "secondary",
                outlined: "",
                onClick: L[22] || (L[22] = (ee) => de.load())
              })
            ])) : de.choices.length ? (n(), m("label", Ym, [
              L[32] || (L[32] = q("Pack ", -1)),
              k(c(me), {
                modelValue: de.installPack,
                "onUpdate:modelValue": L[23] || (L[23] = (ee) => de.installPack = ee),
                "aria-label": "Pack to install",
                appendTo: "self",
                optionLabel: "title",
                optionValue: "id",
                optionDisabled: "disabled",
                options: de.choices,
                pt: { option: ({ context: ee }) => ({ "aria-label": [ee.option.title, ee.option.unavailable].filter(Boolean).join(". ") }) }
              }, {
                option: W(({ option: ee }) => [
                  r("span", null, [
                    q(D(ee.title), 1),
                    ee.unavailable ? (n(), m("small", Xm, D(ee.unavailable), 1)) : T("", !0)
                  ])
                ]),
                _: 1
              }, 8, ["modelValue", "options", "pt"])
            ])) : (n(), m("p", Jm, "No available packs were found.")),
            r("footer", Zm, [
              k(c(te), {
                label: "Cancel",
                severity: "secondary",
                outlined: "",
                onClick: L[24] || (L[24] = (ee) => de.installing = !1)
              }),
              k(c(te), {
                type: "submit",
                label: "Review pack",
                disabled: !de.installChoice || !de.canManage || de.loading || !!de.error
              }, null, 8, ["disabled"])
            ])
          ], 32)) : T("", !0)
        ]),
        _: 1
      }, 8, ["visible", "busy"])) : T("", !0)
    ], 2));
  }
}), _m = /* @__PURE__ */ Ve({
  __name: "SettingsRoot",
  setup(e) {
    const a = bi(), t = gi();
    return Vo(Uo, (l) => {
      a.value.embedded && l.name === "boards" ? t("back-to-boards", {}) : t("navigate", { route: Hi(l) });
    }), (l, o) => (n(), H(Qm, {
      "board-id": c(a).boardId ?? "",
      embedded: c(a).embedded,
      "focus-back": c(a).focusBack,
      route: c(a).route,
      onNavigate: o[0] || (o[0] = (d) => c(t)("navigate", { route: d })),
      onDirtyChange: o[1] || (o[1] = (d) => c(t)("dirty-change", { dirty: d }))
    }, null, 8, ["board-id", "embedded", "focus-back", "route"]));
  }
}), ep = hi(_m, {
  type: "object",
  properties: {
    "board-id": { type: "string", default: "", description: "Board to administer." },
    "focus-back": { type: "boolean", default: !1, description: "Focus the first rail action when opening settings from the board picker." },
    route: { type: "string", description: "Section and selected row in System." },
    embedded: { type: "boolean", default: !1, description: "Fits in a System detail pane." }
  }
});
Mi(import.meta.url, ep);
//# sourceMappingURL=settings.js.map
