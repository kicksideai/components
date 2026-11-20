import { inject as po, defineComponent as ve, ref as B, useSlots as bo, openBlock as u, createElementBlock as g, createElementVNode as d, normalizeClass as pt, unref as r, renderSlot as We, createCommentVNode as E, createVNode as b, withCtx as N, toDisplayString as U, createBlock as j, withDirectives as Qe, vShow as ct, computed as H, watch as Ce, onMounted as kl, onUnmounted as Pa, resolveComponent as Ra, Fragment as Z, renderList as le, createTextVNode as R, resolveDynamicComponent as zl, onBeforeUnmount as nt, useId as Xl, withKeys as Ae, withModifiers as he, normalizeStyle as ho, watchEffect as Oa, nextTick as ra, provide as yo } from "vue";
import { e as lt, u as go, b as ko, c as wo, a as Vo } from "./mount-DF_QHjX3.js";
import "pinia";
import { Icon as _ } from "@iconify/vue";
import ae from "primevue/select";
import { m as Bl, e as da, s as ye, f as $o, t as je, p as Ut, d as Jl, g as Dt, r as ua, w as xt, l as jl, h as Ke, i as _e, b as ot, u as Na, j as Ma, k as Zl, n as Fa, o as Ve, q as wl, v as _t, x as xo, y as La, z as Co, A as $t, B as So, _ as za, C as To, D as Eo, E as ca, F as kt, G as Uo, H as va, I as Do, J as ma, K as Io, L as fa, M as Ao, a as Po, N as pa, O as Ro, P as Oo } from "./latestRequest-C7gISMH8.js";
import X from "primevue/button";
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
  const a = [.../* @__PURE__ */ new Set([e.x, l.x, ...t.flatMap((P) => [P.x, P.x + P.width])])].sort((P, z) => P - z), o = [.../* @__PURE__ */ new Set([e.y, l.y, ...t.flatMap((P) => [P.y, P.y + P.height])])].sort((P, z) => P - z);
  a.unshift(a[0] - 24), a.push(a.at(-1) + 24), o.unshift(o[0] - 24), o.push(o.at(-1) + 24);
  const s = a.length, v = o.indexOf(l.y) * s + a.indexOf(l.x), p = o.indexOf(e.y) * s + a.indexOf(e.x), f = (P) => ({ x: a[P % s], y: o[Math.floor(P / s)] }), i = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map(), c = [];
  function y(P) {
    c.push(P);
    let z = c.length - 1;
    for (; z; ) {
      const O = z - 1 >> 1;
      if (c[O].priority <= P.priority) break;
      c[z] = c[O], z = O;
    }
    c[z] = P;
  }
  function m() {
    const P = c[0], z = c.pop();
    if (c.length) {
      let O = 0;
      for (; O * 2 + 1 < c.length; ) {
        let T = O * 2 + 1;
        if (T + 1 < c.length && c[T + 1].priority < c[T].priority && T++, z.priority <= c[T].priority) break;
        c[O] = c[T], O = T;
      }
      c[O] = z;
    }
    return P;
  }
  const w = (P) => Math.abs(P.x - l.x) + Math.abs(P.y - l.y);
  for (const P of [0, 1]) {
    const z = p * 2 + P;
    i.set(z, 0), y({ key: z, cost: 0, priority: w(e) });
  }
  const C = /* @__PURE__ */ new Map(), D = /* @__PURE__ */ new Map();
  for (; c.length; ) {
    const P = m(), z = Math.floor(P.key / 2), O = P.key % 2;
    if (P.cost !== i.get(P.key)) continue;
    if (z === v) {
      const S = [];
      let oe = P.key;
      for (; oe !== void 0; )
        S.push(f(Math.floor(oe / 2))), oe = n.get(oe);
      return Ba(S.reverse());
    }
    const T = f(z), $ = z % s, V = Math.floor(z / s);
    for (const [S, oe] of [[$ > 0 ? z - 1 : -1, 0], [$ + 1 < s ? z + 1 : -1, 0], [V > 0 ? z - s : -1, 1], [V + 1 < o.length ? z + s : -1, 1]]) {
      if (S < 0) continue;
      const M = f(S);
      if (C.has(S) || C.set(S, !t.some((I) => Dl(M, I))), !C.get(S)) continue;
      const q = `${Math.min(z, S)}:${Math.max(z, S)}`;
      if (D.has(q) || D.set(q, !t.some((I) => Ko(T, M, I))), !D.get(q)) continue;
      const A = P.cost + Math.abs(T.x - M.x) + Math.abs(T.y - M.y) + (O === oe ? 0 : 18), ie = S * 2 + oe;
      A >= (i.get(ie) ?? 1 / 0) || (i.set(ie, A), n.set(ie, P.key), y({ key: ie, cost: A, priority: A + w(M) }));
    }
  }
  throw new Error("Process map has no collision-free route between its ports: " + JSON.stringify({ start: e, end: l, startInside: t.filter((P) => Dl(e, P)), endInside: t.filter((P) => Dl(l, P)) }));
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
    const o = e[a - 1], s = e[a], v = e[a + 1], p = Math.hypot(s.x - o.x, s.y - o.y), f = Math.hypot(v.x - s.x, v.y - s.y), i = Math.min(8, p / 3, f / 3);
    i && (l += ` L ${s.x + (o.x - s.x) * i / p} ${s.y + (o.y - s.y) * i / p} Q ${s.x} ${s.y} ${s.x + (v.x - s.x) * i / f} ${s.y + (v.y - s.y) * i / f}`);
  }
  const t = e.at(-1);
  return l + ` L ${t.x} ${t.y}`;
}
function Go(e, l = {}, t = { width: 1400, height: 480 }) {
  const a = t.width < 750 || Bl(e).length > 8 ? "TB" : "LR", o = new da.graphlib.Graph({ multigraph: !0 });
  o.setGraph({ rankdir: a, ranker: "network-simplex", acyclicer: "greedy", nodesep: 32, edgesep: 32, ranksep: 24, marginx: 32, marginy: 32 }), o.setDefaultEdgeLabel(() => ({}));
  const s = Bl(e), v = new Map(s.map((h, x) => [h.id, x])), p = e.states.map((h) => {
    const x = (e.transitions ?? []).filter((Ee) => Ee.from === "any" && Ee.to === h.id), k = Ot(ye(h)), W = Ot($o(h, e)), J = x.flatMap((Ee) => Ot(je(Ee) + " works from any state")), de = l.policy?.wip?.[h.id]?.limit, be = de === void 0 ? 0 : jt(" · limit " + de), Te = Math.max(168, ...k.map((Ee) => jt(Ee) + 58), ...W.map((Ee, bt) => jt(Ee) + 32 + (bt === W.length - 1 ? be : 0)), ...J.map((Ee) => jt(Ee) + 32)), Ne = Math.max(80, 42 + k.length * 18 + W.length * 16 + J.length * 18);
    return o.setNode(h.id, { width: Te + (a === "LR" ? 36 : 0), height: Ne + (a === "TB" ? 36 : 0) }), { state: h, x: 0, y: 0, width: Te, height: Ne, title: k, caption: W, badges: x, row: v.has(h.id) ? 0 : 1 };
  }), f = new Set(p.map((h) => h.state.id)), i = (e.transitions ?? []).flatMap((h) => h.from === "any" ? [] : h.from.filter((x) => f.has(x) && f.has(h.to)).map((x) => {
    const k = `${h.id}-${x}`, W = Ot(je(h)), J = Math.max(72, ...W.map((be) => jt(be) + 24)), de = Math.max(24, W.length * 16 + 10);
    return { transition: h, from: x, key: k, lines: W, width: J, height: de };
  })), n = /* @__PURE__ */ new Set(), c = /* @__PURE__ */ new Set(), y = new Set(i.filter((h) => h.from === h.transition.to || h.transition.to === e.initial || ["completed", "canceled"].includes(p.find((x) => x.state.id === h.from).state.category)).map((h) => h.key));
  function m(h) {
    if (!c.has(h)) {
      n.add(h);
      for (const x of i.filter((k) => k.from === h))
        y.has(x.key) || (n.has(x.transition.to) ? y.add(x.key) : m(x.transition.to));
      n.delete(h), c.add(h);
    }
  }
  m(e.initial);
  for (const h of p) m(h.state.id);
  for (const h of i) if (!y.has(h.key)) {
    const x = v.get(h.from), k = v.get(h.transition.to);
    o.setEdge(h.from, h.transition.to, { width: h.width, height: h.height, labelpos: "c", weight: x !== void 0 && k === x + 1 ? 100 : 1 }, h.key);
  }
  for (const h of e.transitions ?? []) if (h.from === "any" && f.has(e.initial) && f.has(h.to) && !v.has(h.to)) {
    const x = e.states.find((k) => k.id === h.to);
    o.setEdge(e.initial, h.to, { minlen: ["completed", "canceled"].includes(x.category) ? Math.max(1, s.length - 1) : 1 }, `any:${h.id}`);
  }
  const w = e.states.flatMap((h) => (h.regions ?? []).filter((x) => f.has(x.initial)).map((x, k) => {
    const W = `lane:${h.id}:${k}`;
    return o.setEdge(h.id, x.initial, {}, W), { state: h, region: x, key: W };
  }));
  if (!p.length) return { nodes: p, edges: [], parallels: [], main: s, direction: a, width: 320, height: 160 };
  da.layout(o);
  for (const h of p) Object.assign(h, { x: o.node(h.state.id).x, y: o.node(h.state.id).y });
  const C = a === "TB", D = i.filter((h) => !y.has(h.key)).map((h) => o.edge({ v: h.from, w: h.transition.to, name: h.key })), P = [...p, ...D], z = Math.max(...P.map((h) => h.x + h.width / 2)), O = Math.max(...P.map((h) => h.y + h.height / 2)), T = (h) => p.find((x) => x.state.id === h), $ = i.filter((h) => y.has(h.key)).sort((h, x) => {
    const k = C ? "y" : "x";
    return Math.abs(T(h.from)[k] - T(h.transition.to)[k]) - Math.abs(T(x.from)[k] - T(x.transition.to)[k]);
  }), V = /* @__PURE__ */ new Map(), S = Math.max(0, ...$.map((h) => h.width));
  let oe = O + 32;
  for (const [h, x] of $.entries()) {
    const k = T(x.from), W = T(x.transition.to), J = C ? z + 16 + S + 28 + h * 18 : oe + x.height / 2, de = C ? z + 16 + S / 2 : (k.x + W.x) / 2;
    let be = C ? k.y + k.height / 2 + 18 : J;
    if (C) for (const Te of [...V.values()].sort((Ne, Ee) => Ne.y - Ee.y))
      be + x.height / 2 + 10 > Te.y - Te.height / 2 - 10 && be - x.height / 2 - 10 < Te.y + Te.height / 2 + 10 && (be = Te.y + Te.height / 2 + 24 + x.height / 2);
    V.set(x.key, { x: de, y: be, corridor: J, height: x.height }), oe = J + x.height / 2 + 24;
  }
  const M = i.map((h) => ({ ...h, ...V.get(h.key) ?? o.edge({ v: h.from, w: h.transition.to, name: h.key }) })), q = (h, x) => ({ x: h.x - h.width / 2 - x, y: h.y - h.height / 2 - x, width: h.width + x * 2, height: h.height + x * 2 }), A = [...p.map((h) => q(h, 12)), ...M.map((h) => q(h, 10))], ie = (h, x) => ({
    start: C ? { x: h.x, y: h.y + h.height / 2 } : { x: h.x + h.width / 2, y: h.y },
    end: C ? { x: x.x, y: x.y - x.height / 2 } : { x: x.x - x.width / 2, y: x.y }
  }), I = (h, x) => C ? { x: h.x, y: h.y + x } : { x: h.x + x, y: h.y }, ne = M.map((h) => {
    const x = p.find((Ye) => Ye.state.id === h.from), k = p.find((Ye) => Ye.state.id === h.transition.to), { start: W, end: J } = ie(x, k), de = y.has(h.key), be = I(W, 18), Te = I(J, -18), Ne = (de || !C ? h.width : h.height) / 2 + 10, Ee = de ? { x: h.x + (C ? -Ne : Ne), y: h.y } : I(h, -Ne), bt = de ? { x: h.x + (C ? Ne : -Ne), y: h.y } : I(h, Ne);
    let rt;
    if (de) {
      const { corridor: Ye } = V.get(h.key), ll = C ? { x: Ye, y: h.y } : { x: be.x, y: Ye }, Bt = C ? { x: Ye, y: Te.y } : { x: Te.x, y: Ye };
      rt = C ? [
        [W, ...ht(be, Ee, A)],
        [bt, ll, Bt, ...ht(Bt, Te, A), J]
      ] : [
        [W, ...ht(be, ll, A), Ee],
        [bt, ...ht(Bt, Te, A), J]
      ];
    } else rt = [
      [W, ...ht(be, Ee, A)],
      [...ht(bt, Te, A), J]
    ];
    const Cl = de ? "return" : v.get(h.transition.to) === (v.get(h.from) ?? -2) + 1 ? "main" : "forward";
    return { ...h, points: rt.flat(), segments: rt, path: rt.map(ol).join(" "), type: Cl, targetOffset: 0 };
  }), K = w.map((h) => {
    const x = p.find((be) => be.state.id === h.state.id), k = p.find((be) => be.state.id === h.region.initial), { start: W, end: J } = ie(x, k), de = [W, ...ht(I(W, 18), I(J, -18), A), J];
    return { state: h.state, key: h.key, points: de, path: ol(de) };
  }), F = [...p.flatMap((h) => [{ x: h.x - h.width / 2, y: h.y - h.height / 2 }, { x: h.x + h.width / 2, y: h.y + h.height / 2 }]), ...ne.flatMap((h) => [...h.points, { x: h.x - h.width / 2, y: h.y - h.height / 2 }, { x: h.x + h.width / 2, y: h.y + h.height / 2 }]), ...K.flatMap((h) => h.points)], L = 32 - Math.min(...F.map((h) => h.x)), Q = 32 - Math.min(...F.map((h) => h.y)), ke = Math.max(...F.map((h) => h.x)) + L + 32, pe = Math.max(...F.map((h) => h.y)) + Q + 32, ge = (h) => ({ x: h.x + L, y: h.y + Q });
  for (const h of p) Object.assign(h, ge(h));
  for (const h of ne)
    Object.assign(h, ge(h)), h.segments = h.segments.map((x) => x.map(ge)), h.points = h.segments.flat(), h.path = h.segments.map(ol).join(" ");
  for (const h of K)
    h.points = h.points.map(ge), h.path = ol(h.points);
  return { nodes: p, edges: ne, parallels: K, main: s, direction: a, width: ke, height: pe };
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
    const l = B(!1), t = bo();
    return (a, o) => (u(), g("article", Xo, [
      d("header", {
        class: pt(["work-definition-head", { "work-definition-has-handle": r(t).handle }])
      }, [
        r(t).handle ? (u(), g("div", Jo, [
          We(a.$slots, "handle")
        ])) : E("", !0),
        b(Jl, {
          class: "work-definition-toggle",
          "aria-expanded": l.value,
          onActivate: o[0] || (o[0] = (s) => l.value = !l.value)
        }, {
          default: N(() => [
            b(r(_), {
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
            e.code ? (u(), g("code", {
              key: 0,
              class: "work-mono",
              title: e.code
            }, U(e.code), 9, ei)) : E("", !0)
          ]),
          d("span", ti, [
            e.kind ? (u(), j(r(Re), {
              key: 0,
              severity: "secondary",
              value: e.kind
            }, null, 8, ["value"])) : E("", !0)
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
        e.description ? (u(), g("p", ii, U(e.description), 1)) : E("", !0)
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
    return (l, t) => (u(), g("div", si, [
      d("div", {
        class: pt(["work-field-builder", "work-definitions-" + e.columns])
      }, [
        e.count > 3 ? (u(), g("div", ri, [
          t[0] || (t[0] = d("span", null, null, -1)),
          t[1] || (t[1] = d("span", null, "Name", -1)),
          e.columns !== "plugins" ? (u(), g("span", di, "Identifier")) : E("", !0),
          d("span", null, U(e.columns === "plugins" ? "State" : e.columns === "types" ? "Process" : "Kind"), 1),
          e.columns === "fields" || e.columns === "plugins" ? (u(), g("span", ui, "Details")) : E("", !0),
          e.columns !== "plugins" ? (u(), g("span", ci, U(e.columns === "fields" ? "Used by" : "Details"), 1)) : E("", !0),
          t[2] || (t[2] = d("span", null, null, -1))
        ])) : E("", !0),
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
    const t = e, a = l, o = H(() => t.inputId ?? `field-${t.field.code}`), s = H(() => !!t.field.cardinality && t.field.cardinality !== "one"), v = H(() => Array.isArray(t.modelValue) ? t.modelValue : []), p = H(() => t.modelValue == null ? "" : typeof t.modelValue == "object" ? Dt(t.modelValue) : String(t.modelValue)), f = H(() => {
      const x = t.modelValue;
      return x && typeof x == "object" && "ref" in x && Array.isArray(x.ref) ? String(x.ref[1] ?? "") : "";
    }), i = H(() => t.disabled || ua(t.field)), n = B(!1), c = B(!1), y = B(!1), m = B(""), w = B(""), C = B([]), D = jl(), P = B([]);
    let z = 0, O;
    const T = /* @__PURE__ */ new Set();
    Ce(v, (x) => {
      P.value = O ?? x.map((k, W) => P.value[W] ?? z++), O = void 0;
    }, { immediate: !0 });
    function $(x) {
      a("update:modelValue", x);
    }
    function V(x, k) {
      const W = [...v.value];
      W[x] = k, $(W);
    }
    function S(x, k) {
      k ? T.delete(x) : T.add(x), a("validity", !T.size);
    }
    function oe(x) {
      T.delete(P.value[x]), a("validity", !T.size), O = P.value.filter((k, W) => W !== x), $(v.value.filter((k, W) => W !== x));
    }
    function M() {
      O = [...P.value, z++], $([...v.value, t.field.form === "bool" ? !1 : t.field.form === "record" ? {} : ""]);
    }
    function q(x) {
      const k = x.detail, W = k?.principal_id ?? k?.id;
      $(W ? { kind: k.type ?? "user", id: W } : void 0);
    }
    function A(x) {
      const k = x.detail;
      $(k?.thread_id ? { ref: ["component", k.thread_id] } : void 0);
    }
    const ie = B("");
    let I = "";
    Ce(() => t.modelValue, (x) => {
      const k = JSON.stringify(x ?? {}, null, 2);
      k !== I && (I = k, ie.value = k, m.value = "", a("validity", !0));
    }, { immediate: !0 });
    function ne(x) {
      ie.value = x;
      try {
        const k = JSON.parse(x);
        if (!k || typeof k != "object" || Array.isArray(k)) throw new Error("Enter a JSON object.");
        if (t.field.type === "rich_text" && !("type" in k && typeof k.type == "string")) throw new Error("The document needs a type.");
        I = JSON.stringify(k, null, 2), m.value = "", a("validity", !0), $(k);
      } catch (k) {
        m.value = k instanceof Error ? k.message : "Invalid JSON.", a("validity", !1);
      }
    }
    function K(x) {
      if (!x) {
        a("validity", !0), $(void 0);
        return;
      }
      const k = Number.isFinite(Number(x)) && (t.field.form !== "int" || Number.isSafeInteger(Number(x)));
      a("validity", k), k && $(t.field.form === "int" ? Number(x) : x);
    }
    const F = H(() => t.field.config?.format === "date");
    function L(x) {
      $(x ? F.value ? x : new Date(x).toISOString() : void 0);
    }
    const Q = H(() => {
      if (typeof t.modelValue != "string") return "";
      if (F.value) return t.modelValue.slice(0, 10);
      const x = new Date(t.modelValue);
      return Number.isNaN(x.getTime()) ? "" : new Date(x.getTime() - x.getTimezoneOffset() * 6e4).toISOString().slice(0, 16);
    });
    function ke(x) {
      $(x.detail?.ref);
    }
    function pe(x) {
      $(x.detail?.value);
    }
    let ge;
    Ce(w, () => {
      const x = D();
      if (clearTimeout(ge), !w.value.trim()) {
        C.value = [];
        return;
      }
      ge = setTimeout(async () => {
        try {
          const k = w.value.trim(), W = /^[A-Z][A-Z0-9]{1,9}-[0-9]+$/.test(k) ? [(await xt.item(t.boardId, { key: k })).item] : (await xt.query(t.boardId, { where: { field: "title", op: "contains", value: k }, limit: 8 })).items;
          x() && (C.value = W, m.value = "");
        } catch (k) {
          x() && (m.value = k instanceof Error ? k.message : "Could not search items.");
        }
      }, 200);
    });
    function h(x) {
      $({ board: t.boardId, item: x.id }), w.value = "", C.value = [];
    }
    kl(async () => {
      t.field.type === "principal" ? n.value = await lt("wc-principal-picker") : t.field.config?.target === "component" && (n.value = await lt("wc-component-picker"));
    });
    for (const [x, k] of [[() => t.editorTag, y], [() => t.linkTag, c]])
      Ce(x, async (W, J, de) => {
        let be = !0;
        if (de(() => {
          be = !1;
        }), k.value = !1, W) {
          const Te = await lt(W);
          be && (k.value = Te);
        }
      }, { immediate: !0 });
    return Pa(() => {
      clearTimeout(ge), D();
    }), (x, k) => {
      const W = Ra("FieldControl", !0);
      return u(), g("div", pi, [
        r(ua)(e.field) ? (u(), g("output", {
          key: 0,
          id: o.value,
          class: "work-read-value"
        }, U(r(Dt)(e.modelValue, e.field)), 9, bi)) : s.value ? (u(), g("div", hi, [
          d("div", yi, [
            (u(!0), g(Z, null, le(v.value, (J, de) => (u(), j(r(Re), {
              key: P.value[de],
              class: "kx-tag-sm",
              severity: "secondary"
            }, {
              default: N(() => [
                R(U(r(Dt)(J, e.field)) + " ", 1),
                b(r(X), {
                  type: "button",
                  class: "work-icon-button",
                  disabled: i.value,
                  "aria-label": "Remove value " + (de + 1),
                  onClick: (be) => oe(de),
                  severity: "secondary",
                  text: "",
                  size: "small"
                }, {
                  default: N(() => [
                    b(r(_), {
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
          (u(!0), g(Z, null, le(v.value, (J, de) => (u(), g("div", {
            key: P.value[de],
            class: "work-stack work-tight"
          }, [
            b(W, {
              "board-id": e.boardId,
              field: { ...e.field, cardinality: "one" },
              "model-value": J,
              "input-id": o.value + "-" + P.value[de],
              disabled: i.value,
              "editor-tag": e.editorTag,
              "link-tag": e.linkTag,
              "onUpdate:modelValue": (be) => V(de, be),
              onValidity: (be) => S(P.value[de], be)
            }, null, 8, ["board-id", "field", "model-value", "input-id", "disabled", "editor-tag", "link-tag", "onUpdate:modelValue", "onValidity"])
          ]))), 128)),
          b(r(X), {
            label: "Add value",
            severity: "secondary",
            size: "small",
            disabled: i.value,
            onClick: M,
            outlined: ""
          }, {
            icon: N(() => [
              b(r(_), {
                icon: "tabler:plus",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled"])
        ])) : e.editorTag && y.value ? (u(), j(zl(e.editorTag), {
          key: 2,
          "board-id": e.boardId,
          value: JSON.stringify(e.modelValue ?? null),
          config: JSON.stringify(e.field.config ?? {}),
          readonly: i.value || void 0,
          onChange: pe
        }, null, 40, ["board-id", "value", "config", "readonly"])) : e.linkTag && c.value ? (u(), j(zl(e.linkTag), {
          key: 3,
          "board-id": e.boardId,
          kind: e.field.config?.target ?? e.field.type,
          value: JSON.stringify(e.modelValue ?? null),
          readonly: i.value || void 0,
          onChange: ke
        }, null, 40, ["board-id", "kind", "value", "readonly"])) : e.field.type === "option" ? (u(), j(r(ae), {
          key: 4,
          placeholder: "Not set",
          inputId: o.value,
          "model-value": e.modelValue ?? "",
          disabled: i.value,
          "onUpdate:modelValue": k[0] || (k[0] = (J) => $(J || void 0)),
          appendTo: "self",
          optionLabel: "label",
          optionValue: "value",
          optionDisabled: "disabled",
          options: [{ label: "Not set", value: "", disabled: !1 }, ...(e.field.options ?? []).map((J) => ({ label: J.label ?? J.id, value: J.id, disabled: !1 }))]
        }, null, 8, ["inputId", "model-value", "disabled", "options"])) : e.field.form === "bool" ? (u(), g("label", gi, [
          b(r(Mt), {
            inputId: o.value,
            "model-value": e.modelValue === !0,
            disabled: i.value,
            "onUpdate:modelValue": k[1] || (k[1] = (J) => $(J)),
            binary: ""
          }, null, 8, ["inputId", "model-value", "disabled"]),
          R(U(e.modelValue === !0 ? "Yes" : e.modelValue === !1 ? "No" : "Not set"), 1)
        ])) : e.field.form === "int" ? (u(), j(r(Ge), {
          key: 6,
          inputId: o.value,
          "model-value": p.value === "" ? null : Number(p.value),
          disabled: i.value,
          "onUpdate:modelValue": k[2] || (k[2] = (J) => K(J == null ? "" : String(J))),
          useGrouping: !1
        }, null, 8, ["inputId", "model-value", "disabled"])) : e.field.form === "dec" ? (u(), j(r(ce), {
          key: 7,
          id: o.value,
          inputmode: "decimal",
          "model-value": p.value,
          disabled: i.value,
          "onUpdate:modelValue": k[3] || (k[3] = (J) => K(J ?? ""))
        }, null, 8, ["id", "model-value", "disabled"])) : e.field.form === "time" ? (u(), j(r(ce), {
          key: 8,
          id: o.value,
          type: F.value ? "date" : "datetime-local",
          value: Q.value,
          disabled: i.value,
          onInput: k[4] || (k[4] = (J) => L(J.target.value))
        }, null, 8, ["id", "type", "value", "disabled"])) : e.field.type === "principal" ? (u(), g("div", {
          key: 9,
          inert: i.value || void 0,
          class: "work-stack work-tight"
        }, [
          n.value ? (u(), g("wc-principal-picker", {
            key: 0,
            value: JSON.stringify(e.modelValue ?? {}),
            kinds: "user,group",
            onConfigChanged: q
          }, null, 40, wi)) : (u(), g("span", Vi, U(r(Dt)(e.modelValue, e.field)) + " · Person picker is unavailable.", 1))
        ], 8, ki)) : e.field.config?.target === "component" ? (u(), g("div", {
          key: 10,
          inert: i.value || void 0
        }, [
          n.value ? (u(), g("wc-component-picker", {
            key: 0,
            value: JSON.stringify({ thread_id: f.value }),
            onChange: A
          }, null, 40, xi)) : (u(), g("span", Ci, "Component picker is unavailable."))
        ], 8, $i)) : e.field.type === "item" ? (u(), g("div", Si, [
          b(r(Re), {
            class: "kx-tag-sm",
            severity: "secondary"
          }, {
            default: N(() => [
              R(U(r(Dt)(e.modelValue, e.field)), 1)
            ]),
            _: 1
          }),
          b(r(ce), {
            id: o.value,
            modelValue: w.value,
            "onUpdate:modelValue": k[5] || (k[5] = (J) => w.value = J),
            disabled: i.value,
            placeholder: "Search a title or enter an item key",
            "aria-label": "Search items"
          }, null, 8, ["id", "modelValue", "disabled"]),
          d("div", Ti, [
            (u(!0), g(Z, null, le(C.value, (J) => (u(), j(Jl, {
              key: J.id,
              class: "work-match-item",
              disabled: i.value,
              onActivate: (de) => h(J)
            }, {
              default: N(() => [
                d("code", Ei, U(J.key), 1),
                d("span", null, U(r(Dt)(J.values.title)), 1)
              ]),
              _: 2
            }, 1032, ["disabled", "onActivate"]))), 128))
          ]),
          e.modelValue ? (u(), j(r(X), {
            key: 0,
            label: "Clear reference",
            severity: "secondary",
            size: "small",
            disabled: i.value,
            onClick: k[6] || (k[6] = (J) => $(void 0)),
            outlined: ""
          }, {
            icon: N(() => [
              b(r(_), {
                icon: "tabler:list-check",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled"])) : E("", !0)
        ])) : e.field.form === "record" || e.field.type === "rich_text" || e.field.form === "quantity" || e.field.form === "ref" ? (u(), j(r(ml), {
          key: 12,
          id: o.value,
          "model-value": ie.value,
          rows: "3",
          disabled: i.value,
          "aria-invalid": !!m.value,
          "onUpdate:modelValue": k[7] || (k[7] = (J) => ne(J ?? ""))
        }, null, 8, ["id", "model-value", "disabled", "aria-invalid"])) : e.field.code === "description" ? (u(), j(r(ml), {
          key: 13,
          id: o.value,
          "model-value": p.value,
          rows: "4",
          disabled: i.value,
          "onUpdate:modelValue": k[8] || (k[8] = (J) => $(J))
        }, null, 8, ["id", "model-value", "disabled"])) : (u(), j(r(ce), {
          key: 14,
          id: o.value,
          "model-value": p.value,
          disabled: i.value,
          "onUpdate:modelValue": k[9] || (k[9] = (J) => $(J))
        }, null, 8, ["id", "model-value", "disabled"])),
        m.value ? (u(), g("span", Ui, U(m.value), 1)) : E("", !0)
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
    const t = e, a = l, o = H(() => "$actor" in Ke(t.modelValue) ? "actor" : "$now" in Ke(t.modelValue) ? "now" : "literal"), s = B(""), v = B("");
    Ce(() => t.modelValue, (i) => {
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
    return (i, n) => (u(), g("div", Di, [
      d("label", Ii, [
        R(U(e.label), 1),
        b(r(ae), {
          "aria-label": e.label + " operand",
          "model-value": o.value,
          disabled: e.disabled,
          "onUpdate:modelValue": n[0] || (n[0] = (c) => p(c)),
          appendTo: "self",
          optionLabel: "label",
          optionValue: "value",
          optionDisabled: "disabled",
          options: [{ label: "Value", value: "literal", disabled: !1 }, { label: "Current actor ($actor)", value: "actor", disabled: !1 }, { label: "Current time ($now)", value: "now", disabled: !1 }]
        }, null, 8, ["aria-label", "model-value", "disabled"])
      ]),
      o.value === "now" ? (u(), j(r(ce), {
        key: 0,
        "aria-label": e.label + " time offset",
        value: r(Ke)(e.modelValue).$now,
        disabled: e.disabled,
        placeholder: "-P7D",
        onInput: n[1] || (n[1] = (c) => a("update:modelValue", { $now: c.target.value }))
      }, null, 8, ["aria-label", "value", "disabled"])) : o.value === "actor" ? (u(), g("span", Ai, "The signed-in actor’s id")) : e.multiple ? (u(), g("div", Pi, [
        d("label", Ri, [
          n[5] || (n[5] = R("Values as JSON (operands may appear in the list)", -1)),
          b(r(ml), {
            class: "work-mono",
            "aria-label": e.label + " values",
            value: s.value,
            disabled: e.disabled,
            rows: "2",
            onInput: n[2] || (n[2] = (c) => f(c.target.value))
          }, null, 8, ["aria-label", "value", "disabled"])
        ]),
        v.value ? (u(), g("p", Oi, U(v.value), 1)) : E("", !0)
      ])) : (u(), j(qa, {
        key: 3,
        "board-id": e.boardId,
        field: { ...e.field, cardinality: "one" },
        "model-value": e.modelValue,
        disabled: e.disabled,
        "input-id": e.label.replace(/[^a-z0-9]/gi, "-"),
        "onUpdate:modelValue": n[3] || (n[3] = (c) => a("update:modelValue", c)),
        onValidity: n[4] || (n[4] = (c) => a("validity", c))
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
    const t = e, a = l, o = H(() => t.path ?? "where"), s = H(() => t.depth ?? 1), v = H(() => ["and", "or", "not", "history", "match", "rel", "children"].find((q) => q in t.modelValue) ?? "field"), p = H(() => mi(t.schema)), f = H(() => p.value.find((q) => q.code === t.modelValue.field) ?? { code: "value", form: "text" }), i = H(() => Ke(t.modelValue.history)), n = H(() => p.value.find((q) => q.code === i.value.field) ?? { code: "history", form: "text" }), c = H(() => Array.isArray(t.modelValue[v.value]) ? t.modelValue[v.value] : []), y = () => ({ field: "category", op: "eq", value: "unstarted" }), m = B(/* @__PURE__ */ new Set());
    function w(q, A) {
      A ? m.value.delete(q) : m.value.add(q), a("validity", m.value.size === 0);
    }
    Ce(v, () => {
      m.value.clear(), a("validity", !0);
    });
    function C(q) {
      const A = /* @__PURE__ */ new Set();
      for (const ie of m.value) {
        const I = Number(ie);
        !Number.isNaN(I) && I !== q && A.add(String(I > q ? I - 1 : I));
      }
      m.value = A, a("validity", A.size === 0), P({ [v.value]: c.value.filter((ie, I) => I !== q) });
    }
    function D(q) {
      a("update:modelValue", q);
    }
    function P(q) {
      D({ ...t.modelValue, ...q });
    }
    function z(q) {
      D(q === "field" ? y() : q === "and" || q === "or" ? { [q]: [y()] } : q === "not" ? { not: y() } : q === "history" ? { history: { field: "state", changed: !0 } } : q === "match" ? { match: "" } : q === "children" ? { children: !0, q: "some", where: y() } : { rel: t.schema.compiled.relation_types?.[0]?.id ?? "", dir: "outward", q: "some", where: y() });
    }
    function O(q, A) {
      P({ [v.value]: c.value.map((ie, I) => I === q ? A : ie) });
    }
    function T(q, A) {
      const ie = { ...i.value };
      A === void 0 ? (delete ie[q], w(q, !0)) : ie[q] = A, P({ history: ie });
    }
    function $(q) {
      m.value.clear(), a("validity", !0);
      const A = { ...i.value };
      delete A.was, delete A.changed, delete A.from, delete A.to, A[q] = q === "changed" ? !0 : "", P({ history: A });
    }
    const V = { code: "actor", form: "text" }, S = { code: "at", form: "time" }, oe = H(() => Array.isArray(i.value.during) ? i.value.during : []);
    function M(q, A) {
      const ie = [...oe.value];
      ie[q] = A, T("during", ie);
    }
    return (q, A) => {
      const ie = Ra("FilterNode", !0);
      return u(), g("fieldset", {
        class: "work-filter-node",
        disabled: e.disabled
      }, [
        d("legend", Mi, U(o.value), 1),
        d("label", Fi, [
          A[21] || (A[21] = R("Condition", -1)),
          b(r(ae), {
            "aria-label": o.value + " condition",
            "model-value": v.value,
            "onUpdate:modelValue": A[0] || (A[0] = (I) => z(I)),
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            optionDisabled: "disabled",
            options: [{ label: "Field", value: "field", disabled: !1 }, ...["and", "or", "not", "history", "rel", "children", "match"].map((I) => ({ label: I, value: I, disabled: s.value >= 6 && ["and", "or", "not", "rel", "children"].includes(I) }))]
          }, null, 8, ["aria-label", "model-value", "options"])
        ]),
        v.value === "and" || v.value === "or" ? (u(), g(Z, { key: 0 }, [
          (u(!0), g(Z, null, le(c.value, (I, ne) => (u(), g("div", {
            key: ne,
            class: "work-stack work-tight"
          }, [
            b(ie, {
              "board-id": e.boardId,
              schema: e.schema,
              "model-value": I,
              path: o.value + "." + v.value + "[" + ne + "]",
              depth: s.value + 1,
              "onUpdate:modelValue": (K) => O(ne, K),
              onValidity: (K) => w(String(ne), K)
            }, null, 8, ["board-id", "schema", "model-value", "path", "depth", "onUpdate:modelValue", "onValidity"]),
            b(r(X), {
              label: "Remove condition",
              size: "small",
              severity: "secondary",
              onClick: (K) => C(ne),
              outlined: ""
            }, {
              icon: N(() => [
                b(r(_), {
                  icon: "tabler:trash",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["onClick"])
          ]))), 128)),
          b(r(X), {
            label: "Add condition",
            size: "small",
            severity: "secondary",
            disabled: s.value >= 6,
            onClick: A[1] || (A[1] = (I) => P({ [v.value]: [...c.value, y()] })),
            outlined: ""
          }, {
            icon: N(() => [
              b(r(_), {
                icon: "tabler:plus",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled"])
        ], 64)) : v.value === "not" ? (u(), j(ie, {
          key: 1,
          "board-id": e.boardId,
          schema: e.schema,
          "model-value": r(Ke)(e.modelValue.not),
          path: o.value + ".not",
          depth: s.value + 1,
          "onUpdate:modelValue": A[2] || (A[2] = (I) => P({ not: I })),
          onValidity: A[3] || (A[3] = (I) => w("nested", I))
        }, null, 8, ["board-id", "schema", "model-value", "path", "depth"])) : v.value === "field" ? (u(), g(Z, { key: 2 }, [
          d("div", Li, [
            d("label", null, [
              A[22] || (A[22] = R("Field", -1)),
              b(r(ae), {
                "aria-label": o.value + " field",
                "model-value": e.modelValue.field,
                "onUpdate:modelValue": A[4] || (A[4] = (I) => P({ field: I, op: "eq", value: void 0 })),
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                optionDisabled: "disabled",
                options: [...(p.value ?? []).map((I) => ({ label: r(_e)(I), value: I.code, disabled: !1 }))]
              }, null, 8, ["aria-label", "model-value", "options"])
            ]),
            d("label", null, [
              A[23] || (A[23] = R("Operator", -1)),
              b(r(ae), {
                "aria-label": o.value + " operator",
                "model-value": e.modelValue.op,
                "onUpdate:modelValue": A[5] || (A[5] = (I) => P({ op: I, value: I === "is_null" ? !0 : void 0 })),
                appendTo: "self",
                options: r(fi)(f.value)
              }, null, 8, ["aria-label", "model-value", "options"])
            ])
          ]),
          b(qt, {
            "board-id": e.boardId,
            field: e.modelValue.op === "is_null" ? { code: "null", form: "bool" } : f.value,
            "model-value": e.modelValue.value,
            multiple: ["in", "nin", "between"].includes(String(e.modelValue.op)),
            label: o.value + " value",
            "onUpdate:modelValue": A[6] || (A[6] = (I) => P({ value: I })),
            onValidity: A[7] || (A[7] = (I) => w("value", I))
          }, null, 8, ["board-id", "field", "model-value", "multiple", "label"])
        ], 64)) : v.value === "match" ? (u(), g("label", zi, [
          A[24] || (A[24] = R("Search", -1)),
          b(r(ce), {
            "aria-label": o.value + " search",
            value: e.modelValue.match,
            onInput: A[8] || (A[8] = (I) => P({ match: I.target.value }))
          }, null, 8, ["aria-label", "value"])
        ])) : v.value === "history" ? (u(), g(Z, { key: 4 }, [
          d("div", Bi, [
            d("label", null, [
              A[25] || (A[25] = R("Field", -1)),
              b(r(ae), {
                "aria-label": o.value + " history field",
                "model-value": i.value.field,
                "onUpdate:modelValue": A[9] || (A[9] = (I) => T("field", I)),
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                optionDisabled: "disabled",
                options: [...(p.value ?? []).map((I) => ({ label: r(_e)(I), value: I.code, disabled: !1 }))]
              }, null, 8, ["aria-label", "model-value", "options"])
            ]),
            d("label", null, [
              A[26] || (A[26] = R("History", -1)),
              b(r(ae), {
                "aria-label": o.value + " history mode",
                "model-value": i.value.changed ? "changed" : "was",
                "onUpdate:modelValue": A[10] || (A[10] = (I) => $(I)),
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                optionDisabled: "disabled",
                options: [{ label: "Changed", value: "changed", disabled: !1 }, { label: "Was", value: "was", disabled: !1 }]
              }, null, 8, ["aria-label", "model-value"])
            ])
          ]),
          i.value.changed ? (u(), g(Z, { key: 0 }, le(["from", "to"], (I) => d("div", { key: I }, [
            d("label", ji, [
              b(r(Mt), {
                "model-value": I in i.value,
                "aria-label": "Constrain " + I,
                "onUpdate:modelValue": (ne) => T(I, ne ? "" : void 0),
                binary: ""
              }, null, 8, ["model-value", "aria-label", "onUpdate:modelValue"]),
              R(U(I), 1)
            ]),
            I in i.value ? (u(), j(qt, {
              key: 0,
              "board-id": e.boardId,
              field: n.value,
              "model-value": i.value[I],
              label: o.value + " history " + I,
              "onUpdate:modelValue": (ne) => T(I, ne),
              onValidity: (ne) => w(I, ne)
            }, null, 8, ["board-id", "field", "model-value", "label", "onUpdate:modelValue", "onValidity"])) : E("", !0)
          ])), 64)) : (u(), j(qt, {
            key: 1,
            "board-id": e.boardId,
            field: n.value,
            "model-value": i.value.was,
            label: o.value + " history was",
            "onUpdate:modelValue": A[11] || (A[11] = (I) => T("was", I)),
            onValidity: A[12] || (A[12] = (I) => w("was", I))
          }, null, 8, ["board-id", "field", "model-value", "label"])),
          d("label", qi, [
            b(r(Mt), {
              "model-value": "by" in i.value,
              "aria-label": "Constrain actor",
              "onUpdate:modelValue": A[13] || (A[13] = (I) => T("by", I ? { $actor: "id" } : void 0)),
              binary: ""
            }, null, 8, ["model-value"]),
            A[27] || (A[27] = R("By actor", -1))
          ]),
          "by" in i.value ? (u(), j(qt, {
            key: 2,
            "board-id": e.boardId,
            field: V,
            "model-value": i.value.by,
            label: o.value + " history by",
            "onUpdate:modelValue": A[14] || (A[14] = (I) => T("by", I))
          }, null, 8, ["board-id", "model-value", "label"])) : E("", !0),
          d("label", Wi, [
            b(r(Mt), {
              "model-value": "during" in i.value,
              "aria-label": "Constrain time window",
              "onUpdate:modelValue": A[15] || (A[15] = (I) => T("during", I ? [{ $now: "-P30D" }, { $now: "P0D" }] : void 0)),
              binary: ""
            }, null, 8, ["model-value"]),
            A[28] || (A[28] = R("During", -1))
          ]),
          "during" in i.value ? (u(), g("div", Ki, [
            (u(), g(Z, null, le(["start", "end"], (I, ne) => b(qt, {
              key: I,
              "board-id": e.boardId,
              field: S,
              "model-value": oe.value[ne],
              label: o.value + " during " + I,
              "onUpdate:modelValue": (K) => M(ne, K)
            }, null, 8, ["board-id", "model-value", "label", "onUpdate:modelValue"])), 64))
          ])) : E("", !0)
        ], 64)) : (u(), g(Z, { key: 5 }, [
          d("div", Gi, [
            v.value === "rel" ? (u(), g(Z, { key: 0 }, [
              d("label", null, [
                A[29] || (A[29] = R("Relation", -1)),
                b(r(ae), {
                  "model-value": e.modelValue.rel,
                  "onUpdate:modelValue": A[16] || (A[16] = (I) => P({ rel: I })),
                  appendTo: "self",
                  optionLabel: "label",
                  optionValue: "value",
                  optionDisabled: "disabled",
                  options: [...(e.schema.compiled.relation_types ?? []).map((I) => ({ label: I.outward ?? I.id, value: I.id, disabled: !1 }))]
                }, null, 8, ["model-value", "options"])
              ]),
              d("label", null, [
                A[30] || (A[30] = R("Direction", -1)),
                b(r(ae), {
                  "model-value": e.modelValue.dir,
                  "onUpdate:modelValue": A[17] || (A[17] = (I) => P({ dir: I })),
                  appendTo: "self",
                  optionLabel: "label",
                  optionValue: "value",
                  optionDisabled: "disabled",
                  options: [{ label: "Outward", value: "outward", disabled: !1 }, { label: "Inward", value: "inward", disabled: !1 }]
                }, null, 8, ["model-value"])
              ])
            ], 64)) : E("", !0),
            d("label", null, [
              A[31] || (A[31] = R("Quantifier", -1)),
              b(r(ae), {
                "model-value": e.modelValue.q,
                "onUpdate:modelValue": A[18] || (A[18] = (I) => P({ q: I })),
                appendTo: "self",
                options: ["some", "every", "none"]
              }, null, 8, ["model-value"])
            ])
          ]),
          b(ie, {
            "board-id": e.boardId,
            schema: e.schema,
            "model-value": r(Ke)(e.modelValue.where),
            path: o.value + ".where",
            depth: s.value + 1,
            "onUpdate:modelValue": A[19] || (A[19] = (I) => P({ where: I })),
            onValidity: A[20] || (A[20] = (I) => w("nested", I))
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
    const t = e, a = l, o = H(() => ({ declaration: t.draft, compiled: t.draft, generation: 0, as_of: 0, key_prefix: "" })), s = /* @__PURE__ */ new Set();
    function v(f, i) {
      i ? s.delete(f) : s.add(f), a("validity", !s.size);
    }
    function p(f) {
      a("update:modelValue", f ? { field: t.draft.fields?.[0]?.code ?? "state", op: "eq" } : void 0), f || (s.clear(), a("validity", !0));
    }
    return nt(() => a("validity", !0)), (f, i) => (u(), g("section", Hi, [
      d("label", Xi, [
        b(r(Le), {
          "model-value": e.modelValue != null,
          "aria-label": e.label,
          "onUpdate:modelValue": p
        }, null, 8, ["model-value", "aria-label"]),
        R(U(e.label), 1)
      ]),
      e.modelValue != null ? (u(), j(Yi, {
        key: 0,
        schema: o.value,
        "board-id": e.boardId ?? "",
        "model-value": r(Ke)(e.modelValue),
        path: e.label,
        "onUpdate:modelValue": i[0] || (i[0] = (n) => a("update:modelValue", n)),
        onValidity: i[1] || (i[1] = (n) => v("structured", n))
      }, null, 8, ["schema", "board-id", "model-value", "path"])) : E("", !0),
      e.modelValue != null ? (u(), j(ot, {
        key: 1,
        label: e.label + " predicate",
        "model-value": e.modelValue,
        hint: "Use any predicate accepted by Work, including installed or deeply nested forms.",
        "onUpdate:modelValue": i[2] || (i[2] = (n) => a("update:modelValue", n)),
        onValidity: i[3] || (i[3] = (n) => v("raw", n))
      }, null, 8, ["label", "model-value"])) : E("", !0)
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
    const t = e, a = l, o = B(!1), s = B(0), v = H(() => t.modelValue ?? []), { principalLabel: p, rememberPrincipal: f, nameError: i } = Na(() => t.boardId ?? "", () => v.value);
    kl(async () => {
      o.value = await lt("wc-principal-picker");
    });
    function n(c) {
      const y = c.detail, m = y?.principal_id ?? y?.id;
      if (!m) return;
      const w = { kind: y.type ?? "user", id: m };
      y.label && f(w, y.label), v.value.some((C) => C.id === m && C.kind === w.kind) || a("update:modelValue", [...v.value, w]), s.value++;
    }
    return (c, y) => (u(), g(Z, null, [
      r(i) ? (u(), g("p", Ji, U(r(i)), 1)) : E("", !0),
      d("section", {
        class: "work-stack work-tight work-principals-picker",
        "aria-label": e.label
      }, [
        d("h4", Qi, U(e.label), 1),
        v.value.length ? (u(), g("div", _i, [
          (u(!0), g(Z, null, le(v.value, (m, w) => (u(), j(r(Re), {
            key: m.kind + m.id,
            severity: "secondary",
            class: "kx-tag-sm"
          }, {
            default: N(() => [
              R(U(r(p)(m)), 1),
              b(r(X), {
                text: "",
                severity: "secondary",
                size: "small",
                "aria-label": "Remove " + r(p)(m),
                onClick: (C) => a("update:modelValue", v.value.filter((D, P) => P !== w))
              }, {
                default: N(() => [
                  b(r(_), { icon: "tabler:x" })
                ]),
                _: 1
              }, 8, ["aria-label", "onClick"])
            ]),
            _: 2
          }, 1024))), 128))
        ])) : E("", !0),
        o.value ? (u(), g("wc-principal-picker", {
          key: s.value,
          kinds: e.kinds ?? "user,group",
          onConfigChanged: n
        }, null, 40, en)) : (u(), g("p", tn, "People and group picker is unavailable."))
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
    const t = e, a = l, o = H(() => (t.modelValue ?? []).flatMap((v) => "user" in v ? [{ kind: "user", id: v.user }] : "group" in v ? [{ kind: "group", id: v.group }] : []));
    function s(v) {
      const p = [...(t.modelValue ?? []).filter((f) => "field" in f || "service" in f), ...v.map((f) => f.kind === "group" ? { group: f.id } : { user: f.id })];
      a("update:modelValue", p.length ? p : void 0);
    }
    return (v, p) => (u(), g("div", ln, [
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
    var s, v, p, f, i, n, c;
    if (e !== window && e.parentNode && e !== et() ? (s = e.getBoundingClientRect(), v = s.top, p = s.left, f = s.bottom, i = s.right, n = s.height, c = s.width) : (v = 0, p = 0, f = window.innerHeight, i = window.innerWidth, n = window.innerHeight, c = window.innerWidth), (l || t) && e !== window && (o = o || e.parentNode, !st))
      do
        if (o && o.getBoundingClientRect && (se(o, "transform") !== "none" || t && se(o, "position") !== "static")) {
          var y = o.getBoundingClientRect();
          v -= y.top + parseInt(se(o, "border-top-width")), p -= y.left + parseInt(se(o, "border-left-width")), f = v + s.height, i = p + s.width;
          break;
        }
      while (o = o.parentNode);
    if (a && e !== window) {
      var m = Ft(o || e), w = m && m.a, C = m && m.d;
      m && (v /= C, p /= w, c /= w, n /= C, f = v + n, i = p + c);
    }
    return {
      top: v,
      left: p,
      bottom: f,
      right: i,
      width: c,
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
    var s, v, p, f;
    if (!(!Je(o, l.draggable, e, !1) || o.animated || o === t)) {
      var i = De(o);
      a.left = Math.min((s = a.left) !== null && s !== void 0 ? s : 1 / 0, i.left), a.top = Math.min((v = a.top) !== null && v !== void 0 ? v : 1 / 0, i.top), a.right = Math.max((p = a.right) !== null && p !== void 0 ? p : -1 / 0, i.right), a.bottom = Math.max((f = a.bottom) !== null && f !== void 0 ? f : -1 / 0, i.bottom);
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
      e.forEach(function(p) {
        var f = 0, i = p.target, n = i.fromRect, c = De(i), y = i.prevFromRect, m = i.prevToRect, w = p.rect, C = Ft(i, !0);
        C && (c.top -= C.f, c.left -= C.e), i.toRect = c, i.thisAnimationDuration && Il(y, c) && !Il(n, c) && // Make sure animatingRect is on line between toRect & fromRect
        (w.top - c.top) / (w.left - c.left) === (n.top - c.top) / (n.left - c.left) && (f = pn(w, y, m, o.options)), Il(c, n) || (i.prevFromRect = n, i.prevToRect = c, f || (f = o.options.animation), o.animate(i, w, c, f)), f && (s = !0, v = Math.max(v, f), clearTimeout(i.animationResetTimer), i.animationResetTimer = setTimeout(function() {
          i.animationTime = 0, i.prevFromRect = null, i.fromRect = null, i.prevToRect = null, i.thisAnimationDuration = null;
        }, f), i.thisAnimationDuration = f);
      }), clearTimeout(l), s ? l = setTimeout(function() {
        typeof a == "function" && a();
      }, v) : typeof a == "function" && a(), e = [];
    },
    animate: function(a, o, s, v) {
      if (v) {
        se(a, "transition", ""), se(a, "transform", "");
        var p = Ft(this.el), f = p && p.a, i = p && p.d, n = (o.left - s.left) / (f || 1), c = (o.top - s.top) / (i || 1);
        a.animatingX = !!n, a.animatingY = !!c, se(a, "transform", "translate3d(" + n + "px," + c + "px,0)"), this.forRepaintDummy = fn(a), se(a, "transition", "transform " + v + "ms" + (this.options.easing ? " " + this.options.easing : "")), se(a, "transform", "translate3d(0,0,0)"), typeof a.animated == "number" && clearTimeout(a.animated), a.animated = setTimeout(function() {
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
    At.forEach(function(p) {
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
  var l = e.sortable, t = e.rootEl, a = e.name, o = e.targetEl, s = e.cloneEl, v = e.toEl, p = e.fromEl, f = e.oldIndex, i = e.newIndex, n = e.oldDraggableIndex, c = e.newDraggableIndex, y = e.originalEvent, m = e.putSortable, w = e.extraEventProperties;
  if (l = l || t && t[Fe], !!l) {
    var C, D = l.options, P = "on" + a.charAt(0).toUpperCase() + a.substr(1);
    window.CustomEvent && !st && !el ? C = new CustomEvent(a, {
      bubbles: !0,
      cancelable: !0
    }) : (C = document.createEvent("Event"), C.initEvent(a, !0, !0)), C.to = v || t, C.from = p || t, C.item = o || t, C.clone = s, C.oldIndex = f, C.newIndex = i, C.oldDraggableIndex = n, C.newDraggableIndex = c, C.originalEvent = y, C.pullMode = m ? m.lastPutMode : void 0;
    var z = tt(tt({}, w), tl.getEventProperties(a, l));
    for (var O in z)
      C[O] = z[O];
    t && t.dispatchEvent(C), D[P] && D[P].call(l, C);
  }
}
var hn = ["evt"], Me = function(l, t) {
  var a = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, o = a.evt, s = on(a, hn);
  tl.pluginEvent.bind(re)(l, t, tt({
    dragEl: Y,
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
  bn(tt({
    putSortable: Ie,
    cloneEl: xe,
    targetEl: Y,
    rootEl: $e,
    oldIndex: Nt,
    oldDraggableIndex: Jt,
    newIndex: Be,
    newDraggableIndex: vt
  }, e));
}
var Y, Se, ue, $e, Vt, dl, xe, mt, Nt, Be, Jt, vt, il, Ie, Rt = !1, pl = !1, bl = [], yt, Xe, Pl, Rl, Va, $a, Kt, Pt, Zt, Qt = !1, nl = !1, ul, Pe, Ol = [], Wl = !1, hl = [], xl = typeof document < "u", sl = ta, xa = el || st ? "cssFloat" : "float", yn = xl && !Ka && !ta && "draggable" in document.createElement("div"), _a = (function() {
  if (xl) {
    if (st)
      return !1;
    var e = document.createElement("x");
    return e.style.cssText = "pointer-events:auto", e.style.pointerEvents === "auto";
  }
})(), eo = function(l, t) {
  var a = se(l), o = parseInt(a.width) - parseInt(a.paddingLeft) - parseInt(a.paddingRight) - parseInt(a.borderLeftWidth) - parseInt(a.borderRightWidth), s = zt(l, 0, t), v = zt(l, 1, t), p = s && se(s), f = v && se(v), i = p && parseInt(p.marginLeft) + parseInt(p.marginRight) + De(s).width, n = f && parseInt(f.marginLeft) + parseInt(f.marginRight) + De(v).width;
  if (a.display === "flex")
    return a.flexDirection === "column" || a.flexDirection === "column-reverse" ? "vertical" : "horizontal";
  if (a.display === "grid")
    return a.gridTemplateColumns.split(" ").length <= 1 ? "vertical" : "horizontal";
  if (s && p.float && p.float !== "none") {
    var c = p.float === "left" ? "left" : "right";
    return v && (f.clear === "both" || f.clear === c) ? "vertical" : "horizontal";
  }
  return s && (p.display === "block" || p.display === "flex" || p.display === "table" || p.display === "grid" || i >= o && a[xa] === "none" || v && a[xa] === "none" && i + n > o) ? "vertical" : "horizontal";
}, gn = function(l, t, a) {
  var o = a ? l.left : l.top, s = a ? l.right : l.bottom, v = a ? l.width : l.height, p = a ? t.left : t.top, f = a ? t.right : t.bottom, i = a ? t.width : t.height;
  return o === p || s === f || o + v / 2 === p + i / 2;
}, kn = function(l, t) {
  var a;
  return bl.some(function(o) {
    var s = o[Fe].options.emptyInsertThreshold;
    if (!(!s || la(o))) {
      var v = De(o), p = l >= v.left - s && l <= v.right + s, f = t >= v.top - s && t <= v.bottom + s;
      if (p && f)
        return a = o;
    }
  }), a;
}, to = function(l) {
  function t(s, v) {
    return function(p, f, i, n) {
      var c = p.options.group.name && f.options.group.name && p.options.group.name === f.options.group.name;
      if (s == null && (v || c))
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
  if (Y) {
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
  Y && Y.parentNode[Fe]._isOutsideThisEl(l.target);
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
    return typeof this.options.direction == "function" ? this.options.direction.call(this, l, t, Y) : this.options.direction;
  },
  _onTapStart: function(l) {
    if (l.cancelable) {
      var t = this, a = this.el, o = this.options, s = o.preventOnFilter, v = l.type, p = l.touches && l.touches[0] || l.pointerType && l.pointerType === "touch" && l, f = (p || l).target, i = l.target.shadowRoot && (l.path && l.path[0] || l.composedPath && l.composedPath()[0]) || f, n = o.filter;
      if (Un(a), !Y && !(/mousedown|pointerdown/.test(v) && l.button !== 0 || o.disabled) && !i.isContentEditable && !(!this.nativeDraggable && Ht && f && f.tagName.toUpperCase() === "SELECT") && (f = Je(f, o.draggable, a, !1), !(f && f.animated) && dl !== f)) {
        if (Nt = qe(f), Jt = qe(f, o.draggable), typeof n == "function") {
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
        } else if (n && (n = n.split(",").some(function(c) {
          if (c = Je(i, c.trim(), a, !1), c)
            return Oe({
              sortable: t,
              rootEl: c,
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
    if (a && !Y && a.parentNode === s) {
      var i = De(a);
      if ($e = s, Y = a, Se = Y.parentNode, Vt = Y.nextSibling, dl = a, il = v.group, re.dragged = Y, yt = {
        target: Y,
        clientX: (t || l).clientX,
        clientY: (t || l).clientY
      }, Va = yt.clientX - i.left, $a = yt.clientY - i.top, this._lastX = (t || l).clientX, this._lastY = (t || l).clientY, Y.style["will-change"] = "all", f = function() {
        if (Me("delayEnded", o, {
          evt: l
        }), re.eventCanceled) {
          o._onDrop();
          return;
        }
        o._disableDelayedDragEvents(), !ya && o.nativeDraggable && (Y.draggable = !0), o._triggerDragStart(l, t), Oe({
          sortable: o,
          name: "choose",
          originalEvent: l
        }), ze(Y, v.chosenClass, !0);
      }, v.ignore.split(",").forEach(function(n) {
        Ha(Y, n.trim(), Nl);
      }), fe(p, "dragover", gt), fe(p, "mousemove", gt), fe(p, "touchmove", gt), v.supportPointer ? (fe(p, "pointerup", o._onDrop), !this.nativeDraggable && fe(p, "pointercancel", o._onDrop)) : (fe(p, "mouseup", o._onDrop), fe(p, "touchend", o._onDrop), fe(p, "touchcancel", o._onDrop)), ya && this.nativeDraggable && (this.options.touchStartThreshold = 4, Y.draggable = !0), Me("delayStart", this, {
        evt: l
      }), v.delay && (!v.delayOnTouchOnly || t) && (!this.nativeDraggable || !(el || st))) {
        if (re.eventCanceled) {
          this._onDrop();
          return;
        }
        v.supportPointer ? (fe(p, "pointerup", o._disableDelayedDrag), fe(p, "pointercancel", o._disableDelayedDrag)) : (fe(p, "mouseup", o._disableDelayedDrag), fe(p, "touchend", o._disableDelayedDrag), fe(p, "touchcancel", o._disableDelayedDrag)), fe(p, "mousemove", o._delayedDragTouchMoveHandler), fe(p, "touchmove", o._delayedDragTouchMoveHandler), v.supportPointer && fe(p, "pointermove", o._delayedDragTouchMoveHandler), o._dragStartTimer = setTimeout(f, v.delay);
      } else
        f();
    }
  },
  _delayedDragTouchMoveHandler: function(l) {
    var t = l.touches ? l.touches[0] : l;
    Math.max(Math.abs(t.clientX - this._lastX), Math.abs(t.clientY - this._lastY)) >= Math.floor(this.options.touchStartThreshold / (this.nativeDraggable && window.devicePixelRatio || 1)) && this._disableDelayedDrag();
  },
  _disableDelayedDrag: function() {
    Y && Nl(Y), clearTimeout(this._dragStartTimer), this._disableDelayedDragEvents();
  },
  _disableDelayedDragEvents: function() {
    var l = this.el.ownerDocument;
    me(l, "mouseup", this._disableDelayedDrag), me(l, "touchend", this._disableDelayedDrag), me(l, "touchcancel", this._disableDelayedDrag), me(l, "pointerup", this._disableDelayedDrag), me(l, "pointercancel", this._disableDelayedDrag), me(l, "mousemove", this._delayedDragTouchMoveHandler), me(l, "touchmove", this._delayedDragTouchMoveHandler), me(l, "pointermove", this._delayedDragTouchMoveHandler);
  },
  _triggerDragStart: function(l, t) {
    t = t || l.pointerType == "touch" && l, !this.nativeDraggable || t ? this.options.supportPointer ? fe(document, "pointermove", this._onTouchMove) : t ? fe(document, "touchmove", this._onTouchMove) : fe(document, "mousemove", this._onTouchMove) : (fe(Y, "dragend", this), fe($e, "dragstart", this._onDragStart));
    try {
      document.selection ? cl(function() {
        document.selection.empty();
      }) : window.getSelection().removeAllRanges();
    } catch {
    }
  },
  _dragStarted: function(l, t) {
    if (Rt = !1, $e && Y) {
      Me("dragStarted", this, {
        evt: t
      }), this.nativeDraggable && fe(document, "dragover", wn);
      var a = this.options;
      !l && ze(Y, a.dragClass, !1), ze(Y, a.ghostClass, !0), re.active = this, l && this._appendGhost(), Oe({
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
      if (Y.parentNode[Fe]._isOutsideThisEl(l), t)
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
      var t = this.options, a = t.fallbackTolerance, o = t.fallbackOffset, s = l.touches ? l.touches[0] : l, v = ue && Ft(ue, !0), p = ue && v && v.a, f = ue && v && v.d, i = sl && Pe && wa(Pe), n = (s.clientX - yt.clientX + o.x) / (p || 1) + (i ? i[0] - Ol[0] : 0) / (p || 1), c = (s.clientY - yt.clientY + o.y) / (f || 1) + (i ? i[1] - Ol[1] : 0) / (f || 1);
      if (!re.active && !Rt) {
        if (a && Math.max(Math.abs(s.clientX - this._lastX), Math.abs(s.clientY - this._lastY)) < a)
          return;
        this._onDragStart(l, !0);
      }
      if (ue) {
        v ? (v.e += n - (Pl || 0), v.f += c - (Rl || 0)) : v = {
          a: 1,
          b: 0,
          c: 0,
          d: 1,
          e: n,
          f: c
        };
        var y = "matrix(".concat(v.a, ",").concat(v.b, ",").concat(v.c, ",").concat(v.d, ",").concat(v.e, ",").concat(v.f, ")");
        se(ue, "webkitTransform", y), se(ue, "mozTransform", y), se(ue, "msTransform", y), se(ue, "transform", y), Pl = n, Rl = c, Xe = s;
      }
      l.cancelable && l.preventDefault();
    }
  },
  _appendGhost: function() {
    if (!ue) {
      var l = this.options.fallbackOnBody ? document.body : $e, t = De(Y, !0, sl, !0, l), a = this.options;
      if (sl) {
        for (Pe = l; se(Pe, "position") === "static" && se(Pe, "transform") === "none" && Pe !== document; )
          Pe = Pe.parentNode;
        Pe !== document.body && Pe !== document.documentElement ? (Pe === document && (Pe = et()), t.top += Pe.scrollTop, t.left += Pe.scrollLeft) : Pe = et(), Ol = wa(Pe);
      }
      ue = Y.cloneNode(!0), ze(ue, a.ghostClass, !1), ze(ue, a.fallbackClass, !0), ze(ue, a.dragClass, !0), se(ue, "transition", ""), se(ue, "transform", ""), se(ue, "box-sizing", "border-box"), se(ue, "margin", 0), se(ue, "top", t.top), se(ue, "left", t.left), se(ue, "width", t.width), se(ue, "height", t.height), se(ue, "opacity", "0.8"), se(ue, "position", sl ? "absolute" : "fixed"), se(ue, "zIndex", "100000"), se(ue, "pointerEvents", "none"), re.ghost = ue, l.appendChild(ue), se(ue, "transform-origin", Va / parseInt(ue.style.width) * 100 + "% " + $a / parseInt(ue.style.height) * 100 + "%");
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
    Me("setupClone", this), re.eventCanceled || (xe = Za(Y), xe.removeAttribute("id"), xe.draggable = !1, xe.style["will-change"] = "", this._hideClone(), ze(xe, this.options.chosenClass, !1), re.clone = xe), a.cloneId = cl(function() {
      Me("clone", a), !re.eventCanceled && (a.options.removeCloneOnHide || $e.insertBefore(xe, Y), a._hideClone(), Oe({
        sortable: a,
        name: "clone"
      }));
    }), !t && ze(Y, s.dragClass, !0), t ? (pl = !0, a._loopId = setInterval(a._emulateDragOver, 50)) : (me(document, "mouseup", a._onDrop), me(document, "touchend", a._onDrop), me(document, "touchcancel", a._onDrop), o && (o.effectAllowed = "move", s.setData && s.setData.call(a, o, Y)), fe(document, "drop", a), se(Y, "transform", "translateZ(0)")), Rt = !0, a._dragStartId = cl(a._dragStarted.bind(a, t, l)), fe(document, "selectstart", a), Kt = !0, window.getSelection().removeAllRanges(), Ht && se(document.body, "user-select", "none");
  },
  // Returns true - if no further action is needed (either inserted or another condition)
  _onDragOver: function(l) {
    var t = this.el, a = l.target, o, s, v, p = this.options, f = p.group, i = re.active, n = il === f, c = p.sort, y = Ie || i, m, w = this, C = !1;
    if (Wl) return;
    function D(Q, ke) {
      Me(Q, w, tt({
        evt: l,
        isOwner: n,
        axis: m ? "vertical" : "horizontal",
        revert: v,
        dragRect: o,
        targetRect: s,
        canSort: c,
        fromSortable: y,
        target: a,
        completed: z,
        onMove: function(ge, h) {
          return rl($e, t, Y, o, ge, De(ge), l, h);
        },
        changed: O
      }, ke));
    }
    function P() {
      D("dragOverAnimationCapture"), w.captureAnimationState(), w !== y && y.captureAnimationState();
    }
    function z(Q) {
      return D("dragOverCompleted", {
        insertion: Q
      }), Q && (n ? i._hideClone() : i._showClone(w), w !== y && (ze(Y, Ie ? Ie.options.ghostClass : i.options.ghostClass, !1), ze(Y, p.ghostClass, !0)), Ie !== w && w !== re.active ? Ie = w : w === re.active && Ie && (Ie = null), y === w && (w._ignoreWhileAnimating = a), w.animateAll(function() {
        D("dragOverAnimationComplete"), w._ignoreWhileAnimating = null;
      }), w !== y && (y.animateAll(), y._ignoreWhileAnimating = null)), (a === Y && !Y.animated || a === t && !a.animated) && (Pt = null), !p.dragoverBubble && !l.rootEl && a !== document && (Y.parentNode[Fe]._isOutsideThisEl(l.target), !Q && gt(l)), !p.dragoverBubble && l.stopPropagation && l.stopPropagation(), C = !0;
    }
    function O() {
      Be = qe(Y), vt = qe(Y, p.draggable), Oe({
        sortable: w,
        name: "change",
        toEl: t,
        newIndex: Be,
        newDraggableIndex: vt,
        originalEvent: l
      });
    }
    if (l.preventDefault !== void 0 && l.cancelable && l.preventDefault(), a = Je(a, p.draggable, t, !0), D("dragOver"), re.eventCanceled) return C;
    if (Y.contains(l.target) || a.animated && a.animatingX && a.animatingY || w._ignoreWhileAnimating === a)
      return z(!1);
    if (pl = !1, i && !p.disabled && (n ? c || (v = Se !== $e) : Ie === this || (this.lastPutMode = il.checkPull(this, i, Y, l)) && f.checkPut(this, i, Y, l))) {
      if (m = this._getDirection(l, a) === "vertical", o = De(Y), D("dragOverValid"), re.eventCanceled) return C;
      if (v)
        return Se = $e, P(), this._hideClone(), D("revert"), re.eventCanceled || (Vt ? $e.insertBefore(Y, Vt) : $e.appendChild(Y)), z(!0);
      var T = la(t, p.draggable);
      if (!T || Cn(l, m, this) && !T.animated) {
        if (T === Y)
          return z(!1);
        if (T && t === l.target && (a = T), a && (s = De(a)), rl($e, t, Y, o, a, s, l, !!a) !== !1)
          return P(), T && T.nextSibling ? t.insertBefore(Y, T.nextSibling) : t.appendChild(Y), Se = t, O(), z(!0);
      } else if (T && xn(l, m, this)) {
        var $ = zt(t, 0, p, !0);
        if ($ === Y)
          return z(!1);
        if (a = $, s = De(a), rl($e, t, Y, o, a, s, l, !1) !== !1)
          return P(), t.insertBefore(Y, $), Se = t, O(), z(!0);
      } else if (a.parentNode === t) {
        s = De(a);
        var V = 0, S, oe = Y.parentNode !== t, M = !gn(Y.animated && Y.toRect || o, a.animated && a.toRect || s, m), q = m ? "top" : "left", A = ka(a, "top", "top") || ka(Y, "top", "top"), ie = A ? A.scrollTop : void 0;
        Pt !== a && (S = s[q], Qt = !1, nl = !M && p.invertSwap || oe), V = Sn(l, a, s, m, M ? 1 : p.swapThreshold, p.invertedSwapThreshold == null ? p.swapThreshold : p.invertedSwapThreshold, nl, Pt === a);
        var I;
        if (V !== 0) {
          var ne = qe(Y);
          do
            ne -= V, I = Se.children[ne];
          while (I && (se(I, "display") === "none" || I === ue));
        }
        if (V === 0 || I === a)
          return z(!1);
        Pt = a, Zt = V;
        var K = a.nextElementSibling, F = !1;
        F = V === 1;
        var L = rl($e, t, Y, o, a, s, l, F);
        if (L !== !1)
          return (L === 1 || L === -1) && (F = L === 1), Wl = !0, setTimeout($n, 30), P(), F && !K ? t.appendChild(Y) : a.parentNode.insertBefore(Y, F ? K : a), A && Ja(A, 0, ie - A.scrollTop), Se = Y.parentNode, S !== void 0 && !nl && (ul = Math.abs(S - De(a)[q])), O(), z(!0);
      }
      if (t.contains(Y))
        return z(!1);
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
    if (Be = qe(Y), vt = qe(Y, a.draggable), Me("drop", this, {
      evt: l
    }), Se = Y && Y.parentNode, Be = qe(Y), vt = qe(Y, a.draggable), re.eventCanceled) {
      this._nulling();
      return;
    }
    Rt = !1, nl = !1, Qt = !1, clearInterval(this._loopId), clearTimeout(this._dragStartTimer), Kl(this.cloneId), Kl(this._dragStartId), this.nativeDraggable && (me(document, "drop", this), me(t, "dragstart", this._onDragStart)), this._offMoveEvents(), this._offUpEvents(), Ht && se(document.body, "user-select", ""), se(Y, "transform", ""), l && (Kt && (l.cancelable && l.preventDefault(), !a.dropBubble && l.stopPropagation()), ue && ue.parentNode && ue.parentNode.removeChild(ue), ($e === Se || Ie && Ie.lastPutMode !== "clone") && xe && xe.parentNode && xe.parentNode.removeChild(xe), Y && (this.nativeDraggable && me(Y, "dragend", this), Nl(Y), Y.style["will-change"] = "", Kt && !Rt && ze(Y, Ie ? Ie.options.ghostClass : this.options.ghostClass, !1), ze(Y, this.options.chosenClass, !1), Oe({
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
    Me("nulling", this), $e = Y = Se = ue = Vt = xe = dl = mt = yt = Xe = Kt = Be = vt = Nt = Jt = Pt = Zt = Ie = il = re.dragged = re.ghost = re.clone = re.active = null;
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
        Y && (this._onDragOver(l), Vn(l));
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
      Y.parentNode == $e && !this.options.group.revertClone ? $e.insertBefore(xe, Y) : Vt ? $e.insertBefore(xe, Vt) : $e.appendChild(xe), this.options.group.revertClone && this.animate(Y, xe), se(xe, "display", ""), mt = !1;
    }
  }
};
function Vn(e) {
  e.dataTransfer && (e.dataTransfer.dropEffect = "move"), e.cancelable && e.preventDefault();
}
function rl(e, l, t, a, o, s, v, p) {
  var f, i = e[Fe], n = i.options.onMove, c;
  return window.CustomEvent && !st && !el ? f = new CustomEvent("move", {
    bubbles: !0,
    cancelable: !0
  }) : (f = document.createEvent("Event"), f.initEvent("move", !0, !0)), f.to = l, f.from = e, f.dragged = t, f.draggedRect = a, f.related = o || l, f.relatedRect = s || De(l), f.willInsertAfter = p, f.originalEvent = v, e.dispatchEvent(f), n && (c = n.call(i, f, v)), c;
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
function Sn(e, l, t, a, o, s, v, p) {
  var f = a ? e.clientY : e.clientX, i = a ? t.height : t.width, n = a ? t.top : t.left, c = a ? t.bottom : t.right, y = !1;
  if (!v) {
    if (p && ul < i * o) {
      if (!Qt && (Zt === 1 ? f > n + i * s / 2 : f < c - i * s / 2) && (Qt = !0), Qt)
        y = !0;
      else if (Zt === 1 ? f < n + ul : f > c - ul)
        return -Zt;
    } else if (f > n + i * (1 - o) / 2 && f < c - i * (1 - o) / 2)
      return Tn(l);
  }
  return y = y || v, y && (f < n + i * s / 2 || f > c - i * s / 2) ? f > n + i / 2 ? 1 : -1 : 0;
}
function Tn(e) {
  return qe(Y) < qe(e) ? 1 : -1;
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
      var o = this, s = (t.touches ? t.touches[0] : t).clientX, v = (t.touches ? t.touches[0] : t).clientY, p = document.elementFromPoint(s, v);
      if (yl = t, a || this.options.forceAutoScrollFallback || el || st || Ht) {
        Ll(t, this.options, p, a);
        var f = ft(p, !0);
        Yl && (!Yt || s !== Ml || v !== Fl) && (Yt && Ca(), Yt = setInterval(function() {
          var i = ft(document.elementFromPoint(s, v), !0);
          i !== f && (f = i, vl()), Ll(t, o.options, i, a);
        }, 10), Ml = s, Fl = v);
      } else {
        if (!this.options.bubbleScroll || ft(p, !0) === et()) {
          vl();
          return;
        }
        Ll(t, this.options, ft(p, !1), !1);
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
    var o = (e.touches ? e.touches[0] : e).clientX, s = (e.touches ? e.touches[0] : e).clientY, v = l.scrollSensitivity, p = l.scrollSpeed, f = et(), i = !1, n;
    Gl !== t && (Gl = t, vl(), Gt = l.scroll, n = l.scrollFn, Gt === !0 && (Gt = ft(t, !0)));
    var c = 0, y = Gt;
    do {
      var m = y, w = De(m), C = w.top, D = w.bottom, P = w.left, z = w.right, O = w.width, T = w.height, $ = void 0, V = void 0, S = m.scrollWidth, oe = m.scrollHeight, M = se(m), q = m.scrollLeft, A = m.scrollTop;
      m === f ? ($ = O < S && (M.overflowX === "auto" || M.overflowX === "scroll" || M.overflowX === "visible"), V = T < oe && (M.overflowY === "auto" || M.overflowY === "scroll" || M.overflowY === "visible")) : ($ = O < S && (M.overflowX === "auto" || M.overflowX === "scroll"), V = T < oe && (M.overflowY === "auto" || M.overflowY === "scroll"));
      var ie = $ && (Math.abs(z - o) <= v && q + O < S) - (Math.abs(P - o) <= v && !!q), I = V && (Math.abs(D - s) <= v && A + T < oe) - (Math.abs(C - s) <= v && !!A);
      if (!Ue[c])
        for (var ne = 0; ne <= c; ne++)
          Ue[ne] || (Ue[ne] = {});
      (Ue[c].vx != ie || Ue[c].vy != I || Ue[c].el !== m) && (Ue[c].el = m, Ue[c].vx = ie, Ue[c].vy = I, clearInterval(Ue[c].pid), (ie != 0 || I != 0) && (i = !0, Ue[c].pid = setInterval(function() {
        a && this.layer === 0 && re.active._onTouchMove(yl);
        var K = Ue[this.layer].vy ? Ue[this.layer].vy * p : 0, F = Ue[this.layer].vx ? Ue[this.layer].vx * p : 0;
        typeof n == "function" && n.call(re.dragged.parentNode[Fe], F, K, e, yl, Ue[this.layer].el) !== "continue" || Ja(Ue[this.layer].el, F, K);
      }.bind({
        layer: c
      }), 24))), c++;
    } while (l.bubbleScroll && y !== f && (y = ft(y, !1)));
    Yl = i;
  }
}, 30), oo = function(l) {
  var t = l.originalEvent, a = l.putSortable, o = l.dragEl, s = l.activeSortable, v = l.dispatchSortableEvent, p = l.hideGhostForTarget, f = l.unhideGhostForTarget;
  if (t) {
    var i = a || s;
    p();
    var n = t.changedTouches && t.changedTouches.length ? t.changedTouches[0] : t, c = document.elementFromPoint(n.clientX, n.clientY);
    f(), i && !i.el.contains(c) && (v("spill"), this.onSpill({
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
          const v = s.oldDraggableIndex, p = s.newDraggableIndex;
          In(s, ".work-reorder-entry"), v !== void 0 && p !== void 0 && v !== p && e(v, p);
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
    const t = e, a = l, o = "options:" + Xl(), s = H(() => t.field.options ?? []), v = H(() => s.value.every((c, y) => !!c.id && s.value.findIndex((m) => m.id === c.id) === y));
    Ce(v, (c) => a("validity", c, o), { immediate: !0 }), nt(() => a("validity", !0, o));
    function p(c, y) {
      Fa(s.value, c, y - c), s.value.forEach((m, w) => m.order = w);
    }
    const f = io(p), i = ["primary", "success", "info", "warn", "danger", "secondary"];
    function n() {
      let c = s.value.length + 1;
      for (; s.value.some((y) => y.id === `option_${c}`); ) c++;
      (t.field.options ??= []).push({ id: `option_${c}`, label: "New option", order: s.value.length });
    }
    return (c, y) => (u(), g("section", An, [
      y[4] || (y[4] = d("header", { class: "work-row" }, [
        d("h4", null, "Options"),
        d("span", { class: "work-muted work-small" }, "Stable IDs keep existing values when labels change."),
        d("span", { class: "work-spacer" })
      ], -1)),
      Qe((u(), g("div", Pn, [
        (u(!0), g(Z, null, le(s.value, (m, w) => (u(), g("div", {
          key: w,
          class: "work-option-row work-reorder-entry"
        }, [
          b(r(X), {
            type: "button",
            class: "work-icon-button work-reorder-handle",
            "aria-label": "Drag option; arrow keys reorder",
            onKeydown: [
              Ae(he((C) => p(w, w - 1), ["prevent"]), ["up"]),
              Ae(he((C) => p(w, w + 1), ["prevent"]), ["down"])
            ],
            severity: "secondary",
            text: "",
            size: "small"
          }, {
            default: N(() => [
              b(r(_), {
                icon: "tabler:grip-vertical",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["onKeydown"]),
          d("label", Rn, [
            y[0] || (y[0] = R("Label", -1)),
            b(r(ce), {
              modelValue: m.label,
              "onUpdate:modelValue": (C) => m.label = C,
              "aria-label": "Option label"
            }, null, 8, ["modelValue", "onUpdate:modelValue"])
          ]),
          d("label", On, [
            y[1] || (y[1] = R("ID", -1)),
            b(r(ce), {
              modelValue: m.id,
              "onUpdate:modelValue": (C) => m.id = C,
              class: "work-option-code",
              required: "",
              "aria-label": "Option ID"
            }, null, 8, ["modelValue", "onUpdate:modelValue"])
          ]),
          d("div", Nn, [
            d("label", Mn, [
              y[2] || (y[2] = R("Color", -1)),
              d("span", Fn, [
                d("span", {
                  class: pt(["work-color-swatch", "work-swatch-" + (m.color || "secondary")]),
                  "aria-hidden": "true"
                }, null, 2),
                b(r(ae), {
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
            d("label", Ln, [
              y[3] || (y[3] = R("Category", -1)),
              b(r(ae), {
                "model-value": m.category,
                "aria-label": "Option category",
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                showClear: "",
                options: ["triage", "backlog", ...r(Ma)].map((C) => ({ label: r(Zl)(C), value: C })),
                "onUpdate:modelValue": (C) => m.category = C || void 0
              }, null, 8, ["model-value", "options", "onUpdate:modelValue"])
            ])
          ]),
          d("div", zn, [
            b(r(X), {
              "aria-label": "Option earlier",
              severity: "secondary",
              size: "small",
              disabled: w === 0,
              onClick: (C) => p(w, w - 1),
              text: ""
            }, {
              default: N(() => [
                b(r(_), {
                  icon: "tabler:arrow-up",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["disabled", "onClick"]),
            b(r(X), {
              "aria-label": "Option later",
              severity: "secondary",
              size: "small",
              disabled: w === s.value.length - 1,
              onClick: (C) => p(w, w + 1),
              text: ""
            }, {
              default: N(() => [
                b(r(_), {
                  icon: "tabler:arrow-down",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["disabled", "onClick"]),
            b(r(X), {
              label: "Remove",
              "aria-label": "Remove option",
              severity: "secondary",
              text: "",
              size: "small",
              onClick: (C) => s.value.splice(w, 1)
            }, {
              icon: N(() => [
                b(r(_), {
                  icon: "tabler:trash",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["onClick"])
          ])
        ]))), 128)),
        v.value ? E("", !0) : (u(), g("p", Bn, "Option IDs must be nonempty and unique.")),
        d("div", jn, [
          b(r(X), {
            label: "Add option",
            severity: "secondary",
            size: "small",
            onClick: n,
            outlined: ""
          }, {
            icon: N(() => [
              b(r(_), {
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
      s.value.length ? E("", !0) : (u(), g("p", qn, "Add the choices people can select for this field."))
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
        const p = Ke(s.items);
        o.some((f) => typeof f != "string" || typeof p.minLength == "number" && f.length < p.minLength || typeof p.maxLength == "number" && f.length > p.maxLength) && (v = "Each entry must match the declared text length.");
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
    const t = e, a = l, o = B({}), s = B(/* @__PURE__ */ new Set()), v = B(!1), p = B(!1), f = H(() => ia(t.schema)), i = H(() => Kn(t.schema, t.modelValue)), n = H(() => f.value.filter((T) => typeof T.schema.picker == "string")), c = H(() => f.value.filter((T) => typeof T.schema.picker != "string")), y = H(() => ({ ...t.schema, properties: Object.fromEntries(n.value.map((T) => [T.key, { ...T.schema, title: T.title }])), required: Array.isArray(t.schema.required) ? t.schema.required.filter((T) => n.value.some(($) => $.key === T)) : [] })), m = H(() => Object.fromEntries(n.value.map((T) => [T.key, t.modelValue[T.key]])));
    Ce([i, s, () => n.value.length > 0 && !v.value], () => a("validity", !Object.keys(i.value).length && !s.value.size && (!n.value.length || v.value)), { immediate: !0, deep: !0 });
    async function w() {
      p.value = !0, v.value = await lt("wc-schema-form"), p.value = !1;
    }
    Ce(() => n.value.length > 0, (T) => {
      T && w();
    }, { immediate: !0 }), nt(() => a("validity", !0));
    function C(T, $) {
      const V = { ...t.modelValue };
      $ == null ? delete V[T] : V[T] = $, a("update:modelValue", V);
    }
    function D(T) {
      const $ = t.modelValue[T];
      return Array.isArray($) ? $.filter((V) => typeof V == "string") : [];
    }
    function P(T) {
      const $ = o.value[T]?.trim();
      $ && (C(T, [...D(T), $]), o.value[T] = "");
    }
    function z(T, $) {
      $ ? s.value.delete(T) : s.value.add(T);
    }
    function O(T) {
      a("update:modelValue", { ...t.modelValue, ...Ke(T.detail) });
    }
    return (T, $) => (u(), g("div", Gn, [
      n.value.length && v.value ? (u(), g("wc-schema-form", {
        key: 0,
        class: "work-config-widget",
        schema: JSON.stringify(y.value),
        config: JSON.stringify(m.value),
        onConfigChanged: O
      }, null, 40, Yn)) : n.value.length && p.value ? (u(), g("p", Hn, "The configuration widget is loading.")) : n.value.length ? (u(), g("p", Xn, [
        $[0] || ($[0] = R("The configuration widget is unavailable.", -1)),
        b(r(X), {
          label: "Reload configuration widget",
          severity: "secondary",
          outlined: "",
          onClick: w
        })
      ])) : E("", !0),
      d("div", Jn, [
        (u(!0), g(Z, null, le(c.value, (V) => (u(), g("div", {
          key: V.key,
          class: "work-config-field"
        }, [
          d("label", {
            class: "work-config-label",
            for: "config-" + V.key
          }, U(V.title), 9, Zn),
          Array.isArray(V.schema.enum) ? (u(), j(r(ae), {
            key: 0,
            "input-id": "config-" + V.key,
            "model-value": e.modelValue[V.key] ?? V.schema.default,
            options: V.schema.enum,
            appendTo: "self",
            "aria-label": V.title,
            disabled: e.disabled,
            "onUpdate:modelValue": (S) => C(V.key, S)
          }, null, 8, ["input-id", "model-value", "options", "aria-label", "disabled", "onUpdate:modelValue"])) : r(no)(V.schema) ? (u(), g("div", Qn, [
            (u(!0), g(Z, null, le(D(V.key), (S, oe) => (u(), j(r(zo), {
              key: oe,
              label: S,
              removable: !e.disabled,
              onRemove: (M) => C(V.key, D(V.key).filter((q, A) => A !== oe))
            }, null, 8, ["label", "removable", "onRemove"]))), 128)),
            b(r(ce), {
              id: "config-" + V.key,
              modelValue: o.value[V.key],
              "onUpdate:modelValue": (S) => o.value[V.key] = S,
              "aria-label": "Add " + V.title.toLocaleLowerCase(),
              disabled: e.disabled,
              placeholder: "Type and press Enter",
              onKeydown: Ae(he((S) => P(V.key), ["stop", "prevent"]), ["enter"]),
              onBlur: (S) => P(V.key)
            }, null, 8, ["id", "modelValue", "onUpdate:modelValue", "aria-label", "disabled", "onKeydown", "onBlur"])
          ])) : ["integer", "number"].includes(String(V.schema.type)) ? (u(), j(r(Ge), {
            key: 2,
            "input-id": "config-" + V.key,
            "model-value": e.modelValue[V.key] ?? V.schema.default,
            "max-fraction-digits": V.schema.type === "integer" ? 0 : 8,
            "use-grouping": !1,
            "aria-label": V.title,
            disabled: e.disabled,
            invalid: !!i.value[V.key],
            "onUpdate:modelValue": (S) => C(V.key, S)
          }, null, 8, ["input-id", "model-value", "max-fraction-digits", "aria-label", "disabled", "invalid", "onUpdate:modelValue"])) : V.schema.type === "boolean" ? (u(), j(r(Le), {
            key: 3,
            "input-id": "config-" + V.key,
            "model-value": !!(e.modelValue[V.key] ?? V.schema.default),
            "aria-label": V.title,
            disabled: e.disabled,
            "onUpdate:modelValue": (S) => C(V.key, S)
          }, null, 8, ["input-id", "model-value", "aria-label", "disabled", "onUpdate:modelValue"])) : ["array", "object"].includes(String(V.schema.type)) ? (u(), j(ot, {
            key: 4,
            label: V.title,
            "model-value": e.modelValue[V.key],
            shape: V.schema.type === "array" ? "array" : "object",
            example: V.schema.default ?? (V.schema.type === "array" ? [] : {}),
            "onUpdate:modelValue": (S) => C(V.key, S),
            onValidity: (S) => z(V.key, S)
          }, null, 8, ["label", "model-value", "shape", "example", "onUpdate:modelValue", "onValidity"])) : (u(), j(r(ce), {
            key: 5,
            id: "config-" + V.key,
            "model-value": e.modelValue[V.key] ?? V.schema.default ?? "",
            disabled: e.disabled,
            invalid: !!i.value[V.key],
            "aria-label": V.title,
            "onUpdate:modelValue": (S) => C(V.key, S)
          }, null, 8, ["id", "model-value", "disabled", "invalid", "aria-label", "onUpdate:modelValue"])),
          V.description ? (u(), g("p", _n, U(V.description), 1)) : E("", !0),
          i.value[V.key] ? (u(), g("p", es, U(i.value[V.key]), 1)) : E("", !0)
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
  key: 2,
  class: "work-stack work-tight"
}, ys = {
  key: 3,
  class: "work-stack work-tight"
}, gs = { class: "work-stack work-tight" }, ks = { class: "work-stack work-tight" }, ws = { class: "work-stack work-tight" }, Vs = { class: "work-stack work-tight" }, $s = { class: "work-stack" }, xs = {
  key: 0,
  class: "work-stack work-tight"
}, Cs = { class: "work-row work-add-definition" }, Ss = { class: "work-stack work-tight" }, Ts = /* @__PURE__ */ ve({
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
    const t = e, a = l, o = H(() => t.draft.fields ?? []), s = B(""), v = B(""), p = B({}), f = io(($, V) => z($, V - $));
    function i($) {
      return (t.draft.item_types ?? []).filter((V) => V.fields.includes($)).map((V) => V.title || Ve(V.id));
    }
    async function n($) {
      if (!v.value) {
        v.value = $.code;
        try {
          const V = await t.guardRemoval?.("fields", $.code);
          p.value[$.code] = V ?? "", V || _t(t.draft, "fields", $.code);
        } finally {
          v.value = "";
        }
      }
    }
    const c = Object.entries({ text: "Text", int: "Whole number", dec: "Decimal number", quantity: "Measurement", bool: "Yes or no", time: "Date or time", ref: "Reference", record: "Structured data", option: "Choice", principal: "Person or group", item: "Work item", rank: "Order", rich_text: "Formatted text", formula: "Formula", rollup: "Related item calculation", counter: "Counter" }).map(([$, V]) => ({ value: $, label: V }));
    function y($) {
      return $.type && $.type !== "value" ? $.type : $.form ?? "text";
    }
    const m = H(() => new Map(t.installedTypes?.map(($) => [$.id, $])));
    function w($) {
      const V = m.value.get(y($))?.config_schema;
      return V && ia(V).length ? V : void 0;
    }
    function C($) {
      const V = m.value.get(y($)), S = V?.form ?? $.form;
      return !!V?.config_schema || ["dec", "quantity", "ref", "time", "record"].includes(S ?? "") || !!$.config;
    }
    function D($, V) {
      $.type = V, delete $.form;
    }
    function P($, V) {
      const S = { option: "text", principal: "ref", item: "ref", rank: "text", rich_text: "text", formula: "int", rollup: "int", counter: "int" };
      S[V] ? ($.type = V, $.form = S[V]) : (delete $.type, $.form = V), V !== "option" ? delete $.options : $.options ??= [], V === "rich_text" && ($.config = { format: "json" });
    }
    function z($, V) {
      Fa(o.value, $, V);
      for (const S of t.draft.item_types ?? []) {
        const oe = new Set(S.fields);
        S.fields = o.value.filter((M) => oe.has(M.code)).map((M) => M.code);
      }
    }
    function O($, V) {
      try {
        xo(t.draft, $, V.value), delete p.value[$.code];
      } catch (S) {
        p.value[$.code] = S.message, V.value = $.code;
      }
    }
    function T() {
      !/^[a-z][a-z0-9_]*$/.test(s.value) || o.value.some(($) => $.code === s.value) || ((t.draft.fields ??= []).push({ code: s.value, form: "text", cardinality: "one" }), s.value = "");
    }
    return ($, V) => (u(), g("section", ts, [
      d("header", ls, [
        V[2] || (V[2] = d("div", null, [
          d("h2", null, "Fields"),
          d("p", { class: "work-muted work-small" }, "Shape the information each item carries. Drag the handle or use the arrows to arrange fields.")
        ], -1)),
        b(r(Re), {
          class: "kx-tag-sm",
          severity: "secondary"
        }, {
          default: N(() => [
            R(U(o.value.length) + " " + U(o.value.length === 1 ? "field" : "fields"), 1)
          ]),
          _: 1
        })
      ]),
      Qe((u(), j($l, {
        columns: "fields",
        count: o.value.length
      }, {
        default: N(() => [
          (u(!0), g(Z, null, le(o.value, (S, oe) => (u(), j(Vl, {
            title: r(_e)(S),
            code: S.code,
            kind: m.value.get(y(S))?.title || r(c).find((M) => M.value === y(S))?.label || r(Ve)(y(S)),
            key: S.id ?? oe,
            class: "work-field-row work-reorder-entry work-stack"
          }, {
            handle: N(() => [
              b(r(X), {
                type: "button",
                class: "work-reorder-handle work-icon-button",
                "aria-label": "Drag " + r(_e)(S) + " or use the arrow keys to reorder",
                onKeydown: [
                  Ae(he((M) => z(oe, -1), ["prevent"]), ["up"]),
                  Ae(he((M) => z(oe, 1), ["prevent"]), ["down"])
                ],
                severity: "secondary",
                text: "",
                size: "small"
              }, {
                default: N(() => [
                  b(r(_), {
                    icon: "tabler:grip-vertical",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["aria-label", "onKeydown"])
            ]),
            flags: N(() => [
              S.track ? (u(), j(r(Re), {
                key: 0,
                class: "kx-tag-sm",
                severity: "secondary",
                value: "Tracked"
              })) : E("", !0),
              S.intervals ? (u(), j(r(Re), {
                key: 1,
                class: "kx-tag-sm",
                severity: "secondary",
                value: "Intervals"
              })) : E("", !0)
            ]),
            usage: N(() => [
              i(S.code).length ? (u(), g("details", as, [
                d("summary", os, "Used by " + U(i(S.code).length) + " " + U(i(S.code).length === 1 ? "type" : "types"), 1),
                d("span", is, U(i(S.code).join(", ")), 1)
              ])) : E("", !0)
            ]),
            actions: N(() => [
              b(r(X), {
                "aria-label": "Move " + r(_e)(S) + " earlier",
                severity: "secondary",
                disabled: oe === 0,
                onClick: (M) => z(oe, -1),
                text: "",
                size: "small"
              }, {
                default: N(() => [
                  b(r(_), {
                    icon: "tabler:arrow-up",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["aria-label", "disabled", "onClick"]),
              b(r(X), {
                "aria-label": "Move " + r(_e)(S) + " later",
                severity: "secondary",
                disabled: oe === o.value.length - 1,
                onClick: (M) => z(oe, 1),
                text: "",
                size: "small"
              }, {
                default: N(() => [
                  b(r(_), {
                    icon: "tabler:arrow-down",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["aria-label", "disabled", "onClick"]),
              b(r(X), {
                severity: "secondary",
                text: "",
                size: "small",
                disabled: !!v.value,
                onClick: (M) => n(S),
                "aria-label": "Remove field"
              }, {
                default: N(() => [
                  b(r(_), {
                    icon: "tabler:trash",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["disabled", "onClick"])
            ]),
            default: N(() => [
              p.value[S.code] ? (u(), g("p", ns, U(p.value[S.code]), 1)) : E("", !0),
              (u(!0), g(Z, null, le(e.issues?.filter((M) => M.code === S.code) ?? [], (M) => (u(), g("p", {
                key: M.what,
                class: "work-error work-small",
                role: "alert"
              }, U(r(wl)(M)) + " · " + U(M.what), 1))), 128)),
              d("div", ss, [
                d("label", rs, [
                  V[3] || (V[3] = R("Title", -1)),
                  b(r(ce), {
                    modelValue: S.title,
                    "onUpdate:modelValue": (M) => S.title = M,
                    "aria-label": "Field title",
                    maxlength: "255",
                    placeholder: r(_e)(S)
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder"])
                ]),
                d("label", ds, [
                  V[4] || (V[4] = R("Field identifier", -1)),
                  b(r(ce), {
                    value: S.code,
                    "aria-label": "Field code",
                    required: "",
                    pattern: "[a-z][a-z0-9_]*",
                    onInput: (M) => O(S, M.target)
                  }, null, 8, ["value", "onInput"])
                ]),
                d("label", us, [
                  V[5] || (V[5] = R("Kind", -1)),
                  b(r(ae), {
                    "aria-label": "Kind",
                    "model-value": y(S),
                    "onUpdate:modelValue": (M) => P(S, M),
                    appendTo: "self",
                    options: r(c),
                    optionLabel: "label",
                    optionValue: "value"
                  }, null, 8, ["model-value", "onUpdate:modelValue", "options"])
                ]),
                d("label", cs, [
                  V[6] || (V[6] = R("Values allowed", -1)),
                  b(r(ae), {
                    "aria-label": "Values allowed",
                    "model-value": S.cardinality ?? "one",
                    "onUpdate:modelValue": (M) => S.cardinality = M,
                    appendTo: "self",
                    options: [{ label: "One value", value: "one" }, { label: "Multiple unique values", value: "set" }, { label: "Ordered values", value: "list" }],
                    optionLabel: "label",
                    optionValue: "value"
                  }, null, 8, ["model-value", "onUpdate:modelValue"])
                ]),
                d("label", vs, [
                  V[7] || (V[7] = R("Search support", -1)),
                  b(r(ae), {
                    "aria-label": "Search support",
                    "model-value": S.index ?? "none",
                    "onUpdate:modelValue": (M) => S.index = M,
                    appendTo: "self",
                    options: [{ label: "None", value: "none" }, { label: "Exact matches", value: "key" }, { label: "Numeric ranges", value: "number" }],
                    optionLabel: "label",
                    optionValue: "value"
                  }, null, 8, ["model-value", "onUpdate:modelValue"])
                ])
              ]),
              d("section", ms, [
                V[10] || (V[10] = d("h4", { class: "work-group-title" }, "History", -1)),
                d("div", fs, [
                  d("div", ps, [
                    V[8] || (V[8] = d("div", { class: "work-row-main" }, [
                      d("strong", null, "Track changes"),
                      d("p", { class: "work-muted work-small" }, "Record each value change in the item history.")
                    ], -1)),
                    b(r(Le), {
                      modelValue: S.track,
                      "onUpdate:modelValue": (M) => S.track = M,
                      "aria-label": "Track changes"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ]),
                  d("div", bs, [
                    V[9] || (V[9] = d("div", { class: "work-row-main" }, [
                      d("strong", null, "Track intervals"),
                      d("p", { class: "work-muted work-small" }, "Measure how long each value stays in effect.")
                    ], -1)),
                    b(r(Le), {
                      modelValue: S.intervals,
                      "onUpdate:modelValue": (M) => S.intervals = M,
                      "aria-label": "Track intervals"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ])
                ])
              ]),
              S.type === "option" ? (u(), j(Wn, {
                key: 1,
                field: S,
                onValidity: V[0] || (V[0] = (M, q) => a("validity", q, M))
              }, null, 8, ["field"])) : E("", !0),
              S.type === "formula" || S.type === "rollup" ? (u(), g("label", hs, [
                V[11] || (V[11] = R("Result type", -1)),
                b(r(ae), {
                  modelValue: S.form,
                  "onUpdate:modelValue": (M) => S.form = M,
                  "aria-label": "Result type",
                  options: r(c).slice(0, 8),
                  optionLabel: "label",
                  optionValue: "value",
                  appendTo: "self"
                }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
              ])) : E("", !0),
              S.type === "formula" ? (u(), g("label", ys, [
                V[12] || (V[12] = R("Expression", -1)),
                b(r(ce), {
                  modelValue: S.expression,
                  "onUpdate:modelValue": (M) => S.expression = M
                }, null, 8, ["modelValue", "onUpdate:modelValue"])
              ])) : E("", !0),
              S.type === "rollup" ? (u(), g(Z, { key: 4 }, [
                d("label", gs, [
                  V[13] || (V[13] = R("Of", -1)),
                  b(r(ce), {
                    modelValue: S.of,
                    "onUpdate:modelValue": (M) => S.of = M
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                d("label", ks, [
                  V[14] || (V[14] = R("Function", -1)),
                  b(r(ce), {
                    modelValue: S.fn,
                    "onUpdate:modelValue": (M) => S.fn = M
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                d("label", ws, [
                  V[15] || (V[15] = R("Field", -1)),
                  b(r(ce), {
                    modelValue: S.field,
                    "onUpdate:modelValue": (M) => S.field = M
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                d("label", Vs, [
                  V[16] || (V[16] = R("Order by", -1)),
                  b(r(ae), {
                    "model-value": S.by,
                    "aria-label": "Rollup order",
                    options: ["rank", "time"],
                    showClear: "",
                    appendTo: "self",
                    "onUpdate:modelValue": (M) => S.by = M || void 0
                  }, null, 8, ["model-value", "onUpdate:modelValue"])
                ]),
                b(_l, {
                  modelValue: S.where,
                  "onUpdate:modelValue": (M) => S.where = M,
                  draft: e.draft,
                  "board-id": e.boardId,
                  label: "Include related items when",
                  onValidity: (M) => a("validity", "rollup-" + oe, M)
                }, null, 8, ["modelValue", "onUpdate:modelValue", "draft", "board-id", "onValidity"])
              ], 64)) : E("", !0),
              w(S) ? (u(), j(na, {
                key: S.type,
                schema: w(S),
                "model-value": S.config ?? {},
                "onUpdate:modelValue": (M) => S.config = M,
                onValidity: (M) => a("validity", "config-" + oe, M)
              }, null, 8, ["schema", "model-value", "onUpdate:modelValue", "onValidity"])) : C(S) ? (u(), j(ot, {
                key: 6,
                label: "Field configuration",
                "model-value": S.config,
                shape: "object",
                "onUpdate:modelValue": (M) => S.config = M,
                onValidity: (M) => a("validity", "config-" + oe, M)
              }, null, 8, ["model-value", "onUpdate:modelValue", "onValidity"])) : E("", !0),
              d("section", $s, [
                V[18] || (V[18] = d("h4", { class: "work-group-title" }, "Access", -1)),
                e.installedTypes?.length ? (u(), g("label", xs, [
                  V[17] || (V[17] = R("Custom field type", -1)),
                  b(r(ae), {
                    "aria-label": "Custom field type",
                    "model-value": S.type,
                    options: e.installedTypes,
                    optionLabel: "title",
                    optionValue: "id",
                    appendTo: "self",
                    "onUpdate:modelValue": (M) => D(S, M)
                  }, null, 8, ["model-value", "options", "onUpdate:modelValue"])
                ])) : E("", !0),
                (u(), g(Z, null, le(["read", "write"], (M) => b(Wa, {
                  "board-id": e.boardId,
                  key: M,
                  label: M === "read" ? "Who can read" : "Who can edit",
                  "model-value": S.access?.[M],
                  "onUpdate:modelValue": (q) => S.access = { ...S.access, [M]: q },
                  onValidity: (q) => a("validity", "access-" + oe + M, q)
                }, null, 8, ["board-id", "label", "model-value", "onUpdate:modelValue", "onValidity"])), 64))
              ])
            ]),
            _: 2
          }, 1032, ["title", "code", "kind"]))), 128)),
          d("div", Cs, [
            d("label", Ss, [
              V[19] || (V[19] = R("New field identifier", -1)),
              b(r(ce), {
                modelValue: s.value,
                "onUpdate:modelValue": V[1] || (V[1] = (S) => s.value = S),
                onKeydown: Ae(he(T, ["prevent"]), ["enter"])
              }, null, 8, ["modelValue", "onKeydown"])
            ]),
            b(r(X), {
              label: "Add field",
              severity: "secondary",
              disabled: !s.value.trim(),
              onClick: T,
              outlined: ""
            }, {
              icon: N(() => [
                b(r(_), {
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
}), Es = ["disabled"], Us = { class: "work-chips" }, Ds = {
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
    const t = e, a = l, o = B(""), s = H(() => t.options.map((f) => typeof f == "string" ? { value: f } : f)), v = H(() => s.value.filter((f) => (f.label ?? Ve(f.value)).toLocaleLowerCase().includes(o.value.toLocaleLowerCase())));
    function p(f) {
      if (t.disabled) return;
      const i = t.modelValue ?? [];
      a("update:modelValue", i.includes(f) ? i.filter((n) => n !== f) : [...i, f]);
    }
    return (f, i) => (u(), g("fieldset", {
      class: "work-chip-picker",
      disabled: e.disabled
    }, [
      d("legend", null, U(e.label), 1),
      e.options.length > 10 ? (u(), j(r(ce), {
        key: 0,
        modelValue: o.value,
        "onUpdate:modelValue": i[0] || (i[0] = (n) => o.value = n),
        type: "search",
        "aria-label": "Find " + e.label.toLowerCase(),
        placeholder: "Find a choice…"
      }, null, 8, ["modelValue", "aria-label"])) : E("", !0),
      d("div", Us, [
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
        (u(!0), g(Z, null, le(e.modelValue?.filter((n) => !s.value.some((c) => c.value === n)) ?? [], (n) => (u(), j(r(X), {
          severity: "secondary",
          text: "",
          size: "small",
          key: n,
          type: "button",
          class: "work-choice work-unavailable",
          "aria-label": "Remove unavailable " + n,
          onClick: (c) => p(n)
        }, {
          default: N(() => [
            R(U(r(Ve)(n)) + " · unavailable ×", 1)
          ]),
          _: 2
        }, 1032, ["aria-label", "onClick"]))), 128))
      ]),
      e.options.length ? E("", !0) : (u(), g("span", Ds, "No choices declared."))
    ], 8, Es));
  }
}), Is = {
  class: "work-stack",
  "aria-label": "Item types editor"
}, As = { class: "work-section-heading" }, Ps = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, Rs = { class: "work-definition-meta" }, Os = { class: "work-settings-grid" }, Ns = { class: "work-stack work-tight" }, Ms = { class: "work-stack work-tight" }, Fs = { class: "work-stack work-tight" }, Ls = { class: "work-stack work-tight" }, zs = {
  key: 0,
  class: "work-stack work-tight work-small"
}, Bs = {
  key: 0,
  class: "kx-empty"
}, js = { class: "work-row work-add-definition" }, qs = { class: "work-stack work-tight" }, Ws = {
  key: 0,
  class: "work-error work-small"
}, Ks = /* @__PURE__ */ ve({
  __name: "TypesEditor",
  props: {
    draft: {},
    guardRemoval: { type: Function },
    issues: {}
  },
  setup(e) {
    const l = e, t = H(() => l.draft.item_types ?? []), a = B(""), o = B(""), s = B(""), v = H(() => /^[a-z][a-z0-9_]*$/.test(a.value) && !t.value.some((y) => y.id === a.value));
    function p() {
      v.value && ((l.draft.item_types ??= []).push({ id: a.value, title: Ve(a.value), process: l.draft.processes?.[0]?.id ?? "", fields: [] }), a.value = "");
    }
    function f(y, m) {
      const w = y.id;
      y.id = m;
      for (const C of t.value) C.parent_types && (C.parent_types = C.parent_types.map((D) => D === w ? m : D));
    }
    function i(y, m) {
      y.fields = m, y.inherit && (y.inherit = y.inherit.filter((w) => m.includes(w)));
    }
    function n(y) {
      return t.value.filter((m) => m.id !== y.id && m.parent_types?.includes(y.id)).map((m) => m.title || Ve(m.id));
    }
    async function c(y) {
      if (!s.value) {
        if (n(y).length) {
          o.value = `${y.title || Ve(y.id)} is a parent type for ${n(y).join(", ")}. Remove those parent selections first.`;
          return;
        }
        s.value = y.id, o.value = "";
        try {
          const m = await l.guardRemoval?.("item_types", y.id);
          m ? o.value = m : _t(l.draft, "item_types", y.id);
        } finally {
          s.value = "";
        }
      }
    }
    return (y, m) => (u(), g("section", Is, [
      d("header", As, [
        m[1] || (m[1] = d("div", null, [
          d("h2", null, "Item types"),
          d("p", { class: "work-muted work-small" }, "Choose the fields, parent relationships and process for each kind of work.")
        ], -1)),
        b(r(Re), {
          class: "kx-tag-sm",
          severity: "secondary"
        }, {
          default: N(() => [
            R(U(t.value.length) + " " + U(t.value.length === 1 ? "type" : "types"), 1)
          ]),
          _: 1
        })
      ]),
      o.value ? (u(), g("p", Ps, U(o.value), 1)) : E("", !0),
      b($l, {
        columns: "types",
        count: t.value.length
      }, {
        default: N(() => [
          (u(!0), g(Z, null, le(t.value, (w, C) => (u(), j(Vl, {
            title: w.title || r(Ve)(w.id),
            code: w.id,
            kind: e.draft.processes?.find((D) => D.id === w.process)?.name || r(Ve)(w.process),
            key: C,
            class: "work-type-card"
          }, {
            usage: N(() => [
              d("span", Rs, [
                b(r(Re), {
                  class: "kx-tag-sm",
                  severity: "secondary"
                }, {
                  default: N(() => [
                    R(U(w.fields.length) + " " + U(w.fields.length === 1 ? "field" : "fields"), 1)
                  ]),
                  _: 2
                }, 1024),
                n(w).length ? (u(), j(r(Re), {
                  key: 0,
                  class: "kx-tag-sm",
                  severity: "secondary"
                }, {
                  default: N(() => [
                    R("Parent of " + U(n(w).join(", ")), 1)
                  ]),
                  _: 2
                }, 1024)) : E("", !0)
              ])
            ]),
            actions: N(() => [
              b(r(X), {
                severity: "secondary",
                text: "",
                size: "small",
                disabled: !!s.value,
                onClick: (D) => c(w),
                "aria-label": "Remove type"
              }, {
                default: N(() => [
                  b(r(_), {
                    icon: "tabler:trash",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["disabled", "onClick"])
            ]),
            default: N(() => [
              (u(!0), g(Z, null, le(e.issues?.filter((D) => D.code === "item_type " + w.id) ?? [], (D) => (u(), g("p", {
                key: D.what,
                class: "work-error work-small",
                role: "alert"
              }, U(r(wl)(D)), 1))), 128)),
              d("div", Os, [
                d("label", Ns, [
                  m[2] || (m[2] = R("Identifier", -1)),
                  b(r(ce), {
                    value: w.id,
                    onChange: (D) => f(w, D.target.value),
                    required: "",
                    pattern: "[a-z][a-z0-9_]*"
                  }, null, 8, ["value", "onChange"])
                ]),
                d("label", Ms, [
                  m[3] || (m[3] = R("Title", -1)),
                  b(r(ce), {
                    modelValue: w.title,
                    "onUpdate:modelValue": (D) => w.title = D,
                    placeholder: r(Ve)(w.id)
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder"])
                ]),
                d("label", Fs, [
                  m[4] || (m[4] = R("Process", -1)),
                  b(r(ae), {
                    modelValue: w.process,
                    "onUpdate:modelValue": (D) => w.process = D,
                    required: "",
                    appendTo: "self",
                    optionLabel: "label",
                    optionValue: "value",
                    optionDisabled: "disabled",
                    options: [...(e.draft.processes ?? []).map((D) => ({ label: D.name || r(Ve)(D.id), value: D.id, disabled: !1 }))]
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                ])
              ]),
              b(Lt, {
                label: "Fields",
                options: (e.draft.fields ?? []).map((D) => ({ value: D.code, label: r(_e)(D) })),
                "model-value": w.fields,
                "onUpdate:modelValue": (D) => i(w, D)
              }, null, 8, ["options", "model-value", "onUpdate:modelValue"]),
              b(Lt, {
                label: "Parent types",
                options: t.value.map((D) => ({ value: D.id, label: D.title || r(Ve)(D.id) })),
                modelValue: w.parent_types,
                "onUpdate:modelValue": (D) => w.parent_types = D
              }, null, 8, ["options", "modelValue", "onUpdate:modelValue"]),
              d("div", Ls, [
                b(Lt, {
                  label: "Inherit from parent",
                  options: w.fields.map((D) => ({ value: D, label: r(_e)(e.draft.fields?.find((P) => P.code === D) ?? { code: D }) })),
                  modelValue: w.inherit,
                  "onUpdate:modelValue": (D) => w.inherit = D
                }, null, 8, ["options", "modelValue", "onUpdate:modelValue"]),
                m[5] || (m[5] = d("p", { class: "work-muted work-small" }, "These fields resolve from the parent when this item has no own value.", -1))
              ]),
              w.parent_types?.length ? (u(), g("label", zs, [
                m[6] || (m[6] = R("When the parent moves", -1)),
                b(r(ae), {
                  modelValue: w.move_children,
                  "onUpdate:modelValue": (D) => w.move_children = D,
                  appendTo: "self",
                  optionLabel: "label",
                  optionValue: "value",
                  optionDisabled: "disabled",
                  options: [{ label: "Default", value: void 0, disabled: !1 }, { label: "Move children", value: "move", disabled: !1 }, { label: "Refuse while children exist", value: "refuse", disabled: !1 }]
                }, null, 8, ["modelValue", "onUpdate:modelValue"])
              ])) : E("", !0)
            ]),
            _: 2
          }, 1032, ["title", "code", "kind"]))), 128)),
          t.value.length ? E("", !0) : (u(), g("p", Bs, "Add an item type to connect fields to a process.")),
          d("div", js, [
            d("label", qs, [
              m[7] || (m[7] = R("New type identifier", -1)),
              b(r(ce), {
                modelValue: a.value,
                "onUpdate:modelValue": m[0] || (m[0] = (w) => a.value = w),
                placeholder: "new_type",
                onKeydown: Ae(he(p, ["prevent"]), ["enter"])
              }, null, 8, ["modelValue", "onKeydown"])
            ]),
            b(r(X), {
              label: "Add type",
              severity: "secondary",
              disabled: !v.value,
              onClick: p,
              outlined: ""
            }, {
              icon: N(() => [
                b(r(_), {
                  icon: "tabler:plus",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["disabled"]),
            a.value && !v.value ? (u(), g("span", Ws, "Use a unique lowercase identifier with letters, numbers and underscores.")) : E("", !0)
          ])
        ]),
        _: 1
      }, 8, ["count"])
    ]));
  }
}), Gs = ".work-process-canvas>svg{height:480px;width:100%}.work-process-canvas:focus-visible{outline:var(--p-focus-ring-width) var(--p-focus-ring-style) var(--p-focus-ring-color);outline-offset:var(--p-focus-ring-offset)}.work-state-card{fill:var(--p-content-background);stroke:var(--p-content-border-color);stroke-width:1.5}.work-graph-node.work-selected .work-state-card{stroke:var(--p-primary-color);stroke-width:2.5;fill:color-mix(in srgb,var(--p-primary-color) 6%,var(--p-content-background))}.work-graph-node:focus-visible .work-state-card{stroke:var(--p-focus-ring-color);stroke-width:var(--p-focus-ring-width)}.work-process-canvas .work-edge-label{font-size:12px;fill:var(--p-text-color)}.work-process-canvas .work-edge-label-bg{fill:var(--p-content-background);stroke:var(--p-content-border-color);stroke-width:1}.work-edge-line{stroke:var(--p-primary-color);stroke-width:1.5}.work-edge-return .work-edge-line{stroke:var(--p-text-muted-color);stroke-dasharray:5 4}.work-graph-arrow{fill:context-stroke}.work-lane-line{fill:none;stroke:var(--p-text-muted-color);stroke-width:1.5;stroke-dasharray:2 4}.work-node-connector{fill:var(--p-content-background);stroke:var(--p-primary-color);stroke-width:1.5}.work-node-connector:hover,.work-node-connector:focus-visible{fill:var(--p-primary-color)}.work-process-legend{position:static;flex-wrap:wrap;padding:10px 16px;border-top:1px solid var(--p-content-border-color);background:var(--p-content-background)}@media(max-width:700px){.work-process-canvas>svg{height:420px}}.work-process-more{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:8px;padding:8px 16px;border-top:1px solid var(--p-content-border-color);background:var(--p-content-background);color:var(--p-text-muted-color);font-size:12px}.work-process-canvas .work-graph-edge.work-selected .work-edge-label-bg{fill:var(--p-primary-color);stroke:var(--p-primary-color)}.work-process-canvas .work-graph-edge.work-selected .work-edge-label{fill:var(--p-primary-contrast-color)}", Sa = /* @__PURE__ */ new WeakSet();
function Ys(e) {
  const l = e.getRootNode();
  if (l instanceof ShadowRoot && !Sa.has(l)) {
    const t = e.ownerDocument.createElement("style");
    t.textContent = Gs, l.append(t), Sa.add(l);
  }
}
const Hs = 0.8;
function Xs(e, l, t) {
  const a = Math.min(1, l.width / e.width, l.height / e.height);
  if (a >= Hs) return { zoom: a, pan: { x: (e.width - l.width / a) / 2, y: (e.height - l.height / a) / 2 } };
  const o = e.nodes.find((v) => v.state.id === t) ?? e.nodes[0], s = Math.min(1, l.width / ((o?.width ?? 190) + 64));
  return { zoom: s, pan: o ? { x: e.direction === "TB" ? o.x - l.width / s / 2 : o.x - o.width / 2 - 32, y: e.direction === "TB" ? o.y - o.height / 2 - 32 : o.y - l.height / s / 2 } : { x: 0, y: 0 } };
}
const Js = ["onKeydown"], Zs = {
  key: 0,
  class: "work-process-instruction",
  role: "status"
}, Qs = ["viewBox"], _s = ["id"], er = ["d", "marker-end"], tr = ["aria-label", "aria-pressed", "onFocus", "onClick", "onKeydown"], lr = ["d"], ar = ["d", "marker-end"], or = ["x", "y", "width", "height"], ir = ["x", "y"], nr = ["x", "dy"], sr = ["aria-label", "aria-pressed", "onClick", "onKeydown", "onFocus", "onPointerup"], rr = ["x", "y", "width", "height"], dr = ["cx", "cy"], ur = ["x", "y"], cr = ["x", "dy"], vr = ["x", "y"], mr = ["x", "dy"], fr = {
  key: 0,
  class: "work-limit-text"
}, pr = ["aria-label", "onClick", "onKeydown"], br = ["x", "y"], hr = ["x", "dy"], yr = ["cx", "cy", "aria-label", "onPointerdown", "onClick", "onKeydown"], gr = ["d"], kr = {
  key: 1,
  class: "work-process-more",
  role: "status"
}, wr = { class: "work-process-legend" }, Vr = /* @__PURE__ */ ve({
  __name: "ProcessGraph",
  props: {
    process: {},
    draft: {},
    selectedState: {},
    selectedTransition: {}
  },
  emits: ["state", "transition", "connect", "clear"],
  setup(e, { expose: l, emit: t }) {
    const a = e, o = t, s = Xl().replace(/:/g, "_"), v = B(""), p = B(), f = B(), i = B(900), n = B(!1), c = H(() => i.value < 700 ? 420 : 480), y = H(() => Go(a.process, a.draft, { width: i.value, height: c.value })), m = B(1), w = B({ x: 0, y: 0 }), C = B({ x: 0, y: 0 }), D = H(() => ({ width: i.value, height: n.value ? Math.max(c.value, y.value.height * Math.min(1, i.value / y.value.width)) : c.value })), P = H(() => y.value.nodes.filter((h) => h.x - h.width / 2 >= w.value.x && h.x + h.width / 2 <= w.value.x + D.value.width / m.value && h.y - h.height / 2 >= w.value.y && h.y + h.height / 2 <= w.value.y + D.value.height / m.value).length);
    function z() {
      n.value = !1;
      const h = Xs(y.value, D.value, a.process.initial);
      m.value = h.zoom, w.value = h.pan;
    }
    const O = H(() => `${w.value.x} ${w.value.y} ${D.value.width / m.value} ${D.value.height / m.value}`), T = H(() => y.value.nodes.find((h) => h.state.id === v.value));
    function $() {
      n.value = !0, m.value = Math.min(1, D.value.width / y.value.width), w.value = { x: (y.value.width - D.value.width / m.value) / 2, y: 0 };
    }
    function V(h) {
      const x = Math.max(0.02, Math.min(3, m.value * h)), k = 1 / m.value - 1 / x;
      w.value = { x: w.value.x + D.value.width * k / 2, y: w.value.y + D.value.height * k / 2 }, m.value = x;
    }
    function S(h) {
      const x = D.value.width / m.value, k = D.value.height / m.value;
      (h.x - h.width / 2 < w.value.x || h.x + h.width / 2 > w.value.x + x || h.y - h.height / 2 < w.value.y || h.y + h.height / 2 > w.value.y + k) && (w.value = { x: h.x - x / 2, y: h.y - k / 2 });
    }
    function oe() {
      const h = y.value.nodes.find((x) => x.state === a.selectedState) ?? y.value.edges.find((x) => x.transition === a.selectedTransition);
      h && S(h);
    }
    Ce([y, () => a.selectedState, () => a.selectedTransition], oe, { flush: "post" }), Ce(() => a.process.id, () => {
      v.value = "", ne.clear(), z();
    }, { flush: "post" });
    function M(h) {
      if (h.target !== p.value) return;
      (h.key === "+" || h.key === "=") && (h.preventDefault(), V(1.2)), h.key === "-" && (h.preventDefault(), V(1 / 1.2)), h.key === "0" && (h.preventDefault(), $());
      const x = 60 / m.value;
      h.key.startsWith("Arrow") && (h.preventDefault(), w.value = { x: w.value.x + (h.key === "ArrowRight" ? x : h.key === "ArrowLeft" ? -x : 0), y: w.value.y + (h.key === "ArrowDown" ? x : h.key === "ArrowUp" ? -x : 0) });
    }
    function q(h, x) {
      v.value && v.value !== h.id && o("connect", v.value, h.id, x.currentTarget), v.value = "";
    }
    function A(h, x) {
      v.value = x.state.id, C.value = { x: x.x, y: x.y };
      const k = h.target;
      k instanceof Element && k.hasPointerCapture?.(h.pointerId) && k.releasePointerCapture(h.pointerId);
    }
    function ie(h, x) {
      if ((h.key === "Enter" || h.key === " ") && (h.preventDefault(), v.value ? q(x, h) : o("state", x, h.currentTarget)), ["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp"].includes(h.key)) {
        h.preventDefault();
        const k = Array.from(f.value?.querySelectorAll(".work-graph-node") ?? []), W = y.value.nodes.findIndex((de) => de.state === x), J = ["ArrowRight", "ArrowDown"].includes(h.key) ? 1 : -1;
        k[(W + J + k.length) % k.length]?.focus();
      }
    }
    function I() {
      v.value = "", ne.clear(), o("clear");
    }
    const ne = /* @__PURE__ */ new Map();
    let K = 0;
    function F(h) {
      if (!h.target.closest('[role="button"]') && (ne.set(h.pointerId, { x: h.clientX, y: h.clientY }), p.value?.setPointerCapture?.(h.pointerId), ne.size === 2)) {
        const [x, k] = [...ne.values()];
        K = Math.hypot(x.x - k.x, x.y - k.y);
      }
    }
    function L(h) {
      const x = f.value?.getBoundingClientRect();
      if (!x?.width) return;
      if (v.value) {
        C.value = { x: w.value.x + (h.clientX - x.left) * D.value.width / m.value / x.width, y: w.value.y + (h.clientY - x.top) * D.value.height / m.value / x.height };
        return;
      }
      const k = ne.get(h.pointerId);
      if (k)
        if (ne.set(h.pointerId, { x: h.clientX, y: h.clientY }), ne.size === 2) {
          const [W, J] = [...ne.values()], de = Math.hypot(W.x - J.x, W.y - J.y);
          K && V(de / K), K = de;
        } else w.value = { x: w.value.x - (h.clientX - k.x) * D.value.width / m.value / x.width, y: w.value.y - (h.clientY - k.y) * D.value.height / m.value / x.height };
    }
    function Q(h) {
      ne.delete(h.pointerId), K = 0, v.value = "";
    }
    function ke(h) {
      h.ctrlKey && (h.preventDefault(), V(Math.exp(-h.deltaY * 0.01)));
    }
    let pe;
    kl(() => {
      if (p.value && Ys(p.value), typeof ResizeObserver < "u" && f.value) {
        let h = !0;
        pe = new ResizeObserver(() => {
          const x = f.value?.getBoundingClientRect();
          if (!x?.width || !x.height) return;
          const k = D.value.width;
          i.value = x.width, (h || Math.abs(x.width - k) > 1) && (n.value ? $() : z(), h = !1), oe();
        }), pe.observe(f.value);
      }
    }), nt(() => pe?.disconnect()), l({ fit: $, zoomIn: () => V(1.2), zoomOut: () => V(1 / 1.2) });
    function ge(h) {
      return h.category === "completed" ? "check" : h.category === "canceled" ? "x" : h.id === a.process.initial ? "arrow-bar-to-right" : { gate: "shield-check", automated: "bolt", parallel: "arrows-split" }[h.kind ?? ""] ?? "user";
    }
    return (h, x) => (u(), g("section", {
      ref_key: "canvas",
      ref: p,
      class: "work-process-canvas",
      "aria-label": "Process map",
      tabindex: "0",
      onKeydown: [
        M,
        Ae(he(I, ["stop"]), ["esc"])
      ],
      onPointerdown: F,
      onPointermove: L,
      onPointerup: Q,
      onPointercancel: I,
      onWheel: ke
    }, [
      v.value ? (u(), g("p", Zs, "Choose the next stop. Escape cancels.")) : E("", !0),
      (u(), g("svg", {
        ref_key: "svg",
        ref: f,
        style: ho({ height: D.value.height + "px" }),
        viewBox: O.value,
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
          }, [...x[1] || (x[1] = [
            d("path", {
              d: "M0 0 L8 4 L0 8 z",
              class: "work-graph-arrow"
            }, null, -1)
          ])], 8, _s)
        ]),
        (u(!0), g(Z, null, le(y.value.parallels, (k) => (u(), g("path", {
          key: k.key,
          d: k.path,
          class: "work-lane-line",
          "marker-end": `url(#${r(s)}-arrow)`
        }, [
          d("title", null, "Parallel lane from " + U(r(ye)(k.state)), 1)
        ], 8, er))), 128)),
        (u(!0), g(Z, null, le(y.value.edges, (k) => (u(), g("g", {
          key: k.key,
          class: pt(["work-graph-edge", ["work-edge-" + k.type, { "work-selected": e.selectedTransition === k.transition }]]),
          role: "button",
          tabindex: "0",
          "aria-label": "Edit transition " + r(je)(k.transition),
          "aria-pressed": e.selectedTransition === k.transition,
          onFocus: (W) => S(k),
          onClick: (W) => o("transition", k.transition, W.currentTarget),
          onKeydown: [
            Ae(he((W) => o("transition", k.transition, W.currentTarget), ["prevent"]), ["enter"]),
            Ae(he((W) => o("transition", k.transition, W.currentTarget), ["prevent"]), ["space"])
          ]
        }, [
          d("path", {
            d: k.path,
            class: "work-edge-hit"
          }, null, 8, lr),
          d("path", {
            d: k.path,
            class: "work-edge-line",
            "marker-end": `url(#${r(s)}-arrow)`
          }, null, 8, ar),
          d("rect", {
            x: k.x - k.width / 2,
            y: k.y - k.height / 2,
            width: k.width,
            height: k.height,
            rx: "6",
            class: "work-edge-label-bg"
          }, null, 8, or),
          d("text", {
            x: k.x,
            y: k.y - (k.lines.length - 1) * 8 + 4,
            class: "work-edge-label",
            "text-anchor": "middle"
          }, [
            (u(!0), g(Z, null, le(k.lines, (W, J) => (u(), g("tspan", {
              key: J,
              x: k.x,
              dy: J ? 16 : 0
            }, U(W), 9, nr))), 128))
          ], 8, ir)
        ], 42, tr))), 128)),
        (u(!0), g(Z, null, le(y.value.nodes, (k) => (u(), g("g", {
          key: k.state.id,
          class: pt(["work-graph-node", ["work-stop-" + k.state.category, { "work-selected": e.selectedState === k.state }]]),
          role: "button",
          tabindex: "0",
          "aria-label": "Edit state " + r(ye)(k.state),
          "aria-pressed": e.selectedState === k.state,
          onClick: (W) => o("state", k.state, W.currentTarget),
          onKeydown: (W) => ie(W, k.state),
          onFocus: (W) => S(k),
          onPointerup: he((W) => q(k.state, W), ["stop"])
        }, [
          d("rect", {
            x: k.x - k.width / 2,
            y: k.y - k.height / 2,
            width: k.width,
            height: k.height,
            rx: "10",
            class: "work-state-card"
          }, null, 8, rr),
          d("circle", {
            cx: k.x - k.width / 2 + 22,
            cy: k.y - k.height / 2 + 25,
            r: "10",
            class: "work-stop-ring"
          }, null, 8, dr),
          b(r(_), {
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
            (u(!0), g(Z, null, le(k.title, (W, J) => (u(), g("tspan", {
              key: J,
              x: k.x - k.width / 2 + 42,
              dy: J ? 18 : 0
            }, U(W), 9, cr))), 128))
          ], 8, ur),
          d("text", {
            x: k.x - k.width / 2 + 16,
            y: k.y - k.height / 2 + 33 + k.title.length * 18,
            class: "work-node-meta"
          }, [
            (u(!0), g(Z, null, le(k.caption, (W, J) => (u(), g("tspan", {
              key: J,
              x: k.x - k.width / 2 + 16,
              dy: J ? 16 : 0
            }, U(W), 9, mr))), 128)),
            e.draft.policy?.wip?.[k.state.id] ? (u(), g("tspan", fr, " · limit " + U(e.draft.policy.wip[k.state.id].limit), 1)) : E("", !0)
          ], 8, vr),
          (u(!0), g(Z, null, le(k.badges, (W, J) => (u(), g("g", {
            key: W.id,
            class: "work-any-transition",
            role: "button",
            tabindex: "0",
            "aria-label": "Edit transition " + r(je)(W),
            onClick: he((de) => o("transition", W, de.currentTarget), ["stop"]),
            onKeydown: [
              Ae(he((de) => o("transition", W, de.currentTarget), ["stop", "prevent"]), ["enter"]),
              Ae(he((de) => o("transition", W, de.currentTarget), ["stop", "prevent"]), ["space"])
            ]
          }, [
            d("text", {
              x: k.x - k.width / 2 + 16,
              y: k.y - k.height / 2 + 33 + k.title.length * 18 + k.caption.length * 16 + k.badges.slice(0, J).reduce((de, be) => de + r(Ot)(r(je)(be) + " works from any state").length * 18, 0),
              class: "work-node-meta"
            }, [
              (u(!0), g(Z, null, le(r(Ot)(r(je)(W) + " works from any state"), (de, be) => (u(), g("tspan", {
                key: be,
                x: k.x - k.width / 2 + 16,
                dy: be ? 18 : 0
              }, U(de), 9, hr))), 128))
            ], 8, br)
          ], 40, pr))), 128)),
          ["completed", "canceled"].includes(k.state.category) ? E("", !0) : (u(), g("circle", {
            key: 0,
            cx: y.value.direction === "TB" ? k.x : k.x + k.width / 2,
            cy: y.value.direction === "TB" ? k.y + k.height / 2 : k.y,
            r: "7",
            class: "work-node-connector",
            role: "button",
            tabindex: "0",
            "aria-label": "Connect from " + r(ye)(k.state),
            onPointerdown: he((W) => A(W, k), ["stop", "prevent"]),
            onClick: he((W) => o("state", k.state, W.currentTarget), ["stop"]),
            onKeydown: [
              Ae(he((W) => {
                v.value = k.state.id, C.value = { x: k.x, y: k.y };
              }, ["stop", "prevent"]), ["enter"]),
              Ae(he((W) => v.value = k.state.id, ["stop", "prevent"]), ["space"])
            ]
          }, null, 40, yr))
        ], 42, sr))), 128)),
        T.value ? (u(), g("path", {
          key: 0,
          d: `M ${y.value.direction === "TB" ? T.value.x : T.value.x + T.value.width / 2} ${y.value.direction === "TB" ? T.value.y + T.value.height / 2 : T.value.y} L ${C.value.x} ${C.value.y}`,
          class: "work-connect-ghost"
        }, null, 8, gr)) : E("", !0)
      ], 12, Qs)),
      !n.value && P.value < e.process.states.length ? (u(), g("div", kr, [
        d("span", null, U(P.value) + " of " + U(e.process.states.length) + " states in view · More " + U(y.value.direction === "TB" ? "below" : "to the right"), 1),
        b(r(X), {
          label: "Show full process",
          size: "small",
          text: "",
          onClick: x[0] || (x[0] = (k) => $())
        })
      ])) : E("", !0),
      d("div", wr, [
        d("span", null, U(e.process.states.length) + " states · " + U(Math.round(m.value * 100)) + "%", 1),
        x[2] || (x[2] = d("span", null, [
          d("i"),
          R("Transition")
        ], -1)),
        x[3] || (x[3] = d("span", null, [
          d("i", { class: "work-return-key" }),
          R("Return / loop")
        ], -1)),
        x[4] || (x[4] = d("span", null, "Drag to pan · Ctrl + scroll to zoom · Fit for full process", -1))
      ])
    ], 40, Js));
  }
}), $r = {
  class: "work-process-list work-stack",
  "aria-label": "Process list"
}, xr = { class: "work-stack work-tight" }, Cr = { class: "work-table-scroll" }, Sr = {
  class: "work-settings-table work-process-table",
  role: "table",
  "aria-label": "States"
}, Tr = { role: "rowgroup" }, Er = ["aria-selected"], Ur = { role: "cell" }, Dr = { role: "cell" }, Ir = { role: "cell" }, Ar = {
  role: "cell",
  class: "work-process-list-actions"
}, Pr = { class: "work-table-scroll" }, Rr = {
  class: "work-settings-table work-process-table",
  role: "table",
  "aria-label": "Transitions"
}, Or = { role: "rowgroup" }, Nr = ["aria-selected"], Mr = { role: "cell" }, Fr = { role: "cell" }, Lr = { role: "cell" }, zr = {
  role: "cell",
  class: "work-process-list-actions"
}, Br = /* @__PURE__ */ ve({
  __name: "ProcessList",
  props: {
    process: {},
    selectedState: {},
    selectedTransition: {}
  },
  emits: ["state", "transition", "removeState", "removeTransition", "addTransition"],
  setup(e) {
    return (l, t) => (u(), g("section", $r, [
      d("label", xr, [
        t[2] || (t[2] = R("Process name", -1)),
        b(r(ce), {
          modelValue: e.process.name,
          "onUpdate:modelValue": t[0] || (t[0] = (a) => e.process.name = a),
          "aria-label": "Process name"
        }, null, 8, ["modelValue"])
      ]),
      t[9] || (t[9] = d("h3", null, "States", -1)),
      d("div", Cr, [
        d("table", Sr, [
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
          d("tbody", Tr, [
            (u(!0), g(Z, null, le(e.process.states, (a) => (u(), g("tr", {
              key: a.id,
              "aria-selected": e.selectedState === a,
              role: "row"
            }, [
              d("td", Ur, [
                b(r(ce), {
                  modelValue: a.name,
                  "onUpdate:modelValue": (o) => a.name = o,
                  "aria-label": "Name of " + r(ye)(a)
                }, null, 8, ["modelValue", "onUpdate:modelValue", "aria-label"])
              ]),
              d("td", Dr, [
                t[3] || (t[3] = d("span", {
                  class: "work-process-cell-label",
                  "aria-hidden": "true"
                }, "Phase", -1)),
                R(U(r(Zl)(a.category)), 1)
              ]),
              d("td", Ir, [
                t[4] || (t[4] = d("span", {
                  class: "work-process-cell-label",
                  "aria-hidden": "true"
                }, "Kind", -1)),
                b(r(Re), { severity: "secondary" }, {
                  default: N(() => [
                    R(U(r(La)(a.kind)), 1)
                  ]),
                  _: 2
                }, 1024)
              ]),
              d("td", Ar, [
                b(r(X), {
                  size: "small",
                  text: "",
                  severity: "secondary",
                  "aria-label": "Edit state",
                  onClick: (o) => l.$emit("state", a, o.currentTarget)
                }, {
                  default: N(() => [
                    b(r(_), { icon: "tabler:pencil" })
                  ]),
                  _: 1
                }, 8, ["onClick"]),
                b(r(X), {
                  size: "small",
                  text: "",
                  severity: "danger",
                  "aria-label": "Remove state " + r(ye)(a),
                  onClick: (o) => l.$emit("removeState", a)
                }, {
                  default: N(() => [
                    b(r(_), { icon: "tabler:trash" })
                  ]),
                  _: 1
                }, 8, ["aria-label", "onClick"])
              ])
            ], 8, Er))), 128))
          ])
        ])
      ]),
      t[10] || (t[10] = d("h3", null, "Transitions", -1)),
      d("div", Pr, [
        d("table", Rr, [
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
          d("tbody", Or, [
            (u(!0), g(Z, null, le(e.process.transitions ?? [], (a) => (u(), g("tr", {
              key: a.id,
              "aria-selected": e.selectedTransition === a,
              role: "row"
            }, [
              d("td", Mr, [
                b(r(ce), {
                  modelValue: a.name,
                  "onUpdate:modelValue": (o) => a.name = o,
                  placeholder: r(je)(a),
                  "aria-label": "Name of " + r(je)(a)
                }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder", "aria-label"])
              ]),
              d("td", Fr, [
                t[6] || (t[6] = d("span", {
                  class: "work-process-cell-label",
                  "aria-hidden": "true"
                }, "From", -1)),
                R(" " + U(a.from === "any" ? "Any state" : a.from.map((o) => r(ye)(e.process.states.find((s) => s.id === o))).join(", ")), 1)
              ]),
              d("td", Lr, [
                t[7] || (t[7] = d("span", {
                  class: "work-process-cell-label",
                  "aria-hidden": "true"
                }, "To", -1)),
                R(U(r(ye)(e.process.states.find((o) => o.id === a.to))), 1)
              ]),
              d("td", zr, [
                b(r(X), {
                  size: "small",
                  text: "",
                  severity: "secondary",
                  "aria-label": "Edit transition",
                  onClick: (o) => l.$emit("transition", a, o.currentTarget)
                }, {
                  default: N(() => [
                    b(r(_), { icon: "tabler:pencil" })
                  ]),
                  _: 1
                }, 8, ["onClick"]),
                b(r(X), {
                  size: "small",
                  text: "",
                  severity: "danger",
                  "aria-label": "Remove transition " + r(je)(a),
                  onClick: (o) => l.$emit("removeTransition", a)
                }, {
                  default: N(() => [
                    b(r(_), { icon: "tabler:trash" })
                  ]),
                  _: 1
                }, 8, ["aria-label", "onClick"])
              ])
            ], 8, Nr))), 128))
          ])
        ])
      ]),
      b(r(X), {
        label: "Add transition",
        severity: "secondary",
        outlined: "",
        onClick: t[1] || (t[1] = (a) => l.$emit("addTransition", a.currentTarget))
      }, {
        icon: N(() => [
          b(r(_), { icon: "tabler:plus" })
        ]),
        _: 1
      })
    ]));
  }
}), jr = { class: "work-stack work-transition-settings" }, qr = { class: "work-stack work-tight" }, Wr = { class: "work-row" }, Kr = { class: "work-row" }, Gr = { class: "work-row" }, Yr = { class: "work-stack work-tight" }, Hr = { class: "work-row" }, Xr = { class: "work-stack work-tight" }, Jr = { class: "work-stack work-tight" }, Zr = /* @__PURE__ */ ve({
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
    return (v, p) => (u(), g("div", jr, [
      d("label", qr, [
        p[14] || (p[14] = R("To state", -1)),
        b(r(ae), {
          modelValue: e.transition.to,
          "onUpdate:modelValue": p[0] || (p[0] = (f) => e.transition.to = f),
          "aria-label": "To state",
          appendTo: "self",
          optionLabel: "label",
          optionValue: "value",
          options: e.process.states.map((f) => ({ label: r(ye)(f), value: f.id }))
        }, null, 8, ["modelValue", "options"])
      ]),
      d("label", Wr, [
        p[15] || (p[15] = d("span", { class: "work-spacer" }, "Happens automatically", -1)),
        b(r(Le), {
          "model-value": e.transition.auto,
          "onUpdate:modelValue": p[1] || (p[1] = (f) => {
            e.transition.auto = f, f || delete e.transition.default;
          }),
          "aria-label": "Automatic transition"
        }, null, 8, ["model-value"])
      ]),
      d("label", Kr, [
        p[16] || (p[16] = d("span", { class: "work-spacer" }, "Default automatic transition", -1)),
        b(r(Le), {
          modelValue: e.transition.default,
          "onUpdate:modelValue": p[2] || (p[2] = (f) => e.transition.default = f),
          disabled: !e.transition.auto,
          "aria-label": "Default transition"
        }, null, 8, ["modelValue", "disabled"])
      ]),
      d("label", Gr, [
        p[17] || (p[17] = d("span", { class: "work-spacer" }, "Works from any state", -1)),
        b(r(Le), {
          "model-value": e.transition.from === "any",
          "aria-label": "Works from any state",
          "onUpdate:modelValue": p[3] || (p[3] = (f) => e.transition.from = f ? "any" : [])
        }, null, 8, ["model-value"])
      ]),
      e.transition.from !== "any" ? (u(), j(Lt, {
        key: 0,
        label: "From states",
        options: e.process.states.map((f) => ({ value: f.id, label: r(ye)(f) })),
        modelValue: e.transition.from,
        "onUpdate:modelValue": p[4] || (p[4] = (f) => e.transition.from = f)
      }, null, 8, ["options", "modelValue"])) : E("", !0),
      p[21] || (p[21] = d("h4", { class: "work-process-group" }, "Must be filled", -1)),
      b(Lt, {
        label: "Required fields",
        options: e.draft.fields?.map((f) => ({ value: f.code, label: f.title || f.code })) ?? [],
        modelValue: e.transition.require,
        "onUpdate:modelValue": p[5] || (p[5] = (f) => e.transition.require = f)
      }, null, 8, ["options", "modelValue"]),
      p[22] || (p[22] = d("h4", { class: "work-process-group" }, "Also sets", -1)),
      (u(!0), g(Z, null, le(e.transition.set ?? [], (f, i) => (u(), g("div", {
        key: i,
        class: "work-process-value work-stack work-tight"
      }, [
        d("label", Yr, [
          p[18] || (p[18] = R("Field", -1)),
          b(r(ae), {
            modelValue: f.field,
            "onUpdate:modelValue": (n) => f.field = n,
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            options: e.draft.fields?.map((n) => ({ value: n.code, label: n.title || n.code })) ?? []
          }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
        ]),
        d("div", Hr, [
          b(r(ae), {
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
          b(r(X), {
            text: "",
            severity: "danger",
            "aria-label": "Remove value " + (i + 1),
            onClick: (n) => e.transition.set?.splice(i, 1)
          }, {
            default: N(() => [
              b(r(_), { icon: "tabler:trash" })
            ]),
            _: 1
          }, 8, ["aria-label", "onClick"])
        ]),
        f.copy !== void 0 ? (u(), j(r(ae), {
          key: 0,
          modelValue: f.copy,
          "onUpdate:modelValue": (n) => f.copy = n,
          "aria-label": "Copy from field",
          appendTo: "self",
          optionLabel: "label",
          optionValue: "value",
          options: e.draft.fields?.map((n) => ({ value: n.code, label: n.title || n.code })) ?? []
        }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])) : f.clear ? E("", !0) : (u(!0), g(Z, { key: 1 }, le(e.draft.fields?.filter((n) => n.code === f.field) ?? [], (n) => (u(), j(qa, {
          key: n.code,
          "board-id": e.boardId ?? "",
          field: n,
          modelValue: f.value,
          "onUpdate:modelValue": (c) => f.value = c,
          onValidity: (c) => a("validity", "effect-" + i, c)
        }, null, 8, ["board-id", "field", "modelValue", "onUpdate:modelValue", "onValidity"]))), 128))
      ]))), 128)),
      b(r(X), {
        label: "Add value",
        severity: "secondary",
        outlined: "",
        size: "small",
        onClick: o
      }, {
        icon: N(() => [
          b(r(_), { icon: "tabler:plus" })
        ]),
        _: 1
      }),
      d("label", Xr, [
        p[19] || (p[19] = R("Offer to people", -1)),
        b(r(ae), {
          "model-value": e.transition.people,
          "aria-label": "Offer to people",
          appendTo: "self",
          optionLabel: "label",
          optionValue: "value",
          options: [{ label: "Work default", value: void 0 }, { label: "Offer explicitly", value: !0 }, { label: "Hide from people", value: !1 }],
          "onUpdate:modelValue": p[6] || (p[6] = (f) => e.transition.people = f)
        }, null, 8, ["model-value"])
      ]),
      d("label", Jr, [
        p[20] || (p[20] = R("Evaluation order", -1)),
        b(r(Ge), {
          "model-value": e.transition.order ?? null,
          "aria-label": "Transition order",
          min: 0,
          useGrouping: !1,
          "onUpdate:modelValue": p[7] || (p[7] = (f) => e.transition.order = f ?? void 0)
        }, null, 8, ["model-value"])
      ]),
      p[23] || (p[23] = d("h4", { class: "work-process-group" }, "Only when", -1)),
      b(_l, {
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
}), gl = /* @__PURE__ */ ve({
  __name: "CapacityControl",
  props: {
    draft: {},
    state: {},
    label: {},
    hard: { type: Boolean }
  },
  setup(e) {
    const l = e, t = H(() => l.draft.policy?.wip?.[l.state]);
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
    return (s, v) => e.hard ? (u(), j(r(Le), {
      key: 0,
      "aria-label": e.label,
      disabled: !t.value,
      "model-value": t.value?.hard ?? !1,
      "onUpdate:modelValue": o
    }, null, 8, ["aria-label", "disabled", "model-value"])) : (u(), j(r(Ge), {
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
}, Qr = {
  class: "work-stack work-tight",
  "aria-label": "Stage Flow"
}, _r = {
  key: 0,
  class: "work-muted work-small"
}, ed = {
  key: 1,
  class: "kx-err",
  role: "alert"
}, td = ["schema", "config", "title"], ld = {
  key: 3,
  class: "kx-err",
  role: "alert"
}, ad = {
  key: 4,
  class: "work-stack work-tight"
}, od = {
  key: 5,
  class: "work-muted work-small",
  role: "status"
}, id = /* @__PURE__ */ ve({
  __name: "StageFlow",
  props: {
    modelValue: {}
  },
  emits: ["update:modelValue", "validity"],
  setup(e, { emit: l }) {
    const t = e, a = l, o = B(!1), s = B(""), v = B([]), p = B(!1), f = B(""), i = B(!1), n = H(() => s.value || t.modelValue?.id), c = JSON.stringify({ properties: { flow_ref: { title: "Published Flow", picker: "wc-workflow-picker" } } }), y = H(() => JSON.stringify(t.modelValue ? { flow_ref: t.modelValue } : {}));
    let m = 0;
    async function w() {
      o.value = await lt("wc-workflow-picker");
    }
    w();
    async function C() {
      const O = ++m, T = n.value, $ = t.modelValue;
      if (p.value = !!T, f.value = "", v.value = [], !!T)
        try {
          const [V] = await Promise.all([Ua.versions(T), !i.value && $ ? Ua.check($) : Promise.resolve()]);
          if (O !== m) return;
          if (v.value = V.filter((S) => Number.isInteger(S.version) && S.version > 0), !i.value && $ && !v.value.some((S) => S.version === $.version)) throw new Error("The published version is unavailable.");
        } catch (V) {
          O === m && (f.value = V instanceof Error ? V.message : "Could not read published Flow.");
        } finally {
          O === m && (p.value = !1);
        }
    }
    Ce([n, () => t.modelValue?.version, i], C, { immediate: !0 }), Ce(i, (O) => a("validity", !O), { immediate: !0 });
    function D(O) {
      const T = O.detail?.flow_ref;
      T?.kind !== "flow" || !T.id || (i.value = !0, s.value = T.id);
    }
    function P(O) {
      !n.value || !v.value.some((T) => T.version === O) || (a("update:modelValue", { kind: "flow", id: n.value, version: O }), i.value = !1, s.value = "");
    }
    function z() {
      a("update:modelValue", void 0), i.value = !1, s.value = "";
    }
    return nt(() => {
      m++, a("validity", !0);
    }), (O, T) => (u(), g("section", Qr, [
      T[3] || (T[3] = d("h4", { class: "work-field-label" }, "What runs", -1)),
      e.modelValue ? E("", !0) : (u(), g("p", _r, "No Flow bound. This stage keeps its existing external execution contract.")),
      f.value ? (u(), g("p", ed, [
        R(U(i.value ? "Flow versions unavailable" : "Flow binding unavailable") + ": " + U(n.value), 1),
        !i.value && e.modelValue ? (u(), g(Z, { key: 0 }, [
          R(" · v" + U(e.modelValue.version), 1)
        ], 64)) : E("", !0),
        R(". " + U(f.value), 1),
        b(r(X), {
          label: "Reload Flow",
          severity: "secondary",
          text: "",
          onClick: C
        })
      ])) : E("", !0),
      o.value ? (u(), g("wc-workflow-picker", {
        key: 2,
        schema: r(c),
        config: y.value,
        title: e.modelValue?.id,
        onChange: D
      }, null, 40, td)) : (u(), g("p", ld, [
        T[1] || (T[1] = R("Published Flow picker unavailable.", -1)),
        b(r(X), {
          label: "Reload Flow picker",
          text: "",
          severity: "secondary",
          onClick: w
        })
      ])),
      n.value ? (u(), g("label", ad, [
        T[2] || (T[2] = R("Published version", -1)),
        b(r(ae), {
          "model-value": i.value ? void 0 : e.modelValue?.version,
          options: v.value.map(($) => ({ label: "v" + $.version, value: $.version })),
          "option-label": "label",
          "option-value": "value",
          "aria-label": "Published version",
          placeholder: "Choose a published version",
          "append-to": "self",
          loading: p.value,
          disabled: p.value || !!f.value,
          "onUpdate:modelValue": P
        }, null, 8, ["model-value", "options", "loading", "disabled"])
      ])) : E("", !0),
      i.value ? (u(), g("p", od, "Choose a published version of " + U(n.value) + " to finish selecting the Flow.", 1)) : E("", !0),
      e.modelValue || i.value ? (u(), j(r(X), {
        key: 6,
        label: i.value ? "Cancel Flow selection" : "Remove Flow binding",
        "aria-label": i.value ? "Cancel Flow selection" : "Remove Flow binding",
        severity: "secondary",
        text: "",
        onClick: T[0] || (T[0] = ($) => i.value ? (i.value = !1, s.value = "") : z())
      }, null, 8, ["label", "aria-label"])) : E("", !0)
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
function nd(e, l) {
  if (e == null) return;
  if (!Number.isFinite(e * Hl[l]) || e <= 0) throw new Error("Enter a positive duration.");
  const t = (a) => a.toLocaleString("en-US", { useGrouping: !1, maximumSignificantDigits: 21 });
  return Number.isInteger(e) ? l === "days" ? `P${t(e)}D` : l === "hours" ? `PT${t(e)}H` : `PT${t(e)}M` : `PT${t(e * Hl[l])}S`;
}
const sd = { class: "work-stack work-tight" }, rd = {
  class: "work-duration-control",
  style: { "max-width": "360px" }
}, dd = {
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
    const t = e, a = l, o = "duration:" + Xl(), s = B("days"), v = B("");
    Ce(() => t.modelValue, (y) => {
      v.value = "";
      const m = y ? Wt(y) : void 0;
      m && (s.value = m.unit), a("validity", !y || !!m, o);
    }, { immediate: !0 });
    const p = H(() => t.modelValue ? Wt(t.modelValue, s.value)?.amount ?? null : null);
    function f(y) {
      try {
        const m = nd(y, s.value);
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
    function c(y) {
      const m = p.value;
      s.value = y, !(t.modelValue && !Wt(t.modelValue)) && f(m);
    }
    return nt(() => a("validity", !0, o)), (y, m) => (u(), g("label", sd, [
      R(U(e.label), 1),
      d("span", rd, [
        b(r(Ge), {
          "model-value": p.value,
          "aria-label": e.label,
          min: 0,
          "aria-invalid": !!v.value || !!e.modelValue && !r(Wt)(e.modelValue),
          disabled: e.disabled,
          useGrouping: !1,
          onInput: n,
          "onUpdate:modelValue": m[0] || (m[0] = (w) => i(w))
        }, null, 8, ["model-value", "aria-label", "aria-invalid", "disabled"]),
        b(r(ae), {
          "model-value": s.value,
          "aria-label": e.label + " unit",
          disabled: e.disabled,
          options: [{ label: "Minutes", value: "minutes" }, { label: "Hours", value: "hours" }, { label: "Days", value: "days" }],
          optionLabel: "label",
          optionValue: "value",
          appendTo: "self",
          "onUpdate:modelValue": m[1] || (m[1] = (w) => c(w))
        }, null, 8, ["model-value", "aria-label", "disabled"])
      ]),
      v.value || e.modelValue && !r(Wt)(e.modelValue) ? (u(), g("span", dd, U(v.value || `Unsupported duration: ${e.modelValue}`), 1)) : E("", !0)
    ]));
  }
}), ud = { class: "work-stack" }, cd = { class: "work-settings-grid" }, vd = { class: "work-stack work-tight" }, md = { class: "work-stack work-tight" }, fd = {
  key: 1,
  class: "work-stack work-tight"
}, pd = { class: "work-stack work-tight" }, bd = { class: "work-settings-grid" }, hd = { class: "work-row" }, yd = { class: "work-stack work-tight" }, gd = {
  key: 0,
  class: "work-stack work-tight"
}, kd = /* @__PURE__ */ ve({
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
    function p(i, n, c) {
      c ? i[n] = c : (delete i[n], delete i.table);
    }
    function f(i, n) {
      i.then = n === "emit" ? { emit: "" } : { transition: "" };
    }
    return (i, n) => (u(), g("section", ud, [
      n[8] || (n[8] = d("h4", null, "Timers", -1)),
      (u(!0), g(Z, null, le(o(), (c, y) => (u(), g("article", {
        key: c.id,
        class: "work-settings-card work-stack"
      }, [
        d("div", cd, [
          d("label", vd, [
            n[2] || (n[2] = R("Timer ID", -1)),
            b(r(ce), {
              modelValue: c.id,
              "onUpdate:modelValue": (m) => c.id = m,
              required: "",
              pattern: "[a-z][a-z0-9_]*"
            }, null, 8, ["modelValue", "onUpdate:modelValue"])
          ]),
          d("label", md, [
            n[3] || (n[3] = R("Deadline", -1)),
            b(r(ae), {
              "model-value": c.at_field !== void 0 ? "at_field" : "after",
              "onUpdate:modelValue": (m) => v(c, m),
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
          c.after !== void 0 ? (u(), j(Ct, {
            key: 0,
            modelValue: c.after,
            "onUpdate:modelValue": (m) => c.after = m,
            label: "After",
            onValidity: n[0] || (n[0] = (m, w) => a("validity", w, m))
          }, null, 8, ["modelValue", "onUpdate:modelValue"])) : (u(), g("label", fd, [
            n[4] || (n[4] = R("At field", -1)),
            b(r(ae), {
              modelValue: c.at_field,
              "onUpdate:modelValue": (m) => c.at_field = m,
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
          d("label", pd, [
            n[5] || (n[5] = R("Duration by field", -1)),
            b(r(ae), {
              "model-value": c.by ?? "",
              "onUpdate:modelValue": (m) => p(c, "by", m),
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
        c.by ? (u(), j(ot, {
          key: 0,
          label: "Duration table",
          hint: "Map field values to ISO durations.",
          "model-value": c.table,
          shape: "object",
          "onUpdate:modelValue": (m) => c.table = m,
          onValidity: (m) => a("validity", "table-" + y, m)
        }, null, 8, ["model-value", "onUpdate:modelValue", "onValidity"])) : E("", !0),
        d("div", bd, [
          b(Ct, {
            modelValue: c.repeat,
            "onUpdate:modelValue": (m) => c.repeat = m,
            label: "Repeat every",
            onValidity: n[1] || (n[1] = (m, w) => a("validity", w, m)),
            disabled: c.interrupting
          }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"]),
          d("label", hd, [
            b(r(Mt), {
              modelValue: c.interrupting,
              "onUpdate:modelValue": [(m) => c.interrupting = m, (m) => c.interrupting && delete c.repeat],
              binary: ""
            }, null, 8, ["modelValue", "onUpdate:modelValue"]),
            n[6] || (n[6] = R("Interrupting", -1))
          ]),
          d("label", yd, [
            n[7] || (n[7] = R("Then", -1)),
            b(r(ae), {
              "model-value": c.then?.transition !== void 0 ? "transition" : "emit",
              "onUpdate:modelValue": (m) => f(c, m),
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
          c.then ? (u(), g("label", gd, [
            R(U(c.then.transition !== void 0 ? "Transition ID" : "Event name"), 1),
            c.then.transition !== void 0 ? (u(), j(r(ce), {
              key: 0,
              modelValue: c.then.transition,
              "onUpdate:modelValue": (m) => c.then.transition = m
            }, null, 8, ["modelValue", "onUpdate:modelValue"])) : (u(), j(r(ce), {
              key: 1,
              modelValue: c.then.emit,
              "onUpdate:modelValue": (m) => c.then.emit = m
            }, null, 8, ["modelValue", "onUpdate:modelValue"]))
          ])) : E("", !0)
        ]),
        b(r(X), {
          severity: "secondary",
          onClick: (m) => o().splice(y, 1),
          "aria-label": "Remove timer",
          text: "",
          size: "small"
        }, {
          default: N(() => [
            b(r(_), {
              icon: "tabler:trash",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        }, 8, ["onClick"])
      ]))), 128)),
      b(r(X), {
        label: "Add timer",
        severity: "secondary",
        onClick: s,
        outlined: ""
      }, {
        icon: N(() => [
          b(r(_), {
            icon: "tabler:plus",
            "aria-hidden": "true"
          })
        ]),
        _: 1
      })
    ]));
  }
}), wd = ["aria-label"], Vd = { class: "work-stack work-tight" }, $d = {
  key: 0,
  class: "work-stack work-tight"
}, xd = /* @__PURE__ */ ve({
  __name: "PrincipalSourceEditor",
  props: {
    modelValue: {},
    draft: {},
    boardId: {},
    label: {}
  },
  emits: ["update:modelValue", "validity"],
  setup(e, { emit: l }) {
    const t = e, a = l, o = H(() => Array.isArray(t.modelValue) ? "principals" : "field" in t.modelValue ? "field" : "group"), s = H(() => Array.isArray(t.modelValue) ? t.modelValue : "group" in t.modelValue && t.modelValue.group ? [{ kind: "group", id: t.modelValue.group }] : []);
    function v(f) {
      a("update:modelValue", f === "field" ? { field: "" } : f === "group" ? { group: "" } : []);
    }
    function p(f) {
      a("update:modelValue", o.value === "group" ? { group: f.at(-1)?.id ?? "" } : f);
    }
    return Oa(() => a("validity", Array.isArray(t.modelValue) ? t.modelValue.length > 0 : "field" in t.modelValue ? !!t.modelValue.field : !!t.modelValue.group)), nt(() => a("validity", !0)), (f, i) => (u(), g("section", {
      class: "work-stack work-tight",
      "aria-label": e.label
    }, [
      d("label", Vd, [
        R(U(e.label) + " source", 1),
        b(r(ae), {
          "model-value": o.value,
          "aria-label": e.label + " source",
          options: [{ label: "Group", value: "group" }, { label: "People and groups", value: "principals" }, { label: "Principal field", value: "field" }],
          optionLabel: "label",
          optionValue: "value",
          appendTo: "self",
          "onUpdate:modelValue": v
        }, null, 8, ["model-value", "aria-label"])
      ]),
      "field" in e.modelValue ? (u(), g("label", $d, [
        i[1] || (i[1] = R("Principal field", -1)),
        b(r(ae), {
          "model-value": e.modelValue.field,
          "aria-label": e.label + " field",
          options: e.draft.fields?.filter((n) => n.type === "principal").map((n) => ({ label: n.title || n.code, value: n.code })) ?? [],
          optionLabel: "label",
          optionValue: "value",
          appendTo: "self",
          "onUpdate:modelValue": i[0] || (i[0] = (n) => a("update:modelValue", { field: n }))
        }, null, 8, ["model-value", "aria-label", "options"])
      ])) : (u(), j(ea, {
        key: 1,
        "board-id": e.boardId,
        label: e.label,
        kinds: o.value === "group" ? "group" : "user,group,service",
        "model-value": s.value,
        "onUpdate:modelValue": p
      }, null, 8, ["board-id", "label", "kinds", "model-value"]))
    ], 8, wd));
  }
}), Cd = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, Sd = {
  class: "work-stack work-tight",
  "aria-label": "Approval sources"
}, Td = { class: "work-row" }, Ed = {
  key: 0,
  class: "work-stack work-tight"
}, Ud = ["kinds", "value"], Dd = {
  key: 2,
  class: "work-muted work-small",
  role: "status"
}, Id = {
  key: 3,
  class: "work-chips"
}, Ad = { class: "work-row work-small" }, Pd = { class: "work-process-options" }, Rd = { class: "work-stack work-tight" }, Od = {
  key: 4,
  class: "work-error work-small",
  role: "alert"
}, Nd = {
  key: 5,
  class: "work-muted work-small"
}, Md = /* @__PURE__ */ ve({
  __name: "ApproversEditor",
  props: {
    approvals: {},
    boardId: {}
  },
  emits: ["validity"],
  setup(e, { emit: l }) {
    const t = e, a = l, { principalLabel: o, rememberPrincipal: s, nameError: v } = Na(() => t.boardId ?? "", () => Array.isArray(t.approvals.from) ? t.approvals.from : "group" in t.approvals.from ? [{ kind: "group", id: t.approvals.from.group }] : []), p = B(!1), f = H(() => Array.isArray(t.approvals.from) ? "principals" : "field" in t.approvals.from ? "field" : "group"), i = H(() => Array.isArray(t.approvals.from) ? t.approvals.from.some((m) => m.kind === "group") || t.approvals.from.length >= t.approvals.min : "field" in t.approvals.from ? !!t.approvals.from.field : !!t.approvals.from.group);
    Oa(() => a("validity", Number.isSafeInteger(t.approvals.min) && t.approvals.min > 0 && i.value)), nt(() => a("validity", !0)), kl(async () => {
      p.value = await lt("wc-principal-picker");
    });
    function n(m) {
      t.approvals.from = m === "group" ? { group: "" } : m === "field" ? { field: "" } : [];
    }
    function c(m) {
      const w = m.detail, C = w?.principal_id ?? w?.id;
      if (f.value === "group") {
        t.approvals.from = { group: C ?? "" };
        return;
      }
      if (!C || !Array.isArray(t.approvals.from)) return;
      const D = { kind: w.type ?? w.kind ?? "user", id: C };
      w.label && s(D, w.label), t.approvals.from.some((P) => P.id === C && P.kind === D.kind) || t.approvals.from.push(D);
    }
    function y(m) {
      Array.isArray(t.approvals.from) && t.approvals.from.splice(m, 1);
    }
    return (m, w) => (u(), g(Z, null, [
      r(v) ? (u(), g("p", Cd, U(r(v)), 1)) : E("", !0),
      d("section", Sd, [
        d("label", Td, [
          w[4] || (w[4] = d("span", { class: "work-spacer" }, "Approvals needed", -1)),
          b(r(Ge), {
            modelValue: e.approvals.min,
            "onUpdate:modelValue": w[0] || (w[0] = (C) => e.approvals.min = C),
            min: 1,
            required: "",
            useGrouping: !1
          }, null, 8, ["modelValue"])
        ]),
        w[9] || (w[9] = d("span", { class: "work-field-label" }, "Approvers", -1)),
        "field" in e.approvals.from ? (u(), g("label", Ed, [
          w[5] || (w[5] = R("Principal field", -1)),
          b(r(ce), {
            modelValue: e.approvals.from.field,
            "onUpdate:modelValue": w[1] || (w[1] = (C) => e.approvals.from.field = C),
            "aria-label": "Principal field"
          }, null, 8, ["modelValue"])
        ])) : p.value ? (u(), g("wc-principal-picker", {
          key: f.value,
          kinds: f.value === "group" ? "group" : "user,group,service",
          value: JSON.stringify("group" in e.approvals.from ? { type: "group", principal_id: e.approvals.from.group } : {}),
          onConfigChanged: c
        }, null, 40, Ud)) : (u(), g("p", Dd, "The principal picker is unavailable.")),
        Array.isArray(e.approvals.from) ? (u(), g("div", Id, [
          (u(!0), g(Z, null, le(e.approvals.from, (C, D) => (u(), j(r(Re), {
            key: C.kind + ":" + C.id,
            class: "kx-tag-sm",
            severity: "secondary"
          }, {
            default: N(() => [
              R(U(r(o)(C)), 1),
              b(r(X), {
                "aria-label": "Remove approver " + (D + 1),
                text: "",
                severity: "secondary",
                size: "small",
                onClick: (P) => y(D)
              }, {
                default: N(() => [
                  b(r(_), {
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
        d("label", Ad, [
          w[6] || (w[6] = d("span", { class: "work-spacer" }, "The person who moves the item here cannot approve this visit", -1)),
          b(r(Le), {
            modelValue: e.approvals.prevent_self,
            "onUpdate:modelValue": w[2] || (w[2] = (C) => e.approvals.prevent_self = C),
            "aria-label": "The person who moves the item here cannot approve this visit"
          }, null, 8, ["modelValue"])
        ]),
        d("details", Pd, [
          w[8] || (w[8] = d("summary", null, "Approval options", -1)),
          d("label", Rd, [
            w[7] || (w[7] = R("Approval source", -1)),
            b(r(ae), {
              "model-value": f.value,
              "onUpdate:modelValue": w[3] || (w[3] = (C) => n(C)),
              appendTo: "self",
              optionLabel: "label",
              optionValue: "value",
              options: [{ label: "Group members", value: "group" }, { label: "People and groups", value: "principals" }, { label: "Principal field", value: "field" }]
            }, null, 8, ["model-value"])
          ])
        ]),
        Array.isArray(e.approvals.from) && !i.value ? (u(), g("p", Od, "Select at least " + U(e.approvals.min) + " distinct principals, or lower the minimum.", 1)) : "group" in e.approvals.from && !e.approvals.from.group ? (u(), g("p", Nd, "Choose the group that can approve this state.")) : E("", !0)
      ])
    ], 64));
  }
}), Fd = {
  class: "work-state-settings work-stack",
  "aria-label": "State settings"
}, Ld = { class: "work-process-kind" }, zd = { class: "work-process-options" }, Bd = { class: "work-stack" }, jd = { class: "work-row" }, qd = { class: "work-stack work-tight" }, Wd = { class: "work-row" }, Kd = { class: "work-stack work-tight" }, Gd = { class: "work-row" }, Yd = { class: "work-row" }, Hd = { class: "work-stack work-tight" }, Xd = { class: "work-row" }, Jd = { class: "work-stack work-tight" }, Zd = { class: "work-stack work-tight" }, Qd = {
  key: 0,
  class: "work-row"
}, _d = { class: "work-row" }, eu = { class: "work-row" }, tu = { class: "work-stack work-tight" }, lu = { class: "work-row" }, au = /* @__PURE__ */ ve({
  __name: "StateSettings",
  props: {
    state: {},
    process: {},
    draft: {},
    boardId: {}
  },
  emits: ["validity"],
  setup(e, { emit: l }) {
    const t = e, a = l, o = H(() => (t.process.transitions ?? []).filter((f) => f.from === "any" || f.from.includes(t.state.id))), s = [{ value: "human", icon: "user" }, { value: "gate", icon: "shield-check" }, { value: "automated", icon: "bolt" }, { value: "parallel", icon: "arrows-split" }];
    function v(f) {
      const i = t.state;
      i.kind = f, delete i.run, delete i.release_when, delete i.regions, delete i.join, delete i.due, (f === "automated" || f === "gate") && delete i.awaiting, f === "automated" && (i.run = { stage: i.id, retry: { max: 1, backoff: "PT1M" } }), f === "gate" && (i.release_when = { approvals: { min: 1, from: { group: "" }, prevent_self: !0 } }), f === "parallel" && (i.regions = [{ id: "region_1", initial: t.process.states.find((n) => n.id !== i.id)?.id ?? "" }], i.join = "all");
    }
    function p(f) {
      t.state.run && (f ? t.state.run.on_fail = f : delete t.state.run.on_fail);
    }
    return (f, i) => (u(), g("section", Fd, [
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
        option: N(({ option: n }) => [
          d("span", Ld, [
            b(r(_), {
              icon: "tabler:" + n.icon
            }, null, 8, ["icon"]),
            d("span", null, U(n.label), 1)
          ])
        ]),
        _: 1
      }, 8, ["model-value", "options"]),
      e.state.kind === "gate" && e.state.release_when ? (u(), g(Z, { key: 0 }, [
        i[33] || (i[33] = d("h4", { class: "work-process-group" }, "Approval", -1)),
        e.state.release_when.approvals ? (u(), j(Md, {
          key: 0,
          "board-id": e.boardId,
          approvals: e.state.release_when.approvals,
          onValidity: i[0] || (i[0] = (n) => a("validity", "approvers", n))
        }, null, 8, ["board-id", "approvals"])) : E("", !0),
        d("details", zd, [
          i[32] || (i[32] = d("summary", null, "Release options", -1)),
          d("div", Bd, [
            d("label", jd, [
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
              onValidity: i[3] || (i[3] = (n, c) => a("validity", c, n))
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
      ], 64)) : E("", !0),
      e.state.kind === "automated" && e.state.run ? (u(), g(Z, { key: 1 }, [
        i[40] || (i[40] = d("h4", { class: "work-process-group" }, "Automation", -1)),
        d("label", qd, [
          i[34] || (i[34] = R("Run label", -1)),
          b(r(ce), {
            modelValue: e.state.run.stage,
            "onUpdate:modelValue": i[6] || (i[6] = (n) => e.state.run.stage = n),
            "aria-label": "Run label",
            required: ""
          }, null, 8, ["modelValue"])
        ]),
        b(id, {
          modelValue: e.state.run.flow_ref,
          "onUpdate:modelValue": i[7] || (i[7] = (n) => e.state.run.flow_ref = n),
          onValidity: i[8] || (i[8] = (n) => a("validity", "flow", n))
        }, null, 8, ["modelValue"]),
        b(Ct, {
          modelValue: e.state.run.timeout,
          "onUpdate:modelValue": i[9] || (i[9] = (n) => e.state.run.timeout = n),
          label: "Attempt timeout",
          onValidity: i[10] || (i[10] = (n, c) => a("validity", c, n))
        }, null, 8, ["modelValue"]),
        i[41] || (i[41] = d("small", { class: "work-muted" }, "Blank uses the board timeout, or one hour.", -1)),
        d("label", Wd, [
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
        d("label", Kd, [
          i[36] || (i[36] = R("When visits are exhausted", -1)),
          b(r(ae), {
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
        d("label", Gd, [
          i[37] || (i[37] = d("span", { class: "work-spacer" }, "Retry if it fails", -1)),
          b(r(Le), {
            "model-value": !!e.state.run.retry,
            "aria-label": "Retry if it fails",
            "onUpdate:modelValue": i[13] || (i[13] = (n) => e.state.run.retry = n ? { max: 1, backoff: "PT1M" } : void 0)
          }, null, 8, ["model-value"])
        ]),
        e.state.run.retry ? (u(), g(Z, { key: 0 }, [
          d("label", Yd, [
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
            onValidity: i[16] || (i[16] = (n, c) => a("validity", c, n))
          }, null, 8, ["modelValue"])
        ], 64)) : E("", !0),
        (u(), g(Z, null, le([{ key: "on_pass", label: "On success" }, { key: "on_cancel", label: "On cancellation" }], (n) => d("label", {
          key: n.key,
          class: "work-stack work-tight"
        }, [
          R(U(n.label), 1),
          b(r(ae), {
            "model-value": e.state.run[n.key],
            "aria-label": n.label,
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            showClear: "",
            options: o.value.map((c) => ({ label: r(je)(c), value: c.id })),
            "onUpdate:modelValue": (c) => e.state.run[n.key] = c || void 0
          }, null, 8, ["model-value", "aria-label", "options", "onUpdate:modelValue"])
        ])), 64)),
        d("label", Hd, [
          i[39] || (i[39] = R("If it fails, go to", -1)),
          b(r(ae), {
            "model-value": e.state.run.on_fail,
            "onUpdate:modelValue": p,
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            showClear: "",
            options: o.value.map((n) => ({
              label: r(je)(n) + " → " + r(ye)(e.process.states.find((c) => c.id === n.to)),
              value: n.id
            }))
          }, null, 8, ["model-value", "options"])
        ])
      ], 64)) : E("", !0),
      e.state.kind === "parallel" && e.state.regions ? (u(), g(Z, { key: 2 }, [
        i[47] || (i[47] = d("h4", { class: "work-process-group" }, "Lanes", -1)),
        (u(!0), g(Z, null, le(e.state.regions, (n, c) => (u(), g("div", {
          key: c,
          class: "work-process-value work-stack work-tight"
        }, [
          d("div", Xd, [
            d("span", null, "Lane " + U(c + 1), 1),
            i[43] || (i[43] = d("span", { class: "work-spacer" }, null, -1)),
            b(r(X), {
              severity: "danger",
              text: "",
              size: "small",
              "aria-label": "Remove lane",
              onClick: (y) => e.state.regions.splice(c, 1)
            }, {
              default: N(() => [
                b(r(_), { icon: "tabler:trash" })
              ]),
              _: 1
            }, 8, ["onClick"])
          ]),
          d("label", Jd, [
            i[44] || (i[44] = R("Starts at", -1)),
            b(r(ae), {
              modelValue: n.initial,
              "onUpdate:modelValue": (y) => n.initial = y,
              appendTo: "self",
              optionLabel: "label",
              optionValue: "value",
              options: e.process.states.filter((y) => y.id !== e.state.id).map((y) => ({ label: r(ye)(y), value: y.id }))
            }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
          ])
        ]))), 128)),
        b(r(X), {
          label: "Add lane",
          severity: "secondary",
          outlined: "",
          size: "small",
          onClick: i[17] || (i[17] = (n) => e.state.regions.push({
            id: r($t)("region", e.state.regions),
            initial: e.process.states.find((c) => c.id !== e.state.id)?.id ?? ""
          }))
        }, {
          icon: N(() => [
            b(r(_), { icon: "tabler:plus" })
          ]),
          _: 1
        }),
        d("label", Zd, [
          i[45] || (i[45] = R("Finish rule", -1)),
          b(r(ae), {
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
        typeof e.state.join == "number" ? (u(), g("label", Qd, [
          i[46] || (i[46] = d("span", { class: "work-spacer" }, "Lanes needed", -1)),
          b(r(Ge), {
            modelValue: e.state.join,
            "onUpdate:modelValue": i[19] || (i[19] = (n) => e.state.join = n),
            min: 1,
            max: e.state.regions.length,
            useGrouping: !1
          }, null, 8, ["modelValue", "max"])
        ])) : E("", !0)
      ], 64)) : E("", !0),
      i[53] || (i[53] = d("h4", { class: "work-process-group" }, "Limit", -1)),
      d("label", _d, [
        i[48] || (i[48] = d("span", { class: "work-spacer" }, "Items allowed here", -1)),
        b(gl, {
          draft: e.draft,
          state: e.state.id,
          label: "Items allowed here"
        }, null, 8, ["draft", "state"])
      ]),
      d("label", eu, [
        i[49] || (i[49] = d("span", { class: "work-spacer" }, [
          R("Refuse moves over the limit"),
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
      !e.state.kind || e.state.kind === "human" ? (u(), j(Ct, {
        key: 3,
        modelValue: e.state.due,
        "onUpdate:modelValue": i[21] || (i[21] = (n) => e.state.due = n),
        label: "Time allowed in this state",
        onValidity: i[22] || (i[22] = (n, c) => a("validity", c, n))
      }, null, 8, ["modelValue"])) : E("", !0),
      i[55] || (i[55] = d("h4", { class: "work-process-group" }, "Assignment and conditions", -1)),
      d("label", tu, [
        i[50] || (i[50] = R("Stage label", -1)),
        b(r(ce), {
          "model-value": e.state.stage,
          "aria-label": "Stage label",
          "onUpdate:modelValue": i[23] || (i[23] = (n) => e.state.stage = n || void 0)
        }, null, 8, ["model-value"])
      ]),
      !e.state.kind || e.state.kind === "human" || e.state.kind === "parallel" ? (u(), g(Z, { key: 4 }, [
        d("label", lu, [
          b(r(Le), {
            "model-value": !!e.state.awaiting,
            "aria-label": "Awaiting people",
            "onUpdate:modelValue": i[24] || (i[24] = (n) => e.state.awaiting = n ? { group: "" } : void 0)
          }, null, 8, ["model-value"]),
          i[51] || (i[51] = R("Awaiting people", -1))
        ]),
        e.state.awaiting ? (u(), j(xd, {
          key: 0,
          modelValue: e.state.awaiting,
          "onUpdate:modelValue": i[25] || (i[25] = (n) => e.state.awaiting = n),
          draft: e.draft,
          "board-id": e.boardId,
          label: "Awaiting",
          onValidity: i[26] || (i[26] = (n) => a("validity", "awaiting", n))
        }, null, 8, ["modelValue", "draft", "board-id"])) : E("", !0)
      ], 64)) : E("", !0),
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
      b(kd, {
        state: e.state,
        draft: e.draft,
        onValidity: i[30] || (i[30] = (n, c) => a("validity", "timer-" + n, c))
      }, null, 8, ["state", "draft"])
    ]));
  }
}), ou = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, iu = {
  class: "work-process-controls",
  role: "toolbar",
  "aria-label": "Process tools"
}, nu = {
  key: 1,
  class: "work-process-title"
}, su = { class: "work-muted" }, ru = {
  key: 2,
  class: "work-map-zoom",
  role: "group",
  "aria-label": "Map zoom"
}, du = ["aria-label"], uu = { class: "work-row" }, cu = { class: "work-process-meaning" }, vu = { class: "work-stack work-tight" }, mu = { class: "work-process-inspector-foot" }, fu = { class: "work-row" }, pu = { class: "work-process-meaning" }, bu = { class: "work-stack work-tight" }, hu = { class: "work-process-inspector-foot" }, yu = {
  key: 3,
  class: "work-row"
}, gu = { class: "work-stack work-tight" }, ku = { class: "work-dialog-actions" }, wu = /* @__PURE__ */ ve({
  __name: "ProcessEditor",
  props: {
    draft: {},
    guardRemoval: { type: Function },
    issues: {},
    boardId: {}
  },
  emits: ["validity"],
  setup(e, { emit: l }) {
    const t = e, a = l, o = H(() => t.draft.processes ?? []), s = B(!1), v = B(""), p = B(""), f = B(""), i = B("Map"), n = B(""), c = B(), y = B(), m = B(), w = B(), C = B(!1);
    let D;
    async function P() {
      C.value = !0, await ra(), w.value?.querySelector('[aria-label="State name"]')?.focus();
    }
    const z = H(() => o.value.find((K) => K.id === p.value) ?? o.value[0]);
    function O() {
      C.value = !1, c.value = void 0, y.value = void 0, f.value = "", D = void 0;
    }
    async function T() {
      const K = D;
      O(), await ra(), K?.isConnected && K.focus();
    }
    function $(K, F) {
      D = F, C.value = !1, c.value = K, y.value = void 0, n.value = "", f.value = "";
    }
    function V(K, F) {
      D = F, C.value = !1, y.value = K, c.value = void 0, f.value = "";
    }
    Ce(z, O);
    function S(K) {
      K === "__new" ? s.value = !0 : p.value = K;
    }
    function oe() {
      const K = v.value.trim();
      if (!K) return;
      const F = K.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "") || "process", L = (/^[a-z]/.test(F) ? F : "process_" + F).slice(0, 40), Q = o.value.some((ke) => ke.id === L) ? $t(L, o.value) : L;
      (t.draft.processes ??= []).push({ id: Q, name: K, initial: "todo", states: [{ id: "todo", name: "To do", category: "unstarted" }], transitions: [] }), p.value = Q, v.value = "", s.value = !1;
    }
    async function M(K, F) {
      const L = { id: $t("state", K.states), name: "New state", category: "started" }, Q = Bl(K), ke = Q.at(-1), pe = c.value ?? (ke?.category === "completed" ? Q.at(-2) : ke), ge = pe && (K.transitions?.find((h) => h.default && h.from !== "any" && h.from.includes(pe.id)) ?? K.transitions?.find((h) => h.from !== "any" && h.from.includes(pe.id) && K.states.findIndex((x) => x.id === h.to) > K.states.indexOf(pe)));
      if (K.states.splice(pe ? K.states.indexOf(pe) + 1 : K.states.length, 0, L), pe && pe.category !== "completed" && pe.category !== "canceled")
        if (ge) {
          const h = ge.to;
          ge.to = L.id, (K.transitions ??= []).push({ id: $t("transition", K.transitions ?? []), name: "Continue", from: [L.id], to: h, ...ge.auto && ge.default ? { auto: !0, default: !0 } : {} });
        } else (K.transitions ??= []).push({ id: $t("transition", K.transitions ?? []), name: "Continue", from: [pe.id], to: L.id });
      $(L, F), await P();
    }
    function q(K, F, L = D) {
      const Q = z.value;
      if (!Q || !F || K === F) return;
      let ke = `to_${F}`, pe = 2;
      for (; Q.transitions?.some((h) => h.id === ke); ) ke = `to_${F}_${pe++}`;
      const ge = { id: ke, name: `To ${ye(Q.states.find((h) => h.id === F)).toLowerCase()}`, from: [K], to: F };
      (Q.transitions ??= []).push(ge), V(ge, L);
    }
    function A(K, F) {
      const L = { id: $t("transition", K.transitions ?? []), name: "To " + ye(K.states.at(-1)), from: [K.initial], to: K.states.at(-1)?.id ?? K.initial };
      (K.transitions ??= []).push(L), V(L, F);
    }
    function ie(K, F) {
      const L = To(K, F);
      if (L.length) {
        f.value = `Used by ${L.join(", ")}. Update those references first.`;
        return;
      }
      K.transitions?.splice(K.transitions.indexOf(F), 1), O();
    }
    function I(K, F) {
      const L = Eo(K, F);
      if (L.length) {
        f.value = `${ye(F)} is used by ${L.join(", ")}. Update these references first.`;
        return;
      }
      K.states.splice(K.states.indexOf(F), 1), O();
    }
    async function ne(K) {
      const F = t.draft.item_types?.filter((Q) => Q.process === K.id).map((Q) => Q.title || "Untitled item type") ?? [];
      if (F.length) {
        f.value = `Used by ${F.join(", ")}. Choose a different process for those item types first.`;
        return;
      }
      const L = await t.guardRemoval?.("processes", K.id);
      if (L) {
        f.value = L;
        return;
      }
      _t(t.draft, "processes", K.id), p.value = "", O();
    }
    return (K, F) => (u(), g("section", {
      class: "work-process-editor work-stack",
      "aria-label": "Process editor",
      onKeydown: Ae(T, ["esc"])
    }, [
      f.value ? (u(), g("p", ou, U(f.value), 1)) : E("", !0),
      (u(!0), g(Z, null, le(e.issues?.filter((L) => L.code === "process " + z.value?.id) ?? [], (L) => (u(), g("p", {
        key: L.what + L.detail,
        class: "work-error work-small",
        role: "alert"
      }, U(r(wl)(L)) + " · " + U(L.what), 1))), 128)),
      z.value ? (u(), g("div", {
        key: 1,
        class: pt(["work-process-builder", { "work-process-inspecting": c.value || y.value }])
      }, [
        d("div", iu, [
          o.value.length > 1 ? (u(), j(r(ae), {
            key: 0,
            "model-value": z.value.id,
            "aria-label": "Process",
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            options: [
              ...o.value.map((L) => ({ label: L.name || "Untitled process", value: L.id })),
              { label: "New process…", value: "__new" }
            ],
            "onUpdate:modelValue": S
          }, null, 8, ["model-value", "options"])) : (u(), g("span", nu, U(z.value.name || "Process"), 1)),
          b(r(X), {
            label: "Add state",
            severity: "secondary",
            outlined: "",
            size: "small",
            onClick: F[0] || (F[0] = (L) => M(z.value, L.currentTarget))
          }, {
            icon: N(() => [
              b(r(_), { icon: "tabler:plus" })
            ]),
            _: 1
          }),
          b(r(ae), {
            modelValue: z.value.initial,
            "onUpdate:modelValue": F[1] || (F[1] = (L) => z.value.initial = L),
            "aria-label": "Starts in " + r(ye)(z.value.states.find((L) => L.id === z.value.initial)),
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            options: z.value.states.map((L) => ({ label: r(ye)(L), value: L.id }))
          }, {
            value: N(() => [
              d("span", su, "Starts in " + U(r(ye)(z.value.states.find((L) => L.id === z.value.initial))), 1)
            ]),
            _: 1
          }, 8, ["modelValue", "aria-label", "options"]),
          F[17] || (F[17] = d("span", { class: "work-spacer" }, null, -1)),
          i.value === "Map" ? (u(), g("div", ru, [
            b(r(X), {
              label: "Fit",
              title: "Fit to width and show the full process",
              text: "",
              severity: "secondary",
              size: "small",
              onClick: F[2] || (F[2] = (L) => m.value?.fit())
            }, {
              icon: N(() => [
                b(r(_), { icon: "tabler:arrows-maximize" })
              ]),
              _: 1
            }),
            i.value === "Map" ? (u(), j(r(X), {
              key: 0,
              "aria-label": "Zoom out",
              title: "Zoom out",
              text: "",
              severity: "secondary",
              size: "small",
              onClick: F[3] || (F[3] = (L) => m.value?.zoomOut())
            }, {
              default: N(() => [
                b(r(_), { icon: "tabler:minus" })
              ]),
              _: 1
            })) : E("", !0),
            i.value === "Map" ? (u(), j(r(X), {
              key: 1,
              "aria-label": "Zoom in",
              title: "Zoom in",
              text: "",
              severity: "secondary",
              size: "small",
              onClick: F[4] || (F[4] = (L) => m.value?.zoomIn())
            }, {
              default: N(() => [
                b(r(_), { icon: "tabler:plus" })
              ]),
              _: 1
            })) : E("", !0)
          ])) : E("", !0),
          b(r(Ql), {
            modelValue: i.value,
            "onUpdate:modelValue": F[5] || (F[5] = (L) => i.value = L),
            options: ["Map", "List"],
            "allow-empty": !1,
            "aria-label": "Process layout"
          }, null, 8, ["modelValue"]),
          o.value.length === 1 ? (u(), j(r(X), {
            key: 3,
            label: "New process",
            "aria-label": "New process",
            text: "",
            severity: "secondary",
            size: "small",
            onClick: F[6] || (F[6] = (L) => s.value = !0)
          }, {
            icon: N(() => [
              b(r(_), { icon: "tabler:plus" })
            ]),
            _: 1
          })) : E("", !0)
        ]),
        i.value === "Map" ? (u(), j(Vr, {
          key: 0,
          ref_key: "graph",
          ref: m,
          process: z.value,
          draft: e.draft,
          "selected-state": c.value,
          "selected-transition": y.value,
          onState: $,
          onTransition: V,
          onConnect: q,
          onClear: T
        }, null, 8, ["process", "draft", "selected-state", "selected-transition"])) : (u(), j(Br, {
          key: 1,
          process: z.value,
          "selected-state": c.value,
          "selected-transition": y.value,
          onState: $,
          onTransition: V,
          onRemoveState: F[7] || (F[7] = (L) => I(z.value, L)),
          onRemoveTransition: F[8] || (F[8] = (L) => ie(z.value, L)),
          onAddTransition: F[9] || (F[9] = (L) => A(z.value, L))
        }, null, 8, ["process", "selected-state", "selected-transition"])),
        c.value || y.value ? (u(), g("aside", {
          key: 2,
          ref_key: "inspector",
          ref: w,
          class: "work-process-sideform",
          "aria-label": c.value ? "State inspector" : "Transition inspector"
        }, [
          (u(!0), g(Z, null, le(c.value ? [c.value] : [], (L) => (u(), g(Z, {
            key: L.id
          }, [
            d("header", uu, [
              C.value ? (u(), j(r(ce), {
                key: 1,
                modelValue: L.name,
                "onUpdate:modelValue": (Q) => L.name = Q,
                class: "work-process-name",
                "aria-label": "State name",
                onBlur: F[10] || (F[10] = (Q) => C.value = !1)
              }, null, 8, ["modelValue", "onUpdate:modelValue"])) : (u(), j(Jl, {
                key: 0,
                class: "work-process-state-title",
                "aria-label": "Rename state",
                onActivate: P
              }, {
                default: N(() => [
                  d("span", null, U(r(ye)(L)), 1)
                ]),
                _: 2
              }, 1024)),
              b(r(X), {
                severity: "secondary",
                text: "",
                size: "small",
                "aria-label": "Close state editor",
                onClick: T
              }, {
                default: N(() => [
                  b(r(_), { icon: "tabler:x" })
                ]),
                _: 1
              })
            ]),
            d("p", cu, U(r(So)(L, e.draft)), 1),
            b(au, {
              state: L,
              process: z.value,
              draft: e.draft,
              "board-id": e.boardId,
              onValidity: (Q, ke) => a("validity", Q.includes("duration:") ? Q : z.value.id + ":" + L.id + ":" + Q, ke)
            }, null, 8, ["state", "process", "draft", "board-id", "onValidity"]),
            d("label", vu, [
              F[18] || (F[18] = R("Phase", -1)),
              b(r(ae), {
                modelValue: L.category,
                "onUpdate:modelValue": (Q) => L.category = Q,
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                options: ["triage", "backlog", ...r(Ma)].map((Q) => ({ label: r(Zl)(Q), value: Q }))
              }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
            ]),
            F[19] || (F[19] = d("h4", { class: "work-process-group" }, "Next stop", -1)),
            b(r(ae), {
              modelValue: n.value,
              "onUpdate:modelValue": F[11] || (F[11] = (Q) => n.value = Q),
              "aria-label": "Add transition to…",
              placeholder: "Add transition to…",
              appendTo: "self",
              optionLabel: "label",
              optionValue: "value",
              options: z.value.states.filter((Q) => Q !== L).map((Q) => ({ label: r(ye)(Q), value: Q.id }))
            }, null, 8, ["modelValue", "options"]),
            b(r(X), {
              label: "Add transition",
              severity: "secondary",
              outlined: "",
              size: "small",
              disabled: !n.value,
              onClick: (Q) => q(L.id, n.value)
            }, {
              icon: N(() => [
                b(r(_), { icon: "tabler:arrow-right" })
              ]),
              _: 1
            }, 8, ["disabled", "onClick"]),
            d("footer", mu, [
              b(r(X), {
                label: "Remove state",
                severity: "danger",
                text: "",
                size: "small",
                onClick: (Q) => I(z.value, L)
              }, {
                icon: N(() => [
                  b(r(_), { icon: "tabler:trash" })
                ]),
                _: 1
              }, 8, ["onClick"])
            ])
          ], 64))), 128)),
          (u(!0), g(Z, null, le(y.value ? [y.value] : [], (L) => (u(), g(Z, {
            key: L.id
          }, [
            d("header", fu, [
              F[20] || (F[20] = d("h3", null, "Transition", -1)),
              F[21] || (F[21] = d("span", { class: "work-spacer" }, null, -1)),
              b(r(X), {
                severity: "secondary",
                text: "",
                size: "small",
                "aria-label": "Close transition editor",
                onClick: T
              }, {
                default: N(() => [
                  b(r(_), { icon: "tabler:x" })
                ]),
                _: 1
              })
            ]),
            d("p", pu, U(L.from === "any" ? "Any state" : L.from.map((Q) => r(ye)(z.value.states.find((ke) => ke.id === Q))).join(", ")) + " → " + U(r(ye)(z.value.states.find((Q) => Q.id === L.to))), 1),
            d("label", bu, [
              F[22] || (F[22] = R("Name", -1)),
              b(r(ce), {
                modelValue: L.name,
                "onUpdate:modelValue": (Q) => L.name = Q,
                placeholder: r(je)(L),
                "aria-label": "Transition name"
              }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder"])
            ]),
            b(Zr, {
              transition: L,
              process: z.value,
              draft: e.draft,
              "board-id": e.boardId,
              onValidity: (Q, ke) => a("validity", z.value.id + ":transition-" + L.id + ":" + Q, ke)
            }, null, 8, ["transition", "process", "draft", "board-id", "onValidity"]),
            d("footer", hu, [
              b(r(X), {
                label: "Remove transition",
                severity: "danger",
                text: "",
                size: "small",
                onClick: (Q) => ie(z.value, L)
              }, {
                icon: N(() => [
                  b(r(_), { icon: "tabler:trash" })
                ]),
                _: 1
              }, 8, ["onClick"])
            ])
          ], 64))), 128))
        ], 8, du)) : E("", !0)
      ], 2)) : (u(), j(r(X), {
        key: 2,
        label: "New process",
        severity: "secondary",
        outlined: "",
        onClick: F[12] || (F[12] = (L) => s.value = !0)
      }, {
        icon: N(() => [
          b(r(_), { icon: "tabler:plus" })
        ]),
        _: 1
      })),
      i.value === "List" && z.value ? (u(), g("div", yu, [
        b(r(X), {
          label: "Remove process",
          severity: "danger",
          text: "",
          size: "small",
          onClick: F[13] || (F[13] = (L) => ne(z.value))
        }, {
          icon: N(() => [
            b(r(_), { icon: "tabler:trash" })
          ]),
          _: 1
        })
      ])) : E("", !0),
      b(za, {
        visible: s.value,
        label: "New process",
        onClose: F[16] || (F[16] = (L) => s.value = !1)
      }, {
        default: N(() => [
          d("form", {
            class: "work-dialog-box",
            "aria-label": "New process",
            onSubmit: he(oe, ["stop", "prevent"])
          }, [
            F[24] || (F[24] = d("h2", null, "New process", -1)),
            d("label", gu, [
              F[23] || (F[23] = R("Name", -1)),
              b(r(ce), {
                modelValue: v.value,
                "onUpdate:modelValue": F[14] || (F[14] = (L) => v.value = L),
                "aria-label": "New process name",
                autofocus: "",
                required: ""
              }, null, 8, ["modelValue"])
            ]),
            d("div", ku, [
              b(r(X), {
                label: "Cancel",
                severity: "secondary",
                outlined: "",
                onClick: F[15] || (F[15] = (L) => s.value = !1)
              }),
              b(r(X), {
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
}), Vu = ["inert"], $u = { class: "work-stack work-tight" }, xu = /* @__PURE__ */ ve({
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
    return (o, s) => (u(), g("section", {
      class: "work-stack work-settings-card",
      "aria-label": "Existing items",
      inert: e.disabled || void 0
    }, [
      s[0] || (s[0] = d("h3", null, "Existing items", -1)),
      s[1] || (s[1] = d("p", { class: "work-muted work-small" }, " Choose how existing items follow these changes, then review the impact before applying. ", -1)),
      (u(!0), g(Z, null, le(e.draft.processes ?? [], (v) => (u(), g("div", {
        key: v.id,
        class: "work-stack"
      }, [
        d("label", $u, [
          R(U(v.name || "Untitled process"), 1),
          b(r(ae), {
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
            "onUpdate:modelValue": (p) => v.migration = p
          }, null, 8, ["disabled", "model-value", "aria-label", "onUpdate:modelValue"])
        ]),
        r(ca)(v) !== "pin" ? (u(!0), g(Z, { key: 0 }, le(a(v), (p) => (u(), g("label", {
          key: p.id,
          class: "work-stack work-tight"
        }, [
          R("Move items from " + U(r(ye)(p)) + " to", 1),
          b(r(ae), {
            disabled: e.disabled,
            "model-value": v.map?.[p.id],
            placeholder: "Choose a surviving state",
            appendTo: "self",
            showClear: "",
            optionLabel: "label",
            optionValue: "value",
            options: v.states.map((f) => ({ label: r(ye)(f), value: f.id })),
            "onUpdate:modelValue": (f) => t(v, p.id, f)
          }, null, 8, ["disabled", "model-value", "options", "onUpdate:modelValue"])
        ]))), 128)) : E("", !0)
      ]))), 128))
    ], 8, Vu));
  }
}), Cu = {
  class: "work-stack",
  "aria-label": "Policy editor"
}, Su = { class: "work-settings-list" }, Tu = { class: "work-settings-row" }, Eu = { class: "work-row-control" }, Uu = { class: "work-settings-list work-wip-container" }, Du = { class: "work-wip-table" }, Iu = { class: "work-mono" }, Au = { class: "work-row-main" }, Pu = { class: "work-row" }, Ru = { class: "work-row" }, Ou = { class: "work-settings-list" }, Nu = { class: "work-settings-row" }, Mu = { class: "work-row-control" }, Fu = { class: "work-row-main" }, Lu = { class: "work-row-title" }, zu = { class: "work-muted work-small" }, Bu = { class: "work-row-control" }, ju = /* @__PURE__ */ ve({
  __name: "PolicyEditor",
  props: {
    draft: {}
  },
  emits: ["validity"],
  setup(e, { emit: l }) {
    const t = e, a = l, o = H(() => t.draft.policy ?? {}), s = H(() => [...new Set(t.draft.processes?.flatMap((n) => n.states.map((c) => c.id)) ?? [])]), v = ["audit_days", "trash_days", "tombstone_days", "interval_days"], p = { audit_days: "Zero selects 365 days.", interval_days: "Zero selects 365 days.", trash_days: "Zero allows immediate cleanup of trashed items.", tombstone_days: "Zero allows immediate cleanup of deletion records." };
    function f(n, c) {
      c === void 0 ? t.draft.policy && delete t.draft.policy[n] : (t.draft.policy ??= {})[n] = c;
    }
    function i(n, c) {
      f(n, c ?? void 0);
    }
    return (n, c) => (u(), g("section", Cu, [
      c[13] || (c[13] = d("header", { class: "work-section-heading" }, [
        d("div", null, [
          d("h2", null, "Policy"),
          d("p", { class: "work-muted work-small" }, "Set capacity and how long the board keeps its history.")
        ])
      ], -1)),
      c[14] || (c[14] = d("h3", { class: "work-group-title" }, "Item keys", -1)),
      d("div", Su, [
        d("div", Tu, [
          c[7] || (c[7] = d("div", { class: "work-row-main" }, [
            d("strong", { class: "work-row-title" }, "Item key prefix"),
            d("p", { class: "work-muted work-small" }, "Work reviews and claims prefix changes when you apply the schema.")
          ], -1)),
          d("div", Eu, [
            b(r(ce), {
              modelValue: e.draft.key_prefix,
              "onUpdate:modelValue": c[0] || (c[0] = (y) => e.draft.key_prefix = y),
              "aria-label": "Item key prefix",
              required: "",
              pattern: "[A-Z][A-Z0-9]{1,9}",
              maxlength: "10"
            }, null, 8, ["modelValue"])
          ])
        ])
      ]),
      c[15] || (c[15] = d("h3", { class: "work-group-title" }, "Work in progress", -1)),
      c[16] || (c[16] = d("p", { class: "work-muted work-small" }, "A blank limit sets no restriction. A hard limit rejects transitions over capacity.", -1)),
      d("div", Uu, [
        d("table", Du, [
          c[8] || (c[8] = d("thead", null, [
            d("tr", null, [
              d("th", null, "State"),
              d("th", null, "Limit"),
              d("th", null, "Hard limit")
            ])
          ], -1)),
          d("tbody", null, [
            (u(!0), g(Z, null, le(s.value, (y) => (u(), g("tr", { key: y }, [
              d("td", null, [
                d("strong", null, U(e.draft.processes?.flatMap((m) => m.states).find((m) => m.id === y)?.name || r(Ve)(y)), 1),
                d("code", Iu, U(y), 1)
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
        (u(!0), g(Z, null, le(Object.keys(o.value.wip ?? {}).filter((y) => !s.value.includes(y)), (y) => (u(), g("div", {
          key: y,
          class: "work-settings-row"
        }, [
          d("div", Au, [
            R(U(r(Ve)(y)) + " ", 1),
            c[9] || (c[9] = d("span", { class: "work-muted" }, "Removed state", -1))
          ]),
          b(r(X), {
            label: "Remove stale limit",
            severity: "secondary",
            outlined: "",
            onClick: (m) => delete o.value.wip[y]
          }, {
            icon: N(() => [
              b(r(_), { icon: "tabler:trash" })
            ]),
            _: 1
          }, 8, ["onClick"])
        ]))), 128))
      ]),
      c[17] || (c[17] = d("h3", { class: "work-group-title" }, "Automated stages", -1)),
      b(Ct, {
        "model-value": o.value.stage_timeout,
        "onUpdate:modelValue": c[1] || (c[1] = (y) => f("stage_timeout", y)),
        label: "Default attempt timeout",
        onValidity: c[2] || (c[2] = (y, m) => a("validity", m, y))
      }, null, 8, ["model-value"]),
      c[18] || (c[18] = d("p", { class: "work-muted work-small" }, "Blank uses one hour. Each retry gets a new deadline.", -1)),
      d("label", Pu, [
        c[10] || (c[10] = d("span", { class: "work-spacer" }, "Default maximum visits", -1)),
        b(r(Ge), {
          "model-value": o.value.stage_max_visits ?? null,
          "aria-label": "Default maximum visits",
          min: 1,
          useGrouping: !1,
          placeholder: "5",
          "onUpdate:modelValue": c[3] || (c[3] = (y) => f("stage_max_visits", y ?? void 0))
        }, null, 8, ["model-value"])
      ]),
      c[19] || (c[19] = d("h3", { class: "work-group-title" }, "Comments", -1)),
      d("label", Ru, [
        c[11] || (c[11] = d("span", { class: "work-spacer" }, "Comments per item", -1)),
        b(r(Ge), {
          "model-value": o.value.comments_per_item ?? null,
          "aria-label": "Comments per item",
          min: 1,
          max: 1e5,
          useGrouping: !1,
          placeholder: "Application default",
          "onUpdate:modelValue": c[4] || (c[4] = (y) => f("comments_per_item", y ?? void 0))
        }, null, 8, ["model-value"])
      ]),
      c[20] || (c[20] = d("p", { class: "work-muted work-small" }, "Blank follows the application default.", -1)),
      c[21] || (c[21] = d("h3", { class: "work-group-title" }, "Saved query filters", -1)),
      c[22] || (c[22] = d("p", { class: "work-muted work-small" }, "Choose which installed query filters this board can use.", -1)),
      b(na, {
        schema: { type: "object", properties: { scopes: { type: "array", title: "Query filter identifiers", items: { type: "string" } } } },
        "model-value": { scopes: e.draft.scopes },
        "onUpdate:modelValue": c[5] || (c[5] = (y) => e.draft.scopes = y.scopes)
      }, null, 8, ["model-value"]),
      c[23] || (c[23] = d("h3", { class: "work-group-title" }, "Audit and retention", -1)),
      d("div", Ou, [
        d("div", Nu, [
          c[12] || (c[12] = d("div", { class: "work-row-main" }, [
            d("strong", { class: "work-row-title" }, "Audit trail"),
            d("p", { class: "work-muted work-small" }, "Choose which item changes appear in history.")
          ], -1)),
          d("div", Mu, [
            b(r(ae), {
              "model-value": o.value.audit ?? "",
              "aria-label": "Audit trail",
              placeholder: "Installation default",
              appendTo: "self",
              optionLabel: "label",
              optionValue: "value",
              options: [{ label: "Installation default", value: "" }, { label: "Off", value: "off" }, { label: "Fields", value: "fields" }],
              "onUpdate:modelValue": c[6] || (c[6] = (y) => f("audit", y || void 0))
            }, null, 8, ["model-value"])
          ])
        ]),
        (u(), g(Z, null, le(v, (y) => d("div", {
          key: y,
          class: "work-settings-row"
        }, [
          d("div", Fu, [
            d("strong", Lu, U(r(Ve)(y)), 1),
            d("p", zu, "Blank follows the application default. " + U(p[y]), 1)
          ]),
          d("label", Bu, [
            b(r(Ge), {
              min: 0,
              "aria-label": r(Ve)(y),
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
}), qu = {
  class: "work-stack",
  "aria-label": "Relation types editor"
}, Wu = { class: "work-section-heading" }, Ku = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, Gu = { class: "work-definition-meta work-muted work-small" }, Yu = { class: "work-settings-grid" }, Hu = { class: "work-stack work-tight" }, Xu = { class: "work-stack work-tight" }, Ju = { class: "work-stack work-tight" }, Zu = { class: "work-stack work-tight" }, Qu = { class: "work-row" }, _u = { class: "work-relation-preview work-small" }, ec = { class: "work-muted" }, tc = {
  key: 0,
  class: "kx-empty"
}, lc = { class: "work-row work-add-definition" }, ac = { class: "work-stack work-tight" }, oc = /* @__PURE__ */ ve({
  __name: "RelationsEditor",
  props: {
    draft: {},
    guardRemoval: { type: Function }
  },
  setup(e) {
    const l = e, t = H(() => l.draft.relation_types ?? []), a = B(""), o = B(""), s = B(!1), v = H(() => /^[a-z][a-z0-9_]*$/.test(a.value) && !t.value.some((i) => i.id === a.value));
    function p() {
      v.value && ((l.draft.relation_types ??= []).push({ id: a.value, outward: Ve(a.value).toLowerCase(), inward: Ve(a.value).toLowerCase(), cardinality: "many" }), a.value = "");
    }
    async function f(i) {
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
    return (i, n) => (u(), g("section", qu, [
      d("header", Wu, [
        n[1] || (n[1] = d("div", null, [
          d("h2", null, "Relation types"),
          d("p", { class: "work-muted work-small" }, "Give each direction a clear label. A used relation keeps its identity and shape.")
        ], -1)),
        b(r(Re), {
          class: "kx-tag-sm",
          severity: "secondary"
        }, {
          default: N(() => [
            R(U(t.value.length) + " " + U(t.value.length === 1 ? "relation" : "relations"), 1)
          ]),
          _: 1
        })
      ]),
      o.value ? (u(), g("p", Ku, U(o.value), 1)) : E("", !0),
      b($l, {
        columns: "relations",
        count: t.value.length
      }, {
        default: N(() => [
          (u(!0), g(Z, null, le(t.value, (c, y) => (u(), j(Vl, {
            title: r(Ve)(c.id),
            code: c.id,
            kind: c.symmetric ? "Same both ways" : "Different each way",
            key: y,
            class: "work-stack"
          }, {
            usage: N(() => [
              d("span", Gu, U(c.outward || "Related work") + " · " + U(c.inward || "Reverse relation"), 1)
            ]),
            actions: N(() => [
              b(r(X), {
                severity: "secondary",
                text: "",
                disabled: s.value,
                onClick: (m) => f(c.id),
                "aria-label": "Remove relation",
                size: "small"
              }, {
                default: N(() => [
                  b(r(_), {
                    icon: "tabler:trash",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["disabled", "onClick"])
            ]),
            default: N(() => [
              d("div", Yu, [
                d("label", Hu, [
                  n[2] || (n[2] = R("Identifier ", -1)),
                  b(r(ce), {
                    modelValue: c.id,
                    "onUpdate:modelValue": (m) => c.id = m,
                    required: "",
                    pattern: "[a-z][a-z0-9_]*",
                    "aria-label": "Relation ID"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                d("label", Xu, [
                  n[3] || (n[3] = R("Outward label ", -1)),
                  b(r(ce), {
                    modelValue: c.outward,
                    "onUpdate:modelValue": (m) => c.outward = m,
                    "aria-label": "Outward label"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                d("label", Ju, [
                  n[4] || (n[4] = R("Inward label ", -1)),
                  b(r(ce), {
                    modelValue: c.inward,
                    "onUpdate:modelValue": (m) => c.inward = m,
                    "aria-label": "Inward label"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                d("label", Zu, [
                  n[5] || (n[5] = R("Links allowed ", -1)),
                  b(r(ae), {
                    "model-value": c.cardinality ?? "many",
                    "onUpdate:modelValue": (m) => c.cardinality = m,
                    "aria-label": "Links allowed",
                    appendTo: "self",
                    optionLabel: "label",
                    optionValue: "value",
                    optionDisabled: "disabled",
                    options: [{ label: "One link", value: "one", disabled: !1 }, { label: "Many links", value: "many", disabled: !1 }]
                  }, null, 8, ["model-value", "onUpdate:modelValue"])
                ]),
                d("label", Qu, [
                  b(r(Mt), {
                    modelValue: c.symmetric,
                    "onUpdate:modelValue": (m) => c.symmetric = m,
                    "aria-label": "Same meaning in both directions",
                    binary: ""
                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                  n[6] || (n[6] = R("Same meaning in both directions ", -1))
                ])
              ]),
              d("p", _u, [
                n[7] || (n[7] = d("strong", null, "This item", -1)),
                R(" " + U(c.outward || "relates to") + " ", 1),
                n[8] || (n[8] = d("strong", null, "another item", -1)),
                d("span", ec, " · reverse: " + U(c.symmetric ? c.outward : c.inward), 1)
              ])
            ]),
            _: 2
          }, 1032, ["title", "code", "kind"]))), 128)),
          t.value.length ? E("", !0) : (u(), g("p", tc, "No relation types yet. Add one to link related work.")),
          d("div", lc, [
            d("label", ac, [
              n[9] || (n[9] = R("New relation ID ", -1)),
              b(r(ce), {
                modelValue: a.value,
                "onUpdate:modelValue": n[0] || (n[0] = (c) => a.value = c),
                placeholder: "related_to",
                onKeydown: Ae(he(p, ["prevent"]), ["enter"])
              }, null, 8, ["modelValue", "onKeydown"])
            ]),
            b(r(X), {
              label: "Add relation",
              severity: "secondary",
              disabled: !v.value,
              onClick: p,
              outlined: ""
            }, {
              icon: N(() => [
                b(r(_), {
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
function ic(e, l) {
  return e.parked ? "Stopped: " + (typeof e.error == "string" ? e.error : e.error?.message ?? "Projection is parked") : e.bootstrapping ? "Initializing" : e.last_seq >= l ? "Up to date" : "Catching up";
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
    const t = e, a = l, o = B({}), s = B(""), v = B(""), p = B(""), f = B(/* @__PURE__ */ new Set()), i = {};
    function n(O) {
      return t.schema.plugins?.find((T) => T.plugin === O);
    }
    function c(O) {
      return n(O)?.active === !0;
    }
    function y(O) {
      return n(O)?.lifecycle.state === "ready";
    }
    function m(O) {
      return t.draft.plugins?.some((T) => T.use === O) === !0;
    }
    function w(O, T) {
      const $ = t.draft.plugins ?? [];
      T && !m(O) && (t.draft.plugins = [...$, { use: O }]), T || (t.draft.plugins = $.filter((V) => V.use !== O), delete t.configs[O], f.value.delete(O), a("validity", O, !0));
    }
    function C(O) {
      return c(O) ? o.value[O] ?? n(O)?.config ?? i : t.configs[O] ?? i;
    }
    function D(O, T) {
      c(O) ? o.value[O] = T : t.configs[O] = T;
    }
    function P(O, T) {
      T ? f.value.delete(O) : f.value.add(O), c(O) || a("validity", O, T);
    }
    async function z(O) {
      if (!(s.value || f.value.has(O))) {
        s.value = O, v.value = "", p.value = "";
        try {
          await wt.configure(t.boardId, O, C(O)), delete o.value[O], p.value = "Plugin configuration saved.", a("configured");
        } catch (T) {
          v.value = T instanceof Error ? T.message : "Could not configure plugin.";
        } finally {
          s.value = "";
        }
      }
    }
    return (O, T) => (u(), g("section", nc, [
      d("header", sc, [
        T[1] || (T[1] = d("div", null, [
          d("h2", null, "Plugins"),
          d("p", { class: "work-muted work-small" }, "Add capabilities from installed modules.")
        ], -1)),
        b(r(X), {
          label: "Refresh status",
          severity: "secondary",
          outlined: "",
          disabled: !!s.value || e.disabled,
          onClick: T[0] || (T[0] = ($) => a("refresh"))
        }, {
          icon: N(() => [
            b(r(_), {
              icon: "tabler:refresh",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        }, 8, ["disabled"])
      ]),
      T[5] || (T[5] = d("p", { class: "work-muted work-small" }, "Activation joins the schema draft and requires review. Active plugin configuration saves separately. Status reflects the last read; refresh to check progress.", -1)),
      e.options.length ? E("", !0) : (u(), g("p", rc, "No installed plugins are visible to you.")),
      v.value ? (u(), g("div", dc, U(v.value), 1)) : E("", !0),
      p.value ? (u(), g("p", uc, U(p.value), 1)) : E("", !0),
      b($l, {
        columns: "plugins",
        count: e.options.length
      }, {
        default: N(() => [
          (u(!0), g(Z, null, le(e.options, ($) => (u(), j(Vl, {
            key: $.plugin,
            title: $.title || "Unavailable capability",
            description: $.description,
            kind: c($.plugin) ? "Active" : m($.plugin) ? "Pending review" : "Inactive",
            class: "work-stack"
          }, {
            actions: N(() => [
              T[3] || (T[3] = d("span", { class: "work-spacer" }, null, -1)),
              d("label", cc, [
                b(r(Le), {
                  "model-value": m($.plugin),
                  disabled: !!s.value || e.disabled || e.activationLocked || !!$.problem,
                  "onUpdate:modelValue": (V) => w($.plugin, V)
                }, null, 8, ["model-value", "disabled", "onUpdate:modelValue"]),
                T[2] || (T[2] = R("Activate on this board", -1))
              ])
            ]),
            default: N(() => [
              $.requires.length ? (u(), g("p", vc, "Requires " + U($.requires.map((V) => e.options.find((S) => S.plugin === V)?.title || "Another capability").join(", ")), 1)) : E("", !0),
              $.problem ? (u(), g("p", mc, U($.problem.message), 1)) : E("", !0),
              n($.plugin)?.outdated ? (u(), g("p", fc, "The stored declaration differs from the installed plugin. Review activation to update it.")) : E("", !0),
              c($.plugin) ? (u(), g("div", pc, [
                d("p", null, U(y($.plugin) ? "Attachment configured" : n($.plugin)?.lifecycle.state === "failed" ? "Configuration failed" : "Configuring attachment"), 1),
                n($.plugin)?.lifecycle.error ? (u(), g("p", bc, U(n($.plugin)?.lifecycle.error?.message), 1)) : E("", !0),
                (u(!0), g(Z, null, le(n($.plugin)?.projections, (V, S) => (u(), g("div", { key: S }, [
                  d("p", null, U(r(ic)(V, e.schema.as_of)), 1),
                  d("p", hc, "Position " + U(V.last_seq) + " · Board head " + U(e.schema.as_of), 1)
                ]))), 128))
              ])) : E("", !0),
              !$.problem && (m($.plugin) || c($.plugin)) ? (u(), g(Z, { key: 4 }, [
                b(na, {
                  disabled: !!s.value || e.disabled,
                  schema: $.config_schema,
                  "model-value": C($.plugin),
                  "onUpdate:modelValue": (V) => D($.plugin, V),
                  onValidity: (V) => P($.plugin, V)
                }, null, 8, ["disabled", "schema", "model-value", "onUpdate:modelValue", "onValidity"]),
                d("div", yc, [
                  b(r(X), {
                    label: "Reset",
                    severity: "secondary",
                    outlined: "",
                    disabled: !!s.value || e.disabled,
                    onClick: (V) => D($.plugin, c($.plugin) ? r(kt)(n($.plugin)?.config ?? {}) : {})
                  }, {
                    icon: N(() => [
                      b(r(_), { icon: "tabler:restore" })
                    ]),
                    _: 1
                  }, 8, ["disabled", "onClick"]),
                  c($.plugin) ? (u(), j(r(X), {
                    key: 0,
                    label: "Save configuration",
                    disabled: !!s.value || e.disabled || f.value.has($.plugin),
                    loading: s.value === $.plugin,
                    onClick: (V) => z($.plugin)
                  }, {
                    icon: N(() => [
                      b(r(_), {
                        icon: "tabler:device-floppy",
                        "aria-hidden": "true"
                      })
                    ]),
                    _: 1
                  }, 8, ["disabled", "loading", "onClick"])) : E("", !0)
                ]),
                c($.plugin) ? E("", !0) : (u(), g("p", gc, "Initial configuration is included in Review and Apply."))
              ], 64)) : E("", !0)
            ]),
            _: 2
          }, 1032, ["title", "description", "kind"]))), 128))
        ]),
        _: 1
      }, 8, ["count"]),
      (u(!0), g(Z, null, le(e.draft.plugins?.filter(($) => !e.options.some((V) => V.plugin === $.use)) ?? [], ($) => (u(), g("article", {
        key: $.use,
        class: "work-settings-card"
      }, [
        T[4] || (T[4] = d("p", null, "Unavailable plugin", -1)),
        b(r(X), {
          label: "Deactivate plugin",
          severity: "secondary",
          onClick: (V) => w($.use, !1),
          outlined: ""
        }, {
          icon: N(() => [
            b(r(_), {
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
}, $c = { class: "work-stack work-tight" }, xc = { class: "work-settings-list" }, Cc = { class: "work-row-main" }, Sc = { class: "work-small work-muted" }, Tc = { class: "work-row-control" }, Ec = { class: "work-row" }, Uc = /* @__PURE__ */ ve({
  __name: "VisibilityEditor",
  props: {
    draft: {},
    boardId: {}
  },
  emits: ["validity"],
  setup(e, { emit: l }) {
    const t = e, a = l, o = H(() => t.draft.visibility), s = H(() => (t.draft.fields ?? []).filter((c) => c.form === "text" && (!c.cardinality || c.cardinality === "one") && c.type !== "rollup" && c.index !== "number" && c.config?.case !== "insensitive")), v = B(""), p = H(() => s.value.find((c) => c.code === o.value?.field)?.type !== "option");
    function f() {
      !v.value || !o.value || o.value.levels.some((c) => c.id === v.value) || (o.value.levels.push({ id: v.value, holders: [] }), v.value = "");
    }
    function i(c) {
      if (!c) {
        delete t.draft.visibility;
        return;
      }
      const y = s.value.find((m) => m.code === c);
      t.draft.visibility = { field: c, levels: (y?.options ?? []).map((m) => ({ id: m.id, holders: [] })) };
    }
    function n(c, y) {
      const m = o.value?.levels.find((w) => w.id === c);
      m && (m.holders = y ?? []);
    }
    return (c, y) => (u(), g("section", kc, [
      y[10] || (y[10] = d("h3", { class: "work-group-title" }, "Board visibility", -1)),
      y[11] || (y[11] = d("p", { class: "work-small work-muted" }, "Restrict items by their visibility level. People still need access to the board.", -1)),
      d("label", wc, [
        y[7] || (y[7] = R("Visibility field", -1)),
        b(r(ae), {
          "aria-label": "Visibility field",
          placeholder: "No additional restriction",
          "model-value": o.value?.field ?? "",
          options: [{ label: "No additional restriction", value: "" }, ...s.value.map((m) => ({ label: r(_e)(m), value: m.code }))],
          optionLabel: "label",
          optionValue: "value",
          appendTo: "self",
          "onUpdate:modelValue": y[0] || (y[0] = (m) => i(m))
        }, null, 8, ["model-value", "options"])
      ]),
      o.value ? (u(), g(Z, { key: 0 }, [
        p.value ? (u(), g("div", Vc, [
          d("label", $c, [
            y[8] || (y[8] = R("Level ID", -1)),
            b(r(ce), {
              modelValue: v.value,
              "onUpdate:modelValue": y[1] || (y[1] = (m) => v.value = m),
              "aria-label": "New visibility level",
              onKeydown: Ae(he(f, ["prevent"]), ["enter"])
            }, null, 8, ["modelValue", "onKeydown"])
          ]),
          b(r(X), {
            label: "Add level",
            severity: "secondary",
            outlined: "",
            disabled: !v.value || o.value.levels.some((m) => m.id === v.value),
            onClick: f
          }, null, 8, ["disabled"])
        ])) : E("", !0),
        d("div", xc, [
          (u(!0), g(Z, null, le(o.value.levels, (m, w) => (u(), g("div", {
            key: m.id,
            class: "work-settings-row"
          }, [
            d("div", Cc, [
              d("strong", null, U(s.value.find((C) => C.code === o.value.field)?.options?.find((C) => C.id === m.id)?.label || m.id), 1),
              d("p", Sc, "Level " + U(w + 1), 1)
            ]),
            d("div", Tc, [
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
        d("label", Ec, [
          b(r(Le), {
            "model-value": o.value.bypass === "admin",
            "onUpdate:modelValue": y[3] || (y[3] = (m) => m ? o.value.bypass = "admin" : delete o.value.bypass)
          }, null, 8, ["model-value"]),
          y[9] || (y[9] = R("Board administrators can see every level", -1))
        ]),
        b(r(X), {
          label: "Remove visibility restriction",
          severity: "secondary",
          text: "",
          onClick: y[4] || (y[4] = (m) => delete e.draft.visibility)
        })
      ], 64)) : E("", !0),
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
}), Dc = { class: "kx-head" }, Ic = { class: "kx-head-icon" }, Ac = { class: "kx-head-text" }, Pc = { class: "kx-title" }, Rc = ["title"], Oc = { class: "kx-head-actions" }, Nc = /* @__PURE__ */ ve({
  __name: "PageHead",
  props: {
    title: {},
    subtitle: {},
    icon: { default: "tabler:layout-kanban" },
    backLabel: {}
  },
  emits: ["back"],
  setup(e) {
    return (l, t) => (u(), g("header", Dc, [
      e.backLabel ? (u(), j(r(X), {
        key: 0,
        "aria-label": e.backLabel,
        severity: "secondary",
        text: "",
        onClick: t[0] || (t[0] = (a) => l.$emit("back"))
      }, {
        default: N(() => [
          b(r(_), {
            icon: "tabler:arrow-left",
            "aria-hidden": "true"
          })
        ]),
        _: 1
      }, 8, ["aria-label"])) : E("", !0),
      d("div", Ic, [
        b(r(_), {
          icon: e.icon,
          "aria-hidden": "true"
        }, null, 8, ["icon"])
      ]),
      d("div", Ac, [
        We(l.$slots, "identity", {}, () => [
          d("h1", Pc, U(e.title), 1),
          e.subtitle ? (u(), g("p", {
            key: 0,
            class: "kx-head-sub",
            title: e.subtitle
          }, U(e.subtitle), 9, Rc)) : E("", !0)
        ])
      ]),
      d("div", Oc, [
        We(l.$slots, "default")
      ])
    ]));
  }
}), Mc = { class: "work-board-identity work-stack work-tight" }, Fc = { class: "work-stack work-tight" }, Lc = { class: "work-stack work-tight" }, zc = { class: "work-stack work-tight" }, Bc = ["value", "inert"], jc = {
  key: 1,
  class: "work-muted work-small"
}, qc = { class: "work-row" }, Wc = { class: "work-row" }, Kc = { class: "work-row work-board-title" }, Gc = {
  key: 1,
  class: "work-identity-actions"
}, Yc = ["title"], Hc = {
  key: 2,
  class: "kx-err work-inline",
  role: "alert"
}, Xc = {
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
    const t = e, a = l, o = B(!1), s = B(""), v = B(""), p = B(""), f = B(!1), i = B(!1), n = B(""), c = B(""), y = H(() => t.board?.access?.admin === !0);
    function m() {
      s.value = t.board?.title ?? "", p.value = t.board?.icon ?? "", lt("wc-icon-picker").then((C) => f.value = C), v.value = t.board?.description ?? "", n.value = "", c.value = "", o.value = !0;
    }
    Ce(y, (C) => {
      C || (o.value = !1);
    });
    async function w() {
      if (!y.value || !t.board || i.value || !s.value.trim()) return;
      const C = {};
      if (s.value.trim() !== t.board.title && (C.title = s.value.trim()), v.value !== (t.board.description ?? "") && (C.description = v.value), p.value !== (t.board.icon ?? "") && (C.icon = p.value), !Object.keys(C).length) {
        o.value = !1, c.value = "Nothing changed.";
        return;
      }
      i.value = !0, n.value = "";
      try {
        const D = await xt.updateBoard(t.board.board_id, C);
        o.value = !1, c.value = D.status === "unchanged" ? "Nothing changed." : "Board saved.", a("saved");
      } catch (D) {
        n.value = D instanceof Error ? D.message : "Could not save the board.";
      } finally {
        i.value = !1;
      }
    }
    return (C, D) => (u(), g("div", Mc, [
      o.value ? (u(), g("form", {
        key: 0,
        class: "work-identity-edit",
        "aria-label": "Edit board",
        onClick: D[4] || (D[4] = he(() => {
        }, ["stop"])),
        onSubmit: he(w, ["prevent"])
      }, [
        d("label", Fc, [
          D[5] || (D[5] = R("Title", -1)),
          b(r(ce), {
            modelValue: s.value,
            "onUpdate:modelValue": D[0] || (D[0] = (P) => s.value = P),
            required: "",
            autofocus: "",
            disabled: i.value
          }, null, 8, ["modelValue", "disabled"])
        ]),
        d("label", Lc, [
          D[6] || (D[6] = R("Description", -1)),
          b(r(ml), {
            modelValue: v.value,
            "onUpdate:modelValue": D[1] || (D[1] = (P) => v.value = P),
            rows: "1",
            disabled: i.value
          }, null, 8, ["modelValue", "disabled"])
        ]),
        d("div", zc, [
          D[7] || (D[7] = d("span", null, "Board icon", -1)),
          f.value ? (u(), g("wc-icon-picker", {
            key: 0,
            value: p.value,
            fallback: "tabler:layout-kanban",
            inert: i.value || void 0,
            onSelect: D[2] || (D[2] = (P) => p.value = P.detail)
          }, null, 40, Bc)) : (u(), g("p", jc, "The icon picker is unavailable."))
        ]),
        d("div", qc, [
          b(r(X), {
            label: "Save",
            severity: "secondary",
            type: "submit",
            disabled: !s.value.trim() || i.value,
            loading: i.value,
            outlined: ""
          }, {
            icon: N(() => [
              b(r(_), {
                icon: "tabler:device-floppy",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled", "loading"]),
          b(r(X), {
            label: "Cancel",
            severity: "secondary",
            disabled: i.value,
            onClick: D[3] || (D[3] = (P) => o.value = !1),
            outlined: ""
          }, {
            icon: N(() => [
              b(r(_), {
                icon: "tabler:x",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled"])
        ])
      ], 32)) : (u(), g(Z, { key: 1 }, [
        d("div", Wc, [
          d("div", Kc, [
            e.board?.icon ? (u(), j(r(_), {
              key: 0,
              icon: e.board.icon,
              "aria-hidden": "true"
            }, null, 8, ["icon"])) : E("", !0),
            (u(), j(zl(e.compact || e.detail ? "h2" : "h1"), {
              class: pt(e.detail ? "work-detail-title" : e.compact ? "kx-card-name" : "kx-title")
            }, {
              default: N(() => [
                R(U(e.board?.title || "Untitled board"), 1)
              ]),
              _: 1
            }, 8, ["class"]))
          ]),
          e.compact ? We(C.$slots, "title-end", {}, void 0, void 0, 0) : E("", !0),
          e.compact ? (u(), g("span", Gc, [
            y.value ? (u(), j(r(X), {
              key: 0,
              severity: "secondary",
              text: "",
              size: "small",
              onClick: he(m, ["stop"]),
              "aria-label": "Edit board"
            }, {
              default: N(() => [
                b(r(_), {
                  icon: "tabler:pencil",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            })) : E("", !0),
            We(C.$slots, "actions")
          ])) : y.value ? (u(), j(r(X), {
            key: 2,
            severity: "secondary",
            text: "",
            size: "small",
            onClick: he(m, ["stop"]),
            "aria-label": "Edit board"
          }, {
            default: N(() => [
              b(r(_), {
                icon: "tabler:pencil",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          })) : E("", !0),
          e.compact ? E("", !0) : We(C.$slots, "title-end", {}, void 0, void 0, 3)
        ]),
        !e.compact && (e.subtitle || e.board?.description) ? (u(), g("p", {
          key: 0,
          class: "kx-head-sub",
          title: e.subtitle || e.board?.description
        }, U(e.subtitle || e.board?.description), 9, Yc)) : E("", !0)
      ], 64)),
      n.value ? (u(), g("p", Hc, U(n.value), 1)) : E("", !0),
      c.value ? (u(), g("p", Xc, U(c.value), 1)) : E("", !0)
    ]));
  }
}), Jc = {
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
    return (l, t) => (u(), g(Z, null, [
      e.dirty ? (u(), g("span", Jc, "Unsaved changes")) : E("", !0),
      b(r(X), {
        label: "Discard",
        severity: "secondary",
        outlined: "",
        disabled: !e.dirty || e.busy || e.checkingRemoval,
        onClick: t[0] || (t[0] = (a) => l.$emit("discard"))
      }, {
        icon: N(() => [
          b(r(_), { icon: "tabler:restore" })
        ]),
        _: 1
      }, 8, ["disabled"]),
      b(r(X), {
        label: e.reviewed ? "Apply" : "Review changes",
        disabled: e.disabled,
        loading: e.busy,
        onClick: t[1] || (t[1] = (a) => l.$emit("primary"))
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
}, ev = ["config"], tv = /* @__PURE__ */ ve({
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
    const l = e, t = B(!1), a = B(!1), o = B("");
    async function s() {
      !l.authorized || !l.board || (o.value = "", a.value = await lt("kickside-share"), a.value ? t.value = !0 : o.value = "The sharing widget is unavailable. Try Share board again.");
    }
    Ce(() => l.authorized, (i) => {
      i || (t.value = !1);
    });
    const v = H(() => JSON.stringify({ resource_id: l.board?.board_id, title: l.board?.title, access_url: `/api/v1/component-access/grants/${encodeURIComponent(l.board?.board_id ?? "")}`, share_url: `/api/v1/component-access/share/${encodeURIComponent(l.board?.board_id ?? "")}` })), p = H(() => l.pack ? `${l.packTitle} ${l.pack.version}${l.outdated ? " · Outdated" : ""}` : ""), f = H(() => "Settings · generation " + (l.generation ?? "…") + (p.value ? " · " + p.value : ""));
    return (i, n) => (u(), g(Z, null, [
      e.embedded ? (u(), g("header", Zc, [
        b(Ia, {
          board: e.board,
          subtitle: p.value || void 0,
          detail: "",
          onSaved: n[0] || (n[0] = (c) => i.$emit("saved"))
        }, {
          "title-end": N(() => [
            b(r(Re), {
              severity: "secondary",
              value: "Generation " + (e.generation ?? "…")
            }, null, 8, ["value"])
          ]),
          _: 1
        }, 8, ["board", "subtitle"]),
        e.authorized ? (u(), g("div", Qc, [
          e.authorized && e.outdated && e.pack ? (u(), j(r(X), {
            key: 0,
            disabled: !e.canUpgrade,
            title: e.upgradeReason,
            label: "Upgrade pack",
            severity: "secondary",
            outlined: "",
            onClick: n[1] || (n[1] = (c) => i.$emit("upgrade"))
          }, {
            icon: N(() => [
              b(r(_), { icon: "tabler:refresh" })
            ]),
            _: 1
          }, 8, ["disabled", "title"])) : E("", !0),
          e.authorized && e.board ? (u(), j(r(X), {
            key: 1,
            label: "Share board",
            severity: "secondary",
            outlined: "",
            disabled: e.busy,
            onClick: s
          }, {
            icon: N(() => [
              b(r(_), {
                icon: "tabler:share",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled"])) : E("", !0),
          e.authorized && !e.pack ? (u(), j(r(X), {
            key: 2,
            label: "Install pack",
            severity: "secondary",
            outlined: "",
            disabled: e.busy || e.dirty,
            onClick: n[2] || (n[2] = (c) => i.$emit("install"))
          }, null, 8, ["disabled"])) : E("", !0),
          b(Aa, {
            dirty: e.dirty,
            busy: e.busy,
            "checking-removal": e.checkingRemoval,
            reviewed: e.reviewed,
            disabled: e.disabled,
            onDiscard: n[3] || (n[3] = (c) => i.$emit("discard")),
            onPrimary: n[4] || (n[4] = (c) => i.$emit("primary"))
          }, null, 8, ["dirty", "busy", "checking-removal", "reviewed", "disabled"])
        ])) : E("", !0)
      ])) : (u(), j(Nc, {
        key: 1,
        title: e.board?.title || "Board",
        subtitle: f.value,
        "back-label": "Back to board",
        icon: "tabler:adjustments",
        onBack: n[10] || (n[10] = (c) => i.$emit("back"))
      }, {
        identity: N(() => [
          b(Ia, {
            board: e.board,
            subtitle: f.value,
            onSaved: n[5] || (n[5] = (c) => i.$emit("saved"))
          }, null, 8, ["board", "subtitle"])
        ]),
        default: N(() => [
          e.authorized && e.outdated && e.pack ? (u(), j(r(X), {
            key: 0,
            disabled: !e.canUpgrade,
            title: e.upgradeReason,
            label: "Upgrade pack",
            severity: "secondary",
            outlined: "",
            onClick: n[6] || (n[6] = (c) => i.$emit("upgrade"))
          }, {
            icon: N(() => [
              b(r(_), { icon: "tabler:refresh" })
            ]),
            _: 1
          }, 8, ["disabled", "title"])) : E("", !0),
          e.authorized && e.board ? (u(), j(r(X), {
            key: 1,
            label: "Share board",
            severity: "secondary",
            outlined: "",
            disabled: e.busy,
            onClick: s
          }, {
            icon: N(() => [
              b(r(_), {
                icon: "tabler:share",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled"])) : E("", !0),
          e.authorized && !e.pack ? (u(), j(r(X), {
            key: 2,
            label: "Install pack",
            severity: "secondary",
            outlined: "",
            disabled: e.busy || e.dirty,
            onClick: n[7] || (n[7] = (c) => i.$emit("install"))
          }, null, 8, ["disabled"])) : E("", !0),
          e.authorized ? (u(), j(Aa, {
            key: 3,
            dirty: e.dirty,
            busy: e.busy,
            "checking-removal": e.checkingRemoval,
            reviewed: e.reviewed,
            disabled: e.disabled,
            onDiscard: n[8] || (n[8] = (c) => i.$emit("discard")),
            onPrimary: n[9] || (n[9] = (c) => i.$emit("primary"))
          }, null, 8, ["dirty", "busy", "checking-removal", "reviewed", "disabled"])) : E("", !0)
        ]),
        _: 1
      }, 8, ["title", "subtitle"])),
      o.value ? (u(), g("p", _c, U(o.value), 1)) : E("", !0),
      t.value && a.value && e.authorized ? (u(), g("kickside-share", {
        key: 3,
        config: v.value,
        onClose: n[11] || (n[11] = (c) => t.value = !1),
        onChanged: n[12] || (n[12] = (c) => i.$emit("saved"))
      }, null, 40, ev)) : E("", !0)
    ], 64));
  }
}), lv = {
  key: 0,
  class: "work-settings-card work-schema-plan work-stack",
  "aria-label": "Schema review"
}, av = { key: 0 }, ov = { class: "work-row" }, iv = { class: "work-muted work-small" }, nv = { class: "work-muted" }, sv = {
  key: 0,
  class: "work-notice"
}, rv = {
  key: 1,
  class: "work-notice"
}, dv = {
  key: 2,
  class: "work-muted work-small"
}, uv = {
  key: 3,
  class: "work-stack work-tight",
  "aria-label": "Reviewed Flow bindings"
}, cv = { key: 4 }, vv = { key: 0 }, mv = {
  key: 5,
  class: "work-settings-table"
}, fv = { key: 0 }, pv = { key: 1 }, bv = { key: 2 }, hv = { key: 6 }, yv = /* @__PURE__ */ ve({
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
    const l = e, t = H(() => l.declaration?.processes?.flatMap((a) => a.states.filter((o) => o.run?.flow_ref).map((o) => ({ process: a.name || a.id, state: o.name || o.id, reference: o.run.flow_ref }))) ?? []);
    return (a, o) => e.plan ? (u(), g("section", lv, [
      !e.plan.changes.length && !e.plan.refused.length && !e.configCount && !e.packReview ? (u(), g("p", av, "No changes to apply.")) : (u(), g(Z, { key: 1 }, [
        d("header", ov, [
          o[0] || (o[0] = d("h2", null, "Review", -1)),
          b(r(Re), {
            class: "kx-tag-sm",
            severity: e.plan.class === "refused" ? "danger" : e.plan.class === "semantic" ? "warn" : e.plan.class === "additive" ? "success" : "secondary"
          }, {
            default: N(() => [
              R(U(e.plan.class), 1)
            ]),
            _: 1
          }, 8, ["severity"]),
          d("span", iv, "Generation " + U(e.generation) + " → " + U(e.plan.generation), 1)
        ]),
        d("p", nv, U(r(Uo)[e.plan.class] || "Review the classified changes below."), 1),
        e.plan.migration ? (u(), g("p", sv, "Migration needed: " + U(e.plan.migration), 1)) : e.follows.length ? (u(), g("p", rv, "Follow migration: " + U(e.follows.join(", ")) + ". Existing items move to the new process generation; declared state maps apply.", 1)) : (u(), g("p", dv, "No follow process migration is indicated by these changes.")),
        t.value.length ? (u(), g("section", uv, [
          o[1] || (o[1] = d("h3", null, "Flow bindings", -1)),
          (u(!0), g(Z, null, le(t.value, (s) => (u(), g("p", {
            key: s.process + ":" + s.state
          }, U(s.process) + " / " + U(s.state) + ": " + U(s.reference.id) + " · v" + U(s.reference.version), 1))), 128)),
          o[2] || (o[2] = d("p", { class: "work-muted work-small" }, "New entries use these exact published versions. Before replacing a binding, stop new entries, drain existing attempts and deliveries, pause the old launcher, save, then resume entries.", -1))
        ])) : E("", !0),
        We(a.$slots, "default"),
        e.plan.refused.length ? (u(), g("h3", cv, "Refused changes")) : E("", !0),
        (u(!0), g(Z, null, le(e.plan.refused, (s, v) => (u(), j(r(Wo), {
          key: v,
          severity: "error",
          role: "alert"
        }, {
          default: N(() => [
            R(U(s.code) + " · " + U(s.what) + " · " + U(r(wl)(s)), 1),
            s.to ? (u(), g("span", vv, " → " + U(s.to), 1)) : E("", !0)
          ]),
          _: 2
        }, 1024))), 128)),
        e.plan.changes.length ? (u(), g("table", mv, [
          o[3] || (o[3] = d("thead", null, [
            d("tr", null, [
              d("th", null, "Entry"),
              d("th", null, "Class"),
              d("th", null, "Change")
            ])
          ], -1)),
          d("tbody", null, [
            (u(!0), g(Z, null, le(e.plan.changes, (s, v) => (u(), g("tr", { key: v }, [
              d("td", null, U(s.code), 1),
              d("td", null, [
                b(r(Re), {
                  class: "kx-tag-sm",
                  severity: s.class === "refused" ? "danger" : s.class === "semantic" ? "warn" : s.class === "additive" ? "success" : "secondary"
                }, {
                  default: N(() => [
                    R(U(s.class), 1)
                  ]),
                  _: 2
                }, 1032, ["severity"])
              ]),
              d("td", null, [
                R(U(s.what) + " ", 1),
                s.detail ? (u(), g("span", fv, " · " + U(s.detail), 1)) : E("", !0),
                s.to ? (u(), g("span", pv, " → " + U(s.to), 1)) : E("", !0),
                s.count ? (u(), g("span", bv, " · " + U(s.count) + " items", 1)) : E("", !0)
              ])
            ]))), 128))
          ])
        ])) : (u(), g("p", hv, "No declaration changes are reported."))
      ], 64))
    ])) : E("", !0);
  }
}), gv = {
  key: 0,
  class: "work-stack",
  "aria-label": "Pack conflicts"
}, kv = { class: "work-stack work-tight work-pack-review-field" }, wv = { class: "work-json-disclosure" }, Vv = { class: "work-config-fields" }, $v = { class: "work-json-example" }, xv = { class: "work-json-example" }, Cv = {
  key: 1,
  class: "work-stack",
  "aria-label": "Pack state maps"
}, Sv = /* @__PURE__ */ ve({
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
      const [n, ...c] = i.split("."), y = c.join(".");
      return n === "processes" ? o(y) : n === "fields" ? t.original.fields?.find((m) => m.code === y)?.title || Ve(y) : n === "item_types" ? t.original.item_types?.find((m) => m.id === y)?.title || Ve(y) : Ve(n);
    }
    function v(i) {
      return JSON.stringify(i ?? null, null, 2);
    }
    function p(i, n) {
      (t.request.resolutions ??= {})[i] = n, a("change");
    }
    function f(i, n, c) {
      ((t.request.maps ??= {})[i] ??= {})[n] = c, a("change");
    }
    return (i, n) => (u(), g(Z, null, [
      e.plan.conflicts.length ? (u(), g("section", gv, [
        n[3] || (n[3] = d("h3", null, "Local edits conflict", -1)),
        n[4] || (n[4] = d("p", { class: "work-muted work-small" }, "Choose which declaration to keep for each conflict, then review again.", -1)),
        (u(!0), g(Z, null, le(e.plan.conflicts, (c) => (u(), g("div", {
          key: c.path,
          class: "work-stack work-tight"
        }, [
          d("label", kv, [
            R(U(s(c.path)), 1),
            b(r(ae), {
              "model-value": e.request.resolutions?.[c.path],
              "aria-label": "Resolution for " + s(c.path),
              disabled: e.disabled,
              appendTo: "self",
              placeholder: "Choose a resolution",
              optionLabel: "label",
              optionValue: "value",
              options: [{ label: "Keep local edits", value: "local" }, { label: "Use pack changes", value: "incoming" }],
              "onUpdate:modelValue": (y) => p(c.path, y)
            }, null, 8, ["model-value", "aria-label", "disabled", "onUpdate:modelValue"])
          ]),
          d("details", wv, [
            n[2] || (n[2] = d("summary", null, "Compare declarations", -1)),
            d("div", Vv, [
              d("section", null, [
                n[0] || (n[0] = d("h4", null, "Local edits", -1)),
                d("pre", $v, U(v(c.local_value)), 1)
              ]),
              d("section", null, [
                n[1] || (n[1] = d("h4", null, "Pack changes", -1)),
                d("pre", xv, U(v(c.incoming)), 1)
              ])
            ])
          ])
        ]))), 128))
      ])) : E("", !0),
      Object.keys(e.plan.maps).length ? (u(), g("section", Cv, [
        n[5] || (n[5] = d("h3", null, "Required state maps", -1)),
        n[6] || (n[6] = d("p", { class: "work-muted work-small" }, "Review the proposed destinations for existing items. Each destination is editable.", -1)),
        (u(!0), g(Z, null, le(e.plan.maps, (c, y) => (u(), g("div", {
          key: y,
          class: "work-stack"
        }, [
          d("h4", null, U(o(y)), 1),
          (u(!0), g(Z, null, le(c, (m, w) => (u(), g("label", {
            key: w,
            class: "work-stack work-tight work-pack-review-field"
          }, [
            R("Move items from " + U(r(ye)(e.original.processes?.find((C) => C.id === y)?.states.find((C) => C.id === w))), 1),
            b(r(ae), {
              "model-value": e.request.maps?.[y]?.[w],
              "aria-label": "Move items from " + r(ye)(e.original.processes?.find((C) => C.id === y)?.states.find((C) => C.id === w)),
              disabled: e.disabled,
              appendTo: "self",
              optionLabel: "label",
              optionValue: "value",
              options: e.plan.declaration.processes?.find((C) => C.id === y)?.states.map((C) => ({ label: r(ye)(C), value: C.id })) ?? [],
              "onUpdate:modelValue": (C) => f(y, w, C)
            }, null, 8, ["model-value", "aria-label", "disabled", "options", "onUpdate:modelValue"])
          ]))), 128))
        ]))), 128))
      ])) : E("", !0)
    ], 64));
  }
}), Tv = {
  key: 0,
  class: "work-settings-tabs"
}, Ev = { class: "work-section-navigation" }, Uv = {
  key: 1,
  class: "kx-err",
  role: "alert"
}, Dv = {
  key: 2,
  class: "kx-err",
  role: "alert"
}, Iv = {
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
}, Mv = { key: 0 }, Fv = ["disabled", "inert"], Lv = {
  key: 6,
  class: "work-settings-card work-stack"
}, zv = {
  key: 5,
  class: "kx-empty"
}, Bv = {
  key: 6,
  class: "work-muted work-small",
  role: "status"
}, jv = { class: "work-stack work-tight" }, qv = {
  key: 0,
  class: "work-muted"
}, Wv = { class: "work-dialog-actions" }, Kv = /* @__PURE__ */ ve({
  __name: "BoardSettings",
  props: {
    boardId: {},
    embedded: { type: Boolean }
  },
  emits: ["dirty-change"],
  setup(e, { emit: l }) {
    const t = e, a = l, o = Yo();
    let s, v = "";
    const p = () => JSON.stringify([k.value, P.value, q.value, [...pe.value]]), f = ["Fields", "Item types", "Process", "Policy", "Relation types", "Plugins", "Review"], i = B("Fields"), n = B(!1), c = B(""), y = B(/* @__PURE__ */ new Set(["Fields"]));
    Ce(i, (ee) => y.value.add(ee));
    const m = B(), w = B(), C = B(), D = B({}), P = B({}), z = B(), O = B(!1), T = B(!0), $ = B(!1), V = B(""), S = B(""), oe = B(""), M = B([]), q = B(), A = B(), ie = B(), I = B(), ne = B(), K = B(""), F = B([]), L = H(() => [...F.value, ...I.value?.refused ?? []]), Q = B(!1), ke = B(0), pe = B(/* @__PURE__ */ new Set()), ge = B(), h = jl(), x = jl(), k = H(() => va(D.value, m.value?.declaration ?? {})), W = H(() => pe.value.size > 0 || !!q.value || !!m.value && (JSON.stringify(k.value) !== JSON.stringify(m.value.declaration) || Object.keys(P.value).length > 0));
    Ce(W, (ee) => a("dirty-change", ee), { immediate: !0, flush: "sync" });
    const J = H(() => !!m.value && !!w.value && m.value.generation !== w.value.generation), de = H(() => O.value && !$.value && !Q.value && !St.value && !J.value && !pe.value.size && I.value && (I.value.changes.length > 0 || Object.keys(P.value).length > 0) && I.value.class !== "refused" && !I.value.refused.length && ne.value?.matches(k.value, m.value?.generation ?? -1, P.value)), be = H(() => M.value.find((ee) => ee.id === q.value?.pack)?.plugins.filter((ee) => !m.value?.plugins?.some((G) => G.plugin === ee.plugin && G.active)).map((ee) => ({ use: ee.plugin })) ?? []), Te = H(() => !!ie.value && JSON.stringify(ie.value) === JSON.stringify(q.value)), Ne = H(() => q.value ? O.value && !$.value && !pe.value.size && !J.value && !St.value && Te.value && I.value?.class !== "refused" && !I.value?.refused.length && A.value?.conflicts.every((ee) => !!q.value?.resolutions?.[ee.path]) : de.value), Ee = H(() => !!I.value && (!q.value || Te.value)), bt = H(() => M.value.find((ee) => ee.id === m.value?.pack?.id)?.title || "Installed pack"), rt = H(() => !oe.value && !!m.value?.outdated && !!M.value.find((ee) => ee.id === m.value?.pack?.id)), Cl = H(() => oe.value ? "Reload packs to check available upgrades." : rt.value ? W.value ? "Discard the current draft before upgrading." : St.value ? "Finish the current migration before upgrading." : $.value ? "Wait for the current request to finish." : void 0 : "Install an available version of this pack to upgrade.");
    function Ye() {
      q.value = void 0, A.value = void 0, ie.value = void 0;
    }
    async function ll() {
      if (!m.value?.pack || $.value || W.value) return;
      const ee = M.value.find((G) => G.id === m.value.pack.id);
      ee && (q.value = ma(ee, m.value.generation), i.value = "Review", await Sl());
    }
    async function Bt() {
      const ee = M.value.find((G) => G.id === c.value);
      !m.value || !ee || ee.plugins.some((G) => !G.installed) || $.value || W.value || (q.value = ma(ee, m.value.generation), n.value = !1, i.value = "Review", await Sl());
    }
    async function Sl() {
      if (!q.value || $.value || !O.value || J.value || pe.value.size) return;
      const ee = x(), G = kt(q.value), te = JSON.stringify(q.value);
      $.value = !0, V.value = "", S.value = "";
      try {
        const we = await Io(G, (Et) => wt.packPlan(t.boardId, Et));
        if (!ee() || te !== JSON.stringify(q.value)) return;
        A.value = we.plan, I.value = we.plan, q.value = we.request, ie.value = kt(q.value), K.value = crypto.randomUUID(), i.value = "Review";
      } catch (we) {
        ee() && (ie.value = void 0, V.value = we instanceof Error ? we.message : "Could not plan the pack upgrade.");
      } finally {
        $.value = !1;
      }
    }
    const so = H(() => I.value ? Do(I.value, k.value) : []), St = H(() => !!w.value?.migration_error || C.value?.status === "migrating");
    function dt() {
      F.value = [], x(), I.value = void 0, ne.value = void 0, ie.value = void 0, K.value = "";
    }
    Ce([k, P], dt, { deep: !0, flush: "sync" }), Ce(P, (ee) => {
      q.value && (Object.keys(ee).length ? q.value.plugin_configs = kt(ee) : delete q.value.plugin_configs);
    }, { deep: !0, flush: "sync" });
    function Tt(ee, G) {
      G ? pe.value.delete(ee) : pe.value.add(ee), dt();
    }
    function Tl(ee) {
      Ye(), ke.value++, m.value = ee, D.value = kt(ee.declaration), P.value = {}, pe.value.clear(), dt();
    }
    async function Ze(ee = !1) {
      const G = h();
      try {
        const [te, we, Et] = await Promise.all([xt.schema(t.boardId, void 0, !0).catch((ut) => {
          if (ut instanceof fa && ut.details?.code === "board_schema_missing") return { generation: 0, declaration: {}, compiled: {}, key_prefix: "", as_of: 0 };
          throw ut;
        }), xt.options(t.boardId), xt.boards()]);
        if (!G()) return;
        if (O.value = we.access.admin, z.value = we, C.value = Et.find((ut) => ut.board_id === t.boardId), !O.value) {
          m.value = void 0, D.value = {}, dt();
          return;
        }
        V.value = "";
        const He = Ao(te);
        w.value = He, s !== void 0 && He.generation >= s ? (s = void 0, v === p() && Tl(He), v = "") : (ee || !m.value || !W.value && He.generation !== m.value.generation) && Tl(He), J.value && dt(), await sa(G);
      } catch (te) {
        if (!G()) return;
        te instanceof fa && (te.status === 403 || te.kind?.toLowerCase() === "permission_denied") && (O.value = !1), dt(), V.value = te instanceof Error ? te.message : "Could not load board settings.";
      } finally {
        G() && (T.value = !1);
      }
    }
    async function sa(ee = () => !0) {
      oe.value = "";
      try {
        const G = await xt.packs();
        ee() && (M.value = G.filter(Po));
      } catch (G) {
        ee() && (oe.value = G instanceof Error ? G.message : "Could not load packs.");
      }
    }
    function ro() {
      for (const ee of ge.value?.querySelectorAll("input, select, textarea") ?? [])
        if (!(ee.form !== ge.value || ee.closest('[style*="display: none"]')) && !ee.reportValidity())
          return !1;
      return !0;
    }
    function uo(ee) {
      i.value = ee, ee === "Review" && !I.value && El();
    }
    async function El() {
      if (q.value) return Sl();
      if (!m.value || $.value || !O.value || J.value || pe.value.size || !ro()) return;
      const ee = x(), G = pa(k.value, m.value.generation, P.value);
      $.value = !0, V.value = "", S.value = "";
      try {
        const te = await wt.plan(t.boardId, G);
        if (!ee() || pe.value.size || !G.matches(k.value, m.value.generation, P.value)) return;
        I.value = te, ne.value = G, K.value = crypto.randomUUID(), i.value = "Review";
      } catch (te) {
        ee() && (dt(), V.value = te instanceof Error ? te.message : "Could not review changes.", F.value = Ro(te, k.value));
      } finally {
        $.value = !1;
      }
    }
    async function co() {
      if (!Ne.value) return;
      if (q.value && ie.value) {
        $.value = !0, V.value = "";
        const G = p();
        try {
          const te = await wt.packApply(t.boardId, kt(ie.value), K.value);
          s = te.generation, v = G, await Ze(), S.value = te.status === "done" ? `Pack applied at generation ${te.generation}.` : "Pack installation continues in the background.";
        } catch (te) {
          V.value = te instanceof Error ? te.message : "Could not apply the pack upgrade.";
        } finally {
          $.value = !1;
        }
        return;
      }
      if (!ne.value) return;
      $.value = !0, V.value = "", S.value = "";
      const ee = p();
      try {
        const G = await wt.apply(t.boardId, ne.value, K.value);
        s = G.generation, v = ee, await Ze(), S.value = `Applied generation ${G.generation} (${G.class}).`;
      } catch (G) {
        V.value = G instanceof Error ? G.message : "Could not apply schema.";
      } finally {
        $.value = !1;
      }
    }
    async function vo() {
      if (!$.value) {
        $.value = !0, V.value = "";
        try {
          const ee = await wt.resume(t.boardId);
          S.value = ee.resumed ? "Migration resumes." : "Migration is already running.", await Ze();
        } catch (ee) {
          V.value = ee instanceof Error ? ee.message : "Could not resume migration.";
        } finally {
          $.value = !1;
        }
      }
    }
    async function al(ee, G) {
      if (!m.value || !O.value || $.value || Q.value) return "Wait for the current change to finish.";
      if (J.value) return "Discard the stale draft before removing a definition.";
      const te = m.value.generation, we = JSON.stringify(k.value), Et = kt(D.value);
      _t(Et, ee, G), Q.value = !0;
      try {
        const He = await wt.plan(t.boardId, pa(va(Et, m.value.declaration), te, P.value));
        if (!O.value || J.value || m.value.generation !== te || JSON.stringify(k.value) !== we) return "The draft changes during the check. Try the removal again.";
        const ut = Oo(He, ee, G);
        if (ut) return ut;
        if (He.class === "refused") return "Resolve the refused draft changes in Review before removing this definition.";
      } catch (He) {
        return He instanceof Error ? He.message : "Could not check this removal.";
      } finally {
        Q.value = !1;
      }
    }
    async function mo() {
      W.value && !await Fo.confirm({ header: "Discard changes?", message: "Your unsaved board settings will be discarded.", acceptLabel: "Discard", rejectLabel: "Keep editing" }) || o({ name: "board", board: t.boardId });
    }
    function fo() {
      s = void 0, w.value && Tl(w.value), S.value = "", V.value = "";
    }
    Ce(() => t.boardId, () => {
      s = void 0, Ye(), M.value = [], m.value = void 0, w.value = void 0, C.value = void 0, P.value = {}, pe.value.clear(), y.value = /* @__PURE__ */ new Set(["Fields"]), i.value = "Fields", O.value = !1, T.value = !0, Ze(!0);
    });
    let Ul = () => {
    };
    return Ce(() => t.boardId, (ee) => {
      Ul(), Ul = Mo(`component.${ee}`, () => {
        Ze();
      });
    }, { immediate: !0 }), go(Ze), Pa(() => {
      Ul(), h(), x();
    }), (ee, G) => (u(), g("section", {
      class: pt(["work-settings-shell", { "work-embedded": e.embedded }])
    }, [
      b(tv, {
        board: C.value,
        embedded: e.embedded,
        generation: m.value?.generation,
        authorized: O.value,
        dirty: W.value,
        busy: $.value,
        "checking-removal": Q.value,
        reviewed: Ee.value,
        pack: m.value?.pack,
        "pack-title": bt.value,
        outdated: m.value?.outdated,
        "upgrade-reason": Cl.value,
        "can-upgrade": rt.value && !W.value && !$.value && !St.value && O.value,
        onUpgrade: ll,
        onInstall: G[0] || (G[0] = (te) => n.value = !0),
        disabled: !W.value || $.value || Q.value || St.value || J.value || !!pe.value.size || Ee.value && !Ne.value,
        onBack: mo,
        onDiscard: fo,
        onPrimary: G[1] || (G[1] = (te) => Ee.value ? co() : El()),
        onSaved: G[2] || (G[2] = (te) => Ze())
      }, null, 8, ["board", "embedded", "generation", "authorized", "dirty", "busy", "checking-removal", "reviewed", "pack", "pack-title", "outdated", "upgrade-reason", "can-upgrade", "disabled"]),
      O.value && m.value ? (u(), g("div", Tv, [
        d("div", Ev, [
          b(r(Bo), {
            value: i.value,
            "onUpdate:value": G[3] || (G[3] = (te) => uo(te))
          }, {
            default: N(() => [
              b(r(jo), { "aria-label": "Settings sections" }, {
                default: N(() => [
                  (u(), g(Z, null, le(f, (te) => b(r(qo), {
                    key: te,
                    value: te
                  }, {
                    default: N(() => [
                      R(U(te), 1)
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
      ])) : E("", !0),
      V.value ? (u(), g("div", Uv, [
        R(U(V.value) + " ", 1),
        b(r(X), {
          label: "Retry",
          severity: "secondary",
          onClick: G[4] || (G[4] = (te) => Ze()),
          outlined: ""
        }, {
          icon: N(() => [
            b(r(_), {
              icon: "tabler:refresh",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        })
      ])) : E("", !0),
      oe.value ? (u(), g("p", Dv, [
        R(U(oe.value), 1),
        b(r(X), {
          label: "Reload packs",
          severity: "secondary",
          outlined: "",
          onClick: G[5] || (G[5] = (te) => sa())
        }, {
          icon: N(() => [
            b(r(_), { icon: "tabler:refresh" })
          ]),
          _: 1
        })
      ])) : E("", !0),
      S.value ? (u(), g("p", Iv, U(S.value), 1)) : E("", !0),
      T.value ? (u(), g("p", Av, "Loading settings…")) : !O.value && !V.value ? (u(), g("p", Pv, "Board administrator access is required.")) : E("", !0),
      O.value && m.value ? (u(), g("div", Rv, [
        J.value ? (u(), g("div", Ov, "The board advances to generation " + U(w.value?.generation) + " while you edit. Your draft keeps generation " + U(m.value.generation) + ". Discard to load the latest schema before reviewing again.", 1)) : E("", !0),
        St.value ? (u(), g("div", Nv, [
          d("p", null, [
            G[18] || (G[18] = R("Migration pending", -1)),
            w.value?.migration_error ? (u(), g("span", Mv, ": " + U(w.value.migration_error), 1)) : E("", !0)
          ]),
          b(r(X), {
            label: "Resume migration",
            severity: "secondary",
            disabled: $.value,
            onClick: vo,
            outlined: ""
          }, {
            icon: N(() => [
              b(r(_), {
                icon: "tabler:refresh",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled"])
        ])) : E("", !0),
        d("form", {
          ref_key: "editor",
          ref: ge,
          onSubmit: he(El, ["prevent"])
        }, [
          (u(), g("fieldset", {
            key: ke.value,
            class: "work-settings-fieldset",
            disabled: $.value || Q.value,
            inert: $.value || Q.value || void 0
          }, [
            y.value.has("Fields") ? Qe((u(), j(Ts, {
              key: 0,
              "board-id": e.boardId,
              "installed-types": z.value?.installed_types,
              draft: D.value,
              "guard-removal": al,
              issues: L.value,
              onValidity: G[6] || (G[6] = (te, we) => Tt("fields:" + te, we))
            }, null, 8, ["board-id", "installed-types", "draft", "issues"])), [
              [ct, i.value === "Fields"]
            ]) : E("", !0),
            y.value.has("Item types") ? Qe((u(), j(Ks, {
              key: 1,
              draft: D.value,
              "guard-removal": al,
              issues: L.value
            }, null, 8, ["draft", "issues"])), [
              [ct, i.value === "Item types"]
            ]) : E("", !0),
            y.value.has("Process") ? Qe((u(), j(wu, {
              key: 2,
              "board-id": e.boardId,
              draft: D.value,
              "guard-removal": al,
              issues: L.value,
              onValidity: G[7] || (G[7] = (te, we) => Tt("process:" + te, we))
            }, null, 8, ["board-id", "draft", "issues"])), [
              [ct, i.value === "Process"]
            ]) : E("", !0),
            y.value.has("Policy") ? Qe((u(), j(ju, {
              key: 3,
              draft: D.value,
              onValidity: G[8] || (G[8] = (te, we) => Tt("policy:" + te, we))
            }, null, 8, ["draft"])), [
              [ct, i.value === "Policy"]
            ]) : E("", !0),
            y.value.has("Relation types") ? Qe((u(), j(oc, {
              key: 4,
              draft: D.value,
              "guard-removal": al
            }, null, 8, ["draft"])), [
              [ct, i.value === "Relation types"]
            ]) : E("", !0),
            y.value.has("Plugins") ? Qe((u(), j(Da, {
              key: 5,
              "board-id": e.boardId,
              draft: D.value,
              schema: w.value ?? m.value,
              options: z.value?.schema_options.plugins ?? [],
              configs: P.value,
              disabled: $.value,
              onConfigured: G[9] || (G[9] = (te) => {
                dt(), Ze();
              }),
              onRefresh: G[10] || (G[10] = (te) => Ze()),
              onValidity: G[11] || (G[11] = (te, we) => Tt("plugin:" + te, we))
            }, null, 8, ["board-id", "draft", "schema", "options", "configs", "disabled"])), [
              [ct, i.value === "Plugins"]
            ]) : E("", !0),
            y.value.has("Policy") ? Qe((u(), g("section", Lv, [
              b(Uc, {
                "board-id": e.boardId,
                draft: D.value,
                onValidity: G[12] || (G[12] = (te) => Tt("visibility", te))
              }, null, 8, ["board-id", "draft"])
            ], 512)), [
              [ct, i.value === "Policy"]
            ]) : E("", !0)
          ], 8, Fv))
        ], 544),
        i.value === "Review" && !q.value ? (u(), j(xu, {
          key: 2,
          draft: D.value,
          original: m.value.declaration,
          disabled: $.value || Q.value
        }, null, 8, ["draft", "original", "disabled"])) : E("", !0),
        i.value === "Review" && q.value && be.value.length ? (u(), j(Da, {
          key: 3,
          "board-id": e.boardId,
          draft: { plugins: be.value },
          schema: w.value ?? m.value,
          options: z.value?.schema_options.plugins.filter((te) => be.value.some((we) => we.use === te.plugin)) ?? [],
          configs: P.value,
          disabled: $.value,
          "activation-locked": "",
          onValidity: G[13] || (G[13] = (te, we) => Tt("pack-plugin:" + te, we))
        }, null, 8, ["board-id", "draft", "schema", "options", "configs", "disabled"])) : E("", !0),
        i.value === "Review" ? (u(), j(yv, {
          key: 4,
          declaration: ne.value?.declaration,
          plan: I.value,
          generation: m.value.generation,
          follows: so.value,
          "config-count": Object.keys(P.value).length,
          "pack-review": !!A.value
        }, {
          default: N(() => [
            A.value && q.value ? (u(), j(Sv, {
              key: 0,
              plan: A.value,
              request: q.value,
              original: m.value.declaration,
              disabled: $.value,
              onChange: G[14] || (G[14] = (te) => {
                ie.value = void 0, K.value = "";
              })
            }, null, 8, ["plan", "request", "original", "disabled"])) : E("", !0)
          ]),
          _: 1
        }, 8, ["declaration", "plan", "generation", "follows", "config-count", "pack-review"])) : E("", !0),
        i.value === "Review" && !I.value ? (u(), g("p", zv, "Review your draft to see the changes, their impact and any migration required.")) : E("", !0),
        Q.value ? (u(), g("p", Bv, "Checking existing values and dependencies…")) : E("", !0)
      ])) : E("", !0),
      O.value ? (u(), j(za, {
        key: 7,
        visible: n.value,
        label: "Install pack",
        busy: $.value,
        onClose: G[17] || (G[17] = (te) => n.value = !1)
      }, {
        default: N(() => [
          d("form", {
            class: "work-dialog-box work-stack",
            onSubmit: he(Bt, ["prevent"])
          }, [
            G[20] || (G[20] = d("h2", null, "Install a pack", -1)),
            G[21] || (G[21] = d("p", { class: "work-muted work-small" }, "Packs can be installed on an empty board. Review checks whether this board is eligible.", -1)),
            d("label", jv, [
              G[19] || (G[19] = R("Pack", -1)),
              b(r(ae), {
                modelValue: c.value,
                "onUpdate:modelValue": G[15] || (G[15] = (te) => c.value = te),
                "aria-label": "Pack to install",
                appendTo: "self",
                optionLabel: "title",
                optionValue: "id",
                optionDisabled: "disabled",
                options: M.value.map((te) => ({ ...te, disabled: te.plugins.some((we) => !we.installed) }))
              }, null, 8, ["modelValue", "options"])
            ]),
            M.value.length ? E("", !0) : (u(), g("p", qv, "No available packs were found.")),
            d("footer", Wv, [
              b(r(X), {
                label: "Cancel",
                severity: "secondary",
                outlined: "",
                onClick: G[16] || (G[16] = (te) => n.value = !1)
              }),
              b(r(X), {
                type: "submit",
                label: "Review pack",
                disabled: !c.value || $.value || W.value
              }, null, 8, ["disabled"])
            ])
          ], 32)
        ]),
        _: 1
      }, 8, ["visible", "busy"])) : E("", !0)
    ], 2));
  }
}), Gv = /* @__PURE__ */ ve({
  __name: "SettingsRoot",
  setup(e) {
    const l = ko(), t = wo();
    return yo(ja, (a) => t("navigate", { route: Ho(a) })), (a, o) => (u(), j(Kv, {
      "board-id": r(l).boardId ?? "",
      embedded: r(l).embedded,
      onDirtyChange: o[0] || (o[0] = (s) => r(t)("dirty-change", { dirty: s }))
    }, null, 8, ["board-id", "embedded"]));
  }
}), Yv = Vo(Gv, {
  type: "object",
  properties: {
    "board-id": { type: "string", default: "", description: "Board to administer." },
    embedded: { type: "boolean", default: !1, description: "Fits in a System detail pane." }
  }
});
Lo(import.meta.url, Yv);
//# sourceMappingURL=settings.js.map
