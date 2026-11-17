import { inject as no, defineComponent as ce, ref as z, useSlots as so, openBlock as u, createElementBlock as h, createElementVNode as d, createVNode as p, normalizeClass as ct, unref as r, withCtx as L, renderSlot as We, toDisplayString as D, createCommentVNode as I, createBlock as B, withDirectives as et, vShow as ht, watch as Ee, onBeforeUnmount as mt, computed as W, onMounted as wa, onUnmounted as xl, resolveComponent as Sl, Fragment as q, renderList as ae, createTextVNode as M, resolveDynamicComponent as za, withKeys as Ae, withModifiers as he, useId as Cl, normalizeStyle as ro, watchEffect as El, nextTick as uo, provide as co } from "vue";
import { Icon as J } from "@iconify/vue";
import { on as mo, host as vo, define as fo } from "@wippy-fe/proxy";
import "pinia";
import { m as Ba, f as ol, s as be, g as po, t as je, p as Tt, b as Ha, h as Ut, r as il, w as Vt, e as Nt, l as Fa, i as Ge, j as xt, k as Tl, n as Ul, o as Xa, q as Dl, v as ye, x as Va, y as ta, z as bo, A as Il, B as wt, C as ho, _ as yo, D as go, E as ko, F as nl, G as yt, H as wo, I as sl, J as Vo, u as $o, K as xo, L as So, M as rl, N as Co, a as Eo, O as dl, P as To, Q as Uo, R as Do, S as Io, d as Ao } from "./latestRequest-beXyVEdS.js";
import Ne from "primevue/toggleswitch";
import X from "primevue/button";
import Pe from "primevue/tag";
import ea from "primevue/textarea";
import Mt from "primevue/checkbox";
import de from "primevue/inputtext";
import le from "primevue/select";
import He from "primevue/inputnumber";
import Ja from "primevue/selectbutton";
import Po from "primevue/chip";
import Oo from "primevue/tabs";
import Ro from "primevue/tablist";
import No from "primevue/tab";
import Mo from "primevue/message";
const Ua = (e, l) => e.x > l.x && e.x < l.x + l.width && e.y > l.y && e.y < l.y + l.height;
function Lo(e, l, t) {
  return e.x === l.x ? e.x > t.x && e.x < t.x + t.width && Math.max(e.y, l.y) > t.y && Math.min(e.y, l.y) < t.y + t.height : e.y > t.y && e.y < t.y + t.height && Math.max(e.x, l.x) > t.x && Math.min(e.x, l.x) < t.x + t.width;
}
function ft(e, l, t) {
  const a = [.../* @__PURE__ */ new Set([e.x, l.x, ...t.flatMap((S) => [S.x, S.x + S.width])])].sort((S, T) => S - T), n = [.../* @__PURE__ */ new Set([e.y, l.y, ...t.flatMap((S) => [S.y, S.y + S.height])])].sort((S, T) => S - T);
  a.unshift(a[0] - 24), a.push(a.at(-1) + 24), n.unshift(n[0] - 24), n.push(n.at(-1) + 24);
  const s = a.length, c = n.indexOf(l.y) * s + a.indexOf(l.x), v = n.indexOf(e.y) * s + a.indexOf(e.x), m = (S) => ({ x: a[S % s], y: n[Math.floor(S / s)] }), i = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Map(), f = [];
  function g(S) {
    f.push(S);
    let T = f.length - 1;
    for (; T; ) {
      const E = T - 1 >> 1;
      if (f[E].priority <= S.priority) break;
      f[T] = f[E], T = E;
    }
    f[T] = S;
  }
  function y() {
    const S = f[0], T = f.pop();
    if (f.length) {
      let E = 0;
      for (; E * 2 + 1 < f.length; ) {
        let C = E * 2 + 1;
        if (C + 1 < f.length && f[C + 1].priority < f[C].priority && C++, T.priority <= f[C].priority) break;
        f[E] = f[C], E = C;
      }
      f[E] = T;
    }
    return S;
  }
  const w = (S) => Math.abs(S.x - l.x) + Math.abs(S.y - l.y);
  for (const S of [0, 1]) {
    const T = v * 2 + S;
    i.set(T, 0), g({ key: T, cost: 0, priority: w(e) });
  }
  const U = /* @__PURE__ */ new Map(), R = /* @__PURE__ */ new Map();
  for (; f.length; ) {
    const S = y(), T = Math.floor(S.key / 2), E = S.key % 2;
    if (S.cost !== i.get(S.key)) continue;
    if (T === c) {
      const Z = [];
      let ue = S.key;
      for (; ue !== void 0; )
        Z.push(m(Math.floor(ue / 2))), ue = o.get(ue);
      return Al(Z.reverse());
    }
    const C = m(T), $ = T % s, O = Math.floor(T / s);
    for (const [Z, ue] of [[$ > 0 ? T - 1 : -1, 0], [$ + 1 < s ? T + 1 : -1, 0], [O > 0 ? T - s : -1, 1], [O + 1 < n.length ? T + s : -1, 1]]) {
      if (Z < 0) continue;
      const _ = m(Z);
      if (U.has(Z) || U.set(Z, !t.some((x) => Ua(_, x))), !U.get(Z)) continue;
      const H = `${Math.min(T, Z)}:${Math.max(T, Z)}`;
      if (R.has(H) || R.set(H, !t.some((x) => Lo(C, _, x))), !R.get(H)) continue;
      const P = S.cost + Math.abs(C.x - _.x) + Math.abs(C.y - _.y) + (E === ue ? 0 : 18), ee = Z * 2 + ue;
      P >= (i.get(ee) ?? 1 / 0) || (i.set(ee, P), o.set(ee, S.key), g({ key: ee, cost: P, priority: P + w(_) }));
    }
  }
  throw new Error("Process map has no collision-free route between its ports: " + JSON.stringify({ start: e, end: l, startInside: t.filter((S) => Ua(e, S)), endInside: t.filter((S) => Ua(l, S)) }));
}
function Al(e) {
  const l = [];
  for (const t of e) {
    const a = l.at(-1), n = l.at(-2);
    a && a.x === t.x && a.y === t.y || (n && a && (n.x === a.x && a.x === t.x || n.y === a.y && a.y === t.y) && l.pop(), l.push(t));
  }
  return l;
}
const qt = (e) => Array.from(e).reduce((l, t) => l + (/[^\x20-\x7e]/u.test(t) ? 16 : /[MW@%]/.test(t) ? 11 : /[ilI.,:;!| ']/.test(t) ? 4 : 7.5), 0);
function Ot(e, l = 28) {
  const t = [];
  let a = "";
  for (const n of e.split(/\s+/u))
    for (let s = 0; s < n.length; s += l) {
      const c = n.slice(s, s + l);
      a && a.length + c.length + 1 > l && (t.push(a), a = ""), a = a ? a + " " + c : c;
    }
  return [...t, a].filter(Boolean);
}
function na(e) {
  if (e = Al(e), !e.length) return "";
  let l = `M ${e[0].x} ${e[0].y}`;
  for (let a = 1; a < e.length - 1; a++) {
    const n = e[a - 1], s = e[a], c = e[a + 1], v = Math.hypot(s.x - n.x, s.y - n.y), m = Math.hypot(c.x - s.x, c.y - s.y), i = Math.min(8, v / 3, m / 3);
    i && (l += ` L ${s.x + (n.x - s.x) * i / v} ${s.y + (n.y - s.y) * i / v} Q ${s.x} ${s.y} ${s.x + (c.x - s.x) * i / m} ${s.y + (c.y - s.y) * i / m}`);
  }
  const t = e.at(-1);
  return l + ` L ${t.x} ${t.y}`;
}
function zo(e, l = {}, t = { width: 1400, height: 480 }) {
  const a = t.width < 750 || Ba(e).length > 8 ? "TB" : "LR", n = new ol.graphlib.Graph({ multigraph: !0 });
  n.setGraph({ rankdir: a, ranker: "network-simplex", acyclicer: "greedy", nodesep: 32, edgesep: 32, ranksep: 24, marginx: 32, marginy: 32 }), n.setDefaultEdgeLabel(() => ({}));
  const s = Ba(e), c = new Map(s.map((b, V) => [b.id, V])), v = e.states.map((b) => {
    const V = (e.transitions ?? []).filter((Te) => Te.from === "any" && Te.to === b.id), k = Ot(be(b)), F = Ot(po(b, e)), G = V.flatMap((Te) => Ot(je(Te) + " works from any state")), re = l.policy?.wip?.[b.id]?.limit, fe = re === void 0 ? 0 : qt(" · limit " + re), xe = Math.max(168, ...k.map((Te) => qt(Te) + 58), ...F.map((Te, it) => qt(Te) + 32 + (it === F.length - 1 ? fe : 0)), ...G.map((Te) => qt(Te) + 32)), Oe = Math.max(80, 42 + k.length * 18 + F.length * 16 + G.length * 18);
    return n.setNode(b.id, { width: xe + (a === "LR" ? 36 : 0), height: Oe + (a === "TB" ? 36 : 0) }), { state: b, x: 0, y: 0, width: xe, height: Oe, title: k, caption: F, badges: V, row: c.has(b.id) ? 0 : 1 };
  }), m = new Set(v.map((b) => b.state.id)), i = (e.transitions ?? []).flatMap((b) => b.from === "any" ? [] : b.from.filter((V) => m.has(V) && m.has(b.to)).map((V) => {
    const k = `${b.id}-${V}`, F = Ot(je(b)), G = Math.max(72, ...F.map((fe) => qt(fe) + 24)), re = Math.max(24, F.length * 16 + 10);
    return { transition: b, from: V, key: k, lines: F, width: G, height: re };
  })), o = /* @__PURE__ */ new Set(), f = /* @__PURE__ */ new Set(), g = new Set(i.filter((b) => b.from === b.transition.to || b.transition.to === e.initial || ["completed", "canceled"].includes(v.find((V) => V.state.id === b.from).state.category)).map((b) => b.key));
  function y(b) {
    if (!f.has(b)) {
      o.add(b);
      for (const V of i.filter((k) => k.from === b))
        g.has(V.key) || (o.has(V.transition.to) ? g.add(V.key) : y(V.transition.to));
      o.delete(b), f.add(b);
    }
  }
  y(e.initial);
  for (const b of v) y(b.state.id);
  for (const b of i) if (!g.has(b.key)) {
    const V = c.get(b.from), k = c.get(b.transition.to);
    n.setEdge(b.from, b.transition.to, { width: b.width, height: b.height, labelpos: "c", weight: V !== void 0 && k === V + 1 ? 100 : 1 }, b.key);
  }
  for (const b of e.transitions ?? []) if (b.from === "any" && m.has(e.initial) && m.has(b.to) && !c.has(b.to)) {
    const V = e.states.find((k) => k.id === b.to);
    n.setEdge(e.initial, b.to, { minlen: ["completed", "canceled"].includes(V.category) ? Math.max(1, s.length - 1) : 1 }, `any:${b.id}`);
  }
  const w = e.states.flatMap((b) => (b.regions ?? []).filter((V) => m.has(V.initial)).map((V, k) => {
    const F = `lane:${b.id}:${k}`;
    return n.setEdge(b.id, V.initial, {}, F), { state: b, region: V, key: F };
  }));
  if (!v.length) return { nodes: v, edges: [], parallels: [], main: s, direction: a, width: 320, height: 160 };
  ol.layout(n);
  for (const b of v) Object.assign(b, { x: n.node(b.state.id).x, y: n.node(b.state.id).y });
  const U = a === "TB", R = i.filter((b) => !g.has(b.key)).map((b) => n.edge({ v: b.from, w: b.transition.to, name: b.key })), S = [...v, ...R], T = Math.max(...S.map((b) => b.x + b.width / 2)), E = Math.max(...S.map((b) => b.y + b.height / 2)), C = (b) => v.find((V) => V.state.id === b), $ = i.filter((b) => g.has(b.key)).sort((b, V) => {
    const k = U ? "y" : "x";
    return Math.abs(C(b.from)[k] - C(b.transition.to)[k]) - Math.abs(C(V.from)[k] - C(V.transition.to)[k]);
  }), O = /* @__PURE__ */ new Map(), Z = Math.max(0, ...$.map((b) => b.width));
  let ue = E + 32;
  for (const [b, V] of $.entries()) {
    const k = C(V.from), F = C(V.transition.to), G = U ? T + 16 + Z + 28 + b * 18 : ue + V.height / 2, re = U ? T + 16 + Z / 2 : (k.x + F.x) / 2;
    let fe = U ? k.y + k.height / 2 + 18 : G;
    if (U) for (const xe of [...O.values()].sort((Oe, Te) => Oe.y - Te.y))
      fe + V.height / 2 + 10 > xe.y - xe.height / 2 - 10 && fe - V.height / 2 - 10 < xe.y + xe.height / 2 + 10 && (fe = xe.y + xe.height / 2 + 24 + V.height / 2);
    O.set(V.key, { x: re, y: fe, corridor: G, height: V.height }), ue = G + V.height / 2 + 24;
  }
  const _ = i.map((b) => ({ ...b, ...O.get(b.key) ?? n.edge({ v: b.from, w: b.transition.to, name: b.key }) })), H = (b, V) => ({ x: b.x - b.width / 2 - V, y: b.y - b.height / 2 - V, width: b.width + V * 2, height: b.height + V * 2 }), P = [...v.map((b) => H(b, 12)), ..._.map((b) => H(b, 10))], ee = (b, V) => ({
    start: U ? { x: b.x, y: b.y + b.height / 2 } : { x: b.x + b.width / 2, y: b.y },
    end: U ? { x: V.x, y: V.y - V.height / 2 } : { x: V.x - V.width / 2, y: V.y }
  }), x = (b, V) => U ? { x: b.x, y: b.y + V } : { x: b.x + V, y: b.y }, A = _.map((b) => {
    const V = v.find((Xe) => Xe.state.id === b.from), k = v.find((Xe) => Xe.state.id === b.transition.to), { start: F, end: G } = ee(V, k), re = g.has(b.key), fe = x(F, 18), xe = x(G, -18), Oe = (re || !U ? b.width : b.height) / 2 + 10, Te = re ? { x: b.x + (U ? -Oe : Oe), y: b.y } : x(b, -Oe), it = re ? { x: b.x + (U ? Oe : -Oe), y: b.y } : x(b, Oe);
    let vt;
    if (re) {
      const { corridor: Xe } = O.get(b.key), Ft = U ? { x: Xe, y: b.y } : { x: fe.x, y: Xe }, jt = U ? { x: Xe, y: xe.y } : { x: xe.x, y: Xe };
      vt = U ? [
        [F, ...ft(fe, Te, P)],
        [it, Ft, jt, ...ft(jt, xe, P), G]
      ] : [
        [F, ...ft(fe, Ft, P), Te],
        [it, ...ft(jt, xe, P), G]
      ];
    } else vt = [
      [F, ...ft(fe, Te, P)],
      [...ft(it, xe, P), G]
    ];
    const oa = re ? "return" : c.get(b.transition.to) === (c.get(b.from) ?? -2) + 1 ? "main" : "forward";
    return { ...b, points: vt.flat(), segments: vt, path: vt.map(na).join(" "), type: oa, targetOffset: 0 };
  }), N = w.map((b) => {
    const V = v.find((fe) => fe.state.id === b.state.id), k = v.find((fe) => fe.state.id === b.region.initial), { start: F, end: G } = ee(V, k), re = [F, ...ft(x(F, 18), x(G, -18), P), G];
    return { state: b.state, key: b.key, points: re, path: na(re) };
  }), Y = [...v.flatMap((b) => [{ x: b.x - b.width / 2, y: b.y - b.height / 2 }, { x: b.x + b.width / 2, y: b.y + b.height / 2 }]), ...A.flatMap((b) => [...b.points, { x: b.x - b.width / 2, y: b.y - b.height / 2 }, { x: b.x + b.width / 2, y: b.y + b.height / 2 }]), ...N.flatMap((b) => b.points)], se = 32 - Math.min(...Y.map((b) => b.x)), ge = 32 - Math.min(...Y.map((b) => b.y)), pe = Math.max(...Y.map((b) => b.x)) + se + 32, Me = Math.max(...Y.map((b) => b.y)) + ge + 32, De = (b) => ({ x: b.x + se, y: b.y + ge });
  for (const b of v) Object.assign(b, De(b));
  for (const b of A)
    Object.assign(b, De(b)), b.segments = b.segments.map((V) => V.map(De)), b.points = b.segments.flat(), b.path = b.segments.map(na).join(" ");
  for (const b of N)
    b.points = b.points.map(De), b.path = na(b.points);
  return { nodes: v, edges: A, parallels: N, main: s, direction: a, width: pe, height: Me };
}
const Pl = Symbol("work-navigation");
function Bo() {
  return no(Pl, () => {
  });
}
function Fo(e) {
  if (e.name === "boards") return "";
  const l = encodeURIComponent(e.board);
  return e.name === "settings" ? `${l}/settings` : l;
}
const Dt = (e) => `/api/v1/work/boards/${encodeURIComponent(e)}`, ul = (e) => ({ declaration: e.declaration, expected_generation: e.expected_generation, plugin_configs: e.plugin_configs }), gt = {
  packPlan: (e, l) => Tt(`${Dt(e)}/pack_plan`, l, "Pack plan"),
  packApply: (e, l, t) => Tt(`${Dt(e)}/pack_apply`, { ...l, key: t }, "Apply pack"),
  plan: (e, l) => Tt(`${Dt(e)}/plan_schema`, ul(l), "Schema plan"),
  apply: (e, l, t) => Tt(`${Dt(e)}/apply_schema`, { ...ul(l), key: t }, "Apply schema"),
  resume: (e) => Tt(`${Dt(e)}/resume_migration`, {}, "Resume migration"),
  configure: (e, l, t) => Tt(`${Dt(e)}/configure_plugin`, { plugin: l, config: t }, "Configure plugin")
}, jo = { class: "work-definition" }, qo = { class: "work-definition-head" }, Wo = { class: "work-definition-affordances" }, Go = ["title"], Yo = { class: "work-definition-code" }, Ko = ["title"], Ho = { class: "work-definition-kind" }, Xo = { class: "work-definition-flags" }, Jo = { class: "work-definition-usage" }, Zo = { class: "work-definition-actions" }, Qo = {
  key: 0,
  class: "work-definition-description"
}, _o = { class: "work-definition-body work-stack" }, $a = /* @__PURE__ */ ce({
  __name: "DefinitionRow",
  props: {
    title: {},
    code: {},
    kind: {},
    description: {}
  },
  setup(e) {
    const l = z(!1), t = so();
    return (a, n) => (u(), h("article", jo, [
      d("header", qo, [
        p(Ha, {
          as: "article",
          class: ct(["work-definition-toggle", { "work-definition-has-handle": r(t).handle }]),
          "aria-expanded": l.value,
          onActivate: n[0] || (n[0] = (s) => l.value = !l.value)
        }, {
          default: L(() => [
            d("span", Wo, [
              We(a.$slots, "handle"),
              p(r(J), {
                icon: l.value ? "tabler:chevron-down" : "tabler:chevron-right"
              }, null, 8, ["icon"])
            ]),
            d("span", {
              class: "work-row-title",
              title: e.title
            }, D(e.title), 9, Go)
          ]),
          _: 3
        }, 8, ["class", "aria-expanded"]),
        d("span", Yo, [
          e.code ? (u(), h("code", {
            key: 0,
            class: "work-mono",
            title: e.code
          }, D(e.code), 9, Ko)) : I("", !0)
        ]),
        d("span", Ho, [
          e.kind ? (u(), B(r(Pe), {
            key: 0,
            severity: "secondary",
            value: e.kind
          }, null, 8, ["value"])) : I("", !0)
        ]),
        d("span", Xo, [
          We(a.$slots, "flags")
        ]),
        d("div", Jo, [
          We(a.$slots, "usage")
        ]),
        d("div", Zo, [
          We(a.$slots, "actions")
        ]),
        e.description ? (u(), h("p", Qo, D(e.description), 1)) : I("", !0)
      ]),
      et(d("div", _o, [
        We(a.$slots, "default")
      ], 512), [
        [ht, l.value]
      ])
    ]));
  }
}), ei = { class: "work-definition-scroll" }, ti = {
  key: 0,
  class: "work-definition-columns",
  "aria-hidden": "true"
}, ai = { key: 0 }, li = { key: 1 }, oi = {
  key: 2,
  class: "work-definition-usage"
}, xa = /* @__PURE__ */ ce({
  __name: "DefinitionList",
  props: {
    count: {},
    columns: {}
  },
  setup(e) {
    return (l, t) => (u(), h("div", ei, [
      d("div", {
        class: ct(["work-field-builder", "work-definitions-" + e.columns])
      }, [
        e.count > 3 ? (u(), h("div", ti, [
          t[0] || (t[0] = d("span", null, null, -1)),
          t[1] || (t[1] = d("span", null, "Name", -1)),
          e.columns !== "plugins" ? (u(), h("span", ai, "Code")) : I("", !0),
          d("span", null, D(e.columns === "plugins" ? "State" : e.columns === "types" ? "Process" : "Kind"), 1),
          e.columns === "fields" || e.columns === "plugins" ? (u(), h("span", li, "Details")) : I("", !0),
          e.columns !== "plugins" ? (u(), h("span", oi, D(e.columns === "fields" ? "Used by" : "Details"), 1)) : I("", !0),
          t[2] || (t[2] = d("span", null, null, -1))
        ])) : I("", !0),
        We(l.$slots, "default")
      ], 2)
    ]));
  }
}), ii = { class: "work-json-disclosure" }, ni = { class: "work-stack work-tight" }, si = {
  key: 0,
  class: "work-small work-muted"
}, ri = {
  key: 1,
  role: "alert",
  class: "work-error"
}, di = { class: "work-json-example" }, at = /* @__PURE__ */ ce({
  __name: "JsonInput",
  props: {
    label: {},
    modelValue: {},
    shape: {},
    hint: {},
    example: {}
  },
  emits: ["update:modelValue", "validity"],
  setup(e, { emit: l }) {
    const t = e, a = l, n = z(""), s = z("");
    Ee(() => t.modelValue, (v) => {
      n.value = v === void 0 ? "" : JSON.stringify(v, null, 2), s.value = "", a("validity", !0);
    }, { immediate: !0 }), mt(() => a("validity", !0));
    function c(v) {
      n.value = v;
      try {
        const m = v.trim() ? JSON.parse(v) : void 0;
        if (m !== void 0 && t.shape === "object" && (!m || typeof m != "object" || Array.isArray(m))) throw new Error("Enter a JSON object.");
        if (m !== void 0 && t.shape === "array" && !Array.isArray(m)) throw new Error("Enter a JSON array.");
        s.value = "", a("update:modelValue", m), a("validity", !0);
      } catch (m) {
        s.value = m instanceof Error ? m.message : "Invalid JSON.", a("validity", !1);
      }
    }
    return (v, m) => (u(), h("details", ii, [
      d("summary", null, "Edit as JSON · " + D(e.label), 1),
      d("label", ni, [
        d("span", null, D(e.label), 1),
        e.hint ? (u(), h("span", si, D(e.hint), 1)) : I("", !0),
        p(r(ea), {
          class: "work-json-input",
          rows: "3",
          "aria-label": e.label,
          value: n.value,
          "aria-invalid": !!s.value,
          onInput: m[0] || (m[0] = (i) => c(i.target.value))
        }, null, 8, ["aria-label", "value", "aria-invalid"]),
        s.value ? (u(), h("span", ri, D(s.value), 1)) : I("", !0)
      ]),
      m[1] || (m[1] = d("p", { class: "work-small work-muted" }, "Example", -1)),
      d("pre", di, D(JSON.stringify(e.example ?? (e.shape === "array" ? [] : {}), null, 2)), 1)
    ]));
  }
}), ui = [
  { code: "key", form: "text", index: "key" },
  { code: "type", form: "text", index: "key" },
  { code: "state", form: "text", index: "key" },
  { code: "category", form: "text", index: "key" },
  { code: "rank", form: "text", index: "key" },
  { code: "parent", form: "text", index: "key" },
  { code: "created_at", form: "time", index: "key" },
  { code: "updated_at", form: "time", index: "key" }
];
function ci(e) {
  const l = e.compiled.processes?.flatMap((t) => t.states.map((a) => ({ id: a.id, label: a.name }))) ?? [];
  return [...ui.filter((t) => t.code !== "rank").map((t) => t.code === "state" ? { ...t, type: "option", options: l } : t.code === "category" ? { ...t, type: "option", options: ["triage", "backlog", "unstarted", "started", "completed", "canceled"].map((a) => ({ id: a })) } : t), ...(e.compiled.fields ?? []).filter((t) => t.index && t.index !== "none")];
}
function mi(e) {
  if (e?.cardinality && e.cardinality !== "one") return ["has", "in", "nin", "is_null", ...e.type === "principal" ? ["member_of"] : []];
  const l = ["eq", "neq", "in", "nin", "is_null", ...e?.type === "principal" ? ["member_of"] : []];
  return e && (["int", "number", "dec", "time", "quantity"].includes(e.form) || e.index === "number") && l.push("lt", "lte", "gt", "gte", "between"), e?.form === "text" && e.type !== "option" && l.push("contains", "starts_with"), l;
}
const vi = { class: "work-field-control" }, fi = ["id"], pi = {
  key: 1,
  class: "work-stack work-tight"
}, bi = { class: "work-chips" }, hi = {
  key: 5,
  class: "work-row"
}, yi = ["inert"], gi = ["value"], ki = {
  key: 1,
  class: "work-muted"
}, wi = ["inert"], Vi = ["value"], $i = {
  key: 1,
  class: "work-muted"
}, xi = {
  key: 11,
  class: "work-stack work-tight"
}, Si = {
  class: "work-stack work-tight",
  "aria-label": "Matching items"
}, Ci = { class: "work-mono" }, Ei = {
  key: 15,
  class: "work-error work-small",
  role: "alert"
}, Ol = /* @__PURE__ */ ce({
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
    const t = e, a = l, n = W(() => t.inputId ?? `field-${t.field.code}`), s = W(() => !!t.field.cardinality && t.field.cardinality !== "one"), c = W(() => Array.isArray(t.modelValue) ? t.modelValue : []), v = W(() => t.modelValue == null ? "" : typeof t.modelValue == "object" ? Ut(t.modelValue) : String(t.modelValue)), m = W(() => {
      const V = t.modelValue;
      return V && typeof V == "object" && "ref" in V && Array.isArray(V.ref) ? String(V.ref[1] ?? "") : "";
    }), i = W(() => t.disabled || il(t.field)), o = z(!1), f = z(!1), g = z(!1), y = z(""), w = z(""), U = z([]), R = Fa(), S = z([]);
    let T = 0, E;
    const C = /* @__PURE__ */ new Set();
    Ee(c, (V) => {
      S.value = E ?? V.map((k, F) => S.value[F] ?? T++), E = void 0;
    }, { immediate: !0 });
    function $(V) {
      a("update:modelValue", V);
    }
    function O(V, k) {
      const F = [...c.value];
      F[V] = k, $(F);
    }
    function Z(V, k) {
      k ? C.delete(V) : C.add(V), a("validity", !C.size);
    }
    function ue(V) {
      C.delete(S.value[V]), a("validity", !C.size), E = S.value.filter((k, F) => F !== V), $(c.value.filter((k, F) => F !== V));
    }
    function _() {
      E = [...S.value, T++], $([...c.value, t.field.form === "bool" ? !1 : t.field.form === "record" ? {} : ""]);
    }
    function H(V) {
      const k = V.detail, F = k?.principal_id ?? k?.id;
      $(F ? { kind: k.type ?? "user", id: F } : void 0);
    }
    function P(V) {
      const k = V.detail;
      $(k?.thread_id ? { ref: ["component", k.thread_id] } : void 0);
    }
    const ee = z("");
    let x = "";
    Ee(() => t.modelValue, (V) => {
      const k = JSON.stringify(V ?? {}, null, 2);
      k !== x && (x = k, ee.value = k, y.value = "", a("validity", !0));
    }, { immediate: !0 });
    function A(V) {
      ee.value = V;
      try {
        const k = JSON.parse(V);
        if (!k || typeof k != "object" || Array.isArray(k)) throw new Error("Enter a JSON object.");
        if (t.field.type === "rich_text" && !("type" in k && typeof k.type == "string")) throw new Error("The document needs a type.");
        x = JSON.stringify(k, null, 2), y.value = "", a("validity", !0), $(k);
      } catch (k) {
        y.value = k instanceof Error ? k.message : "Invalid JSON.", a("validity", !1);
      }
    }
    function N(V) {
      if (!V) {
        a("validity", !0), $(void 0);
        return;
      }
      const k = Number.isFinite(Number(V)) && (t.field.form !== "int" || Number.isSafeInteger(Number(V)));
      a("validity", k), k && $(t.field.form === "int" ? Number(V) : V);
    }
    const Y = W(() => t.field.config?.format === "date");
    function se(V) {
      $(V ? Y.value ? V : new Date(V).toISOString() : void 0);
    }
    const ge = W(() => {
      if (typeof t.modelValue != "string") return "";
      if (Y.value) return t.modelValue.slice(0, 10);
      const V = new Date(t.modelValue);
      return Number.isNaN(V.getTime()) ? "" : new Date(V.getTime() - V.getTimezoneOffset() * 6e4).toISOString().slice(0, 16);
    });
    function pe(V) {
      $(V.detail?.ref);
    }
    function Me(V) {
      $(V.detail?.value);
    }
    let De;
    Ee(w, () => {
      const V = R();
      if (clearTimeout(De), !w.value.trim()) {
        U.value = [];
        return;
      }
      De = setTimeout(async () => {
        try {
          const k = w.value.trim(), F = /^[A-Z][A-Z0-9]{1,9}-[0-9]+$/.test(k) ? [(await Vt.item(t.boardId, { key: k })).item] : (await Vt.query(t.boardId, { where: { field: "title", op: "contains", value: k }, limit: 8 })).items;
          V() && (U.value = F, y.value = "");
        } catch (k) {
          V() && (y.value = k instanceof Error ? k.message : "Could not search items.");
        }
      }, 200);
    });
    function b(V) {
      $({ board: t.boardId, item: V.id }), w.value = "", U.value = [];
    }
    wa(async () => {
      t.field.type === "principal" ? o.value = await Nt("wc-principal-picker") : t.field.config?.target === "component" && (o.value = await Nt("wc-component-picker"));
    });
    for (const [V, k] of [[() => t.editorTag, g], [() => t.linkTag, f]])
      Ee(V, async (F, G, re) => {
        let fe = !0;
        if (re(() => {
          fe = !1;
        }), k.value = !1, F) {
          const xe = await Nt(F);
          fe && (k.value = xe);
        }
      }, { immediate: !0 });
    return xl(() => {
      clearTimeout(De), R();
    }), (V, k) => {
      const F = Sl("FieldControl", !0);
      return u(), h("div", vi, [
        r(il)(e.field) ? (u(), h("output", {
          key: 0,
          id: n.value,
          class: "work-read-value"
        }, D(r(Ut)(e.modelValue, e.field)), 9, fi)) : s.value ? (u(), h("div", pi, [
          d("div", bi, [
            (u(!0), h(q, null, ae(c.value, (G, re) => (u(), B(r(Pe), {
              key: S.value[re],
              class: "kx-tag-sm",
              severity: "secondary"
            }, {
              default: L(() => [
                M(D(r(Ut)(G, e.field)) + " ", 1),
                p(r(X), {
                  type: "button",
                  class: "work-icon-button",
                  disabled: i.value,
                  "aria-label": "Remove value " + (re + 1),
                  onClick: (fe) => ue(re),
                  severity: "secondary",
                  text: "",
                  size: "small"
                }, {
                  default: L(() => [
                    p(r(J), {
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
          (u(!0), h(q, null, ae(c.value, (G, re) => (u(), h("div", {
            key: S.value[re],
            class: "work-stack work-tight"
          }, [
            p(F, {
              "board-id": e.boardId,
              field: { ...e.field, cardinality: "one" },
              "model-value": G,
              "input-id": n.value + "-" + S.value[re],
              disabled: i.value,
              "editor-tag": e.editorTag,
              "link-tag": e.linkTag,
              "onUpdate:modelValue": (fe) => O(re, fe),
              onValidity: (fe) => Z(S.value[re], fe)
            }, null, 8, ["board-id", "field", "model-value", "input-id", "disabled", "editor-tag", "link-tag", "onUpdate:modelValue", "onValidity"])
          ]))), 128)),
          p(r(X), {
            label: "Add value",
            severity: "secondary",
            size: "small",
            disabled: i.value,
            onClick: _,
            outlined: ""
          }, {
            icon: L(() => [
              p(r(J), {
                icon: "tabler:plus",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled"])
        ])) : e.editorTag && g.value ? (u(), B(za(e.editorTag), {
          key: 2,
          "board-id": e.boardId,
          value: JSON.stringify(e.modelValue ?? null),
          config: JSON.stringify(e.field.config ?? {}),
          readonly: i.value || void 0,
          onChange: Me
        }, null, 40, ["board-id", "value", "config", "readonly"])) : e.linkTag && f.value ? (u(), B(za(e.linkTag), {
          key: 3,
          "board-id": e.boardId,
          kind: e.field.config?.target ?? e.field.type,
          value: JSON.stringify(e.modelValue ?? null),
          readonly: i.value || void 0,
          onChange: pe
        }, null, 40, ["board-id", "kind", "value", "readonly"])) : e.field.type === "option" ? (u(), B(r(le), {
          key: 4,
          placeholder: "Not set",
          inputId: n.value,
          "model-value": e.modelValue ?? "",
          disabled: i.value,
          "onUpdate:modelValue": k[0] || (k[0] = (G) => $(G || void 0)),
          appendTo: "self",
          optionLabel: "label",
          optionValue: "value",
          optionDisabled: "disabled",
          options: [{ label: "Not set", value: "", disabled: !1 }, ...(e.field.options ?? []).map((G) => ({ label: G.label ?? G.id, value: G.id, disabled: !1 }))]
        }, null, 8, ["inputId", "model-value", "disabled", "options"])) : e.field.form === "bool" ? (u(), h("label", hi, [
          p(r(Mt), {
            inputId: n.value,
            "model-value": e.modelValue === !0,
            disabled: i.value,
            "onUpdate:modelValue": k[1] || (k[1] = (G) => $(G)),
            binary: ""
          }, null, 8, ["inputId", "model-value", "disabled"]),
          M(D(e.modelValue === !0 ? "Yes" : e.modelValue === !1 ? "No" : "Not set"), 1)
        ])) : e.field.form === "int" ? (u(), B(r(He), {
          key: 6,
          inputId: n.value,
          "model-value": v.value === "" ? null : Number(v.value),
          disabled: i.value,
          "onUpdate:modelValue": k[2] || (k[2] = (G) => N(G == null ? "" : String(G))),
          useGrouping: !1
        }, null, 8, ["inputId", "model-value", "disabled"])) : e.field.form === "dec" ? (u(), B(r(de), {
          key: 7,
          id: n.value,
          inputmode: "decimal",
          "model-value": v.value,
          disabled: i.value,
          "onUpdate:modelValue": k[3] || (k[3] = (G) => N(G ?? ""))
        }, null, 8, ["id", "model-value", "disabled"])) : e.field.form === "time" ? (u(), B(r(de), {
          key: 8,
          id: n.value,
          type: Y.value ? "date" : "datetime-local",
          value: ge.value,
          disabled: i.value,
          onInput: k[4] || (k[4] = (G) => se(G.target.value))
        }, null, 8, ["id", "type", "value", "disabled"])) : e.field.type === "principal" ? (u(), h("div", {
          key: 9,
          inert: i.value || void 0,
          class: "work-stack work-tight"
        }, [
          o.value ? (u(), h("wc-principal-picker", {
            key: 0,
            value: JSON.stringify(e.modelValue ?? {}),
            kinds: "user,group",
            onConfigChanged: H
          }, null, 40, gi)) : (u(), h("span", ki, D(r(Ut)(e.modelValue, e.field)) + " · Person picker is unavailable.", 1))
        ], 8, yi)) : e.field.config?.target === "component" ? (u(), h("div", {
          key: 10,
          inert: i.value || void 0
        }, [
          o.value ? (u(), h("wc-component-picker", {
            key: 0,
            value: JSON.stringify({ thread_id: m.value }),
            onChange: P
          }, null, 40, Vi)) : (u(), h("span", $i, "Component picker is unavailable."))
        ], 8, wi)) : e.field.type === "item" ? (u(), h("div", xi, [
          p(r(Pe), {
            class: "kx-tag-sm",
            severity: "secondary"
          }, {
            default: L(() => [
              M(D(r(Ut)(e.modelValue, e.field)), 1)
            ]),
            _: 1
          }),
          p(r(de), {
            id: n.value,
            modelValue: w.value,
            "onUpdate:modelValue": k[5] || (k[5] = (G) => w.value = G),
            disabled: i.value,
            placeholder: "Search a title or enter an item key",
            "aria-label": "Search items"
          }, null, 8, ["id", "modelValue", "disabled"]),
          d("div", Si, [
            (u(!0), h(q, null, ae(U.value, (G) => (u(), B(Ha, {
              key: G.id,
              class: "work-match-item",
              disabled: i.value,
              onActivate: (re) => b(G)
            }, {
              default: L(() => [
                d("code", Ci, D(G.key), 1),
                d("span", null, D(r(Ut)(G.values.title)), 1)
              ]),
              _: 2
            }, 1032, ["disabled", "onActivate"]))), 128))
          ]),
          e.modelValue ? (u(), B(r(X), {
            key: 0,
            label: "Clear reference",
            severity: "secondary",
            size: "small",
            disabled: i.value,
            onClick: k[6] || (k[6] = (G) => $(void 0)),
            outlined: ""
          }, {
            icon: L(() => [
              p(r(J), {
                icon: "tabler:list-check",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled"])) : I("", !0)
        ])) : e.field.form === "record" || e.field.type === "rich_text" || e.field.form === "quantity" || e.field.form === "ref" ? (u(), B(r(ea), {
          key: 12,
          id: n.value,
          "model-value": ee.value,
          rows: "3",
          disabled: i.value,
          "aria-invalid": !!y.value,
          "onUpdate:modelValue": k[7] || (k[7] = (G) => A(G ?? ""))
        }, null, 8, ["id", "model-value", "disabled", "aria-invalid"])) : e.field.code === "description" ? (u(), B(r(ea), {
          key: 13,
          id: n.value,
          "model-value": v.value,
          rows: "4",
          disabled: i.value,
          "onUpdate:modelValue": k[8] || (k[8] = (G) => $(G))
        }, null, 8, ["id", "model-value", "disabled"])) : (u(), B(r(de), {
          key: 14,
          id: n.value,
          "model-value": v.value,
          disabled: i.value,
          "onUpdate:modelValue": k[9] || (k[9] = (G) => $(G))
        }, null, 8, ["id", "model-value", "disabled"])),
        y.value ? (u(), h("span", Ei, D(y.value), 1)) : I("", !0)
      ]);
    };
  }
}), Ti = { class: "work-stack work-tight work-operand-control" }, Ui = { class: "work-row work-small" }, Di = {
  key: 1,
  class: "work-muted work-small"
}, Ii = {
  key: 2,
  class: "work-stack work-tight"
}, Ai = { class: "work-small" }, Pi = {
  key: 0,
  class: "work-error work-small",
  role: "alert"
}, Wt = /* @__PURE__ */ ce({
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
    const t = e, a = l, n = W(() => "$actor" in Ge(t.modelValue) ? "actor" : "$now" in Ge(t.modelValue) ? "now" : "literal"), s = z(""), c = z("");
    Ee(() => t.modelValue, (i) => {
      s.value = JSON.stringify(i ?? []), c.value = "";
    }, { immediate: !0 });
    function v(i) {
      a("update:modelValue", i === "actor" ? { $actor: "id" } : i === "now" ? { $now: "P0D" } : void 0), a("validity", !0);
    }
    function m(i) {
      s.value = i;
      try {
        const o = JSON.parse(i);
        if (!Array.isArray(o)) throw new Error("Enter a JSON list.");
        c.value = "", a("validity", !0), a("update:modelValue", o);
      } catch (o) {
        c.value = o instanceof Error ? o.message : "Invalid values.", a("validity", !1);
      }
    }
    return (i, o) => (u(), h("div", Ti, [
      d("label", Ui, [
        M(D(e.label), 1),
        p(r(le), {
          "aria-label": e.label + " operand",
          "model-value": n.value,
          disabled: e.disabled,
          "onUpdate:modelValue": o[0] || (o[0] = (f) => v(f)),
          appendTo: "self",
          optionLabel: "label",
          optionValue: "value",
          optionDisabled: "disabled",
          options: [{ label: "Value", value: "literal", disabled: !1 }, { label: "Current actor ($actor)", value: "actor", disabled: !1 }, { label: "Current time ($now)", value: "now", disabled: !1 }]
        }, null, 8, ["aria-label", "model-value", "disabled"])
      ]),
      n.value === "now" ? (u(), B(r(de), {
        key: 0,
        "aria-label": e.label + " time offset",
        value: r(Ge)(e.modelValue).$now,
        disabled: e.disabled,
        placeholder: "-P7D",
        onInput: o[1] || (o[1] = (f) => a("update:modelValue", { $now: f.target.value }))
      }, null, 8, ["aria-label", "value", "disabled"])) : n.value === "actor" ? (u(), h("span", Di, "The signed-in actor’s id")) : e.multiple ? (u(), h("div", Ii, [
        d("label", Ai, [
          o[5] || (o[5] = M("Values as JSON (operands may appear in the list)", -1)),
          p(r(ea), {
            class: "work-mono",
            "aria-label": e.label + " values",
            value: s.value,
            disabled: e.disabled,
            rows: "2",
            onInput: o[2] || (o[2] = (f) => m(f.target.value))
          }, null, 8, ["aria-label", "value", "disabled"])
        ]),
        c.value ? (u(), h("p", Pi, D(c.value), 1)) : I("", !0)
      ])) : (u(), B(Ol, {
        key: 3,
        "board-id": e.boardId,
        field: { ...e.field, cardinality: "one" },
        "model-value": e.modelValue,
        disabled: e.disabled,
        "input-id": e.label.replace(/[^a-z0-9]/gi, "-"),
        "onUpdate:modelValue": o[3] || (o[3] = (f) => a("update:modelValue", f)),
        onValidity: o[4] || (o[4] = (f) => a("validity", f))
      }, null, 8, ["board-id", "field", "model-value", "disabled", "input-id"]))
    ]));
  }
}), Oi = ["disabled"], Ri = { class: "work-small work-mono" }, Ni = { class: "work-row work-small" }, Mi = { class: "work-row work-wrap" }, Li = { key: 3 }, zi = { class: "work-row work-wrap" }, Bi = { class: "work-row" }, Fi = { class: "work-row" }, ji = { class: "work-row" }, qi = {
  key: 3,
  class: "work-row work-wrap"
}, Wi = { class: "work-row work-wrap" }, Gi = /* @__PURE__ */ ce({
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
    const t = e, a = l, n = W(() => t.path ?? "where"), s = W(() => t.depth ?? 1), c = W(() => ["and", "or", "not", "history", "match", "rel", "children"].find((H) => H in t.modelValue) ?? "field"), v = W(() => ci(t.schema)), m = W(() => v.value.find((H) => H.code === t.modelValue.field) ?? { code: "value", form: "text" }), i = W(() => Ge(t.modelValue.history)), o = W(() => v.value.find((H) => H.code === i.value.field) ?? { code: "history", form: "text" }), f = W(() => Array.isArray(t.modelValue[c.value]) ? t.modelValue[c.value] : []), g = () => ({ field: "category", op: "eq", value: "unstarted" }), y = z(/* @__PURE__ */ new Set());
    function w(H, P) {
      P ? y.value.delete(H) : y.value.add(H), a("validity", y.value.size === 0);
    }
    Ee(c, () => {
      y.value.clear(), a("validity", !0);
    });
    function U(H) {
      const P = /* @__PURE__ */ new Set();
      for (const ee of y.value) {
        const x = Number(ee);
        !Number.isNaN(x) && x !== H && P.add(String(x > H ? x - 1 : x));
      }
      y.value = P, a("validity", P.size === 0), S({ [c.value]: f.value.filter((ee, x) => x !== H) });
    }
    function R(H) {
      a("update:modelValue", H);
    }
    function S(H) {
      R({ ...t.modelValue, ...H });
    }
    function T(H) {
      R(H === "field" ? g() : H === "and" || H === "or" ? { [H]: [g()] } : H === "not" ? { not: g() } : H === "history" ? { history: { field: "state", changed: !0 } } : H === "match" ? { match: "" } : H === "children" ? { children: !0, q: "some", where: g() } : { rel: t.schema.compiled.relation_types?.[0]?.id ?? "", dir: "outward", q: "some", where: g() });
    }
    function E(H, P) {
      S({ [c.value]: f.value.map((ee, x) => x === H ? P : ee) });
    }
    function C(H, P) {
      const ee = { ...i.value };
      P === void 0 ? (delete ee[H], w(H, !0)) : ee[H] = P, S({ history: ee });
    }
    function $(H) {
      y.value.clear(), a("validity", !0);
      const P = { ...i.value };
      delete P.was, delete P.changed, delete P.from, delete P.to, P[H] = H === "changed" ? !0 : "", S({ history: P });
    }
    const O = { code: "actor", form: "text" }, Z = { code: "at", form: "time" }, ue = W(() => Array.isArray(i.value.during) ? i.value.during : []);
    function _(H, P) {
      const ee = [...ue.value];
      ee[H] = P, C("during", ee);
    }
    return (H, P) => {
      const ee = Sl("FilterNode", !0);
      return u(), h("fieldset", {
        class: "work-filter-node",
        disabled: e.disabled
      }, [
        d("legend", Ri, D(n.value), 1),
        d("label", Ni, [
          P[21] || (P[21] = M("Condition", -1)),
          p(r(le), {
            "aria-label": n.value + " condition",
            "model-value": c.value,
            "onUpdate:modelValue": P[0] || (P[0] = (x) => T(x)),
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            optionDisabled: "disabled",
            options: [{ label: "Field", value: "field", disabled: !1 }, ...["and", "or", "not", "history", "rel", "children", "match"].map((x) => ({ label: x, value: x, disabled: s.value >= 6 && ["and", "or", "not", "rel", "children"].includes(x) }))]
          }, null, 8, ["aria-label", "model-value", "options"])
        ]),
        c.value === "and" || c.value === "or" ? (u(), h(q, { key: 0 }, [
          (u(!0), h(q, null, ae(f.value, (x, A) => (u(), h("div", {
            key: A,
            class: "work-stack work-tight"
          }, [
            p(ee, {
              "board-id": e.boardId,
              schema: e.schema,
              "model-value": x,
              path: n.value + "." + c.value + "[" + A + "]",
              depth: s.value + 1,
              "onUpdate:modelValue": (N) => E(A, N),
              onValidity: (N) => w(String(A), N)
            }, null, 8, ["board-id", "schema", "model-value", "path", "depth", "onUpdate:modelValue", "onValidity"]),
            p(r(X), {
              label: "Remove condition",
              size: "small",
              severity: "secondary",
              onClick: (N) => U(A),
              outlined: ""
            }, {
              icon: L(() => [
                p(r(J), {
                  icon: "tabler:trash",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["onClick"])
          ]))), 128)),
          p(r(X), {
            label: "Add condition",
            size: "small",
            severity: "secondary",
            disabled: s.value >= 6,
            onClick: P[1] || (P[1] = (x) => S({ [c.value]: [...f.value, g()] })),
            outlined: ""
          }, {
            icon: L(() => [
              p(r(J), {
                icon: "tabler:plus",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled"])
        ], 64)) : c.value === "not" ? (u(), B(ee, {
          key: 1,
          "board-id": e.boardId,
          schema: e.schema,
          "model-value": r(Ge)(e.modelValue.not),
          path: n.value + ".not",
          depth: s.value + 1,
          "onUpdate:modelValue": P[2] || (P[2] = (x) => S({ not: x })),
          onValidity: P[3] || (P[3] = (x) => w("nested", x))
        }, null, 8, ["board-id", "schema", "model-value", "path", "depth"])) : c.value === "field" ? (u(), h(q, { key: 2 }, [
          d("div", Mi, [
            d("label", null, [
              P[22] || (P[22] = M("Field", -1)),
              p(r(le), {
                "aria-label": n.value + " field",
                "model-value": e.modelValue.field,
                "onUpdate:modelValue": P[4] || (P[4] = (x) => S({ field: x, op: "eq", value: void 0 })),
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                optionDisabled: "disabled",
                options: [...(v.value ?? []).map((x) => ({ label: r(xt)(x), value: x.code, disabled: !1 }))]
              }, null, 8, ["aria-label", "model-value", "options"])
            ]),
            d("label", null, [
              P[23] || (P[23] = M("Operator", -1)),
              p(r(le), {
                "aria-label": n.value + " operator",
                "model-value": e.modelValue.op,
                "onUpdate:modelValue": P[5] || (P[5] = (x) => S({ op: x, value: x === "is_null" ? !0 : void 0 })),
                appendTo: "self",
                options: r(mi)(m.value)
              }, null, 8, ["aria-label", "model-value", "options"])
            ])
          ]),
          p(Wt, {
            "board-id": e.boardId,
            field: e.modelValue.op === "is_null" ? { code: "null", form: "bool" } : m.value,
            "model-value": e.modelValue.value,
            multiple: ["in", "nin", "between"].includes(String(e.modelValue.op)),
            label: n.value + " value",
            "onUpdate:modelValue": P[6] || (P[6] = (x) => S({ value: x })),
            onValidity: P[7] || (P[7] = (x) => w("value", x))
          }, null, 8, ["board-id", "field", "model-value", "multiple", "label"])
        ], 64)) : c.value === "match" ? (u(), h("label", Li, [
          P[24] || (P[24] = M("Search", -1)),
          p(r(de), {
            "aria-label": n.value + " search",
            value: e.modelValue.match,
            onInput: P[8] || (P[8] = (x) => S({ match: x.target.value }))
          }, null, 8, ["aria-label", "value"])
        ])) : c.value === "history" ? (u(), h(q, { key: 4 }, [
          d("div", zi, [
            d("label", null, [
              P[25] || (P[25] = M("Field", -1)),
              p(r(le), {
                "aria-label": n.value + " history field",
                "model-value": i.value.field,
                "onUpdate:modelValue": P[9] || (P[9] = (x) => C("field", x)),
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                optionDisabled: "disabled",
                options: [...(v.value ?? []).map((x) => ({ label: r(xt)(x), value: x.code, disabled: !1 }))]
              }, null, 8, ["aria-label", "model-value", "options"])
            ]),
            d("label", null, [
              P[26] || (P[26] = M("History", -1)),
              p(r(le), {
                "aria-label": n.value + " history mode",
                "model-value": i.value.changed ? "changed" : "was",
                "onUpdate:modelValue": P[10] || (P[10] = (x) => $(x)),
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                optionDisabled: "disabled",
                options: [{ label: "Changed", value: "changed", disabled: !1 }, { label: "Was", value: "was", disabled: !1 }]
              }, null, 8, ["aria-label", "model-value"])
            ])
          ]),
          i.value.changed ? (u(), h(q, { key: 0 }, ae(["from", "to"], (x) => d("div", { key: x }, [
            d("label", Bi, [
              p(r(Mt), {
                "model-value": x in i.value,
                "aria-label": "Constrain " + x,
                "onUpdate:modelValue": (A) => C(x, A ? "" : void 0),
                binary: ""
              }, null, 8, ["model-value", "aria-label", "onUpdate:modelValue"]),
              M(D(x), 1)
            ]),
            x in i.value ? (u(), B(Wt, {
              key: 0,
              "board-id": e.boardId,
              field: o.value,
              "model-value": i.value[x],
              label: n.value + " history " + x,
              "onUpdate:modelValue": (A) => C(x, A),
              onValidity: (A) => w(x, A)
            }, null, 8, ["board-id", "field", "model-value", "label", "onUpdate:modelValue", "onValidity"])) : I("", !0)
          ])), 64)) : (u(), B(Wt, {
            key: 1,
            "board-id": e.boardId,
            field: o.value,
            "model-value": i.value.was,
            label: n.value + " history was",
            "onUpdate:modelValue": P[11] || (P[11] = (x) => C("was", x)),
            onValidity: P[12] || (P[12] = (x) => w("was", x))
          }, null, 8, ["board-id", "field", "model-value", "label"])),
          d("label", Fi, [
            p(r(Mt), {
              "model-value": "by" in i.value,
              "aria-label": "Constrain actor",
              "onUpdate:modelValue": P[13] || (P[13] = (x) => C("by", x ? { $actor: "id" } : void 0)),
              binary: ""
            }, null, 8, ["model-value"]),
            P[27] || (P[27] = M("By actor", -1))
          ]),
          "by" in i.value ? (u(), B(Wt, {
            key: 2,
            "board-id": e.boardId,
            field: O,
            "model-value": i.value.by,
            label: n.value + " history by",
            "onUpdate:modelValue": P[14] || (P[14] = (x) => C("by", x))
          }, null, 8, ["board-id", "model-value", "label"])) : I("", !0),
          d("label", ji, [
            p(r(Mt), {
              "model-value": "during" in i.value,
              "aria-label": "Constrain time window",
              "onUpdate:modelValue": P[15] || (P[15] = (x) => C("during", x ? [{ $now: "-P30D" }, { $now: "P0D" }] : void 0)),
              binary: ""
            }, null, 8, ["model-value"]),
            P[28] || (P[28] = M("During", -1))
          ]),
          "during" in i.value ? (u(), h("div", qi, [
            (u(), h(q, null, ae(["start", "end"], (x, A) => p(Wt, {
              key: x,
              "board-id": e.boardId,
              field: Z,
              "model-value": ue.value[A],
              label: n.value + " during " + x,
              "onUpdate:modelValue": (N) => _(A, N)
            }, null, 8, ["board-id", "model-value", "label", "onUpdate:modelValue"])), 64))
          ])) : I("", !0)
        ], 64)) : (u(), h(q, { key: 5 }, [
          d("div", Wi, [
            c.value === "rel" ? (u(), h(q, { key: 0 }, [
              d("label", null, [
                P[29] || (P[29] = M("Relation", -1)),
                p(r(le), {
                  "model-value": e.modelValue.rel,
                  "onUpdate:modelValue": P[16] || (P[16] = (x) => S({ rel: x })),
                  appendTo: "self",
                  optionLabel: "label",
                  optionValue: "value",
                  optionDisabled: "disabled",
                  options: [...(e.schema.compiled.relation_types ?? []).map((x) => ({ label: x.outward ?? x.id, value: x.id, disabled: !1 }))]
                }, null, 8, ["model-value", "options"])
              ]),
              d("label", null, [
                P[30] || (P[30] = M("Direction", -1)),
                p(r(le), {
                  "model-value": e.modelValue.dir,
                  "onUpdate:modelValue": P[17] || (P[17] = (x) => S({ dir: x })),
                  appendTo: "self",
                  optionLabel: "label",
                  optionValue: "value",
                  optionDisabled: "disabled",
                  options: [{ label: "Outward", value: "outward", disabled: !1 }, { label: "Inward", value: "inward", disabled: !1 }]
                }, null, 8, ["model-value"])
              ])
            ], 64)) : I("", !0),
            d("label", null, [
              P[31] || (P[31] = M("Quantifier", -1)),
              p(r(le), {
                "model-value": e.modelValue.q,
                "onUpdate:modelValue": P[18] || (P[18] = (x) => S({ q: x })),
                appendTo: "self",
                options: ["some", "every", "none"]
              }, null, 8, ["model-value"])
            ])
          ]),
          p(ee, {
            "board-id": e.boardId,
            schema: e.schema,
            "model-value": r(Ge)(e.modelValue.where),
            path: n.value + ".where",
            depth: s.value + 1,
            "onUpdate:modelValue": P[19] || (P[19] = (x) => S({ where: x })),
            onValidity: P[20] || (P[20] = (x) => w("nested", x))
          }, null, 8, ["board-id", "schema", "model-value", "path", "depth"])
        ], 64))
      ], 8, Oi);
    };
  }
}), Yi = { class: "work-stack work-tight" }, Ki = { class: "work-row work-small" }, Za = /* @__PURE__ */ ce({
  __name: "ConditionEditor",
  props: {
    modelValue: {},
    draft: {},
    boardId: {},
    label: {}
  },
  emits: ["update:modelValue", "validity"],
  setup(e, { emit: l }) {
    const t = e, a = l, n = W(() => ({ declaration: t.draft, compiled: t.draft, generation: 0, as_of: 0, key_prefix: "" })), s = /* @__PURE__ */ new Set();
    function c(m, i) {
      i ? s.delete(m) : s.add(m), a("validity", !s.size);
    }
    function v(m) {
      a("update:modelValue", m ? { field: t.draft.fields?.[0]?.code ?? "state", op: "eq" } : void 0), m || (s.clear(), a("validity", !0));
    }
    return mt(() => a("validity", !0)), (m, i) => (u(), h("section", Yi, [
      d("label", Ki, [
        p(r(Ne), {
          "model-value": e.modelValue != null,
          "aria-label": e.label,
          "onUpdate:modelValue": v
        }, null, 8, ["model-value", "aria-label"]),
        M(D(e.label), 1)
      ]),
      e.modelValue != null ? (u(), B(Gi, {
        key: 0,
        schema: n.value,
        "board-id": e.boardId ?? "",
        "model-value": r(Ge)(e.modelValue),
        path: e.label,
        "onUpdate:modelValue": i[0] || (i[0] = (o) => a("update:modelValue", o)),
        onValidity: i[1] || (i[1] = (o) => c("structured", o))
      }, null, 8, ["schema", "board-id", "model-value", "path"])) : I("", !0),
      e.modelValue != null ? (u(), B(at, {
        key: 1,
        label: e.label + " predicate",
        "model-value": e.modelValue,
        hint: "Use any predicate accepted by Work, including installed or deeply nested forms.",
        "onUpdate:modelValue": i[2] || (i[2] = (o) => a("update:modelValue", o)),
        onValidity: i[3] || (i[3] = (o) => c("raw", o))
      }, null, 8, ["label", "model-value"])) : I("", !0)
    ]));
  }
}), Hi = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, Xi = ["aria-label"], Ji = { class: "work-field-label" }, Zi = {
  key: 0,
  class: "work-chips"
}, Qi = ["kinds"], _i = {
  key: 2,
  class: "work-muted work-small"
}, Qa = /* @__PURE__ */ ce({
  __name: "PrincipalsPicker",
  props: {
    modelValue: {},
    label: {},
    kinds: {},
    boardId: {}
  },
  emits: ["update:modelValue"],
  setup(e, { emit: l }) {
    const t = e, a = l, n = z(!1), s = z(0), c = W(() => t.modelValue ?? []), { principalLabel: v, rememberPrincipal: m, nameError: i } = Tl(() => t.boardId ?? "", () => c.value);
    wa(async () => {
      n.value = await Nt("wc-principal-picker");
    });
    function o(f) {
      const g = f.detail, y = g?.principal_id ?? g?.id;
      if (!y) return;
      const w = { kind: g.type ?? "user", id: y };
      g.label && m(w, g.label), c.value.some((U) => U.id === y && U.kind === w.kind) || a("update:modelValue", [...c.value, w]), s.value++;
    }
    return (f, g) => (u(), h(q, null, [
      r(i) ? (u(), h("p", Hi, D(r(i)), 1)) : I("", !0),
      d("section", {
        class: "work-stack work-tight work-principals-picker",
        "aria-label": e.label
      }, [
        d("h4", Ji, D(e.label), 1),
        c.value.length ? (u(), h("div", Zi, [
          (u(!0), h(q, null, ae(c.value, (y, w) => (u(), B(r(Pe), {
            key: y.kind + y.id,
            severity: "secondary",
            class: "kx-tag-sm"
          }, {
            default: L(() => [
              M(D(r(v)(y)), 1),
              p(r(X), {
                text: "",
                severity: "secondary",
                size: "small",
                "aria-label": "Remove " + r(v)(y),
                onClick: (U) => a("update:modelValue", c.value.filter((R, S) => S !== w))
              }, {
                default: L(() => [
                  p(r(J), { icon: "tabler:x" })
                ]),
                _: 1
              }, 8, ["aria-label", "onClick"])
            ]),
            _: 2
          }, 1024))), 128))
        ])) : I("", !0),
        n.value ? (u(), h("wc-principal-picker", {
          key: s.value,
          kinds: e.kinds ?? "user,group",
          onConfigChanged: o
        }, null, 40, Qi)) : (u(), h("p", _i, "People and group picker is unavailable."))
      ], 8, Xi)
    ], 64));
  }
}), en = { class: "work-stack work-tight" }, Rl = /* @__PURE__ */ ce({
  __name: "HoldersPicker",
  props: {
    modelValue: {},
    label: {},
    boardId: {}
  },
  emits: ["update:modelValue", "validity"],
  setup(e, { emit: l }) {
    const t = e, a = l, n = W(() => (t.modelValue ?? []).flatMap((c) => "user" in c ? [{ kind: "user", id: c.user }] : "group" in c ? [{ kind: "group", id: c.group }] : []));
    function s(c) {
      const v = [...(t.modelValue ?? []).filter((m) => "field" in m || "service" in m), ...c.map((m) => m.kind === "group" ? { group: m.id } : { user: m.id })];
      a("update:modelValue", v.length ? v : void 0);
    }
    return (c, v) => (u(), h("div", en, [
      p(Qa, {
        "board-id": e.boardId,
        label: e.label,
        "model-value": n.value,
        "onUpdate:modelValue": s
      }, null, 8, ["board-id", "label", "model-value"]),
      p(at, {
        label: e.label + " rules",
        "model-value": e.modelValue,
        shape: "array",
        example: [{ group: "selected-group" }],
        "onUpdate:modelValue": v[0] || (v[0] = (m) => a("update:modelValue", m)),
        onValidity: v[1] || (v[1] = (m) => a("validity", m))
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
function tn(e, l, t) {
  return (l = nn(l)) in e ? Object.defineProperty(e, l, {
    value: t,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : e[l] = t, e;
}
function lt() {
  return lt = Object.assign ? Object.assign.bind() : function(e) {
    for (var l = 1; l < arguments.length; l++) {
      var t = arguments[l];
      for (var a in t) ({}).hasOwnProperty.call(t, a) && (e[a] = t[a]);
    }
    return e;
  }, lt.apply(null, arguments);
}
function cl(e, l) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var a = Object.getOwnPropertySymbols(e);
    l && (a = a.filter(function(n) {
      return Object.getOwnPropertyDescriptor(e, n).enumerable;
    })), t.push.apply(t, a);
  }
  return t;
}
function Qe(e) {
  for (var l = 1; l < arguments.length; l++) {
    var t = arguments[l] != null ? arguments[l] : {};
    l % 2 ? cl(Object(t), !0).forEach(function(a) {
      tn(e, a, t[a]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : cl(Object(t)).forEach(function(a) {
      Object.defineProperty(e, a, Object.getOwnPropertyDescriptor(t, a));
    });
  }
  return e;
}
function an(e, l) {
  if (e == null) return {};
  var t, a, n = ln(e, l);
  if (Object.getOwnPropertySymbols) {
    var s = Object.getOwnPropertySymbols(e);
    for (a = 0; a < s.length; a++) t = s[a], l.indexOf(t) === -1 && {}.propertyIsEnumerable.call(e, t) && (n[t] = e[t]);
  }
  return n;
}
function ln(e, l) {
  if (e == null) return {};
  var t = {};
  for (var a in e) if ({}.hasOwnProperty.call(e, a)) {
    if (l.indexOf(a) !== -1) continue;
    t[a] = e[a];
  }
  return t;
}
function on(e, l) {
  if (typeof e != "object" || !e) return e;
  var t = e[Symbol.toPrimitive];
  if (t !== void 0) {
    var a = t.call(e, l);
    if (typeof a != "object") return a;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (l === "string" ? String : Number)(e);
}
function nn(e) {
  var l = on(e, "string");
  return typeof l == "symbol" ? l : l + "";
}
function ja(e) {
  "@babel/helpers - typeof";
  return ja = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(l) {
    return typeof l;
  } : function(l) {
    return l && typeof Symbol == "function" && l.constructor === Symbol && l !== Symbol.prototype ? "symbol" : typeof l;
  }, ja(e);
}
var sn = "1.15.7";
function tt(e) {
  if (typeof window < "u" && window.navigator)
    return !!/* @__PURE__ */ navigator.userAgent.match(e);
}
var ot = tt(/(?:Trident.*rv[ :]?11\.|msie|iemobile|Windows Phone)/i), aa = tt(/Edge/i), ml = tt(/firefox/i), Xt = tt(/safari/i) && !tt(/chrome/i) && !tt(/android/i), _a = tt(/iP(ad|od|hone)/i), Nl = tt(/chrome/i) && tt(/android/i), Ml = {
  capture: !1,
  passive: !1
};
function ve(e, l, t) {
  e.addEventListener(l, t, !ot && Ml);
}
function me(e, l, t) {
  e.removeEventListener(l, t, !ot && Ml);
}
function pa(e, l) {
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
function Ll(e) {
  return e.host && e !== document && e.host.nodeType && e.host !== e ? e.host : e.parentNode;
}
function Ke(e, l, t, a) {
  if (e) {
    t = t || document;
    do {
      if (l != null && (l[0] === ">" ? e.parentNode === t && pa(e, l) : pa(e, l)) || a && e === t)
        return e;
      if (e === t) break;
    } while (e = Ll(e));
  }
  return null;
}
var vl = /\s+/g;
function Be(e, l, t) {
  if (e && l)
    if (e.classList)
      e.classList[t ? "add" : "remove"](l);
    else {
      var a = (" " + e.className + " ").replace(vl, " ").replace(" " + l + " ", " ");
      e.className = (a + (t ? " " + l : "")).replace(vl, " ");
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
  var n = window.DOMMatrix || window.WebKitCSSMatrix || window.CSSMatrix || window.MSCSSMatrix;
  return n && new n(t);
}
function zl(e, l, t) {
  if (e) {
    var a = e.getElementsByTagName(l), n = 0, s = a.length;
    if (t)
      for (; n < s; n++)
        t(a[n], n);
    return a;
  }
  return [];
}
function Ze() {
  var e = document.scrollingElement;
  return e || document.documentElement;
}
function Ce(e, l, t, a, n) {
  if (!(!e.getBoundingClientRect && e !== window)) {
    var s, c, v, m, i, o, f;
    if (e !== window && e.parentNode && e !== Ze() ? (s = e.getBoundingClientRect(), c = s.top, v = s.left, m = s.bottom, i = s.right, o = s.height, f = s.width) : (c = 0, v = 0, m = window.innerHeight, i = window.innerWidth, o = window.innerHeight, f = window.innerWidth), (l || t) && e !== window && (n = n || e.parentNode, !ot))
      do
        if (n && n.getBoundingClientRect && (oe(n, "transform") !== "none" || t && oe(n, "position") !== "static")) {
          var g = n.getBoundingClientRect();
          c -= g.top + parseInt(oe(n, "border-top-width")), v -= g.left + parseInt(oe(n, "border-left-width")), m = c + s.height, i = v + s.width;
          break;
        }
      while (n = n.parentNode);
    if (a && e !== window) {
      var y = Lt(n || e), w = y && y.a, U = y && y.d;
      y && (c /= U, v /= w, f /= w, o /= U, m = c + o, i = v + f);
    }
    return {
      top: c,
      left: v,
      bottom: m,
      right: i,
      width: f,
      height: o
    };
  }
}
function fl(e, l, t) {
  for (var a = ut(e, !0), n = Ce(e)[l]; a; ) {
    var s = Ce(a)[t], c = void 0;
    if (c = n >= s, !c) return a;
    if (a === Ze()) break;
    a = ut(a, !1);
  }
  return !1;
}
function Bt(e, l, t, a) {
  for (var n = 0, s = 0, c = e.children; s < c.length; ) {
    if (c[s].style.display !== "none" && c[s] !== ie.ghost && (a || c[s] !== ie.dragged) && Ke(c[s], t.draggable, e, !1)) {
      if (n === l)
        return c[s];
      n++;
    }
    s++;
  }
  return null;
}
function el(e, l) {
  for (var t = e.lastElementChild; t && (t === ie.ghost || oe(t, "display") === "none" || l && !pa(t, l)); )
    t = t.previousElementSibling;
  return t || null;
}
function qe(e, l) {
  var t = 0;
  if (!e || !e.parentNode)
    return -1;
  for (; e = e.previousElementSibling; )
    e.nodeName.toUpperCase() !== "TEMPLATE" && e !== ie.clone && (!l || pa(e, l)) && t++;
  return t;
}
function pl(e) {
  var l = 0, t = 0, a = Ze();
  if (e)
    do {
      var n = Lt(e), s = n.a, c = n.d;
      l += e.scrollLeft * s, t += e.scrollTop * c;
    } while (e !== a && (e = e.parentNode));
  return [l, t];
}
function rn(e, l) {
  for (var t in e)
    if (e.hasOwnProperty(t)) {
      for (var a in l)
        if (l.hasOwnProperty(a) && l[a] === e[t][a]) return Number(t);
    }
  return -1;
}
function ut(e, l) {
  if (!e || !e.getBoundingClientRect) return Ze();
  var t = e, a = !1;
  do
    if (t.clientWidth < t.scrollWidth || t.clientHeight < t.scrollHeight) {
      var n = oe(t);
      if (t.clientWidth < t.scrollWidth && (n.overflowX == "auto" || n.overflowX == "scroll") || t.clientHeight < t.scrollHeight && (n.overflowY == "auto" || n.overflowY == "scroll")) {
        if (!t.getBoundingClientRect || t === document.body) return Ze();
        if (a || l) return t;
        a = !0;
      }
    }
  while (t = t.parentNode);
  return Ze();
}
function dn(e, l) {
  if (e && l)
    for (var t in l)
      l.hasOwnProperty(t) && (e[t] = l[t]);
  return e;
}
function Da(e, l) {
  return Math.round(e.top) === Math.round(l.top) && Math.round(e.left) === Math.round(l.left) && Math.round(e.height) === Math.round(l.height) && Math.round(e.width) === Math.round(l.width);
}
var Jt;
function Bl(e, l) {
  return function() {
    if (!Jt) {
      var t = arguments, a = this;
      t.length === 1 ? e.call(a, t[0]) : e.apply(a, t), Jt = setTimeout(function() {
        Jt = void 0;
      }, l);
    }
  };
}
function un() {
  clearTimeout(Jt), Jt = void 0;
}
function Fl(e, l, t) {
  e.scrollLeft += l, e.scrollTop += t;
}
function jl(e) {
  var l = window.Polymer, t = window.jQuery || window.Zepto;
  return l && l.dom ? l.dom(e).cloneNode(!0) : t ? t(e).clone(!0)[0] : e.cloneNode(!0);
}
function ql(e, l, t) {
  var a = {};
  return Array.from(e.children).forEach(function(n) {
    var s, c, v, m;
    if (!(!Ke(n, l.draggable, e, !1) || n.animated || n === t)) {
      var i = Ce(n);
      a.left = Math.min((s = a.left) !== null && s !== void 0 ? s : 1 / 0, i.left), a.top = Math.min((c = a.top) !== null && c !== void 0 ? c : 1 / 0, i.top), a.right = Math.max((v = a.right) !== null && v !== void 0 ? v : -1 / 0, i.right), a.bottom = Math.max((m = a.bottom) !== null && m !== void 0 ? m : -1 / 0, i.bottom);
    }
  }), a.width = a.right - a.left, a.height = a.bottom - a.top, a.x = a.left, a.y = a.top, a;
}
var ze = "Sortable" + (/* @__PURE__ */ new Date()).getTime();
function cn() {
  var e = [], l;
  return {
    captureAnimationState: function() {
      if (e = [], !!this.options.animation) {
        var a = [].slice.call(this.el.children);
        a.forEach(function(n) {
          if (!(oe(n, "display") === "none" || n === ie.ghost)) {
            e.push({
              target: n,
              rect: Ce(n)
            });
            var s = Qe({}, e[e.length - 1].rect);
            if (n.thisAnimationDuration) {
              var c = Lt(n, !0);
              c && (s.top -= c.f, s.left -= c.e);
            }
            n.fromRect = s;
          }
        });
      }
    },
    addAnimationState: function(a) {
      e.push(a);
    },
    removeAnimationState: function(a) {
      e.splice(rn(e, {
        target: a
      }), 1);
    },
    animateAll: function(a) {
      var n = this;
      if (!this.options.animation) {
        clearTimeout(l), typeof a == "function" && a();
        return;
      }
      var s = !1, c = 0;
      e.forEach(function(v) {
        var m = 0, i = v.target, o = i.fromRect, f = Ce(i), g = i.prevFromRect, y = i.prevToRect, w = v.rect, U = Lt(i, !0);
        U && (f.top -= U.f, f.left -= U.e), i.toRect = f, i.thisAnimationDuration && Da(g, f) && !Da(o, f) && // Make sure animatingRect is on line between toRect & fromRect
        (w.top - f.top) / (w.left - f.left) === (o.top - f.top) / (o.left - f.left) && (m = vn(w, g, y, n.options)), Da(f, o) || (i.prevFromRect = o, i.prevToRect = f, m || (m = n.options.animation), n.animate(i, w, f, m)), m && (s = !0, c = Math.max(c, m), clearTimeout(i.animationResetTimer), i.animationResetTimer = setTimeout(function() {
          i.animationTime = 0, i.prevFromRect = null, i.fromRect = null, i.prevToRect = null, i.thisAnimationDuration = null;
        }, m), i.thisAnimationDuration = m);
      }), clearTimeout(l), s ? l = setTimeout(function() {
        typeof a == "function" && a();
      }, c) : typeof a == "function" && a(), e = [];
    },
    animate: function(a, n, s, c) {
      if (c) {
        oe(a, "transition", ""), oe(a, "transform", "");
        var v = Lt(this.el), m = v && v.a, i = v && v.d, o = (n.left - s.left) / (m || 1), f = (n.top - s.top) / (i || 1);
        a.animatingX = !!o, a.animatingY = !!f, oe(a, "transform", "translate3d(" + o + "px," + f + "px,0)"), this.forRepaintDummy = mn(a), oe(a, "transition", "transform " + c + "ms" + (this.options.easing ? " " + this.options.easing : "")), oe(a, "transform", "translate3d(0,0,0)"), typeof a.animated == "number" && clearTimeout(a.animated), a.animated = setTimeout(function() {
          oe(a, "transition", ""), oe(a, "transform", ""), a.animated = !1, a.animatingX = !1, a.animatingY = !1;
        }, c);
      }
    }
  };
}
function mn(e) {
  return e.offsetWidth;
}
function vn(e, l, t, a) {
  return Math.sqrt(Math.pow(l.top - e.top, 2) + Math.pow(l.left - e.left, 2)) / Math.sqrt(Math.pow(l.top - t.top, 2) + Math.pow(l.left - t.left, 2)) * a.animation;
}
var It = [], Ia = {
  initializeByDefault: !0
}, la = {
  mount: function(l) {
    for (var t in Ia)
      Ia.hasOwnProperty(t) && !(t in l) && (l[t] = Ia[t]);
    It.forEach(function(a) {
      if (a.pluginName === l.pluginName)
        throw "Sortable: Cannot mount plugin ".concat(l.pluginName, " more than once");
    }), It.push(l);
  },
  pluginEvent: function(l, t, a) {
    var n = this;
    this.eventCanceled = !1, a.cancel = function() {
      n.eventCanceled = !0;
    };
    var s = l + "Global";
    It.forEach(function(c) {
      t[c.pluginName] && (t[c.pluginName][s] && t[c.pluginName][s](Qe({
        sortable: t
      }, a)), t.options[c.pluginName] && t[c.pluginName][l] && t[c.pluginName][l](Qe({
        sortable: t
      }, a)));
    });
  },
  initializePlugins: function(l, t, a, n) {
    It.forEach(function(v) {
      var m = v.pluginName;
      if (!(!l.options[m] && !v.initializeByDefault)) {
        var i = new v(l, t, l.options);
        i.sortable = l, i.options = l.options, l[m] = i, lt(a, i.defaults);
      }
    });
    for (var s in l.options)
      if (l.options.hasOwnProperty(s)) {
        var c = this.modifyOption(l, s, l.options[s]);
        typeof c < "u" && (l.options[s] = c);
      }
  },
  getEventProperties: function(l, t) {
    var a = {};
    return It.forEach(function(n) {
      typeof n.eventProperties == "function" && lt(a, n.eventProperties.call(t[n.pluginName], l));
    }), a;
  },
  modifyOption: function(l, t, a) {
    var n;
    return It.forEach(function(s) {
      l[s.pluginName] && s.optionListeners && typeof s.optionListeners[t] == "function" && (n = s.optionListeners[t].call(l[s.pluginName], a));
    }), n;
  }
};
function fn(e) {
  var l = e.sortable, t = e.rootEl, a = e.name, n = e.targetEl, s = e.cloneEl, c = e.toEl, v = e.fromEl, m = e.oldIndex, i = e.newIndex, o = e.oldDraggableIndex, f = e.newDraggableIndex, g = e.originalEvent, y = e.putSortable, w = e.extraEventProperties;
  if (l = l || t && t[ze], !!l) {
    var U, R = l.options, S = "on" + a.charAt(0).toUpperCase() + a.substr(1);
    window.CustomEvent && !ot && !aa ? U = new CustomEvent(a, {
      bubbles: !0,
      cancelable: !0
    }) : (U = document.createEvent("Event"), U.initEvent(a, !0, !0)), U.to = c || t, U.from = v || t, U.item = n || t, U.clone = s, U.oldIndex = m, U.newIndex = i, U.oldDraggableIndex = o, U.newDraggableIndex = f, U.originalEvent = g, U.pullMode = y ? y.lastPutMode : void 0;
    var T = Qe(Qe({}, w), la.getEventProperties(a, l));
    for (var E in T)
      U[E] = T[E];
    t && t.dispatchEvent(U), R[S] && R[S].call(l, U);
  }
}
var pn = ["evt"], Le = function(l, t) {
  var a = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, n = a.evt, s = an(a, pn);
  la.pluginEvent.bind(ie)(l, t, Qe({
    dragEl: j,
    parentEl: $e,
    ghostEl: ne,
    rootEl: ke,
    nextEl: kt,
    lastDownEl: ca,
    cloneEl: Ve,
    cloneHidden: dt,
    dragStarted: Yt,
    putSortable: Ue,
    activeSortable: ie.active,
    originalEvent: n,
    oldIndex: Rt,
    oldDraggableIndex: Zt,
    newIndex: Fe,
    newDraggableIndex: rt,
    hideGhostForTarget: Kl,
    unhideGhostForTarget: Hl,
    cloneNowHidden: function() {
      dt = !0;
    },
    cloneNowShown: function() {
      dt = !1;
    },
    dispatchSortableEvent: function(v) {
      Re({
        sortable: t,
        name: v,
        originalEvent: n
      });
    }
  }, s));
};
function Re(e) {
  fn(Qe({
    putSortable: Ue,
    cloneEl: Ve,
    targetEl: j,
    rootEl: ke,
    oldIndex: Rt,
    oldDraggableIndex: Zt,
    newIndex: Fe,
    newDraggableIndex: rt
  }, e));
}
var j, $e, ne, ke, kt, ca, Ve, dt, Rt, Fe, Zt, rt, sa, Ue, Pt = !1, ba = !1, ha = [], pt, Ye, Aa, Pa, bl, hl, Yt, At, Qt, _t = !1, ra = !1, ma, Ie, Oa = [], qa = !1, ya = [], Sa = typeof document < "u", da = _a, yl = aa || ot ? "cssFloat" : "float", bn = Sa && !Nl && !_a && "draggable" in document.createElement("div"), Wl = (function() {
  if (Sa) {
    if (ot)
      return !1;
    var e = document.createElement("x");
    return e.style.cssText = "pointer-events:auto", e.style.pointerEvents === "auto";
  }
})(), Gl = function(l, t) {
  var a = oe(l), n = parseInt(a.width) - parseInt(a.paddingLeft) - parseInt(a.paddingRight) - parseInt(a.borderLeftWidth) - parseInt(a.borderRightWidth), s = Bt(l, 0, t), c = Bt(l, 1, t), v = s && oe(s), m = c && oe(c), i = v && parseInt(v.marginLeft) + parseInt(v.marginRight) + Ce(s).width, o = m && parseInt(m.marginLeft) + parseInt(m.marginRight) + Ce(c).width;
  if (a.display === "flex")
    return a.flexDirection === "column" || a.flexDirection === "column-reverse" ? "vertical" : "horizontal";
  if (a.display === "grid")
    return a.gridTemplateColumns.split(" ").length <= 1 ? "vertical" : "horizontal";
  if (s && v.float && v.float !== "none") {
    var f = v.float === "left" ? "left" : "right";
    return c && (m.clear === "both" || m.clear === f) ? "vertical" : "horizontal";
  }
  return s && (v.display === "block" || v.display === "flex" || v.display === "table" || v.display === "grid" || i >= n && a[yl] === "none" || c && a[yl] === "none" && i + o > n) ? "vertical" : "horizontal";
}, hn = function(l, t, a) {
  var n = a ? l.left : l.top, s = a ? l.right : l.bottom, c = a ? l.width : l.height, v = a ? t.left : t.top, m = a ? t.right : t.bottom, i = a ? t.width : t.height;
  return n === v || s === m || n + c / 2 === v + i / 2;
}, yn = function(l, t) {
  var a;
  return ha.some(function(n) {
    var s = n[ze].options.emptyInsertThreshold;
    if (!(!s || el(n))) {
      var c = Ce(n), v = l >= c.left - s && l <= c.right + s, m = t >= c.top - s && t <= c.bottom + s;
      if (v && m)
        return a = n;
    }
  }), a;
}, Yl = function(l) {
  function t(s, c) {
    return function(v, m, i, o) {
      var f = v.options.group.name && m.options.group.name && v.options.group.name === m.options.group.name;
      if (s == null && (c || f))
        return !0;
      if (s == null || s === !1)
        return !1;
      if (c && s === "clone")
        return s;
      if (typeof s == "function")
        return t(s(v, m, i, o), c)(v, m, i, o);
      var g = (c ? v : m).options.group.name;
      return s === !0 || typeof s == "string" && s === g || s.join && s.indexOf(g) > -1;
    };
  }
  var a = {}, n = l.group;
  (!n || ja(n) != "object") && (n = {
    name: n
  }), a.name = n.name, a.checkPull = t(n.pull, !0), a.checkPut = t(n.put), a.revertClone = n.revertClone, l.group = a;
}, Kl = function() {
  !Wl && ne && oe(ne, "display", "none");
}, Hl = function() {
  !Wl && ne && oe(ne, "display", "");
};
Sa && !Nl && document.addEventListener("click", function(e) {
  if (ba)
    return e.preventDefault(), e.stopPropagation && e.stopPropagation(), e.stopImmediatePropagation && e.stopImmediatePropagation(), ba = !1, !1;
}, !0);
var bt = function(l) {
  if (j) {
    l = l.touches ? l.touches[0] : l;
    var t = yn(l.clientX, l.clientY);
    if (t) {
      var a = {};
      for (var n in l)
        l.hasOwnProperty(n) && (a[n] = l[n]);
      a.target = a.rootEl = t, a.preventDefault = void 0, a.stopPropagation = void 0, t[ze]._onDragOver(a);
    }
  }
}, gn = function(l) {
  j && j.parentNode[ze]._isOutsideThisEl(l.target);
};
function ie(e, l) {
  if (!(e && e.nodeType && e.nodeType === 1))
    throw "Sortable: `el` must be an HTMLElement, not ".concat({}.toString.call(e));
  this.el = e, this.options = l = lt({}, l), e[ze] = this;
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
      return Gl(e, this.options);
    },
    ghostClass: "sortable-ghost",
    chosenClass: "sortable-chosen",
    dragClass: "sortable-drag",
    ignore: "a, img",
    filter: null,
    preventOnFilter: !0,
    animation: 0,
    easing: null,
    setData: function(c, v) {
      c.setData("Text", v.textContent);
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
    supportPointer: ie.supportPointer !== !1 && "PointerEvent" in window && (!Xt || _a),
    emptyInsertThreshold: 5
  };
  la.initializePlugins(this, e, t);
  for (var a in t)
    !(a in l) && (l[a] = t[a]);
  Yl(l);
  for (var n in this)
    n.charAt(0) === "_" && typeof this[n] == "function" && (this[n] = this[n].bind(this));
  this.nativeDraggable = l.forceFallback ? !1 : bn, this.nativeDraggable && (this.options.touchStartThreshold = 1), l.supportPointer ? ve(e, "pointerdown", this._onTapStart) : (ve(e, "mousedown", this._onTapStart), ve(e, "touchstart", this._onTapStart)), this.nativeDraggable && (ve(e, "dragover", this), ve(e, "dragenter", this)), ha.push(this.el), l.store && l.store.get && this.sort(l.store.get(this) || []), lt(this, cn());
}
ie.prototype = /** @lends Sortable.prototype */
{
  constructor: ie,
  _isOutsideThisEl: function(l) {
    !this.el.contains(l) && l !== this.el && (At = null);
  },
  _getDirection: function(l, t) {
    return typeof this.options.direction == "function" ? this.options.direction.call(this, l, t, j) : this.options.direction;
  },
  _onTapStart: function(l) {
    if (l.cancelable) {
      var t = this, a = this.el, n = this.options, s = n.preventOnFilter, c = l.type, v = l.touches && l.touches[0] || l.pointerType && l.pointerType === "touch" && l, m = (v || l).target, i = l.target.shadowRoot && (l.path && l.path[0] || l.composedPath && l.composedPath()[0]) || m, o = n.filter;
      if (En(a), !j && !(/mousedown|pointerdown/.test(c) && l.button !== 0 || n.disabled) && !i.isContentEditable && !(!this.nativeDraggable && Xt && m && m.tagName.toUpperCase() === "SELECT") && (m = Ke(m, n.draggable, a, !1), !(m && m.animated) && ca !== m)) {
        if (Rt = qe(m), Zt = qe(m, n.draggable), typeof o == "function") {
          if (o.call(this, l, m, this)) {
            Re({
              sortable: t,
              rootEl: i,
              name: "filter",
              targetEl: m,
              toEl: a,
              fromEl: a
            }), Le("filter", t, {
              evt: l
            }), s && l.preventDefault();
            return;
          }
        } else if (o && (o = o.split(",").some(function(f) {
          if (f = Ke(i, f.trim(), a, !1), f)
            return Re({
              sortable: t,
              rootEl: f,
              name: "filter",
              targetEl: m,
              fromEl: a,
              toEl: a
            }), Le("filter", t, {
              evt: l
            }), !0;
        }), o)) {
          s && l.preventDefault();
          return;
        }
        n.handle && !Ke(i, n.handle, a, !1) || this._prepareDragStart(l, v, m);
      }
    }
  },
  _prepareDragStart: function(l, t, a) {
    var n = this, s = n.el, c = n.options, v = s.ownerDocument, m;
    if (a && !j && a.parentNode === s) {
      var i = Ce(a);
      if (ke = s, j = a, $e = j.parentNode, kt = j.nextSibling, ca = a, sa = c.group, ie.dragged = j, pt = {
        target: j,
        clientX: (t || l).clientX,
        clientY: (t || l).clientY
      }, bl = pt.clientX - i.left, hl = pt.clientY - i.top, this._lastX = (t || l).clientX, this._lastY = (t || l).clientY, j.style["will-change"] = "all", m = function() {
        if (Le("delayEnded", n, {
          evt: l
        }), ie.eventCanceled) {
          n._onDrop();
          return;
        }
        n._disableDelayedDragEvents(), !ml && n.nativeDraggable && (j.draggable = !0), n._triggerDragStart(l, t), Re({
          sortable: n,
          name: "choose",
          originalEvent: l
        }), Be(j, c.chosenClass, !0);
      }, c.ignore.split(",").forEach(function(o) {
        zl(j, o.trim(), Ra);
      }), ve(v, "dragover", bt), ve(v, "mousemove", bt), ve(v, "touchmove", bt), c.supportPointer ? (ve(v, "pointerup", n._onDrop), !this.nativeDraggable && ve(v, "pointercancel", n._onDrop)) : (ve(v, "mouseup", n._onDrop), ve(v, "touchend", n._onDrop), ve(v, "touchcancel", n._onDrop)), ml && this.nativeDraggable && (this.options.touchStartThreshold = 4, j.draggable = !0), Le("delayStart", this, {
        evt: l
      }), c.delay && (!c.delayOnTouchOnly || t) && (!this.nativeDraggable || !(aa || ot))) {
        if (ie.eventCanceled) {
          this._onDrop();
          return;
        }
        c.supportPointer ? (ve(v, "pointerup", n._disableDelayedDrag), ve(v, "pointercancel", n._disableDelayedDrag)) : (ve(v, "mouseup", n._disableDelayedDrag), ve(v, "touchend", n._disableDelayedDrag), ve(v, "touchcancel", n._disableDelayedDrag)), ve(v, "mousemove", n._delayedDragTouchMoveHandler), ve(v, "touchmove", n._delayedDragTouchMoveHandler), c.supportPointer && ve(v, "pointermove", n._delayedDragTouchMoveHandler), n._dragStartTimer = setTimeout(m, c.delay);
      } else
        m();
    }
  },
  _delayedDragTouchMoveHandler: function(l) {
    var t = l.touches ? l.touches[0] : l;
    Math.max(Math.abs(t.clientX - this._lastX), Math.abs(t.clientY - this._lastY)) >= Math.floor(this.options.touchStartThreshold / (this.nativeDraggable && window.devicePixelRatio || 1)) && this._disableDelayedDrag();
  },
  _disableDelayedDrag: function() {
    j && Ra(j), clearTimeout(this._dragStartTimer), this._disableDelayedDragEvents();
  },
  _disableDelayedDragEvents: function() {
    var l = this.el.ownerDocument;
    me(l, "mouseup", this._disableDelayedDrag), me(l, "touchend", this._disableDelayedDrag), me(l, "touchcancel", this._disableDelayedDrag), me(l, "pointerup", this._disableDelayedDrag), me(l, "pointercancel", this._disableDelayedDrag), me(l, "mousemove", this._delayedDragTouchMoveHandler), me(l, "touchmove", this._delayedDragTouchMoveHandler), me(l, "pointermove", this._delayedDragTouchMoveHandler);
  },
  _triggerDragStart: function(l, t) {
    t = t || l.pointerType == "touch" && l, !this.nativeDraggable || t ? this.options.supportPointer ? ve(document, "pointermove", this._onTouchMove) : t ? ve(document, "touchmove", this._onTouchMove) : ve(document, "mousemove", this._onTouchMove) : (ve(j, "dragend", this), ve(ke, "dragstart", this._onDragStart));
    try {
      document.selection ? va(function() {
        document.selection.empty();
      }) : window.getSelection().removeAllRanges();
    } catch {
    }
  },
  _dragStarted: function(l, t) {
    if (Pt = !1, ke && j) {
      Le("dragStarted", this, {
        evt: t
      }), this.nativeDraggable && ve(document, "dragover", gn);
      var a = this.options;
      !l && Be(j, a.dragClass, !1), Be(j, a.ghostClass, !0), ie.active = this, l && this._appendGhost(), Re({
        sortable: this,
        name: "start",
        originalEvent: t
      });
    } else
      this._nulling();
  },
  _emulateDragOver: function() {
    if (Ye) {
      this._lastX = Ye.clientX, this._lastY = Ye.clientY, Kl();
      for (var l = document.elementFromPoint(Ye.clientX, Ye.clientY), t = l; l && l.shadowRoot && (l = l.shadowRoot.elementFromPoint(Ye.clientX, Ye.clientY), l !== t); )
        t = l;
      if (j.parentNode[ze]._isOutsideThisEl(l), t)
        do {
          if (t[ze]) {
            var a = void 0;
            if (a = t[ze]._onDragOver({
              clientX: Ye.clientX,
              clientY: Ye.clientY,
              target: l,
              rootEl: t
            }), a && !this.options.dragoverBubble)
              break;
          }
          l = t;
        } while (t = Ll(t));
      Hl();
    }
  },
  _onTouchMove: function(l) {
    if (pt) {
      var t = this.options, a = t.fallbackTolerance, n = t.fallbackOffset, s = l.touches ? l.touches[0] : l, c = ne && Lt(ne, !0), v = ne && c && c.a, m = ne && c && c.d, i = da && Ie && pl(Ie), o = (s.clientX - pt.clientX + n.x) / (v || 1) + (i ? i[0] - Oa[0] : 0) / (v || 1), f = (s.clientY - pt.clientY + n.y) / (m || 1) + (i ? i[1] - Oa[1] : 0) / (m || 1);
      if (!ie.active && !Pt) {
        if (a && Math.max(Math.abs(s.clientX - this._lastX), Math.abs(s.clientY - this._lastY)) < a)
          return;
        this._onDragStart(l, !0);
      }
      if (ne) {
        c ? (c.e += o - (Aa || 0), c.f += f - (Pa || 0)) : c = {
          a: 1,
          b: 0,
          c: 0,
          d: 1,
          e: o,
          f
        };
        var g = "matrix(".concat(c.a, ",").concat(c.b, ",").concat(c.c, ",").concat(c.d, ",").concat(c.e, ",").concat(c.f, ")");
        oe(ne, "webkitTransform", g), oe(ne, "mozTransform", g), oe(ne, "msTransform", g), oe(ne, "transform", g), Aa = o, Pa = f, Ye = s;
      }
      l.cancelable && l.preventDefault();
    }
  },
  _appendGhost: function() {
    if (!ne) {
      var l = this.options.fallbackOnBody ? document.body : ke, t = Ce(j, !0, da, !0, l), a = this.options;
      if (da) {
        for (Ie = l; oe(Ie, "position") === "static" && oe(Ie, "transform") === "none" && Ie !== document; )
          Ie = Ie.parentNode;
        Ie !== document.body && Ie !== document.documentElement ? (Ie === document && (Ie = Ze()), t.top += Ie.scrollTop, t.left += Ie.scrollLeft) : Ie = Ze(), Oa = pl(Ie);
      }
      ne = j.cloneNode(!0), Be(ne, a.ghostClass, !1), Be(ne, a.fallbackClass, !0), Be(ne, a.dragClass, !0), oe(ne, "transition", ""), oe(ne, "transform", ""), oe(ne, "box-sizing", "border-box"), oe(ne, "margin", 0), oe(ne, "top", t.top), oe(ne, "left", t.left), oe(ne, "width", t.width), oe(ne, "height", t.height), oe(ne, "opacity", "0.8"), oe(ne, "position", da ? "absolute" : "fixed"), oe(ne, "zIndex", "100000"), oe(ne, "pointerEvents", "none"), ie.ghost = ne, l.appendChild(ne), oe(ne, "transform-origin", bl / parseInt(ne.style.width) * 100 + "% " + hl / parseInt(ne.style.height) * 100 + "%");
    }
  },
  _onDragStart: function(l, t) {
    var a = this, n = l.dataTransfer, s = a.options;
    if (Le("dragStart", this, {
      evt: l
    }), ie.eventCanceled) {
      this._onDrop();
      return;
    }
    Le("setupClone", this), ie.eventCanceled || (Ve = jl(j), Ve.removeAttribute("id"), Ve.draggable = !1, Ve.style["will-change"] = "", this._hideClone(), Be(Ve, this.options.chosenClass, !1), ie.clone = Ve), a.cloneId = va(function() {
      Le("clone", a), !ie.eventCanceled && (a.options.removeCloneOnHide || ke.insertBefore(Ve, j), a._hideClone(), Re({
        sortable: a,
        name: "clone"
      }));
    }), !t && Be(j, s.dragClass, !0), t ? (ba = !0, a._loopId = setInterval(a._emulateDragOver, 50)) : (me(document, "mouseup", a._onDrop), me(document, "touchend", a._onDrop), me(document, "touchcancel", a._onDrop), n && (n.effectAllowed = "move", s.setData && s.setData.call(a, n, j)), ve(document, "drop", a), oe(j, "transform", "translateZ(0)")), Pt = !0, a._dragStartId = va(a._dragStarted.bind(a, t, l)), ve(document, "selectstart", a), Yt = !0, window.getSelection().removeAllRanges(), Xt && oe(document.body, "user-select", "none");
  },
  // Returns true - if no further action is needed (either inserted or another condition)
  _onDragOver: function(l) {
    var t = this.el, a = l.target, n, s, c, v = this.options, m = v.group, i = ie.active, o = sa === m, f = v.sort, g = Ue || i, y, w = this, U = !1;
    if (qa) return;
    function R(ge, pe) {
      Le(ge, w, Qe({
        evt: l,
        isOwner: o,
        axis: y ? "vertical" : "horizontal",
        revert: c,
        dragRect: n,
        targetRect: s,
        canSort: f,
        fromSortable: g,
        target: a,
        completed: T,
        onMove: function(De, b) {
          return ua(ke, t, j, n, De, Ce(De), l, b);
        },
        changed: E
      }, pe));
    }
    function S() {
      R("dragOverAnimationCapture"), w.captureAnimationState(), w !== g && g.captureAnimationState();
    }
    function T(ge) {
      return R("dragOverCompleted", {
        insertion: ge
      }), ge && (o ? i._hideClone() : i._showClone(w), w !== g && (Be(j, Ue ? Ue.options.ghostClass : i.options.ghostClass, !1), Be(j, v.ghostClass, !0)), Ue !== w && w !== ie.active ? Ue = w : w === ie.active && Ue && (Ue = null), g === w && (w._ignoreWhileAnimating = a), w.animateAll(function() {
        R("dragOverAnimationComplete"), w._ignoreWhileAnimating = null;
      }), w !== g && (g.animateAll(), g._ignoreWhileAnimating = null)), (a === j && !j.animated || a === t && !a.animated) && (At = null), !v.dragoverBubble && !l.rootEl && a !== document && (j.parentNode[ze]._isOutsideThisEl(l.target), !ge && bt(l)), !v.dragoverBubble && l.stopPropagation && l.stopPropagation(), U = !0;
    }
    function E() {
      Fe = qe(j), rt = qe(j, v.draggable), Re({
        sortable: w,
        name: "change",
        toEl: t,
        newIndex: Fe,
        newDraggableIndex: rt,
        originalEvent: l
      });
    }
    if (l.preventDefault !== void 0 && l.cancelable && l.preventDefault(), a = Ke(a, v.draggable, t, !0), R("dragOver"), ie.eventCanceled) return U;
    if (j.contains(l.target) || a.animated && a.animatingX && a.animatingY || w._ignoreWhileAnimating === a)
      return T(!1);
    if (ba = !1, i && !v.disabled && (o ? f || (c = $e !== ke) : Ue === this || (this.lastPutMode = sa.checkPull(this, i, j, l)) && m.checkPut(this, i, j, l))) {
      if (y = this._getDirection(l, a) === "vertical", n = Ce(j), R("dragOverValid"), ie.eventCanceled) return U;
      if (c)
        return $e = ke, S(), this._hideClone(), R("revert"), ie.eventCanceled || (kt ? ke.insertBefore(j, kt) : ke.appendChild(j)), T(!0);
      var C = el(t, v.draggable);
      if (!C || $n(l, y, this) && !C.animated) {
        if (C === j)
          return T(!1);
        if (C && t === l.target && (a = C), a && (s = Ce(a)), ua(ke, t, j, n, a, s, l, !!a) !== !1)
          return S(), C && C.nextSibling ? t.insertBefore(j, C.nextSibling) : t.appendChild(j), $e = t, E(), T(!0);
      } else if (C && Vn(l, y, this)) {
        var $ = Bt(t, 0, v, !0);
        if ($ === j)
          return T(!1);
        if (a = $, s = Ce(a), ua(ke, t, j, n, a, s, l, !1) !== !1)
          return S(), t.insertBefore(j, $), $e = t, E(), T(!0);
      } else if (a.parentNode === t) {
        s = Ce(a);
        var O = 0, Z, ue = j.parentNode !== t, _ = !hn(j.animated && j.toRect || n, a.animated && a.toRect || s, y), H = y ? "top" : "left", P = fl(a, "top", "top") || fl(j, "top", "top"), ee = P ? P.scrollTop : void 0;
        At !== a && (Z = s[H], _t = !1, ra = !_ && v.invertSwap || ue), O = xn(l, a, s, y, _ ? 1 : v.swapThreshold, v.invertedSwapThreshold == null ? v.swapThreshold : v.invertedSwapThreshold, ra, At === a);
        var x;
        if (O !== 0) {
          var A = qe(j);
          do
            A -= O, x = $e.children[A];
          while (x && (oe(x, "display") === "none" || x === ne));
        }
        if (O === 0 || x === a)
          return T(!1);
        At = a, Qt = O;
        var N = a.nextElementSibling, Y = !1;
        Y = O === 1;
        var se = ua(ke, t, j, n, a, s, l, Y);
        if (se !== !1)
          return (se === 1 || se === -1) && (Y = se === 1), qa = !0, setTimeout(wn, 30), S(), Y && !N ? t.appendChild(j) : a.parentNode.insertBefore(j, Y ? N : a), P && Fl(P, 0, ee - P.scrollTop), $e = j.parentNode, Z !== void 0 && !ra && (ma = Math.abs(Z - Ce(a)[H])), E(), T(!0);
      }
      if (t.contains(j))
        return T(!1);
    }
    return !1;
  },
  _ignoreWhileAnimating: null,
  _offMoveEvents: function() {
    me(document, "mousemove", this._onTouchMove), me(document, "touchmove", this._onTouchMove), me(document, "pointermove", this._onTouchMove), me(document, "dragover", bt), me(document, "mousemove", bt), me(document, "touchmove", bt);
  },
  _offUpEvents: function() {
    var l = this.el.ownerDocument;
    me(l, "mouseup", this._onDrop), me(l, "touchend", this._onDrop), me(l, "pointerup", this._onDrop), me(l, "pointercancel", this._onDrop), me(l, "touchcancel", this._onDrop), me(document, "selectstart", this);
  },
  _onDrop: function(l) {
    var t = this.el, a = this.options;
    if (Fe = qe(j), rt = qe(j, a.draggable), Le("drop", this, {
      evt: l
    }), $e = j && j.parentNode, Fe = qe(j), rt = qe(j, a.draggable), ie.eventCanceled) {
      this._nulling();
      return;
    }
    Pt = !1, ra = !1, _t = !1, clearInterval(this._loopId), clearTimeout(this._dragStartTimer), Wa(this.cloneId), Wa(this._dragStartId), this.nativeDraggable && (me(document, "drop", this), me(t, "dragstart", this._onDragStart)), this._offMoveEvents(), this._offUpEvents(), Xt && oe(document.body, "user-select", ""), oe(j, "transform", ""), l && (Yt && (l.cancelable && l.preventDefault(), !a.dropBubble && l.stopPropagation()), ne && ne.parentNode && ne.parentNode.removeChild(ne), (ke === $e || Ue && Ue.lastPutMode !== "clone") && Ve && Ve.parentNode && Ve.parentNode.removeChild(Ve), j && (this.nativeDraggable && me(j, "dragend", this), Ra(j), j.style["will-change"] = "", Yt && !Pt && Be(j, Ue ? Ue.options.ghostClass : this.options.ghostClass, !1), Be(j, this.options.chosenClass, !1), Re({
      sortable: this,
      name: "unchoose",
      toEl: $e,
      newIndex: null,
      newDraggableIndex: null,
      originalEvent: l
    }), ke !== $e ? (Fe >= 0 && (Re({
      rootEl: $e,
      name: "add",
      toEl: $e,
      fromEl: ke,
      originalEvent: l
    }), Re({
      sortable: this,
      name: "remove",
      toEl: $e,
      originalEvent: l
    }), Re({
      rootEl: $e,
      name: "sort",
      toEl: $e,
      fromEl: ke,
      originalEvent: l
    }), Re({
      sortable: this,
      name: "sort",
      toEl: $e,
      originalEvent: l
    })), Ue && Ue.save()) : Fe !== Rt && Fe >= 0 && (Re({
      sortable: this,
      name: "update",
      toEl: $e,
      originalEvent: l
    }), Re({
      sortable: this,
      name: "sort",
      toEl: $e,
      originalEvent: l
    })), ie.active && ((Fe == null || Fe === -1) && (Fe = Rt, rt = Zt), Re({
      sortable: this,
      name: "end",
      toEl: $e,
      originalEvent: l
    }), this.save()))), this._nulling();
  },
  _nulling: function() {
    Le("nulling", this), ke = j = $e = ne = kt = Ve = ca = dt = pt = Ye = Yt = Fe = rt = Rt = Zt = At = Qt = Ue = sa = ie.dragged = ie.ghost = ie.clone = ie.active = null;
    var l = this.el;
    ya.forEach(function(t) {
      l.contains(t) && (t.checked = !0);
    }), ya.length = Aa = Pa = 0;
  },
  handleEvent: function(l) {
    switch (l.type) {
      case "drop":
      case "dragend":
        this._onDrop(l);
        break;
      case "dragenter":
      case "dragover":
        j && (this._onDragOver(l), kn(l));
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
    for (var l = [], t, a = this.el.children, n = 0, s = a.length, c = this.options; n < s; n++)
      t = a[n], Ke(t, c.draggable, this.el, !1) && l.push(t.getAttribute(c.dataIdAttr) || Cn(t));
    return l;
  },
  /**
   * Sorts the elements according to the array.
   * @param  {String[]}  order  order of the items
   */
  sort: function(l, t) {
    var a = {}, n = this.el;
    this.toArray().forEach(function(s, c) {
      var v = n.children[c];
      Ke(v, this.options.draggable, n, !1) && (a[s] = v);
    }, this), t && this.captureAnimationState(), l.forEach(function(s) {
      a[s] && (n.removeChild(a[s]), n.appendChild(a[s]));
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
    return Ke(l, t || this.options.draggable, this.el, !1);
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
    var n = la.modifyOption(this, l, t);
    typeof n < "u" ? a[l] = n : a[l] = t, l === "group" && Yl(a);
  },
  /**
   * Destroy
   */
  destroy: function() {
    Le("destroy", this);
    var l = this.el;
    l[ze] = null, me(l, "mousedown", this._onTapStart), me(l, "touchstart", this._onTapStart), me(l, "pointerdown", this._onTapStart), this.nativeDraggable && (me(l, "dragover", this), me(l, "dragenter", this)), Array.prototype.forEach.call(l.querySelectorAll("[draggable]"), function(t) {
      t.removeAttribute("draggable");
    }), this._onDrop(), this._disableDelayedDragEvents(), ha.splice(ha.indexOf(this.el), 1), this.el = l = null;
  },
  _hideClone: function() {
    if (!dt) {
      if (Le("hideClone", this), ie.eventCanceled) return;
      oe(Ve, "display", "none"), this.options.removeCloneOnHide && Ve.parentNode && Ve.parentNode.removeChild(Ve), dt = !0;
    }
  },
  _showClone: function(l) {
    if (l.lastPutMode !== "clone") {
      this._hideClone();
      return;
    }
    if (dt) {
      if (Le("showClone", this), ie.eventCanceled) return;
      j.parentNode == ke && !this.options.group.revertClone ? ke.insertBefore(Ve, j) : kt ? ke.insertBefore(Ve, kt) : ke.appendChild(Ve), this.options.group.revertClone && this.animate(j, Ve), oe(Ve, "display", ""), dt = !1;
    }
  }
};
function kn(e) {
  e.dataTransfer && (e.dataTransfer.dropEffect = "move"), e.cancelable && e.preventDefault();
}
function ua(e, l, t, a, n, s, c, v) {
  var m, i = e[ze], o = i.options.onMove, f;
  return window.CustomEvent && !ot && !aa ? m = new CustomEvent("move", {
    bubbles: !0,
    cancelable: !0
  }) : (m = document.createEvent("Event"), m.initEvent("move", !0, !0)), m.to = l, m.from = e, m.dragged = t, m.draggedRect = a, m.related = n || l, m.relatedRect = s || Ce(l), m.willInsertAfter = v, m.originalEvent = c, e.dispatchEvent(m), o && (f = o.call(i, m, c)), f;
}
function Ra(e) {
  e.draggable = !1;
}
function wn() {
  qa = !1;
}
function Vn(e, l, t) {
  var a = Ce(Bt(t.el, 0, t.options, !0)), n = ql(t.el, t.options, ne), s = 10;
  return l ? e.clientX < n.left - s || e.clientY < a.top && e.clientX < a.right : e.clientY < n.top - s || e.clientY < a.bottom && e.clientX < a.left;
}
function $n(e, l, t) {
  var a = Ce(el(t.el, t.options.draggable)), n = ql(t.el, t.options, ne), s = 10;
  return l ? e.clientX > n.right + s || e.clientY > a.bottom && e.clientX > a.left : e.clientY > n.bottom + s || e.clientX > a.right && e.clientY > a.top;
}
function xn(e, l, t, a, n, s, c, v) {
  var m = a ? e.clientY : e.clientX, i = a ? t.height : t.width, o = a ? t.top : t.left, f = a ? t.bottom : t.right, g = !1;
  if (!c) {
    if (v && ma < i * n) {
      if (!_t && (Qt === 1 ? m > o + i * s / 2 : m < f - i * s / 2) && (_t = !0), _t)
        g = !0;
      else if (Qt === 1 ? m < o + ma : m > f - ma)
        return -Qt;
    } else if (m > o + i * (1 - n) / 2 && m < f - i * (1 - n) / 2)
      return Sn(l);
  }
  return g = g || c, g && (m < o + i * s / 2 || m > f - i * s / 2) ? m > o + i / 2 ? 1 : -1 : 0;
}
function Sn(e) {
  return qe(j) < qe(e) ? 1 : -1;
}
function Cn(e) {
  for (var l = e.tagName + e.className + e.src + e.href + e.textContent, t = l.length, a = 0; t--; )
    a += l.charCodeAt(t);
  return a.toString(36);
}
function En(e) {
  ya.length = 0;
  for (var l = e.getElementsByTagName("input"), t = l.length; t--; ) {
    var a = l[t];
    a.checked && ya.push(a);
  }
}
function va(e) {
  return setTimeout(e, 0);
}
function Wa(e) {
  return clearTimeout(e);
}
Sa && ve(document, "touchmove", function(e) {
  (ie.active || Pt) && e.cancelable && e.preventDefault();
});
ie.utils = {
  on: ve,
  off: me,
  css: oe,
  find: zl,
  is: function(l, t) {
    return !!Ke(l, t, l, !1);
  },
  extend: dn,
  throttle: Bl,
  closest: Ke,
  toggleClass: Be,
  clone: jl,
  index: qe,
  nextTick: va,
  cancelNextTick: Wa,
  detectDirection: Gl,
  getChild: Bt,
  expando: ze
};
ie.get = function(e) {
  return e[ze];
};
ie.mount = function() {
  for (var e = arguments.length, l = new Array(e), t = 0; t < e; t++)
    l[t] = arguments[t];
  l[0].constructor === Array && (l = l[0]), l.forEach(function(a) {
    if (!a.prototype || !a.prototype.constructor)
      throw "Sortable: Mounted plugin must be a constructor function, not ".concat({}.toString.call(a));
    a.utils && (ie.utils = Qe(Qe({}, ie.utils), a.utils)), la.mount(a);
  });
};
ie.create = function(e, l) {
  return new ie(e, l);
};
ie.version = sn;
var Se = [], Kt, Ga, Ya = !1, Na, Ma, ga, Ht;
function Tn() {
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
      this.sortable.nativeDraggable ? ve(document, "dragover", this._handleAutoScroll) : this.options.supportPointer ? ve(document, "pointermove", this._handleFallbackAutoScroll) : a.touches ? ve(document, "touchmove", this._handleFallbackAutoScroll) : ve(document, "mousemove", this._handleFallbackAutoScroll);
    },
    dragOverCompleted: function(t) {
      var a = t.originalEvent;
      !this.options.dragOverBubble && !a.rootEl && this._handleAutoScroll(a);
    },
    drop: function() {
      this.sortable.nativeDraggable ? me(document, "dragover", this._handleAutoScroll) : (me(document, "pointermove", this._handleFallbackAutoScroll), me(document, "touchmove", this._handleFallbackAutoScroll), me(document, "mousemove", this._handleFallbackAutoScroll)), gl(), fa(), un();
    },
    nulling: function() {
      ga = Ga = Kt = Ya = Ht = Na = Ma = null, Se.length = 0;
    },
    _handleFallbackAutoScroll: function(t) {
      this._handleAutoScroll(t, !0);
    },
    _handleAutoScroll: function(t, a) {
      var n = this, s = (t.touches ? t.touches[0] : t).clientX, c = (t.touches ? t.touches[0] : t).clientY, v = document.elementFromPoint(s, c);
      if (ga = t, a || this.options.forceAutoScrollFallback || aa || ot || Xt) {
        La(t, this.options, v, a);
        var m = ut(v, !0);
        Ya && (!Ht || s !== Na || c !== Ma) && (Ht && gl(), Ht = setInterval(function() {
          var i = ut(document.elementFromPoint(s, c), !0);
          i !== m && (m = i, fa()), La(t, n.options, i, a);
        }, 10), Na = s, Ma = c);
      } else {
        if (!this.options.bubbleScroll || ut(v, !0) === Ze()) {
          fa();
          return;
        }
        La(t, this.options, ut(v, !1), !1);
      }
    }
  }, lt(e, {
    pluginName: "scroll",
    initializeByDefault: !0
  });
}
function fa() {
  Se.forEach(function(e) {
    clearInterval(e.pid);
  }), Se = [];
}
function gl() {
  clearInterval(Ht);
}
var La = Bl(function(e, l, t, a) {
  if (l.scroll) {
    var n = (e.touches ? e.touches[0] : e).clientX, s = (e.touches ? e.touches[0] : e).clientY, c = l.scrollSensitivity, v = l.scrollSpeed, m = Ze(), i = !1, o;
    Ga !== t && (Ga = t, fa(), Kt = l.scroll, o = l.scrollFn, Kt === !0 && (Kt = ut(t, !0)));
    var f = 0, g = Kt;
    do {
      var y = g, w = Ce(y), U = w.top, R = w.bottom, S = w.left, T = w.right, E = w.width, C = w.height, $ = void 0, O = void 0, Z = y.scrollWidth, ue = y.scrollHeight, _ = oe(y), H = y.scrollLeft, P = y.scrollTop;
      y === m ? ($ = E < Z && (_.overflowX === "auto" || _.overflowX === "scroll" || _.overflowX === "visible"), O = C < ue && (_.overflowY === "auto" || _.overflowY === "scroll" || _.overflowY === "visible")) : ($ = E < Z && (_.overflowX === "auto" || _.overflowX === "scroll"), O = C < ue && (_.overflowY === "auto" || _.overflowY === "scroll"));
      var ee = $ && (Math.abs(T - n) <= c && H + E < Z) - (Math.abs(S - n) <= c && !!H), x = O && (Math.abs(R - s) <= c && P + C < ue) - (Math.abs(U - s) <= c && !!P);
      if (!Se[f])
        for (var A = 0; A <= f; A++)
          Se[A] || (Se[A] = {});
      (Se[f].vx != ee || Se[f].vy != x || Se[f].el !== y) && (Se[f].el = y, Se[f].vx = ee, Se[f].vy = x, clearInterval(Se[f].pid), (ee != 0 || x != 0) && (i = !0, Se[f].pid = setInterval(function() {
        a && this.layer === 0 && ie.active._onTouchMove(ga);
        var N = Se[this.layer].vy ? Se[this.layer].vy * v : 0, Y = Se[this.layer].vx ? Se[this.layer].vx * v : 0;
        typeof o == "function" && o.call(ie.dragged.parentNode[ze], Y, N, e, ga, Se[this.layer].el) !== "continue" || Fl(Se[this.layer].el, Y, N);
      }.bind({
        layer: f
      }), 24))), f++;
    } while (l.bubbleScroll && g !== m && (g = ut(g, !1)));
    Ya = i;
  }
}, 30), Xl = function(l) {
  var t = l.originalEvent, a = l.putSortable, n = l.dragEl, s = l.activeSortable, c = l.dispatchSortableEvent, v = l.hideGhostForTarget, m = l.unhideGhostForTarget;
  if (t) {
    var i = a || s;
    v();
    var o = t.changedTouches && t.changedTouches.length ? t.changedTouches[0] : t, f = document.elementFromPoint(o.clientX, o.clientY);
    m(), i && !i.el.contains(f) && (c("spill"), this.onSpill({
      dragEl: n,
      putSortable: a
    }));
  }
};
function tl() {
}
tl.prototype = {
  startIndex: null,
  dragStart: function(l) {
    var t = l.oldDraggableIndex;
    this.startIndex = t;
  },
  onSpill: function(l) {
    var t = l.dragEl, a = l.putSortable;
    this.sortable.captureAnimationState(), a && a.captureAnimationState();
    var n = Bt(this.sortable.el, this.startIndex, this.options);
    n ? this.sortable.el.insertBefore(t, n) : this.sortable.el.appendChild(t), this.sortable.animateAll(), a && a.animateAll();
  },
  drop: Xl
};
lt(tl, {
  pluginName: "revertOnSpill"
});
function al() {
}
al.prototype = {
  onSpill: function(l) {
    var t = l.dragEl, a = l.putSortable, n = a || this.sortable;
    n.captureAnimationState(), t.parentNode && t.parentNode.removeChild(t), n.animateAll();
  },
  drop: Xl
};
lt(al, {
  pluginName: "removeOnSpill"
});
ie.mount(new Tn());
ie.mount(al, tl);
function Un(e, l) {
  const t = e.oldDraggableIndex ?? e.oldIndex;
  e.item.remove();
  const a = [...e.from.children].filter((n) => n.matches(l));
  e.from.insertBefore(e.item, a[t ?? a.length] ?? null);
}
function Jl(e) {
  const l = /* @__PURE__ */ new Map();
  function t(a) {
    l.get(a)?.destroy(), l.delete(a);
  }
  return mt(() => {
    for (const a of l.keys()) t(a);
  }), {
    mounted(a) {
      const n = a.querySelector(".work-field-builder") ?? a;
      l.set(a, new ie(n, {
        draggable: ".work-reorder-entry",
        handle: ".work-reorder-handle",
        forceFallback: !0,
        fallbackOnBody: !1,
        ghostClass: "work-drag-ghost",
        onEnd(s) {
          const c = s.oldDraggableIndex, v = s.newDraggableIndex;
          Un(s, ".work-reorder-entry"), c !== void 0 && v !== void 0 && c !== v && e(c, v);
        }
      }));
    },
    unmounted: t
  };
}
const Dn = { class: "work-stack work-tight work-option-builder" }, In = { class: "work-stack work-tight" }, An = { class: "work-stack work-tight work-small" }, Pn = { class: "work-stack work-tight work-small" }, On = { class: "work-stack work-tight" }, Rn = { class: "work-stack work-tight work-small" }, Nn = { class: "work-row" }, Mn = { class: "work-stack work-tight work-small" }, Ln = { class: "work-row" }, zn = { class: "work-add-option" }, Bn = {
  key: 0,
  class: "work-muted work-small"
}, Fn = /* @__PURE__ */ ce({
  __name: "OptionsEditor",
  props: {
    field: {}
  },
  setup(e) {
    const l = e, t = W(() => l.field.options ?? []);
    function a(v, m) {
      Dl(t.value, v, m - v), t.value.forEach((i, o) => i.order = o);
    }
    const n = Jl(a), s = ["primary", "success", "info", "warn", "danger", "secondary"];
    function c() {
      let v = t.value.length + 1;
      for (; t.value.some((m) => m.id === `option_${v}`); ) v++;
      (l.field.options ??= []).push({ id: `option_${v}`, label: "New option", order: t.value.length });
    }
    return (v, m) => (u(), h("section", Dn, [
      m[4] || (m[4] = d("header", { class: "work-row" }, [
        d("h4", null, "Options"),
        d("span", { class: "work-muted work-small" }, "Stable IDs keep existing values when labels change."),
        d("span", { class: "work-spacer" })
      ], -1)),
      et((u(), h("div", In, [
        (u(!0), h(q, null, ae(t.value, (i, o) => (u(), h("div", {
          key: o,
          class: "work-option-row work-reorder-entry"
        }, [
          p(r(X), {
            type: "button",
            class: "work-icon-button work-reorder-handle",
            "aria-label": "Drag option; arrow keys reorder",
            onKeydown: [
              Ae(he((f) => a(o, o - 1), ["prevent"]), ["up"]),
              Ae(he((f) => a(o, o + 1), ["prevent"]), ["down"])
            ],
            severity: "secondary",
            text: "",
            size: "small"
          }, {
            default: L(() => [
              p(r(J), {
                icon: "tabler:grip-vertical",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["onKeydown"]),
          d("label", An, [
            m[0] || (m[0] = M("Label", -1)),
            p(r(de), {
              modelValue: i.label,
              "onUpdate:modelValue": (f) => i.label = f,
              "aria-label": "Option label"
            }, null, 8, ["modelValue", "onUpdate:modelValue"])
          ]),
          d("label", Pn, [
            m[1] || (m[1] = M("Code", -1)),
            p(r(de), {
              modelValue: i.id,
              "onUpdate:modelValue": (f) => i.id = f,
              class: "work-option-code",
              required: "",
              pattern: "[a-z][a-z0-9_]*",
              "aria-label": "Option ID"
            }, null, 8, ["modelValue", "onUpdate:modelValue"])
          ]),
          d("div", On, [
            d("label", Rn, [
              m[2] || (m[2] = M("Color", -1)),
              d("span", Nn, [
                d("span", {
                  class: ct(["work-color-swatch", "work-swatch-" + (i.color || "secondary")]),
                  "aria-hidden": "true"
                }, null, 2),
                p(r(le), {
                  modelValue: i.color,
                  "onUpdate:modelValue": (f) => i.color = f,
                  "aria-label": "Option color",
                  appendTo: "self",
                  optionLabel: "label",
                  optionValue: "value",
                  optionDisabled: "disabled",
                  options: [{ label: "Default", value: void 0, disabled: !1 }, ...(s ?? []).map((f) => ({ label: f, value: f, disabled: !1 }))]
                }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
              ])
            ]),
            d("label", Mn, [
              m[3] || (m[3] = M("Category", -1)),
              p(r(le), {
                "model-value": i.category,
                "aria-label": "Option category",
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                showClear: "",
                options: ["triage", "backlog", ...r(Ul)].map((f) => ({ label: r(Xa)(f), value: f })),
                "onUpdate:modelValue": (f) => i.category = f || void 0
              }, null, 8, ["model-value", "options", "onUpdate:modelValue"])
            ])
          ]),
          d("div", Ln, [
            p(r(X), {
              "aria-label": "Option earlier",
              severity: "secondary",
              size: "small",
              disabled: o === 0,
              onClick: (f) => a(o, o - 1),
              text: ""
            }, {
              default: L(() => [
                p(r(J), {
                  icon: "tabler:arrow-up",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["disabled", "onClick"]),
            p(r(X), {
              "aria-label": "Option later",
              severity: "secondary",
              size: "small",
              disabled: o === t.value.length - 1,
              onClick: (f) => a(o, o + 1),
              text: ""
            }, {
              default: L(() => [
                p(r(J), {
                  icon: "tabler:arrow-down",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["disabled", "onClick"]),
            p(r(X), {
              label: "Remove",
              "aria-label": "Remove option",
              severity: "secondary",
              text: "",
              size: "small",
              onClick: (f) => t.value.splice(o, 1)
            }, {
              icon: L(() => [
                p(r(J), {
                  icon: "tabler:trash",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["onClick"])
          ])
        ]))), 128)),
        d("div", zn, [
          p(r(X), {
            label: "Add option",
            severity: "secondary",
            size: "small",
            onClick: c,
            outlined: ""
          }, {
            icon: L(() => [
              p(r(J), {
                icon: "tabler:plus",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          })
        ])
      ])), [
        [r(n)]
      ]),
      t.value.length ? I("", !0) : (u(), h("p", Bn, "Add the choices people can select for this field."))
    ]));
  }
}), jn = {
  class: "work-stack",
  "aria-label": "Fields editor"
}, qn = { class: "work-section-heading" }, Wn = {
  key: 0,
  class: "work-used-by"
}, Gn = { class: "kx-tag-sm" }, Yn = { class: "work-small work-muted" }, Kn = {
  key: 0,
  class: "work-error work-small",
  role: "alert"
}, Hn = { class: "work-settings-grid work-field-properties" }, Xn = { class: "work-stack work-tight" }, Jn = { class: "work-stack work-tight" }, Zn = { class: "work-stack work-tight" }, Qn = { class: "work-stack work-tight" }, _n = { class: "work-stack work-tight" }, es = { class: "work-stack work-tight work-field-history" }, ts = { class: "work-settings-list" }, as = { class: "work-settings-row" }, ls = { class: "work-settings-row" }, os = {
  key: 2,
  class: "work-stack work-tight"
}, is = {
  key: 3,
  class: "work-stack work-tight"
}, ns = { class: "work-stack work-tight" }, ss = { class: "work-stack work-tight" }, rs = { class: "work-stack work-tight" }, ds = { class: "work-stack work-tight" }, us = {
  key: 6,
  class: "work-stack"
}, cs = {
  key: 0,
  class: "work-stack work-tight"
}, ms = { class: "work-row work-add-definition" }, vs = { class: "work-stack work-tight" }, fs = /* @__PURE__ */ ce({
  __name: "FieldsEditor",
  props: {
    draft: {},
    advanced: { type: Boolean },
    guardRemoval: { type: Function },
    issues: {},
    boardId: {},
    installedTypes: {}
  },
  emits: ["validity"],
  setup(e, { emit: l }) {
    const t = e, a = l, n = W(() => t.draft.fields ?? []), s = z(""), c = z(""), v = z({}), m = Jl((S, T) => w(S, T - S));
    function i(S) {
      return (t.draft.item_types ?? []).filter((T) => T.fields.includes(S)).map((T) => T.title || ye(T.id));
    }
    async function o(S) {
      if (!c.value) {
        c.value = S.code;
        try {
          const T = await t.guardRemoval?.("fields", S.code);
          v.value[S.code] = T ?? "", T || ta(t.draft, "fields", S.code);
        } finally {
          c.value = "";
        }
      }
    }
    const f = ["text", "int", "dec", "quantity", "bool", "time", "ref", "record", "option", "principal", "item", "rank", "rich_text", "formula", "rollup", "counter"];
    function g(S) {
      return S.type && S.type !== "value" ? S.type : S.form;
    }
    function y(S, T) {
      const E = { option: "text", principal: "ref", item: "ref", rank: "text", rich_text: "text", formula: "int", rollup: "int", counter: "int" };
      E[T] ? (S.type = T, S.form = E[T]) : (delete S.type, S.form = T), T !== "option" ? delete S.options : S.options ??= [], T === "rich_text" && (S.config = { format: "json" });
    }
    function w(S, T) {
      Dl(n.value, S, T);
      for (const E of t.draft.item_types ?? []) {
        const C = new Set(E.fields);
        E.fields = n.value.filter(($) => C.has($.code)).map(($) => $.code);
      }
    }
    function U(S, T) {
      try {
        bo(t.draft, S, T.value), delete v.value[S.code];
      } catch (E) {
        v.value[S.code] = E.message, T.value = S.code;
      }
    }
    function R() {
      !/^[a-z][a-z0-9_]*$/.test(s.value) || n.value.some((S) => S.code === s.value) || ((t.draft.fields ??= []).push({ code: s.value, form: "text", cardinality: "one" }), s.value = "");
    }
    return (S, T) => (u(), h("section", jn, [
      d("header", qn, [
        T[1] || (T[1] = d("div", null, [
          d("h2", null, "Fields"),
          d("p", { class: "work-muted work-small" }, "Shape the information each item carries. Drag the handle or use the arrows to arrange fields.")
        ], -1)),
        p(r(Pe), {
          class: "kx-tag-sm",
          severity: "secondary"
        }, {
          default: L(() => [
            M(D(n.value.length) + " " + D(n.value.length === 1 ? "field" : "fields"), 1)
          ]),
          _: 1
        })
      ]),
      et((u(), B(xa, {
        columns: "fields",
        count: n.value.length
      }, {
        default: L(() => [
          (u(!0), h(q, null, ae(n.value, (E, C) => (u(), B($a, {
            title: r(xt)(E),
            code: E.code,
            kind: e.installedTypes?.find(($) => $.id === g(E))?.title || r(ye)(g(E)),
            key: E.id ?? C,
            class: "work-field-row work-reorder-entry work-stack"
          }, {
            handle: L(() => [
              p(r(X), {
                type: "button",
                class: "work-reorder-handle work-icon-button",
                "aria-label": "Drag " + E.code + "; arrow keys reorder",
                onKeydown: [
                  Ae(he(($) => w(C, -1), ["prevent"]), ["up"]),
                  Ae(he(($) => w(C, 1), ["prevent"]), ["down"])
                ],
                severity: "secondary",
                text: "",
                size: "small"
              }, {
                default: L(() => [
                  p(r(J), {
                    icon: "tabler:grip-vertical",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["aria-label", "onKeydown"])
            ]),
            flags: L(() => [
              E.track ? (u(), B(r(Pe), {
                key: 0,
                class: "kx-tag-sm",
                severity: "secondary",
                value: "Tracked"
              })) : I("", !0),
              E.intervals ? (u(), B(r(Pe), {
                key: 1,
                class: "kx-tag-sm",
                severity: "secondary",
                value: "Intervals"
              })) : I("", !0)
            ]),
            usage: L(() => [
              i(E.code).length ? (u(), h("details", Wn, [
                d("summary", Gn, "Used by " + D(i(E.code).length) + " " + D(i(E.code).length === 1 ? "type" : "types"), 1),
                d("span", Yn, D(i(E.code).join(", ")), 1)
              ])) : I("", !0)
            ]),
            actions: L(() => [
              p(r(X), {
                "aria-label": "Move " + E.code + " earlier",
                severity: "secondary",
                disabled: C === 0,
                onClick: ($) => w(C, -1),
                text: "",
                size: "small"
              }, {
                default: L(() => [
                  p(r(J), {
                    icon: "tabler:arrow-up",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["aria-label", "disabled", "onClick"]),
              p(r(X), {
                "aria-label": "Move " + E.code + " later",
                severity: "secondary",
                disabled: C === n.value.length - 1,
                onClick: ($) => w(C, 1),
                text: "",
                size: "small"
              }, {
                default: L(() => [
                  p(r(J), {
                    icon: "tabler:arrow-down",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["aria-label", "disabled", "onClick"]),
              p(r(X), {
                severity: "secondary",
                text: "",
                size: "small",
                disabled: !!c.value,
                onClick: ($) => o(E),
                "aria-label": "Remove field"
              }, {
                default: L(() => [
                  p(r(J), {
                    icon: "tabler:trash",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["disabled", "onClick"])
            ]),
            default: L(() => [
              v.value[E.code] ? (u(), h("p", Kn, D(v.value[E.code]), 1)) : I("", !0),
              (u(!0), h(q, null, ae(e.issues?.filter(($) => $.code === E.code) ?? [], ($) => (u(), h("p", {
                key: $.what,
                class: "work-error work-small",
                role: "alert"
              }, D(r(Va)($)) + " · " + D($.what), 1))), 128)),
              d("div", Hn, [
                d("label", Xn, [
                  T[2] || (T[2] = M("Title", -1)),
                  p(r(de), {
                    modelValue: E.title,
                    "onUpdate:modelValue": ($) => E.title = $,
                    "aria-label": "Field title",
                    maxlength: "255",
                    placeholder: r(xt)(E)
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder"])
                ]),
                d("label", Jn, [
                  T[3] || (T[3] = M("Code", -1)),
                  p(r(de), {
                    value: E.code,
                    "aria-label": "Field code",
                    required: "",
                    pattern: "[a-z][a-z0-9_]*",
                    onInput: ($) => U(E, $.target)
                  }, null, 8, ["value", "onInput"])
                ]),
                d("label", Zn, [
                  T[4] || (T[4] = M("Kind", -1)),
                  p(r(le), {
                    "model-value": g(E),
                    "onUpdate:modelValue": ($) => y(E, $),
                    appendTo: "self",
                    options: f
                  }, null, 8, ["model-value", "onUpdate:modelValue"])
                ]),
                d("label", Qn, [
                  T[5] || (T[5] = M("Cardinality", -1)),
                  p(r(le), {
                    "model-value": E.cardinality ?? "one",
                    "onUpdate:modelValue": ($) => E.cardinality = $,
                    appendTo: "self",
                    options: ["one", "set", "list"]
                  }, null, 8, ["model-value", "onUpdate:modelValue"])
                ]),
                d("label", _n, [
                  T[6] || (T[6] = M("Index", -1)),
                  p(r(le), {
                    "model-value": E.index ?? "none",
                    "onUpdate:modelValue": ($) => E.index = $,
                    appendTo: "self",
                    options: ["none", "key", "number"]
                  }, null, 8, ["model-value", "onUpdate:modelValue"])
                ])
              ]),
              d("section", es, [
                T[9] || (T[9] = d("h4", { class: "work-group-title" }, "History", -1)),
                d("div", ts, [
                  d("div", as, [
                    T[7] || (T[7] = d("div", { class: "work-row-main" }, [
                      d("strong", null, "Track changes"),
                      d("p", { class: "work-muted work-small" }, "Record each value change in the item history.")
                    ], -1)),
                    p(r(Ne), {
                      modelValue: E.track,
                      "onUpdate:modelValue": ($) => E.track = $,
                      "aria-label": "Track changes"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ]),
                  d("div", ls, [
                    T[8] || (T[8] = d("div", { class: "work-row-main" }, [
                      d("strong", null, "Track intervals"),
                      d("p", { class: "work-muted work-small" }, "Measure how long each value stays in effect.")
                    ], -1)),
                    p(r(Ne), {
                      modelValue: E.intervals,
                      "onUpdate:modelValue": ($) => E.intervals = $,
                      "aria-label": "Track intervals"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ])
                ])
              ]),
              E.type === "option" ? (u(), B(Fn, {
                key: 1,
                field: E
              }, null, 8, ["field"])) : I("", !0),
              E.type === "formula" || E.type === "rollup" ? (u(), h("label", os, [
                T[10] || (T[10] = M("Result form", -1)),
                p(r(le), {
                  modelValue: E.form,
                  "onUpdate:modelValue": ($) => E.form = $,
                  "aria-label": "Result form",
                  options: ["text", "int", "dec", "quantity", "bool", "time", "ref", "record"],
                  appendTo: "self"
                }, null, 8, ["modelValue", "onUpdate:modelValue"])
              ])) : I("", !0),
              E.type === "formula" ? (u(), h("label", is, [
                T[11] || (T[11] = M("Expression", -1)),
                p(r(de), {
                  modelValue: E.expression,
                  "onUpdate:modelValue": ($) => E.expression = $
                }, null, 8, ["modelValue", "onUpdate:modelValue"])
              ])) : I("", !0),
              E.type === "rollup" ? (u(), h(q, { key: 4 }, [
                d("label", ns, [
                  T[12] || (T[12] = M("Of", -1)),
                  p(r(de), {
                    modelValue: E.of,
                    "onUpdate:modelValue": ($) => E.of = $
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                d("label", ss, [
                  T[13] || (T[13] = M("Function", -1)),
                  p(r(de), {
                    modelValue: E.fn,
                    "onUpdate:modelValue": ($) => E.fn = $
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                d("label", rs, [
                  T[14] || (T[14] = M("Field", -1)),
                  p(r(de), {
                    modelValue: E.field,
                    "onUpdate:modelValue": ($) => E.field = $
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                d("label", ds, [
                  T[15] || (T[15] = M("Order by", -1)),
                  p(r(le), {
                    "model-value": E.by,
                    "aria-label": "Rollup order",
                    options: ["rank", "time"],
                    showClear: "",
                    appendTo: "self",
                    "onUpdate:modelValue": ($) => E.by = $ || void 0
                  }, null, 8, ["model-value", "onUpdate:modelValue"])
                ]),
                p(Za, {
                  modelValue: E.where,
                  "onUpdate:modelValue": ($) => E.where = $,
                  draft: e.draft,
                  "board-id": e.boardId,
                  label: "Include related items when",
                  onValidity: ($) => a("validity", "rollup-" + C, $)
                }, null, 8, ["modelValue", "onUpdate:modelValue", "draft", "board-id", "onValidity"])
              ], 64)) : I("", !0),
              ["dec", "quantity", "ref", "time", "record"].includes(E.form) || E.config ? (u(), B(at, {
                key: 5,
                label: "Field configuration",
                "model-value": E.config,
                shape: "object",
                "onUpdate:modelValue": ($) => E.config = $,
                onValidity: ($) => a("validity", "config-" + C, $)
              }, null, 8, ["model-value", "onUpdate:modelValue", "onValidity"])) : I("", !0),
              e.advanced ? (u(), h("section", us, [
                T[17] || (T[17] = d("h4", { class: "work-group-title" }, "Access", -1)),
                e.installedTypes?.length ? (u(), h("label", cs, [
                  T[16] || (T[16] = M("Custom field type", -1)),
                  p(r(le), {
                    "model-value": E.type,
                    options: e.installedTypes,
                    optionLabel: "title",
                    optionValue: "id",
                    appendTo: "self",
                    "onUpdate:modelValue": ($) => E.type = $
                  }, null, 8, ["model-value", "options", "onUpdate:modelValue"])
                ])) : I("", !0),
                (u(), h(q, null, ae(["read", "write"], ($) => p(Rl, {
                  "board-id": e.boardId,
                  key: $,
                  label: $ === "read" ? "Who can read" : "Who can edit",
                  "model-value": E.access?.[$],
                  "onUpdate:modelValue": (O) => E.access = { ...E.access, [$]: O },
                  onValidity: (O) => a("validity", "access-" + C + $, O)
                }, null, 8, ["board-id", "label", "model-value", "onUpdate:modelValue", "onValidity"])), 64))
              ])) : I("", !0)
            ]),
            _: 2
          }, 1032, ["title", "code", "kind"]))), 128)),
          d("div", ms, [
            d("label", vs, [
              T[18] || (T[18] = M("New field code", -1)),
              p(r(de), {
                modelValue: s.value,
                "onUpdate:modelValue": T[0] || (T[0] = (E) => s.value = E),
                onKeydown: Ae(he(R, ["prevent"]), ["enter"])
              }, null, 8, ["modelValue", "onKeydown"])
            ]),
            p(r(X), {
              label: "Add field",
              severity: "secondary",
              disabled: !s.value.trim(),
              onClick: R,
              outlined: ""
            }, {
              icon: L(() => [
                p(r(J), {
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
}), ps = ["disabled"], bs = { class: "work-chips" }, hs = {
  key: 1,
  class: "work-muted work-small"
}, zt = /* @__PURE__ */ ce({
  __name: "ChipPicker",
  props: {
    label: {},
    options: {},
    modelValue: {},
    disabled: { type: Boolean }
  },
  emits: ["update:modelValue"],
  setup(e, { emit: l }) {
    const t = e, a = l, n = z(""), s = W(() => t.options.map((m) => typeof m == "string" ? { value: m } : m)), c = W(() => s.value.filter((m) => (m.label ?? ye(m.value)).toLocaleLowerCase().includes(n.value.toLocaleLowerCase())));
    function v(m) {
      if (t.disabled) return;
      const i = t.modelValue ?? [];
      a("update:modelValue", i.includes(m) ? i.filter((o) => o !== m) : [...i, m]);
    }
    return (m, i) => (u(), h("fieldset", {
      class: "work-chip-picker",
      disabled: e.disabled
    }, [
      d("legend", null, D(e.label), 1),
      e.options.length > 10 ? (u(), B(r(de), {
        key: 0,
        modelValue: n.value,
        "onUpdate:modelValue": i[0] || (i[0] = (o) => n.value = o),
        type: "search",
        "aria-label": "Find " + e.label.toLowerCase(),
        placeholder: "Find a choice…"
      }, null, 8, ["modelValue", "aria-label"])) : I("", !0),
      d("div", bs, [
        p(r(Ja), {
          "model-value": e.modelValue ?? [],
          options: c.value.map((o) => ({ value: o.value, label: o.label ?? r(ye)(o.value) })),
          optionLabel: "label",
          optionValue: "value",
          multiple: "",
          disabled: e.disabled,
          "aria-label": e.label,
          "onUpdate:modelValue": i[1] || (i[1] = (o) => a("update:modelValue", o ?? []))
        }, null, 8, ["model-value", "options", "disabled", "aria-label"]),
        (u(!0), h(q, null, ae(e.modelValue?.filter((o) => !s.value.some((f) => f.value === o)) ?? [], (o) => (u(), B(r(X), {
          severity: "secondary",
          text: "",
          size: "small",
          key: o,
          type: "button",
          class: "work-choice work-unavailable",
          "aria-label": "Remove unavailable " + o,
          onClick: (f) => v(o)
        }, {
          default: L(() => [
            M(D(r(ye)(o)) + " · unavailable ×", 1)
          ]),
          _: 2
        }, 1032, ["aria-label", "onClick"]))), 128))
      ]),
      e.options.length ? I("", !0) : (u(), h("span", hs, "No choices declared."))
    ], 8, ps));
  }
}), ys = {
  class: "work-stack",
  "aria-label": "Item types editor"
}, gs = { class: "work-section-heading" }, ks = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, ws = { class: "work-definition-meta" }, Vs = { class: "work-settings-grid" }, $s = { class: "work-stack work-tight" }, xs = { class: "work-stack work-tight" }, Ss = { class: "work-stack work-tight" }, Cs = { class: "work-stack work-tight" }, Es = {
  key: 0,
  class: "work-stack work-tight work-small"
}, Ts = {
  key: 0,
  class: "kx-empty"
}, Us = { class: "work-row work-add-definition" }, Ds = { class: "work-stack work-tight" }, Is = {
  key: 0,
  class: "work-error work-small"
}, As = /* @__PURE__ */ ce({
  __name: "TypesEditor",
  props: {
    draft: {},
    guardRemoval: { type: Function },
    issues: {}
  },
  setup(e) {
    const l = e, t = W(() => l.draft.item_types ?? []), a = z(""), n = z(""), s = z(""), c = W(() => /^[a-z][a-z0-9_]*$/.test(a.value) && !t.value.some((g) => g.id === a.value));
    function v() {
      c.value && ((l.draft.item_types ??= []).push({ id: a.value, title: ye(a.value), process: l.draft.processes?.[0]?.id ?? "", fields: [] }), a.value = "");
    }
    function m(g, y) {
      const w = g.id;
      g.id = y;
      for (const U of t.value) U.parent_types && (U.parent_types = U.parent_types.map((R) => R === w ? y : R));
    }
    function i(g, y) {
      g.fields = y, g.inherit && (g.inherit = g.inherit.filter((w) => y.includes(w)));
    }
    function o(g) {
      return t.value.filter((y) => y.id !== g.id && y.parent_types?.includes(g.id)).map((y) => y.title || ye(y.id));
    }
    async function f(g) {
      if (!s.value) {
        if (o(g).length) {
          n.value = `${g.title || ye(g.id)} is a parent type for ${o(g).join(", ")}. Remove those parent selections first.`;
          return;
        }
        s.value = g.id, n.value = "";
        try {
          const y = await l.guardRemoval?.("item_types", g.id);
          y ? n.value = y : ta(l.draft, "item_types", g.id);
        } finally {
          s.value = "";
        }
      }
    }
    return (g, y) => (u(), h("section", ys, [
      d("header", gs, [
        y[1] || (y[1] = d("div", null, [
          d("h2", null, "Item types"),
          d("p", { class: "work-muted work-small" }, "Choose the fields, parent relationships and process for each kind of work.")
        ], -1)),
        p(r(Pe), {
          class: "kx-tag-sm",
          severity: "secondary"
        }, {
          default: L(() => [
            M(D(t.value.length) + " " + D(t.value.length === 1 ? "type" : "types"), 1)
          ]),
          _: 1
        })
      ]),
      n.value ? (u(), h("p", ks, D(n.value), 1)) : I("", !0),
      p(xa, {
        columns: "types",
        count: t.value.length
      }, {
        default: L(() => [
          (u(!0), h(q, null, ae(t.value, (w, U) => (u(), B($a, {
            title: w.title || r(ye)(w.id),
            code: w.id,
            kind: e.draft.processes?.find((R) => R.id === w.process)?.name || r(ye)(w.process),
            key: U,
            class: "work-type-card"
          }, {
            usage: L(() => [
              d("span", ws, [
                p(r(Pe), {
                  class: "kx-tag-sm",
                  severity: "secondary"
                }, {
                  default: L(() => [
                    M(D(w.fields.length) + " " + D(w.fields.length === 1 ? "field" : "fields"), 1)
                  ]),
                  _: 2
                }, 1024),
                o(w).length ? (u(), B(r(Pe), {
                  key: 0,
                  class: "kx-tag-sm",
                  severity: "secondary"
                }, {
                  default: L(() => [
                    M("Parent of " + D(o(w).join(", ")), 1)
                  ]),
                  _: 2
                }, 1024)) : I("", !0)
              ])
            ]),
            actions: L(() => [
              p(r(X), {
                severity: "secondary",
                text: "",
                size: "small",
                disabled: !!s.value,
                onClick: (R) => f(w),
                "aria-label": "Remove type"
              }, {
                default: L(() => [
                  p(r(J), {
                    icon: "tabler:trash",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["disabled", "onClick"])
            ]),
            default: L(() => [
              (u(!0), h(q, null, ae(e.issues?.filter((R) => R.code === "item_type " + w.id) ?? [], (R) => (u(), h("p", {
                key: R.what,
                class: "work-error work-small",
                role: "alert"
              }, D(r(Va)(R)), 1))), 128)),
              d("div", Vs, [
                d("label", $s, [
                  y[2] || (y[2] = M("ID", -1)),
                  p(r(de), {
                    value: w.id,
                    onChange: (R) => m(w, R.target.value),
                    required: "",
                    pattern: "[a-z][a-z0-9_]*"
                  }, null, 8, ["value", "onChange"])
                ]),
                d("label", xs, [
                  y[3] || (y[3] = M("Title", -1)),
                  p(r(de), {
                    modelValue: w.title,
                    "onUpdate:modelValue": (R) => w.title = R,
                    placeholder: r(ye)(w.id)
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder"])
                ]),
                d("label", Ss, [
                  y[4] || (y[4] = M("Process", -1)),
                  p(r(le), {
                    modelValue: w.process,
                    "onUpdate:modelValue": (R) => w.process = R,
                    required: "",
                    appendTo: "self",
                    optionLabel: "label",
                    optionValue: "value",
                    optionDisabled: "disabled",
                    options: [...(e.draft.processes ?? []).map((R) => ({ label: R.name || r(ye)(R.id), value: R.id, disabled: !1 }))]
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                ])
              ]),
              p(zt, {
                label: "Fields",
                options: (e.draft.fields ?? []).map((R) => ({ value: R.code, label: r(xt)(R) })),
                "model-value": w.fields,
                "onUpdate:modelValue": (R) => i(w, R)
              }, null, 8, ["options", "model-value", "onUpdate:modelValue"]),
              p(zt, {
                label: "Parent types",
                options: t.value.map((R) => ({ value: R.id, label: R.title || r(ye)(R.id) })),
                modelValue: w.parent_types,
                "onUpdate:modelValue": (R) => w.parent_types = R
              }, null, 8, ["options", "modelValue", "onUpdate:modelValue"]),
              d("div", Cs, [
                p(zt, {
                  label: "Inherit from parent",
                  options: w.fields.map((R) => ({ value: R, label: r(xt)(e.draft.fields?.find((S) => S.code === R) ?? { code: R }) })),
                  modelValue: w.inherit,
                  "onUpdate:modelValue": (R) => w.inherit = R
                }, null, 8, ["options", "modelValue", "onUpdate:modelValue"]),
                y[5] || (y[5] = d("p", { class: "work-muted work-small" }, "These fields resolve from the parent when this item has no own value.", -1))
              ]),
              w.parent_types?.length ? (u(), h("label", Es, [
                y[6] || (y[6] = M("When the parent moves", -1)),
                p(r(le), {
                  modelValue: w.move_children,
                  "onUpdate:modelValue": (R) => w.move_children = R,
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
          t.value.length ? I("", !0) : (u(), h("p", Ts, "Add an item type to connect fields to a process.")),
          d("div", Us, [
            d("label", Ds, [
              y[7] || (y[7] = M("New type ID", -1)),
              p(r(de), {
                modelValue: a.value,
                "onUpdate:modelValue": y[0] || (y[0] = (w) => a.value = w),
                placeholder: "new_type",
                onKeydown: Ae(he(v, ["prevent"]), ["enter"])
              }, null, 8, ["modelValue", "onKeydown"])
            ]),
            p(r(X), {
              label: "Add type",
              severity: "secondary",
              disabled: !c.value,
              onClick: v,
              outlined: ""
            }, {
              icon: L(() => [
                p(r(J), {
                  icon: "tabler:plus",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["disabled"]),
            a.value && !c.value ? (u(), h("span", Is, "Use a unique lowercase code with letters, numbers and underscores.")) : I("", !0)
          ])
        ]),
        _: 1
      }, 8, ["count"])
    ]));
  }
}), Ps = ".work-process-canvas>svg{height:480px;width:100%}.work-process-canvas:focus-visible{outline:var(--p-focus-ring-width) var(--p-focus-ring-style) var(--p-focus-ring-color);outline-offset:var(--p-focus-ring-offset)}.work-state-card{fill:var(--p-content-background);stroke:var(--p-content-border-color);stroke-width:1.5}.work-graph-node.work-selected .work-state-card{stroke:var(--p-primary-color);stroke-width:2.5;fill:color-mix(in srgb,var(--p-primary-color) 6%,var(--p-content-background))}.work-graph-node:focus-visible .work-state-card{stroke:var(--p-focus-ring-color);stroke-width:var(--p-focus-ring-width)}.work-process-canvas .work-edge-label{font-size:12px;fill:var(--p-text-color)}.work-process-canvas .work-edge-label-bg{fill:var(--p-content-background);stroke:var(--p-content-border-color);stroke-width:1}.work-edge-line{stroke:var(--p-primary-color);stroke-width:1.5}.work-edge-return .work-edge-line{stroke:var(--p-text-muted-color);stroke-dasharray:5 4}.work-graph-arrow{fill:context-stroke}.work-lane-line{fill:none;stroke:var(--p-text-muted-color);stroke-width:1.5;stroke-dasharray:2 4}.work-node-connector{fill:var(--p-content-background);stroke:var(--p-primary-color);stroke-width:1.5}.work-node-connector:hover,.work-node-connector:focus-visible{fill:var(--p-primary-color)}.work-process-legend{position:static;flex-wrap:wrap;padding:10px 16px;border-top:1px solid var(--p-content-border-color);background:var(--p-content-background)}@media(max-width:700px){.work-process-canvas>svg{height:420px}}.work-process-more{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:8px;padding:8px 16px;border-top:1px solid var(--p-content-border-color);background:var(--p-content-background);color:var(--p-text-muted-color);font-size:12px}.work-process-canvas .work-graph-edge.work-selected .work-edge-label-bg{fill:var(--p-primary-color);stroke:var(--p-primary-color)}.work-process-canvas .work-graph-edge.work-selected .work-edge-label{fill:var(--p-primary-contrast-color)}", kl = /* @__PURE__ */ new WeakSet();
function Os(e) {
  const l = e.getRootNode();
  if (l instanceof ShadowRoot && !kl.has(l)) {
    const t = e.ownerDocument.createElement("style");
    t.textContent = Ps, l.append(t), kl.add(l);
  }
}
const Rs = 0.8;
function Ns(e, l, t) {
  const a = Math.min(1, l.width / e.width, l.height / e.height);
  if (a >= Rs) return { zoom: a, pan: { x: (e.width - l.width / a) / 2, y: (e.height - l.height / a) / 2 } };
  const n = e.nodes.find((c) => c.state.id === t) ?? e.nodes[0], s = Math.min(1, l.width / ((n?.width ?? 190) + 64));
  return { zoom: s, pan: n ? { x: e.direction === "TB" ? n.x - l.width / s / 2 : n.x - n.width / 2 - 32, y: e.direction === "TB" ? n.y - n.height / 2 - 32 : n.y - l.height / s / 2 } : { x: 0, y: 0 } };
}
const Ms = ["onKeydown"], Ls = {
  key: 0,
  class: "work-process-instruction",
  role: "status"
}, zs = ["viewBox"], Bs = ["id"], Fs = ["d", "marker-end"], js = ["aria-label", "aria-pressed", "onFocus", "onClick", "onKeydown"], qs = ["d"], Ws = ["d", "marker-end"], Gs = ["x", "y", "width", "height"], Ys = ["x", "y"], Ks = ["x", "dy"], Hs = ["aria-label", "aria-pressed", "onClick", "onKeydown", "onFocus", "onPointerup"], Xs = ["x", "y", "width", "height"], Js = ["cx", "cy"], Zs = ["x", "y"], Qs = ["x", "dy"], _s = ["x", "y"], er = ["x", "dy"], tr = {
  key: 0,
  class: "work-limit-text"
}, ar = ["aria-label", "onClick", "onKeydown"], lr = ["x", "y"], or = ["x", "dy"], ir = ["cx", "cy", "aria-label", "onPointerdown", "onClick", "onKeydown"], nr = ["d"], sr = {
  key: 1,
  class: "work-process-more",
  role: "status"
}, rr = { class: "work-process-legend" }, dr = /* @__PURE__ */ ce({
  __name: "ProcessGraph",
  props: {
    process: {},
    draft: {},
    selectedState: {},
    selectedTransition: {}
  },
  emits: ["state", "transition", "connect", "clear"],
  setup(e, { expose: l, emit: t }) {
    const a = e, n = t, s = Cl().replace(/:/g, "_"), c = z(""), v = z(), m = z(), i = z(900), o = z(!1), f = W(() => i.value < 700 ? 420 : 480), g = W(() => zo(a.process, a.draft, { width: i.value, height: f.value })), y = z(1), w = z({ x: 0, y: 0 }), U = z({ x: 0, y: 0 }), R = W(() => ({ width: i.value, height: o.value ? Math.max(f.value, g.value.height * Math.min(1, i.value / g.value.width)) : f.value })), S = W(() => g.value.nodes.filter((b) => b.x - b.width / 2 >= w.value.x && b.x + b.width / 2 <= w.value.x + R.value.width / y.value && b.y - b.height / 2 >= w.value.y && b.y + b.height / 2 <= w.value.y + R.value.height / y.value).length);
    function T() {
      o.value = !1;
      const b = Ns(g.value, R.value, a.process.initial);
      y.value = b.zoom, w.value = b.pan;
    }
    const E = W(() => `${w.value.x} ${w.value.y} ${R.value.width / y.value} ${R.value.height / y.value}`), C = W(() => g.value.nodes.find((b) => b.state.id === c.value));
    function $() {
      o.value = !0, y.value = Math.min(1, R.value.width / g.value.width), w.value = { x: (g.value.width - R.value.width / y.value) / 2, y: 0 };
    }
    function O(b) {
      const V = Math.max(0.02, Math.min(3, y.value * b)), k = 1 / y.value - 1 / V;
      w.value = { x: w.value.x + R.value.width * k / 2, y: w.value.y + R.value.height * k / 2 }, y.value = V;
    }
    function Z(b) {
      const V = R.value.width / y.value, k = R.value.height / y.value;
      (b.x - b.width / 2 < w.value.x || b.x + b.width / 2 > w.value.x + V || b.y - b.height / 2 < w.value.y || b.y + b.height / 2 > w.value.y + k) && (w.value = { x: b.x - V / 2, y: b.y - k / 2 });
    }
    function ue() {
      const b = g.value.nodes.find((V) => V.state === a.selectedState) ?? g.value.edges.find((V) => V.transition === a.selectedTransition);
      b && Z(b);
    }
    Ee([g, () => a.selectedState, () => a.selectedTransition], ue, { flush: "post" }), Ee(() => a.process.id, () => {
      c.value = "", A.clear(), T();
    }, { flush: "post" });
    function _(b) {
      if (b.target !== v.value) return;
      (b.key === "+" || b.key === "=") && (b.preventDefault(), O(1.2)), b.key === "-" && (b.preventDefault(), O(1 / 1.2)), b.key === "0" && (b.preventDefault(), $());
      const V = 60 / y.value;
      b.key.startsWith("Arrow") && (b.preventDefault(), w.value = { x: w.value.x + (b.key === "ArrowRight" ? V : b.key === "ArrowLeft" ? -V : 0), y: w.value.y + (b.key === "ArrowDown" ? V : b.key === "ArrowUp" ? -V : 0) });
    }
    function H(b) {
      c.value && c.value !== b.id && n("connect", c.value, b.id), c.value = "";
    }
    function P(b, V) {
      c.value = V.state.id, U.value = { x: V.x, y: V.y };
      const k = b.target;
      k instanceof Element && k.hasPointerCapture?.(b.pointerId) && k.releasePointerCapture(b.pointerId);
    }
    function ee(b, V) {
      if ((b.key === "Enter" || b.key === " ") && (b.preventDefault(), c.value ? H(V) : n("state", V)), ["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp"].includes(b.key)) {
        b.preventDefault();
        const k = Array.from(m.value?.querySelectorAll(".work-graph-node") ?? []), F = g.value.nodes.findIndex((re) => re.state === V), G = ["ArrowRight", "ArrowDown"].includes(b.key) ? 1 : -1;
        k[(F + G + k.length) % k.length]?.focus();
      }
    }
    function x() {
      c.value = "", A.clear(), n("clear");
    }
    const A = /* @__PURE__ */ new Map();
    let N = 0;
    function Y(b) {
      if (!b.target.closest('[role="button"]') && (A.set(b.pointerId, { x: b.clientX, y: b.clientY }), v.value?.setPointerCapture?.(b.pointerId), A.size === 2)) {
        const [V, k] = [...A.values()];
        N = Math.hypot(V.x - k.x, V.y - k.y);
      }
    }
    function se(b) {
      const V = m.value?.getBoundingClientRect();
      if (!V?.width) return;
      if (c.value) {
        U.value = { x: w.value.x + (b.clientX - V.left) * R.value.width / y.value / V.width, y: w.value.y + (b.clientY - V.top) * R.value.height / y.value / V.height };
        return;
      }
      const k = A.get(b.pointerId);
      if (k)
        if (A.set(b.pointerId, { x: b.clientX, y: b.clientY }), A.size === 2) {
          const [F, G] = [...A.values()], re = Math.hypot(F.x - G.x, F.y - G.y);
          N && O(re / N), N = re;
        } else w.value = { x: w.value.x - (b.clientX - k.x) * R.value.width / y.value / V.width, y: w.value.y - (b.clientY - k.y) * R.value.height / y.value / V.height };
    }
    function ge(b) {
      A.delete(b.pointerId), N = 0, c.value = "";
    }
    function pe(b) {
      b.ctrlKey && (b.preventDefault(), O(Math.exp(-b.deltaY * 0.01)));
    }
    let Me;
    wa(() => {
      if (v.value && Os(v.value), typeof ResizeObserver < "u" && m.value) {
        let b = !0;
        Me = new ResizeObserver(() => {
          const V = m.value?.getBoundingClientRect();
          if (!V?.width || !V.height) return;
          const k = R.value.width;
          i.value = V.width, (b || Math.abs(V.width - k) > 1) && (o.value ? $() : T(), b = !1), ue();
        }), Me.observe(m.value);
      }
    }), mt(() => Me?.disconnect()), l({ fit: $, zoomIn: () => O(1.2), zoomOut: () => O(1 / 1.2) });
    function De(b) {
      return b.category === "completed" ? "check" : b.category === "canceled" ? "x" : b.id === a.process.initial ? "arrow-bar-to-right" : { gate: "shield-check", automated: "bolt", parallel: "arrows-split" }[b.kind ?? ""] ?? "user";
    }
    return (b, V) => (u(), h("section", {
      ref_key: "canvas",
      ref: v,
      class: "work-process-canvas",
      "aria-label": "Process map",
      tabindex: "0",
      onKeydown: [
        _,
        Ae(he(x, ["stop"]), ["esc"])
      ],
      onPointerdown: Y,
      onPointermove: se,
      onPointerup: ge,
      onPointercancel: x,
      onWheel: pe
    }, [
      c.value ? (u(), h("p", Ls, "Choose the next stop. Escape cancels.")) : I("", !0),
      (u(), h("svg", {
        ref_key: "svg",
        ref: m,
        style: ro({ height: R.value.height + "px" }),
        viewBox: E.value,
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
          }, [...V[1] || (V[1] = [
            d("path", {
              d: "M0 0 L8 4 L0 8 z",
              class: "work-graph-arrow"
            }, null, -1)
          ])], 8, Bs)
        ]),
        (u(!0), h(q, null, ae(g.value.parallels, (k) => (u(), h("path", {
          key: k.key,
          d: k.path,
          class: "work-lane-line",
          "marker-end": `url(#${r(s)}-arrow)`
        }, [
          d("title", null, "Parallel lane from " + D(r(be)(k.state)), 1)
        ], 8, Fs))), 128)),
        (u(!0), h(q, null, ae(g.value.edges, (k) => (u(), h("g", {
          key: k.key,
          class: ct(["work-graph-edge", ["work-edge-" + k.type, { "work-selected": e.selectedTransition === k.transition }]]),
          role: "button",
          tabindex: "0",
          "aria-label": "Edit transition " + r(je)(k.transition),
          "aria-pressed": e.selectedTransition === k.transition,
          onFocus: (F) => Z(k),
          onClick: (F) => n("transition", k.transition),
          onKeydown: [
            Ae(he((F) => n("transition", k.transition), ["prevent"]), ["enter"]),
            Ae(he((F) => n("transition", k.transition), ["prevent"]), ["space"])
          ]
        }, [
          d("path", {
            d: k.path,
            class: "work-edge-hit"
          }, null, 8, qs),
          d("path", {
            d: k.path,
            class: "work-edge-line",
            "marker-end": `url(#${r(s)}-arrow)`
          }, null, 8, Ws),
          d("rect", {
            x: k.x - k.width / 2,
            y: k.y - k.height / 2,
            width: k.width,
            height: k.height,
            rx: "6",
            class: "work-edge-label-bg"
          }, null, 8, Gs),
          d("text", {
            x: k.x,
            y: k.y - (k.lines.length - 1) * 8 + 4,
            class: "work-edge-label",
            "text-anchor": "middle"
          }, [
            (u(!0), h(q, null, ae(k.lines, (F, G) => (u(), h("tspan", {
              key: G,
              x: k.x,
              dy: G ? 16 : 0
            }, D(F), 9, Ks))), 128))
          ], 8, Ys)
        ], 42, js))), 128)),
        (u(!0), h(q, null, ae(g.value.nodes, (k) => (u(), h("g", {
          key: k.state.id,
          class: ct(["work-graph-node", ["work-stop-" + k.state.category, { "work-selected": e.selectedState === k.state }]]),
          role: "button",
          tabindex: "0",
          "aria-label": "Edit state " + r(be)(k.state),
          "aria-pressed": e.selectedState === k.state,
          onClick: (F) => n("state", k.state),
          onKeydown: (F) => ee(F, k.state),
          onFocus: (F) => Z(k),
          onPointerup: he((F) => H(k.state), ["stop"])
        }, [
          d("rect", {
            x: k.x - k.width / 2,
            y: k.y - k.height / 2,
            width: k.width,
            height: k.height,
            rx: "10",
            class: "work-state-card"
          }, null, 8, Xs),
          d("circle", {
            cx: k.x - k.width / 2 + 22,
            cy: k.y - k.height / 2 + 25,
            r: "10",
            class: "work-stop-ring"
          }, null, 8, Js),
          p(r(J), {
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
            (u(!0), h(q, null, ae(k.title, (F, G) => (u(), h("tspan", {
              key: G,
              x: k.x - k.width / 2 + 42,
              dy: G ? 18 : 0
            }, D(F), 9, Qs))), 128))
          ], 8, Zs),
          d("text", {
            x: k.x - k.width / 2 + 16,
            y: k.y - k.height / 2 + 33 + k.title.length * 18,
            class: "work-node-meta"
          }, [
            (u(!0), h(q, null, ae(k.caption, (F, G) => (u(), h("tspan", {
              key: G,
              x: k.x - k.width / 2 + 16,
              dy: G ? 16 : 0
            }, D(F), 9, er))), 128)),
            e.draft.policy?.wip?.[k.state.id] ? (u(), h("tspan", tr, " · limit " + D(e.draft.policy.wip[k.state.id].limit), 1)) : I("", !0)
          ], 8, _s),
          (u(!0), h(q, null, ae(k.badges, (F, G) => (u(), h("g", {
            key: F.id,
            class: "work-any-transition",
            role: "button",
            tabindex: "0",
            "aria-label": "Edit transition " + r(je)(F),
            onClick: he((re) => n("transition", F), ["stop"]),
            onKeydown: [
              Ae(he((re) => n("transition", F), ["stop", "prevent"]), ["enter"]),
              Ae(he((re) => n("transition", F), ["stop", "prevent"]), ["space"])
            ]
          }, [
            d("text", {
              x: k.x - k.width / 2 + 16,
              y: k.y - k.height / 2 + 33 + k.title.length * 18 + k.caption.length * 16 + k.badges.slice(0, G).reduce((re, fe) => re + r(Ot)(r(je)(fe) + " works from any state").length * 18, 0),
              class: "work-node-meta"
            }, [
              (u(!0), h(q, null, ae(r(Ot)(r(je)(F) + " works from any state"), (re, fe) => (u(), h("tspan", {
                key: fe,
                x: k.x - k.width / 2 + 16,
                dy: fe ? 18 : 0
              }, D(re), 9, or))), 128))
            ], 8, lr)
          ], 40, ar))), 128)),
          ["completed", "canceled"].includes(k.state.category) ? I("", !0) : (u(), h("circle", {
            key: 0,
            cx: g.value.direction === "TB" ? k.x : k.x + k.width / 2,
            cy: g.value.direction === "TB" ? k.y + k.height / 2 : k.y,
            r: "7",
            class: "work-node-connector",
            role: "button",
            tabindex: "0",
            "aria-label": "Connect from " + r(be)(k.state),
            onPointerdown: he((F) => P(F, k), ["stop", "prevent"]),
            onClick: he((F) => n("state", k.state), ["stop"]),
            onKeydown: [
              Ae(he((F) => {
                c.value = k.state.id, U.value = { x: k.x, y: k.y };
              }, ["stop", "prevent"]), ["enter"]),
              Ae(he((F) => c.value = k.state.id, ["stop", "prevent"]), ["space"])
            ]
          }, null, 40, ir))
        ], 42, Hs))), 128)),
        C.value ? (u(), h("path", {
          key: 0,
          d: `M ${g.value.direction === "TB" ? C.value.x : C.value.x + C.value.width / 2} ${g.value.direction === "TB" ? C.value.y + C.value.height / 2 : C.value.y} L ${U.value.x} ${U.value.y}`,
          class: "work-connect-ghost"
        }, null, 8, nr)) : I("", !0)
      ], 12, zs)),
      !o.value && S.value < e.process.states.length ? (u(), h("div", sr, [
        d("span", null, D(S.value) + " of " + D(e.process.states.length) + " states in view · More " + D(g.value.direction === "TB" ? "below" : "to the right"), 1),
        p(r(X), {
          label: "Show full process",
          size: "small",
          text: "",
          onClick: V[0] || (V[0] = (k) => $())
        })
      ])) : I("", !0),
      d("div", rr, [
        d("span", null, D(e.process.states.length) + " states · " + D(Math.round(y.value * 100)) + "%", 1),
        V[2] || (V[2] = d("span", null, [
          d("i"),
          M("Transition")
        ], -1)),
        V[3] || (V[3] = d("span", null, [
          d("i", { class: "work-return-key" }),
          M("Return / loop")
        ], -1)),
        V[4] || (V[4] = d("span", null, "Drag to pan · Ctrl + scroll to zoom · Fit for full process", -1))
      ])
    ], 40, Ms));
  }
}), ur = {
  class: "work-process-list work-stack",
  "aria-label": "Process list"
}, cr = { class: "work-stack work-tight" }, mr = { class: "work-table-scroll" }, vr = { class: "work-settings-table work-process-table" }, fr = ["aria-selected"], pr = { class: "work-process-list-actions" }, br = { class: "work-table-scroll" }, hr = { class: "work-settings-table work-process-table" }, yr = ["aria-selected"], gr = { class: "work-process-list-actions" }, kr = /* @__PURE__ */ ce({
  __name: "ProcessList",
  props: {
    process: {},
    selectedState: {},
    selectedTransition: {}
  },
  emits: ["state", "transition", "removeState", "removeTransition", "addTransition"],
  setup(e) {
    return (l, t) => (u(), h("section", ur, [
      d("label", cr, [
        t[2] || (t[2] = M("Process name", -1)),
        p(r(de), {
          modelValue: e.process.name,
          "onUpdate:modelValue": t[0] || (t[0] = (a) => e.process.name = a),
          "aria-label": "Process name"
        }, null, 8, ["modelValue"])
      ]),
      t[5] || (t[5] = d("h3", null, "States", -1)),
      d("div", mr, [
        d("table", vr, [
          t[3] || (t[3] = d("thead", null, [
            d("tr", null, [
              d("th", null, "Name"),
              d("th", null, "Phase"),
              d("th", null, "Kind"),
              d("th", null, "Actions")
            ])
          ], -1)),
          d("tbody", null, [
            (u(!0), h(q, null, ae(e.process.states, (a) => (u(), h("tr", {
              key: a.id,
              "aria-selected": e.selectedState === a
            }, [
              d("td", null, [
                p(r(de), {
                  modelValue: a.name,
                  "onUpdate:modelValue": (n) => a.name = n,
                  "aria-label": "Name of " + r(be)(a)
                }, null, 8, ["modelValue", "onUpdate:modelValue", "aria-label"])
              ]),
              d("td", null, D(r(Xa)(a.category)), 1),
              d("td", null, [
                p(r(Pe), { severity: "secondary" }, {
                  default: L(() => [
                    M(D(r(Il)(a.kind)), 1)
                  ]),
                  _: 2
                }, 1024)
              ]),
              d("td", pr, [
                p(r(X), {
                  size: "small",
                  text: "",
                  severity: "secondary",
                  "aria-label": "Edit state",
                  onClick: (n) => l.$emit("state", a)
                }, {
                  default: L(() => [
                    p(r(J), { icon: "tabler:pencil" })
                  ]),
                  _: 1
                }, 8, ["onClick"]),
                p(r(X), {
                  size: "small",
                  text: "",
                  severity: "danger",
                  "aria-label": "Remove state " + r(be)(a),
                  onClick: (n) => l.$emit("removeState", a)
                }, {
                  default: L(() => [
                    p(r(J), { icon: "tabler:trash" })
                  ]),
                  _: 1
                }, 8, ["aria-label", "onClick"])
              ])
            ], 8, fr))), 128))
          ])
        ])
      ]),
      t[6] || (t[6] = d("h3", null, "Transitions", -1)),
      d("div", br, [
        d("table", hr, [
          t[4] || (t[4] = d("thead", null, [
            d("tr", null, [
              d("th", null, "Name"),
              d("th", null, "From"),
              d("th", null, "To"),
              d("th", null, "Actions")
            ])
          ], -1)),
          d("tbody", null, [
            (u(!0), h(q, null, ae(e.process.transitions ?? [], (a) => (u(), h("tr", {
              key: a.id,
              "aria-selected": e.selectedTransition === a
            }, [
              d("td", null, [
                p(r(de), {
                  modelValue: a.name,
                  "onUpdate:modelValue": (n) => a.name = n,
                  placeholder: r(je)(a),
                  "aria-label": "Name of " + r(je)(a)
                }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder", "aria-label"])
              ]),
              d("td", null, D(a.from === "any" ? "Any state" : a.from.map((n) => r(be)(e.process.states.find((s) => s.id === n))).join(", ")), 1),
              d("td", null, D(r(be)(e.process.states.find((n) => n.id === a.to))), 1),
              d("td", gr, [
                p(r(X), {
                  size: "small",
                  text: "",
                  severity: "secondary",
                  "aria-label": "Edit transition",
                  onClick: (n) => l.$emit("transition", a)
                }, {
                  default: L(() => [
                    p(r(J), { icon: "tabler:pencil" })
                  ]),
                  _: 1
                }, 8, ["onClick"]),
                p(r(X), {
                  size: "small",
                  text: "",
                  severity: "danger",
                  "aria-label": "Remove transition " + r(je)(a),
                  onClick: (n) => l.$emit("removeTransition", a)
                }, {
                  default: L(() => [
                    p(r(J), { icon: "tabler:trash" })
                  ]),
                  _: 1
                }, 8, ["aria-label", "onClick"])
              ])
            ], 8, yr))), 128))
          ])
        ])
      ]),
      p(r(X), {
        label: "Add transition",
        severity: "secondary",
        outlined: "",
        onClick: t[1] || (t[1] = (a) => l.$emit("addTransition"))
      }, {
        icon: L(() => [
          p(r(J), { icon: "tabler:plus" })
        ]),
        _: 1
      })
    ]));
  }
}), wr = { class: "work-stack work-transition-settings" }, Vr = { class: "work-stack work-tight" }, $r = { class: "work-row" }, xr = { class: "work-row" }, Sr = { class: "work-row" }, Cr = { class: "work-stack work-tight" }, Er = { class: "work-row" }, Tr = { class: "work-stack work-tight" }, Ur = { class: "work-stack work-tight" }, Dr = /* @__PURE__ */ ce({
  __name: "TransitionSettings",
  props: {
    transition: {},
    process: {},
    draft: {},
    advanced: { type: Boolean },
    boardId: {}
  },
  emits: ["validity"],
  setup(e, { emit: l }) {
    const t = e, a = l;
    function n() {
      (t.transition.set ??= []).push({ field: t.draft.fields?.[0]?.code ?? "", value: "" });
    }
    function s(c, v) {
      const m = t.transition.set?.[c];
      !m || !t.transition.set || (t.transition.set[c] = { field: m.field, ...v === "clear" ? { clear: !0 } : v === "copy" ? { copy: "" } : { value: "" } });
    }
    return (c, v) => (u(), h("div", wr, [
      d("label", Vr, [
        v[14] || (v[14] = M("To state", -1)),
        p(r(le), {
          modelValue: e.transition.to,
          "onUpdate:modelValue": v[0] || (v[0] = (m) => e.transition.to = m),
          "aria-label": "To state",
          appendTo: "self",
          optionLabel: "label",
          optionValue: "value",
          options: e.process.states.map((m) => ({ label: r(be)(m), value: m.id }))
        }, null, 8, ["modelValue", "options"])
      ]),
      d("label", $r, [
        v[15] || (v[15] = d("span", { class: "work-spacer" }, "Happens automatically", -1)),
        p(r(Ne), {
          "model-value": e.transition.auto,
          "onUpdate:modelValue": v[1] || (v[1] = (m) => {
            e.transition.auto = m, m || delete e.transition.default;
          }),
          "aria-label": "Automatic transition"
        }, null, 8, ["model-value"])
      ]),
      d("label", xr, [
        v[16] || (v[16] = d("span", { class: "work-spacer" }, "Default automatic transition", -1)),
        p(r(Ne), {
          modelValue: e.transition.default,
          "onUpdate:modelValue": v[2] || (v[2] = (m) => e.transition.default = m),
          disabled: !e.transition.auto,
          "aria-label": "Default transition"
        }, null, 8, ["modelValue", "disabled"])
      ]),
      d("label", Sr, [
        v[17] || (v[17] = d("span", { class: "work-spacer" }, "Works from any state", -1)),
        p(r(Ne), {
          "model-value": e.transition.from === "any",
          "aria-label": "Works from any state",
          "onUpdate:modelValue": v[3] || (v[3] = (m) => e.transition.from = m ? "any" : [])
        }, null, 8, ["model-value"])
      ]),
      e.transition.from !== "any" ? (u(), B(zt, {
        key: 0,
        label: "From states",
        options: e.process.states.map((m) => ({ value: m.id, label: r(be)(m) })),
        modelValue: e.transition.from,
        "onUpdate:modelValue": v[4] || (v[4] = (m) => e.transition.from = m)
      }, null, 8, ["options", "modelValue"])) : I("", !0),
      v[22] || (v[22] = d("h4", { class: "work-process-group" }, "Must be filled", -1)),
      p(zt, {
        label: "Required fields",
        options: e.draft.fields?.map((m) => ({ value: m.code, label: m.title || m.code })) ?? [],
        modelValue: e.transition.require,
        "onUpdate:modelValue": v[5] || (v[5] = (m) => e.transition.require = m)
      }, null, 8, ["options", "modelValue"]),
      v[23] || (v[23] = d("h4", { class: "work-process-group" }, "Also sets", -1)),
      (u(!0), h(q, null, ae(e.transition.set ?? [], (m, i) => (u(), h("div", {
        key: i,
        class: "work-process-value work-stack work-tight"
      }, [
        d("label", Cr, [
          v[18] || (v[18] = M("Field", -1)),
          p(r(le), {
            modelValue: m.field,
            "onUpdate:modelValue": (o) => m.field = o,
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            options: e.draft.fields?.map((o) => ({ value: o.code, label: o.title || o.code })) ?? []
          }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
        ]),
        d("div", Er, [
          p(r(le), {
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
            "onUpdate:modelValue": (o) => s(i, o)
          }, null, 8, ["model-value", "onUpdate:modelValue"]),
          p(r(X), {
            text: "",
            severity: "danger",
            "aria-label": "Remove value " + (i + 1),
            onClick: (o) => e.transition.set?.splice(i, 1)
          }, {
            default: L(() => [
              p(r(J), { icon: "tabler:trash" })
            ]),
            _: 1
          }, 8, ["aria-label", "onClick"])
        ]),
        m.copy !== void 0 ? (u(), B(r(le), {
          key: 0,
          modelValue: m.copy,
          "onUpdate:modelValue": (o) => m.copy = o,
          "aria-label": "Copy from field",
          appendTo: "self",
          optionLabel: "label",
          optionValue: "value",
          options: e.draft.fields?.map((o) => ({ value: o.code, label: o.title || o.code })) ?? []
        }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])) : m.clear ? I("", !0) : (u(!0), h(q, { key: 1 }, ae(e.draft.fields?.filter((o) => o.code === m.field) ?? [], (o) => (u(), B(Ol, {
          key: o.code,
          "board-id": e.boardId ?? "",
          field: o,
          modelValue: m.value,
          "onUpdate:modelValue": (f) => m.value = f,
          onValidity: (f) => a("validity", "effect-" + i, f)
        }, null, 8, ["board-id", "field", "modelValue", "onUpdate:modelValue", "onValidity"]))), 128))
      ]))), 128)),
      p(r(X), {
        label: "Add value",
        severity: "secondary",
        outlined: "",
        size: "small",
        onClick: n
      }, {
        icon: L(() => [
          p(r(J), { icon: "tabler:plus" })
        ]),
        _: 1
      }),
      e.advanced ? (u(), h(q, { key: 1 }, [
        d("label", Tr, [
          v[19] || (v[19] = M("Offer to people", -1)),
          p(r(le), {
            "model-value": e.transition.people,
            "aria-label": "Offer to people",
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            options: [{ label: "Work default", value: void 0 }, { label: "Offer explicitly", value: !0 }, { label: "Hide from people", value: !1 }],
            "onUpdate:modelValue": v[6] || (v[6] = (m) => e.transition.people = m)
          }, null, 8, ["model-value"])
        ]),
        d("label", Ur, [
          v[20] || (v[20] = M("Evaluation order", -1)),
          p(r(He), {
            "model-value": e.transition.order ?? null,
            "aria-label": "Transition order",
            min: 0,
            useGrouping: !1,
            "onUpdate:modelValue": v[7] || (v[7] = (m) => e.transition.order = m ?? void 0)
          }, null, 8, ["model-value"])
        ]),
        v[21] || (v[21] = d("h4", { class: "work-process-group" }, "Only when", -1)),
        p(Za, {
          label: "Allow this transition when",
          draft: e.draft,
          "board-id": e.boardId,
          "model-value": e.transition.when,
          "onUpdate:modelValue": v[8] || (v[8] = (m) => e.transition.when = m),
          onValidity: v[9] || (v[9] = (m) => a("validity", "when", m))
        }, null, 8, ["draft", "board-id", "model-value"]),
        p(at, {
          label: "Set values",
          "model-value": e.transition.set,
          shape: "array",
          "onUpdate:modelValue": v[10] || (v[10] = (m) => e.transition.set = m),
          onValidity: v[11] || (v[11] = (m) => a("validity", "set", m))
        }, null, 8, ["model-value"]),
        p(at, {
          label: "Guards",
          "model-value": e.transition.guards,
          shape: "array",
          "onUpdate:modelValue": v[12] || (v[12] = (m) => e.transition.guards = m),
          onValidity: v[13] || (v[13] = (m) => a("validity", "guards", m))
        }, null, 8, ["model-value"])
      ], 64)) : I("", !0)
    ]));
  }
}), ka = /* @__PURE__ */ ce({
  __name: "CapacityControl",
  props: {
    draft: {},
    state: {},
    label: {},
    hard: { type: Boolean }
  },
  setup(e) {
    const l = e, t = W(() => l.draft.policy?.wip?.[l.state]);
    function a(s) {
      if (s === null) {
        l.draft.policy?.wip && delete l.draft.policy.wip[l.state];
        return;
      }
      const c = l.draft.policy ??= {}, v = c.wip ??= {};
      v[l.state] = { ...v[l.state], limit: s };
    }
    function n(s) {
      t.value && (t.value.hard = s);
    }
    return (s, c) => e.hard ? (u(), B(r(Ne), {
      key: 0,
      "aria-label": e.label,
      disabled: !t.value,
      "model-value": t.value?.hard ?? !1,
      "onUpdate:modelValue": n
    }, null, 8, ["aria-label", "disabled", "model-value"])) : (u(), B(r(He), {
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
}), Ka = { minutes: 60, hours: 3600, days: 86400 };
function Gt(e, l) {
  const t = /^P(\d+)W$/.exec(e), a = /^P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+\.?\d*)S)?)?$/.exec(e);
  if (!t && (!a || e === "P" || e.endsWith("T"))) return;
  const n = t ? Number(t[1]) * 604800 : Number(a[1] ?? 0) * 86400 + Number(a[2] ?? 0) * 3600 + Number(a[3] ?? 0) * 60 + Number(a[4] ?? 0);
  if (!Number.isFinite(n) || n <= 0) return;
  const s = l ?? (n % 86400 === 0 ? "days" : n % 3600 === 0 ? "hours" : "minutes");
  return { amount: n / Ka[s], unit: s };
}
function Ir(e, l) {
  if (e == null) return;
  if (!Number.isFinite(e * Ka[l]) || e <= 0) throw new Error("Enter a positive duration.");
  const t = (a) => a.toLocaleString("en-US", { useGrouping: !1, maximumSignificantDigits: 21 });
  return Number.isInteger(e) ? l === "days" ? `P${t(e)}D` : l === "hours" ? `PT${t(e)}H` : `PT${t(e)}M` : `PT${t(e * Ka[l])}S`;
}
const Ar = { class: "work-stack work-tight" }, Pr = {
  class: "work-duration-control",
  style: { "max-width": "360px" }
}, Or = {
  key: 0,
  class: "work-error",
  role: "alert"
}, $t = /* @__PURE__ */ ce({
  __name: "DurationControl",
  props: {
    modelValue: {},
    label: {},
    disabled: { type: Boolean }
  },
  emits: ["update:modelValue", "validity"],
  setup(e, { emit: l }) {
    const t = e, a = l, n = "duration:" + Cl(), s = z("days"), c = z("");
    Ee(() => t.modelValue, (g) => {
      c.value = "";
      const y = g ? Gt(g) : void 0;
      y && (s.value = y.unit), a("validity", !g || !!y, n);
    }, { immediate: !0 });
    const v = W(() => t.modelValue ? Gt(t.modelValue, s.value)?.amount ?? null : null);
    function m(g) {
      try {
        const y = Ir(g, s.value);
        c.value = "", a("update:modelValue", y), a("validity", !0, n);
      } catch (y) {
        c.value = y.message, a("validity", !1, n);
      }
    }
    function i(g) {
      g == null && c.value || m(g);
    }
    function o(g) {
      g.formattedValue.trim() && (typeof g.value != "number" || !Number.isFinite(g.value)) ? (c.value = "Enter a positive duration.", a("validity", !1, n)) : m(typeof g.value == "number" ? g.value : null);
    }
    function f(g) {
      const y = v.value;
      s.value = g, !(t.modelValue && !Gt(t.modelValue)) && m(y);
    }
    return mt(() => a("validity", !0, n)), (g, y) => (u(), h("label", Ar, [
      M(D(e.label), 1),
      d("span", Pr, [
        p(r(He), {
          "model-value": v.value,
          "aria-label": e.label,
          min: 0,
          "aria-invalid": !!c.value || !!e.modelValue && !r(Gt)(e.modelValue),
          disabled: e.disabled,
          useGrouping: !1,
          onInput: o,
          "onUpdate:modelValue": y[0] || (y[0] = (w) => i(w))
        }, null, 8, ["model-value", "aria-label", "aria-invalid", "disabled"]),
        p(r(le), {
          "model-value": s.value,
          "aria-label": e.label + " unit",
          disabled: e.disabled,
          options: [{ label: "Minutes", value: "minutes" }, { label: "Hours", value: "hours" }, { label: "Days", value: "days" }],
          optionLabel: "label",
          optionValue: "value",
          appendTo: "self",
          "onUpdate:modelValue": y[1] || (y[1] = (w) => f(w))
        }, null, 8, ["model-value", "aria-label", "disabled"])
      ]),
      c.value || e.modelValue && !r(Gt)(e.modelValue) ? (u(), h("span", Or, D(c.value || `Unsupported duration: ${e.modelValue}`), 1)) : I("", !0)
    ]));
  }
}), Rr = { class: "work-stack" }, Nr = { class: "work-settings-grid" }, Mr = { class: "work-stack work-tight" }, Lr = { class: "work-stack work-tight" }, zr = {
  key: 1,
  class: "work-stack work-tight"
}, Br = { class: "work-stack work-tight" }, Fr = { class: "work-settings-grid" }, jr = { class: "work-row" }, qr = { class: "work-stack work-tight" }, Wr = {
  key: 0,
  class: "work-stack work-tight"
}, Gr = /* @__PURE__ */ ce({
  __name: "TimersEditor",
  props: {
    state: {},
    draft: {}
  },
  emits: ["validity"],
  setup(e, { emit: l }) {
    const t = e, a = l;
    function n() {
      return t.state.timers ?? [];
    }
    function s() {
      const i = t.state.timers ?? (t.state.timers = []);
      i.push({ id: wt("timer", i), after: "P1D", then: { emit: "reminder" } });
    }
    function c(i, o) {
      delete i.after, delete i.at_field, o === "after" ? i.after = "P1D" : i.at_field = "";
    }
    function v(i, o, f) {
      f ? i[o] = f : (delete i[o], delete i.table);
    }
    function m(i, o) {
      i.then = o === "emit" ? { emit: "" } : { transition: "" };
    }
    return (i, o) => (u(), h("section", Rr, [
      o[8] || (o[8] = d("h4", null, "Timers", -1)),
      (u(!0), h(q, null, ae(n(), (f, g) => (u(), h("article", {
        key: f.id,
        class: "work-settings-card work-stack"
      }, [
        d("div", Nr, [
          d("label", Mr, [
            o[2] || (o[2] = M("Timer ID", -1)),
            p(r(de), {
              modelValue: f.id,
              "onUpdate:modelValue": (y) => f.id = y,
              required: "",
              pattern: "[a-z][a-z0-9_]*"
            }, null, 8, ["modelValue", "onUpdate:modelValue"])
          ]),
          d("label", Lr, [
            o[3] || (o[3] = M("Deadline", -1)),
            p(r(le), {
              "model-value": f.at_field !== void 0 ? "at_field" : "after",
              "onUpdate:modelValue": (y) => c(f, y),
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
          f.after !== void 0 ? (u(), B($t, {
            key: 0,
            modelValue: f.after,
            "onUpdate:modelValue": (y) => f.after = y,
            label: "After",
            onValidity: o[0] || (o[0] = (y, w) => a("validity", w, y))
          }, null, 8, ["modelValue", "onUpdate:modelValue"])) : (u(), h("label", zr, [
            o[4] || (o[4] = M("At field", -1)),
            p(r(le), {
              modelValue: f.at_field,
              "onUpdate:modelValue": (y) => f.at_field = y,
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
          d("label", Br, [
            o[5] || (o[5] = M("Duration by field", -1)),
            p(r(le), {
              "model-value": f.by ?? "",
              "onUpdate:modelValue": (y) => v(f, "by", y),
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
        f.by ? (u(), B(at, {
          key: 0,
          label: "Duration table",
          hint: "Map field values to ISO durations.",
          "model-value": f.table,
          shape: "object",
          "onUpdate:modelValue": (y) => f.table = y,
          onValidity: (y) => a("validity", "table-" + g, y)
        }, null, 8, ["model-value", "onUpdate:modelValue", "onValidity"])) : I("", !0),
        d("div", Fr, [
          p($t, {
            modelValue: f.repeat,
            "onUpdate:modelValue": (y) => f.repeat = y,
            label: "Repeat every",
            onValidity: o[1] || (o[1] = (y, w) => a("validity", w, y)),
            disabled: f.interrupting
          }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"]),
          d("label", jr, [
            p(r(Mt), {
              modelValue: f.interrupting,
              "onUpdate:modelValue": [(y) => f.interrupting = y, (y) => f.interrupting && delete f.repeat],
              binary: ""
            }, null, 8, ["modelValue", "onUpdate:modelValue"]),
            o[6] || (o[6] = M("Interrupting", -1))
          ]),
          d("label", qr, [
            o[7] || (o[7] = M("Then", -1)),
            p(r(le), {
              "model-value": f.then?.transition !== void 0 ? "transition" : "emit",
              "onUpdate:modelValue": (y) => m(f, y),
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
          f.then ? (u(), h("label", Wr, [
            M(D(f.then.transition !== void 0 ? "Transition ID" : "Event name"), 1),
            f.then.transition !== void 0 ? (u(), B(r(de), {
              key: 0,
              modelValue: f.then.transition,
              "onUpdate:modelValue": (y) => f.then.transition = y
            }, null, 8, ["modelValue", "onUpdate:modelValue"])) : (u(), B(r(de), {
              key: 1,
              modelValue: f.then.emit,
              "onUpdate:modelValue": (y) => f.then.emit = y
            }, null, 8, ["modelValue", "onUpdate:modelValue"]))
          ])) : I("", !0)
        ]),
        p(r(X), {
          severity: "secondary",
          onClick: (y) => n().splice(g, 1),
          "aria-label": "Remove timer",
          text: "",
          size: "small"
        }, {
          default: L(() => [
            p(r(J), {
              icon: "tabler:trash",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        }, 8, ["onClick"])
      ]))), 128)),
      p(r(X), {
        label: "Add timer",
        severity: "secondary",
        onClick: s,
        outlined: ""
      }, {
        icon: L(() => [
          p(r(J), {
            icon: "tabler:plus",
            "aria-hidden": "true"
          })
        ]),
        _: 1
      })
    ]));
  }
}), Yr = ["aria-label"], Kr = { class: "work-stack work-tight" }, Hr = {
  key: 0,
  class: "work-stack work-tight"
}, Xr = /* @__PURE__ */ ce({
  __name: "PrincipalSourceEditor",
  props: {
    modelValue: {},
    draft: {},
    boardId: {},
    label: {}
  },
  emits: ["update:modelValue", "validity"],
  setup(e, { emit: l }) {
    const t = e, a = l, n = W(() => Array.isArray(t.modelValue) ? "principals" : "field" in t.modelValue ? "field" : "group"), s = W(() => Array.isArray(t.modelValue) ? t.modelValue : "group" in t.modelValue && t.modelValue.group ? [{ kind: "group", id: t.modelValue.group }] : []);
    function c(m) {
      a("update:modelValue", m === "field" ? { field: "" } : m === "group" ? { group: "" } : []);
    }
    function v(m) {
      a("update:modelValue", n.value === "group" ? { group: m.at(-1)?.id ?? "" } : m);
    }
    return El(() => a("validity", Array.isArray(t.modelValue) ? t.modelValue.length > 0 : "field" in t.modelValue ? !!t.modelValue.field : !!t.modelValue.group)), mt(() => a("validity", !0)), (m, i) => (u(), h("section", {
      class: "work-stack work-tight",
      "aria-label": e.label
    }, [
      d("label", Kr, [
        M(D(e.label) + " source", 1),
        p(r(le), {
          "model-value": n.value,
          "aria-label": e.label + " source",
          options: [{ label: "Group", value: "group" }, { label: "People and groups", value: "principals" }, { label: "Principal field", value: "field" }],
          optionLabel: "label",
          optionValue: "value",
          appendTo: "self",
          "onUpdate:modelValue": c
        }, null, 8, ["model-value", "aria-label"])
      ]),
      "field" in e.modelValue ? (u(), h("label", Hr, [
        i[1] || (i[1] = M("Principal field", -1)),
        p(r(le), {
          "model-value": e.modelValue.field,
          "aria-label": e.label + " field",
          options: e.draft.fields?.filter((o) => o.type === "principal").map((o) => ({ label: o.title || o.code, value: o.code })) ?? [],
          optionLabel: "label",
          optionValue: "value",
          appendTo: "self",
          "onUpdate:modelValue": i[0] || (i[0] = (o) => a("update:modelValue", { field: o }))
        }, null, 8, ["model-value", "aria-label", "options"])
      ])) : (u(), B(Qa, {
        key: 1,
        "board-id": e.boardId,
        label: e.label,
        kinds: n.value === "group" ? "group" : "user,group,service",
        "model-value": s.value,
        "onUpdate:modelValue": v
      }, null, 8, ["board-id", "label", "kinds", "model-value"]))
    ], 8, Yr));
  }
}), Jr = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, Zr = {
  class: "work-stack work-tight",
  "aria-label": "Approval sources"
}, Qr = { class: "work-row" }, _r = {
  key: 0,
  class: "work-stack work-tight"
}, ed = ["kinds", "value"], td = {
  key: 2,
  class: "work-muted work-small",
  role: "status"
}, ad = {
  key: 3,
  class: "work-chips"
}, ld = { class: "work-row work-small" }, od = { class: "work-process-options" }, id = { class: "work-stack work-tight" }, nd = {
  key: 4,
  class: "work-error work-small",
  role: "alert"
}, sd = {
  key: 5,
  class: "work-muted work-small"
}, rd = /* @__PURE__ */ ce({
  __name: "ApproversEditor",
  props: {
    approvals: {},
    boardId: {}
  },
  emits: ["validity"],
  setup(e, { emit: l }) {
    const t = e, a = l, { principalLabel: n, rememberPrincipal: s, nameError: c } = Tl(() => t.boardId ?? "", () => Array.isArray(t.approvals.from) ? t.approvals.from : "group" in t.approvals.from ? [{ kind: "group", id: t.approvals.from.group }] : []), v = z(!1), m = W(() => Array.isArray(t.approvals.from) ? "principals" : "field" in t.approvals.from ? "field" : "group"), i = W(() => Array.isArray(t.approvals.from) ? t.approvals.from.some((y) => y.kind === "group") || t.approvals.from.length >= t.approvals.min : "field" in t.approvals.from ? !!t.approvals.from.field : !!t.approvals.from.group);
    El(() => a("validity", Number.isSafeInteger(t.approvals.min) && t.approvals.min > 0 && i.value)), mt(() => a("validity", !0)), wa(async () => {
      v.value = await Nt("wc-principal-picker");
    });
    function o(y) {
      t.approvals.from = y === "group" ? { group: "" } : y === "field" ? { field: "" } : [];
    }
    function f(y) {
      const w = y.detail, U = w?.principal_id ?? w?.id;
      if (m.value === "group") {
        t.approvals.from = { group: U ?? "" };
        return;
      }
      if (!U || !Array.isArray(t.approvals.from)) return;
      const R = { kind: w.type ?? w.kind ?? "user", id: U };
      w.label && s(R, w.label), t.approvals.from.some((S) => S.id === U && S.kind === R.kind) || t.approvals.from.push(R);
    }
    function g(y) {
      Array.isArray(t.approvals.from) && t.approvals.from.splice(y, 1);
    }
    return (y, w) => (u(), h(q, null, [
      r(c) ? (u(), h("p", Jr, D(r(c)), 1)) : I("", !0),
      d("section", Zr, [
        d("label", Qr, [
          w[4] || (w[4] = d("span", { class: "work-spacer" }, "Approvals needed", -1)),
          p(r(He), {
            modelValue: e.approvals.min,
            "onUpdate:modelValue": w[0] || (w[0] = (U) => e.approvals.min = U),
            min: 1,
            required: "",
            useGrouping: !1
          }, null, 8, ["modelValue"])
        ]),
        w[9] || (w[9] = d("span", { class: "work-field-label" }, "Approvers", -1)),
        "field" in e.approvals.from ? (u(), h("label", _r, [
          w[5] || (w[5] = M("Principal field", -1)),
          p(r(de), {
            modelValue: e.approvals.from.field,
            "onUpdate:modelValue": w[1] || (w[1] = (U) => e.approvals.from.field = U),
            "aria-label": "Principal field"
          }, null, 8, ["modelValue"])
        ])) : v.value ? (u(), h("wc-principal-picker", {
          key: m.value,
          kinds: m.value === "group" ? "group" : "user,group,service",
          value: JSON.stringify("group" in e.approvals.from ? { type: "group", principal_id: e.approvals.from.group } : {}),
          onConfigChanged: f
        }, null, 40, ed)) : (u(), h("p", td, "The principal picker is unavailable.")),
        Array.isArray(e.approvals.from) ? (u(), h("div", ad, [
          (u(!0), h(q, null, ae(e.approvals.from, (U, R) => (u(), B(r(Pe), {
            key: U.kind + ":" + U.id,
            class: "kx-tag-sm",
            severity: "secondary"
          }, {
            default: L(() => [
              M(D(r(n)(U)), 1),
              p(r(X), {
                "aria-label": "Remove approver " + (R + 1),
                text: "",
                severity: "secondary",
                size: "small",
                onClick: (S) => g(R)
              }, {
                default: L(() => [
                  p(r(J), {
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
        d("label", ld, [
          w[6] || (w[6] = d("span", { class: "work-spacer" }, "Author cannot approve their own item", -1)),
          p(r(Ne), {
            modelValue: e.approvals.prevent_self,
            "onUpdate:modelValue": w[2] || (w[2] = (U) => e.approvals.prevent_self = U),
            "aria-label": "Author cannot approve their own item"
          }, null, 8, ["modelValue"])
        ]),
        d("details", od, [
          w[8] || (w[8] = d("summary", null, "Approval options", -1)),
          d("label", id, [
            w[7] || (w[7] = M("Approval source", -1)),
            p(r(le), {
              "model-value": m.value,
              "onUpdate:modelValue": w[3] || (w[3] = (U) => o(U)),
              appendTo: "self",
              optionLabel: "label",
              optionValue: "value",
              options: [{ label: "Group members", value: "group" }, { label: "People and groups", value: "principals" }, { label: "Principal field", value: "field" }]
            }, null, 8, ["model-value"])
          ])
        ]),
        Array.isArray(e.approvals.from) && !i.value ? (u(), h("p", nd, "Select at least " + D(e.approvals.min) + " distinct principals, or lower the minimum.", 1)) : "group" in e.approvals.from && !e.approvals.from.group ? (u(), h("p", sd, "Choose the group that can approve this state.")) : I("", !0)
      ])
    ], 64));
  }
}), dd = {
  class: "work-state-settings work-stack",
  "aria-label": "State settings"
}, ud = { class: "work-process-kind" }, cd = { class: "work-process-options" }, md = { class: "work-stack" }, vd = { class: "work-row" }, fd = { class: "work-stack work-tight" }, pd = { class: "work-row" }, bd = { class: "work-stack work-tight" }, hd = { class: "work-row" }, yd = { class: "work-row" }, gd = { class: "work-stack work-tight" }, kd = { class: "work-row" }, wd = { class: "work-stack work-tight" }, Vd = { class: "work-stack work-tight" }, $d = {
  key: 0,
  class: "work-row"
}, xd = {
  key: 1,
  class: "work-muted work-small"
}, Sd = { class: "work-row" }, Cd = { class: "work-row" }, Ed = { class: "work-stack work-tight" }, Td = { class: "work-row" }, Ud = /* @__PURE__ */ ce({
  __name: "StateSettings",
  props: {
    state: {},
    process: {},
    draft: {},
    advanced: { type: Boolean },
    boardId: {}
  },
  emits: ["validity"],
  setup(e, { emit: l }) {
    const t = e, a = l, n = W(() => (t.process.transitions ?? []).filter((m) => m.from === "any" || m.from.includes(t.state.id))), s = [{ value: "human", icon: "user" }, { value: "gate", icon: "shield-check" }, { value: "automated", icon: "bolt" }, { value: "parallel", icon: "arrows-split" }];
    function c(m) {
      const i = t.state;
      i.kind = m, delete i.run, delete i.release_when, delete i.regions, delete i.join, delete i.due, (m === "automated" || m === "gate") && delete i.awaiting, m === "automated" && (i.run = { stage: "", retry: { max: 1, backoff: "PT1M" } }), m === "gate" && (i.release_when = { approvals: { min: 1, from: { group: "" }, prevent_self: !0 } }), m === "parallel" && (i.regions = [{ id: "region_1", initial: t.process.states.find((o) => o.id !== i.id)?.id ?? "" }], i.join = "all");
    }
    function v(m) {
      t.state.run && (m ? t.state.run.on_fail = m : delete t.state.run.on_fail);
    }
    return (m, i) => (u(), h("section", dd, [
      i[51] || (i[51] = d("h4", { class: "work-process-group" }, "Who moves the item on", -1)),
      p(r(Ja), {
        class: "work-process-kinds",
        "model-value": e.state.kind ?? "human",
        options: s.map((o) => ({
          ...o,
          label: r(Il)(o.value),
          disabled: !e.advanced && o.value !== "human" && o.value !== e.state.kind
        })),
        optionLabel: "label",
        optionValue: "value",
        optionDisabled: "disabled",
        "allow-empty": !1,
        "aria-label": "Who moves the item on",
        "onUpdate:modelValue": c
      }, {
        option: L(({ option: o }) => [
          d("span", ud, [
            p(r(J), {
              icon: "tabler:" + o.icon
            }, null, 8, ["icon"]),
            d("span", null, D(o.label), 1)
          ])
        ]),
        _: 1
      }, 8, ["model-value", "options"]),
      e.advanced ? (u(), h(q, { key: 0 }, [
        e.state.kind === "gate" && e.state.release_when ? (u(), h(q, { key: 0 }, [
          i[31] || (i[31] = d("h4", { class: "work-process-group" }, "Approval", -1)),
          e.state.release_when.approvals ? (u(), B(rd, {
            key: 0,
            "board-id": e.boardId,
            approvals: e.state.release_when.approvals,
            onValidity: i[0] || (i[0] = (o) => a("validity", "approvers", o))
          }, null, 8, ["board-id", "approvals"])) : I("", !0),
          d("details", cd, [
            i[30] || (i[30] = d("summary", null, "Release options", -1)),
            d("div", md, [
              d("label", vd, [
                i[29] || (i[29] = d("span", { class: "work-spacer" }, "Require approvals", -1)),
                p(r(Ne), {
                  "model-value": !!e.state.release_when.approvals,
                  "aria-label": "Require approvals",
                  "onUpdate:modelValue": i[1] || (i[1] = (o) => e.state.release_when.approvals = o ? { min: 1, from: { group: "" }, prevent_self: !0 } : void 0)
                }, null, 8, ["model-value"])
              ]),
              p($t, {
                modelValue: e.state.release_when.wait,
                "onUpdate:modelValue": i[2] || (i[2] = (o) => e.state.release_when.wait = o),
                label: "Wait before release",
                onValidity: i[3] || (i[3] = (o, f) => a("validity", f, o))
              }, null, 8, ["modelValue"]),
              p(Za, {
                label: "Release when",
                draft: e.draft,
                "board-id": e.boardId,
                modelValue: e.state.release_when.when,
                "onUpdate:modelValue": i[4] || (i[4] = (o) => e.state.release_when.when = o),
                onValidity: i[5] || (i[5] = (o) => a("validity", "release", o))
              }, null, 8, ["draft", "board-id", "modelValue"])
            ])
          ])
        ], 64)) : I("", !0),
        e.state.kind === "automated" && e.state.run ? (u(), h(q, { key: 1 }, [
          i[38] || (i[38] = d("h4", { class: "work-process-group" }, "Automation", -1)),
          d("label", fd, [
            i[32] || (i[32] = M("What runs", -1)),
            p(r(de), {
              modelValue: e.state.run.stage,
              "onUpdate:modelValue": i[6] || (i[6] = (o) => e.state.run.stage = o),
              "aria-label": "Stage",
              required: ""
            }, null, 8, ["modelValue"])
          ]),
          p($t, {
            modelValue: e.state.run.timeout,
            "onUpdate:modelValue": i[7] || (i[7] = (o) => e.state.run.timeout = o),
            label: "Attempt timeout",
            onValidity: i[8] || (i[8] = (o, f) => a("validity", f, o))
          }, null, 8, ["modelValue"]),
          i[39] || (i[39] = d("small", { class: "work-muted" }, "Blank uses the board timeout, or one hour.", -1)),
          d("label", pd, [
            i[33] || (i[33] = d("span", { class: "work-spacer" }, "Maximum visits", -1)),
            p(r(He), {
              "model-value": e.state.run.max_visits ?? null,
              "aria-label": "Maximum visits",
              min: 1,
              useGrouping: !1,
              placeholder: "Board default",
              "onUpdate:modelValue": i[9] || (i[9] = (o) => e.state.run.max_visits = o ?? void 0)
            }, null, 8, ["model-value"])
          ]),
          d("label", bd, [
            i[34] || (i[34] = M("When visits are exhausted", -1)),
            p(r(le), {
              "model-value": e.state.run.on_exhausted,
              "aria-label": "When visits are exhausted",
              appendTo: "self",
              optionLabel: "label",
              optionValue: "value",
              showClear: "",
              options: (e.process.transitions ?? []).filter((o) => !o.auto).map((o) => ({ label: r(je)(o), value: o.id })),
              "onUpdate:modelValue": i[10] || (i[10] = (o) => e.state.run.on_exhausted = o || void 0)
            }, null, 8, ["model-value", "options"])
          ]),
          i[40] || (i[40] = d("small", { class: "work-muted" }, "Blank records a failed run and stops automation. A route must leave every incoming state or be global.", -1)),
          d("label", hd, [
            i[35] || (i[35] = d("span", { class: "work-spacer" }, "Retry if it fails", -1)),
            p(r(Ne), {
              "model-value": !!e.state.run.retry,
              "aria-label": "Retry if it fails",
              "onUpdate:modelValue": i[11] || (i[11] = (o) => e.state.run.retry = o ? { max: 1, backoff: "PT1M" } : void 0)
            }, null, 8, ["model-value"])
          ]),
          e.state.run.retry ? (u(), h(q, { key: 0 }, [
            d("label", yd, [
              i[36] || (i[36] = d("span", { class: "work-spacer" }, "Maximum attempts", -1)),
              p(r(He), {
                modelValue: e.state.run.retry.max,
                "onUpdate:modelValue": i[12] || (i[12] = (o) => e.state.run.retry.max = o),
                min: 1,
                useGrouping: !1
              }, null, 8, ["modelValue"])
            ]),
            p($t, {
              modelValue: e.state.run.retry.backoff,
              "onUpdate:modelValue": i[13] || (i[13] = (o) => e.state.run.retry.backoff = o),
              label: "Wait between attempts",
              onValidity: i[14] || (i[14] = (o, f) => a("validity", f, o))
            }, null, 8, ["modelValue"])
          ], 64)) : I("", !0),
          (u(), h(q, null, ae([{ key: "on_pass", label: "On success" }, { key: "on_cancel", label: "On cancellation" }], (o) => d("label", {
            key: o.key,
            class: "work-stack work-tight"
          }, [
            M(D(o.label), 1),
            p(r(le), {
              "model-value": e.state.run[o.key],
              "aria-label": o.label,
              appendTo: "self",
              optionLabel: "label",
              optionValue: "value",
              showClear: "",
              options: n.value.map((f) => ({ label: r(je)(f), value: f.id })),
              "onUpdate:modelValue": (f) => e.state.run[o.key] = f || void 0
            }, null, 8, ["model-value", "aria-label", "options", "onUpdate:modelValue"])
          ])), 64)),
          d("label", gd, [
            i[37] || (i[37] = M("If it fails, go to", -1)),
            p(r(le), {
              "model-value": e.state.run.on_fail,
              "onUpdate:modelValue": v,
              appendTo: "self",
              optionLabel: "label",
              optionValue: "value",
              showClear: "",
              options: n.value.map((o) => ({
                label: r(je)(o) + " → " + r(be)(e.process.states.find((f) => f.id === o.to)),
                value: o.id
              }))
            }, null, 8, ["model-value", "options"])
          ])
        ], 64)) : I("", !0),
        e.state.kind === "parallel" && e.state.regions ? (u(), h(q, { key: 2 }, [
          i[45] || (i[45] = d("h4", { class: "work-process-group" }, "Lanes", -1)),
          (u(!0), h(q, null, ae(e.state.regions, (o, f) => (u(), h("div", {
            key: f,
            class: "work-process-value work-stack work-tight"
          }, [
            d("div", kd, [
              d("span", null, "Lane " + D(f + 1), 1),
              i[41] || (i[41] = d("span", { class: "work-spacer" }, null, -1)),
              p(r(X), {
                severity: "danger",
                text: "",
                size: "small",
                "aria-label": "Remove lane",
                onClick: (g) => e.state.regions.splice(f, 1)
              }, {
                default: L(() => [
                  p(r(J), { icon: "tabler:trash" })
                ]),
                _: 1
              }, 8, ["onClick"])
            ]),
            d("label", wd, [
              i[42] || (i[42] = M("Starts at", -1)),
              p(r(le), {
                modelValue: o.initial,
                "onUpdate:modelValue": (g) => o.initial = g,
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                options: e.process.states.filter((g) => g.id !== e.state.id).map((g) => ({ label: r(be)(g), value: g.id }))
              }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
            ])
          ]))), 128)),
          p(r(X), {
            label: "Add lane",
            severity: "secondary",
            outlined: "",
            size: "small",
            onClick: i[15] || (i[15] = (o) => e.state.regions.push({
              id: r(wt)("region", e.state.regions),
              initial: e.process.states.find((f) => f.id !== e.state.id)?.id ?? ""
            }))
          }, {
            icon: L(() => [
              p(r(J), { icon: "tabler:plus" })
            ]),
            _: 1
          }),
          d("label", Vd, [
            i[43] || (i[43] = M("Finish rule", -1)),
            p(r(le), {
              "model-value": typeof e.state.join == "number" ? "count" : e.state.join ?? "all",
              appendTo: "self",
              options: [
                { label: "All must pass", value: "all" },
                { label: "Any may pass", value: "any" },
                { label: "A number must pass", value: "count" }
              ],
              optionLabel: "label",
              optionValue: "value",
              "onUpdate:modelValue": i[16] || (i[16] = (o) => e.state.join = o === "count" ? 1 : o)
            }, null, 8, ["model-value"])
          ]),
          typeof e.state.join == "number" ? (u(), h("label", $d, [
            i[44] || (i[44] = d("span", { class: "work-spacer" }, "Lanes needed", -1)),
            p(r(He), {
              modelValue: e.state.join,
              "onUpdate:modelValue": i[17] || (i[17] = (o) => e.state.join = o),
              min: 1,
              max: e.state.regions.length,
              useGrouping: !1
            }, null, 8, ["modelValue", "max"])
          ])) : I("", !0)
        ], 64)) : I("", !0)
      ], 64)) : e.state.kind && e.state.kind !== "human" ? (u(), h("p", xd, " Enable Advanced to edit this state's execution settings. ")) : I("", !0),
      i[52] || (i[52] = d("h4", { class: "work-process-group" }, "Limit", -1)),
      d("label", Sd, [
        i[46] || (i[46] = d("span", { class: "work-spacer" }, "Items allowed here", -1)),
        p(ka, {
          draft: e.draft,
          state: e.state.id,
          label: "Items allowed here"
        }, null, 8, ["draft", "state"])
      ]),
      d("label", Cd, [
        i[47] || (i[47] = d("span", { class: "work-spacer" }, [
          M("Refuse moves over the limit"),
          d("small", { class: "work-muted work-block" }, "Off only warns")
        ], -1)),
        p(ka, {
          draft: e.draft,
          state: e.state.id,
          label: "Refuse moves over the limit",
          hard: ""
        }, null, 8, ["draft", "state"])
      ]),
      i[53] || (i[53] = d("h4", { class: "work-process-group" }, "Before leaving", -1)),
      p(zt, {
        label: "Required fields",
        options: e.draft.fields?.map((o) => ({ value: o.code, label: o.title || o.code })) ?? [],
        modelValue: e.state.require,
        "onUpdate:modelValue": i[18] || (i[18] = (o) => e.state.require = o)
      }, null, 8, ["options", "modelValue"]),
      !e.state.kind || e.state.kind === "human" ? (u(), B($t, {
        key: 2,
        modelValue: e.state.due,
        "onUpdate:modelValue": i[19] || (i[19] = (o) => e.state.due = o),
        label: "Due after",
        onValidity: i[20] || (i[20] = (o, f) => a("validity", f, o))
      }, null, 8, ["modelValue"])) : I("", !0),
      e.advanced ? (u(), h(q, { key: 3 }, [
        i[50] || (i[50] = d("h4", { class: "work-process-group" }, "Assignment and conditions", -1)),
        d("label", Ed, [
          i[48] || (i[48] = M("Stage label", -1)),
          p(r(de), {
            "model-value": e.state.stage,
            "aria-label": "Stage label",
            "onUpdate:modelValue": i[21] || (i[21] = (o) => e.state.stage = o || void 0)
          }, null, 8, ["model-value"])
        ]),
        !e.state.kind || e.state.kind === "human" || e.state.kind === "parallel" ? (u(), h(q, { key: 0 }, [
          d("label", Td, [
            p(r(Ne), {
              "model-value": !!e.state.awaiting,
              "aria-label": "Awaiting people",
              "onUpdate:modelValue": i[22] || (i[22] = (o) => e.state.awaiting = o ? { group: "" } : void 0)
            }, null, 8, ["model-value"]),
            i[49] || (i[49] = M("Awaiting people", -1))
          ]),
          e.state.awaiting ? (u(), B(Xr, {
            key: 0,
            modelValue: e.state.awaiting,
            "onUpdate:modelValue": i[23] || (i[23] = (o) => e.state.awaiting = o),
            draft: e.draft,
            "board-id": e.boardId,
            label: "Awaiting",
            onValidity: i[24] || (i[24] = (o) => a("validity", "awaiting", o))
          }, null, 8, ["modelValue", "draft", "board-id"])) : I("", !0)
        ], 64)) : I("", !0),
        p(Qa, {
          "board-id": e.boardId,
          modelValue: e.state.assign,
          "onUpdate:modelValue": i[25] || (i[25] = (o) => e.state.assign = o),
          label: "Assign to"
        }, null, 8, ["board-id", "modelValue"]),
        p(at, {
          label: "State checks",
          example: ["installed-check"],
          "model-value": e.state.invariants,
          shape: "array",
          "onUpdate:modelValue": i[26] || (i[26] = (o) => e.state.invariants = o),
          onValidity: i[27] || (i[27] = (o) => a("validity", "invariants", o))
        }, null, 8, ["model-value"]),
        p(Gr, {
          state: e.state,
          draft: e.draft,
          onValidity: i[28] || (i[28] = (o, f) => a("validity", "timer-" + o, f))
        }, null, 8, ["state", "draft"])
      ], 64)) : I("", !0)
    ]));
  }
}), Dd = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, Id = {
  class: "work-process-controls",
  role: "toolbar",
  "aria-label": "Process tools"
}, Ad = {
  key: 1,
  class: "work-process-title"
}, Pd = { class: "work-muted" }, Od = {
  key: 2,
  class: "work-map-zoom",
  role: "group",
  "aria-label": "Map zoom"
}, Rd = ["aria-label"], Nd = { class: "work-row" }, Md = { class: "work-process-meaning" }, Ld = { class: "work-stack work-tight" }, zd = { class: "work-process-inspector-foot" }, Bd = { class: "work-row" }, Fd = { class: "work-process-meaning" }, jd = { class: "work-stack work-tight" }, qd = { class: "work-process-inspector-foot" }, Wd = {
  key: 3,
  class: "work-row"
}, Gd = { class: "work-stack work-tight" }, Yd = { class: "work-dialog-actions" }, Kd = /* @__PURE__ */ ce({
  __name: "ProcessEditor",
  props: {
    draft: {},
    advanced: { type: Boolean },
    guardRemoval: { type: Function },
    issues: {},
    boardId: {}
  },
  emits: ["validity"],
  setup(e, { emit: l }) {
    const t = e, a = l, n = W(() => t.draft.processes ?? []), s = z(!1), c = z(""), v = z(""), m = z(""), i = z("Map"), o = z(""), f = z(), g = z(), y = z(), w = z(), U = z(!1);
    async function R() {
      U.value = !0, await uo(), w.value?.querySelector('[aria-label="State name"]')?.focus();
    }
    const S = W(() => n.value.find((x) => x.id === v.value) ?? n.value[0]);
    function T() {
      U.value = !1, f.value = void 0, g.value = void 0, m.value = "";
    }
    function E(x) {
      U.value = !1, f.value = x, g.value = void 0, o.value = "", m.value = "";
    }
    function C(x) {
      U.value = !1, g.value = x, f.value = void 0, m.value = "";
    }
    Ee(S, T);
    function $(x) {
      x === "__new" ? s.value = !0 : v.value = x;
    }
    function O() {
      const x = c.value.trim();
      if (!x) return;
      const A = x.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "") || "process", N = (/^[a-z]/.test(A) ? A : "process_" + A).slice(0, 40), Y = n.value.some((se) => se.id === N) ? wt(N, n.value) : N;
      (t.draft.processes ??= []).push({ id: Y, name: x, initial: "todo", states: [{ id: "todo", name: "To do", category: "unstarted" }], transitions: [] }), v.value = Y, c.value = "", s.value = !1;
    }
    async function Z(x) {
      const A = { id: wt("state", x.states), name: "New state", category: "started" }, N = Ba(x), Y = N.at(-1), se = f.value ?? (Y?.category === "completed" ? N.at(-2) : Y), ge = se && (x.transitions?.find((pe) => pe.default && pe.from !== "any" && pe.from.includes(se.id)) ?? x.transitions?.find((pe) => pe.from !== "any" && pe.from.includes(se.id) && x.states.findIndex((Me) => Me.id === pe.to) > x.states.indexOf(se)));
      if (x.states.splice(se ? x.states.indexOf(se) + 1 : x.states.length, 0, A), se && se.category !== "completed" && se.category !== "canceled")
        if (ge) {
          const pe = ge.to;
          ge.to = A.id, (x.transitions ??= []).push({ id: wt("transition", x.transitions ?? []), name: "Continue", from: [A.id], to: pe, ...ge.auto && ge.default ? { auto: !0, default: !0 } : {} });
        } else (x.transitions ??= []).push({ id: wt("transition", x.transitions ?? []), name: "Continue", from: [se.id], to: A.id });
      E(A), await R();
    }
    function ue(x, A) {
      const N = S.value;
      if (!N || !A || x === A) return;
      let Y = `to_${A}`, se = 2;
      for (; N.transitions?.some((pe) => pe.id === Y); ) Y = `to_${A}_${se++}`;
      const ge = { id: Y, name: `To ${be(N.states.find((pe) => pe.id === A)).toLowerCase()}`, from: [x], to: A };
      (N.transitions ??= []).push(ge), C(ge);
    }
    function _(x) {
      const A = { id: wt("transition", x.transitions ?? []), name: "To " + be(x.states.at(-1)), from: [x.initial], to: x.states.at(-1)?.id ?? x.initial };
      (x.transitions ??= []).push(A), C(A);
    }
    function H(x, A) {
      const N = go(x, A);
      if (N.length) {
        m.value = `Used by ${N.join(", ")}. Update those references first.`;
        return;
      }
      x.transitions?.splice(x.transitions.indexOf(A), 1), T();
    }
    function P(x, A) {
      const N = ko(x, A);
      if (N.length) {
        m.value = `${be(A)} is used by ${N.join(", ")}. Update these references first.`;
        return;
      }
      x.states.splice(x.states.indexOf(A), 1), T();
    }
    async function ee(x) {
      const A = t.draft.item_types?.filter((Y) => Y.process === x.id).map((Y) => Y.title || "Untitled item type") ?? [];
      if (A.length) {
        m.value = `Used by ${A.join(", ")}. Choose a different process for those item types first.`;
        return;
      }
      const N = await t.guardRemoval?.("processes", x.id);
      if (N) {
        m.value = N;
        return;
      }
      ta(t.draft, "processes", x.id), v.value = "", T();
    }
    return (x, A) => (u(), h("section", {
      class: "work-process-editor work-stack",
      "aria-label": "Process editor",
      onKeydown: Ae(T, ["esc"])
    }, [
      m.value ? (u(), h("p", Dd, D(m.value), 1)) : I("", !0),
      (u(!0), h(q, null, ae(e.issues?.filter((N) => N.code === "process " + S.value?.id) ?? [], (N) => (u(), h("p", {
        key: N.what + N.detail,
        class: "work-error work-small",
        role: "alert"
      }, D(r(Va)(N)) + " · " + D(N.what), 1))), 128)),
      S.value ? (u(), h("div", {
        key: 1,
        class: ct(["work-process-builder", { "work-process-inspecting": f.value || g.value }])
      }, [
        d("div", Id, [
          n.value.length > 1 ? (u(), B(r(le), {
            key: 0,
            "model-value": S.value.id,
            "aria-label": "Process",
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            options: [
              ...n.value.map((N) => ({ label: N.name || "Untitled process", value: N.id })),
              { label: "New process…", value: "__new" }
            ],
            "onUpdate:modelValue": $
          }, null, 8, ["model-value", "options"])) : (u(), h("span", Ad, D(S.value.name || "Process"), 1)),
          p(r(X), {
            label: "Add state",
            severity: "secondary",
            outlined: "",
            size: "small",
            onClick: A[0] || (A[0] = (N) => Z(S.value))
          }, {
            icon: L(() => [
              p(r(J), { icon: "tabler:plus" })
            ]),
            _: 1
          }),
          p(r(le), {
            modelValue: S.value.initial,
            "onUpdate:modelValue": A[1] || (A[1] = (N) => S.value.initial = N),
            "aria-label": "Starts in " + r(be)(S.value.states.find((N) => N.id === S.value.initial)),
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            options: S.value.states.map((N) => ({ label: r(be)(N), value: N.id }))
          }, {
            value: L(() => [
              d("span", Pd, "Starts in " + D(r(be)(S.value.states.find((N) => N.id === S.value.initial))), 1)
            ]),
            _: 1
          }, 8, ["modelValue", "aria-label", "options"]),
          A[17] || (A[17] = d("span", { class: "work-spacer" }, null, -1)),
          i.value === "Map" ? (u(), h("div", Od, [
            p(r(X), {
              label: "Fit",
              title: "Fit to width and show the full process",
              text: "",
              severity: "secondary",
              size: "small",
              onClick: A[2] || (A[2] = (N) => y.value?.fit())
            }, {
              icon: L(() => [
                p(r(J), { icon: "tabler:arrows-maximize" })
              ]),
              _: 1
            }),
            i.value === "Map" ? (u(), B(r(X), {
              key: 0,
              "aria-label": "Zoom out",
              title: "Zoom out",
              text: "",
              severity: "secondary",
              size: "small",
              onClick: A[3] || (A[3] = (N) => y.value?.zoomOut())
            }, {
              default: L(() => [
                p(r(J), { icon: "tabler:minus" })
              ]),
              _: 1
            })) : I("", !0),
            i.value === "Map" ? (u(), B(r(X), {
              key: 1,
              "aria-label": "Zoom in",
              title: "Zoom in",
              text: "",
              severity: "secondary",
              size: "small",
              onClick: A[4] || (A[4] = (N) => y.value?.zoomIn())
            }, {
              default: L(() => [
                p(r(J), { icon: "tabler:plus" })
              ]),
              _: 1
            })) : I("", !0)
          ])) : I("", !0),
          p(r(Ja), {
            modelValue: i.value,
            "onUpdate:modelValue": A[5] || (A[5] = (N) => i.value = N),
            options: ["Map", "List"],
            "allow-empty": !1,
            "aria-label": "Process layout"
          }, null, 8, ["modelValue"]),
          n.value.length === 1 ? (u(), B(r(X), {
            key: 3,
            label: "New process",
            "aria-label": "New process",
            text: "",
            severity: "secondary",
            size: "small",
            onClick: A[6] || (A[6] = (N) => s.value = !0)
          }, {
            icon: L(() => [
              p(r(J), { icon: "tabler:plus" })
            ]),
            _: 1
          })) : I("", !0)
        ]),
        i.value === "Map" ? (u(), B(dr, {
          key: 0,
          ref_key: "graph",
          ref: y,
          process: S.value,
          draft: e.draft,
          "selected-state": f.value,
          "selected-transition": g.value,
          onState: E,
          onTransition: C,
          onConnect: ue,
          onClear: T
        }, null, 8, ["process", "draft", "selected-state", "selected-transition"])) : (u(), B(kr, {
          key: 1,
          process: S.value,
          "selected-state": f.value,
          "selected-transition": g.value,
          onState: E,
          onTransition: C,
          onRemoveState: A[7] || (A[7] = (N) => P(S.value, N)),
          onRemoveTransition: A[8] || (A[8] = (N) => H(S.value, N)),
          onAddTransition: A[9] || (A[9] = (N) => _(S.value))
        }, null, 8, ["process", "selected-state", "selected-transition"])),
        f.value || g.value ? (u(), h("aside", {
          key: 2,
          ref_key: "inspector",
          ref: w,
          class: "work-process-sideform",
          "aria-label": f.value ? "State inspector" : "Transition inspector"
        }, [
          (u(!0), h(q, null, ae(f.value ? [f.value] : [], (N) => (u(), h(q, {
            key: N.id
          }, [
            d("header", Nd, [
              U.value ? (u(), B(r(de), {
                key: 1,
                modelValue: N.name,
                "onUpdate:modelValue": (Y) => N.name = Y,
                class: "work-process-name",
                "aria-label": "State name",
                onBlur: A[10] || (A[10] = (Y) => U.value = !1)
              }, null, 8, ["modelValue", "onUpdate:modelValue"])) : (u(), B(Ha, {
                key: 0,
                class: "work-process-state-title",
                "aria-label": "Rename state",
                onActivate: R
              }, {
                default: L(() => [
                  d("span", null, D(r(be)(N)), 1)
                ]),
                _: 2
              }, 1024)),
              p(r(X), {
                severity: "secondary",
                text: "",
                size: "small",
                "aria-label": "Close state editor",
                onClick: T
              }, {
                default: L(() => [
                  p(r(J), { icon: "tabler:x" })
                ]),
                _: 1
              })
            ]),
            d("p", Md, D(r(ho)(N, e.draft)), 1),
            p(Ud, {
              state: N,
              process: S.value,
              draft: e.draft,
              advanced: e.advanced,
              "board-id": e.boardId,
              onValidity: (Y, se) => a("validity", Y.includes("duration:") ? Y : S.value.id + ":" + N.id + ":" + Y, se)
            }, null, 8, ["state", "process", "draft", "advanced", "board-id", "onValidity"]),
            d("label", Ld, [
              A[18] || (A[18] = M("Phase", -1)),
              p(r(le), {
                modelValue: N.category,
                "onUpdate:modelValue": (Y) => N.category = Y,
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                options: ["triage", "backlog", ...r(Ul)].map((Y) => ({ label: r(Xa)(Y), value: Y }))
              }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
            ]),
            A[19] || (A[19] = d("h4", { class: "work-process-group" }, "Next stop", -1)),
            p(r(le), {
              modelValue: o.value,
              "onUpdate:modelValue": A[11] || (A[11] = (Y) => o.value = Y),
              "aria-label": "Add transition to…",
              placeholder: "Add transition to…",
              appendTo: "self",
              optionLabel: "label",
              optionValue: "value",
              options: S.value.states.filter((Y) => Y !== N).map((Y) => ({ label: r(be)(Y), value: Y.id }))
            }, null, 8, ["modelValue", "options"]),
            p(r(X), {
              label: "Add transition",
              severity: "secondary",
              outlined: "",
              size: "small",
              disabled: !o.value,
              onClick: (Y) => ue(N.id, o.value)
            }, {
              icon: L(() => [
                p(r(J), { icon: "tabler:arrow-right" })
              ]),
              _: 1
            }, 8, ["disabled", "onClick"]),
            d("footer", zd, [
              p(r(X), {
                label: "Remove state",
                severity: "danger",
                text: "",
                size: "small",
                onClick: (Y) => P(S.value, N)
              }, {
                icon: L(() => [
                  p(r(J), { icon: "tabler:trash" })
                ]),
                _: 1
              }, 8, ["onClick"])
            ])
          ], 64))), 128)),
          (u(!0), h(q, null, ae(g.value ? [g.value] : [], (N) => (u(), h(q, {
            key: N.id
          }, [
            d("header", Bd, [
              A[20] || (A[20] = d("h3", null, "Transition", -1)),
              A[21] || (A[21] = d("span", { class: "work-spacer" }, null, -1)),
              p(r(X), {
                severity: "secondary",
                text: "",
                size: "small",
                "aria-label": "Close transition editor",
                onClick: T
              }, {
                default: L(() => [
                  p(r(J), { icon: "tabler:x" })
                ]),
                _: 1
              })
            ]),
            d("p", Fd, D(N.from === "any" ? "Any state" : N.from.map((Y) => r(be)(S.value.states.find((se) => se.id === Y))).join(", ")) + " → " + D(r(be)(S.value.states.find((Y) => Y.id === N.to))), 1),
            d("label", jd, [
              A[22] || (A[22] = M("Name", -1)),
              p(r(de), {
                modelValue: N.name,
                "onUpdate:modelValue": (Y) => N.name = Y,
                placeholder: r(je)(N),
                "aria-label": "Transition name"
              }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder"])
            ]),
            p(Dr, {
              transition: N,
              process: S.value,
              draft: e.draft,
              advanced: e.advanced,
              "board-id": e.boardId,
              onValidity: (Y, se) => a("validity", S.value.id + ":transition-" + N.id + ":" + Y, se)
            }, null, 8, ["transition", "process", "draft", "advanced", "board-id", "onValidity"]),
            d("footer", qd, [
              p(r(X), {
                label: "Remove transition",
                severity: "danger",
                text: "",
                size: "small",
                onClick: (Y) => H(S.value, N)
              }, {
                icon: L(() => [
                  p(r(J), { icon: "tabler:trash" })
                ]),
                _: 1
              }, 8, ["onClick"])
            ])
          ], 64))), 128))
        ], 8, Rd)) : I("", !0)
      ], 2)) : (u(), B(r(X), {
        key: 2,
        label: "New process",
        severity: "secondary",
        outlined: "",
        onClick: A[12] || (A[12] = (N) => s.value = !0)
      }, {
        icon: L(() => [
          p(r(J), { icon: "tabler:plus" })
        ]),
        _: 1
      })),
      i.value === "List" && S.value ? (u(), h("div", Wd, [
        p(r(X), {
          label: "Remove process",
          severity: "danger",
          text: "",
          size: "small",
          onClick: A[13] || (A[13] = (N) => ee(S.value))
        }, {
          icon: L(() => [
            p(r(J), { icon: "tabler:trash" })
          ]),
          _: 1
        })
      ])) : I("", !0),
      p(yo, {
        visible: s.value,
        label: "New process",
        onClose: A[16] || (A[16] = (N) => s.value = !1)
      }, {
        default: L(() => [
          d("form", {
            class: "work-dialog-box",
            "aria-label": "New process",
            onSubmit: he(O, ["stop", "prevent"])
          }, [
            A[24] || (A[24] = d("h2", null, "New process", -1)),
            d("label", Gd, [
              A[23] || (A[23] = M("Name", -1)),
              p(r(de), {
                modelValue: c.value,
                "onUpdate:modelValue": A[14] || (A[14] = (N) => c.value = N),
                "aria-label": "New process name",
                autofocus: "",
                required: ""
              }, null, 8, ["modelValue"])
            ]),
            d("div", Yd, [
              p(r(X), {
                label: "Cancel",
                severity: "secondary",
                outlined: "",
                onClick: A[15] || (A[15] = (N) => s.value = !1)
              }),
              p(r(X), {
                label: "Create process",
                type: "submit",
                disabled: !c.value.trim()
              }, null, 8, ["disabled"])
            ])
          ], 32)
        ]),
        _: 1
      }, 8, ["visible"])
    ], 32));
  }
}), Hd = ["inert"], Xd = { class: "work-stack work-tight" }, Jd = /* @__PURE__ */ ce({
  __name: "ProcessMigration",
  props: {
    draft: {},
    original: {},
    disabled: { type: Boolean }
  },
  setup(e) {
    const l = e;
    function t(n, s, c) {
      c ? (n.map ??= {})[s] = c : n.map && delete n.map[s];
    }
    function a(n) {
      return l.original.processes?.find((s) => s.id === n.id)?.states.filter((s) => !n.states.some((c) => c.id === s.id)) ?? [];
    }
    return (n, s) => (u(), h("section", {
      class: "work-stack work-settings-card",
      "aria-label": "Existing items",
      inert: e.disabled || void 0
    }, [
      s[0] || (s[0] = d("h3", null, "Existing items", -1)),
      s[1] || (s[1] = d("p", { class: "work-muted work-small" }, " Choose how existing items follow these changes, then review the impact before applying. ", -1)),
      (u(!0), h(q, null, ae(e.draft.processes ?? [], (c) => (u(), h("div", {
        key: c.id,
        class: "work-stack"
      }, [
        d("label", Xd, [
          M(D(c.name || "Untitled process"), 1),
          p(r(le), {
            disabled: e.disabled,
            "model-value": r(nl)(c),
            "aria-label": "Existing items in " + (c.name || "this process"),
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            options: [
              { label: "Follow new process", value: "follow" },
              { label: "Keep current process", value: "pin" }
            ],
            "onUpdate:modelValue": (v) => c.migration = v
          }, null, 8, ["disabled", "model-value", "aria-label", "onUpdate:modelValue"])
        ]),
        r(nl)(c) !== "pin" ? (u(!0), h(q, { key: 0 }, ae(a(c), (v) => (u(), h("label", {
          key: v.id,
          class: "work-stack work-tight"
        }, [
          M("Move items from " + D(r(be)(v)) + " to", 1),
          p(r(le), {
            disabled: e.disabled,
            "model-value": c.map?.[v.id],
            placeholder: "Choose a surviving state",
            appendTo: "self",
            showClear: "",
            optionLabel: "label",
            optionValue: "value",
            options: c.states.map((m) => ({ label: r(be)(m), value: m.id })),
            "onUpdate:modelValue": (m) => t(c, v.id, m)
          }, null, 8, ["disabled", "model-value", "options", "onUpdate:modelValue"])
        ]))), 128)) : I("", !0)
      ]))), 128))
    ], 8, Hd));
  }
});
function Zl(e) {
  return Object.entries(Ge(e.properties)).map(([l, t]) => {
    const a = Ge(t);
    return { key: l, title: typeof a.title == "string" && a.title.trim() ? a.title : ye(l), description: typeof a.description == "string" ? a.description : "", schema: a };
  });
}
const Ql = (e) => e.type === "array" && Ge(e.items).type === "string";
function Zd(e, l) {
  const t = {};
  for (const a of Zl(e)) {
    const n = l[a.key] ?? a.schema.default, s = a.schema;
    let c = "";
    if (n == null)
      Array.isArray(e.required) && e.required.includes(a.key) && (c = "A value is required.");
    else if (Array.isArray(s.enum) && !s.enum.includes(n)) c = "Choose one of the available values.";
    else if (s.type === "integer" || s.type === "number")
      typeof n != "number" || !Number.isFinite(n) || s.type === "integer" && !Number.isInteger(n) ? c = s.type === "integer" ? "Enter a whole number." : "Enter a number." : typeof s.minimum == "number" && n < s.minimum ? c = `Enter at least ${s.minimum}.` : typeof s.maximum == "number" && n > s.maximum && (c = `Enter at most ${s.maximum}.`);
    else if (s.type === "boolean" && typeof n != "boolean") c = "Choose on or off.";
    else if (s.type === "string") {
      if (typeof n != "string") c = "Enter text.";
      else if (typeof s.minLength == "number" && n.length < s.minLength) c = `Enter at least ${s.minLength} characters.`;
      else if (typeof s.maxLength == "number" && n.length > s.maxLength) c = `Enter at most ${s.maxLength} characters.`;
      else if (typeof s.pattern == "string")
        try {
          new RegExp(s.pattern).test(n) || (c = "Use the required format.");
        } catch {
          c = "The declared format is unavailable.";
        }
    } else if (s.type === "array") {
      if (!Array.isArray(n)) c = "Enter a list.";
      else if (typeof s.maxItems == "number" && n.length > s.maxItems) c = `Use at most ${s.maxItems} entries.`;
      else if (typeof s.minItems == "number" && n.length < s.minItems) c = `Use at least ${s.minItems} entries.`;
      else if (s.uniqueItems && new Set(n).size !== n.length) c = "Remove duplicate entries.";
      else if (Ql(s)) {
        const v = Ge(s.items);
        n.some((m) => typeof m != "string" || typeof v.minLength == "number" && m.length < v.minLength || typeof v.maxLength == "number" && m.length > v.maxLength) && (c = "Each entry must match the declared text length.");
      }
    } else s.type === "object" && (typeof n != "object" || Array.isArray(n)) && (c = "Enter an object.");
    c && (t[a.key] = c);
  }
  return t;
}
const Qd = { class: "work-stack" }, _d = ["schema", "config"], eu = {
  key: 1,
  role: "status",
  class: "work-muted work-small"
}, tu = {
  key: 2,
  role: "alert",
  class: "kx-err"
}, au = { class: "work-config-fields" }, lu = ["for"], ou = {
  key: 1,
  class: "work-config-chips"
}, iu = {
  key: 6,
  class: "work-muted work-small"
}, nu = {
  key: 7,
  role: "alert",
  class: "work-error work-small"
}, _l = /* @__PURE__ */ ce({
  __name: "ConfigForm",
  props: {
    schema: {},
    modelValue: {},
    disabled: { type: Boolean }
  },
  emits: ["update:modelValue", "validity"],
  setup(e, { emit: l }) {
    const t = e, a = l, n = z({}), s = z(/* @__PURE__ */ new Set()), c = z(!1), v = z(!1), m = W(() => Zl(t.schema)), i = W(() => Zd(t.schema, t.modelValue)), o = W(() => m.value.filter((C) => typeof C.schema.picker == "string")), f = W(() => m.value.filter((C) => typeof C.schema.picker != "string")), g = W(() => ({ ...t.schema, properties: Object.fromEntries(o.value.map((C) => [C.key, { ...C.schema, title: C.title }])), required: Array.isArray(t.schema.required) ? t.schema.required.filter((C) => o.value.some(($) => $.key === C)) : [] })), y = W(() => Object.fromEntries(o.value.map((C) => [C.key, t.modelValue[C.key]])));
    Ee([i, s, () => o.value.length > 0 && !c.value], () => a("validity", !Object.keys(i.value).length && !s.value.size && (!o.value.length || c.value)), { immediate: !0, deep: !0 });
    async function w() {
      v.value = !0, c.value = await Nt("wc-schema-form"), v.value = !1;
    }
    Ee(() => o.value.length > 0, (C) => {
      C && w();
    }, { immediate: !0 }), mt(() => a("validity", !0));
    function U(C, $) {
      const O = { ...t.modelValue };
      $ == null ? delete O[C] : O[C] = $, a("update:modelValue", O);
    }
    function R(C) {
      const $ = t.modelValue[C];
      return Array.isArray($) ? $.filter((O) => typeof O == "string") : [];
    }
    function S(C) {
      const $ = n.value[C]?.trim();
      $ && (U(C, [...R(C), $]), n.value[C] = "");
    }
    function T(C, $) {
      $ ? s.value.delete(C) : s.value.add(C);
    }
    function E(C) {
      a("update:modelValue", { ...t.modelValue, ...Ge(C.detail) });
    }
    return (C, $) => (u(), h("div", Qd, [
      o.value.length && c.value ? (u(), h("wc-schema-form", {
        key: 0,
        class: "work-config-widget",
        schema: JSON.stringify(g.value),
        config: JSON.stringify(y.value),
        onConfigChanged: E
      }, null, 40, _d)) : o.value.length && v.value ? (u(), h("p", eu, "The configuration widget is loading.")) : o.value.length ? (u(), h("p", tu, [
        $[0] || ($[0] = M("The configuration widget is unavailable.", -1)),
        p(r(X), {
          label: "Reload configuration widget",
          severity: "secondary",
          outlined: "",
          onClick: w
        })
      ])) : I("", !0),
      d("div", au, [
        (u(!0), h(q, null, ae(f.value, (O) => (u(), h("div", {
          key: O.key,
          class: "work-config-field"
        }, [
          d("label", {
            class: "work-config-label",
            for: "config-" + O.key
          }, D(O.title), 9, lu),
          Array.isArray(O.schema.enum) ? (u(), B(r(le), {
            key: 0,
            "input-id": "config-" + O.key,
            "model-value": e.modelValue[O.key] ?? O.schema.default,
            options: O.schema.enum,
            appendTo: "self",
            "aria-label": O.title,
            disabled: e.disabled,
            "onUpdate:modelValue": (Z) => U(O.key, Z)
          }, null, 8, ["input-id", "model-value", "options", "aria-label", "disabled", "onUpdate:modelValue"])) : r(Ql)(O.schema) ? (u(), h("div", ou, [
            (u(!0), h(q, null, ae(R(O.key), (Z, ue) => (u(), B(r(Po), {
              key: ue,
              label: Z,
              removable: !e.disabled,
              onRemove: (_) => U(O.key, R(O.key).filter((H, P) => P !== ue))
            }, null, 8, ["label", "removable", "onRemove"]))), 128)),
            p(r(de), {
              id: "config-" + O.key,
              modelValue: n.value[O.key],
              "onUpdate:modelValue": (Z) => n.value[O.key] = Z,
              "aria-label": "Add " + O.title.toLocaleLowerCase(),
              disabled: e.disabled,
              placeholder: "Type and press Enter",
              onKeydown: Ae(he((Z) => S(O.key), ["stop", "prevent"]), ["enter"]),
              onBlur: (Z) => S(O.key)
            }, null, 8, ["id", "modelValue", "onUpdate:modelValue", "aria-label", "disabled", "onKeydown", "onBlur"])
          ])) : ["integer", "number"].includes(String(O.schema.type)) ? (u(), B(r(He), {
            key: 2,
            "input-id": "config-" + O.key,
            "model-value": e.modelValue[O.key] ?? O.schema.default,
            "max-fraction-digits": O.schema.type === "integer" ? 0 : 8,
            "use-grouping": !1,
            "aria-label": O.title,
            disabled: e.disabled,
            invalid: !!i.value[O.key],
            "onUpdate:modelValue": (Z) => U(O.key, Z)
          }, null, 8, ["input-id", "model-value", "max-fraction-digits", "aria-label", "disabled", "invalid", "onUpdate:modelValue"])) : O.schema.type === "boolean" ? (u(), B(r(Ne), {
            key: 3,
            "input-id": "config-" + O.key,
            "model-value": !!(e.modelValue[O.key] ?? O.schema.default),
            "aria-label": O.title,
            disabled: e.disabled,
            "onUpdate:modelValue": (Z) => U(O.key, Z)
          }, null, 8, ["input-id", "model-value", "aria-label", "disabled", "onUpdate:modelValue"])) : ["array", "object"].includes(String(O.schema.type)) ? (u(), B(at, {
            key: 4,
            label: O.title,
            "model-value": e.modelValue[O.key],
            shape: O.schema.type === "array" ? "array" : "object",
            example: O.schema.default ?? (O.schema.type === "array" ? [] : {}),
            "onUpdate:modelValue": (Z) => U(O.key, Z),
            onValidity: (Z) => T(O.key, Z)
          }, null, 8, ["label", "model-value", "shape", "example", "onUpdate:modelValue", "onValidity"])) : (u(), B(r(de), {
            key: 5,
            id: "config-" + O.key,
            "model-value": e.modelValue[O.key] ?? O.schema.default ?? "",
            disabled: e.disabled,
            invalid: !!i.value[O.key],
            "aria-label": O.title,
            "onUpdate:modelValue": (Z) => U(O.key, Z)
          }, null, 8, ["id", "model-value", "disabled", "invalid", "aria-label", "onUpdate:modelValue"])),
          O.description ? (u(), h("p", iu, D(O.description), 1)) : I("", !0),
          i.value[O.key] ? (u(), h("p", nu, D(i.value[O.key]), 1)) : I("", !0)
        ]))), 128))
      ])
    ]));
  }
}), su = {
  class: "work-stack",
  "aria-label": "Policy editor"
}, ru = { class: "work-settings-list" }, du = { class: "work-settings-row" }, uu = { class: "work-row-control" }, cu = { class: "work-settings-list work-wip-container" }, mu = { class: "work-wip-table" }, vu = { class: "work-mono" }, fu = { class: "work-row-main" }, pu = { class: "work-row" }, bu = { class: "work-settings-list" }, hu = { class: "work-settings-row" }, yu = { class: "work-row-control" }, gu = { class: "work-row-main" }, ku = { class: "work-row-title" }, wu = { class: "work-row-control" }, Vu = /* @__PURE__ */ ce({
  __name: "PolicyEditor",
  props: {
    draft: {}
  },
  emits: ["validity"],
  setup(e, { emit: l }) {
    const t = e, a = l, n = W(() => t.draft.policy ?? {}), s = W(() => [...new Set(t.draft.processes?.flatMap((i) => i.states.map((o) => o.id)) ?? [])]), c = ["audit_days", "trash_days", "tombstone_days", "interval_days"];
    function v(i, o) {
      o === void 0 ? t.draft.policy && delete t.draft.policy[i] : (t.draft.policy ??= {})[i] = o;
    }
    function m(i, o) {
      v(i, o ?? void 0);
    }
    return (i, o) => (u(), h("section", su, [
      o[12] || (o[12] = d("header", { class: "work-section-heading" }, [
        d("div", null, [
          d("h2", null, "Policy"),
          d("p", { class: "work-muted work-small" }, "Set capacity and how long the board keeps its history.")
        ])
      ], -1)),
      o[13] || (o[13] = d("h3", { class: "work-group-title" }, "Item keys", -1)),
      d("div", ru, [
        d("div", du, [
          o[6] || (o[6] = d("div", { class: "work-row-main" }, [
            d("strong", { class: "work-row-title" }, "Item key prefix"),
            d("p", { class: "work-muted work-small" }, "Work reviews and claims prefix changes when you apply the schema.")
          ], -1)),
          d("div", uu, [
            p(r(de), {
              modelValue: e.draft.key_prefix,
              "onUpdate:modelValue": o[0] || (o[0] = (f) => e.draft.key_prefix = f),
              "aria-label": "Item key prefix",
              required: "",
              pattern: "[A-Z][A-Z0-9]{1,9}",
              maxlength: "10"
            }, null, 8, ["modelValue"])
          ])
        ])
      ]),
      o[14] || (o[14] = d("h3", { class: "work-group-title" }, "Work in progress", -1)),
      o[15] || (o[15] = d("p", { class: "work-muted work-small" }, "A blank limit sets no restriction. A hard limit rejects transitions over capacity.", -1)),
      d("div", cu, [
        d("table", mu, [
          o[7] || (o[7] = d("thead", null, [
            d("tr", null, [
              d("th", null, "State"),
              d("th", null, "Limit"),
              d("th", null, "Hard limit")
            ])
          ], -1)),
          d("tbody", null, [
            (u(!0), h(q, null, ae(s.value, (f) => (u(), h("tr", { key: f }, [
              d("td", null, [
                d("strong", null, D(e.draft.processes?.flatMap((g) => g.states).find((g) => g.id === f)?.name || r(ye)(f)), 1),
                d("code", vu, D(f), 1)
              ]),
              d("td", null, [
                p(ka, {
                  draft: e.draft,
                  state: f,
                  label: f + " WIP limit"
                }, null, 8, ["draft", "state", "label"])
              ]),
              d("td", null, [
                p(ka, {
                  draft: e.draft,
                  state: f,
                  label: f + " hard WIP limit",
                  hard: ""
                }, null, 8, ["draft", "state", "label"])
              ])
            ]))), 128))
          ])
        ]),
        (u(!0), h(q, null, ae(Object.keys(n.value.wip ?? {}).filter((f) => !s.value.includes(f)), (f) => (u(), h("div", {
          key: f,
          class: "work-settings-row"
        }, [
          d("div", fu, [
            M(D(r(ye)(f)) + " ", 1),
            o[8] || (o[8] = d("span", { class: "work-muted" }, "Removed state", -1))
          ]),
          p(r(X), {
            label: "Remove stale limit",
            severity: "secondary",
            outlined: "",
            onClick: (g) => delete n.value.wip[f]
          }, {
            icon: L(() => [
              p(r(J), { icon: "tabler:trash" })
            ]),
            _: 1
          }, 8, ["onClick"])
        ]))), 128))
      ]),
      o[16] || (o[16] = d("h3", { class: "work-group-title" }, "Automated stages", -1)),
      p($t, {
        "model-value": n.value.stage_timeout,
        "onUpdate:modelValue": o[1] || (o[1] = (f) => v("stage_timeout", f)),
        label: "Default attempt timeout",
        onValidity: o[2] || (o[2] = (f, g) => a("validity", g, f))
      }, null, 8, ["model-value"]),
      o[17] || (o[17] = d("p", { class: "work-muted work-small" }, "Blank uses one hour. Each retry gets a new deadline.", -1)),
      d("label", pu, [
        o[9] || (o[9] = d("span", { class: "work-spacer" }, "Default maximum visits", -1)),
        p(r(He), {
          "model-value": n.value.stage_max_visits ?? null,
          "aria-label": "Default maximum visits",
          min: 1,
          useGrouping: !1,
          placeholder: "5",
          "onUpdate:modelValue": o[3] || (o[3] = (f) => v("stage_max_visits", f ?? void 0))
        }, null, 8, ["model-value"])
      ]),
      o[18] || (o[18] = d("h3", { class: "work-group-title" }, "Query scopes", -1)),
      o[19] || (o[19] = d("p", { class: "work-muted work-small" }, "Declare the installed scope identifiers available to board queries.", -1)),
      p(_l, {
        schema: { type: "object", properties: { scopes: { type: "array", title: "Scope identifiers", items: { type: "string" } } } },
        "model-value": { scopes: e.draft.scopes },
        "onUpdate:modelValue": o[4] || (o[4] = (f) => e.draft.scopes = f.scopes)
      }, null, 8, ["model-value"]),
      o[20] || (o[20] = d("h3", { class: "work-group-title" }, "Audit and retention", -1)),
      d("div", bu, [
        d("div", hu, [
          o[10] || (o[10] = d("div", { class: "work-row-main" }, [
            d("strong", { class: "work-row-title" }, "Audit trail"),
            d("p", { class: "work-muted work-small" }, "Choose which item changes appear in history.")
          ], -1)),
          d("div", yu, [
            p(r(le), {
              "model-value": n.value.audit ?? "",
              "aria-label": "Audit trail",
              placeholder: "Installation default",
              appendTo: "self",
              optionLabel: "label",
              optionValue: "value",
              options: [{ label: "Installation default", value: "" }, { label: "Off", value: "off" }, { label: "Fields", value: "fields" }],
              "onUpdate:modelValue": o[5] || (o[5] = (f) => v("audit", f || void 0))
            }, null, 8, ["model-value"])
          ])
        ]),
        (u(), h(q, null, ae(c, (f) => d("div", {
          key: f,
          class: "work-settings-row"
        }, [
          d("div", gu, [
            d("strong", ku, D(r(ye)(f)), 1),
            o[11] || (o[11] = d("p", { class: "work-muted work-small" }, "Blank follows the installation default. Zero keeps records indefinitely.", -1))
          ]),
          d("label", wu, [
            p(r(He), {
              min: 0,
              "aria-label": r(ye)(f),
              "model-value": n.value[f] ?? null,
              placeholder: "Installation default",
              useGrouping: !1,
              "onUpdate:modelValue": (g) => m(f, g)
            }, null, 8, ["aria-label", "model-value", "onUpdate:modelValue"])
          ])
        ])), 64))
      ])
    ]));
  }
}), $u = {
  class: "work-stack",
  "aria-label": "Relation types editor"
}, xu = { class: "work-section-heading" }, Su = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, Cu = { class: "work-definition-meta work-muted work-small" }, Eu = { class: "work-settings-grid" }, Tu = { class: "work-stack work-tight" }, Uu = { class: "work-stack work-tight" }, Du = { class: "work-stack work-tight" }, Iu = { class: "work-stack work-tight" }, Au = { class: "work-row" }, Pu = { class: "work-relation-preview work-small" }, Ou = { class: "work-muted" }, Ru = {
  key: 0,
  class: "kx-empty"
}, Nu = { class: "work-row work-add-definition" }, Mu = { class: "work-stack work-tight" }, Lu = /* @__PURE__ */ ce({
  __name: "RelationsEditor",
  props: {
    draft: {},
    guardRemoval: { type: Function }
  },
  setup(e) {
    const l = e, t = W(() => l.draft.relation_types ?? []), a = z(""), n = z(""), s = z(!1), c = W(() => /^[a-z][a-z0-9_]*$/.test(a.value) && !t.value.some((i) => i.id === a.value));
    function v() {
      c.value && ((l.draft.relation_types ??= []).push({ id: a.value, outward: ye(a.value).toLowerCase(), inward: ye(a.value).toLowerCase(), cardinality: "many" }), a.value = "");
    }
    async function m(i) {
      if (!s.value) {
        s.value = !0, n.value = "";
        try {
          const o = await l.guardRemoval?.("relation_types", i);
          o ? n.value = o : ta(l.draft, "relation_types", i);
        } finally {
          s.value = !1;
        }
      }
    }
    return (i, o) => (u(), h("section", $u, [
      d("header", xu, [
        o[1] || (o[1] = d("div", null, [
          d("h2", null, "Relation types"),
          d("p", { class: "work-muted work-small" }, "Give each direction a clear label. A used relation keeps its identity and shape.")
        ], -1)),
        p(r(Pe), {
          class: "kx-tag-sm",
          severity: "secondary"
        }, {
          default: L(() => [
            M(D(t.value.length) + " " + D(t.value.length === 1 ? "relation" : "relations"), 1)
          ]),
          _: 1
        })
      ]),
      n.value ? (u(), h("p", Su, D(n.value), 1)) : I("", !0),
      p(xa, {
        columns: "relations",
        count: t.value.length
      }, {
        default: L(() => [
          (u(!0), h(q, null, ae(t.value, (f, g) => (u(), B($a, {
            title: r(ye)(f.id),
            code: f.id,
            kind: f.symmetric ? "Symmetric" : "Directional",
            key: g,
            class: "work-stack"
          }, {
            usage: L(() => [
              d("span", Cu, D(f.outward || "Related work") + " · " + D(f.inward || "Reverse relation"), 1)
            ]),
            actions: L(() => [
              p(r(X), {
                severity: "secondary",
                text: "",
                disabled: s.value,
                onClick: (y) => m(f.id),
                "aria-label": "Remove relation",
                size: "small"
              }, {
                default: L(() => [
                  p(r(J), {
                    icon: "tabler:trash",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["disabled", "onClick"])
            ]),
            default: L(() => [
              d("div", Eu, [
                d("label", Tu, [
                  o[2] || (o[2] = M("ID ", -1)),
                  p(r(de), {
                    modelValue: f.id,
                    "onUpdate:modelValue": (y) => f.id = y,
                    required: "",
                    pattern: "[a-z][a-z0-9_]*",
                    "aria-label": "Relation ID"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                d("label", Uu, [
                  o[3] || (o[3] = M("Outward label ", -1)),
                  p(r(de), {
                    modelValue: f.outward,
                    "onUpdate:modelValue": (y) => f.outward = y,
                    "aria-label": "Outward label"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                d("label", Du, [
                  o[4] || (o[4] = M("Inward label ", -1)),
                  p(r(de), {
                    modelValue: f.inward,
                    "onUpdate:modelValue": (y) => f.inward = y,
                    "aria-label": "Inward label"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                d("label", Iu, [
                  o[5] || (o[5] = M("Cardinality ", -1)),
                  p(r(le), {
                    "model-value": f.cardinality ?? "many",
                    "onUpdate:modelValue": (y) => f.cardinality = y,
                    "aria-label": "Relation cardinality",
                    appendTo: "self",
                    optionLabel: "label",
                    optionValue: "value",
                    optionDisabled: "disabled",
                    options: [{ label: "One link", value: "one", disabled: !1 }, { label: "Many links", value: "many", disabled: !1 }]
                  }, null, 8, ["model-value", "onUpdate:modelValue"])
                ]),
                d("label", Au, [
                  p(r(Mt), {
                    modelValue: f.symmetric,
                    "onUpdate:modelValue": (y) => f.symmetric = y,
                    "aria-label": "Symmetric",
                    binary: ""
                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                  o[6] || (o[6] = M("Same meaning in both directions ", -1))
                ])
              ]),
              d("p", Pu, [
                o[7] || (o[7] = d("strong", null, "This item", -1)),
                M(" " + D(f.outward || "relates to") + " ", 1),
                o[8] || (o[8] = d("strong", null, "another item", -1)),
                d("span", Ou, " · reverse: " + D(f.symmetric ? f.outward : f.inward), 1)
              ])
            ]),
            _: 2
          }, 1032, ["title", "code", "kind"]))), 128)),
          t.value.length ? I("", !0) : (u(), h("p", Ru, "No relation types yet. Add one to link related work.")),
          d("div", Nu, [
            d("label", Mu, [
              o[9] || (o[9] = M("New relation ID ", -1)),
              p(r(de), {
                modelValue: a.value,
                "onUpdate:modelValue": o[0] || (o[0] = (f) => a.value = f),
                placeholder: "related_to",
                onKeydown: Ae(he(v, ["prevent"]), ["enter"])
              }, null, 8, ["modelValue", "onKeydown"])
            ]),
            p(r(X), {
              label: "Add relation",
              severity: "secondary",
              disabled: !c.value,
              onClick: v,
              outlined: ""
            }, {
              icon: L(() => [
                p(r(J), {
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
function zu(e, l) {
  return e.parked ? "Stopped: " + (typeof e.error == "string" ? e.error : e.error?.message ?? "Projection is parked") : e.bootstrapping ? "Initializing" : e.last_seq >= l ? "Up to date" : "Catching up";
}
const Bu = {
  class: "work-stack",
  "aria-label": "Plugins editor"
}, Fu = {
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
}, Wu = { class: "work-row" }, Gu = {
  key: 0,
  class: "work-muted work-small"
}, Yu = {
  key: 1,
  class: "kx-err"
}, Ku = {
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
}, wl = /* @__PURE__ */ ce({
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
  emits: ["configured", "validity"],
  setup(e, { emit: l }) {
    const t = e, a = l, n = z({}), s = z(""), c = z(""), v = z(""), m = z(/* @__PURE__ */ new Set()), i = {};
    function o(E) {
      return t.schema.plugins?.find((C) => C.plugin === E);
    }
    function f(E) {
      return o(E)?.active === !0;
    }
    function g(E) {
      return o(E)?.lifecycle.state === "ready";
    }
    function y(E) {
      return t.draft.plugins?.some((C) => C.use === E) === !0;
    }
    function w(E, C) {
      const $ = t.draft.plugins ?? [];
      C && !y(E) && (t.draft.plugins = [...$, { use: E }]), C || (t.draft.plugins = $.filter((O) => O.use !== E), delete t.configs[E], m.value.delete(E), a("validity", E, !0));
    }
    function U(E) {
      return f(E) ? n.value[E] ?? o(E)?.config ?? i : t.configs[E] ?? i;
    }
    function R(E, C) {
      f(E) ? n.value[E] = C : t.configs[E] = C;
    }
    function S(E, C) {
      C ? m.value.delete(E) : m.value.add(E), f(E) || a("validity", E, C);
    }
    async function T(E) {
      if (!(s.value || m.value.has(E))) {
        s.value = E, c.value = "", v.value = "";
        try {
          await gt.configure(t.boardId, E, U(E)), delete n.value[E], v.value = "Plugin configuration saved.", a("configured");
        } catch (C) {
          c.value = C instanceof Error ? C.message : "Could not configure plugin.";
        } finally {
          s.value = "";
        }
      }
    }
    return (E, C) => (u(), h("section", Bu, [
      C[3] || (C[3] = d("header", { class: "work-section-heading" }, [
        d("div", null, [
          d("h2", null, "Plugins"),
          d("p", { class: "work-muted work-small" }, "Add capabilities from installed modules.")
        ])
      ], -1)),
      C[4] || (C[4] = d("p", { class: "work-muted work-small" }, "Activation joins the schema draft and requires review. Active plugin configuration saves separately.", -1)),
      e.options.length ? I("", !0) : (u(), h("p", Fu, "No installed plugins are visible to you.")),
      c.value ? (u(), h("div", ju, D(c.value), 1)) : I("", !0),
      v.value ? (u(), h("p", qu, D(v.value), 1)) : I("", !0),
      p(xa, {
        columns: "plugins",
        count: e.options.length
      }, {
        default: L(() => [
          (u(!0), h(q, null, ae(e.options, ($) => (u(), B($a, {
            key: $.plugin,
            title: $.title || "Unavailable capability",
            description: $.description,
            kind: f($.plugin) ? "Active" : y($.plugin) ? "Pending review" : "Inactive",
            class: "work-stack"
          }, {
            actions: L(() => [
              C[1] || (C[1] = d("span", { class: "work-spacer" }, null, -1)),
              d("label", Wu, [
                p(r(Ne), {
                  "model-value": y($.plugin),
                  disabled: !!s.value || e.disabled || e.activationLocked || !!$.problem,
                  "onUpdate:modelValue": (O) => w($.plugin, O)
                }, null, 8, ["model-value", "disabled", "onUpdate:modelValue"]),
                C[0] || (C[0] = M("Activate on this board", -1))
              ])
            ]),
            default: L(() => [
              $.requires.length ? (u(), h("p", Gu, "Requires " + D($.requires.map((O) => e.options.find((Z) => Z.plugin === O)?.title || "Another capability").join(", ")), 1)) : I("", !0),
              $.problem ? (u(), h("p", Yu, D($.problem.message), 1)) : I("", !0),
              o($.plugin)?.outdated ? (u(), h("p", Ku, "The stored declaration differs from the installed plugin. Review activation to update it.")) : I("", !0),
              f($.plugin) ? (u(), h("div", Hu, [
                d("p", null, D(g($.plugin) ? "Attachment configured" : o($.plugin)?.lifecycle.state === "failed" ? "Configuration failed" : "Configuring attachment"), 1),
                o($.plugin)?.lifecycle.error ? (u(), h("p", Xu, D(o($.plugin)?.lifecycle.error?.message), 1)) : I("", !0),
                (u(!0), h(q, null, ae(o($.plugin)?.projections, (O, Z) => (u(), h("div", { key: Z }, [
                  d("p", null, D(r(zu)(O, e.schema.as_of)), 1),
                  d("p", Ju, "Position " + D(O.last_seq) + " · Board head " + D(e.schema.as_of), 1)
                ]))), 128))
              ])) : I("", !0),
              !$.problem && (y($.plugin) || f($.plugin)) ? (u(), h(q, { key: 4 }, [
                p(_l, {
                  disabled: !!s.value || e.disabled,
                  schema: $.config_schema,
                  "model-value": U($.plugin),
                  "onUpdate:modelValue": (O) => R($.plugin, O),
                  onValidity: (O) => S($.plugin, O)
                }, null, 8, ["disabled", "schema", "model-value", "onUpdate:modelValue", "onValidity"]),
                d("div", Zu, [
                  p(r(X), {
                    label: "Reset",
                    severity: "secondary",
                    outlined: "",
                    disabled: !!s.value || e.disabled,
                    onClick: (O) => R($.plugin, f($.plugin) ? r(yt)(o($.plugin)?.config ?? {}) : {})
                  }, {
                    icon: L(() => [
                      p(r(J), { icon: "tabler:restore" })
                    ]),
                    _: 1
                  }, 8, ["disabled", "onClick"]),
                  f($.plugin) ? (u(), B(r(X), {
                    key: 0,
                    label: "Save configuration",
                    disabled: !!s.value || e.disabled || m.value.has($.plugin),
                    loading: s.value === $.plugin,
                    onClick: (O) => T($.plugin)
                  }, {
                    icon: L(() => [
                      p(r(J), {
                        icon: "tabler:device-floppy",
                        "aria-hidden": "true"
                      })
                    ]),
                    _: 1
                  }, 8, ["disabled", "loading", "onClick"])) : I("", !0)
                ]),
                f($.plugin) ? I("", !0) : (u(), h("p", Qu, "Initial configuration is included in Review and Apply."))
              ], 64)) : I("", !0)
            ]),
            _: 2
          }, 1032, ["title", "description", "kind"]))), 128))
        ]),
        _: 1
      }, 8, ["count"]),
      (u(!0), h(q, null, ae(e.draft.plugins?.filter(($) => !e.options.some((O) => O.plugin === $.use)) ?? [], ($) => (u(), h("article", {
        key: $.use,
        class: "work-settings-card"
      }, [
        C[2] || (C[2] = d("p", null, "Unavailable plugin", -1)),
        p(r(X), {
          label: "Deactivate plugin",
          severity: "secondary",
          onClick: (O) => w($.use, !1),
          outlined: ""
        }, {
          icon: L(() => [
            p(r(J), {
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
}, ec = { class: "work-stack work-tight" }, tc = { class: "work-settings-list" }, ac = { class: "work-row-main" }, lc = { class: "work-small work-muted" }, oc = { class: "work-row-control" }, ic = { class: "work-row" }, nc = /* @__PURE__ */ ce({
  __name: "VisibilityEditor",
  props: {
    draft: {},
    boardId: {}
  },
  emits: ["validity"],
  setup(e, { emit: l }) {
    const t = e, a = l, n = W(() => t.draft.visibility), s = W(() => (t.draft.fields ?? []).filter((m) => m.type === "option"));
    function c(m) {
      if (!m) {
        delete t.draft.visibility;
        return;
      }
      const i = s.value.find((o) => o.code === m);
      t.draft.visibility = { field: m, levels: (i?.options ?? []).map((o) => ({ id: o.id, holders: [] })) };
    }
    function v(m, i) {
      const o = n.value?.levels.find((f) => f.id === m);
      o && (o.holders = i ?? []);
    }
    return (m, i) => (u(), h("section", _u, [
      i[8] || (i[8] = d("h3", { class: "work-group-title" }, "Board visibility", -1)),
      i[9] || (i[9] = d("p", { class: "work-small work-muted" }, "Restrict items by their visibility level. People still need access to the board.", -1)),
      d("label", ec, [
        i[6] || (i[6] = M("Visibility field", -1)),
        p(r(le), {
          placeholder: "No additional restriction",
          "model-value": n.value?.field ?? "",
          options: [{ label: "No additional restriction", value: "" }, ...s.value.map((o) => ({ label: r(xt)(o), value: o.code }))],
          optionLabel: "label",
          optionValue: "value",
          appendTo: "self",
          "onUpdate:modelValue": i[0] || (i[0] = (o) => c(o))
        }, null, 8, ["model-value", "options"])
      ]),
      n.value ? (u(), h(q, { key: 0 }, [
        d("div", tc, [
          (u(!0), h(q, null, ae(n.value.levels, (o, f) => (u(), h("div", {
            key: o.id,
            class: "work-settings-row"
          }, [
            d("div", ac, [
              d("strong", null, D(s.value.find((g) => g.code === n.value.field)?.options?.find((g) => g.id === o.id)?.label || "Visibility level"), 1),
              d("p", lc, "Level " + D(f + 1), 1)
            ]),
            d("div", oc, [
              p(Rl, {
                "board-id": e.boardId,
                label: "Who can see these items",
                "model-value": o.holders,
                "onUpdate:modelValue": (g) => v(o.id, g),
                onValidity: i[1] || (i[1] = (g) => a("validity", g))
              }, null, 8, ["board-id", "model-value", "onUpdate:modelValue"])
            ])
          ]))), 128))
        ]),
        d("label", ic, [
          p(r(Ne), {
            "model-value": n.value.bypass === "admin",
            "onUpdate:modelValue": i[2] || (i[2] = (o) => o ? n.value.bypass = "admin" : delete n.value.bypass)
          }, null, 8, ["model-value"]),
          i[7] || (i[7] = M("Board administrators can see every level", -1))
        ]),
        p(r(X), {
          label: "Remove visibility restriction",
          severity: "secondary",
          text: "",
          onClick: i[3] || (i[3] = (o) => delete e.draft.visibility)
        }),
        p(at, {
          label: "Visibility rules",
          "model-value": n.value,
          shape: "object",
          example: { field: "visibility", levels: [{ id: "internal", holders: [] }], bypass: "admin" },
          "onUpdate:modelValue": i[4] || (i[4] = (o) => e.draft.visibility = o),
          onValidity: i[5] || (i[5] = (o) => a("validity", o))
        }, null, 8, ["model-value"])
      ], 64)) : I("", !0)
    ]));
  }
}), sc = { class: "kx-head" }, rc = { class: "kx-head-icon" }, dc = { class: "kx-head-text" }, uc = { class: "kx-title" }, cc = ["title"], mc = { class: "kx-head-actions" }, vc = /* @__PURE__ */ ce({
  __name: "PageHead",
  props: {
    title: {},
    subtitle: {},
    icon: { default: "tabler:layout-kanban" },
    backLabel: {}
  },
  emits: ["back"],
  setup(e) {
    return (l, t) => (u(), h("header", sc, [
      e.backLabel ? (u(), B(r(X), {
        key: 0,
        "aria-label": e.backLabel,
        severity: "secondary",
        text: "",
        onClick: t[0] || (t[0] = (a) => l.$emit("back"))
      }, {
        default: L(() => [
          p(r(J), {
            icon: "tabler:arrow-left",
            "aria-hidden": "true"
          })
        ]),
        _: 1
      }, 8, ["aria-label"])) : I("", !0),
      d("div", rc, [
        p(r(J), {
          icon: e.icon,
          "aria-hidden": "true"
        }, null, 8, ["icon"])
      ]),
      d("div", dc, [
        We(l.$slots, "identity", {}, () => [
          d("h1", uc, D(e.title), 1),
          e.subtitle ? (u(), h("p", {
            key: 0,
            class: "kx-head-sub",
            title: e.subtitle
          }, D(e.subtitle), 9, cc)) : I("", !0)
        ])
      ]),
      d("div", mc, [
        We(l.$slots, "default")
      ])
    ]));
  }
}), fc = { class: "work-board-identity work-stack work-tight" }, pc = { class: "work-stack work-tight" }, bc = { class: "work-stack work-tight" }, hc = { class: "work-row" }, yc = { class: "work-row" }, gc = {
  key: 1,
  class: "work-identity-actions"
}, kc = ["title"], wc = {
  key: 2,
  class: "kx-err work-inline",
  role: "alert"
}, Vc = {
  key: 3,
  class: "work-muted work-small",
  role: "status"
}, Vl = /* @__PURE__ */ ce({
  __name: "BoardIdentity",
  props: {
    board: {},
    compact: { type: Boolean },
    detail: { type: Boolean },
    subtitle: {}
  },
  emits: ["saved"],
  setup(e, { emit: l }) {
    const t = e, a = l, n = z(!1), s = z(""), c = z(""), v = z(!1), m = z(""), i = z(""), o = W(() => t.board?.access?.admin === !0);
    function f() {
      s.value = t.board?.title ?? "", c.value = t.board?.description ?? "", m.value = "", i.value = "", n.value = !0;
    }
    Ee(o, (y) => {
      y || (n.value = !1);
    });
    async function g() {
      if (!o.value || !t.board || v.value || !s.value.trim()) return;
      const y = {};
      if (s.value.trim() !== t.board.title && (y.title = s.value.trim()), c.value !== (t.board.description ?? "") && (y.description = c.value), !Object.keys(y).length) {
        n.value = !1, i.value = "Nothing changed.";
        return;
      }
      v.value = !0, m.value = "";
      try {
        const w = await Vt.updateBoard(t.board.board_id, y);
        n.value = !1, i.value = w.status === "unchanged" ? "Nothing changed." : "Board saved.", a("saved");
      } catch (w) {
        m.value = w instanceof Error ? w.message : "Could not save the board.";
      } finally {
        v.value = !1;
      }
    }
    return (y, w) => (u(), h("div", fc, [
      n.value ? (u(), h("form", {
        key: 0,
        class: "work-identity-edit",
        "aria-label": "Edit board",
        onClick: w[3] || (w[3] = he(() => {
        }, ["stop"])),
        onSubmit: he(g, ["prevent"])
      }, [
        d("label", pc, [
          w[4] || (w[4] = M("Title", -1)),
          p(r(de), {
            modelValue: s.value,
            "onUpdate:modelValue": w[0] || (w[0] = (U) => s.value = U),
            required: "",
            autofocus: "",
            disabled: v.value
          }, null, 8, ["modelValue", "disabled"])
        ]),
        d("label", bc, [
          w[5] || (w[5] = M("Description", -1)),
          p(r(ea), {
            modelValue: c.value,
            "onUpdate:modelValue": w[1] || (w[1] = (U) => c.value = U),
            rows: "1",
            disabled: v.value
          }, null, 8, ["modelValue", "disabled"])
        ]),
        d("div", hc, [
          p(r(X), {
            label: "Save",
            severity: "secondary",
            type: "submit",
            disabled: !s.value.trim() || v.value,
            loading: v.value,
            outlined: ""
          }, {
            icon: L(() => [
              p(r(J), {
                icon: "tabler:device-floppy",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled", "loading"]),
          p(r(X), {
            label: "Cancel",
            severity: "secondary",
            disabled: v.value,
            onClick: w[2] || (w[2] = (U) => n.value = !1),
            outlined: ""
          }, {
            icon: L(() => [
              p(r(J), {
                icon: "tabler:x",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled"])
        ])
      ], 32)) : (u(), h(q, { key: 1 }, [
        d("div", yc, [
          (u(), B(za(e.compact || e.detail ? "h2" : "h1"), {
            class: ct(e.detail ? "work-detail-title" : e.compact ? "kx-card-name" : "kx-title")
          }, {
            default: L(() => [
              M(D(e.board?.title || "Untitled board"), 1)
            ]),
            _: 1
          }, 8, ["class"])),
          e.compact ? We(y.$slots, "title-end", {}, void 0, void 0, 0) : I("", !0),
          e.compact ? (u(), h("span", gc, [
            o.value ? (u(), B(r(X), {
              key: 0,
              severity: "secondary",
              text: "",
              size: "small",
              onClick: he(f, ["stop"]),
              "aria-label": "Edit board"
            }, {
              default: L(() => [
                p(r(J), {
                  icon: "tabler:pencil",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            })) : I("", !0),
            We(y.$slots, "actions")
          ])) : o.value ? (u(), B(r(X), {
            key: 2,
            severity: "secondary",
            text: "",
            size: "small",
            onClick: he(f, ["stop"]),
            "aria-label": "Edit board"
          }, {
            default: L(() => [
              p(r(J), {
                icon: "tabler:pencil",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          })) : I("", !0),
          e.compact ? I("", !0) : We(y.$slots, "title-end", {}, void 0, void 0, 3)
        ]),
        !e.compact && (e.subtitle || e.board?.description) ? (u(), h("p", {
          key: 0,
          class: "kx-head-sub",
          title: e.subtitle || e.board?.description
        }, D(e.subtitle || e.board?.description), 9, kc)) : I("", !0)
      ], 64)),
      m.value ? (u(), h("p", wc, D(m.value), 1)) : I("", !0),
      i.value ? (u(), h("p", Vc, D(i.value), 1)) : I("", !0)
    ]));
  }
}), $c = {
  key: 0,
  class: "work-dirty"
}, $l = /* @__PURE__ */ ce({
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
    return (l, t) => (u(), h(q, null, [
      e.dirty ? (u(), h("span", $c, "Unsaved changes")) : I("", !0),
      p(r(X), {
        label: "Discard",
        severity: "secondary",
        outlined: "",
        disabled: !e.dirty || e.busy || e.checkingRemoval,
        onClick: t[0] || (t[0] = (a) => l.$emit("discard"))
      }, {
        icon: L(() => [
          p(r(J), { icon: "tabler:restore" })
        ]),
        _: 1
      }, 8, ["disabled"]),
      p(r(X), {
        label: e.reviewed ? "Apply" : "Review changes",
        disabled: e.disabled,
        loading: e.busy,
        onClick: t[1] || (t[1] = (a) => l.$emit("primary"))
      }, null, 8, ["label", "disabled", "loading"])
    ], 64));
  }
}), xc = {
  key: 0,
  class: "work-detail-head"
}, Sc = {
  key: 0,
  class: "work-row work-wrap work-draft-actions"
}, Cc = /* @__PURE__ */ ce({
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
  emits: ["back", "discard", "primary", "saved", "upgrade"],
  setup(e) {
    const l = e, t = W(() => l.pack ? `${l.packTitle} ${l.pack.version}${l.outdated ? " · Outdated" : ""}` : ""), a = W(() => "Settings · generation " + (l.generation ?? "…") + (t.value ? " · " + t.value : ""));
    return (n, s) => e.embedded ? (u(), h("header", xc, [
      p(Vl, {
        board: e.board,
        subtitle: t.value || void 0,
        detail: "",
        onSaved: s[0] || (s[0] = (c) => n.$emit("saved"))
      }, {
        "title-end": L(() => [
          p(r(Pe), {
            severity: "secondary",
            value: "Generation " + (e.generation ?? "…")
          }, null, 8, ["value"])
        ]),
        _: 1
      }, 8, ["board", "subtitle"]),
      e.authorized ? (u(), h("div", Sc, [
        e.authorized && e.outdated && e.pack ? (u(), B(r(X), {
          key: 0,
          disabled: !e.canUpgrade,
          title: e.upgradeReason,
          label: "Upgrade pack",
          severity: "secondary",
          outlined: "",
          onClick: s[1] || (s[1] = (c) => n.$emit("upgrade"))
        }, {
          icon: L(() => [
            p(r(J), { icon: "tabler:refresh" })
          ]),
          _: 1
        }, 8, ["disabled", "title"])) : I("", !0),
        p($l, {
          dirty: e.dirty,
          busy: e.busy,
          "checking-removal": e.checkingRemoval,
          reviewed: e.reviewed,
          disabled: e.disabled,
          onDiscard: s[2] || (s[2] = (c) => n.$emit("discard")),
          onPrimary: s[3] || (s[3] = (c) => n.$emit("primary"))
        }, null, 8, ["dirty", "busy", "checking-removal", "reviewed", "disabled"])
      ])) : I("", !0)
    ])) : (u(), B(vc, {
      key: 1,
      title: e.board?.title || "Board",
      subtitle: a.value,
      "back-label": "Back to board",
      icon: "tabler:adjustments",
      onBack: s[8] || (s[8] = (c) => n.$emit("back"))
    }, {
      identity: L(() => [
        p(Vl, {
          board: e.board,
          subtitle: a.value,
          onSaved: s[4] || (s[4] = (c) => n.$emit("saved"))
        }, null, 8, ["board", "subtitle"])
      ]),
      default: L(() => [
        e.authorized && e.outdated && e.pack ? (u(), B(r(X), {
          key: 0,
          disabled: !e.canUpgrade,
          title: e.upgradeReason,
          label: "Upgrade pack",
          severity: "secondary",
          outlined: "",
          onClick: s[5] || (s[5] = (c) => n.$emit("upgrade"))
        }, {
          icon: L(() => [
            p(r(J), { icon: "tabler:refresh" })
          ]),
          _: 1
        }, 8, ["disabled", "title"])) : I("", !0),
        e.authorized ? (u(), B($l, {
          key: 1,
          dirty: e.dirty,
          busy: e.busy,
          "checking-removal": e.checkingRemoval,
          reviewed: e.reviewed,
          disabled: e.disabled,
          onDiscard: s[6] || (s[6] = (c) => n.$emit("discard")),
          onPrimary: s[7] || (s[7] = (c) => n.$emit("primary"))
        }, null, 8, ["dirty", "busy", "checking-removal", "reviewed", "disabled"])) : I("", !0)
      ]),
      _: 1
    }, 8, ["title", "subtitle"]));
  }
}), Ec = {
  key: 0,
  class: "work-settings-card work-schema-plan work-stack",
  "aria-label": "Schema review"
}, Tc = { key: 0 }, Uc = { class: "work-row" }, Dc = { class: "work-muted work-small" }, Ic = { class: "work-muted" }, Ac = {
  key: 0,
  class: "work-notice"
}, Pc = {
  key: 1,
  class: "work-notice"
}, Oc = {
  key: 2,
  class: "work-muted work-small"
}, Rc = { key: 3 }, Nc = { key: 0 }, Mc = {
  key: 4,
  class: "work-settings-table"
}, Lc = { key: 0 }, zc = { key: 1 }, Bc = { key: 2 }, Fc = { key: 5 }, jc = /* @__PURE__ */ ce({
  __name: "SchemaReview",
  props: {
    plan: {},
    generation: {},
    follows: {},
    configCount: {},
    packReview: { type: Boolean }
  },
  setup(e) {
    return (l, t) => e.plan ? (u(), h("section", Ec, [
      !e.plan.changes.length && !e.plan.refused.length && !e.configCount && !e.packReview ? (u(), h("p", Tc, "No changes to apply.")) : (u(), h(q, { key: 1 }, [
        d("header", Uc, [
          t[0] || (t[0] = d("h2", null, "Review", -1)),
          p(r(Pe), {
            class: "kx-tag-sm",
            severity: e.plan.class === "refused" ? "danger" : e.plan.class === "semantic" ? "warn" : e.plan.class === "additive" ? "success" : "secondary"
          }, {
            default: L(() => [
              M(D(e.plan.class), 1)
            ]),
            _: 1
          }, 8, ["severity"]),
          d("span", Dc, "Generation " + D(e.generation) + " → " + D(e.plan.generation), 1)
        ]),
        d("p", Ic, D(r(wo)[e.plan.class] || "Review the classified changes below."), 1),
        e.plan.migration ? (u(), h("p", Ac, "Migration needed: " + D(e.plan.migration), 1)) : e.follows.length ? (u(), h("p", Pc, "Follow migration: " + D(e.follows.join(", ")) + ". Existing items move to the new process generation; declared state maps apply.", 1)) : (u(), h("p", Oc, "No follow process migration is indicated by these changes.")),
        We(l.$slots, "default"),
        e.plan.refused.length ? (u(), h("h3", Rc, "Refused changes")) : I("", !0),
        (u(!0), h(q, null, ae(e.plan.refused, (a, n) => (u(), B(r(Mo), {
          key: n,
          severity: "error",
          role: "alert"
        }, {
          default: L(() => [
            M(D(a.code) + " · " + D(a.what) + " · " + D(r(Va)(a)), 1),
            a.to ? (u(), h("span", Nc, " → " + D(a.to), 1)) : I("", !0)
          ]),
          _: 2
        }, 1024))), 128)),
        e.plan.changes.length ? (u(), h("table", Mc, [
          t[1] || (t[1] = d("thead", null, [
            d("tr", null, [
              d("th", null, "Entry"),
              d("th", null, "Class"),
              d("th", null, "Change")
            ])
          ], -1)),
          d("tbody", null, [
            (u(!0), h(q, null, ae(e.plan.changes, (a, n) => (u(), h("tr", { key: n }, [
              d("td", null, D(a.code), 1),
              d("td", null, [
                p(r(Pe), {
                  class: "kx-tag-sm",
                  severity: a.class === "refused" ? "danger" : a.class === "semantic" ? "warn" : a.class === "additive" ? "success" : "secondary"
                }, {
                  default: L(() => [
                    M(D(a.class), 1)
                  ]),
                  _: 2
                }, 1032, ["severity"])
              ]),
              d("td", null, [
                M(D(a.what) + " ", 1),
                a.detail ? (u(), h("span", Lc, " · " + D(a.detail), 1)) : I("", !0),
                a.to ? (u(), h("span", zc, " → " + D(a.to), 1)) : I("", !0),
                a.count ? (u(), h("span", Bc, " · " + D(a.count) + " items", 1)) : I("", !0)
              ])
            ]))), 128))
          ])
        ])) : (u(), h("p", Fc, "No declaration changes are reported."))
      ], 64))
    ])) : I("", !0);
  }
}), qc = {
  key: 0,
  class: "work-stack",
  "aria-label": "Pack conflicts"
}, Wc = { class: "work-stack work-tight work-pack-review-field" }, Gc = { class: "work-json-disclosure" }, Yc = { class: "work-config-fields" }, Kc = { class: "work-json-example" }, Hc = { class: "work-json-example" }, Xc = {
  key: 1,
  class: "work-stack",
  "aria-label": "Pack state maps"
}, Jc = /* @__PURE__ */ ce({
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
    function n(i) {
      return t.original.processes?.find((o) => o.id === i)?.name || ye(i);
    }
    function s(i) {
      const [o, ...f] = i.split("."), g = f.join(".");
      return o === "processes" ? n(g) : o === "fields" ? t.original.fields?.find((y) => y.code === g)?.title || ye(g) : o === "item_types" ? t.original.item_types?.find((y) => y.id === g)?.title || ye(g) : ye(o);
    }
    function c(i) {
      return JSON.stringify(i ?? null, null, 2);
    }
    function v(i, o) {
      (t.request.resolutions ??= {})[i] = o, a("change");
    }
    function m(i, o, f) {
      ((t.request.maps ??= {})[i] ??= {})[o] = f, a("change");
    }
    return (i, o) => (u(), h(q, null, [
      e.plan.conflicts.length ? (u(), h("section", qc, [
        o[3] || (o[3] = d("h3", null, "Local edits conflict", -1)),
        o[4] || (o[4] = d("p", { class: "work-muted work-small" }, "Choose which declaration to keep for each conflict, then review again.", -1)),
        (u(!0), h(q, null, ae(e.plan.conflicts, (f) => (u(), h("div", {
          key: f.path,
          class: "work-stack work-tight"
        }, [
          d("label", Wc, [
            M(D(s(f.path)), 1),
            p(r(le), {
              "model-value": e.request.resolutions?.[f.path],
              "aria-label": "Resolution for " + s(f.path),
              disabled: e.disabled,
              appendTo: "self",
              placeholder: "Choose a resolution",
              optionLabel: "label",
              optionValue: "value",
              options: [{ label: "Keep local edits", value: "local" }, { label: "Use pack changes", value: "incoming" }],
              "onUpdate:modelValue": (g) => v(f.path, g)
            }, null, 8, ["model-value", "aria-label", "disabled", "onUpdate:modelValue"])
          ]),
          d("details", Gc, [
            o[2] || (o[2] = d("summary", null, "Compare declarations", -1)),
            d("div", Yc, [
              d("section", null, [
                o[0] || (o[0] = d("h4", null, "Local edits", -1)),
                d("pre", Kc, D(c(f.local_value)), 1)
              ]),
              d("section", null, [
                o[1] || (o[1] = d("h4", null, "Pack changes", -1)),
                d("pre", Hc, D(c(f.incoming)), 1)
              ])
            ])
          ])
        ]))), 128))
      ])) : I("", !0),
      Object.keys(e.plan.maps).length ? (u(), h("section", Xc, [
        o[5] || (o[5] = d("h3", null, "Required state maps", -1)),
        o[6] || (o[6] = d("p", { class: "work-muted work-small" }, "Review the proposed destinations for existing items. Each destination is editable.", -1)),
        (u(!0), h(q, null, ae(e.plan.maps, (f, g) => (u(), h("div", {
          key: g,
          class: "work-stack"
        }, [
          d("h4", null, D(n(g)), 1),
          (u(!0), h(q, null, ae(f, (y, w) => (u(), h("label", {
            key: w,
            class: "work-stack work-tight work-pack-review-field"
          }, [
            M("Move items from " + D(r(be)(e.original.processes?.find((U) => U.id === g)?.states.find((U) => U.id === w))), 1),
            p(r(le), {
              "model-value": e.request.maps?.[g]?.[w],
              "aria-label": "Move items from " + r(be)(e.original.processes?.find((U) => U.id === g)?.states.find((U) => U.id === w)),
              disabled: e.disabled,
              appendTo: "self",
              optionLabel: "label",
              optionValue: "value",
              options: e.plan.declaration.processes?.find((U) => U.id === g)?.states.map((U) => ({ label: r(be)(U), value: U.id })) ?? [],
              "onUpdate:modelValue": (U) => m(g, w, U)
            }, null, 8, ["model-value", "aria-label", "disabled", "options", "onUpdate:modelValue"])
          ]))), 128))
        ]))), 128))
      ])) : I("", !0)
    ], 64));
  }
}), Zc = {
  key: 0,
  class: "work-settings-tabs"
}, Qc = { class: "work-section-navigation" }, _c = { class: "work-row work-small work-advanced" }, em = {
  key: 1,
  class: "kx-err",
  role: "alert"
}, tm = {
  key: 2,
  class: "kx-err",
  role: "alert"
}, am = {
  key: 3,
  class: "work-notice",
  role: "status"
}, lm = {
  key: 4,
  class: "kx-loading",
  role: "status"
}, om = {
  key: 5,
  class: "work-notice",
  role: "alert"
}, im = {
  key: 6,
  class: "work-settings-content work-pane"
}, nm = {
  key: 0,
  class: "work-notice",
  role: "alert"
}, sm = {
  key: 1,
  class: "work-notice"
}, rm = { key: 0 }, dm = ["disabled", "inert"], um = {
  key: 6,
  class: "work-settings-card work-stack work-advanced-settings"
}, cm = {
  key: 5,
  class: "kx-empty"
}, mm = {
  key: 6,
  class: "work-muted work-small",
  role: "status"
}, vm = /* @__PURE__ */ ce({
  __name: "BoardSettings",
  props: {
    boardId: {},
    embedded: { type: Boolean }
  },
  emits: ["dirty-change"],
  setup(e, { emit: l }) {
    const t = e, a = l, n = Bo();
    let s, c = "";
    const v = () => JSON.stringify([V.value, R.value, _.value, [...pe.value]]), m = ["Fields", "Item types", "Process", "Policy", "Relation types", "Plugins", "Review"], i = z("Fields"), o = z(!1), f = z(/* @__PURE__ */ new Set(["Fields"]));
    Ee(i, (Q) => f.value.add(Q));
    const g = z(), y = z(), w = z(), U = z({}), R = z({}), S = z(), T = z(!1), E = z(!0), C = z(!1), $ = z(""), O = z(""), Z = z(""), ue = z([]), _ = z(), H = z(), P = z(), ee = z(), x = z(), A = z(""), N = z([]), Y = W(() => [...N.value, ...ee.value?.refused ?? []]), se = z(!1), ge = z(0), pe = z(/* @__PURE__ */ new Set()), Me = z(), De = Fa(), b = Fa(), V = W(() => sl(U.value, g.value?.declaration ?? {})), k = W(() => pe.value.size > 0 || !!_.value || !!g.value && (JSON.stringify(V.value) !== JSON.stringify(g.value.declaration) || Object.keys(R.value).length > 0));
    Ee(k, (Q) => a("dirty-change", Q), { immediate: !0, flush: "sync" });
    const F = W(() => !!g.value && !!y.value && g.value.generation !== y.value.generation), G = W(() => T.value && !C.value && !se.value && !St.value && !F.value && !pe.value.size && ee.value && (ee.value.changes.length > 0 || Object.keys(R.value).length > 0) && ee.value.class !== "refused" && !ee.value.refused.length && x.value?.matches(V.value, g.value?.generation ?? -1, R.value)), re = W(() => ue.value.find((Q) => Q.id === _.value?.pack)?.plugins.filter((Q) => !g.value?.plugins?.some((K) => K.plugin === Q.id && K.active)).map((Q) => ({ use: Q.id })) ?? []), fe = W(() => !!P.value && JSON.stringify(P.value) === JSON.stringify(_.value)), xe = W(() => _.value ? T.value && !C.value && !F.value && !St.value && fe.value && ee.value?.class !== "refused" && !ee.value?.refused.length && H.value?.conflicts.every((Q) => !!_.value?.resolutions?.[Q.path]) : G.value), Oe = W(() => !!ee.value && (!_.value || fe.value)), Te = W(() => ue.value.find((Q) => Q.id === g.value?.pack?.id)?.title || "Installed pack"), it = W(() => !Z.value && !!g.value?.outdated && !!ue.value.find((Q) => Q.id === g.value?.pack?.id)), vt = W(() => Z.value ? "Reload packs to check available upgrades." : it.value ? k.value ? "Discard the current draft before upgrading." : St.value ? "Finish the current migration before upgrading." : C.value ? "Wait for the current request to finish." : void 0 : "Install an available version of this pack to upgrade.");
    function oa() {
      _.value = void 0, H.value = void 0, P.value = void 0;
    }
    async function Xe() {
      if (!g.value?.pack || C.value || k.value) return;
      const Q = ue.value.find((K) => K.id === g.value.pack.id);
      Q && (_.value = xo(Q, g.value.generation), i.value = "Review", await Ft());
    }
    async function Ft() {
      if (!_.value || C.value || !T.value || F.value) return;
      const Q = b(), K = yt(_.value), te = JSON.stringify(_.value);
      C.value = !0, $.value = "", O.value = "";
      try {
        const we = await So(K, (Et) => gt.packPlan(t.boardId, Et));
        if (!Q() || te !== JSON.stringify(_.value)) return;
        H.value = we.plan, ee.value = we.plan, _.value = we.request, P.value = yt(_.value), A.value = crypto.randomUUID(), i.value = "Review";
      } catch (we) {
        Q() && (P.value = void 0, $.value = we instanceof Error ? we.message : "Could not plan the pack upgrade.");
      } finally {
        C.value = !1;
      }
    }
    const jt = W(() => ee.value ? Vo(ee.value, V.value) : []), St = W(() => !!y.value?.migration_error || w.value?.status === "migrating");
    function nt() {
      N.value = [], b(), ee.value = void 0, x.value = void 0, P.value = void 0, A.value = "";
    }
    Ee([V, R], nt, { deep: !0, flush: "sync" }), Ee(R, (Q) => {
      _.value && (Object.keys(Q).length ? _.value.plugin_configs = yt(Q) : delete _.value.plugin_configs);
    }, { deep: !0, flush: "sync" });
    function Ct(Q, K) {
      K ? pe.value.delete(Q) : pe.value.add(Q), nt();
    }
    function Ca(Q) {
      oa(), ge.value++, g.value = Q, U.value = yt(Q.declaration), R.value = {}, pe.value.clear(), nt();
    }
    async function _e(Q = !1) {
      const K = De();
      try {
        const [te, we, Et] = await Promise.all([Vt.schema(t.boardId, void 0, !0).catch((st) => {
          if (st instanceof rl && st.details?.code === "board_schema_missing") return { generation: 0, declaration: {}, compiled: {}, key_prefix: "", as_of: 0 };
          throw st;
        }), Vt.options(t.boardId), Vt.boards()]);
        if (!K()) return;
        if (T.value = we.access.admin, S.value = we, w.value = Et.find((st) => st.board_id === t.boardId), !T.value) {
          g.value = void 0, U.value = {}, nt();
          return;
        }
        $.value = "";
        const Je = Co(te);
        y.value = Je, s !== void 0 && Je.generation >= s ? (s = void 0, c === v() && Ca(Je), c = "") : (Q || !g.value || !k.value) && Ca(Je), F.value && nt(), te.pack && await ll(K);
      } catch (te) {
        if (!K()) return;
        te instanceof rl && (te.status === 403 || te.kind?.toLowerCase() === "permission_denied") && (T.value = !1), nt(), $.value = te instanceof Error ? te.message : "Could not load board settings.";
      } finally {
        K() && (E.value = !1);
      }
    }
    async function ll(Q = () => !0) {
      Z.value = "";
      try {
        const K = await Vt.packs();
        Q() && (ue.value = K.filter(Eo));
      } catch (K) {
        Q() && (Z.value = K instanceof Error ? K.message : "Could not load packs.");
      }
    }
    function eo() {
      for (const Q of Me.value?.querySelectorAll("input, select, textarea") ?? [])
        if (!(Q.form !== Me.value || Q.closest('[style*="display: none"]')) && !Q.reportValidity())
          return !1;
      return !0;
    }
    function to(Q) {
      i.value = Q, Q === "Review" && !ee.value && Ea();
    }
    async function Ea() {
      if (_.value) return Ft();
      if (!g.value || C.value || !T.value || F.value || pe.value.size || !eo()) return;
      const Q = b(), K = dl(V.value, g.value.generation, R.value);
      C.value = !0, $.value = "", O.value = "";
      try {
        const te = await gt.plan(t.boardId, K);
        if (!Q() || pe.value.size || !K.matches(V.value, g.value.generation, R.value)) return;
        ee.value = te, x.value = K, A.value = crypto.randomUUID(), i.value = "Review";
      } catch (te) {
        Q() && (nt(), $.value = te instanceof Error ? te.message : "Could not review changes.", N.value = To(te, V.value));
      } finally {
        C.value = !1;
      }
    }
    async function ao() {
      if (!xe.value) return;
      if (_.value && P.value) {
        C.value = !0, $.value = "";
        const K = v();
        try {
          const te = await gt.packApply(t.boardId, yt(P.value), A.value);
          s = te.generation, c = K, await _e(), O.value = te.status === "done" ? `Pack upgraded at generation ${te.generation}.` : "Pack installation continues in the background.";
        } catch (te) {
          $.value = te instanceof Error ? te.message : "Could not apply the pack upgrade.";
        } finally {
          C.value = !1;
        }
        return;
      }
      if (!x.value) return;
      C.value = !0, $.value = "", O.value = "";
      const Q = v();
      try {
        const K = await gt.apply(t.boardId, x.value, A.value);
        s = K.generation, c = Q, await _e(), O.value = `Applied generation ${K.generation} (${K.class}).`;
      } catch (K) {
        $.value = K instanceof Error ? K.message : "Could not apply schema.";
      } finally {
        C.value = !1;
      }
    }
    async function lo() {
      if (!C.value) {
        C.value = !0, $.value = "";
        try {
          const Q = await gt.resume(t.boardId);
          O.value = Q.resumed ? "Migration resumes." : "Migration is already running.", await _e();
        } catch (Q) {
          $.value = Q instanceof Error ? Q.message : "Could not resume migration.";
        } finally {
          C.value = !1;
        }
      }
    }
    async function ia(Q, K) {
      if (!g.value || !T.value || C.value || se.value) return "Wait for the current change to finish.";
      if (F.value) return "Discard the stale draft before removing a definition.";
      const te = g.value.generation, we = JSON.stringify(V.value), Et = yt(U.value);
      ta(Et, Q, K), se.value = !0;
      try {
        const Je = await gt.plan(t.boardId, dl(sl(Et, g.value.declaration), te, R.value));
        if (!T.value || F.value || g.value.generation !== te || JSON.stringify(V.value) !== we) return "The draft changes during the check. Try the removal again.";
        const st = Uo(Je, Q, K);
        if (st) return st;
        if (Je.class === "refused") return "Resolve the refused draft changes in Review before removing this definition.";
      } catch (Je) {
        return Je instanceof Error ? Je.message : "Could not check this removal.";
      } finally {
        se.value = !1;
      }
    }
    async function oo() {
      k.value && !await vo.confirm({ header: "Discard changes?", message: "Your unsaved board settings will be discarded.", acceptLabel: "Discard", rejectLabel: "Keep editing" }) || n({ name: "board", board: t.boardId });
    }
    function io() {
      s = void 0, y.value && Ca(y.value), O.value = "", $.value = "";
    }
    Ee(() => t.boardId, () => {
      s = void 0, oa(), ue.value = [], g.value = void 0, y.value = void 0, w.value = void 0, R.value = {}, pe.value.clear(), f.value = /* @__PURE__ */ new Set(["Fields"]), i.value = "Fields", T.value = !1, E.value = !0, _e(!0);
    });
    let Ta = () => {
    };
    return Ee(() => t.boardId, (Q) => {
      Ta(), Ta = mo(`component.${Q}`, () => {
        _e();
      });
    }, { immediate: !0 }), $o(_e), xl(() => {
      Ta(), De(), b();
    }), (Q, K) => (u(), h("section", {
      class: ct(["work-settings-shell", { "work-embedded": e.embedded }])
    }, [
      p(Cc, {
        board: w.value,
        embedded: e.embedded,
        generation: g.value?.generation,
        authorized: T.value,
        dirty: k.value,
        busy: C.value,
        "checking-removal": se.value,
        reviewed: Oe.value,
        pack: g.value?.pack,
        "pack-title": Te.value,
        outdated: g.value?.outdated,
        "upgrade-reason": vt.value,
        "can-upgrade": it.value && !k.value && !C.value && !St.value && T.value,
        onUpgrade: Xe,
        disabled: !k.value || C.value || se.value || St.value || F.value || !!pe.value.size || Oe.value && !xe.value,
        onBack: oo,
        onDiscard: io,
        onPrimary: K[0] || (K[0] = (te) => Oe.value ? ao() : Ea()),
        onSaved: K[1] || (K[1] = (te) => _e())
      }, null, 8, ["board", "embedded", "generation", "authorized", "dirty", "busy", "checking-removal", "reviewed", "pack", "pack-title", "outdated", "upgrade-reason", "can-upgrade", "disabled"]),
      T.value && g.value ? (u(), h("div", Zc, [
        d("div", Qc, [
          p(r(Oo), {
            value: i.value,
            "onUpdate:value": K[2] || (K[2] = (te) => to(te))
          }, {
            default: L(() => [
              p(r(Ro), { "aria-label": "Settings sections" }, {
                default: L(() => [
                  (u(), h(q, null, ae(m, (te) => p(r(No), {
                    key: te,
                    value: te
                  }, {
                    default: L(() => [
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
        ]),
        d("label", _c, [
          p(r(Ne), {
            modelValue: o.value,
            "onUpdate:modelValue": K[3] || (K[3] = (te) => o.value = te),
            "aria-label": "Advanced settings"
          }, null, 8, ["modelValue"]),
          K[14] || (K[14] = M("Advanced", -1))
        ])
      ])) : I("", !0),
      $.value ? (u(), h("div", em, [
        M(D($.value) + " ", 1),
        p(r(X), {
          label: "Retry",
          severity: "secondary",
          onClick: K[4] || (K[4] = (te) => _e()),
          outlined: ""
        }, {
          icon: L(() => [
            p(r(J), {
              icon: "tabler:refresh",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        })
      ])) : I("", !0),
      Z.value ? (u(), h("p", tm, [
        M(D(Z.value), 1),
        p(r(X), {
          label: "Reload packs",
          severity: "secondary",
          outlined: "",
          onClick: K[5] || (K[5] = (te) => ll())
        }, {
          icon: L(() => [
            p(r(J), { icon: "tabler:refresh" })
          ]),
          _: 1
        })
      ])) : I("", !0),
      O.value ? (u(), h("p", am, D(O.value), 1)) : I("", !0),
      E.value ? (u(), h("p", lm, "Loading settings…")) : !T.value && !$.value ? (u(), h("p", om, "Board administrator access is required.")) : I("", !0),
      T.value && g.value ? (u(), h("div", im, [
        F.value ? (u(), h("div", nm, "The board advances to generation " + D(y.value?.generation) + " while you edit. Your draft keeps generation " + D(g.value.generation) + ". Discard to load the latest schema before reviewing again.", 1)) : I("", !0),
        St.value ? (u(), h("div", sm, [
          d("p", null, [
            K[15] || (K[15] = M("Migration pending", -1)),
            y.value?.migration_error ? (u(), h("span", rm, ": " + D(y.value.migration_error), 1)) : I("", !0)
          ]),
          p(r(X), {
            label: "Resume migration",
            severity: "secondary",
            disabled: C.value,
            onClick: lo,
            outlined: ""
          }, {
            icon: L(() => [
              p(r(J), {
                icon: "tabler:refresh",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled"])
        ])) : I("", !0),
        d("form", {
          ref_key: "editor",
          ref: Me,
          onSubmit: he(Ea, ["prevent"])
        }, [
          (u(), h("fieldset", {
            key: ge.value,
            class: "work-settings-fieldset",
            disabled: C.value || se.value,
            inert: C.value || se.value || void 0
          }, [
            f.value.has("Fields") ? et((u(), B(fs, {
              key: 0,
              "board-id": e.boardId,
              "installed-types": S.value?.installed_types,
              draft: U.value,
              "guard-removal": ia,
              advanced: o.value,
              issues: Y.value,
              onValidity: K[6] || (K[6] = (te, we) => Ct("fields:" + te, we))
            }, null, 8, ["board-id", "installed-types", "draft", "advanced", "issues"])), [
              [ht, i.value === "Fields"]
            ]) : I("", !0),
            f.value.has("Item types") ? et((u(), B(As, {
              key: 1,
              draft: U.value,
              "guard-removal": ia,
              issues: Y.value
            }, null, 8, ["draft", "issues"])), [
              [ht, i.value === "Item types"]
            ]) : I("", !0),
            f.value.has("Process") ? et((u(), B(Kd, {
              key: 2,
              "board-id": e.boardId,
              draft: U.value,
              "guard-removal": ia,
              advanced: o.value,
              issues: Y.value,
              onValidity: K[7] || (K[7] = (te, we) => Ct("process:" + te, we))
            }, null, 8, ["board-id", "draft", "advanced", "issues"])), [
              [ht, i.value === "Process"]
            ]) : I("", !0),
            f.value.has("Policy") ? et((u(), B(Vu, {
              key: 3,
              draft: U.value,
              onValidity: K[8] || (K[8] = (te, we) => Ct("policy:" + te, we))
            }, null, 8, ["draft"])), [
              [ht, i.value === "Policy"]
            ]) : I("", !0),
            f.value.has("Relation types") ? et((u(), B(Lu, {
              key: 4,
              draft: U.value,
              "guard-removal": ia
            }, null, 8, ["draft"])), [
              [ht, i.value === "Relation types"]
            ]) : I("", !0),
            f.value.has("Plugins") ? et((u(), B(wl, {
              key: 5,
              "board-id": e.boardId,
              draft: U.value,
              schema: y.value ?? g.value,
              options: S.value?.schema_options.plugins ?? [],
              configs: R.value,
              disabled: C.value,
              onConfigured: K[9] || (K[9] = (te) => {
                nt(), _e();
              }),
              onValidity: K[10] || (K[10] = (te, we) => Ct("plugin:" + te, we))
            }, null, 8, ["board-id", "draft", "schema", "options", "configs", "disabled"])), [
              [ht, i.value === "Plugins"]
            ]) : I("", !0),
            o.value && i.value === "Policy" ? (u(), h("section", um, [
              p(nc, {
                "board-id": e.boardId,
                draft: U.value,
                onValidity: K[11] || (K[11] = (te) => Ct("visibility", te))
              }, null, 8, ["board-id", "draft"])
            ])) : I("", !0)
          ], 8, dm))
        ], 544),
        i.value === "Review" && !_.value ? (u(), B(Jd, {
          key: 2,
          draft: U.value,
          original: g.value.declaration,
          disabled: C.value || se.value
        }, null, 8, ["draft", "original", "disabled"])) : I("", !0),
        i.value === "Review" && _.value && re.value.length ? (u(), B(wl, {
          key: 3,
          "board-id": e.boardId,
          draft: { plugins: re.value },
          schema: y.value ?? g.value,
          options: S.value?.schema_options.plugins.filter((te) => re.value.some((we) => we.use === te.plugin)) ?? [],
          configs: R.value,
          disabled: C.value,
          "activation-locked": "",
          onValidity: K[12] || (K[12] = (te, we) => Ct("pack-plugin:" + te, we))
        }, null, 8, ["board-id", "draft", "schema", "options", "configs", "disabled"])) : I("", !0),
        i.value === "Review" ? (u(), B(jc, {
          key: 4,
          plan: ee.value,
          generation: g.value.generation,
          follows: jt.value,
          "config-count": Object.keys(R.value).length,
          "pack-review": !!H.value
        }, {
          default: L(() => [
            H.value && _.value ? (u(), B(Jc, {
              key: 0,
              plan: H.value,
              request: _.value,
              original: g.value.declaration,
              disabled: C.value,
              onChange: K[13] || (K[13] = (te) => {
                P.value = void 0, A.value = "";
              })
            }, null, 8, ["plan", "request", "original", "disabled"])) : I("", !0)
          ]),
          _: 1
        }, 8, ["plan", "generation", "follows", "config-count", "pack-review"])) : I("", !0),
        i.value === "Review" && !ee.value ? (u(), h("p", cm, "Review your draft to see the changes, their impact and any migration required.")) : I("", !0),
        se.value ? (u(), h("p", mm, "Checking existing values and dependencies…")) : I("", !0)
      ])) : I("", !0)
    ], 2));
  }
}), fm = /* @__PURE__ */ ce({
  __name: "SettingsRoot",
  setup(e) {
    const l = Do(), t = Io();
    return co(Pl, (a) => t("navigate", { route: Fo(a) })), (a, n) => (u(), B(vm, {
      "board-id": r(l).boardId ?? "",
      embedded: r(l).embedded,
      onDirtyChange: n[0] || (n[0] = (s) => r(t)("dirty-change", { dirty: s }))
    }, null, 8, ["board-id", "embedded"]));
  }
}), pm = Ao(fm, {
  type: "object",
  properties: {
    "board-id": { type: "string", default: "", description: "Board to administer." },
    embedded: { type: "boolean", default: !1, description: "Fits in a System detail pane." }
  }
});
fo(import.meta.url, pm);
//# sourceMappingURL=settings.js.map
