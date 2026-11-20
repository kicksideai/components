import { inject as fo, defineComponent as ce, ref as z, useSlots as po, openBlock as c, createElementBlock as g, createElementVNode as d, createVNode as b, normalizeClass as ft, unref as r, withCtx as L, renderSlot as We, toDisplayString as U, createCommentVNode as E, createBlock as j, withDirectives as Qe, vShow as ut, computed as H, watch as xe, onMounted as kl, onUnmounted as Aa, resolveComponent as Pa, Fragment as Z, renderList as le, createTextVNode as N, resolveDynamicComponent as zl, onBeforeUnmount as it, useId as Xl, withKeys as Ae, withModifiers as be, normalizeStyle as bo, watchEffect as Ra, nextTick as ho, provide as yo } from "vue";
import { e as tt, u as go, b as ko, c as wo, a as Vo } from "./mount-BjCFO9rr.js";
import "pinia";
import { Icon as Q } from "@iconify/vue";
import ae from "primevue/select";
import { m as Bl, e as ra, s as he, f as $o, t as je, p as Ut, d as Jl, g as Dt, r as da, w as $t, l as jl, h as Ke, i as Ct, b as at, u as Oa, j as Na, k as Zl, n as Ma, o as ge, q as wl, v as _t, x as xo, y as Fa, z as Co, A as Vt, B as So, _ as La, C as To, D as Eo, E as ua, F as gt, G as Uo, H as ca, I as Do, J as va, K as Io, L as ma, M as Ao, a as Po, N as fa, O as Ro, P as Oo } from "./latestRequest-C7gISMH8.js";
import X from "primevue/button";
import { api as No, on as Mo, host as Fo, define as Lo } from "@wippy-fe/proxy";
import Re from "primevue/tag";
import Le from "primevue/toggleswitch";
import Mt from "primevue/checkbox";
import ue from "primevue/inputtext";
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
  const a = [.../* @__PURE__ */ new Set([e.x, l.x, ...t.flatMap((T) => [T.x, T.x + T.width])])].sort((T, Y) => T - Y), o = [.../* @__PURE__ */ new Set([e.y, l.y, ...t.flatMap((T) => [T.y, T.y + T.height])])].sort((T, Y) => T - Y);
  a.unshift(a[0] - 24), a.push(a.at(-1) + 24), o.unshift(o[0] - 24), o.push(o.at(-1) + 24);
  const s = a.length, v = o.indexOf(l.y) * s + a.indexOf(l.x), f = o.indexOf(e.y) * s + a.indexOf(e.x), m = (T) => ({ x: a[T % s], y: o[Math.floor(T / s)] }), i = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map(), u = [];
  function y(T) {
    u.push(T);
    let Y = u.length - 1;
    for (; Y; ) {
      const F = Y - 1 >> 1;
      if (u[F].priority <= T.priority) break;
      u[Y] = u[F], Y = F;
    }
    u[Y] = T;
  }
  function p() {
    const T = u[0], Y = u.pop();
    if (u.length) {
      let F = 0;
      for (; F * 2 + 1 < u.length; ) {
        let O = F * 2 + 1;
        if (O + 1 < u.length && u[O + 1].priority < u[O].priority && O++, Y.priority <= u[O].priority) break;
        u[F] = u[O], F = O;
      }
      u[F] = Y;
    }
    return T;
  }
  const $ = (T) => Math.abs(T.x - l.x) + Math.abs(T.y - l.y);
  for (const T of [0, 1]) {
    const Y = f * 2 + T;
    i.set(Y, 0), y({ key: Y, cost: 0, priority: $(e) });
  }
  const C = /* @__PURE__ */ new Map(), D = /* @__PURE__ */ new Map();
  for (; u.length; ) {
    const T = p(), Y = Math.floor(T.key / 2), F = T.key % 2;
    if (T.cost !== i.get(T.key)) continue;
    if (Y === v) {
      const M = [];
      let te = T.key;
      for (; te !== void 0; )
        M.push(m(Math.floor(te / 2))), te = n.get(te);
      return za(M.reverse());
    }
    const O = m(Y), S = Y % s, B = Math.floor(Y / s);
    for (const [M, te] of [[S > 0 ? Y - 1 : -1, 0], [S + 1 < s ? Y + 1 : -1, 0], [B > 0 ? Y - s : -1, 1], [B + 1 < o.length ? Y + s : -1, 1]]) {
      if (M < 0) continue;
      const oe = m(M);
      if (C.has(M) || C.set(M, !t.some((k) => Dl(oe, k))), !C.get(M)) continue;
      const q = `${Math.min(Y, M)}:${Math.max(Y, M)}`;
      if (D.has(q) || D.set(q, !t.some((k) => Ko(O, oe, k))), !D.get(q)) continue;
      const P = T.cost + Math.abs(O.x - oe.x) + Math.abs(O.y - oe.y) + (F === te ? 0 : 18), R = M * 2 + te;
      P >= (i.get(R) ?? 1 / 0) || (i.set(R, P), n.set(R, T.key), y({ key: R, cost: P, priority: P + $(oe) }));
    }
  }
  throw new Error("Process map has no collision-free route between its ports: " + JSON.stringify({ start: e, end: l, startInside: t.filter((T) => Dl(e, T)), endInside: t.filter((T) => Dl(l, T)) }));
}
function za(e) {
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
  if (e = za(e), !e.length) return "";
  let l = `M ${e[0].x} ${e[0].y}`;
  for (let a = 1; a < e.length - 1; a++) {
    const o = e[a - 1], s = e[a], v = e[a + 1], f = Math.hypot(s.x - o.x, s.y - o.y), m = Math.hypot(v.x - s.x, v.y - s.y), i = Math.min(8, f / 3, m / 3);
    i && (l += ` L ${s.x + (o.x - s.x) * i / f} ${s.y + (o.y - s.y) * i / f} Q ${s.x} ${s.y} ${s.x + (v.x - s.x) * i / m} ${s.y + (v.y - s.y) * i / m}`);
  }
  const t = e.at(-1);
  return l + ` L ${t.x} ${t.y}`;
}
function Go(e, l = {}, t = { width: 1400, height: 480 }) {
  const a = t.width < 750 || Bl(e).length > 8 ? "TB" : "LR", o = new ra.graphlib.Graph({ multigraph: !0 });
  o.setGraph({ rankdir: a, ranker: "network-simplex", acyclicer: "greedy", nodesep: 32, edgesep: 32, ranksep: 24, marginx: 32, marginy: 32 }), o.setDefaultEdgeLabel(() => ({}));
  const s = Bl(e), v = new Map(s.map((h, x) => [h.id, x])), f = e.states.map((h) => {
    const x = (e.transitions ?? []).filter((Te) => Te.from === "any" && Te.to === h.id), w = Ot(he(h)), W = Ot($o(h, e)), J = x.flatMap((Te) => Ot(je(Te) + " works from any state")), de = l.policy?.wip?.[h.id]?.limit, fe = de === void 0 ? 0 : jt(" · limit " + de), Se = Math.max(168, ...w.map((Te) => jt(Te) + 58), ...W.map((Te, pt) => jt(Te) + 32 + (pt === W.length - 1 ? fe : 0)), ...J.map((Te) => jt(Te) + 32)), Ne = Math.max(80, 42 + w.length * 18 + W.length * 16 + J.length * 18);
    return o.setNode(h.id, { width: Se + (a === "LR" ? 36 : 0), height: Ne + (a === "TB" ? 36 : 0) }), { state: h, x: 0, y: 0, width: Se, height: Ne, title: w, caption: W, badges: x, row: v.has(h.id) ? 0 : 1 };
  }), m = new Set(f.map((h) => h.state.id)), i = (e.transitions ?? []).flatMap((h) => h.from === "any" ? [] : h.from.filter((x) => m.has(x) && m.has(h.to)).map((x) => {
    const w = `${h.id}-${x}`, W = Ot(je(h)), J = Math.max(72, ...W.map((fe) => jt(fe) + 24)), de = Math.max(24, W.length * 16 + 10);
    return { transition: h, from: x, key: w, lines: W, width: J, height: de };
  })), n = /* @__PURE__ */ new Set(), u = /* @__PURE__ */ new Set(), y = new Set(i.filter((h) => h.from === h.transition.to || h.transition.to === e.initial || ["completed", "canceled"].includes(f.find((x) => x.state.id === h.from).state.category)).map((h) => h.key));
  function p(h) {
    if (!u.has(h)) {
      n.add(h);
      for (const x of i.filter((w) => w.from === h))
        y.has(x.key) || (n.has(x.transition.to) ? y.add(x.key) : p(x.transition.to));
      n.delete(h), u.add(h);
    }
  }
  p(e.initial);
  for (const h of f) p(h.state.id);
  for (const h of i) if (!y.has(h.key)) {
    const x = v.get(h.from), w = v.get(h.transition.to);
    o.setEdge(h.from, h.transition.to, { width: h.width, height: h.height, labelpos: "c", weight: x !== void 0 && w === x + 1 ? 100 : 1 }, h.key);
  }
  for (const h of e.transitions ?? []) if (h.from === "any" && m.has(e.initial) && m.has(h.to) && !v.has(h.to)) {
    const x = e.states.find((w) => w.id === h.to);
    o.setEdge(e.initial, h.to, { minlen: ["completed", "canceled"].includes(x.category) ? Math.max(1, s.length - 1) : 1 }, `any:${h.id}`);
  }
  const $ = e.states.flatMap((h) => (h.regions ?? []).filter((x) => m.has(x.initial)).map((x, w) => {
    const W = `lane:${h.id}:${w}`;
    return o.setEdge(h.id, x.initial, {}, W), { state: h, region: x, key: W };
  }));
  if (!f.length) return { nodes: f, edges: [], parallels: [], main: s, direction: a, width: 320, height: 160 };
  ra.layout(o);
  for (const h of f) Object.assign(h, { x: o.node(h.state.id).x, y: o.node(h.state.id).y });
  const C = a === "TB", D = i.filter((h) => !y.has(h.key)).map((h) => o.edge({ v: h.from, w: h.transition.to, name: h.key })), T = [...f, ...D], Y = Math.max(...T.map((h) => h.x + h.width / 2)), F = Math.max(...T.map((h) => h.y + h.height / 2)), O = (h) => f.find((x) => x.state.id === h), S = i.filter((h) => y.has(h.key)).sort((h, x) => {
    const w = C ? "y" : "x";
    return Math.abs(O(h.from)[w] - O(h.transition.to)[w]) - Math.abs(O(x.from)[w] - O(x.transition.to)[w]);
  }), B = /* @__PURE__ */ new Map(), M = Math.max(0, ...S.map((h) => h.width));
  let te = F + 32;
  for (const [h, x] of S.entries()) {
    const w = O(x.from), W = O(x.transition.to), J = C ? Y + 16 + M + 28 + h * 18 : te + x.height / 2, de = C ? Y + 16 + M / 2 : (w.x + W.x) / 2;
    let fe = C ? w.y + w.height / 2 + 18 : J;
    if (C) for (const Se of [...B.values()].sort((Ne, Te) => Ne.y - Te.y))
      fe + x.height / 2 + 10 > Se.y - Se.height / 2 - 10 && fe - x.height / 2 - 10 < Se.y + Se.height / 2 + 10 && (fe = Se.y + Se.height / 2 + 24 + x.height / 2);
    B.set(x.key, { x: de, y: fe, corridor: J, height: x.height }), te = J + x.height / 2 + 24;
  }
  const oe = i.map((h) => ({ ...h, ...B.get(h.key) ?? o.edge({ v: h.from, w: h.transition.to, name: h.key }) })), q = (h, x) => ({ x: h.x - h.width / 2 - x, y: h.y - h.height / 2 - x, width: h.width + x * 2, height: h.height + x * 2 }), P = [...f.map((h) => q(h, 12)), ...oe.map((h) => q(h, 10))], R = (h, x) => ({
    start: C ? { x: h.x, y: h.y + h.height / 2 } : { x: h.x + h.width / 2, y: h.y },
    end: C ? { x: x.x, y: x.y - x.height / 2 } : { x: x.x - x.width / 2, y: x.y }
  }), k = (h, x) => C ? { x: h.x, y: h.y + x } : { x: h.x + x, y: h.y }, V = oe.map((h) => {
    const x = f.find((Ye) => Ye.state.id === h.from), w = f.find((Ye) => Ye.state.id === h.transition.to), { start: W, end: J } = R(x, w), de = y.has(h.key), fe = k(W, 18), Se = k(J, -18), Ne = (de || !C ? h.width : h.height) / 2 + 10, Te = de ? { x: h.x + (C ? -Ne : Ne), y: h.y } : k(h, -Ne), pt = de ? { x: h.x + (C ? Ne : -Ne), y: h.y } : k(h, Ne);
    let st;
    if (de) {
      const { corridor: Ye } = B.get(h.key), ll = C ? { x: Ye, y: h.y } : { x: fe.x, y: Ye }, Bt = C ? { x: Ye, y: Se.y } : { x: Se.x, y: Ye };
      st = C ? [
        [W, ...bt(fe, Te, P)],
        [pt, ll, Bt, ...bt(Bt, Se, P), J]
      ] : [
        [W, ...bt(fe, ll, P), Te],
        [pt, ...bt(Bt, Se, P), J]
      ];
    } else st = [
      [W, ...bt(fe, Te, P)],
      [...bt(pt, Se, P), J]
    ];
    const Cl = de ? "return" : v.get(h.transition.to) === (v.get(h.from) ?? -2) + 1 ? "main" : "forward";
    return { ...h, points: st.flat(), segments: st, path: st.map(ol).join(" "), type: Cl, targetOffset: 0 };
  }), I = $.map((h) => {
    const x = f.find((fe) => fe.state.id === h.state.id), w = f.find((fe) => fe.state.id === h.region.initial), { start: W, end: J } = R(x, w), de = [W, ...bt(k(W, 18), k(J, -18), P), J];
    return { state: h.state, key: h.key, points: de, path: ol(de) };
  }), A = [...f.flatMap((h) => [{ x: h.x - h.width / 2, y: h.y - h.height / 2 }, { x: h.x + h.width / 2, y: h.y + h.height / 2 }]), ...V.flatMap((h) => [...h.points, { x: h.x - h.width / 2, y: h.y - h.height / 2 }, { x: h.x + h.width / 2, y: h.y + h.height / 2 }]), ...I.flatMap((h) => h.points)], re = 32 - Math.min(...A.map((h) => h.x)), pe = 32 - Math.min(...A.map((h) => h.y)), ke = Math.max(...A.map((h) => h.x)) + re + 32, Ve = Math.max(...A.map((h) => h.y)) + pe + 32, De = (h) => ({ x: h.x + re, y: h.y + pe });
  for (const h of f) Object.assign(h, De(h));
  for (const h of V)
    Object.assign(h, De(h)), h.segments = h.segments.map((x) => x.map(De)), h.points = h.segments.flat(), h.path = h.segments.map(ol).join(" ");
  for (const h of I)
    h.points = h.points.map(De), h.path = ol(h.points);
  return { nodes: f, edges: V, parallels: I, main: s, direction: a, width: ke, height: Ve };
}
const Ba = Symbol("work-navigation");
function Yo() {
  return fo(Ba, () => {
  });
}
function Ho(e) {
  if (e.name === "boards") return "";
  const l = encodeURIComponent(e.board);
  return e.name === "settings" ? `${l}/settings` : l;
}
const It = (e) => `/api/v1/work/boards/${encodeURIComponent(e)}`, pa = (e) => ({ declaration: e.declaration, expected_generation: e.expected_generation, plugin_configs: e.plugin_configs }), kt = {
  packPlan: (e, l) => Ut(`${It(e)}/pack_plan`, l, "Pack plan"),
  packApply: (e, l, t) => Ut(`${It(e)}/pack_apply`, { ...l, key: t }, "Apply pack"),
  plan: (e, l) => Ut(`${It(e)}/plan_schema`, pa(l), "Schema plan"),
  apply: (e, l, t) => Ut(`${It(e)}/apply_schema`, { ...pa(l), key: t }, "Apply schema"),
  resume: (e) => Ut(`${It(e)}/resume_migration`, {}, "Resume migration"),
  configure: (e, l, t) => Ut(`${It(e)}/configure_plugin`, { plugin: l, config: t }, "Configure plugin")
}, Xo = { class: "work-definition" }, Jo = { class: "work-definition-head" }, Zo = { class: "work-definition-affordances" }, Qo = ["title"], _o = { class: "work-definition-code" }, ei = ["title"], ti = { class: "work-definition-kind" }, li = { class: "work-definition-flags" }, ai = { class: "work-definition-usage" }, oi = { class: "work-definition-actions" }, ii = {
  key: 0,
  class: "work-definition-description"
}, ni = { class: "work-definition-body work-stack" }, Vl = /* @__PURE__ */ ce({
  __name: "DefinitionRow",
  props: {
    title: {},
    code: {},
    kind: {},
    description: {}
  },
  setup(e) {
    const l = z(!1), t = po();
    return (a, o) => (c(), g("article", Xo, [
      d("header", Jo, [
        b(Jl, {
          as: "article",
          class: ft(["work-definition-toggle", { "work-definition-has-handle": r(t).handle }]),
          "aria-expanded": l.value,
          onActivate: o[0] || (o[0] = (s) => l.value = !l.value)
        }, {
          default: L(() => [
            d("span", Zo, [
              We(a.$slots, "handle"),
              b(r(Q), {
                icon: l.value ? "tabler:chevron-down" : "tabler:chevron-right"
              }, null, 8, ["icon"])
            ]),
            d("span", {
              class: "work-row-title",
              title: e.title
            }, U(e.title), 9, Qo)
          ]),
          _: 3
        }, 8, ["class", "aria-expanded"]),
        d("span", _o, [
          e.code ? (c(), g("code", {
            key: 0,
            class: "work-mono",
            title: e.code
          }, U(e.code), 9, ei)) : E("", !0)
        ]),
        d("span", ti, [
          e.kind ? (c(), j(r(Re), {
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
        e.description ? (c(), g("p", ii, U(e.description), 1)) : E("", !0)
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
}, $l = /* @__PURE__ */ ce({
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
          d("span", null, U(e.columns === "plugins" ? "State" : e.columns === "types" ? "Process" : "Kind"), 1),
          e.columns === "fields" || e.columns === "plugins" ? (c(), g("span", ui, "Details")) : E("", !0),
          e.columns !== "plugins" ? (c(), g("span", ci, U(e.columns === "fields" ? "Used by" : "Details"), 1)) : E("", !0),
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
}, ja = /* @__PURE__ */ ce({
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
    const t = e, a = l, o = H(() => t.inputId ?? `field-${t.field.code}`), s = H(() => !!t.field.cardinality && t.field.cardinality !== "one"), v = H(() => Array.isArray(t.modelValue) ? t.modelValue : []), f = H(() => t.modelValue == null ? "" : typeof t.modelValue == "object" ? Dt(t.modelValue) : String(t.modelValue)), m = H(() => {
      const x = t.modelValue;
      return x && typeof x == "object" && "ref" in x && Array.isArray(x.ref) ? String(x.ref[1] ?? "") : "";
    }), i = H(() => t.disabled || da(t.field)), n = z(!1), u = z(!1), y = z(!1), p = z(""), $ = z(""), C = z([]), D = jl(), T = z([]);
    let Y = 0, F;
    const O = /* @__PURE__ */ new Set();
    xe(v, (x) => {
      T.value = F ?? x.map((w, W) => T.value[W] ?? Y++), F = void 0;
    }, { immediate: !0 });
    function S(x) {
      a("update:modelValue", x);
    }
    function B(x, w) {
      const W = [...v.value];
      W[x] = w, S(W);
    }
    function M(x, w) {
      w ? O.delete(x) : O.add(x), a("validity", !O.size);
    }
    function te(x) {
      O.delete(T.value[x]), a("validity", !O.size), F = T.value.filter((w, W) => W !== x), S(v.value.filter((w, W) => W !== x));
    }
    function oe() {
      F = [...T.value, Y++], S([...v.value, t.field.form === "bool" ? !1 : t.field.form === "record" ? {} : ""]);
    }
    function q(x) {
      const w = x.detail, W = w?.principal_id ?? w?.id;
      S(W ? { kind: w.type ?? "user", id: W } : void 0);
    }
    function P(x) {
      const w = x.detail;
      S(w?.thread_id ? { ref: ["component", w.thread_id] } : void 0);
    }
    const R = z("");
    let k = "";
    xe(() => t.modelValue, (x) => {
      const w = JSON.stringify(x ?? {}, null, 2);
      w !== k && (k = w, R.value = w, p.value = "", a("validity", !0));
    }, { immediate: !0 });
    function V(x) {
      R.value = x;
      try {
        const w = JSON.parse(x);
        if (!w || typeof w != "object" || Array.isArray(w)) throw new Error("Enter a JSON object.");
        if (t.field.type === "rich_text" && !("type" in w && typeof w.type == "string")) throw new Error("The document needs a type.");
        k = JSON.stringify(w, null, 2), p.value = "", a("validity", !0), S(w);
      } catch (w) {
        p.value = w instanceof Error ? w.message : "Invalid JSON.", a("validity", !1);
      }
    }
    function I(x) {
      if (!x) {
        a("validity", !0), S(void 0);
        return;
      }
      const w = Number.isFinite(Number(x)) && (t.field.form !== "int" || Number.isSafeInteger(Number(x)));
      a("validity", w), w && S(t.field.form === "int" ? Number(x) : x);
    }
    const A = H(() => t.field.config?.format === "date");
    function re(x) {
      S(x ? A.value ? x : new Date(x).toISOString() : void 0);
    }
    const pe = H(() => {
      if (typeof t.modelValue != "string") return "";
      if (A.value) return t.modelValue.slice(0, 10);
      const x = new Date(t.modelValue);
      return Number.isNaN(x.getTime()) ? "" : new Date(x.getTime() - x.getTimezoneOffset() * 6e4).toISOString().slice(0, 16);
    });
    function ke(x) {
      S(x.detail?.ref);
    }
    function Ve(x) {
      S(x.detail?.value);
    }
    let De;
    xe($, () => {
      const x = D();
      if (clearTimeout(De), !$.value.trim()) {
        C.value = [];
        return;
      }
      De = setTimeout(async () => {
        try {
          const w = $.value.trim(), W = /^[A-Z][A-Z0-9]{1,9}-[0-9]+$/.test(w) ? [(await $t.item(t.boardId, { key: w })).item] : (await $t.query(t.boardId, { where: { field: "title", op: "contains", value: w }, limit: 8 })).items;
          x() && (C.value = W, p.value = "");
        } catch (w) {
          x() && (p.value = w instanceof Error ? w.message : "Could not search items.");
        }
      }, 200);
    });
    function h(x) {
      S({ board: t.boardId, item: x.id }), $.value = "", C.value = [];
    }
    kl(async () => {
      t.field.type === "principal" ? n.value = await tt("wc-principal-picker") : t.field.config?.target === "component" && (n.value = await tt("wc-component-picker"));
    });
    for (const [x, w] of [[() => t.editorTag, y], [() => t.linkTag, u]])
      xe(x, async (W, J, de) => {
        let fe = !0;
        if (de(() => {
          fe = !1;
        }), w.value = !1, W) {
          const Se = await tt(W);
          fe && (w.value = Se);
        }
      }, { immediate: !0 });
    return Aa(() => {
      clearTimeout(De), D();
    }), (x, w) => {
      const W = Pa("FieldControl", !0);
      return c(), g("div", pi, [
        r(da)(e.field) ? (c(), g("output", {
          key: 0,
          id: o.value,
          class: "work-read-value"
        }, U(r(Dt)(e.modelValue, e.field)), 9, bi)) : s.value ? (c(), g("div", hi, [
          d("div", yi, [
            (c(!0), g(Z, null, le(v.value, (J, de) => (c(), j(r(Re), {
              key: T.value[de],
              class: "kx-tag-sm",
              severity: "secondary"
            }, {
              default: L(() => [
                N(U(r(Dt)(J, e.field)) + " ", 1),
                b(r(X), {
                  type: "button",
                  class: "work-icon-button",
                  disabled: i.value,
                  "aria-label": "Remove value " + (de + 1),
                  onClick: (fe) => te(de),
                  severity: "secondary",
                  text: "",
                  size: "small"
                }, {
                  default: L(() => [
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
          (c(!0), g(Z, null, le(v.value, (J, de) => (c(), g("div", {
            key: T.value[de],
            class: "work-stack work-tight"
          }, [
            b(W, {
              "board-id": e.boardId,
              field: { ...e.field, cardinality: "one" },
              "model-value": J,
              "input-id": o.value + "-" + T.value[de],
              disabled: i.value,
              "editor-tag": e.editorTag,
              "link-tag": e.linkTag,
              "onUpdate:modelValue": (fe) => B(de, fe),
              onValidity: (fe) => M(T.value[de], fe)
            }, null, 8, ["board-id", "field", "model-value", "input-id", "disabled", "editor-tag", "link-tag", "onUpdate:modelValue", "onValidity"])
          ]))), 128)),
          b(r(X), {
            label: "Add value",
            severity: "secondary",
            size: "small",
            disabled: i.value,
            onClick: oe,
            outlined: ""
          }, {
            icon: L(() => [
              b(r(Q), {
                icon: "tabler:plus",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled"])
        ])) : e.editorTag && y.value ? (c(), j(zl(e.editorTag), {
          key: 2,
          "board-id": e.boardId,
          value: JSON.stringify(e.modelValue ?? null),
          config: JSON.stringify(e.field.config ?? {}),
          readonly: i.value || void 0,
          onChange: Ve
        }, null, 40, ["board-id", "value", "config", "readonly"])) : e.linkTag && u.value ? (c(), j(zl(e.linkTag), {
          key: 3,
          "board-id": e.boardId,
          kind: e.field.config?.target ?? e.field.type,
          value: JSON.stringify(e.modelValue ?? null),
          readonly: i.value || void 0,
          onChange: ke
        }, null, 40, ["board-id", "kind", "value", "readonly"])) : e.field.type === "option" ? (c(), j(r(ae), {
          key: 4,
          placeholder: "Not set",
          inputId: o.value,
          "model-value": e.modelValue ?? "",
          disabled: i.value,
          "onUpdate:modelValue": w[0] || (w[0] = (J) => S(J || void 0)),
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
            "onUpdate:modelValue": w[1] || (w[1] = (J) => S(J)),
            binary: ""
          }, null, 8, ["inputId", "model-value", "disabled"]),
          N(U(e.modelValue === !0 ? "Yes" : e.modelValue === !1 ? "No" : "Not set"), 1)
        ])) : e.field.form === "int" ? (c(), j(r(Ge), {
          key: 6,
          inputId: o.value,
          "model-value": f.value === "" ? null : Number(f.value),
          disabled: i.value,
          "onUpdate:modelValue": w[2] || (w[2] = (J) => I(J == null ? "" : String(J))),
          useGrouping: !1
        }, null, 8, ["inputId", "model-value", "disabled"])) : e.field.form === "dec" ? (c(), j(r(ue), {
          key: 7,
          id: o.value,
          inputmode: "decimal",
          "model-value": f.value,
          disabled: i.value,
          "onUpdate:modelValue": w[3] || (w[3] = (J) => I(J ?? ""))
        }, null, 8, ["id", "model-value", "disabled"])) : e.field.form === "time" ? (c(), j(r(ue), {
          key: 8,
          id: o.value,
          type: A.value ? "date" : "datetime-local",
          value: pe.value,
          disabled: i.value,
          onInput: w[4] || (w[4] = (J) => re(J.target.value))
        }, null, 8, ["id", "type", "value", "disabled"])) : e.field.type === "principal" ? (c(), g("div", {
          key: 9,
          inert: i.value || void 0,
          class: "work-stack work-tight"
        }, [
          n.value ? (c(), g("wc-principal-picker", {
            key: 0,
            value: JSON.stringify(e.modelValue ?? {}),
            kinds: "user,group",
            onConfigChanged: q
          }, null, 40, wi)) : (c(), g("span", Vi, U(r(Dt)(e.modelValue, e.field)) + " · Person picker is unavailable.", 1))
        ], 8, ki)) : e.field.config?.target === "component" ? (c(), g("div", {
          key: 10,
          inert: i.value || void 0
        }, [
          n.value ? (c(), g("wc-component-picker", {
            key: 0,
            value: JSON.stringify({ thread_id: m.value }),
            onChange: P
          }, null, 40, xi)) : (c(), g("span", Ci, "Component picker is unavailable."))
        ], 8, $i)) : e.field.type === "item" ? (c(), g("div", Si, [
          b(r(Re), {
            class: "kx-tag-sm",
            severity: "secondary"
          }, {
            default: L(() => [
              N(U(r(Dt)(e.modelValue, e.field)), 1)
            ]),
            _: 1
          }),
          b(r(ue), {
            id: o.value,
            modelValue: $.value,
            "onUpdate:modelValue": w[5] || (w[5] = (J) => $.value = J),
            disabled: i.value,
            placeholder: "Search a title or enter an item key",
            "aria-label": "Search items"
          }, null, 8, ["id", "modelValue", "disabled"]),
          d("div", Ti, [
            (c(!0), g(Z, null, le(C.value, (J) => (c(), j(Jl, {
              key: J.id,
              class: "work-match-item",
              disabled: i.value,
              onActivate: (de) => h(J)
            }, {
              default: L(() => [
                d("code", Ei, U(J.key), 1),
                d("span", null, U(r(Dt)(J.values.title)), 1)
              ]),
              _: 2
            }, 1032, ["disabled", "onActivate"]))), 128))
          ]),
          e.modelValue ? (c(), j(r(X), {
            key: 0,
            label: "Clear reference",
            severity: "secondary",
            size: "small",
            disabled: i.value,
            onClick: w[6] || (w[6] = (J) => S(void 0)),
            outlined: ""
          }, {
            icon: L(() => [
              b(r(Q), {
                icon: "tabler:list-check",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled"])) : E("", !0)
        ])) : e.field.form === "record" || e.field.type === "rich_text" || e.field.form === "quantity" || e.field.form === "ref" ? (c(), j(r(ml), {
          key: 12,
          id: o.value,
          "model-value": R.value,
          rows: "3",
          disabled: i.value,
          "aria-invalid": !!p.value,
          "onUpdate:modelValue": w[7] || (w[7] = (J) => V(J ?? ""))
        }, null, 8, ["id", "model-value", "disabled", "aria-invalid"])) : e.field.code === "description" ? (c(), j(r(ml), {
          key: 13,
          id: o.value,
          "model-value": f.value,
          rows: "4",
          disabled: i.value,
          "onUpdate:modelValue": w[8] || (w[8] = (J) => S(J))
        }, null, 8, ["id", "model-value", "disabled"])) : (c(), j(r(ue), {
          key: 14,
          id: o.value,
          "model-value": f.value,
          disabled: i.value,
          "onUpdate:modelValue": w[9] || (w[9] = (J) => S(J))
        }, null, 8, ["id", "model-value", "disabled"])),
        p.value ? (c(), g("span", Ui, U(p.value), 1)) : E("", !0)
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
}, qt = /* @__PURE__ */ ce({
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
    const t = e, a = l, o = H(() => "$actor" in Ke(t.modelValue) ? "actor" : "$now" in Ke(t.modelValue) ? "now" : "literal"), s = z(""), v = z("");
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
        N(U(e.label), 1),
        b(r(ae), {
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
      o.value === "now" ? (c(), j(r(ue), {
        key: 0,
        "aria-label": e.label + " time offset",
        value: r(Ke)(e.modelValue).$now,
        disabled: e.disabled,
        placeholder: "-P7D",
        onInput: n[1] || (n[1] = (u) => a("update:modelValue", { $now: u.target.value }))
      }, null, 8, ["aria-label", "value", "disabled"])) : o.value === "actor" ? (c(), g("span", Ai, "The signed-in actor’s id")) : e.multiple ? (c(), g("div", Pi, [
        d("label", Ri, [
          n[5] || (n[5] = N("Values as JSON (operands may appear in the list)", -1)),
          b(r(ml), {
            class: "work-mono",
            "aria-label": e.label + " values",
            value: s.value,
            disabled: e.disabled,
            rows: "2",
            onInput: n[2] || (n[2] = (u) => m(u.target.value))
          }, null, 8, ["aria-label", "value", "disabled"])
        ]),
        v.value ? (c(), g("p", Oi, U(v.value), 1)) : E("", !0)
      ])) : (c(), j(ja, {
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
}, Gi = { class: "work-row work-wrap" }, Yi = /* @__PURE__ */ ce({
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
    const t = e, a = l, o = H(() => t.path ?? "where"), s = H(() => t.depth ?? 1), v = H(() => ["and", "or", "not", "history", "match", "rel", "children"].find((q) => q in t.modelValue) ?? "field"), f = H(() => mi(t.schema)), m = H(() => f.value.find((q) => q.code === t.modelValue.field) ?? { code: "value", form: "text" }), i = H(() => Ke(t.modelValue.history)), n = H(() => f.value.find((q) => q.code === i.value.field) ?? { code: "history", form: "text" }), u = H(() => Array.isArray(t.modelValue[v.value]) ? t.modelValue[v.value] : []), y = () => ({ field: "category", op: "eq", value: "unstarted" }), p = z(/* @__PURE__ */ new Set());
    function $(q, P) {
      P ? p.value.delete(q) : p.value.add(q), a("validity", p.value.size === 0);
    }
    xe(v, () => {
      p.value.clear(), a("validity", !0);
    });
    function C(q) {
      const P = /* @__PURE__ */ new Set();
      for (const R of p.value) {
        const k = Number(R);
        !Number.isNaN(k) && k !== q && P.add(String(k > q ? k - 1 : k));
      }
      p.value = P, a("validity", P.size === 0), T({ [v.value]: u.value.filter((R, k) => k !== q) });
    }
    function D(q) {
      a("update:modelValue", q);
    }
    function T(q) {
      D({ ...t.modelValue, ...q });
    }
    function Y(q) {
      D(q === "field" ? y() : q === "and" || q === "or" ? { [q]: [y()] } : q === "not" ? { not: y() } : q === "history" ? { history: { field: "state", changed: !0 } } : q === "match" ? { match: "" } : q === "children" ? { children: !0, q: "some", where: y() } : { rel: t.schema.compiled.relation_types?.[0]?.id ?? "", dir: "outward", q: "some", where: y() });
    }
    function F(q, P) {
      T({ [v.value]: u.value.map((R, k) => k === q ? P : R) });
    }
    function O(q, P) {
      const R = { ...i.value };
      P === void 0 ? (delete R[q], $(q, !0)) : R[q] = P, T({ history: R });
    }
    function S(q) {
      p.value.clear(), a("validity", !0);
      const P = { ...i.value };
      delete P.was, delete P.changed, delete P.from, delete P.to, P[q] = q === "changed" ? !0 : "", T({ history: P });
    }
    const B = { code: "actor", form: "text" }, M = { code: "at", form: "time" }, te = H(() => Array.isArray(i.value.during) ? i.value.during : []);
    function oe(q, P) {
      const R = [...te.value];
      R[q] = P, O("during", R);
    }
    return (q, P) => {
      const R = Pa("FilterNode", !0);
      return c(), g("fieldset", {
        class: "work-filter-node",
        disabled: e.disabled
      }, [
        d("legend", Mi, U(o.value), 1),
        d("label", Fi, [
          P[21] || (P[21] = N("Condition", -1)),
          b(r(ae), {
            "aria-label": o.value + " condition",
            "model-value": v.value,
            "onUpdate:modelValue": P[0] || (P[0] = (k) => Y(k)),
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            optionDisabled: "disabled",
            options: [{ label: "Field", value: "field", disabled: !1 }, ...["and", "or", "not", "history", "rel", "children", "match"].map((k) => ({ label: k, value: k, disabled: s.value >= 6 && ["and", "or", "not", "rel", "children"].includes(k) }))]
          }, null, 8, ["aria-label", "model-value", "options"])
        ]),
        v.value === "and" || v.value === "or" ? (c(), g(Z, { key: 0 }, [
          (c(!0), g(Z, null, le(u.value, (k, V) => (c(), g("div", {
            key: V,
            class: "work-stack work-tight"
          }, [
            b(R, {
              "board-id": e.boardId,
              schema: e.schema,
              "model-value": k,
              path: o.value + "." + v.value + "[" + V + "]",
              depth: s.value + 1,
              "onUpdate:modelValue": (I) => F(V, I),
              onValidity: (I) => $(String(V), I)
            }, null, 8, ["board-id", "schema", "model-value", "path", "depth", "onUpdate:modelValue", "onValidity"]),
            b(r(X), {
              label: "Remove condition",
              size: "small",
              severity: "secondary",
              onClick: (I) => C(V),
              outlined: ""
            }, {
              icon: L(() => [
                b(r(Q), {
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
            onClick: P[1] || (P[1] = (k) => T({ [v.value]: [...u.value, y()] })),
            outlined: ""
          }, {
            icon: L(() => [
              b(r(Q), {
                icon: "tabler:plus",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled"])
        ], 64)) : v.value === "not" ? (c(), j(R, {
          key: 1,
          "board-id": e.boardId,
          schema: e.schema,
          "model-value": r(Ke)(e.modelValue.not),
          path: o.value + ".not",
          depth: s.value + 1,
          "onUpdate:modelValue": P[2] || (P[2] = (k) => T({ not: k })),
          onValidity: P[3] || (P[3] = (k) => $("nested", k))
        }, null, 8, ["board-id", "schema", "model-value", "path", "depth"])) : v.value === "field" ? (c(), g(Z, { key: 2 }, [
          d("div", Li, [
            d("label", null, [
              P[22] || (P[22] = N("Field", -1)),
              b(r(ae), {
                "aria-label": o.value + " field",
                "model-value": e.modelValue.field,
                "onUpdate:modelValue": P[4] || (P[4] = (k) => T({ field: k, op: "eq", value: void 0 })),
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                optionDisabled: "disabled",
                options: [...(f.value ?? []).map((k) => ({ label: r(Ct)(k), value: k.code, disabled: !1 }))]
              }, null, 8, ["aria-label", "model-value", "options"])
            ]),
            d("label", null, [
              P[23] || (P[23] = N("Operator", -1)),
              b(r(ae), {
                "aria-label": o.value + " operator",
                "model-value": e.modelValue.op,
                "onUpdate:modelValue": P[5] || (P[5] = (k) => T({ op: k, value: k === "is_null" ? !0 : void 0 })),
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
            "onUpdate:modelValue": P[6] || (P[6] = (k) => T({ value: k })),
            onValidity: P[7] || (P[7] = (k) => $("value", k))
          }, null, 8, ["board-id", "field", "model-value", "multiple", "label"])
        ], 64)) : v.value === "match" ? (c(), g("label", zi, [
          P[24] || (P[24] = N("Search", -1)),
          b(r(ue), {
            "aria-label": o.value + " search",
            value: e.modelValue.match,
            onInput: P[8] || (P[8] = (k) => T({ match: k.target.value }))
          }, null, 8, ["aria-label", "value"])
        ])) : v.value === "history" ? (c(), g(Z, { key: 4 }, [
          d("div", Bi, [
            d("label", null, [
              P[25] || (P[25] = N("Field", -1)),
              b(r(ae), {
                "aria-label": o.value + " history field",
                "model-value": i.value.field,
                "onUpdate:modelValue": P[9] || (P[9] = (k) => O("field", k)),
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                optionDisabled: "disabled",
                options: [...(f.value ?? []).map((k) => ({ label: r(Ct)(k), value: k.code, disabled: !1 }))]
              }, null, 8, ["aria-label", "model-value", "options"])
            ]),
            d("label", null, [
              P[26] || (P[26] = N("History", -1)),
              b(r(ae), {
                "aria-label": o.value + " history mode",
                "model-value": i.value.changed ? "changed" : "was",
                "onUpdate:modelValue": P[10] || (P[10] = (k) => S(k)),
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                optionDisabled: "disabled",
                options: [{ label: "Changed", value: "changed", disabled: !1 }, { label: "Was", value: "was", disabled: !1 }]
              }, null, 8, ["aria-label", "model-value"])
            ])
          ]),
          i.value.changed ? (c(), g(Z, { key: 0 }, le(["from", "to"], (k) => d("div", { key: k }, [
            d("label", ji, [
              b(r(Mt), {
                "model-value": k in i.value,
                "aria-label": "Constrain " + k,
                "onUpdate:modelValue": (V) => O(k, V ? "" : void 0),
                binary: ""
              }, null, 8, ["model-value", "aria-label", "onUpdate:modelValue"]),
              N(U(k), 1)
            ]),
            k in i.value ? (c(), j(qt, {
              key: 0,
              "board-id": e.boardId,
              field: n.value,
              "model-value": i.value[k],
              label: o.value + " history " + k,
              "onUpdate:modelValue": (V) => O(k, V),
              onValidity: (V) => $(k, V)
            }, null, 8, ["board-id", "field", "model-value", "label", "onUpdate:modelValue", "onValidity"])) : E("", !0)
          ])), 64)) : (c(), j(qt, {
            key: 1,
            "board-id": e.boardId,
            field: n.value,
            "model-value": i.value.was,
            label: o.value + " history was",
            "onUpdate:modelValue": P[11] || (P[11] = (k) => O("was", k)),
            onValidity: P[12] || (P[12] = (k) => $("was", k))
          }, null, 8, ["board-id", "field", "model-value", "label"])),
          d("label", qi, [
            b(r(Mt), {
              "model-value": "by" in i.value,
              "aria-label": "Constrain actor",
              "onUpdate:modelValue": P[13] || (P[13] = (k) => O("by", k ? { $actor: "id" } : void 0)),
              binary: ""
            }, null, 8, ["model-value"]),
            P[27] || (P[27] = N("By actor", -1))
          ]),
          "by" in i.value ? (c(), j(qt, {
            key: 2,
            "board-id": e.boardId,
            field: B,
            "model-value": i.value.by,
            label: o.value + " history by",
            "onUpdate:modelValue": P[14] || (P[14] = (k) => O("by", k))
          }, null, 8, ["board-id", "model-value", "label"])) : E("", !0),
          d("label", Wi, [
            b(r(Mt), {
              "model-value": "during" in i.value,
              "aria-label": "Constrain time window",
              "onUpdate:modelValue": P[15] || (P[15] = (k) => O("during", k ? [{ $now: "-P30D" }, { $now: "P0D" }] : void 0)),
              binary: ""
            }, null, 8, ["model-value"]),
            P[28] || (P[28] = N("During", -1))
          ]),
          "during" in i.value ? (c(), g("div", Ki, [
            (c(), g(Z, null, le(["start", "end"], (k, V) => b(qt, {
              key: k,
              "board-id": e.boardId,
              field: M,
              "model-value": te.value[V],
              label: o.value + " during " + k,
              "onUpdate:modelValue": (I) => oe(V, I)
            }, null, 8, ["board-id", "model-value", "label", "onUpdate:modelValue"])), 64))
          ])) : E("", !0)
        ], 64)) : (c(), g(Z, { key: 5 }, [
          d("div", Gi, [
            v.value === "rel" ? (c(), g(Z, { key: 0 }, [
              d("label", null, [
                P[29] || (P[29] = N("Relation", -1)),
                b(r(ae), {
                  "model-value": e.modelValue.rel,
                  "onUpdate:modelValue": P[16] || (P[16] = (k) => T({ rel: k })),
                  appendTo: "self",
                  optionLabel: "label",
                  optionValue: "value",
                  optionDisabled: "disabled",
                  options: [...(e.schema.compiled.relation_types ?? []).map((k) => ({ label: k.outward ?? k.id, value: k.id, disabled: !1 }))]
                }, null, 8, ["model-value", "options"])
              ]),
              d("label", null, [
                P[30] || (P[30] = N("Direction", -1)),
                b(r(ae), {
                  "model-value": e.modelValue.dir,
                  "onUpdate:modelValue": P[17] || (P[17] = (k) => T({ dir: k })),
                  appendTo: "self",
                  optionLabel: "label",
                  optionValue: "value",
                  optionDisabled: "disabled",
                  options: [{ label: "Outward", value: "outward", disabled: !1 }, { label: "Inward", value: "inward", disabled: !1 }]
                }, null, 8, ["model-value"])
              ])
            ], 64)) : E("", !0),
            d("label", null, [
              P[31] || (P[31] = N("Quantifier", -1)),
              b(r(ae), {
                "model-value": e.modelValue.q,
                "onUpdate:modelValue": P[18] || (P[18] = (k) => T({ q: k })),
                appendTo: "self",
                options: ["some", "every", "none"]
              }, null, 8, ["model-value"])
            ])
          ]),
          b(R, {
            "board-id": e.boardId,
            schema: e.schema,
            "model-value": r(Ke)(e.modelValue.where),
            path: o.value + ".where",
            depth: s.value + 1,
            "onUpdate:modelValue": P[19] || (P[19] = (k) => T({ where: k })),
            onValidity: P[20] || (P[20] = (k) => $("nested", k))
          }, null, 8, ["board-id", "schema", "model-value", "path", "depth"])
        ], 64))
      ], 8, Ni);
    };
  }
}), Hi = { class: "work-stack work-tight" }, Xi = { class: "work-row work-small" }, _l = /* @__PURE__ */ ce({
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
        N(U(e.label), 1)
      ]),
      e.modelValue != null ? (c(), j(Yi, {
        key: 0,
        schema: o.value,
        "board-id": e.boardId ?? "",
        "model-value": r(Ke)(e.modelValue),
        path: e.label,
        "onUpdate:modelValue": i[0] || (i[0] = (n) => a("update:modelValue", n)),
        onValidity: i[1] || (i[1] = (n) => v("structured", n))
      }, null, 8, ["schema", "board-id", "model-value", "path"])) : E("", !0),
      e.modelValue != null ? (c(), j(at, {
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
}, ea = /* @__PURE__ */ ce({
  __name: "PrincipalsPicker",
  props: {
    modelValue: {},
    label: {},
    kinds: {},
    boardId: {}
  },
  emits: ["update:modelValue"],
  setup(e, { emit: l }) {
    const t = e, a = l, o = z(!1), s = z(0), v = H(() => t.modelValue ?? []), { principalLabel: f, rememberPrincipal: m, nameError: i } = Oa(() => t.boardId ?? "", () => v.value);
    kl(async () => {
      o.value = await tt("wc-principal-picker");
    });
    function n(u) {
      const y = u.detail, p = y?.principal_id ?? y?.id;
      if (!p) return;
      const $ = { kind: y.type ?? "user", id: p };
      y.label && m($, y.label), v.value.some((C) => C.id === p && C.kind === $.kind) || a("update:modelValue", [...v.value, $]), s.value++;
    }
    return (u, y) => (c(), g(Z, null, [
      r(i) ? (c(), g("p", Ji, U(r(i)), 1)) : E("", !0),
      d("section", {
        class: "work-stack work-tight work-principals-picker",
        "aria-label": e.label
      }, [
        d("h4", Qi, U(e.label), 1),
        v.value.length ? (c(), g("div", _i, [
          (c(!0), g(Z, null, le(v.value, (p, $) => (c(), j(r(Re), {
            key: p.kind + p.id,
            severity: "secondary",
            class: "kx-tag-sm"
          }, {
            default: L(() => [
              N(U(r(f)(p)), 1),
              b(r(X), {
                text: "",
                severity: "secondary",
                size: "small",
                "aria-label": "Remove " + r(f)(p),
                onClick: (C) => a("update:modelValue", v.value.filter((D, T) => T !== $))
              }, {
                default: L(() => [
                  b(r(Q), { icon: "tabler:x" })
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
}), ln = { class: "work-stack work-tight" }, qa = /* @__PURE__ */ ce({
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
function ba(e, l) {
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
    l % 2 ? ba(Object(t), !0).forEach(function(a) {
      an(e, a, t[a]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ba(Object(t)).forEach(function(a) {
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
var nt = lt(/(?:Trident.*rv[ :]?11\.|msie|iemobile|Windows Phone)/i), el = lt(/Edge/i), ha = lt(/firefox/i), Ht = lt(/safari/i) && !lt(/chrome/i) && !lt(/android/i), ta = lt(/iP(ad|od|hone)/i), Wa = lt(/chrome/i) && lt(/android/i), Ka = {
  capture: !1,
  passive: !1
};
function me(e, l, t) {
  e.addEventListener(l, t, !nt && Ka);
}
function ve(e, l, t) {
  e.removeEventListener(l, t, !nt && Ka);
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
function Ga(e) {
  return e.host && e !== document && e.host.nodeType && e.host !== e ? e.host : e.parentNode;
}
function Je(e, l, t, a) {
  if (e) {
    t = t || document;
    do {
      if (l != null && (l[0] === ">" ? e.parentNode === t && fl(e, l) : fl(e, l)) || a && e === t)
        return e;
      if (e === t) break;
    } while (e = Ga(e));
  }
  return null;
}
var ya = /\s+/g;
function ze(e, l, t) {
  if (e && l)
    if (e.classList)
      e.classList[t ? "add" : "remove"](l);
    else {
      var a = (" " + e.className + " ").replace(ya, " ").replace(" " + l + " ", " ");
      e.className = (a + (t ? " " + l : "")).replace(ya, " ");
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
function Ya(e, l, t) {
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
      var p = Ft(o || e), $ = p && p.a, C = p && p.d;
      p && (v /= C, f /= $, u /= $, n /= C, m = v + n, i = f + u);
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
function ga(e, l, t) {
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
function ka(e) {
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
function Ha(e, l) {
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
function Xa(e, l, t) {
  e.scrollLeft += l, e.scrollTop += t;
}
function Ja(e) {
  var l = window.Polymer, t = window.jQuery || window.Zepto;
  return l && l.dom ? l.dom(e).cloneNode(!0) : t ? t(e).clone(!0)[0] : e.cloneNode(!0);
}
function Za(e, l, t) {
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
        var m = 0, i = f.target, n = i.fromRect, u = Ue(i), y = i.prevFromRect, p = i.prevToRect, $ = f.rect, C = Ft(i, !0);
        C && (u.top -= C.f, u.left -= C.e), i.toRect = u, i.thisAnimationDuration && Il(y, u) && !Il(n, u) && // Make sure animatingRect is on line between toRect & fromRect
        ($.top - u.top) / ($.left - u.left) === (n.top - u.top) / (n.left - u.left) && (m = pn($, y, p, o.options)), Il(u, n) || (i.prevFromRect = n, i.prevToRect = u, m || (m = o.options.animation), o.animate(i, $, u, m)), m && (s = !0, v = Math.max(v, m), clearTimeout(i.animationResetTimer), i.animationResetTimer = setTimeout(function() {
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
  var l = e.sortable, t = e.rootEl, a = e.name, o = e.targetEl, s = e.cloneEl, v = e.toEl, f = e.fromEl, m = e.oldIndex, i = e.newIndex, n = e.oldDraggableIndex, u = e.newDraggableIndex, y = e.originalEvent, p = e.putSortable, $ = e.extraEventProperties;
  if (l = l || t && t[Fe], !!l) {
    var C, D = l.options, T = "on" + a.charAt(0).toUpperCase() + a.substr(1);
    window.CustomEvent && !nt && !el ? C = new CustomEvent(a, {
      bubbles: !0,
      cancelable: !0
    }) : (C = document.createEvent("Event"), C.initEvent(a, !0, !0)), C.to = v || t, C.from = f || t, C.item = o || t, C.clone = s, C.oldIndex = m, C.newIndex = i, C.oldDraggableIndex = n, C.newDraggableIndex = u, C.originalEvent = y, C.pullMode = p ? p.lastPutMode : void 0;
    var Y = et(et({}, $), tl.getEventProperties(a, l));
    for (var F in Y)
      C[F] = Y[F];
    t && t.dispatchEvent(C), D[T] && D[T].call(l, C);
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
    hideGhostForTarget: to,
    unhideGhostForTarget: lo,
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
var G, Ce, se, we, wt, dl, $e, vt, Nt, Be, Jt, ct, il, Ie, Rt = !1, pl = !1, bl = [], ht, Xe, Pl, Rl, wa, Va, Kt, Pt, Zt, Qt = !1, nl = !1, ul, Pe, Ol = [], Wl = !1, hl = [], xl = typeof document < "u", sl = ta, $a = el || nt ? "cssFloat" : "float", yn = xl && !Wa && !ta && "draggable" in document.createElement("div"), Qa = (function() {
  if (xl) {
    if (nt)
      return !1;
    var e = document.createElement("x");
    return e.style.cssText = "pointer-events:auto", e.style.pointerEvents === "auto";
  }
})(), _a = function(l, t) {
  var a = ie(l), o = parseInt(a.width) - parseInt(a.paddingLeft) - parseInt(a.paddingRight) - parseInt(a.borderLeftWidth) - parseInt(a.borderRightWidth), s = zt(l, 0, t), v = zt(l, 1, t), f = s && ie(s), m = v && ie(v), i = f && parseInt(f.marginLeft) + parseInt(f.marginRight) + Ue(s).width, n = m && parseInt(m.marginLeft) + parseInt(m.marginRight) + Ue(v).width;
  if (a.display === "flex")
    return a.flexDirection === "column" || a.flexDirection === "column-reverse" ? "vertical" : "horizontal";
  if (a.display === "grid")
    return a.gridTemplateColumns.split(" ").length <= 1 ? "vertical" : "horizontal";
  if (s && f.float && f.float !== "none") {
    var u = f.float === "left" ? "left" : "right";
    return v && (m.clear === "both" || m.clear === u) ? "vertical" : "horizontal";
  }
  return s && (f.display === "block" || f.display === "flex" || f.display === "table" || f.display === "grid" || i >= o && a[$a] === "none" || v && a[$a] === "none" && i + n > o) ? "vertical" : "horizontal";
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
}, eo = function(l) {
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
}, to = function() {
  !Qa && se && ie(se, "display", "none");
}, lo = function() {
  !Qa && se && ie(se, "display", "");
};
xl && !Wa && document.addEventListener("click", function(e) {
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
      return _a(e, this.options);
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
  eo(l);
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
      }, wa = ht.clientX - i.left, Va = ht.clientY - i.top, this._lastX = (t || l).clientX, this._lastY = (t || l).clientY, G.style["will-change"] = "all", m = function() {
        if (Me("delayEnded", o, {
          evt: l
        }), ne.eventCanceled) {
          o._onDrop();
          return;
        }
        o._disableDelayedDragEvents(), !ha && o.nativeDraggable && (G.draggable = !0), o._triggerDragStart(l, t), Oe({
          sortable: o,
          name: "choose",
          originalEvent: l
        }), ze(G, v.chosenClass, !0);
      }, v.ignore.split(",").forEach(function(n) {
        Ya(G, n.trim(), Nl);
      }), me(f, "dragover", yt), me(f, "mousemove", yt), me(f, "touchmove", yt), v.supportPointer ? (me(f, "pointerup", o._onDrop), !this.nativeDraggable && me(f, "pointercancel", o._onDrop)) : (me(f, "mouseup", o._onDrop), me(f, "touchend", o._onDrop), me(f, "touchcancel", o._onDrop)), ha && this.nativeDraggable && (this.options.touchStartThreshold = 4, G.draggable = !0), Me("delayStart", this, {
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
      this._lastX = Xe.clientX, this._lastY = Xe.clientY, to();
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
        } while (t = Ga(t));
      lo();
    }
  },
  _onTouchMove: function(l) {
    if (ht) {
      var t = this.options, a = t.fallbackTolerance, o = t.fallbackOffset, s = l.touches ? l.touches[0] : l, v = se && Ft(se, !0), f = se && v && v.a, m = se && v && v.d, i = sl && Pe && ka(Pe), n = (s.clientX - ht.clientX + o.x) / (f || 1) + (i ? i[0] - Ol[0] : 0) / (f || 1), u = (s.clientY - ht.clientY + o.y) / (m || 1) + (i ? i[1] - Ol[1] : 0) / (m || 1);
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
        Pe !== document.body && Pe !== document.documentElement ? (Pe === document && (Pe = _e()), t.top += Pe.scrollTop, t.left += Pe.scrollLeft) : Pe = _e(), Ol = ka(Pe);
      }
      se = G.cloneNode(!0), ze(se, a.ghostClass, !1), ze(se, a.fallbackClass, !0), ze(se, a.dragClass, !0), ie(se, "transition", ""), ie(se, "transform", ""), ie(se, "box-sizing", "border-box"), ie(se, "margin", 0), ie(se, "top", t.top), ie(se, "left", t.left), ie(se, "width", t.width), ie(se, "height", t.height), ie(se, "opacity", "0.8"), ie(se, "position", sl ? "absolute" : "fixed"), ie(se, "zIndex", "100000"), ie(se, "pointerEvents", "none"), ne.ghost = se, l.appendChild(se), ie(se, "transform-origin", wa / parseInt(se.style.width) * 100 + "% " + Va / parseInt(se.style.height) * 100 + "%");
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
    Me("setupClone", this), ne.eventCanceled || ($e = Ja(G), $e.removeAttribute("id"), $e.draggable = !1, $e.style["will-change"] = "", this._hideClone(), ze($e, this.options.chosenClass, !1), ne.clone = $e), a.cloneId = cl(function() {
      Me("clone", a), !ne.eventCanceled && (a.options.removeCloneOnHide || we.insertBefore($e, G), a._hideClone(), Oe({
        sortable: a,
        name: "clone"
      }));
    }), !t && ze(G, s.dragClass, !0), t ? (pl = !0, a._loopId = setInterval(a._emulateDragOver, 50)) : (ve(document, "mouseup", a._onDrop), ve(document, "touchend", a._onDrop), ve(document, "touchcancel", a._onDrop), o && (o.effectAllowed = "move", s.setData && s.setData.call(a, o, G)), me(document, "drop", a), ie(G, "transform", "translateZ(0)")), Rt = !0, a._dragStartId = cl(a._dragStarted.bind(a, t, l)), me(document, "selectstart", a), Kt = !0, window.getSelection().removeAllRanges(), Ht && ie(document.body, "user-select", "none");
  },
  // Returns true - if no further action is needed (either inserted or another condition)
  _onDragOver: function(l) {
    var t = this.el, a = l.target, o, s, v, f = this.options, m = f.group, i = ne.active, n = il === m, u = f.sort, y = Ie || i, p, $ = this, C = !1;
    if (Wl) return;
    function D(pe, ke) {
      Me(pe, $, et({
        evt: l,
        isOwner: n,
        axis: p ? "vertical" : "horizontal",
        revert: v,
        dragRect: o,
        targetRect: s,
        canSort: u,
        fromSortable: y,
        target: a,
        completed: Y,
        onMove: function(De, h) {
          return rl(we, t, G, o, De, Ue(De), l, h);
        },
        changed: F
      }, ke));
    }
    function T() {
      D("dragOverAnimationCapture"), $.captureAnimationState(), $ !== y && y.captureAnimationState();
    }
    function Y(pe) {
      return D("dragOverCompleted", {
        insertion: pe
      }), pe && (n ? i._hideClone() : i._showClone($), $ !== y && (ze(G, Ie ? Ie.options.ghostClass : i.options.ghostClass, !1), ze(G, f.ghostClass, !0)), Ie !== $ && $ !== ne.active ? Ie = $ : $ === ne.active && Ie && (Ie = null), y === $ && ($._ignoreWhileAnimating = a), $.animateAll(function() {
        D("dragOverAnimationComplete"), $._ignoreWhileAnimating = null;
      }), $ !== y && (y.animateAll(), y._ignoreWhileAnimating = null)), (a === G && !G.animated || a === t && !a.animated) && (Pt = null), !f.dragoverBubble && !l.rootEl && a !== document && (G.parentNode[Fe]._isOutsideThisEl(l.target), !pe && yt(l)), !f.dragoverBubble && l.stopPropagation && l.stopPropagation(), C = !0;
    }
    function F() {
      Be = qe(G), ct = qe(G, f.draggable), Oe({
        sortable: $,
        name: "change",
        toEl: t,
        newIndex: Be,
        newDraggableIndex: ct,
        originalEvent: l
      });
    }
    if (l.preventDefault !== void 0 && l.cancelable && l.preventDefault(), a = Je(a, f.draggable, t, !0), D("dragOver"), ne.eventCanceled) return C;
    if (G.contains(l.target) || a.animated && a.animatingX && a.animatingY || $._ignoreWhileAnimating === a)
      return Y(!1);
    if (pl = !1, i && !f.disabled && (n ? u || (v = Ce !== we) : Ie === this || (this.lastPutMode = il.checkPull(this, i, G, l)) && m.checkPut(this, i, G, l))) {
      if (p = this._getDirection(l, a) === "vertical", o = Ue(G), D("dragOverValid"), ne.eventCanceled) return C;
      if (v)
        return Ce = we, T(), this._hideClone(), D("revert"), ne.eventCanceled || (wt ? we.insertBefore(G, wt) : we.appendChild(G)), Y(!0);
      var O = la(t, f.draggable);
      if (!O || Cn(l, p, this) && !O.animated) {
        if (O === G)
          return Y(!1);
        if (O && t === l.target && (a = O), a && (s = Ue(a)), rl(we, t, G, o, a, s, l, !!a) !== !1)
          return T(), O && O.nextSibling ? t.insertBefore(G, O.nextSibling) : t.appendChild(G), Ce = t, F(), Y(!0);
      } else if (O && xn(l, p, this)) {
        var S = zt(t, 0, f, !0);
        if (S === G)
          return Y(!1);
        if (a = S, s = Ue(a), rl(we, t, G, o, a, s, l, !1) !== !1)
          return T(), t.insertBefore(G, S), Ce = t, F(), Y(!0);
      } else if (a.parentNode === t) {
        s = Ue(a);
        var B = 0, M, te = G.parentNode !== t, oe = !gn(G.animated && G.toRect || o, a.animated && a.toRect || s, p), q = p ? "top" : "left", P = ga(a, "top", "top") || ga(G, "top", "top"), R = P ? P.scrollTop : void 0;
        Pt !== a && (M = s[q], Qt = !1, nl = !oe && f.invertSwap || te), B = Sn(l, a, s, p, oe ? 1 : f.swapThreshold, f.invertedSwapThreshold == null ? f.swapThreshold : f.invertedSwapThreshold, nl, Pt === a);
        var k;
        if (B !== 0) {
          var V = qe(G);
          do
            V -= B, k = Ce.children[V];
          while (k && (ie(k, "display") === "none" || k === se));
        }
        if (B === 0 || k === a)
          return Y(!1);
        Pt = a, Zt = B;
        var I = a.nextElementSibling, A = !1;
        A = B === 1;
        var re = rl(we, t, G, o, a, s, l, A);
        if (re !== !1)
          return (re === 1 || re === -1) && (A = re === 1), Wl = !0, setTimeout($n, 30), T(), A && !I ? t.appendChild(G) : a.parentNode.insertBefore(G, A ? I : a), P && Xa(P, 0, R - P.scrollTop), Ce = G.parentNode, M !== void 0 && !nl && (ul = Math.abs(M - Ue(a)[q])), F(), Y(!0);
      }
      if (t.contains(G))
        return Y(!1);
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
    typeof o < "u" ? a[l] = o : a[l] = t, l === "group" && eo(a);
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
  var a = Ue(zt(t.el, 0, t.options, !0)), o = Za(t.el, t.options, se), s = 10;
  return l ? e.clientX < o.left - s || e.clientY < a.top && e.clientX < a.right : e.clientY < o.top - s || e.clientY < a.bottom && e.clientX < a.left;
}
function Cn(e, l, t) {
  var a = Ue(la(t.el, t.options.draggable)), o = Za(t.el, t.options, se), s = 10;
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
  find: Ya,
  is: function(l, t) {
    return !!Je(l, t, l, !1);
  },
  extend: cn,
  throttle: Ha,
  closest: Je,
  toggleClass: ze,
  clone: Ja,
  index: qe,
  nextTick: cl,
  cancelNextTick: Kl,
  detectDirection: _a,
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
      this.sortable.nativeDraggable ? ve(document, "dragover", this._handleAutoScroll) : (ve(document, "pointermove", this._handleFallbackAutoScroll), ve(document, "touchmove", this._handleFallbackAutoScroll), ve(document, "mousemove", this._handleFallbackAutoScroll)), xa(), vl(), vn();
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
        Yl && (!Yt || s !== Ml || v !== Fl) && (Yt && xa(), Yt = setInterval(function() {
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
function xa() {
  clearInterval(Yt);
}
var Ll = Ha(function(e, l, t, a) {
  if (l.scroll) {
    var o = (e.touches ? e.touches[0] : e).clientX, s = (e.touches ? e.touches[0] : e).clientY, v = l.scrollSensitivity, f = l.scrollSpeed, m = _e(), i = !1, n;
    Gl !== t && (Gl = t, vl(), Gt = l.scroll, n = l.scrollFn, Gt === !0 && (Gt = mt(t, !0)));
    var u = 0, y = Gt;
    do {
      var p = y, $ = Ue(p), C = $.top, D = $.bottom, T = $.left, Y = $.right, F = $.width, O = $.height, S = void 0, B = void 0, M = p.scrollWidth, te = p.scrollHeight, oe = ie(p), q = p.scrollLeft, P = p.scrollTop;
      p === m ? (S = F < M && (oe.overflowX === "auto" || oe.overflowX === "scroll" || oe.overflowX === "visible"), B = O < te && (oe.overflowY === "auto" || oe.overflowY === "scroll" || oe.overflowY === "visible")) : (S = F < M && (oe.overflowX === "auto" || oe.overflowX === "scroll"), B = O < te && (oe.overflowY === "auto" || oe.overflowY === "scroll"));
      var R = S && (Math.abs(Y - o) <= v && q + F < M) - (Math.abs(T - o) <= v && !!q), k = B && (Math.abs(D - s) <= v && P + O < te) - (Math.abs(C - s) <= v && !!P);
      if (!Ee[u])
        for (var V = 0; V <= u; V++)
          Ee[V] || (Ee[V] = {});
      (Ee[u].vx != R || Ee[u].vy != k || Ee[u].el !== p) && (Ee[u].el = p, Ee[u].vx = R, Ee[u].vy = k, clearInterval(Ee[u].pid), (R != 0 || k != 0) && (i = !0, Ee[u].pid = setInterval(function() {
        a && this.layer === 0 && ne.active._onTouchMove(yl);
        var I = Ee[this.layer].vy ? Ee[this.layer].vy * f : 0, A = Ee[this.layer].vx ? Ee[this.layer].vx * f : 0;
        typeof n == "function" && n.call(ne.dragged.parentNode[Fe], A, I, e, yl, Ee[this.layer].el) !== "continue" || Xa(Ee[this.layer].el, A, I);
      }.bind({
        layer: u
      }), 24))), u++;
    } while (l.bubbleScroll && y !== m && (y = mt(y, !1)));
    Yl = i;
  }
}, 30), ao = function(l) {
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
  drop: ao
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
  drop: ao
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
function oo(e) {
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
}, Wn = /* @__PURE__ */ ce({
  __name: "OptionsEditor",
  props: {
    field: {}
  },
  emits: ["validity"],
  setup(e, { emit: l }) {
    const t = e, a = l, o = "options:" + Xl(), s = H(() => t.field.options ?? []), v = H(() => s.value.every((u, y) => !!u.id && s.value.findIndex((p) => p.id === u.id) === y));
    xe(v, (u) => a("validity", u, o), { immediate: !0 }), it(() => a("validity", !0, o));
    function f(u, y) {
      Ma(s.value, u, y - u), s.value.forEach((p, $) => p.order = $);
    }
    const m = oo(f), i = ["primary", "success", "info", "warn", "danger", "secondary"];
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
        (c(!0), g(Z, null, le(s.value, (p, $) => (c(), g("div", {
          key: $,
          class: "work-option-row work-reorder-entry"
        }, [
          b(r(X), {
            type: "button",
            class: "work-icon-button work-reorder-handle",
            "aria-label": "Drag option; arrow keys reorder",
            onKeydown: [
              Ae(be((C) => f($, $ - 1), ["prevent"]), ["up"]),
              Ae(be((C) => f($, $ + 1), ["prevent"]), ["down"])
            ],
            severity: "secondary",
            text: "",
            size: "small"
          }, {
            default: L(() => [
              b(r(Q), {
                icon: "tabler:grip-vertical",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["onKeydown"]),
          d("label", Rn, [
            y[0] || (y[0] = N("Label", -1)),
            b(r(ue), {
              modelValue: p.label,
              "onUpdate:modelValue": (C) => p.label = C,
              "aria-label": "Option label"
            }, null, 8, ["modelValue", "onUpdate:modelValue"])
          ]),
          d("label", On, [
            y[1] || (y[1] = N("ID", -1)),
            b(r(ue), {
              modelValue: p.id,
              "onUpdate:modelValue": (C) => p.id = C,
              class: "work-option-code",
              required: "",
              "aria-label": "Option ID"
            }, null, 8, ["modelValue", "onUpdate:modelValue"])
          ]),
          d("div", Nn, [
            d("label", Mn, [
              y[2] || (y[2] = N("Color", -1)),
              d("span", Fn, [
                d("span", {
                  class: ft(["work-color-swatch", "work-swatch-" + (p.color || "secondary")]),
                  "aria-hidden": "true"
                }, null, 2),
                b(r(ae), {
                  modelValue: p.color,
                  "onUpdate:modelValue": (C) => p.color = C,
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
              y[3] || (y[3] = N("Category", -1)),
              b(r(ae), {
                "model-value": p.category,
                "aria-label": "Option category",
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                showClear: "",
                options: ["triage", "backlog", ...r(Na)].map((C) => ({ label: r(Zl)(C), value: C })),
                "onUpdate:modelValue": (C) => p.category = C || void 0
              }, null, 8, ["model-value", "options", "onUpdate:modelValue"])
            ])
          ]),
          d("div", zn, [
            b(r(X), {
              "aria-label": "Option earlier",
              severity: "secondary",
              size: "small",
              disabled: $ === 0,
              onClick: (C) => f($, $ - 1),
              text: ""
            }, {
              default: L(() => [
                b(r(Q), {
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
              disabled: $ === s.value.length - 1,
              onClick: (C) => f($, $ + 1),
              text: ""
            }, {
              default: L(() => [
                b(r(Q), {
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
              onClick: (C) => s.value.splice($, 1)
            }, {
              icon: L(() => [
                b(r(Q), {
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
          b(r(X), {
            label: "Add option",
            severity: "secondary",
            size: "small",
            onClick: n,
            outlined: ""
          }, {
            icon: L(() => [
              b(r(Q), {
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
function ia(e) {
  return Object.entries(Ke(e.properties)).map(([l, t]) => {
    const a = Ke(t);
    return { key: l, title: typeof a.title == "string" && a.title.trim() ? a.title : ge(l), description: typeof a.description == "string" ? a.description : "", schema: a };
  });
}
const io = (e) => e.type === "array" && Ke(e.items).type === "string";
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
}, na = /* @__PURE__ */ ce({
  __name: "ConfigForm",
  props: {
    schema: {},
    modelValue: {},
    disabled: { type: Boolean }
  },
  emits: ["update:modelValue", "validity"],
  setup(e, { emit: l }) {
    const t = e, a = l, o = z({}), s = z(/* @__PURE__ */ new Set()), v = z(!1), f = z(!1), m = H(() => ia(t.schema)), i = H(() => Kn(t.schema, t.modelValue)), n = H(() => m.value.filter((S) => typeof S.schema.picker == "string")), u = H(() => m.value.filter((S) => typeof S.schema.picker != "string")), y = H(() => ({ ...t.schema, properties: Object.fromEntries(n.value.map((S) => [S.key, { ...S.schema, title: S.title }])), required: Array.isArray(t.schema.required) ? t.schema.required.filter((S) => n.value.some((B) => B.key === S)) : [] })), p = H(() => Object.fromEntries(n.value.map((S) => [S.key, t.modelValue[S.key]]))), $ = H(() => !Object.keys(i.value).length && !s.value.size && (!n.value.length || v.value));
    xe($, (S) => a("validity", S), { immediate: !0 });
    async function C() {
      f.value = !0, v.value = await tt("wc-schema-form"), f.value = !1;
    }
    xe(() => n.value.length > 0, (S) => {
      S && C();
    }, { immediate: !0 }), it(() => a("validity", !0));
    function D(S, B) {
      const M = { ...t.modelValue };
      B == null ? delete M[S] : M[S] = B, a("update:modelValue", M);
    }
    function T(S) {
      const B = t.modelValue[S];
      return Array.isArray(B) ? B.filter((M) => typeof M == "string") : [];
    }
    function Y(S) {
      const B = o.value[S]?.trim();
      B && (D(S, [...T(S), B]), o.value[S] = "");
    }
    function F(S, B) {
      B ? s.value.delete(S) : s.value.add(S);
    }
    function O(S) {
      a("update:modelValue", { ...t.modelValue, ...Ke(S.detail) });
    }
    return (S, B) => (c(), g("div", Gn, [
      n.value.length && v.value ? (c(), g("wc-schema-form", {
        key: 0,
        class: "work-config-widget",
        schema: JSON.stringify(y.value),
        config: JSON.stringify(p.value),
        onConfigChanged: O
      }, null, 40, Yn)) : n.value.length && f.value ? (c(), g("p", Hn, "The configuration widget is loading.")) : n.value.length ? (c(), g("p", Xn, [
        B[0] || (B[0] = N("The configuration widget is unavailable.", -1)),
        b(r(X), {
          label: "Reload configuration widget",
          severity: "secondary",
          outlined: "",
          onClick: C
        })
      ])) : E("", !0),
      d("div", Jn, [
        (c(!0), g(Z, null, le(u.value, (M) => (c(), g("div", {
          key: M.key,
          class: "work-config-field"
        }, [
          d("label", {
            class: "work-config-label",
            for: "config-" + M.key
          }, U(M.title), 9, Zn),
          Array.isArray(M.schema.enum) ? (c(), j(r(ae), {
            key: 0,
            "input-id": "config-" + M.key,
            "model-value": e.modelValue[M.key] ?? M.schema.default,
            options: M.schema.enum,
            appendTo: "self",
            "aria-label": M.title,
            disabled: e.disabled,
            "onUpdate:modelValue": (te) => D(M.key, te)
          }, null, 8, ["input-id", "model-value", "options", "aria-label", "disabled", "onUpdate:modelValue"])) : r(io)(M.schema) ? (c(), g("div", Qn, [
            (c(!0), g(Z, null, le(T(M.key), (te, oe) => (c(), j(r(zo), {
              key: oe,
              label: te,
              removable: !e.disabled,
              onRemove: (q) => D(M.key, T(M.key).filter((P, R) => R !== oe))
            }, null, 8, ["label", "removable", "onRemove"]))), 128)),
            b(r(ue), {
              id: "config-" + M.key,
              modelValue: o.value[M.key],
              "onUpdate:modelValue": (te) => o.value[M.key] = te,
              "aria-label": "Add " + M.title.toLocaleLowerCase(),
              disabled: e.disabled,
              placeholder: "Type and press Enter",
              onKeydown: Ae(be((te) => Y(M.key), ["stop", "prevent"]), ["enter"]),
              onBlur: (te) => Y(M.key)
            }, null, 8, ["id", "modelValue", "onUpdate:modelValue", "aria-label", "disabled", "onKeydown", "onBlur"])
          ])) : ["integer", "number"].includes(String(M.schema.type)) ? (c(), j(r(Ge), {
            key: 2,
            "input-id": "config-" + M.key,
            "model-value": e.modelValue[M.key] ?? M.schema.default,
            "max-fraction-digits": M.schema.type === "integer" ? 0 : 8,
            "use-grouping": !1,
            "aria-label": M.title,
            disabled: e.disabled,
            invalid: !!i.value[M.key],
            "onUpdate:modelValue": (te) => D(M.key, te)
          }, null, 8, ["input-id", "model-value", "max-fraction-digits", "aria-label", "disabled", "invalid", "onUpdate:modelValue"])) : M.schema.type === "boolean" ? (c(), j(r(Le), {
            key: 3,
            "input-id": "config-" + M.key,
            "model-value": !!(e.modelValue[M.key] ?? M.schema.default),
            "aria-label": M.title,
            disabled: e.disabled,
            "onUpdate:modelValue": (te) => D(M.key, te)
          }, null, 8, ["input-id", "model-value", "aria-label", "disabled", "onUpdate:modelValue"])) : ["array", "object"].includes(String(M.schema.type)) ? (c(), j(at, {
            key: 4,
            label: M.title,
            "model-value": e.modelValue[M.key],
            shape: M.schema.type === "array" ? "array" : "object",
            example: M.schema.default ?? (M.schema.type === "array" ? [] : {}),
            "onUpdate:modelValue": (te) => D(M.key, te),
            onValidity: (te) => F(M.key, te)
          }, null, 8, ["label", "model-value", "shape", "example", "onUpdate:modelValue", "onValidity"])) : (c(), j(r(ue), {
            key: 5,
            id: "config-" + M.key,
            "model-value": e.modelValue[M.key] ?? M.schema.default ?? "",
            disabled: e.disabled,
            invalid: !!i.value[M.key],
            "aria-label": M.title,
            "onUpdate:modelValue": (te) => D(M.key, te)
          }, null, 8, ["id", "model-value", "disabled", "invalid", "aria-label", "onUpdate:modelValue"])),
          M.description ? (c(), g("p", _n, U(M.description), 1)) : E("", !0),
          i.value[M.key] ? (c(), g("p", es, U(i.value[M.key]), 1)) : E("", !0)
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
}, gs = { class: "work-stack work-tight" }, ks = { class: "work-stack work-tight" }, ws = { class: "work-stack work-tight" }, Vs = { class: "work-stack work-tight" }, $s = { class: "work-stack" }, xs = { class: "work-row work-add-definition" }, Cs = { class: "work-stack work-tight" }, Ss = /* @__PURE__ */ ce({
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
    const t = e, a = l, o = H(() => t.draft.fields ?? []), s = z(""), v = z(""), f = z({}), m = oo((R, k) => oe(R, k - R));
    function i(R) {
      return (t.draft.item_types ?? []).filter((k) => k.fields.includes(R)).map((k) => k.title || ge(k.id));
    }
    async function n(R) {
      if (!v.value) {
        v.value = R.code;
        try {
          const k = await t.guardRemoval?.("fields", R.code);
          f.value[R.code] = k ?? "", k || _t(t.draft, "fields", R.code);
        } finally {
          v.value = "";
        }
      }
    }
    const u = Object.entries({ text: "Text", int: "Whole number", dec: "Decimal number", quantity: "Measurement", bool: "Yes or no", time: "Date or time", ref: "Reference", record: "Structured data", option: "Choice", principal: "Person or group", item: "Work item", rank: "Order", rich_text: "Formatted text", formula: "Formula", rollup: "Related item calculation", counter: "Counter" }).map(([R, k]) => ({ value: R, label: k })), y = [{ label: "None", value: "none" }, { label: "Exact matches", value: "key" }, { label: "Numeric ranges", value: "number" }], p = ["int", "dec", "quantity"], $ = H(() => new Map(t.installedTypes?.map((R) => [R.id, R]))), C = H(() => [...u, ...(t.installedTypes ?? []).map((R) => ({ value: R.id, label: R.title }))]), D = {};
    function T(R) {
      return R.type && R.type !== "value" ? R.type : R.form ?? "text";
    }
    function Y(R) {
      return R.type ? $.value.get(R.type) : void 0;
    }
    function F(R) {
      const k = Y(R)?.config_schema;
      return k && ia(k).length ? k : void 0;
    }
    function O(R) {
      const k = Y(R);
      return !!k?.config_schema || ["dec", "quantity", "ref", "time", "record"].includes(k?.form ?? R.form ?? "") || !!R.config;
    }
    function S(R) {
      const k = Y(R), V = k?.form ?? R.form ?? "text";
      return y.filter(({ value: I }) => I === "none" || (!k?.indexes || k.indexes.includes(I)) && V !== "record" && (I !== "number" || p.includes(V) || R.type === "option"));
    }
    function B(R) {
      R.index && !S(R).some((k) => k.value === R.index) && delete R.index;
    }
    function M(R, k) {
      const V = $.value.get(k);
      if (V) {
        if (V.id === R.type) return;
        R.type = V.id, R.form = V.form, delete R.options, delete R.config, B(R);
        return;
      }
      Y(R) && delete R.config;
      const I = { option: "text", principal: "ref", item: "ref", rank: "text", rich_text: "text", formula: "int", rollup: "int", counter: "int" };
      I[k] ? (R.type = k, R.form = I[k]) : (delete R.type, R.form = k), k !== "option" ? delete R.options : R.options ??= [], k === "rich_text" && (R.config = { format: "json" }), B(R);
    }
    function te(R, k) {
      R.form = k, B(R);
    }
    function oe(R, k) {
      Ma(o.value, R, k);
      for (const V of t.draft.item_types ?? []) {
        const I = new Set(V.fields);
        V.fields = o.value.filter((A) => I.has(A.code)).map((A) => A.code);
      }
    }
    function q(R, k) {
      try {
        xo(t.draft, R, k.value), delete f.value[R.code];
      } catch (V) {
        f.value[R.code] = V.message, k.value = R.code;
      }
    }
    function P() {
      !/^[a-z][a-z0-9_]*$/.test(s.value) || o.value.some((R) => R.code === s.value) || ((t.draft.fields ??= []).push({ code: s.value, form: "text", cardinality: "one" }), s.value = "");
    }
    return (R, k) => (c(), g("section", ts, [
      d("header", ls, [
        k[2] || (k[2] = d("div", null, [
          d("h2", null, "Fields"),
          d("p", { class: "work-muted work-small" }, "Shape the information each item carries. Drag the handle or use the arrows to arrange fields.")
        ], -1)),
        b(r(Re), {
          class: "kx-tag-sm",
          severity: "secondary"
        }, {
          default: L(() => [
            N(U(o.value.length) + " " + U(o.value.length === 1 ? "field" : "fields"), 1)
          ]),
          _: 1
        })
      ]),
      Qe((c(), j($l, {
        columns: "fields",
        count: o.value.length
      }, {
        default: L(() => [
          (c(!0), g(Z, null, le(o.value, (V, I) => (c(), j(Vl, {
            title: r(Ct)(V),
            code: V.code,
            kind: Y(V)?.title || r(u).find((A) => A.value === T(V))?.label || r(ge)(T(V)),
            key: V.id ?? I,
            class: "work-field-row work-reorder-entry work-stack"
          }, {
            handle: L(() => [
              b(r(X), {
                type: "button",
                class: "work-reorder-handle work-icon-button",
                "aria-label": "Drag " + V.code + "; arrow keys reorder",
                onKeydown: [
                  Ae(be((A) => oe(I, -1), ["prevent"]), ["up"]),
                  Ae(be((A) => oe(I, 1), ["prevent"]), ["down"])
                ],
                severity: "secondary",
                text: "",
                size: "small"
              }, {
                default: L(() => [
                  b(r(Q), {
                    icon: "tabler:grip-vertical",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["aria-label", "onKeydown"])
            ]),
            flags: L(() => [
              V.track ? (c(), j(r(Re), {
                key: 0,
                class: "kx-tag-sm",
                severity: "secondary",
                value: "Tracked"
              })) : E("", !0),
              V.intervals ? (c(), j(r(Re), {
                key: 1,
                class: "kx-tag-sm",
                severity: "secondary",
                value: "Intervals"
              })) : E("", !0)
            ]),
            usage: L(() => [
              i(V.code).length ? (c(), g("details", as, [
                d("summary", os, "Used by " + U(i(V.code).length) + " " + U(i(V.code).length === 1 ? "type" : "types"), 1),
                d("span", is, U(i(V.code).join(", ")), 1)
              ])) : E("", !0)
            ]),
            actions: L(() => [
              b(r(X), {
                "aria-label": "Move " + V.code + " earlier",
                severity: "secondary",
                disabled: I === 0,
                onClick: (A) => oe(I, -1),
                text: "",
                size: "small"
              }, {
                default: L(() => [
                  b(r(Q), {
                    icon: "tabler:arrow-up",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["aria-label", "disabled", "onClick"]),
              b(r(X), {
                "aria-label": "Move " + V.code + " later",
                severity: "secondary",
                disabled: I === o.value.length - 1,
                onClick: (A) => oe(I, 1),
                text: "",
                size: "small"
              }, {
                default: L(() => [
                  b(r(Q), {
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
                onClick: (A) => n(V),
                "aria-label": "Remove field"
              }, {
                default: L(() => [
                  b(r(Q), {
                    icon: "tabler:trash",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["disabled", "onClick"])
            ]),
            default: L(() => [
              f.value[V.code] ? (c(), g("p", ns, U(f.value[V.code]), 1)) : E("", !0),
              (c(!0), g(Z, null, le(e.issues?.filter((A) => A.code === V.code) ?? [], (A) => (c(), g("p", {
                key: A.what,
                class: "work-error work-small",
                role: "alert"
              }, U(r(wl)(A)) + " · " + U(A.what), 1))), 128)),
              d("div", ss, [
                d("label", rs, [
                  k[3] || (k[3] = N("Title", -1)),
                  b(r(ue), {
                    modelValue: V.title,
                    "onUpdate:modelValue": (A) => V.title = A,
                    "aria-label": "Field title",
                    maxlength: "255",
                    placeholder: r(Ct)(V)
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder"])
                ]),
                d("label", ds, [
                  k[4] || (k[4] = N("Field identifier", -1)),
                  b(r(ue), {
                    value: V.code,
                    "aria-label": "Field code",
                    required: "",
                    pattern: "[a-z][a-z0-9_]*",
                    onInput: (A) => q(V, A.target)
                  }, null, 8, ["value", "onInput"])
                ]),
                d("label", us, [
                  k[5] || (k[5] = N("Kind", -1)),
                  b(r(ae), {
                    "aria-label": "Kind",
                    "model-value": T(V),
                    "onUpdate:modelValue": (A) => M(V, A),
                    appendTo: "self",
                    options: C.value,
                    optionLabel: "label",
                    optionValue: "value"
                  }, null, 8, ["model-value", "onUpdate:modelValue", "options"])
                ]),
                d("label", cs, [
                  k[6] || (k[6] = N("Values allowed", -1)),
                  b(r(ae), {
                    "aria-label": "Values allowed",
                    "model-value": V.cardinality ?? "one",
                    "onUpdate:modelValue": (A) => V.cardinality = A,
                    appendTo: "self",
                    options: [{ label: "One value", value: "one" }, { label: "Multiple unique values", value: "set" }, { label: "Ordered values", value: "list" }],
                    optionLabel: "label",
                    optionValue: "value"
                  }, null, 8, ["model-value", "onUpdate:modelValue"])
                ]),
                d("label", vs, [
                  k[7] || (k[7] = N("Search support", -1)),
                  b(r(ae), {
                    "aria-label": "Search support",
                    "model-value": V.index ?? "none",
                    "onUpdate:modelValue": (A) => V.index = A,
                    appendTo: "self",
                    options: S(V),
                    optionLabel: "label",
                    optionValue: "value"
                  }, null, 8, ["model-value", "onUpdate:modelValue", "options"])
                ])
              ]),
              F(V) ? (c(), j(na, {
                key: V.type,
                schema: F(V),
                "model-value": V.config ?? D,
                "onUpdate:modelValue": (A) => V.config = A,
                onValidity: (A) => a("validity", "config-" + I, A)
              }, null, 8, ["schema", "model-value", "onUpdate:modelValue", "onValidity"])) : E("", !0),
              d("section", ms, [
                k[10] || (k[10] = d("h4", { class: "work-group-title" }, "History", -1)),
                d("div", fs, [
                  d("div", ps, [
                    k[8] || (k[8] = d("div", { class: "work-row-main" }, [
                      d("strong", null, "Track changes"),
                      d("p", { class: "work-muted work-small" }, "Record each value change in the item history.")
                    ], -1)),
                    b(r(Le), {
                      modelValue: V.track,
                      "onUpdate:modelValue": (A) => V.track = A,
                      "aria-label": "Track changes"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ]),
                  d("div", bs, [
                    k[9] || (k[9] = d("div", { class: "work-row-main" }, [
                      d("strong", null, "Track intervals"),
                      d("p", { class: "work-muted work-small" }, "Measure how long each value stays in effect.")
                    ], -1)),
                    b(r(Le), {
                      modelValue: V.intervals,
                      "onUpdate:modelValue": (A) => V.intervals = A,
                      "aria-label": "Track intervals"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ])
                ])
              ]),
              V.type === "option" ? (c(), j(Wn, {
                key: 2,
                field: V,
                onValidity: k[0] || (k[0] = (A, re) => a("validity", re, A))
              }, null, 8, ["field"])) : E("", !0),
              V.type === "formula" || V.type === "rollup" ? (c(), g("label", hs, [
                k[11] || (k[11] = N("Result type", -1)),
                b(r(ae), {
                  "model-value": V.form,
                  "onUpdate:modelValue": (A) => te(V, A),
                  "aria-label": "Result type",
                  options: r(u).slice(0, 8),
                  optionLabel: "label",
                  optionValue: "value",
                  appendTo: "self"
                }, null, 8, ["model-value", "onUpdate:modelValue", "options"])
              ])) : E("", !0),
              V.type === "formula" ? (c(), g("label", ys, [
                k[12] || (k[12] = N("Expression", -1)),
                b(r(ue), {
                  modelValue: V.expression,
                  "onUpdate:modelValue": (A) => V.expression = A
                }, null, 8, ["modelValue", "onUpdate:modelValue"])
              ])) : E("", !0),
              V.type === "rollup" ? (c(), g(Z, { key: 5 }, [
                d("label", gs, [
                  k[13] || (k[13] = N("Of", -1)),
                  b(r(ue), {
                    modelValue: V.of,
                    "onUpdate:modelValue": (A) => V.of = A
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                d("label", ks, [
                  k[14] || (k[14] = N("Function", -1)),
                  b(r(ue), {
                    modelValue: V.fn,
                    "onUpdate:modelValue": (A) => V.fn = A
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                d("label", ws, [
                  k[15] || (k[15] = N("Field", -1)),
                  b(r(ue), {
                    modelValue: V.field,
                    "onUpdate:modelValue": (A) => V.field = A
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                d("label", Vs, [
                  k[16] || (k[16] = N("Order by", -1)),
                  b(r(ae), {
                    "model-value": V.by,
                    "aria-label": "Rollup order",
                    options: ["rank", "time"],
                    showClear: "",
                    appendTo: "self",
                    "onUpdate:modelValue": (A) => V.by = A || void 0
                  }, null, 8, ["model-value", "onUpdate:modelValue"])
                ]),
                b(_l, {
                  modelValue: V.where,
                  "onUpdate:modelValue": (A) => V.where = A,
                  draft: e.draft,
                  "board-id": e.boardId,
                  label: "Include related items when",
                  onValidity: (A) => a("validity", "rollup-" + I, A)
                }, null, 8, ["modelValue", "onUpdate:modelValue", "draft", "board-id", "onValidity"])
              ], 64)) : E("", !0),
              !F(V) && O(V) ? (c(), j(at, {
                key: 6,
                label: "Field configuration",
                "model-value": V.config,
                shape: "object",
                "onUpdate:modelValue": (A) => V.config = A,
                onValidity: (A) => a("validity", "config-" + I, A)
              }, null, 8, ["model-value", "onUpdate:modelValue", "onValidity"])) : E("", !0),
              d("section", $s, [
                k[17] || (k[17] = d("h4", { class: "work-group-title" }, "Access", -1)),
                (c(), g(Z, null, le(["read", "write"], (A) => b(qa, {
                  "board-id": e.boardId,
                  key: A,
                  label: A === "read" ? "Who can read" : "Who can edit",
                  "model-value": V.access?.[A],
                  "onUpdate:modelValue": (re) => V.access = { ...V.access, [A]: re },
                  onValidity: (re) => a("validity", "access-" + I + A, re)
                }, null, 8, ["board-id", "label", "model-value", "onUpdate:modelValue", "onValidity"])), 64))
              ])
            ]),
            _: 2
          }, 1032, ["title", "code", "kind"]))), 128)),
          d("div", xs, [
            d("label", Cs, [
              k[18] || (k[18] = N("New field identifier", -1)),
              b(r(ue), {
                modelValue: s.value,
                "onUpdate:modelValue": k[1] || (k[1] = (V) => s.value = V),
                onKeydown: Ae(be(P, ["prevent"]), ["enter"])
              }, null, 8, ["modelValue", "onKeydown"])
            ]),
            b(r(X), {
              label: "Add field",
              severity: "secondary",
              disabled: !s.value.trim(),
              onClick: P,
              outlined: ""
            }, {
              icon: L(() => [
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
        [r(m)]
      ])
    ]));
  }
}), Ts = ["disabled"], Es = { class: "work-chips" }, Us = {
  key: 1,
  class: "work-muted work-small"
}, Lt = /* @__PURE__ */ ce({
  __name: "ChipPicker",
  props: {
    label: {},
    options: {},
    modelValue: {},
    disabled: { type: Boolean }
  },
  emits: ["update:modelValue"],
  setup(e, { emit: l }) {
    const t = e, a = l, o = z(""), s = H(() => t.options.map((m) => typeof m == "string" ? { value: m } : m)), v = H(() => s.value.filter((m) => (m.label ?? ge(m.value)).toLocaleLowerCase().includes(o.value.toLocaleLowerCase())));
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
      e.options.length > 10 ? (c(), j(r(ue), {
        key: 0,
        modelValue: o.value,
        "onUpdate:modelValue": i[0] || (i[0] = (n) => o.value = n),
        type: "search",
        "aria-label": "Find " + e.label.toLowerCase(),
        placeholder: "Find a choice…"
      }, null, 8, ["modelValue", "aria-label"])) : E("", !0),
      d("div", Es, [
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
        (c(!0), g(Z, null, le(e.modelValue?.filter((n) => !s.value.some((u) => u.value === n)) ?? [], (n) => (c(), j(r(X), {
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
            N(U(r(ge)(n)) + " · unavailable ×", 1)
          ]),
          _: 2
        }, 1032, ["aria-label", "onClick"]))), 128))
      ]),
      e.options.length ? E("", !0) : (c(), g("span", Us, "No choices declared."))
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
}, Ws = /* @__PURE__ */ ce({
  __name: "TypesEditor",
  props: {
    draft: {},
    guardRemoval: { type: Function },
    issues: {}
  },
  setup(e) {
    const l = e, t = H(() => l.draft.item_types ?? []), a = z(""), o = z(""), s = z(""), v = H(() => /^[a-z][a-z0-9_]*$/.test(a.value) && !t.value.some((y) => y.id === a.value));
    function f() {
      v.value && ((l.draft.item_types ??= []).push({ id: a.value, title: ge(a.value), process: l.draft.processes?.[0]?.id ?? "", fields: [] }), a.value = "");
    }
    function m(y, p) {
      const $ = y.id;
      y.id = p;
      for (const C of t.value) C.parent_types && (C.parent_types = C.parent_types.map((D) => D === $ ? p : D));
    }
    function i(y, p) {
      y.fields = p, y.inherit && (y.inherit = y.inherit.filter(($) => p.includes($)));
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
            N(U(t.value.length) + " " + U(t.value.length === 1 ? "type" : "types"), 1)
          ]),
          _: 1
        })
      ]),
      o.value ? (c(), g("p", As, U(o.value), 1)) : E("", !0),
      b($l, {
        columns: "types",
        count: t.value.length
      }, {
        default: L(() => [
          (c(!0), g(Z, null, le(t.value, ($, C) => (c(), j(Vl, {
            title: $.title || r(ge)($.id),
            code: $.id,
            kind: e.draft.processes?.find((D) => D.id === $.process)?.name || r(ge)($.process),
            key: C,
            class: "work-type-card"
          }, {
            usage: L(() => [
              d("span", Ps, [
                b(r(Re), {
                  class: "kx-tag-sm",
                  severity: "secondary"
                }, {
                  default: L(() => [
                    N(U($.fields.length) + " " + U($.fields.length === 1 ? "field" : "fields"), 1)
                  ]),
                  _: 2
                }, 1024),
                n($).length ? (c(), j(r(Re), {
                  key: 0,
                  class: "kx-tag-sm",
                  severity: "secondary"
                }, {
                  default: L(() => [
                    N("Parent of " + U(n($).join(", ")), 1)
                  ]),
                  _: 2
                }, 1024)) : E("", !0)
              ])
            ]),
            actions: L(() => [
              b(r(X), {
                severity: "secondary",
                text: "",
                size: "small",
                disabled: !!s.value,
                onClick: (D) => u($),
                "aria-label": "Remove type"
              }, {
                default: L(() => [
                  b(r(Q), {
                    icon: "tabler:trash",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["disabled", "onClick"])
            ]),
            default: L(() => [
              (c(!0), g(Z, null, le(e.issues?.filter((D) => D.code === "item_type " + $.id) ?? [], (D) => (c(), g("p", {
                key: D.what,
                class: "work-error work-small",
                role: "alert"
              }, U(r(wl)(D)), 1))), 128)),
              d("div", Rs, [
                d("label", Os, [
                  p[2] || (p[2] = N("Identifier", -1)),
                  b(r(ue), {
                    value: $.id,
                    onChange: (D) => m($, D.target.value),
                    required: "",
                    pattern: "[a-z][a-z0-9_]*"
                  }, null, 8, ["value", "onChange"])
                ]),
                d("label", Ns, [
                  p[3] || (p[3] = N("Title", -1)),
                  b(r(ue), {
                    modelValue: $.title,
                    "onUpdate:modelValue": (D) => $.title = D,
                    placeholder: r(ge)($.id)
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder"])
                ]),
                d("label", Ms, [
                  p[4] || (p[4] = N("Process", -1)),
                  b(r(ae), {
                    modelValue: $.process,
                    "onUpdate:modelValue": (D) => $.process = D,
                    required: "",
                    appendTo: "self",
                    optionLabel: "label",
                    optionValue: "value",
                    optionDisabled: "disabled",
                    options: [...(e.draft.processes ?? []).map((D) => ({ label: D.name || r(ge)(D.id), value: D.id, disabled: !1 }))]
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                ])
              ]),
              b(Lt, {
                label: "Fields",
                options: (e.draft.fields ?? []).map((D) => ({ value: D.code, label: r(Ct)(D) })),
                "model-value": $.fields,
                "onUpdate:modelValue": (D) => i($, D)
              }, null, 8, ["options", "model-value", "onUpdate:modelValue"]),
              b(Lt, {
                label: "Parent types",
                options: t.value.map((D) => ({ value: D.id, label: D.title || r(ge)(D.id) })),
                modelValue: $.parent_types,
                "onUpdate:modelValue": (D) => $.parent_types = D
              }, null, 8, ["options", "modelValue", "onUpdate:modelValue"]),
              d("div", Fs, [
                b(Lt, {
                  label: "Inherit from parent",
                  options: $.fields.map((D) => ({ value: D, label: r(Ct)(e.draft.fields?.find((T) => T.code === D) ?? { code: D }) })),
                  modelValue: $.inherit,
                  "onUpdate:modelValue": (D) => $.inherit = D
                }, null, 8, ["options", "modelValue", "onUpdate:modelValue"]),
                p[5] || (p[5] = d("p", { class: "work-muted work-small" }, "These fields resolve from the parent when this item has no own value.", -1))
              ]),
              $.parent_types?.length ? (c(), g("label", Ls, [
                p[6] || (p[6] = N("When the parent moves", -1)),
                b(r(ae), {
                  modelValue: $.move_children,
                  "onUpdate:modelValue": (D) => $.move_children = D,
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
          t.value.length ? E("", !0) : (c(), g("p", zs, "Add an item type to connect fields to a process.")),
          d("div", Bs, [
            d("label", js, [
              p[7] || (p[7] = N("New type identifier", -1)),
              b(r(ue), {
                modelValue: a.value,
                "onUpdate:modelValue": p[0] || (p[0] = ($) => a.value = $),
                placeholder: "new_type",
                onKeydown: Ae(be(f, ["prevent"]), ["enter"])
              }, null, 8, ["modelValue", "onKeydown"])
            ]),
            b(r(X), {
              label: "Add type",
              severity: "secondary",
              disabled: !v.value,
              onClick: f,
              outlined: ""
            }, {
              icon: L(() => [
                b(r(Q), {
                  icon: "tabler:plus",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["disabled"]),
            a.value && !v.value ? (c(), g("span", qs, "Use a unique lowercase identifier with letters, numbers and underscores.")) : E("", !0)
          ])
        ]),
        _: 1
      }, 8, ["count"])
    ]));
  }
}), Ks = ".work-process-canvas>svg{height:480px;width:100%}.work-process-canvas:focus-visible{outline:var(--p-focus-ring-width) var(--p-focus-ring-style) var(--p-focus-ring-color);outline-offset:var(--p-focus-ring-offset)}.work-state-card{fill:var(--p-content-background);stroke:var(--p-content-border-color);stroke-width:1.5}.work-graph-node.work-selected .work-state-card{stroke:var(--p-primary-color);stroke-width:2.5;fill:color-mix(in srgb,var(--p-primary-color) 6%,var(--p-content-background))}.work-graph-node:focus-visible .work-state-card{stroke:var(--p-focus-ring-color);stroke-width:var(--p-focus-ring-width)}.work-process-canvas .work-edge-label{font-size:12px;fill:var(--p-text-color)}.work-process-canvas .work-edge-label-bg{fill:var(--p-content-background);stroke:var(--p-content-border-color);stroke-width:1}.work-edge-line{stroke:var(--p-primary-color);stroke-width:1.5}.work-edge-return .work-edge-line{stroke:var(--p-text-muted-color);stroke-dasharray:5 4}.work-graph-arrow{fill:context-stroke}.work-lane-line{fill:none;stroke:var(--p-text-muted-color);stroke-width:1.5;stroke-dasharray:2 4}.work-node-connector{fill:var(--p-content-background);stroke:var(--p-primary-color);stroke-width:1.5}.work-node-connector:hover,.work-node-connector:focus-visible{fill:var(--p-primary-color)}.work-process-legend{position:static;flex-wrap:wrap;padding:10px 16px;border-top:1px solid var(--p-content-border-color);background:var(--p-content-background)}@media(max-width:700px){.work-process-canvas>svg{height:420px}}.work-process-more{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:8px;padding:8px 16px;border-top:1px solid var(--p-content-border-color);background:var(--p-content-background);color:var(--p-text-muted-color);font-size:12px}.work-process-canvas .work-graph-edge.work-selected .work-edge-label-bg{fill:var(--p-primary-color);stroke:var(--p-primary-color)}.work-process-canvas .work-graph-edge.work-selected .work-edge-label{fill:var(--p-primary-contrast-color)}", Ca = /* @__PURE__ */ new WeakSet();
function Gs(e) {
  const l = e.getRootNode();
  if (l instanceof ShadowRoot && !Ca.has(l)) {
    const t = e.ownerDocument.createElement("style");
    t.textContent = Ks, l.append(t), Ca.add(l);
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
}, kr = { class: "work-process-legend" }, wr = /* @__PURE__ */ ce({
  __name: "ProcessGraph",
  props: {
    process: {},
    draft: {},
    selectedState: {},
    selectedTransition: {}
  },
  emits: ["state", "transition", "connect", "clear"],
  setup(e, { expose: l, emit: t }) {
    const a = e, o = t, s = Xl().replace(/:/g, "_"), v = z(""), f = z(), m = z(), i = z(900), n = z(!1), u = H(() => i.value < 700 ? 420 : 480), y = H(() => Go(a.process, a.draft, { width: i.value, height: u.value })), p = z(1), $ = z({ x: 0, y: 0 }), C = z({ x: 0, y: 0 }), D = H(() => ({ width: i.value, height: n.value ? Math.max(u.value, y.value.height * Math.min(1, i.value / y.value.width)) : u.value })), T = H(() => y.value.nodes.filter((h) => h.x - h.width / 2 >= $.value.x && h.x + h.width / 2 <= $.value.x + D.value.width / p.value && h.y - h.height / 2 >= $.value.y && h.y + h.height / 2 <= $.value.y + D.value.height / p.value).length);
    function Y() {
      n.value = !1;
      const h = Hs(y.value, D.value, a.process.initial);
      p.value = h.zoom, $.value = h.pan;
    }
    const F = H(() => `${$.value.x} ${$.value.y} ${D.value.width / p.value} ${D.value.height / p.value}`), O = H(() => y.value.nodes.find((h) => h.state.id === v.value));
    function S() {
      n.value = !0, p.value = Math.min(1, D.value.width / y.value.width), $.value = { x: (y.value.width - D.value.width / p.value) / 2, y: 0 };
    }
    function B(h) {
      const x = Math.max(0.02, Math.min(3, p.value * h)), w = 1 / p.value - 1 / x;
      $.value = { x: $.value.x + D.value.width * w / 2, y: $.value.y + D.value.height * w / 2 }, p.value = x;
    }
    function M(h) {
      const x = D.value.width / p.value, w = D.value.height / p.value;
      (h.x - h.width / 2 < $.value.x || h.x + h.width / 2 > $.value.x + x || h.y - h.height / 2 < $.value.y || h.y + h.height / 2 > $.value.y + w) && ($.value = { x: h.x - x / 2, y: h.y - w / 2 });
    }
    function te() {
      const h = y.value.nodes.find((x) => x.state === a.selectedState) ?? y.value.edges.find((x) => x.transition === a.selectedTransition);
      h && M(h);
    }
    xe([y, () => a.selectedState, () => a.selectedTransition], te, { flush: "post" }), xe(() => a.process.id, () => {
      v.value = "", V.clear(), Y();
    }, { flush: "post" });
    function oe(h) {
      if (h.target !== f.value) return;
      (h.key === "+" || h.key === "=") && (h.preventDefault(), B(1.2)), h.key === "-" && (h.preventDefault(), B(1 / 1.2)), h.key === "0" && (h.preventDefault(), S());
      const x = 60 / p.value;
      h.key.startsWith("Arrow") && (h.preventDefault(), $.value = { x: $.value.x + (h.key === "ArrowRight" ? x : h.key === "ArrowLeft" ? -x : 0), y: $.value.y + (h.key === "ArrowDown" ? x : h.key === "ArrowUp" ? -x : 0) });
    }
    function q(h) {
      v.value && v.value !== h.id && o("connect", v.value, h.id), v.value = "";
    }
    function P(h, x) {
      v.value = x.state.id, C.value = { x: x.x, y: x.y };
      const w = h.target;
      w instanceof Element && w.hasPointerCapture?.(h.pointerId) && w.releasePointerCapture(h.pointerId);
    }
    function R(h, x) {
      if ((h.key === "Enter" || h.key === " ") && (h.preventDefault(), v.value ? q(x) : o("state", x)), ["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp"].includes(h.key)) {
        h.preventDefault();
        const w = Array.from(m.value?.querySelectorAll(".work-graph-node") ?? []), W = y.value.nodes.findIndex((de) => de.state === x), J = ["ArrowRight", "ArrowDown"].includes(h.key) ? 1 : -1;
        w[(W + J + w.length) % w.length]?.focus();
      }
    }
    function k() {
      v.value = "", V.clear(), o("clear");
    }
    const V = /* @__PURE__ */ new Map();
    let I = 0;
    function A(h) {
      if (!h.target.closest('[role="button"]') && (V.set(h.pointerId, { x: h.clientX, y: h.clientY }), f.value?.setPointerCapture?.(h.pointerId), V.size === 2)) {
        const [x, w] = [...V.values()];
        I = Math.hypot(x.x - w.x, x.y - w.y);
      }
    }
    function re(h) {
      const x = m.value?.getBoundingClientRect();
      if (!x?.width) return;
      if (v.value) {
        C.value = { x: $.value.x + (h.clientX - x.left) * D.value.width / p.value / x.width, y: $.value.y + (h.clientY - x.top) * D.value.height / p.value / x.height };
        return;
      }
      const w = V.get(h.pointerId);
      if (w)
        if (V.set(h.pointerId, { x: h.clientX, y: h.clientY }), V.size === 2) {
          const [W, J] = [...V.values()], de = Math.hypot(W.x - J.x, W.y - J.y);
          I && B(de / I), I = de;
        } else $.value = { x: $.value.x - (h.clientX - w.x) * D.value.width / p.value / x.width, y: $.value.y - (h.clientY - w.y) * D.value.height / p.value / x.height };
    }
    function pe(h) {
      V.delete(h.pointerId), I = 0, v.value = "";
    }
    function ke(h) {
      h.ctrlKey && (h.preventDefault(), B(Math.exp(-h.deltaY * 0.01)));
    }
    let Ve;
    kl(() => {
      if (f.value && Gs(f.value), typeof ResizeObserver < "u" && m.value) {
        let h = !0;
        Ve = new ResizeObserver(() => {
          const x = m.value?.getBoundingClientRect();
          if (!x?.width || !x.height) return;
          const w = D.value.width;
          i.value = x.width, (h || Math.abs(x.width - w) > 1) && (n.value ? S() : Y(), h = !1), te();
        }), Ve.observe(m.value);
      }
    }), it(() => Ve?.disconnect()), l({ fit: S, zoomIn: () => B(1.2), zoomOut: () => B(1 / 1.2) });
    function De(h) {
      return h.category === "completed" ? "check" : h.category === "canceled" ? "x" : h.id === a.process.initial ? "arrow-bar-to-right" : { gate: "shield-check", automated: "bolt", parallel: "arrows-split" }[h.kind ?? ""] ?? "user";
    }
    return (h, x) => (c(), g("section", {
      ref_key: "canvas",
      ref: f,
      class: "work-process-canvas",
      "aria-label": "Process map",
      tabindex: "0",
      onKeydown: [
        oe,
        Ae(be(k, ["stop"]), ["esc"])
      ],
      onPointerdown: A,
      onPointermove: re,
      onPointerup: pe,
      onPointercancel: k,
      onWheel: ke
    }, [
      v.value ? (c(), g("p", Js, "Choose the next stop. Escape cancels.")) : E("", !0),
      (c(), g("svg", {
        ref_key: "svg",
        ref: m,
        style: bo({ height: D.value.height + "px" }),
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
          }, [...x[1] || (x[1] = [
            d("path", {
              d: "M0 0 L8 4 L0 8 z",
              class: "work-graph-arrow"
            }, null, -1)
          ])], 8, Qs)
        ]),
        (c(!0), g(Z, null, le(y.value.parallels, (w) => (c(), g("path", {
          key: w.key,
          d: w.path,
          class: "work-lane-line",
          "marker-end": `url(#${r(s)}-arrow)`
        }, [
          d("title", null, "Parallel lane from " + U(r(he)(w.state)), 1)
        ], 8, _s))), 128)),
        (c(!0), g(Z, null, le(y.value.edges, (w) => (c(), g("g", {
          key: w.key,
          class: ft(["work-graph-edge", ["work-edge-" + w.type, { "work-selected": e.selectedTransition === w.transition }]]),
          role: "button",
          tabindex: "0",
          "aria-label": "Edit transition " + r(je)(w.transition),
          "aria-pressed": e.selectedTransition === w.transition,
          onFocus: (W) => M(w),
          onClick: (W) => o("transition", w.transition),
          onKeydown: [
            Ae(be((W) => o("transition", w.transition), ["prevent"]), ["enter"]),
            Ae(be((W) => o("transition", w.transition), ["prevent"]), ["space"])
          ]
        }, [
          d("path", {
            d: w.path,
            class: "work-edge-hit"
          }, null, 8, tr),
          d("path", {
            d: w.path,
            class: "work-edge-line",
            "marker-end": `url(#${r(s)}-arrow)`
          }, null, 8, lr),
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
            (c(!0), g(Z, null, le(w.lines, (W, J) => (c(), g("tspan", {
              key: J,
              x: w.x,
              dy: J ? 16 : 0
            }, U(W), 9, ir))), 128))
          ], 8, or)
        ], 42, er))), 128)),
        (c(!0), g(Z, null, le(y.value.nodes, (w) => (c(), g("g", {
          key: w.state.id,
          class: ft(["work-graph-node", ["work-stop-" + w.state.category, { "work-selected": e.selectedState === w.state }]]),
          role: "button",
          tabindex: "0",
          "aria-label": "Edit state " + r(he)(w.state),
          "aria-pressed": e.selectedState === w.state,
          onClick: (W) => o("state", w.state),
          onKeydown: (W) => R(W, w.state),
          onFocus: (W) => M(w),
          onPointerup: be((W) => q(w.state), ["stop"])
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
          b(r(Q), {
            icon: "tabler:" + De(w.state),
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
            (c(!0), g(Z, null, le(w.title, (W, J) => (c(), g("tspan", {
              key: J,
              x: w.x - w.width / 2 + 42,
              dy: J ? 18 : 0
            }, U(W), 9, ur))), 128))
          ], 8, dr),
          d("text", {
            x: w.x - w.width / 2 + 16,
            y: w.y - w.height / 2 + 33 + w.title.length * 18,
            class: "work-node-meta"
          }, [
            (c(!0), g(Z, null, le(w.caption, (W, J) => (c(), g("tspan", {
              key: J,
              x: w.x - w.width / 2 + 16,
              dy: J ? 16 : 0
            }, U(W), 9, vr))), 128)),
            e.draft.policy?.wip?.[w.state.id] ? (c(), g("tspan", mr, " · limit " + U(e.draft.policy.wip[w.state.id].limit), 1)) : E("", !0)
          ], 8, cr),
          (c(!0), g(Z, null, le(w.badges, (W, J) => (c(), g("g", {
            key: W.id,
            class: "work-any-transition",
            role: "button",
            tabindex: "0",
            "aria-label": "Edit transition " + r(je)(W),
            onClick: be((de) => o("transition", W), ["stop"]),
            onKeydown: [
              Ae(be((de) => o("transition", W), ["stop", "prevent"]), ["enter"]),
              Ae(be((de) => o("transition", W), ["stop", "prevent"]), ["space"])
            ]
          }, [
            d("text", {
              x: w.x - w.width / 2 + 16,
              y: w.y - w.height / 2 + 33 + w.title.length * 18 + w.caption.length * 16 + w.badges.slice(0, J).reduce((de, fe) => de + r(Ot)(r(je)(fe) + " works from any state").length * 18, 0),
              class: "work-node-meta"
            }, [
              (c(!0), g(Z, null, le(r(Ot)(r(je)(W) + " works from any state"), (de, fe) => (c(), g("tspan", {
                key: fe,
                x: w.x - w.width / 2 + 16,
                dy: fe ? 18 : 0
              }, U(de), 9, br))), 128))
            ], 8, pr)
          ], 40, fr))), 128)),
          ["completed", "canceled"].includes(w.state.category) ? E("", !0) : (c(), g("circle", {
            key: 0,
            cx: y.value.direction === "TB" ? w.x : w.x + w.width / 2,
            cy: y.value.direction === "TB" ? w.y + w.height / 2 : w.y,
            r: "7",
            class: "work-node-connector",
            role: "button",
            tabindex: "0",
            "aria-label": "Connect from " + r(he)(w.state),
            onPointerdown: be((W) => P(W, w), ["stop", "prevent"]),
            onClick: be((W) => o("state", w.state), ["stop"]),
            onKeydown: [
              Ae(be((W) => {
                v.value = w.state.id, C.value = { x: w.x, y: w.y };
              }, ["stop", "prevent"]), ["enter"]),
              Ae(be((W) => v.value = w.state.id, ["stop", "prevent"]), ["space"])
            ]
          }, null, 40, hr))
        ], 42, nr))), 128)),
        O.value ? (c(), g("path", {
          key: 0,
          d: `M ${y.value.direction === "TB" ? O.value.x : O.value.x + O.value.width / 2} ${y.value.direction === "TB" ? O.value.y + O.value.height / 2 : O.value.y} L ${C.value.x} ${C.value.y}`,
          class: "work-connect-ghost"
        }, null, 8, yr)) : E("", !0)
      ], 12, Zs)),
      !n.value && T.value < e.process.states.length ? (c(), g("div", gr, [
        d("span", null, U(T.value) + " of " + U(e.process.states.length) + " states in view · More " + U(y.value.direction === "TB" ? "below" : "to the right"), 1),
        b(r(X), {
          label: "Show full process",
          size: "small",
          text: "",
          onClick: x[0] || (x[0] = (w) => S())
        })
      ])) : E("", !0),
      d("div", kr, [
        d("span", null, U(e.process.states.length) + " states · " + U(Math.round(p.value * 100)) + "%", 1),
        x[2] || (x[2] = d("span", null, [
          d("i"),
          N("Transition")
        ], -1)),
        x[3] || (x[3] = d("span", null, [
          d("i", { class: "work-return-key" }),
          N("Return / loop")
        ], -1)),
        x[4] || (x[4] = d("span", null, "Drag to pan · Ctrl + scroll to zoom · Fit for full process", -1))
      ])
    ], 40, Xs));
  }
}), Vr = {
  class: "work-process-list work-stack",
  "aria-label": "Process list"
}, $r = { class: "work-stack work-tight" }, xr = { class: "work-table-scroll" }, Cr = { class: "work-settings-table work-process-table" }, Sr = ["aria-selected"], Tr = { class: "work-process-list-actions" }, Er = { class: "work-table-scroll" }, Ur = { class: "work-settings-table work-process-table" }, Dr = ["aria-selected"], Ir = { class: "work-process-list-actions" }, Ar = /* @__PURE__ */ ce({
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
        t[2] || (t[2] = N("Process name", -1)),
        b(r(ue), {
          modelValue: e.process.name,
          "onUpdate:modelValue": t[0] || (t[0] = (a) => e.process.name = a),
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
            (c(!0), g(Z, null, le(e.process.states, (a) => (c(), g("tr", {
              key: a.id,
              "aria-selected": e.selectedState === a
            }, [
              d("td", null, [
                b(r(ue), {
                  modelValue: a.name,
                  "onUpdate:modelValue": (o) => a.name = o,
                  "aria-label": "Name of " + r(he)(a)
                }, null, 8, ["modelValue", "onUpdate:modelValue", "aria-label"])
              ]),
              d("td", null, U(r(Zl)(a.category)), 1),
              d("td", null, [
                b(r(Re), { severity: "secondary" }, {
                  default: L(() => [
                    N(U(r(Fa)(a.kind)), 1)
                  ]),
                  _: 2
                }, 1024)
              ]),
              d("td", Tr, [
                b(r(X), {
                  size: "small",
                  text: "",
                  severity: "secondary",
                  "aria-label": "Edit state",
                  onClick: (o) => l.$emit("state", a)
                }, {
                  default: L(() => [
                    b(r(Q), { icon: "tabler:pencil" })
                  ]),
                  _: 1
                }, 8, ["onClick"]),
                b(r(X), {
                  size: "small",
                  text: "",
                  severity: "danger",
                  "aria-label": "Remove state " + r(he)(a),
                  onClick: (o) => l.$emit("removeState", a)
                }, {
                  default: L(() => [
                    b(r(Q), { icon: "tabler:trash" })
                  ]),
                  _: 1
                }, 8, ["aria-label", "onClick"])
              ])
            ], 8, Sr))), 128))
          ])
        ])
      ]),
      t[6] || (t[6] = d("h3", null, "Transitions", -1)),
      d("div", Er, [
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
            (c(!0), g(Z, null, le(e.process.transitions ?? [], (a) => (c(), g("tr", {
              key: a.id,
              "aria-selected": e.selectedTransition === a
            }, [
              d("td", null, [
                b(r(ue), {
                  modelValue: a.name,
                  "onUpdate:modelValue": (o) => a.name = o,
                  placeholder: r(je)(a),
                  "aria-label": "Name of " + r(je)(a)
                }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder", "aria-label"])
              ]),
              d("td", null, U(a.from === "any" ? "Any state" : a.from.map((o) => r(he)(e.process.states.find((s) => s.id === o))).join(", ")), 1),
              d("td", null, U(r(he)(e.process.states.find((o) => o.id === a.to))), 1),
              d("td", Ir, [
                b(r(X), {
                  size: "small",
                  text: "",
                  severity: "secondary",
                  "aria-label": "Edit transition",
                  onClick: (o) => l.$emit("transition", a)
                }, {
                  default: L(() => [
                    b(r(Q), { icon: "tabler:pencil" })
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
                  default: L(() => [
                    b(r(Q), { icon: "tabler:trash" })
                  ]),
                  _: 1
                }, 8, ["aria-label", "onClick"])
              ])
            ], 8, Dr))), 128))
          ])
        ])
      ]),
      b(r(X), {
        label: "Add transition",
        severity: "secondary",
        outlined: "",
        onClick: t[1] || (t[1] = (a) => l.$emit("addTransition"))
      }, {
        icon: L(() => [
          b(r(Q), { icon: "tabler:plus" })
        ]),
        _: 1
      })
    ]));
  }
}), Pr = { class: "work-stack work-transition-settings" }, Rr = { class: "work-stack work-tight" }, Or = { class: "work-row" }, Nr = { class: "work-row" }, Mr = { class: "work-row" }, Fr = { class: "work-stack work-tight" }, Lr = { class: "work-row" }, zr = { class: "work-stack work-tight" }, Br = { class: "work-stack work-tight" }, jr = /* @__PURE__ */ ce({
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
    return (v, f) => (c(), g("div", Pr, [
      d("label", Rr, [
        f[14] || (f[14] = N("To state", -1)),
        b(r(ae), {
          modelValue: e.transition.to,
          "onUpdate:modelValue": f[0] || (f[0] = (m) => e.transition.to = m),
          "aria-label": "To state",
          appendTo: "self",
          optionLabel: "label",
          optionValue: "value",
          options: e.process.states.map((m) => ({ label: r(he)(m), value: m.id }))
        }, null, 8, ["modelValue", "options"])
      ]),
      d("label", Or, [
        f[15] || (f[15] = d("span", { class: "work-spacer" }, "Happens automatically", -1)),
        b(r(Le), {
          "model-value": e.transition.auto,
          "onUpdate:modelValue": f[1] || (f[1] = (m) => {
            e.transition.auto = m, m || delete e.transition.default;
          }),
          "aria-label": "Automatic transition"
        }, null, 8, ["model-value"])
      ]),
      d("label", Nr, [
        f[16] || (f[16] = d("span", { class: "work-spacer" }, "Default automatic transition", -1)),
        b(r(Le), {
          modelValue: e.transition.default,
          "onUpdate:modelValue": f[2] || (f[2] = (m) => e.transition.default = m),
          disabled: !e.transition.auto,
          "aria-label": "Default transition"
        }, null, 8, ["modelValue", "disabled"])
      ]),
      d("label", Mr, [
        f[17] || (f[17] = d("span", { class: "work-spacer" }, "Works from any state", -1)),
        b(r(Le), {
          "model-value": e.transition.from === "any",
          "aria-label": "Works from any state",
          "onUpdate:modelValue": f[3] || (f[3] = (m) => e.transition.from = m ? "any" : [])
        }, null, 8, ["model-value"])
      ]),
      e.transition.from !== "any" ? (c(), j(Lt, {
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
      (c(!0), g(Z, null, le(e.transition.set ?? [], (m, i) => (c(), g("div", {
        key: i,
        class: "work-process-value work-stack work-tight"
      }, [
        d("label", Fr, [
          f[18] || (f[18] = N("Field", -1)),
          b(r(ae), {
            modelValue: m.field,
            "onUpdate:modelValue": (n) => m.field = n,
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            options: e.draft.fields?.map((n) => ({ value: n.code, label: n.title || n.code })) ?? []
          }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
        ]),
        d("div", Lr, [
          b(r(ae), {
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
          b(r(X), {
            text: "",
            severity: "danger",
            "aria-label": "Remove value " + (i + 1),
            onClick: (n) => e.transition.set?.splice(i, 1)
          }, {
            default: L(() => [
              b(r(Q), { icon: "tabler:trash" })
            ]),
            _: 1
          }, 8, ["aria-label", "onClick"])
        ]),
        m.copy !== void 0 ? (c(), j(r(ae), {
          key: 0,
          modelValue: m.copy,
          "onUpdate:modelValue": (n) => m.copy = n,
          "aria-label": "Copy from field",
          appendTo: "self",
          optionLabel: "label",
          optionValue: "value",
          options: e.draft.fields?.map((n) => ({ value: n.code, label: n.title || n.code })) ?? []
        }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])) : m.clear ? E("", !0) : (c(!0), g(Z, { key: 1 }, le(e.draft.fields?.filter((n) => n.code === m.field) ?? [], (n) => (c(), j(ja, {
          key: n.code,
          "board-id": e.boardId ?? "",
          field: n,
          modelValue: m.value,
          "onUpdate:modelValue": (u) => m.value = u,
          onValidity: (u) => a("validity", "effect-" + i, u)
        }, null, 8, ["board-id", "field", "modelValue", "onUpdate:modelValue", "onValidity"]))), 128))
      ]))), 128)),
      b(r(X), {
        label: "Add value",
        severity: "secondary",
        outlined: "",
        size: "small",
        onClick: o
      }, {
        icon: L(() => [
          b(r(Q), { icon: "tabler:plus" })
        ]),
        _: 1
      }),
      d("label", zr, [
        f[19] || (f[19] = N("Offer to people", -1)),
        b(r(ae), {
          "model-value": e.transition.people,
          "aria-label": "Offer to people",
          appendTo: "self",
          optionLabel: "label",
          optionValue: "value",
          options: [{ label: "Work default", value: void 0 }, { label: "Offer explicitly", value: !0 }, { label: "Hide from people", value: !1 }],
          "onUpdate:modelValue": f[6] || (f[6] = (m) => e.transition.people = m)
        }, null, 8, ["model-value"])
      ]),
      d("label", Br, [
        f[20] || (f[20] = N("Evaluation order", -1)),
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
}), gl = /* @__PURE__ */ ce({
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
      const v = l.draft.policy ??= {}, f = v.wip ??= {};
      f[l.state] = { ...f[l.state], limit: s };
    }
    function o(s) {
      t.value && (t.value.hard = s);
    }
    return (s, v) => e.hard ? (c(), j(r(Le), {
      key: 0,
      "aria-label": e.label,
      disabled: !t.value,
      "model-value": t.value?.hard ?? !1,
      "onUpdate:modelValue": o
    }, null, 8, ["aria-label", "disabled", "model-value"])) : (c(), j(r(Ge), {
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
async function Sa(e) {
  try {
    const { data: l } = await No.get(e);
    if (!l?.success) throw new Error(l?.message || (typeof l?.error == "string" ? l.error : l?.error?.message) || "Could not read published Flow.");
    return l;
  } catch (l) {
    throw Co(l, "Published Flow");
  }
}
const Ta = (e) => `/api/v1/workflows/${encodeURIComponent(e)}/versions`, Ea = {
  versions: async (e) => (await Sa(Ta(e))).versions ?? [],
  check: async (e) => {
    if ((await Sa(`${Ta(e.id)}/${e.version}`)).version?.version !== e.version) throw new Error("The published version is unavailable.");
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
}, Gr = ["schema", "config", "title"], Yr = {
  key: 3,
  class: "kx-err",
  role: "alert"
}, Hr = {
  key: 4,
  class: "work-stack work-tight"
}, Xr = {
  key: 5,
  class: "work-muted work-small",
  role: "status"
}, Jr = /* @__PURE__ */ ce({
  __name: "StageFlow",
  props: {
    modelValue: {}
  },
  emits: ["update:modelValue", "validity"],
  setup(e, { emit: l }) {
    const t = e, a = l, o = z(!1), s = z(""), v = z([]), f = z(!1), m = z(""), i = z(!1), n = H(() => s.value || t.modelValue?.id), u = JSON.stringify({ properties: { flow_ref: { title: "Published Flow", picker: "wc-workflow-picker" } } }), y = H(() => JSON.stringify(t.modelValue ? { flow_ref: t.modelValue } : {}));
    let p = 0;
    async function $() {
      o.value = await tt("wc-workflow-picker");
    }
    $();
    async function C() {
      const F = ++p, O = n.value, S = t.modelValue;
      if (f.value = !!O, m.value = "", v.value = [], !!O)
        try {
          const [B] = await Promise.all([Ea.versions(O), !i.value && S ? Ea.check(S) : Promise.resolve()]);
          if (F !== p) return;
          if (v.value = B.filter((M) => Number.isInteger(M.version) && M.version > 0), !i.value && S && !v.value.some((M) => M.version === S.version)) throw new Error("The published version is unavailable.");
        } catch (B) {
          F === p && (m.value = B instanceof Error ? B.message : "Could not read published Flow.");
        } finally {
          F === p && (f.value = !1);
        }
    }
    xe([n, () => t.modelValue?.version, i], C, { immediate: !0 }), xe(i, (F) => a("validity", !F), { immediate: !0 });
    function D(F) {
      const O = F.detail?.flow_ref;
      O?.kind !== "flow" || !O.id || (i.value = !0, s.value = O.id);
    }
    function T(F) {
      !n.value || !v.value.some((O) => O.version === F) || (a("update:modelValue", { kind: "flow", id: n.value, version: F }), i.value = !1, s.value = "");
    }
    function Y() {
      a("update:modelValue", void 0), i.value = !1, s.value = "";
    }
    return it(() => {
      p++, a("validity", !0);
    }), (F, O) => (c(), g("section", qr, [
      O[3] || (O[3] = d("h4", { class: "work-field-label" }, "What runs", -1)),
      e.modelValue ? E("", !0) : (c(), g("p", Wr, "No Flow bound. This stage keeps its existing external execution contract.")),
      m.value ? (c(), g("p", Kr, [
        N(U(i.value ? "Flow versions unavailable" : "Flow binding unavailable") + ": " + U(n.value), 1),
        !i.value && e.modelValue ? (c(), g(Z, { key: 0 }, [
          N(" · v" + U(e.modelValue.version), 1)
        ], 64)) : E("", !0),
        N(". " + U(m.value), 1),
        b(r(X), {
          label: "Reload Flow",
          severity: "secondary",
          text: "",
          onClick: C
        })
      ])) : E("", !0),
      o.value ? (c(), g("wc-workflow-picker", {
        key: 2,
        schema: r(u),
        config: y.value,
        title: e.modelValue?.id,
        onChange: D
      }, null, 40, Gr)) : (c(), g("p", Yr, [
        O[1] || (O[1] = N("Published Flow picker unavailable.", -1)),
        b(r(X), {
          label: "Reload Flow picker",
          text: "",
          severity: "secondary",
          onClick: $
        })
      ])),
      n.value ? (c(), g("label", Hr, [
        O[2] || (O[2] = N("Published version", -1)),
        b(r(ae), {
          "model-value": i.value ? void 0 : e.modelValue?.version,
          options: v.value.map((S) => ({ label: "v" + S.version, value: S.version })),
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
      i.value ? (c(), g("p", Xr, "Choose a published version of " + U(n.value) + " to finish selecting the Flow.", 1)) : E("", !0),
      e.modelValue || i.value ? (c(), j(r(X), {
        key: 6,
        label: i.value ? "Cancel Flow selection" : "Remove Flow binding",
        "aria-label": i.value ? "Cancel Flow selection" : "Remove Flow binding",
        severity: "secondary",
        text: "",
        onClick: O[0] || (O[0] = (S) => i.value ? (i.value = !1, s.value = "") : Y())
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
function Zr(e, l) {
  if (e == null) return;
  if (!Number.isFinite(e * Hl[l]) || e <= 0) throw new Error("Enter a positive duration.");
  const t = (a) => a.toLocaleString("en-US", { useGrouping: !1, maximumSignificantDigits: 21 });
  return Number.isInteger(e) ? l === "days" ? `P${t(e)}D` : l === "hours" ? `PT${t(e)}H` : `PT${t(e)}M` : `PT${t(e * Hl[l])}S`;
}
const Qr = { class: "work-stack work-tight" }, _r = {
  class: "work-duration-control",
  style: { "max-width": "360px" }
}, ed = {
  key: 0,
  class: "work-error",
  role: "alert"
}, xt = /* @__PURE__ */ ce({
  __name: "DurationControl",
  props: {
    modelValue: {},
    label: {},
    disabled: { type: Boolean }
  },
  emits: ["update:modelValue", "validity"],
  setup(e, { emit: l }) {
    const t = e, a = l, o = "duration:" + Xl(), s = z("days"), v = z("");
    xe(() => t.modelValue, (y) => {
      v.value = "";
      const p = y ? Wt(y) : void 0;
      p && (s.value = p.unit), a("validity", !y || !!p, o);
    }, { immediate: !0 });
    const f = H(() => t.modelValue ? Wt(t.modelValue, s.value)?.amount ?? null : null);
    function m(y) {
      try {
        const p = Zr(y, s.value);
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
    return it(() => a("validity", !0, o)), (y, p) => (c(), g("label", Qr, [
      N(U(e.label), 1),
      d("span", _r, [
        b(r(Ge), {
          "model-value": f.value,
          "aria-label": e.label,
          min: 0,
          "aria-invalid": !!v.value || !!e.modelValue && !r(Wt)(e.modelValue),
          disabled: e.disabled,
          useGrouping: !1,
          onInput: n,
          "onUpdate:modelValue": p[0] || (p[0] = ($) => i($))
        }, null, 8, ["model-value", "aria-label", "aria-invalid", "disabled"]),
        b(r(ae), {
          "model-value": s.value,
          "aria-label": e.label + " unit",
          disabled: e.disabled,
          options: [{ label: "Minutes", value: "minutes" }, { label: "Hours", value: "hours" }, { label: "Days", value: "days" }],
          optionLabel: "label",
          optionValue: "value",
          appendTo: "self",
          "onUpdate:modelValue": p[1] || (p[1] = ($) => u($))
        }, null, 8, ["model-value", "aria-label", "disabled"])
      ]),
      v.value || e.modelValue && !r(Wt)(e.modelValue) ? (c(), g("span", ed, U(v.value || `Unsupported duration: ${e.modelValue}`), 1)) : E("", !0)
    ]));
  }
}), td = { class: "work-stack" }, ld = { class: "work-settings-grid" }, ad = { class: "work-stack work-tight" }, od = { class: "work-stack work-tight" }, id = {
  key: 1,
  class: "work-stack work-tight"
}, nd = { class: "work-stack work-tight" }, sd = { class: "work-settings-grid" }, rd = { class: "work-row" }, dd = { class: "work-stack work-tight" }, ud = {
  key: 0,
  class: "work-stack work-tight"
}, cd = /* @__PURE__ */ ce({
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
    return (i, n) => (c(), g("section", td, [
      n[8] || (n[8] = d("h4", null, "Timers", -1)),
      (c(!0), g(Z, null, le(o(), (u, y) => (c(), g("article", {
        key: u.id,
        class: "work-settings-card work-stack"
      }, [
        d("div", ld, [
          d("label", ad, [
            n[2] || (n[2] = N("Timer ID", -1)),
            b(r(ue), {
              modelValue: u.id,
              "onUpdate:modelValue": (p) => u.id = p,
              required: "",
              pattern: "[a-z][a-z0-9_]*"
            }, null, 8, ["modelValue", "onUpdate:modelValue"])
          ]),
          d("label", od, [
            n[3] || (n[3] = N("Deadline", -1)),
            b(r(ae), {
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
          u.after !== void 0 ? (c(), j(xt, {
            key: 0,
            modelValue: u.after,
            "onUpdate:modelValue": (p) => u.after = p,
            label: "After",
            onValidity: n[0] || (n[0] = (p, $) => a("validity", $, p))
          }, null, 8, ["modelValue", "onUpdate:modelValue"])) : (c(), g("label", id, [
            n[4] || (n[4] = N("At field", -1)),
            b(r(ae), {
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
          d("label", nd, [
            n[5] || (n[5] = N("Duration by field", -1)),
            b(r(ae), {
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
        u.by ? (c(), j(at, {
          key: 0,
          label: "Duration table",
          hint: "Map field values to ISO durations.",
          "model-value": u.table,
          shape: "object",
          "onUpdate:modelValue": (p) => u.table = p,
          onValidity: (p) => a("validity", "table-" + y, p)
        }, null, 8, ["model-value", "onUpdate:modelValue", "onValidity"])) : E("", !0),
        d("div", sd, [
          b(xt, {
            modelValue: u.repeat,
            "onUpdate:modelValue": (p) => u.repeat = p,
            label: "Repeat every",
            onValidity: n[1] || (n[1] = (p, $) => a("validity", $, p)),
            disabled: u.interrupting
          }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"]),
          d("label", rd, [
            b(r(Mt), {
              modelValue: u.interrupting,
              "onUpdate:modelValue": [(p) => u.interrupting = p, (p) => u.interrupting && delete u.repeat],
              binary: ""
            }, null, 8, ["modelValue", "onUpdate:modelValue"]),
            n[6] || (n[6] = N("Interrupting", -1))
          ]),
          d("label", dd, [
            n[7] || (n[7] = N("Then", -1)),
            b(r(ae), {
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
          u.then ? (c(), g("label", ud, [
            N(U(u.then.transition !== void 0 ? "Transition ID" : "Event name"), 1),
            u.then.transition !== void 0 ? (c(), j(r(ue), {
              key: 0,
              modelValue: u.then.transition,
              "onUpdate:modelValue": (p) => u.then.transition = p
            }, null, 8, ["modelValue", "onUpdate:modelValue"])) : (c(), j(r(ue), {
              key: 1,
              modelValue: u.then.emit,
              "onUpdate:modelValue": (p) => u.then.emit = p
            }, null, 8, ["modelValue", "onUpdate:modelValue"]))
          ])) : E("", !0)
        ]),
        b(r(X), {
          severity: "secondary",
          onClick: (p) => o().splice(y, 1),
          "aria-label": "Remove timer",
          text: "",
          size: "small"
        }, {
          default: L(() => [
            b(r(Q), {
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
        icon: L(() => [
          b(r(Q), {
            icon: "tabler:plus",
            "aria-hidden": "true"
          })
        ]),
        _: 1
      })
    ]));
  }
}), vd = ["aria-label"], md = { class: "work-stack work-tight" }, fd = {
  key: 0,
  class: "work-stack work-tight"
}, pd = /* @__PURE__ */ ce({
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
    function v(m) {
      a("update:modelValue", m === "field" ? { field: "" } : m === "group" ? { group: "" } : []);
    }
    function f(m) {
      a("update:modelValue", o.value === "group" ? { group: m.at(-1)?.id ?? "" } : m);
    }
    return Ra(() => a("validity", Array.isArray(t.modelValue) ? t.modelValue.length > 0 : "field" in t.modelValue ? !!t.modelValue.field : !!t.modelValue.group)), it(() => a("validity", !0)), (m, i) => (c(), g("section", {
      class: "work-stack work-tight",
      "aria-label": e.label
    }, [
      d("label", md, [
        N(U(e.label) + " source", 1),
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
      "field" in e.modelValue ? (c(), g("label", fd, [
        i[1] || (i[1] = N("Principal field", -1)),
        b(r(ae), {
          "model-value": e.modelValue.field,
          "aria-label": e.label + " field",
          options: e.draft.fields?.filter((n) => n.type === "principal").map((n) => ({ label: n.title || n.code, value: n.code })) ?? [],
          optionLabel: "label",
          optionValue: "value",
          appendTo: "self",
          "onUpdate:modelValue": i[0] || (i[0] = (n) => a("update:modelValue", { field: n }))
        }, null, 8, ["model-value", "aria-label", "options"])
      ])) : (c(), j(ea, {
        key: 1,
        "board-id": e.boardId,
        label: e.label,
        kinds: o.value === "group" ? "group" : "user,group,service",
        "model-value": s.value,
        "onUpdate:modelValue": f
      }, null, 8, ["board-id", "label", "kinds", "model-value"]))
    ], 8, vd));
  }
}), bd = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, hd = {
  class: "work-stack work-tight",
  "aria-label": "Approval sources"
}, yd = { class: "work-row" }, gd = {
  key: 0,
  class: "work-stack work-tight"
}, kd = ["kinds", "value"], wd = {
  key: 2,
  class: "work-muted work-small",
  role: "status"
}, Vd = {
  key: 3,
  class: "work-chips"
}, $d = { class: "work-row work-small" }, xd = { class: "work-process-options" }, Cd = { class: "work-stack work-tight" }, Sd = {
  key: 4,
  class: "work-error work-small",
  role: "alert"
}, Td = {
  key: 5,
  class: "work-muted work-small"
}, Ed = /* @__PURE__ */ ce({
  __name: "ApproversEditor",
  props: {
    approvals: {},
    boardId: {}
  },
  emits: ["validity"],
  setup(e, { emit: l }) {
    const t = e, a = l, { principalLabel: o, rememberPrincipal: s, nameError: v } = Oa(() => t.boardId ?? "", () => Array.isArray(t.approvals.from) ? t.approvals.from : "group" in t.approvals.from ? [{ kind: "group", id: t.approvals.from.group }] : []), f = z(!1), m = H(() => Array.isArray(t.approvals.from) ? "principals" : "field" in t.approvals.from ? "field" : "group"), i = H(() => Array.isArray(t.approvals.from) ? t.approvals.from.some((p) => p.kind === "group") || t.approvals.from.length >= t.approvals.min : "field" in t.approvals.from ? !!t.approvals.from.field : !!t.approvals.from.group);
    Ra(() => a("validity", Number.isSafeInteger(t.approvals.min) && t.approvals.min > 0 && i.value)), it(() => a("validity", !0)), kl(async () => {
      f.value = await tt("wc-principal-picker");
    });
    function n(p) {
      t.approvals.from = p === "group" ? { group: "" } : p === "field" ? { field: "" } : [];
    }
    function u(p) {
      const $ = p.detail, C = $?.principal_id ?? $?.id;
      if (m.value === "group") {
        t.approvals.from = { group: C ?? "" };
        return;
      }
      if (!C || !Array.isArray(t.approvals.from)) return;
      const D = { kind: $.type ?? $.kind ?? "user", id: C };
      $.label && s(D, $.label), t.approvals.from.some((T) => T.id === C && T.kind === D.kind) || t.approvals.from.push(D);
    }
    function y(p) {
      Array.isArray(t.approvals.from) && t.approvals.from.splice(p, 1);
    }
    return (p, $) => (c(), g(Z, null, [
      r(v) ? (c(), g("p", bd, U(r(v)), 1)) : E("", !0),
      d("section", hd, [
        d("label", yd, [
          $[4] || ($[4] = d("span", { class: "work-spacer" }, "Approvals needed", -1)),
          b(r(Ge), {
            modelValue: e.approvals.min,
            "onUpdate:modelValue": $[0] || ($[0] = (C) => e.approvals.min = C),
            min: 1,
            required: "",
            useGrouping: !1
          }, null, 8, ["modelValue"])
        ]),
        $[9] || ($[9] = d("span", { class: "work-field-label" }, "Approvers", -1)),
        "field" in e.approvals.from ? (c(), g("label", gd, [
          $[5] || ($[5] = N("Principal field", -1)),
          b(r(ue), {
            modelValue: e.approvals.from.field,
            "onUpdate:modelValue": $[1] || ($[1] = (C) => e.approvals.from.field = C),
            "aria-label": "Principal field"
          }, null, 8, ["modelValue"])
        ])) : f.value ? (c(), g("wc-principal-picker", {
          key: m.value,
          kinds: m.value === "group" ? "group" : "user,group,service",
          value: JSON.stringify("group" in e.approvals.from ? { type: "group", principal_id: e.approvals.from.group } : {}),
          onConfigChanged: u
        }, null, 40, kd)) : (c(), g("p", wd, "The principal picker is unavailable.")),
        Array.isArray(e.approvals.from) ? (c(), g("div", Vd, [
          (c(!0), g(Z, null, le(e.approvals.from, (C, D) => (c(), j(r(Re), {
            key: C.kind + ":" + C.id,
            class: "kx-tag-sm",
            severity: "secondary"
          }, {
            default: L(() => [
              N(U(r(o)(C)), 1),
              b(r(X), {
                "aria-label": "Remove approver " + (D + 1),
                text: "",
                severity: "secondary",
                size: "small",
                onClick: (T) => y(D)
              }, {
                default: L(() => [
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
        ])) : E("", !0),
        d("label", $d, [
          $[6] || ($[6] = d("span", { class: "work-spacer" }, "The person who moves the item here cannot approve this visit", -1)),
          b(r(Le), {
            modelValue: e.approvals.prevent_self,
            "onUpdate:modelValue": $[2] || ($[2] = (C) => e.approvals.prevent_self = C),
            "aria-label": "The person who moves the item here cannot approve this visit"
          }, null, 8, ["modelValue"])
        ]),
        d("details", xd, [
          $[8] || ($[8] = d("summary", null, "Approval options", -1)),
          d("label", Cd, [
            $[7] || ($[7] = N("Approval source", -1)),
            b(r(ae), {
              "model-value": m.value,
              "onUpdate:modelValue": $[3] || ($[3] = (C) => n(C)),
              appendTo: "self",
              optionLabel: "label",
              optionValue: "value",
              options: [{ label: "Group members", value: "group" }, { label: "People and groups", value: "principals" }, { label: "Principal field", value: "field" }]
            }, null, 8, ["model-value"])
          ])
        ]),
        Array.isArray(e.approvals.from) && !i.value ? (c(), g("p", Sd, "Select at least " + U(e.approvals.min) + " distinct principals, or lower the minimum.", 1)) : "group" in e.approvals.from && !e.approvals.from.group ? (c(), g("p", Td, "Choose the group that can approve this state.")) : E("", !0)
      ])
    ], 64));
  }
}), Ud = {
  class: "work-state-settings work-stack",
  "aria-label": "State settings"
}, Dd = { class: "work-process-kind" }, Id = { class: "work-process-options" }, Ad = { class: "work-stack" }, Pd = { class: "work-row" }, Rd = { class: "work-stack work-tight" }, Od = { class: "work-row" }, Nd = { class: "work-stack work-tight" }, Md = { class: "work-row" }, Fd = { class: "work-row" }, Ld = { class: "work-stack work-tight" }, zd = { class: "work-row" }, Bd = { class: "work-stack work-tight" }, jd = { class: "work-stack work-tight" }, qd = {
  key: 0,
  class: "work-row"
}, Wd = { class: "work-row" }, Kd = { class: "work-row" }, Gd = { class: "work-stack work-tight" }, Yd = { class: "work-row" }, Hd = /* @__PURE__ */ ce({
  __name: "StateSettings",
  props: {
    state: {},
    process: {},
    draft: {},
    boardId: {}
  },
  emits: ["validity"],
  setup(e, { emit: l }) {
    const t = e, a = l, o = H(() => (t.process.transitions ?? []).filter((m) => m.from === "any" || m.from.includes(t.state.id))), s = [{ value: "human", icon: "user" }, { value: "gate", icon: "shield-check" }, { value: "automated", icon: "bolt" }, { value: "parallel", icon: "arrows-split" }];
    function v(m) {
      const i = t.state;
      i.kind = m, delete i.run, delete i.release_when, delete i.regions, delete i.join, delete i.due, (m === "automated" || m === "gate") && delete i.awaiting, m === "automated" && (i.run = { stage: i.id, retry: { max: 1, backoff: "PT1M" } }), m === "gate" && (i.release_when = { approvals: { min: 1, from: { group: "" }, prevent_self: !0 } }), m === "parallel" && (i.regions = [{ id: "region_1", initial: t.process.states.find((n) => n.id !== i.id)?.id ?? "" }], i.join = "all");
    }
    function f(m) {
      t.state.run && (m ? t.state.run.on_fail = m : delete t.state.run.on_fail);
    }
    return (m, i) => (c(), g("section", Ud, [
      i[52] || (i[52] = d("h4", { class: "work-process-group" }, "Who moves the item on", -1)),
      b(r(Ql), {
        class: "work-process-kinds",
        "model-value": e.state.kind ?? "human",
        options: s.map((n) => ({
          ...n,
          label: r(Fa)(n.value)
        })),
        optionLabel: "label",
        optionValue: "value",
        optionDisabled: "disabled",
        "allow-empty": !1,
        "aria-label": "Who moves the item on",
        "onUpdate:modelValue": v
      }, {
        option: L(({ option: n }) => [
          d("span", Dd, [
            b(r(Q), {
              icon: "tabler:" + n.icon
            }, null, 8, ["icon"]),
            d("span", null, U(n.label), 1)
          ])
        ]),
        _: 1
      }, 8, ["model-value", "options"]),
      e.state.kind === "gate" && e.state.release_when ? (c(), g(Z, { key: 0 }, [
        i[33] || (i[33] = d("h4", { class: "work-process-group" }, "Approval", -1)),
        e.state.release_when.approvals ? (c(), j(Ed, {
          key: 0,
          "board-id": e.boardId,
          approvals: e.state.release_when.approvals,
          onValidity: i[0] || (i[0] = (n) => a("validity", "approvers", n))
        }, null, 8, ["board-id", "approvals"])) : E("", !0),
        d("details", Id, [
          i[32] || (i[32] = d("summary", null, "Release options", -1)),
          d("div", Ad, [
            d("label", Pd, [
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
        d("label", Rd, [
          i[34] || (i[34] = N("Run label", -1)),
          b(r(ue), {
            modelValue: e.state.run.stage,
            "onUpdate:modelValue": i[6] || (i[6] = (n) => e.state.run.stage = n),
            "aria-label": "Run label",
            required: ""
          }, null, 8, ["modelValue"])
        ]),
        b(Jr, {
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
        d("label", Od, [
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
        d("label", Nd, [
          i[36] || (i[36] = N("When visits are exhausted", -1)),
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
        d("label", Md, [
          i[37] || (i[37] = d("span", { class: "work-spacer" }, "Retry if it fails", -1)),
          b(r(Le), {
            "model-value": !!e.state.run.retry,
            "aria-label": "Retry if it fails",
            "onUpdate:modelValue": i[13] || (i[13] = (n) => e.state.run.retry = n ? { max: 1, backoff: "PT1M" } : void 0)
          }, null, 8, ["model-value"])
        ]),
        e.state.run.retry ? (c(), g(Z, { key: 0 }, [
          d("label", Fd, [
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
        (c(), g(Z, null, le([{ key: "on_pass", label: "On success" }, { key: "on_cancel", label: "On cancellation" }], (n) => d("label", {
          key: n.key,
          class: "work-stack work-tight"
        }, [
          N(U(n.label), 1),
          b(r(ae), {
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
        d("label", Ld, [
          i[39] || (i[39] = N("If it fails, go to", -1)),
          b(r(ae), {
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
        (c(!0), g(Z, null, le(e.state.regions, (n, u) => (c(), g("div", {
          key: u,
          class: "work-process-value work-stack work-tight"
        }, [
          d("div", zd, [
            d("span", null, "Lane " + U(u + 1), 1),
            i[43] || (i[43] = d("span", { class: "work-spacer" }, null, -1)),
            b(r(X), {
              severity: "danger",
              text: "",
              size: "small",
              "aria-label": "Remove lane",
              onClick: (y) => e.state.regions.splice(u, 1)
            }, {
              default: L(() => [
                b(r(Q), { icon: "tabler:trash" })
              ]),
              _: 1
            }, 8, ["onClick"])
          ]),
          d("label", Bd, [
            i[44] || (i[44] = N("Starts at", -1)),
            b(r(ae), {
              modelValue: n.initial,
              "onUpdate:modelValue": (y) => n.initial = y,
              appendTo: "self",
              optionLabel: "label",
              optionValue: "value",
              options: e.process.states.filter((y) => y.id !== e.state.id).map((y) => ({ label: r(he)(y), value: y.id }))
            }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
          ])
        ]))), 128)),
        b(r(X), {
          label: "Add lane",
          severity: "secondary",
          outlined: "",
          size: "small",
          onClick: i[17] || (i[17] = (n) => e.state.regions.push({
            id: r(Vt)("region", e.state.regions),
            initial: e.process.states.find((u) => u.id !== e.state.id)?.id ?? ""
          }))
        }, {
          icon: L(() => [
            b(r(Q), { icon: "tabler:plus" })
          ]),
          _: 1
        }),
        d("label", jd, [
          i[45] || (i[45] = N("Finish rule", -1)),
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
        typeof e.state.join == "number" ? (c(), g("label", qd, [
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
      d("label", Wd, [
        i[48] || (i[48] = d("span", { class: "work-spacer" }, "Items allowed here", -1)),
        b(gl, {
          draft: e.draft,
          state: e.state.id,
          label: "Items allowed here"
        }, null, 8, ["draft", "state"])
      ]),
      d("label", Kd, [
        i[49] || (i[49] = d("span", { class: "work-spacer" }, [
          N("Refuse moves over the limit"),
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
      !e.state.kind || e.state.kind === "human" ? (c(), j(xt, {
        key: 3,
        modelValue: e.state.due,
        "onUpdate:modelValue": i[21] || (i[21] = (n) => e.state.due = n),
        label: "Time allowed in this state",
        onValidity: i[22] || (i[22] = (n, u) => a("validity", u, n))
      }, null, 8, ["modelValue"])) : E("", !0),
      i[55] || (i[55] = d("h4", { class: "work-process-group" }, "Assignment and conditions", -1)),
      d("label", Gd, [
        i[50] || (i[50] = N("Stage label", -1)),
        b(r(ue), {
          "model-value": e.state.stage,
          "aria-label": "Stage label",
          "onUpdate:modelValue": i[23] || (i[23] = (n) => e.state.stage = n || void 0)
        }, null, 8, ["model-value"])
      ]),
      !e.state.kind || e.state.kind === "human" || e.state.kind === "parallel" ? (c(), g(Z, { key: 4 }, [
        d("label", Yd, [
          b(r(Le), {
            "model-value": !!e.state.awaiting,
            "aria-label": "Awaiting people",
            "onUpdate:modelValue": i[24] || (i[24] = (n) => e.state.awaiting = n ? { group: "" } : void 0)
          }, null, 8, ["model-value"]),
          i[51] || (i[51] = N("Awaiting people", -1))
        ]),
        e.state.awaiting ? (c(), j(pd, {
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
      b(cd, {
        state: e.state,
        draft: e.draft,
        onValidity: i[30] || (i[30] = (n, u) => a("validity", "timer-" + n, u))
      }, null, 8, ["state", "draft"])
    ]));
  }
}), Xd = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, Jd = {
  class: "work-process-controls",
  role: "toolbar",
  "aria-label": "Process tools"
}, Zd = {
  key: 1,
  class: "work-process-title"
}, Qd = { class: "work-muted" }, _d = {
  key: 2,
  class: "work-map-zoom",
  role: "group",
  "aria-label": "Map zoom"
}, eu = ["aria-label"], tu = { class: "work-row" }, lu = { class: "work-process-meaning" }, au = { class: "work-stack work-tight" }, ou = { class: "work-process-inspector-foot" }, iu = { class: "work-row" }, nu = { class: "work-process-meaning" }, su = { class: "work-stack work-tight" }, ru = { class: "work-process-inspector-foot" }, du = {
  key: 3,
  class: "work-row"
}, uu = { class: "work-stack work-tight" }, cu = { class: "work-dialog-actions" }, vu = /* @__PURE__ */ ce({
  __name: "ProcessEditor",
  props: {
    draft: {},
    guardRemoval: { type: Function },
    issues: {},
    boardId: {}
  },
  emits: ["validity"],
  setup(e, { emit: l }) {
    const t = e, a = l, o = H(() => t.draft.processes ?? []), s = z(!1), v = z(""), f = z(""), m = z(""), i = z("Map"), n = z(""), u = z(), y = z(), p = z(), $ = z(), C = z(!1);
    async function D() {
      C.value = !0, await ho(), $.value?.querySelector('[aria-label="State name"]')?.focus();
    }
    const T = H(() => o.value.find((k) => k.id === f.value) ?? o.value[0]);
    function Y() {
      C.value = !1, u.value = void 0, y.value = void 0, m.value = "";
    }
    function F(k) {
      C.value = !1, u.value = k, y.value = void 0, n.value = "", m.value = "";
    }
    function O(k) {
      C.value = !1, y.value = k, u.value = void 0, m.value = "";
    }
    xe(T, Y);
    function S(k) {
      k === "__new" ? s.value = !0 : f.value = k;
    }
    function B() {
      const k = v.value.trim();
      if (!k) return;
      const V = k.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "") || "process", I = (/^[a-z]/.test(V) ? V : "process_" + V).slice(0, 40), A = o.value.some((re) => re.id === I) ? Vt(I, o.value) : I;
      (t.draft.processes ??= []).push({ id: A, name: k, initial: "todo", states: [{ id: "todo", name: "To do", category: "unstarted" }], transitions: [] }), f.value = A, v.value = "", s.value = !1;
    }
    async function M(k) {
      const V = { id: Vt("state", k.states), name: "New state", category: "started" }, I = Bl(k), A = I.at(-1), re = u.value ?? (A?.category === "completed" ? I.at(-2) : A), pe = re && (k.transitions?.find((ke) => ke.default && ke.from !== "any" && ke.from.includes(re.id)) ?? k.transitions?.find((ke) => ke.from !== "any" && ke.from.includes(re.id) && k.states.findIndex((Ve) => Ve.id === ke.to) > k.states.indexOf(re)));
      if (k.states.splice(re ? k.states.indexOf(re) + 1 : k.states.length, 0, V), re && re.category !== "completed" && re.category !== "canceled")
        if (pe) {
          const ke = pe.to;
          pe.to = V.id, (k.transitions ??= []).push({ id: Vt("transition", k.transitions ?? []), name: "Continue", from: [V.id], to: ke, ...pe.auto && pe.default ? { auto: !0, default: !0 } : {} });
        } else (k.transitions ??= []).push({ id: Vt("transition", k.transitions ?? []), name: "Continue", from: [re.id], to: V.id });
      F(V), await D();
    }
    function te(k, V) {
      const I = T.value;
      if (!I || !V || k === V) return;
      let A = `to_${V}`, re = 2;
      for (; I.transitions?.some((ke) => ke.id === A); ) A = `to_${V}_${re++}`;
      const pe = { id: A, name: `To ${he(I.states.find((ke) => ke.id === V)).toLowerCase()}`, from: [k], to: V };
      (I.transitions ??= []).push(pe), O(pe);
    }
    function oe(k) {
      const V = { id: Vt("transition", k.transitions ?? []), name: "To " + he(k.states.at(-1)), from: [k.initial], to: k.states.at(-1)?.id ?? k.initial };
      (k.transitions ??= []).push(V), O(V);
    }
    function q(k, V) {
      const I = To(k, V);
      if (I.length) {
        m.value = `Used by ${I.join(", ")}. Update those references first.`;
        return;
      }
      k.transitions?.splice(k.transitions.indexOf(V), 1), Y();
    }
    function P(k, V) {
      const I = Eo(k, V);
      if (I.length) {
        m.value = `${he(V)} is used by ${I.join(", ")}. Update these references first.`;
        return;
      }
      k.states.splice(k.states.indexOf(V), 1), Y();
    }
    async function R(k) {
      const V = t.draft.item_types?.filter((A) => A.process === k.id).map((A) => A.title || "Untitled item type") ?? [];
      if (V.length) {
        m.value = `Used by ${V.join(", ")}. Choose a different process for those item types first.`;
        return;
      }
      const I = await t.guardRemoval?.("processes", k.id);
      if (I) {
        m.value = I;
        return;
      }
      _t(t.draft, "processes", k.id), f.value = "", Y();
    }
    return (k, V) => (c(), g("section", {
      class: "work-process-editor work-stack",
      "aria-label": "Process editor",
      onKeydown: Ae(Y, ["esc"])
    }, [
      m.value ? (c(), g("p", Xd, U(m.value), 1)) : E("", !0),
      (c(!0), g(Z, null, le(e.issues?.filter((I) => I.code === "process " + T.value?.id) ?? [], (I) => (c(), g("p", {
        key: I.what + I.detail,
        class: "work-error work-small",
        role: "alert"
      }, U(r(wl)(I)) + " · " + U(I.what), 1))), 128)),
      T.value ? (c(), g("div", {
        key: 1,
        class: ft(["work-process-builder", { "work-process-inspecting": u.value || y.value }])
      }, [
        d("div", Jd, [
          o.value.length > 1 ? (c(), j(r(ae), {
            key: 0,
            "model-value": T.value.id,
            "aria-label": "Process",
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            options: [
              ...o.value.map((I) => ({ label: I.name || "Untitled process", value: I.id })),
              { label: "New process…", value: "__new" }
            ],
            "onUpdate:modelValue": S
          }, null, 8, ["model-value", "options"])) : (c(), g("span", Zd, U(T.value.name || "Process"), 1)),
          b(r(X), {
            label: "Add state",
            severity: "secondary",
            outlined: "",
            size: "small",
            onClick: V[0] || (V[0] = (I) => M(T.value))
          }, {
            icon: L(() => [
              b(r(Q), { icon: "tabler:plus" })
            ]),
            _: 1
          }),
          b(r(ae), {
            modelValue: T.value.initial,
            "onUpdate:modelValue": V[1] || (V[1] = (I) => T.value.initial = I),
            "aria-label": "Starts in " + r(he)(T.value.states.find((I) => I.id === T.value.initial)),
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            options: T.value.states.map((I) => ({ label: r(he)(I), value: I.id }))
          }, {
            value: L(() => [
              d("span", Qd, "Starts in " + U(r(he)(T.value.states.find((I) => I.id === T.value.initial))), 1)
            ]),
            _: 1
          }, 8, ["modelValue", "aria-label", "options"]),
          V[17] || (V[17] = d("span", { class: "work-spacer" }, null, -1)),
          i.value === "Map" ? (c(), g("div", _d, [
            b(r(X), {
              label: "Fit",
              title: "Fit to width and show the full process",
              text: "",
              severity: "secondary",
              size: "small",
              onClick: V[2] || (V[2] = (I) => p.value?.fit())
            }, {
              icon: L(() => [
                b(r(Q), { icon: "tabler:arrows-maximize" })
              ]),
              _: 1
            }),
            i.value === "Map" ? (c(), j(r(X), {
              key: 0,
              "aria-label": "Zoom out",
              title: "Zoom out",
              text: "",
              severity: "secondary",
              size: "small",
              onClick: V[3] || (V[3] = (I) => p.value?.zoomOut())
            }, {
              default: L(() => [
                b(r(Q), { icon: "tabler:minus" })
              ]),
              _: 1
            })) : E("", !0),
            i.value === "Map" ? (c(), j(r(X), {
              key: 1,
              "aria-label": "Zoom in",
              title: "Zoom in",
              text: "",
              severity: "secondary",
              size: "small",
              onClick: V[4] || (V[4] = (I) => p.value?.zoomIn())
            }, {
              default: L(() => [
                b(r(Q), { icon: "tabler:plus" })
              ]),
              _: 1
            })) : E("", !0)
          ])) : E("", !0),
          b(r(Ql), {
            modelValue: i.value,
            "onUpdate:modelValue": V[5] || (V[5] = (I) => i.value = I),
            options: ["Map", "List"],
            "allow-empty": !1,
            "aria-label": "Process layout"
          }, null, 8, ["modelValue"]),
          o.value.length === 1 ? (c(), j(r(X), {
            key: 3,
            label: "New process",
            "aria-label": "New process",
            text: "",
            severity: "secondary",
            size: "small",
            onClick: V[6] || (V[6] = (I) => s.value = !0)
          }, {
            icon: L(() => [
              b(r(Q), { icon: "tabler:plus" })
            ]),
            _: 1
          })) : E("", !0)
        ]),
        i.value === "Map" ? (c(), j(wr, {
          key: 0,
          ref_key: "graph",
          ref: p,
          process: T.value,
          draft: e.draft,
          "selected-state": u.value,
          "selected-transition": y.value,
          onState: F,
          onTransition: O,
          onConnect: te,
          onClear: Y
        }, null, 8, ["process", "draft", "selected-state", "selected-transition"])) : (c(), j(Ar, {
          key: 1,
          process: T.value,
          "selected-state": u.value,
          "selected-transition": y.value,
          onState: F,
          onTransition: O,
          onRemoveState: V[7] || (V[7] = (I) => P(T.value, I)),
          onRemoveTransition: V[8] || (V[8] = (I) => q(T.value, I)),
          onAddTransition: V[9] || (V[9] = (I) => oe(T.value))
        }, null, 8, ["process", "selected-state", "selected-transition"])),
        u.value || y.value ? (c(), g("aside", {
          key: 2,
          ref_key: "inspector",
          ref: $,
          class: "work-process-sideform",
          "aria-label": u.value ? "State inspector" : "Transition inspector"
        }, [
          (c(!0), g(Z, null, le(u.value ? [u.value] : [], (I) => (c(), g(Z, {
            key: I.id
          }, [
            d("header", tu, [
              C.value ? (c(), j(r(ue), {
                key: 1,
                modelValue: I.name,
                "onUpdate:modelValue": (A) => I.name = A,
                class: "work-process-name",
                "aria-label": "State name",
                onBlur: V[10] || (V[10] = (A) => C.value = !1)
              }, null, 8, ["modelValue", "onUpdate:modelValue"])) : (c(), j(Jl, {
                key: 0,
                class: "work-process-state-title",
                "aria-label": "Rename state",
                onActivate: D
              }, {
                default: L(() => [
                  d("span", null, U(r(he)(I)), 1)
                ]),
                _: 2
              }, 1024)),
              b(r(X), {
                severity: "secondary",
                text: "",
                size: "small",
                "aria-label": "Close state editor",
                onClick: Y
              }, {
                default: L(() => [
                  b(r(Q), { icon: "tabler:x" })
                ]),
                _: 1
              })
            ]),
            d("p", lu, U(r(So)(I, e.draft)), 1),
            b(Hd, {
              state: I,
              process: T.value,
              draft: e.draft,
              "board-id": e.boardId,
              onValidity: (A, re) => a("validity", A.includes("duration:") ? A : T.value.id + ":" + I.id + ":" + A, re)
            }, null, 8, ["state", "process", "draft", "board-id", "onValidity"]),
            d("label", au, [
              V[18] || (V[18] = N("Phase", -1)),
              b(r(ae), {
                modelValue: I.category,
                "onUpdate:modelValue": (A) => I.category = A,
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                options: ["triage", "backlog", ...r(Na)].map((A) => ({ label: r(Zl)(A), value: A }))
              }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
            ]),
            V[19] || (V[19] = d("h4", { class: "work-process-group" }, "Next stop", -1)),
            b(r(ae), {
              modelValue: n.value,
              "onUpdate:modelValue": V[11] || (V[11] = (A) => n.value = A),
              "aria-label": "Add transition to…",
              placeholder: "Add transition to…",
              appendTo: "self",
              optionLabel: "label",
              optionValue: "value",
              options: T.value.states.filter((A) => A !== I).map((A) => ({ label: r(he)(A), value: A.id }))
            }, null, 8, ["modelValue", "options"]),
            b(r(X), {
              label: "Add transition",
              severity: "secondary",
              outlined: "",
              size: "small",
              disabled: !n.value,
              onClick: (A) => te(I.id, n.value)
            }, {
              icon: L(() => [
                b(r(Q), { icon: "tabler:arrow-right" })
              ]),
              _: 1
            }, 8, ["disabled", "onClick"]),
            d("footer", ou, [
              b(r(X), {
                label: "Remove state",
                severity: "danger",
                text: "",
                size: "small",
                onClick: (A) => P(T.value, I)
              }, {
                icon: L(() => [
                  b(r(Q), { icon: "tabler:trash" })
                ]),
                _: 1
              }, 8, ["onClick"])
            ])
          ], 64))), 128)),
          (c(!0), g(Z, null, le(y.value ? [y.value] : [], (I) => (c(), g(Z, {
            key: I.id
          }, [
            d("header", iu, [
              V[20] || (V[20] = d("h3", null, "Transition", -1)),
              V[21] || (V[21] = d("span", { class: "work-spacer" }, null, -1)),
              b(r(X), {
                severity: "secondary",
                text: "",
                size: "small",
                "aria-label": "Close transition editor",
                onClick: Y
              }, {
                default: L(() => [
                  b(r(Q), { icon: "tabler:x" })
                ]),
                _: 1
              })
            ]),
            d("p", nu, U(I.from === "any" ? "Any state" : I.from.map((A) => r(he)(T.value.states.find((re) => re.id === A))).join(", ")) + " → " + U(r(he)(T.value.states.find((A) => A.id === I.to))), 1),
            d("label", su, [
              V[22] || (V[22] = N("Name", -1)),
              b(r(ue), {
                modelValue: I.name,
                "onUpdate:modelValue": (A) => I.name = A,
                placeholder: r(je)(I),
                "aria-label": "Transition name"
              }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder"])
            ]),
            b(jr, {
              transition: I,
              process: T.value,
              draft: e.draft,
              "board-id": e.boardId,
              onValidity: (A, re) => a("validity", T.value.id + ":transition-" + I.id + ":" + A, re)
            }, null, 8, ["transition", "process", "draft", "board-id", "onValidity"]),
            d("footer", ru, [
              b(r(X), {
                label: "Remove transition",
                severity: "danger",
                text: "",
                size: "small",
                onClick: (A) => q(T.value, I)
              }, {
                icon: L(() => [
                  b(r(Q), { icon: "tabler:trash" })
                ]),
                _: 1
              }, 8, ["onClick"])
            ])
          ], 64))), 128))
        ], 8, eu)) : E("", !0)
      ], 2)) : (c(), j(r(X), {
        key: 2,
        label: "New process",
        severity: "secondary",
        outlined: "",
        onClick: V[12] || (V[12] = (I) => s.value = !0)
      }, {
        icon: L(() => [
          b(r(Q), { icon: "tabler:plus" })
        ]),
        _: 1
      })),
      i.value === "List" && T.value ? (c(), g("div", du, [
        b(r(X), {
          label: "Remove process",
          severity: "danger",
          text: "",
          size: "small",
          onClick: V[13] || (V[13] = (I) => R(T.value))
        }, {
          icon: L(() => [
            b(r(Q), { icon: "tabler:trash" })
          ]),
          _: 1
        })
      ])) : E("", !0),
      b(La, {
        visible: s.value,
        label: "New process",
        onClose: V[16] || (V[16] = (I) => s.value = !1)
      }, {
        default: L(() => [
          d("form", {
            class: "work-dialog-box",
            "aria-label": "New process",
            onSubmit: be(B, ["stop", "prevent"])
          }, [
            V[24] || (V[24] = d("h2", null, "New process", -1)),
            d("label", uu, [
              V[23] || (V[23] = N("Name", -1)),
              b(r(ue), {
                modelValue: v.value,
                "onUpdate:modelValue": V[14] || (V[14] = (I) => v.value = I),
                "aria-label": "New process name",
                autofocus: "",
                required: ""
              }, null, 8, ["modelValue"])
            ]),
            d("div", cu, [
              b(r(X), {
                label: "Cancel",
                severity: "secondary",
                outlined: "",
                onClick: V[15] || (V[15] = (I) => s.value = !1)
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
}), mu = ["inert"], fu = { class: "work-stack work-tight" }, pu = /* @__PURE__ */ ce({
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
      (c(!0), g(Z, null, le(e.draft.processes ?? [], (v) => (c(), g("div", {
        key: v.id,
        class: "work-stack"
      }, [
        d("label", fu, [
          N(U(v.name || "Untitled process"), 1),
          b(r(ae), {
            disabled: e.disabled,
            "model-value": r(ua)(v),
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
        r(ua)(v) !== "pin" ? (c(!0), g(Z, { key: 0 }, le(a(v), (f) => (c(), g("label", {
          key: f.id,
          class: "work-stack work-tight"
        }, [
          N("Move items from " + U(r(he)(f)) + " to", 1),
          b(r(ae), {
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
    ], 8, mu));
  }
}), bu = {
  class: "work-stack",
  "aria-label": "Policy editor"
}, hu = { class: "work-settings-list" }, yu = { class: "work-settings-row" }, gu = { class: "work-row-control" }, ku = { class: "work-settings-list work-wip-container" }, wu = { class: "work-wip-table" }, Vu = { class: "work-mono" }, $u = { class: "work-row-main" }, xu = { class: "work-row" }, Cu = { class: "work-row" }, Su = { class: "work-settings-list" }, Tu = { class: "work-settings-row" }, Eu = { class: "work-row-control" }, Uu = { class: "work-row-main" }, Du = { class: "work-row-title" }, Iu = { class: "work-muted work-small" }, Au = { class: "work-row-control" }, Pu = /* @__PURE__ */ ce({
  __name: "PolicyEditor",
  props: {
    draft: {}
  },
  emits: ["validity"],
  setup(e, { emit: l }) {
    const t = e, a = l, o = H(() => t.draft.policy ?? {}), s = H(() => [...new Set(t.draft.processes?.flatMap((n) => n.states.map((u) => u.id)) ?? [])]), v = ["audit_days", "trash_days", "tombstone_days", "interval_days"], f = { audit_days: "Zero selects 365 days.", interval_days: "Zero selects 365 days.", trash_days: "Zero allows immediate cleanup of trashed items.", tombstone_days: "Zero allows immediate cleanup of deletion records." };
    function m(n, u) {
      u === void 0 ? t.draft.policy && delete t.draft.policy[n] : (t.draft.policy ??= {})[n] = u;
    }
    function i(n, u) {
      m(n, u ?? void 0);
    }
    return (n, u) => (c(), g("section", bu, [
      u[13] || (u[13] = d("header", { class: "work-section-heading" }, [
        d("div", null, [
          d("h2", null, "Policy"),
          d("p", { class: "work-muted work-small" }, "Set capacity and how long the board keeps its history.")
        ])
      ], -1)),
      u[14] || (u[14] = d("h3", { class: "work-group-title" }, "Item keys", -1)),
      d("div", hu, [
        d("div", yu, [
          u[7] || (u[7] = d("div", { class: "work-row-main" }, [
            d("strong", { class: "work-row-title" }, "Item key prefix"),
            d("p", { class: "work-muted work-small" }, "Work reviews and claims prefix changes when you apply the schema.")
          ], -1)),
          d("div", gu, [
            b(r(ue), {
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
      d("div", ku, [
        d("table", wu, [
          u[8] || (u[8] = d("thead", null, [
            d("tr", null, [
              d("th", null, "State"),
              d("th", null, "Limit"),
              d("th", null, "Hard limit")
            ])
          ], -1)),
          d("tbody", null, [
            (c(!0), g(Z, null, le(s.value, (y) => (c(), g("tr", { key: y }, [
              d("td", null, [
                d("strong", null, U(e.draft.processes?.flatMap((p) => p.states).find((p) => p.id === y)?.name || r(ge)(y)), 1),
                d("code", Vu, U(y), 1)
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
        (c(!0), g(Z, null, le(Object.keys(o.value.wip ?? {}).filter((y) => !s.value.includes(y)), (y) => (c(), g("div", {
          key: y,
          class: "work-settings-row"
        }, [
          d("div", $u, [
            N(U(r(ge)(y)) + " ", 1),
            u[9] || (u[9] = d("span", { class: "work-muted" }, "Removed state", -1))
          ]),
          b(r(X), {
            label: "Remove stale limit",
            severity: "secondary",
            outlined: "",
            onClick: (p) => delete o.value.wip[y]
          }, {
            icon: L(() => [
              b(r(Q), { icon: "tabler:trash" })
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
      d("label", xu, [
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
      d("label", Cu, [
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
      d("div", Su, [
        d("div", Tu, [
          u[12] || (u[12] = d("div", { class: "work-row-main" }, [
            d("strong", { class: "work-row-title" }, "Audit trail"),
            d("p", { class: "work-muted work-small" }, "Choose which item changes appear in history.")
          ], -1)),
          d("div", Eu, [
            b(r(ae), {
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
        (c(), g(Z, null, le(v, (y) => d("div", {
          key: y,
          class: "work-settings-row"
        }, [
          d("div", Uu, [
            d("strong", Du, U(r(ge)(y)), 1),
            d("p", Iu, "Blank follows the application default. " + U(f[y]), 1)
          ]),
          d("label", Au, [
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
}), Ru = {
  class: "work-stack",
  "aria-label": "Relation types editor"
}, Ou = { class: "work-section-heading" }, Nu = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, Mu = { class: "work-definition-meta work-muted work-small" }, Fu = { class: "work-settings-grid" }, Lu = { class: "work-stack work-tight" }, zu = { class: "work-stack work-tight" }, Bu = { class: "work-stack work-tight" }, ju = { class: "work-stack work-tight" }, qu = { class: "work-row" }, Wu = { class: "work-relation-preview work-small" }, Ku = { class: "work-muted" }, Gu = {
  key: 0,
  class: "kx-empty"
}, Yu = { class: "work-row work-add-definition" }, Hu = { class: "work-stack work-tight" }, Xu = /* @__PURE__ */ ce({
  __name: "RelationsEditor",
  props: {
    draft: {},
    guardRemoval: { type: Function }
  },
  setup(e) {
    const l = e, t = H(() => l.draft.relation_types ?? []), a = z(""), o = z(""), s = z(!1), v = H(() => /^[a-z][a-z0-9_]*$/.test(a.value) && !t.value.some((i) => i.id === a.value));
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
    return (i, n) => (c(), g("section", Ru, [
      d("header", Ou, [
        n[1] || (n[1] = d("div", null, [
          d("h2", null, "Relation types"),
          d("p", { class: "work-muted work-small" }, "Give each direction a clear label. A used relation keeps its identity and shape.")
        ], -1)),
        b(r(Re), {
          class: "kx-tag-sm",
          severity: "secondary"
        }, {
          default: L(() => [
            N(U(t.value.length) + " " + U(t.value.length === 1 ? "relation" : "relations"), 1)
          ]),
          _: 1
        })
      ]),
      o.value ? (c(), g("p", Nu, U(o.value), 1)) : E("", !0),
      b($l, {
        columns: "relations",
        count: t.value.length
      }, {
        default: L(() => [
          (c(!0), g(Z, null, le(t.value, (u, y) => (c(), j(Vl, {
            title: r(ge)(u.id),
            code: u.id,
            kind: u.symmetric ? "Same both ways" : "Different each way",
            key: y,
            class: "work-stack"
          }, {
            usage: L(() => [
              d("span", Mu, U(u.outward || "Related work") + " · " + U(u.inward || "Reverse relation"), 1)
            ]),
            actions: L(() => [
              b(r(X), {
                severity: "secondary",
                text: "",
                disabled: s.value,
                onClick: (p) => m(u.id),
                "aria-label": "Remove relation",
                size: "small"
              }, {
                default: L(() => [
                  b(r(Q), {
                    icon: "tabler:trash",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["disabled", "onClick"])
            ]),
            default: L(() => [
              d("div", Fu, [
                d("label", Lu, [
                  n[2] || (n[2] = N("Identifier ", -1)),
                  b(r(ue), {
                    modelValue: u.id,
                    "onUpdate:modelValue": (p) => u.id = p,
                    required: "",
                    pattern: "[a-z][a-z0-9_]*",
                    "aria-label": "Relation ID"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                d("label", zu, [
                  n[3] || (n[3] = N("Outward label ", -1)),
                  b(r(ue), {
                    modelValue: u.outward,
                    "onUpdate:modelValue": (p) => u.outward = p,
                    "aria-label": "Outward label"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                d("label", Bu, [
                  n[4] || (n[4] = N("Inward label ", -1)),
                  b(r(ue), {
                    modelValue: u.inward,
                    "onUpdate:modelValue": (p) => u.inward = p,
                    "aria-label": "Inward label"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                d("label", ju, [
                  n[5] || (n[5] = N("Links allowed ", -1)),
                  b(r(ae), {
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
                d("label", qu, [
                  b(r(Mt), {
                    modelValue: u.symmetric,
                    "onUpdate:modelValue": (p) => u.symmetric = p,
                    "aria-label": "Same meaning in both directions",
                    binary: ""
                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                  n[6] || (n[6] = N("Same meaning in both directions ", -1))
                ])
              ]),
              d("p", Wu, [
                n[7] || (n[7] = d("strong", null, "This item", -1)),
                N(" " + U(u.outward || "relates to") + " ", 1),
                n[8] || (n[8] = d("strong", null, "another item", -1)),
                d("span", Ku, " · reverse: " + U(u.symmetric ? u.outward : u.inward), 1)
              ])
            ]),
            _: 2
          }, 1032, ["title", "code", "kind"]))), 128)),
          t.value.length ? E("", !0) : (c(), g("p", Gu, "No relation types yet. Add one to link related work.")),
          d("div", Yu, [
            d("label", Hu, [
              n[9] || (n[9] = N("New relation ID ", -1)),
              b(r(ue), {
                modelValue: a.value,
                "onUpdate:modelValue": n[0] || (n[0] = (u) => a.value = u),
                placeholder: "related_to",
                onKeydown: Ae(be(f, ["prevent"]), ["enter"])
              }, null, 8, ["modelValue", "onKeydown"])
            ]),
            b(r(X), {
              label: "Add relation",
              severity: "secondary",
              disabled: !v.value,
              onClick: f,
              outlined: ""
            }, {
              icon: L(() => [
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
function Ju(e, l) {
  return e.parked ? "Stopped: " + (typeof e.error == "string" ? e.error : e.error?.message ?? "Projection is parked") : e.bootstrapping ? "Initializing" : e.last_seq >= l ? "Up to date" : "Catching up";
}
const Zu = {
  class: "work-stack",
  "aria-label": "Plugins editor"
}, Qu = { class: "work-section-heading" }, _u = {
  key: 0,
  class: "kx-loading"
}, ec = {
  key: 1,
  class: "kx-err",
  role: "alert"
}, tc = {
  key: 2,
  class: "work-notice",
  role: "status"
}, lc = { class: "work-row" }, ac = {
  key: 0,
  class: "work-muted work-small"
}, oc = {
  key: 1,
  class: "kx-err"
}, ic = {
  key: 2,
  class: "work-notice"
}, nc = {
  key: 3,
  class: "work-stack work-tight work-plugin-status",
  role: "status"
}, sc = {
  key: 0,
  class: "kx-err"
}, rc = { class: "work-muted work-small" }, dc = { class: "work-form-actions" }, uc = {
  key: 0,
  class: "work-muted work-small"
}, Ua = /* @__PURE__ */ ce({
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
    const t = e, a = l, o = z({}), s = z(""), v = z(""), f = z(""), m = z(/* @__PURE__ */ new Set()), i = {};
    function n(F) {
      return t.schema.plugins?.find((O) => O.plugin === F);
    }
    function u(F) {
      return n(F)?.active === !0;
    }
    function y(F) {
      return n(F)?.lifecycle.state === "ready";
    }
    function p(F) {
      return t.draft.plugins?.some((O) => O.use === F) === !0;
    }
    function $(F, O) {
      const S = t.draft.plugins ?? [];
      O && !p(F) && (t.draft.plugins = [...S, { use: F }]), O || (t.draft.plugins = S.filter((B) => B.use !== F), delete t.configs[F], m.value.delete(F), a("validity", F, !0));
    }
    function C(F) {
      return u(F) ? o.value[F] ?? n(F)?.config ?? i : t.configs[F] ?? i;
    }
    function D(F, O) {
      u(F) ? o.value[F] = O : t.configs[F] = O;
    }
    function T(F, O) {
      O ? m.value.delete(F) : m.value.add(F), u(F) || a("validity", F, O);
    }
    async function Y(F) {
      if (!(s.value || m.value.has(F))) {
        s.value = F, v.value = "", f.value = "";
        try {
          await kt.configure(t.boardId, F, C(F)), delete o.value[F], f.value = "Plugin configuration saved.", a("configured");
        } catch (O) {
          v.value = O instanceof Error ? O.message : "Could not configure plugin.";
        } finally {
          s.value = "";
        }
      }
    }
    return (F, O) => (c(), g("section", Zu, [
      d("header", Qu, [
        O[1] || (O[1] = d("div", null, [
          d("h2", null, "Plugins"),
          d("p", { class: "work-muted work-small" }, "Add capabilities from installed modules.")
        ], -1)),
        b(r(X), {
          label: "Refresh status",
          severity: "secondary",
          outlined: "",
          disabled: !!s.value || e.disabled,
          onClick: O[0] || (O[0] = (S) => a("refresh"))
        }, {
          icon: L(() => [
            b(r(Q), {
              icon: "tabler:refresh",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        }, 8, ["disabled"])
      ]),
      O[5] || (O[5] = d("p", { class: "work-muted work-small" }, "Activation joins the schema draft and requires review. Active plugin configuration saves separately. Status reflects the last read; refresh to check progress.", -1)),
      e.options.length ? E("", !0) : (c(), g("p", _u, "No installed plugins are visible to you.")),
      v.value ? (c(), g("div", ec, U(v.value), 1)) : E("", !0),
      f.value ? (c(), g("p", tc, U(f.value), 1)) : E("", !0),
      b($l, {
        columns: "plugins",
        count: e.options.length
      }, {
        default: L(() => [
          (c(!0), g(Z, null, le(e.options, (S) => (c(), j(Vl, {
            key: S.plugin,
            title: S.title || "Unavailable capability",
            description: S.description,
            kind: u(S.plugin) ? "Active" : p(S.plugin) ? "Pending review" : "Inactive",
            class: "work-stack"
          }, {
            actions: L(() => [
              O[3] || (O[3] = d("span", { class: "work-spacer" }, null, -1)),
              d("label", lc, [
                b(r(Le), {
                  "model-value": p(S.plugin),
                  disabled: !!s.value || e.disabled || e.activationLocked || !!S.problem,
                  "onUpdate:modelValue": (B) => $(S.plugin, B)
                }, null, 8, ["model-value", "disabled", "onUpdate:modelValue"]),
                O[2] || (O[2] = N("Activate on this board", -1))
              ])
            ]),
            default: L(() => [
              S.requires.length ? (c(), g("p", ac, "Requires " + U(S.requires.map((B) => e.options.find((M) => M.plugin === B)?.title || "Another capability").join(", ")), 1)) : E("", !0),
              S.problem ? (c(), g("p", oc, U(S.problem.message), 1)) : E("", !0),
              n(S.plugin)?.outdated ? (c(), g("p", ic, "The stored declaration differs from the installed plugin. Review activation to update it.")) : E("", !0),
              u(S.plugin) ? (c(), g("div", nc, [
                d("p", null, U(y(S.plugin) ? "Attachment configured" : n(S.plugin)?.lifecycle.state === "failed" ? "Configuration failed" : "Configuring attachment"), 1),
                n(S.plugin)?.lifecycle.error ? (c(), g("p", sc, U(n(S.plugin)?.lifecycle.error?.message), 1)) : E("", !0),
                (c(!0), g(Z, null, le(n(S.plugin)?.projections, (B, M) => (c(), g("div", { key: M }, [
                  d("p", null, U(r(Ju)(B, e.schema.as_of)), 1),
                  d("p", rc, "Position " + U(B.last_seq) + " · Board head " + U(e.schema.as_of), 1)
                ]))), 128))
              ])) : E("", !0),
              !S.problem && (p(S.plugin) || u(S.plugin)) ? (c(), g(Z, { key: 4 }, [
                b(na, {
                  disabled: !!s.value || e.disabled,
                  schema: S.config_schema,
                  "model-value": C(S.plugin),
                  "onUpdate:modelValue": (B) => D(S.plugin, B),
                  onValidity: (B) => T(S.plugin, B)
                }, null, 8, ["disabled", "schema", "model-value", "onUpdate:modelValue", "onValidity"]),
                d("div", dc, [
                  b(r(X), {
                    label: "Reset",
                    severity: "secondary",
                    outlined: "",
                    disabled: !!s.value || e.disabled,
                    onClick: (B) => D(S.plugin, u(S.plugin) ? r(gt)(n(S.plugin)?.config ?? {}) : {})
                  }, {
                    icon: L(() => [
                      b(r(Q), { icon: "tabler:restore" })
                    ]),
                    _: 1
                  }, 8, ["disabled", "onClick"]),
                  u(S.plugin) ? (c(), j(r(X), {
                    key: 0,
                    label: "Save configuration",
                    disabled: !!s.value || e.disabled || m.value.has(S.plugin),
                    loading: s.value === S.plugin,
                    onClick: (B) => Y(S.plugin)
                  }, {
                    icon: L(() => [
                      b(r(Q), {
                        icon: "tabler:device-floppy",
                        "aria-hidden": "true"
                      })
                    ]),
                    _: 1
                  }, 8, ["disabled", "loading", "onClick"])) : E("", !0)
                ]),
                u(S.plugin) ? E("", !0) : (c(), g("p", uc, "Initial configuration is included in Review and Apply."))
              ], 64)) : E("", !0)
            ]),
            _: 2
          }, 1032, ["title", "description", "kind"]))), 128))
        ]),
        _: 1
      }, 8, ["count"]),
      (c(!0), g(Z, null, le(e.draft.plugins?.filter((S) => !e.options.some((B) => B.plugin === S.use)) ?? [], (S) => (c(), g("article", {
        key: S.use,
        class: "work-settings-card"
      }, [
        O[4] || (O[4] = d("p", null, "Unavailable plugin", -1)),
        b(r(X), {
          label: "Deactivate plugin",
          severity: "secondary",
          onClick: (B) => $(S.use, !1),
          outlined: ""
        }, {
          icon: L(() => [
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
}), cc = {
  class: "work-stack",
  "aria-label": "Board visibility"
}, vc = { class: "work-stack work-tight" }, mc = {
  key: 0,
  class: "work-row"
}, fc = { class: "work-stack work-tight" }, pc = { class: "work-settings-list" }, bc = { class: "work-row-main" }, hc = { class: "work-small work-muted" }, yc = { class: "work-row-control" }, gc = { class: "work-row" }, kc = /* @__PURE__ */ ce({
  __name: "VisibilityEditor",
  props: {
    draft: {},
    boardId: {}
  },
  emits: ["validity"],
  setup(e, { emit: l }) {
    const t = e, a = l, o = H(() => t.draft.visibility), s = H(() => (t.draft.fields ?? []).filter((u) => u.form === "text" && (!u.cardinality || u.cardinality === "one") && u.type !== "rollup" && u.index !== "number" && u.config?.case !== "insensitive")), v = z(""), f = H(() => s.value.find((u) => u.code === o.value?.field)?.type !== "option");
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
      const p = o.value?.levels.find(($) => $.id === u);
      p && (p.holders = y ?? []);
    }
    return (u, y) => (c(), g("section", cc, [
      y[10] || (y[10] = d("h3", { class: "work-group-title" }, "Board visibility", -1)),
      y[11] || (y[11] = d("p", { class: "work-small work-muted" }, "Restrict items by their visibility level. People still need access to the board.", -1)),
      d("label", vc, [
        y[7] || (y[7] = N("Visibility field", -1)),
        b(r(ae), {
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
        f.value ? (c(), g("div", mc, [
          d("label", fc, [
            y[8] || (y[8] = N("Level ID", -1)),
            b(r(ue), {
              modelValue: v.value,
              "onUpdate:modelValue": y[1] || (y[1] = (p) => v.value = p),
              "aria-label": "New visibility level",
              onKeydown: Ae(be(m, ["prevent"]), ["enter"])
            }, null, 8, ["modelValue", "onKeydown"])
          ]),
          b(r(X), {
            label: "Add level",
            severity: "secondary",
            outlined: "",
            disabled: !v.value || o.value.levels.some((p) => p.id === v.value),
            onClick: m
          }, null, 8, ["disabled"])
        ])) : E("", !0),
        d("div", pc, [
          (c(!0), g(Z, null, le(o.value.levels, (p, $) => (c(), g("div", {
            key: p.id,
            class: "work-settings-row"
          }, [
            d("div", bc, [
              d("strong", null, U(s.value.find((C) => C.code === o.value.field)?.options?.find((C) => C.id === p.id)?.label || p.id), 1),
              d("p", hc, "Level " + U($ + 1), 1)
            ]),
            d("div", yc, [
              b(qa, {
                "board-id": e.boardId,
                label: "Who can see these items",
                "model-value": p.holders,
                "onUpdate:modelValue": (C) => n(p.id, C),
                onValidity: y[2] || (y[2] = (C) => a("validity", C))
              }, null, 8, ["board-id", "model-value", "onUpdate:modelValue"])
            ])
          ]))), 128))
        ]),
        d("label", gc, [
          b(r(Le), {
            "model-value": o.value.bypass === "admin",
            "onUpdate:modelValue": y[3] || (y[3] = (p) => p ? o.value.bypass = "admin" : delete o.value.bypass)
          }, null, 8, ["model-value"]),
          y[9] || (y[9] = N("Board administrators can see every level", -1))
        ]),
        b(r(X), {
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
}), wc = { class: "kx-head" }, Vc = { class: "kx-head-icon" }, $c = { class: "kx-head-text" }, xc = { class: "kx-title" }, Cc = ["title"], Sc = { class: "kx-head-actions" }, Tc = /* @__PURE__ */ ce({
  __name: "PageHead",
  props: {
    title: {},
    subtitle: {},
    icon: { default: "tabler:layout-kanban" },
    backLabel: {}
  },
  emits: ["back"],
  setup(e) {
    return (l, t) => (c(), g("header", wc, [
      e.backLabel ? (c(), j(r(X), {
        key: 0,
        "aria-label": e.backLabel,
        severity: "secondary",
        text: "",
        onClick: t[0] || (t[0] = (a) => l.$emit("back"))
      }, {
        default: L(() => [
          b(r(Q), {
            icon: "tabler:arrow-left",
            "aria-hidden": "true"
          })
        ]),
        _: 1
      }, 8, ["aria-label"])) : E("", !0),
      d("div", Vc, [
        b(r(Q), {
          icon: e.icon,
          "aria-hidden": "true"
        }, null, 8, ["icon"])
      ]),
      d("div", $c, [
        We(l.$slots, "identity", {}, () => [
          d("h1", xc, U(e.title), 1),
          e.subtitle ? (c(), g("p", {
            key: 0,
            class: "kx-head-sub",
            title: e.subtitle
          }, U(e.subtitle), 9, Cc)) : E("", !0)
        ])
      ]),
      d("div", Sc, [
        We(l.$slots, "default")
      ])
    ]));
  }
}), Ec = { class: "work-board-identity work-stack work-tight" }, Uc = { class: "work-stack work-tight" }, Dc = { class: "work-stack work-tight" }, Ic = { class: "work-stack work-tight" }, Ac = ["value", "inert"], Pc = {
  key: 1,
  class: "work-muted work-small"
}, Rc = { class: "work-row" }, Oc = { class: "work-row" }, Nc = {
  key: 2,
  class: "work-identity-actions"
}, Mc = ["title"], Fc = {
  key: 2,
  class: "kx-err work-inline",
  role: "alert"
}, Lc = {
  key: 3,
  class: "work-muted work-small",
  role: "status"
}, Da = /* @__PURE__ */ ce({
  __name: "BoardIdentity",
  props: {
    board: {},
    compact: { type: Boolean },
    detail: { type: Boolean },
    subtitle: {}
  },
  emits: ["saved"],
  setup(e, { emit: l }) {
    const t = e, a = l, o = z(!1), s = z(""), v = z(""), f = z(""), m = z(!1), i = z(!1), n = z(""), u = z(""), y = H(() => t.board?.access?.admin === !0);
    function p() {
      s.value = t.board?.title ?? "", f.value = t.board?.icon ?? "", tt("wc-icon-picker").then((C) => m.value = C), v.value = t.board?.description ?? "", n.value = "", u.value = "", o.value = !0;
    }
    xe(y, (C) => {
      C || (o.value = !1);
    });
    async function $() {
      if (!y.value || !t.board || i.value || !s.value.trim()) return;
      const C = {};
      if (s.value.trim() !== t.board.title && (C.title = s.value.trim()), v.value !== (t.board.description ?? "") && (C.description = v.value), f.value !== (t.board.icon ?? "") && (C.icon = f.value), !Object.keys(C).length) {
        o.value = !1, u.value = "Nothing changed.";
        return;
      }
      i.value = !0, n.value = "";
      try {
        const D = await $t.updateBoard(t.board.board_id, C);
        o.value = !1, u.value = D.status === "unchanged" ? "Nothing changed." : "Board saved.", a("saved");
      } catch (D) {
        n.value = D instanceof Error ? D.message : "Could not save the board.";
      } finally {
        i.value = !1;
      }
    }
    return (C, D) => (c(), g("div", Ec, [
      o.value ? (c(), g("form", {
        key: 0,
        class: "work-identity-edit",
        "aria-label": "Edit board",
        onClick: D[4] || (D[4] = be(() => {
        }, ["stop"])),
        onSubmit: be($, ["prevent"])
      }, [
        d("label", Uc, [
          D[5] || (D[5] = N("Title", -1)),
          b(r(ue), {
            modelValue: s.value,
            "onUpdate:modelValue": D[0] || (D[0] = (T) => s.value = T),
            required: "",
            autofocus: "",
            disabled: i.value
          }, null, 8, ["modelValue", "disabled"])
        ]),
        d("label", Dc, [
          D[6] || (D[6] = N("Description", -1)),
          b(r(ml), {
            modelValue: v.value,
            "onUpdate:modelValue": D[1] || (D[1] = (T) => v.value = T),
            rows: "1",
            disabled: i.value
          }, null, 8, ["modelValue", "disabled"])
        ]),
        d("div", Ic, [
          D[7] || (D[7] = d("span", null, "Board icon", -1)),
          m.value ? (c(), g("wc-icon-picker", {
            key: 0,
            value: f.value,
            fallback: "tabler:layout-kanban",
            inert: i.value || void 0,
            onSelect: D[2] || (D[2] = (T) => f.value = T.detail)
          }, null, 40, Ac)) : (c(), g("p", Pc, "The icon picker is unavailable."))
        ]),
        d("div", Rc, [
          b(r(X), {
            label: "Save",
            severity: "secondary",
            type: "submit",
            disabled: !s.value.trim() || i.value,
            loading: i.value,
            outlined: ""
          }, {
            icon: L(() => [
              b(r(Q), {
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
            onClick: D[3] || (D[3] = (T) => o.value = !1),
            outlined: ""
          }, {
            icon: L(() => [
              b(r(Q), {
                icon: "tabler:x",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled"])
        ])
      ], 32)) : (c(), g(Z, { key: 1 }, [
        d("div", Oc, [
          e.board?.icon ? (c(), j(r(Q), {
            key: 0,
            icon: e.board.icon,
            "aria-hidden": "true"
          }, null, 8, ["icon"])) : E("", !0),
          (c(), j(zl(e.compact || e.detail ? "h2" : "h1"), {
            class: ft(e.detail ? "work-detail-title" : e.compact ? "kx-card-name" : "kx-title")
          }, {
            default: L(() => [
              N(U(e.board?.title || "Untitled board"), 1)
            ]),
            _: 1
          }, 8, ["class"])),
          e.compact ? We(C.$slots, "title-end", {}, void 0, void 0, 1) : E("", !0),
          e.compact ? (c(), g("span", Nc, [
            y.value ? (c(), j(r(X), {
              key: 0,
              severity: "secondary",
              text: "",
              size: "small",
              onClick: be(p, ["stop"]),
              "aria-label": "Edit board"
            }, {
              default: L(() => [
                b(r(Q), {
                  icon: "tabler:pencil",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            })) : E("", !0),
            We(C.$slots, "actions")
          ])) : y.value ? (c(), j(r(X), {
            key: 3,
            severity: "secondary",
            text: "",
            size: "small",
            onClick: be(p, ["stop"]),
            "aria-label": "Edit board"
          }, {
            default: L(() => [
              b(r(Q), {
                icon: "tabler:pencil",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          })) : E("", !0),
          e.compact ? E("", !0) : We(C.$slots, "title-end", {}, void 0, void 0, 4)
        ]),
        !e.compact && (e.subtitle || e.board?.description) ? (c(), g("p", {
          key: 0,
          class: "kx-head-sub",
          title: e.subtitle || e.board?.description
        }, U(e.subtitle || e.board?.description), 9, Mc)) : E("", !0)
      ], 64)),
      n.value ? (c(), g("p", Fc, U(n.value), 1)) : E("", !0),
      u.value ? (c(), g("p", Lc, U(u.value), 1)) : E("", !0)
    ]));
  }
}), zc = {
  key: 0,
  class: "work-dirty"
}, Ia = /* @__PURE__ */ ce({
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
      e.dirty ? (c(), g("span", zc, "Unsaved changes")) : E("", !0),
      b(r(X), {
        label: "Discard",
        severity: "secondary",
        outlined: "",
        disabled: !e.dirty || e.busy || e.checkingRemoval,
        onClick: t[0] || (t[0] = (a) => l.$emit("discard"))
      }, {
        icon: L(() => [
          b(r(Q), { icon: "tabler:restore" })
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
}), Bc = {
  key: 0,
  class: "work-detail-head"
}, jc = {
  key: 0,
  class: "work-row work-wrap work-draft-actions"
}, qc = {
  key: 2,
  class: "kx-err",
  role: "alert"
}, Wc = ["config"], Kc = /* @__PURE__ */ ce({
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
      !l.authorized || !l.board || (o.value = "", a.value = await tt("kickside-share"), a.value ? t.value = !0 : o.value = "The sharing widget is unavailable. Try Share board again.");
    }
    xe(() => l.authorized, (i) => {
      i || (t.value = !1);
    });
    const v = H(() => JSON.stringify({ resource_id: l.board?.board_id, title: l.board?.title, access_url: `/api/v1/component-access/grants/${encodeURIComponent(l.board?.board_id ?? "")}`, share_url: `/api/v1/component-access/share/${encodeURIComponent(l.board?.board_id ?? "")}` })), f = H(() => l.pack ? `${l.packTitle} ${l.pack.version}${l.outdated ? " · Outdated" : ""}` : ""), m = H(() => "Settings · generation " + (l.generation ?? "…") + (f.value ? " · " + f.value : ""));
    return (i, n) => (c(), g(Z, null, [
      e.embedded ? (c(), g("header", Bc, [
        b(Da, {
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
        e.authorized ? (c(), g("div", jc, [
          e.authorized && e.outdated && e.pack ? (c(), j(r(X), {
            key: 0,
            disabled: !e.canUpgrade,
            title: e.upgradeReason,
            label: "Upgrade pack",
            severity: "secondary",
            outlined: "",
            onClick: n[1] || (n[1] = (u) => i.$emit("upgrade"))
          }, {
            icon: L(() => [
              b(r(Q), { icon: "tabler:refresh" })
            ]),
            _: 1
          }, 8, ["disabled", "title"])) : E("", !0),
          e.authorized && e.board ? (c(), j(r(X), {
            key: 1,
            label: "Share board",
            severity: "secondary",
            outlined: "",
            disabled: e.busy,
            onClick: s
          }, {
            icon: L(() => [
              b(r(Q), {
                icon: "tabler:share",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled"])) : E("", !0),
          e.authorized && !e.pack ? (c(), j(r(X), {
            key: 2,
            label: "Install pack",
            severity: "secondary",
            outlined: "",
            disabled: e.busy || e.dirty,
            onClick: n[2] || (n[2] = (u) => i.$emit("install"))
          }, null, 8, ["disabled"])) : E("", !0),
          b(Ia, {
            dirty: e.dirty,
            busy: e.busy,
            "checking-removal": e.checkingRemoval,
            reviewed: e.reviewed,
            disabled: e.disabled,
            onDiscard: n[3] || (n[3] = (u) => i.$emit("discard")),
            onPrimary: n[4] || (n[4] = (u) => i.$emit("primary"))
          }, null, 8, ["dirty", "busy", "checking-removal", "reviewed", "disabled"])
        ])) : E("", !0)
      ])) : (c(), j(Tc, {
        key: 1,
        title: e.board?.title || "Board",
        subtitle: m.value,
        "back-label": "Back to board",
        icon: "tabler:adjustments",
        onBack: n[10] || (n[10] = (u) => i.$emit("back"))
      }, {
        identity: L(() => [
          b(Da, {
            board: e.board,
            subtitle: m.value,
            onSaved: n[5] || (n[5] = (u) => i.$emit("saved"))
          }, null, 8, ["board", "subtitle"])
        ]),
        default: L(() => [
          e.authorized && e.outdated && e.pack ? (c(), j(r(X), {
            key: 0,
            disabled: !e.canUpgrade,
            title: e.upgradeReason,
            label: "Upgrade pack",
            severity: "secondary",
            outlined: "",
            onClick: n[6] || (n[6] = (u) => i.$emit("upgrade"))
          }, {
            icon: L(() => [
              b(r(Q), { icon: "tabler:refresh" })
            ]),
            _: 1
          }, 8, ["disabled", "title"])) : E("", !0),
          e.authorized && e.board ? (c(), j(r(X), {
            key: 1,
            label: "Share board",
            severity: "secondary",
            outlined: "",
            disabled: e.busy,
            onClick: s
          }, {
            icon: L(() => [
              b(r(Q), {
                icon: "tabler:share",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled"])) : E("", !0),
          e.authorized && !e.pack ? (c(), j(r(X), {
            key: 2,
            label: "Install pack",
            severity: "secondary",
            outlined: "",
            disabled: e.busy || e.dirty,
            onClick: n[7] || (n[7] = (u) => i.$emit("install"))
          }, null, 8, ["disabled"])) : E("", !0),
          e.authorized ? (c(), j(Ia, {
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
      o.value ? (c(), g("p", qc, U(o.value), 1)) : E("", !0),
      t.value && a.value && e.authorized ? (c(), g("kickside-share", {
        key: 3,
        config: v.value,
        onClose: n[11] || (n[11] = (u) => t.value = !1),
        onChanged: n[12] || (n[12] = (u) => i.$emit("saved"))
      }, null, 40, Wc)) : E("", !0)
    ], 64));
  }
}), Gc = {
  key: 0,
  class: "work-settings-card work-schema-plan work-stack",
  "aria-label": "Schema review"
}, Yc = { key: 0 }, Hc = { class: "work-row" }, Xc = { class: "work-muted work-small" }, Jc = { class: "work-muted" }, Zc = {
  key: 0,
  class: "work-notice"
}, Qc = {
  key: 1,
  class: "work-notice"
}, _c = {
  key: 2,
  class: "work-muted work-small"
}, ev = {
  key: 3,
  class: "work-stack work-tight",
  "aria-label": "Reviewed Flow bindings"
}, tv = { key: 4 }, lv = { key: 0 }, av = {
  key: 5,
  class: "work-settings-table"
}, ov = { key: 0 }, iv = { key: 1 }, nv = { key: 2 }, sv = { key: 6 }, rv = /* @__PURE__ */ ce({
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
    return (a, o) => e.plan ? (c(), g("section", Gc, [
      !e.plan.changes.length && !e.plan.refused.length && !e.configCount && !e.packReview ? (c(), g("p", Yc, "No changes to apply.")) : (c(), g(Z, { key: 1 }, [
        d("header", Hc, [
          o[0] || (o[0] = d("h2", null, "Review", -1)),
          b(r(Re), {
            class: "kx-tag-sm",
            severity: e.plan.class === "refused" ? "danger" : e.plan.class === "semantic" ? "warn" : e.plan.class === "additive" ? "success" : "secondary"
          }, {
            default: L(() => [
              N(U(e.plan.class), 1)
            ]),
            _: 1
          }, 8, ["severity"]),
          d("span", Xc, "Generation " + U(e.generation) + " → " + U(e.plan.generation), 1)
        ]),
        d("p", Jc, U(r(Uo)[e.plan.class] || "Review the classified changes below."), 1),
        e.plan.migration ? (c(), g("p", Zc, "Migration needed: " + U(e.plan.migration), 1)) : e.follows.length ? (c(), g("p", Qc, "Follow migration: " + U(e.follows.join(", ")) + ". Existing items move to the new process generation; declared state maps apply.", 1)) : (c(), g("p", _c, "No follow process migration is indicated by these changes.")),
        t.value.length ? (c(), g("section", ev, [
          o[1] || (o[1] = d("h3", null, "Flow bindings", -1)),
          (c(!0), g(Z, null, le(t.value, (s) => (c(), g("p", {
            key: s.process + ":" + s.state
          }, U(s.process) + " / " + U(s.state) + ": " + U(s.reference.id) + " · v" + U(s.reference.version), 1))), 128)),
          o[2] || (o[2] = d("p", { class: "work-muted work-small" }, "New entries use these exact published versions. Before replacing a binding, stop new entries, drain existing attempts and deliveries, pause the old launcher, save, then resume entries.", -1))
        ])) : E("", !0),
        We(a.$slots, "default"),
        e.plan.refused.length ? (c(), g("h3", tv, "Refused changes")) : E("", !0),
        (c(!0), g(Z, null, le(e.plan.refused, (s, v) => (c(), j(r(Wo), {
          key: v,
          severity: "error",
          role: "alert"
        }, {
          default: L(() => [
            N(U(s.code) + " · " + U(s.what) + " · " + U(r(wl)(s)), 1),
            s.to ? (c(), g("span", lv, " → " + U(s.to), 1)) : E("", !0)
          ]),
          _: 2
        }, 1024))), 128)),
        e.plan.changes.length ? (c(), g("table", av, [
          o[3] || (o[3] = d("thead", null, [
            d("tr", null, [
              d("th", null, "Entry"),
              d("th", null, "Class"),
              d("th", null, "Change")
            ])
          ], -1)),
          d("tbody", null, [
            (c(!0), g(Z, null, le(e.plan.changes, (s, v) => (c(), g("tr", { key: v }, [
              d("td", null, U(s.code), 1),
              d("td", null, [
                b(r(Re), {
                  class: "kx-tag-sm",
                  severity: s.class === "refused" ? "danger" : s.class === "semantic" ? "warn" : s.class === "additive" ? "success" : "secondary"
                }, {
                  default: L(() => [
                    N(U(s.class), 1)
                  ]),
                  _: 2
                }, 1032, ["severity"])
              ]),
              d("td", null, [
                N(U(s.what) + " ", 1),
                s.detail ? (c(), g("span", ov, " · " + U(s.detail), 1)) : E("", !0),
                s.to ? (c(), g("span", iv, " → " + U(s.to), 1)) : E("", !0),
                s.count ? (c(), g("span", nv, " · " + U(s.count) + " items", 1)) : E("", !0)
              ])
            ]))), 128))
          ])
        ])) : (c(), g("p", sv, "No declaration changes are reported."))
      ], 64))
    ])) : E("", !0);
  }
}), dv = {
  key: 0,
  class: "work-stack",
  "aria-label": "Pack conflicts"
}, uv = { class: "work-stack work-tight work-pack-review-field" }, cv = { class: "work-json-disclosure" }, vv = { class: "work-config-fields" }, mv = { class: "work-json-example" }, fv = { class: "work-json-example" }, pv = {
  key: 1,
  class: "work-stack",
  "aria-label": "Pack state maps"
}, bv = /* @__PURE__ */ ce({
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
      e.plan.conflicts.length ? (c(), g("section", dv, [
        n[3] || (n[3] = d("h3", null, "Local edits conflict", -1)),
        n[4] || (n[4] = d("p", { class: "work-muted work-small" }, "Choose which declaration to keep for each conflict, then review again.", -1)),
        (c(!0), g(Z, null, le(e.plan.conflicts, (u) => (c(), g("div", {
          key: u.path,
          class: "work-stack work-tight"
        }, [
          d("label", uv, [
            N(U(s(u.path)), 1),
            b(r(ae), {
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
          d("details", cv, [
            n[2] || (n[2] = d("summary", null, "Compare declarations", -1)),
            d("div", vv, [
              d("section", null, [
                n[0] || (n[0] = d("h4", null, "Local edits", -1)),
                d("pre", mv, U(v(u.local_value)), 1)
              ]),
              d("section", null, [
                n[1] || (n[1] = d("h4", null, "Pack changes", -1)),
                d("pre", fv, U(v(u.incoming)), 1)
              ])
            ])
          ])
        ]))), 128))
      ])) : E("", !0),
      Object.keys(e.plan.maps).length ? (c(), g("section", pv, [
        n[5] || (n[5] = d("h3", null, "Required state maps", -1)),
        n[6] || (n[6] = d("p", { class: "work-muted work-small" }, "Review the proposed destinations for existing items. Each destination is editable.", -1)),
        (c(!0), g(Z, null, le(e.plan.maps, (u, y) => (c(), g("div", {
          key: y,
          class: "work-stack"
        }, [
          d("h4", null, U(o(y)), 1),
          (c(!0), g(Z, null, le(u, (p, $) => (c(), g("label", {
            key: $,
            class: "work-stack work-tight work-pack-review-field"
          }, [
            N("Move items from " + U(r(he)(e.original.processes?.find((C) => C.id === y)?.states.find((C) => C.id === $))), 1),
            b(r(ae), {
              "model-value": e.request.maps?.[y]?.[$],
              "aria-label": "Move items from " + r(he)(e.original.processes?.find((C) => C.id === y)?.states.find((C) => C.id === $)),
              disabled: e.disabled,
              appendTo: "self",
              optionLabel: "label",
              optionValue: "value",
              options: e.plan.declaration.processes?.find((C) => C.id === y)?.states.map((C) => ({ label: r(he)(C), value: C.id })) ?? [],
              "onUpdate:modelValue": (C) => m(y, $, C)
            }, null, 8, ["model-value", "aria-label", "disabled", "options", "onUpdate:modelValue"])
          ]))), 128))
        ]))), 128))
      ])) : E("", !0)
    ], 64));
  }
}), hv = {
  key: 0,
  class: "work-settings-tabs"
}, yv = { class: "work-section-navigation" }, gv = {
  key: 1,
  class: "kx-err",
  role: "alert"
}, kv = {
  key: 2,
  class: "kx-err",
  role: "alert"
}, wv = {
  key: 3,
  class: "work-notice",
  role: "status"
}, Vv = {
  key: 4,
  class: "kx-loading",
  role: "status"
}, $v = {
  key: 5,
  class: "work-notice",
  role: "alert"
}, xv = {
  key: 6,
  class: "work-settings-content work-pane"
}, Cv = {
  key: 0,
  class: "work-notice",
  role: "alert"
}, Sv = {
  key: 1,
  class: "work-notice"
}, Tv = { key: 0 }, Ev = ["disabled", "inert"], Uv = {
  key: 6,
  class: "work-settings-card work-stack"
}, Dv = {
  key: 5,
  class: "kx-empty"
}, Iv = {
  key: 6,
  class: "work-muted work-small",
  role: "status"
}, Av = { class: "work-stack work-tight" }, Pv = {
  key: 0,
  class: "work-muted"
}, Rv = { class: "work-dialog-actions" }, Ov = /* @__PURE__ */ ce({
  __name: "BoardSettings",
  props: {
    boardId: {},
    embedded: { type: Boolean }
  },
  emits: ["dirty-change"],
  setup(e, { emit: l }) {
    const t = e, a = l, o = Yo();
    let s, v = "";
    const f = () => JSON.stringify([w.value, T.value, q.value, [...Ve.value]]), m = ["Fields", "Item types", "Process", "Policy", "Relation types", "Plugins", "Review"], i = z("Fields"), n = z(!1), u = z(""), y = z(/* @__PURE__ */ new Set(["Fields"]));
    xe(i, (_) => y.value.add(_));
    const p = z(), $ = z(), C = z(), D = z({}), T = z({}), Y = z(), F = z(!1), O = z(!0), S = z(!1), B = z(""), M = z(""), te = z(""), oe = z([]), q = z(), P = z(), R = z(), k = z(), V = z(), I = z(""), A = z([]), re = H(() => [...A.value, ...k.value?.refused ?? []]), pe = z(!1), ke = z(0), Ve = z(/* @__PURE__ */ new Set()), De = z(), h = jl(), x = jl(), w = H(() => ca(D.value, p.value?.declaration ?? {})), W = H(() => Ve.value.size > 0 || !!q.value || !!p.value && (JSON.stringify(w.value) !== JSON.stringify(p.value.declaration) || Object.keys(T.value).length > 0));
    xe(W, (_) => a("dirty-change", _), { immediate: !0, flush: "sync" });
    const J = H(() => !!p.value && !!$.value && p.value.generation !== $.value.generation), de = H(() => F.value && !S.value && !pe.value && !St.value && !J.value && !Ve.value.size && k.value && (k.value.changes.length > 0 || Object.keys(T.value).length > 0) && k.value.class !== "refused" && !k.value.refused.length && V.value?.matches(w.value, p.value?.generation ?? -1, T.value)), fe = H(() => oe.value.find((_) => _.id === q.value?.pack)?.plugins.filter((_) => !p.value?.plugins?.some((K) => K.plugin === _.plugin && K.active)).map((_) => ({ use: _.plugin })) ?? []), Se = H(() => !!R.value && JSON.stringify(R.value) === JSON.stringify(q.value)), Ne = H(() => q.value ? F.value && !S.value && !Ve.value.size && !J.value && !St.value && Se.value && k.value?.class !== "refused" && !k.value?.refused.length && P.value?.conflicts.every((_) => !!q.value?.resolutions?.[_.path]) : de.value), Te = H(() => !!k.value && (!q.value || Se.value)), pt = H(() => oe.value.find((_) => _.id === p.value?.pack?.id)?.title || "Installed pack"), st = H(() => !te.value && !!p.value?.outdated && !!oe.value.find((_) => _.id === p.value?.pack?.id)), Cl = H(() => te.value ? "Reload packs to check available upgrades." : st.value ? W.value ? "Discard the current draft before upgrading." : St.value ? "Finish the current migration before upgrading." : S.value ? "Wait for the current request to finish." : void 0 : "Install an available version of this pack to upgrade.");
    function Ye() {
      q.value = void 0, P.value = void 0, R.value = void 0;
    }
    async function ll() {
      if (!p.value?.pack || S.value || W.value) return;
      const _ = oe.value.find((K) => K.id === p.value.pack.id);
      _ && (q.value = va(_, p.value.generation), i.value = "Review", await Sl());
    }
    async function Bt() {
      const _ = oe.value.find((K) => K.id === u.value);
      !p.value || !_ || _.plugins.some((K) => !K.installed) || S.value || W.value || (q.value = va(_, p.value.generation), n.value = !1, i.value = "Review", await Sl());
    }
    async function Sl() {
      if (!q.value || S.value || !F.value || J.value || Ve.value.size) return;
      const _ = x(), K = gt(q.value), ee = JSON.stringify(q.value);
      S.value = !0, B.value = "", M.value = "";
      try {
        const ye = await Io(K, (Et) => kt.packPlan(t.boardId, Et));
        if (!_() || ee !== JSON.stringify(q.value)) return;
        P.value = ye.plan, k.value = ye.plan, q.value = ye.request, R.value = gt(q.value), I.value = crypto.randomUUID(), i.value = "Review";
      } catch (ye) {
        _() && (R.value = void 0, B.value = ye instanceof Error ? ye.message : "Could not plan the pack upgrade.");
      } finally {
        S.value = !1;
      }
    }
    const no = H(() => k.value ? Do(k.value, w.value) : []), St = H(() => !!$.value?.migration_error || C.value?.status === "migrating");
    function rt() {
      A.value = [], x(), k.value = void 0, V.value = void 0, R.value = void 0, I.value = "";
    }
    xe([w, T], rt, { deep: !0, flush: "sync" }), xe(T, (_) => {
      q.value && (Object.keys(_).length ? q.value.plugin_configs = gt(_) : delete q.value.plugin_configs);
    }, { deep: !0, flush: "sync" });
    function Tt(_, K) {
      K ? Ve.value.delete(_) : Ve.value.add(_), rt();
    }
    function Tl(_) {
      Ye(), ke.value++, p.value = _, D.value = gt(_.declaration), T.value = {}, Ve.value.clear(), rt();
    }
    async function Ze(_ = !1) {
      const K = h();
      try {
        const [ee, ye, Et] = await Promise.all([$t.schema(t.boardId, void 0, !0).catch((dt) => {
          if (dt instanceof ma && dt.details?.code === "board_schema_missing") return { generation: 0, declaration: {}, compiled: {}, key_prefix: "", as_of: 0 };
          throw dt;
        }), $t.options(t.boardId), $t.boards()]);
        if (!K()) return;
        if (F.value = ye.access.admin, Y.value = ye, C.value = Et.find((dt) => dt.board_id === t.boardId), !F.value) {
          p.value = void 0, D.value = {}, rt();
          return;
        }
        B.value = "";
        const He = Ao(ee);
        $.value = He, s !== void 0 && He.generation >= s ? (s = void 0, v === f() && Tl(He), v = "") : (_ || !p.value || !W.value && He.generation !== p.value.generation) && Tl(He), J.value && rt(), await sa(K);
      } catch (ee) {
        if (!K()) return;
        ee instanceof ma && (ee.status === 403 || ee.kind?.toLowerCase() === "permission_denied") && (F.value = !1), rt(), B.value = ee instanceof Error ? ee.message : "Could not load board settings.";
      } finally {
        K() && (O.value = !1);
      }
    }
    async function sa(_ = () => !0) {
      te.value = "";
      try {
        const K = await $t.packs();
        _() && (oe.value = K.filter(Po));
      } catch (K) {
        _() && (te.value = K instanceof Error ? K.message : "Could not load packs.");
      }
    }
    function so() {
      for (const _ of De.value?.querySelectorAll("input, select, textarea") ?? [])
        if (!(_.form !== De.value || _.closest('[style*="display: none"]')) && !_.reportValidity())
          return !1;
      return !0;
    }
    function ro(_) {
      i.value = _, _ === "Review" && !k.value && El();
    }
    async function El() {
      if (q.value) return Sl();
      if (!p.value || S.value || !F.value || J.value || Ve.value.size || !so()) return;
      const _ = x(), K = fa(w.value, p.value.generation, T.value);
      S.value = !0, B.value = "", M.value = "";
      try {
        const ee = await kt.plan(t.boardId, K);
        if (!_() || Ve.value.size || !K.matches(w.value, p.value.generation, T.value)) return;
        k.value = ee, V.value = K, I.value = crypto.randomUUID(), i.value = "Review";
      } catch (ee) {
        _() && (rt(), B.value = ee instanceof Error ? ee.message : "Could not review changes.", A.value = Ro(ee, w.value));
      } finally {
        S.value = !1;
      }
    }
    async function uo() {
      if (!Ne.value) return;
      if (q.value && R.value) {
        S.value = !0, B.value = "";
        const K = f();
        try {
          const ee = await kt.packApply(t.boardId, gt(R.value), I.value);
          s = ee.generation, v = K, await Ze(), M.value = ee.status === "done" ? `Pack applied at generation ${ee.generation}.` : "Pack installation continues in the background.";
        } catch (ee) {
          B.value = ee instanceof Error ? ee.message : "Could not apply the pack upgrade.";
        } finally {
          S.value = !1;
        }
        return;
      }
      if (!V.value) return;
      S.value = !0, B.value = "", M.value = "";
      const _ = f();
      try {
        const K = await kt.apply(t.boardId, V.value, I.value);
        s = K.generation, v = _, await Ze(), M.value = `Applied generation ${K.generation} (${K.class}).`;
      } catch (K) {
        B.value = K instanceof Error ? K.message : "Could not apply schema.";
      } finally {
        S.value = !1;
      }
    }
    async function co() {
      if (!S.value) {
        S.value = !0, B.value = "";
        try {
          const _ = await kt.resume(t.boardId);
          M.value = _.resumed ? "Migration resumes." : "Migration is already running.", await Ze();
        } catch (_) {
          B.value = _ instanceof Error ? _.message : "Could not resume migration.";
        } finally {
          S.value = !1;
        }
      }
    }
    async function al(_, K) {
      if (!p.value || !F.value || S.value || pe.value) return "Wait for the current change to finish.";
      if (J.value) return "Discard the stale draft before removing a definition.";
      const ee = p.value.generation, ye = JSON.stringify(w.value), Et = gt(D.value);
      _t(Et, _, K), pe.value = !0;
      try {
        const He = await kt.plan(t.boardId, fa(ca(Et, p.value.declaration), ee, T.value));
        if (!F.value || J.value || p.value.generation !== ee || JSON.stringify(w.value) !== ye) return "The draft changes during the check. Try the removal again.";
        const dt = Oo(He, _, K);
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
      s = void 0, $.value && Tl($.value), M.value = "", B.value = "";
    }
    xe(() => t.boardId, () => {
      s = void 0, Ye(), oe.value = [], p.value = void 0, $.value = void 0, C.value = void 0, T.value = {}, Ve.value.clear(), y.value = /* @__PURE__ */ new Set(["Fields"]), i.value = "Fields", F.value = !1, O.value = !0, Ze(!0);
    });
    let Ul = () => {
    };
    return xe(() => t.boardId, (_) => {
      Ul(), Ul = Mo(`component.${_}`, () => {
        Ze();
      });
    }, { immediate: !0 }), go(Ze), Aa(() => {
      Ul(), h(), x();
    }), (_, K) => (c(), g("section", {
      class: ft(["work-settings-shell", { "work-embedded": e.embedded }])
    }, [
      b(Kc, {
        board: C.value,
        embedded: e.embedded,
        generation: p.value?.generation,
        authorized: F.value,
        dirty: W.value,
        busy: S.value,
        "checking-removal": pe.value,
        reviewed: Te.value,
        pack: p.value?.pack,
        "pack-title": pt.value,
        outdated: p.value?.outdated,
        "upgrade-reason": Cl.value,
        "can-upgrade": st.value && !W.value && !S.value && !St.value && F.value,
        onUpgrade: ll,
        onInstall: K[0] || (K[0] = (ee) => n.value = !0),
        disabled: !W.value || S.value || pe.value || St.value || J.value || !!Ve.value.size || Te.value && !Ne.value,
        onBack: vo,
        onDiscard: mo,
        onPrimary: K[1] || (K[1] = (ee) => Te.value ? uo() : El()),
        onSaved: K[2] || (K[2] = (ee) => Ze())
      }, null, 8, ["board", "embedded", "generation", "authorized", "dirty", "busy", "checking-removal", "reviewed", "pack", "pack-title", "outdated", "upgrade-reason", "can-upgrade", "disabled"]),
      F.value && p.value ? (c(), g("div", hv, [
        d("div", yv, [
          b(r(Bo), {
            value: i.value,
            "onUpdate:value": K[3] || (K[3] = (ee) => ro(ee))
          }, {
            default: L(() => [
              b(r(jo), { "aria-label": "Settings sections" }, {
                default: L(() => [
                  (c(), g(Z, null, le(m, (ee) => b(r(qo), {
                    key: ee,
                    value: ee
                  }, {
                    default: L(() => [
                      N(U(ee), 1)
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
      B.value ? (c(), g("div", gv, [
        N(U(B.value) + " ", 1),
        b(r(X), {
          label: "Retry",
          severity: "secondary",
          onClick: K[4] || (K[4] = (ee) => Ze()),
          outlined: ""
        }, {
          icon: L(() => [
            b(r(Q), {
              icon: "tabler:refresh",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        })
      ])) : E("", !0),
      te.value ? (c(), g("p", kv, [
        N(U(te.value), 1),
        b(r(X), {
          label: "Reload packs",
          severity: "secondary",
          outlined: "",
          onClick: K[5] || (K[5] = (ee) => sa())
        }, {
          icon: L(() => [
            b(r(Q), { icon: "tabler:refresh" })
          ]),
          _: 1
        })
      ])) : E("", !0),
      M.value ? (c(), g("p", wv, U(M.value), 1)) : E("", !0),
      O.value ? (c(), g("p", Vv, "Loading settings…")) : !F.value && !B.value ? (c(), g("p", $v, "Board administrator access is required.")) : E("", !0),
      F.value && p.value ? (c(), g("div", xv, [
        J.value ? (c(), g("div", Cv, "The board advances to generation " + U($.value?.generation) + " while you edit. Your draft keeps generation " + U(p.value.generation) + ". Discard to load the latest schema before reviewing again.", 1)) : E("", !0),
        St.value ? (c(), g("div", Sv, [
          d("p", null, [
            K[18] || (K[18] = N("Migration pending", -1)),
            $.value?.migration_error ? (c(), g("span", Tv, ": " + U($.value.migration_error), 1)) : E("", !0)
          ]),
          b(r(X), {
            label: "Resume migration",
            severity: "secondary",
            disabled: S.value,
            onClick: co,
            outlined: ""
          }, {
            icon: L(() => [
              b(r(Q), {
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
            disabled: S.value || pe.value,
            inert: S.value || pe.value || void 0
          }, [
            y.value.has("Fields") ? Qe((c(), j(Ss, {
              key: 0,
              "board-id": e.boardId,
              "installed-types": Y.value?.installed_types,
              draft: D.value,
              "guard-removal": al,
              issues: re.value,
              onValidity: K[6] || (K[6] = (ee, ye) => Tt("fields:" + ee, ye))
            }, null, 8, ["board-id", "installed-types", "draft", "issues"])), [
              [ut, i.value === "Fields"]
            ]) : E("", !0),
            y.value.has("Item types") ? Qe((c(), j(Ws, {
              key: 1,
              draft: D.value,
              "guard-removal": al,
              issues: re.value
            }, null, 8, ["draft", "issues"])), [
              [ut, i.value === "Item types"]
            ]) : E("", !0),
            y.value.has("Process") ? Qe((c(), j(vu, {
              key: 2,
              "board-id": e.boardId,
              draft: D.value,
              "guard-removal": al,
              issues: re.value,
              onValidity: K[7] || (K[7] = (ee, ye) => Tt("process:" + ee, ye))
            }, null, 8, ["board-id", "draft", "issues"])), [
              [ut, i.value === "Process"]
            ]) : E("", !0),
            y.value.has("Policy") ? Qe((c(), j(Pu, {
              key: 3,
              draft: D.value,
              onValidity: K[8] || (K[8] = (ee, ye) => Tt("policy:" + ee, ye))
            }, null, 8, ["draft"])), [
              [ut, i.value === "Policy"]
            ]) : E("", !0),
            y.value.has("Relation types") ? Qe((c(), j(Xu, {
              key: 4,
              draft: D.value,
              "guard-removal": al
            }, null, 8, ["draft"])), [
              [ut, i.value === "Relation types"]
            ]) : E("", !0),
            y.value.has("Plugins") ? Qe((c(), j(Ua, {
              key: 5,
              "board-id": e.boardId,
              draft: D.value,
              schema: $.value ?? p.value,
              options: Y.value?.schema_options.plugins ?? [],
              configs: T.value,
              disabled: S.value,
              onConfigured: K[9] || (K[9] = (ee) => {
                rt(), Ze();
              }),
              onRefresh: K[10] || (K[10] = (ee) => Ze()),
              onValidity: K[11] || (K[11] = (ee, ye) => Tt("plugin:" + ee, ye))
            }, null, 8, ["board-id", "draft", "schema", "options", "configs", "disabled"])), [
              [ut, i.value === "Plugins"]
            ]) : E("", !0),
            y.value.has("Policy") ? Qe((c(), g("section", Uv, [
              b(kc, {
                "board-id": e.boardId,
                draft: D.value,
                onValidity: K[12] || (K[12] = (ee) => Tt("visibility", ee))
              }, null, 8, ["board-id", "draft"])
            ], 512)), [
              [ut, i.value === "Policy"]
            ]) : E("", !0)
          ], 8, Ev))
        ], 544),
        i.value === "Review" && !q.value ? (c(), j(pu, {
          key: 2,
          draft: D.value,
          original: p.value.declaration,
          disabled: S.value || pe.value
        }, null, 8, ["draft", "original", "disabled"])) : E("", !0),
        i.value === "Review" && q.value && fe.value.length ? (c(), j(Ua, {
          key: 3,
          "board-id": e.boardId,
          draft: { plugins: fe.value },
          schema: $.value ?? p.value,
          options: Y.value?.schema_options.plugins.filter((ee) => fe.value.some((ye) => ye.use === ee.plugin)) ?? [],
          configs: T.value,
          disabled: S.value,
          "activation-locked": "",
          onValidity: K[13] || (K[13] = (ee, ye) => Tt("pack-plugin:" + ee, ye))
        }, null, 8, ["board-id", "draft", "schema", "options", "configs", "disabled"])) : E("", !0),
        i.value === "Review" ? (c(), j(rv, {
          key: 4,
          declaration: V.value?.declaration,
          plan: k.value,
          generation: p.value.generation,
          follows: no.value,
          "config-count": Object.keys(T.value).length,
          "pack-review": !!P.value
        }, {
          default: L(() => [
            P.value && q.value ? (c(), j(bv, {
              key: 0,
              plan: P.value,
              request: q.value,
              original: p.value.declaration,
              disabled: S.value,
              onChange: K[14] || (K[14] = (ee) => {
                R.value = void 0, I.value = "";
              })
            }, null, 8, ["plan", "request", "original", "disabled"])) : E("", !0)
          ]),
          _: 1
        }, 8, ["declaration", "plan", "generation", "follows", "config-count", "pack-review"])) : E("", !0),
        i.value === "Review" && !k.value ? (c(), g("p", Dv, "Review your draft to see the changes, their impact and any migration required.")) : E("", !0),
        pe.value ? (c(), g("p", Iv, "Checking existing values and dependencies…")) : E("", !0)
      ])) : E("", !0),
      F.value ? (c(), j(La, {
        key: 7,
        visible: n.value,
        label: "Install pack",
        busy: S.value,
        onClose: K[17] || (K[17] = (ee) => n.value = !1)
      }, {
        default: L(() => [
          d("form", {
            class: "work-dialog-box work-stack",
            onSubmit: be(Bt, ["prevent"])
          }, [
            K[20] || (K[20] = d("h2", null, "Install a pack", -1)),
            K[21] || (K[21] = d("p", { class: "work-muted work-small" }, "Packs can be installed on an empty board. Review checks whether this board is eligible.", -1)),
            d("label", Av, [
              K[19] || (K[19] = N("Pack", -1)),
              b(r(ae), {
                modelValue: u.value,
                "onUpdate:modelValue": K[15] || (K[15] = (ee) => u.value = ee),
                "aria-label": "Pack to install",
                appendTo: "self",
                optionLabel: "title",
                optionValue: "id",
                optionDisabled: "disabled",
                options: oe.value.map((ee) => ({ ...ee, disabled: ee.plugins.some((ye) => !ye.installed) }))
              }, null, 8, ["modelValue", "options"])
            ]),
            oe.value.length ? E("", !0) : (c(), g("p", Pv, "No available packs were found.")),
            d("footer", Rv, [
              b(r(X), {
                label: "Cancel",
                severity: "secondary",
                outlined: "",
                onClick: K[16] || (K[16] = (ee) => n.value = !1)
              }),
              b(r(X), {
                type: "submit",
                label: "Review pack",
                disabled: !u.value || S.value || W.value
              }, null, 8, ["disabled"])
            ])
          ], 32)
        ]),
        _: 1
      }, 8, ["visible", "busy"])) : E("", !0)
    ], 2));
  }
}), Nv = /* @__PURE__ */ ce({
  __name: "SettingsRoot",
  setup(e) {
    const l = ko(), t = wo();
    return yo(Ba, (a) => t("navigate", { route: Ho(a) })), (a, o) => (c(), j(Ov, {
      "board-id": r(l).boardId ?? "",
      embedded: r(l).embedded,
      onDirtyChange: o[0] || (o[0] = (s) => r(t)("dirty-change", { dirty: s }))
    }, null, 8, ["board-id", "embedded"]));
  }
}), Mv = Vo(Nv, {
  type: "object",
  properties: {
    "board-id": { type: "string", default: "", description: "Board to administer." },
    embedded: { type: "boolean", default: !1, description: "Fits in a System detail pane." }
  }
});
Lo(import.meta.url, Mv);
//# sourceMappingURL=settings.js.map
