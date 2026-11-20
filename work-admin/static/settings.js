import { inject as po, defineComponent as ue, ref as z, useSlots as bo, openBlock as c, createElementBlock as g, createElementVNode as d, createVNode as b, normalizeClass as pt, unref as r, withCtx as M, renderSlot as Ke, toDisplayString as I, createCommentVNode as D, createBlock as B, withDirectives as _e, vShow as ct, computed as Y, watch as xe, onMounted as wl, onUnmounted as Pa, resolveComponent as Ra, Fragment as J, renderList as te, createTextVNode as N, resolveDynamicComponent as Bl, onBeforeUnmount as nt, useId as Zl, withKeys as Ae, withModifiers as be, normalizeStyle as ho, watchEffect as Oa, nextTick as yo, provide as go } from "vue";
import { e as lt, u as ko, b as wo, c as Vo, a as $o } from "./mount-BPppzRAk.js";
import "pinia";
import { Icon as Q } from "@iconify/vue";
import le from "primevue/select";
import { m as jl, e as ua, s as he, g as xo, t as je, p as Dt, d as Ql, h as It, r as ca, w as xt, f as We, l as ql, i as Ge, j as St, b as ot, u as Na, k as Ma, n as _l, o as Fa, q as ye, v as Vl, x as el, y as Co, z as La, A as Wl, B as So, C as $t, D as To, _ as za, E as Uo, F as Eo, G as va, H as kt, I as Do, J as ma, K as Io, L as fa, M as Ao, N as Po, a as Ro, O as pa, P as Oo, Q as No } from "./latestRequest-DbPJ4unS.js";
import H from "primevue/button";
import { api as Mo, on as Fo, host as Lo, define as zo } from "@wippy-fe/proxy";
import Re from "primevue/tag";
import Le from "primevue/toggleswitch";
import Ft from "primevue/checkbox";
import de from "primevue/inputtext";
import fl from "primevue/textarea";
import Ye from "primevue/inputnumber";
import Bo from "primevue/chip";
import ea from "primevue/selectbutton";
import jo from "primevue/tabs";
import qo from "primevue/tablist";
import Wo from "primevue/tab";
import Ko from "primevue/message";
const Il = (e, l) => e.x > l.x && e.x < l.x + l.width && e.y > l.y && e.y < l.y + l.height;
function Go(e, l, t) {
  return e.x === l.x ? e.x > t.x && e.x < t.x + t.width && Math.max(e.y, l.y) > t.y && Math.min(e.y, l.y) < t.y + t.height : e.y > t.y && e.y < t.y + t.height && Math.max(e.x, l.x) > t.x && Math.min(e.x, l.x) < t.x + t.width;
}
function ht(e, l, t) {
  const a = [.../* @__PURE__ */ new Set([e.x, l.x, ...t.flatMap((U) => [U.x, U.x + U.width])])].sort((U, G) => U - G), o = [.../* @__PURE__ */ new Set([e.y, l.y, ...t.flatMap((U) => [U.y, U.y + U.height])])].sort((U, G) => U - G);
  a.unshift(a[0] - 24), a.push(a.at(-1) + 24), o.unshift(o[0] - 24), o.push(o.at(-1) + 24);
  const s = a.length, v = o.indexOf(l.y) * s + a.indexOf(l.x), p = o.indexOf(e.y) * s + a.indexOf(e.x), f = (U) => ({ x: a[U % s], y: o[Math.floor(U / s)] }), i = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map(), u = [];
  function y(U) {
    u.push(U);
    let G = u.length - 1;
    for (; G; ) {
      const F = G - 1 >> 1;
      if (u[F].priority <= U.priority) break;
      u[G] = u[F], G = F;
    }
    u[G] = U;
  }
  function m() {
    const U = u[0], G = u.pop();
    if (u.length) {
      let F = 0;
      for (; F * 2 + 1 < u.length; ) {
        let E = F * 2 + 1;
        if (E + 1 < u.length && u[E + 1].priority < u[E].priority && E++, G.priority <= u[E].priority) break;
        u[F] = u[E], F = E;
      }
      u[F] = G;
    }
    return U;
  }
  const w = (U) => Math.abs(U.x - l.x) + Math.abs(U.y - l.y);
  for (const U of [0, 1]) {
    const G = p * 2 + U;
    i.set(G, 0), y({ key: G, cost: 0, priority: w(e) });
  }
  const C = /* @__PURE__ */ new Map(), A = /* @__PURE__ */ new Map();
  for (; u.length; ) {
    const U = m(), G = Math.floor(U.key / 2), F = U.key % 2;
    if (U.cost !== i.get(U.key)) continue;
    if (G === v) {
      const T = [];
      let ae = U.key;
      for (; ae !== void 0; )
        T.push(f(Math.floor(ae / 2))), ae = n.get(ae);
      return Ba(T.reverse());
    }
    const E = f(G), $ = G % s, V = Math.floor(G / s);
    for (const [T, ae] of [[$ > 0 ? G - 1 : -1, 0], [$ + 1 < s ? G + 1 : -1, 0], [V > 0 ? G - s : -1, 1], [V + 1 < o.length ? G + s : -1, 1]]) {
      if (T < 0) continue;
      const L = f(T);
      if (C.has(T) || C.set(T, !t.some((x) => Il(L, x))), !C.get(T)) continue;
      const j = `${Math.min(G, T)}:${Math.max(G, T)}`;
      if (A.has(j) || A.set(j, !t.some((x) => Go(E, L, x))), !A.get(j)) continue;
      const R = U.cost + Math.abs(E.x - L.x) + Math.abs(E.y - L.y) + (F === ae ? 0 : 18), ne = T * 2 + ae;
      R >= (i.get(ne) ?? 1 / 0) || (i.set(ne, R), n.set(ne, U.key), y({ key: ne, cost: R, priority: R + w(L) }));
    }
  }
  throw new Error("Process map has no collision-free route between its ports: " + JSON.stringify({ start: e, end: l, startInside: t.filter((U) => Il(e, U)), endInside: t.filter((U) => Il(l, U)) }));
}
function Ba(e) {
  const l = [];
  for (const t of e) {
    const a = l.at(-1), o = l.at(-2);
    a && a.x === t.x && a.y === t.y || (o && a && (o.x === a.x && a.x === t.x || o.y === a.y && a.y === t.y) && l.pop(), l.push(t));
  }
  return l;
}
const qt = (e) => Array.from(e).reduce((l, t) => l + (/[^\x20-\x7e]/u.test(t) ? 16 : /[MW@%]/.test(t) ? 11 : /[ilI.,:;!| ']/.test(t) ? 4 : 7.5), 0);
function Nt(e, l = 28) {
  const t = [];
  let a = "";
  for (const o of e.split(/\s+/u))
    for (let s = 0; s < o.length; s += l) {
      const v = o.slice(s, s + l);
      a && a.length + v.length + 1 > l && (t.push(a), a = ""), a = a ? a + " " + v : v;
    }
  return [...t, a].filter(Boolean);
}
function il(e) {
  if (e = Ba(e), !e.length) return "";
  let l = `M ${e[0].x} ${e[0].y}`;
  for (let a = 1; a < e.length - 1; a++) {
    const o = e[a - 1], s = e[a], v = e[a + 1], p = Math.hypot(s.x - o.x, s.y - o.y), f = Math.hypot(v.x - s.x, v.y - s.y), i = Math.min(8, p / 3, f / 3);
    i && (l += ` L ${s.x + (o.x - s.x) * i / p} ${s.y + (o.y - s.y) * i / p} Q ${s.x} ${s.y} ${s.x + (v.x - s.x) * i / f} ${s.y + (v.y - s.y) * i / f}`);
  }
  const t = e.at(-1);
  return l + ` L ${t.x} ${t.y}`;
}
function Yo(e, l = {}, t = { width: 1400, height: 480 }) {
  const a = t.width < 750 || jl(e).length > 8 ? "TB" : "LR", o = new ua.graphlib.Graph({ multigraph: !0 });
  o.setGraph({ rankdir: a, ranker: "network-simplex", acyclicer: "greedy", nodesep: 32, edgesep: 32, ranksep: 24, marginx: 32, marginy: 32 }), o.setDefaultEdgeLabel(() => ({}));
  const s = jl(e), v = new Map(s.map((h, S) => [h.id, S])), p = e.states.map((h) => {
    const S = (e.transitions ?? []).filter((Te) => Te.from === "any" && Te.to === h.id), k = Nt(he(h)), q = Nt(xo(h, e)), X = S.flatMap((Te) => Nt(je(Te) + " works from any state")), re = l.policy?.wip?.[h.id]?.limit, fe = re === void 0 ? 0 : qt(" · limit " + re), Se = Math.max(168, ...k.map((Te) => qt(Te) + 58), ...q.map((Te, bt) => qt(Te) + 32 + (bt === q.length - 1 ? fe : 0)), ...X.map((Te) => qt(Te) + 32)), Ne = Math.max(80, 42 + k.length * 18 + q.length * 16 + X.length * 18);
    return o.setNode(h.id, { width: Se + (a === "LR" ? 36 : 0), height: Ne + (a === "TB" ? 36 : 0) }), { state: h, x: 0, y: 0, width: Se, height: Ne, title: k, caption: q, badges: S, row: v.has(h.id) ? 0 : 1 };
  }), f = new Set(p.map((h) => h.state.id)), i = (e.transitions ?? []).flatMap((h) => h.from === "any" ? [] : h.from.filter((S) => f.has(S) && f.has(h.to)).map((S) => {
    const k = `${h.id}-${S}`, q = Nt(je(h)), X = Math.max(72, ...q.map((fe) => qt(fe) + 24)), re = Math.max(24, q.length * 16 + 10);
    return { transition: h, from: S, key: k, lines: q, width: X, height: re };
  })), n = /* @__PURE__ */ new Set(), u = /* @__PURE__ */ new Set(), y = new Set(i.filter((h) => h.from === h.transition.to || h.transition.to === e.initial || ["completed", "canceled"].includes(p.find((S) => S.state.id === h.from).state.category)).map((h) => h.key));
  function m(h) {
    if (!u.has(h)) {
      n.add(h);
      for (const S of i.filter((k) => k.from === h))
        y.has(S.key) || (n.has(S.transition.to) ? y.add(S.key) : m(S.transition.to));
      n.delete(h), u.add(h);
    }
  }
  m(e.initial);
  for (const h of p) m(h.state.id);
  for (const h of i) if (!y.has(h.key)) {
    const S = v.get(h.from), k = v.get(h.transition.to);
    o.setEdge(h.from, h.transition.to, { width: h.width, height: h.height, labelpos: "c", weight: S !== void 0 && k === S + 1 ? 100 : 1 }, h.key);
  }
  for (const h of e.transitions ?? []) if (h.from === "any" && f.has(e.initial) && f.has(h.to) && !v.has(h.to)) {
    const S = e.states.find((k) => k.id === h.to);
    o.setEdge(e.initial, h.to, { minlen: ["completed", "canceled"].includes(S.category) ? Math.max(1, s.length - 1) : 1 }, `any:${h.id}`);
  }
  const w = e.states.flatMap((h) => (h.regions ?? []).filter((S) => f.has(S.initial)).map((S, k) => {
    const q = `lane:${h.id}:${k}`;
    return o.setEdge(h.id, S.initial, {}, q), { state: h, region: S, key: q };
  }));
  if (!p.length) return { nodes: p, edges: [], parallels: [], main: s, direction: a, width: 320, height: 160 };
  ua.layout(o);
  for (const h of p) Object.assign(h, { x: o.node(h.state.id).x, y: o.node(h.state.id).y });
  const C = a === "TB", A = i.filter((h) => !y.has(h.key)).map((h) => o.edge({ v: h.from, w: h.transition.to, name: h.key })), U = [...p, ...A], G = Math.max(...U.map((h) => h.x + h.width / 2)), F = Math.max(...U.map((h) => h.y + h.height / 2)), E = (h) => p.find((S) => S.state.id === h), $ = i.filter((h) => y.has(h.key)).sort((h, S) => {
    const k = C ? "y" : "x";
    return Math.abs(E(h.from)[k] - E(h.transition.to)[k]) - Math.abs(E(S.from)[k] - E(S.transition.to)[k]);
  }), V = /* @__PURE__ */ new Map(), T = Math.max(0, ...$.map((h) => h.width));
  let ae = F + 32;
  for (const [h, S] of $.entries()) {
    const k = E(S.from), q = E(S.transition.to), X = C ? G + 16 + T + 28 + h * 18 : ae + S.height / 2, re = C ? G + 16 + T / 2 : (k.x + q.x) / 2;
    let fe = C ? k.y + k.height / 2 + 18 : X;
    if (C) for (const Se of [...V.values()].sort((Ne, Te) => Ne.y - Te.y))
      fe + S.height / 2 + 10 > Se.y - Se.height / 2 - 10 && fe - S.height / 2 - 10 < Se.y + Se.height / 2 + 10 && (fe = Se.y + Se.height / 2 + 24 + S.height / 2);
    V.set(S.key, { x: re, y: fe, corridor: X, height: S.height }), ae = X + S.height / 2 + 24;
  }
  const L = i.map((h) => ({ ...h, ...V.get(h.key) ?? o.edge({ v: h.from, w: h.transition.to, name: h.key }) })), j = (h, S) => ({ x: h.x - h.width / 2 - S, y: h.y - h.height / 2 - S, width: h.width + S * 2, height: h.height + S * 2 }), R = [...p.map((h) => j(h, 12)), ...L.map((h) => j(h, 10))], ne = (h, S) => ({
    start: C ? { x: h.x, y: h.y + h.height / 2 } : { x: h.x + h.width / 2, y: h.y },
    end: C ? { x: S.x, y: S.y - S.height / 2 } : { x: S.x - S.width / 2, y: S.y }
  }), x = (h, S) => C ? { x: h.x, y: h.y + S } : { x: h.x + S, y: h.y }, P = L.map((h) => {
    const S = p.find((He) => He.state.id === h.from), k = p.find((He) => He.state.id === h.transition.to), { start: q, end: X } = ne(S, k), re = y.has(h.key), fe = x(q, 18), Se = x(X, -18), Ne = (re || !C ? h.width : h.height) / 2 + 10, Te = re ? { x: h.x + (C ? -Ne : Ne), y: h.y } : x(h, -Ne), bt = re ? { x: h.x + (C ? Ne : -Ne), y: h.y } : x(h, Ne);
    let rt;
    if (re) {
      const { corridor: He } = V.get(h.key), al = C ? { x: He, y: h.y } : { x: fe.x, y: He }, jt = C ? { x: He, y: Se.y } : { x: Se.x, y: He };
      rt = C ? [
        [q, ...ht(fe, Te, R)],
        [bt, al, jt, ...ht(jt, Se, R), X]
      ] : [
        [q, ...ht(fe, al, R), Te],
        [bt, ...ht(jt, Se, R), X]
      ];
    } else rt = [
      [q, ...ht(fe, Te, R)],
      [...ht(bt, Se, R), X]
    ];
    const Sl = re ? "return" : v.get(h.transition.to) === (v.get(h.from) ?? -2) + 1 ? "main" : "forward";
    return { ...h, points: rt.flat(), segments: rt, path: rt.map(il).join(" "), type: Sl, targetOffset: 0 };
  }), O = w.map((h) => {
    const S = p.find((fe) => fe.state.id === h.state.id), k = p.find((fe) => fe.state.id === h.region.initial), { start: q, end: X } = ne(S, k), re = [q, ...ht(x(q, 18), x(X, -18), R), X];
    return { state: h.state, key: h.key, points: re, path: il(re) };
  }), Z = [...p.flatMap((h) => [{ x: h.x - h.width / 2, y: h.y - h.height / 2 }, { x: h.x + h.width / 2, y: h.y + h.height / 2 }]), ...P.flatMap((h) => [...h.points, { x: h.x - h.width / 2, y: h.y - h.height / 2 }, { x: h.x + h.width / 2, y: h.y + h.height / 2 }]), ...O.flatMap((h) => h.points)], ce = 32 - Math.min(...Z.map((h) => h.x)), pe = 32 - Math.min(...Z.map((h) => h.y)), ge = Math.max(...Z.map((h) => h.x)) + ce + 32, Ve = Math.max(...Z.map((h) => h.y)) + pe + 32, De = (h) => ({ x: h.x + ce, y: h.y + pe });
  for (const h of p) Object.assign(h, De(h));
  for (const h of P)
    Object.assign(h, De(h)), h.segments = h.segments.map((S) => S.map(De)), h.points = h.segments.flat(), h.path = h.segments.map(il).join(" ");
  for (const h of O)
    h.points = h.points.map(De), h.path = il(h.points);
  return { nodes: p, edges: P, parallels: O, main: s, direction: a, width: ge, height: Ve };
}
const ja = Symbol("work-navigation");
function Ho() {
  return po(ja, () => {
  });
}
function Xo(e) {
  if (e.name === "boards") return "";
  const l = encodeURIComponent(e.board);
  return e.name === "settings" ? `${l}/settings` : l;
}
const At = (e) => `/api/v1/work/boards/${encodeURIComponent(e)}`, ba = (e) => ({ declaration: e.declaration, expected_generation: e.expected_generation, plugin_configs: e.plugin_configs }), wt = {
  packPlan: (e, l) => Dt(`${At(e)}/pack_plan`, l, "Pack plan"),
  packApply: (e, l, t) => Dt(`${At(e)}/pack_apply`, { ...l, key: t }, "Apply pack"),
  plan: (e, l) => Dt(`${At(e)}/plan_schema`, ba(l), "Schema plan"),
  apply: (e, l, t) => Dt(`${At(e)}/apply_schema`, { ...ba(l), key: t }, "Apply schema"),
  resume: (e) => Dt(`${At(e)}/resume_migration`, {}, "Resume migration"),
  configure: (e, l, t) => Dt(`${At(e)}/configure_plugin`, { plugin: l, config: t }, "Configure plugin")
}, Jo = { class: "work-definition" }, Zo = { class: "work-definition-head" }, Qo = { class: "work-definition-affordances" }, _o = ["title"], ei = { class: "work-definition-code" }, ti = ["title"], li = { class: "work-definition-kind" }, ai = { class: "work-definition-flags" }, oi = { class: "work-definition-usage" }, ii = { class: "work-definition-actions" }, ni = {
  key: 0,
  class: "work-definition-description"
}, si = { class: "work-definition-body work-stack" }, $l = /* @__PURE__ */ ue({
  __name: "DefinitionRow",
  props: {
    title: {},
    code: {},
    kind: {},
    description: {}
  },
  setup(e) {
    const l = z(!1), t = bo();
    return (a, o) => (c(), g("article", Jo, [
      d("header", Zo, [
        b(Ql, {
          as: "article",
          class: pt(["work-definition-toggle", { "work-definition-has-handle": r(t).handle }]),
          "aria-expanded": l.value,
          onActivate: o[0] || (o[0] = (s) => l.value = !l.value)
        }, {
          default: M(() => [
            d("span", Qo, [
              Ke(a.$slots, "handle"),
              b(r(Q), {
                icon: l.value ? "tabler:chevron-down" : "tabler:chevron-right"
              }, null, 8, ["icon"])
            ]),
            d("span", {
              class: "work-row-title",
              title: e.title
            }, I(e.title), 9, _o)
          ]),
          _: 3
        }, 8, ["class", "aria-expanded"]),
        d("span", ei, [
          e.code ? (c(), g("code", {
            key: 0,
            class: "work-mono",
            title: e.code
          }, I(e.code), 9, ti)) : D("", !0)
        ]),
        d("span", li, [
          e.kind ? (c(), B(r(Re), {
            key: 0,
            severity: "secondary",
            value: e.kind
          }, null, 8, ["value"])) : D("", !0)
        ]),
        d("span", ai, [
          Ke(a.$slots, "flags")
        ]),
        d("div", oi, [
          Ke(a.$slots, "usage")
        ]),
        d("div", ii, [
          Ke(a.$slots, "actions")
        ]),
        e.description ? (c(), g("p", ni, I(e.description), 1)) : D("", !0)
      ]),
      _e(d("div", si, [
        Ke(a.$slots, "default")
      ], 512), [
        [ct, l.value]
      ])
    ]));
  }
}), ri = { class: "work-definition-scroll" }, di = {
  key: 0,
  class: "work-definition-columns",
  "aria-hidden": "true"
}, ui = { key: 0 }, ci = { key: 1 }, vi = {
  key: 2,
  class: "work-definition-usage"
}, xl = /* @__PURE__ */ ue({
  __name: "DefinitionList",
  props: {
    count: {},
    columns: {}
  },
  setup(e) {
    return (l, t) => (c(), g("div", ri, [
      d("div", {
        class: pt(["work-field-builder", "work-definitions-" + e.columns])
      }, [
        e.count > 3 ? (c(), g("div", di, [
          t[0] || (t[0] = d("span", null, null, -1)),
          t[1] || (t[1] = d("span", null, "Name", -1)),
          e.columns !== "plugins" ? (c(), g("span", ui, "Identifier")) : D("", !0),
          d("span", null, I(e.columns === "plugins" ? "State" : e.columns === "types" ? "Process" : "Kind"), 1),
          e.columns === "fields" || e.columns === "plugins" ? (c(), g("span", ci, "Details")) : D("", !0),
          e.columns !== "plugins" ? (c(), g("span", vi, I(e.columns === "fields" ? "Used by" : "Details"), 1)) : D("", !0),
          t[2] || (t[2] = d("span", null, null, -1))
        ])) : D("", !0),
        Ke(l.$slots, "default")
      ], 2)
    ]));
  }
}), mi = [
  { code: "key", form: "text", index: "key" },
  { code: "type", form: "text", index: "key" },
  { code: "state", form: "text", index: "key" },
  { code: "category", form: "text", index: "key" },
  { code: "rank", form: "text", index: "key" },
  { code: "parent", form: "text", index: "key" },
  { code: "created_at", form: "time", index: "key" },
  { code: "updated_at", form: "time", index: "key" }
];
function fi(e) {
  const l = e.compiled.processes?.flatMap((t) => t.states.map((a) => ({ id: a.id, label: a.name }))) ?? [];
  return [...mi.filter((t) => t.code !== "rank").map((t) => t.code === "state" ? { ...t, type: "option", options: l } : t.code === "category" ? { ...t, type: "option", options: ["triage", "backlog", "unstarted", "started", "completed", "canceled"].map((a) => ({ id: a })) } : t), ...(e.compiled.fields ?? []).filter((t) => t.index && t.index !== "none")];
}
function pi(e) {
  if (e?.cardinality && e.cardinality !== "one") return ["has", "in", "nin", "is_null", ...e.type === "principal" ? ["member_of"] : []];
  const l = ["eq", "neq", "in", "nin", "is_null", ...e?.type === "principal" ? ["member_of"] : []];
  return e && (["int", "number", "dec", "time", "quantity"].includes(e.form ?? "") || e.index === "number") && l.push("lt", "lte", "gt", "gte", "between"), e?.form === "text" && e.type !== "option" && l.push("contains", "starts_with"), l;
}
const bi = { class: "work-field-control" }, hi = ["id"], yi = {
  key: 1,
  class: "work-stack work-tight"
}, gi = { class: "work-chips" }, ki = {
  key: 5,
  class: "work-row"
}, wi = ["inert"], Vi = ["value"], $i = {
  key: 1,
  class: "work-muted"
}, xi = ["inert"], Ci = ["value"], Si = {
  key: 1,
  class: "work-muted"
}, Ti = {
  key: 11,
  class: "work-stack work-tight"
}, Ui = {
  class: "work-stack work-tight",
  "aria-label": "Matching items"
}, Ei = { class: "work-mono" }, Di = {
  key: 15,
  class: "work-error work-small",
  role: "alert"
}, qa = /* @__PURE__ */ ue({
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
  setup(e, { emit: l }) {
    const t = e, a = l, o = Y(() => t.inputId ?? `field-${t.field.code}`), s = Y(() => !!t.field.cardinality && t.field.cardinality !== "one"), v = Y(() => Array.isArray(t.modelValue) ? t.modelValue : []), p = Y(() => t.modelValue == null ? "" : typeof t.modelValue == "object" ? It(t.modelValue) : String(t.modelValue)), f = Y(() => {
      const S = t.modelValue;
      return S && typeof S == "object" && "ref" in S && Array.isArray(S.ref) ? String(S.ref[1] ?? "") : "";
    }), i = Y(() => t.disabled || ca(t.field)), n = z(!1), u = z(!1), y = z(!1), m = z(""), w = z(""), C = z([]), A = ql(), U = z([]);
    let G = 0, F;
    const E = /* @__PURE__ */ new Set();
    xe(v, (S) => {
      U.value = F ?? S.map((k, q) => U.value[q] ?? G++), F = void 0;
    }, { immediate: !0 });
    function $(S) {
      a("update:modelValue", S);
    }
    function V(S, k) {
      const q = [...v.value];
      q[S] = k, $(q);
    }
    function T(S, k) {
      k ? E.delete(S) : E.add(S), a("validity", !E.size);
    }
    function ae(S) {
      E.delete(U.value[S]), a("validity", !E.size), F = U.value.filter((k, q) => q !== S), $(v.value.filter((k, q) => q !== S));
    }
    function L() {
      F = [...U.value, G++], $([...v.value, t.field.form === "bool" ? !1 : t.field.form === "record" ? {} : ""]);
    }
    function j(S) {
      const k = S.detail, q = k?.principal_id ?? k?.id;
      $(q ? { kind: k.type ?? "user", id: q } : void 0);
    }
    function R(S) {
      const k = S.detail;
      $(k?.thread_id ? { ref: ["component", k.thread_id] } : void 0);
    }
    const ne = z("");
    let x = "";
    xe(() => t.modelValue, (S) => {
      const k = JSON.stringify(S ?? {}, null, 2);
      k !== x && (x = k, ne.value = k, m.value = "", a("validity", !0));
    }, { immediate: !0 });
    function P(S) {
      ne.value = S;
      try {
        const k = JSON.parse(S);
        if (!k || typeof k != "object" || Array.isArray(k)) throw new Error("Enter a JSON object.");
        if (t.field.type === "rich_text" && !("type" in k && typeof k.type == "string")) throw new Error("The document needs a type.");
        x = JSON.stringify(k, null, 2), m.value = "", a("validity", !0), $(k);
      } catch (k) {
        m.value = k instanceof Error ? k.message : "Invalid JSON.", a("validity", !1);
      }
    }
    function O(S) {
      if (!S) {
        a("validity", !0), $(void 0);
        return;
      }
      const k = Number.isFinite(Number(S)) && (t.field.form !== "int" || Number.isSafeInteger(Number(S)));
      a("validity", k), k && $(t.field.form === "int" ? Number(S) : S);
    }
    const Z = Y(() => t.field.config?.format === "date");
    function ce(S) {
      $(S ? Z.value ? S : new Date(S).toISOString() : void 0);
    }
    const pe = Y(() => {
      if (typeof t.modelValue != "string") return "";
      if (Z.value) return t.modelValue.slice(0, 10);
      const S = new Date(t.modelValue);
      return Number.isNaN(S.getTime()) ? "" : new Date(S.getTime() - S.getTimezoneOffset() * 6e4).toISOString().slice(0, 16);
    });
    function ge(S) {
      $(S.detail?.ref);
    }
    function Ve(S) {
      $(S.detail?.value);
    }
    let De;
    xe(w, () => {
      const S = A();
      if (clearTimeout(De), !w.value.trim()) {
        C.value = [];
        return;
      }
      De = setTimeout(async () => {
        try {
          const k = w.value.trim(), q = /^[A-Z][A-Z0-9]{1,9}-[0-9]+$/.test(k) ? [(await xt.item(t.boardId, { key: k })).item] : (await xt.query(t.boardId, { where: { field: "title", op: "contains", value: k }, limit: 8 })).items;
          S() && (C.value = q, m.value = "");
        } catch (k) {
          S() && (m.value = We(k, "Could not search items."));
        }
      }, 200);
    });
    function h(S) {
      $({ board: t.boardId, item: S.id }), w.value = "", C.value = [];
    }
    wl(async () => {
      t.field.type === "principal" ? n.value = await lt("wc-principal-picker") : t.field.config?.target === "component" && (n.value = await lt("wc-component-picker"));
    });
    for (const [S, k] of [[() => t.editorTag, y], [() => t.linkTag, u]])
      xe(S, async (q, X, re) => {
        let fe = !0;
        if (re(() => {
          fe = !1;
        }), k.value = !1, q) {
          const Se = await lt(q);
          fe && (k.value = Se);
        }
      }, { immediate: !0 });
    return Pa(() => {
      clearTimeout(De), A();
    }), (S, k) => {
      const q = Ra("FieldControl", !0);
      return c(), g("div", bi, [
        r(ca)(e.field) ? (c(), g("output", {
          key: 0,
          id: o.value,
          class: "work-read-value"
        }, I(r(It)(e.modelValue, e.field)), 9, hi)) : s.value ? (c(), g("div", yi, [
          d("div", gi, [
            (c(!0), g(J, null, te(v.value, (X, re) => (c(), B(r(Re), {
              key: U.value[re],
              class: "kx-tag-sm",
              severity: "secondary"
            }, {
              default: M(() => [
                N(I(r(It)(X, e.field)) + " ", 1),
                b(r(H), {
                  type: "button",
                  class: "work-icon-button",
                  disabled: i.value,
                  "aria-label": "Remove value " + (re + 1),
                  onClick: (fe) => ae(re),
                  severity: "secondary",
                  text: "",
                  size: "small"
                }, {
                  default: M(() => [
                    b(r(Q), {
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
          (c(!0), g(J, null, te(v.value, (X, re) => (c(), g("div", {
            key: U.value[re],
            class: "work-stack work-tight"
          }, [
            b(q, {
              "board-id": e.boardId,
              field: { ...e.field, cardinality: "one" },
              "model-value": X,
              "input-id": o.value + "-" + U.value[re],
              disabled: i.value,
              "editor-tag": e.editorTag,
              "link-tag": e.linkTag,
              "onUpdate:modelValue": (fe) => V(re, fe),
              onValidity: (fe) => T(U.value[re], fe)
            }, null, 8, ["board-id", "field", "model-value", "input-id", "disabled", "editor-tag", "link-tag", "onUpdate:modelValue", "onValidity"])
          ]))), 128)),
          b(r(H), {
            label: "Add value",
            severity: "secondary",
            size: "small",
            disabled: i.value,
            onClick: L,
            outlined: ""
          }, {
            icon: M(() => [
              b(r(Q), {
                icon: "tabler:plus",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled"])
        ])) : e.editorTag && y.value ? (c(), B(Bl(e.editorTag), {
          key: 2,
          "board-id": e.boardId,
          value: JSON.stringify(e.modelValue ?? null),
          config: JSON.stringify(e.field.config ?? {}),
          readonly: i.value || void 0,
          onChange: Ve
        }, null, 40, ["board-id", "value", "config", "readonly"])) : e.linkTag && u.value ? (c(), B(Bl(e.linkTag), {
          key: 3,
          "board-id": e.boardId,
          kind: e.field.config?.target ?? e.field.type,
          value: JSON.stringify(e.modelValue ?? null),
          readonly: i.value || void 0,
          onChange: ge
        }, null, 40, ["board-id", "kind", "value", "readonly"])) : e.field.type === "option" ? (c(), B(r(le), {
          key: 4,
          placeholder: "Not set",
          inputId: o.value,
          "model-value": e.modelValue ?? "",
          disabled: i.value,
          "onUpdate:modelValue": k[0] || (k[0] = (X) => $(X || void 0)),
          appendTo: "self",
          optionLabel: "label",
          optionValue: "value",
          optionDisabled: "disabled",
          options: [{ label: "Not set", value: "", disabled: !1 }, ...(e.field.options ?? []).map((X) => ({ label: X.label ?? X.id, value: X.id, disabled: !1 }))]
        }, null, 8, ["inputId", "model-value", "disabled", "options"])) : e.field.form === "bool" ? (c(), g("label", ki, [
          b(r(Ft), {
            inputId: o.value,
            "model-value": e.modelValue === !0,
            disabled: i.value,
            "onUpdate:modelValue": k[1] || (k[1] = (X) => $(X)),
            binary: ""
          }, null, 8, ["inputId", "model-value", "disabled"]),
          N(I(e.modelValue === !0 ? "Yes" : e.modelValue === !1 ? "No" : "Not set"), 1)
        ])) : e.field.form === "int" ? (c(), B(r(Ye), {
          key: 6,
          inputId: o.value,
          "model-value": p.value === "" ? null : Number(p.value),
          disabled: i.value,
          "onUpdate:modelValue": k[2] || (k[2] = (X) => O(X == null ? "" : String(X))),
          useGrouping: !1
        }, null, 8, ["inputId", "model-value", "disabled"])) : e.field.form === "dec" ? (c(), B(r(de), {
          key: 7,
          id: o.value,
          inputmode: "decimal",
          "model-value": p.value,
          disabled: i.value,
          "onUpdate:modelValue": k[3] || (k[3] = (X) => O(X ?? ""))
        }, null, 8, ["id", "model-value", "disabled"])) : e.field.form === "time" ? (c(), B(r(de), {
          key: 8,
          id: o.value,
          type: Z.value ? "date" : "datetime-local",
          value: pe.value,
          disabled: i.value,
          onInput: k[4] || (k[4] = (X) => ce(X.target.value))
        }, null, 8, ["id", "type", "value", "disabled"])) : e.field.type === "principal" ? (c(), g("div", {
          key: 9,
          inert: i.value || void 0,
          class: "work-stack work-tight"
        }, [
          n.value ? (c(), g("wc-principal-picker", {
            key: 0,
            value: JSON.stringify(e.modelValue ?? {}),
            kinds: "user,group",
            onConfigChanged: j
          }, null, 40, Vi)) : (c(), g("span", $i, I(r(It)(e.modelValue, e.field)) + " · Person picker is unavailable.", 1))
        ], 8, wi)) : e.field.config?.target === "component" ? (c(), g("div", {
          key: 10,
          inert: i.value || void 0
        }, [
          n.value ? (c(), g("wc-component-picker", {
            key: 0,
            value: JSON.stringify({ thread_id: f.value }),
            onChange: R
          }, null, 40, Ci)) : (c(), g("span", Si, "Component picker is unavailable."))
        ], 8, xi)) : e.field.type === "item" ? (c(), g("div", Ti, [
          b(r(Re), {
            class: "kx-tag-sm",
            severity: "secondary"
          }, {
            default: M(() => [
              N(I(r(It)(e.modelValue, e.field)), 1)
            ]),
            _: 1
          }),
          b(r(de), {
            id: o.value,
            modelValue: w.value,
            "onUpdate:modelValue": k[5] || (k[5] = (X) => w.value = X),
            disabled: i.value,
            placeholder: "Search a title or enter an item key",
            "aria-label": "Search items"
          }, null, 8, ["id", "modelValue", "disabled"]),
          d("div", Ui, [
            (c(!0), g(J, null, te(C.value, (X) => (c(), B(Ql, {
              key: X.id,
              class: "work-match-item",
              disabled: i.value,
              onActivate: (re) => h(X)
            }, {
              default: M(() => [
                d("code", Ei, I(X.key), 1),
                d("span", null, I(r(It)(X.values.title)), 1)
              ]),
              _: 2
            }, 1032, ["disabled", "onActivate"]))), 128))
          ]),
          e.modelValue ? (c(), B(r(H), {
            key: 0,
            label: "Clear reference",
            severity: "secondary",
            size: "small",
            disabled: i.value,
            onClick: k[6] || (k[6] = (X) => $(void 0)),
            outlined: ""
          }, {
            icon: M(() => [
              b(r(Q), {
                icon: "tabler:list-check",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled"])) : D("", !0)
        ])) : e.field.form === "record" || e.field.type === "rich_text" || e.field.form === "quantity" || e.field.form === "ref" ? (c(), B(r(fl), {
          key: 12,
          id: o.value,
          "model-value": ne.value,
          rows: "3",
          disabled: i.value,
          "aria-invalid": !!m.value,
          "onUpdate:modelValue": k[7] || (k[7] = (X) => P(X ?? ""))
        }, null, 8, ["id", "model-value", "disabled", "aria-invalid"])) : e.field.code === "description" ? (c(), B(r(fl), {
          key: 13,
          id: o.value,
          "model-value": p.value,
          rows: "4",
          disabled: i.value,
          "onUpdate:modelValue": k[8] || (k[8] = (X) => $(X))
        }, null, 8, ["id", "model-value", "disabled"])) : (c(), B(r(de), {
          key: 14,
          id: o.value,
          "model-value": p.value,
          disabled: i.value,
          "onUpdate:modelValue": k[9] || (k[9] = (X) => $(X))
        }, null, 8, ["id", "model-value", "disabled"])),
        m.value ? (c(), g("span", Di, I(m.value), 1)) : D("", !0)
      ]);
    };
  }
}), Ii = { class: "work-stack work-tight work-operand-control" }, Ai = { class: "work-row work-small" }, Pi = {
  key: 1,
  class: "work-muted work-small"
}, Ri = {
  key: 2,
  class: "work-stack work-tight"
}, Oi = { class: "work-small" }, Ni = {
  key: 0,
  class: "work-error work-small",
  role: "alert"
}, Wt = /* @__PURE__ */ ue({
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
  setup(e, { emit: l }) {
    const t = e, a = l, o = Y(() => "$actor" in Ge(t.modelValue) ? "actor" : "$now" in Ge(t.modelValue) ? "now" : "literal"), s = z(""), v = z("");
    xe(() => t.modelValue, (i) => {
      s.value = JSON.stringify(i ?? []), v.value = "";
    }, { immediate: !0 });
    function p(i) {
      a("update:modelValue", i === "actor" ? { $actor: "id" } : i === "now" ? { $now: "P0D" } : void 0), a("validity", !0);
    }
    function f(i) {
      s.value = i;
      try {
        const n = JSON.parse(i);
        if (!Array.isArray(n)) throw new Error("Enter a JSON list.");
        v.value = "", a("validity", !0), a("update:modelValue", n);
      } catch (n) {
        v.value = n instanceof Error ? n.message : "Invalid values.", a("validity", !1);
      }
    }
    return (i, n) => (c(), g("div", Ii, [
      d("label", Ai, [
        N(I(e.label), 1),
        b(r(le), {
          "aria-label": e.label + " operand",
          "model-value": o.value,
          disabled: e.disabled,
          "onUpdate:modelValue": n[0] || (n[0] = (u) => p(u)),
          appendTo: "self",
          optionLabel: "label",
          optionValue: "value",
          optionDisabled: "disabled",
          options: [{ label: "Value", value: "literal", disabled: !1 }, { label: "Current actor ($actor)", value: "actor", disabled: !1 }, { label: "Current time ($now)", value: "now", disabled: !1 }]
        }, null, 8, ["aria-label", "model-value", "disabled"])
      ]),
      o.value === "now" ? (c(), B(r(de), {
        key: 0,
        "aria-label": e.label + " time offset",
        value: r(Ge)(e.modelValue).$now,
        disabled: e.disabled,
        placeholder: "-P7D",
        onInput: n[1] || (n[1] = (u) => a("update:modelValue", { $now: u.target.value }))
      }, null, 8, ["aria-label", "value", "disabled"])) : o.value === "actor" ? (c(), g("span", Pi, "The signed-in actor’s id")) : e.multiple ? (c(), g("div", Ri, [
        d("label", Oi, [
          n[5] || (n[5] = N("Values as JSON (operands may appear in the list)", -1)),
          b(r(fl), {
            class: "work-mono",
            "aria-label": e.label + " values",
            value: s.value,
            disabled: e.disabled,
            rows: "2",
            onInput: n[2] || (n[2] = (u) => f(u.target.value))
          }, null, 8, ["aria-label", "value", "disabled"])
        ]),
        v.value ? (c(), g("p", Ni, I(v.value), 1)) : D("", !0)
      ])) : (c(), B(qa, {
        key: 3,
        "board-id": e.boardId,
        field: { ...e.field, cardinality: "one" },
        "model-value": e.modelValue,
        disabled: e.disabled,
        "input-id": e.label.replace(/[^a-z0-9]/gi, "-"),
        "onUpdate:modelValue": n[3] || (n[3] = (u) => a("update:modelValue", u)),
        onValidity: n[4] || (n[4] = (u) => a("validity", u))
      }, null, 8, ["board-id", "field", "model-value", "disabled", "input-id"]))
    ]));
  }
}), Mi = ["disabled"], Fi = { class: "work-small work-mono" }, Li = { class: "work-row work-small" }, zi = { class: "work-row work-wrap" }, Bi = { key: 3 }, ji = { class: "work-row work-wrap" }, qi = { class: "work-row" }, Wi = { class: "work-row" }, Ki = { class: "work-row" }, Gi = {
  key: 3,
  class: "work-row work-wrap"
}, Yi = { class: "work-row work-wrap" }, Hi = /* @__PURE__ */ ue({
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
  setup(e, { emit: l }) {
    const t = e, a = l, o = Y(() => t.path ?? "where"), s = Y(() => t.depth ?? 1), v = Y(() => ["and", "or", "not", "history", "match", "rel", "children"].find((j) => j in t.modelValue) ?? "field"), p = Y(() => fi(t.schema)), f = Y(() => p.value.find((j) => j.code === t.modelValue.field) ?? { code: "value", form: "text" }), i = Y(() => Ge(t.modelValue.history)), n = Y(() => p.value.find((j) => j.code === i.value.field) ?? { code: "history", form: "text" }), u = Y(() => Array.isArray(t.modelValue[v.value]) ? t.modelValue[v.value] : []), y = () => ({ field: "category", op: "eq", value: "unstarted" }), m = z(/* @__PURE__ */ new Set());
    function w(j, R) {
      R ? m.value.delete(j) : m.value.add(j), a("validity", m.value.size === 0);
    }
    xe(v, () => {
      m.value.clear(), a("validity", !0);
    });
    function C(j) {
      const R = /* @__PURE__ */ new Set();
      for (const ne of m.value) {
        const x = Number(ne);
        !Number.isNaN(x) && x !== j && R.add(String(x > j ? x - 1 : x));
      }
      m.value = R, a("validity", R.size === 0), U({ [v.value]: u.value.filter((ne, x) => x !== j) });
    }
    function A(j) {
      a("update:modelValue", j);
    }
    function U(j) {
      A({ ...t.modelValue, ...j });
    }
    function G(j) {
      A(j === "field" ? y() : j === "and" || j === "or" ? { [j]: [y()] } : j === "not" ? { not: y() } : j === "history" ? { history: { field: "state", changed: !0 } } : j === "match" ? { match: "" } : j === "children" ? { children: !0, q: "some", where: y() } : { rel: t.schema.compiled.relation_types?.[0]?.id ?? "", dir: "outward", q: "some", where: y() });
    }
    function F(j, R) {
      U({ [v.value]: u.value.map((ne, x) => x === j ? R : ne) });
    }
    function E(j, R) {
      const ne = { ...i.value };
      R === void 0 ? (delete ne[j], w(j, !0)) : ne[j] = R, U({ history: ne });
    }
    function $(j) {
      m.value.clear(), a("validity", !0);
      const R = { ...i.value };
      delete R.was, delete R.changed, delete R.from, delete R.to, R[j] = j === "changed" ? !0 : "", U({ history: R });
    }
    const V = { code: "actor", form: "text" }, T = { code: "at", form: "time" }, ae = Y(() => Array.isArray(i.value.during) ? i.value.during : []);
    function L(j, R) {
      const ne = [...ae.value];
      ne[j] = R, E("during", ne);
    }
    return (j, R) => {
      const ne = Ra("FilterNode", !0);
      return c(), g("fieldset", {
        class: "work-filter-node",
        disabled: e.disabled
      }, [
        d("legend", Fi, I(o.value), 1),
        d("label", Li, [
          R[21] || (R[21] = N("Condition", -1)),
          b(r(le), {
            "aria-label": o.value + " condition",
            "model-value": v.value,
            "onUpdate:modelValue": R[0] || (R[0] = (x) => G(x)),
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            optionDisabled: "disabled",
            options: [{ label: "Field", value: "field", disabled: !1 }, ...["and", "or", "not", "history", "rel", "children", "match"].map((x) => ({ label: x, value: x, disabled: s.value >= 6 && ["and", "or", "not", "rel", "children"].includes(x) }))]
          }, null, 8, ["aria-label", "model-value", "options"])
        ]),
        v.value === "and" || v.value === "or" ? (c(), g(J, { key: 0 }, [
          (c(!0), g(J, null, te(u.value, (x, P) => (c(), g("div", {
            key: P,
            class: "work-stack work-tight"
          }, [
            b(ne, {
              "board-id": e.boardId,
              schema: e.schema,
              "model-value": x,
              path: o.value + "." + v.value + "[" + P + "]",
              depth: s.value + 1,
              "onUpdate:modelValue": (O) => F(P, O),
              onValidity: (O) => w(String(P), O)
            }, null, 8, ["board-id", "schema", "model-value", "path", "depth", "onUpdate:modelValue", "onValidity"]),
            b(r(H), {
              label: "Remove condition",
              size: "small",
              severity: "secondary",
              onClick: (O) => C(P),
              outlined: ""
            }, {
              icon: M(() => [
                b(r(Q), {
                  icon: "tabler:trash",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["onClick"])
          ]))), 128)),
          b(r(H), {
            label: "Add condition",
            size: "small",
            severity: "secondary",
            disabled: s.value >= 6,
            onClick: R[1] || (R[1] = (x) => U({ [v.value]: [...u.value, y()] })),
            outlined: ""
          }, {
            icon: M(() => [
              b(r(Q), {
                icon: "tabler:plus",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled"])
        ], 64)) : v.value === "not" ? (c(), B(ne, {
          key: 1,
          "board-id": e.boardId,
          schema: e.schema,
          "model-value": r(Ge)(e.modelValue.not),
          path: o.value + ".not",
          depth: s.value + 1,
          "onUpdate:modelValue": R[2] || (R[2] = (x) => U({ not: x })),
          onValidity: R[3] || (R[3] = (x) => w("nested", x))
        }, null, 8, ["board-id", "schema", "model-value", "path", "depth"])) : v.value === "field" ? (c(), g(J, { key: 2 }, [
          d("div", zi, [
            d("label", null, [
              R[22] || (R[22] = N("Field", -1)),
              b(r(le), {
                "aria-label": o.value + " field",
                "model-value": e.modelValue.field,
                "onUpdate:modelValue": R[4] || (R[4] = (x) => U({ field: x, op: "eq", value: void 0 })),
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                optionDisabled: "disabled",
                options: [...(p.value ?? []).map((x) => ({ label: r(St)(x), value: x.code, disabled: !1 }))]
              }, null, 8, ["aria-label", "model-value", "options"])
            ]),
            d("label", null, [
              R[23] || (R[23] = N("Operator", -1)),
              b(r(le), {
                "aria-label": o.value + " operator",
                "model-value": e.modelValue.op,
                "onUpdate:modelValue": R[5] || (R[5] = (x) => U({ op: x, value: x === "is_null" ? !0 : void 0 })),
                appendTo: "self",
                options: r(pi)(f.value)
              }, null, 8, ["aria-label", "model-value", "options"])
            ])
          ]),
          b(Wt, {
            "board-id": e.boardId,
            field: e.modelValue.op === "is_null" ? { code: "null", form: "bool" } : f.value,
            "model-value": e.modelValue.value,
            multiple: ["in", "nin", "between"].includes(String(e.modelValue.op)),
            label: o.value + " value",
            "onUpdate:modelValue": R[6] || (R[6] = (x) => U({ value: x })),
            onValidity: R[7] || (R[7] = (x) => w("value", x))
          }, null, 8, ["board-id", "field", "model-value", "multiple", "label"])
        ], 64)) : v.value === "match" ? (c(), g("label", Bi, [
          R[24] || (R[24] = N("Search", -1)),
          b(r(de), {
            "aria-label": o.value + " search",
            value: e.modelValue.match,
            onInput: R[8] || (R[8] = (x) => U({ match: x.target.value }))
          }, null, 8, ["aria-label", "value"])
        ])) : v.value === "history" ? (c(), g(J, { key: 4 }, [
          d("div", ji, [
            d("label", null, [
              R[25] || (R[25] = N("Field", -1)),
              b(r(le), {
                "aria-label": o.value + " history field",
                "model-value": i.value.field,
                "onUpdate:modelValue": R[9] || (R[9] = (x) => E("field", x)),
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                optionDisabled: "disabled",
                options: [...(p.value ?? []).map((x) => ({ label: r(St)(x), value: x.code, disabled: !1 }))]
              }, null, 8, ["aria-label", "model-value", "options"])
            ]),
            d("label", null, [
              R[26] || (R[26] = N("History", -1)),
              b(r(le), {
                "aria-label": o.value + " history mode",
                "model-value": i.value.changed ? "changed" : "was",
                "onUpdate:modelValue": R[10] || (R[10] = (x) => $(x)),
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                optionDisabled: "disabled",
                options: [{ label: "Changed", value: "changed", disabled: !1 }, { label: "Was", value: "was", disabled: !1 }]
              }, null, 8, ["aria-label", "model-value"])
            ])
          ]),
          i.value.changed ? (c(), g(J, { key: 0 }, te(["from", "to"], (x) => d("div", { key: x }, [
            d("label", qi, [
              b(r(Ft), {
                "model-value": x in i.value,
                "aria-label": "Constrain " + x,
                "onUpdate:modelValue": (P) => E(x, P ? "" : void 0),
                binary: ""
              }, null, 8, ["model-value", "aria-label", "onUpdate:modelValue"]),
              N(I(x), 1)
            ]),
            x in i.value ? (c(), B(Wt, {
              key: 0,
              "board-id": e.boardId,
              field: n.value,
              "model-value": i.value[x],
              label: o.value + " history " + x,
              "onUpdate:modelValue": (P) => E(x, P),
              onValidity: (P) => w(x, P)
            }, null, 8, ["board-id", "field", "model-value", "label", "onUpdate:modelValue", "onValidity"])) : D("", !0)
          ])), 64)) : (c(), B(Wt, {
            key: 1,
            "board-id": e.boardId,
            field: n.value,
            "model-value": i.value.was,
            label: o.value + " history was",
            "onUpdate:modelValue": R[11] || (R[11] = (x) => E("was", x)),
            onValidity: R[12] || (R[12] = (x) => w("was", x))
          }, null, 8, ["board-id", "field", "model-value", "label"])),
          d("label", Wi, [
            b(r(Ft), {
              "model-value": "by" in i.value,
              "aria-label": "Constrain actor",
              "onUpdate:modelValue": R[13] || (R[13] = (x) => E("by", x ? { $actor: "id" } : void 0)),
              binary: ""
            }, null, 8, ["model-value"]),
            R[27] || (R[27] = N("By actor", -1))
          ]),
          "by" in i.value ? (c(), B(Wt, {
            key: 2,
            "board-id": e.boardId,
            field: V,
            "model-value": i.value.by,
            label: o.value + " history by",
            "onUpdate:modelValue": R[14] || (R[14] = (x) => E("by", x))
          }, null, 8, ["board-id", "model-value", "label"])) : D("", !0),
          d("label", Ki, [
            b(r(Ft), {
              "model-value": "during" in i.value,
              "aria-label": "Constrain time window",
              "onUpdate:modelValue": R[15] || (R[15] = (x) => E("during", x ? [{ $now: "-P30D" }, { $now: "P0D" }] : void 0)),
              binary: ""
            }, null, 8, ["model-value"]),
            R[28] || (R[28] = N("During", -1))
          ]),
          "during" in i.value ? (c(), g("div", Gi, [
            (c(), g(J, null, te(["start", "end"], (x, P) => b(Wt, {
              key: x,
              "board-id": e.boardId,
              field: T,
              "model-value": ae.value[P],
              label: o.value + " during " + x,
              "onUpdate:modelValue": (O) => L(P, O)
            }, null, 8, ["board-id", "model-value", "label", "onUpdate:modelValue"])), 64))
          ])) : D("", !0)
        ], 64)) : (c(), g(J, { key: 5 }, [
          d("div", Yi, [
            v.value === "rel" ? (c(), g(J, { key: 0 }, [
              d("label", null, [
                R[29] || (R[29] = N("Relation", -1)),
                b(r(le), {
                  "model-value": e.modelValue.rel,
                  "onUpdate:modelValue": R[16] || (R[16] = (x) => U({ rel: x })),
                  appendTo: "self",
                  optionLabel: "label",
                  optionValue: "value",
                  optionDisabled: "disabled",
                  options: [...(e.schema.compiled.relation_types ?? []).map((x) => ({ label: x.outward ?? x.id, value: x.id, disabled: !1 }))]
                }, null, 8, ["model-value", "options"])
              ]),
              d("label", null, [
                R[30] || (R[30] = N("Direction", -1)),
                b(r(le), {
                  "model-value": e.modelValue.dir,
                  "onUpdate:modelValue": R[17] || (R[17] = (x) => U({ dir: x })),
                  appendTo: "self",
                  optionLabel: "label",
                  optionValue: "value",
                  optionDisabled: "disabled",
                  options: [{ label: "Outward", value: "outward", disabled: !1 }, { label: "Inward", value: "inward", disabled: !1 }]
                }, null, 8, ["model-value"])
              ])
            ], 64)) : D("", !0),
            d("label", null, [
              R[31] || (R[31] = N("Quantifier", -1)),
              b(r(le), {
                "model-value": e.modelValue.q,
                "onUpdate:modelValue": R[18] || (R[18] = (x) => U({ q: x })),
                appendTo: "self",
                options: ["some", "every", "none"]
              }, null, 8, ["model-value"])
            ])
          ]),
          b(ne, {
            "board-id": e.boardId,
            schema: e.schema,
            "model-value": r(Ge)(e.modelValue.where),
            path: o.value + ".where",
            depth: s.value + 1,
            "onUpdate:modelValue": R[19] || (R[19] = (x) => U({ where: x })),
            onValidity: R[20] || (R[20] = (x) => w("nested", x))
          }, null, 8, ["board-id", "schema", "model-value", "path", "depth"])
        ], 64))
      ], 8, Mi);
    };
  }
}), Xi = { class: "work-stack work-tight" }, Ji = { class: "work-row work-small" }, ta = /* @__PURE__ */ ue({
  __name: "ConditionEditor",
  props: {
    modelValue: {},
    draft: {},
    boardId: {},
    label: {}
  },
  emits: ["update:modelValue", "validity"],
  setup(e, { emit: l }) {
    const t = e, a = l, o = Y(() => ({ declaration: t.draft, compiled: t.draft, generation: 0, as_of: 0, key_prefix: "" })), s = /* @__PURE__ */ new Set();
    function v(f, i) {
      i ? s.delete(f) : s.add(f), a("validity", !s.size);
    }
    function p(f) {
      a("update:modelValue", f ? { field: t.draft.fields?.[0]?.code ?? "state", op: "eq" } : void 0), f || (s.clear(), a("validity", !0));
    }
    return nt(() => a("validity", !0)), (f, i) => (c(), g("section", Xi, [
      d("label", Ji, [
        b(r(Le), {
          "model-value": e.modelValue != null,
          "aria-label": e.label,
          "onUpdate:modelValue": p
        }, null, 8, ["model-value", "aria-label"]),
        N(I(e.label), 1)
      ]),
      e.modelValue != null ? (c(), B(Hi, {
        key: 0,
        schema: o.value,
        "board-id": e.boardId ?? "",
        "model-value": r(Ge)(e.modelValue),
        path: e.label,
        "onUpdate:modelValue": i[0] || (i[0] = (n) => a("update:modelValue", n)),
        onValidity: i[1] || (i[1] = (n) => v("structured", n))
      }, null, 8, ["schema", "board-id", "model-value", "path"])) : D("", !0),
      e.modelValue != null ? (c(), B(ot, {
        key: 1,
        label: e.label + " predicate",
        "model-value": e.modelValue,
        hint: "Use any predicate accepted by Work, including installed or deeply nested forms.",
        "onUpdate:modelValue": i[2] || (i[2] = (n) => a("update:modelValue", n)),
        onValidity: i[3] || (i[3] = (n) => v("raw", n))
      }, null, 8, ["label", "model-value"])) : D("", !0)
    ]));
  }
}), Zi = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, Qi = ["aria-label"], _i = { class: "work-field-label" }, en = {
  key: 0,
  class: "work-chips"
}, tn = ["kinds"], ln = {
  key: 2,
  class: "work-muted work-small"
}, la = /* @__PURE__ */ ue({
  __name: "PrincipalsPicker",
  props: {
    modelValue: {},
    label: {},
    kinds: {},
    boardId: {}
  },
  emits: ["update:modelValue"],
  setup(e, { emit: l }) {
    const t = e, a = l, o = z(!1), s = z(0), v = Y(() => t.modelValue ?? []), { principalLabel: p, rememberPrincipal: f, nameError: i } = Na(() => t.boardId ?? "", () => v.value);
    wl(async () => {
      o.value = await lt("wc-principal-picker");
    });
    function n(u) {
      const y = u.detail, m = y?.principal_id ?? y?.id;
      if (!m) return;
      const w = { kind: y.type ?? "user", id: m };
      y.label && f(w, y.label), v.value.some((C) => C.id === m && C.kind === w.kind) || a("update:modelValue", [...v.value, w]), s.value++;
    }
    return (u, y) => (c(), g(J, null, [
      r(i) ? (c(), g("p", Zi, I(r(i)), 1)) : D("", !0),
      d("section", {
        class: "work-stack work-tight work-principals-picker",
        "aria-label": e.label
      }, [
        d("h4", _i, I(e.label), 1),
        v.value.length ? (c(), g("div", en, [
          (c(!0), g(J, null, te(v.value, (m, w) => (c(), B(r(Re), {
            key: m.kind + m.id,
            severity: "secondary",
            class: "kx-tag-sm"
          }, {
            default: M(() => [
              N(I(r(p)(m)), 1),
              b(r(H), {
                text: "",
                severity: "secondary",
                size: "small",
                "aria-label": "Remove " + r(p)(m),
                onClick: (C) => a("update:modelValue", v.value.filter((A, U) => U !== w))
              }, {
                default: M(() => [
                  b(r(Q), { icon: "tabler:x" })
                ]),
                _: 1
              }, 8, ["aria-label", "onClick"])
            ]),
            _: 2
          }, 1024))), 128))
        ])) : D("", !0),
        o.value ? (c(), g("wc-principal-picker", {
          key: s.value,
          kinds: e.kinds ?? "user,group",
          onConfigChanged: n
        }, null, 40, tn)) : (c(), g("p", ln, "People and group picker is unavailable."))
      ], 8, Qi)
    ], 64));
  }
}), an = { class: "work-stack work-tight" }, Wa = /* @__PURE__ */ ue({
  __name: "HoldersPicker",
  props: {
    modelValue: {},
    label: {},
    boardId: {}
  },
  emits: ["update:modelValue", "validity"],
  setup(e, { emit: l }) {
    const t = e, a = l, o = Y(() => (t.modelValue ?? []).flatMap((v) => "user" in v ? [{ kind: "user", id: v.user }] : "group" in v ? [{ kind: "group", id: v.group }] : []));
    function s(v) {
      const p = [...(t.modelValue ?? []).filter((f) => "field" in f || "service" in f), ...v.map((f) => f.kind === "group" ? { group: f.id } : { user: f.id })];
      a("update:modelValue", p.length ? p : void 0);
    }
    return (v, p) => (c(), g("div", an, [
      b(la, {
        "board-id": e.boardId,
        label: e.label,
        "model-value": o.value,
        "onUpdate:modelValue": s
      }, null, 8, ["board-id", "label", "model-value"]),
      b(ot, {
        label: e.label + " rules",
        "model-value": e.modelValue,
        shape: "array",
        example: [{ group: "selected-group" }],
        "onUpdate:modelValue": p[0] || (p[0] = (f) => a("update:modelValue", f)),
        onValidity: p[1] || (p[1] = (f) => a("validity", f))
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
function on(e, l, t) {
  return (l = dn(l)) in e ? Object.defineProperty(e, l, {
    value: t,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : e[l] = t, e;
}
function it() {
  return it = Object.assign ? Object.assign.bind() : function(e) {
    for (var l = 1; l < arguments.length; l++) {
      var t = arguments[l];
      for (var a in t) ({}).hasOwnProperty.call(t, a) && (e[a] = t[a]);
    }
    return e;
  }, it.apply(null, arguments);
}
function ha(e, l) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var a = Object.getOwnPropertySymbols(e);
    l && (a = a.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), t.push.apply(t, a);
  }
  return t;
}
function tt(e) {
  for (var l = 1; l < arguments.length; l++) {
    var t = arguments[l] != null ? arguments[l] : {};
    l % 2 ? ha(Object(t), !0).forEach(function(a) {
      on(e, a, t[a]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ha(Object(t)).forEach(function(a) {
      Object.defineProperty(e, a, Object.getOwnPropertyDescriptor(t, a));
    });
  }
  return e;
}
function nn(e, l) {
  if (e == null) return {};
  var t, a, o = sn(e, l);
  if (Object.getOwnPropertySymbols) {
    var s = Object.getOwnPropertySymbols(e);
    for (a = 0; a < s.length; a++) t = s[a], l.indexOf(t) === -1 && {}.propertyIsEnumerable.call(e, t) && (o[t] = e[t]);
  }
  return o;
}
function sn(e, l) {
  if (e == null) return {};
  var t = {};
  for (var a in e) if ({}.hasOwnProperty.call(e, a)) {
    if (l.indexOf(a) !== -1) continue;
    t[a] = e[a];
  }
  return t;
}
function rn(e, l) {
  if (typeof e != "object" || !e) return e;
  var t = e[Symbol.toPrimitive];
  if (t !== void 0) {
    var a = t.call(e, l);
    if (typeof a != "object") return a;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (l === "string" ? String : Number)(e);
}
function dn(e) {
  var l = rn(e, "string");
  return typeof l == "symbol" ? l : l + "";
}
function Kl(e) {
  "@babel/helpers - typeof";
  return Kl = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(l) {
    return typeof l;
  } : function(l) {
    return l && typeof Symbol == "function" && l.constructor === Symbol && l !== Symbol.prototype ? "symbol" : typeof l;
  }, Kl(e);
}
var un = "1.15.7";
function at(e) {
  if (typeof window < "u" && window.navigator)
    return !!/* @__PURE__ */ navigator.userAgent.match(e);
}
var st = at(/(?:Trident.*rv[ :]?11\.|msie|iemobile|Windows Phone)/i), tl = at(/Edge/i), ya = at(/firefox/i), Xt = at(/safari/i) && !at(/chrome/i) && !at(/android/i), aa = at(/iP(ad|od|hone)/i), Ka = at(/chrome/i) && at(/android/i), Ga = {
  capture: !1,
  passive: !1
};
function me(e, l, t) {
  e.addEventListener(l, t, !st && Ga);
}
function ve(e, l, t) {
  e.removeEventListener(l, t, !st && Ga);
}
function pl(e, l) {
  if (l) {
    if (l[0] === ">" && (l = l.substring(1)), e)
      try {
        if (e.matches)
          return e.matches(l);
        if (e.msMatchesSelector)
          return e.msMatchesSelector(l);
        if (e.webkitMatchesSelector)
          return e.webkitMatchesSelector(l);
      } catch {
        return !1;
      }
    return !1;
  }
}
function Ya(e) {
  return e.host && e !== document && e.host.nodeType && e.host !== e ? e.host : e.parentNode;
}
function Je(e, l, t, a) {
  if (e) {
    t = t || document;
    do {
      if (l != null && (l[0] === ">" ? e.parentNode === t && pl(e, l) : pl(e, l)) || a && e === t)
        return e;
      if (e === t) break;
    } while (e = Ya(e));
  }
  return null;
}
var ga = /\s+/g;
function ze(e, l, t) {
  if (e && l)
    if (e.classList)
      e.classList[t ? "add" : "remove"](l);
    else {
      var a = (" " + e.className + " ").replace(ga, " ").replace(" " + l + " ", " ");
      e.className = (a + (t ? " " + l : "")).replace(ga, " ");
    }
}
function oe(e, l, t) {
  var a = e && e.style;
  if (a) {
    if (t === void 0)
      return document.defaultView && document.defaultView.getComputedStyle ? t = document.defaultView.getComputedStyle(e, "") : e.currentStyle && (t = e.currentStyle), l === void 0 ? t : t[l];
    !(l in a) && l.indexOf("webkit") === -1 && (l = "-webkit-" + l), a[l] = t + (typeof t == "string" ? "" : "px");
  }
}
function Lt(e, l) {
  var t = "";
  if (typeof e == "string")
    t = e;
  else
    do {
      var a = oe(e, "transform");
      a && a !== "none" && (t = a + " " + t);
    } while (!l && (e = e.parentNode));
  var o = window.DOMMatrix || window.WebKitCSSMatrix || window.CSSMatrix || window.MSCSSMatrix;
  return o && new o(t);
}
function Ha(e, l, t) {
  if (e) {
    var a = e.getElementsByTagName(l), o = 0, s = a.length;
    if (t)
      for (; o < s; o++)
        t(a[o], o);
    return a;
  }
  return [];
}
function et() {
  var e = document.scrollingElement;
  return e || document.documentElement;
}
function Ee(e, l, t, a, o) {
  if (!(!e.getBoundingClientRect && e !== window)) {
    var s, v, p, f, i, n, u;
    if (e !== window && e.parentNode && e !== et() ? (s = e.getBoundingClientRect(), v = s.top, p = s.left, f = s.bottom, i = s.right, n = s.height, u = s.width) : (v = 0, p = 0, f = window.innerHeight, i = window.innerWidth, n = window.innerHeight, u = window.innerWidth), (l || t) && e !== window && (o = o || e.parentNode, !st))
      do
        if (o && o.getBoundingClientRect && (oe(o, "transform") !== "none" || t && oe(o, "position") !== "static")) {
          var y = o.getBoundingClientRect();
          v -= y.top + parseInt(oe(o, "border-top-width")), p -= y.left + parseInt(oe(o, "border-left-width")), f = v + s.height, i = p + s.width;
          break;
        }
      while (o = o.parentNode);
    if (a && e !== window) {
      var m = Lt(o || e), w = m && m.a, C = m && m.d;
      m && (v /= C, p /= w, u /= w, n /= C, f = v + n, i = p + u);
    }
    return {
      top: v,
      left: p,
      bottom: f,
      right: i,
      width: u,
      height: n
    };
  }
}
function ka(e, l, t) {
  for (var a = ft(e, !0), o = Ee(e)[l]; a; ) {
    var s = Ee(a)[t], v = void 0;
    if (v = o >= s, !v) return a;
    if (a === et()) break;
    a = ft(a, !1);
  }
  return !1;
}
function Bt(e, l, t, a) {
  for (var o = 0, s = 0, v = e.children; s < v.length; ) {
    if (v[s].style.display !== "none" && v[s] !== ie.ghost && (a || v[s] !== ie.dragged) && Je(v[s], t.draggable, e, !1)) {
      if (o === l)
        return v[s];
      o++;
    }
    s++;
  }
  return null;
}
function oa(e, l) {
  for (var t = e.lastElementChild; t && (t === ie.ghost || oe(t, "display") === "none" || l && !pl(t, l)); )
    t = t.previousElementSibling;
  return t || null;
}
function qe(e, l) {
  var t = 0;
  if (!e || !e.parentNode)
    return -1;
  for (; e = e.previousElementSibling; )
    e.nodeName.toUpperCase() !== "TEMPLATE" && e !== ie.clone && (!l || pl(e, l)) && t++;
  return t;
}
function wa(e) {
  var l = 0, t = 0, a = et();
  if (e)
    do {
      var o = Lt(e), s = o.a, v = o.d;
      l += e.scrollLeft * s, t += e.scrollTop * v;
    } while (e !== a && (e = e.parentNode));
  return [l, t];
}
function cn(e, l) {
  for (var t in e)
    if (e.hasOwnProperty(t)) {
      for (var a in l)
        if (l.hasOwnProperty(a) && l[a] === e[t][a]) return Number(t);
    }
  return -1;
}
function ft(e, l) {
  if (!e || !e.getBoundingClientRect) return et();
  var t = e, a = !1;
  do
    if (t.clientWidth < t.scrollWidth || t.clientHeight < t.scrollHeight) {
      var o = oe(t);
      if (t.clientWidth < t.scrollWidth && (o.overflowX == "auto" || o.overflowX == "scroll") || t.clientHeight < t.scrollHeight && (o.overflowY == "auto" || o.overflowY == "scroll")) {
        if (!t.getBoundingClientRect || t === document.body) return et();
        if (a || l) return t;
        a = !0;
      }
    }
  while (t = t.parentNode);
  return et();
}
function vn(e, l) {
  if (e && l)
    for (var t in l)
      l.hasOwnProperty(t) && (e[t] = l[t]);
  return e;
}
function Al(e, l) {
  return Math.round(e.top) === Math.round(l.top) && Math.round(e.left) === Math.round(l.left) && Math.round(e.height) === Math.round(l.height) && Math.round(e.width) === Math.round(l.width);
}
var Jt;
function Xa(e, l) {
  return function() {
    if (!Jt) {
      var t = arguments, a = this;
      t.length === 1 ? e.call(a, t[0]) : e.apply(a, t), Jt = setTimeout(function() {
        Jt = void 0;
      }, l);
    }
  };
}
function mn() {
  clearTimeout(Jt), Jt = void 0;
}
function Ja(e, l, t) {
  e.scrollLeft += l, e.scrollTop += t;
}
function Za(e) {
  var l = window.Polymer, t = window.jQuery || window.Zepto;
  return l && l.dom ? l.dom(e).cloneNode(!0) : t ? t(e).clone(!0)[0] : e.cloneNode(!0);
}
function Qa(e, l, t) {
  var a = {};
  return Array.from(e.children).forEach(function(o) {
    var s, v, p, f;
    if (!(!Je(o, l.draggable, e, !1) || o.animated || o === t)) {
      var i = Ee(o);
      a.left = Math.min((s = a.left) !== null && s !== void 0 ? s : 1 / 0, i.left), a.top = Math.min((v = a.top) !== null && v !== void 0 ? v : 1 / 0, i.top), a.right = Math.max((p = a.right) !== null && p !== void 0 ? p : -1 / 0, i.right), a.bottom = Math.max((f = a.bottom) !== null && f !== void 0 ? f : -1 / 0, i.bottom);
    }
  }), a.width = a.right - a.left, a.height = a.bottom - a.top, a.x = a.left, a.y = a.top, a;
}
var Fe = "Sortable" + (/* @__PURE__ */ new Date()).getTime();
function fn() {
  var e = [], l;
  return {
    captureAnimationState: function() {
      if (e = [], !!this.options.animation) {
        var a = [].slice.call(this.el.children);
        a.forEach(function(o) {
          if (!(oe(o, "display") === "none" || o === ie.ghost)) {
            e.push({
              target: o,
              rect: Ee(o)
            });
            var s = tt({}, e[e.length - 1].rect);
            if (o.thisAnimationDuration) {
              var v = Lt(o, !0);
              v && (s.top -= v.f, s.left -= v.e);
            }
            o.fromRect = s;
          }
        });
      }
    },
    addAnimationState: function(a) {
      e.push(a);
    },
    removeAnimationState: function(a) {
      e.splice(cn(e, {
        target: a
      }), 1);
    },
    animateAll: function(a) {
      var o = this;
      if (!this.options.animation) {
        clearTimeout(l), typeof a == "function" && a();
        return;
      }
      var s = !1, v = 0;
      e.forEach(function(p) {
        var f = 0, i = p.target, n = i.fromRect, u = Ee(i), y = i.prevFromRect, m = i.prevToRect, w = p.rect, C = Lt(i, !0);
        C && (u.top -= C.f, u.left -= C.e), i.toRect = u, i.thisAnimationDuration && Al(y, u) && !Al(n, u) && // Make sure animatingRect is on line between toRect & fromRect
        (w.top - u.top) / (w.left - u.left) === (n.top - u.top) / (n.left - u.left) && (f = bn(w, y, m, o.options)), Al(u, n) || (i.prevFromRect = n, i.prevToRect = u, f || (f = o.options.animation), o.animate(i, w, u, f)), f && (s = !0, v = Math.max(v, f), clearTimeout(i.animationResetTimer), i.animationResetTimer = setTimeout(function() {
          i.animationTime = 0, i.prevFromRect = null, i.fromRect = null, i.prevToRect = null, i.thisAnimationDuration = null;
        }, f), i.thisAnimationDuration = f);
      }), clearTimeout(l), s ? l = setTimeout(function() {
        typeof a == "function" && a();
      }, v) : typeof a == "function" && a(), e = [];
    },
    animate: function(a, o, s, v) {
      if (v) {
        oe(a, "transition", ""), oe(a, "transform", "");
        var p = Lt(this.el), f = p && p.a, i = p && p.d, n = (o.left - s.left) / (f || 1), u = (o.top - s.top) / (i || 1);
        a.animatingX = !!n, a.animatingY = !!u, oe(a, "transform", "translate3d(" + n + "px," + u + "px,0)"), this.forRepaintDummy = pn(a), oe(a, "transition", "transform " + v + "ms" + (this.options.easing ? " " + this.options.easing : "")), oe(a, "transform", "translate3d(0,0,0)"), typeof a.animated == "number" && clearTimeout(a.animated), a.animated = setTimeout(function() {
          oe(a, "transition", ""), oe(a, "transform", ""), a.animated = !1, a.animatingX = !1, a.animatingY = !1;
        }, v);
      }
    }
  };
}
function pn(e) {
  return e.offsetWidth;
}
function bn(e, l, t, a) {
  return Math.sqrt(Math.pow(l.top - e.top, 2) + Math.pow(l.left - e.left, 2)) / Math.sqrt(Math.pow(l.top - t.top, 2) + Math.pow(l.left - t.left, 2)) * a.animation;
}
var Pt = [], Pl = {
  initializeByDefault: !0
}, ll = {
  mount: function(l) {
    for (var t in Pl)
      Pl.hasOwnProperty(t) && !(t in l) && (l[t] = Pl[t]);
    Pt.forEach(function(a) {
      if (a.pluginName === l.pluginName)
        throw "Sortable: Cannot mount plugin ".concat(l.pluginName, " more than once");
    }), Pt.push(l);
  },
  pluginEvent: function(l, t, a) {
    var o = this;
    this.eventCanceled = !1, a.cancel = function() {
      o.eventCanceled = !0;
    };
    var s = l + "Global";
    Pt.forEach(function(v) {
      t[v.pluginName] && (t[v.pluginName][s] && t[v.pluginName][s](tt({
        sortable: t
      }, a)), t.options[v.pluginName] && t[v.pluginName][l] && t[v.pluginName][l](tt({
        sortable: t
      }, a)));
    });
  },
  initializePlugins: function(l, t, a, o) {
    Pt.forEach(function(p) {
      var f = p.pluginName;
      if (!(!l.options[f] && !p.initializeByDefault)) {
        var i = new p(l, t, l.options);
        i.sortable = l, i.options = l.options, l[f] = i, it(a, i.defaults);
      }
    });
    for (var s in l.options)
      if (l.options.hasOwnProperty(s)) {
        var v = this.modifyOption(l, s, l.options[s]);
        typeof v < "u" && (l.options[s] = v);
      }
  },
  getEventProperties: function(l, t) {
    var a = {};
    return Pt.forEach(function(o) {
      typeof o.eventProperties == "function" && it(a, o.eventProperties.call(t[o.pluginName], l));
    }), a;
  },
  modifyOption: function(l, t, a) {
    var o;
    return Pt.forEach(function(s) {
      l[s.pluginName] && s.optionListeners && typeof s.optionListeners[t] == "function" && (o = s.optionListeners[t].call(l[s.pluginName], a));
    }), o;
  }
};
function hn(e) {
  var l = e.sortable, t = e.rootEl, a = e.name, o = e.targetEl, s = e.cloneEl, v = e.toEl, p = e.fromEl, f = e.oldIndex, i = e.newIndex, n = e.oldDraggableIndex, u = e.newDraggableIndex, y = e.originalEvent, m = e.putSortable, w = e.extraEventProperties;
  if (l = l || t && t[Fe], !!l) {
    var C, A = l.options, U = "on" + a.charAt(0).toUpperCase() + a.substr(1);
    window.CustomEvent && !st && !tl ? C = new CustomEvent(a, {
      bubbles: !0,
      cancelable: !0
    }) : (C = document.createEvent("Event"), C.initEvent(a, !0, !0)), C.to = v || t, C.from = p || t, C.item = o || t, C.clone = s, C.oldIndex = f, C.newIndex = i, C.oldDraggableIndex = n, C.newDraggableIndex = u, C.originalEvent = y, C.pullMode = m ? m.lastPutMode : void 0;
    var G = tt(tt({}, w), ll.getEventProperties(a, l));
    for (var F in G)
      C[F] = G[F];
    t && t.dispatchEvent(C), A[U] && A[U].call(l, C);
  }
}
var yn = ["evt"], Me = function(l, t) {
  var a = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, o = a.evt, s = nn(a, yn);
  ll.pluginEvent.bind(ie)(l, t, tt({
    dragEl: W,
    parentEl: Ce,
    ghostEl: se,
    rootEl: we,
    nextEl: Vt,
    lastDownEl: ul,
    cloneEl: $e,
    cloneHidden: mt,
    dragStarted: Gt,
    putSortable: Ie,
    activeSortable: ie.active,
    originalEvent: o,
    oldIndex: Mt,
    oldDraggableIndex: Zt,
    newIndex: Be,
    newDraggableIndex: vt,
    hideGhostForTarget: lo,
    unhideGhostForTarget: ao,
    cloneNowHidden: function() {
      mt = !0;
    },
    cloneNowShown: function() {
      mt = !1;
    },
    dispatchSortableEvent: function(p) {
      Oe({
        sortable: t,
        name: p,
        originalEvent: o
      });
    }
  }, s));
};
function Oe(e) {
  hn(tt({
    putSortable: Ie,
    cloneEl: $e,
    targetEl: W,
    rootEl: we,
    oldIndex: Mt,
    oldDraggableIndex: Zt,
    newIndex: Be,
    newDraggableIndex: vt
  }, e));
}
var W, Ce, se, we, Vt, ul, $e, mt, Mt, Be, Zt, vt, nl, Ie, Ot = !1, bl = !1, hl = [], yt, Xe, Rl, Ol, Va, $a, Gt, Rt, Qt, _t = !1, sl = !1, cl, Pe, Nl = [], Gl = !1, yl = [], Cl = typeof document < "u", rl = aa, xa = tl || st ? "cssFloat" : "float", gn = Cl && !Ka && !aa && "draggable" in document.createElement("div"), _a = (function() {
  if (Cl) {
    if (st)
      return !1;
    var e = document.createElement("x");
    return e.style.cssText = "pointer-events:auto", e.style.pointerEvents === "auto";
  }
})(), eo = function(l, t) {
  var a = oe(l), o = parseInt(a.width) - parseInt(a.paddingLeft) - parseInt(a.paddingRight) - parseInt(a.borderLeftWidth) - parseInt(a.borderRightWidth), s = Bt(l, 0, t), v = Bt(l, 1, t), p = s && oe(s), f = v && oe(v), i = p && parseInt(p.marginLeft) + parseInt(p.marginRight) + Ee(s).width, n = f && parseInt(f.marginLeft) + parseInt(f.marginRight) + Ee(v).width;
  if (a.display === "flex")
    return a.flexDirection === "column" || a.flexDirection === "column-reverse" ? "vertical" : "horizontal";
  if (a.display === "grid")
    return a.gridTemplateColumns.split(" ").length <= 1 ? "vertical" : "horizontal";
  if (s && p.float && p.float !== "none") {
    var u = p.float === "left" ? "left" : "right";
    return v && (f.clear === "both" || f.clear === u) ? "vertical" : "horizontal";
  }
  return s && (p.display === "block" || p.display === "flex" || p.display === "table" || p.display === "grid" || i >= o && a[xa] === "none" || v && a[xa] === "none" && i + n > o) ? "vertical" : "horizontal";
}, kn = function(l, t, a) {
  var o = a ? l.left : l.top, s = a ? l.right : l.bottom, v = a ? l.width : l.height, p = a ? t.left : t.top, f = a ? t.right : t.bottom, i = a ? t.width : t.height;
  return o === p || s === f || o + v / 2 === p + i / 2;
}, wn = function(l, t) {
  var a;
  return hl.some(function(o) {
    var s = o[Fe].options.emptyInsertThreshold;
    if (!(!s || oa(o))) {
      var v = Ee(o), p = l >= v.left - s && l <= v.right + s, f = t >= v.top - s && t <= v.bottom + s;
      if (p && f)
        return a = o;
    }
  }), a;
}, to = function(l) {
  function t(s, v) {
    return function(p, f, i, n) {
      var u = p.options.group.name && f.options.group.name && p.options.group.name === f.options.group.name;
      if (s == null && (v || u))
        return !0;
      if (s == null || s === !1)
        return !1;
      if (v && s === "clone")
        return s;
      if (typeof s == "function")
        return t(s(p, f, i, n), v)(p, f, i, n);
      var y = (v ? p : f).options.group.name;
      return s === !0 || typeof s == "string" && s === y || s.join && s.indexOf(y) > -1;
    };
  }
  var a = {}, o = l.group;
  (!o || Kl(o) != "object") && (o = {
    name: o
  }), a.name = o.name, a.checkPull = t(o.pull, !0), a.checkPut = t(o.put), a.revertClone = o.revertClone, l.group = a;
}, lo = function() {
  !_a && se && oe(se, "display", "none");
}, ao = function() {
  !_a && se && oe(se, "display", "");
};
Cl && !Ka && document.addEventListener("click", function(e) {
  if (bl)
    return e.preventDefault(), e.stopPropagation && e.stopPropagation(), e.stopImmediatePropagation && e.stopImmediatePropagation(), bl = !1, !1;
}, !0);
var gt = function(l) {
  if (W) {
    l = l.touches ? l.touches[0] : l;
    var t = wn(l.clientX, l.clientY);
    if (t) {
      var a = {};
      for (var o in l)
        l.hasOwnProperty(o) && (a[o] = l[o]);
      a.target = a.rootEl = t, a.preventDefault = void 0, a.stopPropagation = void 0, t[Fe]._onDragOver(a);
    }
  }
}, Vn = function(l) {
  W && W.parentNode[Fe]._isOutsideThisEl(l.target);
};
function ie(e, l) {
  if (!(e && e.nodeType && e.nodeType === 1))
    throw "Sortable: `el` must be an HTMLElement, not ".concat({}.toString.call(e));
  this.el = e, this.options = l = it({}, l), e[Fe] = this;
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
      return eo(e, this.options);
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
    supportPointer: ie.supportPointer !== !1 && "PointerEvent" in window && (!Xt || aa),
    emptyInsertThreshold: 5
  };
  ll.initializePlugins(this, e, t);
  for (var a in t)
    !(a in l) && (l[a] = t[a]);
  to(l);
  for (var o in this)
    o.charAt(0) === "_" && typeof this[o] == "function" && (this[o] = this[o].bind(this));
  this.nativeDraggable = l.forceFallback ? !1 : gn, this.nativeDraggable && (this.options.touchStartThreshold = 1), l.supportPointer ? me(e, "pointerdown", this._onTapStart) : (me(e, "mousedown", this._onTapStart), me(e, "touchstart", this._onTapStart)), this.nativeDraggable && (me(e, "dragover", this), me(e, "dragenter", this)), hl.push(this.el), l.store && l.store.get && this.sort(l.store.get(this) || []), it(this, fn());
}
ie.prototype = /** @lends Sortable.prototype */
{
  constructor: ie,
  _isOutsideThisEl: function(l) {
    !this.el.contains(l) && l !== this.el && (Rt = null);
  },
  _getDirection: function(l, t) {
    return typeof this.options.direction == "function" ? this.options.direction.call(this, l, t, W) : this.options.direction;
  },
  _onTapStart: function(l) {
    if (l.cancelable) {
      var t = this, a = this.el, o = this.options, s = o.preventOnFilter, v = l.type, p = l.touches && l.touches[0] || l.pointerType && l.pointerType === "touch" && l, f = (p || l).target, i = l.target.shadowRoot && (l.path && l.path[0] || l.composedPath && l.composedPath()[0]) || f, n = o.filter;
      if (Dn(a), !W && !(/mousedown|pointerdown/.test(v) && l.button !== 0 || o.disabled) && !i.isContentEditable && !(!this.nativeDraggable && Xt && f && f.tagName.toUpperCase() === "SELECT") && (f = Je(f, o.draggable, a, !1), !(f && f.animated) && ul !== f)) {
        if (Mt = qe(f), Zt = qe(f, o.draggable), typeof n == "function") {
          if (n.call(this, l, f, this)) {
            Oe({
              sortable: t,
              rootEl: i,
              name: "filter",
              targetEl: f,
              toEl: a,
              fromEl: a
            }), Me("filter", t, {
              evt: l
            }), s && l.preventDefault();
            return;
          }
        } else if (n && (n = n.split(",").some(function(u) {
          if (u = Je(i, u.trim(), a, !1), u)
            return Oe({
              sortable: t,
              rootEl: u,
              name: "filter",
              targetEl: f,
              fromEl: a,
              toEl: a
            }), Me("filter", t, {
              evt: l
            }), !0;
        }), n)) {
          s && l.preventDefault();
          return;
        }
        o.handle && !Je(i, o.handle, a, !1) || this._prepareDragStart(l, p, f);
      }
    }
  },
  _prepareDragStart: function(l, t, a) {
    var o = this, s = o.el, v = o.options, p = s.ownerDocument, f;
    if (a && !W && a.parentNode === s) {
      var i = Ee(a);
      if (we = s, W = a, Ce = W.parentNode, Vt = W.nextSibling, ul = a, nl = v.group, ie.dragged = W, yt = {
        target: W,
        clientX: (t || l).clientX,
        clientY: (t || l).clientY
      }, Va = yt.clientX - i.left, $a = yt.clientY - i.top, this._lastX = (t || l).clientX, this._lastY = (t || l).clientY, W.style["will-change"] = "all", f = function() {
        if (Me("delayEnded", o, {
          evt: l
        }), ie.eventCanceled) {
          o._onDrop();
          return;
        }
        o._disableDelayedDragEvents(), !ya && o.nativeDraggable && (W.draggable = !0), o._triggerDragStart(l, t), Oe({
          sortable: o,
          name: "choose",
          originalEvent: l
        }), ze(W, v.chosenClass, !0);
      }, v.ignore.split(",").forEach(function(n) {
        Ha(W, n.trim(), Ml);
      }), me(p, "dragover", gt), me(p, "mousemove", gt), me(p, "touchmove", gt), v.supportPointer ? (me(p, "pointerup", o._onDrop), !this.nativeDraggable && me(p, "pointercancel", o._onDrop)) : (me(p, "mouseup", o._onDrop), me(p, "touchend", o._onDrop), me(p, "touchcancel", o._onDrop)), ya && this.nativeDraggable && (this.options.touchStartThreshold = 4, W.draggable = !0), Me("delayStart", this, {
        evt: l
      }), v.delay && (!v.delayOnTouchOnly || t) && (!this.nativeDraggable || !(tl || st))) {
        if (ie.eventCanceled) {
          this._onDrop();
          return;
        }
        v.supportPointer ? (me(p, "pointerup", o._disableDelayedDrag), me(p, "pointercancel", o._disableDelayedDrag)) : (me(p, "mouseup", o._disableDelayedDrag), me(p, "touchend", o._disableDelayedDrag), me(p, "touchcancel", o._disableDelayedDrag)), me(p, "mousemove", o._delayedDragTouchMoveHandler), me(p, "touchmove", o._delayedDragTouchMoveHandler), v.supportPointer && me(p, "pointermove", o._delayedDragTouchMoveHandler), o._dragStartTimer = setTimeout(f, v.delay);
      } else
        f();
    }
  },
  _delayedDragTouchMoveHandler: function(l) {
    var t = l.touches ? l.touches[0] : l;
    Math.max(Math.abs(t.clientX - this._lastX), Math.abs(t.clientY - this._lastY)) >= Math.floor(this.options.touchStartThreshold / (this.nativeDraggable && window.devicePixelRatio || 1)) && this._disableDelayedDrag();
  },
  _disableDelayedDrag: function() {
    W && Ml(W), clearTimeout(this._dragStartTimer), this._disableDelayedDragEvents();
  },
  _disableDelayedDragEvents: function() {
    var l = this.el.ownerDocument;
    ve(l, "mouseup", this._disableDelayedDrag), ve(l, "touchend", this._disableDelayedDrag), ve(l, "touchcancel", this._disableDelayedDrag), ve(l, "pointerup", this._disableDelayedDrag), ve(l, "pointercancel", this._disableDelayedDrag), ve(l, "mousemove", this._delayedDragTouchMoveHandler), ve(l, "touchmove", this._delayedDragTouchMoveHandler), ve(l, "pointermove", this._delayedDragTouchMoveHandler);
  },
  _triggerDragStart: function(l, t) {
    t = t || l.pointerType == "touch" && l, !this.nativeDraggable || t ? this.options.supportPointer ? me(document, "pointermove", this._onTouchMove) : t ? me(document, "touchmove", this._onTouchMove) : me(document, "mousemove", this._onTouchMove) : (me(W, "dragend", this), me(we, "dragstart", this._onDragStart));
    try {
      document.selection ? vl(function() {
        document.selection.empty();
      }) : window.getSelection().removeAllRanges();
    } catch {
    }
  },
  _dragStarted: function(l, t) {
    if (Ot = !1, we && W) {
      Me("dragStarted", this, {
        evt: t
      }), this.nativeDraggable && me(document, "dragover", Vn);
      var a = this.options;
      !l && ze(W, a.dragClass, !1), ze(W, a.ghostClass, !0), ie.active = this, l && this._appendGhost(), Oe({
        sortable: this,
        name: "start",
        originalEvent: t
      });
    } else
      this._nulling();
  },
  _emulateDragOver: function() {
    if (Xe) {
      this._lastX = Xe.clientX, this._lastY = Xe.clientY, lo();
      for (var l = document.elementFromPoint(Xe.clientX, Xe.clientY), t = l; l && l.shadowRoot && (l = l.shadowRoot.elementFromPoint(Xe.clientX, Xe.clientY), l !== t); )
        t = l;
      if (W.parentNode[Fe]._isOutsideThisEl(l), t)
        do {
          if (t[Fe]) {
            var a = void 0;
            if (a = t[Fe]._onDragOver({
              clientX: Xe.clientX,
              clientY: Xe.clientY,
              target: l,
              rootEl: t
            }), a && !this.options.dragoverBubble)
              break;
          }
          l = t;
        } while (t = Ya(t));
      ao();
    }
  },
  _onTouchMove: function(l) {
    if (yt) {
      var t = this.options, a = t.fallbackTolerance, o = t.fallbackOffset, s = l.touches ? l.touches[0] : l, v = se && Lt(se, !0), p = se && v && v.a, f = se && v && v.d, i = rl && Pe && wa(Pe), n = (s.clientX - yt.clientX + o.x) / (p || 1) + (i ? i[0] - Nl[0] : 0) / (p || 1), u = (s.clientY - yt.clientY + o.y) / (f || 1) + (i ? i[1] - Nl[1] : 0) / (f || 1);
      if (!ie.active && !Ot) {
        if (a && Math.max(Math.abs(s.clientX - this._lastX), Math.abs(s.clientY - this._lastY)) < a)
          return;
        this._onDragStart(l, !0);
      }
      if (se) {
        v ? (v.e += n - (Rl || 0), v.f += u - (Ol || 0)) : v = {
          a: 1,
          b: 0,
          c: 0,
          d: 1,
          e: n,
          f: u
        };
        var y = "matrix(".concat(v.a, ",").concat(v.b, ",").concat(v.c, ",").concat(v.d, ",").concat(v.e, ",").concat(v.f, ")");
        oe(se, "webkitTransform", y), oe(se, "mozTransform", y), oe(se, "msTransform", y), oe(se, "transform", y), Rl = n, Ol = u, Xe = s;
      }
      l.cancelable && l.preventDefault();
    }
  },
  _appendGhost: function() {
    if (!se) {
      var l = this.options.fallbackOnBody ? document.body : we, t = Ee(W, !0, rl, !0, l), a = this.options;
      if (rl) {
        for (Pe = l; oe(Pe, "position") === "static" && oe(Pe, "transform") === "none" && Pe !== document; )
          Pe = Pe.parentNode;
        Pe !== document.body && Pe !== document.documentElement ? (Pe === document && (Pe = et()), t.top += Pe.scrollTop, t.left += Pe.scrollLeft) : Pe = et(), Nl = wa(Pe);
      }
      se = W.cloneNode(!0), ze(se, a.ghostClass, !1), ze(se, a.fallbackClass, !0), ze(se, a.dragClass, !0), oe(se, "transition", ""), oe(se, "transform", ""), oe(se, "box-sizing", "border-box"), oe(se, "margin", 0), oe(se, "top", t.top), oe(se, "left", t.left), oe(se, "width", t.width), oe(se, "height", t.height), oe(se, "opacity", "0.8"), oe(se, "position", rl ? "absolute" : "fixed"), oe(se, "zIndex", "100000"), oe(se, "pointerEvents", "none"), ie.ghost = se, l.appendChild(se), oe(se, "transform-origin", Va / parseInt(se.style.width) * 100 + "% " + $a / parseInt(se.style.height) * 100 + "%");
    }
  },
  _onDragStart: function(l, t) {
    var a = this, o = l.dataTransfer, s = a.options;
    if (Me("dragStart", this, {
      evt: l
    }), ie.eventCanceled) {
      this._onDrop();
      return;
    }
    Me("setupClone", this), ie.eventCanceled || ($e = Za(W), $e.removeAttribute("id"), $e.draggable = !1, $e.style["will-change"] = "", this._hideClone(), ze($e, this.options.chosenClass, !1), ie.clone = $e), a.cloneId = vl(function() {
      Me("clone", a), !ie.eventCanceled && (a.options.removeCloneOnHide || we.insertBefore($e, W), a._hideClone(), Oe({
        sortable: a,
        name: "clone"
      }));
    }), !t && ze(W, s.dragClass, !0), t ? (bl = !0, a._loopId = setInterval(a._emulateDragOver, 50)) : (ve(document, "mouseup", a._onDrop), ve(document, "touchend", a._onDrop), ve(document, "touchcancel", a._onDrop), o && (o.effectAllowed = "move", s.setData && s.setData.call(a, o, W)), me(document, "drop", a), oe(W, "transform", "translateZ(0)")), Ot = !0, a._dragStartId = vl(a._dragStarted.bind(a, t, l)), me(document, "selectstart", a), Gt = !0, window.getSelection().removeAllRanges(), Xt && oe(document.body, "user-select", "none");
  },
  // Returns true - if no further action is needed (either inserted or another condition)
  _onDragOver: function(l) {
    var t = this.el, a = l.target, o, s, v, p = this.options, f = p.group, i = ie.active, n = nl === f, u = p.sort, y = Ie || i, m, w = this, C = !1;
    if (Gl) return;
    function A(pe, ge) {
      Me(pe, w, tt({
        evt: l,
        isOwner: n,
        axis: m ? "vertical" : "horizontal",
        revert: v,
        dragRect: o,
        targetRect: s,
        canSort: u,
        fromSortable: y,
        target: a,
        completed: G,
        onMove: function(De, h) {
          return dl(we, t, W, o, De, Ee(De), l, h);
        },
        changed: F
      }, ge));
    }
    function U() {
      A("dragOverAnimationCapture"), w.captureAnimationState(), w !== y && y.captureAnimationState();
    }
    function G(pe) {
      return A("dragOverCompleted", {
        insertion: pe
      }), pe && (n ? i._hideClone() : i._showClone(w), w !== y && (ze(W, Ie ? Ie.options.ghostClass : i.options.ghostClass, !1), ze(W, p.ghostClass, !0)), Ie !== w && w !== ie.active ? Ie = w : w === ie.active && Ie && (Ie = null), y === w && (w._ignoreWhileAnimating = a), w.animateAll(function() {
        A("dragOverAnimationComplete"), w._ignoreWhileAnimating = null;
      }), w !== y && (y.animateAll(), y._ignoreWhileAnimating = null)), (a === W && !W.animated || a === t && !a.animated) && (Rt = null), !p.dragoverBubble && !l.rootEl && a !== document && (W.parentNode[Fe]._isOutsideThisEl(l.target), !pe && gt(l)), !p.dragoverBubble && l.stopPropagation && l.stopPropagation(), C = !0;
    }
    function F() {
      Be = qe(W), vt = qe(W, p.draggable), Oe({
        sortable: w,
        name: "change",
        toEl: t,
        newIndex: Be,
        newDraggableIndex: vt,
        originalEvent: l
      });
    }
    if (l.preventDefault !== void 0 && l.cancelable && l.preventDefault(), a = Je(a, p.draggable, t, !0), A("dragOver"), ie.eventCanceled) return C;
    if (W.contains(l.target) || a.animated && a.animatingX && a.animatingY || w._ignoreWhileAnimating === a)
      return G(!1);
    if (bl = !1, i && !p.disabled && (n ? u || (v = Ce !== we) : Ie === this || (this.lastPutMode = nl.checkPull(this, i, W, l)) && f.checkPut(this, i, W, l))) {
      if (m = this._getDirection(l, a) === "vertical", o = Ee(W), A("dragOverValid"), ie.eventCanceled) return C;
      if (v)
        return Ce = we, U(), this._hideClone(), A("revert"), ie.eventCanceled || (Vt ? we.insertBefore(W, Vt) : we.appendChild(W)), G(!0);
      var E = oa(t, p.draggable);
      if (!E || Sn(l, m, this) && !E.animated) {
        if (E === W)
          return G(!1);
        if (E && t === l.target && (a = E), a && (s = Ee(a)), dl(we, t, W, o, a, s, l, !!a) !== !1)
          return U(), E && E.nextSibling ? t.insertBefore(W, E.nextSibling) : t.appendChild(W), Ce = t, F(), G(!0);
      } else if (E && Cn(l, m, this)) {
        var $ = Bt(t, 0, p, !0);
        if ($ === W)
          return G(!1);
        if (a = $, s = Ee(a), dl(we, t, W, o, a, s, l, !1) !== !1)
          return U(), t.insertBefore(W, $), Ce = t, F(), G(!0);
      } else if (a.parentNode === t) {
        s = Ee(a);
        var V = 0, T, ae = W.parentNode !== t, L = !kn(W.animated && W.toRect || o, a.animated && a.toRect || s, m), j = m ? "top" : "left", R = ka(a, "top", "top") || ka(W, "top", "top"), ne = R ? R.scrollTop : void 0;
        Rt !== a && (T = s[j], _t = !1, sl = !L && p.invertSwap || ae), V = Tn(l, a, s, m, L ? 1 : p.swapThreshold, p.invertedSwapThreshold == null ? p.swapThreshold : p.invertedSwapThreshold, sl, Rt === a);
        var x;
        if (V !== 0) {
          var P = qe(W);
          do
            P -= V, x = Ce.children[P];
          while (x && (oe(x, "display") === "none" || x === se));
        }
        if (V === 0 || x === a)
          return G(!1);
        Rt = a, Qt = V;
        var O = a.nextElementSibling, Z = !1;
        Z = V === 1;
        var ce = dl(we, t, W, o, a, s, l, Z);
        if (ce !== !1)
          return (ce === 1 || ce === -1) && (Z = ce === 1), Gl = !0, setTimeout(xn, 30), U(), Z && !O ? t.appendChild(W) : a.parentNode.insertBefore(W, Z ? O : a), R && Ja(R, 0, ne - R.scrollTop), Ce = W.parentNode, T !== void 0 && !sl && (cl = Math.abs(T - Ee(a)[j])), F(), G(!0);
      }
      if (t.contains(W))
        return G(!1);
    }
    return !1;
  },
  _ignoreWhileAnimating: null,
  _offMoveEvents: function() {
    ve(document, "mousemove", this._onTouchMove), ve(document, "touchmove", this._onTouchMove), ve(document, "pointermove", this._onTouchMove), ve(document, "dragover", gt), ve(document, "mousemove", gt), ve(document, "touchmove", gt);
  },
  _offUpEvents: function() {
    var l = this.el.ownerDocument;
    ve(l, "mouseup", this._onDrop), ve(l, "touchend", this._onDrop), ve(l, "pointerup", this._onDrop), ve(l, "pointercancel", this._onDrop), ve(l, "touchcancel", this._onDrop), ve(document, "selectstart", this);
  },
  _onDrop: function(l) {
    var t = this.el, a = this.options;
    if (Be = qe(W), vt = qe(W, a.draggable), Me("drop", this, {
      evt: l
    }), Ce = W && W.parentNode, Be = qe(W), vt = qe(W, a.draggable), ie.eventCanceled) {
      this._nulling();
      return;
    }
    Ot = !1, sl = !1, _t = !1, clearInterval(this._loopId), clearTimeout(this._dragStartTimer), Yl(this.cloneId), Yl(this._dragStartId), this.nativeDraggable && (ve(document, "drop", this), ve(t, "dragstart", this._onDragStart)), this._offMoveEvents(), this._offUpEvents(), Xt && oe(document.body, "user-select", ""), oe(W, "transform", ""), l && (Gt && (l.cancelable && l.preventDefault(), !a.dropBubble && l.stopPropagation()), se && se.parentNode && se.parentNode.removeChild(se), (we === Ce || Ie && Ie.lastPutMode !== "clone") && $e && $e.parentNode && $e.parentNode.removeChild($e), W && (this.nativeDraggable && ve(W, "dragend", this), Ml(W), W.style["will-change"] = "", Gt && !Ot && ze(W, Ie ? Ie.options.ghostClass : this.options.ghostClass, !1), ze(W, this.options.chosenClass, !1), Oe({
      sortable: this,
      name: "unchoose",
      toEl: Ce,
      newIndex: null,
      newDraggableIndex: null,
      originalEvent: l
    }), we !== Ce ? (Be >= 0 && (Oe({
      rootEl: Ce,
      name: "add",
      toEl: Ce,
      fromEl: we,
      originalEvent: l
    }), Oe({
      sortable: this,
      name: "remove",
      toEl: Ce,
      originalEvent: l
    }), Oe({
      rootEl: Ce,
      name: "sort",
      toEl: Ce,
      fromEl: we,
      originalEvent: l
    }), Oe({
      sortable: this,
      name: "sort",
      toEl: Ce,
      originalEvent: l
    })), Ie && Ie.save()) : Be !== Mt && Be >= 0 && (Oe({
      sortable: this,
      name: "update",
      toEl: Ce,
      originalEvent: l
    }), Oe({
      sortable: this,
      name: "sort",
      toEl: Ce,
      originalEvent: l
    })), ie.active && ((Be == null || Be === -1) && (Be = Mt, vt = Zt), Oe({
      sortable: this,
      name: "end",
      toEl: Ce,
      originalEvent: l
    }), this.save()))), this._nulling();
  },
  _nulling: function() {
    Me("nulling", this), we = W = Ce = se = Vt = $e = ul = mt = yt = Xe = Gt = Be = vt = Mt = Zt = Rt = Qt = Ie = nl = ie.dragged = ie.ghost = ie.clone = ie.active = null;
    var l = this.el;
    yl.forEach(function(t) {
      l.contains(t) && (t.checked = !0);
    }), yl.length = Rl = Ol = 0;
  },
  handleEvent: function(l) {
    switch (l.type) {
      case "drop":
      case "dragend":
        this._onDrop(l);
        break;
      case "dragenter":
      case "dragover":
        W && (this._onDragOver(l), $n(l));
        break;
      case "selectstart":
        l.preventDefault();
        break;
    }
  },
  /**
   * Serializes the item into an array of string.
   * @returns {String[]}
   */
  toArray: function() {
    for (var l = [], t, a = this.el.children, o = 0, s = a.length, v = this.options; o < s; o++)
      t = a[o], Je(t, v.draggable, this.el, !1) && l.push(t.getAttribute(v.dataIdAttr) || En(t));
    return l;
  },
  /**
   * Sorts the elements according to the array.
   * @param  {String[]}  order  order of the items
   */
  sort: function(l, t) {
    var a = {}, o = this.el;
    this.toArray().forEach(function(s, v) {
      var p = o.children[v];
      Je(p, this.options.draggable, o, !1) && (a[s] = p);
    }, this), t && this.captureAnimationState(), l.forEach(function(s) {
      a[s] && (o.removeChild(a[s]), o.appendChild(a[s]));
    }), t && this.animateAll();
  },
  /**
   * Save the current sorting
   */
  save: function() {
    var l = this.options.store;
    l && l.set && l.set(this);
  },
  /**
   * For each element in the set, get the first element that matches the selector by testing the element itself and traversing up through its ancestors in the DOM tree.
   * @param   {HTMLElement}  el
   * @param   {String}       [selector]  default: `options.draggable`
   * @returns {HTMLElement|null}
   */
  closest: function(l, t) {
    return Je(l, t || this.options.draggable, this.el, !1);
  },
  /**
   * Set/get option
   * @param   {string} name
   * @param   {*}      [value]
   * @returns {*}
   */
  option: function(l, t) {
    var a = this.options;
    if (t === void 0)
      return a[l];
    var o = ll.modifyOption(this, l, t);
    typeof o < "u" ? a[l] = o : a[l] = t, l === "group" && to(a);
  },
  /**
   * Destroy
   */
  destroy: function() {
    Me("destroy", this);
    var l = this.el;
    l[Fe] = null, ve(l, "mousedown", this._onTapStart), ve(l, "touchstart", this._onTapStart), ve(l, "pointerdown", this._onTapStart), this.nativeDraggable && (ve(l, "dragover", this), ve(l, "dragenter", this)), Array.prototype.forEach.call(l.querySelectorAll("[draggable]"), function(t) {
      t.removeAttribute("draggable");
    }), this._onDrop(), this._disableDelayedDragEvents(), hl.splice(hl.indexOf(this.el), 1), this.el = l = null;
  },
  _hideClone: function() {
    if (!mt) {
      if (Me("hideClone", this), ie.eventCanceled) return;
      oe($e, "display", "none"), this.options.removeCloneOnHide && $e.parentNode && $e.parentNode.removeChild($e), mt = !0;
    }
  },
  _showClone: function(l) {
    if (l.lastPutMode !== "clone") {
      this._hideClone();
      return;
    }
    if (mt) {
      if (Me("showClone", this), ie.eventCanceled) return;
      W.parentNode == we && !this.options.group.revertClone ? we.insertBefore($e, W) : Vt ? we.insertBefore($e, Vt) : we.appendChild($e), this.options.group.revertClone && this.animate(W, $e), oe($e, "display", ""), mt = !1;
    }
  }
};
function $n(e) {
  e.dataTransfer && (e.dataTransfer.dropEffect = "move"), e.cancelable && e.preventDefault();
}
function dl(e, l, t, a, o, s, v, p) {
  var f, i = e[Fe], n = i.options.onMove, u;
  return window.CustomEvent && !st && !tl ? f = new CustomEvent("move", {
    bubbles: !0,
    cancelable: !0
  }) : (f = document.createEvent("Event"), f.initEvent("move", !0, !0)), f.to = l, f.from = e, f.dragged = t, f.draggedRect = a, f.related = o || l, f.relatedRect = s || Ee(l), f.willInsertAfter = p, f.originalEvent = v, e.dispatchEvent(f), n && (u = n.call(i, f, v)), u;
}
function Ml(e) {
  e.draggable = !1;
}
function xn() {
  Gl = !1;
}
function Cn(e, l, t) {
  var a = Ee(Bt(t.el, 0, t.options, !0)), o = Qa(t.el, t.options, se), s = 10;
  return l ? e.clientX < o.left - s || e.clientY < a.top && e.clientX < a.right : e.clientY < o.top - s || e.clientY < a.bottom && e.clientX < a.left;
}
function Sn(e, l, t) {
  var a = Ee(oa(t.el, t.options.draggable)), o = Qa(t.el, t.options, se), s = 10;
  return l ? e.clientX > o.right + s || e.clientY > a.bottom && e.clientX > a.left : e.clientY > o.bottom + s || e.clientX > a.right && e.clientY > a.top;
}
function Tn(e, l, t, a, o, s, v, p) {
  var f = a ? e.clientY : e.clientX, i = a ? t.height : t.width, n = a ? t.top : t.left, u = a ? t.bottom : t.right, y = !1;
  if (!v) {
    if (p && cl < i * o) {
      if (!_t && (Qt === 1 ? f > n + i * s / 2 : f < u - i * s / 2) && (_t = !0), _t)
        y = !0;
      else if (Qt === 1 ? f < n + cl : f > u - cl)
        return -Qt;
    } else if (f > n + i * (1 - o) / 2 && f < u - i * (1 - o) / 2)
      return Un(l);
  }
  return y = y || v, y && (f < n + i * s / 2 || f > u - i * s / 2) ? f > n + i / 2 ? 1 : -1 : 0;
}
function Un(e) {
  return qe(W) < qe(e) ? 1 : -1;
}
function En(e) {
  for (var l = e.tagName + e.className + e.src + e.href + e.textContent, t = l.length, a = 0; t--; )
    a += l.charCodeAt(t);
  return a.toString(36);
}
function Dn(e) {
  yl.length = 0;
  for (var l = e.getElementsByTagName("input"), t = l.length; t--; ) {
    var a = l[t];
    a.checked && yl.push(a);
  }
}
function vl(e) {
  return setTimeout(e, 0);
}
function Yl(e) {
  return clearTimeout(e);
}
Cl && me(document, "touchmove", function(e) {
  (ie.active || Ot) && e.cancelable && e.preventDefault();
});
ie.utils = {
  on: me,
  off: ve,
  css: oe,
  find: Ha,
  is: function(l, t) {
    return !!Je(l, t, l, !1);
  },
  extend: vn,
  throttle: Xa,
  closest: Je,
  toggleClass: ze,
  clone: Za,
  index: qe,
  nextTick: vl,
  cancelNextTick: Yl,
  detectDirection: eo,
  getChild: Bt,
  expando: Fe
};
ie.get = function(e) {
  return e[Fe];
};
ie.mount = function() {
  for (var e = arguments.length, l = new Array(e), t = 0; t < e; t++)
    l[t] = arguments[t];
  l[0].constructor === Array && (l = l[0]), l.forEach(function(a) {
    if (!a.prototype || !a.prototype.constructor)
      throw "Sortable: Mounted plugin must be a constructor function, not ".concat({}.toString.call(a));
    a.utils && (ie.utils = tt(tt({}, ie.utils), a.utils)), ll.mount(a);
  });
};
ie.create = function(e, l) {
  return new ie(e, l);
};
ie.version = un;
var Ue = [], Yt, Hl, Xl = !1, Fl, Ll, gl, Ht;
function In() {
  function e() {
    this.defaults = {
      scroll: !0,
      forceAutoScrollFallback: !1,
      scrollSensitivity: 30,
      scrollSpeed: 10,
      bubbleScroll: !0
    };
    for (var l in this)
      l.charAt(0) === "_" && typeof this[l] == "function" && (this[l] = this[l].bind(this));
  }
  return e.prototype = {
    dragStarted: function(t) {
      var a = t.originalEvent;
      this.sortable.nativeDraggable ? me(document, "dragover", this._handleAutoScroll) : this.options.supportPointer ? me(document, "pointermove", this._handleFallbackAutoScroll) : a.touches ? me(document, "touchmove", this._handleFallbackAutoScroll) : me(document, "mousemove", this._handleFallbackAutoScroll);
    },
    dragOverCompleted: function(t) {
      var a = t.originalEvent;
      !this.options.dragOverBubble && !a.rootEl && this._handleAutoScroll(a);
    },
    drop: function() {
      this.sortable.nativeDraggable ? ve(document, "dragover", this._handleAutoScroll) : (ve(document, "pointermove", this._handleFallbackAutoScroll), ve(document, "touchmove", this._handleFallbackAutoScroll), ve(document, "mousemove", this._handleFallbackAutoScroll)), Ca(), ml(), mn();
    },
    nulling: function() {
      gl = Hl = Yt = Xl = Ht = Fl = Ll = null, Ue.length = 0;
    },
    _handleFallbackAutoScroll: function(t) {
      this._handleAutoScroll(t, !0);
    },
    _handleAutoScroll: function(t, a) {
      var o = this, s = (t.touches ? t.touches[0] : t).clientX, v = (t.touches ? t.touches[0] : t).clientY, p = document.elementFromPoint(s, v);
      if (gl = t, a || this.options.forceAutoScrollFallback || tl || st || Xt) {
        zl(t, this.options, p, a);
        var f = ft(p, !0);
        Xl && (!Ht || s !== Fl || v !== Ll) && (Ht && Ca(), Ht = setInterval(function() {
          var i = ft(document.elementFromPoint(s, v), !0);
          i !== f && (f = i, ml()), zl(t, o.options, i, a);
        }, 10), Fl = s, Ll = v);
      } else {
        if (!this.options.bubbleScroll || ft(p, !0) === et()) {
          ml();
          return;
        }
        zl(t, this.options, ft(p, !1), !1);
      }
    }
  }, it(e, {
    pluginName: "scroll",
    initializeByDefault: !0
  });
}
function ml() {
  Ue.forEach(function(e) {
    clearInterval(e.pid);
  }), Ue = [];
}
function Ca() {
  clearInterval(Ht);
}
var zl = Xa(function(e, l, t, a) {
  if (l.scroll) {
    var o = (e.touches ? e.touches[0] : e).clientX, s = (e.touches ? e.touches[0] : e).clientY, v = l.scrollSensitivity, p = l.scrollSpeed, f = et(), i = !1, n;
    Hl !== t && (Hl = t, ml(), Yt = l.scroll, n = l.scrollFn, Yt === !0 && (Yt = ft(t, !0)));
    var u = 0, y = Yt;
    do {
      var m = y, w = Ee(m), C = w.top, A = w.bottom, U = w.left, G = w.right, F = w.width, E = w.height, $ = void 0, V = void 0, T = m.scrollWidth, ae = m.scrollHeight, L = oe(m), j = m.scrollLeft, R = m.scrollTop;
      m === f ? ($ = F < T && (L.overflowX === "auto" || L.overflowX === "scroll" || L.overflowX === "visible"), V = E < ae && (L.overflowY === "auto" || L.overflowY === "scroll" || L.overflowY === "visible")) : ($ = F < T && (L.overflowX === "auto" || L.overflowX === "scroll"), V = E < ae && (L.overflowY === "auto" || L.overflowY === "scroll"));
      var ne = $ && (Math.abs(G - o) <= v && j + F < T) - (Math.abs(U - o) <= v && !!j), x = V && (Math.abs(A - s) <= v && R + E < ae) - (Math.abs(C - s) <= v && !!R);
      if (!Ue[u])
        for (var P = 0; P <= u; P++)
          Ue[P] || (Ue[P] = {});
      (Ue[u].vx != ne || Ue[u].vy != x || Ue[u].el !== m) && (Ue[u].el = m, Ue[u].vx = ne, Ue[u].vy = x, clearInterval(Ue[u].pid), (ne != 0 || x != 0) && (i = !0, Ue[u].pid = setInterval(function() {
        a && this.layer === 0 && ie.active._onTouchMove(gl);
        var O = Ue[this.layer].vy ? Ue[this.layer].vy * p : 0, Z = Ue[this.layer].vx ? Ue[this.layer].vx * p : 0;
        typeof n == "function" && n.call(ie.dragged.parentNode[Fe], Z, O, e, gl, Ue[this.layer].el) !== "continue" || Ja(Ue[this.layer].el, Z, O);
      }.bind({
        layer: u
      }), 24))), u++;
    } while (l.bubbleScroll && y !== f && (y = ft(y, !1)));
    Xl = i;
  }
}, 30), oo = function(l) {
  var t = l.originalEvent, a = l.putSortable, o = l.dragEl, s = l.activeSortable, v = l.dispatchSortableEvent, p = l.hideGhostForTarget, f = l.unhideGhostForTarget;
  if (t) {
    var i = a || s;
    p();
    var n = t.changedTouches && t.changedTouches.length ? t.changedTouches[0] : t, u = document.elementFromPoint(n.clientX, n.clientY);
    f(), i && !i.el.contains(u) && (v("spill"), this.onSpill({
      dragEl: o,
      putSortable: a
    }));
  }
};
function ia() {
}
ia.prototype = {
  startIndex: null,
  dragStart: function(l) {
    var t = l.oldDraggableIndex;
    this.startIndex = t;
  },
  onSpill: function(l) {
    var t = l.dragEl, a = l.putSortable;
    this.sortable.captureAnimationState(), a && a.captureAnimationState();
    var o = Bt(this.sortable.el, this.startIndex, this.options);
    o ? this.sortable.el.insertBefore(t, o) : this.sortable.el.appendChild(t), this.sortable.animateAll(), a && a.animateAll();
  },
  drop: oo
};
it(ia, {
  pluginName: "revertOnSpill"
});
function na() {
}
na.prototype = {
  onSpill: function(l) {
    var t = l.dragEl, a = l.putSortable, o = a || this.sortable;
    o.captureAnimationState(), t.parentNode && t.parentNode.removeChild(t), o.animateAll();
  },
  drop: oo
};
it(na, {
  pluginName: "removeOnSpill"
});
ie.mount(new In());
ie.mount(na, ia);
function An(e, l) {
  const t = e.oldDraggableIndex ?? e.oldIndex;
  e.item.remove();
  const a = [...e.from.children].filter((o) => o.matches(l));
  e.from.insertBefore(e.item, a[t ?? a.length] ?? null);
}
function io(e) {
  const l = /* @__PURE__ */ new Map();
  function t(a) {
    l.get(a)?.destroy(), l.delete(a);
  }
  return nt(() => {
    for (const a of l.keys()) t(a);
  }), {
    mounted(a) {
      const o = a.querySelector(".work-field-builder") ?? a;
      l.set(a, new ie(o, {
        draggable: ".work-reorder-entry",
        handle: ".work-reorder-handle",
        forceFallback: !0,
        fallbackOnBody: !1,
        ghostClass: "work-drag-ghost",
        onEnd(s) {
          const v = s.oldDraggableIndex, p = s.newDraggableIndex;
          An(s, ".work-reorder-entry"), v !== void 0 && p !== void 0 && v !== p && e(v, p);
        }
      }));
    },
    unmounted: t
  };
}
const Pn = { class: "work-stack work-tight work-option-builder" }, Rn = { class: "work-stack work-tight" }, On = { class: "work-stack work-tight work-small" }, Nn = { class: "work-stack work-tight work-small" }, Mn = { class: "work-stack work-tight" }, Fn = { class: "work-stack work-tight work-small" }, Ln = { class: "work-row" }, zn = { class: "work-stack work-tight work-small" }, Bn = { class: "work-row" }, jn = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, qn = { class: "work-add-option" }, Wn = {
  key: 0,
  class: "work-muted work-small"
}, Kn = /* @__PURE__ */ ue({
  __name: "OptionsEditor",
  props: {
    field: {}
  },
  emits: ["validity"],
  setup(e, { emit: l }) {
    const t = e, a = l, o = "options:" + Zl(), s = Y(() => t.field.options ?? []), v = Y(() => s.value.every((u, y) => !!u.id && s.value.findIndex((m) => m.id === u.id) === y));
    xe(v, (u) => a("validity", u, o), { immediate: !0 }), nt(() => a("validity", !0, o));
    function p(u, y) {
      Fa(s.value, u, y - u), s.value.forEach((m, w) => m.order = w);
    }
    const f = io(p), i = ["primary", "success", "info", "warn", "danger", "secondary"];
    function n() {
      let u = s.value.length + 1;
      for (; s.value.some((y) => y.id === `option_${u}`); ) u++;
      (t.field.options ??= []).push({ id: `option_${u}`, label: "New option", order: s.value.length });
    }
    return (u, y) => (c(), g("section", Pn, [
      y[4] || (y[4] = d("header", { class: "work-row" }, [
        d("h4", null, "Options"),
        d("span", { class: "work-muted work-small" }, "Stable IDs keep existing values when labels change."),
        d("span", { class: "work-spacer" })
      ], -1)),
      _e((c(), g("div", Rn, [
        (c(!0), g(J, null, te(s.value, (m, w) => (c(), g("div", {
          key: w,
          class: "work-option-row work-reorder-entry"
        }, [
          b(r(H), {
            type: "button",
            class: "work-icon-button work-reorder-handle",
            "aria-label": "Drag option; arrow keys reorder",
            onKeydown: [
              Ae(be((C) => p(w, w - 1), ["prevent"]), ["up"]),
              Ae(be((C) => p(w, w + 1), ["prevent"]), ["down"])
            ],
            severity: "secondary",
            text: "",
            size: "small"
          }, {
            default: M(() => [
              b(r(Q), {
                icon: "tabler:grip-vertical",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["onKeydown"]),
          d("label", On, [
            y[0] || (y[0] = N("Label", -1)),
            b(r(de), {
              modelValue: m.label,
              "onUpdate:modelValue": (C) => m.label = C,
              "aria-label": "Option label"
            }, null, 8, ["modelValue", "onUpdate:modelValue"])
          ]),
          d("label", Nn, [
            y[1] || (y[1] = N("ID", -1)),
            b(r(de), {
              modelValue: m.id,
              "onUpdate:modelValue": (C) => m.id = C,
              class: "work-option-code",
              required: "",
              "aria-label": "Option ID"
            }, null, 8, ["modelValue", "onUpdate:modelValue"])
          ]),
          d("div", Mn, [
            d("label", Fn, [
              y[2] || (y[2] = N("Color", -1)),
              d("span", Ln, [
                d("span", {
                  class: pt(["work-color-swatch", "work-swatch-" + (m.color || "secondary")]),
                  "aria-hidden": "true"
                }, null, 2),
                b(r(le), {
                  modelValue: m.color,
                  "onUpdate:modelValue": (C) => m.color = C,
                  "aria-label": "Option color",
                  appendTo: "self",
                  optionLabel: "label",
                  optionValue: "value",
                  optionDisabled: "disabled",
                  options: [{ label: "Default", value: void 0, disabled: !1 }, ...(i ?? []).map((C) => ({ label: C, value: C, disabled: !1 }))]
                }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
              ])
            ]),
            d("label", zn, [
              y[3] || (y[3] = N("Category", -1)),
              b(r(le), {
                "model-value": m.category,
                "aria-label": "Option category",
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                showClear: "",
                options: ["triage", "backlog", ...r(Ma)].map((C) => ({ label: r(_l)(C), value: C })),
                "onUpdate:modelValue": (C) => m.category = C || void 0
              }, null, 8, ["model-value", "options", "onUpdate:modelValue"])
            ])
          ]),
          d("div", Bn, [
            b(r(H), {
              "aria-label": "Option earlier",
              severity: "secondary",
              size: "small",
              disabled: w === 0,
              onClick: (C) => p(w, w - 1),
              text: ""
            }, {
              default: M(() => [
                b(r(Q), {
                  icon: "tabler:arrow-up",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["disabled", "onClick"]),
            b(r(H), {
              "aria-label": "Option later",
              severity: "secondary",
              size: "small",
              disabled: w === s.value.length - 1,
              onClick: (C) => p(w, w + 1),
              text: ""
            }, {
              default: M(() => [
                b(r(Q), {
                  icon: "tabler:arrow-down",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["disabled", "onClick"]),
            b(r(H), {
              label: "Remove",
              "aria-label": "Remove option",
              severity: "secondary",
              text: "",
              size: "small",
              onClick: (C) => s.value.splice(w, 1)
            }, {
              icon: M(() => [
                b(r(Q), {
                  icon: "tabler:trash",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["onClick"])
          ])
        ]))), 128)),
        v.value ? D("", !0) : (c(), g("p", jn, "Option IDs must be nonempty and unique.")),
        d("div", qn, [
          b(r(H), {
            label: "Add option",
            severity: "secondary",
            size: "small",
            onClick: n,
            outlined: ""
          }, {
            icon: M(() => [
              b(r(Q), {
                icon: "tabler:plus",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          })
        ])
      ])), [
        [r(f)]
      ]),
      s.value.length ? D("", !0) : (c(), g("p", Wn, "Add the choices people can select for this field."))
    ]));
  }
});
function sa(e) {
  return Object.entries(Ge(e.properties)).map(([l, t]) => {
    const a = Ge(t);
    return { key: l, title: typeof a.title == "string" && a.title.trim() ? a.title : ye(l), description: typeof a.description == "string" ? a.description : "", schema: a };
  });
}
const no = (e) => e.type === "array" && Ge(e.items).type === "string";
function Gn(e, l) {
  const t = {};
  for (const a of sa(e)) {
    const o = l[a.key] ?? a.schema.default, s = a.schema;
    let v = "";
    if (o == null)
      Array.isArray(e.required) && e.required.includes(a.key) && (v = "A value is required.");
    else if (Array.isArray(s.enum) && !s.enum.includes(o)) v = "Choose one of the available values.";
    else if (s.type === "integer" || s.type === "number")
      typeof o != "number" || !Number.isFinite(o) || s.type === "integer" && !Number.isInteger(o) ? v = s.type === "integer" ? "Enter a whole number." : "Enter a number." : typeof s.minimum == "number" && o < s.minimum ? v = `Enter at least ${s.minimum}.` : typeof s.maximum == "number" && o > s.maximum && (v = `Enter at most ${s.maximum}.`);
    else if (s.type === "boolean" && typeof o != "boolean") v = "Choose on or off.";
    else if (s.type === "string") {
      if (typeof o != "string") v = "Enter text.";
      else if (typeof s.minLength == "number" && o.length < s.minLength) v = `Enter at least ${s.minLength} characters.`;
      else if (typeof s.maxLength == "number" && o.length > s.maxLength) v = `Enter at most ${s.maxLength} characters.`;
      else if (typeof s.pattern == "string")
        try {
          new RegExp(s.pattern).test(o) || (v = "Use the required format.");
        } catch {
          v = "The declared format is unavailable.";
        }
    } else if (s.type === "array") {
      if (!Array.isArray(o)) v = "Enter a list.";
      else if (typeof s.maxItems == "number" && o.length > s.maxItems) v = `Use at most ${s.maxItems} entries.`;
      else if (typeof s.minItems == "number" && o.length < s.minItems) v = `Use at least ${s.minItems} entries.`;
      else if (s.uniqueItems && new Set(o).size !== o.length) v = "Remove duplicate entries.";
      else if (no(s)) {
        const p = Ge(s.items);
        o.some((f) => typeof f != "string" || typeof p.minLength == "number" && f.length < p.minLength || typeof p.maxLength == "number" && f.length > p.maxLength) && (v = "Each entry must match the declared text length.");
      }
    } else s.type === "object" && (typeof o != "object" || Array.isArray(o)) && (v = "Enter an object.");
    v && (t[a.key] = v);
  }
  return t;
}
const Yn = { class: "work-stack" }, Hn = ["schema", "config"], Xn = {
  key: 1,
  role: "status",
  class: "work-muted work-small"
}, Jn = {
  key: 2,
  role: "alert",
  class: "kx-err"
}, Zn = { class: "work-config-fields" }, Qn = ["for"], _n = {
  key: 1,
  class: "work-config-chips"
}, es = {
  key: 6,
  class: "work-muted work-small"
}, ts = {
  key: 7,
  role: "alert",
  class: "work-error work-small"
}, ra = /* @__PURE__ */ ue({
  __name: "ConfigForm",
  props: {
    schema: {},
    modelValue: {},
    disabled: { type: Boolean }
  },
  emits: ["update:modelValue", "validity"],
  setup(e, { emit: l }) {
    const t = e, a = l, o = z({}), s = z(/* @__PURE__ */ new Set()), v = z(!1), p = z(!1), f = Y(() => sa(t.schema)), i = Y(() => Gn(t.schema, t.modelValue)), n = Y(() => f.value.filter((E) => typeof E.schema.picker == "string")), u = Y(() => f.value.filter((E) => typeof E.schema.picker != "string")), y = Y(() => ({ ...t.schema, properties: Object.fromEntries(n.value.map((E) => [E.key, { ...E.schema, title: E.title }])), required: Array.isArray(t.schema.required) ? t.schema.required.filter((E) => n.value.some(($) => $.key === E)) : [] })), m = Y(() => Object.fromEntries(n.value.map((E) => [E.key, t.modelValue[E.key]])));
    xe([i, s, () => n.value.length > 0 && !v.value], () => a("validity", !Object.keys(i.value).length && !s.value.size && (!n.value.length || v.value)), { immediate: !0, deep: !0 });
    async function w() {
      p.value = !0, v.value = await lt("wc-schema-form"), p.value = !1;
    }
    xe(() => n.value.length > 0, (E) => {
      E && w();
    }, { immediate: !0 }), nt(() => a("validity", !0));
    function C(E, $) {
      const V = { ...t.modelValue };
      $ == null ? delete V[E] : V[E] = $, a("update:modelValue", V);
    }
    function A(E) {
      const $ = t.modelValue[E];
      return Array.isArray($) ? $.filter((V) => typeof V == "string") : [];
    }
    function U(E) {
      const $ = o.value[E]?.trim();
      $ && (C(E, [...A(E), $]), o.value[E] = "");
    }
    function G(E, $) {
      $ ? s.value.delete(E) : s.value.add(E);
    }
    function F(E) {
      a("update:modelValue", { ...t.modelValue, ...Ge(E.detail) });
    }
    return (E, $) => (c(), g("div", Yn, [
      n.value.length && v.value ? (c(), g("wc-schema-form", {
        key: 0,
        class: "work-config-widget",
        schema: JSON.stringify(y.value),
        config: JSON.stringify(m.value),
        onConfigChanged: F
      }, null, 40, Hn)) : n.value.length && p.value ? (c(), g("p", Xn, "The configuration widget is loading.")) : n.value.length ? (c(), g("p", Jn, [
        $[0] || ($[0] = N("The configuration widget is unavailable.", -1)),
        b(r(H), {
          label: "Reload configuration widget",
          severity: "secondary",
          outlined: "",
          onClick: w
        })
      ])) : D("", !0),
      d("div", Zn, [
        (c(!0), g(J, null, te(u.value, (V) => (c(), g("div", {
          key: V.key,
          class: "work-config-field"
        }, [
          d("label", {
            class: "work-config-label",
            for: "config-" + V.key
          }, I(V.title), 9, Qn),
          Array.isArray(V.schema.enum) ? (c(), B(r(le), {
            key: 0,
            "input-id": "config-" + V.key,
            "model-value": e.modelValue[V.key] ?? V.schema.default,
            options: V.schema.enum,
            appendTo: "self",
            "aria-label": V.title,
            disabled: e.disabled,
            "onUpdate:modelValue": (T) => C(V.key, T)
          }, null, 8, ["input-id", "model-value", "options", "aria-label", "disabled", "onUpdate:modelValue"])) : r(no)(V.schema) ? (c(), g("div", _n, [
            (c(!0), g(J, null, te(A(V.key), (T, ae) => (c(), B(r(Bo), {
              key: ae,
              label: T,
              removable: !e.disabled,
              onRemove: (L) => C(V.key, A(V.key).filter((j, R) => R !== ae))
            }, null, 8, ["label", "removable", "onRemove"]))), 128)),
            b(r(de), {
              id: "config-" + V.key,
              modelValue: o.value[V.key],
              "onUpdate:modelValue": (T) => o.value[V.key] = T,
              "aria-label": "Add " + V.title.toLocaleLowerCase(),
              disabled: e.disabled,
              placeholder: "Type and press Enter",
              onKeydown: Ae(be((T) => U(V.key), ["stop", "prevent"]), ["enter"]),
              onBlur: (T) => U(V.key)
            }, null, 8, ["id", "modelValue", "onUpdate:modelValue", "aria-label", "disabled", "onKeydown", "onBlur"])
          ])) : ["integer", "number"].includes(String(V.schema.type)) ? (c(), B(r(Ye), {
            key: 2,
            "input-id": "config-" + V.key,
            "model-value": e.modelValue[V.key] ?? V.schema.default,
            "max-fraction-digits": V.schema.type === "integer" ? 0 : 8,
            "use-grouping": !1,
            "aria-label": V.title,
            disabled: e.disabled,
            invalid: !!i.value[V.key],
            "onUpdate:modelValue": (T) => C(V.key, T)
          }, null, 8, ["input-id", "model-value", "max-fraction-digits", "aria-label", "disabled", "invalid", "onUpdate:modelValue"])) : V.schema.type === "boolean" ? (c(), B(r(Le), {
            key: 3,
            "input-id": "config-" + V.key,
            "model-value": !!(e.modelValue[V.key] ?? V.schema.default),
            "aria-label": V.title,
            disabled: e.disabled,
            "onUpdate:modelValue": (T) => C(V.key, T)
          }, null, 8, ["input-id", "model-value", "aria-label", "disabled", "onUpdate:modelValue"])) : ["array", "object"].includes(String(V.schema.type)) ? (c(), B(ot, {
            key: 4,
            label: V.title,
            "model-value": e.modelValue[V.key],
            shape: V.schema.type === "array" ? "array" : "object",
            example: V.schema.default ?? (V.schema.type === "array" ? [] : {}),
            "onUpdate:modelValue": (T) => C(V.key, T),
            onValidity: (T) => G(V.key, T)
          }, null, 8, ["label", "model-value", "shape", "example", "onUpdate:modelValue", "onValidity"])) : (c(), B(r(de), {
            key: 5,
            id: "config-" + V.key,
            "model-value": e.modelValue[V.key] ?? V.schema.default ?? "",
            disabled: e.disabled,
            invalid: !!i.value[V.key],
            "aria-label": V.title,
            "onUpdate:modelValue": (T) => C(V.key, T)
          }, null, 8, ["id", "model-value", "disabled", "invalid", "aria-label", "onUpdate:modelValue"])),
          V.description ? (c(), g("p", es, I(V.description), 1)) : D("", !0),
          i.value[V.key] ? (c(), g("p", ts, I(i.value[V.key]), 1)) : D("", !0)
        ]))), 128))
      ])
    ]));
  }
}), ls = {
  class: "work-stack",
  "aria-label": "Fields editor"
}, as = { class: "work-section-heading" }, os = {
  key: 0,
  class: "work-used-by"
}, is = { class: "kx-tag-sm" }, ns = { class: "work-small work-muted" }, ss = {
  key: 0,
  class: "work-error work-small",
  role: "alert"
}, rs = { class: "work-settings-grid work-field-properties" }, ds = { class: "work-stack work-tight" }, us = { class: "work-stack work-tight" }, cs = { class: "work-stack work-tight" }, vs = { class: "work-stack work-tight" }, ms = { class: "work-stack work-tight" }, fs = { class: "work-stack work-tight work-field-history" }, ps = { class: "work-settings-list" }, bs = { class: "work-settings-row" }, hs = { class: "work-settings-row" }, ys = {
  key: 2,
  class: "work-stack work-tight"
}, gs = {
  key: 3,
  class: "work-stack work-tight"
}, ks = { class: "work-stack work-tight" }, ws = { class: "work-stack work-tight" }, Vs = { class: "work-stack work-tight" }, $s = { class: "work-stack work-tight" }, xs = { class: "work-stack" }, Cs = {
  key: 0,
  class: "work-stack work-tight"
}, Ss = { class: "work-row work-add-definition" }, Ts = { class: "work-stack work-tight" }, Us = /* @__PURE__ */ ue({
  __name: "FieldsEditor",
  props: {
    draft: {},
    guardRemoval: { type: Function },
    issues: {},
    boardId: {},
    installedTypes: {}
  },
  emits: ["validity"],
  setup(e, { emit: l }) {
    const t = e, a = l, o = Y(() => t.draft.fields ?? []), s = z(""), v = z(""), p = z({}), f = io(($, V) => G($, V - $));
    function i($) {
      return (t.draft.item_types ?? []).filter((V) => V.fields.includes($)).map((V) => V.title || ye(V.id));
    }
    async function n($) {
      if (!v.value) {
        v.value = $.code;
        try {
          const V = await t.guardRemoval?.("fields", $.code);
          p.value[$.code] = V ?? "", V || el(t.draft, "fields", $.code);
        } finally {
          v.value = "";
        }
      }
    }
    const u = Object.entries({ text: "Text", int: "Whole number", dec: "Decimal number", quantity: "Measurement", bool: "Yes or no", time: "Date or time", ref: "Reference", record: "Structured data", option: "Choice", principal: "Person or group", item: "Work item", rank: "Order", rich_text: "Formatted text", formula: "Formula", rollup: "Related item calculation", counter: "Counter" }).map(([$, V]) => ({ value: $, label: V }));
    function y($) {
      return $.type && $.type !== "value" ? $.type : $.form ?? "text";
    }
    const m = Y(() => new Map(t.installedTypes?.map(($) => [$.id, $])));
    function w($) {
      const V = m.value.get(y($))?.config_schema;
      return V && sa(V).length ? V : void 0;
    }
    function C($) {
      const V = m.value.get(y($)), T = V?.form ?? $.form;
      return !!V?.config_schema || ["dec", "quantity", "ref", "time", "record"].includes(T ?? "") || !!$.config;
    }
    function A($, V) {
      $.type = V, delete $.form;
    }
    function U($, V) {
      const T = { option: "text", principal: "ref", item: "ref", rank: "text", rich_text: "text", formula: "int", rollup: "int", counter: "int" };
      T[V] ? ($.type = V, $.form = T[V]) : (delete $.type, $.form = V), V !== "option" ? delete $.options : $.options ??= [], V === "rich_text" && ($.config = { format: "json" });
    }
    function G($, V) {
      Fa(o.value, $, V);
      for (const T of t.draft.item_types ?? []) {
        const ae = new Set(T.fields);
        T.fields = o.value.filter((L) => ae.has(L.code)).map((L) => L.code);
      }
    }
    function F($, V) {
      try {
        Co(t.draft, $, V.value), delete p.value[$.code];
      } catch (T) {
        p.value[$.code] = T.message, V.value = $.code;
      }
    }
    function E() {
      !/^[a-z][a-z0-9_]*$/.test(s.value) || o.value.some(($) => $.code === s.value) || ((t.draft.fields ??= []).push({ code: s.value, form: "text", cardinality: "one" }), s.value = "");
    }
    return ($, V) => (c(), g("section", ls, [
      d("header", as, [
        V[2] || (V[2] = d("div", null, [
          d("h2", null, "Fields"),
          d("p", { class: "work-muted work-small" }, "Shape the information each item carries. Drag the handle or use the arrows to arrange fields.")
        ], -1)),
        b(r(Re), {
          class: "kx-tag-sm",
          severity: "secondary"
        }, {
          default: M(() => [
            N(I(o.value.length) + " " + I(o.value.length === 1 ? "field" : "fields"), 1)
          ]),
          _: 1
        })
      ]),
      _e((c(), B(xl, {
        columns: "fields",
        count: o.value.length
      }, {
        default: M(() => [
          (c(!0), g(J, null, te(o.value, (T, ae) => (c(), B($l, {
            title: r(St)(T),
            code: T.code,
            kind: m.value.get(y(T))?.title || r(u).find((L) => L.value === y(T))?.label || r(ye)(y(T)),
            key: T.id ?? ae,
            class: "work-field-row work-reorder-entry work-stack"
          }, {
            handle: M(() => [
              b(r(H), {
                type: "button",
                class: "work-reorder-handle work-icon-button",
                "aria-label": "Drag " + T.code + "; arrow keys reorder",
                onKeydown: [
                  Ae(be((L) => G(ae, -1), ["prevent"]), ["up"]),
                  Ae(be((L) => G(ae, 1), ["prevent"]), ["down"])
                ],
                severity: "secondary",
                text: "",
                size: "small"
              }, {
                default: M(() => [
                  b(r(Q), {
                    icon: "tabler:grip-vertical",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["aria-label", "onKeydown"])
            ]),
            flags: M(() => [
              T.track ? (c(), B(r(Re), {
                key: 0,
                class: "kx-tag-sm",
                severity: "secondary",
                value: "Tracked"
              })) : D("", !0),
              T.intervals ? (c(), B(r(Re), {
                key: 1,
                class: "kx-tag-sm",
                severity: "secondary",
                value: "Intervals"
              })) : D("", !0)
            ]),
            usage: M(() => [
              i(T.code).length ? (c(), g("details", os, [
                d("summary", is, "Used by " + I(i(T.code).length) + " " + I(i(T.code).length === 1 ? "type" : "types"), 1),
                d("span", ns, I(i(T.code).join(", ")), 1)
              ])) : D("", !0)
            ]),
            actions: M(() => [
              b(r(H), {
                "aria-label": "Move " + T.code + " earlier",
                severity: "secondary",
                disabled: ae === 0,
                onClick: (L) => G(ae, -1),
                text: "",
                size: "small"
              }, {
                default: M(() => [
                  b(r(Q), {
                    icon: "tabler:arrow-up",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["aria-label", "disabled", "onClick"]),
              b(r(H), {
                "aria-label": "Move " + T.code + " later",
                severity: "secondary",
                disabled: ae === o.value.length - 1,
                onClick: (L) => G(ae, 1),
                text: "",
                size: "small"
              }, {
                default: M(() => [
                  b(r(Q), {
                    icon: "tabler:arrow-down",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["aria-label", "disabled", "onClick"]),
              b(r(H), {
                severity: "secondary",
                text: "",
                size: "small",
                disabled: !!v.value,
                onClick: (L) => n(T),
                "aria-label": "Remove field"
              }, {
                default: M(() => [
                  b(r(Q), {
                    icon: "tabler:trash",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["disabled", "onClick"])
            ]),
            default: M(() => [
              p.value[T.code] ? (c(), g("p", ss, I(p.value[T.code]), 1)) : D("", !0),
              (c(!0), g(J, null, te(e.issues?.filter((L) => L.code === T.code) ?? [], (L) => (c(), g("p", {
                key: L.what,
                class: "work-error work-small",
                role: "alert"
              }, I(r(Vl)(L)), 1))), 128)),
              d("div", rs, [
                d("label", ds, [
                  V[3] || (V[3] = N("Title", -1)),
                  b(r(de), {
                    modelValue: T.title,
                    "onUpdate:modelValue": (L) => T.title = L,
                    "aria-label": "Field title",
                    maxlength: "255",
                    placeholder: r(St)(T)
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder"])
                ]),
                d("label", us, [
                  V[4] || (V[4] = N("Field identifier", -1)),
                  b(r(de), {
                    value: T.code,
                    "aria-label": "Field code",
                    required: "",
                    pattern: "[a-z][a-z0-9_]*",
                    onInput: (L) => F(T, L.target)
                  }, null, 8, ["value", "onInput"])
                ]),
                d("label", cs, [
                  V[5] || (V[5] = N("Kind", -1)),
                  b(r(le), {
                    "model-value": y(T),
                    "onUpdate:modelValue": (L) => U(T, L),
                    appendTo: "self",
                    options: r(u),
                    optionLabel: "label",
                    optionValue: "value"
                  }, null, 8, ["model-value", "onUpdate:modelValue", "options"])
                ]),
                d("label", vs, [
                  V[6] || (V[6] = N("Values allowed", -1)),
                  b(r(le), {
                    "model-value": T.cardinality ?? "one",
                    "onUpdate:modelValue": (L) => T.cardinality = L,
                    appendTo: "self",
                    options: [{ label: "One value", value: "one" }, { label: "Multiple unique values", value: "set" }, { label: "Ordered values", value: "list" }],
                    optionLabel: "label",
                    optionValue: "value"
                  }, null, 8, ["model-value", "onUpdate:modelValue"])
                ]),
                d("label", ms, [
                  V[7] || (V[7] = N("Search support", -1)),
                  b(r(le), {
                    "model-value": T.index ?? "none",
                    "onUpdate:modelValue": (L) => T.index = L,
                    appendTo: "self",
                    options: [{ label: "None", value: "none" }, { label: "Exact matches", value: "key" }, { label: "Numeric ranges", value: "number" }],
                    optionLabel: "label",
                    optionValue: "value"
                  }, null, 8, ["model-value", "onUpdate:modelValue"])
                ])
              ]),
              d("section", fs, [
                V[10] || (V[10] = d("h4", { class: "work-group-title" }, "History", -1)),
                d("div", ps, [
                  d("div", bs, [
                    V[8] || (V[8] = d("div", { class: "work-row-main" }, [
                      d("strong", null, "Track changes"),
                      d("p", { class: "work-muted work-small" }, "Record each value change in the item history.")
                    ], -1)),
                    b(r(Le), {
                      modelValue: T.track,
                      "onUpdate:modelValue": (L) => T.track = L,
                      "aria-label": "Track changes"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ]),
                  d("div", hs, [
                    V[9] || (V[9] = d("div", { class: "work-row-main" }, [
                      d("strong", null, "Track intervals"),
                      d("p", { class: "work-muted work-small" }, "Measure how long each value stays in effect.")
                    ], -1)),
                    b(r(Le), {
                      modelValue: T.intervals,
                      "onUpdate:modelValue": (L) => T.intervals = L,
                      "aria-label": "Track intervals"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ])
                ])
              ]),
              T.type === "option" ? (c(), B(Kn, {
                key: 1,
                field: T,
                onValidity: V[0] || (V[0] = (L, j) => a("validity", j, L))
              }, null, 8, ["field"])) : D("", !0),
              T.type === "formula" || T.type === "rollup" ? (c(), g("label", ys, [
                V[11] || (V[11] = N("Result type", -1)),
                b(r(le), {
                  modelValue: T.form,
                  "onUpdate:modelValue": (L) => T.form = L,
                  "aria-label": "Result type",
                  options: r(u).slice(0, 8),
                  optionLabel: "label",
                  optionValue: "value",
                  appendTo: "self"
                }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
              ])) : D("", !0),
              T.type === "formula" ? (c(), g("label", gs, [
                V[12] || (V[12] = N("Expression", -1)),
                b(r(de), {
                  modelValue: T.expression,
                  "onUpdate:modelValue": (L) => T.expression = L
                }, null, 8, ["modelValue", "onUpdate:modelValue"])
              ])) : D("", !0),
              T.type === "rollup" ? (c(), g(J, { key: 4 }, [
                d("label", ks, [
                  V[13] || (V[13] = N("Of", -1)),
                  b(r(de), {
                    modelValue: T.of,
                    "onUpdate:modelValue": (L) => T.of = L
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                d("label", ws, [
                  V[14] || (V[14] = N("Function", -1)),
                  b(r(de), {
                    modelValue: T.fn,
                    "onUpdate:modelValue": (L) => T.fn = L
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                d("label", Vs, [
                  V[15] || (V[15] = N("Field", -1)),
                  b(r(de), {
                    modelValue: T.field,
                    "onUpdate:modelValue": (L) => T.field = L
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                d("label", $s, [
                  V[16] || (V[16] = N("Order by", -1)),
                  b(r(le), {
                    "model-value": T.by,
                    "aria-label": "Rollup order",
                    options: ["rank", "time"],
                    showClear: "",
                    appendTo: "self",
                    "onUpdate:modelValue": (L) => T.by = L || void 0
                  }, null, 8, ["model-value", "onUpdate:modelValue"])
                ]),
                b(ta, {
                  modelValue: T.where,
                  "onUpdate:modelValue": (L) => T.where = L,
                  draft: e.draft,
                  "board-id": e.boardId,
                  label: "Include related items when",
                  onValidity: (L) => a("validity", "rollup-" + ae, L)
                }, null, 8, ["modelValue", "onUpdate:modelValue", "draft", "board-id", "onValidity"])
              ], 64)) : D("", !0),
              w(T) ? (c(), B(ra, {
                key: T.type,
                schema: w(T),
                "model-value": T.config ?? {},
                "onUpdate:modelValue": (L) => T.config = L,
                onValidity: (L) => a("validity", "config-" + ae, L)
              }, null, 8, ["schema", "model-value", "onUpdate:modelValue", "onValidity"])) : C(T) ? (c(), B(ot, {
                key: 6,
                label: "Field configuration",
                "model-value": T.config,
                shape: "object",
                "onUpdate:modelValue": (L) => T.config = L,
                onValidity: (L) => a("validity", "config-" + ae, L)
              }, null, 8, ["model-value", "onUpdate:modelValue", "onValidity"])) : D("", !0),
              d("section", xs, [
                V[18] || (V[18] = d("h4", { class: "work-group-title" }, "Access", -1)),
                e.installedTypes?.length ? (c(), g("label", Cs, [
                  V[17] || (V[17] = N("Custom field type", -1)),
                  b(r(le), {
                    "aria-label": "Custom field type",
                    "model-value": T.type,
                    options: e.installedTypes,
                    optionLabel: "title",
                    optionValue: "id",
                    appendTo: "self",
                    "onUpdate:modelValue": (L) => A(T, L)
                  }, null, 8, ["model-value", "options", "onUpdate:modelValue"])
                ])) : D("", !0),
                (c(), g(J, null, te(["read", "write"], (L) => b(Wa, {
                  "board-id": e.boardId,
                  key: L,
                  label: L === "read" ? "Who can read" : "Who can edit",
                  "model-value": T.access?.[L],
                  "onUpdate:modelValue": (j) => T.access = { ...T.access, [L]: j },
                  onValidity: (j) => a("validity", "access-" + ae + L, j)
                }, null, 8, ["board-id", "label", "model-value", "onUpdate:modelValue", "onValidity"])), 64))
              ])
            ]),
            _: 2
          }, 1032, ["title", "code", "kind"]))), 128)),
          d("div", Ss, [
            d("label", Ts, [
              V[19] || (V[19] = N("New field identifier", -1)),
              b(r(de), {
                modelValue: s.value,
                "onUpdate:modelValue": V[1] || (V[1] = (T) => s.value = T),
                onKeydown: Ae(be(E, ["prevent"]), ["enter"])
              }, null, 8, ["modelValue", "onKeydown"])
            ]),
            b(r(H), {
              label: "Add field",
              severity: "secondary",
              disabled: !s.value.trim(),
              onClick: E,
              outlined: ""
            }, {
              icon: M(() => [
                b(r(Q), {
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
        [r(f)]
      ])
    ]));
  }
}), Es = ["disabled"], Ds = { class: "work-chips" }, Is = {
  key: 1,
  class: "work-muted work-small"
}, zt = /* @__PURE__ */ ue({
  __name: "ChipPicker",
  props: {
    label: {},
    options: {},
    modelValue: {},
    disabled: { type: Boolean }
  },
  emits: ["update:modelValue"],
  setup(e, { emit: l }) {
    const t = e, a = l, o = z(""), s = Y(() => t.options.map((f) => typeof f == "string" ? { value: f } : f)), v = Y(() => s.value.filter((f) => (f.label ?? ye(f.value)).toLocaleLowerCase().includes(o.value.toLocaleLowerCase())));
    function p(f) {
      if (t.disabled) return;
      const i = t.modelValue ?? [];
      a("update:modelValue", i.includes(f) ? i.filter((n) => n !== f) : [...i, f]);
    }
    return (f, i) => (c(), g("fieldset", {
      class: "work-chip-picker",
      disabled: e.disabled
    }, [
      d("legend", null, I(e.label), 1),
      e.options.length > 10 ? (c(), B(r(de), {
        key: 0,
        modelValue: o.value,
        "onUpdate:modelValue": i[0] || (i[0] = (n) => o.value = n),
        type: "search",
        "aria-label": "Find " + e.label.toLowerCase(),
        placeholder: "Find a choice…"
      }, null, 8, ["modelValue", "aria-label"])) : D("", !0),
      d("div", Ds, [
        b(r(ea), {
          "model-value": e.modelValue ?? [],
          options: v.value.map((n) => ({ value: n.value, label: n.label ?? r(ye)(n.value) })),
          optionLabel: "label",
          optionValue: "value",
          multiple: "",
          disabled: e.disabled,
          "aria-label": e.label,
          "onUpdate:modelValue": i[1] || (i[1] = (n) => a("update:modelValue", n ?? []))
        }, null, 8, ["model-value", "options", "disabled", "aria-label"]),
        (c(!0), g(J, null, te(e.modelValue?.filter((n) => !s.value.some((u) => u.value === n)) ?? [], (n) => (c(), B(r(H), {
          severity: "secondary",
          text: "",
          size: "small",
          key: n,
          type: "button",
          class: "work-choice work-unavailable",
          "aria-label": "Remove unavailable " + n,
          onClick: (u) => p(n)
        }, {
          default: M(() => [
            N(I(r(ye)(n)) + " · unavailable ×", 1)
          ]),
          _: 2
        }, 1032, ["aria-label", "onClick"]))), 128))
      ]),
      e.options.length ? D("", !0) : (c(), g("span", Is, "No choices declared."))
    ], 8, Es));
  }
}), As = {
  class: "work-stack",
  "aria-label": "Item types editor"
}, Ps = { class: "work-section-heading" }, Rs = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, Os = { class: "work-definition-meta" }, Ns = { class: "work-settings-grid" }, Ms = { class: "work-stack work-tight" }, Fs = { class: "work-stack work-tight" }, Ls = { class: "work-stack work-tight" }, zs = { class: "work-stack work-tight" }, Bs = {
  key: 0,
  class: "work-stack work-tight work-small"
}, js = {
  key: 0,
  class: "kx-empty"
}, qs = { class: "work-row work-add-definition" }, Ws = { class: "work-stack work-tight" }, Ks = {
  key: 0,
  class: "work-error work-small"
}, Gs = /* @__PURE__ */ ue({
  __name: "TypesEditor",
  props: {
    draft: {},
    guardRemoval: { type: Function },
    issues: {}
  },
  setup(e) {
    const l = e, t = Y(() => l.draft.item_types ?? []), a = z(""), o = z(""), s = z(""), v = Y(() => /^[a-z][a-z0-9_]*$/.test(a.value) && !t.value.some((y) => y.id === a.value));
    function p() {
      v.value && ((l.draft.item_types ??= []).push({ id: a.value, title: ye(a.value), process: l.draft.processes?.[0]?.id ?? "", fields: [] }), a.value = "");
    }
    function f(y, m) {
      const w = y.id;
      y.id = m;
      for (const C of t.value) C.parent_types && (C.parent_types = C.parent_types.map((A) => A === w ? m : A));
    }
    function i(y, m) {
      y.fields = m, y.inherit && (y.inherit = y.inherit.filter((w) => m.includes(w)));
    }
    function n(y) {
      return t.value.filter((m) => m.id !== y.id && m.parent_types?.includes(y.id)).map((m) => m.title || ye(m.id));
    }
    async function u(y) {
      if (!s.value) {
        if (n(y).length) {
          o.value = `${y.title || ye(y.id)} is a parent type for ${n(y).join(", ")}. Remove those parent selections first.`;
          return;
        }
        s.value = y.id, o.value = "";
        try {
          const m = await l.guardRemoval?.("item_types", y.id);
          m ? o.value = m : el(l.draft, "item_types", y.id);
        } finally {
          s.value = "";
        }
      }
    }
    return (y, m) => (c(), g("section", As, [
      d("header", Ps, [
        m[1] || (m[1] = d("div", null, [
          d("h2", null, "Item types"),
          d("p", { class: "work-muted work-small" }, "Choose the fields, parent relationships and process for each kind of work.")
        ], -1)),
        b(r(Re), {
          class: "kx-tag-sm",
          severity: "secondary"
        }, {
          default: M(() => [
            N(I(t.value.length) + " " + I(t.value.length === 1 ? "type" : "types"), 1)
          ]),
          _: 1
        })
      ]),
      o.value ? (c(), g("p", Rs, I(o.value), 1)) : D("", !0),
      b(xl, {
        columns: "types",
        count: t.value.length
      }, {
        default: M(() => [
          (c(!0), g(J, null, te(t.value, (w, C) => (c(), B($l, {
            title: w.title || r(ye)(w.id),
            code: w.id,
            kind: e.draft.processes?.find((A) => A.id === w.process)?.name || r(ye)(w.process),
            key: C,
            class: "work-type-card"
          }, {
            usage: M(() => [
              d("span", Os, [
                b(r(Re), {
                  class: "kx-tag-sm",
                  severity: "secondary"
                }, {
                  default: M(() => [
                    N(I(w.fields.length) + " " + I(w.fields.length === 1 ? "field" : "fields"), 1)
                  ]),
                  _: 2
                }, 1024),
                n(w).length ? (c(), B(r(Re), {
                  key: 0,
                  class: "kx-tag-sm",
                  severity: "secondary"
                }, {
                  default: M(() => [
                    N("Parent of " + I(n(w).join(", ")), 1)
                  ]),
                  _: 2
                }, 1024)) : D("", !0)
              ])
            ]),
            actions: M(() => [
              b(r(H), {
                severity: "secondary",
                text: "",
                size: "small",
                disabled: !!s.value,
                onClick: (A) => u(w),
                "aria-label": "Remove type"
              }, {
                default: M(() => [
                  b(r(Q), {
                    icon: "tabler:trash",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["disabled", "onClick"])
            ]),
            default: M(() => [
              (c(!0), g(J, null, te(e.issues?.filter((A) => A.code === "item_type " + w.id) ?? [], (A) => (c(), g("p", {
                key: A.what,
                class: "work-error work-small",
                role: "alert"
              }, I(r(Vl)(A)), 1))), 128)),
              d("div", Ns, [
                d("label", Ms, [
                  m[2] || (m[2] = N("Identifier", -1)),
                  b(r(de), {
                    value: w.id,
                    onChange: (A) => f(w, A.target.value),
                    required: "",
                    pattern: "[a-z][a-z0-9_]*"
                  }, null, 8, ["value", "onChange"])
                ]),
                d("label", Fs, [
                  m[3] || (m[3] = N("Title", -1)),
                  b(r(de), {
                    modelValue: w.title,
                    "onUpdate:modelValue": (A) => w.title = A,
                    placeholder: r(ye)(w.id)
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder"])
                ]),
                d("label", Ls, [
                  m[4] || (m[4] = N("Process", -1)),
                  b(r(le), {
                    modelValue: w.process,
                    "onUpdate:modelValue": (A) => w.process = A,
                    required: "",
                    appendTo: "self",
                    optionLabel: "label",
                    optionValue: "value",
                    optionDisabled: "disabled",
                    options: [...(e.draft.processes ?? []).map((A) => ({ label: A.name || r(ye)(A.id), value: A.id, disabled: !1 }))]
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                ])
              ]),
              b(zt, {
                label: "Fields",
                options: (e.draft.fields ?? []).map((A) => ({ value: A.code, label: r(St)(A) })),
                "model-value": w.fields,
                "onUpdate:modelValue": (A) => i(w, A)
              }, null, 8, ["options", "model-value", "onUpdate:modelValue"]),
              b(zt, {
                label: "Parent types",
                options: t.value.map((A) => ({ value: A.id, label: A.title || r(ye)(A.id) })),
                modelValue: w.parent_types,
                "onUpdate:modelValue": (A) => w.parent_types = A
              }, null, 8, ["options", "modelValue", "onUpdate:modelValue"]),
              d("div", zs, [
                b(zt, {
                  label: "Inherit from parent",
                  options: w.fields.map((A) => ({ value: A, label: r(St)(e.draft.fields?.find((U) => U.code === A) ?? { code: A }) })),
                  modelValue: w.inherit,
                  "onUpdate:modelValue": (A) => w.inherit = A
                }, null, 8, ["options", "modelValue", "onUpdate:modelValue"]),
                m[5] || (m[5] = d("p", { class: "work-muted work-small" }, "These fields resolve from the parent when this item has no own value.", -1))
              ]),
              w.parent_types?.length ? (c(), g("label", Bs, [
                m[6] || (m[6] = N("When the parent moves", -1)),
                b(r(le), {
                  modelValue: w.move_children,
                  "onUpdate:modelValue": (A) => w.move_children = A,
                  appendTo: "self",
                  optionLabel: "label",
                  optionValue: "value",
                  optionDisabled: "disabled",
                  options: [{ label: "Default", value: void 0, disabled: !1 }, { label: "Move children", value: "move", disabled: !1 }, { label: "Refuse while children exist", value: "refuse", disabled: !1 }]
                }, null, 8, ["modelValue", "onUpdate:modelValue"])
              ])) : D("", !0)
            ]),
            _: 2
          }, 1032, ["title", "code", "kind"]))), 128)),
          t.value.length ? D("", !0) : (c(), g("p", js, "Add an item type to connect fields to a process.")),
          d("div", qs, [
            d("label", Ws, [
              m[7] || (m[7] = N("New type identifier", -1)),
              b(r(de), {
                modelValue: a.value,
                "onUpdate:modelValue": m[0] || (m[0] = (w) => a.value = w),
                placeholder: "new_type",
                onKeydown: Ae(be(p, ["prevent"]), ["enter"])
              }, null, 8, ["modelValue", "onKeydown"])
            ]),
            b(r(H), {
              label: "Add type",
              severity: "secondary",
              disabled: !v.value,
              onClick: p,
              outlined: ""
            }, {
              icon: M(() => [
                b(r(Q), {
                  icon: "tabler:plus",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["disabled"]),
            a.value && !v.value ? (c(), g("span", Ks, "Use a unique lowercase identifier with letters, numbers and underscores.")) : D("", !0)
          ])
        ]),
        _: 1
      }, 8, ["count"])
    ]));
  }
}), Ys = ".work-process-canvas>svg{height:480px;width:100%}.work-process-canvas:focus-visible{outline:var(--p-focus-ring-width) var(--p-focus-ring-style) var(--p-focus-ring-color);outline-offset:var(--p-focus-ring-offset)}.work-state-card{fill:var(--p-content-background);stroke:var(--p-content-border-color);stroke-width:1.5}.work-graph-node.work-selected .work-state-card{stroke:var(--p-primary-color);stroke-width:2.5;fill:color-mix(in srgb,var(--p-primary-color) 6%,var(--p-content-background))}.work-graph-node:focus-visible .work-state-card{stroke:var(--p-focus-ring-color);stroke-width:var(--p-focus-ring-width)}.work-process-canvas .work-edge-label{font-size:12px;fill:var(--p-text-color)}.work-process-canvas .work-edge-label-bg{fill:var(--p-content-background);stroke:var(--p-content-border-color);stroke-width:1}.work-edge-line{stroke:var(--p-primary-color);stroke-width:1.5}.work-edge-return .work-edge-line{stroke:var(--p-text-muted-color);stroke-dasharray:5 4}.work-graph-arrow{fill:context-stroke}.work-lane-line{fill:none;stroke:var(--p-text-muted-color);stroke-width:1.5;stroke-dasharray:2 4}.work-node-connector{fill:var(--p-content-background);stroke:var(--p-primary-color);stroke-width:1.5}.work-node-connector:hover,.work-node-connector:focus-visible{fill:var(--p-primary-color)}.work-process-legend{position:static;flex-wrap:wrap;padding:10px 16px;border-top:1px solid var(--p-content-border-color);background:var(--p-content-background)}@media(max-width:700px){.work-process-canvas>svg{height:420px}}.work-process-more{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:8px;padding:8px 16px;border-top:1px solid var(--p-content-border-color);background:var(--p-content-background);color:var(--p-text-muted-color);font-size:12px}.work-process-canvas .work-graph-edge.work-selected .work-edge-label-bg{fill:var(--p-primary-color);stroke:var(--p-primary-color)}.work-process-canvas .work-graph-edge.work-selected .work-edge-label{fill:var(--p-primary-contrast-color)}", Sa = /* @__PURE__ */ new WeakSet();
function Hs(e) {
  const l = e.getRootNode();
  if (l instanceof ShadowRoot && !Sa.has(l)) {
    const t = e.ownerDocument.createElement("style");
    t.textContent = Ys, l.append(t), Sa.add(l);
  }
}
const Xs = 0.8;
function Js(e, l, t) {
  const a = Math.min(1, l.width / e.width, l.height / e.height);
  if (a >= Xs) return { zoom: a, pan: { x: (e.width - l.width / a) / 2, y: (e.height - l.height / a) / 2 } };
  const o = e.nodes.find((v) => v.state.id === t) ?? e.nodes[0], s = Math.min(1, l.width / ((o?.width ?? 190) + 64));
  return { zoom: s, pan: o ? { x: e.direction === "TB" ? o.x - l.width / s / 2 : o.x - o.width / 2 - 32, y: e.direction === "TB" ? o.y - o.height / 2 - 32 : o.y - l.height / s / 2 } : { x: 0, y: 0 } };
}
const Zs = ["onKeydown"], Qs = {
  key: 0,
  class: "work-process-instruction",
  role: "status"
}, _s = ["viewBox"], er = ["id"], tr = ["d", "marker-end"], lr = ["aria-label", "aria-pressed", "onFocus", "onClick", "onKeydown"], ar = ["d"], or = ["d", "marker-end"], ir = ["x", "y", "width", "height"], nr = ["x", "y"], sr = ["x", "dy"], rr = ["aria-label", "aria-pressed", "onClick", "onKeydown", "onFocus", "onPointerup"], dr = ["x", "y", "width", "height"], ur = ["cx", "cy"], cr = ["x", "y"], vr = ["x", "dy"], mr = ["x", "y"], fr = ["x", "dy"], pr = {
  key: 0,
  class: "work-limit-text"
}, br = ["aria-label", "onClick", "onKeydown"], hr = ["x", "y"], yr = ["x", "dy"], gr = ["cx", "cy", "aria-label", "onPointerdown", "onClick", "onKeydown"], kr = ["d"], wr = {
  key: 1,
  class: "work-process-more",
  role: "status"
}, Vr = { class: "work-process-legend" }, $r = /* @__PURE__ */ ue({
  __name: "ProcessGraph",
  props: {
    process: {},
    draft: {},
    selectedState: {},
    selectedTransition: {}
  },
  emits: ["state", "transition", "connect", "clear"],
  setup(e, { expose: l, emit: t }) {
    const a = e, o = t, s = Zl().replace(/:/g, "_"), v = z(""), p = z(), f = z(), i = z(900), n = z(!1), u = Y(() => i.value < 700 ? 420 : 480), y = Y(() => Yo(a.process, a.draft, { width: i.value, height: u.value })), m = z(1), w = z({ x: 0, y: 0 }), C = z({ x: 0, y: 0 }), A = Y(() => ({ width: i.value, height: n.value ? Math.max(u.value, y.value.height * Math.min(1, i.value / y.value.width)) : u.value })), U = Y(() => y.value.nodes.filter((h) => h.x - h.width / 2 >= w.value.x && h.x + h.width / 2 <= w.value.x + A.value.width / m.value && h.y - h.height / 2 >= w.value.y && h.y + h.height / 2 <= w.value.y + A.value.height / m.value).length);
    function G() {
      n.value = !1;
      const h = Js(y.value, A.value, a.process.initial);
      m.value = h.zoom, w.value = h.pan;
    }
    const F = Y(() => `${w.value.x} ${w.value.y} ${A.value.width / m.value} ${A.value.height / m.value}`), E = Y(() => y.value.nodes.find((h) => h.state.id === v.value));
    function $() {
      n.value = !0, m.value = Math.min(1, A.value.width / y.value.width), w.value = { x: (y.value.width - A.value.width / m.value) / 2, y: 0 };
    }
    function V(h) {
      const S = Math.max(0.02, Math.min(3, m.value * h)), k = 1 / m.value - 1 / S;
      w.value = { x: w.value.x + A.value.width * k / 2, y: w.value.y + A.value.height * k / 2 }, m.value = S;
    }
    function T(h) {
      const S = A.value.width / m.value, k = A.value.height / m.value;
      (h.x - h.width / 2 < w.value.x || h.x + h.width / 2 > w.value.x + S || h.y - h.height / 2 < w.value.y || h.y + h.height / 2 > w.value.y + k) && (w.value = { x: h.x - S / 2, y: h.y - k / 2 });
    }
    function ae() {
      const h = y.value.nodes.find((S) => S.state === a.selectedState) ?? y.value.edges.find((S) => S.transition === a.selectedTransition);
      h && T(h);
    }
    xe([y, () => a.selectedState, () => a.selectedTransition], ae, { flush: "post" }), xe(() => a.process.id, () => {
      v.value = "", P.clear(), G();
    }, { flush: "post" });
    function L(h) {
      if (h.target !== p.value) return;
      (h.key === "+" || h.key === "=") && (h.preventDefault(), V(1.2)), h.key === "-" && (h.preventDefault(), V(1 / 1.2)), h.key === "0" && (h.preventDefault(), $());
      const S = 60 / m.value;
      h.key.startsWith("Arrow") && (h.preventDefault(), w.value = { x: w.value.x + (h.key === "ArrowRight" ? S : h.key === "ArrowLeft" ? -S : 0), y: w.value.y + (h.key === "ArrowDown" ? S : h.key === "ArrowUp" ? -S : 0) });
    }
    function j(h) {
      v.value && v.value !== h.id && o("connect", v.value, h.id), v.value = "";
    }
    function R(h, S) {
      v.value = S.state.id, C.value = { x: S.x, y: S.y };
      const k = h.target;
      k instanceof Element && k.hasPointerCapture?.(h.pointerId) && k.releasePointerCapture(h.pointerId);
    }
    function ne(h, S) {
      if ((h.key === "Enter" || h.key === " ") && (h.preventDefault(), v.value ? j(S) : o("state", S)), ["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp"].includes(h.key)) {
        h.preventDefault();
        const k = Array.from(f.value?.querySelectorAll(".work-graph-node") ?? []), q = y.value.nodes.findIndex((re) => re.state === S), X = ["ArrowRight", "ArrowDown"].includes(h.key) ? 1 : -1;
        k[(q + X + k.length) % k.length]?.focus();
      }
    }
    function x() {
      v.value = "", P.clear(), o("clear");
    }
    const P = /* @__PURE__ */ new Map();
    let O = 0;
    function Z(h) {
      if (!h.target.closest('[role="button"]') && (P.set(h.pointerId, { x: h.clientX, y: h.clientY }), p.value?.setPointerCapture?.(h.pointerId), P.size === 2)) {
        const [S, k] = [...P.values()];
        O = Math.hypot(S.x - k.x, S.y - k.y);
      }
    }
    function ce(h) {
      const S = f.value?.getBoundingClientRect();
      if (!S?.width) return;
      if (v.value) {
        C.value = { x: w.value.x + (h.clientX - S.left) * A.value.width / m.value / S.width, y: w.value.y + (h.clientY - S.top) * A.value.height / m.value / S.height };
        return;
      }
      const k = P.get(h.pointerId);
      if (k)
        if (P.set(h.pointerId, { x: h.clientX, y: h.clientY }), P.size === 2) {
          const [q, X] = [...P.values()], re = Math.hypot(q.x - X.x, q.y - X.y);
          O && V(re / O), O = re;
        } else w.value = { x: w.value.x - (h.clientX - k.x) * A.value.width / m.value / S.width, y: w.value.y - (h.clientY - k.y) * A.value.height / m.value / S.height };
    }
    function pe(h) {
      P.delete(h.pointerId), O = 0, v.value = "";
    }
    function ge(h) {
      h.ctrlKey && (h.preventDefault(), V(Math.exp(-h.deltaY * 0.01)));
    }
    let Ve;
    wl(() => {
      if (p.value && Hs(p.value), typeof ResizeObserver < "u" && f.value) {
        let h = !0;
        Ve = new ResizeObserver(() => {
          const S = f.value?.getBoundingClientRect();
          if (!S?.width || !S.height) return;
          const k = A.value.width;
          i.value = S.width, (h || Math.abs(S.width - k) > 1) && (n.value ? $() : G(), h = !1), ae();
        }), Ve.observe(f.value);
      }
    }), nt(() => Ve?.disconnect()), l({ fit: $, zoomIn: () => V(1.2), zoomOut: () => V(1 / 1.2) });
    function De(h) {
      return h.category === "completed" ? "check" : h.category === "canceled" ? "x" : h.id === a.process.initial ? "arrow-bar-to-right" : { gate: "shield-check", automated: "bolt", parallel: "arrows-split" }[h.kind ?? ""] ?? "user";
    }
    return (h, S) => (c(), g("section", {
      ref_key: "canvas",
      ref: p,
      class: "work-process-canvas",
      "aria-label": "Process map",
      tabindex: "0",
      onKeydown: [
        L,
        Ae(be(x, ["stop"]), ["esc"])
      ],
      onPointerdown: Z,
      onPointermove: ce,
      onPointerup: pe,
      onPointercancel: x,
      onWheel: ge
    }, [
      v.value ? (c(), g("p", Qs, "Choose the next stop. Escape cancels.")) : D("", !0),
      (c(), g("svg", {
        ref_key: "svg",
        ref: f,
        style: ho({ height: A.value.height + "px" }),
        viewBox: F.value,
        role: "group",
        "aria-label": "States and transitions"
      }, [
        d("defs", null, [
          d("marker", {
            id: r(s) + "-arrow",
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
          ])], 8, er)
        ]),
        (c(!0), g(J, null, te(y.value.parallels, (k) => (c(), g("path", {
          key: k.key,
          d: k.path,
          class: "work-lane-line",
          "marker-end": `url(#${r(s)}-arrow)`
        }, [
          d("title", null, "Parallel lane from " + I(r(he)(k.state)), 1)
        ], 8, tr))), 128)),
        (c(!0), g(J, null, te(y.value.edges, (k) => (c(), g("g", {
          key: k.key,
          class: pt(["work-graph-edge", ["work-edge-" + k.type, { "work-selected": e.selectedTransition === k.transition }]]),
          role: "button",
          tabindex: "0",
          "aria-label": "Edit transition " + r(je)(k.transition),
          "aria-pressed": e.selectedTransition === k.transition,
          onFocus: (q) => T(k),
          onClick: (q) => o("transition", k.transition),
          onKeydown: [
            Ae(be((q) => o("transition", k.transition), ["prevent"]), ["enter"]),
            Ae(be((q) => o("transition", k.transition), ["prevent"]), ["space"])
          ]
        }, [
          d("path", {
            d: k.path,
            class: "work-edge-hit"
          }, null, 8, ar),
          d("path", {
            d: k.path,
            class: "work-edge-line",
            "marker-end": `url(#${r(s)}-arrow)`
          }, null, 8, or),
          d("rect", {
            x: k.x - k.width / 2,
            y: k.y - k.height / 2,
            width: k.width,
            height: k.height,
            rx: "6",
            class: "work-edge-label-bg"
          }, null, 8, ir),
          d("text", {
            x: k.x,
            y: k.y - (k.lines.length - 1) * 8 + 4,
            class: "work-edge-label",
            "text-anchor": "middle"
          }, [
            (c(!0), g(J, null, te(k.lines, (q, X) => (c(), g("tspan", {
              key: X,
              x: k.x,
              dy: X ? 16 : 0
            }, I(q), 9, sr))), 128))
          ], 8, nr)
        ], 42, lr))), 128)),
        (c(!0), g(J, null, te(y.value.nodes, (k) => (c(), g("g", {
          key: k.state.id,
          class: pt(["work-graph-node", ["work-stop-" + k.state.category, { "work-selected": e.selectedState === k.state }]]),
          role: "button",
          tabindex: "0",
          "aria-label": "Edit state " + r(he)(k.state),
          "aria-pressed": e.selectedState === k.state,
          onClick: (q) => o("state", k.state),
          onKeydown: (q) => ne(q, k.state),
          onFocus: (q) => T(k),
          onPointerup: be((q) => j(k.state), ["stop"])
        }, [
          d("rect", {
            x: k.x - k.width / 2,
            y: k.y - k.height / 2,
            width: k.width,
            height: k.height,
            rx: "10",
            class: "work-state-card"
          }, null, 8, dr),
          d("circle", {
            cx: k.x - k.width / 2 + 22,
            cy: k.y - k.height / 2 + 25,
            r: "10",
            class: "work-stop-ring"
          }, null, 8, ur),
          b(r(Q), {
            icon: "tabler:" + De(k.state),
            x: k.x - k.width / 2 + 15,
            y: k.y - k.height / 2 + 18,
            width: "14",
            height: "14",
            class: "work-stop-icon",
            "aria-hidden": "true"
          }, null, 8, ["icon", "x", "y"]),
          d("text", {
            x: k.x - k.width / 2 + 42,
            y: k.y - k.height / 2 + 29,
            class: "work-node-name"
          }, [
            (c(!0), g(J, null, te(k.title, (q, X) => (c(), g("tspan", {
              key: X,
              x: k.x - k.width / 2 + 42,
              dy: X ? 18 : 0
            }, I(q), 9, vr))), 128))
          ], 8, cr),
          d("text", {
            x: k.x - k.width / 2 + 16,
            y: k.y - k.height / 2 + 33 + k.title.length * 18,
            class: "work-node-meta"
          }, [
            (c(!0), g(J, null, te(k.caption, (q, X) => (c(), g("tspan", {
              key: X,
              x: k.x - k.width / 2 + 16,
              dy: X ? 16 : 0
            }, I(q), 9, fr))), 128)),
            e.draft.policy?.wip?.[k.state.id] ? (c(), g("tspan", pr, " · limit " + I(e.draft.policy.wip[k.state.id].limit), 1)) : D("", !0)
          ], 8, mr),
          (c(!0), g(J, null, te(k.badges, (q, X) => (c(), g("g", {
            key: q.id,
            class: "work-any-transition",
            role: "button",
            tabindex: "0",
            "aria-label": "Edit transition " + r(je)(q),
            onClick: be((re) => o("transition", q), ["stop"]),
            onKeydown: [
              Ae(be((re) => o("transition", q), ["stop", "prevent"]), ["enter"]),
              Ae(be((re) => o("transition", q), ["stop", "prevent"]), ["space"])
            ]
          }, [
            d("text", {
              x: k.x - k.width / 2 + 16,
              y: k.y - k.height / 2 + 33 + k.title.length * 18 + k.caption.length * 16 + k.badges.slice(0, X).reduce((re, fe) => re + r(Nt)(r(je)(fe) + " works from any state").length * 18, 0),
              class: "work-node-meta"
            }, [
              (c(!0), g(J, null, te(r(Nt)(r(je)(q) + " works from any state"), (re, fe) => (c(), g("tspan", {
                key: fe,
                x: k.x - k.width / 2 + 16,
                dy: fe ? 18 : 0
              }, I(re), 9, yr))), 128))
            ], 8, hr)
          ], 40, br))), 128)),
          ["completed", "canceled"].includes(k.state.category) ? D("", !0) : (c(), g("circle", {
            key: 0,
            cx: y.value.direction === "TB" ? k.x : k.x + k.width / 2,
            cy: y.value.direction === "TB" ? k.y + k.height / 2 : k.y,
            r: "7",
            class: "work-node-connector",
            role: "button",
            tabindex: "0",
            "aria-label": "Connect from " + r(he)(k.state),
            onPointerdown: be((q) => R(q, k), ["stop", "prevent"]),
            onClick: be((q) => o("state", k.state), ["stop"]),
            onKeydown: [
              Ae(be((q) => {
                v.value = k.state.id, C.value = { x: k.x, y: k.y };
              }, ["stop", "prevent"]), ["enter"]),
              Ae(be((q) => v.value = k.state.id, ["stop", "prevent"]), ["space"])
            ]
          }, null, 40, gr))
        ], 42, rr))), 128)),
        E.value ? (c(), g("path", {
          key: 0,
          d: `M ${y.value.direction === "TB" ? E.value.x : E.value.x + E.value.width / 2} ${y.value.direction === "TB" ? E.value.y + E.value.height / 2 : E.value.y} L ${C.value.x} ${C.value.y}`,
          class: "work-connect-ghost"
        }, null, 8, kr)) : D("", !0)
      ], 12, _s)),
      !n.value && U.value < e.process.states.length ? (c(), g("div", wr, [
        d("span", null, I(U.value) + " of " + I(e.process.states.length) + " states in view · More " + I(y.value.direction === "TB" ? "below" : "to the right"), 1),
        b(r(H), {
          label: "Show full process",
          size: "small",
          text: "",
          onClick: S[0] || (S[0] = (k) => $())
        })
      ])) : D("", !0),
      d("div", Vr, [
        d("span", null, I(e.process.states.length) + " states · " + I(Math.round(m.value * 100)) + "%", 1),
        S[2] || (S[2] = d("span", null, [
          d("i"),
          N("Transition")
        ], -1)),
        S[3] || (S[3] = d("span", null, [
          d("i", { class: "work-return-key" }),
          N("Return / loop")
        ], -1)),
        S[4] || (S[4] = d("span", null, "Drag to pan · Ctrl + scroll to zoom · Fit for full process", -1))
      ])
    ], 40, Zs));
  }
}), xr = {
  class: "work-process-list work-stack",
  "aria-label": "Process list"
}, Cr = { class: "work-stack work-tight" }, Sr = { class: "work-table-scroll" }, Tr = { class: "work-settings-table work-process-table" }, Ur = ["aria-selected"], Er = { class: "work-process-list-actions" }, Dr = { class: "work-table-scroll" }, Ir = { class: "work-settings-table work-process-table" }, Ar = ["aria-selected"], Pr = { class: "work-process-list-actions" }, Rr = /* @__PURE__ */ ue({
  __name: "ProcessList",
  props: {
    process: {},
    selectedState: {},
    selectedTransition: {}
  },
  emits: ["state", "transition", "removeState", "removeTransition", "addTransition"],
  setup(e) {
    return (l, t) => (c(), g("section", xr, [
      d("label", Cr, [
        t[2] || (t[2] = N("Process name", -1)),
        b(r(de), {
          modelValue: e.process.name,
          "onUpdate:modelValue": t[0] || (t[0] = (a) => e.process.name = a),
          "aria-label": "Process name"
        }, null, 8, ["modelValue"])
      ]),
      t[5] || (t[5] = d("h3", null, "States", -1)),
      d("div", Sr, [
        d("table", Tr, [
          t[3] || (t[3] = d("thead", null, [
            d("tr", null, [
              d("th", null, "Name"),
              d("th", null, "Phase"),
              d("th", null, "Kind"),
              d("th", null, "Actions")
            ])
          ], -1)),
          d("tbody", null, [
            (c(!0), g(J, null, te(e.process.states, (a) => (c(), g("tr", {
              key: a.id,
              "aria-selected": e.selectedState === a
            }, [
              d("td", null, [
                b(r(de), {
                  modelValue: a.name,
                  "onUpdate:modelValue": (o) => a.name = o,
                  "aria-label": "Name of " + r(he)(a)
                }, null, 8, ["modelValue", "onUpdate:modelValue", "aria-label"])
              ]),
              d("td", null, I(r(_l)(a.category)), 1),
              d("td", null, [
                b(r(Re), { severity: "secondary" }, {
                  default: M(() => [
                    N(I(r(La)(a.kind)), 1)
                  ]),
                  _: 2
                }, 1024)
              ]),
              d("td", Er, [
                b(r(H), {
                  size: "small",
                  text: "",
                  severity: "secondary",
                  "aria-label": "Edit state",
                  onClick: (o) => l.$emit("state", a)
                }, {
                  default: M(() => [
                    b(r(Q), { icon: "tabler:pencil" })
                  ]),
                  _: 1
                }, 8, ["onClick"]),
                b(r(H), {
                  size: "small",
                  text: "",
                  severity: "danger",
                  "aria-label": "Remove state " + r(he)(a),
                  onClick: (o) => l.$emit("removeState", a)
                }, {
                  default: M(() => [
                    b(r(Q), { icon: "tabler:trash" })
                  ]),
                  _: 1
                }, 8, ["aria-label", "onClick"])
              ])
            ], 8, Ur))), 128))
          ])
        ])
      ]),
      t[6] || (t[6] = d("h3", null, "Transitions", -1)),
      d("div", Dr, [
        d("table", Ir, [
          t[4] || (t[4] = d("thead", null, [
            d("tr", null, [
              d("th", null, "Name"),
              d("th", null, "From"),
              d("th", null, "To"),
              d("th", null, "Actions")
            ])
          ], -1)),
          d("tbody", null, [
            (c(!0), g(J, null, te(e.process.transitions ?? [], (a) => (c(), g("tr", {
              key: a.id,
              "aria-selected": e.selectedTransition === a
            }, [
              d("td", null, [
                b(r(de), {
                  modelValue: a.name,
                  "onUpdate:modelValue": (o) => a.name = o,
                  placeholder: r(je)(a),
                  "aria-label": "Name of " + r(je)(a)
                }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder", "aria-label"])
              ]),
              d("td", null, I(a.from === "any" ? "Any state" : a.from.map((o) => r(he)(e.process.states.find((s) => s.id === o))).join(", ")), 1),
              d("td", null, I(r(he)(e.process.states.find((o) => o.id === a.to))), 1),
              d("td", Pr, [
                b(r(H), {
                  size: "small",
                  text: "",
                  severity: "secondary",
                  "aria-label": "Edit transition",
                  onClick: (o) => l.$emit("transition", a)
                }, {
                  default: M(() => [
                    b(r(Q), { icon: "tabler:pencil" })
                  ]),
                  _: 1
                }, 8, ["onClick"]),
                b(r(H), {
                  size: "small",
                  text: "",
                  severity: "danger",
                  "aria-label": "Remove transition " + r(je)(a),
                  onClick: (o) => l.$emit("removeTransition", a)
                }, {
                  default: M(() => [
                    b(r(Q), { icon: "tabler:trash" })
                  ]),
                  _: 1
                }, 8, ["aria-label", "onClick"])
              ])
            ], 8, Ar))), 128))
          ])
        ])
      ]),
      b(r(H), {
        label: "Add transition",
        severity: "secondary",
        outlined: "",
        onClick: t[1] || (t[1] = (a) => l.$emit("addTransition"))
      }, {
        icon: M(() => [
          b(r(Q), { icon: "tabler:plus" })
        ]),
        _: 1
      })
    ]));
  }
}), Or = { class: "work-stack work-transition-settings" }, Nr = { class: "work-stack work-tight" }, Mr = { class: "work-row" }, Fr = { class: "work-row" }, Lr = { class: "work-row" }, zr = { class: "work-stack work-tight" }, Br = { class: "work-row" }, jr = { class: "work-stack work-tight" }, qr = { class: "work-stack work-tight" }, Wr = /* @__PURE__ */ ue({
  __name: "TransitionSettings",
  props: {
    transition: {},
    process: {},
    draft: {},
    boardId: {}
  },
  emits: ["validity"],
  setup(e, { emit: l }) {
    const t = e, a = l;
    function o() {
      (t.transition.set ??= []).push({ field: t.draft.fields?.[0]?.code ?? "", value: "" });
    }
    function s(v, p) {
      const f = t.transition.set?.[v];
      !f || !t.transition.set || (t.transition.set[v] = { field: f.field, ...p === "clear" ? { clear: !0 } : p === "copy" ? { copy: "" } : { value: "" } });
    }
    return (v, p) => (c(), g("div", Or, [
      d("label", Nr, [
        p[14] || (p[14] = N("To state", -1)),
        b(r(le), {
          modelValue: e.transition.to,
          "onUpdate:modelValue": p[0] || (p[0] = (f) => e.transition.to = f),
          "aria-label": "To state",
          appendTo: "self",
          optionLabel: "label",
          optionValue: "value",
          options: e.process.states.map((f) => ({ label: r(he)(f), value: f.id }))
        }, null, 8, ["modelValue", "options"])
      ]),
      d("label", Mr, [
        p[15] || (p[15] = d("span", { class: "work-spacer" }, "Happens automatically", -1)),
        b(r(Le), {
          "model-value": e.transition.auto,
          "onUpdate:modelValue": p[1] || (p[1] = (f) => {
            e.transition.auto = f, f || delete e.transition.default;
          }),
          "aria-label": "Automatic transition"
        }, null, 8, ["model-value"])
      ]),
      d("label", Fr, [
        p[16] || (p[16] = d("span", { class: "work-spacer" }, "Default automatic transition", -1)),
        b(r(Le), {
          modelValue: e.transition.default,
          "onUpdate:modelValue": p[2] || (p[2] = (f) => e.transition.default = f),
          disabled: !e.transition.auto,
          "aria-label": "Default transition"
        }, null, 8, ["modelValue", "disabled"])
      ]),
      d("label", Lr, [
        p[17] || (p[17] = d("span", { class: "work-spacer" }, "Works from any state", -1)),
        b(r(Le), {
          "model-value": e.transition.from === "any",
          "aria-label": "Works from any state",
          "onUpdate:modelValue": p[3] || (p[3] = (f) => e.transition.from = f ? "any" : [])
        }, null, 8, ["model-value"])
      ]),
      e.transition.from !== "any" ? (c(), B(zt, {
        key: 0,
        label: "From states",
        options: e.process.states.map((f) => ({ value: f.id, label: r(he)(f) })),
        modelValue: e.transition.from,
        "onUpdate:modelValue": p[4] || (p[4] = (f) => e.transition.from = f)
      }, null, 8, ["options", "modelValue"])) : D("", !0),
      p[21] || (p[21] = d("h4", { class: "work-process-group" }, "Must be filled", -1)),
      b(zt, {
        label: "Required fields",
        options: e.draft.fields?.map((f) => ({ value: f.code, label: f.title || f.code })) ?? [],
        modelValue: e.transition.require,
        "onUpdate:modelValue": p[5] || (p[5] = (f) => e.transition.require = f)
      }, null, 8, ["options", "modelValue"]),
      p[22] || (p[22] = d("h4", { class: "work-process-group" }, "Also sets", -1)),
      (c(!0), g(J, null, te(e.transition.set ?? [], (f, i) => (c(), g("div", {
        key: i,
        class: "work-process-value work-stack work-tight"
      }, [
        d("label", zr, [
          p[18] || (p[18] = N("Field", -1)),
          b(r(le), {
            modelValue: f.field,
            "onUpdate:modelValue": (n) => f.field = n,
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            options: e.draft.fields?.map((n) => ({ value: n.code, label: n.title || n.code })) ?? []
          }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
        ]),
        d("div", Br, [
          b(r(le), {
            "model-value": f.clear ? "clear" : f.copy !== void 0 ? "copy" : "value",
            "aria-label": "Value action",
            appendTo: "self",
            options: [
              { label: "Set value", value: "value" },
              { label: "Clear value", value: "clear" },
              { label: "Copy field", value: "copy" }
            ],
            optionLabel: "label",
            optionValue: "value",
            "onUpdate:modelValue": (n) => s(i, n)
          }, null, 8, ["model-value", "onUpdate:modelValue"]),
          b(r(H), {
            text: "",
            severity: "danger",
            "aria-label": "Remove value " + (i + 1),
            onClick: (n) => e.transition.set?.splice(i, 1)
          }, {
            default: M(() => [
              b(r(Q), { icon: "tabler:trash" })
            ]),
            _: 1
          }, 8, ["aria-label", "onClick"])
        ]),
        f.copy !== void 0 ? (c(), B(r(le), {
          key: 0,
          modelValue: f.copy,
          "onUpdate:modelValue": (n) => f.copy = n,
          "aria-label": "Copy from field",
          appendTo: "self",
          optionLabel: "label",
          optionValue: "value",
          options: e.draft.fields?.map((n) => ({ value: n.code, label: n.title || n.code })) ?? []
        }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])) : f.clear ? D("", !0) : (c(!0), g(J, { key: 1 }, te(e.draft.fields?.filter((n) => n.code === f.field) ?? [], (n) => (c(), B(qa, {
          key: n.code,
          "board-id": e.boardId ?? "",
          field: n,
          modelValue: f.value,
          "onUpdate:modelValue": (u) => f.value = u,
          onValidity: (u) => a("validity", "effect-" + i, u)
        }, null, 8, ["board-id", "field", "modelValue", "onUpdate:modelValue", "onValidity"]))), 128))
      ]))), 128)),
      b(r(H), {
        label: "Add value",
        severity: "secondary",
        outlined: "",
        size: "small",
        onClick: o
      }, {
        icon: M(() => [
          b(r(Q), { icon: "tabler:plus" })
        ]),
        _: 1
      }),
      d("label", jr, [
        p[19] || (p[19] = N("Offer to people", -1)),
        b(r(le), {
          "model-value": e.transition.people,
          "aria-label": "Offer to people",
          appendTo: "self",
          optionLabel: "label",
          optionValue: "value",
          options: [{ label: "Work default", value: void 0 }, { label: "Offer explicitly", value: !0 }, { label: "Hide from people", value: !1 }],
          "onUpdate:modelValue": p[6] || (p[6] = (f) => e.transition.people = f)
        }, null, 8, ["model-value"])
      ]),
      d("label", qr, [
        p[20] || (p[20] = N("Evaluation order", -1)),
        b(r(Ye), {
          "model-value": e.transition.order ?? null,
          "aria-label": "Transition order",
          min: 0,
          useGrouping: !1,
          "onUpdate:modelValue": p[7] || (p[7] = (f) => e.transition.order = f ?? void 0)
        }, null, 8, ["model-value"])
      ]),
      p[23] || (p[23] = d("h4", { class: "work-process-group" }, "Only when", -1)),
      b(ta, {
        label: "Allow this transition when",
        draft: e.draft,
        "board-id": e.boardId,
        "model-value": e.transition.when,
        "onUpdate:modelValue": p[8] || (p[8] = (f) => e.transition.when = f),
        onValidity: p[9] || (p[9] = (f) => a("validity", "when", f))
      }, null, 8, ["draft", "board-id", "model-value"]),
      b(ot, {
        label: "Set values",
        "model-value": e.transition.set,
        shape: "array",
        "onUpdate:modelValue": p[10] || (p[10] = (f) => e.transition.set = f),
        onValidity: p[11] || (p[11] = (f) => a("validity", "set", f))
      }, null, 8, ["model-value"]),
      b(ot, {
        label: "Guards",
        "model-value": e.transition.guards,
        shape: "array",
        "onUpdate:modelValue": p[12] || (p[12] = (f) => e.transition.guards = f),
        onValidity: p[13] || (p[13] = (f) => a("validity", "guards", f))
      }, null, 8, ["model-value"])
    ]));
  }
}), kl = /* @__PURE__ */ ue({
  __name: "CapacityControl",
  props: {
    draft: {},
    state: {},
    label: {},
    hard: { type: Boolean }
  },
  setup(e) {
    const l = e, t = Y(() => l.draft.policy?.wip?.[l.state]);
    function a(s) {
      if (s === null) {
        l.draft.policy?.wip && delete l.draft.policy.wip[l.state];
        return;
      }
      const v = l.draft.policy ??= {}, p = v.wip ??= {};
      p[l.state] = { ...p[l.state], limit: s };
    }
    function o(s) {
      t.value && (t.value.hard = s);
    }
    return (s, v) => e.hard ? (c(), B(r(Le), {
      key: 0,
      "aria-label": e.label,
      disabled: !t.value,
      "model-value": t.value?.hard ?? !1,
      "onUpdate:modelValue": o
    }, null, 8, ["aria-label", "disabled", "model-value"])) : (c(), B(r(Ye), {
      key: 1,
      "aria-label": e.label,
      min: 0,
      "max-fraction-digits": 0,
      "model-value": t.value?.limit ?? null,
      placeholder: "No limit",
      "use-grouping": !1,
      "onUpdate:modelValue": a
    }, null, 8, ["aria-label", "model-value"]));
  }
});
async function Ta(e) {
  try {
    const { data: l } = await Mo.get(e);
    if (!l?.success) {
      const t = l?.message || (typeof l?.error == "string" ? l.error : l?.error?.message) || "Could not read published Flow.";
      throw new Wl({ message: t, details: l?.details }, "Published Flow");
    }
    return l;
  } catch (l) {
    throw So(l, "Published Flow");
  }
}
const Ua = (e) => `/api/v1/workflows/${encodeURIComponent(e)}/versions`, Ea = {
  versions: async (e) => (await Ta(Ua(e))).versions ?? [],
  check: async (e) => {
    if ((await Ta(`${Ua(e.id)}/${e.version}`)).version?.version !== e.version) throw new Error("The published version is unavailable.");
  }
}, Kr = {
  class: "work-stack work-tight",
  "aria-label": "Stage Flow"
}, Gr = {
  key: 0,
  class: "work-muted work-small"
}, Yr = {
  key: 1,
  class: "kx-err work-alert-actions"
}, Hr = { role: "alert" }, Xr = ["schema", "config", "title"], Jr = {
  key: 3,
  class: "kx-err",
  role: "alert"
}, Zr = {
  key: 4,
  class: "work-stack work-tight"
}, Qr = {
  key: 5,
  class: "work-muted work-small",
  role: "status"
}, _r = /* @__PURE__ */ ue({
  __name: "StageFlow",
  props: {
    modelValue: {}
  },
  emits: ["update:modelValue", "validity"],
  setup(e, { emit: l }) {
    const t = e, a = l, o = z(!1), s = z(""), v = z([]), p = z(!1), f = z(""), i = z(!1), n = Y(() => s.value || t.modelValue?.id), u = JSON.stringify({ properties: { flow_ref: { title: "Published Flow", picker: "wc-workflow-picker" } } }), y = Y(() => JSON.stringify(t.modelValue ? { flow_ref: t.modelValue } : {}));
    let m = 0;
    async function w() {
      o.value = await lt("wc-workflow-picker");
    }
    w();
    async function C() {
      const F = ++m, E = n.value, $ = t.modelValue;
      if (p.value = !!E, f.value = "", v.value = [], !!E)
        try {
          const [V] = await Promise.all([Ea.versions(E), !i.value && $ ? Ea.check($) : Promise.resolve()]);
          if (F !== m) return;
          if (v.value = V.filter((T) => Number.isInteger(T.version) && T.version > 0), !i.value && $ && !v.value.some((T) => T.version === $.version)) throw new Error("The published version is unavailable.");
        } catch (V) {
          F === m && (f.value = We(V, "Could not read published Flow."));
        } finally {
          F === m && (p.value = !1);
        }
    }
    xe([n, () => t.modelValue?.version, i], C, { immediate: !0 }), xe(i, (F) => a("validity", !F), { immediate: !0 });
    function A(F) {
      const E = F.detail?.flow_ref;
      E?.kind !== "flow" || !E.id || (i.value = !0, s.value = E.id);
    }
    function U(F) {
      !n.value || !v.value.some((E) => E.version === F) || (a("update:modelValue", { kind: "flow", id: n.value, version: F }), i.value = !1, s.value = "");
    }
    function G() {
      a("update:modelValue", void 0), i.value = !1, s.value = "";
    }
    return nt(() => {
      m++, a("validity", !0);
    }), (F, E) => (c(), g("section", Kr, [
      E[3] || (E[3] = d("h4", { class: "work-field-label" }, "What runs", -1)),
      e.modelValue ? D("", !0) : (c(), g("p", Gr, "No Flow bound. This stage keeps its existing external execution contract.")),
      f.value ? (c(), g("div", Yr, [
        d("p", Hr, [
          N(I(i.value ? "Flow versions unavailable" : "Flow binding unavailable"), 1),
          !i.value && e.modelValue ? (c(), g(J, { key: 0 }, [
            N(" (v" + I(e.modelValue.version) + ")", 1)
          ], 64)) : D("", !0),
          N(". " + I(f.value), 1)
        ]),
        b(r(H), {
          label: "Reload Flow",
          severity: "secondary",
          text: "",
          onClick: C
        })
      ])) : D("", !0),
      o.value ? (c(), g("wc-workflow-picker", {
        key: 2,
        schema: r(u),
        config: y.value,
        title: e.modelValue?.id,
        onChange: A
      }, null, 40, Xr)) : (c(), g("p", Jr, [
        E[1] || (E[1] = N("Published Flow picker unavailable.", -1)),
        b(r(H), {
          label: "Reload Flow picker",
          text: "",
          severity: "secondary",
          onClick: w
        })
      ])),
      n.value ? (c(), g("label", Zr, [
        E[2] || (E[2] = N("Published version", -1)),
        b(r(le), {
          "model-value": i.value ? void 0 : e.modelValue?.version,
          options: v.value.map(($) => ({ label: "v" + $.version, value: $.version })),
          "option-label": "label",
          "option-value": "value",
          "aria-label": "Published version",
          placeholder: "Choose a published version",
          "append-to": "self",
          loading: p.value,
          disabled: p.value || !!f.value,
          "onUpdate:modelValue": U
        }, null, 8, ["model-value", "options", "loading", "disabled"])
      ])) : D("", !0),
      i.value ? (c(), g("p", Qr, "Choose a published version to finish selecting the Flow.")) : D("", !0),
      e.modelValue || i.value ? (c(), B(r(H), {
        key: 6,
        label: i.value ? "Cancel Flow selection" : "Remove Flow binding",
        "aria-label": i.value ? "Cancel Flow selection" : "Remove Flow binding",
        severity: "secondary",
        text: "",
        onClick: E[0] || (E[0] = ($) => i.value ? (i.value = !1, s.value = "") : G())
      }, null, 8, ["label", "aria-label"])) : D("", !0)
    ]));
  }
}), Jl = { minutes: 60, hours: 3600, days: 86400 };
function Kt(e, l) {
  const t = /^P(\d+)W$/.exec(e), a = /^P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+\.?\d*)S)?)?$/.exec(e);
  if (!t && (!a || e === "P" || e.endsWith("T"))) return;
  const o = t ? Number(t[1]) * 604800 : Number(a[1] ?? 0) * 86400 + Number(a[2] ?? 0) * 3600 + Number(a[3] ?? 0) * 60 + Number(a[4] ?? 0);
  if (!Number.isFinite(o) || o <= 0) return;
  const s = l ?? (o % 86400 === 0 ? "days" : o % 3600 === 0 ? "hours" : "minutes");
  return { amount: o / Jl[s], unit: s };
}
function ed(e, l) {
  if (e == null) return;
  if (!Number.isFinite(e * Jl[l]) || e <= 0) throw new Error("Enter a positive duration.");
  const t = (a) => a.toLocaleString("en-US", { useGrouping: !1, maximumSignificantDigits: 21 });
  return Number.isInteger(e) ? l === "days" ? `P${t(e)}D` : l === "hours" ? `PT${t(e)}H` : `PT${t(e)}M` : `PT${t(e * Jl[l])}S`;
}
const td = { class: "work-stack work-tight" }, ld = {
  class: "work-duration-control",
  style: { "max-width": "360px" }
}, ad = {
  key: 0,
  class: "work-error",
  role: "alert"
}, Ct = /* @__PURE__ */ ue({
  __name: "DurationControl",
  props: {
    modelValue: {},
    label: {},
    disabled: { type: Boolean }
  },
  emits: ["update:modelValue", "validity"],
  setup(e, { emit: l }) {
    const t = e, a = l, o = "duration:" + Zl(), s = z("days"), v = z("");
    xe(() => t.modelValue, (y) => {
      v.value = "";
      const m = y ? Kt(y) : void 0;
      m && (s.value = m.unit), a("validity", !y || !!m, o);
    }, { immediate: !0 });
    const p = Y(() => t.modelValue ? Kt(t.modelValue, s.value)?.amount ?? null : null);
    function f(y) {
      try {
        const m = ed(y, s.value);
        v.value = "", a("update:modelValue", m), a("validity", !0, o);
      } catch (m) {
        v.value = m.message, a("validity", !1, o);
      }
    }
    function i(y) {
      y == null && v.value || f(y);
    }
    function n(y) {
      y.formattedValue.trim() && (typeof y.value != "number" || !Number.isFinite(y.value)) ? (v.value = "Enter a positive duration.", a("validity", !1, o)) : f(typeof y.value == "number" ? y.value : null);
    }
    function u(y) {
      const m = p.value;
      s.value = y, !(t.modelValue && !Kt(t.modelValue)) && f(m);
    }
    return nt(() => a("validity", !0, o)), (y, m) => (c(), g("label", td, [
      N(I(e.label), 1),
      d("span", ld, [
        b(r(Ye), {
          "model-value": p.value,
          "aria-label": e.label,
          min: 0,
          "aria-invalid": !!v.value || !!e.modelValue && !r(Kt)(e.modelValue),
          disabled: e.disabled,
          useGrouping: !1,
          onInput: n,
          "onUpdate:modelValue": m[0] || (m[0] = (w) => i(w))
        }, null, 8, ["model-value", "aria-label", "aria-invalid", "disabled"]),
        b(r(le), {
          "model-value": s.value,
          "aria-label": e.label + " unit",
          disabled: e.disabled,
          options: [{ label: "Minutes", value: "minutes" }, { label: "Hours", value: "hours" }, { label: "Days", value: "days" }],
          optionLabel: "label",
          optionValue: "value",
          appendTo: "self",
          "onUpdate:modelValue": m[1] || (m[1] = (w) => u(w))
        }, null, 8, ["model-value", "aria-label", "disabled"])
      ]),
      v.value || e.modelValue && !r(Kt)(e.modelValue) ? (c(), g("span", ad, I(v.value || `Unsupported duration: ${e.modelValue}`), 1)) : D("", !0)
    ]));
  }
}), od = { class: "work-stack" }, id = { class: "work-settings-grid" }, nd = { class: "work-stack work-tight" }, sd = { class: "work-stack work-tight" }, rd = {
  key: 1,
  class: "work-stack work-tight"
}, dd = { class: "work-stack work-tight" }, ud = { class: "work-settings-grid" }, cd = { class: "work-row" }, vd = { class: "work-stack work-tight" }, md = {
  key: 0,
  class: "work-stack work-tight"
}, fd = /* @__PURE__ */ ue({
  __name: "TimersEditor",
  props: {
    state: {},
    draft: {}
  },
  emits: ["validity"],
  setup(e, { emit: l }) {
    const t = e, a = l;
    function o() {
      return t.state.timers ?? [];
    }
    function s() {
      const i = t.state.timers ?? (t.state.timers = []);
      i.push({ id: $t("timer", i), after: "P1D", then: { emit: "reminder" } });
    }
    function v(i, n) {
      delete i.after, delete i.at_field, n === "after" ? i.after = "P1D" : i.at_field = "";
    }
    function p(i, n, u) {
      u ? i[n] = u : (delete i[n], delete i.table);
    }
    function f(i, n) {
      i.then = n === "emit" ? { emit: "" } : { transition: "" };
    }
    return (i, n) => (c(), g("section", od, [
      n[8] || (n[8] = d("h4", null, "Timers", -1)),
      (c(!0), g(J, null, te(o(), (u, y) => (c(), g("article", {
        key: u.id,
        class: "work-settings-card work-stack"
      }, [
        d("div", id, [
          d("label", nd, [
            n[2] || (n[2] = N("Timer ID", -1)),
            b(r(de), {
              modelValue: u.id,
              "onUpdate:modelValue": (m) => u.id = m,
              required: "",
              pattern: "[a-z][a-z0-9_]*"
            }, null, 8, ["modelValue", "onUpdate:modelValue"])
          ]),
          d("label", sd, [
            n[3] || (n[3] = N("Deadline", -1)),
            b(r(le), {
              "model-value": u.at_field !== void 0 ? "at_field" : "after",
              "onUpdate:modelValue": (m) => v(u, m),
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
          u.after !== void 0 ? (c(), B(Ct, {
            key: 0,
            modelValue: u.after,
            "onUpdate:modelValue": (m) => u.after = m,
            label: "After",
            onValidity: n[0] || (n[0] = (m, w) => a("validity", w, m))
          }, null, 8, ["modelValue", "onUpdate:modelValue"])) : (c(), g("label", rd, [
            n[4] || (n[4] = N("At field", -1)),
            b(r(le), {
              modelValue: u.at_field,
              "onUpdate:modelValue": (m) => u.at_field = m,
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
          d("label", dd, [
            n[5] || (n[5] = N("Duration by field", -1)),
            b(r(le), {
              "model-value": u.by ?? "",
              "onUpdate:modelValue": (m) => p(u, "by", m),
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
        u.by ? (c(), B(ot, {
          key: 0,
          label: "Duration table",
          hint: "Map field values to ISO durations.",
          "model-value": u.table,
          shape: "object",
          "onUpdate:modelValue": (m) => u.table = m,
          onValidity: (m) => a("validity", "table-" + y, m)
        }, null, 8, ["model-value", "onUpdate:modelValue", "onValidity"])) : D("", !0),
        d("div", ud, [
          b(Ct, {
            modelValue: u.repeat,
            "onUpdate:modelValue": (m) => u.repeat = m,
            label: "Repeat every",
            onValidity: n[1] || (n[1] = (m, w) => a("validity", w, m)),
            disabled: u.interrupting
          }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"]),
          d("label", cd, [
            b(r(Ft), {
              modelValue: u.interrupting,
              "onUpdate:modelValue": [(m) => u.interrupting = m, (m) => u.interrupting && delete u.repeat],
              binary: ""
            }, null, 8, ["modelValue", "onUpdate:modelValue"]),
            n[6] || (n[6] = N("Interrupting", -1))
          ]),
          d("label", vd, [
            n[7] || (n[7] = N("Then", -1)),
            b(r(le), {
              "model-value": u.then?.transition !== void 0 ? "transition" : "emit",
              "onUpdate:modelValue": (m) => f(u, m),
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
          u.then ? (c(), g("label", md, [
            N(I(u.then.transition !== void 0 ? "Transition ID" : "Event name"), 1),
            u.then.transition !== void 0 ? (c(), B(r(de), {
              key: 0,
              modelValue: u.then.transition,
              "onUpdate:modelValue": (m) => u.then.transition = m
            }, null, 8, ["modelValue", "onUpdate:modelValue"])) : (c(), B(r(de), {
              key: 1,
              modelValue: u.then.emit,
              "onUpdate:modelValue": (m) => u.then.emit = m
            }, null, 8, ["modelValue", "onUpdate:modelValue"]))
          ])) : D("", !0)
        ]),
        b(r(H), {
          severity: "secondary",
          onClick: (m) => o().splice(y, 1),
          "aria-label": "Remove timer",
          text: "",
          size: "small"
        }, {
          default: M(() => [
            b(r(Q), {
              icon: "tabler:trash",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        }, 8, ["onClick"])
      ]))), 128)),
      b(r(H), {
        label: "Add timer",
        severity: "secondary",
        onClick: s,
        outlined: ""
      }, {
        icon: M(() => [
          b(r(Q), {
            icon: "tabler:plus",
            "aria-hidden": "true"
          })
        ]),
        _: 1
      })
    ]));
  }
}), pd = ["aria-label"], bd = { class: "work-stack work-tight" }, hd = {
  key: 0,
  class: "work-stack work-tight"
}, yd = /* @__PURE__ */ ue({
  __name: "PrincipalSourceEditor",
  props: {
    modelValue: {},
    draft: {},
    boardId: {},
    label: {}
  },
  emits: ["update:modelValue", "validity"],
  setup(e, { emit: l }) {
    const t = e, a = l, o = Y(() => Array.isArray(t.modelValue) ? "principals" : "field" in t.modelValue ? "field" : "group"), s = Y(() => Array.isArray(t.modelValue) ? t.modelValue : "group" in t.modelValue && t.modelValue.group ? [{ kind: "group", id: t.modelValue.group }] : []);
    function v(f) {
      a("update:modelValue", f === "field" ? { field: "" } : f === "group" ? { group: "" } : []);
    }
    function p(f) {
      a("update:modelValue", o.value === "group" ? { group: f.at(-1)?.id ?? "" } : f);
    }
    return Oa(() => a("validity", Array.isArray(t.modelValue) ? t.modelValue.length > 0 : "field" in t.modelValue ? !!t.modelValue.field : !!t.modelValue.group)), nt(() => a("validity", !0)), (f, i) => (c(), g("section", {
      class: "work-stack work-tight",
      "aria-label": e.label
    }, [
      d("label", bd, [
        N(I(e.label) + " source", 1),
        b(r(le), {
          "model-value": o.value,
          "aria-label": e.label + " source",
          options: [{ label: "Group", value: "group" }, { label: "People and groups", value: "principals" }, { label: "Principal field", value: "field" }],
          optionLabel: "label",
          optionValue: "value",
          appendTo: "self",
          "onUpdate:modelValue": v
        }, null, 8, ["model-value", "aria-label"])
      ]),
      "field" in e.modelValue ? (c(), g("label", hd, [
        i[1] || (i[1] = N("Principal field", -1)),
        b(r(le), {
          "model-value": e.modelValue.field,
          "aria-label": e.label + " field",
          options: e.draft.fields?.filter((n) => n.type === "principal").map((n) => ({ label: n.title || n.code, value: n.code })) ?? [],
          optionLabel: "label",
          optionValue: "value",
          appendTo: "self",
          "onUpdate:modelValue": i[0] || (i[0] = (n) => a("update:modelValue", { field: n }))
        }, null, 8, ["model-value", "aria-label", "options"])
      ])) : (c(), B(la, {
        key: 1,
        "board-id": e.boardId,
        label: e.label,
        kinds: o.value === "group" ? "group" : "user,group,service",
        "model-value": s.value,
        "onUpdate:modelValue": p
      }, null, 8, ["board-id", "label", "kinds", "model-value"]))
    ], 8, pd));
  }
}), gd = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, kd = {
  class: "work-stack work-tight",
  "aria-label": "Approval sources"
}, wd = { class: "work-row" }, Vd = {
  key: 0,
  class: "work-stack work-tight"
}, $d = ["kinds", "value"], xd = {
  key: 2,
  class: "work-muted work-small",
  role: "status"
}, Cd = {
  key: 3,
  class: "work-chips"
}, Sd = { class: "work-row work-small" }, Td = { class: "work-process-options" }, Ud = { class: "work-stack work-tight" }, Ed = {
  key: 4,
  class: "work-error work-small",
  role: "alert"
}, Dd = {
  key: 5,
  class: "work-muted work-small"
}, Id = /* @__PURE__ */ ue({
  __name: "ApproversEditor",
  props: {
    approvals: {},
    boardId: {}
  },
  emits: ["validity"],
  setup(e, { emit: l }) {
    const t = e, a = l, { principalLabel: o, rememberPrincipal: s, nameError: v } = Na(() => t.boardId ?? "", () => Array.isArray(t.approvals.from) ? t.approvals.from : "group" in t.approvals.from ? [{ kind: "group", id: t.approvals.from.group }] : []), p = z(!1), f = Y(() => Array.isArray(t.approvals.from) ? "principals" : "field" in t.approvals.from ? "field" : "group"), i = Y(() => Array.isArray(t.approvals.from) ? t.approvals.from.some((m) => m.kind === "group") || t.approvals.from.length >= t.approvals.min : "field" in t.approvals.from ? !!t.approvals.from.field : !!t.approvals.from.group);
    Oa(() => a("validity", Number.isSafeInteger(t.approvals.min) && t.approvals.min > 0 && i.value)), nt(() => a("validity", !0)), wl(async () => {
      p.value = await lt("wc-principal-picker");
    });
    function n(m) {
      t.approvals.from = m === "group" ? { group: "" } : m === "field" ? { field: "" } : [];
    }
    function u(m) {
      const w = m.detail, C = w?.principal_id ?? w?.id;
      if (f.value === "group") {
        t.approvals.from = { group: C ?? "" };
        return;
      }
      if (!C || !Array.isArray(t.approvals.from)) return;
      const A = { kind: w.type ?? w.kind ?? "user", id: C };
      w.label && s(A, w.label), t.approvals.from.some((U) => U.id === C && U.kind === A.kind) || t.approvals.from.push(A);
    }
    function y(m) {
      Array.isArray(t.approvals.from) && t.approvals.from.splice(m, 1);
    }
    return (m, w) => (c(), g(J, null, [
      r(v) ? (c(), g("p", gd, I(r(v)), 1)) : D("", !0),
      d("section", kd, [
        d("label", wd, [
          w[4] || (w[4] = d("span", { class: "work-spacer" }, "Approvals needed", -1)),
          b(r(Ye), {
            modelValue: e.approvals.min,
            "onUpdate:modelValue": w[0] || (w[0] = (C) => e.approvals.min = C),
            min: 1,
            required: "",
            useGrouping: !1
          }, null, 8, ["modelValue"])
        ]),
        w[9] || (w[9] = d("span", { class: "work-field-label" }, "Approvers", -1)),
        "field" in e.approvals.from ? (c(), g("label", Vd, [
          w[5] || (w[5] = N("Principal field", -1)),
          b(r(de), {
            modelValue: e.approvals.from.field,
            "onUpdate:modelValue": w[1] || (w[1] = (C) => e.approvals.from.field = C),
            "aria-label": "Principal field"
          }, null, 8, ["modelValue"])
        ])) : p.value ? (c(), g("wc-principal-picker", {
          key: f.value,
          kinds: f.value === "group" ? "group" : "user,group,service",
          value: JSON.stringify("group" in e.approvals.from ? { type: "group", principal_id: e.approvals.from.group } : {}),
          onConfigChanged: u
        }, null, 40, $d)) : (c(), g("p", xd, "The principal picker is unavailable.")),
        Array.isArray(e.approvals.from) ? (c(), g("div", Cd, [
          (c(!0), g(J, null, te(e.approvals.from, (C, A) => (c(), B(r(Re), {
            key: C.kind + ":" + C.id,
            class: "kx-tag-sm",
            severity: "secondary"
          }, {
            default: M(() => [
              N(I(r(o)(C)), 1),
              b(r(H), {
                "aria-label": "Remove approver " + (A + 1),
                text: "",
                severity: "secondary",
                size: "small",
                onClick: (U) => y(A)
              }, {
                default: M(() => [
                  b(r(Q), {
                    icon: "tabler:x",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["aria-label", "onClick"])
            ]),
            _: 2
          }, 1024))), 128))
        ])) : D("", !0),
        d("label", Sd, [
          w[6] || (w[6] = d("span", { class: "work-spacer" }, "The person who moves the item here cannot approve this visit", -1)),
          b(r(Le), {
            modelValue: e.approvals.prevent_self,
            "onUpdate:modelValue": w[2] || (w[2] = (C) => e.approvals.prevent_self = C),
            "aria-label": "The person who moves the item here cannot approve this visit"
          }, null, 8, ["modelValue"])
        ]),
        d("details", Td, [
          w[8] || (w[8] = d("summary", null, "Approval options", -1)),
          d("label", Ud, [
            w[7] || (w[7] = N("Approval source", -1)),
            b(r(le), {
              "model-value": f.value,
              "onUpdate:modelValue": w[3] || (w[3] = (C) => n(C)),
              appendTo: "self",
              optionLabel: "label",
              optionValue: "value",
              options: [{ label: "Group members", value: "group" }, { label: "People and groups", value: "principals" }, { label: "Principal field", value: "field" }]
            }, null, 8, ["model-value"])
          ])
        ]),
        Array.isArray(e.approvals.from) && !i.value ? (c(), g("p", Ed, "Select at least " + I(e.approvals.min) + " distinct principals, or lower the minimum.", 1)) : "group" in e.approvals.from && !e.approvals.from.group ? (c(), g("p", Dd, "Choose the group that can approve this state.")) : D("", !0)
      ])
    ], 64));
  }
}), Ad = {
  class: "work-state-settings work-stack",
  "aria-label": "State settings"
}, Pd = { class: "work-process-kind" }, Rd = { class: "work-process-options" }, Od = { class: "work-stack" }, Nd = { class: "work-row" }, Md = { class: "work-stack work-tight" }, Fd = { class: "work-row" }, Ld = { class: "work-stack work-tight" }, zd = { class: "work-row" }, Bd = { class: "work-row" }, jd = { class: "work-stack work-tight" }, qd = { class: "work-row" }, Wd = { class: "work-stack work-tight" }, Kd = { class: "work-stack work-tight" }, Gd = {
  key: 0,
  class: "work-row"
}, Yd = { class: "work-row" }, Hd = { class: "work-row" }, Xd = { class: "work-stack work-tight" }, Jd = { class: "work-row" }, Zd = /* @__PURE__ */ ue({
  __name: "StateSettings",
  props: {
    state: {},
    process: {},
    draft: {},
    boardId: {}
  },
  emits: ["validity"],
  setup(e, { emit: l }) {
    const t = e, a = l, o = Y(() => (t.process.transitions ?? []).filter((f) => f.from === "any" || f.from.includes(t.state.id))), s = [{ value: "human", icon: "user" }, { value: "gate", icon: "shield-check" }, { value: "automated", icon: "bolt" }, { value: "parallel", icon: "arrows-split" }];
    function v(f) {
      const i = t.state;
      i.kind = f, delete i.run, delete i.release_when, delete i.regions, delete i.join, delete i.due, (f === "automated" || f === "gate") && delete i.awaiting, f === "automated" && (i.run = { stage: i.id, retry: { max: 1, backoff: "PT1M" } }), f === "gate" && (i.release_when = { approvals: { min: 1, from: { group: "" }, prevent_self: !0 } }), f === "parallel" && (i.regions = [{ id: "region_1", initial: t.process.states.find((n) => n.id !== i.id)?.id ?? "" }], i.join = "all");
    }
    function p(f) {
      t.state.run && (f ? t.state.run.on_fail = f : delete t.state.run.on_fail);
    }
    return (f, i) => (c(), g("section", Ad, [
      i[52] || (i[52] = d("h4", { class: "work-process-group" }, "Who moves the item on", -1)),
      b(r(ea), {
        class: "work-process-kinds",
        "model-value": e.state.kind ?? "human",
        options: s.map((n) => ({
          ...n,
          label: r(La)(n.value)
        })),
        optionLabel: "label",
        optionValue: "value",
        optionDisabled: "disabled",
        "allow-empty": !1,
        "aria-label": "Who moves the item on",
        "onUpdate:modelValue": v
      }, {
        option: M(({ option: n }) => [
          d("span", Pd, [
            b(r(Q), {
              icon: "tabler:" + n.icon
            }, null, 8, ["icon"]),
            d("span", null, I(n.label), 1)
          ])
        ]),
        _: 1
      }, 8, ["model-value", "options"]),
      e.state.kind === "gate" && e.state.release_when ? (c(), g(J, { key: 0 }, [
        i[33] || (i[33] = d("h4", { class: "work-process-group" }, "Approval", -1)),
        e.state.release_when.approvals ? (c(), B(Id, {
          key: 0,
          "board-id": e.boardId,
          approvals: e.state.release_when.approvals,
          onValidity: i[0] || (i[0] = (n) => a("validity", "approvers", n))
        }, null, 8, ["board-id", "approvals"])) : D("", !0),
        d("details", Rd, [
          i[32] || (i[32] = d("summary", null, "Release options", -1)),
          d("div", Od, [
            d("label", Nd, [
              i[31] || (i[31] = d("span", { class: "work-spacer" }, "Require approvals", -1)),
              b(r(Le), {
                "model-value": !!e.state.release_when.approvals,
                "aria-label": "Require approvals",
                "onUpdate:modelValue": i[1] || (i[1] = (n) => e.state.release_when.approvals = n ? { min: 1, from: { group: "" }, prevent_self: !0 } : void 0)
              }, null, 8, ["model-value"])
            ]),
            b(Ct, {
              modelValue: e.state.release_when.wait,
              "onUpdate:modelValue": i[2] || (i[2] = (n) => e.state.release_when.wait = n),
              label: "Wait before release",
              onValidity: i[3] || (i[3] = (n, u) => a("validity", u, n))
            }, null, 8, ["modelValue"]),
            b(ta, {
              label: "Release when",
              draft: e.draft,
              "board-id": e.boardId,
              modelValue: e.state.release_when.when,
              "onUpdate:modelValue": i[4] || (i[4] = (n) => e.state.release_when.when = n),
              onValidity: i[5] || (i[5] = (n) => a("validity", "release", n))
            }, null, 8, ["draft", "board-id", "modelValue"])
          ])
        ])
      ], 64)) : D("", !0),
      e.state.kind === "automated" && e.state.run ? (c(), g(J, { key: 1 }, [
        i[40] || (i[40] = d("h4", { class: "work-process-group" }, "Automation", -1)),
        d("label", Md, [
          i[34] || (i[34] = N("Run label", -1)),
          b(r(de), {
            modelValue: e.state.run.stage,
            "onUpdate:modelValue": i[6] || (i[6] = (n) => e.state.run.stage = n),
            "aria-label": "Run label",
            required: ""
          }, null, 8, ["modelValue"])
        ]),
        b(_r, {
          modelValue: e.state.run.flow_ref,
          "onUpdate:modelValue": i[7] || (i[7] = (n) => e.state.run.flow_ref = n),
          onValidity: i[8] || (i[8] = (n) => a("validity", "flow", n))
        }, null, 8, ["modelValue"]),
        b(Ct, {
          modelValue: e.state.run.timeout,
          "onUpdate:modelValue": i[9] || (i[9] = (n) => e.state.run.timeout = n),
          label: "Attempt timeout",
          onValidity: i[10] || (i[10] = (n, u) => a("validity", u, n))
        }, null, 8, ["modelValue"]),
        i[41] || (i[41] = d("small", { class: "work-muted" }, "Blank uses the board timeout, or one hour.", -1)),
        d("label", Fd, [
          i[35] || (i[35] = d("span", { class: "work-spacer" }, "Maximum visits", -1)),
          b(r(Ye), {
            "model-value": e.state.run.max_visits ?? null,
            "aria-label": "Maximum visits",
            min: 1,
            useGrouping: !1,
            placeholder: "Board default",
            "onUpdate:modelValue": i[11] || (i[11] = (n) => e.state.run.max_visits = n ?? void 0)
          }, null, 8, ["model-value"])
        ]),
        d("label", Ld, [
          i[36] || (i[36] = N("When visits are exhausted", -1)),
          b(r(le), {
            "model-value": e.state.run.on_exhausted,
            "aria-label": "When visits are exhausted",
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            showClear: "",
            options: (e.process.transitions ?? []).filter((n) => !n.auto).map((n) => ({ label: r(je)(n), value: n.id })),
            "onUpdate:modelValue": i[12] || (i[12] = (n) => e.state.run.on_exhausted = n || void 0)
          }, null, 8, ["model-value", "options"])
        ]),
        i[42] || (i[42] = d("small", { class: "work-muted" }, "Blank records a failed run and stops automation. A route must leave every incoming state or be global.", -1)),
        d("label", zd, [
          i[37] || (i[37] = d("span", { class: "work-spacer" }, "Retry if it fails", -1)),
          b(r(Le), {
            "model-value": !!e.state.run.retry,
            "aria-label": "Retry if it fails",
            "onUpdate:modelValue": i[13] || (i[13] = (n) => e.state.run.retry = n ? { max: 1, backoff: "PT1M" } : void 0)
          }, null, 8, ["model-value"])
        ]),
        e.state.run.retry ? (c(), g(J, { key: 0 }, [
          d("label", Bd, [
            i[38] || (i[38] = d("span", { class: "work-spacer" }, "Maximum attempts", -1)),
            b(r(Ye), {
              modelValue: e.state.run.retry.max,
              "onUpdate:modelValue": i[14] || (i[14] = (n) => e.state.run.retry.max = n),
              min: 1,
              useGrouping: !1
            }, null, 8, ["modelValue"])
          ]),
          b(Ct, {
            modelValue: e.state.run.retry.backoff,
            "onUpdate:modelValue": i[15] || (i[15] = (n) => e.state.run.retry.backoff = n),
            label: "Wait between attempts",
            onValidity: i[16] || (i[16] = (n, u) => a("validity", u, n))
          }, null, 8, ["modelValue"])
        ], 64)) : D("", !0),
        (c(), g(J, null, te([{ key: "on_pass", label: "On success" }, { key: "on_cancel", label: "On cancellation" }], (n) => d("label", {
          key: n.key,
          class: "work-stack work-tight"
        }, [
          N(I(n.label), 1),
          b(r(le), {
            "model-value": e.state.run[n.key],
            "aria-label": n.label,
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            showClear: "",
            options: o.value.map((u) => ({ label: r(je)(u), value: u.id })),
            "onUpdate:modelValue": (u) => e.state.run[n.key] = u || void 0
          }, null, 8, ["model-value", "aria-label", "options", "onUpdate:modelValue"])
        ])), 64)),
        d("label", jd, [
          i[39] || (i[39] = N("If it fails, go to", -1)),
          b(r(le), {
            "model-value": e.state.run.on_fail,
            "onUpdate:modelValue": p,
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            showClear: "",
            options: o.value.map((n) => ({
              label: r(je)(n) + " → " + r(he)(e.process.states.find((u) => u.id === n.to)),
              value: n.id
            }))
          }, null, 8, ["model-value", "options"])
        ])
      ], 64)) : D("", !0),
      e.state.kind === "parallel" && e.state.regions ? (c(), g(J, { key: 2 }, [
        i[47] || (i[47] = d("h4", { class: "work-process-group" }, "Lanes", -1)),
        (c(!0), g(J, null, te(e.state.regions, (n, u) => (c(), g("div", {
          key: u,
          class: "work-process-value work-stack work-tight"
        }, [
          d("div", qd, [
            d("span", null, "Lane " + I(u + 1), 1),
            i[43] || (i[43] = d("span", { class: "work-spacer" }, null, -1)),
            b(r(H), {
              severity: "danger",
              text: "",
              size: "small",
              "aria-label": "Remove lane",
              onClick: (y) => e.state.regions.splice(u, 1)
            }, {
              default: M(() => [
                b(r(Q), { icon: "tabler:trash" })
              ]),
              _: 1
            }, 8, ["onClick"])
          ]),
          d("label", Wd, [
            i[44] || (i[44] = N("Starts at", -1)),
            b(r(le), {
              modelValue: n.initial,
              "onUpdate:modelValue": (y) => n.initial = y,
              appendTo: "self",
              optionLabel: "label",
              optionValue: "value",
              options: e.process.states.filter((y) => y.id !== e.state.id).map((y) => ({ label: r(he)(y), value: y.id }))
            }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
          ])
        ]))), 128)),
        b(r(H), {
          label: "Add lane",
          severity: "secondary",
          outlined: "",
          size: "small",
          onClick: i[17] || (i[17] = (n) => e.state.regions.push({
            id: r($t)("region", e.state.regions),
            initial: e.process.states.find((u) => u.id !== e.state.id)?.id ?? ""
          }))
        }, {
          icon: M(() => [
            b(r(Q), { icon: "tabler:plus" })
          ]),
          _: 1
        }),
        d("label", Kd, [
          i[45] || (i[45] = N("Finish rule", -1)),
          b(r(le), {
            "model-value": typeof e.state.join == "number" ? "count" : e.state.join ?? "all",
            appendTo: "self",
            options: [
              { label: "All must pass", value: "all" },
              { label: "Any may pass", value: "any" },
              { label: "A number must pass", value: "count" }
            ],
            optionLabel: "label",
            optionValue: "value",
            "onUpdate:modelValue": i[18] || (i[18] = (n) => e.state.join = n === "count" ? 1 : n)
          }, null, 8, ["model-value"])
        ]),
        typeof e.state.join == "number" ? (c(), g("label", Gd, [
          i[46] || (i[46] = d("span", { class: "work-spacer" }, "Lanes needed", -1)),
          b(r(Ye), {
            modelValue: e.state.join,
            "onUpdate:modelValue": i[19] || (i[19] = (n) => e.state.join = n),
            min: 1,
            max: e.state.regions.length,
            useGrouping: !1
          }, null, 8, ["modelValue", "max"])
        ])) : D("", !0)
      ], 64)) : D("", !0),
      i[53] || (i[53] = d("h4", { class: "work-process-group" }, "Limit", -1)),
      d("label", Yd, [
        i[48] || (i[48] = d("span", { class: "work-spacer" }, "Items allowed here", -1)),
        b(kl, {
          draft: e.draft,
          state: e.state.id,
          label: "Items allowed here"
        }, null, 8, ["draft", "state"])
      ]),
      d("label", Hd, [
        i[49] || (i[49] = d("span", { class: "work-spacer" }, [
          N("Refuse moves over the limit"),
          d("small", { class: "work-muted work-block" }, "Off only warns")
        ], -1)),
        b(kl, {
          draft: e.draft,
          state: e.state.id,
          label: "Refuse moves over the limit",
          hard: ""
        }, null, 8, ["draft", "state"])
      ]),
      i[54] || (i[54] = d("h4", { class: "work-process-group" }, "Required on entry", -1)),
      b(zt, {
        label: "Required fields",
        options: e.draft.fields?.map((n) => ({ value: n.code, label: n.title || n.code })) ?? [],
        modelValue: e.state.require,
        "onUpdate:modelValue": i[20] || (i[20] = (n) => e.state.require = n)
      }, null, 8, ["options", "modelValue"]),
      !e.state.kind || e.state.kind === "human" ? (c(), B(Ct, {
        key: 3,
        modelValue: e.state.due,
        "onUpdate:modelValue": i[21] || (i[21] = (n) => e.state.due = n),
        label: "Time allowed in this state",
        onValidity: i[22] || (i[22] = (n, u) => a("validity", u, n))
      }, null, 8, ["modelValue"])) : D("", !0),
      i[55] || (i[55] = d("h4", { class: "work-process-group" }, "Assignment and conditions", -1)),
      d("label", Xd, [
        i[50] || (i[50] = N("Stage label", -1)),
        b(r(de), {
          "model-value": e.state.stage,
          "aria-label": "Stage label",
          "onUpdate:modelValue": i[23] || (i[23] = (n) => e.state.stage = n || void 0)
        }, null, 8, ["model-value"])
      ]),
      !e.state.kind || e.state.kind === "human" || e.state.kind === "parallel" ? (c(), g(J, { key: 4 }, [
        d("label", Jd, [
          b(r(Le), {
            "model-value": !!e.state.awaiting,
            "aria-label": "Awaiting people",
            "onUpdate:modelValue": i[24] || (i[24] = (n) => e.state.awaiting = n ? { group: "" } : void 0)
          }, null, 8, ["model-value"]),
          i[51] || (i[51] = N("Awaiting people", -1))
        ]),
        e.state.awaiting ? (c(), B(yd, {
          key: 0,
          modelValue: e.state.awaiting,
          "onUpdate:modelValue": i[25] || (i[25] = (n) => e.state.awaiting = n),
          draft: e.draft,
          "board-id": e.boardId,
          label: "Awaiting",
          onValidity: i[26] || (i[26] = (n) => a("validity", "awaiting", n))
        }, null, 8, ["modelValue", "draft", "board-id"])) : D("", !0)
      ], 64)) : D("", !0),
      b(la, {
        "board-id": e.boardId,
        modelValue: e.state.assign,
        "onUpdate:modelValue": i[27] || (i[27] = (n) => e.state.assign = n),
        label: "Assign to"
      }, null, 8, ["board-id", "modelValue"]),
      b(ot, {
        label: "State checks",
        example: ["installed-check"],
        "model-value": e.state.invariants,
        shape: "array",
        "onUpdate:modelValue": i[28] || (i[28] = (n) => e.state.invariants = n),
        onValidity: i[29] || (i[29] = (n) => a("validity", "invariants", n))
      }, null, 8, ["model-value"]),
      b(fd, {
        state: e.state,
        draft: e.draft,
        onValidity: i[30] || (i[30] = (n, u) => a("validity", "timer-" + n, u))
      }, null, 8, ["state", "draft"])
    ]));
  }
}), Qd = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, _d = {
  class: "work-process-controls",
  role: "toolbar",
  "aria-label": "Process tools"
}, eu = {
  key: 1,
  class: "work-process-title"
}, tu = { class: "work-muted" }, lu = {
  key: 2,
  class: "work-map-zoom",
  role: "group",
  "aria-label": "Map zoom"
}, au = ["aria-label"], ou = { class: "work-row" }, iu = { class: "work-process-meaning" }, nu = { class: "work-stack work-tight" }, su = { class: "work-process-inspector-foot" }, ru = { class: "work-row" }, du = { class: "work-process-meaning" }, uu = { class: "work-stack work-tight" }, cu = { class: "work-process-inspector-foot" }, vu = {
  key: 3,
  class: "work-row"
}, mu = { class: "work-stack work-tight" }, fu = { class: "work-dialog-actions" }, pu = /* @__PURE__ */ ue({
  __name: "ProcessEditor",
  props: {
    draft: {},
    guardRemoval: { type: Function },
    issues: {},
    boardId: {}
  },
  emits: ["validity"],
  setup(e, { emit: l }) {
    const t = e, a = l, o = Y(() => t.draft.processes ?? []), s = z(!1), v = z(""), p = z(""), f = z(""), i = z("Map"), n = z(""), u = z(), y = z(), m = z(), w = z(), C = z(!1);
    async function A() {
      C.value = !0, await yo(), w.value?.querySelector('[aria-label="State name"]')?.focus();
    }
    const U = Y(() => o.value.find((x) => x.id === p.value) ?? o.value[0]);
    function G() {
      C.value = !1, u.value = void 0, y.value = void 0, f.value = "";
    }
    function F(x) {
      C.value = !1, u.value = x, y.value = void 0, n.value = "", f.value = "";
    }
    function E(x) {
      C.value = !1, y.value = x, u.value = void 0, f.value = "";
    }
    xe(U, G);
    function $(x) {
      x === "__new" ? s.value = !0 : p.value = x;
    }
    function V() {
      const x = v.value.trim();
      if (!x) return;
      const P = x.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "") || "process", O = (/^[a-z]/.test(P) ? P : "process_" + P).slice(0, 40), Z = o.value.some((ce) => ce.id === O) ? $t(O, o.value) : O;
      (t.draft.processes ??= []).push({ id: Z, name: x, initial: "todo", states: [{ id: "todo", name: "To do", category: "unstarted" }], transitions: [] }), p.value = Z, v.value = "", s.value = !1;
    }
    async function T(x) {
      const P = { id: $t("state", x.states), name: "New state", category: "started" }, O = jl(x), Z = O.at(-1), ce = u.value ?? (Z?.category === "completed" ? O.at(-2) : Z), pe = ce && (x.transitions?.find((ge) => ge.default && ge.from !== "any" && ge.from.includes(ce.id)) ?? x.transitions?.find((ge) => ge.from !== "any" && ge.from.includes(ce.id) && x.states.findIndex((Ve) => Ve.id === ge.to) > x.states.indexOf(ce)));
      if (x.states.splice(ce ? x.states.indexOf(ce) + 1 : x.states.length, 0, P), ce && ce.category !== "completed" && ce.category !== "canceled")
        if (pe) {
          const ge = pe.to;
          pe.to = P.id, (x.transitions ??= []).push({ id: $t("transition", x.transitions ?? []), name: "Continue", from: [P.id], to: ge, ...pe.auto && pe.default ? { auto: !0, default: !0 } : {} });
        } else (x.transitions ??= []).push({ id: $t("transition", x.transitions ?? []), name: "Continue", from: [ce.id], to: P.id });
      F(P), await A();
    }
    function ae(x, P) {
      const O = U.value;
      if (!O || !P || x === P) return;
      let Z = `to_${P}`, ce = 2;
      for (; O.transitions?.some((ge) => ge.id === Z); ) Z = `to_${P}_${ce++}`;
      const pe = { id: Z, name: `To ${he(O.states.find((ge) => ge.id === P)).toLowerCase()}`, from: [x], to: P };
      (O.transitions ??= []).push(pe), E(pe);
    }
    function L(x) {
      const P = { id: $t("transition", x.transitions ?? []), name: "To " + he(x.states.at(-1)), from: [x.initial], to: x.states.at(-1)?.id ?? x.initial };
      (x.transitions ??= []).push(P), E(P);
    }
    function j(x, P) {
      const O = Uo(x, P);
      if (O.length) {
        f.value = `Used by ${O.join(", ")}. Update those references first.`;
        return;
      }
      x.transitions?.splice(x.transitions.indexOf(P), 1), G();
    }
    function R(x, P) {
      const O = Eo(x, P);
      if (O.length) {
        f.value = `${he(P)} is used by ${O.join(", ")}. Update these references first.`;
        return;
      }
      x.states.splice(x.states.indexOf(P), 1), G();
    }
    async function ne(x) {
      const P = t.draft.item_types?.filter((Z) => Z.process === x.id).map((Z) => Z.title || "Untitled item type") ?? [];
      if (P.length) {
        f.value = `Used by ${P.join(", ")}. Choose a different process for those item types first.`;
        return;
      }
      const O = await t.guardRemoval?.("processes", x.id);
      if (O) {
        f.value = O;
        return;
      }
      el(t.draft, "processes", x.id), p.value = "", G();
    }
    return (x, P) => (c(), g("section", {
      class: "work-process-editor work-stack",
      "aria-label": "Process editor",
      onKeydown: Ae(G, ["esc"])
    }, [
      f.value ? (c(), g("p", Qd, I(f.value), 1)) : D("", !0),
      (c(!0), g(J, null, te(e.issues?.filter((O) => O.code === "process " + U.value?.id) ?? [], (O) => (c(), g("p", {
        key: O.what + O.detail,
        class: "work-error work-small",
        role: "alert"
      }, I(r(Vl)(O)) + " · " + I(O.what), 1))), 128)),
      U.value ? (c(), g("div", {
        key: 1,
        class: pt(["work-process-builder", { "work-process-inspecting": u.value || y.value }])
      }, [
        d("div", _d, [
          o.value.length > 1 ? (c(), B(r(le), {
            key: 0,
            "model-value": U.value.id,
            "aria-label": "Process",
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            options: [
              ...o.value.map((O) => ({ label: O.name || "Untitled process", value: O.id })),
              { label: "New process…", value: "__new" }
            ],
            "onUpdate:modelValue": $
          }, null, 8, ["model-value", "options"])) : (c(), g("span", eu, I(U.value.name || "Process"), 1)),
          b(r(H), {
            label: "Add state",
            severity: "secondary",
            outlined: "",
            size: "small",
            onClick: P[0] || (P[0] = (O) => T(U.value))
          }, {
            icon: M(() => [
              b(r(Q), { icon: "tabler:plus" })
            ]),
            _: 1
          }),
          b(r(le), {
            modelValue: U.value.initial,
            "onUpdate:modelValue": P[1] || (P[1] = (O) => U.value.initial = O),
            "aria-label": "Starts in " + r(he)(U.value.states.find((O) => O.id === U.value.initial)),
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            options: U.value.states.map((O) => ({ label: r(he)(O), value: O.id }))
          }, {
            value: M(() => [
              d("span", tu, "Starts in " + I(r(he)(U.value.states.find((O) => O.id === U.value.initial))), 1)
            ]),
            _: 1
          }, 8, ["modelValue", "aria-label", "options"]),
          P[17] || (P[17] = d("span", { class: "work-spacer" }, null, -1)),
          i.value === "Map" ? (c(), g("div", lu, [
            b(r(H), {
              label: "Fit",
              title: "Fit to width and show the full process",
              text: "",
              severity: "secondary",
              size: "small",
              onClick: P[2] || (P[2] = (O) => m.value?.fit())
            }, {
              icon: M(() => [
                b(r(Q), { icon: "tabler:arrows-maximize" })
              ]),
              _: 1
            }),
            i.value === "Map" ? (c(), B(r(H), {
              key: 0,
              "aria-label": "Zoom out",
              title: "Zoom out",
              text: "",
              severity: "secondary",
              size: "small",
              onClick: P[3] || (P[3] = (O) => m.value?.zoomOut())
            }, {
              default: M(() => [
                b(r(Q), { icon: "tabler:minus" })
              ]),
              _: 1
            })) : D("", !0),
            i.value === "Map" ? (c(), B(r(H), {
              key: 1,
              "aria-label": "Zoom in",
              title: "Zoom in",
              text: "",
              severity: "secondary",
              size: "small",
              onClick: P[4] || (P[4] = (O) => m.value?.zoomIn())
            }, {
              default: M(() => [
                b(r(Q), { icon: "tabler:plus" })
              ]),
              _: 1
            })) : D("", !0)
          ])) : D("", !0),
          b(r(ea), {
            modelValue: i.value,
            "onUpdate:modelValue": P[5] || (P[5] = (O) => i.value = O),
            options: ["Map", "List"],
            "allow-empty": !1,
            "aria-label": "Process layout"
          }, null, 8, ["modelValue"]),
          o.value.length === 1 ? (c(), B(r(H), {
            key: 3,
            label: "New process",
            "aria-label": "New process",
            text: "",
            severity: "secondary",
            size: "small",
            onClick: P[6] || (P[6] = (O) => s.value = !0)
          }, {
            icon: M(() => [
              b(r(Q), { icon: "tabler:plus" })
            ]),
            _: 1
          })) : D("", !0)
        ]),
        i.value === "Map" ? (c(), B($r, {
          key: 0,
          ref_key: "graph",
          ref: m,
          process: U.value,
          draft: e.draft,
          "selected-state": u.value,
          "selected-transition": y.value,
          onState: F,
          onTransition: E,
          onConnect: ae,
          onClear: G
        }, null, 8, ["process", "draft", "selected-state", "selected-transition"])) : (c(), B(Rr, {
          key: 1,
          process: U.value,
          "selected-state": u.value,
          "selected-transition": y.value,
          onState: F,
          onTransition: E,
          onRemoveState: P[7] || (P[7] = (O) => R(U.value, O)),
          onRemoveTransition: P[8] || (P[8] = (O) => j(U.value, O)),
          onAddTransition: P[9] || (P[9] = (O) => L(U.value))
        }, null, 8, ["process", "selected-state", "selected-transition"])),
        u.value || y.value ? (c(), g("aside", {
          key: 2,
          ref_key: "inspector",
          ref: w,
          class: "work-process-sideform",
          "aria-label": u.value ? "State inspector" : "Transition inspector"
        }, [
          (c(!0), g(J, null, te(u.value ? [u.value] : [], (O) => (c(), g(J, {
            key: O.id
          }, [
            d("header", ou, [
              C.value ? (c(), B(r(de), {
                key: 1,
                modelValue: O.name,
                "onUpdate:modelValue": (Z) => O.name = Z,
                class: "work-process-name",
                "aria-label": "State name",
                onBlur: P[10] || (P[10] = (Z) => C.value = !1)
              }, null, 8, ["modelValue", "onUpdate:modelValue"])) : (c(), B(Ql, {
                key: 0,
                class: "work-process-state-title",
                "aria-label": "Rename state",
                onActivate: A
              }, {
                default: M(() => [
                  d("span", null, I(r(he)(O)), 1)
                ]),
                _: 2
              }, 1024)),
              b(r(H), {
                severity: "secondary",
                text: "",
                size: "small",
                "aria-label": "Close state editor",
                onClick: G
              }, {
                default: M(() => [
                  b(r(Q), { icon: "tabler:x" })
                ]),
                _: 1
              })
            ]),
            d("p", iu, I(r(To)(O, e.draft)), 1),
            b(Zd, {
              state: O,
              process: U.value,
              draft: e.draft,
              "board-id": e.boardId,
              onValidity: (Z, ce) => a("validity", Z.includes("duration:") ? Z : U.value.id + ":" + O.id + ":" + Z, ce)
            }, null, 8, ["state", "process", "draft", "board-id", "onValidity"]),
            d("label", nu, [
              P[18] || (P[18] = N("Phase", -1)),
              b(r(le), {
                modelValue: O.category,
                "onUpdate:modelValue": (Z) => O.category = Z,
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                options: ["triage", "backlog", ...r(Ma)].map((Z) => ({ label: r(_l)(Z), value: Z }))
              }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
            ]),
            P[19] || (P[19] = d("h4", { class: "work-process-group" }, "Next stop", -1)),
            b(r(le), {
              modelValue: n.value,
              "onUpdate:modelValue": P[11] || (P[11] = (Z) => n.value = Z),
              "aria-label": "Add transition to…",
              placeholder: "Add transition to…",
              appendTo: "self",
              optionLabel: "label",
              optionValue: "value",
              options: U.value.states.filter((Z) => Z !== O).map((Z) => ({ label: r(he)(Z), value: Z.id }))
            }, null, 8, ["modelValue", "options"]),
            b(r(H), {
              label: "Add transition",
              severity: "secondary",
              outlined: "",
              size: "small",
              disabled: !n.value,
              onClick: (Z) => ae(O.id, n.value)
            }, {
              icon: M(() => [
                b(r(Q), { icon: "tabler:arrow-right" })
              ]),
              _: 1
            }, 8, ["disabled", "onClick"]),
            d("footer", su, [
              b(r(H), {
                label: "Remove state",
                severity: "danger",
                text: "",
                size: "small",
                onClick: (Z) => R(U.value, O)
              }, {
                icon: M(() => [
                  b(r(Q), { icon: "tabler:trash" })
                ]),
                _: 1
              }, 8, ["onClick"])
            ])
          ], 64))), 128)),
          (c(!0), g(J, null, te(y.value ? [y.value] : [], (O) => (c(), g(J, {
            key: O.id
          }, [
            d("header", ru, [
              P[20] || (P[20] = d("h3", null, "Transition", -1)),
              P[21] || (P[21] = d("span", { class: "work-spacer" }, null, -1)),
              b(r(H), {
                severity: "secondary",
                text: "",
                size: "small",
                "aria-label": "Close transition editor",
                onClick: G
              }, {
                default: M(() => [
                  b(r(Q), { icon: "tabler:x" })
                ]),
                _: 1
              })
            ]),
            d("p", du, I(O.from === "any" ? "Any state" : O.from.map((Z) => r(he)(U.value.states.find((ce) => ce.id === Z))).join(", ")) + " → " + I(r(he)(U.value.states.find((Z) => Z.id === O.to))), 1),
            d("label", uu, [
              P[22] || (P[22] = N("Name", -1)),
              b(r(de), {
                modelValue: O.name,
                "onUpdate:modelValue": (Z) => O.name = Z,
                placeholder: r(je)(O),
                "aria-label": "Transition name"
              }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder"])
            ]),
            b(Wr, {
              transition: O,
              process: U.value,
              draft: e.draft,
              "board-id": e.boardId,
              onValidity: (Z, ce) => a("validity", U.value.id + ":transition-" + O.id + ":" + Z, ce)
            }, null, 8, ["transition", "process", "draft", "board-id", "onValidity"]),
            d("footer", cu, [
              b(r(H), {
                label: "Remove transition",
                severity: "danger",
                text: "",
                size: "small",
                onClick: (Z) => j(U.value, O)
              }, {
                icon: M(() => [
                  b(r(Q), { icon: "tabler:trash" })
                ]),
                _: 1
              }, 8, ["onClick"])
            ])
          ], 64))), 128))
        ], 8, au)) : D("", !0)
      ], 2)) : (c(), B(r(H), {
        key: 2,
        label: "New process",
        severity: "secondary",
        outlined: "",
        onClick: P[12] || (P[12] = (O) => s.value = !0)
      }, {
        icon: M(() => [
          b(r(Q), { icon: "tabler:plus" })
        ]),
        _: 1
      })),
      i.value === "List" && U.value ? (c(), g("div", vu, [
        b(r(H), {
          label: "Remove process",
          severity: "danger",
          text: "",
          size: "small",
          onClick: P[13] || (P[13] = (O) => ne(U.value))
        }, {
          icon: M(() => [
            b(r(Q), { icon: "tabler:trash" })
          ]),
          _: 1
        })
      ])) : D("", !0),
      b(za, {
        visible: s.value,
        label: "New process",
        onClose: P[16] || (P[16] = (O) => s.value = !1)
      }, {
        default: M(() => [
          d("form", {
            class: "work-dialog-box",
            "aria-label": "New process",
            onSubmit: be(V, ["stop", "prevent"])
          }, [
            P[24] || (P[24] = d("h2", null, "New process", -1)),
            d("label", mu, [
              P[23] || (P[23] = N("Name", -1)),
              b(r(de), {
                modelValue: v.value,
                "onUpdate:modelValue": P[14] || (P[14] = (O) => v.value = O),
                "aria-label": "New process name",
                autofocus: "",
                required: ""
              }, null, 8, ["modelValue"])
            ]),
            d("div", fu, [
              b(r(H), {
                label: "Cancel",
                severity: "secondary",
                outlined: "",
                onClick: P[15] || (P[15] = (O) => s.value = !1)
              }),
              b(r(H), {
                label: "Create process",
                type: "submit",
                disabled: !v.value.trim()
              }, null, 8, ["disabled"])
            ])
          ], 32)
        ]),
        _: 1
      }, 8, ["visible"])
    ], 32));
  }
}), bu = ["inert"], hu = { class: "work-stack work-tight" }, yu = /* @__PURE__ */ ue({
  __name: "ProcessMigration",
  props: {
    draft: {},
    original: {},
    disabled: { type: Boolean }
  },
  setup(e) {
    const l = e;
    function t(o, s, v) {
      v ? (o.map ??= {})[s] = v : o.map && delete o.map[s];
    }
    function a(o) {
      return l.original.processes?.find((s) => s.id === o.id)?.states.filter((s) => !o.states.some((v) => v.id === s.id)) ?? [];
    }
    return (o, s) => (c(), g("section", {
      class: "work-stack work-settings-card",
      "aria-label": "Existing items",
      inert: e.disabled || void 0
    }, [
      s[0] || (s[0] = d("h3", null, "Existing items", -1)),
      s[1] || (s[1] = d("p", { class: "work-muted work-small" }, " Choose how existing items follow these changes, then review the impact before applying. ", -1)),
      (c(!0), g(J, null, te(e.draft.processes ?? [], (v) => (c(), g("div", {
        key: v.id,
        class: "work-stack"
      }, [
        d("label", hu, [
          N(I(v.name || "Untitled process"), 1),
          b(r(le), {
            disabled: e.disabled,
            "model-value": r(va)(v),
            "aria-label": "Existing items in " + (v.name || "this process"),
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            options: [
              { label: "Follow new process", value: "follow" },
              { label: "Keep current process", value: "pin" }
            ],
            "onUpdate:modelValue": (p) => v.migration = p
          }, null, 8, ["disabled", "model-value", "aria-label", "onUpdate:modelValue"])
        ]),
        r(va)(v) !== "pin" ? (c(!0), g(J, { key: 0 }, te(a(v), (p) => (c(), g("label", {
          key: p.id,
          class: "work-stack work-tight"
        }, [
          N("Move items from " + I(r(he)(p)) + " to", 1),
          b(r(le), {
            disabled: e.disabled,
            "model-value": v.map?.[p.id],
            placeholder: "Choose a surviving state",
            appendTo: "self",
            showClear: "",
            optionLabel: "label",
            optionValue: "value",
            options: v.states.map((f) => ({ label: r(he)(f), value: f.id })),
            "onUpdate:modelValue": (f) => t(v, p.id, f)
          }, null, 8, ["disabled", "model-value", "options", "onUpdate:modelValue"])
        ]))), 128)) : D("", !0)
      ]))), 128))
    ], 8, bu));
  }
}), gu = {
  class: "work-stack",
  "aria-label": "Policy editor"
}, ku = { class: "work-settings-list" }, wu = { class: "work-settings-row" }, Vu = { class: "work-row-control" }, $u = { class: "work-settings-list work-wip-container" }, xu = { class: "work-wip-table" }, Cu = { class: "work-mono" }, Su = { class: "work-row-main" }, Tu = { class: "work-row" }, Uu = { class: "work-row" }, Eu = { class: "work-settings-list" }, Du = { class: "work-settings-row" }, Iu = { class: "work-row-control" }, Au = { class: "work-row-main" }, Pu = { class: "work-row-title" }, Ru = { class: "work-muted work-small" }, Ou = { class: "work-row-control" }, Nu = /* @__PURE__ */ ue({
  __name: "PolicyEditor",
  props: {
    draft: {}
  },
  emits: ["validity"],
  setup(e, { emit: l }) {
    const t = e, a = l, o = Y(() => t.draft.policy ?? {}), s = Y(() => [...new Set(t.draft.processes?.flatMap((n) => n.states.map((u) => u.id)) ?? [])]), v = ["audit_days", "trash_days", "tombstone_days", "interval_days"], p = { audit_days: "Zero selects 365 days.", interval_days: "Zero selects 365 days.", trash_days: "Zero allows immediate cleanup of trashed items.", tombstone_days: "Zero allows immediate cleanup of deletion records." };
    function f(n, u) {
      u === void 0 ? t.draft.policy && delete t.draft.policy[n] : (t.draft.policy ??= {})[n] = u;
    }
    function i(n, u) {
      f(n, u ?? void 0);
    }
    return (n, u) => (c(), g("section", gu, [
      u[13] || (u[13] = d("header", { class: "work-section-heading" }, [
        d("div", null, [
          d("h2", null, "Policy"),
          d("p", { class: "work-muted work-small" }, "Set capacity and how long the board keeps its history.")
        ])
      ], -1)),
      u[14] || (u[14] = d("h3", { class: "work-group-title" }, "Item keys", -1)),
      d("div", ku, [
        d("div", wu, [
          u[7] || (u[7] = d("div", { class: "work-row-main" }, [
            d("strong", { class: "work-row-title" }, "Item key prefix"),
            d("p", { class: "work-muted work-small" }, "Work reviews and claims prefix changes when you apply the schema.")
          ], -1)),
          d("div", Vu, [
            b(r(de), {
              modelValue: e.draft.key_prefix,
              "onUpdate:modelValue": u[0] || (u[0] = (y) => e.draft.key_prefix = y),
              "aria-label": "Item key prefix",
              required: "",
              pattern: "[A-Z][A-Z0-9]{1,9}",
              maxlength: "10"
            }, null, 8, ["modelValue"])
          ])
        ])
      ]),
      u[15] || (u[15] = d("h3", { class: "work-group-title" }, "Work in progress", -1)),
      u[16] || (u[16] = d("p", { class: "work-muted work-small" }, "A blank limit sets no restriction. A hard limit rejects transitions over capacity.", -1)),
      d("div", $u, [
        d("table", xu, [
          u[8] || (u[8] = d("thead", null, [
            d("tr", null, [
              d("th", null, "State"),
              d("th", null, "Limit"),
              d("th", null, "Hard limit")
            ])
          ], -1)),
          d("tbody", null, [
            (c(!0), g(J, null, te(s.value, (y) => (c(), g("tr", { key: y }, [
              d("td", null, [
                d("strong", null, I(e.draft.processes?.flatMap((m) => m.states).find((m) => m.id === y)?.name || r(ye)(y)), 1),
                d("code", Cu, I(y), 1)
              ]),
              d("td", null, [
                b(kl, {
                  draft: e.draft,
                  state: y,
                  label: y + " WIP limit"
                }, null, 8, ["draft", "state", "label"])
              ]),
              d("td", null, [
                b(kl, {
                  draft: e.draft,
                  state: y,
                  label: y + " hard WIP limit",
                  hard: ""
                }, null, 8, ["draft", "state", "label"])
              ])
            ]))), 128))
          ])
        ]),
        (c(!0), g(J, null, te(Object.keys(o.value.wip ?? {}).filter((y) => !s.value.includes(y)), (y) => (c(), g("div", {
          key: y,
          class: "work-settings-row"
        }, [
          d("div", Su, [
            N(I(r(ye)(y)) + " ", 1),
            u[9] || (u[9] = d("span", { class: "work-muted" }, "Removed state", -1))
          ]),
          b(r(H), {
            label: "Remove stale limit",
            severity: "secondary",
            outlined: "",
            onClick: (m) => delete o.value.wip[y]
          }, {
            icon: M(() => [
              b(r(Q), { icon: "tabler:trash" })
            ]),
            _: 1
          }, 8, ["onClick"])
        ]))), 128))
      ]),
      u[17] || (u[17] = d("h3", { class: "work-group-title" }, "Automated stages", -1)),
      b(Ct, {
        "model-value": o.value.stage_timeout,
        "onUpdate:modelValue": u[1] || (u[1] = (y) => f("stage_timeout", y)),
        label: "Default attempt timeout",
        onValidity: u[2] || (u[2] = (y, m) => a("validity", m, y))
      }, null, 8, ["model-value"]),
      u[18] || (u[18] = d("p", { class: "work-muted work-small" }, "Blank uses one hour. Each retry gets a new deadline.", -1)),
      d("label", Tu, [
        u[10] || (u[10] = d("span", { class: "work-spacer" }, "Default maximum visits", -1)),
        b(r(Ye), {
          "model-value": o.value.stage_max_visits ?? null,
          "aria-label": "Default maximum visits",
          min: 1,
          useGrouping: !1,
          placeholder: "5",
          "onUpdate:modelValue": u[3] || (u[3] = (y) => f("stage_max_visits", y ?? void 0))
        }, null, 8, ["model-value"])
      ]),
      u[19] || (u[19] = d("h3", { class: "work-group-title" }, "Comments", -1)),
      d("label", Uu, [
        u[11] || (u[11] = d("span", { class: "work-spacer" }, "Comments per item", -1)),
        b(r(Ye), {
          "model-value": o.value.comments_per_item ?? null,
          "aria-label": "Comments per item",
          min: 1,
          max: 1e5,
          useGrouping: !1,
          placeholder: "Application default",
          "onUpdate:modelValue": u[4] || (u[4] = (y) => f("comments_per_item", y ?? void 0))
        }, null, 8, ["model-value"])
      ]),
      u[20] || (u[20] = d("p", { class: "work-muted work-small" }, "Blank follows the application default.", -1)),
      u[21] || (u[21] = d("h3", { class: "work-group-title" }, "Saved query filters", -1)),
      u[22] || (u[22] = d("p", { class: "work-muted work-small" }, "Choose which installed query filters this board can use.", -1)),
      b(ra, {
        schema: { type: "object", properties: { scopes: { type: "array", title: "Query filter identifiers", items: { type: "string" } } } },
        "model-value": { scopes: e.draft.scopes },
        "onUpdate:modelValue": u[5] || (u[5] = (y) => e.draft.scopes = y.scopes)
      }, null, 8, ["model-value"]),
      u[23] || (u[23] = d("h3", { class: "work-group-title" }, "Audit and retention", -1)),
      d("div", Eu, [
        d("div", Du, [
          u[12] || (u[12] = d("div", { class: "work-row-main" }, [
            d("strong", { class: "work-row-title" }, "Audit trail"),
            d("p", { class: "work-muted work-small" }, "Choose which item changes appear in history.")
          ], -1)),
          d("div", Iu, [
            b(r(le), {
              "model-value": o.value.audit ?? "",
              "aria-label": "Audit trail",
              placeholder: "Installation default",
              appendTo: "self",
              optionLabel: "label",
              optionValue: "value",
              options: [{ label: "Installation default", value: "" }, { label: "Off", value: "off" }, { label: "Fields", value: "fields" }],
              "onUpdate:modelValue": u[6] || (u[6] = (y) => f("audit", y || void 0))
            }, null, 8, ["model-value"])
          ])
        ]),
        (c(), g(J, null, te(v, (y) => d("div", {
          key: y,
          class: "work-settings-row"
        }, [
          d("div", Au, [
            d("strong", Pu, I(r(ye)(y)), 1),
            d("p", Ru, "Blank follows the application default. " + I(p[y]), 1)
          ]),
          d("label", Ou, [
            b(r(Ye), {
              min: 0,
              "aria-label": r(ye)(y),
              "model-value": o.value[y] ?? null,
              placeholder: "Installation default",
              useGrouping: !1,
              "onUpdate:modelValue": (m) => i(y, m)
            }, null, 8, ["aria-label", "model-value", "onUpdate:modelValue"])
          ])
        ])), 64))
      ])
    ]));
  }
}), Mu = {
  class: "work-stack",
  "aria-label": "Relation types editor"
}, Fu = { class: "work-section-heading" }, Lu = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, zu = { class: "work-definition-meta work-muted work-small" }, Bu = { class: "work-settings-grid" }, ju = { class: "work-stack work-tight" }, qu = { class: "work-stack work-tight" }, Wu = { class: "work-stack work-tight" }, Ku = { class: "work-stack work-tight" }, Gu = { class: "work-row" }, Yu = { class: "work-relation-preview work-small" }, Hu = { class: "work-muted" }, Xu = {
  key: 0,
  class: "kx-empty"
}, Ju = { class: "work-row work-add-definition" }, Zu = { class: "work-stack work-tight" }, Qu = /* @__PURE__ */ ue({
  __name: "RelationsEditor",
  props: {
    draft: {},
    guardRemoval: { type: Function }
  },
  setup(e) {
    const l = e, t = Y(() => l.draft.relation_types ?? []), a = z(""), o = z(""), s = z(!1), v = Y(() => /^[a-z][a-z0-9_]*$/.test(a.value) && !t.value.some((i) => i.id === a.value));
    function p() {
      v.value && ((l.draft.relation_types ??= []).push({ id: a.value, outward: ye(a.value).toLowerCase(), inward: ye(a.value).toLowerCase(), cardinality: "many" }), a.value = "");
    }
    async function f(i) {
      if (!s.value) {
        s.value = !0, o.value = "";
        try {
          const n = await l.guardRemoval?.("relation_types", i);
          n ? o.value = n : el(l.draft, "relation_types", i);
        } finally {
          s.value = !1;
        }
      }
    }
    return (i, n) => (c(), g("section", Mu, [
      d("header", Fu, [
        n[1] || (n[1] = d("div", null, [
          d("h2", null, "Relation types"),
          d("p", { class: "work-muted work-small" }, "Give each direction a clear label. A used relation keeps its identity and shape.")
        ], -1)),
        b(r(Re), {
          class: "kx-tag-sm",
          severity: "secondary"
        }, {
          default: M(() => [
            N(I(t.value.length) + " " + I(t.value.length === 1 ? "relation" : "relations"), 1)
          ]),
          _: 1
        })
      ]),
      o.value ? (c(), g("p", Lu, I(o.value), 1)) : D("", !0),
      b(xl, {
        columns: "relations",
        count: t.value.length
      }, {
        default: M(() => [
          (c(!0), g(J, null, te(t.value, (u, y) => (c(), B($l, {
            title: r(ye)(u.id),
            code: u.id,
            kind: u.symmetric ? "Same both ways" : "Different each way",
            key: y,
            class: "work-stack"
          }, {
            usage: M(() => [
              d("span", zu, I(u.outward || "Related work") + " · " + I(u.inward || "Reverse relation"), 1)
            ]),
            actions: M(() => [
              b(r(H), {
                severity: "secondary",
                text: "",
                disabled: s.value,
                onClick: (m) => f(u.id),
                "aria-label": "Remove relation",
                size: "small"
              }, {
                default: M(() => [
                  b(r(Q), {
                    icon: "tabler:trash",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["disabled", "onClick"])
            ]),
            default: M(() => [
              d("div", Bu, [
                d("label", ju, [
                  n[2] || (n[2] = N("Identifier ", -1)),
                  b(r(de), {
                    modelValue: u.id,
                    "onUpdate:modelValue": (m) => u.id = m,
                    required: "",
                    pattern: "[a-z][a-z0-9_]*",
                    "aria-label": "Relation ID"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                d("label", qu, [
                  n[3] || (n[3] = N("Outward label ", -1)),
                  b(r(de), {
                    modelValue: u.outward,
                    "onUpdate:modelValue": (m) => u.outward = m,
                    "aria-label": "Outward label"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                d("label", Wu, [
                  n[4] || (n[4] = N("Inward label ", -1)),
                  b(r(de), {
                    modelValue: u.inward,
                    "onUpdate:modelValue": (m) => u.inward = m,
                    "aria-label": "Inward label"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                d("label", Ku, [
                  n[5] || (n[5] = N("Links allowed ", -1)),
                  b(r(le), {
                    "model-value": u.cardinality ?? "many",
                    "onUpdate:modelValue": (m) => u.cardinality = m,
                    "aria-label": "Links allowed",
                    appendTo: "self",
                    optionLabel: "label",
                    optionValue: "value",
                    optionDisabled: "disabled",
                    options: [{ label: "One link", value: "one", disabled: !1 }, { label: "Many links", value: "many", disabled: !1 }]
                  }, null, 8, ["model-value", "onUpdate:modelValue"])
                ]),
                d("label", Gu, [
                  b(r(Ft), {
                    modelValue: u.symmetric,
                    "onUpdate:modelValue": (m) => u.symmetric = m,
                    "aria-label": "Same meaning in both directions",
                    binary: ""
                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                  n[6] || (n[6] = N("Same meaning in both directions ", -1))
                ])
              ]),
              d("p", Yu, [
                n[7] || (n[7] = d("strong", null, "This item", -1)),
                N(" " + I(u.outward || "relates to") + " ", 1),
                n[8] || (n[8] = d("strong", null, "another item", -1)),
                d("span", Hu, " · reverse: " + I(u.symmetric ? u.outward : u.inward), 1)
              ])
            ]),
            _: 2
          }, 1032, ["title", "code", "kind"]))), 128)),
          t.value.length ? D("", !0) : (c(), g("p", Xu, "No relation types yet. Add one to link related work.")),
          d("div", Ju, [
            d("label", Zu, [
              n[9] || (n[9] = N("New relation ID ", -1)),
              b(r(de), {
                modelValue: a.value,
                "onUpdate:modelValue": n[0] || (n[0] = (u) => a.value = u),
                placeholder: "related_to",
                onKeydown: Ae(be(p, ["prevent"]), ["enter"])
              }, null, 8, ["modelValue", "onKeydown"])
            ]),
            b(r(H), {
              label: "Add relation",
              severity: "secondary",
              disabled: !v.value,
              onClick: p,
              outlined: ""
            }, {
              icon: M(() => [
                b(r(Q), {
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
function _u(e, l) {
  return e.parked ? "Stopped: " + (typeof e.error == "string" ? e.error : e.error?.message ?? "Projection is parked") : e.bootstrapping ? "Initializing" : e.last_seq >= l ? "Up to date" : "Catching up";
}
const ec = {
  class: "work-stack",
  "aria-label": "Plugins editor"
}, tc = { class: "work-section-heading" }, lc = {
  key: 0,
  class: "kx-loading"
}, ac = {
  key: 1,
  class: "kx-err",
  role: "alert"
}, oc = {
  key: 2,
  class: "work-notice",
  role: "status"
}, ic = { class: "work-row" }, nc = {
  key: 0,
  class: "work-muted work-small"
}, sc = {
  key: 1,
  class: "kx-err"
}, rc = {
  key: 2,
  class: "work-notice"
}, dc = {
  key: 3,
  class: "work-stack work-tight work-plugin-status",
  role: "status"
}, uc = {
  key: 0,
  class: "kx-err"
}, cc = { class: "work-muted work-small" }, vc = { class: "work-form-actions" }, mc = {
  key: 0,
  class: "work-muted work-small"
}, Da = /* @__PURE__ */ ue({
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
  setup(e, { emit: l }) {
    const t = e, a = l, o = z({}), s = z(""), v = z(""), p = z(""), f = z(/* @__PURE__ */ new Set()), i = {};
    function n(F) {
      return t.schema.plugins?.find((E) => E.plugin === F);
    }
    function u(F) {
      return n(F)?.active === !0;
    }
    function y(F) {
      return n(F)?.lifecycle.state === "ready";
    }
    function m(F) {
      return t.draft.plugins?.some((E) => E.use === F) === !0;
    }
    function w(F, E) {
      const $ = t.draft.plugins ?? [];
      E && !m(F) && (t.draft.plugins = [...$, { use: F }]), E || (t.draft.plugins = $.filter((V) => V.use !== F), delete t.configs[F], f.value.delete(F), a("validity", F, !0));
    }
    function C(F) {
      return u(F) ? o.value[F] ?? n(F)?.config ?? i : t.configs[F] ?? i;
    }
    function A(F, E) {
      u(F) ? o.value[F] = E : t.configs[F] = E;
    }
    function U(F, E) {
      E ? f.value.delete(F) : f.value.add(F), u(F) || a("validity", F, E);
    }
    async function G(F) {
      if (!(s.value || f.value.has(F))) {
        s.value = F, v.value = "", p.value = "";
        try {
          await wt.configure(t.boardId, F, C(F)), delete o.value[F], p.value = "Plugin configuration saved.", a("configured");
        } catch (E) {
          v.value = We(E, "Could not configure plugin.");
        } finally {
          s.value = "";
        }
      }
    }
    return (F, E) => (c(), g("section", ec, [
      d("header", tc, [
        E[1] || (E[1] = d("div", null, [
          d("h2", null, "Plugins"),
          d("p", { class: "work-muted work-small" }, "Add capabilities from installed modules.")
        ], -1)),
        b(r(H), {
          label: "Refresh status",
          severity: "secondary",
          outlined: "",
          disabled: !!s.value || e.disabled,
          onClick: E[0] || (E[0] = ($) => a("refresh"))
        }, {
          icon: M(() => [
            b(r(Q), {
              icon: "tabler:refresh",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        }, 8, ["disabled"])
      ]),
      E[5] || (E[5] = d("p", { class: "work-muted work-small" }, "Activation joins the schema draft and requires review. Active plugin configuration saves separately. Status reflects the last read; refresh to check progress.", -1)),
      e.options.length ? D("", !0) : (c(), g("p", lc, "No installed plugins are visible to you.")),
      v.value ? (c(), g("div", ac, I(v.value), 1)) : D("", !0),
      p.value ? (c(), g("p", oc, I(p.value), 1)) : D("", !0),
      b(xl, {
        columns: "plugins",
        count: e.options.length
      }, {
        default: M(() => [
          (c(!0), g(J, null, te(e.options, ($) => (c(), B($l, {
            key: $.plugin,
            title: $.title || "Unavailable capability",
            description: $.description,
            kind: u($.plugin) ? "Active" : m($.plugin) ? "Pending review" : "Inactive",
            class: "work-stack"
          }, {
            actions: M(() => [
              E[3] || (E[3] = d("span", { class: "work-spacer" }, null, -1)),
              d("label", ic, [
                b(r(Le), {
                  "model-value": m($.plugin),
                  disabled: !!s.value || e.disabled || e.activationLocked || !!$.problem,
                  "onUpdate:modelValue": (V) => w($.plugin, V)
                }, null, 8, ["model-value", "disabled", "onUpdate:modelValue"]),
                E[2] || (E[2] = N("Activate on this board", -1))
              ])
            ]),
            default: M(() => [
              $.requires.length ? (c(), g("p", nc, "Requires " + I($.requires.map((V) => e.options.find((T) => T.plugin === V)?.title || "Another capability").join(", ")), 1)) : D("", !0),
              $.problem ? (c(), g("p", sc, I($.problem.message), 1)) : D("", !0),
              n($.plugin)?.outdated ? (c(), g("p", rc, "The stored declaration differs from the installed plugin. Review activation to update it.")) : D("", !0),
              u($.plugin) ? (c(), g("div", dc, [
                d("p", null, I(y($.plugin) ? "Attachment configured" : n($.plugin)?.lifecycle.state === "failed" ? "Configuration failed" : "Configuring attachment"), 1),
                n($.plugin)?.lifecycle.error ? (c(), g("p", uc, I(n($.plugin)?.lifecycle.error?.message), 1)) : D("", !0),
                (c(!0), g(J, null, te(n($.plugin)?.projections, (V, T) => (c(), g("div", { key: T }, [
                  d("p", null, I(r(_u)(V, e.schema.as_of)), 1),
                  d("p", cc, "Position " + I(V.last_seq) + " · Board head " + I(e.schema.as_of), 1)
                ]))), 128))
              ])) : D("", !0),
              !$.problem && (m($.plugin) || u($.plugin)) ? (c(), g(J, { key: 4 }, [
                b(ra, {
                  disabled: !!s.value || e.disabled,
                  schema: $.config_schema,
                  "model-value": C($.plugin),
                  "onUpdate:modelValue": (V) => A($.plugin, V),
                  onValidity: (V) => U($.plugin, V)
                }, null, 8, ["disabled", "schema", "model-value", "onUpdate:modelValue", "onValidity"]),
                d("div", vc, [
                  b(r(H), {
                    label: "Reset",
                    severity: "secondary",
                    outlined: "",
                    disabled: !!s.value || e.disabled,
                    onClick: (V) => A($.plugin, u($.plugin) ? r(kt)(n($.plugin)?.config ?? {}) : {})
                  }, {
                    icon: M(() => [
                      b(r(Q), { icon: "tabler:restore" })
                    ]),
                    _: 1
                  }, 8, ["disabled", "onClick"]),
                  u($.plugin) ? (c(), B(r(H), {
                    key: 0,
                    label: "Save configuration",
                    disabled: !!s.value || e.disabled || f.value.has($.plugin),
                    loading: s.value === $.plugin,
                    onClick: (V) => G($.plugin)
                  }, {
                    icon: M(() => [
                      b(r(Q), {
                        icon: "tabler:device-floppy",
                        "aria-hidden": "true"
                      })
                    ]),
                    _: 1
                  }, 8, ["disabled", "loading", "onClick"])) : D("", !0)
                ]),
                u($.plugin) ? D("", !0) : (c(), g("p", mc, "Initial configuration is included in Review and Apply."))
              ], 64)) : D("", !0)
            ]),
            _: 2
          }, 1032, ["title", "description", "kind"]))), 128))
        ]),
        _: 1
      }, 8, ["count"]),
      (c(!0), g(J, null, te(e.draft.plugins?.filter(($) => !e.options.some((V) => V.plugin === $.use)) ?? [], ($) => (c(), g("article", {
        key: $.use,
        class: "work-settings-card"
      }, [
        E[4] || (E[4] = d("p", null, "Unavailable plugin", -1)),
        b(r(H), {
          label: "Deactivate plugin",
          severity: "secondary",
          onClick: (V) => w($.use, !1),
          outlined: ""
        }, {
          icon: M(() => [
            b(r(Q), {
              icon: "tabler:trash",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        }, 8, ["onClick"])
      ]))), 128))
    ]));
  }
}), fc = {
  class: "work-stack",
  "aria-label": "Board visibility"
}, pc = { class: "work-stack work-tight" }, bc = {
  key: 0,
  class: "work-row"
}, hc = { class: "work-stack work-tight" }, yc = { class: "work-settings-list" }, gc = { class: "work-row-main" }, kc = { class: "work-small work-muted" }, wc = { class: "work-row-control" }, Vc = { class: "work-row" }, $c = /* @__PURE__ */ ue({
  __name: "VisibilityEditor",
  props: {
    draft: {},
    boardId: {}
  },
  emits: ["validity"],
  setup(e, { emit: l }) {
    const t = e, a = l, o = Y(() => t.draft.visibility), s = Y(() => (t.draft.fields ?? []).filter((u) => u.form === "text" && (!u.cardinality || u.cardinality === "one") && u.type !== "rollup" && u.index !== "number" && u.config?.case !== "insensitive")), v = z(""), p = Y(() => s.value.find((u) => u.code === o.value?.field)?.type !== "option");
    function f() {
      !v.value || !o.value || o.value.levels.some((u) => u.id === v.value) || (o.value.levels.push({ id: v.value, holders: [] }), v.value = "");
    }
    function i(u) {
      if (!u) {
        delete t.draft.visibility;
        return;
      }
      const y = s.value.find((m) => m.code === u);
      t.draft.visibility = { field: u, levels: (y?.options ?? []).map((m) => ({ id: m.id, holders: [] })) };
    }
    function n(u, y) {
      const m = o.value?.levels.find((w) => w.id === u);
      m && (m.holders = y ?? []);
    }
    return (u, y) => (c(), g("section", fc, [
      y[10] || (y[10] = d("h3", { class: "work-group-title" }, "Board visibility", -1)),
      y[11] || (y[11] = d("p", { class: "work-small work-muted" }, "Restrict items by their visibility level. People still need access to the board.", -1)),
      d("label", pc, [
        y[7] || (y[7] = N("Visibility field", -1)),
        b(r(le), {
          "aria-label": "Visibility field",
          placeholder: "No additional restriction",
          "model-value": o.value?.field ?? "",
          options: [{ label: "No additional restriction", value: "" }, ...s.value.map((m) => ({ label: r(St)(m), value: m.code }))],
          optionLabel: "label",
          optionValue: "value",
          appendTo: "self",
          "onUpdate:modelValue": y[0] || (y[0] = (m) => i(m))
        }, null, 8, ["model-value", "options"])
      ]),
      o.value ? (c(), g(J, { key: 0 }, [
        p.value ? (c(), g("div", bc, [
          d("label", hc, [
            y[8] || (y[8] = N("Level ID", -1)),
            b(r(de), {
              modelValue: v.value,
              "onUpdate:modelValue": y[1] || (y[1] = (m) => v.value = m),
              "aria-label": "New visibility level",
              onKeydown: Ae(be(f, ["prevent"]), ["enter"])
            }, null, 8, ["modelValue", "onKeydown"])
          ]),
          b(r(H), {
            label: "Add level",
            severity: "secondary",
            outlined: "",
            disabled: !v.value || o.value.levels.some((m) => m.id === v.value),
            onClick: f
          }, null, 8, ["disabled"])
        ])) : D("", !0),
        d("div", yc, [
          (c(!0), g(J, null, te(o.value.levels, (m, w) => (c(), g("div", {
            key: m.id,
            class: "work-settings-row"
          }, [
            d("div", gc, [
              d("strong", null, I(s.value.find((C) => C.code === o.value.field)?.options?.find((C) => C.id === m.id)?.label || m.id), 1),
              d("p", kc, "Level " + I(w + 1), 1)
            ]),
            d("div", wc, [
              b(Wa, {
                "board-id": e.boardId,
                label: "Who can see these items",
                "model-value": m.holders,
                "onUpdate:modelValue": (C) => n(m.id, C),
                onValidity: y[2] || (y[2] = (C) => a("validity", C))
              }, null, 8, ["board-id", "model-value", "onUpdate:modelValue"])
            ])
          ]))), 128))
        ]),
        d("label", Vc, [
          b(r(Le), {
            "model-value": o.value.bypass === "admin",
            "onUpdate:modelValue": y[3] || (y[3] = (m) => m ? o.value.bypass = "admin" : delete o.value.bypass)
          }, null, 8, ["model-value"]),
          y[9] || (y[9] = N("Board administrators can see every level", -1))
        ]),
        b(r(H), {
          label: "Remove visibility restriction",
          severity: "secondary",
          text: "",
          onClick: y[4] || (y[4] = (m) => delete e.draft.visibility)
        })
      ], 64)) : D("", !0),
      b(ot, {
        label: "Visibility rules",
        "model-value": o.value,
        shape: "object",
        example: { field: "visibility", levels: [{ id: "internal", holders: [] }], bypass: "admin" },
        "onUpdate:modelValue": y[5] || (y[5] = (m) => e.draft.visibility = m),
        onValidity: y[6] || (y[6] = (m) => a("validity", m))
      }, null, 8, ["model-value"])
    ]));
  }
}), xc = { class: "kx-head" }, Cc = { class: "kx-head-icon" }, Sc = { class: "kx-head-text" }, Tc = { class: "kx-title" }, Uc = ["title"], Ec = { class: "kx-head-actions" }, Dc = /* @__PURE__ */ ue({
  __name: "PageHead",
  props: {
    title: {},
    subtitle: {},
    icon: { default: "tabler:layout-kanban" },
    backLabel: {}
  },
  emits: ["back"],
  setup(e) {
    return (l, t) => (c(), g("header", xc, [
      e.backLabel ? (c(), B(r(H), {
        key: 0,
        "aria-label": e.backLabel,
        severity: "secondary",
        text: "",
        onClick: t[0] || (t[0] = (a) => l.$emit("back"))
      }, {
        default: M(() => [
          b(r(Q), {
            icon: "tabler:arrow-left",
            "aria-hidden": "true"
          })
        ]),
        _: 1
      }, 8, ["aria-label"])) : D("", !0),
      d("div", Cc, [
        b(r(Q), {
          icon: e.icon,
          "aria-hidden": "true"
        }, null, 8, ["icon"])
      ]),
      d("div", Sc, [
        Ke(l.$slots, "identity", {}, () => [
          d("h1", Tc, I(e.title), 1),
          e.subtitle ? (c(), g("p", {
            key: 0,
            class: "kx-head-sub",
            title: e.subtitle
          }, I(e.subtitle), 9, Uc)) : D("", !0)
        ])
      ]),
      d("div", Ec, [
        Ke(l.$slots, "default")
      ])
    ]));
  }
}), Ic = { class: "work-board-identity work-stack work-tight" }, Ac = { class: "work-stack work-tight" }, Pc = { class: "work-stack work-tight" }, Rc = { class: "work-stack work-tight" }, Oc = ["value", "inert"], Nc = {
  key: 1,
  class: "work-muted work-small"
}, Mc = { class: "work-row" }, Fc = { class: "work-row" }, Lc = {
  key: 2,
  class: "work-identity-actions"
}, zc = ["title"], Bc = {
  key: 2,
  class: "kx-err work-inline",
  role: "alert"
}, jc = {
  key: 3,
  class: "work-muted work-small",
  role: "status"
}, Ia = /* @__PURE__ */ ue({
  __name: "BoardIdentity",
  props: {
    board: {},
    compact: { type: Boolean },
    detail: { type: Boolean },
    subtitle: {}
  },
  emits: ["saved"],
  setup(e, { emit: l }) {
    const t = e, a = l, o = z(!1), s = z(""), v = z(""), p = z(""), f = z(!1), i = z(!1), n = z(""), u = z(""), y = Y(() => t.board?.access?.admin === !0);
    function m() {
      s.value = t.board?.title ?? "", p.value = t.board?.icon ?? "", lt("wc-icon-picker").then((C) => f.value = C), v.value = t.board?.description ?? "", n.value = "", u.value = "", o.value = !0;
    }
    xe(y, (C) => {
      C || (o.value = !1);
    });
    async function w() {
      if (!y.value || !t.board || i.value || !s.value.trim()) return;
      const C = {};
      if (s.value.trim() !== t.board.title && (C.title = s.value.trim()), v.value !== (t.board.description ?? "") && (C.description = v.value), p.value !== (t.board.icon ?? "") && (C.icon = p.value), !Object.keys(C).length) {
        o.value = !1, u.value = "Nothing changed.";
        return;
      }
      i.value = !0, n.value = "";
      try {
        const A = await xt.updateBoard(t.board.board_id, C);
        o.value = !1, u.value = A.status === "unchanged" ? "Nothing changed." : "Board saved.", a("saved");
      } catch (A) {
        n.value = We(A, "Could not save the board.");
      } finally {
        i.value = !1;
      }
    }
    return (C, A) => (c(), g("div", Ic, [
      o.value ? (c(), g("form", {
        key: 0,
        class: "work-identity-edit",
        "aria-label": "Edit board",
        onClick: A[4] || (A[4] = be(() => {
        }, ["stop"])),
        onSubmit: be(w, ["prevent"])
      }, [
        d("label", Ac, [
          A[5] || (A[5] = N("Title", -1)),
          b(r(de), {
            modelValue: s.value,
            "onUpdate:modelValue": A[0] || (A[0] = (U) => s.value = U),
            required: "",
            autofocus: "",
            disabled: i.value
          }, null, 8, ["modelValue", "disabled"])
        ]),
        d("label", Pc, [
          A[6] || (A[6] = N("Description", -1)),
          b(r(fl), {
            modelValue: v.value,
            "onUpdate:modelValue": A[1] || (A[1] = (U) => v.value = U),
            rows: "1",
            disabled: i.value
          }, null, 8, ["modelValue", "disabled"])
        ]),
        d("div", Rc, [
          A[7] || (A[7] = d("span", null, "Board icon", -1)),
          f.value ? (c(), g("wc-icon-picker", {
            key: 0,
            value: p.value,
            fallback: "tabler:layout-kanban",
            inert: i.value || void 0,
            onSelect: A[2] || (A[2] = (U) => p.value = U.detail)
          }, null, 40, Oc)) : (c(), g("p", Nc, "The icon picker is unavailable."))
        ]),
        d("div", Mc, [
          b(r(H), {
            label: "Save",
            severity: "secondary",
            type: "submit",
            disabled: !s.value.trim() || i.value,
            loading: i.value,
            outlined: ""
          }, {
            icon: M(() => [
              b(r(Q), {
                icon: "tabler:device-floppy",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled", "loading"]),
          b(r(H), {
            label: "Cancel",
            severity: "secondary",
            disabled: i.value,
            onClick: A[3] || (A[3] = (U) => o.value = !1),
            outlined: ""
          }, {
            icon: M(() => [
              b(r(Q), {
                icon: "tabler:x",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled"])
        ])
      ], 32)) : (c(), g(J, { key: 1 }, [
        d("div", Fc, [
          e.board?.icon ? (c(), B(r(Q), {
            key: 0,
            icon: e.board.icon,
            "aria-hidden": "true"
          }, null, 8, ["icon"])) : D("", !0),
          (c(), B(Bl(e.compact || e.detail ? "h2" : "h1"), {
            class: pt(e.detail ? "work-detail-title" : e.compact ? "kx-card-name" : "kx-title")
          }, {
            default: M(() => [
              N(I(e.board?.title || "Untitled board"), 1)
            ]),
            _: 1
          }, 8, ["class"])),
          e.compact ? Ke(C.$slots, "title-end", {}, void 0, void 0, 1) : D("", !0),
          e.compact ? (c(), g("span", Lc, [
            y.value ? (c(), B(r(H), {
              key: 0,
              severity: "secondary",
              text: "",
              size: "small",
              onClick: be(m, ["stop"]),
              "aria-label": "Edit board"
            }, {
              default: M(() => [
                b(r(Q), {
                  icon: "tabler:pencil",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            })) : D("", !0),
            Ke(C.$slots, "actions")
          ])) : y.value ? (c(), B(r(H), {
            key: 3,
            severity: "secondary",
            text: "",
            size: "small",
            onClick: be(m, ["stop"]),
            "aria-label": "Edit board"
          }, {
            default: M(() => [
              b(r(Q), {
                icon: "tabler:pencil",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          })) : D("", !0),
          e.compact ? D("", !0) : Ke(C.$slots, "title-end", {}, void 0, void 0, 4)
        ]),
        !e.compact && (e.subtitle || e.board?.description) ? (c(), g("p", {
          key: 0,
          class: "kx-head-sub",
          title: e.subtitle || e.board?.description
        }, I(e.subtitle || e.board?.description), 9, zc)) : D("", !0)
      ], 64)),
      n.value ? (c(), g("p", Bc, I(n.value), 1)) : D("", !0),
      u.value ? (c(), g("p", jc, I(u.value), 1)) : D("", !0)
    ]));
  }
}), qc = {
  key: 0,
  class: "work-dirty"
}, Aa = /* @__PURE__ */ ue({
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
    return (l, t) => (c(), g(J, null, [
      e.dirty ? (c(), g("span", qc, "Unsaved changes")) : D("", !0),
      b(r(H), {
        label: "Discard",
        severity: "secondary",
        outlined: "",
        disabled: !e.dirty || e.busy || e.checkingRemoval,
        onClick: t[0] || (t[0] = (a) => l.$emit("discard"))
      }, {
        icon: M(() => [
          b(r(Q), { icon: "tabler:restore" })
        ]),
        _: 1
      }, 8, ["disabled"]),
      b(r(H), {
        label: e.reviewed ? "Apply" : "Review changes",
        disabled: e.disabled,
        loading: e.busy,
        onClick: t[1] || (t[1] = (a) => l.$emit("primary"))
      }, null, 8, ["label", "disabled", "loading"])
    ], 64));
  }
}), Wc = {
  key: 0,
  class: "work-detail-head"
}, Kc = {
  key: 0,
  class: "work-row work-wrap work-draft-actions"
}, Gc = {
  key: 2,
  class: "kx-err",
  role: "alert"
}, Yc = ["config"], Hc = /* @__PURE__ */ ue({
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
  emits: ["back", "discard", "primary", "saved", "upgrade", "install"],
  setup(e) {
    const l = e, t = z(!1), a = z(!1), o = z("");
    async function s() {
      !l.authorized || !l.board || (o.value = "", a.value = await lt("kickside-share"), a.value ? t.value = !0 : o.value = "The sharing widget is unavailable. Try Share board again.");
    }
    xe(() => l.authorized, (i) => {
      i || (t.value = !1);
    });
    const v = Y(() => JSON.stringify({ resource_id: l.board?.board_id, title: l.board?.title, access_url: `/api/v1/component-access/grants/${encodeURIComponent(l.board?.board_id ?? "")}`, share_url: `/api/v1/component-access/share/${encodeURIComponent(l.board?.board_id ?? "")}` })), p = Y(() => l.pack ? `${l.packTitle} ${l.pack.version}${l.outdated ? " · Outdated" : ""}` : ""), f = Y(() => "Settings · generation " + (l.generation ?? "…") + (p.value ? " · " + p.value : ""));
    return (i, n) => (c(), g(J, null, [
      e.embedded ? (c(), g("header", Wc, [
        b(Ia, {
          board: e.board,
          subtitle: p.value || void 0,
          detail: "",
          onSaved: n[0] || (n[0] = (u) => i.$emit("saved"))
        }, {
          "title-end": M(() => [
            b(r(Re), {
              severity: "secondary",
              value: "Generation " + (e.generation ?? "…")
            }, null, 8, ["value"])
          ]),
          _: 1
        }, 8, ["board", "subtitle"]),
        e.authorized ? (c(), g("div", Kc, [
          e.authorized && e.outdated && e.pack ? (c(), B(r(H), {
            key: 0,
            disabled: !e.canUpgrade,
            title: e.upgradeReason,
            label: "Upgrade pack",
            severity: "secondary",
            outlined: "",
            onClick: n[1] || (n[1] = (u) => i.$emit("upgrade"))
          }, {
            icon: M(() => [
              b(r(Q), { icon: "tabler:refresh" })
            ]),
            _: 1
          }, 8, ["disabled", "title"])) : D("", !0),
          e.authorized && e.board ? (c(), B(r(H), {
            key: 1,
            label: "Share board",
            severity: "secondary",
            outlined: "",
            disabled: e.busy,
            onClick: s
          }, {
            icon: M(() => [
              b(r(Q), {
                icon: "tabler:share",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled"])) : D("", !0),
          e.authorized && !e.pack ? (c(), B(r(H), {
            key: 2,
            label: "Install pack",
            severity: "secondary",
            outlined: "",
            disabled: e.busy || e.dirty,
            onClick: n[2] || (n[2] = (u) => i.$emit("install"))
          }, null, 8, ["disabled"])) : D("", !0),
          b(Aa, {
            dirty: e.dirty,
            busy: e.busy,
            "checking-removal": e.checkingRemoval,
            reviewed: e.reviewed,
            disabled: e.disabled,
            onDiscard: n[3] || (n[3] = (u) => i.$emit("discard")),
            onPrimary: n[4] || (n[4] = (u) => i.$emit("primary"))
          }, null, 8, ["dirty", "busy", "checking-removal", "reviewed", "disabled"])
        ])) : D("", !0)
      ])) : (c(), B(Dc, {
        key: 1,
        title: e.board?.title || "Board",
        subtitle: f.value,
        "back-label": "Back to board",
        icon: "tabler:adjustments",
        onBack: n[10] || (n[10] = (u) => i.$emit("back"))
      }, {
        identity: M(() => [
          b(Ia, {
            board: e.board,
            subtitle: f.value,
            onSaved: n[5] || (n[5] = (u) => i.$emit("saved"))
          }, null, 8, ["board", "subtitle"])
        ]),
        default: M(() => [
          e.authorized && e.outdated && e.pack ? (c(), B(r(H), {
            key: 0,
            disabled: !e.canUpgrade,
            title: e.upgradeReason,
            label: "Upgrade pack",
            severity: "secondary",
            outlined: "",
            onClick: n[6] || (n[6] = (u) => i.$emit("upgrade"))
          }, {
            icon: M(() => [
              b(r(Q), { icon: "tabler:refresh" })
            ]),
            _: 1
          }, 8, ["disabled", "title"])) : D("", !0),
          e.authorized && e.board ? (c(), B(r(H), {
            key: 1,
            label: "Share board",
            severity: "secondary",
            outlined: "",
            disabled: e.busy,
            onClick: s
          }, {
            icon: M(() => [
              b(r(Q), {
                icon: "tabler:share",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled"])) : D("", !0),
          e.authorized && !e.pack ? (c(), B(r(H), {
            key: 2,
            label: "Install pack",
            severity: "secondary",
            outlined: "",
            disabled: e.busy || e.dirty,
            onClick: n[7] || (n[7] = (u) => i.$emit("install"))
          }, null, 8, ["disabled"])) : D("", !0),
          e.authorized ? (c(), B(Aa, {
            key: 3,
            dirty: e.dirty,
            busy: e.busy,
            "checking-removal": e.checkingRemoval,
            reviewed: e.reviewed,
            disabled: e.disabled,
            onDiscard: n[8] || (n[8] = (u) => i.$emit("discard")),
            onPrimary: n[9] || (n[9] = (u) => i.$emit("primary"))
          }, null, 8, ["dirty", "busy", "checking-removal", "reviewed", "disabled"])) : D("", !0)
        ]),
        _: 1
      }, 8, ["title", "subtitle"])),
      o.value ? (c(), g("p", Gc, I(o.value), 1)) : D("", !0),
      t.value && a.value && e.authorized ? (c(), g("kickside-share", {
        key: 3,
        config: v.value,
        onClose: n[11] || (n[11] = (u) => t.value = !1),
        onChanged: n[12] || (n[12] = (u) => i.$emit("saved"))
      }, null, 40, Yc)) : D("", !0)
    ], 64));
  }
}), Xc = {
  key: 0,
  class: "work-settings-card work-schema-plan work-stack",
  "aria-label": "Schema review"
}, Jc = { key: 0 }, Zc = { class: "work-row" }, Qc = { class: "work-muted work-small" }, _c = { class: "work-muted" }, ev = {
  key: 0,
  class: "work-notice"
}, tv = {
  key: 1,
  class: "work-notice"
}, lv = {
  key: 2,
  class: "work-muted work-small"
}, av = {
  key: 3,
  class: "work-stack work-tight",
  "aria-label": "Reviewed Flow bindings"
}, ov = { key: 4 }, iv = { key: 0 }, nv = {
  key: 5,
  class: "work-settings-table"
}, sv = { key: 0 }, rv = { key: 1 }, dv = { key: 2 }, uv = { key: 6 }, cv = /* @__PURE__ */ ue({
  __name: "SchemaReview",
  props: {
    declaration: {},
    plan: {},
    generation: {},
    follows: {},
    configCount: {},
    packReview: { type: Boolean }
  },
  setup(e) {
    const l = e, t = Y(() => l.declaration?.processes?.flatMap((a) => a.states.filter((o) => o.run?.flow_ref).map((o) => ({ process: a.name || a.id, state: o.name || o.id, reference: o.run.flow_ref }))) ?? []);
    return (a, o) => e.plan ? (c(), g("section", Xc, [
      !e.plan.changes.length && !e.plan.refused.length && !e.configCount && !e.packReview ? (c(), g("p", Jc, "No changes to apply.")) : (c(), g(J, { key: 1 }, [
        d("header", Zc, [
          o[0] || (o[0] = d("h2", null, "Review", -1)),
          b(r(Re), {
            class: "kx-tag-sm",
            severity: e.plan.class === "refused" ? "danger" : e.plan.class === "semantic" ? "warn" : e.plan.class === "additive" ? "success" : "secondary"
          }, {
            default: M(() => [
              N(I(e.plan.class), 1)
            ]),
            _: 1
          }, 8, ["severity"]),
          d("span", Qc, "Generation " + I(e.generation) + " → " + I(e.plan.generation), 1)
        ]),
        d("p", _c, I(r(Do)[e.plan.class] || "Review the classified changes below."), 1),
        e.plan.migration ? (c(), g("p", ev, "Migration needed: " + I(e.plan.migration), 1)) : e.follows.length ? (c(), g("p", tv, "Follow migration: " + I(e.follows.join(", ")) + ". Existing items move to the new process generation; declared state maps apply.", 1)) : (c(), g("p", lv, "No follow process migration is indicated by these changes.")),
        t.value.length ? (c(), g("section", av, [
          o[1] || (o[1] = d("h3", null, "Flow bindings", -1)),
          (c(!0), g(J, null, te(t.value, (s) => (c(), g("p", {
            key: s.process + ":" + s.state
          }, I(s.process) + " / " + I(s.state) + ": " + I(s.reference.id) + " · v" + I(s.reference.version), 1))), 128)),
          o[2] || (o[2] = d("p", { class: "work-muted work-small" }, "New entries use these exact published versions. Before replacing a binding, stop new entries, drain existing attempts and deliveries, pause the old launcher, save, then resume entries.", -1))
        ])) : D("", !0),
        Ke(a.$slots, "default"),
        e.plan.refused.length ? (c(), g("h3", ov, "Refused changes")) : D("", !0),
        (c(!0), g(J, null, te(e.plan.refused, (s, v) => (c(), B(r(Ko), {
          key: v,
          severity: "error",
          role: "alert"
        }, {
          default: M(() => [
            N(I(s.code) + " · " + I(s.what) + " · " + I(r(Vl)(s)), 1),
            s.to ? (c(), g("span", iv, " → " + I(s.to), 1)) : D("", !0)
          ]),
          _: 2
        }, 1024))), 128)),
        e.plan.changes.length ? (c(), g("table", nv, [
          o[3] || (o[3] = d("thead", null, [
            d("tr", null, [
              d("th", null, "Entry"),
              d("th", null, "Class"),
              d("th", null, "Change")
            ])
          ], -1)),
          d("tbody", null, [
            (c(!0), g(J, null, te(e.plan.changes, (s, v) => (c(), g("tr", { key: v }, [
              d("td", null, I(s.code), 1),
              d("td", null, [
                b(r(Re), {
                  class: "kx-tag-sm",
                  severity: s.class === "refused" ? "danger" : s.class === "semantic" ? "warn" : s.class === "additive" ? "success" : "secondary"
                }, {
                  default: M(() => [
                    N(I(s.class), 1)
                  ]),
                  _: 2
                }, 1032, ["severity"])
              ]),
              d("td", null, [
                N(I(s.what) + " ", 1),
                s.detail ? (c(), g("span", sv, " · " + I(s.detail), 1)) : D("", !0),
                s.to ? (c(), g("span", rv, " → " + I(s.to), 1)) : D("", !0),
                s.count ? (c(), g("span", dv, " · " + I(s.count) + " items", 1)) : D("", !0)
              ])
            ]))), 128))
          ])
        ])) : (c(), g("p", uv, "No declaration changes are reported."))
      ], 64))
    ])) : D("", !0);
  }
}), vv = {
  key: 0,
  class: "work-stack",
  "aria-label": "Pack conflicts"
}, mv = { class: "work-stack work-tight work-pack-review-field" }, fv = { class: "work-json-disclosure" }, pv = { class: "work-config-fields" }, bv = { class: "work-json-example" }, hv = { class: "work-json-example" }, yv = {
  key: 1,
  class: "work-stack",
  "aria-label": "Pack state maps"
}, gv = /* @__PURE__ */ ue({
  __name: "PackReview",
  props: {
    plan: {},
    request: {},
    original: {},
    disabled: { type: Boolean }
  },
  emits: ["change"],
  setup(e, { emit: l }) {
    const t = e, a = l;
    function o(i) {
      return t.original.processes?.find((n) => n.id === i)?.name || ye(i);
    }
    function s(i) {
      const [n, ...u] = i.split("."), y = u.join(".");
      return n === "processes" ? o(y) : n === "fields" ? t.original.fields?.find((m) => m.code === y)?.title || ye(y) : n === "item_types" ? t.original.item_types?.find((m) => m.id === y)?.title || ye(y) : ye(n);
    }
    function v(i) {
      return JSON.stringify(i ?? null, null, 2);
    }
    function p(i, n) {
      (t.request.resolutions ??= {})[i] = n, a("change");
    }
    function f(i, n, u) {
      ((t.request.maps ??= {})[i] ??= {})[n] = u, a("change");
    }
    return (i, n) => (c(), g(J, null, [
      e.plan.conflicts.length ? (c(), g("section", vv, [
        n[3] || (n[3] = d("h3", null, "Local edits conflict", -1)),
        n[4] || (n[4] = d("p", { class: "work-muted work-small" }, "Choose which declaration to keep for each conflict, then review again.", -1)),
        (c(!0), g(J, null, te(e.plan.conflicts, (u) => (c(), g("div", {
          key: u.path,
          class: "work-stack work-tight"
        }, [
          d("label", mv, [
            N(I(s(u.path)), 1),
            b(r(le), {
              "model-value": e.request.resolutions?.[u.path],
              "aria-label": "Resolution for " + s(u.path),
              disabled: e.disabled,
              appendTo: "self",
              placeholder: "Choose a resolution",
              optionLabel: "label",
              optionValue: "value",
              options: [{ label: "Keep local edits", value: "local" }, { label: "Use pack changes", value: "incoming" }],
              "onUpdate:modelValue": (y) => p(u.path, y)
            }, null, 8, ["model-value", "aria-label", "disabled", "onUpdate:modelValue"])
          ]),
          d("details", fv, [
            n[2] || (n[2] = d("summary", null, "Compare declarations", -1)),
            d("div", pv, [
              d("section", null, [
                n[0] || (n[0] = d("h4", null, "Local edits", -1)),
                d("pre", bv, I(v(u.local_value)), 1)
              ]),
              d("section", null, [
                n[1] || (n[1] = d("h4", null, "Pack changes", -1)),
                d("pre", hv, I(v(u.incoming)), 1)
              ])
            ])
          ])
        ]))), 128))
      ])) : D("", !0),
      Object.keys(e.plan.maps).length ? (c(), g("section", yv, [
        n[5] || (n[5] = d("h3", null, "Required state maps", -1)),
        n[6] || (n[6] = d("p", { class: "work-muted work-small" }, "Review the proposed destinations for existing items. Each destination is editable.", -1)),
        (c(!0), g(J, null, te(e.plan.maps, (u, y) => (c(), g("div", {
          key: y,
          class: "work-stack"
        }, [
          d("h4", null, I(o(y)), 1),
          (c(!0), g(J, null, te(u, (m, w) => (c(), g("label", {
            key: w,
            class: "work-stack work-tight work-pack-review-field"
          }, [
            N("Move items from " + I(r(he)(e.original.processes?.find((C) => C.id === y)?.states.find((C) => C.id === w))), 1),
            b(r(le), {
              "model-value": e.request.maps?.[y]?.[w],
              "aria-label": "Move items from " + r(he)(e.original.processes?.find((C) => C.id === y)?.states.find((C) => C.id === w)),
              disabled: e.disabled,
              appendTo: "self",
              optionLabel: "label",
              optionValue: "value",
              options: e.plan.declaration.processes?.find((C) => C.id === y)?.states.map((C) => ({ label: r(he)(C), value: C.id })) ?? [],
              "onUpdate:modelValue": (C) => f(y, w, C)
            }, null, 8, ["model-value", "aria-label", "disabled", "options", "onUpdate:modelValue"])
          ]))), 128))
        ]))), 128))
      ])) : D("", !0)
    ], 64));
  }
}), kv = {
  key: 0,
  class: "work-settings-tabs"
}, wv = { class: "work-section-navigation" }, Vv = {
  key: 1,
  class: "kx-err work-alert-actions"
}, $v = { role: "alert" }, xv = {
  key: 2,
  class: "kx-err work-alert-actions"
}, Cv = { role: "alert" }, Sv = {
  key: 3,
  class: "work-notice",
  role: "status"
}, Tv = {
  key: 4,
  class: "kx-loading",
  role: "status"
}, Uv = {
  key: 5,
  class: "work-notice",
  role: "alert"
}, Ev = {
  key: 6,
  class: "work-settings-content work-pane"
}, Dv = {
  key: 0,
  class: "work-notice",
  role: "alert"
}, Iv = {
  key: 1,
  class: "work-notice"
}, Av = { key: 0 }, Pv = ["disabled", "inert"], Rv = {
  key: 6,
  class: "work-settings-card work-stack"
}, Ov = {
  key: 5,
  class: "kx-empty"
}, Nv = {
  key: 6,
  class: "work-muted work-small",
  role: "status"
}, Mv = { class: "work-stack work-tight" }, Fv = {
  key: 0,
  class: "work-muted"
}, Lv = { class: "work-dialog-actions" }, zv = /* @__PURE__ */ ue({
  __name: "BoardSettings",
  props: {
    boardId: {},
    embedded: { type: Boolean }
  },
  emits: ["dirty-change"],
  setup(e, { emit: l }) {
    const t = e, a = l, o = Ho();
    let s, v = "";
    const p = () => JSON.stringify([k.value, U.value, j.value, [...Ve.value]]), f = ["Fields", "Item types", "Process", "Policy", "Relation types", "Plugins", "Review"], i = z("Fields"), n = z(!1), u = z(""), y = z(/* @__PURE__ */ new Set(["Fields"]));
    xe(i, (_) => y.value.add(_));
    const m = z(), w = z(), C = z(), A = z({}), U = z({}), G = z(), F = z(!1), E = z(!0), $ = z(!1), V = z(""), T = z(""), ae = z(""), L = z([]), j = z(), R = z(), ne = z(), x = z(), P = z(), O = z(""), Z = z([]), ce = Y(() => [...Z.value, ...x.value?.refused ?? []]), pe = z(!1), ge = z(0), Ve = z(/* @__PURE__ */ new Set()), De = z(), h = ql(), S = ql(), k = Y(() => ma(A.value, m.value?.declaration ?? {})), q = Y(() => Ve.value.size > 0 || !!j.value || !!m.value && (JSON.stringify(k.value) !== JSON.stringify(m.value.declaration) || Object.keys(U.value).length > 0));
    xe(q, (_) => a("dirty-change", _), { immediate: !0, flush: "sync" });
    const X = Y(() => !!m.value && !!w.value && m.value.generation !== w.value.generation), re = Y(() => F.value && !$.value && !pe.value && !Tt.value && !X.value && !Ve.value.size && x.value && (x.value.changes.length > 0 || Object.keys(U.value).length > 0) && x.value.class !== "refused" && !x.value.refused.length && P.value?.matches(k.value, m.value?.generation ?? -1, U.value)), fe = Y(() => L.value.find((_) => _.id === j.value?.pack)?.plugins.filter((_) => !m.value?.plugins?.some((K) => K.plugin === _.plugin && K.active)).map((_) => ({ use: _.plugin })) ?? []), Se = Y(() => !!ne.value && JSON.stringify(ne.value) === JSON.stringify(j.value)), Ne = Y(() => j.value ? F.value && !$.value && !Ve.value.size && !X.value && !Tt.value && Se.value && x.value?.class !== "refused" && !x.value?.refused.length && R.value?.conflicts.every((_) => !!j.value?.resolutions?.[_.path]) : re.value), Te = Y(() => !!x.value && (!j.value || Se.value)), bt = Y(() => L.value.find((_) => _.id === m.value?.pack?.id)?.title || "Installed pack"), rt = Y(() => !ae.value && !!m.value?.outdated && !!L.value.find((_) => _.id === m.value?.pack?.id)), Sl = Y(() => ae.value ? "Reload packs to check available upgrades." : rt.value ? q.value ? "Discard the current draft before upgrading." : Tt.value ? "Finish the current migration before upgrading." : $.value ? "Wait for the current request to finish." : void 0 : "Install an available version of this pack to upgrade.");
    function He() {
      j.value = void 0, R.value = void 0, ne.value = void 0;
    }
    async function al() {
      if (!m.value?.pack || $.value || q.value) return;
      const _ = L.value.find((K) => K.id === m.value.pack.id);
      _ && (j.value = fa(_, m.value.generation), i.value = "Review", await Tl());
    }
    async function jt() {
      const _ = L.value.find((K) => K.id === u.value);
      !m.value || !_ || _.plugins.some((K) => !K.installed) || $.value || q.value || (j.value = fa(_, m.value.generation), n.value = !1, i.value = "Review", await Tl());
    }
    async function Tl() {
      if (!j.value || $.value || !F.value || X.value || Ve.value.size) return;
      const _ = S(), K = kt(j.value), ee = JSON.stringify(j.value);
      $.value = !0, V.value = "", T.value = "";
      try {
        const ke = await Ao(K, (Et) => wt.packPlan(t.boardId, Et));
        if (!_() || ee !== JSON.stringify(j.value)) return;
        R.value = ke.plan, x.value = ke.plan, j.value = ke.request, ne.value = kt(j.value), O.value = crypto.randomUUID(), i.value = "Review";
      } catch (ke) {
        _() && (ne.value = void 0, V.value = We(ke, "Could not plan the pack upgrade."));
      } finally {
        $.value = !1;
      }
    }
    const so = Y(() => x.value ? Io(x.value, k.value) : []), Tt = Y(() => !!w.value?.migration_error || C.value?.status === "migrating");
    function dt() {
      Z.value = [], S(), x.value = void 0, P.value = void 0, ne.value = void 0, O.value = "";
    }
    xe([k, U], dt, { deep: !0, flush: "sync" }), xe(U, (_) => {
      j.value && (Object.keys(_).length ? j.value.plugin_configs = kt(_) : delete j.value.plugin_configs);
    }, { deep: !0, flush: "sync" });
    function Ut(_, K) {
      K ? Ve.value.delete(_) : Ve.value.add(_), dt();
    }
    function Ul(_) {
      He(), ge.value++, m.value = _, A.value = kt(_.declaration), U.value = {}, Ve.value.clear(), dt();
    }
    async function Ze(_ = !1) {
      const K = h();
      try {
        const [ee, ke, Et] = await Promise.all([xt.schema(t.boardId, void 0, !0).catch((ut) => {
          if (ut instanceof Wl && ut.details?.code === "board_schema_missing") return { generation: 0, declaration: {}, compiled: {}, key_prefix: "", as_of: 0 };
          throw ut;
        }), xt.options(t.boardId), xt.boards()]);
        if (!K()) return;
        if (F.value = ke.access.admin, G.value = ke, C.value = Et.find((ut) => ut.board_id === t.boardId), !F.value) {
          m.value = void 0, A.value = {}, dt();
          return;
        }
        V.value = "";
        const Qe = Po(ee);
        w.value = Qe, s !== void 0 && Qe.generation >= s ? (s = void 0, v === p() && Ul(Qe), v = "") : (_ || !m.value || !q.value && Qe.generation !== m.value.generation) && Ul(Qe), X.value && dt(), await da(K);
      } catch (ee) {
        if (!K()) return;
        ee instanceof Wl && (ee.status === 403 || ee.kind?.toLowerCase() === "permission_denied") && (F.value = !1), dt(), V.value = We(ee, "Could not load board settings.");
      } finally {
        K() && (E.value = !1);
      }
    }
    async function da(_ = () => !0) {
      ae.value = "";
      try {
        const K = await xt.packs();
        _() && (L.value = K.filter(Ro));
      } catch (K) {
        _() && (ae.value = We(K, "Could not load packs."));
      }
    }
    function ro() {
      for (const _ of De.value?.querySelectorAll("input, select, textarea") ?? [])
        if (!(_.form !== De.value || _.closest('[style*="display: none"]')) && !_.reportValidity())
          return !1;
      return !0;
    }
    function uo(_) {
      i.value = _, _ === "Review" && !x.value && El();
    }
    async function El() {
      if (j.value) return Tl();
      if (!m.value || $.value || !F.value || X.value || Ve.value.size || !ro()) return;
      const _ = S(), K = pa(k.value, m.value.generation, U.value);
      $.value = !0, V.value = "", T.value = "";
      try {
        const ee = await wt.plan(t.boardId, K);
        if (!_() || Ve.value.size || !K.matches(k.value, m.value.generation, U.value)) return;
        x.value = ee, P.value = K, O.value = crypto.randomUUID(), i.value = "Review";
      } catch (ee) {
        _() && (dt(), V.value = We(ee, "Could not review changes."), Z.value = Oo(ee, k.value));
      } finally {
        $.value = !1;
      }
    }
    async function co() {
      if (!Ne.value) return;
      if (j.value && ne.value) {
        $.value = !0, V.value = "";
        const K = p();
        try {
          const ee = await wt.packApply(t.boardId, kt(ne.value), O.value);
          s = ee.generation, v = K, await Ze(), T.value = ee.status === "done" ? `Pack applied at generation ${ee.generation}.` : "Pack installation continues in the background.";
        } catch (ee) {
          V.value = We(ee, "Could not apply the pack upgrade.");
        } finally {
          $.value = !1;
        }
        return;
      }
      if (!P.value) return;
      $.value = !0, V.value = "", T.value = "";
      const _ = p();
      try {
        const K = await wt.apply(t.boardId, P.value, O.value);
        s = K.generation, v = _, await Ze(), T.value = `Applied generation ${K.generation} (${K.class}).`;
      } catch (K) {
        V.value = We(K, "Could not apply schema.");
      } finally {
        $.value = !1;
      }
    }
    async function vo() {
      if (!$.value) {
        $.value = !0, V.value = "";
        try {
          const _ = await wt.resume(t.boardId);
          T.value = _.resumed ? "Migration resumes." : "Migration is already running.", await Ze();
        } catch (_) {
          V.value = We(_, "Could not resume migration.");
        } finally {
          $.value = !1;
        }
      }
    }
    async function ol(_, K) {
      if (!m.value || !F.value || $.value || pe.value) return "Wait for the current change to finish.";
      if (X.value) return "Discard the stale draft before removing a definition.";
      const ee = m.value.generation, ke = JSON.stringify(k.value), Et = kt(A.value);
      el(Et, _, K), pe.value = !0;
      try {
        const Qe = await wt.plan(t.boardId, pa(ma(Et, m.value.declaration), ee, U.value));
        if (!F.value || X.value || m.value.generation !== ee || JSON.stringify(k.value) !== ke) return "The draft changes during the check. Try the removal again.";
        const ut = No(Qe, _, K);
        if (ut) return ut;
        if (Qe.class === "refused") return "Resolve the refused draft changes in Review before removing this definition.";
      } catch (Qe) {
        return We(Qe, "Could not check this removal.");
      } finally {
        pe.value = !1;
      }
    }
    async function mo() {
      q.value && !await Lo.confirm({ header: "Discard changes?", message: "Your unsaved board settings will be discarded.", acceptLabel: "Discard", rejectLabel: "Keep editing" }) || o({ name: "board", board: t.boardId });
    }
    function fo() {
      s = void 0, w.value && Ul(w.value), T.value = "", V.value = "";
    }
    xe(() => t.boardId, () => {
      s = void 0, He(), L.value = [], m.value = void 0, w.value = void 0, C.value = void 0, U.value = {}, Ve.value.clear(), y.value = /* @__PURE__ */ new Set(["Fields"]), i.value = "Fields", F.value = !1, E.value = !0, Ze(!0);
    });
    let Dl = () => {
    };
    return xe(() => t.boardId, (_) => {
      Dl(), Dl = Fo(`component.${_}`, () => {
        Ze();
      });
    }, { immediate: !0 }), ko(Ze), Pa(() => {
      Dl(), h(), S();
    }), (_, K) => (c(), g("section", {
      class: pt(["work-settings-shell", { "work-embedded": e.embedded }])
    }, [
      b(Hc, {
        board: C.value,
        embedded: e.embedded,
        generation: m.value?.generation,
        authorized: F.value,
        dirty: q.value,
        busy: $.value,
        "checking-removal": pe.value,
        reviewed: Te.value,
        pack: m.value?.pack,
        "pack-title": bt.value,
        outdated: m.value?.outdated,
        "upgrade-reason": Sl.value,
        "can-upgrade": rt.value && !q.value && !$.value && !Tt.value && F.value,
        onUpgrade: al,
        onInstall: K[0] || (K[0] = (ee) => n.value = !0),
        disabled: !q.value || $.value || pe.value || Tt.value || X.value || !!Ve.value.size || Te.value && !Ne.value,
        onBack: mo,
        onDiscard: fo,
        onPrimary: K[1] || (K[1] = (ee) => Te.value ? co() : El()),
        onSaved: K[2] || (K[2] = (ee) => Ze())
      }, null, 8, ["board", "embedded", "generation", "authorized", "dirty", "busy", "checking-removal", "reviewed", "pack", "pack-title", "outdated", "upgrade-reason", "can-upgrade", "disabled"]),
      F.value && m.value ? (c(), g("div", kv, [
        d("div", wv, [
          b(r(jo), {
            value: i.value,
            "onUpdate:value": K[3] || (K[3] = (ee) => uo(ee))
          }, {
            default: M(() => [
              b(r(qo), { "aria-label": "Settings sections" }, {
                default: M(() => [
                  (c(), g(J, null, te(f, (ee) => b(r(Wo), {
                    key: ee,
                    value: ee
                  }, {
                    default: M(() => [
                      N(I(ee), 1)
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
      ])) : D("", !0),
      V.value ? (c(), g("div", Vv, [
        d("p", $v, I(V.value), 1),
        b(r(H), {
          label: "Retry",
          severity: "secondary",
          onClick: K[4] || (K[4] = (ee) => Ze()),
          outlined: ""
        }, {
          icon: M(() => [
            b(r(Q), {
              icon: "tabler:refresh",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        })
      ])) : D("", !0),
      ae.value ? (c(), g("div", xv, [
        d("p", Cv, I(ae.value), 1),
        b(r(H), {
          label: "Reload packs",
          severity: "secondary",
          outlined: "",
          onClick: K[5] || (K[5] = (ee) => da())
        }, {
          icon: M(() => [
            b(r(Q), {
              icon: "tabler:refresh",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        })
      ])) : D("", !0),
      T.value ? (c(), g("p", Sv, I(T.value), 1)) : D("", !0),
      E.value ? (c(), g("p", Tv, "Loading settings…")) : !F.value && !V.value ? (c(), g("p", Uv, "Board administrator access is required.")) : D("", !0),
      F.value && m.value ? (c(), g("div", Ev, [
        X.value ? (c(), g("div", Dv, "The board advances to generation " + I(w.value?.generation) + " while you edit. Your draft keeps generation " + I(m.value.generation) + ". Discard to load the latest schema before reviewing again.", 1)) : D("", !0),
        Tt.value ? (c(), g("div", Iv, [
          d("p", null, [
            K[18] || (K[18] = N("Migration pending", -1)),
            w.value?.migration_error ? (c(), g("span", Av, ": " + I(w.value.migration_error), 1)) : D("", !0)
          ]),
          b(r(H), {
            label: "Resume migration",
            severity: "secondary",
            disabled: $.value,
            onClick: vo,
            outlined: ""
          }, {
            icon: M(() => [
              b(r(Q), {
                icon: "tabler:refresh",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled"])
        ])) : D("", !0),
        d("form", {
          ref_key: "editor",
          ref: De,
          onSubmit: be(El, ["prevent"])
        }, [
          (c(), g("fieldset", {
            key: ge.value,
            class: "work-settings-fieldset",
            disabled: $.value || pe.value,
            inert: $.value || pe.value || void 0
          }, [
            y.value.has("Fields") ? _e((c(), B(Us, {
              key: 0,
              "board-id": e.boardId,
              "installed-types": G.value?.installed_types,
              draft: A.value,
              "guard-removal": ol,
              issues: ce.value,
              onValidity: K[6] || (K[6] = (ee, ke) => Ut("fields:" + ee, ke))
            }, null, 8, ["board-id", "installed-types", "draft", "issues"])), [
              [ct, i.value === "Fields"]
            ]) : D("", !0),
            y.value.has("Item types") ? _e((c(), B(Gs, {
              key: 1,
              draft: A.value,
              "guard-removal": ol,
              issues: ce.value
            }, null, 8, ["draft", "issues"])), [
              [ct, i.value === "Item types"]
            ]) : D("", !0),
            y.value.has("Process") ? _e((c(), B(pu, {
              key: 2,
              "board-id": e.boardId,
              draft: A.value,
              "guard-removal": ol,
              issues: ce.value,
              onValidity: K[7] || (K[7] = (ee, ke) => Ut("process:" + ee, ke))
            }, null, 8, ["board-id", "draft", "issues"])), [
              [ct, i.value === "Process"]
            ]) : D("", !0),
            y.value.has("Policy") ? _e((c(), B(Nu, {
              key: 3,
              draft: A.value,
              onValidity: K[8] || (K[8] = (ee, ke) => Ut("policy:" + ee, ke))
            }, null, 8, ["draft"])), [
              [ct, i.value === "Policy"]
            ]) : D("", !0),
            y.value.has("Relation types") ? _e((c(), B(Qu, {
              key: 4,
              draft: A.value,
              "guard-removal": ol
            }, null, 8, ["draft"])), [
              [ct, i.value === "Relation types"]
            ]) : D("", !0),
            y.value.has("Plugins") ? _e((c(), B(Da, {
              key: 5,
              "board-id": e.boardId,
              draft: A.value,
              schema: w.value ?? m.value,
              options: G.value?.schema_options.plugins ?? [],
              configs: U.value,
              disabled: $.value,
              onConfigured: K[9] || (K[9] = (ee) => {
                dt(), Ze();
              }),
              onRefresh: K[10] || (K[10] = (ee) => Ze()),
              onValidity: K[11] || (K[11] = (ee, ke) => Ut("plugin:" + ee, ke))
            }, null, 8, ["board-id", "draft", "schema", "options", "configs", "disabled"])), [
              [ct, i.value === "Plugins"]
            ]) : D("", !0),
            y.value.has("Policy") ? _e((c(), g("section", Rv, [
              b($c, {
                "board-id": e.boardId,
                draft: A.value,
                onValidity: K[12] || (K[12] = (ee) => Ut("visibility", ee))
              }, null, 8, ["board-id", "draft"])
            ], 512)), [
              [ct, i.value === "Policy"]
            ]) : D("", !0)
          ], 8, Pv))
        ], 544),
        i.value === "Review" && !j.value ? (c(), B(yu, {
          key: 2,
          draft: A.value,
          original: m.value.declaration,
          disabled: $.value || pe.value
        }, null, 8, ["draft", "original", "disabled"])) : D("", !0),
        i.value === "Review" && j.value && fe.value.length ? (c(), B(Da, {
          key: 3,
          "board-id": e.boardId,
          draft: { plugins: fe.value },
          schema: w.value ?? m.value,
          options: G.value?.schema_options.plugins.filter((ee) => fe.value.some((ke) => ke.use === ee.plugin)) ?? [],
          configs: U.value,
          disabled: $.value,
          "activation-locked": "",
          onValidity: K[13] || (K[13] = (ee, ke) => Ut("pack-plugin:" + ee, ke))
        }, null, 8, ["board-id", "draft", "schema", "options", "configs", "disabled"])) : D("", !0),
        i.value === "Review" ? (c(), B(cv, {
          key: 4,
          declaration: P.value?.declaration,
          plan: x.value,
          generation: m.value.generation,
          follows: so.value,
          "config-count": Object.keys(U.value).length,
          "pack-review": !!R.value
        }, {
          default: M(() => [
            R.value && j.value ? (c(), B(gv, {
              key: 0,
              plan: R.value,
              request: j.value,
              original: m.value.declaration,
              disabled: $.value,
              onChange: K[14] || (K[14] = (ee) => {
                ne.value = void 0, O.value = "";
              })
            }, null, 8, ["plan", "request", "original", "disabled"])) : D("", !0)
          ]),
          _: 1
        }, 8, ["declaration", "plan", "generation", "follows", "config-count", "pack-review"])) : D("", !0),
        i.value === "Review" && !x.value ? (c(), g("p", Ov, "Review your draft to see the changes, their impact and any migration required.")) : D("", !0),
        pe.value ? (c(), g("p", Nv, "Checking existing values and dependencies…")) : D("", !0)
      ])) : D("", !0),
      F.value ? (c(), B(za, {
        key: 7,
        visible: n.value,
        label: "Install pack",
        busy: $.value,
        onClose: K[17] || (K[17] = (ee) => n.value = !1)
      }, {
        default: M(() => [
          d("form", {
            class: "work-dialog-box work-stack",
            onSubmit: be(jt, ["prevent"])
          }, [
            K[20] || (K[20] = d("h2", null, "Install a pack", -1)),
            K[21] || (K[21] = d("p", { class: "work-muted work-small" }, "Packs can be installed on an empty board. Review checks whether this board is eligible.", -1)),
            d("label", Mv, [
              K[19] || (K[19] = N("Pack", -1)),
              b(r(le), {
                modelValue: u.value,
                "onUpdate:modelValue": K[15] || (K[15] = (ee) => u.value = ee),
                "aria-label": "Pack to install",
                appendTo: "self",
                optionLabel: "title",
                optionValue: "id",
                optionDisabled: "disabled",
                options: L.value.map((ee) => ({ ...ee, disabled: ee.plugins.some((ke) => !ke.installed) }))
              }, null, 8, ["modelValue", "options"])
            ]),
            L.value.length ? D("", !0) : (c(), g("p", Fv, "No available packs were found.")),
            d("footer", Lv, [
              b(r(H), {
                label: "Cancel",
                severity: "secondary",
                outlined: "",
                onClick: K[16] || (K[16] = (ee) => n.value = !1)
              }),
              b(r(H), {
                type: "submit",
                label: "Review pack",
                disabled: !u.value || $.value || q.value
              }, null, 8, ["disabled"])
            ])
          ], 32)
        ]),
        _: 1
      }, 8, ["visible", "busy"])) : D("", !0)
    ], 2));
  }
}), Bv = /* @__PURE__ */ ue({
  __name: "SettingsRoot",
  setup(e) {
    const l = wo(), t = Vo();
    return go(ja, (a) => t("navigate", { route: Xo(a) })), (a, o) => (c(), B(zv, {
      "board-id": r(l).boardId ?? "",
      embedded: r(l).embedded,
      onDirtyChange: o[0] || (o[0] = (s) => r(t)("dirty-change", { dirty: s }))
    }, null, 8, ["board-id", "embedded"]));
  }
}), jv = $o(Bv, {
  type: "object",
  properties: {
    "board-id": { type: "string", default: "", description: "Board to administer." },
    embedded: { type: "boolean", default: !1, description: "Fits in a System detail pane." }
  }
});
zo(import.meta.url, jv);
//# sourceMappingURL=settings.js.map
