import { inject as co, defineComponent as ve, ref as z, useSlots as vo, openBlock as c, createElementBlock as g, createElementVNode as r, createVNode as b, normalizeClass as mt, unref as s, withCtx as L, renderSlot as We, toDisplayString as A, createCommentVNode as E, createBlock as F, withDirectives as Qe, vShow as rt, computed as G, watch as Ce, onMounted as kl, onUnmounted as Ta, resolveComponent as Ea, Fragment as H, renderList as ee, createTextVNode as M, resolveDynamicComponent as Fl, onBeforeUnmount as ft, useId as Xl, withKeys as Ae, withModifiers as be, normalizeStyle as mo, watchEffect as Ua, nextTick as fo, provide as po } from "vue";
import { Icon as J } from "@iconify/vue";
import { on as bo, host as ho, define as yo } from "@wippy-fe/proxy";
import "pinia";
import { e as vt, u as go, b as ko, c as wo, a as Vo } from "./mount-DyrlIXV_.js";
import te from "primevue/select";
import { m as Bl, e as na, s as he, f as $o, t as je, p as Ut, d as Jl, g as Dt, r as sa, w as $t, l as jl, h as Ke, i as Ct, b as lt, u as Da, j as Ia, k as Zl, n as Aa, o as ge, q as wl, v as _t, x as xo, y as Pa, z as Vt, A as Co, _ as Ra, B as So, C as To, D as ra, E as gt, F as Eo, G as da, H as Uo, I as ua, J as Do, K as ca, L as Io, a as Ao, M as va, N as Po, O as Ro } from "./latestRequest-Or3M4zVa.js";
import Y from "primevue/button";
import Re from "primevue/tag";
import ze from "primevue/toggleswitch";
import Mt from "primevue/checkbox";
import re from "primevue/inputtext";
import ml from "primevue/textarea";
import Ge from "primevue/inputnumber";
import Ql from "primevue/selectbutton";
import Oo from "primevue/chip";
import No from "primevue/tabs";
import Mo from "primevue/tablist";
import Lo from "primevue/tab";
import zo from "primevue/message";
const Dl = (e, l) => e.x > l.x && e.x < l.x + l.width && e.y > l.y && e.y < l.y + l.height;
function Fo(e, l, t) {
  return e.x === l.x ? e.x > t.x && e.x < t.x + t.width && Math.max(e.y, l.y) > t.y && Math.min(e.y, l.y) < t.y + t.height : e.y > t.y && e.y < t.y + t.height && Math.max(e.x, l.x) > t.x && Math.min(e.x, l.x) < t.x + t.width;
}
function bt(e, l, t) {
  const a = [.../* @__PURE__ */ new Set([e.x, l.x, ...t.flatMap(($) => [$.x, $.x + $.width])])].sort(($, I) => $ - I), o = [.../* @__PURE__ */ new Set([e.y, l.y, ...t.flatMap(($) => [$.y, $.y + $.height])])].sort(($, I) => $ - I);
  a.unshift(a[0] - 24), a.push(a.at(-1) + 24), o.unshift(o[0] - 24), o.push(o.at(-1) + 24);
  const d = a.length, v = o.indexOf(l.y) * d + a.indexOf(l.x), m = o.indexOf(e.y) * d + a.indexOf(e.x), f = ($) => ({ x: a[$ % d], y: o[Math.floor($ / d)] }), i = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map(), u = [];
  function y($) {
    u.push($);
    let I = u.length - 1;
    for (; I; ) {
      const T = I - 1 >> 1;
      if (u[T].priority <= $.priority) break;
      u[I] = u[T], I = T;
    }
    u[I] = $;
  }
  function p() {
    const $ = u[0], I = u.pop();
    if (u.length) {
      let T = 0;
      for (; T * 2 + 1 < u.length; ) {
        let D = T * 2 + 1;
        if (D + 1 < u.length && u[D + 1].priority < u[D].priority && D++, I.priority <= u[D].priority) break;
        u[T] = u[D], T = D;
      }
      u[T] = I;
    }
    return $;
  }
  const w = ($) => Math.abs($.x - l.x) + Math.abs($.y - l.y);
  for (const $ of [0, 1]) {
    const I = m * 2 + $;
    i.set(I, 0), y({ key: I, cost: 0, priority: w(e) });
  }
  const S = /* @__PURE__ */ new Map(), U = /* @__PURE__ */ new Map();
  for (; u.length; ) {
    const $ = p(), I = Math.floor($.key / 2), T = $.key % 2;
    if ($.cost !== i.get($.key)) continue;
    if (I === v) {
      const Z = [];
      let de = $.key;
      for (; de !== void 0; )
        Z.push(f(Math.floor(de / 2))), de = n.get(de);
      return Oa(Z.reverse());
    }
    const D = f(I), V = I % d, P = Math.floor(I / d);
    for (const [Z, de] of [[V > 0 ? I - 1 : -1, 0], [V + 1 < d ? I + 1 : -1, 0], [P > 0 ? I - d : -1, 1], [P + 1 < o.length ? I + d : -1, 1]]) {
      if (Z < 0) continue;
      const ne = f(Z);
      if (S.has(Z) || S.set(Z, !t.some((x) => Dl(ne, x))), !S.get(Z)) continue;
      const B = `${Math.min(I, Z)}:${Math.max(I, Z)}`;
      if (U.has(B) || U.set(B, !t.some((x) => Fo(D, ne, x))), !U.get(B)) continue;
      const O = $.cost + Math.abs(D.x - ne.x) + Math.abs(D.y - ne.y) + (T === de ? 0 : 18), oe = Z * 2 + de;
      O >= (i.get(oe) ?? 1 / 0) || (i.set(oe, O), n.set(oe, $.key), y({ key: oe, cost: O, priority: O + w(ne) }));
    }
  }
  throw new Error("Process map has no collision-free route between its ports: " + JSON.stringify({ start: e, end: l, startInside: t.filter(($) => Dl(e, $)), endInside: t.filter(($) => Dl(l, $)) }));
}
function Oa(e) {
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
    for (let d = 0; d < o.length; d += l) {
      const v = o.slice(d, d + l);
      a && a.length + v.length + 1 > l && (t.push(a), a = ""), a = a ? a + " " + v : v;
    }
  return [...t, a].filter(Boolean);
}
function ol(e) {
  if (e = Oa(e), !e.length) return "";
  let l = `M ${e[0].x} ${e[0].y}`;
  for (let a = 1; a < e.length - 1; a++) {
    const o = e[a - 1], d = e[a], v = e[a + 1], m = Math.hypot(d.x - o.x, d.y - o.y), f = Math.hypot(v.x - d.x, v.y - d.y), i = Math.min(8, m / 3, f / 3);
    i && (l += ` L ${d.x + (o.x - d.x) * i / m} ${d.y + (o.y - d.y) * i / m} Q ${d.x} ${d.y} ${d.x + (v.x - d.x) * i / f} ${d.y + (v.y - d.y) * i / f}`);
  }
  const t = e.at(-1);
  return l + ` L ${t.x} ${t.y}`;
}
function Bo(e, l = {}, t = { width: 1400, height: 480 }) {
  const a = t.width < 750 || Bl(e).length > 8 ? "TB" : "LR", o = new na.graphlib.Graph({ multigraph: !0 });
  o.setGraph({ rankdir: a, ranker: "network-simplex", acyclicer: "greedy", nodesep: 32, edgesep: 32, ranksep: 24, marginx: 32, marginy: 32 }), o.setDefaultEdgeLabel(() => ({}));
  const d = Bl(e), v = new Map(d.map((h, C) => [h.id, C])), m = e.states.map((h) => {
    const C = (e.transitions ?? []).filter((Te) => Te.from === "any" && Te.to === h.id), k = Ot(he(h)), j = Ot($o(h, e)), K = C.flatMap((Te) => Ot(je(Te) + " works from any state")), se = l.policy?.wip?.[h.id]?.limit, fe = se === void 0 ? 0 : jt(" · limit " + se), Se = Math.max(168, ...k.map((Te) => jt(Te) + 58), ...j.map((Te, pt) => jt(Te) + 32 + (pt === j.length - 1 ? fe : 0)), ...K.map((Te) => jt(Te) + 32)), Ne = Math.max(80, 42 + k.length * 18 + j.length * 16 + K.length * 18);
    return o.setNode(h.id, { width: Se + (a === "LR" ? 36 : 0), height: Ne + (a === "TB" ? 36 : 0) }), { state: h, x: 0, y: 0, width: Se, height: Ne, title: k, caption: j, badges: C, row: v.has(h.id) ? 0 : 1 };
  }), f = new Set(m.map((h) => h.state.id)), i = (e.transitions ?? []).flatMap((h) => h.from === "any" ? [] : h.from.filter((C) => f.has(C) && f.has(h.to)).map((C) => {
    const k = `${h.id}-${C}`, j = Ot(je(h)), K = Math.max(72, ...j.map((fe) => jt(fe) + 24)), se = Math.max(24, j.length * 16 + 10);
    return { transition: h, from: C, key: k, lines: j, width: K, height: se };
  })), n = /* @__PURE__ */ new Set(), u = /* @__PURE__ */ new Set(), y = new Set(i.filter((h) => h.from === h.transition.to || h.transition.to === e.initial || ["completed", "canceled"].includes(m.find((C) => C.state.id === h.from).state.category)).map((h) => h.key));
  function p(h) {
    if (!u.has(h)) {
      n.add(h);
      for (const C of i.filter((k) => k.from === h))
        y.has(C.key) || (n.has(C.transition.to) ? y.add(C.key) : p(C.transition.to));
      n.delete(h), u.add(h);
    }
  }
  p(e.initial);
  for (const h of m) p(h.state.id);
  for (const h of i) if (!y.has(h.key)) {
    const C = v.get(h.from), k = v.get(h.transition.to);
    o.setEdge(h.from, h.transition.to, { width: h.width, height: h.height, labelpos: "c", weight: C !== void 0 && k === C + 1 ? 100 : 1 }, h.key);
  }
  for (const h of e.transitions ?? []) if (h.from === "any" && f.has(e.initial) && f.has(h.to) && !v.has(h.to)) {
    const C = e.states.find((k) => k.id === h.to);
    o.setEdge(e.initial, h.to, { minlen: ["completed", "canceled"].includes(C.category) ? Math.max(1, d.length - 1) : 1 }, `any:${h.id}`);
  }
  const w = e.states.flatMap((h) => (h.regions ?? []).filter((C) => f.has(C.initial)).map((C, k) => {
    const j = `lane:${h.id}:${k}`;
    return o.setEdge(h.id, C.initial, {}, j), { state: h, region: C, key: j };
  }));
  if (!m.length) return { nodes: m, edges: [], parallels: [], main: d, direction: a, width: 320, height: 160 };
  na.layout(o);
  for (const h of m) Object.assign(h, { x: o.node(h.state.id).x, y: o.node(h.state.id).y });
  const S = a === "TB", U = i.filter((h) => !y.has(h.key)).map((h) => o.edge({ v: h.from, w: h.transition.to, name: h.key })), $ = [...m, ...U], I = Math.max(...$.map((h) => h.x + h.width / 2)), T = Math.max(...$.map((h) => h.y + h.height / 2)), D = (h) => m.find((C) => C.state.id === h), V = i.filter((h) => y.has(h.key)).sort((h, C) => {
    const k = S ? "y" : "x";
    return Math.abs(D(h.from)[k] - D(h.transition.to)[k]) - Math.abs(D(C.from)[k] - D(C.transition.to)[k]);
  }), P = /* @__PURE__ */ new Map(), Z = Math.max(0, ...V.map((h) => h.width));
  let de = T + 32;
  for (const [h, C] of V.entries()) {
    const k = D(C.from), j = D(C.transition.to), K = S ? I + 16 + Z + 28 + h * 18 : de + C.height / 2, se = S ? I + 16 + Z / 2 : (k.x + j.x) / 2;
    let fe = S ? k.y + k.height / 2 + 18 : K;
    if (S) for (const Se of [...P.values()].sort((Ne, Te) => Ne.y - Te.y))
      fe + C.height / 2 + 10 > Se.y - Se.height / 2 - 10 && fe - C.height / 2 - 10 < Se.y + Se.height / 2 + 10 && (fe = Se.y + Se.height / 2 + 24 + C.height / 2);
    P.set(C.key, { x: se, y: fe, corridor: K, height: C.height }), de = K + C.height / 2 + 24;
  }
  const ne = i.map((h) => ({ ...h, ...P.get(h.key) ?? o.edge({ v: h.from, w: h.transition.to, name: h.key }) })), B = (h, C) => ({ x: h.x - h.width / 2 - C, y: h.y - h.height / 2 - C, width: h.width + C * 2, height: h.height + C * 2 }), O = [...m.map((h) => B(h, 12)), ...ne.map((h) => B(h, 10))], oe = (h, C) => ({
    start: S ? { x: h.x, y: h.y + h.height / 2 } : { x: h.x + h.width / 2, y: h.y },
    end: S ? { x: C.x, y: C.y - C.height / 2 } : { x: C.x - C.width / 2, y: C.y }
  }), x = (h, C) => S ? { x: h.x, y: h.y + C } : { x: h.x + C, y: h.y }, R = ne.map((h) => {
    const C = m.find((Ye) => Ye.state.id === h.from), k = m.find((Ye) => Ye.state.id === h.transition.to), { start: j, end: K } = oe(C, k), se = y.has(h.key), fe = x(j, 18), Se = x(K, -18), Ne = (se || !S ? h.width : h.height) / 2 + 10, Te = se ? { x: h.x + (S ? -Ne : Ne), y: h.y } : x(h, -Ne), pt = se ? { x: h.x + (S ? Ne : -Ne), y: h.y } : x(h, Ne);
    let it;
    if (se) {
      const { corridor: Ye } = P.get(h.key), ll = S ? { x: Ye, y: h.y } : { x: fe.x, y: Ye }, Bt = S ? { x: Ye, y: Se.y } : { x: Se.x, y: Ye };
      it = S ? [
        [j, ...bt(fe, Te, O)],
        [pt, ll, Bt, ...bt(Bt, Se, O), K]
      ] : [
        [j, ...bt(fe, ll, O), Te],
        [pt, ...bt(Bt, Se, O), K]
      ];
    } else it = [
      [j, ...bt(fe, Te, O)],
      [...bt(pt, Se, O), K]
    ];
    const Cl = se ? "return" : v.get(h.transition.to) === (v.get(h.from) ?? -2) + 1 ? "main" : "forward";
    return { ...h, points: it.flat(), segments: it, path: it.map(ol).join(" "), type: Cl, targetOffset: 0 };
  }), N = w.map((h) => {
    const C = m.find((fe) => fe.state.id === h.state.id), k = m.find((fe) => fe.state.id === h.region.initial), { start: j, end: K } = oe(C, k), se = [j, ...bt(x(j, 18), x(K, -18), O), K];
    return { state: h.state, key: h.key, points: se, path: ol(se) };
  }), X = [...m.flatMap((h) => [{ x: h.x - h.width / 2, y: h.y - h.height / 2 }, { x: h.x + h.width / 2, y: h.y + h.height / 2 }]), ...R.flatMap((h) => [...h.points, { x: h.x - h.width / 2, y: h.y - h.height / 2 }, { x: h.x + h.width / 2, y: h.y + h.height / 2 }]), ...N.flatMap((h) => h.points)], ue = 32 - Math.min(...X.map((h) => h.x)), pe = 32 - Math.min(...X.map((h) => h.y)), ke = Math.max(...X.map((h) => h.x)) + ue + 32, Ve = Math.max(...X.map((h) => h.y)) + pe + 32, De = (h) => ({ x: h.x + ue, y: h.y + pe });
  for (const h of m) Object.assign(h, De(h));
  for (const h of R)
    Object.assign(h, De(h)), h.segments = h.segments.map((C) => C.map(De)), h.points = h.segments.flat(), h.path = h.segments.map(ol).join(" ");
  for (const h of N)
    h.points = h.points.map(De), h.path = ol(h.points);
  return { nodes: m, edges: R, parallels: N, main: d, direction: a, width: ke, height: Ve };
}
const Na = Symbol("work-navigation");
function jo() {
  return co(Na, () => {
  });
}
function qo(e) {
  if (e.name === "boards") return "";
  const l = encodeURIComponent(e.board);
  return e.name === "settings" ? `${l}/settings` : l;
}
const It = (e) => `/api/v1/work/boards/${encodeURIComponent(e)}`, ma = (e) => ({ declaration: e.declaration, expected_generation: e.expected_generation, plugin_configs: e.plugin_configs }), kt = {
  packPlan: (e, l) => Ut(`${It(e)}/pack_plan`, l, "Pack plan"),
  packApply: (e, l, t) => Ut(`${It(e)}/pack_apply`, { ...l, key: t }, "Apply pack"),
  plan: (e, l) => Ut(`${It(e)}/plan_schema`, ma(l), "Schema plan"),
  apply: (e, l, t) => Ut(`${It(e)}/apply_schema`, { ...ma(l), key: t }, "Apply schema"),
  resume: (e) => Ut(`${It(e)}/resume_migration`, {}, "Resume migration"),
  configure: (e, l, t) => Ut(`${It(e)}/configure_plugin`, { plugin: l, config: t }, "Configure plugin")
}, Wo = { class: "work-definition" }, Ko = { class: "work-definition-head" }, Go = { class: "work-definition-affordances" }, Yo = ["title"], Ho = { class: "work-definition-code" }, Xo = ["title"], Jo = { class: "work-definition-kind" }, Zo = { class: "work-definition-flags" }, Qo = { class: "work-definition-usage" }, _o = { class: "work-definition-actions" }, ei = {
  key: 0,
  class: "work-definition-description"
}, ti = { class: "work-definition-body work-stack" }, Vl = /* @__PURE__ */ ve({
  __name: "DefinitionRow",
  props: {
    title: {},
    code: {},
    kind: {},
    description: {}
  },
  setup(e) {
    const l = z(!1), t = vo();
    return (a, o) => (c(), g("article", Wo, [
      r("header", Ko, [
        b(Jl, {
          as: "article",
          class: mt(["work-definition-toggle", { "work-definition-has-handle": s(t).handle }]),
          "aria-expanded": l.value,
          onActivate: o[0] || (o[0] = (d) => l.value = !l.value)
        }, {
          default: L(() => [
            r("span", Go, [
              We(a.$slots, "handle"),
              b(s(J), {
                icon: l.value ? "tabler:chevron-down" : "tabler:chevron-right"
              }, null, 8, ["icon"])
            ]),
            r("span", {
              class: "work-row-title",
              title: e.title
            }, A(e.title), 9, Yo)
          ]),
          _: 3
        }, 8, ["class", "aria-expanded"]),
        r("span", Ho, [
          e.code ? (c(), g("code", {
            key: 0,
            class: "work-mono",
            title: e.code
          }, A(e.code), 9, Xo)) : E("", !0)
        ]),
        r("span", Jo, [
          e.kind ? (c(), F(s(Re), {
            key: 0,
            severity: "secondary",
            value: e.kind
          }, null, 8, ["value"])) : E("", !0)
        ]),
        r("span", Zo, [
          We(a.$slots, "flags")
        ]),
        r("div", Qo, [
          We(a.$slots, "usage")
        ]),
        r("div", _o, [
          We(a.$slots, "actions")
        ]),
        e.description ? (c(), g("p", ei, A(e.description), 1)) : E("", !0)
      ]),
      Qe(r("div", ti, [
        We(a.$slots, "default")
      ], 512), [
        [rt, l.value]
      ])
    ]));
  }
}), li = { class: "work-definition-scroll" }, ai = {
  key: 0,
  class: "work-definition-columns",
  "aria-hidden": "true"
}, oi = { key: 0 }, ii = { key: 1 }, ni = {
  key: 2,
  class: "work-definition-usage"
}, $l = /* @__PURE__ */ ve({
  __name: "DefinitionList",
  props: {
    count: {},
    columns: {}
  },
  setup(e) {
    return (l, t) => (c(), g("div", li, [
      r("div", {
        class: mt(["work-field-builder", "work-definitions-" + e.columns])
      }, [
        e.count > 3 ? (c(), g("div", ai, [
          t[0] || (t[0] = r("span", null, null, -1)),
          t[1] || (t[1] = r("span", null, "Name", -1)),
          e.columns !== "plugins" ? (c(), g("span", oi, "Identifier")) : E("", !0),
          r("span", null, A(e.columns === "plugins" ? "State" : e.columns === "types" ? "Process" : "Kind"), 1),
          e.columns === "fields" || e.columns === "plugins" ? (c(), g("span", ii, "Details")) : E("", !0),
          e.columns !== "plugins" ? (c(), g("span", ni, A(e.columns === "fields" ? "Used by" : "Details"), 1)) : E("", !0),
          t[2] || (t[2] = r("span", null, null, -1))
        ])) : E("", !0),
        We(l.$slots, "default")
      ], 2)
    ]));
  }
}), si = [
  { code: "key", form: "text", index: "key" },
  { code: "type", form: "text", index: "key" },
  { code: "state", form: "text", index: "key" },
  { code: "category", form: "text", index: "key" },
  { code: "rank", form: "text", index: "key" },
  { code: "parent", form: "text", index: "key" },
  { code: "created_at", form: "time", index: "key" },
  { code: "updated_at", form: "time", index: "key" }
];
function ri(e) {
  const l = e.compiled.processes?.flatMap((t) => t.states.map((a) => ({ id: a.id, label: a.name }))) ?? [];
  return [...si.filter((t) => t.code !== "rank").map((t) => t.code === "state" ? { ...t, type: "option", options: l } : t.code === "category" ? { ...t, type: "option", options: ["triage", "backlog", "unstarted", "started", "completed", "canceled"].map((a) => ({ id: a })) } : t), ...(e.compiled.fields ?? []).filter((t) => t.index && t.index !== "none")];
}
function di(e) {
  if (e?.cardinality && e.cardinality !== "one") return ["has", "in", "nin", "is_null", ...e.type === "principal" ? ["member_of"] : []];
  const l = ["eq", "neq", "in", "nin", "is_null", ...e?.type === "principal" ? ["member_of"] : []];
  return e && (["int", "number", "dec", "time", "quantity"].includes(e.form) || e.index === "number") && l.push("lt", "lte", "gt", "gte", "between"), e?.form === "text" && e.type !== "option" && l.push("contains", "starts_with"), l;
}
const ui = { class: "work-field-control" }, ci = ["id"], vi = {
  key: 1,
  class: "work-stack work-tight"
}, mi = { class: "work-chips" }, fi = {
  key: 5,
  class: "work-row"
}, pi = ["inert"], bi = ["value"], hi = {
  key: 1,
  class: "work-muted"
}, yi = ["inert"], gi = ["value"], ki = {
  key: 1,
  class: "work-muted"
}, wi = {
  key: 11,
  class: "work-stack work-tight"
}, Vi = {
  class: "work-stack work-tight",
  "aria-label": "Matching items"
}, $i = { class: "work-mono" }, xi = {
  key: 15,
  class: "work-error work-small",
  role: "alert"
}, Ma = /* @__PURE__ */ ve({
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
    const t = e, a = l, o = G(() => t.inputId ?? `field-${t.field.code}`), d = G(() => !!t.field.cardinality && t.field.cardinality !== "one"), v = G(() => Array.isArray(t.modelValue) ? t.modelValue : []), m = G(() => t.modelValue == null ? "" : typeof t.modelValue == "object" ? Dt(t.modelValue) : String(t.modelValue)), f = G(() => {
      const C = t.modelValue;
      return C && typeof C == "object" && "ref" in C && Array.isArray(C.ref) ? String(C.ref[1] ?? "") : "";
    }), i = G(() => t.disabled || sa(t.field)), n = z(!1), u = z(!1), y = z(!1), p = z(""), w = z(""), S = z([]), U = jl(), $ = z([]);
    let I = 0, T;
    const D = /* @__PURE__ */ new Set();
    Ce(v, (C) => {
      $.value = T ?? C.map((k, j) => $.value[j] ?? I++), T = void 0;
    }, { immediate: !0 });
    function V(C) {
      a("update:modelValue", C);
    }
    function P(C, k) {
      const j = [...v.value];
      j[C] = k, V(j);
    }
    function Z(C, k) {
      k ? D.delete(C) : D.add(C), a("validity", !D.size);
    }
    function de(C) {
      D.delete($.value[C]), a("validity", !D.size), T = $.value.filter((k, j) => j !== C), V(v.value.filter((k, j) => j !== C));
    }
    function ne() {
      T = [...$.value, I++], V([...v.value, t.field.form === "bool" ? !1 : t.field.form === "record" ? {} : ""]);
    }
    function B(C) {
      const k = C.detail, j = k?.principal_id ?? k?.id;
      V(j ? { kind: k.type ?? "user", id: j } : void 0);
    }
    function O(C) {
      const k = C.detail;
      V(k?.thread_id ? { ref: ["component", k.thread_id] } : void 0);
    }
    const oe = z("");
    let x = "";
    Ce(() => t.modelValue, (C) => {
      const k = JSON.stringify(C ?? {}, null, 2);
      k !== x && (x = k, oe.value = k, p.value = "", a("validity", !0));
    }, { immediate: !0 });
    function R(C) {
      oe.value = C;
      try {
        const k = JSON.parse(C);
        if (!k || typeof k != "object" || Array.isArray(k)) throw new Error("Enter a JSON object.");
        if (t.field.type === "rich_text" && !("type" in k && typeof k.type == "string")) throw new Error("The document needs a type.");
        x = JSON.stringify(k, null, 2), p.value = "", a("validity", !0), V(k);
      } catch (k) {
        p.value = k instanceof Error ? k.message : "Invalid JSON.", a("validity", !1);
      }
    }
    function N(C) {
      if (!C) {
        a("validity", !0), V(void 0);
        return;
      }
      const k = Number.isFinite(Number(C)) && (t.field.form !== "int" || Number.isSafeInteger(Number(C)));
      a("validity", k), k && V(t.field.form === "int" ? Number(C) : C);
    }
    const X = G(() => t.field.config?.format === "date");
    function ue(C) {
      V(C ? X.value ? C : new Date(C).toISOString() : void 0);
    }
    const pe = G(() => {
      if (typeof t.modelValue != "string") return "";
      if (X.value) return t.modelValue.slice(0, 10);
      const C = new Date(t.modelValue);
      return Number.isNaN(C.getTime()) ? "" : new Date(C.getTime() - C.getTimezoneOffset() * 6e4).toISOString().slice(0, 16);
    });
    function ke(C) {
      V(C.detail?.ref);
    }
    function Ve(C) {
      V(C.detail?.value);
    }
    let De;
    Ce(w, () => {
      const C = U();
      if (clearTimeout(De), !w.value.trim()) {
        S.value = [];
        return;
      }
      De = setTimeout(async () => {
        try {
          const k = w.value.trim(), j = /^[A-Z][A-Z0-9]{1,9}-[0-9]+$/.test(k) ? [(await $t.item(t.boardId, { key: k })).item] : (await $t.query(t.boardId, { where: { field: "title", op: "contains", value: k }, limit: 8 })).items;
          C() && (S.value = j, p.value = "");
        } catch (k) {
          C() && (p.value = k instanceof Error ? k.message : "Could not search items.");
        }
      }, 200);
    });
    function h(C) {
      V({ board: t.boardId, item: C.id }), w.value = "", S.value = [];
    }
    kl(async () => {
      t.field.type === "principal" ? n.value = await vt("wc-principal-picker") : t.field.config?.target === "component" && (n.value = await vt("wc-component-picker"));
    });
    for (const [C, k] of [[() => t.editorTag, y], [() => t.linkTag, u]])
      Ce(C, async (j, K, se) => {
        let fe = !0;
        if (se(() => {
          fe = !1;
        }), k.value = !1, j) {
          const Se = await vt(j);
          fe && (k.value = Se);
        }
      }, { immediate: !0 });
    return Ta(() => {
      clearTimeout(De), U();
    }), (C, k) => {
      const j = Ea("FieldControl", !0);
      return c(), g("div", ui, [
        s(sa)(e.field) ? (c(), g("output", {
          key: 0,
          id: o.value,
          class: "work-read-value"
        }, A(s(Dt)(e.modelValue, e.field)), 9, ci)) : d.value ? (c(), g("div", vi, [
          r("div", mi, [
            (c(!0), g(H, null, ee(v.value, (K, se) => (c(), F(s(Re), {
              key: $.value[se],
              class: "kx-tag-sm",
              severity: "secondary"
            }, {
              default: L(() => [
                M(A(s(Dt)(K, e.field)) + " ", 1),
                b(s(Y), {
                  type: "button",
                  class: "work-icon-button",
                  disabled: i.value,
                  "aria-label": "Remove value " + (se + 1),
                  onClick: (fe) => de(se),
                  severity: "secondary",
                  text: "",
                  size: "small"
                }, {
                  default: L(() => [
                    b(s(J), {
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
          (c(!0), g(H, null, ee(v.value, (K, se) => (c(), g("div", {
            key: $.value[se],
            class: "work-stack work-tight"
          }, [
            b(j, {
              "board-id": e.boardId,
              field: { ...e.field, cardinality: "one" },
              "model-value": K,
              "input-id": o.value + "-" + $.value[se],
              disabled: i.value,
              "editor-tag": e.editorTag,
              "link-tag": e.linkTag,
              "onUpdate:modelValue": (fe) => P(se, fe),
              onValidity: (fe) => Z($.value[se], fe)
            }, null, 8, ["board-id", "field", "model-value", "input-id", "disabled", "editor-tag", "link-tag", "onUpdate:modelValue", "onValidity"])
          ]))), 128)),
          b(s(Y), {
            label: "Add value",
            severity: "secondary",
            size: "small",
            disabled: i.value,
            onClick: ne,
            outlined: ""
          }, {
            icon: L(() => [
              b(s(J), {
                icon: "tabler:plus",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled"])
        ])) : e.editorTag && y.value ? (c(), F(Fl(e.editorTag), {
          key: 2,
          "board-id": e.boardId,
          value: JSON.stringify(e.modelValue ?? null),
          config: JSON.stringify(e.field.config ?? {}),
          readonly: i.value || void 0,
          onChange: Ve
        }, null, 40, ["board-id", "value", "config", "readonly"])) : e.linkTag && u.value ? (c(), F(Fl(e.linkTag), {
          key: 3,
          "board-id": e.boardId,
          kind: e.field.config?.target ?? e.field.type,
          value: JSON.stringify(e.modelValue ?? null),
          readonly: i.value || void 0,
          onChange: ke
        }, null, 40, ["board-id", "kind", "value", "readonly"])) : e.field.type === "option" ? (c(), F(s(te), {
          key: 4,
          placeholder: "Not set",
          inputId: o.value,
          "model-value": e.modelValue ?? "",
          disabled: i.value,
          "onUpdate:modelValue": k[0] || (k[0] = (K) => V(K || void 0)),
          appendTo: "self",
          optionLabel: "label",
          optionValue: "value",
          optionDisabled: "disabled",
          options: [{ label: "Not set", value: "", disabled: !1 }, ...(e.field.options ?? []).map((K) => ({ label: K.label ?? K.id, value: K.id, disabled: !1 }))]
        }, null, 8, ["inputId", "model-value", "disabled", "options"])) : e.field.form === "bool" ? (c(), g("label", fi, [
          b(s(Mt), {
            inputId: o.value,
            "model-value": e.modelValue === !0,
            disabled: i.value,
            "onUpdate:modelValue": k[1] || (k[1] = (K) => V(K)),
            binary: ""
          }, null, 8, ["inputId", "model-value", "disabled"]),
          M(A(e.modelValue === !0 ? "Yes" : e.modelValue === !1 ? "No" : "Not set"), 1)
        ])) : e.field.form === "int" ? (c(), F(s(Ge), {
          key: 6,
          inputId: o.value,
          "model-value": m.value === "" ? null : Number(m.value),
          disabled: i.value,
          "onUpdate:modelValue": k[2] || (k[2] = (K) => N(K == null ? "" : String(K))),
          useGrouping: !1
        }, null, 8, ["inputId", "model-value", "disabled"])) : e.field.form === "dec" ? (c(), F(s(re), {
          key: 7,
          id: o.value,
          inputmode: "decimal",
          "model-value": m.value,
          disabled: i.value,
          "onUpdate:modelValue": k[3] || (k[3] = (K) => N(K ?? ""))
        }, null, 8, ["id", "model-value", "disabled"])) : e.field.form === "time" ? (c(), F(s(re), {
          key: 8,
          id: o.value,
          type: X.value ? "date" : "datetime-local",
          value: pe.value,
          disabled: i.value,
          onInput: k[4] || (k[4] = (K) => ue(K.target.value))
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
          }, null, 40, bi)) : (c(), g("span", hi, A(s(Dt)(e.modelValue, e.field)) + " · Person picker is unavailable.", 1))
        ], 8, pi)) : e.field.config?.target === "component" ? (c(), g("div", {
          key: 10,
          inert: i.value || void 0
        }, [
          n.value ? (c(), g("wc-component-picker", {
            key: 0,
            value: JSON.stringify({ thread_id: f.value }),
            onChange: O
          }, null, 40, gi)) : (c(), g("span", ki, "Component picker is unavailable."))
        ], 8, yi)) : e.field.type === "item" ? (c(), g("div", wi, [
          b(s(Re), {
            class: "kx-tag-sm",
            severity: "secondary"
          }, {
            default: L(() => [
              M(A(s(Dt)(e.modelValue, e.field)), 1)
            ]),
            _: 1
          }),
          b(s(re), {
            id: o.value,
            modelValue: w.value,
            "onUpdate:modelValue": k[5] || (k[5] = (K) => w.value = K),
            disabled: i.value,
            placeholder: "Search a title or enter an item key",
            "aria-label": "Search items"
          }, null, 8, ["id", "modelValue", "disabled"]),
          r("div", Vi, [
            (c(!0), g(H, null, ee(S.value, (K) => (c(), F(Jl, {
              key: K.id,
              class: "work-match-item",
              disabled: i.value,
              onActivate: (se) => h(K)
            }, {
              default: L(() => [
                r("code", $i, A(K.key), 1),
                r("span", null, A(s(Dt)(K.values.title)), 1)
              ]),
              _: 2
            }, 1032, ["disabled", "onActivate"]))), 128))
          ]),
          e.modelValue ? (c(), F(s(Y), {
            key: 0,
            label: "Clear reference",
            severity: "secondary",
            size: "small",
            disabled: i.value,
            onClick: k[6] || (k[6] = (K) => V(void 0)),
            outlined: ""
          }, {
            icon: L(() => [
              b(s(J), {
                icon: "tabler:list-check",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled"])) : E("", !0)
        ])) : e.field.form === "record" || e.field.type === "rich_text" || e.field.form === "quantity" || e.field.form === "ref" ? (c(), F(s(ml), {
          key: 12,
          id: o.value,
          "model-value": oe.value,
          rows: "3",
          disabled: i.value,
          "aria-invalid": !!p.value,
          "onUpdate:modelValue": k[7] || (k[7] = (K) => R(K ?? ""))
        }, null, 8, ["id", "model-value", "disabled", "aria-invalid"])) : e.field.code === "description" ? (c(), F(s(ml), {
          key: 13,
          id: o.value,
          "model-value": m.value,
          rows: "4",
          disabled: i.value,
          "onUpdate:modelValue": k[8] || (k[8] = (K) => V(K))
        }, null, 8, ["id", "model-value", "disabled"])) : (c(), F(s(re), {
          key: 14,
          id: o.value,
          "model-value": m.value,
          disabled: i.value,
          "onUpdate:modelValue": k[9] || (k[9] = (K) => V(K))
        }, null, 8, ["id", "model-value", "disabled"])),
        p.value ? (c(), g("span", xi, A(p.value), 1)) : E("", !0)
      ]);
    };
  }
}), Ci = { class: "work-stack work-tight work-operand-control" }, Si = { class: "work-row work-small" }, Ti = {
  key: 1,
  class: "work-muted work-small"
}, Ei = {
  key: 2,
  class: "work-stack work-tight"
}, Ui = { class: "work-small" }, Di = {
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
    const t = e, a = l, o = G(() => "$actor" in Ke(t.modelValue) ? "actor" : "$now" in Ke(t.modelValue) ? "now" : "literal"), d = z(""), v = z("");
    Ce(() => t.modelValue, (i) => {
      d.value = JSON.stringify(i ?? []), v.value = "";
    }, { immediate: !0 });
    function m(i) {
      a("update:modelValue", i === "actor" ? { $actor: "id" } : i === "now" ? { $now: "P0D" } : void 0), a("validity", !0);
    }
    function f(i) {
      d.value = i;
      try {
        const n = JSON.parse(i);
        if (!Array.isArray(n)) throw new Error("Enter a JSON list.");
        v.value = "", a("validity", !0), a("update:modelValue", n);
      } catch (n) {
        v.value = n instanceof Error ? n.message : "Invalid values.", a("validity", !1);
      }
    }
    return (i, n) => (c(), g("div", Ci, [
      r("label", Si, [
        M(A(e.label), 1),
        b(s(te), {
          "aria-label": e.label + " operand",
          "model-value": o.value,
          disabled: e.disabled,
          "onUpdate:modelValue": n[0] || (n[0] = (u) => m(u)),
          appendTo: "self",
          optionLabel: "label",
          optionValue: "value",
          optionDisabled: "disabled",
          options: [{ label: "Value", value: "literal", disabled: !1 }, { label: "Current actor ($actor)", value: "actor", disabled: !1 }, { label: "Current time ($now)", value: "now", disabled: !1 }]
        }, null, 8, ["aria-label", "model-value", "disabled"])
      ]),
      o.value === "now" ? (c(), F(s(re), {
        key: 0,
        "aria-label": e.label + " time offset",
        value: s(Ke)(e.modelValue).$now,
        disabled: e.disabled,
        placeholder: "-P7D",
        onInput: n[1] || (n[1] = (u) => a("update:modelValue", { $now: u.target.value }))
      }, null, 8, ["aria-label", "value", "disabled"])) : o.value === "actor" ? (c(), g("span", Ti, "The signed-in actor’s id")) : e.multiple ? (c(), g("div", Ei, [
        r("label", Ui, [
          n[5] || (n[5] = M("Values as JSON (operands may appear in the list)", -1)),
          b(s(ml), {
            class: "work-mono",
            "aria-label": e.label + " values",
            value: d.value,
            disabled: e.disabled,
            rows: "2",
            onInput: n[2] || (n[2] = (u) => f(u.target.value))
          }, null, 8, ["aria-label", "value", "disabled"])
        ]),
        v.value ? (c(), g("p", Di, A(v.value), 1)) : E("", !0)
      ])) : (c(), F(Ma, {
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
}), Ii = ["disabled"], Ai = { class: "work-small work-mono" }, Pi = { class: "work-row work-small" }, Ri = { class: "work-row work-wrap" }, Oi = { key: 3 }, Ni = { class: "work-row work-wrap" }, Mi = { class: "work-row" }, Li = { class: "work-row" }, zi = { class: "work-row" }, Fi = {
  key: 3,
  class: "work-row work-wrap"
}, Bi = { class: "work-row work-wrap" }, ji = /* @__PURE__ */ ve({
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
    const t = e, a = l, o = G(() => t.path ?? "where"), d = G(() => t.depth ?? 1), v = G(() => ["and", "or", "not", "history", "match", "rel", "children"].find((B) => B in t.modelValue) ?? "field"), m = G(() => ri(t.schema)), f = G(() => m.value.find((B) => B.code === t.modelValue.field) ?? { code: "value", form: "text" }), i = G(() => Ke(t.modelValue.history)), n = G(() => m.value.find((B) => B.code === i.value.field) ?? { code: "history", form: "text" }), u = G(() => Array.isArray(t.modelValue[v.value]) ? t.modelValue[v.value] : []), y = () => ({ field: "category", op: "eq", value: "unstarted" }), p = z(/* @__PURE__ */ new Set());
    function w(B, O) {
      O ? p.value.delete(B) : p.value.add(B), a("validity", p.value.size === 0);
    }
    Ce(v, () => {
      p.value.clear(), a("validity", !0);
    });
    function S(B) {
      const O = /* @__PURE__ */ new Set();
      for (const oe of p.value) {
        const x = Number(oe);
        !Number.isNaN(x) && x !== B && O.add(String(x > B ? x - 1 : x));
      }
      p.value = O, a("validity", O.size === 0), $({ [v.value]: u.value.filter((oe, x) => x !== B) });
    }
    function U(B) {
      a("update:modelValue", B);
    }
    function $(B) {
      U({ ...t.modelValue, ...B });
    }
    function I(B) {
      U(B === "field" ? y() : B === "and" || B === "or" ? { [B]: [y()] } : B === "not" ? { not: y() } : B === "history" ? { history: { field: "state", changed: !0 } } : B === "match" ? { match: "" } : B === "children" ? { children: !0, q: "some", where: y() } : { rel: t.schema.compiled.relation_types?.[0]?.id ?? "", dir: "outward", q: "some", where: y() });
    }
    function T(B, O) {
      $({ [v.value]: u.value.map((oe, x) => x === B ? O : oe) });
    }
    function D(B, O) {
      const oe = { ...i.value };
      O === void 0 ? (delete oe[B], w(B, !0)) : oe[B] = O, $({ history: oe });
    }
    function V(B) {
      p.value.clear(), a("validity", !0);
      const O = { ...i.value };
      delete O.was, delete O.changed, delete O.from, delete O.to, O[B] = B === "changed" ? !0 : "", $({ history: O });
    }
    const P = { code: "actor", form: "text" }, Z = { code: "at", form: "time" }, de = G(() => Array.isArray(i.value.during) ? i.value.during : []);
    function ne(B, O) {
      const oe = [...de.value];
      oe[B] = O, D("during", oe);
    }
    return (B, O) => {
      const oe = Ea("FilterNode", !0);
      return c(), g("fieldset", {
        class: "work-filter-node",
        disabled: e.disabled
      }, [
        r("legend", Ai, A(o.value), 1),
        r("label", Pi, [
          O[21] || (O[21] = M("Condition", -1)),
          b(s(te), {
            "aria-label": o.value + " condition",
            "model-value": v.value,
            "onUpdate:modelValue": O[0] || (O[0] = (x) => I(x)),
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            optionDisabled: "disabled",
            options: [{ label: "Field", value: "field", disabled: !1 }, ...["and", "or", "not", "history", "rel", "children", "match"].map((x) => ({ label: x, value: x, disabled: d.value >= 6 && ["and", "or", "not", "rel", "children"].includes(x) }))]
          }, null, 8, ["aria-label", "model-value", "options"])
        ]),
        v.value === "and" || v.value === "or" ? (c(), g(H, { key: 0 }, [
          (c(!0), g(H, null, ee(u.value, (x, R) => (c(), g("div", {
            key: R,
            class: "work-stack work-tight"
          }, [
            b(oe, {
              "board-id": e.boardId,
              schema: e.schema,
              "model-value": x,
              path: o.value + "." + v.value + "[" + R + "]",
              depth: d.value + 1,
              "onUpdate:modelValue": (N) => T(R, N),
              onValidity: (N) => w(String(R), N)
            }, null, 8, ["board-id", "schema", "model-value", "path", "depth", "onUpdate:modelValue", "onValidity"]),
            b(s(Y), {
              label: "Remove condition",
              size: "small",
              severity: "secondary",
              onClick: (N) => S(R),
              outlined: ""
            }, {
              icon: L(() => [
                b(s(J), {
                  icon: "tabler:trash",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["onClick"])
          ]))), 128)),
          b(s(Y), {
            label: "Add condition",
            size: "small",
            severity: "secondary",
            disabled: d.value >= 6,
            onClick: O[1] || (O[1] = (x) => $({ [v.value]: [...u.value, y()] })),
            outlined: ""
          }, {
            icon: L(() => [
              b(s(J), {
                icon: "tabler:plus",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled"])
        ], 64)) : v.value === "not" ? (c(), F(oe, {
          key: 1,
          "board-id": e.boardId,
          schema: e.schema,
          "model-value": s(Ke)(e.modelValue.not),
          path: o.value + ".not",
          depth: d.value + 1,
          "onUpdate:modelValue": O[2] || (O[2] = (x) => $({ not: x })),
          onValidity: O[3] || (O[3] = (x) => w("nested", x))
        }, null, 8, ["board-id", "schema", "model-value", "path", "depth"])) : v.value === "field" ? (c(), g(H, { key: 2 }, [
          r("div", Ri, [
            r("label", null, [
              O[22] || (O[22] = M("Field", -1)),
              b(s(te), {
                "aria-label": o.value + " field",
                "model-value": e.modelValue.field,
                "onUpdate:modelValue": O[4] || (O[4] = (x) => $({ field: x, op: "eq", value: void 0 })),
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                optionDisabled: "disabled",
                options: [...(m.value ?? []).map((x) => ({ label: s(Ct)(x), value: x.code, disabled: !1 }))]
              }, null, 8, ["aria-label", "model-value", "options"])
            ]),
            r("label", null, [
              O[23] || (O[23] = M("Operator", -1)),
              b(s(te), {
                "aria-label": o.value + " operator",
                "model-value": e.modelValue.op,
                "onUpdate:modelValue": O[5] || (O[5] = (x) => $({ op: x, value: x === "is_null" ? !0 : void 0 })),
                appendTo: "self",
                options: s(di)(f.value)
              }, null, 8, ["aria-label", "model-value", "options"])
            ])
          ]),
          b(qt, {
            "board-id": e.boardId,
            field: e.modelValue.op === "is_null" ? { code: "null", form: "bool" } : f.value,
            "model-value": e.modelValue.value,
            multiple: ["in", "nin", "between"].includes(String(e.modelValue.op)),
            label: o.value + " value",
            "onUpdate:modelValue": O[6] || (O[6] = (x) => $({ value: x })),
            onValidity: O[7] || (O[7] = (x) => w("value", x))
          }, null, 8, ["board-id", "field", "model-value", "multiple", "label"])
        ], 64)) : v.value === "match" ? (c(), g("label", Oi, [
          O[24] || (O[24] = M("Search", -1)),
          b(s(re), {
            "aria-label": o.value + " search",
            value: e.modelValue.match,
            onInput: O[8] || (O[8] = (x) => $({ match: x.target.value }))
          }, null, 8, ["aria-label", "value"])
        ])) : v.value === "history" ? (c(), g(H, { key: 4 }, [
          r("div", Ni, [
            r("label", null, [
              O[25] || (O[25] = M("Field", -1)),
              b(s(te), {
                "aria-label": o.value + " history field",
                "model-value": i.value.field,
                "onUpdate:modelValue": O[9] || (O[9] = (x) => D("field", x)),
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                optionDisabled: "disabled",
                options: [...(m.value ?? []).map((x) => ({ label: s(Ct)(x), value: x.code, disabled: !1 }))]
              }, null, 8, ["aria-label", "model-value", "options"])
            ]),
            r("label", null, [
              O[26] || (O[26] = M("History", -1)),
              b(s(te), {
                "aria-label": o.value + " history mode",
                "model-value": i.value.changed ? "changed" : "was",
                "onUpdate:modelValue": O[10] || (O[10] = (x) => V(x)),
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                optionDisabled: "disabled",
                options: [{ label: "Changed", value: "changed", disabled: !1 }, { label: "Was", value: "was", disabled: !1 }]
              }, null, 8, ["aria-label", "model-value"])
            ])
          ]),
          i.value.changed ? (c(), g(H, { key: 0 }, ee(["from", "to"], (x) => r("div", { key: x }, [
            r("label", Mi, [
              b(s(Mt), {
                "model-value": x in i.value,
                "aria-label": "Constrain " + x,
                "onUpdate:modelValue": (R) => D(x, R ? "" : void 0),
                binary: ""
              }, null, 8, ["model-value", "aria-label", "onUpdate:modelValue"]),
              M(A(x), 1)
            ]),
            x in i.value ? (c(), F(qt, {
              key: 0,
              "board-id": e.boardId,
              field: n.value,
              "model-value": i.value[x],
              label: o.value + " history " + x,
              "onUpdate:modelValue": (R) => D(x, R),
              onValidity: (R) => w(x, R)
            }, null, 8, ["board-id", "field", "model-value", "label", "onUpdate:modelValue", "onValidity"])) : E("", !0)
          ])), 64)) : (c(), F(qt, {
            key: 1,
            "board-id": e.boardId,
            field: n.value,
            "model-value": i.value.was,
            label: o.value + " history was",
            "onUpdate:modelValue": O[11] || (O[11] = (x) => D("was", x)),
            onValidity: O[12] || (O[12] = (x) => w("was", x))
          }, null, 8, ["board-id", "field", "model-value", "label"])),
          r("label", Li, [
            b(s(Mt), {
              "model-value": "by" in i.value,
              "aria-label": "Constrain actor",
              "onUpdate:modelValue": O[13] || (O[13] = (x) => D("by", x ? { $actor: "id" } : void 0)),
              binary: ""
            }, null, 8, ["model-value"]),
            O[27] || (O[27] = M("By actor", -1))
          ]),
          "by" in i.value ? (c(), F(qt, {
            key: 2,
            "board-id": e.boardId,
            field: P,
            "model-value": i.value.by,
            label: o.value + " history by",
            "onUpdate:modelValue": O[14] || (O[14] = (x) => D("by", x))
          }, null, 8, ["board-id", "model-value", "label"])) : E("", !0),
          r("label", zi, [
            b(s(Mt), {
              "model-value": "during" in i.value,
              "aria-label": "Constrain time window",
              "onUpdate:modelValue": O[15] || (O[15] = (x) => D("during", x ? [{ $now: "-P30D" }, { $now: "P0D" }] : void 0)),
              binary: ""
            }, null, 8, ["model-value"]),
            O[28] || (O[28] = M("During", -1))
          ]),
          "during" in i.value ? (c(), g("div", Fi, [
            (c(), g(H, null, ee(["start", "end"], (x, R) => b(qt, {
              key: x,
              "board-id": e.boardId,
              field: Z,
              "model-value": de.value[R],
              label: o.value + " during " + x,
              "onUpdate:modelValue": (N) => ne(R, N)
            }, null, 8, ["board-id", "model-value", "label", "onUpdate:modelValue"])), 64))
          ])) : E("", !0)
        ], 64)) : (c(), g(H, { key: 5 }, [
          r("div", Bi, [
            v.value === "rel" ? (c(), g(H, { key: 0 }, [
              r("label", null, [
                O[29] || (O[29] = M("Relation", -1)),
                b(s(te), {
                  "model-value": e.modelValue.rel,
                  "onUpdate:modelValue": O[16] || (O[16] = (x) => $({ rel: x })),
                  appendTo: "self",
                  optionLabel: "label",
                  optionValue: "value",
                  optionDisabled: "disabled",
                  options: [...(e.schema.compiled.relation_types ?? []).map((x) => ({ label: x.outward ?? x.id, value: x.id, disabled: !1 }))]
                }, null, 8, ["model-value", "options"])
              ]),
              r("label", null, [
                O[30] || (O[30] = M("Direction", -1)),
                b(s(te), {
                  "model-value": e.modelValue.dir,
                  "onUpdate:modelValue": O[17] || (O[17] = (x) => $({ dir: x })),
                  appendTo: "self",
                  optionLabel: "label",
                  optionValue: "value",
                  optionDisabled: "disabled",
                  options: [{ label: "Outward", value: "outward", disabled: !1 }, { label: "Inward", value: "inward", disabled: !1 }]
                }, null, 8, ["model-value"])
              ])
            ], 64)) : E("", !0),
            r("label", null, [
              O[31] || (O[31] = M("Quantifier", -1)),
              b(s(te), {
                "model-value": e.modelValue.q,
                "onUpdate:modelValue": O[18] || (O[18] = (x) => $({ q: x })),
                appendTo: "self",
                options: ["some", "every", "none"]
              }, null, 8, ["model-value"])
            ])
          ]),
          b(oe, {
            "board-id": e.boardId,
            schema: e.schema,
            "model-value": s(Ke)(e.modelValue.where),
            path: o.value + ".where",
            depth: d.value + 1,
            "onUpdate:modelValue": O[19] || (O[19] = (x) => $({ where: x })),
            onValidity: O[20] || (O[20] = (x) => w("nested", x))
          }, null, 8, ["board-id", "schema", "model-value", "path", "depth"])
        ], 64))
      ], 8, Ii);
    };
  }
}), qi = { class: "work-stack work-tight" }, Wi = { class: "work-row work-small" }, _l = /* @__PURE__ */ ve({
  __name: "ConditionEditor",
  props: {
    modelValue: {},
    draft: {},
    boardId: {},
    label: {}
  },
  emits: ["update:modelValue", "validity"],
  setup(e, { emit: l }) {
    const t = e, a = l, o = G(() => ({ declaration: t.draft, compiled: t.draft, generation: 0, as_of: 0, key_prefix: "" })), d = /* @__PURE__ */ new Set();
    function v(f, i) {
      i ? d.delete(f) : d.add(f), a("validity", !d.size);
    }
    function m(f) {
      a("update:modelValue", f ? { field: t.draft.fields?.[0]?.code ?? "state", op: "eq" } : void 0), f || (d.clear(), a("validity", !0));
    }
    return ft(() => a("validity", !0)), (f, i) => (c(), g("section", qi, [
      r("label", Wi, [
        b(s(ze), {
          "model-value": e.modelValue != null,
          "aria-label": e.label,
          "onUpdate:modelValue": m
        }, null, 8, ["model-value", "aria-label"]),
        M(A(e.label), 1)
      ]),
      e.modelValue != null ? (c(), F(ji, {
        key: 0,
        schema: o.value,
        "board-id": e.boardId ?? "",
        "model-value": s(Ke)(e.modelValue),
        path: e.label,
        "onUpdate:modelValue": i[0] || (i[0] = (n) => a("update:modelValue", n)),
        onValidity: i[1] || (i[1] = (n) => v("structured", n))
      }, null, 8, ["schema", "board-id", "model-value", "path"])) : E("", !0),
      e.modelValue != null ? (c(), F(lt, {
        key: 1,
        label: e.label + " predicate",
        "model-value": e.modelValue,
        hint: "Use any predicate accepted by Work, including installed or deeply nested forms.",
        "onUpdate:modelValue": i[2] || (i[2] = (n) => a("update:modelValue", n)),
        onValidity: i[3] || (i[3] = (n) => v("raw", n))
      }, null, 8, ["label", "model-value"])) : E("", !0)
    ]));
  }
}), Ki = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, Gi = ["aria-label"], Yi = { class: "work-field-label" }, Hi = {
  key: 0,
  class: "work-chips"
}, Xi = ["kinds"], Ji = {
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
    const t = e, a = l, o = z(!1), d = z(0), v = G(() => t.modelValue ?? []), { principalLabel: m, rememberPrincipal: f, nameError: i } = Da(() => t.boardId ?? "", () => v.value);
    kl(async () => {
      o.value = await vt("wc-principal-picker");
    });
    function n(u) {
      const y = u.detail, p = y?.principal_id ?? y?.id;
      if (!p) return;
      const w = { kind: y.type ?? "user", id: p };
      y.label && f(w, y.label), v.value.some((S) => S.id === p && S.kind === w.kind) || a("update:modelValue", [...v.value, w]), d.value++;
    }
    return (u, y) => (c(), g(H, null, [
      s(i) ? (c(), g("p", Ki, A(s(i)), 1)) : E("", !0),
      r("section", {
        class: "work-stack work-tight work-principals-picker",
        "aria-label": e.label
      }, [
        r("h4", Yi, A(e.label), 1),
        v.value.length ? (c(), g("div", Hi, [
          (c(!0), g(H, null, ee(v.value, (p, w) => (c(), F(s(Re), {
            key: p.kind + p.id,
            severity: "secondary",
            class: "kx-tag-sm"
          }, {
            default: L(() => [
              M(A(s(m)(p)), 1),
              b(s(Y), {
                text: "",
                severity: "secondary",
                size: "small",
                "aria-label": "Remove " + s(m)(p),
                onClick: (S) => a("update:modelValue", v.value.filter((U, $) => $ !== w))
              }, {
                default: L(() => [
                  b(s(J), { icon: "tabler:x" })
                ]),
                _: 1
              }, 8, ["aria-label", "onClick"])
            ]),
            _: 2
          }, 1024))), 128))
        ])) : E("", !0),
        o.value ? (c(), g("wc-principal-picker", {
          key: d.value,
          kinds: e.kinds ?? "user,group",
          onConfigChanged: n
        }, null, 40, Xi)) : (c(), g("p", Ji, "People and group picker is unavailable."))
      ], 8, Gi)
    ], 64));
  }
}), Zi = { class: "work-stack work-tight" }, La = /* @__PURE__ */ ve({
  __name: "HoldersPicker",
  props: {
    modelValue: {},
    label: {},
    boardId: {}
  },
  emits: ["update:modelValue", "validity"],
  setup(e, { emit: l }) {
    const t = e, a = l, o = G(() => (t.modelValue ?? []).flatMap((v) => "user" in v ? [{ kind: "user", id: v.user }] : "group" in v ? [{ kind: "group", id: v.group }] : []));
    function d(v) {
      const m = [...(t.modelValue ?? []).filter((f) => "field" in f || "service" in f), ...v.map((f) => f.kind === "group" ? { group: f.id } : { user: f.id })];
      a("update:modelValue", m.length ? m : void 0);
    }
    return (v, m) => (c(), g("div", Zi, [
      b(ea, {
        "board-id": e.boardId,
        label: e.label,
        "model-value": o.value,
        "onUpdate:modelValue": d
      }, null, 8, ["board-id", "label", "model-value"]),
      b(lt, {
        label: e.label + " rules",
        "model-value": e.modelValue,
        shape: "array",
        example: [{ group: "selected-group" }],
        "onUpdate:modelValue": m[0] || (m[0] = (f) => a("update:modelValue", f)),
        onValidity: m[1] || (m[1] = (f) => a("validity", f))
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
function Qi(e, l, t) {
  return (l = ln(l)) in e ? Object.defineProperty(e, l, {
    value: t,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : e[l] = t, e;
}
function at() {
  return at = Object.assign ? Object.assign.bind() : function(e) {
    for (var l = 1; l < arguments.length; l++) {
      var t = arguments[l];
      for (var a in t) ({}).hasOwnProperty.call(t, a) && (e[a] = t[a]);
    }
    return e;
  }, at.apply(null, arguments);
}
function fa(e, l) {
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
    l % 2 ? fa(Object(t), !0).forEach(function(a) {
      Qi(e, a, t[a]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : fa(Object(t)).forEach(function(a) {
      Object.defineProperty(e, a, Object.getOwnPropertyDescriptor(t, a));
    });
  }
  return e;
}
function _i(e, l) {
  if (e == null) return {};
  var t, a, o = en(e, l);
  if (Object.getOwnPropertySymbols) {
    var d = Object.getOwnPropertySymbols(e);
    for (a = 0; a < d.length; a++) t = d[a], l.indexOf(t) === -1 && {}.propertyIsEnumerable.call(e, t) && (o[t] = e[t]);
  }
  return o;
}
function en(e, l) {
  if (e == null) return {};
  var t = {};
  for (var a in e) if ({}.hasOwnProperty.call(e, a)) {
    if (l.indexOf(a) !== -1) continue;
    t[a] = e[a];
  }
  return t;
}
function tn(e, l) {
  if (typeof e != "object" || !e) return e;
  var t = e[Symbol.toPrimitive];
  if (t !== void 0) {
    var a = t.call(e, l);
    if (typeof a != "object") return a;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (l === "string" ? String : Number)(e);
}
function ln(e) {
  var l = tn(e, "string");
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
var an = "1.15.7";
function tt(e) {
  if (typeof window < "u" && window.navigator)
    return !!/* @__PURE__ */ navigator.userAgent.match(e);
}
var ot = tt(/(?:Trident.*rv[ :]?11\.|msie|iemobile|Windows Phone)/i), el = tt(/Edge/i), pa = tt(/firefox/i), Ht = tt(/safari/i) && !tt(/chrome/i) && !tt(/android/i), ta = tt(/iP(ad|od|hone)/i), za = tt(/chrome/i) && tt(/android/i), Fa = {
  capture: !1,
  passive: !1
};
function me(e, l, t) {
  e.addEventListener(l, t, !ot && Fa);
}
function ce(e, l, t) {
  e.removeEventListener(l, t, !ot && Fa);
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
function Ba(e) {
  return e.host && e !== document && e.host.nodeType && e.host !== e ? e.host : e.parentNode;
}
function Je(e, l, t, a) {
  if (e) {
    t = t || document;
    do {
      if (l != null && (l[0] === ">" ? e.parentNode === t && fl(e, l) : fl(e, l)) || a && e === t)
        return e;
      if (e === t) break;
    } while (e = Ba(e));
  }
  return null;
}
var ba = /\s+/g;
function Fe(e, l, t) {
  if (e && l)
    if (e.classList)
      e.classList[t ? "add" : "remove"](l);
    else {
      var a = (" " + e.className + " ").replace(ba, " ").replace(" " + l + " ", " ");
      e.className = (a + (t ? " " + l : "")).replace(ba, " ");
    }
}
function le(e, l, t) {
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
      var a = le(e, "transform");
      a && a !== "none" && (t = a + " " + t);
    } while (!l && (e = e.parentNode));
  var o = window.DOMMatrix || window.WebKitCSSMatrix || window.CSSMatrix || window.MSCSSMatrix;
  return o && new o(t);
}
function ja(e, l, t) {
  if (e) {
    var a = e.getElementsByTagName(l), o = 0, d = a.length;
    if (t)
      for (; o < d; o++)
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
    var d, v, m, f, i, n, u;
    if (e !== window && e.parentNode && e !== _e() ? (d = e.getBoundingClientRect(), v = d.top, m = d.left, f = d.bottom, i = d.right, n = d.height, u = d.width) : (v = 0, m = 0, f = window.innerHeight, i = window.innerWidth, n = window.innerHeight, u = window.innerWidth), (l || t) && e !== window && (o = o || e.parentNode, !ot))
      do
        if (o && o.getBoundingClientRect && (le(o, "transform") !== "none" || t && le(o, "position") !== "static")) {
          var y = o.getBoundingClientRect();
          v -= y.top + parseInt(le(o, "border-top-width")), m -= y.left + parseInt(le(o, "border-left-width")), f = v + d.height, i = m + d.width;
          break;
        }
      while (o = o.parentNode);
    if (a && e !== window) {
      var p = Lt(o || e), w = p && p.a, S = p && p.d;
      p && (v /= S, m /= w, u /= w, n /= S, f = v + n, i = m + u);
    }
    return {
      top: v,
      left: m,
      bottom: f,
      right: i,
      width: u,
      height: n
    };
  }
}
function ha(e, l, t) {
  for (var a = ct(e, !0), o = Ue(e)[l]; a; ) {
    var d = Ue(a)[t], v = void 0;
    if (v = o >= d, !v) return a;
    if (a === _e()) break;
    a = ct(a, !1);
  }
  return !1;
}
function Ft(e, l, t, a) {
  for (var o = 0, d = 0, v = e.children; d < v.length; ) {
    if (v[d].style.display !== "none" && v[d] !== ae.ghost && (a || v[d] !== ae.dragged) && Je(v[d], t.draggable, e, !1)) {
      if (o === l)
        return v[d];
      o++;
    }
    d++;
  }
  return null;
}
function la(e, l) {
  for (var t = e.lastElementChild; t && (t === ae.ghost || le(t, "display") === "none" || l && !fl(t, l)); )
    t = t.previousElementSibling;
  return t || null;
}
function qe(e, l) {
  var t = 0;
  if (!e || !e.parentNode)
    return -1;
  for (; e = e.previousElementSibling; )
    e.nodeName.toUpperCase() !== "TEMPLATE" && e !== ae.clone && (!l || fl(e, l)) && t++;
  return t;
}
function ya(e) {
  var l = 0, t = 0, a = _e();
  if (e)
    do {
      var o = Lt(e), d = o.a, v = o.d;
      l += e.scrollLeft * d, t += e.scrollTop * v;
    } while (e !== a && (e = e.parentNode));
  return [l, t];
}
function on(e, l) {
  for (var t in e)
    if (e.hasOwnProperty(t)) {
      for (var a in l)
        if (l.hasOwnProperty(a) && l[a] === e[t][a]) return Number(t);
    }
  return -1;
}
function ct(e, l) {
  if (!e || !e.getBoundingClientRect) return _e();
  var t = e, a = !1;
  do
    if (t.clientWidth < t.scrollWidth || t.clientHeight < t.scrollHeight) {
      var o = le(t);
      if (t.clientWidth < t.scrollWidth && (o.overflowX == "auto" || o.overflowX == "scroll") || t.clientHeight < t.scrollHeight && (o.overflowY == "auto" || o.overflowY == "scroll")) {
        if (!t.getBoundingClientRect || t === document.body) return _e();
        if (a || l) return t;
        a = !0;
      }
    }
  while (t = t.parentNode);
  return _e();
}
function nn(e, l) {
  if (e && l)
    for (var t in l)
      l.hasOwnProperty(t) && (e[t] = l[t]);
  return e;
}
function Il(e, l) {
  return Math.round(e.top) === Math.round(l.top) && Math.round(e.left) === Math.round(l.left) && Math.round(e.height) === Math.round(l.height) && Math.round(e.width) === Math.round(l.width);
}
var Xt;
function qa(e, l) {
  return function() {
    if (!Xt) {
      var t = arguments, a = this;
      t.length === 1 ? e.call(a, t[0]) : e.apply(a, t), Xt = setTimeout(function() {
        Xt = void 0;
      }, l);
    }
  };
}
function sn() {
  clearTimeout(Xt), Xt = void 0;
}
function Wa(e, l, t) {
  e.scrollLeft += l, e.scrollTop += t;
}
function Ka(e) {
  var l = window.Polymer, t = window.jQuery || window.Zepto;
  return l && l.dom ? l.dom(e).cloneNode(!0) : t ? t(e).clone(!0)[0] : e.cloneNode(!0);
}
function Ga(e, l, t) {
  var a = {};
  return Array.from(e.children).forEach(function(o) {
    var d, v, m, f;
    if (!(!Je(o, l.draggable, e, !1) || o.animated || o === t)) {
      var i = Ue(o);
      a.left = Math.min((d = a.left) !== null && d !== void 0 ? d : 1 / 0, i.left), a.top = Math.min((v = a.top) !== null && v !== void 0 ? v : 1 / 0, i.top), a.right = Math.max((m = a.right) !== null && m !== void 0 ? m : -1 / 0, i.right), a.bottom = Math.max((f = a.bottom) !== null && f !== void 0 ? f : -1 / 0, i.bottom);
    }
  }), a.width = a.right - a.left, a.height = a.bottom - a.top, a.x = a.left, a.y = a.top, a;
}
var Le = "Sortable" + (/* @__PURE__ */ new Date()).getTime();
function rn() {
  var e = [], l;
  return {
    captureAnimationState: function() {
      if (e = [], !!this.options.animation) {
        var a = [].slice.call(this.el.children);
        a.forEach(function(o) {
          if (!(le(o, "display") === "none" || o === ae.ghost)) {
            e.push({
              target: o,
              rect: Ue(o)
            });
            var d = et({}, e[e.length - 1].rect);
            if (o.thisAnimationDuration) {
              var v = Lt(o, !0);
              v && (d.top -= v.f, d.left -= v.e);
            }
            o.fromRect = d;
          }
        });
      }
    },
    addAnimationState: function(a) {
      e.push(a);
    },
    removeAnimationState: function(a) {
      e.splice(on(e, {
        target: a
      }), 1);
    },
    animateAll: function(a) {
      var o = this;
      if (!this.options.animation) {
        clearTimeout(l), typeof a == "function" && a();
        return;
      }
      var d = !1, v = 0;
      e.forEach(function(m) {
        var f = 0, i = m.target, n = i.fromRect, u = Ue(i), y = i.prevFromRect, p = i.prevToRect, w = m.rect, S = Lt(i, !0);
        S && (u.top -= S.f, u.left -= S.e), i.toRect = u, i.thisAnimationDuration && Il(y, u) && !Il(n, u) && // Make sure animatingRect is on line between toRect & fromRect
        (w.top - u.top) / (w.left - u.left) === (n.top - u.top) / (n.left - u.left) && (f = un(w, y, p, o.options)), Il(u, n) || (i.prevFromRect = n, i.prevToRect = u, f || (f = o.options.animation), o.animate(i, w, u, f)), f && (d = !0, v = Math.max(v, f), clearTimeout(i.animationResetTimer), i.animationResetTimer = setTimeout(function() {
          i.animationTime = 0, i.prevFromRect = null, i.fromRect = null, i.prevToRect = null, i.thisAnimationDuration = null;
        }, f), i.thisAnimationDuration = f);
      }), clearTimeout(l), d ? l = setTimeout(function() {
        typeof a == "function" && a();
      }, v) : typeof a == "function" && a(), e = [];
    },
    animate: function(a, o, d, v) {
      if (v) {
        le(a, "transition", ""), le(a, "transform", "");
        var m = Lt(this.el), f = m && m.a, i = m && m.d, n = (o.left - d.left) / (f || 1), u = (o.top - d.top) / (i || 1);
        a.animatingX = !!n, a.animatingY = !!u, le(a, "transform", "translate3d(" + n + "px," + u + "px,0)"), this.forRepaintDummy = dn(a), le(a, "transition", "transform " + v + "ms" + (this.options.easing ? " " + this.options.easing : "")), le(a, "transform", "translate3d(0,0,0)"), typeof a.animated == "number" && clearTimeout(a.animated), a.animated = setTimeout(function() {
          le(a, "transition", ""), le(a, "transform", ""), a.animated = !1, a.animatingX = !1, a.animatingY = !1;
        }, v);
      }
    }
  };
}
function dn(e) {
  return e.offsetWidth;
}
function un(e, l, t, a) {
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
    var d = l + "Global";
    At.forEach(function(v) {
      t[v.pluginName] && (t[v.pluginName][d] && t[v.pluginName][d](et({
        sortable: t
      }, a)), t.options[v.pluginName] && t[v.pluginName][l] && t[v.pluginName][l](et({
        sortable: t
      }, a)));
    });
  },
  initializePlugins: function(l, t, a, o) {
    At.forEach(function(m) {
      var f = m.pluginName;
      if (!(!l.options[f] && !m.initializeByDefault)) {
        var i = new m(l, t, l.options);
        i.sortable = l, i.options = l.options, l[f] = i, at(a, i.defaults);
      }
    });
    for (var d in l.options)
      if (l.options.hasOwnProperty(d)) {
        var v = this.modifyOption(l, d, l.options[d]);
        typeof v < "u" && (l.options[d] = v);
      }
  },
  getEventProperties: function(l, t) {
    var a = {};
    return At.forEach(function(o) {
      typeof o.eventProperties == "function" && at(a, o.eventProperties.call(t[o.pluginName], l));
    }), a;
  },
  modifyOption: function(l, t, a) {
    var o;
    return At.forEach(function(d) {
      l[d.pluginName] && d.optionListeners && typeof d.optionListeners[t] == "function" && (o = d.optionListeners[t].call(l[d.pluginName], a));
    }), o;
  }
};
function cn(e) {
  var l = e.sortable, t = e.rootEl, a = e.name, o = e.targetEl, d = e.cloneEl, v = e.toEl, m = e.fromEl, f = e.oldIndex, i = e.newIndex, n = e.oldDraggableIndex, u = e.newDraggableIndex, y = e.originalEvent, p = e.putSortable, w = e.extraEventProperties;
  if (l = l || t && t[Le], !!l) {
    var S, U = l.options, $ = "on" + a.charAt(0).toUpperCase() + a.substr(1);
    window.CustomEvent && !ot && !el ? S = new CustomEvent(a, {
      bubbles: !0,
      cancelable: !0
    }) : (S = document.createEvent("Event"), S.initEvent(a, !0, !0)), S.to = v || t, S.from = m || t, S.item = o || t, S.clone = d, S.oldIndex = f, S.newIndex = i, S.oldDraggableIndex = n, S.newDraggableIndex = u, S.originalEvent = y, S.pullMode = p ? p.lastPutMode : void 0;
    var I = et(et({}, w), tl.getEventProperties(a, l));
    for (var T in I)
      S[T] = I[T];
    t && t.dispatchEvent(S), U[$] && U[$].call(l, S);
  }
}
var vn = ["evt"], Me = function(l, t) {
  var a = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, o = a.evt, d = _i(a, vn);
  tl.pluginEvent.bind(ae)(l, t, et({
    dragEl: W,
    parentEl: xe,
    ghostEl: ie,
    rootEl: we,
    nextEl: wt,
    lastDownEl: dl,
    cloneEl: $e,
    cloneHidden: ut,
    dragStarted: Kt,
    putSortable: Ie,
    activeSortable: ae.active,
    originalEvent: o,
    oldIndex: Nt,
    oldDraggableIndex: Jt,
    newIndex: Be,
    newDraggableIndex: dt,
    hideGhostForTarget: Ja,
    unhideGhostForTarget: Za,
    cloneNowHidden: function() {
      ut = !0;
    },
    cloneNowShown: function() {
      ut = !1;
    },
    dispatchSortableEvent: function(m) {
      Oe({
        sortable: t,
        name: m,
        originalEvent: o
      });
    }
  }, d));
};
function Oe(e) {
  cn(et({
    putSortable: Ie,
    cloneEl: $e,
    targetEl: W,
    rootEl: we,
    oldIndex: Nt,
    oldDraggableIndex: Jt,
    newIndex: Be,
    newDraggableIndex: dt
  }, e));
}
var W, xe, ie, we, wt, dl, $e, ut, Nt, Be, Jt, dt, il, Ie, Rt = !1, pl = !1, bl = [], ht, Xe, Pl, Rl, ga, ka, Kt, Pt, Zt, Qt = !1, nl = !1, ul, Pe, Ol = [], Wl = !1, hl = [], xl = typeof document < "u", sl = ta, wa = el || ot ? "cssFloat" : "float", mn = xl && !za && !ta && "draggable" in document.createElement("div"), Ya = (function() {
  if (xl) {
    if (ot)
      return !1;
    var e = document.createElement("x");
    return e.style.cssText = "pointer-events:auto", e.style.pointerEvents === "auto";
  }
})(), Ha = function(l, t) {
  var a = le(l), o = parseInt(a.width) - parseInt(a.paddingLeft) - parseInt(a.paddingRight) - parseInt(a.borderLeftWidth) - parseInt(a.borderRightWidth), d = Ft(l, 0, t), v = Ft(l, 1, t), m = d && le(d), f = v && le(v), i = m && parseInt(m.marginLeft) + parseInt(m.marginRight) + Ue(d).width, n = f && parseInt(f.marginLeft) + parseInt(f.marginRight) + Ue(v).width;
  if (a.display === "flex")
    return a.flexDirection === "column" || a.flexDirection === "column-reverse" ? "vertical" : "horizontal";
  if (a.display === "grid")
    return a.gridTemplateColumns.split(" ").length <= 1 ? "vertical" : "horizontal";
  if (d && m.float && m.float !== "none") {
    var u = m.float === "left" ? "left" : "right";
    return v && (f.clear === "both" || f.clear === u) ? "vertical" : "horizontal";
  }
  return d && (m.display === "block" || m.display === "flex" || m.display === "table" || m.display === "grid" || i >= o && a[wa] === "none" || v && a[wa] === "none" && i + n > o) ? "vertical" : "horizontal";
}, fn = function(l, t, a) {
  var o = a ? l.left : l.top, d = a ? l.right : l.bottom, v = a ? l.width : l.height, m = a ? t.left : t.top, f = a ? t.right : t.bottom, i = a ? t.width : t.height;
  return o === m || d === f || o + v / 2 === m + i / 2;
}, pn = function(l, t) {
  var a;
  return bl.some(function(o) {
    var d = o[Le].options.emptyInsertThreshold;
    if (!(!d || la(o))) {
      var v = Ue(o), m = l >= v.left - d && l <= v.right + d, f = t >= v.top - d && t <= v.bottom + d;
      if (m && f)
        return a = o;
    }
  }), a;
}, Xa = function(l) {
  function t(d, v) {
    return function(m, f, i, n) {
      var u = m.options.group.name && f.options.group.name && m.options.group.name === f.options.group.name;
      if (d == null && (v || u))
        return !0;
      if (d == null || d === !1)
        return !1;
      if (v && d === "clone")
        return d;
      if (typeof d == "function")
        return t(d(m, f, i, n), v)(m, f, i, n);
      var y = (v ? m : f).options.group.name;
      return d === !0 || typeof d == "string" && d === y || d.join && d.indexOf(y) > -1;
    };
  }
  var a = {}, o = l.group;
  (!o || ql(o) != "object") && (o = {
    name: o
  }), a.name = o.name, a.checkPull = t(o.pull, !0), a.checkPut = t(o.put), a.revertClone = o.revertClone, l.group = a;
}, Ja = function() {
  !Ya && ie && le(ie, "display", "none");
}, Za = function() {
  !Ya && ie && le(ie, "display", "");
};
xl && !za && document.addEventListener("click", function(e) {
  if (pl)
    return e.preventDefault(), e.stopPropagation && e.stopPropagation(), e.stopImmediatePropagation && e.stopImmediatePropagation(), pl = !1, !1;
}, !0);
var yt = function(l) {
  if (W) {
    l = l.touches ? l.touches[0] : l;
    var t = pn(l.clientX, l.clientY);
    if (t) {
      var a = {};
      for (var o in l)
        l.hasOwnProperty(o) && (a[o] = l[o]);
      a.target = a.rootEl = t, a.preventDefault = void 0, a.stopPropagation = void 0, t[Le]._onDragOver(a);
    }
  }
}, bn = function(l) {
  W && W.parentNode[Le]._isOutsideThisEl(l.target);
};
function ae(e, l) {
  if (!(e && e.nodeType && e.nodeType === 1))
    throw "Sortable: `el` must be an HTMLElement, not ".concat({}.toString.call(e));
  this.el = e, this.options = l = at({}, l), e[Le] = this;
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
      return Ha(e, this.options);
    },
    ghostClass: "sortable-ghost",
    chosenClass: "sortable-chosen",
    dragClass: "sortable-drag",
    ignore: "a, img",
    filter: null,
    preventOnFilter: !0,
    animation: 0,
    easing: null,
    setData: function(v, m) {
      v.setData("Text", m.textContent);
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
    supportPointer: ae.supportPointer !== !1 && "PointerEvent" in window && (!Ht || ta),
    emptyInsertThreshold: 5
  };
  tl.initializePlugins(this, e, t);
  for (var a in t)
    !(a in l) && (l[a] = t[a]);
  Xa(l);
  for (var o in this)
    o.charAt(0) === "_" && typeof this[o] == "function" && (this[o] = this[o].bind(this));
  this.nativeDraggable = l.forceFallback ? !1 : mn, this.nativeDraggable && (this.options.touchStartThreshold = 1), l.supportPointer ? me(e, "pointerdown", this._onTapStart) : (me(e, "mousedown", this._onTapStart), me(e, "touchstart", this._onTapStart)), this.nativeDraggable && (me(e, "dragover", this), me(e, "dragenter", this)), bl.push(this.el), l.store && l.store.get && this.sort(l.store.get(this) || []), at(this, rn());
}
ae.prototype = /** @lends Sortable.prototype */
{
  constructor: ae,
  _isOutsideThisEl: function(l) {
    !this.el.contains(l) && l !== this.el && (Pt = null);
  },
  _getDirection: function(l, t) {
    return typeof this.options.direction == "function" ? this.options.direction.call(this, l, t, W) : this.options.direction;
  },
  _onTapStart: function(l) {
    if (l.cancelable) {
      var t = this, a = this.el, o = this.options, d = o.preventOnFilter, v = l.type, m = l.touches && l.touches[0] || l.pointerType && l.pointerType === "touch" && l, f = (m || l).target, i = l.target.shadowRoot && (l.path && l.path[0] || l.composedPath && l.composedPath()[0]) || f, n = o.filter;
      if (xn(a), !W && !(/mousedown|pointerdown/.test(v) && l.button !== 0 || o.disabled) && !i.isContentEditable && !(!this.nativeDraggable && Ht && f && f.tagName.toUpperCase() === "SELECT") && (f = Je(f, o.draggable, a, !1), !(f && f.animated) && dl !== f)) {
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
            }), d && l.preventDefault();
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
          d && l.preventDefault();
          return;
        }
        o.handle && !Je(i, o.handle, a, !1) || this._prepareDragStart(l, m, f);
      }
    }
  },
  _prepareDragStart: function(l, t, a) {
    var o = this, d = o.el, v = o.options, m = d.ownerDocument, f;
    if (a && !W && a.parentNode === d) {
      var i = Ue(a);
      if (we = d, W = a, xe = W.parentNode, wt = W.nextSibling, dl = a, il = v.group, ae.dragged = W, ht = {
        target: W,
        clientX: (t || l).clientX,
        clientY: (t || l).clientY
      }, ga = ht.clientX - i.left, ka = ht.clientY - i.top, this._lastX = (t || l).clientX, this._lastY = (t || l).clientY, W.style["will-change"] = "all", f = function() {
        if (Me("delayEnded", o, {
          evt: l
        }), ae.eventCanceled) {
          o._onDrop();
          return;
        }
        o._disableDelayedDragEvents(), !pa && o.nativeDraggable && (W.draggable = !0), o._triggerDragStart(l, t), Oe({
          sortable: o,
          name: "choose",
          originalEvent: l
        }), Fe(W, v.chosenClass, !0);
      }, v.ignore.split(",").forEach(function(n) {
        ja(W, n.trim(), Nl);
      }), me(m, "dragover", yt), me(m, "mousemove", yt), me(m, "touchmove", yt), v.supportPointer ? (me(m, "pointerup", o._onDrop), !this.nativeDraggable && me(m, "pointercancel", o._onDrop)) : (me(m, "mouseup", o._onDrop), me(m, "touchend", o._onDrop), me(m, "touchcancel", o._onDrop)), pa && this.nativeDraggable && (this.options.touchStartThreshold = 4, W.draggable = !0), Me("delayStart", this, {
        evt: l
      }), v.delay && (!v.delayOnTouchOnly || t) && (!this.nativeDraggable || !(el || ot))) {
        if (ae.eventCanceled) {
          this._onDrop();
          return;
        }
        v.supportPointer ? (me(m, "pointerup", o._disableDelayedDrag), me(m, "pointercancel", o._disableDelayedDrag)) : (me(m, "mouseup", o._disableDelayedDrag), me(m, "touchend", o._disableDelayedDrag), me(m, "touchcancel", o._disableDelayedDrag)), me(m, "mousemove", o._delayedDragTouchMoveHandler), me(m, "touchmove", o._delayedDragTouchMoveHandler), v.supportPointer && me(m, "pointermove", o._delayedDragTouchMoveHandler), o._dragStartTimer = setTimeout(f, v.delay);
      } else
        f();
    }
  },
  _delayedDragTouchMoveHandler: function(l) {
    var t = l.touches ? l.touches[0] : l;
    Math.max(Math.abs(t.clientX - this._lastX), Math.abs(t.clientY - this._lastY)) >= Math.floor(this.options.touchStartThreshold / (this.nativeDraggable && window.devicePixelRatio || 1)) && this._disableDelayedDrag();
  },
  _disableDelayedDrag: function() {
    W && Nl(W), clearTimeout(this._dragStartTimer), this._disableDelayedDragEvents();
  },
  _disableDelayedDragEvents: function() {
    var l = this.el.ownerDocument;
    ce(l, "mouseup", this._disableDelayedDrag), ce(l, "touchend", this._disableDelayedDrag), ce(l, "touchcancel", this._disableDelayedDrag), ce(l, "pointerup", this._disableDelayedDrag), ce(l, "pointercancel", this._disableDelayedDrag), ce(l, "mousemove", this._delayedDragTouchMoveHandler), ce(l, "touchmove", this._delayedDragTouchMoveHandler), ce(l, "pointermove", this._delayedDragTouchMoveHandler);
  },
  _triggerDragStart: function(l, t) {
    t = t || l.pointerType == "touch" && l, !this.nativeDraggable || t ? this.options.supportPointer ? me(document, "pointermove", this._onTouchMove) : t ? me(document, "touchmove", this._onTouchMove) : me(document, "mousemove", this._onTouchMove) : (me(W, "dragend", this), me(we, "dragstart", this._onDragStart));
    try {
      document.selection ? cl(function() {
        document.selection.empty();
      }) : window.getSelection().removeAllRanges();
    } catch {
    }
  },
  _dragStarted: function(l, t) {
    if (Rt = !1, we && W) {
      Me("dragStarted", this, {
        evt: t
      }), this.nativeDraggable && me(document, "dragover", bn);
      var a = this.options;
      !l && Fe(W, a.dragClass, !1), Fe(W, a.ghostClass, !0), ae.active = this, l && this._appendGhost(), Oe({
        sortable: this,
        name: "start",
        originalEvent: t
      });
    } else
      this._nulling();
  },
  _emulateDragOver: function() {
    if (Xe) {
      this._lastX = Xe.clientX, this._lastY = Xe.clientY, Ja();
      for (var l = document.elementFromPoint(Xe.clientX, Xe.clientY), t = l; l && l.shadowRoot && (l = l.shadowRoot.elementFromPoint(Xe.clientX, Xe.clientY), l !== t); )
        t = l;
      if (W.parentNode[Le]._isOutsideThisEl(l), t)
        do {
          if (t[Le]) {
            var a = void 0;
            if (a = t[Le]._onDragOver({
              clientX: Xe.clientX,
              clientY: Xe.clientY,
              target: l,
              rootEl: t
            }), a && !this.options.dragoverBubble)
              break;
          }
          l = t;
        } while (t = Ba(t));
      Za();
    }
  },
  _onTouchMove: function(l) {
    if (ht) {
      var t = this.options, a = t.fallbackTolerance, o = t.fallbackOffset, d = l.touches ? l.touches[0] : l, v = ie && Lt(ie, !0), m = ie && v && v.a, f = ie && v && v.d, i = sl && Pe && ya(Pe), n = (d.clientX - ht.clientX + o.x) / (m || 1) + (i ? i[0] - Ol[0] : 0) / (m || 1), u = (d.clientY - ht.clientY + o.y) / (f || 1) + (i ? i[1] - Ol[1] : 0) / (f || 1);
      if (!ae.active && !Rt) {
        if (a && Math.max(Math.abs(d.clientX - this._lastX), Math.abs(d.clientY - this._lastY)) < a)
          return;
        this._onDragStart(l, !0);
      }
      if (ie) {
        v ? (v.e += n - (Pl || 0), v.f += u - (Rl || 0)) : v = {
          a: 1,
          b: 0,
          c: 0,
          d: 1,
          e: n,
          f: u
        };
        var y = "matrix(".concat(v.a, ",").concat(v.b, ",").concat(v.c, ",").concat(v.d, ",").concat(v.e, ",").concat(v.f, ")");
        le(ie, "webkitTransform", y), le(ie, "mozTransform", y), le(ie, "msTransform", y), le(ie, "transform", y), Pl = n, Rl = u, Xe = d;
      }
      l.cancelable && l.preventDefault();
    }
  },
  _appendGhost: function() {
    if (!ie) {
      var l = this.options.fallbackOnBody ? document.body : we, t = Ue(W, !0, sl, !0, l), a = this.options;
      if (sl) {
        for (Pe = l; le(Pe, "position") === "static" && le(Pe, "transform") === "none" && Pe !== document; )
          Pe = Pe.parentNode;
        Pe !== document.body && Pe !== document.documentElement ? (Pe === document && (Pe = _e()), t.top += Pe.scrollTop, t.left += Pe.scrollLeft) : Pe = _e(), Ol = ya(Pe);
      }
      ie = W.cloneNode(!0), Fe(ie, a.ghostClass, !1), Fe(ie, a.fallbackClass, !0), Fe(ie, a.dragClass, !0), le(ie, "transition", ""), le(ie, "transform", ""), le(ie, "box-sizing", "border-box"), le(ie, "margin", 0), le(ie, "top", t.top), le(ie, "left", t.left), le(ie, "width", t.width), le(ie, "height", t.height), le(ie, "opacity", "0.8"), le(ie, "position", sl ? "absolute" : "fixed"), le(ie, "zIndex", "100000"), le(ie, "pointerEvents", "none"), ae.ghost = ie, l.appendChild(ie), le(ie, "transform-origin", ga / parseInt(ie.style.width) * 100 + "% " + ka / parseInt(ie.style.height) * 100 + "%");
    }
  },
  _onDragStart: function(l, t) {
    var a = this, o = l.dataTransfer, d = a.options;
    if (Me("dragStart", this, {
      evt: l
    }), ae.eventCanceled) {
      this._onDrop();
      return;
    }
    Me("setupClone", this), ae.eventCanceled || ($e = Ka(W), $e.removeAttribute("id"), $e.draggable = !1, $e.style["will-change"] = "", this._hideClone(), Fe($e, this.options.chosenClass, !1), ae.clone = $e), a.cloneId = cl(function() {
      Me("clone", a), !ae.eventCanceled && (a.options.removeCloneOnHide || we.insertBefore($e, W), a._hideClone(), Oe({
        sortable: a,
        name: "clone"
      }));
    }), !t && Fe(W, d.dragClass, !0), t ? (pl = !0, a._loopId = setInterval(a._emulateDragOver, 50)) : (ce(document, "mouseup", a._onDrop), ce(document, "touchend", a._onDrop), ce(document, "touchcancel", a._onDrop), o && (o.effectAllowed = "move", d.setData && d.setData.call(a, o, W)), me(document, "drop", a), le(W, "transform", "translateZ(0)")), Rt = !0, a._dragStartId = cl(a._dragStarted.bind(a, t, l)), me(document, "selectstart", a), Kt = !0, window.getSelection().removeAllRanges(), Ht && le(document.body, "user-select", "none");
  },
  // Returns true - if no further action is needed (either inserted or another condition)
  _onDragOver: function(l) {
    var t = this.el, a = l.target, o, d, v, m = this.options, f = m.group, i = ae.active, n = il === f, u = m.sort, y = Ie || i, p, w = this, S = !1;
    if (Wl) return;
    function U(pe, ke) {
      Me(pe, w, et({
        evt: l,
        isOwner: n,
        axis: p ? "vertical" : "horizontal",
        revert: v,
        dragRect: o,
        targetRect: d,
        canSort: u,
        fromSortable: y,
        target: a,
        completed: I,
        onMove: function(De, h) {
          return rl(we, t, W, o, De, Ue(De), l, h);
        },
        changed: T
      }, ke));
    }
    function $() {
      U("dragOverAnimationCapture"), w.captureAnimationState(), w !== y && y.captureAnimationState();
    }
    function I(pe) {
      return U("dragOverCompleted", {
        insertion: pe
      }), pe && (n ? i._hideClone() : i._showClone(w), w !== y && (Fe(W, Ie ? Ie.options.ghostClass : i.options.ghostClass, !1), Fe(W, m.ghostClass, !0)), Ie !== w && w !== ae.active ? Ie = w : w === ae.active && Ie && (Ie = null), y === w && (w._ignoreWhileAnimating = a), w.animateAll(function() {
        U("dragOverAnimationComplete"), w._ignoreWhileAnimating = null;
      }), w !== y && (y.animateAll(), y._ignoreWhileAnimating = null)), (a === W && !W.animated || a === t && !a.animated) && (Pt = null), !m.dragoverBubble && !l.rootEl && a !== document && (W.parentNode[Le]._isOutsideThisEl(l.target), !pe && yt(l)), !m.dragoverBubble && l.stopPropagation && l.stopPropagation(), S = !0;
    }
    function T() {
      Be = qe(W), dt = qe(W, m.draggable), Oe({
        sortable: w,
        name: "change",
        toEl: t,
        newIndex: Be,
        newDraggableIndex: dt,
        originalEvent: l
      });
    }
    if (l.preventDefault !== void 0 && l.cancelable && l.preventDefault(), a = Je(a, m.draggable, t, !0), U("dragOver"), ae.eventCanceled) return S;
    if (W.contains(l.target) || a.animated && a.animatingX && a.animatingY || w._ignoreWhileAnimating === a)
      return I(!1);
    if (pl = !1, i && !m.disabled && (n ? u || (v = xe !== we) : Ie === this || (this.lastPutMode = il.checkPull(this, i, W, l)) && f.checkPut(this, i, W, l))) {
      if (p = this._getDirection(l, a) === "vertical", o = Ue(W), U("dragOverValid"), ae.eventCanceled) return S;
      if (v)
        return xe = we, $(), this._hideClone(), U("revert"), ae.eventCanceled || (wt ? we.insertBefore(W, wt) : we.appendChild(W)), I(!0);
      var D = la(t, m.draggable);
      if (!D || kn(l, p, this) && !D.animated) {
        if (D === W)
          return I(!1);
        if (D && t === l.target && (a = D), a && (d = Ue(a)), rl(we, t, W, o, a, d, l, !!a) !== !1)
          return $(), D && D.nextSibling ? t.insertBefore(W, D.nextSibling) : t.appendChild(W), xe = t, T(), I(!0);
      } else if (D && gn(l, p, this)) {
        var V = Ft(t, 0, m, !0);
        if (V === W)
          return I(!1);
        if (a = V, d = Ue(a), rl(we, t, W, o, a, d, l, !1) !== !1)
          return $(), t.insertBefore(W, V), xe = t, T(), I(!0);
      } else if (a.parentNode === t) {
        d = Ue(a);
        var P = 0, Z, de = W.parentNode !== t, ne = !fn(W.animated && W.toRect || o, a.animated && a.toRect || d, p), B = p ? "top" : "left", O = ha(a, "top", "top") || ha(W, "top", "top"), oe = O ? O.scrollTop : void 0;
        Pt !== a && (Z = d[B], Qt = !1, nl = !ne && m.invertSwap || de), P = wn(l, a, d, p, ne ? 1 : m.swapThreshold, m.invertedSwapThreshold == null ? m.swapThreshold : m.invertedSwapThreshold, nl, Pt === a);
        var x;
        if (P !== 0) {
          var R = qe(W);
          do
            R -= P, x = xe.children[R];
          while (x && (le(x, "display") === "none" || x === ie));
        }
        if (P === 0 || x === a)
          return I(!1);
        Pt = a, Zt = P;
        var N = a.nextElementSibling, X = !1;
        X = P === 1;
        var ue = rl(we, t, W, o, a, d, l, X);
        if (ue !== !1)
          return (ue === 1 || ue === -1) && (X = ue === 1), Wl = !0, setTimeout(yn, 30), $(), X && !N ? t.appendChild(W) : a.parentNode.insertBefore(W, X ? N : a), O && Wa(O, 0, oe - O.scrollTop), xe = W.parentNode, Z !== void 0 && !nl && (ul = Math.abs(Z - Ue(a)[B])), T(), I(!0);
      }
      if (t.contains(W))
        return I(!1);
    }
    return !1;
  },
  _ignoreWhileAnimating: null,
  _offMoveEvents: function() {
    ce(document, "mousemove", this._onTouchMove), ce(document, "touchmove", this._onTouchMove), ce(document, "pointermove", this._onTouchMove), ce(document, "dragover", yt), ce(document, "mousemove", yt), ce(document, "touchmove", yt);
  },
  _offUpEvents: function() {
    var l = this.el.ownerDocument;
    ce(l, "mouseup", this._onDrop), ce(l, "touchend", this._onDrop), ce(l, "pointerup", this._onDrop), ce(l, "pointercancel", this._onDrop), ce(l, "touchcancel", this._onDrop), ce(document, "selectstart", this);
  },
  _onDrop: function(l) {
    var t = this.el, a = this.options;
    if (Be = qe(W), dt = qe(W, a.draggable), Me("drop", this, {
      evt: l
    }), xe = W && W.parentNode, Be = qe(W), dt = qe(W, a.draggable), ae.eventCanceled) {
      this._nulling();
      return;
    }
    Rt = !1, nl = !1, Qt = !1, clearInterval(this._loopId), clearTimeout(this._dragStartTimer), Kl(this.cloneId), Kl(this._dragStartId), this.nativeDraggable && (ce(document, "drop", this), ce(t, "dragstart", this._onDragStart)), this._offMoveEvents(), this._offUpEvents(), Ht && le(document.body, "user-select", ""), le(W, "transform", ""), l && (Kt && (l.cancelable && l.preventDefault(), !a.dropBubble && l.stopPropagation()), ie && ie.parentNode && ie.parentNode.removeChild(ie), (we === xe || Ie && Ie.lastPutMode !== "clone") && $e && $e.parentNode && $e.parentNode.removeChild($e), W && (this.nativeDraggable && ce(W, "dragend", this), Nl(W), W.style["will-change"] = "", Kt && !Rt && Fe(W, Ie ? Ie.options.ghostClass : this.options.ghostClass, !1), Fe(W, this.options.chosenClass, !1), Oe({
      sortable: this,
      name: "unchoose",
      toEl: xe,
      newIndex: null,
      newDraggableIndex: null,
      originalEvent: l
    }), we !== xe ? (Be >= 0 && (Oe({
      rootEl: xe,
      name: "add",
      toEl: xe,
      fromEl: we,
      originalEvent: l
    }), Oe({
      sortable: this,
      name: "remove",
      toEl: xe,
      originalEvent: l
    }), Oe({
      rootEl: xe,
      name: "sort",
      toEl: xe,
      fromEl: we,
      originalEvent: l
    }), Oe({
      sortable: this,
      name: "sort",
      toEl: xe,
      originalEvent: l
    })), Ie && Ie.save()) : Be !== Nt && Be >= 0 && (Oe({
      sortable: this,
      name: "update",
      toEl: xe,
      originalEvent: l
    }), Oe({
      sortable: this,
      name: "sort",
      toEl: xe,
      originalEvent: l
    })), ae.active && ((Be == null || Be === -1) && (Be = Nt, dt = Jt), Oe({
      sortable: this,
      name: "end",
      toEl: xe,
      originalEvent: l
    }), this.save()))), this._nulling();
  },
  _nulling: function() {
    Me("nulling", this), we = W = xe = ie = wt = $e = dl = ut = ht = Xe = Kt = Be = dt = Nt = Jt = Pt = Zt = Ie = il = ae.dragged = ae.ghost = ae.clone = ae.active = null;
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
        W && (this._onDragOver(l), hn(l));
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
    for (var l = [], t, a = this.el.children, o = 0, d = a.length, v = this.options; o < d; o++)
      t = a[o], Je(t, v.draggable, this.el, !1) && l.push(t.getAttribute(v.dataIdAttr) || $n(t));
    return l;
  },
  /**
   * Sorts the elements according to the array.
   * @param  {String[]}  order  order of the items
   */
  sort: function(l, t) {
    var a = {}, o = this.el;
    this.toArray().forEach(function(d, v) {
      var m = o.children[v];
      Je(m, this.options.draggable, o, !1) && (a[d] = m);
    }, this), t && this.captureAnimationState(), l.forEach(function(d) {
      a[d] && (o.removeChild(a[d]), o.appendChild(a[d]));
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
    typeof o < "u" ? a[l] = o : a[l] = t, l === "group" && Xa(a);
  },
  /**
   * Destroy
   */
  destroy: function() {
    Me("destroy", this);
    var l = this.el;
    l[Le] = null, ce(l, "mousedown", this._onTapStart), ce(l, "touchstart", this._onTapStart), ce(l, "pointerdown", this._onTapStart), this.nativeDraggable && (ce(l, "dragover", this), ce(l, "dragenter", this)), Array.prototype.forEach.call(l.querySelectorAll("[draggable]"), function(t) {
      t.removeAttribute("draggable");
    }), this._onDrop(), this._disableDelayedDragEvents(), bl.splice(bl.indexOf(this.el), 1), this.el = l = null;
  },
  _hideClone: function() {
    if (!ut) {
      if (Me("hideClone", this), ae.eventCanceled) return;
      le($e, "display", "none"), this.options.removeCloneOnHide && $e.parentNode && $e.parentNode.removeChild($e), ut = !0;
    }
  },
  _showClone: function(l) {
    if (l.lastPutMode !== "clone") {
      this._hideClone();
      return;
    }
    if (ut) {
      if (Me("showClone", this), ae.eventCanceled) return;
      W.parentNode == we && !this.options.group.revertClone ? we.insertBefore($e, W) : wt ? we.insertBefore($e, wt) : we.appendChild($e), this.options.group.revertClone && this.animate(W, $e), le($e, "display", ""), ut = !1;
    }
  }
};
function hn(e) {
  e.dataTransfer && (e.dataTransfer.dropEffect = "move"), e.cancelable && e.preventDefault();
}
function rl(e, l, t, a, o, d, v, m) {
  var f, i = e[Le], n = i.options.onMove, u;
  return window.CustomEvent && !ot && !el ? f = new CustomEvent("move", {
    bubbles: !0,
    cancelable: !0
  }) : (f = document.createEvent("Event"), f.initEvent("move", !0, !0)), f.to = l, f.from = e, f.dragged = t, f.draggedRect = a, f.related = o || l, f.relatedRect = d || Ue(l), f.willInsertAfter = m, f.originalEvent = v, e.dispatchEvent(f), n && (u = n.call(i, f, v)), u;
}
function Nl(e) {
  e.draggable = !1;
}
function yn() {
  Wl = !1;
}
function gn(e, l, t) {
  var a = Ue(Ft(t.el, 0, t.options, !0)), o = Ga(t.el, t.options, ie), d = 10;
  return l ? e.clientX < o.left - d || e.clientY < a.top && e.clientX < a.right : e.clientY < o.top - d || e.clientY < a.bottom && e.clientX < a.left;
}
function kn(e, l, t) {
  var a = Ue(la(t.el, t.options.draggable)), o = Ga(t.el, t.options, ie), d = 10;
  return l ? e.clientX > o.right + d || e.clientY > a.bottom && e.clientX > a.left : e.clientY > o.bottom + d || e.clientX > a.right && e.clientY > a.top;
}
function wn(e, l, t, a, o, d, v, m) {
  var f = a ? e.clientY : e.clientX, i = a ? t.height : t.width, n = a ? t.top : t.left, u = a ? t.bottom : t.right, y = !1;
  if (!v) {
    if (m && ul < i * o) {
      if (!Qt && (Zt === 1 ? f > n + i * d / 2 : f < u - i * d / 2) && (Qt = !0), Qt)
        y = !0;
      else if (Zt === 1 ? f < n + ul : f > u - ul)
        return -Zt;
    } else if (f > n + i * (1 - o) / 2 && f < u - i * (1 - o) / 2)
      return Vn(l);
  }
  return y = y || v, y && (f < n + i * d / 2 || f > u - i * d / 2) ? f > n + i / 2 ? 1 : -1 : 0;
}
function Vn(e) {
  return qe(W) < qe(e) ? 1 : -1;
}
function $n(e) {
  for (var l = e.tagName + e.className + e.src + e.href + e.textContent, t = l.length, a = 0; t--; )
    a += l.charCodeAt(t);
  return a.toString(36);
}
function xn(e) {
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
  (ae.active || Rt) && e.cancelable && e.preventDefault();
});
ae.utils = {
  on: me,
  off: ce,
  css: le,
  find: ja,
  is: function(l, t) {
    return !!Je(l, t, l, !1);
  },
  extend: nn,
  throttle: qa,
  closest: Je,
  toggleClass: Fe,
  clone: Ka,
  index: qe,
  nextTick: cl,
  cancelNextTick: Kl,
  detectDirection: Ha,
  getChild: Ft,
  expando: Le
};
ae.get = function(e) {
  return e[Le];
};
ae.mount = function() {
  for (var e = arguments.length, l = new Array(e), t = 0; t < e; t++)
    l[t] = arguments[t];
  l[0].constructor === Array && (l = l[0]), l.forEach(function(a) {
    if (!a.prototype || !a.prototype.constructor)
      throw "Sortable: Mounted plugin must be a constructor function, not ".concat({}.toString.call(a));
    a.utils && (ae.utils = et(et({}, ae.utils), a.utils)), tl.mount(a);
  });
};
ae.create = function(e, l) {
  return new ae(e, l);
};
ae.version = an;
var Ee = [], Gt, Gl, Yl = !1, Ml, Ll, yl, Yt;
function Cn() {
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
      this.sortable.nativeDraggable ? ce(document, "dragover", this._handleAutoScroll) : (ce(document, "pointermove", this._handleFallbackAutoScroll), ce(document, "touchmove", this._handleFallbackAutoScroll), ce(document, "mousemove", this._handleFallbackAutoScroll)), Va(), vl(), sn();
    },
    nulling: function() {
      yl = Gl = Gt = Yl = Yt = Ml = Ll = null, Ee.length = 0;
    },
    _handleFallbackAutoScroll: function(t) {
      this._handleAutoScroll(t, !0);
    },
    _handleAutoScroll: function(t, a) {
      var o = this, d = (t.touches ? t.touches[0] : t).clientX, v = (t.touches ? t.touches[0] : t).clientY, m = document.elementFromPoint(d, v);
      if (yl = t, a || this.options.forceAutoScrollFallback || el || ot || Ht) {
        zl(t, this.options, m, a);
        var f = ct(m, !0);
        Yl && (!Yt || d !== Ml || v !== Ll) && (Yt && Va(), Yt = setInterval(function() {
          var i = ct(document.elementFromPoint(d, v), !0);
          i !== f && (f = i, vl()), zl(t, o.options, i, a);
        }, 10), Ml = d, Ll = v);
      } else {
        if (!this.options.bubbleScroll || ct(m, !0) === _e()) {
          vl();
          return;
        }
        zl(t, this.options, ct(m, !1), !1);
      }
    }
  }, at(e, {
    pluginName: "scroll",
    initializeByDefault: !0
  });
}
function vl() {
  Ee.forEach(function(e) {
    clearInterval(e.pid);
  }), Ee = [];
}
function Va() {
  clearInterval(Yt);
}
var zl = qa(function(e, l, t, a) {
  if (l.scroll) {
    var o = (e.touches ? e.touches[0] : e).clientX, d = (e.touches ? e.touches[0] : e).clientY, v = l.scrollSensitivity, m = l.scrollSpeed, f = _e(), i = !1, n;
    Gl !== t && (Gl = t, vl(), Gt = l.scroll, n = l.scrollFn, Gt === !0 && (Gt = ct(t, !0)));
    var u = 0, y = Gt;
    do {
      var p = y, w = Ue(p), S = w.top, U = w.bottom, $ = w.left, I = w.right, T = w.width, D = w.height, V = void 0, P = void 0, Z = p.scrollWidth, de = p.scrollHeight, ne = le(p), B = p.scrollLeft, O = p.scrollTop;
      p === f ? (V = T < Z && (ne.overflowX === "auto" || ne.overflowX === "scroll" || ne.overflowX === "visible"), P = D < de && (ne.overflowY === "auto" || ne.overflowY === "scroll" || ne.overflowY === "visible")) : (V = T < Z && (ne.overflowX === "auto" || ne.overflowX === "scroll"), P = D < de && (ne.overflowY === "auto" || ne.overflowY === "scroll"));
      var oe = V && (Math.abs(I - o) <= v && B + T < Z) - (Math.abs($ - o) <= v && !!B), x = P && (Math.abs(U - d) <= v && O + D < de) - (Math.abs(S - d) <= v && !!O);
      if (!Ee[u])
        for (var R = 0; R <= u; R++)
          Ee[R] || (Ee[R] = {});
      (Ee[u].vx != oe || Ee[u].vy != x || Ee[u].el !== p) && (Ee[u].el = p, Ee[u].vx = oe, Ee[u].vy = x, clearInterval(Ee[u].pid), (oe != 0 || x != 0) && (i = !0, Ee[u].pid = setInterval(function() {
        a && this.layer === 0 && ae.active._onTouchMove(yl);
        var N = Ee[this.layer].vy ? Ee[this.layer].vy * m : 0, X = Ee[this.layer].vx ? Ee[this.layer].vx * m : 0;
        typeof n == "function" && n.call(ae.dragged.parentNode[Le], X, N, e, yl, Ee[this.layer].el) !== "continue" || Wa(Ee[this.layer].el, X, N);
      }.bind({
        layer: u
      }), 24))), u++;
    } while (l.bubbleScroll && y !== f && (y = ct(y, !1)));
    Yl = i;
  }
}, 30), Qa = function(l) {
  var t = l.originalEvent, a = l.putSortable, o = l.dragEl, d = l.activeSortable, v = l.dispatchSortableEvent, m = l.hideGhostForTarget, f = l.unhideGhostForTarget;
  if (t) {
    var i = a || d;
    m();
    var n = t.changedTouches && t.changedTouches.length ? t.changedTouches[0] : t, u = document.elementFromPoint(n.clientX, n.clientY);
    f(), i && !i.el.contains(u) && (v("spill"), this.onSpill({
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
    var o = Ft(this.sortable.el, this.startIndex, this.options);
    o ? this.sortable.el.insertBefore(t, o) : this.sortable.el.appendChild(t), this.sortable.animateAll(), a && a.animateAll();
  },
  drop: Qa
};
at(aa, {
  pluginName: "revertOnSpill"
});
function oa() {
}
oa.prototype = {
  onSpill: function(l) {
    var t = l.dragEl, a = l.putSortable, o = a || this.sortable;
    o.captureAnimationState(), t.parentNode && t.parentNode.removeChild(t), o.animateAll();
  },
  drop: Qa
};
at(oa, {
  pluginName: "removeOnSpill"
});
ae.mount(new Cn());
ae.mount(oa, aa);
function Sn(e, l) {
  const t = e.oldDraggableIndex ?? e.oldIndex;
  e.item.remove();
  const a = [...e.from.children].filter((o) => o.matches(l));
  e.from.insertBefore(e.item, a[t ?? a.length] ?? null);
}
function _a(e) {
  const l = /* @__PURE__ */ new Map();
  function t(a) {
    l.get(a)?.destroy(), l.delete(a);
  }
  return ft(() => {
    for (const a of l.keys()) t(a);
  }), {
    mounted(a) {
      const o = a.querySelector(".work-field-builder") ?? a;
      l.set(a, new ae(o, {
        draggable: ".work-reorder-entry",
        handle: ".work-reorder-handle",
        forceFallback: !0,
        fallbackOnBody: !1,
        ghostClass: "work-drag-ghost",
        onEnd(d) {
          const v = d.oldDraggableIndex, m = d.newDraggableIndex;
          Sn(d, ".work-reorder-entry"), v !== void 0 && m !== void 0 && v !== m && e(v, m);
        }
      }));
    },
    unmounted: t
  };
}
const Tn = { class: "work-stack work-tight work-option-builder" }, En = { class: "work-stack work-tight" }, Un = { class: "work-stack work-tight work-small" }, Dn = { class: "work-stack work-tight work-small" }, In = { class: "work-stack work-tight" }, An = { class: "work-stack work-tight work-small" }, Pn = { class: "work-row" }, Rn = { class: "work-stack work-tight work-small" }, On = { class: "work-row" }, Nn = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, Mn = { class: "work-add-option" }, Ln = {
  key: 0,
  class: "work-muted work-small"
}, zn = /* @__PURE__ */ ve({
  __name: "OptionsEditor",
  props: {
    field: {}
  },
  emits: ["validity"],
  setup(e, { emit: l }) {
    const t = e, a = l, o = "options:" + Xl(), d = G(() => t.field.options ?? []), v = G(() => d.value.every((u, y) => !!u.id && d.value.findIndex((p) => p.id === u.id) === y));
    Ce(v, (u) => a("validity", u, o), { immediate: !0 }), ft(() => a("validity", !0, o));
    function m(u, y) {
      Aa(d.value, u, y - u), d.value.forEach((p, w) => p.order = w);
    }
    const f = _a(m), i = ["primary", "success", "info", "warn", "danger", "secondary"];
    function n() {
      let u = d.value.length + 1;
      for (; d.value.some((y) => y.id === `option_${u}`); ) u++;
      (t.field.options ??= []).push({ id: `option_${u}`, label: "New option", order: d.value.length });
    }
    return (u, y) => (c(), g("section", Tn, [
      y[4] || (y[4] = r("header", { class: "work-row" }, [
        r("h4", null, "Options"),
        r("span", { class: "work-muted work-small" }, "Stable IDs keep existing values when labels change."),
        r("span", { class: "work-spacer" })
      ], -1)),
      Qe((c(), g("div", En, [
        (c(!0), g(H, null, ee(d.value, (p, w) => (c(), g("div", {
          key: w,
          class: "work-option-row work-reorder-entry"
        }, [
          b(s(Y), {
            type: "button",
            class: "work-icon-button work-reorder-handle",
            "aria-label": "Drag option; arrow keys reorder",
            onKeydown: [
              Ae(be((S) => m(w, w - 1), ["prevent"]), ["up"]),
              Ae(be((S) => m(w, w + 1), ["prevent"]), ["down"])
            ],
            severity: "secondary",
            text: "",
            size: "small"
          }, {
            default: L(() => [
              b(s(J), {
                icon: "tabler:grip-vertical",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["onKeydown"]),
          r("label", Un, [
            y[0] || (y[0] = M("Label", -1)),
            b(s(re), {
              modelValue: p.label,
              "onUpdate:modelValue": (S) => p.label = S,
              "aria-label": "Option label"
            }, null, 8, ["modelValue", "onUpdate:modelValue"])
          ]),
          r("label", Dn, [
            y[1] || (y[1] = M("ID", -1)),
            b(s(re), {
              modelValue: p.id,
              "onUpdate:modelValue": (S) => p.id = S,
              class: "work-option-code",
              required: "",
              "aria-label": "Option ID"
            }, null, 8, ["modelValue", "onUpdate:modelValue"])
          ]),
          r("div", In, [
            r("label", An, [
              y[2] || (y[2] = M("Color", -1)),
              r("span", Pn, [
                r("span", {
                  class: mt(["work-color-swatch", "work-swatch-" + (p.color || "secondary")]),
                  "aria-hidden": "true"
                }, null, 2),
                b(s(te), {
                  modelValue: p.color,
                  "onUpdate:modelValue": (S) => p.color = S,
                  "aria-label": "Option color",
                  appendTo: "self",
                  optionLabel: "label",
                  optionValue: "value",
                  optionDisabled: "disabled",
                  options: [{ label: "Default", value: void 0, disabled: !1 }, ...(i ?? []).map((S) => ({ label: S, value: S, disabled: !1 }))]
                }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
              ])
            ]),
            r("label", Rn, [
              y[3] || (y[3] = M("Category", -1)),
              b(s(te), {
                "model-value": p.category,
                "aria-label": "Option category",
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                showClear: "",
                options: ["triage", "backlog", ...s(Ia)].map((S) => ({ label: s(Zl)(S), value: S })),
                "onUpdate:modelValue": (S) => p.category = S || void 0
              }, null, 8, ["model-value", "options", "onUpdate:modelValue"])
            ])
          ]),
          r("div", On, [
            b(s(Y), {
              "aria-label": "Option earlier",
              severity: "secondary",
              size: "small",
              disabled: w === 0,
              onClick: (S) => m(w, w - 1),
              text: ""
            }, {
              default: L(() => [
                b(s(J), {
                  icon: "tabler:arrow-up",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["disabled", "onClick"]),
            b(s(Y), {
              "aria-label": "Option later",
              severity: "secondary",
              size: "small",
              disabled: w === d.value.length - 1,
              onClick: (S) => m(w, w + 1),
              text: ""
            }, {
              default: L(() => [
                b(s(J), {
                  icon: "tabler:arrow-down",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["disabled", "onClick"]),
            b(s(Y), {
              label: "Remove",
              "aria-label": "Remove option",
              severity: "secondary",
              text: "",
              size: "small",
              onClick: (S) => d.value.splice(w, 1)
            }, {
              icon: L(() => [
                b(s(J), {
                  icon: "tabler:trash",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["onClick"])
          ])
        ]))), 128)),
        v.value ? E("", !0) : (c(), g("p", Nn, "Option IDs must be nonempty and unique.")),
        r("div", Mn, [
          b(s(Y), {
            label: "Add option",
            severity: "secondary",
            size: "small",
            onClick: n,
            outlined: ""
          }, {
            icon: L(() => [
              b(s(J), {
                icon: "tabler:plus",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          })
        ])
      ])), [
        [s(f)]
      ]),
      d.value.length ? E("", !0) : (c(), g("p", Ln, "Add the choices people can select for this field."))
    ]));
  }
}), Fn = {
  class: "work-stack",
  "aria-label": "Fields editor"
}, Bn = { class: "work-section-heading" }, jn = {
  key: 0,
  class: "work-used-by"
}, qn = { class: "kx-tag-sm" }, Wn = { class: "work-small work-muted" }, Kn = {
  key: 0,
  class: "work-error work-small",
  role: "alert"
}, Gn = { class: "work-settings-grid work-field-properties" }, Yn = { class: "work-stack work-tight" }, Hn = { class: "work-stack work-tight" }, Xn = { class: "work-stack work-tight" }, Jn = { class: "work-stack work-tight" }, Zn = { class: "work-stack work-tight" }, Qn = { class: "work-stack work-tight work-field-history" }, _n = { class: "work-settings-list" }, es = { class: "work-settings-row" }, ts = { class: "work-settings-row" }, ls = {
  key: 2,
  class: "work-stack work-tight"
}, as = {
  key: 3,
  class: "work-stack work-tight"
}, os = { class: "work-stack work-tight" }, is = { class: "work-stack work-tight" }, ns = { class: "work-stack work-tight" }, ss = { class: "work-stack work-tight" }, rs = { class: "work-stack" }, ds = {
  key: 0,
  class: "work-stack work-tight"
}, us = { class: "work-row work-add-definition" }, cs = { class: "work-stack work-tight" }, vs = /* @__PURE__ */ ve({
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
    const t = e, a = l, o = G(() => t.draft.fields ?? []), d = z(""), v = z(""), m = z({}), f = _a(($, I) => w($, I - $));
    function i($) {
      return (t.draft.item_types ?? []).filter((I) => I.fields.includes($)).map((I) => I.title || ge(I.id));
    }
    async function n($) {
      if (!v.value) {
        v.value = $.code;
        try {
          const I = await t.guardRemoval?.("fields", $.code);
          m.value[$.code] = I ?? "", I || _t(t.draft, "fields", $.code);
        } finally {
          v.value = "";
        }
      }
    }
    const u = Object.entries({ text: "Text", int: "Whole number", dec: "Decimal number", quantity: "Measurement", bool: "Yes or no", time: "Date or time", ref: "Reference", record: "Structured data", option: "Choice", principal: "Person or group", item: "Work item", rank: "Order", rich_text: "Formatted text", formula: "Formula", rollup: "Related item calculation", counter: "Counter" }).map(([$, I]) => ({ value: $, label: I }));
    function y($) {
      return $.type && $.type !== "value" ? $.type : $.form;
    }
    function p($, I) {
      const T = { option: "text", principal: "ref", item: "ref", rank: "text", rich_text: "text", formula: "int", rollup: "int", counter: "int" };
      T[I] ? ($.type = I, $.form = T[I]) : (delete $.type, $.form = I), I !== "option" ? delete $.options : $.options ??= [], I === "rich_text" && ($.config = { format: "json" });
    }
    function w($, I) {
      Aa(o.value, $, I);
      for (const T of t.draft.item_types ?? []) {
        const D = new Set(T.fields);
        T.fields = o.value.filter((V) => D.has(V.code)).map((V) => V.code);
      }
    }
    function S($, I) {
      try {
        xo(t.draft, $, I.value), delete m.value[$.code];
      } catch (T) {
        m.value[$.code] = T.message, I.value = $.code;
      }
    }
    function U() {
      !/^[a-z][a-z0-9_]*$/.test(d.value) || o.value.some(($) => $.code === d.value) || ((t.draft.fields ??= []).push({ code: d.value, form: "text", cardinality: "one" }), d.value = "");
    }
    return ($, I) => (c(), g("section", Fn, [
      r("header", Bn, [
        I[2] || (I[2] = r("div", null, [
          r("h2", null, "Fields"),
          r("p", { class: "work-muted work-small" }, "Shape the information each item carries. Drag the handle or use the arrows to arrange fields.")
        ], -1)),
        b(s(Re), {
          class: "kx-tag-sm",
          severity: "secondary"
        }, {
          default: L(() => [
            M(A(o.value.length) + " " + A(o.value.length === 1 ? "field" : "fields"), 1)
          ]),
          _: 1
        })
      ]),
      Qe((c(), F($l, {
        columns: "fields",
        count: o.value.length
      }, {
        default: L(() => [
          (c(!0), g(H, null, ee(o.value, (T, D) => (c(), F(Vl, {
            title: s(Ct)(T),
            code: T.code,
            kind: e.installedTypes?.find((V) => V.id === y(T))?.title || s(u).find((V) => V.value === y(T))?.label || s(ge)(y(T)),
            key: T.id ?? D,
            class: "work-field-row work-reorder-entry work-stack"
          }, {
            handle: L(() => [
              b(s(Y), {
                type: "button",
                class: "work-reorder-handle work-icon-button",
                "aria-label": "Drag " + T.code + "; arrow keys reorder",
                onKeydown: [
                  Ae(be((V) => w(D, -1), ["prevent"]), ["up"]),
                  Ae(be((V) => w(D, 1), ["prevent"]), ["down"])
                ],
                severity: "secondary",
                text: "",
                size: "small"
              }, {
                default: L(() => [
                  b(s(J), {
                    icon: "tabler:grip-vertical",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["aria-label", "onKeydown"])
            ]),
            flags: L(() => [
              T.track ? (c(), F(s(Re), {
                key: 0,
                class: "kx-tag-sm",
                severity: "secondary",
                value: "Tracked"
              })) : E("", !0),
              T.intervals ? (c(), F(s(Re), {
                key: 1,
                class: "kx-tag-sm",
                severity: "secondary",
                value: "Intervals"
              })) : E("", !0)
            ]),
            usage: L(() => [
              i(T.code).length ? (c(), g("details", jn, [
                r("summary", qn, "Used by " + A(i(T.code).length) + " " + A(i(T.code).length === 1 ? "type" : "types"), 1),
                r("span", Wn, A(i(T.code).join(", ")), 1)
              ])) : E("", !0)
            ]),
            actions: L(() => [
              b(s(Y), {
                "aria-label": "Move " + T.code + " earlier",
                severity: "secondary",
                disabled: D === 0,
                onClick: (V) => w(D, -1),
                text: "",
                size: "small"
              }, {
                default: L(() => [
                  b(s(J), {
                    icon: "tabler:arrow-up",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["aria-label", "disabled", "onClick"]),
              b(s(Y), {
                "aria-label": "Move " + T.code + " later",
                severity: "secondary",
                disabled: D === o.value.length - 1,
                onClick: (V) => w(D, 1),
                text: "",
                size: "small"
              }, {
                default: L(() => [
                  b(s(J), {
                    icon: "tabler:arrow-down",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["aria-label", "disabled", "onClick"]),
              b(s(Y), {
                severity: "secondary",
                text: "",
                size: "small",
                disabled: !!v.value,
                onClick: (V) => n(T),
                "aria-label": "Remove field"
              }, {
                default: L(() => [
                  b(s(J), {
                    icon: "tabler:trash",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["disabled", "onClick"])
            ]),
            default: L(() => [
              m.value[T.code] ? (c(), g("p", Kn, A(m.value[T.code]), 1)) : E("", !0),
              (c(!0), g(H, null, ee(e.issues?.filter((V) => V.code === T.code) ?? [], (V) => (c(), g("p", {
                key: V.what,
                class: "work-error work-small",
                role: "alert"
              }, A(s(wl)(V)) + " · " + A(V.what), 1))), 128)),
              r("div", Gn, [
                r("label", Yn, [
                  I[3] || (I[3] = M("Title", -1)),
                  b(s(re), {
                    modelValue: T.title,
                    "onUpdate:modelValue": (V) => T.title = V,
                    "aria-label": "Field title",
                    maxlength: "255",
                    placeholder: s(Ct)(T)
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder"])
                ]),
                r("label", Hn, [
                  I[4] || (I[4] = M("Field identifier", -1)),
                  b(s(re), {
                    value: T.code,
                    "aria-label": "Field code",
                    required: "",
                    pattern: "[a-z][a-z0-9_]*",
                    onInput: (V) => S(T, V.target)
                  }, null, 8, ["value", "onInput"])
                ]),
                r("label", Xn, [
                  I[5] || (I[5] = M("Kind", -1)),
                  b(s(te), {
                    "model-value": y(T),
                    "onUpdate:modelValue": (V) => p(T, V),
                    appendTo: "self",
                    options: s(u),
                    optionLabel: "label",
                    optionValue: "value"
                  }, null, 8, ["model-value", "onUpdate:modelValue", "options"])
                ]),
                r("label", Jn, [
                  I[6] || (I[6] = M("Values allowed", -1)),
                  b(s(te), {
                    "model-value": T.cardinality ?? "one",
                    "onUpdate:modelValue": (V) => T.cardinality = V,
                    appendTo: "self",
                    options: [{ label: "One value", value: "one" }, { label: "Multiple unique values", value: "set" }, { label: "Ordered values", value: "list" }],
                    optionLabel: "label",
                    optionValue: "value"
                  }, null, 8, ["model-value", "onUpdate:modelValue"])
                ]),
                r("label", Zn, [
                  I[7] || (I[7] = M("Search support", -1)),
                  b(s(te), {
                    "model-value": T.index ?? "none",
                    "onUpdate:modelValue": (V) => T.index = V,
                    appendTo: "self",
                    options: [{ label: "None", value: "none" }, { label: "Exact matches", value: "key" }, { label: "Numeric ranges", value: "number" }],
                    optionLabel: "label",
                    optionValue: "value"
                  }, null, 8, ["model-value", "onUpdate:modelValue"])
                ])
              ]),
              r("section", Qn, [
                I[10] || (I[10] = r("h4", { class: "work-group-title" }, "History", -1)),
                r("div", _n, [
                  r("div", es, [
                    I[8] || (I[8] = r("div", { class: "work-row-main" }, [
                      r("strong", null, "Track changes"),
                      r("p", { class: "work-muted work-small" }, "Record each value change in the item history.")
                    ], -1)),
                    b(s(ze), {
                      modelValue: T.track,
                      "onUpdate:modelValue": (V) => T.track = V,
                      "aria-label": "Track changes"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ]),
                  r("div", ts, [
                    I[9] || (I[9] = r("div", { class: "work-row-main" }, [
                      r("strong", null, "Track intervals"),
                      r("p", { class: "work-muted work-small" }, "Measure how long each value stays in effect.")
                    ], -1)),
                    b(s(ze), {
                      modelValue: T.intervals,
                      "onUpdate:modelValue": (V) => T.intervals = V,
                      "aria-label": "Track intervals"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ])
                ])
              ]),
              T.type === "option" ? (c(), F(zn, {
                key: 1,
                field: T,
                onValidity: I[0] || (I[0] = (V, P) => a("validity", P, V))
              }, null, 8, ["field"])) : E("", !0),
              T.type === "formula" || T.type === "rollup" ? (c(), g("label", ls, [
                I[11] || (I[11] = M("Result type", -1)),
                b(s(te), {
                  modelValue: T.form,
                  "onUpdate:modelValue": (V) => T.form = V,
                  "aria-label": "Result type",
                  options: s(u).slice(0, 8),
                  optionLabel: "label",
                  optionValue: "value",
                  appendTo: "self"
                }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
              ])) : E("", !0),
              T.type === "formula" ? (c(), g("label", as, [
                I[12] || (I[12] = M("Expression", -1)),
                b(s(re), {
                  modelValue: T.expression,
                  "onUpdate:modelValue": (V) => T.expression = V
                }, null, 8, ["modelValue", "onUpdate:modelValue"])
              ])) : E("", !0),
              T.type === "rollup" ? (c(), g(H, { key: 4 }, [
                r("label", os, [
                  I[13] || (I[13] = M("Of", -1)),
                  b(s(re), {
                    modelValue: T.of,
                    "onUpdate:modelValue": (V) => T.of = V
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                r("label", is, [
                  I[14] || (I[14] = M("Function", -1)),
                  b(s(re), {
                    modelValue: T.fn,
                    "onUpdate:modelValue": (V) => T.fn = V
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                r("label", ns, [
                  I[15] || (I[15] = M("Field", -1)),
                  b(s(re), {
                    modelValue: T.field,
                    "onUpdate:modelValue": (V) => T.field = V
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                r("label", ss, [
                  I[16] || (I[16] = M("Order by", -1)),
                  b(s(te), {
                    "model-value": T.by,
                    "aria-label": "Rollup order",
                    options: ["rank", "time"],
                    showClear: "",
                    appendTo: "self",
                    "onUpdate:modelValue": (V) => T.by = V || void 0
                  }, null, 8, ["model-value", "onUpdate:modelValue"])
                ]),
                b(_l, {
                  modelValue: T.where,
                  "onUpdate:modelValue": (V) => T.where = V,
                  draft: e.draft,
                  "board-id": e.boardId,
                  label: "Include related items when",
                  onValidity: (V) => a("validity", "rollup-" + D, V)
                }, null, 8, ["modelValue", "onUpdate:modelValue", "draft", "board-id", "onValidity"])
              ], 64)) : E("", !0),
              ["dec", "quantity", "ref", "time", "record"].includes(T.form) || T.config ? (c(), F(lt, {
                key: 5,
                label: "Field configuration",
                "model-value": T.config,
                shape: "object",
                "onUpdate:modelValue": (V) => T.config = V,
                onValidity: (V) => a("validity", "config-" + D, V)
              }, null, 8, ["model-value", "onUpdate:modelValue", "onValidity"])) : E("", !0),
              r("section", rs, [
                I[18] || (I[18] = r("h4", { class: "work-group-title" }, "Access", -1)),
                e.installedTypes?.length ? (c(), g("label", ds, [
                  I[17] || (I[17] = M("Custom field type", -1)),
                  b(s(te), {
                    "model-value": T.type,
                    options: e.installedTypes,
                    optionLabel: "title",
                    optionValue: "id",
                    appendTo: "self",
                    "onUpdate:modelValue": (V) => T.type = V
                  }, null, 8, ["model-value", "options", "onUpdate:modelValue"])
                ])) : E("", !0),
                (c(), g(H, null, ee(["read", "write"], (V) => b(La, {
                  "board-id": e.boardId,
                  key: V,
                  label: V === "read" ? "Who can read" : "Who can edit",
                  "model-value": T.access?.[V],
                  "onUpdate:modelValue": (P) => T.access = { ...T.access, [V]: P },
                  onValidity: (P) => a("validity", "access-" + D + V, P)
                }, null, 8, ["board-id", "label", "model-value", "onUpdate:modelValue", "onValidity"])), 64))
              ])
            ]),
            _: 2
          }, 1032, ["title", "code", "kind"]))), 128)),
          r("div", us, [
            r("label", cs, [
              I[19] || (I[19] = M("New field identifier", -1)),
              b(s(re), {
                modelValue: d.value,
                "onUpdate:modelValue": I[1] || (I[1] = (T) => d.value = T),
                onKeydown: Ae(be(U, ["prevent"]), ["enter"])
              }, null, 8, ["modelValue", "onKeydown"])
            ]),
            b(s(Y), {
              label: "Add field",
              severity: "secondary",
              disabled: !d.value.trim(),
              onClick: U,
              outlined: ""
            }, {
              icon: L(() => [
                b(s(J), {
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
        [s(f)]
      ])
    ]));
  }
}), ms = ["disabled"], fs = { class: "work-chips" }, ps = {
  key: 1,
  class: "work-muted work-small"
}, zt = /* @__PURE__ */ ve({
  __name: "ChipPicker",
  props: {
    label: {},
    options: {},
    modelValue: {},
    disabled: { type: Boolean }
  },
  emits: ["update:modelValue"],
  setup(e, { emit: l }) {
    const t = e, a = l, o = z(""), d = G(() => t.options.map((f) => typeof f == "string" ? { value: f } : f)), v = G(() => d.value.filter((f) => (f.label ?? ge(f.value)).toLocaleLowerCase().includes(o.value.toLocaleLowerCase())));
    function m(f) {
      if (t.disabled) return;
      const i = t.modelValue ?? [];
      a("update:modelValue", i.includes(f) ? i.filter((n) => n !== f) : [...i, f]);
    }
    return (f, i) => (c(), g("fieldset", {
      class: "work-chip-picker",
      disabled: e.disabled
    }, [
      r("legend", null, A(e.label), 1),
      e.options.length > 10 ? (c(), F(s(re), {
        key: 0,
        modelValue: o.value,
        "onUpdate:modelValue": i[0] || (i[0] = (n) => o.value = n),
        type: "search",
        "aria-label": "Find " + e.label.toLowerCase(),
        placeholder: "Find a choice…"
      }, null, 8, ["modelValue", "aria-label"])) : E("", !0),
      r("div", fs, [
        b(s(Ql), {
          "model-value": e.modelValue ?? [],
          options: v.value.map((n) => ({ value: n.value, label: n.label ?? s(ge)(n.value) })),
          optionLabel: "label",
          optionValue: "value",
          multiple: "",
          disabled: e.disabled,
          "aria-label": e.label,
          "onUpdate:modelValue": i[1] || (i[1] = (n) => a("update:modelValue", n ?? []))
        }, null, 8, ["model-value", "options", "disabled", "aria-label"]),
        (c(!0), g(H, null, ee(e.modelValue?.filter((n) => !d.value.some((u) => u.value === n)) ?? [], (n) => (c(), F(s(Y), {
          severity: "secondary",
          text: "",
          size: "small",
          key: n,
          type: "button",
          class: "work-choice work-unavailable",
          "aria-label": "Remove unavailable " + n,
          onClick: (u) => m(n)
        }, {
          default: L(() => [
            M(A(s(ge)(n)) + " · unavailable ×", 1)
          ]),
          _: 2
        }, 1032, ["aria-label", "onClick"]))), 128))
      ]),
      e.options.length ? E("", !0) : (c(), g("span", ps, "No choices declared."))
    ], 8, ms));
  }
}), bs = {
  class: "work-stack",
  "aria-label": "Item types editor"
}, hs = { class: "work-section-heading" }, ys = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, gs = { class: "work-definition-meta" }, ks = { class: "work-settings-grid" }, ws = { class: "work-stack work-tight" }, Vs = { class: "work-stack work-tight" }, $s = { class: "work-stack work-tight" }, xs = { class: "work-stack work-tight" }, Cs = {
  key: 0,
  class: "work-stack work-tight work-small"
}, Ss = {
  key: 0,
  class: "kx-empty"
}, Ts = { class: "work-row work-add-definition" }, Es = { class: "work-stack work-tight" }, Us = {
  key: 0,
  class: "work-error work-small"
}, Ds = /* @__PURE__ */ ve({
  __name: "TypesEditor",
  props: {
    draft: {},
    guardRemoval: { type: Function },
    issues: {}
  },
  setup(e) {
    const l = e, t = G(() => l.draft.item_types ?? []), a = z(""), o = z(""), d = z(""), v = G(() => /^[a-z][a-z0-9_]*$/.test(a.value) && !t.value.some((y) => y.id === a.value));
    function m() {
      v.value && ((l.draft.item_types ??= []).push({ id: a.value, title: ge(a.value), process: l.draft.processes?.[0]?.id ?? "", fields: [] }), a.value = "");
    }
    function f(y, p) {
      const w = y.id;
      y.id = p;
      for (const S of t.value) S.parent_types && (S.parent_types = S.parent_types.map((U) => U === w ? p : U));
    }
    function i(y, p) {
      y.fields = p, y.inherit && (y.inherit = y.inherit.filter((w) => p.includes(w)));
    }
    function n(y) {
      return t.value.filter((p) => p.id !== y.id && p.parent_types?.includes(y.id)).map((p) => p.title || ge(p.id));
    }
    async function u(y) {
      if (!d.value) {
        if (n(y).length) {
          o.value = `${y.title || ge(y.id)} is a parent type for ${n(y).join(", ")}. Remove those parent selections first.`;
          return;
        }
        d.value = y.id, o.value = "";
        try {
          const p = await l.guardRemoval?.("item_types", y.id);
          p ? o.value = p : _t(l.draft, "item_types", y.id);
        } finally {
          d.value = "";
        }
      }
    }
    return (y, p) => (c(), g("section", bs, [
      r("header", hs, [
        p[1] || (p[1] = r("div", null, [
          r("h2", null, "Item types"),
          r("p", { class: "work-muted work-small" }, "Choose the fields, parent relationships and process for each kind of work.")
        ], -1)),
        b(s(Re), {
          class: "kx-tag-sm",
          severity: "secondary"
        }, {
          default: L(() => [
            M(A(t.value.length) + " " + A(t.value.length === 1 ? "type" : "types"), 1)
          ]),
          _: 1
        })
      ]),
      o.value ? (c(), g("p", ys, A(o.value), 1)) : E("", !0),
      b($l, {
        columns: "types",
        count: t.value.length
      }, {
        default: L(() => [
          (c(!0), g(H, null, ee(t.value, (w, S) => (c(), F(Vl, {
            title: w.title || s(ge)(w.id),
            code: w.id,
            kind: e.draft.processes?.find((U) => U.id === w.process)?.name || s(ge)(w.process),
            key: S,
            class: "work-type-card"
          }, {
            usage: L(() => [
              r("span", gs, [
                b(s(Re), {
                  class: "kx-tag-sm",
                  severity: "secondary"
                }, {
                  default: L(() => [
                    M(A(w.fields.length) + " " + A(w.fields.length === 1 ? "field" : "fields"), 1)
                  ]),
                  _: 2
                }, 1024),
                n(w).length ? (c(), F(s(Re), {
                  key: 0,
                  class: "kx-tag-sm",
                  severity: "secondary"
                }, {
                  default: L(() => [
                    M("Parent of " + A(n(w).join(", ")), 1)
                  ]),
                  _: 2
                }, 1024)) : E("", !0)
              ])
            ]),
            actions: L(() => [
              b(s(Y), {
                severity: "secondary",
                text: "",
                size: "small",
                disabled: !!d.value,
                onClick: (U) => u(w),
                "aria-label": "Remove type"
              }, {
                default: L(() => [
                  b(s(J), {
                    icon: "tabler:trash",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["disabled", "onClick"])
            ]),
            default: L(() => [
              (c(!0), g(H, null, ee(e.issues?.filter((U) => U.code === "item_type " + w.id) ?? [], (U) => (c(), g("p", {
                key: U.what,
                class: "work-error work-small",
                role: "alert"
              }, A(s(wl)(U)), 1))), 128)),
              r("div", ks, [
                r("label", ws, [
                  p[2] || (p[2] = M("Identifier", -1)),
                  b(s(re), {
                    value: w.id,
                    onChange: (U) => f(w, U.target.value),
                    required: "",
                    pattern: "[a-z][a-z0-9_]*"
                  }, null, 8, ["value", "onChange"])
                ]),
                r("label", Vs, [
                  p[3] || (p[3] = M("Title", -1)),
                  b(s(re), {
                    modelValue: w.title,
                    "onUpdate:modelValue": (U) => w.title = U,
                    placeholder: s(ge)(w.id)
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder"])
                ]),
                r("label", $s, [
                  p[4] || (p[4] = M("Process", -1)),
                  b(s(te), {
                    modelValue: w.process,
                    "onUpdate:modelValue": (U) => w.process = U,
                    required: "",
                    appendTo: "self",
                    optionLabel: "label",
                    optionValue: "value",
                    optionDisabled: "disabled",
                    options: [...(e.draft.processes ?? []).map((U) => ({ label: U.name || s(ge)(U.id), value: U.id, disabled: !1 }))]
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                ])
              ]),
              b(zt, {
                label: "Fields",
                options: (e.draft.fields ?? []).map((U) => ({ value: U.code, label: s(Ct)(U) })),
                "model-value": w.fields,
                "onUpdate:modelValue": (U) => i(w, U)
              }, null, 8, ["options", "model-value", "onUpdate:modelValue"]),
              b(zt, {
                label: "Parent types",
                options: t.value.map((U) => ({ value: U.id, label: U.title || s(ge)(U.id) })),
                modelValue: w.parent_types,
                "onUpdate:modelValue": (U) => w.parent_types = U
              }, null, 8, ["options", "modelValue", "onUpdate:modelValue"]),
              r("div", xs, [
                b(zt, {
                  label: "Inherit from parent",
                  options: w.fields.map((U) => ({ value: U, label: s(Ct)(e.draft.fields?.find(($) => $.code === U) ?? { code: U }) })),
                  modelValue: w.inherit,
                  "onUpdate:modelValue": (U) => w.inherit = U
                }, null, 8, ["options", "modelValue", "onUpdate:modelValue"]),
                p[5] || (p[5] = r("p", { class: "work-muted work-small" }, "These fields resolve from the parent when this item has no own value.", -1))
              ]),
              w.parent_types?.length ? (c(), g("label", Cs, [
                p[6] || (p[6] = M("When the parent moves", -1)),
                b(s(te), {
                  modelValue: w.move_children,
                  "onUpdate:modelValue": (U) => w.move_children = U,
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
          t.value.length ? E("", !0) : (c(), g("p", Ss, "Add an item type to connect fields to a process.")),
          r("div", Ts, [
            r("label", Es, [
              p[7] || (p[7] = M("New type identifier", -1)),
              b(s(re), {
                modelValue: a.value,
                "onUpdate:modelValue": p[0] || (p[0] = (w) => a.value = w),
                placeholder: "new_type",
                onKeydown: Ae(be(m, ["prevent"]), ["enter"])
              }, null, 8, ["modelValue", "onKeydown"])
            ]),
            b(s(Y), {
              label: "Add type",
              severity: "secondary",
              disabled: !v.value,
              onClick: m,
              outlined: ""
            }, {
              icon: L(() => [
                b(s(J), {
                  icon: "tabler:plus",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["disabled"]),
            a.value && !v.value ? (c(), g("span", Us, "Use a unique lowercase identifier with letters, numbers and underscores.")) : E("", !0)
          ])
        ]),
        _: 1
      }, 8, ["count"])
    ]));
  }
}), Is = ".work-process-canvas>svg{height:480px;width:100%}.work-process-canvas:focus-visible{outline:var(--p-focus-ring-width) var(--p-focus-ring-style) var(--p-focus-ring-color);outline-offset:var(--p-focus-ring-offset)}.work-state-card{fill:var(--p-content-background);stroke:var(--p-content-border-color);stroke-width:1.5}.work-graph-node.work-selected .work-state-card{stroke:var(--p-primary-color);stroke-width:2.5;fill:color-mix(in srgb,var(--p-primary-color) 6%,var(--p-content-background))}.work-graph-node:focus-visible .work-state-card{stroke:var(--p-focus-ring-color);stroke-width:var(--p-focus-ring-width)}.work-process-canvas .work-edge-label{font-size:12px;fill:var(--p-text-color)}.work-process-canvas .work-edge-label-bg{fill:var(--p-content-background);stroke:var(--p-content-border-color);stroke-width:1}.work-edge-line{stroke:var(--p-primary-color);stroke-width:1.5}.work-edge-return .work-edge-line{stroke:var(--p-text-muted-color);stroke-dasharray:5 4}.work-graph-arrow{fill:context-stroke}.work-lane-line{fill:none;stroke:var(--p-text-muted-color);stroke-width:1.5;stroke-dasharray:2 4}.work-node-connector{fill:var(--p-content-background);stroke:var(--p-primary-color);stroke-width:1.5}.work-node-connector:hover,.work-node-connector:focus-visible{fill:var(--p-primary-color)}.work-process-legend{position:static;flex-wrap:wrap;padding:10px 16px;border-top:1px solid var(--p-content-border-color);background:var(--p-content-background)}@media(max-width:700px){.work-process-canvas>svg{height:420px}}.work-process-more{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:8px;padding:8px 16px;border-top:1px solid var(--p-content-border-color);background:var(--p-content-background);color:var(--p-text-muted-color);font-size:12px}.work-process-canvas .work-graph-edge.work-selected .work-edge-label-bg{fill:var(--p-primary-color);stroke:var(--p-primary-color)}.work-process-canvas .work-graph-edge.work-selected .work-edge-label{fill:var(--p-primary-contrast-color)}", $a = /* @__PURE__ */ new WeakSet();
function As(e) {
  const l = e.getRootNode();
  if (l instanceof ShadowRoot && !$a.has(l)) {
    const t = e.ownerDocument.createElement("style");
    t.textContent = Is, l.append(t), $a.add(l);
  }
}
const Ps = 0.8;
function Rs(e, l, t) {
  const a = Math.min(1, l.width / e.width, l.height / e.height);
  if (a >= Ps) return { zoom: a, pan: { x: (e.width - l.width / a) / 2, y: (e.height - l.height / a) / 2 } };
  const o = e.nodes.find((v) => v.state.id === t) ?? e.nodes[0], d = Math.min(1, l.width / ((o?.width ?? 190) + 64));
  return { zoom: d, pan: o ? { x: e.direction === "TB" ? o.x - l.width / d / 2 : o.x - o.width / 2 - 32, y: e.direction === "TB" ? o.y - o.height / 2 - 32 : o.y - l.height / d / 2 } : { x: 0, y: 0 } };
}
const Os = ["onKeydown"], Ns = {
  key: 0,
  class: "work-process-instruction",
  role: "status"
}, Ms = ["viewBox"], Ls = ["id"], zs = ["d", "marker-end"], Fs = ["aria-label", "aria-pressed", "onFocus", "onClick", "onKeydown"], Bs = ["d"], js = ["d", "marker-end"], qs = ["x", "y", "width", "height"], Ws = ["x", "y"], Ks = ["x", "dy"], Gs = ["aria-label", "aria-pressed", "onClick", "onKeydown", "onFocus", "onPointerup"], Ys = ["x", "y", "width", "height"], Hs = ["cx", "cy"], Xs = ["x", "y"], Js = ["x", "dy"], Zs = ["x", "y"], Qs = ["x", "dy"], _s = {
  key: 0,
  class: "work-limit-text"
}, er = ["aria-label", "onClick", "onKeydown"], tr = ["x", "y"], lr = ["x", "dy"], ar = ["cx", "cy", "aria-label", "onPointerdown", "onClick", "onKeydown"], or = ["d"], ir = {
  key: 1,
  class: "work-process-more",
  role: "status"
}, nr = { class: "work-process-legend" }, sr = /* @__PURE__ */ ve({
  __name: "ProcessGraph",
  props: {
    process: {},
    draft: {},
    selectedState: {},
    selectedTransition: {}
  },
  emits: ["state", "transition", "connect", "clear"],
  setup(e, { expose: l, emit: t }) {
    const a = e, o = t, d = Xl().replace(/:/g, "_"), v = z(""), m = z(), f = z(), i = z(900), n = z(!1), u = G(() => i.value < 700 ? 420 : 480), y = G(() => Bo(a.process, a.draft, { width: i.value, height: u.value })), p = z(1), w = z({ x: 0, y: 0 }), S = z({ x: 0, y: 0 }), U = G(() => ({ width: i.value, height: n.value ? Math.max(u.value, y.value.height * Math.min(1, i.value / y.value.width)) : u.value })), $ = G(() => y.value.nodes.filter((h) => h.x - h.width / 2 >= w.value.x && h.x + h.width / 2 <= w.value.x + U.value.width / p.value && h.y - h.height / 2 >= w.value.y && h.y + h.height / 2 <= w.value.y + U.value.height / p.value).length);
    function I() {
      n.value = !1;
      const h = Rs(y.value, U.value, a.process.initial);
      p.value = h.zoom, w.value = h.pan;
    }
    const T = G(() => `${w.value.x} ${w.value.y} ${U.value.width / p.value} ${U.value.height / p.value}`), D = G(() => y.value.nodes.find((h) => h.state.id === v.value));
    function V() {
      n.value = !0, p.value = Math.min(1, U.value.width / y.value.width), w.value = { x: (y.value.width - U.value.width / p.value) / 2, y: 0 };
    }
    function P(h) {
      const C = Math.max(0.02, Math.min(3, p.value * h)), k = 1 / p.value - 1 / C;
      w.value = { x: w.value.x + U.value.width * k / 2, y: w.value.y + U.value.height * k / 2 }, p.value = C;
    }
    function Z(h) {
      const C = U.value.width / p.value, k = U.value.height / p.value;
      (h.x - h.width / 2 < w.value.x || h.x + h.width / 2 > w.value.x + C || h.y - h.height / 2 < w.value.y || h.y + h.height / 2 > w.value.y + k) && (w.value = { x: h.x - C / 2, y: h.y - k / 2 });
    }
    function de() {
      const h = y.value.nodes.find((C) => C.state === a.selectedState) ?? y.value.edges.find((C) => C.transition === a.selectedTransition);
      h && Z(h);
    }
    Ce([y, () => a.selectedState, () => a.selectedTransition], de, { flush: "post" }), Ce(() => a.process.id, () => {
      v.value = "", R.clear(), I();
    }, { flush: "post" });
    function ne(h) {
      if (h.target !== m.value) return;
      (h.key === "+" || h.key === "=") && (h.preventDefault(), P(1.2)), h.key === "-" && (h.preventDefault(), P(1 / 1.2)), h.key === "0" && (h.preventDefault(), V());
      const C = 60 / p.value;
      h.key.startsWith("Arrow") && (h.preventDefault(), w.value = { x: w.value.x + (h.key === "ArrowRight" ? C : h.key === "ArrowLeft" ? -C : 0), y: w.value.y + (h.key === "ArrowDown" ? C : h.key === "ArrowUp" ? -C : 0) });
    }
    function B(h) {
      v.value && v.value !== h.id && o("connect", v.value, h.id), v.value = "";
    }
    function O(h, C) {
      v.value = C.state.id, S.value = { x: C.x, y: C.y };
      const k = h.target;
      k instanceof Element && k.hasPointerCapture?.(h.pointerId) && k.releasePointerCapture(h.pointerId);
    }
    function oe(h, C) {
      if ((h.key === "Enter" || h.key === " ") && (h.preventDefault(), v.value ? B(C) : o("state", C)), ["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp"].includes(h.key)) {
        h.preventDefault();
        const k = Array.from(f.value?.querySelectorAll(".work-graph-node") ?? []), j = y.value.nodes.findIndex((se) => se.state === C), K = ["ArrowRight", "ArrowDown"].includes(h.key) ? 1 : -1;
        k[(j + K + k.length) % k.length]?.focus();
      }
    }
    function x() {
      v.value = "", R.clear(), o("clear");
    }
    const R = /* @__PURE__ */ new Map();
    let N = 0;
    function X(h) {
      if (!h.target.closest('[role="button"]') && (R.set(h.pointerId, { x: h.clientX, y: h.clientY }), m.value?.setPointerCapture?.(h.pointerId), R.size === 2)) {
        const [C, k] = [...R.values()];
        N = Math.hypot(C.x - k.x, C.y - k.y);
      }
    }
    function ue(h) {
      const C = f.value?.getBoundingClientRect();
      if (!C?.width) return;
      if (v.value) {
        S.value = { x: w.value.x + (h.clientX - C.left) * U.value.width / p.value / C.width, y: w.value.y + (h.clientY - C.top) * U.value.height / p.value / C.height };
        return;
      }
      const k = R.get(h.pointerId);
      if (k)
        if (R.set(h.pointerId, { x: h.clientX, y: h.clientY }), R.size === 2) {
          const [j, K] = [...R.values()], se = Math.hypot(j.x - K.x, j.y - K.y);
          N && P(se / N), N = se;
        } else w.value = { x: w.value.x - (h.clientX - k.x) * U.value.width / p.value / C.width, y: w.value.y - (h.clientY - k.y) * U.value.height / p.value / C.height };
    }
    function pe(h) {
      R.delete(h.pointerId), N = 0, v.value = "";
    }
    function ke(h) {
      h.ctrlKey && (h.preventDefault(), P(Math.exp(-h.deltaY * 0.01)));
    }
    let Ve;
    kl(() => {
      if (m.value && As(m.value), typeof ResizeObserver < "u" && f.value) {
        let h = !0;
        Ve = new ResizeObserver(() => {
          const C = f.value?.getBoundingClientRect();
          if (!C?.width || !C.height) return;
          const k = U.value.width;
          i.value = C.width, (h || Math.abs(C.width - k) > 1) && (n.value ? V() : I(), h = !1), de();
        }), Ve.observe(f.value);
      }
    }), ft(() => Ve?.disconnect()), l({ fit: V, zoomIn: () => P(1.2), zoomOut: () => P(1 / 1.2) });
    function De(h) {
      return h.category === "completed" ? "check" : h.category === "canceled" ? "x" : h.id === a.process.initial ? "arrow-bar-to-right" : { gate: "shield-check", automated: "bolt", parallel: "arrows-split" }[h.kind ?? ""] ?? "user";
    }
    return (h, C) => (c(), g("section", {
      ref_key: "canvas",
      ref: m,
      class: "work-process-canvas",
      "aria-label": "Process map",
      tabindex: "0",
      onKeydown: [
        ne,
        Ae(be(x, ["stop"]), ["esc"])
      ],
      onPointerdown: X,
      onPointermove: ue,
      onPointerup: pe,
      onPointercancel: x,
      onWheel: ke
    }, [
      v.value ? (c(), g("p", Ns, "Choose the next stop. Escape cancels.")) : E("", !0),
      (c(), g("svg", {
        ref_key: "svg",
        ref: f,
        style: mo({ height: U.value.height + "px" }),
        viewBox: T.value,
        role: "group",
        "aria-label": "States and transitions"
      }, [
        r("defs", null, [
          r("marker", {
            id: s(d) + "-arrow",
            viewBox: "0 0 8 8",
            refX: "7",
            refY: "4",
            markerWidth: "6",
            markerHeight: "6",
            orient: "auto"
          }, [...C[1] || (C[1] = [
            r("path", {
              d: "M0 0 L8 4 L0 8 z",
              class: "work-graph-arrow"
            }, null, -1)
          ])], 8, Ls)
        ]),
        (c(!0), g(H, null, ee(y.value.parallels, (k) => (c(), g("path", {
          key: k.key,
          d: k.path,
          class: "work-lane-line",
          "marker-end": `url(#${s(d)}-arrow)`
        }, [
          r("title", null, "Parallel lane from " + A(s(he)(k.state)), 1)
        ], 8, zs))), 128)),
        (c(!0), g(H, null, ee(y.value.edges, (k) => (c(), g("g", {
          key: k.key,
          class: mt(["work-graph-edge", ["work-edge-" + k.type, { "work-selected": e.selectedTransition === k.transition }]]),
          role: "button",
          tabindex: "0",
          "aria-label": "Edit transition " + s(je)(k.transition),
          "aria-pressed": e.selectedTransition === k.transition,
          onFocus: (j) => Z(k),
          onClick: (j) => o("transition", k.transition),
          onKeydown: [
            Ae(be((j) => o("transition", k.transition), ["prevent"]), ["enter"]),
            Ae(be((j) => o("transition", k.transition), ["prevent"]), ["space"])
          ]
        }, [
          r("path", {
            d: k.path,
            class: "work-edge-hit"
          }, null, 8, Bs),
          r("path", {
            d: k.path,
            class: "work-edge-line",
            "marker-end": `url(#${s(d)}-arrow)`
          }, null, 8, js),
          r("rect", {
            x: k.x - k.width / 2,
            y: k.y - k.height / 2,
            width: k.width,
            height: k.height,
            rx: "6",
            class: "work-edge-label-bg"
          }, null, 8, qs),
          r("text", {
            x: k.x,
            y: k.y - (k.lines.length - 1) * 8 + 4,
            class: "work-edge-label",
            "text-anchor": "middle"
          }, [
            (c(!0), g(H, null, ee(k.lines, (j, K) => (c(), g("tspan", {
              key: K,
              x: k.x,
              dy: K ? 16 : 0
            }, A(j), 9, Ks))), 128))
          ], 8, Ws)
        ], 42, Fs))), 128)),
        (c(!0), g(H, null, ee(y.value.nodes, (k) => (c(), g("g", {
          key: k.state.id,
          class: mt(["work-graph-node", ["work-stop-" + k.state.category, { "work-selected": e.selectedState === k.state }]]),
          role: "button",
          tabindex: "0",
          "aria-label": "Edit state " + s(he)(k.state),
          "aria-pressed": e.selectedState === k.state,
          onClick: (j) => o("state", k.state),
          onKeydown: (j) => oe(j, k.state),
          onFocus: (j) => Z(k),
          onPointerup: be((j) => B(k.state), ["stop"])
        }, [
          r("rect", {
            x: k.x - k.width / 2,
            y: k.y - k.height / 2,
            width: k.width,
            height: k.height,
            rx: "10",
            class: "work-state-card"
          }, null, 8, Ys),
          r("circle", {
            cx: k.x - k.width / 2 + 22,
            cy: k.y - k.height / 2 + 25,
            r: "10",
            class: "work-stop-ring"
          }, null, 8, Hs),
          b(s(J), {
            icon: "tabler:" + De(k.state),
            x: k.x - k.width / 2 + 15,
            y: k.y - k.height / 2 + 18,
            width: "14",
            height: "14",
            class: "work-stop-icon",
            "aria-hidden": "true"
          }, null, 8, ["icon", "x", "y"]),
          r("text", {
            x: k.x - k.width / 2 + 42,
            y: k.y - k.height / 2 + 29,
            class: "work-node-name"
          }, [
            (c(!0), g(H, null, ee(k.title, (j, K) => (c(), g("tspan", {
              key: K,
              x: k.x - k.width / 2 + 42,
              dy: K ? 18 : 0
            }, A(j), 9, Js))), 128))
          ], 8, Xs),
          r("text", {
            x: k.x - k.width / 2 + 16,
            y: k.y - k.height / 2 + 33 + k.title.length * 18,
            class: "work-node-meta"
          }, [
            (c(!0), g(H, null, ee(k.caption, (j, K) => (c(), g("tspan", {
              key: K,
              x: k.x - k.width / 2 + 16,
              dy: K ? 16 : 0
            }, A(j), 9, Qs))), 128)),
            e.draft.policy?.wip?.[k.state.id] ? (c(), g("tspan", _s, " · limit " + A(e.draft.policy.wip[k.state.id].limit), 1)) : E("", !0)
          ], 8, Zs),
          (c(!0), g(H, null, ee(k.badges, (j, K) => (c(), g("g", {
            key: j.id,
            class: "work-any-transition",
            role: "button",
            tabindex: "0",
            "aria-label": "Edit transition " + s(je)(j),
            onClick: be((se) => o("transition", j), ["stop"]),
            onKeydown: [
              Ae(be((se) => o("transition", j), ["stop", "prevent"]), ["enter"]),
              Ae(be((se) => o("transition", j), ["stop", "prevent"]), ["space"])
            ]
          }, [
            r("text", {
              x: k.x - k.width / 2 + 16,
              y: k.y - k.height / 2 + 33 + k.title.length * 18 + k.caption.length * 16 + k.badges.slice(0, K).reduce((se, fe) => se + s(Ot)(s(je)(fe) + " works from any state").length * 18, 0),
              class: "work-node-meta"
            }, [
              (c(!0), g(H, null, ee(s(Ot)(s(je)(j) + " works from any state"), (se, fe) => (c(), g("tspan", {
                key: fe,
                x: k.x - k.width / 2 + 16,
                dy: fe ? 18 : 0
              }, A(se), 9, lr))), 128))
            ], 8, tr)
          ], 40, er))), 128)),
          ["completed", "canceled"].includes(k.state.category) ? E("", !0) : (c(), g("circle", {
            key: 0,
            cx: y.value.direction === "TB" ? k.x : k.x + k.width / 2,
            cy: y.value.direction === "TB" ? k.y + k.height / 2 : k.y,
            r: "7",
            class: "work-node-connector",
            role: "button",
            tabindex: "0",
            "aria-label": "Connect from " + s(he)(k.state),
            onPointerdown: be((j) => O(j, k), ["stop", "prevent"]),
            onClick: be((j) => o("state", k.state), ["stop"]),
            onKeydown: [
              Ae(be((j) => {
                v.value = k.state.id, S.value = { x: k.x, y: k.y };
              }, ["stop", "prevent"]), ["enter"]),
              Ae(be((j) => v.value = k.state.id, ["stop", "prevent"]), ["space"])
            ]
          }, null, 40, ar))
        ], 42, Gs))), 128)),
        D.value ? (c(), g("path", {
          key: 0,
          d: `M ${y.value.direction === "TB" ? D.value.x : D.value.x + D.value.width / 2} ${y.value.direction === "TB" ? D.value.y + D.value.height / 2 : D.value.y} L ${S.value.x} ${S.value.y}`,
          class: "work-connect-ghost"
        }, null, 8, or)) : E("", !0)
      ], 12, Ms)),
      !n.value && $.value < e.process.states.length ? (c(), g("div", ir, [
        r("span", null, A($.value) + " of " + A(e.process.states.length) + " states in view · More " + A(y.value.direction === "TB" ? "below" : "to the right"), 1),
        b(s(Y), {
          label: "Show full process",
          size: "small",
          text: "",
          onClick: C[0] || (C[0] = (k) => V())
        })
      ])) : E("", !0),
      r("div", nr, [
        r("span", null, A(e.process.states.length) + " states · " + A(Math.round(p.value * 100)) + "%", 1),
        C[2] || (C[2] = r("span", null, [
          r("i"),
          M("Transition")
        ], -1)),
        C[3] || (C[3] = r("span", null, [
          r("i", { class: "work-return-key" }),
          M("Return / loop")
        ], -1)),
        C[4] || (C[4] = r("span", null, "Drag to pan · Ctrl + scroll to zoom · Fit for full process", -1))
      ])
    ], 40, Os));
  }
}), rr = {
  class: "work-process-list work-stack",
  "aria-label": "Process list"
}, dr = { class: "work-stack work-tight" }, ur = { class: "work-table-scroll" }, cr = { class: "work-settings-table work-process-table" }, vr = ["aria-selected"], mr = { class: "work-process-list-actions" }, fr = { class: "work-table-scroll" }, pr = { class: "work-settings-table work-process-table" }, br = ["aria-selected"], hr = { class: "work-process-list-actions" }, yr = /* @__PURE__ */ ve({
  __name: "ProcessList",
  props: {
    process: {},
    selectedState: {},
    selectedTransition: {}
  },
  emits: ["state", "transition", "removeState", "removeTransition", "addTransition"],
  setup(e) {
    return (l, t) => (c(), g("section", rr, [
      r("label", dr, [
        t[2] || (t[2] = M("Process name", -1)),
        b(s(re), {
          modelValue: e.process.name,
          "onUpdate:modelValue": t[0] || (t[0] = (a) => e.process.name = a),
          "aria-label": "Process name"
        }, null, 8, ["modelValue"])
      ]),
      t[5] || (t[5] = r("h3", null, "States", -1)),
      r("div", ur, [
        r("table", cr, [
          t[3] || (t[3] = r("thead", null, [
            r("tr", null, [
              r("th", null, "Name"),
              r("th", null, "Phase"),
              r("th", null, "Kind"),
              r("th", null, "Actions")
            ])
          ], -1)),
          r("tbody", null, [
            (c(!0), g(H, null, ee(e.process.states, (a) => (c(), g("tr", {
              key: a.id,
              "aria-selected": e.selectedState === a
            }, [
              r("td", null, [
                b(s(re), {
                  modelValue: a.name,
                  "onUpdate:modelValue": (o) => a.name = o,
                  "aria-label": "Name of " + s(he)(a)
                }, null, 8, ["modelValue", "onUpdate:modelValue", "aria-label"])
              ]),
              r("td", null, A(s(Zl)(a.category)), 1),
              r("td", null, [
                b(s(Re), { severity: "secondary" }, {
                  default: L(() => [
                    M(A(s(Pa)(a.kind)), 1)
                  ]),
                  _: 2
                }, 1024)
              ]),
              r("td", mr, [
                b(s(Y), {
                  size: "small",
                  text: "",
                  severity: "secondary",
                  "aria-label": "Edit state",
                  onClick: (o) => l.$emit("state", a)
                }, {
                  default: L(() => [
                    b(s(J), { icon: "tabler:pencil" })
                  ]),
                  _: 1
                }, 8, ["onClick"]),
                b(s(Y), {
                  size: "small",
                  text: "",
                  severity: "danger",
                  "aria-label": "Remove state " + s(he)(a),
                  onClick: (o) => l.$emit("removeState", a)
                }, {
                  default: L(() => [
                    b(s(J), { icon: "tabler:trash" })
                  ]),
                  _: 1
                }, 8, ["aria-label", "onClick"])
              ])
            ], 8, vr))), 128))
          ])
        ])
      ]),
      t[6] || (t[6] = r("h3", null, "Transitions", -1)),
      r("div", fr, [
        r("table", pr, [
          t[4] || (t[4] = r("thead", null, [
            r("tr", null, [
              r("th", null, "Name"),
              r("th", null, "From"),
              r("th", null, "To"),
              r("th", null, "Actions")
            ])
          ], -1)),
          r("tbody", null, [
            (c(!0), g(H, null, ee(e.process.transitions ?? [], (a) => (c(), g("tr", {
              key: a.id,
              "aria-selected": e.selectedTransition === a
            }, [
              r("td", null, [
                b(s(re), {
                  modelValue: a.name,
                  "onUpdate:modelValue": (o) => a.name = o,
                  placeholder: s(je)(a),
                  "aria-label": "Name of " + s(je)(a)
                }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder", "aria-label"])
              ]),
              r("td", null, A(a.from === "any" ? "Any state" : a.from.map((o) => s(he)(e.process.states.find((d) => d.id === o))).join(", ")), 1),
              r("td", null, A(s(he)(e.process.states.find((o) => o.id === a.to))), 1),
              r("td", hr, [
                b(s(Y), {
                  size: "small",
                  text: "",
                  severity: "secondary",
                  "aria-label": "Edit transition",
                  onClick: (o) => l.$emit("transition", a)
                }, {
                  default: L(() => [
                    b(s(J), { icon: "tabler:pencil" })
                  ]),
                  _: 1
                }, 8, ["onClick"]),
                b(s(Y), {
                  size: "small",
                  text: "",
                  severity: "danger",
                  "aria-label": "Remove transition " + s(je)(a),
                  onClick: (o) => l.$emit("removeTransition", a)
                }, {
                  default: L(() => [
                    b(s(J), { icon: "tabler:trash" })
                  ]),
                  _: 1
                }, 8, ["aria-label", "onClick"])
              ])
            ], 8, br))), 128))
          ])
        ])
      ]),
      b(s(Y), {
        label: "Add transition",
        severity: "secondary",
        outlined: "",
        onClick: t[1] || (t[1] = (a) => l.$emit("addTransition"))
      }, {
        icon: L(() => [
          b(s(J), { icon: "tabler:plus" })
        ]),
        _: 1
      })
    ]));
  }
}), gr = { class: "work-stack work-transition-settings" }, kr = { class: "work-stack work-tight" }, wr = { class: "work-row" }, Vr = { class: "work-row" }, $r = { class: "work-row" }, xr = { class: "work-stack work-tight" }, Cr = { class: "work-row" }, Sr = { class: "work-stack work-tight" }, Tr = { class: "work-stack work-tight" }, Er = /* @__PURE__ */ ve({
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
    function d(v, m) {
      const f = t.transition.set?.[v];
      !f || !t.transition.set || (t.transition.set[v] = { field: f.field, ...m === "clear" ? { clear: !0 } : m === "copy" ? { copy: "" } : { value: "" } });
    }
    return (v, m) => (c(), g("div", gr, [
      r("label", kr, [
        m[14] || (m[14] = M("To state", -1)),
        b(s(te), {
          modelValue: e.transition.to,
          "onUpdate:modelValue": m[0] || (m[0] = (f) => e.transition.to = f),
          "aria-label": "To state",
          appendTo: "self",
          optionLabel: "label",
          optionValue: "value",
          options: e.process.states.map((f) => ({ label: s(he)(f), value: f.id }))
        }, null, 8, ["modelValue", "options"])
      ]),
      r("label", wr, [
        m[15] || (m[15] = r("span", { class: "work-spacer" }, "Happens automatically", -1)),
        b(s(ze), {
          "model-value": e.transition.auto,
          "onUpdate:modelValue": m[1] || (m[1] = (f) => {
            e.transition.auto = f, f || delete e.transition.default;
          }),
          "aria-label": "Automatic transition"
        }, null, 8, ["model-value"])
      ]),
      r("label", Vr, [
        m[16] || (m[16] = r("span", { class: "work-spacer" }, "Default automatic transition", -1)),
        b(s(ze), {
          modelValue: e.transition.default,
          "onUpdate:modelValue": m[2] || (m[2] = (f) => e.transition.default = f),
          disabled: !e.transition.auto,
          "aria-label": "Default transition"
        }, null, 8, ["modelValue", "disabled"])
      ]),
      r("label", $r, [
        m[17] || (m[17] = r("span", { class: "work-spacer" }, "Works from any state", -1)),
        b(s(ze), {
          "model-value": e.transition.from === "any",
          "aria-label": "Works from any state",
          "onUpdate:modelValue": m[3] || (m[3] = (f) => e.transition.from = f ? "any" : [])
        }, null, 8, ["model-value"])
      ]),
      e.transition.from !== "any" ? (c(), F(zt, {
        key: 0,
        label: "From states",
        options: e.process.states.map((f) => ({ value: f.id, label: s(he)(f) })),
        modelValue: e.transition.from,
        "onUpdate:modelValue": m[4] || (m[4] = (f) => e.transition.from = f)
      }, null, 8, ["options", "modelValue"])) : E("", !0),
      m[21] || (m[21] = r("h4", { class: "work-process-group" }, "Must be filled", -1)),
      b(zt, {
        label: "Required fields",
        options: e.draft.fields?.map((f) => ({ value: f.code, label: f.title || f.code })) ?? [],
        modelValue: e.transition.require,
        "onUpdate:modelValue": m[5] || (m[5] = (f) => e.transition.require = f)
      }, null, 8, ["options", "modelValue"]),
      m[22] || (m[22] = r("h4", { class: "work-process-group" }, "Also sets", -1)),
      (c(!0), g(H, null, ee(e.transition.set ?? [], (f, i) => (c(), g("div", {
        key: i,
        class: "work-process-value work-stack work-tight"
      }, [
        r("label", xr, [
          m[18] || (m[18] = M("Field", -1)),
          b(s(te), {
            modelValue: f.field,
            "onUpdate:modelValue": (n) => f.field = n,
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            options: e.draft.fields?.map((n) => ({ value: n.code, label: n.title || n.code })) ?? []
          }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
        ]),
        r("div", Cr, [
          b(s(te), {
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
            "onUpdate:modelValue": (n) => d(i, n)
          }, null, 8, ["model-value", "onUpdate:modelValue"]),
          b(s(Y), {
            text: "",
            severity: "danger",
            "aria-label": "Remove value " + (i + 1),
            onClick: (n) => e.transition.set?.splice(i, 1)
          }, {
            default: L(() => [
              b(s(J), { icon: "tabler:trash" })
            ]),
            _: 1
          }, 8, ["aria-label", "onClick"])
        ]),
        f.copy !== void 0 ? (c(), F(s(te), {
          key: 0,
          modelValue: f.copy,
          "onUpdate:modelValue": (n) => f.copy = n,
          "aria-label": "Copy from field",
          appendTo: "self",
          optionLabel: "label",
          optionValue: "value",
          options: e.draft.fields?.map((n) => ({ value: n.code, label: n.title || n.code })) ?? []
        }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])) : f.clear ? E("", !0) : (c(!0), g(H, { key: 1 }, ee(e.draft.fields?.filter((n) => n.code === f.field) ?? [], (n) => (c(), F(Ma, {
          key: n.code,
          "board-id": e.boardId ?? "",
          field: n,
          modelValue: f.value,
          "onUpdate:modelValue": (u) => f.value = u,
          onValidity: (u) => a("validity", "effect-" + i, u)
        }, null, 8, ["board-id", "field", "modelValue", "onUpdate:modelValue", "onValidity"]))), 128))
      ]))), 128)),
      b(s(Y), {
        label: "Add value",
        severity: "secondary",
        outlined: "",
        size: "small",
        onClick: o
      }, {
        icon: L(() => [
          b(s(J), { icon: "tabler:plus" })
        ]),
        _: 1
      }),
      r("label", Sr, [
        m[19] || (m[19] = M("Offer to people", -1)),
        b(s(te), {
          "model-value": e.transition.people,
          "aria-label": "Offer to people",
          appendTo: "self",
          optionLabel: "label",
          optionValue: "value",
          options: [{ label: "Work default", value: void 0 }, { label: "Offer explicitly", value: !0 }, { label: "Hide from people", value: !1 }],
          "onUpdate:modelValue": m[6] || (m[6] = (f) => e.transition.people = f)
        }, null, 8, ["model-value"])
      ]),
      r("label", Tr, [
        m[20] || (m[20] = M("Evaluation order", -1)),
        b(s(Ge), {
          "model-value": e.transition.order ?? null,
          "aria-label": "Transition order",
          min: 0,
          useGrouping: !1,
          "onUpdate:modelValue": m[7] || (m[7] = (f) => e.transition.order = f ?? void 0)
        }, null, 8, ["model-value"])
      ]),
      m[23] || (m[23] = r("h4", { class: "work-process-group" }, "Only when", -1)),
      b(_l, {
        label: "Allow this transition when",
        draft: e.draft,
        "board-id": e.boardId,
        "model-value": e.transition.when,
        "onUpdate:modelValue": m[8] || (m[8] = (f) => e.transition.when = f),
        onValidity: m[9] || (m[9] = (f) => a("validity", "when", f))
      }, null, 8, ["draft", "board-id", "model-value"]),
      b(lt, {
        label: "Set values",
        "model-value": e.transition.set,
        shape: "array",
        "onUpdate:modelValue": m[10] || (m[10] = (f) => e.transition.set = f),
        onValidity: m[11] || (m[11] = (f) => a("validity", "set", f))
      }, null, 8, ["model-value"]),
      b(lt, {
        label: "Guards",
        "model-value": e.transition.guards,
        shape: "array",
        "onUpdate:modelValue": m[12] || (m[12] = (f) => e.transition.guards = f),
        onValidity: m[13] || (m[13] = (f) => a("validity", "guards", f))
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
    const l = e, t = G(() => l.draft.policy?.wip?.[l.state]);
    function a(d) {
      if (d === null) {
        l.draft.policy?.wip && delete l.draft.policy.wip[l.state];
        return;
      }
      const v = l.draft.policy ??= {}, m = v.wip ??= {};
      m[l.state] = { ...m[l.state], limit: d };
    }
    function o(d) {
      t.value && (t.value.hard = d);
    }
    return (d, v) => e.hard ? (c(), F(s(ze), {
      key: 0,
      "aria-label": e.label,
      disabled: !t.value,
      "model-value": t.value?.hard ?? !1,
      "onUpdate:modelValue": o
    }, null, 8, ["aria-label", "disabled", "model-value"])) : (c(), F(s(Ge), {
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
}), Hl = { minutes: 60, hours: 3600, days: 86400 };
function Wt(e, l) {
  const t = /^P(\d+)W$/.exec(e), a = /^P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+\.?\d*)S)?)?$/.exec(e);
  if (!t && (!a || e === "P" || e.endsWith("T"))) return;
  const o = t ? Number(t[1]) * 604800 : Number(a[1] ?? 0) * 86400 + Number(a[2] ?? 0) * 3600 + Number(a[3] ?? 0) * 60 + Number(a[4] ?? 0);
  if (!Number.isFinite(o) || o <= 0) return;
  const d = l ?? (o % 86400 === 0 ? "days" : o % 3600 === 0 ? "hours" : "minutes");
  return { amount: o / Hl[d], unit: d };
}
function Ur(e, l) {
  if (e == null) return;
  if (!Number.isFinite(e * Hl[l]) || e <= 0) throw new Error("Enter a positive duration.");
  const t = (a) => a.toLocaleString("en-US", { useGrouping: !1, maximumSignificantDigits: 21 });
  return Number.isInteger(e) ? l === "days" ? `P${t(e)}D` : l === "hours" ? `PT${t(e)}H` : `PT${t(e)}M` : `PT${t(e * Hl[l])}S`;
}
const Dr = { class: "work-stack work-tight" }, Ir = {
  class: "work-duration-control",
  style: { "max-width": "360px" }
}, Ar = {
  key: 0,
  class: "work-error",
  role: "alert"
}, xt = /* @__PURE__ */ ve({
  __name: "DurationControl",
  props: {
    modelValue: {},
    label: {},
    disabled: { type: Boolean }
  },
  emits: ["update:modelValue", "validity"],
  setup(e, { emit: l }) {
    const t = e, a = l, o = "duration:" + Xl(), d = z("days"), v = z("");
    Ce(() => t.modelValue, (y) => {
      v.value = "";
      const p = y ? Wt(y) : void 0;
      p && (d.value = p.unit), a("validity", !y || !!p, o);
    }, { immediate: !0 });
    const m = G(() => t.modelValue ? Wt(t.modelValue, d.value)?.amount ?? null : null);
    function f(y) {
      try {
        const p = Ur(y, d.value);
        v.value = "", a("update:modelValue", p), a("validity", !0, o);
      } catch (p) {
        v.value = p.message, a("validity", !1, o);
      }
    }
    function i(y) {
      y == null && v.value || f(y);
    }
    function n(y) {
      y.formattedValue.trim() && (typeof y.value != "number" || !Number.isFinite(y.value)) ? (v.value = "Enter a positive duration.", a("validity", !1, o)) : f(typeof y.value == "number" ? y.value : null);
    }
    function u(y) {
      const p = m.value;
      d.value = y, !(t.modelValue && !Wt(t.modelValue)) && f(p);
    }
    return ft(() => a("validity", !0, o)), (y, p) => (c(), g("label", Dr, [
      M(A(e.label), 1),
      r("span", Ir, [
        b(s(Ge), {
          "model-value": m.value,
          "aria-label": e.label,
          min: 0,
          "aria-invalid": !!v.value || !!e.modelValue && !s(Wt)(e.modelValue),
          disabled: e.disabled,
          useGrouping: !1,
          onInput: n,
          "onUpdate:modelValue": p[0] || (p[0] = (w) => i(w))
        }, null, 8, ["model-value", "aria-label", "aria-invalid", "disabled"]),
        b(s(te), {
          "model-value": d.value,
          "aria-label": e.label + " unit",
          disabled: e.disabled,
          options: [{ label: "Minutes", value: "minutes" }, { label: "Hours", value: "hours" }, { label: "Days", value: "days" }],
          optionLabel: "label",
          optionValue: "value",
          appendTo: "self",
          "onUpdate:modelValue": p[1] || (p[1] = (w) => u(w))
        }, null, 8, ["model-value", "aria-label", "disabled"])
      ]),
      v.value || e.modelValue && !s(Wt)(e.modelValue) ? (c(), g("span", Ar, A(v.value || `Unsupported duration: ${e.modelValue}`), 1)) : E("", !0)
    ]));
  }
}), Pr = { class: "work-stack" }, Rr = { class: "work-settings-grid" }, Or = { class: "work-stack work-tight" }, Nr = { class: "work-stack work-tight" }, Mr = {
  key: 1,
  class: "work-stack work-tight"
}, Lr = { class: "work-stack work-tight" }, zr = { class: "work-settings-grid" }, Fr = { class: "work-row" }, Br = { class: "work-stack work-tight" }, jr = {
  key: 0,
  class: "work-stack work-tight"
}, qr = /* @__PURE__ */ ve({
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
    function d() {
      const i = t.state.timers ?? (t.state.timers = []);
      i.push({ id: Vt("timer", i), after: "P1D", then: { emit: "reminder" } });
    }
    function v(i, n) {
      delete i.after, delete i.at_field, n === "after" ? i.after = "P1D" : i.at_field = "";
    }
    function m(i, n, u) {
      u ? i[n] = u : (delete i[n], delete i.table);
    }
    function f(i, n) {
      i.then = n === "emit" ? { emit: "" } : { transition: "" };
    }
    return (i, n) => (c(), g("section", Pr, [
      n[8] || (n[8] = r("h4", null, "Timers", -1)),
      (c(!0), g(H, null, ee(o(), (u, y) => (c(), g("article", {
        key: u.id,
        class: "work-settings-card work-stack"
      }, [
        r("div", Rr, [
          r("label", Or, [
            n[2] || (n[2] = M("Timer ID", -1)),
            b(s(re), {
              modelValue: u.id,
              "onUpdate:modelValue": (p) => u.id = p,
              required: "",
              pattern: "[a-z][a-z0-9_]*"
            }, null, 8, ["modelValue", "onUpdate:modelValue"])
          ]),
          r("label", Nr, [
            n[3] || (n[3] = M("Deadline", -1)),
            b(s(te), {
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
          u.after !== void 0 ? (c(), F(xt, {
            key: 0,
            modelValue: u.after,
            "onUpdate:modelValue": (p) => u.after = p,
            label: "After",
            onValidity: n[0] || (n[0] = (p, w) => a("validity", w, p))
          }, null, 8, ["modelValue", "onUpdate:modelValue"])) : (c(), g("label", Mr, [
            n[4] || (n[4] = M("At field", -1)),
            b(s(te), {
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
          r("label", Lr, [
            n[5] || (n[5] = M("Duration by field", -1)),
            b(s(te), {
              "model-value": u.by ?? "",
              "onUpdate:modelValue": (p) => m(u, "by", p),
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
        u.by ? (c(), F(lt, {
          key: 0,
          label: "Duration table",
          hint: "Map field values to ISO durations.",
          "model-value": u.table,
          shape: "object",
          "onUpdate:modelValue": (p) => u.table = p,
          onValidity: (p) => a("validity", "table-" + y, p)
        }, null, 8, ["model-value", "onUpdate:modelValue", "onValidity"])) : E("", !0),
        r("div", zr, [
          b(xt, {
            modelValue: u.repeat,
            "onUpdate:modelValue": (p) => u.repeat = p,
            label: "Repeat every",
            onValidity: n[1] || (n[1] = (p, w) => a("validity", w, p)),
            disabled: u.interrupting
          }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"]),
          r("label", Fr, [
            b(s(Mt), {
              modelValue: u.interrupting,
              "onUpdate:modelValue": [(p) => u.interrupting = p, (p) => u.interrupting && delete u.repeat],
              binary: ""
            }, null, 8, ["modelValue", "onUpdate:modelValue"]),
            n[6] || (n[6] = M("Interrupting", -1))
          ]),
          r("label", Br, [
            n[7] || (n[7] = M("Then", -1)),
            b(s(te), {
              "model-value": u.then?.transition !== void 0 ? "transition" : "emit",
              "onUpdate:modelValue": (p) => f(u, p),
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
          u.then ? (c(), g("label", jr, [
            M(A(u.then.transition !== void 0 ? "Transition ID" : "Event name"), 1),
            u.then.transition !== void 0 ? (c(), F(s(re), {
              key: 0,
              modelValue: u.then.transition,
              "onUpdate:modelValue": (p) => u.then.transition = p
            }, null, 8, ["modelValue", "onUpdate:modelValue"])) : (c(), F(s(re), {
              key: 1,
              modelValue: u.then.emit,
              "onUpdate:modelValue": (p) => u.then.emit = p
            }, null, 8, ["modelValue", "onUpdate:modelValue"]))
          ])) : E("", !0)
        ]),
        b(s(Y), {
          severity: "secondary",
          onClick: (p) => o().splice(y, 1),
          "aria-label": "Remove timer",
          text: "",
          size: "small"
        }, {
          default: L(() => [
            b(s(J), {
              icon: "tabler:trash",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        }, 8, ["onClick"])
      ]))), 128)),
      b(s(Y), {
        label: "Add timer",
        severity: "secondary",
        onClick: d,
        outlined: ""
      }, {
        icon: L(() => [
          b(s(J), {
            icon: "tabler:plus",
            "aria-hidden": "true"
          })
        ]),
        _: 1
      })
    ]));
  }
}), Wr = ["aria-label"], Kr = { class: "work-stack work-tight" }, Gr = {
  key: 0,
  class: "work-stack work-tight"
}, Yr = /* @__PURE__ */ ve({
  __name: "PrincipalSourceEditor",
  props: {
    modelValue: {},
    draft: {},
    boardId: {},
    label: {}
  },
  emits: ["update:modelValue", "validity"],
  setup(e, { emit: l }) {
    const t = e, a = l, o = G(() => Array.isArray(t.modelValue) ? "principals" : "field" in t.modelValue ? "field" : "group"), d = G(() => Array.isArray(t.modelValue) ? t.modelValue : "group" in t.modelValue && t.modelValue.group ? [{ kind: "group", id: t.modelValue.group }] : []);
    function v(f) {
      a("update:modelValue", f === "field" ? { field: "" } : f === "group" ? { group: "" } : []);
    }
    function m(f) {
      a("update:modelValue", o.value === "group" ? { group: f.at(-1)?.id ?? "" } : f);
    }
    return Ua(() => a("validity", Array.isArray(t.modelValue) ? t.modelValue.length > 0 : "field" in t.modelValue ? !!t.modelValue.field : !!t.modelValue.group)), ft(() => a("validity", !0)), (f, i) => (c(), g("section", {
      class: "work-stack work-tight",
      "aria-label": e.label
    }, [
      r("label", Kr, [
        M(A(e.label) + " source", 1),
        b(s(te), {
          "model-value": o.value,
          "aria-label": e.label + " source",
          options: [{ label: "Group", value: "group" }, { label: "People and groups", value: "principals" }, { label: "Principal field", value: "field" }],
          optionLabel: "label",
          optionValue: "value",
          appendTo: "self",
          "onUpdate:modelValue": v
        }, null, 8, ["model-value", "aria-label"])
      ]),
      "field" in e.modelValue ? (c(), g("label", Gr, [
        i[1] || (i[1] = M("Principal field", -1)),
        b(s(te), {
          "model-value": e.modelValue.field,
          "aria-label": e.label + " field",
          options: e.draft.fields?.filter((n) => n.type === "principal").map((n) => ({ label: n.title || n.code, value: n.code })) ?? [],
          optionLabel: "label",
          optionValue: "value",
          appendTo: "self",
          "onUpdate:modelValue": i[0] || (i[0] = (n) => a("update:modelValue", { field: n }))
        }, null, 8, ["model-value", "aria-label", "options"])
      ])) : (c(), F(ea, {
        key: 1,
        "board-id": e.boardId,
        label: e.label,
        kinds: o.value === "group" ? "group" : "user,group,service",
        "model-value": d.value,
        "onUpdate:modelValue": m
      }, null, 8, ["board-id", "label", "kinds", "model-value"]))
    ], 8, Wr));
  }
}), Hr = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, Xr = {
  class: "work-stack work-tight",
  "aria-label": "Approval sources"
}, Jr = { class: "work-row" }, Zr = {
  key: 0,
  class: "work-stack work-tight"
}, Qr = ["kinds", "value"], _r = {
  key: 2,
  class: "work-muted work-small",
  role: "status"
}, ed = {
  key: 3,
  class: "work-chips"
}, td = { class: "work-row work-small" }, ld = { class: "work-process-options" }, ad = { class: "work-stack work-tight" }, od = {
  key: 4,
  class: "work-error work-small",
  role: "alert"
}, id = {
  key: 5,
  class: "work-muted work-small"
}, nd = /* @__PURE__ */ ve({
  __name: "ApproversEditor",
  props: {
    approvals: {},
    boardId: {}
  },
  emits: ["validity"],
  setup(e, { emit: l }) {
    const t = e, a = l, { principalLabel: o, rememberPrincipal: d, nameError: v } = Da(() => t.boardId ?? "", () => Array.isArray(t.approvals.from) ? t.approvals.from : "group" in t.approvals.from ? [{ kind: "group", id: t.approvals.from.group }] : []), m = z(!1), f = G(() => Array.isArray(t.approvals.from) ? "principals" : "field" in t.approvals.from ? "field" : "group"), i = G(() => Array.isArray(t.approvals.from) ? t.approvals.from.some((p) => p.kind === "group") || t.approvals.from.length >= t.approvals.min : "field" in t.approvals.from ? !!t.approvals.from.field : !!t.approvals.from.group);
    Ua(() => a("validity", Number.isSafeInteger(t.approvals.min) && t.approvals.min > 0 && i.value)), ft(() => a("validity", !0)), kl(async () => {
      m.value = await vt("wc-principal-picker");
    });
    function n(p) {
      t.approvals.from = p === "group" ? { group: "" } : p === "field" ? { field: "" } : [];
    }
    function u(p) {
      const w = p.detail, S = w?.principal_id ?? w?.id;
      if (f.value === "group") {
        t.approvals.from = { group: S ?? "" };
        return;
      }
      if (!S || !Array.isArray(t.approvals.from)) return;
      const U = { kind: w.type ?? w.kind ?? "user", id: S };
      w.label && d(U, w.label), t.approvals.from.some(($) => $.id === S && $.kind === U.kind) || t.approvals.from.push(U);
    }
    function y(p) {
      Array.isArray(t.approvals.from) && t.approvals.from.splice(p, 1);
    }
    return (p, w) => (c(), g(H, null, [
      s(v) ? (c(), g("p", Hr, A(s(v)), 1)) : E("", !0),
      r("section", Xr, [
        r("label", Jr, [
          w[4] || (w[4] = r("span", { class: "work-spacer" }, "Approvals needed", -1)),
          b(s(Ge), {
            modelValue: e.approvals.min,
            "onUpdate:modelValue": w[0] || (w[0] = (S) => e.approvals.min = S),
            min: 1,
            required: "",
            useGrouping: !1
          }, null, 8, ["modelValue"])
        ]),
        w[9] || (w[9] = r("span", { class: "work-field-label" }, "Approvers", -1)),
        "field" in e.approvals.from ? (c(), g("label", Zr, [
          w[5] || (w[5] = M("Principal field", -1)),
          b(s(re), {
            modelValue: e.approvals.from.field,
            "onUpdate:modelValue": w[1] || (w[1] = (S) => e.approvals.from.field = S),
            "aria-label": "Principal field"
          }, null, 8, ["modelValue"])
        ])) : m.value ? (c(), g("wc-principal-picker", {
          key: f.value,
          kinds: f.value === "group" ? "group" : "user,group,service",
          value: JSON.stringify("group" in e.approvals.from ? { type: "group", principal_id: e.approvals.from.group } : {}),
          onConfigChanged: u
        }, null, 40, Qr)) : (c(), g("p", _r, "The principal picker is unavailable.")),
        Array.isArray(e.approvals.from) ? (c(), g("div", ed, [
          (c(!0), g(H, null, ee(e.approvals.from, (S, U) => (c(), F(s(Re), {
            key: S.kind + ":" + S.id,
            class: "kx-tag-sm",
            severity: "secondary"
          }, {
            default: L(() => [
              M(A(s(o)(S)), 1),
              b(s(Y), {
                "aria-label": "Remove approver " + (U + 1),
                text: "",
                severity: "secondary",
                size: "small",
                onClick: ($) => y(U)
              }, {
                default: L(() => [
                  b(s(J), {
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
        r("label", td, [
          w[6] || (w[6] = r("span", { class: "work-spacer" }, "The person who moves the item here cannot approve this visit", -1)),
          b(s(ze), {
            modelValue: e.approvals.prevent_self,
            "onUpdate:modelValue": w[2] || (w[2] = (S) => e.approvals.prevent_self = S),
            "aria-label": "The person who moves the item here cannot approve this visit"
          }, null, 8, ["modelValue"])
        ]),
        r("details", ld, [
          w[8] || (w[8] = r("summary", null, "Approval options", -1)),
          r("label", ad, [
            w[7] || (w[7] = M("Approval source", -1)),
            b(s(te), {
              "model-value": f.value,
              "onUpdate:modelValue": w[3] || (w[3] = (S) => n(S)),
              appendTo: "self",
              optionLabel: "label",
              optionValue: "value",
              options: [{ label: "Group members", value: "group" }, { label: "People and groups", value: "principals" }, { label: "Principal field", value: "field" }]
            }, null, 8, ["model-value"])
          ])
        ]),
        Array.isArray(e.approvals.from) && !i.value ? (c(), g("p", od, "Select at least " + A(e.approvals.min) + " distinct principals, or lower the minimum.", 1)) : "group" in e.approvals.from && !e.approvals.from.group ? (c(), g("p", id, "Choose the group that can approve this state.")) : E("", !0)
      ])
    ], 64));
  }
}), sd = {
  class: "work-state-settings work-stack",
  "aria-label": "State settings"
}, rd = { class: "work-process-kind" }, dd = { class: "work-process-options" }, ud = { class: "work-stack" }, cd = { class: "work-row" }, vd = { class: "work-stack work-tight" }, md = { class: "work-row" }, fd = { class: "work-stack work-tight" }, pd = { class: "work-row" }, bd = { class: "work-row" }, hd = { class: "work-stack work-tight" }, yd = { class: "work-row" }, gd = { class: "work-stack work-tight" }, kd = { class: "work-stack work-tight" }, wd = {
  key: 0,
  class: "work-row"
}, Vd = { class: "work-row" }, $d = { class: "work-row" }, xd = { class: "work-stack work-tight" }, Cd = { class: "work-row" }, Sd = /* @__PURE__ */ ve({
  __name: "StateSettings",
  props: {
    state: {},
    process: {},
    draft: {},
    boardId: {}
  },
  emits: ["validity"],
  setup(e, { emit: l }) {
    const t = e, a = l, o = G(() => (t.process.transitions ?? []).filter((f) => f.from === "any" || f.from.includes(t.state.id))), d = [{ value: "human", icon: "user" }, { value: "gate", icon: "shield-check" }, { value: "automated", icon: "bolt" }, { value: "parallel", icon: "arrows-split" }];
    function v(f) {
      const i = t.state;
      i.kind = f, delete i.run, delete i.release_when, delete i.regions, delete i.join, delete i.due, (f === "automated" || f === "gate") && delete i.awaiting, f === "automated" && (i.run = { stage: "", retry: { max: 1, backoff: "PT1M" } }), f === "gate" && (i.release_when = { approvals: { min: 1, from: { group: "" }, prevent_self: !0 } }), f === "parallel" && (i.regions = [{ id: "region_1", initial: t.process.states.find((n) => n.id !== i.id)?.id ?? "" }], i.join = "all");
    }
    function m(f) {
      t.state.run && (f ? t.state.run.on_fail = f : delete t.state.run.on_fail);
    }
    return (f, i) => (c(), g("section", sd, [
      i[50] || (i[50] = r("h4", { class: "work-process-group" }, "Who moves the item on", -1)),
      b(s(Ql), {
        class: "work-process-kinds",
        "model-value": e.state.kind ?? "human",
        options: d.map((n) => ({
          ...n,
          label: s(Pa)(n.value)
        })),
        optionLabel: "label",
        optionValue: "value",
        optionDisabled: "disabled",
        "allow-empty": !1,
        "aria-label": "Who moves the item on",
        "onUpdate:modelValue": v
      }, {
        option: L(({ option: n }) => [
          r("span", rd, [
            b(s(J), {
              icon: "tabler:" + n.icon
            }, null, 8, ["icon"]),
            r("span", null, A(n.label), 1)
          ])
        ]),
        _: 1
      }, 8, ["model-value", "options"]),
      e.state.kind === "gate" && e.state.release_when ? (c(), g(H, { key: 0 }, [
        i[31] || (i[31] = r("h4", { class: "work-process-group" }, "Approval", -1)),
        e.state.release_when.approvals ? (c(), F(nd, {
          key: 0,
          "board-id": e.boardId,
          approvals: e.state.release_when.approvals,
          onValidity: i[0] || (i[0] = (n) => a("validity", "approvers", n))
        }, null, 8, ["board-id", "approvals"])) : E("", !0),
        r("details", dd, [
          i[30] || (i[30] = r("summary", null, "Release options", -1)),
          r("div", ud, [
            r("label", cd, [
              i[29] || (i[29] = r("span", { class: "work-spacer" }, "Require approvals", -1)),
              b(s(ze), {
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
      e.state.kind === "automated" && e.state.run ? (c(), g(H, { key: 1 }, [
        i[38] || (i[38] = r("h4", { class: "work-process-group" }, "Automation", -1)),
        r("label", vd, [
          i[32] || (i[32] = M("What runs", -1)),
          b(s(re), {
            modelValue: e.state.run.stage,
            "onUpdate:modelValue": i[6] || (i[6] = (n) => e.state.run.stage = n),
            "aria-label": "Stage",
            required: ""
          }, null, 8, ["modelValue"])
        ]),
        b(xt, {
          modelValue: e.state.run.timeout,
          "onUpdate:modelValue": i[7] || (i[7] = (n) => e.state.run.timeout = n),
          label: "Attempt timeout",
          onValidity: i[8] || (i[8] = (n, u) => a("validity", u, n))
        }, null, 8, ["modelValue"]),
        i[39] || (i[39] = r("small", { class: "work-muted" }, "Blank uses the board timeout, or one hour.", -1)),
        r("label", md, [
          i[33] || (i[33] = r("span", { class: "work-spacer" }, "Maximum visits", -1)),
          b(s(Ge), {
            "model-value": e.state.run.max_visits ?? null,
            "aria-label": "Maximum visits",
            min: 1,
            useGrouping: !1,
            placeholder: "Board default",
            "onUpdate:modelValue": i[9] || (i[9] = (n) => e.state.run.max_visits = n ?? void 0)
          }, null, 8, ["model-value"])
        ]),
        r("label", fd, [
          i[34] || (i[34] = M("When visits are exhausted", -1)),
          b(s(te), {
            "model-value": e.state.run.on_exhausted,
            "aria-label": "When visits are exhausted",
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            showClear: "",
            options: (e.process.transitions ?? []).filter((n) => !n.auto).map((n) => ({ label: s(je)(n), value: n.id })),
            "onUpdate:modelValue": i[10] || (i[10] = (n) => e.state.run.on_exhausted = n || void 0)
          }, null, 8, ["model-value", "options"])
        ]),
        i[40] || (i[40] = r("small", { class: "work-muted" }, "Blank records a failed run and stops automation. A route must leave every incoming state or be global.", -1)),
        r("label", pd, [
          i[35] || (i[35] = r("span", { class: "work-spacer" }, "Retry if it fails", -1)),
          b(s(ze), {
            "model-value": !!e.state.run.retry,
            "aria-label": "Retry if it fails",
            "onUpdate:modelValue": i[11] || (i[11] = (n) => e.state.run.retry = n ? { max: 1, backoff: "PT1M" } : void 0)
          }, null, 8, ["model-value"])
        ]),
        e.state.run.retry ? (c(), g(H, { key: 0 }, [
          r("label", bd, [
            i[36] || (i[36] = r("span", { class: "work-spacer" }, "Maximum attempts", -1)),
            b(s(Ge), {
              modelValue: e.state.run.retry.max,
              "onUpdate:modelValue": i[12] || (i[12] = (n) => e.state.run.retry.max = n),
              min: 1,
              useGrouping: !1
            }, null, 8, ["modelValue"])
          ]),
          b(xt, {
            modelValue: e.state.run.retry.backoff,
            "onUpdate:modelValue": i[13] || (i[13] = (n) => e.state.run.retry.backoff = n),
            label: "Wait between attempts",
            onValidity: i[14] || (i[14] = (n, u) => a("validity", u, n))
          }, null, 8, ["modelValue"])
        ], 64)) : E("", !0),
        (c(), g(H, null, ee([{ key: "on_pass", label: "On success" }, { key: "on_cancel", label: "On cancellation" }], (n) => r("label", {
          key: n.key,
          class: "work-stack work-tight"
        }, [
          M(A(n.label), 1),
          b(s(te), {
            "model-value": e.state.run[n.key],
            "aria-label": n.label,
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            showClear: "",
            options: o.value.map((u) => ({ label: s(je)(u), value: u.id })),
            "onUpdate:modelValue": (u) => e.state.run[n.key] = u || void 0
          }, null, 8, ["model-value", "aria-label", "options", "onUpdate:modelValue"])
        ])), 64)),
        r("label", hd, [
          i[37] || (i[37] = M("If it fails, go to", -1)),
          b(s(te), {
            "model-value": e.state.run.on_fail,
            "onUpdate:modelValue": m,
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            showClear: "",
            options: o.value.map((n) => ({
              label: s(je)(n) + " → " + s(he)(e.process.states.find((u) => u.id === n.to)),
              value: n.id
            }))
          }, null, 8, ["model-value", "options"])
        ])
      ], 64)) : E("", !0),
      e.state.kind === "parallel" && e.state.regions ? (c(), g(H, { key: 2 }, [
        i[45] || (i[45] = r("h4", { class: "work-process-group" }, "Lanes", -1)),
        (c(!0), g(H, null, ee(e.state.regions, (n, u) => (c(), g("div", {
          key: u,
          class: "work-process-value work-stack work-tight"
        }, [
          r("div", yd, [
            r("span", null, "Lane " + A(u + 1), 1),
            i[41] || (i[41] = r("span", { class: "work-spacer" }, null, -1)),
            b(s(Y), {
              severity: "danger",
              text: "",
              size: "small",
              "aria-label": "Remove lane",
              onClick: (y) => e.state.regions.splice(u, 1)
            }, {
              default: L(() => [
                b(s(J), { icon: "tabler:trash" })
              ]),
              _: 1
            }, 8, ["onClick"])
          ]),
          r("label", gd, [
            i[42] || (i[42] = M("Starts at", -1)),
            b(s(te), {
              modelValue: n.initial,
              "onUpdate:modelValue": (y) => n.initial = y,
              appendTo: "self",
              optionLabel: "label",
              optionValue: "value",
              options: e.process.states.filter((y) => y.id !== e.state.id).map((y) => ({ label: s(he)(y), value: y.id }))
            }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
          ])
        ]))), 128)),
        b(s(Y), {
          label: "Add lane",
          severity: "secondary",
          outlined: "",
          size: "small",
          onClick: i[15] || (i[15] = (n) => e.state.regions.push({
            id: s(Vt)("region", e.state.regions),
            initial: e.process.states.find((u) => u.id !== e.state.id)?.id ?? ""
          }))
        }, {
          icon: L(() => [
            b(s(J), { icon: "tabler:plus" })
          ]),
          _: 1
        }),
        r("label", kd, [
          i[43] || (i[43] = M("Finish rule", -1)),
          b(s(te), {
            "model-value": typeof e.state.join == "number" ? "count" : e.state.join ?? "all",
            appendTo: "self",
            options: [
              { label: "All must pass", value: "all" },
              { label: "Any may pass", value: "any" },
              { label: "A number must pass", value: "count" }
            ],
            optionLabel: "label",
            optionValue: "value",
            "onUpdate:modelValue": i[16] || (i[16] = (n) => e.state.join = n === "count" ? 1 : n)
          }, null, 8, ["model-value"])
        ]),
        typeof e.state.join == "number" ? (c(), g("label", wd, [
          i[44] || (i[44] = r("span", { class: "work-spacer" }, "Lanes needed", -1)),
          b(s(Ge), {
            modelValue: e.state.join,
            "onUpdate:modelValue": i[17] || (i[17] = (n) => e.state.join = n),
            min: 1,
            max: e.state.regions.length,
            useGrouping: !1
          }, null, 8, ["modelValue", "max"])
        ])) : E("", !0)
      ], 64)) : E("", !0),
      i[51] || (i[51] = r("h4", { class: "work-process-group" }, "Limit", -1)),
      r("label", Vd, [
        i[46] || (i[46] = r("span", { class: "work-spacer" }, "Items allowed here", -1)),
        b(gl, {
          draft: e.draft,
          state: e.state.id,
          label: "Items allowed here"
        }, null, 8, ["draft", "state"])
      ]),
      r("label", $d, [
        i[47] || (i[47] = r("span", { class: "work-spacer" }, [
          M("Refuse moves over the limit"),
          r("small", { class: "work-muted work-block" }, "Off only warns")
        ], -1)),
        b(gl, {
          draft: e.draft,
          state: e.state.id,
          label: "Refuse moves over the limit",
          hard: ""
        }, null, 8, ["draft", "state"])
      ]),
      i[52] || (i[52] = r("h4", { class: "work-process-group" }, "Required on entry", -1)),
      b(zt, {
        label: "Required fields",
        options: e.draft.fields?.map((n) => ({ value: n.code, label: n.title || n.code })) ?? [],
        modelValue: e.state.require,
        "onUpdate:modelValue": i[18] || (i[18] = (n) => e.state.require = n)
      }, null, 8, ["options", "modelValue"]),
      !e.state.kind || e.state.kind === "human" ? (c(), F(xt, {
        key: 3,
        modelValue: e.state.due,
        "onUpdate:modelValue": i[19] || (i[19] = (n) => e.state.due = n),
        label: "Time allowed in this state",
        onValidity: i[20] || (i[20] = (n, u) => a("validity", u, n))
      }, null, 8, ["modelValue"])) : E("", !0),
      i[53] || (i[53] = r("h4", { class: "work-process-group" }, "Assignment and conditions", -1)),
      r("label", xd, [
        i[48] || (i[48] = M("Stage label", -1)),
        b(s(re), {
          "model-value": e.state.stage,
          "aria-label": "Stage label",
          "onUpdate:modelValue": i[21] || (i[21] = (n) => e.state.stage = n || void 0)
        }, null, 8, ["model-value"])
      ]),
      !e.state.kind || e.state.kind === "human" || e.state.kind === "parallel" ? (c(), g(H, { key: 4 }, [
        r("label", Cd, [
          b(s(ze), {
            "model-value": !!e.state.awaiting,
            "aria-label": "Awaiting people",
            "onUpdate:modelValue": i[22] || (i[22] = (n) => e.state.awaiting = n ? { group: "" } : void 0)
          }, null, 8, ["model-value"]),
          i[49] || (i[49] = M("Awaiting people", -1))
        ]),
        e.state.awaiting ? (c(), F(Yr, {
          key: 0,
          modelValue: e.state.awaiting,
          "onUpdate:modelValue": i[23] || (i[23] = (n) => e.state.awaiting = n),
          draft: e.draft,
          "board-id": e.boardId,
          label: "Awaiting",
          onValidity: i[24] || (i[24] = (n) => a("validity", "awaiting", n))
        }, null, 8, ["modelValue", "draft", "board-id"])) : E("", !0)
      ], 64)) : E("", !0),
      b(ea, {
        "board-id": e.boardId,
        modelValue: e.state.assign,
        "onUpdate:modelValue": i[25] || (i[25] = (n) => e.state.assign = n),
        label: "Assign to"
      }, null, 8, ["board-id", "modelValue"]),
      b(lt, {
        label: "State checks",
        example: ["installed-check"],
        "model-value": e.state.invariants,
        shape: "array",
        "onUpdate:modelValue": i[26] || (i[26] = (n) => e.state.invariants = n),
        onValidity: i[27] || (i[27] = (n) => a("validity", "invariants", n))
      }, null, 8, ["model-value"]),
      b(qr, {
        state: e.state,
        draft: e.draft,
        onValidity: i[28] || (i[28] = (n, u) => a("validity", "timer-" + n, u))
      }, null, 8, ["state", "draft"])
    ]));
  }
}), Td = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, Ed = {
  class: "work-process-controls",
  role: "toolbar",
  "aria-label": "Process tools"
}, Ud = {
  key: 1,
  class: "work-process-title"
}, Dd = { class: "work-muted" }, Id = {
  key: 2,
  class: "work-map-zoom",
  role: "group",
  "aria-label": "Map zoom"
}, Ad = ["aria-label"], Pd = { class: "work-row" }, Rd = { class: "work-process-meaning" }, Od = { class: "work-stack work-tight" }, Nd = { class: "work-process-inspector-foot" }, Md = { class: "work-row" }, Ld = { class: "work-process-meaning" }, zd = { class: "work-stack work-tight" }, Fd = { class: "work-process-inspector-foot" }, Bd = {
  key: 3,
  class: "work-row"
}, jd = { class: "work-stack work-tight" }, qd = { class: "work-dialog-actions" }, Wd = /* @__PURE__ */ ve({
  __name: "ProcessEditor",
  props: {
    draft: {},
    guardRemoval: { type: Function },
    issues: {},
    boardId: {}
  },
  emits: ["validity"],
  setup(e, { emit: l }) {
    const t = e, a = l, o = G(() => t.draft.processes ?? []), d = z(!1), v = z(""), m = z(""), f = z(""), i = z("Map"), n = z(""), u = z(), y = z(), p = z(), w = z(), S = z(!1);
    async function U() {
      S.value = !0, await fo(), w.value?.querySelector('[aria-label="State name"]')?.focus();
    }
    const $ = G(() => o.value.find((x) => x.id === m.value) ?? o.value[0]);
    function I() {
      S.value = !1, u.value = void 0, y.value = void 0, f.value = "";
    }
    function T(x) {
      S.value = !1, u.value = x, y.value = void 0, n.value = "", f.value = "";
    }
    function D(x) {
      S.value = !1, y.value = x, u.value = void 0, f.value = "";
    }
    Ce($, I);
    function V(x) {
      x === "__new" ? d.value = !0 : m.value = x;
    }
    function P() {
      const x = v.value.trim();
      if (!x) return;
      const R = x.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "") || "process", N = (/^[a-z]/.test(R) ? R : "process_" + R).slice(0, 40), X = o.value.some((ue) => ue.id === N) ? Vt(N, o.value) : N;
      (t.draft.processes ??= []).push({ id: X, name: x, initial: "todo", states: [{ id: "todo", name: "To do", category: "unstarted" }], transitions: [] }), m.value = X, v.value = "", d.value = !1;
    }
    async function Z(x) {
      const R = { id: Vt("state", x.states), name: "New state", category: "started" }, N = Bl(x), X = N.at(-1), ue = u.value ?? (X?.category === "completed" ? N.at(-2) : X), pe = ue && (x.transitions?.find((ke) => ke.default && ke.from !== "any" && ke.from.includes(ue.id)) ?? x.transitions?.find((ke) => ke.from !== "any" && ke.from.includes(ue.id) && x.states.findIndex((Ve) => Ve.id === ke.to) > x.states.indexOf(ue)));
      if (x.states.splice(ue ? x.states.indexOf(ue) + 1 : x.states.length, 0, R), ue && ue.category !== "completed" && ue.category !== "canceled")
        if (pe) {
          const ke = pe.to;
          pe.to = R.id, (x.transitions ??= []).push({ id: Vt("transition", x.transitions ?? []), name: "Continue", from: [R.id], to: ke, ...pe.auto && pe.default ? { auto: !0, default: !0 } : {} });
        } else (x.transitions ??= []).push({ id: Vt("transition", x.transitions ?? []), name: "Continue", from: [ue.id], to: R.id });
      T(R), await U();
    }
    function de(x, R) {
      const N = $.value;
      if (!N || !R || x === R) return;
      let X = `to_${R}`, ue = 2;
      for (; N.transitions?.some((ke) => ke.id === X); ) X = `to_${R}_${ue++}`;
      const pe = { id: X, name: `To ${he(N.states.find((ke) => ke.id === R)).toLowerCase()}`, from: [x], to: R };
      (N.transitions ??= []).push(pe), D(pe);
    }
    function ne(x) {
      const R = { id: Vt("transition", x.transitions ?? []), name: "To " + he(x.states.at(-1)), from: [x.initial], to: x.states.at(-1)?.id ?? x.initial };
      (x.transitions ??= []).push(R), D(R);
    }
    function B(x, R) {
      const N = So(x, R);
      if (N.length) {
        f.value = `Used by ${N.join(", ")}. Update those references first.`;
        return;
      }
      x.transitions?.splice(x.transitions.indexOf(R), 1), I();
    }
    function O(x, R) {
      const N = To(x, R);
      if (N.length) {
        f.value = `${he(R)} is used by ${N.join(", ")}. Update these references first.`;
        return;
      }
      x.states.splice(x.states.indexOf(R), 1), I();
    }
    async function oe(x) {
      const R = t.draft.item_types?.filter((X) => X.process === x.id).map((X) => X.title || "Untitled item type") ?? [];
      if (R.length) {
        f.value = `Used by ${R.join(", ")}. Choose a different process for those item types first.`;
        return;
      }
      const N = await t.guardRemoval?.("processes", x.id);
      if (N) {
        f.value = N;
        return;
      }
      _t(t.draft, "processes", x.id), m.value = "", I();
    }
    return (x, R) => (c(), g("section", {
      class: "work-process-editor work-stack",
      "aria-label": "Process editor",
      onKeydown: Ae(I, ["esc"])
    }, [
      f.value ? (c(), g("p", Td, A(f.value), 1)) : E("", !0),
      (c(!0), g(H, null, ee(e.issues?.filter((N) => N.code === "process " + $.value?.id) ?? [], (N) => (c(), g("p", {
        key: N.what + N.detail,
        class: "work-error work-small",
        role: "alert"
      }, A(s(wl)(N)) + " · " + A(N.what), 1))), 128)),
      $.value ? (c(), g("div", {
        key: 1,
        class: mt(["work-process-builder", { "work-process-inspecting": u.value || y.value }])
      }, [
        r("div", Ed, [
          o.value.length > 1 ? (c(), F(s(te), {
            key: 0,
            "model-value": $.value.id,
            "aria-label": "Process",
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            options: [
              ...o.value.map((N) => ({ label: N.name || "Untitled process", value: N.id })),
              { label: "New process…", value: "__new" }
            ],
            "onUpdate:modelValue": V
          }, null, 8, ["model-value", "options"])) : (c(), g("span", Ud, A($.value.name || "Process"), 1)),
          b(s(Y), {
            label: "Add state",
            severity: "secondary",
            outlined: "",
            size: "small",
            onClick: R[0] || (R[0] = (N) => Z($.value))
          }, {
            icon: L(() => [
              b(s(J), { icon: "tabler:plus" })
            ]),
            _: 1
          }),
          b(s(te), {
            modelValue: $.value.initial,
            "onUpdate:modelValue": R[1] || (R[1] = (N) => $.value.initial = N),
            "aria-label": "Starts in " + s(he)($.value.states.find((N) => N.id === $.value.initial)),
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            options: $.value.states.map((N) => ({ label: s(he)(N), value: N.id }))
          }, {
            value: L(() => [
              r("span", Dd, "Starts in " + A(s(he)($.value.states.find((N) => N.id === $.value.initial))), 1)
            ]),
            _: 1
          }, 8, ["modelValue", "aria-label", "options"]),
          R[17] || (R[17] = r("span", { class: "work-spacer" }, null, -1)),
          i.value === "Map" ? (c(), g("div", Id, [
            b(s(Y), {
              label: "Fit",
              title: "Fit to width and show the full process",
              text: "",
              severity: "secondary",
              size: "small",
              onClick: R[2] || (R[2] = (N) => p.value?.fit())
            }, {
              icon: L(() => [
                b(s(J), { icon: "tabler:arrows-maximize" })
              ]),
              _: 1
            }),
            i.value === "Map" ? (c(), F(s(Y), {
              key: 0,
              "aria-label": "Zoom out",
              title: "Zoom out",
              text: "",
              severity: "secondary",
              size: "small",
              onClick: R[3] || (R[3] = (N) => p.value?.zoomOut())
            }, {
              default: L(() => [
                b(s(J), { icon: "tabler:minus" })
              ]),
              _: 1
            })) : E("", !0),
            i.value === "Map" ? (c(), F(s(Y), {
              key: 1,
              "aria-label": "Zoom in",
              title: "Zoom in",
              text: "",
              severity: "secondary",
              size: "small",
              onClick: R[4] || (R[4] = (N) => p.value?.zoomIn())
            }, {
              default: L(() => [
                b(s(J), { icon: "tabler:plus" })
              ]),
              _: 1
            })) : E("", !0)
          ])) : E("", !0),
          b(s(Ql), {
            modelValue: i.value,
            "onUpdate:modelValue": R[5] || (R[5] = (N) => i.value = N),
            options: ["Map", "List"],
            "allow-empty": !1,
            "aria-label": "Process layout"
          }, null, 8, ["modelValue"]),
          o.value.length === 1 ? (c(), F(s(Y), {
            key: 3,
            label: "New process",
            "aria-label": "New process",
            text: "",
            severity: "secondary",
            size: "small",
            onClick: R[6] || (R[6] = (N) => d.value = !0)
          }, {
            icon: L(() => [
              b(s(J), { icon: "tabler:plus" })
            ]),
            _: 1
          })) : E("", !0)
        ]),
        i.value === "Map" ? (c(), F(sr, {
          key: 0,
          ref_key: "graph",
          ref: p,
          process: $.value,
          draft: e.draft,
          "selected-state": u.value,
          "selected-transition": y.value,
          onState: T,
          onTransition: D,
          onConnect: de,
          onClear: I
        }, null, 8, ["process", "draft", "selected-state", "selected-transition"])) : (c(), F(yr, {
          key: 1,
          process: $.value,
          "selected-state": u.value,
          "selected-transition": y.value,
          onState: T,
          onTransition: D,
          onRemoveState: R[7] || (R[7] = (N) => O($.value, N)),
          onRemoveTransition: R[8] || (R[8] = (N) => B($.value, N)),
          onAddTransition: R[9] || (R[9] = (N) => ne($.value))
        }, null, 8, ["process", "selected-state", "selected-transition"])),
        u.value || y.value ? (c(), g("aside", {
          key: 2,
          ref_key: "inspector",
          ref: w,
          class: "work-process-sideform",
          "aria-label": u.value ? "State inspector" : "Transition inspector"
        }, [
          (c(!0), g(H, null, ee(u.value ? [u.value] : [], (N) => (c(), g(H, {
            key: N.id
          }, [
            r("header", Pd, [
              S.value ? (c(), F(s(re), {
                key: 1,
                modelValue: N.name,
                "onUpdate:modelValue": (X) => N.name = X,
                class: "work-process-name",
                "aria-label": "State name",
                onBlur: R[10] || (R[10] = (X) => S.value = !1)
              }, null, 8, ["modelValue", "onUpdate:modelValue"])) : (c(), F(Jl, {
                key: 0,
                class: "work-process-state-title",
                "aria-label": "Rename state",
                onActivate: U
              }, {
                default: L(() => [
                  r("span", null, A(s(he)(N)), 1)
                ]),
                _: 2
              }, 1024)),
              b(s(Y), {
                severity: "secondary",
                text: "",
                size: "small",
                "aria-label": "Close state editor",
                onClick: I
              }, {
                default: L(() => [
                  b(s(J), { icon: "tabler:x" })
                ]),
                _: 1
              })
            ]),
            r("p", Rd, A(s(Co)(N, e.draft)), 1),
            b(Sd, {
              state: N,
              process: $.value,
              draft: e.draft,
              "board-id": e.boardId,
              onValidity: (X, ue) => a("validity", X.includes("duration:") ? X : $.value.id + ":" + N.id + ":" + X, ue)
            }, null, 8, ["state", "process", "draft", "board-id", "onValidity"]),
            r("label", Od, [
              R[18] || (R[18] = M("Phase", -1)),
              b(s(te), {
                modelValue: N.category,
                "onUpdate:modelValue": (X) => N.category = X,
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                options: ["triage", "backlog", ...s(Ia)].map((X) => ({ label: s(Zl)(X), value: X }))
              }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
            ]),
            R[19] || (R[19] = r("h4", { class: "work-process-group" }, "Next stop", -1)),
            b(s(te), {
              modelValue: n.value,
              "onUpdate:modelValue": R[11] || (R[11] = (X) => n.value = X),
              "aria-label": "Add transition to…",
              placeholder: "Add transition to…",
              appendTo: "self",
              optionLabel: "label",
              optionValue: "value",
              options: $.value.states.filter((X) => X !== N).map((X) => ({ label: s(he)(X), value: X.id }))
            }, null, 8, ["modelValue", "options"]),
            b(s(Y), {
              label: "Add transition",
              severity: "secondary",
              outlined: "",
              size: "small",
              disabled: !n.value,
              onClick: (X) => de(N.id, n.value)
            }, {
              icon: L(() => [
                b(s(J), { icon: "tabler:arrow-right" })
              ]),
              _: 1
            }, 8, ["disabled", "onClick"]),
            r("footer", Nd, [
              b(s(Y), {
                label: "Remove state",
                severity: "danger",
                text: "",
                size: "small",
                onClick: (X) => O($.value, N)
              }, {
                icon: L(() => [
                  b(s(J), { icon: "tabler:trash" })
                ]),
                _: 1
              }, 8, ["onClick"])
            ])
          ], 64))), 128)),
          (c(!0), g(H, null, ee(y.value ? [y.value] : [], (N) => (c(), g(H, {
            key: N.id
          }, [
            r("header", Md, [
              R[20] || (R[20] = r("h3", null, "Transition", -1)),
              R[21] || (R[21] = r("span", { class: "work-spacer" }, null, -1)),
              b(s(Y), {
                severity: "secondary",
                text: "",
                size: "small",
                "aria-label": "Close transition editor",
                onClick: I
              }, {
                default: L(() => [
                  b(s(J), { icon: "tabler:x" })
                ]),
                _: 1
              })
            ]),
            r("p", Ld, A(N.from === "any" ? "Any state" : N.from.map((X) => s(he)($.value.states.find((ue) => ue.id === X))).join(", ")) + " → " + A(s(he)($.value.states.find((X) => X.id === N.to))), 1),
            r("label", zd, [
              R[22] || (R[22] = M("Name", -1)),
              b(s(re), {
                modelValue: N.name,
                "onUpdate:modelValue": (X) => N.name = X,
                placeholder: s(je)(N),
                "aria-label": "Transition name"
              }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder"])
            ]),
            b(Er, {
              transition: N,
              process: $.value,
              draft: e.draft,
              "board-id": e.boardId,
              onValidity: (X, ue) => a("validity", $.value.id + ":transition-" + N.id + ":" + X, ue)
            }, null, 8, ["transition", "process", "draft", "board-id", "onValidity"]),
            r("footer", Fd, [
              b(s(Y), {
                label: "Remove transition",
                severity: "danger",
                text: "",
                size: "small",
                onClick: (X) => B($.value, N)
              }, {
                icon: L(() => [
                  b(s(J), { icon: "tabler:trash" })
                ]),
                _: 1
              }, 8, ["onClick"])
            ])
          ], 64))), 128))
        ], 8, Ad)) : E("", !0)
      ], 2)) : (c(), F(s(Y), {
        key: 2,
        label: "New process",
        severity: "secondary",
        outlined: "",
        onClick: R[12] || (R[12] = (N) => d.value = !0)
      }, {
        icon: L(() => [
          b(s(J), { icon: "tabler:plus" })
        ]),
        _: 1
      })),
      i.value === "List" && $.value ? (c(), g("div", Bd, [
        b(s(Y), {
          label: "Remove process",
          severity: "danger",
          text: "",
          size: "small",
          onClick: R[13] || (R[13] = (N) => oe($.value))
        }, {
          icon: L(() => [
            b(s(J), { icon: "tabler:trash" })
          ]),
          _: 1
        })
      ])) : E("", !0),
      b(Ra, {
        visible: d.value,
        label: "New process",
        onClose: R[16] || (R[16] = (N) => d.value = !1)
      }, {
        default: L(() => [
          r("form", {
            class: "work-dialog-box",
            "aria-label": "New process",
            onSubmit: be(P, ["stop", "prevent"])
          }, [
            R[24] || (R[24] = r("h2", null, "New process", -1)),
            r("label", jd, [
              R[23] || (R[23] = M("Name", -1)),
              b(s(re), {
                modelValue: v.value,
                "onUpdate:modelValue": R[14] || (R[14] = (N) => v.value = N),
                "aria-label": "New process name",
                autofocus: "",
                required: ""
              }, null, 8, ["modelValue"])
            ]),
            r("div", qd, [
              b(s(Y), {
                label: "Cancel",
                severity: "secondary",
                outlined: "",
                onClick: R[15] || (R[15] = (N) => d.value = !1)
              }),
              b(s(Y), {
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
}), Kd = ["inert"], Gd = { class: "work-stack work-tight" }, Yd = /* @__PURE__ */ ve({
  __name: "ProcessMigration",
  props: {
    draft: {},
    original: {},
    disabled: { type: Boolean }
  },
  setup(e) {
    const l = e;
    function t(o, d, v) {
      v ? (o.map ??= {})[d] = v : o.map && delete o.map[d];
    }
    function a(o) {
      return l.original.processes?.find((d) => d.id === o.id)?.states.filter((d) => !o.states.some((v) => v.id === d.id)) ?? [];
    }
    return (o, d) => (c(), g("section", {
      class: "work-stack work-settings-card",
      "aria-label": "Existing items",
      inert: e.disabled || void 0
    }, [
      d[0] || (d[0] = r("h3", null, "Existing items", -1)),
      d[1] || (d[1] = r("p", { class: "work-muted work-small" }, " Choose how existing items follow these changes, then review the impact before applying. ", -1)),
      (c(!0), g(H, null, ee(e.draft.processes ?? [], (v) => (c(), g("div", {
        key: v.id,
        class: "work-stack"
      }, [
        r("label", Gd, [
          M(A(v.name || "Untitled process"), 1),
          b(s(te), {
            disabled: e.disabled,
            "model-value": s(ra)(v),
            "aria-label": "Existing items in " + (v.name || "this process"),
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            options: [
              { label: "Follow new process", value: "follow" },
              { label: "Keep current process", value: "pin" }
            ],
            "onUpdate:modelValue": (m) => v.migration = m
          }, null, 8, ["disabled", "model-value", "aria-label", "onUpdate:modelValue"])
        ]),
        s(ra)(v) !== "pin" ? (c(!0), g(H, { key: 0 }, ee(a(v), (m) => (c(), g("label", {
          key: m.id,
          class: "work-stack work-tight"
        }, [
          M("Move items from " + A(s(he)(m)) + " to", 1),
          b(s(te), {
            disabled: e.disabled,
            "model-value": v.map?.[m.id],
            placeholder: "Choose a surviving state",
            appendTo: "self",
            showClear: "",
            optionLabel: "label",
            optionValue: "value",
            options: v.states.map((f) => ({ label: s(he)(f), value: f.id })),
            "onUpdate:modelValue": (f) => t(v, m.id, f)
          }, null, 8, ["disabled", "model-value", "options", "onUpdate:modelValue"])
        ]))), 128)) : E("", !0)
      ]))), 128))
    ], 8, Kd));
  }
});
function eo(e) {
  return Object.entries(Ke(e.properties)).map(([l, t]) => {
    const a = Ke(t);
    return { key: l, title: typeof a.title == "string" && a.title.trim() ? a.title : ge(l), description: typeof a.description == "string" ? a.description : "", schema: a };
  });
}
const to = (e) => e.type === "array" && Ke(e.items).type === "string";
function Hd(e, l) {
  const t = {};
  for (const a of eo(e)) {
    const o = l[a.key] ?? a.schema.default, d = a.schema;
    let v = "";
    if (o == null)
      Array.isArray(e.required) && e.required.includes(a.key) && (v = "A value is required.");
    else if (Array.isArray(d.enum) && !d.enum.includes(o)) v = "Choose one of the available values.";
    else if (d.type === "integer" || d.type === "number")
      typeof o != "number" || !Number.isFinite(o) || d.type === "integer" && !Number.isInteger(o) ? v = d.type === "integer" ? "Enter a whole number." : "Enter a number." : typeof d.minimum == "number" && o < d.minimum ? v = `Enter at least ${d.minimum}.` : typeof d.maximum == "number" && o > d.maximum && (v = `Enter at most ${d.maximum}.`);
    else if (d.type === "boolean" && typeof o != "boolean") v = "Choose on or off.";
    else if (d.type === "string") {
      if (typeof o != "string") v = "Enter text.";
      else if (typeof d.minLength == "number" && o.length < d.minLength) v = `Enter at least ${d.minLength} characters.`;
      else if (typeof d.maxLength == "number" && o.length > d.maxLength) v = `Enter at most ${d.maxLength} characters.`;
      else if (typeof d.pattern == "string")
        try {
          new RegExp(d.pattern).test(o) || (v = "Use the required format.");
        } catch {
          v = "The declared format is unavailable.";
        }
    } else if (d.type === "array") {
      if (!Array.isArray(o)) v = "Enter a list.";
      else if (typeof d.maxItems == "number" && o.length > d.maxItems) v = `Use at most ${d.maxItems} entries.`;
      else if (typeof d.minItems == "number" && o.length < d.minItems) v = `Use at least ${d.minItems} entries.`;
      else if (d.uniqueItems && new Set(o).size !== o.length) v = "Remove duplicate entries.";
      else if (to(d)) {
        const m = Ke(d.items);
        o.some((f) => typeof f != "string" || typeof m.minLength == "number" && f.length < m.minLength || typeof m.maxLength == "number" && f.length > m.maxLength) && (v = "Each entry must match the declared text length.");
      }
    } else d.type === "object" && (typeof o != "object" || Array.isArray(o)) && (v = "Enter an object.");
    v && (t[a.key] = v);
  }
  return t;
}
const Xd = { class: "work-stack" }, Jd = ["schema", "config"], Zd = {
  key: 1,
  role: "status",
  class: "work-muted work-small"
}, Qd = {
  key: 2,
  role: "alert",
  class: "kx-err"
}, _d = { class: "work-config-fields" }, eu = ["for"], tu = {
  key: 1,
  class: "work-config-chips"
}, lu = {
  key: 6,
  class: "work-muted work-small"
}, au = {
  key: 7,
  role: "alert",
  class: "work-error work-small"
}, lo = /* @__PURE__ */ ve({
  __name: "ConfigForm",
  props: {
    schema: {},
    modelValue: {},
    disabled: { type: Boolean }
  },
  emits: ["update:modelValue", "validity"],
  setup(e, { emit: l }) {
    const t = e, a = l, o = z({}), d = z(/* @__PURE__ */ new Set()), v = z(!1), m = z(!1), f = G(() => eo(t.schema)), i = G(() => Hd(t.schema, t.modelValue)), n = G(() => f.value.filter((D) => typeof D.schema.picker == "string")), u = G(() => f.value.filter((D) => typeof D.schema.picker != "string")), y = G(() => ({ ...t.schema, properties: Object.fromEntries(n.value.map((D) => [D.key, { ...D.schema, title: D.title }])), required: Array.isArray(t.schema.required) ? t.schema.required.filter((D) => n.value.some((V) => V.key === D)) : [] })), p = G(() => Object.fromEntries(n.value.map((D) => [D.key, t.modelValue[D.key]])));
    Ce([i, d, () => n.value.length > 0 && !v.value], () => a("validity", !Object.keys(i.value).length && !d.value.size && (!n.value.length || v.value)), { immediate: !0, deep: !0 });
    async function w() {
      m.value = !0, v.value = await vt("wc-schema-form"), m.value = !1;
    }
    Ce(() => n.value.length > 0, (D) => {
      D && w();
    }, { immediate: !0 }), ft(() => a("validity", !0));
    function S(D, V) {
      const P = { ...t.modelValue };
      V == null ? delete P[D] : P[D] = V, a("update:modelValue", P);
    }
    function U(D) {
      const V = t.modelValue[D];
      return Array.isArray(V) ? V.filter((P) => typeof P == "string") : [];
    }
    function $(D) {
      const V = o.value[D]?.trim();
      V && (S(D, [...U(D), V]), o.value[D] = "");
    }
    function I(D, V) {
      V ? d.value.delete(D) : d.value.add(D);
    }
    function T(D) {
      a("update:modelValue", { ...t.modelValue, ...Ke(D.detail) });
    }
    return (D, V) => (c(), g("div", Xd, [
      n.value.length && v.value ? (c(), g("wc-schema-form", {
        key: 0,
        class: "work-config-widget",
        schema: JSON.stringify(y.value),
        config: JSON.stringify(p.value),
        onConfigChanged: T
      }, null, 40, Jd)) : n.value.length && m.value ? (c(), g("p", Zd, "The configuration widget is loading.")) : n.value.length ? (c(), g("p", Qd, [
        V[0] || (V[0] = M("The configuration widget is unavailable.", -1)),
        b(s(Y), {
          label: "Reload configuration widget",
          severity: "secondary",
          outlined: "",
          onClick: w
        })
      ])) : E("", !0),
      r("div", _d, [
        (c(!0), g(H, null, ee(u.value, (P) => (c(), g("div", {
          key: P.key,
          class: "work-config-field"
        }, [
          r("label", {
            class: "work-config-label",
            for: "config-" + P.key
          }, A(P.title), 9, eu),
          Array.isArray(P.schema.enum) ? (c(), F(s(te), {
            key: 0,
            "input-id": "config-" + P.key,
            "model-value": e.modelValue[P.key] ?? P.schema.default,
            options: P.schema.enum,
            appendTo: "self",
            "aria-label": P.title,
            disabled: e.disabled,
            "onUpdate:modelValue": (Z) => S(P.key, Z)
          }, null, 8, ["input-id", "model-value", "options", "aria-label", "disabled", "onUpdate:modelValue"])) : s(to)(P.schema) ? (c(), g("div", tu, [
            (c(!0), g(H, null, ee(U(P.key), (Z, de) => (c(), F(s(Oo), {
              key: de,
              label: Z,
              removable: !e.disabled,
              onRemove: (ne) => S(P.key, U(P.key).filter((B, O) => O !== de))
            }, null, 8, ["label", "removable", "onRemove"]))), 128)),
            b(s(re), {
              id: "config-" + P.key,
              modelValue: o.value[P.key],
              "onUpdate:modelValue": (Z) => o.value[P.key] = Z,
              "aria-label": "Add " + P.title.toLocaleLowerCase(),
              disabled: e.disabled,
              placeholder: "Type and press Enter",
              onKeydown: Ae(be((Z) => $(P.key), ["stop", "prevent"]), ["enter"]),
              onBlur: (Z) => $(P.key)
            }, null, 8, ["id", "modelValue", "onUpdate:modelValue", "aria-label", "disabled", "onKeydown", "onBlur"])
          ])) : ["integer", "number"].includes(String(P.schema.type)) ? (c(), F(s(Ge), {
            key: 2,
            "input-id": "config-" + P.key,
            "model-value": e.modelValue[P.key] ?? P.schema.default,
            "max-fraction-digits": P.schema.type === "integer" ? 0 : 8,
            "use-grouping": !1,
            "aria-label": P.title,
            disabled: e.disabled,
            invalid: !!i.value[P.key],
            "onUpdate:modelValue": (Z) => S(P.key, Z)
          }, null, 8, ["input-id", "model-value", "max-fraction-digits", "aria-label", "disabled", "invalid", "onUpdate:modelValue"])) : P.schema.type === "boolean" ? (c(), F(s(ze), {
            key: 3,
            "input-id": "config-" + P.key,
            "model-value": !!(e.modelValue[P.key] ?? P.schema.default),
            "aria-label": P.title,
            disabled: e.disabled,
            "onUpdate:modelValue": (Z) => S(P.key, Z)
          }, null, 8, ["input-id", "model-value", "aria-label", "disabled", "onUpdate:modelValue"])) : ["array", "object"].includes(String(P.schema.type)) ? (c(), F(lt, {
            key: 4,
            label: P.title,
            "model-value": e.modelValue[P.key],
            shape: P.schema.type === "array" ? "array" : "object",
            example: P.schema.default ?? (P.schema.type === "array" ? [] : {}),
            "onUpdate:modelValue": (Z) => S(P.key, Z),
            onValidity: (Z) => I(P.key, Z)
          }, null, 8, ["label", "model-value", "shape", "example", "onUpdate:modelValue", "onValidity"])) : (c(), F(s(re), {
            key: 5,
            id: "config-" + P.key,
            "model-value": e.modelValue[P.key] ?? P.schema.default ?? "",
            disabled: e.disabled,
            invalid: !!i.value[P.key],
            "aria-label": P.title,
            "onUpdate:modelValue": (Z) => S(P.key, Z)
          }, null, 8, ["id", "model-value", "disabled", "invalid", "aria-label", "onUpdate:modelValue"])),
          P.description ? (c(), g("p", lu, A(P.description), 1)) : E("", !0),
          i.value[P.key] ? (c(), g("p", au, A(i.value[P.key]), 1)) : E("", !0)
        ]))), 128))
      ])
    ]));
  }
}), ou = {
  class: "work-stack",
  "aria-label": "Policy editor"
}, iu = { class: "work-settings-list" }, nu = { class: "work-settings-row" }, su = { class: "work-row-control" }, ru = { class: "work-settings-list work-wip-container" }, du = { class: "work-wip-table" }, uu = { class: "work-mono" }, cu = { class: "work-row-main" }, vu = { class: "work-row" }, mu = { class: "work-row" }, fu = { class: "work-settings-list" }, pu = { class: "work-settings-row" }, bu = { class: "work-row-control" }, hu = { class: "work-row-main" }, yu = { class: "work-row-title" }, gu = { class: "work-muted work-small" }, ku = { class: "work-row-control" }, wu = /* @__PURE__ */ ve({
  __name: "PolicyEditor",
  props: {
    draft: {}
  },
  emits: ["validity"],
  setup(e, { emit: l }) {
    const t = e, a = l, o = G(() => t.draft.policy ?? {}), d = G(() => [...new Set(t.draft.processes?.flatMap((n) => n.states.map((u) => u.id)) ?? [])]), v = ["audit_days", "trash_days", "tombstone_days", "interval_days"], m = { audit_days: "Zero selects 365 days.", interval_days: "Zero selects 365 days.", trash_days: "Zero allows immediate cleanup of trashed items.", tombstone_days: "Zero allows immediate cleanup of deletion records." };
    function f(n, u) {
      u === void 0 ? t.draft.policy && delete t.draft.policy[n] : (t.draft.policy ??= {})[n] = u;
    }
    function i(n, u) {
      f(n, u ?? void 0);
    }
    return (n, u) => (c(), g("section", ou, [
      u[13] || (u[13] = r("header", { class: "work-section-heading" }, [
        r("div", null, [
          r("h2", null, "Policy"),
          r("p", { class: "work-muted work-small" }, "Set capacity and how long the board keeps its history.")
        ])
      ], -1)),
      u[14] || (u[14] = r("h3", { class: "work-group-title" }, "Item keys", -1)),
      r("div", iu, [
        r("div", nu, [
          u[7] || (u[7] = r("div", { class: "work-row-main" }, [
            r("strong", { class: "work-row-title" }, "Item key prefix"),
            r("p", { class: "work-muted work-small" }, "Work reviews and claims prefix changes when you apply the schema.")
          ], -1)),
          r("div", su, [
            b(s(re), {
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
      u[15] || (u[15] = r("h3", { class: "work-group-title" }, "Work in progress", -1)),
      u[16] || (u[16] = r("p", { class: "work-muted work-small" }, "A blank limit sets no restriction. A hard limit rejects transitions over capacity.", -1)),
      r("div", ru, [
        r("table", du, [
          u[8] || (u[8] = r("thead", null, [
            r("tr", null, [
              r("th", null, "State"),
              r("th", null, "Limit"),
              r("th", null, "Hard limit")
            ])
          ], -1)),
          r("tbody", null, [
            (c(!0), g(H, null, ee(d.value, (y) => (c(), g("tr", { key: y }, [
              r("td", null, [
                r("strong", null, A(e.draft.processes?.flatMap((p) => p.states).find((p) => p.id === y)?.name || s(ge)(y)), 1),
                r("code", uu, A(y), 1)
              ]),
              r("td", null, [
                b(gl, {
                  draft: e.draft,
                  state: y,
                  label: y + " WIP limit"
                }, null, 8, ["draft", "state", "label"])
              ]),
              r("td", null, [
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
        (c(!0), g(H, null, ee(Object.keys(o.value.wip ?? {}).filter((y) => !d.value.includes(y)), (y) => (c(), g("div", {
          key: y,
          class: "work-settings-row"
        }, [
          r("div", cu, [
            M(A(s(ge)(y)) + " ", 1),
            u[9] || (u[9] = r("span", { class: "work-muted" }, "Removed state", -1))
          ]),
          b(s(Y), {
            label: "Remove stale limit",
            severity: "secondary",
            outlined: "",
            onClick: (p) => delete o.value.wip[y]
          }, {
            icon: L(() => [
              b(s(J), { icon: "tabler:trash" })
            ]),
            _: 1
          }, 8, ["onClick"])
        ]))), 128))
      ]),
      u[17] || (u[17] = r("h3", { class: "work-group-title" }, "Automated stages", -1)),
      b(xt, {
        "model-value": o.value.stage_timeout,
        "onUpdate:modelValue": u[1] || (u[1] = (y) => f("stage_timeout", y)),
        label: "Default attempt timeout",
        onValidity: u[2] || (u[2] = (y, p) => a("validity", p, y))
      }, null, 8, ["model-value"]),
      u[18] || (u[18] = r("p", { class: "work-muted work-small" }, "Blank uses one hour. Each retry gets a new deadline.", -1)),
      r("label", vu, [
        u[10] || (u[10] = r("span", { class: "work-spacer" }, "Default maximum visits", -1)),
        b(s(Ge), {
          "model-value": o.value.stage_max_visits ?? null,
          "aria-label": "Default maximum visits",
          min: 1,
          useGrouping: !1,
          placeholder: "5",
          "onUpdate:modelValue": u[3] || (u[3] = (y) => f("stage_max_visits", y ?? void 0))
        }, null, 8, ["model-value"])
      ]),
      u[19] || (u[19] = r("h3", { class: "work-group-title" }, "Comments", -1)),
      r("label", mu, [
        u[11] || (u[11] = r("span", { class: "work-spacer" }, "Comments per item", -1)),
        b(s(Ge), {
          "model-value": o.value.comments_per_item ?? null,
          "aria-label": "Comments per item",
          min: 1,
          max: 1e5,
          useGrouping: !1,
          placeholder: "Application default",
          "onUpdate:modelValue": u[4] || (u[4] = (y) => f("comments_per_item", y ?? void 0))
        }, null, 8, ["model-value"])
      ]),
      u[20] || (u[20] = r("p", { class: "work-muted work-small" }, "Blank follows the application default.", -1)),
      u[21] || (u[21] = r("h3", { class: "work-group-title" }, "Saved query filters", -1)),
      u[22] || (u[22] = r("p", { class: "work-muted work-small" }, "Choose which installed query filters this board can use.", -1)),
      b(lo, {
        schema: { type: "object", properties: { scopes: { type: "array", title: "Query filter identifiers", items: { type: "string" } } } },
        "model-value": { scopes: e.draft.scopes },
        "onUpdate:modelValue": u[5] || (u[5] = (y) => e.draft.scopes = y.scopes)
      }, null, 8, ["model-value"]),
      u[23] || (u[23] = r("h3", { class: "work-group-title" }, "Audit and retention", -1)),
      r("div", fu, [
        r("div", pu, [
          u[12] || (u[12] = r("div", { class: "work-row-main" }, [
            r("strong", { class: "work-row-title" }, "Audit trail"),
            r("p", { class: "work-muted work-small" }, "Choose which item changes appear in history.")
          ], -1)),
          r("div", bu, [
            b(s(te), {
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
        (c(), g(H, null, ee(v, (y) => r("div", {
          key: y,
          class: "work-settings-row"
        }, [
          r("div", hu, [
            r("strong", yu, A(s(ge)(y)), 1),
            r("p", gu, "Blank follows the application default. " + A(m[y]), 1)
          ]),
          r("label", ku, [
            b(s(Ge), {
              min: 0,
              "aria-label": s(ge)(y),
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
}), Vu = {
  class: "work-stack",
  "aria-label": "Relation types editor"
}, $u = { class: "work-section-heading" }, xu = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, Cu = { class: "work-definition-meta work-muted work-small" }, Su = { class: "work-settings-grid" }, Tu = { class: "work-stack work-tight" }, Eu = { class: "work-stack work-tight" }, Uu = { class: "work-stack work-tight" }, Du = { class: "work-stack work-tight" }, Iu = { class: "work-row" }, Au = { class: "work-relation-preview work-small" }, Pu = { class: "work-muted" }, Ru = {
  key: 0,
  class: "kx-empty"
}, Ou = { class: "work-row work-add-definition" }, Nu = { class: "work-stack work-tight" }, Mu = /* @__PURE__ */ ve({
  __name: "RelationsEditor",
  props: {
    draft: {},
    guardRemoval: { type: Function }
  },
  setup(e) {
    const l = e, t = G(() => l.draft.relation_types ?? []), a = z(""), o = z(""), d = z(!1), v = G(() => /^[a-z][a-z0-9_]*$/.test(a.value) && !t.value.some((i) => i.id === a.value));
    function m() {
      v.value && ((l.draft.relation_types ??= []).push({ id: a.value, outward: ge(a.value).toLowerCase(), inward: ge(a.value).toLowerCase(), cardinality: "many" }), a.value = "");
    }
    async function f(i) {
      if (!d.value) {
        d.value = !0, o.value = "";
        try {
          const n = await l.guardRemoval?.("relation_types", i);
          n ? o.value = n : _t(l.draft, "relation_types", i);
        } finally {
          d.value = !1;
        }
      }
    }
    return (i, n) => (c(), g("section", Vu, [
      r("header", $u, [
        n[1] || (n[1] = r("div", null, [
          r("h2", null, "Relation types"),
          r("p", { class: "work-muted work-small" }, "Give each direction a clear label. A used relation keeps its identity and shape.")
        ], -1)),
        b(s(Re), {
          class: "kx-tag-sm",
          severity: "secondary"
        }, {
          default: L(() => [
            M(A(t.value.length) + " " + A(t.value.length === 1 ? "relation" : "relations"), 1)
          ]),
          _: 1
        })
      ]),
      o.value ? (c(), g("p", xu, A(o.value), 1)) : E("", !0),
      b($l, {
        columns: "relations",
        count: t.value.length
      }, {
        default: L(() => [
          (c(!0), g(H, null, ee(t.value, (u, y) => (c(), F(Vl, {
            title: s(ge)(u.id),
            code: u.id,
            kind: u.symmetric ? "Same both ways" : "Different each way",
            key: y,
            class: "work-stack"
          }, {
            usage: L(() => [
              r("span", Cu, A(u.outward || "Related work") + " · " + A(u.inward || "Reverse relation"), 1)
            ]),
            actions: L(() => [
              b(s(Y), {
                severity: "secondary",
                text: "",
                disabled: d.value,
                onClick: (p) => f(u.id),
                "aria-label": "Remove relation",
                size: "small"
              }, {
                default: L(() => [
                  b(s(J), {
                    icon: "tabler:trash",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["disabled", "onClick"])
            ]),
            default: L(() => [
              r("div", Su, [
                r("label", Tu, [
                  n[2] || (n[2] = M("Identifier ", -1)),
                  b(s(re), {
                    modelValue: u.id,
                    "onUpdate:modelValue": (p) => u.id = p,
                    required: "",
                    pattern: "[a-z][a-z0-9_]*",
                    "aria-label": "Relation ID"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                r("label", Eu, [
                  n[3] || (n[3] = M("Outward label ", -1)),
                  b(s(re), {
                    modelValue: u.outward,
                    "onUpdate:modelValue": (p) => u.outward = p,
                    "aria-label": "Outward label"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                r("label", Uu, [
                  n[4] || (n[4] = M("Inward label ", -1)),
                  b(s(re), {
                    modelValue: u.inward,
                    "onUpdate:modelValue": (p) => u.inward = p,
                    "aria-label": "Inward label"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                r("label", Du, [
                  n[5] || (n[5] = M("Links allowed ", -1)),
                  b(s(te), {
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
                r("label", Iu, [
                  b(s(Mt), {
                    modelValue: u.symmetric,
                    "onUpdate:modelValue": (p) => u.symmetric = p,
                    "aria-label": "Same meaning in both directions",
                    binary: ""
                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                  n[6] || (n[6] = M("Same meaning in both directions ", -1))
                ])
              ]),
              r("p", Au, [
                n[7] || (n[7] = r("strong", null, "This item", -1)),
                M(" " + A(u.outward || "relates to") + " ", 1),
                n[8] || (n[8] = r("strong", null, "another item", -1)),
                r("span", Pu, " · reverse: " + A(u.symmetric ? u.outward : u.inward), 1)
              ])
            ]),
            _: 2
          }, 1032, ["title", "code", "kind"]))), 128)),
          t.value.length ? E("", !0) : (c(), g("p", Ru, "No relation types yet. Add one to link related work.")),
          r("div", Ou, [
            r("label", Nu, [
              n[9] || (n[9] = M("New relation ID ", -1)),
              b(s(re), {
                modelValue: a.value,
                "onUpdate:modelValue": n[0] || (n[0] = (u) => a.value = u),
                placeholder: "related_to",
                onKeydown: Ae(be(m, ["prevent"]), ["enter"])
              }, null, 8, ["modelValue", "onKeydown"])
            ]),
            b(s(Y), {
              label: "Add relation",
              severity: "secondary",
              disabled: !v.value,
              onClick: m,
              outlined: ""
            }, {
              icon: L(() => [
                b(s(J), {
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
function Lu(e, l) {
  return e.parked ? "Stopped: " + (typeof e.error == "string" ? e.error : e.error?.message ?? "Projection is parked") : e.bootstrapping ? "Initializing" : e.last_seq >= l ? "Up to date" : "Catching up";
}
const zu = {
  class: "work-stack",
  "aria-label": "Plugins editor"
}, Fu = { class: "work-section-heading" }, Bu = {
  key: 0,
  class: "kx-loading"
}, ju = {
  key: 1,
  class: "kx-err",
  role: "alert"
}, qu = {
  key: 2,
  class: "work-notice",
  role: "status"
}, Wu = { class: "work-row" }, Ku = {
  key: 0,
  class: "work-muted work-small"
}, Gu = {
  key: 1,
  class: "kx-err"
}, Yu = {
  key: 2,
  class: "work-notice"
}, Hu = {
  key: 3,
  class: "work-stack work-tight work-plugin-status",
  role: "status"
}, Xu = {
  key: 0,
  class: "kx-err"
}, Ju = { class: "work-muted work-small" }, Zu = { class: "work-form-actions" }, Qu = {
  key: 0,
  class: "work-muted work-small"
}, xa = /* @__PURE__ */ ve({
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
    const t = e, a = l, o = z({}), d = z(""), v = z(""), m = z(""), f = z(/* @__PURE__ */ new Set()), i = {};
    function n(T) {
      return t.schema.plugins?.find((D) => D.plugin === T);
    }
    function u(T) {
      return n(T)?.active === !0;
    }
    function y(T) {
      return n(T)?.lifecycle.state === "ready";
    }
    function p(T) {
      return t.draft.plugins?.some((D) => D.use === T) === !0;
    }
    function w(T, D) {
      const V = t.draft.plugins ?? [];
      D && !p(T) && (t.draft.plugins = [...V, { use: T }]), D || (t.draft.plugins = V.filter((P) => P.use !== T), delete t.configs[T], f.value.delete(T), a("validity", T, !0));
    }
    function S(T) {
      return u(T) ? o.value[T] ?? n(T)?.config ?? i : t.configs[T] ?? i;
    }
    function U(T, D) {
      u(T) ? o.value[T] = D : t.configs[T] = D;
    }
    function $(T, D) {
      D ? f.value.delete(T) : f.value.add(T), u(T) || a("validity", T, D);
    }
    async function I(T) {
      if (!(d.value || f.value.has(T))) {
        d.value = T, v.value = "", m.value = "";
        try {
          await kt.configure(t.boardId, T, S(T)), delete o.value[T], m.value = "Plugin configuration saved.", a("configured");
        } catch (D) {
          v.value = D instanceof Error ? D.message : "Could not configure plugin.";
        } finally {
          d.value = "";
        }
      }
    }
    return (T, D) => (c(), g("section", zu, [
      r("header", Fu, [
        D[1] || (D[1] = r("div", null, [
          r("h2", null, "Plugins"),
          r("p", { class: "work-muted work-small" }, "Add capabilities from installed modules.")
        ], -1)),
        b(s(Y), {
          label: "Refresh status",
          severity: "secondary",
          outlined: "",
          disabled: !!d.value || e.disabled,
          onClick: D[0] || (D[0] = (V) => a("refresh"))
        }, {
          icon: L(() => [
            b(s(J), {
              icon: "tabler:refresh",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        }, 8, ["disabled"])
      ]),
      D[5] || (D[5] = r("p", { class: "work-muted work-small" }, "Activation joins the schema draft and requires review. Active plugin configuration saves separately. Status reflects the last read; refresh to check progress.", -1)),
      e.options.length ? E("", !0) : (c(), g("p", Bu, "No installed plugins are visible to you.")),
      v.value ? (c(), g("div", ju, A(v.value), 1)) : E("", !0),
      m.value ? (c(), g("p", qu, A(m.value), 1)) : E("", !0),
      b($l, {
        columns: "plugins",
        count: e.options.length
      }, {
        default: L(() => [
          (c(!0), g(H, null, ee(e.options, (V) => (c(), F(Vl, {
            key: V.plugin,
            title: V.title || "Unavailable capability",
            description: V.description,
            kind: u(V.plugin) ? "Active" : p(V.plugin) ? "Pending review" : "Inactive",
            class: "work-stack"
          }, {
            actions: L(() => [
              D[3] || (D[3] = r("span", { class: "work-spacer" }, null, -1)),
              r("label", Wu, [
                b(s(ze), {
                  "model-value": p(V.plugin),
                  disabled: !!d.value || e.disabled || e.activationLocked || !!V.problem,
                  "onUpdate:modelValue": (P) => w(V.plugin, P)
                }, null, 8, ["model-value", "disabled", "onUpdate:modelValue"]),
                D[2] || (D[2] = M("Activate on this board", -1))
              ])
            ]),
            default: L(() => [
              V.requires.length ? (c(), g("p", Ku, "Requires " + A(V.requires.map((P) => e.options.find((Z) => Z.plugin === P)?.title || "Another capability").join(", ")), 1)) : E("", !0),
              V.problem ? (c(), g("p", Gu, A(V.problem.message), 1)) : E("", !0),
              n(V.plugin)?.outdated ? (c(), g("p", Yu, "The stored declaration differs from the installed plugin. Review activation to update it.")) : E("", !0),
              u(V.plugin) ? (c(), g("div", Hu, [
                r("p", null, A(y(V.plugin) ? "Attachment configured" : n(V.plugin)?.lifecycle.state === "failed" ? "Configuration failed" : "Configuring attachment"), 1),
                n(V.plugin)?.lifecycle.error ? (c(), g("p", Xu, A(n(V.plugin)?.lifecycle.error?.message), 1)) : E("", !0),
                (c(!0), g(H, null, ee(n(V.plugin)?.projections, (P, Z) => (c(), g("div", { key: Z }, [
                  r("p", null, A(s(Lu)(P, e.schema.as_of)), 1),
                  r("p", Ju, "Position " + A(P.last_seq) + " · Board head " + A(e.schema.as_of), 1)
                ]))), 128))
              ])) : E("", !0),
              !V.problem && (p(V.plugin) || u(V.plugin)) ? (c(), g(H, { key: 4 }, [
                b(lo, {
                  disabled: !!d.value || e.disabled,
                  schema: V.config_schema,
                  "model-value": S(V.plugin),
                  "onUpdate:modelValue": (P) => U(V.plugin, P),
                  onValidity: (P) => $(V.plugin, P)
                }, null, 8, ["disabled", "schema", "model-value", "onUpdate:modelValue", "onValidity"]),
                r("div", Zu, [
                  b(s(Y), {
                    label: "Reset",
                    severity: "secondary",
                    outlined: "",
                    disabled: !!d.value || e.disabled,
                    onClick: (P) => U(V.plugin, u(V.plugin) ? s(gt)(n(V.plugin)?.config ?? {}) : {})
                  }, {
                    icon: L(() => [
                      b(s(J), { icon: "tabler:restore" })
                    ]),
                    _: 1
                  }, 8, ["disabled", "onClick"]),
                  u(V.plugin) ? (c(), F(s(Y), {
                    key: 0,
                    label: "Save configuration",
                    disabled: !!d.value || e.disabled || f.value.has(V.plugin),
                    loading: d.value === V.plugin,
                    onClick: (P) => I(V.plugin)
                  }, {
                    icon: L(() => [
                      b(s(J), {
                        icon: "tabler:device-floppy",
                        "aria-hidden": "true"
                      })
                    ]),
                    _: 1
                  }, 8, ["disabled", "loading", "onClick"])) : E("", !0)
                ]),
                u(V.plugin) ? E("", !0) : (c(), g("p", Qu, "Initial configuration is included in Review and Apply."))
              ], 64)) : E("", !0)
            ]),
            _: 2
          }, 1032, ["title", "description", "kind"]))), 128))
        ]),
        _: 1
      }, 8, ["count"]),
      (c(!0), g(H, null, ee(e.draft.plugins?.filter((V) => !e.options.some((P) => P.plugin === V.use)) ?? [], (V) => (c(), g("article", {
        key: V.use,
        class: "work-settings-card"
      }, [
        D[4] || (D[4] = r("p", null, "Unavailable plugin", -1)),
        b(s(Y), {
          label: "Deactivate plugin",
          severity: "secondary",
          onClick: (P) => w(V.use, !1),
          outlined: ""
        }, {
          icon: L(() => [
            b(s(J), {
              icon: "tabler:trash",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        }, 8, ["onClick"])
      ]))), 128))
    ]));
  }
}), _u = {
  class: "work-stack",
  "aria-label": "Board visibility"
}, ec = { class: "work-stack work-tight" }, tc = {
  key: 0,
  class: "work-row"
}, lc = { class: "work-stack work-tight" }, ac = { class: "work-settings-list" }, oc = { class: "work-row-main" }, ic = { class: "work-small work-muted" }, nc = { class: "work-row-control" }, sc = { class: "work-row" }, rc = /* @__PURE__ */ ve({
  __name: "VisibilityEditor",
  props: {
    draft: {},
    boardId: {}
  },
  emits: ["validity"],
  setup(e, { emit: l }) {
    const t = e, a = l, o = G(() => t.draft.visibility), d = G(() => (t.draft.fields ?? []).filter((u) => u.form === "text" && (!u.cardinality || u.cardinality === "one") && u.type !== "rollup" && u.index !== "number" && u.config?.case !== "insensitive")), v = z(""), m = G(() => d.value.find((u) => u.code === o.value?.field)?.type !== "option");
    function f() {
      !v.value || !o.value || o.value.levels.some((u) => u.id === v.value) || (o.value.levels.push({ id: v.value, holders: [] }), v.value = "");
    }
    function i(u) {
      if (!u) {
        delete t.draft.visibility;
        return;
      }
      const y = d.value.find((p) => p.code === u);
      t.draft.visibility = { field: u, levels: (y?.options ?? []).map((p) => ({ id: p.id, holders: [] })) };
    }
    function n(u, y) {
      const p = o.value?.levels.find((w) => w.id === u);
      p && (p.holders = y ?? []);
    }
    return (u, y) => (c(), g("section", _u, [
      y[10] || (y[10] = r("h3", { class: "work-group-title" }, "Board visibility", -1)),
      y[11] || (y[11] = r("p", { class: "work-small work-muted" }, "Restrict items by their visibility level. People still need access to the board.", -1)),
      r("label", ec, [
        y[7] || (y[7] = M("Visibility field", -1)),
        b(s(te), {
          "aria-label": "Visibility field",
          placeholder: "No additional restriction",
          "model-value": o.value?.field ?? "",
          options: [{ label: "No additional restriction", value: "" }, ...d.value.map((p) => ({ label: s(Ct)(p), value: p.code }))],
          optionLabel: "label",
          optionValue: "value",
          appendTo: "self",
          "onUpdate:modelValue": y[0] || (y[0] = (p) => i(p))
        }, null, 8, ["model-value", "options"])
      ]),
      o.value ? (c(), g(H, { key: 0 }, [
        m.value ? (c(), g("div", tc, [
          r("label", lc, [
            y[8] || (y[8] = M("Level ID", -1)),
            b(s(re), {
              modelValue: v.value,
              "onUpdate:modelValue": y[1] || (y[1] = (p) => v.value = p),
              "aria-label": "New visibility level",
              onKeydown: Ae(be(f, ["prevent"]), ["enter"])
            }, null, 8, ["modelValue", "onKeydown"])
          ]),
          b(s(Y), {
            label: "Add level",
            severity: "secondary",
            outlined: "",
            disabled: !v.value || o.value.levels.some((p) => p.id === v.value),
            onClick: f
          }, null, 8, ["disabled"])
        ])) : E("", !0),
        r("div", ac, [
          (c(!0), g(H, null, ee(o.value.levels, (p, w) => (c(), g("div", {
            key: p.id,
            class: "work-settings-row"
          }, [
            r("div", oc, [
              r("strong", null, A(d.value.find((S) => S.code === o.value.field)?.options?.find((S) => S.id === p.id)?.label || p.id), 1),
              r("p", ic, "Level " + A(w + 1), 1)
            ]),
            r("div", nc, [
              b(La, {
                "board-id": e.boardId,
                label: "Who can see these items",
                "model-value": p.holders,
                "onUpdate:modelValue": (S) => n(p.id, S),
                onValidity: y[2] || (y[2] = (S) => a("validity", S))
              }, null, 8, ["board-id", "model-value", "onUpdate:modelValue"])
            ])
          ]))), 128))
        ]),
        r("label", sc, [
          b(s(ze), {
            "model-value": o.value.bypass === "admin",
            "onUpdate:modelValue": y[3] || (y[3] = (p) => p ? o.value.bypass = "admin" : delete o.value.bypass)
          }, null, 8, ["model-value"]),
          y[9] || (y[9] = M("Board administrators can see every level", -1))
        ]),
        b(s(Y), {
          label: "Remove visibility restriction",
          severity: "secondary",
          text: "",
          onClick: y[4] || (y[4] = (p) => delete e.draft.visibility)
        })
      ], 64)) : E("", !0),
      b(lt, {
        label: "Visibility rules",
        "model-value": o.value,
        shape: "object",
        example: { field: "visibility", levels: [{ id: "internal", holders: [] }], bypass: "admin" },
        "onUpdate:modelValue": y[5] || (y[5] = (p) => e.draft.visibility = p),
        onValidity: y[6] || (y[6] = (p) => a("validity", p))
      }, null, 8, ["model-value"])
    ]));
  }
}), dc = { class: "kx-head" }, uc = { class: "kx-head-icon" }, cc = { class: "kx-head-text" }, vc = { class: "kx-title" }, mc = ["title"], fc = { class: "kx-head-actions" }, pc = /* @__PURE__ */ ve({
  __name: "PageHead",
  props: {
    title: {},
    subtitle: {},
    icon: { default: "tabler:layout-kanban" },
    backLabel: {}
  },
  emits: ["back"],
  setup(e) {
    return (l, t) => (c(), g("header", dc, [
      e.backLabel ? (c(), F(s(Y), {
        key: 0,
        "aria-label": e.backLabel,
        severity: "secondary",
        text: "",
        onClick: t[0] || (t[0] = (a) => l.$emit("back"))
      }, {
        default: L(() => [
          b(s(J), {
            icon: "tabler:arrow-left",
            "aria-hidden": "true"
          })
        ]),
        _: 1
      }, 8, ["aria-label"])) : E("", !0),
      r("div", uc, [
        b(s(J), {
          icon: e.icon,
          "aria-hidden": "true"
        }, null, 8, ["icon"])
      ]),
      r("div", cc, [
        We(l.$slots, "identity", {}, () => [
          r("h1", vc, A(e.title), 1),
          e.subtitle ? (c(), g("p", {
            key: 0,
            class: "kx-head-sub",
            title: e.subtitle
          }, A(e.subtitle), 9, mc)) : E("", !0)
        ])
      ]),
      r("div", fc, [
        We(l.$slots, "default")
      ])
    ]));
  }
}), bc = { class: "work-board-identity work-stack work-tight" }, hc = { class: "work-stack work-tight" }, yc = { class: "work-stack work-tight" }, gc = { class: "work-stack work-tight" }, kc = ["value", "inert"], wc = {
  key: 1,
  class: "work-muted work-small"
}, Vc = { class: "work-row" }, $c = { class: "work-row" }, xc = {
  key: 2,
  class: "work-identity-actions"
}, Cc = ["title"], Sc = {
  key: 2,
  class: "kx-err work-inline",
  role: "alert"
}, Tc = {
  key: 3,
  class: "work-muted work-small",
  role: "status"
}, Ca = /* @__PURE__ */ ve({
  __name: "BoardIdentity",
  props: {
    board: {},
    compact: { type: Boolean },
    detail: { type: Boolean },
    subtitle: {}
  },
  emits: ["saved"],
  setup(e, { emit: l }) {
    const t = e, a = l, o = z(!1), d = z(""), v = z(""), m = z(""), f = z(!1), i = z(!1), n = z(""), u = z(""), y = G(() => t.board?.access?.admin === !0);
    function p() {
      d.value = t.board?.title ?? "", m.value = t.board?.icon ?? "", vt("wc-icon-picker").then((S) => f.value = S), v.value = t.board?.description ?? "", n.value = "", u.value = "", o.value = !0;
    }
    Ce(y, (S) => {
      S || (o.value = !1);
    });
    async function w() {
      if (!y.value || !t.board || i.value || !d.value.trim()) return;
      const S = {};
      if (d.value.trim() !== t.board.title && (S.title = d.value.trim()), v.value !== (t.board.description ?? "") && (S.description = v.value), m.value !== (t.board.icon ?? "") && (S.icon = m.value), !Object.keys(S).length) {
        o.value = !1, u.value = "Nothing changed.";
        return;
      }
      i.value = !0, n.value = "";
      try {
        const U = await $t.updateBoard(t.board.board_id, S);
        o.value = !1, u.value = U.status === "unchanged" ? "Nothing changed." : "Board saved.", a("saved");
      } catch (U) {
        n.value = U instanceof Error ? U.message : "Could not save the board.";
      } finally {
        i.value = !1;
      }
    }
    return (S, U) => (c(), g("div", bc, [
      o.value ? (c(), g("form", {
        key: 0,
        class: "work-identity-edit",
        "aria-label": "Edit board",
        onClick: U[4] || (U[4] = be(() => {
        }, ["stop"])),
        onSubmit: be(w, ["prevent"])
      }, [
        r("label", hc, [
          U[5] || (U[5] = M("Title", -1)),
          b(s(re), {
            modelValue: d.value,
            "onUpdate:modelValue": U[0] || (U[0] = ($) => d.value = $),
            required: "",
            autofocus: "",
            disabled: i.value
          }, null, 8, ["modelValue", "disabled"])
        ]),
        r("label", yc, [
          U[6] || (U[6] = M("Description", -1)),
          b(s(ml), {
            modelValue: v.value,
            "onUpdate:modelValue": U[1] || (U[1] = ($) => v.value = $),
            rows: "1",
            disabled: i.value
          }, null, 8, ["modelValue", "disabled"])
        ]),
        r("div", gc, [
          U[7] || (U[7] = r("span", null, "Board icon", -1)),
          f.value ? (c(), g("wc-icon-picker", {
            key: 0,
            value: m.value,
            fallback: "tabler:layout-kanban",
            inert: i.value || void 0,
            onSelect: U[2] || (U[2] = ($) => m.value = $.detail)
          }, null, 40, kc)) : (c(), g("p", wc, "The icon picker is unavailable."))
        ]),
        r("div", Vc, [
          b(s(Y), {
            label: "Save",
            severity: "secondary",
            type: "submit",
            disabled: !d.value.trim() || i.value,
            loading: i.value,
            outlined: ""
          }, {
            icon: L(() => [
              b(s(J), {
                icon: "tabler:device-floppy",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled", "loading"]),
          b(s(Y), {
            label: "Cancel",
            severity: "secondary",
            disabled: i.value,
            onClick: U[3] || (U[3] = ($) => o.value = !1),
            outlined: ""
          }, {
            icon: L(() => [
              b(s(J), {
                icon: "tabler:x",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled"])
        ])
      ], 32)) : (c(), g(H, { key: 1 }, [
        r("div", $c, [
          e.board?.icon ? (c(), F(s(J), {
            key: 0,
            icon: e.board.icon,
            "aria-hidden": "true"
          }, null, 8, ["icon"])) : E("", !0),
          (c(), F(Fl(e.compact || e.detail ? "h2" : "h1"), {
            class: mt(e.detail ? "work-detail-title" : e.compact ? "kx-card-name" : "kx-title")
          }, {
            default: L(() => [
              M(A(e.board?.title || "Untitled board"), 1)
            ]),
            _: 1
          }, 8, ["class"])),
          e.compact ? We(S.$slots, "title-end", {}, void 0, void 0, 1) : E("", !0),
          e.compact ? (c(), g("span", xc, [
            y.value ? (c(), F(s(Y), {
              key: 0,
              severity: "secondary",
              text: "",
              size: "small",
              onClick: be(p, ["stop"]),
              "aria-label": "Edit board"
            }, {
              default: L(() => [
                b(s(J), {
                  icon: "tabler:pencil",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            })) : E("", !0),
            We(S.$slots, "actions")
          ])) : y.value ? (c(), F(s(Y), {
            key: 3,
            severity: "secondary",
            text: "",
            size: "small",
            onClick: be(p, ["stop"]),
            "aria-label": "Edit board"
          }, {
            default: L(() => [
              b(s(J), {
                icon: "tabler:pencil",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          })) : E("", !0),
          e.compact ? E("", !0) : We(S.$slots, "title-end", {}, void 0, void 0, 4)
        ]),
        !e.compact && (e.subtitle || e.board?.description) ? (c(), g("p", {
          key: 0,
          class: "kx-head-sub",
          title: e.subtitle || e.board?.description
        }, A(e.subtitle || e.board?.description), 9, Cc)) : E("", !0)
      ], 64)),
      n.value ? (c(), g("p", Sc, A(n.value), 1)) : E("", !0),
      u.value ? (c(), g("p", Tc, A(u.value), 1)) : E("", !0)
    ]));
  }
}), Ec = {
  key: 0,
  class: "work-dirty"
}, Sa = /* @__PURE__ */ ve({
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
    return (l, t) => (c(), g(H, null, [
      e.dirty ? (c(), g("span", Ec, "Unsaved changes")) : E("", !0),
      b(s(Y), {
        label: "Discard",
        severity: "secondary",
        outlined: "",
        disabled: !e.dirty || e.busy || e.checkingRemoval,
        onClick: t[0] || (t[0] = (a) => l.$emit("discard"))
      }, {
        icon: L(() => [
          b(s(J), { icon: "tabler:restore" })
        ]),
        _: 1
      }, 8, ["disabled"]),
      b(s(Y), {
        label: e.reviewed ? "Apply" : "Review changes",
        disabled: e.disabled,
        loading: e.busy,
        onClick: t[1] || (t[1] = (a) => l.$emit("primary"))
      }, null, 8, ["label", "disabled", "loading"])
    ], 64));
  }
}), Uc = {
  key: 0,
  class: "work-detail-head"
}, Dc = {
  key: 0,
  class: "work-row work-wrap work-draft-actions"
}, Ic = {
  key: 2,
  class: "kx-err",
  role: "alert"
}, Ac = ["config"], Pc = /* @__PURE__ */ ve({
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
    async function d() {
      !l.authorized || !l.board || (o.value = "", a.value = await vt("kickside-share"), a.value ? t.value = !0 : o.value = "The sharing widget is unavailable. Try Share board again.");
    }
    Ce(() => l.authorized, (i) => {
      i || (t.value = !1);
    });
    const v = G(() => JSON.stringify({ resource_id: l.board?.board_id, title: l.board?.title, access_url: `/api/v1/component-access/grants/${encodeURIComponent(l.board?.board_id ?? "")}`, share_url: `/api/v1/component-access/share/${encodeURIComponent(l.board?.board_id ?? "")}` })), m = G(() => l.pack ? `${l.packTitle} ${l.pack.version}${l.outdated ? " · Outdated" : ""}` : ""), f = G(() => "Settings · generation " + (l.generation ?? "…") + (m.value ? " · " + m.value : ""));
    return (i, n) => (c(), g(H, null, [
      e.embedded ? (c(), g("header", Uc, [
        b(Ca, {
          board: e.board,
          subtitle: m.value || void 0,
          detail: "",
          onSaved: n[0] || (n[0] = (u) => i.$emit("saved"))
        }, {
          "title-end": L(() => [
            b(s(Re), {
              severity: "secondary",
              value: "Generation " + (e.generation ?? "…")
            }, null, 8, ["value"])
          ]),
          _: 1
        }, 8, ["board", "subtitle"]),
        e.authorized ? (c(), g("div", Dc, [
          e.authorized && e.outdated && e.pack ? (c(), F(s(Y), {
            key: 0,
            disabled: !e.canUpgrade,
            title: e.upgradeReason,
            label: "Upgrade pack",
            severity: "secondary",
            outlined: "",
            onClick: n[1] || (n[1] = (u) => i.$emit("upgrade"))
          }, {
            icon: L(() => [
              b(s(J), { icon: "tabler:refresh" })
            ]),
            _: 1
          }, 8, ["disabled", "title"])) : E("", !0),
          e.authorized && e.board ? (c(), F(s(Y), {
            key: 1,
            label: "Share board",
            severity: "secondary",
            outlined: "",
            disabled: e.busy,
            onClick: d
          }, {
            icon: L(() => [
              b(s(J), {
                icon: "tabler:share",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled"])) : E("", !0),
          e.authorized && !e.pack ? (c(), F(s(Y), {
            key: 2,
            label: "Install pack",
            severity: "secondary",
            outlined: "",
            disabled: e.busy || e.dirty,
            onClick: n[2] || (n[2] = (u) => i.$emit("install"))
          }, null, 8, ["disabled"])) : E("", !0),
          b(Sa, {
            dirty: e.dirty,
            busy: e.busy,
            "checking-removal": e.checkingRemoval,
            reviewed: e.reviewed,
            disabled: e.disabled,
            onDiscard: n[3] || (n[3] = (u) => i.$emit("discard")),
            onPrimary: n[4] || (n[4] = (u) => i.$emit("primary"))
          }, null, 8, ["dirty", "busy", "checking-removal", "reviewed", "disabled"])
        ])) : E("", !0)
      ])) : (c(), F(pc, {
        key: 1,
        title: e.board?.title || "Board",
        subtitle: f.value,
        "back-label": "Back to board",
        icon: "tabler:adjustments",
        onBack: n[10] || (n[10] = (u) => i.$emit("back"))
      }, {
        identity: L(() => [
          b(Ca, {
            board: e.board,
            subtitle: f.value,
            onSaved: n[5] || (n[5] = (u) => i.$emit("saved"))
          }, null, 8, ["board", "subtitle"])
        ]),
        default: L(() => [
          e.authorized && e.outdated && e.pack ? (c(), F(s(Y), {
            key: 0,
            disabled: !e.canUpgrade,
            title: e.upgradeReason,
            label: "Upgrade pack",
            severity: "secondary",
            outlined: "",
            onClick: n[6] || (n[6] = (u) => i.$emit("upgrade"))
          }, {
            icon: L(() => [
              b(s(J), { icon: "tabler:refresh" })
            ]),
            _: 1
          }, 8, ["disabled", "title"])) : E("", !0),
          e.authorized && e.board ? (c(), F(s(Y), {
            key: 1,
            label: "Share board",
            severity: "secondary",
            outlined: "",
            disabled: e.busy,
            onClick: d
          }, {
            icon: L(() => [
              b(s(J), {
                icon: "tabler:share",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled"])) : E("", !0),
          e.authorized && !e.pack ? (c(), F(s(Y), {
            key: 2,
            label: "Install pack",
            severity: "secondary",
            outlined: "",
            disabled: e.busy || e.dirty,
            onClick: n[7] || (n[7] = (u) => i.$emit("install"))
          }, null, 8, ["disabled"])) : E("", !0),
          e.authorized ? (c(), F(Sa, {
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
      o.value ? (c(), g("p", Ic, A(o.value), 1)) : E("", !0),
      t.value && a.value && e.authorized ? (c(), g("kickside-share", {
        key: 3,
        config: v.value,
        onClose: n[11] || (n[11] = (u) => t.value = !1),
        onChanged: n[12] || (n[12] = (u) => i.$emit("saved"))
      }, null, 40, Ac)) : E("", !0)
    ], 64));
  }
}), Rc = {
  key: 0,
  class: "work-settings-card work-schema-plan work-stack",
  "aria-label": "Schema review"
}, Oc = { key: 0 }, Nc = { class: "work-row" }, Mc = { class: "work-muted work-small" }, Lc = { class: "work-muted" }, zc = {
  key: 0,
  class: "work-notice"
}, Fc = {
  key: 1,
  class: "work-notice"
}, Bc = {
  key: 2,
  class: "work-muted work-small"
}, jc = { key: 3 }, qc = { key: 0 }, Wc = {
  key: 4,
  class: "work-settings-table"
}, Kc = { key: 0 }, Gc = { key: 1 }, Yc = { key: 2 }, Hc = { key: 5 }, Xc = /* @__PURE__ */ ve({
  __name: "SchemaReview",
  props: {
    plan: {},
    generation: {},
    follows: {},
    configCount: {},
    packReview: { type: Boolean }
  },
  setup(e) {
    return (l, t) => e.plan ? (c(), g("section", Rc, [
      !e.plan.changes.length && !e.plan.refused.length && !e.configCount && !e.packReview ? (c(), g("p", Oc, "No changes to apply.")) : (c(), g(H, { key: 1 }, [
        r("header", Nc, [
          t[0] || (t[0] = r("h2", null, "Review", -1)),
          b(s(Re), {
            class: "kx-tag-sm",
            severity: e.plan.class === "refused" ? "danger" : e.plan.class === "semantic" ? "warn" : e.plan.class === "additive" ? "success" : "secondary"
          }, {
            default: L(() => [
              M(A(e.plan.class), 1)
            ]),
            _: 1
          }, 8, ["severity"]),
          r("span", Mc, "Generation " + A(e.generation) + " → " + A(e.plan.generation), 1)
        ]),
        r("p", Lc, A(s(Eo)[e.plan.class] || "Review the classified changes below."), 1),
        e.plan.migration ? (c(), g("p", zc, "Migration needed: " + A(e.plan.migration), 1)) : e.follows.length ? (c(), g("p", Fc, "Follow migration: " + A(e.follows.join(", ")) + ". Existing items move to the new process generation; declared state maps apply.", 1)) : (c(), g("p", Bc, "No follow process migration is indicated by these changes.")),
        We(l.$slots, "default"),
        e.plan.refused.length ? (c(), g("h3", jc, "Refused changes")) : E("", !0),
        (c(!0), g(H, null, ee(e.plan.refused, (a, o) => (c(), F(s(zo), {
          key: o,
          severity: "error",
          role: "alert"
        }, {
          default: L(() => [
            M(A(a.code) + " · " + A(a.what) + " · " + A(s(wl)(a)), 1),
            a.to ? (c(), g("span", qc, " → " + A(a.to), 1)) : E("", !0)
          ]),
          _: 2
        }, 1024))), 128)),
        e.plan.changes.length ? (c(), g("table", Wc, [
          t[1] || (t[1] = r("thead", null, [
            r("tr", null, [
              r("th", null, "Entry"),
              r("th", null, "Class"),
              r("th", null, "Change")
            ])
          ], -1)),
          r("tbody", null, [
            (c(!0), g(H, null, ee(e.plan.changes, (a, o) => (c(), g("tr", { key: o }, [
              r("td", null, A(a.code), 1),
              r("td", null, [
                b(s(Re), {
                  class: "kx-tag-sm",
                  severity: a.class === "refused" ? "danger" : a.class === "semantic" ? "warn" : a.class === "additive" ? "success" : "secondary"
                }, {
                  default: L(() => [
                    M(A(a.class), 1)
                  ]),
                  _: 2
                }, 1032, ["severity"])
              ]),
              r("td", null, [
                M(A(a.what) + " ", 1),
                a.detail ? (c(), g("span", Kc, " · " + A(a.detail), 1)) : E("", !0),
                a.to ? (c(), g("span", Gc, " → " + A(a.to), 1)) : E("", !0),
                a.count ? (c(), g("span", Yc, " · " + A(a.count) + " items", 1)) : E("", !0)
              ])
            ]))), 128))
          ])
        ])) : (c(), g("p", Hc, "No declaration changes are reported."))
      ], 64))
    ])) : E("", !0);
  }
}), Jc = {
  key: 0,
  class: "work-stack",
  "aria-label": "Pack conflicts"
}, Zc = { class: "work-stack work-tight work-pack-review-field" }, Qc = { class: "work-json-disclosure" }, _c = { class: "work-config-fields" }, ev = { class: "work-json-example" }, tv = { class: "work-json-example" }, lv = {
  key: 1,
  class: "work-stack",
  "aria-label": "Pack state maps"
}, av = /* @__PURE__ */ ve({
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
    function d(i) {
      const [n, ...u] = i.split("."), y = u.join(".");
      return n === "processes" ? o(y) : n === "fields" ? t.original.fields?.find((p) => p.code === y)?.title || ge(y) : n === "item_types" ? t.original.item_types?.find((p) => p.id === y)?.title || ge(y) : ge(n);
    }
    function v(i) {
      return JSON.stringify(i ?? null, null, 2);
    }
    function m(i, n) {
      (t.request.resolutions ??= {})[i] = n, a("change");
    }
    function f(i, n, u) {
      ((t.request.maps ??= {})[i] ??= {})[n] = u, a("change");
    }
    return (i, n) => (c(), g(H, null, [
      e.plan.conflicts.length ? (c(), g("section", Jc, [
        n[3] || (n[3] = r("h3", null, "Local edits conflict", -1)),
        n[4] || (n[4] = r("p", { class: "work-muted work-small" }, "Choose which declaration to keep for each conflict, then review again.", -1)),
        (c(!0), g(H, null, ee(e.plan.conflicts, (u) => (c(), g("div", {
          key: u.path,
          class: "work-stack work-tight"
        }, [
          r("label", Zc, [
            M(A(d(u.path)), 1),
            b(s(te), {
              "model-value": e.request.resolutions?.[u.path],
              "aria-label": "Resolution for " + d(u.path),
              disabled: e.disabled,
              appendTo: "self",
              placeholder: "Choose a resolution",
              optionLabel: "label",
              optionValue: "value",
              options: [{ label: "Keep local edits", value: "local" }, { label: "Use pack changes", value: "incoming" }],
              "onUpdate:modelValue": (y) => m(u.path, y)
            }, null, 8, ["model-value", "aria-label", "disabled", "onUpdate:modelValue"])
          ]),
          r("details", Qc, [
            n[2] || (n[2] = r("summary", null, "Compare declarations", -1)),
            r("div", _c, [
              r("section", null, [
                n[0] || (n[0] = r("h4", null, "Local edits", -1)),
                r("pre", ev, A(v(u.local_value)), 1)
              ]),
              r("section", null, [
                n[1] || (n[1] = r("h4", null, "Pack changes", -1)),
                r("pre", tv, A(v(u.incoming)), 1)
              ])
            ])
          ])
        ]))), 128))
      ])) : E("", !0),
      Object.keys(e.plan.maps).length ? (c(), g("section", lv, [
        n[5] || (n[5] = r("h3", null, "Required state maps", -1)),
        n[6] || (n[6] = r("p", { class: "work-muted work-small" }, "Review the proposed destinations for existing items. Each destination is editable.", -1)),
        (c(!0), g(H, null, ee(e.plan.maps, (u, y) => (c(), g("div", {
          key: y,
          class: "work-stack"
        }, [
          r("h4", null, A(o(y)), 1),
          (c(!0), g(H, null, ee(u, (p, w) => (c(), g("label", {
            key: w,
            class: "work-stack work-tight work-pack-review-field"
          }, [
            M("Move items from " + A(s(he)(e.original.processes?.find((S) => S.id === y)?.states.find((S) => S.id === w))), 1),
            b(s(te), {
              "model-value": e.request.maps?.[y]?.[w],
              "aria-label": "Move items from " + s(he)(e.original.processes?.find((S) => S.id === y)?.states.find((S) => S.id === w)),
              disabled: e.disabled,
              appendTo: "self",
              optionLabel: "label",
              optionValue: "value",
              options: e.plan.declaration.processes?.find((S) => S.id === y)?.states.map((S) => ({ label: s(he)(S), value: S.id })) ?? [],
              "onUpdate:modelValue": (S) => f(y, w, S)
            }, null, 8, ["model-value", "aria-label", "disabled", "options", "onUpdate:modelValue"])
          ]))), 128))
        ]))), 128))
      ])) : E("", !0)
    ], 64));
  }
}), ov = {
  key: 0,
  class: "work-settings-tabs"
}, iv = { class: "work-section-navigation" }, nv = {
  key: 1,
  class: "kx-err",
  role: "alert"
}, sv = {
  key: 2,
  class: "kx-err",
  role: "alert"
}, rv = {
  key: 3,
  class: "work-notice",
  role: "status"
}, dv = {
  key: 4,
  class: "kx-loading",
  role: "status"
}, uv = {
  key: 5,
  class: "work-notice",
  role: "alert"
}, cv = {
  key: 6,
  class: "work-settings-content work-pane"
}, vv = {
  key: 0,
  class: "work-notice",
  role: "alert"
}, mv = {
  key: 1,
  class: "work-notice"
}, fv = { key: 0 }, pv = ["disabled", "inert"], bv = {
  key: 6,
  class: "work-settings-card work-stack"
}, hv = {
  key: 5,
  class: "kx-empty"
}, yv = {
  key: 6,
  class: "work-muted work-small",
  role: "status"
}, gv = { class: "work-stack work-tight" }, kv = {
  key: 0,
  class: "work-muted"
}, wv = { class: "work-dialog-actions" }, Vv = /* @__PURE__ */ ve({
  __name: "BoardSettings",
  props: {
    boardId: {},
    embedded: { type: Boolean }
  },
  emits: ["dirty-change"],
  setup(e, { emit: l }) {
    const t = e, a = l, o = jo();
    let d, v = "";
    const m = () => JSON.stringify([k.value, $.value, B.value, [...Ve.value]]), f = ["Fields", "Item types", "Process", "Policy", "Relation types", "Plugins", "Review"], i = z("Fields"), n = z(!1), u = z(""), y = z(/* @__PURE__ */ new Set(["Fields"]));
    Ce(i, (Q) => y.value.add(Q));
    const p = z(), w = z(), S = z(), U = z({}), $ = z({}), I = z(), T = z(!1), D = z(!0), V = z(!1), P = z(""), Z = z(""), de = z(""), ne = z([]), B = z(), O = z(), oe = z(), x = z(), R = z(), N = z(""), X = z([]), ue = G(() => [...X.value, ...x.value?.refused ?? []]), pe = z(!1), ke = z(0), Ve = z(/* @__PURE__ */ new Set()), De = z(), h = jl(), C = jl(), k = G(() => da(U.value, p.value?.declaration ?? {})), j = G(() => Ve.value.size > 0 || !!B.value || !!p.value && (JSON.stringify(k.value) !== JSON.stringify(p.value.declaration) || Object.keys($.value).length > 0));
    Ce(j, (Q) => a("dirty-change", Q), { immediate: !0, flush: "sync" });
    const K = G(() => !!p.value && !!w.value && p.value.generation !== w.value.generation), se = G(() => T.value && !V.value && !pe.value && !St.value && !K.value && !Ve.value.size && x.value && (x.value.changes.length > 0 || Object.keys($.value).length > 0) && x.value.class !== "refused" && !x.value.refused.length && R.value?.matches(k.value, p.value?.generation ?? -1, $.value)), fe = G(() => ne.value.find((Q) => Q.id === B.value?.pack)?.plugins.filter((Q) => !p.value?.plugins?.some((q) => q.plugin === Q.plugin && q.active)).map((Q) => ({ use: Q.plugin })) ?? []), Se = G(() => !!oe.value && JSON.stringify(oe.value) === JSON.stringify(B.value)), Ne = G(() => B.value ? T.value && !V.value && !Ve.value.size && !K.value && !St.value && Se.value && x.value?.class !== "refused" && !x.value?.refused.length && O.value?.conflicts.every((Q) => !!B.value?.resolutions?.[Q.path]) : se.value), Te = G(() => !!x.value && (!B.value || Se.value)), pt = G(() => ne.value.find((Q) => Q.id === p.value?.pack?.id)?.title || "Installed pack"), it = G(() => !de.value && !!p.value?.outdated && !!ne.value.find((Q) => Q.id === p.value?.pack?.id)), Cl = G(() => de.value ? "Reload packs to check available upgrades." : it.value ? j.value ? "Discard the current draft before upgrading." : St.value ? "Finish the current migration before upgrading." : V.value ? "Wait for the current request to finish." : void 0 : "Install an available version of this pack to upgrade.");
    function Ye() {
      B.value = void 0, O.value = void 0, oe.value = void 0;
    }
    async function ll() {
      if (!p.value?.pack || V.value || j.value) return;
      const Q = ne.value.find((q) => q.id === p.value.pack.id);
      Q && (B.value = ua(Q, p.value.generation), i.value = "Review", await Sl());
    }
    async function Bt() {
      const Q = ne.value.find((q) => q.id === u.value);
      !p.value || !Q || Q.plugins.some((q) => !q.installed) || V.value || j.value || (B.value = ua(Q, p.value.generation), n.value = !1, i.value = "Review", await Sl());
    }
    async function Sl() {
      if (!B.value || V.value || !T.value || K.value || Ve.value.size) return;
      const Q = C(), q = gt(B.value), _ = JSON.stringify(B.value);
      V.value = !0, P.value = "", Z.value = "";
      try {
        const ye = await Do(q, (Et) => kt.packPlan(t.boardId, Et));
        if (!Q() || _ !== JSON.stringify(B.value)) return;
        O.value = ye.plan, x.value = ye.plan, B.value = ye.request, oe.value = gt(B.value), N.value = crypto.randomUUID(), i.value = "Review";
      } catch (ye) {
        Q() && (oe.value = void 0, P.value = ye instanceof Error ? ye.message : "Could not plan the pack upgrade.");
      } finally {
        V.value = !1;
      }
    }
    const ao = G(() => x.value ? Uo(x.value, k.value) : []), St = G(() => !!w.value?.migration_error || S.value?.status === "migrating");
    function nt() {
      X.value = [], C(), x.value = void 0, R.value = void 0, oe.value = void 0, N.value = "";
    }
    Ce([k, $], nt, { deep: !0, flush: "sync" }), Ce($, (Q) => {
      B.value && (Object.keys(Q).length ? B.value.plugin_configs = gt(Q) : delete B.value.plugin_configs);
    }, { deep: !0, flush: "sync" });
    function Tt(Q, q) {
      q ? Ve.value.delete(Q) : Ve.value.add(Q), nt();
    }
    function Tl(Q) {
      Ye(), ke.value++, p.value = Q, U.value = gt(Q.declaration), $.value = {}, Ve.value.clear(), nt();
    }
    async function Ze(Q = !1) {
      const q = h();
      try {
        const [_, ye, Et] = await Promise.all([$t.schema(t.boardId, void 0, !0).catch((st) => {
          if (st instanceof ca && st.details?.code === "board_schema_missing") return { generation: 0, declaration: {}, compiled: {}, key_prefix: "", as_of: 0 };
          throw st;
        }), $t.options(t.boardId), $t.boards()]);
        if (!q()) return;
        if (T.value = ye.access.admin, I.value = ye, S.value = Et.find((st) => st.board_id === t.boardId), !T.value) {
          p.value = void 0, U.value = {}, nt();
          return;
        }
        P.value = "";
        const He = Io(_);
        w.value = He, d !== void 0 && He.generation >= d ? (d = void 0, v === m() && Tl(He), v = "") : (Q || !p.value || !j.value && He.generation !== p.value.generation) && Tl(He), K.value && nt(), await ia(q);
      } catch (_) {
        if (!q()) return;
        _ instanceof ca && (_.status === 403 || _.kind?.toLowerCase() === "permission_denied") && (T.value = !1), nt(), P.value = _ instanceof Error ? _.message : "Could not load board settings.";
      } finally {
        q() && (D.value = !1);
      }
    }
    async function ia(Q = () => !0) {
      de.value = "";
      try {
        const q = await $t.packs();
        Q() && (ne.value = q.filter(Ao));
      } catch (q) {
        Q() && (de.value = q instanceof Error ? q.message : "Could not load packs.");
      }
    }
    function oo() {
      for (const Q of De.value?.querySelectorAll("input, select, textarea") ?? [])
        if (!(Q.form !== De.value || Q.closest('[style*="display: none"]')) && !Q.reportValidity())
          return !1;
      return !0;
    }
    function io(Q) {
      i.value = Q, Q === "Review" && !x.value && El();
    }
    async function El() {
      if (B.value) return Sl();
      if (!p.value || V.value || !T.value || K.value || Ve.value.size || !oo()) return;
      const Q = C(), q = va(k.value, p.value.generation, $.value);
      V.value = !0, P.value = "", Z.value = "";
      try {
        const _ = await kt.plan(t.boardId, q);
        if (!Q() || Ve.value.size || !q.matches(k.value, p.value.generation, $.value)) return;
        x.value = _, R.value = q, N.value = crypto.randomUUID(), i.value = "Review";
      } catch (_) {
        Q() && (nt(), P.value = _ instanceof Error ? _.message : "Could not review changes.", X.value = Po(_, k.value));
      } finally {
        V.value = !1;
      }
    }
    async function no() {
      if (!Ne.value) return;
      if (B.value && oe.value) {
        V.value = !0, P.value = "";
        const q = m();
        try {
          const _ = await kt.packApply(t.boardId, gt(oe.value), N.value);
          d = _.generation, v = q, await Ze(), Z.value = _.status === "done" ? `Pack applied at generation ${_.generation}.` : "Pack installation continues in the background.";
        } catch (_) {
          P.value = _ instanceof Error ? _.message : "Could not apply the pack upgrade.";
        } finally {
          V.value = !1;
        }
        return;
      }
      if (!R.value) return;
      V.value = !0, P.value = "", Z.value = "";
      const Q = m();
      try {
        const q = await kt.apply(t.boardId, R.value, N.value);
        d = q.generation, v = Q, await Ze(), Z.value = `Applied generation ${q.generation} (${q.class}).`;
      } catch (q) {
        P.value = q instanceof Error ? q.message : "Could not apply schema.";
      } finally {
        V.value = !1;
      }
    }
    async function so() {
      if (!V.value) {
        V.value = !0, P.value = "";
        try {
          const Q = await kt.resume(t.boardId);
          Z.value = Q.resumed ? "Migration resumes." : "Migration is already running.", await Ze();
        } catch (Q) {
          P.value = Q instanceof Error ? Q.message : "Could not resume migration.";
        } finally {
          V.value = !1;
        }
      }
    }
    async function al(Q, q) {
      if (!p.value || !T.value || V.value || pe.value) return "Wait for the current change to finish.";
      if (K.value) return "Discard the stale draft before removing a definition.";
      const _ = p.value.generation, ye = JSON.stringify(k.value), Et = gt(U.value);
      _t(Et, Q, q), pe.value = !0;
      try {
        const He = await kt.plan(t.boardId, va(da(Et, p.value.declaration), _, $.value));
        if (!T.value || K.value || p.value.generation !== _ || JSON.stringify(k.value) !== ye) return "The draft changes during the check. Try the removal again.";
        const st = Ro(He, Q, q);
        if (st) return st;
        if (He.class === "refused") return "Resolve the refused draft changes in Review before removing this definition.";
      } catch (He) {
        return He instanceof Error ? He.message : "Could not check this removal.";
      } finally {
        pe.value = !1;
      }
    }
    async function ro() {
      j.value && !await ho.confirm({ header: "Discard changes?", message: "Your unsaved board settings will be discarded.", acceptLabel: "Discard", rejectLabel: "Keep editing" }) || o({ name: "board", board: t.boardId });
    }
    function uo() {
      d = void 0, w.value && Tl(w.value), Z.value = "", P.value = "";
    }
    Ce(() => t.boardId, () => {
      d = void 0, Ye(), ne.value = [], p.value = void 0, w.value = void 0, S.value = void 0, $.value = {}, Ve.value.clear(), y.value = /* @__PURE__ */ new Set(["Fields"]), i.value = "Fields", T.value = !1, D.value = !0, Ze(!0);
    });
    let Ul = () => {
    };
    return Ce(() => t.boardId, (Q) => {
      Ul(), Ul = bo(`component.${Q}`, () => {
        Ze();
      });
    }, { immediate: !0 }), go(Ze), Ta(() => {
      Ul(), h(), C();
    }), (Q, q) => (c(), g("section", {
      class: mt(["work-settings-shell", { "work-embedded": e.embedded }])
    }, [
      b(Pc, {
        board: S.value,
        embedded: e.embedded,
        generation: p.value?.generation,
        authorized: T.value,
        dirty: j.value,
        busy: V.value,
        "checking-removal": pe.value,
        reviewed: Te.value,
        pack: p.value?.pack,
        "pack-title": pt.value,
        outdated: p.value?.outdated,
        "upgrade-reason": Cl.value,
        "can-upgrade": it.value && !j.value && !V.value && !St.value && T.value,
        onUpgrade: ll,
        onInstall: q[0] || (q[0] = (_) => n.value = !0),
        disabled: !j.value || V.value || pe.value || St.value || K.value || !!Ve.value.size || Te.value && !Ne.value,
        onBack: ro,
        onDiscard: uo,
        onPrimary: q[1] || (q[1] = (_) => Te.value ? no() : El()),
        onSaved: q[2] || (q[2] = (_) => Ze())
      }, null, 8, ["board", "embedded", "generation", "authorized", "dirty", "busy", "checking-removal", "reviewed", "pack", "pack-title", "outdated", "upgrade-reason", "can-upgrade", "disabled"]),
      T.value && p.value ? (c(), g("div", ov, [
        r("div", iv, [
          b(s(No), {
            value: i.value,
            "onUpdate:value": q[3] || (q[3] = (_) => io(_))
          }, {
            default: L(() => [
              b(s(Mo), { "aria-label": "Settings sections" }, {
                default: L(() => [
                  (c(), g(H, null, ee(f, (_) => b(s(Lo), {
                    key: _,
                    value: _
                  }, {
                    default: L(() => [
                      M(A(_), 1)
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
      P.value ? (c(), g("div", nv, [
        M(A(P.value) + " ", 1),
        b(s(Y), {
          label: "Retry",
          severity: "secondary",
          onClick: q[4] || (q[4] = (_) => Ze()),
          outlined: ""
        }, {
          icon: L(() => [
            b(s(J), {
              icon: "tabler:refresh",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        })
      ])) : E("", !0),
      de.value ? (c(), g("p", sv, [
        M(A(de.value), 1),
        b(s(Y), {
          label: "Reload packs",
          severity: "secondary",
          outlined: "",
          onClick: q[5] || (q[5] = (_) => ia())
        }, {
          icon: L(() => [
            b(s(J), { icon: "tabler:refresh" })
          ]),
          _: 1
        })
      ])) : E("", !0),
      Z.value ? (c(), g("p", rv, A(Z.value), 1)) : E("", !0),
      D.value ? (c(), g("p", dv, "Loading settings…")) : !T.value && !P.value ? (c(), g("p", uv, "Board administrator access is required.")) : E("", !0),
      T.value && p.value ? (c(), g("div", cv, [
        K.value ? (c(), g("div", vv, "The board advances to generation " + A(w.value?.generation) + " while you edit. Your draft keeps generation " + A(p.value.generation) + ". Discard to load the latest schema before reviewing again.", 1)) : E("", !0),
        St.value ? (c(), g("div", mv, [
          r("p", null, [
            q[18] || (q[18] = M("Migration pending", -1)),
            w.value?.migration_error ? (c(), g("span", fv, ": " + A(w.value.migration_error), 1)) : E("", !0)
          ]),
          b(s(Y), {
            label: "Resume migration",
            severity: "secondary",
            disabled: V.value,
            onClick: so,
            outlined: ""
          }, {
            icon: L(() => [
              b(s(J), {
                icon: "tabler:refresh",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled"])
        ])) : E("", !0),
        r("form", {
          ref_key: "editor",
          ref: De,
          onSubmit: be(El, ["prevent"])
        }, [
          (c(), g("fieldset", {
            key: ke.value,
            class: "work-settings-fieldset",
            disabled: V.value || pe.value,
            inert: V.value || pe.value || void 0
          }, [
            y.value.has("Fields") ? Qe((c(), F(vs, {
              key: 0,
              "board-id": e.boardId,
              "installed-types": I.value?.installed_types,
              draft: U.value,
              "guard-removal": al,
              issues: ue.value,
              onValidity: q[6] || (q[6] = (_, ye) => Tt("fields:" + _, ye))
            }, null, 8, ["board-id", "installed-types", "draft", "issues"])), [
              [rt, i.value === "Fields"]
            ]) : E("", !0),
            y.value.has("Item types") ? Qe((c(), F(Ds, {
              key: 1,
              draft: U.value,
              "guard-removal": al,
              issues: ue.value
            }, null, 8, ["draft", "issues"])), [
              [rt, i.value === "Item types"]
            ]) : E("", !0),
            y.value.has("Process") ? Qe((c(), F(Wd, {
              key: 2,
              "board-id": e.boardId,
              draft: U.value,
              "guard-removal": al,
              issues: ue.value,
              onValidity: q[7] || (q[7] = (_, ye) => Tt("process:" + _, ye))
            }, null, 8, ["board-id", "draft", "issues"])), [
              [rt, i.value === "Process"]
            ]) : E("", !0),
            y.value.has("Policy") ? Qe((c(), F(wu, {
              key: 3,
              draft: U.value,
              onValidity: q[8] || (q[8] = (_, ye) => Tt("policy:" + _, ye))
            }, null, 8, ["draft"])), [
              [rt, i.value === "Policy"]
            ]) : E("", !0),
            y.value.has("Relation types") ? Qe((c(), F(Mu, {
              key: 4,
              draft: U.value,
              "guard-removal": al
            }, null, 8, ["draft"])), [
              [rt, i.value === "Relation types"]
            ]) : E("", !0),
            y.value.has("Plugins") ? Qe((c(), F(xa, {
              key: 5,
              "board-id": e.boardId,
              draft: U.value,
              schema: w.value ?? p.value,
              options: I.value?.schema_options.plugins ?? [],
              configs: $.value,
              disabled: V.value,
              onConfigured: q[9] || (q[9] = (_) => {
                nt(), Ze();
              }),
              onRefresh: q[10] || (q[10] = (_) => Ze()),
              onValidity: q[11] || (q[11] = (_, ye) => Tt("plugin:" + _, ye))
            }, null, 8, ["board-id", "draft", "schema", "options", "configs", "disabled"])), [
              [rt, i.value === "Plugins"]
            ]) : E("", !0),
            y.value.has("Policy") ? Qe((c(), g("section", bv, [
              b(rc, {
                "board-id": e.boardId,
                draft: U.value,
                onValidity: q[12] || (q[12] = (_) => Tt("visibility", _))
              }, null, 8, ["board-id", "draft"])
            ], 512)), [
              [rt, i.value === "Policy"]
            ]) : E("", !0)
          ], 8, pv))
        ], 544),
        i.value === "Review" && !B.value ? (c(), F(Yd, {
          key: 2,
          draft: U.value,
          original: p.value.declaration,
          disabled: V.value || pe.value
        }, null, 8, ["draft", "original", "disabled"])) : E("", !0),
        i.value === "Review" && B.value && fe.value.length ? (c(), F(xa, {
          key: 3,
          "board-id": e.boardId,
          draft: { plugins: fe.value },
          schema: w.value ?? p.value,
          options: I.value?.schema_options.plugins.filter((_) => fe.value.some((ye) => ye.use === _.plugin)) ?? [],
          configs: $.value,
          disabled: V.value,
          "activation-locked": "",
          onValidity: q[13] || (q[13] = (_, ye) => Tt("pack-plugin:" + _, ye))
        }, null, 8, ["board-id", "draft", "schema", "options", "configs", "disabled"])) : E("", !0),
        i.value === "Review" ? (c(), F(Xc, {
          key: 4,
          plan: x.value,
          generation: p.value.generation,
          follows: ao.value,
          "config-count": Object.keys($.value).length,
          "pack-review": !!O.value
        }, {
          default: L(() => [
            O.value && B.value ? (c(), F(av, {
              key: 0,
              plan: O.value,
              request: B.value,
              original: p.value.declaration,
              disabled: V.value,
              onChange: q[14] || (q[14] = (_) => {
                oe.value = void 0, N.value = "";
              })
            }, null, 8, ["plan", "request", "original", "disabled"])) : E("", !0)
          ]),
          _: 1
        }, 8, ["plan", "generation", "follows", "config-count", "pack-review"])) : E("", !0),
        i.value === "Review" && !x.value ? (c(), g("p", hv, "Review your draft to see the changes, their impact and any migration required.")) : E("", !0),
        pe.value ? (c(), g("p", yv, "Checking existing values and dependencies…")) : E("", !0)
      ])) : E("", !0),
      T.value ? (c(), F(Ra, {
        key: 7,
        visible: n.value,
        label: "Install pack",
        busy: V.value,
        onClose: q[17] || (q[17] = (_) => n.value = !1)
      }, {
        default: L(() => [
          r("form", {
            class: "work-dialog-box work-stack",
            onSubmit: be(Bt, ["prevent"])
          }, [
            q[20] || (q[20] = r("h2", null, "Install a pack", -1)),
            q[21] || (q[21] = r("p", { class: "work-muted work-small" }, "Packs can be installed on an empty board. Review checks whether this board is eligible.", -1)),
            r("label", gv, [
              q[19] || (q[19] = M("Pack", -1)),
              b(s(te), {
                modelValue: u.value,
                "onUpdate:modelValue": q[15] || (q[15] = (_) => u.value = _),
                "aria-label": "Pack to install",
                appendTo: "self",
                optionLabel: "title",
                optionValue: "id",
                optionDisabled: "disabled",
                options: ne.value.map((_) => ({ ..._, disabled: _.plugins.some((ye) => !ye.installed) }))
              }, null, 8, ["modelValue", "options"])
            ]),
            ne.value.length ? E("", !0) : (c(), g("p", kv, "No available packs were found.")),
            r("footer", wv, [
              b(s(Y), {
                label: "Cancel",
                severity: "secondary",
                outlined: "",
                onClick: q[16] || (q[16] = (_) => n.value = !1)
              }),
              b(s(Y), {
                type: "submit",
                label: "Review pack",
                disabled: !u.value || V.value || j.value
              }, null, 8, ["disabled"])
            ])
          ], 32)
        ]),
        _: 1
      }, 8, ["visible", "busy"])) : E("", !0)
    ], 2));
  }
}), $v = /* @__PURE__ */ ve({
  __name: "SettingsRoot",
  setup(e) {
    const l = ko(), t = wo();
    return po(Na, (a) => t("navigate", { route: qo(a) })), (a, o) => (c(), F(Vv, {
      "board-id": s(l).boardId ?? "",
      embedded: s(l).embedded,
      onDirtyChange: o[0] || (o[0] = (d) => s(t)("dirty-change", { dirty: d }))
    }, null, 8, ["board-id", "embedded"]));
  }
}), xv = Vo($v, {
  type: "object",
  properties: {
    "board-id": { type: "string", default: "", description: "Board to administer." },
    embedded: { type: "boolean", default: !1, description: "Fits in a System detail pane." }
  }
});
yo(import.meta.url, xv);
//# sourceMappingURL=settings.js.map
