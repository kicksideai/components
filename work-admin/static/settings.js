import { inject as fo, defineComponent as ue, ref as j, useSlots as po, openBlock as c, createElementBlock as g, createElementVNode as d, createVNode as b, normalizeClass as ft, unref as r, withCtx as z, renderSlot as We, toDisplayString as D, createCommentVNode as E, createBlock as q, withDirectives as Qe, vShow as ut, computed as Y, watch as xe, onMounted as kl, onUnmounted as Ia, resolveComponent as Aa, Fragment as Z, renderList as ae, createTextVNode as M, resolveDynamicComponent as zl, onBeforeUnmount as it, useId as Xl, withKeys as Ae, withModifiers as be, normalizeStyle as bo, watchEffect as Pa, nextTick as ho, provide as yo } from "vue";
import { e as tt, u as go, b as ko, c as wo, a as Vo } from "./mount-DgmSMmP5.js";
import "pinia";
import { Icon as _ } from "@iconify/vue";
import oe from "primevue/select";
import { m as Bl, e as sa, s as he, f as $o, t as je, p as Ut, d as Jl, g as Dt, r as ra, w as $t, l as jl, h as Ke, i as Ct, b as at, u as Ra, j as Oa, k as Zl, n as Na, o as ge, q as wl, v as _t, x as xo, y as Ma, z as Co, A as Vt, B as So, _ as Fa, C as To, D as Eo, E as da, F as gt, G as Uo, H as ua, I as Do, J as ca, K as Io, L as va, M as Ao, a as Po, N as ma, O as Ro, P as Oo } from "./latestRequest-DpOFwcMD.js";
import H from "primevue/button";
import { api as No, on as Mo, host as Fo, define as Lo } from "@wippy-fe/proxy";
import Re from "primevue/tag";
import Le from "primevue/toggleswitch";
import Mt from "primevue/checkbox";
import de from "primevue/inputtext";
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
function bt(e, l, t) {
  const a = [.../* @__PURE__ */ new Set([e.x, l.x, ...t.flatMap((T) => [T.x, T.x + T.width])])].sort((T, X) => T - X), o = [.../* @__PURE__ */ new Set([e.y, l.y, ...t.flatMap((T) => [T.y, T.y + T.height])])].sort((T, X) => T - X);
  a.unshift(a[0] - 24), a.push(a.at(-1) + 24), o.unshift(o[0] - 24), o.push(o.at(-1) + 24);
  const s = a.length, v = o.indexOf(l.y) * s + a.indexOf(l.x), f = o.indexOf(e.y) * s + a.indexOf(e.x), m = (T) => ({ x: a[T % s], y: o[Math.floor(T / s)] }), i = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map(), u = [];
  function y(T) {
    u.push(T);
    let X = u.length - 1;
    for (; X; ) {
      const L = X - 1 >> 1;
      if (u[L].priority <= T.priority) break;
      u[X] = u[L], X = L;
    }
    u[X] = T;
  }
  function p() {
    const T = u[0], X = u.pop();
    if (u.length) {
      let L = 0;
      for (; L * 2 + 1 < u.length; ) {
        let S = L * 2 + 1;
        if (S + 1 < u.length && u[S + 1].priority < u[S].priority && S++, X.priority <= u[S].priority) break;
        u[L] = u[S], L = S;
      }
      u[L] = X;
    }
    return T;
  }
  const w = (T) => Math.abs(T.x - l.x) + Math.abs(T.y - l.y);
  for (const T of [0, 1]) {
    const X = f * 2 + T;
    i.set(X, 0), y({ key: X, cost: 0, priority: w(e) });
  }
  const x = /* @__PURE__ */ new Map(), I = /* @__PURE__ */ new Map();
  for (; u.length; ) {
    const T = p(), X = Math.floor(T.key / 2), L = T.key % 2;
    if (T.cost !== i.get(T.key)) continue;
    if (X === v) {
      const O = [];
      let F = T.key;
      for (; F !== void 0; )
        O.push(m(Math.floor(F / 2))), F = n.get(F);
      return La(O.reverse());
    }
    const S = m(X), U = X % s, A = Math.floor(X / s);
    for (const [O, F] of [[U > 0 ? X - 1 : -1, 0], [U + 1 < s ? X + 1 : -1, 0], [A > 0 ? X - s : -1, 1], [A + 1 < o.length ? X + s : -1, 1]]) {
      if (O < 0) continue;
      const P = m(O);
      if (x.has(O) || x.set(O, !t.some(($) => Dl(P, $))), !x.get(O)) continue;
      const B = `${Math.min(X, O)}:${Math.max(X, O)}`;
      if (I.has(B) || I.set(B, !t.some(($) => Ko(S, P, $))), !I.get(B)) continue;
      const V = T.cost + Math.abs(S.x - P.x) + Math.abs(S.y - P.y) + (L === F ? 0 : 18), le = O * 2 + F;
      V >= (i.get(le) ?? 1 / 0) || (i.set(le, V), n.set(le, T.key), y({ key: le, cost: V, priority: V + w(P) }));
    }
  }
  throw new Error("Process map has no collision-free route between its ports: " + JSON.stringify({ start: e, end: l, startInside: t.filter((T) => Dl(e, T)), endInside: t.filter((T) => Dl(l, T)) }));
}
function La(e) {
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
  if (e = La(e), !e.length) return "";
  let l = `M ${e[0].x} ${e[0].y}`;
  for (let a = 1; a < e.length - 1; a++) {
    const o = e[a - 1], s = e[a], v = e[a + 1], f = Math.hypot(s.x - o.x, s.y - o.y), m = Math.hypot(v.x - s.x, v.y - s.y), i = Math.min(8, f / 3, m / 3);
    i && (l += ` L ${s.x + (o.x - s.x) * i / f} ${s.y + (o.y - s.y) * i / f} Q ${s.x} ${s.y} ${s.x + (v.x - s.x) * i / m} ${s.y + (v.y - s.y) * i / m}`);
  }
  const t = e.at(-1);
  return l + ` L ${t.x} ${t.y}`;
}
function Go(e, l = {}, t = { width: 1400, height: 480 }) {
  const a = t.width < 750 || Bl(e).length > 8 ? "TB" : "LR", o = new sa.graphlib.Graph({ multigraph: !0 });
  o.setGraph({ rankdir: a, ranker: "network-simplex", acyclicer: "greedy", nodesep: 32, edgesep: 32, ranksep: 24, marginx: 32, marginy: 32 }), o.setDefaultEdgeLabel(() => ({}));
  const s = Bl(e), v = new Map(s.map((h, C) => [h.id, C])), f = e.states.map((h) => {
    const C = (e.transitions ?? []).filter((Te) => Te.from === "any" && Te.to === h.id), k = Ot(he(h)), W = Ot($o(h, e)), J = C.flatMap((Te) => Ot(je(Te) + " works from any state")), re = l.policy?.wip?.[h.id]?.limit, fe = re === void 0 ? 0 : jt(" · limit " + re), Se = Math.max(168, ...k.map((Te) => jt(Te) + 58), ...W.map((Te, pt) => jt(Te) + 32 + (pt === W.length - 1 ? fe : 0)), ...J.map((Te) => jt(Te) + 32)), Ne = Math.max(80, 42 + k.length * 18 + W.length * 16 + J.length * 18);
    return o.setNode(h.id, { width: Se + (a === "LR" ? 36 : 0), height: Ne + (a === "TB" ? 36 : 0) }), { state: h, x: 0, y: 0, width: Se, height: Ne, title: k, caption: W, badges: C, row: v.has(h.id) ? 0 : 1 };
  }), m = new Set(f.map((h) => h.state.id)), i = (e.transitions ?? []).flatMap((h) => h.from === "any" ? [] : h.from.filter((C) => m.has(C) && m.has(h.to)).map((C) => {
    const k = `${h.id}-${C}`, W = Ot(je(h)), J = Math.max(72, ...W.map((fe) => jt(fe) + 24)), re = Math.max(24, W.length * 16 + 10);
    return { transition: h, from: C, key: k, lines: W, width: J, height: re };
  })), n = /* @__PURE__ */ new Set(), u = /* @__PURE__ */ new Set(), y = new Set(i.filter((h) => h.from === h.transition.to || h.transition.to === e.initial || ["completed", "canceled"].includes(f.find((C) => C.state.id === h.from).state.category)).map((h) => h.key));
  function p(h) {
    if (!u.has(h)) {
      n.add(h);
      for (const C of i.filter((k) => k.from === h))
        y.has(C.key) || (n.has(C.transition.to) ? y.add(C.key) : p(C.transition.to));
      n.delete(h), u.add(h);
    }
  }
  p(e.initial);
  for (const h of f) p(h.state.id);
  for (const h of i) if (!y.has(h.key)) {
    const C = v.get(h.from), k = v.get(h.transition.to);
    o.setEdge(h.from, h.transition.to, { width: h.width, height: h.height, labelpos: "c", weight: C !== void 0 && k === C + 1 ? 100 : 1 }, h.key);
  }
  for (const h of e.transitions ?? []) if (h.from === "any" && m.has(e.initial) && m.has(h.to) && !v.has(h.to)) {
    const C = e.states.find((k) => k.id === h.to);
    o.setEdge(e.initial, h.to, { minlen: ["completed", "canceled"].includes(C.category) ? Math.max(1, s.length - 1) : 1 }, `any:${h.id}`);
  }
  const w = e.states.flatMap((h) => (h.regions ?? []).filter((C) => m.has(C.initial)).map((C, k) => {
    const W = `lane:${h.id}:${k}`;
    return o.setEdge(h.id, C.initial, {}, W), { state: h, region: C, key: W };
  }));
  if (!f.length) return { nodes: f, edges: [], parallels: [], main: s, direction: a, width: 320, height: 160 };
  sa.layout(o);
  for (const h of f) Object.assign(h, { x: o.node(h.state.id).x, y: o.node(h.state.id).y });
  const x = a === "TB", I = i.filter((h) => !y.has(h.key)).map((h) => o.edge({ v: h.from, w: h.transition.to, name: h.key })), T = [...f, ...I], X = Math.max(...T.map((h) => h.x + h.width / 2)), L = Math.max(...T.map((h) => h.y + h.height / 2)), S = (h) => f.find((C) => C.state.id === h), U = i.filter((h) => y.has(h.key)).sort((h, C) => {
    const k = x ? "y" : "x";
    return Math.abs(S(h.from)[k] - S(h.transition.to)[k]) - Math.abs(S(C.from)[k] - S(C.transition.to)[k]);
  }), A = /* @__PURE__ */ new Map(), O = Math.max(0, ...U.map((h) => h.width));
  let F = L + 32;
  for (const [h, C] of U.entries()) {
    const k = S(C.from), W = S(C.transition.to), J = x ? X + 16 + O + 28 + h * 18 : F + C.height / 2, re = x ? X + 16 + O / 2 : (k.x + W.x) / 2;
    let fe = x ? k.y + k.height / 2 + 18 : J;
    if (x) for (const Se of [...A.values()].sort((Ne, Te) => Ne.y - Te.y))
      fe + C.height / 2 + 10 > Se.y - Se.height / 2 - 10 && fe - C.height / 2 - 10 < Se.y + Se.height / 2 + 10 && (fe = Se.y + Se.height / 2 + 24 + C.height / 2);
    A.set(C.key, { x: re, y: fe, corridor: J, height: C.height }), F = J + C.height / 2 + 24;
  }
  const P = i.map((h) => ({ ...h, ...A.get(h.key) ?? o.edge({ v: h.from, w: h.transition.to, name: h.key }) })), B = (h, C) => ({ x: h.x - h.width / 2 - C, y: h.y - h.height / 2 - C, width: h.width + C * 2, height: h.height + C * 2 }), V = [...f.map((h) => B(h, 12)), ...P.map((h) => B(h, 10))], le = (h, C) => ({
    start: x ? { x: h.x, y: h.y + h.height / 2 } : { x: h.x + h.width / 2, y: h.y },
    end: x ? { x: C.x, y: C.y - C.height / 2 } : { x: C.x - C.width / 2, y: C.y }
  }), $ = (h, C) => x ? { x: h.x, y: h.y + C } : { x: h.x + C, y: h.y }, R = P.map((h) => {
    const C = f.find((Ye) => Ye.state.id === h.from), k = f.find((Ye) => Ye.state.id === h.transition.to), { start: W, end: J } = le(C, k), re = y.has(h.key), fe = $(W, 18), Se = $(J, -18), Ne = (re || !x ? h.width : h.height) / 2 + 10, Te = re ? { x: h.x + (x ? -Ne : Ne), y: h.y } : $(h, -Ne), pt = re ? { x: h.x + (x ? Ne : -Ne), y: h.y } : $(h, Ne);
    let st;
    if (re) {
      const { corridor: Ye } = A.get(h.key), ll = x ? { x: Ye, y: h.y } : { x: fe.x, y: Ye }, Bt = x ? { x: Ye, y: Se.y } : { x: Se.x, y: Ye };
      st = x ? [
        [W, ...bt(fe, Te, V)],
        [pt, ll, Bt, ...bt(Bt, Se, V), J]
      ] : [
        [W, ...bt(fe, ll, V), Te],
        [pt, ...bt(Bt, Se, V), J]
      ];
    } else st = [
      [W, ...bt(fe, Te, V)],
      [...bt(pt, Se, V), J]
    ];
    const Cl = re ? "return" : v.get(h.transition.to) === (v.get(h.from) ?? -2) + 1 ? "main" : "forward";
    return { ...h, points: st.flat(), segments: st, path: st.map(ol).join(" "), type: Cl, targetOffset: 0 };
  }), N = w.map((h) => {
    const C = f.find((fe) => fe.state.id === h.state.id), k = f.find((fe) => fe.state.id === h.region.initial), { start: W, end: J } = le(C, k), re = [W, ...bt($(W, 18), $(J, -18), V), J];
    return { state: h.state, key: h.key, points: re, path: ol(re) };
  }), Q = [...f.flatMap((h) => [{ x: h.x - h.width / 2, y: h.y - h.height / 2 }, { x: h.x + h.width / 2, y: h.y + h.height / 2 }]), ...R.flatMap((h) => [...h.points, { x: h.x - h.width / 2, y: h.y - h.height / 2 }, { x: h.x + h.width / 2, y: h.y + h.height / 2 }]), ...N.flatMap((h) => h.points)], ce = 32 - Math.min(...Q.map((h) => h.x)), pe = 32 - Math.min(...Q.map((h) => h.y)), ke = Math.max(...Q.map((h) => h.x)) + ce + 32, Ve = Math.max(...Q.map((h) => h.y)) + pe + 32, De = (h) => ({ x: h.x + ce, y: h.y + pe });
  for (const h of f) Object.assign(h, De(h));
  for (const h of R)
    Object.assign(h, De(h)), h.segments = h.segments.map((C) => C.map(De)), h.points = h.segments.flat(), h.path = h.segments.map(ol).join(" ");
  for (const h of N)
    h.points = h.points.map(De), h.path = ol(h.points);
  return { nodes: f, edges: R, parallels: N, main: s, direction: a, width: ke, height: Ve };
}
const za = Symbol("work-navigation");
function Yo() {
  return fo(za, () => {
  });
}
function Ho(e) {
  if (e.name === "boards") return "";
  const l = encodeURIComponent(e.board);
  return e.name === "settings" ? `${l}/settings` : l;
}
const It = (e) => `/api/v1/work/boards/${encodeURIComponent(e)}`, fa = (e) => ({ declaration: e.declaration, expected_generation: e.expected_generation, plugin_configs: e.plugin_configs }), kt = {
  packPlan: (e, l) => Ut(`${It(e)}/pack_plan`, l, "Pack plan"),
  packApply: (e, l, t) => Ut(`${It(e)}/pack_apply`, { ...l, key: t }, "Apply pack"),
  plan: (e, l) => Ut(`${It(e)}/plan_schema`, fa(l), "Schema plan"),
  apply: (e, l, t) => Ut(`${It(e)}/apply_schema`, { ...fa(l), key: t }, "Apply schema"),
  resume: (e) => Ut(`${It(e)}/resume_migration`, {}, "Resume migration"),
  configure: (e, l, t) => Ut(`${It(e)}/configure_plugin`, { plugin: l, config: t }, "Configure plugin")
}, Xo = { class: "work-definition" }, Jo = { class: "work-definition-head" }, Zo = { class: "work-definition-affordances" }, Qo = ["title"], _o = { class: "work-definition-code" }, ei = ["title"], ti = { class: "work-definition-kind" }, li = { class: "work-definition-flags" }, ai = { class: "work-definition-usage" }, oi = { class: "work-definition-actions" }, ii = {
  key: 0,
  class: "work-definition-description"
}, ni = { class: "work-definition-body work-stack" }, Vl = /* @__PURE__ */ ue({
  __name: "DefinitionRow",
  props: {
    title: {},
    code: {},
    kind: {},
    description: {}
  },
  setup(e) {
    const l = j(!1), t = po();
    return (a, o) => (c(), g("article", Xo, [
      d("header", Jo, [
        b(Jl, {
          as: "article",
          class: ft(["work-definition-toggle", { "work-definition-has-handle": r(t).handle }]),
          "aria-expanded": l.value,
          onActivate: o[0] || (o[0] = (s) => l.value = !l.value)
        }, {
          default: z(() => [
            d("span", Zo, [
              We(a.$slots, "handle"),
              b(r(_), {
                icon: l.value ? "tabler:chevron-down" : "tabler:chevron-right"
              }, null, 8, ["icon"])
            ]),
            d("span", {
              class: "work-row-title",
              title: e.title
            }, D(e.title), 9, Qo)
          ]),
          _: 3
        }, 8, ["class", "aria-expanded"]),
        d("span", _o, [
          e.code ? (c(), g("code", {
            key: 0,
            class: "work-mono",
            title: e.code
          }, D(e.code), 9, ei)) : E("", !0)
        ]),
        d("span", ti, [
          e.kind ? (c(), q(r(Re), {
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
        ]),
        d("div", oi, [
          We(a.$slots, "actions")
        ]),
        e.description ? (c(), g("p", ii, D(e.description), 1)) : E("", !0)
      ]),
      Qe(d("div", ni, [
        We(a.$slots, "default")
      ], 512), [
        [ut, l.value]
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
}, $l = /* @__PURE__ */ ue({
  __name: "DefinitionList",
  props: {
    count: {},
    columns: {}
  },
  setup(e) {
    return (l, t) => (c(), g("div", si, [
      d("div", {
        class: ft(["work-field-builder", "work-definitions-" + e.columns])
      }, [
        e.count > 3 ? (c(), g("div", ri, [
          t[0] || (t[0] = d("span", null, null, -1)),
          t[1] || (t[1] = d("span", null, "Name", -1)),
          e.columns !== "plugins" ? (c(), g("span", di, "Identifier")) : E("", !0),
          d("span", null, D(e.columns === "plugins" ? "State" : e.columns === "types" ? "Process" : "Kind"), 1),
          e.columns === "fields" || e.columns === "plugins" ? (c(), g("span", ui, "Details")) : E("", !0),
          e.columns !== "plugins" ? (c(), g("span", ci, D(e.columns === "fields" ? "Used by" : "Details"), 1)) : E("", !0),
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
  return e && (["int", "number", "dec", "time", "quantity"].includes(e.form) || e.index === "number") && l.push("lt", "lte", "gt", "gte", "between"), e?.form === "text" && e.type !== "option" && l.push("contains", "starts_with"), l;
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
}, Ba = /* @__PURE__ */ ue({
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
    const t = e, a = l, o = Y(() => t.inputId ?? `field-${t.field.code}`), s = Y(() => !!t.field.cardinality && t.field.cardinality !== "one"), v = Y(() => Array.isArray(t.modelValue) ? t.modelValue : []), f = Y(() => t.modelValue == null ? "" : typeof t.modelValue == "object" ? Dt(t.modelValue) : String(t.modelValue)), m = Y(() => {
      const C = t.modelValue;
      return C && typeof C == "object" && "ref" in C && Array.isArray(C.ref) ? String(C.ref[1] ?? "") : "";
    }), i = Y(() => t.disabled || ra(t.field)), n = j(!1), u = j(!1), y = j(!1), p = j(""), w = j(""), x = j([]), I = jl(), T = j([]);
    let X = 0, L;
    const S = /* @__PURE__ */ new Set();
    xe(v, (C) => {
      T.value = L ?? C.map((k, W) => T.value[W] ?? X++), L = void 0;
    }, { immediate: !0 });
    function U(C) {
      a("update:modelValue", C);
    }
    function A(C, k) {
      const W = [...v.value];
      W[C] = k, U(W);
    }
    function O(C, k) {
      k ? S.delete(C) : S.add(C), a("validity", !S.size);
    }
    function F(C) {
      S.delete(T.value[C]), a("validity", !S.size), L = T.value.filter((k, W) => W !== C), U(v.value.filter((k, W) => W !== C));
    }
    function P() {
      L = [...T.value, X++], U([...v.value, t.field.form === "bool" ? !1 : t.field.form === "record" ? {} : ""]);
    }
    function B(C) {
      const k = C.detail, W = k?.principal_id ?? k?.id;
      U(W ? { kind: k.type ?? "user", id: W } : void 0);
    }
    function V(C) {
      const k = C.detail;
      U(k?.thread_id ? { ref: ["component", k.thread_id] } : void 0);
    }
    const le = j("");
    let $ = "";
    xe(() => t.modelValue, (C) => {
      const k = JSON.stringify(C ?? {}, null, 2);
      k !== $ && ($ = k, le.value = k, p.value = "", a("validity", !0));
    }, { immediate: !0 });
    function R(C) {
      le.value = C;
      try {
        const k = JSON.parse(C);
        if (!k || typeof k != "object" || Array.isArray(k)) throw new Error("Enter a JSON object.");
        if (t.field.type === "rich_text" && !("type" in k && typeof k.type == "string")) throw new Error("The document needs a type.");
        $ = JSON.stringify(k, null, 2), p.value = "", a("validity", !0), U(k);
      } catch (k) {
        p.value = k instanceof Error ? k.message : "Invalid JSON.", a("validity", !1);
      }
    }
    function N(C) {
      if (!C) {
        a("validity", !0), U(void 0);
        return;
      }
      const k = Number.isFinite(Number(C)) && (t.field.form !== "int" || Number.isSafeInteger(Number(C)));
      a("validity", k), k && U(t.field.form === "int" ? Number(C) : C);
    }
    const Q = Y(() => t.field.config?.format === "date");
    function ce(C) {
      U(C ? Q.value ? C : new Date(C).toISOString() : void 0);
    }
    const pe = Y(() => {
      if (typeof t.modelValue != "string") return "";
      if (Q.value) return t.modelValue.slice(0, 10);
      const C = new Date(t.modelValue);
      return Number.isNaN(C.getTime()) ? "" : new Date(C.getTime() - C.getTimezoneOffset() * 6e4).toISOString().slice(0, 16);
    });
    function ke(C) {
      U(C.detail?.ref);
    }
    function Ve(C) {
      U(C.detail?.value);
    }
    let De;
    xe(w, () => {
      const C = I();
      if (clearTimeout(De), !w.value.trim()) {
        x.value = [];
        return;
      }
      De = setTimeout(async () => {
        try {
          const k = w.value.trim(), W = /^[A-Z][A-Z0-9]{1,9}-[0-9]+$/.test(k) ? [(await $t.item(t.boardId, { key: k })).item] : (await $t.query(t.boardId, { where: { field: "title", op: "contains", value: k }, limit: 8 })).items;
          C() && (x.value = W, p.value = "");
        } catch (k) {
          C() && (p.value = k instanceof Error ? k.message : "Could not search items.");
        }
      }, 200);
    });
    function h(C) {
      U({ board: t.boardId, item: C.id }), w.value = "", x.value = [];
    }
    kl(async () => {
      t.field.type === "principal" ? n.value = await tt("wc-principal-picker") : t.field.config?.target === "component" && (n.value = await tt("wc-component-picker"));
    });
    for (const [C, k] of [[() => t.editorTag, y], [() => t.linkTag, u]])
      xe(C, async (W, J, re) => {
        let fe = !0;
        if (re(() => {
          fe = !1;
        }), k.value = !1, W) {
          const Se = await tt(W);
          fe && (k.value = Se);
        }
      }, { immediate: !0 });
    return Ia(() => {
      clearTimeout(De), I();
    }), (C, k) => {
      const W = Aa("FieldControl", !0);
      return c(), g("div", pi, [
        r(ra)(e.field) ? (c(), g("output", {
          key: 0,
          id: o.value,
          class: "work-read-value"
        }, D(r(Dt)(e.modelValue, e.field)), 9, bi)) : s.value ? (c(), g("div", hi, [
          d("div", yi, [
            (c(!0), g(Z, null, ae(v.value, (J, re) => (c(), q(r(Re), {
              key: T.value[re],
              class: "kx-tag-sm",
              severity: "secondary"
            }, {
              default: z(() => [
                M(D(r(Dt)(J, e.field)) + " ", 1),
                b(r(H), {
                  type: "button",
                  class: "work-icon-button",
                  disabled: i.value,
                  "aria-label": "Remove value " + (re + 1),
                  onClick: (fe) => F(re),
                  severity: "secondary",
                  text: "",
                  size: "small"
                }, {
                  default: z(() => [
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
          (c(!0), g(Z, null, ae(v.value, (J, re) => (c(), g("div", {
            key: T.value[re],
            class: "work-stack work-tight"
          }, [
            b(W, {
              "board-id": e.boardId,
              field: { ...e.field, cardinality: "one" },
              "model-value": J,
              "input-id": o.value + "-" + T.value[re],
              disabled: i.value,
              "editor-tag": e.editorTag,
              "link-tag": e.linkTag,
              "onUpdate:modelValue": (fe) => A(re, fe),
              onValidity: (fe) => O(T.value[re], fe)
            }, null, 8, ["board-id", "field", "model-value", "input-id", "disabled", "editor-tag", "link-tag", "onUpdate:modelValue", "onValidity"])
          ]))), 128)),
          b(r(H), {
            label: "Add value",
            severity: "secondary",
            size: "small",
            disabled: i.value,
            onClick: P,
            outlined: ""
          }, {
            icon: z(() => [
              b(r(_), {
                icon: "tabler:plus",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled"])
        ])) : e.editorTag && y.value ? (c(), q(zl(e.editorTag), {
          key: 2,
          "board-id": e.boardId,
          value: JSON.stringify(e.modelValue ?? null),
          config: JSON.stringify(e.field.config ?? {}),
          readonly: i.value || void 0,
          onChange: Ve
        }, null, 40, ["board-id", "value", "config", "readonly"])) : e.linkTag && u.value ? (c(), q(zl(e.linkTag), {
          key: 3,
          "board-id": e.boardId,
          kind: e.field.config?.target ?? e.field.type,
          value: JSON.stringify(e.modelValue ?? null),
          readonly: i.value || void 0,
          onChange: ke
        }, null, 40, ["board-id", "kind", "value", "readonly"])) : e.field.type === "option" ? (c(), q(r(oe), {
          key: 4,
          placeholder: "Not set",
          inputId: o.value,
          "model-value": e.modelValue ?? "",
          disabled: i.value,
          "onUpdate:modelValue": k[0] || (k[0] = (J) => U(J || void 0)),
          appendTo: "self",
          optionLabel: "label",
          optionValue: "value",
          optionDisabled: "disabled",
          options: [{ label: "Not set", value: "", disabled: !1 }, ...(e.field.options ?? []).map((J) => ({ label: J.label ?? J.id, value: J.id, disabled: !1 }))]
        }, null, 8, ["inputId", "model-value", "disabled", "options"])) : e.field.form === "bool" ? (c(), g("label", gi, [
          b(r(Mt), {
            inputId: o.value,
            "model-value": e.modelValue === !0,
            disabled: i.value,
            "onUpdate:modelValue": k[1] || (k[1] = (J) => U(J)),
            binary: ""
          }, null, 8, ["inputId", "model-value", "disabled"]),
          M(D(e.modelValue === !0 ? "Yes" : e.modelValue === !1 ? "No" : "Not set"), 1)
        ])) : e.field.form === "int" ? (c(), q(r(Ge), {
          key: 6,
          inputId: o.value,
          "model-value": f.value === "" ? null : Number(f.value),
          disabled: i.value,
          "onUpdate:modelValue": k[2] || (k[2] = (J) => N(J == null ? "" : String(J))),
          useGrouping: !1
        }, null, 8, ["inputId", "model-value", "disabled"])) : e.field.form === "dec" ? (c(), q(r(de), {
          key: 7,
          id: o.value,
          inputmode: "decimal",
          "model-value": f.value,
          disabled: i.value,
          "onUpdate:modelValue": k[3] || (k[3] = (J) => N(J ?? ""))
        }, null, 8, ["id", "model-value", "disabled"])) : e.field.form === "time" ? (c(), q(r(de), {
          key: 8,
          id: o.value,
          type: Q.value ? "date" : "datetime-local",
          value: pe.value,
          disabled: i.value,
          onInput: k[4] || (k[4] = (J) => ce(J.target.value))
        }, null, 8, ["id", "type", "value", "disabled"])) : e.field.type === "principal" ? (c(), g("div", {
          key: 9,
          inert: i.value || void 0,
          class: "work-stack work-tight"
        }, [
          n.value ? (c(), g("wc-principal-picker", {
            key: 0,
            value: JSON.stringify(e.modelValue ?? {}),
            kinds: "user,group",
            onConfigChanged: B
          }, null, 40, wi)) : (c(), g("span", Vi, D(r(Dt)(e.modelValue, e.field)) + " · Person picker is unavailable.", 1))
        ], 8, ki)) : e.field.config?.target === "component" ? (c(), g("div", {
          key: 10,
          inert: i.value || void 0
        }, [
          n.value ? (c(), g("wc-component-picker", {
            key: 0,
            value: JSON.stringify({ thread_id: m.value }),
            onChange: V
          }, null, 40, xi)) : (c(), g("span", Ci, "Component picker is unavailable."))
        ], 8, $i)) : e.field.type === "item" ? (c(), g("div", Si, [
          b(r(Re), {
            class: "kx-tag-sm",
            severity: "secondary"
          }, {
            default: z(() => [
              M(D(r(Dt)(e.modelValue, e.field)), 1)
            ]),
            _: 1
          }),
          b(r(de), {
            id: o.value,
            modelValue: w.value,
            "onUpdate:modelValue": k[5] || (k[5] = (J) => w.value = J),
            disabled: i.value,
            placeholder: "Search a title or enter an item key",
            "aria-label": "Search items"
          }, null, 8, ["id", "modelValue", "disabled"]),
          d("div", Ti, [
            (c(!0), g(Z, null, ae(x.value, (J) => (c(), q(Jl, {
              key: J.id,
              class: "work-match-item",
              disabled: i.value,
              onActivate: (re) => h(J)
            }, {
              default: z(() => [
                d("code", Ei, D(J.key), 1),
                d("span", null, D(r(Dt)(J.values.title)), 1)
              ]),
              _: 2
            }, 1032, ["disabled", "onActivate"]))), 128))
          ]),
          e.modelValue ? (c(), q(r(H), {
            key: 0,
            label: "Clear reference",
            severity: "secondary",
            size: "small",
            disabled: i.value,
            onClick: k[6] || (k[6] = (J) => U(void 0)),
            outlined: ""
          }, {
            icon: z(() => [
              b(r(_), {
                icon: "tabler:list-check",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled"])) : E("", !0)
        ])) : e.field.form === "record" || e.field.type === "rich_text" || e.field.form === "quantity" || e.field.form === "ref" ? (c(), q(r(ml), {
          key: 12,
          id: o.value,
          "model-value": le.value,
          rows: "3",
          disabled: i.value,
          "aria-invalid": !!p.value,
          "onUpdate:modelValue": k[7] || (k[7] = (J) => R(J ?? ""))
        }, null, 8, ["id", "model-value", "disabled", "aria-invalid"])) : e.field.code === "description" ? (c(), q(r(ml), {
          key: 13,
          id: o.value,
          "model-value": f.value,
          rows: "4",
          disabled: i.value,
          "onUpdate:modelValue": k[8] || (k[8] = (J) => U(J))
        }, null, 8, ["id", "model-value", "disabled"])) : (c(), q(r(de), {
          key: 14,
          id: o.value,
          "model-value": f.value,
          disabled: i.value,
          "onUpdate:modelValue": k[9] || (k[9] = (J) => U(J))
        }, null, 8, ["id", "model-value", "disabled"])),
        p.value ? (c(), g("span", Ui, D(p.value), 1)) : E("", !0)
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
}, qt = /* @__PURE__ */ ue({
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
    const t = e, a = l, o = Y(() => "$actor" in Ke(t.modelValue) ? "actor" : "$now" in Ke(t.modelValue) ? "now" : "literal"), s = j(""), v = j("");
    xe(() => t.modelValue, (i) => {
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
        M(D(e.label), 1),
        b(r(oe), {
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
      o.value === "now" ? (c(), q(r(de), {
        key: 0,
        "aria-label": e.label + " time offset",
        value: r(Ke)(e.modelValue).$now,
        disabled: e.disabled,
        placeholder: "-P7D",
        onInput: n[1] || (n[1] = (u) => a("update:modelValue", { $now: u.target.value }))
      }, null, 8, ["aria-label", "value", "disabled"])) : o.value === "actor" ? (c(), g("span", Ai, "The signed-in actor’s id")) : e.multiple ? (c(), g("div", Pi, [
        d("label", Ri, [
          n[5] || (n[5] = M("Values as JSON (operands may appear in the list)", -1)),
          b(r(ml), {
            class: "work-mono",
            "aria-label": e.label + " values",
            value: s.value,
            disabled: e.disabled,
            rows: "2",
            onInput: n[2] || (n[2] = (u) => m(u.target.value))
          }, null, 8, ["aria-label", "value", "disabled"])
        ]),
        v.value ? (c(), g("p", Oi, D(v.value), 1)) : E("", !0)
      ])) : (c(), q(Ba, {
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
}, Gi = { class: "work-row work-wrap" }, Yi = /* @__PURE__ */ ue({
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
    const t = e, a = l, o = Y(() => t.path ?? "where"), s = Y(() => t.depth ?? 1), v = Y(() => ["and", "or", "not", "history", "match", "rel", "children"].find((B) => B in t.modelValue) ?? "field"), f = Y(() => mi(t.schema)), m = Y(() => f.value.find((B) => B.code === t.modelValue.field) ?? { code: "value", form: "text" }), i = Y(() => Ke(t.modelValue.history)), n = Y(() => f.value.find((B) => B.code === i.value.field) ?? { code: "history", form: "text" }), u = Y(() => Array.isArray(t.modelValue[v.value]) ? t.modelValue[v.value] : []), y = () => ({ field: "category", op: "eq", value: "unstarted" }), p = j(/* @__PURE__ */ new Set());
    function w(B, V) {
      V ? p.value.delete(B) : p.value.add(B), a("validity", p.value.size === 0);
    }
    xe(v, () => {
      p.value.clear(), a("validity", !0);
    });
    function x(B) {
      const V = /* @__PURE__ */ new Set();
      for (const le of p.value) {
        const $ = Number(le);
        !Number.isNaN($) && $ !== B && V.add(String($ > B ? $ - 1 : $));
      }
      p.value = V, a("validity", V.size === 0), T({ [v.value]: u.value.filter((le, $) => $ !== B) });
    }
    function I(B) {
      a("update:modelValue", B);
    }
    function T(B) {
      I({ ...t.modelValue, ...B });
    }
    function X(B) {
      I(B === "field" ? y() : B === "and" || B === "or" ? { [B]: [y()] } : B === "not" ? { not: y() } : B === "history" ? { history: { field: "state", changed: !0 } } : B === "match" ? { match: "" } : B === "children" ? { children: !0, q: "some", where: y() } : { rel: t.schema.compiled.relation_types?.[0]?.id ?? "", dir: "outward", q: "some", where: y() });
    }
    function L(B, V) {
      T({ [v.value]: u.value.map((le, $) => $ === B ? V : le) });
    }
    function S(B, V) {
      const le = { ...i.value };
      V === void 0 ? (delete le[B], w(B, !0)) : le[B] = V, T({ history: le });
    }
    function U(B) {
      p.value.clear(), a("validity", !0);
      const V = { ...i.value };
      delete V.was, delete V.changed, delete V.from, delete V.to, V[B] = B === "changed" ? !0 : "", T({ history: V });
    }
    const A = { code: "actor", form: "text" }, O = { code: "at", form: "time" }, F = Y(() => Array.isArray(i.value.during) ? i.value.during : []);
    function P(B, V) {
      const le = [...F.value];
      le[B] = V, S("during", le);
    }
    return (B, V) => {
      const le = Aa("FilterNode", !0);
      return c(), g("fieldset", {
        class: "work-filter-node",
        disabled: e.disabled
      }, [
        d("legend", Mi, D(o.value), 1),
        d("label", Fi, [
          V[21] || (V[21] = M("Condition", -1)),
          b(r(oe), {
            "aria-label": o.value + " condition",
            "model-value": v.value,
            "onUpdate:modelValue": V[0] || (V[0] = ($) => X($)),
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            optionDisabled: "disabled",
            options: [{ label: "Field", value: "field", disabled: !1 }, ...["and", "or", "not", "history", "rel", "children", "match"].map(($) => ({ label: $, value: $, disabled: s.value >= 6 && ["and", "or", "not", "rel", "children"].includes($) }))]
          }, null, 8, ["aria-label", "model-value", "options"])
        ]),
        v.value === "and" || v.value === "or" ? (c(), g(Z, { key: 0 }, [
          (c(!0), g(Z, null, ae(u.value, ($, R) => (c(), g("div", {
            key: R,
            class: "work-stack work-tight"
          }, [
            b(le, {
              "board-id": e.boardId,
              schema: e.schema,
              "model-value": $,
              path: o.value + "." + v.value + "[" + R + "]",
              depth: s.value + 1,
              "onUpdate:modelValue": (N) => L(R, N),
              onValidity: (N) => w(String(R), N)
            }, null, 8, ["board-id", "schema", "model-value", "path", "depth", "onUpdate:modelValue", "onValidity"]),
            b(r(H), {
              label: "Remove condition",
              size: "small",
              severity: "secondary",
              onClick: (N) => x(R),
              outlined: ""
            }, {
              icon: z(() => [
                b(r(_), {
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
            onClick: V[1] || (V[1] = ($) => T({ [v.value]: [...u.value, y()] })),
            outlined: ""
          }, {
            icon: z(() => [
              b(r(_), {
                icon: "tabler:plus",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled"])
        ], 64)) : v.value === "not" ? (c(), q(le, {
          key: 1,
          "board-id": e.boardId,
          schema: e.schema,
          "model-value": r(Ke)(e.modelValue.not),
          path: o.value + ".not",
          depth: s.value + 1,
          "onUpdate:modelValue": V[2] || (V[2] = ($) => T({ not: $ })),
          onValidity: V[3] || (V[3] = ($) => w("nested", $))
        }, null, 8, ["board-id", "schema", "model-value", "path", "depth"])) : v.value === "field" ? (c(), g(Z, { key: 2 }, [
          d("div", Li, [
            d("label", null, [
              V[22] || (V[22] = M("Field", -1)),
              b(r(oe), {
                "aria-label": o.value + " field",
                "model-value": e.modelValue.field,
                "onUpdate:modelValue": V[4] || (V[4] = ($) => T({ field: $, op: "eq", value: void 0 })),
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                optionDisabled: "disabled",
                options: [...(f.value ?? []).map(($) => ({ label: r(Ct)($), value: $.code, disabled: !1 }))]
              }, null, 8, ["aria-label", "model-value", "options"])
            ]),
            d("label", null, [
              V[23] || (V[23] = M("Operator", -1)),
              b(r(oe), {
                "aria-label": o.value + " operator",
                "model-value": e.modelValue.op,
                "onUpdate:modelValue": V[5] || (V[5] = ($) => T({ op: $, value: $ === "is_null" ? !0 : void 0 })),
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
            "onUpdate:modelValue": V[6] || (V[6] = ($) => T({ value: $ })),
            onValidity: V[7] || (V[7] = ($) => w("value", $))
          }, null, 8, ["board-id", "field", "model-value", "multiple", "label"])
        ], 64)) : v.value === "match" ? (c(), g("label", zi, [
          V[24] || (V[24] = M("Search", -1)),
          b(r(de), {
            "aria-label": o.value + " search",
            value: e.modelValue.match,
            onInput: V[8] || (V[8] = ($) => T({ match: $.target.value }))
          }, null, 8, ["aria-label", "value"])
        ])) : v.value === "history" ? (c(), g(Z, { key: 4 }, [
          d("div", Bi, [
            d("label", null, [
              V[25] || (V[25] = M("Field", -1)),
              b(r(oe), {
                "aria-label": o.value + " history field",
                "model-value": i.value.field,
                "onUpdate:modelValue": V[9] || (V[9] = ($) => S("field", $)),
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                optionDisabled: "disabled",
                options: [...(f.value ?? []).map(($) => ({ label: r(Ct)($), value: $.code, disabled: !1 }))]
              }, null, 8, ["aria-label", "model-value", "options"])
            ]),
            d("label", null, [
              V[26] || (V[26] = M("History", -1)),
              b(r(oe), {
                "aria-label": o.value + " history mode",
                "model-value": i.value.changed ? "changed" : "was",
                "onUpdate:modelValue": V[10] || (V[10] = ($) => U($)),
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                optionDisabled: "disabled",
                options: [{ label: "Changed", value: "changed", disabled: !1 }, { label: "Was", value: "was", disabled: !1 }]
              }, null, 8, ["aria-label", "model-value"])
            ])
          ]),
          i.value.changed ? (c(), g(Z, { key: 0 }, ae(["from", "to"], ($) => d("div", { key: $ }, [
            d("label", ji, [
              b(r(Mt), {
                "model-value": $ in i.value,
                "aria-label": "Constrain " + $,
                "onUpdate:modelValue": (R) => S($, R ? "" : void 0),
                binary: ""
              }, null, 8, ["model-value", "aria-label", "onUpdate:modelValue"]),
              M(D($), 1)
            ]),
            $ in i.value ? (c(), q(qt, {
              key: 0,
              "board-id": e.boardId,
              field: n.value,
              "model-value": i.value[$],
              label: o.value + " history " + $,
              "onUpdate:modelValue": (R) => S($, R),
              onValidity: (R) => w($, R)
            }, null, 8, ["board-id", "field", "model-value", "label", "onUpdate:modelValue", "onValidity"])) : E("", !0)
          ])), 64)) : (c(), q(qt, {
            key: 1,
            "board-id": e.boardId,
            field: n.value,
            "model-value": i.value.was,
            label: o.value + " history was",
            "onUpdate:modelValue": V[11] || (V[11] = ($) => S("was", $)),
            onValidity: V[12] || (V[12] = ($) => w("was", $))
          }, null, 8, ["board-id", "field", "model-value", "label"])),
          d("label", qi, [
            b(r(Mt), {
              "model-value": "by" in i.value,
              "aria-label": "Constrain actor",
              "onUpdate:modelValue": V[13] || (V[13] = ($) => S("by", $ ? { $actor: "id" } : void 0)),
              binary: ""
            }, null, 8, ["model-value"]),
            V[27] || (V[27] = M("By actor", -1))
          ]),
          "by" in i.value ? (c(), q(qt, {
            key: 2,
            "board-id": e.boardId,
            field: A,
            "model-value": i.value.by,
            label: o.value + " history by",
            "onUpdate:modelValue": V[14] || (V[14] = ($) => S("by", $))
          }, null, 8, ["board-id", "model-value", "label"])) : E("", !0),
          d("label", Wi, [
            b(r(Mt), {
              "model-value": "during" in i.value,
              "aria-label": "Constrain time window",
              "onUpdate:modelValue": V[15] || (V[15] = ($) => S("during", $ ? [{ $now: "-P30D" }, { $now: "P0D" }] : void 0)),
              binary: ""
            }, null, 8, ["model-value"]),
            V[28] || (V[28] = M("During", -1))
          ]),
          "during" in i.value ? (c(), g("div", Ki, [
            (c(), g(Z, null, ae(["start", "end"], ($, R) => b(qt, {
              key: $,
              "board-id": e.boardId,
              field: O,
              "model-value": F.value[R],
              label: o.value + " during " + $,
              "onUpdate:modelValue": (N) => P(R, N)
            }, null, 8, ["board-id", "model-value", "label", "onUpdate:modelValue"])), 64))
          ])) : E("", !0)
        ], 64)) : (c(), g(Z, { key: 5 }, [
          d("div", Gi, [
            v.value === "rel" ? (c(), g(Z, { key: 0 }, [
              d("label", null, [
                V[29] || (V[29] = M("Relation", -1)),
                b(r(oe), {
                  "model-value": e.modelValue.rel,
                  "onUpdate:modelValue": V[16] || (V[16] = ($) => T({ rel: $ })),
                  appendTo: "self",
                  optionLabel: "label",
                  optionValue: "value",
                  optionDisabled: "disabled",
                  options: [...(e.schema.compiled.relation_types ?? []).map(($) => ({ label: $.outward ?? $.id, value: $.id, disabled: !1 }))]
                }, null, 8, ["model-value", "options"])
              ]),
              d("label", null, [
                V[30] || (V[30] = M("Direction", -1)),
                b(r(oe), {
                  "model-value": e.modelValue.dir,
                  "onUpdate:modelValue": V[17] || (V[17] = ($) => T({ dir: $ })),
                  appendTo: "self",
                  optionLabel: "label",
                  optionValue: "value",
                  optionDisabled: "disabled",
                  options: [{ label: "Outward", value: "outward", disabled: !1 }, { label: "Inward", value: "inward", disabled: !1 }]
                }, null, 8, ["model-value"])
              ])
            ], 64)) : E("", !0),
            d("label", null, [
              V[31] || (V[31] = M("Quantifier", -1)),
              b(r(oe), {
                "model-value": e.modelValue.q,
                "onUpdate:modelValue": V[18] || (V[18] = ($) => T({ q: $ })),
                appendTo: "self",
                options: ["some", "every", "none"]
              }, null, 8, ["model-value"])
            ])
          ]),
          b(le, {
            "board-id": e.boardId,
            schema: e.schema,
            "model-value": r(Ke)(e.modelValue.where),
            path: o.value + ".where",
            depth: s.value + 1,
            "onUpdate:modelValue": V[19] || (V[19] = ($) => T({ where: $ })),
            onValidity: V[20] || (V[20] = ($) => w("nested", $))
          }, null, 8, ["board-id", "schema", "model-value", "path", "depth"])
        ], 64))
      ], 8, Ni);
    };
  }
}), Hi = { class: "work-stack work-tight" }, Xi = { class: "work-row work-small" }, _l = /* @__PURE__ */ ue({
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
    function v(m, i) {
      i ? s.delete(m) : s.add(m), a("validity", !s.size);
    }
    function f(m) {
      a("update:modelValue", m ? { field: t.draft.fields?.[0]?.code ?? "state", op: "eq" } : void 0), m || (s.clear(), a("validity", !0));
    }
    return it(() => a("validity", !0)), (m, i) => (c(), g("section", Hi, [
      d("label", Xi, [
        b(r(Le), {
          "model-value": e.modelValue != null,
          "aria-label": e.label,
          "onUpdate:modelValue": f
        }, null, 8, ["model-value", "aria-label"]),
        M(D(e.label), 1)
      ]),
      e.modelValue != null ? (c(), q(Yi, {
        key: 0,
        schema: o.value,
        "board-id": e.boardId ?? "",
        "model-value": r(Ke)(e.modelValue),
        path: e.label,
        "onUpdate:modelValue": i[0] || (i[0] = (n) => a("update:modelValue", n)),
        onValidity: i[1] || (i[1] = (n) => v("structured", n))
      }, null, 8, ["schema", "board-id", "model-value", "path"])) : E("", !0),
      e.modelValue != null ? (c(), q(at, {
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
}, ea = /* @__PURE__ */ ue({
  __name: "PrincipalsPicker",
  props: {
    modelValue: {},
    label: {},
    kinds: {},
    boardId: {}
  },
  emits: ["update:modelValue"],
  setup(e, { emit: l }) {
    const t = e, a = l, o = j(!1), s = j(0), v = Y(() => t.modelValue ?? []), { principalLabel: f, rememberPrincipal: m, nameError: i } = Ra(() => t.boardId ?? "", () => v.value);
    kl(async () => {
      o.value = await tt("wc-principal-picker");
    });
    function n(u) {
      const y = u.detail, p = y?.principal_id ?? y?.id;
      if (!p) return;
      const w = { kind: y.type ?? "user", id: p };
      y.label && m(w, y.label), v.value.some((x) => x.id === p && x.kind === w.kind) || a("update:modelValue", [...v.value, w]), s.value++;
    }
    return (u, y) => (c(), g(Z, null, [
      r(i) ? (c(), g("p", Ji, D(r(i)), 1)) : E("", !0),
      d("section", {
        class: "work-stack work-tight work-principals-picker",
        "aria-label": e.label
      }, [
        d("h4", Qi, D(e.label), 1),
        v.value.length ? (c(), g("div", _i, [
          (c(!0), g(Z, null, ae(v.value, (p, w) => (c(), q(r(Re), {
            key: p.kind + p.id,
            severity: "secondary",
            class: "kx-tag-sm"
          }, {
            default: z(() => [
              M(D(r(f)(p)), 1),
              b(r(H), {
                text: "",
                severity: "secondary",
                size: "small",
                "aria-label": "Remove " + r(f)(p),
                onClick: (x) => a("update:modelValue", v.value.filter((I, T) => T !== w))
              }, {
                default: z(() => [
                  b(r(_), { icon: "tabler:x" })
                ]),
                _: 1
              }, 8, ["aria-label", "onClick"])
            ]),
            _: 2
          }, 1024))), 128))
        ])) : E("", !0),
        o.value ? (c(), g("wc-principal-picker", {
          key: s.value,
          kinds: e.kinds ?? "user,group",
          onConfigChanged: n
        }, null, 40, en)) : (c(), g("p", tn, "People and group picker is unavailable."))
      ], 8, Zi)
    ], 64));
  }
}), ln = { class: "work-stack work-tight" }, ja = /* @__PURE__ */ ue({
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
      b(at, {
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
function ot() {
  return ot = Object.assign ? Object.assign.bind() : function(e) {
    for (var l = 1; l < arguments.length; l++) {
      var t = arguments[l];
      for (var a in t) ({}).hasOwnProperty.call(t, a) && (e[a] = t[a]);
    }
    return e;
  }, ot.apply(null, arguments);
}
function pa(e, l) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var a = Object.getOwnPropertySymbols(e);
    l && (a = a.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), t.push.apply(t, a);
  }
  return t;
}
function et(e) {
  for (var l = 1; l < arguments.length; l++) {
    var t = arguments[l] != null ? arguments[l] : {};
    l % 2 ? pa(Object(t), !0).forEach(function(a) {
      an(e, a, t[a]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : pa(Object(t)).forEach(function(a) {
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
function lt(e) {
  if (typeof window < "u" && window.navigator)
    return !!/* @__PURE__ */ navigator.userAgent.match(e);
}
var nt = lt(/(?:Trident.*rv[ :]?11\.|msie|iemobile|Windows Phone)/i), el = lt(/Edge/i), ba = lt(/firefox/i), Ht = lt(/safari/i) && !lt(/chrome/i) && !lt(/android/i), ta = lt(/iP(ad|od|hone)/i), qa = lt(/chrome/i) && lt(/android/i), Wa = {
  capture: !1,
  passive: !1
};
function me(e, l, t) {
  e.addEventListener(l, t, !nt && Wa);
}
function ve(e, l, t) {
  e.removeEventListener(l, t, !nt && Wa);
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
function Ka(e) {
  return e.host && e !== document && e.host.nodeType && e.host !== e ? e.host : e.parentNode;
}
function Je(e, l, t, a) {
  if (e) {
    t = t || document;
    do {
      if (l != null && (l[0] === ">" ? e.parentNode === t && fl(e, l) : fl(e, l)) || a && e === t)
        return e;
      if (e === t) break;
    } while (e = Ka(e));
  }
  return null;
}
var ha = /\s+/g;
function ze(e, l, t) {
  if (e && l)
    if (e.classList)
      e.classList[t ? "add" : "remove"](l);
    else {
      var a = (" " + e.className + " ").replace(ha, " ").replace(" " + l + " ", " ");
      e.className = (a + (t ? " " + l : "")).replace(ha, " ");
    }
}
function ie(e, l, t) {
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
      var a = ie(e, "transform");
      a && a !== "none" && (t = a + " " + t);
    } while (!l && (e = e.parentNode));
  var o = window.DOMMatrix || window.WebKitCSSMatrix || window.CSSMatrix || window.MSCSSMatrix;
  return o && new o(t);
}
function Ga(e, l, t) {
  if (e) {
    var a = e.getElementsByTagName(l), o = 0, s = a.length;
    if (t)
      for (; o < s; o++)
        t(a[o], o);
    return a;
  }
  return [];
}
function _e() {
  var e = document.scrollingElement;
  return e || document.documentElement;
}
function Ue(e, l, t, a, o) {
  if (!(!e.getBoundingClientRect && e !== window)) {
    var s, v, f, m, i, n, u;
    if (e !== window && e.parentNode && e !== _e() ? (s = e.getBoundingClientRect(), v = s.top, f = s.left, m = s.bottom, i = s.right, n = s.height, u = s.width) : (v = 0, f = 0, m = window.innerHeight, i = window.innerWidth, n = window.innerHeight, u = window.innerWidth), (l || t) && e !== window && (o = o || e.parentNode, !nt))
      do
        if (o && o.getBoundingClientRect && (ie(o, "transform") !== "none" || t && ie(o, "position") !== "static")) {
          var y = o.getBoundingClientRect();
          v -= y.top + parseInt(ie(o, "border-top-width")), f -= y.left + parseInt(ie(o, "border-left-width")), m = v + s.height, i = f + s.width;
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
function ya(e, l, t) {
  for (var a = mt(e, !0), o = Ue(e)[l]; a; ) {
    var s = Ue(a)[t], v = void 0;
    if (v = o >= s, !v) return a;
    if (a === _e()) break;
    a = mt(a, !1);
  }
  return !1;
}
function zt(e, l, t, a) {
  for (var o = 0, s = 0, v = e.children; s < v.length; ) {
    if (v[s].style.display !== "none" && v[s] !== ne.ghost && (a || v[s] !== ne.dragged) && Je(v[s], t.draggable, e, !1)) {
      if (o === l)
        return v[s];
      o++;
    }
    s++;
  }
  return null;
}
function la(e, l) {
  for (var t = e.lastElementChild; t && (t === ne.ghost || ie(t, "display") === "none" || l && !fl(t, l)); )
    t = t.previousElementSibling;
  return t || null;
}
function qe(e, l) {
  var t = 0;
  if (!e || !e.parentNode)
    return -1;
  for (; e = e.previousElementSibling; )
    e.nodeName.toUpperCase() !== "TEMPLATE" && e !== ne.clone && (!l || fl(e, l)) && t++;
  return t;
}
function ga(e) {
  var l = 0, t = 0, a = _e();
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
function mt(e, l) {
  if (!e || !e.getBoundingClientRect) return _e();
  var t = e, a = !1;
  do
    if (t.clientWidth < t.scrollWidth || t.clientHeight < t.scrollHeight) {
      var o = ie(t);
      if (t.clientWidth < t.scrollWidth && (o.overflowX == "auto" || o.overflowX == "scroll") || t.clientHeight < t.scrollHeight && (o.overflowY == "auto" || o.overflowY == "scroll")) {
        if (!t.getBoundingClientRect || t === document.body) return _e();
        if (a || l) return t;
        a = !0;
      }
    }
  while (t = t.parentNode);
  return _e();
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
function Ya(e, l) {
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
function Ha(e, l, t) {
  e.scrollLeft += l, e.scrollTop += t;
}
function Xa(e) {
  var l = window.Polymer, t = window.jQuery || window.Zepto;
  return l && l.dom ? l.dom(e).cloneNode(!0) : t ? t(e).clone(!0)[0] : e.cloneNode(!0);
}
function Ja(e, l, t) {
  var a = {};
  return Array.from(e.children).forEach(function(o) {
    var s, v, f, m;
    if (!(!Je(o, l.draggable, e, !1) || o.animated || o === t)) {
      var i = Ue(o);
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
          if (!(ie(o, "display") === "none" || o === ne.ghost)) {
            e.push({
              target: o,
              rect: Ue(o)
            });
            var s = et({}, e[e.length - 1].rect);
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
        var m = 0, i = f.target, n = i.fromRect, u = Ue(i), y = i.prevFromRect, p = i.prevToRect, w = f.rect, x = Ft(i, !0);
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
        ie(a, "transition", ""), ie(a, "transform", "");
        var f = Ft(this.el), m = f && f.a, i = f && f.d, n = (o.left - s.left) / (m || 1), u = (o.top - s.top) / (i || 1);
        a.animatingX = !!n, a.animatingY = !!u, ie(a, "transform", "translate3d(" + n + "px," + u + "px,0)"), this.forRepaintDummy = fn(a), ie(a, "transition", "transform " + v + "ms" + (this.options.easing ? " " + this.options.easing : "")), ie(a, "transform", "translate3d(0,0,0)"), typeof a.animated == "number" && clearTimeout(a.animated), a.animated = setTimeout(function() {
          ie(a, "transition", ""), ie(a, "transform", ""), a.animated = !1, a.animatingX = !1, a.animatingY = !1;
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
      t[v.pluginName] && (t[v.pluginName][s] && t[v.pluginName][s](et({
        sortable: t
      }, a)), t.options[v.pluginName] && t[v.pluginName][l] && t[v.pluginName][l](et({
        sortable: t
      }, a)));
    });
  },
  initializePlugins: function(l, t, a, o) {
    At.forEach(function(f) {
      var m = f.pluginName;
      if (!(!l.options[m] && !f.initializeByDefault)) {
        var i = new f(l, t, l.options);
        i.sortable = l, i.options = l.options, l[m] = i, ot(a, i.defaults);
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
      typeof o.eventProperties == "function" && ot(a, o.eventProperties.call(t[o.pluginName], l));
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
    var x, I = l.options, T = "on" + a.charAt(0).toUpperCase() + a.substr(1);
    window.CustomEvent && !nt && !el ? x = new CustomEvent(a, {
      bubbles: !0,
      cancelable: !0
    }) : (x = document.createEvent("Event"), x.initEvent(a, !0, !0)), x.to = v || t, x.from = f || t, x.item = o || t, x.clone = s, x.oldIndex = m, x.newIndex = i, x.oldDraggableIndex = n, x.newDraggableIndex = u, x.originalEvent = y, x.pullMode = p ? p.lastPutMode : void 0;
    var X = et(et({}, w), tl.getEventProperties(a, l));
    for (var L in X)
      x[L] = X[L];
    t && t.dispatchEvent(x), I[T] && I[T].call(l, x);
  }
}
var hn = ["evt"], Me = function(l, t) {
  var a = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, o = a.evt, s = on(a, hn);
  tl.pluginEvent.bind(ne)(l, t, et({
    dragEl: G,
    parentEl: Ce,
    ghostEl: se,
    rootEl: we,
    nextEl: wt,
    lastDownEl: dl,
    cloneEl: $e,
    cloneHidden: vt,
    dragStarted: Kt,
    putSortable: Ie,
    activeSortable: ne.active,
    originalEvent: o,
    oldIndex: Nt,
    oldDraggableIndex: Jt,
    newIndex: Be,
    newDraggableIndex: ct,
    hideGhostForTarget: eo,
    unhideGhostForTarget: to,
    cloneNowHidden: function() {
      vt = !0;
    },
    cloneNowShown: function() {
      vt = !1;
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
  bn(et({
    putSortable: Ie,
    cloneEl: $e,
    targetEl: G,
    rootEl: we,
    oldIndex: Nt,
    oldDraggableIndex: Jt,
    newIndex: Be,
    newDraggableIndex: ct
  }, e));
}
var G, Ce, se, we, wt, dl, $e, vt, Nt, Be, Jt, ct, il, Ie, Rt = !1, pl = !1, bl = [], ht, Xe, Pl, Rl, ka, wa, Kt, Pt, Zt, Qt = !1, nl = !1, ul, Pe, Ol = [], Wl = !1, hl = [], xl = typeof document < "u", sl = ta, Va = el || nt ? "cssFloat" : "float", yn = xl && !qa && !ta && "draggable" in document.createElement("div"), Za = (function() {
  if (xl) {
    if (nt)
      return !1;
    var e = document.createElement("x");
    return e.style.cssText = "pointer-events:auto", e.style.pointerEvents === "auto";
  }
})(), Qa = function(l, t) {
  var a = ie(l), o = parseInt(a.width) - parseInt(a.paddingLeft) - parseInt(a.paddingRight) - parseInt(a.borderLeftWidth) - parseInt(a.borderRightWidth), s = zt(l, 0, t), v = zt(l, 1, t), f = s && ie(s), m = v && ie(v), i = f && parseInt(f.marginLeft) + parseInt(f.marginRight) + Ue(s).width, n = m && parseInt(m.marginLeft) + parseInt(m.marginRight) + Ue(v).width;
  if (a.display === "flex")
    return a.flexDirection === "column" || a.flexDirection === "column-reverse" ? "vertical" : "horizontal";
  if (a.display === "grid")
    return a.gridTemplateColumns.split(" ").length <= 1 ? "vertical" : "horizontal";
  if (s && f.float && f.float !== "none") {
    var u = f.float === "left" ? "left" : "right";
    return v && (m.clear === "both" || m.clear === u) ? "vertical" : "horizontal";
  }
  return s && (f.display === "block" || f.display === "flex" || f.display === "table" || f.display === "grid" || i >= o && a[Va] === "none" || v && a[Va] === "none" && i + n > o) ? "vertical" : "horizontal";
}, gn = function(l, t, a) {
  var o = a ? l.left : l.top, s = a ? l.right : l.bottom, v = a ? l.width : l.height, f = a ? t.left : t.top, m = a ? t.right : t.bottom, i = a ? t.width : t.height;
  return o === f || s === m || o + v / 2 === f + i / 2;
}, kn = function(l, t) {
  var a;
  return bl.some(function(o) {
    var s = o[Fe].options.emptyInsertThreshold;
    if (!(!s || la(o))) {
      var v = Ue(o), f = l >= v.left - s && l <= v.right + s, m = t >= v.top - s && t <= v.bottom + s;
      if (f && m)
        return a = o;
    }
  }), a;
}, _a = function(l) {
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
}, eo = function() {
  !Za && se && ie(se, "display", "none");
}, to = function() {
  !Za && se && ie(se, "display", "");
};
xl && !qa && document.addEventListener("click", function(e) {
  if (pl)
    return e.preventDefault(), e.stopPropagation && e.stopPropagation(), e.stopImmediatePropagation && e.stopImmediatePropagation(), pl = !1, !1;
}, !0);
var yt = function(l) {
  if (G) {
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
  G && G.parentNode[Fe]._isOutsideThisEl(l.target);
};
function ne(e, l) {
  if (!(e && e.nodeType && e.nodeType === 1))
    throw "Sortable: `el` must be an HTMLElement, not ".concat({}.toString.call(e));
  this.el = e, this.options = l = ot({}, l), e[Fe] = this;
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
      return Qa(e, this.options);
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
    supportPointer: ne.supportPointer !== !1 && "PointerEvent" in window && (!Ht || ta),
    emptyInsertThreshold: 5
  };
  tl.initializePlugins(this, e, t);
  for (var a in t)
    !(a in l) && (l[a] = t[a]);
  _a(l);
  for (var o in this)
    o.charAt(0) === "_" && typeof this[o] == "function" && (this[o] = this[o].bind(this));
  this.nativeDraggable = l.forceFallback ? !1 : yn, this.nativeDraggable && (this.options.touchStartThreshold = 1), l.supportPointer ? me(e, "pointerdown", this._onTapStart) : (me(e, "mousedown", this._onTapStart), me(e, "touchstart", this._onTapStart)), this.nativeDraggable && (me(e, "dragover", this), me(e, "dragenter", this)), bl.push(this.el), l.store && l.store.get && this.sort(l.store.get(this) || []), ot(this, mn());
}
ne.prototype = /** @lends Sortable.prototype */
{
  constructor: ne,
  _isOutsideThisEl: function(l) {
    !this.el.contains(l) && l !== this.el && (Pt = null);
  },
  _getDirection: function(l, t) {
    return typeof this.options.direction == "function" ? this.options.direction.call(this, l, t, G) : this.options.direction;
  },
  _onTapStart: function(l) {
    if (l.cancelable) {
      var t = this, a = this.el, o = this.options, s = o.preventOnFilter, v = l.type, f = l.touches && l.touches[0] || l.pointerType && l.pointerType === "touch" && l, m = (f || l).target, i = l.target.shadowRoot && (l.path && l.path[0] || l.composedPath && l.composedPath()[0]) || m, n = o.filter;
      if (Un(a), !G && !(/mousedown|pointerdown/.test(v) && l.button !== 0 || o.disabled) && !i.isContentEditable && !(!this.nativeDraggable && Ht && m && m.tagName.toUpperCase() === "SELECT") && (m = Je(m, o.draggable, a, !1), !(m && m.animated) && dl !== m)) {
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
    if (a && !G && a.parentNode === s) {
      var i = Ue(a);
      if (we = s, G = a, Ce = G.parentNode, wt = G.nextSibling, dl = a, il = v.group, ne.dragged = G, ht = {
        target: G,
        clientX: (t || l).clientX,
        clientY: (t || l).clientY
      }, ka = ht.clientX - i.left, wa = ht.clientY - i.top, this._lastX = (t || l).clientX, this._lastY = (t || l).clientY, G.style["will-change"] = "all", m = function() {
        if (Me("delayEnded", o, {
          evt: l
        }), ne.eventCanceled) {
          o._onDrop();
          return;
        }
        o._disableDelayedDragEvents(), !ba && o.nativeDraggable && (G.draggable = !0), o._triggerDragStart(l, t), Oe({
          sortable: o,
          name: "choose",
          originalEvent: l
        }), ze(G, v.chosenClass, !0);
      }, v.ignore.split(",").forEach(function(n) {
        Ga(G, n.trim(), Nl);
      }), me(f, "dragover", yt), me(f, "mousemove", yt), me(f, "touchmove", yt), v.supportPointer ? (me(f, "pointerup", o._onDrop), !this.nativeDraggable && me(f, "pointercancel", o._onDrop)) : (me(f, "mouseup", o._onDrop), me(f, "touchend", o._onDrop), me(f, "touchcancel", o._onDrop)), ba && this.nativeDraggable && (this.options.touchStartThreshold = 4, G.draggable = !0), Me("delayStart", this, {
        evt: l
      }), v.delay && (!v.delayOnTouchOnly || t) && (!this.nativeDraggable || !(el || nt))) {
        if (ne.eventCanceled) {
          this._onDrop();
          return;
        }
        v.supportPointer ? (me(f, "pointerup", o._disableDelayedDrag), me(f, "pointercancel", o._disableDelayedDrag)) : (me(f, "mouseup", o._disableDelayedDrag), me(f, "touchend", o._disableDelayedDrag), me(f, "touchcancel", o._disableDelayedDrag)), me(f, "mousemove", o._delayedDragTouchMoveHandler), me(f, "touchmove", o._delayedDragTouchMoveHandler), v.supportPointer && me(f, "pointermove", o._delayedDragTouchMoveHandler), o._dragStartTimer = setTimeout(m, v.delay);
      } else
        m();
    }
  },
  _delayedDragTouchMoveHandler: function(l) {
    var t = l.touches ? l.touches[0] : l;
    Math.max(Math.abs(t.clientX - this._lastX), Math.abs(t.clientY - this._lastY)) >= Math.floor(this.options.touchStartThreshold / (this.nativeDraggable && window.devicePixelRatio || 1)) && this._disableDelayedDrag();
  },
  _disableDelayedDrag: function() {
    G && Nl(G), clearTimeout(this._dragStartTimer), this._disableDelayedDragEvents();
  },
  _disableDelayedDragEvents: function() {
    var l = this.el.ownerDocument;
    ve(l, "mouseup", this._disableDelayedDrag), ve(l, "touchend", this._disableDelayedDrag), ve(l, "touchcancel", this._disableDelayedDrag), ve(l, "pointerup", this._disableDelayedDrag), ve(l, "pointercancel", this._disableDelayedDrag), ve(l, "mousemove", this._delayedDragTouchMoveHandler), ve(l, "touchmove", this._delayedDragTouchMoveHandler), ve(l, "pointermove", this._delayedDragTouchMoveHandler);
  },
  _triggerDragStart: function(l, t) {
    t = t || l.pointerType == "touch" && l, !this.nativeDraggable || t ? this.options.supportPointer ? me(document, "pointermove", this._onTouchMove) : t ? me(document, "touchmove", this._onTouchMove) : me(document, "mousemove", this._onTouchMove) : (me(G, "dragend", this), me(we, "dragstart", this._onDragStart));
    try {
      document.selection ? cl(function() {
        document.selection.empty();
      }) : window.getSelection().removeAllRanges();
    } catch {
    }
  },
  _dragStarted: function(l, t) {
    if (Rt = !1, we && G) {
      Me("dragStarted", this, {
        evt: t
      }), this.nativeDraggable && me(document, "dragover", wn);
      var a = this.options;
      !l && ze(G, a.dragClass, !1), ze(G, a.ghostClass, !0), ne.active = this, l && this._appendGhost(), Oe({
        sortable: this,
        name: "start",
        originalEvent: t
      });
    } else
      this._nulling();
  },
  _emulateDragOver: function() {
    if (Xe) {
      this._lastX = Xe.clientX, this._lastY = Xe.clientY, eo();
      for (var l = document.elementFromPoint(Xe.clientX, Xe.clientY), t = l; l && l.shadowRoot && (l = l.shadowRoot.elementFromPoint(Xe.clientX, Xe.clientY), l !== t); )
        t = l;
      if (G.parentNode[Fe]._isOutsideThisEl(l), t)
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
        } while (t = Ka(t));
      to();
    }
  },
  _onTouchMove: function(l) {
    if (ht) {
      var t = this.options, a = t.fallbackTolerance, o = t.fallbackOffset, s = l.touches ? l.touches[0] : l, v = se && Ft(se, !0), f = se && v && v.a, m = se && v && v.d, i = sl && Pe && ga(Pe), n = (s.clientX - ht.clientX + o.x) / (f || 1) + (i ? i[0] - Ol[0] : 0) / (f || 1), u = (s.clientY - ht.clientY + o.y) / (m || 1) + (i ? i[1] - Ol[1] : 0) / (m || 1);
      if (!ne.active && !Rt) {
        if (a && Math.max(Math.abs(s.clientX - this._lastX), Math.abs(s.clientY - this._lastY)) < a)
          return;
        this._onDragStart(l, !0);
      }
      if (se) {
        v ? (v.e += n - (Pl || 0), v.f += u - (Rl || 0)) : v = {
          a: 1,
          b: 0,
          c: 0,
          d: 1,
          e: n,
          f: u
        };
        var y = "matrix(".concat(v.a, ",").concat(v.b, ",").concat(v.c, ",").concat(v.d, ",").concat(v.e, ",").concat(v.f, ")");
        ie(se, "webkitTransform", y), ie(se, "mozTransform", y), ie(se, "msTransform", y), ie(se, "transform", y), Pl = n, Rl = u, Xe = s;
      }
      l.cancelable && l.preventDefault();
    }
  },
  _appendGhost: function() {
    if (!se) {
      var l = this.options.fallbackOnBody ? document.body : we, t = Ue(G, !0, sl, !0, l), a = this.options;
      if (sl) {
        for (Pe = l; ie(Pe, "position") === "static" && ie(Pe, "transform") === "none" && Pe !== document; )
          Pe = Pe.parentNode;
        Pe !== document.body && Pe !== document.documentElement ? (Pe === document && (Pe = _e()), t.top += Pe.scrollTop, t.left += Pe.scrollLeft) : Pe = _e(), Ol = ga(Pe);
      }
      se = G.cloneNode(!0), ze(se, a.ghostClass, !1), ze(se, a.fallbackClass, !0), ze(se, a.dragClass, !0), ie(se, "transition", ""), ie(se, "transform", ""), ie(se, "box-sizing", "border-box"), ie(se, "margin", 0), ie(se, "top", t.top), ie(se, "left", t.left), ie(se, "width", t.width), ie(se, "height", t.height), ie(se, "opacity", "0.8"), ie(se, "position", sl ? "absolute" : "fixed"), ie(se, "zIndex", "100000"), ie(se, "pointerEvents", "none"), ne.ghost = se, l.appendChild(se), ie(se, "transform-origin", ka / parseInt(se.style.width) * 100 + "% " + wa / parseInt(se.style.height) * 100 + "%");
    }
  },
  _onDragStart: function(l, t) {
    var a = this, o = l.dataTransfer, s = a.options;
    if (Me("dragStart", this, {
      evt: l
    }), ne.eventCanceled) {
      this._onDrop();
      return;
    }
    Me("setupClone", this), ne.eventCanceled || ($e = Xa(G), $e.removeAttribute("id"), $e.draggable = !1, $e.style["will-change"] = "", this._hideClone(), ze($e, this.options.chosenClass, !1), ne.clone = $e), a.cloneId = cl(function() {
      Me("clone", a), !ne.eventCanceled && (a.options.removeCloneOnHide || we.insertBefore($e, G), a._hideClone(), Oe({
        sortable: a,
        name: "clone"
      }));
    }), !t && ze(G, s.dragClass, !0), t ? (pl = !0, a._loopId = setInterval(a._emulateDragOver, 50)) : (ve(document, "mouseup", a._onDrop), ve(document, "touchend", a._onDrop), ve(document, "touchcancel", a._onDrop), o && (o.effectAllowed = "move", s.setData && s.setData.call(a, o, G)), me(document, "drop", a), ie(G, "transform", "translateZ(0)")), Rt = !0, a._dragStartId = cl(a._dragStarted.bind(a, t, l)), me(document, "selectstart", a), Kt = !0, window.getSelection().removeAllRanges(), Ht && ie(document.body, "user-select", "none");
  },
  // Returns true - if no further action is needed (either inserted or another condition)
  _onDragOver: function(l) {
    var t = this.el, a = l.target, o, s, v, f = this.options, m = f.group, i = ne.active, n = il === m, u = f.sort, y = Ie || i, p, w = this, x = !1;
    if (Wl) return;
    function I(pe, ke) {
      Me(pe, w, et({
        evt: l,
        isOwner: n,
        axis: p ? "vertical" : "horizontal",
        revert: v,
        dragRect: o,
        targetRect: s,
        canSort: u,
        fromSortable: y,
        target: a,
        completed: X,
        onMove: function(De, h) {
          return rl(we, t, G, o, De, Ue(De), l, h);
        },
        changed: L
      }, ke));
    }
    function T() {
      I("dragOverAnimationCapture"), w.captureAnimationState(), w !== y && y.captureAnimationState();
    }
    function X(pe) {
      return I("dragOverCompleted", {
        insertion: pe
      }), pe && (n ? i._hideClone() : i._showClone(w), w !== y && (ze(G, Ie ? Ie.options.ghostClass : i.options.ghostClass, !1), ze(G, f.ghostClass, !0)), Ie !== w && w !== ne.active ? Ie = w : w === ne.active && Ie && (Ie = null), y === w && (w._ignoreWhileAnimating = a), w.animateAll(function() {
        I("dragOverAnimationComplete"), w._ignoreWhileAnimating = null;
      }), w !== y && (y.animateAll(), y._ignoreWhileAnimating = null)), (a === G && !G.animated || a === t && !a.animated) && (Pt = null), !f.dragoverBubble && !l.rootEl && a !== document && (G.parentNode[Fe]._isOutsideThisEl(l.target), !pe && yt(l)), !f.dragoverBubble && l.stopPropagation && l.stopPropagation(), x = !0;
    }
    function L() {
      Be = qe(G), ct = qe(G, f.draggable), Oe({
        sortable: w,
        name: "change",
        toEl: t,
        newIndex: Be,
        newDraggableIndex: ct,
        originalEvent: l
      });
    }
    if (l.preventDefault !== void 0 && l.cancelable && l.preventDefault(), a = Je(a, f.draggable, t, !0), I("dragOver"), ne.eventCanceled) return x;
    if (G.contains(l.target) || a.animated && a.animatingX && a.animatingY || w._ignoreWhileAnimating === a)
      return X(!1);
    if (pl = !1, i && !f.disabled && (n ? u || (v = Ce !== we) : Ie === this || (this.lastPutMode = il.checkPull(this, i, G, l)) && m.checkPut(this, i, G, l))) {
      if (p = this._getDirection(l, a) === "vertical", o = Ue(G), I("dragOverValid"), ne.eventCanceled) return x;
      if (v)
        return Ce = we, T(), this._hideClone(), I("revert"), ne.eventCanceled || (wt ? we.insertBefore(G, wt) : we.appendChild(G)), X(!0);
      var S = la(t, f.draggable);
      if (!S || Cn(l, p, this) && !S.animated) {
        if (S === G)
          return X(!1);
        if (S && t === l.target && (a = S), a && (s = Ue(a)), rl(we, t, G, o, a, s, l, !!a) !== !1)
          return T(), S && S.nextSibling ? t.insertBefore(G, S.nextSibling) : t.appendChild(G), Ce = t, L(), X(!0);
      } else if (S && xn(l, p, this)) {
        var U = zt(t, 0, f, !0);
        if (U === G)
          return X(!1);
        if (a = U, s = Ue(a), rl(we, t, G, o, a, s, l, !1) !== !1)
          return T(), t.insertBefore(G, U), Ce = t, L(), X(!0);
      } else if (a.parentNode === t) {
        s = Ue(a);
        var A = 0, O, F = G.parentNode !== t, P = !gn(G.animated && G.toRect || o, a.animated && a.toRect || s, p), B = p ? "top" : "left", V = ya(a, "top", "top") || ya(G, "top", "top"), le = V ? V.scrollTop : void 0;
        Pt !== a && (O = s[B], Qt = !1, nl = !P && f.invertSwap || F), A = Sn(l, a, s, p, P ? 1 : f.swapThreshold, f.invertedSwapThreshold == null ? f.swapThreshold : f.invertedSwapThreshold, nl, Pt === a);
        var $;
        if (A !== 0) {
          var R = qe(G);
          do
            R -= A, $ = Ce.children[R];
          while ($ && (ie($, "display") === "none" || $ === se));
        }
        if (A === 0 || $ === a)
          return X(!1);
        Pt = a, Zt = A;
        var N = a.nextElementSibling, Q = !1;
        Q = A === 1;
        var ce = rl(we, t, G, o, a, s, l, Q);
        if (ce !== !1)
          return (ce === 1 || ce === -1) && (Q = ce === 1), Wl = !0, setTimeout($n, 30), T(), Q && !N ? t.appendChild(G) : a.parentNode.insertBefore(G, Q ? N : a), V && Ha(V, 0, le - V.scrollTop), Ce = G.parentNode, O !== void 0 && !nl && (ul = Math.abs(O - Ue(a)[B])), L(), X(!0);
      }
      if (t.contains(G))
        return X(!1);
    }
    return !1;
  },
  _ignoreWhileAnimating: null,
  _offMoveEvents: function() {
    ve(document, "mousemove", this._onTouchMove), ve(document, "touchmove", this._onTouchMove), ve(document, "pointermove", this._onTouchMove), ve(document, "dragover", yt), ve(document, "mousemove", yt), ve(document, "touchmove", yt);
  },
  _offUpEvents: function() {
    var l = this.el.ownerDocument;
    ve(l, "mouseup", this._onDrop), ve(l, "touchend", this._onDrop), ve(l, "pointerup", this._onDrop), ve(l, "pointercancel", this._onDrop), ve(l, "touchcancel", this._onDrop), ve(document, "selectstart", this);
  },
  _onDrop: function(l) {
    var t = this.el, a = this.options;
    if (Be = qe(G), ct = qe(G, a.draggable), Me("drop", this, {
      evt: l
    }), Ce = G && G.parentNode, Be = qe(G), ct = qe(G, a.draggable), ne.eventCanceled) {
      this._nulling();
      return;
    }
    Rt = !1, nl = !1, Qt = !1, clearInterval(this._loopId), clearTimeout(this._dragStartTimer), Kl(this.cloneId), Kl(this._dragStartId), this.nativeDraggable && (ve(document, "drop", this), ve(t, "dragstart", this._onDragStart)), this._offMoveEvents(), this._offUpEvents(), Ht && ie(document.body, "user-select", ""), ie(G, "transform", ""), l && (Kt && (l.cancelable && l.preventDefault(), !a.dropBubble && l.stopPropagation()), se && se.parentNode && se.parentNode.removeChild(se), (we === Ce || Ie && Ie.lastPutMode !== "clone") && $e && $e.parentNode && $e.parentNode.removeChild($e), G && (this.nativeDraggable && ve(G, "dragend", this), Nl(G), G.style["will-change"] = "", Kt && !Rt && ze(G, Ie ? Ie.options.ghostClass : this.options.ghostClass, !1), ze(G, this.options.chosenClass, !1), Oe({
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
    })), Ie && Ie.save()) : Be !== Nt && Be >= 0 && (Oe({
      sortable: this,
      name: "update",
      toEl: Ce,
      originalEvent: l
    }), Oe({
      sortable: this,
      name: "sort",
      toEl: Ce,
      originalEvent: l
    })), ne.active && ((Be == null || Be === -1) && (Be = Nt, ct = Jt), Oe({
      sortable: this,
      name: "end",
      toEl: Ce,
      originalEvent: l
    }), this.save()))), this._nulling();
  },
  _nulling: function() {
    Me("nulling", this), we = G = Ce = se = wt = $e = dl = vt = ht = Xe = Kt = Be = ct = Nt = Jt = Pt = Zt = Ie = il = ne.dragged = ne.ghost = ne.clone = ne.active = null;
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
        G && (this._onDragOver(l), Vn(l));
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
    typeof o < "u" ? a[l] = o : a[l] = t, l === "group" && _a(a);
  },
  /**
   * Destroy
   */
  destroy: function() {
    Me("destroy", this);
    var l = this.el;
    l[Fe] = null, ve(l, "mousedown", this._onTapStart), ve(l, "touchstart", this._onTapStart), ve(l, "pointerdown", this._onTapStart), this.nativeDraggable && (ve(l, "dragover", this), ve(l, "dragenter", this)), Array.prototype.forEach.call(l.querySelectorAll("[draggable]"), function(t) {
      t.removeAttribute("draggable");
    }), this._onDrop(), this._disableDelayedDragEvents(), bl.splice(bl.indexOf(this.el), 1), this.el = l = null;
  },
  _hideClone: function() {
    if (!vt) {
      if (Me("hideClone", this), ne.eventCanceled) return;
      ie($e, "display", "none"), this.options.removeCloneOnHide && $e.parentNode && $e.parentNode.removeChild($e), vt = !0;
    }
  },
  _showClone: function(l) {
    if (l.lastPutMode !== "clone") {
      this._hideClone();
      return;
    }
    if (vt) {
      if (Me("showClone", this), ne.eventCanceled) return;
      G.parentNode == we && !this.options.group.revertClone ? we.insertBefore($e, G) : wt ? we.insertBefore($e, wt) : we.appendChild($e), this.options.group.revertClone && this.animate(G, $e), ie($e, "display", ""), vt = !1;
    }
  }
};
function Vn(e) {
  e.dataTransfer && (e.dataTransfer.dropEffect = "move"), e.cancelable && e.preventDefault();
}
function rl(e, l, t, a, o, s, v, f) {
  var m, i = e[Fe], n = i.options.onMove, u;
  return window.CustomEvent && !nt && !el ? m = new CustomEvent("move", {
    bubbles: !0,
    cancelable: !0
  }) : (m = document.createEvent("Event"), m.initEvent("move", !0, !0)), m.to = l, m.from = e, m.dragged = t, m.draggedRect = a, m.related = o || l, m.relatedRect = s || Ue(l), m.willInsertAfter = f, m.originalEvent = v, e.dispatchEvent(m), n && (u = n.call(i, m, v)), u;
}
function Nl(e) {
  e.draggable = !1;
}
function $n() {
  Wl = !1;
}
function xn(e, l, t) {
  var a = Ue(zt(t.el, 0, t.options, !0)), o = Ja(t.el, t.options, se), s = 10;
  return l ? e.clientX < o.left - s || e.clientY < a.top && e.clientX < a.right : e.clientY < o.top - s || e.clientY < a.bottom && e.clientX < a.left;
}
function Cn(e, l, t) {
  var a = Ue(la(t.el, t.options.draggable)), o = Ja(t.el, t.options, se), s = 10;
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
  return qe(G) < qe(e) ? 1 : -1;
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
xl && me(document, "touchmove", function(e) {
  (ne.active || Rt) && e.cancelable && e.preventDefault();
});
ne.utils = {
  on: me,
  off: ve,
  css: ie,
  find: Ga,
  is: function(l, t) {
    return !!Je(l, t, l, !1);
  },
  extend: cn,
  throttle: Ya,
  closest: Je,
  toggleClass: ze,
  clone: Xa,
  index: qe,
  nextTick: cl,
  cancelNextTick: Kl,
  detectDirection: Qa,
  getChild: zt,
  expando: Fe
};
ne.get = function(e) {
  return e[Fe];
};
ne.mount = function() {
  for (var e = arguments.length, l = new Array(e), t = 0; t < e; t++)
    l[t] = arguments[t];
  l[0].constructor === Array && (l = l[0]), l.forEach(function(a) {
    if (!a.prototype || !a.prototype.constructor)
      throw "Sortable: Mounted plugin must be a constructor function, not ".concat({}.toString.call(a));
    a.utils && (ne.utils = et(et({}, ne.utils), a.utils)), tl.mount(a);
  });
};
ne.create = function(e, l) {
  return new ne(e, l);
};
ne.version = dn;
var Ee = [], Gt, Gl, Yl = !1, Ml, Fl, yl, Yt;
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
      this.sortable.nativeDraggable ? me(document, "dragover", this._handleAutoScroll) : this.options.supportPointer ? me(document, "pointermove", this._handleFallbackAutoScroll) : a.touches ? me(document, "touchmove", this._handleFallbackAutoScroll) : me(document, "mousemove", this._handleFallbackAutoScroll);
    },
    dragOverCompleted: function(t) {
      var a = t.originalEvent;
      !this.options.dragOverBubble && !a.rootEl && this._handleAutoScroll(a);
    },
    drop: function() {
      this.sortable.nativeDraggable ? ve(document, "dragover", this._handleAutoScroll) : (ve(document, "pointermove", this._handleFallbackAutoScroll), ve(document, "touchmove", this._handleFallbackAutoScroll), ve(document, "mousemove", this._handleFallbackAutoScroll)), $a(), vl(), vn();
    },
    nulling: function() {
      yl = Gl = Gt = Yl = Yt = Ml = Fl = null, Ee.length = 0;
    },
    _handleFallbackAutoScroll: function(t) {
      this._handleAutoScroll(t, !0);
    },
    _handleAutoScroll: function(t, a) {
      var o = this, s = (t.touches ? t.touches[0] : t).clientX, v = (t.touches ? t.touches[0] : t).clientY, f = document.elementFromPoint(s, v);
      if (yl = t, a || this.options.forceAutoScrollFallback || el || nt || Ht) {
        Ll(t, this.options, f, a);
        var m = mt(f, !0);
        Yl && (!Yt || s !== Ml || v !== Fl) && (Yt && $a(), Yt = setInterval(function() {
          var i = mt(document.elementFromPoint(s, v), !0);
          i !== m && (m = i, vl()), Ll(t, o.options, i, a);
        }, 10), Ml = s, Fl = v);
      } else {
        if (!this.options.bubbleScroll || mt(f, !0) === _e()) {
          vl();
          return;
        }
        Ll(t, this.options, mt(f, !1), !1);
      }
    }
  }, ot(e, {
    pluginName: "scroll",
    initializeByDefault: !0
  });
}
function vl() {
  Ee.forEach(function(e) {
    clearInterval(e.pid);
  }), Ee = [];
}
function $a() {
  clearInterval(Yt);
}
var Ll = Ya(function(e, l, t, a) {
  if (l.scroll) {
    var o = (e.touches ? e.touches[0] : e).clientX, s = (e.touches ? e.touches[0] : e).clientY, v = l.scrollSensitivity, f = l.scrollSpeed, m = _e(), i = !1, n;
    Gl !== t && (Gl = t, vl(), Gt = l.scroll, n = l.scrollFn, Gt === !0 && (Gt = mt(t, !0)));
    var u = 0, y = Gt;
    do {
      var p = y, w = Ue(p), x = w.top, I = w.bottom, T = w.left, X = w.right, L = w.width, S = w.height, U = void 0, A = void 0, O = p.scrollWidth, F = p.scrollHeight, P = ie(p), B = p.scrollLeft, V = p.scrollTop;
      p === m ? (U = L < O && (P.overflowX === "auto" || P.overflowX === "scroll" || P.overflowX === "visible"), A = S < F && (P.overflowY === "auto" || P.overflowY === "scroll" || P.overflowY === "visible")) : (U = L < O && (P.overflowX === "auto" || P.overflowX === "scroll"), A = S < F && (P.overflowY === "auto" || P.overflowY === "scroll"));
      var le = U && (Math.abs(X - o) <= v && B + L < O) - (Math.abs(T - o) <= v && !!B), $ = A && (Math.abs(I - s) <= v && V + S < F) - (Math.abs(x - s) <= v && !!V);
      if (!Ee[u])
        for (var R = 0; R <= u; R++)
          Ee[R] || (Ee[R] = {});
      (Ee[u].vx != le || Ee[u].vy != $ || Ee[u].el !== p) && (Ee[u].el = p, Ee[u].vx = le, Ee[u].vy = $, clearInterval(Ee[u].pid), (le != 0 || $ != 0) && (i = !0, Ee[u].pid = setInterval(function() {
        a && this.layer === 0 && ne.active._onTouchMove(yl);
        var N = Ee[this.layer].vy ? Ee[this.layer].vy * f : 0, Q = Ee[this.layer].vx ? Ee[this.layer].vx * f : 0;
        typeof n == "function" && n.call(ne.dragged.parentNode[Fe], Q, N, e, yl, Ee[this.layer].el) !== "continue" || Ha(Ee[this.layer].el, Q, N);
      }.bind({
        layer: u
      }), 24))), u++;
    } while (l.bubbleScroll && y !== m && (y = mt(y, !1)));
    Yl = i;
  }
}, 30), lo = function(l) {
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
  drop: lo
};
ot(aa, {
  pluginName: "revertOnSpill"
});
function oa() {
}
oa.prototype = {
  onSpill: function(l) {
    var t = l.dragEl, a = l.putSortable, o = a || this.sortable;
    o.captureAnimationState(), t.parentNode && t.parentNode.removeChild(t), o.animateAll();
  },
  drop: lo
};
ot(oa, {
  pluginName: "removeOnSpill"
});
ne.mount(new Dn());
ne.mount(oa, aa);
function In(e, l) {
  const t = e.oldDraggableIndex ?? e.oldIndex;
  e.item.remove();
  const a = [...e.from.children].filter((o) => o.matches(l));
  e.from.insertBefore(e.item, a[t ?? a.length] ?? null);
}
function ao(e) {
  const l = /* @__PURE__ */ new Map();
  function t(a) {
    l.get(a)?.destroy(), l.delete(a);
  }
  return it(() => {
    for (const a of l.keys()) t(a);
  }), {
    mounted(a) {
      const o = a.querySelector(".work-field-builder") ?? a;
      l.set(a, new ne(o, {
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
}, Wn = /* @__PURE__ */ ue({
  __name: "OptionsEditor",
  props: {
    field: {}
  },
  emits: ["validity"],
  setup(e, { emit: l }) {
    const t = e, a = l, o = "options:" + Xl(), s = Y(() => t.field.options ?? []), v = Y(() => s.value.every((u, y) => !!u.id && s.value.findIndex((p) => p.id === u.id) === y));
    xe(v, (u) => a("validity", u, o), { immediate: !0 }), it(() => a("validity", !0, o));
    function f(u, y) {
      Na(s.value, u, y - u), s.value.forEach((p, w) => p.order = w);
    }
    const m = ao(f), i = ["primary", "success", "info", "warn", "danger", "secondary"];
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
        (c(!0), g(Z, null, ae(s.value, (p, w) => (c(), g("div", {
          key: w,
          class: "work-option-row work-reorder-entry"
        }, [
          b(r(H), {
            type: "button",
            class: "work-icon-button work-reorder-handle",
            "aria-label": "Drag option; arrow keys reorder",
            onKeydown: [
              Ae(be((x) => f(w, w - 1), ["prevent"]), ["up"]),
              Ae(be((x) => f(w, w + 1), ["prevent"]), ["down"])
            ],
            severity: "secondary",
            text: "",
            size: "small"
          }, {
            default: z(() => [
              b(r(_), {
                icon: "tabler:grip-vertical",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["onKeydown"]),
          d("label", Rn, [
            y[0] || (y[0] = M("Label", -1)),
            b(r(de), {
              modelValue: p.label,
              "onUpdate:modelValue": (x) => p.label = x,
              "aria-label": "Option label"
            }, null, 8, ["modelValue", "onUpdate:modelValue"])
          ]),
          d("label", On, [
            y[1] || (y[1] = M("ID", -1)),
            b(r(de), {
              modelValue: p.id,
              "onUpdate:modelValue": (x) => p.id = x,
              class: "work-option-code",
              required: "",
              "aria-label": "Option ID"
            }, null, 8, ["modelValue", "onUpdate:modelValue"])
          ]),
          d("div", Nn, [
            d("label", Mn, [
              y[2] || (y[2] = M("Color", -1)),
              d("span", Fn, [
                d("span", {
                  class: ft(["work-color-swatch", "work-swatch-" + (p.color || "secondary")]),
                  "aria-hidden": "true"
                }, null, 2),
                b(r(oe), {
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
              y[3] || (y[3] = M("Category", -1)),
              b(r(oe), {
                "model-value": p.category,
                "aria-label": "Option category",
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                showClear: "",
                options: ["triage", "backlog", ...r(Oa)].map((x) => ({ label: r(Zl)(x), value: x })),
                "onUpdate:modelValue": (x) => p.category = x || void 0
              }, null, 8, ["model-value", "options", "onUpdate:modelValue"])
            ])
          ]),
          d("div", zn, [
            b(r(H), {
              "aria-label": "Option earlier",
              severity: "secondary",
              size: "small",
              disabled: w === 0,
              onClick: (x) => f(w, w - 1),
              text: ""
            }, {
              default: z(() => [
                b(r(_), {
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
              onClick: (x) => f(w, w + 1),
              text: ""
            }, {
              default: z(() => [
                b(r(_), {
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
              onClick: (x) => s.value.splice(w, 1)
            }, {
              icon: z(() => [
                b(r(_), {
                  icon: "tabler:trash",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["onClick"])
          ])
        ]))), 128)),
        v.value ? E("", !0) : (c(), g("p", Bn, "Option IDs must be nonempty and unique.")),
        d("div", jn, [
          b(r(H), {
            label: "Add option",
            severity: "secondary",
            size: "small",
            onClick: n,
            outlined: ""
          }, {
            icon: z(() => [
              b(r(_), {
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
      s.value.length ? E("", !0) : (c(), g("p", qn, "Add the choices people can select for this field."))
    ]));
  }
});
function oo(e) {
  return Object.entries(Ke(e.properties)).map(([l, t]) => {
    const a = Ke(t);
    return { key: l, title: typeof a.title == "string" && a.title.trim() ? a.title : ge(l), description: typeof a.description == "string" ? a.description : "", schema: a };
  });
}
const io = (e) => e.type === "array" && Ke(e.items).type === "string";
function Kn(e, l) {
  const t = {};
  for (const a of oo(e)) {
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
      else if (io(s)) {
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
}, ia = /* @__PURE__ */ ue({
  __name: "ConfigForm",
  props: {
    schema: {},
    modelValue: {},
    disabled: { type: Boolean }
  },
  emits: ["update:modelValue", "validity"],
  setup(e, { emit: l }) {
    const t = e, a = l, o = j({}), s = j(/* @__PURE__ */ new Set()), v = j(!1), f = j(!1), m = Y(() => oo(t.schema)), i = Y(() => Kn(t.schema, t.modelValue)), n = Y(() => m.value.filter((S) => typeof S.schema.picker == "string")), u = Y(() => m.value.filter((S) => typeof S.schema.picker != "string")), y = Y(() => ({ ...t.schema, properties: Object.fromEntries(n.value.map((S) => [S.key, { ...S.schema, title: S.title }])), required: Array.isArray(t.schema.required) ? t.schema.required.filter((S) => n.value.some((U) => U.key === S)) : [] })), p = Y(() => Object.fromEntries(n.value.map((S) => [S.key, t.modelValue[S.key]])));
    xe([i, s, () => n.value.length > 0 && !v.value], () => a("validity", !Object.keys(i.value).length && !s.value.size && (!n.value.length || v.value)), { immediate: !0, deep: !0 });
    async function w() {
      f.value = !0, v.value = await tt("wc-schema-form"), f.value = !1;
    }
    xe(() => n.value.length > 0, (S) => {
      S && w();
    }, { immediate: !0 }), it(() => a("validity", !0));
    function x(S, U) {
      const A = { ...t.modelValue };
      U == null ? delete A[S] : A[S] = U, a("update:modelValue", A);
    }
    function I(S) {
      const U = t.modelValue[S];
      return Array.isArray(U) ? U.filter((A) => typeof A == "string") : [];
    }
    function T(S) {
      const U = o.value[S]?.trim();
      U && (x(S, [...I(S), U]), o.value[S] = "");
    }
    function X(S, U) {
      U ? s.value.delete(S) : s.value.add(S);
    }
    function L(S) {
      a("update:modelValue", { ...t.modelValue, ...Ke(S.detail) });
    }
    return (S, U) => (c(), g("div", Gn, [
      n.value.length && v.value ? (c(), g("wc-schema-form", {
        key: 0,
        class: "work-config-widget",
        schema: JSON.stringify(y.value),
        config: JSON.stringify(p.value),
        onConfigChanged: L
      }, null, 40, Yn)) : n.value.length && f.value ? (c(), g("p", Hn, "The configuration widget is loading.")) : n.value.length ? (c(), g("p", Xn, [
        U[0] || (U[0] = M("The configuration widget is unavailable.", -1)),
        b(r(H), {
          label: "Reload configuration widget",
          severity: "secondary",
          outlined: "",
          onClick: w
        })
      ])) : E("", !0),
      d("div", Jn, [
        (c(!0), g(Z, null, ae(u.value, (A) => (c(), g("div", {
          key: A.key,
          class: "work-config-field"
        }, [
          d("label", {
            class: "work-config-label",
            for: "config-" + A.key
          }, D(A.title), 9, Zn),
          Array.isArray(A.schema.enum) ? (c(), q(r(oe), {
            key: 0,
            "input-id": "config-" + A.key,
            "model-value": e.modelValue[A.key] ?? A.schema.default,
            options: A.schema.enum,
            appendTo: "self",
            "aria-label": A.title,
            disabled: e.disabled,
            "onUpdate:modelValue": (O) => x(A.key, O)
          }, null, 8, ["input-id", "model-value", "options", "aria-label", "disabled", "onUpdate:modelValue"])) : r(io)(A.schema) ? (c(), g("div", Qn, [
            (c(!0), g(Z, null, ae(I(A.key), (O, F) => (c(), q(r(zo), {
              key: F,
              label: O,
              removable: !e.disabled,
              onRemove: (P) => x(A.key, I(A.key).filter((B, V) => V !== F))
            }, null, 8, ["label", "removable", "onRemove"]))), 128)),
            b(r(de), {
              id: "config-" + A.key,
              modelValue: o.value[A.key],
              "onUpdate:modelValue": (O) => o.value[A.key] = O,
              "aria-label": "Add " + A.title.toLocaleLowerCase(),
              disabled: e.disabled,
              placeholder: "Type and press Enter",
              onKeydown: Ae(be((O) => T(A.key), ["stop", "prevent"]), ["enter"]),
              onBlur: (O) => T(A.key)
            }, null, 8, ["id", "modelValue", "onUpdate:modelValue", "aria-label", "disabled", "onKeydown", "onBlur"])
          ])) : ["integer", "number"].includes(String(A.schema.type)) ? (c(), q(r(Ge), {
            key: 2,
            "input-id": "config-" + A.key,
            "model-value": e.modelValue[A.key] ?? A.schema.default,
            "max-fraction-digits": A.schema.type === "integer" ? 0 : 8,
            "use-grouping": !1,
            "aria-label": A.title,
            disabled: e.disabled,
            invalid: !!i.value[A.key],
            "onUpdate:modelValue": (O) => x(A.key, O)
          }, null, 8, ["input-id", "model-value", "max-fraction-digits", "aria-label", "disabled", "invalid", "onUpdate:modelValue"])) : A.schema.type === "boolean" ? (c(), q(r(Le), {
            key: 3,
            "input-id": "config-" + A.key,
            "model-value": !!(e.modelValue[A.key] ?? A.schema.default),
            "aria-label": A.title,
            disabled: e.disabled,
            "onUpdate:modelValue": (O) => x(A.key, O)
          }, null, 8, ["input-id", "model-value", "aria-label", "disabled", "onUpdate:modelValue"])) : ["array", "object"].includes(String(A.schema.type)) ? (c(), q(at, {
            key: 4,
            label: A.title,
            "model-value": e.modelValue[A.key],
            shape: A.schema.type === "array" ? "array" : "object",
            example: A.schema.default ?? (A.schema.type === "array" ? [] : {}),
            "onUpdate:modelValue": (O) => x(A.key, O),
            onValidity: (O) => X(A.key, O)
          }, null, 8, ["label", "model-value", "shape", "example", "onUpdate:modelValue", "onValidity"])) : (c(), q(r(de), {
            key: 5,
            id: "config-" + A.key,
            "model-value": e.modelValue[A.key] ?? A.schema.default ?? "",
            disabled: e.disabled,
            invalid: !!i.value[A.key],
            "aria-label": A.title,
            "onUpdate:modelValue": (O) => x(A.key, O)
          }, null, 8, ["id", "model-value", "disabled", "invalid", "aria-label", "onUpdate:modelValue"])),
          A.description ? (c(), g("p", _n, D(A.description), 1)) : E("", !0),
          i.value[A.key] ? (c(), g("p", es, D(i.value[A.key]), 1)) : E("", !0)
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
}, Cs = { class: "work-row work-add-definition" }, Ss = { class: "work-stack work-tight" }, Ts = /* @__PURE__ */ ue({
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
    const t = e, a = l, o = Y(() => t.draft.fields ?? []), s = j(""), v = j(""), f = j({}), m = ao((O, F) => S(O, F - O));
    function i(O) {
      return (t.draft.item_types ?? []).filter((F) => F.fields.includes(O)).map((F) => F.title || ge(F.id));
    }
    async function n(O) {
      if (!v.value) {
        v.value = O.code;
        try {
          const F = await t.guardRemoval?.("fields", O.code);
          f.value[O.code] = F ?? "", F || _t(t.draft, "fields", O.code);
        } finally {
          v.value = "";
        }
      }
    }
    const u = Object.entries({ text: "Text", int: "Whole number", dec: "Decimal number", quantity: "Measurement", bool: "Yes or no", time: "Date or time", ref: "Reference", record: "Structured data", option: "Choice", principal: "Person or group", item: "Work item", rank: "Order", rich_text: "Formatted text", formula: "Formula", rollup: "Related item calculation", counter: "Counter" }).map(([O, F]) => ({ value: O, label: F })), y = [{ label: "None", value: "none" }, { label: "Exact matches", value: "key" }, { label: "Numeric ranges", value: "number" }], p = ["int", "dec", "quantity"], w = Y(() => new Map(t.installedTypes?.map((O) => [O.id, O])));
    function x(O) {
      return O.type && O.type !== "value" ? O.type : O.form;
    }
    function I(O) {
      return O.type ? w.value.get(O.type) : void 0;
    }
    function T(O) {
      const F = I(O);
      return F ? [...u, { value: F.id, label: F.title }] : u;
    }
    function X(O) {
      const F = I(O);
      return F ? y.filter(({ value: P }) => P === "none" || (!F.indexes || F.indexes.includes(P)) && F.form !== "record" && (P !== "number" || p.includes(F.form))) : y;
    }
    function L(O, F) {
      const P = w.value.get(F);
      if (P) {
        if (P.id === O.type) return;
        O.type = P.id, O.form = P.form, delete O.options, delete O.config, O.index && !X(O).some((V) => V.value === O.index) && delete O.index;
        return;
      }
      I(O) && delete O.config;
      const B = { option: "text", principal: "ref", item: "ref", rank: "text", rich_text: "text", formula: "int", rollup: "int", counter: "int" };
      B[F] ? (O.type = F, O.form = B[F]) : (delete O.type, O.form = F), F !== "option" ? delete O.options : O.options ??= [], F === "rich_text" && (O.config = { format: "json" });
    }
    function S(O, F) {
      Na(o.value, O, F);
      for (const P of t.draft.item_types ?? []) {
        const B = new Set(P.fields);
        P.fields = o.value.filter((V) => B.has(V.code)).map((V) => V.code);
      }
    }
    function U(O, F) {
      try {
        xo(t.draft, O, F.value), delete f.value[O.code];
      } catch (P) {
        f.value[O.code] = P.message, F.value = O.code;
      }
    }
    function A() {
      !/^[a-z][a-z0-9_]*$/.test(s.value) || o.value.some((O) => O.code === s.value) || ((t.draft.fields ??= []).push({ code: s.value, form: "text", cardinality: "one" }), s.value = "");
    }
    return (O, F) => (c(), g("section", ts, [
      d("header", ls, [
        F[2] || (F[2] = d("div", null, [
          d("h2", null, "Fields"),
          d("p", { class: "work-muted work-small" }, "Shape the information each item carries. Drag the handle or use the arrows to arrange fields.")
        ], -1)),
        b(r(Re), {
          class: "kx-tag-sm",
          severity: "secondary"
        }, {
          default: z(() => [
            M(D(o.value.length) + " " + D(o.value.length === 1 ? "field" : "fields"), 1)
          ]),
          _: 1
        })
      ]),
      Qe((c(), q($l, {
        columns: "fields",
        count: o.value.length
      }, {
        default: z(() => [
          (c(!0), g(Z, null, ae(o.value, (P, B) => (c(), q(Vl, {
            title: r(Ct)(P),
            code: P.code,
            kind: I(P)?.title || r(u).find((V) => V.value === x(P))?.label || r(ge)(x(P)),
            key: P.id ?? B,
            class: "work-field-row work-reorder-entry work-stack"
          }, {
            handle: z(() => [
              b(r(H), {
                type: "button",
                class: "work-reorder-handle work-icon-button",
                "aria-label": "Drag " + P.code + "; arrow keys reorder",
                onKeydown: [
                  Ae(be((V) => S(B, -1), ["prevent"]), ["up"]),
                  Ae(be((V) => S(B, 1), ["prevent"]), ["down"])
                ],
                severity: "secondary",
                text: "",
                size: "small"
              }, {
                default: z(() => [
                  b(r(_), {
                    icon: "tabler:grip-vertical",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["aria-label", "onKeydown"])
            ]),
            flags: z(() => [
              P.track ? (c(), q(r(Re), {
                key: 0,
                class: "kx-tag-sm",
                severity: "secondary",
                value: "Tracked"
              })) : E("", !0),
              P.intervals ? (c(), q(r(Re), {
                key: 1,
                class: "kx-tag-sm",
                severity: "secondary",
                value: "Intervals"
              })) : E("", !0)
            ]),
            usage: z(() => [
              i(P.code).length ? (c(), g("details", as, [
                d("summary", os, "Used by " + D(i(P.code).length) + " " + D(i(P.code).length === 1 ? "type" : "types"), 1),
                d("span", is, D(i(P.code).join(", ")), 1)
              ])) : E("", !0)
            ]),
            actions: z(() => [
              b(r(H), {
                "aria-label": "Move " + P.code + " earlier",
                severity: "secondary",
                disabled: B === 0,
                onClick: (V) => S(B, -1),
                text: "",
                size: "small"
              }, {
                default: z(() => [
                  b(r(_), {
                    icon: "tabler:arrow-up",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["aria-label", "disabled", "onClick"]),
              b(r(H), {
                "aria-label": "Move " + P.code + " later",
                severity: "secondary",
                disabled: B === o.value.length - 1,
                onClick: (V) => S(B, 1),
                text: "",
                size: "small"
              }, {
                default: z(() => [
                  b(r(_), {
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
                onClick: (V) => n(P),
                "aria-label": "Remove field"
              }, {
                default: z(() => [
                  b(r(_), {
                    icon: "tabler:trash",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["disabled", "onClick"])
            ]),
            default: z(() => [
              f.value[P.code] ? (c(), g("p", ns, D(f.value[P.code]), 1)) : E("", !0),
              (c(!0), g(Z, null, ae(e.issues?.filter((V) => V.code === P.code) ?? [], (V) => (c(), g("p", {
                key: V.what,
                class: "work-error work-small",
                role: "alert"
              }, D(r(wl)(V)) + " · " + D(V.what), 1))), 128)),
              d("div", ss, [
                d("label", rs, [
                  F[3] || (F[3] = M("Title", -1)),
                  b(r(de), {
                    modelValue: P.title,
                    "onUpdate:modelValue": (V) => P.title = V,
                    "aria-label": "Field title",
                    maxlength: "255",
                    placeholder: r(Ct)(P)
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder"])
                ]),
                d("label", ds, [
                  F[4] || (F[4] = M("Field identifier", -1)),
                  b(r(de), {
                    value: P.code,
                    "aria-label": "Field code",
                    required: "",
                    pattern: "[a-z][a-z0-9_]*",
                    onInput: (V) => U(P, V.target)
                  }, null, 8, ["value", "onInput"])
                ]),
                d("label", us, [
                  F[5] || (F[5] = M("Kind", -1)),
                  b(r(oe), {
                    "model-value": x(P),
                    "onUpdate:modelValue": (V) => L(P, V),
                    appendTo: "self",
                    options: T(P),
                    optionLabel: "label",
                    optionValue: "value"
                  }, null, 8, ["model-value", "onUpdate:modelValue", "options"])
                ]),
                d("label", cs, [
                  F[6] || (F[6] = M("Values allowed", -1)),
                  b(r(oe), {
                    "model-value": P.cardinality ?? "one",
                    "onUpdate:modelValue": (V) => P.cardinality = V,
                    appendTo: "self",
                    options: [{ label: "One value", value: "one" }, { label: "Multiple unique values", value: "set" }, { label: "Ordered values", value: "list" }],
                    optionLabel: "label",
                    optionValue: "value"
                  }, null, 8, ["model-value", "onUpdate:modelValue"])
                ]),
                d("label", vs, [
                  F[7] || (F[7] = M("Search support", -1)),
                  b(r(oe), {
                    "model-value": P.index ?? "none",
                    "onUpdate:modelValue": (V) => P.index = V,
                    appendTo: "self",
                    options: X(P),
                    optionLabel: "label",
                    optionValue: "value"
                  }, null, 8, ["model-value", "onUpdate:modelValue", "options"])
                ])
              ]),
              d("section", ms, [
                F[10] || (F[10] = d("h4", { class: "work-group-title" }, "History", -1)),
                d("div", fs, [
                  d("div", ps, [
                    F[8] || (F[8] = d("div", { class: "work-row-main" }, [
                      d("strong", null, "Track changes"),
                      d("p", { class: "work-muted work-small" }, "Record each value change in the item history.")
                    ], -1)),
                    b(r(Le), {
                      modelValue: P.track,
                      "onUpdate:modelValue": (V) => P.track = V,
                      "aria-label": "Track changes"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ]),
                  d("div", bs, [
                    F[9] || (F[9] = d("div", { class: "work-row-main" }, [
                      d("strong", null, "Track intervals"),
                      d("p", { class: "work-muted work-small" }, "Measure how long each value stays in effect.")
                    ], -1)),
                    b(r(Le), {
                      modelValue: P.intervals,
                      "onUpdate:modelValue": (V) => P.intervals = V,
                      "aria-label": "Track intervals"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ])
                ])
              ]),
              P.type === "option" ? (c(), q(Wn, {
                key: 1,
                field: P,
                onValidity: F[0] || (F[0] = (V, le) => a("validity", le, V))
              }, null, 8, ["field"])) : E("", !0),
              P.type === "formula" || P.type === "rollup" ? (c(), g("label", hs, [
                F[11] || (F[11] = M("Result type", -1)),
                b(r(oe), {
                  modelValue: P.form,
                  "onUpdate:modelValue": (V) => P.form = V,
                  "aria-label": "Result type",
                  options: r(u).slice(0, 8),
                  optionLabel: "label",
                  optionValue: "value",
                  appendTo: "self"
                }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
              ])) : E("", !0),
              P.type === "formula" ? (c(), g("label", ys, [
                F[12] || (F[12] = M("Expression", -1)),
                b(r(de), {
                  modelValue: P.expression,
                  "onUpdate:modelValue": (V) => P.expression = V
                }, null, 8, ["modelValue", "onUpdate:modelValue"])
              ])) : E("", !0),
              P.type === "rollup" ? (c(), g(Z, { key: 4 }, [
                d("label", gs, [
                  F[13] || (F[13] = M("Of", -1)),
                  b(r(de), {
                    modelValue: P.of,
                    "onUpdate:modelValue": (V) => P.of = V
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                d("label", ks, [
                  F[14] || (F[14] = M("Function", -1)),
                  b(r(de), {
                    modelValue: P.fn,
                    "onUpdate:modelValue": (V) => P.fn = V
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                d("label", ws, [
                  F[15] || (F[15] = M("Field", -1)),
                  b(r(de), {
                    modelValue: P.field,
                    "onUpdate:modelValue": (V) => P.field = V
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                d("label", Vs, [
                  F[16] || (F[16] = M("Order by", -1)),
                  b(r(oe), {
                    "model-value": P.by,
                    "aria-label": "Rollup order",
                    options: ["rank", "time"],
                    showClear: "",
                    appendTo: "self",
                    "onUpdate:modelValue": (V) => P.by = V || void 0
                  }, null, 8, ["model-value", "onUpdate:modelValue"])
                ]),
                b(_l, {
                  modelValue: P.where,
                  "onUpdate:modelValue": (V) => P.where = V,
                  draft: e.draft,
                  "board-id": e.boardId,
                  label: "Include related items when",
                  onValidity: (V) => a("validity", "rollup-" + B, V)
                }, null, 8, ["modelValue", "onUpdate:modelValue", "draft", "board-id", "onValidity"])
              ], 64)) : E("", !0),
              I(P)?.config_schema ? (c(), q(ia, {
                key: P.type,
                schema: I(P).config_schema,
                "model-value": P.config ?? {},
                "onUpdate:modelValue": (V) => P.config = V,
                onValidity: (V) => a("validity", "config-" + B, V)
              }, null, 8, ["schema", "model-value", "onUpdate:modelValue", "onValidity"])) : ["dec", "quantity", "ref", "time", "record"].includes(P.form) || P.config ? (c(), q(at, {
                key: 6,
                label: "Field configuration",
                "model-value": P.config,
                shape: "object",
                "onUpdate:modelValue": (V) => P.config = V,
                onValidity: (V) => a("validity", "config-" + B, V)
              }, null, 8, ["model-value", "onUpdate:modelValue", "onValidity"])) : E("", !0),
              d("section", $s, [
                F[18] || (F[18] = d("h4", { class: "work-group-title" }, "Access", -1)),
                e.installedTypes?.length ? (c(), g("label", xs, [
                  F[17] || (F[17] = M("Custom field type", -1)),
                  b(r(oe), {
                    "model-value": P.type,
                    options: e.installedTypes,
                    optionLabel: "title",
                    optionValue: "id",
                    appendTo: "self",
                    "onUpdate:modelValue": (V) => L(P, V)
                  }, null, 8, ["model-value", "options", "onUpdate:modelValue"])
                ])) : E("", !0),
                (c(), g(Z, null, ae(["read", "write"], (V) => b(ja, {
                  "board-id": e.boardId,
                  key: V,
                  label: V === "read" ? "Who can read" : "Who can edit",
                  "model-value": P.access?.[V],
                  "onUpdate:modelValue": (le) => P.access = { ...P.access, [V]: le },
                  onValidity: (le) => a("validity", "access-" + B + V, le)
                }, null, 8, ["board-id", "label", "model-value", "onUpdate:modelValue", "onValidity"])), 64))
              ])
            ]),
            _: 2
          }, 1032, ["title", "code", "kind"]))), 128)),
          d("div", Cs, [
            d("label", Ss, [
              F[19] || (F[19] = M("New field identifier", -1)),
              b(r(de), {
                modelValue: s.value,
                "onUpdate:modelValue": F[1] || (F[1] = (P) => s.value = P),
                onKeydown: Ae(be(A, ["prevent"]), ["enter"])
              }, null, 8, ["modelValue", "onKeydown"])
            ]),
            b(r(H), {
              label: "Add field",
              severity: "secondary",
              disabled: !s.value.trim(),
              onClick: A,
              outlined: ""
            }, {
              icon: z(() => [
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
        [r(m)]
      ])
    ]));
  }
}), Es = ["disabled"], Us = { class: "work-chips" }, Ds = {
  key: 1,
  class: "work-muted work-small"
}, Lt = /* @__PURE__ */ ue({
  __name: "ChipPicker",
  props: {
    label: {},
    options: {},
    modelValue: {},
    disabled: { type: Boolean }
  },
  emits: ["update:modelValue"],
  setup(e, { emit: l }) {
    const t = e, a = l, o = j(""), s = Y(() => t.options.map((m) => typeof m == "string" ? { value: m } : m)), v = Y(() => s.value.filter((m) => (m.label ?? ge(m.value)).toLocaleLowerCase().includes(o.value.toLocaleLowerCase())));
    function f(m) {
      if (t.disabled) return;
      const i = t.modelValue ?? [];
      a("update:modelValue", i.includes(m) ? i.filter((n) => n !== m) : [...i, m]);
    }
    return (m, i) => (c(), g("fieldset", {
      class: "work-chip-picker",
      disabled: e.disabled
    }, [
      d("legend", null, D(e.label), 1),
      e.options.length > 10 ? (c(), q(r(de), {
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
          options: v.value.map((n) => ({ value: n.value, label: n.label ?? r(ge)(n.value) })),
          optionLabel: "label",
          optionValue: "value",
          multiple: "",
          disabled: e.disabled,
          "aria-label": e.label,
          "onUpdate:modelValue": i[1] || (i[1] = (n) => a("update:modelValue", n ?? []))
        }, null, 8, ["model-value", "options", "disabled", "aria-label"]),
        (c(!0), g(Z, null, ae(e.modelValue?.filter((n) => !s.value.some((u) => u.value === n)) ?? [], (n) => (c(), q(r(H), {
          severity: "secondary",
          text: "",
          size: "small",
          key: n,
          type: "button",
          class: "work-choice work-unavailable",
          "aria-label": "Remove unavailable " + n,
          onClick: (u) => f(n)
        }, {
          default: z(() => [
            M(D(r(ge)(n)) + " · unavailable ×", 1)
          ]),
          _: 2
        }, 1032, ["aria-label", "onClick"]))), 128))
      ]),
      e.options.length ? E("", !0) : (c(), g("span", Ds, "No choices declared."))
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
}, Ks = /* @__PURE__ */ ue({
  __name: "TypesEditor",
  props: {
    draft: {},
    guardRemoval: { type: Function },
    issues: {}
  },
  setup(e) {
    const l = e, t = Y(() => l.draft.item_types ?? []), a = j(""), o = j(""), s = j(""), v = Y(() => /^[a-z][a-z0-9_]*$/.test(a.value) && !t.value.some((y) => y.id === a.value));
    function f() {
      v.value && ((l.draft.item_types ??= []).push({ id: a.value, title: ge(a.value), process: l.draft.processes?.[0]?.id ?? "", fields: [] }), a.value = "");
    }
    function m(y, p) {
      const w = y.id;
      y.id = p;
      for (const x of t.value) x.parent_types && (x.parent_types = x.parent_types.map((I) => I === w ? p : I));
    }
    function i(y, p) {
      y.fields = p, y.inherit && (y.inherit = y.inherit.filter((w) => p.includes(w)));
    }
    function n(y) {
      return t.value.filter((p) => p.id !== y.id && p.parent_types?.includes(y.id)).map((p) => p.title || ge(p.id));
    }
    async function u(y) {
      if (!s.value) {
        if (n(y).length) {
          o.value = `${y.title || ge(y.id)} is a parent type for ${n(y).join(", ")}. Remove those parent selections first.`;
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
    return (y, p) => (c(), g("section", Is, [
      d("header", As, [
        p[1] || (p[1] = d("div", null, [
          d("h2", null, "Item types"),
          d("p", { class: "work-muted work-small" }, "Choose the fields, parent relationships and process for each kind of work.")
        ], -1)),
        b(r(Re), {
          class: "kx-tag-sm",
          severity: "secondary"
        }, {
          default: z(() => [
            M(D(t.value.length) + " " + D(t.value.length === 1 ? "type" : "types"), 1)
          ]),
          _: 1
        })
      ]),
      o.value ? (c(), g("p", Ps, D(o.value), 1)) : E("", !0),
      b($l, {
        columns: "types",
        count: t.value.length
      }, {
        default: z(() => [
          (c(!0), g(Z, null, ae(t.value, (w, x) => (c(), q(Vl, {
            title: w.title || r(ge)(w.id),
            code: w.id,
            kind: e.draft.processes?.find((I) => I.id === w.process)?.name || r(ge)(w.process),
            key: x,
            class: "work-type-card"
          }, {
            usage: z(() => [
              d("span", Rs, [
                b(r(Re), {
                  class: "kx-tag-sm",
                  severity: "secondary"
                }, {
                  default: z(() => [
                    M(D(w.fields.length) + " " + D(w.fields.length === 1 ? "field" : "fields"), 1)
                  ]),
                  _: 2
                }, 1024),
                n(w).length ? (c(), q(r(Re), {
                  key: 0,
                  class: "kx-tag-sm",
                  severity: "secondary"
                }, {
                  default: z(() => [
                    M("Parent of " + D(n(w).join(", ")), 1)
                  ]),
                  _: 2
                }, 1024)) : E("", !0)
              ])
            ]),
            actions: z(() => [
              b(r(H), {
                severity: "secondary",
                text: "",
                size: "small",
                disabled: !!s.value,
                onClick: (I) => u(w),
                "aria-label": "Remove type"
              }, {
                default: z(() => [
                  b(r(_), {
                    icon: "tabler:trash",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["disabled", "onClick"])
            ]),
            default: z(() => [
              (c(!0), g(Z, null, ae(e.issues?.filter((I) => I.code === "item_type " + w.id) ?? [], (I) => (c(), g("p", {
                key: I.what,
                class: "work-error work-small",
                role: "alert"
              }, D(r(wl)(I)), 1))), 128)),
              d("div", Os, [
                d("label", Ns, [
                  p[2] || (p[2] = M("Identifier", -1)),
                  b(r(de), {
                    value: w.id,
                    onChange: (I) => m(w, I.target.value),
                    required: "",
                    pattern: "[a-z][a-z0-9_]*"
                  }, null, 8, ["value", "onChange"])
                ]),
                d("label", Ms, [
                  p[3] || (p[3] = M("Title", -1)),
                  b(r(de), {
                    modelValue: w.title,
                    "onUpdate:modelValue": (I) => w.title = I,
                    placeholder: r(ge)(w.id)
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder"])
                ]),
                d("label", Fs, [
                  p[4] || (p[4] = M("Process", -1)),
                  b(r(oe), {
                    modelValue: w.process,
                    "onUpdate:modelValue": (I) => w.process = I,
                    required: "",
                    appendTo: "self",
                    optionLabel: "label",
                    optionValue: "value",
                    optionDisabled: "disabled",
                    options: [...(e.draft.processes ?? []).map((I) => ({ label: I.name || r(ge)(I.id), value: I.id, disabled: !1 }))]
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                ])
              ]),
              b(Lt, {
                label: "Fields",
                options: (e.draft.fields ?? []).map((I) => ({ value: I.code, label: r(Ct)(I) })),
                "model-value": w.fields,
                "onUpdate:modelValue": (I) => i(w, I)
              }, null, 8, ["options", "model-value", "onUpdate:modelValue"]),
              b(Lt, {
                label: "Parent types",
                options: t.value.map((I) => ({ value: I.id, label: I.title || r(ge)(I.id) })),
                modelValue: w.parent_types,
                "onUpdate:modelValue": (I) => w.parent_types = I
              }, null, 8, ["options", "modelValue", "onUpdate:modelValue"]),
              d("div", Ls, [
                b(Lt, {
                  label: "Inherit from parent",
                  options: w.fields.map((I) => ({ value: I, label: r(Ct)(e.draft.fields?.find((T) => T.code === I) ?? { code: I }) })),
                  modelValue: w.inherit,
                  "onUpdate:modelValue": (I) => w.inherit = I
                }, null, 8, ["options", "modelValue", "onUpdate:modelValue"]),
                p[5] || (p[5] = d("p", { class: "work-muted work-small" }, "These fields resolve from the parent when this item has no own value.", -1))
              ]),
              w.parent_types?.length ? (c(), g("label", zs, [
                p[6] || (p[6] = M("When the parent moves", -1)),
                b(r(oe), {
                  modelValue: w.move_children,
                  "onUpdate:modelValue": (I) => w.move_children = I,
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
          t.value.length ? E("", !0) : (c(), g("p", Bs, "Add an item type to connect fields to a process.")),
          d("div", js, [
            d("label", qs, [
              p[7] || (p[7] = M("New type identifier", -1)),
              b(r(de), {
                modelValue: a.value,
                "onUpdate:modelValue": p[0] || (p[0] = (w) => a.value = w),
                placeholder: "new_type",
                onKeydown: Ae(be(f, ["prevent"]), ["enter"])
              }, null, 8, ["modelValue", "onKeydown"])
            ]),
            b(r(H), {
              label: "Add type",
              severity: "secondary",
              disabled: !v.value,
              onClick: f,
              outlined: ""
            }, {
              icon: z(() => [
                b(r(_), {
                  icon: "tabler:plus",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["disabled"]),
            a.value && !v.value ? (c(), g("span", Ws, "Use a unique lowercase identifier with letters, numbers and underscores.")) : E("", !0)
          ])
        ]),
        _: 1
      }, 8, ["count"])
    ]));
  }
}), Gs = ".work-process-canvas>svg{height:480px;width:100%}.work-process-canvas:focus-visible{outline:var(--p-focus-ring-width) var(--p-focus-ring-style) var(--p-focus-ring-color);outline-offset:var(--p-focus-ring-offset)}.work-state-card{fill:var(--p-content-background);stroke:var(--p-content-border-color);stroke-width:1.5}.work-graph-node.work-selected .work-state-card{stroke:var(--p-primary-color);stroke-width:2.5;fill:color-mix(in srgb,var(--p-primary-color) 6%,var(--p-content-background))}.work-graph-node:focus-visible .work-state-card{stroke:var(--p-focus-ring-color);stroke-width:var(--p-focus-ring-width)}.work-process-canvas .work-edge-label{font-size:12px;fill:var(--p-text-color)}.work-process-canvas .work-edge-label-bg{fill:var(--p-content-background);stroke:var(--p-content-border-color);stroke-width:1}.work-edge-line{stroke:var(--p-primary-color);stroke-width:1.5}.work-edge-return .work-edge-line{stroke:var(--p-text-muted-color);stroke-dasharray:5 4}.work-graph-arrow{fill:context-stroke}.work-lane-line{fill:none;stroke:var(--p-text-muted-color);stroke-width:1.5;stroke-dasharray:2 4}.work-node-connector{fill:var(--p-content-background);stroke:var(--p-primary-color);stroke-width:1.5}.work-node-connector:hover,.work-node-connector:focus-visible{fill:var(--p-primary-color)}.work-process-legend{position:static;flex-wrap:wrap;padding:10px 16px;border-top:1px solid var(--p-content-border-color);background:var(--p-content-background)}@media(max-width:700px){.work-process-canvas>svg{height:420px}}.work-process-more{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:8px;padding:8px 16px;border-top:1px solid var(--p-content-border-color);background:var(--p-content-background);color:var(--p-text-muted-color);font-size:12px}.work-process-canvas .work-graph-edge.work-selected .work-edge-label-bg{fill:var(--p-primary-color);stroke:var(--p-primary-color)}.work-process-canvas .work-graph-edge.work-selected .work-edge-label{fill:var(--p-primary-contrast-color)}", xa = /* @__PURE__ */ new WeakSet();
function Ys(e) {
  const l = e.getRootNode();
  if (l instanceof ShadowRoot && !xa.has(l)) {
    const t = e.ownerDocument.createElement("style");
    t.textContent = Gs, l.append(t), xa.add(l);
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
}, wr = { class: "work-process-legend" }, Vr = /* @__PURE__ */ ue({
  __name: "ProcessGraph",
  props: {
    process: {},
    draft: {},
    selectedState: {},
    selectedTransition: {}
  },
  emits: ["state", "transition", "connect", "clear"],
  setup(e, { expose: l, emit: t }) {
    const a = e, o = t, s = Xl().replace(/:/g, "_"), v = j(""), f = j(), m = j(), i = j(900), n = j(!1), u = Y(() => i.value < 700 ? 420 : 480), y = Y(() => Go(a.process, a.draft, { width: i.value, height: u.value })), p = j(1), w = j({ x: 0, y: 0 }), x = j({ x: 0, y: 0 }), I = Y(() => ({ width: i.value, height: n.value ? Math.max(u.value, y.value.height * Math.min(1, i.value / y.value.width)) : u.value })), T = Y(() => y.value.nodes.filter((h) => h.x - h.width / 2 >= w.value.x && h.x + h.width / 2 <= w.value.x + I.value.width / p.value && h.y - h.height / 2 >= w.value.y && h.y + h.height / 2 <= w.value.y + I.value.height / p.value).length);
    function X() {
      n.value = !1;
      const h = Xs(y.value, I.value, a.process.initial);
      p.value = h.zoom, w.value = h.pan;
    }
    const L = Y(() => `${w.value.x} ${w.value.y} ${I.value.width / p.value} ${I.value.height / p.value}`), S = Y(() => y.value.nodes.find((h) => h.state.id === v.value));
    function U() {
      n.value = !0, p.value = Math.min(1, I.value.width / y.value.width), w.value = { x: (y.value.width - I.value.width / p.value) / 2, y: 0 };
    }
    function A(h) {
      const C = Math.max(0.02, Math.min(3, p.value * h)), k = 1 / p.value - 1 / C;
      w.value = { x: w.value.x + I.value.width * k / 2, y: w.value.y + I.value.height * k / 2 }, p.value = C;
    }
    function O(h) {
      const C = I.value.width / p.value, k = I.value.height / p.value;
      (h.x - h.width / 2 < w.value.x || h.x + h.width / 2 > w.value.x + C || h.y - h.height / 2 < w.value.y || h.y + h.height / 2 > w.value.y + k) && (w.value = { x: h.x - C / 2, y: h.y - k / 2 });
    }
    function F() {
      const h = y.value.nodes.find((C) => C.state === a.selectedState) ?? y.value.edges.find((C) => C.transition === a.selectedTransition);
      h && O(h);
    }
    xe([y, () => a.selectedState, () => a.selectedTransition], F, { flush: "post" }), xe(() => a.process.id, () => {
      v.value = "", R.clear(), X();
    }, { flush: "post" });
    function P(h) {
      if (h.target !== f.value) return;
      (h.key === "+" || h.key === "=") && (h.preventDefault(), A(1.2)), h.key === "-" && (h.preventDefault(), A(1 / 1.2)), h.key === "0" && (h.preventDefault(), U());
      const C = 60 / p.value;
      h.key.startsWith("Arrow") && (h.preventDefault(), w.value = { x: w.value.x + (h.key === "ArrowRight" ? C : h.key === "ArrowLeft" ? -C : 0), y: w.value.y + (h.key === "ArrowDown" ? C : h.key === "ArrowUp" ? -C : 0) });
    }
    function B(h) {
      v.value && v.value !== h.id && o("connect", v.value, h.id), v.value = "";
    }
    function V(h, C) {
      v.value = C.state.id, x.value = { x: C.x, y: C.y };
      const k = h.target;
      k instanceof Element && k.hasPointerCapture?.(h.pointerId) && k.releasePointerCapture(h.pointerId);
    }
    function le(h, C) {
      if ((h.key === "Enter" || h.key === " ") && (h.preventDefault(), v.value ? B(C) : o("state", C)), ["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp"].includes(h.key)) {
        h.preventDefault();
        const k = Array.from(m.value?.querySelectorAll(".work-graph-node") ?? []), W = y.value.nodes.findIndex((re) => re.state === C), J = ["ArrowRight", "ArrowDown"].includes(h.key) ? 1 : -1;
        k[(W + J + k.length) % k.length]?.focus();
      }
    }
    function $() {
      v.value = "", R.clear(), o("clear");
    }
    const R = /* @__PURE__ */ new Map();
    let N = 0;
    function Q(h) {
      if (!h.target.closest('[role="button"]') && (R.set(h.pointerId, { x: h.clientX, y: h.clientY }), f.value?.setPointerCapture?.(h.pointerId), R.size === 2)) {
        const [C, k] = [...R.values()];
        N = Math.hypot(C.x - k.x, C.y - k.y);
      }
    }
    function ce(h) {
      const C = m.value?.getBoundingClientRect();
      if (!C?.width) return;
      if (v.value) {
        x.value = { x: w.value.x + (h.clientX - C.left) * I.value.width / p.value / C.width, y: w.value.y + (h.clientY - C.top) * I.value.height / p.value / C.height };
        return;
      }
      const k = R.get(h.pointerId);
      if (k)
        if (R.set(h.pointerId, { x: h.clientX, y: h.clientY }), R.size === 2) {
          const [W, J] = [...R.values()], re = Math.hypot(W.x - J.x, W.y - J.y);
          N && A(re / N), N = re;
        } else w.value = { x: w.value.x - (h.clientX - k.x) * I.value.width / p.value / C.width, y: w.value.y - (h.clientY - k.y) * I.value.height / p.value / C.height };
    }
    function pe(h) {
      R.delete(h.pointerId), N = 0, v.value = "";
    }
    function ke(h) {
      h.ctrlKey && (h.preventDefault(), A(Math.exp(-h.deltaY * 0.01)));
    }
    let Ve;
    kl(() => {
      if (f.value && Ys(f.value), typeof ResizeObserver < "u" && m.value) {
        let h = !0;
        Ve = new ResizeObserver(() => {
          const C = m.value?.getBoundingClientRect();
          if (!C?.width || !C.height) return;
          const k = I.value.width;
          i.value = C.width, (h || Math.abs(C.width - k) > 1) && (n.value ? U() : X(), h = !1), F();
        }), Ve.observe(m.value);
      }
    }), it(() => Ve?.disconnect()), l({ fit: U, zoomIn: () => A(1.2), zoomOut: () => A(1 / 1.2) });
    function De(h) {
      return h.category === "completed" ? "check" : h.category === "canceled" ? "x" : h.id === a.process.initial ? "arrow-bar-to-right" : { gate: "shield-check", automated: "bolt", parallel: "arrows-split" }[h.kind ?? ""] ?? "user";
    }
    return (h, C) => (c(), g("section", {
      ref_key: "canvas",
      ref: f,
      class: "work-process-canvas",
      "aria-label": "Process map",
      tabindex: "0",
      onKeydown: [
        P,
        Ae(be($, ["stop"]), ["esc"])
      ],
      onPointerdown: Q,
      onPointermove: ce,
      onPointerup: pe,
      onPointercancel: $,
      onWheel: ke
    }, [
      v.value ? (c(), g("p", Zs, "Choose the next stop. Escape cancels.")) : E("", !0),
      (c(), g("svg", {
        ref_key: "svg",
        ref: m,
        style: bo({ height: I.value.height + "px" }),
        viewBox: L.value,
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
          }, [...C[1] || (C[1] = [
            d("path", {
              d: "M0 0 L8 4 L0 8 z",
              class: "work-graph-arrow"
            }, null, -1)
          ])], 8, _s)
        ]),
        (c(!0), g(Z, null, ae(y.value.parallels, (k) => (c(), g("path", {
          key: k.key,
          d: k.path,
          class: "work-lane-line",
          "marker-end": `url(#${r(s)}-arrow)`
        }, [
          d("title", null, "Parallel lane from " + D(r(he)(k.state)), 1)
        ], 8, er))), 128)),
        (c(!0), g(Z, null, ae(y.value.edges, (k) => (c(), g("g", {
          key: k.key,
          class: ft(["work-graph-edge", ["work-edge-" + k.type, { "work-selected": e.selectedTransition === k.transition }]]),
          role: "button",
          tabindex: "0",
          "aria-label": "Edit transition " + r(je)(k.transition),
          "aria-pressed": e.selectedTransition === k.transition,
          onFocus: (W) => O(k),
          onClick: (W) => o("transition", k.transition),
          onKeydown: [
            Ae(be((W) => o("transition", k.transition), ["prevent"]), ["enter"]),
            Ae(be((W) => o("transition", k.transition), ["prevent"]), ["space"])
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
            (c(!0), g(Z, null, ae(k.lines, (W, J) => (c(), g("tspan", {
              key: J,
              x: k.x,
              dy: J ? 16 : 0
            }, D(W), 9, nr))), 128))
          ], 8, ir)
        ], 42, tr))), 128)),
        (c(!0), g(Z, null, ae(y.value.nodes, (k) => (c(), g("g", {
          key: k.state.id,
          class: ft(["work-graph-node", ["work-stop-" + k.state.category, { "work-selected": e.selectedState === k.state }]]),
          role: "button",
          tabindex: "0",
          "aria-label": "Edit state " + r(he)(k.state),
          "aria-pressed": e.selectedState === k.state,
          onClick: (W) => o("state", k.state),
          onKeydown: (W) => le(W, k.state),
          onFocus: (W) => O(k),
          onPointerup: be((W) => B(k.state), ["stop"])
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
            (c(!0), g(Z, null, ae(k.title, (W, J) => (c(), g("tspan", {
              key: J,
              x: k.x - k.width / 2 + 42,
              dy: J ? 18 : 0
            }, D(W), 9, cr))), 128))
          ], 8, ur),
          d("text", {
            x: k.x - k.width / 2 + 16,
            y: k.y - k.height / 2 + 33 + k.title.length * 18,
            class: "work-node-meta"
          }, [
            (c(!0), g(Z, null, ae(k.caption, (W, J) => (c(), g("tspan", {
              key: J,
              x: k.x - k.width / 2 + 16,
              dy: J ? 16 : 0
            }, D(W), 9, mr))), 128)),
            e.draft.policy?.wip?.[k.state.id] ? (c(), g("tspan", fr, " · limit " + D(e.draft.policy.wip[k.state.id].limit), 1)) : E("", !0)
          ], 8, vr),
          (c(!0), g(Z, null, ae(k.badges, (W, J) => (c(), g("g", {
            key: W.id,
            class: "work-any-transition",
            role: "button",
            tabindex: "0",
            "aria-label": "Edit transition " + r(je)(W),
            onClick: be((re) => o("transition", W), ["stop"]),
            onKeydown: [
              Ae(be((re) => o("transition", W), ["stop", "prevent"]), ["enter"]),
              Ae(be((re) => o("transition", W), ["stop", "prevent"]), ["space"])
            ]
          }, [
            d("text", {
              x: k.x - k.width / 2 + 16,
              y: k.y - k.height / 2 + 33 + k.title.length * 18 + k.caption.length * 16 + k.badges.slice(0, J).reduce((re, fe) => re + r(Ot)(r(je)(fe) + " works from any state").length * 18, 0),
              class: "work-node-meta"
            }, [
              (c(!0), g(Z, null, ae(r(Ot)(r(je)(W) + " works from any state"), (re, fe) => (c(), g("tspan", {
                key: fe,
                x: k.x - k.width / 2 + 16,
                dy: fe ? 18 : 0
              }, D(re), 9, hr))), 128))
            ], 8, br)
          ], 40, pr))), 128)),
          ["completed", "canceled"].includes(k.state.category) ? E("", !0) : (c(), g("circle", {
            key: 0,
            cx: y.value.direction === "TB" ? k.x : k.x + k.width / 2,
            cy: y.value.direction === "TB" ? k.y + k.height / 2 : k.y,
            r: "7",
            class: "work-node-connector",
            role: "button",
            tabindex: "0",
            "aria-label": "Connect from " + r(he)(k.state),
            onPointerdown: be((W) => V(W, k), ["stop", "prevent"]),
            onClick: be((W) => o("state", k.state), ["stop"]),
            onKeydown: [
              Ae(be((W) => {
                v.value = k.state.id, x.value = { x: k.x, y: k.y };
              }, ["stop", "prevent"]), ["enter"]),
              Ae(be((W) => v.value = k.state.id, ["stop", "prevent"]), ["space"])
            ]
          }, null, 40, yr))
        ], 42, sr))), 128)),
        S.value ? (c(), g("path", {
          key: 0,
          d: `M ${y.value.direction === "TB" ? S.value.x : S.value.x + S.value.width / 2} ${y.value.direction === "TB" ? S.value.y + S.value.height / 2 : S.value.y} L ${x.value.x} ${x.value.y}`,
          class: "work-connect-ghost"
        }, null, 8, gr)) : E("", !0)
      ], 12, Qs)),
      !n.value && T.value < e.process.states.length ? (c(), g("div", kr, [
        d("span", null, D(T.value) + " of " + D(e.process.states.length) + " states in view · More " + D(y.value.direction === "TB" ? "below" : "to the right"), 1),
        b(r(H), {
          label: "Show full process",
          size: "small",
          text: "",
          onClick: C[0] || (C[0] = (k) => U())
        })
      ])) : E("", !0),
      d("div", wr, [
        d("span", null, D(e.process.states.length) + " states · " + D(Math.round(p.value * 100)) + "%", 1),
        C[2] || (C[2] = d("span", null, [
          d("i"),
          M("Transition")
        ], -1)),
        C[3] || (C[3] = d("span", null, [
          d("i", { class: "work-return-key" }),
          M("Return / loop")
        ], -1)),
        C[4] || (C[4] = d("span", null, "Drag to pan · Ctrl + scroll to zoom · Fit for full process", -1))
      ])
    ], 40, Js));
  }
}), $r = {
  class: "work-process-list work-stack",
  "aria-label": "Process list"
}, xr = { class: "work-stack work-tight" }, Cr = { class: "work-table-scroll" }, Sr = { class: "work-settings-table work-process-table" }, Tr = ["aria-selected"], Er = { class: "work-process-list-actions" }, Ur = { class: "work-table-scroll" }, Dr = { class: "work-settings-table work-process-table" }, Ir = ["aria-selected"], Ar = { class: "work-process-list-actions" }, Pr = /* @__PURE__ */ ue({
  __name: "ProcessList",
  props: {
    process: {},
    selectedState: {},
    selectedTransition: {}
  },
  emits: ["state", "transition", "removeState", "removeTransition", "addTransition"],
  setup(e) {
    return (l, t) => (c(), g("section", $r, [
      d("label", xr, [
        t[2] || (t[2] = M("Process name", -1)),
        b(r(de), {
          modelValue: e.process.name,
          "onUpdate:modelValue": t[0] || (t[0] = (a) => e.process.name = a),
          "aria-label": "Process name"
        }, null, 8, ["modelValue"])
      ]),
      t[5] || (t[5] = d("h3", null, "States", -1)),
      d("div", Cr, [
        d("table", Sr, [
          t[3] || (t[3] = d("thead", null, [
            d("tr", null, [
              d("th", null, "Name"),
              d("th", null, "Phase"),
              d("th", null, "Kind"),
              d("th", null, "Actions")
            ])
          ], -1)),
          d("tbody", null, [
            (c(!0), g(Z, null, ae(e.process.states, (a) => (c(), g("tr", {
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
              d("td", null, D(r(Zl)(a.category)), 1),
              d("td", null, [
                b(r(Re), { severity: "secondary" }, {
                  default: z(() => [
                    M(D(r(Ma)(a.kind)), 1)
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
                  default: z(() => [
                    b(r(_), { icon: "tabler:pencil" })
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
                  default: z(() => [
                    b(r(_), { icon: "tabler:trash" })
                  ]),
                  _: 1
                }, 8, ["aria-label", "onClick"])
              ])
            ], 8, Tr))), 128))
          ])
        ])
      ]),
      t[6] || (t[6] = d("h3", null, "Transitions", -1)),
      d("div", Ur, [
        d("table", Dr, [
          t[4] || (t[4] = d("thead", null, [
            d("tr", null, [
              d("th", null, "Name"),
              d("th", null, "From"),
              d("th", null, "To"),
              d("th", null, "Actions")
            ])
          ], -1)),
          d("tbody", null, [
            (c(!0), g(Z, null, ae(e.process.transitions ?? [], (a) => (c(), g("tr", {
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
              d("td", null, D(a.from === "any" ? "Any state" : a.from.map((o) => r(he)(e.process.states.find((s) => s.id === o))).join(", ")), 1),
              d("td", null, D(r(he)(e.process.states.find((o) => o.id === a.to))), 1),
              d("td", Ar, [
                b(r(H), {
                  size: "small",
                  text: "",
                  severity: "secondary",
                  "aria-label": "Edit transition",
                  onClick: (o) => l.$emit("transition", a)
                }, {
                  default: z(() => [
                    b(r(_), { icon: "tabler:pencil" })
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
                  default: z(() => [
                    b(r(_), { icon: "tabler:trash" })
                  ]),
                  _: 1
                }, 8, ["aria-label", "onClick"])
              ])
            ], 8, Ir))), 128))
          ])
        ])
      ]),
      b(r(H), {
        label: "Add transition",
        severity: "secondary",
        outlined: "",
        onClick: t[1] || (t[1] = (a) => l.$emit("addTransition"))
      }, {
        icon: z(() => [
          b(r(_), { icon: "tabler:plus" })
        ]),
        _: 1
      })
    ]));
  }
}), Rr = { class: "work-stack work-transition-settings" }, Or = { class: "work-stack work-tight" }, Nr = { class: "work-row" }, Mr = { class: "work-row" }, Fr = { class: "work-row" }, Lr = { class: "work-stack work-tight" }, zr = { class: "work-row" }, Br = { class: "work-stack work-tight" }, jr = { class: "work-stack work-tight" }, qr = /* @__PURE__ */ ue({
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
    return (v, f) => (c(), g("div", Rr, [
      d("label", Or, [
        f[14] || (f[14] = M("To state", -1)),
        b(r(oe), {
          modelValue: e.transition.to,
          "onUpdate:modelValue": f[0] || (f[0] = (m) => e.transition.to = m),
          "aria-label": "To state",
          appendTo: "self",
          optionLabel: "label",
          optionValue: "value",
          options: e.process.states.map((m) => ({ label: r(he)(m), value: m.id }))
        }, null, 8, ["modelValue", "options"])
      ]),
      d("label", Nr, [
        f[15] || (f[15] = d("span", { class: "work-spacer" }, "Happens automatically", -1)),
        b(r(Le), {
          "model-value": e.transition.auto,
          "onUpdate:modelValue": f[1] || (f[1] = (m) => {
            e.transition.auto = m, m || delete e.transition.default;
          }),
          "aria-label": "Automatic transition"
        }, null, 8, ["model-value"])
      ]),
      d("label", Mr, [
        f[16] || (f[16] = d("span", { class: "work-spacer" }, "Default automatic transition", -1)),
        b(r(Le), {
          modelValue: e.transition.default,
          "onUpdate:modelValue": f[2] || (f[2] = (m) => e.transition.default = m),
          disabled: !e.transition.auto,
          "aria-label": "Default transition"
        }, null, 8, ["modelValue", "disabled"])
      ]),
      d("label", Fr, [
        f[17] || (f[17] = d("span", { class: "work-spacer" }, "Works from any state", -1)),
        b(r(Le), {
          "model-value": e.transition.from === "any",
          "aria-label": "Works from any state",
          "onUpdate:modelValue": f[3] || (f[3] = (m) => e.transition.from = m ? "any" : [])
        }, null, 8, ["model-value"])
      ]),
      e.transition.from !== "any" ? (c(), q(Lt, {
        key: 0,
        label: "From states",
        options: e.process.states.map((m) => ({ value: m.id, label: r(he)(m) })),
        modelValue: e.transition.from,
        "onUpdate:modelValue": f[4] || (f[4] = (m) => e.transition.from = m)
      }, null, 8, ["options", "modelValue"])) : E("", !0),
      f[21] || (f[21] = d("h4", { class: "work-process-group" }, "Must be filled", -1)),
      b(Lt, {
        label: "Required fields",
        options: e.draft.fields?.map((m) => ({ value: m.code, label: m.title || m.code })) ?? [],
        modelValue: e.transition.require,
        "onUpdate:modelValue": f[5] || (f[5] = (m) => e.transition.require = m)
      }, null, 8, ["options", "modelValue"]),
      f[22] || (f[22] = d("h4", { class: "work-process-group" }, "Also sets", -1)),
      (c(!0), g(Z, null, ae(e.transition.set ?? [], (m, i) => (c(), g("div", {
        key: i,
        class: "work-process-value work-stack work-tight"
      }, [
        d("label", Lr, [
          f[18] || (f[18] = M("Field", -1)),
          b(r(oe), {
            modelValue: m.field,
            "onUpdate:modelValue": (n) => m.field = n,
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            options: e.draft.fields?.map((n) => ({ value: n.code, label: n.title || n.code })) ?? []
          }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
        ]),
        d("div", zr, [
          b(r(oe), {
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
          b(r(H), {
            text: "",
            severity: "danger",
            "aria-label": "Remove value " + (i + 1),
            onClick: (n) => e.transition.set?.splice(i, 1)
          }, {
            default: z(() => [
              b(r(_), { icon: "tabler:trash" })
            ]),
            _: 1
          }, 8, ["aria-label", "onClick"])
        ]),
        m.copy !== void 0 ? (c(), q(r(oe), {
          key: 0,
          modelValue: m.copy,
          "onUpdate:modelValue": (n) => m.copy = n,
          "aria-label": "Copy from field",
          appendTo: "self",
          optionLabel: "label",
          optionValue: "value",
          options: e.draft.fields?.map((n) => ({ value: n.code, label: n.title || n.code })) ?? []
        }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])) : m.clear ? E("", !0) : (c(!0), g(Z, { key: 1 }, ae(e.draft.fields?.filter((n) => n.code === m.field) ?? [], (n) => (c(), q(Ba, {
          key: n.code,
          "board-id": e.boardId ?? "",
          field: n,
          modelValue: m.value,
          "onUpdate:modelValue": (u) => m.value = u,
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
        icon: z(() => [
          b(r(_), { icon: "tabler:plus" })
        ]),
        _: 1
      }),
      d("label", Br, [
        f[19] || (f[19] = M("Offer to people", -1)),
        b(r(oe), {
          "model-value": e.transition.people,
          "aria-label": "Offer to people",
          appendTo: "self",
          optionLabel: "label",
          optionValue: "value",
          options: [{ label: "Work default", value: void 0 }, { label: "Offer explicitly", value: !0 }, { label: "Hide from people", value: !1 }],
          "onUpdate:modelValue": f[6] || (f[6] = (m) => e.transition.people = m)
        }, null, 8, ["model-value"])
      ]),
      d("label", jr, [
        f[20] || (f[20] = M("Evaluation order", -1)),
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
      b(at, {
        label: "Set values",
        "model-value": e.transition.set,
        shape: "array",
        "onUpdate:modelValue": f[10] || (f[10] = (m) => e.transition.set = m),
        onValidity: f[11] || (f[11] = (m) => a("validity", "set", m))
      }, null, 8, ["model-value"]),
      b(at, {
        label: "Guards",
        "model-value": e.transition.guards,
        shape: "array",
        "onUpdate:modelValue": f[12] || (f[12] = (m) => e.transition.guards = m),
        onValidity: f[13] || (f[13] = (m) => a("validity", "guards", m))
      }, null, 8, ["model-value"])
    ]));
  }
}), gl = /* @__PURE__ */ ue({
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
      const v = l.draft.policy ??= {}, f = v.wip ??= {};
      f[l.state] = { ...f[l.state], limit: s };
    }
    function o(s) {
      t.value && (t.value.hard = s);
    }
    return (s, v) => e.hard ? (c(), q(r(Le), {
      key: 0,
      "aria-label": e.label,
      disabled: !t.value,
      "model-value": t.value?.hard ?? !1,
      "onUpdate:modelValue": o
    }, null, 8, ["aria-label", "disabled", "model-value"])) : (c(), q(r(Ge), {
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
async function Ca(e) {
  try {
    const { data: l } = await No.get(e);
    if (!l?.success) throw new Error(l?.message || (typeof l?.error == "string" ? l.error : l?.error?.message) || "Could not read published Flow.");
    return l;
  } catch (l) {
    throw Co(l, "Published Flow");
  }
}
const Sa = (e) => `/api/v1/workflows/${encodeURIComponent(e)}/versions`, Ta = {
  versions: async (e) => (await Ca(Sa(e))).versions ?? [],
  check: async (e) => {
    if ((await Ca(`${Sa(e.id)}/${e.version}`)).version?.version !== e.version) throw new Error("The published version is unavailable.");
  }
}, Wr = {
  class: "work-stack work-tight",
  "aria-label": "Stage Flow"
}, Kr = {
  key: 0,
  class: "work-muted work-small"
}, Gr = {
  key: 1,
  class: "kx-err",
  role: "alert"
}, Yr = ["schema", "config", "title"], Hr = {
  key: 3,
  class: "kx-err",
  role: "alert"
}, Xr = {
  key: 4,
  class: "work-stack work-tight"
}, Jr = {
  key: 5,
  class: "work-muted work-small",
  role: "status"
}, Zr = /* @__PURE__ */ ue({
  __name: "StageFlow",
  props: {
    modelValue: {}
  },
  emits: ["update:modelValue", "validity"],
  setup(e, { emit: l }) {
    const t = e, a = l, o = j(!1), s = j(""), v = j([]), f = j(!1), m = j(""), i = j(!1), n = Y(() => s.value || t.modelValue?.id), u = JSON.stringify({ properties: { flow_ref: { title: "Published Flow", picker: "wc-workflow-picker" } } }), y = Y(() => JSON.stringify(t.modelValue ? { flow_ref: t.modelValue } : {}));
    let p = 0;
    async function w() {
      o.value = await tt("wc-workflow-picker");
    }
    w();
    async function x() {
      const L = ++p, S = n.value, U = t.modelValue;
      if (f.value = !!S, m.value = "", v.value = [], !!S)
        try {
          const [A] = await Promise.all([Ta.versions(S), !i.value && U ? Ta.check(U) : Promise.resolve()]);
          if (L !== p) return;
          if (v.value = A.filter((O) => Number.isInteger(O.version) && O.version > 0), !i.value && U && !v.value.some((O) => O.version === U.version)) throw new Error("The published version is unavailable.");
        } catch (A) {
          L === p && (m.value = A instanceof Error ? A.message : "Could not read published Flow.");
        } finally {
          L === p && (f.value = !1);
        }
    }
    xe([n, () => t.modelValue?.version, i], x, { immediate: !0 }), xe(i, (L) => a("validity", !L), { immediate: !0 });
    function I(L) {
      const S = L.detail?.flow_ref;
      S?.kind !== "flow" || !S.id || (i.value = !0, s.value = S.id);
    }
    function T(L) {
      !n.value || !v.value.some((S) => S.version === L) || (a("update:modelValue", { kind: "flow", id: n.value, version: L }), i.value = !1, s.value = "");
    }
    function X() {
      a("update:modelValue", void 0), i.value = !1, s.value = "";
    }
    return it(() => {
      p++, a("validity", !0);
    }), (L, S) => (c(), g("section", Wr, [
      S[3] || (S[3] = d("h4", { class: "work-field-label" }, "What runs", -1)),
      e.modelValue ? E("", !0) : (c(), g("p", Kr, "No Flow bound. This stage keeps its existing external execution contract.")),
      m.value ? (c(), g("p", Gr, [
        M(D(i.value ? "Flow versions unavailable" : "Flow binding unavailable") + ": " + D(n.value), 1),
        !i.value && e.modelValue ? (c(), g(Z, { key: 0 }, [
          M(" · v" + D(e.modelValue.version), 1)
        ], 64)) : E("", !0),
        M(". " + D(m.value), 1),
        b(r(H), {
          label: "Reload Flow",
          severity: "secondary",
          text: "",
          onClick: x
        })
      ])) : E("", !0),
      o.value ? (c(), g("wc-workflow-picker", {
        key: 2,
        schema: r(u),
        config: y.value,
        title: e.modelValue?.id,
        onChange: I
      }, null, 40, Yr)) : (c(), g("p", Hr, [
        S[1] || (S[1] = M("Published Flow picker unavailable.", -1)),
        b(r(H), {
          label: "Reload Flow picker",
          text: "",
          severity: "secondary",
          onClick: w
        })
      ])),
      n.value ? (c(), g("label", Xr, [
        S[2] || (S[2] = M("Published version", -1)),
        b(r(oe), {
          "model-value": i.value ? void 0 : e.modelValue?.version,
          options: v.value.map((U) => ({ label: "v" + U.version, value: U.version })),
          "option-label": "label",
          "option-value": "value",
          "aria-label": "Published version",
          placeholder: "Choose a published version",
          "append-to": "self",
          loading: f.value,
          disabled: f.value || !!m.value,
          "onUpdate:modelValue": T
        }, null, 8, ["model-value", "options", "loading", "disabled"])
      ])) : E("", !0),
      i.value ? (c(), g("p", Jr, "Choose a published version of " + D(n.value) + " to finish selecting the Flow.", 1)) : E("", !0),
      e.modelValue || i.value ? (c(), q(r(H), {
        key: 6,
        label: i.value ? "Cancel Flow selection" : "Remove Flow binding",
        "aria-label": i.value ? "Cancel Flow selection" : "Remove Flow binding",
        severity: "secondary",
        text: "",
        onClick: S[0] || (S[0] = (U) => i.value ? (i.value = !1, s.value = "") : X())
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
function Qr(e, l) {
  if (e == null) return;
  if (!Number.isFinite(e * Hl[l]) || e <= 0) throw new Error("Enter a positive duration.");
  const t = (a) => a.toLocaleString("en-US", { useGrouping: !1, maximumSignificantDigits: 21 });
  return Number.isInteger(e) ? l === "days" ? `P${t(e)}D` : l === "hours" ? `PT${t(e)}H` : `PT${t(e)}M` : `PT${t(e * Hl[l])}S`;
}
const _r = { class: "work-stack work-tight" }, ed = {
  class: "work-duration-control",
  style: { "max-width": "360px" }
}, td = {
  key: 0,
  class: "work-error",
  role: "alert"
}, xt = /* @__PURE__ */ ue({
  __name: "DurationControl",
  props: {
    modelValue: {},
    label: {},
    disabled: { type: Boolean }
  },
  emits: ["update:modelValue", "validity"],
  setup(e, { emit: l }) {
    const t = e, a = l, o = "duration:" + Xl(), s = j("days"), v = j("");
    xe(() => t.modelValue, (y) => {
      v.value = "";
      const p = y ? Wt(y) : void 0;
      p && (s.value = p.unit), a("validity", !y || !!p, o);
    }, { immediate: !0 });
    const f = Y(() => t.modelValue ? Wt(t.modelValue, s.value)?.amount ?? null : null);
    function m(y) {
      try {
        const p = Qr(y, s.value);
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
    return it(() => a("validity", !0, o)), (y, p) => (c(), g("label", _r, [
      M(D(e.label), 1),
      d("span", ed, [
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
        b(r(oe), {
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
      v.value || e.modelValue && !r(Wt)(e.modelValue) ? (c(), g("span", td, D(v.value || `Unsupported duration: ${e.modelValue}`), 1)) : E("", !0)
    ]));
  }
}), ld = { class: "work-stack" }, ad = { class: "work-settings-grid" }, od = { class: "work-stack work-tight" }, id = { class: "work-stack work-tight" }, nd = {
  key: 1,
  class: "work-stack work-tight"
}, sd = { class: "work-stack work-tight" }, rd = { class: "work-settings-grid" }, dd = { class: "work-row" }, ud = { class: "work-stack work-tight" }, cd = {
  key: 0,
  class: "work-stack work-tight"
}, vd = /* @__PURE__ */ ue({
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
      i.push({ id: Vt("timer", i), after: "P1D", then: { emit: "reminder" } });
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
    return (i, n) => (c(), g("section", ld, [
      n[8] || (n[8] = d("h4", null, "Timers", -1)),
      (c(!0), g(Z, null, ae(o(), (u, y) => (c(), g("article", {
        key: u.id,
        class: "work-settings-card work-stack"
      }, [
        d("div", ad, [
          d("label", od, [
            n[2] || (n[2] = M("Timer ID", -1)),
            b(r(de), {
              modelValue: u.id,
              "onUpdate:modelValue": (p) => u.id = p,
              required: "",
              pattern: "[a-z][a-z0-9_]*"
            }, null, 8, ["modelValue", "onUpdate:modelValue"])
          ]),
          d("label", id, [
            n[3] || (n[3] = M("Deadline", -1)),
            b(r(oe), {
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
          u.after !== void 0 ? (c(), q(xt, {
            key: 0,
            modelValue: u.after,
            "onUpdate:modelValue": (p) => u.after = p,
            label: "After",
            onValidity: n[0] || (n[0] = (p, w) => a("validity", w, p))
          }, null, 8, ["modelValue", "onUpdate:modelValue"])) : (c(), g("label", nd, [
            n[4] || (n[4] = M("At field", -1)),
            b(r(oe), {
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
          d("label", sd, [
            n[5] || (n[5] = M("Duration by field", -1)),
            b(r(oe), {
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
        u.by ? (c(), q(at, {
          key: 0,
          label: "Duration table",
          hint: "Map field values to ISO durations.",
          "model-value": u.table,
          shape: "object",
          "onUpdate:modelValue": (p) => u.table = p,
          onValidity: (p) => a("validity", "table-" + y, p)
        }, null, 8, ["model-value", "onUpdate:modelValue", "onValidity"])) : E("", !0),
        d("div", rd, [
          b(xt, {
            modelValue: u.repeat,
            "onUpdate:modelValue": (p) => u.repeat = p,
            label: "Repeat every",
            onValidity: n[1] || (n[1] = (p, w) => a("validity", w, p)),
            disabled: u.interrupting
          }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"]),
          d("label", dd, [
            b(r(Mt), {
              modelValue: u.interrupting,
              "onUpdate:modelValue": [(p) => u.interrupting = p, (p) => u.interrupting && delete u.repeat],
              binary: ""
            }, null, 8, ["modelValue", "onUpdate:modelValue"]),
            n[6] || (n[6] = M("Interrupting", -1))
          ]),
          d("label", ud, [
            n[7] || (n[7] = M("Then", -1)),
            b(r(oe), {
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
          u.then ? (c(), g("label", cd, [
            M(D(u.then.transition !== void 0 ? "Transition ID" : "Event name"), 1),
            u.then.transition !== void 0 ? (c(), q(r(de), {
              key: 0,
              modelValue: u.then.transition,
              "onUpdate:modelValue": (p) => u.then.transition = p
            }, null, 8, ["modelValue", "onUpdate:modelValue"])) : (c(), q(r(de), {
              key: 1,
              modelValue: u.then.emit,
              "onUpdate:modelValue": (p) => u.then.emit = p
            }, null, 8, ["modelValue", "onUpdate:modelValue"]))
          ])) : E("", !0)
        ]),
        b(r(H), {
          severity: "secondary",
          onClick: (p) => o().splice(y, 1),
          "aria-label": "Remove timer",
          text: "",
          size: "small"
        }, {
          default: z(() => [
            b(r(_), {
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
        icon: z(() => [
          b(r(_), {
            icon: "tabler:plus",
            "aria-hidden": "true"
          })
        ]),
        _: 1
      })
    ]));
  }
}), md = ["aria-label"], fd = { class: "work-stack work-tight" }, pd = {
  key: 0,
  class: "work-stack work-tight"
}, bd = /* @__PURE__ */ ue({
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
    function v(m) {
      a("update:modelValue", m === "field" ? { field: "" } : m === "group" ? { group: "" } : []);
    }
    function f(m) {
      a("update:modelValue", o.value === "group" ? { group: m.at(-1)?.id ?? "" } : m);
    }
    return Pa(() => a("validity", Array.isArray(t.modelValue) ? t.modelValue.length > 0 : "field" in t.modelValue ? !!t.modelValue.field : !!t.modelValue.group)), it(() => a("validity", !0)), (m, i) => (c(), g("section", {
      class: "work-stack work-tight",
      "aria-label": e.label
    }, [
      d("label", fd, [
        M(D(e.label) + " source", 1),
        b(r(oe), {
          "model-value": o.value,
          "aria-label": e.label + " source",
          options: [{ label: "Group", value: "group" }, { label: "People and groups", value: "principals" }, { label: "Principal field", value: "field" }],
          optionLabel: "label",
          optionValue: "value",
          appendTo: "self",
          "onUpdate:modelValue": v
        }, null, 8, ["model-value", "aria-label"])
      ]),
      "field" in e.modelValue ? (c(), g("label", pd, [
        i[1] || (i[1] = M("Principal field", -1)),
        b(r(oe), {
          "model-value": e.modelValue.field,
          "aria-label": e.label + " field",
          options: e.draft.fields?.filter((n) => n.type === "principal").map((n) => ({ label: n.title || n.code, value: n.code })) ?? [],
          optionLabel: "label",
          optionValue: "value",
          appendTo: "self",
          "onUpdate:modelValue": i[0] || (i[0] = (n) => a("update:modelValue", { field: n }))
        }, null, 8, ["model-value", "aria-label", "options"])
      ])) : (c(), q(ea, {
        key: 1,
        "board-id": e.boardId,
        label: e.label,
        kinds: o.value === "group" ? "group" : "user,group,service",
        "model-value": s.value,
        "onUpdate:modelValue": f
      }, null, 8, ["board-id", "label", "kinds", "model-value"]))
    ], 8, md));
  }
}), hd = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, yd = {
  class: "work-stack work-tight",
  "aria-label": "Approval sources"
}, gd = { class: "work-row" }, kd = {
  key: 0,
  class: "work-stack work-tight"
}, wd = ["kinds", "value"], Vd = {
  key: 2,
  class: "work-muted work-small",
  role: "status"
}, $d = {
  key: 3,
  class: "work-chips"
}, xd = { class: "work-row work-small" }, Cd = { class: "work-process-options" }, Sd = { class: "work-stack work-tight" }, Td = {
  key: 4,
  class: "work-error work-small",
  role: "alert"
}, Ed = {
  key: 5,
  class: "work-muted work-small"
}, Ud = /* @__PURE__ */ ue({
  __name: "ApproversEditor",
  props: {
    approvals: {},
    boardId: {}
  },
  emits: ["validity"],
  setup(e, { emit: l }) {
    const t = e, a = l, { principalLabel: o, rememberPrincipal: s, nameError: v } = Ra(() => t.boardId ?? "", () => Array.isArray(t.approvals.from) ? t.approvals.from : "group" in t.approvals.from ? [{ kind: "group", id: t.approvals.from.group }] : []), f = j(!1), m = Y(() => Array.isArray(t.approvals.from) ? "principals" : "field" in t.approvals.from ? "field" : "group"), i = Y(() => Array.isArray(t.approvals.from) ? t.approvals.from.some((p) => p.kind === "group") || t.approvals.from.length >= t.approvals.min : "field" in t.approvals.from ? !!t.approvals.from.field : !!t.approvals.from.group);
    Pa(() => a("validity", Number.isSafeInteger(t.approvals.min) && t.approvals.min > 0 && i.value)), it(() => a("validity", !0)), kl(async () => {
      f.value = await tt("wc-principal-picker");
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
      const I = { kind: w.type ?? w.kind ?? "user", id: x };
      w.label && s(I, w.label), t.approvals.from.some((T) => T.id === x && T.kind === I.kind) || t.approvals.from.push(I);
    }
    function y(p) {
      Array.isArray(t.approvals.from) && t.approvals.from.splice(p, 1);
    }
    return (p, w) => (c(), g(Z, null, [
      r(v) ? (c(), g("p", hd, D(r(v)), 1)) : E("", !0),
      d("section", yd, [
        d("label", gd, [
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
        "field" in e.approvals.from ? (c(), g("label", kd, [
          w[5] || (w[5] = M("Principal field", -1)),
          b(r(de), {
            modelValue: e.approvals.from.field,
            "onUpdate:modelValue": w[1] || (w[1] = (x) => e.approvals.from.field = x),
            "aria-label": "Principal field"
          }, null, 8, ["modelValue"])
        ])) : f.value ? (c(), g("wc-principal-picker", {
          key: m.value,
          kinds: m.value === "group" ? "group" : "user,group,service",
          value: JSON.stringify("group" in e.approvals.from ? { type: "group", principal_id: e.approvals.from.group } : {}),
          onConfigChanged: u
        }, null, 40, wd)) : (c(), g("p", Vd, "The principal picker is unavailable.")),
        Array.isArray(e.approvals.from) ? (c(), g("div", $d, [
          (c(!0), g(Z, null, ae(e.approvals.from, (x, I) => (c(), q(r(Re), {
            key: x.kind + ":" + x.id,
            class: "kx-tag-sm",
            severity: "secondary"
          }, {
            default: z(() => [
              M(D(r(o)(x)), 1),
              b(r(H), {
                "aria-label": "Remove approver " + (I + 1),
                text: "",
                severity: "secondary",
                size: "small",
                onClick: (T) => y(I)
              }, {
                default: z(() => [
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
        d("label", xd, [
          w[6] || (w[6] = d("span", { class: "work-spacer" }, "The person who moves the item here cannot approve this visit", -1)),
          b(r(Le), {
            modelValue: e.approvals.prevent_self,
            "onUpdate:modelValue": w[2] || (w[2] = (x) => e.approvals.prevent_self = x),
            "aria-label": "The person who moves the item here cannot approve this visit"
          }, null, 8, ["modelValue"])
        ]),
        d("details", Cd, [
          w[8] || (w[8] = d("summary", null, "Approval options", -1)),
          d("label", Sd, [
            w[7] || (w[7] = M("Approval source", -1)),
            b(r(oe), {
              "model-value": m.value,
              "onUpdate:modelValue": w[3] || (w[3] = (x) => n(x)),
              appendTo: "self",
              optionLabel: "label",
              optionValue: "value",
              options: [{ label: "Group members", value: "group" }, { label: "People and groups", value: "principals" }, { label: "Principal field", value: "field" }]
            }, null, 8, ["model-value"])
          ])
        ]),
        Array.isArray(e.approvals.from) && !i.value ? (c(), g("p", Td, "Select at least " + D(e.approvals.min) + " distinct principals, or lower the minimum.", 1)) : "group" in e.approvals.from && !e.approvals.from.group ? (c(), g("p", Ed, "Choose the group that can approve this state.")) : E("", !0)
      ])
    ], 64));
  }
}), Dd = {
  class: "work-state-settings work-stack",
  "aria-label": "State settings"
}, Id = { class: "work-process-kind" }, Ad = { class: "work-process-options" }, Pd = { class: "work-stack" }, Rd = { class: "work-row" }, Od = { class: "work-stack work-tight" }, Nd = { class: "work-row" }, Md = { class: "work-stack work-tight" }, Fd = { class: "work-row" }, Ld = { class: "work-row" }, zd = { class: "work-stack work-tight" }, Bd = { class: "work-row" }, jd = { class: "work-stack work-tight" }, qd = { class: "work-stack work-tight" }, Wd = {
  key: 0,
  class: "work-row"
}, Kd = { class: "work-row" }, Gd = { class: "work-row" }, Yd = { class: "work-stack work-tight" }, Hd = { class: "work-row" }, Xd = /* @__PURE__ */ ue({
  __name: "StateSettings",
  props: {
    state: {},
    process: {},
    draft: {},
    boardId: {}
  },
  emits: ["validity"],
  setup(e, { emit: l }) {
    const t = e, a = l, o = Y(() => (t.process.transitions ?? []).filter((m) => m.from === "any" || m.from.includes(t.state.id))), s = [{ value: "human", icon: "user" }, { value: "gate", icon: "shield-check" }, { value: "automated", icon: "bolt" }, { value: "parallel", icon: "arrows-split" }];
    function v(m) {
      const i = t.state;
      i.kind = m, delete i.run, delete i.release_when, delete i.regions, delete i.join, delete i.due, (m === "automated" || m === "gate") && delete i.awaiting, m === "automated" && (i.run = { stage: i.id, retry: { max: 1, backoff: "PT1M" } }), m === "gate" && (i.release_when = { approvals: { min: 1, from: { group: "" }, prevent_self: !0 } }), m === "parallel" && (i.regions = [{ id: "region_1", initial: t.process.states.find((n) => n.id !== i.id)?.id ?? "" }], i.join = "all");
    }
    function f(m) {
      t.state.run && (m ? t.state.run.on_fail = m : delete t.state.run.on_fail);
    }
    return (m, i) => (c(), g("section", Dd, [
      i[52] || (i[52] = d("h4", { class: "work-process-group" }, "Who moves the item on", -1)),
      b(r(Ql), {
        class: "work-process-kinds",
        "model-value": e.state.kind ?? "human",
        options: s.map((n) => ({
          ...n,
          label: r(Ma)(n.value)
        })),
        optionLabel: "label",
        optionValue: "value",
        optionDisabled: "disabled",
        "allow-empty": !1,
        "aria-label": "Who moves the item on",
        "onUpdate:modelValue": v
      }, {
        option: z(({ option: n }) => [
          d("span", Id, [
            b(r(_), {
              icon: "tabler:" + n.icon
            }, null, 8, ["icon"]),
            d("span", null, D(n.label), 1)
          ])
        ]),
        _: 1
      }, 8, ["model-value", "options"]),
      e.state.kind === "gate" && e.state.release_when ? (c(), g(Z, { key: 0 }, [
        i[33] || (i[33] = d("h4", { class: "work-process-group" }, "Approval", -1)),
        e.state.release_when.approvals ? (c(), q(Ud, {
          key: 0,
          "board-id": e.boardId,
          approvals: e.state.release_when.approvals,
          onValidity: i[0] || (i[0] = (n) => a("validity", "approvers", n))
        }, null, 8, ["board-id", "approvals"])) : E("", !0),
        d("details", Ad, [
          i[32] || (i[32] = d("summary", null, "Release options", -1)),
          d("div", Pd, [
            d("label", Rd, [
              i[31] || (i[31] = d("span", { class: "work-spacer" }, "Require approvals", -1)),
              b(r(Le), {
                "model-value": !!e.state.release_when.approvals,
                "aria-label": "Require approvals",
                "onUpdate:modelValue": i[1] || (i[1] = (n) => e.state.release_when.approvals = n ? { min: 1, from: { group: "" }, prevent_self: !0 } : void 0)
              }, null, 8, ["model-value"])
            ]),
            b(xt, {
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
      ], 64)) : E("", !0),
      e.state.kind === "automated" && e.state.run ? (c(), g(Z, { key: 1 }, [
        i[40] || (i[40] = d("h4", { class: "work-process-group" }, "Automation", -1)),
        d("label", Od, [
          i[34] || (i[34] = M("Run label", -1)),
          b(r(de), {
            modelValue: e.state.run.stage,
            "onUpdate:modelValue": i[6] || (i[6] = (n) => e.state.run.stage = n),
            "aria-label": "Run label",
            required: ""
          }, null, 8, ["modelValue"])
        ]),
        b(Zr, {
          modelValue: e.state.run.flow_ref,
          "onUpdate:modelValue": i[7] || (i[7] = (n) => e.state.run.flow_ref = n),
          onValidity: i[8] || (i[8] = (n) => a("validity", "flow", n))
        }, null, 8, ["modelValue"]),
        b(xt, {
          modelValue: e.state.run.timeout,
          "onUpdate:modelValue": i[9] || (i[9] = (n) => e.state.run.timeout = n),
          label: "Attempt timeout",
          onValidity: i[10] || (i[10] = (n, u) => a("validity", u, n))
        }, null, 8, ["modelValue"]),
        i[41] || (i[41] = d("small", { class: "work-muted" }, "Blank uses the board timeout, or one hour.", -1)),
        d("label", Nd, [
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
        d("label", Md, [
          i[36] || (i[36] = M("When visits are exhausted", -1)),
          b(r(oe), {
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
        d("label", Fd, [
          i[37] || (i[37] = d("span", { class: "work-spacer" }, "Retry if it fails", -1)),
          b(r(Le), {
            "model-value": !!e.state.run.retry,
            "aria-label": "Retry if it fails",
            "onUpdate:modelValue": i[13] || (i[13] = (n) => e.state.run.retry = n ? { max: 1, backoff: "PT1M" } : void 0)
          }, null, 8, ["model-value"])
        ]),
        e.state.run.retry ? (c(), g(Z, { key: 0 }, [
          d("label", Ld, [
            i[38] || (i[38] = d("span", { class: "work-spacer" }, "Maximum attempts", -1)),
            b(r(Ge), {
              modelValue: e.state.run.retry.max,
              "onUpdate:modelValue": i[14] || (i[14] = (n) => e.state.run.retry.max = n),
              min: 1,
              useGrouping: !1
            }, null, 8, ["modelValue"])
          ]),
          b(xt, {
            modelValue: e.state.run.retry.backoff,
            "onUpdate:modelValue": i[15] || (i[15] = (n) => e.state.run.retry.backoff = n),
            label: "Wait between attempts",
            onValidity: i[16] || (i[16] = (n, u) => a("validity", u, n))
          }, null, 8, ["modelValue"])
        ], 64)) : E("", !0),
        (c(), g(Z, null, ae([{ key: "on_pass", label: "On success" }, { key: "on_cancel", label: "On cancellation" }], (n) => d("label", {
          key: n.key,
          class: "work-stack work-tight"
        }, [
          M(D(n.label), 1),
          b(r(oe), {
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
        d("label", zd, [
          i[39] || (i[39] = M("If it fails, go to", -1)),
          b(r(oe), {
            "model-value": e.state.run.on_fail,
            "onUpdate:modelValue": f,
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
      ], 64)) : E("", !0),
      e.state.kind === "parallel" && e.state.regions ? (c(), g(Z, { key: 2 }, [
        i[47] || (i[47] = d("h4", { class: "work-process-group" }, "Lanes", -1)),
        (c(!0), g(Z, null, ae(e.state.regions, (n, u) => (c(), g("div", {
          key: u,
          class: "work-process-value work-stack work-tight"
        }, [
          d("div", Bd, [
            d("span", null, "Lane " + D(u + 1), 1),
            i[43] || (i[43] = d("span", { class: "work-spacer" }, null, -1)),
            b(r(H), {
              severity: "danger",
              text: "",
              size: "small",
              "aria-label": "Remove lane",
              onClick: (y) => e.state.regions.splice(u, 1)
            }, {
              default: z(() => [
                b(r(_), { icon: "tabler:trash" })
              ]),
              _: 1
            }, 8, ["onClick"])
          ]),
          d("label", jd, [
            i[44] || (i[44] = M("Starts at", -1)),
            b(r(oe), {
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
            id: r(Vt)("region", e.state.regions),
            initial: e.process.states.find((u) => u.id !== e.state.id)?.id ?? ""
          }))
        }, {
          icon: z(() => [
            b(r(_), { icon: "tabler:plus" })
          ]),
          _: 1
        }),
        d("label", qd, [
          i[45] || (i[45] = M("Finish rule", -1)),
          b(r(oe), {
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
        typeof e.state.join == "number" ? (c(), g("label", Wd, [
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
      d("label", Kd, [
        i[48] || (i[48] = d("span", { class: "work-spacer" }, "Items allowed here", -1)),
        b(gl, {
          draft: e.draft,
          state: e.state.id,
          label: "Items allowed here"
        }, null, 8, ["draft", "state"])
      ]),
      d("label", Gd, [
        i[49] || (i[49] = d("span", { class: "work-spacer" }, [
          M("Refuse moves over the limit"),
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
      !e.state.kind || e.state.kind === "human" ? (c(), q(xt, {
        key: 3,
        modelValue: e.state.due,
        "onUpdate:modelValue": i[21] || (i[21] = (n) => e.state.due = n),
        label: "Time allowed in this state",
        onValidity: i[22] || (i[22] = (n, u) => a("validity", u, n))
      }, null, 8, ["modelValue"])) : E("", !0),
      i[55] || (i[55] = d("h4", { class: "work-process-group" }, "Assignment and conditions", -1)),
      d("label", Yd, [
        i[50] || (i[50] = M("Stage label", -1)),
        b(r(de), {
          "model-value": e.state.stage,
          "aria-label": "Stage label",
          "onUpdate:modelValue": i[23] || (i[23] = (n) => e.state.stage = n || void 0)
        }, null, 8, ["model-value"])
      ]),
      !e.state.kind || e.state.kind === "human" || e.state.kind === "parallel" ? (c(), g(Z, { key: 4 }, [
        d("label", Hd, [
          b(r(Le), {
            "model-value": !!e.state.awaiting,
            "aria-label": "Awaiting people",
            "onUpdate:modelValue": i[24] || (i[24] = (n) => e.state.awaiting = n ? { group: "" } : void 0)
          }, null, 8, ["model-value"]),
          i[51] || (i[51] = M("Awaiting people", -1))
        ]),
        e.state.awaiting ? (c(), q(bd, {
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
      b(at, {
        label: "State checks",
        example: ["installed-check"],
        "model-value": e.state.invariants,
        shape: "array",
        "onUpdate:modelValue": i[28] || (i[28] = (n) => e.state.invariants = n),
        onValidity: i[29] || (i[29] = (n) => a("validity", "invariants", n))
      }, null, 8, ["model-value"]),
      b(vd, {
        state: e.state,
        draft: e.draft,
        onValidity: i[30] || (i[30] = (n, u) => a("validity", "timer-" + n, u))
      }, null, 8, ["state", "draft"])
    ]));
  }
}), Jd = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, Zd = {
  class: "work-process-controls",
  role: "toolbar",
  "aria-label": "Process tools"
}, Qd = {
  key: 1,
  class: "work-process-title"
}, _d = { class: "work-muted" }, eu = {
  key: 2,
  class: "work-map-zoom",
  role: "group",
  "aria-label": "Map zoom"
}, tu = ["aria-label"], lu = { class: "work-row" }, au = { class: "work-process-meaning" }, ou = { class: "work-stack work-tight" }, iu = { class: "work-process-inspector-foot" }, nu = { class: "work-row" }, su = { class: "work-process-meaning" }, ru = { class: "work-stack work-tight" }, du = { class: "work-process-inspector-foot" }, uu = {
  key: 3,
  class: "work-row"
}, cu = { class: "work-stack work-tight" }, vu = { class: "work-dialog-actions" }, mu = /* @__PURE__ */ ue({
  __name: "ProcessEditor",
  props: {
    draft: {},
    guardRemoval: { type: Function },
    issues: {},
    boardId: {}
  },
  emits: ["validity"],
  setup(e, { emit: l }) {
    const t = e, a = l, o = Y(() => t.draft.processes ?? []), s = j(!1), v = j(""), f = j(""), m = j(""), i = j("Map"), n = j(""), u = j(), y = j(), p = j(), w = j(), x = j(!1);
    async function I() {
      x.value = !0, await ho(), w.value?.querySelector('[aria-label="State name"]')?.focus();
    }
    const T = Y(() => o.value.find(($) => $.id === f.value) ?? o.value[0]);
    function X() {
      x.value = !1, u.value = void 0, y.value = void 0, m.value = "";
    }
    function L($) {
      x.value = !1, u.value = $, y.value = void 0, n.value = "", m.value = "";
    }
    function S($) {
      x.value = !1, y.value = $, u.value = void 0, m.value = "";
    }
    xe(T, X);
    function U($) {
      $ === "__new" ? s.value = !0 : f.value = $;
    }
    function A() {
      const $ = v.value.trim();
      if (!$) return;
      const R = $.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "") || "process", N = (/^[a-z]/.test(R) ? R : "process_" + R).slice(0, 40), Q = o.value.some((ce) => ce.id === N) ? Vt(N, o.value) : N;
      (t.draft.processes ??= []).push({ id: Q, name: $, initial: "todo", states: [{ id: "todo", name: "To do", category: "unstarted" }], transitions: [] }), f.value = Q, v.value = "", s.value = !1;
    }
    async function O($) {
      const R = { id: Vt("state", $.states), name: "New state", category: "started" }, N = Bl($), Q = N.at(-1), ce = u.value ?? (Q?.category === "completed" ? N.at(-2) : Q), pe = ce && ($.transitions?.find((ke) => ke.default && ke.from !== "any" && ke.from.includes(ce.id)) ?? $.transitions?.find((ke) => ke.from !== "any" && ke.from.includes(ce.id) && $.states.findIndex((Ve) => Ve.id === ke.to) > $.states.indexOf(ce)));
      if ($.states.splice(ce ? $.states.indexOf(ce) + 1 : $.states.length, 0, R), ce && ce.category !== "completed" && ce.category !== "canceled")
        if (pe) {
          const ke = pe.to;
          pe.to = R.id, ($.transitions ??= []).push({ id: Vt("transition", $.transitions ?? []), name: "Continue", from: [R.id], to: ke, ...pe.auto && pe.default ? { auto: !0, default: !0 } : {} });
        } else ($.transitions ??= []).push({ id: Vt("transition", $.transitions ?? []), name: "Continue", from: [ce.id], to: R.id });
      L(R), await I();
    }
    function F($, R) {
      const N = T.value;
      if (!N || !R || $ === R) return;
      let Q = `to_${R}`, ce = 2;
      for (; N.transitions?.some((ke) => ke.id === Q); ) Q = `to_${R}_${ce++}`;
      const pe = { id: Q, name: `To ${he(N.states.find((ke) => ke.id === R)).toLowerCase()}`, from: [$], to: R };
      (N.transitions ??= []).push(pe), S(pe);
    }
    function P($) {
      const R = { id: Vt("transition", $.transitions ?? []), name: "To " + he($.states.at(-1)), from: [$.initial], to: $.states.at(-1)?.id ?? $.initial };
      ($.transitions ??= []).push(R), S(R);
    }
    function B($, R) {
      const N = To($, R);
      if (N.length) {
        m.value = `Used by ${N.join(", ")}. Update those references first.`;
        return;
      }
      $.transitions?.splice($.transitions.indexOf(R), 1), X();
    }
    function V($, R) {
      const N = Eo($, R);
      if (N.length) {
        m.value = `${he(R)} is used by ${N.join(", ")}. Update these references first.`;
        return;
      }
      $.states.splice($.states.indexOf(R), 1), X();
    }
    async function le($) {
      const R = t.draft.item_types?.filter((Q) => Q.process === $.id).map((Q) => Q.title || "Untitled item type") ?? [];
      if (R.length) {
        m.value = `Used by ${R.join(", ")}. Choose a different process for those item types first.`;
        return;
      }
      const N = await t.guardRemoval?.("processes", $.id);
      if (N) {
        m.value = N;
        return;
      }
      _t(t.draft, "processes", $.id), f.value = "", X();
    }
    return ($, R) => (c(), g("section", {
      class: "work-process-editor work-stack",
      "aria-label": "Process editor",
      onKeydown: Ae(X, ["esc"])
    }, [
      m.value ? (c(), g("p", Jd, D(m.value), 1)) : E("", !0),
      (c(!0), g(Z, null, ae(e.issues?.filter((N) => N.code === "process " + T.value?.id) ?? [], (N) => (c(), g("p", {
        key: N.what + N.detail,
        class: "work-error work-small",
        role: "alert"
      }, D(r(wl)(N)) + " · " + D(N.what), 1))), 128)),
      T.value ? (c(), g("div", {
        key: 1,
        class: ft(["work-process-builder", { "work-process-inspecting": u.value || y.value }])
      }, [
        d("div", Zd, [
          o.value.length > 1 ? (c(), q(r(oe), {
            key: 0,
            "model-value": T.value.id,
            "aria-label": "Process",
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            options: [
              ...o.value.map((N) => ({ label: N.name || "Untitled process", value: N.id })),
              { label: "New process…", value: "__new" }
            ],
            "onUpdate:modelValue": U
          }, null, 8, ["model-value", "options"])) : (c(), g("span", Qd, D(T.value.name || "Process"), 1)),
          b(r(H), {
            label: "Add state",
            severity: "secondary",
            outlined: "",
            size: "small",
            onClick: R[0] || (R[0] = (N) => O(T.value))
          }, {
            icon: z(() => [
              b(r(_), { icon: "tabler:plus" })
            ]),
            _: 1
          }),
          b(r(oe), {
            modelValue: T.value.initial,
            "onUpdate:modelValue": R[1] || (R[1] = (N) => T.value.initial = N),
            "aria-label": "Starts in " + r(he)(T.value.states.find((N) => N.id === T.value.initial)),
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            options: T.value.states.map((N) => ({ label: r(he)(N), value: N.id }))
          }, {
            value: z(() => [
              d("span", _d, "Starts in " + D(r(he)(T.value.states.find((N) => N.id === T.value.initial))), 1)
            ]),
            _: 1
          }, 8, ["modelValue", "aria-label", "options"]),
          R[17] || (R[17] = d("span", { class: "work-spacer" }, null, -1)),
          i.value === "Map" ? (c(), g("div", eu, [
            b(r(H), {
              label: "Fit",
              title: "Fit to width and show the full process",
              text: "",
              severity: "secondary",
              size: "small",
              onClick: R[2] || (R[2] = (N) => p.value?.fit())
            }, {
              icon: z(() => [
                b(r(_), { icon: "tabler:arrows-maximize" })
              ]),
              _: 1
            }),
            i.value === "Map" ? (c(), q(r(H), {
              key: 0,
              "aria-label": "Zoom out",
              title: "Zoom out",
              text: "",
              severity: "secondary",
              size: "small",
              onClick: R[3] || (R[3] = (N) => p.value?.zoomOut())
            }, {
              default: z(() => [
                b(r(_), { icon: "tabler:minus" })
              ]),
              _: 1
            })) : E("", !0),
            i.value === "Map" ? (c(), q(r(H), {
              key: 1,
              "aria-label": "Zoom in",
              title: "Zoom in",
              text: "",
              severity: "secondary",
              size: "small",
              onClick: R[4] || (R[4] = (N) => p.value?.zoomIn())
            }, {
              default: z(() => [
                b(r(_), { icon: "tabler:plus" })
              ]),
              _: 1
            })) : E("", !0)
          ])) : E("", !0),
          b(r(Ql), {
            modelValue: i.value,
            "onUpdate:modelValue": R[5] || (R[5] = (N) => i.value = N),
            options: ["Map", "List"],
            "allow-empty": !1,
            "aria-label": "Process layout"
          }, null, 8, ["modelValue"]),
          o.value.length === 1 ? (c(), q(r(H), {
            key: 3,
            label: "New process",
            "aria-label": "New process",
            text: "",
            severity: "secondary",
            size: "small",
            onClick: R[6] || (R[6] = (N) => s.value = !0)
          }, {
            icon: z(() => [
              b(r(_), { icon: "tabler:plus" })
            ]),
            _: 1
          })) : E("", !0)
        ]),
        i.value === "Map" ? (c(), q(Vr, {
          key: 0,
          ref_key: "graph",
          ref: p,
          process: T.value,
          draft: e.draft,
          "selected-state": u.value,
          "selected-transition": y.value,
          onState: L,
          onTransition: S,
          onConnect: F,
          onClear: X
        }, null, 8, ["process", "draft", "selected-state", "selected-transition"])) : (c(), q(Pr, {
          key: 1,
          process: T.value,
          "selected-state": u.value,
          "selected-transition": y.value,
          onState: L,
          onTransition: S,
          onRemoveState: R[7] || (R[7] = (N) => V(T.value, N)),
          onRemoveTransition: R[8] || (R[8] = (N) => B(T.value, N)),
          onAddTransition: R[9] || (R[9] = (N) => P(T.value))
        }, null, 8, ["process", "selected-state", "selected-transition"])),
        u.value || y.value ? (c(), g("aside", {
          key: 2,
          ref_key: "inspector",
          ref: w,
          class: "work-process-sideform",
          "aria-label": u.value ? "State inspector" : "Transition inspector"
        }, [
          (c(!0), g(Z, null, ae(u.value ? [u.value] : [], (N) => (c(), g(Z, {
            key: N.id
          }, [
            d("header", lu, [
              x.value ? (c(), q(r(de), {
                key: 1,
                modelValue: N.name,
                "onUpdate:modelValue": (Q) => N.name = Q,
                class: "work-process-name",
                "aria-label": "State name",
                onBlur: R[10] || (R[10] = (Q) => x.value = !1)
              }, null, 8, ["modelValue", "onUpdate:modelValue"])) : (c(), q(Jl, {
                key: 0,
                class: "work-process-state-title",
                "aria-label": "Rename state",
                onActivate: I
              }, {
                default: z(() => [
                  d("span", null, D(r(he)(N)), 1)
                ]),
                _: 2
              }, 1024)),
              b(r(H), {
                severity: "secondary",
                text: "",
                size: "small",
                "aria-label": "Close state editor",
                onClick: X
              }, {
                default: z(() => [
                  b(r(_), { icon: "tabler:x" })
                ]),
                _: 1
              })
            ]),
            d("p", au, D(r(So)(N, e.draft)), 1),
            b(Xd, {
              state: N,
              process: T.value,
              draft: e.draft,
              "board-id": e.boardId,
              onValidity: (Q, ce) => a("validity", Q.includes("duration:") ? Q : T.value.id + ":" + N.id + ":" + Q, ce)
            }, null, 8, ["state", "process", "draft", "board-id", "onValidity"]),
            d("label", ou, [
              R[18] || (R[18] = M("Phase", -1)),
              b(r(oe), {
                modelValue: N.category,
                "onUpdate:modelValue": (Q) => N.category = Q,
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                options: ["triage", "backlog", ...r(Oa)].map((Q) => ({ label: r(Zl)(Q), value: Q }))
              }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
            ]),
            R[19] || (R[19] = d("h4", { class: "work-process-group" }, "Next stop", -1)),
            b(r(oe), {
              modelValue: n.value,
              "onUpdate:modelValue": R[11] || (R[11] = (Q) => n.value = Q),
              "aria-label": "Add transition to…",
              placeholder: "Add transition to…",
              appendTo: "self",
              optionLabel: "label",
              optionValue: "value",
              options: T.value.states.filter((Q) => Q !== N).map((Q) => ({ label: r(he)(Q), value: Q.id }))
            }, null, 8, ["modelValue", "options"]),
            b(r(H), {
              label: "Add transition",
              severity: "secondary",
              outlined: "",
              size: "small",
              disabled: !n.value,
              onClick: (Q) => F(N.id, n.value)
            }, {
              icon: z(() => [
                b(r(_), { icon: "tabler:arrow-right" })
              ]),
              _: 1
            }, 8, ["disabled", "onClick"]),
            d("footer", iu, [
              b(r(H), {
                label: "Remove state",
                severity: "danger",
                text: "",
                size: "small",
                onClick: (Q) => V(T.value, N)
              }, {
                icon: z(() => [
                  b(r(_), { icon: "tabler:trash" })
                ]),
                _: 1
              }, 8, ["onClick"])
            ])
          ], 64))), 128)),
          (c(!0), g(Z, null, ae(y.value ? [y.value] : [], (N) => (c(), g(Z, {
            key: N.id
          }, [
            d("header", nu, [
              R[20] || (R[20] = d("h3", null, "Transition", -1)),
              R[21] || (R[21] = d("span", { class: "work-spacer" }, null, -1)),
              b(r(H), {
                severity: "secondary",
                text: "",
                size: "small",
                "aria-label": "Close transition editor",
                onClick: X
              }, {
                default: z(() => [
                  b(r(_), { icon: "tabler:x" })
                ]),
                _: 1
              })
            ]),
            d("p", su, D(N.from === "any" ? "Any state" : N.from.map((Q) => r(he)(T.value.states.find((ce) => ce.id === Q))).join(", ")) + " → " + D(r(he)(T.value.states.find((Q) => Q.id === N.to))), 1),
            d("label", ru, [
              R[22] || (R[22] = M("Name", -1)),
              b(r(de), {
                modelValue: N.name,
                "onUpdate:modelValue": (Q) => N.name = Q,
                placeholder: r(je)(N),
                "aria-label": "Transition name"
              }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder"])
            ]),
            b(qr, {
              transition: N,
              process: T.value,
              draft: e.draft,
              "board-id": e.boardId,
              onValidity: (Q, ce) => a("validity", T.value.id + ":transition-" + N.id + ":" + Q, ce)
            }, null, 8, ["transition", "process", "draft", "board-id", "onValidity"]),
            d("footer", du, [
              b(r(H), {
                label: "Remove transition",
                severity: "danger",
                text: "",
                size: "small",
                onClick: (Q) => B(T.value, N)
              }, {
                icon: z(() => [
                  b(r(_), { icon: "tabler:trash" })
                ]),
                _: 1
              }, 8, ["onClick"])
            ])
          ], 64))), 128))
        ], 8, tu)) : E("", !0)
      ], 2)) : (c(), q(r(H), {
        key: 2,
        label: "New process",
        severity: "secondary",
        outlined: "",
        onClick: R[12] || (R[12] = (N) => s.value = !0)
      }, {
        icon: z(() => [
          b(r(_), { icon: "tabler:plus" })
        ]),
        _: 1
      })),
      i.value === "List" && T.value ? (c(), g("div", uu, [
        b(r(H), {
          label: "Remove process",
          severity: "danger",
          text: "",
          size: "small",
          onClick: R[13] || (R[13] = (N) => le(T.value))
        }, {
          icon: z(() => [
            b(r(_), { icon: "tabler:trash" })
          ]),
          _: 1
        })
      ])) : E("", !0),
      b(Fa, {
        visible: s.value,
        label: "New process",
        onClose: R[16] || (R[16] = (N) => s.value = !1)
      }, {
        default: z(() => [
          d("form", {
            class: "work-dialog-box",
            "aria-label": "New process",
            onSubmit: be(A, ["stop", "prevent"])
          }, [
            R[24] || (R[24] = d("h2", null, "New process", -1)),
            d("label", cu, [
              R[23] || (R[23] = M("Name", -1)),
              b(r(de), {
                modelValue: v.value,
                "onUpdate:modelValue": R[14] || (R[14] = (N) => v.value = N),
                "aria-label": "New process name",
                autofocus: "",
                required: ""
              }, null, 8, ["modelValue"])
            ]),
            d("div", vu, [
              b(r(H), {
                label: "Cancel",
                severity: "secondary",
                outlined: "",
                onClick: R[15] || (R[15] = (N) => s.value = !1)
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
}), fu = ["inert"], pu = { class: "work-stack work-tight" }, bu = /* @__PURE__ */ ue({
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
      (c(!0), g(Z, null, ae(e.draft.processes ?? [], (v) => (c(), g("div", {
        key: v.id,
        class: "work-stack"
      }, [
        d("label", pu, [
          M(D(v.name || "Untitled process"), 1),
          b(r(oe), {
            disabled: e.disabled,
            "model-value": r(da)(v),
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
        r(da)(v) !== "pin" ? (c(!0), g(Z, { key: 0 }, ae(a(v), (f) => (c(), g("label", {
          key: f.id,
          class: "work-stack work-tight"
        }, [
          M("Move items from " + D(r(he)(f)) + " to", 1),
          b(r(oe), {
            disabled: e.disabled,
            "model-value": v.map?.[f.id],
            placeholder: "Choose a surviving state",
            appendTo: "self",
            showClear: "",
            optionLabel: "label",
            optionValue: "value",
            options: v.states.map((m) => ({ label: r(he)(m), value: m.id })),
            "onUpdate:modelValue": (m) => t(v, f.id, m)
          }, null, 8, ["disabled", "model-value", "options", "onUpdate:modelValue"])
        ]))), 128)) : E("", !0)
      ]))), 128))
    ], 8, fu));
  }
}), hu = {
  class: "work-stack",
  "aria-label": "Policy editor"
}, yu = { class: "work-settings-list" }, gu = { class: "work-settings-row" }, ku = { class: "work-row-control" }, wu = { class: "work-settings-list work-wip-container" }, Vu = { class: "work-wip-table" }, $u = { class: "work-mono" }, xu = { class: "work-row-main" }, Cu = { class: "work-row" }, Su = { class: "work-row" }, Tu = { class: "work-settings-list" }, Eu = { class: "work-settings-row" }, Uu = { class: "work-row-control" }, Du = { class: "work-row-main" }, Iu = { class: "work-row-title" }, Au = { class: "work-muted work-small" }, Pu = { class: "work-row-control" }, Ru = /* @__PURE__ */ ue({
  __name: "PolicyEditor",
  props: {
    draft: {}
  },
  emits: ["validity"],
  setup(e, { emit: l }) {
    const t = e, a = l, o = Y(() => t.draft.policy ?? {}), s = Y(() => [...new Set(t.draft.processes?.flatMap((n) => n.states.map((u) => u.id)) ?? [])]), v = ["audit_days", "trash_days", "tombstone_days", "interval_days"], f = { audit_days: "Zero selects 365 days.", interval_days: "Zero selects 365 days.", trash_days: "Zero allows immediate cleanup of trashed items.", tombstone_days: "Zero allows immediate cleanup of deletion records." };
    function m(n, u) {
      u === void 0 ? t.draft.policy && delete t.draft.policy[n] : (t.draft.policy ??= {})[n] = u;
    }
    function i(n, u) {
      m(n, u ?? void 0);
    }
    return (n, u) => (c(), g("section", hu, [
      u[13] || (u[13] = d("header", { class: "work-section-heading" }, [
        d("div", null, [
          d("h2", null, "Policy"),
          d("p", { class: "work-muted work-small" }, "Set capacity and how long the board keeps its history.")
        ])
      ], -1)),
      u[14] || (u[14] = d("h3", { class: "work-group-title" }, "Item keys", -1)),
      d("div", yu, [
        d("div", gu, [
          u[7] || (u[7] = d("div", { class: "work-row-main" }, [
            d("strong", { class: "work-row-title" }, "Item key prefix"),
            d("p", { class: "work-muted work-small" }, "Work reviews and claims prefix changes when you apply the schema.")
          ], -1)),
          d("div", ku, [
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
      d("div", wu, [
        d("table", Vu, [
          u[8] || (u[8] = d("thead", null, [
            d("tr", null, [
              d("th", null, "State"),
              d("th", null, "Limit"),
              d("th", null, "Hard limit")
            ])
          ], -1)),
          d("tbody", null, [
            (c(!0), g(Z, null, ae(s.value, (y) => (c(), g("tr", { key: y }, [
              d("td", null, [
                d("strong", null, D(e.draft.processes?.flatMap((p) => p.states).find((p) => p.id === y)?.name || r(ge)(y)), 1),
                d("code", $u, D(y), 1)
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
        (c(!0), g(Z, null, ae(Object.keys(o.value.wip ?? {}).filter((y) => !s.value.includes(y)), (y) => (c(), g("div", {
          key: y,
          class: "work-settings-row"
        }, [
          d("div", xu, [
            M(D(r(ge)(y)) + " ", 1),
            u[9] || (u[9] = d("span", { class: "work-muted" }, "Removed state", -1))
          ]),
          b(r(H), {
            label: "Remove stale limit",
            severity: "secondary",
            outlined: "",
            onClick: (p) => delete o.value.wip[y]
          }, {
            icon: z(() => [
              b(r(_), { icon: "tabler:trash" })
            ]),
            _: 1
          }, 8, ["onClick"])
        ]))), 128))
      ]),
      u[17] || (u[17] = d("h3", { class: "work-group-title" }, "Automated stages", -1)),
      b(xt, {
        "model-value": o.value.stage_timeout,
        "onUpdate:modelValue": u[1] || (u[1] = (y) => m("stage_timeout", y)),
        label: "Default attempt timeout",
        onValidity: u[2] || (u[2] = (y, p) => a("validity", p, y))
      }, null, 8, ["model-value"]),
      u[18] || (u[18] = d("p", { class: "work-muted work-small" }, "Blank uses one hour. Each retry gets a new deadline.", -1)),
      d("label", Cu, [
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
      d("label", Su, [
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
      b(ia, {
        schema: { type: "object", properties: { scopes: { type: "array", title: "Query filter identifiers", items: { type: "string" } } } },
        "model-value": { scopes: e.draft.scopes },
        "onUpdate:modelValue": u[5] || (u[5] = (y) => e.draft.scopes = y.scopes)
      }, null, 8, ["model-value"]),
      u[23] || (u[23] = d("h3", { class: "work-group-title" }, "Audit and retention", -1)),
      d("div", Tu, [
        d("div", Eu, [
          u[12] || (u[12] = d("div", { class: "work-row-main" }, [
            d("strong", { class: "work-row-title" }, "Audit trail"),
            d("p", { class: "work-muted work-small" }, "Choose which item changes appear in history.")
          ], -1)),
          d("div", Uu, [
            b(r(oe), {
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
        (c(), g(Z, null, ae(v, (y) => d("div", {
          key: y,
          class: "work-settings-row"
        }, [
          d("div", Du, [
            d("strong", Iu, D(r(ge)(y)), 1),
            d("p", Au, "Blank follows the application default. " + D(f[y]), 1)
          ]),
          d("label", Pu, [
            b(r(Ge), {
              min: 0,
              "aria-label": r(ge)(y),
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
}), Ou = {
  class: "work-stack",
  "aria-label": "Relation types editor"
}, Nu = { class: "work-section-heading" }, Mu = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, Fu = { class: "work-definition-meta work-muted work-small" }, Lu = { class: "work-settings-grid" }, zu = { class: "work-stack work-tight" }, Bu = { class: "work-stack work-tight" }, ju = { class: "work-stack work-tight" }, qu = { class: "work-stack work-tight" }, Wu = { class: "work-row" }, Ku = { class: "work-relation-preview work-small" }, Gu = { class: "work-muted" }, Yu = {
  key: 0,
  class: "kx-empty"
}, Hu = { class: "work-row work-add-definition" }, Xu = { class: "work-stack work-tight" }, Ju = /* @__PURE__ */ ue({
  __name: "RelationsEditor",
  props: {
    draft: {},
    guardRemoval: { type: Function }
  },
  setup(e) {
    const l = e, t = Y(() => l.draft.relation_types ?? []), a = j(""), o = j(""), s = j(!1), v = Y(() => /^[a-z][a-z0-9_]*$/.test(a.value) && !t.value.some((i) => i.id === a.value));
    function f() {
      v.value && ((l.draft.relation_types ??= []).push({ id: a.value, outward: ge(a.value).toLowerCase(), inward: ge(a.value).toLowerCase(), cardinality: "many" }), a.value = "");
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
    return (i, n) => (c(), g("section", Ou, [
      d("header", Nu, [
        n[1] || (n[1] = d("div", null, [
          d("h2", null, "Relation types"),
          d("p", { class: "work-muted work-small" }, "Give each direction a clear label. A used relation keeps its identity and shape.")
        ], -1)),
        b(r(Re), {
          class: "kx-tag-sm",
          severity: "secondary"
        }, {
          default: z(() => [
            M(D(t.value.length) + " " + D(t.value.length === 1 ? "relation" : "relations"), 1)
          ]),
          _: 1
        })
      ]),
      o.value ? (c(), g("p", Mu, D(o.value), 1)) : E("", !0),
      b($l, {
        columns: "relations",
        count: t.value.length
      }, {
        default: z(() => [
          (c(!0), g(Z, null, ae(t.value, (u, y) => (c(), q(Vl, {
            title: r(ge)(u.id),
            code: u.id,
            kind: u.symmetric ? "Same both ways" : "Different each way",
            key: y,
            class: "work-stack"
          }, {
            usage: z(() => [
              d("span", Fu, D(u.outward || "Related work") + " · " + D(u.inward || "Reverse relation"), 1)
            ]),
            actions: z(() => [
              b(r(H), {
                severity: "secondary",
                text: "",
                disabled: s.value,
                onClick: (p) => m(u.id),
                "aria-label": "Remove relation",
                size: "small"
              }, {
                default: z(() => [
                  b(r(_), {
                    icon: "tabler:trash",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["disabled", "onClick"])
            ]),
            default: z(() => [
              d("div", Lu, [
                d("label", zu, [
                  n[2] || (n[2] = M("Identifier ", -1)),
                  b(r(de), {
                    modelValue: u.id,
                    "onUpdate:modelValue": (p) => u.id = p,
                    required: "",
                    pattern: "[a-z][a-z0-9_]*",
                    "aria-label": "Relation ID"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                d("label", Bu, [
                  n[3] || (n[3] = M("Outward label ", -1)),
                  b(r(de), {
                    modelValue: u.outward,
                    "onUpdate:modelValue": (p) => u.outward = p,
                    "aria-label": "Outward label"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                d("label", ju, [
                  n[4] || (n[4] = M("Inward label ", -1)),
                  b(r(de), {
                    modelValue: u.inward,
                    "onUpdate:modelValue": (p) => u.inward = p,
                    "aria-label": "Inward label"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                d("label", qu, [
                  n[5] || (n[5] = M("Links allowed ", -1)),
                  b(r(oe), {
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
                d("label", Wu, [
                  b(r(Mt), {
                    modelValue: u.symmetric,
                    "onUpdate:modelValue": (p) => u.symmetric = p,
                    "aria-label": "Same meaning in both directions",
                    binary: ""
                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                  n[6] || (n[6] = M("Same meaning in both directions ", -1))
                ])
              ]),
              d("p", Ku, [
                n[7] || (n[7] = d("strong", null, "This item", -1)),
                M(" " + D(u.outward || "relates to") + " ", 1),
                n[8] || (n[8] = d("strong", null, "another item", -1)),
                d("span", Gu, " · reverse: " + D(u.symmetric ? u.outward : u.inward), 1)
              ])
            ]),
            _: 2
          }, 1032, ["title", "code", "kind"]))), 128)),
          t.value.length ? E("", !0) : (c(), g("p", Yu, "No relation types yet. Add one to link related work.")),
          d("div", Hu, [
            d("label", Xu, [
              n[9] || (n[9] = M("New relation ID ", -1)),
              b(r(de), {
                modelValue: a.value,
                "onUpdate:modelValue": n[0] || (n[0] = (u) => a.value = u),
                placeholder: "related_to",
                onKeydown: Ae(be(f, ["prevent"]), ["enter"])
              }, null, 8, ["modelValue", "onKeydown"])
            ]),
            b(r(H), {
              label: "Add relation",
              severity: "secondary",
              disabled: !v.value,
              onClick: f,
              outlined: ""
            }, {
              icon: z(() => [
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
function Zu(e, l) {
  return e.parked ? "Stopped: " + (typeof e.error == "string" ? e.error : e.error?.message ?? "Projection is parked") : e.bootstrapping ? "Initializing" : e.last_seq >= l ? "Up to date" : "Catching up";
}
const Qu = {
  class: "work-stack",
  "aria-label": "Plugins editor"
}, _u = { class: "work-section-heading" }, ec = {
  key: 0,
  class: "kx-loading"
}, tc = {
  key: 1,
  class: "kx-err",
  role: "alert"
}, lc = {
  key: 2,
  class: "work-notice",
  role: "status"
}, ac = { class: "work-row" }, oc = {
  key: 0,
  class: "work-muted work-small"
}, ic = {
  key: 1,
  class: "kx-err"
}, nc = {
  key: 2,
  class: "work-notice"
}, sc = {
  key: 3,
  class: "work-stack work-tight work-plugin-status",
  role: "status"
}, rc = {
  key: 0,
  class: "kx-err"
}, dc = { class: "work-muted work-small" }, uc = { class: "work-form-actions" }, cc = {
  key: 0,
  class: "work-muted work-small"
}, Ea = /* @__PURE__ */ ue({
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
    function n(L) {
      return t.schema.plugins?.find((S) => S.plugin === L);
    }
    function u(L) {
      return n(L)?.active === !0;
    }
    function y(L) {
      return n(L)?.lifecycle.state === "ready";
    }
    function p(L) {
      return t.draft.plugins?.some((S) => S.use === L) === !0;
    }
    function w(L, S) {
      const U = t.draft.plugins ?? [];
      S && !p(L) && (t.draft.plugins = [...U, { use: L }]), S || (t.draft.plugins = U.filter((A) => A.use !== L), delete t.configs[L], m.value.delete(L), a("validity", L, !0));
    }
    function x(L) {
      return u(L) ? o.value[L] ?? n(L)?.config ?? i : t.configs[L] ?? i;
    }
    function I(L, S) {
      u(L) ? o.value[L] = S : t.configs[L] = S;
    }
    function T(L, S) {
      S ? m.value.delete(L) : m.value.add(L), u(L) || a("validity", L, S);
    }
    async function X(L) {
      if (!(s.value || m.value.has(L))) {
        s.value = L, v.value = "", f.value = "";
        try {
          await kt.configure(t.boardId, L, x(L)), delete o.value[L], f.value = "Plugin configuration saved.", a("configured");
        } catch (S) {
          v.value = S instanceof Error ? S.message : "Could not configure plugin.";
        } finally {
          s.value = "";
        }
      }
    }
    return (L, S) => (c(), g("section", Qu, [
      d("header", _u, [
        S[1] || (S[1] = d("div", null, [
          d("h2", null, "Plugins"),
          d("p", { class: "work-muted work-small" }, "Add capabilities from installed modules.")
        ], -1)),
        b(r(H), {
          label: "Refresh status",
          severity: "secondary",
          outlined: "",
          disabled: !!s.value || e.disabled,
          onClick: S[0] || (S[0] = (U) => a("refresh"))
        }, {
          icon: z(() => [
            b(r(_), {
              icon: "tabler:refresh",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        }, 8, ["disabled"])
      ]),
      S[5] || (S[5] = d("p", { class: "work-muted work-small" }, "Activation joins the schema draft and requires review. Active plugin configuration saves separately. Status reflects the last read; refresh to check progress.", -1)),
      e.options.length ? E("", !0) : (c(), g("p", ec, "No installed plugins are visible to you.")),
      v.value ? (c(), g("div", tc, D(v.value), 1)) : E("", !0),
      f.value ? (c(), g("p", lc, D(f.value), 1)) : E("", !0),
      b($l, {
        columns: "plugins",
        count: e.options.length
      }, {
        default: z(() => [
          (c(!0), g(Z, null, ae(e.options, (U) => (c(), q(Vl, {
            key: U.plugin,
            title: U.title || "Unavailable capability",
            description: U.description,
            kind: u(U.plugin) ? "Active" : p(U.plugin) ? "Pending review" : "Inactive",
            class: "work-stack"
          }, {
            actions: z(() => [
              S[3] || (S[3] = d("span", { class: "work-spacer" }, null, -1)),
              d("label", ac, [
                b(r(Le), {
                  "model-value": p(U.plugin),
                  disabled: !!s.value || e.disabled || e.activationLocked || !!U.problem,
                  "onUpdate:modelValue": (A) => w(U.plugin, A)
                }, null, 8, ["model-value", "disabled", "onUpdate:modelValue"]),
                S[2] || (S[2] = M("Activate on this board", -1))
              ])
            ]),
            default: z(() => [
              U.requires.length ? (c(), g("p", oc, "Requires " + D(U.requires.map((A) => e.options.find((O) => O.plugin === A)?.title || "Another capability").join(", ")), 1)) : E("", !0),
              U.problem ? (c(), g("p", ic, D(U.problem.message), 1)) : E("", !0),
              n(U.plugin)?.outdated ? (c(), g("p", nc, "The stored declaration differs from the installed plugin. Review activation to update it.")) : E("", !0),
              u(U.plugin) ? (c(), g("div", sc, [
                d("p", null, D(y(U.plugin) ? "Attachment configured" : n(U.plugin)?.lifecycle.state === "failed" ? "Configuration failed" : "Configuring attachment"), 1),
                n(U.plugin)?.lifecycle.error ? (c(), g("p", rc, D(n(U.plugin)?.lifecycle.error?.message), 1)) : E("", !0),
                (c(!0), g(Z, null, ae(n(U.plugin)?.projections, (A, O) => (c(), g("div", { key: O }, [
                  d("p", null, D(r(Zu)(A, e.schema.as_of)), 1),
                  d("p", dc, "Position " + D(A.last_seq) + " · Board head " + D(e.schema.as_of), 1)
                ]))), 128))
              ])) : E("", !0),
              !U.problem && (p(U.plugin) || u(U.plugin)) ? (c(), g(Z, { key: 4 }, [
                b(ia, {
                  disabled: !!s.value || e.disabled,
                  schema: U.config_schema,
                  "model-value": x(U.plugin),
                  "onUpdate:modelValue": (A) => I(U.plugin, A),
                  onValidity: (A) => T(U.plugin, A)
                }, null, 8, ["disabled", "schema", "model-value", "onUpdate:modelValue", "onValidity"]),
                d("div", uc, [
                  b(r(H), {
                    label: "Reset",
                    severity: "secondary",
                    outlined: "",
                    disabled: !!s.value || e.disabled,
                    onClick: (A) => I(U.plugin, u(U.plugin) ? r(gt)(n(U.plugin)?.config ?? {}) : {})
                  }, {
                    icon: z(() => [
                      b(r(_), { icon: "tabler:restore" })
                    ]),
                    _: 1
                  }, 8, ["disabled", "onClick"]),
                  u(U.plugin) ? (c(), q(r(H), {
                    key: 0,
                    label: "Save configuration",
                    disabled: !!s.value || e.disabled || m.value.has(U.plugin),
                    loading: s.value === U.plugin,
                    onClick: (A) => X(U.plugin)
                  }, {
                    icon: z(() => [
                      b(r(_), {
                        icon: "tabler:device-floppy",
                        "aria-hidden": "true"
                      })
                    ]),
                    _: 1
                  }, 8, ["disabled", "loading", "onClick"])) : E("", !0)
                ]),
                u(U.plugin) ? E("", !0) : (c(), g("p", cc, "Initial configuration is included in Review and Apply."))
              ], 64)) : E("", !0)
            ]),
            _: 2
          }, 1032, ["title", "description", "kind"]))), 128))
        ]),
        _: 1
      }, 8, ["count"]),
      (c(!0), g(Z, null, ae(e.draft.plugins?.filter((U) => !e.options.some((A) => A.plugin === U.use)) ?? [], (U) => (c(), g("article", {
        key: U.use,
        class: "work-settings-card"
      }, [
        S[4] || (S[4] = d("p", null, "Unavailable plugin", -1)),
        b(r(H), {
          label: "Deactivate plugin",
          severity: "secondary",
          onClick: (A) => w(U.use, !1),
          outlined: ""
        }, {
          icon: z(() => [
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
}), vc = {
  class: "work-stack",
  "aria-label": "Board visibility"
}, mc = { class: "work-stack work-tight" }, fc = {
  key: 0,
  class: "work-row"
}, pc = { class: "work-stack work-tight" }, bc = { class: "work-settings-list" }, hc = { class: "work-row-main" }, yc = { class: "work-small work-muted" }, gc = { class: "work-row-control" }, kc = { class: "work-row" }, wc = /* @__PURE__ */ ue({
  __name: "VisibilityEditor",
  props: {
    draft: {},
    boardId: {}
  },
  emits: ["validity"],
  setup(e, { emit: l }) {
    const t = e, a = l, o = Y(() => t.draft.visibility), s = Y(() => (t.draft.fields ?? []).filter((u) => u.form === "text" && (!u.cardinality || u.cardinality === "one") && u.type !== "rollup" && u.index !== "number" && u.config?.case !== "insensitive")), v = j(""), f = Y(() => s.value.find((u) => u.code === o.value?.field)?.type !== "option");
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
    return (u, y) => (c(), g("section", vc, [
      y[10] || (y[10] = d("h3", { class: "work-group-title" }, "Board visibility", -1)),
      y[11] || (y[11] = d("p", { class: "work-small work-muted" }, "Restrict items by their visibility level. People still need access to the board.", -1)),
      d("label", mc, [
        y[7] || (y[7] = M("Visibility field", -1)),
        b(r(oe), {
          "aria-label": "Visibility field",
          placeholder: "No additional restriction",
          "model-value": o.value?.field ?? "",
          options: [{ label: "No additional restriction", value: "" }, ...s.value.map((p) => ({ label: r(Ct)(p), value: p.code }))],
          optionLabel: "label",
          optionValue: "value",
          appendTo: "self",
          "onUpdate:modelValue": y[0] || (y[0] = (p) => i(p))
        }, null, 8, ["model-value", "options"])
      ]),
      o.value ? (c(), g(Z, { key: 0 }, [
        f.value ? (c(), g("div", fc, [
          d("label", pc, [
            y[8] || (y[8] = M("Level ID", -1)),
            b(r(de), {
              modelValue: v.value,
              "onUpdate:modelValue": y[1] || (y[1] = (p) => v.value = p),
              "aria-label": "New visibility level",
              onKeydown: Ae(be(m, ["prevent"]), ["enter"])
            }, null, 8, ["modelValue", "onKeydown"])
          ]),
          b(r(H), {
            label: "Add level",
            severity: "secondary",
            outlined: "",
            disabled: !v.value || o.value.levels.some((p) => p.id === v.value),
            onClick: m
          }, null, 8, ["disabled"])
        ])) : E("", !0),
        d("div", bc, [
          (c(!0), g(Z, null, ae(o.value.levels, (p, w) => (c(), g("div", {
            key: p.id,
            class: "work-settings-row"
          }, [
            d("div", hc, [
              d("strong", null, D(s.value.find((x) => x.code === o.value.field)?.options?.find((x) => x.id === p.id)?.label || p.id), 1),
              d("p", yc, "Level " + D(w + 1), 1)
            ]),
            d("div", gc, [
              b(ja, {
                "board-id": e.boardId,
                label: "Who can see these items",
                "model-value": p.holders,
                "onUpdate:modelValue": (x) => n(p.id, x),
                onValidity: y[2] || (y[2] = (x) => a("validity", x))
              }, null, 8, ["board-id", "model-value", "onUpdate:modelValue"])
            ])
          ]))), 128))
        ]),
        d("label", kc, [
          b(r(Le), {
            "model-value": o.value.bypass === "admin",
            "onUpdate:modelValue": y[3] || (y[3] = (p) => p ? o.value.bypass = "admin" : delete o.value.bypass)
          }, null, 8, ["model-value"]),
          y[9] || (y[9] = M("Board administrators can see every level", -1))
        ]),
        b(r(H), {
          label: "Remove visibility restriction",
          severity: "secondary",
          text: "",
          onClick: y[4] || (y[4] = (p) => delete e.draft.visibility)
        })
      ], 64)) : E("", !0),
      b(at, {
        label: "Visibility rules",
        "model-value": o.value,
        shape: "object",
        example: { field: "visibility", levels: [{ id: "internal", holders: [] }], bypass: "admin" },
        "onUpdate:modelValue": y[5] || (y[5] = (p) => e.draft.visibility = p),
        onValidity: y[6] || (y[6] = (p) => a("validity", p))
      }, null, 8, ["model-value"])
    ]));
  }
}), Vc = { class: "kx-head" }, $c = { class: "kx-head-icon" }, xc = { class: "kx-head-text" }, Cc = { class: "kx-title" }, Sc = ["title"], Tc = { class: "kx-head-actions" }, Ec = /* @__PURE__ */ ue({
  __name: "PageHead",
  props: {
    title: {},
    subtitle: {},
    icon: { default: "tabler:layout-kanban" },
    backLabel: {}
  },
  emits: ["back"],
  setup(e) {
    return (l, t) => (c(), g("header", Vc, [
      e.backLabel ? (c(), q(r(H), {
        key: 0,
        "aria-label": e.backLabel,
        severity: "secondary",
        text: "",
        onClick: t[0] || (t[0] = (a) => l.$emit("back"))
      }, {
        default: z(() => [
          b(r(_), {
            icon: "tabler:arrow-left",
            "aria-hidden": "true"
          })
        ]),
        _: 1
      }, 8, ["aria-label"])) : E("", !0),
      d("div", $c, [
        b(r(_), {
          icon: e.icon,
          "aria-hidden": "true"
        }, null, 8, ["icon"])
      ]),
      d("div", xc, [
        We(l.$slots, "identity", {}, () => [
          d("h1", Cc, D(e.title), 1),
          e.subtitle ? (c(), g("p", {
            key: 0,
            class: "kx-head-sub",
            title: e.subtitle
          }, D(e.subtitle), 9, Sc)) : E("", !0)
        ])
      ]),
      d("div", Tc, [
        We(l.$slots, "default")
      ])
    ]));
  }
}), Uc = { class: "work-board-identity work-stack work-tight" }, Dc = { class: "work-stack work-tight" }, Ic = { class: "work-stack work-tight" }, Ac = { class: "work-stack work-tight" }, Pc = ["value", "inert"], Rc = {
  key: 1,
  class: "work-muted work-small"
}, Oc = { class: "work-row" }, Nc = { class: "work-row" }, Mc = {
  key: 2,
  class: "work-identity-actions"
}, Fc = ["title"], Lc = {
  key: 2,
  class: "kx-err work-inline",
  role: "alert"
}, zc = {
  key: 3,
  class: "work-muted work-small",
  role: "status"
}, Ua = /* @__PURE__ */ ue({
  __name: "BoardIdentity",
  props: {
    board: {},
    compact: { type: Boolean },
    detail: { type: Boolean },
    subtitle: {}
  },
  emits: ["saved"],
  setup(e, { emit: l }) {
    const t = e, a = l, o = j(!1), s = j(""), v = j(""), f = j(""), m = j(!1), i = j(!1), n = j(""), u = j(""), y = Y(() => t.board?.access?.admin === !0);
    function p() {
      s.value = t.board?.title ?? "", f.value = t.board?.icon ?? "", tt("wc-icon-picker").then((x) => m.value = x), v.value = t.board?.description ?? "", n.value = "", u.value = "", o.value = !0;
    }
    xe(y, (x) => {
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
        const I = await $t.updateBoard(t.board.board_id, x);
        o.value = !1, u.value = I.status === "unchanged" ? "Nothing changed." : "Board saved.", a("saved");
      } catch (I) {
        n.value = I instanceof Error ? I.message : "Could not save the board.";
      } finally {
        i.value = !1;
      }
    }
    return (x, I) => (c(), g("div", Uc, [
      o.value ? (c(), g("form", {
        key: 0,
        class: "work-identity-edit",
        "aria-label": "Edit board",
        onClick: I[4] || (I[4] = be(() => {
        }, ["stop"])),
        onSubmit: be(w, ["prevent"])
      }, [
        d("label", Dc, [
          I[5] || (I[5] = M("Title", -1)),
          b(r(de), {
            modelValue: s.value,
            "onUpdate:modelValue": I[0] || (I[0] = (T) => s.value = T),
            required: "",
            autofocus: "",
            disabled: i.value
          }, null, 8, ["modelValue", "disabled"])
        ]),
        d("label", Ic, [
          I[6] || (I[6] = M("Description", -1)),
          b(r(ml), {
            modelValue: v.value,
            "onUpdate:modelValue": I[1] || (I[1] = (T) => v.value = T),
            rows: "1",
            disabled: i.value
          }, null, 8, ["modelValue", "disabled"])
        ]),
        d("div", Ac, [
          I[7] || (I[7] = d("span", null, "Board icon", -1)),
          m.value ? (c(), g("wc-icon-picker", {
            key: 0,
            value: f.value,
            fallback: "tabler:layout-kanban",
            inert: i.value || void 0,
            onSelect: I[2] || (I[2] = (T) => f.value = T.detail)
          }, null, 40, Pc)) : (c(), g("p", Rc, "The icon picker is unavailable."))
        ]),
        d("div", Oc, [
          b(r(H), {
            label: "Save",
            severity: "secondary",
            type: "submit",
            disabled: !s.value.trim() || i.value,
            loading: i.value,
            outlined: ""
          }, {
            icon: z(() => [
              b(r(_), {
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
            onClick: I[3] || (I[3] = (T) => o.value = !1),
            outlined: ""
          }, {
            icon: z(() => [
              b(r(_), {
                icon: "tabler:x",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled"])
        ])
      ], 32)) : (c(), g(Z, { key: 1 }, [
        d("div", Nc, [
          e.board?.icon ? (c(), q(r(_), {
            key: 0,
            icon: e.board.icon,
            "aria-hidden": "true"
          }, null, 8, ["icon"])) : E("", !0),
          (c(), q(zl(e.compact || e.detail ? "h2" : "h1"), {
            class: ft(e.detail ? "work-detail-title" : e.compact ? "kx-card-name" : "kx-title")
          }, {
            default: z(() => [
              M(D(e.board?.title || "Untitled board"), 1)
            ]),
            _: 1
          }, 8, ["class"])),
          e.compact ? We(x.$slots, "title-end", {}, void 0, void 0, 1) : E("", !0),
          e.compact ? (c(), g("span", Mc, [
            y.value ? (c(), q(r(H), {
              key: 0,
              severity: "secondary",
              text: "",
              size: "small",
              onClick: be(p, ["stop"]),
              "aria-label": "Edit board"
            }, {
              default: z(() => [
                b(r(_), {
                  icon: "tabler:pencil",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            })) : E("", !0),
            We(x.$slots, "actions")
          ])) : y.value ? (c(), q(r(H), {
            key: 3,
            severity: "secondary",
            text: "",
            size: "small",
            onClick: be(p, ["stop"]),
            "aria-label": "Edit board"
          }, {
            default: z(() => [
              b(r(_), {
                icon: "tabler:pencil",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          })) : E("", !0),
          e.compact ? E("", !0) : We(x.$slots, "title-end", {}, void 0, void 0, 4)
        ]),
        !e.compact && (e.subtitle || e.board?.description) ? (c(), g("p", {
          key: 0,
          class: "kx-head-sub",
          title: e.subtitle || e.board?.description
        }, D(e.subtitle || e.board?.description), 9, Fc)) : E("", !0)
      ], 64)),
      n.value ? (c(), g("p", Lc, D(n.value), 1)) : E("", !0),
      u.value ? (c(), g("p", zc, D(u.value), 1)) : E("", !0)
    ]));
  }
}), Bc = {
  key: 0,
  class: "work-dirty"
}, Da = /* @__PURE__ */ ue({
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
    return (l, t) => (c(), g(Z, null, [
      e.dirty ? (c(), g("span", Bc, "Unsaved changes")) : E("", !0),
      b(r(H), {
        label: "Discard",
        severity: "secondary",
        outlined: "",
        disabled: !e.dirty || e.busy || e.checkingRemoval,
        onClick: t[0] || (t[0] = (a) => l.$emit("discard"))
      }, {
        icon: z(() => [
          b(r(_), { icon: "tabler:restore" })
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
}), jc = {
  key: 0,
  class: "work-detail-head"
}, qc = {
  key: 0,
  class: "work-row work-wrap work-draft-actions"
}, Wc = {
  key: 2,
  class: "kx-err",
  role: "alert"
}, Kc = ["config"], Gc = /* @__PURE__ */ ue({
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
      !l.authorized || !l.board || (o.value = "", a.value = await tt("kickside-share"), a.value ? t.value = !0 : o.value = "The sharing widget is unavailable. Try Share board again.");
    }
    xe(() => l.authorized, (i) => {
      i || (t.value = !1);
    });
    const v = Y(() => JSON.stringify({ resource_id: l.board?.board_id, title: l.board?.title, access_url: `/api/v1/component-access/grants/${encodeURIComponent(l.board?.board_id ?? "")}`, share_url: `/api/v1/component-access/share/${encodeURIComponent(l.board?.board_id ?? "")}` })), f = Y(() => l.pack ? `${l.packTitle} ${l.pack.version}${l.outdated ? " · Outdated" : ""}` : ""), m = Y(() => "Settings · generation " + (l.generation ?? "…") + (f.value ? " · " + f.value : ""));
    return (i, n) => (c(), g(Z, null, [
      e.embedded ? (c(), g("header", jc, [
        b(Ua, {
          board: e.board,
          subtitle: f.value || void 0,
          detail: "",
          onSaved: n[0] || (n[0] = (u) => i.$emit("saved"))
        }, {
          "title-end": z(() => [
            b(r(Re), {
              severity: "secondary",
              value: "Generation " + (e.generation ?? "…")
            }, null, 8, ["value"])
          ]),
          _: 1
        }, 8, ["board", "subtitle"]),
        e.authorized ? (c(), g("div", qc, [
          e.authorized && e.outdated && e.pack ? (c(), q(r(H), {
            key: 0,
            disabled: !e.canUpgrade,
            title: e.upgradeReason,
            label: "Upgrade pack",
            severity: "secondary",
            outlined: "",
            onClick: n[1] || (n[1] = (u) => i.$emit("upgrade"))
          }, {
            icon: z(() => [
              b(r(_), { icon: "tabler:refresh" })
            ]),
            _: 1
          }, 8, ["disabled", "title"])) : E("", !0),
          e.authorized && e.board ? (c(), q(r(H), {
            key: 1,
            label: "Share board",
            severity: "secondary",
            outlined: "",
            disabled: e.busy,
            onClick: s
          }, {
            icon: z(() => [
              b(r(_), {
                icon: "tabler:share",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled"])) : E("", !0),
          e.authorized && !e.pack ? (c(), q(r(H), {
            key: 2,
            label: "Install pack",
            severity: "secondary",
            outlined: "",
            disabled: e.busy || e.dirty,
            onClick: n[2] || (n[2] = (u) => i.$emit("install"))
          }, null, 8, ["disabled"])) : E("", !0),
          b(Da, {
            dirty: e.dirty,
            busy: e.busy,
            "checking-removal": e.checkingRemoval,
            reviewed: e.reviewed,
            disabled: e.disabled,
            onDiscard: n[3] || (n[3] = (u) => i.$emit("discard")),
            onPrimary: n[4] || (n[4] = (u) => i.$emit("primary"))
          }, null, 8, ["dirty", "busy", "checking-removal", "reviewed", "disabled"])
        ])) : E("", !0)
      ])) : (c(), q(Ec, {
        key: 1,
        title: e.board?.title || "Board",
        subtitle: m.value,
        "back-label": "Back to board",
        icon: "tabler:adjustments",
        onBack: n[10] || (n[10] = (u) => i.$emit("back"))
      }, {
        identity: z(() => [
          b(Ua, {
            board: e.board,
            subtitle: m.value,
            onSaved: n[5] || (n[5] = (u) => i.$emit("saved"))
          }, null, 8, ["board", "subtitle"])
        ]),
        default: z(() => [
          e.authorized && e.outdated && e.pack ? (c(), q(r(H), {
            key: 0,
            disabled: !e.canUpgrade,
            title: e.upgradeReason,
            label: "Upgrade pack",
            severity: "secondary",
            outlined: "",
            onClick: n[6] || (n[6] = (u) => i.$emit("upgrade"))
          }, {
            icon: z(() => [
              b(r(_), { icon: "tabler:refresh" })
            ]),
            _: 1
          }, 8, ["disabled", "title"])) : E("", !0),
          e.authorized && e.board ? (c(), q(r(H), {
            key: 1,
            label: "Share board",
            severity: "secondary",
            outlined: "",
            disabled: e.busy,
            onClick: s
          }, {
            icon: z(() => [
              b(r(_), {
                icon: "tabler:share",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled"])) : E("", !0),
          e.authorized && !e.pack ? (c(), q(r(H), {
            key: 2,
            label: "Install pack",
            severity: "secondary",
            outlined: "",
            disabled: e.busy || e.dirty,
            onClick: n[7] || (n[7] = (u) => i.$emit("install"))
          }, null, 8, ["disabled"])) : E("", !0),
          e.authorized ? (c(), q(Da, {
            key: 3,
            dirty: e.dirty,
            busy: e.busy,
            "checking-removal": e.checkingRemoval,
            reviewed: e.reviewed,
            disabled: e.disabled,
            onDiscard: n[8] || (n[8] = (u) => i.$emit("discard")),
            onPrimary: n[9] || (n[9] = (u) => i.$emit("primary"))
          }, null, 8, ["dirty", "busy", "checking-removal", "reviewed", "disabled"])) : E("", !0)
        ]),
        _: 1
      }, 8, ["title", "subtitle"])),
      o.value ? (c(), g("p", Wc, D(o.value), 1)) : E("", !0),
      t.value && a.value && e.authorized ? (c(), g("kickside-share", {
        key: 3,
        config: v.value,
        onClose: n[11] || (n[11] = (u) => t.value = !1),
        onChanged: n[12] || (n[12] = (u) => i.$emit("saved"))
      }, null, 40, Kc)) : E("", !0)
    ], 64));
  }
}), Yc = {
  key: 0,
  class: "work-settings-card work-schema-plan work-stack",
  "aria-label": "Schema review"
}, Hc = { key: 0 }, Xc = { class: "work-row" }, Jc = { class: "work-muted work-small" }, Zc = { class: "work-muted" }, Qc = {
  key: 0,
  class: "work-notice"
}, _c = {
  key: 1,
  class: "work-notice"
}, ev = {
  key: 2,
  class: "work-muted work-small"
}, tv = {
  key: 3,
  class: "work-stack work-tight",
  "aria-label": "Reviewed Flow bindings"
}, lv = { key: 4 }, av = { key: 0 }, ov = {
  key: 5,
  class: "work-settings-table"
}, iv = { key: 0 }, nv = { key: 1 }, sv = { key: 2 }, rv = { key: 6 }, dv = /* @__PURE__ */ ue({
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
    return (a, o) => e.plan ? (c(), g("section", Yc, [
      !e.plan.changes.length && !e.plan.refused.length && !e.configCount && !e.packReview ? (c(), g("p", Hc, "No changes to apply.")) : (c(), g(Z, { key: 1 }, [
        d("header", Xc, [
          o[0] || (o[0] = d("h2", null, "Review", -1)),
          b(r(Re), {
            class: "kx-tag-sm",
            severity: e.plan.class === "refused" ? "danger" : e.plan.class === "semantic" ? "warn" : e.plan.class === "additive" ? "success" : "secondary"
          }, {
            default: z(() => [
              M(D(e.plan.class), 1)
            ]),
            _: 1
          }, 8, ["severity"]),
          d("span", Jc, "Generation " + D(e.generation) + " → " + D(e.plan.generation), 1)
        ]),
        d("p", Zc, D(r(Uo)[e.plan.class] || "Review the classified changes below."), 1),
        e.plan.migration ? (c(), g("p", Qc, "Migration needed: " + D(e.plan.migration), 1)) : e.follows.length ? (c(), g("p", _c, "Follow migration: " + D(e.follows.join(", ")) + ". Existing items move to the new process generation; declared state maps apply.", 1)) : (c(), g("p", ev, "No follow process migration is indicated by these changes.")),
        t.value.length ? (c(), g("section", tv, [
          o[1] || (o[1] = d("h3", null, "Flow bindings", -1)),
          (c(!0), g(Z, null, ae(t.value, (s) => (c(), g("p", {
            key: s.process + ":" + s.state
          }, D(s.process) + " / " + D(s.state) + ": " + D(s.reference.id) + " · v" + D(s.reference.version), 1))), 128)),
          o[2] || (o[2] = d("p", { class: "work-muted work-small" }, "New entries use these exact published versions. Before replacing a binding, stop new entries, drain existing attempts and deliveries, pause the old launcher, save, then resume entries.", -1))
        ])) : E("", !0),
        We(a.$slots, "default"),
        e.plan.refused.length ? (c(), g("h3", lv, "Refused changes")) : E("", !0),
        (c(!0), g(Z, null, ae(e.plan.refused, (s, v) => (c(), q(r(Wo), {
          key: v,
          severity: "error",
          role: "alert"
        }, {
          default: z(() => [
            M(D(s.code) + " · " + D(s.what) + " · " + D(r(wl)(s)), 1),
            s.to ? (c(), g("span", av, " → " + D(s.to), 1)) : E("", !0)
          ]),
          _: 2
        }, 1024))), 128)),
        e.plan.changes.length ? (c(), g("table", ov, [
          o[3] || (o[3] = d("thead", null, [
            d("tr", null, [
              d("th", null, "Entry"),
              d("th", null, "Class"),
              d("th", null, "Change")
            ])
          ], -1)),
          d("tbody", null, [
            (c(!0), g(Z, null, ae(e.plan.changes, (s, v) => (c(), g("tr", { key: v }, [
              d("td", null, D(s.code), 1),
              d("td", null, [
                b(r(Re), {
                  class: "kx-tag-sm",
                  severity: s.class === "refused" ? "danger" : s.class === "semantic" ? "warn" : s.class === "additive" ? "success" : "secondary"
                }, {
                  default: z(() => [
                    M(D(s.class), 1)
                  ]),
                  _: 2
                }, 1032, ["severity"])
              ]),
              d("td", null, [
                M(D(s.what) + " ", 1),
                s.detail ? (c(), g("span", iv, " · " + D(s.detail), 1)) : E("", !0),
                s.to ? (c(), g("span", nv, " → " + D(s.to), 1)) : E("", !0),
                s.count ? (c(), g("span", sv, " · " + D(s.count) + " items", 1)) : E("", !0)
              ])
            ]))), 128))
          ])
        ])) : (c(), g("p", rv, "No declaration changes are reported."))
      ], 64))
    ])) : E("", !0);
  }
}), uv = {
  key: 0,
  class: "work-stack",
  "aria-label": "Pack conflicts"
}, cv = { class: "work-stack work-tight work-pack-review-field" }, vv = { class: "work-json-disclosure" }, mv = { class: "work-config-fields" }, fv = { class: "work-json-example" }, pv = { class: "work-json-example" }, bv = {
  key: 1,
  class: "work-stack",
  "aria-label": "Pack state maps"
}, hv = /* @__PURE__ */ ue({
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
      return t.original.processes?.find((n) => n.id === i)?.name || ge(i);
    }
    function s(i) {
      const [n, ...u] = i.split("."), y = u.join(".");
      return n === "processes" ? o(y) : n === "fields" ? t.original.fields?.find((p) => p.code === y)?.title || ge(y) : n === "item_types" ? t.original.item_types?.find((p) => p.id === y)?.title || ge(y) : ge(n);
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
    return (i, n) => (c(), g(Z, null, [
      e.plan.conflicts.length ? (c(), g("section", uv, [
        n[3] || (n[3] = d("h3", null, "Local edits conflict", -1)),
        n[4] || (n[4] = d("p", { class: "work-muted work-small" }, "Choose which declaration to keep for each conflict, then review again.", -1)),
        (c(!0), g(Z, null, ae(e.plan.conflicts, (u) => (c(), g("div", {
          key: u.path,
          class: "work-stack work-tight"
        }, [
          d("label", cv, [
            M(D(s(u.path)), 1),
            b(r(oe), {
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
          d("details", vv, [
            n[2] || (n[2] = d("summary", null, "Compare declarations", -1)),
            d("div", mv, [
              d("section", null, [
                n[0] || (n[0] = d("h4", null, "Local edits", -1)),
                d("pre", fv, D(v(u.local_value)), 1)
              ]),
              d("section", null, [
                n[1] || (n[1] = d("h4", null, "Pack changes", -1)),
                d("pre", pv, D(v(u.incoming)), 1)
              ])
            ])
          ])
        ]))), 128))
      ])) : E("", !0),
      Object.keys(e.plan.maps).length ? (c(), g("section", bv, [
        n[5] || (n[5] = d("h3", null, "Required state maps", -1)),
        n[6] || (n[6] = d("p", { class: "work-muted work-small" }, "Review the proposed destinations for existing items. Each destination is editable.", -1)),
        (c(!0), g(Z, null, ae(e.plan.maps, (u, y) => (c(), g("div", {
          key: y,
          class: "work-stack"
        }, [
          d("h4", null, D(o(y)), 1),
          (c(!0), g(Z, null, ae(u, (p, w) => (c(), g("label", {
            key: w,
            class: "work-stack work-tight work-pack-review-field"
          }, [
            M("Move items from " + D(r(he)(e.original.processes?.find((x) => x.id === y)?.states.find((x) => x.id === w))), 1),
            b(r(oe), {
              "model-value": e.request.maps?.[y]?.[w],
              "aria-label": "Move items from " + r(he)(e.original.processes?.find((x) => x.id === y)?.states.find((x) => x.id === w)),
              disabled: e.disabled,
              appendTo: "self",
              optionLabel: "label",
              optionValue: "value",
              options: e.plan.declaration.processes?.find((x) => x.id === y)?.states.map((x) => ({ label: r(he)(x), value: x.id })) ?? [],
              "onUpdate:modelValue": (x) => m(y, w, x)
            }, null, 8, ["model-value", "aria-label", "disabled", "options", "onUpdate:modelValue"])
          ]))), 128))
        ]))), 128))
      ])) : E("", !0)
    ], 64));
  }
}), yv = {
  key: 0,
  class: "work-settings-tabs"
}, gv = { class: "work-section-navigation" }, kv = {
  key: 1,
  class: "kx-err",
  role: "alert"
}, wv = {
  key: 2,
  class: "kx-err",
  role: "alert"
}, Vv = {
  key: 3,
  class: "work-notice",
  role: "status"
}, $v = {
  key: 4,
  class: "kx-loading",
  role: "status"
}, xv = {
  key: 5,
  class: "work-notice",
  role: "alert"
}, Cv = {
  key: 6,
  class: "work-settings-content work-pane"
}, Sv = {
  key: 0,
  class: "work-notice",
  role: "alert"
}, Tv = {
  key: 1,
  class: "work-notice"
}, Ev = { key: 0 }, Uv = ["disabled", "inert"], Dv = {
  key: 6,
  class: "work-settings-card work-stack"
}, Iv = {
  key: 5,
  class: "kx-empty"
}, Av = {
  key: 6,
  class: "work-muted work-small",
  role: "status"
}, Pv = { class: "work-stack work-tight" }, Rv = {
  key: 0,
  class: "work-muted"
}, Ov = { class: "work-dialog-actions" }, Nv = /* @__PURE__ */ ue({
  __name: "BoardSettings",
  props: {
    boardId: {},
    embedded: { type: Boolean }
  },
  emits: ["dirty-change"],
  setup(e, { emit: l }) {
    const t = e, a = l, o = Yo();
    let s, v = "";
    const f = () => JSON.stringify([k.value, T.value, B.value, [...Ve.value]]), m = ["Fields", "Item types", "Process", "Policy", "Relation types", "Plugins", "Review"], i = j("Fields"), n = j(!1), u = j(""), y = j(/* @__PURE__ */ new Set(["Fields"]));
    xe(i, (ee) => y.value.add(ee));
    const p = j(), w = j(), x = j(), I = j({}), T = j({}), X = j(), L = j(!1), S = j(!0), U = j(!1), A = j(""), O = j(""), F = j(""), P = j([]), B = j(), V = j(), le = j(), $ = j(), R = j(), N = j(""), Q = j([]), ce = Y(() => [...Q.value, ...$.value?.refused ?? []]), pe = j(!1), ke = j(0), Ve = j(/* @__PURE__ */ new Set()), De = j(), h = jl(), C = jl(), k = Y(() => ua(I.value, p.value?.declaration ?? {})), W = Y(() => Ve.value.size > 0 || !!B.value || !!p.value && (JSON.stringify(k.value) !== JSON.stringify(p.value.declaration) || Object.keys(T.value).length > 0));
    xe(W, (ee) => a("dirty-change", ee), { immediate: !0, flush: "sync" });
    const J = Y(() => !!p.value && !!w.value && p.value.generation !== w.value.generation), re = Y(() => L.value && !U.value && !pe.value && !St.value && !J.value && !Ve.value.size && $.value && ($.value.changes.length > 0 || Object.keys(T.value).length > 0) && $.value.class !== "refused" && !$.value.refused.length && R.value?.matches(k.value, p.value?.generation ?? -1, T.value)), fe = Y(() => P.value.find((ee) => ee.id === B.value?.pack)?.plugins.filter((ee) => !p.value?.plugins?.some((K) => K.plugin === ee.plugin && K.active)).map((ee) => ({ use: ee.plugin })) ?? []), Se = Y(() => !!le.value && JSON.stringify(le.value) === JSON.stringify(B.value)), Ne = Y(() => B.value ? L.value && !U.value && !Ve.value.size && !J.value && !St.value && Se.value && $.value?.class !== "refused" && !$.value?.refused.length && V.value?.conflicts.every((ee) => !!B.value?.resolutions?.[ee.path]) : re.value), Te = Y(() => !!$.value && (!B.value || Se.value)), pt = Y(() => P.value.find((ee) => ee.id === p.value?.pack?.id)?.title || "Installed pack"), st = Y(() => !F.value && !!p.value?.outdated && !!P.value.find((ee) => ee.id === p.value?.pack?.id)), Cl = Y(() => F.value ? "Reload packs to check available upgrades." : st.value ? W.value ? "Discard the current draft before upgrading." : St.value ? "Finish the current migration before upgrading." : U.value ? "Wait for the current request to finish." : void 0 : "Install an available version of this pack to upgrade.");
    function Ye() {
      B.value = void 0, V.value = void 0, le.value = void 0;
    }
    async function ll() {
      if (!p.value?.pack || U.value || W.value) return;
      const ee = P.value.find((K) => K.id === p.value.pack.id);
      ee && (B.value = ca(ee, p.value.generation), i.value = "Review", await Sl());
    }
    async function Bt() {
      const ee = P.value.find((K) => K.id === u.value);
      !p.value || !ee || ee.plugins.some((K) => !K.installed) || U.value || W.value || (B.value = ca(ee, p.value.generation), n.value = !1, i.value = "Review", await Sl());
    }
    async function Sl() {
      if (!B.value || U.value || !L.value || J.value || Ve.value.size) return;
      const ee = C(), K = gt(B.value), te = JSON.stringify(B.value);
      U.value = !0, A.value = "", O.value = "";
      try {
        const ye = await Io(K, (Et) => kt.packPlan(t.boardId, Et));
        if (!ee() || te !== JSON.stringify(B.value)) return;
        V.value = ye.plan, $.value = ye.plan, B.value = ye.request, le.value = gt(B.value), N.value = crypto.randomUUID(), i.value = "Review";
      } catch (ye) {
        ee() && (le.value = void 0, A.value = ye instanceof Error ? ye.message : "Could not plan the pack upgrade.");
      } finally {
        U.value = !1;
      }
    }
    const no = Y(() => $.value ? Do($.value, k.value) : []), St = Y(() => !!w.value?.migration_error || x.value?.status === "migrating");
    function rt() {
      Q.value = [], C(), $.value = void 0, R.value = void 0, le.value = void 0, N.value = "";
    }
    xe([k, T], rt, { deep: !0, flush: "sync" }), xe(T, (ee) => {
      B.value && (Object.keys(ee).length ? B.value.plugin_configs = gt(ee) : delete B.value.plugin_configs);
    }, { deep: !0, flush: "sync" });
    function Tt(ee, K) {
      K ? Ve.value.delete(ee) : Ve.value.add(ee), rt();
    }
    function Tl(ee) {
      Ye(), ke.value++, p.value = ee, I.value = gt(ee.declaration), T.value = {}, Ve.value.clear(), rt();
    }
    async function Ze(ee = !1) {
      const K = h();
      try {
        const [te, ye, Et] = await Promise.all([$t.schema(t.boardId, void 0, !0).catch((dt) => {
          if (dt instanceof va && dt.details?.code === "board_schema_missing") return { generation: 0, declaration: {}, compiled: {}, key_prefix: "", as_of: 0 };
          throw dt;
        }), $t.options(t.boardId), $t.boards()]);
        if (!K()) return;
        if (L.value = ye.access.admin, X.value = ye, x.value = Et.find((dt) => dt.board_id === t.boardId), !L.value) {
          p.value = void 0, I.value = {}, rt();
          return;
        }
        A.value = "";
        const He = Ao(te);
        w.value = He, s !== void 0 && He.generation >= s ? (s = void 0, v === f() && Tl(He), v = "") : (ee || !p.value || !W.value && He.generation !== p.value.generation) && Tl(He), J.value && rt(), await na(K);
      } catch (te) {
        if (!K()) return;
        te instanceof va && (te.status === 403 || te.kind?.toLowerCase() === "permission_denied") && (L.value = !1), rt(), A.value = te instanceof Error ? te.message : "Could not load board settings.";
      } finally {
        K() && (S.value = !1);
      }
    }
    async function na(ee = () => !0) {
      F.value = "";
      try {
        const K = await $t.packs();
        ee() && (P.value = K.filter(Po));
      } catch (K) {
        ee() && (F.value = K instanceof Error ? K.message : "Could not load packs.");
      }
    }
    function so() {
      for (const ee of De.value?.querySelectorAll("input, select, textarea") ?? [])
        if (!(ee.form !== De.value || ee.closest('[style*="display: none"]')) && !ee.reportValidity())
          return !1;
      return !0;
    }
    function ro(ee) {
      i.value = ee, ee === "Review" && !$.value && El();
    }
    async function El() {
      if (B.value) return Sl();
      if (!p.value || U.value || !L.value || J.value || Ve.value.size || !so()) return;
      const ee = C(), K = ma(k.value, p.value.generation, T.value);
      U.value = !0, A.value = "", O.value = "";
      try {
        const te = await kt.plan(t.boardId, K);
        if (!ee() || Ve.value.size || !K.matches(k.value, p.value.generation, T.value)) return;
        $.value = te, R.value = K, N.value = crypto.randomUUID(), i.value = "Review";
      } catch (te) {
        ee() && (rt(), A.value = te instanceof Error ? te.message : "Could not review changes.", Q.value = Ro(te, k.value));
      } finally {
        U.value = !1;
      }
    }
    async function uo() {
      if (!Ne.value) return;
      if (B.value && le.value) {
        U.value = !0, A.value = "";
        const K = f();
        try {
          const te = await kt.packApply(t.boardId, gt(le.value), N.value);
          s = te.generation, v = K, await Ze(), O.value = te.status === "done" ? `Pack applied at generation ${te.generation}.` : "Pack installation continues in the background.";
        } catch (te) {
          A.value = te instanceof Error ? te.message : "Could not apply the pack upgrade.";
        } finally {
          U.value = !1;
        }
        return;
      }
      if (!R.value) return;
      U.value = !0, A.value = "", O.value = "";
      const ee = f();
      try {
        const K = await kt.apply(t.boardId, R.value, N.value);
        s = K.generation, v = ee, await Ze(), O.value = `Applied generation ${K.generation} (${K.class}).`;
      } catch (K) {
        A.value = K instanceof Error ? K.message : "Could not apply schema.";
      } finally {
        U.value = !1;
      }
    }
    async function co() {
      if (!U.value) {
        U.value = !0, A.value = "";
        try {
          const ee = await kt.resume(t.boardId);
          O.value = ee.resumed ? "Migration resumes." : "Migration is already running.", await Ze();
        } catch (ee) {
          A.value = ee instanceof Error ? ee.message : "Could not resume migration.";
        } finally {
          U.value = !1;
        }
      }
    }
    async function al(ee, K) {
      if (!p.value || !L.value || U.value || pe.value) return "Wait for the current change to finish.";
      if (J.value) return "Discard the stale draft before removing a definition.";
      const te = p.value.generation, ye = JSON.stringify(k.value), Et = gt(I.value);
      _t(Et, ee, K), pe.value = !0;
      try {
        const He = await kt.plan(t.boardId, ma(ua(Et, p.value.declaration), te, T.value));
        if (!L.value || J.value || p.value.generation !== te || JSON.stringify(k.value) !== ye) return "The draft changes during the check. Try the removal again.";
        const dt = Oo(He, ee, K);
        if (dt) return dt;
        if (He.class === "refused") return "Resolve the refused draft changes in Review before removing this definition.";
      } catch (He) {
        return He instanceof Error ? He.message : "Could not check this removal.";
      } finally {
        pe.value = !1;
      }
    }
    async function vo() {
      W.value && !await Fo.confirm({ header: "Discard changes?", message: "Your unsaved board settings will be discarded.", acceptLabel: "Discard", rejectLabel: "Keep editing" }) || o({ name: "board", board: t.boardId });
    }
    function mo() {
      s = void 0, w.value && Tl(w.value), O.value = "", A.value = "";
    }
    xe(() => t.boardId, () => {
      s = void 0, Ye(), P.value = [], p.value = void 0, w.value = void 0, x.value = void 0, T.value = {}, Ve.value.clear(), y.value = /* @__PURE__ */ new Set(["Fields"]), i.value = "Fields", L.value = !1, S.value = !0, Ze(!0);
    });
    let Ul = () => {
    };
    return xe(() => t.boardId, (ee) => {
      Ul(), Ul = Mo(`component.${ee}`, () => {
        Ze();
      });
    }, { immediate: !0 }), go(Ze), Ia(() => {
      Ul(), h(), C();
    }), (ee, K) => (c(), g("section", {
      class: ft(["work-settings-shell", { "work-embedded": e.embedded }])
    }, [
      b(Gc, {
        board: x.value,
        embedded: e.embedded,
        generation: p.value?.generation,
        authorized: L.value,
        dirty: W.value,
        busy: U.value,
        "checking-removal": pe.value,
        reviewed: Te.value,
        pack: p.value?.pack,
        "pack-title": pt.value,
        outdated: p.value?.outdated,
        "upgrade-reason": Cl.value,
        "can-upgrade": st.value && !W.value && !U.value && !St.value && L.value,
        onUpgrade: ll,
        onInstall: K[0] || (K[0] = (te) => n.value = !0),
        disabled: !W.value || U.value || pe.value || St.value || J.value || !!Ve.value.size || Te.value && !Ne.value,
        onBack: vo,
        onDiscard: mo,
        onPrimary: K[1] || (K[1] = (te) => Te.value ? uo() : El()),
        onSaved: K[2] || (K[2] = (te) => Ze())
      }, null, 8, ["board", "embedded", "generation", "authorized", "dirty", "busy", "checking-removal", "reviewed", "pack", "pack-title", "outdated", "upgrade-reason", "can-upgrade", "disabled"]),
      L.value && p.value ? (c(), g("div", yv, [
        d("div", gv, [
          b(r(Bo), {
            value: i.value,
            "onUpdate:value": K[3] || (K[3] = (te) => ro(te))
          }, {
            default: z(() => [
              b(r(jo), { "aria-label": "Settings sections" }, {
                default: z(() => [
                  (c(), g(Z, null, ae(m, (te) => b(r(qo), {
                    key: te,
                    value: te
                  }, {
                    default: z(() => [
                      M(D(te), 1)
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
      A.value ? (c(), g("div", kv, [
        M(D(A.value) + " ", 1),
        b(r(H), {
          label: "Retry",
          severity: "secondary",
          onClick: K[4] || (K[4] = (te) => Ze()),
          outlined: ""
        }, {
          icon: z(() => [
            b(r(_), {
              icon: "tabler:refresh",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        })
      ])) : E("", !0),
      F.value ? (c(), g("p", wv, [
        M(D(F.value), 1),
        b(r(H), {
          label: "Reload packs",
          severity: "secondary",
          outlined: "",
          onClick: K[5] || (K[5] = (te) => na())
        }, {
          icon: z(() => [
            b(r(_), { icon: "tabler:refresh" })
          ]),
          _: 1
        })
      ])) : E("", !0),
      O.value ? (c(), g("p", Vv, D(O.value), 1)) : E("", !0),
      S.value ? (c(), g("p", $v, "Loading settings…")) : !L.value && !A.value ? (c(), g("p", xv, "Board administrator access is required.")) : E("", !0),
      L.value && p.value ? (c(), g("div", Cv, [
        J.value ? (c(), g("div", Sv, "The board advances to generation " + D(w.value?.generation) + " while you edit. Your draft keeps generation " + D(p.value.generation) + ". Discard to load the latest schema before reviewing again.", 1)) : E("", !0),
        St.value ? (c(), g("div", Tv, [
          d("p", null, [
            K[18] || (K[18] = M("Migration pending", -1)),
            w.value?.migration_error ? (c(), g("span", Ev, ": " + D(w.value.migration_error), 1)) : E("", !0)
          ]),
          b(r(H), {
            label: "Resume migration",
            severity: "secondary",
            disabled: U.value,
            onClick: co,
            outlined: ""
          }, {
            icon: z(() => [
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
          ref: De,
          onSubmit: be(El, ["prevent"])
        }, [
          (c(), g("fieldset", {
            key: ke.value,
            class: "work-settings-fieldset",
            disabled: U.value || pe.value,
            inert: U.value || pe.value || void 0
          }, [
            y.value.has("Fields") ? Qe((c(), q(Ts, {
              key: 0,
              "board-id": e.boardId,
              "installed-types": X.value?.installed_types,
              draft: I.value,
              "guard-removal": al,
              issues: ce.value,
              onValidity: K[6] || (K[6] = (te, ye) => Tt("fields:" + te, ye))
            }, null, 8, ["board-id", "installed-types", "draft", "issues"])), [
              [ut, i.value === "Fields"]
            ]) : E("", !0),
            y.value.has("Item types") ? Qe((c(), q(Ks, {
              key: 1,
              draft: I.value,
              "guard-removal": al,
              issues: ce.value
            }, null, 8, ["draft", "issues"])), [
              [ut, i.value === "Item types"]
            ]) : E("", !0),
            y.value.has("Process") ? Qe((c(), q(mu, {
              key: 2,
              "board-id": e.boardId,
              draft: I.value,
              "guard-removal": al,
              issues: ce.value,
              onValidity: K[7] || (K[7] = (te, ye) => Tt("process:" + te, ye))
            }, null, 8, ["board-id", "draft", "issues"])), [
              [ut, i.value === "Process"]
            ]) : E("", !0),
            y.value.has("Policy") ? Qe((c(), q(Ru, {
              key: 3,
              draft: I.value,
              onValidity: K[8] || (K[8] = (te, ye) => Tt("policy:" + te, ye))
            }, null, 8, ["draft"])), [
              [ut, i.value === "Policy"]
            ]) : E("", !0),
            y.value.has("Relation types") ? Qe((c(), q(Ju, {
              key: 4,
              draft: I.value,
              "guard-removal": al
            }, null, 8, ["draft"])), [
              [ut, i.value === "Relation types"]
            ]) : E("", !0),
            y.value.has("Plugins") ? Qe((c(), q(Ea, {
              key: 5,
              "board-id": e.boardId,
              draft: I.value,
              schema: w.value ?? p.value,
              options: X.value?.schema_options.plugins ?? [],
              configs: T.value,
              disabled: U.value,
              onConfigured: K[9] || (K[9] = (te) => {
                rt(), Ze();
              }),
              onRefresh: K[10] || (K[10] = (te) => Ze()),
              onValidity: K[11] || (K[11] = (te, ye) => Tt("plugin:" + te, ye))
            }, null, 8, ["board-id", "draft", "schema", "options", "configs", "disabled"])), [
              [ut, i.value === "Plugins"]
            ]) : E("", !0),
            y.value.has("Policy") ? Qe((c(), g("section", Dv, [
              b(wc, {
                "board-id": e.boardId,
                draft: I.value,
                onValidity: K[12] || (K[12] = (te) => Tt("visibility", te))
              }, null, 8, ["board-id", "draft"])
            ], 512)), [
              [ut, i.value === "Policy"]
            ]) : E("", !0)
          ], 8, Uv))
        ], 544),
        i.value === "Review" && !B.value ? (c(), q(bu, {
          key: 2,
          draft: I.value,
          original: p.value.declaration,
          disabled: U.value || pe.value
        }, null, 8, ["draft", "original", "disabled"])) : E("", !0),
        i.value === "Review" && B.value && fe.value.length ? (c(), q(Ea, {
          key: 3,
          "board-id": e.boardId,
          draft: { plugins: fe.value },
          schema: w.value ?? p.value,
          options: X.value?.schema_options.plugins.filter((te) => fe.value.some((ye) => ye.use === te.plugin)) ?? [],
          configs: T.value,
          disabled: U.value,
          "activation-locked": "",
          onValidity: K[13] || (K[13] = (te, ye) => Tt("pack-plugin:" + te, ye))
        }, null, 8, ["board-id", "draft", "schema", "options", "configs", "disabled"])) : E("", !0),
        i.value === "Review" ? (c(), q(dv, {
          key: 4,
          declaration: R.value?.declaration,
          plan: $.value,
          generation: p.value.generation,
          follows: no.value,
          "config-count": Object.keys(T.value).length,
          "pack-review": !!V.value
        }, {
          default: z(() => [
            V.value && B.value ? (c(), q(hv, {
              key: 0,
              plan: V.value,
              request: B.value,
              original: p.value.declaration,
              disabled: U.value,
              onChange: K[14] || (K[14] = (te) => {
                le.value = void 0, N.value = "";
              })
            }, null, 8, ["plan", "request", "original", "disabled"])) : E("", !0)
          ]),
          _: 1
        }, 8, ["declaration", "plan", "generation", "follows", "config-count", "pack-review"])) : E("", !0),
        i.value === "Review" && !$.value ? (c(), g("p", Iv, "Review your draft to see the changes, their impact and any migration required.")) : E("", !0),
        pe.value ? (c(), g("p", Av, "Checking existing values and dependencies…")) : E("", !0)
      ])) : E("", !0),
      L.value ? (c(), q(Fa, {
        key: 7,
        visible: n.value,
        label: "Install pack",
        busy: U.value,
        onClose: K[17] || (K[17] = (te) => n.value = !1)
      }, {
        default: z(() => [
          d("form", {
            class: "work-dialog-box work-stack",
            onSubmit: be(Bt, ["prevent"])
          }, [
            K[20] || (K[20] = d("h2", null, "Install a pack", -1)),
            K[21] || (K[21] = d("p", { class: "work-muted work-small" }, "Packs can be installed on an empty board. Review checks whether this board is eligible.", -1)),
            d("label", Pv, [
              K[19] || (K[19] = M("Pack", -1)),
              b(r(oe), {
                modelValue: u.value,
                "onUpdate:modelValue": K[15] || (K[15] = (te) => u.value = te),
                "aria-label": "Pack to install",
                appendTo: "self",
                optionLabel: "title",
                optionValue: "id",
                optionDisabled: "disabled",
                options: P.value.map((te) => ({ ...te, disabled: te.plugins.some((ye) => !ye.installed) }))
              }, null, 8, ["modelValue", "options"])
            ]),
            P.value.length ? E("", !0) : (c(), g("p", Rv, "No available packs were found.")),
            d("footer", Ov, [
              b(r(H), {
                label: "Cancel",
                severity: "secondary",
                outlined: "",
                onClick: K[16] || (K[16] = (te) => n.value = !1)
              }),
              b(r(H), {
                type: "submit",
                label: "Review pack",
                disabled: !u.value || U.value || W.value
              }, null, 8, ["disabled"])
            ])
          ], 32)
        ]),
        _: 1
      }, 8, ["visible", "busy"])) : E("", !0)
    ], 2));
  }
}), Mv = /* @__PURE__ */ ue({
  __name: "SettingsRoot",
  setup(e) {
    const l = ko(), t = wo();
    return yo(za, (a) => t("navigate", { route: Ho(a) })), (a, o) => (c(), q(Nv, {
      "board-id": r(l).boardId ?? "",
      embedded: r(l).embedded,
      onDirtyChange: o[0] || (o[0] = (s) => r(t)("dirty-change", { dirty: s }))
    }, null, 8, ["board-id", "embedded"]));
  }
}), Fv = Vo(Mv, {
  type: "object",
  properties: {
    "board-id": { type: "string", default: "", description: "Board to administer." },
    embedded: { type: "boolean", default: !1, description: "Fits in a System detail pane." }
  }
});
Lo(import.meta.url, Fv);
//# sourceMappingURL=settings.js.map
