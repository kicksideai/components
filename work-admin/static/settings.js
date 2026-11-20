import { inject as wo, defineComponent as fe, ref as B, useSlots as Vo, openBlock as c, createElementBlock as g, createElementVNode as d, createVNode as h, normalizeClass as ft, unref as r, withCtx as L, renderSlot as Ke, toDisplayString as I, createCommentVNode as U, createBlock as q, withDirectives as _e, vShow as dt, computed as H, watch as xe, onMounted as Ca, onUnmounted as Ll, resolveComponent as zl, Fragment as X, renderList as te, createTextVNode as F, resolveDynamicComponent as Ga, onBeforeUnmount as bt, useId as al, withKeys as Ne, withModifiers as he, normalizeStyle as $o, watchEffect as Bl, nextTick as xo, provide as Co } from "vue";
import { e as mt, u as So, b as To, c as Do, a as Uo } from "./mount-B0GaBFyy.js";
import "pinia";
import { Icon as Q } from "@iconify/vue";
import ae from "primevue/select";
import { m as Ha, h as fl, s as ue, i as Io, t as Pe, p as At, g as ll, j as Pt, r as pl, w as xt, l as Ya, k as St, n as Ge, o as pt, u as jl, q as ql, v as Tt, x as Wl, y as ye, z as Sa, d as ol, A as la, c as Eo, B as Ao, C as ha, D as Po, E as $t, F as Ro, _ as Kl, G as No, H as Oo, I as bl, J as kt, e as Gt, K as Mo, L as Fo, M as Lo, N as hl, O as zo, P as yl, Q as Bo, R as gl, S as jo, a as qo, T as kl, U as Wo, V as Ko } from "./latestRequest-DkiZG7QS.js";
import Y from "primevue/button";
import { api as Go, on as Ho, host as Yo, define as Xo } from "@wippy-fe/proxy";
import Oe from "primevue/tag";
import qe from "primevue/toggleswitch";
import zt from "primevue/checkbox";
import ce from "primevue/inputtext";
import ya from "primevue/textarea";
import Ze from "primevue/inputnumber";
import il from "primevue/selectbutton";
import Jo from "primevue/tabs";
import Zo from "primevue/tablist";
import Qo from "primevue/tab";
import _o from "primevue/message";
const Na = (e, a) => e.x > a.x && e.x < a.x + a.width && e.y > a.y && e.y < a.y + a.height;
function ei(e, a, t) {
  return e.x === a.x ? e.x > t.x && e.x < t.x + t.width && Math.max(e.y, a.y) > t.y && Math.min(e.y, a.y) < t.y + t.height : e.y > t.y && e.y < t.y + t.height && Math.max(e.x, a.x) > t.x && Math.min(e.x, a.x) < t.x + t.width;
}
function ht(e, a, t) {
  const l = [.../* @__PURE__ */ new Set([e.x, a.x, ...t.flatMap((V) => [V.x, V.x + V.width])])].sort((V, A) => V - A), i = [.../* @__PURE__ */ new Set([e.y, a.y, ...t.flatMap((V) => [V.y, V.y + V.height])])].sort((V, A) => V - A);
  l.unshift(l[0] - 24), l.push(l.at(-1) + 24), i.unshift(i[0] - 24), i.push(i.at(-1) + 24);
  const u = l.length, m = i.indexOf(a.y) * u + l.indexOf(a.x), v = i.indexOf(e.y) * u + l.indexOf(e.x), p = (V) => ({ x: l[V % u], y: i[Math.floor(V / u)] }), o = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map(), s = [];
  function b(V) {
    s.push(V);
    let A = s.length - 1;
    for (; A; ) {
      const T = A - 1 >> 1;
      if (s[T].priority <= V.priority) break;
      s[A] = s[T], A = T;
    }
    s[A] = V;
  }
  function f() {
    const V = s[0], A = s.pop();
    if (s.length) {
      let T = 0;
      for (; T * 2 + 1 < s.length; ) {
        let P = T * 2 + 1;
        if (P + 1 < s.length && s[P + 1].priority < s[P].priority && P++, A.priority <= s[P].priority) break;
        s[T] = s[P], T = P;
      }
      s[T] = A;
    }
    return V;
  }
  const k = (V) => Math.abs(V.x - a.x) + Math.abs(V.y - a.y);
  for (const V of [0, 1]) {
    const A = v * 2 + V;
    o.set(A, 0), b({ key: A, cost: 0, priority: k(e) });
  }
  const $ = /* @__PURE__ */ new Map(), N = /* @__PURE__ */ new Map();
  for (; s.length; ) {
    const V = f(), A = Math.floor(V.key / 2), T = V.key % 2;
    if (V.cost !== o.get(V.key)) continue;
    if (A === m) {
      const E = [];
      let le = V.key;
      for (; le !== void 0; )
        E.push(p(Math.floor(le / 2))), le = n.get(le);
      return Gl(E.reverse());
    }
    const P = p(A), x = A % u, D = Math.floor(A / u);
    for (const [E, le] of [[x > 0 ? A - 1 : -1, 0], [x + 1 < u ? A + 1 : -1, 0], [D > 0 ? A - u : -1, 1], [D + 1 < i.length ? A + u : -1, 1]]) {
      if (E < 0) continue;
      const z = p(E);
      if ($.has(E) || $.set(E, !t.some((C) => Na(z, C))), !$.get(E)) continue;
      const j = `${Math.min(A, E)}:${Math.max(A, E)}`;
      if (N.has(j) || N.set(j, !t.some((C) => ei(P, z, C))), !N.get(j)) continue;
      const O = V.cost + Math.abs(P.x - z.x) + Math.abs(P.y - z.y) + (T === le ? 0 : 18), ne = E * 2 + le;
      O >= (o.get(ne) ?? 1 / 0) || (o.set(ne, O), n.set(ne, V.key), b({ key: ne, cost: O, priority: O + k(z) }));
    }
  }
  throw new Error("Process map has no collision-free route between its ports: " + JSON.stringify({ start: e, end: a, startInside: t.filter((V) => Na(e, V)), endInside: t.filter((V) => Na(a, V)) }));
}
function Gl(e) {
  const a = [];
  for (const t of e) {
    const l = a.at(-1), i = a.at(-2);
    l && l.x === t.x && l.y === t.y || (i && l && (i.x === l.x && l.x === t.x || i.y === l.y && l.y === t.y) && a.pop(), a.push(t));
  }
  return a;
}
const Wt = (e) => Array.from(e).reduce((a, t) => a + (/[^\x20-\x7e]/u.test(t) ? 16 : /[MW@%]/.test(t) ? 11 : /[ilI.,:;!| ']/.test(t) ? 4 : 7.5), 0);
function Ft(e, a = 28) {
  const t = [];
  let l = "";
  for (const i of e.split(/\s+/u))
    for (let u = 0; u < i.length; u += a) {
      const m = i.slice(u, u + a);
      l && l.length + m.length + 1 > a && (t.push(l), l = ""), l = l ? l + " " + m : m;
    }
  return [...t, l].filter(Boolean);
}
function ra(e) {
  if (e = Gl(e), !e.length) return "";
  let a = `M ${e[0].x} ${e[0].y}`;
  for (let l = 1; l < e.length - 1; l++) {
    const i = e[l - 1], u = e[l], m = e[l + 1], v = Math.hypot(u.x - i.x, u.y - i.y), p = Math.hypot(m.x - u.x, m.y - u.y), o = Math.min(8, v / 3, p / 3);
    o && (a += ` L ${u.x + (i.x - u.x) * o / v} ${u.y + (i.y - u.y) * o / v} Q ${u.x} ${u.y} ${u.x + (m.x - u.x) * o / p} ${u.y + (m.y - u.y) * o / p}`);
  }
  const t = e.at(-1);
  return a + ` L ${t.x} ${t.y}`;
}
function ti(e, a = {}, t = { width: 1400, height: 480 }) {
  const l = t.width < 750 || Ha(e).length > 8 ? "TB" : "LR", i = new fl.graphlib.Graph({ multigraph: !0 });
  i.setGraph({ rankdir: l, ranker: "network-simplex", acyclicer: "greedy", nodesep: 32, edgesep: 32, ranksep: 24, marginx: 32, marginy: 32 }), i.setDefaultEdgeLabel(() => ({}));
  const u = Ha(e), m = new Map(u.map((y, S) => [y.id, S])), v = e.states.map((y) => {
    const S = (e.transitions ?? []).filter((Ue) => Ue.from === "any" && Ue.to === y.id), w = Ft(ue(y)), K = Ft(Io(y, e)), J = S.flatMap((Ue) => Ft(Pe(Ue) + " works from any state")), re = a.policy?.wip?.[y.id]?.limit, de = re === void 0 ? 0 : Wt(" · limit " + re), De = Math.max(168, ...w.map((Ue) => Wt(Ue) + 58), ...K.map((Ue, nt) => Wt(Ue) + 32 + (nt === K.length - 1 ? de : 0)), ...J.map((Ue) => Wt(Ue) + 32)), Me = Math.max(80, 42 + w.length * 18 + K.length * 16 + J.length * 18);
    return i.setNode(y.id, { width: De + (l === "LR" ? 36 : 0), height: Me + (l === "TB" ? 36 : 0) }), { state: y, x: 0, y: 0, width: De, height: Me, title: w, caption: K, badges: S, row: m.has(y.id) ? 0 : 1 };
  }), p = new Set(v.map((y) => y.state.id)), o = (e.transitions ?? []).flatMap((y) => y.from === "any" ? [] : y.from.filter((S) => p.has(S) && p.has(y.to)).map((S) => {
    const w = `${y.id}-${S}`, K = Ft(Pe(y)), J = Math.max(72, ...K.map((de) => Wt(de) + 24)), re = Math.max(24, K.length * 16 + 10);
    return { transition: y, from: S, key: w, lines: K, width: J, height: re };
  })), n = /* @__PURE__ */ new Set(), s = /* @__PURE__ */ new Set(), b = new Set(o.filter((y) => y.from === y.transition.to || y.transition.to === e.initial || ["completed", "canceled"].includes(v.find((S) => S.state.id === y.from).state.category)).map((y) => y.key));
  function f(y) {
    if (!s.has(y)) {
      n.add(y);
      for (const S of o.filter((w) => w.from === y))
        b.has(S.key) || (n.has(S.transition.to) ? b.add(S.key) : f(S.transition.to));
      n.delete(y), s.add(y);
    }
  }
  f(e.initial);
  for (const y of v) f(y.state.id);
  for (const y of o) if (!b.has(y.key)) {
    const S = m.get(y.from), w = m.get(y.transition.to);
    i.setEdge(y.from, y.transition.to, { width: y.width, height: y.height, labelpos: "c", weight: S !== void 0 && w === S + 1 ? 100 : 1 }, y.key);
  }
  for (const y of e.transitions ?? []) if (y.from === "any" && p.has(e.initial) && p.has(y.to) && !m.has(y.to)) {
    const S = e.states.find((w) => w.id === y.to);
    i.setEdge(e.initial, y.to, { minlen: ["completed", "canceled"].includes(S.category) ? Math.max(1, u.length - 1) : 1 }, `any:${y.id}`);
  }
  const k = e.states.flatMap((y) => (y.regions ?? []).filter((S) => p.has(S.initial)).map((S, w) => {
    const K = `lane:${y.id}:${w}`;
    return i.setEdge(y.id, S.initial, {}, K), { state: y, region: S, key: K };
  }));
  if (!v.length) return { nodes: v, edges: [], parallels: [], main: u, direction: l, width: 320, height: 160 };
  fl.layout(i);
  for (const y of v) Object.assign(y, { x: i.node(y.state.id).x, y: i.node(y.state.id).y });
  const $ = l === "TB", N = o.filter((y) => !b.has(y.key)).map((y) => i.edge({ v: y.from, w: y.transition.to, name: y.key })), V = [...v, ...N], A = Math.max(...V.map((y) => y.x + y.width / 2)), T = Math.max(...V.map((y) => y.y + y.height / 2)), P = (y) => v.find((S) => S.state.id === y), x = o.filter((y) => b.has(y.key)).sort((y, S) => {
    const w = $ ? "y" : "x";
    return Math.abs(P(y.from)[w] - P(y.transition.to)[w]) - Math.abs(P(S.from)[w] - P(S.transition.to)[w]);
  }), D = /* @__PURE__ */ new Map(), E = Math.max(0, ...x.map((y) => y.width));
  let le = T + 32;
  for (const [y, S] of x.entries()) {
    const w = P(S.from), K = P(S.transition.to), J = $ ? A + 16 + E + 28 + y * 18 : le + S.height / 2, re = $ ? A + 16 + E / 2 : (w.x + K.x) / 2;
    let de = $ ? w.y + w.height / 2 + 18 : J;
    if ($) for (const De of [...D.values()].sort((Me, Ue) => Me.y - Ue.y))
      de + S.height / 2 + 10 > De.y - De.height / 2 - 10 && de - S.height / 2 - 10 < De.y + De.height / 2 + 10 && (de = De.y + De.height / 2 + 24 + S.height / 2);
    D.set(S.key, { x: re, y: de, corridor: J, height: S.height }), le = J + S.height / 2 + 24;
  }
  const z = o.map((y) => ({ ...y, ...D.get(y.key) ?? i.edge({ v: y.from, w: y.transition.to, name: y.key }) })), j = (y, S) => ({ x: y.x - y.width / 2 - S, y: y.y - y.height / 2 - S, width: y.width + S * 2, height: y.height + S * 2 }), O = [...v.map((y) => j(y, 12)), ...z.map((y) => j(y, 10))], ne = (y, S) => ({
    start: $ ? { x: y.x, y: y.y + y.height / 2 } : { x: y.x + y.width / 2, y: y.y },
    end: $ ? { x: S.x, y: S.y - S.height / 2 } : { x: S.x - S.width / 2, y: S.y }
  }), C = (y, S) => $ ? { x: y.x, y: y.y + S } : { x: y.x + S, y: y.y }, R = z.map((y) => {
    const S = v.find((He) => He.state.id === y.from), w = v.find((He) => He.state.id === y.transition.to), { start: K, end: J } = ne(S, w), re = b.has(y.key), de = C(K, 18), De = C(J, -18), Me = (re || !$ ? y.width : y.height) / 2 + 10, Ue = re ? { x: y.x + ($ ? -Me : Me), y: y.y } : C(y, -Me), nt = re ? { x: y.x + ($ ? Me : -Me), y: y.y } : C(y, Me);
    let at;
    if (re) {
      const { corridor: He } = D.get(y.key), na = $ ? { x: He, y: y.y } : { x: de.x, y: He }, Dt = $ ? { x: He, y: De.y } : { x: De.x, y: He };
      at = $ ? [
        [K, ...ht(de, Ue, O)],
        [nt, na, Dt, ...ht(Dt, De, O), J]
      ] : [
        [K, ...ht(de, na, O), Ue],
        [nt, ...ht(Dt, De, O), J]
      ];
    } else at = [
      [K, ...ht(de, Ue, O)],
      [...ht(nt, De, O), J]
    ];
    const Ia = re ? "return" : m.get(y.transition.to) === (m.get(y.from) ?? -2) + 1 ? "main" : "forward";
    return { ...y, points: at.flat(), segments: at, path: at.map(ra).join(" "), type: Ia, targetOffset: 0 };
  }), M = k.map((y) => {
    const S = v.find((de) => de.state.id === y.state.id), w = v.find((de) => de.state.id === y.region.initial), { start: K, end: J } = ne(S, w), re = [K, ...ht(C(K, 18), C(J, -18), O), J];
    return { state: y.state, key: y.key, points: re, path: ra(re) };
  }), Z = [...v.flatMap((y) => [{ x: y.x - y.width / 2, y: y.y - y.height / 2 }, { x: y.x + y.width / 2, y: y.y + y.height / 2 }]), ...R.flatMap((y) => [...y.points, { x: y.x - y.width / 2, y: y.y - y.height / 2 }, { x: y.x + y.width / 2, y: y.y + y.height / 2 }]), ...M.flatMap((y) => y.points)], ve = 32 - Math.min(...Z.map((y) => y.x)), be = 32 - Math.min(...Z.map((y) => y.y)), ge = Math.max(...Z.map((y) => y.x)) + ve + 32, Ve = Math.max(...Z.map((y) => y.y)) + be + 32, Ee = (y) => ({ x: y.x + ve, y: y.y + be });
  for (const y of v) Object.assign(y, Ee(y));
  for (const y of R)
    Object.assign(y, Ee(y)), y.segments = y.segments.map((S) => S.map(Ee)), y.points = y.segments.flat(), y.path = y.segments.map(ra).join(" ");
  for (const y of M)
    y.points = y.points.map(Ee), y.path = ra(y.points);
  return { nodes: v, edges: R, parallels: M, main: u, direction: l, width: ge, height: Ve };
}
const Hl = Symbol("work-navigation");
function ai() {
  return wo(Hl, () => {
  });
}
function li(e) {
  if (e.name === "boards") return "";
  const a = encodeURIComponent(e.board);
  return e.name === "settings" ? `${a}/settings` : a;
}
const Rt = (e) => `/api/v1/work/boards/${encodeURIComponent(e)}`, wl = (e) => ({ declaration: e.declaration, expected_generation: e.expected_generation, plugin_configs: e.plugin_configs }), wt = {
  packPlan: (e, a) => At(`${Rt(e)}/pack_plan`, a, "Pack plan"),
  packApply: (e, a, t) => At(`${Rt(e)}/pack_apply`, { ...a, key: t }, "Apply pack"),
  plan: (e, a) => At(`${Rt(e)}/plan_schema`, wl(a), "Schema plan"),
  apply: (e, a, t) => At(`${Rt(e)}/apply_schema`, { ...wl(a), key: t }, "Apply schema"),
  resume: (e) => At(`${Rt(e)}/resume_migration`, {}, "Resume migration"),
  configure: (e, a, t) => At(`${Rt(e)}/configure_plugin`, { plugin: a, config: t }, "Configure plugin")
}, oi = { class: "work-definition" }, ii = { class: "work-definition-head" }, ni = { class: "work-definition-affordances" }, si = ["title"], ri = { class: "work-definition-code" }, di = ["title"], ui = { class: "work-definition-kind" }, ci = { class: "work-definition-flags" }, vi = { class: "work-definition-usage" }, mi = { class: "work-definition-actions" }, fi = {
  key: 0,
  class: "work-definition-description"
}, pi = { class: "work-definition-body work-stack" }, Ta = /* @__PURE__ */ fe({
  __name: "DefinitionRow",
  props: {
    title: {},
    code: {},
    kind: {},
    description: {}
  },
  setup(e) {
    const a = B(!1), t = Vo();
    return (l, i) => (c(), g("article", oi, [
      d("header", ii, [
        h(ll, {
          as: "article",
          class: ft(["work-definition-toggle", { "work-definition-has-handle": r(t).handle }]),
          "aria-expanded": a.value,
          onActivate: i[0] || (i[0] = (u) => a.value = !a.value)
        }, {
          default: L(() => [
            d("span", ni, [
              Ke(l.$slots, "handle"),
              h(r(Q), {
                icon: a.value ? "tabler:chevron-down" : "tabler:chevron-right"
              }, null, 8, ["icon"])
            ]),
            d("span", {
              class: "work-row-title",
              title: e.title
            }, I(e.title), 9, si)
          ]),
          _: 3
        }, 8, ["class", "aria-expanded"]),
        d("span", ri, [
          e.code ? (c(), g("code", {
            key: 0,
            class: "work-mono",
            title: e.code
          }, I(e.code), 9, di)) : U("", !0)
        ]),
        d("span", ui, [
          e.kind ? (c(), q(r(Oe), {
            key: 0,
            severity: "secondary",
            value: e.kind
          }, null, 8, ["value"])) : U("", !0)
        ]),
        d("span", ci, [
          Ke(l.$slots, "flags")
        ]),
        d("div", vi, [
          Ke(l.$slots, "usage")
        ]),
        d("div", mi, [
          Ke(l.$slots, "actions")
        ]),
        e.description ? (c(), g("p", fi, I(e.description), 1)) : U("", !0)
      ]),
      _e(d("div", pi, [
        Ke(l.$slots, "default")
      ], 512), [
        [dt, a.value]
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
}, Da = /* @__PURE__ */ fe({
  __name: "DefinitionList",
  props: {
    count: {},
    columns: {}
  },
  setup(e) {
    return (a, t) => (c(), g("div", bi, [
      d("div", {
        class: ft(["work-field-builder", "work-definitions-" + e.columns])
      }, [
        e.count > 3 ? (c(), g("div", hi, [
          t[0] || (t[0] = d("span", null, null, -1)),
          t[1] || (t[1] = d("span", null, "Name", -1)),
          e.columns !== "plugins" ? (c(), g("span", yi, "Identifier")) : U("", !0),
          d("span", null, I(e.columns === "plugins" ? "State" : e.columns === "types" ? "Process" : "Kind"), 1),
          e.columns === "fields" || e.columns === "plugins" ? (c(), g("span", gi, "Details")) : U("", !0),
          e.columns !== "plugins" ? (c(), g("span", ki, I(e.columns === "fields" ? "Used by" : "Details"), 1)) : U("", !0),
          t[2] || (t[2] = d("span", null, null, -1))
        ])) : U("", !0),
        Ke(a.$slots, "default")
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
}, Ui = ["inert"], Ii = ["value"], Ei = {
  key: 1,
  class: "work-muted"
}, Ai = ["inert"], Pi = ["value"], Ri = {
  key: 1,
  class: "work-muted"
}, Ni = {
  key: 11,
  class: "work-stack work-tight"
}, Oi = {
  class: "work-stack work-tight",
  "aria-label": "Matching items"
}, Mi = { class: "work-mono" }, Fi = {
  key: 15,
  class: "work-error work-small",
  role: "alert"
}, Yl = /* @__PURE__ */ fe({
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
    const t = e, l = a, i = H(() => t.inputId ?? `field-${t.field.code}`), u = H(() => !!t.field.cardinality && t.field.cardinality !== "one"), m = H(() => Array.isArray(t.modelValue) ? t.modelValue : []), v = H(() => t.modelValue == null ? "" : typeof t.modelValue == "object" ? Pt(t.modelValue) : String(t.modelValue)), p = H(() => {
      const S = t.modelValue;
      return S && typeof S == "object" && "ref" in S && Array.isArray(S.ref) ? String(S.ref[1] ?? "") : "";
    }), o = H(() => t.disabled || pl(t.field)), n = B(!1), s = B(!1), b = B(!1), f = B(""), k = B(""), $ = B([]), N = Ya(), V = B([]);
    let A = 0, T;
    const P = /* @__PURE__ */ new Set();
    xe(m, (S) => {
      V.value = T ?? S.map((w, K) => V.value[K] ?? A++), T = void 0;
    }, { immediate: !0 });
    function x(S) {
      l("update:modelValue", S);
    }
    function D(S, w) {
      const K = [...m.value];
      K[S] = w, x(K);
    }
    function E(S, w) {
      w ? P.delete(S) : P.add(S), l("validity", !P.size);
    }
    function le(S) {
      P.delete(V.value[S]), l("validity", !P.size), T = V.value.filter((w, K) => K !== S), x(m.value.filter((w, K) => K !== S));
    }
    function z() {
      T = [...V.value, A++], x([...m.value, t.field.form === "bool" ? !1 : t.field.form === "record" ? {} : ""]);
    }
    function j(S) {
      const w = S.detail, K = w?.principal_id ?? w?.id;
      x(K ? { kind: w.type ?? "user", id: K } : void 0);
    }
    function O(S) {
      const w = S.detail;
      x(w?.thread_id ? { ref: ["component", w.thread_id] } : void 0);
    }
    const ne = B("");
    let C = "";
    xe(() => t.modelValue, (S) => {
      const w = JSON.stringify(S ?? {}, null, 2);
      w !== C && (C = w, ne.value = w, f.value = "", l("validity", !0));
    }, { immediate: !0 });
    function R(S) {
      ne.value = S;
      try {
        const w = JSON.parse(S);
        if (!w || typeof w != "object" || Array.isArray(w)) throw new Error("Enter a JSON object.");
        if (t.field.type === "rich_text" && !("type" in w && typeof w.type == "string")) throw new Error("The document needs a type.");
        C = JSON.stringify(w, null, 2), f.value = "", l("validity", !0), x(w);
      } catch (w) {
        f.value = w instanceof Error ? w.message : "Invalid JSON.", l("validity", !1);
      }
    }
    function M(S) {
      if (!S) {
        l("validity", !0), x(void 0);
        return;
      }
      const w = Number.isFinite(Number(S)) && (t.field.form !== "int" || Number.isSafeInteger(Number(S)));
      l("validity", w), w && x(t.field.form === "int" ? Number(S) : S);
    }
    const Z = H(() => t.field.config?.format === "date");
    function ve(S) {
      x(S ? Z.value ? S : new Date(S).toISOString() : void 0);
    }
    const be = H(() => {
      if (typeof t.modelValue != "string") return "";
      if (Z.value) return t.modelValue.slice(0, 10);
      const S = new Date(t.modelValue);
      return Number.isNaN(S.getTime()) ? "" : new Date(S.getTime() - S.getTimezoneOffset() * 6e4).toISOString().slice(0, 16);
    });
    function ge(S) {
      x(S.detail?.ref);
    }
    function Ve(S) {
      x(S.detail?.value);
    }
    let Ee;
    xe(k, () => {
      const S = N();
      if (clearTimeout(Ee), !k.value.trim()) {
        $.value = [];
        return;
      }
      Ee = setTimeout(async () => {
        try {
          const w = k.value.trim(), K = /^[A-Z][A-Z0-9]{1,9}-[0-9]+$/.test(w) ? [(await xt.item(t.boardId, { key: w })).item] : (await xt.query(t.boardId, { where: { field: "title", op: "contains", value: w }, limit: 8 })).items;
          S() && ($.value = K, f.value = "");
        } catch (w) {
          S() && (f.value = w instanceof Error ? w.message : "Could not search items.");
        }
      }, 200);
    });
    function y(S) {
      x({ board: t.boardId, item: S.id }), k.value = "", $.value = [];
    }
    Ca(async () => {
      t.field.type === "principal" ? n.value = await mt("wc-principal-picker") : t.field.config?.target === "component" && (n.value = await mt("wc-component-picker"));
    });
    for (const [S, w] of [[() => t.editorTag, b], [() => t.linkTag, s]])
      xe(S, async (K, J, re) => {
        let de = !0;
        if (re(() => {
          de = !1;
        }), w.value = !1, K) {
          const De = await mt(K);
          de && (w.value = De);
        }
      }, { immediate: !0 });
    return Ll(() => {
      clearTimeout(Ee), N();
    }), (S, w) => {
      const K = zl("FieldControl", !0);
      return c(), g("div", xi, [
        r(pl)(e.field) ? (c(), g("output", {
          key: 0,
          id: i.value,
          class: "work-read-value"
        }, I(r(Pt)(e.modelValue, e.field)), 9, Ci)) : u.value ? (c(), g("div", Si, [
          d("div", Ti, [
            (c(!0), g(X, null, te(m.value, (J, re) => (c(), q(r(Oe), {
              key: V.value[re],
              class: "kx-tag-sm",
              severity: "secondary"
            }, {
              default: L(() => [
                F(I(r(Pt)(J, e.field)) + " ", 1),
                h(r(Y), {
                  type: "button",
                  class: "work-icon-button",
                  disabled: o.value,
                  "aria-label": "Remove value " + (re + 1),
                  onClick: (de) => le(re),
                  severity: "secondary",
                  text: "",
                  size: "small"
                }, {
                  default: L(() => [
                    h(r(Q), {
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
          (c(!0), g(X, null, te(m.value, (J, re) => (c(), g("div", {
            key: V.value[re],
            class: "work-stack work-tight"
          }, [
            h(K, {
              "board-id": e.boardId,
              field: { ...e.field, cardinality: "one" },
              "model-value": J,
              "input-id": i.value + "-" + V.value[re],
              disabled: o.value,
              "editor-tag": e.editorTag,
              "link-tag": e.linkTag,
              "onUpdate:modelValue": (de) => D(re, de),
              onValidity: (de) => E(V.value[re], de)
            }, null, 8, ["board-id", "field", "model-value", "input-id", "disabled", "editor-tag", "link-tag", "onUpdate:modelValue", "onValidity"])
          ]))), 128)),
          h(r(Y), {
            label: "Add value",
            severity: "secondary",
            size: "small",
            disabled: o.value,
            onClick: z,
            outlined: ""
          }, {
            icon: L(() => [
              h(r(Q), {
                icon: "tabler:plus",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled"])
        ])) : e.editorTag && b.value ? (c(), q(Ga(e.editorTag), {
          key: 2,
          "board-id": e.boardId,
          value: JSON.stringify(e.modelValue ?? null),
          config: JSON.stringify(e.field.config ?? {}),
          readonly: o.value || void 0,
          onChange: Ve
        }, null, 40, ["board-id", "value", "config", "readonly"])) : e.linkTag && s.value ? (c(), q(Ga(e.linkTag), {
          key: 3,
          "board-id": e.boardId,
          kind: e.field.config?.target ?? e.field.type,
          value: JSON.stringify(e.modelValue ?? null),
          readonly: o.value || void 0,
          onChange: ge
        }, null, 40, ["board-id", "kind", "value", "readonly"])) : e.field.type === "option" ? (c(), q(r(ae), {
          key: 4,
          placeholder: "Not set",
          inputId: i.value,
          "model-value": e.modelValue ?? "",
          disabled: o.value,
          "onUpdate:modelValue": w[0] || (w[0] = (J) => x(J || void 0)),
          appendTo: "self",
          optionLabel: "label",
          optionValue: "value",
          optionDisabled: "disabled",
          options: [{ label: "Not set", value: "", disabled: !1 }, ...(e.field.options ?? []).map((J) => ({ label: J.label ?? J.id, value: J.id, disabled: !1 }))]
        }, null, 8, ["inputId", "model-value", "disabled", "options"])) : e.field.form === "bool" ? (c(), g("label", Di, [
          h(r(zt), {
            inputId: i.value,
            "model-value": e.modelValue === !0,
            disabled: o.value,
            "onUpdate:modelValue": w[1] || (w[1] = (J) => x(J)),
            binary: ""
          }, null, 8, ["inputId", "model-value", "disabled"]),
          F(I(e.modelValue === !0 ? "Yes" : e.modelValue === !1 ? "No" : "Not set"), 1)
        ])) : e.field.form === "int" ? (c(), q(r(Ze), {
          key: 6,
          inputId: i.value,
          "model-value": v.value === "" ? null : Number(v.value),
          disabled: o.value,
          "onUpdate:modelValue": w[2] || (w[2] = (J) => M(J == null ? "" : String(J))),
          useGrouping: !1
        }, null, 8, ["inputId", "model-value", "disabled"])) : e.field.form === "dec" ? (c(), q(r(ce), {
          key: 7,
          id: i.value,
          inputmode: "decimal",
          "model-value": v.value,
          disabled: o.value,
          "onUpdate:modelValue": w[3] || (w[3] = (J) => M(J ?? ""))
        }, null, 8, ["id", "model-value", "disabled"])) : e.field.form === "time" ? (c(), q(r(ce), {
          key: 8,
          id: i.value,
          type: Z.value ? "date" : "datetime-local",
          value: be.value,
          disabled: o.value,
          onInput: w[4] || (w[4] = (J) => ve(J.target.value))
        }, null, 8, ["id", "type", "value", "disabled"])) : e.field.type === "principal" ? (c(), g("div", {
          key: 9,
          inert: o.value || void 0,
          class: "work-stack work-tight"
        }, [
          n.value ? (c(), g("wc-principal-picker", {
            key: 0,
            value: JSON.stringify(e.modelValue ?? {}),
            kinds: "user,group",
            onConfigChanged: j
          }, null, 40, Ii)) : (c(), g("span", Ei, I(r(Pt)(e.modelValue, e.field)) + " · Person picker is unavailable.", 1))
        ], 8, Ui)) : e.field.config?.target === "component" ? (c(), g("div", {
          key: 10,
          inert: o.value || void 0
        }, [
          n.value ? (c(), g("wc-component-picker", {
            key: 0,
            value: JSON.stringify({ thread_id: p.value }),
            onChange: O
          }, null, 40, Pi)) : (c(), g("span", Ri, "Component picker is unavailable."))
        ], 8, Ai)) : e.field.type === "item" ? (c(), g("div", Ni, [
          h(r(Oe), {
            class: "kx-tag-sm",
            severity: "secondary"
          }, {
            default: L(() => [
              F(I(r(Pt)(e.modelValue, e.field)), 1)
            ]),
            _: 1
          }),
          h(r(ce), {
            id: i.value,
            modelValue: k.value,
            "onUpdate:modelValue": w[5] || (w[5] = (J) => k.value = J),
            disabled: o.value,
            placeholder: "Search a title or enter an item key",
            "aria-label": "Search items"
          }, null, 8, ["id", "modelValue", "disabled"]),
          d("div", Oi, [
            (c(!0), g(X, null, te($.value, (J) => (c(), q(ll, {
              key: J.id,
              class: "work-match-item",
              disabled: o.value,
              onActivate: (re) => y(J)
            }, {
              default: L(() => [
                d("code", Mi, I(J.key), 1),
                d("span", null, I(r(Pt)(J.values.title)), 1)
              ]),
              _: 2
            }, 1032, ["disabled", "onActivate"]))), 128))
          ]),
          e.modelValue ? (c(), q(r(Y), {
            key: 0,
            label: "Clear reference",
            severity: "secondary",
            size: "small",
            disabled: o.value,
            onClick: w[6] || (w[6] = (J) => x(void 0)),
            outlined: ""
          }, {
            icon: L(() => [
              h(r(Q), {
                icon: "tabler:list-check",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled"])) : U("", !0)
        ])) : e.field.form === "record" || e.field.type === "rich_text" || e.field.form === "quantity" || e.field.form === "ref" ? (c(), q(r(ya), {
          key: 12,
          id: i.value,
          "model-value": ne.value,
          rows: "3",
          disabled: o.value,
          "aria-invalid": !!f.value,
          "onUpdate:modelValue": w[7] || (w[7] = (J) => R(J ?? ""))
        }, null, 8, ["id", "model-value", "disabled", "aria-invalid"])) : e.field.code === "description" ? (c(), q(r(ya), {
          key: 13,
          id: i.value,
          "model-value": v.value,
          rows: "4",
          disabled: o.value,
          "onUpdate:modelValue": w[8] || (w[8] = (J) => x(J))
        }, null, 8, ["id", "model-value", "disabled"])) : (c(), q(r(ce), {
          key: 14,
          id: i.value,
          "model-value": v.value,
          disabled: o.value,
          "onUpdate:modelValue": w[9] || (w[9] = (J) => x(J))
        }, null, 8, ["id", "model-value", "disabled"])),
        f.value ? (c(), g("span", Fi, I(f.value), 1)) : U("", !0)
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
}, Kt = /* @__PURE__ */ fe({
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
    const t = e, l = a, i = H(() => "$actor" in St(t.modelValue) ? "actor" : "$now" in St(t.modelValue) ? "now" : "literal"), u = B(""), m = B("");
    xe(() => t.modelValue, (o) => {
      u.value = JSON.stringify(o ?? []), m.value = "";
    }, { immediate: !0 });
    function v(o) {
      l("update:modelValue", o === "actor" ? { $actor: "id" } : o === "now" ? { $now: "P0D" } : void 0), l("validity", !0);
    }
    function p(o) {
      u.value = o;
      try {
        const n = JSON.parse(o);
        if (!Array.isArray(n)) throw new Error("Enter a JSON list.");
        m.value = "", l("validity", !0), l("update:modelValue", n);
      } catch (n) {
        m.value = n instanceof Error ? n.message : "Invalid values.", l("validity", !1);
      }
    }
    return (o, n) => (c(), g("div", Li, [
      d("label", zi, [
        F(I(e.label), 1),
        h(r(ae), {
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
      i.value === "now" ? (c(), q(r(ce), {
        key: 0,
        "aria-label": e.label + " time offset",
        value: r(St)(e.modelValue).$now,
        disabled: e.disabled,
        placeholder: "-P7D",
        onInput: n[1] || (n[1] = (s) => l("update:modelValue", { $now: s.target.value }))
      }, null, 8, ["aria-label", "value", "disabled"])) : i.value === "actor" ? (c(), g("span", Bi, "The signed-in actor’s id")) : e.multiple ? (c(), g("div", ji, [
        d("label", qi, [
          n[5] || (n[5] = F("Values as JSON (operands may appear in the list)", -1)),
          h(r(ya), {
            class: "work-mono",
            "aria-label": e.label + " values",
            value: u.value,
            disabled: e.disabled,
            rows: "2",
            onInput: n[2] || (n[2] = (s) => p(s.target.value))
          }, null, 8, ["aria-label", "value", "disabled"])
        ]),
        m.value ? (c(), g("p", Wi, I(m.value), 1)) : U("", !0)
      ])) : (c(), q(Yl, {
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
}, tn = { class: "work-row work-wrap" }, an = /* @__PURE__ */ fe({
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
    const t = e, l = a, i = H(() => t.path ?? "where"), u = H(() => t.depth ?? 1), m = H(() => ["and", "or", "not", "history", "match", "rel", "children"].find((j) => j in t.modelValue) ?? "field"), v = H(() => Vi(t.schema)), p = H(() => v.value.find((j) => j.code === t.modelValue.field) ?? { code: "value", form: "text" }), o = H(() => St(t.modelValue.history)), n = H(() => v.value.find((j) => j.code === o.value.field) ?? { code: "history", form: "text" }), s = H(() => Array.isArray(t.modelValue[m.value]) ? t.modelValue[m.value] : []), b = () => ({ field: "category", op: "eq", value: "unstarted" }), f = B(/* @__PURE__ */ new Set());
    function k(j, O) {
      O ? f.value.delete(j) : f.value.add(j), l("validity", f.value.size === 0);
    }
    xe(m, () => {
      f.value.clear(), l("validity", !0);
    });
    function $(j) {
      const O = /* @__PURE__ */ new Set();
      for (const ne of f.value) {
        const C = Number(ne);
        !Number.isNaN(C) && C !== j && O.add(String(C > j ? C - 1 : C));
      }
      f.value = O, l("validity", O.size === 0), V({ [m.value]: s.value.filter((ne, C) => C !== j) });
    }
    function N(j) {
      l("update:modelValue", j);
    }
    function V(j) {
      N({ ...t.modelValue, ...j });
    }
    function A(j) {
      N(j === "field" ? b() : j === "and" || j === "or" ? { [j]: [b()] } : j === "not" ? { not: b() } : j === "history" ? { history: { field: "state", changed: !0 } } : j === "match" ? { match: "" } : j === "children" ? { children: !0, q: "some", where: b() } : { rel: t.schema.compiled.relation_types?.[0]?.id ?? "", dir: "outward", q: "some", where: b() });
    }
    function T(j, O) {
      V({ [m.value]: s.value.map((ne, C) => C === j ? O : ne) });
    }
    function P(j, O) {
      const ne = { ...o.value };
      O === void 0 ? (delete ne[j], k(j, !0)) : ne[j] = O, V({ history: ne });
    }
    function x(j) {
      f.value.clear(), l("validity", !0);
      const O = { ...o.value };
      delete O.was, delete O.changed, delete O.from, delete O.to, O[j] = j === "changed" ? !0 : "", V({ history: O });
    }
    const D = { code: "actor", form: "text" }, E = { code: "at", form: "time" }, le = H(() => Array.isArray(o.value.during) ? o.value.during : []);
    function z(j, O) {
      const ne = [...le.value];
      ne[j] = O, P("during", ne);
    }
    return (j, O) => {
      const ne = zl("FilterNode", !0);
      return c(), g("fieldset", {
        class: "work-filter-node",
        disabled: e.disabled
      }, [
        d("legend", Gi, I(i.value), 1),
        d("label", Hi, [
          O[21] || (O[21] = F("Condition", -1)),
          h(r(ae), {
            "aria-label": i.value + " condition",
            "model-value": m.value,
            "onUpdate:modelValue": O[0] || (O[0] = (C) => A(C)),
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            optionDisabled: "disabled",
            options: [{ label: "Field", value: "field", disabled: !1 }, ...["and", "or", "not", "history", "rel", "children", "match"].map((C) => ({ label: C, value: C, disabled: u.value >= 6 && ["and", "or", "not", "rel", "children"].includes(C) }))]
          }, null, 8, ["aria-label", "model-value", "options"])
        ]),
        m.value === "and" || m.value === "or" ? (c(), g(X, { key: 0 }, [
          (c(!0), g(X, null, te(s.value, (C, R) => (c(), g("div", {
            key: R,
            class: "work-stack work-tight"
          }, [
            h(ne, {
              "board-id": e.boardId,
              schema: e.schema,
              "model-value": C,
              path: i.value + "." + m.value + "[" + R + "]",
              depth: u.value + 1,
              "onUpdate:modelValue": (M) => T(R, M),
              onValidity: (M) => k(String(R), M)
            }, null, 8, ["board-id", "schema", "model-value", "path", "depth", "onUpdate:modelValue", "onValidity"]),
            h(r(Y), {
              label: "Remove condition",
              size: "small",
              severity: "secondary",
              onClick: (M) => $(R),
              outlined: ""
            }, {
              icon: L(() => [
                h(r(Q), {
                  icon: "tabler:trash",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["onClick"])
          ]))), 128)),
          h(r(Y), {
            label: "Add condition",
            size: "small",
            severity: "secondary",
            disabled: u.value >= 6,
            onClick: O[1] || (O[1] = (C) => V({ [m.value]: [...s.value, b()] })),
            outlined: ""
          }, {
            icon: L(() => [
              h(r(Q), {
                icon: "tabler:plus",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled"])
        ], 64)) : m.value === "not" ? (c(), q(ne, {
          key: 1,
          "board-id": e.boardId,
          schema: e.schema,
          "model-value": r(St)(e.modelValue.not),
          path: i.value + ".not",
          depth: u.value + 1,
          "onUpdate:modelValue": O[2] || (O[2] = (C) => V({ not: C })),
          onValidity: O[3] || (O[3] = (C) => k("nested", C))
        }, null, 8, ["board-id", "schema", "model-value", "path", "depth"])) : m.value === "field" ? (c(), g(X, { key: 2 }, [
          d("div", Yi, [
            d("label", null, [
              O[22] || (O[22] = F("Field", -1)),
              h(r(ae), {
                "aria-label": i.value + " field",
                "model-value": e.modelValue.field,
                "onUpdate:modelValue": O[4] || (O[4] = (C) => V({ field: C, op: "eq", value: void 0 })),
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                optionDisabled: "disabled",
                options: [...(v.value ?? []).map((C) => ({ label: r(Ge)(C), value: C.code, disabled: !1 }))]
              }, null, 8, ["aria-label", "model-value", "options"])
            ]),
            d("label", null, [
              O[23] || (O[23] = F("Operator", -1)),
              h(r(ae), {
                "aria-label": i.value + " operator",
                "model-value": e.modelValue.op,
                "onUpdate:modelValue": O[5] || (O[5] = (C) => V({ op: C, value: C === "is_null" ? !0 : void 0 })),
                appendTo: "self",
                options: r($i)(p.value)
              }, null, 8, ["aria-label", "model-value", "options"])
            ])
          ]),
          h(Kt, {
            "board-id": e.boardId,
            field: e.modelValue.op === "is_null" ? { code: "null", form: "bool" } : p.value,
            "model-value": e.modelValue.value,
            multiple: ["in", "nin", "between"].includes(String(e.modelValue.op)),
            label: i.value + " value",
            "onUpdate:modelValue": O[6] || (O[6] = (C) => V({ value: C })),
            onValidity: O[7] || (O[7] = (C) => k("value", C))
          }, null, 8, ["board-id", "field", "model-value", "multiple", "label"])
        ], 64)) : m.value === "match" ? (c(), g("label", Xi, [
          O[24] || (O[24] = F("Search", -1)),
          h(r(ce), {
            "aria-label": i.value + " search",
            value: e.modelValue.match,
            onInput: O[8] || (O[8] = (C) => V({ match: C.target.value }))
          }, null, 8, ["aria-label", "value"])
        ])) : m.value === "history" ? (c(), g(X, { key: 4 }, [
          d("div", Ji, [
            d("label", null, [
              O[25] || (O[25] = F("Field", -1)),
              h(r(ae), {
                "aria-label": i.value + " history field",
                "model-value": o.value.field,
                "onUpdate:modelValue": O[9] || (O[9] = (C) => P("field", C)),
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                optionDisabled: "disabled",
                options: [...(v.value ?? []).map((C) => ({ label: r(Ge)(C), value: C.code, disabled: !1 }))]
              }, null, 8, ["aria-label", "model-value", "options"])
            ]),
            d("label", null, [
              O[26] || (O[26] = F("History", -1)),
              h(r(ae), {
                "aria-label": i.value + " history mode",
                "model-value": o.value.changed ? "changed" : "was",
                "onUpdate:modelValue": O[10] || (O[10] = (C) => x(C)),
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                optionDisabled: "disabled",
                options: [{ label: "Changed", value: "changed", disabled: !1 }, { label: "Was", value: "was", disabled: !1 }]
              }, null, 8, ["aria-label", "model-value"])
            ])
          ]),
          o.value.changed ? (c(), g(X, { key: 0 }, te(["from", "to"], (C) => d("div", { key: C }, [
            d("label", Zi, [
              h(r(zt), {
                "model-value": C in o.value,
                "aria-label": "Constrain " + C,
                "onUpdate:modelValue": (R) => P(C, R ? "" : void 0),
                binary: ""
              }, null, 8, ["model-value", "aria-label", "onUpdate:modelValue"]),
              F(I(C), 1)
            ]),
            C in o.value ? (c(), q(Kt, {
              key: 0,
              "board-id": e.boardId,
              field: n.value,
              "model-value": o.value[C],
              label: i.value + " history " + C,
              "onUpdate:modelValue": (R) => P(C, R),
              onValidity: (R) => k(C, R)
            }, null, 8, ["board-id", "field", "model-value", "label", "onUpdate:modelValue", "onValidity"])) : U("", !0)
          ])), 64)) : (c(), q(Kt, {
            key: 1,
            "board-id": e.boardId,
            field: n.value,
            "model-value": o.value.was,
            label: i.value + " history was",
            "onUpdate:modelValue": O[11] || (O[11] = (C) => P("was", C)),
            onValidity: O[12] || (O[12] = (C) => k("was", C))
          }, null, 8, ["board-id", "field", "model-value", "label"])),
          d("label", Qi, [
            h(r(zt), {
              "model-value": "by" in o.value,
              "aria-label": "Constrain actor",
              "onUpdate:modelValue": O[13] || (O[13] = (C) => P("by", C ? { $actor: "id" } : void 0)),
              binary: ""
            }, null, 8, ["model-value"]),
            O[27] || (O[27] = F("By actor", -1))
          ]),
          "by" in o.value ? (c(), q(Kt, {
            key: 2,
            "board-id": e.boardId,
            field: D,
            "model-value": o.value.by,
            label: i.value + " history by",
            "onUpdate:modelValue": O[14] || (O[14] = (C) => P("by", C))
          }, null, 8, ["board-id", "model-value", "label"])) : U("", !0),
          d("label", _i, [
            h(r(zt), {
              "model-value": "during" in o.value,
              "aria-label": "Constrain time window",
              "onUpdate:modelValue": O[15] || (O[15] = (C) => P("during", C ? [{ $now: "-P30D" }, { $now: "P0D" }] : void 0)),
              binary: ""
            }, null, 8, ["model-value"]),
            O[28] || (O[28] = F("During", -1))
          ]),
          "during" in o.value ? (c(), g("div", en, [
            (c(), g(X, null, te(["start", "end"], (C, R) => h(Kt, {
              key: C,
              "board-id": e.boardId,
              field: E,
              "model-value": le.value[R],
              label: i.value + " during " + C,
              "onUpdate:modelValue": (M) => z(R, M)
            }, null, 8, ["board-id", "model-value", "label", "onUpdate:modelValue"])), 64))
          ])) : U("", !0)
        ], 64)) : (c(), g(X, { key: 5 }, [
          d("div", tn, [
            m.value === "rel" ? (c(), g(X, { key: 0 }, [
              d("label", null, [
                O[29] || (O[29] = F("Relation", -1)),
                h(r(ae), {
                  "model-value": e.modelValue.rel,
                  "onUpdate:modelValue": O[16] || (O[16] = (C) => V({ rel: C })),
                  appendTo: "self",
                  optionLabel: "label",
                  optionValue: "value",
                  optionDisabled: "disabled",
                  options: [...(e.schema.compiled.relation_types ?? []).map((C) => ({ label: C.outward ?? C.id, value: C.id, disabled: !1 }))]
                }, null, 8, ["model-value", "options"])
              ]),
              d("label", null, [
                O[30] || (O[30] = F("Direction", -1)),
                h(r(ae), {
                  "model-value": e.modelValue.dir,
                  "onUpdate:modelValue": O[17] || (O[17] = (C) => V({ dir: C })),
                  appendTo: "self",
                  optionLabel: "label",
                  optionValue: "value",
                  optionDisabled: "disabled",
                  options: [{ label: "Outward", value: "outward", disabled: !1 }, { label: "Inward", value: "inward", disabled: !1 }]
                }, null, 8, ["model-value"])
              ])
            ], 64)) : U("", !0),
            d("label", null, [
              O[31] || (O[31] = F("Quantifier", -1)),
              h(r(ae), {
                "model-value": e.modelValue.q,
                "onUpdate:modelValue": O[18] || (O[18] = (C) => V({ q: C })),
                appendTo: "self",
                options: ["some", "every", "none"]
              }, null, 8, ["model-value"])
            ])
          ]),
          h(ne, {
            "board-id": e.boardId,
            schema: e.schema,
            "model-value": r(St)(e.modelValue.where),
            path: i.value + ".where",
            depth: u.value + 1,
            "onUpdate:modelValue": O[19] || (O[19] = (C) => V({ where: C })),
            onValidity: O[20] || (O[20] = (C) => k("nested", C))
          }, null, 8, ["board-id", "schema", "model-value", "path", "depth"])
        ], 64))
      ], 8, Ki);
    };
  }
}), ln = { class: "work-stack work-tight" }, on = { class: "work-row work-small" }, nl = /* @__PURE__ */ fe({
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
    function m(p, o) {
      o ? u.delete(p) : u.add(p), l("validity", !u.size);
    }
    function v(p) {
      l("update:modelValue", p ? { field: t.draft.fields?.[0]?.code ?? "state", op: "eq" } : void 0), p || (u.clear(), l("validity", !0));
    }
    return bt(() => l("validity", !0)), (p, o) => (c(), g("section", ln, [
      d("label", on, [
        h(r(qe), {
          "model-value": e.modelValue != null,
          "aria-label": e.label,
          "onUpdate:modelValue": v
        }, null, 8, ["model-value", "aria-label"]),
        F(I(e.label), 1)
      ]),
      e.modelValue != null ? (c(), q(an, {
        key: 0,
        schema: i.value,
        "board-id": e.boardId ?? "",
        "model-value": r(St)(e.modelValue),
        path: e.label,
        "onUpdate:modelValue": o[0] || (o[0] = (n) => l("update:modelValue", n)),
        onValidity: o[1] || (o[1] = (n) => m("structured", n))
      }, null, 8, ["schema", "board-id", "model-value", "path"])) : U("", !0),
      e.modelValue != null ? (c(), q(pt, {
        key: 1,
        label: e.label + " predicate",
        "model-value": e.modelValue,
        hint: "Use any predicate accepted by Work, including installed or deeply nested forms.",
        "onUpdate:modelValue": o[2] || (o[2] = (n) => l("update:modelValue", n)),
        onValidity: o[3] || (o[3] = (n) => m("raw", n))
      }, null, 8, ["label", "model-value"])) : U("", !0)
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
}, sl = /* @__PURE__ */ fe({
  __name: "PrincipalsPicker",
  props: {
    modelValue: {},
    label: {},
    kinds: {},
    boardId: {}
  },
  emits: ["update:modelValue"],
  setup(e, { emit: a }) {
    const t = e, l = a, i = B(!1), u = B(0), m = H(() => t.modelValue ?? []), { principalLabel: v, rememberPrincipal: p, nameError: o } = jl(() => t.boardId ?? "", () => m.value);
    Ca(async () => {
      i.value = await mt("wc-principal-picker");
    });
    function n(s) {
      const b = s.detail, f = b?.principal_id ?? b?.id;
      if (!f) return;
      const k = { kind: b.type ?? "user", id: f };
      b.label && p(k, b.label), m.value.some(($) => $.id === f && $.kind === k.kind) || l("update:modelValue", [...m.value, k]), u.value++;
    }
    return (s, b) => (c(), g(X, null, [
      r(o) ? (c(), g("p", nn, I(r(o)), 1)) : U("", !0),
      d("section", {
        class: "work-stack work-tight work-principals-picker",
        "aria-label": e.label
      }, [
        d("h4", rn, I(e.label), 1),
        m.value.length ? (c(), g("div", dn, [
          (c(!0), g(X, null, te(m.value, (f, k) => (c(), q(r(Oe), {
            key: f.kind + f.id,
            severity: "secondary",
            class: "kx-tag-sm"
          }, {
            default: L(() => [
              F(I(r(v)(f)), 1),
              h(r(Y), {
                text: "",
                severity: "secondary",
                size: "small",
                "aria-label": "Remove " + r(v)(f),
                onClick: ($) => l("update:modelValue", m.value.filter((N, V) => V !== k))
              }, {
                default: L(() => [
                  h(r(Q), { icon: "tabler:x" })
                ]),
                _: 1
              }, 8, ["aria-label", "onClick"])
            ]),
            _: 2
          }, 1024))), 128))
        ])) : U("", !0),
        i.value ? (c(), g("wc-principal-picker", {
          key: u.value,
          kinds: e.kinds ?? "user,group",
          onConfigChanged: n
        }, null, 40, un)) : (c(), g("p", cn, "People and group picker is unavailable."))
      ], 8, sn)
    ], 64));
  }
}), vn = { class: "work-stack work-tight" }, Xl = /* @__PURE__ */ fe({
  __name: "HoldersPicker",
  props: {
    modelValue: {},
    label: {},
    boardId: {}
  },
  emits: ["update:modelValue", "validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, i = H(() => (t.modelValue ?? []).flatMap((m) => "user" in m ? [{ kind: "user", id: m.user }] : "group" in m ? [{ kind: "group", id: m.group }] : []));
    function u(m) {
      const v = [...(t.modelValue ?? []).filter((p) => "field" in p || "service" in p), ...m.map((p) => p.kind === "group" ? { group: p.id } : { user: p.id })];
      l("update:modelValue", v.length ? v : void 0);
    }
    return (m, v) => (c(), g("div", vn, [
      h(sl, {
        "board-id": e.boardId,
        label: e.label,
        "model-value": i.value,
        "onUpdate:modelValue": u
      }, null, 8, ["board-id", "label", "model-value"]),
      h(pt, {
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
function ot() {
  return ot = Object.assign ? Object.assign.bind() : function(e) {
    for (var a = 1; a < arguments.length; a++) {
      var t = arguments[a];
      for (var l in t) ({}).hasOwnProperty.call(t, l) && (e[l] = t[l]);
    }
    return e;
  }, ot.apply(null, arguments);
}
function Vl(e, a) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(e);
    a && (l = l.filter(function(i) {
      return Object.getOwnPropertyDescriptor(e, i).enumerable;
    })), t.push.apply(t, l);
  }
  return t;
}
function tt(e) {
  for (var a = 1; a < arguments.length; a++) {
    var t = arguments[a] != null ? arguments[a] : {};
    a % 2 ? Vl(Object(t), !0).forEach(function(l) {
      mn(e, l, t[l]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : Vl(Object(t)).forEach(function(l) {
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
function Xa(e) {
  "@babel/helpers - typeof";
  return Xa = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(a) {
    return typeof a;
  } : function(a) {
    return a && typeof Symbol == "function" && a.constructor === Symbol && a !== Symbol.prototype ? "symbol" : typeof a;
  }, Xa(e);
}
var yn = "1.15.7";
function lt(e) {
  if (typeof window < "u" && window.navigator)
    return !!/* @__PURE__ */ navigator.userAgent.match(e);
}
var it = lt(/(?:Trident.*rv[ :]?11\.|msie|iemobile|Windows Phone)/i), oa = lt(/Edge/i), $l = lt(/firefox/i), Qt = lt(/safari/i) && !lt(/chrome/i) && !lt(/android/i), rl = lt(/iP(ad|od|hone)/i), Jl = lt(/chrome/i) && lt(/android/i), Zl = {
  capture: !1,
  passive: !1
};
function pe(e, a, t) {
  e.addEventListener(a, t, !it && Zl);
}
function me(e, a, t) {
  e.removeEventListener(a, t, !it && Zl);
}
function ga(e, a) {
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
function Ql(e) {
  return e.host && e !== document && e.host.nodeType && e.host !== e ? e.host : e.parentNode;
}
function Je(e, a, t, l) {
  if (e) {
    t = t || document;
    do {
      if (a != null && (a[0] === ">" ? e.parentNode === t && ga(e, a) : ga(e, a)) || l && e === t)
        return e;
      if (e === t) break;
    } while (e = Ql(e));
  }
  return null;
}
var xl = /\s+/g;
function Be(e, a, t) {
  if (e && a)
    if (e.classList)
      e.classList[t ? "add" : "remove"](a);
    else {
      var l = (" " + e.className + " ").replace(xl, " ").replace(" " + a + " ", " ");
      e.className = (l + (t ? " " + a : "")).replace(xl, " ");
    }
}
function oe(e, a, t) {
  var l = e && e.style;
  if (l) {
    if (t === void 0)
      return document.defaultView && document.defaultView.getComputedStyle ? t = document.defaultView.getComputedStyle(e, "") : e.currentStyle && (t = e.currentStyle), a === void 0 ? t : t[a];
    !(a in l) && a.indexOf("webkit") === -1 && (a = "-webkit-" + a), l[a] = t + (typeof t == "string" ? "" : "px");
  }
}
function Bt(e, a) {
  var t = "";
  if (typeof e == "string")
    t = e;
  else
    do {
      var l = oe(e, "transform");
      l && l !== "none" && (t = l + " " + t);
    } while (!a && (e = e.parentNode));
  var i = window.DOMMatrix || window.WebKitCSSMatrix || window.CSSMatrix || window.MSCSSMatrix;
  return i && new i(t);
}
function _l(e, a, t) {
  if (e) {
    var l = e.getElementsByTagName(a), i = 0, u = l.length;
    if (t)
      for (; i < u; i++)
        t(l[i], i);
    return l;
  }
  return [];
}
function et() {
  var e = document.scrollingElement;
  return e || document.documentElement;
}
function Te(e, a, t, l, i) {
  if (!(!e.getBoundingClientRect && e !== window)) {
    var u, m, v, p, o, n, s;
    if (e !== window && e.parentNode && e !== et() ? (u = e.getBoundingClientRect(), m = u.top, v = u.left, p = u.bottom, o = u.right, n = u.height, s = u.width) : (m = 0, v = 0, p = window.innerHeight, o = window.innerWidth, n = window.innerHeight, s = window.innerWidth), (a || t) && e !== window && (i = i || e.parentNode, !it))
      do
        if (i && i.getBoundingClientRect && (oe(i, "transform") !== "none" || t && oe(i, "position") !== "static")) {
          var b = i.getBoundingClientRect();
          m -= b.top + parseInt(oe(i, "border-top-width")), v -= b.left + parseInt(oe(i, "border-left-width")), p = m + u.height, o = v + u.width;
          break;
        }
      while (i = i.parentNode);
    if (l && e !== window) {
      var f = Bt(i || e), k = f && f.a, $ = f && f.d;
      f && (m /= $, v /= k, s /= k, n /= $, p = m + n, o = v + s);
    }
    return {
      top: m,
      left: v,
      bottom: p,
      right: o,
      width: s,
      height: n
    };
  }
}
function Cl(e, a, t) {
  for (var l = vt(e, !0), i = Te(e)[a]; l; ) {
    var u = Te(l)[t], m = void 0;
    if (m = i >= u, !m) return l;
    if (l === et()) break;
    l = vt(l, !1);
  }
  return !1;
}
function qt(e, a, t, l) {
  for (var i = 0, u = 0, m = e.children; u < m.length; ) {
    if (m[u].style.display !== "none" && m[u] !== ie.ghost && (l || m[u] !== ie.dragged) && Je(m[u], t.draggable, e, !1)) {
      if (i === a)
        return m[u];
      i++;
    }
    u++;
  }
  return null;
}
function dl(e, a) {
  for (var t = e.lastElementChild; t && (t === ie.ghost || oe(t, "display") === "none" || a && !ga(t, a)); )
    t = t.previousElementSibling;
  return t || null;
}
function We(e, a) {
  var t = 0;
  if (!e || !e.parentNode)
    return -1;
  for (; e = e.previousElementSibling; )
    e.nodeName.toUpperCase() !== "TEMPLATE" && e !== ie.clone && (!a || ga(e, a)) && t++;
  return t;
}
function Sl(e) {
  var a = 0, t = 0, l = et();
  if (e)
    do {
      var i = Bt(e), u = i.a, m = i.d;
      a += e.scrollLeft * u, t += e.scrollTop * m;
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
function vt(e, a) {
  if (!e || !e.getBoundingClientRect) return et();
  var t = e, l = !1;
  do
    if (t.clientWidth < t.scrollWidth || t.clientHeight < t.scrollHeight) {
      var i = oe(t);
      if (t.clientWidth < t.scrollWidth && (i.overflowX == "auto" || i.overflowX == "scroll") || t.clientHeight < t.scrollHeight && (i.overflowY == "auto" || i.overflowY == "scroll")) {
        if (!t.getBoundingClientRect || t === document.body) return et();
        if (l || a) return t;
        l = !0;
      }
    }
  while (t = t.parentNode);
  return et();
}
function kn(e, a) {
  if (e && a)
    for (var t in a)
      a.hasOwnProperty(t) && (e[t] = a[t]);
  return e;
}
function Oa(e, a) {
  return Math.round(e.top) === Math.round(a.top) && Math.round(e.left) === Math.round(a.left) && Math.round(e.height) === Math.round(a.height) && Math.round(e.width) === Math.round(a.width);
}
var _t;
function eo(e, a) {
  return function() {
    if (!_t) {
      var t = arguments, l = this;
      t.length === 1 ? e.call(l, t[0]) : e.apply(l, t), _t = setTimeout(function() {
        _t = void 0;
      }, a);
    }
  };
}
function wn() {
  clearTimeout(_t), _t = void 0;
}
function to(e, a, t) {
  e.scrollLeft += a, e.scrollTop += t;
}
function ao(e) {
  var a = window.Polymer, t = window.jQuery || window.Zepto;
  return a && a.dom ? a.dom(e).cloneNode(!0) : t ? t(e).clone(!0)[0] : e.cloneNode(!0);
}
function lo(e, a, t) {
  var l = {};
  return Array.from(e.children).forEach(function(i) {
    var u, m, v, p;
    if (!(!Je(i, a.draggable, e, !1) || i.animated || i === t)) {
      var o = Te(i);
      l.left = Math.min((u = l.left) !== null && u !== void 0 ? u : 1 / 0, o.left), l.top = Math.min((m = l.top) !== null && m !== void 0 ? m : 1 / 0, o.top), l.right = Math.max((v = l.right) !== null && v !== void 0 ? v : -1 / 0, o.right), l.bottom = Math.max((p = l.bottom) !== null && p !== void 0 ? p : -1 / 0, o.bottom);
    }
  }), l.width = l.right - l.left, l.height = l.bottom - l.top, l.x = l.left, l.y = l.top, l;
}
var ze = "Sortable" + (/* @__PURE__ */ new Date()).getTime();
function Vn() {
  var e = [], a;
  return {
    captureAnimationState: function() {
      if (e = [], !!this.options.animation) {
        var l = [].slice.call(this.el.children);
        l.forEach(function(i) {
          if (!(oe(i, "display") === "none" || i === ie.ghost)) {
            e.push({
              target: i,
              rect: Te(i)
            });
            var u = tt({}, e[e.length - 1].rect);
            if (i.thisAnimationDuration) {
              var m = Bt(i, !0);
              m && (u.top -= m.f, u.left -= m.e);
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
      var u = !1, m = 0;
      e.forEach(function(v) {
        var p = 0, o = v.target, n = o.fromRect, s = Te(o), b = o.prevFromRect, f = o.prevToRect, k = v.rect, $ = Bt(o, !0);
        $ && (s.top -= $.f, s.left -= $.e), o.toRect = s, o.thisAnimationDuration && Oa(b, s) && !Oa(n, s) && // Make sure animatingRect is on line between toRect & fromRect
        (k.top - s.top) / (k.left - s.left) === (n.top - s.top) / (n.left - s.left) && (p = xn(k, b, f, i.options)), Oa(s, n) || (o.prevFromRect = n, o.prevToRect = s, p || (p = i.options.animation), i.animate(o, k, s, p)), p && (u = !0, m = Math.max(m, p), clearTimeout(o.animationResetTimer), o.animationResetTimer = setTimeout(function() {
          o.animationTime = 0, o.prevFromRect = null, o.fromRect = null, o.prevToRect = null, o.thisAnimationDuration = null;
        }, p), o.thisAnimationDuration = p);
      }), clearTimeout(a), u ? a = setTimeout(function() {
        typeof l == "function" && l();
      }, m) : typeof l == "function" && l(), e = [];
    },
    animate: function(l, i, u, m) {
      if (m) {
        oe(l, "transition", ""), oe(l, "transform", "");
        var v = Bt(this.el), p = v && v.a, o = v && v.d, n = (i.left - u.left) / (p || 1), s = (i.top - u.top) / (o || 1);
        l.animatingX = !!n, l.animatingY = !!s, oe(l, "transform", "translate3d(" + n + "px," + s + "px,0)"), this.forRepaintDummy = $n(l), oe(l, "transition", "transform " + m + "ms" + (this.options.easing ? " " + this.options.easing : "")), oe(l, "transform", "translate3d(0,0,0)"), typeof l.animated == "number" && clearTimeout(l.animated), l.animated = setTimeout(function() {
          oe(l, "transition", ""), oe(l, "transform", ""), l.animated = !1, l.animatingX = !1, l.animatingY = !1;
        }, m);
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
var Nt = [], Ma = {
  initializeByDefault: !0
}, ia = {
  mount: function(a) {
    for (var t in Ma)
      Ma.hasOwnProperty(t) && !(t in a) && (a[t] = Ma[t]);
    Nt.forEach(function(l) {
      if (l.pluginName === a.pluginName)
        throw "Sortable: Cannot mount plugin ".concat(a.pluginName, " more than once");
    }), Nt.push(a);
  },
  pluginEvent: function(a, t, l) {
    var i = this;
    this.eventCanceled = !1, l.cancel = function() {
      i.eventCanceled = !0;
    };
    var u = a + "Global";
    Nt.forEach(function(m) {
      t[m.pluginName] && (t[m.pluginName][u] && t[m.pluginName][u](tt({
        sortable: t
      }, l)), t.options[m.pluginName] && t[m.pluginName][a] && t[m.pluginName][a](tt({
        sortable: t
      }, l)));
    });
  },
  initializePlugins: function(a, t, l, i) {
    Nt.forEach(function(v) {
      var p = v.pluginName;
      if (!(!a.options[p] && !v.initializeByDefault)) {
        var o = new v(a, t, a.options);
        o.sortable = a, o.options = a.options, a[p] = o, ot(l, o.defaults);
      }
    });
    for (var u in a.options)
      if (a.options.hasOwnProperty(u)) {
        var m = this.modifyOption(a, u, a.options[u]);
        typeof m < "u" && (a.options[u] = m);
      }
  },
  getEventProperties: function(a, t) {
    var l = {};
    return Nt.forEach(function(i) {
      typeof i.eventProperties == "function" && ot(l, i.eventProperties.call(t[i.pluginName], a));
    }), l;
  },
  modifyOption: function(a, t, l) {
    var i;
    return Nt.forEach(function(u) {
      a[u.pluginName] && u.optionListeners && typeof u.optionListeners[t] == "function" && (i = u.optionListeners[t].call(a[u.pluginName], l));
    }), i;
  }
};
function Cn(e) {
  var a = e.sortable, t = e.rootEl, l = e.name, i = e.targetEl, u = e.cloneEl, m = e.toEl, v = e.fromEl, p = e.oldIndex, o = e.newIndex, n = e.oldDraggableIndex, s = e.newDraggableIndex, b = e.originalEvent, f = e.putSortable, k = e.extraEventProperties;
  if (a = a || t && t[ze], !!a) {
    var $, N = a.options, V = "on" + l.charAt(0).toUpperCase() + l.substr(1);
    window.CustomEvent && !it && !oa ? $ = new CustomEvent(l, {
      bubbles: !0,
      cancelable: !0
    }) : ($ = document.createEvent("Event"), $.initEvent(l, !0, !0)), $.to = m || t, $.from = v || t, $.item = i || t, $.clone = u, $.oldIndex = p, $.newIndex = o, $.oldDraggableIndex = n, $.newDraggableIndex = s, $.originalEvent = b, $.pullMode = f ? f.lastPutMode : void 0;
    var A = tt(tt({}, k), ia.getEventProperties(l, a));
    for (var T in A)
      $[T] = A[T];
    t && t.dispatchEvent($), N[V] && N[V].call(a, $);
  }
}
var Sn = ["evt"], Le = function(a, t) {
  var l = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, i = l.evt, u = fn(l, Sn);
  ia.pluginEvent.bind(ie)(a, t, tt({
    dragEl: G,
    parentEl: Ce,
    ghostEl: se,
    rootEl: we,
    nextEl: Vt,
    lastDownEl: ma,
    cloneEl: $e,
    cloneHidden: ct,
    dragStarted: Ht,
    putSortable: Ae,
    activeSortable: ie.active,
    originalEvent: i,
    oldIndex: Lt,
    oldDraggableIndex: ea,
    newIndex: je,
    newDraggableIndex: ut,
    hideGhostForTarget: so,
    unhideGhostForTarget: ro,
    cloneNowHidden: function() {
      ct = !0;
    },
    cloneNowShown: function() {
      ct = !1;
    },
    dispatchSortableEvent: function(v) {
      Fe({
        sortable: t,
        name: v,
        originalEvent: i
      });
    }
  }, u));
};
function Fe(e) {
  Cn(tt({
    putSortable: Ae,
    cloneEl: $e,
    targetEl: G,
    rootEl: we,
    oldIndex: Lt,
    oldDraggableIndex: ea,
    newIndex: je,
    newDraggableIndex: ut
  }, e));
}
var G, Ce, se, we, Vt, ma, $e, ct, Lt, je, ea, ut, da, Ae, Mt = !1, ka = !1, wa = [], yt, Xe, Fa, La, Tl, Dl, Ht, Ot, ta, aa = !1, ua = !1, fa, Re, za = [], Ja = !1, Va = [], Ua = typeof document < "u", ca = rl, Ul = oa || it ? "cssFloat" : "float", Tn = Ua && !Jl && !rl && "draggable" in document.createElement("div"), oo = (function() {
  if (Ua) {
    if (it)
      return !1;
    var e = document.createElement("x");
    return e.style.cssText = "pointer-events:auto", e.style.pointerEvents === "auto";
  }
})(), io = function(a, t) {
  var l = oe(a), i = parseInt(l.width) - parseInt(l.paddingLeft) - parseInt(l.paddingRight) - parseInt(l.borderLeftWidth) - parseInt(l.borderRightWidth), u = qt(a, 0, t), m = qt(a, 1, t), v = u && oe(u), p = m && oe(m), o = v && parseInt(v.marginLeft) + parseInt(v.marginRight) + Te(u).width, n = p && parseInt(p.marginLeft) + parseInt(p.marginRight) + Te(m).width;
  if (l.display === "flex")
    return l.flexDirection === "column" || l.flexDirection === "column-reverse" ? "vertical" : "horizontal";
  if (l.display === "grid")
    return l.gridTemplateColumns.split(" ").length <= 1 ? "vertical" : "horizontal";
  if (u && v.float && v.float !== "none") {
    var s = v.float === "left" ? "left" : "right";
    return m && (p.clear === "both" || p.clear === s) ? "vertical" : "horizontal";
  }
  return u && (v.display === "block" || v.display === "flex" || v.display === "table" || v.display === "grid" || o >= i && l[Ul] === "none" || m && l[Ul] === "none" && o + n > i) ? "vertical" : "horizontal";
}, Dn = function(a, t, l) {
  var i = l ? a.left : a.top, u = l ? a.right : a.bottom, m = l ? a.width : a.height, v = l ? t.left : t.top, p = l ? t.right : t.bottom, o = l ? t.width : t.height;
  return i === v || u === p || i + m / 2 === v + o / 2;
}, Un = function(a, t) {
  var l;
  return wa.some(function(i) {
    var u = i[ze].options.emptyInsertThreshold;
    if (!(!u || dl(i))) {
      var m = Te(i), v = a >= m.left - u && a <= m.right + u, p = t >= m.top - u && t <= m.bottom + u;
      if (v && p)
        return l = i;
    }
  }), l;
}, no = function(a) {
  function t(u, m) {
    return function(v, p, o, n) {
      var s = v.options.group.name && p.options.group.name && v.options.group.name === p.options.group.name;
      if (u == null && (m || s))
        return !0;
      if (u == null || u === !1)
        return !1;
      if (m && u === "clone")
        return u;
      if (typeof u == "function")
        return t(u(v, p, o, n), m)(v, p, o, n);
      var b = (m ? v : p).options.group.name;
      return u === !0 || typeof u == "string" && u === b || u.join && u.indexOf(b) > -1;
    };
  }
  var l = {}, i = a.group;
  (!i || Xa(i) != "object") && (i = {
    name: i
  }), l.name = i.name, l.checkPull = t(i.pull, !0), l.checkPut = t(i.put), l.revertClone = i.revertClone, a.group = l;
}, so = function() {
  !oo && se && oe(se, "display", "none");
}, ro = function() {
  !oo && se && oe(se, "display", "");
};
Ua && !Jl && document.addEventListener("click", function(e) {
  if (ka)
    return e.preventDefault(), e.stopPropagation && e.stopPropagation(), e.stopImmediatePropagation && e.stopImmediatePropagation(), ka = !1, !1;
}, !0);
var gt = function(a) {
  if (G) {
    a = a.touches ? a.touches[0] : a;
    var t = Un(a.clientX, a.clientY);
    if (t) {
      var l = {};
      for (var i in a)
        a.hasOwnProperty(i) && (l[i] = a[i]);
      l.target = l.rootEl = t, l.preventDefault = void 0, l.stopPropagation = void 0, t[ze]._onDragOver(l);
    }
  }
}, In = function(a) {
  G && G.parentNode[ze]._isOutsideThisEl(a.target);
};
function ie(e, a) {
  if (!(e && e.nodeType && e.nodeType === 1))
    throw "Sortable: `el` must be an HTMLElement, not ".concat({}.toString.call(e));
  this.el = e, this.options = a = ot({}, a), e[ze] = this;
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
      return io(e, this.options);
    },
    ghostClass: "sortable-ghost",
    chosenClass: "sortable-chosen",
    dragClass: "sortable-drag",
    ignore: "a, img",
    filter: null,
    preventOnFilter: !0,
    animation: 0,
    easing: null,
    setData: function(m, v) {
      m.setData("Text", v.textContent);
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
    supportPointer: ie.supportPointer !== !1 && "PointerEvent" in window && (!Qt || rl),
    emptyInsertThreshold: 5
  };
  ia.initializePlugins(this, e, t);
  for (var l in t)
    !(l in a) && (a[l] = t[l]);
  no(a);
  for (var i in this)
    i.charAt(0) === "_" && typeof this[i] == "function" && (this[i] = this[i].bind(this));
  this.nativeDraggable = a.forceFallback ? !1 : Tn, this.nativeDraggable && (this.options.touchStartThreshold = 1), a.supportPointer ? pe(e, "pointerdown", this._onTapStart) : (pe(e, "mousedown", this._onTapStart), pe(e, "touchstart", this._onTapStart)), this.nativeDraggable && (pe(e, "dragover", this), pe(e, "dragenter", this)), wa.push(this.el), a.store && a.store.get && this.sort(a.store.get(this) || []), ot(this, Vn());
}
ie.prototype = /** @lends Sortable.prototype */
{
  constructor: ie,
  _isOutsideThisEl: function(a) {
    !this.el.contains(a) && a !== this.el && (Ot = null);
  },
  _getDirection: function(a, t) {
    return typeof this.options.direction == "function" ? this.options.direction.call(this, a, t, G) : this.options.direction;
  },
  _onTapStart: function(a) {
    if (a.cancelable) {
      var t = this, l = this.el, i = this.options, u = i.preventOnFilter, m = a.type, v = a.touches && a.touches[0] || a.pointerType && a.pointerType === "touch" && a, p = (v || a).target, o = a.target.shadowRoot && (a.path && a.path[0] || a.composedPath && a.composedPath()[0]) || p, n = i.filter;
      if (Fn(l), !G && !(/mousedown|pointerdown/.test(m) && a.button !== 0 || i.disabled) && !o.isContentEditable && !(!this.nativeDraggable && Qt && p && p.tagName.toUpperCase() === "SELECT") && (p = Je(p, i.draggable, l, !1), !(p && p.animated) && ma !== p)) {
        if (Lt = We(p), ea = We(p, i.draggable), typeof n == "function") {
          if (n.call(this, a, p, this)) {
            Fe({
              sortable: t,
              rootEl: o,
              name: "filter",
              targetEl: p,
              toEl: l,
              fromEl: l
            }), Le("filter", t, {
              evt: a
            }), u && a.preventDefault();
            return;
          }
        } else if (n && (n = n.split(",").some(function(s) {
          if (s = Je(o, s.trim(), l, !1), s)
            return Fe({
              sortable: t,
              rootEl: s,
              name: "filter",
              targetEl: p,
              fromEl: l,
              toEl: l
            }), Le("filter", t, {
              evt: a
            }), !0;
        }), n)) {
          u && a.preventDefault();
          return;
        }
        i.handle && !Je(o, i.handle, l, !1) || this._prepareDragStart(a, v, p);
      }
    }
  },
  _prepareDragStart: function(a, t, l) {
    var i = this, u = i.el, m = i.options, v = u.ownerDocument, p;
    if (l && !G && l.parentNode === u) {
      var o = Te(l);
      if (we = u, G = l, Ce = G.parentNode, Vt = G.nextSibling, ma = l, da = m.group, ie.dragged = G, yt = {
        target: G,
        clientX: (t || a).clientX,
        clientY: (t || a).clientY
      }, Tl = yt.clientX - o.left, Dl = yt.clientY - o.top, this._lastX = (t || a).clientX, this._lastY = (t || a).clientY, G.style["will-change"] = "all", p = function() {
        if (Le("delayEnded", i, {
          evt: a
        }), ie.eventCanceled) {
          i._onDrop();
          return;
        }
        i._disableDelayedDragEvents(), !$l && i.nativeDraggable && (G.draggable = !0), i._triggerDragStart(a, t), Fe({
          sortable: i,
          name: "choose",
          originalEvent: a
        }), Be(G, m.chosenClass, !0);
      }, m.ignore.split(",").forEach(function(n) {
        _l(G, n.trim(), Ba);
      }), pe(v, "dragover", gt), pe(v, "mousemove", gt), pe(v, "touchmove", gt), m.supportPointer ? (pe(v, "pointerup", i._onDrop), !this.nativeDraggable && pe(v, "pointercancel", i._onDrop)) : (pe(v, "mouseup", i._onDrop), pe(v, "touchend", i._onDrop), pe(v, "touchcancel", i._onDrop)), $l && this.nativeDraggable && (this.options.touchStartThreshold = 4, G.draggable = !0), Le("delayStart", this, {
        evt: a
      }), m.delay && (!m.delayOnTouchOnly || t) && (!this.nativeDraggable || !(oa || it))) {
        if (ie.eventCanceled) {
          this._onDrop();
          return;
        }
        m.supportPointer ? (pe(v, "pointerup", i._disableDelayedDrag), pe(v, "pointercancel", i._disableDelayedDrag)) : (pe(v, "mouseup", i._disableDelayedDrag), pe(v, "touchend", i._disableDelayedDrag), pe(v, "touchcancel", i._disableDelayedDrag)), pe(v, "mousemove", i._delayedDragTouchMoveHandler), pe(v, "touchmove", i._delayedDragTouchMoveHandler), m.supportPointer && pe(v, "pointermove", i._delayedDragTouchMoveHandler), i._dragStartTimer = setTimeout(p, m.delay);
      } else
        p();
    }
  },
  _delayedDragTouchMoveHandler: function(a) {
    var t = a.touches ? a.touches[0] : a;
    Math.max(Math.abs(t.clientX - this._lastX), Math.abs(t.clientY - this._lastY)) >= Math.floor(this.options.touchStartThreshold / (this.nativeDraggable && window.devicePixelRatio || 1)) && this._disableDelayedDrag();
  },
  _disableDelayedDrag: function() {
    G && Ba(G), clearTimeout(this._dragStartTimer), this._disableDelayedDragEvents();
  },
  _disableDelayedDragEvents: function() {
    var a = this.el.ownerDocument;
    me(a, "mouseup", this._disableDelayedDrag), me(a, "touchend", this._disableDelayedDrag), me(a, "touchcancel", this._disableDelayedDrag), me(a, "pointerup", this._disableDelayedDrag), me(a, "pointercancel", this._disableDelayedDrag), me(a, "mousemove", this._delayedDragTouchMoveHandler), me(a, "touchmove", this._delayedDragTouchMoveHandler), me(a, "pointermove", this._delayedDragTouchMoveHandler);
  },
  _triggerDragStart: function(a, t) {
    t = t || a.pointerType == "touch" && a, !this.nativeDraggable || t ? this.options.supportPointer ? pe(document, "pointermove", this._onTouchMove) : t ? pe(document, "touchmove", this._onTouchMove) : pe(document, "mousemove", this._onTouchMove) : (pe(G, "dragend", this), pe(we, "dragstart", this._onDragStart));
    try {
      document.selection ? pa(function() {
        document.selection.empty();
      }) : window.getSelection().removeAllRanges();
    } catch {
    }
  },
  _dragStarted: function(a, t) {
    if (Mt = !1, we && G) {
      Le("dragStarted", this, {
        evt: t
      }), this.nativeDraggable && pe(document, "dragover", In);
      var l = this.options;
      !a && Be(G, l.dragClass, !1), Be(G, l.ghostClass, !0), ie.active = this, a && this._appendGhost(), Fe({
        sortable: this,
        name: "start",
        originalEvent: t
      });
    } else
      this._nulling();
  },
  _emulateDragOver: function() {
    if (Xe) {
      this._lastX = Xe.clientX, this._lastY = Xe.clientY, so();
      for (var a = document.elementFromPoint(Xe.clientX, Xe.clientY), t = a; a && a.shadowRoot && (a = a.shadowRoot.elementFromPoint(Xe.clientX, Xe.clientY), a !== t); )
        t = a;
      if (G.parentNode[ze]._isOutsideThisEl(a), t)
        do {
          if (t[ze]) {
            var l = void 0;
            if (l = t[ze]._onDragOver({
              clientX: Xe.clientX,
              clientY: Xe.clientY,
              target: a,
              rootEl: t
            }), l && !this.options.dragoverBubble)
              break;
          }
          a = t;
        } while (t = Ql(t));
      ro();
    }
  },
  _onTouchMove: function(a) {
    if (yt) {
      var t = this.options, l = t.fallbackTolerance, i = t.fallbackOffset, u = a.touches ? a.touches[0] : a, m = se && Bt(se, !0), v = se && m && m.a, p = se && m && m.d, o = ca && Re && Sl(Re), n = (u.clientX - yt.clientX + i.x) / (v || 1) + (o ? o[0] - za[0] : 0) / (v || 1), s = (u.clientY - yt.clientY + i.y) / (p || 1) + (o ? o[1] - za[1] : 0) / (p || 1);
      if (!ie.active && !Mt) {
        if (l && Math.max(Math.abs(u.clientX - this._lastX), Math.abs(u.clientY - this._lastY)) < l)
          return;
        this._onDragStart(a, !0);
      }
      if (se) {
        m ? (m.e += n - (Fa || 0), m.f += s - (La || 0)) : m = {
          a: 1,
          b: 0,
          c: 0,
          d: 1,
          e: n,
          f: s
        };
        var b = "matrix(".concat(m.a, ",").concat(m.b, ",").concat(m.c, ",").concat(m.d, ",").concat(m.e, ",").concat(m.f, ")");
        oe(se, "webkitTransform", b), oe(se, "mozTransform", b), oe(se, "msTransform", b), oe(se, "transform", b), Fa = n, La = s, Xe = u;
      }
      a.cancelable && a.preventDefault();
    }
  },
  _appendGhost: function() {
    if (!se) {
      var a = this.options.fallbackOnBody ? document.body : we, t = Te(G, !0, ca, !0, a), l = this.options;
      if (ca) {
        for (Re = a; oe(Re, "position") === "static" && oe(Re, "transform") === "none" && Re !== document; )
          Re = Re.parentNode;
        Re !== document.body && Re !== document.documentElement ? (Re === document && (Re = et()), t.top += Re.scrollTop, t.left += Re.scrollLeft) : Re = et(), za = Sl(Re);
      }
      se = G.cloneNode(!0), Be(se, l.ghostClass, !1), Be(se, l.fallbackClass, !0), Be(se, l.dragClass, !0), oe(se, "transition", ""), oe(se, "transform", ""), oe(se, "box-sizing", "border-box"), oe(se, "margin", 0), oe(se, "top", t.top), oe(se, "left", t.left), oe(se, "width", t.width), oe(se, "height", t.height), oe(se, "opacity", "0.8"), oe(se, "position", ca ? "absolute" : "fixed"), oe(se, "zIndex", "100000"), oe(se, "pointerEvents", "none"), ie.ghost = se, a.appendChild(se), oe(se, "transform-origin", Tl / parseInt(se.style.width) * 100 + "% " + Dl / parseInt(se.style.height) * 100 + "%");
    }
  },
  _onDragStart: function(a, t) {
    var l = this, i = a.dataTransfer, u = l.options;
    if (Le("dragStart", this, {
      evt: a
    }), ie.eventCanceled) {
      this._onDrop();
      return;
    }
    Le("setupClone", this), ie.eventCanceled || ($e = ao(G), $e.removeAttribute("id"), $e.draggable = !1, $e.style["will-change"] = "", this._hideClone(), Be($e, this.options.chosenClass, !1), ie.clone = $e), l.cloneId = pa(function() {
      Le("clone", l), !ie.eventCanceled && (l.options.removeCloneOnHide || we.insertBefore($e, G), l._hideClone(), Fe({
        sortable: l,
        name: "clone"
      }));
    }), !t && Be(G, u.dragClass, !0), t ? (ka = !0, l._loopId = setInterval(l._emulateDragOver, 50)) : (me(document, "mouseup", l._onDrop), me(document, "touchend", l._onDrop), me(document, "touchcancel", l._onDrop), i && (i.effectAllowed = "move", u.setData && u.setData.call(l, i, G)), pe(document, "drop", l), oe(G, "transform", "translateZ(0)")), Mt = !0, l._dragStartId = pa(l._dragStarted.bind(l, t, a)), pe(document, "selectstart", l), Ht = !0, window.getSelection().removeAllRanges(), Qt && oe(document.body, "user-select", "none");
  },
  // Returns true - if no further action is needed (either inserted or another condition)
  _onDragOver: function(a) {
    var t = this.el, l = a.target, i, u, m, v = this.options, p = v.group, o = ie.active, n = da === p, s = v.sort, b = Ae || o, f, k = this, $ = !1;
    if (Ja) return;
    function N(be, ge) {
      Le(be, k, tt({
        evt: a,
        isOwner: n,
        axis: f ? "vertical" : "horizontal",
        revert: m,
        dragRect: i,
        targetRect: u,
        canSort: s,
        fromSortable: b,
        target: l,
        completed: A,
        onMove: function(Ee, y) {
          return va(we, t, G, i, Ee, Te(Ee), a, y);
        },
        changed: T
      }, ge));
    }
    function V() {
      N("dragOverAnimationCapture"), k.captureAnimationState(), k !== b && b.captureAnimationState();
    }
    function A(be) {
      return N("dragOverCompleted", {
        insertion: be
      }), be && (n ? o._hideClone() : o._showClone(k), k !== b && (Be(G, Ae ? Ae.options.ghostClass : o.options.ghostClass, !1), Be(G, v.ghostClass, !0)), Ae !== k && k !== ie.active ? Ae = k : k === ie.active && Ae && (Ae = null), b === k && (k._ignoreWhileAnimating = l), k.animateAll(function() {
        N("dragOverAnimationComplete"), k._ignoreWhileAnimating = null;
      }), k !== b && (b.animateAll(), b._ignoreWhileAnimating = null)), (l === G && !G.animated || l === t && !l.animated) && (Ot = null), !v.dragoverBubble && !a.rootEl && l !== document && (G.parentNode[ze]._isOutsideThisEl(a.target), !be && gt(a)), !v.dragoverBubble && a.stopPropagation && a.stopPropagation(), $ = !0;
    }
    function T() {
      je = We(G), ut = We(G, v.draggable), Fe({
        sortable: k,
        name: "change",
        toEl: t,
        newIndex: je,
        newDraggableIndex: ut,
        originalEvent: a
      });
    }
    if (a.preventDefault !== void 0 && a.cancelable && a.preventDefault(), l = Je(l, v.draggable, t, !0), N("dragOver"), ie.eventCanceled) return $;
    if (G.contains(a.target) || l.animated && l.animatingX && l.animatingY || k._ignoreWhileAnimating === l)
      return A(!1);
    if (ka = !1, o && !v.disabled && (n ? s || (m = Ce !== we) : Ae === this || (this.lastPutMode = da.checkPull(this, o, G, a)) && p.checkPut(this, o, G, a))) {
      if (f = this._getDirection(a, l) === "vertical", i = Te(G), N("dragOverValid"), ie.eventCanceled) return $;
      if (m)
        return Ce = we, V(), this._hideClone(), N("revert"), ie.eventCanceled || (Vt ? we.insertBefore(G, Vt) : we.appendChild(G)), A(!0);
      var P = dl(t, v.draggable);
      if (!P || Rn(a, f, this) && !P.animated) {
        if (P === G)
          return A(!1);
        if (P && t === a.target && (l = P), l && (u = Te(l)), va(we, t, G, i, l, u, a, !!l) !== !1)
          return V(), P && P.nextSibling ? t.insertBefore(G, P.nextSibling) : t.appendChild(G), Ce = t, T(), A(!0);
      } else if (P && Pn(a, f, this)) {
        var x = qt(t, 0, v, !0);
        if (x === G)
          return A(!1);
        if (l = x, u = Te(l), va(we, t, G, i, l, u, a, !1) !== !1)
          return V(), t.insertBefore(G, x), Ce = t, T(), A(!0);
      } else if (l.parentNode === t) {
        u = Te(l);
        var D = 0, E, le = G.parentNode !== t, z = !Dn(G.animated && G.toRect || i, l.animated && l.toRect || u, f), j = f ? "top" : "left", O = Cl(l, "top", "top") || Cl(G, "top", "top"), ne = O ? O.scrollTop : void 0;
        Ot !== l && (E = u[j], aa = !1, ua = !z && v.invertSwap || le), D = Nn(a, l, u, f, z ? 1 : v.swapThreshold, v.invertedSwapThreshold == null ? v.swapThreshold : v.invertedSwapThreshold, ua, Ot === l);
        var C;
        if (D !== 0) {
          var R = We(G);
          do
            R -= D, C = Ce.children[R];
          while (C && (oe(C, "display") === "none" || C === se));
        }
        if (D === 0 || C === l)
          return A(!1);
        Ot = l, ta = D;
        var M = l.nextElementSibling, Z = !1;
        Z = D === 1;
        var ve = va(we, t, G, i, l, u, a, Z);
        if (ve !== !1)
          return (ve === 1 || ve === -1) && (Z = ve === 1), Ja = !0, setTimeout(An, 30), V(), Z && !M ? t.appendChild(G) : l.parentNode.insertBefore(G, Z ? M : l), O && to(O, 0, ne - O.scrollTop), Ce = G.parentNode, E !== void 0 && !ua && (fa = Math.abs(E - Te(l)[j])), T(), A(!0);
      }
      if (t.contains(G))
        return A(!1);
    }
    return !1;
  },
  _ignoreWhileAnimating: null,
  _offMoveEvents: function() {
    me(document, "mousemove", this._onTouchMove), me(document, "touchmove", this._onTouchMove), me(document, "pointermove", this._onTouchMove), me(document, "dragover", gt), me(document, "mousemove", gt), me(document, "touchmove", gt);
  },
  _offUpEvents: function() {
    var a = this.el.ownerDocument;
    me(a, "mouseup", this._onDrop), me(a, "touchend", this._onDrop), me(a, "pointerup", this._onDrop), me(a, "pointercancel", this._onDrop), me(a, "touchcancel", this._onDrop), me(document, "selectstart", this);
  },
  _onDrop: function(a) {
    var t = this.el, l = this.options;
    if (je = We(G), ut = We(G, l.draggable), Le("drop", this, {
      evt: a
    }), Ce = G && G.parentNode, je = We(G), ut = We(G, l.draggable), ie.eventCanceled) {
      this._nulling();
      return;
    }
    Mt = !1, ua = !1, aa = !1, clearInterval(this._loopId), clearTimeout(this._dragStartTimer), Za(this.cloneId), Za(this._dragStartId), this.nativeDraggable && (me(document, "drop", this), me(t, "dragstart", this._onDragStart)), this._offMoveEvents(), this._offUpEvents(), Qt && oe(document.body, "user-select", ""), oe(G, "transform", ""), a && (Ht && (a.cancelable && a.preventDefault(), !l.dropBubble && a.stopPropagation()), se && se.parentNode && se.parentNode.removeChild(se), (we === Ce || Ae && Ae.lastPutMode !== "clone") && $e && $e.parentNode && $e.parentNode.removeChild($e), G && (this.nativeDraggable && me(G, "dragend", this), Ba(G), G.style["will-change"] = "", Ht && !Mt && Be(G, Ae ? Ae.options.ghostClass : this.options.ghostClass, !1), Be(G, this.options.chosenClass, !1), Fe({
      sortable: this,
      name: "unchoose",
      toEl: Ce,
      newIndex: null,
      newDraggableIndex: null,
      originalEvent: a
    }), we !== Ce ? (je >= 0 && (Fe({
      rootEl: Ce,
      name: "add",
      toEl: Ce,
      fromEl: we,
      originalEvent: a
    }), Fe({
      sortable: this,
      name: "remove",
      toEl: Ce,
      originalEvent: a
    }), Fe({
      rootEl: Ce,
      name: "sort",
      toEl: Ce,
      fromEl: we,
      originalEvent: a
    }), Fe({
      sortable: this,
      name: "sort",
      toEl: Ce,
      originalEvent: a
    })), Ae && Ae.save()) : je !== Lt && je >= 0 && (Fe({
      sortable: this,
      name: "update",
      toEl: Ce,
      originalEvent: a
    }), Fe({
      sortable: this,
      name: "sort",
      toEl: Ce,
      originalEvent: a
    })), ie.active && ((je == null || je === -1) && (je = Lt, ut = ea), Fe({
      sortable: this,
      name: "end",
      toEl: Ce,
      originalEvent: a
    }), this.save()))), this._nulling();
  },
  _nulling: function() {
    Le("nulling", this), we = G = Ce = se = Vt = $e = ma = ct = yt = Xe = Ht = je = ut = Lt = ea = Ot = ta = Ae = da = ie.dragged = ie.ghost = ie.clone = ie.active = null;
    var a = this.el;
    Va.forEach(function(t) {
      a.contains(t) && (t.checked = !0);
    }), Va.length = Fa = La = 0;
  },
  handleEvent: function(a) {
    switch (a.type) {
      case "drop":
      case "dragend":
        this._onDrop(a);
        break;
      case "dragenter":
      case "dragover":
        G && (this._onDragOver(a), En(a));
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
    for (var a = [], t, l = this.el.children, i = 0, u = l.length, m = this.options; i < u; i++)
      t = l[i], Je(t, m.draggable, this.el, !1) && a.push(t.getAttribute(m.dataIdAttr) || Mn(t));
    return a;
  },
  /**
   * Sorts the elements according to the array.
   * @param  {String[]}  order  order of the items
   */
  sort: function(a, t) {
    var l = {}, i = this.el;
    this.toArray().forEach(function(u, m) {
      var v = i.children[m];
      Je(v, this.options.draggable, i, !1) && (l[u] = v);
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
    return Je(a, t || this.options.draggable, this.el, !1);
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
    var i = ia.modifyOption(this, a, t);
    typeof i < "u" ? l[a] = i : l[a] = t, a === "group" && no(l);
  },
  /**
   * Destroy
   */
  destroy: function() {
    Le("destroy", this);
    var a = this.el;
    a[ze] = null, me(a, "mousedown", this._onTapStart), me(a, "touchstart", this._onTapStart), me(a, "pointerdown", this._onTapStart), this.nativeDraggable && (me(a, "dragover", this), me(a, "dragenter", this)), Array.prototype.forEach.call(a.querySelectorAll("[draggable]"), function(t) {
      t.removeAttribute("draggable");
    }), this._onDrop(), this._disableDelayedDragEvents(), wa.splice(wa.indexOf(this.el), 1), this.el = a = null;
  },
  _hideClone: function() {
    if (!ct) {
      if (Le("hideClone", this), ie.eventCanceled) return;
      oe($e, "display", "none"), this.options.removeCloneOnHide && $e.parentNode && $e.parentNode.removeChild($e), ct = !0;
    }
  },
  _showClone: function(a) {
    if (a.lastPutMode !== "clone") {
      this._hideClone();
      return;
    }
    if (ct) {
      if (Le("showClone", this), ie.eventCanceled) return;
      G.parentNode == we && !this.options.group.revertClone ? we.insertBefore($e, G) : Vt ? we.insertBefore($e, Vt) : we.appendChild($e), this.options.group.revertClone && this.animate(G, $e), oe($e, "display", ""), ct = !1;
    }
  }
};
function En(e) {
  e.dataTransfer && (e.dataTransfer.dropEffect = "move"), e.cancelable && e.preventDefault();
}
function va(e, a, t, l, i, u, m, v) {
  var p, o = e[ze], n = o.options.onMove, s;
  return window.CustomEvent && !it && !oa ? p = new CustomEvent("move", {
    bubbles: !0,
    cancelable: !0
  }) : (p = document.createEvent("Event"), p.initEvent("move", !0, !0)), p.to = a, p.from = e, p.dragged = t, p.draggedRect = l, p.related = i || a, p.relatedRect = u || Te(a), p.willInsertAfter = v, p.originalEvent = m, e.dispatchEvent(p), n && (s = n.call(o, p, m)), s;
}
function Ba(e) {
  e.draggable = !1;
}
function An() {
  Ja = !1;
}
function Pn(e, a, t) {
  var l = Te(qt(t.el, 0, t.options, !0)), i = lo(t.el, t.options, se), u = 10;
  return a ? e.clientX < i.left - u || e.clientY < l.top && e.clientX < l.right : e.clientY < i.top - u || e.clientY < l.bottom && e.clientX < l.left;
}
function Rn(e, a, t) {
  var l = Te(dl(t.el, t.options.draggable)), i = lo(t.el, t.options, se), u = 10;
  return a ? e.clientX > i.right + u || e.clientY > l.bottom && e.clientX > l.left : e.clientY > i.bottom + u || e.clientX > l.right && e.clientY > l.top;
}
function Nn(e, a, t, l, i, u, m, v) {
  var p = l ? e.clientY : e.clientX, o = l ? t.height : t.width, n = l ? t.top : t.left, s = l ? t.bottom : t.right, b = !1;
  if (!m) {
    if (v && fa < o * i) {
      if (!aa && (ta === 1 ? p > n + o * u / 2 : p < s - o * u / 2) && (aa = !0), aa)
        b = !0;
      else if (ta === 1 ? p < n + fa : p > s - fa)
        return -ta;
    } else if (p > n + o * (1 - i) / 2 && p < s - o * (1 - i) / 2)
      return On(a);
  }
  return b = b || m, b && (p < n + o * u / 2 || p > s - o * u / 2) ? p > n + o / 2 ? 1 : -1 : 0;
}
function On(e) {
  return We(G) < We(e) ? 1 : -1;
}
function Mn(e) {
  for (var a = e.tagName + e.className + e.src + e.href + e.textContent, t = a.length, l = 0; t--; )
    l += a.charCodeAt(t);
  return l.toString(36);
}
function Fn(e) {
  Va.length = 0;
  for (var a = e.getElementsByTagName("input"), t = a.length; t--; ) {
    var l = a[t];
    l.checked && Va.push(l);
  }
}
function pa(e) {
  return setTimeout(e, 0);
}
function Za(e) {
  return clearTimeout(e);
}
Ua && pe(document, "touchmove", function(e) {
  (ie.active || Mt) && e.cancelable && e.preventDefault();
});
ie.utils = {
  on: pe,
  off: me,
  css: oe,
  find: _l,
  is: function(a, t) {
    return !!Je(a, t, a, !1);
  },
  extend: kn,
  throttle: eo,
  closest: Je,
  toggleClass: Be,
  clone: ao,
  index: We,
  nextTick: pa,
  cancelNextTick: Za,
  detectDirection: io,
  getChild: qt,
  expando: ze
};
ie.get = function(e) {
  return e[ze];
};
ie.mount = function() {
  for (var e = arguments.length, a = new Array(e), t = 0; t < e; t++)
    a[t] = arguments[t];
  a[0].constructor === Array && (a = a[0]), a.forEach(function(l) {
    if (!l.prototype || !l.prototype.constructor)
      throw "Sortable: Mounted plugin must be a constructor function, not ".concat({}.toString.call(l));
    l.utils && (ie.utils = tt(tt({}, ie.utils), l.utils)), ia.mount(l);
  });
};
ie.create = function(e, a) {
  return new ie(e, a);
};
ie.version = yn;
var Se = [], Yt, Qa, _a = !1, ja, qa, $a, Xt;
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
      this.sortable.nativeDraggable ? pe(document, "dragover", this._handleAutoScroll) : this.options.supportPointer ? pe(document, "pointermove", this._handleFallbackAutoScroll) : l.touches ? pe(document, "touchmove", this._handleFallbackAutoScroll) : pe(document, "mousemove", this._handleFallbackAutoScroll);
    },
    dragOverCompleted: function(t) {
      var l = t.originalEvent;
      !this.options.dragOverBubble && !l.rootEl && this._handleAutoScroll(l);
    },
    drop: function() {
      this.sortable.nativeDraggable ? me(document, "dragover", this._handleAutoScroll) : (me(document, "pointermove", this._handleFallbackAutoScroll), me(document, "touchmove", this._handleFallbackAutoScroll), me(document, "mousemove", this._handleFallbackAutoScroll)), Il(), ba(), wn();
    },
    nulling: function() {
      $a = Qa = Yt = _a = Xt = ja = qa = null, Se.length = 0;
    },
    _handleFallbackAutoScroll: function(t) {
      this._handleAutoScroll(t, !0);
    },
    _handleAutoScroll: function(t, l) {
      var i = this, u = (t.touches ? t.touches[0] : t).clientX, m = (t.touches ? t.touches[0] : t).clientY, v = document.elementFromPoint(u, m);
      if ($a = t, l || this.options.forceAutoScrollFallback || oa || it || Qt) {
        Wa(t, this.options, v, l);
        var p = vt(v, !0);
        _a && (!Xt || u !== ja || m !== qa) && (Xt && Il(), Xt = setInterval(function() {
          var o = vt(document.elementFromPoint(u, m), !0);
          o !== p && (p = o, ba()), Wa(t, i.options, o, l);
        }, 10), ja = u, qa = m);
      } else {
        if (!this.options.bubbleScroll || vt(v, !0) === et()) {
          ba();
          return;
        }
        Wa(t, this.options, vt(v, !1), !1);
      }
    }
  }, ot(e, {
    pluginName: "scroll",
    initializeByDefault: !0
  });
}
function ba() {
  Se.forEach(function(e) {
    clearInterval(e.pid);
  }), Se = [];
}
function Il() {
  clearInterval(Xt);
}
var Wa = eo(function(e, a, t, l) {
  if (a.scroll) {
    var i = (e.touches ? e.touches[0] : e).clientX, u = (e.touches ? e.touches[0] : e).clientY, m = a.scrollSensitivity, v = a.scrollSpeed, p = et(), o = !1, n;
    Qa !== t && (Qa = t, ba(), Yt = a.scroll, n = a.scrollFn, Yt === !0 && (Yt = vt(t, !0)));
    var s = 0, b = Yt;
    do {
      var f = b, k = Te(f), $ = k.top, N = k.bottom, V = k.left, A = k.right, T = k.width, P = k.height, x = void 0, D = void 0, E = f.scrollWidth, le = f.scrollHeight, z = oe(f), j = f.scrollLeft, O = f.scrollTop;
      f === p ? (x = T < E && (z.overflowX === "auto" || z.overflowX === "scroll" || z.overflowX === "visible"), D = P < le && (z.overflowY === "auto" || z.overflowY === "scroll" || z.overflowY === "visible")) : (x = T < E && (z.overflowX === "auto" || z.overflowX === "scroll"), D = P < le && (z.overflowY === "auto" || z.overflowY === "scroll"));
      var ne = x && (Math.abs(A - i) <= m && j + T < E) - (Math.abs(V - i) <= m && !!j), C = D && (Math.abs(N - u) <= m && O + P < le) - (Math.abs($ - u) <= m && !!O);
      if (!Se[s])
        for (var R = 0; R <= s; R++)
          Se[R] || (Se[R] = {});
      (Se[s].vx != ne || Se[s].vy != C || Se[s].el !== f) && (Se[s].el = f, Se[s].vx = ne, Se[s].vy = C, clearInterval(Se[s].pid), (ne != 0 || C != 0) && (o = !0, Se[s].pid = setInterval(function() {
        l && this.layer === 0 && ie.active._onTouchMove($a);
        var M = Se[this.layer].vy ? Se[this.layer].vy * v : 0, Z = Se[this.layer].vx ? Se[this.layer].vx * v : 0;
        typeof n == "function" && n.call(ie.dragged.parentNode[ze], Z, M, e, $a, Se[this.layer].el) !== "continue" || to(Se[this.layer].el, Z, M);
      }.bind({
        layer: s
      }), 24))), s++;
    } while (a.bubbleScroll && b !== p && (b = vt(b, !1)));
    _a = o;
  }
}, 30), uo = function(a) {
  var t = a.originalEvent, l = a.putSortable, i = a.dragEl, u = a.activeSortable, m = a.dispatchSortableEvent, v = a.hideGhostForTarget, p = a.unhideGhostForTarget;
  if (t) {
    var o = l || u;
    v();
    var n = t.changedTouches && t.changedTouches.length ? t.changedTouches[0] : t, s = document.elementFromPoint(n.clientX, n.clientY);
    p(), o && !o.el.contains(s) && (m("spill"), this.onSpill({
      dragEl: i,
      putSortable: l
    }));
  }
};
function ul() {
}
ul.prototype = {
  startIndex: null,
  dragStart: function(a) {
    var t = a.oldDraggableIndex;
    this.startIndex = t;
  },
  onSpill: function(a) {
    var t = a.dragEl, l = a.putSortable;
    this.sortable.captureAnimationState(), l && l.captureAnimationState();
    var i = qt(this.sortable.el, this.startIndex, this.options);
    i ? this.sortable.el.insertBefore(t, i) : this.sortable.el.appendChild(t), this.sortable.animateAll(), l && l.animateAll();
  },
  drop: uo
};
ot(ul, {
  pluginName: "revertOnSpill"
});
function cl() {
}
cl.prototype = {
  onSpill: function(a) {
    var t = a.dragEl, l = a.putSortable, i = l || this.sortable;
    i.captureAnimationState(), t.parentNode && t.parentNode.removeChild(t), i.animateAll();
  },
  drop: uo
};
ot(cl, {
  pluginName: "removeOnSpill"
});
ie.mount(new Ln());
ie.mount(cl, ul);
function zn(e, a) {
  const t = e.oldDraggableIndex ?? e.oldIndex;
  e.item.remove();
  const l = [...e.from.children].filter((i) => i.matches(a));
  e.from.insertBefore(e.item, l[t ?? l.length] ?? null);
}
function co(e) {
  const a = /* @__PURE__ */ new Map();
  function t(l) {
    a.get(l)?.destroy(), a.delete(l);
  }
  return bt(() => {
    for (const l of a.keys()) t(l);
  }), {
    mounted(l) {
      const i = l.querySelector(".work-field-builder") ?? l;
      a.set(l, new ie(i, {
        draggable: ".work-reorder-entry",
        handle: ".work-reorder-handle",
        forceFallback: !0,
        fallbackOnBody: !1,
        ghostClass: "work-drag-ghost",
        onEnd(u) {
          const m = u.oldDraggableIndex, v = u.newDraggableIndex;
          zn(u, ".work-reorder-entry"), m !== void 0 && v !== void 0 && m !== v && e(m, v);
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
}, _n = /* @__PURE__ */ fe({
  __name: "OptionsEditor",
  props: {
    field: {}
  },
  emits: ["validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, i = "options:" + al(), u = H(() => t.field.options ?? []), m = H(() => u.value.every((s, b) => !!s.id && u.value.findIndex((f) => f.id === s.id) === b));
    xe(m, (s) => l("validity", s, i), { immediate: !0 }), bt(() => l("validity", !0, i));
    function v(s, b) {
      Wl(u.value, s, b - s), u.value.forEach((f, k) => f.order = k);
    }
    const p = co(v), o = ["primary", "success", "info", "warn", "danger", "secondary"];
    function n() {
      let s = u.value.length + 1;
      for (; u.value.some((b) => b.id === `option_${s}`); ) s++;
      (t.field.options ??= []).push({ id: `option_${s}`, label: "New option", order: u.value.length });
    }
    return (s, b) => (c(), g("section", Bn, [
      b[4] || (b[4] = d("header", { class: "work-row" }, [
        d("h4", null, "Options"),
        d("span", { class: "work-muted work-small" }, "Stable IDs keep existing values when labels change."),
        d("span", { class: "work-spacer" })
      ], -1)),
      _e((c(), g("div", jn, [
        (c(!0), g(X, null, te(u.value, (f, k) => (c(), g("div", {
          key: k,
          class: "work-option-row work-reorder-entry"
        }, [
          h(r(Y), {
            type: "button",
            class: "work-icon-button work-reorder-handle",
            "aria-label": "Drag option; arrow keys reorder",
            onKeydown: [
              Ne(he(($) => v(k, k - 1), ["prevent"]), ["up"]),
              Ne(he(($) => v(k, k + 1), ["prevent"]), ["down"])
            ],
            severity: "secondary",
            text: "",
            size: "small"
          }, {
            default: L(() => [
              h(r(Q), {
                icon: "tabler:grip-vertical",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["onKeydown"]),
          d("label", qn, [
            b[0] || (b[0] = F("Label", -1)),
            h(r(ce), {
              modelValue: f.label,
              "onUpdate:modelValue": ($) => f.label = $,
              "aria-label": "Option label"
            }, null, 8, ["modelValue", "onUpdate:modelValue"])
          ]),
          d("label", Wn, [
            b[1] || (b[1] = F("ID", -1)),
            h(r(ce), {
              modelValue: f.id,
              "onUpdate:modelValue": ($) => f.id = $,
              class: "work-option-code",
              required: "",
              "aria-label": "Option ID"
            }, null, 8, ["modelValue", "onUpdate:modelValue"])
          ]),
          d("div", Kn, [
            d("label", Gn, [
              b[2] || (b[2] = F("Color", -1)),
              d("span", Hn, [
                d("span", {
                  class: ft(["work-color-swatch", "work-swatch-" + (f.color || "secondary")]),
                  "aria-hidden": "true"
                }, null, 2),
                h(r(ae), {
                  modelValue: f.color,
                  "onUpdate:modelValue": ($) => f.color = $,
                  "aria-label": "Option color",
                  appendTo: "self",
                  optionLabel: "label",
                  optionValue: "value",
                  optionDisabled: "disabled",
                  options: [{ label: "Default", value: void 0, disabled: !1 }, ...(o ?? []).map(($) => ({ label: $, value: $, disabled: !1 }))]
                }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
              ])
            ]),
            d("label", Yn, [
              b[3] || (b[3] = F("Category", -1)),
              h(r(ae), {
                "model-value": f.category,
                "aria-label": "Option category",
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                showClear: "",
                options: ["triage", "backlog", ...r(ql)].map(($) => ({ label: r(Tt)($), value: $ })),
                "onUpdate:modelValue": ($) => f.category = $ || void 0
              }, null, 8, ["model-value", "options", "onUpdate:modelValue"])
            ])
          ]),
          d("div", Xn, [
            h(r(Y), {
              "aria-label": "Option earlier",
              severity: "secondary",
              size: "small",
              disabled: k === 0,
              onClick: ($) => v(k, k - 1),
              text: ""
            }, {
              default: L(() => [
                h(r(Q), {
                  icon: "tabler:arrow-up",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["disabled", "onClick"]),
            h(r(Y), {
              "aria-label": "Option later",
              severity: "secondary",
              size: "small",
              disabled: k === u.value.length - 1,
              onClick: ($) => v(k, k + 1),
              text: ""
            }, {
              default: L(() => [
                h(r(Q), {
                  icon: "tabler:arrow-down",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["disabled", "onClick"]),
            h(r(Y), {
              label: "Remove",
              "aria-label": "Remove option",
              severity: "secondary",
              text: "",
              size: "small",
              onClick: ($) => u.value.splice(k, 1)
            }, {
              icon: L(() => [
                h(r(Q), {
                  icon: "tabler:trash",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["onClick"])
          ])
        ]))), 128)),
        m.value ? U("", !0) : (c(), g("p", Jn, "Option IDs must be nonempty and unique.")),
        d("div", Zn, [
          h(r(Y), {
            label: "Add option",
            severity: "secondary",
            size: "small",
            onClick: n,
            outlined: ""
          }, {
            icon: L(() => [
              h(r(Q), {
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
      u.value.length ? U("", !0) : (c(), g("p", Qn, "Add the choices people can select for this field."))
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
  key: 2,
  class: "work-stack work-tight"
}, hs = {
  key: 3,
  class: "work-stack work-tight"
}, ys = { class: "work-stack work-tight" }, gs = { class: "work-stack work-tight" }, ks = { class: "work-stack work-tight" }, ws = { class: "work-stack work-tight" }, Vs = { class: "work-stack" }, $s = {
  key: 0,
  class: "work-stack work-tight"
}, xs = { class: "work-row work-add-definition" }, Cs = { class: "work-stack work-tight" }, Ss = /* @__PURE__ */ fe({
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
    const t = e, l = a, i = H(() => t.draft.fields ?? []), u = B(""), m = B(""), v = B({}), p = co((x, D) => A(x, D - x));
    function o(x) {
      return (t.draft.item_types ?? []).filter((D) => D.fields.includes(x)).map((D) => D.title || ye(D.id));
    }
    async function n(x) {
      if (!m.value) {
        m.value = x.code;
        try {
          const D = await t.guardRemoval?.("fields", x.code);
          v.value[x.code] = D ?? "", D || la(t.draft, "fields", x.code);
        } finally {
          m.value = "";
        }
      }
    }
    const s = Object.entries({ text: "Text", int: "Whole number", dec: "Decimal number", quantity: "Measurement", bool: "Yes or no", time: "Date or time", ref: "Reference", record: "Structured data", option: "Choice", principal: "Person or group", item: "Work item", rank: "Order", rich_text: "Formatted text", formula: "Formula", rollup: "Related item calculation", counter: "Counter" }).map(([x, D]) => ({ value: x, label: D }));
    function b(x) {
      return x.type && x.type !== "value" ? x.type : x.form ?? "text";
    }
    const f = H(() => new Map(t.installedTypes?.map((x) => [x.id, x])));
    function k(x) {
      const D = f.value.get(b(x))?.config_schema;
      return D && Eo(D).length ? D : void 0;
    }
    function $(x) {
      const D = f.value.get(b(x)), E = D?.form ?? x.form;
      return !!D?.config_schema || ["dec", "quantity", "ref", "time", "record"].includes(E ?? "") || !!x.config;
    }
    function N(x, D) {
      x.type = D, delete x.form;
    }
    function V(x, D) {
      const E = { option: "text", principal: "ref", item: "ref", rank: "text", rich_text: "text", formula: "int", rollup: "int", counter: "int" };
      E[D] ? (x.type = D, x.form = E[D]) : (delete x.type, x.form = D), D !== "option" ? delete x.options : x.options ??= [], D === "rich_text" && (x.config = { format: "json" });
    }
    function A(x, D) {
      Wl(i.value, x, D);
      for (const E of t.draft.item_types ?? []) {
        const le = new Set(E.fields);
        E.fields = i.value.filter((z) => le.has(z.code)).map((z) => z.code);
      }
    }
    function T(x, D) {
      try {
        Ao(t.draft, x, D.value), delete v.value[x.code];
      } catch (E) {
        v.value[x.code] = E.message, D.value = x.code;
      }
    }
    function P() {
      !/^[a-z][a-z0-9_]*$/.test(u.value) || i.value.some((x) => x.code === u.value) || ((t.draft.fields ??= []).push({ code: u.value, form: "text", cardinality: "one" }), u.value = "");
    }
    return (x, D) => (c(), g("section", es, [
      d("header", ts, [
        D[2] || (D[2] = d("div", null, [
          d("h2", null, "Fields"),
          d("p", { class: "work-muted work-small" }, "Shape the information each item carries. Drag the handle or use the arrows to arrange fields.")
        ], -1)),
        h(r(Oe), {
          class: "kx-tag-sm",
          severity: "secondary"
        }, {
          default: L(() => [
            F(I(i.value.length) + " " + I(i.value.length === 1 ? "field" : "fields"), 1)
          ]),
          _: 1
        })
      ]),
      _e((c(), q(Da, {
        columns: "fields",
        count: i.value.length
      }, {
        default: L(() => [
          (c(!0), g(X, null, te(i.value, (E, le) => (c(), q(Ta, {
            title: r(Ge)(E),
            code: E.code,
            kind: f.value.get(b(E))?.title || r(s).find((z) => z.value === b(E))?.label || r(ye)(b(E)),
            key: E.id ?? le,
            class: "work-field-row work-reorder-entry work-stack"
          }, {
            handle: L(() => [
              h(r(Y), {
                type: "button",
                class: "work-reorder-handle work-icon-button",
                "aria-label": "Drag " + E.code + "; arrow keys reorder",
                onKeydown: [
                  Ne(he((z) => A(le, -1), ["prevent"]), ["up"]),
                  Ne(he((z) => A(le, 1), ["prevent"]), ["down"])
                ],
                severity: "secondary",
                text: "",
                size: "small"
              }, {
                default: L(() => [
                  h(r(Q), {
                    icon: "tabler:grip-vertical",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["aria-label", "onKeydown"])
            ]),
            flags: L(() => [
              E.track ? (c(), q(r(Oe), {
                key: 0,
                class: "kx-tag-sm",
                severity: "secondary",
                value: "Tracked"
              })) : U("", !0),
              E.intervals ? (c(), q(r(Oe), {
                key: 1,
                class: "kx-tag-sm",
                severity: "secondary",
                value: "Intervals"
              })) : U("", !0)
            ]),
            usage: L(() => [
              o(E.code).length ? (c(), g("details", as, [
                d("summary", ls, "Used by " + I(o(E.code).length) + " " + I(o(E.code).length === 1 ? "type" : "types"), 1),
                d("span", os, I(o(E.code).join(", ")), 1)
              ])) : U("", !0)
            ]),
            actions: L(() => [
              h(r(Y), {
                "aria-label": "Move " + E.code + " earlier",
                severity: "secondary",
                disabled: le === 0,
                onClick: (z) => A(le, -1),
                text: "",
                size: "small"
              }, {
                default: L(() => [
                  h(r(Q), {
                    icon: "tabler:arrow-up",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["aria-label", "disabled", "onClick"]),
              h(r(Y), {
                "aria-label": "Move " + E.code + " later",
                severity: "secondary",
                disabled: le === i.value.length - 1,
                onClick: (z) => A(le, 1),
                text: "",
                size: "small"
              }, {
                default: L(() => [
                  h(r(Q), {
                    icon: "tabler:arrow-down",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["aria-label", "disabled", "onClick"]),
              h(r(Y), {
                severity: "secondary",
                text: "",
                size: "small",
                disabled: !!m.value,
                onClick: (z) => n(E),
                "aria-label": "Remove field"
              }, {
                default: L(() => [
                  h(r(Q), {
                    icon: "tabler:trash",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["disabled", "onClick"])
            ]),
            default: L(() => [
              v.value[E.code] ? (c(), g("p", is, I(v.value[E.code]), 1)) : U("", !0),
              (c(!0), g(X, null, te(e.issues?.filter((z) => z.code === E.code) ?? [], (z) => (c(), g("p", {
                key: z.what,
                class: "work-error work-small",
                role: "alert"
              }, I(r(Sa)(z)) + " · " + I(z.what), 1))), 128)),
              d("div", ns, [
                d("label", ss, [
                  D[3] || (D[3] = F("Title", -1)),
                  h(r(ce), {
                    modelValue: E.title,
                    "onUpdate:modelValue": (z) => E.title = z,
                    "aria-label": "Field title",
                    maxlength: "255",
                    placeholder: r(Ge)(E)
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder"])
                ]),
                d("label", rs, [
                  D[4] || (D[4] = F("Field identifier", -1)),
                  h(r(ce), {
                    value: E.code,
                    "aria-label": "Field code",
                    required: "",
                    pattern: "[a-z][a-z0-9_]*",
                    onInput: (z) => T(E, z.target)
                  }, null, 8, ["value", "onInput"])
                ]),
                d("label", ds, [
                  D[5] || (D[5] = F("Kind", -1)),
                  h(r(ae), {
                    "model-value": b(E),
                    "onUpdate:modelValue": (z) => V(E, z),
                    appendTo: "self",
                    options: r(s),
                    optionLabel: "label",
                    optionValue: "value"
                  }, null, 8, ["model-value", "onUpdate:modelValue", "options"])
                ]),
                d("label", us, [
                  D[6] || (D[6] = F("Values allowed", -1)),
                  h(r(ae), {
                    "model-value": E.cardinality ?? "one",
                    "onUpdate:modelValue": (z) => E.cardinality = z,
                    appendTo: "self",
                    options: [{ label: "One value", value: "one" }, { label: "Multiple unique values", value: "set" }, { label: "Ordered values", value: "list" }],
                    optionLabel: "label",
                    optionValue: "value"
                  }, null, 8, ["model-value", "onUpdate:modelValue"])
                ]),
                d("label", cs, [
                  D[7] || (D[7] = F("Search support", -1)),
                  h(r(ae), {
                    "model-value": E.index ?? "none",
                    "onUpdate:modelValue": (z) => E.index = z,
                    appendTo: "self",
                    options: [{ label: "None", value: "none" }, { label: "Exact matches", value: "key" }, { label: "Numeric ranges", value: "number" }],
                    optionLabel: "label",
                    optionValue: "value"
                  }, null, 8, ["model-value", "onUpdate:modelValue"])
                ])
              ]),
              d("section", vs, [
                D[10] || (D[10] = d("h4", { class: "work-group-title" }, "History", -1)),
                d("div", ms, [
                  d("div", fs, [
                    D[8] || (D[8] = d("div", { class: "work-row-main" }, [
                      d("strong", null, "Track changes"),
                      d("p", { class: "work-muted work-small" }, "Record each value change in the item history.")
                    ], -1)),
                    h(r(qe), {
                      modelValue: E.track,
                      "onUpdate:modelValue": (z) => E.track = z,
                      "aria-label": "Track changes"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ]),
                  d("div", ps, [
                    D[9] || (D[9] = d("div", { class: "work-row-main" }, [
                      d("strong", null, "Track intervals"),
                      d("p", { class: "work-muted work-small" }, "Measure how long each value stays in effect.")
                    ], -1)),
                    h(r(qe), {
                      modelValue: E.intervals,
                      "onUpdate:modelValue": (z) => E.intervals = z,
                      "aria-label": "Track intervals"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ])
                ])
              ]),
              E.type === "option" ? (c(), q(_n, {
                key: 1,
                field: E,
                onValidity: D[0] || (D[0] = (z, j) => l("validity", j, z))
              }, null, 8, ["field"])) : U("", !0),
              E.type === "formula" || E.type === "rollup" ? (c(), g("label", bs, [
                D[11] || (D[11] = F("Result type", -1)),
                h(r(ae), {
                  modelValue: E.form,
                  "onUpdate:modelValue": (z) => E.form = z,
                  "aria-label": "Result type",
                  options: r(s).slice(0, 8),
                  optionLabel: "label",
                  optionValue: "value",
                  appendTo: "self"
                }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
              ])) : U("", !0),
              E.type === "formula" ? (c(), g("label", hs, [
                D[12] || (D[12] = F("Expression", -1)),
                h(r(ce), {
                  modelValue: E.expression,
                  "onUpdate:modelValue": (z) => E.expression = z
                }, null, 8, ["modelValue", "onUpdate:modelValue"])
              ])) : U("", !0),
              E.type === "rollup" ? (c(), g(X, { key: 4 }, [
                d("label", ys, [
                  D[13] || (D[13] = F("Of", -1)),
                  h(r(ce), {
                    modelValue: E.of,
                    "onUpdate:modelValue": (z) => E.of = z
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                d("label", gs, [
                  D[14] || (D[14] = F("Function", -1)),
                  h(r(ce), {
                    modelValue: E.fn,
                    "onUpdate:modelValue": (z) => E.fn = z
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                d("label", ks, [
                  D[15] || (D[15] = F("Field", -1)),
                  h(r(ce), {
                    modelValue: E.field,
                    "onUpdate:modelValue": (z) => E.field = z
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                d("label", ws, [
                  D[16] || (D[16] = F("Order by", -1)),
                  h(r(ae), {
                    "model-value": E.by,
                    "aria-label": "Rollup order",
                    options: ["rank", "time"],
                    showClear: "",
                    appendTo: "self",
                    "onUpdate:modelValue": (z) => E.by = z || void 0
                  }, null, 8, ["model-value", "onUpdate:modelValue"])
                ]),
                h(nl, {
                  modelValue: E.where,
                  "onUpdate:modelValue": (z) => E.where = z,
                  draft: e.draft,
                  "board-id": e.boardId,
                  label: "Include related items when",
                  onValidity: (z) => l("validity", "rollup-" + le, z)
                }, null, 8, ["modelValue", "onUpdate:modelValue", "draft", "board-id", "onValidity"])
              ], 64)) : U("", !0),
              k(E) ? (c(), q(ol, {
                key: E.type,
                schema: k(E),
                "model-value": E.config ?? {},
                "onUpdate:modelValue": (z) => E.config = z,
                onValidity: (z) => l("validity", "config-" + le, z)
              }, null, 8, ["schema", "model-value", "onUpdate:modelValue", "onValidity"])) : $(E) ? (c(), q(pt, {
                key: 6,
                label: "Field configuration",
                "model-value": E.config,
                shape: "object",
                "onUpdate:modelValue": (z) => E.config = z,
                onValidity: (z) => l("validity", "config-" + le, z)
              }, null, 8, ["model-value", "onUpdate:modelValue", "onValidity"])) : U("", !0),
              d("section", Vs, [
                D[18] || (D[18] = d("h4", { class: "work-group-title" }, "Access", -1)),
                e.installedTypes?.length ? (c(), g("label", $s, [
                  D[17] || (D[17] = F("Custom field type", -1)),
                  h(r(ae), {
                    "aria-label": "Custom field type",
                    "model-value": E.type,
                    options: e.installedTypes,
                    optionLabel: "title",
                    optionValue: "id",
                    appendTo: "self",
                    "onUpdate:modelValue": (z) => N(E, z)
                  }, null, 8, ["model-value", "options", "onUpdate:modelValue"])
                ])) : U("", !0),
                (c(), g(X, null, te(["read", "write"], (z) => h(Xl, {
                  "board-id": e.boardId,
                  key: z,
                  label: z === "read" ? "Who can read" : "Who can edit",
                  "model-value": E.access?.[z],
                  "onUpdate:modelValue": (j) => E.access = { ...E.access, [z]: j },
                  onValidity: (j) => l("validity", "access-" + le + z, j)
                }, null, 8, ["board-id", "label", "model-value", "onUpdate:modelValue", "onValidity"])), 64))
              ])
            ]),
            _: 2
          }, 1032, ["title", "code", "kind"]))), 128)),
          d("div", xs, [
            d("label", Cs, [
              D[19] || (D[19] = F("New field identifier", -1)),
              h(r(ce), {
                modelValue: u.value,
                "onUpdate:modelValue": D[1] || (D[1] = (E) => u.value = E),
                onKeydown: Ne(he(P, ["prevent"]), ["enter"])
              }, null, 8, ["modelValue", "onKeydown"])
            ]),
            h(r(Y), {
              label: "Add field",
              severity: "secondary",
              disabled: !u.value.trim(),
              onClick: P,
              outlined: ""
            }, {
              icon: L(() => [
                h(r(Q), {
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
}), Ts = ["disabled"], Ds = { class: "work-chips" }, Us = {
  key: 1,
  class: "work-muted work-small"
}, jt = /* @__PURE__ */ fe({
  __name: "ChipPicker",
  props: {
    label: {},
    options: {},
    modelValue: {},
    disabled: { type: Boolean }
  },
  emits: ["update:modelValue"],
  setup(e, { emit: a }) {
    const t = e, l = a, i = B(""), u = H(() => t.options.map((p) => typeof p == "string" ? { value: p } : p)), m = H(() => u.value.filter((p) => (p.label ?? ye(p.value)).toLocaleLowerCase().includes(i.value.toLocaleLowerCase())));
    function v(p) {
      if (t.disabled) return;
      const o = t.modelValue ?? [];
      l("update:modelValue", o.includes(p) ? o.filter((n) => n !== p) : [...o, p]);
    }
    return (p, o) => (c(), g("fieldset", {
      class: "work-chip-picker",
      disabled: e.disabled
    }, [
      d("legend", null, I(e.label), 1),
      e.options.length > 10 ? (c(), q(r(ce), {
        key: 0,
        modelValue: i.value,
        "onUpdate:modelValue": o[0] || (o[0] = (n) => i.value = n),
        type: "search",
        "aria-label": "Find " + e.label.toLowerCase(),
        placeholder: "Find a choice…"
      }, null, 8, ["modelValue", "aria-label"])) : U("", !0),
      d("div", Ds, [
        h(r(il), {
          "model-value": e.modelValue ?? [],
          options: m.value.map((n) => ({ value: n.value, label: n.label ?? r(ye)(n.value) })),
          optionLabel: "label",
          optionValue: "value",
          multiple: "",
          disabled: e.disabled,
          "aria-label": e.label,
          "onUpdate:modelValue": o[1] || (o[1] = (n) => l("update:modelValue", n ?? []))
        }, null, 8, ["model-value", "options", "disabled", "aria-label"]),
        (c(!0), g(X, null, te(e.modelValue?.filter((n) => !u.value.some((s) => s.value === n)) ?? [], (n) => (c(), q(r(Y), {
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
            F(I(r(ye)(n)) + " · unavailable ×", 1)
          ]),
          _: 2
        }, 1032, ["aria-label", "onClick"]))), 128))
      ]),
      e.options.length ? U("", !0) : (c(), g("span", Us, "No choices declared."))
    ], 8, Ts));
  }
}), Is = {
  class: "work-stack",
  "aria-label": "Item types editor"
}, Es = { class: "work-section-heading" }, As = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, Ps = { class: "work-definition-meta" }, Rs = { class: "work-settings-grid" }, Ns = { class: "work-stack work-tight" }, Os = { class: "work-stack work-tight" }, Ms = { class: "work-stack work-tight" }, Fs = { class: "work-stack work-tight" }, Ls = {
  key: 0,
  class: "work-stack work-tight work-small"
}, zs = {
  key: 0,
  class: "kx-empty"
}, Bs = { class: "work-row work-add-definition" }, js = { class: "work-stack work-tight" }, qs = {
  key: 0,
  class: "work-error work-small"
}, Ws = /* @__PURE__ */ fe({
  __name: "TypesEditor",
  props: {
    draft: {},
    guardRemoval: { type: Function },
    issues: {}
  },
  setup(e) {
    const a = e, t = H(() => a.draft.item_types ?? []), l = B(""), i = B(""), u = B(""), m = H(() => /^[a-z][a-z0-9_]*$/.test(l.value) && !t.value.some((b) => b.id === l.value));
    function v() {
      m.value && ((a.draft.item_types ??= []).push({ id: l.value, title: ye(l.value), process: a.draft.processes?.[0]?.id ?? "", fields: [] }), l.value = "");
    }
    function p(b, f) {
      const k = b.id;
      b.id = f;
      for (const $ of t.value) $.parent_types && ($.parent_types = $.parent_types.map((N) => N === k ? f : N));
    }
    function o(b, f) {
      b.fields = f, b.inherit && (b.inherit = b.inherit.filter((k) => f.includes(k)));
    }
    function n(b) {
      return t.value.filter((f) => f.id !== b.id && f.parent_types?.includes(b.id)).map((f) => f.title || ye(f.id));
    }
    async function s(b) {
      if (!u.value) {
        if (n(b).length) {
          i.value = `${b.title || ye(b.id)} is a parent type for ${n(b).join(", ")}. Remove those parent selections first.`;
          return;
        }
        u.value = b.id, i.value = "";
        try {
          const f = await a.guardRemoval?.("item_types", b.id);
          f ? i.value = f : la(a.draft, "item_types", b.id);
        } finally {
          u.value = "";
        }
      }
    }
    return (b, f) => (c(), g("section", Is, [
      d("header", Es, [
        f[1] || (f[1] = d("div", null, [
          d("h2", null, "Item types"),
          d("p", { class: "work-muted work-small" }, "Choose the fields, parent relationships and process for each kind of work.")
        ], -1)),
        h(r(Oe), {
          class: "kx-tag-sm",
          severity: "secondary"
        }, {
          default: L(() => [
            F(I(t.value.length) + " " + I(t.value.length === 1 ? "type" : "types"), 1)
          ]),
          _: 1
        })
      ]),
      i.value ? (c(), g("p", As, I(i.value), 1)) : U("", !0),
      h(Da, {
        columns: "types",
        count: t.value.length
      }, {
        default: L(() => [
          (c(!0), g(X, null, te(t.value, (k, $) => (c(), q(Ta, {
            title: k.title || r(ye)(k.id),
            code: k.id,
            kind: e.draft.processes?.find((N) => N.id === k.process)?.name || r(ye)(k.process),
            key: $,
            class: "work-type-card"
          }, {
            usage: L(() => [
              d("span", Ps, [
                h(r(Oe), {
                  class: "kx-tag-sm",
                  severity: "secondary"
                }, {
                  default: L(() => [
                    F(I(k.fields.length) + " " + I(k.fields.length === 1 ? "field" : "fields"), 1)
                  ]),
                  _: 2
                }, 1024),
                n(k).length ? (c(), q(r(Oe), {
                  key: 0,
                  class: "kx-tag-sm",
                  severity: "secondary"
                }, {
                  default: L(() => [
                    F("Parent of " + I(n(k).join(", ")), 1)
                  ]),
                  _: 2
                }, 1024)) : U("", !0)
              ])
            ]),
            actions: L(() => [
              h(r(Y), {
                severity: "secondary",
                text: "",
                size: "small",
                disabled: !!u.value,
                onClick: (N) => s(k),
                "aria-label": "Remove type"
              }, {
                default: L(() => [
                  h(r(Q), {
                    icon: "tabler:trash",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["disabled", "onClick"])
            ]),
            default: L(() => [
              (c(!0), g(X, null, te(e.issues?.filter((N) => N.code === "item_type " + k.id) ?? [], (N) => (c(), g("p", {
                key: N.what,
                class: "work-error work-small",
                role: "alert"
              }, I(r(Sa)(N)), 1))), 128)),
              d("div", Rs, [
                d("label", Ns, [
                  f[2] || (f[2] = F("Identifier", -1)),
                  h(r(ce), {
                    value: k.id,
                    onChange: (N) => p(k, N.target.value),
                    required: "",
                    pattern: "[a-z][a-z0-9_]*"
                  }, null, 8, ["value", "onChange"])
                ]),
                d("label", Os, [
                  f[3] || (f[3] = F("Title", -1)),
                  h(r(ce), {
                    modelValue: k.title,
                    "onUpdate:modelValue": (N) => k.title = N,
                    placeholder: r(ye)(k.id)
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder"])
                ]),
                d("label", Ms, [
                  f[4] || (f[4] = F("Process", -1)),
                  h(r(ae), {
                    modelValue: k.process,
                    "onUpdate:modelValue": (N) => k.process = N,
                    required: "",
                    appendTo: "self",
                    optionLabel: "label",
                    optionValue: "value",
                    optionDisabled: "disabled",
                    options: [...(e.draft.processes ?? []).map((N) => ({ label: N.name || r(ye)(N.id), value: N.id, disabled: !1 }))]
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                ])
              ]),
              h(jt, {
                label: "Fields",
                options: (e.draft.fields ?? []).map((N) => ({ value: N.code, label: r(Ge)(N) })),
                "model-value": k.fields,
                "onUpdate:modelValue": (N) => o(k, N)
              }, null, 8, ["options", "model-value", "onUpdate:modelValue"]),
              h(jt, {
                label: "Parent types",
                options: t.value.map((N) => ({ value: N.id, label: N.title || r(ye)(N.id) })),
                modelValue: k.parent_types,
                "onUpdate:modelValue": (N) => k.parent_types = N
              }, null, 8, ["options", "modelValue", "onUpdate:modelValue"]),
              d("div", Fs, [
                h(jt, {
                  label: "Inherit from parent",
                  options: k.fields.map((N) => ({ value: N, label: r(Ge)(e.draft.fields?.find((V) => V.code === N) ?? { code: N }) })),
                  modelValue: k.inherit,
                  "onUpdate:modelValue": (N) => k.inherit = N
                }, null, 8, ["options", "modelValue", "onUpdate:modelValue"]),
                f[5] || (f[5] = d("p", { class: "work-muted work-small" }, "These fields resolve from the parent when this item has no own value.", -1))
              ]),
              k.parent_types?.length ? (c(), g("label", Ls, [
                f[6] || (f[6] = F("When the parent moves", -1)),
                h(r(ae), {
                  modelValue: k.move_children,
                  "onUpdate:modelValue": (N) => k.move_children = N,
                  appendTo: "self",
                  optionLabel: "label",
                  optionValue: "value",
                  optionDisabled: "disabled",
                  options: [{ label: "Default", value: void 0, disabled: !1 }, { label: "Move children", value: "move", disabled: !1 }, { label: "Refuse while children exist", value: "refuse", disabled: !1 }]
                }, null, 8, ["modelValue", "onUpdate:modelValue"])
              ])) : U("", !0)
            ]),
            _: 2
          }, 1032, ["title", "code", "kind"]))), 128)),
          t.value.length ? U("", !0) : (c(), g("p", zs, "Add an item type to connect fields to a process.")),
          d("div", Bs, [
            d("label", js, [
              f[7] || (f[7] = F("New type identifier", -1)),
              h(r(ce), {
                modelValue: l.value,
                "onUpdate:modelValue": f[0] || (f[0] = (k) => l.value = k),
                placeholder: "new_type",
                onKeydown: Ne(he(v, ["prevent"]), ["enter"])
              }, null, 8, ["modelValue", "onKeydown"])
            ]),
            h(r(Y), {
              label: "Add type",
              severity: "secondary",
              disabled: !m.value,
              onClick: v,
              outlined: ""
            }, {
              icon: L(() => [
                h(r(Q), {
                  icon: "tabler:plus",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["disabled"]),
            l.value && !m.value ? (c(), g("span", qs, "Use a unique lowercase identifier with letters, numbers and underscores.")) : U("", !0)
          ])
        ]),
        _: 1
      }, 8, ["count"])
    ]));
  }
}), Ks = ".work-process-canvas>svg{height:480px;width:100%}.work-process-canvas:focus-visible{outline:var(--p-focus-ring-width) var(--p-focus-ring-style) var(--p-focus-ring-color);outline-offset:var(--p-focus-ring-offset)}.work-state-card{fill:var(--p-content-background);stroke:var(--p-content-border-color);stroke-width:1.5}.work-graph-node.work-selected .work-state-card{stroke:var(--p-primary-color);stroke-width:2.5;fill:color-mix(in srgb,var(--p-primary-color) 6%,var(--p-content-background))}.work-graph-node:focus-visible .work-state-card{stroke:var(--p-focus-ring-color);stroke-width:var(--p-focus-ring-width)}.work-process-canvas .work-edge-label{font-size:12px;fill:var(--p-text-color)}.work-process-canvas .work-edge-label-bg{fill:var(--p-content-background);stroke:var(--p-content-border-color);stroke-width:1}.work-edge-line{stroke:var(--p-primary-color);stroke-width:1.5}.work-edge-return .work-edge-line{stroke:var(--p-text-muted-color);stroke-dasharray:5 4}.work-graph-arrow{fill:context-stroke}.work-lane-line{fill:none;stroke:var(--p-text-muted-color);stroke-width:1.5;stroke-dasharray:2 4}.work-node-connector{fill:var(--p-content-background);stroke:var(--p-primary-color);stroke-width:1.5}.work-node-connector:hover,.work-node-connector:focus-visible{fill:var(--p-primary-color)}.work-process-legend{position:static;flex-wrap:wrap;padding:10px 16px;border-top:1px solid var(--p-content-border-color);background:var(--p-content-background)}@media(max-width:700px){.work-process-canvas>svg{height:420px}}.work-process-more{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:8px;padding:8px 16px;border-top:1px solid var(--p-content-border-color);background:var(--p-content-background);color:var(--p-text-muted-color);font-size:12px}.work-process-canvas .work-graph-edge.work-selected .work-edge-label-bg{fill:var(--p-primary-color);stroke:var(--p-primary-color)}.work-process-canvas .work-graph-edge.work-selected .work-edge-label{fill:var(--p-primary-contrast-color)}", El = /* @__PURE__ */ new WeakSet();
function Gs(e) {
  const a = e.getRootNode();
  if (a instanceof ShadowRoot && !El.has(a)) {
    const t = e.ownerDocument.createElement("style");
    t.textContent = Ks, a.append(t), El.add(a);
  }
}
const Hs = 0.8;
function Ys(e, a, t) {
  const l = Math.min(1, a.width / e.width, a.height / e.height);
  if (l >= Hs) return { zoom: l, pan: { x: (e.width - a.width / l) / 2, y: (e.height - a.height / l) / 2 } };
  const i = e.nodes.find((m) => m.state.id === t) ?? e.nodes[0], u = Math.min(1, a.width / ((i?.width ?? 190) + 64));
  return { zoom: u, pan: i ? { x: e.direction === "TB" ? i.x - a.width / u / 2 : i.x - i.width / 2 - 32, y: e.direction === "TB" ? i.y - i.height / 2 - 32 : i.y - a.height / u / 2 } : { x: 0, y: 0 } };
}
const Xs = ["onKeydown"], Js = {
  key: 0,
  class: "work-process-instruction",
  role: "status"
}, Zs = ["viewBox"], Qs = ["id"], _s = ["d", "marker-end"], er = ["aria-label", "aria-pressed", "onFocus", "onClick", "onKeydown"], tr = ["d"], ar = ["d", "marker-end"], lr = ["x", "y", "width", "height"], or = ["x", "y"], ir = ["x", "dy"], nr = ["aria-label", "aria-pressed", "onClick", "onKeydown", "onFocus", "onPointerup"], sr = ["x", "y", "width", "height"], rr = ["cx", "cy"], dr = ["x", "y"], ur = ["x", "dy"], cr = ["x", "y"], vr = ["x", "dy"], mr = {
  key: 0,
  class: "work-limit-text"
}, fr = ["aria-label", "onClick", "onKeydown"], pr = ["x", "y"], br = ["x", "dy"], hr = ["cx", "cy", "aria-label", "onPointerdown", "onClick", "onKeydown"], yr = ["d"], gr = {
  key: 1,
  class: "work-process-more",
  role: "status"
}, kr = { class: "work-process-legend" }, wr = /* @__PURE__ */ fe({
  __name: "ProcessGraph",
  props: {
    process: {},
    draft: {},
    selectedState: {},
    selectedTransition: {}
  },
  emits: ["state", "transition", "connect", "clear"],
  setup(e, { expose: a, emit: t }) {
    const l = e, i = t, u = al().replace(/:/g, "_"), m = B(""), v = B(), p = B(), o = B(900), n = B(!1), s = H(() => o.value < 700 ? 420 : 480), b = H(() => ti(l.process, l.draft, { width: o.value, height: s.value })), f = B(1), k = B({ x: 0, y: 0 }), $ = B({ x: 0, y: 0 }), N = H(() => ({ width: o.value, height: n.value ? Math.max(s.value, b.value.height * Math.min(1, o.value / b.value.width)) : s.value })), V = H(() => b.value.nodes.filter((y) => y.x - y.width / 2 >= k.value.x && y.x + y.width / 2 <= k.value.x + N.value.width / f.value && y.y - y.height / 2 >= k.value.y && y.y + y.height / 2 <= k.value.y + N.value.height / f.value).length);
    function A() {
      n.value = !1;
      const y = Ys(b.value, N.value, l.process.initial);
      f.value = y.zoom, k.value = y.pan;
    }
    const T = H(() => `${k.value.x} ${k.value.y} ${N.value.width / f.value} ${N.value.height / f.value}`), P = H(() => b.value.nodes.find((y) => y.state.id === m.value));
    function x() {
      n.value = !0, f.value = Math.min(1, N.value.width / b.value.width), k.value = { x: (b.value.width - N.value.width / f.value) / 2, y: 0 };
    }
    function D(y) {
      const S = Math.max(0.02, Math.min(3, f.value * y)), w = 1 / f.value - 1 / S;
      k.value = { x: k.value.x + N.value.width * w / 2, y: k.value.y + N.value.height * w / 2 }, f.value = S;
    }
    function E(y) {
      const S = N.value.width / f.value, w = N.value.height / f.value;
      (y.x - y.width / 2 < k.value.x || y.x + y.width / 2 > k.value.x + S || y.y - y.height / 2 < k.value.y || y.y + y.height / 2 > k.value.y + w) && (k.value = { x: y.x - S / 2, y: y.y - w / 2 });
    }
    function le() {
      const y = b.value.nodes.find((S) => S.state === l.selectedState) ?? b.value.edges.find((S) => S.transition === l.selectedTransition);
      y && E(y);
    }
    xe([b, () => l.selectedState, () => l.selectedTransition], le, { flush: "post" }), xe(() => l.process.id, () => {
      m.value = "", R.clear(), A();
    }, { flush: "post" });
    function z(y) {
      if (y.target !== v.value) return;
      (y.key === "+" || y.key === "=") && (y.preventDefault(), D(1.2)), y.key === "-" && (y.preventDefault(), D(1 / 1.2)), y.key === "0" && (y.preventDefault(), x());
      const S = 60 / f.value;
      y.key.startsWith("Arrow") && (y.preventDefault(), k.value = { x: k.value.x + (y.key === "ArrowRight" ? S : y.key === "ArrowLeft" ? -S : 0), y: k.value.y + (y.key === "ArrowDown" ? S : y.key === "ArrowUp" ? -S : 0) });
    }
    function j(y) {
      m.value && m.value !== y.id && i("connect", m.value, y.id), m.value = "";
    }
    function O(y, S) {
      m.value = S.state.id, $.value = { x: S.x, y: S.y };
      const w = y.target;
      w instanceof Element && w.hasPointerCapture?.(y.pointerId) && w.releasePointerCapture(y.pointerId);
    }
    function ne(y, S) {
      if ((y.key === "Enter" || y.key === " ") && (y.preventDefault(), m.value ? j(S) : i("state", S)), ["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp"].includes(y.key)) {
        y.preventDefault();
        const w = Array.from(p.value?.querySelectorAll(".work-graph-node") ?? []), K = b.value.nodes.findIndex((re) => re.state === S), J = ["ArrowRight", "ArrowDown"].includes(y.key) ? 1 : -1;
        w[(K + J + w.length) % w.length]?.focus();
      }
    }
    function C() {
      m.value = "", R.clear(), i("clear");
    }
    const R = /* @__PURE__ */ new Map();
    let M = 0;
    function Z(y) {
      if (!y.target.closest('[role="button"]') && (R.set(y.pointerId, { x: y.clientX, y: y.clientY }), v.value?.setPointerCapture?.(y.pointerId), R.size === 2)) {
        const [S, w] = [...R.values()];
        M = Math.hypot(S.x - w.x, S.y - w.y);
      }
    }
    function ve(y) {
      const S = p.value?.getBoundingClientRect();
      if (!S?.width) return;
      if (m.value) {
        $.value = { x: k.value.x + (y.clientX - S.left) * N.value.width / f.value / S.width, y: k.value.y + (y.clientY - S.top) * N.value.height / f.value / S.height };
        return;
      }
      const w = R.get(y.pointerId);
      if (w)
        if (R.set(y.pointerId, { x: y.clientX, y: y.clientY }), R.size === 2) {
          const [K, J] = [...R.values()], re = Math.hypot(K.x - J.x, K.y - J.y);
          M && D(re / M), M = re;
        } else k.value = { x: k.value.x - (y.clientX - w.x) * N.value.width / f.value / S.width, y: k.value.y - (y.clientY - w.y) * N.value.height / f.value / S.height };
    }
    function be(y) {
      R.delete(y.pointerId), M = 0, m.value = "";
    }
    function ge(y) {
      y.ctrlKey && (y.preventDefault(), D(Math.exp(-y.deltaY * 0.01)));
    }
    let Ve;
    Ca(() => {
      if (v.value && Gs(v.value), typeof ResizeObserver < "u" && p.value) {
        let y = !0;
        Ve = new ResizeObserver(() => {
          const S = p.value?.getBoundingClientRect();
          if (!S?.width || !S.height) return;
          const w = N.value.width;
          o.value = S.width, (y || Math.abs(S.width - w) > 1) && (n.value ? x() : A(), y = !1), le();
        }), Ve.observe(p.value);
      }
    }), bt(() => Ve?.disconnect()), a({ fit: x, zoomIn: () => D(1.2), zoomOut: () => D(1 / 1.2) });
    function Ee(y) {
      return y.category === "completed" ? "check" : y.category === "canceled" ? "x" : y.id === l.process.initial ? "arrow-bar-to-right" : { gate: "shield-check", automated: "bolt", parallel: "arrows-split" }[y.kind ?? ""] ?? "user";
    }
    return (y, S) => (c(), g("section", {
      ref_key: "canvas",
      ref: v,
      class: "work-process-canvas",
      "aria-label": "Process map",
      tabindex: "0",
      onKeydown: [
        z,
        Ne(he(C, ["stop"]), ["esc"])
      ],
      onPointerdown: Z,
      onPointermove: ve,
      onPointerup: be,
      onPointercancel: C,
      onWheel: ge
    }, [
      m.value ? (c(), g("p", Js, "Choose the next stop. Escape cancels.")) : U("", !0),
      (c(), g("svg", {
        ref_key: "svg",
        ref: p,
        style: $o({ height: N.value.height + "px" }),
        viewBox: T.value,
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
          }, [...S[1] || (S[1] = [
            d("path", {
              d: "M0 0 L8 4 L0 8 z",
              class: "work-graph-arrow"
            }, null, -1)
          ])], 8, Qs)
        ]),
        (c(!0), g(X, null, te(b.value.parallels, (w) => (c(), g("path", {
          key: w.key,
          d: w.path,
          class: "work-lane-line",
          "marker-end": `url(#${r(u)}-arrow)`
        }, [
          d("title", null, "Parallel lane from " + I(r(ue)(w.state)), 1)
        ], 8, _s))), 128)),
        (c(!0), g(X, null, te(b.value.edges, (w) => (c(), g("g", {
          key: w.key,
          class: ft(["work-graph-edge", ["work-edge-" + w.type, { "work-selected": e.selectedTransition === w.transition }]]),
          role: "button",
          tabindex: "0",
          "aria-label": "Edit transition " + r(Pe)(w.transition),
          "aria-pressed": e.selectedTransition === w.transition,
          onFocus: (K) => E(w),
          onClick: (K) => i("transition", w.transition),
          onKeydown: [
            Ne(he((K) => i("transition", w.transition), ["prevent"]), ["enter"]),
            Ne(he((K) => i("transition", w.transition), ["prevent"]), ["space"])
          ]
        }, [
          d("path", {
            d: w.path,
            class: "work-edge-hit"
          }, null, 8, tr),
          d("path", {
            d: w.path,
            class: "work-edge-line",
            "marker-end": `url(#${r(u)}-arrow)`
          }, null, 8, ar),
          d("rect", {
            x: w.x - w.width / 2,
            y: w.y - w.height / 2,
            width: w.width,
            height: w.height,
            rx: "6",
            class: "work-edge-label-bg"
          }, null, 8, lr),
          d("text", {
            x: w.x,
            y: w.y - (w.lines.length - 1) * 8 + 4,
            class: "work-edge-label",
            "text-anchor": "middle"
          }, [
            (c(!0), g(X, null, te(w.lines, (K, J) => (c(), g("tspan", {
              key: J,
              x: w.x,
              dy: J ? 16 : 0
            }, I(K), 9, ir))), 128))
          ], 8, or)
        ], 42, er))), 128)),
        (c(!0), g(X, null, te(b.value.nodes, (w) => (c(), g("g", {
          key: w.state.id,
          class: ft(["work-graph-node", ["work-stop-" + w.state.category, { "work-selected": e.selectedState === w.state }]]),
          role: "button",
          tabindex: "0",
          "aria-label": "Edit state " + r(ue)(w.state),
          "aria-pressed": e.selectedState === w.state,
          onClick: (K) => i("state", w.state),
          onKeydown: (K) => ne(K, w.state),
          onFocus: (K) => E(w),
          onPointerup: he((K) => j(w.state), ["stop"])
        }, [
          d("rect", {
            x: w.x - w.width / 2,
            y: w.y - w.height / 2,
            width: w.width,
            height: w.height,
            rx: "10",
            class: "work-state-card"
          }, null, 8, sr),
          d("circle", {
            cx: w.x - w.width / 2 + 22,
            cy: w.y - w.height / 2 + 25,
            r: "10",
            class: "work-stop-ring"
          }, null, 8, rr),
          h(r(Q), {
            icon: "tabler:" + Ee(w.state),
            x: w.x - w.width / 2 + 15,
            y: w.y - w.height / 2 + 18,
            width: "14",
            height: "14",
            class: "work-stop-icon",
            "aria-hidden": "true"
          }, null, 8, ["icon", "x", "y"]),
          d("text", {
            x: w.x - w.width / 2 + 42,
            y: w.y - w.height / 2 + 29,
            class: "work-node-name"
          }, [
            (c(!0), g(X, null, te(w.title, (K, J) => (c(), g("tspan", {
              key: J,
              x: w.x - w.width / 2 + 42,
              dy: J ? 18 : 0
            }, I(K), 9, ur))), 128))
          ], 8, dr),
          d("text", {
            x: w.x - w.width / 2 + 16,
            y: w.y - w.height / 2 + 33 + w.title.length * 18,
            class: "work-node-meta"
          }, [
            (c(!0), g(X, null, te(w.caption, (K, J) => (c(), g("tspan", {
              key: J,
              x: w.x - w.width / 2 + 16,
              dy: J ? 16 : 0
            }, I(K), 9, vr))), 128)),
            e.draft.policy?.wip?.[w.state.id] ? (c(), g("tspan", mr, " · limit " + I(e.draft.policy.wip[w.state.id].limit), 1)) : U("", !0)
          ], 8, cr),
          (c(!0), g(X, null, te(w.badges, (K, J) => (c(), g("g", {
            key: K.id,
            class: "work-any-transition",
            role: "button",
            tabindex: "0",
            "aria-label": "Edit transition " + r(Pe)(K),
            onClick: he((re) => i("transition", K), ["stop"]),
            onKeydown: [
              Ne(he((re) => i("transition", K), ["stop", "prevent"]), ["enter"]),
              Ne(he((re) => i("transition", K), ["stop", "prevent"]), ["space"])
            ]
          }, [
            d("text", {
              x: w.x - w.width / 2 + 16,
              y: w.y - w.height / 2 + 33 + w.title.length * 18 + w.caption.length * 16 + w.badges.slice(0, J).reduce((re, de) => re + r(Ft)(r(Pe)(de) + " works from any state").length * 18, 0),
              class: "work-node-meta"
            }, [
              (c(!0), g(X, null, te(r(Ft)(r(Pe)(K) + " works from any state"), (re, de) => (c(), g("tspan", {
                key: de,
                x: w.x - w.width / 2 + 16,
                dy: de ? 18 : 0
              }, I(re), 9, br))), 128))
            ], 8, pr)
          ], 40, fr))), 128)),
          ["completed", "canceled"].includes(w.state.category) ? U("", !0) : (c(), g("circle", {
            key: 0,
            cx: b.value.direction === "TB" ? w.x : w.x + w.width / 2,
            cy: b.value.direction === "TB" ? w.y + w.height / 2 : w.y,
            r: "7",
            class: "work-node-connector",
            role: "button",
            tabindex: "0",
            "aria-label": "Connect from " + r(ue)(w.state),
            onPointerdown: he((K) => O(K, w), ["stop", "prevent"]),
            onClick: he((K) => i("state", w.state), ["stop"]),
            onKeydown: [
              Ne(he((K) => {
                m.value = w.state.id, $.value = { x: w.x, y: w.y };
              }, ["stop", "prevent"]), ["enter"]),
              Ne(he((K) => m.value = w.state.id, ["stop", "prevent"]), ["space"])
            ]
          }, null, 40, hr))
        ], 42, nr))), 128)),
        P.value ? (c(), g("path", {
          key: 0,
          d: `M ${b.value.direction === "TB" ? P.value.x : P.value.x + P.value.width / 2} ${b.value.direction === "TB" ? P.value.y + P.value.height / 2 : P.value.y} L ${$.value.x} ${$.value.y}`,
          class: "work-connect-ghost"
        }, null, 8, yr)) : U("", !0)
      ], 12, Zs)),
      !n.value && V.value < e.process.states.length ? (c(), g("div", gr, [
        d("span", null, I(V.value) + " of " + I(e.process.states.length) + " states in view · More " + I(b.value.direction === "TB" ? "below" : "to the right"), 1),
        h(r(Y), {
          label: "Show full process",
          size: "small",
          text: "",
          onClick: S[0] || (S[0] = (w) => x())
        })
      ])) : U("", !0),
      d("div", kr, [
        d("span", null, I(e.process.states.length) + " states · " + I(Math.round(f.value * 100)) + "%", 1),
        S[2] || (S[2] = d("span", null, [
          d("i"),
          F("Transition")
        ], -1)),
        S[3] || (S[3] = d("span", null, [
          d("i", { class: "work-return-key" }),
          F("Return / loop")
        ], -1)),
        S[4] || (S[4] = d("span", null, "Drag to pan · Ctrl + scroll to zoom · Fit for full process", -1))
      ])
    ], 40, Xs));
  }
}), Vr = {
  class: "work-process-list work-stack",
  "aria-label": "Process list"
}, $r = { class: "work-stack work-tight" }, xr = { class: "work-table-scroll" }, Cr = { class: "work-settings-table work-process-table" }, Sr = ["aria-selected"], Tr = { class: "work-process-list-actions" }, Dr = { class: "work-table-scroll" }, Ur = { class: "work-settings-table work-process-table" }, Ir = ["aria-selected"], Er = { class: "work-process-list-actions" }, Ar = /* @__PURE__ */ fe({
  __name: "ProcessList",
  props: {
    process: {},
    selectedState: {},
    selectedTransition: {}
  },
  emits: ["state", "transition", "removeState", "removeTransition", "addTransition"],
  setup(e) {
    return (a, t) => (c(), g("section", Vr, [
      d("label", $r, [
        t[2] || (t[2] = F("Process name", -1)),
        h(r(ce), {
          modelValue: e.process.name,
          "onUpdate:modelValue": t[0] || (t[0] = (l) => e.process.name = l),
          "aria-label": "Process name"
        }, null, 8, ["modelValue"])
      ]),
      t[5] || (t[5] = d("h3", null, "States", -1)),
      d("div", xr, [
        d("table", Cr, [
          t[3] || (t[3] = d("thead", null, [
            d("tr", null, [
              d("th", null, "Name"),
              d("th", null, "Phase"),
              d("th", null, "Kind"),
              d("th", null, "Actions")
            ])
          ], -1)),
          d("tbody", null, [
            (c(!0), g(X, null, te(e.process.states, (l) => (c(), g("tr", {
              key: l.id,
              "aria-selected": e.selectedState === l
            }, [
              d("td", null, [
                h(r(ce), {
                  modelValue: l.name,
                  "onUpdate:modelValue": (i) => l.name = i,
                  "aria-label": "Name of " + r(ue)(l)
                }, null, 8, ["modelValue", "onUpdate:modelValue", "aria-label"])
              ]),
              d("td", null, I(r(Tt)(l.category)), 1),
              d("td", null, [
                h(r(Oe), { severity: "secondary" }, {
                  default: L(() => [
                    F(I(r(ha)(l.kind)), 1)
                  ]),
                  _: 2
                }, 1024)
              ]),
              d("td", Tr, [
                h(r(Y), {
                  size: "small",
                  text: "",
                  severity: "secondary",
                  "aria-label": "Edit state",
                  onClick: (i) => a.$emit("state", l)
                }, {
                  default: L(() => [
                    h(r(Q), { icon: "tabler:pencil" })
                  ]),
                  _: 1
                }, 8, ["onClick"]),
                h(r(Y), {
                  size: "small",
                  text: "",
                  severity: "danger",
                  "aria-label": "Remove state " + r(ue)(l),
                  onClick: (i) => a.$emit("removeState", l)
                }, {
                  default: L(() => [
                    h(r(Q), { icon: "tabler:trash" })
                  ]),
                  _: 1
                }, 8, ["aria-label", "onClick"])
              ])
            ], 8, Sr))), 128))
          ])
        ])
      ]),
      t[6] || (t[6] = d("h3", null, "Transitions", -1)),
      d("div", Dr, [
        d("table", Ur, [
          t[4] || (t[4] = d("thead", null, [
            d("tr", null, [
              d("th", null, "Name"),
              d("th", null, "From"),
              d("th", null, "To"),
              d("th", null, "Actions")
            ])
          ], -1)),
          d("tbody", null, [
            (c(!0), g(X, null, te(e.process.transitions ?? [], (l) => (c(), g("tr", {
              key: l.id,
              "aria-selected": e.selectedTransition === l
            }, [
              d("td", null, [
                h(r(ce), {
                  modelValue: l.name,
                  "onUpdate:modelValue": (i) => l.name = i,
                  placeholder: r(Pe)(l),
                  "aria-label": "Name of " + r(Pe)(l)
                }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder", "aria-label"])
              ]),
              d("td", null, I(l.from === "any" ? "Any state" : l.from.map((i) => r(ue)(e.process.states.find((u) => u.id === i))).join(", ")), 1),
              d("td", null, I(r(ue)(e.process.states.find((i) => i.id === l.to))), 1),
              d("td", Er, [
                h(r(Y), {
                  size: "small",
                  text: "",
                  severity: "secondary",
                  "aria-label": "Edit transition",
                  onClick: (i) => a.$emit("transition", l)
                }, {
                  default: L(() => [
                    h(r(Q), { icon: "tabler:pencil" })
                  ]),
                  _: 1
                }, 8, ["onClick"]),
                h(r(Y), {
                  size: "small",
                  text: "",
                  severity: "danger",
                  "aria-label": "Remove transition " + r(Pe)(l),
                  onClick: (i) => a.$emit("removeTransition", l)
                }, {
                  default: L(() => [
                    h(r(Q), { icon: "tabler:trash" })
                  ]),
                  _: 1
                }, 8, ["aria-label", "onClick"])
              ])
            ], 8, Ir))), 128))
          ])
        ])
      ]),
      h(r(Y), {
        label: "Add transition",
        severity: "secondary",
        outlined: "",
        onClick: t[1] || (t[1] = (l) => a.$emit("addTransition"))
      }, {
        icon: L(() => [
          h(r(Q), { icon: "tabler:plus" })
        ]),
        _: 1
      })
    ]));
  }
}), Pr = { class: "work-stack work-transition-settings" }, Rr = { class: "work-stack work-tight" }, Nr = { class: "work-row" }, Or = { class: "work-row" }, Mr = { class: "work-row" }, Fr = { class: "work-stack work-tight" }, Lr = { class: "work-row" }, zr = { class: "work-stack work-tight" }, Br = { class: "work-stack work-tight" }, jr = /* @__PURE__ */ fe({
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
    function u(m, v) {
      const p = t.transition.set?.[m];
      !p || !t.transition.set || (t.transition.set[m] = { field: p.field, ...v === "clear" ? { clear: !0 } : v === "copy" ? { copy: "" } : { value: "" } });
    }
    return (m, v) => (c(), g("div", Pr, [
      d("label", Rr, [
        v[14] || (v[14] = F("To state", -1)),
        h(r(ae), {
          modelValue: e.transition.to,
          "onUpdate:modelValue": v[0] || (v[0] = (p) => e.transition.to = p),
          "aria-label": "To state",
          appendTo: "self",
          optionLabel: "label",
          optionValue: "value",
          options: e.process.states.map((p) => ({ label: r(ue)(p), value: p.id }))
        }, null, 8, ["modelValue", "options"])
      ]),
      d("label", Nr, [
        v[15] || (v[15] = d("span", { class: "work-spacer" }, "Happens automatically", -1)),
        h(r(qe), {
          "model-value": e.transition.auto,
          "onUpdate:modelValue": v[1] || (v[1] = (p) => {
            e.transition.auto = p, p || delete e.transition.default;
          }),
          "aria-label": "Automatic transition"
        }, null, 8, ["model-value"])
      ]),
      d("label", Or, [
        v[16] || (v[16] = d("span", { class: "work-spacer" }, "Default automatic transition", -1)),
        h(r(qe), {
          modelValue: e.transition.default,
          "onUpdate:modelValue": v[2] || (v[2] = (p) => e.transition.default = p),
          disabled: !e.transition.auto,
          "aria-label": "Default transition"
        }, null, 8, ["modelValue", "disabled"])
      ]),
      d("label", Mr, [
        v[17] || (v[17] = d("span", { class: "work-spacer" }, "Works from any state", -1)),
        h(r(qe), {
          "model-value": e.transition.from === "any",
          "aria-label": "Works from any state",
          "onUpdate:modelValue": v[3] || (v[3] = (p) => e.transition.from = p ? "any" : [])
        }, null, 8, ["model-value"])
      ]),
      e.transition.from !== "any" ? (c(), q(jt, {
        key: 0,
        label: "From states",
        options: e.process.states.map((p) => ({ value: p.id, label: r(ue)(p) })),
        modelValue: e.transition.from,
        "onUpdate:modelValue": v[4] || (v[4] = (p) => e.transition.from = p)
      }, null, 8, ["options", "modelValue"])) : U("", !0),
      v[21] || (v[21] = d("h4", { class: "work-process-group" }, "Must be filled", -1)),
      h(jt, {
        label: "Required fields",
        options: e.draft.fields?.map((p) => ({ value: p.code, label: p.title || p.code })) ?? [],
        modelValue: e.transition.require,
        "onUpdate:modelValue": v[5] || (v[5] = (p) => e.transition.require = p)
      }, null, 8, ["options", "modelValue"]),
      v[22] || (v[22] = d("h4", { class: "work-process-group" }, "Also sets", -1)),
      (c(!0), g(X, null, te(e.transition.set ?? [], (p, o) => (c(), g("div", {
        key: o,
        class: "work-process-value work-stack work-tight"
      }, [
        d("label", Fr, [
          v[18] || (v[18] = F("Field", -1)),
          h(r(ae), {
            modelValue: p.field,
            "onUpdate:modelValue": (n) => p.field = n,
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            options: e.draft.fields?.map((n) => ({ value: n.code, label: n.title || n.code })) ?? []
          }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
        ]),
        d("div", Lr, [
          h(r(ae), {
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
          h(r(Y), {
            text: "",
            severity: "danger",
            "aria-label": "Remove value " + (o + 1),
            onClick: (n) => e.transition.set?.splice(o, 1)
          }, {
            default: L(() => [
              h(r(Q), { icon: "tabler:trash" })
            ]),
            _: 1
          }, 8, ["aria-label", "onClick"])
        ]),
        p.copy !== void 0 ? (c(), q(r(ae), {
          key: 0,
          modelValue: p.copy,
          "onUpdate:modelValue": (n) => p.copy = n,
          "aria-label": "Copy from field",
          appendTo: "self",
          optionLabel: "label",
          optionValue: "value",
          options: e.draft.fields?.map((n) => ({ value: n.code, label: n.title || n.code })) ?? []
        }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])) : p.clear ? U("", !0) : (c(!0), g(X, { key: 1 }, te(e.draft.fields?.filter((n) => n.code === p.field) ?? [], (n) => (c(), q(Yl, {
          key: n.code,
          "board-id": e.boardId ?? "",
          field: n,
          modelValue: p.value,
          "onUpdate:modelValue": (s) => p.value = s,
          onValidity: (s) => l("validity", "effect-" + o, s)
        }, null, 8, ["board-id", "field", "modelValue", "onUpdate:modelValue", "onValidity"]))), 128))
      ]))), 128)),
      h(r(Y), {
        label: "Add value",
        severity: "secondary",
        outlined: "",
        size: "small",
        onClick: i
      }, {
        icon: L(() => [
          h(r(Q), { icon: "tabler:plus" })
        ]),
        _: 1
      }),
      d("label", zr, [
        v[19] || (v[19] = F("Offer to people", -1)),
        h(r(ae), {
          "model-value": e.transition.people,
          "aria-label": "Offer to people",
          appendTo: "self",
          optionLabel: "label",
          optionValue: "value",
          options: [{ label: "Work default", value: void 0 }, { label: "Offer explicitly", value: !0 }, { label: "Hide from people", value: !1 }],
          "onUpdate:modelValue": v[6] || (v[6] = (p) => e.transition.people = p)
        }, null, 8, ["model-value"])
      ]),
      d("label", Br, [
        v[20] || (v[20] = F("Evaluation order", -1)),
        h(r(Ze), {
          "model-value": e.transition.order ?? null,
          "aria-label": "Transition order",
          min: 0,
          useGrouping: !1,
          "onUpdate:modelValue": v[7] || (v[7] = (p) => e.transition.order = p ?? void 0)
        }, null, 8, ["model-value"])
      ]),
      v[23] || (v[23] = d("h4", { class: "work-process-group" }, "Only when", -1)),
      h(nl, {
        label: "Allow this transition when",
        draft: e.draft,
        "board-id": e.boardId,
        "model-value": e.transition.when,
        "onUpdate:modelValue": v[8] || (v[8] = (p) => e.transition.when = p),
        onValidity: v[9] || (v[9] = (p) => l("validity", "when", p))
      }, null, 8, ["draft", "board-id", "model-value"]),
      h(pt, {
        label: "Set values",
        "model-value": e.transition.set,
        shape: "array",
        "onUpdate:modelValue": v[10] || (v[10] = (p) => e.transition.set = p),
        onValidity: v[11] || (v[11] = (p) => l("validity", "set", p))
      }, null, 8, ["model-value"]),
      h(pt, {
        label: "Guards",
        "model-value": e.transition.guards,
        shape: "array",
        "onUpdate:modelValue": v[12] || (v[12] = (p) => e.transition.guards = p),
        onValidity: v[13] || (v[13] = (p) => l("validity", "guards", p))
      }, null, 8, ["model-value"])
    ]));
  }
}), xa = /* @__PURE__ */ fe({
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
      const m = a.draft.policy ??= {}, v = m.wip ??= {};
      v[a.state] = { ...v[a.state], limit: u };
    }
    function i(u) {
      t.value && (t.value.hard = u);
    }
    return (u, m) => e.hard ? (c(), q(r(qe), {
      key: 0,
      "aria-label": e.label,
      disabled: !t.value,
      "model-value": t.value?.hard ?? !1,
      "onUpdate:modelValue": i
    }, null, 8, ["aria-label", "disabled", "model-value"])) : (c(), q(r(Ze), {
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
async function Ka(e, a) {
  try {
    const { data: t } = await Go.get(e, a ? { params: a } : void 0);
    if (!t?.success) throw new Error(t?.message || (typeof t?.error == "string" ? t.error : t?.error?.message) || "Could not read published Flow.");
    return t;
  } catch (t) {
    throw Po(t, "Published Flow");
  }
}
const Al = (e) => `/api/v1/workflows/${encodeURIComponent(e)}/versions`, el = {
  title: async (e) => (await Ka("/api/v1/workflows/published", { id: e })).item?.title,
  versions: async (e) => (await Ka(Al(e))).versions ?? [],
  check: async (e) => {
    if ((await Ka(`${Al(e.id)}/${e.version}`)).version?.version !== e.version) throw new Error("The published version is unavailable.");
  }
}, qr = {
  class: "work-stack work-tight",
  "aria-label": "Stage Flow"
}, Wr = {
  key: 0,
  class: "work-muted work-small"
}, Kr = {
  key: 1,
  class: "kx-err",
  role: "alert"
}, Gr = ["schema", "config", "title"], Hr = {
  key: 3,
  class: "kx-err",
  role: "alert"
}, Yr = {
  key: 4,
  class: "work-stack work-tight"
}, Xr = {
  key: 5,
  class: "work-muted work-small",
  role: "status"
}, Jr = /* @__PURE__ */ fe({
  __name: "StageFlow",
  props: {
    modelValue: {}
  },
  emits: ["update:modelValue", "validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, i = B(!1), u = B(""), m = B([]), v = B(!1), p = B(""), o = B(!1), n = H(() => u.value || t.modelValue?.id), s = JSON.stringify({ properties: { flow_ref: { title: "Published Flow", picker: "wc-workflow-picker" } } }), b = H(() => JSON.stringify(t.modelValue ? { flow_ref: t.modelValue } : {}));
    let f = 0;
    async function k() {
      i.value = await mt("wc-workflow-picker");
    }
    k();
    async function $() {
      const T = ++f, P = n.value, x = t.modelValue;
      if (v.value = !!P, p.value = "", m.value = [], !!P)
        try {
          const [D] = await Promise.all([el.versions(P), !o.value && x ? el.check(x) : Promise.resolve()]);
          if (T !== f) return;
          if (m.value = D.filter((E) => Number.isInteger(E.version) && E.version > 0), !o.value && x && !m.value.some((E) => E.version === x.version)) throw new Error("The published version is unavailable.");
        } catch (D) {
          T === f && (p.value = D instanceof Error ? D.message : "Could not read published Flow.");
        } finally {
          T === f && (v.value = !1);
        }
    }
    xe([n, () => t.modelValue?.version, o], $, { immediate: !0 }), xe(o, (T) => l("validity", !T), { immediate: !0 });
    function N(T) {
      const P = T.detail?.flow_ref;
      P?.kind !== "flow" || !P.id || (o.value = !0, u.value = P.id);
    }
    function V(T) {
      !n.value || !m.value.some((P) => P.version === T) || (l("update:modelValue", { kind: "flow", id: n.value, version: T }), o.value = !1, u.value = "");
    }
    function A() {
      l("update:modelValue", void 0), o.value = !1, u.value = "";
    }
    return bt(() => {
      f++, l("validity", !0);
    }), (T, P) => (c(), g("section", qr, [
      P[3] || (P[3] = d("h4", { class: "work-field-label" }, "What runs", -1)),
      e.modelValue ? U("", !0) : (c(), g("p", Wr, "No Flow bound. This stage keeps its existing external execution contract.")),
      p.value ? (c(), g("p", Kr, [
        F(I(o.value ? "Flow versions unavailable" : "Flow binding unavailable") + ": " + I(n.value), 1),
        !o.value && e.modelValue ? (c(), g(X, { key: 0 }, [
          F(" · v" + I(e.modelValue.version), 1)
        ], 64)) : U("", !0),
        F(". " + I(p.value), 1),
        h(r(Y), {
          label: "Reload Flow",
          severity: "secondary",
          text: "",
          onClick: $
        })
      ])) : U("", !0),
      i.value ? (c(), g("wc-workflow-picker", {
        key: 2,
        schema: r(s),
        config: b.value,
        title: e.modelValue?.id,
        onChange: N
      }, null, 40, Gr)) : (c(), g("p", Hr, [
        P[1] || (P[1] = F("Published Flow picker unavailable.", -1)),
        h(r(Y), {
          label: "Reload Flow picker",
          text: "",
          severity: "secondary",
          onClick: k
        })
      ])),
      n.value ? (c(), g("label", Yr, [
        P[2] || (P[2] = F("Published version", -1)),
        h(r(ae), {
          "model-value": o.value ? void 0 : e.modelValue?.version,
          options: m.value.map((x) => ({ label: "v" + x.version, value: x.version })),
          "option-label": "label",
          "option-value": "value",
          "aria-label": "Published version",
          placeholder: "Choose a published version",
          "append-to": "self",
          loading: v.value,
          disabled: v.value || !!p.value,
          "onUpdate:modelValue": V
        }, null, 8, ["model-value", "options", "loading", "disabled"])
      ])) : U("", !0),
      o.value ? (c(), g("p", Xr, "Choose a published version of " + I(n.value) + " to finish selecting the Flow.", 1)) : U("", !0),
      e.modelValue || o.value ? (c(), q(r(Y), {
        key: 6,
        label: o.value ? "Cancel Flow selection" : "Remove Flow binding",
        "aria-label": o.value ? "Cancel Flow selection" : "Remove Flow binding",
        severity: "secondary",
        text: "",
        onClick: P[0] || (P[0] = (x) => o.value ? (o.value = !1, u.value = "") : A())
      }, null, 8, ["label", "aria-label"])) : U("", !0)
    ]));
  }
}), tl = { seconds: 1, minutes: 60, hours: 3600, days: 86400 };
function Jt(e, a) {
  const t = /^P(\d+)W$/.exec(e), l = /^P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+\.?\d*)S)?)?$/.exec(e);
  if (!t && (!l || e === "P" || e.endsWith("T"))) return;
  const i = t ? Number(t[1]) * 604800 : Number(l[1] ?? 0) * 86400 + Number(l[2] ?? 0) * 3600 + Number(l[3] ?? 0) * 60 + Number(l[4] ?? 0);
  if (!Number.isFinite(i) || i <= 0) return;
  const u = a ?? (i % 86400 === 0 ? "days" : i % 3600 === 0 ? "hours" : i < 60 ? "seconds" : "minutes");
  return { amount: i / tl[u], unit: u };
}
function Zr(e, a) {
  if (e == null) return;
  if (!Number.isFinite(e * tl[a]) || e <= 0) throw new Error("Enter a positive duration.");
  const t = (i) => i.toLocaleString("en-US", { useGrouping: !1, maximumSignificantDigits: 21 });
  if (!Number.isInteger(e)) return `PT${t(e * tl[a])}S`;
  const l = { seconds: "S", minutes: "M", hours: "H", days: "D" }[a];
  return (a === "days" ? "P" : "PT") + t(e) + l;
}
const Qr = { class: "work-stack work-tight" }, _r = {
  key: 0,
  class: "work-error",
  role: "alert"
}, Ct = /* @__PURE__ */ fe({
  __name: "DurationControl",
  props: {
    modelValue: {},
    label: {},
    disabled: { type: Boolean }
  },
  emits: ["update:modelValue", "validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, i = "duration:" + al(), u = B(), m = B(""), v = H(() => t.modelValue ? Jt(t.modelValue) : void 0), p = H(() => u.value ?? v.value?.unit ?? "days");
    xe(() => t.modelValue, (V) => {
      m.value = "", l("validity", !V || !!v.value, i);
    }, { immediate: !0 });
    const o = H(() => t.modelValue ? Jt(t.modelValue, p.value)?.amount ?? null : null);
    function n(V) {
      try {
        const A = Zr(V, p.value);
        m.value = "", l("update:modelValue", A), l("validity", !0, i);
      } catch (A) {
        m.value = A.message, l("validity", !1, i);
      }
    }
    let s;
    function b(V) {
      V.target instanceof HTMLInputElement && (s = V.target.value);
    }
    function f(V) {
      if (s === void 0) return;
      const A = s;
      s = void 0, $(V, A);
    }
    function k(V) {
      s = void 0;
      const A = V.originalEvent?.target instanceof HTMLInputElement ? V.originalEvent.target.value : V.formattedValue;
      $(V.value, A);
    }
    function $(V, A) {
      if (A.trim() && (typeof V != "number" || !Number.isFinite(V))) {
        m.value = "Enter a positive duration.", l("validity", !1, i);
        return;
      }
      u.value = p.value, n(typeof V == "number" ? V : null);
    }
    function N(V) {
      const A = o.value;
      u.value = V, !(t.modelValue && !v.value) && n(A);
    }
    return bt(() => l("validity", !0, i)), (V, A) => (c(), g("label", Qr, [
      F(I(e.label), 1),
      d("span", {
        class: "work-duration-control",
        style: { "max-width": "360px" },
        onInputCapture: b
      }, [
        h(r(Ze), {
          "model-value": o.value,
          "aria-label": e.label,
          min: 0,
          "aria-invalid": !!m.value || !!e.modelValue && !r(Jt)(e.modelValue),
          disabled: e.disabled,
          useGrouping: !1,
          "max-fraction-digits": p.value === "seconds" ? 20 : 3,
          onInput: k,
          "onUpdate:modelValue": f
        }, null, 8, ["model-value", "aria-label", "aria-invalid", "disabled", "max-fraction-digits"]),
        h(r(ae), {
          "model-value": p.value,
          "aria-label": e.label + " unit",
          disabled: e.disabled,
          options: [{ label: "Seconds", value: "seconds" }, { label: "Minutes", value: "minutes" }, { label: "Hours", value: "hours" }, { label: "Days", value: "days" }],
          optionLabel: "label",
          optionValue: "value",
          appendTo: "self",
          "onUpdate:modelValue": A[0] || (A[0] = (T) => N(T))
        }, null, 8, ["model-value", "aria-label", "disabled"])
      ], 32),
      m.value || e.modelValue && !r(Jt)(e.modelValue) ? (c(), g("span", _r, I(m.value || `Unsupported duration: ${e.modelValue}`), 1)) : U("", !0)
    ]));
  }
}), ed = { class: "work-stack" }, td = { class: "work-settings-grid" }, ad = { class: "work-stack work-tight" }, ld = { class: "work-stack work-tight" }, od = {
  key: 1,
  class: "work-stack work-tight"
}, id = { class: "work-stack work-tight" }, nd = { class: "work-settings-grid" }, sd = { class: "work-row" }, rd = { class: "work-stack work-tight" }, dd = {
  key: 0,
  class: "work-stack work-tight"
}, ud = /* @__PURE__ */ fe({
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
      o.push({ id: $t("timer", o), after: "P1D", then: { emit: "reminder" } });
    }
    function m(o, n) {
      delete o.after, delete o.at_field, n === "after" ? o.after = "P1D" : o.at_field = "";
    }
    function v(o, n, s) {
      s ? o[n] = s : (delete o[n], delete o.table);
    }
    function p(o, n) {
      o.then = n === "emit" ? { emit: "" } : { transition: "" };
    }
    return (o, n) => (c(), g("section", ed, [
      n[8] || (n[8] = d("h4", null, "Timers", -1)),
      (c(!0), g(X, null, te(i(), (s, b) => (c(), g("article", {
        key: s.id,
        class: "work-settings-card work-stack"
      }, [
        d("div", td, [
          d("label", ad, [
            n[2] || (n[2] = F("Timer ID", -1)),
            h(r(ce), {
              modelValue: s.id,
              "onUpdate:modelValue": (f) => s.id = f,
              required: "",
              pattern: "[a-z][a-z0-9_]*"
            }, null, 8, ["modelValue", "onUpdate:modelValue"])
          ]),
          d("label", ld, [
            n[3] || (n[3] = F("Deadline", -1)),
            h(r(ae), {
              "model-value": s.at_field !== void 0 ? "at_field" : "after",
              "onUpdate:modelValue": (f) => m(s, f),
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
          s.after !== void 0 ? (c(), q(Ct, {
            key: 0,
            modelValue: s.after,
            "onUpdate:modelValue": (f) => s.after = f,
            label: "After",
            onValidity: n[0] || (n[0] = (f, k) => l("validity", k, f))
          }, null, 8, ["modelValue", "onUpdate:modelValue"])) : (c(), g("label", od, [
            n[4] || (n[4] = F("At field", -1)),
            h(r(ae), {
              modelValue: s.at_field,
              "onUpdate:modelValue": (f) => s.at_field = f,
              appendTo: "self",
              optionLabel: "label",
              optionValue: "value",
              optionDisabled: "disabled",
              options: [
                ...(e.draft.fields?.filter((f) => f.form === "time") ?? []).map((f) => ({
                  label: f.code,
                  value: f.code,
                  disabled: !1
                }))
              ]
            }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
          ])),
          d("label", id, [
            n[5] || (n[5] = F("Duration by field", -1)),
            h(r(ae), {
              "model-value": s.by ?? "",
              "onUpdate:modelValue": (f) => v(s, "by", f),
              appendTo: "self",
              optionLabel: "label",
              optionValue: "value",
              optionDisabled: "disabled",
              options: [
                { label: "Fixed duration", value: "", disabled: !1 },
                ...(e.draft.fields ?? []).map((f) => ({
                  label: f.code,
                  value: f.code,
                  disabled: !1
                }))
              ]
            }, null, 8, ["model-value", "onUpdate:modelValue", "options"])
          ])
        ]),
        s.by ? (c(), q(pt, {
          key: 0,
          label: "Duration table",
          hint: "Map field values to ISO durations.",
          "model-value": s.table,
          shape: "object",
          "onUpdate:modelValue": (f) => s.table = f,
          onValidity: (f) => l("validity", "table-" + b, f)
        }, null, 8, ["model-value", "onUpdate:modelValue", "onValidity"])) : U("", !0),
        d("div", nd, [
          h(Ct, {
            modelValue: s.repeat,
            "onUpdate:modelValue": (f) => s.repeat = f,
            label: "Repeat every",
            onValidity: n[1] || (n[1] = (f, k) => l("validity", k, f)),
            disabled: s.interrupting
          }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"]),
          d("label", sd, [
            h(r(zt), {
              modelValue: s.interrupting,
              "onUpdate:modelValue": [(f) => s.interrupting = f, (f) => s.interrupting && delete s.repeat],
              binary: ""
            }, null, 8, ["modelValue", "onUpdate:modelValue"]),
            n[6] || (n[6] = F("Interrupting", -1))
          ]),
          d("label", rd, [
            n[7] || (n[7] = F("Then", -1)),
            h(r(ae), {
              "model-value": s.then?.transition !== void 0 ? "transition" : "emit",
              "onUpdate:modelValue": (f) => p(s, f),
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
          s.then ? (c(), g("label", dd, [
            F(I(s.then.transition !== void 0 ? "Transition ID" : "Event name"), 1),
            s.then.transition !== void 0 ? (c(), q(r(ce), {
              key: 0,
              modelValue: s.then.transition,
              "onUpdate:modelValue": (f) => s.then.transition = f
            }, null, 8, ["modelValue", "onUpdate:modelValue"])) : (c(), q(r(ce), {
              key: 1,
              modelValue: s.then.emit,
              "onUpdate:modelValue": (f) => s.then.emit = f
            }, null, 8, ["modelValue", "onUpdate:modelValue"]))
          ])) : U("", !0)
        ]),
        h(r(Y), {
          severity: "secondary",
          onClick: (f) => i().splice(b, 1),
          "aria-label": "Remove timer",
          text: "",
          size: "small"
        }, {
          default: L(() => [
            h(r(Q), {
              icon: "tabler:trash",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        }, 8, ["onClick"])
      ]))), 128)),
      h(r(Y), {
        label: "Add timer",
        severity: "secondary",
        onClick: u,
        outlined: ""
      }, {
        icon: L(() => [
          h(r(Q), {
            icon: "tabler:plus",
            "aria-hidden": "true"
          })
        ]),
        _: 1
      })
    ]));
  }
}), cd = ["aria-label"], vd = { class: "work-stack work-tight" }, md = {
  key: 0,
  class: "work-stack work-tight"
}, fd = /* @__PURE__ */ fe({
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
    function m(p) {
      l("update:modelValue", p === "field" ? { field: "" } : p === "group" ? { group: "" } : []);
    }
    function v(p) {
      l("update:modelValue", i.value === "group" ? { group: p.at(-1)?.id ?? "" } : p);
    }
    return Bl(() => l("validity", Array.isArray(t.modelValue) ? t.modelValue.length > 0 : "field" in t.modelValue ? !!t.modelValue.field : !!t.modelValue.group)), bt(() => l("validity", !0)), (p, o) => (c(), g("section", {
      class: "work-stack work-tight",
      "aria-label": e.label
    }, [
      d("label", vd, [
        F(I(e.label) + " source", 1),
        h(r(ae), {
          "model-value": i.value,
          "aria-label": e.label + " source",
          options: [{ label: "Group", value: "group" }, { label: "People and groups", value: "principals" }, { label: "Principal field", value: "field" }],
          optionLabel: "label",
          optionValue: "value",
          appendTo: "self",
          "onUpdate:modelValue": m
        }, null, 8, ["model-value", "aria-label"])
      ]),
      "field" in e.modelValue ? (c(), g("label", md, [
        o[1] || (o[1] = F("Principal field", -1)),
        h(r(ae), {
          "model-value": e.modelValue.field,
          "aria-label": e.label + " field",
          options: e.draft.fields?.filter((n) => n.type === "principal").map((n) => ({ label: n.title || n.code, value: n.code })) ?? [],
          optionLabel: "label",
          optionValue: "value",
          appendTo: "self",
          "onUpdate:modelValue": o[0] || (o[0] = (n) => l("update:modelValue", { field: n }))
        }, null, 8, ["model-value", "aria-label", "options"])
      ])) : (c(), q(sl, {
        key: 1,
        "board-id": e.boardId,
        label: e.label,
        kinds: i.value === "group" ? "group" : "user,group,service",
        "model-value": u.value,
        "onUpdate:modelValue": v
      }, null, 8, ["board-id", "label", "kinds", "model-value"]))
    ], 8, cd));
  }
}), pd = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, bd = {
  class: "work-stack work-tight",
  "aria-label": "Approval sources"
}, hd = { class: "work-row" }, yd = {
  key: 0,
  class: "work-stack work-tight"
}, gd = ["kinds", "value"], kd = {
  key: 2,
  class: "work-muted work-small",
  role: "status"
}, wd = {
  key: 3,
  class: "work-chips"
}, Vd = { class: "work-row work-small" }, $d = { class: "work-process-options" }, xd = { class: "work-stack work-tight" }, Cd = {
  key: 4,
  class: "work-error work-small",
  role: "alert"
}, Sd = {
  key: 5,
  class: "work-muted work-small"
}, Td = /* @__PURE__ */ fe({
  __name: "ApproversEditor",
  props: {
    approvals: {},
    boardId: {}
  },
  emits: ["validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, { principalLabel: i, rememberPrincipal: u, nameError: m } = jl(() => t.boardId ?? "", () => Array.isArray(t.approvals.from) ? t.approvals.from : "group" in t.approvals.from ? [{ kind: "group", id: t.approvals.from.group }] : []), v = B(!1), p = H(() => Array.isArray(t.approvals.from) ? "principals" : "field" in t.approvals.from ? "field" : "group"), o = H(() => Array.isArray(t.approvals.from) ? t.approvals.from.some((f) => f.kind === "group") || t.approvals.from.length >= t.approvals.min : "field" in t.approvals.from ? !!t.approvals.from.field : !!t.approvals.from.group);
    Bl(() => l("validity", Number.isSafeInteger(t.approvals.min) && t.approvals.min > 0 && o.value)), bt(() => l("validity", !0)), Ca(async () => {
      v.value = await mt("wc-principal-picker");
    });
    function n(f) {
      t.approvals.from = f === "group" ? { group: "" } : f === "field" ? { field: "" } : [];
    }
    function s(f) {
      const k = f.detail, $ = k?.principal_id ?? k?.id;
      if (p.value === "group") {
        t.approvals.from = { group: $ ?? "" };
        return;
      }
      if (!$ || !Array.isArray(t.approvals.from)) return;
      const N = { kind: k.type ?? k.kind ?? "user", id: $ };
      k.label && u(N, k.label), t.approvals.from.some((V) => V.id === $ && V.kind === N.kind) || t.approvals.from.push(N);
    }
    function b(f) {
      Array.isArray(t.approvals.from) && t.approvals.from.splice(f, 1);
    }
    return (f, k) => (c(), g(X, null, [
      r(m) ? (c(), g("p", pd, I(r(m)), 1)) : U("", !0),
      d("section", bd, [
        d("label", hd, [
          k[4] || (k[4] = d("span", { class: "work-spacer" }, "Approvals needed", -1)),
          h(r(Ze), {
            modelValue: e.approvals.min,
            "onUpdate:modelValue": k[0] || (k[0] = ($) => e.approvals.min = $),
            min: 1,
            required: "",
            useGrouping: !1
          }, null, 8, ["modelValue"])
        ]),
        k[9] || (k[9] = d("span", { class: "work-field-label" }, "Approvers", -1)),
        "field" in e.approvals.from ? (c(), g("label", yd, [
          k[5] || (k[5] = F("Principal field", -1)),
          h(r(ce), {
            modelValue: e.approvals.from.field,
            "onUpdate:modelValue": k[1] || (k[1] = ($) => e.approvals.from.field = $),
            "aria-label": "Principal field"
          }, null, 8, ["modelValue"])
        ])) : v.value ? (c(), g("wc-principal-picker", {
          key: p.value,
          kinds: p.value === "group" ? "group" : "user,group,service",
          value: JSON.stringify("group" in e.approvals.from ? { type: "group", principal_id: e.approvals.from.group } : {}),
          onConfigChanged: s
        }, null, 40, gd)) : (c(), g("p", kd, "The principal picker is unavailable.")),
        Array.isArray(e.approvals.from) ? (c(), g("div", wd, [
          (c(!0), g(X, null, te(e.approvals.from, ($, N) => (c(), q(r(Oe), {
            key: $.kind + ":" + $.id,
            class: "kx-tag-sm",
            severity: "secondary"
          }, {
            default: L(() => [
              F(I(r(i)($)), 1),
              h(r(Y), {
                "aria-label": "Remove approver " + (N + 1),
                text: "",
                severity: "secondary",
                size: "small",
                onClick: (V) => b(N)
              }, {
                default: L(() => [
                  h(r(Q), {
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
        d("label", Vd, [
          k[6] || (k[6] = d("span", { class: "work-spacer" }, "The person who moves the item here cannot approve this visit", -1)),
          h(r(qe), {
            modelValue: e.approvals.prevent_self,
            "onUpdate:modelValue": k[2] || (k[2] = ($) => e.approvals.prevent_self = $),
            "aria-label": "The person who moves the item here cannot approve this visit"
          }, null, 8, ["modelValue"])
        ]),
        d("details", $d, [
          k[8] || (k[8] = d("summary", null, "Approval options", -1)),
          d("label", xd, [
            k[7] || (k[7] = F("Approval source", -1)),
            h(r(ae), {
              "model-value": p.value,
              "onUpdate:modelValue": k[3] || (k[3] = ($) => n($)),
              appendTo: "self",
              optionLabel: "label",
              optionValue: "value",
              options: [{ label: "Group members", value: "group" }, { label: "People and groups", value: "principals" }, { label: "Principal field", value: "field" }]
            }, null, 8, ["model-value"])
          ])
        ]),
        Array.isArray(e.approvals.from) && !o.value ? (c(), g("p", Cd, "Select at least " + I(e.approvals.min) + " distinct principals, or lower the minimum.", 1)) : "group" in e.approvals.from && !e.approvals.from.group ? (c(), g("p", Sd, "Choose the group that can approve this state.")) : U("", !0)
      ])
    ], 64));
  }
}), Dd = {
  class: "work-state-settings work-stack",
  "aria-label": "State settings"
}, Ud = { class: "work-process-kind" }, Id = { class: "work-process-options" }, Ed = { class: "work-stack" }, Ad = { class: "work-row" }, Pd = { class: "work-stack work-tight" }, Rd = { class: "work-row" }, Nd = { class: "work-stack work-tight" }, Od = { class: "work-row" }, Md = { class: "work-row" }, Fd = { class: "work-stack work-tight" }, Ld = { class: "work-row" }, zd = { class: "work-stack work-tight" }, Bd = { class: "work-stack work-tight" }, jd = {
  key: 0,
  class: "work-row"
}, qd = { class: "work-row" }, Wd = { class: "work-row" }, Kd = { class: "work-stack work-tight" }, Gd = { class: "work-row" }, Hd = /* @__PURE__ */ fe({
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
    function m(p) {
      const o = t.state;
      o.kind = p, delete o.run, delete o.release_when, delete o.regions, delete o.join, delete o.due, (p === "automated" || p === "gate") && delete o.awaiting, p === "automated" && (o.run = { stage: o.id, retry: { max: 1, backoff: "PT1M" } }), p === "gate" && (o.release_when = { approvals: { min: 1, from: { group: "" }, prevent_self: !0 } }), p === "parallel" && (o.regions = [{ id: "region_1", initial: t.process.states.find((n) => n.id !== o.id)?.id ?? "" }], o.join = "all");
    }
    function v(p) {
      t.state.run && (p ? t.state.run.on_fail = p : delete t.state.run.on_fail);
    }
    return (p, o) => (c(), g("section", Dd, [
      o[52] || (o[52] = d("h4", { class: "work-process-group" }, "Who moves the item on", -1)),
      h(r(il), {
        class: "work-process-kinds",
        "model-value": e.state.kind ?? "human",
        options: u.map((n) => ({
          ...n,
          label: r(ha)(n.value)
        })),
        optionLabel: "label",
        optionValue: "value",
        optionDisabled: "disabled",
        "allow-empty": !1,
        "aria-label": "Who moves the item on",
        "onUpdate:modelValue": m
      }, {
        option: L(({ option: n }) => [
          d("span", Ud, [
            h(r(Q), {
              icon: "tabler:" + n.icon
            }, null, 8, ["icon"]),
            d("span", null, I(n.label), 1)
          ])
        ]),
        _: 1
      }, 8, ["model-value", "options"]),
      e.state.kind === "gate" && e.state.release_when ? (c(), g(X, { key: 0 }, [
        o[33] || (o[33] = d("h4", { class: "work-process-group" }, "Approval", -1)),
        e.state.release_when.approvals ? (c(), q(Td, {
          key: 0,
          "board-id": e.boardId,
          approvals: e.state.release_when.approvals,
          onValidity: o[0] || (o[0] = (n) => l("validity", "approvers", n))
        }, null, 8, ["board-id", "approvals"])) : U("", !0),
        d("details", Id, [
          o[32] || (o[32] = d("summary", null, "Release options", -1)),
          d("div", Ed, [
            d("label", Ad, [
              o[31] || (o[31] = d("span", { class: "work-spacer" }, "Require approvals", -1)),
              h(r(qe), {
                "model-value": !!e.state.release_when.approvals,
                "aria-label": "Require approvals",
                "onUpdate:modelValue": o[1] || (o[1] = (n) => e.state.release_when.approvals = n ? { min: 1, from: { group: "" }, prevent_self: !0 } : void 0)
              }, null, 8, ["model-value"])
            ]),
            h(Ct, {
              modelValue: e.state.release_when.wait,
              "onUpdate:modelValue": o[2] || (o[2] = (n) => e.state.release_when.wait = n),
              label: "Wait before release",
              onValidity: o[3] || (o[3] = (n, s) => l("validity", s, n))
            }, null, 8, ["modelValue"]),
            h(nl, {
              label: "Release when",
              draft: e.draft,
              "board-id": e.boardId,
              modelValue: e.state.release_when.when,
              "onUpdate:modelValue": o[4] || (o[4] = (n) => e.state.release_when.when = n),
              onValidity: o[5] || (o[5] = (n) => l("validity", "release", n))
            }, null, 8, ["draft", "board-id", "modelValue"])
          ])
        ])
      ], 64)) : U("", !0),
      e.state.kind === "automated" && e.state.run ? (c(), g(X, { key: 1 }, [
        o[40] || (o[40] = d("h4", { class: "work-process-group" }, "Automation", -1)),
        d("label", Pd, [
          o[34] || (o[34] = F("Run label", -1)),
          h(r(ce), {
            modelValue: e.state.run.stage,
            "onUpdate:modelValue": o[6] || (o[6] = (n) => e.state.run.stage = n),
            "aria-label": "Run label",
            required: ""
          }, null, 8, ["modelValue"])
        ]),
        h(Jr, {
          modelValue: e.state.run.flow_ref,
          "onUpdate:modelValue": o[7] || (o[7] = (n) => e.state.run.flow_ref = n),
          onValidity: o[8] || (o[8] = (n) => l("validity", "flow", n))
        }, null, 8, ["modelValue"]),
        h(Ct, {
          modelValue: e.state.run.timeout,
          "onUpdate:modelValue": o[9] || (o[9] = (n) => e.state.run.timeout = n),
          label: "Attempt timeout",
          onValidity: o[10] || (o[10] = (n, s) => l("validity", s, n))
        }, null, 8, ["modelValue"]),
        o[41] || (o[41] = d("small", { class: "work-muted" }, "Blank uses the board timeout, or one hour.", -1)),
        d("label", Rd, [
          o[35] || (o[35] = d("span", { class: "work-spacer" }, "Maximum visits", -1)),
          h(r(Ze), {
            "model-value": e.state.run.max_visits ?? null,
            "aria-label": "Maximum visits",
            min: 1,
            useGrouping: !1,
            placeholder: "Board default",
            "onUpdate:modelValue": o[11] || (o[11] = (n) => e.state.run.max_visits = n ?? void 0)
          }, null, 8, ["model-value"])
        ]),
        d("label", Nd, [
          o[36] || (o[36] = F("When visits are exhausted", -1)),
          h(r(ae), {
            "model-value": e.state.run.on_exhausted,
            "aria-label": "When visits are exhausted",
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            showClear: "",
            options: (e.process.transitions ?? []).filter((n) => !n.auto).map((n) => ({ label: r(Pe)(n), value: n.id })),
            "onUpdate:modelValue": o[12] || (o[12] = (n) => e.state.run.on_exhausted = n || void 0)
          }, null, 8, ["model-value", "options"])
        ]),
        o[42] || (o[42] = d("small", { class: "work-muted" }, "Blank records a failed run and stops automation. A route must leave every incoming state or be global.", -1)),
        d("label", Od, [
          o[37] || (o[37] = d("span", { class: "work-spacer" }, "Retry if it fails", -1)),
          h(r(qe), {
            "model-value": !!e.state.run.retry,
            "aria-label": "Retry if it fails",
            "onUpdate:modelValue": o[13] || (o[13] = (n) => e.state.run.retry = n ? { max: 1, backoff: "PT1M" } : void 0)
          }, null, 8, ["model-value"])
        ]),
        e.state.run.retry ? (c(), g(X, { key: 0 }, [
          d("label", Md, [
            o[38] || (o[38] = d("span", { class: "work-spacer" }, "Maximum attempts", -1)),
            h(r(Ze), {
              modelValue: e.state.run.retry.max,
              "onUpdate:modelValue": o[14] || (o[14] = (n) => e.state.run.retry.max = n),
              min: 1,
              useGrouping: !1
            }, null, 8, ["modelValue"])
          ]),
          h(Ct, {
            modelValue: e.state.run.retry.backoff,
            "onUpdate:modelValue": o[15] || (o[15] = (n) => e.state.run.retry.backoff = n),
            label: "Wait between attempts",
            onValidity: o[16] || (o[16] = (n, s) => l("validity", s, n))
          }, null, 8, ["modelValue"])
        ], 64)) : U("", !0),
        (c(), g(X, null, te([{ key: "on_pass", label: "On success" }, { key: "on_cancel", label: "On cancellation" }], (n) => d("label", {
          key: n.key,
          class: "work-stack work-tight"
        }, [
          F(I(n.label), 1),
          h(r(ae), {
            "model-value": e.state.run[n.key],
            "aria-label": n.label,
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            showClear: "",
            options: i.value.map((s) => ({ label: r(Pe)(s), value: s.id })),
            "onUpdate:modelValue": (s) => e.state.run[n.key] = s || void 0
          }, null, 8, ["model-value", "aria-label", "options", "onUpdate:modelValue"])
        ])), 64)),
        d("label", Fd, [
          o[39] || (o[39] = F("If it fails, go to", -1)),
          h(r(ae), {
            "model-value": e.state.run.on_fail,
            "onUpdate:modelValue": v,
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            showClear: "",
            options: i.value.map((n) => ({
              label: r(Pe)(n) + " → " + r(ue)(e.process.states.find((s) => s.id === n.to)),
              value: n.id
            }))
          }, null, 8, ["model-value", "options"])
        ])
      ], 64)) : U("", !0),
      e.state.kind === "parallel" && e.state.regions ? (c(), g(X, { key: 2 }, [
        o[47] || (o[47] = d("h4", { class: "work-process-group" }, "Lanes", -1)),
        (c(!0), g(X, null, te(e.state.regions, (n, s) => (c(), g("div", {
          key: s,
          class: "work-process-value work-stack work-tight"
        }, [
          d("div", Ld, [
            d("span", null, "Lane " + I(s + 1), 1),
            o[43] || (o[43] = d("span", { class: "work-spacer" }, null, -1)),
            h(r(Y), {
              severity: "danger",
              text: "",
              size: "small",
              "aria-label": "Remove lane",
              onClick: (b) => e.state.regions.splice(s, 1)
            }, {
              default: L(() => [
                h(r(Q), { icon: "tabler:trash" })
              ]),
              _: 1
            }, 8, ["onClick"])
          ]),
          d("label", zd, [
            o[44] || (o[44] = F("Starts at", -1)),
            h(r(ae), {
              modelValue: n.initial,
              "onUpdate:modelValue": (b) => n.initial = b,
              appendTo: "self",
              optionLabel: "label",
              optionValue: "value",
              options: e.process.states.filter((b) => b.id !== e.state.id).map((b) => ({ label: r(ue)(b), value: b.id }))
            }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
          ])
        ]))), 128)),
        h(r(Y), {
          label: "Add lane",
          severity: "secondary",
          outlined: "",
          size: "small",
          onClick: o[17] || (o[17] = (n) => e.state.regions.push({
            id: r($t)("region", e.state.regions),
            initial: e.process.states.find((s) => s.id !== e.state.id)?.id ?? ""
          }))
        }, {
          icon: L(() => [
            h(r(Q), { icon: "tabler:plus" })
          ]),
          _: 1
        }),
        d("label", Bd, [
          o[45] || (o[45] = F("Finish rule", -1)),
          h(r(ae), {
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
        typeof e.state.join == "number" ? (c(), g("label", jd, [
          o[46] || (o[46] = d("span", { class: "work-spacer" }, "Lanes needed", -1)),
          h(r(Ze), {
            modelValue: e.state.join,
            "onUpdate:modelValue": o[19] || (o[19] = (n) => e.state.join = n),
            min: 1,
            max: e.state.regions.length,
            useGrouping: !1
          }, null, 8, ["modelValue", "max"])
        ])) : U("", !0)
      ], 64)) : U("", !0),
      o[53] || (o[53] = d("h4", { class: "work-process-group" }, "Limit", -1)),
      d("label", qd, [
        o[48] || (o[48] = d("span", { class: "work-spacer" }, "Items allowed here", -1)),
        h(xa, {
          draft: e.draft,
          state: e.state.id,
          label: "Items allowed here"
        }, null, 8, ["draft", "state"])
      ]),
      d("label", Wd, [
        o[49] || (o[49] = d("span", { class: "work-spacer" }, [
          F("Refuse moves over the limit"),
          d("small", { class: "work-muted work-block" }, "Off only warns")
        ], -1)),
        h(xa, {
          draft: e.draft,
          state: e.state.id,
          label: "Refuse moves over the limit",
          hard: ""
        }, null, 8, ["draft", "state"])
      ]),
      o[54] || (o[54] = d("h4", { class: "work-process-group" }, "Required on entry", -1)),
      h(jt, {
        label: "Required fields",
        options: e.draft.fields?.map((n) => ({ value: n.code, label: n.title || n.code })) ?? [],
        modelValue: e.state.require,
        "onUpdate:modelValue": o[20] || (o[20] = (n) => e.state.require = n)
      }, null, 8, ["options", "modelValue"]),
      !e.state.kind || e.state.kind === "human" ? (c(), q(Ct, {
        key: 3,
        modelValue: e.state.due,
        "onUpdate:modelValue": o[21] || (o[21] = (n) => e.state.due = n),
        label: "Time allowed in this state",
        onValidity: o[22] || (o[22] = (n, s) => l("validity", s, n))
      }, null, 8, ["modelValue"])) : U("", !0),
      o[55] || (o[55] = d("h4", { class: "work-process-group" }, "Assignment and conditions", -1)),
      d("label", Kd, [
        o[50] || (o[50] = F("Stage label", -1)),
        h(r(ce), {
          "model-value": e.state.stage,
          "aria-label": "Stage label",
          "onUpdate:modelValue": o[23] || (o[23] = (n) => e.state.stage = n || void 0)
        }, null, 8, ["model-value"])
      ]),
      !e.state.kind || e.state.kind === "human" || e.state.kind === "parallel" ? (c(), g(X, { key: 4 }, [
        d("label", Gd, [
          h(r(qe), {
            "model-value": !!e.state.awaiting,
            "aria-label": "Awaiting people",
            "onUpdate:modelValue": o[24] || (o[24] = (n) => e.state.awaiting = n ? { group: "" } : void 0)
          }, null, 8, ["model-value"]),
          o[51] || (o[51] = F("Awaiting people", -1))
        ]),
        e.state.awaiting ? (c(), q(fd, {
          key: 0,
          modelValue: e.state.awaiting,
          "onUpdate:modelValue": o[25] || (o[25] = (n) => e.state.awaiting = n),
          draft: e.draft,
          "board-id": e.boardId,
          label: "Awaiting",
          onValidity: o[26] || (o[26] = (n) => l("validity", "awaiting", n))
        }, null, 8, ["modelValue", "draft", "board-id"])) : U("", !0)
      ], 64)) : U("", !0),
      h(sl, {
        "board-id": e.boardId,
        modelValue: e.state.assign,
        "onUpdate:modelValue": o[27] || (o[27] = (n) => e.state.assign = n),
        label: "Assign to"
      }, null, 8, ["board-id", "modelValue"]),
      h(pt, {
        label: "State checks",
        example: ["installed-check"],
        "model-value": e.state.invariants,
        shape: "array",
        "onUpdate:modelValue": o[28] || (o[28] = (n) => e.state.invariants = n),
        onValidity: o[29] || (o[29] = (n) => l("validity", "invariants", n))
      }, null, 8, ["model-value"]),
      h(ud, {
        state: e.state,
        draft: e.draft,
        onValidity: o[30] || (o[30] = (n, s) => l("validity", "timer-" + n, s))
      }, null, 8, ["state", "draft"])
    ]));
  }
}), Yd = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, Xd = {
  class: "work-process-controls",
  role: "toolbar",
  "aria-label": "Process tools"
}, Jd = {
  key: 1,
  class: "work-process-title"
}, Zd = { class: "work-muted" }, Qd = {
  key: 2,
  class: "work-map-zoom",
  role: "group",
  "aria-label": "Map zoom"
}, _d = ["aria-label"], eu = { class: "work-row" }, tu = { class: "work-process-meaning" }, au = { class: "work-stack work-tight" }, lu = { class: "work-process-inspector-foot" }, ou = { class: "work-row" }, iu = { class: "work-process-meaning" }, nu = { class: "work-stack work-tight" }, su = { class: "work-process-inspector-foot" }, ru = {
  key: 3,
  class: "work-row"
}, du = { class: "work-stack work-tight" }, uu = { class: "work-dialog-actions" }, cu = /* @__PURE__ */ fe({
  __name: "ProcessEditor",
  props: {
    draft: {},
    guardRemoval: { type: Function },
    issues: {},
    boardId: {}
  },
  emits: ["validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, i = H(() => t.draft.processes ?? []), u = B(!1), m = B(""), v = B(""), p = B(""), o = B("Map"), n = B(""), s = B(), b = B(), f = B(), k = B(), $ = B(!1);
    async function N() {
      $.value = !0, await xo(), k.value?.querySelector('[aria-label="State name"]')?.focus();
    }
    const V = H(() => i.value.find((C) => C.id === v.value) ?? i.value[0]);
    function A() {
      $.value = !1, s.value = void 0, b.value = void 0, p.value = "";
    }
    function T(C) {
      $.value = !1, s.value = C, b.value = void 0, n.value = "", p.value = "";
    }
    function P(C) {
      $.value = !1, b.value = C, s.value = void 0, p.value = "";
    }
    xe(V, A);
    function x(C) {
      C === "__new" ? u.value = !0 : v.value = C;
    }
    function D() {
      const C = m.value.trim();
      if (!C) return;
      const R = C.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "") || "process", M = (/^[a-z]/.test(R) ? R : "process_" + R).slice(0, 40), Z = i.value.some((ve) => ve.id === M) ? $t(M, i.value) : M;
      (t.draft.processes ??= []).push({ id: Z, name: C, initial: "todo", states: [{ id: "todo", name: "To do", category: "unstarted" }], transitions: [] }), v.value = Z, m.value = "", u.value = !1;
    }
    async function E(C) {
      const R = { id: $t("state", C.states), name: "New state", category: "started" }, M = Ha(C), Z = M.at(-1), ve = s.value ?? (Z?.category === "completed" ? M.at(-2) : Z), be = ve && (C.transitions?.find((ge) => ge.default && ge.from !== "any" && ge.from.includes(ve.id)) ?? C.transitions?.find((ge) => ge.from !== "any" && ge.from.includes(ve.id) && C.states.findIndex((Ve) => Ve.id === ge.to) > C.states.indexOf(ve)));
      if (C.states.splice(ve ? C.states.indexOf(ve) + 1 : C.states.length, 0, R), ve && ve.category !== "completed" && ve.category !== "canceled")
        if (be) {
          const ge = be.to;
          be.to = R.id, (C.transitions ??= []).push({ id: $t("transition", C.transitions ?? []), name: "Continue", from: [R.id], to: ge, ...be.auto && be.default ? { auto: !0, default: !0 } : {} });
        } else (C.transitions ??= []).push({ id: $t("transition", C.transitions ?? []), name: "Continue", from: [ve.id], to: R.id });
      T(R), await N();
    }
    function le(C, R) {
      const M = V.value;
      if (!M || !R || C === R) return;
      let Z = `to_${R}`, ve = 2;
      for (; M.transitions?.some((ge) => ge.id === Z); ) Z = `to_${R}_${ve++}`;
      const be = { id: Z, name: `To ${ue(M.states.find((ge) => ge.id === R)).toLowerCase()}`, from: [C], to: R };
      (M.transitions ??= []).push(be), P(be);
    }
    function z(C) {
      const R = { id: $t("transition", C.transitions ?? []), name: "To " + ue(C.states.at(-1)), from: [C.initial], to: C.states.at(-1)?.id ?? C.initial };
      (C.transitions ??= []).push(R), P(R);
    }
    function j(C, R) {
      const M = No(C, R);
      if (M.length) {
        p.value = `Used by ${M.join(", ")}. Update those references first.`;
        return;
      }
      C.transitions?.splice(C.transitions.indexOf(R), 1), A();
    }
    function O(C, R) {
      const M = Oo(C, R);
      if (M.length) {
        p.value = `${ue(R)} is used by ${M.join(", ")}. Update these references first.`;
        return;
      }
      C.states.splice(C.states.indexOf(R), 1), A();
    }
    async function ne(C) {
      const R = t.draft.item_types?.filter((Z) => Z.process === C.id).map((Z) => Z.title || "Untitled item type") ?? [];
      if (R.length) {
        p.value = `Used by ${R.join(", ")}. Choose a different process for those item types first.`;
        return;
      }
      const M = await t.guardRemoval?.("processes", C.id);
      if (M) {
        p.value = M;
        return;
      }
      la(t.draft, "processes", C.id), v.value = "", A();
    }
    return (C, R) => (c(), g("section", {
      class: "work-process-editor work-stack",
      "aria-label": "Process editor",
      onKeydown: Ne(A, ["esc"])
    }, [
      p.value ? (c(), g("p", Yd, I(p.value), 1)) : U("", !0),
      (c(!0), g(X, null, te(e.issues?.filter((M) => M.code === "process " + V.value?.id) ?? [], (M) => (c(), g("p", {
        key: M.what + M.detail,
        class: "work-error work-small",
        role: "alert"
      }, I(r(Sa)(M)) + " · " + I(M.what), 1))), 128)),
      V.value ? (c(), g("div", {
        key: 1,
        class: ft(["work-process-builder", { "work-process-inspecting": s.value || b.value }])
      }, [
        d("div", Xd, [
          i.value.length > 1 ? (c(), q(r(ae), {
            key: 0,
            "model-value": V.value.id,
            "aria-label": "Process",
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            options: [
              ...i.value.map((M) => ({ label: M.name || "Untitled process", value: M.id })),
              { label: "New process…", value: "__new" }
            ],
            "onUpdate:modelValue": x
          }, null, 8, ["model-value", "options"])) : (c(), g("span", Jd, I(V.value.name || "Process"), 1)),
          h(r(Y), {
            label: "Add state",
            severity: "secondary",
            outlined: "",
            size: "small",
            onClick: R[0] || (R[0] = (M) => E(V.value))
          }, {
            icon: L(() => [
              h(r(Q), { icon: "tabler:plus" })
            ]),
            _: 1
          }),
          h(r(ae), {
            modelValue: V.value.initial,
            "onUpdate:modelValue": R[1] || (R[1] = (M) => V.value.initial = M),
            "aria-label": "Starts in " + r(ue)(V.value.states.find((M) => M.id === V.value.initial)),
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            options: V.value.states.map((M) => ({ label: r(ue)(M), value: M.id }))
          }, {
            value: L(() => [
              d("span", Zd, "Starts in " + I(r(ue)(V.value.states.find((M) => M.id === V.value.initial))), 1)
            ]),
            _: 1
          }, 8, ["modelValue", "aria-label", "options"]),
          R[17] || (R[17] = d("span", { class: "work-spacer" }, null, -1)),
          o.value === "Map" ? (c(), g("div", Qd, [
            h(r(Y), {
              label: "Fit",
              title: "Fit to width and show the full process",
              text: "",
              severity: "secondary",
              size: "small",
              onClick: R[2] || (R[2] = (M) => f.value?.fit())
            }, {
              icon: L(() => [
                h(r(Q), { icon: "tabler:arrows-maximize" })
              ]),
              _: 1
            }),
            o.value === "Map" ? (c(), q(r(Y), {
              key: 0,
              "aria-label": "Zoom out",
              title: "Zoom out",
              text: "",
              severity: "secondary",
              size: "small",
              onClick: R[3] || (R[3] = (M) => f.value?.zoomOut())
            }, {
              default: L(() => [
                h(r(Q), { icon: "tabler:minus" })
              ]),
              _: 1
            })) : U("", !0),
            o.value === "Map" ? (c(), q(r(Y), {
              key: 1,
              "aria-label": "Zoom in",
              title: "Zoom in",
              text: "",
              severity: "secondary",
              size: "small",
              onClick: R[4] || (R[4] = (M) => f.value?.zoomIn())
            }, {
              default: L(() => [
                h(r(Q), { icon: "tabler:plus" })
              ]),
              _: 1
            })) : U("", !0)
          ])) : U("", !0),
          h(r(il), {
            modelValue: o.value,
            "onUpdate:modelValue": R[5] || (R[5] = (M) => o.value = M),
            options: ["Map", "List"],
            "allow-empty": !1,
            "aria-label": "Process layout"
          }, null, 8, ["modelValue"]),
          i.value.length === 1 ? (c(), q(r(Y), {
            key: 3,
            label: "New process",
            "aria-label": "New process",
            text: "",
            severity: "secondary",
            size: "small",
            onClick: R[6] || (R[6] = (M) => u.value = !0)
          }, {
            icon: L(() => [
              h(r(Q), { icon: "tabler:plus" })
            ]),
            _: 1
          })) : U("", !0)
        ]),
        o.value === "Map" ? (c(), q(wr, {
          key: 0,
          ref_key: "graph",
          ref: f,
          process: V.value,
          draft: e.draft,
          "selected-state": s.value,
          "selected-transition": b.value,
          onState: T,
          onTransition: P,
          onConnect: le,
          onClear: A
        }, null, 8, ["process", "draft", "selected-state", "selected-transition"])) : (c(), q(Ar, {
          key: 1,
          process: V.value,
          "selected-state": s.value,
          "selected-transition": b.value,
          onState: T,
          onTransition: P,
          onRemoveState: R[7] || (R[7] = (M) => O(V.value, M)),
          onRemoveTransition: R[8] || (R[8] = (M) => j(V.value, M)),
          onAddTransition: R[9] || (R[9] = (M) => z(V.value))
        }, null, 8, ["process", "selected-state", "selected-transition"])),
        s.value || b.value ? (c(), g("aside", {
          key: 2,
          ref_key: "inspector",
          ref: k,
          class: "work-process-sideform",
          "aria-label": s.value ? "State inspector" : "Transition inspector"
        }, [
          (c(!0), g(X, null, te(s.value ? [s.value] : [], (M) => (c(), g(X, {
            key: M.id
          }, [
            d("header", eu, [
              $.value ? (c(), q(r(ce), {
                key: 1,
                modelValue: M.name,
                "onUpdate:modelValue": (Z) => M.name = Z,
                class: "work-process-name",
                "aria-label": "State name",
                onBlur: R[10] || (R[10] = (Z) => $.value = !1)
              }, null, 8, ["modelValue", "onUpdate:modelValue"])) : (c(), q(ll, {
                key: 0,
                class: "work-process-state-title",
                "aria-label": "Rename state",
                onActivate: N
              }, {
                default: L(() => [
                  d("span", null, I(r(ue)(M)), 1)
                ]),
                _: 2
              }, 1024)),
              h(r(Y), {
                severity: "secondary",
                text: "",
                size: "small",
                "aria-label": "Close state editor",
                onClick: A
              }, {
                default: L(() => [
                  h(r(Q), { icon: "tabler:x" })
                ]),
                _: 1
              })
            ]),
            d("p", tu, I(r(Ro)(M, e.draft)), 1),
            h(Hd, {
              state: M,
              process: V.value,
              draft: e.draft,
              "board-id": e.boardId,
              onValidity: (Z, ve) => l("validity", Z.includes("duration:") ? Z : V.value.id + ":" + M.id + ":" + Z, ve)
            }, null, 8, ["state", "process", "draft", "board-id", "onValidity"]),
            d("label", au, [
              R[18] || (R[18] = F("Phase", -1)),
              h(r(ae), {
                modelValue: M.category,
                "onUpdate:modelValue": (Z) => M.category = Z,
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                options: ["triage", "backlog", ...r(ql)].map((Z) => ({ label: r(Tt)(Z), value: Z }))
              }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
            ]),
            R[19] || (R[19] = d("h4", { class: "work-process-group" }, "Next stop", -1)),
            h(r(ae), {
              modelValue: n.value,
              "onUpdate:modelValue": R[11] || (R[11] = (Z) => n.value = Z),
              "aria-label": "Add transition to…",
              placeholder: "Add transition to…",
              appendTo: "self",
              optionLabel: "label",
              optionValue: "value",
              options: V.value.states.filter((Z) => Z !== M).map((Z) => ({ label: r(ue)(Z), value: Z.id }))
            }, null, 8, ["modelValue", "options"]),
            h(r(Y), {
              label: "Add transition",
              severity: "secondary",
              outlined: "",
              size: "small",
              disabled: !n.value,
              onClick: (Z) => le(M.id, n.value)
            }, {
              icon: L(() => [
                h(r(Q), { icon: "tabler:arrow-right" })
              ]),
              _: 1
            }, 8, ["disabled", "onClick"]),
            d("footer", lu, [
              h(r(Y), {
                label: "Remove state",
                severity: "danger",
                text: "",
                size: "small",
                onClick: (Z) => O(V.value, M)
              }, {
                icon: L(() => [
                  h(r(Q), { icon: "tabler:trash" })
                ]),
                _: 1
              }, 8, ["onClick"])
            ])
          ], 64))), 128)),
          (c(!0), g(X, null, te(b.value ? [b.value] : [], (M) => (c(), g(X, {
            key: M.id
          }, [
            d("header", ou, [
              R[20] || (R[20] = d("h3", null, "Transition", -1)),
              R[21] || (R[21] = d("span", { class: "work-spacer" }, null, -1)),
              h(r(Y), {
                severity: "secondary",
                text: "",
                size: "small",
                "aria-label": "Close transition editor",
                onClick: A
              }, {
                default: L(() => [
                  h(r(Q), { icon: "tabler:x" })
                ]),
                _: 1
              })
            ]),
            d("p", iu, I(M.from === "any" ? "Any state" : M.from.map((Z) => r(ue)(V.value.states.find((ve) => ve.id === Z))).join(", ")) + " → " + I(r(ue)(V.value.states.find((Z) => Z.id === M.to))), 1),
            d("label", nu, [
              R[22] || (R[22] = F("Name", -1)),
              h(r(ce), {
                modelValue: M.name,
                "onUpdate:modelValue": (Z) => M.name = Z,
                placeholder: r(Pe)(M),
                "aria-label": "Transition name"
              }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder"])
            ]),
            h(jr, {
              transition: M,
              process: V.value,
              draft: e.draft,
              "board-id": e.boardId,
              onValidity: (Z, ve) => l("validity", V.value.id + ":transition-" + M.id + ":" + Z, ve)
            }, null, 8, ["transition", "process", "draft", "board-id", "onValidity"]),
            d("footer", su, [
              h(r(Y), {
                label: "Remove transition",
                severity: "danger",
                text: "",
                size: "small",
                onClick: (Z) => j(V.value, M)
              }, {
                icon: L(() => [
                  h(r(Q), { icon: "tabler:trash" })
                ]),
                _: 1
              }, 8, ["onClick"])
            ])
          ], 64))), 128))
        ], 8, _d)) : U("", !0)
      ], 2)) : (c(), q(r(Y), {
        key: 2,
        label: "New process",
        severity: "secondary",
        outlined: "",
        onClick: R[12] || (R[12] = (M) => u.value = !0)
      }, {
        icon: L(() => [
          h(r(Q), { icon: "tabler:plus" })
        ]),
        _: 1
      })),
      o.value === "List" && V.value ? (c(), g("div", ru, [
        h(r(Y), {
          label: "Remove process",
          severity: "danger",
          text: "",
          size: "small",
          onClick: R[13] || (R[13] = (M) => ne(V.value))
        }, {
          icon: L(() => [
            h(r(Q), { icon: "tabler:trash" })
          ]),
          _: 1
        })
      ])) : U("", !0),
      h(Kl, {
        visible: u.value,
        label: "New process",
        onClose: R[16] || (R[16] = (M) => u.value = !1)
      }, {
        default: L(() => [
          d("form", {
            class: "work-dialog-box",
            "aria-label": "New process",
            onSubmit: he(D, ["stop", "prevent"])
          }, [
            R[24] || (R[24] = d("h2", null, "New process", -1)),
            d("label", du, [
              R[23] || (R[23] = F("Name", -1)),
              h(r(ce), {
                modelValue: m.value,
                "onUpdate:modelValue": R[14] || (R[14] = (M) => m.value = M),
                "aria-label": "New process name",
                autofocus: "",
                required: ""
              }, null, 8, ["modelValue"])
            ]),
            d("div", uu, [
              h(r(Y), {
                label: "Cancel",
                severity: "secondary",
                outlined: "",
                onClick: R[15] || (R[15] = (M) => u.value = !1)
              }),
              h(r(Y), {
                label: "Create process",
                type: "submit",
                disabled: !m.value.trim()
              }, null, 8, ["disabled"])
            ])
          ], 32)
        ]),
        _: 1
      }, 8, ["visible"])
    ], 32));
  }
}), vu = ["inert"], mu = { class: "work-stack work-tight" }, fu = /* @__PURE__ */ fe({
  __name: "ProcessMigration",
  props: {
    draft: {},
    original: {},
    disabled: { type: Boolean }
  },
  setup(e) {
    const a = e;
    function t(i, u, m) {
      m ? (i.map ??= {})[u] = m : i.map && delete i.map[u];
    }
    function l(i) {
      return a.original.processes?.find((u) => u.id === i.id)?.states.filter((u) => !i.states.some((m) => m.id === u.id)) ?? [];
    }
    return (i, u) => (c(), g("section", {
      class: "work-stack work-settings-card",
      "aria-label": "Existing items",
      inert: e.disabled || void 0
    }, [
      u[0] || (u[0] = d("h3", null, "Existing items", -1)),
      u[1] || (u[1] = d("p", { class: "work-muted work-small" }, " Choose how existing items follow these changes, then review the impact before applying. ", -1)),
      (c(!0), g(X, null, te(e.draft.processes ?? [], (m) => (c(), g("div", {
        key: m.id,
        class: "work-stack"
      }, [
        d("label", mu, [
          F(I(m.name || "Untitled process"), 1),
          h(r(ae), {
            disabled: e.disabled,
            "model-value": r(bl)(m),
            "aria-label": "Existing items in " + (m.name || "this process"),
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            options: [
              { label: "Follow new process", value: "follow" },
              { label: "Keep current process", value: "pin" }
            ],
            "onUpdate:modelValue": (v) => m.migration = v
          }, null, 8, ["disabled", "model-value", "aria-label", "onUpdate:modelValue"])
        ]),
        r(bl)(m) !== "pin" ? (c(!0), g(X, { key: 0 }, te(l(m), (v) => (c(), g("label", {
          key: v.id,
          class: "work-stack work-tight"
        }, [
          F("Move items from " + I(r(ue)(v)) + " to", 1),
          h(r(ae), {
            disabled: e.disabled,
            "model-value": m.map?.[v.id],
            placeholder: "Choose a surviving state",
            appendTo: "self",
            showClear: "",
            optionLabel: "label",
            optionValue: "value",
            options: m.states.map((p) => ({ label: r(ue)(p), value: p.id })),
            "onUpdate:modelValue": (p) => t(m, v.id, p)
          }, null, 8, ["disabled", "model-value", "options", "onUpdate:modelValue"])
        ]))), 128)) : U("", !0)
      ]))), 128))
    ], 8, vu));
  }
}), pu = {
  class: "work-stack",
  "aria-label": "Policy editor"
}, bu = { class: "work-settings-list" }, hu = { class: "work-settings-row" }, yu = { class: "work-row-control" }, gu = { class: "work-settings-list work-wip-container" }, ku = { class: "work-wip-table" }, wu = { class: "work-mono" }, Vu = { class: "work-row-main" }, $u = { class: "work-row" }, xu = { class: "work-row" }, Cu = { class: "work-settings-list" }, Su = { class: "work-settings-row" }, Tu = { class: "work-row-control" }, Du = { class: "work-row-main" }, Uu = { class: "work-row-title" }, Iu = { class: "work-muted work-small" }, Eu = { class: "work-row-control" }, Au = /* @__PURE__ */ fe({
  __name: "PolicyEditor",
  props: {
    draft: {}
  },
  emits: ["validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, i = H(() => t.draft.policy ?? {}), u = H(() => [...new Set(t.draft.processes?.flatMap((n) => n.states.map((s) => s.id)) ?? [])]), m = ["audit_days", "trash_days", "tombstone_days", "interval_days"], v = { audit_days: "Zero selects 365 days.", interval_days: "Zero selects 365 days.", trash_days: "Zero allows immediate cleanup of trashed items.", tombstone_days: "Zero allows immediate cleanup of deletion records." };
    function p(n, s) {
      s === void 0 ? t.draft.policy && delete t.draft.policy[n] : (t.draft.policy ??= {})[n] = s;
    }
    function o(n, s) {
      p(n, s ?? void 0);
    }
    return (n, s) => (c(), g("section", pu, [
      s[13] || (s[13] = d("header", { class: "work-section-heading" }, [
        d("div", null, [
          d("h2", null, "Policy"),
          d("p", { class: "work-muted work-small" }, "Set capacity and how long the board keeps its history.")
        ])
      ], -1)),
      s[14] || (s[14] = d("h3", { class: "work-group-title" }, "Item keys", -1)),
      d("div", bu, [
        d("div", hu, [
          s[7] || (s[7] = d("div", { class: "work-row-main" }, [
            d("strong", { class: "work-row-title" }, "Item key prefix"),
            d("p", { class: "work-muted work-small" }, "Work reviews and claims prefix changes when you apply the schema.")
          ], -1)),
          d("div", yu, [
            h(r(ce), {
              modelValue: e.draft.key_prefix,
              "onUpdate:modelValue": s[0] || (s[0] = (b) => e.draft.key_prefix = b),
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
      d("div", gu, [
        d("table", ku, [
          s[8] || (s[8] = d("thead", null, [
            d("tr", null, [
              d("th", null, "State"),
              d("th", null, "Limit"),
              d("th", null, "Hard limit")
            ])
          ], -1)),
          d("tbody", null, [
            (c(!0), g(X, null, te(u.value, (b) => (c(), g("tr", { key: b }, [
              d("td", null, [
                d("strong", null, I(e.draft.processes?.flatMap((f) => f.states).find((f) => f.id === b)?.name || r(ye)(b)), 1),
                d("code", wu, I(b), 1)
              ]),
              d("td", null, [
                h(xa, {
                  draft: e.draft,
                  state: b,
                  label: b + " WIP limit"
                }, null, 8, ["draft", "state", "label"])
              ]),
              d("td", null, [
                h(xa, {
                  draft: e.draft,
                  state: b,
                  label: b + " hard WIP limit",
                  hard: ""
                }, null, 8, ["draft", "state", "label"])
              ])
            ]))), 128))
          ])
        ]),
        (c(!0), g(X, null, te(Object.keys(i.value.wip ?? {}).filter((b) => !u.value.includes(b)), (b) => (c(), g("div", {
          key: b,
          class: "work-settings-row"
        }, [
          d("div", Vu, [
            F(I(r(ye)(b)) + " ", 1),
            s[9] || (s[9] = d("span", { class: "work-muted" }, "Removed state", -1))
          ]),
          h(r(Y), {
            label: "Remove stale limit",
            severity: "secondary",
            outlined: "",
            onClick: (f) => delete i.value.wip[b]
          }, {
            icon: L(() => [
              h(r(Q), { icon: "tabler:trash" })
            ]),
            _: 1
          }, 8, ["onClick"])
        ]))), 128))
      ]),
      s[17] || (s[17] = d("h3", { class: "work-group-title" }, "Automated stages", -1)),
      h(Ct, {
        "model-value": i.value.stage_timeout,
        "onUpdate:modelValue": s[1] || (s[1] = (b) => p("stage_timeout", b)),
        label: "Default attempt timeout",
        onValidity: s[2] || (s[2] = (b, f) => l("validity", f, b))
      }, null, 8, ["model-value"]),
      s[18] || (s[18] = d("p", { class: "work-muted work-small" }, "Blank uses one hour. Each retry gets a new deadline.", -1)),
      d("label", $u, [
        s[10] || (s[10] = d("span", { class: "work-spacer" }, "Default maximum visits", -1)),
        h(r(Ze), {
          "model-value": i.value.stage_max_visits ?? null,
          "aria-label": "Default maximum visits",
          min: 1,
          useGrouping: !1,
          placeholder: "5",
          "onUpdate:modelValue": s[3] || (s[3] = (b) => p("stage_max_visits", b ?? void 0))
        }, null, 8, ["model-value"])
      ]),
      s[19] || (s[19] = d("h3", { class: "work-group-title" }, "Comments", -1)),
      d("label", xu, [
        s[11] || (s[11] = d("span", { class: "work-spacer" }, "Comments per item", -1)),
        h(r(Ze), {
          "model-value": i.value.comments_per_item ?? null,
          "aria-label": "Comments per item",
          min: 1,
          max: 1e5,
          useGrouping: !1,
          placeholder: "Application default",
          "onUpdate:modelValue": s[4] || (s[4] = (b) => p("comments_per_item", b ?? void 0))
        }, null, 8, ["model-value"])
      ]),
      s[20] || (s[20] = d("p", { class: "work-muted work-small" }, "Blank follows the application default.", -1)),
      s[21] || (s[21] = d("h3", { class: "work-group-title" }, "Saved query filters", -1)),
      s[22] || (s[22] = d("p", { class: "work-muted work-small" }, "Choose which installed query filters this board can use.", -1)),
      h(ol, {
        schema: { type: "object", properties: { scopes: { type: "array", title: "Query filter identifiers", items: { type: "string" } } } },
        "model-value": { scopes: e.draft.scopes },
        "onUpdate:modelValue": s[5] || (s[5] = (b) => e.draft.scopes = b.scopes)
      }, null, 8, ["model-value"]),
      s[23] || (s[23] = d("h3", { class: "work-group-title" }, "Audit and retention", -1)),
      d("div", Cu, [
        d("div", Su, [
          s[12] || (s[12] = d("div", { class: "work-row-main" }, [
            d("strong", { class: "work-row-title" }, "Audit trail"),
            d("p", { class: "work-muted work-small" }, "Choose which item changes appear in history.")
          ], -1)),
          d("div", Tu, [
            h(r(ae), {
              "model-value": i.value.audit ?? "",
              "aria-label": "Audit trail",
              placeholder: "Installation default",
              appendTo: "self",
              optionLabel: "label",
              optionValue: "value",
              options: [{ label: "Installation default", value: "" }, { label: "Off", value: "off" }, { label: "Fields", value: "fields" }],
              "onUpdate:modelValue": s[6] || (s[6] = (b) => p("audit", b || void 0))
            }, null, 8, ["model-value"])
          ])
        ]),
        (c(), g(X, null, te(m, (b) => d("div", {
          key: b,
          class: "work-settings-row"
        }, [
          d("div", Du, [
            d("strong", Uu, I(r(ye)(b)), 1),
            d("p", Iu, "Blank follows the application default. " + I(v[b]), 1)
          ]),
          d("label", Eu, [
            h(r(Ze), {
              min: 0,
              "aria-label": r(ye)(b),
              "model-value": i.value[b] ?? null,
              placeholder: "Installation default",
              useGrouping: !1,
              "onUpdate:modelValue": (f) => o(b, f)
            }, null, 8, ["aria-label", "model-value", "onUpdate:modelValue"])
          ])
        ])), 64))
      ])
    ]));
  }
}), Pu = {
  class: "work-stack",
  "aria-label": "Relation types editor"
}, Ru = { class: "work-section-heading" }, Nu = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, Ou = { class: "work-definition-meta work-muted work-small" }, Mu = { class: "work-settings-grid" }, Fu = { class: "work-stack work-tight" }, Lu = { class: "work-stack work-tight" }, zu = { class: "work-stack work-tight" }, Bu = { class: "work-stack work-tight" }, ju = { class: "work-row" }, qu = { class: "work-relation-preview work-small" }, Wu = { class: "work-muted" }, Ku = {
  key: 0,
  class: "kx-empty"
}, Gu = { class: "work-row work-add-definition" }, Hu = { class: "work-stack work-tight" }, Yu = /* @__PURE__ */ fe({
  __name: "RelationsEditor",
  props: {
    draft: {},
    guardRemoval: { type: Function }
  },
  setup(e) {
    const a = e, t = H(() => a.draft.relation_types ?? []), l = B(""), i = B(""), u = B(!1), m = H(() => /^[a-z][a-z0-9_]*$/.test(l.value) && !t.value.some((o) => o.id === l.value));
    function v() {
      m.value && ((a.draft.relation_types ??= []).push({ id: l.value, outward: ye(l.value).toLowerCase(), inward: ye(l.value).toLowerCase(), cardinality: "many" }), l.value = "");
    }
    async function p(o) {
      if (!u.value) {
        u.value = !0, i.value = "";
        try {
          const n = await a.guardRemoval?.("relation_types", o);
          n ? i.value = n : la(a.draft, "relation_types", o);
        } finally {
          u.value = !1;
        }
      }
    }
    return (o, n) => (c(), g("section", Pu, [
      d("header", Ru, [
        n[1] || (n[1] = d("div", null, [
          d("h2", null, "Relation types"),
          d("p", { class: "work-muted work-small" }, "Give each direction a clear label. A used relation keeps its identity and shape.")
        ], -1)),
        h(r(Oe), {
          class: "kx-tag-sm",
          severity: "secondary"
        }, {
          default: L(() => [
            F(I(t.value.length) + " " + I(t.value.length === 1 ? "relation" : "relations"), 1)
          ]),
          _: 1
        })
      ]),
      i.value ? (c(), g("p", Nu, I(i.value), 1)) : U("", !0),
      h(Da, {
        columns: "relations",
        count: t.value.length
      }, {
        default: L(() => [
          (c(!0), g(X, null, te(t.value, (s, b) => (c(), q(Ta, {
            title: r(ye)(s.id),
            code: s.id,
            kind: s.symmetric ? "Same both ways" : "Different each way",
            key: b,
            class: "work-stack"
          }, {
            usage: L(() => [
              d("span", Ou, I(s.outward || "Related work") + " · " + I(s.inward || "Reverse relation"), 1)
            ]),
            actions: L(() => [
              h(r(Y), {
                severity: "secondary",
                text: "",
                disabled: u.value,
                onClick: (f) => p(s.id),
                "aria-label": "Remove relation",
                size: "small"
              }, {
                default: L(() => [
                  h(r(Q), {
                    icon: "tabler:trash",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["disabled", "onClick"])
            ]),
            default: L(() => [
              d("div", Mu, [
                d("label", Fu, [
                  n[2] || (n[2] = F("Identifier ", -1)),
                  h(r(ce), {
                    modelValue: s.id,
                    "onUpdate:modelValue": (f) => s.id = f,
                    required: "",
                    pattern: "[a-z][a-z0-9_]*",
                    "aria-label": "Relation ID"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                d("label", Lu, [
                  n[3] || (n[3] = F("Outward label ", -1)),
                  h(r(ce), {
                    modelValue: s.outward,
                    "onUpdate:modelValue": (f) => s.outward = f,
                    "aria-label": "Outward label"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                d("label", zu, [
                  n[4] || (n[4] = F("Inward label ", -1)),
                  h(r(ce), {
                    modelValue: s.inward,
                    "onUpdate:modelValue": (f) => s.inward = f,
                    "aria-label": "Inward label"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                d("label", Bu, [
                  n[5] || (n[5] = F("Links allowed ", -1)),
                  h(r(ae), {
                    "model-value": s.cardinality ?? "many",
                    "onUpdate:modelValue": (f) => s.cardinality = f,
                    "aria-label": "Links allowed",
                    appendTo: "self",
                    optionLabel: "label",
                    optionValue: "value",
                    optionDisabled: "disabled",
                    options: [{ label: "One link", value: "one", disabled: !1 }, { label: "Many links", value: "many", disabled: !1 }]
                  }, null, 8, ["model-value", "onUpdate:modelValue"])
                ]),
                d("label", ju, [
                  h(r(zt), {
                    modelValue: s.symmetric,
                    "onUpdate:modelValue": (f) => s.symmetric = f,
                    "aria-label": "Same meaning in both directions",
                    binary: ""
                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                  n[6] || (n[6] = F("Same meaning in both directions ", -1))
                ])
              ]),
              d("p", qu, [
                n[7] || (n[7] = d("strong", null, "This item", -1)),
                F(" " + I(s.outward || "relates to") + " ", 1),
                n[8] || (n[8] = d("strong", null, "another item", -1)),
                d("span", Wu, " · reverse: " + I(s.symmetric ? s.outward : s.inward), 1)
              ])
            ]),
            _: 2
          }, 1032, ["title", "code", "kind"]))), 128)),
          t.value.length ? U("", !0) : (c(), g("p", Ku, "No relation types yet. Add one to link related work.")),
          d("div", Gu, [
            d("label", Hu, [
              n[9] || (n[9] = F("New relation ID ", -1)),
              h(r(ce), {
                modelValue: l.value,
                "onUpdate:modelValue": n[0] || (n[0] = (s) => l.value = s),
                placeholder: "related_to",
                onKeydown: Ne(he(v, ["prevent"]), ["enter"])
              }, null, 8, ["modelValue", "onKeydown"])
            ]),
            h(r(Y), {
              label: "Add relation",
              severity: "secondary",
              disabled: !m.value,
              onClick: v,
              outlined: ""
            }, {
              icon: L(() => [
                h(r(Q), {
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
function Xu(e, a) {
  return e.parked ? "Stopped: " + (typeof e.error == "string" ? e.error : e.error?.message ?? "Projection is parked") : e.bootstrapping ? "Initializing" : e.last_seq >= a ? "Up to date" : "Catching up";
}
const Ju = {
  class: "work-stack",
  "aria-label": "Plugins editor"
}, Zu = { class: "work-section-heading" }, Qu = {
  key: 0,
  class: "kx-loading"
}, _u = {
  key: 1,
  class: "kx-err",
  role: "alert"
}, ec = {
  key: 2,
  class: "work-notice",
  role: "status"
}, tc = { class: "work-row" }, ac = {
  key: 0,
  class: "work-muted work-small"
}, lc = {
  key: 1,
  class: "kx-err"
}, oc = {
  key: 2,
  class: "work-notice"
}, ic = {
  key: 3,
  class: "work-stack work-tight work-plugin-status",
  role: "status"
}, nc = {
  key: 0,
  class: "kx-err"
}, sc = { class: "work-muted work-small" }, rc = { class: "work-form-actions" }, dc = {
  key: 0,
  class: "work-muted work-small"
}, Pl = /* @__PURE__ */ fe({
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
    const t = e, l = a, i = B({}), u = B(""), m = B(""), v = B(""), p = B(/* @__PURE__ */ new Set()), o = {};
    function n(T) {
      return t.schema.plugins?.find((P) => P.plugin === T);
    }
    function s(T) {
      return n(T)?.active === !0;
    }
    function b(T) {
      return n(T)?.lifecycle.state === "ready";
    }
    function f(T) {
      return t.draft.plugins?.some((P) => P.use === T) === !0;
    }
    function k(T, P) {
      const x = t.draft.plugins ?? [];
      P && !f(T) && (t.draft.plugins = [...x, { use: T }]), P || (t.draft.plugins = x.filter((D) => D.use !== T), delete t.configs[T], p.value.delete(T), l("validity", T, !0));
    }
    function $(T) {
      return s(T) ? i.value[T] ?? n(T)?.config ?? o : t.configs[T] ?? o;
    }
    function N(T, P) {
      s(T) ? i.value[T] = P : t.configs[T] = P;
    }
    function V(T, P) {
      P ? p.value.delete(T) : p.value.add(T), s(T) || l("validity", T, P);
    }
    async function A(T) {
      if (!(u.value || p.value.has(T))) {
        u.value = T, m.value = "", v.value = "";
        try {
          await wt.configure(t.boardId, T, $(T)), delete i.value[T], v.value = "Plugin configuration saved.", l("configured");
        } catch (P) {
          m.value = P instanceof Error ? P.message : "Could not configure plugin.";
        } finally {
          u.value = "";
        }
      }
    }
    return (T, P) => (c(), g("section", Ju, [
      d("header", Zu, [
        P[1] || (P[1] = d("div", null, [
          d("h2", null, "Plugins"),
          d("p", { class: "work-muted work-small" }, "Add capabilities from installed modules.")
        ], -1)),
        h(r(Y), {
          label: "Refresh status",
          severity: "secondary",
          outlined: "",
          disabled: !!u.value || e.disabled,
          onClick: P[0] || (P[0] = (x) => l("refresh"))
        }, {
          icon: L(() => [
            h(r(Q), {
              icon: "tabler:refresh",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        }, 8, ["disabled"])
      ]),
      P[5] || (P[5] = d("p", { class: "work-muted work-small" }, "Activation joins the schema draft and requires review. Active plugin configuration saves separately. Status reflects the last read; refresh to check progress.", -1)),
      e.options.length ? U("", !0) : (c(), g("p", Qu, "No installed plugins are visible to you.")),
      m.value ? (c(), g("div", _u, I(m.value), 1)) : U("", !0),
      v.value ? (c(), g("p", ec, I(v.value), 1)) : U("", !0),
      h(Da, {
        columns: "plugins",
        count: e.options.length
      }, {
        default: L(() => [
          (c(!0), g(X, null, te(e.options, (x) => (c(), q(Ta, {
            key: x.plugin,
            title: x.title || "Unavailable capability",
            description: x.description,
            kind: s(x.plugin) ? "Active" : f(x.plugin) ? "Pending review" : "Inactive",
            class: "work-stack"
          }, {
            actions: L(() => [
              P[3] || (P[3] = d("span", { class: "work-spacer" }, null, -1)),
              d("label", tc, [
                h(r(qe), {
                  "model-value": f(x.plugin),
                  disabled: !!u.value || e.disabled || e.activationLocked || !!x.problem,
                  "onUpdate:modelValue": (D) => k(x.plugin, D)
                }, null, 8, ["model-value", "disabled", "onUpdate:modelValue"]),
                P[2] || (P[2] = F("Activate on this board", -1))
              ])
            ]),
            default: L(() => [
              x.requires.length ? (c(), g("p", ac, "Requires " + I(x.requires.map((D) => e.options.find((E) => E.plugin === D)?.title || "Another capability").join(", ")), 1)) : U("", !0),
              x.problem ? (c(), g("p", lc, I(x.problem.message), 1)) : U("", !0),
              n(x.plugin)?.outdated ? (c(), g("p", oc, "The stored declaration differs from the installed plugin. Review activation to update it.")) : U("", !0),
              s(x.plugin) ? (c(), g("div", ic, [
                d("p", null, I(b(x.plugin) ? "Attachment configured" : n(x.plugin)?.lifecycle.state === "failed" ? "Configuration failed" : "Configuring attachment"), 1),
                n(x.plugin)?.lifecycle.error ? (c(), g("p", nc, I(n(x.plugin)?.lifecycle.error?.message), 1)) : U("", !0),
                (c(!0), g(X, null, te(n(x.plugin)?.projections, (D, E) => (c(), g("div", { key: E }, [
                  d("p", null, I(r(Xu)(D, e.schema.as_of)), 1),
                  d("p", sc, "Position " + I(D.last_seq) + " · Board head " + I(e.schema.as_of), 1)
                ]))), 128))
              ])) : U("", !0),
              !x.problem && (f(x.plugin) || s(x.plugin)) ? (c(), g(X, { key: 4 }, [
                h(ol, {
                  disabled: !!u.value || e.disabled,
                  schema: x.config_schema,
                  "model-value": $(x.plugin),
                  "onUpdate:modelValue": (D) => N(x.plugin, D),
                  onValidity: (D) => V(x.plugin, D)
                }, null, 8, ["disabled", "schema", "model-value", "onUpdate:modelValue", "onValidity"]),
                d("div", rc, [
                  h(r(Y), {
                    label: "Reset",
                    severity: "secondary",
                    outlined: "",
                    disabled: !!u.value || e.disabled,
                    onClick: (D) => N(x.plugin, s(x.plugin) ? r(kt)(n(x.plugin)?.config ?? {}) : {})
                  }, {
                    icon: L(() => [
                      h(r(Q), { icon: "tabler:restore" })
                    ]),
                    _: 1
                  }, 8, ["disabled", "onClick"]),
                  s(x.plugin) ? (c(), q(r(Y), {
                    key: 0,
                    label: "Save configuration",
                    disabled: !!u.value || e.disabled || p.value.has(x.plugin),
                    loading: u.value === x.plugin,
                    onClick: (D) => A(x.plugin)
                  }, {
                    icon: L(() => [
                      h(r(Q), {
                        icon: "tabler:device-floppy",
                        "aria-hidden": "true"
                      })
                    ]),
                    _: 1
                  }, 8, ["disabled", "loading", "onClick"])) : U("", !0)
                ]),
                s(x.plugin) ? U("", !0) : (c(), g("p", dc, "Initial configuration is included in Review and Apply."))
              ], 64)) : U("", !0)
            ]),
            _: 2
          }, 1032, ["title", "description", "kind"]))), 128))
        ]),
        _: 1
      }, 8, ["count"]),
      (c(!0), g(X, null, te(e.draft.plugins?.filter((x) => !e.options.some((D) => D.plugin === x.use)) ?? [], (x) => (c(), g("article", {
        key: x.use,
        class: "work-settings-card"
      }, [
        P[4] || (P[4] = d("p", null, "Unavailable plugin", -1)),
        h(r(Y), {
          label: "Deactivate plugin",
          severity: "secondary",
          onClick: (D) => k(x.use, !1),
          outlined: ""
        }, {
          icon: L(() => [
            h(r(Q), {
              icon: "tabler:trash",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        }, 8, ["onClick"])
      ]))), 128))
    ]));
  }
}), uc = {
  class: "work-stack",
  "aria-label": "Board visibility"
}, cc = { class: "work-stack work-tight" }, vc = {
  key: 0,
  class: "work-row"
}, mc = { class: "work-stack work-tight" }, fc = { class: "work-settings-list" }, pc = { class: "work-row-main" }, bc = { class: "work-small work-muted" }, hc = { class: "work-row-control" }, yc = { class: "work-row" }, gc = /* @__PURE__ */ fe({
  __name: "VisibilityEditor",
  props: {
    draft: {},
    boardId: {}
  },
  emits: ["validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, i = H(() => t.draft.visibility), u = H(() => (t.draft.fields ?? []).filter((s) => s.form === "text" && (!s.cardinality || s.cardinality === "one") && s.type !== "rollup" && s.index !== "number" && s.config?.case !== "insensitive")), m = B(""), v = H(() => u.value.find((s) => s.code === i.value?.field)?.type !== "option");
    function p() {
      !m.value || !i.value || i.value.levels.some((s) => s.id === m.value) || (i.value.levels.push({ id: m.value, holders: [] }), m.value = "");
    }
    function o(s) {
      if (!s) {
        delete t.draft.visibility;
        return;
      }
      const b = u.value.find((f) => f.code === s);
      t.draft.visibility = { field: s, levels: (b?.options ?? []).map((f) => ({ id: f.id, holders: [] })) };
    }
    function n(s, b) {
      const f = i.value?.levels.find((k) => k.id === s);
      f && (f.holders = b ?? []);
    }
    return (s, b) => (c(), g("section", uc, [
      b[10] || (b[10] = d("h3", { class: "work-group-title" }, "Board visibility", -1)),
      b[11] || (b[11] = d("p", { class: "work-small work-muted" }, "Restrict items by their visibility level. People still need access to the board.", -1)),
      d("label", cc, [
        b[7] || (b[7] = F("Visibility field", -1)),
        h(r(ae), {
          "aria-label": "Visibility field",
          placeholder: "No additional restriction",
          "model-value": i.value?.field ?? "",
          options: [{ label: "No additional restriction", value: "" }, ...u.value.map((f) => ({ label: r(Ge)(f), value: f.code }))],
          optionLabel: "label",
          optionValue: "value",
          appendTo: "self",
          "onUpdate:modelValue": b[0] || (b[0] = (f) => o(f))
        }, null, 8, ["model-value", "options"])
      ]),
      i.value ? (c(), g(X, { key: 0 }, [
        v.value ? (c(), g("div", vc, [
          d("label", mc, [
            b[8] || (b[8] = F("Level ID", -1)),
            h(r(ce), {
              modelValue: m.value,
              "onUpdate:modelValue": b[1] || (b[1] = (f) => m.value = f),
              "aria-label": "New visibility level",
              onKeydown: Ne(he(p, ["prevent"]), ["enter"])
            }, null, 8, ["modelValue", "onKeydown"])
          ]),
          h(r(Y), {
            label: "Add level",
            severity: "secondary",
            outlined: "",
            disabled: !m.value || i.value.levels.some((f) => f.id === m.value),
            onClick: p
          }, null, 8, ["disabled"])
        ])) : U("", !0),
        d("div", fc, [
          (c(!0), g(X, null, te(i.value.levels, (f, k) => (c(), g("div", {
            key: f.id,
            class: "work-settings-row"
          }, [
            d("div", pc, [
              d("strong", null, I(u.value.find(($) => $.code === i.value.field)?.options?.find(($) => $.id === f.id)?.label || f.id), 1),
              d("p", bc, "Level " + I(k + 1), 1)
            ]),
            d("div", hc, [
              h(Xl, {
                "board-id": e.boardId,
                label: "Who can see these items",
                "model-value": f.holders,
                "onUpdate:modelValue": ($) => n(f.id, $),
                onValidity: b[2] || (b[2] = ($) => l("validity", $))
              }, null, 8, ["board-id", "model-value", "onUpdate:modelValue"])
            ])
          ]))), 128))
        ]),
        d("label", yc, [
          h(r(qe), {
            "model-value": i.value.bypass === "admin",
            "onUpdate:modelValue": b[3] || (b[3] = (f) => f ? i.value.bypass = "admin" : delete i.value.bypass)
          }, null, 8, ["model-value"]),
          b[9] || (b[9] = F("Board administrators can see every level", -1))
        ]),
        h(r(Y), {
          label: "Remove visibility restriction",
          severity: "secondary",
          text: "",
          onClick: b[4] || (b[4] = (f) => delete e.draft.visibility)
        })
      ], 64)) : U("", !0),
      h(pt, {
        label: "Visibility rules",
        "model-value": i.value,
        shape: "object",
        example: { field: "visibility", levels: [{ id: "internal", holders: [] }], bypass: "admin" },
        "onUpdate:modelValue": b[5] || (b[5] = (f) => e.draft.visibility = f),
        onValidity: b[6] || (b[6] = (f) => l("validity", f))
      }, null, 8, ["model-value"])
    ]));
  }
}), kc = { class: "kx-head" }, wc = { class: "kx-head-icon" }, Vc = { class: "kx-head-text" }, $c = { class: "kx-title" }, xc = ["title"], Cc = { class: "kx-head-actions" }, Sc = /* @__PURE__ */ fe({
  __name: "PageHead",
  props: {
    title: {},
    subtitle: {},
    icon: { default: "tabler:layout-kanban" },
    backLabel: {}
  },
  emits: ["back"],
  setup(e) {
    return (a, t) => (c(), g("header", kc, [
      e.backLabel ? (c(), q(r(Y), {
        key: 0,
        "aria-label": e.backLabel,
        severity: "secondary",
        text: "",
        onClick: t[0] || (t[0] = (l) => a.$emit("back"))
      }, {
        default: L(() => [
          h(r(Q), {
            icon: "tabler:arrow-left",
            "aria-hidden": "true"
          })
        ]),
        _: 1
      }, 8, ["aria-label"])) : U("", !0),
      d("div", wc, [
        h(r(Q), {
          icon: e.icon,
          "aria-hidden": "true"
        }, null, 8, ["icon"])
      ]),
      d("div", Vc, [
        Ke(a.$slots, "identity", {}, () => [
          d("h1", $c, I(e.title), 1),
          e.subtitle ? (c(), g("p", {
            key: 0,
            class: "kx-head-sub",
            title: e.subtitle
          }, I(e.subtitle), 9, xc)) : U("", !0)
        ])
      ]),
      d("div", Cc, [
        Ke(a.$slots, "default")
      ])
    ]));
  }
}), Tc = { class: "work-board-identity work-stack work-tight" }, Dc = { class: "work-stack work-tight" }, Uc = { class: "work-stack work-tight" }, Ic = { class: "work-stack work-tight" }, Ec = ["value", "inert"], Ac = {
  key: 1,
  class: "work-muted work-small"
}, Pc = { class: "work-row" }, Rc = { class: "work-row" }, Nc = {
  key: 2,
  class: "work-identity-actions"
}, Oc = ["title"], Mc = {
  key: 2,
  class: "kx-err work-inline",
  role: "alert"
}, Fc = {
  key: 3,
  class: "work-muted work-small",
  role: "status"
}, Rl = /* @__PURE__ */ fe({
  __name: "BoardIdentity",
  props: {
    board: {},
    compact: { type: Boolean },
    detail: { type: Boolean },
    subtitle: {}
  },
  emits: ["saved", "dirty-change"],
  setup(e, { emit: a }) {
    const t = e, l = a, i = B(!1), u = B(""), m = B(""), v = B(""), p = B(!1), o = B(!1), n = B(""), s = B(""), b = H(() => t.board?.access?.admin === !0), f = B({ title: "", description: "", icon: "" });
    function k() {
      f.value = { title: t.board?.title ?? "", icon: t.board?.icon ?? "", description: t.board?.description ?? "" }, u.value = f.value.title, v.value = f.value.icon, m.value = f.value.description, n.value = "", s.value = "", i.value = !0, mt("wc-icon-picker").then((A) => p.value = A);
    }
    const $ = H(() => {
      const A = {};
      return u.value.trim() !== f.value.title && (A.title = u.value.trim()), m.value !== f.value.description && (A.description = m.value), v.value !== f.value.icon && (A.icon = v.value), A;
    });
    xe(b, (A) => {
      A || N();
    }), xe(() => i.value && Object.keys($.value).length > 0, (A) => l("dirty-change", A));
    function N() {
      i.value = !1, n.value = "";
    }
    async function V() {
      if (!b.value || !t.board || o.value || !u.value.trim()) return;
      const A = $.value;
      if (!Object.keys(A).length) {
        i.value = !1, s.value = "Nothing changed.";
        return;
      }
      o.value = !0, n.value = "";
      try {
        const T = await xt.updateBoard(t.board.board_id, A);
        i.value = !1, s.value = T.status === "unchanged" ? "Nothing changed." : "Board saved.", l("saved");
      } catch (T) {
        n.value = Gt(T, "Could not save the board.");
      } finally {
        o.value = !1;
      }
    }
    return (A, T) => (c(), g("div", Tc, [
      i.value ? (c(), g("form", {
        key: 0,
        class: "work-identity-edit",
        "aria-label": "Edit board",
        onClick: T[3] || (T[3] = he(() => {
        }, ["stop"])),
        onSubmit: he(V, ["prevent"])
      }, [
        d("label", Dc, [
          T[4] || (T[4] = F("Title", -1)),
          h(r(ce), {
            modelValue: u.value,
            "onUpdate:modelValue": T[0] || (T[0] = (P) => u.value = P),
            required: "",
            autofocus: "",
            disabled: o.value
          }, null, 8, ["modelValue", "disabled"])
        ]),
        d("label", Uc, [
          T[5] || (T[5] = F("Description", -1)),
          h(r(ya), {
            modelValue: m.value,
            "onUpdate:modelValue": T[1] || (T[1] = (P) => m.value = P),
            rows: "1",
            disabled: o.value
          }, null, 8, ["modelValue", "disabled"])
        ]),
        d("div", Ic, [
          T[6] || (T[6] = d("span", null, "Board icon", -1)),
          p.value ? (c(), g("wc-icon-picker", {
            key: 0,
            value: v.value,
            fallback: "tabler:layout-kanban",
            inert: o.value || void 0,
            onSelect: T[2] || (T[2] = (P) => v.value = P.detail)
          }, null, 40, Ec)) : (c(), g("p", Ac, "The icon picker is unavailable."))
        ]),
        d("div", Pc, [
          h(r(Y), {
            label: "Save",
            severity: "secondary",
            type: "submit",
            disabled: !u.value.trim() || o.value,
            loading: o.value,
            outlined: ""
          }, {
            icon: L(() => [
              h(r(Q), {
                icon: "tabler:device-floppy",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled", "loading"]),
          h(r(Y), {
            label: "Cancel",
            severity: "secondary",
            disabled: o.value,
            onClick: N,
            outlined: ""
          }, {
            icon: L(() => [
              h(r(Q), {
                icon: "tabler:x",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled"])
        ])
      ], 32)) : (c(), g(X, { key: 1 }, [
        d("div", Rc, [
          e.board?.icon ? (c(), q(r(Q), {
            key: 0,
            icon: e.board.icon,
            "aria-hidden": "true"
          }, null, 8, ["icon"])) : U("", !0),
          (c(), q(Ga(e.compact || e.detail ? "h2" : "h1"), {
            class: ft(e.detail ? "work-detail-title" : e.compact ? "kx-card-name" : "kx-title")
          }, {
            default: L(() => [
              F(I(e.board?.title || "Untitled board"), 1)
            ]),
            _: 1
          }, 8, ["class"])),
          e.compact ? Ke(A.$slots, "title-end", {}, void 0, void 0, 1) : U("", !0),
          e.compact ? (c(), g("span", Nc, [
            b.value ? (c(), q(r(Y), {
              key: 0,
              severity: "secondary",
              text: "",
              size: "small",
              onClick: he(k, ["stop"]),
              "aria-label": "Edit board"
            }, {
              default: L(() => [
                h(r(Q), {
                  icon: "tabler:pencil",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            })) : U("", !0),
            Ke(A.$slots, "actions")
          ])) : b.value ? (c(), q(r(Y), {
            key: 3,
            severity: "secondary",
            text: "",
            size: "small",
            onClick: he(k, ["stop"]),
            "aria-label": "Edit board"
          }, {
            default: L(() => [
              h(r(Q), {
                icon: "tabler:pencil",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          })) : U("", !0),
          e.compact ? U("", !0) : Ke(A.$slots, "title-end", {}, void 0, void 0, 4)
        ]),
        !e.compact && (e.subtitle || e.board?.description) ? (c(), g("p", {
          key: 0,
          class: "kx-head-sub",
          title: e.subtitle || e.board?.description
        }, I(e.subtitle || e.board?.description), 9, Oc)) : U("", !0)
      ], 64)),
      n.value ? (c(), g("p", Mc, I(n.value), 1)) : U("", !0),
      s.value ? (c(), g("p", Fc, I(s.value), 1)) : U("", !0)
    ]));
  }
}), Lc = {
  key: 0,
  class: "work-dirty"
}, Nl = /* @__PURE__ */ fe({
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
    return (a, t) => (c(), g(X, null, [
      e.dirty ? (c(), g("span", Lc, "Unsaved changes")) : U("", !0),
      h(r(Y), {
        label: "Discard",
        severity: "secondary",
        outlined: "",
        disabled: !e.dirty || e.busy || e.checkingRemoval,
        onClick: t[0] || (t[0] = (l) => a.$emit("discard"))
      }, {
        icon: L(() => [
          h(r(Q), { icon: "tabler:restore" })
        ]),
        _: 1
      }, 8, ["disabled"]),
      h(r(Y), {
        label: e.reviewed ? "Apply" : "Review changes",
        disabled: e.disabled,
        loading: e.busy,
        onClick: t[1] || (t[1] = (l) => a.$emit("primary"))
      }, null, 8, ["label", "disabled", "loading"])
    ], 64));
  }
}), zc = {
  key: 0,
  class: "work-detail-head"
}, Bc = {
  key: 0,
  class: "work-row work-wrap work-draft-actions"
}, jc = {
  key: 2,
  class: "kx-err",
  role: "alert"
}, qc = ["config"], Wc = /* @__PURE__ */ fe({
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
    const a = e, t = B(!1), l = B(!1), i = B("");
    async function u() {
      !a.authorized || !a.board || (i.value = "", l.value = await mt("kickside-share"), l.value ? t.value = !0 : i.value = "The sharing widget is unavailable. Try Share board again.");
    }
    xe(() => a.authorized, (o) => {
      o || (t.value = !1);
    });
    const m = H(() => JSON.stringify({ resource_id: a.board?.board_id, title: a.board?.title, access_url: `/api/v1/component-access/grants/${encodeURIComponent(a.board?.board_id ?? "")}`, share_url: `/api/v1/component-access/share/${encodeURIComponent(a.board?.board_id ?? "")}` })), v = H(() => a.pack ? `${a.packTitle} ${a.pack.version}${a.outdated ? " · Outdated" : ""}` : ""), p = H(() => "Settings · generation " + (a.generation ?? "…") + (v.value ? " · " + v.value : ""));
    return (o, n) => (c(), g(X, null, [
      e.embedded ? (c(), g("header", zc, [
        (c(), q(Rl, {
          key: e.board?.board_id,
          board: e.board,
          onDirtyChange: n[0] || (n[0] = (s) => o.$emit("metadata-dirty-change", s)),
          subtitle: v.value || void 0,
          detail: "",
          onSaved: n[1] || (n[1] = (s) => o.$emit("saved"))
        }, {
          "title-end": L(() => [
            h(r(Oe), {
              severity: "secondary",
              value: "Generation " + (e.generation ?? "…")
            }, null, 8, ["value"])
          ]),
          _: 1
        }, 8, ["board", "subtitle"])),
        e.authorized ? (c(), g("div", Bc, [
          e.authorized && e.outdated && e.pack ? (c(), q(r(Y), {
            key: 0,
            disabled: !e.canUpgrade,
            title: e.upgradeReason,
            label: "Upgrade pack",
            severity: "secondary",
            outlined: "",
            onClick: n[2] || (n[2] = (s) => o.$emit("upgrade"))
          }, {
            icon: L(() => [
              h(r(Q), { icon: "tabler:refresh" })
            ]),
            _: 1
          }, 8, ["disabled", "title"])) : U("", !0),
          e.authorized && e.board ? (c(), q(r(Y), {
            key: 1,
            label: "Share board",
            severity: "secondary",
            outlined: "",
            disabled: e.busy,
            onClick: u
          }, {
            icon: L(() => [
              h(r(Q), {
                icon: "tabler:share",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled"])) : U("", !0),
          e.authorized && !e.pack ? (c(), q(r(Y), {
            key: 2,
            label: "Install pack",
            severity: "secondary",
            outlined: "",
            disabled: e.busy || e.dirty,
            onClick: n[3] || (n[3] = (s) => o.$emit("install"))
          }, null, 8, ["disabled"])) : U("", !0),
          h(Nl, {
            dirty: e.dirty,
            busy: e.busy,
            "checking-removal": e.checkingRemoval,
            reviewed: e.reviewed,
            disabled: e.disabled,
            onDiscard: n[4] || (n[4] = (s) => o.$emit("discard")),
            onPrimary: n[5] || (n[5] = (s) => o.$emit("primary"))
          }, null, 8, ["dirty", "busy", "checking-removal", "reviewed", "disabled"])
        ])) : U("", !0)
      ])) : (c(), q(Sc, {
        key: 1,
        title: e.board?.title || "Board",
        subtitle: p.value,
        "back-label": "Back to board",
        icon: "tabler:adjustments",
        onBack: n[12] || (n[12] = (s) => o.$emit("back"))
      }, {
        identity: L(() => [
          (c(), q(Rl, {
            key: e.board?.board_id,
            board: e.board,
            onDirtyChange: n[6] || (n[6] = (s) => o.$emit("metadata-dirty-change", s)),
            subtitle: p.value,
            onSaved: n[7] || (n[7] = (s) => o.$emit("saved"))
          }, null, 8, ["board", "subtitle"]))
        ]),
        default: L(() => [
          e.authorized && e.outdated && e.pack ? (c(), q(r(Y), {
            key: 0,
            disabled: !e.canUpgrade,
            title: e.upgradeReason,
            label: "Upgrade pack",
            severity: "secondary",
            outlined: "",
            onClick: n[8] || (n[8] = (s) => o.$emit("upgrade"))
          }, {
            icon: L(() => [
              h(r(Q), { icon: "tabler:refresh" })
            ]),
            _: 1
          }, 8, ["disabled", "title"])) : U("", !0),
          e.authorized && e.board ? (c(), q(r(Y), {
            key: 1,
            label: "Share board",
            severity: "secondary",
            outlined: "",
            disabled: e.busy,
            onClick: u
          }, {
            icon: L(() => [
              h(r(Q), {
                icon: "tabler:share",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled"])) : U("", !0),
          e.authorized && !e.pack ? (c(), q(r(Y), {
            key: 2,
            label: "Install pack",
            severity: "secondary",
            outlined: "",
            disabled: e.busy || e.dirty,
            onClick: n[9] || (n[9] = (s) => o.$emit("install"))
          }, null, 8, ["disabled"])) : U("", !0),
          e.authorized ? (c(), q(Nl, {
            key: 3,
            dirty: e.dirty,
            busy: e.busy,
            "checking-removal": e.checkingRemoval,
            reviewed: e.reviewed,
            disabled: e.disabled,
            onDiscard: n[10] || (n[10] = (s) => o.$emit("discard")),
            onPrimary: n[11] || (n[11] = (s) => o.$emit("primary"))
          }, null, 8, ["dirty", "busy", "checking-removal", "reviewed", "disabled"])) : U("", !0)
        ]),
        _: 1
      }, 8, ["title", "subtitle"])),
      i.value ? (c(), g("p", jc, I(i.value), 1)) : U("", !0),
      t.value && l.value && e.authorized ? (c(), g("kickside-share", {
        key: 3,
        config: m.value,
        onClose: n[13] || (n[13] = (s) => t.value = !1),
        onChanged: n[14] || (n[14] = (s) => o.$emit("saved"))
      }, null, 40, qc)) : U("", !0)
    ], 64));
  }
}), Ie = (e, a) => `${e} → ${a}`, Ol = (e, a) => {
  const t = e.fields?.find((l) => l.code === a);
  return t ? Ge(t) : "Untitled field";
}, Ml = {
  comments_per_item: "Comments per item",
  stage_timeout: "Default attempt timeout",
  stage_max_visits: "Default maximum visits",
  audit: "Audit trail",
  audit_days: "Audit history",
  trash_days: "Keep trashed items",
  tombstone_days: "Keep deletion records",
  interval_days: "Keep state history"
};
function Fl(e, a) {
  if (a === void 0) return "Application default";
  if (e === "audit") return ye(String(a));
  if (e === "stage_timeout") {
    const t = Jt(String(a));
    if (t) return `${t.amount.toLocaleString()} ${t.amount === 1 ? t.unit.slice(0, -1) : t.unit}`;
  }
  if (e.endsWith("_days")) {
    const t = a === 0 && (e === "audit_days" || e === "interval_days") ? 365 : a;
    return `${t} ${t === 1 ? "day" : "days"}`;
  }
  return String(a);
}
function Kc(e, a) {
  const t = e.policy ?? {}, l = a.policy ?? {}, i = Object.keys(Ml).flatMap((v) => t[v] === l[v] ? [] : [`${Ml[v]} · ${Ie(Fl(v, t[v]), Fl(v, l[v]))}`]), u = (v) => v ? `${v.limit}${v.hard ? " (hard limit)" : ""}` : "No limit", m = /* @__PURE__ */ new Set([...Object.keys(t.wip ?? {}), ...Object.keys(l.wip ?? {})]);
  for (const v of m) {
    const p = u(t.wip?.[v]), o = u(l.wip?.[v]);
    if (p === o) continue;
    const n = (a.processes ?? []).flatMap((s) => s.states).find((s) => s.id === v) ?? (e.processes ?? []).flatMap((s) => s.states).find((s) => s.id === v);
    i.push(`${ue(n)} limit · ${Ie(p, o)}`);
  }
  return i;
}
function Gc(e, a, t) {
  const l = e.visibility, i = a.visibility, u = [];
  l?.field !== i?.field && u.push(Ie(
    l ? Ol(e, l.field) : "No additional restriction",
    i ? Ol(a, i.field) : "No additional restriction"
  ));
  const m = l?.levels ?? [], v = i?.levels ?? [], p = new Set([...m, ...v].map((o) => o.id));
  for (const o of p) {
    const n = m.find(($) => $.id === o), s = v.find(($) => $.id === o);
    if (n && s && JSON.stringify(n.holders) === JSON.stringify(s.holders)) continue;
    const b = ($) => $.fields?.find((N) => N.code === $.visibility?.field)?.options?.find((N) => N.id === o)?.label, f = b(a) || b(e) || ye(o), k = ($) => $ ? $.holders.map(t).join(", ") || "No extra access" : "No level";
    u.push(`${f} · ${Ie(k(n), k(s))}`);
  }
  return l?.bypass !== i?.bypass && u.push(i?.bypass === "admin" ? "Board administrators can see every level." : "Visibility levels now apply to board administrators."), u;
}
const Zt = {
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
function Hc(e, a, t) {
  const { what: l, detail: i, to: u } = e, v = `${t?.name || a?.name || "Untitled process"} · ${Zt[l] ?? "Process changed"}`, p = l.startsWith("state.") ? a?.states.find((f) => f.id === i) : void 0, o = l.startsWith("state.") ? t?.states.find((f) => f.id === i) : void 0, n = l.startsWith("transition.") ? a?.transitions?.find((f) => f.id === i) : void 0, s = l.startsWith("transition.") ? t?.transitions?.find((f) => f.id === i) : void 0;
  let b = "";
  return l === "state.map" ? b = Ie(ue(p), ue(t?.states.find((f) => f.id === u))) : l === "state.name" ? b = Ie(ue(p), ue(o)) : l === "state.kind" ? b = `${ue(o)} · ${Ie(ha(p?.kind), ha(o?.kind))}` : l === "state.category" && p && o ? b = `${ue(o)} · ${Ie(Tt(p.category), Tt(o.category))}` : o || p ? b = ue(o ?? p) : l === "transition.name" && n && s ? b = Ie(Pe(n), Pe(s)) : s ? b = Pe(s) : n ? b = Pe(n) : l === "initial" ? b = Ie(ue(a?.states.find((f) => f.id === a.initial)), ue(t?.states.find((f) => f.id === t.initial))) : l === "name" && (b = Ie(a?.name || "Untitled process", t?.name || "Untitled process")), { title: v, details: b ? [b] : [] };
}
function Yc(e, a, t, l) {
  const { code: i, what: u, detail: m } = e;
  if (i === "schema" || u === "visibility.remove")
    return u === "policy" ? { title: "Board policy", details: Kc(a, t) } : u.startsWith("visibility") ? { title: "Board visibility", details: Gc(a, t, l) } : u === "key_prefix" ? { title: "Item key prefix", details: [Ie(a.key_prefix ?? "Default", t.key_prefix ?? "Default")] } : { title: { plugins: "Board plugins changed", scopes: "Saved query filters changed", "rollup.recompute": "Calculated totals will update" }[u] ?? "Board settings changed", details: [] };
  if (i.startsWith("process ")) {
    const s = i.slice(8);
    return Hc(e, a.processes?.find((b) => b.id === s), t.processes?.find((b) => b.id === s));
  }
  if (i.startsWith("item_type ")) {
    const s = i.slice(10), b = a.item_types?.find(($) => $.id === s), f = t.item_types?.find(($) => $.id === s);
    return { title: `${f?.title || b?.title || "Item type"} · ${Zt[u] ?? "Item type changed"}`, details: u === "title" ? [Ie(b?.title || "Untitled item type", f?.title || "Untitled item type")] : [] };
  }
  if (i.startsWith("relation ")) {
    const s = i.slice(9), b = a.relation_types?.find(($) => $.id === s), f = t.relation_types?.find(($) => $.id === s), k = u === "label" ? [Ie([b?.outward, b?.inward].filter(Boolean).join(" / "), [f?.outward, f?.inward].filter(Boolean).join(" / "))] : [];
    return { title: `${f?.outward || b?.outward || "Relation type"} · ${Zt[u] ?? "Relation type changed"}`, details: k };
  }
  const v = t.fields?.find((s) => s.code === i), p = a.fields?.find((s) => v?.id !== void 0 ? s.id === v.id : s.code === (u.startsWith("renamed from ") ? u.slice(13) : i)), o = v ?? p;
  if (!o) return { title: Zt[u] ?? "Board settings changed", details: [] };
  const n = `${Ge(o)} · ${u.startsWith("renamed from ") ? "Field key" : Zt[u] ?? "Field settings changed"}`;
  if (u.startsWith("options.")) {
    const s = p?.options?.find(($) => $.id === m), b = v?.options?.find(($) => $.id === m), f = b?.label || s?.label || "Untitled choice", k = u === "options.change" ? [] : [f];
    return s && b && (s.label !== b.label && k.push(Ie(s.label || "Untitled choice", b.label || "Untitled choice")), s.category !== b.category && k.push(`Category · ${Ie(s.category ? Tt(s.category) : "None", b.category ? Tt(b.category) : "None")}`), s.order !== b.order && k.push(`Order · ${Ie(s.order ?? "Default", b.order ?? "Default")}`), s.color !== b.color && k.push(`Color · ${Ie(s.color ?? "Default", b.color ?? "Default")}`)), { title: n, details: k };
  }
  return u === "title" && p && v ? { title: n, details: [Ie(Ge(p), Ge(v))] } : { title: n, details: [] };
}
const Xc = {
  key: 0,
  class: "work-settings-card work-schema-plan work-stack",
  "aria-label": "Schema review"
}, Jc = { key: 0 }, Zc = { class: "work-row work-wrap" }, Qc = { class: "work-muted work-small" }, _c = { class: "work-muted" }, ev = {
  key: 0,
  class: "work-notice"
}, tv = {
  key: 1,
  class: "work-notice"
}, av = {
  key: 2,
  class: "work-stack work-tight",
  "aria-label": "Reviewed Flow bindings"
}, lv = { key: 3 }, ov = {
  key: 4,
  class: "work-settings-table"
}, iv = { key: 0 }, nv = /* @__PURE__ */ fe({
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
    const a = e, t = {}, l = H(() => a.original ?? t), i = H(() => a.declaration ?? t), u = H(() => (i.value.processes ?? []).flatMap((V) => V.states.flatMap((A) => {
      const T = A.run?.flow_ref;
      return T ? [{ key: V.id + ":" + A.id, process: V.name || "Untitled process", state: ue(A), reference: T }] : [];
    }))), m = B(/* @__PURE__ */ new Map());
    xe(u, async (V, A, T) => {
      const P = /* @__PURE__ */ new Map();
      m.value = P;
      let x = !0;
      T(() => x = !1), await Promise.all([...new Set(V.map((D) => D.reference.id))].map(async (D) => {
        try {
          const E = (await el.title(D))?.trim();
          x && E && !Mo(E) && m.value.set(D, E);
        } catch {
          x && m.value.set(D, "Flow title unavailable");
        }
      }));
    }, { immediate: !0 });
    const v = H(() => [l.value, i.value].flatMap((V) => (V.visibility?.levels ?? []).flatMap((A) => A.holders.flatMap((T) => "group" in T ? [{ kind: "group", id: T.group }] : "user" in T ? [{ kind: "user", id: T.user }] : [])))), p = Fo(() => a.boardId ?? "", v);
    function o(V) {
      if ("user" in V) return p.label({ kind: "user", id: V.user });
      if ("group" in V) return p.label({ kind: "group", id: V.group });
      if ("field" in V) {
        const A = i.value.fields?.find((T) => T.code === V.field) ?? l.value.fields?.find((T) => T.code === V.field);
        return A ? Ge(A) : "People from a field";
      }
      return "Service";
    }
    const n = (V) => V.map((A) => ({ change: A, ...Yc(A, l.value, i.value, o) })), s = H(() => n(a.plan?.changes.filter((V) => V.class !== "refused") ?? [])), b = H(() => n(a.plan?.refused ?? [])), f = {
      unchanged: ["No changes", "secondary"],
      cosmetic: ["Labels or settings", "secondary"],
      additive: ["New definitions", "success"],
      semantic: ["Affects existing items", "warn"],
      refused: ["Blocked", "danger"],
      initial: ["First setup", "secondary"]
    }, k = (V) => f[V]?.[0] ?? "Review needed", $ = (V) => f[V]?.[1] ?? "secondary";
    function N(V) {
      const { detail: A, ...T } = V;
      return Sa(V.what === "invalid" || V.what.startsWith("views.") || V.what.startsWith("automation") ? V : T);
    }
    return (V, A) => e.plan ? (c(), g("section", Xc, [
      !e.plan.changes.length && !e.plan.refused.length && !e.configCount && !e.packReview ? (c(), g("p", Jc, "No changes to apply.")) : (c(), g(X, { key: 1 }, [
        d("header", Zc, [
          A[0] || (A[0] = d("h2", null, "Review", -1)),
          h(r(Oe), {
            class: "kx-tag-sm",
            severity: $(e.plan.class)
          }, {
            default: L(() => [
              F(I(k(e.plan.class)), 1)
            ]),
            _: 1
          }, 8, ["severity"]),
          d("span", Qc, "Generation " + I(e.generation) + " → " + I(e.plan.generation), 1)
        ]),
        d("p", _c, I(r(Lo)[e.plan.class] || "Review the changes below."), 1),
        e.plan.migration ? (c(), g("p", ev, I(e.plan.migration), 1)) : e.follows.length ? (c(), g("p", tv, "Existing items in " + I(e.follows.join(", ")) + " will move to the updated process using the state choices above.", 1)) : U("", !0),
        u.value.length ? (c(), g("section", av, [
          A[1] || (A[1] = d("h3", null, "Flow bindings", -1)),
          (c(!0), g(X, null, te(u.value, (T) => (c(), g("p", {
            key: T.key
          }, [
            F(I(T.process) + " / " + I(T.state) + " · ", 1),
            d("strong", null, I(m.value.get(T.reference.id) ?? "Published Flow") + " · v" + I(T.reference.version), 1)
          ]))), 128)),
          A[2] || (A[2] = d("p", { class: "work-muted work-small" }, "New entries use these exact published versions. Before replacing a binding, stop new entries, let existing runs and deliveries finish, pause the old launcher, save, then resume entries.", -1))
        ])) : U("", !0),
        Ke(V.$slots, "default"),
        b.value.length ? (c(), g("h3", lv, "Blocked changes")) : U("", !0),
        (c(!0), g(X, null, te(b.value, (T, P) => (c(), q(r(_o), {
          key: P,
          severity: "error",
          role: "alert"
        }, {
          default: L(() => [
            d("strong", null, I(T.title), 1),
            (c(!0), g(X, null, te(T.details, (x, D) => (c(), g("p", { key: D }, I(x), 1))), 128)),
            d("p", null, I(N(T.change)), 1)
          ]),
          _: 2
        }, 1024))), 128)),
        s.value.length ? (c(), g("table", ov, [
          A[3] || (A[3] = d("thead", null, [
            d("tr", null, [
              d("th", { scope: "col" }, "Change"),
              d("th", { scope: "col" }, "Impact")
            ])
          ], -1)),
          d("tbody", null, [
            (c(!0), g(X, null, te(s.value, (T, P) => (c(), g("tr", { key: P }, [
              d("td", null, [
                d("strong", null, I(T.title), 1),
                (c(!0), g(X, null, te(T.details, (x, D) => (c(), g("p", { key: D }, I(x), 1))), 128)),
                T.change.count ? (c(), g("p", iv, I(T.change.count) + " " + I(T.change.count === 1 ? "item" : "items"), 1)) : U("", !0)
              ]),
              d("td", null, [
                h(r(Oe), {
                  class: "kx-tag-sm",
                  severity: $(T.change.class)
                }, {
                  default: L(() => [
                    F(I(k(T.change.class)), 1)
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
}), sv = {
  key: 0,
  class: "work-stack",
  "aria-label": "Pack conflicts"
}, rv = { class: "work-stack work-tight work-pack-review-field" }, dv = { class: "work-json-disclosure" }, uv = { class: "work-config-fields" }, cv = { class: "work-json-example" }, vv = { class: "work-json-example" }, mv = {
  key: 1,
  class: "work-stack",
  "aria-label": "Pack state maps"
}, fv = /* @__PURE__ */ fe({
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
      return t.original.processes?.find((n) => n.id === o)?.name || ye(o);
    }
    function u(o) {
      const [n, ...s] = o.split("."), b = s.join(".");
      return n === "processes" ? i(b) : n === "fields" ? t.original.fields?.find((f) => f.code === b)?.title || ye(b) : n === "item_types" ? t.original.item_types?.find((f) => f.id === b)?.title || ye(b) : ye(n);
    }
    function m(o) {
      return JSON.stringify(o ?? null, null, 2);
    }
    function v(o, n) {
      (t.request.resolutions ??= {})[o] = n, l("change");
    }
    function p(o, n, s) {
      ((t.request.maps ??= {})[o] ??= {})[n] = s, l("change");
    }
    return (o, n) => (c(), g(X, null, [
      e.plan.conflicts.length ? (c(), g("section", sv, [
        n[3] || (n[3] = d("h3", null, "Local edits conflict", -1)),
        n[4] || (n[4] = d("p", { class: "work-muted work-small" }, "Choose which declaration to keep for each conflict, then review again.", -1)),
        (c(!0), g(X, null, te(e.plan.conflicts, (s) => (c(), g("div", {
          key: s.path,
          class: "work-stack work-tight"
        }, [
          d("label", rv, [
            F(I(u(s.path)), 1),
            h(r(ae), {
              "model-value": e.request.resolutions?.[s.path],
              "aria-label": "Resolution for " + u(s.path),
              disabled: e.disabled,
              appendTo: "self",
              placeholder: "Choose a resolution",
              optionLabel: "label",
              optionValue: "value",
              options: [{ label: "Keep local edits", value: "local" }, { label: "Use pack changes", value: "incoming" }],
              "onUpdate:modelValue": (b) => v(s.path, b)
            }, null, 8, ["model-value", "aria-label", "disabled", "onUpdate:modelValue"])
          ]),
          d("details", dv, [
            n[2] || (n[2] = d("summary", null, "Compare declarations", -1)),
            d("div", uv, [
              d("section", null, [
                n[0] || (n[0] = d("h4", null, "Local edits", -1)),
                d("pre", cv, I(m(s.local_value)), 1)
              ]),
              d("section", null, [
                n[1] || (n[1] = d("h4", null, "Pack changes", -1)),
                d("pre", vv, I(m(s.incoming)), 1)
              ])
            ])
          ])
        ]))), 128))
      ])) : U("", !0),
      Object.keys(e.plan.maps).length ? (c(), g("section", mv, [
        n[5] || (n[5] = d("h3", null, "Required state maps", -1)),
        n[6] || (n[6] = d("p", { class: "work-muted work-small" }, "Review the proposed destinations for existing items. Each destination is editable.", -1)),
        (c(!0), g(X, null, te(e.plan.maps, (s, b) => (c(), g("div", {
          key: b,
          class: "work-stack"
        }, [
          d("h4", null, I(i(b)), 1),
          (c(!0), g(X, null, te(s, (f, k) => (c(), g("label", {
            key: k,
            class: "work-stack work-tight work-pack-review-field"
          }, [
            F("Move items from " + I(r(ue)(e.original.processes?.find(($) => $.id === b)?.states.find(($) => $.id === k))), 1),
            h(r(ae), {
              "model-value": e.request.maps?.[b]?.[k],
              "aria-label": "Move items from " + r(ue)(e.original.processes?.find(($) => $.id === b)?.states.find(($) => $.id === k)),
              disabled: e.disabled,
              appendTo: "self",
              optionLabel: "label",
              optionValue: "value",
              options: e.plan.declaration.processes?.find(($) => $.id === b)?.states.map(($) => ({ label: r(ue)($), value: $.id })) ?? [],
              "onUpdate:modelValue": ($) => p(b, k, $)
            }, null, 8, ["model-value", "aria-label", "disabled", "options", "onUpdate:modelValue"])
          ]))), 128))
        ]))), 128))
      ])) : U("", !0)
    ], 64));
  }
}), pv = {
  key: 0,
  class: "work-settings-tabs"
}, bv = { class: "work-section-navigation" }, hv = {
  key: 1,
  class: "kx-err",
  role: "alert"
}, yv = {
  key: 2,
  class: "kx-err",
  role: "alert"
}, gv = {
  key: 3,
  class: "work-notice",
  role: "status"
}, kv = {
  key: 4,
  class: "kx-loading",
  role: "status"
}, wv = {
  key: 5,
  class: "work-notice",
  role: "alert"
}, Vv = {
  key: 6,
  class: "work-settings-content work-pane"
}, $v = {
  key: 0,
  class: "work-notice",
  role: "alert"
}, xv = {
  key: 1,
  class: "work-notice"
}, Cv = { key: 0 }, Sv = ["disabled", "inert"], Tv = {
  key: 6,
  class: "work-settings-card work-stack"
}, Dv = {
  key: 5,
  class: "kx-empty"
}, Uv = {
  key: 6,
  class: "work-muted work-small",
  role: "status"
}, Iv = { class: "work-stack work-tight" }, Ev = {
  key: 0,
  class: "work-muted"
}, Av = { class: "work-dialog-actions" }, Pv = /* @__PURE__ */ fe({
  __name: "BoardSettings",
  props: {
    boardId: {},
    embedded: { type: Boolean }
  },
  emits: ["dirty-change"],
  setup(e, { emit: a }) {
    const t = e, l = a, i = ai();
    let u, m = "";
    const v = () => JSON.stringify([w.value, V.value, j.value, [...Ve.value]]), p = ["Fields", "Item types", "Process", "Policy", "Relation types", "Plugins", "Review"], o = B("Fields"), n = B(!1), s = B(""), b = B(/* @__PURE__ */ new Set(["Fields"]));
    xe(o, (_) => b.value.add(_));
    const f = B(), k = B(), $ = B(), N = B({}), V = B({}), A = B(), T = B(!1), P = B(!0), x = B(!1), D = B(""), E = B(""), le = B(""), z = B([]), j = B(), O = B(), ne = B(), C = B(), R = B(), M = B(""), Z = B([]), ve = H(() => [...Z.value, ...C.value?.refused ?? []]), be = B(!1), ge = B(0), Ve = B(/* @__PURE__ */ new Set()), Ee = B(), y = Ya(), S = Ya(), w = H(() => hl(N.value, f.value?.declaration ?? {})), K = H(() => Ve.value.size > 0 || !!j.value || !!f.value && (JSON.stringify(w.value) !== JSON.stringify(f.value.declaration) || Object.keys(V.value).length > 0)), J = B(!1), re = H(() => K.value || J.value);
    xe(re, (_) => l("dirty-change", _), { immediate: !0, flush: "sync" });
    const de = H(() => !!f.value && !!k.value && f.value.generation !== k.value.generation), De = H(() => T.value && !x.value && !be.value && !Ut.value && !de.value && !Ve.value.size && C.value && (C.value.changes.length > 0 || Object.keys(V.value).length > 0) && C.value.class !== "refused" && !C.value.refused.length && R.value?.matches(w.value, f.value?.generation ?? -1, V.value)), Me = H(() => z.value.find((_) => _.id === j.value?.pack)?.plugins.filter((_) => !f.value?.plugins?.some((W) => W.plugin === _.plugin && W.active)).map((_) => ({ use: _.plugin })) ?? []), Ue = H(() => !!ne.value && JSON.stringify(ne.value) === JSON.stringify(j.value)), nt = H(() => j.value ? T.value && !x.value && !Ve.value.size && !de.value && !Ut.value && Ue.value && C.value?.class !== "refused" && !C.value?.refused.length && O.value?.conflicts.every((_) => !!j.value?.resolutions?.[_.path]) : De.value), at = H(() => !!C.value && (!j.value || Ue.value)), Ia = H(() => z.value.find((_) => _.id === f.value?.pack?.id)?.title || "Installed pack"), He = H(() => !le.value && !!f.value?.outdated && !!z.value.find((_) => _.id === f.value?.pack?.id)), na = H(() => le.value ? "Reload packs to check available upgrades." : He.value ? K.value ? "Discard the current draft before upgrading." : Ut.value ? "Finish the current migration before upgrading." : x.value ? "Wait for the current request to finish." : void 0 : "Install an available version of this pack to upgrade.");
    function Dt() {
      j.value = void 0, O.value = void 0, ne.value = void 0;
    }
    async function vo() {
      if (!f.value?.pack || x.value || K.value) return;
      const _ = z.value.find((W) => W.id === f.value.pack.id);
      _ && (j.value = yl(_, f.value.generation), o.value = "Review", await Ea());
    }
    async function mo() {
      const _ = z.value.find((W) => W.id === s.value);
      !f.value || !_ || _.plugins.some((W) => !W.installed) || x.value || K.value || (j.value = yl(_, f.value.generation), n.value = !1, o.value = "Review", await Ea());
    }
    async function Ea() {
      if (!j.value || x.value || !T.value || de.value || Ve.value.size) return;
      const _ = S(), W = kt(j.value), ee = JSON.stringify(j.value);
      x.value = !0, D.value = "", E.value = "";
      try {
        const ke = await Bo(W, (Et) => wt.packPlan(t.boardId, Et));
        if (!_() || ee !== JSON.stringify(j.value)) return;
        O.value = ke.plan, C.value = ke.plan, j.value = ke.request, ne.value = kt(j.value), M.value = crypto.randomUUID(), o.value = "Review";
      } catch (ke) {
        _() && (ne.value = void 0, D.value = Gt(ke, "Could not plan the pack upgrade."));
      } finally {
        x.value = !1;
      }
    }
    const vl = H(() => O.value?.declaration ?? R.value?.declaration), fo = H(() => {
      const _ = vl.value;
      return !C.value || !_ ? [] : zo(C.value, _).map((W) => _.processes?.find((ee) => ee.id === W)?.name || "Untitled process");
    }), Ut = H(() => !!k.value?.migration_error || $.value?.status === "migrating");
    function st() {
      Z.value = [], S(), C.value = void 0, R.value = void 0, ne.value = void 0, M.value = "";
    }
    xe([w, V], st, { deep: !0, flush: "sync" }), xe(V, (_) => {
      j.value && (Object.keys(_).length ? j.value.plugin_configs = kt(_) : delete j.value.plugin_configs);
    }, { deep: !0, flush: "sync" });
    function It(_, W) {
      W ? Ve.value.delete(_) : Ve.value.add(_), st();
    }
    function Aa(_) {
      Dt(), ge.value++, f.value = _, N.value = kt(_.declaration), V.value = {}, Ve.value.clear(), st();
    }
    async function Qe(_ = !1) {
      const W = y();
      try {
        const [ee, ke, Et] = await Promise.all([xt.schema(t.boardId, void 0, !0).catch((rt) => {
          if (rt instanceof gl && rt.details?.code === "board_schema_missing") return { generation: 0, declaration: {}, compiled: {}, key_prefix: "", as_of: 0 };
          throw rt;
        }), xt.options(t.boardId), xt.boards()]);
        if (!W()) return;
        if (T.value = ke.access.admin, A.value = ke, $.value = Et.find((rt) => rt.board_id === t.boardId), !T.value) {
          f.value = void 0, N.value = {}, st();
          return;
        }
        D.value = "";
        const Ye = jo(ee);
        k.value = Ye, u !== void 0 && Ye.generation >= u ? (u = void 0, m === v() && Aa(Ye), m = "") : (_ || !f.value || !K.value && Ye.generation !== f.value.generation) && Aa(Ye), de.value && st(), await ml(W);
      } catch (ee) {
        if (!W()) return;
        ee instanceof gl && (ee.status === 403 || ee.kind?.toLowerCase() === "permission_denied") && (T.value = !1), st(), D.value = ee instanceof Error ? ee.message : "Could not load board settings.";
      } finally {
        W() && (P.value = !1);
      }
    }
    async function ml(_ = () => !0) {
      le.value = "";
      try {
        const W = await xt.packs();
        _() && (z.value = W.filter(qo));
      } catch (W) {
        _() && (le.value = W instanceof Error ? W.message : "Could not load packs.");
      }
    }
    function po() {
      for (const _ of Ee.value?.querySelectorAll("input, select, textarea") ?? [])
        if (!(_.form !== Ee.value || _.closest('[style*="display: none"]')) && !_.reportValidity())
          return !1;
      return !0;
    }
    function bo(_) {
      o.value = _, _ === "Review" && !C.value && Pa();
    }
    async function Pa() {
      if (j.value) return Ea();
      if (!f.value || x.value || !T.value || de.value || Ve.value.size || !po()) return;
      const _ = S(), W = kl(w.value, f.value.generation, V.value);
      x.value = !0, D.value = "", E.value = "";
      try {
        const ee = await wt.plan(t.boardId, W);
        if (!_() || Ve.value.size || !W.matches(w.value, f.value.generation, V.value)) return;
        C.value = ee, R.value = W, M.value = crypto.randomUUID(), o.value = "Review";
      } catch (ee) {
        _() && (st(), D.value = Gt(ee, "Could not review changes."), Z.value = Wo(ee, w.value));
      } finally {
        x.value = !1;
      }
    }
    async function ho() {
      if (!nt.value) return;
      if (j.value && ne.value) {
        x.value = !0, D.value = "";
        const W = v();
        try {
          const ee = await wt.packApply(t.boardId, kt(ne.value), M.value);
          u = ee.generation, m = W, await Qe(), E.value = ee.status === "done" ? `Pack applied at generation ${ee.generation}.` : "Pack installation continues in the background.";
        } catch (ee) {
          D.value = Gt(ee, "Could not apply the pack upgrade.");
        } finally {
          x.value = !1;
        }
        return;
      }
      if (!R.value) return;
      x.value = !0, D.value = "", E.value = "";
      const _ = v();
      try {
        const W = await wt.apply(t.boardId, R.value, M.value);
        u = W.generation, m = _, await Qe(), E.value = `Applied generation ${W.generation} (${W.class}).`;
      } catch (W) {
        D.value = Gt(W, "Could not apply schema.");
      } finally {
        x.value = !1;
      }
    }
    async function yo() {
      if (!x.value) {
        x.value = !0, D.value = "";
        try {
          const _ = await wt.resume(t.boardId);
          E.value = _.resumed ? "Migration resumes." : "Migration is already running.", await Qe();
        } catch (_) {
          D.value = _ instanceof Error ? _.message : "Could not resume migration.";
        } finally {
          x.value = !1;
        }
      }
    }
    async function sa(_, W) {
      if (!f.value || !T.value || x.value || be.value) return "Wait for the current change to finish.";
      if (de.value) return "Discard the stale draft before removing a definition.";
      const ee = f.value.generation, ke = JSON.stringify(w.value), Et = kt(N.value);
      la(Et, _, W), be.value = !0;
      try {
        const Ye = await wt.plan(t.boardId, kl(hl(Et, f.value.declaration), ee, V.value));
        if (!T.value || de.value || f.value.generation !== ee || JSON.stringify(w.value) !== ke) return "The draft changes during the check. Try the removal again.";
        const rt = Ko(Ye, _, W);
        if (rt) return rt;
        if (Ye.class === "refused") return "Resolve the refused draft changes in Review before removing this definition.";
      } catch (Ye) {
        return Ye instanceof Error ? Ye.message : "Could not check this removal.";
      } finally {
        be.value = !1;
      }
    }
    async function go() {
      re.value && !await Yo.confirm({ header: "Discard changes?", message: "Your unsaved board settings will be discarded.", acceptLabel: "Discard", rejectLabel: "Keep editing" }) || i({ name: "board", board: t.boardId });
    }
    function ko() {
      u = void 0, k.value && Aa(k.value), E.value = "", D.value = "";
    }
    xe(() => t.boardId, () => {
      J.value = !1, u = void 0, Dt(), z.value = [], f.value = void 0, k.value = void 0, $.value = void 0, V.value = {}, Ve.value.clear(), b.value = /* @__PURE__ */ new Set(["Fields"]), o.value = "Fields", T.value = !1, P.value = !0, Qe(!0);
    });
    let Ra = () => {
    };
    return xe(() => t.boardId, (_) => {
      Ra(), Ra = Ho(`component.${_}`, () => {
        Qe();
      });
    }, { immediate: !0 }), So(Qe), Ll(() => {
      Ra(), y(), S();
    }), (_, W) => (c(), g("section", {
      class: ft(["work-settings-shell", { "work-embedded": e.embedded }])
    }, [
      h(Wc, {
        board: $.value,
        embedded: e.embedded,
        generation: f.value?.generation,
        authorized: T.value,
        dirty: K.value,
        busy: x.value,
        "checking-removal": be.value,
        reviewed: at.value,
        pack: f.value?.pack,
        "pack-title": Ia.value,
        outdated: f.value?.outdated,
        "upgrade-reason": na.value,
        "can-upgrade": He.value && !K.value && !x.value && !Ut.value && T.value,
        onUpgrade: vo,
        onInstall: W[0] || (W[0] = (ee) => n.value = !0),
        disabled: !K.value || x.value || be.value || Ut.value || de.value || !!Ve.value.size || at.value && !nt.value,
        onBack: go,
        onDiscard: ko,
        onPrimary: W[1] || (W[1] = (ee) => at.value ? ho() : Pa()),
        onSaved: W[2] || (W[2] = (ee) => Qe()),
        onMetadataDirtyChange: W[3] || (W[3] = (ee) => J.value = ee)
      }, null, 8, ["board", "embedded", "generation", "authorized", "dirty", "busy", "checking-removal", "reviewed", "pack", "pack-title", "outdated", "upgrade-reason", "can-upgrade", "disabled"]),
      T.value && f.value ? (c(), g("div", pv, [
        d("div", bv, [
          h(r(Jo), {
            value: o.value,
            "onUpdate:value": W[4] || (W[4] = (ee) => bo(ee))
          }, {
            default: L(() => [
              h(r(Zo), { "aria-label": "Settings sections" }, {
                default: L(() => [
                  (c(), g(X, null, te(p, (ee) => h(r(Qo), {
                    key: ee,
                    value: ee
                  }, {
                    default: L(() => [
                      F(I(ee), 1)
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
      ])) : U("", !0),
      D.value ? (c(), g("div", hv, [
        F(I(D.value) + " ", 1),
        h(r(Y), {
          label: "Retry",
          severity: "secondary",
          onClick: W[5] || (W[5] = (ee) => Qe()),
          outlined: ""
        }, {
          icon: L(() => [
            h(r(Q), {
              icon: "tabler:refresh",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        })
      ])) : U("", !0),
      le.value ? (c(), g("p", yv, [
        F(I(le.value), 1),
        h(r(Y), {
          label: "Reload packs",
          severity: "secondary",
          outlined: "",
          onClick: W[6] || (W[6] = (ee) => ml())
        }, {
          icon: L(() => [
            h(r(Q), { icon: "tabler:refresh" })
          ]),
          _: 1
        })
      ])) : U("", !0),
      E.value ? (c(), g("p", gv, I(E.value), 1)) : U("", !0),
      P.value ? (c(), g("p", kv, "Loading settings…")) : !T.value && !D.value ? (c(), g("p", wv, "Board administrator access is required.")) : U("", !0),
      T.value && f.value ? (c(), g("div", Vv, [
        de.value ? (c(), g("div", $v, "The board advances to generation " + I(k.value?.generation) + " while you edit. Your draft keeps generation " + I(f.value.generation) + ". Discard to load the latest schema before reviewing again.", 1)) : U("", !0),
        Ut.value ? (c(), g("div", xv, [
          d("p", null, [
            W[19] || (W[19] = F("Migration pending", -1)),
            k.value?.migration_error ? (c(), g("span", Cv, ": " + I(k.value.migration_error), 1)) : U("", !0)
          ]),
          h(r(Y), {
            label: "Resume migration",
            severity: "secondary",
            disabled: x.value,
            onClick: yo,
            outlined: ""
          }, {
            icon: L(() => [
              h(r(Q), {
                icon: "tabler:refresh",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled"])
        ])) : U("", !0),
        d("form", {
          ref_key: "editor",
          ref: Ee,
          onSubmit: he(Pa, ["prevent"])
        }, [
          (c(), g("fieldset", {
            key: ge.value,
            class: "work-settings-fieldset",
            disabled: x.value || be.value,
            inert: x.value || be.value || void 0
          }, [
            b.value.has("Fields") ? _e((c(), q(Ss, {
              key: 0,
              "board-id": e.boardId,
              "installed-types": A.value?.installed_types,
              draft: N.value,
              "guard-removal": sa,
              issues: ve.value,
              onValidity: W[7] || (W[7] = (ee, ke) => It("fields:" + ee, ke))
            }, null, 8, ["board-id", "installed-types", "draft", "issues"])), [
              [dt, o.value === "Fields"]
            ]) : U("", !0),
            b.value.has("Item types") ? _e((c(), q(Ws, {
              key: 1,
              draft: N.value,
              "guard-removal": sa,
              issues: ve.value
            }, null, 8, ["draft", "issues"])), [
              [dt, o.value === "Item types"]
            ]) : U("", !0),
            b.value.has("Process") ? _e((c(), q(cu, {
              key: 2,
              "board-id": e.boardId,
              draft: N.value,
              "guard-removal": sa,
              issues: ve.value,
              onValidity: W[8] || (W[8] = (ee, ke) => It("process:" + ee, ke))
            }, null, 8, ["board-id", "draft", "issues"])), [
              [dt, o.value === "Process"]
            ]) : U("", !0),
            b.value.has("Policy") ? _e((c(), q(Au, {
              key: 3,
              draft: N.value,
              onValidity: W[9] || (W[9] = (ee, ke) => It("policy:" + ee, ke))
            }, null, 8, ["draft"])), [
              [dt, o.value === "Policy"]
            ]) : U("", !0),
            b.value.has("Relation types") ? _e((c(), q(Yu, {
              key: 4,
              draft: N.value,
              "guard-removal": sa
            }, null, 8, ["draft"])), [
              [dt, o.value === "Relation types"]
            ]) : U("", !0),
            b.value.has("Plugins") ? _e((c(), q(Pl, {
              key: 5,
              "board-id": e.boardId,
              draft: N.value,
              schema: k.value ?? f.value,
              options: A.value?.schema_options.plugins ?? [],
              configs: V.value,
              disabled: x.value,
              onConfigured: W[10] || (W[10] = (ee) => {
                st(), Qe();
              }),
              onRefresh: W[11] || (W[11] = (ee) => Qe()),
              onValidity: W[12] || (W[12] = (ee, ke) => It("plugin:" + ee, ke))
            }, null, 8, ["board-id", "draft", "schema", "options", "configs", "disabled"])), [
              [dt, o.value === "Plugins"]
            ]) : U("", !0),
            b.value.has("Policy") ? _e((c(), g("section", Tv, [
              h(gc, {
                "board-id": e.boardId,
                draft: N.value,
                onValidity: W[13] || (W[13] = (ee) => It("visibility", ee))
              }, null, 8, ["board-id", "draft"])
            ], 512)), [
              [dt, o.value === "Policy"]
            ]) : U("", !0)
          ], 8, Sv))
        ], 544),
        o.value === "Review" && !j.value ? (c(), q(fu, {
          key: 2,
          draft: N.value,
          original: f.value.declaration,
          disabled: x.value || be.value
        }, null, 8, ["draft", "original", "disabled"])) : U("", !0),
        o.value === "Review" && j.value && Me.value.length ? (c(), q(Pl, {
          key: 3,
          "board-id": e.boardId,
          draft: { plugins: Me.value },
          schema: k.value ?? f.value,
          options: A.value?.schema_options.plugins.filter((ee) => Me.value.some((ke) => ke.use === ee.plugin)) ?? [],
          configs: V.value,
          disabled: x.value,
          "activation-locked": "",
          onValidity: W[14] || (W[14] = (ee, ke) => It("pack-plugin:" + ee, ke))
        }, null, 8, ["board-id", "draft", "schema", "options", "configs", "disabled"])) : U("", !0),
        o.value === "Review" ? (c(), q(nv, {
          key: 4,
          "board-id": e.boardId,
          original: f.value.declaration,
          declaration: vl.value,
          plan: C.value,
          generation: f.value.generation,
          follows: fo.value,
          "config-count": Object.keys(V.value).length,
          "pack-review": !!O.value
        }, {
          default: L(() => [
            O.value && j.value ? (c(), q(fv, {
              key: 0,
              plan: O.value,
              request: j.value,
              original: f.value.declaration,
              disabled: x.value,
              onChange: W[15] || (W[15] = (ee) => {
                ne.value = void 0, M.value = "";
              })
            }, null, 8, ["plan", "request", "original", "disabled"])) : U("", !0)
          ]),
          _: 1
        }, 8, ["board-id", "original", "declaration", "plan", "generation", "follows", "config-count", "pack-review"])) : U("", !0),
        o.value === "Review" && !C.value ? (c(), g("p", Dv, "Review your draft to see the changes, their impact and any migration required.")) : U("", !0),
        be.value ? (c(), g("p", Uv, "Checking existing values and dependencies…")) : U("", !0)
      ])) : U("", !0),
      T.value ? (c(), q(Kl, {
        key: 7,
        visible: n.value,
        label: "Install pack",
        busy: x.value,
        onClose: W[18] || (W[18] = (ee) => n.value = !1)
      }, {
        default: L(() => [
          d("form", {
            class: "work-dialog-box work-stack",
            onSubmit: he(mo, ["prevent"])
          }, [
            W[21] || (W[21] = d("h2", null, "Install a pack", -1)),
            W[22] || (W[22] = d("p", { class: "work-muted work-small" }, "Packs can be installed on an empty board. Review checks whether this board is eligible.", -1)),
            d("label", Iv, [
              W[20] || (W[20] = F("Pack", -1)),
              h(r(ae), {
                modelValue: s.value,
                "onUpdate:modelValue": W[16] || (W[16] = (ee) => s.value = ee),
                "aria-label": "Pack to install",
                appendTo: "self",
                optionLabel: "title",
                optionValue: "id",
                optionDisabled: "disabled",
                options: z.value.map((ee) => ({ ...ee, disabled: ee.plugins.some((ke) => !ke.installed) }))
              }, null, 8, ["modelValue", "options"])
            ]),
            z.value.length ? U("", !0) : (c(), g("p", Ev, "No available packs were found.")),
            d("footer", Av, [
              h(r(Y), {
                label: "Cancel",
                severity: "secondary",
                outlined: "",
                onClick: W[17] || (W[17] = (ee) => n.value = !1)
              }),
              h(r(Y), {
                type: "submit",
                label: "Review pack",
                disabled: !s.value || x.value || K.value
              }, null, 8, ["disabled"])
            ])
          ], 32)
        ]),
        _: 1
      }, 8, ["visible", "busy"])) : U("", !0)
    ], 2));
  }
}), Rv = /* @__PURE__ */ fe({
  __name: "SettingsRoot",
  setup(e) {
    const a = To(), t = Do();
    return Co(Hl, (l) => t("navigate", { route: li(l) })), (l, i) => (c(), q(Pv, {
      "board-id": r(a).boardId ?? "",
      embedded: r(a).embedded,
      onDirtyChange: i[0] || (i[0] = (u) => r(t)("dirty-change", { dirty: u }))
    }, null, 8, ["board-id", "embedded"]));
  }
}), Nv = Uo(Rv, {
  type: "object",
  properties: {
    "board-id": { type: "string", default: "", description: "Board to administer." },
    embedded: { type: "boolean", default: !1, description: "Fits in a System detail pane." }
  }
});
Xo(import.meta.url, Nv);
//# sourceMappingURL=settings.js.map
