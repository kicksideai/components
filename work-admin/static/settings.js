import { inject as Vo, defineComponent as ge, ref as j, useSlots as $o, openBlock as c, createElementBlock as y, createElementVNode as d, normalizeClass as bt, unref as r, renderSlot as Xe, createCommentVNode as I, createVNode as b, withCtx as L, toDisplayString as U, createBlock as W, withDirectives as at, vShow as ct, computed as H, watch as Ue, onMounted as Ta, onUnmounted as zl, resolveComponent as Bl, Fragment as Z, renderList as re, createTextVNode as F, resolveDynamicComponent as Ha, onBeforeUnmount as yt, useId as ol, withKeys as Ae, withModifiers as Ve, normalizeStyle as xo, watchEffect as jl, nextTick as da, provide as Co } from "vue";
import { e as pt, u as So, b as To, c as Do, a as Io } from "./mount-6xLuMEcF.js";
import "pinia";
import { Icon as le } from "@iconify/vue";
import ue from "primevue/select";
import { m as Ya, h as bl, s as pe, i as Uo, t as Me, p as Rt, g as il, j as Ot, r as hl, w as St, f as Ye, l as Xa, k as Dt, n as Be, o as ht, u as ql, q as Wl, v as It, x as Kl, y as xe, z as Da, d as nl, A as oa, c as Eo, B as Ao, C as ga, D as Ja, E as Po, F as Ct, G as Ro, _ as Gl, H as Oo, I as No, J as yl, K as Vt, L as Mo, M as Fo, N as Lo, O as gl, P as zo, Q as kl, R as Bo, S as jo, a as qo, T as wl, U as Wo, V as Ko } from "./latestRequest-DwIpRsvA.js";
import J from "primevue/button";
import { api as Go, on as Ho, host as Yo, define as Xo } from "@wippy-fe/proxy";
import Le from "primevue/tag";
import Ge from "primevue/toggleswitch";
import jt from "primevue/checkbox";
import be from "primevue/inputtext";
import ka from "primevue/textarea";
import _e from "primevue/inputnumber";
import sl from "primevue/selectbutton";
import Jo from "primevue/tabs";
import Zo from "primevue/tablist";
import Qo from "primevue/tab";
import _o from "primevue/message";
const Na = (e, a) => e.x > a.x && e.x < a.x + a.width && e.y > a.y && e.y < a.y + a.height;
function ei(e, a, t) {
  return e.x === a.x ? e.x > t.x && e.x < t.x + t.width && Math.max(e.y, a.y) > t.y && Math.min(e.y, a.y) < t.y + t.height : e.y > t.y && e.y < t.y + t.height && Math.max(e.x, a.x) > t.x && Math.min(e.x, a.x) < t.x + t.width;
}
function gt(e, a, t) {
  const l = [.../* @__PURE__ */ new Set([e.x, a.x, ...t.flatMap((x) => [x.x, x.x + x.width])])].sort((x, T) => x - T), i = [.../* @__PURE__ */ new Set([e.y, a.y, ...t.flatMap((x) => [x.y, x.y + x.height])])].sort((x, T) => x - T);
  l.unshift(l[0] - 24), l.push(l.at(-1) + 24), i.unshift(i[0] - 24), i.push(i.at(-1) + 24);
  const u = l.length, f = i.indexOf(a.y) * u + l.indexOf(a.x), v = i.indexOf(e.y) * u + l.indexOf(e.x), p = (x) => ({ x: l[x % u], y: i[Math.floor(x / u)] }), o = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map(), s = [];
  function h(x) {
    s.push(x);
    let T = s.length - 1;
    for (; T; ) {
      const $ = T - 1 >> 1;
      if (s[$].priority <= x.priority) break;
      s[T] = s[$], T = $;
    }
    s[T] = x;
  }
  function m() {
    const x = s[0], T = s.pop();
    if (s.length) {
      let $ = 0;
      for (; $ * 2 + 1 < s.length; ) {
        let C = $ * 2 + 1;
        if (C + 1 < s.length && s[C + 1].priority < s[C].priority && C++, T.priority <= s[C].priority) break;
        s[$] = s[C], $ = C;
      }
      s[$] = T;
    }
    return x;
  }
  const k = (x) => Math.abs(x.x - a.x) + Math.abs(x.y - a.y);
  for (const x of [0, 1]) {
    const T = v * 2 + x;
    o.set(T, 0), h({ key: T, cost: 0, priority: k(e) });
  }
  const V = /* @__PURE__ */ new Map(), P = /* @__PURE__ */ new Map();
  for (; s.length; ) {
    const x = m(), T = Math.floor(x.key / 2), $ = x.key % 2;
    if (x.cost !== o.get(x.key)) continue;
    if (T === f) {
      const te = [];
      let me = x.key;
      for (; me !== void 0; )
        te.push(p(Math.floor(me / 2))), me = n.get(me);
      return Hl(te.reverse());
    }
    const C = p(T), D = T % u, X = Math.floor(T / u);
    for (const [te, me] of [[D > 0 ? T - 1 : -1, 0], [D + 1 < u ? T + 1 : -1, 0], [X > 0 ? T - u : -1, 1], [X + 1 < i.length ? T + u : -1, 1]]) {
      if (te < 0) continue;
      const de = p(te);
      if (V.has(te) || V.set(te, !t.some((w) => Na(de, w))), !V.get(te)) continue;
      const G = `${Math.min(T, te)}:${Math.max(T, te)}`;
      if (P.has(G) || P.set(G, !t.some((w) => ei(C, de, w))), !P.get(G)) continue;
      const R = x.cost + Math.abs(C.x - de.x) + Math.abs(C.y - de.y) + ($ === me ? 0 : 18), N = te * 2 + me;
      R >= (o.get(N) ?? 1 / 0) || (o.set(N, R), n.set(N, x.key), h({ key: N, cost: R, priority: R + k(de) }));
    }
  }
  throw new Error("Process map has no collision-free route between its ports: " + JSON.stringify({ start: e, end: a, startInside: t.filter((x) => Na(e, x)), endInside: t.filter((x) => Na(a, x)) }));
}
function Hl(e) {
  const a = [];
  for (const t of e) {
    const l = a.at(-1), i = a.at(-2);
    l && l.x === t.x && l.y === t.y || (i && l && (i.x === l.x && l.x === t.x || i.y === l.y && l.y === t.y) && a.pop(), a.push(t));
  }
  return a;
}
const Gt = (e) => Array.from(e).reduce((a, t) => a + (/[^\x20-\x7e]/u.test(t) ? 16 : /[MW@%]/.test(t) ? 11 : /[ilI.,:;!| ']/.test(t) ? 4 : 7.5), 0);
function zt(e, a = 28) {
  const t = [];
  let l = "";
  for (const i of e.split(/\s+/u))
    for (let u = 0; u < i.length; u += a) {
      const f = i.slice(u, u + a);
      l && l.length + f.length + 1 > a && (t.push(l), l = ""), l = l ? l + " " + f : f;
    }
  return [...t, l].filter(Boolean);
}
function ua(e) {
  if (e = Hl(e), !e.length) return "";
  let a = `M ${e[0].x} ${e[0].y}`;
  for (let l = 1; l < e.length - 1; l++) {
    const i = e[l - 1], u = e[l], f = e[l + 1], v = Math.hypot(u.x - i.x, u.y - i.y), p = Math.hypot(f.x - u.x, f.y - u.y), o = Math.min(8, v / 3, p / 3);
    o && (a += ` L ${u.x + (i.x - u.x) * o / v} ${u.y + (i.y - u.y) * o / v} Q ${u.x} ${u.y} ${u.x + (f.x - u.x) * o / p} ${u.y + (f.y - u.y) * o / p}`);
  }
  const t = e.at(-1);
  return a + ` L ${t.x} ${t.y}`;
}
function ti(e, a = {}, t = { width: 1400, height: 480 }) {
  const l = t.width < 750 || Ya(e).length > 8 ? "TB" : "LR", i = new bl.graphlib.Graph({ multigraph: !0 });
  i.setGraph({ rankdir: l, ranker: "network-simplex", acyclicer: "greedy", nodesep: 32, edgesep: 32, ranksep: 24, marginx: 32, marginy: 32 }), i.setDefaultEdgeLabel(() => ({}));
  const u = Ya(e), f = new Map(u.map((g, E) => [g.id, E])), v = e.states.map((g) => {
    const E = (e.transitions ?? []).filter((ae) => ae.from === "any" && ae.to === g.id), M = zt(pe(g)), ie = zt(Uo(g, e)), ee = E.flatMap((ae) => zt(Me(ae) + " works from any state")), he = a.policy?.wip?.[g.id]?.limit, S = he === void 0 ? 0 : Gt(" · limit " + he), _ = Math.max(168, ...M.map((ae) => Gt(ae) + 58), ...ie.map((ae, Se) => Gt(ae) + 32 + (Se === ie.length - 1 ? S : 0)), ...ee.map((ae) => Gt(ae) + 32)), A = Math.max(80, 42 + M.length * 18 + ie.length * 16 + ee.length * 18);
    return i.setNode(g.id, { width: _ + (l === "LR" ? 36 : 0), height: A + (l === "TB" ? 36 : 0) }), { state: g, x: 0, y: 0, width: _, height: A, title: M, caption: ie, badges: E, row: f.has(g.id) ? 0 : 1 };
  }), p = new Set(v.map((g) => g.state.id)), o = (e.transitions ?? []).flatMap((g) => g.from === "any" ? [] : g.from.filter((E) => p.has(E) && p.has(g.to)).map((E) => {
    const M = `${g.id}-${E}`, ie = zt(Me(g)), ee = Math.max(72, ...ie.map((S) => Gt(S) + 24)), he = Math.max(24, ie.length * 16 + 10);
    return { transition: g, from: E, key: M, lines: ie, width: ee, height: he };
  })), n = /* @__PURE__ */ new Set(), s = /* @__PURE__ */ new Set(), h = new Set(o.filter((g) => g.from === g.transition.to || g.transition.to === e.initial || ["completed", "canceled"].includes(v.find((E) => E.state.id === g.from).state.category)).map((g) => g.key));
  function m(g) {
    if (!s.has(g)) {
      n.add(g);
      for (const E of o.filter((M) => M.from === g))
        h.has(E.key) || (n.has(E.transition.to) ? h.add(E.key) : m(E.transition.to));
      n.delete(g), s.add(g);
    }
  }
  m(e.initial);
  for (const g of v) m(g.state.id);
  for (const g of o) if (!h.has(g.key)) {
    const E = f.get(g.from), M = f.get(g.transition.to);
    i.setEdge(g.from, g.transition.to, { width: g.width, height: g.height, labelpos: "c", weight: E !== void 0 && M === E + 1 ? 100 : 1 }, g.key);
  }
  for (const g of e.transitions ?? []) if (g.from === "any" && p.has(e.initial) && p.has(g.to) && !f.has(g.to)) {
    const E = e.states.find((M) => M.id === g.to);
    i.setEdge(e.initial, g.to, { minlen: ["completed", "canceled"].includes(E.category) ? Math.max(1, u.length - 1) : 1 }, `any:${g.id}`);
  }
  const k = e.states.flatMap((g) => (g.regions ?? []).filter((E) => p.has(E.initial)).map((E, M) => {
    const ie = `lane:${g.id}:${M}`;
    return i.setEdge(g.id, E.initial, {}, ie), { state: g, region: E, key: ie };
  }));
  if (!v.length) return { nodes: v, edges: [], parallels: [], main: u, direction: l, width: 320, height: 160 };
  bl.layout(i);
  for (const g of v) Object.assign(g, { x: i.node(g.state.id).x, y: i.node(g.state.id).y });
  const V = l === "TB", P = o.filter((g) => !h.has(g.key)).map((g) => i.edge({ v: g.from, w: g.transition.to, name: g.key })), x = [...v, ...P], T = Math.max(...x.map((g) => g.x + g.width / 2)), $ = Math.max(...x.map((g) => g.y + g.height / 2)), C = (g) => v.find((E) => E.state.id === g), D = o.filter((g) => h.has(g.key)).sort((g, E) => {
    const M = V ? "y" : "x";
    return Math.abs(C(g.from)[M] - C(g.transition.to)[M]) - Math.abs(C(E.from)[M] - C(E.transition.to)[M]);
  }), X = /* @__PURE__ */ new Map(), te = Math.max(0, ...D.map((g) => g.width));
  let me = $ + 32;
  for (const [g, E] of D.entries()) {
    const M = C(E.from), ie = C(E.transition.to), ee = V ? T + 16 + te + 28 + g * 18 : me + E.height / 2, he = V ? T + 16 + te / 2 : (M.x + ie.x) / 2;
    let S = V ? M.y + M.height / 2 + 18 : ee;
    if (V) for (const _ of [...X.values()].sort((A, ae) => A.y - ae.y))
      S + E.height / 2 + 10 > _.y - _.height / 2 - 10 && S - E.height / 2 - 10 < _.y + _.height / 2 + 10 && (S = _.y + _.height / 2 + 24 + E.height / 2);
    X.set(E.key, { x: he, y: S, corridor: ee, height: E.height }), me = ee + E.height / 2 + 24;
  }
  const de = o.map((g) => ({ ...g, ...X.get(g.key) ?? i.edge({ v: g.from, w: g.transition.to, name: g.key }) })), G = (g, E) => ({ x: g.x - g.width / 2 - E, y: g.y - g.height / 2 - E, width: g.width + E * 2, height: g.height + E * 2 }), R = [...v.map((g) => G(g, 12)), ...de.map((g) => G(g, 10))], N = (g, E) => ({
    start: V ? { x: g.x, y: g.y + g.height / 2 } : { x: g.x + g.width / 2, y: g.y },
    end: V ? { x: E.x, y: E.y - E.height / 2 } : { x: E.x - E.width / 2, y: E.y }
  }), w = (g, E) => V ? { x: g.x, y: g.y + E } : { x: g.x + E, y: g.y }, O = de.map((g) => {
    const E = v.find((Je) => Je.state.id === g.from), M = v.find((Je) => Je.state.id === g.transition.to), { start: ie, end: ee } = N(E, M), he = h.has(g.key), S = w(ie, 18), _ = w(ee, -18), A = (he || !V ? g.width : g.height) / 2 + 10, ae = he ? { x: g.x + (V ? -A : A), y: g.y } : w(g, -A), Se = he ? { x: g.x + (V ? A : -A), y: g.y } : w(g, A);
    let we;
    if (he) {
      const { corridor: Je } = X.get(g.key), sa = V ? { x: Je, y: g.y } : { x: S.x, y: Je }, Ut = V ? { x: Je, y: _.y } : { x: _.x, y: Je };
      we = V ? [
        [ie, ...gt(S, ae, R)],
        [Se, sa, Ut, ...gt(Ut, _, R), ee]
      ] : [
        [ie, ...gt(S, sa, R), ae],
        [Se, ...gt(Ut, _, R), ee]
      ];
    } else we = [
      [ie, ...gt(S, ae, R)],
      [...gt(Se, _, R), ee]
    ];
    const rt = he ? "return" : f.get(g.transition.to) === (f.get(g.from) ?? -2) + 1 ? "main" : "forward";
    return { ...g, points: we.flat(), segments: we, path: we.map(ua).join(" "), type: rt, targetOffset: 0 };
  }), se = k.map((g) => {
    const E = v.find((S) => S.state.id === g.state.id), M = v.find((S) => S.state.id === g.region.initial), { start: ie, end: ee } = N(E, M), he = [ie, ...gt(w(ie, 18), w(ee, -18), R), ee];
    return { state: g.state, key: g.key, points: he, path: ua(he) };
  }), q = [...v.flatMap((g) => [{ x: g.x - g.width / 2, y: g.y - g.height / 2 }, { x: g.x + g.width / 2, y: g.y + g.height / 2 }]), ...O.flatMap((g) => [...g.points, { x: g.x - g.width / 2, y: g.y - g.height / 2 }, { x: g.x + g.width / 2, y: g.y + g.height / 2 }]), ...se.flatMap((g) => g.points)], $e = 32 - Math.min(...q.map((g) => g.x)), Ce = 32 - Math.min(...q.map((g) => g.y)), Q = Math.max(...q.map((g) => g.x)) + $e + 32, z = Math.max(...q.map((g) => g.y)) + Ce + 32, B = (g) => ({ x: g.x + $e, y: g.y + Ce });
  for (const g of v) Object.assign(g, B(g));
  for (const g of O)
    Object.assign(g, B(g)), g.segments = g.segments.map((E) => E.map(B)), g.points = g.segments.flat(), g.path = g.segments.map(ua).join(" ");
  for (const g of se)
    g.points = g.points.map(B), g.path = ua(g.points);
  return { nodes: v, edges: O, parallels: se, main: u, direction: l, width: Q, height: z };
}
const Yl = Symbol("work-navigation");
function ai() {
  return Vo(Yl, () => {
  });
}
function li(e) {
  if (e.name === "boards") return "";
  const a = encodeURIComponent(e.board);
  return e.name === "settings" ? `${a}/settings` : a;
}
const Nt = (e) => `/api/v1/work/boards/${encodeURIComponent(e)}`, Vl = (e) => ({ declaration: e.declaration, expected_generation: e.expected_generation, plugin_configs: e.plugin_configs }), $t = {
  packPlan: (e, a) => Rt(`${Nt(e)}/pack_plan`, a, "Pack plan"),
  packApply: (e, a, t) => Rt(`${Nt(e)}/pack_apply`, { ...a, key: t }, "Apply pack"),
  plan: (e, a) => Rt(`${Nt(e)}/plan_schema`, Vl(a), "Schema plan"),
  apply: (e, a, t) => Rt(`${Nt(e)}/apply_schema`, { ...Vl(a), key: t }, "Apply schema"),
  resume: (e) => Rt(`${Nt(e)}/resume_migration`, {}, "Resume migration"),
  configure: (e, a, t) => Rt(`${Nt(e)}/configure_plugin`, { plugin: a, config: t }, "Configure plugin")
}, oi = { class: "work-definition" }, ii = {
  key: 0,
  class: "work-definition-handle"
}, ni = ["title"], si = { class: "work-definition-details" }, ri = { class: "work-definition-code" }, di = ["title"], ui = { class: "work-definition-kind" }, ci = { class: "work-definition-flags" }, vi = { class: "work-definition-usage" }, mi = { class: "work-definition-actions" }, fi = {
  key: 1,
  class: "work-definition-description"
}, pi = { class: "work-definition-body work-stack" }, Ia = /* @__PURE__ */ ge({
  __name: "DefinitionRow",
  props: {
    title: {},
    code: {},
    kind: {},
    description: {}
  },
  setup(e) {
    const a = j(!1), t = $o();
    return (l, i) => (c(), y("article", oi, [
      d("header", {
        class: bt(["work-definition-head", { "work-definition-has-handle": r(t).handle }])
      }, [
        r(t).handle ? (c(), y("div", ii, [
          Xe(l.$slots, "handle")
        ])) : I("", !0),
        b(il, {
          class: "work-definition-toggle",
          "aria-expanded": a.value,
          onActivate: i[0] || (i[0] = (u) => a.value = !a.value)
        }, {
          default: L(() => [
            b(r(le), {
              icon: a.value ? "tabler:chevron-down" : "tabler:chevron-right",
              "aria-hidden": "true"
            }, null, 8, ["icon"]),
            d("span", {
              class: "work-row-title",
              title: e.title
            }, U(e.title), 9, ni)
          ]),
          _: 1
        }, 8, ["aria-expanded"]),
        d("div", si, [
          d("span", ri, [
            e.code ? (c(), y("code", {
              key: 0,
              class: "work-mono",
              title: e.code
            }, U(e.code), 9, di)) : I("", !0)
          ]),
          d("span", ui, [
            e.kind ? (c(), W(r(Le), {
              key: 0,
              severity: "secondary",
              value: e.kind
            }, null, 8, ["value"])) : I("", !0)
          ]),
          d("span", ci, [
            Xe(l.$slots, "flags")
          ]),
          d("div", vi, [
            Xe(l.$slots, "usage")
          ])
        ]),
        d("div", mi, [
          Xe(l.$slots, "actions")
        ]),
        e.description ? (c(), y("p", fi, U(e.description), 1)) : I("", !0)
      ], 2),
      at(d("div", pi, [
        Xe(l.$slots, "default")
      ], 512), [
        [ct, a.value]
      ])
    ]));
  }
}), bi = { class: "work-definition-scroll" }, hi = {
  key: 0,
  class: "work-definition-columns",
  "aria-hidden": "true"
}, yi = { key: 0 }, gi = { key: 1 }, ki = {
  key: 2,
  class: "work-definition-usage"
}, Ua = /* @__PURE__ */ ge({
  __name: "DefinitionList",
  props: {
    count: {},
    columns: {}
  },
  setup(e) {
    return (a, t) => (c(), y("div", bi, [
      d("div", {
        class: bt(["work-field-builder", "work-definitions-" + e.columns])
      }, [
        e.count > 3 ? (c(), y("div", hi, [
          t[0] || (t[0] = d("span", null, null, -1)),
          t[1] || (t[1] = d("span", null, "Name", -1)),
          e.columns !== "plugins" ? (c(), y("span", yi, "Identifier")) : I("", !0),
          d("span", null, U(e.columns === "plugins" ? "State" : e.columns === "types" ? "Process" : "Kind"), 1),
          e.columns === "fields" || e.columns === "plugins" ? (c(), y("span", gi, "Details")) : I("", !0),
          e.columns !== "plugins" ? (c(), y("span", ki, U(e.columns === "fields" ? "Used by" : "Details"), 1)) : I("", !0),
          t[2] || (t[2] = d("span", null, null, -1))
        ])) : I("", !0),
        Xe(a.$slots, "default")
      ], 2)
    ]));
  }
}), wi = [
  { code: "key", form: "text", index: "key" },
  { code: "type", form: "text", index: "key" },
  { code: "state", form: "text", index: "key" },
  { code: "category", form: "text", index: "key" },
  { code: "rank", form: "text", index: "key" },
  { code: "parent", form: "text", index: "key" },
  { code: "created_at", form: "time", index: "key" },
  { code: "updated_at", form: "time", index: "key" }
];
function Vi(e) {
  const a = e.compiled.processes?.flatMap((t) => t.states.map((l) => ({ id: l.id, label: l.name }))) ?? [];
  return [...wi.filter((t) => t.code !== "rank").map((t) => t.code === "state" ? { ...t, type: "option", options: a } : t.code === "category" ? { ...t, type: "option", options: ["triage", "backlog", "unstarted", "started", "completed", "canceled"].map((l) => ({ id: l })) } : t), ...(e.compiled.fields ?? []).filter((t) => t.index && t.index !== "none")];
}
function $i(e) {
  if (e?.cardinality && e.cardinality !== "one") return ["has", "in", "nin", "is_null", ...e.type === "principal" ? ["member_of"] : []];
  const a = ["eq", "neq", "in", "nin", "is_null", ...e?.type === "principal" ? ["member_of"] : []];
  return e && (["int", "number", "dec", "time", "quantity"].includes(e.form ?? "") || e.index === "number") && a.push("lt", "lte", "gt", "gte", "between"), e?.form === "text" && e.type !== "option" && a.push("contains", "starts_with"), a;
}
const xi = { class: "work-field-control" }, Ci = ["id"], Si = {
  key: 1,
  class: "work-stack work-tight"
}, Ti = { class: "work-chips" }, Di = {
  key: 5,
  class: "work-row"
}, Ii = ["inert"], Ui = ["value"], Ei = {
  key: 1,
  class: "work-muted"
}, Ai = ["inert"], Pi = ["value"], Ri = {
  key: 1,
  class: "work-muted"
}, Oi = {
  key: 11,
  class: "work-stack work-tight"
}, Ni = {
  class: "work-stack work-tight",
  "aria-label": "Matching items"
}, Mi = { class: "work-mono" }, Fi = {
  key: 15,
  class: "work-error work-small",
  role: "alert"
}, Xl = /* @__PURE__ */ ge({
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
    const t = e, l = a, i = H(() => t.inputId ?? `field-${t.field.code}`), u = H(() => !!t.field.cardinality && t.field.cardinality !== "one"), f = H(() => Array.isArray(t.modelValue) ? t.modelValue : []), v = H(() => t.modelValue == null ? "" : typeof t.modelValue == "object" ? Ot(t.modelValue) : String(t.modelValue)), p = H(() => {
      const E = t.modelValue;
      return E && typeof E == "object" && "ref" in E && Array.isArray(E.ref) ? String(E.ref[1] ?? "") : "";
    }), o = H(() => t.disabled || hl(t.field)), n = j(!1), s = j(!1), h = j(!1), m = j(""), k = j(""), V = j([]), P = Xa(), x = j([]);
    let T = 0, $;
    const C = /* @__PURE__ */ new Set();
    Ue(f, (E) => {
      x.value = $ ?? E.map((M, ie) => x.value[ie] ?? T++), $ = void 0;
    }, { immediate: !0 });
    function D(E) {
      l("update:modelValue", E);
    }
    function X(E, M) {
      const ie = [...f.value];
      ie[E] = M, D(ie);
    }
    function te(E, M) {
      M ? C.delete(E) : C.add(E), l("validity", !C.size);
    }
    function me(E) {
      C.delete(x.value[E]), l("validity", !C.size), $ = x.value.filter((M, ie) => ie !== E), D(f.value.filter((M, ie) => ie !== E));
    }
    function de() {
      $ = [...x.value, T++], D([...f.value, t.field.form === "bool" ? !1 : t.field.form === "record" ? {} : ""]);
    }
    function G(E) {
      const M = E.detail, ie = M?.principal_id ?? M?.id;
      D(ie ? { kind: M.type ?? "user", id: ie } : void 0);
    }
    function R(E) {
      const M = E.detail;
      D(M?.thread_id ? { ref: ["component", M.thread_id] } : void 0);
    }
    const N = j("");
    let w = "";
    Ue(() => t.modelValue, (E) => {
      const M = JSON.stringify(E ?? {}, null, 2);
      M !== w && (w = M, N.value = M, m.value = "", l("validity", !0));
    }, { immediate: !0 });
    function O(E) {
      N.value = E;
      try {
        const M = JSON.parse(E);
        if (!M || typeof M != "object" || Array.isArray(M)) throw new Error("Enter a JSON object.");
        if (t.field.type === "rich_text" && !("type" in M && typeof M.type == "string")) throw new Error("The document needs a type.");
        w = JSON.stringify(M, null, 2), m.value = "", l("validity", !0), D(M);
      } catch (M) {
        m.value = M instanceof Error ? M.message : "Invalid JSON.", l("validity", !1);
      }
    }
    function se(E) {
      if (!E) {
        l("validity", !0), D(void 0);
        return;
      }
      const M = Number.isFinite(Number(E)) && (t.field.form !== "int" || Number.isSafeInteger(Number(E)));
      l("validity", M), M && D(t.field.form === "int" ? Number(E) : E);
    }
    const q = H(() => t.field.config?.format === "date");
    function $e(E) {
      D(E ? q.value ? E : new Date(E).toISOString() : void 0);
    }
    const Ce = H(() => {
      if (typeof t.modelValue != "string") return "";
      if (q.value) return t.modelValue.slice(0, 10);
      const E = new Date(t.modelValue);
      return Number.isNaN(E.getTime()) ? "" : new Date(E.getTime() - E.getTimezoneOffset() * 6e4).toISOString().slice(0, 16);
    });
    function Q(E) {
      D(E.detail?.ref);
    }
    function z(E) {
      D(E.detail?.value);
    }
    let B;
    Ue(k, () => {
      const E = P();
      if (clearTimeout(B), !k.value.trim()) {
        V.value = [];
        return;
      }
      B = setTimeout(async () => {
        try {
          const M = k.value.trim(), ie = /^[A-Z][A-Z0-9]{1,9}-[0-9]+$/.test(M) ? [(await St.item(t.boardId, { key: M })).item] : (await St.query(t.boardId, { where: { field: "title", op: "contains", value: M }, limit: 8 })).items;
          E() && (V.value = ie, m.value = "");
        } catch (M) {
          E() && (m.value = Ye(M, "Could not search items."));
        }
      }, 200);
    });
    function g(E) {
      D({ board: t.boardId, item: E.id }), k.value = "", V.value = [];
    }
    Ta(async () => {
      t.field.type === "principal" ? n.value = await pt("wc-principal-picker") : t.field.config?.target === "component" && (n.value = await pt("wc-component-picker"));
    });
    for (const [E, M] of [[() => t.editorTag, h], [() => t.linkTag, s]])
      Ue(E, async (ie, ee, he) => {
        let S = !0;
        if (he(() => {
          S = !1;
        }), M.value = !1, ie) {
          const _ = await pt(ie);
          S && (M.value = _);
        }
      }, { immediate: !0 });
    return zl(() => {
      clearTimeout(B), P();
    }), (E, M) => {
      const ie = Bl("FieldControl", !0);
      return c(), y("div", xi, [
        r(hl)(e.field) ? (c(), y("output", {
          key: 0,
          id: i.value,
          class: "work-read-value"
        }, U(r(Ot)(e.modelValue, e.field)), 9, Ci)) : u.value ? (c(), y("div", Si, [
          d("div", Ti, [
            (c(!0), y(Z, null, re(f.value, (ee, he) => (c(), W(r(Le), {
              key: x.value[he],
              class: "kx-tag-sm",
              severity: "secondary"
            }, {
              default: L(() => [
                F(U(r(Ot)(ee, e.field)) + " ", 1),
                b(r(J), {
                  type: "button",
                  class: "work-icon-button",
                  disabled: o.value,
                  "aria-label": "Remove value " + (he + 1),
                  onClick: (S) => me(he),
                  severity: "secondary",
                  text: "",
                  size: "small"
                }, {
                  default: L(() => [
                    b(r(le), {
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
          (c(!0), y(Z, null, re(f.value, (ee, he) => (c(), y("div", {
            key: x.value[he],
            class: "work-stack work-tight"
          }, [
            b(ie, {
              "board-id": e.boardId,
              field: { ...e.field, cardinality: "one" },
              "model-value": ee,
              "input-id": i.value + "-" + x.value[he],
              disabled: o.value,
              "editor-tag": e.editorTag,
              "link-tag": e.linkTag,
              "onUpdate:modelValue": (S) => X(he, S),
              onValidity: (S) => te(x.value[he], S)
            }, null, 8, ["board-id", "field", "model-value", "input-id", "disabled", "editor-tag", "link-tag", "onUpdate:modelValue", "onValidity"])
          ]))), 128)),
          b(r(J), {
            label: "Add value",
            severity: "secondary",
            size: "small",
            disabled: o.value,
            onClick: de,
            outlined: ""
          }, {
            icon: L(() => [
              b(r(le), {
                icon: "tabler:plus",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled"])
        ])) : e.editorTag && h.value ? (c(), W(Ha(e.editorTag), {
          key: 2,
          "board-id": e.boardId,
          value: JSON.stringify(e.modelValue ?? null),
          config: JSON.stringify(e.field.config ?? {}),
          readonly: o.value || void 0,
          onChange: z
        }, null, 40, ["board-id", "value", "config", "readonly"])) : e.linkTag && s.value ? (c(), W(Ha(e.linkTag), {
          key: 3,
          "board-id": e.boardId,
          kind: e.field.config?.target ?? e.field.type,
          value: JSON.stringify(e.modelValue ?? null),
          readonly: o.value || void 0,
          onChange: Q
        }, null, 40, ["board-id", "kind", "value", "readonly"])) : e.field.type === "option" ? (c(), W(r(ue), {
          key: 4,
          placeholder: "Not set",
          inputId: i.value,
          "model-value": e.modelValue ?? "",
          disabled: o.value,
          "onUpdate:modelValue": M[0] || (M[0] = (ee) => D(ee || void 0)),
          appendTo: "self",
          optionLabel: "label",
          optionValue: "value",
          optionDisabled: "disabled",
          options: [{ label: "Not set", value: "", disabled: !1 }, ...(e.field.options ?? []).map((ee) => ({ label: ee.label ?? ee.id, value: ee.id, disabled: !1 }))]
        }, null, 8, ["inputId", "model-value", "disabled", "options"])) : e.field.form === "bool" ? (c(), y("label", Di, [
          b(r(jt), {
            inputId: i.value,
            "model-value": e.modelValue === !0,
            disabled: o.value,
            "onUpdate:modelValue": M[1] || (M[1] = (ee) => D(ee)),
            binary: ""
          }, null, 8, ["inputId", "model-value", "disabled"]),
          F(U(e.modelValue === !0 ? "Yes" : e.modelValue === !1 ? "No" : "Not set"), 1)
        ])) : e.field.form === "int" ? (c(), W(r(_e), {
          key: 6,
          inputId: i.value,
          "model-value": v.value === "" ? null : Number(v.value),
          disabled: o.value,
          "onUpdate:modelValue": M[2] || (M[2] = (ee) => se(ee == null ? "" : String(ee))),
          useGrouping: !1
        }, null, 8, ["inputId", "model-value", "disabled"])) : e.field.form === "dec" ? (c(), W(r(be), {
          key: 7,
          id: i.value,
          inputmode: "decimal",
          "model-value": v.value,
          disabled: o.value,
          "onUpdate:modelValue": M[3] || (M[3] = (ee) => se(ee ?? ""))
        }, null, 8, ["id", "model-value", "disabled"])) : e.field.form === "time" ? (c(), W(r(be), {
          key: 8,
          id: i.value,
          type: q.value ? "date" : "datetime-local",
          value: Ce.value,
          disabled: o.value,
          onInput: M[4] || (M[4] = (ee) => $e(ee.target.value))
        }, null, 8, ["id", "type", "value", "disabled"])) : e.field.type === "principal" ? (c(), y("div", {
          key: 9,
          inert: o.value || void 0,
          class: "work-stack work-tight"
        }, [
          n.value ? (c(), y("wc-principal-picker", {
            key: 0,
            value: JSON.stringify(e.modelValue ?? {}),
            kinds: "user,group",
            onConfigChanged: G
          }, null, 40, Ui)) : (c(), y("span", Ei, U(r(Ot)(e.modelValue, e.field)) + " · Person picker is unavailable.", 1))
        ], 8, Ii)) : e.field.config?.target === "component" ? (c(), y("div", {
          key: 10,
          inert: o.value || void 0
        }, [
          n.value ? (c(), y("wc-component-picker", {
            key: 0,
            value: JSON.stringify({ thread_id: p.value }),
            onChange: R
          }, null, 40, Pi)) : (c(), y("span", Ri, "Component picker is unavailable."))
        ], 8, Ai)) : e.field.type === "item" ? (c(), y("div", Oi, [
          b(r(Le), {
            class: "kx-tag-sm",
            severity: "secondary"
          }, {
            default: L(() => [
              F(U(r(Ot)(e.modelValue, e.field)), 1)
            ]),
            _: 1
          }),
          b(r(be), {
            id: i.value,
            modelValue: k.value,
            "onUpdate:modelValue": M[5] || (M[5] = (ee) => k.value = ee),
            disabled: o.value,
            placeholder: "Search a title or enter an item key",
            "aria-label": "Search items"
          }, null, 8, ["id", "modelValue", "disabled"]),
          d("div", Ni, [
            (c(!0), y(Z, null, re(V.value, (ee) => (c(), W(il, {
              key: ee.id,
              class: "work-match-item",
              disabled: o.value,
              onActivate: (he) => g(ee)
            }, {
              default: L(() => [
                d("code", Mi, U(ee.key), 1),
                d("span", null, U(r(Ot)(ee.values.title)), 1)
              ]),
              _: 2
            }, 1032, ["disabled", "onActivate"]))), 128))
          ]),
          e.modelValue ? (c(), W(r(J), {
            key: 0,
            label: "Clear reference",
            severity: "secondary",
            size: "small",
            disabled: o.value,
            onClick: M[6] || (M[6] = (ee) => D(void 0)),
            outlined: ""
          }, {
            icon: L(() => [
              b(r(le), {
                icon: "tabler:list-check",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled"])) : I("", !0)
        ])) : e.field.form === "record" || e.field.type === "rich_text" || e.field.form === "quantity" || e.field.form === "ref" ? (c(), W(r(ka), {
          key: 12,
          id: i.value,
          "model-value": N.value,
          rows: "3",
          disabled: o.value,
          "aria-invalid": !!m.value,
          "onUpdate:modelValue": M[7] || (M[7] = (ee) => O(ee ?? ""))
        }, null, 8, ["id", "model-value", "disabled", "aria-invalid"])) : e.field.code === "description" ? (c(), W(r(ka), {
          key: 13,
          id: i.value,
          "model-value": v.value,
          rows: "4",
          disabled: o.value,
          "onUpdate:modelValue": M[8] || (M[8] = (ee) => D(ee))
        }, null, 8, ["id", "model-value", "disabled"])) : (c(), W(r(be), {
          key: 14,
          id: i.value,
          "model-value": v.value,
          disabled: o.value,
          "onUpdate:modelValue": M[9] || (M[9] = (ee) => D(ee))
        }, null, 8, ["id", "model-value", "disabled"])),
        m.value ? (c(), y("span", Fi, U(m.value), 1)) : I("", !0)
      ]);
    };
  }
}), Li = { class: "work-stack work-tight work-operand-control" }, zi = { class: "work-row work-small" }, Bi = {
  key: 1,
  class: "work-muted work-small"
}, ji = {
  key: 2,
  class: "work-stack work-tight"
}, qi = { class: "work-small" }, Wi = {
  key: 0,
  class: "work-error work-small",
  role: "alert"
}, Ht = /* @__PURE__ */ ge({
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
    const t = e, l = a, i = H(() => "$actor" in Dt(t.modelValue) ? "actor" : "$now" in Dt(t.modelValue) ? "now" : "literal"), u = j(""), f = j("");
    Ue(() => t.modelValue, (o) => {
      u.value = JSON.stringify(o ?? []), f.value = "";
    }, { immediate: !0 });
    function v(o) {
      l("update:modelValue", o === "actor" ? { $actor: "id" } : o === "now" ? { $now: "P0D" } : void 0), l("validity", !0);
    }
    function p(o) {
      u.value = o;
      try {
        const n = JSON.parse(o);
        if (!Array.isArray(n)) throw new Error("Enter a JSON list.");
        f.value = "", l("validity", !0), l("update:modelValue", n);
      } catch (n) {
        f.value = n instanceof Error ? n.message : "Invalid values.", l("validity", !1);
      }
    }
    return (o, n) => (c(), y("div", Li, [
      d("label", zi, [
        F(U(e.label), 1),
        b(r(ue), {
          "aria-label": e.label + " operand",
          "model-value": i.value,
          disabled: e.disabled,
          "onUpdate:modelValue": n[0] || (n[0] = (s) => v(s)),
          appendTo: "self",
          optionLabel: "label",
          optionValue: "value",
          optionDisabled: "disabled",
          options: [{ label: "Value", value: "literal", disabled: !1 }, { label: "Current actor ($actor)", value: "actor", disabled: !1 }, { label: "Current time ($now)", value: "now", disabled: !1 }]
        }, null, 8, ["aria-label", "model-value", "disabled"])
      ]),
      i.value === "now" ? (c(), W(r(be), {
        key: 0,
        "aria-label": e.label + " time offset",
        value: r(Dt)(e.modelValue).$now,
        disabled: e.disabled,
        placeholder: "-P7D",
        onInput: n[1] || (n[1] = (s) => l("update:modelValue", { $now: s.target.value }))
      }, null, 8, ["aria-label", "value", "disabled"])) : i.value === "actor" ? (c(), y("span", Bi, "The signed-in actor’s id")) : e.multiple ? (c(), y("div", ji, [
        d("label", qi, [
          n[5] || (n[5] = F("Values as JSON (operands may appear in the list)", -1)),
          b(r(ka), {
            class: "work-mono",
            "aria-label": e.label + " values",
            value: u.value,
            disabled: e.disabled,
            rows: "2",
            onInput: n[2] || (n[2] = (s) => p(s.target.value))
          }, null, 8, ["aria-label", "value", "disabled"])
        ]),
        f.value ? (c(), y("p", Wi, U(f.value), 1)) : I("", !0)
      ])) : (c(), W(Xl, {
        key: 3,
        "board-id": e.boardId,
        field: { ...e.field, cardinality: "one" },
        "model-value": e.modelValue,
        disabled: e.disabled,
        "input-id": e.label.replace(/[^a-z0-9]/gi, "-"),
        "onUpdate:modelValue": n[3] || (n[3] = (s) => l("update:modelValue", s)),
        onValidity: n[4] || (n[4] = (s) => l("validity", s))
      }, null, 8, ["board-id", "field", "model-value", "disabled", "input-id"]))
    ]));
  }
}), Ki = ["disabled"], Gi = { class: "work-small work-mono" }, Hi = { class: "work-row work-small" }, Yi = { class: "work-row work-wrap" }, Xi = { key: 3 }, Ji = { class: "work-row work-wrap" }, Zi = { class: "work-row" }, Qi = { class: "work-row" }, _i = { class: "work-row" }, en = {
  key: 3,
  class: "work-row work-wrap"
}, tn = { class: "work-row work-wrap" }, an = /* @__PURE__ */ ge({
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
    const t = e, l = a, i = H(() => t.path ?? "where"), u = H(() => t.depth ?? 1), f = H(() => ["and", "or", "not", "history", "match", "rel", "children"].find((G) => G in t.modelValue) ?? "field"), v = H(() => Vi(t.schema)), p = H(() => v.value.find((G) => G.code === t.modelValue.field) ?? { code: "value", form: "text" }), o = H(() => Dt(t.modelValue.history)), n = H(() => v.value.find((G) => G.code === o.value.field) ?? { code: "history", form: "text" }), s = H(() => Array.isArray(t.modelValue[f.value]) ? t.modelValue[f.value] : []), h = () => ({ field: "category", op: "eq", value: "unstarted" }), m = j(/* @__PURE__ */ new Set());
    function k(G, R) {
      R ? m.value.delete(G) : m.value.add(G), l("validity", m.value.size === 0);
    }
    Ue(f, () => {
      m.value.clear(), l("validity", !0);
    });
    function V(G) {
      const R = /* @__PURE__ */ new Set();
      for (const N of m.value) {
        const w = Number(N);
        !Number.isNaN(w) && w !== G && R.add(String(w > G ? w - 1 : w));
      }
      m.value = R, l("validity", R.size === 0), x({ [f.value]: s.value.filter((N, w) => w !== G) });
    }
    function P(G) {
      l("update:modelValue", G);
    }
    function x(G) {
      P({ ...t.modelValue, ...G });
    }
    function T(G) {
      P(G === "field" ? h() : G === "and" || G === "or" ? { [G]: [h()] } : G === "not" ? { not: h() } : G === "history" ? { history: { field: "state", changed: !0 } } : G === "match" ? { match: "" } : G === "children" ? { children: !0, q: "some", where: h() } : { rel: t.schema.compiled.relation_types?.[0]?.id ?? "", dir: "outward", q: "some", where: h() });
    }
    function $(G, R) {
      x({ [f.value]: s.value.map((N, w) => w === G ? R : N) });
    }
    function C(G, R) {
      const N = { ...o.value };
      R === void 0 ? (delete N[G], k(G, !0)) : N[G] = R, x({ history: N });
    }
    function D(G) {
      m.value.clear(), l("validity", !0);
      const R = { ...o.value };
      delete R.was, delete R.changed, delete R.from, delete R.to, R[G] = G === "changed" ? !0 : "", x({ history: R });
    }
    const X = { code: "actor", form: "text" }, te = { code: "at", form: "time" }, me = H(() => Array.isArray(o.value.during) ? o.value.during : []);
    function de(G, R) {
      const N = [...me.value];
      N[G] = R, C("during", N);
    }
    return (G, R) => {
      const N = Bl("FilterNode", !0);
      return c(), y("fieldset", {
        class: "work-filter-node",
        disabled: e.disabled
      }, [
        d("legend", Gi, U(i.value), 1),
        d("label", Hi, [
          R[21] || (R[21] = F("Condition", -1)),
          b(r(ue), {
            "aria-label": i.value + " condition",
            "model-value": f.value,
            "onUpdate:modelValue": R[0] || (R[0] = (w) => T(w)),
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            optionDisabled: "disabled",
            options: [{ label: "Field", value: "field", disabled: !1 }, ...["and", "or", "not", "history", "rel", "children", "match"].map((w) => ({ label: w, value: w, disabled: u.value >= 6 && ["and", "or", "not", "rel", "children"].includes(w) }))]
          }, null, 8, ["aria-label", "model-value", "options"])
        ]),
        f.value === "and" || f.value === "or" ? (c(), y(Z, { key: 0 }, [
          (c(!0), y(Z, null, re(s.value, (w, O) => (c(), y("div", {
            key: O,
            class: "work-stack work-tight"
          }, [
            b(N, {
              "board-id": e.boardId,
              schema: e.schema,
              "model-value": w,
              path: i.value + "." + f.value + "[" + O + "]",
              depth: u.value + 1,
              "onUpdate:modelValue": (se) => $(O, se),
              onValidity: (se) => k(String(O), se)
            }, null, 8, ["board-id", "schema", "model-value", "path", "depth", "onUpdate:modelValue", "onValidity"]),
            b(r(J), {
              label: "Remove condition",
              size: "small",
              severity: "secondary",
              onClick: (se) => V(O),
              outlined: ""
            }, {
              icon: L(() => [
                b(r(le), {
                  icon: "tabler:trash",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["onClick"])
          ]))), 128)),
          b(r(J), {
            label: "Add condition",
            size: "small",
            severity: "secondary",
            disabled: u.value >= 6,
            onClick: R[1] || (R[1] = (w) => x({ [f.value]: [...s.value, h()] })),
            outlined: ""
          }, {
            icon: L(() => [
              b(r(le), {
                icon: "tabler:plus",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled"])
        ], 64)) : f.value === "not" ? (c(), W(N, {
          key: 1,
          "board-id": e.boardId,
          schema: e.schema,
          "model-value": r(Dt)(e.modelValue.not),
          path: i.value + ".not",
          depth: u.value + 1,
          "onUpdate:modelValue": R[2] || (R[2] = (w) => x({ not: w })),
          onValidity: R[3] || (R[3] = (w) => k("nested", w))
        }, null, 8, ["board-id", "schema", "model-value", "path", "depth"])) : f.value === "field" ? (c(), y(Z, { key: 2 }, [
          d("div", Yi, [
            d("label", null, [
              R[22] || (R[22] = F("Field", -1)),
              b(r(ue), {
                "aria-label": i.value + " field",
                "model-value": e.modelValue.field,
                "onUpdate:modelValue": R[4] || (R[4] = (w) => x({ field: w, op: "eq", value: void 0 })),
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                optionDisabled: "disabled",
                options: [...(v.value ?? []).map((w) => ({ label: r(Be)(w), value: w.code, disabled: !1 }))]
              }, null, 8, ["aria-label", "model-value", "options"])
            ]),
            d("label", null, [
              R[23] || (R[23] = F("Operator", -1)),
              b(r(ue), {
                "aria-label": i.value + " operator",
                "model-value": e.modelValue.op,
                "onUpdate:modelValue": R[5] || (R[5] = (w) => x({ op: w, value: w === "is_null" ? !0 : void 0 })),
                appendTo: "self",
                options: r($i)(p.value)
              }, null, 8, ["aria-label", "model-value", "options"])
            ])
          ]),
          b(Ht, {
            "board-id": e.boardId,
            field: e.modelValue.op === "is_null" ? { code: "null", form: "bool" } : p.value,
            "model-value": e.modelValue.value,
            multiple: ["in", "nin", "between"].includes(String(e.modelValue.op)),
            label: i.value + " value",
            "onUpdate:modelValue": R[6] || (R[6] = (w) => x({ value: w })),
            onValidity: R[7] || (R[7] = (w) => k("value", w))
          }, null, 8, ["board-id", "field", "model-value", "multiple", "label"])
        ], 64)) : f.value === "match" ? (c(), y("label", Xi, [
          R[24] || (R[24] = F("Search", -1)),
          b(r(be), {
            "aria-label": i.value + " search",
            value: e.modelValue.match,
            onInput: R[8] || (R[8] = (w) => x({ match: w.target.value }))
          }, null, 8, ["aria-label", "value"])
        ])) : f.value === "history" ? (c(), y(Z, { key: 4 }, [
          d("div", Ji, [
            d("label", null, [
              R[25] || (R[25] = F("Field", -1)),
              b(r(ue), {
                "aria-label": i.value + " history field",
                "model-value": o.value.field,
                "onUpdate:modelValue": R[9] || (R[9] = (w) => C("field", w)),
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                optionDisabled: "disabled",
                options: [...(v.value ?? []).map((w) => ({ label: r(Be)(w), value: w.code, disabled: !1 }))]
              }, null, 8, ["aria-label", "model-value", "options"])
            ]),
            d("label", null, [
              R[26] || (R[26] = F("History", -1)),
              b(r(ue), {
                "aria-label": i.value + " history mode",
                "model-value": o.value.changed ? "changed" : "was",
                "onUpdate:modelValue": R[10] || (R[10] = (w) => D(w)),
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                optionDisabled: "disabled",
                options: [{ label: "Changed", value: "changed", disabled: !1 }, { label: "Was", value: "was", disabled: !1 }]
              }, null, 8, ["aria-label", "model-value"])
            ])
          ]),
          o.value.changed ? (c(), y(Z, { key: 0 }, re(["from", "to"], (w) => d("div", { key: w }, [
            d("label", Zi, [
              b(r(jt), {
                "model-value": w in o.value,
                "aria-label": "Constrain " + w,
                "onUpdate:modelValue": (O) => C(w, O ? "" : void 0),
                binary: ""
              }, null, 8, ["model-value", "aria-label", "onUpdate:modelValue"]),
              F(U(w), 1)
            ]),
            w in o.value ? (c(), W(Ht, {
              key: 0,
              "board-id": e.boardId,
              field: n.value,
              "model-value": o.value[w],
              label: i.value + " history " + w,
              "onUpdate:modelValue": (O) => C(w, O),
              onValidity: (O) => k(w, O)
            }, null, 8, ["board-id", "field", "model-value", "label", "onUpdate:modelValue", "onValidity"])) : I("", !0)
          ])), 64)) : (c(), W(Ht, {
            key: 1,
            "board-id": e.boardId,
            field: n.value,
            "model-value": o.value.was,
            label: i.value + " history was",
            "onUpdate:modelValue": R[11] || (R[11] = (w) => C("was", w)),
            onValidity: R[12] || (R[12] = (w) => k("was", w))
          }, null, 8, ["board-id", "field", "model-value", "label"])),
          d("label", Qi, [
            b(r(jt), {
              "model-value": "by" in o.value,
              "aria-label": "Constrain actor",
              "onUpdate:modelValue": R[13] || (R[13] = (w) => C("by", w ? { $actor: "id" } : void 0)),
              binary: ""
            }, null, 8, ["model-value"]),
            R[27] || (R[27] = F("By actor", -1))
          ]),
          "by" in o.value ? (c(), W(Ht, {
            key: 2,
            "board-id": e.boardId,
            field: X,
            "model-value": o.value.by,
            label: i.value + " history by",
            "onUpdate:modelValue": R[14] || (R[14] = (w) => C("by", w))
          }, null, 8, ["board-id", "model-value", "label"])) : I("", !0),
          d("label", _i, [
            b(r(jt), {
              "model-value": "during" in o.value,
              "aria-label": "Constrain time window",
              "onUpdate:modelValue": R[15] || (R[15] = (w) => C("during", w ? [{ $now: "-P30D" }, { $now: "P0D" }] : void 0)),
              binary: ""
            }, null, 8, ["model-value"]),
            R[28] || (R[28] = F("During", -1))
          ]),
          "during" in o.value ? (c(), y("div", en, [
            (c(), y(Z, null, re(["start", "end"], (w, O) => b(Ht, {
              key: w,
              "board-id": e.boardId,
              field: te,
              "model-value": me.value[O],
              label: i.value + " during " + w,
              "onUpdate:modelValue": (se) => de(O, se)
            }, null, 8, ["board-id", "model-value", "label", "onUpdate:modelValue"])), 64))
          ])) : I("", !0)
        ], 64)) : (c(), y(Z, { key: 5 }, [
          d("div", tn, [
            f.value === "rel" ? (c(), y(Z, { key: 0 }, [
              d("label", null, [
                R[29] || (R[29] = F("Relation", -1)),
                b(r(ue), {
                  "model-value": e.modelValue.rel,
                  "onUpdate:modelValue": R[16] || (R[16] = (w) => x({ rel: w })),
                  appendTo: "self",
                  optionLabel: "label",
                  optionValue: "value",
                  optionDisabled: "disabled",
                  options: [...(e.schema.compiled.relation_types ?? []).map((w) => ({ label: w.outward ?? w.id, value: w.id, disabled: !1 }))]
                }, null, 8, ["model-value", "options"])
              ]),
              d("label", null, [
                R[30] || (R[30] = F("Direction", -1)),
                b(r(ue), {
                  "model-value": e.modelValue.dir,
                  "onUpdate:modelValue": R[17] || (R[17] = (w) => x({ dir: w })),
                  appendTo: "self",
                  optionLabel: "label",
                  optionValue: "value",
                  optionDisabled: "disabled",
                  options: [{ label: "Outward", value: "outward", disabled: !1 }, { label: "Inward", value: "inward", disabled: !1 }]
                }, null, 8, ["model-value"])
              ])
            ], 64)) : I("", !0),
            d("label", null, [
              R[31] || (R[31] = F("Quantifier", -1)),
              b(r(ue), {
                "model-value": e.modelValue.q,
                "onUpdate:modelValue": R[18] || (R[18] = (w) => x({ q: w })),
                appendTo: "self",
                options: ["some", "every", "none"]
              }, null, 8, ["model-value"])
            ])
          ]),
          b(N, {
            "board-id": e.boardId,
            schema: e.schema,
            "model-value": r(Dt)(e.modelValue.where),
            path: i.value + ".where",
            depth: u.value + 1,
            "onUpdate:modelValue": R[19] || (R[19] = (w) => x({ where: w })),
            onValidity: R[20] || (R[20] = (w) => k("nested", w))
          }, null, 8, ["board-id", "schema", "model-value", "path", "depth"])
        ], 64))
      ], 8, Ki);
    };
  }
}), ln = { class: "work-stack work-tight" }, on = { class: "work-row work-small" }, rl = /* @__PURE__ */ ge({
  __name: "ConditionEditor",
  props: {
    modelValue: {},
    draft: {},
    boardId: {},
    label: {}
  },
  emits: ["update:modelValue", "validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, i = H(() => ({ declaration: t.draft, compiled: t.draft, generation: 0, as_of: 0, key_prefix: "" })), u = /* @__PURE__ */ new Set();
    function f(p, o) {
      o ? u.delete(p) : u.add(p), l("validity", !u.size);
    }
    function v(p) {
      l("update:modelValue", p ? { field: t.draft.fields?.[0]?.code ?? "state", op: "eq" } : void 0), p || (u.clear(), l("validity", !0));
    }
    return yt(() => l("validity", !0)), (p, o) => (c(), y("section", ln, [
      d("label", on, [
        b(r(Ge), {
          "model-value": e.modelValue != null,
          "aria-label": e.label,
          "onUpdate:modelValue": v
        }, null, 8, ["model-value", "aria-label"]),
        F(U(e.label), 1)
      ]),
      e.modelValue != null ? (c(), W(an, {
        key: 0,
        schema: i.value,
        "board-id": e.boardId ?? "",
        "model-value": r(Dt)(e.modelValue),
        path: e.label,
        "onUpdate:modelValue": o[0] || (o[0] = (n) => l("update:modelValue", n)),
        onValidity: o[1] || (o[1] = (n) => f("structured", n))
      }, null, 8, ["schema", "board-id", "model-value", "path"])) : I("", !0),
      e.modelValue != null ? (c(), W(ht, {
        key: 1,
        label: e.label + " predicate",
        "model-value": e.modelValue,
        hint: "Use any predicate accepted by Work, including installed or deeply nested forms.",
        "onUpdate:modelValue": o[2] || (o[2] = (n) => l("update:modelValue", n)),
        onValidity: o[3] || (o[3] = (n) => f("raw", n))
      }, null, 8, ["label", "model-value"])) : I("", !0)
    ]));
  }
}), nn = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, sn = ["aria-label"], rn = { class: "work-field-label" }, dn = {
  key: 0,
  class: "work-chips"
}, un = ["kinds"], cn = {
  key: 2,
  class: "work-muted work-small"
}, dl = /* @__PURE__ */ ge({
  __name: "PrincipalsPicker",
  props: {
    modelValue: {},
    label: {},
    kinds: {},
    boardId: {}
  },
  emits: ["update:modelValue"],
  setup(e, { emit: a }) {
    const t = e, l = a, i = j(!1), u = j(0), f = H(() => t.modelValue ?? []), { principalLabel: v, rememberPrincipal: p, nameError: o } = ql(() => t.boardId ?? "", () => f.value);
    Ta(async () => {
      i.value = await pt("wc-principal-picker");
    });
    function n(s) {
      const h = s.detail, m = h?.principal_id ?? h?.id;
      if (!m) return;
      const k = { kind: h.type ?? "user", id: m };
      h.label && p(k, h.label), f.value.some((V) => V.id === m && V.kind === k.kind) || l("update:modelValue", [...f.value, k]), u.value++;
    }
    return (s, h) => (c(), y(Z, null, [
      r(o) ? (c(), y("p", nn, U(r(o)), 1)) : I("", !0),
      d("section", {
        class: "work-stack work-tight work-principals-picker",
        "aria-label": e.label
      }, [
        d("h4", rn, U(e.label), 1),
        f.value.length ? (c(), y("div", dn, [
          (c(!0), y(Z, null, re(f.value, (m, k) => (c(), W(r(Le), {
            key: m.kind + m.id,
            severity: "secondary",
            class: "kx-tag-sm"
          }, {
            default: L(() => [
              F(U(r(v)(m)), 1),
              b(r(J), {
                text: "",
                severity: "secondary",
                size: "small",
                "aria-label": "Remove " + r(v)(m),
                onClick: (V) => l("update:modelValue", f.value.filter((P, x) => x !== k))
              }, {
                default: L(() => [
                  b(r(le), { icon: "tabler:x" })
                ]),
                _: 1
              }, 8, ["aria-label", "onClick"])
            ]),
            _: 2
          }, 1024))), 128))
        ])) : I("", !0),
        i.value ? (c(), y("wc-principal-picker", {
          key: u.value,
          kinds: e.kinds ?? "user,group",
          onConfigChanged: n
        }, null, 40, un)) : (c(), y("p", cn, "People and group picker is unavailable."))
      ], 8, sn)
    ], 64));
  }
}), vn = { class: "work-stack work-tight" }, Jl = /* @__PURE__ */ ge({
  __name: "HoldersPicker",
  props: {
    modelValue: {},
    label: {},
    boardId: {}
  },
  emits: ["update:modelValue", "validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, i = H(() => (t.modelValue ?? []).flatMap((f) => "user" in f ? [{ kind: "user", id: f.user }] : "group" in f ? [{ kind: "group", id: f.group }] : []));
    function u(f) {
      const v = [...(t.modelValue ?? []).filter((p) => "field" in p || "service" in p), ...f.map((p) => p.kind === "group" ? { group: p.id } : { user: p.id })];
      l("update:modelValue", v.length ? v : void 0);
    }
    return (f, v) => (c(), y("div", vn, [
      b(dl, {
        "board-id": e.boardId,
        label: e.label,
        "model-value": i.value,
        "onUpdate:modelValue": u
      }, null, 8, ["board-id", "label", "model-value"]),
      b(ht, {
        label: e.label + " rules",
        "model-value": e.modelValue,
        shape: "array",
        example: [{ group: "selected-group" }],
        "onUpdate:modelValue": v[0] || (v[0] = (p) => l("update:modelValue", p)),
        onValidity: v[1] || (v[1] = (p) => l("validity", p))
      }, null, 8, ["label", "model-value"])
    ]));
  }
});
/**!
 * Sortable 1.15.7
 * @author	RubaXa   <trash@rubaxa.org>
 * @author	owenm    <owen23355@gmail.com>
 * @license MIT
 */
function mn(e, a, t) {
  return (a = hn(a)) in e ? Object.defineProperty(e, a, {
    value: t,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : e[a] = t, e;
}
function nt() {
  return nt = Object.assign ? Object.assign.bind() : function(e) {
    for (var a = 1; a < arguments.length; a++) {
      var t = arguments[a];
      for (var l in t) ({}).hasOwnProperty.call(t, l) && (e[l] = t[l]);
    }
    return e;
  }, nt.apply(null, arguments);
}
function $l(e, a) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(e);
    a && (l = l.filter(function(i) {
      return Object.getOwnPropertyDescriptor(e, i).enumerable;
    })), t.push.apply(t, l);
  }
  return t;
}
function ot(e) {
  for (var a = 1; a < arguments.length; a++) {
    var t = arguments[a] != null ? arguments[a] : {};
    a % 2 ? $l(Object(t), !0).forEach(function(l) {
      mn(e, l, t[l]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : $l(Object(t)).forEach(function(l) {
      Object.defineProperty(e, l, Object.getOwnPropertyDescriptor(t, l));
    });
  }
  return e;
}
function fn(e, a) {
  if (e == null) return {};
  var t, l, i = pn(e, a);
  if (Object.getOwnPropertySymbols) {
    var u = Object.getOwnPropertySymbols(e);
    for (l = 0; l < u.length; l++) t = u[l], a.indexOf(t) === -1 && {}.propertyIsEnumerable.call(e, t) && (i[t] = e[t]);
  }
  return i;
}
function pn(e, a) {
  if (e == null) return {};
  var t = {};
  for (var l in e) if ({}.hasOwnProperty.call(e, l)) {
    if (a.indexOf(l) !== -1) continue;
    t[l] = e[l];
  }
  return t;
}
function bn(e, a) {
  if (typeof e != "object" || !e) return e;
  var t = e[Symbol.toPrimitive];
  if (t !== void 0) {
    var l = t.call(e, a);
    if (typeof l != "object") return l;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (a === "string" ? String : Number)(e);
}
function hn(e) {
  var a = bn(e, "string");
  return typeof a == "symbol" ? a : a + "";
}
function Za(e) {
  "@babel/helpers - typeof";
  return Za = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(a) {
    return typeof a;
  } : function(a) {
    return a && typeof Symbol == "function" && a.constructor === Symbol && a !== Symbol.prototype ? "symbol" : typeof a;
  }, Za(e);
}
var yn = "1.15.7";
function it(e) {
  if (typeof window < "u" && window.navigator)
    return !!/* @__PURE__ */ navigator.userAgent.match(e);
}
var st = it(/(?:Trident.*rv[ :]?11\.|msie|iemobile|Windows Phone)/i), ia = it(/Edge/i), xl = it(/firefox/i), _t = it(/safari/i) && !it(/chrome/i) && !it(/android/i), ul = it(/iP(ad|od|hone)/i), Zl = it(/chrome/i) && it(/android/i), Ql = {
  capture: !1,
  passive: !1
};
function ke(e, a, t) {
  e.addEventListener(a, t, !st && Ql);
}
function ye(e, a, t) {
  e.removeEventListener(a, t, !st && Ql);
}
function wa(e, a) {
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
function _l(e) {
  return e.host && e !== document && e.host.nodeType && e.host !== e ? e.host : e.parentNode;
}
function Qe(e, a, t, l) {
  if (e) {
    t = t || document;
    do {
      if (a != null && (a[0] === ">" ? e.parentNode === t && wa(e, a) : wa(e, a)) || l && e === t)
        return e;
      if (e === t) break;
    } while (e = _l(e));
  }
  return null;
}
var Cl = /\s+/g;
function We(e, a, t) {
  if (e && a)
    if (e.classList)
      e.classList[t ? "add" : "remove"](a);
    else {
      var l = (" " + e.className + " ").replace(Cl, " ").replace(" " + a + " ", " ");
      e.className = (l + (t ? " " + a : "")).replace(Cl, " ");
    }
}
function ce(e, a, t) {
  var l = e && e.style;
  if (l) {
    if (t === void 0)
      return document.defaultView && document.defaultView.getComputedStyle ? t = document.defaultView.getComputedStyle(e, "") : e.currentStyle && (t = e.currentStyle), a === void 0 ? t : t[a];
    !(a in l) && a.indexOf("webkit") === -1 && (a = "-webkit-" + a), l[a] = t + (typeof t == "string" ? "" : "px");
  }
}
function qt(e, a) {
  var t = "";
  if (typeof e == "string")
    t = e;
  else
    do {
      var l = ce(e, "transform");
      l && l !== "none" && (t = l + " " + t);
    } while (!a && (e = e.parentNode));
  var i = window.DOMMatrix || window.WebKitCSSMatrix || window.CSSMatrix || window.MSCSSMatrix;
  return i && new i(t);
}
function eo(e, a, t) {
  if (e) {
    var l = e.getElementsByTagName(a), i = 0, u = l.length;
    if (t)
      for (; i < u; i++)
        t(l[i], i);
    return l;
  }
  return [];
}
function lt() {
  var e = document.scrollingElement;
  return e || document.documentElement;
}
function Re(e, a, t, l, i) {
  if (!(!e.getBoundingClientRect && e !== window)) {
    var u, f, v, p, o, n, s;
    if (e !== window && e.parentNode && e !== lt() ? (u = e.getBoundingClientRect(), f = u.top, v = u.left, p = u.bottom, o = u.right, n = u.height, s = u.width) : (f = 0, v = 0, p = window.innerHeight, o = window.innerWidth, n = window.innerHeight, s = window.innerWidth), (a || t) && e !== window && (i = i || e.parentNode, !st))
      do
        if (i && i.getBoundingClientRect && (ce(i, "transform") !== "none" || t && ce(i, "position") !== "static")) {
          var h = i.getBoundingClientRect();
          f -= h.top + parseInt(ce(i, "border-top-width")), v -= h.left + parseInt(ce(i, "border-left-width")), p = f + u.height, o = v + u.width;
          break;
        }
      while (i = i.parentNode);
    if (l && e !== window) {
      var m = qt(i || e), k = m && m.a, V = m && m.d;
      m && (f /= V, v /= k, s /= k, n /= V, p = f + n, o = v + s);
    }
    return {
      top: f,
      left: v,
      bottom: p,
      right: o,
      width: s,
      height: n
    };
  }
}
function Sl(e, a, t) {
  for (var l = ft(e, !0), i = Re(e)[a]; l; ) {
    var u = Re(l)[t], f = void 0;
    if (f = i >= u, !f) return l;
    if (l === lt()) break;
    l = ft(l, !1);
  }
  return !1;
}
function Kt(e, a, t, l) {
  for (var i = 0, u = 0, f = e.children; u < f.length; ) {
    if (f[u].style.display !== "none" && f[u] !== ve.ghost && (l || f[u] !== ve.dragged) && Qe(f[u], t.draggable, e, !1)) {
      if (i === a)
        return f[u];
      i++;
    }
    u++;
  }
  return null;
}
function cl(e, a) {
  for (var t = e.lastElementChild; t && (t === ve.ghost || ce(t, "display") === "none" || a && !wa(t, a)); )
    t = t.previousElementSibling;
  return t || null;
}
function He(e, a) {
  var t = 0;
  if (!e || !e.parentNode)
    return -1;
  for (; e = e.previousElementSibling; )
    e.nodeName.toUpperCase() !== "TEMPLATE" && e !== ve.clone && (!a || wa(e, a)) && t++;
  return t;
}
function Tl(e) {
  var a = 0, t = 0, l = lt();
  if (e)
    do {
      var i = qt(e), u = i.a, f = i.d;
      a += e.scrollLeft * u, t += e.scrollTop * f;
    } while (e !== l && (e = e.parentNode));
  return [a, t];
}
function gn(e, a) {
  for (var t in e)
    if (e.hasOwnProperty(t)) {
      for (var l in a)
        if (a.hasOwnProperty(l) && a[l] === e[t][l]) return Number(t);
    }
  return -1;
}
function ft(e, a) {
  if (!e || !e.getBoundingClientRect) return lt();
  var t = e, l = !1;
  do
    if (t.clientWidth < t.scrollWidth || t.clientHeight < t.scrollHeight) {
      var i = ce(t);
      if (t.clientWidth < t.scrollWidth && (i.overflowX == "auto" || i.overflowX == "scroll") || t.clientHeight < t.scrollHeight && (i.overflowY == "auto" || i.overflowY == "scroll")) {
        if (!t.getBoundingClientRect || t === document.body) return lt();
        if (l || a) return t;
        l = !0;
      }
    }
  while (t = t.parentNode);
  return lt();
}
function kn(e, a) {
  if (e && a)
    for (var t in a)
      a.hasOwnProperty(t) && (e[t] = a[t]);
  return e;
}
function Ma(e, a) {
  return Math.round(e.top) === Math.round(a.top) && Math.round(e.left) === Math.round(a.left) && Math.round(e.height) === Math.round(a.height) && Math.round(e.width) === Math.round(a.width);
}
var ea;
function to(e, a) {
  return function() {
    if (!ea) {
      var t = arguments, l = this;
      t.length === 1 ? e.call(l, t[0]) : e.apply(l, t), ea = setTimeout(function() {
        ea = void 0;
      }, a);
    }
  };
}
function wn() {
  clearTimeout(ea), ea = void 0;
}
function ao(e, a, t) {
  e.scrollLeft += a, e.scrollTop += t;
}
function lo(e) {
  var a = window.Polymer, t = window.jQuery || window.Zepto;
  return a && a.dom ? a.dom(e).cloneNode(!0) : t ? t(e).clone(!0)[0] : e.cloneNode(!0);
}
function oo(e, a, t) {
  var l = {};
  return Array.from(e.children).forEach(function(i) {
    var u, f, v, p;
    if (!(!Qe(i, a.draggable, e, !1) || i.animated || i === t)) {
      var o = Re(i);
      l.left = Math.min((u = l.left) !== null && u !== void 0 ? u : 1 / 0, o.left), l.top = Math.min((f = l.top) !== null && f !== void 0 ? f : 1 / 0, o.top), l.right = Math.max((v = l.right) !== null && v !== void 0 ? v : -1 / 0, o.right), l.bottom = Math.max((p = l.bottom) !== null && p !== void 0 ? p : -1 / 0, o.bottom);
    }
  }), l.width = l.right - l.left, l.height = l.bottom - l.top, l.x = l.left, l.y = l.top, l;
}
var qe = "Sortable" + (/* @__PURE__ */ new Date()).getTime();
function Vn() {
  var e = [], a;
  return {
    captureAnimationState: function() {
      if (e = [], !!this.options.animation) {
        var l = [].slice.call(this.el.children);
        l.forEach(function(i) {
          if (!(ce(i, "display") === "none" || i === ve.ghost)) {
            e.push({
              target: i,
              rect: Re(i)
            });
            var u = ot({}, e[e.length - 1].rect);
            if (i.thisAnimationDuration) {
              var f = qt(i, !0);
              f && (u.top -= f.f, u.left -= f.e);
            }
            i.fromRect = u;
          }
        });
      }
    },
    addAnimationState: function(l) {
      e.push(l);
    },
    removeAnimationState: function(l) {
      e.splice(gn(e, {
        target: l
      }), 1);
    },
    animateAll: function(l) {
      var i = this;
      if (!this.options.animation) {
        clearTimeout(a), typeof l == "function" && l();
        return;
      }
      var u = !1, f = 0;
      e.forEach(function(v) {
        var p = 0, o = v.target, n = o.fromRect, s = Re(o), h = o.prevFromRect, m = o.prevToRect, k = v.rect, V = qt(o, !0);
        V && (s.top -= V.f, s.left -= V.e), o.toRect = s, o.thisAnimationDuration && Ma(h, s) && !Ma(n, s) && // Make sure animatingRect is on line between toRect & fromRect
        (k.top - s.top) / (k.left - s.left) === (n.top - s.top) / (n.left - s.left) && (p = xn(k, h, m, i.options)), Ma(s, n) || (o.prevFromRect = n, o.prevToRect = s, p || (p = i.options.animation), i.animate(o, k, s, p)), p && (u = !0, f = Math.max(f, p), clearTimeout(o.animationResetTimer), o.animationResetTimer = setTimeout(function() {
          o.animationTime = 0, o.prevFromRect = null, o.fromRect = null, o.prevToRect = null, o.thisAnimationDuration = null;
        }, p), o.thisAnimationDuration = p);
      }), clearTimeout(a), u ? a = setTimeout(function() {
        typeof l == "function" && l();
      }, f) : typeof l == "function" && l(), e = [];
    },
    animate: function(l, i, u, f) {
      if (f) {
        ce(l, "transition", ""), ce(l, "transform", "");
        var v = qt(this.el), p = v && v.a, o = v && v.d, n = (i.left - u.left) / (p || 1), s = (i.top - u.top) / (o || 1);
        l.animatingX = !!n, l.animatingY = !!s, ce(l, "transform", "translate3d(" + n + "px," + s + "px,0)"), this.forRepaintDummy = $n(l), ce(l, "transition", "transform " + f + "ms" + (this.options.easing ? " " + this.options.easing : "")), ce(l, "transform", "translate3d(0,0,0)"), typeof l.animated == "number" && clearTimeout(l.animated), l.animated = setTimeout(function() {
          ce(l, "transition", ""), ce(l, "transform", ""), l.animated = !1, l.animatingX = !1, l.animatingY = !1;
        }, f);
      }
    }
  };
}
function $n(e) {
  return e.offsetWidth;
}
function xn(e, a, t, l) {
  return Math.sqrt(Math.pow(a.top - e.top, 2) + Math.pow(a.left - e.left, 2)) / Math.sqrt(Math.pow(a.top - t.top, 2) + Math.pow(a.left - t.left, 2)) * l.animation;
}
var Mt = [], Fa = {
  initializeByDefault: !0
}, na = {
  mount: function(a) {
    for (var t in Fa)
      Fa.hasOwnProperty(t) && !(t in a) && (a[t] = Fa[t]);
    Mt.forEach(function(l) {
      if (l.pluginName === a.pluginName)
        throw "Sortable: Cannot mount plugin ".concat(a.pluginName, " more than once");
    }), Mt.push(a);
  },
  pluginEvent: function(a, t, l) {
    var i = this;
    this.eventCanceled = !1, l.cancel = function() {
      i.eventCanceled = !0;
    };
    var u = a + "Global";
    Mt.forEach(function(f) {
      t[f.pluginName] && (t[f.pluginName][u] && t[f.pluginName][u](ot({
        sortable: t
      }, l)), t.options[f.pluginName] && t[f.pluginName][a] && t[f.pluginName][a](ot({
        sortable: t
      }, l)));
    });
  },
  initializePlugins: function(a, t, l, i) {
    Mt.forEach(function(v) {
      var p = v.pluginName;
      if (!(!a.options[p] && !v.initializeByDefault)) {
        var o = new v(a, t, a.options);
        o.sortable = a, o.options = a.options, a[p] = o, nt(l, o.defaults);
      }
    });
    for (var u in a.options)
      if (a.options.hasOwnProperty(u)) {
        var f = this.modifyOption(a, u, a.options[u]);
        typeof f < "u" && (a.options[u] = f);
      }
  },
  getEventProperties: function(a, t) {
    var l = {};
    return Mt.forEach(function(i) {
      typeof i.eventProperties == "function" && nt(l, i.eventProperties.call(t[i.pluginName], a));
    }), l;
  },
  modifyOption: function(a, t, l) {
    var i;
    return Mt.forEach(function(u) {
      a[u.pluginName] && u.optionListeners && typeof u.optionListeners[t] == "function" && (i = u.optionListeners[t].call(a[u.pluginName], l));
    }), i;
  }
};
function Cn(e) {
  var a = e.sortable, t = e.rootEl, l = e.name, i = e.targetEl, u = e.cloneEl, f = e.toEl, v = e.fromEl, p = e.oldIndex, o = e.newIndex, n = e.oldDraggableIndex, s = e.newDraggableIndex, h = e.originalEvent, m = e.putSortable, k = e.extraEventProperties;
  if (a = a || t && t[qe], !!a) {
    var V, P = a.options, x = "on" + l.charAt(0).toUpperCase() + l.substr(1);
    window.CustomEvent && !st && !ia ? V = new CustomEvent(l, {
      bubbles: !0,
      cancelable: !0
    }) : (V = document.createEvent("Event"), V.initEvent(l, !0, !0)), V.to = f || t, V.from = v || t, V.item = i || t, V.clone = u, V.oldIndex = p, V.newIndex = o, V.oldDraggableIndex = n, V.newDraggableIndex = s, V.originalEvent = h, V.pullMode = m ? m.lastPutMode : void 0;
    var T = ot(ot({}, k), na.getEventProperties(l, a));
    for (var $ in T)
      V[$] = T[$];
    t && t.dispatchEvent(V), P[x] && P[x].call(a, V);
  }
}
var Sn = ["evt"], je = function(a, t) {
  var l = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, i = l.evt, u = fn(l, Sn);
  na.pluginEvent.bind(ve)(a, t, ot({
    dragEl: Y,
    parentEl: Ee,
    ghostEl: fe,
    rootEl: De,
    nextEl: xt,
    lastDownEl: pa,
    cloneEl: Ie,
    cloneHidden: mt,
    dragStarted: Yt,
    putSortable: Ne,
    activeSortable: ve.active,
    originalEvent: i,
    oldIndex: Bt,
    oldDraggableIndex: ta,
    newIndex: Ke,
    newDraggableIndex: vt,
    hideGhostForTarget: ro,
    unhideGhostForTarget: uo,
    cloneNowHidden: function() {
      mt = !0;
    },
    cloneNowShown: function() {
      mt = !1;
    },
    dispatchSortableEvent: function(v) {
      ze({
        sortable: t,
        name: v,
        originalEvent: i
      });
    }
  }, u));
};
function ze(e) {
  Cn(ot({
    putSortable: Ne,
    cloneEl: Ie,
    targetEl: Y,
    rootEl: De,
    oldIndex: Bt,
    oldDraggableIndex: ta,
    newIndex: Ke,
    newDraggableIndex: vt
  }, e));
}
var Y, Ee, fe, De, xt, pa, Ie, mt, Bt, Ke, ta, vt, ca, Ne, Lt = !1, Va = !1, $a = [], kt, Ze, La, za, Dl, Il, Yt, Ft, aa, la = !1, va = !1, ba, Fe, Ba = [], Qa = !1, xa = [], Ea = typeof document < "u", ma = ul, Ul = ia || st ? "cssFloat" : "float", Tn = Ea && !Zl && !ul && "draggable" in document.createElement("div"), io = (function() {
  if (Ea) {
    if (st)
      return !1;
    var e = document.createElement("x");
    return e.style.cssText = "pointer-events:auto", e.style.pointerEvents === "auto";
  }
})(), no = function(a, t) {
  var l = ce(a), i = parseInt(l.width) - parseInt(l.paddingLeft) - parseInt(l.paddingRight) - parseInt(l.borderLeftWidth) - parseInt(l.borderRightWidth), u = Kt(a, 0, t), f = Kt(a, 1, t), v = u && ce(u), p = f && ce(f), o = v && parseInt(v.marginLeft) + parseInt(v.marginRight) + Re(u).width, n = p && parseInt(p.marginLeft) + parseInt(p.marginRight) + Re(f).width;
  if (l.display === "flex")
    return l.flexDirection === "column" || l.flexDirection === "column-reverse" ? "vertical" : "horizontal";
  if (l.display === "grid")
    return l.gridTemplateColumns.split(" ").length <= 1 ? "vertical" : "horizontal";
  if (u && v.float && v.float !== "none") {
    var s = v.float === "left" ? "left" : "right";
    return f && (p.clear === "both" || p.clear === s) ? "vertical" : "horizontal";
  }
  return u && (v.display === "block" || v.display === "flex" || v.display === "table" || v.display === "grid" || o >= i && l[Ul] === "none" || f && l[Ul] === "none" && o + n > i) ? "vertical" : "horizontal";
}, Dn = function(a, t, l) {
  var i = l ? a.left : a.top, u = l ? a.right : a.bottom, f = l ? a.width : a.height, v = l ? t.left : t.top, p = l ? t.right : t.bottom, o = l ? t.width : t.height;
  return i === v || u === p || i + f / 2 === v + o / 2;
}, In = function(a, t) {
  var l;
  return $a.some(function(i) {
    var u = i[qe].options.emptyInsertThreshold;
    if (!(!u || cl(i))) {
      var f = Re(i), v = a >= f.left - u && a <= f.right + u, p = t >= f.top - u && t <= f.bottom + u;
      if (v && p)
        return l = i;
    }
  }), l;
}, so = function(a) {
  function t(u, f) {
    return function(v, p, o, n) {
      var s = v.options.group.name && p.options.group.name && v.options.group.name === p.options.group.name;
      if (u == null && (f || s))
        return !0;
      if (u == null || u === !1)
        return !1;
      if (f && u === "clone")
        return u;
      if (typeof u == "function")
        return t(u(v, p, o, n), f)(v, p, o, n);
      var h = (f ? v : p).options.group.name;
      return u === !0 || typeof u == "string" && u === h || u.join && u.indexOf(h) > -1;
    };
  }
  var l = {}, i = a.group;
  (!i || Za(i) != "object") && (i = {
    name: i
  }), l.name = i.name, l.checkPull = t(i.pull, !0), l.checkPut = t(i.put), l.revertClone = i.revertClone, a.group = l;
}, ro = function() {
  !io && fe && ce(fe, "display", "none");
}, uo = function() {
  !io && fe && ce(fe, "display", "");
};
Ea && !Zl && document.addEventListener("click", function(e) {
  if (Va)
    return e.preventDefault(), e.stopPropagation && e.stopPropagation(), e.stopImmediatePropagation && e.stopImmediatePropagation(), Va = !1, !1;
}, !0);
var wt = function(a) {
  if (Y) {
    a = a.touches ? a.touches[0] : a;
    var t = In(a.clientX, a.clientY);
    if (t) {
      var l = {};
      for (var i in a)
        a.hasOwnProperty(i) && (l[i] = a[i]);
      l.target = l.rootEl = t, l.preventDefault = void 0, l.stopPropagation = void 0, t[qe]._onDragOver(l);
    }
  }
}, Un = function(a) {
  Y && Y.parentNode[qe]._isOutsideThisEl(a.target);
};
function ve(e, a) {
  if (!(e && e.nodeType && e.nodeType === 1))
    throw "Sortable: `el` must be an HTMLElement, not ".concat({}.toString.call(e));
  this.el = e, this.options = a = nt({}, a), e[qe] = this;
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
      return no(e, this.options);
    },
    ghostClass: "sortable-ghost",
    chosenClass: "sortable-chosen",
    dragClass: "sortable-drag",
    ignore: "a, img",
    filter: null,
    preventOnFilter: !0,
    animation: 0,
    easing: null,
    setData: function(f, v) {
      f.setData("Text", v.textContent);
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
    supportPointer: ve.supportPointer !== !1 && "PointerEvent" in window && (!_t || ul),
    emptyInsertThreshold: 5
  };
  na.initializePlugins(this, e, t);
  for (var l in t)
    !(l in a) && (a[l] = t[l]);
  so(a);
  for (var i in this)
    i.charAt(0) === "_" && typeof this[i] == "function" && (this[i] = this[i].bind(this));
  this.nativeDraggable = a.forceFallback ? !1 : Tn, this.nativeDraggable && (this.options.touchStartThreshold = 1), a.supportPointer ? ke(e, "pointerdown", this._onTapStart) : (ke(e, "mousedown", this._onTapStart), ke(e, "touchstart", this._onTapStart)), this.nativeDraggable && (ke(e, "dragover", this), ke(e, "dragenter", this)), $a.push(this.el), a.store && a.store.get && this.sort(a.store.get(this) || []), nt(this, Vn());
}
ve.prototype = /** @lends Sortable.prototype */
{
  constructor: ve,
  _isOutsideThisEl: function(a) {
    !this.el.contains(a) && a !== this.el && (Ft = null);
  },
  _getDirection: function(a, t) {
    return typeof this.options.direction == "function" ? this.options.direction.call(this, a, t, Y) : this.options.direction;
  },
  _onTapStart: function(a) {
    if (a.cancelable) {
      var t = this, l = this.el, i = this.options, u = i.preventOnFilter, f = a.type, v = a.touches && a.touches[0] || a.pointerType && a.pointerType === "touch" && a, p = (v || a).target, o = a.target.shadowRoot && (a.path && a.path[0] || a.composedPath && a.composedPath()[0]) || p, n = i.filter;
      if (Fn(l), !Y && !(/mousedown|pointerdown/.test(f) && a.button !== 0 || i.disabled) && !o.isContentEditable && !(!this.nativeDraggable && _t && p && p.tagName.toUpperCase() === "SELECT") && (p = Qe(p, i.draggable, l, !1), !(p && p.animated) && pa !== p)) {
        if (Bt = He(p), ta = He(p, i.draggable), typeof n == "function") {
          if (n.call(this, a, p, this)) {
            ze({
              sortable: t,
              rootEl: o,
              name: "filter",
              targetEl: p,
              toEl: l,
              fromEl: l
            }), je("filter", t, {
              evt: a
            }), u && a.preventDefault();
            return;
          }
        } else if (n && (n = n.split(",").some(function(s) {
          if (s = Qe(o, s.trim(), l, !1), s)
            return ze({
              sortable: t,
              rootEl: s,
              name: "filter",
              targetEl: p,
              fromEl: l,
              toEl: l
            }), je("filter", t, {
              evt: a
            }), !0;
        }), n)) {
          u && a.preventDefault();
          return;
        }
        i.handle && !Qe(o, i.handle, l, !1) || this._prepareDragStart(a, v, p);
      }
    }
  },
  _prepareDragStart: function(a, t, l) {
    var i = this, u = i.el, f = i.options, v = u.ownerDocument, p;
    if (l && !Y && l.parentNode === u) {
      var o = Re(l);
      if (De = u, Y = l, Ee = Y.parentNode, xt = Y.nextSibling, pa = l, ca = f.group, ve.dragged = Y, kt = {
        target: Y,
        clientX: (t || a).clientX,
        clientY: (t || a).clientY
      }, Dl = kt.clientX - o.left, Il = kt.clientY - o.top, this._lastX = (t || a).clientX, this._lastY = (t || a).clientY, Y.style["will-change"] = "all", p = function() {
        if (je("delayEnded", i, {
          evt: a
        }), ve.eventCanceled) {
          i._onDrop();
          return;
        }
        i._disableDelayedDragEvents(), !xl && i.nativeDraggable && (Y.draggable = !0), i._triggerDragStart(a, t), ze({
          sortable: i,
          name: "choose",
          originalEvent: a
        }), We(Y, f.chosenClass, !0);
      }, f.ignore.split(",").forEach(function(n) {
        eo(Y, n.trim(), ja);
      }), ke(v, "dragover", wt), ke(v, "mousemove", wt), ke(v, "touchmove", wt), f.supportPointer ? (ke(v, "pointerup", i._onDrop), !this.nativeDraggable && ke(v, "pointercancel", i._onDrop)) : (ke(v, "mouseup", i._onDrop), ke(v, "touchend", i._onDrop), ke(v, "touchcancel", i._onDrop)), xl && this.nativeDraggable && (this.options.touchStartThreshold = 4, Y.draggable = !0), je("delayStart", this, {
        evt: a
      }), f.delay && (!f.delayOnTouchOnly || t) && (!this.nativeDraggable || !(ia || st))) {
        if (ve.eventCanceled) {
          this._onDrop();
          return;
        }
        f.supportPointer ? (ke(v, "pointerup", i._disableDelayedDrag), ke(v, "pointercancel", i._disableDelayedDrag)) : (ke(v, "mouseup", i._disableDelayedDrag), ke(v, "touchend", i._disableDelayedDrag), ke(v, "touchcancel", i._disableDelayedDrag)), ke(v, "mousemove", i._delayedDragTouchMoveHandler), ke(v, "touchmove", i._delayedDragTouchMoveHandler), f.supportPointer && ke(v, "pointermove", i._delayedDragTouchMoveHandler), i._dragStartTimer = setTimeout(p, f.delay);
      } else
        p();
    }
  },
  _delayedDragTouchMoveHandler: function(a) {
    var t = a.touches ? a.touches[0] : a;
    Math.max(Math.abs(t.clientX - this._lastX), Math.abs(t.clientY - this._lastY)) >= Math.floor(this.options.touchStartThreshold / (this.nativeDraggable && window.devicePixelRatio || 1)) && this._disableDelayedDrag();
  },
  _disableDelayedDrag: function() {
    Y && ja(Y), clearTimeout(this._dragStartTimer), this._disableDelayedDragEvents();
  },
  _disableDelayedDragEvents: function() {
    var a = this.el.ownerDocument;
    ye(a, "mouseup", this._disableDelayedDrag), ye(a, "touchend", this._disableDelayedDrag), ye(a, "touchcancel", this._disableDelayedDrag), ye(a, "pointerup", this._disableDelayedDrag), ye(a, "pointercancel", this._disableDelayedDrag), ye(a, "mousemove", this._delayedDragTouchMoveHandler), ye(a, "touchmove", this._delayedDragTouchMoveHandler), ye(a, "pointermove", this._delayedDragTouchMoveHandler);
  },
  _triggerDragStart: function(a, t) {
    t = t || a.pointerType == "touch" && a, !this.nativeDraggable || t ? this.options.supportPointer ? ke(document, "pointermove", this._onTouchMove) : t ? ke(document, "touchmove", this._onTouchMove) : ke(document, "mousemove", this._onTouchMove) : (ke(Y, "dragend", this), ke(De, "dragstart", this._onDragStart));
    try {
      document.selection ? ha(function() {
        document.selection.empty();
      }) : window.getSelection().removeAllRanges();
    } catch {
    }
  },
  _dragStarted: function(a, t) {
    if (Lt = !1, De && Y) {
      je("dragStarted", this, {
        evt: t
      }), this.nativeDraggable && ke(document, "dragover", Un);
      var l = this.options;
      !a && We(Y, l.dragClass, !1), We(Y, l.ghostClass, !0), ve.active = this, a && this._appendGhost(), ze({
        sortable: this,
        name: "start",
        originalEvent: t
      });
    } else
      this._nulling();
  },
  _emulateDragOver: function() {
    if (Ze) {
      this._lastX = Ze.clientX, this._lastY = Ze.clientY, ro();
      for (var a = document.elementFromPoint(Ze.clientX, Ze.clientY), t = a; a && a.shadowRoot && (a = a.shadowRoot.elementFromPoint(Ze.clientX, Ze.clientY), a !== t); )
        t = a;
      if (Y.parentNode[qe]._isOutsideThisEl(a), t)
        do {
          if (t[qe]) {
            var l = void 0;
            if (l = t[qe]._onDragOver({
              clientX: Ze.clientX,
              clientY: Ze.clientY,
              target: a,
              rootEl: t
            }), l && !this.options.dragoverBubble)
              break;
          }
          a = t;
        } while (t = _l(t));
      uo();
    }
  },
  _onTouchMove: function(a) {
    if (kt) {
      var t = this.options, l = t.fallbackTolerance, i = t.fallbackOffset, u = a.touches ? a.touches[0] : a, f = fe && qt(fe, !0), v = fe && f && f.a, p = fe && f && f.d, o = ma && Fe && Tl(Fe), n = (u.clientX - kt.clientX + i.x) / (v || 1) + (o ? o[0] - Ba[0] : 0) / (v || 1), s = (u.clientY - kt.clientY + i.y) / (p || 1) + (o ? o[1] - Ba[1] : 0) / (p || 1);
      if (!ve.active && !Lt) {
        if (l && Math.max(Math.abs(u.clientX - this._lastX), Math.abs(u.clientY - this._lastY)) < l)
          return;
        this._onDragStart(a, !0);
      }
      if (fe) {
        f ? (f.e += n - (La || 0), f.f += s - (za || 0)) : f = {
          a: 1,
          b: 0,
          c: 0,
          d: 1,
          e: n,
          f: s
        };
        var h = "matrix(".concat(f.a, ",").concat(f.b, ",").concat(f.c, ",").concat(f.d, ",").concat(f.e, ",").concat(f.f, ")");
        ce(fe, "webkitTransform", h), ce(fe, "mozTransform", h), ce(fe, "msTransform", h), ce(fe, "transform", h), La = n, za = s, Ze = u;
      }
      a.cancelable && a.preventDefault();
    }
  },
  _appendGhost: function() {
    if (!fe) {
      var a = this.options.fallbackOnBody ? document.body : De, t = Re(Y, !0, ma, !0, a), l = this.options;
      if (ma) {
        for (Fe = a; ce(Fe, "position") === "static" && ce(Fe, "transform") === "none" && Fe !== document; )
          Fe = Fe.parentNode;
        Fe !== document.body && Fe !== document.documentElement ? (Fe === document && (Fe = lt()), t.top += Fe.scrollTop, t.left += Fe.scrollLeft) : Fe = lt(), Ba = Tl(Fe);
      }
      fe = Y.cloneNode(!0), We(fe, l.ghostClass, !1), We(fe, l.fallbackClass, !0), We(fe, l.dragClass, !0), ce(fe, "transition", ""), ce(fe, "transform", ""), ce(fe, "box-sizing", "border-box"), ce(fe, "margin", 0), ce(fe, "top", t.top), ce(fe, "left", t.left), ce(fe, "width", t.width), ce(fe, "height", t.height), ce(fe, "opacity", "0.8"), ce(fe, "position", ma ? "absolute" : "fixed"), ce(fe, "zIndex", "100000"), ce(fe, "pointerEvents", "none"), ve.ghost = fe, a.appendChild(fe), ce(fe, "transform-origin", Dl / parseInt(fe.style.width) * 100 + "% " + Il / parseInt(fe.style.height) * 100 + "%");
    }
  },
  _onDragStart: function(a, t) {
    var l = this, i = a.dataTransfer, u = l.options;
    if (je("dragStart", this, {
      evt: a
    }), ve.eventCanceled) {
      this._onDrop();
      return;
    }
    je("setupClone", this), ve.eventCanceled || (Ie = lo(Y), Ie.removeAttribute("id"), Ie.draggable = !1, Ie.style["will-change"] = "", this._hideClone(), We(Ie, this.options.chosenClass, !1), ve.clone = Ie), l.cloneId = ha(function() {
      je("clone", l), !ve.eventCanceled && (l.options.removeCloneOnHide || De.insertBefore(Ie, Y), l._hideClone(), ze({
        sortable: l,
        name: "clone"
      }));
    }), !t && We(Y, u.dragClass, !0), t ? (Va = !0, l._loopId = setInterval(l._emulateDragOver, 50)) : (ye(document, "mouseup", l._onDrop), ye(document, "touchend", l._onDrop), ye(document, "touchcancel", l._onDrop), i && (i.effectAllowed = "move", u.setData && u.setData.call(l, i, Y)), ke(document, "drop", l), ce(Y, "transform", "translateZ(0)")), Lt = !0, l._dragStartId = ha(l._dragStarted.bind(l, t, a)), ke(document, "selectstart", l), Yt = !0, window.getSelection().removeAllRanges(), _t && ce(document.body, "user-select", "none");
  },
  // Returns true - if no further action is needed (either inserted or another condition)
  _onDragOver: function(a) {
    var t = this.el, l = a.target, i, u, f, v = this.options, p = v.group, o = ve.active, n = ca === p, s = v.sort, h = Ne || o, m, k = this, V = !1;
    if (Qa) return;
    function P(Ce, Q) {
      je(Ce, k, ot({
        evt: a,
        isOwner: n,
        axis: m ? "vertical" : "horizontal",
        revert: f,
        dragRect: i,
        targetRect: u,
        canSort: s,
        fromSortable: h,
        target: l,
        completed: T,
        onMove: function(B, g) {
          return fa(De, t, Y, i, B, Re(B), a, g);
        },
        changed: $
      }, Q));
    }
    function x() {
      P("dragOverAnimationCapture"), k.captureAnimationState(), k !== h && h.captureAnimationState();
    }
    function T(Ce) {
      return P("dragOverCompleted", {
        insertion: Ce
      }), Ce && (n ? o._hideClone() : o._showClone(k), k !== h && (We(Y, Ne ? Ne.options.ghostClass : o.options.ghostClass, !1), We(Y, v.ghostClass, !0)), Ne !== k && k !== ve.active ? Ne = k : k === ve.active && Ne && (Ne = null), h === k && (k._ignoreWhileAnimating = l), k.animateAll(function() {
        P("dragOverAnimationComplete"), k._ignoreWhileAnimating = null;
      }), k !== h && (h.animateAll(), h._ignoreWhileAnimating = null)), (l === Y && !Y.animated || l === t && !l.animated) && (Ft = null), !v.dragoverBubble && !a.rootEl && l !== document && (Y.parentNode[qe]._isOutsideThisEl(a.target), !Ce && wt(a)), !v.dragoverBubble && a.stopPropagation && a.stopPropagation(), V = !0;
    }
    function $() {
      Ke = He(Y), vt = He(Y, v.draggable), ze({
        sortable: k,
        name: "change",
        toEl: t,
        newIndex: Ke,
        newDraggableIndex: vt,
        originalEvent: a
      });
    }
    if (a.preventDefault !== void 0 && a.cancelable && a.preventDefault(), l = Qe(l, v.draggable, t, !0), P("dragOver"), ve.eventCanceled) return V;
    if (Y.contains(a.target) || l.animated && l.animatingX && l.animatingY || k._ignoreWhileAnimating === l)
      return T(!1);
    if (Va = !1, o && !v.disabled && (n ? s || (f = Ee !== De) : Ne === this || (this.lastPutMode = ca.checkPull(this, o, Y, a)) && p.checkPut(this, o, Y, a))) {
      if (m = this._getDirection(a, l) === "vertical", i = Re(Y), P("dragOverValid"), ve.eventCanceled) return V;
      if (f)
        return Ee = De, x(), this._hideClone(), P("revert"), ve.eventCanceled || (xt ? De.insertBefore(Y, xt) : De.appendChild(Y)), T(!0);
      var C = cl(t, v.draggable);
      if (!C || Rn(a, m, this) && !C.animated) {
        if (C === Y)
          return T(!1);
        if (C && t === a.target && (l = C), l && (u = Re(l)), fa(De, t, Y, i, l, u, a, !!l) !== !1)
          return x(), C && C.nextSibling ? t.insertBefore(Y, C.nextSibling) : t.appendChild(Y), Ee = t, $(), T(!0);
      } else if (C && Pn(a, m, this)) {
        var D = Kt(t, 0, v, !0);
        if (D === Y)
          return T(!1);
        if (l = D, u = Re(l), fa(De, t, Y, i, l, u, a, !1) !== !1)
          return x(), t.insertBefore(Y, D), Ee = t, $(), T(!0);
      } else if (l.parentNode === t) {
        u = Re(l);
        var X = 0, te, me = Y.parentNode !== t, de = !Dn(Y.animated && Y.toRect || i, l.animated && l.toRect || u, m), G = m ? "top" : "left", R = Sl(l, "top", "top") || Sl(Y, "top", "top"), N = R ? R.scrollTop : void 0;
        Ft !== l && (te = u[G], la = !1, va = !de && v.invertSwap || me), X = On(a, l, u, m, de ? 1 : v.swapThreshold, v.invertedSwapThreshold == null ? v.swapThreshold : v.invertedSwapThreshold, va, Ft === l);
        var w;
        if (X !== 0) {
          var O = He(Y);
          do
            O -= X, w = Ee.children[O];
          while (w && (ce(w, "display") === "none" || w === fe));
        }
        if (X === 0 || w === l)
          return T(!1);
        Ft = l, aa = X;
        var se = l.nextElementSibling, q = !1;
        q = X === 1;
        var $e = fa(De, t, Y, i, l, u, a, q);
        if ($e !== !1)
          return ($e === 1 || $e === -1) && (q = $e === 1), Qa = !0, setTimeout(An, 30), x(), q && !se ? t.appendChild(Y) : l.parentNode.insertBefore(Y, q ? se : l), R && ao(R, 0, N - R.scrollTop), Ee = Y.parentNode, te !== void 0 && !va && (ba = Math.abs(te - Re(l)[G])), $(), T(!0);
      }
      if (t.contains(Y))
        return T(!1);
    }
    return !1;
  },
  _ignoreWhileAnimating: null,
  _offMoveEvents: function() {
    ye(document, "mousemove", this._onTouchMove), ye(document, "touchmove", this._onTouchMove), ye(document, "pointermove", this._onTouchMove), ye(document, "dragover", wt), ye(document, "mousemove", wt), ye(document, "touchmove", wt);
  },
  _offUpEvents: function() {
    var a = this.el.ownerDocument;
    ye(a, "mouseup", this._onDrop), ye(a, "touchend", this._onDrop), ye(a, "pointerup", this._onDrop), ye(a, "pointercancel", this._onDrop), ye(a, "touchcancel", this._onDrop), ye(document, "selectstart", this);
  },
  _onDrop: function(a) {
    var t = this.el, l = this.options;
    if (Ke = He(Y), vt = He(Y, l.draggable), je("drop", this, {
      evt: a
    }), Ee = Y && Y.parentNode, Ke = He(Y), vt = He(Y, l.draggable), ve.eventCanceled) {
      this._nulling();
      return;
    }
    Lt = !1, va = !1, la = !1, clearInterval(this._loopId), clearTimeout(this._dragStartTimer), _a(this.cloneId), _a(this._dragStartId), this.nativeDraggable && (ye(document, "drop", this), ye(t, "dragstart", this._onDragStart)), this._offMoveEvents(), this._offUpEvents(), _t && ce(document.body, "user-select", ""), ce(Y, "transform", ""), a && (Yt && (a.cancelable && a.preventDefault(), !l.dropBubble && a.stopPropagation()), fe && fe.parentNode && fe.parentNode.removeChild(fe), (De === Ee || Ne && Ne.lastPutMode !== "clone") && Ie && Ie.parentNode && Ie.parentNode.removeChild(Ie), Y && (this.nativeDraggable && ye(Y, "dragend", this), ja(Y), Y.style["will-change"] = "", Yt && !Lt && We(Y, Ne ? Ne.options.ghostClass : this.options.ghostClass, !1), We(Y, this.options.chosenClass, !1), ze({
      sortable: this,
      name: "unchoose",
      toEl: Ee,
      newIndex: null,
      newDraggableIndex: null,
      originalEvent: a
    }), De !== Ee ? (Ke >= 0 && (ze({
      rootEl: Ee,
      name: "add",
      toEl: Ee,
      fromEl: De,
      originalEvent: a
    }), ze({
      sortable: this,
      name: "remove",
      toEl: Ee,
      originalEvent: a
    }), ze({
      rootEl: Ee,
      name: "sort",
      toEl: Ee,
      fromEl: De,
      originalEvent: a
    }), ze({
      sortable: this,
      name: "sort",
      toEl: Ee,
      originalEvent: a
    })), Ne && Ne.save()) : Ke !== Bt && Ke >= 0 && (ze({
      sortable: this,
      name: "update",
      toEl: Ee,
      originalEvent: a
    }), ze({
      sortable: this,
      name: "sort",
      toEl: Ee,
      originalEvent: a
    })), ve.active && ((Ke == null || Ke === -1) && (Ke = Bt, vt = ta), ze({
      sortable: this,
      name: "end",
      toEl: Ee,
      originalEvent: a
    }), this.save()))), this._nulling();
  },
  _nulling: function() {
    je("nulling", this), De = Y = Ee = fe = xt = Ie = pa = mt = kt = Ze = Yt = Ke = vt = Bt = ta = Ft = aa = Ne = ca = ve.dragged = ve.ghost = ve.clone = ve.active = null;
    var a = this.el;
    xa.forEach(function(t) {
      a.contains(t) && (t.checked = !0);
    }), xa.length = La = za = 0;
  },
  handleEvent: function(a) {
    switch (a.type) {
      case "drop":
      case "dragend":
        this._onDrop(a);
        break;
      case "dragenter":
      case "dragover":
        Y && (this._onDragOver(a), En(a));
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
    for (var a = [], t, l = this.el.children, i = 0, u = l.length, f = this.options; i < u; i++)
      t = l[i], Qe(t, f.draggable, this.el, !1) && a.push(t.getAttribute(f.dataIdAttr) || Mn(t));
    return a;
  },
  /**
   * Sorts the elements according to the array.
   * @param  {String[]}  order  order of the items
   */
  sort: function(a, t) {
    var l = {}, i = this.el;
    this.toArray().forEach(function(u, f) {
      var v = i.children[f];
      Qe(v, this.options.draggable, i, !1) && (l[u] = v);
    }, this), t && this.captureAnimationState(), a.forEach(function(u) {
      l[u] && (i.removeChild(l[u]), i.appendChild(l[u]));
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
    return Qe(a, t || this.options.draggable, this.el, !1);
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
    var i = na.modifyOption(this, a, t);
    typeof i < "u" ? l[a] = i : l[a] = t, a === "group" && so(l);
  },
  /**
   * Destroy
   */
  destroy: function() {
    je("destroy", this);
    var a = this.el;
    a[qe] = null, ye(a, "mousedown", this._onTapStart), ye(a, "touchstart", this._onTapStart), ye(a, "pointerdown", this._onTapStart), this.nativeDraggable && (ye(a, "dragover", this), ye(a, "dragenter", this)), Array.prototype.forEach.call(a.querySelectorAll("[draggable]"), function(t) {
      t.removeAttribute("draggable");
    }), this._onDrop(), this._disableDelayedDragEvents(), $a.splice($a.indexOf(this.el), 1), this.el = a = null;
  },
  _hideClone: function() {
    if (!mt) {
      if (je("hideClone", this), ve.eventCanceled) return;
      ce(Ie, "display", "none"), this.options.removeCloneOnHide && Ie.parentNode && Ie.parentNode.removeChild(Ie), mt = !0;
    }
  },
  _showClone: function(a) {
    if (a.lastPutMode !== "clone") {
      this._hideClone();
      return;
    }
    if (mt) {
      if (je("showClone", this), ve.eventCanceled) return;
      Y.parentNode == De && !this.options.group.revertClone ? De.insertBefore(Ie, Y) : xt ? De.insertBefore(Ie, xt) : De.appendChild(Ie), this.options.group.revertClone && this.animate(Y, Ie), ce(Ie, "display", ""), mt = !1;
    }
  }
};
function En(e) {
  e.dataTransfer && (e.dataTransfer.dropEffect = "move"), e.cancelable && e.preventDefault();
}
function fa(e, a, t, l, i, u, f, v) {
  var p, o = e[qe], n = o.options.onMove, s;
  return window.CustomEvent && !st && !ia ? p = new CustomEvent("move", {
    bubbles: !0,
    cancelable: !0
  }) : (p = document.createEvent("Event"), p.initEvent("move", !0, !0)), p.to = a, p.from = e, p.dragged = t, p.draggedRect = l, p.related = i || a, p.relatedRect = u || Re(a), p.willInsertAfter = v, p.originalEvent = f, e.dispatchEvent(p), n && (s = n.call(o, p, f)), s;
}
function ja(e) {
  e.draggable = !1;
}
function An() {
  Qa = !1;
}
function Pn(e, a, t) {
  var l = Re(Kt(t.el, 0, t.options, !0)), i = oo(t.el, t.options, fe), u = 10;
  return a ? e.clientX < i.left - u || e.clientY < l.top && e.clientX < l.right : e.clientY < i.top - u || e.clientY < l.bottom && e.clientX < l.left;
}
function Rn(e, a, t) {
  var l = Re(cl(t.el, t.options.draggable)), i = oo(t.el, t.options, fe), u = 10;
  return a ? e.clientX > i.right + u || e.clientY > l.bottom && e.clientX > l.left : e.clientY > i.bottom + u || e.clientX > l.right && e.clientY > l.top;
}
function On(e, a, t, l, i, u, f, v) {
  var p = l ? e.clientY : e.clientX, o = l ? t.height : t.width, n = l ? t.top : t.left, s = l ? t.bottom : t.right, h = !1;
  if (!f) {
    if (v && ba < o * i) {
      if (!la && (aa === 1 ? p > n + o * u / 2 : p < s - o * u / 2) && (la = !0), la)
        h = !0;
      else if (aa === 1 ? p < n + ba : p > s - ba)
        return -aa;
    } else if (p > n + o * (1 - i) / 2 && p < s - o * (1 - i) / 2)
      return Nn(a);
  }
  return h = h || f, h && (p < n + o * u / 2 || p > s - o * u / 2) ? p > n + o / 2 ? 1 : -1 : 0;
}
function Nn(e) {
  return He(Y) < He(e) ? 1 : -1;
}
function Mn(e) {
  for (var a = e.tagName + e.className + e.src + e.href + e.textContent, t = a.length, l = 0; t--; )
    l += a.charCodeAt(t);
  return l.toString(36);
}
function Fn(e) {
  xa.length = 0;
  for (var a = e.getElementsByTagName("input"), t = a.length; t--; ) {
    var l = a[t];
    l.checked && xa.push(l);
  }
}
function ha(e) {
  return setTimeout(e, 0);
}
function _a(e) {
  return clearTimeout(e);
}
Ea && ke(document, "touchmove", function(e) {
  (ve.active || Lt) && e.cancelable && e.preventDefault();
});
ve.utils = {
  on: ke,
  off: ye,
  css: ce,
  find: eo,
  is: function(a, t) {
    return !!Qe(a, t, a, !1);
  },
  extend: kn,
  throttle: to,
  closest: Qe,
  toggleClass: We,
  clone: lo,
  index: He,
  nextTick: ha,
  cancelNextTick: _a,
  detectDirection: no,
  getChild: Kt,
  expando: qe
};
ve.get = function(e) {
  return e[qe];
};
ve.mount = function() {
  for (var e = arguments.length, a = new Array(e), t = 0; t < e; t++)
    a[t] = arguments[t];
  a[0].constructor === Array && (a = a[0]), a.forEach(function(l) {
    if (!l.prototype || !l.prototype.constructor)
      throw "Sortable: Mounted plugin must be a constructor function, not ".concat({}.toString.call(l));
    l.utils && (ve.utils = ot(ot({}, ve.utils), l.utils)), na.mount(l);
  });
};
ve.create = function(e, a) {
  return new ve(e, a);
};
ve.version = yn;
var Pe = [], Xt, el, tl = !1, qa, Wa, Ca, Jt;
function Ln() {
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
      this.sortable.nativeDraggable ? ke(document, "dragover", this._handleAutoScroll) : this.options.supportPointer ? ke(document, "pointermove", this._handleFallbackAutoScroll) : l.touches ? ke(document, "touchmove", this._handleFallbackAutoScroll) : ke(document, "mousemove", this._handleFallbackAutoScroll);
    },
    dragOverCompleted: function(t) {
      var l = t.originalEvent;
      !this.options.dragOverBubble && !l.rootEl && this._handleAutoScroll(l);
    },
    drop: function() {
      this.sortable.nativeDraggable ? ye(document, "dragover", this._handleAutoScroll) : (ye(document, "pointermove", this._handleFallbackAutoScroll), ye(document, "touchmove", this._handleFallbackAutoScroll), ye(document, "mousemove", this._handleFallbackAutoScroll)), El(), ya(), wn();
    },
    nulling: function() {
      Ca = el = Xt = tl = Jt = qa = Wa = null, Pe.length = 0;
    },
    _handleFallbackAutoScroll: function(t) {
      this._handleAutoScroll(t, !0);
    },
    _handleAutoScroll: function(t, l) {
      var i = this, u = (t.touches ? t.touches[0] : t).clientX, f = (t.touches ? t.touches[0] : t).clientY, v = document.elementFromPoint(u, f);
      if (Ca = t, l || this.options.forceAutoScrollFallback || ia || st || _t) {
        Ka(t, this.options, v, l);
        var p = ft(v, !0);
        tl && (!Jt || u !== qa || f !== Wa) && (Jt && El(), Jt = setInterval(function() {
          var o = ft(document.elementFromPoint(u, f), !0);
          o !== p && (p = o, ya()), Ka(t, i.options, o, l);
        }, 10), qa = u, Wa = f);
      } else {
        if (!this.options.bubbleScroll || ft(v, !0) === lt()) {
          ya();
          return;
        }
        Ka(t, this.options, ft(v, !1), !1);
      }
    }
  }, nt(e, {
    pluginName: "scroll",
    initializeByDefault: !0
  });
}
function ya() {
  Pe.forEach(function(e) {
    clearInterval(e.pid);
  }), Pe = [];
}
function El() {
  clearInterval(Jt);
}
var Ka = to(function(e, a, t, l) {
  if (a.scroll) {
    var i = (e.touches ? e.touches[0] : e).clientX, u = (e.touches ? e.touches[0] : e).clientY, f = a.scrollSensitivity, v = a.scrollSpeed, p = lt(), o = !1, n;
    el !== t && (el = t, ya(), Xt = a.scroll, n = a.scrollFn, Xt === !0 && (Xt = ft(t, !0)));
    var s = 0, h = Xt;
    do {
      var m = h, k = Re(m), V = k.top, P = k.bottom, x = k.left, T = k.right, $ = k.width, C = k.height, D = void 0, X = void 0, te = m.scrollWidth, me = m.scrollHeight, de = ce(m), G = m.scrollLeft, R = m.scrollTop;
      m === p ? (D = $ < te && (de.overflowX === "auto" || de.overflowX === "scroll" || de.overflowX === "visible"), X = C < me && (de.overflowY === "auto" || de.overflowY === "scroll" || de.overflowY === "visible")) : (D = $ < te && (de.overflowX === "auto" || de.overflowX === "scroll"), X = C < me && (de.overflowY === "auto" || de.overflowY === "scroll"));
      var N = D && (Math.abs(T - i) <= f && G + $ < te) - (Math.abs(x - i) <= f && !!G), w = X && (Math.abs(P - u) <= f && R + C < me) - (Math.abs(V - u) <= f && !!R);
      if (!Pe[s])
        for (var O = 0; O <= s; O++)
          Pe[O] || (Pe[O] = {});
      (Pe[s].vx != N || Pe[s].vy != w || Pe[s].el !== m) && (Pe[s].el = m, Pe[s].vx = N, Pe[s].vy = w, clearInterval(Pe[s].pid), (N != 0 || w != 0) && (o = !0, Pe[s].pid = setInterval(function() {
        l && this.layer === 0 && ve.active._onTouchMove(Ca);
        var se = Pe[this.layer].vy ? Pe[this.layer].vy * v : 0, q = Pe[this.layer].vx ? Pe[this.layer].vx * v : 0;
        typeof n == "function" && n.call(ve.dragged.parentNode[qe], q, se, e, Ca, Pe[this.layer].el) !== "continue" || ao(Pe[this.layer].el, q, se);
      }.bind({
        layer: s
      }), 24))), s++;
    } while (a.bubbleScroll && h !== p && (h = ft(h, !1)));
    tl = o;
  }
}, 30), co = function(a) {
  var t = a.originalEvent, l = a.putSortable, i = a.dragEl, u = a.activeSortable, f = a.dispatchSortableEvent, v = a.hideGhostForTarget, p = a.unhideGhostForTarget;
  if (t) {
    var o = l || u;
    v();
    var n = t.changedTouches && t.changedTouches.length ? t.changedTouches[0] : t, s = document.elementFromPoint(n.clientX, n.clientY);
    p(), o && !o.el.contains(s) && (f("spill"), this.onSpill({
      dragEl: i,
      putSortable: l
    }));
  }
};
function vl() {
}
vl.prototype = {
  startIndex: null,
  dragStart: function(a) {
    var t = a.oldDraggableIndex;
    this.startIndex = t;
  },
  onSpill: function(a) {
    var t = a.dragEl, l = a.putSortable;
    this.sortable.captureAnimationState(), l && l.captureAnimationState();
    var i = Kt(this.sortable.el, this.startIndex, this.options);
    i ? this.sortable.el.insertBefore(t, i) : this.sortable.el.appendChild(t), this.sortable.animateAll(), l && l.animateAll();
  },
  drop: co
};
nt(vl, {
  pluginName: "revertOnSpill"
});
function ml() {
}
ml.prototype = {
  onSpill: function(a) {
    var t = a.dragEl, l = a.putSortable, i = l || this.sortable;
    i.captureAnimationState(), t.parentNode && t.parentNode.removeChild(t), i.animateAll();
  },
  drop: co
};
nt(ml, {
  pluginName: "removeOnSpill"
});
ve.mount(new Ln());
ve.mount(ml, vl);
function zn(e, a) {
  const t = e.oldDraggableIndex ?? e.oldIndex;
  e.item.remove();
  const l = [...e.from.children].filter((i) => i.matches(a));
  e.from.insertBefore(e.item, l[t ?? l.length] ?? null);
}
function vo(e) {
  const a = /* @__PURE__ */ new Map();
  function t(l) {
    a.get(l)?.destroy(), a.delete(l);
  }
  return yt(() => {
    for (const l of a.keys()) t(l);
  }), {
    mounted(l) {
      const i = l.querySelector(".work-field-builder") ?? l;
      a.set(l, new ve(i, {
        draggable: ".work-reorder-entry",
        handle: ".work-reorder-handle",
        forceFallback: !0,
        fallbackOnBody: !1,
        ghostClass: "work-drag-ghost",
        onEnd(u) {
          const f = u.oldDraggableIndex, v = u.newDraggableIndex;
          zn(u, ".work-reorder-entry"), f !== void 0 && v !== void 0 && f !== v && e(f, v);
        }
      }));
    },
    unmounted: t
  };
}
const Bn = { class: "work-stack work-tight work-option-builder" }, jn = { class: "work-stack work-tight" }, qn = { class: "work-stack work-tight work-small" }, Wn = { class: "work-stack work-tight work-small" }, Kn = { class: "work-stack work-tight" }, Gn = { class: "work-stack work-tight work-small" }, Hn = { class: "work-row" }, Yn = { class: "work-stack work-tight work-small" }, Xn = { class: "work-row" }, Jn = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, Zn = { class: "work-add-option" }, Qn = {
  key: 0,
  class: "work-muted work-small"
}, _n = /* @__PURE__ */ ge({
  __name: "OptionsEditor",
  props: {
    field: {}
  },
  emits: ["validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, i = "options:" + ol(), u = H(() => t.field.options ?? []), f = H(() => u.value.every((s, h) => !!s.id && u.value.findIndex((m) => m.id === s.id) === h));
    Ue(f, (s) => l("validity", s, i), { immediate: !0 }), yt(() => l("validity", !0, i));
    function v(s, h) {
      Kl(u.value, s, h - s), u.value.forEach((m, k) => m.order = k);
    }
    const p = vo(v), o = ["primary", "success", "info", "warn", "danger", "secondary"];
    function n() {
      let s = u.value.length + 1;
      for (; u.value.some((h) => h.id === `option_${s}`); ) s++;
      (t.field.options ??= []).push({ id: `option_${s}`, label: "New option", order: u.value.length });
    }
    return (s, h) => (c(), y("section", Bn, [
      h[4] || (h[4] = d("header", { class: "work-row" }, [
        d("h4", null, "Options"),
        d("span", { class: "work-muted work-small" }, "Stable IDs keep existing values when labels change."),
        d("span", { class: "work-spacer" })
      ], -1)),
      at((c(), y("div", jn, [
        (c(!0), y(Z, null, re(u.value, (m, k) => (c(), y("div", {
          key: k,
          class: "work-option-row work-reorder-entry"
        }, [
          b(r(J), {
            type: "button",
            class: "work-icon-button work-reorder-handle",
            "aria-label": "Drag option; arrow keys reorder",
            onKeydown: [
              Ae(Ve((V) => v(k, k - 1), ["prevent"]), ["up"]),
              Ae(Ve((V) => v(k, k + 1), ["prevent"]), ["down"])
            ],
            severity: "secondary",
            text: "",
            size: "small"
          }, {
            default: L(() => [
              b(r(le), {
                icon: "tabler:grip-vertical",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["onKeydown"]),
          d("label", qn, [
            h[0] || (h[0] = F("Label", -1)),
            b(r(be), {
              modelValue: m.label,
              "onUpdate:modelValue": (V) => m.label = V,
              "aria-label": "Option label"
            }, null, 8, ["modelValue", "onUpdate:modelValue"])
          ]),
          d("label", Wn, [
            h[1] || (h[1] = F("ID", -1)),
            b(r(be), {
              modelValue: m.id,
              "onUpdate:modelValue": (V) => m.id = V,
              class: "work-option-code",
              required: "",
              "aria-label": "Option ID"
            }, null, 8, ["modelValue", "onUpdate:modelValue"])
          ]),
          d("div", Kn, [
            d("label", Gn, [
              h[2] || (h[2] = F("Color", -1)),
              d("span", Hn, [
                d("span", {
                  class: bt(["work-color-swatch", "work-swatch-" + (m.color || "secondary")]),
                  "aria-hidden": "true"
                }, null, 2),
                b(r(ue), {
                  modelValue: m.color,
                  "onUpdate:modelValue": (V) => m.color = V,
                  "aria-label": "Option color",
                  appendTo: "self",
                  optionLabel: "label",
                  optionValue: "value",
                  optionDisabled: "disabled",
                  options: [{ label: "Default", value: void 0, disabled: !1 }, ...(o ?? []).map((V) => ({ label: V, value: V, disabled: !1 }))]
                }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
              ])
            ]),
            d("label", Yn, [
              h[3] || (h[3] = F("Category", -1)),
              b(r(ue), {
                "model-value": m.category,
                "aria-label": "Option category",
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                showClear: "",
                options: ["triage", "backlog", ...r(Wl)].map((V) => ({ label: r(It)(V), value: V })),
                "onUpdate:modelValue": (V) => m.category = V || void 0
              }, null, 8, ["model-value", "options", "onUpdate:modelValue"])
            ])
          ]),
          d("div", Xn, [
            b(r(J), {
              "aria-label": "Option earlier",
              severity: "secondary",
              size: "small",
              disabled: k === 0,
              onClick: (V) => v(k, k - 1),
              text: ""
            }, {
              default: L(() => [
                b(r(le), {
                  icon: "tabler:arrow-up",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["disabled", "onClick"]),
            b(r(J), {
              "aria-label": "Option later",
              severity: "secondary",
              size: "small",
              disabled: k === u.value.length - 1,
              onClick: (V) => v(k, k + 1),
              text: ""
            }, {
              default: L(() => [
                b(r(le), {
                  icon: "tabler:arrow-down",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["disabled", "onClick"]),
            b(r(J), {
              label: "Remove",
              "aria-label": "Remove option",
              severity: "secondary",
              text: "",
              size: "small",
              onClick: (V) => u.value.splice(k, 1)
            }, {
              icon: L(() => [
                b(r(le), {
                  icon: "tabler:trash",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["onClick"])
          ])
        ]))), 128)),
        f.value ? I("", !0) : (c(), y("p", Jn, "Option IDs must be nonempty and unique.")),
        d("div", Zn, [
          b(r(J), {
            label: "Add option",
            severity: "secondary",
            size: "small",
            onClick: n,
            outlined: ""
          }, {
            icon: L(() => [
              b(r(le), {
                icon: "tabler:plus",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          })
        ])
      ])), [
        [r(p)]
      ]),
      u.value.length ? I("", !0) : (c(), y("p", Qn, "Add the choices people can select for this field."))
    ]));
  }
}), es = {
  class: "work-stack",
  "aria-label": "Fields editor"
}, ts = { class: "work-section-heading" }, as = {
  key: 0,
  class: "work-used-by"
}, ls = { class: "kx-tag-sm" }, os = { class: "work-small work-muted" }, is = {
  key: 0,
  class: "work-error work-small",
  role: "alert"
}, ns = { class: "work-settings-grid work-field-properties" }, ss = { class: "work-stack work-tight" }, rs = { class: "work-stack work-tight" }, ds = { class: "work-stack work-tight" }, us = { class: "work-stack work-tight" }, cs = { class: "work-stack work-tight" }, vs = { class: "work-stack work-tight work-field-history" }, ms = { class: "work-settings-list" }, fs = { class: "work-settings-row" }, ps = { class: "work-settings-row" }, bs = {
  key: 3,
  class: "work-stack work-tight"
}, hs = {
  key: 4,
  class: "work-stack work-tight"
}, ys = { class: "work-stack work-tight" }, gs = { class: "work-stack work-tight" }, ks = { class: "work-stack work-tight" }, ws = { class: "work-stack work-tight" }, Vs = { class: "work-stack" }, $s = { class: "work-row work-add-definition" }, xs = { class: "work-stack work-tight" }, Cs = /* @__PURE__ */ ge({
  __name: "FieldsEditor",
  props: {
    draft: {},
    guardRemoval: { type: Function },
    issues: {},
    boardId: {},
    installedTypes: {}
  },
  emits: ["validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, i = H(() => t.draft.fields ?? []), u = j(""), f = j(""), v = j({}), p = vo((N, w) => de(N, w - N));
    function o(N) {
      return (t.draft.item_types ?? []).filter((w) => w.fields.includes(N)).map((w) => w.title || xe(w.id));
    }
    async function n(N) {
      if (!f.value) {
        f.value = N.code;
        try {
          const w = await t.guardRemoval?.("fields", N.code);
          v.value[N.code] = w ?? "", w || oa(t.draft, "fields", N.code);
        } finally {
          f.value = "";
        }
      }
    }
    const s = Object.entries({ text: "Text", int: "Whole number", dec: "Decimal number", quantity: "Measurement", bool: "Yes or no", time: "Date or time", ref: "Reference", record: "Structured data", option: "Choice", principal: "Person or group", item: "Work item", rank: "Order", rich_text: "Formatted text", formula: "Formula", rollup: "Related item calculation", counter: "Counter" }).map(([N, w]) => ({ value: N, label: w })), h = [{ label: "None", value: "none" }, { label: "Exact matches", value: "key" }, { label: "Numeric ranges", value: "number" }], m = ["int", "dec", "quantity"], k = H(() => new Map(t.installedTypes?.map((N) => [N.id, N]))), V = H(() => [...s, ...(t.installedTypes ?? []).map((N) => ({ value: N.id, label: N.title }))]), P = {};
    function x(N) {
      return N.type && N.type !== "value" ? N.type : N.form ?? "text";
    }
    function T(N) {
      return N.type ? k.value.get(N.type) : void 0;
    }
    function $(N) {
      const w = T(N)?.config_schema;
      return w && Eo(w).length ? w : void 0;
    }
    function C(N) {
      const w = T(N);
      return !!w?.config_schema || ["dec", "quantity", "ref", "time", "record"].includes(w?.form ?? N.form ?? "") || !!N.config;
    }
    function D(N) {
      const w = T(N), O = w?.form ?? N.form ?? "text";
      return h.filter(({ value: se }) => se === "none" || (!w?.indexes || w.indexes.includes(se)) && O !== "record" && (se !== "number" || m.includes(O) || N.type === "option"));
    }
    function X(N) {
      N.index && !D(N).some((w) => w.value === N.index) && delete N.index;
    }
    function te(N, w) {
      const O = k.value.get(w);
      if (O) {
        if (O.id === N.type) return;
        N.type = O.id, N.form = O.form, delete N.options, delete N.config, X(N);
        return;
      }
      T(N) && delete N.config;
      const se = { option: "text", principal: "ref", item: "ref", rank: "text", rich_text: "text", formula: "int", rollup: "int", counter: "int" };
      se[w] ? (N.type = w, N.form = se[w]) : (delete N.type, N.form = w), w !== "option" ? delete N.options : N.options ??= [], w === "rich_text" && (N.config = { format: "json" }), X(N);
    }
    function me(N, w) {
      N.form = w, X(N);
    }
    function de(N, w) {
      Kl(i.value, N, w);
      for (const O of t.draft.item_types ?? []) {
        const se = new Set(O.fields);
        O.fields = i.value.filter((q) => se.has(q.code)).map((q) => q.code);
      }
    }
    function G(N, w) {
      try {
        Ao(t.draft, N, w.value), delete v.value[N.code];
      } catch (O) {
        v.value[N.code] = O.message, w.value = N.code;
      }
    }
    function R() {
      !/^[a-z][a-z0-9_]*$/.test(u.value) || i.value.some((N) => N.code === u.value) || ((t.draft.fields ??= []).push({ code: u.value, form: "text", cardinality: "one" }), u.value = "");
    }
    return (N, w) => (c(), y("section", es, [
      d("header", ts, [
        w[2] || (w[2] = d("div", null, [
          d("h2", null, "Fields"),
          d("p", { class: "work-muted work-small" }, "Shape the information each item carries. Drag the handle or use the arrows to arrange fields.")
        ], -1)),
        b(r(Le), {
          class: "kx-tag-sm",
          severity: "secondary"
        }, {
          default: L(() => [
            F(U(i.value.length) + " " + U(i.value.length === 1 ? "field" : "fields"), 1)
          ]),
          _: 1
        })
      ]),
      at((c(), W(Ua, {
        columns: "fields",
        count: i.value.length
      }, {
        default: L(() => [
          (c(!0), y(Z, null, re(i.value, (O, se) => (c(), W(Ia, {
            title: r(Be)(O),
            code: O.code,
            kind: T(O)?.title || r(s).find((q) => q.value === x(O))?.label || r(xe)(x(O)),
            key: O.id ?? se,
            class: "work-field-row work-reorder-entry work-stack"
          }, {
            handle: L(() => [
              b(r(J), {
                type: "button",
                class: "work-reorder-handle work-icon-button",
                "aria-label": "Drag " + r(Be)(O) + " or use the arrow keys to reorder",
                onKeydown: [
                  Ae(Ve((q) => de(se, -1), ["prevent"]), ["up"]),
                  Ae(Ve((q) => de(se, 1), ["prevent"]), ["down"])
                ],
                severity: "secondary",
                text: "",
                size: "small"
              }, {
                default: L(() => [
                  b(r(le), {
                    icon: "tabler:grip-vertical",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["aria-label", "onKeydown"])
            ]),
            flags: L(() => [
              O.track ? (c(), W(r(Le), {
                key: 0,
                class: "kx-tag-sm",
                severity: "secondary",
                value: "Tracked"
              })) : I("", !0),
              O.intervals ? (c(), W(r(Le), {
                key: 1,
                class: "kx-tag-sm",
                severity: "secondary",
                value: "Intervals"
              })) : I("", !0)
            ]),
            usage: L(() => [
              o(O.code).length ? (c(), y("details", as, [
                d("summary", ls, "Used by " + U(o(O.code).length) + " " + U(o(O.code).length === 1 ? "type" : "types"), 1),
                d("span", os, U(o(O.code).join(", ")), 1)
              ])) : I("", !0)
            ]),
            actions: L(() => [
              b(r(J), {
                "aria-label": "Move " + r(Be)(O) + " earlier",
                severity: "secondary",
                disabled: se === 0,
                onClick: (q) => de(se, -1),
                text: "",
                size: "small"
              }, {
                default: L(() => [
                  b(r(le), {
                    icon: "tabler:arrow-up",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["aria-label", "disabled", "onClick"]),
              b(r(J), {
                "aria-label": "Move " + r(Be)(O) + " later",
                severity: "secondary",
                disabled: se === i.value.length - 1,
                onClick: (q) => de(se, 1),
                text: "",
                size: "small"
              }, {
                default: L(() => [
                  b(r(le), {
                    icon: "tabler:arrow-down",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["aria-label", "disabled", "onClick"]),
              b(r(J), {
                severity: "secondary",
                text: "",
                size: "small",
                disabled: !!f.value,
                onClick: (q) => n(O),
                "aria-label": "Remove field"
              }, {
                default: L(() => [
                  b(r(le), {
                    icon: "tabler:trash",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["disabled", "onClick"])
            ]),
            default: L(() => [
              v.value[O.code] ? (c(), y("p", is, U(v.value[O.code]), 1)) : I("", !0),
              (c(!0), y(Z, null, re(e.issues?.filter((q) => q.code === O.code) ?? [], (q) => (c(), y("p", {
                key: q.what,
                class: "work-error work-small",
                role: "alert"
              }, U(r(Da)(q)), 1))), 128)),
              d("div", ns, [
                d("label", ss, [
                  w[3] || (w[3] = F("Title", -1)),
                  b(r(be), {
                    modelValue: O.title,
                    "onUpdate:modelValue": (q) => O.title = q,
                    "aria-label": "Field title",
                    maxlength: "255",
                    placeholder: r(Be)(O)
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder"])
                ]),
                d("label", rs, [
                  w[4] || (w[4] = F("Field identifier", -1)),
                  b(r(be), {
                    value: O.code,
                    "aria-label": "Field code",
                    required: "",
                    pattern: "[a-z][a-z0-9_]*",
                    onInput: (q) => G(O, q.target)
                  }, null, 8, ["value", "onInput"])
                ]),
                d("label", ds, [
                  w[5] || (w[5] = F("Kind", -1)),
                  b(r(ue), {
                    "aria-label": "Kind",
                    "model-value": x(O),
                    "onUpdate:modelValue": (q) => te(O, q),
                    appendTo: "self",
                    options: V.value,
                    optionLabel: "label",
                    optionValue: "value"
                  }, null, 8, ["model-value", "onUpdate:modelValue", "options"])
                ]),
                d("label", us, [
                  w[6] || (w[6] = F("Values allowed", -1)),
                  b(r(ue), {
                    "aria-label": "Values allowed",
                    "model-value": O.cardinality ?? "one",
                    "onUpdate:modelValue": (q) => O.cardinality = q,
                    appendTo: "self",
                    options: [{ label: "One value", value: "one" }, { label: "Multiple unique values", value: "set" }, { label: "Ordered values", value: "list" }],
                    optionLabel: "label",
                    optionValue: "value"
                  }, null, 8, ["model-value", "onUpdate:modelValue"])
                ]),
                d("label", cs, [
                  w[7] || (w[7] = F("Search support", -1)),
                  b(r(ue), {
                    "aria-label": "Search support",
                    "model-value": O.index ?? "none",
                    "onUpdate:modelValue": (q) => O.index = q,
                    appendTo: "self",
                    options: D(O),
                    optionLabel: "label",
                    optionValue: "value"
                  }, null, 8, ["model-value", "onUpdate:modelValue", "options"])
                ])
              ]),
              $(O) ? (c(), W(nl, {
                key: O.type,
                schema: $(O),
                "model-value": O.config ?? P,
                "onUpdate:modelValue": (q) => O.config = q,
                onValidity: (q) => l("validity", "config-" + se, q)
              }, null, 8, ["schema", "model-value", "onUpdate:modelValue", "onValidity"])) : I("", !0),
              d("section", vs, [
                w[10] || (w[10] = d("h4", { class: "work-group-title" }, "History", -1)),
                d("div", ms, [
                  d("div", fs, [
                    w[8] || (w[8] = d("div", { class: "work-row-main" }, [
                      d("strong", null, "Track changes"),
                      d("p", { class: "work-muted work-small" }, "Record each value change in the item history.")
                    ], -1)),
                    b(r(Ge), {
                      modelValue: O.track,
                      "onUpdate:modelValue": (q) => O.track = q,
                      "aria-label": "Track changes"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ]),
                  d("div", ps, [
                    w[9] || (w[9] = d("div", { class: "work-row-main" }, [
                      d("strong", null, "Track intervals"),
                      d("p", { class: "work-muted work-small" }, "Measure how long each value stays in effect.")
                    ], -1)),
                    b(r(Ge), {
                      modelValue: O.intervals,
                      "onUpdate:modelValue": (q) => O.intervals = q,
                      "aria-label": "Track intervals"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ])
                ])
              ]),
              O.type === "option" ? (c(), W(_n, {
                key: 2,
                field: O,
                onValidity: w[0] || (w[0] = (q, $e) => l("validity", $e, q))
              }, null, 8, ["field"])) : I("", !0),
              O.type === "formula" || O.type === "rollup" ? (c(), y("label", bs, [
                w[11] || (w[11] = F("Result type", -1)),
                b(r(ue), {
                  "model-value": O.form,
                  "onUpdate:modelValue": (q) => me(O, q),
                  "aria-label": "Result type",
                  options: r(s).slice(0, 8),
                  optionLabel: "label",
                  optionValue: "value",
                  appendTo: "self"
                }, null, 8, ["model-value", "onUpdate:modelValue", "options"])
              ])) : I("", !0),
              O.type === "formula" ? (c(), y("label", hs, [
                w[12] || (w[12] = F("Expression", -1)),
                b(r(be), {
                  modelValue: O.expression,
                  "onUpdate:modelValue": (q) => O.expression = q
                }, null, 8, ["modelValue", "onUpdate:modelValue"])
              ])) : I("", !0),
              O.type === "rollup" ? (c(), y(Z, { key: 5 }, [
                d("label", ys, [
                  w[13] || (w[13] = F("Of", -1)),
                  b(r(be), {
                    modelValue: O.of,
                    "onUpdate:modelValue": (q) => O.of = q
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                d("label", gs, [
                  w[14] || (w[14] = F("Function", -1)),
                  b(r(be), {
                    modelValue: O.fn,
                    "onUpdate:modelValue": (q) => O.fn = q
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                d("label", ks, [
                  w[15] || (w[15] = F("Field", -1)),
                  b(r(be), {
                    modelValue: O.field,
                    "onUpdate:modelValue": (q) => O.field = q
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                d("label", ws, [
                  w[16] || (w[16] = F("Order by", -1)),
                  b(r(ue), {
                    "model-value": O.by,
                    "aria-label": "Rollup order",
                    options: ["rank", "time"],
                    showClear: "",
                    appendTo: "self",
                    "onUpdate:modelValue": (q) => O.by = q || void 0
                  }, null, 8, ["model-value", "onUpdate:modelValue"])
                ]),
                b(rl, {
                  modelValue: O.where,
                  "onUpdate:modelValue": (q) => O.where = q,
                  draft: e.draft,
                  "board-id": e.boardId,
                  label: "Include related items when",
                  onValidity: (q) => l("validity", "rollup-" + se, q)
                }, null, 8, ["modelValue", "onUpdate:modelValue", "draft", "board-id", "onValidity"])
              ], 64)) : I("", !0),
              !$(O) && C(O) ? (c(), W(ht, {
                key: 6,
                label: "Field configuration",
                "model-value": O.config,
                shape: "object",
                "onUpdate:modelValue": (q) => O.config = q,
                onValidity: (q) => l("validity", "config-" + se, q)
              }, null, 8, ["model-value", "onUpdate:modelValue", "onValidity"])) : I("", !0),
              d("section", Vs, [
                w[17] || (w[17] = d("h4", { class: "work-group-title" }, "Access", -1)),
                (c(), y(Z, null, re(["read", "write"], (q) => b(Jl, {
                  "board-id": e.boardId,
                  key: q,
                  label: q === "read" ? "Who can read" : "Who can edit",
                  "model-value": O.access?.[q],
                  "onUpdate:modelValue": ($e) => O.access = { ...O.access, [q]: $e },
                  onValidity: ($e) => l("validity", "access-" + se + q, $e)
                }, null, 8, ["board-id", "label", "model-value", "onUpdate:modelValue", "onValidity"])), 64))
              ])
            ]),
            _: 2
          }, 1032, ["title", "code", "kind"]))), 128)),
          d("div", $s, [
            d("label", xs, [
              w[18] || (w[18] = F("New field identifier", -1)),
              b(r(be), {
                modelValue: u.value,
                "onUpdate:modelValue": w[1] || (w[1] = (O) => u.value = O),
                onKeydown: Ae(Ve(R, ["prevent"]), ["enter"])
              }, null, 8, ["modelValue", "onKeydown"])
            ]),
            b(r(J), {
              label: "Add field",
              severity: "secondary",
              disabled: !u.value.trim(),
              onClick: R,
              outlined: ""
            }, {
              icon: L(() => [
                b(r(le), {
                  icon: "tabler:plus",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["disabled"])
          ])
        ]),
        _: 1
      }, 8, ["count"])), [
        [r(p)]
      ])
    ]));
  }
}), Ss = ["disabled"], Ts = { class: "work-chips" }, Ds = {
  key: 1,
  class: "work-muted work-small"
}, Wt = /* @__PURE__ */ ge({
  __name: "ChipPicker",
  props: {
    label: {},
    options: {},
    modelValue: {},
    disabled: { type: Boolean }
  },
  emits: ["update:modelValue"],
  setup(e, { emit: a }) {
    const t = e, l = a, i = j(""), u = H(() => t.options.map((p) => typeof p == "string" ? { value: p } : p)), f = H(() => u.value.filter((p) => (p.label ?? xe(p.value)).toLocaleLowerCase().includes(i.value.toLocaleLowerCase())));
    function v(p) {
      if (t.disabled) return;
      const o = t.modelValue ?? [];
      l("update:modelValue", o.includes(p) ? o.filter((n) => n !== p) : [...o, p]);
    }
    return (p, o) => (c(), y("fieldset", {
      class: "work-chip-picker",
      disabled: e.disabled
    }, [
      d("legend", null, U(e.label), 1),
      e.options.length > 10 ? (c(), W(r(be), {
        key: 0,
        modelValue: i.value,
        "onUpdate:modelValue": o[0] || (o[0] = (n) => i.value = n),
        type: "search",
        "aria-label": "Find " + e.label.toLowerCase(),
        placeholder: "Find a choice…"
      }, null, 8, ["modelValue", "aria-label"])) : I("", !0),
      d("div", Ts, [
        b(r(sl), {
          "model-value": e.modelValue ?? [],
          options: f.value.map((n) => ({ value: n.value, label: n.label ?? r(xe)(n.value) })),
          optionLabel: "label",
          optionValue: "value",
          multiple: "",
          disabled: e.disabled,
          "aria-label": e.label,
          "onUpdate:modelValue": o[1] || (o[1] = (n) => l("update:modelValue", n ?? []))
        }, null, 8, ["model-value", "options", "disabled", "aria-label"]),
        (c(!0), y(Z, null, re(e.modelValue?.filter((n) => !u.value.some((s) => s.value === n)) ?? [], (n) => (c(), W(r(J), {
          severity: "secondary",
          text: "",
          size: "small",
          key: n,
          type: "button",
          class: "work-choice work-unavailable",
          "aria-label": "Remove unavailable " + n,
          onClick: (s) => v(n)
        }, {
          default: L(() => [
            F(U(r(xe)(n)) + " · unavailable ×", 1)
          ]),
          _: 2
        }, 1032, ["aria-label", "onClick"]))), 128))
      ]),
      e.options.length ? I("", !0) : (c(), y("span", Ds, "No choices declared."))
    ], 8, Ss));
  }
}), Is = {
  class: "work-stack",
  "aria-label": "Item types editor"
}, Us = { class: "work-section-heading" }, Es = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, As = { class: "work-definition-meta" }, Ps = { class: "work-settings-grid" }, Rs = { class: "work-stack work-tight" }, Os = { class: "work-stack work-tight" }, Ns = { class: "work-stack work-tight" }, Ms = { class: "work-stack work-tight" }, Fs = {
  key: 0,
  class: "work-stack work-tight work-small"
}, Ls = {
  key: 0,
  class: "kx-empty"
}, zs = { class: "work-row work-add-definition" }, Bs = { class: "work-stack work-tight" }, js = {
  key: 0,
  class: "work-error work-small"
}, qs = /* @__PURE__ */ ge({
  __name: "TypesEditor",
  props: {
    draft: {},
    guardRemoval: { type: Function },
    issues: {}
  },
  setup(e) {
    const a = e, t = H(() => a.draft.item_types ?? []), l = j(""), i = j(""), u = j(""), f = H(() => /^[a-z][a-z0-9_]*$/.test(l.value) && !t.value.some((h) => h.id === l.value));
    function v() {
      f.value && ((a.draft.item_types ??= []).push({ id: l.value, title: xe(l.value), process: a.draft.processes?.[0]?.id ?? "", fields: [] }), l.value = "");
    }
    function p(h, m) {
      const k = h.id;
      h.id = m;
      for (const V of t.value) V.parent_types && (V.parent_types = V.parent_types.map((P) => P === k ? m : P));
    }
    function o(h, m) {
      h.fields = m, h.inherit && (h.inherit = h.inherit.filter((k) => m.includes(k)));
    }
    function n(h) {
      return t.value.filter((m) => m.id !== h.id && m.parent_types?.includes(h.id)).map((m) => m.title || xe(m.id));
    }
    async function s(h) {
      if (!u.value) {
        if (n(h).length) {
          i.value = `${h.title || xe(h.id)} is a parent type for ${n(h).join(", ")}. Remove those parent selections first.`;
          return;
        }
        u.value = h.id, i.value = "";
        try {
          const m = await a.guardRemoval?.("item_types", h.id);
          m ? i.value = m : oa(a.draft, "item_types", h.id);
        } finally {
          u.value = "";
        }
      }
    }
    return (h, m) => (c(), y("section", Is, [
      d("header", Us, [
        m[1] || (m[1] = d("div", null, [
          d("h2", null, "Item types"),
          d("p", { class: "work-muted work-small" }, "Choose the fields, parent relationships and process for each kind of work.")
        ], -1)),
        b(r(Le), {
          class: "kx-tag-sm",
          severity: "secondary"
        }, {
          default: L(() => [
            F(U(t.value.length) + " " + U(t.value.length === 1 ? "type" : "types"), 1)
          ]),
          _: 1
        })
      ]),
      i.value ? (c(), y("p", Es, U(i.value), 1)) : I("", !0),
      b(Ua, {
        columns: "types",
        count: t.value.length
      }, {
        default: L(() => [
          (c(!0), y(Z, null, re(t.value, (k, V) => (c(), W(Ia, {
            title: k.title || r(xe)(k.id),
            code: k.id,
            kind: e.draft.processes?.find((P) => P.id === k.process)?.name || r(xe)(k.process),
            key: V,
            class: "work-type-card"
          }, {
            usage: L(() => [
              d("span", As, [
                b(r(Le), {
                  class: "kx-tag-sm",
                  severity: "secondary"
                }, {
                  default: L(() => [
                    F(U(k.fields.length) + " " + U(k.fields.length === 1 ? "field" : "fields"), 1)
                  ]),
                  _: 2
                }, 1024),
                n(k).length ? (c(), W(r(Le), {
                  key: 0,
                  class: "kx-tag-sm",
                  severity: "secondary"
                }, {
                  default: L(() => [
                    F("Parent of " + U(n(k).join(", ")), 1)
                  ]),
                  _: 2
                }, 1024)) : I("", !0)
              ])
            ]),
            actions: L(() => [
              b(r(J), {
                severity: "secondary",
                text: "",
                size: "small",
                disabled: !!u.value,
                onClick: (P) => s(k),
                "aria-label": "Remove type"
              }, {
                default: L(() => [
                  b(r(le), {
                    icon: "tabler:trash",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["disabled", "onClick"])
            ]),
            default: L(() => [
              (c(!0), y(Z, null, re(e.issues?.filter((P) => P.code === "item_type " + k.id) ?? [], (P) => (c(), y("p", {
                key: P.what,
                class: "work-error work-small",
                role: "alert"
              }, U(r(Da)(P)), 1))), 128)),
              d("div", Ps, [
                d("label", Rs, [
                  m[2] || (m[2] = F("Identifier", -1)),
                  b(r(be), {
                    value: k.id,
                    onChange: (P) => p(k, P.target.value),
                    required: "",
                    pattern: "[a-z][a-z0-9_]*"
                  }, null, 8, ["value", "onChange"])
                ]),
                d("label", Os, [
                  m[3] || (m[3] = F("Title", -1)),
                  b(r(be), {
                    modelValue: k.title,
                    "onUpdate:modelValue": (P) => k.title = P,
                    placeholder: r(xe)(k.id)
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder"])
                ]),
                d("label", Ns, [
                  m[4] || (m[4] = F("Process", -1)),
                  b(r(ue), {
                    modelValue: k.process,
                    "onUpdate:modelValue": (P) => k.process = P,
                    required: "",
                    appendTo: "self",
                    optionLabel: "label",
                    optionValue: "value",
                    optionDisabled: "disabled",
                    options: [...(e.draft.processes ?? []).map((P) => ({ label: P.name || r(xe)(P.id), value: P.id, disabled: !1 }))]
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                ])
              ]),
              b(Wt, {
                label: "Fields",
                options: (e.draft.fields ?? []).map((P) => ({ value: P.code, label: r(Be)(P) })),
                "model-value": k.fields,
                "onUpdate:modelValue": (P) => o(k, P)
              }, null, 8, ["options", "model-value", "onUpdate:modelValue"]),
              b(Wt, {
                label: "Parent types",
                options: t.value.map((P) => ({ value: P.id, label: P.title || r(xe)(P.id) })),
                modelValue: k.parent_types,
                "onUpdate:modelValue": (P) => k.parent_types = P
              }, null, 8, ["options", "modelValue", "onUpdate:modelValue"]),
              d("div", Ms, [
                b(Wt, {
                  label: "Inherit from parent",
                  options: k.fields.map((P) => ({ value: P, label: r(Be)(e.draft.fields?.find((x) => x.code === P) ?? { code: P }) })),
                  modelValue: k.inherit,
                  "onUpdate:modelValue": (P) => k.inherit = P
                }, null, 8, ["options", "modelValue", "onUpdate:modelValue"]),
                m[5] || (m[5] = d("p", { class: "work-muted work-small" }, "These fields resolve from the parent when this item has no own value.", -1))
              ]),
              k.parent_types?.length ? (c(), y("label", Fs, [
                m[6] || (m[6] = F("When the parent moves", -1)),
                b(r(ue), {
                  modelValue: k.move_children,
                  "onUpdate:modelValue": (P) => k.move_children = P,
                  appendTo: "self",
                  optionLabel: "label",
                  optionValue: "value",
                  optionDisabled: "disabled",
                  options: [{ label: "Default", value: void 0, disabled: !1 }, { label: "Move children", value: "move", disabled: !1 }, { label: "Refuse while children exist", value: "refuse", disabled: !1 }]
                }, null, 8, ["modelValue", "onUpdate:modelValue"])
              ])) : I("", !0)
            ]),
            _: 2
          }, 1032, ["title", "code", "kind"]))), 128)),
          t.value.length ? I("", !0) : (c(), y("p", Ls, "Add an item type to connect fields to a process.")),
          d("div", zs, [
            d("label", Bs, [
              m[7] || (m[7] = F("New type identifier", -1)),
              b(r(be), {
                modelValue: l.value,
                "onUpdate:modelValue": m[0] || (m[0] = (k) => l.value = k),
                placeholder: "new_type",
                onKeydown: Ae(Ve(v, ["prevent"]), ["enter"])
              }, null, 8, ["modelValue", "onKeydown"])
            ]),
            b(r(J), {
              label: "Add type",
              severity: "secondary",
              disabled: !f.value,
              onClick: v,
              outlined: ""
            }, {
              icon: L(() => [
                b(r(le), {
                  icon: "tabler:plus",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["disabled"]),
            l.value && !f.value ? (c(), y("span", js, "Use a unique lowercase identifier with letters, numbers and underscores.")) : I("", !0)
          ])
        ]),
        _: 1
      }, 8, ["count"])
    ]));
  }
}), Ws = ".work-process-canvas>svg{height:480px;width:100%}.work-process-canvas:focus-visible{outline:var(--p-focus-ring-width) var(--p-focus-ring-style) var(--p-focus-ring-color);outline-offset:var(--p-focus-ring-offset)}.work-state-card{fill:var(--p-content-background);stroke:var(--p-content-border-color);stroke-width:1.5}.work-graph-node.work-selected .work-state-card{stroke:var(--p-primary-color);stroke-width:2.5;fill:color-mix(in srgb,var(--p-primary-color) 6%,var(--p-content-background))}.work-graph-node:focus-visible .work-state-card{stroke:var(--p-focus-ring-color);stroke-width:var(--p-focus-ring-width)}.work-process-canvas .work-edge-label{font-size:12px;fill:var(--p-text-color)}.work-process-canvas .work-edge-label-bg{fill:var(--p-content-background);stroke:var(--p-content-border-color);stroke-width:1}.work-edge-line{stroke:var(--p-primary-color);stroke-width:1.5}.work-edge-return .work-edge-line{stroke:var(--p-text-muted-color);stroke-dasharray:5 4}.work-graph-arrow{fill:context-stroke}.work-lane-line{fill:none;stroke:var(--p-text-muted-color);stroke-width:1.5;stroke-dasharray:2 4}.work-node-connector{fill:var(--p-content-background);stroke:var(--p-primary-color);stroke-width:1.5}.work-node-connector:hover,.work-node-connector:focus-visible,.work-node-connector[aria-pressed=true]{fill:var(--p-primary-color)}.work-any-transition:focus-visible text,.work-any-transition[aria-pressed=true] text{fill:var(--p-primary-color);text-decoration:underline}.work-process-legend{position:static;flex-wrap:wrap;padding:10px 16px;border-top:1px solid var(--p-content-border-color);background:var(--p-content-background)}@media(max-width:700px){.work-process-canvas>svg{height:420px}}.work-process-more{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:8px;padding:8px 16px;border-top:1px solid var(--p-content-border-color);background:var(--p-content-background);color:var(--p-text-muted-color);font-size:12px}.work-process-canvas .work-graph-edge.work-selected .work-edge-label-bg{fill:var(--p-primary-color);stroke:var(--p-primary-color)}.work-process-canvas .work-graph-edge.work-selected .work-edge-label{fill:var(--p-primary-contrast-color)}", Al = /* @__PURE__ */ new WeakSet();
function Ks(e) {
  const a = e.getRootNode();
  if (a instanceof ShadowRoot && !Al.has(a)) {
    const t = e.ownerDocument.createElement("style");
    t.textContent = Ws, a.append(t), Al.add(a);
  }
}
const Gs = 0.8;
function Hs(e, a, t) {
  const l = Math.min(1, a.width / e.width, a.height / e.height);
  if (l >= Gs) return { zoom: l, pan: { x: (e.width - a.width / l) / 2, y: (e.height - a.height / l) / 2 } };
  const i = e.nodes.find((f) => f.state.id === t) ?? e.nodes[0], u = Math.min(1, a.width / ((i?.width ?? 190) + 64));
  return { zoom: u, pan: i ? { x: e.direction === "TB" ? i.x - a.width / u / 2 : i.x - i.width / 2 - 32, y: e.direction === "TB" ? i.y - i.height / 2 - 32 : i.y - a.height / u / 2 } : { x: 0, y: 0 } };
}
const Ys = ["onKeydown"], Xs = {
  key: 0,
  class: "work-process-instruction",
  role: "status"
}, Js = ["viewBox"], Zs = ["id"], Qs = ["d", "marker-end"], _s = ["aria-label", "aria-pressed", "aria-keyshortcuts", "onKeydown", "onFocus", "onClick"], er = ["d"], tr = ["d", "marker-end"], ar = ["x", "y", "width", "height"], lr = ["x", "y"], or = ["x", "dy"], ir = ["aria-label", "aria-pressed", "onClick", "onKeydown", "onFocus", "onPointerup"], nr = ["x", "y", "width", "height"], sr = ["cx", "cy"], rr = ["x", "y"], dr = ["x", "dy"], ur = ["x", "y"], cr = ["x", "dy"], vr = {
  key: 0,
  class: "work-limit-text"
}, mr = ["aria-label", "aria-pressed", "aria-keyshortcuts", "onFocus", "onKeydown", "onClick"], fr = ["x", "y"], pr = ["x", "dy"], br = ["cx", "cy", "aria-label", "aria-pressed", "onFocus", "onPointerdown", "onClick", "onKeydown"], hr = ["d"], yr = {
  key: 1,
  class: "work-process-more",
  role: "status"
}, gr = { class: "work-process-legend" }, kr = /* @__PURE__ */ ge({
  __name: "ProcessGraph",
  props: {
    process: {},
    draft: {},
    selectedState: {},
    selectedTransition: {}
  },
  emits: ["state", "transition", "connect", "removeTransition", "clear"],
  setup(e, { expose: a, emit: t }) {
    const l = e, i = t, u = ol().replace(/:/g, "_"), f = j(""), v = j(), p = j();
    let o;
    const n = j(900), s = j(!1), h = H(() => n.value < 700 ? 420 : 480), m = H(() => ti(l.process, l.draft, { width: n.value, height: h.value })), k = j(1), V = j({ x: 0, y: 0 }), P = j({ x: 0, y: 0 }), x = H(() => ({ width: n.value, height: s.value ? Math.max(h.value, m.value.height * Math.min(1, n.value / m.value.width)) : h.value })), T = H(() => m.value.nodes.filter((S) => S.x - S.width / 2 >= V.value.x && S.x + S.width / 2 <= V.value.x + x.value.width / k.value && S.y - S.height / 2 >= V.value.y && S.y + S.height / 2 <= V.value.y + x.value.height / k.value).length);
    function $() {
      s.value = !1;
      const S = Hs(m.value, x.value, l.process.initial);
      k.value = S.zoom, V.value = S.pan;
    }
    const C = H(() => `${V.value.x} ${V.value.y} ${x.value.width / k.value} ${x.value.height / k.value}`), D = H(() => m.value.nodes.find((S) => S.state.id === f.value));
    function X() {
      s.value = !0, k.value = Math.min(1, x.value.width / m.value.width), V.value = { x: (m.value.width - x.value.width / k.value) / 2, y: 0 };
    }
    function te(S) {
      const _ = Math.max(0.02, Math.min(3, k.value * S)), A = 1 / k.value - 1 / _;
      V.value = { x: V.value.x + x.value.width * A / 2, y: V.value.y + x.value.height * A / 2 }, k.value = _;
    }
    function me(S) {
      const _ = x.value.width / k.value, A = x.value.height / k.value;
      (S.x - S.width / 2 < V.value.x || S.x + S.width / 2 > V.value.x + _ || S.y - S.height / 2 < V.value.y || S.y + S.height / 2 > V.value.y + A) && (V.value = { x: S.x - _ / 2, y: S.y - A / 2 });
    }
    function de() {
      const S = m.value.nodes.find((_) => _.state === l.selectedState) ?? m.value.edges.find((_) => _.transition === l.selectedTransition);
      S && me(S);
    }
    Ue([m, () => l.selectedState, () => l.selectedTransition], de, { flush: "post" }), Ue(() => l.process.id, () => {
      $e(), $();
    }, { flush: "post" });
    function G(S) {
      if (S.target !== v.value) return;
      (S.key === "+" || S.key === "=") && (S.preventDefault(), te(1.2)), S.key === "-" && (S.preventDefault(), te(1 / 1.2)), S.key === "0" && (S.preventDefault(), X());
      const _ = 60 / k.value;
      S.key.startsWith("Arrow") && (S.preventDefault(), V.value = { x: V.value.x + (S.key === "ArrowRight" ? _ : S.key === "ArrowLeft" ? -_ : 0), y: V.value.y + (S.key === "ArrowDown" ? _ : S.key === "ArrowUp" ? -_ : 0) });
    }
    function R(S, _) {
      const A = _.currentTarget;
      if (!f.value) i("state", S, A);
      else if (f.value !== S.id) {
        const ae = f.value;
        f.value = "", i("connect", ae, S.id, A);
      }
    }
    function N(S) {
      f.value = S.state.id, P.value = { x: m.value.direction === "TB" ? S.x : S.x + S.width / 2, y: m.value.direction === "TB" ? S.y + S.height / 2 : S.y };
    }
    function w(S, _) {
      if (S.pointerType === "touch" || S.button !== 0) return;
      o = S.pointerId, N(_);
      const A = S.currentTarget;
      A.hasPointerCapture?.(S.pointerId) && A.releasePointerCapture(S.pointerId);
    }
    function O(S, _) {
      o === S.pointerId && (o = void 0, !(!f.value || f.value === _.id) && R(_, S));
    }
    function se(S, _) {
      if ((S.key === "Enter" || S.key === " ") && (S.preventDefault(), R(_, S)), ["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp"].includes(S.key)) {
        S.preventDefault();
        const A = Array.from(p.value?.querySelectorAll(".work-graph-node") ?? []), ae = m.value.nodes.findIndex((we) => we.state === _), Se = ["ArrowRight", "ArrowDown"].includes(S.key) ? 1 : -1;
        A[(ae + Se + A.length) % A.length]?.focus();
      }
    }
    function q(S, _) {
      l.selectedTransition === _ && i("removeTransition", S);
    }
    function $e() {
      f.value = "", o = void 0, Q.clear(), z = 0;
    }
    function Ce() {
      $e(), i("clear");
    }
    const Q = /* @__PURE__ */ new Map();
    let z = 0;
    function B(S) {
      if (!S.target.closest('[role="button"]') && (Q.set(S.pointerId, { x: S.clientX, y: S.clientY }), v.value?.setPointerCapture?.(S.pointerId), Q.size === 2)) {
        const [_, A] = [...Q.values()];
        z = Math.hypot(_.x - A.x, _.y - A.y);
      }
    }
    function g(S) {
      const _ = p.value?.getBoundingClientRect();
      if (!_?.width) return;
      if (o === S.pointerId && f.value) {
        P.value = { x: V.value.x + (S.clientX - _.left) * x.value.width / k.value / _.width, y: V.value.y + (S.clientY - _.top) * x.value.height / k.value / _.height };
        return;
      }
      const A = Q.get(S.pointerId);
      if (A)
        if (Q.set(S.pointerId, { x: S.clientX, y: S.clientY }), Q.size === 2) {
          const [ae, Se] = [...Q.values()], we = Math.hypot(ae.x - Se.x, ae.y - Se.y);
          z && te(we / z), z = we;
        } else V.value = { x: V.value.x - (S.clientX - A.x) * x.value.width / k.value / _.width, y: V.value.y - (S.clientY - A.y) * x.value.height / k.value / _.height };
    }
    function E(S) {
      o === S.pointerId && (f.value = "", o = void 0);
    }
    function M(S) {
      Q.delete(S.pointerId), z = 0, E(S);
    }
    function ie(S) {
      S.ctrlKey && (S.preventDefault(), te(Math.exp(-S.deltaY * 0.01)));
    }
    let ee;
    Ta(() => {
      if (v.value && Ks(v.value), typeof ResizeObserver < "u" && p.value) {
        let S = !0;
        ee = new ResizeObserver(() => {
          const _ = p.value?.getBoundingClientRect();
          if (!_?.width || !_.height) return;
          const A = x.value.width;
          n.value = _.width, (S || Math.abs(_.width - A) > 1) && (s.value ? X() : $(), S = !1), de();
        }), ee.observe(p.value);
      }
    }), yt(() => ee?.disconnect()), a({ fit: X, focus: () => v.value?.focus(), zoomIn: () => te(1.2), zoomOut: () => te(1 / 1.2) });
    function he(S) {
      return S.category === "completed" ? "check" : S.category === "canceled" ? "x" : S.id === l.process.initial ? "arrow-bar-to-right" : { gate: "shield-check", automated: "bolt", parallel: "arrows-split" }[S.kind ?? ""] ?? "user";
    }
    return (S, _) => (c(), y("section", {
      ref_key: "canvas",
      ref: v,
      class: "work-process-canvas",
      "aria-label": "Process map",
      tabindex: "0",
      onKeydown: [
        G,
        Ae(Ve(Ce, ["stop"]), ["esc"])
      ],
      onPointerdown: B,
      onPointermove: g,
      onPointerup: M,
      onPointerleave: E,
      onPointercancel: $e,
      onWheel: ie
    }, [
      f.value ? (c(), y("p", Xs, "Choose the next stop. Escape cancels.")) : I("", !0),
      (c(), y("svg", {
        ref_key: "svg",
        ref: p,
        style: xo({ height: x.value.height + "px" }),
        viewBox: C.value,
        role: "group",
        "aria-label": "States and transitions"
      }, [
        d("defs", null, [
          d("marker", {
            id: r(u) + "-arrow",
            viewBox: "0 0 8 8",
            refX: "7",
            refY: "4",
            markerWidth: "6",
            markerHeight: "6",
            orient: "auto"
          }, [..._[1] || (_[1] = [
            d("path", {
              d: "M0 0 L8 4 L0 8 z",
              class: "work-graph-arrow"
            }, null, -1)
          ])], 8, Zs)
        ]),
        (c(!0), y(Z, null, re(m.value.parallels, (A) => (c(), y("path", {
          key: A.key,
          d: A.path,
          class: "work-lane-line",
          "marker-end": `url(#${r(u)}-arrow)`
        }, [
          d("title", null, "Parallel lane from " + U(r(pe)(A.state)), 1)
        ], 8, Qs))), 128)),
        (c(!0), y(Z, null, re(m.value.edges, (A) => (c(), y("g", {
          key: A.key,
          class: bt(["work-graph-edge", ["work-edge-" + A.type, { "work-selected": e.selectedTransition === A.transition }]]),
          role: "button",
          tabindex: "0",
          "aria-label": "Edit transition " + r(Me)(A.transition),
          "aria-pressed": e.selectedTransition === A.transition,
          "aria-keyshortcuts": e.selectedTransition === A.transition ? "Delete Backspace" : void 0,
          onKeydown: [
            Ae((ae) => q(ae, A.transition), ["delete"]),
            Ae((ae) => q(ae, A.transition), ["backspace"]),
            Ae(Ve((ae) => i("transition", A.transition, ae.currentTarget), ["prevent"]), ["enter"]),
            Ae(Ve((ae) => i("transition", A.transition, ae.currentTarget), ["prevent"]), ["space"])
          ],
          onFocus: (ae) => me(A),
          onClick: (ae) => i("transition", A.transition, ae.currentTarget)
        }, [
          d("path", {
            d: A.path,
            class: "work-edge-hit"
          }, null, 8, er),
          d("path", {
            d: A.path,
            class: "work-edge-line",
            "marker-end": `url(#${r(u)}-arrow)`
          }, null, 8, tr),
          d("rect", {
            x: A.x - A.width / 2,
            y: A.y - A.height / 2,
            width: A.width,
            height: A.height,
            rx: "6",
            class: "work-edge-label-bg"
          }, null, 8, ar),
          d("text", {
            x: A.x,
            y: A.y - (A.lines.length - 1) * 8 + 4,
            class: "work-edge-label",
            "text-anchor": "middle"
          }, [
            (c(!0), y(Z, null, re(A.lines, (ae, Se) => (c(), y("tspan", {
              key: Se,
              x: A.x,
              dy: Se ? 16 : 0
            }, U(ae), 9, or))), 128))
          ], 8, lr)
        ], 42, _s))), 128)),
        (c(!0), y(Z, null, re(m.value.nodes, (A) => (c(), y("g", {
          key: A.state.id,
          class: bt(["work-graph-node", ["work-stop-" + A.state.category, { "work-selected": e.selectedState === A.state }]]),
          role: "button",
          tabindex: "0",
          "aria-label": "Edit state " + r(pe)(A.state),
          "aria-pressed": e.selectedState === A.state,
          onClick: (ae) => R(A.state, ae),
          onKeydown: (ae) => se(ae, A.state),
          onFocus: (ae) => me(A),
          onPointerup: (ae) => O(ae, A.state)
        }, [
          d("rect", {
            x: A.x - A.width / 2,
            y: A.y - A.height / 2,
            width: A.width,
            height: A.height,
            rx: "10",
            class: "work-state-card"
          }, null, 8, nr),
          d("circle", {
            cx: A.x - A.width / 2 + 22,
            cy: A.y - A.height / 2 + 25,
            r: "10",
            class: "work-stop-ring"
          }, null, 8, sr),
          b(r(le), {
            icon: "tabler:" + he(A.state),
            x: A.x - A.width / 2 + 15,
            y: A.y - A.height / 2 + 18,
            width: "14",
            height: "14",
            class: "work-stop-icon",
            "aria-hidden": "true"
          }, null, 8, ["icon", "x", "y"]),
          d("text", {
            x: A.x - A.width / 2 + 42,
            y: A.y - A.height / 2 + 29,
            class: "work-node-name"
          }, [
            (c(!0), y(Z, null, re(A.title, (ae, Se) => (c(), y("tspan", {
              key: Se,
              x: A.x - A.width / 2 + 42,
              dy: Se ? 18 : 0
            }, U(ae), 9, dr))), 128))
          ], 8, rr),
          d("text", {
            x: A.x - A.width / 2 + 16,
            y: A.y - A.height / 2 + 33 + A.title.length * 18,
            class: "work-node-meta"
          }, [
            (c(!0), y(Z, null, re(A.caption, (ae, Se) => (c(), y("tspan", {
              key: Se,
              x: A.x - A.width / 2 + 16,
              dy: Se ? 16 : 0
            }, U(ae), 9, cr))), 128)),
            e.draft.policy?.wip?.[A.state.id] ? (c(), y("tspan", vr, " · limit " + U(e.draft.policy.wip[A.state.id].limit), 1)) : I("", !0)
          ], 8, ur),
          (c(!0), y(Z, null, re(A.badges, (ae, Se) => (c(), y("g", {
            key: ae.id,
            class: "work-any-transition",
            role: "button",
            tabindex: "0",
            "aria-label": "Edit transition " + r(Me)(ae),
            "aria-pressed": e.selectedTransition === ae,
            "aria-keyshortcuts": e.selectedTransition === ae ? "Delete Backspace" : void 0,
            onFocus: (we) => me(A),
            onKeydown: [
              Ae((we) => q(we, ae), ["delete"]),
              Ae((we) => q(we, ae), ["backspace"]),
              Ae(Ve((we) => i("transition", ae, we.currentTarget), ["stop", "prevent"]), ["enter"]),
              Ae(Ve((we) => i("transition", ae, we.currentTarget), ["stop", "prevent"]), ["space"])
            ],
            onClick: Ve((we) => i("transition", ae, we.currentTarget), ["stop"])
          }, [
            d("text", {
              x: A.x - A.width / 2 + 16,
              y: A.y - A.height / 2 + 33 + A.title.length * 18 + A.caption.length * 16 + A.badges.slice(0, Se).reduce((we, rt) => we + r(zt)(r(Me)(rt) + " works from any state").length * 18, 0),
              class: "work-node-meta"
            }, [
              (c(!0), y(Z, null, re(r(zt)(r(Me)(ae) + " works from any state"), (we, rt) => (c(), y("tspan", {
                key: rt,
                x: A.x - A.width / 2 + 16,
                dy: rt ? 18 : 0
              }, U(we), 9, pr))), 128))
            ], 8, fr)
          ], 40, mr))), 128)),
          ["completed", "canceled"].includes(A.state.category) ? I("", !0) : (c(), y("circle", {
            key: 0,
            cx: m.value.direction === "TB" ? A.x : A.x + A.width / 2,
            cy: m.value.direction === "TB" ? A.y + A.height / 2 : A.y,
            r: "9",
            class: "work-node-connector",
            role: "button",
            tabindex: "0",
            "aria-label": "Connect from " + r(pe)(A.state),
            "aria-pressed": f.value === A.state.id,
            onFocus: (ae) => me(A),
            onPointerdown: Ve((ae) => w(ae, A), ["stop"]),
            onClick: Ve((ae) => N(A), ["stop"]),
            onKeydown: [
              Ae(Ve((ae) => N(A), ["stop", "prevent"]), ["enter"]),
              Ae(Ve((ae) => N(A), ["stop", "prevent"]), ["space"])
            ]
          }, null, 40, br))
        ], 42, ir))), 128)),
        D.value ? (c(), y("path", {
          key: 0,
          d: `M ${m.value.direction === "TB" ? D.value.x : D.value.x + D.value.width / 2} ${m.value.direction === "TB" ? D.value.y + D.value.height / 2 : D.value.y} L ${P.value.x} ${P.value.y}`,
          class: "work-connect-ghost"
        }, null, 8, hr)) : I("", !0)
      ], 12, Js)),
      !s.value && T.value < e.process.states.length ? (c(), y("div", yr, [
        d("span", null, U(T.value) + " of " + U(e.process.states.length) + " states in view · More " + U(m.value.direction === "TB" ? "below" : "to the right"), 1),
        b(r(J), {
          label: "Show full process",
          size: "small",
          text: "",
          onClick: _[0] || (_[0] = (A) => X())
        })
      ])) : I("", !0),
      d("div", gr, [
        d("span", null, U(e.process.states.length) + " states · " + U(Math.round(k.value * 100)) + "%", 1),
        _[2] || (_[2] = d("span", null, [
          d("i"),
          F("Transition")
        ], -1)),
        _[3] || (_[3] = d("span", null, [
          d("i", { class: "work-return-key" }),
          F("Return / loop")
        ], -1)),
        _[4] || (_[4] = d("span", null, "Drag to pan · Ctrl + scroll to zoom · Fit for full process", -1))
      ])
    ], 40, Ys));
  }
}), wr = {
  class: "work-process-list work-stack",
  "aria-label": "Process list"
}, Vr = { class: "work-stack work-tight" }, $r = { class: "work-table-scroll" }, xr = {
  class: "work-settings-table work-process-table",
  role: "table",
  "aria-label": "States"
}, Cr = { role: "rowgroup" }, Sr = ["aria-selected"], Tr = { role: "cell" }, Dr = { role: "cell" }, Ir = { role: "cell" }, Ur = {
  role: "cell",
  class: "work-process-list-actions"
}, Er = { class: "work-table-scroll" }, Ar = {
  class: "work-settings-table work-process-table",
  role: "table",
  "aria-label": "Transitions"
}, Pr = { role: "rowgroup" }, Rr = ["aria-selected"], Or = { role: "cell" }, Nr = { role: "cell" }, Mr = { role: "cell" }, Fr = {
  role: "cell",
  class: "work-process-list-actions"
}, Lr = /* @__PURE__ */ ge({
  __name: "ProcessList",
  props: {
    process: {},
    selectedState: {},
    selectedTransition: {}
  },
  emits: ["state", "transition", "removeState", "removeTransition", "addTransition"],
  setup(e) {
    return (a, t) => (c(), y("section", wr, [
      d("label", Vr, [
        t[2] || (t[2] = F("Process name", -1)),
        b(r(be), {
          modelValue: e.process.name,
          "onUpdate:modelValue": t[0] || (t[0] = (l) => e.process.name = l),
          "aria-label": "Process name"
        }, null, 8, ["modelValue"])
      ]),
      t[9] || (t[9] = d("h3", null, "States", -1)),
      d("div", $r, [
        d("table", xr, [
          t[5] || (t[5] = d("thead", { role: "rowgroup" }, [
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
          d("tbody", Cr, [
            (c(!0), y(Z, null, re(e.process.states, (l) => (c(), y("tr", {
              key: l.id,
              "aria-selected": e.selectedState === l,
              role: "row"
            }, [
              d("td", Tr, [
                b(r(be), {
                  modelValue: l.name,
                  "onUpdate:modelValue": (i) => l.name = i,
                  "aria-label": "Name of " + r(pe)(l)
                }, null, 8, ["modelValue", "onUpdate:modelValue", "aria-label"])
              ]),
              d("td", Dr, [
                t[3] || (t[3] = d("span", {
                  class: "work-process-cell-label",
                  "aria-hidden": "true"
                }, "Phase", -1)),
                F(U(r(It)(l.category)), 1)
              ]),
              d("td", Ir, [
                t[4] || (t[4] = d("span", {
                  class: "work-process-cell-label",
                  "aria-hidden": "true"
                }, "Kind", -1)),
                b(r(Le), { severity: "secondary" }, {
                  default: L(() => [
                    F(U(r(ga)(l.kind)), 1)
                  ]),
                  _: 2
                }, 1024)
              ]),
              d("td", Ur, [
                b(r(J), {
                  size: "small",
                  text: "",
                  severity: "secondary",
                  "aria-label": "Edit state",
                  onClick: (i) => a.$emit("state", l, i.currentTarget)
                }, {
                  default: L(() => [
                    b(r(le), { icon: "tabler:pencil" })
                  ]),
                  _: 1
                }, 8, ["onClick"]),
                b(r(J), {
                  size: "small",
                  text: "",
                  severity: "danger",
                  "aria-label": "Remove state " + r(pe)(l),
                  onClick: (i) => a.$emit("removeState", l)
                }, {
                  default: L(() => [
                    b(r(le), { icon: "tabler:trash" })
                  ]),
                  _: 1
                }, 8, ["aria-label", "onClick"])
              ])
            ], 8, Sr))), 128))
          ])
        ])
      ]),
      t[10] || (t[10] = d("h3", null, "Transitions", -1)),
      d("div", Er, [
        d("table", Ar, [
          t[8] || (t[8] = d("thead", { role: "rowgroup" }, [
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
          d("tbody", Pr, [
            (c(!0), y(Z, null, re(e.process.transitions ?? [], (l) => (c(), y("tr", {
              key: l.id,
              "aria-selected": e.selectedTransition === l,
              role: "row"
            }, [
              d("td", Or, [
                b(r(be), {
                  modelValue: l.name,
                  "onUpdate:modelValue": (i) => l.name = i,
                  placeholder: r(Me)(l),
                  "aria-label": "Name of " + r(Me)(l)
                }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder", "aria-label"])
              ]),
              d("td", Nr, [
                t[6] || (t[6] = d("span", {
                  class: "work-process-cell-label",
                  "aria-hidden": "true"
                }, "From", -1)),
                F(" " + U(l.from === "any" ? "Any state" : l.from.map((i) => r(pe)(e.process.states.find((u) => u.id === i))).join(", ")), 1)
              ]),
              d("td", Mr, [
                t[7] || (t[7] = d("span", {
                  class: "work-process-cell-label",
                  "aria-hidden": "true"
                }, "To", -1)),
                F(U(r(pe)(e.process.states.find((i) => i.id === l.to))), 1)
              ]),
              d("td", Fr, [
                b(r(J), {
                  size: "small",
                  text: "",
                  severity: "secondary",
                  "aria-label": "Edit transition",
                  onClick: (i) => a.$emit("transition", l, i.currentTarget)
                }, {
                  default: L(() => [
                    b(r(le), { icon: "tabler:pencil" })
                  ]),
                  _: 1
                }, 8, ["onClick"]),
                b(r(J), {
                  size: "small",
                  text: "",
                  severity: "danger",
                  "aria-label": "Remove transition " + r(Me)(l),
                  onClick: (i) => a.$emit("removeTransition", l)
                }, {
                  default: L(() => [
                    b(r(le), { icon: "tabler:trash" })
                  ]),
                  _: 1
                }, 8, ["aria-label", "onClick"])
              ])
            ], 8, Rr))), 128))
          ])
        ])
      ]),
      b(r(J), {
        label: "Add transition",
        severity: "secondary",
        outlined: "",
        onClick: t[1] || (t[1] = (l) => a.$emit("addTransition", l.currentTarget))
      }, {
        icon: L(() => [
          b(r(le), { icon: "tabler:plus" })
        ]),
        _: 1
      })
    ]));
  }
}), zr = { class: "work-stack work-transition-settings" }, Br = { class: "work-stack work-tight" }, jr = { class: "work-row" }, qr = { class: "work-row" }, Wr = { class: "work-row" }, Kr = { class: "work-stack work-tight" }, Gr = { class: "work-row" }, Hr = { class: "work-stack work-tight" }, Yr = { class: "work-stack work-tight" }, Xr = /* @__PURE__ */ ge({
  __name: "TransitionSettings",
  props: {
    transition: {},
    process: {},
    draft: {},
    boardId: {}
  },
  emits: ["validity"],
  setup(e, { emit: a }) {
    const t = e, l = a;
    function i() {
      (t.transition.set ??= []).push({ field: t.draft.fields?.[0]?.code ?? "", value: "" });
    }
    function u(f, v) {
      const p = t.transition.set?.[f];
      !p || !t.transition.set || (t.transition.set[f] = { field: p.field, ...v === "clear" ? { clear: !0 } : v === "copy" ? { copy: "" } : { value: "" } });
    }
    return (f, v) => (c(), y("div", zr, [
      d("label", Br, [
        v[14] || (v[14] = F("To state", -1)),
        b(r(ue), {
          modelValue: e.transition.to,
          "onUpdate:modelValue": v[0] || (v[0] = (p) => e.transition.to = p),
          "aria-label": "To state",
          appendTo: "self",
          optionLabel: "label",
          optionValue: "value",
          options: e.process.states.map((p) => ({ label: r(pe)(p), value: p.id }))
        }, null, 8, ["modelValue", "options"])
      ]),
      d("label", jr, [
        v[15] || (v[15] = d("span", { class: "work-spacer" }, "Happens automatically", -1)),
        b(r(Ge), {
          "model-value": e.transition.auto,
          "onUpdate:modelValue": v[1] || (v[1] = (p) => {
            e.transition.auto = p, p || delete e.transition.default;
          }),
          "aria-label": "Automatic transition"
        }, null, 8, ["model-value"])
      ]),
      d("label", qr, [
        v[16] || (v[16] = d("span", { class: "work-spacer" }, "Default automatic transition", -1)),
        b(r(Ge), {
          modelValue: e.transition.default,
          "onUpdate:modelValue": v[2] || (v[2] = (p) => e.transition.default = p),
          disabled: !e.transition.auto,
          "aria-label": "Default transition"
        }, null, 8, ["modelValue", "disabled"])
      ]),
      d("label", Wr, [
        v[17] || (v[17] = d("span", { class: "work-spacer" }, "Works from any state", -1)),
        b(r(Ge), {
          "model-value": e.transition.from === "any",
          "aria-label": "Works from any state",
          "onUpdate:modelValue": v[3] || (v[3] = (p) => e.transition.from = p ? "any" : [])
        }, null, 8, ["model-value"])
      ]),
      e.transition.from !== "any" ? (c(), W(Wt, {
        key: 0,
        label: "From states",
        options: e.process.states.map((p) => ({ value: p.id, label: r(pe)(p) })),
        modelValue: e.transition.from,
        "onUpdate:modelValue": v[4] || (v[4] = (p) => e.transition.from = p)
      }, null, 8, ["options", "modelValue"])) : I("", !0),
      v[21] || (v[21] = d("h4", { class: "work-process-group" }, "Must be filled", -1)),
      b(Wt, {
        label: "Required fields",
        options: e.draft.fields?.map((p) => ({ value: p.code, label: p.title || p.code })) ?? [],
        modelValue: e.transition.require,
        "onUpdate:modelValue": v[5] || (v[5] = (p) => e.transition.require = p)
      }, null, 8, ["options", "modelValue"]),
      v[22] || (v[22] = d("h4", { class: "work-process-group" }, "Also sets", -1)),
      (c(!0), y(Z, null, re(e.transition.set ?? [], (p, o) => (c(), y("div", {
        key: o,
        class: "work-process-value work-stack work-tight"
      }, [
        d("label", Kr, [
          v[18] || (v[18] = F("Field", -1)),
          b(r(ue), {
            modelValue: p.field,
            "onUpdate:modelValue": (n) => p.field = n,
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            options: e.draft.fields?.map((n) => ({ value: n.code, label: n.title || n.code })) ?? []
          }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
        ]),
        d("div", Gr, [
          b(r(ue), {
            "model-value": p.clear ? "clear" : p.copy !== void 0 ? "copy" : "value",
            "aria-label": "Value action",
            appendTo: "self",
            options: [
              { label: "Set value", value: "value" },
              { label: "Clear value", value: "clear" },
              { label: "Copy field", value: "copy" }
            ],
            optionLabel: "label",
            optionValue: "value",
            "onUpdate:modelValue": (n) => u(o, n)
          }, null, 8, ["model-value", "onUpdate:modelValue"]),
          b(r(J), {
            text: "",
            severity: "danger",
            "aria-label": "Remove value " + (o + 1),
            onClick: (n) => e.transition.set?.splice(o, 1)
          }, {
            default: L(() => [
              b(r(le), { icon: "tabler:trash" })
            ]),
            _: 1
          }, 8, ["aria-label", "onClick"])
        ]),
        p.copy !== void 0 ? (c(), W(r(ue), {
          key: 0,
          modelValue: p.copy,
          "onUpdate:modelValue": (n) => p.copy = n,
          "aria-label": "Copy from field",
          appendTo: "self",
          optionLabel: "label",
          optionValue: "value",
          options: e.draft.fields?.map((n) => ({ value: n.code, label: n.title || n.code })) ?? []
        }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])) : p.clear ? I("", !0) : (c(!0), y(Z, { key: 1 }, re(e.draft.fields?.filter((n) => n.code === p.field) ?? [], (n) => (c(), W(Xl, {
          key: n.code,
          "board-id": e.boardId ?? "",
          field: n,
          modelValue: p.value,
          "onUpdate:modelValue": (s) => p.value = s,
          onValidity: (s) => l("validity", "effect-" + o, s)
        }, null, 8, ["board-id", "field", "modelValue", "onUpdate:modelValue", "onValidity"]))), 128))
      ]))), 128)),
      b(r(J), {
        label: "Add value",
        severity: "secondary",
        outlined: "",
        size: "small",
        onClick: i
      }, {
        icon: L(() => [
          b(r(le), { icon: "tabler:plus" })
        ]),
        _: 1
      }),
      d("label", Hr, [
        v[19] || (v[19] = F("Offer to people", -1)),
        b(r(ue), {
          "model-value": e.transition.people,
          "aria-label": "Offer to people",
          appendTo: "self",
          optionLabel: "label",
          optionValue: "value",
          options: [{ label: "Work default", value: void 0 }, { label: "Offer explicitly", value: !0 }, { label: "Hide from people", value: !1 }],
          "onUpdate:modelValue": v[6] || (v[6] = (p) => e.transition.people = p)
        }, null, 8, ["model-value"])
      ]),
      d("label", Yr, [
        v[20] || (v[20] = F("Evaluation order", -1)),
        b(r(_e), {
          "model-value": e.transition.order ?? null,
          "aria-label": "Transition order",
          min: 0,
          useGrouping: !1,
          "onUpdate:modelValue": v[7] || (v[7] = (p) => e.transition.order = p ?? void 0)
        }, null, 8, ["model-value"])
      ]),
      v[23] || (v[23] = d("h4", { class: "work-process-group" }, "Only when", -1)),
      b(rl, {
        label: "Allow this transition when",
        draft: e.draft,
        "board-id": e.boardId,
        "model-value": e.transition.when,
        "onUpdate:modelValue": v[8] || (v[8] = (p) => e.transition.when = p),
        onValidity: v[9] || (v[9] = (p) => l("validity", "when", p))
      }, null, 8, ["draft", "board-id", "model-value"]),
      b(ht, {
        label: "Set values",
        "model-value": e.transition.set,
        shape: "array",
        "onUpdate:modelValue": v[10] || (v[10] = (p) => e.transition.set = p),
        onValidity: v[11] || (v[11] = (p) => l("validity", "set", p))
      }, null, 8, ["model-value"]),
      b(ht, {
        label: "Guards",
        "model-value": e.transition.guards,
        shape: "array",
        "onUpdate:modelValue": v[12] || (v[12] = (p) => e.transition.guards = p),
        onValidity: v[13] || (v[13] = (p) => l("validity", "guards", p))
      }, null, 8, ["model-value"])
    ]));
  }
}), Sa = /* @__PURE__ */ ge({
  __name: "CapacityControl",
  props: {
    draft: {},
    state: {},
    label: {},
    hard: { type: Boolean }
  },
  setup(e) {
    const a = e, t = H(() => a.draft.policy?.wip?.[a.state]);
    function l(u) {
      if (u === null) {
        a.draft.policy?.wip && delete a.draft.policy.wip[a.state];
        return;
      }
      const f = a.draft.policy ??= {}, v = f.wip ??= {};
      v[a.state] = { ...v[a.state], limit: u };
    }
    function i(u) {
      t.value && (t.value.hard = u);
    }
    return (u, f) => e.hard ? (c(), W(r(Ge), {
      key: 0,
      "aria-label": e.label,
      disabled: !t.value,
      "model-value": t.value?.hard ?? !1,
      "onUpdate:modelValue": i
    }, null, 8, ["aria-label", "disabled", "model-value"])) : (c(), W(r(_e), {
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
async function Ga(e, a) {
  try {
    const { data: t } = await Go.get(e, a ? { params: a } : void 0);
    if (!t?.success) {
      const l = t?.message || (typeof t?.error == "string" ? t.error : t?.error?.message) || "Could not read published Flow.";
      throw new Ja({ message: l, details: t?.details }, "Published Flow");
    }
    return t;
  } catch (t) {
    throw Po(t, "Published Flow");
  }
}
const Pl = (e) => `/api/v1/workflows/${encodeURIComponent(e)}/versions`, al = {
  title: async (e) => (await Ga("/api/v1/workflows/published", { id: e })).item?.title,
  versions: async (e) => (await Ga(Pl(e))).versions ?? [],
  check: async (e) => {
    if ((await Ga(`${Pl(e.id)}/${e.version}`)).version?.version !== e.version) throw new Error("The published version is unavailable.");
  }
}, Jr = {
  class: "work-stack work-tight",
  "aria-label": "Stage Flow"
}, Zr = {
  key: 0,
  class: "work-muted work-small"
}, Qr = {
  key: 1,
  class: "kx-err work-alert-actions"
}, _r = { role: "alert" }, ed = ["schema", "config", "title"], td = {
  key: 3,
  class: "kx-err",
  role: "alert"
}, ad = {
  key: 4,
  class: "work-stack work-tight"
}, ld = ["value", "aria-busy", "disabled"], od = {
  value: "",
  disabled: ""
}, id = ["value"], nd = {
  key: 5,
  class: "work-muted work-small",
  role: "status"
}, sd = /* @__PURE__ */ ge({
  __name: "StageFlow",
  props: {
    modelValue: {}
  },
  emits: ["update:modelValue", "validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, i = j(!1), u = j(""), f = j([]), v = j(!1), p = j(""), o = j(!1), n = H(() => u.value || t.modelValue?.id), s = JSON.stringify({ properties: { flow_ref: { title: "Published Flow", picker: "wc-workflow-picker" } } }), h = H(() => JSON.stringify(t.modelValue ? { flow_ref: t.modelValue } : {}));
    let m = 0;
    async function k() {
      i.value = await pt("wc-workflow-picker");
    }
    k();
    async function V() {
      const $ = ++m, C = n.value, D = t.modelValue;
      if (v.value = !!C, p.value = "", f.value = [], !!C)
        try {
          const [X] = await Promise.all([al.versions(C), !o.value && D ? al.check(D) : Promise.resolve()]);
          if ($ !== m) return;
          if (f.value = X.filter((te) => Number.isInteger(te.version) && te.version > 0), !o.value && D && !f.value.some((te) => te.version === D.version)) throw new Error("The published version is unavailable.");
        } catch (X) {
          $ === m && (p.value = Ye(X, "Could not read published Flow."));
        } finally {
          $ === m && (v.value = !1);
        }
    }
    Ue([n, () => t.modelValue?.version, o], V, { immediate: !0 }), Ue(o, ($) => l("validity", !$), { immediate: !0 });
    function P($) {
      const C = $.detail?.flow_ref;
      C?.kind !== "flow" || !C.id || (o.value = !0, u.value = C.id);
    }
    function x($) {
      !n.value || !f.value.some((C) => C.version === $) || (l("update:modelValue", { kind: "flow", id: n.value, version: $ }), o.value = !1, u.value = "");
    }
    function T() {
      l("update:modelValue", void 0), o.value = !1, u.value = "";
    }
    return yt(() => {
      m++, l("validity", !0);
    }), ($, C) => (c(), y("section", Jr, [
      C[4] || (C[4] = d("h4", { class: "work-field-label" }, "What runs", -1)),
      e.modelValue ? I("", !0) : (c(), y("p", Zr, "No Flow bound. This stage keeps its existing external execution contract.")),
      p.value ? (c(), y("div", Qr, [
        d("p", _r, [
          F(U(o.value ? "Flow versions unavailable" : "Flow binding unavailable"), 1),
          !o.value && e.modelValue ? (c(), y(Z, { key: 0 }, [
            F(" (v" + U(e.modelValue.version) + ")", 1)
          ], 64)) : I("", !0),
          F(". " + U(p.value), 1)
        ]),
        b(r(J), {
          label: "Reload Flow",
          severity: "secondary",
          text: "",
          onClick: V
        })
      ])) : I("", !0),
      i.value ? (c(), y("wc-workflow-picker", {
        key: 2,
        schema: r(s),
        config: h.value,
        title: e.modelValue?.id,
        onChange: P
      }, null, 40, ed)) : (c(), y("p", td, [
        C[2] || (C[2] = F("Published Flow picker unavailable.", -1)),
        b(r(J), {
          label: "Reload Flow picker",
          text: "",
          severity: "secondary",
          onClick: k
        })
      ])),
      n.value ? (c(), y("label", ad, [
        C[3] || (C[3] = F(" Published version ", -1)),
        d("select", {
          class: "p-inputtext work-flow-version",
          value: o.value ? "" : e.modelValue?.version,
          "aria-busy": v.value,
          disabled: v.value || !!p.value,
          onChange: C[0] || (C[0] = (D) => x(Number(D.target.value)))
        }, [
          d("option", od, U(v.value ? "Loading versions…" : "Choose a published version"), 1),
          (c(!0), y(Z, null, re(f.value, (D) => (c(), y("option", {
            key: D.version,
            value: D.version
          }, "v" + U(D.version), 9, id))), 128))
        ], 40, ld)
      ])) : I("", !0),
      o.value ? (c(), y("p", nd, "Choose a published version to finish selecting the Flow.")) : I("", !0),
      e.modelValue || o.value ? (c(), W(r(J), {
        key: 6,
        label: o.value ? "Cancel Flow selection" : "Remove Flow binding",
        "aria-label": o.value ? "Cancel Flow selection" : "Remove Flow binding",
        severity: "secondary",
        text: "",
        onClick: C[1] || (C[1] = (D) => o.value ? (o.value = !1, u.value = "") : T())
      }, null, 8, ["label", "aria-label"])) : I("", !0)
    ]));
  }
}), ll = { seconds: 1, minutes: 60, hours: 3600, days: 86400 };
function Zt(e, a) {
  const t = /^P(\d+)W$/.exec(e), l = /^P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+\.?\d*)S)?)?$/.exec(e);
  if (!t && (!l || e === "P" || e.endsWith("T"))) return;
  const i = t ? Number(t[1]) * 604800 : Number(l[1] ?? 0) * 86400 + Number(l[2] ?? 0) * 3600 + Number(l[3] ?? 0) * 60 + Number(l[4] ?? 0);
  if (!Number.isFinite(i) || i <= 0) return;
  const u = a ?? (i % 86400 === 0 ? "days" : i % 3600 === 0 ? "hours" : i < 60 ? "seconds" : "minutes");
  return { amount: i / ll[u], unit: u };
}
function rd(e, a) {
  if (e == null) return;
  if (!Number.isFinite(e * ll[a]) || e <= 0) throw new Error("Enter a positive duration.");
  const t = (i) => i.toLocaleString("en-US", { useGrouping: !1, maximumSignificantDigits: 21 });
  if (!Number.isInteger(e)) return `PT${t(e * ll[a])}S`;
  const l = { seconds: "S", minutes: "M", hours: "H", days: "D" }[a];
  return (a === "days" ? "P" : "PT") + t(e) + l;
}
const dd = { class: "work-stack work-tight" }, ud = {
  key: 0,
  class: "work-error",
  role: "alert"
}, Tt = /* @__PURE__ */ ge({
  __name: "DurationControl",
  props: {
    modelValue: {},
    label: {},
    disabled: { type: Boolean }
  },
  emits: ["update:modelValue", "validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, i = "duration:" + ol(), u = j(), f = j(""), v = H(() => t.modelValue ? Zt(t.modelValue) : void 0), p = H(() => u.value ?? v.value?.unit ?? "days");
    Ue(() => t.modelValue, (x) => {
      f.value = "", l("validity", !x || !!v.value, i);
    }, { immediate: !0 });
    const o = H(() => t.modelValue ? Zt(t.modelValue, p.value)?.amount ?? null : null);
    function n(x) {
      try {
        const T = rd(x, p.value);
        f.value = "", l("update:modelValue", T), l("validity", !0, i);
      } catch (T) {
        f.value = T.message, l("validity", !1, i);
      }
    }
    let s;
    function h(x) {
      x.target instanceof HTMLInputElement && (s = x.target.value);
    }
    function m(x) {
      if (s === void 0) return;
      const T = s;
      s = void 0, V(x, T);
    }
    function k(x) {
      s = void 0;
      const T = x.originalEvent?.target instanceof HTMLInputElement ? x.originalEvent.target.value : x.formattedValue;
      V(x.value, T);
    }
    function V(x, T) {
      if (T.trim() && (typeof x != "number" || !Number.isFinite(x))) {
        f.value = "Enter a positive duration.", l("validity", !1, i);
        return;
      }
      u.value = p.value, n(typeof x == "number" ? x : null);
    }
    function P(x) {
      const T = o.value;
      u.value = x, !(t.modelValue && !v.value) && n(T);
    }
    return yt(() => l("validity", !0, i)), (x, T) => (c(), y("label", dd, [
      F(U(e.label), 1),
      d("span", {
        class: "work-duration-control",
        style: { "max-width": "360px" },
        onInputCapture: h
      }, [
        b(r(_e), {
          "model-value": o.value,
          "aria-label": e.label,
          min: 0,
          "aria-invalid": !!f.value || !!e.modelValue && !r(Zt)(e.modelValue),
          disabled: e.disabled,
          useGrouping: !1,
          "max-fraction-digits": p.value === "seconds" ? 20 : 3,
          onInput: k,
          "onUpdate:modelValue": m
        }, null, 8, ["model-value", "aria-label", "aria-invalid", "disabled", "max-fraction-digits"]),
        b(r(ue), {
          "model-value": p.value,
          "aria-label": e.label + " unit",
          disabled: e.disabled,
          options: [{ label: "Seconds", value: "seconds" }, { label: "Minutes", value: "minutes" }, { label: "Hours", value: "hours" }, { label: "Days", value: "days" }],
          optionLabel: "label",
          optionValue: "value",
          appendTo: "self",
          "onUpdate:modelValue": T[0] || (T[0] = ($) => P($))
        }, null, 8, ["model-value", "aria-label", "disabled"])
      ], 32),
      f.value || e.modelValue && !r(Zt)(e.modelValue) ? (c(), y("span", ud, U(f.value || `Unsupported duration: ${e.modelValue}`), 1)) : I("", !0)
    ]));
  }
}), cd = { class: "work-stack" }, vd = { class: "work-settings-grid" }, md = { class: "work-stack work-tight" }, fd = { class: "work-stack work-tight" }, pd = {
  key: 1,
  class: "work-stack work-tight"
}, bd = { class: "work-stack work-tight" }, hd = { class: "work-settings-grid" }, yd = { class: "work-row" }, gd = { class: "work-stack work-tight" }, kd = {
  key: 0,
  class: "work-stack work-tight"
}, wd = /* @__PURE__ */ ge({
  __name: "TimersEditor",
  props: {
    state: {},
    draft: {}
  },
  emits: ["validity"],
  setup(e, { emit: a }) {
    const t = e, l = a;
    function i() {
      return t.state.timers ?? [];
    }
    function u() {
      const o = t.state.timers ?? (t.state.timers = []);
      o.push({ id: Ct("timer", o), after: "P1D", then: { emit: "reminder" } });
    }
    function f(o, n) {
      delete o.after, delete o.at_field, n === "after" ? o.after = "P1D" : o.at_field = "";
    }
    function v(o, n, s) {
      s ? o[n] = s : (delete o[n], delete o.table);
    }
    function p(o, n) {
      o.then = n === "emit" ? { emit: "" } : { transition: "" };
    }
    return (o, n) => (c(), y("section", cd, [
      n[8] || (n[8] = d("h4", null, "Timers", -1)),
      (c(!0), y(Z, null, re(i(), (s, h) => (c(), y("article", {
        key: s.id,
        class: "work-settings-card work-stack"
      }, [
        d("div", vd, [
          d("label", md, [
            n[2] || (n[2] = F("Timer ID", -1)),
            b(r(be), {
              modelValue: s.id,
              "onUpdate:modelValue": (m) => s.id = m,
              required: "",
              pattern: "[a-z][a-z0-9_]*"
            }, null, 8, ["modelValue", "onUpdate:modelValue"])
          ]),
          d("label", fd, [
            n[3] || (n[3] = F("Deadline", -1)),
            b(r(ue), {
              "model-value": s.at_field !== void 0 ? "at_field" : "after",
              "onUpdate:modelValue": (m) => f(s, m),
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
          s.after !== void 0 ? (c(), W(Tt, {
            key: 0,
            modelValue: s.after,
            "onUpdate:modelValue": (m) => s.after = m,
            label: "After",
            onValidity: n[0] || (n[0] = (m, k) => l("validity", k, m))
          }, null, 8, ["modelValue", "onUpdate:modelValue"])) : (c(), y("label", pd, [
            n[4] || (n[4] = F("At field", -1)),
            b(r(ue), {
              modelValue: s.at_field,
              "onUpdate:modelValue": (m) => s.at_field = m,
              appendTo: "self",
              optionLabel: "label",
              optionValue: "value",
              optionDisabled: "disabled",
              options: [
                ...(e.draft.fields?.filter((m) => m.form === "time") ?? []).map((m) => ({
                  label: m.code,
                  value: m.code,
                  disabled: !1
                }))
              ]
            }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
          ])),
          d("label", bd, [
            n[5] || (n[5] = F("Duration by field", -1)),
            b(r(ue), {
              "model-value": s.by ?? "",
              "onUpdate:modelValue": (m) => v(s, "by", m),
              appendTo: "self",
              optionLabel: "label",
              optionValue: "value",
              optionDisabled: "disabled",
              options: [
                { label: "Fixed duration", value: "", disabled: !1 },
                ...(e.draft.fields ?? []).map((m) => ({
                  label: m.code,
                  value: m.code,
                  disabled: !1
                }))
              ]
            }, null, 8, ["model-value", "onUpdate:modelValue", "options"])
          ])
        ]),
        s.by ? (c(), W(ht, {
          key: 0,
          label: "Duration table",
          hint: "Map field values to ISO durations.",
          "model-value": s.table,
          shape: "object",
          "onUpdate:modelValue": (m) => s.table = m,
          onValidity: (m) => l("validity", "table-" + h, m)
        }, null, 8, ["model-value", "onUpdate:modelValue", "onValidity"])) : I("", !0),
        d("div", hd, [
          b(Tt, {
            modelValue: s.repeat,
            "onUpdate:modelValue": (m) => s.repeat = m,
            label: "Repeat every",
            onValidity: n[1] || (n[1] = (m, k) => l("validity", k, m)),
            disabled: s.interrupting
          }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"]),
          d("label", yd, [
            b(r(jt), {
              modelValue: s.interrupting,
              "onUpdate:modelValue": [(m) => s.interrupting = m, (m) => s.interrupting && delete s.repeat],
              binary: ""
            }, null, 8, ["modelValue", "onUpdate:modelValue"]),
            n[6] || (n[6] = F("Interrupting", -1))
          ]),
          d("label", gd, [
            n[7] || (n[7] = F("Then", -1)),
            b(r(ue), {
              "model-value": s.then?.transition !== void 0 ? "transition" : "emit",
              "onUpdate:modelValue": (m) => p(s, m),
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
          s.then ? (c(), y("label", kd, [
            F(U(s.then.transition !== void 0 ? "Transition ID" : "Event name"), 1),
            s.then.transition !== void 0 ? (c(), W(r(be), {
              key: 0,
              modelValue: s.then.transition,
              "onUpdate:modelValue": (m) => s.then.transition = m
            }, null, 8, ["modelValue", "onUpdate:modelValue"])) : (c(), W(r(be), {
              key: 1,
              modelValue: s.then.emit,
              "onUpdate:modelValue": (m) => s.then.emit = m
            }, null, 8, ["modelValue", "onUpdate:modelValue"]))
          ])) : I("", !0)
        ]),
        b(r(J), {
          severity: "secondary",
          onClick: (m) => i().splice(h, 1),
          "aria-label": "Remove timer",
          text: "",
          size: "small"
        }, {
          default: L(() => [
            b(r(le), {
              icon: "tabler:trash",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        }, 8, ["onClick"])
      ]))), 128)),
      b(r(J), {
        label: "Add timer",
        severity: "secondary",
        onClick: u,
        outlined: ""
      }, {
        icon: L(() => [
          b(r(le), {
            icon: "tabler:plus",
            "aria-hidden": "true"
          })
        ]),
        _: 1
      })
    ]));
  }
}), Vd = ["aria-label"], $d = { class: "work-stack work-tight" }, xd = {
  key: 0,
  class: "work-stack work-tight"
}, Cd = /* @__PURE__ */ ge({
  __name: "PrincipalSourceEditor",
  props: {
    modelValue: {},
    draft: {},
    boardId: {},
    label: {}
  },
  emits: ["update:modelValue", "validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, i = H(() => Array.isArray(t.modelValue) ? "principals" : "field" in t.modelValue ? "field" : "group"), u = H(() => Array.isArray(t.modelValue) ? t.modelValue : "group" in t.modelValue && t.modelValue.group ? [{ kind: "group", id: t.modelValue.group }] : []);
    function f(p) {
      l("update:modelValue", p === "field" ? { field: "" } : p === "group" ? { group: "" } : []);
    }
    function v(p) {
      l("update:modelValue", i.value === "group" ? { group: p.at(-1)?.id ?? "" } : p);
    }
    return jl(() => l("validity", Array.isArray(t.modelValue) ? t.modelValue.length > 0 : "field" in t.modelValue ? !!t.modelValue.field : !!t.modelValue.group)), yt(() => l("validity", !0)), (p, o) => (c(), y("section", {
      class: "work-stack work-tight",
      "aria-label": e.label
    }, [
      d("label", $d, [
        F(U(e.label) + " source", 1),
        b(r(ue), {
          "model-value": i.value,
          "aria-label": e.label + " source",
          options: [{ label: "Group", value: "group" }, { label: "People and groups", value: "principals" }, { label: "Principal field", value: "field" }],
          optionLabel: "label",
          optionValue: "value",
          appendTo: "self",
          "onUpdate:modelValue": f
        }, null, 8, ["model-value", "aria-label"])
      ]),
      "field" in e.modelValue ? (c(), y("label", xd, [
        o[1] || (o[1] = F("Principal field", -1)),
        b(r(ue), {
          "model-value": e.modelValue.field,
          "aria-label": e.label + " field",
          options: e.draft.fields?.filter((n) => n.type === "principal").map((n) => ({ label: n.title || n.code, value: n.code })) ?? [],
          optionLabel: "label",
          optionValue: "value",
          appendTo: "self",
          "onUpdate:modelValue": o[0] || (o[0] = (n) => l("update:modelValue", { field: n }))
        }, null, 8, ["model-value", "aria-label", "options"])
      ])) : (c(), W(dl, {
        key: 1,
        "board-id": e.boardId,
        label: e.label,
        kinds: i.value === "group" ? "group" : "user,group,service",
        "model-value": u.value,
        "onUpdate:modelValue": v
      }, null, 8, ["board-id", "label", "kinds", "model-value"]))
    ], 8, Vd));
  }
}), Sd = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, Td = {
  class: "work-stack work-tight",
  "aria-label": "Approval sources"
}, Dd = { class: "work-row" }, Id = {
  key: 0,
  class: "work-stack work-tight"
}, Ud = ["kinds", "value"], Ed = {
  key: 2,
  class: "work-muted work-small",
  role: "status"
}, Ad = {
  key: 3,
  class: "work-chips"
}, Pd = { class: "work-row work-small" }, Rd = { class: "work-process-options" }, Od = { class: "work-stack work-tight" }, Nd = {
  key: 4,
  class: "work-error work-small",
  role: "alert"
}, Md = {
  key: 5,
  class: "work-muted work-small"
}, Fd = /* @__PURE__ */ ge({
  __name: "ApproversEditor",
  props: {
    approvals: {},
    boardId: {}
  },
  emits: ["validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, { principalLabel: i, rememberPrincipal: u, nameError: f } = ql(() => t.boardId ?? "", () => Array.isArray(t.approvals.from) ? t.approvals.from : "group" in t.approvals.from ? [{ kind: "group", id: t.approvals.from.group }] : []), v = j(!1), p = H(() => Array.isArray(t.approvals.from) ? "principals" : "field" in t.approvals.from ? "field" : "group"), o = H(() => Array.isArray(t.approvals.from) ? t.approvals.from.some((m) => m.kind === "group") || t.approvals.from.length >= t.approvals.min : "field" in t.approvals.from ? !!t.approvals.from.field : !!t.approvals.from.group);
    jl(() => l("validity", Number.isSafeInteger(t.approvals.min) && t.approvals.min > 0 && o.value)), yt(() => l("validity", !0)), Ta(async () => {
      v.value = await pt("wc-principal-picker");
    });
    function n(m) {
      t.approvals.from = m === "group" ? { group: "" } : m === "field" ? { field: "" } : [];
    }
    function s(m) {
      const k = m.detail, V = k?.principal_id ?? k?.id;
      if (p.value === "group") {
        t.approvals.from = { group: V ?? "" };
        return;
      }
      if (!V || !Array.isArray(t.approvals.from)) return;
      const P = { kind: k.type ?? k.kind ?? "user", id: V };
      k.label && u(P, k.label), t.approvals.from.some((x) => x.id === V && x.kind === P.kind) || t.approvals.from.push(P);
    }
    function h(m) {
      Array.isArray(t.approvals.from) && t.approvals.from.splice(m, 1);
    }
    return (m, k) => (c(), y(Z, null, [
      r(f) ? (c(), y("p", Sd, U(r(f)), 1)) : I("", !0),
      d("section", Td, [
        d("label", Dd, [
          k[4] || (k[4] = d("span", { class: "work-spacer" }, "Approvals needed", -1)),
          b(r(_e), {
            modelValue: e.approvals.min,
            "onUpdate:modelValue": k[0] || (k[0] = (V) => e.approvals.min = V),
            min: 1,
            required: "",
            useGrouping: !1
          }, null, 8, ["modelValue"])
        ]),
        k[9] || (k[9] = d("span", { class: "work-field-label" }, "Approvers", -1)),
        "field" in e.approvals.from ? (c(), y("label", Id, [
          k[5] || (k[5] = F("Principal field", -1)),
          b(r(be), {
            modelValue: e.approvals.from.field,
            "onUpdate:modelValue": k[1] || (k[1] = (V) => e.approvals.from.field = V),
            "aria-label": "Principal field"
          }, null, 8, ["modelValue"])
        ])) : v.value ? (c(), y("wc-principal-picker", {
          key: p.value,
          kinds: p.value === "group" ? "group" : "user,group,service",
          value: JSON.stringify("group" in e.approvals.from ? { type: "group", principal_id: e.approvals.from.group } : {}),
          onConfigChanged: s
        }, null, 40, Ud)) : (c(), y("p", Ed, "The principal picker is unavailable.")),
        Array.isArray(e.approvals.from) ? (c(), y("div", Ad, [
          (c(!0), y(Z, null, re(e.approvals.from, (V, P) => (c(), W(r(Le), {
            key: V.kind + ":" + V.id,
            class: "kx-tag-sm",
            severity: "secondary"
          }, {
            default: L(() => [
              F(U(r(i)(V)), 1),
              b(r(J), {
                "aria-label": "Remove approver " + (P + 1),
                text: "",
                severity: "secondary",
                size: "small",
                onClick: (x) => h(P)
              }, {
                default: L(() => [
                  b(r(le), {
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
        d("label", Pd, [
          k[6] || (k[6] = d("span", { class: "work-spacer" }, "The person who moves the item here cannot approve this visit", -1)),
          b(r(Ge), {
            modelValue: e.approvals.prevent_self,
            "onUpdate:modelValue": k[2] || (k[2] = (V) => e.approvals.prevent_self = V),
            "aria-label": "The person who moves the item here cannot approve this visit"
          }, null, 8, ["modelValue"])
        ]),
        d("details", Rd, [
          k[8] || (k[8] = d("summary", null, "Approval options", -1)),
          d("label", Od, [
            k[7] || (k[7] = F("Approval source", -1)),
            b(r(ue), {
              "model-value": p.value,
              "onUpdate:modelValue": k[3] || (k[3] = (V) => n(V)),
              appendTo: "self",
              optionLabel: "label",
              optionValue: "value",
              options: [{ label: "Group members", value: "group" }, { label: "People and groups", value: "principals" }, { label: "Principal field", value: "field" }]
            }, null, 8, ["model-value"])
          ])
        ]),
        Array.isArray(e.approvals.from) && !o.value ? (c(), y("p", Nd, "Select at least " + U(e.approvals.min) + " distinct principals, or lower the minimum.", 1)) : "group" in e.approvals.from && !e.approvals.from.group ? (c(), y("p", Md, "Choose the group that can approve this state.")) : I("", !0)
      ])
    ], 64));
  }
}), Ld = {
  class: "work-state-settings work-stack",
  "aria-label": "State settings"
}, zd = { class: "work-process-kind" }, Bd = { class: "work-process-options" }, jd = { class: "work-stack" }, qd = { class: "work-row" }, Wd = { class: "work-stack work-tight" }, Kd = { class: "work-row" }, Gd = { class: "work-stack work-tight" }, Hd = { class: "work-row" }, Yd = { class: "work-row" }, Xd = { class: "work-stack work-tight" }, Jd = { class: "work-row" }, Zd = { class: "work-stack work-tight" }, Qd = { class: "work-stack work-tight" }, _d = {
  key: 0,
  class: "work-row"
}, eu = { class: "work-row" }, tu = { class: "work-row" }, au = { class: "work-stack work-tight" }, lu = { class: "work-row" }, ou = /* @__PURE__ */ ge({
  __name: "StateSettings",
  props: {
    state: {},
    process: {},
    draft: {},
    boardId: {}
  },
  emits: ["validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, i = H(() => (t.process.transitions ?? []).filter((p) => p.from === "any" || p.from.includes(t.state.id))), u = [{ value: "human", icon: "user" }, { value: "gate", icon: "shield-check" }, { value: "automated", icon: "bolt" }, { value: "parallel", icon: "arrows-split" }];
    function f(p) {
      const o = t.state;
      o.kind = p, delete o.run, delete o.release_when, delete o.regions, delete o.join, delete o.due, (p === "automated" || p === "gate") && delete o.awaiting, p === "automated" && (o.run = { stage: o.id, retry: { max: 1, backoff: "PT1M" } }), p === "gate" && (o.release_when = { approvals: { min: 1, from: { group: "" }, prevent_self: !0 } }), p === "parallel" && (o.regions = [{ id: "region_1", initial: t.process.states.find((n) => n.id !== o.id)?.id ?? "" }], o.join = "all");
    }
    function v(p) {
      t.state.run && (p ? t.state.run.on_fail = p : delete t.state.run.on_fail);
    }
    return (p, o) => (c(), y("section", Ld, [
      o[52] || (o[52] = d("h4", { class: "work-process-group" }, "Who moves the item on", -1)),
      b(r(sl), {
        class: "work-process-kinds",
        "model-value": e.state.kind ?? "human",
        options: u.map((n) => ({
          ...n,
          label: r(ga)(n.value)
        })),
        optionLabel: "label",
        optionValue: "value",
        optionDisabled: "disabled",
        "allow-empty": !1,
        "aria-label": "Who moves the item on",
        "onUpdate:modelValue": f
      }, {
        option: L(({ option: n }) => [
          d("span", zd, [
            b(r(le), {
              icon: "tabler:" + n.icon
            }, null, 8, ["icon"]),
            d("span", null, U(n.label), 1)
          ])
        ]),
        _: 1
      }, 8, ["model-value", "options"]),
      e.state.kind === "gate" && e.state.release_when ? (c(), y(Z, { key: 0 }, [
        o[33] || (o[33] = d("h4", { class: "work-process-group" }, "Approval", -1)),
        e.state.release_when.approvals ? (c(), W(Fd, {
          key: 0,
          "board-id": e.boardId,
          approvals: e.state.release_when.approvals,
          onValidity: o[0] || (o[0] = (n) => l("validity", "approvers", n))
        }, null, 8, ["board-id", "approvals"])) : I("", !0),
        d("details", Bd, [
          o[32] || (o[32] = d("summary", null, "Release options", -1)),
          d("div", jd, [
            d("label", qd, [
              o[31] || (o[31] = d("span", { class: "work-spacer" }, "Require approvals", -1)),
              b(r(Ge), {
                "model-value": !!e.state.release_when.approvals,
                "aria-label": "Require approvals",
                "onUpdate:modelValue": o[1] || (o[1] = (n) => e.state.release_when.approvals = n ? { min: 1, from: { group: "" }, prevent_self: !0 } : void 0)
              }, null, 8, ["model-value"])
            ]),
            b(Tt, {
              modelValue: e.state.release_when.wait,
              "onUpdate:modelValue": o[2] || (o[2] = (n) => e.state.release_when.wait = n),
              label: "Wait before release",
              onValidity: o[3] || (o[3] = (n, s) => l("validity", s, n))
            }, null, 8, ["modelValue"]),
            b(rl, {
              label: "Release when",
              draft: e.draft,
              "board-id": e.boardId,
              modelValue: e.state.release_when.when,
              "onUpdate:modelValue": o[4] || (o[4] = (n) => e.state.release_when.when = n),
              onValidity: o[5] || (o[5] = (n) => l("validity", "release", n))
            }, null, 8, ["draft", "board-id", "modelValue"])
          ])
        ])
      ], 64)) : I("", !0),
      e.state.kind === "automated" && e.state.run ? (c(), y(Z, { key: 1 }, [
        o[40] || (o[40] = d("h4", { class: "work-process-group" }, "Automation", -1)),
        d("label", Wd, [
          o[34] || (o[34] = F("Run label", -1)),
          b(r(be), {
            modelValue: e.state.run.stage,
            "onUpdate:modelValue": o[6] || (o[6] = (n) => e.state.run.stage = n),
            "aria-label": "Run label",
            required: ""
          }, null, 8, ["modelValue"])
        ]),
        b(sd, {
          modelValue: e.state.run.flow_ref,
          "onUpdate:modelValue": o[7] || (o[7] = (n) => e.state.run.flow_ref = n),
          onValidity: o[8] || (o[8] = (n) => l("validity", "flow", n))
        }, null, 8, ["modelValue"]),
        b(Tt, {
          modelValue: e.state.run.timeout,
          "onUpdate:modelValue": o[9] || (o[9] = (n) => e.state.run.timeout = n),
          label: "Attempt timeout",
          onValidity: o[10] || (o[10] = (n, s) => l("validity", s, n))
        }, null, 8, ["modelValue"]),
        o[41] || (o[41] = d("small", { class: "work-muted" }, "Blank uses the board timeout, or one hour.", -1)),
        d("label", Kd, [
          o[35] || (o[35] = d("span", { class: "work-spacer" }, "Maximum visits", -1)),
          b(r(_e), {
            "model-value": e.state.run.max_visits ?? null,
            "aria-label": "Maximum visits",
            min: 1,
            useGrouping: !1,
            placeholder: "Board default",
            "onUpdate:modelValue": o[11] || (o[11] = (n) => e.state.run.max_visits = n ?? void 0)
          }, null, 8, ["model-value"])
        ]),
        d("label", Gd, [
          o[36] || (o[36] = F("When visits are exhausted", -1)),
          b(r(ue), {
            "model-value": e.state.run.on_exhausted,
            "aria-label": "When visits are exhausted",
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            showClear: "",
            options: (e.process.transitions ?? []).filter((n) => !n.auto).map((n) => ({ label: r(Me)(n), value: n.id })),
            "onUpdate:modelValue": o[12] || (o[12] = (n) => e.state.run.on_exhausted = n || void 0)
          }, null, 8, ["model-value", "options"])
        ]),
        o[42] || (o[42] = d("small", { class: "work-muted" }, "Blank records a failed run and stops automation. A route must leave every incoming state or be global.", -1)),
        d("label", Hd, [
          o[37] || (o[37] = d("span", { class: "work-spacer" }, "Retry if it fails", -1)),
          b(r(Ge), {
            "model-value": !!e.state.run.retry,
            "aria-label": "Retry if it fails",
            "onUpdate:modelValue": o[13] || (o[13] = (n) => e.state.run.retry = n ? { max: 1, backoff: "PT1M" } : void 0)
          }, null, 8, ["model-value"])
        ]),
        e.state.run.retry ? (c(), y(Z, { key: 0 }, [
          d("label", Yd, [
            o[38] || (o[38] = d("span", { class: "work-spacer" }, "Maximum attempts", -1)),
            b(r(_e), {
              modelValue: e.state.run.retry.max,
              "onUpdate:modelValue": o[14] || (o[14] = (n) => e.state.run.retry.max = n),
              min: 1,
              useGrouping: !1
            }, null, 8, ["modelValue"])
          ]),
          b(Tt, {
            modelValue: e.state.run.retry.backoff,
            "onUpdate:modelValue": o[15] || (o[15] = (n) => e.state.run.retry.backoff = n),
            label: "Wait between attempts",
            onValidity: o[16] || (o[16] = (n, s) => l("validity", s, n))
          }, null, 8, ["modelValue"])
        ], 64)) : I("", !0),
        (c(), y(Z, null, re([{ key: "on_pass", label: "On success" }, { key: "on_cancel", label: "On cancellation" }], (n) => d("label", {
          key: n.key,
          class: "work-stack work-tight"
        }, [
          F(U(n.label), 1),
          b(r(ue), {
            "model-value": e.state.run[n.key],
            "aria-label": n.label,
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            showClear: "",
            options: i.value.map((s) => ({ label: r(Me)(s), value: s.id })),
            "onUpdate:modelValue": (s) => e.state.run[n.key] = s || void 0
          }, null, 8, ["model-value", "aria-label", "options", "onUpdate:modelValue"])
        ])), 64)),
        d("label", Xd, [
          o[39] || (o[39] = F("If it fails, go to", -1)),
          b(r(ue), {
            "model-value": e.state.run.on_fail,
            "onUpdate:modelValue": v,
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            showClear: "",
            options: i.value.map((n) => ({
              label: r(Me)(n) + " → " + r(pe)(e.process.states.find((s) => s.id === n.to)),
              value: n.id
            }))
          }, null, 8, ["model-value", "options"])
        ])
      ], 64)) : I("", !0),
      e.state.kind === "parallel" && e.state.regions ? (c(), y(Z, { key: 2 }, [
        o[47] || (o[47] = d("h4", { class: "work-process-group" }, "Lanes", -1)),
        (c(!0), y(Z, null, re(e.state.regions, (n, s) => (c(), y("div", {
          key: s,
          class: "work-process-value work-stack work-tight"
        }, [
          d("div", Jd, [
            d("span", null, "Lane " + U(s + 1), 1),
            o[43] || (o[43] = d("span", { class: "work-spacer" }, null, -1)),
            b(r(J), {
              severity: "danger",
              text: "",
              size: "small",
              "aria-label": "Remove lane",
              onClick: (h) => e.state.regions.splice(s, 1)
            }, {
              default: L(() => [
                b(r(le), { icon: "tabler:trash" })
              ]),
              _: 1
            }, 8, ["onClick"])
          ]),
          d("label", Zd, [
            o[44] || (o[44] = F("Starts at", -1)),
            b(r(ue), {
              modelValue: n.initial,
              "onUpdate:modelValue": (h) => n.initial = h,
              appendTo: "self",
              optionLabel: "label",
              optionValue: "value",
              options: e.process.states.filter((h) => h.id !== e.state.id).map((h) => ({ label: r(pe)(h), value: h.id }))
            }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
          ])
        ]))), 128)),
        b(r(J), {
          label: "Add lane",
          severity: "secondary",
          outlined: "",
          size: "small",
          onClick: o[17] || (o[17] = (n) => e.state.regions.push({
            id: r(Ct)("region", e.state.regions),
            initial: e.process.states.find((s) => s.id !== e.state.id)?.id ?? ""
          }))
        }, {
          icon: L(() => [
            b(r(le), { icon: "tabler:plus" })
          ]),
          _: 1
        }),
        d("label", Qd, [
          o[45] || (o[45] = F("Finish rule", -1)),
          b(r(ue), {
            "model-value": typeof e.state.join == "number" ? "count" : e.state.join ?? "all",
            appendTo: "self",
            options: [
              { label: "All must pass", value: "all" },
              { label: "Any may pass", value: "any" },
              { label: "A number must pass", value: "count" }
            ],
            optionLabel: "label",
            optionValue: "value",
            "onUpdate:modelValue": o[18] || (o[18] = (n) => e.state.join = n === "count" ? 1 : n)
          }, null, 8, ["model-value"])
        ]),
        typeof e.state.join == "number" ? (c(), y("label", _d, [
          o[46] || (o[46] = d("span", { class: "work-spacer" }, "Lanes needed", -1)),
          b(r(_e), {
            modelValue: e.state.join,
            "onUpdate:modelValue": o[19] || (o[19] = (n) => e.state.join = n),
            min: 1,
            max: e.state.regions.length,
            useGrouping: !1
          }, null, 8, ["modelValue", "max"])
        ])) : I("", !0)
      ], 64)) : I("", !0),
      o[53] || (o[53] = d("h4", { class: "work-process-group" }, "Limit", -1)),
      d("label", eu, [
        o[48] || (o[48] = d("span", { class: "work-spacer" }, "Items allowed here", -1)),
        b(Sa, {
          draft: e.draft,
          state: e.state.id,
          label: "Items allowed here"
        }, null, 8, ["draft", "state"])
      ]),
      d("label", tu, [
        o[49] || (o[49] = d("span", { class: "work-spacer" }, [
          F("Refuse moves over the limit"),
          d("small", { class: "work-muted work-block" }, "Off only warns")
        ], -1)),
        b(Sa, {
          draft: e.draft,
          state: e.state.id,
          label: "Refuse moves over the limit",
          hard: ""
        }, null, 8, ["draft", "state"])
      ]),
      o[54] || (o[54] = d("h4", { class: "work-process-group" }, "Required on entry", -1)),
      b(Wt, {
        label: "Required fields",
        options: e.draft.fields?.map((n) => ({ value: n.code, label: n.title || n.code })) ?? [],
        modelValue: e.state.require,
        "onUpdate:modelValue": o[20] || (o[20] = (n) => e.state.require = n)
      }, null, 8, ["options", "modelValue"]),
      !e.state.kind || e.state.kind === "human" ? (c(), W(Tt, {
        key: 3,
        modelValue: e.state.due,
        "onUpdate:modelValue": o[21] || (o[21] = (n) => e.state.due = n),
        label: "Time allowed in this state",
        onValidity: o[22] || (o[22] = (n, s) => l("validity", s, n))
      }, null, 8, ["modelValue"])) : I("", !0),
      o[55] || (o[55] = d("h4", { class: "work-process-group" }, "Assignment and conditions", -1)),
      d("label", au, [
        o[50] || (o[50] = F("Stage label", -1)),
        b(r(be), {
          "model-value": e.state.stage,
          "aria-label": "Stage label",
          "onUpdate:modelValue": o[23] || (o[23] = (n) => e.state.stage = n || void 0)
        }, null, 8, ["model-value"])
      ]),
      !e.state.kind || e.state.kind === "human" || e.state.kind === "parallel" ? (c(), y(Z, { key: 4 }, [
        d("label", lu, [
          b(r(Ge), {
            "model-value": !!e.state.awaiting,
            "aria-label": "Awaiting people",
            "onUpdate:modelValue": o[24] || (o[24] = (n) => e.state.awaiting = n ? { group: "" } : void 0)
          }, null, 8, ["model-value"]),
          o[51] || (o[51] = F("Awaiting people", -1))
        ]),
        e.state.awaiting ? (c(), W(Cd, {
          key: 0,
          modelValue: e.state.awaiting,
          "onUpdate:modelValue": o[25] || (o[25] = (n) => e.state.awaiting = n),
          draft: e.draft,
          "board-id": e.boardId,
          label: "Awaiting",
          onValidity: o[26] || (o[26] = (n) => l("validity", "awaiting", n))
        }, null, 8, ["modelValue", "draft", "board-id"])) : I("", !0)
      ], 64)) : I("", !0),
      b(dl, {
        "board-id": e.boardId,
        modelValue: e.state.assign,
        "onUpdate:modelValue": o[27] || (o[27] = (n) => e.state.assign = n),
        label: "Assign to"
      }, null, 8, ["board-id", "modelValue"]),
      b(ht, {
        label: "State checks",
        example: ["installed-check"],
        "model-value": e.state.invariants,
        shape: "array",
        "onUpdate:modelValue": o[28] || (o[28] = (n) => e.state.invariants = n),
        onValidity: o[29] || (o[29] = (n) => l("validity", "invariants", n))
      }, null, 8, ["model-value"]),
      b(wd, {
        state: e.state,
        draft: e.draft,
        onValidity: o[30] || (o[30] = (n, s) => l("validity", "timer-" + n, s))
      }, null, 8, ["state", "draft"])
    ]));
  }
}), iu = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, nu = {
  key: 1,
  class: "work-process-title"
}, su = { class: "work-muted" }, ru = {
  key: 2,
  class: "work-map-zoom",
  role: "group",
  "aria-label": "Map zoom"
}, du = ["aria-label", "aria-keyshortcuts", "onKeydown"], uu = { class: "work-row" }, cu = { class: "work-process-meaning" }, vu = { class: "work-stack work-tight" }, mu = { class: "work-process-inspector-foot" }, fu = { class: "work-row work-transition-actions" }, pu = { class: "work-process-meaning" }, bu = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, hu = { class: "work-stack work-tight" }, yu = {
  key: 3,
  class: "work-row"
}, gu = { class: "work-stack work-tight" }, ku = { class: "work-dialog-actions" }, wu = /* @__PURE__ */ ge({
  __name: "ProcessEditor",
  props: {
    draft: {},
    guardRemoval: { type: Function },
    issues: {},
    boardId: {}
  },
  emits: ["validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, i = H(() => t.draft.processes ?? []), u = j(!1), f = j(""), v = j(""), p = j(""), o = j("Map"), n = j(""), s = j(), h = j(), m = j(), k = j(), V = j(), P = j(!1);
    let x;
    async function T() {
      P.value = !0, await da(), k.value?.querySelector('[aria-label="State name"]')?.focus();
    }
    const $ = H(() => i.value.find((Q) => Q.id === v.value) ?? i.value[0]);
    function C() {
      P.value = !1, s.value = void 0, h.value = void 0, p.value = "", x = void 0;
    }
    async function D() {
      const Q = x;
      C(), await da(), Q?.isConnected ? Q.focus() : X();
    }
    function X() {
      o.value === "Map" ? m.value?.focus() : V.value?.focus();
    }
    async function te() {
      await da(), k.value && (k.value.scrollTop = 0, k.value.focus());
    }
    function me(Q, z) {
      x = z, P.value = !1, s.value = Q, h.value = void 0, n.value = "", p.value = "", te();
    }
    function de(Q, z) {
      x = z, P.value = !1, h.value = Q, s.value = void 0, p.value = "", te();
    }
    Ue($, C);
    function G(Q) {
      Q === "__new" ? u.value = !0 : v.value = Q;
    }
    function R() {
      const Q = f.value.trim();
      if (!Q) return;
      const z = Q.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "") || "process", B = (/^[a-z]/.test(z) ? z : "process_" + z).slice(0, 40), g = i.value.some((E) => E.id === B) ? Ct(B, i.value) : B;
      (t.draft.processes ??= []).push({ id: g, name: Q, initial: "todo", states: [{ id: "todo", name: "To do", category: "unstarted" }], transitions: [] }), v.value = g, f.value = "", u.value = !1;
    }
    async function N(Q, z) {
      const B = { id: Ct("state", Q.states), name: "New state", category: "started" }, g = Ya(Q), E = g.at(-1), M = s.value ?? (E?.category === "completed" ? g.at(-2) : E), ie = M && (Q.transitions?.find((ee) => ee.default && ee.from !== "any" && ee.from.includes(M.id)) ?? Q.transitions?.find((ee) => ee.from !== "any" && ee.from.includes(M.id) && Q.states.findIndex((he) => he.id === ee.to) > Q.states.indexOf(M)));
      if (Q.states.splice(M ? Q.states.indexOf(M) + 1 : Q.states.length, 0, B), M && M.category !== "completed" && M.category !== "canceled")
        if (ie) {
          const ee = ie.to;
          ie.to = B.id, (Q.transitions ??= []).push({ id: Ct("transition", Q.transitions ?? []), name: "Continue", from: [B.id], to: ee, ...ie.auto && ie.default ? { auto: !0, default: !0 } : {} });
        } else (Q.transitions ??= []).push({ id: Ct("transition", Q.transitions ?? []), name: "Continue", from: [M.id], to: B.id });
      me(B, z), await T();
    }
    function w(Q, z, B = x) {
      const g = $.value;
      if (!g || !z || Q === z) return;
      const E = g.transitions ??= [], M = `to_${z}`;
      let ie = M.slice(0, 40), ee = 2;
      for (; E.some((S) => S.id === ie); ) {
        const S = `_${ee++}`;
        ie = M.slice(0, 40 - S.length) + S;
      }
      const he = { id: ie, name: `To ${pe(g.states.find((S) => S.id === z)).toLowerCase()}`, from: [Q], to: z };
      E.push(he), de(he, B);
    }
    function O(Q, z) {
      const B = { id: Ct("transition", Q.transitions ?? []), name: "To " + pe(Q.states.at(-1)), from: [Q.initial], to: Q.states.at(-1)?.id ?? Q.initial };
      (Q.transitions ??= []).push(B), de(B, z);
    }
    async function se(Q) {
      const z = $.value, B = z?.transitions?.indexOf(Q) ?? -1;
      if (!z || B < 0) return;
      const g = Oo(z, Q);
      if (g.length) {
        p.value = `Used by ${g.join(", ")}. Update those references first.`;
        return;
      }
      z.transitions.splice(B, 1), C(), await da(), X();
    }
    function q(Q) {
      !h.value || Q.defaultPrevented || Q.repeat || (Q.preventDefault(), se(h.value));
    }
    function $e(Q, z) {
      const B = No(Q, z);
      if (B.length) {
        p.value = `${pe(z)} is used by ${B.join(", ")}. Update these references first.`;
        return;
      }
      Q.states.splice(Q.states.indexOf(z), 1), C();
    }
    async function Ce(Q) {
      const z = t.draft.item_types?.filter((g) => g.process === Q.id).map((g) => g.title || "Untitled item type") ?? [];
      if (z.length) {
        p.value = `Used by ${z.join(", ")}. Choose a different process for those item types first.`;
        return;
      }
      const B = await t.guardRemoval?.("processes", Q.id);
      if (B) {
        p.value = B;
        return;
      }
      oa(t.draft, "processes", Q.id), v.value = "", C();
    }
    return (Q, z) => (c(), y("section", {
      class: "work-process-editor work-stack",
      "aria-label": "Process editor",
      onKeydown: z[16] || (z[16] = Ae((B) => k.value && D(), ["esc"]))
    }, [
      p.value && !h.value ? (c(), y("p", iu, U(p.value), 1)) : I("", !0),
      (c(!0), y(Z, null, re(e.issues?.filter((B) => B.code === "process " + $.value?.id) ?? [], (B) => (c(), y("p", {
        key: B.what + B.detail,
        class: "work-error work-small",
        role: "alert"
      }, U(r(Da)(B)) + " · " + U(B.what), 1))), 128)),
      $.value ? (c(), y("div", {
        key: 1,
        class: bt(["work-process-builder", { "work-process-inspecting": s.value || h.value }])
      }, [
        d("div", {
          ref_key: "tools",
          ref: V,
          class: "work-process-controls",
          role: "toolbar",
          "aria-label": "Process tools",
          tabindex: "-1"
        }, [
          i.value.length > 1 ? (c(), W(r(ue), {
            key: 0,
            "model-value": $.value.id,
            "aria-label": "Process",
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            options: [
              ...i.value.map((B) => ({ label: B.name || "Untitled process", value: B.id })),
              { label: "New process…", value: "__new" }
            ],
            "onUpdate:modelValue": G
          }, null, 8, ["model-value", "options"])) : (c(), y("span", nu, U($.value.name || "Process"), 1)),
          b(r(J), {
            label: "Add state",
            severity: "secondary",
            outlined: "",
            size: "small",
            onClick: z[0] || (z[0] = (B) => N($.value, B.currentTarget))
          }, {
            icon: L(() => [
              b(r(le), { icon: "tabler:plus" })
            ]),
            _: 1
          }),
          b(r(ue), {
            modelValue: $.value.initial,
            "onUpdate:modelValue": z[1] || (z[1] = (B) => $.value.initial = B),
            "aria-label": "Starts in " + r(pe)($.value.states.find((B) => B.id === $.value.initial)),
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            options: $.value.states.map((B) => ({ label: r(pe)(B), value: B.id }))
          }, {
            value: L(() => [
              d("span", su, "Starts in " + U(r(pe)($.value.states.find((B) => B.id === $.value.initial))), 1)
            ]),
            _: 1
          }, 8, ["modelValue", "aria-label", "options"]),
          z[17] || (z[17] = d("span", { class: "work-spacer" }, null, -1)),
          o.value === "Map" ? (c(), y("div", ru, [
            b(r(J), {
              label: "Fit",
              title: "Fit to width and show the full process",
              text: "",
              severity: "secondary",
              size: "small",
              onClick: z[2] || (z[2] = (B) => m.value?.fit())
            }, {
              icon: L(() => [
                b(r(le), { icon: "tabler:arrows-maximize" })
              ]),
              _: 1
            }),
            o.value === "Map" ? (c(), W(r(J), {
              key: 0,
              "aria-label": "Zoom out",
              title: "Zoom out",
              text: "",
              severity: "secondary",
              size: "small",
              onClick: z[3] || (z[3] = (B) => m.value?.zoomOut())
            }, {
              default: L(() => [
                b(r(le), { icon: "tabler:minus" })
              ]),
              _: 1
            })) : I("", !0),
            o.value === "Map" ? (c(), W(r(J), {
              key: 1,
              "aria-label": "Zoom in",
              title: "Zoom in",
              text: "",
              severity: "secondary",
              size: "small",
              onClick: z[4] || (z[4] = (B) => m.value?.zoomIn())
            }, {
              default: L(() => [
                b(r(le), { icon: "tabler:plus" })
              ]),
              _: 1
            })) : I("", !0)
          ])) : I("", !0),
          b(r(sl), {
            modelValue: o.value,
            "onUpdate:modelValue": z[5] || (z[5] = (B) => o.value = B),
            options: ["Map", "List"],
            "allow-empty": !1,
            "aria-label": "Process layout"
          }, null, 8, ["modelValue"]),
          i.value.length === 1 ? (c(), W(r(J), {
            key: 3,
            label: "New process",
            "aria-label": "New process",
            text: "",
            severity: "secondary",
            size: "small",
            onClick: z[6] || (z[6] = (B) => u.value = !0)
          }, {
            icon: L(() => [
              b(r(le), { icon: "tabler:plus" })
            ]),
            _: 1
          })) : I("", !0)
        ], 512),
        o.value === "Map" ? (c(), W(kr, {
          key: 0,
          ref_key: "graph",
          ref: m,
          process: $.value,
          draft: e.draft,
          "selected-state": s.value,
          "selected-transition": h.value,
          onState: me,
          onTransition: de,
          onRemoveTransition: q,
          onConnect: w,
          onClear: D
        }, null, 8, ["process", "draft", "selected-state", "selected-transition"])) : (c(), W(Lr, {
          key: 1,
          process: $.value,
          "selected-state": s.value,
          "selected-transition": h.value,
          onState: me,
          onTransition: de,
          onRemoveState: z[7] || (z[7] = (B) => $e($.value, B)),
          onRemoveTransition: se,
          onAddTransition: z[8] || (z[8] = (B) => O($.value, B))
        }, null, 8, ["process", "selected-state", "selected-transition"])),
        s.value || h.value ? (c(), y("aside", {
          key: 2,
          ref_key: "inspector",
          ref: k,
          class: "work-process-sideform",
          tabindex: "-1",
          "aria-label": s.value ? "State inspector" : "Transition inspector",
          "aria-keyshortcuts": h.value ? "Delete Backspace" : void 0,
          onKeydown: [
            Ae(Ve(q, ["self"]), ["delete"]),
            Ae(Ve(q, ["self"]), ["backspace"])
          ]
        }, [
          (c(!0), y(Z, null, re(s.value ? [s.value] : [], (B) => (c(), y(Z, {
            key: B.id
          }, [
            d("header", uu, [
              P.value ? (c(), W(r(be), {
                key: 1,
                modelValue: B.name,
                "onUpdate:modelValue": (g) => B.name = g,
                class: "work-process-name",
                "aria-label": "State name",
                onBlur: z[9] || (z[9] = (g) => P.value = !1)
              }, null, 8, ["modelValue", "onUpdate:modelValue"])) : (c(), W(il, {
                key: 0,
                class: "work-process-state-title",
                "aria-label": "Rename state",
                onActivate: T
              }, {
                default: L(() => [
                  d("span", null, U(r(pe)(B)), 1)
                ]),
                _: 2
              }, 1024)),
              b(r(J), {
                severity: "secondary",
                text: "",
                size: "small",
                "aria-label": "Close state editor",
                onClick: D
              }, {
                default: L(() => [
                  b(r(le), { icon: "tabler:x" })
                ]),
                _: 1
              })
            ]),
            d("p", cu, U(r(Ro)(B, e.draft)), 1),
            b(ou, {
              state: B,
              process: $.value,
              draft: e.draft,
              "board-id": e.boardId,
              onValidity: (g, E) => l("validity", g.includes("duration:") ? g : $.value.id + ":" + B.id + ":" + g, E)
            }, null, 8, ["state", "process", "draft", "board-id", "onValidity"]),
            d("label", vu, [
              z[18] || (z[18] = F("Phase", -1)),
              b(r(ue), {
                modelValue: B.category,
                "onUpdate:modelValue": (g) => B.category = g,
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                options: ["triage", "backlog", ...r(Wl)].map((g) => ({ label: r(It)(g), value: g }))
              }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
            ]),
            z[19] || (z[19] = d("h4", { class: "work-process-group" }, "Next stop", -1)),
            b(r(ue), {
              modelValue: n.value,
              "onUpdate:modelValue": z[10] || (z[10] = (g) => n.value = g),
              "aria-label": "Add transition to…",
              placeholder: "Add transition to…",
              appendTo: "self",
              optionLabel: "label",
              optionValue: "value",
              options: $.value.states.filter((g) => g !== B).map((g) => ({ label: r(pe)(g), value: g.id }))
            }, null, 8, ["modelValue", "options"]),
            b(r(J), {
              label: "Add transition",
              severity: "secondary",
              outlined: "",
              size: "small",
              disabled: !n.value,
              onClick: (g) => w(B.id, n.value)
            }, {
              icon: L(() => [
                b(r(le), { icon: "tabler:arrow-right" })
              ]),
              _: 1
            }, 8, ["disabled", "onClick"]),
            d("footer", mu, [
              b(r(J), {
                label: "Remove state",
                severity: "danger",
                text: "",
                size: "small",
                onClick: (g) => $e($.value, B)
              }, {
                icon: L(() => [
                  b(r(le), { icon: "tabler:trash" })
                ]),
                _: 1
              }, 8, ["onClick"])
            ])
          ], 64))), 128)),
          (c(!0), y(Z, null, re(h.value ? [h.value] : [], (B) => (c(), y(Z, {
            key: B.id
          }, [
            d("header", fu, [
              z[20] || (z[20] = d("h3", null, "Transition", -1)),
              b(r(J), {
                type: "button",
                label: "Remove transition",
                severity: "danger",
                text: "",
                size: "small",
                onClick: (g) => se(B)
              }, {
                icon: L(() => [
                  b(r(le), { icon: "tabler:trash" })
                ]),
                _: 1
              }, 8, ["onClick"]),
              b(r(J), {
                severity: "secondary",
                text: "",
                size: "small",
                "aria-label": "Close transition editor",
                onClick: D
              }, {
                default: L(() => [
                  b(r(le), { icon: "tabler:x" })
                ]),
                _: 1
              })
            ]),
            d("p", pu, U(B.from === "any" ? "Any state" : B.from.map((g) => r(pe)($.value.states.find((E) => E.id === g))).join(", ")) + " → " + U(r(pe)($.value.states.find((g) => g.id === B.to))), 1),
            p.value ? (c(), y("p", bu, U(p.value), 1)) : I("", !0),
            d("label", hu, [
              z[21] || (z[21] = F("Name", -1)),
              b(r(be), {
                modelValue: B.name,
                "onUpdate:modelValue": (g) => B.name = g,
                placeholder: r(Me)(B),
                "aria-label": "Transition name"
              }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder"])
            ]),
            b(Xr, {
              transition: B,
              process: $.value,
              draft: e.draft,
              "board-id": e.boardId,
              onValidity: (g, E) => l("validity", $.value.id + ":transition-" + B.id + ":" + g, E)
            }, null, 8, ["transition", "process", "draft", "board-id", "onValidity"])
          ], 64))), 128))
        ], 40, du)) : I("", !0)
      ], 2)) : (c(), W(r(J), {
        key: 2,
        label: "New process",
        severity: "secondary",
        outlined: "",
        onClick: z[11] || (z[11] = (B) => u.value = !0)
      }, {
        icon: L(() => [
          b(r(le), { icon: "tabler:plus" })
        ]),
        _: 1
      })),
      o.value === "List" && $.value ? (c(), y("div", yu, [
        b(r(J), {
          label: "Remove process",
          severity: "danger",
          text: "",
          size: "small",
          onClick: z[12] || (z[12] = (B) => Ce($.value))
        }, {
          icon: L(() => [
            b(r(le), { icon: "tabler:trash" })
          ]),
          _: 1
        })
      ])) : I("", !0),
      b(Gl, {
        visible: u.value,
        label: "New process",
        onClose: z[15] || (z[15] = (B) => u.value = !1)
      }, {
        default: L(() => [
          d("form", {
            class: "work-dialog-box",
            "aria-label": "New process",
            onSubmit: Ve(R, ["stop", "prevent"])
          }, [
            z[23] || (z[23] = d("h2", null, "New process", -1)),
            d("label", gu, [
              z[22] || (z[22] = F("Name", -1)),
              b(r(be), {
                modelValue: f.value,
                "onUpdate:modelValue": z[13] || (z[13] = (B) => f.value = B),
                "aria-label": "New process name",
                autofocus: "",
                required: ""
              }, null, 8, ["modelValue"])
            ]),
            d("div", ku, [
              b(r(J), {
                label: "Cancel",
                severity: "secondary",
                outlined: "",
                onClick: z[14] || (z[14] = (B) => u.value = !1)
              }),
              b(r(J), {
                label: "Create process",
                type: "submit",
                disabled: !f.value.trim()
              }, null, 8, ["disabled"])
            ])
          ], 32)
        ]),
        _: 1
      }, 8, ["visible"])
    ], 32));
  }
}), Vu = ["inert"], $u = { class: "work-stack work-tight" }, xu = /* @__PURE__ */ ge({
  __name: "ProcessMigration",
  props: {
    draft: {},
    original: {},
    disabled: { type: Boolean }
  },
  setup(e) {
    const a = e;
    function t(i, u, f) {
      f ? (i.map ??= {})[u] = f : i.map && delete i.map[u];
    }
    function l(i) {
      return a.original.processes?.find((u) => u.id === i.id)?.states.filter((u) => !i.states.some((f) => f.id === u.id)) ?? [];
    }
    return (i, u) => (c(), y("section", {
      class: "work-stack work-settings-card",
      "aria-label": "Existing items",
      inert: e.disabled || void 0
    }, [
      u[0] || (u[0] = d("h3", null, "Existing items", -1)),
      u[1] || (u[1] = d("p", { class: "work-muted work-small" }, " Choose how existing items follow these changes, then review the impact before applying. ", -1)),
      (c(!0), y(Z, null, re(e.draft.processes ?? [], (f) => (c(), y("div", {
        key: f.id,
        class: "work-stack"
      }, [
        d("label", $u, [
          F(U(f.name || "Untitled process"), 1),
          b(r(ue), {
            disabled: e.disabled,
            "model-value": r(yl)(f),
            "aria-label": "Existing items in " + (f.name || "this process"),
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            options: [
              { label: "Follow new process", value: "follow" },
              { label: "Keep current process", value: "pin" }
            ],
            "onUpdate:modelValue": (v) => f.migration = v
          }, null, 8, ["disabled", "model-value", "aria-label", "onUpdate:modelValue"])
        ]),
        r(yl)(f) !== "pin" ? (c(!0), y(Z, { key: 0 }, re(l(f), (v) => (c(), y("label", {
          key: v.id,
          class: "work-stack work-tight"
        }, [
          F("Move items from " + U(r(pe)(v)) + " to", 1),
          b(r(ue), {
            disabled: e.disabled,
            "model-value": f.map?.[v.id],
            placeholder: "Choose a surviving state",
            appendTo: "self",
            showClear: "",
            optionLabel: "label",
            optionValue: "value",
            options: f.states.map((p) => ({ label: r(pe)(p), value: p.id })),
            "onUpdate:modelValue": (p) => t(f, v.id, p)
          }, null, 8, ["disabled", "model-value", "options", "onUpdate:modelValue"])
        ]))), 128)) : I("", !0)
      ]))), 128))
    ], 8, Vu));
  }
}), Cu = {
  class: "work-stack",
  "aria-label": "Policy editor"
}, Su = { class: "work-settings-list" }, Tu = { class: "work-settings-row" }, Du = { class: "work-row-control" }, Iu = { class: "work-settings-list work-wip-container" }, Uu = { class: "work-wip-table" }, Eu = { class: "work-mono" }, Au = { class: "work-row-main" }, Pu = { class: "work-row" }, Ru = { class: "work-row" }, Ou = { class: "work-settings-list" }, Nu = { class: "work-settings-row" }, Mu = { class: "work-row-control" }, Fu = { class: "work-row-main" }, Lu = { class: "work-row-title" }, zu = { class: "work-muted work-small" }, Bu = { class: "work-row-control" }, ju = /* @__PURE__ */ ge({
  __name: "PolicyEditor",
  props: {
    draft: {}
  },
  emits: ["validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, i = H(() => t.draft.policy ?? {}), u = H(() => [...new Set(t.draft.processes?.flatMap((n) => n.states.map((s) => s.id)) ?? [])]), f = ["audit_days", "trash_days", "tombstone_days", "interval_days"], v = { audit_days: "Zero selects 365 days.", interval_days: "Zero selects 365 days.", trash_days: "Zero allows immediate cleanup of trashed items.", tombstone_days: "Zero allows immediate cleanup of deletion records." };
    function p(n, s) {
      s === void 0 ? t.draft.policy && delete t.draft.policy[n] : (t.draft.policy ??= {})[n] = s;
    }
    function o(n, s) {
      p(n, s ?? void 0);
    }
    return (n, s) => (c(), y("section", Cu, [
      s[13] || (s[13] = d("header", { class: "work-section-heading" }, [
        d("div", null, [
          d("h2", null, "Policy"),
          d("p", { class: "work-muted work-small" }, "Set capacity and how long the board keeps its history.")
        ])
      ], -1)),
      s[14] || (s[14] = d("h3", { class: "work-group-title" }, "Item keys", -1)),
      d("div", Su, [
        d("div", Tu, [
          s[7] || (s[7] = d("div", { class: "work-row-main" }, [
            d("strong", { class: "work-row-title" }, "Item key prefix"),
            d("p", { class: "work-muted work-small" }, "Work reviews and claims prefix changes when you apply the schema.")
          ], -1)),
          d("div", Du, [
            b(r(be), {
              modelValue: e.draft.key_prefix,
              "onUpdate:modelValue": s[0] || (s[0] = (h) => e.draft.key_prefix = h),
              "aria-label": "Item key prefix",
              required: "",
              pattern: "[A-Z][A-Z0-9]{1,9}",
              maxlength: "10"
            }, null, 8, ["modelValue"])
          ])
        ])
      ]),
      s[15] || (s[15] = d("h3", { class: "work-group-title" }, "Work in progress", -1)),
      s[16] || (s[16] = d("p", { class: "work-muted work-small" }, "A blank limit sets no restriction. A hard limit rejects transitions over capacity.", -1)),
      d("div", Iu, [
        d("table", Uu, [
          s[8] || (s[8] = d("thead", null, [
            d("tr", null, [
              d("th", null, "State"),
              d("th", null, "Limit"),
              d("th", null, "Hard limit")
            ])
          ], -1)),
          d("tbody", null, [
            (c(!0), y(Z, null, re(u.value, (h) => (c(), y("tr", { key: h }, [
              d("td", null, [
                d("strong", null, U(e.draft.processes?.flatMap((m) => m.states).find((m) => m.id === h)?.name || r(xe)(h)), 1),
                d("code", Eu, U(h), 1)
              ]),
              d("td", null, [
                b(Sa, {
                  draft: e.draft,
                  state: h,
                  label: h + " WIP limit"
                }, null, 8, ["draft", "state", "label"])
              ]),
              d("td", null, [
                b(Sa, {
                  draft: e.draft,
                  state: h,
                  label: h + " hard WIP limit",
                  hard: ""
                }, null, 8, ["draft", "state", "label"])
              ])
            ]))), 128))
          ])
        ]),
        (c(!0), y(Z, null, re(Object.keys(i.value.wip ?? {}).filter((h) => !u.value.includes(h)), (h) => (c(), y("div", {
          key: h,
          class: "work-settings-row"
        }, [
          d("div", Au, [
            F(U(r(xe)(h)) + " ", 1),
            s[9] || (s[9] = d("span", { class: "work-muted" }, "Removed state", -1))
          ]),
          b(r(J), {
            label: "Remove stale limit",
            severity: "secondary",
            outlined: "",
            onClick: (m) => delete i.value.wip[h]
          }, {
            icon: L(() => [
              b(r(le), { icon: "tabler:trash" })
            ]),
            _: 1
          }, 8, ["onClick"])
        ]))), 128))
      ]),
      s[17] || (s[17] = d("h3", { class: "work-group-title" }, "Automated stages", -1)),
      b(Tt, {
        "model-value": i.value.stage_timeout,
        "onUpdate:modelValue": s[1] || (s[1] = (h) => p("stage_timeout", h)),
        label: "Default attempt timeout",
        onValidity: s[2] || (s[2] = (h, m) => l("validity", m, h))
      }, null, 8, ["model-value"]),
      s[18] || (s[18] = d("p", { class: "work-muted work-small" }, "Blank uses one hour. Each retry gets a new deadline.", -1)),
      d("label", Pu, [
        s[10] || (s[10] = d("span", { class: "work-spacer" }, "Default maximum visits", -1)),
        b(r(_e), {
          "model-value": i.value.stage_max_visits ?? null,
          "aria-label": "Default maximum visits",
          min: 1,
          useGrouping: !1,
          placeholder: "5",
          "onUpdate:modelValue": s[3] || (s[3] = (h) => p("stage_max_visits", h ?? void 0))
        }, null, 8, ["model-value"])
      ]),
      s[19] || (s[19] = d("h3", { class: "work-group-title" }, "Comments", -1)),
      d("label", Ru, [
        s[11] || (s[11] = d("span", { class: "work-spacer" }, "Comments per item", -1)),
        b(r(_e), {
          "model-value": i.value.comments_per_item ?? null,
          "aria-label": "Comments per item",
          min: 1,
          max: 1e5,
          useGrouping: !1,
          placeholder: "Application default",
          "onUpdate:modelValue": s[4] || (s[4] = (h) => p("comments_per_item", h ?? void 0))
        }, null, 8, ["model-value"])
      ]),
      s[20] || (s[20] = d("p", { class: "work-muted work-small" }, "Blank follows the application default.", -1)),
      s[21] || (s[21] = d("h3", { class: "work-group-title" }, "Saved query filters", -1)),
      s[22] || (s[22] = d("p", { class: "work-muted work-small" }, "Choose which installed query filters this board can use.", -1)),
      b(nl, {
        schema: { type: "object", properties: { scopes: { type: "array", title: "Query filter identifiers", items: { type: "string" } } } },
        "model-value": { scopes: e.draft.scopes },
        "onUpdate:modelValue": s[5] || (s[5] = (h) => e.draft.scopes = h.scopes)
      }, null, 8, ["model-value"]),
      s[23] || (s[23] = d("h3", { class: "work-group-title" }, "Audit and retention", -1)),
      d("div", Ou, [
        d("div", Nu, [
          s[12] || (s[12] = d("div", { class: "work-row-main" }, [
            d("strong", { class: "work-row-title" }, "Audit trail"),
            d("p", { class: "work-muted work-small" }, "Choose which item changes appear in history.")
          ], -1)),
          d("div", Mu, [
            b(r(ue), {
              "model-value": i.value.audit ?? "",
              "aria-label": "Audit trail",
              placeholder: "Installation default",
              appendTo: "self",
              optionLabel: "label",
              optionValue: "value",
              options: [{ label: "Installation default", value: "" }, { label: "Off", value: "off" }, { label: "Fields", value: "fields" }],
              "onUpdate:modelValue": s[6] || (s[6] = (h) => p("audit", h || void 0))
            }, null, 8, ["model-value"])
          ])
        ]),
        (c(), y(Z, null, re(f, (h) => d("div", {
          key: h,
          class: "work-settings-row"
        }, [
          d("div", Fu, [
            d("strong", Lu, U(r(xe)(h)), 1),
            d("p", zu, "Blank follows the application default. " + U(v[h]), 1)
          ]),
          d("label", Bu, [
            b(r(_e), {
              min: 0,
              "aria-label": r(xe)(h),
              "model-value": i.value[h] ?? null,
              placeholder: "Installation default",
              useGrouping: !1,
              "onUpdate:modelValue": (m) => o(h, m)
            }, null, 8, ["aria-label", "model-value", "onUpdate:modelValue"])
          ])
        ])), 64))
      ])
    ]));
  }
}), qu = {
  class: "work-stack",
  "aria-label": "Relation types editor"
}, Wu = { class: "work-section-heading" }, Ku = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, Gu = { class: "work-definition-meta work-muted work-small" }, Hu = { class: "work-settings-grid" }, Yu = { class: "work-stack work-tight" }, Xu = { class: "work-stack work-tight" }, Ju = { class: "work-stack work-tight" }, Zu = { class: "work-stack work-tight" }, Qu = { class: "work-row" }, _u = { class: "work-relation-preview work-small" }, ec = { class: "work-muted" }, tc = {
  key: 0,
  class: "kx-empty"
}, ac = { class: "work-row work-add-definition" }, lc = { class: "work-stack work-tight" }, oc = /* @__PURE__ */ ge({
  __name: "RelationsEditor",
  props: {
    draft: {},
    guardRemoval: { type: Function }
  },
  setup(e) {
    const a = e, t = H(() => a.draft.relation_types ?? []), l = j(""), i = j(""), u = j(!1), f = H(() => /^[a-z][a-z0-9_]*$/.test(l.value) && !t.value.some((o) => o.id === l.value));
    function v() {
      f.value && ((a.draft.relation_types ??= []).push({ id: l.value, outward: xe(l.value).toLowerCase(), inward: xe(l.value).toLowerCase(), cardinality: "many" }), l.value = "");
    }
    async function p(o) {
      if (!u.value) {
        u.value = !0, i.value = "";
        try {
          const n = await a.guardRemoval?.("relation_types", o);
          n ? i.value = n : oa(a.draft, "relation_types", o);
        } finally {
          u.value = !1;
        }
      }
    }
    return (o, n) => (c(), y("section", qu, [
      d("header", Wu, [
        n[1] || (n[1] = d("div", null, [
          d("h2", null, "Relation types"),
          d("p", { class: "work-muted work-small" }, "Give each direction a clear label. A used relation keeps its identity and shape.")
        ], -1)),
        b(r(Le), {
          class: "kx-tag-sm",
          severity: "secondary"
        }, {
          default: L(() => [
            F(U(t.value.length) + " " + U(t.value.length === 1 ? "relation" : "relations"), 1)
          ]),
          _: 1
        })
      ]),
      i.value ? (c(), y("p", Ku, U(i.value), 1)) : I("", !0),
      b(Ua, {
        columns: "relations",
        count: t.value.length
      }, {
        default: L(() => [
          (c(!0), y(Z, null, re(t.value, (s, h) => (c(), W(Ia, {
            title: r(xe)(s.id),
            code: s.id,
            kind: s.symmetric ? "Same both ways" : "Different each way",
            key: h,
            class: "work-stack"
          }, {
            usage: L(() => [
              d("span", Gu, U(s.outward || "Related work") + " · " + U(s.inward || "Reverse relation"), 1)
            ]),
            actions: L(() => [
              b(r(J), {
                severity: "secondary",
                text: "",
                disabled: u.value,
                onClick: (m) => p(s.id),
                "aria-label": "Remove relation",
                size: "small"
              }, {
                default: L(() => [
                  b(r(le), {
                    icon: "tabler:trash",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["disabled", "onClick"])
            ]),
            default: L(() => [
              d("div", Hu, [
                d("label", Yu, [
                  n[2] || (n[2] = F("Identifier ", -1)),
                  b(r(be), {
                    modelValue: s.id,
                    "onUpdate:modelValue": (m) => s.id = m,
                    required: "",
                    pattern: "[a-z][a-z0-9_]*",
                    "aria-label": "Relation ID"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                d("label", Xu, [
                  n[3] || (n[3] = F("Outward label ", -1)),
                  b(r(be), {
                    modelValue: s.outward,
                    "onUpdate:modelValue": (m) => s.outward = m,
                    "aria-label": "Outward label"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                d("label", Ju, [
                  n[4] || (n[4] = F("Inward label ", -1)),
                  b(r(be), {
                    modelValue: s.inward,
                    "onUpdate:modelValue": (m) => s.inward = m,
                    "aria-label": "Inward label"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                d("label", Zu, [
                  n[5] || (n[5] = F("Links allowed ", -1)),
                  b(r(ue), {
                    "model-value": s.cardinality ?? "many",
                    "onUpdate:modelValue": (m) => s.cardinality = m,
                    "aria-label": "Links allowed",
                    appendTo: "self",
                    optionLabel: "label",
                    optionValue: "value",
                    optionDisabled: "disabled",
                    options: [{ label: "One link", value: "one", disabled: !1 }, { label: "Many links", value: "many", disabled: !1 }]
                  }, null, 8, ["model-value", "onUpdate:modelValue"])
                ]),
                d("label", Qu, [
                  b(r(jt), {
                    modelValue: s.symmetric,
                    "onUpdate:modelValue": (m) => s.symmetric = m,
                    "aria-label": "Same meaning in both directions",
                    binary: ""
                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                  n[6] || (n[6] = F("Same meaning in both directions ", -1))
                ])
              ]),
              d("p", _u, [
                n[7] || (n[7] = d("strong", null, "This item", -1)),
                F(" " + U(s.outward || "relates to") + " ", 1),
                n[8] || (n[8] = d("strong", null, "another item", -1)),
                d("span", ec, " · reverse: " + U(s.symmetric ? s.outward : s.inward), 1)
              ])
            ]),
            _: 2
          }, 1032, ["title", "code", "kind"]))), 128)),
          t.value.length ? I("", !0) : (c(), y("p", tc, "No relation types yet. Add one to link related work.")),
          d("div", ac, [
            d("label", lc, [
              n[9] || (n[9] = F("New relation ID ", -1)),
              b(r(be), {
                modelValue: l.value,
                "onUpdate:modelValue": n[0] || (n[0] = (s) => l.value = s),
                placeholder: "related_to",
                onKeydown: Ae(Ve(v, ["prevent"]), ["enter"])
              }, null, 8, ["modelValue", "onKeydown"])
            ]),
            b(r(J), {
              label: "Add relation",
              severity: "secondary",
              disabled: !f.value,
              onClick: v,
              outlined: ""
            }, {
              icon: L(() => [
                b(r(le), {
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
function ic(e, a) {
  return e.parked ? "Stopped: " + (typeof e.error == "string" ? e.error : e.error?.message ?? "Projection is parked") : e.bootstrapping ? "Initializing" : e.last_seq >= a ? "Up to date" : "Catching up";
}
const nc = {
  class: "work-stack",
  "aria-label": "Plugins editor"
}, sc = { class: "work-section-heading" }, rc = {
  key: 0,
  class: "kx-loading"
}, dc = {
  key: 1,
  class: "kx-err",
  role: "alert"
}, uc = {
  key: 2,
  class: "work-notice",
  role: "status"
}, cc = { class: "work-row" }, vc = {
  key: 0,
  class: "work-muted work-small"
}, mc = {
  key: 1,
  class: "kx-err"
}, fc = {
  key: 2,
  class: "work-notice"
}, pc = {
  key: 3,
  class: "work-stack work-tight work-plugin-status",
  role: "status"
}, bc = {
  key: 0,
  class: "kx-err"
}, hc = { class: "work-muted work-small" }, yc = { class: "work-form-actions" }, gc = {
  key: 0,
  class: "work-muted work-small"
}, Rl = /* @__PURE__ */ ge({
  __name: "PluginsEditor",
  props: {
    boardId: {},
    draft: {},
    schema: {},
    options: {},
    configs: {},
    disabled: { type: Boolean },
    activationLocked: { type: Boolean }
  },
  emits: ["configured", "refresh", "validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, i = j({}), u = j(""), f = j(""), v = j(""), p = j(/* @__PURE__ */ new Set()), o = {};
    function n($) {
      return t.schema.plugins?.find((C) => C.plugin === $);
    }
    function s($) {
      return n($)?.active === !0;
    }
    function h($) {
      return n($)?.lifecycle.state === "ready";
    }
    function m($) {
      return t.draft.plugins?.some((C) => C.use === $) === !0;
    }
    function k($, C) {
      const D = t.draft.plugins ?? [];
      C && !m($) && (t.draft.plugins = [...D, { use: $ }]), C || (t.draft.plugins = D.filter((X) => X.use !== $), delete t.configs[$], p.value.delete($), l("validity", $, !0));
    }
    function V($) {
      return s($) ? i.value[$] ?? n($)?.config ?? o : t.configs[$] ?? o;
    }
    function P($, C) {
      s($) ? i.value[$] = C : t.configs[$] = C;
    }
    function x($, C) {
      C ? p.value.delete($) : p.value.add($), s($) || l("validity", $, C);
    }
    async function T($) {
      if (!(u.value || p.value.has($))) {
        u.value = $, f.value = "", v.value = "";
        try {
          await $t.configure(t.boardId, $, V($)), delete i.value[$], v.value = "Plugin configuration saved.", l("configured");
        } catch (C) {
          f.value = Ye(C, "Could not configure plugin.");
        } finally {
          u.value = "";
        }
      }
    }
    return ($, C) => (c(), y("section", nc, [
      d("header", sc, [
        C[1] || (C[1] = d("div", null, [
          d("h2", null, "Plugins"),
          d("p", { class: "work-muted work-small" }, "Add capabilities from installed modules.")
        ], -1)),
        b(r(J), {
          label: "Refresh status",
          severity: "secondary",
          outlined: "",
          disabled: !!u.value || e.disabled,
          onClick: C[0] || (C[0] = (D) => l("refresh"))
        }, {
          icon: L(() => [
            b(r(le), {
              icon: "tabler:refresh",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        }, 8, ["disabled"])
      ]),
      C[5] || (C[5] = d("p", { class: "work-muted work-small" }, "Activation joins the schema draft and requires review. Active plugin configuration saves separately. Status reflects the last read; refresh to check progress.", -1)),
      e.options.length ? I("", !0) : (c(), y("p", rc, "No installed plugins are visible to you.")),
      f.value ? (c(), y("div", dc, U(f.value), 1)) : I("", !0),
      v.value ? (c(), y("p", uc, U(v.value), 1)) : I("", !0),
      b(Ua, {
        columns: "plugins",
        count: e.options.length
      }, {
        default: L(() => [
          (c(!0), y(Z, null, re(e.options, (D) => (c(), W(Ia, {
            key: D.plugin,
            title: D.title || "Unavailable capability",
            description: D.description,
            kind: s(D.plugin) ? "Active" : m(D.plugin) ? "Pending review" : "Inactive",
            class: "work-stack"
          }, {
            actions: L(() => [
              C[3] || (C[3] = d("span", { class: "work-spacer" }, null, -1)),
              d("label", cc, [
                b(r(Ge), {
                  "model-value": m(D.plugin),
                  disabled: !!u.value || e.disabled || e.activationLocked || !!D.problem,
                  "onUpdate:modelValue": (X) => k(D.plugin, X)
                }, null, 8, ["model-value", "disabled", "onUpdate:modelValue"]),
                C[2] || (C[2] = F("Activate on this board", -1))
              ])
            ]),
            default: L(() => [
              D.requires.length ? (c(), y("p", vc, "Requires " + U(D.requires.map((X) => e.options.find((te) => te.plugin === X)?.title || "Another capability").join(", ")), 1)) : I("", !0),
              D.problem ? (c(), y("p", mc, U(D.problem.message), 1)) : I("", !0),
              n(D.plugin)?.outdated ? (c(), y("p", fc, "The stored declaration differs from the installed plugin. Review activation to update it.")) : I("", !0),
              s(D.plugin) ? (c(), y("div", pc, [
                d("p", null, U(h(D.plugin) ? "Attachment configured" : n(D.plugin)?.lifecycle.state === "failed" ? "Configuration failed" : "Configuring attachment"), 1),
                n(D.plugin)?.lifecycle.error ? (c(), y("p", bc, U(n(D.plugin)?.lifecycle.error?.message), 1)) : I("", !0),
                (c(!0), y(Z, null, re(n(D.plugin)?.projections, (X, te) => (c(), y("div", { key: te }, [
                  d("p", null, U(r(ic)(X, e.schema.as_of)), 1),
                  d("p", hc, "Position " + U(X.last_seq) + " · Board head " + U(e.schema.as_of), 1)
                ]))), 128))
              ])) : I("", !0),
              !D.problem && (m(D.plugin) || s(D.plugin)) ? (c(), y(Z, { key: 4 }, [
                b(nl, {
                  disabled: !!u.value || e.disabled,
                  schema: D.config_schema,
                  "model-value": V(D.plugin),
                  "onUpdate:modelValue": (X) => P(D.plugin, X),
                  onValidity: (X) => x(D.plugin, X)
                }, null, 8, ["disabled", "schema", "model-value", "onUpdate:modelValue", "onValidity"]),
                d("div", yc, [
                  b(r(J), {
                    label: "Reset",
                    severity: "secondary",
                    outlined: "",
                    disabled: !!u.value || e.disabled,
                    onClick: (X) => P(D.plugin, s(D.plugin) ? r(Vt)(n(D.plugin)?.config ?? {}) : {})
                  }, {
                    icon: L(() => [
                      b(r(le), { icon: "tabler:restore" })
                    ]),
                    _: 1
                  }, 8, ["disabled", "onClick"]),
                  s(D.plugin) ? (c(), W(r(J), {
                    key: 0,
                    label: "Save configuration",
                    disabled: !!u.value || e.disabled || p.value.has(D.plugin),
                    loading: u.value === D.plugin,
                    onClick: (X) => T(D.plugin)
                  }, {
                    icon: L(() => [
                      b(r(le), {
                        icon: "tabler:device-floppy",
                        "aria-hidden": "true"
                      })
                    ]),
                    _: 1
                  }, 8, ["disabled", "loading", "onClick"])) : I("", !0)
                ]),
                s(D.plugin) ? I("", !0) : (c(), y("p", gc, "Initial configuration is included in Review and Apply."))
              ], 64)) : I("", !0)
            ]),
            _: 2
          }, 1032, ["title", "description", "kind"]))), 128))
        ]),
        _: 1
      }, 8, ["count"]),
      (c(!0), y(Z, null, re(e.draft.plugins?.filter((D) => !e.options.some((X) => X.plugin === D.use)) ?? [], (D) => (c(), y("article", {
        key: D.use,
        class: "work-settings-card"
      }, [
        C[4] || (C[4] = d("p", null, "Unavailable plugin", -1)),
        b(r(J), {
          label: "Deactivate plugin",
          severity: "secondary",
          onClick: (X) => k(D.use, !1),
          outlined: ""
        }, {
          icon: L(() => [
            b(r(le), {
              icon: "tabler:trash",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        }, 8, ["onClick"])
      ]))), 128))
    ]));
  }
}), kc = {
  class: "work-stack",
  "aria-label": "Board visibility"
}, wc = { class: "work-stack work-tight" }, Vc = {
  key: 0,
  class: "work-row"
}, $c = { class: "work-stack work-tight" }, xc = { class: "work-settings-list" }, Cc = { class: "work-row-main" }, Sc = { class: "work-small work-muted" }, Tc = { class: "work-row-control" }, Dc = { class: "work-row" }, Ic = /* @__PURE__ */ ge({
  __name: "VisibilityEditor",
  props: {
    draft: {},
    boardId: {}
  },
  emits: ["validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, i = H(() => t.draft.visibility), u = H(() => (t.draft.fields ?? []).filter((s) => s.form === "text" && (!s.cardinality || s.cardinality === "one") && s.type !== "rollup" && s.index !== "number" && s.config?.case !== "insensitive")), f = j(""), v = H(() => u.value.find((s) => s.code === i.value?.field)?.type !== "option");
    function p() {
      !f.value || !i.value || i.value.levels.some((s) => s.id === f.value) || (i.value.levels.push({ id: f.value, holders: [] }), f.value = "");
    }
    function o(s) {
      if (!s) {
        delete t.draft.visibility;
        return;
      }
      const h = u.value.find((m) => m.code === s);
      t.draft.visibility = { field: s, levels: (h?.options ?? []).map((m) => ({ id: m.id, holders: [] })) };
    }
    function n(s, h) {
      const m = i.value?.levels.find((k) => k.id === s);
      m && (m.holders = h ?? []);
    }
    return (s, h) => (c(), y("section", kc, [
      h[10] || (h[10] = d("h3", { class: "work-group-title" }, "Board visibility", -1)),
      h[11] || (h[11] = d("p", { class: "work-small work-muted" }, "Restrict items by their visibility level. People still need access to the board.", -1)),
      d("label", wc, [
        h[7] || (h[7] = F("Visibility field", -1)),
        b(r(ue), {
          "aria-label": "Visibility field",
          placeholder: "No additional restriction",
          "model-value": i.value?.field ?? "",
          options: [{ label: "No additional restriction", value: "" }, ...u.value.map((m) => ({ label: r(Be)(m), value: m.code }))],
          optionLabel: "label",
          optionValue: "value",
          appendTo: "self",
          "onUpdate:modelValue": h[0] || (h[0] = (m) => o(m))
        }, null, 8, ["model-value", "options"])
      ]),
      i.value ? (c(), y(Z, { key: 0 }, [
        v.value ? (c(), y("div", Vc, [
          d("label", $c, [
            h[8] || (h[8] = F("Level ID", -1)),
            b(r(be), {
              modelValue: f.value,
              "onUpdate:modelValue": h[1] || (h[1] = (m) => f.value = m),
              "aria-label": "New visibility level",
              onKeydown: Ae(Ve(p, ["prevent"]), ["enter"])
            }, null, 8, ["modelValue", "onKeydown"])
          ]),
          b(r(J), {
            label: "Add level",
            severity: "secondary",
            outlined: "",
            disabled: !f.value || i.value.levels.some((m) => m.id === f.value),
            onClick: p
          }, null, 8, ["disabled"])
        ])) : I("", !0),
        d("div", xc, [
          (c(!0), y(Z, null, re(i.value.levels, (m, k) => (c(), y("div", {
            key: m.id,
            class: "work-settings-row"
          }, [
            d("div", Cc, [
              d("strong", null, U(u.value.find((V) => V.code === i.value.field)?.options?.find((V) => V.id === m.id)?.label || m.id), 1),
              d("p", Sc, "Level " + U(k + 1), 1)
            ]),
            d("div", Tc, [
              b(Jl, {
                "board-id": e.boardId,
                label: "Who can see these items",
                "model-value": m.holders,
                "onUpdate:modelValue": (V) => n(m.id, V),
                onValidity: h[2] || (h[2] = (V) => l("validity", V))
              }, null, 8, ["board-id", "model-value", "onUpdate:modelValue"])
            ])
          ]))), 128))
        ]),
        d("label", Dc, [
          b(r(Ge), {
            "model-value": i.value.bypass === "admin",
            "onUpdate:modelValue": h[3] || (h[3] = (m) => m ? i.value.bypass = "admin" : delete i.value.bypass)
          }, null, 8, ["model-value"]),
          h[9] || (h[9] = F("Board administrators can see every level", -1))
        ]),
        b(r(J), {
          label: "Remove visibility restriction",
          severity: "secondary",
          text: "",
          onClick: h[4] || (h[4] = (m) => delete e.draft.visibility)
        })
      ], 64)) : I("", !0),
      b(ht, {
        label: "Visibility rules",
        "model-value": i.value,
        shape: "object",
        example: { field: "visibility", levels: [{ id: "internal", holders: [] }], bypass: "admin" },
        "onUpdate:modelValue": h[5] || (h[5] = (m) => e.draft.visibility = m),
        onValidity: h[6] || (h[6] = (m) => l("validity", m))
      }, null, 8, ["model-value"])
    ]));
  }
}), Uc = { class: "kx-head" }, Ec = { class: "kx-head-icon" }, Ac = { class: "kx-head-text" }, Pc = { class: "kx-title" }, Rc = ["title"], Oc = { class: "kx-head-actions" }, Nc = /* @__PURE__ */ ge({
  __name: "PageHead",
  props: {
    title: {},
    subtitle: {},
    icon: { default: "tabler:layout-kanban" },
    backLabel: {}
  },
  emits: ["back"],
  setup(e) {
    return (a, t) => (c(), y("header", Uc, [
      e.backLabel ? (c(), W(r(J), {
        key: 0,
        "aria-label": e.backLabel,
        severity: "secondary",
        text: "",
        onClick: t[0] || (t[0] = (l) => a.$emit("back"))
      }, {
        default: L(() => [
          b(r(le), {
            icon: "tabler:arrow-left",
            "aria-hidden": "true"
          })
        ]),
        _: 1
      }, 8, ["aria-label"])) : I("", !0),
      d("div", Ec, [
        b(r(le), {
          icon: e.icon,
          "aria-hidden": "true"
        }, null, 8, ["icon"])
      ]),
      d("div", Ac, [
        Xe(a.$slots, "identity", {}, () => [
          d("h1", Pc, U(e.title), 1),
          e.subtitle ? (c(), y("p", {
            key: 0,
            class: "kx-head-sub",
            title: e.subtitle
          }, U(e.subtitle), 9, Rc)) : I("", !0)
        ])
      ]),
      d("div", Oc, [
        Xe(a.$slots, "default")
      ])
    ]));
  }
}), Mc = { class: "work-board-identity work-stack work-tight" }, Fc = { class: "work-stack work-tight" }, Lc = { class: "work-stack work-tight" }, zc = { class: "work-stack work-tight" }, Bc = ["value", "inert"], jc = {
  key: 1,
  class: "work-muted work-small"
}, qc = { class: "work-row" }, Wc = { class: "work-row" }, Kc = { class: "work-row work-board-title" }, Gc = {
  key: 1,
  class: "work-identity-actions"
}, Hc = ["title"], Yc = {
  key: 2,
  class: "kx-err work-inline",
  role: "alert"
}, Xc = {
  key: 3,
  class: "work-muted work-small",
  role: "status"
}, Ol = /* @__PURE__ */ ge({
  __name: "BoardIdentity",
  props: {
    board: {},
    compact: { type: Boolean },
    detail: { type: Boolean },
    subtitle: {}
  },
  emits: ["saved", "dirty-change"],
  setup(e, { emit: a }) {
    const t = e, l = a, i = j(!1), u = j(""), f = j(""), v = j(""), p = j(!1), o = j(!1), n = j(""), s = j(""), h = H(() => t.board?.access?.admin === !0), m = j({ title: "", description: "", icon: "" });
    function k() {
      m.value = { title: t.board?.title ?? "", icon: t.board?.icon ?? "", description: t.board?.description ?? "" }, u.value = m.value.title, v.value = m.value.icon, f.value = m.value.description, n.value = "", s.value = "", i.value = !0, pt("wc-icon-picker").then((T) => p.value = T);
    }
    const V = H(() => {
      const T = {};
      return u.value.trim() !== m.value.title && (T.title = u.value.trim()), f.value !== m.value.description && (T.description = f.value), v.value !== m.value.icon && (T.icon = v.value), T;
    });
    Ue(h, (T) => {
      T || P();
    }), Ue(() => i.value && Object.keys(V.value).length > 0, (T) => l("dirty-change", T));
    function P() {
      i.value = !1, n.value = "";
    }
    async function x() {
      if (!h.value || !t.board || o.value || !u.value.trim()) return;
      const T = V.value;
      if (!Object.keys(T).length) {
        i.value = !1, s.value = "Nothing changed.";
        return;
      }
      o.value = !0, n.value = "";
      try {
        const $ = await St.updateBoard(t.board.board_id, T);
        i.value = !1, s.value = $.status === "unchanged" ? "Nothing changed." : "Board saved.", l("saved");
      } catch ($) {
        n.value = Ye($, "Could not save the board.");
      } finally {
        o.value = !1;
      }
    }
    return (T, $) => (c(), y("div", Mc, [
      i.value ? (c(), y("form", {
        key: 0,
        class: "work-identity-edit",
        "aria-label": "Edit board",
        onClick: $[3] || ($[3] = Ve(() => {
        }, ["stop"])),
        onSubmit: Ve(x, ["prevent"])
      }, [
        d("label", Fc, [
          $[4] || ($[4] = F("Title", -1)),
          b(r(be), {
            modelValue: u.value,
            "onUpdate:modelValue": $[0] || ($[0] = (C) => u.value = C),
            required: "",
            autofocus: "",
            disabled: o.value
          }, null, 8, ["modelValue", "disabled"])
        ]),
        d("label", Lc, [
          $[5] || ($[5] = F("Description", -1)),
          b(r(ka), {
            modelValue: f.value,
            "onUpdate:modelValue": $[1] || ($[1] = (C) => f.value = C),
            rows: "1",
            disabled: o.value
          }, null, 8, ["modelValue", "disabled"])
        ]),
        d("div", zc, [
          $[6] || ($[6] = d("span", null, "Board icon", -1)),
          p.value ? (c(), y("wc-icon-picker", {
            key: 0,
            value: v.value,
            fallback: "tabler:layout-kanban",
            inert: o.value || void 0,
            onSelect: $[2] || ($[2] = (C) => v.value = C.detail)
          }, null, 40, Bc)) : (c(), y("p", jc, "The icon picker is unavailable."))
        ]),
        d("div", qc, [
          b(r(J), {
            label: "Save",
            severity: "secondary",
            type: "submit",
            disabled: !u.value.trim() || o.value,
            loading: o.value,
            outlined: ""
          }, {
            icon: L(() => [
              b(r(le), {
                icon: "tabler:device-floppy",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled", "loading"]),
          b(r(J), {
            label: "Cancel",
            severity: "secondary",
            disabled: o.value,
            onClick: P,
            outlined: ""
          }, {
            icon: L(() => [
              b(r(le), {
                icon: "tabler:x",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled"])
        ])
      ], 32)) : (c(), y(Z, { key: 1 }, [
        d("div", Wc, [
          d("div", Kc, [
            e.board?.icon ? (c(), W(r(le), {
              key: 0,
              icon: e.board.icon,
              "aria-hidden": "true"
            }, null, 8, ["icon"])) : I("", !0),
            (c(), W(Ha(e.compact || e.detail ? "h2" : "h1"), {
              class: bt(e.detail ? "work-detail-title" : e.compact ? "kx-card-name" : "kx-title")
            }, {
              default: L(() => [
                F(U(e.board?.title || "Untitled board"), 1)
              ]),
              _: 1
            }, 8, ["class"]))
          ]),
          e.compact ? Xe(T.$slots, "title-end", {}, void 0, void 0, 0) : I("", !0),
          e.compact ? (c(), y("span", Gc, [
            h.value ? (c(), W(r(J), {
              key: 0,
              severity: "secondary",
              text: "",
              size: "small",
              onClick: Ve(k, ["stop"]),
              "aria-label": "Edit board"
            }, {
              default: L(() => [
                b(r(le), {
                  icon: "tabler:pencil",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            })) : I("", !0),
            Xe(T.$slots, "actions")
          ])) : h.value ? (c(), W(r(J), {
            key: 2,
            severity: "secondary",
            text: "",
            size: "small",
            onClick: Ve(k, ["stop"]),
            "aria-label": "Edit board"
          }, {
            default: L(() => [
              b(r(le), {
                icon: "tabler:pencil",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          })) : I("", !0),
          e.compact ? I("", !0) : Xe(T.$slots, "title-end", {}, void 0, void 0, 3)
        ]),
        !e.compact && (e.subtitle || e.board?.description) ? (c(), y("p", {
          key: 0,
          class: "kx-head-sub",
          title: e.subtitle || e.board?.description
        }, U(e.subtitle || e.board?.description), 9, Hc)) : I("", !0)
      ], 64)),
      n.value ? (c(), y("p", Yc, U(n.value), 1)) : I("", !0),
      s.value ? (c(), y("p", Xc, U(s.value), 1)) : I("", !0)
    ]));
  }
}), Jc = {
  key: 0,
  class: "work-dirty"
}, Nl = /* @__PURE__ */ ge({
  __name: "SettingsActions",
  props: {
    dirty: { type: Boolean },
    busy: { type: Boolean },
    checkingRemoval: { type: Boolean },
    reviewed: { type: Boolean },
    disabled: { type: Boolean }
  },
  emits: ["discard", "primary"],
  setup(e) {
    return (a, t) => (c(), y(Z, null, [
      e.dirty ? (c(), y("span", Jc, "Unsaved changes")) : I("", !0),
      b(r(J), {
        label: "Discard",
        severity: "secondary",
        outlined: "",
        disabled: !e.dirty || e.busy || e.checkingRemoval,
        onClick: t[0] || (t[0] = (l) => a.$emit("discard"))
      }, {
        icon: L(() => [
          b(r(le), { icon: "tabler:restore" })
        ]),
        _: 1
      }, 8, ["disabled"]),
      b(r(J), {
        label: e.reviewed ? "Apply" : "Review changes",
        disabled: e.disabled,
        loading: e.busy,
        onClick: t[1] || (t[1] = (l) => a.$emit("primary"))
      }, null, 8, ["label", "disabled", "loading"])
    ], 64));
  }
}), Zc = {
  key: 0,
  class: "work-detail-head"
}, Qc = {
  key: 0,
  class: "work-row work-wrap work-draft-actions"
}, _c = {
  key: 2,
  class: "kx-err",
  role: "alert"
}, ev = ["config"], tv = /* @__PURE__ */ ge({
  __name: "SettingsHead",
  props: {
    pack: {},
    packTitle: {},
    outdated: { type: Boolean },
    canUpgrade: { type: Boolean },
    upgradeReason: {},
    board: {},
    embedded: { type: Boolean },
    generation: {},
    authorized: { type: Boolean },
    dirty: { type: Boolean },
    busy: { type: Boolean },
    checkingRemoval: { type: Boolean },
    reviewed: { type: Boolean },
    disabled: { type: Boolean }
  },
  emits: ["back", "discard", "primary", "saved", "metadata-dirty-change", "upgrade", "install"],
  setup(e) {
    const a = e, t = j(!1), l = j(!1), i = j("");
    async function u() {
      !a.authorized || !a.board || (i.value = "", l.value = await pt("kickside-share"), l.value ? t.value = !0 : i.value = "The sharing widget is unavailable. Try Share board again.");
    }
    Ue(() => a.authorized, (o) => {
      o || (t.value = !1);
    });
    const f = H(() => JSON.stringify({ resource_id: a.board?.board_id, title: a.board?.title, access_url: `/api/v1/component-access/grants/${encodeURIComponent(a.board?.board_id ?? "")}`, share_url: `/api/v1/component-access/share/${encodeURIComponent(a.board?.board_id ?? "")}` })), v = H(() => a.pack ? `${a.packTitle} ${a.pack.version}${a.outdated ? " · Outdated" : ""}` : ""), p = H(() => "Settings · generation " + (a.generation ?? "…") + (v.value ? " · " + v.value : ""));
    return (o, n) => (c(), y(Z, null, [
      e.embedded ? (c(), y("header", Zc, [
        (c(), W(Ol, {
          key: e.board?.board_id,
          board: e.board,
          onDirtyChange: n[0] || (n[0] = (s) => o.$emit("metadata-dirty-change", s)),
          subtitle: v.value || void 0,
          detail: "",
          onSaved: n[1] || (n[1] = (s) => o.$emit("saved"))
        }, {
          "title-end": L(() => [
            b(r(Le), {
              severity: "secondary",
              value: "Generation " + (e.generation ?? "…")
            }, null, 8, ["value"])
          ]),
          _: 1
        }, 8, ["board", "subtitle"])),
        e.authorized ? (c(), y("div", Qc, [
          e.authorized && e.outdated && e.pack ? (c(), W(r(J), {
            key: 0,
            disabled: !e.canUpgrade,
            title: e.upgradeReason,
            label: "Upgrade pack",
            severity: "secondary",
            outlined: "",
            onClick: n[2] || (n[2] = (s) => o.$emit("upgrade"))
          }, {
            icon: L(() => [
              b(r(le), { icon: "tabler:refresh" })
            ]),
            _: 1
          }, 8, ["disabled", "title"])) : I("", !0),
          e.authorized && e.board ? (c(), W(r(J), {
            key: 1,
            label: "Share board",
            severity: "secondary",
            outlined: "",
            disabled: e.busy,
            onClick: u
          }, {
            icon: L(() => [
              b(r(le), {
                icon: "tabler:share",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled"])) : I("", !0),
          e.authorized && !e.pack ? (c(), W(r(J), {
            key: 2,
            label: "Install pack",
            severity: "secondary",
            outlined: "",
            disabled: e.busy || e.dirty,
            onClick: n[3] || (n[3] = (s) => o.$emit("install"))
          }, null, 8, ["disabled"])) : I("", !0),
          b(Nl, {
            dirty: e.dirty,
            busy: e.busy,
            "checking-removal": e.checkingRemoval,
            reviewed: e.reviewed,
            disabled: e.disabled,
            onDiscard: n[4] || (n[4] = (s) => o.$emit("discard")),
            onPrimary: n[5] || (n[5] = (s) => o.$emit("primary"))
          }, null, 8, ["dirty", "busy", "checking-removal", "reviewed", "disabled"])
        ])) : I("", !0)
      ])) : (c(), W(Nc, {
        key: 1,
        title: e.board?.title || "Board",
        subtitle: p.value,
        "back-label": "Back to board",
        icon: "tabler:adjustments",
        onBack: n[12] || (n[12] = (s) => o.$emit("back"))
      }, {
        identity: L(() => [
          (c(), W(Ol, {
            key: e.board?.board_id,
            board: e.board,
            onDirtyChange: n[6] || (n[6] = (s) => o.$emit("metadata-dirty-change", s)),
            subtitle: p.value,
            onSaved: n[7] || (n[7] = (s) => o.$emit("saved"))
          }, null, 8, ["board", "subtitle"]))
        ]),
        default: L(() => [
          e.authorized && e.outdated && e.pack ? (c(), W(r(J), {
            key: 0,
            disabled: !e.canUpgrade,
            title: e.upgradeReason,
            label: "Upgrade pack",
            severity: "secondary",
            outlined: "",
            onClick: n[8] || (n[8] = (s) => o.$emit("upgrade"))
          }, {
            icon: L(() => [
              b(r(le), { icon: "tabler:refresh" })
            ]),
            _: 1
          }, 8, ["disabled", "title"])) : I("", !0),
          e.authorized && e.board ? (c(), W(r(J), {
            key: 1,
            label: "Share board",
            severity: "secondary",
            outlined: "",
            disabled: e.busy,
            onClick: u
          }, {
            icon: L(() => [
              b(r(le), {
                icon: "tabler:share",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled"])) : I("", !0),
          e.authorized && !e.pack ? (c(), W(r(J), {
            key: 2,
            label: "Install pack",
            severity: "secondary",
            outlined: "",
            disabled: e.busy || e.dirty,
            onClick: n[9] || (n[9] = (s) => o.$emit("install"))
          }, null, 8, ["disabled"])) : I("", !0),
          e.authorized ? (c(), W(Nl, {
            key: 3,
            dirty: e.dirty,
            busy: e.busy,
            "checking-removal": e.checkingRemoval,
            reviewed: e.reviewed,
            disabled: e.disabled,
            onDiscard: n[10] || (n[10] = (s) => o.$emit("discard")),
            onPrimary: n[11] || (n[11] = (s) => o.$emit("primary"))
          }, null, 8, ["dirty", "busy", "checking-removal", "reviewed", "disabled"])) : I("", !0)
        ]),
        _: 1
      }, 8, ["title", "subtitle"])),
      i.value ? (c(), y("p", _c, U(i.value), 1)) : I("", !0),
      t.value && l.value && e.authorized ? (c(), y("kickside-share", {
        key: 3,
        config: f.value,
        onClose: n[13] || (n[13] = (s) => t.value = !1),
        onChanged: n[14] || (n[14] = (s) => o.$emit("saved"))
      }, null, 40, ev)) : I("", !0)
    ], 64));
  }
}), Oe = (e, a) => `${e} → ${a}`, Ml = (e, a) => {
  const t = e.fields?.find((l) => l.code === a);
  return t ? Be(t) : "Untitled field";
}, Fl = {
  comments_per_item: "Comments per item",
  stage_timeout: "Default attempt timeout",
  stage_max_visits: "Default maximum visits",
  audit: "Audit trail",
  audit_days: "Audit history",
  trash_days: "Keep trashed items",
  tombstone_days: "Keep deletion records",
  interval_days: "Keep state history"
};
function Ll(e, a) {
  if (a === void 0) return "Application default";
  if (e === "audit") return xe(String(a));
  if (e === "stage_timeout") {
    const t = Zt(String(a));
    if (t) return `${t.amount.toLocaleString()} ${t.amount === 1 ? t.unit.slice(0, -1) : t.unit}`;
  }
  if (e.endsWith("_days")) {
    const t = a === 0 && (e === "audit_days" || e === "interval_days") ? 365 : a;
    return `${t} ${t === 1 ? "day" : "days"}`;
  }
  return String(a);
}
function av(e, a) {
  const t = e.policy ?? {}, l = a.policy ?? {}, i = Object.keys(Fl).flatMap((v) => t[v] === l[v] ? [] : [`${Fl[v]} · ${Oe(Ll(v, t[v]), Ll(v, l[v]))}`]), u = (v) => v ? `${v.limit}${v.hard ? " (hard limit)" : ""}` : "No limit", f = /* @__PURE__ */ new Set([...Object.keys(t.wip ?? {}), ...Object.keys(l.wip ?? {})]);
  for (const v of f) {
    const p = u(t.wip?.[v]), o = u(l.wip?.[v]);
    if (p === o) continue;
    const n = (a.processes ?? []).flatMap((s) => s.states).find((s) => s.id === v) ?? (e.processes ?? []).flatMap((s) => s.states).find((s) => s.id === v);
    i.push(`${pe(n)} limit · ${Oe(p, o)}`);
  }
  return i;
}
function lv(e, a, t) {
  const l = e.visibility, i = a.visibility, u = [];
  l?.field !== i?.field && u.push(Oe(
    l ? Ml(e, l.field) : "No additional restriction",
    i ? Ml(a, i.field) : "No additional restriction"
  ));
  const f = l?.levels ?? [], v = i?.levels ?? [], p = new Set([...f, ...v].map((o) => o.id));
  for (const o of p) {
    const n = f.find((V) => V.id === o), s = v.find((V) => V.id === o);
    if (n && s && JSON.stringify(n.holders) === JSON.stringify(s.holders)) continue;
    const h = (V) => V.fields?.find((P) => P.code === V.visibility?.field)?.options?.find((P) => P.id === o)?.label, m = h(a) || h(e) || xe(o), k = (V) => V ? V.holders.map(t).join(", ") || "No extra access" : "No level";
    u.push(`${m} · ${Oe(k(n), k(s))}`);
  }
  return l?.bypass !== i?.bypass && u.push(i?.bypass === "admin" ? "Board administrators can see every level." : "Visibility levels now apply to board administrators."), u;
}
const Qt = {
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
function ov(e, a, t) {
  const { what: l, detail: i, to: u } = e, v = `${t?.name || a?.name || "Untitled process"} · ${Qt[l] ?? "Process changed"}`, p = l.startsWith("state.") ? a?.states.find((m) => m.id === i) : void 0, o = l.startsWith("state.") ? t?.states.find((m) => m.id === i) : void 0, n = l.startsWith("transition.") ? a?.transitions?.find((m) => m.id === i) : void 0, s = l.startsWith("transition.") ? t?.transitions?.find((m) => m.id === i) : void 0;
  let h = "";
  return l === "state.map" ? h = Oe(pe(p), pe(t?.states.find((m) => m.id === u))) : l === "state.name" ? h = Oe(pe(p), pe(o)) : l === "state.kind" ? h = `${pe(o)} · ${Oe(ga(p?.kind), ga(o?.kind))}` : l === "state.category" && p && o ? h = `${pe(o)} · ${Oe(It(p.category), It(o.category))}` : o || p ? h = pe(o ?? p) : l === "transition.name" && n && s ? h = Oe(Me(n), Me(s)) : s ? h = Me(s) : n ? h = Me(n) : l === "initial" ? h = Oe(pe(a?.states.find((m) => m.id === a.initial)), pe(t?.states.find((m) => m.id === t.initial))) : l === "name" && (h = Oe(a?.name || "Untitled process", t?.name || "Untitled process")), { title: v, details: h ? [h] : [] };
}
function iv(e, a, t, l) {
  const { code: i, what: u, detail: f } = e;
  if (i === "schema" || u === "visibility.remove")
    return u === "policy" ? { title: "Board policy", details: av(a, t) } : u.startsWith("visibility") ? { title: "Board visibility", details: lv(a, t, l) } : u === "key_prefix" ? { title: "Item key prefix", details: [Oe(a.key_prefix ?? "Default", t.key_prefix ?? "Default")] } : { title: { plugins: "Board plugins changed", scopes: "Saved query filters changed", "rollup.recompute": "Calculated totals will update" }[u] ?? "Board settings changed", details: [] };
  if (i.startsWith("process ")) {
    const s = i.slice(8);
    return ov(e, a.processes?.find((h) => h.id === s), t.processes?.find((h) => h.id === s));
  }
  if (i.startsWith("item_type ")) {
    const s = i.slice(10), h = a.item_types?.find((V) => V.id === s), m = t.item_types?.find((V) => V.id === s);
    return { title: `${m?.title || h?.title || "Item type"} · ${Qt[u] ?? "Item type changed"}`, details: u === "title" ? [Oe(h?.title || "Untitled item type", m?.title || "Untitled item type")] : [] };
  }
  if (i.startsWith("relation ")) {
    const s = i.slice(9), h = a.relation_types?.find((V) => V.id === s), m = t.relation_types?.find((V) => V.id === s), k = u === "label" ? [Oe([h?.outward, h?.inward].filter(Boolean).join(" / "), [m?.outward, m?.inward].filter(Boolean).join(" / "))] : [];
    return { title: `${m?.outward || h?.outward || "Relation type"} · ${Qt[u] ?? "Relation type changed"}`, details: k };
  }
  const v = t.fields?.find((s) => s.code === i), p = a.fields?.find((s) => v?.id !== void 0 ? s.id === v.id : s.code === (u.startsWith("renamed from ") ? u.slice(13) : i)), o = v ?? p;
  if (!o) return { title: Qt[u] ?? "Board settings changed", details: [] };
  const n = `${Be(o)} · ${u.startsWith("renamed from ") ? "Field key" : Qt[u] ?? "Field settings changed"}`;
  if (u.startsWith("options.")) {
    const s = p?.options ?? [], h = v?.options ?? [], m = s.findIndex(($) => $.id === f), k = h.findIndex(($) => $.id === f), V = s[m], P = h[k], x = P?.label || V?.label || "Untitled choice", T = V && P && V.label !== P.label ? [] : [x];
    if (V && P) {
      V.label !== P.label && T.push(Oe(V.label || "Untitled choice", P.label || "Untitled choice")), V.category !== P.category && T.push(`Category · ${Oe(V.category ? It(V.category) : "None", P.category ? It(P.category) : "None")}`);
      const $ = V.order ?? m + 1, C = P.order ?? k + 1;
      $ !== C && T.push(`Order · ${Oe($, C)}`), V.color !== P.color && T.push(`Color · ${Oe(V.color ?? "Default", P.color ?? "Default")}`);
    }
    return { title: n, details: T };
  }
  return u === "title" && p && v ? { title: n, details: [Oe(Be(p), Be(v))] } : { title: n, details: [] };
}
const nv = {
  key: 0,
  class: "work-settings-card work-schema-plan work-stack",
  "aria-label": "Schema review"
}, sv = { key: 0 }, rv = { class: "work-row work-wrap" }, dv = { class: "work-muted work-small" }, uv = { class: "work-muted" }, cv = {
  key: 0,
  class: "work-notice"
}, vv = {
  key: 1,
  class: "work-notice"
}, mv = {
  key: 2,
  class: "work-stack work-tight",
  "aria-label": "Reviewed Flow bindings"
}, fv = { key: 3 }, pv = { class: "work-small" }, bv = {
  key: 4,
  class: "work-settings-table"
}, hv = { key: 0 }, yv = /* @__PURE__ */ ge({
  __name: "SchemaReview",
  props: {
    boardId: {},
    original: {},
    declaration: {},
    plan: {},
    generation: {},
    follows: {},
    configCount: {},
    packReview: { type: Boolean }
  },
  setup(e) {
    const a = e, t = {}, l = H(() => a.original ?? t), i = H(() => a.declaration ?? t), u = H(() => (i.value.processes ?? []).flatMap((T) => T.states.flatMap(($) => {
      const C = $.run?.flow_ref;
      return C ? [{ key: T.id + ":" + $.id, process: T.name || "Untitled process", state: pe($), reference: C }] : [];
    }))), f = j(/* @__PURE__ */ new Map());
    Ue(u, async (T, $, C) => {
      const D = /* @__PURE__ */ new Map();
      f.value = D;
      let X = !0;
      C(() => X = !1), await Promise.all([...new Set(T.map((te) => te.reference.id))].map(async (te) => {
        try {
          const me = (await al.title(te))?.trim();
          X && me && !Mo(me) && f.value.set(te, me);
        } catch {
          X && f.value.set(te, "Flow title unavailable");
        }
      }));
    }, { immediate: !0 });
    const v = H(() => [l.value, i.value].flatMap((T) => (T.visibility?.levels ?? []).flatMap(($) => $.holders.flatMap((C) => "group" in C ? [{ kind: "group", id: C.group }] : "user" in C ? [{ kind: "user", id: C.user }] : [])))), p = Fo(() => a.boardId ?? "", v);
    function o(T) {
      if ("user" in T) return p.label({ kind: "user", id: T.user });
      if ("group" in T) return p.label({ kind: "group", id: T.group });
      if ("field" in T) {
        const $ = i.value.fields?.find((C) => C.code === T.field) ?? l.value.fields?.find((C) => C.code === T.field);
        return $ ? Be($) : "People from a field";
      }
      return "Service";
    }
    const n = (T) => T.map(($) => ({ change: $, ...iv($, l.value, i.value, o) })), s = H(() => n(a.plan?.changes.filter((T) => T.class !== "refused") ?? [])), h = H(() => n(a.plan?.refused ?? [])), m = H(() => {
      const T = a.plan?.migration;
      return !T || !h.value.length ? T : h.value.every(($) => $.change.what === "options.remove") ? "Add a new field with the choices you want to keep. Copy existing values into it before removing the old field." : h.value.every(($) => $.change.what === "state.remove") ? "Choose where existing items should move before removing their state." : T;
    }), k = {
      unchanged: ["No changes", "secondary"],
      cosmetic: ["Labels or settings", "secondary"],
      additive: ["New definitions", "success"],
      semantic: ["Affects existing items", "warn"],
      refused: ["Blocked", "danger"],
      initial: ["First setup", "secondary"]
    }, V = (T) => k[T]?.[0] ?? "Review needed", P = (T) => k[T]?.[1] ?? "secondary";
    function x(T) {
      const { detail: $, ...C } = T;
      return Da(T.what === "invalid" || T.what.startsWith("views.") || T.what.startsWith("automation") ? T : C);
    }
    return (T, $) => e.plan ? (c(), y("section", nv, [
      !e.plan.changes.length && !e.plan.refused.length && !e.configCount && !e.packReview ? (c(), y("p", sv, "No changes to apply.")) : (c(), y(Z, { key: 1 }, [
        d("header", rv, [
          $[0] || ($[0] = d("h2", null, "Review", -1)),
          b(r(Le), {
            class: "kx-tag-sm",
            severity: P(e.plan.class)
          }, {
            default: L(() => [
              F(U(V(e.plan.class)), 1)
            ]),
            _: 1
          }, 8, ["severity"]),
          d("span", dv, "Generation " + U(e.generation) + " → " + U(e.plan.generation), 1)
        ]),
        d("p", uv, U(r(Lo)[e.plan.class] || "Review the changes below."), 1),
        m.value ? (c(), y("p", cv, U(m.value), 1)) : e.follows.length ? (c(), y("p", vv, "Existing items in " + U(e.follows.join(", ")) + " will move to the updated process using the state choices above.", 1)) : I("", !0),
        u.value.length ? (c(), y("section", mv, [
          $[1] || ($[1] = d("h3", null, "Flow bindings", -1)),
          (c(!0), y(Z, null, re(u.value, (C) => (c(), y("p", {
            key: C.key
          }, [
            F(U(C.process) + " / " + U(C.state) + " · ", 1),
            d("strong", null, U(f.value.get(C.reference.id) ?? "Published Flow") + " · v" + U(C.reference.version), 1)
          ]))), 128)),
          $[2] || ($[2] = d("p", { class: "work-muted work-small" }, "New entries use these exact published versions. Before replacing a binding, stop new entries, let existing runs and deliveries finish, pause the old launcher, save, then resume entries.", -1))
        ])) : I("", !0),
        Xe(T.$slots, "default"),
        h.value.length ? (c(), y("h3", fv, "Blocked changes")) : I("", !0),
        (c(!0), y(Z, null, re(h.value, (C, D) => (c(), W(r(_o), {
          key: D,
          severity: "error",
          role: "alert"
        }, {
          default: L(() => [
            d("strong", null, U(C.title), 1),
            (c(!0), y(Z, null, re(C.details, (X, te) => (c(), y("p", { key: te }, U(X), 1))), 128)),
            d("p", null, U(x(C.change)), 1),
            d("p", pv, [
              $[3] || ($[3] = F("Reason code ", -1)),
              d("code", null, U(C.change.what), 1)
            ])
          ]),
          _: 2
        }, 1024))), 128)),
        s.value.length ? (c(), y("table", bv, [
          $[4] || ($[4] = d("thead", null, [
            d("tr", null, [
              d("th", { scope: "col" }, "Change"),
              d("th", { scope: "col" }, "Impact")
            ])
          ], -1)),
          d("tbody", null, [
            (c(!0), y(Z, null, re(s.value, (C, D) => (c(), y("tr", { key: D }, [
              d("td", null, [
                d("strong", null, U(C.title), 1),
                (c(!0), y(Z, null, re(C.details, (X, te) => (c(), y("p", { key: te }, U(X), 1))), 128)),
                C.change.count ? (c(), y("p", hv, U(C.change.count) + " " + U(C.change.count === 1 ? "item" : "items"), 1)) : I("", !0)
              ]),
              d("td", null, [
                b(r(Le), {
                  class: "kx-tag-sm",
                  severity: P(C.change.class)
                }, {
                  default: L(() => [
                    F(U(V(C.change.class)), 1)
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
}), gv = {
  key: 0,
  class: "work-stack",
  "aria-label": "Pack conflicts"
}, kv = { class: "work-stack work-tight work-pack-review-field" }, wv = { class: "work-json-disclosure" }, Vv = { class: "work-config-fields" }, $v = { class: "work-json-example" }, xv = { class: "work-json-example" }, Cv = {
  key: 1,
  class: "work-stack",
  "aria-label": "Pack state maps"
}, Sv = /* @__PURE__ */ ge({
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
    function i(o) {
      return t.original.processes?.find((n) => n.id === o)?.name || xe(o);
    }
    function u(o) {
      const [n, ...s] = o.split("."), h = s.join(".");
      return n === "processes" ? i(h) : n === "fields" ? t.original.fields?.find((m) => m.code === h)?.title || xe(h) : n === "item_types" ? t.original.item_types?.find((m) => m.id === h)?.title || xe(h) : xe(n);
    }
    function f(o) {
      return JSON.stringify(o ?? null, null, 2);
    }
    function v(o, n) {
      (t.request.resolutions ??= {})[o] = n, l("change");
    }
    function p(o, n, s) {
      ((t.request.maps ??= {})[o] ??= {})[n] = s, l("change");
    }
    return (o, n) => (c(), y(Z, null, [
      e.plan.conflicts.length ? (c(), y("section", gv, [
        n[3] || (n[3] = d("h3", null, "Local edits conflict", -1)),
        n[4] || (n[4] = d("p", { class: "work-muted work-small" }, "Choose which declaration to keep for each conflict, then review again.", -1)),
        (c(!0), y(Z, null, re(e.plan.conflicts, (s) => (c(), y("div", {
          key: s.path,
          class: "work-stack work-tight"
        }, [
          d("label", kv, [
            F(U(u(s.path)), 1),
            b(r(ue), {
              "model-value": e.request.resolutions?.[s.path],
              "aria-label": "Resolution for " + u(s.path),
              disabled: e.disabled,
              appendTo: "self",
              placeholder: "Choose a resolution",
              optionLabel: "label",
              optionValue: "value",
              options: [{ label: "Keep local edits", value: "local" }, { label: "Use pack changes", value: "incoming" }],
              "onUpdate:modelValue": (h) => v(s.path, h)
            }, null, 8, ["model-value", "aria-label", "disabled", "onUpdate:modelValue"])
          ]),
          d("details", wv, [
            n[2] || (n[2] = d("summary", null, "Compare declarations", -1)),
            d("div", Vv, [
              d("section", null, [
                n[0] || (n[0] = d("h4", null, "Local edits", -1)),
                d("pre", $v, U(f(s.local_value)), 1)
              ]),
              d("section", null, [
                n[1] || (n[1] = d("h4", null, "Pack changes", -1)),
                d("pre", xv, U(f(s.incoming)), 1)
              ])
            ])
          ])
        ]))), 128))
      ])) : I("", !0),
      Object.keys(e.plan.maps).length ? (c(), y("section", Cv, [
        n[5] || (n[5] = d("h3", null, "Required state maps", -1)),
        n[6] || (n[6] = d("p", { class: "work-muted work-small" }, "Review the proposed destinations for existing items. Each destination is editable.", -1)),
        (c(!0), y(Z, null, re(e.plan.maps, (s, h) => (c(), y("div", {
          key: h,
          class: "work-stack"
        }, [
          d("h4", null, U(i(h)), 1),
          (c(!0), y(Z, null, re(s, (m, k) => (c(), y("label", {
            key: k,
            class: "work-stack work-tight work-pack-review-field"
          }, [
            F("Move items from " + U(r(pe)(e.original.processes?.find((V) => V.id === h)?.states.find((V) => V.id === k))), 1),
            b(r(ue), {
              "model-value": e.request.maps?.[h]?.[k],
              "aria-label": "Move items from " + r(pe)(e.original.processes?.find((V) => V.id === h)?.states.find((V) => V.id === k)),
              disabled: e.disabled,
              appendTo: "self",
              optionLabel: "label",
              optionValue: "value",
              options: e.plan.declaration.processes?.find((V) => V.id === h)?.states.map((V) => ({ label: r(pe)(V), value: V.id })) ?? [],
              "onUpdate:modelValue": (V) => p(h, k, V)
            }, null, 8, ["model-value", "aria-label", "disabled", "options", "onUpdate:modelValue"])
          ]))), 128))
        ]))), 128))
      ])) : I("", !0)
    ], 64));
  }
}), Tv = {
  key: 0,
  class: "work-settings-tabs"
}, Dv = { class: "work-section-navigation" }, Iv = {
  key: 1,
  class: "kx-err work-alert-actions"
}, Uv = { role: "alert" }, Ev = {
  key: 2,
  class: "kx-err work-alert-actions"
}, Av = { role: "alert" }, Pv = {
  key: 3,
  class: "work-notice",
  role: "status"
}, Rv = {
  key: 4,
  class: "kx-loading",
  role: "status"
}, Ov = {
  key: 5,
  class: "work-notice",
  role: "alert"
}, Nv = {
  key: 6,
  class: "work-settings-content work-pane"
}, Mv = {
  key: 0,
  class: "work-notice",
  role: "alert"
}, Fv = {
  key: 1,
  class: "work-notice"
}, Lv = { key: 0 }, zv = ["disabled", "inert"], Bv = {
  key: 6,
  class: "work-settings-card work-stack"
}, jv = {
  key: 5,
  class: "kx-empty"
}, qv = {
  key: 6,
  class: "work-muted work-small",
  role: "status"
}, Wv = { class: "work-stack work-tight" }, Kv = {
  key: 0,
  class: "work-muted"
}, Gv = { class: "work-dialog-actions" }, Hv = /* @__PURE__ */ ge({
  __name: "BoardSettings",
  props: {
    boardId: {},
    embedded: { type: Boolean }
  },
  emits: ["dirty-change"],
  setup(e, { emit: a }) {
    const t = e, l = a, i = ai();
    let u, f = "";
    const v = () => JSON.stringify([M.value, x.value, G.value, [...z.value]]), p = ["Fields", "Item types", "Process", "Policy", "Relation types", "Plugins", "Review"], o = j("Fields"), n = j(!1), s = j(""), h = j(/* @__PURE__ */ new Set(["Fields"]));
    Ue(o, (oe) => h.value.add(oe));
    const m = j(), k = j(), V = j(), P = j({}), x = j({}), T = j(), $ = j(!1), C = j(!0), D = j(!1), X = j(""), te = j(""), me = j(""), de = j([]), G = j(), R = j(), N = j(), w = j(), O = j(), se = j(""), q = j([]), $e = H(() => [...q.value, ...w.value?.refused ?? []]), Ce = j(!1), Q = j(0), z = j(/* @__PURE__ */ new Set()), B = j(), g = Xa(), E = Xa(), M = H(() => gl(P.value, m.value?.declaration ?? {})), ie = H(() => z.value.size > 0 || !!G.value || !!m.value && (JSON.stringify(M.value) !== JSON.stringify(m.value.declaration) || Object.keys(x.value).length > 0)), ee = j(!1), he = H(() => ie.value || ee.value);
    Ue(he, (oe) => l("dirty-change", oe), { immediate: !0, flush: "sync" });
    const S = H(() => !!m.value && !!k.value && m.value.generation !== k.value.generation), _ = H(() => $.value && !D.value && !Ce.value && !Et.value && !S.value && !z.value.size && w.value && (w.value.changes.length > 0 || Object.keys(x.value).length > 0) && w.value.class !== "refused" && !w.value.refused.length && O.value?.matches(M.value, m.value?.generation ?? -1, x.value)), A = H(() => de.value.find((oe) => oe.id === G.value?.pack)?.plugins.filter((oe) => !m.value?.plugins?.some((K) => K.plugin === oe.plugin && K.active)).map((oe) => ({ use: oe.plugin })) ?? []), ae = H(() => !!N.value && JSON.stringify(N.value) === JSON.stringify(G.value)), Se = H(() => G.value ? $.value && !D.value && !z.value.size && !S.value && !Et.value && ae.value && w.value?.class !== "refused" && !w.value?.refused.length && R.value?.conflicts.every((oe) => !!G.value?.resolutions?.[oe.path]) : _.value), we = H(() => !!w.value && (!G.value || ae.value)), rt = H(() => de.value.find((oe) => oe.id === m.value?.pack?.id)?.title || "Installed pack"), Je = H(() => !me.value && !!m.value?.outdated && !!de.value.find((oe) => oe.id === m.value?.pack?.id)), sa = H(() => me.value ? "Reload packs to check available upgrades." : Je.value ? ie.value ? "Discard the current draft before upgrading." : Et.value ? "Finish the current migration before upgrading." : D.value ? "Wait for the current request to finish." : void 0 : "Install an available version of this pack to upgrade.");
    function Ut() {
      G.value = void 0, R.value = void 0, N.value = void 0;
    }
    async function mo() {
      if (!m.value?.pack || D.value || ie.value) return;
      const oe = de.value.find((K) => K.id === m.value.pack.id);
      oe && (G.value = kl(oe, m.value.generation), o.value = "Review", await Aa());
    }
    async function fo() {
      const oe = de.value.find((K) => K.id === s.value);
      !m.value || !oe || oe.plugins.some((K) => !K.installed) || D.value || ie.value || (G.value = kl(oe, m.value.generation), n.value = !1, o.value = "Review", await Aa());
    }
    async function Aa() {
      if (!G.value || D.value || !$.value || S.value || z.value.size) return;
      const oe = E(), K = Vt(G.value), ne = JSON.stringify(G.value);
      D.value = !0, X.value = "", te.value = "";
      try {
        const Te = await Bo(K, (Pt) => $t.packPlan(t.boardId, Pt));
        if (!oe() || ne !== JSON.stringify(G.value)) return;
        R.value = Te.plan, w.value = Te.plan, G.value = Te.request, N.value = Vt(G.value), se.value = crypto.randomUUID(), o.value = "Review";
      } catch (Te) {
        oe() && (N.value = void 0, X.value = Ye(Te, "Could not plan the pack upgrade."));
      } finally {
        D.value = !1;
      }
    }
    const fl = H(() => R.value?.declaration ?? O.value?.declaration), po = H(() => {
      const oe = fl.value;
      return !w.value || !oe ? [] : zo(w.value, oe).map((K) => oe.processes?.find((ne) => ne.id === K)?.name || "Untitled process");
    }), Et = H(() => !!k.value?.migration_error || V.value?.status === "migrating");
    function dt() {
      q.value = [], E(), w.value = void 0, O.value = void 0, N.value = void 0, se.value = "";
    }
    Ue([M, x], dt, { deep: !0, flush: "sync" }), Ue(x, (oe) => {
      G.value && (Object.keys(oe).length ? G.value.plugin_configs = Vt(oe) : delete G.value.plugin_configs);
    }, { deep: !0, flush: "sync" });
    function At(oe, K) {
      K ? z.value.delete(oe) : z.value.add(oe), dt();
    }
    function Pa(oe) {
      Ut(), Q.value++, m.value = oe, P.value = Vt(oe.declaration), x.value = {}, z.value.clear(), dt();
    }
    async function et(oe = !1) {
      const K = g();
      try {
        const [ne, Te, Pt] = await Promise.all([St.schema(t.boardId, void 0, !0).catch((ut) => {
          if (ut instanceof Ja && ut.details?.code === "board_schema_missing") return { generation: 0, declaration: {}, compiled: {}, key_prefix: "", as_of: 0 };
          throw ut;
        }), St.options(t.boardId), St.boards()]);
        if (!K()) return;
        if ($.value = Te.access.admin, T.value = Te, V.value = Pt.find((ut) => ut.board_id === t.boardId), !$.value) {
          m.value = void 0, P.value = {}, dt();
          return;
        }
        X.value = "";
        const tt = jo(ne);
        k.value = tt, u !== void 0 && tt.generation >= u ? (u = void 0, f === v() && Pa(tt), f = "") : (oe || !m.value || !ie.value && tt.generation !== m.value.generation) && Pa(tt), S.value && dt(), await pl(K);
      } catch (ne) {
        if (!K()) return;
        ne instanceof Ja && (ne.status === 403 || ne.kind?.toLowerCase() === "permission_denied") && ($.value = !1), dt(), X.value = Ye(ne, "Could not load board settings.");
      } finally {
        K() && (C.value = !1);
      }
    }
    async function pl(oe = () => !0) {
      me.value = "";
      try {
        const K = await St.packs();
        oe() && (de.value = K.filter(qo));
      } catch (K) {
        oe() && (me.value = Ye(K, "Could not load packs."));
      }
    }
    function bo() {
      for (const oe of B.value?.querySelectorAll("input, select, textarea") ?? [])
        if (!(oe.form !== B.value || oe.closest('[style*="display: none"]')) && !oe.reportValidity())
          return !1;
      return !0;
    }
    function ho(oe) {
      o.value = oe, oe === "Review" && !w.value && Ra();
    }
    async function Ra() {
      if (G.value) return Aa();
      if (!m.value || D.value || !$.value || S.value || z.value.size || !bo()) return;
      const oe = E(), K = wl(M.value, m.value.generation, x.value);
      D.value = !0, X.value = "", te.value = "";
      try {
        const ne = await $t.plan(t.boardId, K);
        if (!oe() || z.value.size || !K.matches(M.value, m.value.generation, x.value)) return;
        w.value = ne, O.value = K, se.value = crypto.randomUUID(), o.value = "Review";
      } catch (ne) {
        oe() && (dt(), X.value = Ye(ne, "Could not review changes."), q.value = Wo(ne, M.value));
      } finally {
        D.value = !1;
      }
    }
    async function yo() {
      if (!Se.value) return;
      if (G.value && N.value) {
        D.value = !0, X.value = "";
        const K = v();
        try {
          const ne = await $t.packApply(t.boardId, Vt(N.value), se.value);
          u = ne.generation, f = K, await et(), te.value = ne.status === "done" ? `Pack applied at generation ${ne.generation}.` : "Pack installation continues in the background.";
        } catch (ne) {
          X.value = Ye(ne, "Could not apply the pack upgrade.");
        } finally {
          D.value = !1;
        }
        return;
      }
      if (!O.value) return;
      D.value = !0, X.value = "", te.value = "";
      const oe = v();
      try {
        const K = await $t.apply(t.boardId, O.value, se.value);
        u = K.generation, f = oe, await et(), te.value = `Applied generation ${K.generation} (${K.class}).`;
      } catch (K) {
        X.value = Ye(K, "Could not apply schema.");
      } finally {
        D.value = !1;
      }
    }
    async function go() {
      if (!D.value) {
        D.value = !0, X.value = "";
        try {
          const oe = await $t.resume(t.boardId);
          te.value = oe.resumed ? "Migration resumes." : "Migration is already running.", await et();
        } catch (oe) {
          X.value = Ye(oe, "Could not resume migration.");
        } finally {
          D.value = !1;
        }
      }
    }
    async function ra(oe, K) {
      if (!m.value || !$.value || D.value || Ce.value) return "Wait for the current change to finish.";
      if (S.value) return "Discard the stale draft before removing a definition.";
      const ne = m.value.generation, Te = JSON.stringify(M.value), Pt = Vt(P.value);
      oa(Pt, oe, K), Ce.value = !0;
      try {
        const tt = await $t.plan(t.boardId, wl(gl(Pt, m.value.declaration), ne, x.value));
        if (!$.value || S.value || m.value.generation !== ne || JSON.stringify(M.value) !== Te) return "The draft changes during the check. Try the removal again.";
        const ut = Ko(tt, oe, K);
        if (ut) return ut;
        if (tt.class === "refused") return "Resolve the refused draft changes in Review before removing this definition.";
      } catch (tt) {
        return Ye(tt, "Could not check this removal.");
      } finally {
        Ce.value = !1;
      }
    }
    async function ko() {
      he.value && !await Yo.confirm({ header: "Discard changes?", message: "Your unsaved board settings will be discarded.", acceptLabel: "Discard", rejectLabel: "Keep editing" }) || i({ name: "board", board: t.boardId });
    }
    function wo() {
      u = void 0, k.value && Pa(k.value), te.value = "", X.value = "";
    }
    Ue(() => t.boardId, () => {
      ee.value = !1, u = void 0, Ut(), de.value = [], m.value = void 0, k.value = void 0, V.value = void 0, x.value = {}, z.value.clear(), h.value = /* @__PURE__ */ new Set(["Fields"]), o.value = "Fields", $.value = !1, C.value = !0, et(!0);
    });
    let Oa = () => {
    };
    return Ue(() => t.boardId, (oe) => {
      Oa(), Oa = Ho(`component.${oe}`, () => {
        et();
      });
    }, { immediate: !0 }), So(et), zl(() => {
      Oa(), g(), E();
    }), (oe, K) => (c(), y("section", {
      class: bt(["work-settings-shell", { "work-embedded": e.embedded }])
    }, [
      b(tv, {
        board: V.value,
        embedded: e.embedded,
        generation: m.value?.generation,
        authorized: $.value,
        dirty: ie.value,
        busy: D.value,
        "checking-removal": Ce.value,
        reviewed: we.value,
        pack: m.value?.pack,
        "pack-title": rt.value,
        outdated: m.value?.outdated,
        "upgrade-reason": sa.value,
        "can-upgrade": Je.value && !ie.value && !D.value && !Et.value && $.value,
        onUpgrade: mo,
        onInstall: K[0] || (K[0] = (ne) => n.value = !0),
        disabled: !ie.value || D.value || Ce.value || Et.value || S.value || !!z.value.size || we.value && !Se.value,
        onBack: ko,
        onDiscard: wo,
        onPrimary: K[1] || (K[1] = (ne) => we.value ? yo() : Ra()),
        onSaved: K[2] || (K[2] = (ne) => et()),
        onMetadataDirtyChange: K[3] || (K[3] = (ne) => ee.value = ne)
      }, null, 8, ["board", "embedded", "generation", "authorized", "dirty", "busy", "checking-removal", "reviewed", "pack", "pack-title", "outdated", "upgrade-reason", "can-upgrade", "disabled"]),
      $.value && m.value ? (c(), y("div", Tv, [
        d("div", Dv, [
          b(r(Jo), {
            value: o.value,
            "onUpdate:value": K[4] || (K[4] = (ne) => ho(ne))
          }, {
            default: L(() => [
              b(r(Zo), { "aria-label": "Settings sections" }, {
                default: L(() => [
                  (c(), y(Z, null, re(p, (ne) => b(r(Qo), {
                    key: ne,
                    value: ne
                  }, {
                    default: L(() => [
                      F(U(ne), 1)
                    ]),
                    _: 2
                  }, 1032, ["value"])), 64))
                ]),
                _: 1
              })
            ]),
            _: 1
          }, 8, ["value"])
        ])
      ])) : I("", !0),
      X.value ? (c(), y("div", Iv, [
        d("p", Uv, U(X.value), 1),
        b(r(J), {
          label: "Retry",
          severity: "secondary",
          onClick: K[5] || (K[5] = (ne) => et()),
          outlined: ""
        }, {
          icon: L(() => [
            b(r(le), {
              icon: "tabler:refresh",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        })
      ])) : I("", !0),
      me.value ? (c(), y("div", Ev, [
        d("p", Av, U(me.value), 1),
        b(r(J), {
          label: "Reload packs",
          severity: "secondary",
          outlined: "",
          onClick: K[6] || (K[6] = (ne) => pl())
        }, {
          icon: L(() => [
            b(r(le), {
              icon: "tabler:refresh",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        })
      ])) : I("", !0),
      te.value ? (c(), y("p", Pv, U(te.value), 1)) : I("", !0),
      C.value ? (c(), y("p", Rv, "Loading settings…")) : !$.value && !X.value ? (c(), y("p", Ov, "Board administrator access is required.")) : I("", !0),
      $.value && m.value ? (c(), y("div", Nv, [
        S.value ? (c(), y("div", Mv, "The board advances to generation " + U(k.value?.generation) + " while you edit. Your draft keeps generation " + U(m.value.generation) + ". Discard to load the latest schema before reviewing again.", 1)) : I("", !0),
        Et.value ? (c(), y("div", Fv, [
          d("p", null, [
            K[19] || (K[19] = F("Migration pending", -1)),
            k.value?.migration_error ? (c(), y("span", Lv, ": " + U(k.value.migration_error), 1)) : I("", !0)
          ]),
          b(r(J), {
            label: "Resume migration",
            severity: "secondary",
            disabled: D.value,
            onClick: go,
            outlined: ""
          }, {
            icon: L(() => [
              b(r(le), {
                icon: "tabler:refresh",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled"])
        ])) : I("", !0),
        d("form", {
          ref_key: "editor",
          ref: B,
          onSubmit: Ve(Ra, ["prevent"])
        }, [
          (c(), y("fieldset", {
            key: Q.value,
            class: "work-settings-fieldset",
            disabled: D.value || Ce.value,
            inert: D.value || Ce.value || void 0
          }, [
            h.value.has("Fields") ? at((c(), W(Cs, {
              key: 0,
              "board-id": e.boardId,
              "installed-types": T.value?.installed_types,
              draft: P.value,
              "guard-removal": ra,
              issues: $e.value,
              onValidity: K[7] || (K[7] = (ne, Te) => At("fields:" + ne, Te))
            }, null, 8, ["board-id", "installed-types", "draft", "issues"])), [
              [ct, o.value === "Fields"]
            ]) : I("", !0),
            h.value.has("Item types") ? at((c(), W(qs, {
              key: 1,
              draft: P.value,
              "guard-removal": ra,
              issues: $e.value
            }, null, 8, ["draft", "issues"])), [
              [ct, o.value === "Item types"]
            ]) : I("", !0),
            h.value.has("Process") ? at((c(), W(wu, {
              key: 2,
              "board-id": e.boardId,
              draft: P.value,
              "guard-removal": ra,
              issues: $e.value,
              onValidity: K[8] || (K[8] = (ne, Te) => At("process:" + ne, Te))
            }, null, 8, ["board-id", "draft", "issues"])), [
              [ct, o.value === "Process"]
            ]) : I("", !0),
            h.value.has("Policy") ? at((c(), W(ju, {
              key: 3,
              draft: P.value,
              onValidity: K[9] || (K[9] = (ne, Te) => At("policy:" + ne, Te))
            }, null, 8, ["draft"])), [
              [ct, o.value === "Policy"]
            ]) : I("", !0),
            h.value.has("Relation types") ? at((c(), W(oc, {
              key: 4,
              draft: P.value,
              "guard-removal": ra
            }, null, 8, ["draft"])), [
              [ct, o.value === "Relation types"]
            ]) : I("", !0),
            h.value.has("Plugins") ? at((c(), W(Rl, {
              key: 5,
              "board-id": e.boardId,
              draft: P.value,
              schema: k.value ?? m.value,
              options: T.value?.schema_options.plugins ?? [],
              configs: x.value,
              disabled: D.value,
              onConfigured: K[10] || (K[10] = (ne) => {
                dt(), et();
              }),
              onRefresh: K[11] || (K[11] = (ne) => et()),
              onValidity: K[12] || (K[12] = (ne, Te) => At("plugin:" + ne, Te))
            }, null, 8, ["board-id", "draft", "schema", "options", "configs", "disabled"])), [
              [ct, o.value === "Plugins"]
            ]) : I("", !0),
            h.value.has("Policy") ? at((c(), y("section", Bv, [
              b(Ic, {
                "board-id": e.boardId,
                draft: P.value,
                onValidity: K[13] || (K[13] = (ne) => At("visibility", ne))
              }, null, 8, ["board-id", "draft"])
            ], 512)), [
              [ct, o.value === "Policy"]
            ]) : I("", !0)
          ], 8, zv))
        ], 544),
        o.value === "Review" && !G.value ? (c(), W(xu, {
          key: 2,
          draft: P.value,
          original: m.value.declaration,
          disabled: D.value || Ce.value
        }, null, 8, ["draft", "original", "disabled"])) : I("", !0),
        o.value === "Review" && G.value && A.value.length ? (c(), W(Rl, {
          key: 3,
          "board-id": e.boardId,
          draft: { plugins: A.value },
          schema: k.value ?? m.value,
          options: T.value?.schema_options.plugins.filter((ne) => A.value.some((Te) => Te.use === ne.plugin)) ?? [],
          configs: x.value,
          disabled: D.value,
          "activation-locked": "",
          onValidity: K[14] || (K[14] = (ne, Te) => At("pack-plugin:" + ne, Te))
        }, null, 8, ["board-id", "draft", "schema", "options", "configs", "disabled"])) : I("", !0),
        o.value === "Review" ? (c(), W(yv, {
          key: 4,
          "board-id": e.boardId,
          original: m.value.declaration,
          declaration: fl.value,
          plan: w.value,
          generation: m.value.generation,
          follows: po.value,
          "config-count": Object.keys(x.value).length,
          "pack-review": !!R.value
        }, {
          default: L(() => [
            R.value && G.value ? (c(), W(Sv, {
              key: 0,
              plan: R.value,
              request: G.value,
              original: m.value.declaration,
              disabled: D.value,
              onChange: K[15] || (K[15] = (ne) => {
                N.value = void 0, se.value = "";
              })
            }, null, 8, ["plan", "request", "original", "disabled"])) : I("", !0)
          ]),
          _: 1
        }, 8, ["board-id", "original", "declaration", "plan", "generation", "follows", "config-count", "pack-review"])) : I("", !0),
        o.value === "Review" && !w.value ? (c(), y("p", jv, "Review your draft to see the changes, their impact and any migration required.")) : I("", !0),
        Ce.value ? (c(), y("p", qv, "Checking existing values and dependencies…")) : I("", !0)
      ])) : I("", !0),
      $.value ? (c(), W(Gl, {
        key: 7,
        visible: n.value,
        label: "Install pack",
        busy: D.value,
        onClose: K[18] || (K[18] = (ne) => n.value = !1)
      }, {
        default: L(() => [
          d("form", {
            class: "work-dialog-box work-stack",
            onSubmit: Ve(fo, ["prevent"])
          }, [
            K[21] || (K[21] = d("h2", null, "Install a pack", -1)),
            K[22] || (K[22] = d("p", { class: "work-muted work-small" }, "Packs can be installed on an empty board. Review checks whether this board is eligible.", -1)),
            d("label", Wv, [
              K[20] || (K[20] = F("Pack", -1)),
              b(r(ue), {
                modelValue: s.value,
                "onUpdate:modelValue": K[16] || (K[16] = (ne) => s.value = ne),
                "aria-label": "Pack to install",
                appendTo: "self",
                optionLabel: "title",
                optionValue: "id",
                optionDisabled: "disabled",
                options: de.value.map((ne) => ({ ...ne, disabled: ne.plugins.some((Te) => !Te.installed) }))
              }, null, 8, ["modelValue", "options"])
            ]),
            de.value.length ? I("", !0) : (c(), y("p", Kv, "No available packs were found.")),
            d("footer", Gv, [
              b(r(J), {
                label: "Cancel",
                severity: "secondary",
                outlined: "",
                onClick: K[17] || (K[17] = (ne) => n.value = !1)
              }),
              b(r(J), {
                type: "submit",
                label: "Review pack",
                disabled: !s.value || D.value || ie.value
              }, null, 8, ["disabled"])
            ])
          ], 32)
        ]),
        _: 1
      }, 8, ["visible", "busy"])) : I("", !0)
    ], 2));
  }
}), Yv = /* @__PURE__ */ ge({
  __name: "SettingsRoot",
  setup(e) {
    const a = To(), t = Do();
    return Co(Yl, (l) => t("navigate", { route: li(l) })), (l, i) => (c(), W(Hv, {
      "board-id": r(a).boardId ?? "",
      embedded: r(a).embedded,
      onDirtyChange: i[0] || (i[0] = (u) => r(t)("dirty-change", { dirty: u }))
    }, null, 8, ["board-id", "embedded"]));
  }
}), Xv = Io(Yv, {
  type: "object",
  properties: {
    "board-id": { type: "string", default: "", description: "Board to administer." },
    embedded: { type: "boolean", default: !1, description: "Fits in a System detail pane." }
  }
});
Xo(import.meta.url, Xv);
//# sourceMappingURL=settings.js.map
