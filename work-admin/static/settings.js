import { inject as po, defineComponent as ve, ref as j, useSlots as bo, openBlock as c, createElementBlock as g, createElementVNode as d, normalizeClass as pt, unref as r, renderSlot as We, createCommentVNode as T, createVNode as b, withCtx as L, toDisplayString as U, createBlock as W, withDirectives as Qe, vShow as ct, computed as X, watch as Ce, onMounted as kl, onUnmounted as Pa, resolveComponent as Ra, Fragment as Q, renderList as oe, createTextVNode as O, resolveDynamicComponent as zl, onBeforeUnmount as nt, useId as Xl, withKeys as Ae, withModifiers as he, normalizeStyle as ho, watchEffect as Oa, nextTick as ra, provide as yo } from "vue";
import { e as lt, u as go, b as ko, c as wo, a as Vo } from "./mount-3Ymcko7U.js";
import "pinia";
import { Icon as ee } from "@iconify/vue";
import ie from "primevue/select";
import { m as Bl, e as da, s as ye, f as $o, t as je, p as Ut, d as Jl, g as Dt, r as ua, w as xt, l as jl, h as Ke, i as _e, b as ot, u as Na, j as Ma, k as Zl, n as Fa, o as Ve, q as wl, v as _t, x as xo, y as La, z as Co, A as $t, B as So, _ as za, C as To, D as Eo, E as ca, F as kt, G as Uo, H as va, I as Do, J as ma, K as Io, L as fa, M as Ao, a as Po, N as pa, O as Ro, P as Oo } from "./latestRequest-C7gISMH8.js";
import J from "primevue/button";
import { api as No, on as Mo, host as Fo, define as Lo } from "@wippy-fe/proxy";
import Re from "primevue/tag";
import Le from "primevue/toggleswitch";
import Mt from "primevue/checkbox";
import ce from "primevue/inputtext";
import ml from "primevue/textarea";
import Ge from "primevue/inputnumber";
import zo from "primevue/chip";
import Ql from "primevue/selectbutton";
import Bo from "primevue/tabs";
import jo from "primevue/tablist";
import qo from "primevue/tab";
import Wo from "primevue/message";
const Dl = (e, l) => e.x > l.x && e.x < l.x + l.width && e.y > l.y && e.y < l.y + l.height;
function Ko(e, l, t) {
  return e.x === l.x ? e.x > t.x && e.x < t.x + t.width && Math.max(e.y, l.y) > t.y && Math.min(e.y, l.y) < t.y + t.height : e.y > t.y && e.y < t.y + t.height && Math.max(e.x, l.x) > t.x && Math.min(e.x, l.x) < t.x + t.width;
}
function ht(e, l, t) {
  const a = [.../* @__PURE__ */ new Set([e.x, l.x, ...t.flatMap((I) => [I.x, I.x + I.width])])].sort((I, B) => I - B), o = [.../* @__PURE__ */ new Set([e.y, l.y, ...t.flatMap((I) => [I.y, I.y + I.height])])].sort((I, B) => I - B);
  a.unshift(a[0] - 24), a.push(a.at(-1) + 24), o.unshift(o[0] - 24), o.push(o.at(-1) + 24);
  const s = a.length, v = o.indexOf(l.y) * s + a.indexOf(l.x), f = o.indexOf(e.y) * s + a.indexOf(e.x), m = (I) => ({ x: a[I % s], y: o[Math.floor(I / s)] }), i = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map(), u = [];
  function y(I) {
    u.push(I);
    let B = u.length - 1;
    for (; B; ) {
      const M = B - 1 >> 1;
      if (u[M].priority <= I.priority) break;
      u[B] = u[M], B = M;
    }
    u[B] = I;
  }
  function p() {
    const I = u[0], B = u.pop();
    if (u.length) {
      let M = 0;
      for (; M * 2 + 1 < u.length; ) {
        let R = M * 2 + 1;
        if (R + 1 < u.length && u[R + 1].priority < u[R].priority && R++, B.priority <= u[R].priority) break;
        u[M] = u[R], M = R;
      }
      u[M] = B;
    }
    return I;
  }
  const w = (I) => Math.abs(I.x - l.x) + Math.abs(I.y - l.y);
  for (const I of [0, 1]) {
    const B = f * 2 + I;
    i.set(B, 0), y({ key: B, cost: 0, priority: w(e) });
  }
  const x = /* @__PURE__ */ new Map(), E = /* @__PURE__ */ new Map();
  for (; u.length; ) {
    const I = p(), B = Math.floor(I.key / 2), M = I.key % 2;
    if (I.cost !== i.get(I.key)) continue;
    if (B === v) {
      const N = [];
      let ae = I.key;
      for (; ae !== void 0; )
        N.push(m(Math.floor(ae / 2))), ae = n.get(ae);
      return Ba(N.reverse());
    }
    const R = m(B), S = B % s, q = Math.floor(B / s);
    for (const [N, ae] of [[S > 0 ? B - 1 : -1, 0], [S + 1 < s ? B + 1 : -1, 0], [q > 0 ? B - s : -1, 1], [q + 1 < o.length ? B + s : -1, 1]]) {
      if (N < 0) continue;
      const ne = m(N);
      if (x.has(N) || x.set(N, !t.some((V) => Dl(ne, V))), !x.get(N)) continue;
      const G = `${Math.min(B, N)}:${Math.max(B, N)}`;
      if (E.has(G) || E.set(G, !t.some((V) => Ko(R, ne, V))), !E.get(G)) continue;
      const A = I.cost + Math.abs(R.x - ne.x) + Math.abs(R.y - ne.y) + (M === ae ? 0 : 18), P = N * 2 + ae;
      A >= (i.get(P) ?? 1 / 0) || (i.set(P, A), n.set(P, I.key), y({ key: P, cost: A, priority: A + w(ne) }));
    }
  }
  throw new Error("Process map has no collision-free route between its ports: " + JSON.stringify({ start: e, end: l, startInside: t.filter((I) => Dl(e, I)), endInside: t.filter((I) => Dl(l, I)) }));
}
function Ba(e) {
  const l = [];
  for (const t of e) {
    const a = l.at(-1), o = l.at(-2);
    a && a.x === t.x && a.y === t.y || (o && a && (o.x === a.x && a.x === t.x || o.y === a.y && a.y === t.y) && l.pop(), l.push(t));
  }
  return l;
}
const jt = (e) => Array.from(e).reduce((l, t) => l + (/[^\x20-\x7e]/u.test(t) ? 16 : /[MW@%]/.test(t) ? 11 : /[ilI.,:;!| ']/.test(t) ? 4 : 7.5), 0);
function Ot(e, l = 28) {
  const t = [];
  let a = "";
  for (const o of e.split(/\s+/u))
    for (let s = 0; s < o.length; s += l) {
      const v = o.slice(s, s + l);
      a && a.length + v.length + 1 > l && (t.push(a), a = ""), a = a ? a + " " + v : v;
    }
  return [...t, a].filter(Boolean);
}
function ol(e) {
  if (e = Ba(e), !e.length) return "";
  let l = `M ${e[0].x} ${e[0].y}`;
  for (let a = 1; a < e.length - 1; a++) {
    const o = e[a - 1], s = e[a], v = e[a + 1], f = Math.hypot(s.x - o.x, s.y - o.y), m = Math.hypot(v.x - s.x, v.y - s.y), i = Math.min(8, f / 3, m / 3);
    i && (l += ` L ${s.x + (o.x - s.x) * i / f} ${s.y + (o.y - s.y) * i / f} Q ${s.x} ${s.y} ${s.x + (v.x - s.x) * i / m} ${s.y + (v.y - s.y) * i / m}`);
  }
  const t = e.at(-1);
  return l + ` L ${t.x} ${t.y}`;
}
function Go(e, l = {}, t = { width: 1400, height: 480 }) {
  const a = t.width < 750 || Bl(e).length > 8 ? "TB" : "LR", o = new da.graphlib.Graph({ multigraph: !0 });
  o.setGraph({ rankdir: a, ranker: "network-simplex", acyclicer: "greedy", nodesep: 32, edgesep: 32, ranksep: 24, marginx: 32, marginy: 32 }), o.setDefaultEdgeLabel(() => ({}));
  const s = Bl(e), v = new Map(s.map((h, $) => [h.id, $])), f = e.states.map((h) => {
    const $ = (e.transitions ?? []).filter((Ee) => Ee.from === "any" && Ee.to === h.id), k = Ot(ye(h)), K = Ot($o(h, e)), Z = $.flatMap((Ee) => Ot(je(Ee) + " works from any state")), de = l.policy?.wip?.[h.id]?.limit, be = de === void 0 ? 0 : jt(" · limit " + de), Te = Math.max(168, ...k.map((Ee) => jt(Ee) + 58), ...K.map((Ee, bt) => jt(Ee) + 32 + (bt === K.length - 1 ? be : 0)), ...Z.map((Ee) => jt(Ee) + 32)), Ne = Math.max(80, 42 + k.length * 18 + K.length * 16 + Z.length * 18);
    return o.setNode(h.id, { width: Te + (a === "LR" ? 36 : 0), height: Ne + (a === "TB" ? 36 : 0) }), { state: h, x: 0, y: 0, width: Te, height: Ne, title: k, caption: K, badges: $, row: v.has(h.id) ? 0 : 1 };
  }), m = new Set(f.map((h) => h.state.id)), i = (e.transitions ?? []).flatMap((h) => h.from === "any" ? [] : h.from.filter(($) => m.has($) && m.has(h.to)).map(($) => {
    const k = `${h.id}-${$}`, K = Ot(je(h)), Z = Math.max(72, ...K.map((be) => jt(be) + 24)), de = Math.max(24, K.length * 16 + 10);
    return { transition: h, from: $, key: k, lines: K, width: Z, height: de };
  })), n = /* @__PURE__ */ new Set(), u = /* @__PURE__ */ new Set(), y = new Set(i.filter((h) => h.from === h.transition.to || h.transition.to === e.initial || ["completed", "canceled"].includes(f.find(($) => $.state.id === h.from).state.category)).map((h) => h.key));
  function p(h) {
    if (!u.has(h)) {
      n.add(h);
      for (const $ of i.filter((k) => k.from === h))
        y.has($.key) || (n.has($.transition.to) ? y.add($.key) : p($.transition.to));
      n.delete(h), u.add(h);
    }
  }
  p(e.initial);
  for (const h of f) p(h.state.id);
  for (const h of i) if (!y.has(h.key)) {
    const $ = v.get(h.from), k = v.get(h.transition.to);
    o.setEdge(h.from, h.transition.to, { width: h.width, height: h.height, labelpos: "c", weight: $ !== void 0 && k === $ + 1 ? 100 : 1 }, h.key);
  }
  for (const h of e.transitions ?? []) if (h.from === "any" && m.has(e.initial) && m.has(h.to) && !v.has(h.to)) {
    const $ = e.states.find((k) => k.id === h.to);
    o.setEdge(e.initial, h.to, { minlen: ["completed", "canceled"].includes($.category) ? Math.max(1, s.length - 1) : 1 }, `any:${h.id}`);
  }
  const w = e.states.flatMap((h) => (h.regions ?? []).filter(($) => m.has($.initial)).map(($, k) => {
    const K = `lane:${h.id}:${k}`;
    return o.setEdge(h.id, $.initial, {}, K), { state: h, region: $, key: K };
  }));
  if (!f.length) return { nodes: f, edges: [], parallels: [], main: s, direction: a, width: 320, height: 160 };
  da.layout(o);
  for (const h of f) Object.assign(h, { x: o.node(h.state.id).x, y: o.node(h.state.id).y });
  const x = a === "TB", E = i.filter((h) => !y.has(h.key)).map((h) => o.edge({ v: h.from, w: h.transition.to, name: h.key })), I = [...f, ...E], B = Math.max(...I.map((h) => h.x + h.width / 2)), M = Math.max(...I.map((h) => h.y + h.height / 2)), R = (h) => f.find(($) => $.state.id === h), S = i.filter((h) => y.has(h.key)).sort((h, $) => {
    const k = x ? "y" : "x";
    return Math.abs(R(h.from)[k] - R(h.transition.to)[k]) - Math.abs(R($.from)[k] - R($.transition.to)[k]);
  }), q = /* @__PURE__ */ new Map(), N = Math.max(0, ...S.map((h) => h.width));
  let ae = M + 32;
  for (const [h, $] of S.entries()) {
    const k = R($.from), K = R($.transition.to), Z = x ? B + 16 + N + 28 + h * 18 : ae + $.height / 2, de = x ? B + 16 + N / 2 : (k.x + K.x) / 2;
    let be = x ? k.y + k.height / 2 + 18 : Z;
    if (x) for (const Te of [...q.values()].sort((Ne, Ee) => Ne.y - Ee.y))
      be + $.height / 2 + 10 > Te.y - Te.height / 2 - 10 && be - $.height / 2 - 10 < Te.y + Te.height / 2 + 10 && (be = Te.y + Te.height / 2 + 24 + $.height / 2);
    q.set($.key, { x: de, y: be, corridor: Z, height: $.height }), ae = Z + $.height / 2 + 24;
  }
  const ne = i.map((h) => ({ ...h, ...q.get(h.key) ?? o.edge({ v: h.from, w: h.transition.to, name: h.key }) })), G = (h, $) => ({ x: h.x - h.width / 2 - $, y: h.y - h.height / 2 - $, width: h.width + $ * 2, height: h.height + $ * 2 }), A = [...f.map((h) => G(h, 12)), ...ne.map((h) => G(h, 10))], P = (h, $) => ({
    start: x ? { x: h.x, y: h.y + h.height / 2 } : { x: h.x + h.width / 2, y: h.y },
    end: x ? { x: $.x, y: $.y - $.height / 2 } : { x: $.x - $.width / 2, y: $.y }
  }), V = (h, $) => x ? { x: h.x, y: h.y + $ } : { x: h.x + $, y: h.y }, D = ne.map((h) => {
    const $ = f.find((Ye) => Ye.state.id === h.from), k = f.find((Ye) => Ye.state.id === h.transition.to), { start: K, end: Z } = P($, k), de = y.has(h.key), be = V(K, 18), Te = V(Z, -18), Ne = (de || !x ? h.width : h.height) / 2 + 10, Ee = de ? { x: h.x + (x ? -Ne : Ne), y: h.y } : V(h, -Ne), bt = de ? { x: h.x + (x ? Ne : -Ne), y: h.y } : V(h, Ne);
    let rt;
    if (de) {
      const { corridor: Ye } = q.get(h.key), ll = x ? { x: Ye, y: h.y } : { x: be.x, y: Ye }, Bt = x ? { x: Ye, y: Te.y } : { x: Te.x, y: Ye };
      rt = x ? [
        [K, ...ht(be, Ee, A)],
        [bt, ll, Bt, ...ht(Bt, Te, A), Z]
      ] : [
        [K, ...ht(be, ll, A), Ee],
        [bt, ...ht(Bt, Te, A), Z]
      ];
    } else rt = [
      [K, ...ht(be, Ee, A)],
      [...ht(bt, Te, A), Z]
    ];
    const Cl = de ? "return" : v.get(h.transition.to) === (v.get(h.from) ?? -2) + 1 ? "main" : "forward";
    return { ...h, points: rt.flat(), segments: rt, path: rt.map(ol).join(" "), type: Cl, targetOffset: 0 };
  }), z = w.map((h) => {
    const $ = f.find((be) => be.state.id === h.state.id), k = f.find((be) => be.state.id === h.region.initial), { start: K, end: Z } = P($, k), de = [K, ...ht(V(K, 18), V(Z, -18), A), Z];
    return { state: h.state, key: h.key, points: de, path: ol(de) };
  }), C = [...f.flatMap((h) => [{ x: h.x - h.width / 2, y: h.y - h.height / 2 }, { x: h.x + h.width / 2, y: h.y + h.height / 2 }]), ...D.flatMap((h) => [...h.points, { x: h.x - h.width / 2, y: h.y - h.height / 2 }, { x: h.x + h.width / 2, y: h.y + h.height / 2 }]), ...z.flatMap((h) => h.points)], F = 32 - Math.min(...C.map((h) => h.x)), _ = 32 - Math.min(...C.map((h) => h.y)), ke = Math.max(...C.map((h) => h.x)) + F + 32, pe = Math.max(...C.map((h) => h.y)) + _ + 32, ge = (h) => ({ x: h.x + F, y: h.y + _ });
  for (const h of f) Object.assign(h, ge(h));
  for (const h of D)
    Object.assign(h, ge(h)), h.segments = h.segments.map(($) => $.map(ge)), h.points = h.segments.flat(), h.path = h.segments.map(ol).join(" ");
  for (const h of z)
    h.points = h.points.map(ge), h.path = ol(h.points);
  return { nodes: f, edges: D, parallels: z, main: s, direction: a, width: ke, height: pe };
}
const ja = Symbol("work-navigation");
function Yo() {
  return po(ja, () => {
  });
}
function Ho(e) {
  if (e.name === "boards") return "";
  const l = encodeURIComponent(e.board);
  return e.name === "settings" ? `${l}/settings` : l;
}
const It = (e) => `/api/v1/work/boards/${encodeURIComponent(e)}`, ba = (e) => ({ declaration: e.declaration, expected_generation: e.expected_generation, plugin_configs: e.plugin_configs }), wt = {
  packPlan: (e, l) => Ut(`${It(e)}/pack_plan`, l, "Pack plan"),
  packApply: (e, l, t) => Ut(`${It(e)}/pack_apply`, { ...l, key: t }, "Apply pack"),
  plan: (e, l) => Ut(`${It(e)}/plan_schema`, ba(l), "Schema plan"),
  apply: (e, l, t) => Ut(`${It(e)}/apply_schema`, { ...ba(l), key: t }, "Apply schema"),
  resume: (e) => Ut(`${It(e)}/resume_migration`, {}, "Resume migration"),
  configure: (e, l, t) => Ut(`${It(e)}/configure_plugin`, { plugin: l, config: t }, "Configure plugin")
}, Xo = { class: "work-definition" }, Jo = {
  key: 0,
  class: "work-definition-handle"
}, Zo = ["title"], Qo = { class: "work-definition-details" }, _o = { class: "work-definition-code" }, ei = ["title"], ti = { class: "work-definition-kind" }, li = { class: "work-definition-flags" }, ai = { class: "work-definition-usage" }, oi = { class: "work-definition-actions" }, ii = {
  key: 1,
  class: "work-definition-description"
}, ni = { class: "work-definition-body work-stack" }, Vl = /* @__PURE__ */ ve({
  __name: "DefinitionRow",
  props: {
    title: {},
    code: {},
    kind: {},
    description: {}
  },
  setup(e) {
    const l = j(!1), t = bo();
    return (a, o) => (c(), g("article", Xo, [
      d("header", {
        class: pt(["work-definition-head", { "work-definition-has-handle": r(t).handle }])
      }, [
        r(t).handle ? (c(), g("div", Jo, [
          We(a.$slots, "handle")
        ])) : T("", !0),
        b(Jl, {
          class: "work-definition-toggle",
          "aria-expanded": l.value,
          onActivate: o[0] || (o[0] = (s) => l.value = !l.value)
        }, {
          default: L(() => [
            b(r(ee), {
              icon: l.value ? "tabler:chevron-down" : "tabler:chevron-right",
              "aria-hidden": "true"
            }, null, 8, ["icon"]),
            d("span", {
              class: "work-row-title",
              title: e.title
            }, U(e.title), 9, Zo)
          ]),
          _: 1
        }, 8, ["aria-expanded"]),
        d("div", Qo, [
          d("span", _o, [
            e.code ? (c(), g("code", {
              key: 0,
              class: "work-mono",
              title: e.code
            }, U(e.code), 9, ei)) : T("", !0)
          ]),
          d("span", ti, [
            e.kind ? (c(), W(r(Re), {
              key: 0,
              severity: "secondary",
              value: e.kind
            }, null, 8, ["value"])) : T("", !0)
          ]),
          d("span", li, [
            We(a.$slots, "flags")
          ]),
          d("div", ai, [
            We(a.$slots, "usage")
          ])
        ]),
        d("div", oi, [
          We(a.$slots, "actions")
        ]),
        e.description ? (c(), g("p", ii, U(e.description), 1)) : T("", !0)
      ], 2),
      Qe(d("div", ni, [
        We(a.$slots, "default")
      ], 512), [
        [ct, l.value]
      ])
    ]));
  }
}), si = { class: "work-definition-scroll" }, ri = {
  key: 0,
  class: "work-definition-columns",
  "aria-hidden": "true"
}, di = { key: 0 }, ui = { key: 1 }, ci = {
  key: 2,
  class: "work-definition-usage"
}, $l = /* @__PURE__ */ ve({
  __name: "DefinitionList",
  props: {
    count: {},
    columns: {}
  },
  setup(e) {
    return (l, t) => (c(), g("div", si, [
      d("div", {
        class: pt(["work-field-builder", "work-definitions-" + e.columns])
      }, [
        e.count > 3 ? (c(), g("div", ri, [
          t[0] || (t[0] = d("span", null, null, -1)),
          t[1] || (t[1] = d("span", null, "Name", -1)),
          e.columns !== "plugins" ? (c(), g("span", di, "Identifier")) : T("", !0),
          d("span", null, U(e.columns === "plugins" ? "State" : e.columns === "types" ? "Process" : "Kind"), 1),
          e.columns === "fields" || e.columns === "plugins" ? (c(), g("span", ui, "Details")) : T("", !0),
          e.columns !== "plugins" ? (c(), g("span", ci, U(e.columns === "fields" ? "Used by" : "Details"), 1)) : T("", !0),
          t[2] || (t[2] = d("span", null, null, -1))
        ])) : T("", !0),
        We(l.$slots, "default")
      ], 2)
    ]));
  }
}), vi = [
  { code: "key", form: "text", index: "key" },
  { code: "type", form: "text", index: "key" },
  { code: "state", form: "text", index: "key" },
  { code: "category", form: "text", index: "key" },
  { code: "rank", form: "text", index: "key" },
  { code: "parent", form: "text", index: "key" },
  { code: "created_at", form: "time", index: "key" },
  { code: "updated_at", form: "time", index: "key" }
];
function mi(e) {
  const l = e.compiled.processes?.flatMap((t) => t.states.map((a) => ({ id: a.id, label: a.name }))) ?? [];
  return [...vi.filter((t) => t.code !== "rank").map((t) => t.code === "state" ? { ...t, type: "option", options: l } : t.code === "category" ? { ...t, type: "option", options: ["triage", "backlog", "unstarted", "started", "completed", "canceled"].map((a) => ({ id: a })) } : t), ...(e.compiled.fields ?? []).filter((t) => t.index && t.index !== "none")];
}
function fi(e) {
  if (e?.cardinality && e.cardinality !== "one") return ["has", "in", "nin", "is_null", ...e.type === "principal" ? ["member_of"] : []];
  const l = ["eq", "neq", "in", "nin", "is_null", ...e?.type === "principal" ? ["member_of"] : []];
  return e && (["int", "number", "dec", "time", "quantity"].includes(e.form ?? "") || e.index === "number") && l.push("lt", "lte", "gt", "gte", "between"), e?.form === "text" && e.type !== "option" && l.push("contains", "starts_with"), l;
}
const pi = { class: "work-field-control" }, bi = ["id"], hi = {
  key: 1,
  class: "work-stack work-tight"
}, yi = { class: "work-chips" }, gi = {
  key: 5,
  class: "work-row"
}, ki = ["inert"], wi = ["value"], Vi = {
  key: 1,
  class: "work-muted"
}, $i = ["inert"], xi = ["value"], Ci = {
  key: 1,
  class: "work-muted"
}, Si = {
  key: 11,
  class: "work-stack work-tight"
}, Ti = {
  class: "work-stack work-tight",
  "aria-label": "Matching items"
}, Ei = { class: "work-mono" }, Ui = {
  key: 15,
  class: "work-error work-small",
  role: "alert"
}, qa = /* @__PURE__ */ ve({
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
    const t = e, a = l, o = X(() => t.inputId ?? `field-${t.field.code}`), s = X(() => !!t.field.cardinality && t.field.cardinality !== "one"), v = X(() => Array.isArray(t.modelValue) ? t.modelValue : []), f = X(() => t.modelValue == null ? "" : typeof t.modelValue == "object" ? Dt(t.modelValue) : String(t.modelValue)), m = X(() => {
      const $ = t.modelValue;
      return $ && typeof $ == "object" && "ref" in $ && Array.isArray($.ref) ? String($.ref[1] ?? "") : "";
    }), i = X(() => t.disabled || ua(t.field)), n = j(!1), u = j(!1), y = j(!1), p = j(""), w = j(""), x = j([]), E = jl(), I = j([]);
    let B = 0, M;
    const R = /* @__PURE__ */ new Set();
    Ce(v, ($) => {
      I.value = M ?? $.map((k, K) => I.value[K] ?? B++), M = void 0;
    }, { immediate: !0 });
    function S($) {
      a("update:modelValue", $);
    }
    function q($, k) {
      const K = [...v.value];
      K[$] = k, S(K);
    }
    function N($, k) {
      k ? R.delete($) : R.add($), a("validity", !R.size);
    }
    function ae($) {
      R.delete(I.value[$]), a("validity", !R.size), M = I.value.filter((k, K) => K !== $), S(v.value.filter((k, K) => K !== $));
    }
    function ne() {
      M = [...I.value, B++], S([...v.value, t.field.form === "bool" ? !1 : t.field.form === "record" ? {} : ""]);
    }
    function G($) {
      const k = $.detail, K = k?.principal_id ?? k?.id;
      S(K ? { kind: k.type ?? "user", id: K } : void 0);
    }
    function A($) {
      const k = $.detail;
      S(k?.thread_id ? { ref: ["component", k.thread_id] } : void 0);
    }
    const P = j("");
    let V = "";
    Ce(() => t.modelValue, ($) => {
      const k = JSON.stringify($ ?? {}, null, 2);
      k !== V && (V = k, P.value = k, p.value = "", a("validity", !0));
    }, { immediate: !0 });
    function D($) {
      P.value = $;
      try {
        const k = JSON.parse($);
        if (!k || typeof k != "object" || Array.isArray(k)) throw new Error("Enter a JSON object.");
        if (t.field.type === "rich_text" && !("type" in k && typeof k.type == "string")) throw new Error("The document needs a type.");
        V = JSON.stringify(k, null, 2), p.value = "", a("validity", !0), S(k);
      } catch (k) {
        p.value = k instanceof Error ? k.message : "Invalid JSON.", a("validity", !1);
      }
    }
    function z($) {
      if (!$) {
        a("validity", !0), S(void 0);
        return;
      }
      const k = Number.isFinite(Number($)) && (t.field.form !== "int" || Number.isSafeInteger(Number($)));
      a("validity", k), k && S(t.field.form === "int" ? Number($) : $);
    }
    const C = X(() => t.field.config?.format === "date");
    function F($) {
      S($ ? C.value ? $ : new Date($).toISOString() : void 0);
    }
    const _ = X(() => {
      if (typeof t.modelValue != "string") return "";
      if (C.value) return t.modelValue.slice(0, 10);
      const $ = new Date(t.modelValue);
      return Number.isNaN($.getTime()) ? "" : new Date($.getTime() - $.getTimezoneOffset() * 6e4).toISOString().slice(0, 16);
    });
    function ke($) {
      S($.detail?.ref);
    }
    function pe($) {
      S($.detail?.value);
    }
    let ge;
    Ce(w, () => {
      const $ = E();
      if (clearTimeout(ge), !w.value.trim()) {
        x.value = [];
        return;
      }
      ge = setTimeout(async () => {
        try {
          const k = w.value.trim(), K = /^[A-Z][A-Z0-9]{1,9}-[0-9]+$/.test(k) ? [(await xt.item(t.boardId, { key: k })).item] : (await xt.query(t.boardId, { where: { field: "title", op: "contains", value: k }, limit: 8 })).items;
          $() && (x.value = K, p.value = "");
        } catch (k) {
          $() && (p.value = k instanceof Error ? k.message : "Could not search items.");
        }
      }, 200);
    });
    function h($) {
      S({ board: t.boardId, item: $.id }), w.value = "", x.value = [];
    }
    kl(async () => {
      t.field.type === "principal" ? n.value = await lt("wc-principal-picker") : t.field.config?.target === "component" && (n.value = await lt("wc-component-picker"));
    });
    for (const [$, k] of [[() => t.editorTag, y], [() => t.linkTag, u]])
      Ce($, async (K, Z, de) => {
        let be = !0;
        if (de(() => {
          be = !1;
        }), k.value = !1, K) {
          const Te = await lt(K);
          be && (k.value = Te);
        }
      }, { immediate: !0 });
    return Pa(() => {
      clearTimeout(ge), E();
    }), ($, k) => {
      const K = Ra("FieldControl", !0);
      return c(), g("div", pi, [
        r(ua)(e.field) ? (c(), g("output", {
          key: 0,
          id: o.value,
          class: "work-read-value"
        }, U(r(Dt)(e.modelValue, e.field)), 9, bi)) : s.value ? (c(), g("div", hi, [
          d("div", yi, [
            (c(!0), g(Q, null, oe(v.value, (Z, de) => (c(), W(r(Re), {
              key: I.value[de],
              class: "kx-tag-sm",
              severity: "secondary"
            }, {
              default: L(() => [
                O(U(r(Dt)(Z, e.field)) + " ", 1),
                b(r(J), {
                  type: "button",
                  class: "work-icon-button",
                  disabled: i.value,
                  "aria-label": "Remove value " + (de + 1),
                  onClick: (be) => ae(de),
                  severity: "secondary",
                  text: "",
                  size: "small"
                }, {
                  default: L(() => [
                    b(r(ee), {
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
          (c(!0), g(Q, null, oe(v.value, (Z, de) => (c(), g("div", {
            key: I.value[de],
            class: "work-stack work-tight"
          }, [
            b(K, {
              "board-id": e.boardId,
              field: { ...e.field, cardinality: "one" },
              "model-value": Z,
              "input-id": o.value + "-" + I.value[de],
              disabled: i.value,
              "editor-tag": e.editorTag,
              "link-tag": e.linkTag,
              "onUpdate:modelValue": (be) => q(de, be),
              onValidity: (be) => N(I.value[de], be)
            }, null, 8, ["board-id", "field", "model-value", "input-id", "disabled", "editor-tag", "link-tag", "onUpdate:modelValue", "onValidity"])
          ]))), 128)),
          b(r(J), {
            label: "Add value",
            severity: "secondary",
            size: "small",
            disabled: i.value,
            onClick: ne,
            outlined: ""
          }, {
            icon: L(() => [
              b(r(ee), {
                icon: "tabler:plus",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled"])
        ])) : e.editorTag && y.value ? (c(), W(zl(e.editorTag), {
          key: 2,
          "board-id": e.boardId,
          value: JSON.stringify(e.modelValue ?? null),
          config: JSON.stringify(e.field.config ?? {}),
          readonly: i.value || void 0,
          onChange: pe
        }, null, 40, ["board-id", "value", "config", "readonly"])) : e.linkTag && u.value ? (c(), W(zl(e.linkTag), {
          key: 3,
          "board-id": e.boardId,
          kind: e.field.config?.target ?? e.field.type,
          value: JSON.stringify(e.modelValue ?? null),
          readonly: i.value || void 0,
          onChange: ke
        }, null, 40, ["board-id", "kind", "value", "readonly"])) : e.field.type === "option" ? (c(), W(r(ie), {
          key: 4,
          placeholder: "Not set",
          inputId: o.value,
          "model-value": e.modelValue ?? "",
          disabled: i.value,
          "onUpdate:modelValue": k[0] || (k[0] = (Z) => S(Z || void 0)),
          appendTo: "self",
          optionLabel: "label",
          optionValue: "value",
          optionDisabled: "disabled",
          options: [{ label: "Not set", value: "", disabled: !1 }, ...(e.field.options ?? []).map((Z) => ({ label: Z.label ?? Z.id, value: Z.id, disabled: !1 }))]
        }, null, 8, ["inputId", "model-value", "disabled", "options"])) : e.field.form === "bool" ? (c(), g("label", gi, [
          b(r(Mt), {
            inputId: o.value,
            "model-value": e.modelValue === !0,
            disabled: i.value,
            "onUpdate:modelValue": k[1] || (k[1] = (Z) => S(Z)),
            binary: ""
          }, null, 8, ["inputId", "model-value", "disabled"]),
          O(U(e.modelValue === !0 ? "Yes" : e.modelValue === !1 ? "No" : "Not set"), 1)
        ])) : e.field.form === "int" ? (c(), W(r(Ge), {
          key: 6,
          inputId: o.value,
          "model-value": f.value === "" ? null : Number(f.value),
          disabled: i.value,
          "onUpdate:modelValue": k[2] || (k[2] = (Z) => z(Z == null ? "" : String(Z))),
          useGrouping: !1
        }, null, 8, ["inputId", "model-value", "disabled"])) : e.field.form === "dec" ? (c(), W(r(ce), {
          key: 7,
          id: o.value,
          inputmode: "decimal",
          "model-value": f.value,
          disabled: i.value,
          "onUpdate:modelValue": k[3] || (k[3] = (Z) => z(Z ?? ""))
        }, null, 8, ["id", "model-value", "disabled"])) : e.field.form === "time" ? (c(), W(r(ce), {
          key: 8,
          id: o.value,
          type: C.value ? "date" : "datetime-local",
          value: _.value,
          disabled: i.value,
          onInput: k[4] || (k[4] = (Z) => F(Z.target.value))
        }, null, 8, ["id", "type", "value", "disabled"])) : e.field.type === "principal" ? (c(), g("div", {
          key: 9,
          inert: i.value || void 0,
          class: "work-stack work-tight"
        }, [
          n.value ? (c(), g("wc-principal-picker", {
            key: 0,
            value: JSON.stringify(e.modelValue ?? {}),
            kinds: "user,group",
            onConfigChanged: G
          }, null, 40, wi)) : (c(), g("span", Vi, U(r(Dt)(e.modelValue, e.field)) + " · Person picker is unavailable.", 1))
        ], 8, ki)) : e.field.config?.target === "component" ? (c(), g("div", {
          key: 10,
          inert: i.value || void 0
        }, [
          n.value ? (c(), g("wc-component-picker", {
            key: 0,
            value: JSON.stringify({ thread_id: m.value }),
            onChange: A
          }, null, 40, xi)) : (c(), g("span", Ci, "Component picker is unavailable."))
        ], 8, $i)) : e.field.type === "item" ? (c(), g("div", Si, [
          b(r(Re), {
            class: "kx-tag-sm",
            severity: "secondary"
          }, {
            default: L(() => [
              O(U(r(Dt)(e.modelValue, e.field)), 1)
            ]),
            _: 1
          }),
          b(r(ce), {
            id: o.value,
            modelValue: w.value,
            "onUpdate:modelValue": k[5] || (k[5] = (Z) => w.value = Z),
            disabled: i.value,
            placeholder: "Search a title or enter an item key",
            "aria-label": "Search items"
          }, null, 8, ["id", "modelValue", "disabled"]),
          d("div", Ti, [
            (c(!0), g(Q, null, oe(x.value, (Z) => (c(), W(Jl, {
              key: Z.id,
              class: "work-match-item",
              disabled: i.value,
              onActivate: (de) => h(Z)
            }, {
              default: L(() => [
                d("code", Ei, U(Z.key), 1),
                d("span", null, U(r(Dt)(Z.values.title)), 1)
              ]),
              _: 2
            }, 1032, ["disabled", "onActivate"]))), 128))
          ]),
          e.modelValue ? (c(), W(r(J), {
            key: 0,
            label: "Clear reference",
            severity: "secondary",
            size: "small",
            disabled: i.value,
            onClick: k[6] || (k[6] = (Z) => S(void 0)),
            outlined: ""
          }, {
            icon: L(() => [
              b(r(ee), {
                icon: "tabler:list-check",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled"])) : T("", !0)
        ])) : e.field.form === "record" || e.field.type === "rich_text" || e.field.form === "quantity" || e.field.form === "ref" ? (c(), W(r(ml), {
          key: 12,
          id: o.value,
          "model-value": P.value,
          rows: "3",
          disabled: i.value,
          "aria-invalid": !!p.value,
          "onUpdate:modelValue": k[7] || (k[7] = (Z) => D(Z ?? ""))
        }, null, 8, ["id", "model-value", "disabled", "aria-invalid"])) : e.field.code === "description" ? (c(), W(r(ml), {
          key: 13,
          id: o.value,
          "model-value": f.value,
          rows: "4",
          disabled: i.value,
          "onUpdate:modelValue": k[8] || (k[8] = (Z) => S(Z))
        }, null, 8, ["id", "model-value", "disabled"])) : (c(), W(r(ce), {
          key: 14,
          id: o.value,
          "model-value": f.value,
          disabled: i.value,
          "onUpdate:modelValue": k[9] || (k[9] = (Z) => S(Z))
        }, null, 8, ["id", "model-value", "disabled"])),
        p.value ? (c(), g("span", Ui, U(p.value), 1)) : T("", !0)
      ]);
    };
  }
}), Di = { class: "work-stack work-tight work-operand-control" }, Ii = { class: "work-row work-small" }, Ai = {
  key: 1,
  class: "work-muted work-small"
}, Pi = {
  key: 2,
  class: "work-stack work-tight"
}, Ri = { class: "work-small" }, Oi = {
  key: 0,
  class: "work-error work-small",
  role: "alert"
}, qt = /* @__PURE__ */ ve({
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
    const t = e, a = l, o = X(() => "$actor" in Ke(t.modelValue) ? "actor" : "$now" in Ke(t.modelValue) ? "now" : "literal"), s = j(""), v = j("");
    Ce(() => t.modelValue, (i) => {
      s.value = JSON.stringify(i ?? []), v.value = "";
    }, { immediate: !0 });
    function f(i) {
      a("update:modelValue", i === "actor" ? { $actor: "id" } : i === "now" ? { $now: "P0D" } : void 0), a("validity", !0);
    }
    function m(i) {
      s.value = i;
      try {
        const n = JSON.parse(i);
        if (!Array.isArray(n)) throw new Error("Enter a JSON list.");
        v.value = "", a("validity", !0), a("update:modelValue", n);
      } catch (n) {
        v.value = n instanceof Error ? n.message : "Invalid values.", a("validity", !1);
      }
    }
    return (i, n) => (c(), g("div", Di, [
      d("label", Ii, [
        O(U(e.label), 1),
        b(r(ie), {
          "aria-label": e.label + " operand",
          "model-value": o.value,
          disabled: e.disabled,
          "onUpdate:modelValue": n[0] || (n[0] = (u) => f(u)),
          appendTo: "self",
          optionLabel: "label",
          optionValue: "value",
          optionDisabled: "disabled",
          options: [{ label: "Value", value: "literal", disabled: !1 }, { label: "Current actor ($actor)", value: "actor", disabled: !1 }, { label: "Current time ($now)", value: "now", disabled: !1 }]
        }, null, 8, ["aria-label", "model-value", "disabled"])
      ]),
      o.value === "now" ? (c(), W(r(ce), {
        key: 0,
        "aria-label": e.label + " time offset",
        value: r(Ke)(e.modelValue).$now,
        disabled: e.disabled,
        placeholder: "-P7D",
        onInput: n[1] || (n[1] = (u) => a("update:modelValue", { $now: u.target.value }))
      }, null, 8, ["aria-label", "value", "disabled"])) : o.value === "actor" ? (c(), g("span", Ai, "The signed-in actor’s id")) : e.multiple ? (c(), g("div", Pi, [
        d("label", Ri, [
          n[5] || (n[5] = O("Values as JSON (operands may appear in the list)", -1)),
          b(r(ml), {
            class: "work-mono",
            "aria-label": e.label + " values",
            value: s.value,
            disabled: e.disabled,
            rows: "2",
            onInput: n[2] || (n[2] = (u) => m(u.target.value))
          }, null, 8, ["aria-label", "value", "disabled"])
        ]),
        v.value ? (c(), g("p", Oi, U(v.value), 1)) : T("", !0)
      ])) : (c(), W(qa, {
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
}), Ni = ["disabled"], Mi = { class: "work-small work-mono" }, Fi = { class: "work-row work-small" }, Li = { class: "work-row work-wrap" }, zi = { key: 3 }, Bi = { class: "work-row work-wrap" }, ji = { class: "work-row" }, qi = { class: "work-row" }, Wi = { class: "work-row" }, Ki = {
  key: 3,
  class: "work-row work-wrap"
}, Gi = { class: "work-row work-wrap" }, Yi = /* @__PURE__ */ ve({
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
    const t = e, a = l, o = X(() => t.path ?? "where"), s = X(() => t.depth ?? 1), v = X(() => ["and", "or", "not", "history", "match", "rel", "children"].find((G) => G in t.modelValue) ?? "field"), f = X(() => mi(t.schema)), m = X(() => f.value.find((G) => G.code === t.modelValue.field) ?? { code: "value", form: "text" }), i = X(() => Ke(t.modelValue.history)), n = X(() => f.value.find((G) => G.code === i.value.field) ?? { code: "history", form: "text" }), u = X(() => Array.isArray(t.modelValue[v.value]) ? t.modelValue[v.value] : []), y = () => ({ field: "category", op: "eq", value: "unstarted" }), p = j(/* @__PURE__ */ new Set());
    function w(G, A) {
      A ? p.value.delete(G) : p.value.add(G), a("validity", p.value.size === 0);
    }
    Ce(v, () => {
      p.value.clear(), a("validity", !0);
    });
    function x(G) {
      const A = /* @__PURE__ */ new Set();
      for (const P of p.value) {
        const V = Number(P);
        !Number.isNaN(V) && V !== G && A.add(String(V > G ? V - 1 : V));
      }
      p.value = A, a("validity", A.size === 0), I({ [v.value]: u.value.filter((P, V) => V !== G) });
    }
    function E(G) {
      a("update:modelValue", G);
    }
    function I(G) {
      E({ ...t.modelValue, ...G });
    }
    function B(G) {
      E(G === "field" ? y() : G === "and" || G === "or" ? { [G]: [y()] } : G === "not" ? { not: y() } : G === "history" ? { history: { field: "state", changed: !0 } } : G === "match" ? { match: "" } : G === "children" ? { children: !0, q: "some", where: y() } : { rel: t.schema.compiled.relation_types?.[0]?.id ?? "", dir: "outward", q: "some", where: y() });
    }
    function M(G, A) {
      I({ [v.value]: u.value.map((P, V) => V === G ? A : P) });
    }
    function R(G, A) {
      const P = { ...i.value };
      A === void 0 ? (delete P[G], w(G, !0)) : P[G] = A, I({ history: P });
    }
    function S(G) {
      p.value.clear(), a("validity", !0);
      const A = { ...i.value };
      delete A.was, delete A.changed, delete A.from, delete A.to, A[G] = G === "changed" ? !0 : "", I({ history: A });
    }
    const q = { code: "actor", form: "text" }, N = { code: "at", form: "time" }, ae = X(() => Array.isArray(i.value.during) ? i.value.during : []);
    function ne(G, A) {
      const P = [...ae.value];
      P[G] = A, R("during", P);
    }
    return (G, A) => {
      const P = Ra("FilterNode", !0);
      return c(), g("fieldset", {
        class: "work-filter-node",
        disabled: e.disabled
      }, [
        d("legend", Mi, U(o.value), 1),
        d("label", Fi, [
          A[21] || (A[21] = O("Condition", -1)),
          b(r(ie), {
            "aria-label": o.value + " condition",
            "model-value": v.value,
            "onUpdate:modelValue": A[0] || (A[0] = (V) => B(V)),
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            optionDisabled: "disabled",
            options: [{ label: "Field", value: "field", disabled: !1 }, ...["and", "or", "not", "history", "rel", "children", "match"].map((V) => ({ label: V, value: V, disabled: s.value >= 6 && ["and", "or", "not", "rel", "children"].includes(V) }))]
          }, null, 8, ["aria-label", "model-value", "options"])
        ]),
        v.value === "and" || v.value === "or" ? (c(), g(Q, { key: 0 }, [
          (c(!0), g(Q, null, oe(u.value, (V, D) => (c(), g("div", {
            key: D,
            class: "work-stack work-tight"
          }, [
            b(P, {
              "board-id": e.boardId,
              schema: e.schema,
              "model-value": V,
              path: o.value + "." + v.value + "[" + D + "]",
              depth: s.value + 1,
              "onUpdate:modelValue": (z) => M(D, z),
              onValidity: (z) => w(String(D), z)
            }, null, 8, ["board-id", "schema", "model-value", "path", "depth", "onUpdate:modelValue", "onValidity"]),
            b(r(J), {
              label: "Remove condition",
              size: "small",
              severity: "secondary",
              onClick: (z) => x(D),
              outlined: ""
            }, {
              icon: L(() => [
                b(r(ee), {
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
            disabled: s.value >= 6,
            onClick: A[1] || (A[1] = (V) => I({ [v.value]: [...u.value, y()] })),
            outlined: ""
          }, {
            icon: L(() => [
              b(r(ee), {
                icon: "tabler:plus",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled"])
        ], 64)) : v.value === "not" ? (c(), W(P, {
          key: 1,
          "board-id": e.boardId,
          schema: e.schema,
          "model-value": r(Ke)(e.modelValue.not),
          path: o.value + ".not",
          depth: s.value + 1,
          "onUpdate:modelValue": A[2] || (A[2] = (V) => I({ not: V })),
          onValidity: A[3] || (A[3] = (V) => w("nested", V))
        }, null, 8, ["board-id", "schema", "model-value", "path", "depth"])) : v.value === "field" ? (c(), g(Q, { key: 2 }, [
          d("div", Li, [
            d("label", null, [
              A[22] || (A[22] = O("Field", -1)),
              b(r(ie), {
                "aria-label": o.value + " field",
                "model-value": e.modelValue.field,
                "onUpdate:modelValue": A[4] || (A[4] = (V) => I({ field: V, op: "eq", value: void 0 })),
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                optionDisabled: "disabled",
                options: [...(f.value ?? []).map((V) => ({ label: r(_e)(V), value: V.code, disabled: !1 }))]
              }, null, 8, ["aria-label", "model-value", "options"])
            ]),
            d("label", null, [
              A[23] || (A[23] = O("Operator", -1)),
              b(r(ie), {
                "aria-label": o.value + " operator",
                "model-value": e.modelValue.op,
                "onUpdate:modelValue": A[5] || (A[5] = (V) => I({ op: V, value: V === "is_null" ? !0 : void 0 })),
                appendTo: "self",
                options: r(fi)(m.value)
              }, null, 8, ["aria-label", "model-value", "options"])
            ])
          ]),
          b(qt, {
            "board-id": e.boardId,
            field: e.modelValue.op === "is_null" ? { code: "null", form: "bool" } : m.value,
            "model-value": e.modelValue.value,
            multiple: ["in", "nin", "between"].includes(String(e.modelValue.op)),
            label: o.value + " value",
            "onUpdate:modelValue": A[6] || (A[6] = (V) => I({ value: V })),
            onValidity: A[7] || (A[7] = (V) => w("value", V))
          }, null, 8, ["board-id", "field", "model-value", "multiple", "label"])
        ], 64)) : v.value === "match" ? (c(), g("label", zi, [
          A[24] || (A[24] = O("Search", -1)),
          b(r(ce), {
            "aria-label": o.value + " search",
            value: e.modelValue.match,
            onInput: A[8] || (A[8] = (V) => I({ match: V.target.value }))
          }, null, 8, ["aria-label", "value"])
        ])) : v.value === "history" ? (c(), g(Q, { key: 4 }, [
          d("div", Bi, [
            d("label", null, [
              A[25] || (A[25] = O("Field", -1)),
              b(r(ie), {
                "aria-label": o.value + " history field",
                "model-value": i.value.field,
                "onUpdate:modelValue": A[9] || (A[9] = (V) => R("field", V)),
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                optionDisabled: "disabled",
                options: [...(f.value ?? []).map((V) => ({ label: r(_e)(V), value: V.code, disabled: !1 }))]
              }, null, 8, ["aria-label", "model-value", "options"])
            ]),
            d("label", null, [
              A[26] || (A[26] = O("History", -1)),
              b(r(ie), {
                "aria-label": o.value + " history mode",
                "model-value": i.value.changed ? "changed" : "was",
                "onUpdate:modelValue": A[10] || (A[10] = (V) => S(V)),
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                optionDisabled: "disabled",
                options: [{ label: "Changed", value: "changed", disabled: !1 }, { label: "Was", value: "was", disabled: !1 }]
              }, null, 8, ["aria-label", "model-value"])
            ])
          ]),
          i.value.changed ? (c(), g(Q, { key: 0 }, oe(["from", "to"], (V) => d("div", { key: V }, [
            d("label", ji, [
              b(r(Mt), {
                "model-value": V in i.value,
                "aria-label": "Constrain " + V,
                "onUpdate:modelValue": (D) => R(V, D ? "" : void 0),
                binary: ""
              }, null, 8, ["model-value", "aria-label", "onUpdate:modelValue"]),
              O(U(V), 1)
            ]),
            V in i.value ? (c(), W(qt, {
              key: 0,
              "board-id": e.boardId,
              field: n.value,
              "model-value": i.value[V],
              label: o.value + " history " + V,
              "onUpdate:modelValue": (D) => R(V, D),
              onValidity: (D) => w(V, D)
            }, null, 8, ["board-id", "field", "model-value", "label", "onUpdate:modelValue", "onValidity"])) : T("", !0)
          ])), 64)) : (c(), W(qt, {
            key: 1,
            "board-id": e.boardId,
            field: n.value,
            "model-value": i.value.was,
            label: o.value + " history was",
            "onUpdate:modelValue": A[11] || (A[11] = (V) => R("was", V)),
            onValidity: A[12] || (A[12] = (V) => w("was", V))
          }, null, 8, ["board-id", "field", "model-value", "label"])),
          d("label", qi, [
            b(r(Mt), {
              "model-value": "by" in i.value,
              "aria-label": "Constrain actor",
              "onUpdate:modelValue": A[13] || (A[13] = (V) => R("by", V ? { $actor: "id" } : void 0)),
              binary: ""
            }, null, 8, ["model-value"]),
            A[27] || (A[27] = O("By actor", -1))
          ]),
          "by" in i.value ? (c(), W(qt, {
            key: 2,
            "board-id": e.boardId,
            field: q,
            "model-value": i.value.by,
            label: o.value + " history by",
            "onUpdate:modelValue": A[14] || (A[14] = (V) => R("by", V))
          }, null, 8, ["board-id", "model-value", "label"])) : T("", !0),
          d("label", Wi, [
            b(r(Mt), {
              "model-value": "during" in i.value,
              "aria-label": "Constrain time window",
              "onUpdate:modelValue": A[15] || (A[15] = (V) => R("during", V ? [{ $now: "-P30D" }, { $now: "P0D" }] : void 0)),
              binary: ""
            }, null, 8, ["model-value"]),
            A[28] || (A[28] = O("During", -1))
          ]),
          "during" in i.value ? (c(), g("div", Ki, [
            (c(), g(Q, null, oe(["start", "end"], (V, D) => b(qt, {
              key: V,
              "board-id": e.boardId,
              field: N,
              "model-value": ae.value[D],
              label: o.value + " during " + V,
              "onUpdate:modelValue": (z) => ne(D, z)
            }, null, 8, ["board-id", "model-value", "label", "onUpdate:modelValue"])), 64))
          ])) : T("", !0)
        ], 64)) : (c(), g(Q, { key: 5 }, [
          d("div", Gi, [
            v.value === "rel" ? (c(), g(Q, { key: 0 }, [
              d("label", null, [
                A[29] || (A[29] = O("Relation", -1)),
                b(r(ie), {
                  "model-value": e.modelValue.rel,
                  "onUpdate:modelValue": A[16] || (A[16] = (V) => I({ rel: V })),
                  appendTo: "self",
                  optionLabel: "label",
                  optionValue: "value",
                  optionDisabled: "disabled",
                  options: [...(e.schema.compiled.relation_types ?? []).map((V) => ({ label: V.outward ?? V.id, value: V.id, disabled: !1 }))]
                }, null, 8, ["model-value", "options"])
              ]),
              d("label", null, [
                A[30] || (A[30] = O("Direction", -1)),
                b(r(ie), {
                  "model-value": e.modelValue.dir,
                  "onUpdate:modelValue": A[17] || (A[17] = (V) => I({ dir: V })),
                  appendTo: "self",
                  optionLabel: "label",
                  optionValue: "value",
                  optionDisabled: "disabled",
                  options: [{ label: "Outward", value: "outward", disabled: !1 }, { label: "Inward", value: "inward", disabled: !1 }]
                }, null, 8, ["model-value"])
              ])
            ], 64)) : T("", !0),
            d("label", null, [
              A[31] || (A[31] = O("Quantifier", -1)),
              b(r(ie), {
                "model-value": e.modelValue.q,
                "onUpdate:modelValue": A[18] || (A[18] = (V) => I({ q: V })),
                appendTo: "self",
                options: ["some", "every", "none"]
              }, null, 8, ["model-value"])
            ])
          ]),
          b(P, {
            "board-id": e.boardId,
            schema: e.schema,
            "model-value": r(Ke)(e.modelValue.where),
            path: o.value + ".where",
            depth: s.value + 1,
            "onUpdate:modelValue": A[19] || (A[19] = (V) => I({ where: V })),
            onValidity: A[20] || (A[20] = (V) => w("nested", V))
          }, null, 8, ["board-id", "schema", "model-value", "path", "depth"])
        ], 64))
      ], 8, Ni);
    };
  }
}), Hi = { class: "work-stack work-tight" }, Xi = { class: "work-row work-small" }, _l = /* @__PURE__ */ ve({
  __name: "ConditionEditor",
  props: {
    modelValue: {},
    draft: {},
    boardId: {},
    label: {}
  },
  emits: ["update:modelValue", "validity"],
  setup(e, { emit: l }) {
    const t = e, a = l, o = X(() => ({ declaration: t.draft, compiled: t.draft, generation: 0, as_of: 0, key_prefix: "" })), s = /* @__PURE__ */ new Set();
    function v(m, i) {
      i ? s.delete(m) : s.add(m), a("validity", !s.size);
    }
    function f(m) {
      a("update:modelValue", m ? { field: t.draft.fields?.[0]?.code ?? "state", op: "eq" } : void 0), m || (s.clear(), a("validity", !0));
    }
    return nt(() => a("validity", !0)), (m, i) => (c(), g("section", Hi, [
      d("label", Xi, [
        b(r(Le), {
          "model-value": e.modelValue != null,
          "aria-label": e.label,
          "onUpdate:modelValue": f
        }, null, 8, ["model-value", "aria-label"]),
        O(U(e.label), 1)
      ]),
      e.modelValue != null ? (c(), W(Yi, {
        key: 0,
        schema: o.value,
        "board-id": e.boardId ?? "",
        "model-value": r(Ke)(e.modelValue),
        path: e.label,
        "onUpdate:modelValue": i[0] || (i[0] = (n) => a("update:modelValue", n)),
        onValidity: i[1] || (i[1] = (n) => v("structured", n))
      }, null, 8, ["schema", "board-id", "model-value", "path"])) : T("", !0),
      e.modelValue != null ? (c(), W(ot, {
        key: 1,
        label: e.label + " predicate",
        "model-value": e.modelValue,
        hint: "Use any predicate accepted by Work, including installed or deeply nested forms.",
        "onUpdate:modelValue": i[2] || (i[2] = (n) => a("update:modelValue", n)),
        onValidity: i[3] || (i[3] = (n) => v("raw", n))
      }, null, 8, ["label", "model-value"])) : T("", !0)
    ]));
  }
}), Ji = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, Zi = ["aria-label"], Qi = { class: "work-field-label" }, _i = {
  key: 0,
  class: "work-chips"
}, en = ["kinds"], tn = {
  key: 2,
  class: "work-muted work-small"
}, ea = /* @__PURE__ */ ve({
  __name: "PrincipalsPicker",
  props: {
    modelValue: {},
    label: {},
    kinds: {},
    boardId: {}
  },
  emits: ["update:modelValue"],
  setup(e, { emit: l }) {
    const t = e, a = l, o = j(!1), s = j(0), v = X(() => t.modelValue ?? []), { principalLabel: f, rememberPrincipal: m, nameError: i } = Na(() => t.boardId ?? "", () => v.value);
    kl(async () => {
      o.value = await lt("wc-principal-picker");
    });
    function n(u) {
      const y = u.detail, p = y?.principal_id ?? y?.id;
      if (!p) return;
      const w = { kind: y.type ?? "user", id: p };
      y.label && m(w, y.label), v.value.some((x) => x.id === p && x.kind === w.kind) || a("update:modelValue", [...v.value, w]), s.value++;
    }
    return (u, y) => (c(), g(Q, null, [
      r(i) ? (c(), g("p", Ji, U(r(i)), 1)) : T("", !0),
      d("section", {
        class: "work-stack work-tight work-principals-picker",
        "aria-label": e.label
      }, [
        d("h4", Qi, U(e.label), 1),
        v.value.length ? (c(), g("div", _i, [
          (c(!0), g(Q, null, oe(v.value, (p, w) => (c(), W(r(Re), {
            key: p.kind + p.id,
            severity: "secondary",
            class: "kx-tag-sm"
          }, {
            default: L(() => [
              O(U(r(f)(p)), 1),
              b(r(J), {
                text: "",
                severity: "secondary",
                size: "small",
                "aria-label": "Remove " + r(f)(p),
                onClick: (x) => a("update:modelValue", v.value.filter((E, I) => I !== w))
              }, {
                default: L(() => [
                  b(r(ee), { icon: "tabler:x" })
                ]),
                _: 1
              }, 8, ["aria-label", "onClick"])
            ]),
            _: 2
          }, 1024))), 128))
        ])) : T("", !0),
        o.value ? (c(), g("wc-principal-picker", {
          key: s.value,
          kinds: e.kinds ?? "user,group",
          onConfigChanged: n
        }, null, 40, en)) : (c(), g("p", tn, "People and group picker is unavailable."))
      ], 8, Zi)
    ], 64));
  }
}), ln = { class: "work-stack work-tight" }, Wa = /* @__PURE__ */ ve({
  __name: "HoldersPicker",
  props: {
    modelValue: {},
    label: {},
    boardId: {}
  },
  emits: ["update:modelValue", "validity"],
  setup(e, { emit: l }) {
    const t = e, a = l, o = X(() => (t.modelValue ?? []).flatMap((v) => "user" in v ? [{ kind: "user", id: v.user }] : "group" in v ? [{ kind: "group", id: v.group }] : []));
    function s(v) {
      const f = [...(t.modelValue ?? []).filter((m) => "field" in m || "service" in m), ...v.map((m) => m.kind === "group" ? { group: m.id } : { user: m.id })];
      a("update:modelValue", f.length ? f : void 0);
    }
    return (v, f) => (c(), g("div", ln, [
      b(ea, {
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
        "onUpdate:modelValue": f[0] || (f[0] = (m) => a("update:modelValue", m)),
        onValidity: f[1] || (f[1] = (m) => a("validity", m))
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
function an(e, l, t) {
  return (l = rn(l)) in e ? Object.defineProperty(e, l, {
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
      an(e, a, t[a]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ha(Object(t)).forEach(function(a) {
      Object.defineProperty(e, a, Object.getOwnPropertyDescriptor(t, a));
    });
  }
  return e;
}
function on(e, l) {
  if (e == null) return {};
  var t, a, o = nn(e, l);
  if (Object.getOwnPropertySymbols) {
    var s = Object.getOwnPropertySymbols(e);
    for (a = 0; a < s.length; a++) t = s[a], l.indexOf(t) === -1 && {}.propertyIsEnumerable.call(e, t) && (o[t] = e[t]);
  }
  return o;
}
function nn(e, l) {
  if (e == null) return {};
  var t = {};
  for (var a in e) if ({}.hasOwnProperty.call(e, a)) {
    if (l.indexOf(a) !== -1) continue;
    t[a] = e[a];
  }
  return t;
}
function sn(e, l) {
  if (typeof e != "object" || !e) return e;
  var t = e[Symbol.toPrimitive];
  if (t !== void 0) {
    var a = t.call(e, l);
    if (typeof a != "object") return a;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (l === "string" ? String : Number)(e);
}
function rn(e) {
  var l = sn(e, "string");
  return typeof l == "symbol" ? l : l + "";
}
function ql(e) {
  "@babel/helpers - typeof";
  return ql = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(l) {
    return typeof l;
  } : function(l) {
    return l && typeof Symbol == "function" && l.constructor === Symbol && l !== Symbol.prototype ? "symbol" : typeof l;
  }, ql(e);
}
var dn = "1.15.7";
function at(e) {
  if (typeof window < "u" && window.navigator)
    return !!/* @__PURE__ */ navigator.userAgent.match(e);
}
var st = at(/(?:Trident.*rv[ :]?11\.|msie|iemobile|Windows Phone)/i), el = at(/Edge/i), ya = at(/firefox/i), Ht = at(/safari/i) && !at(/chrome/i) && !at(/android/i), ta = at(/iP(ad|od|hone)/i), Ka = at(/chrome/i) && at(/android/i), Ga = {
  capture: !1,
  passive: !1
};
function fe(e, l, t) {
  e.addEventListener(l, t, !st && Ga);
}
function me(e, l, t) {
  e.removeEventListener(l, t, !st && Ga);
}
function fl(e, l) {
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
      if (l != null && (l[0] === ">" ? e.parentNode === t && fl(e, l) : fl(e, l)) || a && e === t)
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
function se(e, l, t) {
  var a = e && e.style;
  if (a) {
    if (t === void 0)
      return document.defaultView && document.defaultView.getComputedStyle ? t = document.defaultView.getComputedStyle(e, "") : e.currentStyle && (t = e.currentStyle), l === void 0 ? t : t[l];
    !(l in a) && l.indexOf("webkit") === -1 && (l = "-webkit-" + l), a[l] = t + (typeof t == "string" ? "" : "px");
  }
}
function Ft(e, l) {
  var t = "";
  if (typeof e == "string")
    t = e;
  else
    do {
      var a = se(e, "transform");
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
function De(e, l, t, a, o) {
  if (!(!e.getBoundingClientRect && e !== window)) {
    var s, v, f, m, i, n, u;
    if (e !== window && e.parentNode && e !== et() ? (s = e.getBoundingClientRect(), v = s.top, f = s.left, m = s.bottom, i = s.right, n = s.height, u = s.width) : (v = 0, f = 0, m = window.innerHeight, i = window.innerWidth, n = window.innerHeight, u = window.innerWidth), (l || t) && e !== window && (o = o || e.parentNode, !st))
      do
        if (o && o.getBoundingClientRect && (se(o, "transform") !== "none" || t && se(o, "position") !== "static")) {
          var y = o.getBoundingClientRect();
          v -= y.top + parseInt(se(o, "border-top-width")), f -= y.left + parseInt(se(o, "border-left-width")), m = v + s.height, i = f + s.width;
          break;
        }
      while (o = o.parentNode);
    if (a && e !== window) {
      var p = Ft(o || e), w = p && p.a, x = p && p.d;
      p && (v /= x, f /= w, u /= w, n /= x, m = v + n, i = f + u);
    }
    return {
      top: v,
      left: f,
      bottom: m,
      right: i,
      width: u,
      height: n
    };
  }
}
function ka(e, l, t) {
  for (var a = ft(e, !0), o = De(e)[l]; a; ) {
    var s = De(a)[t], v = void 0;
    if (v = o >= s, !v) return a;
    if (a === et()) break;
    a = ft(a, !1);
  }
  return !1;
}
function zt(e, l, t, a) {
  for (var o = 0, s = 0, v = e.children; s < v.length; ) {
    if (v[s].style.display !== "none" && v[s] !== re.ghost && (a || v[s] !== re.dragged) && Je(v[s], t.draggable, e, !1)) {
      if (o === l)
        return v[s];
      o++;
    }
    s++;
  }
  return null;
}
function la(e, l) {
  for (var t = e.lastElementChild; t && (t === re.ghost || se(t, "display") === "none" || l && !fl(t, l)); )
    t = t.previousElementSibling;
  return t || null;
}
function qe(e, l) {
  var t = 0;
  if (!e || !e.parentNode)
    return -1;
  for (; e = e.previousElementSibling; )
    e.nodeName.toUpperCase() !== "TEMPLATE" && e !== re.clone && (!l || fl(e, l)) && t++;
  return t;
}
function wa(e) {
  var l = 0, t = 0, a = et();
  if (e)
    do {
      var o = Ft(e), s = o.a, v = o.d;
      l += e.scrollLeft * s, t += e.scrollTop * v;
    } while (e !== a && (e = e.parentNode));
  return [l, t];
}
function un(e, l) {
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
      var o = se(t);
      if (t.clientWidth < t.scrollWidth && (o.overflowX == "auto" || o.overflowX == "scroll") || t.clientHeight < t.scrollHeight && (o.overflowY == "auto" || o.overflowY == "scroll")) {
        if (!t.getBoundingClientRect || t === document.body) return et();
        if (a || l) return t;
        a = !0;
      }
    }
  while (t = t.parentNode);
  return et();
}
function cn(e, l) {
  if (e && l)
    for (var t in l)
      l.hasOwnProperty(t) && (e[t] = l[t]);
  return e;
}
function Il(e, l) {
  return Math.round(e.top) === Math.round(l.top) && Math.round(e.left) === Math.round(l.left) && Math.round(e.height) === Math.round(l.height) && Math.round(e.width) === Math.round(l.width);
}
var Xt;
function Xa(e, l) {
  return function() {
    if (!Xt) {
      var t = arguments, a = this;
      t.length === 1 ? e.call(a, t[0]) : e.apply(a, t), Xt = setTimeout(function() {
        Xt = void 0;
      }, l);
    }
  };
}
function vn() {
  clearTimeout(Xt), Xt = void 0;
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
    var s, v, f, m;
    if (!(!Je(o, l.draggable, e, !1) || o.animated || o === t)) {
      var i = De(o);
      a.left = Math.min((s = a.left) !== null && s !== void 0 ? s : 1 / 0, i.left), a.top = Math.min((v = a.top) !== null && v !== void 0 ? v : 1 / 0, i.top), a.right = Math.max((f = a.right) !== null && f !== void 0 ? f : -1 / 0, i.right), a.bottom = Math.max((m = a.bottom) !== null && m !== void 0 ? m : -1 / 0, i.bottom);
    }
  }), a.width = a.right - a.left, a.height = a.bottom - a.top, a.x = a.left, a.y = a.top, a;
}
var Fe = "Sortable" + (/* @__PURE__ */ new Date()).getTime();
function mn() {
  var e = [], l;
  return {
    captureAnimationState: function() {
      if (e = [], !!this.options.animation) {
        var a = [].slice.call(this.el.children);
        a.forEach(function(o) {
          if (!(se(o, "display") === "none" || o === re.ghost)) {
            e.push({
              target: o,
              rect: De(o)
            });
            var s = tt({}, e[e.length - 1].rect);
            if (o.thisAnimationDuration) {
              var v = Ft(o, !0);
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
      e.splice(un(e, {
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
      e.forEach(function(f) {
        var m = 0, i = f.target, n = i.fromRect, u = De(i), y = i.prevFromRect, p = i.prevToRect, w = f.rect, x = Ft(i, !0);
        x && (u.top -= x.f, u.left -= x.e), i.toRect = u, i.thisAnimationDuration && Il(y, u) && !Il(n, u) && // Make sure animatingRect is on line between toRect & fromRect
        (w.top - u.top) / (w.left - u.left) === (n.top - u.top) / (n.left - u.left) && (m = pn(w, y, p, o.options)), Il(u, n) || (i.prevFromRect = n, i.prevToRect = u, m || (m = o.options.animation), o.animate(i, w, u, m)), m && (s = !0, v = Math.max(v, m), clearTimeout(i.animationResetTimer), i.animationResetTimer = setTimeout(function() {
          i.animationTime = 0, i.prevFromRect = null, i.fromRect = null, i.prevToRect = null, i.thisAnimationDuration = null;
        }, m), i.thisAnimationDuration = m);
      }), clearTimeout(l), s ? l = setTimeout(function() {
        typeof a == "function" && a();
      }, v) : typeof a == "function" && a(), e = [];
    },
    animate: function(a, o, s, v) {
      if (v) {
        se(a, "transition", ""), se(a, "transform", "");
        var f = Ft(this.el), m = f && f.a, i = f && f.d, n = (o.left - s.left) / (m || 1), u = (o.top - s.top) / (i || 1);
        a.animatingX = !!n, a.animatingY = !!u, se(a, "transform", "translate3d(" + n + "px," + u + "px,0)"), this.forRepaintDummy = fn(a), se(a, "transition", "transform " + v + "ms" + (this.options.easing ? " " + this.options.easing : "")), se(a, "transform", "translate3d(0,0,0)"), typeof a.animated == "number" && clearTimeout(a.animated), a.animated = setTimeout(function() {
          se(a, "transition", ""), se(a, "transform", ""), a.animated = !1, a.animatingX = !1, a.animatingY = !1;
        }, v);
      }
    }
  };
}
function fn(e) {
  return e.offsetWidth;
}
function pn(e, l, t, a) {
  return Math.sqrt(Math.pow(l.top - e.top, 2) + Math.pow(l.left - e.left, 2)) / Math.sqrt(Math.pow(l.top - t.top, 2) + Math.pow(l.left - t.left, 2)) * a.animation;
}
var At = [], Al = {
  initializeByDefault: !0
}, tl = {
  mount: function(l) {
    for (var t in Al)
      Al.hasOwnProperty(t) && !(t in l) && (l[t] = Al[t]);
    At.forEach(function(a) {
      if (a.pluginName === l.pluginName)
        throw "Sortable: Cannot mount plugin ".concat(l.pluginName, " more than once");
    }), At.push(l);
  },
  pluginEvent: function(l, t, a) {
    var o = this;
    this.eventCanceled = !1, a.cancel = function() {
      o.eventCanceled = !0;
    };
    var s = l + "Global";
    At.forEach(function(v) {
      t[v.pluginName] && (t[v.pluginName][s] && t[v.pluginName][s](tt({
        sortable: t
      }, a)), t.options[v.pluginName] && t[v.pluginName][l] && t[v.pluginName][l](tt({
        sortable: t
      }, a)));
    });
  },
  initializePlugins: function(l, t, a, o) {
    At.forEach(function(f) {
      var m = f.pluginName;
      if (!(!l.options[m] && !f.initializeByDefault)) {
        var i = new f(l, t, l.options);
        i.sortable = l, i.options = l.options, l[m] = i, it(a, i.defaults);
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
    return At.forEach(function(o) {
      typeof o.eventProperties == "function" && it(a, o.eventProperties.call(t[o.pluginName], l));
    }), a;
  },
  modifyOption: function(l, t, a) {
    var o;
    return At.forEach(function(s) {
      l[s.pluginName] && s.optionListeners && typeof s.optionListeners[t] == "function" && (o = s.optionListeners[t].call(l[s.pluginName], a));
    }), o;
  }
};
function bn(e) {
  var l = e.sortable, t = e.rootEl, a = e.name, o = e.targetEl, s = e.cloneEl, v = e.toEl, f = e.fromEl, m = e.oldIndex, i = e.newIndex, n = e.oldDraggableIndex, u = e.newDraggableIndex, y = e.originalEvent, p = e.putSortable, w = e.extraEventProperties;
  if (l = l || t && t[Fe], !!l) {
    var x, E = l.options, I = "on" + a.charAt(0).toUpperCase() + a.substr(1);
    window.CustomEvent && !st && !el ? x = new CustomEvent(a, {
      bubbles: !0,
      cancelable: !0
    }) : (x = document.createEvent("Event"), x.initEvent(a, !0, !0)), x.to = v || t, x.from = f || t, x.item = o || t, x.clone = s, x.oldIndex = m, x.newIndex = i, x.oldDraggableIndex = n, x.newDraggableIndex = u, x.originalEvent = y, x.pullMode = p ? p.lastPutMode : void 0;
    var B = tt(tt({}, w), tl.getEventProperties(a, l));
    for (var M in B)
      x[M] = B[M];
    t && t.dispatchEvent(x), E[I] && E[I].call(l, x);
  }
}
var hn = ["evt"], Me = function(l, t) {
  var a = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, o = a.evt, s = on(a, hn);
  tl.pluginEvent.bind(re)(l, t, tt({
    dragEl: H,
    parentEl: Se,
    ghostEl: ue,
    rootEl: $e,
    nextEl: Vt,
    lastDownEl: dl,
    cloneEl: xe,
    cloneHidden: mt,
    dragStarted: Kt,
    putSortable: Ie,
    activeSortable: re.active,
    originalEvent: o,
    oldIndex: Nt,
    oldDraggableIndex: Jt,
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
    dispatchSortableEvent: function(f) {
      Oe({
        sortable: t,
        name: f,
        originalEvent: o
      });
    }
  }, s));
};
function Oe(e) {
  bn(tt({
    putSortable: Ie,
    cloneEl: xe,
    targetEl: H,
    rootEl: $e,
    oldIndex: Nt,
    oldDraggableIndex: Jt,
    newIndex: Be,
    newDraggableIndex: vt
  }, e));
}
var H, Se, ue, $e, Vt, dl, xe, mt, Nt, Be, Jt, vt, il, Ie, Rt = !1, pl = !1, bl = [], yt, Xe, Pl, Rl, Va, $a, Kt, Pt, Zt, Qt = !1, nl = !1, ul, Pe, Ol = [], Wl = !1, hl = [], xl = typeof document < "u", sl = ta, xa = el || st ? "cssFloat" : "float", yn = xl && !Ka && !ta && "draggable" in document.createElement("div"), _a = (function() {
  if (xl) {
    if (st)
      return !1;
    var e = document.createElement("x");
    return e.style.cssText = "pointer-events:auto", e.style.pointerEvents === "auto";
  }
})(), eo = function(l, t) {
  var a = se(l), o = parseInt(a.width) - parseInt(a.paddingLeft) - parseInt(a.paddingRight) - parseInt(a.borderLeftWidth) - parseInt(a.borderRightWidth), s = zt(l, 0, t), v = zt(l, 1, t), f = s && se(s), m = v && se(v), i = f && parseInt(f.marginLeft) + parseInt(f.marginRight) + De(s).width, n = m && parseInt(m.marginLeft) + parseInt(m.marginRight) + De(v).width;
  if (a.display === "flex")
    return a.flexDirection === "column" || a.flexDirection === "column-reverse" ? "vertical" : "horizontal";
  if (a.display === "grid")
    return a.gridTemplateColumns.split(" ").length <= 1 ? "vertical" : "horizontal";
  if (s && f.float && f.float !== "none") {
    var u = f.float === "left" ? "left" : "right";
    return v && (m.clear === "both" || m.clear === u) ? "vertical" : "horizontal";
  }
  return s && (f.display === "block" || f.display === "flex" || f.display === "table" || f.display === "grid" || i >= o && a[xa] === "none" || v && a[xa] === "none" && i + n > o) ? "vertical" : "horizontal";
}, gn = function(l, t, a) {
  var o = a ? l.left : l.top, s = a ? l.right : l.bottom, v = a ? l.width : l.height, f = a ? t.left : t.top, m = a ? t.right : t.bottom, i = a ? t.width : t.height;
  return o === f || s === m || o + v / 2 === f + i / 2;
}, kn = function(l, t) {
  var a;
  return bl.some(function(o) {
    var s = o[Fe].options.emptyInsertThreshold;
    if (!(!s || la(o))) {
      var v = De(o), f = l >= v.left - s && l <= v.right + s, m = t >= v.top - s && t <= v.bottom + s;
      if (f && m)
        return a = o;
    }
  }), a;
}, to = function(l) {
  function t(s, v) {
    return function(f, m, i, n) {
      var u = f.options.group.name && m.options.group.name && f.options.group.name === m.options.group.name;
      if (s == null && (v || u))
        return !0;
      if (s == null || s === !1)
        return !1;
      if (v && s === "clone")
        return s;
      if (typeof s == "function")
        return t(s(f, m, i, n), v)(f, m, i, n);
      var y = (v ? f : m).options.group.name;
      return s === !0 || typeof s == "string" && s === y || s.join && s.indexOf(y) > -1;
    };
  }
  var a = {}, o = l.group;
  (!o || ql(o) != "object") && (o = {
    name: o
  }), a.name = o.name, a.checkPull = t(o.pull, !0), a.checkPut = t(o.put), a.revertClone = o.revertClone, l.group = a;
}, lo = function() {
  !_a && ue && se(ue, "display", "none");
}, ao = function() {
  !_a && ue && se(ue, "display", "");
};
xl && !Ka && document.addEventListener("click", function(e) {
  if (pl)
    return e.preventDefault(), e.stopPropagation && e.stopPropagation(), e.stopImmediatePropagation && e.stopImmediatePropagation(), pl = !1, !1;
}, !0);
var gt = function(l) {
  if (H) {
    l = l.touches ? l.touches[0] : l;
    var t = kn(l.clientX, l.clientY);
    if (t) {
      var a = {};
      for (var o in l)
        l.hasOwnProperty(o) && (a[o] = l[o]);
      a.target = a.rootEl = t, a.preventDefault = void 0, a.stopPropagation = void 0, t[Fe]._onDragOver(a);
    }
  }
}, wn = function(l) {
  H && H.parentNode[Fe]._isOutsideThisEl(l.target);
};
function re(e, l) {
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
    setData: function(v, f) {
      v.setData("Text", f.textContent);
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
    supportPointer: re.supportPointer !== !1 && "PointerEvent" in window && (!Ht || ta),
    emptyInsertThreshold: 5
  };
  tl.initializePlugins(this, e, t);
  for (var a in t)
    !(a in l) && (l[a] = t[a]);
  to(l);
  for (var o in this)
    o.charAt(0) === "_" && typeof this[o] == "function" && (this[o] = this[o].bind(this));
  this.nativeDraggable = l.forceFallback ? !1 : yn, this.nativeDraggable && (this.options.touchStartThreshold = 1), l.supportPointer ? fe(e, "pointerdown", this._onTapStart) : (fe(e, "mousedown", this._onTapStart), fe(e, "touchstart", this._onTapStart)), this.nativeDraggable && (fe(e, "dragover", this), fe(e, "dragenter", this)), bl.push(this.el), l.store && l.store.get && this.sort(l.store.get(this) || []), it(this, mn());
}
re.prototype = /** @lends Sortable.prototype */
{
  constructor: re,
  _isOutsideThisEl: function(l) {
    !this.el.contains(l) && l !== this.el && (Pt = null);
  },
  _getDirection: function(l, t) {
    return typeof this.options.direction == "function" ? this.options.direction.call(this, l, t, H) : this.options.direction;
  },
  _onTapStart: function(l) {
    if (l.cancelable) {
      var t = this, a = this.el, o = this.options, s = o.preventOnFilter, v = l.type, f = l.touches && l.touches[0] || l.pointerType && l.pointerType === "touch" && l, m = (f || l).target, i = l.target.shadowRoot && (l.path && l.path[0] || l.composedPath && l.composedPath()[0]) || m, n = o.filter;
      if (Un(a), !H && !(/mousedown|pointerdown/.test(v) && l.button !== 0 || o.disabled) && !i.isContentEditable && !(!this.nativeDraggable && Ht && m && m.tagName.toUpperCase() === "SELECT") && (m = Je(m, o.draggable, a, !1), !(m && m.animated) && dl !== m)) {
        if (Nt = qe(m), Jt = qe(m, o.draggable), typeof n == "function") {
          if (n.call(this, l, m, this)) {
            Oe({
              sortable: t,
              rootEl: i,
              name: "filter",
              targetEl: m,
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
              targetEl: m,
              fromEl: a,
              toEl: a
            }), Me("filter", t, {
              evt: l
            }), !0;
        }), n)) {
          s && l.preventDefault();
          return;
        }
        o.handle && !Je(i, o.handle, a, !1) || this._prepareDragStart(l, f, m);
      }
    }
  },
  _prepareDragStart: function(l, t, a) {
    var o = this, s = o.el, v = o.options, f = s.ownerDocument, m;
    if (a && !H && a.parentNode === s) {
      var i = De(a);
      if ($e = s, H = a, Se = H.parentNode, Vt = H.nextSibling, dl = a, il = v.group, re.dragged = H, yt = {
        target: H,
        clientX: (t || l).clientX,
        clientY: (t || l).clientY
      }, Va = yt.clientX - i.left, $a = yt.clientY - i.top, this._lastX = (t || l).clientX, this._lastY = (t || l).clientY, H.style["will-change"] = "all", m = function() {
        if (Me("delayEnded", o, {
          evt: l
        }), re.eventCanceled) {
          o._onDrop();
          return;
        }
        o._disableDelayedDragEvents(), !ya && o.nativeDraggable && (H.draggable = !0), o._triggerDragStart(l, t), Oe({
          sortable: o,
          name: "choose",
          originalEvent: l
        }), ze(H, v.chosenClass, !0);
      }, v.ignore.split(",").forEach(function(n) {
        Ha(H, n.trim(), Nl);
      }), fe(f, "dragover", gt), fe(f, "mousemove", gt), fe(f, "touchmove", gt), v.supportPointer ? (fe(f, "pointerup", o._onDrop), !this.nativeDraggable && fe(f, "pointercancel", o._onDrop)) : (fe(f, "mouseup", o._onDrop), fe(f, "touchend", o._onDrop), fe(f, "touchcancel", o._onDrop)), ya && this.nativeDraggable && (this.options.touchStartThreshold = 4, H.draggable = !0), Me("delayStart", this, {
        evt: l
      }), v.delay && (!v.delayOnTouchOnly || t) && (!this.nativeDraggable || !(el || st))) {
        if (re.eventCanceled) {
          this._onDrop();
          return;
        }
        v.supportPointer ? (fe(f, "pointerup", o._disableDelayedDrag), fe(f, "pointercancel", o._disableDelayedDrag)) : (fe(f, "mouseup", o._disableDelayedDrag), fe(f, "touchend", o._disableDelayedDrag), fe(f, "touchcancel", o._disableDelayedDrag)), fe(f, "mousemove", o._delayedDragTouchMoveHandler), fe(f, "touchmove", o._delayedDragTouchMoveHandler), v.supportPointer && fe(f, "pointermove", o._delayedDragTouchMoveHandler), o._dragStartTimer = setTimeout(m, v.delay);
      } else
        m();
    }
  },
  _delayedDragTouchMoveHandler: function(l) {
    var t = l.touches ? l.touches[0] : l;
    Math.max(Math.abs(t.clientX - this._lastX), Math.abs(t.clientY - this._lastY)) >= Math.floor(this.options.touchStartThreshold / (this.nativeDraggable && window.devicePixelRatio || 1)) && this._disableDelayedDrag();
  },
  _disableDelayedDrag: function() {
    H && Nl(H), clearTimeout(this._dragStartTimer), this._disableDelayedDragEvents();
  },
  _disableDelayedDragEvents: function() {
    var l = this.el.ownerDocument;
    me(l, "mouseup", this._disableDelayedDrag), me(l, "touchend", this._disableDelayedDrag), me(l, "touchcancel", this._disableDelayedDrag), me(l, "pointerup", this._disableDelayedDrag), me(l, "pointercancel", this._disableDelayedDrag), me(l, "mousemove", this._delayedDragTouchMoveHandler), me(l, "touchmove", this._delayedDragTouchMoveHandler), me(l, "pointermove", this._delayedDragTouchMoveHandler);
  },
  _triggerDragStart: function(l, t) {
    t = t || l.pointerType == "touch" && l, !this.nativeDraggable || t ? this.options.supportPointer ? fe(document, "pointermove", this._onTouchMove) : t ? fe(document, "touchmove", this._onTouchMove) : fe(document, "mousemove", this._onTouchMove) : (fe(H, "dragend", this), fe($e, "dragstart", this._onDragStart));
    try {
      document.selection ? cl(function() {
        document.selection.empty();
      }) : window.getSelection().removeAllRanges();
    } catch {
    }
  },
  _dragStarted: function(l, t) {
    if (Rt = !1, $e && H) {
      Me("dragStarted", this, {
        evt: t
      }), this.nativeDraggable && fe(document, "dragover", wn);
      var a = this.options;
      !l && ze(H, a.dragClass, !1), ze(H, a.ghostClass, !0), re.active = this, l && this._appendGhost(), Oe({
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
      if (H.parentNode[Fe]._isOutsideThisEl(l), t)
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
      var t = this.options, a = t.fallbackTolerance, o = t.fallbackOffset, s = l.touches ? l.touches[0] : l, v = ue && Ft(ue, !0), f = ue && v && v.a, m = ue && v && v.d, i = sl && Pe && wa(Pe), n = (s.clientX - yt.clientX + o.x) / (f || 1) + (i ? i[0] - Ol[0] : 0) / (f || 1), u = (s.clientY - yt.clientY + o.y) / (m || 1) + (i ? i[1] - Ol[1] : 0) / (m || 1);
      if (!re.active && !Rt) {
        if (a && Math.max(Math.abs(s.clientX - this._lastX), Math.abs(s.clientY - this._lastY)) < a)
          return;
        this._onDragStart(l, !0);
      }
      if (ue) {
        v ? (v.e += n - (Pl || 0), v.f += u - (Rl || 0)) : v = {
          a: 1,
          b: 0,
          c: 0,
          d: 1,
          e: n,
          f: u
        };
        var y = "matrix(".concat(v.a, ",").concat(v.b, ",").concat(v.c, ",").concat(v.d, ",").concat(v.e, ",").concat(v.f, ")");
        se(ue, "webkitTransform", y), se(ue, "mozTransform", y), se(ue, "msTransform", y), se(ue, "transform", y), Pl = n, Rl = u, Xe = s;
      }
      l.cancelable && l.preventDefault();
    }
  },
  _appendGhost: function() {
    if (!ue) {
      var l = this.options.fallbackOnBody ? document.body : $e, t = De(H, !0, sl, !0, l), a = this.options;
      if (sl) {
        for (Pe = l; se(Pe, "position") === "static" && se(Pe, "transform") === "none" && Pe !== document; )
          Pe = Pe.parentNode;
        Pe !== document.body && Pe !== document.documentElement ? (Pe === document && (Pe = et()), t.top += Pe.scrollTop, t.left += Pe.scrollLeft) : Pe = et(), Ol = wa(Pe);
      }
      ue = H.cloneNode(!0), ze(ue, a.ghostClass, !1), ze(ue, a.fallbackClass, !0), ze(ue, a.dragClass, !0), se(ue, "transition", ""), se(ue, "transform", ""), se(ue, "box-sizing", "border-box"), se(ue, "margin", 0), se(ue, "top", t.top), se(ue, "left", t.left), se(ue, "width", t.width), se(ue, "height", t.height), se(ue, "opacity", "0.8"), se(ue, "position", sl ? "absolute" : "fixed"), se(ue, "zIndex", "100000"), se(ue, "pointerEvents", "none"), re.ghost = ue, l.appendChild(ue), se(ue, "transform-origin", Va / parseInt(ue.style.width) * 100 + "% " + $a / parseInt(ue.style.height) * 100 + "%");
    }
  },
  _onDragStart: function(l, t) {
    var a = this, o = l.dataTransfer, s = a.options;
    if (Me("dragStart", this, {
      evt: l
    }), re.eventCanceled) {
      this._onDrop();
      return;
    }
    Me("setupClone", this), re.eventCanceled || (xe = Za(H), xe.removeAttribute("id"), xe.draggable = !1, xe.style["will-change"] = "", this._hideClone(), ze(xe, this.options.chosenClass, !1), re.clone = xe), a.cloneId = cl(function() {
      Me("clone", a), !re.eventCanceled && (a.options.removeCloneOnHide || $e.insertBefore(xe, H), a._hideClone(), Oe({
        sortable: a,
        name: "clone"
      }));
    }), !t && ze(H, s.dragClass, !0), t ? (pl = !0, a._loopId = setInterval(a._emulateDragOver, 50)) : (me(document, "mouseup", a._onDrop), me(document, "touchend", a._onDrop), me(document, "touchcancel", a._onDrop), o && (o.effectAllowed = "move", s.setData && s.setData.call(a, o, H)), fe(document, "drop", a), se(H, "transform", "translateZ(0)")), Rt = !0, a._dragStartId = cl(a._dragStarted.bind(a, t, l)), fe(document, "selectstart", a), Kt = !0, window.getSelection().removeAllRanges(), Ht && se(document.body, "user-select", "none");
  },
  // Returns true - if no further action is needed (either inserted or another condition)
  _onDragOver: function(l) {
    var t = this.el, a = l.target, o, s, v, f = this.options, m = f.group, i = re.active, n = il === m, u = f.sort, y = Ie || i, p, w = this, x = !1;
    if (Wl) return;
    function E(_, ke) {
      Me(_, w, tt({
        evt: l,
        isOwner: n,
        axis: p ? "vertical" : "horizontal",
        revert: v,
        dragRect: o,
        targetRect: s,
        canSort: u,
        fromSortable: y,
        target: a,
        completed: B,
        onMove: function(ge, h) {
          return rl($e, t, H, o, ge, De(ge), l, h);
        },
        changed: M
      }, ke));
    }
    function I() {
      E("dragOverAnimationCapture"), w.captureAnimationState(), w !== y && y.captureAnimationState();
    }
    function B(_) {
      return E("dragOverCompleted", {
        insertion: _
      }), _ && (n ? i._hideClone() : i._showClone(w), w !== y && (ze(H, Ie ? Ie.options.ghostClass : i.options.ghostClass, !1), ze(H, f.ghostClass, !0)), Ie !== w && w !== re.active ? Ie = w : w === re.active && Ie && (Ie = null), y === w && (w._ignoreWhileAnimating = a), w.animateAll(function() {
        E("dragOverAnimationComplete"), w._ignoreWhileAnimating = null;
      }), w !== y && (y.animateAll(), y._ignoreWhileAnimating = null)), (a === H && !H.animated || a === t && !a.animated) && (Pt = null), !f.dragoverBubble && !l.rootEl && a !== document && (H.parentNode[Fe]._isOutsideThisEl(l.target), !_ && gt(l)), !f.dragoverBubble && l.stopPropagation && l.stopPropagation(), x = !0;
    }
    function M() {
      Be = qe(H), vt = qe(H, f.draggable), Oe({
        sortable: w,
        name: "change",
        toEl: t,
        newIndex: Be,
        newDraggableIndex: vt,
        originalEvent: l
      });
    }
    if (l.preventDefault !== void 0 && l.cancelable && l.preventDefault(), a = Je(a, f.draggable, t, !0), E("dragOver"), re.eventCanceled) return x;
    if (H.contains(l.target) || a.animated && a.animatingX && a.animatingY || w._ignoreWhileAnimating === a)
      return B(!1);
    if (pl = !1, i && !f.disabled && (n ? u || (v = Se !== $e) : Ie === this || (this.lastPutMode = il.checkPull(this, i, H, l)) && m.checkPut(this, i, H, l))) {
      if (p = this._getDirection(l, a) === "vertical", o = De(H), E("dragOverValid"), re.eventCanceled) return x;
      if (v)
        return Se = $e, I(), this._hideClone(), E("revert"), re.eventCanceled || (Vt ? $e.insertBefore(H, Vt) : $e.appendChild(H)), B(!0);
      var R = la(t, f.draggable);
      if (!R || Cn(l, p, this) && !R.animated) {
        if (R === H)
          return B(!1);
        if (R && t === l.target && (a = R), a && (s = De(a)), rl($e, t, H, o, a, s, l, !!a) !== !1)
          return I(), R && R.nextSibling ? t.insertBefore(H, R.nextSibling) : t.appendChild(H), Se = t, M(), B(!0);
      } else if (R && xn(l, p, this)) {
        var S = zt(t, 0, f, !0);
        if (S === H)
          return B(!1);
        if (a = S, s = De(a), rl($e, t, H, o, a, s, l, !1) !== !1)
          return I(), t.insertBefore(H, S), Se = t, M(), B(!0);
      } else if (a.parentNode === t) {
        s = De(a);
        var q = 0, N, ae = H.parentNode !== t, ne = !gn(H.animated && H.toRect || o, a.animated && a.toRect || s, p), G = p ? "top" : "left", A = ka(a, "top", "top") || ka(H, "top", "top"), P = A ? A.scrollTop : void 0;
        Pt !== a && (N = s[G], Qt = !1, nl = !ne && f.invertSwap || ae), q = Sn(l, a, s, p, ne ? 1 : f.swapThreshold, f.invertedSwapThreshold == null ? f.swapThreshold : f.invertedSwapThreshold, nl, Pt === a);
        var V;
        if (q !== 0) {
          var D = qe(H);
          do
            D -= q, V = Se.children[D];
          while (V && (se(V, "display") === "none" || V === ue));
        }
        if (q === 0 || V === a)
          return B(!1);
        Pt = a, Zt = q;
        var z = a.nextElementSibling, C = !1;
        C = q === 1;
        var F = rl($e, t, H, o, a, s, l, C);
        if (F !== !1)
          return (F === 1 || F === -1) && (C = F === 1), Wl = !0, setTimeout($n, 30), I(), C && !z ? t.appendChild(H) : a.parentNode.insertBefore(H, C ? z : a), A && Ja(A, 0, P - A.scrollTop), Se = H.parentNode, N !== void 0 && !nl && (ul = Math.abs(N - De(a)[G])), M(), B(!0);
      }
      if (t.contains(H))
        return B(!1);
    }
    return !1;
  },
  _ignoreWhileAnimating: null,
  _offMoveEvents: function() {
    me(document, "mousemove", this._onTouchMove), me(document, "touchmove", this._onTouchMove), me(document, "pointermove", this._onTouchMove), me(document, "dragover", gt), me(document, "mousemove", gt), me(document, "touchmove", gt);
  },
  _offUpEvents: function() {
    var l = this.el.ownerDocument;
    me(l, "mouseup", this._onDrop), me(l, "touchend", this._onDrop), me(l, "pointerup", this._onDrop), me(l, "pointercancel", this._onDrop), me(l, "touchcancel", this._onDrop), me(document, "selectstart", this);
  },
  _onDrop: function(l) {
    var t = this.el, a = this.options;
    if (Be = qe(H), vt = qe(H, a.draggable), Me("drop", this, {
      evt: l
    }), Se = H && H.parentNode, Be = qe(H), vt = qe(H, a.draggable), re.eventCanceled) {
      this._nulling();
      return;
    }
    Rt = !1, nl = !1, Qt = !1, clearInterval(this._loopId), clearTimeout(this._dragStartTimer), Kl(this.cloneId), Kl(this._dragStartId), this.nativeDraggable && (me(document, "drop", this), me(t, "dragstart", this._onDragStart)), this._offMoveEvents(), this._offUpEvents(), Ht && se(document.body, "user-select", ""), se(H, "transform", ""), l && (Kt && (l.cancelable && l.preventDefault(), !a.dropBubble && l.stopPropagation()), ue && ue.parentNode && ue.parentNode.removeChild(ue), ($e === Se || Ie && Ie.lastPutMode !== "clone") && xe && xe.parentNode && xe.parentNode.removeChild(xe), H && (this.nativeDraggable && me(H, "dragend", this), Nl(H), H.style["will-change"] = "", Kt && !Rt && ze(H, Ie ? Ie.options.ghostClass : this.options.ghostClass, !1), ze(H, this.options.chosenClass, !1), Oe({
      sortable: this,
      name: "unchoose",
      toEl: Se,
      newIndex: null,
      newDraggableIndex: null,
      originalEvent: l
    }), $e !== Se ? (Be >= 0 && (Oe({
      rootEl: Se,
      name: "add",
      toEl: Se,
      fromEl: $e,
      originalEvent: l
    }), Oe({
      sortable: this,
      name: "remove",
      toEl: Se,
      originalEvent: l
    }), Oe({
      rootEl: Se,
      name: "sort",
      toEl: Se,
      fromEl: $e,
      originalEvent: l
    }), Oe({
      sortable: this,
      name: "sort",
      toEl: Se,
      originalEvent: l
    })), Ie && Ie.save()) : Be !== Nt && Be >= 0 && (Oe({
      sortable: this,
      name: "update",
      toEl: Se,
      originalEvent: l
    }), Oe({
      sortable: this,
      name: "sort",
      toEl: Se,
      originalEvent: l
    })), re.active && ((Be == null || Be === -1) && (Be = Nt, vt = Jt), Oe({
      sortable: this,
      name: "end",
      toEl: Se,
      originalEvent: l
    }), this.save()))), this._nulling();
  },
  _nulling: function() {
    Me("nulling", this), $e = H = Se = ue = Vt = xe = dl = mt = yt = Xe = Kt = Be = vt = Nt = Jt = Pt = Zt = Ie = il = re.dragged = re.ghost = re.clone = re.active = null;
    var l = this.el;
    hl.forEach(function(t) {
      l.contains(t) && (t.checked = !0);
    }), hl.length = Pl = Rl = 0;
  },
  handleEvent: function(l) {
    switch (l.type) {
      case "drop":
      case "dragend":
        this._onDrop(l);
        break;
      case "dragenter":
      case "dragover":
        H && (this._onDragOver(l), Vn(l));
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
      var f = o.children[v];
      Je(f, this.options.draggable, o, !1) && (a[s] = f);
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
    var o = tl.modifyOption(this, l, t);
    typeof o < "u" ? a[l] = o : a[l] = t, l === "group" && to(a);
  },
  /**
   * Destroy
   */
  destroy: function() {
    Me("destroy", this);
    var l = this.el;
    l[Fe] = null, me(l, "mousedown", this._onTapStart), me(l, "touchstart", this._onTapStart), me(l, "pointerdown", this._onTapStart), this.nativeDraggable && (me(l, "dragover", this), me(l, "dragenter", this)), Array.prototype.forEach.call(l.querySelectorAll("[draggable]"), function(t) {
      t.removeAttribute("draggable");
    }), this._onDrop(), this._disableDelayedDragEvents(), bl.splice(bl.indexOf(this.el), 1), this.el = l = null;
  },
  _hideClone: function() {
    if (!mt) {
      if (Me("hideClone", this), re.eventCanceled) return;
      se(xe, "display", "none"), this.options.removeCloneOnHide && xe.parentNode && xe.parentNode.removeChild(xe), mt = !0;
    }
  },
  _showClone: function(l) {
    if (l.lastPutMode !== "clone") {
      this._hideClone();
      return;
    }
    if (mt) {
      if (Me("showClone", this), re.eventCanceled) return;
      H.parentNode == $e && !this.options.group.revertClone ? $e.insertBefore(xe, H) : Vt ? $e.insertBefore(xe, Vt) : $e.appendChild(xe), this.options.group.revertClone && this.animate(H, xe), se(xe, "display", ""), mt = !1;
    }
  }
};
function Vn(e) {
  e.dataTransfer && (e.dataTransfer.dropEffect = "move"), e.cancelable && e.preventDefault();
}
function rl(e, l, t, a, o, s, v, f) {
  var m, i = e[Fe], n = i.options.onMove, u;
  return window.CustomEvent && !st && !el ? m = new CustomEvent("move", {
    bubbles: !0,
    cancelable: !0
  }) : (m = document.createEvent("Event"), m.initEvent("move", !0, !0)), m.to = l, m.from = e, m.dragged = t, m.draggedRect = a, m.related = o || l, m.relatedRect = s || De(l), m.willInsertAfter = f, m.originalEvent = v, e.dispatchEvent(m), n && (u = n.call(i, m, v)), u;
}
function Nl(e) {
  e.draggable = !1;
}
function $n() {
  Wl = !1;
}
function xn(e, l, t) {
  var a = De(zt(t.el, 0, t.options, !0)), o = Qa(t.el, t.options, ue), s = 10;
  return l ? e.clientX < o.left - s || e.clientY < a.top && e.clientX < a.right : e.clientY < o.top - s || e.clientY < a.bottom && e.clientX < a.left;
}
function Cn(e, l, t) {
  var a = De(la(t.el, t.options.draggable)), o = Qa(t.el, t.options, ue), s = 10;
  return l ? e.clientX > o.right + s || e.clientY > a.bottom && e.clientX > a.left : e.clientY > o.bottom + s || e.clientX > a.right && e.clientY > a.top;
}
function Sn(e, l, t, a, o, s, v, f) {
  var m = a ? e.clientY : e.clientX, i = a ? t.height : t.width, n = a ? t.top : t.left, u = a ? t.bottom : t.right, y = !1;
  if (!v) {
    if (f && ul < i * o) {
      if (!Qt && (Zt === 1 ? m > n + i * s / 2 : m < u - i * s / 2) && (Qt = !0), Qt)
        y = !0;
      else if (Zt === 1 ? m < n + ul : m > u - ul)
        return -Zt;
    } else if (m > n + i * (1 - o) / 2 && m < u - i * (1 - o) / 2)
      return Tn(l);
  }
  return y = y || v, y && (m < n + i * s / 2 || m > u - i * s / 2) ? m > n + i / 2 ? 1 : -1 : 0;
}
function Tn(e) {
  return qe(H) < qe(e) ? 1 : -1;
}
function En(e) {
  for (var l = e.tagName + e.className + e.src + e.href + e.textContent, t = l.length, a = 0; t--; )
    a += l.charCodeAt(t);
  return a.toString(36);
}
function Un(e) {
  hl.length = 0;
  for (var l = e.getElementsByTagName("input"), t = l.length; t--; ) {
    var a = l[t];
    a.checked && hl.push(a);
  }
}
function cl(e) {
  return setTimeout(e, 0);
}
function Kl(e) {
  return clearTimeout(e);
}
xl && fe(document, "touchmove", function(e) {
  (re.active || Rt) && e.cancelable && e.preventDefault();
});
re.utils = {
  on: fe,
  off: me,
  css: se,
  find: Ha,
  is: function(l, t) {
    return !!Je(l, t, l, !1);
  },
  extend: cn,
  throttle: Xa,
  closest: Je,
  toggleClass: ze,
  clone: Za,
  index: qe,
  nextTick: cl,
  cancelNextTick: Kl,
  detectDirection: eo,
  getChild: zt,
  expando: Fe
};
re.get = function(e) {
  return e[Fe];
};
re.mount = function() {
  for (var e = arguments.length, l = new Array(e), t = 0; t < e; t++)
    l[t] = arguments[t];
  l[0].constructor === Array && (l = l[0]), l.forEach(function(a) {
    if (!a.prototype || !a.prototype.constructor)
      throw "Sortable: Mounted plugin must be a constructor function, not ".concat({}.toString.call(a));
    a.utils && (re.utils = tt(tt({}, re.utils), a.utils)), tl.mount(a);
  });
};
re.create = function(e, l) {
  return new re(e, l);
};
re.version = dn;
var Ue = [], Gt, Gl, Yl = !1, Ml, Fl, yl, Yt;
function Dn() {
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
      this.sortable.nativeDraggable ? fe(document, "dragover", this._handleAutoScroll) : this.options.supportPointer ? fe(document, "pointermove", this._handleFallbackAutoScroll) : a.touches ? fe(document, "touchmove", this._handleFallbackAutoScroll) : fe(document, "mousemove", this._handleFallbackAutoScroll);
    },
    dragOverCompleted: function(t) {
      var a = t.originalEvent;
      !this.options.dragOverBubble && !a.rootEl && this._handleAutoScroll(a);
    },
    drop: function() {
      this.sortable.nativeDraggable ? me(document, "dragover", this._handleAutoScroll) : (me(document, "pointermove", this._handleFallbackAutoScroll), me(document, "touchmove", this._handleFallbackAutoScroll), me(document, "mousemove", this._handleFallbackAutoScroll)), Ca(), vl(), vn();
    },
    nulling: function() {
      yl = Gl = Gt = Yl = Yt = Ml = Fl = null, Ue.length = 0;
    },
    _handleFallbackAutoScroll: function(t) {
      this._handleAutoScroll(t, !0);
    },
    _handleAutoScroll: function(t, a) {
      var o = this, s = (t.touches ? t.touches[0] : t).clientX, v = (t.touches ? t.touches[0] : t).clientY, f = document.elementFromPoint(s, v);
      if (yl = t, a || this.options.forceAutoScrollFallback || el || st || Ht) {
        Ll(t, this.options, f, a);
        var m = ft(f, !0);
        Yl && (!Yt || s !== Ml || v !== Fl) && (Yt && Ca(), Yt = setInterval(function() {
          var i = ft(document.elementFromPoint(s, v), !0);
          i !== m && (m = i, vl()), Ll(t, o.options, i, a);
        }, 10), Ml = s, Fl = v);
      } else {
        if (!this.options.bubbleScroll || ft(f, !0) === et()) {
          vl();
          return;
        }
        Ll(t, this.options, ft(f, !1), !1);
      }
    }
  }, it(e, {
    pluginName: "scroll",
    initializeByDefault: !0
  });
}
function vl() {
  Ue.forEach(function(e) {
    clearInterval(e.pid);
  }), Ue = [];
}
function Ca() {
  clearInterval(Yt);
}
var Ll = Xa(function(e, l, t, a) {
  if (l.scroll) {
    var o = (e.touches ? e.touches[0] : e).clientX, s = (e.touches ? e.touches[0] : e).clientY, v = l.scrollSensitivity, f = l.scrollSpeed, m = et(), i = !1, n;
    Gl !== t && (Gl = t, vl(), Gt = l.scroll, n = l.scrollFn, Gt === !0 && (Gt = ft(t, !0)));
    var u = 0, y = Gt;
    do {
      var p = y, w = De(p), x = w.top, E = w.bottom, I = w.left, B = w.right, M = w.width, R = w.height, S = void 0, q = void 0, N = p.scrollWidth, ae = p.scrollHeight, ne = se(p), G = p.scrollLeft, A = p.scrollTop;
      p === m ? (S = M < N && (ne.overflowX === "auto" || ne.overflowX === "scroll" || ne.overflowX === "visible"), q = R < ae && (ne.overflowY === "auto" || ne.overflowY === "scroll" || ne.overflowY === "visible")) : (S = M < N && (ne.overflowX === "auto" || ne.overflowX === "scroll"), q = R < ae && (ne.overflowY === "auto" || ne.overflowY === "scroll"));
      var P = S && (Math.abs(B - o) <= v && G + M < N) - (Math.abs(I - o) <= v && !!G), V = q && (Math.abs(E - s) <= v && A + R < ae) - (Math.abs(x - s) <= v && !!A);
      if (!Ue[u])
        for (var D = 0; D <= u; D++)
          Ue[D] || (Ue[D] = {});
      (Ue[u].vx != P || Ue[u].vy != V || Ue[u].el !== p) && (Ue[u].el = p, Ue[u].vx = P, Ue[u].vy = V, clearInterval(Ue[u].pid), (P != 0 || V != 0) && (i = !0, Ue[u].pid = setInterval(function() {
        a && this.layer === 0 && re.active._onTouchMove(yl);
        var z = Ue[this.layer].vy ? Ue[this.layer].vy * f : 0, C = Ue[this.layer].vx ? Ue[this.layer].vx * f : 0;
        typeof n == "function" && n.call(re.dragged.parentNode[Fe], C, z, e, yl, Ue[this.layer].el) !== "continue" || Ja(Ue[this.layer].el, C, z);
      }.bind({
        layer: u
      }), 24))), u++;
    } while (l.bubbleScroll && y !== m && (y = ft(y, !1)));
    Yl = i;
  }
}, 30), oo = function(l) {
  var t = l.originalEvent, a = l.putSortable, o = l.dragEl, s = l.activeSortable, v = l.dispatchSortableEvent, f = l.hideGhostForTarget, m = l.unhideGhostForTarget;
  if (t) {
    var i = a || s;
    f();
    var n = t.changedTouches && t.changedTouches.length ? t.changedTouches[0] : t, u = document.elementFromPoint(n.clientX, n.clientY);
    m(), i && !i.el.contains(u) && (v("spill"), this.onSpill({
      dragEl: o,
      putSortable: a
    }));
  }
};
function aa() {
}
aa.prototype = {
  startIndex: null,
  dragStart: function(l) {
    var t = l.oldDraggableIndex;
    this.startIndex = t;
  },
  onSpill: function(l) {
    var t = l.dragEl, a = l.putSortable;
    this.sortable.captureAnimationState(), a && a.captureAnimationState();
    var o = zt(this.sortable.el, this.startIndex, this.options);
    o ? this.sortable.el.insertBefore(t, o) : this.sortable.el.appendChild(t), this.sortable.animateAll(), a && a.animateAll();
  },
  drop: oo
};
it(aa, {
  pluginName: "revertOnSpill"
});
function oa() {
}
oa.prototype = {
  onSpill: function(l) {
    var t = l.dragEl, a = l.putSortable, o = a || this.sortable;
    o.captureAnimationState(), t.parentNode && t.parentNode.removeChild(t), o.animateAll();
  },
  drop: oo
};
it(oa, {
  pluginName: "removeOnSpill"
});
re.mount(new Dn());
re.mount(oa, aa);
function In(e, l) {
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
      l.set(a, new re(o, {
        draggable: ".work-reorder-entry",
        handle: ".work-reorder-handle",
        forceFallback: !0,
        fallbackOnBody: !1,
        ghostClass: "work-drag-ghost",
        onEnd(s) {
          const v = s.oldDraggableIndex, f = s.newDraggableIndex;
          In(s, ".work-reorder-entry"), v !== void 0 && f !== void 0 && v !== f && e(v, f);
        }
      }));
    },
    unmounted: t
  };
}
const An = { class: "work-stack work-tight work-option-builder" }, Pn = { class: "work-stack work-tight" }, Rn = { class: "work-stack work-tight work-small" }, On = { class: "work-stack work-tight work-small" }, Nn = { class: "work-stack work-tight" }, Mn = { class: "work-stack work-tight work-small" }, Fn = { class: "work-row" }, Ln = { class: "work-stack work-tight work-small" }, zn = { class: "work-row" }, Bn = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, jn = { class: "work-add-option" }, qn = {
  key: 0,
  class: "work-muted work-small"
}, Wn = /* @__PURE__ */ ve({
  __name: "OptionsEditor",
  props: {
    field: {}
  },
  emits: ["validity"],
  setup(e, { emit: l }) {
    const t = e, a = l, o = "options:" + Xl(), s = X(() => t.field.options ?? []), v = X(() => s.value.every((u, y) => !!u.id && s.value.findIndex((p) => p.id === u.id) === y));
    Ce(v, (u) => a("validity", u, o), { immediate: !0 }), nt(() => a("validity", !0, o));
    function f(u, y) {
      Fa(s.value, u, y - u), s.value.forEach((p, w) => p.order = w);
    }
    const m = io(f), i = ["primary", "success", "info", "warn", "danger", "secondary"];
    function n() {
      let u = s.value.length + 1;
      for (; s.value.some((y) => y.id === `option_${u}`); ) u++;
      (t.field.options ??= []).push({ id: `option_${u}`, label: "New option", order: s.value.length });
    }
    return (u, y) => (c(), g("section", An, [
      y[4] || (y[4] = d("header", { class: "work-row" }, [
        d("h4", null, "Options"),
        d("span", { class: "work-muted work-small" }, "Stable IDs keep existing values when labels change."),
        d("span", { class: "work-spacer" })
      ], -1)),
      Qe((c(), g("div", Pn, [
        (c(!0), g(Q, null, oe(s.value, (p, w) => (c(), g("div", {
          key: w,
          class: "work-option-row work-reorder-entry"
        }, [
          b(r(J), {
            type: "button",
            class: "work-icon-button work-reorder-handle",
            "aria-label": "Drag option; arrow keys reorder",
            onKeydown: [
              Ae(he((x) => f(w, w - 1), ["prevent"]), ["up"]),
              Ae(he((x) => f(w, w + 1), ["prevent"]), ["down"])
            ],
            severity: "secondary",
            text: "",
            size: "small"
          }, {
            default: L(() => [
              b(r(ee), {
                icon: "tabler:grip-vertical",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["onKeydown"]),
          d("label", Rn, [
            y[0] || (y[0] = O("Label", -1)),
            b(r(ce), {
              modelValue: p.label,
              "onUpdate:modelValue": (x) => p.label = x,
              "aria-label": "Option label"
            }, null, 8, ["modelValue", "onUpdate:modelValue"])
          ]),
          d("label", On, [
            y[1] || (y[1] = O("ID", -1)),
            b(r(ce), {
              modelValue: p.id,
              "onUpdate:modelValue": (x) => p.id = x,
              class: "work-option-code",
              required: "",
              "aria-label": "Option ID"
            }, null, 8, ["modelValue", "onUpdate:modelValue"])
          ]),
          d("div", Nn, [
            d("label", Mn, [
              y[2] || (y[2] = O("Color", -1)),
              d("span", Fn, [
                d("span", {
                  class: pt(["work-color-swatch", "work-swatch-" + (p.color || "secondary")]),
                  "aria-hidden": "true"
                }, null, 2),
                b(r(ie), {
                  modelValue: p.color,
                  "onUpdate:modelValue": (x) => p.color = x,
                  "aria-label": "Option color",
                  appendTo: "self",
                  optionLabel: "label",
                  optionValue: "value",
                  optionDisabled: "disabled",
                  options: [{ label: "Default", value: void 0, disabled: !1 }, ...(i ?? []).map((x) => ({ label: x, value: x, disabled: !1 }))]
                }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
              ])
            ]),
            d("label", Ln, [
              y[3] || (y[3] = O("Category", -1)),
              b(r(ie), {
                "model-value": p.category,
                "aria-label": "Option category",
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                showClear: "",
                options: ["triage", "backlog", ...r(Ma)].map((x) => ({ label: r(Zl)(x), value: x })),
                "onUpdate:modelValue": (x) => p.category = x || void 0
              }, null, 8, ["model-value", "options", "onUpdate:modelValue"])
            ])
          ]),
          d("div", zn, [
            b(r(J), {
              "aria-label": "Option earlier",
              severity: "secondary",
              size: "small",
              disabled: w === 0,
              onClick: (x) => f(w, w - 1),
              text: ""
            }, {
              default: L(() => [
                b(r(ee), {
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
              disabled: w === s.value.length - 1,
              onClick: (x) => f(w, w + 1),
              text: ""
            }, {
              default: L(() => [
                b(r(ee), {
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
              onClick: (x) => s.value.splice(w, 1)
            }, {
              icon: L(() => [
                b(r(ee), {
                  icon: "tabler:trash",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["onClick"])
          ])
        ]))), 128)),
        v.value ? T("", !0) : (c(), g("p", Bn, "Option IDs must be nonempty and unique.")),
        d("div", jn, [
          b(r(J), {
            label: "Add option",
            severity: "secondary",
            size: "small",
            onClick: n,
            outlined: ""
          }, {
            icon: L(() => [
              b(r(ee), {
                icon: "tabler:plus",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          })
        ])
      ])), [
        [r(m)]
      ]),
      s.value.length ? T("", !0) : (c(), g("p", qn, "Add the choices people can select for this field."))
    ]));
  }
});
function ia(e) {
  return Object.entries(Ke(e.properties)).map(([l, t]) => {
    const a = Ke(t);
    return { key: l, title: typeof a.title == "string" && a.title.trim() ? a.title : Ve(l), description: typeof a.description == "string" ? a.description : "", schema: a };
  });
}
const no = (e) => e.type === "array" && Ke(e.items).type === "string";
function Kn(e, l) {
  const t = {};
  for (const a of ia(e)) {
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
        const f = Ke(s.items);
        o.some((m) => typeof m != "string" || typeof f.minLength == "number" && m.length < f.minLength || typeof f.maxLength == "number" && m.length > f.maxLength) && (v = "Each entry must match the declared text length.");
      }
    } else s.type === "object" && (typeof o != "object" || Array.isArray(o)) && (v = "Enter an object.");
    v && (t[a.key] = v);
  }
  return t;
}
const Gn = { class: "work-stack" }, Yn = ["schema", "config"], Hn = {
  key: 1,
  role: "status",
  class: "work-muted work-small"
}, Xn = {
  key: 2,
  role: "alert",
  class: "kx-err"
}, Jn = { class: "work-config-fields" }, Zn = ["for"], Qn = {
  key: 1,
  class: "work-config-chips"
}, _n = {
  key: 6,
  class: "work-muted work-small"
}, es = {
  key: 7,
  role: "alert",
  class: "work-error work-small"
}, na = /* @__PURE__ */ ve({
  __name: "ConfigForm",
  props: {
    schema: {},
    modelValue: {},
    disabled: { type: Boolean }
  },
  emits: ["update:modelValue", "validity"],
  setup(e, { emit: l }) {
    const t = e, a = l, o = j({}), s = j(/* @__PURE__ */ new Set()), v = j(!1), f = j(!1), m = X(() => ia(t.schema)), i = X(() => Kn(t.schema, t.modelValue)), n = X(() => m.value.filter((S) => typeof S.schema.picker == "string")), u = X(() => m.value.filter((S) => typeof S.schema.picker != "string")), y = X(() => ({ ...t.schema, properties: Object.fromEntries(n.value.map((S) => [S.key, { ...S.schema, title: S.title }])), required: Array.isArray(t.schema.required) ? t.schema.required.filter((S) => n.value.some((q) => q.key === S)) : [] })), p = X(() => Object.fromEntries(n.value.map((S) => [S.key, t.modelValue[S.key]]))), w = X(() => !Object.keys(i.value).length && !s.value.size && (!n.value.length || v.value));
    Ce(w, (S) => a("validity", S), { immediate: !0 });
    async function x() {
      f.value = !0, v.value = await lt("wc-schema-form"), f.value = !1;
    }
    Ce(() => n.value.length > 0, (S) => {
      S && x();
    }, { immediate: !0 }), nt(() => a("validity", !0));
    function E(S, q) {
      const N = { ...t.modelValue };
      q == null ? delete N[S] : N[S] = q, a("update:modelValue", N);
    }
    function I(S) {
      const q = t.modelValue[S];
      return Array.isArray(q) ? q.filter((N) => typeof N == "string") : [];
    }
    function B(S) {
      const q = o.value[S]?.trim();
      q && (E(S, [...I(S), q]), o.value[S] = "");
    }
    function M(S, q) {
      q ? s.value.delete(S) : s.value.add(S);
    }
    function R(S) {
      a("update:modelValue", { ...t.modelValue, ...Ke(S.detail) });
    }
    return (S, q) => (c(), g("div", Gn, [
      n.value.length && v.value ? (c(), g("wc-schema-form", {
        key: 0,
        class: "work-config-widget",
        schema: JSON.stringify(y.value),
        config: JSON.stringify(p.value),
        onConfigChanged: R
      }, null, 40, Yn)) : n.value.length && f.value ? (c(), g("p", Hn, "The configuration widget is loading.")) : n.value.length ? (c(), g("p", Xn, [
        q[0] || (q[0] = O("The configuration widget is unavailable.", -1)),
        b(r(J), {
          label: "Reload configuration widget",
          severity: "secondary",
          outlined: "",
          onClick: x
        })
      ])) : T("", !0),
      d("div", Jn, [
        (c(!0), g(Q, null, oe(u.value, (N) => (c(), g("div", {
          key: N.key,
          class: "work-config-field"
        }, [
          d("label", {
            class: "work-config-label",
            for: "config-" + N.key
          }, U(N.title), 9, Zn),
          Array.isArray(N.schema.enum) ? (c(), W(r(ie), {
            key: 0,
            "input-id": "config-" + N.key,
            "model-value": e.modelValue[N.key] ?? N.schema.default,
            options: N.schema.enum,
            appendTo: "self",
            "aria-label": N.title,
            disabled: e.disabled,
            "onUpdate:modelValue": (ae) => E(N.key, ae)
          }, null, 8, ["input-id", "model-value", "options", "aria-label", "disabled", "onUpdate:modelValue"])) : r(no)(N.schema) ? (c(), g("div", Qn, [
            (c(!0), g(Q, null, oe(I(N.key), (ae, ne) => (c(), W(r(zo), {
              key: ne,
              label: ae,
              removable: !e.disabled,
              onRemove: (G) => E(N.key, I(N.key).filter((A, P) => P !== ne))
            }, null, 8, ["label", "removable", "onRemove"]))), 128)),
            b(r(ce), {
              id: "config-" + N.key,
              modelValue: o.value[N.key],
              "onUpdate:modelValue": (ae) => o.value[N.key] = ae,
              "aria-label": "Add " + N.title.toLocaleLowerCase(),
              disabled: e.disabled,
              placeholder: "Type and press Enter",
              onKeydown: Ae(he((ae) => B(N.key), ["stop", "prevent"]), ["enter"]),
              onBlur: (ae) => B(N.key)
            }, null, 8, ["id", "modelValue", "onUpdate:modelValue", "aria-label", "disabled", "onKeydown", "onBlur"])
          ])) : ["integer", "number"].includes(String(N.schema.type)) ? (c(), W(r(Ge), {
            key: 2,
            "input-id": "config-" + N.key,
            "model-value": e.modelValue[N.key] ?? N.schema.default,
            "max-fraction-digits": N.schema.type === "integer" ? 0 : 8,
            "use-grouping": !1,
            "aria-label": N.title,
            disabled: e.disabled,
            invalid: !!i.value[N.key],
            "onUpdate:modelValue": (ae) => E(N.key, ae)
          }, null, 8, ["input-id", "model-value", "max-fraction-digits", "aria-label", "disabled", "invalid", "onUpdate:modelValue"])) : N.schema.type === "boolean" ? (c(), W(r(Le), {
            key: 3,
            "input-id": "config-" + N.key,
            "model-value": !!(e.modelValue[N.key] ?? N.schema.default),
            "aria-label": N.title,
            disabled: e.disabled,
            "onUpdate:modelValue": (ae) => E(N.key, ae)
          }, null, 8, ["input-id", "model-value", "aria-label", "disabled", "onUpdate:modelValue"])) : ["array", "object"].includes(String(N.schema.type)) ? (c(), W(ot, {
            key: 4,
            label: N.title,
            "model-value": e.modelValue[N.key],
            shape: N.schema.type === "array" ? "array" : "object",
            example: N.schema.default ?? (N.schema.type === "array" ? [] : {}),
            "onUpdate:modelValue": (ae) => E(N.key, ae),
            onValidity: (ae) => M(N.key, ae)
          }, null, 8, ["label", "model-value", "shape", "example", "onUpdate:modelValue", "onValidity"])) : (c(), W(r(ce), {
            key: 5,
            id: "config-" + N.key,
            "model-value": e.modelValue[N.key] ?? N.schema.default ?? "",
            disabled: e.disabled,
            invalid: !!i.value[N.key],
            "aria-label": N.title,
            "onUpdate:modelValue": (ae) => E(N.key, ae)
          }, null, 8, ["id", "model-value", "disabled", "invalid", "aria-label", "onUpdate:modelValue"])),
          N.description ? (c(), g("p", _n, U(N.description), 1)) : T("", !0),
          i.value[N.key] ? (c(), g("p", es, U(i.value[N.key]), 1)) : T("", !0)
        ]))), 128))
      ])
    ]));
  }
}), ts = {
  class: "work-stack",
  "aria-label": "Fields editor"
}, ls = { class: "work-section-heading" }, as = {
  key: 0,
  class: "work-used-by"
}, os = { class: "kx-tag-sm" }, is = { class: "work-small work-muted" }, ns = {
  key: 0,
  class: "work-error work-small",
  role: "alert"
}, ss = { class: "work-settings-grid work-field-properties" }, rs = { class: "work-stack work-tight" }, ds = { class: "work-stack work-tight" }, us = { class: "work-stack work-tight" }, cs = { class: "work-stack work-tight" }, vs = { class: "work-stack work-tight" }, ms = { class: "work-stack work-tight work-field-history" }, fs = { class: "work-settings-list" }, ps = { class: "work-settings-row" }, bs = { class: "work-settings-row" }, hs = {
  key: 3,
  class: "work-stack work-tight"
}, ys = {
  key: 4,
  class: "work-stack work-tight"
}, gs = { class: "work-stack work-tight" }, ks = { class: "work-stack work-tight" }, ws = { class: "work-stack work-tight" }, Vs = { class: "work-stack work-tight" }, $s = { class: "work-stack" }, xs = { class: "work-row work-add-definition" }, Cs = { class: "work-stack work-tight" }, Ss = /* @__PURE__ */ ve({
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
    const t = e, a = l, o = X(() => t.draft.fields ?? []), s = j(""), v = j(""), f = j({}), m = io((P, V) => ne(P, V - P));
    function i(P) {
      return (t.draft.item_types ?? []).filter((V) => V.fields.includes(P)).map((V) => V.title || Ve(V.id));
    }
    async function n(P) {
      if (!v.value) {
        v.value = P.code;
        try {
          const V = await t.guardRemoval?.("fields", P.code);
          f.value[P.code] = V ?? "", V || _t(t.draft, "fields", P.code);
        } finally {
          v.value = "";
        }
      }
    }
    const u = Object.entries({ text: "Text", int: "Whole number", dec: "Decimal number", quantity: "Measurement", bool: "Yes or no", time: "Date or time", ref: "Reference", record: "Structured data", option: "Choice", principal: "Person or group", item: "Work item", rank: "Order", rich_text: "Formatted text", formula: "Formula", rollup: "Related item calculation", counter: "Counter" }).map(([P, V]) => ({ value: P, label: V })), y = [{ label: "None", value: "none" }, { label: "Exact matches", value: "key" }, { label: "Numeric ranges", value: "number" }], p = ["int", "dec", "quantity"], w = X(() => new Map(t.installedTypes?.map((P) => [P.id, P]))), x = X(() => [...u, ...(t.installedTypes ?? []).map((P) => ({ value: P.id, label: P.title }))]), E = {};
    function I(P) {
      return P.type && P.type !== "value" ? P.type : P.form ?? "text";
    }
    function B(P) {
      return P.type ? w.value.get(P.type) : void 0;
    }
    function M(P) {
      const V = B(P)?.config_schema;
      return V && ia(V).length ? V : void 0;
    }
    function R(P) {
      const V = B(P);
      return !!V?.config_schema || ["dec", "quantity", "ref", "time", "record"].includes(V?.form ?? P.form ?? "") || !!P.config;
    }
    function S(P) {
      const V = B(P), D = V?.form ?? P.form ?? "text";
      return y.filter(({ value: z }) => z === "none" || (!V?.indexes || V.indexes.includes(z)) && D !== "record" && (z !== "number" || p.includes(D) || P.type === "option"));
    }
    function q(P) {
      P.index && !S(P).some((V) => V.value === P.index) && delete P.index;
    }
    function N(P, V) {
      const D = w.value.get(V);
      if (D) {
        if (D.id === P.type) return;
        P.type = D.id, P.form = D.form, delete P.options, delete P.config, q(P);
        return;
      }
      B(P) && delete P.config;
      const z = { option: "text", principal: "ref", item: "ref", rank: "text", rich_text: "text", formula: "int", rollup: "int", counter: "int" };
      z[V] ? (P.type = V, P.form = z[V]) : (delete P.type, P.form = V), V !== "option" ? delete P.options : P.options ??= [], V === "rich_text" && (P.config = { format: "json" }), q(P);
    }
    function ae(P, V) {
      P.form = V, q(P);
    }
    function ne(P, V) {
      Fa(o.value, P, V);
      for (const D of t.draft.item_types ?? []) {
        const z = new Set(D.fields);
        D.fields = o.value.filter((C) => z.has(C.code)).map((C) => C.code);
      }
    }
    function G(P, V) {
      try {
        xo(t.draft, P, V.value), delete f.value[P.code];
      } catch (D) {
        f.value[P.code] = D.message, V.value = P.code;
      }
    }
    function A() {
      !/^[a-z][a-z0-9_]*$/.test(s.value) || o.value.some((P) => P.code === s.value) || ((t.draft.fields ??= []).push({ code: s.value, form: "text", cardinality: "one" }), s.value = "");
    }
    return (P, V) => (c(), g("section", ts, [
      d("header", ls, [
        V[2] || (V[2] = d("div", null, [
          d("h2", null, "Fields"),
          d("p", { class: "work-muted work-small" }, "Shape the information each item carries. Drag the handle or use the arrows to arrange fields.")
        ], -1)),
        b(r(Re), {
          class: "kx-tag-sm",
          severity: "secondary"
        }, {
          default: L(() => [
            O(U(o.value.length) + " " + U(o.value.length === 1 ? "field" : "fields"), 1)
          ]),
          _: 1
        })
      ]),
      Qe((c(), W($l, {
        columns: "fields",
        count: o.value.length
      }, {
        default: L(() => [
          (c(!0), g(Q, null, oe(o.value, (D, z) => (c(), W(Vl, {
            title: r(_e)(D),
            code: D.code,
            kind: B(D)?.title || r(u).find((C) => C.value === I(D))?.label || r(Ve)(I(D)),
            key: D.id ?? z,
            class: "work-field-row work-reorder-entry work-stack"
          }, {
            handle: L(() => [
              b(r(J), {
                type: "button",
                class: "work-reorder-handle work-icon-button",
                "aria-label": "Drag " + r(_e)(D) + " or use the arrow keys to reorder",
                onKeydown: [
                  Ae(he((C) => ne(z, -1), ["prevent"]), ["up"]),
                  Ae(he((C) => ne(z, 1), ["prevent"]), ["down"])
                ],
                severity: "secondary",
                text: "",
                size: "small"
              }, {
                default: L(() => [
                  b(r(ee), {
                    icon: "tabler:grip-vertical",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["aria-label", "onKeydown"])
            ]),
            flags: L(() => [
              D.track ? (c(), W(r(Re), {
                key: 0,
                class: "kx-tag-sm",
                severity: "secondary",
                value: "Tracked"
              })) : T("", !0),
              D.intervals ? (c(), W(r(Re), {
                key: 1,
                class: "kx-tag-sm",
                severity: "secondary",
                value: "Intervals"
              })) : T("", !0)
            ]),
            usage: L(() => [
              i(D.code).length ? (c(), g("details", as, [
                d("summary", os, "Used by " + U(i(D.code).length) + " " + U(i(D.code).length === 1 ? "type" : "types"), 1),
                d("span", is, U(i(D.code).join(", ")), 1)
              ])) : T("", !0)
            ]),
            actions: L(() => [
              b(r(J), {
                "aria-label": "Move " + r(_e)(D) + " earlier",
                severity: "secondary",
                disabled: z === 0,
                onClick: (C) => ne(z, -1),
                text: "",
                size: "small"
              }, {
                default: L(() => [
                  b(r(ee), {
                    icon: "tabler:arrow-up",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["aria-label", "disabled", "onClick"]),
              b(r(J), {
                "aria-label": "Move " + r(_e)(D) + " later",
                severity: "secondary",
                disabled: z === o.value.length - 1,
                onClick: (C) => ne(z, 1),
                text: "",
                size: "small"
              }, {
                default: L(() => [
                  b(r(ee), {
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
                disabled: !!v.value,
                onClick: (C) => n(D),
                "aria-label": "Remove field"
              }, {
                default: L(() => [
                  b(r(ee), {
                    icon: "tabler:trash",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["disabled", "onClick"])
            ]),
            default: L(() => [
              f.value[D.code] ? (c(), g("p", ns, U(f.value[D.code]), 1)) : T("", !0),
              (c(!0), g(Q, null, oe(e.issues?.filter((C) => C.code === D.code) ?? [], (C) => (c(), g("p", {
                key: C.what,
                class: "work-error work-small",
                role: "alert"
              }, U(r(wl)(C)) + " · " + U(C.what), 1))), 128)),
              d("div", ss, [
                d("label", rs, [
                  V[3] || (V[3] = O("Title", -1)),
                  b(r(ce), {
                    modelValue: D.title,
                    "onUpdate:modelValue": (C) => D.title = C,
                    "aria-label": "Field title",
                    maxlength: "255",
                    placeholder: r(_e)(D)
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder"])
                ]),
                d("label", ds, [
                  V[4] || (V[4] = O("Field identifier", -1)),
                  b(r(ce), {
                    value: D.code,
                    "aria-label": "Field code",
                    required: "",
                    pattern: "[a-z][a-z0-9_]*",
                    onInput: (C) => G(D, C.target)
                  }, null, 8, ["value", "onInput"])
                ]),
                d("label", us, [
                  V[5] || (V[5] = O("Kind", -1)),
                  b(r(ie), {
                    "aria-label": "Kind",
                    "model-value": I(D),
                    "onUpdate:modelValue": (C) => N(D, C),
                    appendTo: "self",
                    options: x.value,
                    optionLabel: "label",
                    optionValue: "value"
                  }, null, 8, ["model-value", "onUpdate:modelValue", "options"])
                ]),
                d("label", cs, [
                  V[6] || (V[6] = O("Values allowed", -1)),
                  b(r(ie), {
                    "aria-label": "Values allowed",
                    "model-value": D.cardinality ?? "one",
                    "onUpdate:modelValue": (C) => D.cardinality = C,
                    appendTo: "self",
                    options: [{ label: "One value", value: "one" }, { label: "Multiple unique values", value: "set" }, { label: "Ordered values", value: "list" }],
                    optionLabel: "label",
                    optionValue: "value"
                  }, null, 8, ["model-value", "onUpdate:modelValue"])
                ]),
                d("label", vs, [
                  V[7] || (V[7] = O("Search support", -1)),
                  b(r(ie), {
                    "aria-label": "Search support",
                    "model-value": D.index ?? "none",
                    "onUpdate:modelValue": (C) => D.index = C,
                    appendTo: "self",
                    options: S(D),
                    optionLabel: "label",
                    optionValue: "value"
                  }, null, 8, ["model-value", "onUpdate:modelValue", "options"])
                ])
              ]),
              M(D) ? (c(), W(na, {
                key: D.type,
                schema: M(D),
                "model-value": D.config ?? E,
                "onUpdate:modelValue": (C) => D.config = C,
                onValidity: (C) => a("validity", "config-" + z, C)
              }, null, 8, ["schema", "model-value", "onUpdate:modelValue", "onValidity"])) : T("", !0),
              d("section", ms, [
                V[10] || (V[10] = d("h4", { class: "work-group-title" }, "History", -1)),
                d("div", fs, [
                  d("div", ps, [
                    V[8] || (V[8] = d("div", { class: "work-row-main" }, [
                      d("strong", null, "Track changes"),
                      d("p", { class: "work-muted work-small" }, "Record each value change in the item history.")
                    ], -1)),
                    b(r(Le), {
                      modelValue: D.track,
                      "onUpdate:modelValue": (C) => D.track = C,
                      "aria-label": "Track changes"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ]),
                  d("div", bs, [
                    V[9] || (V[9] = d("div", { class: "work-row-main" }, [
                      d("strong", null, "Track intervals"),
                      d("p", { class: "work-muted work-small" }, "Measure how long each value stays in effect.")
                    ], -1)),
                    b(r(Le), {
                      modelValue: D.intervals,
                      "onUpdate:modelValue": (C) => D.intervals = C,
                      "aria-label": "Track intervals"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ])
                ])
              ]),
              D.type === "option" ? (c(), W(Wn, {
                key: 2,
                field: D,
                onValidity: V[0] || (V[0] = (C, F) => a("validity", F, C))
              }, null, 8, ["field"])) : T("", !0),
              D.type === "formula" || D.type === "rollup" ? (c(), g("label", hs, [
                V[11] || (V[11] = O("Result type", -1)),
                b(r(ie), {
                  "model-value": D.form,
                  "onUpdate:modelValue": (C) => ae(D, C),
                  "aria-label": "Result type",
                  options: r(u).slice(0, 8),
                  optionLabel: "label",
                  optionValue: "value",
                  appendTo: "self"
                }, null, 8, ["model-value", "onUpdate:modelValue", "options"])
              ])) : T("", !0),
              D.type === "formula" ? (c(), g("label", ys, [
                V[12] || (V[12] = O("Expression", -1)),
                b(r(ce), {
                  modelValue: D.expression,
                  "onUpdate:modelValue": (C) => D.expression = C
                }, null, 8, ["modelValue", "onUpdate:modelValue"])
              ])) : T("", !0),
              D.type === "rollup" ? (c(), g(Q, { key: 5 }, [
                d("label", gs, [
                  V[13] || (V[13] = O("Of", -1)),
                  b(r(ce), {
                    modelValue: D.of,
                    "onUpdate:modelValue": (C) => D.of = C
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                d("label", ks, [
                  V[14] || (V[14] = O("Function", -1)),
                  b(r(ce), {
                    modelValue: D.fn,
                    "onUpdate:modelValue": (C) => D.fn = C
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                d("label", ws, [
                  V[15] || (V[15] = O("Field", -1)),
                  b(r(ce), {
                    modelValue: D.field,
                    "onUpdate:modelValue": (C) => D.field = C
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                d("label", Vs, [
                  V[16] || (V[16] = O("Order by", -1)),
                  b(r(ie), {
                    "model-value": D.by,
                    "aria-label": "Rollup order",
                    options: ["rank", "time"],
                    showClear: "",
                    appendTo: "self",
                    "onUpdate:modelValue": (C) => D.by = C || void 0
                  }, null, 8, ["model-value", "onUpdate:modelValue"])
                ]),
                b(_l, {
                  modelValue: D.where,
                  "onUpdate:modelValue": (C) => D.where = C,
                  draft: e.draft,
                  "board-id": e.boardId,
                  label: "Include related items when",
                  onValidity: (C) => a("validity", "rollup-" + z, C)
                }, null, 8, ["modelValue", "onUpdate:modelValue", "draft", "board-id", "onValidity"])
              ], 64)) : T("", !0),
              !M(D) && R(D) ? (c(), W(ot, {
                key: 6,
                label: "Field configuration",
                "model-value": D.config,
                shape: "object",
                "onUpdate:modelValue": (C) => D.config = C,
                onValidity: (C) => a("validity", "config-" + z, C)
              }, null, 8, ["model-value", "onUpdate:modelValue", "onValidity"])) : T("", !0),
              d("section", $s, [
                V[17] || (V[17] = d("h4", { class: "work-group-title" }, "Access", -1)),
                (c(), g(Q, null, oe(["read", "write"], (C) => b(Wa, {
                  "board-id": e.boardId,
                  key: C,
                  label: C === "read" ? "Who can read" : "Who can edit",
                  "model-value": D.access?.[C],
                  "onUpdate:modelValue": (F) => D.access = { ...D.access, [C]: F },
                  onValidity: (F) => a("validity", "access-" + z + C, F)
                }, null, 8, ["board-id", "label", "model-value", "onUpdate:modelValue", "onValidity"])), 64))
              ])
            ]),
            _: 2
          }, 1032, ["title", "code", "kind"]))), 128)),
          d("div", xs, [
            d("label", Cs, [
              V[18] || (V[18] = O("New field identifier", -1)),
              b(r(ce), {
                modelValue: s.value,
                "onUpdate:modelValue": V[1] || (V[1] = (D) => s.value = D),
                onKeydown: Ae(he(A, ["prevent"]), ["enter"])
              }, null, 8, ["modelValue", "onKeydown"])
            ]),
            b(r(J), {
              label: "Add field",
              severity: "secondary",
              disabled: !s.value.trim(),
              onClick: A,
              outlined: ""
            }, {
              icon: L(() => [
                b(r(ee), {
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
        [r(m)]
      ])
    ]));
  }
}), Ts = ["disabled"], Es = { class: "work-chips" }, Us = {
  key: 1,
  class: "work-muted work-small"
}, Lt = /* @__PURE__ */ ve({
  __name: "ChipPicker",
  props: {
    label: {},
    options: {},
    modelValue: {},
    disabled: { type: Boolean }
  },
  emits: ["update:modelValue"],
  setup(e, { emit: l }) {
    const t = e, a = l, o = j(""), s = X(() => t.options.map((m) => typeof m == "string" ? { value: m } : m)), v = X(() => s.value.filter((m) => (m.label ?? Ve(m.value)).toLocaleLowerCase().includes(o.value.toLocaleLowerCase())));
    function f(m) {
      if (t.disabled) return;
      const i = t.modelValue ?? [];
      a("update:modelValue", i.includes(m) ? i.filter((n) => n !== m) : [...i, m]);
    }
    return (m, i) => (c(), g("fieldset", {
      class: "work-chip-picker",
      disabled: e.disabled
    }, [
      d("legend", null, U(e.label), 1),
      e.options.length > 10 ? (c(), W(r(ce), {
        key: 0,
        modelValue: o.value,
        "onUpdate:modelValue": i[0] || (i[0] = (n) => o.value = n),
        type: "search",
        "aria-label": "Find " + e.label.toLowerCase(),
        placeholder: "Find a choice…"
      }, null, 8, ["modelValue", "aria-label"])) : T("", !0),
      d("div", Es, [
        b(r(Ql), {
          "model-value": e.modelValue ?? [],
          options: v.value.map((n) => ({ value: n.value, label: n.label ?? r(Ve)(n.value) })),
          optionLabel: "label",
          optionValue: "value",
          multiple: "",
          disabled: e.disabled,
          "aria-label": e.label,
          "onUpdate:modelValue": i[1] || (i[1] = (n) => a("update:modelValue", n ?? []))
        }, null, 8, ["model-value", "options", "disabled", "aria-label"]),
        (c(!0), g(Q, null, oe(e.modelValue?.filter((n) => !s.value.some((u) => u.value === n)) ?? [], (n) => (c(), W(r(J), {
          severity: "secondary",
          text: "",
          size: "small",
          key: n,
          type: "button",
          class: "work-choice work-unavailable",
          "aria-label": "Remove unavailable " + n,
          onClick: (u) => f(n)
        }, {
          default: L(() => [
            O(U(r(Ve)(n)) + " · unavailable ×", 1)
          ]),
          _: 2
        }, 1032, ["aria-label", "onClick"]))), 128))
      ]),
      e.options.length ? T("", !0) : (c(), g("span", Us, "No choices declared."))
    ], 8, Ts));
  }
}), Ds = {
  class: "work-stack",
  "aria-label": "Item types editor"
}, Is = { class: "work-section-heading" }, As = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, Ps = { class: "work-definition-meta" }, Rs = { class: "work-settings-grid" }, Os = { class: "work-stack work-tight" }, Ns = { class: "work-stack work-tight" }, Ms = { class: "work-stack work-tight" }, Fs = { class: "work-stack work-tight" }, Ls = {
  key: 0,
  class: "work-stack work-tight work-small"
}, zs = {
  key: 0,
  class: "kx-empty"
}, Bs = { class: "work-row work-add-definition" }, js = { class: "work-stack work-tight" }, qs = {
  key: 0,
  class: "work-error work-small"
}, Ws = /* @__PURE__ */ ve({
  __name: "TypesEditor",
  props: {
    draft: {},
    guardRemoval: { type: Function },
    issues: {}
  },
  setup(e) {
    const l = e, t = X(() => l.draft.item_types ?? []), a = j(""), o = j(""), s = j(""), v = X(() => /^[a-z][a-z0-9_]*$/.test(a.value) && !t.value.some((y) => y.id === a.value));
    function f() {
      v.value && ((l.draft.item_types ??= []).push({ id: a.value, title: Ve(a.value), process: l.draft.processes?.[0]?.id ?? "", fields: [] }), a.value = "");
    }
    function m(y, p) {
      const w = y.id;
      y.id = p;
      for (const x of t.value) x.parent_types && (x.parent_types = x.parent_types.map((E) => E === w ? p : E));
    }
    function i(y, p) {
      y.fields = p, y.inherit && (y.inherit = y.inherit.filter((w) => p.includes(w)));
    }
    function n(y) {
      return t.value.filter((p) => p.id !== y.id && p.parent_types?.includes(y.id)).map((p) => p.title || Ve(p.id));
    }
    async function u(y) {
      if (!s.value) {
        if (n(y).length) {
          o.value = `${y.title || Ve(y.id)} is a parent type for ${n(y).join(", ")}. Remove those parent selections first.`;
          return;
        }
        s.value = y.id, o.value = "";
        try {
          const p = await l.guardRemoval?.("item_types", y.id);
          p ? o.value = p : _t(l.draft, "item_types", y.id);
        } finally {
          s.value = "";
        }
      }
    }
    return (y, p) => (c(), g("section", Ds, [
      d("header", Is, [
        p[1] || (p[1] = d("div", null, [
          d("h2", null, "Item types"),
          d("p", { class: "work-muted work-small" }, "Choose the fields, parent relationships and process for each kind of work.")
        ], -1)),
        b(r(Re), {
          class: "kx-tag-sm",
          severity: "secondary"
        }, {
          default: L(() => [
            O(U(t.value.length) + " " + U(t.value.length === 1 ? "type" : "types"), 1)
          ]),
          _: 1
        })
      ]),
      o.value ? (c(), g("p", As, U(o.value), 1)) : T("", !0),
      b($l, {
        columns: "types",
        count: t.value.length
      }, {
        default: L(() => [
          (c(!0), g(Q, null, oe(t.value, (w, x) => (c(), W(Vl, {
            title: w.title || r(Ve)(w.id),
            code: w.id,
            kind: e.draft.processes?.find((E) => E.id === w.process)?.name || r(Ve)(w.process),
            key: x,
            class: "work-type-card"
          }, {
            usage: L(() => [
              d("span", Ps, [
                b(r(Re), {
                  class: "kx-tag-sm",
                  severity: "secondary"
                }, {
                  default: L(() => [
                    O(U(w.fields.length) + " " + U(w.fields.length === 1 ? "field" : "fields"), 1)
                  ]),
                  _: 2
                }, 1024),
                n(w).length ? (c(), W(r(Re), {
                  key: 0,
                  class: "kx-tag-sm",
                  severity: "secondary"
                }, {
                  default: L(() => [
                    O("Parent of " + U(n(w).join(", ")), 1)
                  ]),
                  _: 2
                }, 1024)) : T("", !0)
              ])
            ]),
            actions: L(() => [
              b(r(J), {
                severity: "secondary",
                text: "",
                size: "small",
                disabled: !!s.value,
                onClick: (E) => u(w),
                "aria-label": "Remove type"
              }, {
                default: L(() => [
                  b(r(ee), {
                    icon: "tabler:trash",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["disabled", "onClick"])
            ]),
            default: L(() => [
              (c(!0), g(Q, null, oe(e.issues?.filter((E) => E.code === "item_type " + w.id) ?? [], (E) => (c(), g("p", {
                key: E.what,
                class: "work-error work-small",
                role: "alert"
              }, U(r(wl)(E)), 1))), 128)),
              d("div", Rs, [
                d("label", Os, [
                  p[2] || (p[2] = O("Identifier", -1)),
                  b(r(ce), {
                    value: w.id,
                    onChange: (E) => m(w, E.target.value),
                    required: "",
                    pattern: "[a-z][a-z0-9_]*"
                  }, null, 8, ["value", "onChange"])
                ]),
                d("label", Ns, [
                  p[3] || (p[3] = O("Title", -1)),
                  b(r(ce), {
                    modelValue: w.title,
                    "onUpdate:modelValue": (E) => w.title = E,
                    placeholder: r(Ve)(w.id)
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder"])
                ]),
                d("label", Ms, [
                  p[4] || (p[4] = O("Process", -1)),
                  b(r(ie), {
                    modelValue: w.process,
                    "onUpdate:modelValue": (E) => w.process = E,
                    required: "",
                    appendTo: "self",
                    optionLabel: "label",
                    optionValue: "value",
                    optionDisabled: "disabled",
                    options: [...(e.draft.processes ?? []).map((E) => ({ label: E.name || r(Ve)(E.id), value: E.id, disabled: !1 }))]
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                ])
              ]),
              b(Lt, {
                label: "Fields",
                options: (e.draft.fields ?? []).map((E) => ({ value: E.code, label: r(_e)(E) })),
                "model-value": w.fields,
                "onUpdate:modelValue": (E) => i(w, E)
              }, null, 8, ["options", "model-value", "onUpdate:modelValue"]),
              b(Lt, {
                label: "Parent types",
                options: t.value.map((E) => ({ value: E.id, label: E.title || r(Ve)(E.id) })),
                modelValue: w.parent_types,
                "onUpdate:modelValue": (E) => w.parent_types = E
              }, null, 8, ["options", "modelValue", "onUpdate:modelValue"]),
              d("div", Fs, [
                b(Lt, {
                  label: "Inherit from parent",
                  options: w.fields.map((E) => ({ value: E, label: r(_e)(e.draft.fields?.find((I) => I.code === E) ?? { code: E }) })),
                  modelValue: w.inherit,
                  "onUpdate:modelValue": (E) => w.inherit = E
                }, null, 8, ["options", "modelValue", "onUpdate:modelValue"]),
                p[5] || (p[5] = d("p", { class: "work-muted work-small" }, "These fields resolve from the parent when this item has no own value.", -1))
              ]),
              w.parent_types?.length ? (c(), g("label", Ls, [
                p[6] || (p[6] = O("When the parent moves", -1)),
                b(r(ie), {
                  modelValue: w.move_children,
                  "onUpdate:modelValue": (E) => w.move_children = E,
                  appendTo: "self",
                  optionLabel: "label",
                  optionValue: "value",
                  optionDisabled: "disabled",
                  options: [{ label: "Default", value: void 0, disabled: !1 }, { label: "Move children", value: "move", disabled: !1 }, { label: "Refuse while children exist", value: "refuse", disabled: !1 }]
                }, null, 8, ["modelValue", "onUpdate:modelValue"])
              ])) : T("", !0)
            ]),
            _: 2
          }, 1032, ["title", "code", "kind"]))), 128)),
          t.value.length ? T("", !0) : (c(), g("p", zs, "Add an item type to connect fields to a process.")),
          d("div", Bs, [
            d("label", js, [
              p[7] || (p[7] = O("New type identifier", -1)),
              b(r(ce), {
                modelValue: a.value,
                "onUpdate:modelValue": p[0] || (p[0] = (w) => a.value = w),
                placeholder: "new_type",
                onKeydown: Ae(he(f, ["prevent"]), ["enter"])
              }, null, 8, ["modelValue", "onKeydown"])
            ]),
            b(r(J), {
              label: "Add type",
              severity: "secondary",
              disabled: !v.value,
              onClick: f,
              outlined: ""
            }, {
              icon: L(() => [
                b(r(ee), {
                  icon: "tabler:plus",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["disabled"]),
            a.value && !v.value ? (c(), g("span", qs, "Use a unique lowercase identifier with letters, numbers and underscores.")) : T("", !0)
          ])
        ]),
        _: 1
      }, 8, ["count"])
    ]));
  }
}), Ks = ".work-process-canvas>svg{height:480px;width:100%}.work-process-canvas:focus-visible{outline:var(--p-focus-ring-width) var(--p-focus-ring-style) var(--p-focus-ring-color);outline-offset:var(--p-focus-ring-offset)}.work-state-card{fill:var(--p-content-background);stroke:var(--p-content-border-color);stroke-width:1.5}.work-graph-node.work-selected .work-state-card{stroke:var(--p-primary-color);stroke-width:2.5;fill:color-mix(in srgb,var(--p-primary-color) 6%,var(--p-content-background))}.work-graph-node:focus-visible .work-state-card{stroke:var(--p-focus-ring-color);stroke-width:var(--p-focus-ring-width)}.work-process-canvas .work-edge-label{font-size:12px;fill:var(--p-text-color)}.work-process-canvas .work-edge-label-bg{fill:var(--p-content-background);stroke:var(--p-content-border-color);stroke-width:1}.work-edge-line{stroke:var(--p-primary-color);stroke-width:1.5}.work-edge-return .work-edge-line{stroke:var(--p-text-muted-color);stroke-dasharray:5 4}.work-graph-arrow{fill:context-stroke}.work-lane-line{fill:none;stroke:var(--p-text-muted-color);stroke-width:1.5;stroke-dasharray:2 4}.work-node-connector{fill:var(--p-content-background);stroke:var(--p-primary-color);stroke-width:1.5}.work-node-connector:hover,.work-node-connector:focus-visible{fill:var(--p-primary-color)}.work-process-legend{position:static;flex-wrap:wrap;padding:10px 16px;border-top:1px solid var(--p-content-border-color);background:var(--p-content-background)}@media(max-width:700px){.work-process-canvas>svg{height:420px}}.work-process-more{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:8px;padding:8px 16px;border-top:1px solid var(--p-content-border-color);background:var(--p-content-background);color:var(--p-text-muted-color);font-size:12px}.work-process-canvas .work-graph-edge.work-selected .work-edge-label-bg{fill:var(--p-primary-color);stroke:var(--p-primary-color)}.work-process-canvas .work-graph-edge.work-selected .work-edge-label{fill:var(--p-primary-contrast-color)}", Sa = /* @__PURE__ */ new WeakSet();
function Gs(e) {
  const l = e.getRootNode();
  if (l instanceof ShadowRoot && !Sa.has(l)) {
    const t = e.ownerDocument.createElement("style");
    t.textContent = Ks, l.append(t), Sa.add(l);
  }
}
const Ys = 0.8;
function Hs(e, l, t) {
  const a = Math.min(1, l.width / e.width, l.height / e.height);
  if (a >= Ys) return { zoom: a, pan: { x: (e.width - l.width / a) / 2, y: (e.height - l.height / a) / 2 } };
  const o = e.nodes.find((v) => v.state.id === t) ?? e.nodes[0], s = Math.min(1, l.width / ((o?.width ?? 190) + 64));
  return { zoom: s, pan: o ? { x: e.direction === "TB" ? o.x - l.width / s / 2 : o.x - o.width / 2 - 32, y: e.direction === "TB" ? o.y - o.height / 2 - 32 : o.y - l.height / s / 2 } : { x: 0, y: 0 } };
}
const Xs = ["onKeydown"], Js = {
  key: 0,
  class: "work-process-instruction",
  role: "status"
}, Zs = ["viewBox"], Qs = ["id"], _s = ["d", "marker-end"], er = ["aria-label", "aria-pressed", "onFocus", "onClick", "onKeydown"], tr = ["d"], lr = ["d", "marker-end"], ar = ["x", "y", "width", "height"], or = ["x", "y"], ir = ["x", "dy"], nr = ["aria-label", "aria-pressed", "onClick", "onKeydown", "onFocus", "onPointerup"], sr = ["x", "y", "width", "height"], rr = ["cx", "cy"], dr = ["x", "y"], ur = ["x", "dy"], cr = ["x", "y"], vr = ["x", "dy"], mr = {
  key: 0,
  class: "work-limit-text"
}, fr = ["aria-label", "onClick", "onKeydown"], pr = ["x", "y"], br = ["x", "dy"], hr = ["cx", "cy", "aria-label", "onPointerdown", "onClick", "onKeydown"], yr = ["d"], gr = {
  key: 1,
  class: "work-process-more",
  role: "status"
}, kr = { class: "work-process-legend" }, wr = /* @__PURE__ */ ve({
  __name: "ProcessGraph",
  props: {
    process: {},
    draft: {},
    selectedState: {},
    selectedTransition: {}
  },
  emits: ["state", "transition", "connect", "clear"],
  setup(e, { expose: l, emit: t }) {
    const a = e, o = t, s = Xl().replace(/:/g, "_"), v = j(""), f = j(), m = j(), i = j(900), n = j(!1), u = X(() => i.value < 700 ? 420 : 480), y = X(() => Go(a.process, a.draft, { width: i.value, height: u.value })), p = j(1), w = j({ x: 0, y: 0 }), x = j({ x: 0, y: 0 }), E = X(() => ({ width: i.value, height: n.value ? Math.max(u.value, y.value.height * Math.min(1, i.value / y.value.width)) : u.value })), I = X(() => y.value.nodes.filter((h) => h.x - h.width / 2 >= w.value.x && h.x + h.width / 2 <= w.value.x + E.value.width / p.value && h.y - h.height / 2 >= w.value.y && h.y + h.height / 2 <= w.value.y + E.value.height / p.value).length);
    function B() {
      n.value = !1;
      const h = Hs(y.value, E.value, a.process.initial);
      p.value = h.zoom, w.value = h.pan;
    }
    const M = X(() => `${w.value.x} ${w.value.y} ${E.value.width / p.value} ${E.value.height / p.value}`), R = X(() => y.value.nodes.find((h) => h.state.id === v.value));
    function S() {
      n.value = !0, p.value = Math.min(1, E.value.width / y.value.width), w.value = { x: (y.value.width - E.value.width / p.value) / 2, y: 0 };
    }
    function q(h) {
      const $ = Math.max(0.02, Math.min(3, p.value * h)), k = 1 / p.value - 1 / $;
      w.value = { x: w.value.x + E.value.width * k / 2, y: w.value.y + E.value.height * k / 2 }, p.value = $;
    }
    function N(h) {
      const $ = E.value.width / p.value, k = E.value.height / p.value;
      (h.x - h.width / 2 < w.value.x || h.x + h.width / 2 > w.value.x + $ || h.y - h.height / 2 < w.value.y || h.y + h.height / 2 > w.value.y + k) && (w.value = { x: h.x - $ / 2, y: h.y - k / 2 });
    }
    function ae() {
      const h = y.value.nodes.find(($) => $.state === a.selectedState) ?? y.value.edges.find(($) => $.transition === a.selectedTransition);
      h && N(h);
    }
    Ce([y, () => a.selectedState, () => a.selectedTransition], ae, { flush: "post" }), Ce(() => a.process.id, () => {
      v.value = "", D.clear(), B();
    }, { flush: "post" });
    function ne(h) {
      if (h.target !== f.value) return;
      (h.key === "+" || h.key === "=") && (h.preventDefault(), q(1.2)), h.key === "-" && (h.preventDefault(), q(1 / 1.2)), h.key === "0" && (h.preventDefault(), S());
      const $ = 60 / p.value;
      h.key.startsWith("Arrow") && (h.preventDefault(), w.value = { x: w.value.x + (h.key === "ArrowRight" ? $ : h.key === "ArrowLeft" ? -$ : 0), y: w.value.y + (h.key === "ArrowDown" ? $ : h.key === "ArrowUp" ? -$ : 0) });
    }
    function G(h, $) {
      v.value && v.value !== h.id && o("connect", v.value, h.id, $.currentTarget), v.value = "";
    }
    function A(h, $) {
      v.value = $.state.id, x.value = { x: $.x, y: $.y };
      const k = h.target;
      k instanceof Element && k.hasPointerCapture?.(h.pointerId) && k.releasePointerCapture(h.pointerId);
    }
    function P(h, $) {
      if ((h.key === "Enter" || h.key === " ") && (h.preventDefault(), v.value ? G($, h) : o("state", $, h.currentTarget)), ["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp"].includes(h.key)) {
        h.preventDefault();
        const k = Array.from(m.value?.querySelectorAll(".work-graph-node") ?? []), K = y.value.nodes.findIndex((de) => de.state === $), Z = ["ArrowRight", "ArrowDown"].includes(h.key) ? 1 : -1;
        k[(K + Z + k.length) % k.length]?.focus();
      }
    }
    function V() {
      v.value = "", D.clear(), o("clear");
    }
    const D = /* @__PURE__ */ new Map();
    let z = 0;
    function C(h) {
      if (!h.target.closest('[role="button"]') && (D.set(h.pointerId, { x: h.clientX, y: h.clientY }), f.value?.setPointerCapture?.(h.pointerId), D.size === 2)) {
        const [$, k] = [...D.values()];
        z = Math.hypot($.x - k.x, $.y - k.y);
      }
    }
    function F(h) {
      const $ = m.value?.getBoundingClientRect();
      if (!$?.width) return;
      if (v.value) {
        x.value = { x: w.value.x + (h.clientX - $.left) * E.value.width / p.value / $.width, y: w.value.y + (h.clientY - $.top) * E.value.height / p.value / $.height };
        return;
      }
      const k = D.get(h.pointerId);
      if (k)
        if (D.set(h.pointerId, { x: h.clientX, y: h.clientY }), D.size === 2) {
          const [K, Z] = [...D.values()], de = Math.hypot(K.x - Z.x, K.y - Z.y);
          z && q(de / z), z = de;
        } else w.value = { x: w.value.x - (h.clientX - k.x) * E.value.width / p.value / $.width, y: w.value.y - (h.clientY - k.y) * E.value.height / p.value / $.height };
    }
    function _(h) {
      D.delete(h.pointerId), z = 0, v.value = "";
    }
    function ke(h) {
      h.ctrlKey && (h.preventDefault(), q(Math.exp(-h.deltaY * 0.01)));
    }
    let pe;
    kl(() => {
      if (f.value && Gs(f.value), typeof ResizeObserver < "u" && m.value) {
        let h = !0;
        pe = new ResizeObserver(() => {
          const $ = m.value?.getBoundingClientRect();
          if (!$?.width || !$.height) return;
          const k = E.value.width;
          i.value = $.width, (h || Math.abs($.width - k) > 1) && (n.value ? S() : B(), h = !1), ae();
        }), pe.observe(m.value);
      }
    }), nt(() => pe?.disconnect()), l({ fit: S, zoomIn: () => q(1.2), zoomOut: () => q(1 / 1.2) });
    function ge(h) {
      return h.category === "completed" ? "check" : h.category === "canceled" ? "x" : h.id === a.process.initial ? "arrow-bar-to-right" : { gate: "shield-check", automated: "bolt", parallel: "arrows-split" }[h.kind ?? ""] ?? "user";
    }
    return (h, $) => (c(), g("section", {
      ref_key: "canvas",
      ref: f,
      class: "work-process-canvas",
      "aria-label": "Process map",
      tabindex: "0",
      onKeydown: [
        ne,
        Ae(he(V, ["stop"]), ["esc"])
      ],
      onPointerdown: C,
      onPointermove: F,
      onPointerup: _,
      onPointercancel: V,
      onWheel: ke
    }, [
      v.value ? (c(), g("p", Js, "Choose the next stop. Escape cancels.")) : T("", !0),
      (c(), g("svg", {
        ref_key: "svg",
        ref: m,
        style: ho({ height: E.value.height + "px" }),
        viewBox: M.value,
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
          }, [...$[1] || ($[1] = [
            d("path", {
              d: "M0 0 L8 4 L0 8 z",
              class: "work-graph-arrow"
            }, null, -1)
          ])], 8, Qs)
        ]),
        (c(!0), g(Q, null, oe(y.value.parallels, (k) => (c(), g("path", {
          key: k.key,
          d: k.path,
          class: "work-lane-line",
          "marker-end": `url(#${r(s)}-arrow)`
        }, [
          d("title", null, "Parallel lane from " + U(r(ye)(k.state)), 1)
        ], 8, _s))), 128)),
        (c(!0), g(Q, null, oe(y.value.edges, (k) => (c(), g("g", {
          key: k.key,
          class: pt(["work-graph-edge", ["work-edge-" + k.type, { "work-selected": e.selectedTransition === k.transition }]]),
          role: "button",
          tabindex: "0",
          "aria-label": "Edit transition " + r(je)(k.transition),
          "aria-pressed": e.selectedTransition === k.transition,
          onFocus: (K) => N(k),
          onClick: (K) => o("transition", k.transition, K.currentTarget),
          onKeydown: [
            Ae(he((K) => o("transition", k.transition, K.currentTarget), ["prevent"]), ["enter"]),
            Ae(he((K) => o("transition", k.transition, K.currentTarget), ["prevent"]), ["space"])
          ]
        }, [
          d("path", {
            d: k.path,
            class: "work-edge-hit"
          }, null, 8, tr),
          d("path", {
            d: k.path,
            class: "work-edge-line",
            "marker-end": `url(#${r(s)}-arrow)`
          }, null, 8, lr),
          d("rect", {
            x: k.x - k.width / 2,
            y: k.y - k.height / 2,
            width: k.width,
            height: k.height,
            rx: "6",
            class: "work-edge-label-bg"
          }, null, 8, ar),
          d("text", {
            x: k.x,
            y: k.y - (k.lines.length - 1) * 8 + 4,
            class: "work-edge-label",
            "text-anchor": "middle"
          }, [
            (c(!0), g(Q, null, oe(k.lines, (K, Z) => (c(), g("tspan", {
              key: Z,
              x: k.x,
              dy: Z ? 16 : 0
            }, U(K), 9, ir))), 128))
          ], 8, or)
        ], 42, er))), 128)),
        (c(!0), g(Q, null, oe(y.value.nodes, (k) => (c(), g("g", {
          key: k.state.id,
          class: pt(["work-graph-node", ["work-stop-" + k.state.category, { "work-selected": e.selectedState === k.state }]]),
          role: "button",
          tabindex: "0",
          "aria-label": "Edit state " + r(ye)(k.state),
          "aria-pressed": e.selectedState === k.state,
          onClick: (K) => o("state", k.state, K.currentTarget),
          onKeydown: (K) => P(K, k.state),
          onFocus: (K) => N(k),
          onPointerup: he((K) => G(k.state, K), ["stop"])
        }, [
          d("rect", {
            x: k.x - k.width / 2,
            y: k.y - k.height / 2,
            width: k.width,
            height: k.height,
            rx: "10",
            class: "work-state-card"
          }, null, 8, sr),
          d("circle", {
            cx: k.x - k.width / 2 + 22,
            cy: k.y - k.height / 2 + 25,
            r: "10",
            class: "work-stop-ring"
          }, null, 8, rr),
          b(r(ee), {
            icon: "tabler:" + ge(k.state),
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
            (c(!0), g(Q, null, oe(k.title, (K, Z) => (c(), g("tspan", {
              key: Z,
              x: k.x - k.width / 2 + 42,
              dy: Z ? 18 : 0
            }, U(K), 9, ur))), 128))
          ], 8, dr),
          d("text", {
            x: k.x - k.width / 2 + 16,
            y: k.y - k.height / 2 + 33 + k.title.length * 18,
            class: "work-node-meta"
          }, [
            (c(!0), g(Q, null, oe(k.caption, (K, Z) => (c(), g("tspan", {
              key: Z,
              x: k.x - k.width / 2 + 16,
              dy: Z ? 16 : 0
            }, U(K), 9, vr))), 128)),
            e.draft.policy?.wip?.[k.state.id] ? (c(), g("tspan", mr, " · limit " + U(e.draft.policy.wip[k.state.id].limit), 1)) : T("", !0)
          ], 8, cr),
          (c(!0), g(Q, null, oe(k.badges, (K, Z) => (c(), g("g", {
            key: K.id,
            class: "work-any-transition",
            role: "button",
            tabindex: "0",
            "aria-label": "Edit transition " + r(je)(K),
            onClick: he((de) => o("transition", K, de.currentTarget), ["stop"]),
            onKeydown: [
              Ae(he((de) => o("transition", K, de.currentTarget), ["stop", "prevent"]), ["enter"]),
              Ae(he((de) => o("transition", K, de.currentTarget), ["stop", "prevent"]), ["space"])
            ]
          }, [
            d("text", {
              x: k.x - k.width / 2 + 16,
              y: k.y - k.height / 2 + 33 + k.title.length * 18 + k.caption.length * 16 + k.badges.slice(0, Z).reduce((de, be) => de + r(Ot)(r(je)(be) + " works from any state").length * 18, 0),
              class: "work-node-meta"
            }, [
              (c(!0), g(Q, null, oe(r(Ot)(r(je)(K) + " works from any state"), (de, be) => (c(), g("tspan", {
                key: be,
                x: k.x - k.width / 2 + 16,
                dy: be ? 18 : 0
              }, U(de), 9, br))), 128))
            ], 8, pr)
          ], 40, fr))), 128)),
          ["completed", "canceled"].includes(k.state.category) ? T("", !0) : (c(), g("circle", {
            key: 0,
            cx: y.value.direction === "TB" ? k.x : k.x + k.width / 2,
            cy: y.value.direction === "TB" ? k.y + k.height / 2 : k.y,
            r: "7",
            class: "work-node-connector",
            role: "button",
            tabindex: "0",
            "aria-label": "Connect from " + r(ye)(k.state),
            onPointerdown: he((K) => A(K, k), ["stop", "prevent"]),
            onClick: he((K) => o("state", k.state, K.currentTarget), ["stop"]),
            onKeydown: [
              Ae(he((K) => {
                v.value = k.state.id, x.value = { x: k.x, y: k.y };
              }, ["stop", "prevent"]), ["enter"]),
              Ae(he((K) => v.value = k.state.id, ["stop", "prevent"]), ["space"])
            ]
          }, null, 40, hr))
        ], 42, nr))), 128)),
        R.value ? (c(), g("path", {
          key: 0,
          d: `M ${y.value.direction === "TB" ? R.value.x : R.value.x + R.value.width / 2} ${y.value.direction === "TB" ? R.value.y + R.value.height / 2 : R.value.y} L ${x.value.x} ${x.value.y}`,
          class: "work-connect-ghost"
        }, null, 8, yr)) : T("", !0)
      ], 12, Zs)),
      !n.value && I.value < e.process.states.length ? (c(), g("div", gr, [
        d("span", null, U(I.value) + " of " + U(e.process.states.length) + " states in view · More " + U(y.value.direction === "TB" ? "below" : "to the right"), 1),
        b(r(J), {
          label: "Show full process",
          size: "small",
          text: "",
          onClick: $[0] || ($[0] = (k) => S())
        })
      ])) : T("", !0),
      d("div", kr, [
        d("span", null, U(e.process.states.length) + " states · " + U(Math.round(p.value * 100)) + "%", 1),
        $[2] || ($[2] = d("span", null, [
          d("i"),
          O("Transition")
        ], -1)),
        $[3] || ($[3] = d("span", null, [
          d("i", { class: "work-return-key" }),
          O("Return / loop")
        ], -1)),
        $[4] || ($[4] = d("span", null, "Drag to pan · Ctrl + scroll to zoom · Fit for full process", -1))
      ])
    ], 40, Xs));
  }
}), Vr = {
  class: "work-process-list work-stack",
  "aria-label": "Process list"
}, $r = { class: "work-stack work-tight" }, xr = { class: "work-table-scroll" }, Cr = {
  class: "work-settings-table work-process-table",
  role: "table",
  "aria-label": "States"
}, Sr = { role: "rowgroup" }, Tr = ["aria-selected"], Er = { role: "cell" }, Ur = { role: "cell" }, Dr = { role: "cell" }, Ir = {
  role: "cell",
  class: "work-process-list-actions"
}, Ar = { class: "work-table-scroll" }, Pr = {
  class: "work-settings-table work-process-table",
  role: "table",
  "aria-label": "Transitions"
}, Rr = { role: "rowgroup" }, Or = ["aria-selected"], Nr = { role: "cell" }, Mr = { role: "cell" }, Fr = { role: "cell" }, Lr = {
  role: "cell",
  class: "work-process-list-actions"
}, zr = /* @__PURE__ */ ve({
  __name: "ProcessList",
  props: {
    process: {},
    selectedState: {},
    selectedTransition: {}
  },
  emits: ["state", "transition", "removeState", "removeTransition", "addTransition"],
  setup(e) {
    return (l, t) => (c(), g("section", Vr, [
      d("label", $r, [
        t[2] || (t[2] = O("Process name", -1)),
        b(r(ce), {
          modelValue: e.process.name,
          "onUpdate:modelValue": t[0] || (t[0] = (a) => e.process.name = a),
          "aria-label": "Process name"
        }, null, 8, ["modelValue"])
      ]),
      t[9] || (t[9] = d("h3", null, "States", -1)),
      d("div", xr, [
        d("table", Cr, [
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
          d("tbody", Sr, [
            (c(!0), g(Q, null, oe(e.process.states, (a) => (c(), g("tr", {
              key: a.id,
              "aria-selected": e.selectedState === a,
              role: "row"
            }, [
              d("td", Er, [
                b(r(ce), {
                  modelValue: a.name,
                  "onUpdate:modelValue": (o) => a.name = o,
                  "aria-label": "Name of " + r(ye)(a)
                }, null, 8, ["modelValue", "onUpdate:modelValue", "aria-label"])
              ]),
              d("td", Ur, [
                t[3] || (t[3] = d("span", {
                  class: "work-process-cell-label",
                  "aria-hidden": "true"
                }, "Phase", -1)),
                O(U(r(Zl)(a.category)), 1)
              ]),
              d("td", Dr, [
                t[4] || (t[4] = d("span", {
                  class: "work-process-cell-label",
                  "aria-hidden": "true"
                }, "Kind", -1)),
                b(r(Re), { severity: "secondary" }, {
                  default: L(() => [
                    O(U(r(La)(a.kind)), 1)
                  ]),
                  _: 2
                }, 1024)
              ]),
              d("td", Ir, [
                b(r(J), {
                  size: "small",
                  text: "",
                  severity: "secondary",
                  "aria-label": "Edit state",
                  onClick: (o) => l.$emit("state", a, o.currentTarget)
                }, {
                  default: L(() => [
                    b(r(ee), { icon: "tabler:pencil" })
                  ]),
                  _: 1
                }, 8, ["onClick"]),
                b(r(J), {
                  size: "small",
                  text: "",
                  severity: "danger",
                  "aria-label": "Remove state " + r(ye)(a),
                  onClick: (o) => l.$emit("removeState", a)
                }, {
                  default: L(() => [
                    b(r(ee), { icon: "tabler:trash" })
                  ]),
                  _: 1
                }, 8, ["aria-label", "onClick"])
              ])
            ], 8, Tr))), 128))
          ])
        ])
      ]),
      t[10] || (t[10] = d("h3", null, "Transitions", -1)),
      d("div", Ar, [
        d("table", Pr, [
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
          d("tbody", Rr, [
            (c(!0), g(Q, null, oe(e.process.transitions ?? [], (a) => (c(), g("tr", {
              key: a.id,
              "aria-selected": e.selectedTransition === a,
              role: "row"
            }, [
              d("td", Nr, [
                b(r(ce), {
                  modelValue: a.name,
                  "onUpdate:modelValue": (o) => a.name = o,
                  placeholder: r(je)(a),
                  "aria-label": "Name of " + r(je)(a)
                }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder", "aria-label"])
              ]),
              d("td", Mr, [
                t[6] || (t[6] = d("span", {
                  class: "work-process-cell-label",
                  "aria-hidden": "true"
                }, "From", -1)),
                O(" " + U(a.from === "any" ? "Any state" : a.from.map((o) => r(ye)(e.process.states.find((s) => s.id === o))).join(", ")), 1)
              ]),
              d("td", Fr, [
                t[7] || (t[7] = d("span", {
                  class: "work-process-cell-label",
                  "aria-hidden": "true"
                }, "To", -1)),
                O(U(r(ye)(e.process.states.find((o) => o.id === a.to))), 1)
              ]),
              d("td", Lr, [
                b(r(J), {
                  size: "small",
                  text: "",
                  severity: "secondary",
                  "aria-label": "Edit transition",
                  onClick: (o) => l.$emit("transition", a, o.currentTarget)
                }, {
                  default: L(() => [
                    b(r(ee), { icon: "tabler:pencil" })
                  ]),
                  _: 1
                }, 8, ["onClick"]),
                b(r(J), {
                  size: "small",
                  text: "",
                  severity: "danger",
                  "aria-label": "Remove transition " + r(je)(a),
                  onClick: (o) => l.$emit("removeTransition", a)
                }, {
                  default: L(() => [
                    b(r(ee), { icon: "tabler:trash" })
                  ]),
                  _: 1
                }, 8, ["aria-label", "onClick"])
              ])
            ], 8, Or))), 128))
          ])
        ])
      ]),
      b(r(J), {
        label: "Add transition",
        severity: "secondary",
        outlined: "",
        onClick: t[1] || (t[1] = (a) => l.$emit("addTransition", a.currentTarget))
      }, {
        icon: L(() => [
          b(r(ee), { icon: "tabler:plus" })
        ]),
        _: 1
      })
    ]));
  }
}), Br = { class: "work-stack work-transition-settings" }, jr = { class: "work-stack work-tight" }, qr = { class: "work-row" }, Wr = { class: "work-row" }, Kr = { class: "work-row" }, Gr = { class: "work-stack work-tight" }, Yr = { class: "work-row" }, Hr = { class: "work-stack work-tight" }, Xr = { class: "work-stack work-tight" }, Jr = /* @__PURE__ */ ve({
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
    function s(v, f) {
      const m = t.transition.set?.[v];
      !m || !t.transition.set || (t.transition.set[v] = { field: m.field, ...f === "clear" ? { clear: !0 } : f === "copy" ? { copy: "" } : { value: "" } });
    }
    return (v, f) => (c(), g("div", Br, [
      d("label", jr, [
        f[14] || (f[14] = O("To state", -1)),
        b(r(ie), {
          modelValue: e.transition.to,
          "onUpdate:modelValue": f[0] || (f[0] = (m) => e.transition.to = m),
          "aria-label": "To state",
          appendTo: "self",
          optionLabel: "label",
          optionValue: "value",
          options: e.process.states.map((m) => ({ label: r(ye)(m), value: m.id }))
        }, null, 8, ["modelValue", "options"])
      ]),
      d("label", qr, [
        f[15] || (f[15] = d("span", { class: "work-spacer" }, "Happens automatically", -1)),
        b(r(Le), {
          "model-value": e.transition.auto,
          "onUpdate:modelValue": f[1] || (f[1] = (m) => {
            e.transition.auto = m, m || delete e.transition.default;
          }),
          "aria-label": "Automatic transition"
        }, null, 8, ["model-value"])
      ]),
      d("label", Wr, [
        f[16] || (f[16] = d("span", { class: "work-spacer" }, "Default automatic transition", -1)),
        b(r(Le), {
          modelValue: e.transition.default,
          "onUpdate:modelValue": f[2] || (f[2] = (m) => e.transition.default = m),
          disabled: !e.transition.auto,
          "aria-label": "Default transition"
        }, null, 8, ["modelValue", "disabled"])
      ]),
      d("label", Kr, [
        f[17] || (f[17] = d("span", { class: "work-spacer" }, "Works from any state", -1)),
        b(r(Le), {
          "model-value": e.transition.from === "any",
          "aria-label": "Works from any state",
          "onUpdate:modelValue": f[3] || (f[3] = (m) => e.transition.from = m ? "any" : [])
        }, null, 8, ["model-value"])
      ]),
      e.transition.from !== "any" ? (c(), W(Lt, {
        key: 0,
        label: "From states",
        options: e.process.states.map((m) => ({ value: m.id, label: r(ye)(m) })),
        modelValue: e.transition.from,
        "onUpdate:modelValue": f[4] || (f[4] = (m) => e.transition.from = m)
      }, null, 8, ["options", "modelValue"])) : T("", !0),
      f[21] || (f[21] = d("h4", { class: "work-process-group" }, "Must be filled", -1)),
      b(Lt, {
        label: "Required fields",
        options: e.draft.fields?.map((m) => ({ value: m.code, label: m.title || m.code })) ?? [],
        modelValue: e.transition.require,
        "onUpdate:modelValue": f[5] || (f[5] = (m) => e.transition.require = m)
      }, null, 8, ["options", "modelValue"]),
      f[22] || (f[22] = d("h4", { class: "work-process-group" }, "Also sets", -1)),
      (c(!0), g(Q, null, oe(e.transition.set ?? [], (m, i) => (c(), g("div", {
        key: i,
        class: "work-process-value work-stack work-tight"
      }, [
        d("label", Gr, [
          f[18] || (f[18] = O("Field", -1)),
          b(r(ie), {
            modelValue: m.field,
            "onUpdate:modelValue": (n) => m.field = n,
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            options: e.draft.fields?.map((n) => ({ value: n.code, label: n.title || n.code })) ?? []
          }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
        ]),
        d("div", Yr, [
          b(r(ie), {
            "model-value": m.clear ? "clear" : m.copy !== void 0 ? "copy" : "value",
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
          b(r(J), {
            text: "",
            severity: "danger",
            "aria-label": "Remove value " + (i + 1),
            onClick: (n) => e.transition.set?.splice(i, 1)
          }, {
            default: L(() => [
              b(r(ee), { icon: "tabler:trash" })
            ]),
            _: 1
          }, 8, ["aria-label", "onClick"])
        ]),
        m.copy !== void 0 ? (c(), W(r(ie), {
          key: 0,
          modelValue: m.copy,
          "onUpdate:modelValue": (n) => m.copy = n,
          "aria-label": "Copy from field",
          appendTo: "self",
          optionLabel: "label",
          optionValue: "value",
          options: e.draft.fields?.map((n) => ({ value: n.code, label: n.title || n.code })) ?? []
        }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])) : m.clear ? T("", !0) : (c(!0), g(Q, { key: 1 }, oe(e.draft.fields?.filter((n) => n.code === m.field) ?? [], (n) => (c(), W(qa, {
          key: n.code,
          "board-id": e.boardId ?? "",
          field: n,
          modelValue: m.value,
          "onUpdate:modelValue": (u) => m.value = u,
          onValidity: (u) => a("validity", "effect-" + i, u)
        }, null, 8, ["board-id", "field", "modelValue", "onUpdate:modelValue", "onValidity"]))), 128))
      ]))), 128)),
      b(r(J), {
        label: "Add value",
        severity: "secondary",
        outlined: "",
        size: "small",
        onClick: o
      }, {
        icon: L(() => [
          b(r(ee), { icon: "tabler:plus" })
        ]),
        _: 1
      }),
      d("label", Hr, [
        f[19] || (f[19] = O("Offer to people", -1)),
        b(r(ie), {
          "model-value": e.transition.people,
          "aria-label": "Offer to people",
          appendTo: "self",
          optionLabel: "label",
          optionValue: "value",
          options: [{ label: "Work default", value: void 0 }, { label: "Offer explicitly", value: !0 }, { label: "Hide from people", value: !1 }],
          "onUpdate:modelValue": f[6] || (f[6] = (m) => e.transition.people = m)
        }, null, 8, ["model-value"])
      ]),
      d("label", Xr, [
        f[20] || (f[20] = O("Evaluation order", -1)),
        b(r(Ge), {
          "model-value": e.transition.order ?? null,
          "aria-label": "Transition order",
          min: 0,
          useGrouping: !1,
          "onUpdate:modelValue": f[7] || (f[7] = (m) => e.transition.order = m ?? void 0)
        }, null, 8, ["model-value"])
      ]),
      f[23] || (f[23] = d("h4", { class: "work-process-group" }, "Only when", -1)),
      b(_l, {
        label: "Allow this transition when",
        draft: e.draft,
        "board-id": e.boardId,
        "model-value": e.transition.when,
        "onUpdate:modelValue": f[8] || (f[8] = (m) => e.transition.when = m),
        onValidity: f[9] || (f[9] = (m) => a("validity", "when", m))
      }, null, 8, ["draft", "board-id", "model-value"]),
      b(ot, {
        label: "Set values",
        "model-value": e.transition.set,
        shape: "array",
        "onUpdate:modelValue": f[10] || (f[10] = (m) => e.transition.set = m),
        onValidity: f[11] || (f[11] = (m) => a("validity", "set", m))
      }, null, 8, ["model-value"]),
      b(ot, {
        label: "Guards",
        "model-value": e.transition.guards,
        shape: "array",
        "onUpdate:modelValue": f[12] || (f[12] = (m) => e.transition.guards = m),
        onValidity: f[13] || (f[13] = (m) => a("validity", "guards", m))
      }, null, 8, ["model-value"])
    ]));
  }
}), gl = /* @__PURE__ */ ve({
  __name: "CapacityControl",
  props: {
    draft: {},
    state: {},
    label: {},
    hard: { type: Boolean }
  },
  setup(e) {
    const l = e, t = X(() => l.draft.policy?.wip?.[l.state]);
    function a(s) {
      if (s === null) {
        l.draft.policy?.wip && delete l.draft.policy.wip[l.state];
        return;
      }
      const v = l.draft.policy ??= {}, f = v.wip ??= {};
      f[l.state] = { ...f[l.state], limit: s };
    }
    function o(s) {
      t.value && (t.value.hard = s);
    }
    return (s, v) => e.hard ? (c(), W(r(Le), {
      key: 0,
      "aria-label": e.label,
      disabled: !t.value,
      "model-value": t.value?.hard ?? !1,
      "onUpdate:modelValue": o
    }, null, 8, ["aria-label", "disabled", "model-value"])) : (c(), W(r(Ge), {
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
    const { data: l } = await No.get(e);
    if (!l?.success) throw new Error(l?.message || (typeof l?.error == "string" ? l.error : l?.error?.message) || "Could not read published Flow.");
    return l;
  } catch (l) {
    throw Co(l, "Published Flow");
  }
}
const Ea = (e) => `/api/v1/workflows/${encodeURIComponent(e)}/versions`, Ua = {
  versions: async (e) => (await Ta(Ea(e))).versions ?? [],
  check: async (e) => {
    if ((await Ta(`${Ea(e.id)}/${e.version}`)).version?.version !== e.version) throw new Error("The published version is unavailable.");
  }
}, Zr = {
  class: "work-stack work-tight",
  "aria-label": "Stage Flow"
}, Qr = {
  key: 0,
  class: "work-muted work-small"
}, _r = {
  key: 1,
  class: "kx-err",
  role: "alert"
}, ed = ["schema", "config", "title"], td = {
  key: 3,
  class: "kx-err",
  role: "alert"
}, ld = {
  key: 4,
  class: "work-stack work-tight"
}, ad = {
  key: 5,
  class: "work-muted work-small",
  role: "status"
}, od = /* @__PURE__ */ ve({
  __name: "StageFlow",
  props: {
    modelValue: {}
  },
  emits: ["update:modelValue", "validity"],
  setup(e, { emit: l }) {
    const t = e, a = l, o = j(!1), s = j(""), v = j([]), f = j(!1), m = j(""), i = j(!1), n = X(() => s.value || t.modelValue?.id), u = JSON.stringify({ properties: { flow_ref: { title: "Published Flow", picker: "wc-workflow-picker" } } }), y = X(() => JSON.stringify(t.modelValue ? { flow_ref: t.modelValue } : {}));
    let p = 0;
    async function w() {
      o.value = await lt("wc-workflow-picker");
    }
    w();
    async function x() {
      const M = ++p, R = n.value, S = t.modelValue;
      if (f.value = !!R, m.value = "", v.value = [], !!R)
        try {
          const [q] = await Promise.all([Ua.versions(R), !i.value && S ? Ua.check(S) : Promise.resolve()]);
          if (M !== p) return;
          if (v.value = q.filter((N) => Number.isInteger(N.version) && N.version > 0), !i.value && S && !v.value.some((N) => N.version === S.version)) throw new Error("The published version is unavailable.");
        } catch (q) {
          M === p && (m.value = q instanceof Error ? q.message : "Could not read published Flow.");
        } finally {
          M === p && (f.value = !1);
        }
    }
    Ce([n, () => t.modelValue?.version, i], x, { immediate: !0 }), Ce(i, (M) => a("validity", !M), { immediate: !0 });
    function E(M) {
      const R = M.detail?.flow_ref;
      R?.kind !== "flow" || !R.id || (i.value = !0, s.value = R.id);
    }
    function I(M) {
      !n.value || !v.value.some((R) => R.version === M) || (a("update:modelValue", { kind: "flow", id: n.value, version: M }), i.value = !1, s.value = "");
    }
    function B() {
      a("update:modelValue", void 0), i.value = !1, s.value = "";
    }
    return nt(() => {
      p++, a("validity", !0);
    }), (M, R) => (c(), g("section", Zr, [
      R[3] || (R[3] = d("h4", { class: "work-field-label" }, "What runs", -1)),
      e.modelValue ? T("", !0) : (c(), g("p", Qr, "No Flow bound. This stage keeps its existing external execution contract.")),
      m.value ? (c(), g("p", _r, [
        O(U(i.value ? "Flow versions unavailable" : "Flow binding unavailable") + ": " + U(n.value), 1),
        !i.value && e.modelValue ? (c(), g(Q, { key: 0 }, [
          O(" · v" + U(e.modelValue.version), 1)
        ], 64)) : T("", !0),
        O(". " + U(m.value), 1),
        b(r(J), {
          label: "Reload Flow",
          severity: "secondary",
          text: "",
          onClick: x
        })
      ])) : T("", !0),
      o.value ? (c(), g("wc-workflow-picker", {
        key: 2,
        schema: r(u),
        config: y.value,
        title: e.modelValue?.id,
        onChange: E
      }, null, 40, ed)) : (c(), g("p", td, [
        R[1] || (R[1] = O("Published Flow picker unavailable.", -1)),
        b(r(J), {
          label: "Reload Flow picker",
          text: "",
          severity: "secondary",
          onClick: w
        })
      ])),
      n.value ? (c(), g("label", ld, [
        R[2] || (R[2] = O("Published version", -1)),
        b(r(ie), {
          "model-value": i.value ? void 0 : e.modelValue?.version,
          options: v.value.map((S) => ({ label: "v" + S.version, value: S.version })),
          "option-label": "label",
          "option-value": "value",
          "aria-label": "Published version",
          placeholder: "Choose a published version",
          "append-to": "self",
          loading: f.value,
          disabled: f.value || !!m.value,
          "onUpdate:modelValue": I
        }, null, 8, ["model-value", "options", "loading", "disabled"])
      ])) : T("", !0),
      i.value ? (c(), g("p", ad, "Choose a published version of " + U(n.value) + " to finish selecting the Flow.", 1)) : T("", !0),
      e.modelValue || i.value ? (c(), W(r(J), {
        key: 6,
        label: i.value ? "Cancel Flow selection" : "Remove Flow binding",
        "aria-label": i.value ? "Cancel Flow selection" : "Remove Flow binding",
        severity: "secondary",
        text: "",
        onClick: R[0] || (R[0] = (S) => i.value ? (i.value = !1, s.value = "") : B())
      }, null, 8, ["label", "aria-label"])) : T("", !0)
    ]));
  }
}), Hl = { minutes: 60, hours: 3600, days: 86400 };
function Wt(e, l) {
  const t = /^P(\d+)W$/.exec(e), a = /^P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+\.?\d*)S)?)?$/.exec(e);
  if (!t && (!a || e === "P" || e.endsWith("T"))) return;
  const o = t ? Number(t[1]) * 604800 : Number(a[1] ?? 0) * 86400 + Number(a[2] ?? 0) * 3600 + Number(a[3] ?? 0) * 60 + Number(a[4] ?? 0);
  if (!Number.isFinite(o) || o <= 0) return;
  const s = l ?? (o % 86400 === 0 ? "days" : o % 3600 === 0 ? "hours" : "minutes");
  return { amount: o / Hl[s], unit: s };
}
function id(e, l) {
  if (e == null) return;
  if (!Number.isFinite(e * Hl[l]) || e <= 0) throw new Error("Enter a positive duration.");
  const t = (a) => a.toLocaleString("en-US", { useGrouping: !1, maximumSignificantDigits: 21 });
  return Number.isInteger(e) ? l === "days" ? `P${t(e)}D` : l === "hours" ? `PT${t(e)}H` : `PT${t(e)}M` : `PT${t(e * Hl[l])}S`;
}
const nd = { class: "work-stack work-tight" }, sd = {
  class: "work-duration-control",
  style: { "max-width": "360px" }
}, rd = {
  key: 0,
  class: "work-error",
  role: "alert"
}, Ct = /* @__PURE__ */ ve({
  __name: "DurationControl",
  props: {
    modelValue: {},
    label: {},
    disabled: { type: Boolean }
  },
  emits: ["update:modelValue", "validity"],
  setup(e, { emit: l }) {
    const t = e, a = l, o = "duration:" + Xl(), s = j("days"), v = j("");
    Ce(() => t.modelValue, (y) => {
      v.value = "";
      const p = y ? Wt(y) : void 0;
      p && (s.value = p.unit), a("validity", !y || !!p, o);
    }, { immediate: !0 });
    const f = X(() => t.modelValue ? Wt(t.modelValue, s.value)?.amount ?? null : null);
    function m(y) {
      try {
        const p = id(y, s.value);
        v.value = "", a("update:modelValue", p), a("validity", !0, o);
      } catch (p) {
        v.value = p.message, a("validity", !1, o);
      }
    }
    function i(y) {
      y == null && v.value || m(y);
    }
    function n(y) {
      y.formattedValue.trim() && (typeof y.value != "number" || !Number.isFinite(y.value)) ? (v.value = "Enter a positive duration.", a("validity", !1, o)) : m(typeof y.value == "number" ? y.value : null);
    }
    function u(y) {
      const p = f.value;
      s.value = y, !(t.modelValue && !Wt(t.modelValue)) && m(p);
    }
    return nt(() => a("validity", !0, o)), (y, p) => (c(), g("label", nd, [
      O(U(e.label), 1),
      d("span", sd, [
        b(r(Ge), {
          "model-value": f.value,
          "aria-label": e.label,
          min: 0,
          "aria-invalid": !!v.value || !!e.modelValue && !r(Wt)(e.modelValue),
          disabled: e.disabled,
          useGrouping: !1,
          onInput: n,
          "onUpdate:modelValue": p[0] || (p[0] = (w) => i(w))
        }, null, 8, ["model-value", "aria-label", "aria-invalid", "disabled"]),
        b(r(ie), {
          "model-value": s.value,
          "aria-label": e.label + " unit",
          disabled: e.disabled,
          options: [{ label: "Minutes", value: "minutes" }, { label: "Hours", value: "hours" }, { label: "Days", value: "days" }],
          optionLabel: "label",
          optionValue: "value",
          appendTo: "self",
          "onUpdate:modelValue": p[1] || (p[1] = (w) => u(w))
        }, null, 8, ["model-value", "aria-label", "disabled"])
      ]),
      v.value || e.modelValue && !r(Wt)(e.modelValue) ? (c(), g("span", rd, U(v.value || `Unsupported duration: ${e.modelValue}`), 1)) : T("", !0)
    ]));
  }
}), dd = { class: "work-stack" }, ud = { class: "work-settings-grid" }, cd = { class: "work-stack work-tight" }, vd = { class: "work-stack work-tight" }, md = {
  key: 1,
  class: "work-stack work-tight"
}, fd = { class: "work-stack work-tight" }, pd = { class: "work-settings-grid" }, bd = { class: "work-row" }, hd = { class: "work-stack work-tight" }, yd = {
  key: 0,
  class: "work-stack work-tight"
}, gd = /* @__PURE__ */ ve({
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
    function f(i, n, u) {
      u ? i[n] = u : (delete i[n], delete i.table);
    }
    function m(i, n) {
      i.then = n === "emit" ? { emit: "" } : { transition: "" };
    }
    return (i, n) => (c(), g("section", dd, [
      n[8] || (n[8] = d("h4", null, "Timers", -1)),
      (c(!0), g(Q, null, oe(o(), (u, y) => (c(), g("article", {
        key: u.id,
        class: "work-settings-card work-stack"
      }, [
        d("div", ud, [
          d("label", cd, [
            n[2] || (n[2] = O("Timer ID", -1)),
            b(r(ce), {
              modelValue: u.id,
              "onUpdate:modelValue": (p) => u.id = p,
              required: "",
              pattern: "[a-z][a-z0-9_]*"
            }, null, 8, ["modelValue", "onUpdate:modelValue"])
          ]),
          d("label", vd, [
            n[3] || (n[3] = O("Deadline", -1)),
            b(r(ie), {
              "model-value": u.at_field !== void 0 ? "at_field" : "after",
              "onUpdate:modelValue": (p) => v(u, p),
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
          u.after !== void 0 ? (c(), W(Ct, {
            key: 0,
            modelValue: u.after,
            "onUpdate:modelValue": (p) => u.after = p,
            label: "After",
            onValidity: n[0] || (n[0] = (p, w) => a("validity", w, p))
          }, null, 8, ["modelValue", "onUpdate:modelValue"])) : (c(), g("label", md, [
            n[4] || (n[4] = O("At field", -1)),
            b(r(ie), {
              modelValue: u.at_field,
              "onUpdate:modelValue": (p) => u.at_field = p,
              appendTo: "self",
              optionLabel: "label",
              optionValue: "value",
              optionDisabled: "disabled",
              options: [
                ...(e.draft.fields?.filter((p) => p.form === "time") ?? []).map((p) => ({
                  label: p.code,
                  value: p.code,
                  disabled: !1
                }))
              ]
            }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
          ])),
          d("label", fd, [
            n[5] || (n[5] = O("Duration by field", -1)),
            b(r(ie), {
              "model-value": u.by ?? "",
              "onUpdate:modelValue": (p) => f(u, "by", p),
              appendTo: "self",
              optionLabel: "label",
              optionValue: "value",
              optionDisabled: "disabled",
              options: [
                { label: "Fixed duration", value: "", disabled: !1 },
                ...(e.draft.fields ?? []).map((p) => ({
                  label: p.code,
                  value: p.code,
                  disabled: !1
                }))
              ]
            }, null, 8, ["model-value", "onUpdate:modelValue", "options"])
          ])
        ]),
        u.by ? (c(), W(ot, {
          key: 0,
          label: "Duration table",
          hint: "Map field values to ISO durations.",
          "model-value": u.table,
          shape: "object",
          "onUpdate:modelValue": (p) => u.table = p,
          onValidity: (p) => a("validity", "table-" + y, p)
        }, null, 8, ["model-value", "onUpdate:modelValue", "onValidity"])) : T("", !0),
        d("div", pd, [
          b(Ct, {
            modelValue: u.repeat,
            "onUpdate:modelValue": (p) => u.repeat = p,
            label: "Repeat every",
            onValidity: n[1] || (n[1] = (p, w) => a("validity", w, p)),
            disabled: u.interrupting
          }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"]),
          d("label", bd, [
            b(r(Mt), {
              modelValue: u.interrupting,
              "onUpdate:modelValue": [(p) => u.interrupting = p, (p) => u.interrupting && delete u.repeat],
              binary: ""
            }, null, 8, ["modelValue", "onUpdate:modelValue"]),
            n[6] || (n[6] = O("Interrupting", -1))
          ]),
          d("label", hd, [
            n[7] || (n[7] = O("Then", -1)),
            b(r(ie), {
              "model-value": u.then?.transition !== void 0 ? "transition" : "emit",
              "onUpdate:modelValue": (p) => m(u, p),
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
          u.then ? (c(), g("label", yd, [
            O(U(u.then.transition !== void 0 ? "Transition ID" : "Event name"), 1),
            u.then.transition !== void 0 ? (c(), W(r(ce), {
              key: 0,
              modelValue: u.then.transition,
              "onUpdate:modelValue": (p) => u.then.transition = p
            }, null, 8, ["modelValue", "onUpdate:modelValue"])) : (c(), W(r(ce), {
              key: 1,
              modelValue: u.then.emit,
              "onUpdate:modelValue": (p) => u.then.emit = p
            }, null, 8, ["modelValue", "onUpdate:modelValue"]))
          ])) : T("", !0)
        ]),
        b(r(J), {
          severity: "secondary",
          onClick: (p) => o().splice(y, 1),
          "aria-label": "Remove timer",
          text: "",
          size: "small"
        }, {
          default: L(() => [
            b(r(ee), {
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
        onClick: s,
        outlined: ""
      }, {
        icon: L(() => [
          b(r(ee), {
            icon: "tabler:plus",
            "aria-hidden": "true"
          })
        ]),
        _: 1
      })
    ]));
  }
}), kd = ["aria-label"], wd = { class: "work-stack work-tight" }, Vd = {
  key: 0,
  class: "work-stack work-tight"
}, $d = /* @__PURE__ */ ve({
  __name: "PrincipalSourceEditor",
  props: {
    modelValue: {},
    draft: {},
    boardId: {},
    label: {}
  },
  emits: ["update:modelValue", "validity"],
  setup(e, { emit: l }) {
    const t = e, a = l, o = X(() => Array.isArray(t.modelValue) ? "principals" : "field" in t.modelValue ? "field" : "group"), s = X(() => Array.isArray(t.modelValue) ? t.modelValue : "group" in t.modelValue && t.modelValue.group ? [{ kind: "group", id: t.modelValue.group }] : []);
    function v(m) {
      a("update:modelValue", m === "field" ? { field: "" } : m === "group" ? { group: "" } : []);
    }
    function f(m) {
      a("update:modelValue", o.value === "group" ? { group: m.at(-1)?.id ?? "" } : m);
    }
    return Oa(() => a("validity", Array.isArray(t.modelValue) ? t.modelValue.length > 0 : "field" in t.modelValue ? !!t.modelValue.field : !!t.modelValue.group)), nt(() => a("validity", !0)), (m, i) => (c(), g("section", {
      class: "work-stack work-tight",
      "aria-label": e.label
    }, [
      d("label", wd, [
        O(U(e.label) + " source", 1),
        b(r(ie), {
          "model-value": o.value,
          "aria-label": e.label + " source",
          options: [{ label: "Group", value: "group" }, { label: "People and groups", value: "principals" }, { label: "Principal field", value: "field" }],
          optionLabel: "label",
          optionValue: "value",
          appendTo: "self",
          "onUpdate:modelValue": v
        }, null, 8, ["model-value", "aria-label"])
      ]),
      "field" in e.modelValue ? (c(), g("label", Vd, [
        i[1] || (i[1] = O("Principal field", -1)),
        b(r(ie), {
          "model-value": e.modelValue.field,
          "aria-label": e.label + " field",
          options: e.draft.fields?.filter((n) => n.type === "principal").map((n) => ({ label: n.title || n.code, value: n.code })) ?? [],
          optionLabel: "label",
          optionValue: "value",
          appendTo: "self",
          "onUpdate:modelValue": i[0] || (i[0] = (n) => a("update:modelValue", { field: n }))
        }, null, 8, ["model-value", "aria-label", "options"])
      ])) : (c(), W(ea, {
        key: 1,
        "board-id": e.boardId,
        label: e.label,
        kinds: o.value === "group" ? "group" : "user,group,service",
        "model-value": s.value,
        "onUpdate:modelValue": f
      }, null, 8, ["board-id", "label", "kinds", "model-value"]))
    ], 8, kd));
  }
}), xd = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, Cd = {
  class: "work-stack work-tight",
  "aria-label": "Approval sources"
}, Sd = { class: "work-row" }, Td = {
  key: 0,
  class: "work-stack work-tight"
}, Ed = ["kinds", "value"], Ud = {
  key: 2,
  class: "work-muted work-small",
  role: "status"
}, Dd = {
  key: 3,
  class: "work-chips"
}, Id = { class: "work-row work-small" }, Ad = { class: "work-process-options" }, Pd = { class: "work-stack work-tight" }, Rd = {
  key: 4,
  class: "work-error work-small",
  role: "alert"
}, Od = {
  key: 5,
  class: "work-muted work-small"
}, Nd = /* @__PURE__ */ ve({
  __name: "ApproversEditor",
  props: {
    approvals: {},
    boardId: {}
  },
  emits: ["validity"],
  setup(e, { emit: l }) {
    const t = e, a = l, { principalLabel: o, rememberPrincipal: s, nameError: v } = Na(() => t.boardId ?? "", () => Array.isArray(t.approvals.from) ? t.approvals.from : "group" in t.approvals.from ? [{ kind: "group", id: t.approvals.from.group }] : []), f = j(!1), m = X(() => Array.isArray(t.approvals.from) ? "principals" : "field" in t.approvals.from ? "field" : "group"), i = X(() => Array.isArray(t.approvals.from) ? t.approvals.from.some((p) => p.kind === "group") || t.approvals.from.length >= t.approvals.min : "field" in t.approvals.from ? !!t.approvals.from.field : !!t.approvals.from.group);
    Oa(() => a("validity", Number.isSafeInteger(t.approvals.min) && t.approvals.min > 0 && i.value)), nt(() => a("validity", !0)), kl(async () => {
      f.value = await lt("wc-principal-picker");
    });
    function n(p) {
      t.approvals.from = p === "group" ? { group: "" } : p === "field" ? { field: "" } : [];
    }
    function u(p) {
      const w = p.detail, x = w?.principal_id ?? w?.id;
      if (m.value === "group") {
        t.approvals.from = { group: x ?? "" };
        return;
      }
      if (!x || !Array.isArray(t.approvals.from)) return;
      const E = { kind: w.type ?? w.kind ?? "user", id: x };
      w.label && s(E, w.label), t.approvals.from.some((I) => I.id === x && I.kind === E.kind) || t.approvals.from.push(E);
    }
    function y(p) {
      Array.isArray(t.approvals.from) && t.approvals.from.splice(p, 1);
    }
    return (p, w) => (c(), g(Q, null, [
      r(v) ? (c(), g("p", xd, U(r(v)), 1)) : T("", !0),
      d("section", Cd, [
        d("label", Sd, [
          w[4] || (w[4] = d("span", { class: "work-spacer" }, "Approvals needed", -1)),
          b(r(Ge), {
            modelValue: e.approvals.min,
            "onUpdate:modelValue": w[0] || (w[0] = (x) => e.approvals.min = x),
            min: 1,
            required: "",
            useGrouping: !1
          }, null, 8, ["modelValue"])
        ]),
        w[9] || (w[9] = d("span", { class: "work-field-label" }, "Approvers", -1)),
        "field" in e.approvals.from ? (c(), g("label", Td, [
          w[5] || (w[5] = O("Principal field", -1)),
          b(r(ce), {
            modelValue: e.approvals.from.field,
            "onUpdate:modelValue": w[1] || (w[1] = (x) => e.approvals.from.field = x),
            "aria-label": "Principal field"
          }, null, 8, ["modelValue"])
        ])) : f.value ? (c(), g("wc-principal-picker", {
          key: m.value,
          kinds: m.value === "group" ? "group" : "user,group,service",
          value: JSON.stringify("group" in e.approvals.from ? { type: "group", principal_id: e.approvals.from.group } : {}),
          onConfigChanged: u
        }, null, 40, Ed)) : (c(), g("p", Ud, "The principal picker is unavailable.")),
        Array.isArray(e.approvals.from) ? (c(), g("div", Dd, [
          (c(!0), g(Q, null, oe(e.approvals.from, (x, E) => (c(), W(r(Re), {
            key: x.kind + ":" + x.id,
            class: "kx-tag-sm",
            severity: "secondary"
          }, {
            default: L(() => [
              O(U(r(o)(x)), 1),
              b(r(J), {
                "aria-label": "Remove approver " + (E + 1),
                text: "",
                severity: "secondary",
                size: "small",
                onClick: (I) => y(E)
              }, {
                default: L(() => [
                  b(r(ee), {
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
        d("label", Id, [
          w[6] || (w[6] = d("span", { class: "work-spacer" }, "The person who moves the item here cannot approve this visit", -1)),
          b(r(Le), {
            modelValue: e.approvals.prevent_self,
            "onUpdate:modelValue": w[2] || (w[2] = (x) => e.approvals.prevent_self = x),
            "aria-label": "The person who moves the item here cannot approve this visit"
          }, null, 8, ["modelValue"])
        ]),
        d("details", Ad, [
          w[8] || (w[8] = d("summary", null, "Approval options", -1)),
          d("label", Pd, [
            w[7] || (w[7] = O("Approval source", -1)),
            b(r(ie), {
              "model-value": m.value,
              "onUpdate:modelValue": w[3] || (w[3] = (x) => n(x)),
              appendTo: "self",
              optionLabel: "label",
              optionValue: "value",
              options: [{ label: "Group members", value: "group" }, { label: "People and groups", value: "principals" }, { label: "Principal field", value: "field" }]
            }, null, 8, ["model-value"])
          ])
        ]),
        Array.isArray(e.approvals.from) && !i.value ? (c(), g("p", Rd, "Select at least " + U(e.approvals.min) + " distinct principals, or lower the minimum.", 1)) : "group" in e.approvals.from && !e.approvals.from.group ? (c(), g("p", Od, "Choose the group that can approve this state.")) : T("", !0)
      ])
    ], 64));
  }
}), Md = {
  class: "work-state-settings work-stack",
  "aria-label": "State settings"
}, Fd = { class: "work-process-kind" }, Ld = { class: "work-process-options" }, zd = { class: "work-stack" }, Bd = { class: "work-row" }, jd = { class: "work-stack work-tight" }, qd = { class: "work-row" }, Wd = { class: "work-stack work-tight" }, Kd = { class: "work-row" }, Gd = { class: "work-row" }, Yd = { class: "work-stack work-tight" }, Hd = { class: "work-row" }, Xd = { class: "work-stack work-tight" }, Jd = { class: "work-stack work-tight" }, Zd = {
  key: 0,
  class: "work-row"
}, Qd = { class: "work-row" }, _d = { class: "work-row" }, eu = { class: "work-stack work-tight" }, tu = { class: "work-row" }, lu = /* @__PURE__ */ ve({
  __name: "StateSettings",
  props: {
    state: {},
    process: {},
    draft: {},
    boardId: {}
  },
  emits: ["validity"],
  setup(e, { emit: l }) {
    const t = e, a = l, o = X(() => (t.process.transitions ?? []).filter((m) => m.from === "any" || m.from.includes(t.state.id))), s = [{ value: "human", icon: "user" }, { value: "gate", icon: "shield-check" }, { value: "automated", icon: "bolt" }, { value: "parallel", icon: "arrows-split" }];
    function v(m) {
      const i = t.state;
      i.kind = m, delete i.run, delete i.release_when, delete i.regions, delete i.join, delete i.due, (m === "automated" || m === "gate") && delete i.awaiting, m === "automated" && (i.run = { stage: i.id, retry: { max: 1, backoff: "PT1M" } }), m === "gate" && (i.release_when = { approvals: { min: 1, from: { group: "" }, prevent_self: !0 } }), m === "parallel" && (i.regions = [{ id: "region_1", initial: t.process.states.find((n) => n.id !== i.id)?.id ?? "" }], i.join = "all");
    }
    function f(m) {
      t.state.run && (m ? t.state.run.on_fail = m : delete t.state.run.on_fail);
    }
    return (m, i) => (c(), g("section", Md, [
      i[52] || (i[52] = d("h4", { class: "work-process-group" }, "Who moves the item on", -1)),
      b(r(Ql), {
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
        option: L(({ option: n }) => [
          d("span", Fd, [
            b(r(ee), {
              icon: "tabler:" + n.icon
            }, null, 8, ["icon"]),
            d("span", null, U(n.label), 1)
          ])
        ]),
        _: 1
      }, 8, ["model-value", "options"]),
      e.state.kind === "gate" && e.state.release_when ? (c(), g(Q, { key: 0 }, [
        i[33] || (i[33] = d("h4", { class: "work-process-group" }, "Approval", -1)),
        e.state.release_when.approvals ? (c(), W(Nd, {
          key: 0,
          "board-id": e.boardId,
          approvals: e.state.release_when.approvals,
          onValidity: i[0] || (i[0] = (n) => a("validity", "approvers", n))
        }, null, 8, ["board-id", "approvals"])) : T("", !0),
        d("details", Ld, [
          i[32] || (i[32] = d("summary", null, "Release options", -1)),
          d("div", zd, [
            d("label", Bd, [
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
            b(_l, {
              label: "Release when",
              draft: e.draft,
              "board-id": e.boardId,
              modelValue: e.state.release_when.when,
              "onUpdate:modelValue": i[4] || (i[4] = (n) => e.state.release_when.when = n),
              onValidity: i[5] || (i[5] = (n) => a("validity", "release", n))
            }, null, 8, ["draft", "board-id", "modelValue"])
          ])
        ])
      ], 64)) : T("", !0),
      e.state.kind === "automated" && e.state.run ? (c(), g(Q, { key: 1 }, [
        i[40] || (i[40] = d("h4", { class: "work-process-group" }, "Automation", -1)),
        d("label", jd, [
          i[34] || (i[34] = O("Run label", -1)),
          b(r(ce), {
            modelValue: e.state.run.stage,
            "onUpdate:modelValue": i[6] || (i[6] = (n) => e.state.run.stage = n),
            "aria-label": "Run label",
            required: ""
          }, null, 8, ["modelValue"])
        ]),
        b(od, {
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
        d("label", qd, [
          i[35] || (i[35] = d("span", { class: "work-spacer" }, "Maximum visits", -1)),
          b(r(Ge), {
            "model-value": e.state.run.max_visits ?? null,
            "aria-label": "Maximum visits",
            min: 1,
            useGrouping: !1,
            placeholder: "Board default",
            "onUpdate:modelValue": i[11] || (i[11] = (n) => e.state.run.max_visits = n ?? void 0)
          }, null, 8, ["model-value"])
        ]),
        d("label", Wd, [
          i[36] || (i[36] = O("When visits are exhausted", -1)),
          b(r(ie), {
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
        d("label", Kd, [
          i[37] || (i[37] = d("span", { class: "work-spacer" }, "Retry if it fails", -1)),
          b(r(Le), {
            "model-value": !!e.state.run.retry,
            "aria-label": "Retry if it fails",
            "onUpdate:modelValue": i[13] || (i[13] = (n) => e.state.run.retry = n ? { max: 1, backoff: "PT1M" } : void 0)
          }, null, 8, ["model-value"])
        ]),
        e.state.run.retry ? (c(), g(Q, { key: 0 }, [
          d("label", Gd, [
            i[38] || (i[38] = d("span", { class: "work-spacer" }, "Maximum attempts", -1)),
            b(r(Ge), {
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
        ], 64)) : T("", !0),
        (c(), g(Q, null, oe([{ key: "on_pass", label: "On success" }, { key: "on_cancel", label: "On cancellation" }], (n) => d("label", {
          key: n.key,
          class: "work-stack work-tight"
        }, [
          O(U(n.label), 1),
          b(r(ie), {
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
        d("label", Yd, [
          i[39] || (i[39] = O("If it fails, go to", -1)),
          b(r(ie), {
            "model-value": e.state.run.on_fail,
            "onUpdate:modelValue": f,
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            showClear: "",
            options: o.value.map((n) => ({
              label: r(je)(n) + " → " + r(ye)(e.process.states.find((u) => u.id === n.to)),
              value: n.id
            }))
          }, null, 8, ["model-value", "options"])
        ])
      ], 64)) : T("", !0),
      e.state.kind === "parallel" && e.state.regions ? (c(), g(Q, { key: 2 }, [
        i[47] || (i[47] = d("h4", { class: "work-process-group" }, "Lanes", -1)),
        (c(!0), g(Q, null, oe(e.state.regions, (n, u) => (c(), g("div", {
          key: u,
          class: "work-process-value work-stack work-tight"
        }, [
          d("div", Hd, [
            d("span", null, "Lane " + U(u + 1), 1),
            i[43] || (i[43] = d("span", { class: "work-spacer" }, null, -1)),
            b(r(J), {
              severity: "danger",
              text: "",
              size: "small",
              "aria-label": "Remove lane",
              onClick: (y) => e.state.regions.splice(u, 1)
            }, {
              default: L(() => [
                b(r(ee), { icon: "tabler:trash" })
              ]),
              _: 1
            }, 8, ["onClick"])
          ]),
          d("label", Xd, [
            i[44] || (i[44] = O("Starts at", -1)),
            b(r(ie), {
              modelValue: n.initial,
              "onUpdate:modelValue": (y) => n.initial = y,
              appendTo: "self",
              optionLabel: "label",
              optionValue: "value",
              options: e.process.states.filter((y) => y.id !== e.state.id).map((y) => ({ label: r(ye)(y), value: y.id }))
            }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
          ])
        ]))), 128)),
        b(r(J), {
          label: "Add lane",
          severity: "secondary",
          outlined: "",
          size: "small",
          onClick: i[17] || (i[17] = (n) => e.state.regions.push({
            id: r($t)("region", e.state.regions),
            initial: e.process.states.find((u) => u.id !== e.state.id)?.id ?? ""
          }))
        }, {
          icon: L(() => [
            b(r(ee), { icon: "tabler:plus" })
          ]),
          _: 1
        }),
        d("label", Jd, [
          i[45] || (i[45] = O("Finish rule", -1)),
          b(r(ie), {
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
        typeof e.state.join == "number" ? (c(), g("label", Zd, [
          i[46] || (i[46] = d("span", { class: "work-spacer" }, "Lanes needed", -1)),
          b(r(Ge), {
            modelValue: e.state.join,
            "onUpdate:modelValue": i[19] || (i[19] = (n) => e.state.join = n),
            min: 1,
            max: e.state.regions.length,
            useGrouping: !1
          }, null, 8, ["modelValue", "max"])
        ])) : T("", !0)
      ], 64)) : T("", !0),
      i[53] || (i[53] = d("h4", { class: "work-process-group" }, "Limit", -1)),
      d("label", Qd, [
        i[48] || (i[48] = d("span", { class: "work-spacer" }, "Items allowed here", -1)),
        b(gl, {
          draft: e.draft,
          state: e.state.id,
          label: "Items allowed here"
        }, null, 8, ["draft", "state"])
      ]),
      d("label", _d, [
        i[49] || (i[49] = d("span", { class: "work-spacer" }, [
          O("Refuse moves over the limit"),
          d("small", { class: "work-muted work-block" }, "Off only warns")
        ], -1)),
        b(gl, {
          draft: e.draft,
          state: e.state.id,
          label: "Refuse moves over the limit",
          hard: ""
        }, null, 8, ["draft", "state"])
      ]),
      i[54] || (i[54] = d("h4", { class: "work-process-group" }, "Required on entry", -1)),
      b(Lt, {
        label: "Required fields",
        options: e.draft.fields?.map((n) => ({ value: n.code, label: n.title || n.code })) ?? [],
        modelValue: e.state.require,
        "onUpdate:modelValue": i[20] || (i[20] = (n) => e.state.require = n)
      }, null, 8, ["options", "modelValue"]),
      !e.state.kind || e.state.kind === "human" ? (c(), W(Ct, {
        key: 3,
        modelValue: e.state.due,
        "onUpdate:modelValue": i[21] || (i[21] = (n) => e.state.due = n),
        label: "Time allowed in this state",
        onValidity: i[22] || (i[22] = (n, u) => a("validity", u, n))
      }, null, 8, ["modelValue"])) : T("", !0),
      i[55] || (i[55] = d("h4", { class: "work-process-group" }, "Assignment and conditions", -1)),
      d("label", eu, [
        i[50] || (i[50] = O("Stage label", -1)),
        b(r(ce), {
          "model-value": e.state.stage,
          "aria-label": "Stage label",
          "onUpdate:modelValue": i[23] || (i[23] = (n) => e.state.stage = n || void 0)
        }, null, 8, ["model-value"])
      ]),
      !e.state.kind || e.state.kind === "human" || e.state.kind === "parallel" ? (c(), g(Q, { key: 4 }, [
        d("label", tu, [
          b(r(Le), {
            "model-value": !!e.state.awaiting,
            "aria-label": "Awaiting people",
            "onUpdate:modelValue": i[24] || (i[24] = (n) => e.state.awaiting = n ? { group: "" } : void 0)
          }, null, 8, ["model-value"]),
          i[51] || (i[51] = O("Awaiting people", -1))
        ]),
        e.state.awaiting ? (c(), W($d, {
          key: 0,
          modelValue: e.state.awaiting,
          "onUpdate:modelValue": i[25] || (i[25] = (n) => e.state.awaiting = n),
          draft: e.draft,
          "board-id": e.boardId,
          label: "Awaiting",
          onValidity: i[26] || (i[26] = (n) => a("validity", "awaiting", n))
        }, null, 8, ["modelValue", "draft", "board-id"])) : T("", !0)
      ], 64)) : T("", !0),
      b(ea, {
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
      b(gd, {
        state: e.state,
        draft: e.draft,
        onValidity: i[30] || (i[30] = (n, u) => a("validity", "timer-" + n, u))
      }, null, 8, ["state", "draft"])
    ]));
  }
}), au = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, ou = {
  class: "work-process-controls",
  role: "toolbar",
  "aria-label": "Process tools"
}, iu = {
  key: 1,
  class: "work-process-title"
}, nu = { class: "work-muted" }, su = {
  key: 2,
  class: "work-map-zoom",
  role: "group",
  "aria-label": "Map zoom"
}, ru = ["aria-label"], du = { class: "work-row" }, uu = { class: "work-process-meaning" }, cu = { class: "work-stack work-tight" }, vu = { class: "work-process-inspector-foot" }, mu = { class: "work-row" }, fu = { class: "work-process-meaning" }, pu = { class: "work-stack work-tight" }, bu = { class: "work-process-inspector-foot" }, hu = {
  key: 3,
  class: "work-row"
}, yu = { class: "work-stack work-tight" }, gu = { class: "work-dialog-actions" }, ku = /* @__PURE__ */ ve({
  __name: "ProcessEditor",
  props: {
    draft: {},
    guardRemoval: { type: Function },
    issues: {},
    boardId: {}
  },
  emits: ["validity"],
  setup(e, { emit: l }) {
    const t = e, a = l, o = X(() => t.draft.processes ?? []), s = j(!1), v = j(""), f = j(""), m = j(""), i = j("Map"), n = j(""), u = j(), y = j(), p = j(), w = j(), x = j(!1);
    let E;
    async function I() {
      x.value = !0, await ra(), w.value?.querySelector('[aria-label="State name"]')?.focus();
    }
    const B = X(() => o.value.find((z) => z.id === f.value) ?? o.value[0]);
    function M() {
      x.value = !1, u.value = void 0, y.value = void 0, m.value = "", E = void 0;
    }
    async function R() {
      const z = E;
      M(), await ra(), z?.isConnected && z.focus();
    }
    function S(z, C) {
      E = C, x.value = !1, u.value = z, y.value = void 0, n.value = "", m.value = "";
    }
    function q(z, C) {
      E = C, x.value = !1, y.value = z, u.value = void 0, m.value = "";
    }
    Ce(B, M);
    function N(z) {
      z === "__new" ? s.value = !0 : f.value = z;
    }
    function ae() {
      const z = v.value.trim();
      if (!z) return;
      const C = z.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "") || "process", F = (/^[a-z]/.test(C) ? C : "process_" + C).slice(0, 40), _ = o.value.some((ke) => ke.id === F) ? $t(F, o.value) : F;
      (t.draft.processes ??= []).push({ id: _, name: z, initial: "todo", states: [{ id: "todo", name: "To do", category: "unstarted" }], transitions: [] }), f.value = _, v.value = "", s.value = !1;
    }
    async function ne(z, C) {
      const F = { id: $t("state", z.states), name: "New state", category: "started" }, _ = Bl(z), ke = _.at(-1), pe = u.value ?? (ke?.category === "completed" ? _.at(-2) : ke), ge = pe && (z.transitions?.find((h) => h.default && h.from !== "any" && h.from.includes(pe.id)) ?? z.transitions?.find((h) => h.from !== "any" && h.from.includes(pe.id) && z.states.findIndex(($) => $.id === h.to) > z.states.indexOf(pe)));
      if (z.states.splice(pe ? z.states.indexOf(pe) + 1 : z.states.length, 0, F), pe && pe.category !== "completed" && pe.category !== "canceled")
        if (ge) {
          const h = ge.to;
          ge.to = F.id, (z.transitions ??= []).push({ id: $t("transition", z.transitions ?? []), name: "Continue", from: [F.id], to: h, ...ge.auto && ge.default ? { auto: !0, default: !0 } : {} });
        } else (z.transitions ??= []).push({ id: $t("transition", z.transitions ?? []), name: "Continue", from: [pe.id], to: F.id });
      S(F, C), await I();
    }
    function G(z, C, F = E) {
      const _ = B.value;
      if (!_ || !C || z === C) return;
      let ke = `to_${C}`, pe = 2;
      for (; _.transitions?.some((h) => h.id === ke); ) ke = `to_${C}_${pe++}`;
      const ge = { id: ke, name: `To ${ye(_.states.find((h) => h.id === C)).toLowerCase()}`, from: [z], to: C };
      (_.transitions ??= []).push(ge), q(ge, F);
    }
    function A(z, C) {
      const F = { id: $t("transition", z.transitions ?? []), name: "To " + ye(z.states.at(-1)), from: [z.initial], to: z.states.at(-1)?.id ?? z.initial };
      (z.transitions ??= []).push(F), q(F, C);
    }
    function P(z, C) {
      const F = To(z, C);
      if (F.length) {
        m.value = `Used by ${F.join(", ")}. Update those references first.`;
        return;
      }
      z.transitions?.splice(z.transitions.indexOf(C), 1), M();
    }
    function V(z, C) {
      const F = Eo(z, C);
      if (F.length) {
        m.value = `${ye(C)} is used by ${F.join(", ")}. Update these references first.`;
        return;
      }
      z.states.splice(z.states.indexOf(C), 1), M();
    }
    async function D(z) {
      const C = t.draft.item_types?.filter((_) => _.process === z.id).map((_) => _.title || "Untitled item type") ?? [];
      if (C.length) {
        m.value = `Used by ${C.join(", ")}. Choose a different process for those item types first.`;
        return;
      }
      const F = await t.guardRemoval?.("processes", z.id);
      if (F) {
        m.value = F;
        return;
      }
      _t(t.draft, "processes", z.id), f.value = "", M();
    }
    return (z, C) => (c(), g("section", {
      class: "work-process-editor work-stack",
      "aria-label": "Process editor",
      onKeydown: Ae(R, ["esc"])
    }, [
      m.value ? (c(), g("p", au, U(m.value), 1)) : T("", !0),
      (c(!0), g(Q, null, oe(e.issues?.filter((F) => F.code === "process " + B.value?.id) ?? [], (F) => (c(), g("p", {
        key: F.what + F.detail,
        class: "work-error work-small",
        role: "alert"
      }, U(r(wl)(F)) + " · " + U(F.what), 1))), 128)),
      B.value ? (c(), g("div", {
        key: 1,
        class: pt(["work-process-builder", { "work-process-inspecting": u.value || y.value }])
      }, [
        d("div", ou, [
          o.value.length > 1 ? (c(), W(r(ie), {
            key: 0,
            "model-value": B.value.id,
            "aria-label": "Process",
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            options: [
              ...o.value.map((F) => ({ label: F.name || "Untitled process", value: F.id })),
              { label: "New process…", value: "__new" }
            ],
            "onUpdate:modelValue": N
          }, null, 8, ["model-value", "options"])) : (c(), g("span", iu, U(B.value.name || "Process"), 1)),
          b(r(J), {
            label: "Add state",
            severity: "secondary",
            outlined: "",
            size: "small",
            onClick: C[0] || (C[0] = (F) => ne(B.value, F.currentTarget))
          }, {
            icon: L(() => [
              b(r(ee), { icon: "tabler:plus" })
            ]),
            _: 1
          }),
          b(r(ie), {
            modelValue: B.value.initial,
            "onUpdate:modelValue": C[1] || (C[1] = (F) => B.value.initial = F),
            "aria-label": "Starts in " + r(ye)(B.value.states.find((F) => F.id === B.value.initial)),
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            options: B.value.states.map((F) => ({ label: r(ye)(F), value: F.id }))
          }, {
            value: L(() => [
              d("span", nu, "Starts in " + U(r(ye)(B.value.states.find((F) => F.id === B.value.initial))), 1)
            ]),
            _: 1
          }, 8, ["modelValue", "aria-label", "options"]),
          C[17] || (C[17] = d("span", { class: "work-spacer" }, null, -1)),
          i.value === "Map" ? (c(), g("div", su, [
            b(r(J), {
              label: "Fit",
              title: "Fit to width and show the full process",
              text: "",
              severity: "secondary",
              size: "small",
              onClick: C[2] || (C[2] = (F) => p.value?.fit())
            }, {
              icon: L(() => [
                b(r(ee), { icon: "tabler:arrows-maximize" })
              ]),
              _: 1
            }),
            i.value === "Map" ? (c(), W(r(J), {
              key: 0,
              "aria-label": "Zoom out",
              title: "Zoom out",
              text: "",
              severity: "secondary",
              size: "small",
              onClick: C[3] || (C[3] = (F) => p.value?.zoomOut())
            }, {
              default: L(() => [
                b(r(ee), { icon: "tabler:minus" })
              ]),
              _: 1
            })) : T("", !0),
            i.value === "Map" ? (c(), W(r(J), {
              key: 1,
              "aria-label": "Zoom in",
              title: "Zoom in",
              text: "",
              severity: "secondary",
              size: "small",
              onClick: C[4] || (C[4] = (F) => p.value?.zoomIn())
            }, {
              default: L(() => [
                b(r(ee), { icon: "tabler:plus" })
              ]),
              _: 1
            })) : T("", !0)
          ])) : T("", !0),
          b(r(Ql), {
            modelValue: i.value,
            "onUpdate:modelValue": C[5] || (C[5] = (F) => i.value = F),
            options: ["Map", "List"],
            "allow-empty": !1,
            "aria-label": "Process layout"
          }, null, 8, ["modelValue"]),
          o.value.length === 1 ? (c(), W(r(J), {
            key: 3,
            label: "New process",
            "aria-label": "New process",
            text: "",
            severity: "secondary",
            size: "small",
            onClick: C[6] || (C[6] = (F) => s.value = !0)
          }, {
            icon: L(() => [
              b(r(ee), { icon: "tabler:plus" })
            ]),
            _: 1
          })) : T("", !0)
        ]),
        i.value === "Map" ? (c(), W(wr, {
          key: 0,
          ref_key: "graph",
          ref: p,
          process: B.value,
          draft: e.draft,
          "selected-state": u.value,
          "selected-transition": y.value,
          onState: S,
          onTransition: q,
          onConnect: G,
          onClear: R
        }, null, 8, ["process", "draft", "selected-state", "selected-transition"])) : (c(), W(zr, {
          key: 1,
          process: B.value,
          "selected-state": u.value,
          "selected-transition": y.value,
          onState: S,
          onTransition: q,
          onRemoveState: C[7] || (C[7] = (F) => V(B.value, F)),
          onRemoveTransition: C[8] || (C[8] = (F) => P(B.value, F)),
          onAddTransition: C[9] || (C[9] = (F) => A(B.value, F))
        }, null, 8, ["process", "selected-state", "selected-transition"])),
        u.value || y.value ? (c(), g("aside", {
          key: 2,
          ref_key: "inspector",
          ref: w,
          class: "work-process-sideform",
          "aria-label": u.value ? "State inspector" : "Transition inspector"
        }, [
          (c(!0), g(Q, null, oe(u.value ? [u.value] : [], (F) => (c(), g(Q, {
            key: F.id
          }, [
            d("header", du, [
              x.value ? (c(), W(r(ce), {
                key: 1,
                modelValue: F.name,
                "onUpdate:modelValue": (_) => F.name = _,
                class: "work-process-name",
                "aria-label": "State name",
                onBlur: C[10] || (C[10] = (_) => x.value = !1)
              }, null, 8, ["modelValue", "onUpdate:modelValue"])) : (c(), W(Jl, {
                key: 0,
                class: "work-process-state-title",
                "aria-label": "Rename state",
                onActivate: I
              }, {
                default: L(() => [
                  d("span", null, U(r(ye)(F)), 1)
                ]),
                _: 2
              }, 1024)),
              b(r(J), {
                severity: "secondary",
                text: "",
                size: "small",
                "aria-label": "Close state editor",
                onClick: R
              }, {
                default: L(() => [
                  b(r(ee), { icon: "tabler:x" })
                ]),
                _: 1
              })
            ]),
            d("p", uu, U(r(So)(F, e.draft)), 1),
            b(lu, {
              state: F,
              process: B.value,
              draft: e.draft,
              "board-id": e.boardId,
              onValidity: (_, ke) => a("validity", _.includes("duration:") ? _ : B.value.id + ":" + F.id + ":" + _, ke)
            }, null, 8, ["state", "process", "draft", "board-id", "onValidity"]),
            d("label", cu, [
              C[18] || (C[18] = O("Phase", -1)),
              b(r(ie), {
                modelValue: F.category,
                "onUpdate:modelValue": (_) => F.category = _,
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                options: ["triage", "backlog", ...r(Ma)].map((_) => ({ label: r(Zl)(_), value: _ }))
              }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
            ]),
            C[19] || (C[19] = d("h4", { class: "work-process-group" }, "Next stop", -1)),
            b(r(ie), {
              modelValue: n.value,
              "onUpdate:modelValue": C[11] || (C[11] = (_) => n.value = _),
              "aria-label": "Add transition to…",
              placeholder: "Add transition to…",
              appendTo: "self",
              optionLabel: "label",
              optionValue: "value",
              options: B.value.states.filter((_) => _ !== F).map((_) => ({ label: r(ye)(_), value: _.id }))
            }, null, 8, ["modelValue", "options"]),
            b(r(J), {
              label: "Add transition",
              severity: "secondary",
              outlined: "",
              size: "small",
              disabled: !n.value,
              onClick: (_) => G(F.id, n.value)
            }, {
              icon: L(() => [
                b(r(ee), { icon: "tabler:arrow-right" })
              ]),
              _: 1
            }, 8, ["disabled", "onClick"]),
            d("footer", vu, [
              b(r(J), {
                label: "Remove state",
                severity: "danger",
                text: "",
                size: "small",
                onClick: (_) => V(B.value, F)
              }, {
                icon: L(() => [
                  b(r(ee), { icon: "tabler:trash" })
                ]),
                _: 1
              }, 8, ["onClick"])
            ])
          ], 64))), 128)),
          (c(!0), g(Q, null, oe(y.value ? [y.value] : [], (F) => (c(), g(Q, {
            key: F.id
          }, [
            d("header", mu, [
              C[20] || (C[20] = d("h3", null, "Transition", -1)),
              C[21] || (C[21] = d("span", { class: "work-spacer" }, null, -1)),
              b(r(J), {
                severity: "secondary",
                text: "",
                size: "small",
                "aria-label": "Close transition editor",
                onClick: R
              }, {
                default: L(() => [
                  b(r(ee), { icon: "tabler:x" })
                ]),
                _: 1
              })
            ]),
            d("p", fu, U(F.from === "any" ? "Any state" : F.from.map((_) => r(ye)(B.value.states.find((ke) => ke.id === _))).join(", ")) + " → " + U(r(ye)(B.value.states.find((_) => _.id === F.to))), 1),
            d("label", pu, [
              C[22] || (C[22] = O("Name", -1)),
              b(r(ce), {
                modelValue: F.name,
                "onUpdate:modelValue": (_) => F.name = _,
                placeholder: r(je)(F),
                "aria-label": "Transition name"
              }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder"])
            ]),
            b(Jr, {
              transition: F,
              process: B.value,
              draft: e.draft,
              "board-id": e.boardId,
              onValidity: (_, ke) => a("validity", B.value.id + ":transition-" + F.id + ":" + _, ke)
            }, null, 8, ["transition", "process", "draft", "board-id", "onValidity"]),
            d("footer", bu, [
              b(r(J), {
                label: "Remove transition",
                severity: "danger",
                text: "",
                size: "small",
                onClick: (_) => P(B.value, F)
              }, {
                icon: L(() => [
                  b(r(ee), { icon: "tabler:trash" })
                ]),
                _: 1
              }, 8, ["onClick"])
            ])
          ], 64))), 128))
        ], 8, ru)) : T("", !0)
      ], 2)) : (c(), W(r(J), {
        key: 2,
        label: "New process",
        severity: "secondary",
        outlined: "",
        onClick: C[12] || (C[12] = (F) => s.value = !0)
      }, {
        icon: L(() => [
          b(r(ee), { icon: "tabler:plus" })
        ]),
        _: 1
      })),
      i.value === "List" && B.value ? (c(), g("div", hu, [
        b(r(J), {
          label: "Remove process",
          severity: "danger",
          text: "",
          size: "small",
          onClick: C[13] || (C[13] = (F) => D(B.value))
        }, {
          icon: L(() => [
            b(r(ee), { icon: "tabler:trash" })
          ]),
          _: 1
        })
      ])) : T("", !0),
      b(za, {
        visible: s.value,
        label: "New process",
        onClose: C[16] || (C[16] = (F) => s.value = !1)
      }, {
        default: L(() => [
          d("form", {
            class: "work-dialog-box",
            "aria-label": "New process",
            onSubmit: he(ae, ["stop", "prevent"])
          }, [
            C[24] || (C[24] = d("h2", null, "New process", -1)),
            d("label", yu, [
              C[23] || (C[23] = O("Name", -1)),
              b(r(ce), {
                modelValue: v.value,
                "onUpdate:modelValue": C[14] || (C[14] = (F) => v.value = F),
                "aria-label": "New process name",
                autofocus: "",
                required: ""
              }, null, 8, ["modelValue"])
            ]),
            d("div", gu, [
              b(r(J), {
                label: "Cancel",
                severity: "secondary",
                outlined: "",
                onClick: C[15] || (C[15] = (F) => s.value = !1)
              }),
              b(r(J), {
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
}), wu = ["inert"], Vu = { class: "work-stack work-tight" }, $u = /* @__PURE__ */ ve({
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
      (c(!0), g(Q, null, oe(e.draft.processes ?? [], (v) => (c(), g("div", {
        key: v.id,
        class: "work-stack"
      }, [
        d("label", Vu, [
          O(U(v.name || "Untitled process"), 1),
          b(r(ie), {
            disabled: e.disabled,
            "model-value": r(ca)(v),
            "aria-label": "Existing items in " + (v.name || "this process"),
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            options: [
              { label: "Follow new process", value: "follow" },
              { label: "Keep current process", value: "pin" }
            ],
            "onUpdate:modelValue": (f) => v.migration = f
          }, null, 8, ["disabled", "model-value", "aria-label", "onUpdate:modelValue"])
        ]),
        r(ca)(v) !== "pin" ? (c(!0), g(Q, { key: 0 }, oe(a(v), (f) => (c(), g("label", {
          key: f.id,
          class: "work-stack work-tight"
        }, [
          O("Move items from " + U(r(ye)(f)) + " to", 1),
          b(r(ie), {
            disabled: e.disabled,
            "model-value": v.map?.[f.id],
            placeholder: "Choose a surviving state",
            appendTo: "self",
            showClear: "",
            optionLabel: "label",
            optionValue: "value",
            options: v.states.map((m) => ({ label: r(ye)(m), value: m.id })),
            "onUpdate:modelValue": (m) => t(v, f.id, m)
          }, null, 8, ["disabled", "model-value", "options", "onUpdate:modelValue"])
        ]))), 128)) : T("", !0)
      ]))), 128))
    ], 8, wu));
  }
}), xu = {
  class: "work-stack",
  "aria-label": "Policy editor"
}, Cu = { class: "work-settings-list" }, Su = { class: "work-settings-row" }, Tu = { class: "work-row-control" }, Eu = { class: "work-settings-list work-wip-container" }, Uu = { class: "work-wip-table" }, Du = { class: "work-mono" }, Iu = { class: "work-row-main" }, Au = { class: "work-row" }, Pu = { class: "work-row" }, Ru = { class: "work-settings-list" }, Ou = { class: "work-settings-row" }, Nu = { class: "work-row-control" }, Mu = { class: "work-row-main" }, Fu = { class: "work-row-title" }, Lu = { class: "work-muted work-small" }, zu = { class: "work-row-control" }, Bu = /* @__PURE__ */ ve({
  __name: "PolicyEditor",
  props: {
    draft: {}
  },
  emits: ["validity"],
  setup(e, { emit: l }) {
    const t = e, a = l, o = X(() => t.draft.policy ?? {}), s = X(() => [...new Set(t.draft.processes?.flatMap((n) => n.states.map((u) => u.id)) ?? [])]), v = ["audit_days", "trash_days", "tombstone_days", "interval_days"], f = { audit_days: "Zero selects 365 days.", interval_days: "Zero selects 365 days.", trash_days: "Zero allows immediate cleanup of trashed items.", tombstone_days: "Zero allows immediate cleanup of deletion records." };
    function m(n, u) {
      u === void 0 ? t.draft.policy && delete t.draft.policy[n] : (t.draft.policy ??= {})[n] = u;
    }
    function i(n, u) {
      m(n, u ?? void 0);
    }
    return (n, u) => (c(), g("section", xu, [
      u[13] || (u[13] = d("header", { class: "work-section-heading" }, [
        d("div", null, [
          d("h2", null, "Policy"),
          d("p", { class: "work-muted work-small" }, "Set capacity and how long the board keeps its history.")
        ])
      ], -1)),
      u[14] || (u[14] = d("h3", { class: "work-group-title" }, "Item keys", -1)),
      d("div", Cu, [
        d("div", Su, [
          u[7] || (u[7] = d("div", { class: "work-row-main" }, [
            d("strong", { class: "work-row-title" }, "Item key prefix"),
            d("p", { class: "work-muted work-small" }, "Work reviews and claims prefix changes when you apply the schema.")
          ], -1)),
          d("div", Tu, [
            b(r(ce), {
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
      d("div", Eu, [
        d("table", Uu, [
          u[8] || (u[8] = d("thead", null, [
            d("tr", null, [
              d("th", null, "State"),
              d("th", null, "Limit"),
              d("th", null, "Hard limit")
            ])
          ], -1)),
          d("tbody", null, [
            (c(!0), g(Q, null, oe(s.value, (y) => (c(), g("tr", { key: y }, [
              d("td", null, [
                d("strong", null, U(e.draft.processes?.flatMap((p) => p.states).find((p) => p.id === y)?.name || r(Ve)(y)), 1),
                d("code", Du, U(y), 1)
              ]),
              d("td", null, [
                b(gl, {
                  draft: e.draft,
                  state: y,
                  label: y + " WIP limit"
                }, null, 8, ["draft", "state", "label"])
              ]),
              d("td", null, [
                b(gl, {
                  draft: e.draft,
                  state: y,
                  label: y + " hard WIP limit",
                  hard: ""
                }, null, 8, ["draft", "state", "label"])
              ])
            ]))), 128))
          ])
        ]),
        (c(!0), g(Q, null, oe(Object.keys(o.value.wip ?? {}).filter((y) => !s.value.includes(y)), (y) => (c(), g("div", {
          key: y,
          class: "work-settings-row"
        }, [
          d("div", Iu, [
            O(U(r(Ve)(y)) + " ", 1),
            u[9] || (u[9] = d("span", { class: "work-muted" }, "Removed state", -1))
          ]),
          b(r(J), {
            label: "Remove stale limit",
            severity: "secondary",
            outlined: "",
            onClick: (p) => delete o.value.wip[y]
          }, {
            icon: L(() => [
              b(r(ee), { icon: "tabler:trash" })
            ]),
            _: 1
          }, 8, ["onClick"])
        ]))), 128))
      ]),
      u[17] || (u[17] = d("h3", { class: "work-group-title" }, "Automated stages", -1)),
      b(Ct, {
        "model-value": o.value.stage_timeout,
        "onUpdate:modelValue": u[1] || (u[1] = (y) => m("stage_timeout", y)),
        label: "Default attempt timeout",
        onValidity: u[2] || (u[2] = (y, p) => a("validity", p, y))
      }, null, 8, ["model-value"]),
      u[18] || (u[18] = d("p", { class: "work-muted work-small" }, "Blank uses one hour. Each retry gets a new deadline.", -1)),
      d("label", Au, [
        u[10] || (u[10] = d("span", { class: "work-spacer" }, "Default maximum visits", -1)),
        b(r(Ge), {
          "model-value": o.value.stage_max_visits ?? null,
          "aria-label": "Default maximum visits",
          min: 1,
          useGrouping: !1,
          placeholder: "5",
          "onUpdate:modelValue": u[3] || (u[3] = (y) => m("stage_max_visits", y ?? void 0))
        }, null, 8, ["model-value"])
      ]),
      u[19] || (u[19] = d("h3", { class: "work-group-title" }, "Comments", -1)),
      d("label", Pu, [
        u[11] || (u[11] = d("span", { class: "work-spacer" }, "Comments per item", -1)),
        b(r(Ge), {
          "model-value": o.value.comments_per_item ?? null,
          "aria-label": "Comments per item",
          min: 1,
          max: 1e5,
          useGrouping: !1,
          placeholder: "Application default",
          "onUpdate:modelValue": u[4] || (u[4] = (y) => m("comments_per_item", y ?? void 0))
        }, null, 8, ["model-value"])
      ]),
      u[20] || (u[20] = d("p", { class: "work-muted work-small" }, "Blank follows the application default.", -1)),
      u[21] || (u[21] = d("h3", { class: "work-group-title" }, "Saved query filters", -1)),
      u[22] || (u[22] = d("p", { class: "work-muted work-small" }, "Choose which installed query filters this board can use.", -1)),
      b(na, {
        schema: { type: "object", properties: { scopes: { type: "array", title: "Query filter identifiers", items: { type: "string" } } } },
        "model-value": { scopes: e.draft.scopes },
        "onUpdate:modelValue": u[5] || (u[5] = (y) => e.draft.scopes = y.scopes)
      }, null, 8, ["model-value"]),
      u[23] || (u[23] = d("h3", { class: "work-group-title" }, "Audit and retention", -1)),
      d("div", Ru, [
        d("div", Ou, [
          u[12] || (u[12] = d("div", { class: "work-row-main" }, [
            d("strong", { class: "work-row-title" }, "Audit trail"),
            d("p", { class: "work-muted work-small" }, "Choose which item changes appear in history.")
          ], -1)),
          d("div", Nu, [
            b(r(ie), {
              "model-value": o.value.audit ?? "",
              "aria-label": "Audit trail",
              placeholder: "Installation default",
              appendTo: "self",
              optionLabel: "label",
              optionValue: "value",
              options: [{ label: "Installation default", value: "" }, { label: "Off", value: "off" }, { label: "Fields", value: "fields" }],
              "onUpdate:modelValue": u[6] || (u[6] = (y) => m("audit", y || void 0))
            }, null, 8, ["model-value"])
          ])
        ]),
        (c(), g(Q, null, oe(v, (y) => d("div", {
          key: y,
          class: "work-settings-row"
        }, [
          d("div", Mu, [
            d("strong", Fu, U(r(Ve)(y)), 1),
            d("p", Lu, "Blank follows the application default. " + U(f[y]), 1)
          ]),
          d("label", zu, [
            b(r(Ge), {
              min: 0,
              "aria-label": r(Ve)(y),
              "model-value": o.value[y] ?? null,
              placeholder: "Installation default",
              useGrouping: !1,
              "onUpdate:modelValue": (p) => i(y, p)
            }, null, 8, ["aria-label", "model-value", "onUpdate:modelValue"])
          ])
        ])), 64))
      ])
    ]));
  }
}), ju = {
  class: "work-stack",
  "aria-label": "Relation types editor"
}, qu = { class: "work-section-heading" }, Wu = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, Ku = { class: "work-definition-meta work-muted work-small" }, Gu = { class: "work-settings-grid" }, Yu = { class: "work-stack work-tight" }, Hu = { class: "work-stack work-tight" }, Xu = { class: "work-stack work-tight" }, Ju = { class: "work-stack work-tight" }, Zu = { class: "work-row" }, Qu = { class: "work-relation-preview work-small" }, _u = { class: "work-muted" }, ec = {
  key: 0,
  class: "kx-empty"
}, tc = { class: "work-row work-add-definition" }, lc = { class: "work-stack work-tight" }, ac = /* @__PURE__ */ ve({
  __name: "RelationsEditor",
  props: {
    draft: {},
    guardRemoval: { type: Function }
  },
  setup(e) {
    const l = e, t = X(() => l.draft.relation_types ?? []), a = j(""), o = j(""), s = j(!1), v = X(() => /^[a-z][a-z0-9_]*$/.test(a.value) && !t.value.some((i) => i.id === a.value));
    function f() {
      v.value && ((l.draft.relation_types ??= []).push({ id: a.value, outward: Ve(a.value).toLowerCase(), inward: Ve(a.value).toLowerCase(), cardinality: "many" }), a.value = "");
    }
    async function m(i) {
      if (!s.value) {
        s.value = !0, o.value = "";
        try {
          const n = await l.guardRemoval?.("relation_types", i);
          n ? o.value = n : _t(l.draft, "relation_types", i);
        } finally {
          s.value = !1;
        }
      }
    }
    return (i, n) => (c(), g("section", ju, [
      d("header", qu, [
        n[1] || (n[1] = d("div", null, [
          d("h2", null, "Relation types"),
          d("p", { class: "work-muted work-small" }, "Give each direction a clear label. A used relation keeps its identity and shape.")
        ], -1)),
        b(r(Re), {
          class: "kx-tag-sm",
          severity: "secondary"
        }, {
          default: L(() => [
            O(U(t.value.length) + " " + U(t.value.length === 1 ? "relation" : "relations"), 1)
          ]),
          _: 1
        })
      ]),
      o.value ? (c(), g("p", Wu, U(o.value), 1)) : T("", !0),
      b($l, {
        columns: "relations",
        count: t.value.length
      }, {
        default: L(() => [
          (c(!0), g(Q, null, oe(t.value, (u, y) => (c(), W(Vl, {
            title: r(Ve)(u.id),
            code: u.id,
            kind: u.symmetric ? "Same both ways" : "Different each way",
            key: y,
            class: "work-stack"
          }, {
            usage: L(() => [
              d("span", Ku, U(u.outward || "Related work") + " · " + U(u.inward || "Reverse relation"), 1)
            ]),
            actions: L(() => [
              b(r(J), {
                severity: "secondary",
                text: "",
                disabled: s.value,
                onClick: (p) => m(u.id),
                "aria-label": "Remove relation",
                size: "small"
              }, {
                default: L(() => [
                  b(r(ee), {
                    icon: "tabler:trash",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["disabled", "onClick"])
            ]),
            default: L(() => [
              d("div", Gu, [
                d("label", Yu, [
                  n[2] || (n[2] = O("Identifier ", -1)),
                  b(r(ce), {
                    modelValue: u.id,
                    "onUpdate:modelValue": (p) => u.id = p,
                    required: "",
                    pattern: "[a-z][a-z0-9_]*",
                    "aria-label": "Relation ID"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                d("label", Hu, [
                  n[3] || (n[3] = O("Outward label ", -1)),
                  b(r(ce), {
                    modelValue: u.outward,
                    "onUpdate:modelValue": (p) => u.outward = p,
                    "aria-label": "Outward label"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                d("label", Xu, [
                  n[4] || (n[4] = O("Inward label ", -1)),
                  b(r(ce), {
                    modelValue: u.inward,
                    "onUpdate:modelValue": (p) => u.inward = p,
                    "aria-label": "Inward label"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                d("label", Ju, [
                  n[5] || (n[5] = O("Links allowed ", -1)),
                  b(r(ie), {
                    "model-value": u.cardinality ?? "many",
                    "onUpdate:modelValue": (p) => u.cardinality = p,
                    "aria-label": "Links allowed",
                    appendTo: "self",
                    optionLabel: "label",
                    optionValue: "value",
                    optionDisabled: "disabled",
                    options: [{ label: "One link", value: "one", disabled: !1 }, { label: "Many links", value: "many", disabled: !1 }]
                  }, null, 8, ["model-value", "onUpdate:modelValue"])
                ]),
                d("label", Zu, [
                  b(r(Mt), {
                    modelValue: u.symmetric,
                    "onUpdate:modelValue": (p) => u.symmetric = p,
                    "aria-label": "Same meaning in both directions",
                    binary: ""
                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                  n[6] || (n[6] = O("Same meaning in both directions ", -1))
                ])
              ]),
              d("p", Qu, [
                n[7] || (n[7] = d("strong", null, "This item", -1)),
                O(" " + U(u.outward || "relates to") + " ", 1),
                n[8] || (n[8] = d("strong", null, "another item", -1)),
                d("span", _u, " · reverse: " + U(u.symmetric ? u.outward : u.inward), 1)
              ])
            ]),
            _: 2
          }, 1032, ["title", "code", "kind"]))), 128)),
          t.value.length ? T("", !0) : (c(), g("p", ec, "No relation types yet. Add one to link related work.")),
          d("div", tc, [
            d("label", lc, [
              n[9] || (n[9] = O("New relation ID ", -1)),
              b(r(ce), {
                modelValue: a.value,
                "onUpdate:modelValue": n[0] || (n[0] = (u) => a.value = u),
                placeholder: "related_to",
                onKeydown: Ae(he(f, ["prevent"]), ["enter"])
              }, null, 8, ["modelValue", "onKeydown"])
            ]),
            b(r(J), {
              label: "Add relation",
              severity: "secondary",
              disabled: !v.value,
              onClick: f,
              outlined: ""
            }, {
              icon: L(() => [
                b(r(ee), {
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
function oc(e, l) {
  return e.parked ? "Stopped: " + (typeof e.error == "string" ? e.error : e.error?.message ?? "Projection is parked") : e.bootstrapping ? "Initializing" : e.last_seq >= l ? "Up to date" : "Catching up";
}
const ic = {
  class: "work-stack",
  "aria-label": "Plugins editor"
}, nc = { class: "work-section-heading" }, sc = {
  key: 0,
  class: "kx-loading"
}, rc = {
  key: 1,
  class: "kx-err",
  role: "alert"
}, dc = {
  key: 2,
  class: "work-notice",
  role: "status"
}, uc = { class: "work-row" }, cc = {
  key: 0,
  class: "work-muted work-small"
}, vc = {
  key: 1,
  class: "kx-err"
}, mc = {
  key: 2,
  class: "work-notice"
}, fc = {
  key: 3,
  class: "work-stack work-tight work-plugin-status",
  role: "status"
}, pc = {
  key: 0,
  class: "kx-err"
}, bc = { class: "work-muted work-small" }, hc = { class: "work-form-actions" }, yc = {
  key: 0,
  class: "work-muted work-small"
}, Da = /* @__PURE__ */ ve({
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
    const t = e, a = l, o = j({}), s = j(""), v = j(""), f = j(""), m = j(/* @__PURE__ */ new Set()), i = {};
    function n(M) {
      return t.schema.plugins?.find((R) => R.plugin === M);
    }
    function u(M) {
      return n(M)?.active === !0;
    }
    function y(M) {
      return n(M)?.lifecycle.state === "ready";
    }
    function p(M) {
      return t.draft.plugins?.some((R) => R.use === M) === !0;
    }
    function w(M, R) {
      const S = t.draft.plugins ?? [];
      R && !p(M) && (t.draft.plugins = [...S, { use: M }]), R || (t.draft.plugins = S.filter((q) => q.use !== M), delete t.configs[M], m.value.delete(M), a("validity", M, !0));
    }
    function x(M) {
      return u(M) ? o.value[M] ?? n(M)?.config ?? i : t.configs[M] ?? i;
    }
    function E(M, R) {
      u(M) ? o.value[M] = R : t.configs[M] = R;
    }
    function I(M, R) {
      R ? m.value.delete(M) : m.value.add(M), u(M) || a("validity", M, R);
    }
    async function B(M) {
      if (!(s.value || m.value.has(M))) {
        s.value = M, v.value = "", f.value = "";
        try {
          await wt.configure(t.boardId, M, x(M)), delete o.value[M], f.value = "Plugin configuration saved.", a("configured");
        } catch (R) {
          v.value = R instanceof Error ? R.message : "Could not configure plugin.";
        } finally {
          s.value = "";
        }
      }
    }
    return (M, R) => (c(), g("section", ic, [
      d("header", nc, [
        R[1] || (R[1] = d("div", null, [
          d("h2", null, "Plugins"),
          d("p", { class: "work-muted work-small" }, "Add capabilities from installed modules.")
        ], -1)),
        b(r(J), {
          label: "Refresh status",
          severity: "secondary",
          outlined: "",
          disabled: !!s.value || e.disabled,
          onClick: R[0] || (R[0] = (S) => a("refresh"))
        }, {
          icon: L(() => [
            b(r(ee), {
              icon: "tabler:refresh",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        }, 8, ["disabled"])
      ]),
      R[5] || (R[5] = d("p", { class: "work-muted work-small" }, "Activation joins the schema draft and requires review. Active plugin configuration saves separately. Status reflects the last read; refresh to check progress.", -1)),
      e.options.length ? T("", !0) : (c(), g("p", sc, "No installed plugins are visible to you.")),
      v.value ? (c(), g("div", rc, U(v.value), 1)) : T("", !0),
      f.value ? (c(), g("p", dc, U(f.value), 1)) : T("", !0),
      b($l, {
        columns: "plugins",
        count: e.options.length
      }, {
        default: L(() => [
          (c(!0), g(Q, null, oe(e.options, (S) => (c(), W(Vl, {
            key: S.plugin,
            title: S.title || "Unavailable capability",
            description: S.description,
            kind: u(S.plugin) ? "Active" : p(S.plugin) ? "Pending review" : "Inactive",
            class: "work-stack"
          }, {
            actions: L(() => [
              R[3] || (R[3] = d("span", { class: "work-spacer" }, null, -1)),
              d("label", uc, [
                b(r(Le), {
                  "model-value": p(S.plugin),
                  disabled: !!s.value || e.disabled || e.activationLocked || !!S.problem,
                  "onUpdate:modelValue": (q) => w(S.plugin, q)
                }, null, 8, ["model-value", "disabled", "onUpdate:modelValue"]),
                R[2] || (R[2] = O("Activate on this board", -1))
              ])
            ]),
            default: L(() => [
              S.requires.length ? (c(), g("p", cc, "Requires " + U(S.requires.map((q) => e.options.find((N) => N.plugin === q)?.title || "Another capability").join(", ")), 1)) : T("", !0),
              S.problem ? (c(), g("p", vc, U(S.problem.message), 1)) : T("", !0),
              n(S.plugin)?.outdated ? (c(), g("p", mc, "The stored declaration differs from the installed plugin. Review activation to update it.")) : T("", !0),
              u(S.plugin) ? (c(), g("div", fc, [
                d("p", null, U(y(S.plugin) ? "Attachment configured" : n(S.plugin)?.lifecycle.state === "failed" ? "Configuration failed" : "Configuring attachment"), 1),
                n(S.plugin)?.lifecycle.error ? (c(), g("p", pc, U(n(S.plugin)?.lifecycle.error?.message), 1)) : T("", !0),
                (c(!0), g(Q, null, oe(n(S.plugin)?.projections, (q, N) => (c(), g("div", { key: N }, [
                  d("p", null, U(r(oc)(q, e.schema.as_of)), 1),
                  d("p", bc, "Position " + U(q.last_seq) + " · Board head " + U(e.schema.as_of), 1)
                ]))), 128))
              ])) : T("", !0),
              !S.problem && (p(S.plugin) || u(S.plugin)) ? (c(), g(Q, { key: 4 }, [
                b(na, {
                  disabled: !!s.value || e.disabled,
                  schema: S.config_schema,
                  "model-value": x(S.plugin),
                  "onUpdate:modelValue": (q) => E(S.plugin, q),
                  onValidity: (q) => I(S.plugin, q)
                }, null, 8, ["disabled", "schema", "model-value", "onUpdate:modelValue", "onValidity"]),
                d("div", hc, [
                  b(r(J), {
                    label: "Reset",
                    severity: "secondary",
                    outlined: "",
                    disabled: !!s.value || e.disabled,
                    onClick: (q) => E(S.plugin, u(S.plugin) ? r(kt)(n(S.plugin)?.config ?? {}) : {})
                  }, {
                    icon: L(() => [
                      b(r(ee), { icon: "tabler:restore" })
                    ]),
                    _: 1
                  }, 8, ["disabled", "onClick"]),
                  u(S.plugin) ? (c(), W(r(J), {
                    key: 0,
                    label: "Save configuration",
                    disabled: !!s.value || e.disabled || m.value.has(S.plugin),
                    loading: s.value === S.plugin,
                    onClick: (q) => B(S.plugin)
                  }, {
                    icon: L(() => [
                      b(r(ee), {
                        icon: "tabler:device-floppy",
                        "aria-hidden": "true"
                      })
                    ]),
                    _: 1
                  }, 8, ["disabled", "loading", "onClick"])) : T("", !0)
                ]),
                u(S.plugin) ? T("", !0) : (c(), g("p", yc, "Initial configuration is included in Review and Apply."))
              ], 64)) : T("", !0)
            ]),
            _: 2
          }, 1032, ["title", "description", "kind"]))), 128))
        ]),
        _: 1
      }, 8, ["count"]),
      (c(!0), g(Q, null, oe(e.draft.plugins?.filter((S) => !e.options.some((q) => q.plugin === S.use)) ?? [], (S) => (c(), g("article", {
        key: S.use,
        class: "work-settings-card"
      }, [
        R[4] || (R[4] = d("p", null, "Unavailable plugin", -1)),
        b(r(J), {
          label: "Deactivate plugin",
          severity: "secondary",
          onClick: (q) => w(S.use, !1),
          outlined: ""
        }, {
          icon: L(() => [
            b(r(ee), {
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
}, kc = { class: "work-stack work-tight" }, wc = {
  key: 0,
  class: "work-row"
}, Vc = { class: "work-stack work-tight" }, $c = { class: "work-settings-list" }, xc = { class: "work-row-main" }, Cc = { class: "work-small work-muted" }, Sc = { class: "work-row-control" }, Tc = { class: "work-row" }, Ec = /* @__PURE__ */ ve({
  __name: "VisibilityEditor",
  props: {
    draft: {},
    boardId: {}
  },
  emits: ["validity"],
  setup(e, { emit: l }) {
    const t = e, a = l, o = X(() => t.draft.visibility), s = X(() => (t.draft.fields ?? []).filter((u) => u.form === "text" && (!u.cardinality || u.cardinality === "one") && u.type !== "rollup" && u.index !== "number" && u.config?.case !== "insensitive")), v = j(""), f = X(() => s.value.find((u) => u.code === o.value?.field)?.type !== "option");
    function m() {
      !v.value || !o.value || o.value.levels.some((u) => u.id === v.value) || (o.value.levels.push({ id: v.value, holders: [] }), v.value = "");
    }
    function i(u) {
      if (!u) {
        delete t.draft.visibility;
        return;
      }
      const y = s.value.find((p) => p.code === u);
      t.draft.visibility = { field: u, levels: (y?.options ?? []).map((p) => ({ id: p.id, holders: [] })) };
    }
    function n(u, y) {
      const p = o.value?.levels.find((w) => w.id === u);
      p && (p.holders = y ?? []);
    }
    return (u, y) => (c(), g("section", gc, [
      y[10] || (y[10] = d("h3", { class: "work-group-title" }, "Board visibility", -1)),
      y[11] || (y[11] = d("p", { class: "work-small work-muted" }, "Restrict items by their visibility level. People still need access to the board.", -1)),
      d("label", kc, [
        y[7] || (y[7] = O("Visibility field", -1)),
        b(r(ie), {
          "aria-label": "Visibility field",
          placeholder: "No additional restriction",
          "model-value": o.value?.field ?? "",
          options: [{ label: "No additional restriction", value: "" }, ...s.value.map((p) => ({ label: r(_e)(p), value: p.code }))],
          optionLabel: "label",
          optionValue: "value",
          appendTo: "self",
          "onUpdate:modelValue": y[0] || (y[0] = (p) => i(p))
        }, null, 8, ["model-value", "options"])
      ]),
      o.value ? (c(), g(Q, { key: 0 }, [
        f.value ? (c(), g("div", wc, [
          d("label", Vc, [
            y[8] || (y[8] = O("Level ID", -1)),
            b(r(ce), {
              modelValue: v.value,
              "onUpdate:modelValue": y[1] || (y[1] = (p) => v.value = p),
              "aria-label": "New visibility level",
              onKeydown: Ae(he(m, ["prevent"]), ["enter"])
            }, null, 8, ["modelValue", "onKeydown"])
          ]),
          b(r(J), {
            label: "Add level",
            severity: "secondary",
            outlined: "",
            disabled: !v.value || o.value.levels.some((p) => p.id === v.value),
            onClick: m
          }, null, 8, ["disabled"])
        ])) : T("", !0),
        d("div", $c, [
          (c(!0), g(Q, null, oe(o.value.levels, (p, w) => (c(), g("div", {
            key: p.id,
            class: "work-settings-row"
          }, [
            d("div", xc, [
              d("strong", null, U(s.value.find((x) => x.code === o.value.field)?.options?.find((x) => x.id === p.id)?.label || p.id), 1),
              d("p", Cc, "Level " + U(w + 1), 1)
            ]),
            d("div", Sc, [
              b(Wa, {
                "board-id": e.boardId,
                label: "Who can see these items",
                "model-value": p.holders,
                "onUpdate:modelValue": (x) => n(p.id, x),
                onValidity: y[2] || (y[2] = (x) => a("validity", x))
              }, null, 8, ["board-id", "model-value", "onUpdate:modelValue"])
            ])
          ]))), 128))
        ]),
        d("label", Tc, [
          b(r(Le), {
            "model-value": o.value.bypass === "admin",
            "onUpdate:modelValue": y[3] || (y[3] = (p) => p ? o.value.bypass = "admin" : delete o.value.bypass)
          }, null, 8, ["model-value"]),
          y[9] || (y[9] = O("Board administrators can see every level", -1))
        ]),
        b(r(J), {
          label: "Remove visibility restriction",
          severity: "secondary",
          text: "",
          onClick: y[4] || (y[4] = (p) => delete e.draft.visibility)
        })
      ], 64)) : T("", !0),
      b(ot, {
        label: "Visibility rules",
        "model-value": o.value,
        shape: "object",
        example: { field: "visibility", levels: [{ id: "internal", holders: [] }], bypass: "admin" },
        "onUpdate:modelValue": y[5] || (y[5] = (p) => e.draft.visibility = p),
        onValidity: y[6] || (y[6] = (p) => a("validity", p))
      }, null, 8, ["model-value"])
    ]));
  }
}), Uc = { class: "kx-head" }, Dc = { class: "kx-head-icon" }, Ic = { class: "kx-head-text" }, Ac = { class: "kx-title" }, Pc = ["title"], Rc = { class: "kx-head-actions" }, Oc = /* @__PURE__ */ ve({
  __name: "PageHead",
  props: {
    title: {},
    subtitle: {},
    icon: { default: "tabler:layout-kanban" },
    backLabel: {}
  },
  emits: ["back"],
  setup(e) {
    return (l, t) => (c(), g("header", Uc, [
      e.backLabel ? (c(), W(r(J), {
        key: 0,
        "aria-label": e.backLabel,
        severity: "secondary",
        text: "",
        onClick: t[0] || (t[0] = (a) => l.$emit("back"))
      }, {
        default: L(() => [
          b(r(ee), {
            icon: "tabler:arrow-left",
            "aria-hidden": "true"
          })
        ]),
        _: 1
      }, 8, ["aria-label"])) : T("", !0),
      d("div", Dc, [
        b(r(ee), {
          icon: e.icon,
          "aria-hidden": "true"
        }, null, 8, ["icon"])
      ]),
      d("div", Ic, [
        We(l.$slots, "identity", {}, () => [
          d("h1", Ac, U(e.title), 1),
          e.subtitle ? (c(), g("p", {
            key: 0,
            class: "kx-head-sub",
            title: e.subtitle
          }, U(e.subtitle), 9, Pc)) : T("", !0)
        ])
      ]),
      d("div", Rc, [
        We(l.$slots, "default")
      ])
    ]));
  }
}), Nc = { class: "work-board-identity work-stack work-tight" }, Mc = { class: "work-stack work-tight" }, Fc = { class: "work-stack work-tight" }, Lc = { class: "work-stack work-tight" }, zc = ["value", "inert"], Bc = {
  key: 1,
  class: "work-muted work-small"
}, jc = { class: "work-row" }, qc = { class: "work-row" }, Wc = { class: "work-row work-board-title" }, Kc = {
  key: 1,
  class: "work-identity-actions"
}, Gc = ["title"], Yc = {
  key: 2,
  class: "kx-err work-inline",
  role: "alert"
}, Hc = {
  key: 3,
  class: "work-muted work-small",
  role: "status"
}, Ia = /* @__PURE__ */ ve({
  __name: "BoardIdentity",
  props: {
    board: {},
    compact: { type: Boolean },
    detail: { type: Boolean },
    subtitle: {}
  },
  emits: ["saved"],
  setup(e, { emit: l }) {
    const t = e, a = l, o = j(!1), s = j(""), v = j(""), f = j(""), m = j(!1), i = j(!1), n = j(""), u = j(""), y = X(() => t.board?.access?.admin === !0);
    function p() {
      s.value = t.board?.title ?? "", f.value = t.board?.icon ?? "", lt("wc-icon-picker").then((x) => m.value = x), v.value = t.board?.description ?? "", n.value = "", u.value = "", o.value = !0;
    }
    Ce(y, (x) => {
      x || (o.value = !1);
    });
    async function w() {
      if (!y.value || !t.board || i.value || !s.value.trim()) return;
      const x = {};
      if (s.value.trim() !== t.board.title && (x.title = s.value.trim()), v.value !== (t.board.description ?? "") && (x.description = v.value), f.value !== (t.board.icon ?? "") && (x.icon = f.value), !Object.keys(x).length) {
        o.value = !1, u.value = "Nothing changed.";
        return;
      }
      i.value = !0, n.value = "";
      try {
        const E = await xt.updateBoard(t.board.board_id, x);
        o.value = !1, u.value = E.status === "unchanged" ? "Nothing changed." : "Board saved.", a("saved");
      } catch (E) {
        n.value = E instanceof Error ? E.message : "Could not save the board.";
      } finally {
        i.value = !1;
      }
    }
    return (x, E) => (c(), g("div", Nc, [
      o.value ? (c(), g("form", {
        key: 0,
        class: "work-identity-edit",
        "aria-label": "Edit board",
        onClick: E[4] || (E[4] = he(() => {
        }, ["stop"])),
        onSubmit: he(w, ["prevent"])
      }, [
        d("label", Mc, [
          E[5] || (E[5] = O("Title", -1)),
          b(r(ce), {
            modelValue: s.value,
            "onUpdate:modelValue": E[0] || (E[0] = (I) => s.value = I),
            required: "",
            autofocus: "",
            disabled: i.value
          }, null, 8, ["modelValue", "disabled"])
        ]),
        d("label", Fc, [
          E[6] || (E[6] = O("Description", -1)),
          b(r(ml), {
            modelValue: v.value,
            "onUpdate:modelValue": E[1] || (E[1] = (I) => v.value = I),
            rows: "1",
            disabled: i.value
          }, null, 8, ["modelValue", "disabled"])
        ]),
        d("div", Lc, [
          E[7] || (E[7] = d("span", null, "Board icon", -1)),
          m.value ? (c(), g("wc-icon-picker", {
            key: 0,
            value: f.value,
            fallback: "tabler:layout-kanban",
            inert: i.value || void 0,
            onSelect: E[2] || (E[2] = (I) => f.value = I.detail)
          }, null, 40, zc)) : (c(), g("p", Bc, "The icon picker is unavailable."))
        ]),
        d("div", jc, [
          b(r(J), {
            label: "Save",
            severity: "secondary",
            type: "submit",
            disabled: !s.value.trim() || i.value,
            loading: i.value,
            outlined: ""
          }, {
            icon: L(() => [
              b(r(ee), {
                icon: "tabler:device-floppy",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled", "loading"]),
          b(r(J), {
            label: "Cancel",
            severity: "secondary",
            disabled: i.value,
            onClick: E[3] || (E[3] = (I) => o.value = !1),
            outlined: ""
          }, {
            icon: L(() => [
              b(r(ee), {
                icon: "tabler:x",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled"])
        ])
      ], 32)) : (c(), g(Q, { key: 1 }, [
        d("div", qc, [
          d("div", Wc, [
            e.board?.icon ? (c(), W(r(ee), {
              key: 0,
              icon: e.board.icon,
              "aria-hidden": "true"
            }, null, 8, ["icon"])) : T("", !0),
            (c(), W(zl(e.compact || e.detail ? "h2" : "h1"), {
              class: pt(e.detail ? "work-detail-title" : e.compact ? "kx-card-name" : "kx-title")
            }, {
              default: L(() => [
                O(U(e.board?.title || "Untitled board"), 1)
              ]),
              _: 1
            }, 8, ["class"]))
          ]),
          e.compact ? We(x.$slots, "title-end", {}, void 0, void 0, 0) : T("", !0),
          e.compact ? (c(), g("span", Kc, [
            y.value ? (c(), W(r(J), {
              key: 0,
              severity: "secondary",
              text: "",
              size: "small",
              onClick: he(p, ["stop"]),
              "aria-label": "Edit board"
            }, {
              default: L(() => [
                b(r(ee), {
                  icon: "tabler:pencil",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            })) : T("", !0),
            We(x.$slots, "actions")
          ])) : y.value ? (c(), W(r(J), {
            key: 2,
            severity: "secondary",
            text: "",
            size: "small",
            onClick: he(p, ["stop"]),
            "aria-label": "Edit board"
          }, {
            default: L(() => [
              b(r(ee), {
                icon: "tabler:pencil",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          })) : T("", !0),
          e.compact ? T("", !0) : We(x.$slots, "title-end", {}, void 0, void 0, 3)
        ]),
        !e.compact && (e.subtitle || e.board?.description) ? (c(), g("p", {
          key: 0,
          class: "kx-head-sub",
          title: e.subtitle || e.board?.description
        }, U(e.subtitle || e.board?.description), 9, Gc)) : T("", !0)
      ], 64)),
      n.value ? (c(), g("p", Yc, U(n.value), 1)) : T("", !0),
      u.value ? (c(), g("p", Hc, U(u.value), 1)) : T("", !0)
    ]));
  }
}), Xc = {
  key: 0,
  class: "work-dirty"
}, Aa = /* @__PURE__ */ ve({
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
    return (l, t) => (c(), g(Q, null, [
      e.dirty ? (c(), g("span", Xc, "Unsaved changes")) : T("", !0),
      b(r(J), {
        label: "Discard",
        severity: "secondary",
        outlined: "",
        disabled: !e.dirty || e.busy || e.checkingRemoval,
        onClick: t[0] || (t[0] = (a) => l.$emit("discard"))
      }, {
        icon: L(() => [
          b(r(ee), { icon: "tabler:restore" })
        ]),
        _: 1
      }, 8, ["disabled"]),
      b(r(J), {
        label: e.reviewed ? "Apply" : "Review changes",
        disabled: e.disabled,
        loading: e.busy,
        onClick: t[1] || (t[1] = (a) => l.$emit("primary"))
      }, null, 8, ["label", "disabled", "loading"])
    ], 64));
  }
}), Jc = {
  key: 0,
  class: "work-detail-head"
}, Zc = {
  key: 0,
  class: "work-row work-wrap work-draft-actions"
}, Qc = {
  key: 2,
  class: "kx-err",
  role: "alert"
}, _c = ["config"], ev = /* @__PURE__ */ ve({
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
    const l = e, t = j(!1), a = j(!1), o = j("");
    async function s() {
      !l.authorized || !l.board || (o.value = "", a.value = await lt("kickside-share"), a.value ? t.value = !0 : o.value = "The sharing widget is unavailable. Try Share board again.");
    }
    Ce(() => l.authorized, (i) => {
      i || (t.value = !1);
    });
    const v = X(() => JSON.stringify({ resource_id: l.board?.board_id, title: l.board?.title, access_url: `/api/v1/component-access/grants/${encodeURIComponent(l.board?.board_id ?? "")}`, share_url: `/api/v1/component-access/share/${encodeURIComponent(l.board?.board_id ?? "")}` })), f = X(() => l.pack ? `${l.packTitle} ${l.pack.version}${l.outdated ? " · Outdated" : ""}` : ""), m = X(() => "Settings · generation " + (l.generation ?? "…") + (f.value ? " · " + f.value : ""));
    return (i, n) => (c(), g(Q, null, [
      e.embedded ? (c(), g("header", Jc, [
        b(Ia, {
          board: e.board,
          subtitle: f.value || void 0,
          detail: "",
          onSaved: n[0] || (n[0] = (u) => i.$emit("saved"))
        }, {
          "title-end": L(() => [
            b(r(Re), {
              severity: "secondary",
              value: "Generation " + (e.generation ?? "…")
            }, null, 8, ["value"])
          ]),
          _: 1
        }, 8, ["board", "subtitle"]),
        e.authorized ? (c(), g("div", Zc, [
          e.authorized && e.outdated && e.pack ? (c(), W(r(J), {
            key: 0,
            disabled: !e.canUpgrade,
            title: e.upgradeReason,
            label: "Upgrade pack",
            severity: "secondary",
            outlined: "",
            onClick: n[1] || (n[1] = (u) => i.$emit("upgrade"))
          }, {
            icon: L(() => [
              b(r(ee), { icon: "tabler:refresh" })
            ]),
            _: 1
          }, 8, ["disabled", "title"])) : T("", !0),
          e.authorized && e.board ? (c(), W(r(J), {
            key: 1,
            label: "Share board",
            severity: "secondary",
            outlined: "",
            disabled: e.busy,
            onClick: s
          }, {
            icon: L(() => [
              b(r(ee), {
                icon: "tabler:share",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled"])) : T("", !0),
          e.authorized && !e.pack ? (c(), W(r(J), {
            key: 2,
            label: "Install pack",
            severity: "secondary",
            outlined: "",
            disabled: e.busy || e.dirty,
            onClick: n[2] || (n[2] = (u) => i.$emit("install"))
          }, null, 8, ["disabled"])) : T("", !0),
          b(Aa, {
            dirty: e.dirty,
            busy: e.busy,
            "checking-removal": e.checkingRemoval,
            reviewed: e.reviewed,
            disabled: e.disabled,
            onDiscard: n[3] || (n[3] = (u) => i.$emit("discard")),
            onPrimary: n[4] || (n[4] = (u) => i.$emit("primary"))
          }, null, 8, ["dirty", "busy", "checking-removal", "reviewed", "disabled"])
        ])) : T("", !0)
      ])) : (c(), W(Oc, {
        key: 1,
        title: e.board?.title || "Board",
        subtitle: m.value,
        "back-label": "Back to board",
        icon: "tabler:adjustments",
        onBack: n[10] || (n[10] = (u) => i.$emit("back"))
      }, {
        identity: L(() => [
          b(Ia, {
            board: e.board,
            subtitle: m.value,
            onSaved: n[5] || (n[5] = (u) => i.$emit("saved"))
          }, null, 8, ["board", "subtitle"])
        ]),
        default: L(() => [
          e.authorized && e.outdated && e.pack ? (c(), W(r(J), {
            key: 0,
            disabled: !e.canUpgrade,
            title: e.upgradeReason,
            label: "Upgrade pack",
            severity: "secondary",
            outlined: "",
            onClick: n[6] || (n[6] = (u) => i.$emit("upgrade"))
          }, {
            icon: L(() => [
              b(r(ee), { icon: "tabler:refresh" })
            ]),
            _: 1
          }, 8, ["disabled", "title"])) : T("", !0),
          e.authorized && e.board ? (c(), W(r(J), {
            key: 1,
            label: "Share board",
            severity: "secondary",
            outlined: "",
            disabled: e.busy,
            onClick: s
          }, {
            icon: L(() => [
              b(r(ee), {
                icon: "tabler:share",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled"])) : T("", !0),
          e.authorized && !e.pack ? (c(), W(r(J), {
            key: 2,
            label: "Install pack",
            severity: "secondary",
            outlined: "",
            disabled: e.busy || e.dirty,
            onClick: n[7] || (n[7] = (u) => i.$emit("install"))
          }, null, 8, ["disabled"])) : T("", !0),
          e.authorized ? (c(), W(Aa, {
            key: 3,
            dirty: e.dirty,
            busy: e.busy,
            "checking-removal": e.checkingRemoval,
            reviewed: e.reviewed,
            disabled: e.disabled,
            onDiscard: n[8] || (n[8] = (u) => i.$emit("discard")),
            onPrimary: n[9] || (n[9] = (u) => i.$emit("primary"))
          }, null, 8, ["dirty", "busy", "checking-removal", "reviewed", "disabled"])) : T("", !0)
        ]),
        _: 1
      }, 8, ["title", "subtitle"])),
      o.value ? (c(), g("p", Qc, U(o.value), 1)) : T("", !0),
      t.value && a.value && e.authorized ? (c(), g("kickside-share", {
        key: 3,
        config: v.value,
        onClose: n[11] || (n[11] = (u) => t.value = !1),
        onChanged: n[12] || (n[12] = (u) => i.$emit("saved"))
      }, null, 40, _c)) : T("", !0)
    ], 64));
  }
}), tv = {
  key: 0,
  class: "work-settings-card work-schema-plan work-stack",
  "aria-label": "Schema review"
}, lv = { key: 0 }, av = { class: "work-row" }, ov = { class: "work-muted work-small" }, iv = { class: "work-muted" }, nv = {
  key: 0,
  class: "work-notice"
}, sv = {
  key: 1,
  class: "work-notice"
}, rv = {
  key: 2,
  class: "work-muted work-small"
}, dv = {
  key: 3,
  class: "work-stack work-tight",
  "aria-label": "Reviewed Flow bindings"
}, uv = { key: 4 }, cv = { key: 0 }, vv = {
  key: 5,
  class: "work-settings-table"
}, mv = { key: 0 }, fv = { key: 1 }, pv = { key: 2 }, bv = { key: 6 }, hv = /* @__PURE__ */ ve({
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
    const l = e, t = X(() => l.declaration?.processes?.flatMap((a) => a.states.filter((o) => o.run?.flow_ref).map((o) => ({ process: a.name || a.id, state: o.name || o.id, reference: o.run.flow_ref }))) ?? []);
    return (a, o) => e.plan ? (c(), g("section", tv, [
      !e.plan.changes.length && !e.plan.refused.length && !e.configCount && !e.packReview ? (c(), g("p", lv, "No changes to apply.")) : (c(), g(Q, { key: 1 }, [
        d("header", av, [
          o[0] || (o[0] = d("h2", null, "Review", -1)),
          b(r(Re), {
            class: "kx-tag-sm",
            severity: e.plan.class === "refused" ? "danger" : e.plan.class === "semantic" ? "warn" : e.plan.class === "additive" ? "success" : "secondary"
          }, {
            default: L(() => [
              O(U(e.plan.class), 1)
            ]),
            _: 1
          }, 8, ["severity"]),
          d("span", ov, "Generation " + U(e.generation) + " → " + U(e.plan.generation), 1)
        ]),
        d("p", iv, U(r(Uo)[e.plan.class] || "Review the classified changes below."), 1),
        e.plan.migration ? (c(), g("p", nv, "Migration needed: " + U(e.plan.migration), 1)) : e.follows.length ? (c(), g("p", sv, "Follow migration: " + U(e.follows.join(", ")) + ". Existing items move to the new process generation; declared state maps apply.", 1)) : (c(), g("p", rv, "No follow process migration is indicated by these changes.")),
        t.value.length ? (c(), g("section", dv, [
          o[1] || (o[1] = d("h3", null, "Flow bindings", -1)),
          (c(!0), g(Q, null, oe(t.value, (s) => (c(), g("p", {
            key: s.process + ":" + s.state
          }, U(s.process) + " / " + U(s.state) + ": " + U(s.reference.id) + " · v" + U(s.reference.version), 1))), 128)),
          o[2] || (o[2] = d("p", { class: "work-muted work-small" }, "New entries use these exact published versions. Before replacing a binding, stop new entries, drain existing attempts and deliveries, pause the old launcher, save, then resume entries.", -1))
        ])) : T("", !0),
        We(a.$slots, "default"),
        e.plan.refused.length ? (c(), g("h3", uv, "Refused changes")) : T("", !0),
        (c(!0), g(Q, null, oe(e.plan.refused, (s, v) => (c(), W(r(Wo), {
          key: v,
          severity: "error",
          role: "alert"
        }, {
          default: L(() => [
            O(U(s.code) + " · " + U(s.what) + " · " + U(r(wl)(s)), 1),
            s.to ? (c(), g("span", cv, " → " + U(s.to), 1)) : T("", !0)
          ]),
          _: 2
        }, 1024))), 128)),
        e.plan.changes.length ? (c(), g("table", vv, [
          o[3] || (o[3] = d("thead", null, [
            d("tr", null, [
              d("th", null, "Entry"),
              d("th", null, "Class"),
              d("th", null, "Change")
            ])
          ], -1)),
          d("tbody", null, [
            (c(!0), g(Q, null, oe(e.plan.changes, (s, v) => (c(), g("tr", { key: v }, [
              d("td", null, U(s.code), 1),
              d("td", null, [
                b(r(Re), {
                  class: "kx-tag-sm",
                  severity: s.class === "refused" ? "danger" : s.class === "semantic" ? "warn" : s.class === "additive" ? "success" : "secondary"
                }, {
                  default: L(() => [
                    O(U(s.class), 1)
                  ]),
                  _: 2
                }, 1032, ["severity"])
              ]),
              d("td", null, [
                O(U(s.what) + " ", 1),
                s.detail ? (c(), g("span", mv, " · " + U(s.detail), 1)) : T("", !0),
                s.to ? (c(), g("span", fv, " → " + U(s.to), 1)) : T("", !0),
                s.count ? (c(), g("span", pv, " · " + U(s.count) + " items", 1)) : T("", !0)
              ])
            ]))), 128))
          ])
        ])) : (c(), g("p", bv, "No declaration changes are reported."))
      ], 64))
    ])) : T("", !0);
  }
}), yv = {
  key: 0,
  class: "work-stack",
  "aria-label": "Pack conflicts"
}, gv = { class: "work-stack work-tight work-pack-review-field" }, kv = { class: "work-json-disclosure" }, wv = { class: "work-config-fields" }, Vv = { class: "work-json-example" }, $v = { class: "work-json-example" }, xv = {
  key: 1,
  class: "work-stack",
  "aria-label": "Pack state maps"
}, Cv = /* @__PURE__ */ ve({
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
      return t.original.processes?.find((n) => n.id === i)?.name || Ve(i);
    }
    function s(i) {
      const [n, ...u] = i.split("."), y = u.join(".");
      return n === "processes" ? o(y) : n === "fields" ? t.original.fields?.find((p) => p.code === y)?.title || Ve(y) : n === "item_types" ? t.original.item_types?.find((p) => p.id === y)?.title || Ve(y) : Ve(n);
    }
    function v(i) {
      return JSON.stringify(i ?? null, null, 2);
    }
    function f(i, n) {
      (t.request.resolutions ??= {})[i] = n, a("change");
    }
    function m(i, n, u) {
      ((t.request.maps ??= {})[i] ??= {})[n] = u, a("change");
    }
    return (i, n) => (c(), g(Q, null, [
      e.plan.conflicts.length ? (c(), g("section", yv, [
        n[3] || (n[3] = d("h3", null, "Local edits conflict", -1)),
        n[4] || (n[4] = d("p", { class: "work-muted work-small" }, "Choose which declaration to keep for each conflict, then review again.", -1)),
        (c(!0), g(Q, null, oe(e.plan.conflicts, (u) => (c(), g("div", {
          key: u.path,
          class: "work-stack work-tight"
        }, [
          d("label", gv, [
            O(U(s(u.path)), 1),
            b(r(ie), {
              "model-value": e.request.resolutions?.[u.path],
              "aria-label": "Resolution for " + s(u.path),
              disabled: e.disabled,
              appendTo: "self",
              placeholder: "Choose a resolution",
              optionLabel: "label",
              optionValue: "value",
              options: [{ label: "Keep local edits", value: "local" }, { label: "Use pack changes", value: "incoming" }],
              "onUpdate:modelValue": (y) => f(u.path, y)
            }, null, 8, ["model-value", "aria-label", "disabled", "onUpdate:modelValue"])
          ]),
          d("details", kv, [
            n[2] || (n[2] = d("summary", null, "Compare declarations", -1)),
            d("div", wv, [
              d("section", null, [
                n[0] || (n[0] = d("h4", null, "Local edits", -1)),
                d("pre", Vv, U(v(u.local_value)), 1)
              ]),
              d("section", null, [
                n[1] || (n[1] = d("h4", null, "Pack changes", -1)),
                d("pre", $v, U(v(u.incoming)), 1)
              ])
            ])
          ])
        ]))), 128))
      ])) : T("", !0),
      Object.keys(e.plan.maps).length ? (c(), g("section", xv, [
        n[5] || (n[5] = d("h3", null, "Required state maps", -1)),
        n[6] || (n[6] = d("p", { class: "work-muted work-small" }, "Review the proposed destinations for existing items. Each destination is editable.", -1)),
        (c(!0), g(Q, null, oe(e.plan.maps, (u, y) => (c(), g("div", {
          key: y,
          class: "work-stack"
        }, [
          d("h4", null, U(o(y)), 1),
          (c(!0), g(Q, null, oe(u, (p, w) => (c(), g("label", {
            key: w,
            class: "work-stack work-tight work-pack-review-field"
          }, [
            O("Move items from " + U(r(ye)(e.original.processes?.find((x) => x.id === y)?.states.find((x) => x.id === w))), 1),
            b(r(ie), {
              "model-value": e.request.maps?.[y]?.[w],
              "aria-label": "Move items from " + r(ye)(e.original.processes?.find((x) => x.id === y)?.states.find((x) => x.id === w)),
              disabled: e.disabled,
              appendTo: "self",
              optionLabel: "label",
              optionValue: "value",
              options: e.plan.declaration.processes?.find((x) => x.id === y)?.states.map((x) => ({ label: r(ye)(x), value: x.id })) ?? [],
              "onUpdate:modelValue": (x) => m(y, w, x)
            }, null, 8, ["model-value", "aria-label", "disabled", "options", "onUpdate:modelValue"])
          ]))), 128))
        ]))), 128))
      ])) : T("", !0)
    ], 64));
  }
}), Sv = {
  key: 0,
  class: "work-settings-tabs"
}, Tv = { class: "work-section-navigation" }, Ev = {
  key: 1,
  class: "kx-err",
  role: "alert"
}, Uv = {
  key: 2,
  class: "kx-err",
  role: "alert"
}, Dv = {
  key: 3,
  class: "work-notice",
  role: "status"
}, Iv = {
  key: 4,
  class: "kx-loading",
  role: "status"
}, Av = {
  key: 5,
  class: "work-notice",
  role: "alert"
}, Pv = {
  key: 6,
  class: "work-settings-content work-pane"
}, Rv = {
  key: 0,
  class: "work-notice",
  role: "alert"
}, Ov = {
  key: 1,
  class: "work-notice"
}, Nv = { key: 0 }, Mv = ["disabled", "inert"], Fv = {
  key: 6,
  class: "work-settings-card work-stack"
}, Lv = {
  key: 5,
  class: "kx-empty"
}, zv = {
  key: 6,
  class: "work-muted work-small",
  role: "status"
}, Bv = { class: "work-stack work-tight" }, jv = {
  key: 0,
  class: "work-muted"
}, qv = { class: "work-dialog-actions" }, Wv = /* @__PURE__ */ ve({
  __name: "BoardSettings",
  props: {
    boardId: {},
    embedded: { type: Boolean }
  },
  emits: ["dirty-change"],
  setup(e, { emit: l }) {
    const t = e, a = l, o = Yo();
    let s, v = "";
    const f = () => JSON.stringify([k.value, I.value, G.value, [...pe.value]]), m = ["Fields", "Item types", "Process", "Policy", "Relation types", "Plugins", "Review"], i = j("Fields"), n = j(!1), u = j(""), y = j(/* @__PURE__ */ new Set(["Fields"]));
    Ce(i, (te) => y.value.add(te));
    const p = j(), w = j(), x = j(), E = j({}), I = j({}), B = j(), M = j(!1), R = j(!0), S = j(!1), q = j(""), N = j(""), ae = j(""), ne = j([]), G = j(), A = j(), P = j(), V = j(), D = j(), z = j(""), C = j([]), F = X(() => [...C.value, ...V.value?.refused ?? []]), _ = j(!1), ke = j(0), pe = j(/* @__PURE__ */ new Set()), ge = j(), h = jl(), $ = jl(), k = X(() => va(E.value, p.value?.declaration ?? {})), K = X(() => pe.value.size > 0 || !!G.value || !!p.value && (JSON.stringify(k.value) !== JSON.stringify(p.value.declaration) || Object.keys(I.value).length > 0));
    Ce(K, (te) => a("dirty-change", te), { immediate: !0, flush: "sync" });
    const Z = X(() => !!p.value && !!w.value && p.value.generation !== w.value.generation), de = X(() => M.value && !S.value && !_.value && !St.value && !Z.value && !pe.value.size && V.value && (V.value.changes.length > 0 || Object.keys(I.value).length > 0) && V.value.class !== "refused" && !V.value.refused.length && D.value?.matches(k.value, p.value?.generation ?? -1, I.value)), be = X(() => ne.value.find((te) => te.id === G.value?.pack)?.plugins.filter((te) => !p.value?.plugins?.some((Y) => Y.plugin === te.plugin && Y.active)).map((te) => ({ use: te.plugin })) ?? []), Te = X(() => !!P.value && JSON.stringify(P.value) === JSON.stringify(G.value)), Ne = X(() => G.value ? M.value && !S.value && !pe.value.size && !Z.value && !St.value && Te.value && V.value?.class !== "refused" && !V.value?.refused.length && A.value?.conflicts.every((te) => !!G.value?.resolutions?.[te.path]) : de.value), Ee = X(() => !!V.value && (!G.value || Te.value)), bt = X(() => ne.value.find((te) => te.id === p.value?.pack?.id)?.title || "Installed pack"), rt = X(() => !ae.value && !!p.value?.outdated && !!ne.value.find((te) => te.id === p.value?.pack?.id)), Cl = X(() => ae.value ? "Reload packs to check available upgrades." : rt.value ? K.value ? "Discard the current draft before upgrading." : St.value ? "Finish the current migration before upgrading." : S.value ? "Wait for the current request to finish." : void 0 : "Install an available version of this pack to upgrade.");
    function Ye() {
      G.value = void 0, A.value = void 0, P.value = void 0;
    }
    async function ll() {
      if (!p.value?.pack || S.value || K.value) return;
      const te = ne.value.find((Y) => Y.id === p.value.pack.id);
      te && (G.value = ma(te, p.value.generation), i.value = "Review", await Sl());
    }
    async function Bt() {
      const te = ne.value.find((Y) => Y.id === u.value);
      !p.value || !te || te.plugins.some((Y) => !Y.installed) || S.value || K.value || (G.value = ma(te, p.value.generation), n.value = !1, i.value = "Review", await Sl());
    }
    async function Sl() {
      if (!G.value || S.value || !M.value || Z.value || pe.value.size) return;
      const te = $(), Y = kt(G.value), le = JSON.stringify(G.value);
      S.value = !0, q.value = "", N.value = "";
      try {
        const we = await Io(Y, (Et) => wt.packPlan(t.boardId, Et));
        if (!te() || le !== JSON.stringify(G.value)) return;
        A.value = we.plan, V.value = we.plan, G.value = we.request, P.value = kt(G.value), z.value = crypto.randomUUID(), i.value = "Review";
      } catch (we) {
        te() && (P.value = void 0, q.value = we instanceof Error ? we.message : "Could not plan the pack upgrade.");
      } finally {
        S.value = !1;
      }
    }
    const so = X(() => V.value ? Do(V.value, k.value) : []), St = X(() => !!w.value?.migration_error || x.value?.status === "migrating");
    function dt() {
      C.value = [], $(), V.value = void 0, D.value = void 0, P.value = void 0, z.value = "";
    }
    Ce([k, I], dt, { deep: !0, flush: "sync" }), Ce(I, (te) => {
      G.value && (Object.keys(te).length ? G.value.plugin_configs = kt(te) : delete G.value.plugin_configs);
    }, { deep: !0, flush: "sync" });
    function Tt(te, Y) {
      Y ? pe.value.delete(te) : pe.value.add(te), dt();
    }
    function Tl(te) {
      Ye(), ke.value++, p.value = te, E.value = kt(te.declaration), I.value = {}, pe.value.clear(), dt();
    }
    async function Ze(te = !1) {
      const Y = h();
      try {
        const [le, we, Et] = await Promise.all([xt.schema(t.boardId, void 0, !0).catch((ut) => {
          if (ut instanceof fa && ut.details?.code === "board_schema_missing") return { generation: 0, declaration: {}, compiled: {}, key_prefix: "", as_of: 0 };
          throw ut;
        }), xt.options(t.boardId), xt.boards()]);
        if (!Y()) return;
        if (M.value = we.access.admin, B.value = we, x.value = Et.find((ut) => ut.board_id === t.boardId), !M.value) {
          p.value = void 0, E.value = {}, dt();
          return;
        }
        q.value = "";
        const He = Ao(le);
        w.value = He, s !== void 0 && He.generation >= s ? (s = void 0, v === f() && Tl(He), v = "") : (te || !p.value || !K.value && He.generation !== p.value.generation) && Tl(He), Z.value && dt(), await sa(Y);
      } catch (le) {
        if (!Y()) return;
        le instanceof fa && (le.status === 403 || le.kind?.toLowerCase() === "permission_denied") && (M.value = !1), dt(), q.value = le instanceof Error ? le.message : "Could not load board settings.";
      } finally {
        Y() && (R.value = !1);
      }
    }
    async function sa(te = () => !0) {
      ae.value = "";
      try {
        const Y = await xt.packs();
        te() && (ne.value = Y.filter(Po));
      } catch (Y) {
        te() && (ae.value = Y instanceof Error ? Y.message : "Could not load packs.");
      }
    }
    function ro() {
      for (const te of ge.value?.querySelectorAll("input, select, textarea") ?? [])
        if (!(te.form !== ge.value || te.closest('[style*="display: none"]')) && !te.reportValidity())
          return !1;
      return !0;
    }
    function uo(te) {
      i.value = te, te === "Review" && !V.value && El();
    }
    async function El() {
      if (G.value) return Sl();
      if (!p.value || S.value || !M.value || Z.value || pe.value.size || !ro()) return;
      const te = $(), Y = pa(k.value, p.value.generation, I.value);
      S.value = !0, q.value = "", N.value = "";
      try {
        const le = await wt.plan(t.boardId, Y);
        if (!te() || pe.value.size || !Y.matches(k.value, p.value.generation, I.value)) return;
        V.value = le, D.value = Y, z.value = crypto.randomUUID(), i.value = "Review";
      } catch (le) {
        te() && (dt(), q.value = le instanceof Error ? le.message : "Could not review changes.", C.value = Ro(le, k.value));
      } finally {
        S.value = !1;
      }
    }
    async function co() {
      if (!Ne.value) return;
      if (G.value && P.value) {
        S.value = !0, q.value = "";
        const Y = f();
        try {
          const le = await wt.packApply(t.boardId, kt(P.value), z.value);
          s = le.generation, v = Y, await Ze(), N.value = le.status === "done" ? `Pack applied at generation ${le.generation}.` : "Pack installation continues in the background.";
        } catch (le) {
          q.value = le instanceof Error ? le.message : "Could not apply the pack upgrade.";
        } finally {
          S.value = !1;
        }
        return;
      }
      if (!D.value) return;
      S.value = !0, q.value = "", N.value = "";
      const te = f();
      try {
        const Y = await wt.apply(t.boardId, D.value, z.value);
        s = Y.generation, v = te, await Ze(), N.value = `Applied generation ${Y.generation} (${Y.class}).`;
      } catch (Y) {
        q.value = Y instanceof Error ? Y.message : "Could not apply schema.";
      } finally {
        S.value = !1;
      }
    }
    async function vo() {
      if (!S.value) {
        S.value = !0, q.value = "";
        try {
          const te = await wt.resume(t.boardId);
          N.value = te.resumed ? "Migration resumes." : "Migration is already running.", await Ze();
        } catch (te) {
          q.value = te instanceof Error ? te.message : "Could not resume migration.";
        } finally {
          S.value = !1;
        }
      }
    }
    async function al(te, Y) {
      if (!p.value || !M.value || S.value || _.value) return "Wait for the current change to finish.";
      if (Z.value) return "Discard the stale draft before removing a definition.";
      const le = p.value.generation, we = JSON.stringify(k.value), Et = kt(E.value);
      _t(Et, te, Y), _.value = !0;
      try {
        const He = await wt.plan(t.boardId, pa(va(Et, p.value.declaration), le, I.value));
        if (!M.value || Z.value || p.value.generation !== le || JSON.stringify(k.value) !== we) return "The draft changes during the check. Try the removal again.";
        const ut = Oo(He, te, Y);
        if (ut) return ut;
        if (He.class === "refused") return "Resolve the refused draft changes in Review before removing this definition.";
      } catch (He) {
        return He instanceof Error ? He.message : "Could not check this removal.";
      } finally {
        _.value = !1;
      }
    }
    async function mo() {
      K.value && !await Fo.confirm({ header: "Discard changes?", message: "Your unsaved board settings will be discarded.", acceptLabel: "Discard", rejectLabel: "Keep editing" }) || o({ name: "board", board: t.boardId });
    }
    function fo() {
      s = void 0, w.value && Tl(w.value), N.value = "", q.value = "";
    }
    Ce(() => t.boardId, () => {
      s = void 0, Ye(), ne.value = [], p.value = void 0, w.value = void 0, x.value = void 0, I.value = {}, pe.value.clear(), y.value = /* @__PURE__ */ new Set(["Fields"]), i.value = "Fields", M.value = !1, R.value = !0, Ze(!0);
    });
    let Ul = () => {
    };
    return Ce(() => t.boardId, (te) => {
      Ul(), Ul = Mo(`component.${te}`, () => {
        Ze();
      });
    }, { immediate: !0 }), go(Ze), Pa(() => {
      Ul(), h(), $();
    }), (te, Y) => (c(), g("section", {
      class: pt(["work-settings-shell", { "work-embedded": e.embedded }])
    }, [
      b(ev, {
        board: x.value,
        embedded: e.embedded,
        generation: p.value?.generation,
        authorized: M.value,
        dirty: K.value,
        busy: S.value,
        "checking-removal": _.value,
        reviewed: Ee.value,
        pack: p.value?.pack,
        "pack-title": bt.value,
        outdated: p.value?.outdated,
        "upgrade-reason": Cl.value,
        "can-upgrade": rt.value && !K.value && !S.value && !St.value && M.value,
        onUpgrade: ll,
        onInstall: Y[0] || (Y[0] = (le) => n.value = !0),
        disabled: !K.value || S.value || _.value || St.value || Z.value || !!pe.value.size || Ee.value && !Ne.value,
        onBack: mo,
        onDiscard: fo,
        onPrimary: Y[1] || (Y[1] = (le) => Ee.value ? co() : El()),
        onSaved: Y[2] || (Y[2] = (le) => Ze())
      }, null, 8, ["board", "embedded", "generation", "authorized", "dirty", "busy", "checking-removal", "reviewed", "pack", "pack-title", "outdated", "upgrade-reason", "can-upgrade", "disabled"]),
      M.value && p.value ? (c(), g("div", Sv, [
        d("div", Tv, [
          b(r(Bo), {
            value: i.value,
            "onUpdate:value": Y[3] || (Y[3] = (le) => uo(le))
          }, {
            default: L(() => [
              b(r(jo), { "aria-label": "Settings sections" }, {
                default: L(() => [
                  (c(), g(Q, null, oe(m, (le) => b(r(qo), {
                    key: le,
                    value: le
                  }, {
                    default: L(() => [
                      O(U(le), 1)
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
      ])) : T("", !0),
      q.value ? (c(), g("div", Ev, [
        O(U(q.value) + " ", 1),
        b(r(J), {
          label: "Retry",
          severity: "secondary",
          onClick: Y[4] || (Y[4] = (le) => Ze()),
          outlined: ""
        }, {
          icon: L(() => [
            b(r(ee), {
              icon: "tabler:refresh",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        })
      ])) : T("", !0),
      ae.value ? (c(), g("p", Uv, [
        O(U(ae.value), 1),
        b(r(J), {
          label: "Reload packs",
          severity: "secondary",
          outlined: "",
          onClick: Y[5] || (Y[5] = (le) => sa())
        }, {
          icon: L(() => [
            b(r(ee), { icon: "tabler:refresh" })
          ]),
          _: 1
        })
      ])) : T("", !0),
      N.value ? (c(), g("p", Dv, U(N.value), 1)) : T("", !0),
      R.value ? (c(), g("p", Iv, "Loading settings…")) : !M.value && !q.value ? (c(), g("p", Av, "Board administrator access is required.")) : T("", !0),
      M.value && p.value ? (c(), g("div", Pv, [
        Z.value ? (c(), g("div", Rv, "The board advances to generation " + U(w.value?.generation) + " while you edit. Your draft keeps generation " + U(p.value.generation) + ". Discard to load the latest schema before reviewing again.", 1)) : T("", !0),
        St.value ? (c(), g("div", Ov, [
          d("p", null, [
            Y[18] || (Y[18] = O("Migration pending", -1)),
            w.value?.migration_error ? (c(), g("span", Nv, ": " + U(w.value.migration_error), 1)) : T("", !0)
          ]),
          b(r(J), {
            label: "Resume migration",
            severity: "secondary",
            disabled: S.value,
            onClick: vo,
            outlined: ""
          }, {
            icon: L(() => [
              b(r(ee), {
                icon: "tabler:refresh",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled"])
        ])) : T("", !0),
        d("form", {
          ref_key: "editor",
          ref: ge,
          onSubmit: he(El, ["prevent"])
        }, [
          (c(), g("fieldset", {
            key: ke.value,
            class: "work-settings-fieldset",
            disabled: S.value || _.value,
            inert: S.value || _.value || void 0
          }, [
            y.value.has("Fields") ? Qe((c(), W(Ss, {
              key: 0,
              "board-id": e.boardId,
              "installed-types": B.value?.installed_types,
              draft: E.value,
              "guard-removal": al,
              issues: F.value,
              onValidity: Y[6] || (Y[6] = (le, we) => Tt("fields:" + le, we))
            }, null, 8, ["board-id", "installed-types", "draft", "issues"])), [
              [ct, i.value === "Fields"]
            ]) : T("", !0),
            y.value.has("Item types") ? Qe((c(), W(Ws, {
              key: 1,
              draft: E.value,
              "guard-removal": al,
              issues: F.value
            }, null, 8, ["draft", "issues"])), [
              [ct, i.value === "Item types"]
            ]) : T("", !0),
            y.value.has("Process") ? Qe((c(), W(ku, {
              key: 2,
              "board-id": e.boardId,
              draft: E.value,
              "guard-removal": al,
              issues: F.value,
              onValidity: Y[7] || (Y[7] = (le, we) => Tt("process:" + le, we))
            }, null, 8, ["board-id", "draft", "issues"])), [
              [ct, i.value === "Process"]
            ]) : T("", !0),
            y.value.has("Policy") ? Qe((c(), W(Bu, {
              key: 3,
              draft: E.value,
              onValidity: Y[8] || (Y[8] = (le, we) => Tt("policy:" + le, we))
            }, null, 8, ["draft"])), [
              [ct, i.value === "Policy"]
            ]) : T("", !0),
            y.value.has("Relation types") ? Qe((c(), W(ac, {
              key: 4,
              draft: E.value,
              "guard-removal": al
            }, null, 8, ["draft"])), [
              [ct, i.value === "Relation types"]
            ]) : T("", !0),
            y.value.has("Plugins") ? Qe((c(), W(Da, {
              key: 5,
              "board-id": e.boardId,
              draft: E.value,
              schema: w.value ?? p.value,
              options: B.value?.schema_options.plugins ?? [],
              configs: I.value,
              disabled: S.value,
              onConfigured: Y[9] || (Y[9] = (le) => {
                dt(), Ze();
              }),
              onRefresh: Y[10] || (Y[10] = (le) => Ze()),
              onValidity: Y[11] || (Y[11] = (le, we) => Tt("plugin:" + le, we))
            }, null, 8, ["board-id", "draft", "schema", "options", "configs", "disabled"])), [
              [ct, i.value === "Plugins"]
            ]) : T("", !0),
            y.value.has("Policy") ? Qe((c(), g("section", Fv, [
              b(Ec, {
                "board-id": e.boardId,
                draft: E.value,
                onValidity: Y[12] || (Y[12] = (le) => Tt("visibility", le))
              }, null, 8, ["board-id", "draft"])
            ], 512)), [
              [ct, i.value === "Policy"]
            ]) : T("", !0)
          ], 8, Mv))
        ], 544),
        i.value === "Review" && !G.value ? (c(), W($u, {
          key: 2,
          draft: E.value,
          original: p.value.declaration,
          disabled: S.value || _.value
        }, null, 8, ["draft", "original", "disabled"])) : T("", !0),
        i.value === "Review" && G.value && be.value.length ? (c(), W(Da, {
          key: 3,
          "board-id": e.boardId,
          draft: { plugins: be.value },
          schema: w.value ?? p.value,
          options: B.value?.schema_options.plugins.filter((le) => be.value.some((we) => we.use === le.plugin)) ?? [],
          configs: I.value,
          disabled: S.value,
          "activation-locked": "",
          onValidity: Y[13] || (Y[13] = (le, we) => Tt("pack-plugin:" + le, we))
        }, null, 8, ["board-id", "draft", "schema", "options", "configs", "disabled"])) : T("", !0),
        i.value === "Review" ? (c(), W(hv, {
          key: 4,
          declaration: D.value?.declaration,
          plan: V.value,
          generation: p.value.generation,
          follows: so.value,
          "config-count": Object.keys(I.value).length,
          "pack-review": !!A.value
        }, {
          default: L(() => [
            A.value && G.value ? (c(), W(Cv, {
              key: 0,
              plan: A.value,
              request: G.value,
              original: p.value.declaration,
              disabled: S.value,
              onChange: Y[14] || (Y[14] = (le) => {
                P.value = void 0, z.value = "";
              })
            }, null, 8, ["plan", "request", "original", "disabled"])) : T("", !0)
          ]),
          _: 1
        }, 8, ["declaration", "plan", "generation", "follows", "config-count", "pack-review"])) : T("", !0),
        i.value === "Review" && !V.value ? (c(), g("p", Lv, "Review your draft to see the changes, their impact and any migration required.")) : T("", !0),
        _.value ? (c(), g("p", zv, "Checking existing values and dependencies…")) : T("", !0)
      ])) : T("", !0),
      M.value ? (c(), W(za, {
        key: 7,
        visible: n.value,
        label: "Install pack",
        busy: S.value,
        onClose: Y[17] || (Y[17] = (le) => n.value = !1)
      }, {
        default: L(() => [
          d("form", {
            class: "work-dialog-box work-stack",
            onSubmit: he(Bt, ["prevent"])
          }, [
            Y[20] || (Y[20] = d("h2", null, "Install a pack", -1)),
            Y[21] || (Y[21] = d("p", { class: "work-muted work-small" }, "Packs can be installed on an empty board. Review checks whether this board is eligible.", -1)),
            d("label", Bv, [
              Y[19] || (Y[19] = O("Pack", -1)),
              b(r(ie), {
                modelValue: u.value,
                "onUpdate:modelValue": Y[15] || (Y[15] = (le) => u.value = le),
                "aria-label": "Pack to install",
                appendTo: "self",
                optionLabel: "title",
                optionValue: "id",
                optionDisabled: "disabled",
                options: ne.value.map((le) => ({ ...le, disabled: le.plugins.some((we) => !we.installed) }))
              }, null, 8, ["modelValue", "options"])
            ]),
            ne.value.length ? T("", !0) : (c(), g("p", jv, "No available packs were found.")),
            d("footer", qv, [
              b(r(J), {
                label: "Cancel",
                severity: "secondary",
                outlined: "",
                onClick: Y[16] || (Y[16] = (le) => n.value = !1)
              }),
              b(r(J), {
                type: "submit",
                label: "Review pack",
                disabled: !u.value || S.value || K.value
              }, null, 8, ["disabled"])
            ])
          ], 32)
        ]),
        _: 1
      }, 8, ["visible", "busy"])) : T("", !0)
    ], 2));
  }
}), Kv = /* @__PURE__ */ ve({
  __name: "SettingsRoot",
  setup(e) {
    const l = ko(), t = wo();
    return yo(ja, (a) => t("navigate", { route: Ho(a) })), (a, o) => (c(), W(Wv, {
      "board-id": r(l).boardId ?? "",
      embedded: r(l).embedded,
      onDirtyChange: o[0] || (o[0] = (s) => r(t)("dirty-change", { dirty: s }))
    }, null, 8, ["board-id", "embedded"]));
  }
}), Gv = Vo(Kv, {
  type: "object",
  properties: {
    "board-id": { type: "string", default: "", description: "Board to administer." },
    embedded: { type: "boolean", default: !1, description: "Fits in a System detail pane." }
  }
});
Lo(import.meta.url, Gv);
//# sourceMappingURL=settings.js.map
