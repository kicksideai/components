import { inject as Vo, defineComponent as pe, ref as B, useSlots as $o, openBlock as c, createElementBlock as y, createElementVNode as d, normalizeClass as pt, unref as r, renderSlot as He, createCommentVNode as U, createVNode as h, withCtx as z, toDisplayString as A, createBlock as q, withDirectives as et, vShow as ut, computed as H, watch as Ce, onMounted as Ca, onUnmounted as Ll, resolveComponent as Bl, Fragment as J, renderList as le, createTextVNode as M, resolveDynamicComponent as Ga, onBeforeUnmount as ht, useId as ll, withKeys as Oe, withModifiers as ye, normalizeStyle as xo, watchEffect as jl, nextTick as pl, provide as Co } from "vue";
import { e as ft, u as So, b as To, c as Do, a as Uo } from "./mount-D2MD33D3.js";
import "pinia";
import { Icon as _ } from "@iconify/vue";
import oe from "primevue/select";
import { m as Ha, h as bl, s as ve, i as Io, t as Pe, p as Pt, g as ol, j as Rt, r as hl, w as Ct, f as Ge, l as Ya, k as Tt, n as ze, o as bt, u as ql, q as Wl, v as Dt, x as Kl, y as ke, z as Sa, d as il, A as la, c as Eo, B as Ao, C as ha, D as Xa, E as Po, F as xt, G as Ro, _ as Gl, H as Oo, I as No, J as gl, K as wt, L as Mo, M as Fo, N as zo, O as yl, P as Lo, Q as kl, R as Bo, S as jo, a as qo, T as wl, U as Wo, V as Ko } from "./latestRequest-CMroJY2C.js";
import X from "primevue/button";
import { api as Go, on as Ho, host as Yo, define as Xo } from "@wippy-fe/proxy";
import Ne from "primevue/tag";
import We from "primevue/toggleswitch";
import Bt from "primevue/checkbox";
import me from "primevue/inputtext";
import ga from "primevue/textarea";
import Ze from "primevue/inputnumber";
import nl from "primevue/selectbutton";
import Jo from "primevue/tabs";
import Zo from "primevue/tablist";
import Qo from "primevue/tab";
import _o from "primevue/message";
const Oa = (e, a) => e.x > a.x && e.x < a.x + a.width && e.y > a.y && e.y < a.y + a.height;
function ei(e, a, t) {
  return e.x === a.x ? e.x > t.x && e.x < t.x + t.width && Math.max(e.y, a.y) > t.y && Math.min(e.y, a.y) < t.y + t.height : e.y > t.y && e.y < t.y + t.height && Math.max(e.x, a.x) > t.x && Math.min(e.x, a.x) < t.x + t.width;
}
function gt(e, a, t) {
  const l = [.../* @__PURE__ */ new Set([e.x, a.x, ...t.flatMap((E) => [E.x, E.x + E.width])])].sort((E, C) => E - C), i = [.../* @__PURE__ */ new Set([e.y, a.y, ...t.flatMap((E) => [E.y, E.y + E.height])])].sort((E, C) => E - C);
  l.unshift(l[0] - 24), l.push(l.at(-1) + 24), i.unshift(i[0] - 24), i.push(i.at(-1) + 24);
  const u = l.length, m = i.indexOf(a.y) * u + l.indexOf(a.x), v = i.indexOf(e.y) * u + l.indexOf(e.x), p = (E) => ({ x: l[E % u], y: i[Math.floor(E / u)] }), o = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map(), s = [];
  function g(E) {
    s.push(E);
    let C = s.length - 1;
    for (; C; ) {
      const S = C - 1 >> 1;
      if (s[S].priority <= E.priority) break;
      s[C] = s[S], C = S;
    }
    s[C] = E;
  }
  function f() {
    const E = s[0], C = s.pop();
    if (s.length) {
      let S = 0;
      for (; S * 2 + 1 < s.length; ) {
        let D = S * 2 + 1;
        if (D + 1 < s.length && s[D + 1].priority < s[D].priority && D++, C.priority <= s[D].priority) break;
        s[S] = s[D], S = D;
      }
      s[S] = C;
    }
    return E;
  }
  const k = (E) => Math.abs(E.x - a.x) + Math.abs(E.y - a.y);
  for (const E of [0, 1]) {
    const C = v * 2 + E;
    o.set(C, 0), g({ key: C, cost: 0, priority: k(e) });
  }
  const $ = /* @__PURE__ */ new Map(), I = /* @__PURE__ */ new Map();
  for (; s.length; ) {
    const E = f(), C = Math.floor(E.key / 2), S = E.key % 2;
    if (E.cost !== o.get(E.key)) continue;
    if (C === m) {
      const te = [];
      let ce = E.key;
      for (; ce !== void 0; )
        te.push(p(Math.floor(ce / 2))), ce = n.get(ce);
      return Hl(te.reverse());
    }
    const D = p(C), P = C % u, K = Math.floor(C / u);
    for (const [te, ce] of [[P > 0 ? C - 1 : -1, 0], [P + 1 < u ? C + 1 : -1, 0], [K > 0 ? C - u : -1, 1], [K + 1 < i.length ? C + u : -1, 1]]) {
      if (te < 0) continue;
      const se = p(te);
      if ($.has(te) || $.set(te, !t.some((V) => Oa(se, V))), !$.get(te)) continue;
      const W = `${Math.min(C, te)}:${Math.max(C, te)}`;
      if (I.has(W) || I.set(W, !t.some((V) => ei(D, se, V))), !I.get(W)) continue;
      const O = E.cost + Math.abs(D.x - se.x) + Math.abs(D.y - se.y) + (S === ce ? 0 : 18), N = te * 2 + ce;
      O >= (o.get(N) ?? 1 / 0) || (o.set(N, O), n.set(N, E.key), g({ key: N, cost: O, priority: O + k(se) }));
    }
  }
  throw new Error("Process map has no collision-free route between its ports: " + JSON.stringify({ start: e, end: a, startInside: t.filter((E) => Oa(e, E)), endInside: t.filter((E) => Oa(a, E)) }));
}
function Hl(e) {
  const a = [];
  for (const t of e) {
    const l = a.at(-1), i = a.at(-2);
    l && l.x === t.x && l.y === t.y || (i && l && (i.x === l.x && l.x === t.x || i.y === l.y && l.y === t.y) && a.pop(), a.push(t));
  }
  return a;
}
const Kt = (e) => Array.from(e).reduce((a, t) => a + (/[^\x20-\x7e]/u.test(t) ? 16 : /[MW@%]/.test(t) ? 11 : /[ilI.,:;!| ']/.test(t) ? 4 : 7.5), 0);
function zt(e, a = 28) {
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
  if (e = Hl(e), !e.length) return "";
  let a = `M ${e[0].x} ${e[0].y}`;
  for (let l = 1; l < e.length - 1; l++) {
    const i = e[l - 1], u = e[l], m = e[l + 1], v = Math.hypot(u.x - i.x, u.y - i.y), p = Math.hypot(m.x - u.x, m.y - u.y), o = Math.min(8, v / 3, p / 3);
    o && (a += ` L ${u.x + (i.x - u.x) * o / v} ${u.y + (i.y - u.y) * o / v} Q ${u.x} ${u.y} ${u.x + (m.x - u.x) * o / p} ${u.y + (m.y - u.y) * o / p}`);
  }
  const t = e.at(-1);
  return a + ` L ${t.x} ${t.y}`;
}
function ti(e, a = {}, t = { width: 1400, height: 480 }) {
  const l = t.width < 750 || Ha(e).length > 8 ? "TB" : "LR", i = new bl.graphlib.Graph({ multigraph: !0 });
  i.setGraph({ rankdir: l, ranker: "network-simplex", acyclicer: "greedy", nodesep: 32, edgesep: 32, ranksep: 24, marginx: 32, marginy: 32 }), i.setDefaultEdgeLabel(() => ({}));
  const u = Ha(e), m = new Map(u.map((b, x) => [b.id, x])), v = e.states.map((b) => {
    const x = (e.transitions ?? []).filter((Ie) => Ie.from === "any" && Ie.to === b.id), w = zt(ve(b)), j = zt(Io(b, e)), Z = x.flatMap((Ie) => zt(Pe(Ie) + " works from any state")), re = a.policy?.wip?.[b.id]?.limit, ue = re === void 0 ? 0 : Kt(" · limit " + re), Ue = Math.max(168, ...w.map((Ie) => Kt(Ie) + 58), ...j.map((Ie, st) => Kt(Ie) + 32 + (st === j.length - 1 ? ue : 0)), ...Z.map((Ie) => Kt(Ie) + 32)), Me = Math.max(80, 42 + w.length * 18 + j.length * 16 + Z.length * 18);
    return i.setNode(b.id, { width: Ue + (l === "LR" ? 36 : 0), height: Me + (l === "TB" ? 36 : 0) }), { state: b, x: 0, y: 0, width: Ue, height: Me, title: w, caption: j, badges: x, row: m.has(b.id) ? 0 : 1 };
  }), p = new Set(v.map((b) => b.state.id)), o = (e.transitions ?? []).flatMap((b) => b.from === "any" ? [] : b.from.filter((x) => p.has(x) && p.has(b.to)).map((x) => {
    const w = `${b.id}-${x}`, j = zt(Pe(b)), Z = Math.max(72, ...j.map((ue) => Kt(ue) + 24)), re = Math.max(24, j.length * 16 + 10);
    return { transition: b, from: x, key: w, lines: j, width: Z, height: re };
  })), n = /* @__PURE__ */ new Set(), s = /* @__PURE__ */ new Set(), g = new Set(o.filter((b) => b.from === b.transition.to || b.transition.to === e.initial || ["completed", "canceled"].includes(v.find((x) => x.state.id === b.from).state.category)).map((b) => b.key));
  function f(b) {
    if (!s.has(b)) {
      n.add(b);
      for (const x of o.filter((w) => w.from === b))
        g.has(x.key) || (n.has(x.transition.to) ? g.add(x.key) : f(x.transition.to));
      n.delete(b), s.add(b);
    }
  }
  f(e.initial);
  for (const b of v) f(b.state.id);
  for (const b of o) if (!g.has(b.key)) {
    const x = m.get(b.from), w = m.get(b.transition.to);
    i.setEdge(b.from, b.transition.to, { width: b.width, height: b.height, labelpos: "c", weight: x !== void 0 && w === x + 1 ? 100 : 1 }, b.key);
  }
  for (const b of e.transitions ?? []) if (b.from === "any" && p.has(e.initial) && p.has(b.to) && !m.has(b.to)) {
    const x = e.states.find((w) => w.id === b.to);
    i.setEdge(e.initial, b.to, { minlen: ["completed", "canceled"].includes(x.category) ? Math.max(1, u.length - 1) : 1 }, `any:${b.id}`);
  }
  const k = e.states.flatMap((b) => (b.regions ?? []).filter((x) => p.has(x.initial)).map((x, w) => {
    const j = `lane:${b.id}:${w}`;
    return i.setEdge(b.id, x.initial, {}, j), { state: b, region: x, key: j };
  }));
  if (!v.length) return { nodes: v, edges: [], parallels: [], main: u, direction: l, width: 320, height: 160 };
  bl.layout(i);
  for (const b of v) Object.assign(b, { x: i.node(b.state.id).x, y: i.node(b.state.id).y });
  const $ = l === "TB", I = o.filter((b) => !g.has(b.key)).map((b) => i.edge({ v: b.from, w: b.transition.to, name: b.key })), E = [...v, ...I], C = Math.max(...E.map((b) => b.x + b.width / 2)), S = Math.max(...E.map((b) => b.y + b.height / 2)), D = (b) => v.find((x) => x.state.id === b), P = o.filter((b) => g.has(b.key)).sort((b, x) => {
    const w = $ ? "y" : "x";
    return Math.abs(D(b.from)[w] - D(b.transition.to)[w]) - Math.abs(D(x.from)[w] - D(x.transition.to)[w]);
  }), K = /* @__PURE__ */ new Map(), te = Math.max(0, ...P.map((b) => b.width));
  let ce = S + 32;
  for (const [b, x] of P.entries()) {
    const w = D(x.from), j = D(x.transition.to), Z = $ ? C + 16 + te + 28 + b * 18 : ce + x.height / 2, re = $ ? C + 16 + te / 2 : (w.x + j.x) / 2;
    let ue = $ ? w.y + w.height / 2 + 18 : Z;
    if ($) for (const Ue of [...K.values()].sort((Me, Ie) => Me.y - Ie.y))
      ue + x.height / 2 + 10 > Ue.y - Ue.height / 2 - 10 && ue - x.height / 2 - 10 < Ue.y + Ue.height / 2 + 10 && (ue = Ue.y + Ue.height / 2 + 24 + x.height / 2);
    K.set(x.key, { x: re, y: ue, corridor: Z, height: x.height }), ce = Z + x.height / 2 + 24;
  }
  const se = o.map((b) => ({ ...b, ...K.get(b.key) ?? i.edge({ v: b.from, w: b.transition.to, name: b.key }) })), W = (b, x) => ({ x: b.x - b.width / 2 - x, y: b.y - b.height / 2 - x, width: b.width + x * 2, height: b.height + x * 2 }), O = [...v.map((b) => W(b, 12)), ...se.map((b) => W(b, 10))], N = (b, x) => ({
    start: $ ? { x: b.x, y: b.y + b.height / 2 } : { x: b.x + b.width / 2, y: b.y },
    end: $ ? { x: x.x, y: x.y - x.height / 2 } : { x: x.x - x.width / 2, y: x.y }
  }), V = (b, x) => $ ? { x: b.x, y: b.y + x } : { x: b.x + x, y: b.y }, R = se.map((b) => {
    const x = v.find((Ye) => Ye.state.id === b.from), w = v.find((Ye) => Ye.state.id === b.transition.to), { start: j, end: Z } = N(x, w), re = g.has(b.key), ue = V(j, 18), Ue = V(Z, -18), Me = (re || !$ ? b.width : b.height) / 2 + 10, Ie = re ? { x: b.x + ($ ? -Me : Me), y: b.y } : V(b, -Me), st = re ? { x: b.x + ($ ? Me : -Me), y: b.y } : V(b, Me);
    let lt;
    if (re) {
      const { corridor: Ye } = K.get(b.key), na = $ ? { x: Ye, y: b.y } : { x: ue.x, y: Ye }, Ut = $ ? { x: Ye, y: Ue.y } : { x: Ue.x, y: Ye };
      lt = $ ? [
        [j, ...gt(ue, Ie, O)],
        [st, na, Ut, ...gt(Ut, Ue, O), Z]
      ] : [
        [j, ...gt(ue, na, O), Ie],
        [st, ...gt(Ut, Ue, O), Z]
      ];
    } else lt = [
      [j, ...gt(ue, Ie, O)],
      [...gt(st, Ue, O), Z]
    ];
    const Ia = re ? "return" : m.get(b.transition.to) === (m.get(b.from) ?? -2) + 1 ? "main" : "forward";
    return { ...b, points: lt.flat(), segments: lt, path: lt.map(ra).join(" "), type: Ia, targetOffset: 0 };
  }), L = k.map((b) => {
    const x = v.find((ue) => ue.state.id === b.state.id), w = v.find((ue) => ue.state.id === b.region.initial), { start: j, end: Z } = N(x, w), re = [j, ...gt(V(j, 18), V(Z, -18), O), Z];
    return { state: b.state, key: b.key, points: re, path: ra(re) };
  }), T = [...v.flatMap((b) => [{ x: b.x - b.width / 2, y: b.y - b.height / 2 }, { x: b.x + b.width / 2, y: b.y + b.height / 2 }]), ...R.flatMap((b) => [...b.points, { x: b.x - b.width / 2, y: b.y - b.height / 2 }, { x: b.x + b.width / 2, y: b.y + b.height / 2 }]), ...L.flatMap((b) => b.points)], F = 32 - Math.min(...T.map((b) => b.x)), Q = 32 - Math.min(...T.map((b) => b.y)), we = Math.max(...T.map((b) => b.x)) + F + 32, he = Math.max(...T.map((b) => b.y)) + Q + 32, ge = (b) => ({ x: b.x + F, y: b.y + Q });
  for (const b of v) Object.assign(b, ge(b));
  for (const b of R)
    Object.assign(b, ge(b)), b.segments = b.segments.map((x) => x.map(ge)), b.points = b.segments.flat(), b.path = b.segments.map(ra).join(" ");
  for (const b of L)
    b.points = b.points.map(ge), b.path = ra(b.points);
  return { nodes: v, edges: R, parallels: L, main: u, direction: l, width: we, height: he };
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
const Ot = (e) => `/api/v1/work/boards/${encodeURIComponent(e)}`, Vl = (e) => ({ declaration: e.declaration, expected_generation: e.expected_generation, plugin_configs: e.plugin_configs }), Vt = {
  packPlan: (e, a) => Pt(`${Ot(e)}/pack_plan`, a, "Pack plan"),
  packApply: (e, a, t) => Pt(`${Ot(e)}/pack_apply`, { ...a, key: t }, "Apply pack"),
  plan: (e, a) => Pt(`${Ot(e)}/plan_schema`, Vl(a), "Schema plan"),
  apply: (e, a, t) => Pt(`${Ot(e)}/apply_schema`, { ...Vl(a), key: t }, "Apply schema"),
  resume: (e) => Pt(`${Ot(e)}/resume_migration`, {}, "Resume migration"),
  configure: (e, a, t) => Pt(`${Ot(e)}/configure_plugin`, { plugin: a, config: t }, "Configure plugin")
}, oi = { class: "work-definition" }, ii = {
  key: 0,
  class: "work-definition-handle"
}, ni = ["title"], si = { class: "work-definition-details" }, ri = { class: "work-definition-code" }, di = ["title"], ui = { class: "work-definition-kind" }, ci = { class: "work-definition-flags" }, vi = { class: "work-definition-usage" }, mi = { class: "work-definition-actions" }, fi = {
  key: 1,
  class: "work-definition-description"
}, pi = { class: "work-definition-body work-stack" }, Ta = /* @__PURE__ */ pe({
  __name: "DefinitionRow",
  props: {
    title: {},
    code: {},
    kind: {},
    description: {}
  },
  setup(e) {
    const a = B(!1), t = $o();
    return (l, i) => (c(), y("article", oi, [
      d("header", {
        class: pt(["work-definition-head", { "work-definition-has-handle": r(t).handle }])
      }, [
        r(t).handle ? (c(), y("div", ii, [
          He(l.$slots, "handle")
        ])) : U("", !0),
        h(ol, {
          class: "work-definition-toggle",
          "aria-expanded": a.value,
          onActivate: i[0] || (i[0] = (u) => a.value = !a.value)
        }, {
          default: z(() => [
            h(r(_), {
              icon: a.value ? "tabler:chevron-down" : "tabler:chevron-right",
              "aria-hidden": "true"
            }, null, 8, ["icon"]),
            d("span", {
              class: "work-row-title",
              title: e.title
            }, A(e.title), 9, ni)
          ]),
          _: 1
        }, 8, ["aria-expanded"]),
        d("div", si, [
          d("span", ri, [
            e.code ? (c(), y("code", {
              key: 0,
              class: "work-mono",
              title: e.code
            }, A(e.code), 9, di)) : U("", !0)
          ]),
          d("span", ui, [
            e.kind ? (c(), q(r(Ne), {
              key: 0,
              severity: "secondary",
              value: e.kind
            }, null, 8, ["value"])) : U("", !0)
          ]),
          d("span", ci, [
            He(l.$slots, "flags")
          ]),
          d("div", vi, [
            He(l.$slots, "usage")
          ])
        ]),
        d("div", mi, [
          He(l.$slots, "actions")
        ]),
        e.description ? (c(), y("p", fi, A(e.description), 1)) : U("", !0)
      ], 2),
      et(d("div", pi, [
        He(l.$slots, "default")
      ], 512), [
        [ut, a.value]
      ])
    ]));
  }
}), bi = { class: "work-definition-scroll" }, hi = {
  key: 0,
  class: "work-definition-columns",
  "aria-hidden": "true"
}, gi = { key: 0 }, yi = { key: 1 }, ki = {
  key: 2,
  class: "work-definition-usage"
}, Da = /* @__PURE__ */ pe({
  __name: "DefinitionList",
  props: {
    count: {},
    columns: {}
  },
  setup(e) {
    return (a, t) => (c(), y("div", bi, [
      d("div", {
        class: pt(["work-field-builder", "work-definitions-" + e.columns])
      }, [
        e.count > 3 ? (c(), y("div", hi, [
          t[0] || (t[0] = d("span", null, null, -1)),
          t[1] || (t[1] = d("span", null, "Name", -1)),
          e.columns !== "plugins" ? (c(), y("span", gi, "Identifier")) : U("", !0),
          d("span", null, A(e.columns === "plugins" ? "State" : e.columns === "types" ? "Process" : "Kind"), 1),
          e.columns === "fields" || e.columns === "plugins" ? (c(), y("span", yi, "Details")) : U("", !0),
          e.columns !== "plugins" ? (c(), y("span", ki, A(e.columns === "fields" ? "Used by" : "Details"), 1)) : U("", !0),
          t[2] || (t[2] = d("span", null, null, -1))
        ])) : U("", !0),
        He(a.$slots, "default")
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
}, Xl = /* @__PURE__ */ pe({
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
    const t = e, l = a, i = H(() => t.inputId ?? `field-${t.field.code}`), u = H(() => !!t.field.cardinality && t.field.cardinality !== "one"), m = H(() => Array.isArray(t.modelValue) ? t.modelValue : []), v = H(() => t.modelValue == null ? "" : typeof t.modelValue == "object" ? Rt(t.modelValue) : String(t.modelValue)), p = H(() => {
      const x = t.modelValue;
      return x && typeof x == "object" && "ref" in x && Array.isArray(x.ref) ? String(x.ref[1] ?? "") : "";
    }), o = H(() => t.disabled || hl(t.field)), n = B(!1), s = B(!1), g = B(!1), f = B(""), k = B(""), $ = B([]), I = Ya(), E = B([]);
    let C = 0, S;
    const D = /* @__PURE__ */ new Set();
    Ce(m, (x) => {
      E.value = S ?? x.map((w, j) => E.value[j] ?? C++), S = void 0;
    }, { immediate: !0 });
    function P(x) {
      l("update:modelValue", x);
    }
    function K(x, w) {
      const j = [...m.value];
      j[x] = w, P(j);
    }
    function te(x, w) {
      w ? D.delete(x) : D.add(x), l("validity", !D.size);
    }
    function ce(x) {
      D.delete(E.value[x]), l("validity", !D.size), S = E.value.filter((w, j) => j !== x), P(m.value.filter((w, j) => j !== x));
    }
    function se() {
      S = [...E.value, C++], P([...m.value, t.field.form === "bool" ? !1 : t.field.form === "record" ? {} : ""]);
    }
    function W(x) {
      const w = x.detail, j = w?.principal_id ?? w?.id;
      P(j ? { kind: w.type ?? "user", id: j } : void 0);
    }
    function O(x) {
      const w = x.detail;
      P(w?.thread_id ? { ref: ["component", w.thread_id] } : void 0);
    }
    const N = B("");
    let V = "";
    Ce(() => t.modelValue, (x) => {
      const w = JSON.stringify(x ?? {}, null, 2);
      w !== V && (V = w, N.value = w, f.value = "", l("validity", !0));
    }, { immediate: !0 });
    function R(x) {
      N.value = x;
      try {
        const w = JSON.parse(x);
        if (!w || typeof w != "object" || Array.isArray(w)) throw new Error("Enter a JSON object.");
        if (t.field.type === "rich_text" && !("type" in w && typeof w.type == "string")) throw new Error("The document needs a type.");
        V = JSON.stringify(w, null, 2), f.value = "", l("validity", !0), P(w);
      } catch (w) {
        f.value = w instanceof Error ? w.message : "Invalid JSON.", l("validity", !1);
      }
    }
    function L(x) {
      if (!x) {
        l("validity", !0), P(void 0);
        return;
      }
      const w = Number.isFinite(Number(x)) && (t.field.form !== "int" || Number.isSafeInteger(Number(x)));
      l("validity", w), w && P(t.field.form === "int" ? Number(x) : x);
    }
    const T = H(() => t.field.config?.format === "date");
    function F(x) {
      P(x ? T.value ? x : new Date(x).toISOString() : void 0);
    }
    const Q = H(() => {
      if (typeof t.modelValue != "string") return "";
      if (T.value) return t.modelValue.slice(0, 10);
      const x = new Date(t.modelValue);
      return Number.isNaN(x.getTime()) ? "" : new Date(x.getTime() - x.getTimezoneOffset() * 6e4).toISOString().slice(0, 16);
    });
    function we(x) {
      P(x.detail?.ref);
    }
    function he(x) {
      P(x.detail?.value);
    }
    let ge;
    Ce(k, () => {
      const x = I();
      if (clearTimeout(ge), !k.value.trim()) {
        $.value = [];
        return;
      }
      ge = setTimeout(async () => {
        try {
          const w = k.value.trim(), j = /^[A-Z][A-Z0-9]{1,9}-[0-9]+$/.test(w) ? [(await Ct.item(t.boardId, { key: w })).item] : (await Ct.query(t.boardId, { where: { field: "title", op: "contains", value: w }, limit: 8 })).items;
          x() && ($.value = j, f.value = "");
        } catch (w) {
          x() && (f.value = Ge(w, "Could not search items."));
        }
      }, 200);
    });
    function b(x) {
      P({ board: t.boardId, item: x.id }), k.value = "", $.value = [];
    }
    Ca(async () => {
      t.field.type === "principal" ? n.value = await ft("wc-principal-picker") : t.field.config?.target === "component" && (n.value = await ft("wc-component-picker"));
    });
    for (const [x, w] of [[() => t.editorTag, g], [() => t.linkTag, s]])
      Ce(x, async (j, Z, re) => {
        let ue = !0;
        if (re(() => {
          ue = !1;
        }), w.value = !1, j) {
          const Ue = await ft(j);
          ue && (w.value = Ue);
        }
      }, { immediate: !0 });
    return Ll(() => {
      clearTimeout(ge), I();
    }), (x, w) => {
      const j = Bl("FieldControl", !0);
      return c(), y("div", xi, [
        r(hl)(e.field) ? (c(), y("output", {
          key: 0,
          id: i.value,
          class: "work-read-value"
        }, A(r(Rt)(e.modelValue, e.field)), 9, Ci)) : u.value ? (c(), y("div", Si, [
          d("div", Ti, [
            (c(!0), y(J, null, le(m.value, (Z, re) => (c(), q(r(Ne), {
              key: E.value[re],
              class: "kx-tag-sm",
              severity: "secondary"
            }, {
              default: z(() => [
                M(A(r(Rt)(Z, e.field)) + " ", 1),
                h(r(X), {
                  type: "button",
                  class: "work-icon-button",
                  disabled: o.value,
                  "aria-label": "Remove value " + (re + 1),
                  onClick: (ue) => ce(re),
                  severity: "secondary",
                  text: "",
                  size: "small"
                }, {
                  default: z(() => [
                    h(r(_), {
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
          (c(!0), y(J, null, le(m.value, (Z, re) => (c(), y("div", {
            key: E.value[re],
            class: "work-stack work-tight"
          }, [
            h(j, {
              "board-id": e.boardId,
              field: { ...e.field, cardinality: "one" },
              "model-value": Z,
              "input-id": i.value + "-" + E.value[re],
              disabled: o.value,
              "editor-tag": e.editorTag,
              "link-tag": e.linkTag,
              "onUpdate:modelValue": (ue) => K(re, ue),
              onValidity: (ue) => te(E.value[re], ue)
            }, null, 8, ["board-id", "field", "model-value", "input-id", "disabled", "editor-tag", "link-tag", "onUpdate:modelValue", "onValidity"])
          ]))), 128)),
          h(r(X), {
            label: "Add value",
            severity: "secondary",
            size: "small",
            disabled: o.value,
            onClick: se,
            outlined: ""
          }, {
            icon: z(() => [
              h(r(_), {
                icon: "tabler:plus",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled"])
        ])) : e.editorTag && g.value ? (c(), q(Ga(e.editorTag), {
          key: 2,
          "board-id": e.boardId,
          value: JSON.stringify(e.modelValue ?? null),
          config: JSON.stringify(e.field.config ?? {}),
          readonly: o.value || void 0,
          onChange: he
        }, null, 40, ["board-id", "value", "config", "readonly"])) : e.linkTag && s.value ? (c(), q(Ga(e.linkTag), {
          key: 3,
          "board-id": e.boardId,
          kind: e.field.config?.target ?? e.field.type,
          value: JSON.stringify(e.modelValue ?? null),
          readonly: o.value || void 0,
          onChange: we
        }, null, 40, ["board-id", "kind", "value", "readonly"])) : e.field.type === "option" ? (c(), q(r(oe), {
          key: 4,
          placeholder: "Not set",
          inputId: i.value,
          "model-value": e.modelValue ?? "",
          disabled: o.value,
          "onUpdate:modelValue": w[0] || (w[0] = (Z) => P(Z || void 0)),
          appendTo: "self",
          optionLabel: "label",
          optionValue: "value",
          optionDisabled: "disabled",
          options: [{ label: "Not set", value: "", disabled: !1 }, ...(e.field.options ?? []).map((Z) => ({ label: Z.label ?? Z.id, value: Z.id, disabled: !1 }))]
        }, null, 8, ["inputId", "model-value", "disabled", "options"])) : e.field.form === "bool" ? (c(), y("label", Di, [
          h(r(Bt), {
            inputId: i.value,
            "model-value": e.modelValue === !0,
            disabled: o.value,
            "onUpdate:modelValue": w[1] || (w[1] = (Z) => P(Z)),
            binary: ""
          }, null, 8, ["inputId", "model-value", "disabled"]),
          M(A(e.modelValue === !0 ? "Yes" : e.modelValue === !1 ? "No" : "Not set"), 1)
        ])) : e.field.form === "int" ? (c(), q(r(Ze), {
          key: 6,
          inputId: i.value,
          "model-value": v.value === "" ? null : Number(v.value),
          disabled: o.value,
          "onUpdate:modelValue": w[2] || (w[2] = (Z) => L(Z == null ? "" : String(Z))),
          useGrouping: !1
        }, null, 8, ["inputId", "model-value", "disabled"])) : e.field.form === "dec" ? (c(), q(r(me), {
          key: 7,
          id: i.value,
          inputmode: "decimal",
          "model-value": v.value,
          disabled: o.value,
          "onUpdate:modelValue": w[3] || (w[3] = (Z) => L(Z ?? ""))
        }, null, 8, ["id", "model-value", "disabled"])) : e.field.form === "time" ? (c(), q(r(me), {
          key: 8,
          id: i.value,
          type: T.value ? "date" : "datetime-local",
          value: Q.value,
          disabled: o.value,
          onInput: w[4] || (w[4] = (Z) => F(Z.target.value))
        }, null, 8, ["id", "type", "value", "disabled"])) : e.field.type === "principal" ? (c(), y("div", {
          key: 9,
          inert: o.value || void 0,
          class: "work-stack work-tight"
        }, [
          n.value ? (c(), y("wc-principal-picker", {
            key: 0,
            value: JSON.stringify(e.modelValue ?? {}),
            kinds: "user,group",
            onConfigChanged: W
          }, null, 40, Ii)) : (c(), y("span", Ei, A(r(Rt)(e.modelValue, e.field)) + " · Person picker is unavailable.", 1))
        ], 8, Ui)) : e.field.config?.target === "component" ? (c(), y("div", {
          key: 10,
          inert: o.value || void 0
        }, [
          n.value ? (c(), y("wc-component-picker", {
            key: 0,
            value: JSON.stringify({ thread_id: p.value }),
            onChange: O
          }, null, 40, Pi)) : (c(), y("span", Ri, "Component picker is unavailable."))
        ], 8, Ai)) : e.field.type === "item" ? (c(), y("div", Oi, [
          h(r(Ne), {
            class: "kx-tag-sm",
            severity: "secondary"
          }, {
            default: z(() => [
              M(A(r(Rt)(e.modelValue, e.field)), 1)
            ]),
            _: 1
          }),
          h(r(me), {
            id: i.value,
            modelValue: k.value,
            "onUpdate:modelValue": w[5] || (w[5] = (Z) => k.value = Z),
            disabled: o.value,
            placeholder: "Search a title or enter an item key",
            "aria-label": "Search items"
          }, null, 8, ["id", "modelValue", "disabled"]),
          d("div", Ni, [
            (c(!0), y(J, null, le($.value, (Z) => (c(), q(ol, {
              key: Z.id,
              class: "work-match-item",
              disabled: o.value,
              onActivate: (re) => b(Z)
            }, {
              default: z(() => [
                d("code", Mi, A(Z.key), 1),
                d("span", null, A(r(Rt)(Z.values.title)), 1)
              ]),
              _: 2
            }, 1032, ["disabled", "onActivate"]))), 128))
          ]),
          e.modelValue ? (c(), q(r(X), {
            key: 0,
            label: "Clear reference",
            severity: "secondary",
            size: "small",
            disabled: o.value,
            onClick: w[6] || (w[6] = (Z) => P(void 0)),
            outlined: ""
          }, {
            icon: z(() => [
              h(r(_), {
                icon: "tabler:list-check",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled"])) : U("", !0)
        ])) : e.field.form === "record" || e.field.type === "rich_text" || e.field.form === "quantity" || e.field.form === "ref" ? (c(), q(r(ga), {
          key: 12,
          id: i.value,
          "model-value": N.value,
          rows: "3",
          disabled: o.value,
          "aria-invalid": !!f.value,
          "onUpdate:modelValue": w[7] || (w[7] = (Z) => R(Z ?? ""))
        }, null, 8, ["id", "model-value", "disabled", "aria-invalid"])) : e.field.code === "description" ? (c(), q(r(ga), {
          key: 13,
          id: i.value,
          "model-value": v.value,
          rows: "4",
          disabled: o.value,
          "onUpdate:modelValue": w[8] || (w[8] = (Z) => P(Z))
        }, null, 8, ["id", "model-value", "disabled"])) : (c(), q(r(me), {
          key: 14,
          id: i.value,
          "model-value": v.value,
          disabled: o.value,
          "onUpdate:modelValue": w[9] || (w[9] = (Z) => P(Z))
        }, null, 8, ["id", "model-value", "disabled"])),
        f.value ? (c(), y("span", Fi, A(f.value), 1)) : U("", !0)
      ]);
    };
  }
}), zi = { class: "work-stack work-tight work-operand-control" }, Li = { class: "work-row work-small" }, Bi = {
  key: 1,
  class: "work-muted work-small"
}, ji = {
  key: 2,
  class: "work-stack work-tight"
}, qi = { class: "work-small" }, Wi = {
  key: 0,
  class: "work-error work-small",
  role: "alert"
}, Gt = /* @__PURE__ */ pe({
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
    const t = e, l = a, i = H(() => "$actor" in Tt(t.modelValue) ? "actor" : "$now" in Tt(t.modelValue) ? "now" : "literal"), u = B(""), m = B("");
    Ce(() => t.modelValue, (o) => {
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
    return (o, n) => (c(), y("div", zi, [
      d("label", Li, [
        M(A(e.label), 1),
        h(r(oe), {
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
      i.value === "now" ? (c(), q(r(me), {
        key: 0,
        "aria-label": e.label + " time offset",
        value: r(Tt)(e.modelValue).$now,
        disabled: e.disabled,
        placeholder: "-P7D",
        onInput: n[1] || (n[1] = (s) => l("update:modelValue", { $now: s.target.value }))
      }, null, 8, ["aria-label", "value", "disabled"])) : i.value === "actor" ? (c(), y("span", Bi, "The signed-in actor’s id")) : e.multiple ? (c(), y("div", ji, [
        d("label", qi, [
          n[5] || (n[5] = M("Values as JSON (operands may appear in the list)", -1)),
          h(r(ga), {
            class: "work-mono",
            "aria-label": e.label + " values",
            value: u.value,
            disabled: e.disabled,
            rows: "2",
            onInput: n[2] || (n[2] = (s) => p(s.target.value))
          }, null, 8, ["aria-label", "value", "disabled"])
        ]),
        m.value ? (c(), y("p", Wi, A(m.value), 1)) : U("", !0)
      ])) : (c(), q(Xl, {
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
}, tn = { class: "work-row work-wrap" }, an = /* @__PURE__ */ pe({
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
    const t = e, l = a, i = H(() => t.path ?? "where"), u = H(() => t.depth ?? 1), m = H(() => ["and", "or", "not", "history", "match", "rel", "children"].find((W) => W in t.modelValue) ?? "field"), v = H(() => Vi(t.schema)), p = H(() => v.value.find((W) => W.code === t.modelValue.field) ?? { code: "value", form: "text" }), o = H(() => Tt(t.modelValue.history)), n = H(() => v.value.find((W) => W.code === o.value.field) ?? { code: "history", form: "text" }), s = H(() => Array.isArray(t.modelValue[m.value]) ? t.modelValue[m.value] : []), g = () => ({ field: "category", op: "eq", value: "unstarted" }), f = B(/* @__PURE__ */ new Set());
    function k(W, O) {
      O ? f.value.delete(W) : f.value.add(W), l("validity", f.value.size === 0);
    }
    Ce(m, () => {
      f.value.clear(), l("validity", !0);
    });
    function $(W) {
      const O = /* @__PURE__ */ new Set();
      for (const N of f.value) {
        const V = Number(N);
        !Number.isNaN(V) && V !== W && O.add(String(V > W ? V - 1 : V));
      }
      f.value = O, l("validity", O.size === 0), E({ [m.value]: s.value.filter((N, V) => V !== W) });
    }
    function I(W) {
      l("update:modelValue", W);
    }
    function E(W) {
      I({ ...t.modelValue, ...W });
    }
    function C(W) {
      I(W === "field" ? g() : W === "and" || W === "or" ? { [W]: [g()] } : W === "not" ? { not: g() } : W === "history" ? { history: { field: "state", changed: !0 } } : W === "match" ? { match: "" } : W === "children" ? { children: !0, q: "some", where: g() } : { rel: t.schema.compiled.relation_types?.[0]?.id ?? "", dir: "outward", q: "some", where: g() });
    }
    function S(W, O) {
      E({ [m.value]: s.value.map((N, V) => V === W ? O : N) });
    }
    function D(W, O) {
      const N = { ...o.value };
      O === void 0 ? (delete N[W], k(W, !0)) : N[W] = O, E({ history: N });
    }
    function P(W) {
      f.value.clear(), l("validity", !0);
      const O = { ...o.value };
      delete O.was, delete O.changed, delete O.from, delete O.to, O[W] = W === "changed" ? !0 : "", E({ history: O });
    }
    const K = { code: "actor", form: "text" }, te = { code: "at", form: "time" }, ce = H(() => Array.isArray(o.value.during) ? o.value.during : []);
    function se(W, O) {
      const N = [...ce.value];
      N[W] = O, D("during", N);
    }
    return (W, O) => {
      const N = Bl("FilterNode", !0);
      return c(), y("fieldset", {
        class: "work-filter-node",
        disabled: e.disabled
      }, [
        d("legend", Gi, A(i.value), 1),
        d("label", Hi, [
          O[21] || (O[21] = M("Condition", -1)),
          h(r(oe), {
            "aria-label": i.value + " condition",
            "model-value": m.value,
            "onUpdate:modelValue": O[0] || (O[0] = (V) => C(V)),
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            optionDisabled: "disabled",
            options: [{ label: "Field", value: "field", disabled: !1 }, ...["and", "or", "not", "history", "rel", "children", "match"].map((V) => ({ label: V, value: V, disabled: u.value >= 6 && ["and", "or", "not", "rel", "children"].includes(V) }))]
          }, null, 8, ["aria-label", "model-value", "options"])
        ]),
        m.value === "and" || m.value === "or" ? (c(), y(J, { key: 0 }, [
          (c(!0), y(J, null, le(s.value, (V, R) => (c(), y("div", {
            key: R,
            class: "work-stack work-tight"
          }, [
            h(N, {
              "board-id": e.boardId,
              schema: e.schema,
              "model-value": V,
              path: i.value + "." + m.value + "[" + R + "]",
              depth: u.value + 1,
              "onUpdate:modelValue": (L) => S(R, L),
              onValidity: (L) => k(String(R), L)
            }, null, 8, ["board-id", "schema", "model-value", "path", "depth", "onUpdate:modelValue", "onValidity"]),
            h(r(X), {
              label: "Remove condition",
              size: "small",
              severity: "secondary",
              onClick: (L) => $(R),
              outlined: ""
            }, {
              icon: z(() => [
                h(r(_), {
                  icon: "tabler:trash",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["onClick"])
          ]))), 128)),
          h(r(X), {
            label: "Add condition",
            size: "small",
            severity: "secondary",
            disabled: u.value >= 6,
            onClick: O[1] || (O[1] = (V) => E({ [m.value]: [...s.value, g()] })),
            outlined: ""
          }, {
            icon: z(() => [
              h(r(_), {
                icon: "tabler:plus",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled"])
        ], 64)) : m.value === "not" ? (c(), q(N, {
          key: 1,
          "board-id": e.boardId,
          schema: e.schema,
          "model-value": r(Tt)(e.modelValue.not),
          path: i.value + ".not",
          depth: u.value + 1,
          "onUpdate:modelValue": O[2] || (O[2] = (V) => E({ not: V })),
          onValidity: O[3] || (O[3] = (V) => k("nested", V))
        }, null, 8, ["board-id", "schema", "model-value", "path", "depth"])) : m.value === "field" ? (c(), y(J, { key: 2 }, [
          d("div", Yi, [
            d("label", null, [
              O[22] || (O[22] = M("Field", -1)),
              h(r(oe), {
                "aria-label": i.value + " field",
                "model-value": e.modelValue.field,
                "onUpdate:modelValue": O[4] || (O[4] = (V) => E({ field: V, op: "eq", value: void 0 })),
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                optionDisabled: "disabled",
                options: [...(v.value ?? []).map((V) => ({ label: r(ze)(V), value: V.code, disabled: !1 }))]
              }, null, 8, ["aria-label", "model-value", "options"])
            ]),
            d("label", null, [
              O[23] || (O[23] = M("Operator", -1)),
              h(r(oe), {
                "aria-label": i.value + " operator",
                "model-value": e.modelValue.op,
                "onUpdate:modelValue": O[5] || (O[5] = (V) => E({ op: V, value: V === "is_null" ? !0 : void 0 })),
                appendTo: "self",
                options: r($i)(p.value)
              }, null, 8, ["aria-label", "model-value", "options"])
            ])
          ]),
          h(Gt, {
            "board-id": e.boardId,
            field: e.modelValue.op === "is_null" ? { code: "null", form: "bool" } : p.value,
            "model-value": e.modelValue.value,
            multiple: ["in", "nin", "between"].includes(String(e.modelValue.op)),
            label: i.value + " value",
            "onUpdate:modelValue": O[6] || (O[6] = (V) => E({ value: V })),
            onValidity: O[7] || (O[7] = (V) => k("value", V))
          }, null, 8, ["board-id", "field", "model-value", "multiple", "label"])
        ], 64)) : m.value === "match" ? (c(), y("label", Xi, [
          O[24] || (O[24] = M("Search", -1)),
          h(r(me), {
            "aria-label": i.value + " search",
            value: e.modelValue.match,
            onInput: O[8] || (O[8] = (V) => E({ match: V.target.value }))
          }, null, 8, ["aria-label", "value"])
        ])) : m.value === "history" ? (c(), y(J, { key: 4 }, [
          d("div", Ji, [
            d("label", null, [
              O[25] || (O[25] = M("Field", -1)),
              h(r(oe), {
                "aria-label": i.value + " history field",
                "model-value": o.value.field,
                "onUpdate:modelValue": O[9] || (O[9] = (V) => D("field", V)),
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                optionDisabled: "disabled",
                options: [...(v.value ?? []).map((V) => ({ label: r(ze)(V), value: V.code, disabled: !1 }))]
              }, null, 8, ["aria-label", "model-value", "options"])
            ]),
            d("label", null, [
              O[26] || (O[26] = M("History", -1)),
              h(r(oe), {
                "aria-label": i.value + " history mode",
                "model-value": o.value.changed ? "changed" : "was",
                "onUpdate:modelValue": O[10] || (O[10] = (V) => P(V)),
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                optionDisabled: "disabled",
                options: [{ label: "Changed", value: "changed", disabled: !1 }, { label: "Was", value: "was", disabled: !1 }]
              }, null, 8, ["aria-label", "model-value"])
            ])
          ]),
          o.value.changed ? (c(), y(J, { key: 0 }, le(["from", "to"], (V) => d("div", { key: V }, [
            d("label", Zi, [
              h(r(Bt), {
                "model-value": V in o.value,
                "aria-label": "Constrain " + V,
                "onUpdate:modelValue": (R) => D(V, R ? "" : void 0),
                binary: ""
              }, null, 8, ["model-value", "aria-label", "onUpdate:modelValue"]),
              M(A(V), 1)
            ]),
            V in o.value ? (c(), q(Gt, {
              key: 0,
              "board-id": e.boardId,
              field: n.value,
              "model-value": o.value[V],
              label: i.value + " history " + V,
              "onUpdate:modelValue": (R) => D(V, R),
              onValidity: (R) => k(V, R)
            }, null, 8, ["board-id", "field", "model-value", "label", "onUpdate:modelValue", "onValidity"])) : U("", !0)
          ])), 64)) : (c(), q(Gt, {
            key: 1,
            "board-id": e.boardId,
            field: n.value,
            "model-value": o.value.was,
            label: i.value + " history was",
            "onUpdate:modelValue": O[11] || (O[11] = (V) => D("was", V)),
            onValidity: O[12] || (O[12] = (V) => k("was", V))
          }, null, 8, ["board-id", "field", "model-value", "label"])),
          d("label", Qi, [
            h(r(Bt), {
              "model-value": "by" in o.value,
              "aria-label": "Constrain actor",
              "onUpdate:modelValue": O[13] || (O[13] = (V) => D("by", V ? { $actor: "id" } : void 0)),
              binary: ""
            }, null, 8, ["model-value"]),
            O[27] || (O[27] = M("By actor", -1))
          ]),
          "by" in o.value ? (c(), q(Gt, {
            key: 2,
            "board-id": e.boardId,
            field: K,
            "model-value": o.value.by,
            label: i.value + " history by",
            "onUpdate:modelValue": O[14] || (O[14] = (V) => D("by", V))
          }, null, 8, ["board-id", "model-value", "label"])) : U("", !0),
          d("label", _i, [
            h(r(Bt), {
              "model-value": "during" in o.value,
              "aria-label": "Constrain time window",
              "onUpdate:modelValue": O[15] || (O[15] = (V) => D("during", V ? [{ $now: "-P30D" }, { $now: "P0D" }] : void 0)),
              binary: ""
            }, null, 8, ["model-value"]),
            O[28] || (O[28] = M("During", -1))
          ]),
          "during" in o.value ? (c(), y("div", en, [
            (c(), y(J, null, le(["start", "end"], (V, R) => h(Gt, {
              key: V,
              "board-id": e.boardId,
              field: te,
              "model-value": ce.value[R],
              label: i.value + " during " + V,
              "onUpdate:modelValue": (L) => se(R, L)
            }, null, 8, ["board-id", "model-value", "label", "onUpdate:modelValue"])), 64))
          ])) : U("", !0)
        ], 64)) : (c(), y(J, { key: 5 }, [
          d("div", tn, [
            m.value === "rel" ? (c(), y(J, { key: 0 }, [
              d("label", null, [
                O[29] || (O[29] = M("Relation", -1)),
                h(r(oe), {
                  "model-value": e.modelValue.rel,
                  "onUpdate:modelValue": O[16] || (O[16] = (V) => E({ rel: V })),
                  appendTo: "self",
                  optionLabel: "label",
                  optionValue: "value",
                  optionDisabled: "disabled",
                  options: [...(e.schema.compiled.relation_types ?? []).map((V) => ({ label: V.outward ?? V.id, value: V.id, disabled: !1 }))]
                }, null, 8, ["model-value", "options"])
              ]),
              d("label", null, [
                O[30] || (O[30] = M("Direction", -1)),
                h(r(oe), {
                  "model-value": e.modelValue.dir,
                  "onUpdate:modelValue": O[17] || (O[17] = (V) => E({ dir: V })),
                  appendTo: "self",
                  optionLabel: "label",
                  optionValue: "value",
                  optionDisabled: "disabled",
                  options: [{ label: "Outward", value: "outward", disabled: !1 }, { label: "Inward", value: "inward", disabled: !1 }]
                }, null, 8, ["model-value"])
              ])
            ], 64)) : U("", !0),
            d("label", null, [
              O[31] || (O[31] = M("Quantifier", -1)),
              h(r(oe), {
                "model-value": e.modelValue.q,
                "onUpdate:modelValue": O[18] || (O[18] = (V) => E({ q: V })),
                appendTo: "self",
                options: ["some", "every", "none"]
              }, null, 8, ["model-value"])
            ])
          ]),
          h(N, {
            "board-id": e.boardId,
            schema: e.schema,
            "model-value": r(Tt)(e.modelValue.where),
            path: i.value + ".where",
            depth: u.value + 1,
            "onUpdate:modelValue": O[19] || (O[19] = (V) => E({ where: V })),
            onValidity: O[20] || (O[20] = (V) => k("nested", V))
          }, null, 8, ["board-id", "schema", "model-value", "path", "depth"])
        ], 64))
      ], 8, Ki);
    };
  }
}), ln = { class: "work-stack work-tight" }, on = { class: "work-row work-small" }, sl = /* @__PURE__ */ pe({
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
    return ht(() => l("validity", !0)), (p, o) => (c(), y("section", ln, [
      d("label", on, [
        h(r(We), {
          "model-value": e.modelValue != null,
          "aria-label": e.label,
          "onUpdate:modelValue": v
        }, null, 8, ["model-value", "aria-label"]),
        M(A(e.label), 1)
      ]),
      e.modelValue != null ? (c(), q(an, {
        key: 0,
        schema: i.value,
        "board-id": e.boardId ?? "",
        "model-value": r(Tt)(e.modelValue),
        path: e.label,
        "onUpdate:modelValue": o[0] || (o[0] = (n) => l("update:modelValue", n)),
        onValidity: o[1] || (o[1] = (n) => m("structured", n))
      }, null, 8, ["schema", "board-id", "model-value", "path"])) : U("", !0),
      e.modelValue != null ? (c(), q(bt, {
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
}, rl = /* @__PURE__ */ pe({
  __name: "PrincipalsPicker",
  props: {
    modelValue: {},
    label: {},
    kinds: {},
    boardId: {}
  },
  emits: ["update:modelValue"],
  setup(e, { emit: a }) {
    const t = e, l = a, i = B(!1), u = B(0), m = H(() => t.modelValue ?? []), { principalLabel: v, rememberPrincipal: p, nameError: o } = ql(() => t.boardId ?? "", () => m.value);
    Ca(async () => {
      i.value = await ft("wc-principal-picker");
    });
    function n(s) {
      const g = s.detail, f = g?.principal_id ?? g?.id;
      if (!f) return;
      const k = { kind: g.type ?? "user", id: f };
      g.label && p(k, g.label), m.value.some(($) => $.id === f && $.kind === k.kind) || l("update:modelValue", [...m.value, k]), u.value++;
    }
    return (s, g) => (c(), y(J, null, [
      r(o) ? (c(), y("p", nn, A(r(o)), 1)) : U("", !0),
      d("section", {
        class: "work-stack work-tight work-principals-picker",
        "aria-label": e.label
      }, [
        d("h4", rn, A(e.label), 1),
        m.value.length ? (c(), y("div", dn, [
          (c(!0), y(J, null, le(m.value, (f, k) => (c(), q(r(Ne), {
            key: f.kind + f.id,
            severity: "secondary",
            class: "kx-tag-sm"
          }, {
            default: z(() => [
              M(A(r(v)(f)), 1),
              h(r(X), {
                text: "",
                severity: "secondary",
                size: "small",
                "aria-label": "Remove " + r(v)(f),
                onClick: ($) => l("update:modelValue", m.value.filter((I, E) => E !== k))
              }, {
                default: z(() => [
                  h(r(_), { icon: "tabler:x" })
                ]),
                _: 1
              }, 8, ["aria-label", "onClick"])
            ]),
            _: 2
          }, 1024))), 128))
        ])) : U("", !0),
        i.value ? (c(), y("wc-principal-picker", {
          key: u.value,
          kinds: e.kinds ?? "user,group",
          onConfigChanged: n
        }, null, 40, un)) : (c(), y("p", cn, "People and group picker is unavailable."))
      ], 8, sn)
    ], 64));
  }
}), vn = { class: "work-stack work-tight" }, Jl = /* @__PURE__ */ pe({
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
    return (m, v) => (c(), y("div", vn, [
      h(rl, {
        "board-id": e.boardId,
        label: e.label,
        "model-value": i.value,
        "onUpdate:modelValue": u
      }, null, 8, ["board-id", "label", "model-value"]),
      h(bt, {
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
function it() {
  return it = Object.assign ? Object.assign.bind() : function(e) {
    for (var a = 1; a < arguments.length; a++) {
      var t = arguments[a];
      for (var l in t) ({}).hasOwnProperty.call(t, l) && (e[l] = t[l]);
    }
    return e;
  }, it.apply(null, arguments);
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
function at(e) {
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
function Ja(e) {
  "@babel/helpers - typeof";
  return Ja = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(a) {
    return typeof a;
  } : function(a) {
    return a && typeof Symbol == "function" && a.constructor === Symbol && a !== Symbol.prototype ? "symbol" : typeof a;
  }, Ja(e);
}
var gn = "1.15.7";
function ot(e) {
  if (typeof window < "u" && window.navigator)
    return !!/* @__PURE__ */ navigator.userAgent.match(e);
}
var nt = ot(/(?:Trident.*rv[ :]?11\.|msie|iemobile|Windows Phone)/i), oa = ot(/Edge/i), xl = ot(/firefox/i), Qt = ot(/safari/i) && !ot(/chrome/i) && !ot(/android/i), dl = ot(/iP(ad|od|hone)/i), Zl = ot(/chrome/i) && ot(/android/i), Ql = {
  capture: !1,
  passive: !1
};
function be(e, a, t) {
  e.addEventListener(a, t, !nt && Ql);
}
function fe(e, a, t) {
  e.removeEventListener(a, t, !nt && Ql);
}
function ya(e, a) {
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
function Je(e, a, t, l) {
  if (e) {
    t = t || document;
    do {
      if (a != null && (a[0] === ">" ? e.parentNode === t && ya(e, a) : ya(e, a)) || l && e === t)
        return e;
      if (e === t) break;
    } while (e = _l(e));
  }
  return null;
}
var Cl = /\s+/g;
function je(e, a, t) {
  if (e && a)
    if (e.classList)
      e.classList[t ? "add" : "remove"](a);
    else {
      var l = (" " + e.className + " ").replace(Cl, " ").replace(" " + a + " ", " ");
      e.className = (l + (t ? " " + a : "")).replace(Cl, " ");
    }
}
function ie(e, a, t) {
  var l = e && e.style;
  if (l) {
    if (t === void 0)
      return document.defaultView && document.defaultView.getComputedStyle ? t = document.defaultView.getComputedStyle(e, "") : e.currentStyle && (t = e.currentStyle), a === void 0 ? t : t[a];
    !(a in l) && a.indexOf("webkit") === -1 && (a = "-webkit-" + a), l[a] = t + (typeof t == "string" ? "" : "px");
  }
}
function jt(e, a) {
  var t = "";
  if (typeof e == "string")
    t = e;
  else
    do {
      var l = ie(e, "transform");
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
function tt() {
  var e = document.scrollingElement;
  return e || document.documentElement;
}
function De(e, a, t, l, i) {
  if (!(!e.getBoundingClientRect && e !== window)) {
    var u, m, v, p, o, n, s;
    if (e !== window && e.parentNode && e !== tt() ? (u = e.getBoundingClientRect(), m = u.top, v = u.left, p = u.bottom, o = u.right, n = u.height, s = u.width) : (m = 0, v = 0, p = window.innerHeight, o = window.innerWidth, n = window.innerHeight, s = window.innerWidth), (a || t) && e !== window && (i = i || e.parentNode, !nt))
      do
        if (i && i.getBoundingClientRect && (ie(i, "transform") !== "none" || t && ie(i, "position") !== "static")) {
          var g = i.getBoundingClientRect();
          m -= g.top + parseInt(ie(i, "border-top-width")), v -= g.left + parseInt(ie(i, "border-left-width")), p = m + u.height, o = v + u.width;
          break;
        }
      while (i = i.parentNode);
    if (l && e !== window) {
      var f = jt(i || e), k = f && f.a, $ = f && f.d;
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
function Sl(e, a, t) {
  for (var l = mt(e, !0), i = De(e)[a]; l; ) {
    var u = De(l)[t], m = void 0;
    if (m = i >= u, !m) return l;
    if (l === tt()) break;
    l = mt(l, !1);
  }
  return !1;
}
function Wt(e, a, t, l) {
  for (var i = 0, u = 0, m = e.children; u < m.length; ) {
    if (m[u].style.display !== "none" && m[u] !== ne.ghost && (l || m[u] !== ne.dragged) && Je(m[u], t.draggable, e, !1)) {
      if (i === a)
        return m[u];
      i++;
    }
    u++;
  }
  return null;
}
function ul(e, a) {
  for (var t = e.lastElementChild; t && (t === ne.ghost || ie(t, "display") === "none" || a && !ya(t, a)); )
    t = t.previousElementSibling;
  return t || null;
}
function Ke(e, a) {
  var t = 0;
  if (!e || !e.parentNode)
    return -1;
  for (; e = e.previousElementSibling; )
    e.nodeName.toUpperCase() !== "TEMPLATE" && e !== ne.clone && (!a || ya(e, a)) && t++;
  return t;
}
function Tl(e) {
  var a = 0, t = 0, l = tt();
  if (e)
    do {
      var i = jt(e), u = i.a, m = i.d;
      a += e.scrollLeft * u, t += e.scrollTop * m;
    } while (e !== l && (e = e.parentNode));
  return [a, t];
}
function yn(e, a) {
  for (var t in e)
    if (e.hasOwnProperty(t)) {
      for (var l in a)
        if (a.hasOwnProperty(l) && a[l] === e[t][l]) return Number(t);
    }
  return -1;
}
function mt(e, a) {
  if (!e || !e.getBoundingClientRect) return tt();
  var t = e, l = !1;
  do
    if (t.clientWidth < t.scrollWidth || t.clientHeight < t.scrollHeight) {
      var i = ie(t);
      if (t.clientWidth < t.scrollWidth && (i.overflowX == "auto" || i.overflowX == "scroll") || t.clientHeight < t.scrollHeight && (i.overflowY == "auto" || i.overflowY == "scroll")) {
        if (!t.getBoundingClientRect || t === document.body) return tt();
        if (l || a) return t;
        l = !0;
      }
    }
  while (t = t.parentNode);
  return tt();
}
function kn(e, a) {
  if (e && a)
    for (var t in a)
      a.hasOwnProperty(t) && (e[t] = a[t]);
  return e;
}
function Na(e, a) {
  return Math.round(e.top) === Math.round(a.top) && Math.round(e.left) === Math.round(a.left) && Math.round(e.height) === Math.round(a.height) && Math.round(e.width) === Math.round(a.width);
}
var _t;
function to(e, a) {
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
    var u, m, v, p;
    if (!(!Je(i, a.draggable, e, !1) || i.animated || i === t)) {
      var o = De(i);
      l.left = Math.min((u = l.left) !== null && u !== void 0 ? u : 1 / 0, o.left), l.top = Math.min((m = l.top) !== null && m !== void 0 ? m : 1 / 0, o.top), l.right = Math.max((v = l.right) !== null && v !== void 0 ? v : -1 / 0, o.right), l.bottom = Math.max((p = l.bottom) !== null && p !== void 0 ? p : -1 / 0, o.bottom);
    }
  }), l.width = l.right - l.left, l.height = l.bottom - l.top, l.x = l.left, l.y = l.top, l;
}
var Be = "Sortable" + (/* @__PURE__ */ new Date()).getTime();
function Vn() {
  var e = [], a;
  return {
    captureAnimationState: function() {
      if (e = [], !!this.options.animation) {
        var l = [].slice.call(this.el.children);
        l.forEach(function(i) {
          if (!(ie(i, "display") === "none" || i === ne.ghost)) {
            e.push({
              target: i,
              rect: De(i)
            });
            var u = at({}, e[e.length - 1].rect);
            if (i.thisAnimationDuration) {
              var m = jt(i, !0);
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
      e.splice(yn(e, {
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
        var p = 0, o = v.target, n = o.fromRect, s = De(o), g = o.prevFromRect, f = o.prevToRect, k = v.rect, $ = jt(o, !0);
        $ && (s.top -= $.f, s.left -= $.e), o.toRect = s, o.thisAnimationDuration && Na(g, s) && !Na(n, s) && // Make sure animatingRect is on line between toRect & fromRect
        (k.top - s.top) / (k.left - s.left) === (n.top - s.top) / (n.left - s.left) && (p = xn(k, g, f, i.options)), Na(s, n) || (o.prevFromRect = n, o.prevToRect = s, p || (p = i.options.animation), i.animate(o, k, s, p)), p && (u = !0, m = Math.max(m, p), clearTimeout(o.animationResetTimer), o.animationResetTimer = setTimeout(function() {
          o.animationTime = 0, o.prevFromRect = null, o.fromRect = null, o.prevToRect = null, o.thisAnimationDuration = null;
        }, p), o.thisAnimationDuration = p);
      }), clearTimeout(a), u ? a = setTimeout(function() {
        typeof l == "function" && l();
      }, m) : typeof l == "function" && l(), e = [];
    },
    animate: function(l, i, u, m) {
      if (m) {
        ie(l, "transition", ""), ie(l, "transform", "");
        var v = jt(this.el), p = v && v.a, o = v && v.d, n = (i.left - u.left) / (p || 1), s = (i.top - u.top) / (o || 1);
        l.animatingX = !!n, l.animatingY = !!s, ie(l, "transform", "translate3d(" + n + "px," + s + "px,0)"), this.forRepaintDummy = $n(l), ie(l, "transition", "transform " + m + "ms" + (this.options.easing ? " " + this.options.easing : "")), ie(l, "transform", "translate3d(0,0,0)"), typeof l.animated == "number" && clearTimeout(l.animated), l.animated = setTimeout(function() {
          ie(l, "transition", ""), ie(l, "transform", ""), l.animated = !1, l.animatingX = !1, l.animatingY = !1;
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
      t[m.pluginName] && (t[m.pluginName][u] && t[m.pluginName][u](at({
        sortable: t
      }, l)), t.options[m.pluginName] && t[m.pluginName][a] && t[m.pluginName][a](at({
        sortable: t
      }, l)));
    });
  },
  initializePlugins: function(a, t, l, i) {
    Nt.forEach(function(v) {
      var p = v.pluginName;
      if (!(!a.options[p] && !v.initializeByDefault)) {
        var o = new v(a, t, a.options);
        o.sortable = a, o.options = a.options, a[p] = o, it(l, o.defaults);
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
      typeof i.eventProperties == "function" && it(l, i.eventProperties.call(t[i.pluginName], a));
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
  var a = e.sortable, t = e.rootEl, l = e.name, i = e.targetEl, u = e.cloneEl, m = e.toEl, v = e.fromEl, p = e.oldIndex, o = e.newIndex, n = e.oldDraggableIndex, s = e.newDraggableIndex, g = e.originalEvent, f = e.putSortable, k = e.extraEventProperties;
  if (a = a || t && t[Be], !!a) {
    var $, I = a.options, E = "on" + l.charAt(0).toUpperCase() + l.substr(1);
    window.CustomEvent && !nt && !oa ? $ = new CustomEvent(l, {
      bubbles: !0,
      cancelable: !0
    }) : ($ = document.createEvent("Event"), $.initEvent(l, !0, !0)), $.to = m || t, $.from = v || t, $.item = i || t, $.clone = u, $.oldIndex = p, $.newIndex = o, $.oldDraggableIndex = n, $.newDraggableIndex = s, $.originalEvent = g, $.pullMode = f ? f.lastPutMode : void 0;
    var C = at(at({}, k), ia.getEventProperties(l, a));
    for (var S in C)
      $[S] = C[S];
    t && t.dispatchEvent($), I[E] && I[E].call(a, $);
  }
}
var Sn = ["evt"], Le = function(a, t) {
  var l = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, i = l.evt, u = fn(l, Sn);
  ia.pluginEvent.bind(ne)(a, t, at({
    dragEl: Y,
    parentEl: Se,
    ghostEl: de,
    rootEl: $e,
    nextEl: $t,
    lastDownEl: ma,
    cloneEl: xe,
    cloneHidden: vt,
    dragStarted: Ht,
    putSortable: Ae,
    activeSortable: ne.active,
    originalEvent: i,
    oldIndex: Lt,
    oldDraggableIndex: ea,
    newIndex: qe,
    newDraggableIndex: ct,
    hideGhostForTarget: ro,
    unhideGhostForTarget: uo,
    cloneNowHidden: function() {
      vt = !0;
    },
    cloneNowShown: function() {
      vt = !1;
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
  Cn(at({
    putSortable: Ae,
    cloneEl: xe,
    targetEl: Y,
    rootEl: $e,
    oldIndex: Lt,
    oldDraggableIndex: ea,
    newIndex: qe,
    newDraggableIndex: ct
  }, e));
}
var Y, Se, de, $e, $t, ma, xe, vt, Lt, qe, ea, ct, da, Ae, Ft = !1, ka = !1, wa = [], yt, Xe, Fa, za, Dl, Ul, Ht, Mt, ta, aa = !1, ua = !1, fa, Re, La = [], Za = !1, Va = [], Ua = typeof document < "u", ca = dl, Il = oa || nt ? "cssFloat" : "float", Tn = Ua && !Zl && !dl && "draggable" in document.createElement("div"), io = (function() {
  if (Ua) {
    if (nt)
      return !1;
    var e = document.createElement("x");
    return e.style.cssText = "pointer-events:auto", e.style.pointerEvents === "auto";
  }
})(), no = function(a, t) {
  var l = ie(a), i = parseInt(l.width) - parseInt(l.paddingLeft) - parseInt(l.paddingRight) - parseInt(l.borderLeftWidth) - parseInt(l.borderRightWidth), u = Wt(a, 0, t), m = Wt(a, 1, t), v = u && ie(u), p = m && ie(m), o = v && parseInt(v.marginLeft) + parseInt(v.marginRight) + De(u).width, n = p && parseInt(p.marginLeft) + parseInt(p.marginRight) + De(m).width;
  if (l.display === "flex")
    return l.flexDirection === "column" || l.flexDirection === "column-reverse" ? "vertical" : "horizontal";
  if (l.display === "grid")
    return l.gridTemplateColumns.split(" ").length <= 1 ? "vertical" : "horizontal";
  if (u && v.float && v.float !== "none") {
    var s = v.float === "left" ? "left" : "right";
    return m && (p.clear === "both" || p.clear === s) ? "vertical" : "horizontal";
  }
  return u && (v.display === "block" || v.display === "flex" || v.display === "table" || v.display === "grid" || o >= i && l[Il] === "none" || m && l[Il] === "none" && o + n > i) ? "vertical" : "horizontal";
}, Dn = function(a, t, l) {
  var i = l ? a.left : a.top, u = l ? a.right : a.bottom, m = l ? a.width : a.height, v = l ? t.left : t.top, p = l ? t.right : t.bottom, o = l ? t.width : t.height;
  return i === v || u === p || i + m / 2 === v + o / 2;
}, Un = function(a, t) {
  var l;
  return wa.some(function(i) {
    var u = i[Be].options.emptyInsertThreshold;
    if (!(!u || ul(i))) {
      var m = De(i), v = a >= m.left - u && a <= m.right + u, p = t >= m.top - u && t <= m.bottom + u;
      if (v && p)
        return l = i;
    }
  }), l;
}, so = function(a) {
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
      var g = (m ? v : p).options.group.name;
      return u === !0 || typeof u == "string" && u === g || u.join && u.indexOf(g) > -1;
    };
  }
  var l = {}, i = a.group;
  (!i || Ja(i) != "object") && (i = {
    name: i
  }), l.name = i.name, l.checkPull = t(i.pull, !0), l.checkPut = t(i.put), l.revertClone = i.revertClone, a.group = l;
}, ro = function() {
  !io && de && ie(de, "display", "none");
}, uo = function() {
  !io && de && ie(de, "display", "");
};
Ua && !Zl && document.addEventListener("click", function(e) {
  if (ka)
    return e.preventDefault(), e.stopPropagation && e.stopPropagation(), e.stopImmediatePropagation && e.stopImmediatePropagation(), ka = !1, !1;
}, !0);
var kt = function(a) {
  if (Y) {
    a = a.touches ? a.touches[0] : a;
    var t = Un(a.clientX, a.clientY);
    if (t) {
      var l = {};
      for (var i in a)
        a.hasOwnProperty(i) && (l[i] = a[i]);
      l.target = l.rootEl = t, l.preventDefault = void 0, l.stopPropagation = void 0, t[Be]._onDragOver(l);
    }
  }
}, In = function(a) {
  Y && Y.parentNode[Be]._isOutsideThisEl(a.target);
};
function ne(e, a) {
  if (!(e && e.nodeType && e.nodeType === 1))
    throw "Sortable: `el` must be an HTMLElement, not ".concat({}.toString.call(e));
  this.el = e, this.options = a = it({}, a), e[Be] = this;
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
    supportPointer: ne.supportPointer !== !1 && "PointerEvent" in window && (!Qt || dl),
    emptyInsertThreshold: 5
  };
  ia.initializePlugins(this, e, t);
  for (var l in t)
    !(l in a) && (a[l] = t[l]);
  so(a);
  for (var i in this)
    i.charAt(0) === "_" && typeof this[i] == "function" && (this[i] = this[i].bind(this));
  this.nativeDraggable = a.forceFallback ? !1 : Tn, this.nativeDraggable && (this.options.touchStartThreshold = 1), a.supportPointer ? be(e, "pointerdown", this._onTapStart) : (be(e, "mousedown", this._onTapStart), be(e, "touchstart", this._onTapStart)), this.nativeDraggable && (be(e, "dragover", this), be(e, "dragenter", this)), wa.push(this.el), a.store && a.store.get && this.sort(a.store.get(this) || []), it(this, Vn());
}
ne.prototype = /** @lends Sortable.prototype */
{
  constructor: ne,
  _isOutsideThisEl: function(a) {
    !this.el.contains(a) && a !== this.el && (Mt = null);
  },
  _getDirection: function(a, t) {
    return typeof this.options.direction == "function" ? this.options.direction.call(this, a, t, Y) : this.options.direction;
  },
  _onTapStart: function(a) {
    if (a.cancelable) {
      var t = this, l = this.el, i = this.options, u = i.preventOnFilter, m = a.type, v = a.touches && a.touches[0] || a.pointerType && a.pointerType === "touch" && a, p = (v || a).target, o = a.target.shadowRoot && (a.path && a.path[0] || a.composedPath && a.composedPath()[0]) || p, n = i.filter;
      if (Fn(l), !Y && !(/mousedown|pointerdown/.test(m) && a.button !== 0 || i.disabled) && !o.isContentEditable && !(!this.nativeDraggable && Qt && p && p.tagName.toUpperCase() === "SELECT") && (p = Je(p, i.draggable, l, !1), !(p && p.animated) && ma !== p)) {
        if (Lt = Ke(p), ea = Ke(p, i.draggable), typeof n == "function") {
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
    if (l && !Y && l.parentNode === u) {
      var o = De(l);
      if ($e = u, Y = l, Se = Y.parentNode, $t = Y.nextSibling, ma = l, da = m.group, ne.dragged = Y, yt = {
        target: Y,
        clientX: (t || a).clientX,
        clientY: (t || a).clientY
      }, Dl = yt.clientX - o.left, Ul = yt.clientY - o.top, this._lastX = (t || a).clientX, this._lastY = (t || a).clientY, Y.style["will-change"] = "all", p = function() {
        if (Le("delayEnded", i, {
          evt: a
        }), ne.eventCanceled) {
          i._onDrop();
          return;
        }
        i._disableDelayedDragEvents(), !xl && i.nativeDraggable && (Y.draggable = !0), i._triggerDragStart(a, t), Fe({
          sortable: i,
          name: "choose",
          originalEvent: a
        }), je(Y, m.chosenClass, !0);
      }, m.ignore.split(",").forEach(function(n) {
        eo(Y, n.trim(), Ba);
      }), be(v, "dragover", kt), be(v, "mousemove", kt), be(v, "touchmove", kt), m.supportPointer ? (be(v, "pointerup", i._onDrop), !this.nativeDraggable && be(v, "pointercancel", i._onDrop)) : (be(v, "mouseup", i._onDrop), be(v, "touchend", i._onDrop), be(v, "touchcancel", i._onDrop)), xl && this.nativeDraggable && (this.options.touchStartThreshold = 4, Y.draggable = !0), Le("delayStart", this, {
        evt: a
      }), m.delay && (!m.delayOnTouchOnly || t) && (!this.nativeDraggable || !(oa || nt))) {
        if (ne.eventCanceled) {
          this._onDrop();
          return;
        }
        m.supportPointer ? (be(v, "pointerup", i._disableDelayedDrag), be(v, "pointercancel", i._disableDelayedDrag)) : (be(v, "mouseup", i._disableDelayedDrag), be(v, "touchend", i._disableDelayedDrag), be(v, "touchcancel", i._disableDelayedDrag)), be(v, "mousemove", i._delayedDragTouchMoveHandler), be(v, "touchmove", i._delayedDragTouchMoveHandler), m.supportPointer && be(v, "pointermove", i._delayedDragTouchMoveHandler), i._dragStartTimer = setTimeout(p, m.delay);
      } else
        p();
    }
  },
  _delayedDragTouchMoveHandler: function(a) {
    var t = a.touches ? a.touches[0] : a;
    Math.max(Math.abs(t.clientX - this._lastX), Math.abs(t.clientY - this._lastY)) >= Math.floor(this.options.touchStartThreshold / (this.nativeDraggable && window.devicePixelRatio || 1)) && this._disableDelayedDrag();
  },
  _disableDelayedDrag: function() {
    Y && Ba(Y), clearTimeout(this._dragStartTimer), this._disableDelayedDragEvents();
  },
  _disableDelayedDragEvents: function() {
    var a = this.el.ownerDocument;
    fe(a, "mouseup", this._disableDelayedDrag), fe(a, "touchend", this._disableDelayedDrag), fe(a, "touchcancel", this._disableDelayedDrag), fe(a, "pointerup", this._disableDelayedDrag), fe(a, "pointercancel", this._disableDelayedDrag), fe(a, "mousemove", this._delayedDragTouchMoveHandler), fe(a, "touchmove", this._delayedDragTouchMoveHandler), fe(a, "pointermove", this._delayedDragTouchMoveHandler);
  },
  _triggerDragStart: function(a, t) {
    t = t || a.pointerType == "touch" && a, !this.nativeDraggable || t ? this.options.supportPointer ? be(document, "pointermove", this._onTouchMove) : t ? be(document, "touchmove", this._onTouchMove) : be(document, "mousemove", this._onTouchMove) : (be(Y, "dragend", this), be($e, "dragstart", this._onDragStart));
    try {
      document.selection ? pa(function() {
        document.selection.empty();
      }) : window.getSelection().removeAllRanges();
    } catch {
    }
  },
  _dragStarted: function(a, t) {
    if (Ft = !1, $e && Y) {
      Le("dragStarted", this, {
        evt: t
      }), this.nativeDraggable && be(document, "dragover", In);
      var l = this.options;
      !a && je(Y, l.dragClass, !1), je(Y, l.ghostClass, !0), ne.active = this, a && this._appendGhost(), Fe({
        sortable: this,
        name: "start",
        originalEvent: t
      });
    } else
      this._nulling();
  },
  _emulateDragOver: function() {
    if (Xe) {
      this._lastX = Xe.clientX, this._lastY = Xe.clientY, ro();
      for (var a = document.elementFromPoint(Xe.clientX, Xe.clientY), t = a; a && a.shadowRoot && (a = a.shadowRoot.elementFromPoint(Xe.clientX, Xe.clientY), a !== t); )
        t = a;
      if (Y.parentNode[Be]._isOutsideThisEl(a), t)
        do {
          if (t[Be]) {
            var l = void 0;
            if (l = t[Be]._onDragOver({
              clientX: Xe.clientX,
              clientY: Xe.clientY,
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
    if (yt) {
      var t = this.options, l = t.fallbackTolerance, i = t.fallbackOffset, u = a.touches ? a.touches[0] : a, m = de && jt(de, !0), v = de && m && m.a, p = de && m && m.d, o = ca && Re && Tl(Re), n = (u.clientX - yt.clientX + i.x) / (v || 1) + (o ? o[0] - La[0] : 0) / (v || 1), s = (u.clientY - yt.clientY + i.y) / (p || 1) + (o ? o[1] - La[1] : 0) / (p || 1);
      if (!ne.active && !Ft) {
        if (l && Math.max(Math.abs(u.clientX - this._lastX), Math.abs(u.clientY - this._lastY)) < l)
          return;
        this._onDragStart(a, !0);
      }
      if (de) {
        m ? (m.e += n - (Fa || 0), m.f += s - (za || 0)) : m = {
          a: 1,
          b: 0,
          c: 0,
          d: 1,
          e: n,
          f: s
        };
        var g = "matrix(".concat(m.a, ",").concat(m.b, ",").concat(m.c, ",").concat(m.d, ",").concat(m.e, ",").concat(m.f, ")");
        ie(de, "webkitTransform", g), ie(de, "mozTransform", g), ie(de, "msTransform", g), ie(de, "transform", g), Fa = n, za = s, Xe = u;
      }
      a.cancelable && a.preventDefault();
    }
  },
  _appendGhost: function() {
    if (!de) {
      var a = this.options.fallbackOnBody ? document.body : $e, t = De(Y, !0, ca, !0, a), l = this.options;
      if (ca) {
        for (Re = a; ie(Re, "position") === "static" && ie(Re, "transform") === "none" && Re !== document; )
          Re = Re.parentNode;
        Re !== document.body && Re !== document.documentElement ? (Re === document && (Re = tt()), t.top += Re.scrollTop, t.left += Re.scrollLeft) : Re = tt(), La = Tl(Re);
      }
      de = Y.cloneNode(!0), je(de, l.ghostClass, !1), je(de, l.fallbackClass, !0), je(de, l.dragClass, !0), ie(de, "transition", ""), ie(de, "transform", ""), ie(de, "box-sizing", "border-box"), ie(de, "margin", 0), ie(de, "top", t.top), ie(de, "left", t.left), ie(de, "width", t.width), ie(de, "height", t.height), ie(de, "opacity", "0.8"), ie(de, "position", ca ? "absolute" : "fixed"), ie(de, "zIndex", "100000"), ie(de, "pointerEvents", "none"), ne.ghost = de, a.appendChild(de), ie(de, "transform-origin", Dl / parseInt(de.style.width) * 100 + "% " + Ul / parseInt(de.style.height) * 100 + "%");
    }
  },
  _onDragStart: function(a, t) {
    var l = this, i = a.dataTransfer, u = l.options;
    if (Le("dragStart", this, {
      evt: a
    }), ne.eventCanceled) {
      this._onDrop();
      return;
    }
    Le("setupClone", this), ne.eventCanceled || (xe = lo(Y), xe.removeAttribute("id"), xe.draggable = !1, xe.style["will-change"] = "", this._hideClone(), je(xe, this.options.chosenClass, !1), ne.clone = xe), l.cloneId = pa(function() {
      Le("clone", l), !ne.eventCanceled && (l.options.removeCloneOnHide || $e.insertBefore(xe, Y), l._hideClone(), Fe({
        sortable: l,
        name: "clone"
      }));
    }), !t && je(Y, u.dragClass, !0), t ? (ka = !0, l._loopId = setInterval(l._emulateDragOver, 50)) : (fe(document, "mouseup", l._onDrop), fe(document, "touchend", l._onDrop), fe(document, "touchcancel", l._onDrop), i && (i.effectAllowed = "move", u.setData && u.setData.call(l, i, Y)), be(document, "drop", l), ie(Y, "transform", "translateZ(0)")), Ft = !0, l._dragStartId = pa(l._dragStarted.bind(l, t, a)), be(document, "selectstart", l), Ht = !0, window.getSelection().removeAllRanges(), Qt && ie(document.body, "user-select", "none");
  },
  // Returns true - if no further action is needed (either inserted or another condition)
  _onDragOver: function(a) {
    var t = this.el, l = a.target, i, u, m, v = this.options, p = v.group, o = ne.active, n = da === p, s = v.sort, g = Ae || o, f, k = this, $ = !1;
    if (Za) return;
    function I(Q, we) {
      Le(Q, k, at({
        evt: a,
        isOwner: n,
        axis: f ? "vertical" : "horizontal",
        revert: m,
        dragRect: i,
        targetRect: u,
        canSort: s,
        fromSortable: g,
        target: l,
        completed: C,
        onMove: function(ge, b) {
          return va($e, t, Y, i, ge, De(ge), a, b);
        },
        changed: S
      }, we));
    }
    function E() {
      I("dragOverAnimationCapture"), k.captureAnimationState(), k !== g && g.captureAnimationState();
    }
    function C(Q) {
      return I("dragOverCompleted", {
        insertion: Q
      }), Q && (n ? o._hideClone() : o._showClone(k), k !== g && (je(Y, Ae ? Ae.options.ghostClass : o.options.ghostClass, !1), je(Y, v.ghostClass, !0)), Ae !== k && k !== ne.active ? Ae = k : k === ne.active && Ae && (Ae = null), g === k && (k._ignoreWhileAnimating = l), k.animateAll(function() {
        I("dragOverAnimationComplete"), k._ignoreWhileAnimating = null;
      }), k !== g && (g.animateAll(), g._ignoreWhileAnimating = null)), (l === Y && !Y.animated || l === t && !l.animated) && (Mt = null), !v.dragoverBubble && !a.rootEl && l !== document && (Y.parentNode[Be]._isOutsideThisEl(a.target), !Q && kt(a)), !v.dragoverBubble && a.stopPropagation && a.stopPropagation(), $ = !0;
    }
    function S() {
      qe = Ke(Y), ct = Ke(Y, v.draggable), Fe({
        sortable: k,
        name: "change",
        toEl: t,
        newIndex: qe,
        newDraggableIndex: ct,
        originalEvent: a
      });
    }
    if (a.preventDefault !== void 0 && a.cancelable && a.preventDefault(), l = Je(l, v.draggable, t, !0), I("dragOver"), ne.eventCanceled) return $;
    if (Y.contains(a.target) || l.animated && l.animatingX && l.animatingY || k._ignoreWhileAnimating === l)
      return C(!1);
    if (ka = !1, o && !v.disabled && (n ? s || (m = Se !== $e) : Ae === this || (this.lastPutMode = da.checkPull(this, o, Y, a)) && p.checkPut(this, o, Y, a))) {
      if (f = this._getDirection(a, l) === "vertical", i = De(Y), I("dragOverValid"), ne.eventCanceled) return $;
      if (m)
        return Se = $e, E(), this._hideClone(), I("revert"), ne.eventCanceled || ($t ? $e.insertBefore(Y, $t) : $e.appendChild(Y)), C(!0);
      var D = ul(t, v.draggable);
      if (!D || Rn(a, f, this) && !D.animated) {
        if (D === Y)
          return C(!1);
        if (D && t === a.target && (l = D), l && (u = De(l)), va($e, t, Y, i, l, u, a, !!l) !== !1)
          return E(), D && D.nextSibling ? t.insertBefore(Y, D.nextSibling) : t.appendChild(Y), Se = t, S(), C(!0);
      } else if (D && Pn(a, f, this)) {
        var P = Wt(t, 0, v, !0);
        if (P === Y)
          return C(!1);
        if (l = P, u = De(l), va($e, t, Y, i, l, u, a, !1) !== !1)
          return E(), t.insertBefore(Y, P), Se = t, S(), C(!0);
      } else if (l.parentNode === t) {
        u = De(l);
        var K = 0, te, ce = Y.parentNode !== t, se = !Dn(Y.animated && Y.toRect || i, l.animated && l.toRect || u, f), W = f ? "top" : "left", O = Sl(l, "top", "top") || Sl(Y, "top", "top"), N = O ? O.scrollTop : void 0;
        Mt !== l && (te = u[W], aa = !1, ua = !se && v.invertSwap || ce), K = On(a, l, u, f, se ? 1 : v.swapThreshold, v.invertedSwapThreshold == null ? v.swapThreshold : v.invertedSwapThreshold, ua, Mt === l);
        var V;
        if (K !== 0) {
          var R = Ke(Y);
          do
            R -= K, V = Se.children[R];
          while (V && (ie(V, "display") === "none" || V === de));
        }
        if (K === 0 || V === l)
          return C(!1);
        Mt = l, ta = K;
        var L = l.nextElementSibling, T = !1;
        T = K === 1;
        var F = va($e, t, Y, i, l, u, a, T);
        if (F !== !1)
          return (F === 1 || F === -1) && (T = F === 1), Za = !0, setTimeout(An, 30), E(), T && !L ? t.appendChild(Y) : l.parentNode.insertBefore(Y, T ? L : l), O && ao(O, 0, N - O.scrollTop), Se = Y.parentNode, te !== void 0 && !ua && (fa = Math.abs(te - De(l)[W])), S(), C(!0);
      }
      if (t.contains(Y))
        return C(!1);
    }
    return !1;
  },
  _ignoreWhileAnimating: null,
  _offMoveEvents: function() {
    fe(document, "mousemove", this._onTouchMove), fe(document, "touchmove", this._onTouchMove), fe(document, "pointermove", this._onTouchMove), fe(document, "dragover", kt), fe(document, "mousemove", kt), fe(document, "touchmove", kt);
  },
  _offUpEvents: function() {
    var a = this.el.ownerDocument;
    fe(a, "mouseup", this._onDrop), fe(a, "touchend", this._onDrop), fe(a, "pointerup", this._onDrop), fe(a, "pointercancel", this._onDrop), fe(a, "touchcancel", this._onDrop), fe(document, "selectstart", this);
  },
  _onDrop: function(a) {
    var t = this.el, l = this.options;
    if (qe = Ke(Y), ct = Ke(Y, l.draggable), Le("drop", this, {
      evt: a
    }), Se = Y && Y.parentNode, qe = Ke(Y), ct = Ke(Y, l.draggable), ne.eventCanceled) {
      this._nulling();
      return;
    }
    Ft = !1, ua = !1, aa = !1, clearInterval(this._loopId), clearTimeout(this._dragStartTimer), Qa(this.cloneId), Qa(this._dragStartId), this.nativeDraggable && (fe(document, "drop", this), fe(t, "dragstart", this._onDragStart)), this._offMoveEvents(), this._offUpEvents(), Qt && ie(document.body, "user-select", ""), ie(Y, "transform", ""), a && (Ht && (a.cancelable && a.preventDefault(), !l.dropBubble && a.stopPropagation()), de && de.parentNode && de.parentNode.removeChild(de), ($e === Se || Ae && Ae.lastPutMode !== "clone") && xe && xe.parentNode && xe.parentNode.removeChild(xe), Y && (this.nativeDraggable && fe(Y, "dragend", this), Ba(Y), Y.style["will-change"] = "", Ht && !Ft && je(Y, Ae ? Ae.options.ghostClass : this.options.ghostClass, !1), je(Y, this.options.chosenClass, !1), Fe({
      sortable: this,
      name: "unchoose",
      toEl: Se,
      newIndex: null,
      newDraggableIndex: null,
      originalEvent: a
    }), $e !== Se ? (qe >= 0 && (Fe({
      rootEl: Se,
      name: "add",
      toEl: Se,
      fromEl: $e,
      originalEvent: a
    }), Fe({
      sortable: this,
      name: "remove",
      toEl: Se,
      originalEvent: a
    }), Fe({
      rootEl: Se,
      name: "sort",
      toEl: Se,
      fromEl: $e,
      originalEvent: a
    }), Fe({
      sortable: this,
      name: "sort",
      toEl: Se,
      originalEvent: a
    })), Ae && Ae.save()) : qe !== Lt && qe >= 0 && (Fe({
      sortable: this,
      name: "update",
      toEl: Se,
      originalEvent: a
    }), Fe({
      sortable: this,
      name: "sort",
      toEl: Se,
      originalEvent: a
    })), ne.active && ((qe == null || qe === -1) && (qe = Lt, ct = ea), Fe({
      sortable: this,
      name: "end",
      toEl: Se,
      originalEvent: a
    }), this.save()))), this._nulling();
  },
  _nulling: function() {
    Le("nulling", this), $e = Y = Se = de = $t = xe = ma = vt = yt = Xe = Ht = qe = ct = Lt = ea = Mt = ta = Ae = da = ne.dragged = ne.ghost = ne.clone = ne.active = null;
    var a = this.el;
    Va.forEach(function(t) {
      a.contains(t) && (t.checked = !0);
    }), Va.length = Fa = za = 0;
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
    typeof i < "u" ? l[a] = i : l[a] = t, a === "group" && so(l);
  },
  /**
   * Destroy
   */
  destroy: function() {
    Le("destroy", this);
    var a = this.el;
    a[Be] = null, fe(a, "mousedown", this._onTapStart), fe(a, "touchstart", this._onTapStart), fe(a, "pointerdown", this._onTapStart), this.nativeDraggable && (fe(a, "dragover", this), fe(a, "dragenter", this)), Array.prototype.forEach.call(a.querySelectorAll("[draggable]"), function(t) {
      t.removeAttribute("draggable");
    }), this._onDrop(), this._disableDelayedDragEvents(), wa.splice(wa.indexOf(this.el), 1), this.el = a = null;
  },
  _hideClone: function() {
    if (!vt) {
      if (Le("hideClone", this), ne.eventCanceled) return;
      ie(xe, "display", "none"), this.options.removeCloneOnHide && xe.parentNode && xe.parentNode.removeChild(xe), vt = !0;
    }
  },
  _showClone: function(a) {
    if (a.lastPutMode !== "clone") {
      this._hideClone();
      return;
    }
    if (vt) {
      if (Le("showClone", this), ne.eventCanceled) return;
      Y.parentNode == $e && !this.options.group.revertClone ? $e.insertBefore(xe, Y) : $t ? $e.insertBefore(xe, $t) : $e.appendChild(xe), this.options.group.revertClone && this.animate(Y, xe), ie(xe, "display", ""), vt = !1;
    }
  }
};
function En(e) {
  e.dataTransfer && (e.dataTransfer.dropEffect = "move"), e.cancelable && e.preventDefault();
}
function va(e, a, t, l, i, u, m, v) {
  var p, o = e[Be], n = o.options.onMove, s;
  return window.CustomEvent && !nt && !oa ? p = new CustomEvent("move", {
    bubbles: !0,
    cancelable: !0
  }) : (p = document.createEvent("Event"), p.initEvent("move", !0, !0)), p.to = a, p.from = e, p.dragged = t, p.draggedRect = l, p.related = i || a, p.relatedRect = u || De(a), p.willInsertAfter = v, p.originalEvent = m, e.dispatchEvent(p), n && (s = n.call(o, p, m)), s;
}
function Ba(e) {
  e.draggable = !1;
}
function An() {
  Za = !1;
}
function Pn(e, a, t) {
  var l = De(Wt(t.el, 0, t.options, !0)), i = oo(t.el, t.options, de), u = 10;
  return a ? e.clientX < i.left - u || e.clientY < l.top && e.clientX < l.right : e.clientY < i.top - u || e.clientY < l.bottom && e.clientX < l.left;
}
function Rn(e, a, t) {
  var l = De(ul(t.el, t.options.draggable)), i = oo(t.el, t.options, de), u = 10;
  return a ? e.clientX > i.right + u || e.clientY > l.bottom && e.clientX > l.left : e.clientY > i.bottom + u || e.clientX > l.right && e.clientY > l.top;
}
function On(e, a, t, l, i, u, m, v) {
  var p = l ? e.clientY : e.clientX, o = l ? t.height : t.width, n = l ? t.top : t.left, s = l ? t.bottom : t.right, g = !1;
  if (!m) {
    if (v && fa < o * i) {
      if (!aa && (ta === 1 ? p > n + o * u / 2 : p < s - o * u / 2) && (aa = !0), aa)
        g = !0;
      else if (ta === 1 ? p < n + fa : p > s - fa)
        return -ta;
    } else if (p > n + o * (1 - i) / 2 && p < s - o * (1 - i) / 2)
      return Nn(a);
  }
  return g = g || m, g && (p < n + o * u / 2 || p > s - o * u / 2) ? p > n + o / 2 ? 1 : -1 : 0;
}
function Nn(e) {
  return Ke(Y) < Ke(e) ? 1 : -1;
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
function Qa(e) {
  return clearTimeout(e);
}
Ua && be(document, "touchmove", function(e) {
  (ne.active || Ft) && e.cancelable && e.preventDefault();
});
ne.utils = {
  on: be,
  off: fe,
  css: ie,
  find: eo,
  is: function(a, t) {
    return !!Je(a, t, a, !1);
  },
  extend: kn,
  throttle: to,
  closest: Je,
  toggleClass: je,
  clone: lo,
  index: Ke,
  nextTick: pa,
  cancelNextTick: Qa,
  detectDirection: no,
  getChild: Wt,
  expando: Be
};
ne.get = function(e) {
  return e[Be];
};
ne.mount = function() {
  for (var e = arguments.length, a = new Array(e), t = 0; t < e; t++)
    a[t] = arguments[t];
  a[0].constructor === Array && (a = a[0]), a.forEach(function(l) {
    if (!l.prototype || !l.prototype.constructor)
      throw "Sortable: Mounted plugin must be a constructor function, not ".concat({}.toString.call(l));
    l.utils && (ne.utils = at(at({}, ne.utils), l.utils)), ia.mount(l);
  });
};
ne.create = function(e, a) {
  return new ne(e, a);
};
ne.version = gn;
var Te = [], Yt, _a, el = !1, ja, qa, $a, Xt;
function zn() {
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
      this.sortable.nativeDraggable ? be(document, "dragover", this._handleAutoScroll) : this.options.supportPointer ? be(document, "pointermove", this._handleFallbackAutoScroll) : l.touches ? be(document, "touchmove", this._handleFallbackAutoScroll) : be(document, "mousemove", this._handleFallbackAutoScroll);
    },
    dragOverCompleted: function(t) {
      var l = t.originalEvent;
      !this.options.dragOverBubble && !l.rootEl && this._handleAutoScroll(l);
    },
    drop: function() {
      this.sortable.nativeDraggable ? fe(document, "dragover", this._handleAutoScroll) : (fe(document, "pointermove", this._handleFallbackAutoScroll), fe(document, "touchmove", this._handleFallbackAutoScroll), fe(document, "mousemove", this._handleFallbackAutoScroll)), El(), ba(), wn();
    },
    nulling: function() {
      $a = _a = Yt = el = Xt = ja = qa = null, Te.length = 0;
    },
    _handleFallbackAutoScroll: function(t) {
      this._handleAutoScroll(t, !0);
    },
    _handleAutoScroll: function(t, l) {
      var i = this, u = (t.touches ? t.touches[0] : t).clientX, m = (t.touches ? t.touches[0] : t).clientY, v = document.elementFromPoint(u, m);
      if ($a = t, l || this.options.forceAutoScrollFallback || oa || nt || Qt) {
        Wa(t, this.options, v, l);
        var p = mt(v, !0);
        el && (!Xt || u !== ja || m !== qa) && (Xt && El(), Xt = setInterval(function() {
          var o = mt(document.elementFromPoint(u, m), !0);
          o !== p && (p = o, ba()), Wa(t, i.options, o, l);
        }, 10), ja = u, qa = m);
      } else {
        if (!this.options.bubbleScroll || mt(v, !0) === tt()) {
          ba();
          return;
        }
        Wa(t, this.options, mt(v, !1), !1);
      }
    }
  }, it(e, {
    pluginName: "scroll",
    initializeByDefault: !0
  });
}
function ba() {
  Te.forEach(function(e) {
    clearInterval(e.pid);
  }), Te = [];
}
function El() {
  clearInterval(Xt);
}
var Wa = to(function(e, a, t, l) {
  if (a.scroll) {
    var i = (e.touches ? e.touches[0] : e).clientX, u = (e.touches ? e.touches[0] : e).clientY, m = a.scrollSensitivity, v = a.scrollSpeed, p = tt(), o = !1, n;
    _a !== t && (_a = t, ba(), Yt = a.scroll, n = a.scrollFn, Yt === !0 && (Yt = mt(t, !0)));
    var s = 0, g = Yt;
    do {
      var f = g, k = De(f), $ = k.top, I = k.bottom, E = k.left, C = k.right, S = k.width, D = k.height, P = void 0, K = void 0, te = f.scrollWidth, ce = f.scrollHeight, se = ie(f), W = f.scrollLeft, O = f.scrollTop;
      f === p ? (P = S < te && (se.overflowX === "auto" || se.overflowX === "scroll" || se.overflowX === "visible"), K = D < ce && (se.overflowY === "auto" || se.overflowY === "scroll" || se.overflowY === "visible")) : (P = S < te && (se.overflowX === "auto" || se.overflowX === "scroll"), K = D < ce && (se.overflowY === "auto" || se.overflowY === "scroll"));
      var N = P && (Math.abs(C - i) <= m && W + S < te) - (Math.abs(E - i) <= m && !!W), V = K && (Math.abs(I - u) <= m && O + D < ce) - (Math.abs($ - u) <= m && !!O);
      if (!Te[s])
        for (var R = 0; R <= s; R++)
          Te[R] || (Te[R] = {});
      (Te[s].vx != N || Te[s].vy != V || Te[s].el !== f) && (Te[s].el = f, Te[s].vx = N, Te[s].vy = V, clearInterval(Te[s].pid), (N != 0 || V != 0) && (o = !0, Te[s].pid = setInterval(function() {
        l && this.layer === 0 && ne.active._onTouchMove($a);
        var L = Te[this.layer].vy ? Te[this.layer].vy * v : 0, T = Te[this.layer].vx ? Te[this.layer].vx * v : 0;
        typeof n == "function" && n.call(ne.dragged.parentNode[Be], T, L, e, $a, Te[this.layer].el) !== "continue" || ao(Te[this.layer].el, T, L);
      }.bind({
        layer: s
      }), 24))), s++;
    } while (a.bubbleScroll && g !== p && (g = mt(g, !1)));
    el = o;
  }
}, 30), co = function(a) {
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
function cl() {
}
cl.prototype = {
  startIndex: null,
  dragStart: function(a) {
    var t = a.oldDraggableIndex;
    this.startIndex = t;
  },
  onSpill: function(a) {
    var t = a.dragEl, l = a.putSortable;
    this.sortable.captureAnimationState(), l && l.captureAnimationState();
    var i = Wt(this.sortable.el, this.startIndex, this.options);
    i ? this.sortable.el.insertBefore(t, i) : this.sortable.el.appendChild(t), this.sortable.animateAll(), l && l.animateAll();
  },
  drop: co
};
it(cl, {
  pluginName: "revertOnSpill"
});
function vl() {
}
vl.prototype = {
  onSpill: function(a) {
    var t = a.dragEl, l = a.putSortable, i = l || this.sortable;
    i.captureAnimationState(), t.parentNode && t.parentNode.removeChild(t), i.animateAll();
  },
  drop: co
};
it(vl, {
  pluginName: "removeOnSpill"
});
ne.mount(new zn());
ne.mount(vl, cl);
function Ln(e, a) {
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
  return ht(() => {
    for (const l of a.keys()) t(l);
  }), {
    mounted(l) {
      const i = l.querySelector(".work-field-builder") ?? l;
      a.set(l, new ne(i, {
        draggable: ".work-reorder-entry",
        handle: ".work-reorder-handle",
        forceFallback: !0,
        fallbackOnBody: !1,
        ghostClass: "work-drag-ghost",
        onEnd(u) {
          const m = u.oldDraggableIndex, v = u.newDraggableIndex;
          Ln(u, ".work-reorder-entry"), m !== void 0 && v !== void 0 && m !== v && e(m, v);
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
}, _n = /* @__PURE__ */ pe({
  __name: "OptionsEditor",
  props: {
    field: {}
  },
  emits: ["validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, i = "options:" + ll(), u = H(() => t.field.options ?? []), m = H(() => u.value.every((s, g) => !!s.id && u.value.findIndex((f) => f.id === s.id) === g));
    Ce(m, (s) => l("validity", s, i), { immediate: !0 }), ht(() => l("validity", !0, i));
    function v(s, g) {
      Kl(u.value, s, g - s), u.value.forEach((f, k) => f.order = k);
    }
    const p = vo(v), o = ["primary", "success", "info", "warn", "danger", "secondary"];
    function n() {
      let s = u.value.length + 1;
      for (; u.value.some((g) => g.id === `option_${s}`); ) s++;
      (t.field.options ??= []).push({ id: `option_${s}`, label: "New option", order: u.value.length });
    }
    return (s, g) => (c(), y("section", Bn, [
      g[4] || (g[4] = d("header", { class: "work-row" }, [
        d("h4", null, "Options"),
        d("span", { class: "work-muted work-small" }, "Stable IDs keep existing values when labels change."),
        d("span", { class: "work-spacer" })
      ], -1)),
      et((c(), y("div", jn, [
        (c(!0), y(J, null, le(u.value, (f, k) => (c(), y("div", {
          key: k,
          class: "work-option-row work-reorder-entry"
        }, [
          h(r(X), {
            type: "button",
            class: "work-icon-button work-reorder-handle",
            "aria-label": "Drag option; arrow keys reorder",
            onKeydown: [
              Oe(ye(($) => v(k, k - 1), ["prevent"]), ["up"]),
              Oe(ye(($) => v(k, k + 1), ["prevent"]), ["down"])
            ],
            severity: "secondary",
            text: "",
            size: "small"
          }, {
            default: z(() => [
              h(r(_), {
                icon: "tabler:grip-vertical",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["onKeydown"]),
          d("label", qn, [
            g[0] || (g[0] = M("Label", -1)),
            h(r(me), {
              modelValue: f.label,
              "onUpdate:modelValue": ($) => f.label = $,
              "aria-label": "Option label"
            }, null, 8, ["modelValue", "onUpdate:modelValue"])
          ]),
          d("label", Wn, [
            g[1] || (g[1] = M("ID", -1)),
            h(r(me), {
              modelValue: f.id,
              "onUpdate:modelValue": ($) => f.id = $,
              class: "work-option-code",
              required: "",
              "aria-label": "Option ID"
            }, null, 8, ["modelValue", "onUpdate:modelValue"])
          ]),
          d("div", Kn, [
            d("label", Gn, [
              g[2] || (g[2] = M("Color", -1)),
              d("span", Hn, [
                d("span", {
                  class: pt(["work-color-swatch", "work-swatch-" + (f.color || "secondary")]),
                  "aria-hidden": "true"
                }, null, 2),
                h(r(oe), {
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
              g[3] || (g[3] = M("Category", -1)),
              h(r(oe), {
                "model-value": f.category,
                "aria-label": "Option category",
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                showClear: "",
                options: ["triage", "backlog", ...r(Wl)].map(($) => ({ label: r(Dt)($), value: $ })),
                "onUpdate:modelValue": ($) => f.category = $ || void 0
              }, null, 8, ["model-value", "options", "onUpdate:modelValue"])
            ])
          ]),
          d("div", Xn, [
            h(r(X), {
              "aria-label": "Option earlier",
              severity: "secondary",
              size: "small",
              disabled: k === 0,
              onClick: ($) => v(k, k - 1),
              text: ""
            }, {
              default: z(() => [
                h(r(_), {
                  icon: "tabler:arrow-up",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["disabled", "onClick"]),
            h(r(X), {
              "aria-label": "Option later",
              severity: "secondary",
              size: "small",
              disabled: k === u.value.length - 1,
              onClick: ($) => v(k, k + 1),
              text: ""
            }, {
              default: z(() => [
                h(r(_), {
                  icon: "tabler:arrow-down",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["disabled", "onClick"]),
            h(r(X), {
              label: "Remove",
              "aria-label": "Remove option",
              severity: "secondary",
              text: "",
              size: "small",
              onClick: ($) => u.value.splice(k, 1)
            }, {
              icon: z(() => [
                h(r(_), {
                  icon: "tabler:trash",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["onClick"])
          ])
        ]))), 128)),
        m.value ? U("", !0) : (c(), y("p", Jn, "Option IDs must be nonempty and unique.")),
        d("div", Zn, [
          h(r(X), {
            label: "Add option",
            severity: "secondary",
            size: "small",
            onClick: n,
            outlined: ""
          }, {
            icon: z(() => [
              h(r(_), {
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
      u.value.length ? U("", !0) : (c(), y("p", Qn, "Add the choices people can select for this field."))
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
}, gs = { class: "work-stack work-tight" }, ys = { class: "work-stack work-tight" }, ks = { class: "work-stack work-tight" }, ws = { class: "work-stack work-tight" }, Vs = { class: "work-stack" }, $s = { class: "work-row work-add-definition" }, xs = { class: "work-stack work-tight" }, Cs = /* @__PURE__ */ pe({
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
    const t = e, l = a, i = H(() => t.draft.fields ?? []), u = B(""), m = B(""), v = B({}), p = vo((N, V) => se(N, V - N));
    function o(N) {
      return (t.draft.item_types ?? []).filter((V) => V.fields.includes(N)).map((V) => V.title || ke(V.id));
    }
    async function n(N) {
      if (!m.value) {
        m.value = N.code;
        try {
          const V = await t.guardRemoval?.("fields", N.code);
          v.value[N.code] = V ?? "", V || la(t.draft, "fields", N.code);
        } finally {
          m.value = "";
        }
      }
    }
    const s = Object.entries({ text: "Text", int: "Whole number", dec: "Decimal number", quantity: "Measurement", bool: "Yes or no", time: "Date or time", ref: "Reference", record: "Structured data", option: "Choice", principal: "Person or group", item: "Work item", rank: "Order", rich_text: "Formatted text", formula: "Formula", rollup: "Related item calculation", counter: "Counter" }).map(([N, V]) => ({ value: N, label: V })), g = [{ label: "None", value: "none" }, { label: "Exact matches", value: "key" }, { label: "Numeric ranges", value: "number" }], f = ["int", "dec", "quantity"], k = H(() => new Map(t.installedTypes?.map((N) => [N.id, N]))), $ = H(() => [...s, ...(t.installedTypes ?? []).map((N) => ({ value: N.id, label: N.title }))]), I = {};
    function E(N) {
      return N.type && N.type !== "value" ? N.type : N.form ?? "text";
    }
    function C(N) {
      return N.type ? k.value.get(N.type) : void 0;
    }
    function S(N) {
      const V = C(N)?.config_schema;
      return V && Eo(V).length ? V : void 0;
    }
    function D(N) {
      const V = C(N);
      return !!V?.config_schema || ["dec", "quantity", "ref", "time", "record"].includes(V?.form ?? N.form ?? "") || !!N.config;
    }
    function P(N) {
      const V = C(N), R = V?.form ?? N.form ?? "text";
      return g.filter(({ value: L }) => L === "none" || (!V?.indexes || V.indexes.includes(L)) && R !== "record" && (L !== "number" || f.includes(R) || N.type === "option"));
    }
    function K(N) {
      N.index && !P(N).some((V) => V.value === N.index) && delete N.index;
    }
    function te(N, V) {
      const R = k.value.get(V);
      if (R) {
        if (R.id === N.type) return;
        N.type = R.id, N.form = R.form, delete N.options, delete N.config, K(N);
        return;
      }
      C(N) && delete N.config;
      const L = { option: "text", principal: "ref", item: "ref", rank: "text", rich_text: "text", formula: "int", rollup: "int", counter: "int" };
      L[V] ? (N.type = V, N.form = L[V]) : (delete N.type, N.form = V), V !== "option" ? delete N.options : N.options ??= [], V === "rich_text" && (N.config = { format: "json" }), K(N);
    }
    function ce(N, V) {
      N.form = V, K(N);
    }
    function se(N, V) {
      Kl(i.value, N, V);
      for (const R of t.draft.item_types ?? []) {
        const L = new Set(R.fields);
        R.fields = i.value.filter((T) => L.has(T.code)).map((T) => T.code);
      }
    }
    function W(N, V) {
      try {
        Ao(t.draft, N, V.value), delete v.value[N.code];
      } catch (R) {
        v.value[N.code] = R.message, V.value = N.code;
      }
    }
    function O() {
      !/^[a-z][a-z0-9_]*$/.test(u.value) || i.value.some((N) => N.code === u.value) || ((t.draft.fields ??= []).push({ code: u.value, form: "text", cardinality: "one" }), u.value = "");
    }
    return (N, V) => (c(), y("section", es, [
      d("header", ts, [
        V[2] || (V[2] = d("div", null, [
          d("h2", null, "Fields"),
          d("p", { class: "work-muted work-small" }, "Shape the information each item carries. Drag the handle or use the arrows to arrange fields.")
        ], -1)),
        h(r(Ne), {
          class: "kx-tag-sm",
          severity: "secondary"
        }, {
          default: z(() => [
            M(A(i.value.length) + " " + A(i.value.length === 1 ? "field" : "fields"), 1)
          ]),
          _: 1
        })
      ]),
      et((c(), q(Da, {
        columns: "fields",
        count: i.value.length
      }, {
        default: z(() => [
          (c(!0), y(J, null, le(i.value, (R, L) => (c(), q(Ta, {
            title: r(ze)(R),
            code: R.code,
            kind: C(R)?.title || r(s).find((T) => T.value === E(R))?.label || r(ke)(E(R)),
            key: R.id ?? L,
            class: "work-field-row work-reorder-entry work-stack"
          }, {
            handle: z(() => [
              h(r(X), {
                type: "button",
                class: "work-reorder-handle work-icon-button",
                "aria-label": "Drag " + r(ze)(R) + " or use the arrow keys to reorder",
                onKeydown: [
                  Oe(ye((T) => se(L, -1), ["prevent"]), ["up"]),
                  Oe(ye((T) => se(L, 1), ["prevent"]), ["down"])
                ],
                severity: "secondary",
                text: "",
                size: "small"
              }, {
                default: z(() => [
                  h(r(_), {
                    icon: "tabler:grip-vertical",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["aria-label", "onKeydown"])
            ]),
            flags: z(() => [
              R.track ? (c(), q(r(Ne), {
                key: 0,
                class: "kx-tag-sm",
                severity: "secondary",
                value: "Tracked"
              })) : U("", !0),
              R.intervals ? (c(), q(r(Ne), {
                key: 1,
                class: "kx-tag-sm",
                severity: "secondary",
                value: "Intervals"
              })) : U("", !0)
            ]),
            usage: z(() => [
              o(R.code).length ? (c(), y("details", as, [
                d("summary", ls, "Used by " + A(o(R.code).length) + " " + A(o(R.code).length === 1 ? "type" : "types"), 1),
                d("span", os, A(o(R.code).join(", ")), 1)
              ])) : U("", !0)
            ]),
            actions: z(() => [
              h(r(X), {
                "aria-label": "Move " + r(ze)(R) + " earlier",
                severity: "secondary",
                disabled: L === 0,
                onClick: (T) => se(L, -1),
                text: "",
                size: "small"
              }, {
                default: z(() => [
                  h(r(_), {
                    icon: "tabler:arrow-up",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["aria-label", "disabled", "onClick"]),
              h(r(X), {
                "aria-label": "Move " + r(ze)(R) + " later",
                severity: "secondary",
                disabled: L === i.value.length - 1,
                onClick: (T) => se(L, 1),
                text: "",
                size: "small"
              }, {
                default: z(() => [
                  h(r(_), {
                    icon: "tabler:arrow-down",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["aria-label", "disabled", "onClick"]),
              h(r(X), {
                severity: "secondary",
                text: "",
                size: "small",
                disabled: !!m.value,
                onClick: (T) => n(R),
                "aria-label": "Remove field"
              }, {
                default: z(() => [
                  h(r(_), {
                    icon: "tabler:trash",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["disabled", "onClick"])
            ]),
            default: z(() => [
              v.value[R.code] ? (c(), y("p", is, A(v.value[R.code]), 1)) : U("", !0),
              (c(!0), y(J, null, le(e.issues?.filter((T) => T.code === R.code) ?? [], (T) => (c(), y("p", {
                key: T.what,
                class: "work-error work-small",
                role: "alert"
              }, A(r(Sa)(T)), 1))), 128)),
              d("div", ns, [
                d("label", ss, [
                  V[3] || (V[3] = M("Title", -1)),
                  h(r(me), {
                    modelValue: R.title,
                    "onUpdate:modelValue": (T) => R.title = T,
                    "aria-label": "Field title",
                    maxlength: "255",
                    placeholder: r(ze)(R)
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder"])
                ]),
                d("label", rs, [
                  V[4] || (V[4] = M("Field identifier", -1)),
                  h(r(me), {
                    value: R.code,
                    "aria-label": "Field code",
                    required: "",
                    pattern: "[a-z][a-z0-9_]*",
                    onInput: (T) => W(R, T.target)
                  }, null, 8, ["value", "onInput"])
                ]),
                d("label", ds, [
                  V[5] || (V[5] = M("Kind", -1)),
                  h(r(oe), {
                    "aria-label": "Kind",
                    "model-value": E(R),
                    "onUpdate:modelValue": (T) => te(R, T),
                    appendTo: "self",
                    options: $.value,
                    optionLabel: "label",
                    optionValue: "value"
                  }, null, 8, ["model-value", "onUpdate:modelValue", "options"])
                ]),
                d("label", us, [
                  V[6] || (V[6] = M("Values allowed", -1)),
                  h(r(oe), {
                    "aria-label": "Values allowed",
                    "model-value": R.cardinality ?? "one",
                    "onUpdate:modelValue": (T) => R.cardinality = T,
                    appendTo: "self",
                    options: [{ label: "One value", value: "one" }, { label: "Multiple unique values", value: "set" }, { label: "Ordered values", value: "list" }],
                    optionLabel: "label",
                    optionValue: "value"
                  }, null, 8, ["model-value", "onUpdate:modelValue"])
                ]),
                d("label", cs, [
                  V[7] || (V[7] = M("Search support", -1)),
                  h(r(oe), {
                    "aria-label": "Search support",
                    "model-value": R.index ?? "none",
                    "onUpdate:modelValue": (T) => R.index = T,
                    appendTo: "self",
                    options: P(R),
                    optionLabel: "label",
                    optionValue: "value"
                  }, null, 8, ["model-value", "onUpdate:modelValue", "options"])
                ])
              ]),
              S(R) ? (c(), q(il, {
                key: R.type,
                schema: S(R),
                "model-value": R.config ?? I,
                "onUpdate:modelValue": (T) => R.config = T,
                onValidity: (T) => l("validity", "config-" + L, T)
              }, null, 8, ["schema", "model-value", "onUpdate:modelValue", "onValidity"])) : U("", !0),
              d("section", vs, [
                V[10] || (V[10] = d("h4", { class: "work-group-title" }, "History", -1)),
                d("div", ms, [
                  d("div", fs, [
                    V[8] || (V[8] = d("div", { class: "work-row-main" }, [
                      d("strong", null, "Track changes"),
                      d("p", { class: "work-muted work-small" }, "Record each value change in the item history.")
                    ], -1)),
                    h(r(We), {
                      modelValue: R.track,
                      "onUpdate:modelValue": (T) => R.track = T,
                      "aria-label": "Track changes"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ]),
                  d("div", ps, [
                    V[9] || (V[9] = d("div", { class: "work-row-main" }, [
                      d("strong", null, "Track intervals"),
                      d("p", { class: "work-muted work-small" }, "Measure how long each value stays in effect.")
                    ], -1)),
                    h(r(We), {
                      modelValue: R.intervals,
                      "onUpdate:modelValue": (T) => R.intervals = T,
                      "aria-label": "Track intervals"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ])
                ])
              ]),
              R.type === "option" ? (c(), q(_n, {
                key: 2,
                field: R,
                onValidity: V[0] || (V[0] = (T, F) => l("validity", F, T))
              }, null, 8, ["field"])) : U("", !0),
              R.type === "formula" || R.type === "rollup" ? (c(), y("label", bs, [
                V[11] || (V[11] = M("Result type", -1)),
                h(r(oe), {
                  "model-value": R.form,
                  "onUpdate:modelValue": (T) => ce(R, T),
                  "aria-label": "Result type",
                  options: r(s).slice(0, 8),
                  optionLabel: "label",
                  optionValue: "value",
                  appendTo: "self"
                }, null, 8, ["model-value", "onUpdate:modelValue", "options"])
              ])) : U("", !0),
              R.type === "formula" ? (c(), y("label", hs, [
                V[12] || (V[12] = M("Expression", -1)),
                h(r(me), {
                  modelValue: R.expression,
                  "onUpdate:modelValue": (T) => R.expression = T
                }, null, 8, ["modelValue", "onUpdate:modelValue"])
              ])) : U("", !0),
              R.type === "rollup" ? (c(), y(J, { key: 5 }, [
                d("label", gs, [
                  V[13] || (V[13] = M("Of", -1)),
                  h(r(me), {
                    modelValue: R.of,
                    "onUpdate:modelValue": (T) => R.of = T
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                d("label", ys, [
                  V[14] || (V[14] = M("Function", -1)),
                  h(r(me), {
                    modelValue: R.fn,
                    "onUpdate:modelValue": (T) => R.fn = T
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                d("label", ks, [
                  V[15] || (V[15] = M("Field", -1)),
                  h(r(me), {
                    modelValue: R.field,
                    "onUpdate:modelValue": (T) => R.field = T
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                d("label", ws, [
                  V[16] || (V[16] = M("Order by", -1)),
                  h(r(oe), {
                    "model-value": R.by,
                    "aria-label": "Rollup order",
                    options: ["rank", "time"],
                    showClear: "",
                    appendTo: "self",
                    "onUpdate:modelValue": (T) => R.by = T || void 0
                  }, null, 8, ["model-value", "onUpdate:modelValue"])
                ]),
                h(sl, {
                  modelValue: R.where,
                  "onUpdate:modelValue": (T) => R.where = T,
                  draft: e.draft,
                  "board-id": e.boardId,
                  label: "Include related items when",
                  onValidity: (T) => l("validity", "rollup-" + L, T)
                }, null, 8, ["modelValue", "onUpdate:modelValue", "draft", "board-id", "onValidity"])
              ], 64)) : U("", !0),
              !S(R) && D(R) ? (c(), q(bt, {
                key: 6,
                label: "Field configuration",
                "model-value": R.config,
                shape: "object",
                "onUpdate:modelValue": (T) => R.config = T,
                onValidity: (T) => l("validity", "config-" + L, T)
              }, null, 8, ["model-value", "onUpdate:modelValue", "onValidity"])) : U("", !0),
              d("section", Vs, [
                V[17] || (V[17] = d("h4", { class: "work-group-title" }, "Access", -1)),
                (c(), y(J, null, le(["read", "write"], (T) => h(Jl, {
                  "board-id": e.boardId,
                  key: T,
                  label: T === "read" ? "Who can read" : "Who can edit",
                  "model-value": R.access?.[T],
                  "onUpdate:modelValue": (F) => R.access = { ...R.access, [T]: F },
                  onValidity: (F) => l("validity", "access-" + L + T, F)
                }, null, 8, ["board-id", "label", "model-value", "onUpdate:modelValue", "onValidity"])), 64))
              ])
            ]),
            _: 2
          }, 1032, ["title", "code", "kind"]))), 128)),
          d("div", $s, [
            d("label", xs, [
              V[18] || (V[18] = M("New field identifier", -1)),
              h(r(me), {
                modelValue: u.value,
                "onUpdate:modelValue": V[1] || (V[1] = (R) => u.value = R),
                onKeydown: Oe(ye(O, ["prevent"]), ["enter"])
              }, null, 8, ["modelValue", "onKeydown"])
            ]),
            h(r(X), {
              label: "Add field",
              severity: "secondary",
              disabled: !u.value.trim(),
              onClick: O,
              outlined: ""
            }, {
              icon: z(() => [
                h(r(_), {
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
}, qt = /* @__PURE__ */ pe({
  __name: "ChipPicker",
  props: {
    label: {},
    options: {},
    modelValue: {},
    disabled: { type: Boolean }
  },
  emits: ["update:modelValue"],
  setup(e, { emit: a }) {
    const t = e, l = a, i = B(""), u = H(() => t.options.map((p) => typeof p == "string" ? { value: p } : p)), m = H(() => u.value.filter((p) => (p.label ?? ke(p.value)).toLocaleLowerCase().includes(i.value.toLocaleLowerCase())));
    function v(p) {
      if (t.disabled) return;
      const o = t.modelValue ?? [];
      l("update:modelValue", o.includes(p) ? o.filter((n) => n !== p) : [...o, p]);
    }
    return (p, o) => (c(), y("fieldset", {
      class: "work-chip-picker",
      disabled: e.disabled
    }, [
      d("legend", null, A(e.label), 1),
      e.options.length > 10 ? (c(), q(r(me), {
        key: 0,
        modelValue: i.value,
        "onUpdate:modelValue": o[0] || (o[0] = (n) => i.value = n),
        type: "search",
        "aria-label": "Find " + e.label.toLowerCase(),
        placeholder: "Find a choice…"
      }, null, 8, ["modelValue", "aria-label"])) : U("", !0),
      d("div", Ts, [
        h(r(nl), {
          "model-value": e.modelValue ?? [],
          options: m.value.map((n) => ({ value: n.value, label: n.label ?? r(ke)(n.value) })),
          optionLabel: "label",
          optionValue: "value",
          multiple: "",
          disabled: e.disabled,
          "aria-label": e.label,
          "onUpdate:modelValue": o[1] || (o[1] = (n) => l("update:modelValue", n ?? []))
        }, null, 8, ["model-value", "options", "disabled", "aria-label"]),
        (c(!0), y(J, null, le(e.modelValue?.filter((n) => !u.value.some((s) => s.value === n)) ?? [], (n) => (c(), q(r(X), {
          severity: "secondary",
          text: "",
          size: "small",
          key: n,
          type: "button",
          class: "work-choice work-unavailable",
          "aria-label": "Remove unavailable " + n,
          onClick: (s) => v(n)
        }, {
          default: z(() => [
            M(A(r(ke)(n)) + " · unavailable ×", 1)
          ]),
          _: 2
        }, 1032, ["aria-label", "onClick"]))), 128))
      ]),
      e.options.length ? U("", !0) : (c(), y("span", Ds, "No choices declared."))
    ], 8, Ss));
  }
}), Us = {
  class: "work-stack",
  "aria-label": "Item types editor"
}, Is = { class: "work-section-heading" }, Es = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, As = { class: "work-definition-meta" }, Ps = { class: "work-settings-grid" }, Rs = { class: "work-stack work-tight" }, Os = { class: "work-stack work-tight" }, Ns = { class: "work-stack work-tight" }, Ms = { class: "work-stack work-tight" }, Fs = {
  key: 0,
  class: "work-stack work-tight work-small"
}, zs = {
  key: 0,
  class: "kx-empty"
}, Ls = { class: "work-row work-add-definition" }, Bs = { class: "work-stack work-tight" }, js = {
  key: 0,
  class: "work-error work-small"
}, qs = /* @__PURE__ */ pe({
  __name: "TypesEditor",
  props: {
    draft: {},
    guardRemoval: { type: Function },
    issues: {}
  },
  setup(e) {
    const a = e, t = H(() => a.draft.item_types ?? []), l = B(""), i = B(""), u = B(""), m = H(() => /^[a-z][a-z0-9_]*$/.test(l.value) && !t.value.some((g) => g.id === l.value));
    function v() {
      m.value && ((a.draft.item_types ??= []).push({ id: l.value, title: ke(l.value), process: a.draft.processes?.[0]?.id ?? "", fields: [] }), l.value = "");
    }
    function p(g, f) {
      const k = g.id;
      g.id = f;
      for (const $ of t.value) $.parent_types && ($.parent_types = $.parent_types.map((I) => I === k ? f : I));
    }
    function o(g, f) {
      g.fields = f, g.inherit && (g.inherit = g.inherit.filter((k) => f.includes(k)));
    }
    function n(g) {
      return t.value.filter((f) => f.id !== g.id && f.parent_types?.includes(g.id)).map((f) => f.title || ke(f.id));
    }
    async function s(g) {
      if (!u.value) {
        if (n(g).length) {
          i.value = `${g.title || ke(g.id)} is a parent type for ${n(g).join(", ")}. Remove those parent selections first.`;
          return;
        }
        u.value = g.id, i.value = "";
        try {
          const f = await a.guardRemoval?.("item_types", g.id);
          f ? i.value = f : la(a.draft, "item_types", g.id);
        } finally {
          u.value = "";
        }
      }
    }
    return (g, f) => (c(), y("section", Us, [
      d("header", Is, [
        f[1] || (f[1] = d("div", null, [
          d("h2", null, "Item types"),
          d("p", { class: "work-muted work-small" }, "Choose the fields, parent relationships and process for each kind of work.")
        ], -1)),
        h(r(Ne), {
          class: "kx-tag-sm",
          severity: "secondary"
        }, {
          default: z(() => [
            M(A(t.value.length) + " " + A(t.value.length === 1 ? "type" : "types"), 1)
          ]),
          _: 1
        })
      ]),
      i.value ? (c(), y("p", Es, A(i.value), 1)) : U("", !0),
      h(Da, {
        columns: "types",
        count: t.value.length
      }, {
        default: z(() => [
          (c(!0), y(J, null, le(t.value, (k, $) => (c(), q(Ta, {
            title: k.title || r(ke)(k.id),
            code: k.id,
            kind: e.draft.processes?.find((I) => I.id === k.process)?.name || r(ke)(k.process),
            key: $,
            class: "work-type-card"
          }, {
            usage: z(() => [
              d("span", As, [
                h(r(Ne), {
                  class: "kx-tag-sm",
                  severity: "secondary"
                }, {
                  default: z(() => [
                    M(A(k.fields.length) + " " + A(k.fields.length === 1 ? "field" : "fields"), 1)
                  ]),
                  _: 2
                }, 1024),
                n(k).length ? (c(), q(r(Ne), {
                  key: 0,
                  class: "kx-tag-sm",
                  severity: "secondary"
                }, {
                  default: z(() => [
                    M("Parent of " + A(n(k).join(", ")), 1)
                  ]),
                  _: 2
                }, 1024)) : U("", !0)
              ])
            ]),
            actions: z(() => [
              h(r(X), {
                severity: "secondary",
                text: "",
                size: "small",
                disabled: !!u.value,
                onClick: (I) => s(k),
                "aria-label": "Remove type"
              }, {
                default: z(() => [
                  h(r(_), {
                    icon: "tabler:trash",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["disabled", "onClick"])
            ]),
            default: z(() => [
              (c(!0), y(J, null, le(e.issues?.filter((I) => I.code === "item_type " + k.id) ?? [], (I) => (c(), y("p", {
                key: I.what,
                class: "work-error work-small",
                role: "alert"
              }, A(r(Sa)(I)), 1))), 128)),
              d("div", Ps, [
                d("label", Rs, [
                  f[2] || (f[2] = M("Identifier", -1)),
                  h(r(me), {
                    value: k.id,
                    onChange: (I) => p(k, I.target.value),
                    required: "",
                    pattern: "[a-z][a-z0-9_]*"
                  }, null, 8, ["value", "onChange"])
                ]),
                d("label", Os, [
                  f[3] || (f[3] = M("Title", -1)),
                  h(r(me), {
                    modelValue: k.title,
                    "onUpdate:modelValue": (I) => k.title = I,
                    placeholder: r(ke)(k.id)
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder"])
                ]),
                d("label", Ns, [
                  f[4] || (f[4] = M("Process", -1)),
                  h(r(oe), {
                    modelValue: k.process,
                    "onUpdate:modelValue": (I) => k.process = I,
                    required: "",
                    appendTo: "self",
                    optionLabel: "label",
                    optionValue: "value",
                    optionDisabled: "disabled",
                    options: [...(e.draft.processes ?? []).map((I) => ({ label: I.name || r(ke)(I.id), value: I.id, disabled: !1 }))]
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                ])
              ]),
              h(qt, {
                label: "Fields",
                options: (e.draft.fields ?? []).map((I) => ({ value: I.code, label: r(ze)(I) })),
                "model-value": k.fields,
                "onUpdate:modelValue": (I) => o(k, I)
              }, null, 8, ["options", "model-value", "onUpdate:modelValue"]),
              h(qt, {
                label: "Parent types",
                options: t.value.map((I) => ({ value: I.id, label: I.title || r(ke)(I.id) })),
                modelValue: k.parent_types,
                "onUpdate:modelValue": (I) => k.parent_types = I
              }, null, 8, ["options", "modelValue", "onUpdate:modelValue"]),
              d("div", Ms, [
                h(qt, {
                  label: "Inherit from parent",
                  options: k.fields.map((I) => ({ value: I, label: r(ze)(e.draft.fields?.find((E) => E.code === I) ?? { code: I }) })),
                  modelValue: k.inherit,
                  "onUpdate:modelValue": (I) => k.inherit = I
                }, null, 8, ["options", "modelValue", "onUpdate:modelValue"]),
                f[5] || (f[5] = d("p", { class: "work-muted work-small" }, "These fields resolve from the parent when this item has no own value.", -1))
              ]),
              k.parent_types?.length ? (c(), y("label", Fs, [
                f[6] || (f[6] = M("When the parent moves", -1)),
                h(r(oe), {
                  modelValue: k.move_children,
                  "onUpdate:modelValue": (I) => k.move_children = I,
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
          t.value.length ? U("", !0) : (c(), y("p", zs, "Add an item type to connect fields to a process.")),
          d("div", Ls, [
            d("label", Bs, [
              f[7] || (f[7] = M("New type identifier", -1)),
              h(r(me), {
                modelValue: l.value,
                "onUpdate:modelValue": f[0] || (f[0] = (k) => l.value = k),
                placeholder: "new_type",
                onKeydown: Oe(ye(v, ["prevent"]), ["enter"])
              }, null, 8, ["modelValue", "onKeydown"])
            ]),
            h(r(X), {
              label: "Add type",
              severity: "secondary",
              disabled: !m.value,
              onClick: v,
              outlined: ""
            }, {
              icon: z(() => [
                h(r(_), {
                  icon: "tabler:plus",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["disabled"]),
            l.value && !m.value ? (c(), y("span", js, "Use a unique lowercase identifier with letters, numbers and underscores.")) : U("", !0)
          ])
        ]),
        _: 1
      }, 8, ["count"])
    ]));
  }
}), Ws = ".work-process-canvas>svg{height:480px;width:100%}.work-process-canvas:focus-visible{outline:var(--p-focus-ring-width) var(--p-focus-ring-style) var(--p-focus-ring-color);outline-offset:var(--p-focus-ring-offset)}.work-state-card{fill:var(--p-content-background);stroke:var(--p-content-border-color);stroke-width:1.5}.work-graph-node.work-selected .work-state-card{stroke:var(--p-primary-color);stroke-width:2.5;fill:color-mix(in srgb,var(--p-primary-color) 6%,var(--p-content-background))}.work-graph-node:focus-visible .work-state-card{stroke:var(--p-focus-ring-color);stroke-width:var(--p-focus-ring-width)}.work-process-canvas .work-edge-label{font-size:12px;fill:var(--p-text-color)}.work-process-canvas .work-edge-label-bg{fill:var(--p-content-background);stroke:var(--p-content-border-color);stroke-width:1}.work-edge-line{stroke:var(--p-primary-color);stroke-width:1.5}.work-edge-return .work-edge-line{stroke:var(--p-text-muted-color);stroke-dasharray:5 4}.work-graph-arrow{fill:context-stroke}.work-lane-line{fill:none;stroke:var(--p-text-muted-color);stroke-width:1.5;stroke-dasharray:2 4}.work-node-connector{fill:var(--p-content-background);stroke:var(--p-primary-color);stroke-width:1.5}.work-node-connector:hover,.work-node-connector:focus-visible{fill:var(--p-primary-color)}.work-process-legend{position:static;flex-wrap:wrap;padding:10px 16px;border-top:1px solid var(--p-content-border-color);background:var(--p-content-background)}@media(max-width:700px){.work-process-canvas>svg{height:420px}}.work-process-more{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:8px;padding:8px 16px;border-top:1px solid var(--p-content-border-color);background:var(--p-content-background);color:var(--p-text-muted-color);font-size:12px}.work-process-canvas .work-graph-edge.work-selected .work-edge-label-bg{fill:var(--p-primary-color);stroke:var(--p-primary-color)}.work-process-canvas .work-graph-edge.work-selected .work-edge-label{fill:var(--p-primary-contrast-color)}", Al = /* @__PURE__ */ new WeakSet();
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
  const i = e.nodes.find((m) => m.state.id === t) ?? e.nodes[0], u = Math.min(1, a.width / ((i?.width ?? 190) + 64));
  return { zoom: u, pan: i ? { x: e.direction === "TB" ? i.x - a.width / u / 2 : i.x - i.width / 2 - 32, y: e.direction === "TB" ? i.y - i.height / 2 - 32 : i.y - a.height / u / 2 } : { x: 0, y: 0 } };
}
const Ys = ["onKeydown"], Xs = {
  key: 0,
  class: "work-process-instruction",
  role: "status"
}, Js = ["viewBox"], Zs = ["id"], Qs = ["d", "marker-end"], _s = ["aria-label", "aria-pressed", "onFocus", "onClick", "onKeydown"], er = ["d"], tr = ["d", "marker-end"], ar = ["x", "y", "width", "height"], lr = ["x", "y"], or = ["x", "dy"], ir = ["aria-label", "aria-pressed", "onClick", "onKeydown", "onFocus", "onPointerup"], nr = ["x", "y", "width", "height"], sr = ["cx", "cy"], rr = ["x", "y"], dr = ["x", "dy"], ur = ["x", "y"], cr = ["x", "dy"], vr = {
  key: 0,
  class: "work-limit-text"
}, mr = ["aria-label", "onClick", "onKeydown"], fr = ["x", "y"], pr = ["x", "dy"], br = ["cx", "cy", "aria-label", "onPointerdown", "onClick", "onKeydown"], hr = ["d"], gr = {
  key: 1,
  class: "work-process-more",
  role: "status"
}, yr = { class: "work-process-legend" }, kr = /* @__PURE__ */ pe({
  __name: "ProcessGraph",
  props: {
    process: {},
    draft: {},
    selectedState: {},
    selectedTransition: {}
  },
  emits: ["state", "transition", "connect", "clear"],
  setup(e, { expose: a, emit: t }) {
    const l = e, i = t, u = ll().replace(/:/g, "_"), m = B(""), v = B(), p = B(), o = B(900), n = B(!1), s = H(() => o.value < 700 ? 420 : 480), g = H(() => ti(l.process, l.draft, { width: o.value, height: s.value })), f = B(1), k = B({ x: 0, y: 0 }), $ = B({ x: 0, y: 0 }), I = H(() => ({ width: o.value, height: n.value ? Math.max(s.value, g.value.height * Math.min(1, o.value / g.value.width)) : s.value })), E = H(() => g.value.nodes.filter((b) => b.x - b.width / 2 >= k.value.x && b.x + b.width / 2 <= k.value.x + I.value.width / f.value && b.y - b.height / 2 >= k.value.y && b.y + b.height / 2 <= k.value.y + I.value.height / f.value).length);
    function C() {
      n.value = !1;
      const b = Hs(g.value, I.value, l.process.initial);
      f.value = b.zoom, k.value = b.pan;
    }
    const S = H(() => `${k.value.x} ${k.value.y} ${I.value.width / f.value} ${I.value.height / f.value}`), D = H(() => g.value.nodes.find((b) => b.state.id === m.value));
    function P() {
      n.value = !0, f.value = Math.min(1, I.value.width / g.value.width), k.value = { x: (g.value.width - I.value.width / f.value) / 2, y: 0 };
    }
    function K(b) {
      const x = Math.max(0.02, Math.min(3, f.value * b)), w = 1 / f.value - 1 / x;
      k.value = { x: k.value.x + I.value.width * w / 2, y: k.value.y + I.value.height * w / 2 }, f.value = x;
    }
    function te(b) {
      const x = I.value.width / f.value, w = I.value.height / f.value;
      (b.x - b.width / 2 < k.value.x || b.x + b.width / 2 > k.value.x + x || b.y - b.height / 2 < k.value.y || b.y + b.height / 2 > k.value.y + w) && (k.value = { x: b.x - x / 2, y: b.y - w / 2 });
    }
    function ce() {
      const b = g.value.nodes.find((x) => x.state === l.selectedState) ?? g.value.edges.find((x) => x.transition === l.selectedTransition);
      b && te(b);
    }
    Ce([g, () => l.selectedState, () => l.selectedTransition], ce, { flush: "post" }), Ce(() => l.process.id, () => {
      m.value = "", R.clear(), C();
    }, { flush: "post" });
    function se(b) {
      if (b.target !== v.value) return;
      (b.key === "+" || b.key === "=") && (b.preventDefault(), K(1.2)), b.key === "-" && (b.preventDefault(), K(1 / 1.2)), b.key === "0" && (b.preventDefault(), P());
      const x = 60 / f.value;
      b.key.startsWith("Arrow") && (b.preventDefault(), k.value = { x: k.value.x + (b.key === "ArrowRight" ? x : b.key === "ArrowLeft" ? -x : 0), y: k.value.y + (b.key === "ArrowDown" ? x : b.key === "ArrowUp" ? -x : 0) });
    }
    function W(b, x) {
      m.value && m.value !== b.id && i("connect", m.value, b.id, x.currentTarget), m.value = "";
    }
    function O(b, x) {
      m.value = x.state.id, $.value = { x: x.x, y: x.y };
      const w = b.target;
      w instanceof Element && w.hasPointerCapture?.(b.pointerId) && w.releasePointerCapture(b.pointerId);
    }
    function N(b, x) {
      if ((b.key === "Enter" || b.key === " ") && (b.preventDefault(), m.value ? W(x, b) : i("state", x, b.currentTarget)), ["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp"].includes(b.key)) {
        b.preventDefault();
        const w = Array.from(p.value?.querySelectorAll(".work-graph-node") ?? []), j = g.value.nodes.findIndex((re) => re.state === x), Z = ["ArrowRight", "ArrowDown"].includes(b.key) ? 1 : -1;
        w[(j + Z + w.length) % w.length]?.focus();
      }
    }
    function V() {
      m.value = "", R.clear(), i("clear");
    }
    const R = /* @__PURE__ */ new Map();
    let L = 0;
    function T(b) {
      if (!b.target.closest('[role="button"]') && (R.set(b.pointerId, { x: b.clientX, y: b.clientY }), v.value?.setPointerCapture?.(b.pointerId), R.size === 2)) {
        const [x, w] = [...R.values()];
        L = Math.hypot(x.x - w.x, x.y - w.y);
      }
    }
    function F(b) {
      const x = p.value?.getBoundingClientRect();
      if (!x?.width) return;
      if (m.value) {
        $.value = { x: k.value.x + (b.clientX - x.left) * I.value.width / f.value / x.width, y: k.value.y + (b.clientY - x.top) * I.value.height / f.value / x.height };
        return;
      }
      const w = R.get(b.pointerId);
      if (w)
        if (R.set(b.pointerId, { x: b.clientX, y: b.clientY }), R.size === 2) {
          const [j, Z] = [...R.values()], re = Math.hypot(j.x - Z.x, j.y - Z.y);
          L && K(re / L), L = re;
        } else k.value = { x: k.value.x - (b.clientX - w.x) * I.value.width / f.value / x.width, y: k.value.y - (b.clientY - w.y) * I.value.height / f.value / x.height };
    }
    function Q(b) {
      R.delete(b.pointerId), L = 0, m.value = "";
    }
    function we(b) {
      b.ctrlKey && (b.preventDefault(), K(Math.exp(-b.deltaY * 0.01)));
    }
    let he;
    Ca(() => {
      if (v.value && Ks(v.value), typeof ResizeObserver < "u" && p.value) {
        let b = !0;
        he = new ResizeObserver(() => {
          const x = p.value?.getBoundingClientRect();
          if (!x?.width || !x.height) return;
          const w = I.value.width;
          o.value = x.width, (b || Math.abs(x.width - w) > 1) && (n.value ? P() : C(), b = !1), ce();
        }), he.observe(p.value);
      }
    }), ht(() => he?.disconnect()), a({ fit: P, zoomIn: () => K(1.2), zoomOut: () => K(1 / 1.2) });
    function ge(b) {
      return b.category === "completed" ? "check" : b.category === "canceled" ? "x" : b.id === l.process.initial ? "arrow-bar-to-right" : { gate: "shield-check", automated: "bolt", parallel: "arrows-split" }[b.kind ?? ""] ?? "user";
    }
    return (b, x) => (c(), y("section", {
      ref_key: "canvas",
      ref: v,
      class: "work-process-canvas",
      "aria-label": "Process map",
      tabindex: "0",
      onKeydown: [
        se,
        Oe(ye(V, ["stop"]), ["esc"])
      ],
      onPointerdown: T,
      onPointermove: F,
      onPointerup: Q,
      onPointercancel: V,
      onWheel: we
    }, [
      m.value ? (c(), y("p", Xs, "Choose the next stop. Escape cancels.")) : U("", !0),
      (c(), y("svg", {
        ref_key: "svg",
        ref: p,
        style: xo({ height: I.value.height + "px" }),
        viewBox: S.value,
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
          }, [...x[1] || (x[1] = [
            d("path", {
              d: "M0 0 L8 4 L0 8 z",
              class: "work-graph-arrow"
            }, null, -1)
          ])], 8, Zs)
        ]),
        (c(!0), y(J, null, le(g.value.parallels, (w) => (c(), y("path", {
          key: w.key,
          d: w.path,
          class: "work-lane-line",
          "marker-end": `url(#${r(u)}-arrow)`
        }, [
          d("title", null, "Parallel lane from " + A(r(ve)(w.state)), 1)
        ], 8, Qs))), 128)),
        (c(!0), y(J, null, le(g.value.edges, (w) => (c(), y("g", {
          key: w.key,
          class: pt(["work-graph-edge", ["work-edge-" + w.type, { "work-selected": e.selectedTransition === w.transition }]]),
          role: "button",
          tabindex: "0",
          "aria-label": "Edit transition " + r(Pe)(w.transition),
          "aria-pressed": e.selectedTransition === w.transition,
          onFocus: (j) => te(w),
          onClick: (j) => i("transition", w.transition, j.currentTarget),
          onKeydown: [
            Oe(ye((j) => i("transition", w.transition, j.currentTarget), ["prevent"]), ["enter"]),
            Oe(ye((j) => i("transition", w.transition, j.currentTarget), ["prevent"]), ["space"])
          ]
        }, [
          d("path", {
            d: w.path,
            class: "work-edge-hit"
          }, null, 8, er),
          d("path", {
            d: w.path,
            class: "work-edge-line",
            "marker-end": `url(#${r(u)}-arrow)`
          }, null, 8, tr),
          d("rect", {
            x: w.x - w.width / 2,
            y: w.y - w.height / 2,
            width: w.width,
            height: w.height,
            rx: "6",
            class: "work-edge-label-bg"
          }, null, 8, ar),
          d("text", {
            x: w.x,
            y: w.y - (w.lines.length - 1) * 8 + 4,
            class: "work-edge-label",
            "text-anchor": "middle"
          }, [
            (c(!0), y(J, null, le(w.lines, (j, Z) => (c(), y("tspan", {
              key: Z,
              x: w.x,
              dy: Z ? 16 : 0
            }, A(j), 9, or))), 128))
          ], 8, lr)
        ], 42, _s))), 128)),
        (c(!0), y(J, null, le(g.value.nodes, (w) => (c(), y("g", {
          key: w.state.id,
          class: pt(["work-graph-node", ["work-stop-" + w.state.category, { "work-selected": e.selectedState === w.state }]]),
          role: "button",
          tabindex: "0",
          "aria-label": "Edit state " + r(ve)(w.state),
          "aria-pressed": e.selectedState === w.state,
          onClick: (j) => i("state", w.state, j.currentTarget),
          onKeydown: (j) => N(j, w.state),
          onFocus: (j) => te(w),
          onPointerup: ye((j) => W(w.state, j), ["stop"])
        }, [
          d("rect", {
            x: w.x - w.width / 2,
            y: w.y - w.height / 2,
            width: w.width,
            height: w.height,
            rx: "10",
            class: "work-state-card"
          }, null, 8, nr),
          d("circle", {
            cx: w.x - w.width / 2 + 22,
            cy: w.y - w.height / 2 + 25,
            r: "10",
            class: "work-stop-ring"
          }, null, 8, sr),
          h(r(_), {
            icon: "tabler:" + ge(w.state),
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
            (c(!0), y(J, null, le(w.title, (j, Z) => (c(), y("tspan", {
              key: Z,
              x: w.x - w.width / 2 + 42,
              dy: Z ? 18 : 0
            }, A(j), 9, dr))), 128))
          ], 8, rr),
          d("text", {
            x: w.x - w.width / 2 + 16,
            y: w.y - w.height / 2 + 33 + w.title.length * 18,
            class: "work-node-meta"
          }, [
            (c(!0), y(J, null, le(w.caption, (j, Z) => (c(), y("tspan", {
              key: Z,
              x: w.x - w.width / 2 + 16,
              dy: Z ? 16 : 0
            }, A(j), 9, cr))), 128)),
            e.draft.policy?.wip?.[w.state.id] ? (c(), y("tspan", vr, " · limit " + A(e.draft.policy.wip[w.state.id].limit), 1)) : U("", !0)
          ], 8, ur),
          (c(!0), y(J, null, le(w.badges, (j, Z) => (c(), y("g", {
            key: j.id,
            class: "work-any-transition",
            role: "button",
            tabindex: "0",
            "aria-label": "Edit transition " + r(Pe)(j),
            onClick: ye((re) => i("transition", j, re.currentTarget), ["stop"]),
            onKeydown: [
              Oe(ye((re) => i("transition", j, re.currentTarget), ["stop", "prevent"]), ["enter"]),
              Oe(ye((re) => i("transition", j, re.currentTarget), ["stop", "prevent"]), ["space"])
            ]
          }, [
            d("text", {
              x: w.x - w.width / 2 + 16,
              y: w.y - w.height / 2 + 33 + w.title.length * 18 + w.caption.length * 16 + w.badges.slice(0, Z).reduce((re, ue) => re + r(zt)(r(Pe)(ue) + " works from any state").length * 18, 0),
              class: "work-node-meta"
            }, [
              (c(!0), y(J, null, le(r(zt)(r(Pe)(j) + " works from any state"), (re, ue) => (c(), y("tspan", {
                key: ue,
                x: w.x - w.width / 2 + 16,
                dy: ue ? 18 : 0
              }, A(re), 9, pr))), 128))
            ], 8, fr)
          ], 40, mr))), 128)),
          ["completed", "canceled"].includes(w.state.category) ? U("", !0) : (c(), y("circle", {
            key: 0,
            cx: g.value.direction === "TB" ? w.x : w.x + w.width / 2,
            cy: g.value.direction === "TB" ? w.y + w.height / 2 : w.y,
            r: "7",
            class: "work-node-connector",
            role: "button",
            tabindex: "0",
            "aria-label": "Connect from " + r(ve)(w.state),
            onPointerdown: ye((j) => O(j, w), ["stop", "prevent"]),
            onClick: ye((j) => i("state", w.state, j.currentTarget), ["stop"]),
            onKeydown: [
              Oe(ye((j) => {
                m.value = w.state.id, $.value = { x: w.x, y: w.y };
              }, ["stop", "prevent"]), ["enter"]),
              Oe(ye((j) => m.value = w.state.id, ["stop", "prevent"]), ["space"])
            ]
          }, null, 40, br))
        ], 42, ir))), 128)),
        D.value ? (c(), y("path", {
          key: 0,
          d: `M ${g.value.direction === "TB" ? D.value.x : D.value.x + D.value.width / 2} ${g.value.direction === "TB" ? D.value.y + D.value.height / 2 : D.value.y} L ${$.value.x} ${$.value.y}`,
          class: "work-connect-ghost"
        }, null, 8, hr)) : U("", !0)
      ], 12, Js)),
      !n.value && E.value < e.process.states.length ? (c(), y("div", gr, [
        d("span", null, A(E.value) + " of " + A(e.process.states.length) + " states in view · More " + A(g.value.direction === "TB" ? "below" : "to the right"), 1),
        h(r(X), {
          label: "Show full process",
          size: "small",
          text: "",
          onClick: x[0] || (x[0] = (w) => P())
        })
      ])) : U("", !0),
      d("div", yr, [
        d("span", null, A(e.process.states.length) + " states · " + A(Math.round(f.value * 100)) + "%", 1),
        x[2] || (x[2] = d("span", null, [
          d("i"),
          M("Transition")
        ], -1)),
        x[3] || (x[3] = d("span", null, [
          d("i", { class: "work-return-key" }),
          M("Return / loop")
        ], -1)),
        x[4] || (x[4] = d("span", null, "Drag to pan · Ctrl + scroll to zoom · Fit for full process", -1))
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
}, Cr = { role: "rowgroup" }, Sr = ["aria-selected"], Tr = { role: "cell" }, Dr = { role: "cell" }, Ur = { role: "cell" }, Ir = {
  role: "cell",
  class: "work-process-list-actions"
}, Er = { class: "work-table-scroll" }, Ar = {
  class: "work-settings-table work-process-table",
  role: "table",
  "aria-label": "Transitions"
}, Pr = { role: "rowgroup" }, Rr = ["aria-selected"], Or = { role: "cell" }, Nr = { role: "cell" }, Mr = { role: "cell" }, Fr = {
  role: "cell",
  class: "work-process-list-actions"
}, zr = /* @__PURE__ */ pe({
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
        t[2] || (t[2] = M("Process name", -1)),
        h(r(me), {
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
            (c(!0), y(J, null, le(e.process.states, (l) => (c(), y("tr", {
              key: l.id,
              "aria-selected": e.selectedState === l,
              role: "row"
            }, [
              d("td", Tr, [
                h(r(me), {
                  modelValue: l.name,
                  "onUpdate:modelValue": (i) => l.name = i,
                  "aria-label": "Name of " + r(ve)(l)
                }, null, 8, ["modelValue", "onUpdate:modelValue", "aria-label"])
              ]),
              d("td", Dr, [
                t[3] || (t[3] = d("span", {
                  class: "work-process-cell-label",
                  "aria-hidden": "true"
                }, "Phase", -1)),
                M(A(r(Dt)(l.category)), 1)
              ]),
              d("td", Ur, [
                t[4] || (t[4] = d("span", {
                  class: "work-process-cell-label",
                  "aria-hidden": "true"
                }, "Kind", -1)),
                h(r(Ne), { severity: "secondary" }, {
                  default: z(() => [
                    M(A(r(ha)(l.kind)), 1)
                  ]),
                  _: 2
                }, 1024)
              ]),
              d("td", Ir, [
                h(r(X), {
                  size: "small",
                  text: "",
                  severity: "secondary",
                  "aria-label": "Edit state",
                  onClick: (i) => a.$emit("state", l, i.currentTarget)
                }, {
                  default: z(() => [
                    h(r(_), { icon: "tabler:pencil" })
                  ]),
                  _: 1
                }, 8, ["onClick"]),
                h(r(X), {
                  size: "small",
                  text: "",
                  severity: "danger",
                  "aria-label": "Remove state " + r(ve)(l),
                  onClick: (i) => a.$emit("removeState", l)
                }, {
                  default: z(() => [
                    h(r(_), { icon: "tabler:trash" })
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
            (c(!0), y(J, null, le(e.process.transitions ?? [], (l) => (c(), y("tr", {
              key: l.id,
              "aria-selected": e.selectedTransition === l,
              role: "row"
            }, [
              d("td", Or, [
                h(r(me), {
                  modelValue: l.name,
                  "onUpdate:modelValue": (i) => l.name = i,
                  placeholder: r(Pe)(l),
                  "aria-label": "Name of " + r(Pe)(l)
                }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder", "aria-label"])
              ]),
              d("td", Nr, [
                t[6] || (t[6] = d("span", {
                  class: "work-process-cell-label",
                  "aria-hidden": "true"
                }, "From", -1)),
                M(" " + A(l.from === "any" ? "Any state" : l.from.map((i) => r(ve)(e.process.states.find((u) => u.id === i))).join(", ")), 1)
              ]),
              d("td", Mr, [
                t[7] || (t[7] = d("span", {
                  class: "work-process-cell-label",
                  "aria-hidden": "true"
                }, "To", -1)),
                M(A(r(ve)(e.process.states.find((i) => i.id === l.to))), 1)
              ]),
              d("td", Fr, [
                h(r(X), {
                  size: "small",
                  text: "",
                  severity: "secondary",
                  "aria-label": "Edit transition",
                  onClick: (i) => a.$emit("transition", l, i.currentTarget)
                }, {
                  default: z(() => [
                    h(r(_), { icon: "tabler:pencil" })
                  ]),
                  _: 1
                }, 8, ["onClick"]),
                h(r(X), {
                  size: "small",
                  text: "",
                  severity: "danger",
                  "aria-label": "Remove transition " + r(Pe)(l),
                  onClick: (i) => a.$emit("removeTransition", l)
                }, {
                  default: z(() => [
                    h(r(_), { icon: "tabler:trash" })
                  ]),
                  _: 1
                }, 8, ["aria-label", "onClick"])
              ])
            ], 8, Rr))), 128))
          ])
        ])
      ]),
      h(r(X), {
        label: "Add transition",
        severity: "secondary",
        outlined: "",
        onClick: t[1] || (t[1] = (l) => a.$emit("addTransition", l.currentTarget))
      }, {
        icon: z(() => [
          h(r(_), { icon: "tabler:plus" })
        ]),
        _: 1
      })
    ]));
  }
}), Lr = { class: "work-stack work-transition-settings" }, Br = { class: "work-stack work-tight" }, jr = { class: "work-row" }, qr = { class: "work-row" }, Wr = { class: "work-row" }, Kr = { class: "work-stack work-tight" }, Gr = { class: "work-row" }, Hr = { class: "work-stack work-tight" }, Yr = { class: "work-stack work-tight" }, Xr = /* @__PURE__ */ pe({
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
    return (m, v) => (c(), y("div", Lr, [
      d("label", Br, [
        v[14] || (v[14] = M("To state", -1)),
        h(r(oe), {
          modelValue: e.transition.to,
          "onUpdate:modelValue": v[0] || (v[0] = (p) => e.transition.to = p),
          "aria-label": "To state",
          appendTo: "self",
          optionLabel: "label",
          optionValue: "value",
          options: e.process.states.map((p) => ({ label: r(ve)(p), value: p.id }))
        }, null, 8, ["modelValue", "options"])
      ]),
      d("label", jr, [
        v[15] || (v[15] = d("span", { class: "work-spacer" }, "Happens automatically", -1)),
        h(r(We), {
          "model-value": e.transition.auto,
          "onUpdate:modelValue": v[1] || (v[1] = (p) => {
            e.transition.auto = p, p || delete e.transition.default;
          }),
          "aria-label": "Automatic transition"
        }, null, 8, ["model-value"])
      ]),
      d("label", qr, [
        v[16] || (v[16] = d("span", { class: "work-spacer" }, "Default automatic transition", -1)),
        h(r(We), {
          modelValue: e.transition.default,
          "onUpdate:modelValue": v[2] || (v[2] = (p) => e.transition.default = p),
          disabled: !e.transition.auto,
          "aria-label": "Default transition"
        }, null, 8, ["modelValue", "disabled"])
      ]),
      d("label", Wr, [
        v[17] || (v[17] = d("span", { class: "work-spacer" }, "Works from any state", -1)),
        h(r(We), {
          "model-value": e.transition.from === "any",
          "aria-label": "Works from any state",
          "onUpdate:modelValue": v[3] || (v[3] = (p) => e.transition.from = p ? "any" : [])
        }, null, 8, ["model-value"])
      ]),
      e.transition.from !== "any" ? (c(), q(qt, {
        key: 0,
        label: "From states",
        options: e.process.states.map((p) => ({ value: p.id, label: r(ve)(p) })),
        modelValue: e.transition.from,
        "onUpdate:modelValue": v[4] || (v[4] = (p) => e.transition.from = p)
      }, null, 8, ["options", "modelValue"])) : U("", !0),
      v[21] || (v[21] = d("h4", { class: "work-process-group" }, "Must be filled", -1)),
      h(qt, {
        label: "Required fields",
        options: e.draft.fields?.map((p) => ({ value: p.code, label: p.title || p.code })) ?? [],
        modelValue: e.transition.require,
        "onUpdate:modelValue": v[5] || (v[5] = (p) => e.transition.require = p)
      }, null, 8, ["options", "modelValue"]),
      v[22] || (v[22] = d("h4", { class: "work-process-group" }, "Also sets", -1)),
      (c(!0), y(J, null, le(e.transition.set ?? [], (p, o) => (c(), y("div", {
        key: o,
        class: "work-process-value work-stack work-tight"
      }, [
        d("label", Kr, [
          v[18] || (v[18] = M("Field", -1)),
          h(r(oe), {
            modelValue: p.field,
            "onUpdate:modelValue": (n) => p.field = n,
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            options: e.draft.fields?.map((n) => ({ value: n.code, label: n.title || n.code })) ?? []
          }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
        ]),
        d("div", Gr, [
          h(r(oe), {
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
          h(r(X), {
            text: "",
            severity: "danger",
            "aria-label": "Remove value " + (o + 1),
            onClick: (n) => e.transition.set?.splice(o, 1)
          }, {
            default: z(() => [
              h(r(_), { icon: "tabler:trash" })
            ]),
            _: 1
          }, 8, ["aria-label", "onClick"])
        ]),
        p.copy !== void 0 ? (c(), q(r(oe), {
          key: 0,
          modelValue: p.copy,
          "onUpdate:modelValue": (n) => p.copy = n,
          "aria-label": "Copy from field",
          appendTo: "self",
          optionLabel: "label",
          optionValue: "value",
          options: e.draft.fields?.map((n) => ({ value: n.code, label: n.title || n.code })) ?? []
        }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])) : p.clear ? U("", !0) : (c(!0), y(J, { key: 1 }, le(e.draft.fields?.filter((n) => n.code === p.field) ?? [], (n) => (c(), q(Xl, {
          key: n.code,
          "board-id": e.boardId ?? "",
          field: n,
          modelValue: p.value,
          "onUpdate:modelValue": (s) => p.value = s,
          onValidity: (s) => l("validity", "effect-" + o, s)
        }, null, 8, ["board-id", "field", "modelValue", "onUpdate:modelValue", "onValidity"]))), 128))
      ]))), 128)),
      h(r(X), {
        label: "Add value",
        severity: "secondary",
        outlined: "",
        size: "small",
        onClick: i
      }, {
        icon: z(() => [
          h(r(_), { icon: "tabler:plus" })
        ]),
        _: 1
      }),
      d("label", Hr, [
        v[19] || (v[19] = M("Offer to people", -1)),
        h(r(oe), {
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
        v[20] || (v[20] = M("Evaluation order", -1)),
        h(r(Ze), {
          "model-value": e.transition.order ?? null,
          "aria-label": "Transition order",
          min: 0,
          useGrouping: !1,
          "onUpdate:modelValue": v[7] || (v[7] = (p) => e.transition.order = p ?? void 0)
        }, null, 8, ["model-value"])
      ]),
      v[23] || (v[23] = d("h4", { class: "work-process-group" }, "Only when", -1)),
      h(sl, {
        label: "Allow this transition when",
        draft: e.draft,
        "board-id": e.boardId,
        "model-value": e.transition.when,
        "onUpdate:modelValue": v[8] || (v[8] = (p) => e.transition.when = p),
        onValidity: v[9] || (v[9] = (p) => l("validity", "when", p))
      }, null, 8, ["draft", "board-id", "model-value"]),
      h(bt, {
        label: "Set values",
        "model-value": e.transition.set,
        shape: "array",
        "onUpdate:modelValue": v[10] || (v[10] = (p) => e.transition.set = p),
        onValidity: v[11] || (v[11] = (p) => l("validity", "set", p))
      }, null, 8, ["model-value"]),
      h(bt, {
        label: "Guards",
        "model-value": e.transition.guards,
        shape: "array",
        "onUpdate:modelValue": v[12] || (v[12] = (p) => e.transition.guards = p),
        onValidity: v[13] || (v[13] = (p) => l("validity", "guards", p))
      }, null, 8, ["model-value"])
    ]));
  }
}), xa = /* @__PURE__ */ pe({
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
    return (u, m) => e.hard ? (c(), q(r(We), {
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
    if (!t?.success) {
      const l = t?.message || (typeof t?.error == "string" ? t.error : t?.error?.message) || "Could not read published Flow.";
      throw new Xa({ message: l, details: t?.details }, "Published Flow");
    }
    return t;
  } catch (t) {
    throw Po(t, "Published Flow");
  }
}
const Pl = (e) => `/api/v1/workflows/${encodeURIComponent(e)}/versions`, tl = {
  title: async (e) => (await Ka("/api/v1/workflows/published", { id: e })).item?.title,
  versions: async (e) => (await Ka(Pl(e))).versions ?? [],
  check: async (e) => {
    if ((await Ka(`${Pl(e.id)}/${e.version}`)).version?.version !== e.version) throw new Error("The published version is unavailable.");
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
}, ld = {
  key: 5,
  class: "work-muted work-small",
  role: "status"
}, od = /* @__PURE__ */ pe({
  __name: "StageFlow",
  props: {
    modelValue: {}
  },
  emits: ["update:modelValue", "validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, i = B(!1), u = B(""), m = B([]), v = B(!1), p = B(""), o = B(!1), n = H(() => u.value || t.modelValue?.id), s = JSON.stringify({ properties: { flow_ref: { title: "Published Flow", picker: "wc-workflow-picker" } } }), g = H(() => JSON.stringify(t.modelValue ? { flow_ref: t.modelValue } : {}));
    let f = 0;
    async function k() {
      i.value = await ft("wc-workflow-picker");
    }
    k();
    async function $() {
      const S = ++f, D = n.value, P = t.modelValue;
      if (v.value = !!D, p.value = "", m.value = [], !!D)
        try {
          const [K] = await Promise.all([tl.versions(D), !o.value && P ? tl.check(P) : Promise.resolve()]);
          if (S !== f) return;
          if (m.value = K.filter((te) => Number.isInteger(te.version) && te.version > 0), !o.value && P && !m.value.some((te) => te.version === P.version)) throw new Error("The published version is unavailable.");
        } catch (K) {
          S === f && (p.value = Ge(K, "Could not read published Flow."));
        } finally {
          S === f && (v.value = !1);
        }
    }
    Ce([n, () => t.modelValue?.version, o], $, { immediate: !0 }), Ce(o, (S) => l("validity", !S), { immediate: !0 });
    function I(S) {
      const D = S.detail?.flow_ref;
      D?.kind !== "flow" || !D.id || (o.value = !0, u.value = D.id);
    }
    function E(S) {
      !n.value || !m.value.some((D) => D.version === S) || (l("update:modelValue", { kind: "flow", id: n.value, version: S }), o.value = !1, u.value = "");
    }
    function C() {
      l("update:modelValue", void 0), o.value = !1, u.value = "";
    }
    return ht(() => {
      f++, l("validity", !0);
    }), (S, D) => (c(), y("section", Jr, [
      D[3] || (D[3] = d("h4", { class: "work-field-label" }, "What runs", -1)),
      e.modelValue ? U("", !0) : (c(), y("p", Zr, "No Flow bound. This stage keeps its existing external execution contract.")),
      p.value ? (c(), y("div", Qr, [
        d("p", _r, [
          M(A(o.value ? "Flow versions unavailable" : "Flow binding unavailable"), 1),
          !o.value && e.modelValue ? (c(), y(J, { key: 0 }, [
            M(" (v" + A(e.modelValue.version) + ")", 1)
          ], 64)) : U("", !0),
          M(". " + A(p.value), 1)
        ]),
        h(r(X), {
          label: "Reload Flow",
          severity: "secondary",
          text: "",
          onClick: $
        })
      ])) : U("", !0),
      i.value ? (c(), y("wc-workflow-picker", {
        key: 2,
        schema: r(s),
        config: g.value,
        title: e.modelValue?.id,
        onChange: I
      }, null, 40, ed)) : (c(), y("p", td, [
        D[1] || (D[1] = M("Published Flow picker unavailable.", -1)),
        h(r(X), {
          label: "Reload Flow picker",
          text: "",
          severity: "secondary",
          onClick: k
        })
      ])),
      n.value ? (c(), y("label", ad, [
        D[2] || (D[2] = M("Published version", -1)),
        h(r(oe), {
          "model-value": o.value ? void 0 : e.modelValue?.version,
          options: m.value.map((P) => ({ label: "v" + P.version, value: P.version })),
          "option-label": "label",
          "option-value": "value",
          "aria-label": "Published version",
          placeholder: "Choose a published version",
          "append-to": "self",
          loading: v.value,
          disabled: v.value || !!p.value,
          "onUpdate:modelValue": E
        }, null, 8, ["model-value", "options", "loading", "disabled"])
      ])) : U("", !0),
      o.value ? (c(), y("p", ld, "Choose a published version to finish selecting the Flow.")) : U("", !0),
      e.modelValue || o.value ? (c(), q(r(X), {
        key: 6,
        label: o.value ? "Cancel Flow selection" : "Remove Flow binding",
        "aria-label": o.value ? "Cancel Flow selection" : "Remove Flow binding",
        severity: "secondary",
        text: "",
        onClick: D[0] || (D[0] = (P) => o.value ? (o.value = !1, u.value = "") : C())
      }, null, 8, ["label", "aria-label"])) : U("", !0)
    ]));
  }
}), al = { seconds: 1, minutes: 60, hours: 3600, days: 86400 };
function Jt(e, a) {
  const t = /^P(\d+)W$/.exec(e), l = /^P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+\.?\d*)S)?)?$/.exec(e);
  if (!t && (!l || e === "P" || e.endsWith("T"))) return;
  const i = t ? Number(t[1]) * 604800 : Number(l[1] ?? 0) * 86400 + Number(l[2] ?? 0) * 3600 + Number(l[3] ?? 0) * 60 + Number(l[4] ?? 0);
  if (!Number.isFinite(i) || i <= 0) return;
  const u = a ?? (i % 86400 === 0 ? "days" : i % 3600 === 0 ? "hours" : i < 60 ? "seconds" : "minutes");
  return { amount: i / al[u], unit: u };
}
function id(e, a) {
  if (e == null) return;
  if (!Number.isFinite(e * al[a]) || e <= 0) throw new Error("Enter a positive duration.");
  const t = (i) => i.toLocaleString("en-US", { useGrouping: !1, maximumSignificantDigits: 21 });
  if (!Number.isInteger(e)) return `PT${t(e * al[a])}S`;
  const l = { seconds: "S", minutes: "M", hours: "H", days: "D" }[a];
  return (a === "days" ? "P" : "PT") + t(e) + l;
}
const nd = { class: "work-stack work-tight" }, sd = {
  key: 0,
  class: "work-error",
  role: "alert"
}, St = /* @__PURE__ */ pe({
  __name: "DurationControl",
  props: {
    modelValue: {},
    label: {},
    disabled: { type: Boolean }
  },
  emits: ["update:modelValue", "validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, i = "duration:" + ll(), u = B(), m = B(""), v = H(() => t.modelValue ? Jt(t.modelValue) : void 0), p = H(() => u.value ?? v.value?.unit ?? "days");
    Ce(() => t.modelValue, (E) => {
      m.value = "", l("validity", !E || !!v.value, i);
    }, { immediate: !0 });
    const o = H(() => t.modelValue ? Jt(t.modelValue, p.value)?.amount ?? null : null);
    function n(E) {
      try {
        const C = id(E, p.value);
        m.value = "", l("update:modelValue", C), l("validity", !0, i);
      } catch (C) {
        m.value = C.message, l("validity", !1, i);
      }
    }
    let s;
    function g(E) {
      E.target instanceof HTMLInputElement && (s = E.target.value);
    }
    function f(E) {
      if (s === void 0) return;
      const C = s;
      s = void 0, $(E, C);
    }
    function k(E) {
      s = void 0;
      const C = E.originalEvent?.target instanceof HTMLInputElement ? E.originalEvent.target.value : E.formattedValue;
      $(E.value, C);
    }
    function $(E, C) {
      if (C.trim() && (typeof E != "number" || !Number.isFinite(E))) {
        m.value = "Enter a positive duration.", l("validity", !1, i);
        return;
      }
      u.value = p.value, n(typeof E == "number" ? E : null);
    }
    function I(E) {
      const C = o.value;
      u.value = E, !(t.modelValue && !v.value) && n(C);
    }
    return ht(() => l("validity", !0, i)), (E, C) => (c(), y("label", nd, [
      M(A(e.label), 1),
      d("span", {
        class: "work-duration-control",
        style: { "max-width": "360px" },
        onInputCapture: g
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
        h(r(oe), {
          "model-value": p.value,
          "aria-label": e.label + " unit",
          disabled: e.disabled,
          options: [{ label: "Seconds", value: "seconds" }, { label: "Minutes", value: "minutes" }, { label: "Hours", value: "hours" }, { label: "Days", value: "days" }],
          optionLabel: "label",
          optionValue: "value",
          appendTo: "self",
          "onUpdate:modelValue": C[0] || (C[0] = (S) => I(S))
        }, null, 8, ["model-value", "aria-label", "disabled"])
      ], 32),
      m.value || e.modelValue && !r(Jt)(e.modelValue) ? (c(), y("span", sd, A(m.value || `Unsupported duration: ${e.modelValue}`), 1)) : U("", !0)
    ]));
  }
}), rd = { class: "work-stack" }, dd = { class: "work-settings-grid" }, ud = { class: "work-stack work-tight" }, cd = { class: "work-stack work-tight" }, vd = {
  key: 1,
  class: "work-stack work-tight"
}, md = { class: "work-stack work-tight" }, fd = { class: "work-settings-grid" }, pd = { class: "work-row" }, bd = { class: "work-stack work-tight" }, hd = {
  key: 0,
  class: "work-stack work-tight"
}, gd = /* @__PURE__ */ pe({
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
      o.push({ id: xt("timer", o), after: "P1D", then: { emit: "reminder" } });
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
    return (o, n) => (c(), y("section", rd, [
      n[8] || (n[8] = d("h4", null, "Timers", -1)),
      (c(!0), y(J, null, le(i(), (s, g) => (c(), y("article", {
        key: s.id,
        class: "work-settings-card work-stack"
      }, [
        d("div", dd, [
          d("label", ud, [
            n[2] || (n[2] = M("Timer ID", -1)),
            h(r(me), {
              modelValue: s.id,
              "onUpdate:modelValue": (f) => s.id = f,
              required: "",
              pattern: "[a-z][a-z0-9_]*"
            }, null, 8, ["modelValue", "onUpdate:modelValue"])
          ]),
          d("label", cd, [
            n[3] || (n[3] = M("Deadline", -1)),
            h(r(oe), {
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
          s.after !== void 0 ? (c(), q(St, {
            key: 0,
            modelValue: s.after,
            "onUpdate:modelValue": (f) => s.after = f,
            label: "After",
            onValidity: n[0] || (n[0] = (f, k) => l("validity", k, f))
          }, null, 8, ["modelValue", "onUpdate:modelValue"])) : (c(), y("label", vd, [
            n[4] || (n[4] = M("At field", -1)),
            h(r(oe), {
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
          d("label", md, [
            n[5] || (n[5] = M("Duration by field", -1)),
            h(r(oe), {
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
        s.by ? (c(), q(bt, {
          key: 0,
          label: "Duration table",
          hint: "Map field values to ISO durations.",
          "model-value": s.table,
          shape: "object",
          "onUpdate:modelValue": (f) => s.table = f,
          onValidity: (f) => l("validity", "table-" + g, f)
        }, null, 8, ["model-value", "onUpdate:modelValue", "onValidity"])) : U("", !0),
        d("div", fd, [
          h(St, {
            modelValue: s.repeat,
            "onUpdate:modelValue": (f) => s.repeat = f,
            label: "Repeat every",
            onValidity: n[1] || (n[1] = (f, k) => l("validity", k, f)),
            disabled: s.interrupting
          }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"]),
          d("label", pd, [
            h(r(Bt), {
              modelValue: s.interrupting,
              "onUpdate:modelValue": [(f) => s.interrupting = f, (f) => s.interrupting && delete s.repeat],
              binary: ""
            }, null, 8, ["modelValue", "onUpdate:modelValue"]),
            n[6] || (n[6] = M("Interrupting", -1))
          ]),
          d("label", bd, [
            n[7] || (n[7] = M("Then", -1)),
            h(r(oe), {
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
          s.then ? (c(), y("label", hd, [
            M(A(s.then.transition !== void 0 ? "Transition ID" : "Event name"), 1),
            s.then.transition !== void 0 ? (c(), q(r(me), {
              key: 0,
              modelValue: s.then.transition,
              "onUpdate:modelValue": (f) => s.then.transition = f
            }, null, 8, ["modelValue", "onUpdate:modelValue"])) : (c(), q(r(me), {
              key: 1,
              modelValue: s.then.emit,
              "onUpdate:modelValue": (f) => s.then.emit = f
            }, null, 8, ["modelValue", "onUpdate:modelValue"]))
          ])) : U("", !0)
        ]),
        h(r(X), {
          severity: "secondary",
          onClick: (f) => i().splice(g, 1),
          "aria-label": "Remove timer",
          text: "",
          size: "small"
        }, {
          default: z(() => [
            h(r(_), {
              icon: "tabler:trash",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        }, 8, ["onClick"])
      ]))), 128)),
      h(r(X), {
        label: "Add timer",
        severity: "secondary",
        onClick: u,
        outlined: ""
      }, {
        icon: z(() => [
          h(r(_), {
            icon: "tabler:plus",
            "aria-hidden": "true"
          })
        ]),
        _: 1
      })
    ]));
  }
}), yd = ["aria-label"], kd = { class: "work-stack work-tight" }, wd = {
  key: 0,
  class: "work-stack work-tight"
}, Vd = /* @__PURE__ */ pe({
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
    return jl(() => l("validity", Array.isArray(t.modelValue) ? t.modelValue.length > 0 : "field" in t.modelValue ? !!t.modelValue.field : !!t.modelValue.group)), ht(() => l("validity", !0)), (p, o) => (c(), y("section", {
      class: "work-stack work-tight",
      "aria-label": e.label
    }, [
      d("label", kd, [
        M(A(e.label) + " source", 1),
        h(r(oe), {
          "model-value": i.value,
          "aria-label": e.label + " source",
          options: [{ label: "Group", value: "group" }, { label: "People and groups", value: "principals" }, { label: "Principal field", value: "field" }],
          optionLabel: "label",
          optionValue: "value",
          appendTo: "self",
          "onUpdate:modelValue": m
        }, null, 8, ["model-value", "aria-label"])
      ]),
      "field" in e.modelValue ? (c(), y("label", wd, [
        o[1] || (o[1] = M("Principal field", -1)),
        h(r(oe), {
          "model-value": e.modelValue.field,
          "aria-label": e.label + " field",
          options: e.draft.fields?.filter((n) => n.type === "principal").map((n) => ({ label: n.title || n.code, value: n.code })) ?? [],
          optionLabel: "label",
          optionValue: "value",
          appendTo: "self",
          "onUpdate:modelValue": o[0] || (o[0] = (n) => l("update:modelValue", { field: n }))
        }, null, 8, ["model-value", "aria-label", "options"])
      ])) : (c(), q(rl, {
        key: 1,
        "board-id": e.boardId,
        label: e.label,
        kinds: i.value === "group" ? "group" : "user,group,service",
        "model-value": u.value,
        "onUpdate:modelValue": v
      }, null, 8, ["board-id", "label", "kinds", "model-value"]))
    ], 8, yd));
  }
}), $d = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, xd = {
  class: "work-stack work-tight",
  "aria-label": "Approval sources"
}, Cd = { class: "work-row" }, Sd = {
  key: 0,
  class: "work-stack work-tight"
}, Td = ["kinds", "value"], Dd = {
  key: 2,
  class: "work-muted work-small",
  role: "status"
}, Ud = {
  key: 3,
  class: "work-chips"
}, Id = { class: "work-row work-small" }, Ed = { class: "work-process-options" }, Ad = { class: "work-stack work-tight" }, Pd = {
  key: 4,
  class: "work-error work-small",
  role: "alert"
}, Rd = {
  key: 5,
  class: "work-muted work-small"
}, Od = /* @__PURE__ */ pe({
  __name: "ApproversEditor",
  props: {
    approvals: {},
    boardId: {}
  },
  emits: ["validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, { principalLabel: i, rememberPrincipal: u, nameError: m } = ql(() => t.boardId ?? "", () => Array.isArray(t.approvals.from) ? t.approvals.from : "group" in t.approvals.from ? [{ kind: "group", id: t.approvals.from.group }] : []), v = B(!1), p = H(() => Array.isArray(t.approvals.from) ? "principals" : "field" in t.approvals.from ? "field" : "group"), o = H(() => Array.isArray(t.approvals.from) ? t.approvals.from.some((f) => f.kind === "group") || t.approvals.from.length >= t.approvals.min : "field" in t.approvals.from ? !!t.approvals.from.field : !!t.approvals.from.group);
    jl(() => l("validity", Number.isSafeInteger(t.approvals.min) && t.approvals.min > 0 && o.value)), ht(() => l("validity", !0)), Ca(async () => {
      v.value = await ft("wc-principal-picker");
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
      const I = { kind: k.type ?? k.kind ?? "user", id: $ };
      k.label && u(I, k.label), t.approvals.from.some((E) => E.id === $ && E.kind === I.kind) || t.approvals.from.push(I);
    }
    function g(f) {
      Array.isArray(t.approvals.from) && t.approvals.from.splice(f, 1);
    }
    return (f, k) => (c(), y(J, null, [
      r(m) ? (c(), y("p", $d, A(r(m)), 1)) : U("", !0),
      d("section", xd, [
        d("label", Cd, [
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
        "field" in e.approvals.from ? (c(), y("label", Sd, [
          k[5] || (k[5] = M("Principal field", -1)),
          h(r(me), {
            modelValue: e.approvals.from.field,
            "onUpdate:modelValue": k[1] || (k[1] = ($) => e.approvals.from.field = $),
            "aria-label": "Principal field"
          }, null, 8, ["modelValue"])
        ])) : v.value ? (c(), y("wc-principal-picker", {
          key: p.value,
          kinds: p.value === "group" ? "group" : "user,group,service",
          value: JSON.stringify("group" in e.approvals.from ? { type: "group", principal_id: e.approvals.from.group } : {}),
          onConfigChanged: s
        }, null, 40, Td)) : (c(), y("p", Dd, "The principal picker is unavailable.")),
        Array.isArray(e.approvals.from) ? (c(), y("div", Ud, [
          (c(!0), y(J, null, le(e.approvals.from, ($, I) => (c(), q(r(Ne), {
            key: $.kind + ":" + $.id,
            class: "kx-tag-sm",
            severity: "secondary"
          }, {
            default: z(() => [
              M(A(r(i)($)), 1),
              h(r(X), {
                "aria-label": "Remove approver " + (I + 1),
                text: "",
                severity: "secondary",
                size: "small",
                onClick: (E) => g(I)
              }, {
                default: z(() => [
                  h(r(_), {
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
        d("label", Id, [
          k[6] || (k[6] = d("span", { class: "work-spacer" }, "The person who moves the item here cannot approve this visit", -1)),
          h(r(We), {
            modelValue: e.approvals.prevent_self,
            "onUpdate:modelValue": k[2] || (k[2] = ($) => e.approvals.prevent_self = $),
            "aria-label": "The person who moves the item here cannot approve this visit"
          }, null, 8, ["modelValue"])
        ]),
        d("details", Ed, [
          k[8] || (k[8] = d("summary", null, "Approval options", -1)),
          d("label", Ad, [
            k[7] || (k[7] = M("Approval source", -1)),
            h(r(oe), {
              "model-value": p.value,
              "onUpdate:modelValue": k[3] || (k[3] = ($) => n($)),
              appendTo: "self",
              optionLabel: "label",
              optionValue: "value",
              options: [{ label: "Group members", value: "group" }, { label: "People and groups", value: "principals" }, { label: "Principal field", value: "field" }]
            }, null, 8, ["model-value"])
          ])
        ]),
        Array.isArray(e.approvals.from) && !o.value ? (c(), y("p", Pd, "Select at least " + A(e.approvals.min) + " distinct principals, or lower the minimum.", 1)) : "group" in e.approvals.from && !e.approvals.from.group ? (c(), y("p", Rd, "Choose the group that can approve this state.")) : U("", !0)
      ])
    ], 64));
  }
}), Nd = {
  class: "work-state-settings work-stack",
  "aria-label": "State settings"
}, Md = { class: "work-process-kind" }, Fd = { class: "work-process-options" }, zd = { class: "work-stack" }, Ld = { class: "work-row" }, Bd = { class: "work-stack work-tight" }, jd = { class: "work-row" }, qd = { class: "work-stack work-tight" }, Wd = { class: "work-row" }, Kd = { class: "work-row" }, Gd = { class: "work-stack work-tight" }, Hd = { class: "work-row" }, Yd = { class: "work-stack work-tight" }, Xd = { class: "work-stack work-tight" }, Jd = {
  key: 0,
  class: "work-row"
}, Zd = { class: "work-row" }, Qd = { class: "work-row" }, _d = { class: "work-stack work-tight" }, eu = { class: "work-row" }, tu = /* @__PURE__ */ pe({
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
    return (p, o) => (c(), y("section", Nd, [
      o[52] || (o[52] = d("h4", { class: "work-process-group" }, "Who moves the item on", -1)),
      h(r(nl), {
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
        option: z(({ option: n }) => [
          d("span", Md, [
            h(r(_), {
              icon: "tabler:" + n.icon
            }, null, 8, ["icon"]),
            d("span", null, A(n.label), 1)
          ])
        ]),
        _: 1
      }, 8, ["model-value", "options"]),
      e.state.kind === "gate" && e.state.release_when ? (c(), y(J, { key: 0 }, [
        o[33] || (o[33] = d("h4", { class: "work-process-group" }, "Approval", -1)),
        e.state.release_when.approvals ? (c(), q(Od, {
          key: 0,
          "board-id": e.boardId,
          approvals: e.state.release_when.approvals,
          onValidity: o[0] || (o[0] = (n) => l("validity", "approvers", n))
        }, null, 8, ["board-id", "approvals"])) : U("", !0),
        d("details", Fd, [
          o[32] || (o[32] = d("summary", null, "Release options", -1)),
          d("div", zd, [
            d("label", Ld, [
              o[31] || (o[31] = d("span", { class: "work-spacer" }, "Require approvals", -1)),
              h(r(We), {
                "model-value": !!e.state.release_when.approvals,
                "aria-label": "Require approvals",
                "onUpdate:modelValue": o[1] || (o[1] = (n) => e.state.release_when.approvals = n ? { min: 1, from: { group: "" }, prevent_self: !0 } : void 0)
              }, null, 8, ["model-value"])
            ]),
            h(St, {
              modelValue: e.state.release_when.wait,
              "onUpdate:modelValue": o[2] || (o[2] = (n) => e.state.release_when.wait = n),
              label: "Wait before release",
              onValidity: o[3] || (o[3] = (n, s) => l("validity", s, n))
            }, null, 8, ["modelValue"]),
            h(sl, {
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
      e.state.kind === "automated" && e.state.run ? (c(), y(J, { key: 1 }, [
        o[40] || (o[40] = d("h4", { class: "work-process-group" }, "Automation", -1)),
        d("label", Bd, [
          o[34] || (o[34] = M("Run label", -1)),
          h(r(me), {
            modelValue: e.state.run.stage,
            "onUpdate:modelValue": o[6] || (o[6] = (n) => e.state.run.stage = n),
            "aria-label": "Run label",
            required: ""
          }, null, 8, ["modelValue"])
        ]),
        h(od, {
          modelValue: e.state.run.flow_ref,
          "onUpdate:modelValue": o[7] || (o[7] = (n) => e.state.run.flow_ref = n),
          onValidity: o[8] || (o[8] = (n) => l("validity", "flow", n))
        }, null, 8, ["modelValue"]),
        h(St, {
          modelValue: e.state.run.timeout,
          "onUpdate:modelValue": o[9] || (o[9] = (n) => e.state.run.timeout = n),
          label: "Attempt timeout",
          onValidity: o[10] || (o[10] = (n, s) => l("validity", s, n))
        }, null, 8, ["modelValue"]),
        o[41] || (o[41] = d("small", { class: "work-muted" }, "Blank uses the board timeout, or one hour.", -1)),
        d("label", jd, [
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
        d("label", qd, [
          o[36] || (o[36] = M("When visits are exhausted", -1)),
          h(r(oe), {
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
        d("label", Wd, [
          o[37] || (o[37] = d("span", { class: "work-spacer" }, "Retry if it fails", -1)),
          h(r(We), {
            "model-value": !!e.state.run.retry,
            "aria-label": "Retry if it fails",
            "onUpdate:modelValue": o[13] || (o[13] = (n) => e.state.run.retry = n ? { max: 1, backoff: "PT1M" } : void 0)
          }, null, 8, ["model-value"])
        ]),
        e.state.run.retry ? (c(), y(J, { key: 0 }, [
          d("label", Kd, [
            o[38] || (o[38] = d("span", { class: "work-spacer" }, "Maximum attempts", -1)),
            h(r(Ze), {
              modelValue: e.state.run.retry.max,
              "onUpdate:modelValue": o[14] || (o[14] = (n) => e.state.run.retry.max = n),
              min: 1,
              useGrouping: !1
            }, null, 8, ["modelValue"])
          ]),
          h(St, {
            modelValue: e.state.run.retry.backoff,
            "onUpdate:modelValue": o[15] || (o[15] = (n) => e.state.run.retry.backoff = n),
            label: "Wait between attempts",
            onValidity: o[16] || (o[16] = (n, s) => l("validity", s, n))
          }, null, 8, ["modelValue"])
        ], 64)) : U("", !0),
        (c(), y(J, null, le([{ key: "on_pass", label: "On success" }, { key: "on_cancel", label: "On cancellation" }], (n) => d("label", {
          key: n.key,
          class: "work-stack work-tight"
        }, [
          M(A(n.label), 1),
          h(r(oe), {
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
        d("label", Gd, [
          o[39] || (o[39] = M("If it fails, go to", -1)),
          h(r(oe), {
            "model-value": e.state.run.on_fail,
            "onUpdate:modelValue": v,
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            showClear: "",
            options: i.value.map((n) => ({
              label: r(Pe)(n) + " → " + r(ve)(e.process.states.find((s) => s.id === n.to)),
              value: n.id
            }))
          }, null, 8, ["model-value", "options"])
        ])
      ], 64)) : U("", !0),
      e.state.kind === "parallel" && e.state.regions ? (c(), y(J, { key: 2 }, [
        o[47] || (o[47] = d("h4", { class: "work-process-group" }, "Lanes", -1)),
        (c(!0), y(J, null, le(e.state.regions, (n, s) => (c(), y("div", {
          key: s,
          class: "work-process-value work-stack work-tight"
        }, [
          d("div", Hd, [
            d("span", null, "Lane " + A(s + 1), 1),
            o[43] || (o[43] = d("span", { class: "work-spacer" }, null, -1)),
            h(r(X), {
              severity: "danger",
              text: "",
              size: "small",
              "aria-label": "Remove lane",
              onClick: (g) => e.state.regions.splice(s, 1)
            }, {
              default: z(() => [
                h(r(_), { icon: "tabler:trash" })
              ]),
              _: 1
            }, 8, ["onClick"])
          ]),
          d("label", Yd, [
            o[44] || (o[44] = M("Starts at", -1)),
            h(r(oe), {
              modelValue: n.initial,
              "onUpdate:modelValue": (g) => n.initial = g,
              appendTo: "self",
              optionLabel: "label",
              optionValue: "value",
              options: e.process.states.filter((g) => g.id !== e.state.id).map((g) => ({ label: r(ve)(g), value: g.id }))
            }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
          ])
        ]))), 128)),
        h(r(X), {
          label: "Add lane",
          severity: "secondary",
          outlined: "",
          size: "small",
          onClick: o[17] || (o[17] = (n) => e.state.regions.push({
            id: r(xt)("region", e.state.regions),
            initial: e.process.states.find((s) => s.id !== e.state.id)?.id ?? ""
          }))
        }, {
          icon: z(() => [
            h(r(_), { icon: "tabler:plus" })
          ]),
          _: 1
        }),
        d("label", Xd, [
          o[45] || (o[45] = M("Finish rule", -1)),
          h(r(oe), {
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
        typeof e.state.join == "number" ? (c(), y("label", Jd, [
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
      d("label", Zd, [
        o[48] || (o[48] = d("span", { class: "work-spacer" }, "Items allowed here", -1)),
        h(xa, {
          draft: e.draft,
          state: e.state.id,
          label: "Items allowed here"
        }, null, 8, ["draft", "state"])
      ]),
      d("label", Qd, [
        o[49] || (o[49] = d("span", { class: "work-spacer" }, [
          M("Refuse moves over the limit"),
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
      h(qt, {
        label: "Required fields",
        options: e.draft.fields?.map((n) => ({ value: n.code, label: n.title || n.code })) ?? [],
        modelValue: e.state.require,
        "onUpdate:modelValue": o[20] || (o[20] = (n) => e.state.require = n)
      }, null, 8, ["options", "modelValue"]),
      !e.state.kind || e.state.kind === "human" ? (c(), q(St, {
        key: 3,
        modelValue: e.state.due,
        "onUpdate:modelValue": o[21] || (o[21] = (n) => e.state.due = n),
        label: "Time allowed in this state",
        onValidity: o[22] || (o[22] = (n, s) => l("validity", s, n))
      }, null, 8, ["modelValue"])) : U("", !0),
      o[55] || (o[55] = d("h4", { class: "work-process-group" }, "Assignment and conditions", -1)),
      d("label", _d, [
        o[50] || (o[50] = M("Stage label", -1)),
        h(r(me), {
          "model-value": e.state.stage,
          "aria-label": "Stage label",
          "onUpdate:modelValue": o[23] || (o[23] = (n) => e.state.stage = n || void 0)
        }, null, 8, ["model-value"])
      ]),
      !e.state.kind || e.state.kind === "human" || e.state.kind === "parallel" ? (c(), y(J, { key: 4 }, [
        d("label", eu, [
          h(r(We), {
            "model-value": !!e.state.awaiting,
            "aria-label": "Awaiting people",
            "onUpdate:modelValue": o[24] || (o[24] = (n) => e.state.awaiting = n ? { group: "" } : void 0)
          }, null, 8, ["model-value"]),
          o[51] || (o[51] = M("Awaiting people", -1))
        ]),
        e.state.awaiting ? (c(), q(Vd, {
          key: 0,
          modelValue: e.state.awaiting,
          "onUpdate:modelValue": o[25] || (o[25] = (n) => e.state.awaiting = n),
          draft: e.draft,
          "board-id": e.boardId,
          label: "Awaiting",
          onValidity: o[26] || (o[26] = (n) => l("validity", "awaiting", n))
        }, null, 8, ["modelValue", "draft", "board-id"])) : U("", !0)
      ], 64)) : U("", !0),
      h(rl, {
        "board-id": e.boardId,
        modelValue: e.state.assign,
        "onUpdate:modelValue": o[27] || (o[27] = (n) => e.state.assign = n),
        label: "Assign to"
      }, null, 8, ["board-id", "modelValue"]),
      h(bt, {
        label: "State checks",
        example: ["installed-check"],
        "model-value": e.state.invariants,
        shape: "array",
        "onUpdate:modelValue": o[28] || (o[28] = (n) => e.state.invariants = n),
        onValidity: o[29] || (o[29] = (n) => l("validity", "invariants", n))
      }, null, 8, ["model-value"]),
      h(gd, {
        state: e.state,
        draft: e.draft,
        onValidity: o[30] || (o[30] = (n, s) => l("validity", "timer-" + n, s))
      }, null, 8, ["state", "draft"])
    ]));
  }
}), au = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, lu = {
  class: "work-process-controls",
  role: "toolbar",
  "aria-label": "Process tools"
}, ou = {
  key: 1,
  class: "work-process-title"
}, iu = { class: "work-muted" }, nu = {
  key: 2,
  class: "work-map-zoom",
  role: "group",
  "aria-label": "Map zoom"
}, su = ["aria-label"], ru = { class: "work-row" }, du = { class: "work-process-meaning" }, uu = { class: "work-stack work-tight" }, cu = { class: "work-process-inspector-foot" }, vu = { class: "work-row" }, mu = { class: "work-process-meaning" }, fu = { class: "work-stack work-tight" }, pu = { class: "work-process-inspector-foot" }, bu = {
  key: 3,
  class: "work-row"
}, hu = { class: "work-stack work-tight" }, gu = { class: "work-dialog-actions" }, yu = /* @__PURE__ */ pe({
  __name: "ProcessEditor",
  props: {
    draft: {},
    guardRemoval: { type: Function },
    issues: {},
    boardId: {}
  },
  emits: ["validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, i = H(() => t.draft.processes ?? []), u = B(!1), m = B(""), v = B(""), p = B(""), o = B("Map"), n = B(""), s = B(), g = B(), f = B(), k = B(), $ = B(!1);
    let I;
    async function E() {
      $.value = !0, await pl(), k.value?.querySelector('[aria-label="State name"]')?.focus();
    }
    const C = H(() => i.value.find((L) => L.id === v.value) ?? i.value[0]);
    function S() {
      $.value = !1, s.value = void 0, g.value = void 0, p.value = "", I = void 0;
    }
    async function D() {
      const L = I;
      S(), await pl(), L?.isConnected && L.focus();
    }
    function P(L, T) {
      I = T, $.value = !1, s.value = L, g.value = void 0, n.value = "", p.value = "";
    }
    function K(L, T) {
      I = T, $.value = !1, g.value = L, s.value = void 0, p.value = "";
    }
    Ce(C, S);
    function te(L) {
      L === "__new" ? u.value = !0 : v.value = L;
    }
    function ce() {
      const L = m.value.trim();
      if (!L) return;
      const T = L.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "") || "process", F = (/^[a-z]/.test(T) ? T : "process_" + T).slice(0, 40), Q = i.value.some((we) => we.id === F) ? xt(F, i.value) : F;
      (t.draft.processes ??= []).push({ id: Q, name: L, initial: "todo", states: [{ id: "todo", name: "To do", category: "unstarted" }], transitions: [] }), v.value = Q, m.value = "", u.value = !1;
    }
    async function se(L, T) {
      const F = { id: xt("state", L.states), name: "New state", category: "started" }, Q = Ha(L), we = Q.at(-1), he = s.value ?? (we?.category === "completed" ? Q.at(-2) : we), ge = he && (L.transitions?.find((b) => b.default && b.from !== "any" && b.from.includes(he.id)) ?? L.transitions?.find((b) => b.from !== "any" && b.from.includes(he.id) && L.states.findIndex((x) => x.id === b.to) > L.states.indexOf(he)));
      if (L.states.splice(he ? L.states.indexOf(he) + 1 : L.states.length, 0, F), he && he.category !== "completed" && he.category !== "canceled")
        if (ge) {
          const b = ge.to;
          ge.to = F.id, (L.transitions ??= []).push({ id: xt("transition", L.transitions ?? []), name: "Continue", from: [F.id], to: b, ...ge.auto && ge.default ? { auto: !0, default: !0 } : {} });
        } else (L.transitions ??= []).push({ id: xt("transition", L.transitions ?? []), name: "Continue", from: [he.id], to: F.id });
      P(F, T), await E();
    }
    function W(L, T, F = I) {
      const Q = C.value;
      if (!Q || !T || L === T) return;
      let we = `to_${T}`, he = 2;
      for (; Q.transitions?.some((b) => b.id === we); ) we = `to_${T}_${he++}`;
      const ge = { id: we, name: `To ${ve(Q.states.find((b) => b.id === T)).toLowerCase()}`, from: [L], to: T };
      (Q.transitions ??= []).push(ge), K(ge, F);
    }
    function O(L, T) {
      const F = { id: xt("transition", L.transitions ?? []), name: "To " + ve(L.states.at(-1)), from: [L.initial], to: L.states.at(-1)?.id ?? L.initial };
      (L.transitions ??= []).push(F), K(F, T);
    }
    function N(L, T) {
      const F = Oo(L, T);
      if (F.length) {
        p.value = `Used by ${F.join(", ")}. Update those references first.`;
        return;
      }
      L.transitions?.splice(L.transitions.indexOf(T), 1), S();
    }
    function V(L, T) {
      const F = No(L, T);
      if (F.length) {
        p.value = `${ve(T)} is used by ${F.join(", ")}. Update these references first.`;
        return;
      }
      L.states.splice(L.states.indexOf(T), 1), S();
    }
    async function R(L) {
      const T = t.draft.item_types?.filter((Q) => Q.process === L.id).map((Q) => Q.title || "Untitled item type") ?? [];
      if (T.length) {
        p.value = `Used by ${T.join(", ")}. Choose a different process for those item types first.`;
        return;
      }
      const F = await t.guardRemoval?.("processes", L.id);
      if (F) {
        p.value = F;
        return;
      }
      la(t.draft, "processes", L.id), v.value = "", S();
    }
    return (L, T) => (c(), y("section", {
      class: "work-process-editor work-stack",
      "aria-label": "Process editor",
      onKeydown: Oe(D, ["esc"])
    }, [
      p.value ? (c(), y("p", au, A(p.value), 1)) : U("", !0),
      (c(!0), y(J, null, le(e.issues?.filter((F) => F.code === "process " + C.value?.id) ?? [], (F) => (c(), y("p", {
        key: F.what + F.detail,
        class: "work-error work-small",
        role: "alert"
      }, A(r(Sa)(F)) + " · " + A(F.what), 1))), 128)),
      C.value ? (c(), y("div", {
        key: 1,
        class: pt(["work-process-builder", { "work-process-inspecting": s.value || g.value }])
      }, [
        d("div", lu, [
          i.value.length > 1 ? (c(), q(r(oe), {
            key: 0,
            "model-value": C.value.id,
            "aria-label": "Process",
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            options: [
              ...i.value.map((F) => ({ label: F.name || "Untitled process", value: F.id })),
              { label: "New process…", value: "__new" }
            ],
            "onUpdate:modelValue": te
          }, null, 8, ["model-value", "options"])) : (c(), y("span", ou, A(C.value.name || "Process"), 1)),
          h(r(X), {
            label: "Add state",
            severity: "secondary",
            outlined: "",
            size: "small",
            onClick: T[0] || (T[0] = (F) => se(C.value, F.currentTarget))
          }, {
            icon: z(() => [
              h(r(_), { icon: "tabler:plus" })
            ]),
            _: 1
          }),
          h(r(oe), {
            modelValue: C.value.initial,
            "onUpdate:modelValue": T[1] || (T[1] = (F) => C.value.initial = F),
            "aria-label": "Starts in " + r(ve)(C.value.states.find((F) => F.id === C.value.initial)),
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            options: C.value.states.map((F) => ({ label: r(ve)(F), value: F.id }))
          }, {
            value: z(() => [
              d("span", iu, "Starts in " + A(r(ve)(C.value.states.find((F) => F.id === C.value.initial))), 1)
            ]),
            _: 1
          }, 8, ["modelValue", "aria-label", "options"]),
          T[17] || (T[17] = d("span", { class: "work-spacer" }, null, -1)),
          o.value === "Map" ? (c(), y("div", nu, [
            h(r(X), {
              label: "Fit",
              title: "Fit to width and show the full process",
              text: "",
              severity: "secondary",
              size: "small",
              onClick: T[2] || (T[2] = (F) => f.value?.fit())
            }, {
              icon: z(() => [
                h(r(_), { icon: "tabler:arrows-maximize" })
              ]),
              _: 1
            }),
            o.value === "Map" ? (c(), q(r(X), {
              key: 0,
              "aria-label": "Zoom out",
              title: "Zoom out",
              text: "",
              severity: "secondary",
              size: "small",
              onClick: T[3] || (T[3] = (F) => f.value?.zoomOut())
            }, {
              default: z(() => [
                h(r(_), { icon: "tabler:minus" })
              ]),
              _: 1
            })) : U("", !0),
            o.value === "Map" ? (c(), q(r(X), {
              key: 1,
              "aria-label": "Zoom in",
              title: "Zoom in",
              text: "",
              severity: "secondary",
              size: "small",
              onClick: T[4] || (T[4] = (F) => f.value?.zoomIn())
            }, {
              default: z(() => [
                h(r(_), { icon: "tabler:plus" })
              ]),
              _: 1
            })) : U("", !0)
          ])) : U("", !0),
          h(r(nl), {
            modelValue: o.value,
            "onUpdate:modelValue": T[5] || (T[5] = (F) => o.value = F),
            options: ["Map", "List"],
            "allow-empty": !1,
            "aria-label": "Process layout"
          }, null, 8, ["modelValue"]),
          i.value.length === 1 ? (c(), q(r(X), {
            key: 3,
            label: "New process",
            "aria-label": "New process",
            text: "",
            severity: "secondary",
            size: "small",
            onClick: T[6] || (T[6] = (F) => u.value = !0)
          }, {
            icon: z(() => [
              h(r(_), { icon: "tabler:plus" })
            ]),
            _: 1
          })) : U("", !0)
        ]),
        o.value === "Map" ? (c(), q(kr, {
          key: 0,
          ref_key: "graph",
          ref: f,
          process: C.value,
          draft: e.draft,
          "selected-state": s.value,
          "selected-transition": g.value,
          onState: P,
          onTransition: K,
          onConnect: W,
          onClear: D
        }, null, 8, ["process", "draft", "selected-state", "selected-transition"])) : (c(), q(zr, {
          key: 1,
          process: C.value,
          "selected-state": s.value,
          "selected-transition": g.value,
          onState: P,
          onTransition: K,
          onRemoveState: T[7] || (T[7] = (F) => V(C.value, F)),
          onRemoveTransition: T[8] || (T[8] = (F) => N(C.value, F)),
          onAddTransition: T[9] || (T[9] = (F) => O(C.value, F))
        }, null, 8, ["process", "selected-state", "selected-transition"])),
        s.value || g.value ? (c(), y("aside", {
          key: 2,
          ref_key: "inspector",
          ref: k,
          class: "work-process-sideform",
          "aria-label": s.value ? "State inspector" : "Transition inspector"
        }, [
          (c(!0), y(J, null, le(s.value ? [s.value] : [], (F) => (c(), y(J, {
            key: F.id
          }, [
            d("header", ru, [
              $.value ? (c(), q(r(me), {
                key: 1,
                modelValue: F.name,
                "onUpdate:modelValue": (Q) => F.name = Q,
                class: "work-process-name",
                "aria-label": "State name",
                onBlur: T[10] || (T[10] = (Q) => $.value = !1)
              }, null, 8, ["modelValue", "onUpdate:modelValue"])) : (c(), q(ol, {
                key: 0,
                class: "work-process-state-title",
                "aria-label": "Rename state",
                onActivate: E
              }, {
                default: z(() => [
                  d("span", null, A(r(ve)(F)), 1)
                ]),
                _: 2
              }, 1024)),
              h(r(X), {
                severity: "secondary",
                text: "",
                size: "small",
                "aria-label": "Close state editor",
                onClick: D
              }, {
                default: z(() => [
                  h(r(_), { icon: "tabler:x" })
                ]),
                _: 1
              })
            ]),
            d("p", du, A(r(Ro)(F, e.draft)), 1),
            h(tu, {
              state: F,
              process: C.value,
              draft: e.draft,
              "board-id": e.boardId,
              onValidity: (Q, we) => l("validity", Q.includes("duration:") ? Q : C.value.id + ":" + F.id + ":" + Q, we)
            }, null, 8, ["state", "process", "draft", "board-id", "onValidity"]),
            d("label", uu, [
              T[18] || (T[18] = M("Phase", -1)),
              h(r(oe), {
                modelValue: F.category,
                "onUpdate:modelValue": (Q) => F.category = Q,
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                options: ["triage", "backlog", ...r(Wl)].map((Q) => ({ label: r(Dt)(Q), value: Q }))
              }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
            ]),
            T[19] || (T[19] = d("h4", { class: "work-process-group" }, "Next stop", -1)),
            h(r(oe), {
              modelValue: n.value,
              "onUpdate:modelValue": T[11] || (T[11] = (Q) => n.value = Q),
              "aria-label": "Add transition to…",
              placeholder: "Add transition to…",
              appendTo: "self",
              optionLabel: "label",
              optionValue: "value",
              options: C.value.states.filter((Q) => Q !== F).map((Q) => ({ label: r(ve)(Q), value: Q.id }))
            }, null, 8, ["modelValue", "options"]),
            h(r(X), {
              label: "Add transition",
              severity: "secondary",
              outlined: "",
              size: "small",
              disabled: !n.value,
              onClick: (Q) => W(F.id, n.value)
            }, {
              icon: z(() => [
                h(r(_), { icon: "tabler:arrow-right" })
              ]),
              _: 1
            }, 8, ["disabled", "onClick"]),
            d("footer", cu, [
              h(r(X), {
                label: "Remove state",
                severity: "danger",
                text: "",
                size: "small",
                onClick: (Q) => V(C.value, F)
              }, {
                icon: z(() => [
                  h(r(_), { icon: "tabler:trash" })
                ]),
                _: 1
              }, 8, ["onClick"])
            ])
          ], 64))), 128)),
          (c(!0), y(J, null, le(g.value ? [g.value] : [], (F) => (c(), y(J, {
            key: F.id
          }, [
            d("header", vu, [
              T[20] || (T[20] = d("h3", null, "Transition", -1)),
              T[21] || (T[21] = d("span", { class: "work-spacer" }, null, -1)),
              h(r(X), {
                severity: "secondary",
                text: "",
                size: "small",
                "aria-label": "Close transition editor",
                onClick: D
              }, {
                default: z(() => [
                  h(r(_), { icon: "tabler:x" })
                ]),
                _: 1
              })
            ]),
            d("p", mu, A(F.from === "any" ? "Any state" : F.from.map((Q) => r(ve)(C.value.states.find((we) => we.id === Q))).join(", ")) + " → " + A(r(ve)(C.value.states.find((Q) => Q.id === F.to))), 1),
            d("label", fu, [
              T[22] || (T[22] = M("Name", -1)),
              h(r(me), {
                modelValue: F.name,
                "onUpdate:modelValue": (Q) => F.name = Q,
                placeholder: r(Pe)(F),
                "aria-label": "Transition name"
              }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder"])
            ]),
            h(Xr, {
              transition: F,
              process: C.value,
              draft: e.draft,
              "board-id": e.boardId,
              onValidity: (Q, we) => l("validity", C.value.id + ":transition-" + F.id + ":" + Q, we)
            }, null, 8, ["transition", "process", "draft", "board-id", "onValidity"]),
            d("footer", pu, [
              h(r(X), {
                label: "Remove transition",
                severity: "danger",
                text: "",
                size: "small",
                onClick: (Q) => N(C.value, F)
              }, {
                icon: z(() => [
                  h(r(_), { icon: "tabler:trash" })
                ]),
                _: 1
              }, 8, ["onClick"])
            ])
          ], 64))), 128))
        ], 8, su)) : U("", !0)
      ], 2)) : (c(), q(r(X), {
        key: 2,
        label: "New process",
        severity: "secondary",
        outlined: "",
        onClick: T[12] || (T[12] = (F) => u.value = !0)
      }, {
        icon: z(() => [
          h(r(_), { icon: "tabler:plus" })
        ]),
        _: 1
      })),
      o.value === "List" && C.value ? (c(), y("div", bu, [
        h(r(X), {
          label: "Remove process",
          severity: "danger",
          text: "",
          size: "small",
          onClick: T[13] || (T[13] = (F) => R(C.value))
        }, {
          icon: z(() => [
            h(r(_), { icon: "tabler:trash" })
          ]),
          _: 1
        })
      ])) : U("", !0),
      h(Gl, {
        visible: u.value,
        label: "New process",
        onClose: T[16] || (T[16] = (F) => u.value = !1)
      }, {
        default: z(() => [
          d("form", {
            class: "work-dialog-box",
            "aria-label": "New process",
            onSubmit: ye(ce, ["stop", "prevent"])
          }, [
            T[24] || (T[24] = d("h2", null, "New process", -1)),
            d("label", hu, [
              T[23] || (T[23] = M("Name", -1)),
              h(r(me), {
                modelValue: m.value,
                "onUpdate:modelValue": T[14] || (T[14] = (F) => m.value = F),
                "aria-label": "New process name",
                autofocus: "",
                required: ""
              }, null, 8, ["modelValue"])
            ]),
            d("div", gu, [
              h(r(X), {
                label: "Cancel",
                severity: "secondary",
                outlined: "",
                onClick: T[15] || (T[15] = (F) => u.value = !1)
              }),
              h(r(X), {
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
}), ku = ["inert"], wu = { class: "work-stack work-tight" }, Vu = /* @__PURE__ */ pe({
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
    return (i, u) => (c(), y("section", {
      class: "work-stack work-settings-card",
      "aria-label": "Existing items",
      inert: e.disabled || void 0
    }, [
      u[0] || (u[0] = d("h3", null, "Existing items", -1)),
      u[1] || (u[1] = d("p", { class: "work-muted work-small" }, " Choose how existing items follow these changes, then review the impact before applying. ", -1)),
      (c(!0), y(J, null, le(e.draft.processes ?? [], (m) => (c(), y("div", {
        key: m.id,
        class: "work-stack"
      }, [
        d("label", wu, [
          M(A(m.name || "Untitled process"), 1),
          h(r(oe), {
            disabled: e.disabled,
            "model-value": r(gl)(m),
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
        r(gl)(m) !== "pin" ? (c(!0), y(J, { key: 0 }, le(l(m), (v) => (c(), y("label", {
          key: v.id,
          class: "work-stack work-tight"
        }, [
          M("Move items from " + A(r(ve)(v)) + " to", 1),
          h(r(oe), {
            disabled: e.disabled,
            "model-value": m.map?.[v.id],
            placeholder: "Choose a surviving state",
            appendTo: "self",
            showClear: "",
            optionLabel: "label",
            optionValue: "value",
            options: m.states.map((p) => ({ label: r(ve)(p), value: p.id })),
            "onUpdate:modelValue": (p) => t(m, v.id, p)
          }, null, 8, ["disabled", "model-value", "options", "onUpdate:modelValue"])
        ]))), 128)) : U("", !0)
      ]))), 128))
    ], 8, ku));
  }
}), $u = {
  class: "work-stack",
  "aria-label": "Policy editor"
}, xu = { class: "work-settings-list" }, Cu = { class: "work-settings-row" }, Su = { class: "work-row-control" }, Tu = { class: "work-settings-list work-wip-container" }, Du = { class: "work-wip-table" }, Uu = { class: "work-mono" }, Iu = { class: "work-row-main" }, Eu = { class: "work-row" }, Au = { class: "work-row" }, Pu = { class: "work-settings-list" }, Ru = { class: "work-settings-row" }, Ou = { class: "work-row-control" }, Nu = { class: "work-row-main" }, Mu = { class: "work-row-title" }, Fu = { class: "work-muted work-small" }, zu = { class: "work-row-control" }, Lu = /* @__PURE__ */ pe({
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
    return (n, s) => (c(), y("section", $u, [
      s[13] || (s[13] = d("header", { class: "work-section-heading" }, [
        d("div", null, [
          d("h2", null, "Policy"),
          d("p", { class: "work-muted work-small" }, "Set capacity and how long the board keeps its history.")
        ])
      ], -1)),
      s[14] || (s[14] = d("h3", { class: "work-group-title" }, "Item keys", -1)),
      d("div", xu, [
        d("div", Cu, [
          s[7] || (s[7] = d("div", { class: "work-row-main" }, [
            d("strong", { class: "work-row-title" }, "Item key prefix"),
            d("p", { class: "work-muted work-small" }, "Work reviews and claims prefix changes when you apply the schema.")
          ], -1)),
          d("div", Su, [
            h(r(me), {
              modelValue: e.draft.key_prefix,
              "onUpdate:modelValue": s[0] || (s[0] = (g) => e.draft.key_prefix = g),
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
      d("div", Tu, [
        d("table", Du, [
          s[8] || (s[8] = d("thead", null, [
            d("tr", null, [
              d("th", null, "State"),
              d("th", null, "Limit"),
              d("th", null, "Hard limit")
            ])
          ], -1)),
          d("tbody", null, [
            (c(!0), y(J, null, le(u.value, (g) => (c(), y("tr", { key: g }, [
              d("td", null, [
                d("strong", null, A(e.draft.processes?.flatMap((f) => f.states).find((f) => f.id === g)?.name || r(ke)(g)), 1),
                d("code", Uu, A(g), 1)
              ]),
              d("td", null, [
                h(xa, {
                  draft: e.draft,
                  state: g,
                  label: g + " WIP limit"
                }, null, 8, ["draft", "state", "label"])
              ]),
              d("td", null, [
                h(xa, {
                  draft: e.draft,
                  state: g,
                  label: g + " hard WIP limit",
                  hard: ""
                }, null, 8, ["draft", "state", "label"])
              ])
            ]))), 128))
          ])
        ]),
        (c(!0), y(J, null, le(Object.keys(i.value.wip ?? {}).filter((g) => !u.value.includes(g)), (g) => (c(), y("div", {
          key: g,
          class: "work-settings-row"
        }, [
          d("div", Iu, [
            M(A(r(ke)(g)) + " ", 1),
            s[9] || (s[9] = d("span", { class: "work-muted" }, "Removed state", -1))
          ]),
          h(r(X), {
            label: "Remove stale limit",
            severity: "secondary",
            outlined: "",
            onClick: (f) => delete i.value.wip[g]
          }, {
            icon: z(() => [
              h(r(_), { icon: "tabler:trash" })
            ]),
            _: 1
          }, 8, ["onClick"])
        ]))), 128))
      ]),
      s[17] || (s[17] = d("h3", { class: "work-group-title" }, "Automated stages", -1)),
      h(St, {
        "model-value": i.value.stage_timeout,
        "onUpdate:modelValue": s[1] || (s[1] = (g) => p("stage_timeout", g)),
        label: "Default attempt timeout",
        onValidity: s[2] || (s[2] = (g, f) => l("validity", f, g))
      }, null, 8, ["model-value"]),
      s[18] || (s[18] = d("p", { class: "work-muted work-small" }, "Blank uses one hour. Each retry gets a new deadline.", -1)),
      d("label", Eu, [
        s[10] || (s[10] = d("span", { class: "work-spacer" }, "Default maximum visits", -1)),
        h(r(Ze), {
          "model-value": i.value.stage_max_visits ?? null,
          "aria-label": "Default maximum visits",
          min: 1,
          useGrouping: !1,
          placeholder: "5",
          "onUpdate:modelValue": s[3] || (s[3] = (g) => p("stage_max_visits", g ?? void 0))
        }, null, 8, ["model-value"])
      ]),
      s[19] || (s[19] = d("h3", { class: "work-group-title" }, "Comments", -1)),
      d("label", Au, [
        s[11] || (s[11] = d("span", { class: "work-spacer" }, "Comments per item", -1)),
        h(r(Ze), {
          "model-value": i.value.comments_per_item ?? null,
          "aria-label": "Comments per item",
          min: 1,
          max: 1e5,
          useGrouping: !1,
          placeholder: "Application default",
          "onUpdate:modelValue": s[4] || (s[4] = (g) => p("comments_per_item", g ?? void 0))
        }, null, 8, ["model-value"])
      ]),
      s[20] || (s[20] = d("p", { class: "work-muted work-small" }, "Blank follows the application default.", -1)),
      s[21] || (s[21] = d("h3", { class: "work-group-title" }, "Saved query filters", -1)),
      s[22] || (s[22] = d("p", { class: "work-muted work-small" }, "Choose which installed query filters this board can use.", -1)),
      h(il, {
        schema: { type: "object", properties: { scopes: { type: "array", title: "Query filter identifiers", items: { type: "string" } } } },
        "model-value": { scopes: e.draft.scopes },
        "onUpdate:modelValue": s[5] || (s[5] = (g) => e.draft.scopes = g.scopes)
      }, null, 8, ["model-value"]),
      s[23] || (s[23] = d("h3", { class: "work-group-title" }, "Audit and retention", -1)),
      d("div", Pu, [
        d("div", Ru, [
          s[12] || (s[12] = d("div", { class: "work-row-main" }, [
            d("strong", { class: "work-row-title" }, "Audit trail"),
            d("p", { class: "work-muted work-small" }, "Choose which item changes appear in history.")
          ], -1)),
          d("div", Ou, [
            h(r(oe), {
              "model-value": i.value.audit ?? "",
              "aria-label": "Audit trail",
              placeholder: "Installation default",
              appendTo: "self",
              optionLabel: "label",
              optionValue: "value",
              options: [{ label: "Installation default", value: "" }, { label: "Off", value: "off" }, { label: "Fields", value: "fields" }],
              "onUpdate:modelValue": s[6] || (s[6] = (g) => p("audit", g || void 0))
            }, null, 8, ["model-value"])
          ])
        ]),
        (c(), y(J, null, le(m, (g) => d("div", {
          key: g,
          class: "work-settings-row"
        }, [
          d("div", Nu, [
            d("strong", Mu, A(r(ke)(g)), 1),
            d("p", Fu, "Blank follows the application default. " + A(v[g]), 1)
          ]),
          d("label", zu, [
            h(r(Ze), {
              min: 0,
              "aria-label": r(ke)(g),
              "model-value": i.value[g] ?? null,
              placeholder: "Installation default",
              useGrouping: !1,
              "onUpdate:modelValue": (f) => o(g, f)
            }, null, 8, ["aria-label", "model-value", "onUpdate:modelValue"])
          ])
        ])), 64))
      ])
    ]));
  }
}), Bu = {
  class: "work-stack",
  "aria-label": "Relation types editor"
}, ju = { class: "work-section-heading" }, qu = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, Wu = { class: "work-definition-meta work-muted work-small" }, Ku = { class: "work-settings-grid" }, Gu = { class: "work-stack work-tight" }, Hu = { class: "work-stack work-tight" }, Yu = { class: "work-stack work-tight" }, Xu = { class: "work-stack work-tight" }, Ju = { class: "work-row" }, Zu = { class: "work-relation-preview work-small" }, Qu = { class: "work-muted" }, _u = {
  key: 0,
  class: "kx-empty"
}, ec = { class: "work-row work-add-definition" }, tc = { class: "work-stack work-tight" }, ac = /* @__PURE__ */ pe({
  __name: "RelationsEditor",
  props: {
    draft: {},
    guardRemoval: { type: Function }
  },
  setup(e) {
    const a = e, t = H(() => a.draft.relation_types ?? []), l = B(""), i = B(""), u = B(!1), m = H(() => /^[a-z][a-z0-9_]*$/.test(l.value) && !t.value.some((o) => o.id === l.value));
    function v() {
      m.value && ((a.draft.relation_types ??= []).push({ id: l.value, outward: ke(l.value).toLowerCase(), inward: ke(l.value).toLowerCase(), cardinality: "many" }), l.value = "");
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
    return (o, n) => (c(), y("section", Bu, [
      d("header", ju, [
        n[1] || (n[1] = d("div", null, [
          d("h2", null, "Relation types"),
          d("p", { class: "work-muted work-small" }, "Give each direction a clear label. A used relation keeps its identity and shape.")
        ], -1)),
        h(r(Ne), {
          class: "kx-tag-sm",
          severity: "secondary"
        }, {
          default: z(() => [
            M(A(t.value.length) + " " + A(t.value.length === 1 ? "relation" : "relations"), 1)
          ]),
          _: 1
        })
      ]),
      i.value ? (c(), y("p", qu, A(i.value), 1)) : U("", !0),
      h(Da, {
        columns: "relations",
        count: t.value.length
      }, {
        default: z(() => [
          (c(!0), y(J, null, le(t.value, (s, g) => (c(), q(Ta, {
            title: r(ke)(s.id),
            code: s.id,
            kind: s.symmetric ? "Same both ways" : "Different each way",
            key: g,
            class: "work-stack"
          }, {
            usage: z(() => [
              d("span", Wu, A(s.outward || "Related work") + " · " + A(s.inward || "Reverse relation"), 1)
            ]),
            actions: z(() => [
              h(r(X), {
                severity: "secondary",
                text: "",
                disabled: u.value,
                onClick: (f) => p(s.id),
                "aria-label": "Remove relation",
                size: "small"
              }, {
                default: z(() => [
                  h(r(_), {
                    icon: "tabler:trash",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["disabled", "onClick"])
            ]),
            default: z(() => [
              d("div", Ku, [
                d("label", Gu, [
                  n[2] || (n[2] = M("Identifier ", -1)),
                  h(r(me), {
                    modelValue: s.id,
                    "onUpdate:modelValue": (f) => s.id = f,
                    required: "",
                    pattern: "[a-z][a-z0-9_]*",
                    "aria-label": "Relation ID"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                d("label", Hu, [
                  n[3] || (n[3] = M("Outward label ", -1)),
                  h(r(me), {
                    modelValue: s.outward,
                    "onUpdate:modelValue": (f) => s.outward = f,
                    "aria-label": "Outward label"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                d("label", Yu, [
                  n[4] || (n[4] = M("Inward label ", -1)),
                  h(r(me), {
                    modelValue: s.inward,
                    "onUpdate:modelValue": (f) => s.inward = f,
                    "aria-label": "Inward label"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                d("label", Xu, [
                  n[5] || (n[5] = M("Links allowed ", -1)),
                  h(r(oe), {
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
                d("label", Ju, [
                  h(r(Bt), {
                    modelValue: s.symmetric,
                    "onUpdate:modelValue": (f) => s.symmetric = f,
                    "aria-label": "Same meaning in both directions",
                    binary: ""
                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                  n[6] || (n[6] = M("Same meaning in both directions ", -1))
                ])
              ]),
              d("p", Zu, [
                n[7] || (n[7] = d("strong", null, "This item", -1)),
                M(" " + A(s.outward || "relates to") + " ", 1),
                n[8] || (n[8] = d("strong", null, "another item", -1)),
                d("span", Qu, " · reverse: " + A(s.symmetric ? s.outward : s.inward), 1)
              ])
            ]),
            _: 2
          }, 1032, ["title", "code", "kind"]))), 128)),
          t.value.length ? U("", !0) : (c(), y("p", _u, "No relation types yet. Add one to link related work.")),
          d("div", ec, [
            d("label", tc, [
              n[9] || (n[9] = M("New relation ID ", -1)),
              h(r(me), {
                modelValue: l.value,
                "onUpdate:modelValue": n[0] || (n[0] = (s) => l.value = s),
                placeholder: "related_to",
                onKeydown: Oe(ye(v, ["prevent"]), ["enter"])
              }, null, 8, ["modelValue", "onKeydown"])
            ]),
            h(r(X), {
              label: "Add relation",
              severity: "secondary",
              disabled: !m.value,
              onClick: v,
              outlined: ""
            }, {
              icon: z(() => [
                h(r(_), {
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
function lc(e, a) {
  return e.parked ? "Stopped: " + (typeof e.error == "string" ? e.error : e.error?.message ?? "Projection is parked") : e.bootstrapping ? "Initializing" : e.last_seq >= a ? "Up to date" : "Catching up";
}
const oc = {
  class: "work-stack",
  "aria-label": "Plugins editor"
}, ic = { class: "work-section-heading" }, nc = {
  key: 0,
  class: "kx-loading"
}, sc = {
  key: 1,
  class: "kx-err",
  role: "alert"
}, rc = {
  key: 2,
  class: "work-notice",
  role: "status"
}, dc = { class: "work-row" }, uc = {
  key: 0,
  class: "work-muted work-small"
}, cc = {
  key: 1,
  class: "kx-err"
}, vc = {
  key: 2,
  class: "work-notice"
}, mc = {
  key: 3,
  class: "work-stack work-tight work-plugin-status",
  role: "status"
}, fc = {
  key: 0,
  class: "kx-err"
}, pc = { class: "work-muted work-small" }, bc = { class: "work-form-actions" }, hc = {
  key: 0,
  class: "work-muted work-small"
}, Rl = /* @__PURE__ */ pe({
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
    function n(S) {
      return t.schema.plugins?.find((D) => D.plugin === S);
    }
    function s(S) {
      return n(S)?.active === !0;
    }
    function g(S) {
      return n(S)?.lifecycle.state === "ready";
    }
    function f(S) {
      return t.draft.plugins?.some((D) => D.use === S) === !0;
    }
    function k(S, D) {
      const P = t.draft.plugins ?? [];
      D && !f(S) && (t.draft.plugins = [...P, { use: S }]), D || (t.draft.plugins = P.filter((K) => K.use !== S), delete t.configs[S], p.value.delete(S), l("validity", S, !0));
    }
    function $(S) {
      return s(S) ? i.value[S] ?? n(S)?.config ?? o : t.configs[S] ?? o;
    }
    function I(S, D) {
      s(S) ? i.value[S] = D : t.configs[S] = D;
    }
    function E(S, D) {
      D ? p.value.delete(S) : p.value.add(S), s(S) || l("validity", S, D);
    }
    async function C(S) {
      if (!(u.value || p.value.has(S))) {
        u.value = S, m.value = "", v.value = "";
        try {
          await Vt.configure(t.boardId, S, $(S)), delete i.value[S], v.value = "Plugin configuration saved.", l("configured");
        } catch (D) {
          m.value = Ge(D, "Could not configure plugin.");
        } finally {
          u.value = "";
        }
      }
    }
    return (S, D) => (c(), y("section", oc, [
      d("header", ic, [
        D[1] || (D[1] = d("div", null, [
          d("h2", null, "Plugins"),
          d("p", { class: "work-muted work-small" }, "Add capabilities from installed modules.")
        ], -1)),
        h(r(X), {
          label: "Refresh status",
          severity: "secondary",
          outlined: "",
          disabled: !!u.value || e.disabled,
          onClick: D[0] || (D[0] = (P) => l("refresh"))
        }, {
          icon: z(() => [
            h(r(_), {
              icon: "tabler:refresh",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        }, 8, ["disabled"])
      ]),
      D[5] || (D[5] = d("p", { class: "work-muted work-small" }, "Activation joins the schema draft and requires review. Active plugin configuration saves separately. Status reflects the last read; refresh to check progress.", -1)),
      e.options.length ? U("", !0) : (c(), y("p", nc, "No installed plugins are visible to you.")),
      m.value ? (c(), y("div", sc, A(m.value), 1)) : U("", !0),
      v.value ? (c(), y("p", rc, A(v.value), 1)) : U("", !0),
      h(Da, {
        columns: "plugins",
        count: e.options.length
      }, {
        default: z(() => [
          (c(!0), y(J, null, le(e.options, (P) => (c(), q(Ta, {
            key: P.plugin,
            title: P.title || "Unavailable capability",
            description: P.description,
            kind: s(P.plugin) ? "Active" : f(P.plugin) ? "Pending review" : "Inactive",
            class: "work-stack"
          }, {
            actions: z(() => [
              D[3] || (D[3] = d("span", { class: "work-spacer" }, null, -1)),
              d("label", dc, [
                h(r(We), {
                  "model-value": f(P.plugin),
                  disabled: !!u.value || e.disabled || e.activationLocked || !!P.problem,
                  "onUpdate:modelValue": (K) => k(P.plugin, K)
                }, null, 8, ["model-value", "disabled", "onUpdate:modelValue"]),
                D[2] || (D[2] = M("Activate on this board", -1))
              ])
            ]),
            default: z(() => [
              P.requires.length ? (c(), y("p", uc, "Requires " + A(P.requires.map((K) => e.options.find((te) => te.plugin === K)?.title || "Another capability").join(", ")), 1)) : U("", !0),
              P.problem ? (c(), y("p", cc, A(P.problem.message), 1)) : U("", !0),
              n(P.plugin)?.outdated ? (c(), y("p", vc, "The stored declaration differs from the installed plugin. Review activation to update it.")) : U("", !0),
              s(P.plugin) ? (c(), y("div", mc, [
                d("p", null, A(g(P.plugin) ? "Attachment configured" : n(P.plugin)?.lifecycle.state === "failed" ? "Configuration failed" : "Configuring attachment"), 1),
                n(P.plugin)?.lifecycle.error ? (c(), y("p", fc, A(n(P.plugin)?.lifecycle.error?.message), 1)) : U("", !0),
                (c(!0), y(J, null, le(n(P.plugin)?.projections, (K, te) => (c(), y("div", { key: te }, [
                  d("p", null, A(r(lc)(K, e.schema.as_of)), 1),
                  d("p", pc, "Position " + A(K.last_seq) + " · Board head " + A(e.schema.as_of), 1)
                ]))), 128))
              ])) : U("", !0),
              !P.problem && (f(P.plugin) || s(P.plugin)) ? (c(), y(J, { key: 4 }, [
                h(il, {
                  disabled: !!u.value || e.disabled,
                  schema: P.config_schema,
                  "model-value": $(P.plugin),
                  "onUpdate:modelValue": (K) => I(P.plugin, K),
                  onValidity: (K) => E(P.plugin, K)
                }, null, 8, ["disabled", "schema", "model-value", "onUpdate:modelValue", "onValidity"]),
                d("div", bc, [
                  h(r(X), {
                    label: "Reset",
                    severity: "secondary",
                    outlined: "",
                    disabled: !!u.value || e.disabled,
                    onClick: (K) => I(P.plugin, s(P.plugin) ? r(wt)(n(P.plugin)?.config ?? {}) : {})
                  }, {
                    icon: z(() => [
                      h(r(_), { icon: "tabler:restore" })
                    ]),
                    _: 1
                  }, 8, ["disabled", "onClick"]),
                  s(P.plugin) ? (c(), q(r(X), {
                    key: 0,
                    label: "Save configuration",
                    disabled: !!u.value || e.disabled || p.value.has(P.plugin),
                    loading: u.value === P.plugin,
                    onClick: (K) => C(P.plugin)
                  }, {
                    icon: z(() => [
                      h(r(_), {
                        icon: "tabler:device-floppy",
                        "aria-hidden": "true"
                      })
                    ]),
                    _: 1
                  }, 8, ["disabled", "loading", "onClick"])) : U("", !0)
                ]),
                s(P.plugin) ? U("", !0) : (c(), y("p", hc, "Initial configuration is included in Review and Apply."))
              ], 64)) : U("", !0)
            ]),
            _: 2
          }, 1032, ["title", "description", "kind"]))), 128))
        ]),
        _: 1
      }, 8, ["count"]),
      (c(!0), y(J, null, le(e.draft.plugins?.filter((P) => !e.options.some((K) => K.plugin === P.use)) ?? [], (P) => (c(), y("article", {
        key: P.use,
        class: "work-settings-card"
      }, [
        D[4] || (D[4] = d("p", null, "Unavailable plugin", -1)),
        h(r(X), {
          label: "Deactivate plugin",
          severity: "secondary",
          onClick: (K) => k(P.use, !1),
          outlined: ""
        }, {
          icon: z(() => [
            h(r(_), {
              icon: "tabler:trash",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        }, 8, ["onClick"])
      ]))), 128))
    ]));
  }
}), gc = {
  class: "work-stack",
  "aria-label": "Board visibility"
}, yc = { class: "work-stack work-tight" }, kc = {
  key: 0,
  class: "work-row"
}, wc = { class: "work-stack work-tight" }, Vc = { class: "work-settings-list" }, $c = { class: "work-row-main" }, xc = { class: "work-small work-muted" }, Cc = { class: "work-row-control" }, Sc = { class: "work-row" }, Tc = /* @__PURE__ */ pe({
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
      const g = u.value.find((f) => f.code === s);
      t.draft.visibility = { field: s, levels: (g?.options ?? []).map((f) => ({ id: f.id, holders: [] })) };
    }
    function n(s, g) {
      const f = i.value?.levels.find((k) => k.id === s);
      f && (f.holders = g ?? []);
    }
    return (s, g) => (c(), y("section", gc, [
      g[10] || (g[10] = d("h3", { class: "work-group-title" }, "Board visibility", -1)),
      g[11] || (g[11] = d("p", { class: "work-small work-muted" }, "Restrict items by their visibility level. People still need access to the board.", -1)),
      d("label", yc, [
        g[7] || (g[7] = M("Visibility field", -1)),
        h(r(oe), {
          "aria-label": "Visibility field",
          placeholder: "No additional restriction",
          "model-value": i.value?.field ?? "",
          options: [{ label: "No additional restriction", value: "" }, ...u.value.map((f) => ({ label: r(ze)(f), value: f.code }))],
          optionLabel: "label",
          optionValue: "value",
          appendTo: "self",
          "onUpdate:modelValue": g[0] || (g[0] = (f) => o(f))
        }, null, 8, ["model-value", "options"])
      ]),
      i.value ? (c(), y(J, { key: 0 }, [
        v.value ? (c(), y("div", kc, [
          d("label", wc, [
            g[8] || (g[8] = M("Level ID", -1)),
            h(r(me), {
              modelValue: m.value,
              "onUpdate:modelValue": g[1] || (g[1] = (f) => m.value = f),
              "aria-label": "New visibility level",
              onKeydown: Oe(ye(p, ["prevent"]), ["enter"])
            }, null, 8, ["modelValue", "onKeydown"])
          ]),
          h(r(X), {
            label: "Add level",
            severity: "secondary",
            outlined: "",
            disabled: !m.value || i.value.levels.some((f) => f.id === m.value),
            onClick: p
          }, null, 8, ["disabled"])
        ])) : U("", !0),
        d("div", Vc, [
          (c(!0), y(J, null, le(i.value.levels, (f, k) => (c(), y("div", {
            key: f.id,
            class: "work-settings-row"
          }, [
            d("div", $c, [
              d("strong", null, A(u.value.find(($) => $.code === i.value.field)?.options?.find(($) => $.id === f.id)?.label || f.id), 1),
              d("p", xc, "Level " + A(k + 1), 1)
            ]),
            d("div", Cc, [
              h(Jl, {
                "board-id": e.boardId,
                label: "Who can see these items",
                "model-value": f.holders,
                "onUpdate:modelValue": ($) => n(f.id, $),
                onValidity: g[2] || (g[2] = ($) => l("validity", $))
              }, null, 8, ["board-id", "model-value", "onUpdate:modelValue"])
            ])
          ]))), 128))
        ]),
        d("label", Sc, [
          h(r(We), {
            "model-value": i.value.bypass === "admin",
            "onUpdate:modelValue": g[3] || (g[3] = (f) => f ? i.value.bypass = "admin" : delete i.value.bypass)
          }, null, 8, ["model-value"]),
          g[9] || (g[9] = M("Board administrators can see every level", -1))
        ]),
        h(r(X), {
          label: "Remove visibility restriction",
          severity: "secondary",
          text: "",
          onClick: g[4] || (g[4] = (f) => delete e.draft.visibility)
        })
      ], 64)) : U("", !0),
      h(bt, {
        label: "Visibility rules",
        "model-value": i.value,
        shape: "object",
        example: { field: "visibility", levels: [{ id: "internal", holders: [] }], bypass: "admin" },
        "onUpdate:modelValue": g[5] || (g[5] = (f) => e.draft.visibility = f),
        onValidity: g[6] || (g[6] = (f) => l("validity", f))
      }, null, 8, ["model-value"])
    ]));
  }
}), Dc = { class: "kx-head" }, Uc = { class: "kx-head-icon" }, Ic = { class: "kx-head-text" }, Ec = { class: "kx-title" }, Ac = ["title"], Pc = { class: "kx-head-actions" }, Rc = /* @__PURE__ */ pe({
  __name: "PageHead",
  props: {
    title: {},
    subtitle: {},
    icon: { default: "tabler:layout-kanban" },
    backLabel: {}
  },
  emits: ["back"],
  setup(e) {
    return (a, t) => (c(), y("header", Dc, [
      e.backLabel ? (c(), q(r(X), {
        key: 0,
        "aria-label": e.backLabel,
        severity: "secondary",
        text: "",
        onClick: t[0] || (t[0] = (l) => a.$emit("back"))
      }, {
        default: z(() => [
          h(r(_), {
            icon: "tabler:arrow-left",
            "aria-hidden": "true"
          })
        ]),
        _: 1
      }, 8, ["aria-label"])) : U("", !0),
      d("div", Uc, [
        h(r(_), {
          icon: e.icon,
          "aria-hidden": "true"
        }, null, 8, ["icon"])
      ]),
      d("div", Ic, [
        He(a.$slots, "identity", {}, () => [
          d("h1", Ec, A(e.title), 1),
          e.subtitle ? (c(), y("p", {
            key: 0,
            class: "kx-head-sub",
            title: e.subtitle
          }, A(e.subtitle), 9, Ac)) : U("", !0)
        ])
      ]),
      d("div", Pc, [
        He(a.$slots, "default")
      ])
    ]));
  }
}), Oc = { class: "work-board-identity work-stack work-tight" }, Nc = { class: "work-stack work-tight" }, Mc = { class: "work-stack work-tight" }, Fc = { class: "work-stack work-tight" }, zc = ["value", "inert"], Lc = {
  key: 1,
  class: "work-muted work-small"
}, Bc = { class: "work-row" }, jc = { class: "work-row" }, qc = { class: "work-row work-board-title" }, Wc = {
  key: 1,
  class: "work-identity-actions"
}, Kc = ["title"], Gc = {
  key: 2,
  class: "kx-err work-inline",
  role: "alert"
}, Hc = {
  key: 3,
  class: "work-muted work-small",
  role: "status"
}, Ol = /* @__PURE__ */ pe({
  __name: "BoardIdentity",
  props: {
    board: {},
    compact: { type: Boolean },
    detail: { type: Boolean },
    subtitle: {}
  },
  emits: ["saved", "dirty-change"],
  setup(e, { emit: a }) {
    const t = e, l = a, i = B(!1), u = B(""), m = B(""), v = B(""), p = B(!1), o = B(!1), n = B(""), s = B(""), g = H(() => t.board?.access?.admin === !0), f = B({ title: "", description: "", icon: "" });
    function k() {
      f.value = { title: t.board?.title ?? "", icon: t.board?.icon ?? "", description: t.board?.description ?? "" }, u.value = f.value.title, v.value = f.value.icon, m.value = f.value.description, n.value = "", s.value = "", i.value = !0, ft("wc-icon-picker").then((C) => p.value = C);
    }
    const $ = H(() => {
      const C = {};
      return u.value.trim() !== f.value.title && (C.title = u.value.trim()), m.value !== f.value.description && (C.description = m.value), v.value !== f.value.icon && (C.icon = v.value), C;
    });
    Ce(g, (C) => {
      C || I();
    }), Ce(() => i.value && Object.keys($.value).length > 0, (C) => l("dirty-change", C));
    function I() {
      i.value = !1, n.value = "";
    }
    async function E() {
      if (!g.value || !t.board || o.value || !u.value.trim()) return;
      const C = $.value;
      if (!Object.keys(C).length) {
        i.value = !1, s.value = "Nothing changed.";
        return;
      }
      o.value = !0, n.value = "";
      try {
        const S = await Ct.updateBoard(t.board.board_id, C);
        i.value = !1, s.value = S.status === "unchanged" ? "Nothing changed." : "Board saved.", l("saved");
      } catch (S) {
        n.value = Ge(S, "Could not save the board.");
      } finally {
        o.value = !1;
      }
    }
    return (C, S) => (c(), y("div", Oc, [
      i.value ? (c(), y("form", {
        key: 0,
        class: "work-identity-edit",
        "aria-label": "Edit board",
        onClick: S[3] || (S[3] = ye(() => {
        }, ["stop"])),
        onSubmit: ye(E, ["prevent"])
      }, [
        d("label", Nc, [
          S[4] || (S[4] = M("Title", -1)),
          h(r(me), {
            modelValue: u.value,
            "onUpdate:modelValue": S[0] || (S[0] = (D) => u.value = D),
            required: "",
            autofocus: "",
            disabled: o.value
          }, null, 8, ["modelValue", "disabled"])
        ]),
        d("label", Mc, [
          S[5] || (S[5] = M("Description", -1)),
          h(r(ga), {
            modelValue: m.value,
            "onUpdate:modelValue": S[1] || (S[1] = (D) => m.value = D),
            rows: "1",
            disabled: o.value
          }, null, 8, ["modelValue", "disabled"])
        ]),
        d("div", Fc, [
          S[6] || (S[6] = d("span", null, "Board icon", -1)),
          p.value ? (c(), y("wc-icon-picker", {
            key: 0,
            value: v.value,
            fallback: "tabler:layout-kanban",
            inert: o.value || void 0,
            onSelect: S[2] || (S[2] = (D) => v.value = D.detail)
          }, null, 40, zc)) : (c(), y("p", Lc, "The icon picker is unavailable."))
        ]),
        d("div", Bc, [
          h(r(X), {
            label: "Save",
            severity: "secondary",
            type: "submit",
            disabled: !u.value.trim() || o.value,
            loading: o.value,
            outlined: ""
          }, {
            icon: z(() => [
              h(r(_), {
                icon: "tabler:device-floppy",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled", "loading"]),
          h(r(X), {
            label: "Cancel",
            severity: "secondary",
            disabled: o.value,
            onClick: I,
            outlined: ""
          }, {
            icon: z(() => [
              h(r(_), {
                icon: "tabler:x",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled"])
        ])
      ], 32)) : (c(), y(J, { key: 1 }, [
        d("div", jc, [
          d("div", qc, [
            e.board?.icon ? (c(), q(r(_), {
              key: 0,
              icon: e.board.icon,
              "aria-hidden": "true"
            }, null, 8, ["icon"])) : U("", !0),
            (c(), q(Ga(e.compact || e.detail ? "h2" : "h1"), {
              class: pt(e.detail ? "work-detail-title" : e.compact ? "kx-card-name" : "kx-title")
            }, {
              default: z(() => [
                M(A(e.board?.title || "Untitled board"), 1)
              ]),
              _: 1
            }, 8, ["class"]))
          ]),
          e.compact ? He(C.$slots, "title-end", {}, void 0, void 0, 0) : U("", !0),
          e.compact ? (c(), y("span", Wc, [
            g.value ? (c(), q(r(X), {
              key: 0,
              severity: "secondary",
              text: "",
              size: "small",
              onClick: ye(k, ["stop"]),
              "aria-label": "Edit board"
            }, {
              default: z(() => [
                h(r(_), {
                  icon: "tabler:pencil",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            })) : U("", !0),
            He(C.$slots, "actions")
          ])) : g.value ? (c(), q(r(X), {
            key: 2,
            severity: "secondary",
            text: "",
            size: "small",
            onClick: ye(k, ["stop"]),
            "aria-label": "Edit board"
          }, {
            default: z(() => [
              h(r(_), {
                icon: "tabler:pencil",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          })) : U("", !0),
          e.compact ? U("", !0) : He(C.$slots, "title-end", {}, void 0, void 0, 3)
        ]),
        !e.compact && (e.subtitle || e.board?.description) ? (c(), y("p", {
          key: 0,
          class: "kx-head-sub",
          title: e.subtitle || e.board?.description
        }, A(e.subtitle || e.board?.description), 9, Kc)) : U("", !0)
      ], 64)),
      n.value ? (c(), y("p", Gc, A(n.value), 1)) : U("", !0),
      s.value ? (c(), y("p", Hc, A(s.value), 1)) : U("", !0)
    ]));
  }
}), Yc = {
  key: 0,
  class: "work-dirty"
}, Nl = /* @__PURE__ */ pe({
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
    return (a, t) => (c(), y(J, null, [
      e.dirty ? (c(), y("span", Yc, "Unsaved changes")) : U("", !0),
      h(r(X), {
        label: "Discard",
        severity: "secondary",
        outlined: "",
        disabled: !e.dirty || e.busy || e.checkingRemoval,
        onClick: t[0] || (t[0] = (l) => a.$emit("discard"))
      }, {
        icon: z(() => [
          h(r(_), { icon: "tabler:restore" })
        ]),
        _: 1
      }, 8, ["disabled"]),
      h(r(X), {
        label: e.reviewed ? "Apply" : "Review changes",
        disabled: e.disabled,
        loading: e.busy,
        onClick: t[1] || (t[1] = (l) => a.$emit("primary"))
      }, null, 8, ["label", "disabled", "loading"])
    ], 64));
  }
}), Xc = {
  key: 0,
  class: "work-detail-head"
}, Jc = {
  key: 0,
  class: "work-row work-wrap work-draft-actions"
}, Zc = {
  key: 2,
  class: "kx-err",
  role: "alert"
}, Qc = ["config"], _c = /* @__PURE__ */ pe({
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
      !a.authorized || !a.board || (i.value = "", l.value = await ft("kickside-share"), l.value ? t.value = !0 : i.value = "The sharing widget is unavailable. Try Share board again.");
    }
    Ce(() => a.authorized, (o) => {
      o || (t.value = !1);
    });
    const m = H(() => JSON.stringify({ resource_id: a.board?.board_id, title: a.board?.title, access_url: `/api/v1/component-access/grants/${encodeURIComponent(a.board?.board_id ?? "")}`, share_url: `/api/v1/component-access/share/${encodeURIComponent(a.board?.board_id ?? "")}` })), v = H(() => a.pack ? `${a.packTitle} ${a.pack.version}${a.outdated ? " · Outdated" : ""}` : ""), p = H(() => "Settings · generation " + (a.generation ?? "…") + (v.value ? " · " + v.value : ""));
    return (o, n) => (c(), y(J, null, [
      e.embedded ? (c(), y("header", Xc, [
        (c(), q(Ol, {
          key: e.board?.board_id,
          board: e.board,
          onDirtyChange: n[0] || (n[0] = (s) => o.$emit("metadata-dirty-change", s)),
          subtitle: v.value || void 0,
          detail: "",
          onSaved: n[1] || (n[1] = (s) => o.$emit("saved"))
        }, {
          "title-end": z(() => [
            h(r(Ne), {
              severity: "secondary",
              value: "Generation " + (e.generation ?? "…")
            }, null, 8, ["value"])
          ]),
          _: 1
        }, 8, ["board", "subtitle"])),
        e.authorized ? (c(), y("div", Jc, [
          e.authorized && e.outdated && e.pack ? (c(), q(r(X), {
            key: 0,
            disabled: !e.canUpgrade,
            title: e.upgradeReason,
            label: "Upgrade pack",
            severity: "secondary",
            outlined: "",
            onClick: n[2] || (n[2] = (s) => o.$emit("upgrade"))
          }, {
            icon: z(() => [
              h(r(_), { icon: "tabler:refresh" })
            ]),
            _: 1
          }, 8, ["disabled", "title"])) : U("", !0),
          e.authorized && e.board ? (c(), q(r(X), {
            key: 1,
            label: "Share board",
            severity: "secondary",
            outlined: "",
            disabled: e.busy,
            onClick: u
          }, {
            icon: z(() => [
              h(r(_), {
                icon: "tabler:share",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled"])) : U("", !0),
          e.authorized && !e.pack ? (c(), q(r(X), {
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
      ])) : (c(), q(Rc, {
        key: 1,
        title: e.board?.title || "Board",
        subtitle: p.value,
        "back-label": "Back to board",
        icon: "tabler:adjustments",
        onBack: n[12] || (n[12] = (s) => o.$emit("back"))
      }, {
        identity: z(() => [
          (c(), q(Ol, {
            key: e.board?.board_id,
            board: e.board,
            onDirtyChange: n[6] || (n[6] = (s) => o.$emit("metadata-dirty-change", s)),
            subtitle: p.value,
            onSaved: n[7] || (n[7] = (s) => o.$emit("saved"))
          }, null, 8, ["board", "subtitle"]))
        ]),
        default: z(() => [
          e.authorized && e.outdated && e.pack ? (c(), q(r(X), {
            key: 0,
            disabled: !e.canUpgrade,
            title: e.upgradeReason,
            label: "Upgrade pack",
            severity: "secondary",
            outlined: "",
            onClick: n[8] || (n[8] = (s) => o.$emit("upgrade"))
          }, {
            icon: z(() => [
              h(r(_), { icon: "tabler:refresh" })
            ]),
            _: 1
          }, 8, ["disabled", "title"])) : U("", !0),
          e.authorized && e.board ? (c(), q(r(X), {
            key: 1,
            label: "Share board",
            severity: "secondary",
            outlined: "",
            disabled: e.busy,
            onClick: u
          }, {
            icon: z(() => [
              h(r(_), {
                icon: "tabler:share",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled"])) : U("", !0),
          e.authorized && !e.pack ? (c(), q(r(X), {
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
      i.value ? (c(), y("p", Zc, A(i.value), 1)) : U("", !0),
      t.value && l.value && e.authorized ? (c(), y("kickside-share", {
        key: 3,
        config: m.value,
        onClose: n[13] || (n[13] = (s) => t.value = !1),
        onChanged: n[14] || (n[14] = (s) => o.$emit("saved"))
      }, null, 40, Qc)) : U("", !0)
    ], 64));
  }
}), Ee = (e, a) => `${e} → ${a}`, Ml = (e, a) => {
  const t = e.fields?.find((l) => l.code === a);
  return t ? ze(t) : "Untitled field";
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
function zl(e, a) {
  if (a === void 0) return "Application default";
  if (e === "audit") return ke(String(a));
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
function ev(e, a) {
  const t = e.policy ?? {}, l = a.policy ?? {}, i = Object.keys(Fl).flatMap((v) => t[v] === l[v] ? [] : [`${Fl[v]} · ${Ee(zl(v, t[v]), zl(v, l[v]))}`]), u = (v) => v ? `${v.limit}${v.hard ? " (hard limit)" : ""}` : "No limit", m = /* @__PURE__ */ new Set([...Object.keys(t.wip ?? {}), ...Object.keys(l.wip ?? {})]);
  for (const v of m) {
    const p = u(t.wip?.[v]), o = u(l.wip?.[v]);
    if (p === o) continue;
    const n = (a.processes ?? []).flatMap((s) => s.states).find((s) => s.id === v) ?? (e.processes ?? []).flatMap((s) => s.states).find((s) => s.id === v);
    i.push(`${ve(n)} limit · ${Ee(p, o)}`);
  }
  return i;
}
function tv(e, a, t) {
  const l = e.visibility, i = a.visibility, u = [];
  l?.field !== i?.field && u.push(Ee(
    l ? Ml(e, l.field) : "No additional restriction",
    i ? Ml(a, i.field) : "No additional restriction"
  ));
  const m = l?.levels ?? [], v = i?.levels ?? [], p = new Set([...m, ...v].map((o) => o.id));
  for (const o of p) {
    const n = m.find(($) => $.id === o), s = v.find(($) => $.id === o);
    if (n && s && JSON.stringify(n.holders) === JSON.stringify(s.holders)) continue;
    const g = ($) => $.fields?.find((I) => I.code === $.visibility?.field)?.options?.find((I) => I.id === o)?.label, f = g(a) || g(e) || ke(o), k = ($) => $ ? $.holders.map(t).join(", ") || "No extra access" : "No level";
    u.push(`${f} · ${Ee(k(n), k(s))}`);
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
function av(e, a, t) {
  const { what: l, detail: i, to: u } = e, v = `${t?.name || a?.name || "Untitled process"} · ${Zt[l] ?? "Process changed"}`, p = l.startsWith("state.") ? a?.states.find((f) => f.id === i) : void 0, o = l.startsWith("state.") ? t?.states.find((f) => f.id === i) : void 0, n = l.startsWith("transition.") ? a?.transitions?.find((f) => f.id === i) : void 0, s = l.startsWith("transition.") ? t?.transitions?.find((f) => f.id === i) : void 0;
  let g = "";
  return l === "state.map" ? g = Ee(ve(p), ve(t?.states.find((f) => f.id === u))) : l === "state.name" ? g = Ee(ve(p), ve(o)) : l === "state.kind" ? g = `${ve(o)} · ${Ee(ha(p?.kind), ha(o?.kind))}` : l === "state.category" && p && o ? g = `${ve(o)} · ${Ee(Dt(p.category), Dt(o.category))}` : o || p ? g = ve(o ?? p) : l === "transition.name" && n && s ? g = Ee(Pe(n), Pe(s)) : s ? g = Pe(s) : n ? g = Pe(n) : l === "initial" ? g = Ee(ve(a?.states.find((f) => f.id === a.initial)), ve(t?.states.find((f) => f.id === t.initial))) : l === "name" && (g = Ee(a?.name || "Untitled process", t?.name || "Untitled process")), { title: v, details: g ? [g] : [] };
}
function lv(e, a, t, l) {
  const { code: i, what: u, detail: m } = e;
  if (i === "schema" || u === "visibility.remove")
    return u === "policy" ? { title: "Board policy", details: ev(a, t) } : u.startsWith("visibility") ? { title: "Board visibility", details: tv(a, t, l) } : u === "key_prefix" ? { title: "Item key prefix", details: [Ee(a.key_prefix ?? "Default", t.key_prefix ?? "Default")] } : { title: { plugins: "Board plugins changed", scopes: "Saved query filters changed", "rollup.recompute": "Calculated totals will update" }[u] ?? "Board settings changed", details: [] };
  if (i.startsWith("process ")) {
    const s = i.slice(8);
    return av(e, a.processes?.find((g) => g.id === s), t.processes?.find((g) => g.id === s));
  }
  if (i.startsWith("item_type ")) {
    const s = i.slice(10), g = a.item_types?.find(($) => $.id === s), f = t.item_types?.find(($) => $.id === s);
    return { title: `${f?.title || g?.title || "Item type"} · ${Zt[u] ?? "Item type changed"}`, details: u === "title" ? [Ee(g?.title || "Untitled item type", f?.title || "Untitled item type")] : [] };
  }
  if (i.startsWith("relation ")) {
    const s = i.slice(9), g = a.relation_types?.find(($) => $.id === s), f = t.relation_types?.find(($) => $.id === s), k = u === "label" ? [Ee([g?.outward, g?.inward].filter(Boolean).join(" / "), [f?.outward, f?.inward].filter(Boolean).join(" / "))] : [];
    return { title: `${f?.outward || g?.outward || "Relation type"} · ${Zt[u] ?? "Relation type changed"}`, details: k };
  }
  const v = t.fields?.find((s) => s.code === i), p = a.fields?.find((s) => v?.id !== void 0 ? s.id === v.id : s.code === (u.startsWith("renamed from ") ? u.slice(13) : i)), o = v ?? p;
  if (!o) return { title: Zt[u] ?? "Board settings changed", details: [] };
  const n = `${ze(o)} · ${u.startsWith("renamed from ") ? "Field key" : Zt[u] ?? "Field settings changed"}`;
  if (u.startsWith("options.")) {
    const s = p?.options ?? [], g = v?.options ?? [], f = s.findIndex((S) => S.id === m), k = g.findIndex((S) => S.id === m), $ = s[f], I = g[k], E = I?.label || $?.label || "Untitled choice", C = $ && I && $.label !== I.label ? [] : [E];
    if ($ && I) {
      $.label !== I.label && C.push(Ee($.label || "Untitled choice", I.label || "Untitled choice")), $.category !== I.category && C.push(`Category · ${Ee($.category ? Dt($.category) : "None", I.category ? Dt(I.category) : "None")}`);
      const S = $.order ?? f + 1, D = I.order ?? k + 1;
      S !== D && C.push(`Order · ${Ee(S, D)}`), $.color !== I.color && C.push(`Color · ${Ee($.color ?? "Default", I.color ?? "Default")}`);
    }
    return { title: n, details: C };
  }
  return u === "title" && p && v ? { title: n, details: [Ee(ze(p), ze(v))] } : { title: n, details: [] };
}
const ov = {
  key: 0,
  class: "work-settings-card work-schema-plan work-stack",
  "aria-label": "Schema review"
}, iv = { key: 0 }, nv = { class: "work-row work-wrap" }, sv = { class: "work-muted work-small" }, rv = { class: "work-muted" }, dv = {
  key: 0,
  class: "work-notice"
}, uv = {
  key: 1,
  class: "work-notice"
}, cv = {
  key: 2,
  class: "work-stack work-tight",
  "aria-label": "Reviewed Flow bindings"
}, vv = { key: 3 }, mv = { class: "work-small" }, fv = {
  key: 4,
  class: "work-settings-table"
}, pv = { key: 0 }, bv = /* @__PURE__ */ pe({
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
    const a = e, t = {}, l = H(() => a.original ?? t), i = H(() => a.declaration ?? t), u = H(() => (i.value.processes ?? []).flatMap((C) => C.states.flatMap((S) => {
      const D = S.run?.flow_ref;
      return D ? [{ key: C.id + ":" + S.id, process: C.name || "Untitled process", state: ve(S), reference: D }] : [];
    }))), m = B(/* @__PURE__ */ new Map());
    Ce(u, async (C, S, D) => {
      const P = /* @__PURE__ */ new Map();
      m.value = P;
      let K = !0;
      D(() => K = !1), await Promise.all([...new Set(C.map((te) => te.reference.id))].map(async (te) => {
        try {
          const ce = (await tl.title(te))?.trim();
          K && ce && !Mo(ce) && m.value.set(te, ce);
        } catch {
          K && m.value.set(te, "Flow title unavailable");
        }
      }));
    }, { immediate: !0 });
    const v = H(() => [l.value, i.value].flatMap((C) => (C.visibility?.levels ?? []).flatMap((S) => S.holders.flatMap((D) => "group" in D ? [{ kind: "group", id: D.group }] : "user" in D ? [{ kind: "user", id: D.user }] : [])))), p = Fo(() => a.boardId ?? "", v);
    function o(C) {
      if ("user" in C) return p.label({ kind: "user", id: C.user });
      if ("group" in C) return p.label({ kind: "group", id: C.group });
      if ("field" in C) {
        const S = i.value.fields?.find((D) => D.code === C.field) ?? l.value.fields?.find((D) => D.code === C.field);
        return S ? ze(S) : "People from a field";
      }
      return "Service";
    }
    const n = (C) => C.map((S) => ({ change: S, ...lv(S, l.value, i.value, o) })), s = H(() => n(a.plan?.changes.filter((C) => C.class !== "refused") ?? [])), g = H(() => n(a.plan?.refused ?? [])), f = H(() => {
      const C = a.plan?.migration;
      return !C || !g.value.length ? C : g.value.every((S) => S.change.what === "options.remove") ? "Add a new field with the choices you want to keep. Copy existing values into it before removing the old field." : g.value.every((S) => S.change.what === "state.remove") ? "Choose where existing items should move before removing their state." : C;
    }), k = {
      unchanged: ["No changes", "secondary"],
      cosmetic: ["Labels or settings", "secondary"],
      additive: ["New definitions", "success"],
      semantic: ["Affects existing items", "warn"],
      refused: ["Blocked", "danger"],
      initial: ["First setup", "secondary"]
    }, $ = (C) => k[C]?.[0] ?? "Review needed", I = (C) => k[C]?.[1] ?? "secondary";
    function E(C) {
      const { detail: S, ...D } = C;
      return Sa(C.what === "invalid" || C.what.startsWith("views.") || C.what.startsWith("automation") ? C : D);
    }
    return (C, S) => e.plan ? (c(), y("section", ov, [
      !e.plan.changes.length && !e.plan.refused.length && !e.configCount && !e.packReview ? (c(), y("p", iv, "No changes to apply.")) : (c(), y(J, { key: 1 }, [
        d("header", nv, [
          S[0] || (S[0] = d("h2", null, "Review", -1)),
          h(r(Ne), {
            class: "kx-tag-sm",
            severity: I(e.plan.class)
          }, {
            default: z(() => [
              M(A($(e.plan.class)), 1)
            ]),
            _: 1
          }, 8, ["severity"]),
          d("span", sv, "Generation " + A(e.generation) + " → " + A(e.plan.generation), 1)
        ]),
        d("p", rv, A(r(zo)[e.plan.class] || "Review the changes below."), 1),
        f.value ? (c(), y("p", dv, A(f.value), 1)) : e.follows.length ? (c(), y("p", uv, "Existing items in " + A(e.follows.join(", ")) + " will move to the updated process using the state choices above.", 1)) : U("", !0),
        u.value.length ? (c(), y("section", cv, [
          S[1] || (S[1] = d("h3", null, "Flow bindings", -1)),
          (c(!0), y(J, null, le(u.value, (D) => (c(), y("p", {
            key: D.key
          }, [
            M(A(D.process) + " / " + A(D.state) + " · ", 1),
            d("strong", null, A(m.value.get(D.reference.id) ?? "Published Flow") + " · v" + A(D.reference.version), 1)
          ]))), 128)),
          S[2] || (S[2] = d("p", { class: "work-muted work-small" }, "New entries use these exact published versions. Before replacing a binding, stop new entries, let existing runs and deliveries finish, pause the old launcher, save, then resume entries.", -1))
        ])) : U("", !0),
        He(C.$slots, "default"),
        g.value.length ? (c(), y("h3", vv, "Blocked changes")) : U("", !0),
        (c(!0), y(J, null, le(g.value, (D, P) => (c(), q(r(_o), {
          key: P,
          severity: "error",
          role: "alert"
        }, {
          default: z(() => [
            d("strong", null, A(D.title), 1),
            (c(!0), y(J, null, le(D.details, (K, te) => (c(), y("p", { key: te }, A(K), 1))), 128)),
            d("p", null, A(E(D.change)), 1),
            d("p", mv, [
              S[3] || (S[3] = M("Reason code ", -1)),
              d("code", null, A(D.change.what), 1)
            ])
          ]),
          _: 2
        }, 1024))), 128)),
        s.value.length ? (c(), y("table", fv, [
          S[4] || (S[4] = d("thead", null, [
            d("tr", null, [
              d("th", { scope: "col" }, "Change"),
              d("th", { scope: "col" }, "Impact")
            ])
          ], -1)),
          d("tbody", null, [
            (c(!0), y(J, null, le(s.value, (D, P) => (c(), y("tr", { key: P }, [
              d("td", null, [
                d("strong", null, A(D.title), 1),
                (c(!0), y(J, null, le(D.details, (K, te) => (c(), y("p", { key: te }, A(K), 1))), 128)),
                D.change.count ? (c(), y("p", pv, A(D.change.count) + " " + A(D.change.count === 1 ? "item" : "items"), 1)) : U("", !0)
              ]),
              d("td", null, [
                h(r(Ne), {
                  class: "kx-tag-sm",
                  severity: I(D.change.class)
                }, {
                  default: z(() => [
                    M(A($(D.change.class)), 1)
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
}), hv = {
  key: 0,
  class: "work-stack",
  "aria-label": "Pack conflicts"
}, gv = { class: "work-stack work-tight work-pack-review-field" }, yv = { class: "work-json-disclosure" }, kv = { class: "work-config-fields" }, wv = { class: "work-json-example" }, Vv = { class: "work-json-example" }, $v = {
  key: 1,
  class: "work-stack",
  "aria-label": "Pack state maps"
}, xv = /* @__PURE__ */ pe({
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
      return t.original.processes?.find((n) => n.id === o)?.name || ke(o);
    }
    function u(o) {
      const [n, ...s] = o.split("."), g = s.join(".");
      return n === "processes" ? i(g) : n === "fields" ? t.original.fields?.find((f) => f.code === g)?.title || ke(g) : n === "item_types" ? t.original.item_types?.find((f) => f.id === g)?.title || ke(g) : ke(n);
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
    return (o, n) => (c(), y(J, null, [
      e.plan.conflicts.length ? (c(), y("section", hv, [
        n[3] || (n[3] = d("h3", null, "Local edits conflict", -1)),
        n[4] || (n[4] = d("p", { class: "work-muted work-small" }, "Choose which declaration to keep for each conflict, then review again.", -1)),
        (c(!0), y(J, null, le(e.plan.conflicts, (s) => (c(), y("div", {
          key: s.path,
          class: "work-stack work-tight"
        }, [
          d("label", gv, [
            M(A(u(s.path)), 1),
            h(r(oe), {
              "model-value": e.request.resolutions?.[s.path],
              "aria-label": "Resolution for " + u(s.path),
              disabled: e.disabled,
              appendTo: "self",
              placeholder: "Choose a resolution",
              optionLabel: "label",
              optionValue: "value",
              options: [{ label: "Keep local edits", value: "local" }, { label: "Use pack changes", value: "incoming" }],
              "onUpdate:modelValue": (g) => v(s.path, g)
            }, null, 8, ["model-value", "aria-label", "disabled", "onUpdate:modelValue"])
          ]),
          d("details", yv, [
            n[2] || (n[2] = d("summary", null, "Compare declarations", -1)),
            d("div", kv, [
              d("section", null, [
                n[0] || (n[0] = d("h4", null, "Local edits", -1)),
                d("pre", wv, A(m(s.local_value)), 1)
              ]),
              d("section", null, [
                n[1] || (n[1] = d("h4", null, "Pack changes", -1)),
                d("pre", Vv, A(m(s.incoming)), 1)
              ])
            ])
          ])
        ]))), 128))
      ])) : U("", !0),
      Object.keys(e.plan.maps).length ? (c(), y("section", $v, [
        n[5] || (n[5] = d("h3", null, "Required state maps", -1)),
        n[6] || (n[6] = d("p", { class: "work-muted work-small" }, "Review the proposed destinations for existing items. Each destination is editable.", -1)),
        (c(!0), y(J, null, le(e.plan.maps, (s, g) => (c(), y("div", {
          key: g,
          class: "work-stack"
        }, [
          d("h4", null, A(i(g)), 1),
          (c(!0), y(J, null, le(s, (f, k) => (c(), y("label", {
            key: k,
            class: "work-stack work-tight work-pack-review-field"
          }, [
            M("Move items from " + A(r(ve)(e.original.processes?.find(($) => $.id === g)?.states.find(($) => $.id === k))), 1),
            h(r(oe), {
              "model-value": e.request.maps?.[g]?.[k],
              "aria-label": "Move items from " + r(ve)(e.original.processes?.find(($) => $.id === g)?.states.find(($) => $.id === k)),
              disabled: e.disabled,
              appendTo: "self",
              optionLabel: "label",
              optionValue: "value",
              options: e.plan.declaration.processes?.find(($) => $.id === g)?.states.map(($) => ({ label: r(ve)($), value: $.id })) ?? [],
              "onUpdate:modelValue": ($) => p(g, k, $)
            }, null, 8, ["model-value", "aria-label", "disabled", "options", "onUpdate:modelValue"])
          ]))), 128))
        ]))), 128))
      ])) : U("", !0)
    ], 64));
  }
}), Cv = {
  key: 0,
  class: "work-settings-tabs"
}, Sv = { class: "work-section-navigation" }, Tv = {
  key: 1,
  class: "kx-err work-alert-actions"
}, Dv = { role: "alert" }, Uv = {
  key: 2,
  class: "kx-err work-alert-actions"
}, Iv = { role: "alert" }, Ev = {
  key: 3,
  class: "work-notice",
  role: "status"
}, Av = {
  key: 4,
  class: "kx-loading",
  role: "status"
}, Pv = {
  key: 5,
  class: "work-notice",
  role: "alert"
}, Rv = {
  key: 6,
  class: "work-settings-content work-pane"
}, Ov = {
  key: 0,
  class: "work-notice",
  role: "alert"
}, Nv = {
  key: 1,
  class: "work-notice"
}, Mv = { key: 0 }, Fv = ["disabled", "inert"], zv = {
  key: 6,
  class: "work-settings-card work-stack"
}, Lv = {
  key: 5,
  class: "kx-empty"
}, Bv = {
  key: 6,
  class: "work-muted work-small",
  role: "status"
}, jv = { class: "work-stack work-tight" }, qv = {
  key: 0,
  class: "work-muted"
}, Wv = { class: "work-dialog-actions" }, Kv = /* @__PURE__ */ pe({
  __name: "BoardSettings",
  props: {
    boardId: {},
    embedded: { type: Boolean }
  },
  emits: ["dirty-change"],
  setup(e, { emit: a }) {
    const t = e, l = a, i = ai();
    let u, m = "";
    const v = () => JSON.stringify([w.value, E.value, W.value, [...he.value]]), p = ["Fields", "Item types", "Process", "Policy", "Relation types", "Plugins", "Review"], o = B("Fields"), n = B(!1), s = B(""), g = B(/* @__PURE__ */ new Set(["Fields"]));
    Ce(o, (ee) => g.value.add(ee));
    const f = B(), k = B(), $ = B(), I = B({}), E = B({}), C = B(), S = B(!1), D = B(!0), P = B(!1), K = B(""), te = B(""), ce = B(""), se = B([]), W = B(), O = B(), N = B(), V = B(), R = B(), L = B(""), T = B([]), F = H(() => [...T.value, ...V.value?.refused ?? []]), Q = B(!1), we = B(0), he = B(/* @__PURE__ */ new Set()), ge = B(), b = Ya(), x = Ya(), w = H(() => yl(I.value, f.value?.declaration ?? {})), j = H(() => he.value.size > 0 || !!W.value || !!f.value && (JSON.stringify(w.value) !== JSON.stringify(f.value.declaration) || Object.keys(E.value).length > 0)), Z = B(!1), re = H(() => j.value || Z.value);
    Ce(re, (ee) => l("dirty-change", ee), { immediate: !0, flush: "sync" });
    const ue = H(() => !!f.value && !!k.value && f.value.generation !== k.value.generation), Ue = H(() => S.value && !P.value && !Q.value && !It.value && !ue.value && !he.value.size && V.value && (V.value.changes.length > 0 || Object.keys(E.value).length > 0) && V.value.class !== "refused" && !V.value.refused.length && R.value?.matches(w.value, f.value?.generation ?? -1, E.value)), Me = H(() => se.value.find((ee) => ee.id === W.value?.pack)?.plugins.filter((ee) => !f.value?.plugins?.some((G) => G.plugin === ee.plugin && G.active)).map((ee) => ({ use: ee.plugin })) ?? []), Ie = H(() => !!N.value && JSON.stringify(N.value) === JSON.stringify(W.value)), st = H(() => W.value ? S.value && !P.value && !he.value.size && !ue.value && !It.value && Ie.value && V.value?.class !== "refused" && !V.value?.refused.length && O.value?.conflicts.every((ee) => !!W.value?.resolutions?.[ee.path]) : Ue.value), lt = H(() => !!V.value && (!W.value || Ie.value)), Ia = H(() => se.value.find((ee) => ee.id === f.value?.pack?.id)?.title || "Installed pack"), Ye = H(() => !ce.value && !!f.value?.outdated && !!se.value.find((ee) => ee.id === f.value?.pack?.id)), na = H(() => ce.value ? "Reload packs to check available upgrades." : Ye.value ? j.value ? "Discard the current draft before upgrading." : It.value ? "Finish the current migration before upgrading." : P.value ? "Wait for the current request to finish." : void 0 : "Install an available version of this pack to upgrade.");
    function Ut() {
      W.value = void 0, O.value = void 0, N.value = void 0;
    }
    async function mo() {
      if (!f.value?.pack || P.value || j.value) return;
      const ee = se.value.find((G) => G.id === f.value.pack.id);
      ee && (W.value = kl(ee, f.value.generation), o.value = "Review", await Ea());
    }
    async function fo() {
      const ee = se.value.find((G) => G.id === s.value);
      !f.value || !ee || ee.plugins.some((G) => !G.installed) || P.value || j.value || (W.value = kl(ee, f.value.generation), n.value = !1, o.value = "Review", await Ea());
    }
    async function Ea() {
      if (!W.value || P.value || !S.value || ue.value || he.value.size) return;
      const ee = x(), G = wt(W.value), ae = JSON.stringify(W.value);
      P.value = !0, K.value = "", te.value = "";
      try {
        const Ve = await Bo(G, (At) => Vt.packPlan(t.boardId, At));
        if (!ee() || ae !== JSON.stringify(W.value)) return;
        O.value = Ve.plan, V.value = Ve.plan, W.value = Ve.request, N.value = wt(W.value), L.value = crypto.randomUUID(), o.value = "Review";
      } catch (Ve) {
        ee() && (N.value = void 0, K.value = Ge(Ve, "Could not plan the pack upgrade."));
      } finally {
        P.value = !1;
      }
    }
    const ml = H(() => O.value?.declaration ?? R.value?.declaration), po = H(() => {
      const ee = ml.value;
      return !V.value || !ee ? [] : Lo(V.value, ee).map((G) => ee.processes?.find((ae) => ae.id === G)?.name || "Untitled process");
    }), It = H(() => !!k.value?.migration_error || $.value?.status === "migrating");
    function rt() {
      T.value = [], x(), V.value = void 0, R.value = void 0, N.value = void 0, L.value = "";
    }
    Ce([w, E], rt, { deep: !0, flush: "sync" }), Ce(E, (ee) => {
      W.value && (Object.keys(ee).length ? W.value.plugin_configs = wt(ee) : delete W.value.plugin_configs);
    }, { deep: !0, flush: "sync" });
    function Et(ee, G) {
      G ? he.value.delete(ee) : he.value.add(ee), rt();
    }
    function Aa(ee) {
      Ut(), we.value++, f.value = ee, I.value = wt(ee.declaration), E.value = {}, he.value.clear(), rt();
    }
    async function Qe(ee = !1) {
      const G = b();
      try {
        const [ae, Ve, At] = await Promise.all([Ct.schema(t.boardId, void 0, !0).catch((dt) => {
          if (dt instanceof Xa && dt.details?.code === "board_schema_missing") return { generation: 0, declaration: {}, compiled: {}, key_prefix: "", as_of: 0 };
          throw dt;
        }), Ct.options(t.boardId), Ct.boards()]);
        if (!G()) return;
        if (S.value = Ve.access.admin, C.value = Ve, $.value = At.find((dt) => dt.board_id === t.boardId), !S.value) {
          f.value = void 0, I.value = {}, rt();
          return;
        }
        K.value = "";
        const _e = jo(ae);
        k.value = _e, u !== void 0 && _e.generation >= u ? (u = void 0, m === v() && Aa(_e), m = "") : (ee || !f.value || !j.value && _e.generation !== f.value.generation) && Aa(_e), ue.value && rt(), await fl(G);
      } catch (ae) {
        if (!G()) return;
        ae instanceof Xa && (ae.status === 403 || ae.kind?.toLowerCase() === "permission_denied") && (S.value = !1), rt(), K.value = Ge(ae, "Could not load board settings.");
      } finally {
        G() && (D.value = !1);
      }
    }
    async function fl(ee = () => !0) {
      ce.value = "";
      try {
        const G = await Ct.packs();
        ee() && (se.value = G.filter(qo));
      } catch (G) {
        ee() && (ce.value = Ge(G, "Could not load packs."));
      }
    }
    function bo() {
      for (const ee of ge.value?.querySelectorAll("input, select, textarea") ?? [])
        if (!(ee.form !== ge.value || ee.closest('[style*="display: none"]')) && !ee.reportValidity())
          return !1;
      return !0;
    }
    function ho(ee) {
      o.value = ee, ee === "Review" && !V.value && Pa();
    }
    async function Pa() {
      if (W.value) return Ea();
      if (!f.value || P.value || !S.value || ue.value || he.value.size || !bo()) return;
      const ee = x(), G = wl(w.value, f.value.generation, E.value);
      P.value = !0, K.value = "", te.value = "";
      try {
        const ae = await Vt.plan(t.boardId, G);
        if (!ee() || he.value.size || !G.matches(w.value, f.value.generation, E.value)) return;
        V.value = ae, R.value = G, L.value = crypto.randomUUID(), o.value = "Review";
      } catch (ae) {
        ee() && (rt(), K.value = Ge(ae, "Could not review changes."), T.value = Wo(ae, w.value));
      } finally {
        P.value = !1;
      }
    }
    async function go() {
      if (!st.value) return;
      if (W.value && N.value) {
        P.value = !0, K.value = "";
        const G = v();
        try {
          const ae = await Vt.packApply(t.boardId, wt(N.value), L.value);
          u = ae.generation, m = G, await Qe(), te.value = ae.status === "done" ? `Pack applied at generation ${ae.generation}.` : "Pack installation continues in the background.";
        } catch (ae) {
          K.value = Ge(ae, "Could not apply the pack upgrade.");
        } finally {
          P.value = !1;
        }
        return;
      }
      if (!R.value) return;
      P.value = !0, K.value = "", te.value = "";
      const ee = v();
      try {
        const G = await Vt.apply(t.boardId, R.value, L.value);
        u = G.generation, m = ee, await Qe(), te.value = `Applied generation ${G.generation} (${G.class}).`;
      } catch (G) {
        K.value = Ge(G, "Could not apply schema.");
      } finally {
        P.value = !1;
      }
    }
    async function yo() {
      if (!P.value) {
        P.value = !0, K.value = "";
        try {
          const ee = await Vt.resume(t.boardId);
          te.value = ee.resumed ? "Migration resumes." : "Migration is already running.", await Qe();
        } catch (ee) {
          K.value = Ge(ee, "Could not resume migration.");
        } finally {
          P.value = !1;
        }
      }
    }
    async function sa(ee, G) {
      if (!f.value || !S.value || P.value || Q.value) return "Wait for the current change to finish.";
      if (ue.value) return "Discard the stale draft before removing a definition.";
      const ae = f.value.generation, Ve = JSON.stringify(w.value), At = wt(I.value);
      la(At, ee, G), Q.value = !0;
      try {
        const _e = await Vt.plan(t.boardId, wl(yl(At, f.value.declaration), ae, E.value));
        if (!S.value || ue.value || f.value.generation !== ae || JSON.stringify(w.value) !== Ve) return "The draft changes during the check. Try the removal again.";
        const dt = Ko(_e, ee, G);
        if (dt) return dt;
        if (_e.class === "refused") return "Resolve the refused draft changes in Review before removing this definition.";
      } catch (_e) {
        return Ge(_e, "Could not check this removal.");
      } finally {
        Q.value = !1;
      }
    }
    async function ko() {
      re.value && !await Yo.confirm({ header: "Discard changes?", message: "Your unsaved board settings will be discarded.", acceptLabel: "Discard", rejectLabel: "Keep editing" }) || i({ name: "board", board: t.boardId });
    }
    function wo() {
      u = void 0, k.value && Aa(k.value), te.value = "", K.value = "";
    }
    Ce(() => t.boardId, () => {
      Z.value = !1, u = void 0, Ut(), se.value = [], f.value = void 0, k.value = void 0, $.value = void 0, E.value = {}, he.value.clear(), g.value = /* @__PURE__ */ new Set(["Fields"]), o.value = "Fields", S.value = !1, D.value = !0, Qe(!0);
    });
    let Ra = () => {
    };
    return Ce(() => t.boardId, (ee) => {
      Ra(), Ra = Ho(`component.${ee}`, () => {
        Qe();
      });
    }, { immediate: !0 }), So(Qe), Ll(() => {
      Ra(), b(), x();
    }), (ee, G) => (c(), y("section", {
      class: pt(["work-settings-shell", { "work-embedded": e.embedded }])
    }, [
      h(_c, {
        board: $.value,
        embedded: e.embedded,
        generation: f.value?.generation,
        authorized: S.value,
        dirty: j.value,
        busy: P.value,
        "checking-removal": Q.value,
        reviewed: lt.value,
        pack: f.value?.pack,
        "pack-title": Ia.value,
        outdated: f.value?.outdated,
        "upgrade-reason": na.value,
        "can-upgrade": Ye.value && !j.value && !P.value && !It.value && S.value,
        onUpgrade: mo,
        onInstall: G[0] || (G[0] = (ae) => n.value = !0),
        disabled: !j.value || P.value || Q.value || It.value || ue.value || !!he.value.size || lt.value && !st.value,
        onBack: ko,
        onDiscard: wo,
        onPrimary: G[1] || (G[1] = (ae) => lt.value ? go() : Pa()),
        onSaved: G[2] || (G[2] = (ae) => Qe()),
        onMetadataDirtyChange: G[3] || (G[3] = (ae) => Z.value = ae)
      }, null, 8, ["board", "embedded", "generation", "authorized", "dirty", "busy", "checking-removal", "reviewed", "pack", "pack-title", "outdated", "upgrade-reason", "can-upgrade", "disabled"]),
      S.value && f.value ? (c(), y("div", Cv, [
        d("div", Sv, [
          h(r(Jo), {
            value: o.value,
            "onUpdate:value": G[4] || (G[4] = (ae) => ho(ae))
          }, {
            default: z(() => [
              h(r(Zo), { "aria-label": "Settings sections" }, {
                default: z(() => [
                  (c(), y(J, null, le(p, (ae) => h(r(Qo), {
                    key: ae,
                    value: ae
                  }, {
                    default: z(() => [
                      M(A(ae), 1)
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
      K.value ? (c(), y("div", Tv, [
        d("p", Dv, A(K.value), 1),
        h(r(X), {
          label: "Retry",
          severity: "secondary",
          onClick: G[5] || (G[5] = (ae) => Qe()),
          outlined: ""
        }, {
          icon: z(() => [
            h(r(_), {
              icon: "tabler:refresh",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        })
      ])) : U("", !0),
      ce.value ? (c(), y("div", Uv, [
        d("p", Iv, A(ce.value), 1),
        h(r(X), {
          label: "Reload packs",
          severity: "secondary",
          outlined: "",
          onClick: G[6] || (G[6] = (ae) => fl())
        }, {
          icon: z(() => [
            h(r(_), {
              icon: "tabler:refresh",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        })
      ])) : U("", !0),
      te.value ? (c(), y("p", Ev, A(te.value), 1)) : U("", !0),
      D.value ? (c(), y("p", Av, "Loading settings…")) : !S.value && !K.value ? (c(), y("p", Pv, "Board administrator access is required.")) : U("", !0),
      S.value && f.value ? (c(), y("div", Rv, [
        ue.value ? (c(), y("div", Ov, "The board advances to generation " + A(k.value?.generation) + " while you edit. Your draft keeps generation " + A(f.value.generation) + ". Discard to load the latest schema before reviewing again.", 1)) : U("", !0),
        It.value ? (c(), y("div", Nv, [
          d("p", null, [
            G[19] || (G[19] = M("Migration pending", -1)),
            k.value?.migration_error ? (c(), y("span", Mv, ": " + A(k.value.migration_error), 1)) : U("", !0)
          ]),
          h(r(X), {
            label: "Resume migration",
            severity: "secondary",
            disabled: P.value,
            onClick: yo,
            outlined: ""
          }, {
            icon: z(() => [
              h(r(_), {
                icon: "tabler:refresh",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled"])
        ])) : U("", !0),
        d("form", {
          ref_key: "editor",
          ref: ge,
          onSubmit: ye(Pa, ["prevent"])
        }, [
          (c(), y("fieldset", {
            key: we.value,
            class: "work-settings-fieldset",
            disabled: P.value || Q.value,
            inert: P.value || Q.value || void 0
          }, [
            g.value.has("Fields") ? et((c(), q(Cs, {
              key: 0,
              "board-id": e.boardId,
              "installed-types": C.value?.installed_types,
              draft: I.value,
              "guard-removal": sa,
              issues: F.value,
              onValidity: G[7] || (G[7] = (ae, Ve) => Et("fields:" + ae, Ve))
            }, null, 8, ["board-id", "installed-types", "draft", "issues"])), [
              [ut, o.value === "Fields"]
            ]) : U("", !0),
            g.value.has("Item types") ? et((c(), q(qs, {
              key: 1,
              draft: I.value,
              "guard-removal": sa,
              issues: F.value
            }, null, 8, ["draft", "issues"])), [
              [ut, o.value === "Item types"]
            ]) : U("", !0),
            g.value.has("Process") ? et((c(), q(yu, {
              key: 2,
              "board-id": e.boardId,
              draft: I.value,
              "guard-removal": sa,
              issues: F.value,
              onValidity: G[8] || (G[8] = (ae, Ve) => Et("process:" + ae, Ve))
            }, null, 8, ["board-id", "draft", "issues"])), [
              [ut, o.value === "Process"]
            ]) : U("", !0),
            g.value.has("Policy") ? et((c(), q(Lu, {
              key: 3,
              draft: I.value,
              onValidity: G[9] || (G[9] = (ae, Ve) => Et("policy:" + ae, Ve))
            }, null, 8, ["draft"])), [
              [ut, o.value === "Policy"]
            ]) : U("", !0),
            g.value.has("Relation types") ? et((c(), q(ac, {
              key: 4,
              draft: I.value,
              "guard-removal": sa
            }, null, 8, ["draft"])), [
              [ut, o.value === "Relation types"]
            ]) : U("", !0),
            g.value.has("Plugins") ? et((c(), q(Rl, {
              key: 5,
              "board-id": e.boardId,
              draft: I.value,
              schema: k.value ?? f.value,
              options: C.value?.schema_options.plugins ?? [],
              configs: E.value,
              disabled: P.value,
              onConfigured: G[10] || (G[10] = (ae) => {
                rt(), Qe();
              }),
              onRefresh: G[11] || (G[11] = (ae) => Qe()),
              onValidity: G[12] || (G[12] = (ae, Ve) => Et("plugin:" + ae, Ve))
            }, null, 8, ["board-id", "draft", "schema", "options", "configs", "disabled"])), [
              [ut, o.value === "Plugins"]
            ]) : U("", !0),
            g.value.has("Policy") ? et((c(), y("section", zv, [
              h(Tc, {
                "board-id": e.boardId,
                draft: I.value,
                onValidity: G[13] || (G[13] = (ae) => Et("visibility", ae))
              }, null, 8, ["board-id", "draft"])
            ], 512)), [
              [ut, o.value === "Policy"]
            ]) : U("", !0)
          ], 8, Fv))
        ], 544),
        o.value === "Review" && !W.value ? (c(), q(Vu, {
          key: 2,
          draft: I.value,
          original: f.value.declaration,
          disabled: P.value || Q.value
        }, null, 8, ["draft", "original", "disabled"])) : U("", !0),
        o.value === "Review" && W.value && Me.value.length ? (c(), q(Rl, {
          key: 3,
          "board-id": e.boardId,
          draft: { plugins: Me.value },
          schema: k.value ?? f.value,
          options: C.value?.schema_options.plugins.filter((ae) => Me.value.some((Ve) => Ve.use === ae.plugin)) ?? [],
          configs: E.value,
          disabled: P.value,
          "activation-locked": "",
          onValidity: G[14] || (G[14] = (ae, Ve) => Et("pack-plugin:" + ae, Ve))
        }, null, 8, ["board-id", "draft", "schema", "options", "configs", "disabled"])) : U("", !0),
        o.value === "Review" ? (c(), q(bv, {
          key: 4,
          "board-id": e.boardId,
          original: f.value.declaration,
          declaration: ml.value,
          plan: V.value,
          generation: f.value.generation,
          follows: po.value,
          "config-count": Object.keys(E.value).length,
          "pack-review": !!O.value
        }, {
          default: z(() => [
            O.value && W.value ? (c(), q(xv, {
              key: 0,
              plan: O.value,
              request: W.value,
              original: f.value.declaration,
              disabled: P.value,
              onChange: G[15] || (G[15] = (ae) => {
                N.value = void 0, L.value = "";
              })
            }, null, 8, ["plan", "request", "original", "disabled"])) : U("", !0)
          ]),
          _: 1
        }, 8, ["board-id", "original", "declaration", "plan", "generation", "follows", "config-count", "pack-review"])) : U("", !0),
        o.value === "Review" && !V.value ? (c(), y("p", Lv, "Review your draft to see the changes, their impact and any migration required.")) : U("", !0),
        Q.value ? (c(), y("p", Bv, "Checking existing values and dependencies…")) : U("", !0)
      ])) : U("", !0),
      S.value ? (c(), q(Gl, {
        key: 7,
        visible: n.value,
        label: "Install pack",
        busy: P.value,
        onClose: G[18] || (G[18] = (ae) => n.value = !1)
      }, {
        default: z(() => [
          d("form", {
            class: "work-dialog-box work-stack",
            onSubmit: ye(fo, ["prevent"])
          }, [
            G[21] || (G[21] = d("h2", null, "Install a pack", -1)),
            G[22] || (G[22] = d("p", { class: "work-muted work-small" }, "Packs can be installed on an empty board. Review checks whether this board is eligible.", -1)),
            d("label", jv, [
              G[20] || (G[20] = M("Pack", -1)),
              h(r(oe), {
                modelValue: s.value,
                "onUpdate:modelValue": G[16] || (G[16] = (ae) => s.value = ae),
                "aria-label": "Pack to install",
                appendTo: "self",
                optionLabel: "title",
                optionValue: "id",
                optionDisabled: "disabled",
                options: se.value.map((ae) => ({ ...ae, disabled: ae.plugins.some((Ve) => !Ve.installed) }))
              }, null, 8, ["modelValue", "options"])
            ]),
            se.value.length ? U("", !0) : (c(), y("p", qv, "No available packs were found.")),
            d("footer", Wv, [
              h(r(X), {
                label: "Cancel",
                severity: "secondary",
                outlined: "",
                onClick: G[17] || (G[17] = (ae) => n.value = !1)
              }),
              h(r(X), {
                type: "submit",
                label: "Review pack",
                disabled: !s.value || P.value || j.value
              }, null, 8, ["disabled"])
            ])
          ], 32)
        ]),
        _: 1
      }, 8, ["visible", "busy"])) : U("", !0)
    ], 2));
  }
}), Gv = /* @__PURE__ */ pe({
  __name: "SettingsRoot",
  setup(e) {
    const a = To(), t = Do();
    return Co(Yl, (l) => t("navigate", { route: li(l) })), (l, i) => (c(), q(Kv, {
      "board-id": r(a).boardId ?? "",
      embedded: r(a).embedded,
      onDirtyChange: i[0] || (i[0] = (u) => r(t)("dirty-change", { dirty: u }))
    }, null, 8, ["board-id", "embedded"]));
  }
}), Hv = Uo(Gv, {
  type: "object",
  properties: {
    "board-id": { type: "string", default: "", description: "Board to administer." },
    embedded: { type: "boolean", default: !1, description: "Fits in a System detail pane." }
  }
});
Xo(import.meta.url, Hv);
//# sourceMappingURL=settings.js.map
