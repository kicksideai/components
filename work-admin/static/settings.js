import { defineComponent as $e, computed as q, openBlock as n, createElementBlock as b, Fragment as te, renderList as se, normalizeClass as vt, toDisplayString as A, createCommentVNode as U, createBlock as H, unref as s, createElementVNode as u, inject as li, resolveDynamicComponent as ba, withCtx as W, renderSlot as lt, ref as N, useSlots as oi, createVNode as h, Transition as vo, withDirectives as ct, vShow as xt, watch as De, onMounted as ha, onUnmounted as xl, resolveComponent as mo, createTextVNode as B, onBeforeUnmount as Vt, useId as ja, withKeys as Ae, withModifiers as Ie, nextTick as Jt, normalizeStyle as ii, watchEffect as fo, reactive as ni, provide as si } from "vue";
import { e as Dt, u as ri, b as di, c as ui, a as ci } from "./mount-BvdcPcbe.js";
import "pinia";
import { m as Ua, g as ql, s as ye, h as vi, t as ze, p as Wt, i as Kt, r as Wl, w as gt, f as at, l as ua, j as zt, k as Ke, n as Ut, u as po, o as Ne, q as Le, v as bo, x as qt, y as ho, z as qa, d as go, A as ga, c as yo, B as mi, C as Ra, D as fl, E as fi, F as Lt, G as pi, _ as pl, H as bi, I as hi, J as Mt, K as ko, L as gi, M as yi, N as al, O as ki, P as Kl, Q as wi, R as Vi, a as $i, S as Gl, T as xi, U as Ci } from "./latestRequest-BY7xEq2Y.js";
import me from "primevue/select";
import _ from "primevue/button";
import { Icon as ue } from "@iconify/vue";
import { api as bl, on as Si, host as Ti, define as Ii } from "@wippy-fe/proxy";
import Ze from "primevue/tag";
import Je from "primevue/toggleswitch";
import jt from "primevue/checkbox";
import Ve from "primevue/inputtext";
import Na from "primevue/textarea";
import yt from "primevue/inputnumber";
import Cl from "primevue/selectbutton";
import Di from "primevue/message";
const ll = (e, a) => e.x > a.x && e.x < a.x + a.width && e.y > a.y && e.y < a.y + a.height;
function Ui(e, a, t) {
  return e.x === a.x ? e.x > t.x && e.x < t.x + t.width && Math.max(e.y, a.y) > t.y && Math.min(e.y, a.y) < t.y + t.height : e.y > t.y && e.y < t.y + t.height && Math.max(e.x, a.x) > t.x && Math.min(e.x, a.x) < t.x + t.width;
}
function Pt(e, a, t) {
  const l = [.../* @__PURE__ */ new Set([e.x, a.x, ...t.flatMap((V) => [V.x, V.x + V.width])])].sort((V, $) => V - $), o = [.../* @__PURE__ */ new Set([e.y, a.y, ...t.flatMap((V) => [V.y, V.y + V.height])])].sort((V, $) => V - $);
  l.unshift(l[0] - 24), l.push(l.at(-1) + 24), o.unshift(o[0] - 24), o.push(o.at(-1) + 24);
  const r = l.length, f = o.indexOf(a.y) * r + l.indexOf(a.x), p = o.indexOf(e.y) * r + l.indexOf(e.x), c = (V) => ({ x: l[V % r], y: o[Math.floor(V / r)] }), i = /* @__PURE__ */ new Map(), d = /* @__PURE__ */ new Map(), m = [];
  function y(V) {
    m.push(V);
    let $ = m.length - 1;
    for (; $; ) {
      const E = $ - 1 >> 1;
      if (m[E].priority <= V.priority) break;
      m[$] = m[E], $ = E;
    }
    m[$] = V;
  }
  function g() {
    const V = m[0], $ = m.pop();
    if (m.length) {
      let E = 0;
      for (; E * 2 + 1 < m.length; ) {
        let C = E * 2 + 1;
        if (C + 1 < m.length && m[C + 1].priority < m[C].priority && C++, $.priority <= m[C].priority) break;
        m[E] = m[C], E = C;
      }
      m[E] = $;
    }
    return V;
  }
  const x = (V) => Math.abs(V.x - a.x) + Math.abs(V.y - a.y);
  for (const V of [0, 1]) {
    const $ = p * 2 + V;
    i.set($, 0), y({ key: $, cost: 0, priority: x(e) });
  }
  const k = /* @__PURE__ */ new Map(), S = /* @__PURE__ */ new Map();
  for (; m.length; ) {
    const V = g(), $ = Math.floor(V.key / 2), E = V.key % 2;
    if (V.cost !== i.get(V.key)) continue;
    if ($ === f) {
      const K = [];
      let ce = V.key;
      for (; ce !== void 0; )
        K.push(c(Math.floor(ce / 2))), ce = d.get(ce);
      return wo(K.reverse());
    }
    const C = c($), Z = $ % r, Q = Math.floor($ / r);
    for (const [K, ce] of [[Z > 0 ? $ - 1 : -1, 0], [Z + 1 < r ? $ + 1 : -1, 0], [Q > 0 ? $ - r : -1, 1], [Q + 1 < o.length ? $ + r : -1, 1]]) {
      if (K < 0) continue;
      const ve = c(K);
      if (k.has(K) || k.set(K, !t.some((O) => ll(ve, O))), !k.get(K)) continue;
      const we = `${Math.min($, K)}:${Math.max($, K)}`;
      if (S.has(we) || S.set(we, !t.some((O) => Ui(C, ve, O))), !S.get(we)) continue;
      const ke = V.cost + Math.abs(C.x - ve.x) + Math.abs(C.y - ve.y) + (E === ce ? 0 : 18), z = K * 2 + ce;
      ke >= (i.get(z) ?? 1 / 0) || (i.set(z, ke), d.set(z, V.key), y({ key: z, cost: ke, priority: ke + x(ve) }));
    }
  }
  throw new Error("Process map has no collision-free route between its ports: " + JSON.stringify({ start: e, end: a, startInside: t.filter((V) => ll(e, V)), endInside: t.filter((V) => ll(a, V)) }));
}
function wo(e) {
  const a = [];
  for (const t of e) {
    const l = a.at(-1), o = a.at(-2);
    l && l.x === t.x && l.y === t.y || (o && l && (o.x === l.x && l.x === t.x || o.y === l.y && l.y === t.y) && a.pop(), a.push(t));
  }
  return a;
}
const la = (e) => Array.from(e).reduce((a, t) => a + (/[^\x20-\x7e]/u.test(t) ? 16 : /[MW@%]/.test(t) ? 11 : /[ilI.,:;!| ']/.test(t) ? 4 : 7.5), 0);
function Zt(e, a = 28) {
  const t = [];
  let l = "";
  for (const o of e.split(/\s+/u))
    for (let r = 0; r < o.length; r += a) {
      const f = o.slice(r, r + a);
      l && l.length + f.length + 1 > a && (t.push(l), l = ""), l = l ? l + " " + f : f;
    }
  return [...t, l].filter(Boolean);
}
function Ca(e) {
  if (e = wo(e), !e.length) return "";
  let a = `M ${e[0].x} ${e[0].y}`;
  for (let l = 1; l < e.length - 1; l++) {
    const o = e[l - 1], r = e[l], f = e[l + 1], p = Math.hypot(r.x - o.x, r.y - o.y), c = Math.hypot(f.x - r.x, f.y - r.y), i = Math.min(8, p / 3, c / 3);
    i && (a += ` L ${r.x + (o.x - r.x) * i / p} ${r.y + (o.y - r.y) * i / p} Q ${r.x} ${r.y} ${r.x + (f.x - r.x) * i / c} ${r.y + (f.y - r.y) * i / c}`);
  }
  const t = e.at(-1);
  return a + ` L ${t.x} ${t.y}`;
}
function Ei(e, a = {}, t = { width: 1400, height: 480 }) {
  const l = t.direction ?? (t.width < 750 || Ua(e).length > 8 ? "TB" : "LR"), o = t.direction === "LR" && Ua(e).length > 6, r = new ql.graphlib.Graph({ multigraph: !0 });
  r.setGraph({ rankdir: l, ranker: "network-simplex", acyclicer: "greedy", nodesep: 32, edgesep: 32, ranksep: 24, marginx: 32, marginy: 32 }), r.setDefaultEdgeLabel(() => ({}));
  const f = Ua(e), p = new Map(f.map((v, w) => [v.id, w])), c = e.states.map((v) => {
    const w = (e.transitions ?? []).filter((I) => I.from === "any" && I.to === v.id), ee = Zt(ye(v), o ? 13 : 28), P = Zt(vi(v, e), o ? 13 : 28), G = w.flatMap((I) => Zt(ze(I) + " works from any state")), R = a.policy?.wip?.[v.id]?.limit, F = R === void 0 ? 0 : la(" · limit " + R), T = Math.max(o ? 122 : 168, ...ee.map((I) => la(I) + 58), ...P.map((I, oe) => la(I) + 32 + (oe === P.length - 1 ? F : 0)), ...G.map((I) => la(I) + 32)), X = Math.max(80, 42 + ee.length * 18 + P.length * 16 + G.length * 18);
    return r.setNode(v.id, { width: T + (l === "LR" ? 36 : 0), height: X + (l === "TB" ? 36 : 0) }), { state: v, x: 0, y: 0, width: T, height: X, title: ee, caption: P, badges: w, row: p.has(v.id) ? 0 : 1 };
  }), i = new Set(c.map((v) => v.state.id)), d = (e.transitions ?? []).flatMap((v) => v.from === "any" ? [] : v.from.filter((w) => i.has(w) && i.has(v.to)).map((w) => {
    const ee = `${v.id}-${w}`, P = Zt(ze(v), o ? 12 : 28), G = Math.max(o ? 60 : 72, ...P.map((F) => la(F) + 24)), R = Math.max(24, P.length * 16 + 10);
    return { transition: v, from: w, key: ee, lines: P, width: G, height: R };
  })), m = /* @__PURE__ */ new Set(), y = /* @__PURE__ */ new Set(), g = new Set(d.filter((v) => v.from === v.transition.to || v.transition.to === e.initial || ["completed", "canceled"].includes(c.find((w) => w.state.id === v.from).state.category)).map((v) => v.key));
  function x(v) {
    if (!y.has(v)) {
      m.add(v);
      for (const w of d.filter((ee) => ee.from === v))
        g.has(w.key) || (m.has(w.transition.to) ? g.add(w.key) : x(w.transition.to));
      m.delete(v), y.add(v);
    }
  }
  x(e.initial);
  for (const v of c) x(v.state.id);
  for (const v of d) if (!g.has(v.key)) {
    const w = p.get(v.from), ee = p.get(v.transition.to);
    r.setEdge(v.from, v.transition.to, { width: v.width, height: v.height, labelpos: "c", weight: w !== void 0 && ee === w + 1 ? 100 : 1 }, v.key);
  }
  for (const v of e.transitions ?? []) if (v.from === "any" && i.has(e.initial) && i.has(v.to) && !p.has(v.to)) {
    const w = e.states.find((ee) => ee.id === v.to);
    r.setEdge(e.initial, v.to, { minlen: ["completed", "canceled"].includes(w.category) ? Math.max(1, f.length - 1) : 1 }, `any:${v.id}`);
  }
  const k = e.states.flatMap((v) => (v.regions ?? []).filter((w) => i.has(w.initial)).map((w, ee) => {
    const P = `lane:${v.id}:${ee}`;
    return r.setEdge(v.id, w.initial, {}, P), { state: v, region: w, key: P };
  }));
  if (!c.length) return { nodes: c, edges: [], parallels: [], main: f, direction: l, width: 320, height: 160 };
  ql.layout(r);
  for (const v of c) Object.assign(v, { x: r.node(v.state.id).x, y: r.node(v.state.id).y });
  const S = l === "TB", V = d.filter((v) => !g.has(v.key)).map((v) => r.edge({ v: v.from, w: v.transition.to, name: v.key })), $ = [...c, ...V], E = Math.max(...$.map((v) => v.x + v.width / 2)), C = Math.max(...$.map((v) => v.y + v.height / 2)), Z = (v) => c.find((w) => w.state.id === v), Q = d.filter((v) => g.has(v.key)).sort((v, w) => {
    const ee = S ? "y" : "x";
    return Math.abs(Z(v.from)[ee] - Z(v.transition.to)[ee]) - Math.abs(Z(w.from)[ee] - Z(w.transition.to)[ee]);
  }), K = /* @__PURE__ */ new Map(), ce = Math.max(0, ...Q.map((v) => v.width));
  let ve = C + 32;
  for (const [v, w] of Q.entries()) {
    const ee = Z(w.from), P = Z(w.transition.to), G = S ? E + 16 + ce + 28 + v * 18 : ve + w.height / 2, R = S ? E + 16 + ce / 2 : (ee.x + P.x) / 2;
    let F = S ? ee.y + ee.height / 2 + 18 : G;
    if (S) for (const T of [...K.values()].sort((X, I) => X.y - I.y))
      F + w.height / 2 + 10 > T.y - T.height / 2 - 10 && F - w.height / 2 - 10 < T.y + T.height / 2 + 10 && (F = T.y + T.height / 2 + 24 + w.height / 2);
    K.set(w.key, { x: R, y: F, corridor: G, height: w.height }), ve = G + w.height / 2 + 24;
  }
  const we = d.map((v) => ({ ...v, ...K.get(v.key) ?? r.edge({ v: v.from, w: v.transition.to, name: v.key }) })), ke = (v, w) => ({ x: v.x - v.width / 2 - w, y: v.y - v.height / 2 - w, width: v.width + w * 2, height: v.height + w * 2 }), z = [...c.map((v) => ke(v, 12)), ...we.map((v) => ke(v, 10))], O = (v, w) => ({
    start: S ? { x: v.x, y: v.y + v.height / 2 } : { x: v.x + v.width / 2, y: v.y },
    end: S ? { x: w.x, y: w.y - w.height / 2 } : { x: w.x - w.width / 2, y: w.y }
  }), L = (v, w) => S ? { x: v.x, y: v.y + w } : { x: v.x + w, y: v.y }, D = we.map((v) => {
    const w = c.find((Ue) => Ue.state.id === v.from), ee = c.find((Ue) => Ue.state.id === v.transition.to), { start: P, end: G } = O(w, ee), R = g.has(v.key), F = L(P, 18), T = L(G, -18), X = (R || !S ? v.width : v.height) / 2 + 10, I = R ? { x: v.x + (S ? -X : X), y: v.y } : L(v, -X), oe = R ? { x: v.x + (S ? X : -X), y: v.y } : L(v, X);
    let ge;
    if (R) {
      const { corridor: Ue } = K.get(v.key), pt = S ? { x: Ue, y: v.y } : { x: F.x, y: Ue }, Et = S ? { x: Ue, y: T.y } : { x: T.x, y: Ue };
      ge = S ? [
        [P, ...Pt(F, I, z)],
        [oe, pt, Et, ...Pt(Et, T, z), G]
      ] : [
        [P, ...Pt(F, pt, z), I],
        [oe, ...Pt(Et, T, z), G]
      ];
    } else ge = [
      [P, ...Pt(F, I, z)],
      [...Pt(oe, T, z), G]
    ];
    const be = R ? "return" : p.get(v.transition.to) === (p.get(v.from) ?? -2) + 1 ? "main" : "forward";
    return { ...v, points: ge.flat(), segments: ge, path: ge.map(Ca).join(" "), type: be, targetOffset: 0 };
  }), M = k.map((v) => {
    const w = c.find((F) => F.state.id === v.state.id), ee = c.find((F) => F.state.id === v.region.initial), { start: P, end: G } = O(w, ee), R = [P, ...Pt(L(P, 18), L(G, -18), z), G];
    return { state: v.state, key: v.key, points: R, path: Ca(R) };
  }), re = [...c.flatMap((v) => [{ x: v.x - v.width / 2, y: v.y - v.height / 2 }, { x: v.x + v.width / 2, y: v.y + v.height / 2 }]), ...D.flatMap((v) => [...v.points, { x: v.x - v.width / 2, y: v.y - v.height / 2 }, { x: v.x + v.width / 2, y: v.y + v.height / 2 }]), ...M.flatMap((v) => v.points)], ie = 32 - Math.min(...re.map((v) => v.x)), de = 32 - Math.min(...re.map((v) => v.y)), ne = Math.max(...re.map((v) => v.x)) + ie + 32, Se = Math.max(...re.map((v) => v.y)) + de + 32, j = (v) => ({ x: v.x + ie, y: v.y + de });
  for (const v of c) Object.assign(v, j(v));
  for (const v of D)
    Object.assign(v, j(v)), v.segments = v.segments.map((w) => w.map(j)), v.points = v.segments.flat(), v.path = v.segments.map(Ca).join(" ");
  for (const v of M)
    v.points = v.points.map(j), v.path = Ca(v.points);
  return { nodes: c, edges: D, parallels: M, main: f, direction: l, width: ne, height: Se };
}
const Ai = ["aria-label"], Oi = {
  key: 0,
  class: "kx-settings-rail-group"
}, Pi = ["aria-current", "onClick"], Ri = { class: "kx-settings-rail-label" }, Ni = /* @__PURE__ */ $e({
  __name: "SettingsRail",
  props: {
    label: {},
    value: {},
    groups: {},
    leadingItem: {}
  },
  emits: ["update:value"],
  setup(e) {
    const a = e, t = q(() => a.leadingItem ? [{ items: [a.leadingItem] }, ...a.groups] : a.groups);
    function l(o) {
      const r = [...o.currentTarget.querySelectorAll(".kx-settings-rail-item")], f = r.indexOf(o.target);
      if (f < 0) return;
      let p;
      switch (o.key) {
        case "ArrowDown":
        case "ArrowRight":
          p = (f + 1) % r.length;
          break;
        case "ArrowUp":
        case "ArrowLeft":
          p = (f + r.length - 1) % r.length;
          break;
        case "Home":
          p = 0;
          break;
        case "End":
          p = r.length - 1;
          break;
        default:
          return;
      }
      o.preventDefault(), r[p]?.focus();
    }
    return (o, r) => (n(), b("nav", {
      class: "kx-settings-rail",
      "aria-label": e.label,
      onKeydown: l
    }, [
      (n(!0), b(te, null, se(t.value, (f, p) => (n(), b("div", {
        key: f.items[0]?.value ?? p,
        class: vt(["kx-settings-rail-section", { "kx-settings-rail-leading": e.leadingItem && p === 0 }])
      }, [
        f.heading ? (n(), b("div", Oi, A(f.heading), 1)) : U("", !0),
        (n(!0), b(te, null, se(f.items, (c) => (n(), b("button", {
          key: c.value,
          type: "button",
          class: "kx-settings-rail-item",
          "aria-current": c.value === e.value ? "true" : void 0,
          onClick: (i) => o.$emit("update:value", c.value)
        }, [
          c.icon ? (n(), H(s(ue), {
            key: 0,
            class: "kx-settings-rail-icon",
            icon: c.icon,
            "aria-hidden": "true"
          }, null, 8, ["icon"])) : U("", !0),
          u("span", Ri, A(c.label), 1)
        ], 8, Pi))), 128))
      ], 2))), 128))
    ], 40, Ai));
  }
}), Vo = Symbol("work-navigation");
function Mi() {
  return li(Vo, () => {
  });
}
function Fi(e) {
  if (e.name === "boards") return "";
  const a = encodeURIComponent(e.board);
  return e.name === "settings" ? `${a}/settings` : a;
}
const Gt = (e) => `/api/v1/work/boards/${encodeURIComponent(e)}`, Hl = (e) => ({ declaration: e.declaration, expected_generation: e.expected_generation, plugin_configs: e.plugin_configs }), Ct = {
  packPlan: (e, a) => Wt(`${Gt(e)}/pack_plan`, a, "Pack plan"),
  packApply: (e, a, t) => Wt(`${Gt(e)}/pack_apply`, { ...a, key: t }, "Apply pack"),
  plan: (e, a) => Wt(`${Gt(e)}/plan_schema`, Hl(a), "Schema plan"),
  apply: (e, a, t) => Wt(`${Gt(e)}/apply_schema`, { ...Hl(a), key: t }, "Apply schema"),
  resume: (e) => Wt(`${Gt(e)}/resume_migration`, {}, "Resume migration"),
  configure: (e, a, t) => Wt(`${Gt(e)}/configure_plugin`, { plugin: a, ...t === void 0 ? {} : { config: t } }, "Configure plugin")
}, Sl = /* @__PURE__ */ $e({
  __name: "ContentAction",
  props: {
    as: { default: "button" },
    disabled: { type: Boolean },
    role: { default: "button" }
  },
  emits: ["activate"],
  setup(e, { emit: a }) {
    const t = e, l = a;
    function o(f) {
      if (t.disabled || f.defaultPrevented) return;
      const p = f.target;
      if (p instanceof Element && p !== f.currentTarget) {
        const c = p.closest('[data-work-action], button, a, input, textarea, [role="combobox"], [role="checkbox"], [role="switch"], details');
        if (c && c !== f.currentTarget) return;
      }
      l("activate", f);
    }
    function r(f) {
      f.target !== f.currentTarget || !["Enter", " "].includes(f.key) || (f.preventDefault(), t.disabled || l("activate", f));
    }
    return (f, p) => (n(), H(ba(e.as), {
      "data-work-action": "",
      class: "work-content-action",
      type: e.as === "button" ? "button" : void 0,
      role: e.role,
      tabindex: e.disabled ? -1 : 0,
      disabled: e.as === "button" ? e.disabled : void 0,
      "aria-disabled": e.disabled || void 0,
      onClick: o,
      onKeydown: r
    }, {
      default: W(() => [
        lt(f.$slots, "default")
      ]),
      _: 3
    }, 40, ["type", "role", "tabindex", "disabled", "aria-disabled"]));
  }
}), Li = { class: "work-definition" }, Bi = {
  key: 0,
  class: "work-definition-handle"
}, zi = ["title"], ji = { class: "work-definition-details" }, qi = { class: "work-definition-code" }, Wi = ["title"], Ki = { class: "work-definition-kind" }, Gi = { class: "work-definition-flags" }, Hi = { class: "work-definition-usage" }, Yi = { class: "work-definition-actions" }, Xi = {
  key: 1,
  class: "work-definition-description"
}, Ji = ["inert"], Wa = /* @__PURE__ */ $e({
  __name: "DefinitionRow",
  props: {
    title: {},
    code: {},
    kind: {},
    description: {},
    initialOpen: { type: Boolean }
  },
  setup(e) {
    const t = N(!!e.initialOpen), l = oi();
    return (o, r) => (n(), b("article", Li, [
      u("header", {
        class: vt(["work-definition-head", { "work-definition-has-handle": s(l).handle }])
      }, [
        s(l).handle ? (n(), b("div", Bi, [
          lt(o.$slots, "handle")
        ])) : U("", !0),
        h(Sl, {
          class: "work-definition-toggle",
          "aria-expanded": t.value,
          onActivate: r[0] || (r[0] = (f) => t.value = !t.value)
        }, {
          default: W(() => [
            h(s(ue), {
              icon: "tabler:chevron-right",
              "aria-hidden": "true"
            }),
            u("span", {
              class: "work-row-title",
              title: e.title
            }, A(e.title), 9, zi)
          ]),
          _: 1
        }, 8, ["aria-expanded"]),
        u("div", ji, [
          u("span", qi, [
            e.code ? (n(), b("code", {
              key: 0,
              class: "work-mono",
              title: e.code
            }, A(e.code), 9, Wi)) : U("", !0)
          ]),
          u("span", Ki, [
            e.kind ? (n(), H(s(Ze), {
              key: 0,
              severity: "secondary",
              value: e.kind
            }, null, 8, ["value"])) : U("", !0)
          ]),
          u("span", Gi, [
            lt(o.$slots, "flags")
          ]),
          u("div", Hi, [
            lt(o.$slots, "usage")
          ])
        ]),
        u("div", Yi, [
          lt(o.$slots, "actions")
        ]),
        e.description ? (n(), b("p", Xi, A(e.description), 1)) : U("", !0)
      ], 2),
      h(vo, {
        name: "work-panel",
        persisted: ""
      }, {
        default: W(() => [
          ct(u("div", {
            inert: !t.value,
            class: "work-definition-body work-stack"
          }, [
            lt(o.$slots, "default")
          ], 8, Ji), [
            [xt, t.value]
          ])
        ]),
        _: 3
      })
    ]));
  }
}), Zi = { class: "work-definition-scroll" }, Qi = {
  key: 0,
  class: "work-definition-columns",
  "aria-hidden": "true"
}, _i = {
  key: 0,
  class: "work-definition-code"
}, en = { key: 1 }, tn = {
  key: 2,
  class: "work-definition-usage"
}, Ka = /* @__PURE__ */ $e({
  __name: "DefinitionList",
  props: {
    count: {},
    columns: {}
  },
  setup(e) {
    return (a, t) => (n(), b("div", Zi, [
      u("div", {
        class: vt(["work-field-builder", "work-definitions-" + e.columns])
      }, [
        e.count > 3 ? (n(), b("div", Qi, [
          t[0] || (t[0] = u("span", null, null, -1)),
          t[1] || (t[1] = u("span", null, "Name", -1)),
          e.columns !== "plugins" ? (n(), b("span", _i, "Identifier")) : U("", !0),
          u("span", null, A(e.columns === "plugins" ? "State" : e.columns === "types" ? "Workflow" : "Kind"), 1),
          e.columns === "fields" || e.columns === "plugins" ? (n(), b("span", en, "Details")) : U("", !0),
          e.columns !== "plugins" ? (n(), b("span", tn, A(e.columns === "fields" ? "Used by" : "Details"), 1)) : U("", !0),
          t[2] || (t[2] = u("span", null, null, -1))
        ])) : U("", !0),
        lt(a.$slots, "default")
      ], 2)
    ]));
  }
}), an = [
  { code: "key", form: "text", index: "key" },
  { code: "type", form: "text", index: "key" },
  { code: "state", form: "text", index: "key" },
  { code: "category", form: "text", index: "key" },
  { code: "rank", form: "text", index: "key" },
  { code: "parent", form: "text", index: "key" },
  { code: "created_at", form: "time", index: "key" },
  { code: "updated_at", form: "time", index: "key" }
];
function ln(e) {
  const a = e.compiled.processes?.flatMap((t) => t.states.map((l) => ({ id: l.id, label: l.name }))) ?? [];
  return [...an.filter((t) => t.code !== "rank").map((t) => t.code === "state" ? { ...t, type: "option", options: a } : t.code === "category" ? { ...t, type: "option", options: ["triage", "backlog", "unstarted", "started", "completed", "canceled"].map((l) => ({ id: l })) } : t), ...(e.compiled.fields ?? []).filter((t) => t.index && t.index !== "none")];
}
function on(e) {
  if (e?.cardinality && e.cardinality !== "one") return ["has", "in", "nin", "is_null", ...e.type === "principal" ? ["member_of"] : []];
  const a = ["eq", "neq", "in", "nin", "is_null", ...e?.type === "principal" ? ["member_of"] : []];
  return e && (["int", "number", "dec", "time", "quantity"].includes(e.form ?? "") || e.index === "number") && a.push("lt", "lte", "gt", "gte", "between"), e?.form === "text" && e.type !== "option" && a.push("contains", "starts_with"), a;
}
const nn = { class: "work-field-control" }, sn = ["id"], rn = {
  key: 1,
  class: "work-stack work-tight"
}, dn = { class: "work-chips" }, un = {
  key: 5,
  class: "work-row"
}, cn = ["inert"], vn = ["value"], mn = {
  key: 1,
  class: "work-muted"
}, fn = ["inert"], pn = ["value"], bn = {
  key: 1,
  class: "work-muted"
}, hn = {
  key: 11,
  class: "work-stack work-tight"
}, gn = {
  class: "work-stack work-tight",
  "aria-label": "Matching items"
}, yn = { class: "work-mono" }, kn = {
  key: 15,
  class: "work-error work-small",
  role: "alert"
}, $o = /* @__PURE__ */ $e({
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
    const t = e, l = a, o = q(() => t.inputId ?? `field-${t.field.code}`), r = q(() => !!t.field.cardinality && t.field.cardinality !== "one"), f = q(() => Array.isArray(t.modelValue) ? t.modelValue : []), p = q(() => t.modelValue == null ? "" : typeof t.modelValue == "object" ? Kt(t.modelValue) : String(t.modelValue)), c = q(() => {
      const v = t.modelValue;
      return v && typeof v == "object" && "ref" in v && Array.isArray(v.ref) ? String(v.ref[1] ?? "") : "";
    }), i = q(() => t.disabled || Wl(t.field)), d = N(!1), m = N(!1), y = N(!1), g = N(""), x = N(""), k = N([]), S = ua(), V = N([]);
    let $ = 0, E;
    const C = /* @__PURE__ */ new Set();
    De(f, (v) => {
      V.value = E ?? v.map((w, ee) => V.value[ee] ?? $++), E = void 0;
    }, { immediate: !0 });
    function Z(v) {
      l("update:modelValue", v);
    }
    function Q(v, w) {
      const ee = [...f.value];
      ee[v] = w, Z(ee);
    }
    function K(v, w) {
      w ? C.delete(v) : C.add(v), l("validity", !C.size);
    }
    function ce(v) {
      C.delete(V.value[v]), l("validity", !C.size), E = V.value.filter((w, ee) => ee !== v), Z(f.value.filter((w, ee) => ee !== v));
    }
    function ve() {
      E = [...V.value, $++], Z([...f.value, t.field.form === "bool" ? !1 : t.field.form === "record" ? {} : ""]);
    }
    function we(v) {
      const w = v.detail, ee = w?.principal_id ?? w?.id;
      Z(ee ? { kind: w.type ?? "user", id: ee } : void 0);
    }
    function ke(v) {
      const w = v.detail;
      Z(w?.thread_id ? { ref: ["component", w.thread_id] } : void 0);
    }
    const z = N("");
    let O = "";
    De(() => t.modelValue, (v) => {
      const w = JSON.stringify(v ?? {}, null, 2);
      w !== O && (O = w, z.value = w, g.value = "", l("validity", !0));
    }, { immediate: !0 });
    function L(v) {
      z.value = v;
      try {
        const w = JSON.parse(v);
        if (!w || typeof w != "object" || Array.isArray(w)) throw new Error("Enter a JSON object.");
        if (t.field.type === "rich_text" && !("type" in w && typeof w.type == "string")) throw new Error("The document needs a type.");
        O = JSON.stringify(w, null, 2), g.value = "", l("validity", !0), Z(w);
      } catch (w) {
        g.value = w instanceof Error ? w.message : "Invalid JSON.", l("validity", !1);
      }
    }
    function D(v) {
      if (!v) {
        l("validity", !0), Z(void 0);
        return;
      }
      const w = Number.isFinite(Number(v)) && (t.field.form !== "int" || Number.isSafeInteger(Number(v)));
      l("validity", w), w && Z(t.field.form === "int" ? Number(v) : v);
    }
    const M = q(() => t.field.config?.format === "date");
    function re(v) {
      Z(v ? M.value ? v : new Date(v).toISOString() : void 0);
    }
    const ie = q(() => {
      if (typeof t.modelValue != "string") return "";
      if (M.value) return t.modelValue.slice(0, 10);
      const v = new Date(t.modelValue);
      return Number.isNaN(v.getTime()) ? "" : new Date(v.getTime() - v.getTimezoneOffset() * 6e4).toISOString().slice(0, 16);
    });
    function de(v) {
      Z(v.detail?.ref);
    }
    function ne(v) {
      Z(v.detail?.value);
    }
    let Se;
    De(x, () => {
      const v = S();
      if (clearTimeout(Se), !x.value.trim()) {
        k.value = [];
        return;
      }
      Se = setTimeout(async () => {
        try {
          const w = x.value.trim(), ee = /^[A-Z][A-Z0-9]{1,9}-[0-9]+$/.test(w) ? [(await gt.item(t.boardId, { key: w })).item] : (await gt.query(t.boardId, { where: { field: "title", op: "contains", value: w }, limit: 8 })).items;
          v() && (k.value = ee, g.value = "");
        } catch (w) {
          v() && (g.value = at(w, "Could not search items."));
        }
      }, 200);
    });
    function j(v) {
      Z({ board: t.boardId, item: v.id }), x.value = "", k.value = [];
    }
    ha(async () => {
      t.field.type === "principal" ? d.value = await Dt("wc-principal-picker") : t.field.config?.target === "component" && (d.value = await Dt("wc-component-picker"));
    });
    for (const [v, w] of [[() => t.editorTag, y], [() => t.linkTag, m]])
      De(v, async (ee, P, G) => {
        let R = !0;
        if (G(() => {
          R = !1;
        }), w.value = !1, ee) {
          const F = await Dt(ee);
          R && (w.value = F);
        }
      }, { immediate: !0 });
    return xl(() => {
      clearTimeout(Se), S();
    }), (v, w) => {
      const ee = mo("FieldControl", !0);
      return n(), b("div", nn, [
        s(Wl)(e.field) ? (n(), b("output", {
          key: 0,
          id: o.value,
          class: "work-read-value"
        }, A(s(Kt)(e.modelValue, e.field)), 9, sn)) : r.value ? (n(), b("div", rn, [
          u("div", dn, [
            (n(!0), b(te, null, se(f.value, (P, G) => (n(), H(s(Ze), {
              key: V.value[G],
              class: "kx-tag-sm",
              severity: "secondary"
            }, {
              default: W(() => [
                B(A(s(Kt)(P, e.field)) + " ", 1),
                h(s(_), {
                  type: "button",
                  class: "work-icon-button",
                  disabled: i.value,
                  "aria-label": "Remove value " + (G + 1),
                  onClick: (R) => ce(G),
                  severity: "secondary",
                  text: "",
                  size: "small"
                }, {
                  default: W(() => [
                    h(s(ue), {
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
          (n(!0), b(te, null, se(f.value, (P, G) => (n(), b("div", {
            key: V.value[G],
            class: "work-stack work-tight"
          }, [
            h(ee, {
              "board-id": e.boardId,
              field: { ...e.field, cardinality: "one" },
              "model-value": P,
              "input-id": o.value + "-" + V.value[G],
              disabled: i.value,
              "editor-tag": e.editorTag,
              "link-tag": e.linkTag,
              "onUpdate:modelValue": (R) => Q(G, R),
              onValidity: (R) => K(V.value[G], R)
            }, null, 8, ["board-id", "field", "model-value", "input-id", "disabled", "editor-tag", "link-tag", "onUpdate:modelValue", "onValidity"])
          ]))), 128)),
          h(s(_), {
            label: "Add value",
            severity: "secondary",
            size: "small",
            disabled: i.value,
            onClick: ve,
            outlined: ""
          }, {
            icon: W(() => [
              h(s(ue), {
                icon: "tabler:plus",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled"])
        ])) : e.editorTag && y.value ? (n(), H(ba(e.editorTag), {
          key: 2,
          "board-id": e.boardId,
          value: JSON.stringify(e.modelValue ?? null),
          config: JSON.stringify(e.field.config ?? {}),
          readonly: i.value || void 0,
          onChange: ne
        }, null, 40, ["board-id", "value", "config", "readonly"])) : e.linkTag && m.value ? (n(), H(ba(e.linkTag), {
          key: 3,
          "board-id": e.boardId,
          kind: e.field.config?.target ?? e.field.type,
          value: JSON.stringify(e.modelValue ?? null),
          readonly: i.value || void 0,
          onChange: de
        }, null, 40, ["board-id", "kind", "value", "readonly"])) : e.field.type === "option" ? (n(), H(s(me), {
          key: 4,
          placeholder: "Not set",
          inputId: o.value,
          "model-value": e.modelValue ?? "",
          disabled: i.value,
          "onUpdate:modelValue": w[0] || (w[0] = (P) => Z(P || void 0)),
          appendTo: "self",
          optionLabel: "label",
          optionValue: "value",
          optionDisabled: "disabled",
          options: [{ label: "Not set", value: "", disabled: !1 }, ...(e.field.options ?? []).map((P) => ({ label: P.label ?? P.id, value: P.id, disabled: !1 }))]
        }, null, 8, ["inputId", "model-value", "disabled", "options"])) : e.field.form === "bool" ? (n(), b("label", un, [
          h(s(jt), {
            inputId: o.value,
            "model-value": e.modelValue === !0,
            disabled: i.value,
            "onUpdate:modelValue": w[1] || (w[1] = (P) => Z(P)),
            binary: ""
          }, null, 8, ["inputId", "model-value", "disabled"]),
          B(A(e.modelValue === !0 ? "Yes" : e.modelValue === !1 ? "No" : "Not set"), 1)
        ])) : e.field.form === "int" ? (n(), H(s(yt), {
          key: 6,
          inputId: o.value,
          "model-value": p.value === "" ? null : Number(p.value),
          disabled: i.value,
          "onUpdate:modelValue": w[2] || (w[2] = (P) => D(P == null ? "" : String(P))),
          useGrouping: !1
        }, null, 8, ["inputId", "model-value", "disabled"])) : e.field.form === "dec" ? (n(), H(s(Ve), {
          key: 7,
          id: o.value,
          inputmode: "decimal",
          "model-value": p.value,
          disabled: i.value,
          "onUpdate:modelValue": w[3] || (w[3] = (P) => D(P ?? ""))
        }, null, 8, ["id", "model-value", "disabled"])) : e.field.form === "time" ? (n(), H(s(Ve), {
          key: 8,
          id: o.value,
          type: M.value ? "date" : "datetime-local",
          value: ie.value,
          disabled: i.value,
          onInput: w[4] || (w[4] = (P) => re(P.target.value))
        }, null, 8, ["id", "type", "value", "disabled"])) : e.field.type === "principal" ? (n(), b("div", {
          key: 9,
          inert: i.value || void 0,
          class: "work-stack work-tight"
        }, [
          d.value ? (n(), b("wc-principal-picker", {
            key: 0,
            value: JSON.stringify(e.modelValue ?? {}),
            kinds: "user,group",
            onConfigChanged: we
          }, null, 40, vn)) : (n(), b("span", mn, A(s(Kt)(e.modelValue, e.field)) + " · Person picker is unavailable.", 1))
        ], 8, cn)) : e.field.config?.target === "component" ? (n(), b("div", {
          key: 10,
          inert: i.value || void 0
        }, [
          d.value ? (n(), b("wc-component-picker", {
            key: 0,
            value: JSON.stringify({ thread_id: c.value }),
            onChange: ke
          }, null, 40, pn)) : (n(), b("span", bn, "Component picker is unavailable."))
        ], 8, fn)) : e.field.type === "item" ? (n(), b("div", hn, [
          h(s(Ze), {
            class: "kx-tag-sm",
            severity: "secondary"
          }, {
            default: W(() => [
              B(A(s(Kt)(e.modelValue, e.field)), 1)
            ]),
            _: 1
          }),
          h(s(Ve), {
            id: o.value,
            modelValue: x.value,
            "onUpdate:modelValue": w[5] || (w[5] = (P) => x.value = P),
            disabled: i.value,
            placeholder: "Search a title or enter an item key",
            "aria-label": "Search items"
          }, null, 8, ["id", "modelValue", "disabled"]),
          u("div", gn, [
            (n(!0), b(te, null, se(k.value, (P) => (n(), H(Sl, {
              key: P.id,
              class: "work-match-item",
              disabled: i.value,
              onActivate: (G) => j(P)
            }, {
              default: W(() => [
                u("code", yn, A(P.key), 1),
                u("span", null, A(s(Kt)(P.values.title)), 1)
              ]),
              _: 2
            }, 1032, ["disabled", "onActivate"]))), 128))
          ]),
          e.modelValue ? (n(), H(s(_), {
            key: 0,
            label: "Clear reference",
            severity: "secondary",
            size: "small",
            disabled: i.value,
            onClick: w[6] || (w[6] = (P) => Z(void 0)),
            outlined: ""
          }, {
            icon: W(() => [
              h(s(ue), {
                icon: "tabler:list-check",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled"])) : U("", !0)
        ])) : e.field.form === "record" || e.field.type === "rich_text" || e.field.form === "quantity" || e.field.form === "ref" ? (n(), H(s(Na), {
          key: 12,
          id: o.value,
          "model-value": z.value,
          rows: "3",
          disabled: i.value,
          "aria-invalid": !!g.value,
          "onUpdate:modelValue": w[7] || (w[7] = (P) => L(P ?? ""))
        }, null, 8, ["id", "model-value", "disabled", "aria-invalid"])) : e.field.code === "description" ? (n(), H(s(Na), {
          key: 13,
          id: o.value,
          "model-value": p.value,
          rows: "4",
          disabled: i.value,
          "onUpdate:modelValue": w[8] || (w[8] = (P) => Z(P))
        }, null, 8, ["id", "model-value", "disabled"])) : (n(), H(s(Ve), {
          key: 14,
          id: o.value,
          "model-value": p.value,
          disabled: i.value,
          "onUpdate:modelValue": w[9] || (w[9] = (P) => Z(P))
        }, null, 8, ["id", "model-value", "disabled"])),
        g.value ? (n(), b("span", kn, A(g.value), 1)) : U("", !0)
      ]);
    };
  }
}), wn = { class: "work-stack work-tight work-operand-control" }, Vn = { class: "work-row work-small" }, $n = {
  key: 1,
  class: "work-muted work-small"
}, xn = {
  key: 2,
  class: "work-stack work-tight"
}, Cn = { class: "work-small" }, Sn = {
  key: 0,
  class: "work-error work-small",
  role: "alert"
}, oa = /* @__PURE__ */ $e({
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
    const t = e, l = a, o = q(() => "$actor" in zt(t.modelValue) ? "actor" : "$now" in zt(t.modelValue) ? "now" : "literal"), r = N(""), f = N("");
    De(() => t.modelValue, (i) => {
      r.value = JSON.stringify(i ?? []), f.value = "";
    }, { immediate: !0 });
    function p(i) {
      l("update:modelValue", i === "actor" ? { $actor: "id" } : i === "now" ? { $now: "P0D" } : void 0), l("validity", !0);
    }
    function c(i) {
      r.value = i;
      try {
        const d = JSON.parse(i);
        if (!Array.isArray(d)) throw new Error("Enter a JSON list.");
        f.value = "", l("validity", !0), l("update:modelValue", d);
      } catch (d) {
        f.value = d instanceof Error ? d.message : "Invalid values.", l("validity", !1);
      }
    }
    return (i, d) => (n(), b("div", wn, [
      u("label", Vn, [
        B(A(e.label), 1),
        h(s(me), {
          "aria-label": e.label + " operand",
          "model-value": o.value,
          disabled: e.disabled,
          "onUpdate:modelValue": d[0] || (d[0] = (m) => p(m)),
          appendTo: "self",
          optionLabel: "label",
          optionValue: "value",
          optionDisabled: "disabled",
          options: [{ label: "Value", value: "literal", disabled: !1 }, { label: "Current actor ($actor)", value: "actor", disabled: !1 }, { label: "Current time ($now)", value: "now", disabled: !1 }]
        }, null, 8, ["aria-label", "model-value", "disabled"])
      ]),
      o.value === "now" ? (n(), H(s(Ve), {
        key: 0,
        "aria-label": e.label + " time offset",
        value: s(zt)(e.modelValue).$now,
        disabled: e.disabled,
        placeholder: "-P7D",
        onInput: d[1] || (d[1] = (m) => l("update:modelValue", { $now: m.target.value }))
      }, null, 8, ["aria-label", "value", "disabled"])) : o.value === "actor" ? (n(), b("span", $n, "The signed-in actor’s id")) : e.multiple ? (n(), b("div", xn, [
        u("label", Cn, [
          d[5] || (d[5] = B("Values as JSON (operands may appear in the list)", -1)),
          h(s(Na), {
            class: "work-mono",
            "aria-label": e.label + " values",
            value: r.value,
            disabled: e.disabled,
            rows: "2",
            onInput: d[2] || (d[2] = (m) => c(m.target.value))
          }, null, 8, ["aria-label", "value", "disabled"])
        ]),
        f.value ? (n(), b("p", Sn, A(f.value), 1)) : U("", !0)
      ])) : (n(), H($o, {
        key: 3,
        "board-id": e.boardId,
        field: { ...e.field, cardinality: "one" },
        "model-value": e.modelValue,
        disabled: e.disabled,
        "input-id": e.label.replace(/[^a-z0-9]/gi, "-"),
        "onUpdate:modelValue": d[3] || (d[3] = (m) => l("update:modelValue", m)),
        onValidity: d[4] || (d[4] = (m) => l("validity", m))
      }, null, 8, ["board-id", "field", "model-value", "disabled", "input-id"]))
    ]));
  }
}), Tn = ["disabled"], In = { class: "work-small work-mono" }, Dn = { class: "work-row work-small" }, Un = { class: "work-row work-wrap" }, En = { key: 3 }, An = { class: "work-row work-wrap" }, On = { class: "work-row" }, Pn = { class: "work-row" }, Rn = { class: "work-row" }, Nn = {
  key: 3,
  class: "work-row work-wrap"
}, Mn = { class: "work-row work-wrap" }, Fn = /* @__PURE__ */ $e({
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
    const t = e, l = a, o = q(() => t.path ?? "where"), r = q(() => t.depth ?? 1), f = q(() => ["and", "or", "not", "history", "match", "rel", "children"].find((z) => z in t.modelValue) ?? "field"), p = q(() => ln(t.schema)), c = q(() => p.value.find((z) => z.code === t.modelValue.field) ?? { code: "value", form: "text" }), i = q(() => zt(t.modelValue.history)), d = q(() => p.value.find((z) => z.code === i.value.field) ?? { code: "history", form: "text" }), m = q(() => Array.isArray(t.modelValue[f.value]) ? t.modelValue[f.value] : []), y = {
      eq: "Equals",
      neq: "Does not equal",
      in: "Is one of",
      nin: "Is none of",
      lt: "Less than",
      lte: "At most",
      gt: "Greater than",
      gte: "At least",
      between: "Between",
      has: "Includes",
      is_null: "Is empty",
      contains: "Contains",
      starts_with: "Starts with",
      member_of: "Is a member of"
    }, g = {
      field: "Field value",
      and: "All conditions",
      or: "Any condition",
      not: "Condition is false",
      history: "Value history",
      rel: "Linked items",
      children: "Child items",
      match: "Search text"
    }, x = () => ({ field: "category", op: "eq", value: "unstarted" }), k = N(/* @__PURE__ */ new Set());
    function S(z, O) {
      O ? k.value.delete(z) : k.value.add(z), l("validity", k.value.size === 0);
    }
    De(f, () => {
      k.value.clear(), l("validity", !0);
    });
    function V(z) {
      const O = /* @__PURE__ */ new Set();
      for (const L of k.value) {
        const D = Number(L);
        !Number.isNaN(D) && D !== z && O.add(String(D > z ? D - 1 : D));
      }
      k.value = O, l("validity", O.size === 0), E({ [f.value]: m.value.filter((L, D) => D !== z) });
    }
    function $(z) {
      l("update:modelValue", z);
    }
    function E(z) {
      $({ ...t.modelValue, ...z });
    }
    function C(z) {
      $(z === "field" ? x() : z === "and" || z === "or" ? { [z]: [x()] } : z === "not" ? { not: x() } : z === "history" ? { history: { field: "state", changed: !0 } } : z === "match" ? { match: "" } : z === "children" ? { children: !0, q: "some", where: x() } : { rel: t.schema.compiled.relation_types?.[0]?.id ?? "", dir: "outward", q: "some", where: x() });
    }
    function Z(z, O) {
      E({ [f.value]: m.value.map((L, D) => D === z ? O : L) });
    }
    function Q(z, O) {
      const L = { ...i.value };
      O === void 0 ? (delete L[z], S(z, !0)) : L[z] = O, E({ history: L });
    }
    function K(z) {
      k.value.clear(), l("validity", !0);
      const O = { ...i.value };
      delete O.was, delete O.changed, delete O.from, delete O.to, O[z] = z === "changed" ? !0 : "", E({ history: O });
    }
    const ce = { code: "actor", form: "text" }, ve = { code: "at", form: "time" }, we = q(() => Array.isArray(i.value.during) ? i.value.during : []);
    function ke(z, O) {
      const L = [...we.value];
      L[z] = O, Q("during", L);
    }
    return (z, O) => {
      const L = mo("FilterNode", !0);
      return n(), b("fieldset", {
        class: "work-filter-node",
        disabled: e.disabled
      }, [
        u("legend", In, A(o.value), 1),
        u("label", Dn, [
          O[21] || (O[21] = B("Condition", -1)),
          h(s(me), {
            "aria-label": o.value + " condition",
            "model-value": f.value,
            "onUpdate:modelValue": O[0] || (O[0] = (D) => C(D)),
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            optionDisabled: "disabled",
            options: Object.entries(g).map(([D, M]) => ({ label: M, value: D, disabled: r.value >= 6 && ["and", "or", "not", "rel", "children"].includes(D) }))
          }, null, 8, ["aria-label", "model-value", "options"])
        ]),
        f.value === "and" || f.value === "or" ? (n(), b(te, { key: 0 }, [
          (n(!0), b(te, null, se(m.value, (D, M) => (n(), b("div", {
            key: M,
            class: "work-stack work-tight"
          }, [
            h(L, {
              "board-id": e.boardId,
              schema: e.schema,
              "model-value": D,
              path: o.value + "." + f.value + "[" + M + "]",
              depth: r.value + 1,
              "onUpdate:modelValue": (re) => Z(M, re),
              onValidity: (re) => S(String(M), re)
            }, null, 8, ["board-id", "schema", "model-value", "path", "depth", "onUpdate:modelValue", "onValidity"]),
            h(s(_), {
              label: "Remove condition",
              size: "small",
              severity: "secondary",
              onClick: (re) => V(M),
              outlined: ""
            }, {
              icon: W(() => [
                h(s(ue), {
                  icon: "tabler:trash",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["onClick"])
          ]))), 128)),
          h(s(_), {
            label: "Add condition",
            size: "small",
            severity: "secondary",
            disabled: r.value >= 6,
            onClick: O[1] || (O[1] = (D) => E({ [f.value]: [...m.value, x()] })),
            outlined: ""
          }, {
            icon: W(() => [
              h(s(ue), {
                icon: "tabler:plus",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled"])
        ], 64)) : f.value === "not" ? (n(), H(L, {
          key: 1,
          "board-id": e.boardId,
          schema: e.schema,
          "model-value": s(zt)(e.modelValue.not),
          path: o.value + ".not",
          depth: r.value + 1,
          "onUpdate:modelValue": O[2] || (O[2] = (D) => E({ not: D })),
          onValidity: O[3] || (O[3] = (D) => S("nested", D))
        }, null, 8, ["board-id", "schema", "model-value", "path", "depth"])) : f.value === "field" ? (n(), b(te, { key: 2 }, [
          u("div", Un, [
            u("label", null, [
              O[22] || (O[22] = B("Field", -1)),
              h(s(me), {
                "aria-label": o.value + " field",
                "model-value": e.modelValue.field,
                "onUpdate:modelValue": O[4] || (O[4] = (D) => E({ field: D, op: "eq", value: void 0 })),
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                optionDisabled: "disabled",
                options: [...(p.value ?? []).map((D) => ({ label: s(Ke)(D), value: D.code, disabled: !1 }))]
              }, null, 8, ["aria-label", "model-value", "options"])
            ]),
            u("label", null, [
              O[23] || (O[23] = B("Comparison", -1)),
              h(s(me), {
                "aria-label": o.value + " operator",
                "model-value": e.modelValue.op,
                "onUpdate:modelValue": O[5] || (O[5] = (D) => E({ op: D, value: D === "is_null" ? !0 : void 0 })),
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                options: s(on)(c.value).map((D) => ({ value: D, label: y[D] }))
              }, null, 8, ["aria-label", "model-value", "options"])
            ])
          ]),
          h(oa, {
            "board-id": e.boardId,
            field: e.modelValue.op === "is_null" ? { code: "null", form: "bool" } : c.value,
            "model-value": e.modelValue.value,
            multiple: ["in", "nin", "between"].includes(String(e.modelValue.op)),
            label: o.value + " value",
            "onUpdate:modelValue": O[6] || (O[6] = (D) => E({ value: D })),
            onValidity: O[7] || (O[7] = (D) => S("value", D))
          }, null, 8, ["board-id", "field", "model-value", "multiple", "label"])
        ], 64)) : f.value === "match" ? (n(), b("label", En, [
          O[24] || (O[24] = B("Search", -1)),
          h(s(Ve), {
            "aria-label": o.value + " search",
            value: e.modelValue.match,
            onInput: O[8] || (O[8] = (D) => E({ match: D.target.value }))
          }, null, 8, ["aria-label", "value"])
        ])) : f.value === "history" ? (n(), b(te, { key: 4 }, [
          u("div", An, [
            u("label", null, [
              O[25] || (O[25] = B("Field", -1)),
              h(s(me), {
                "aria-label": o.value + " history field",
                "model-value": i.value.field,
                "onUpdate:modelValue": O[9] || (O[9] = (D) => Q("field", D)),
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                optionDisabled: "disabled",
                options: [...(p.value ?? []).map((D) => ({ label: s(Ke)(D), value: D.code, disabled: !1 }))]
              }, null, 8, ["aria-label", "model-value", "options"])
            ]),
            u("label", null, [
              O[26] || (O[26] = B("History", -1)),
              h(s(me), {
                "aria-label": o.value + " history mode",
                "model-value": i.value.changed ? "changed" : "was",
                "onUpdate:modelValue": O[10] || (O[10] = (D) => K(D)),
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                optionDisabled: "disabled",
                options: [{ label: "Changed", value: "changed", disabled: !1 }, { label: "Was", value: "was", disabled: !1 }]
              }, null, 8, ["aria-label", "model-value"])
            ])
          ]),
          i.value.changed ? (n(), b(te, { key: 0 }, se(["from", "to"], (D) => u("div", { key: D }, [
            u("label", On, [
              h(s(jt), {
                "model-value": D in i.value,
                "aria-label": "Constrain " + D,
                "onUpdate:modelValue": (M) => Q(D, M ? "" : void 0),
                binary: ""
              }, null, 8, ["model-value", "aria-label", "onUpdate:modelValue"]),
              B(A(D), 1)
            ]),
            D in i.value ? (n(), H(oa, {
              key: 0,
              "board-id": e.boardId,
              field: d.value,
              "model-value": i.value[D],
              label: o.value + " history " + D,
              "onUpdate:modelValue": (M) => Q(D, M),
              onValidity: (M) => S(D, M)
            }, null, 8, ["board-id", "field", "model-value", "label", "onUpdate:modelValue", "onValidity"])) : U("", !0)
          ])), 64)) : (n(), H(oa, {
            key: 1,
            "board-id": e.boardId,
            field: d.value,
            "model-value": i.value.was,
            label: o.value + " history was",
            "onUpdate:modelValue": O[11] || (O[11] = (D) => Q("was", D)),
            onValidity: O[12] || (O[12] = (D) => S("was", D))
          }, null, 8, ["board-id", "field", "model-value", "label"])),
          u("label", Pn, [
            h(s(jt), {
              "model-value": "by" in i.value,
              "aria-label": "Constrain actor",
              "onUpdate:modelValue": O[13] || (O[13] = (D) => Q("by", D ? { $actor: "id" } : void 0)),
              binary: ""
            }, null, 8, ["model-value"]),
            O[27] || (O[27] = B("By actor", -1))
          ]),
          "by" in i.value ? (n(), H(oa, {
            key: 2,
            "board-id": e.boardId,
            field: ce,
            "model-value": i.value.by,
            label: o.value + " history by",
            "onUpdate:modelValue": O[14] || (O[14] = (D) => Q("by", D))
          }, null, 8, ["board-id", "model-value", "label"])) : U("", !0),
          u("label", Rn, [
            h(s(jt), {
              "model-value": "during" in i.value,
              "aria-label": "Constrain time window",
              "onUpdate:modelValue": O[15] || (O[15] = (D) => Q("during", D ? [{ $now: "-P30D" }, { $now: "P0D" }] : void 0)),
              binary: ""
            }, null, 8, ["model-value"]),
            O[28] || (O[28] = B("During", -1))
          ]),
          "during" in i.value ? (n(), b("div", Nn, [
            (n(), b(te, null, se(["start", "end"], (D, M) => h(oa, {
              key: D,
              "board-id": e.boardId,
              field: ve,
              "model-value": we.value[M],
              label: o.value + " during " + D,
              "onUpdate:modelValue": (re) => ke(M, re)
            }, null, 8, ["board-id", "model-value", "label", "onUpdate:modelValue"])), 64))
          ])) : U("", !0)
        ], 64)) : (n(), b(te, { key: 5 }, [
          u("div", Mn, [
            f.value === "rel" ? (n(), b(te, { key: 0 }, [
              u("label", null, [
                O[29] || (O[29] = B("Relation", -1)),
                h(s(me), {
                  "model-value": e.modelValue.rel,
                  "onUpdate:modelValue": O[16] || (O[16] = (D) => E({ rel: D })),
                  appendTo: "self",
                  optionLabel: "label",
                  optionValue: "value",
                  optionDisabled: "disabled",
                  options: [...(e.schema.compiled.relation_types ?? []).map((D) => ({ label: D.outward ?? D.id, value: D.id, disabled: !1 }))]
                }, null, 8, ["model-value", "options"])
              ]),
              u("label", null, [
                O[30] || (O[30] = B("Direction", -1)),
                h(s(me), {
                  "model-value": e.modelValue.dir,
                  "onUpdate:modelValue": O[17] || (O[17] = (D) => E({ dir: D })),
                  appendTo: "self",
                  optionLabel: "label",
                  optionValue: "value",
                  optionDisabled: "disabled",
                  options: [{ label: "Outward", value: "outward", disabled: !1 }, { label: "Inward", value: "inward", disabled: !1 }]
                }, null, 8, ["model-value"])
              ])
            ], 64)) : U("", !0),
            u("label", null, [
              O[31] || (O[31] = B("Quantifier", -1)),
              h(s(me), {
                "model-value": e.modelValue.q,
                "onUpdate:modelValue": O[18] || (O[18] = (D) => E({ q: D })),
                appendTo: "self",
                options: ["some", "every", "none"]
              }, null, 8, ["model-value"])
            ])
          ]),
          h(L, {
            "board-id": e.boardId,
            schema: e.schema,
            "model-value": s(zt)(e.modelValue.where),
            path: o.value + ".where",
            depth: r.value + 1,
            "onUpdate:modelValue": O[19] || (O[19] = (D) => E({ where: D })),
            onValidity: O[20] || (O[20] = (D) => S("nested", D))
          }, null, 8, ["board-id", "schema", "model-value", "path", "depth"])
        ], 64))
      ], 8, Tn);
    };
  }
}), Ln = { class: "work-stack work-tight" }, Bn = { class: "work-row work-small" }, Tl = /* @__PURE__ */ $e({
  __name: "ConditionEditor",
  props: {
    modelValue: {},
    draft: {},
    boardId: {},
    label: {}
  },
  emits: ["update:modelValue", "validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = q(() => ({ declaration: t.draft, compiled: t.draft, generation: 0, as_of: 0, key_prefix: "" })), r = /* @__PURE__ */ new Set();
    function f(c, i) {
      i ? r.delete(c) : r.add(c), l("validity", !r.size);
    }
    function p(c) {
      l("update:modelValue", c ? { field: t.draft.fields?.[0]?.code ?? "state", op: "eq" } : void 0), c || (r.clear(), l("validity", !0));
    }
    return Vt(() => l("validity", !0)), (c, i) => (n(), b("section", Ln, [
      u("label", Bn, [
        h(s(Je), {
          "model-value": e.modelValue != null,
          "aria-label": e.label,
          "onUpdate:modelValue": p
        }, null, 8, ["model-value", "aria-label"]),
        B(A(e.label), 1)
      ]),
      e.modelValue != null ? (n(), H(Fn, {
        key: 0,
        schema: o.value,
        "board-id": e.boardId ?? "",
        "model-value": s(zt)(e.modelValue),
        path: e.label,
        "onUpdate:modelValue": i[0] || (i[0] = (d) => l("update:modelValue", d)),
        onValidity: i[1] || (i[1] = (d) => f("structured", d))
      }, null, 8, ["schema", "board-id", "model-value", "path"])) : U("", !0),
      e.modelValue != null ? (n(), H(Ut, {
        key: 1,
        label: e.label + " predicate",
        "model-value": e.modelValue,
        hint: "Use any predicate accepted by Work, including installed or deeply nested forms.",
        "onUpdate:modelValue": i[2] || (i[2] = (d) => l("update:modelValue", d)),
        onValidity: i[3] || (i[3] = (d) => f("raw", d))
      }, null, 8, ["label", "model-value"])) : U("", !0)
    ]));
  }
}), zn = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, jn = ["aria-label"], qn = { class: "work-field-label" }, Wn = {
  key: 0,
  class: "work-chips"
}, Kn = ["kinds"], Gn = {
  key: 2,
  class: "work-muted work-small"
}, Il = /* @__PURE__ */ $e({
  __name: "PrincipalsPicker",
  props: {
    modelValue: {},
    label: {},
    kinds: {},
    boardId: {}
  },
  emits: ["update:modelValue"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = N(!1), r = N(0), f = q(() => t.modelValue ?? []), { principalLabel: p, rememberPrincipal: c, nameError: i } = po(() => t.boardId ?? "", () => f.value);
    ha(async () => {
      o.value = await Dt("wc-principal-picker");
    });
    function d(m) {
      const y = m.detail, g = y?.principal_id ?? y?.id;
      if (!g) return;
      const x = { kind: y.type ?? "user", id: g };
      y.label && c(x, y.label), f.value.some((k) => k.id === g && k.kind === x.kind) || l("update:modelValue", [...f.value, x]), r.value++;
    }
    return (m, y) => (n(), b(te, null, [
      s(i) ? (n(), b("p", zn, A(s(i)), 1)) : U("", !0),
      u("section", {
        class: "work-stack work-tight work-principals-picker",
        "aria-label": e.label
      }, [
        u("h4", qn, A(e.label), 1),
        f.value.length ? (n(), b("div", Wn, [
          (n(!0), b(te, null, se(f.value, (g, x) => (n(), H(s(Ze), {
            key: g.kind + g.id,
            severity: "secondary",
            class: "kx-tag-sm"
          }, {
            default: W(() => [
              B(A(s(p)(g)), 1),
              h(s(_), {
                text: "",
                severity: "secondary",
                size: "small",
                "aria-label": "Remove " + s(p)(g),
                onClick: (k) => l("update:modelValue", f.value.filter((S, V) => V !== x))
              }, {
                default: W(() => [
                  h(s(ue), { icon: "tabler:x" })
                ]),
                _: 1
              }, 8, ["aria-label", "onClick"])
            ]),
            _: 2
          }, 1024))), 128))
        ])) : U("", !0),
        o.value ? (n(), b("wc-principal-picker", {
          key: r.value,
          kinds: e.kinds ?? "user,group",
          onConfigChanged: d
        }, null, 40, Kn)) : (n(), b("p", Gn, "People and group picker is unavailable."))
      ], 8, jn)
    ], 64));
  }
}), Hn = { class: "work-stack work-tight" }, xo = /* @__PURE__ */ $e({
  __name: "HoldersPicker",
  props: {
    modelValue: {},
    label: {},
    boardId: {}
  },
  emits: ["update:modelValue", "validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = q(() => (t.modelValue ?? []).flatMap((f) => "user" in f ? [{ kind: "user", id: f.user }] : "group" in f ? [{ kind: "group", id: f.group }] : []));
    function r(f) {
      const p = [...(t.modelValue ?? []).filter((c) => "field" in c || "service" in c), ...f.map((c) => c.kind === "group" ? { group: c.id } : { user: c.id })];
      l("update:modelValue", p.length ? p : void 0);
    }
    return (f, p) => (n(), b("div", Hn, [
      h(Il, {
        "board-id": e.boardId,
        label: e.label,
        "model-value": o.value,
        "onUpdate:modelValue": r
      }, null, 8, ["board-id", "label", "model-value"]),
      h(Ut, {
        label: e.label + " rules",
        "model-value": e.modelValue,
        shape: "array",
        example: [{ group: "selected-group" }],
        "onUpdate:modelValue": p[0] || (p[0] = (c) => l("update:modelValue", c)),
        onValidity: p[1] || (p[1] = (c) => l("validity", c))
      }, null, 8, ["label", "model-value"])
    ]));
  }
}), Yn = ["disabled"], Xn = { class: "work-chips" }, Jn = {
  key: 1,
  class: "work-muted work-small"
}, ut = /* @__PURE__ */ $e({
  __name: "ChipPicker",
  props: {
    label: {},
    options: {},
    modelValue: {},
    disabled: { type: Boolean }
  },
  emits: ["update:modelValue"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = N(""), r = q(() => t.options.map((c) => typeof c == "string" ? { value: c } : c)), f = q(() => r.value.filter((c) => (c.label ?? Ne(c.value)).toLocaleLowerCase().includes(o.value.toLocaleLowerCase())));
    function p(c) {
      if (t.disabled) return;
      const i = t.modelValue ?? [];
      l("update:modelValue", i.includes(c) ? i.filter((d) => d !== c) : [...i, c]);
    }
    return (c, i) => (n(), b("fieldset", {
      class: "work-chip-picker",
      disabled: e.disabled
    }, [
      u("legend", null, A(e.label), 1),
      e.options.length > 10 ? (n(), H(s(Ve), {
        key: 0,
        modelValue: o.value,
        "onUpdate:modelValue": i[0] || (i[0] = (d) => o.value = d),
        type: "search",
        "aria-label": "Find " + e.label.toLowerCase(),
        placeholder: "Find a choice…"
      }, null, 8, ["modelValue", "aria-label"])) : U("", !0),
      u("div", Xn, [
        h(s(Cl), {
          "model-value": e.modelValue ?? [],
          options: f.value.map((d) => ({ value: d.value, label: d.label ?? s(Ne)(d.value) })),
          optionLabel: "label",
          optionValue: "value",
          multiple: "",
          disabled: e.disabled,
          "aria-label": e.label,
          "onUpdate:modelValue": i[1] || (i[1] = (d) => l("update:modelValue", d ?? []))
        }, null, 8, ["model-value", "options", "disabled", "aria-label"]),
        (n(!0), b(te, null, se(e.modelValue?.filter((d) => !r.value.some((m) => m.value === d)) ?? [], (d) => (n(), H(s(_), {
          severity: "secondary",
          text: "",
          size: "small",
          key: d,
          type: "button",
          class: "work-choice work-unavailable",
          "aria-label": "Remove unavailable " + d,
          onClick: (m) => p(d)
        }, {
          default: W(() => [
            B(A(s(Ne)(d)) + " · unavailable ×", 1)
          ]),
          _: 2
        }, 1032, ["aria-label", "onClick"]))), 128))
      ]),
      e.options.length ? U("", !0) : (n(), b("span", Jn, "No choices declared."))
    ], 8, Yn));
  }
});
/**!
 * Sortable 1.15.7
 * @author	RubaXa   <trash@rubaxa.org>
 * @author	owenm    <owen23355@gmail.com>
 * @license MIT
 */
function Zn(e, a, t) {
  return (a = ts(a)) in e ? Object.defineProperty(e, a, {
    value: t,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : e[a] = t, e;
}
function wt() {
  return wt = Object.assign ? Object.assign.bind() : function(e) {
    for (var a = 1; a < arguments.length; a++) {
      var t = arguments[a];
      for (var l in t) ({}).hasOwnProperty.call(t, l) && (e[l] = t[l]);
    }
    return e;
  }, wt.apply(null, arguments);
}
function Yl(e, a) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(e);
    a && (l = l.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), t.push.apply(t, l);
  }
  return t;
}
function ft(e) {
  for (var a = 1; a < arguments.length; a++) {
    var t = arguments[a] != null ? arguments[a] : {};
    a % 2 ? Yl(Object(t), !0).forEach(function(l) {
      Zn(e, l, t[l]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : Yl(Object(t)).forEach(function(l) {
      Object.defineProperty(e, l, Object.getOwnPropertyDescriptor(t, l));
    });
  }
  return e;
}
function Qn(e, a) {
  if (e == null) return {};
  var t, l, o = _n(e, a);
  if (Object.getOwnPropertySymbols) {
    var r = Object.getOwnPropertySymbols(e);
    for (l = 0; l < r.length; l++) t = r[l], a.indexOf(t) === -1 && {}.propertyIsEnumerable.call(e, t) && (o[t] = e[t]);
  }
  return o;
}
function _n(e, a) {
  if (e == null) return {};
  var t = {};
  for (var l in e) if ({}.hasOwnProperty.call(e, l)) {
    if (a.indexOf(l) !== -1) continue;
    t[l] = e[l];
  }
  return t;
}
function es(e, a) {
  if (typeof e != "object" || !e) return e;
  var t = e[Symbol.toPrimitive];
  if (t !== void 0) {
    var l = t.call(e, a);
    if (typeof l != "object") return l;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (a === "string" ? String : Number)(e);
}
function ts(e) {
  var a = es(e, "string");
  return typeof a == "symbol" ? a : a + "";
}
function hl(e) {
  "@babel/helpers - typeof";
  return hl = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(a) {
    return typeof a;
  } : function(a) {
    return a && typeof Symbol == "function" && a.constructor === Symbol && a !== Symbol.prototype ? "symbol" : typeof a;
  }, hl(e);
}
var as = "1.15.7";
function kt(e) {
  if (typeof window < "u" && window.navigator)
    return !!/* @__PURE__ */ navigator.userAgent.match(e);
}
var $t = kt(/(?:Trident.*rv[ :]?11\.|msie|iemobile|Windows Phone)/i), ya = kt(/Edge/i), Xl = kt(/firefox/i), ca = kt(/safari/i) && !kt(/chrome/i) && !kt(/android/i), Dl = kt(/iP(ad|od|hone)/i), Co = kt(/chrome/i) && kt(/android/i), So = {
  capture: !1,
  passive: !1
};
function Ce(e, a, t) {
  e.addEventListener(a, t, !$t && So);
}
function xe(e, a, t) {
  e.removeEventListener(a, t, !$t && So);
}
function Ma(e, a) {
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
function To(e) {
  return e.host && e !== document && e.host.nodeType && e.host !== e ? e.host : e.parentNode;
}
function dt(e, a, t, l) {
  if (e) {
    t = t || document;
    do {
      if (a != null && (a[0] === ">" ? e.parentNode === t && Ma(e, a) : Ma(e, a)) || l && e === t)
        return e;
      if (e === t) break;
    } while (e = To(e));
  }
  return null;
}
var Jl = /\s+/g;
function Qe(e, a, t) {
  if (e && a)
    if (e.classList)
      e.classList[t ? "add" : "remove"](a);
    else {
      var l = (" " + e.className + " ").replace(Jl, " ").replace(" " + a + " ", " ");
      e.className = (l + (t ? " " + a : "")).replace(Jl, " ");
    }
}
function fe(e, a, t) {
  var l = e && e.style;
  if (l) {
    if (t === void 0)
      return document.defaultView && document.defaultView.getComputedStyle ? t = document.defaultView.getComputedStyle(e, "") : e.currentStyle && (t = e.currentStyle), a === void 0 ? t : t[a];
    !(a in l) && a.indexOf("webkit") === -1 && (a = "-webkit-" + a), l[a] = t + (typeof t == "string" ? "" : "px");
  }
}
function _t(e, a) {
  var t = "";
  if (typeof e == "string")
    t = e;
  else
    do {
      var l = fe(e, "transform");
      l && l !== "none" && (t = l + " " + t);
    } while (!a && (e = e.parentNode));
  var o = window.DOMMatrix || window.WebKitCSSMatrix || window.CSSMatrix || window.MSCSSMatrix;
  return o && new o(t);
}
function Io(e, a, t) {
  if (e) {
    var l = e.getElementsByTagName(a), o = 0, r = l.length;
    if (t)
      for (; o < r; o++)
        t(l[o], o);
    return l;
  }
  return [];
}
function mt() {
  var e = document.scrollingElement;
  return e || document.documentElement;
}
function Fe(e, a, t, l, o) {
  if (!(!e.getBoundingClientRect && e !== window)) {
    var r, f, p, c, i, d, m;
    if (e !== window && e.parentNode && e !== mt() ? (r = e.getBoundingClientRect(), f = r.top, p = r.left, c = r.bottom, i = r.right, d = r.height, m = r.width) : (f = 0, p = 0, c = window.innerHeight, i = window.innerWidth, d = window.innerHeight, m = window.innerWidth), (a || t) && e !== window && (o = o || e.parentNode, !$t))
      do
        if (o && o.getBoundingClientRect && (fe(o, "transform") !== "none" || t && fe(o, "position") !== "static")) {
          var y = o.getBoundingClientRect();
          f -= y.top + parseInt(fe(o, "border-top-width")), p -= y.left + parseInt(fe(o, "border-left-width")), c = f + r.height, i = p + r.width;
          break;
        }
      while (o = o.parentNode);
    if (l && e !== window) {
      var g = _t(o || e), x = g && g.a, k = g && g.d;
      g && (f /= k, p /= x, m /= x, d /= k, c = f + d, i = p + m);
    }
    return {
      top: f,
      left: p,
      bottom: c,
      right: i,
      width: m,
      height: d
    };
  }
}
function Zl(e, a, t) {
  for (var l = It(e, !0), o = Fe(e)[a]; l; ) {
    var r = Fe(l)[t], f = void 0;
    if (f = o >= r, !f) return l;
    if (l === mt()) break;
    l = It(l, !1);
  }
  return !1;
}
function ea(e, a, t, l) {
  for (var o = 0, r = 0, f = e.children; r < f.length; ) {
    if (f[r].style.display !== "none" && f[r] !== pe.ghost && (l || f[r] !== pe.dragged) && dt(f[r], t.draggable, e, !1)) {
      if (o === a)
        return f[r];
      o++;
    }
    r++;
  }
  return null;
}
function Ul(e, a) {
  for (var t = e.lastElementChild; t && (t === pe.ghost || fe(t, "display") === "none" || a && !Ma(t, a)); )
    t = t.previousElementSibling;
  return t || null;
}
function tt(e, a) {
  var t = 0;
  if (!e || !e.parentNode)
    return -1;
  for (; e = e.previousElementSibling; )
    e.nodeName.toUpperCase() !== "TEMPLATE" && e !== pe.clone && (!a || Ma(e, a)) && t++;
  return t;
}
function Ql(e) {
  var a = 0, t = 0, l = mt();
  if (e)
    do {
      var o = _t(e), r = o.a, f = o.d;
      a += e.scrollLeft * r, t += e.scrollTop * f;
    } while (e !== l && (e = e.parentNode));
  return [a, t];
}
function ls(e, a) {
  for (var t in e)
    if (e.hasOwnProperty(t)) {
      for (var l in a)
        if (a.hasOwnProperty(l) && a[l] === e[t][l]) return Number(t);
    }
  return -1;
}
function It(e, a) {
  if (!e || !e.getBoundingClientRect) return mt();
  var t = e, l = !1;
  do
    if (t.clientWidth < t.scrollWidth || t.clientHeight < t.scrollHeight) {
      var o = fe(t);
      if (t.clientWidth < t.scrollWidth && (o.overflowX == "auto" || o.overflowX == "scroll") || t.clientHeight < t.scrollHeight && (o.overflowY == "auto" || o.overflowY == "scroll")) {
        if (!t.getBoundingClientRect || t === document.body) return mt();
        if (l || a) return t;
        l = !0;
      }
    }
  while (t = t.parentNode);
  return mt();
}
function os(e, a) {
  if (e && a)
    for (var t in a)
      a.hasOwnProperty(t) && (e[t] = a[t]);
  return e;
}
function ol(e, a) {
  return Math.round(e.top) === Math.round(a.top) && Math.round(e.left) === Math.round(a.left) && Math.round(e.height) === Math.round(a.height) && Math.round(e.width) === Math.round(a.width);
}
var va;
function Do(e, a) {
  return function() {
    if (!va) {
      var t = arguments, l = this;
      t.length === 1 ? e.call(l, t[0]) : e.apply(l, t), va = setTimeout(function() {
        va = void 0;
      }, a);
    }
  };
}
function is() {
  clearTimeout(va), va = void 0;
}
function Uo(e, a, t) {
  e.scrollLeft += a, e.scrollTop += t;
}
function Eo(e) {
  var a = window.Polymer, t = window.jQuery || window.Zepto;
  return a && a.dom ? a.dom(e).cloneNode(!0) : t ? t(e).clone(!0)[0] : e.cloneNode(!0);
}
function Ao(e, a, t) {
  var l = {};
  return Array.from(e.children).forEach(function(o) {
    var r, f, p, c;
    if (!(!dt(o, a.draggable, e, !1) || o.animated || o === t)) {
      var i = Fe(o);
      l.left = Math.min((r = l.left) !== null && r !== void 0 ? r : 1 / 0, i.left), l.top = Math.min((f = l.top) !== null && f !== void 0 ? f : 1 / 0, i.top), l.right = Math.max((p = l.right) !== null && p !== void 0 ? p : -1 / 0, i.right), l.bottom = Math.max((c = l.bottom) !== null && c !== void 0 ? c : -1 / 0, i.bottom);
    }
  }), l.width = l.right - l.left, l.height = l.bottom - l.top, l.x = l.left, l.y = l.top, l;
}
var Xe = "Sortable" + (/* @__PURE__ */ new Date()).getTime();
function ns() {
  var e = [], a;
  return {
    captureAnimationState: function() {
      if (e = [], !!this.options.animation) {
        var l = [].slice.call(this.el.children);
        l.forEach(function(o) {
          if (!(fe(o, "display") === "none" || o === pe.ghost)) {
            e.push({
              target: o,
              rect: Fe(o)
            });
            var r = ft({}, e[e.length - 1].rect);
            if (o.thisAnimationDuration) {
              var f = _t(o, !0);
              f && (r.top -= f.f, r.left -= f.e);
            }
            o.fromRect = r;
          }
        });
      }
    },
    addAnimationState: function(l) {
      e.push(l);
    },
    removeAnimationState: function(l) {
      e.splice(ls(e, {
        target: l
      }), 1);
    },
    animateAll: function(l) {
      var o = this;
      if (!this.options.animation) {
        clearTimeout(a), typeof l == "function" && l();
        return;
      }
      var r = !1, f = 0;
      e.forEach(function(p) {
        var c = 0, i = p.target, d = i.fromRect, m = Fe(i), y = i.prevFromRect, g = i.prevToRect, x = p.rect, k = _t(i, !0);
        k && (m.top -= k.f, m.left -= k.e), i.toRect = m, i.thisAnimationDuration && ol(y, m) && !ol(d, m) && // Make sure animatingRect is on line between toRect & fromRect
        (x.top - m.top) / (x.left - m.left) === (d.top - m.top) / (d.left - m.left) && (c = rs(x, y, g, o.options)), ol(m, d) || (i.prevFromRect = d, i.prevToRect = m, c || (c = o.options.animation), o.animate(i, x, m, c)), c && (r = !0, f = Math.max(f, c), clearTimeout(i.animationResetTimer), i.animationResetTimer = setTimeout(function() {
          i.animationTime = 0, i.prevFromRect = null, i.fromRect = null, i.prevToRect = null, i.thisAnimationDuration = null;
        }, c), i.thisAnimationDuration = c);
      }), clearTimeout(a), r ? a = setTimeout(function() {
        typeof l == "function" && l();
      }, f) : typeof l == "function" && l(), e = [];
    },
    animate: function(l, o, r, f) {
      if (f) {
        fe(l, "transition", ""), fe(l, "transform", "");
        var p = _t(this.el), c = p && p.a, i = p && p.d, d = (o.left - r.left) / (c || 1), m = (o.top - r.top) / (i || 1);
        l.animatingX = !!d, l.animatingY = !!m, fe(l, "transform", "translate3d(" + d + "px," + m + "px,0)"), this.forRepaintDummy = ss(l), fe(l, "transition", "transform " + f + "ms" + (this.options.easing ? " " + this.options.easing : "")), fe(l, "transform", "translate3d(0,0,0)"), typeof l.animated == "number" && clearTimeout(l.animated), l.animated = setTimeout(function() {
          fe(l, "transition", ""), fe(l, "transform", ""), l.animated = !1, l.animatingX = !1, l.animatingY = !1;
        }, f);
      }
    }
  };
}
function ss(e) {
  return e.offsetWidth;
}
function rs(e, a, t, l) {
  return Math.sqrt(Math.pow(a.top - e.top, 2) + Math.pow(a.left - e.left, 2)) / Math.sqrt(Math.pow(a.top - t.top, 2) + Math.pow(a.left - t.left, 2)) * l.animation;
}
var Ht = [], il = {
  initializeByDefault: !0
}, ka = {
  mount: function(a) {
    for (var t in il)
      il.hasOwnProperty(t) && !(t in a) && (a[t] = il[t]);
    Ht.forEach(function(l) {
      if (l.pluginName === a.pluginName)
        throw "Sortable: Cannot mount plugin ".concat(a.pluginName, " more than once");
    }), Ht.push(a);
  },
  pluginEvent: function(a, t, l) {
    var o = this;
    this.eventCanceled = !1, l.cancel = function() {
      o.eventCanceled = !0;
    };
    var r = a + "Global";
    Ht.forEach(function(f) {
      t[f.pluginName] && (t[f.pluginName][r] && t[f.pluginName][r](ft({
        sortable: t
      }, l)), t.options[f.pluginName] && t[f.pluginName][a] && t[f.pluginName][a](ft({
        sortable: t
      }, l)));
    });
  },
  initializePlugins: function(a, t, l, o) {
    Ht.forEach(function(p) {
      var c = p.pluginName;
      if (!(!a.options[c] && !p.initializeByDefault)) {
        var i = new p(a, t, a.options);
        i.sortable = a, i.options = a.options, a[c] = i, wt(l, i.defaults);
      }
    });
    for (var r in a.options)
      if (a.options.hasOwnProperty(r)) {
        var f = this.modifyOption(a, r, a.options[r]);
        typeof f < "u" && (a.options[r] = f);
      }
  },
  getEventProperties: function(a, t) {
    var l = {};
    return Ht.forEach(function(o) {
      typeof o.eventProperties == "function" && wt(l, o.eventProperties.call(t[o.pluginName], a));
    }), l;
  },
  modifyOption: function(a, t, l) {
    var o;
    return Ht.forEach(function(r) {
      a[r.pluginName] && r.optionListeners && typeof r.optionListeners[t] == "function" && (o = r.optionListeners[t].call(a[r.pluginName], l));
    }), o;
  }
};
function ds(e) {
  var a = e.sortable, t = e.rootEl, l = e.name, o = e.targetEl, r = e.cloneEl, f = e.toEl, p = e.fromEl, c = e.oldIndex, i = e.newIndex, d = e.oldDraggableIndex, m = e.newDraggableIndex, y = e.originalEvent, g = e.putSortable, x = e.extraEventProperties;
  if (a = a || t && t[Xe], !!a) {
    var k, S = a.options, V = "on" + l.charAt(0).toUpperCase() + l.substr(1);
    window.CustomEvent && !$t && !ya ? k = new CustomEvent(l, {
      bubbles: !0,
      cancelable: !0
    }) : (k = document.createEvent("Event"), k.initEvent(l, !0, !0)), k.to = f || t, k.from = p || t, k.item = o || t, k.clone = r, k.oldIndex = c, k.newIndex = i, k.oldDraggableIndex = d, k.newDraggableIndex = m, k.originalEvent = y, k.pullMode = g ? g.lastPutMode : void 0;
    var $ = ft(ft({}, x), ka.getEventProperties(l, a));
    for (var E in $)
      k[E] = $[E];
    t && t.dispatchEvent(k), S[V] && S[V].call(a, k);
  }
}
var us = ["evt"], Ye = function(a, t) {
  var l = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, o = l.evt, r = Qn(l, us);
  ka.pluginEvent.bind(pe)(a, t, ft({
    dragEl: ae,
    parentEl: Re,
    ghostEl: he,
    rootEl: Ee,
    nextEl: Ft,
    lastDownEl: Ea,
    cloneEl: Oe,
    cloneHidden: Tt,
    dragStarted: ia,
    putSortable: qe,
    activeSortable: pe.active,
    originalEvent: o,
    oldIndex: Qt,
    oldDraggableIndex: ma,
    newIndex: _e,
    newDraggableIndex: St,
    hideGhostForTarget: No,
    unhideGhostForTarget: Mo,
    cloneNowHidden: function() {
      Tt = !0;
    },
    cloneNowShown: function() {
      Tt = !1;
    },
    dispatchSortableEvent: function(p) {
      Ge({
        sortable: t,
        name: p,
        originalEvent: o
      });
    }
  }, r));
};
function Ge(e) {
  ds(ft({
    putSortable: qe,
    cloneEl: Oe,
    targetEl: ae,
    rootEl: Ee,
    oldIndex: Qt,
    oldDraggableIndex: ma,
    newIndex: _e,
    newDraggableIndex: St
  }, e));
}
var ae, Re, he, Ee, Ft, Ea, Oe, Tt, Qt, _e, ma, St, Sa, qe, Xt = !1, Fa = !1, La = [], Rt, rt, nl, sl, _l, eo, ia, Yt, fa, pa = !1, Ta = !1, Aa, We, rl = [], gl = !1, Ba = [], Ga = typeof document < "u", Ia = Dl, to = ya || $t ? "cssFloat" : "float", cs = Ga && !Co && !Dl && "draggable" in document.createElement("div"), Oo = (function() {
  if (Ga) {
    if ($t)
      return !1;
    var e = document.createElement("x");
    return e.style.cssText = "pointer-events:auto", e.style.pointerEvents === "auto";
  }
})(), Po = function(a, t) {
  var l = fe(a), o = parseInt(l.width) - parseInt(l.paddingLeft) - parseInt(l.paddingRight) - parseInt(l.borderLeftWidth) - parseInt(l.borderRightWidth), r = ea(a, 0, t), f = ea(a, 1, t), p = r && fe(r), c = f && fe(f), i = p && parseInt(p.marginLeft) + parseInt(p.marginRight) + Fe(r).width, d = c && parseInt(c.marginLeft) + parseInt(c.marginRight) + Fe(f).width;
  if (l.display === "flex")
    return l.flexDirection === "column" || l.flexDirection === "column-reverse" ? "vertical" : "horizontal";
  if (l.display === "grid")
    return l.gridTemplateColumns.split(" ").length <= 1 ? "vertical" : "horizontal";
  if (r && p.float && p.float !== "none") {
    var m = p.float === "left" ? "left" : "right";
    return f && (c.clear === "both" || c.clear === m) ? "vertical" : "horizontal";
  }
  return r && (p.display === "block" || p.display === "flex" || p.display === "table" || p.display === "grid" || i >= o && l[to] === "none" || f && l[to] === "none" && i + d > o) ? "vertical" : "horizontal";
}, vs = function(a, t, l) {
  var o = l ? a.left : a.top, r = l ? a.right : a.bottom, f = l ? a.width : a.height, p = l ? t.left : t.top, c = l ? t.right : t.bottom, i = l ? t.width : t.height;
  return o === p || r === c || o + f / 2 === p + i / 2;
}, ms = function(a, t) {
  var l;
  return La.some(function(o) {
    var r = o[Xe].options.emptyInsertThreshold;
    if (!(!r || Ul(o))) {
      var f = Fe(o), p = a >= f.left - r && a <= f.right + r, c = t >= f.top - r && t <= f.bottom + r;
      if (p && c)
        return l = o;
    }
  }), l;
}, Ro = function(a) {
  function t(r, f) {
    return function(p, c, i, d) {
      var m = p.options.group.name && c.options.group.name && p.options.group.name === c.options.group.name;
      if (r == null && (f || m))
        return !0;
      if (r == null || r === !1)
        return !1;
      if (f && r === "clone")
        return r;
      if (typeof r == "function")
        return t(r(p, c, i, d), f)(p, c, i, d);
      var y = (f ? p : c).options.group.name;
      return r === !0 || typeof r == "string" && r === y || r.join && r.indexOf(y) > -1;
    };
  }
  var l = {}, o = a.group;
  (!o || hl(o) != "object") && (o = {
    name: o
  }), l.name = o.name, l.checkPull = t(o.pull, !0), l.checkPut = t(o.put), l.revertClone = o.revertClone, a.group = l;
}, No = function() {
  !Oo && he && fe(he, "display", "none");
}, Mo = function() {
  !Oo && he && fe(he, "display", "");
};
Ga && !Co && document.addEventListener("click", function(e) {
  if (Fa)
    return e.preventDefault(), e.stopPropagation && e.stopPropagation(), e.stopImmediatePropagation && e.stopImmediatePropagation(), Fa = !1, !1;
}, !0);
var Nt = function(a) {
  if (ae) {
    a = a.touches ? a.touches[0] : a;
    var t = ms(a.clientX, a.clientY);
    if (t) {
      var l = {};
      for (var o in a)
        a.hasOwnProperty(o) && (l[o] = a[o]);
      l.target = l.rootEl = t, l.preventDefault = void 0, l.stopPropagation = void 0, t[Xe]._onDragOver(l);
    }
  }
}, fs = function(a) {
  ae && ae.parentNode[Xe]._isOutsideThisEl(a.target);
};
function pe(e, a) {
  if (!(e && e.nodeType && e.nodeType === 1))
    throw "Sortable: `el` must be an HTMLElement, not ".concat({}.toString.call(e));
  this.el = e, this.options = a = wt({}, a), e[Xe] = this;
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
      return Po(e, this.options);
    },
    ghostClass: "sortable-ghost",
    chosenClass: "sortable-chosen",
    dragClass: "sortable-drag",
    ignore: "a, img",
    filter: null,
    preventOnFilter: !0,
    animation: 0,
    easing: null,
    setData: function(f, p) {
      f.setData("Text", p.textContent);
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
    supportPointer: pe.supportPointer !== !1 && "PointerEvent" in window && (!ca || Dl),
    emptyInsertThreshold: 5
  };
  ka.initializePlugins(this, e, t);
  for (var l in t)
    !(l in a) && (a[l] = t[l]);
  Ro(a);
  for (var o in this)
    o.charAt(0) === "_" && typeof this[o] == "function" && (this[o] = this[o].bind(this));
  this.nativeDraggable = a.forceFallback ? !1 : cs, this.nativeDraggable && (this.options.touchStartThreshold = 1), a.supportPointer ? Ce(e, "pointerdown", this._onTapStart) : (Ce(e, "mousedown", this._onTapStart), Ce(e, "touchstart", this._onTapStart)), this.nativeDraggable && (Ce(e, "dragover", this), Ce(e, "dragenter", this)), La.push(this.el), a.store && a.store.get && this.sort(a.store.get(this) || []), wt(this, ns());
}
pe.prototype = /** @lends Sortable.prototype */
{
  constructor: pe,
  _isOutsideThisEl: function(a) {
    !this.el.contains(a) && a !== this.el && (Yt = null);
  },
  _getDirection: function(a, t) {
    return typeof this.options.direction == "function" ? this.options.direction.call(this, a, t, ae) : this.options.direction;
  },
  _onTapStart: function(a) {
    if (a.cancelable) {
      var t = this, l = this.el, o = this.options, r = o.preventOnFilter, f = a.type, p = a.touches && a.touches[0] || a.pointerType && a.pointerType === "touch" && a, c = (p || a).target, i = a.target.shadowRoot && (a.path && a.path[0] || a.composedPath && a.composedPath()[0]) || c, d = o.filter;
      if (Vs(l), !ae && !(/mousedown|pointerdown/.test(f) && a.button !== 0 || o.disabled) && !i.isContentEditable && !(!this.nativeDraggable && ca && c && c.tagName.toUpperCase() === "SELECT") && (c = dt(c, o.draggable, l, !1), !(c && c.animated) && Ea !== c)) {
        if (Qt = tt(c), ma = tt(c, o.draggable), typeof d == "function") {
          if (d.call(this, a, c, this)) {
            Ge({
              sortable: t,
              rootEl: i,
              name: "filter",
              targetEl: c,
              toEl: l,
              fromEl: l
            }), Ye("filter", t, {
              evt: a
            }), r && a.preventDefault();
            return;
          }
        } else if (d && (d = d.split(",").some(function(m) {
          if (m = dt(i, m.trim(), l, !1), m)
            return Ge({
              sortable: t,
              rootEl: m,
              name: "filter",
              targetEl: c,
              fromEl: l,
              toEl: l
            }), Ye("filter", t, {
              evt: a
            }), !0;
        }), d)) {
          r && a.preventDefault();
          return;
        }
        o.handle && !dt(i, o.handle, l, !1) || this._prepareDragStart(a, p, c);
      }
    }
  },
  _prepareDragStart: function(a, t, l) {
    var o = this, r = o.el, f = o.options, p = r.ownerDocument, c;
    if (l && !ae && l.parentNode === r) {
      var i = Fe(l);
      if (Ee = r, ae = l, Re = ae.parentNode, Ft = ae.nextSibling, Ea = l, Sa = f.group, pe.dragged = ae, Rt = {
        target: ae,
        clientX: (t || a).clientX,
        clientY: (t || a).clientY
      }, _l = Rt.clientX - i.left, eo = Rt.clientY - i.top, this._lastX = (t || a).clientX, this._lastY = (t || a).clientY, ae.style["will-change"] = "all", c = function() {
        if (Ye("delayEnded", o, {
          evt: a
        }), pe.eventCanceled) {
          o._onDrop();
          return;
        }
        o._disableDelayedDragEvents(), !Xl && o.nativeDraggable && (ae.draggable = !0), o._triggerDragStart(a, t), Ge({
          sortable: o,
          name: "choose",
          originalEvent: a
        }), Qe(ae, f.chosenClass, !0);
      }, f.ignore.split(",").forEach(function(d) {
        Io(ae, d.trim(), dl);
      }), Ce(p, "dragover", Nt), Ce(p, "mousemove", Nt), Ce(p, "touchmove", Nt), f.supportPointer ? (Ce(p, "pointerup", o._onDrop), !this.nativeDraggable && Ce(p, "pointercancel", o._onDrop)) : (Ce(p, "mouseup", o._onDrop), Ce(p, "touchend", o._onDrop), Ce(p, "touchcancel", o._onDrop)), Xl && this.nativeDraggable && (this.options.touchStartThreshold = 4, ae.draggable = !0), Ye("delayStart", this, {
        evt: a
      }), f.delay && (!f.delayOnTouchOnly || t) && (!this.nativeDraggable || !(ya || $t))) {
        if (pe.eventCanceled) {
          this._onDrop();
          return;
        }
        f.supportPointer ? (Ce(p, "pointerup", o._disableDelayedDrag), Ce(p, "pointercancel", o._disableDelayedDrag)) : (Ce(p, "mouseup", o._disableDelayedDrag), Ce(p, "touchend", o._disableDelayedDrag), Ce(p, "touchcancel", o._disableDelayedDrag)), Ce(p, "mousemove", o._delayedDragTouchMoveHandler), Ce(p, "touchmove", o._delayedDragTouchMoveHandler), f.supportPointer && Ce(p, "pointermove", o._delayedDragTouchMoveHandler), o._dragStartTimer = setTimeout(c, f.delay);
      } else
        c();
    }
  },
  _delayedDragTouchMoveHandler: function(a) {
    var t = a.touches ? a.touches[0] : a;
    Math.max(Math.abs(t.clientX - this._lastX), Math.abs(t.clientY - this._lastY)) >= Math.floor(this.options.touchStartThreshold / (this.nativeDraggable && window.devicePixelRatio || 1)) && this._disableDelayedDrag();
  },
  _disableDelayedDrag: function() {
    ae && dl(ae), clearTimeout(this._dragStartTimer), this._disableDelayedDragEvents();
  },
  _disableDelayedDragEvents: function() {
    var a = this.el.ownerDocument;
    xe(a, "mouseup", this._disableDelayedDrag), xe(a, "touchend", this._disableDelayedDrag), xe(a, "touchcancel", this._disableDelayedDrag), xe(a, "pointerup", this._disableDelayedDrag), xe(a, "pointercancel", this._disableDelayedDrag), xe(a, "mousemove", this._delayedDragTouchMoveHandler), xe(a, "touchmove", this._delayedDragTouchMoveHandler), xe(a, "pointermove", this._delayedDragTouchMoveHandler);
  },
  _triggerDragStart: function(a, t) {
    t = t || a.pointerType == "touch" && a, !this.nativeDraggable || t ? this.options.supportPointer ? Ce(document, "pointermove", this._onTouchMove) : t ? Ce(document, "touchmove", this._onTouchMove) : Ce(document, "mousemove", this._onTouchMove) : (Ce(ae, "dragend", this), Ce(Ee, "dragstart", this._onDragStart));
    try {
      document.selection ? Oa(function() {
        document.selection.empty();
      }) : window.getSelection().removeAllRanges();
    } catch {
    }
  },
  _dragStarted: function(a, t) {
    if (Xt = !1, Ee && ae) {
      Ye("dragStarted", this, {
        evt: t
      }), this.nativeDraggable && Ce(document, "dragover", fs);
      var l = this.options;
      !a && Qe(ae, l.dragClass, !1), Qe(ae, l.ghostClass, !0), pe.active = this, a && this._appendGhost(), Ge({
        sortable: this,
        name: "start",
        originalEvent: t
      });
    } else
      this._nulling();
  },
  _emulateDragOver: function() {
    if (rt) {
      this._lastX = rt.clientX, this._lastY = rt.clientY, No();
      for (var a = document.elementFromPoint(rt.clientX, rt.clientY), t = a; a && a.shadowRoot && (a = a.shadowRoot.elementFromPoint(rt.clientX, rt.clientY), a !== t); )
        t = a;
      if (ae.parentNode[Xe]._isOutsideThisEl(a), t)
        do {
          if (t[Xe]) {
            var l = void 0;
            if (l = t[Xe]._onDragOver({
              clientX: rt.clientX,
              clientY: rt.clientY,
              target: a,
              rootEl: t
            }), l && !this.options.dragoverBubble)
              break;
          }
          a = t;
        } while (t = To(t));
      Mo();
    }
  },
  _onTouchMove: function(a) {
    if (Rt) {
      var t = this.options, l = t.fallbackTolerance, o = t.fallbackOffset, r = a.touches ? a.touches[0] : a, f = he && _t(he, !0), p = he && f && f.a, c = he && f && f.d, i = Ia && We && Ql(We), d = (r.clientX - Rt.clientX + o.x) / (p || 1) + (i ? i[0] - rl[0] : 0) / (p || 1), m = (r.clientY - Rt.clientY + o.y) / (c || 1) + (i ? i[1] - rl[1] : 0) / (c || 1);
      if (!pe.active && !Xt) {
        if (l && Math.max(Math.abs(r.clientX - this._lastX), Math.abs(r.clientY - this._lastY)) < l)
          return;
        this._onDragStart(a, !0);
      }
      if (he) {
        f ? (f.e += d - (nl || 0), f.f += m - (sl || 0)) : f = {
          a: 1,
          b: 0,
          c: 0,
          d: 1,
          e: d,
          f: m
        };
        var y = "matrix(".concat(f.a, ",").concat(f.b, ",").concat(f.c, ",").concat(f.d, ",").concat(f.e, ",").concat(f.f, ")");
        fe(he, "webkitTransform", y), fe(he, "mozTransform", y), fe(he, "msTransform", y), fe(he, "transform", y), nl = d, sl = m, rt = r;
      }
      a.cancelable && a.preventDefault();
    }
  },
  _appendGhost: function() {
    if (!he) {
      var a = this.options.fallbackOnBody ? document.body : Ee, t = Fe(ae, !0, Ia, !0, a), l = this.options;
      if (Ia) {
        for (We = a; fe(We, "position") === "static" && fe(We, "transform") === "none" && We !== document; )
          We = We.parentNode;
        We !== document.body && We !== document.documentElement ? (We === document && (We = mt()), t.top += We.scrollTop, t.left += We.scrollLeft) : We = mt(), rl = Ql(We);
      }
      he = ae.cloneNode(!0), Qe(he, l.ghostClass, !1), Qe(he, l.fallbackClass, !0), Qe(he, l.dragClass, !0), fe(he, "transition", ""), fe(he, "transform", ""), fe(he, "box-sizing", "border-box"), fe(he, "margin", 0), fe(he, "top", t.top), fe(he, "left", t.left), fe(he, "width", t.width), fe(he, "height", t.height), fe(he, "opacity", "0.8"), fe(he, "position", Ia ? "absolute" : "fixed"), fe(he, "zIndex", "100000"), fe(he, "pointerEvents", "none"), pe.ghost = he, a.appendChild(he), fe(he, "transform-origin", _l / parseInt(he.style.width) * 100 + "% " + eo / parseInt(he.style.height) * 100 + "%");
    }
  },
  _onDragStart: function(a, t) {
    var l = this, o = a.dataTransfer, r = l.options;
    if (Ye("dragStart", this, {
      evt: a
    }), pe.eventCanceled) {
      this._onDrop();
      return;
    }
    Ye("setupClone", this), pe.eventCanceled || (Oe = Eo(ae), Oe.removeAttribute("id"), Oe.draggable = !1, Oe.style["will-change"] = "", this._hideClone(), Qe(Oe, this.options.chosenClass, !1), pe.clone = Oe), l.cloneId = Oa(function() {
      Ye("clone", l), !pe.eventCanceled && (l.options.removeCloneOnHide || Ee.insertBefore(Oe, ae), l._hideClone(), Ge({
        sortable: l,
        name: "clone"
      }));
    }), !t && Qe(ae, r.dragClass, !0), t ? (Fa = !0, l._loopId = setInterval(l._emulateDragOver, 50)) : (xe(document, "mouseup", l._onDrop), xe(document, "touchend", l._onDrop), xe(document, "touchcancel", l._onDrop), o && (o.effectAllowed = "move", r.setData && r.setData.call(l, o, ae)), Ce(document, "drop", l), fe(ae, "transform", "translateZ(0)")), Xt = !0, l._dragStartId = Oa(l._dragStarted.bind(l, t, a)), Ce(document, "selectstart", l), ia = !0, window.getSelection().removeAllRanges(), ca && fe(document.body, "user-select", "none");
  },
  // Returns true - if no further action is needed (either inserted or another condition)
  _onDragOver: function(a) {
    var t = this.el, l = a.target, o, r, f, p = this.options, c = p.group, i = pe.active, d = Sa === c, m = p.sort, y = qe || i, g, x = this, k = !1;
    if (gl) return;
    function S(ie, de) {
      Ye(ie, x, ft({
        evt: a,
        isOwner: d,
        axis: g ? "vertical" : "horizontal",
        revert: f,
        dragRect: o,
        targetRect: r,
        canSort: m,
        fromSortable: y,
        target: l,
        completed: $,
        onMove: function(Se, j) {
          return Da(Ee, t, ae, o, Se, Fe(Se), a, j);
        },
        changed: E
      }, de));
    }
    function V() {
      S("dragOverAnimationCapture"), x.captureAnimationState(), x !== y && y.captureAnimationState();
    }
    function $(ie) {
      return S("dragOverCompleted", {
        insertion: ie
      }), ie && (d ? i._hideClone() : i._showClone(x), x !== y && (Qe(ae, qe ? qe.options.ghostClass : i.options.ghostClass, !1), Qe(ae, p.ghostClass, !0)), qe !== x && x !== pe.active ? qe = x : x === pe.active && qe && (qe = null), y === x && (x._ignoreWhileAnimating = l), x.animateAll(function() {
        S("dragOverAnimationComplete"), x._ignoreWhileAnimating = null;
      }), x !== y && (y.animateAll(), y._ignoreWhileAnimating = null)), (l === ae && !ae.animated || l === t && !l.animated) && (Yt = null), !p.dragoverBubble && !a.rootEl && l !== document && (ae.parentNode[Xe]._isOutsideThisEl(a.target), !ie && Nt(a)), !p.dragoverBubble && a.stopPropagation && a.stopPropagation(), k = !0;
    }
    function E() {
      _e = tt(ae), St = tt(ae, p.draggable), Ge({
        sortable: x,
        name: "change",
        toEl: t,
        newIndex: _e,
        newDraggableIndex: St,
        originalEvent: a
      });
    }
    if (a.preventDefault !== void 0 && a.cancelable && a.preventDefault(), l = dt(l, p.draggable, t, !0), S("dragOver"), pe.eventCanceled) return k;
    if (ae.contains(a.target) || l.animated && l.animatingX && l.animatingY || x._ignoreWhileAnimating === l)
      return $(!1);
    if (Fa = !1, i && !p.disabled && (d ? m || (f = Re !== Ee) : qe === this || (this.lastPutMode = Sa.checkPull(this, i, ae, a)) && c.checkPut(this, i, ae, a))) {
      if (g = this._getDirection(a, l) === "vertical", o = Fe(ae), S("dragOverValid"), pe.eventCanceled) return k;
      if (f)
        return Re = Ee, V(), this._hideClone(), S("revert"), pe.eventCanceled || (Ft ? Ee.insertBefore(ae, Ft) : Ee.appendChild(ae)), $(!0);
      var C = Ul(t, p.draggable);
      if (!C || gs(a, g, this) && !C.animated) {
        if (C === ae)
          return $(!1);
        if (C && t === a.target && (l = C), l && (r = Fe(l)), Da(Ee, t, ae, o, l, r, a, !!l) !== !1)
          return V(), C && C.nextSibling ? t.insertBefore(ae, C.nextSibling) : t.appendChild(ae), Re = t, E(), $(!0);
      } else if (C && hs(a, g, this)) {
        var Z = ea(t, 0, p, !0);
        if (Z === ae)
          return $(!1);
        if (l = Z, r = Fe(l), Da(Ee, t, ae, o, l, r, a, !1) !== !1)
          return V(), t.insertBefore(ae, Z), Re = t, E(), $(!0);
      } else if (l.parentNode === t) {
        r = Fe(l);
        var Q = 0, K, ce = ae.parentNode !== t, ve = !vs(ae.animated && ae.toRect || o, l.animated && l.toRect || r, g), we = g ? "top" : "left", ke = Zl(l, "top", "top") || Zl(ae, "top", "top"), z = ke ? ke.scrollTop : void 0;
        Yt !== l && (K = r[we], pa = !1, Ta = !ve && p.invertSwap || ce), Q = ys(a, l, r, g, ve ? 1 : p.swapThreshold, p.invertedSwapThreshold == null ? p.swapThreshold : p.invertedSwapThreshold, Ta, Yt === l);
        var O;
        if (Q !== 0) {
          var L = tt(ae);
          do
            L -= Q, O = Re.children[L];
          while (O && (fe(O, "display") === "none" || O === he));
        }
        if (Q === 0 || O === l)
          return $(!1);
        Yt = l, fa = Q;
        var D = l.nextElementSibling, M = !1;
        M = Q === 1;
        var re = Da(Ee, t, ae, o, l, r, a, M);
        if (re !== !1)
          return (re === 1 || re === -1) && (M = re === 1), gl = !0, setTimeout(bs, 30), V(), M && !D ? t.appendChild(ae) : l.parentNode.insertBefore(ae, M ? D : l), ke && Uo(ke, 0, z - ke.scrollTop), Re = ae.parentNode, K !== void 0 && !Ta && (Aa = Math.abs(K - Fe(l)[we])), E(), $(!0);
      }
      if (t.contains(ae))
        return $(!1);
    }
    return !1;
  },
  _ignoreWhileAnimating: null,
  _offMoveEvents: function() {
    xe(document, "mousemove", this._onTouchMove), xe(document, "touchmove", this._onTouchMove), xe(document, "pointermove", this._onTouchMove), xe(document, "dragover", Nt), xe(document, "mousemove", Nt), xe(document, "touchmove", Nt);
  },
  _offUpEvents: function() {
    var a = this.el.ownerDocument;
    xe(a, "mouseup", this._onDrop), xe(a, "touchend", this._onDrop), xe(a, "pointerup", this._onDrop), xe(a, "pointercancel", this._onDrop), xe(a, "touchcancel", this._onDrop), xe(document, "selectstart", this);
  },
  _onDrop: function(a) {
    var t = this.el, l = this.options;
    if (_e = tt(ae), St = tt(ae, l.draggable), Ye("drop", this, {
      evt: a
    }), Re = ae && ae.parentNode, _e = tt(ae), St = tt(ae, l.draggable), pe.eventCanceled) {
      this._nulling();
      return;
    }
    Xt = !1, Ta = !1, pa = !1, clearInterval(this._loopId), clearTimeout(this._dragStartTimer), yl(this.cloneId), yl(this._dragStartId), this.nativeDraggable && (xe(document, "drop", this), xe(t, "dragstart", this._onDragStart)), this._offMoveEvents(), this._offUpEvents(), ca && fe(document.body, "user-select", ""), fe(ae, "transform", ""), a && (ia && (a.cancelable && a.preventDefault(), !l.dropBubble && a.stopPropagation()), he && he.parentNode && he.parentNode.removeChild(he), (Ee === Re || qe && qe.lastPutMode !== "clone") && Oe && Oe.parentNode && Oe.parentNode.removeChild(Oe), ae && (this.nativeDraggable && xe(ae, "dragend", this), dl(ae), ae.style["will-change"] = "", ia && !Xt && Qe(ae, qe ? qe.options.ghostClass : this.options.ghostClass, !1), Qe(ae, this.options.chosenClass, !1), Ge({
      sortable: this,
      name: "unchoose",
      toEl: Re,
      newIndex: null,
      newDraggableIndex: null,
      originalEvent: a
    }), Ee !== Re ? (_e >= 0 && (Ge({
      rootEl: Re,
      name: "add",
      toEl: Re,
      fromEl: Ee,
      originalEvent: a
    }), Ge({
      sortable: this,
      name: "remove",
      toEl: Re,
      originalEvent: a
    }), Ge({
      rootEl: Re,
      name: "sort",
      toEl: Re,
      fromEl: Ee,
      originalEvent: a
    }), Ge({
      sortable: this,
      name: "sort",
      toEl: Re,
      originalEvent: a
    })), qe && qe.save()) : _e !== Qt && _e >= 0 && (Ge({
      sortable: this,
      name: "update",
      toEl: Re,
      originalEvent: a
    }), Ge({
      sortable: this,
      name: "sort",
      toEl: Re,
      originalEvent: a
    })), pe.active && ((_e == null || _e === -1) && (_e = Qt, St = ma), Ge({
      sortable: this,
      name: "end",
      toEl: Re,
      originalEvent: a
    }), this.save()))), this._nulling();
  },
  _nulling: function() {
    Ye("nulling", this), Ee = ae = Re = he = Ft = Oe = Ea = Tt = Rt = rt = ia = _e = St = Qt = ma = Yt = fa = qe = Sa = pe.dragged = pe.ghost = pe.clone = pe.active = null;
    var a = this.el;
    Ba.forEach(function(t) {
      a.contains(t) && (t.checked = !0);
    }), Ba.length = nl = sl = 0;
  },
  handleEvent: function(a) {
    switch (a.type) {
      case "drop":
      case "dragend":
        this._onDrop(a);
        break;
      case "dragenter":
      case "dragover":
        ae && (this._onDragOver(a), ps(a));
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
    for (var a = [], t, l = this.el.children, o = 0, r = l.length, f = this.options; o < r; o++)
      t = l[o], dt(t, f.draggable, this.el, !1) && a.push(t.getAttribute(f.dataIdAttr) || ws(t));
    return a;
  },
  /**
   * Sorts the elements according to the array.
   * @param  {String[]}  order  order of the items
   */
  sort: function(a, t) {
    var l = {}, o = this.el;
    this.toArray().forEach(function(r, f) {
      var p = o.children[f];
      dt(p, this.options.draggable, o, !1) && (l[r] = p);
    }, this), t && this.captureAnimationState(), a.forEach(function(r) {
      l[r] && (o.removeChild(l[r]), o.appendChild(l[r]));
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
    return dt(a, t || this.options.draggable, this.el, !1);
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
    var o = ka.modifyOption(this, a, t);
    typeof o < "u" ? l[a] = o : l[a] = t, a === "group" && Ro(l);
  },
  /**
   * Destroy
   */
  destroy: function() {
    Ye("destroy", this);
    var a = this.el;
    a[Xe] = null, xe(a, "mousedown", this._onTapStart), xe(a, "touchstart", this._onTapStart), xe(a, "pointerdown", this._onTapStart), this.nativeDraggable && (xe(a, "dragover", this), xe(a, "dragenter", this)), Array.prototype.forEach.call(a.querySelectorAll("[draggable]"), function(t) {
      t.removeAttribute("draggable");
    }), this._onDrop(), this._disableDelayedDragEvents(), La.splice(La.indexOf(this.el), 1), this.el = a = null;
  },
  _hideClone: function() {
    if (!Tt) {
      if (Ye("hideClone", this), pe.eventCanceled) return;
      fe(Oe, "display", "none"), this.options.removeCloneOnHide && Oe.parentNode && Oe.parentNode.removeChild(Oe), Tt = !0;
    }
  },
  _showClone: function(a) {
    if (a.lastPutMode !== "clone") {
      this._hideClone();
      return;
    }
    if (Tt) {
      if (Ye("showClone", this), pe.eventCanceled) return;
      ae.parentNode == Ee && !this.options.group.revertClone ? Ee.insertBefore(Oe, ae) : Ft ? Ee.insertBefore(Oe, Ft) : Ee.appendChild(Oe), this.options.group.revertClone && this.animate(ae, Oe), fe(Oe, "display", ""), Tt = !1;
    }
  }
};
function ps(e) {
  e.dataTransfer && (e.dataTransfer.dropEffect = "move"), e.cancelable && e.preventDefault();
}
function Da(e, a, t, l, o, r, f, p) {
  var c, i = e[Xe], d = i.options.onMove, m;
  return window.CustomEvent && !$t && !ya ? c = new CustomEvent("move", {
    bubbles: !0,
    cancelable: !0
  }) : (c = document.createEvent("Event"), c.initEvent("move", !0, !0)), c.to = a, c.from = e, c.dragged = t, c.draggedRect = l, c.related = o || a, c.relatedRect = r || Fe(a), c.willInsertAfter = p, c.originalEvent = f, e.dispatchEvent(c), d && (m = d.call(i, c, f)), m;
}
function dl(e) {
  e.draggable = !1;
}
function bs() {
  gl = !1;
}
function hs(e, a, t) {
  var l = Fe(ea(t.el, 0, t.options, !0)), o = Ao(t.el, t.options, he), r = 10;
  return a ? e.clientX < o.left - r || e.clientY < l.top && e.clientX < l.right : e.clientY < o.top - r || e.clientY < l.bottom && e.clientX < l.left;
}
function gs(e, a, t) {
  var l = Fe(Ul(t.el, t.options.draggable)), o = Ao(t.el, t.options, he), r = 10;
  return a ? e.clientX > o.right + r || e.clientY > l.bottom && e.clientX > l.left : e.clientY > o.bottom + r || e.clientX > l.right && e.clientY > l.top;
}
function ys(e, a, t, l, o, r, f, p) {
  var c = l ? e.clientY : e.clientX, i = l ? t.height : t.width, d = l ? t.top : t.left, m = l ? t.bottom : t.right, y = !1;
  if (!f) {
    if (p && Aa < i * o) {
      if (!pa && (fa === 1 ? c > d + i * r / 2 : c < m - i * r / 2) && (pa = !0), pa)
        y = !0;
      else if (fa === 1 ? c < d + Aa : c > m - Aa)
        return -fa;
    } else if (c > d + i * (1 - o) / 2 && c < m - i * (1 - o) / 2)
      return ks(a);
  }
  return y = y || f, y && (c < d + i * r / 2 || c > m - i * r / 2) ? c > d + i / 2 ? 1 : -1 : 0;
}
function ks(e) {
  return tt(ae) < tt(e) ? 1 : -1;
}
function ws(e) {
  for (var a = e.tagName + e.className + e.src + e.href + e.textContent, t = a.length, l = 0; t--; )
    l += a.charCodeAt(t);
  return l.toString(36);
}
function Vs(e) {
  Ba.length = 0;
  for (var a = e.getElementsByTagName("input"), t = a.length; t--; ) {
    var l = a[t];
    l.checked && Ba.push(l);
  }
}
function Oa(e) {
  return setTimeout(e, 0);
}
function yl(e) {
  return clearTimeout(e);
}
Ga && Ce(document, "touchmove", function(e) {
  (pe.active || Xt) && e.cancelable && e.preventDefault();
});
pe.utils = {
  on: Ce,
  off: xe,
  css: fe,
  find: Io,
  is: function(a, t) {
    return !!dt(a, t, a, !1);
  },
  extend: os,
  throttle: Do,
  closest: dt,
  toggleClass: Qe,
  clone: Eo,
  index: tt,
  nextTick: Oa,
  cancelNextTick: yl,
  detectDirection: Po,
  getChild: ea,
  expando: Xe
};
pe.get = function(e) {
  return e[Xe];
};
pe.mount = function() {
  for (var e = arguments.length, a = new Array(e), t = 0; t < e; t++)
    a[t] = arguments[t];
  a[0].constructor === Array && (a = a[0]), a.forEach(function(l) {
    if (!l.prototype || !l.prototype.constructor)
      throw "Sortable: Mounted plugin must be a constructor function, not ".concat({}.toString.call(l));
    l.utils && (pe.utils = ft(ft({}, pe.utils), l.utils)), ka.mount(l);
  });
};
pe.create = function(e, a) {
  return new pe(e, a);
};
pe.version = as;
var Me = [], na, kl, wl = !1, ul, cl, za, sa;
function $s() {
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
      this.sortable.nativeDraggable ? Ce(document, "dragover", this._handleAutoScroll) : this.options.supportPointer ? Ce(document, "pointermove", this._handleFallbackAutoScroll) : l.touches ? Ce(document, "touchmove", this._handleFallbackAutoScroll) : Ce(document, "mousemove", this._handleFallbackAutoScroll);
    },
    dragOverCompleted: function(t) {
      var l = t.originalEvent;
      !this.options.dragOverBubble && !l.rootEl && this._handleAutoScroll(l);
    },
    drop: function() {
      this.sortable.nativeDraggable ? xe(document, "dragover", this._handleAutoScroll) : (xe(document, "pointermove", this._handleFallbackAutoScroll), xe(document, "touchmove", this._handleFallbackAutoScroll), xe(document, "mousemove", this._handleFallbackAutoScroll)), ao(), Pa(), is();
    },
    nulling: function() {
      za = kl = na = wl = sa = ul = cl = null, Me.length = 0;
    },
    _handleFallbackAutoScroll: function(t) {
      this._handleAutoScroll(t, !0);
    },
    _handleAutoScroll: function(t, l) {
      var o = this, r = (t.touches ? t.touches[0] : t).clientX, f = (t.touches ? t.touches[0] : t).clientY, p = document.elementFromPoint(r, f);
      if (za = t, l || this.options.forceAutoScrollFallback || ya || $t || ca) {
        vl(t, this.options, p, l);
        var c = It(p, !0);
        wl && (!sa || r !== ul || f !== cl) && (sa && ao(), sa = setInterval(function() {
          var i = It(document.elementFromPoint(r, f), !0);
          i !== c && (c = i, Pa()), vl(t, o.options, i, l);
        }, 10), ul = r, cl = f);
      } else {
        if (!this.options.bubbleScroll || It(p, !0) === mt()) {
          Pa();
          return;
        }
        vl(t, this.options, It(p, !1), !1);
      }
    }
  }, wt(e, {
    pluginName: "scroll",
    initializeByDefault: !0
  });
}
function Pa() {
  Me.forEach(function(e) {
    clearInterval(e.pid);
  }), Me = [];
}
function ao() {
  clearInterval(sa);
}
var vl = Do(function(e, a, t, l) {
  if (a.scroll) {
    var o = (e.touches ? e.touches[0] : e).clientX, r = (e.touches ? e.touches[0] : e).clientY, f = a.scrollSensitivity, p = a.scrollSpeed, c = mt(), i = !1, d;
    kl !== t && (kl = t, Pa(), na = a.scroll, d = a.scrollFn, na === !0 && (na = It(t, !0)));
    var m = 0, y = na;
    do {
      var g = y, x = Fe(g), k = x.top, S = x.bottom, V = x.left, $ = x.right, E = x.width, C = x.height, Z = void 0, Q = void 0, K = g.scrollWidth, ce = g.scrollHeight, ve = fe(g), we = g.scrollLeft, ke = g.scrollTop;
      g === c ? (Z = E < K && (ve.overflowX === "auto" || ve.overflowX === "scroll" || ve.overflowX === "visible"), Q = C < ce && (ve.overflowY === "auto" || ve.overflowY === "scroll" || ve.overflowY === "visible")) : (Z = E < K && (ve.overflowX === "auto" || ve.overflowX === "scroll"), Q = C < ce && (ve.overflowY === "auto" || ve.overflowY === "scroll"));
      var z = Z && (Math.abs($ - o) <= f && we + E < K) - (Math.abs(V - o) <= f && !!we), O = Q && (Math.abs(S - r) <= f && ke + C < ce) - (Math.abs(k - r) <= f && !!ke);
      if (!Me[m])
        for (var L = 0; L <= m; L++)
          Me[L] || (Me[L] = {});
      (Me[m].vx != z || Me[m].vy != O || Me[m].el !== g) && (Me[m].el = g, Me[m].vx = z, Me[m].vy = O, clearInterval(Me[m].pid), (z != 0 || O != 0) && (i = !0, Me[m].pid = setInterval(function() {
        l && this.layer === 0 && pe.active._onTouchMove(za);
        var D = Me[this.layer].vy ? Me[this.layer].vy * p : 0, M = Me[this.layer].vx ? Me[this.layer].vx * p : 0;
        typeof d == "function" && d.call(pe.dragged.parentNode[Xe], M, D, e, za, Me[this.layer].el) !== "continue" || Uo(Me[this.layer].el, M, D);
      }.bind({
        layer: m
      }), 24))), m++;
    } while (a.bubbleScroll && y !== c && (y = It(y, !1)));
    wl = i;
  }
}, 30), Fo = function(a) {
  var t = a.originalEvent, l = a.putSortable, o = a.dragEl, r = a.activeSortable, f = a.dispatchSortableEvent, p = a.hideGhostForTarget, c = a.unhideGhostForTarget;
  if (t) {
    var i = l || r;
    p();
    var d = t.changedTouches && t.changedTouches.length ? t.changedTouches[0] : t, m = document.elementFromPoint(d.clientX, d.clientY);
    c(), i && !i.el.contains(m) && (f("spill"), this.onSpill({
      dragEl: o,
      putSortable: l
    }));
  }
};
function El() {
}
El.prototype = {
  startIndex: null,
  dragStart: function(a) {
    var t = a.oldDraggableIndex;
    this.startIndex = t;
  },
  onSpill: function(a) {
    var t = a.dragEl, l = a.putSortable;
    this.sortable.captureAnimationState(), l && l.captureAnimationState();
    var o = ea(this.sortable.el, this.startIndex, this.options);
    o ? this.sortable.el.insertBefore(t, o) : this.sortable.el.appendChild(t), this.sortable.animateAll(), l && l.animateAll();
  },
  drop: Fo
};
wt(El, {
  pluginName: "revertOnSpill"
});
function Al() {
}
Al.prototype = {
  onSpill: function(a) {
    var t = a.dragEl, l = a.putSortable, o = l || this.sortable;
    o.captureAnimationState(), t.parentNode && t.parentNode.removeChild(t), o.animateAll();
  },
  drop: Fo
};
wt(Al, {
  pluginName: "removeOnSpill"
});
pe.mount(new $s());
pe.mount(Al, El);
function xs(e, a) {
  const t = e.oldDraggableIndex ?? e.oldIndex;
  e.item.remove();
  const l = [...e.from.children].filter((o) => o.matches(a));
  e.from.insertBefore(e.item, l[t ?? l.length] ?? null);
}
function Lo(e) {
  const a = /* @__PURE__ */ new Map();
  function t(l) {
    a.get(l)?.destroy(), a.delete(l);
  }
  return Vt(() => {
    for (const l of a.keys()) t(l);
  }), {
    mounted(l) {
      const o = l.querySelector(".work-field-builder") ?? l;
      a.set(l, new pe(o, {
        draggable: ".work-reorder-entry",
        handle: ".work-reorder-handle",
        forceFallback: !0,
        fallbackOnBody: !1,
        ghostClass: "work-drag-ghost",
        onEnd(r) {
          const f = r.oldDraggableIndex, p = r.newDraggableIndex;
          xs(r, ".work-reorder-entry"), f !== void 0 && p !== void 0 && f !== p && e(f, p);
        }
      }));
    },
    unmounted: t
  };
}
const Cs = { class: "work-stack work-tight work-option-builder" }, Ss = { class: "work-stack work-tight" }, Ts = { class: "work-stack work-tight work-small" }, Is = { class: "work-stack work-tight work-small" }, Ds = { class: "work-stack work-tight" }, Us = { class: "work-stack work-tight work-small" }, Es = { class: "work-row" }, As = { class: "work-stack work-tight work-small" }, Os = { class: "work-row" }, Ps = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, Rs = { class: "work-add-option" }, Ns = {
  key: 0,
  class: "work-muted work-small"
}, Ms = /* @__PURE__ */ $e({
  __name: "OptionsEditor",
  props: {
    field: {}
  },
  emits: ["validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = "options:" + ja(), r = q(() => t.field.options ?? []), f = q(() => r.value.every((m, y) => !!m.id && r.value.findIndex((g) => g.id === m.id) === y));
    De(f, (m) => l("validity", m, o), { immediate: !0 }), Vt(() => l("validity", !0, o));
    function p(m, y) {
      ho(r.value, m, y - m), r.value.forEach((g, x) => g.order = x);
    }
    const c = Lo(p), i = ["primary", "success", "info", "warn", "danger", "secondary"];
    function d() {
      let m = r.value.length + 1;
      for (; r.value.some((y) => y.id === `option_${m}`); ) m++;
      (t.field.options ??= []).push({ id: `option_${m}`, label: "New option", order: r.value.length });
    }
    return (m, y) => (n(), b("section", Cs, [
      y[4] || (y[4] = u("header", { class: "work-row" }, [
        u("h4", null, "Options"),
        u("span", { class: "work-muted work-small" }, "Renaming a choice keeps it selected on existing items."),
        u("span", { class: "work-spacer" })
      ], -1)),
      ct((n(), b("div", Ss, [
        (n(!0), b(te, null, se(r.value, (g, x) => (n(), b("div", {
          key: x,
          class: "work-option-row work-reorder-entry"
        }, [
          h(s(_), {
            type: "button",
            class: "work-icon-button work-reorder-handle",
            "aria-label": "Drag option; arrow keys reorder",
            onKeydown: [
              Ae(Ie((k) => p(x, x - 1), ["prevent"]), ["up"]),
              Ae(Ie((k) => p(x, x + 1), ["prevent"]), ["down"])
            ],
            severity: "secondary",
            text: "",
            size: "small"
          }, {
            default: W(() => [
              h(s(ue), {
                icon: "tabler:grip-vertical",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["onKeydown"]),
          u("label", Ts, [
            y[0] || (y[0] = B("Label", -1)),
            h(s(Ve), {
              modelValue: g.label,
              "onUpdate:modelValue": (k) => g.label = k,
              "aria-label": "Option label"
            }, null, 8, ["modelValue", "onUpdate:modelValue"])
          ]),
          h(Le, {
            class: "work-disclosure",
            label: "Advanced"
          }, {
            default: W(() => [
              u("label", Is, [
                y[1] || (y[1] = B("Integration identifier", -1)),
                h(s(Ve), {
                  modelValue: g.id,
                  "onUpdate:modelValue": (k) => g.id = k,
                  class: "work-option-code",
                  required: "",
                  "aria-label": "Option ID"
                }, null, 8, ["modelValue", "onUpdate:modelValue"])
              ])
            ]),
            _: 2
          }, 1024),
          u("div", Ds, [
            u("label", Us, [
              y[2] || (y[2] = B("Color", -1)),
              u("span", Es, [
                u("span", {
                  class: vt(["work-color-swatch", "work-swatch-" + (g.color || "secondary")]),
                  "aria-hidden": "true"
                }, null, 2),
                h(s(me), {
                  modelValue: g.color,
                  "onUpdate:modelValue": (k) => g.color = k,
                  "aria-label": "Option color",
                  appendTo: "self",
                  optionLabel: "label",
                  optionValue: "value",
                  optionDisabled: "disabled",
                  options: [{ label: "Default", value: void 0, disabled: !1 }, ...(i ?? []).map((k) => ({ label: k, value: k, disabled: !1 }))]
                }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
              ])
            ]),
            u("label", As, [
              y[3] || (y[3] = B("Category", -1)),
              h(s(me), {
                "model-value": g.category,
                "aria-label": "Option category",
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                showClear: "",
                options: ["triage", "backlog", ...s(bo)].map((k) => ({ label: s(qt)(k), value: k })),
                "onUpdate:modelValue": (k) => g.category = k || void 0
              }, null, 8, ["model-value", "options", "onUpdate:modelValue"])
            ])
          ]),
          u("div", Os, [
            h(s(_), {
              "aria-label": "Option earlier",
              severity: "secondary",
              size: "small",
              disabled: x === 0,
              onClick: (k) => p(x, x - 1),
              text: ""
            }, {
              default: W(() => [
                h(s(ue), {
                  icon: "tabler:arrow-up",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["disabled", "onClick"]),
            h(s(_), {
              "aria-label": "Option later",
              severity: "secondary",
              size: "small",
              disabled: x === r.value.length - 1,
              onClick: (k) => p(x, x + 1),
              text: ""
            }, {
              default: W(() => [
                h(s(ue), {
                  icon: "tabler:arrow-down",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["disabled", "onClick"]),
            h(s(_), {
              label: "Remove",
              "aria-label": "Remove option",
              severity: "secondary",
              text: "",
              size: "small",
              onClick: (k) => r.value.splice(x, 1)
            }, {
              icon: W(() => [
                h(s(ue), {
                  icon: "tabler:trash",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["onClick"])
          ])
        ]))), 128)),
        f.value ? U("", !0) : (n(), b("p", Ps, "Each choice needs a unique integration identifier.")),
        u("div", Rs, [
          h(s(_), {
            label: "Add option",
            severity: "secondary",
            size: "small",
            onClick: d,
            outlined: ""
          }, {
            icon: W(() => [
              h(s(ue), {
                icon: "tabler:plus",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          })
        ])
      ])), [
        [s(c)]
      ]),
      r.value.length ? U("", !0) : (n(), b("p", Ns, "Add the choices people can select for this field."))
    ]));
  }
}), Fs = {
  class: "work-stack",
  "aria-label": "Fields editor"
}, Ls = { class: "work-form-actions work-wrap" }, Bs = { class: "work-stack work-tight" }, zs = { class: "work-stack work-tight" }, js = { class: "work-dialog-actions" }, qs = {
  key: 1,
  class: "work-settings-card work-muted"
}, Ws = { class: "work-muted work-small" }, Ks = {
  key: 0,
  class: "work-error work-small",
  role: "alert"
}, Gs = { class: "work-settings-grid work-field-properties" }, Hs = { class: "work-stack work-tight" }, Ys = { class: "work-stack work-tight" }, Xs = { class: "work-stack work-tight" }, Js = {
  key: 1,
  class: "work-stack work-tight"
}, Zs = {
  key: 4,
  class: "work-stack work-tight"
}, Qs = {
  key: 5,
  class: "work-stack work-tight"
}, _s = { class: "work-stack work-tight" }, er = { class: "work-stack work-tight" }, tr = { class: "work-stack work-tight" }, ar = { class: "work-stack work-tight" }, lr = { class: "work-stack" }, or = { class: "work-stack work-tight" }, ir = { class: "work-stack work-tight" }, nr = { class: "work-stack work-tight work-field-history" }, sr = { class: "work-settings-list" }, rr = { class: "work-settings-row" }, dr = { class: "work-settings-row" }, ur = { class: "work-stack" }, cr = /* @__PURE__ */ $e({
  __name: "FieldsEditor",
  props: {
    draft: {},
    guardRemoval: { type: Function },
    issues: {},
    boardId: {},
    installedTypes: {},
    itemType: {}
  },
  emits: ["validity", "update:itemType"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = q(() => t.draft.fields ?? []), r = N(), f = N(""), p = N(!1), c = N("text"), i = N([]), d = q(() => (t.draft.item_types ?? []).map((j) => ({ value: j.id, label: j.title || Ne(j.id) }))), m = q(() => t.draft.item_types?.find((j) => j.id === t.itemType)), y = q(() => o.value.map((j, v) => ({ field: j, index: v })).filter(({ field: j }) => !m.value || m.value.fields.includes(j.code))), g = N(""), x = N({}), k = Lo((j, v) => {
      const w = y.value[j]?.index, ee = y.value[v]?.index;
      w !== void 0 && ee !== void 0 && re(w, ee - w);
    });
    function S(j) {
      return (t.draft.item_types ?? []).filter((v) => v.fields.includes(j)).map((v) => v.title || Ne(v.id));
    }
    async function V(j) {
      if (!g.value) {
        g.value = j.code;
        try {
          const v = await t.guardRemoval?.("fields", j.code);
          x.value[j.code] = v ?? "", v || ga(t.draft, "fields", j.code);
        } finally {
          g.value = "";
        }
      }
    }
    const $ = Object.entries({ text: "Text", int: "Whole number", dec: "Decimal number", quantity: "Measurement", bool: "Yes or no", time: "Date or time", ref: "Reference", record: "Structured data", option: "Choice", principal: "Person or group", item: "Work item", rank: "Order", rich_text: "Formatted text", formula: "Formula", rollup: "Related item calculation", counter: "Counter" }).map(([j, v]) => ({ value: j, label: v })), E = [{ label: "None", value: "none" }, { label: "Exact matches", value: "key" }, { label: "Numeric ranges", value: "number" }], C = ["int", "dec", "quantity"], Z = q(() => new Map(t.installedTypes?.map((j) => [j.id, j]))), Q = q(() => [...$, ...(t.installedTypes ?? []).map((j) => ({ value: j.id, label: j.title }))]), K = {};
    function ce(j) {
      return j.type && j.type !== "value" ? j.type : j.form ?? "text";
    }
    function ve(j) {
      return j.type ? Z.value.get(j.type) : void 0;
    }
    function we(j) {
      const v = ve(j)?.config_schema;
      return v && yo(v).length ? v : void 0;
    }
    function ke(j) {
      const v = ve(j);
      return !!v?.config_schema || ["dec", "quantity", "ref", "time", "record"].includes(v?.form ?? j.form ?? "") || !!j.config;
    }
    function z(j) {
      const v = ve(j), w = v?.form ?? j.form ?? "text";
      return E.filter(({ value: ee }) => ee === "none" || (!v?.indexes || v.indexes.includes(ee)) && w !== "record" && (ee !== "number" || C.includes(w) || j.type === "option"));
    }
    function O(j) {
      j.index && !z(j).some((v) => v.value === j.index) && delete j.index;
    }
    function L(j, v) {
      const w = Z.value.get(v);
      if (w) {
        if (w.id === j.type) return;
        j.type = w.id, j.form = w.form, delete j.options, delete j.config, O(j);
        return;
      }
      ve(j) && delete j.config;
      const ee = { option: "text", principal: "ref", item: "ref", rank: "text", rich_text: "text", formula: "int", rollup: "int", counter: "int" };
      ee[v] ? (j.type = v, j.form = ee[v]) : (delete j.type, j.form = v), v !== "option" ? delete j.options : j.options ??= [], v === "rich_text" && (j.config = { format: "json" }), O(j);
    }
    function D(j, v) {
      j.form = v, O(j);
    }
    function M(j, v) {
      const w = { ...j.config };
      v ? w.item_type = v : delete w.item_type, j.config = Object.keys(w).length ? w : void 0;
    }
    function re(j, v) {
      ho(o.value, j, v);
      for (const w of t.draft.item_types ?? []) {
        const ee = new Set(w.fields);
        w.fields = o.value.filter((P) => ee.has(P.code)).map((P) => P.code);
      }
    }
    function ie(j, v) {
      try {
        mi(t.draft, j, v.value), delete x.value[j.code];
      } catch (w) {
        x.value[j.code] = w.message, v.value = j.code;
      }
    }
    async function de() {
      f.value = "", c.value = "text", i.value = m.value ? [m.value.id] : [], p.value = !0, await Jt(), r.value?.querySelector("input")?.focus();
    }
    function ne() {
      const j = f.value.trim();
      if (!j) return;
      const v = j.normalize("NFKD").replace(/\p{Mark}/gu, "").toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, ""), w = (/^[a-z]/.test(v) ? v : `field_${v || "new"}`).slice(0, 40);
      let ee = w, P = 2;
      for (; o.value.some((R) => R.code === ee); ) {
        const R = "_" + P++;
        ee = w.slice(0, 40 - R.length) + R;
      }
      const G = { code: ee, title: j, form: "text", cardinality: "one" };
      L(G, c.value), (t.draft.fields ??= []).push(G);
      for (const R of t.draft.item_types ?? []) i.value.includes(R.id) && R.fields.push(ee);
      m.value && !i.value.includes(m.value.id) && l("update:itemType", ""), Se.value = ee, p.value = !1;
    }
    const Se = N("");
    return (j, v) => (n(), b("section", Fs, [
      u("div", Ls, [
        h(s(me), {
          "model-value": m.value?.id ?? "",
          "aria-label": "Filter fields by item type",
          placeholder: "All item types",
          appendTo: "self",
          optionLabel: "label",
          optionValue: "value",
          options: [{ value: "", label: "All item types" }, ...d.value],
          "onUpdate:modelValue": v[0] || (v[0] = (w) => l("update:itemType", w))
        }, null, 8, ["model-value", "options"]),
        h(s(_), {
          label: "Add field",
          "aria-expanded": p.value,
          disabled: p.value,
          onClick: de
        }, {
          icon: W(() => [
            h(s(ue), {
              icon: "tabler:plus",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        }, 8, ["aria-expanded", "disabled"])
      ]),
      p.value ? (n(), b("section", {
        key: 0,
        ref_key: "addArea",
        ref: r,
        class: "work-settings-card work-stack",
        "aria-label": "Add field",
        onKeydown: v[5] || (v[5] = Ae(Ie((w) => p.value = !1, ["stop"]), ["esc"]))
      }, [
        v[9] || (v[9] = u("header", null, [
          u("h3", null, "Add field"),
          u("p", { class: "work-muted" }, "Choose what the field captures and which items show it.")
        ], -1)),
        u("label", Bs, [
          v[7] || (v[7] = B("Field name", -1)),
          h(s(Ve), {
            modelValue: f.value,
            "onUpdate:modelValue": v[1] || (v[1] = (w) => f.value = w),
            "aria-label": "Field name",
            maxlength: "255",
            onKeydown: Ae(Ie(ne, ["prevent"]), ["enter"])
          }, null, 8, ["modelValue", "onKeydown"])
        ]),
        u("label", zs, [
          v[8] || (v[8] = B("Kind", -1)),
          h(s(me), {
            modelValue: c.value,
            "onUpdate:modelValue": v[2] || (v[2] = (w) => c.value = w),
            "aria-label": "New field kind",
            appendTo: "self",
            options: Q.value,
            optionLabel: "label",
            optionValue: "value"
          }, null, 8, ["modelValue", "options"])
        ]),
        d.value.length ? (n(), H(ut, {
          key: 0,
          label: "Show on item types",
          options: d.value,
          modelValue: i.value,
          "onUpdate:modelValue": v[3] || (v[3] = (w) => i.value = w)
        }, null, 8, ["options", "modelValue"])) : U("", !0),
        u("footer", js, [
          h(s(_), {
            label: "Cancel",
            severity: "secondary",
            outlined: "",
            onClick: v[4] || (v[4] = (w) => p.value = !1)
          }),
          h(s(_), {
            label: "Add to draft",
            disabled: !f.value.trim(),
            onClick: ne
          }, null, 8, ["disabled"])
        ])
      ], 544)) : U("", !0),
      y.value.length ? U("", !0) : (n(), b("p", qs, "No fields here yet. Add a field to capture information.")),
      ct((n(), H(Ka, {
        columns: "fields",
        count: y.value.length
      }, {
        default: W(() => [
          (n(!0), b(te, null, se(y.value, ({ field: w, index: ee }) => (n(), H(Wa, {
            title: s(Ke)(w),
            "initial-open": Se.value === w.code,
            kind: ve(w)?.title || s($).find((P) => P.value === ce(w))?.label || s(Ne)(ce(w)),
            key: w.id ?? ee,
            class: "work-field-row work-reorder-entry work-stack"
          }, {
            handle: W(() => [
              h(s(_), {
                type: "button",
                class: "work-reorder-handle work-icon-button",
                "aria-label": "Drag " + s(Ke)(w) + " or use the arrow keys to reorder",
                onKeydown: [
                  Ae(Ie((P) => re(ee, -1), ["prevent"]), ["up"]),
                  Ae(Ie((P) => re(ee, 1), ["prevent"]), ["down"])
                ],
                severity: "secondary",
                text: "",
                size: "small"
              }, {
                default: W(() => [
                  h(s(ue), {
                    icon: "tabler:grip-vertical",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["aria-label", "onKeydown"])
            ]),
            flags: W(() => [
              w.track ? (n(), H(s(Ze), {
                key: 0,
                class: "kx-tag-sm",
                severity: "secondary",
                value: "Tracked"
              })) : U("", !0),
              w.intervals ? (n(), H(s(Ze), {
                key: 1,
                class: "kx-tag-sm",
                severity: "secondary",
                value: "Intervals"
              })) : U("", !0)
            ]),
            usage: W(() => [
              u("span", Ws, A(S(w.code).length ? S(w.code).join(", ") : "Unused"), 1)
            ]),
            actions: W(() => [
              h(s(_), {
                "aria-label": "Move " + s(Ke)(w) + " earlier",
                severity: "secondary",
                disabled: ee === 0,
                onClick: (P) => re(ee, -1),
                text: "",
                size: "small"
              }, {
                default: W(() => [
                  h(s(ue), {
                    icon: "tabler:arrow-up",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["aria-label", "disabled", "onClick"]),
              h(s(_), {
                "aria-label": "Move " + s(Ke)(w) + " later",
                severity: "secondary",
                disabled: ee === o.value.length - 1,
                onClick: (P) => re(ee, 1),
                text: "",
                size: "small"
              }, {
                default: W(() => [
                  h(s(ue), {
                    icon: "tabler:arrow-down",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["aria-label", "disabled", "onClick"])
            ]),
            default: W(() => [
              x.value[w.code] ? (n(), b("p", Ks, A(x.value[w.code]), 1)) : U("", !0),
              (n(!0), b(te, null, se(e.issues?.filter((P) => P.code === w.code) ?? [], (P) => (n(), b("p", {
                key: P.what,
                class: "work-error work-small",
                role: "alert"
              }, A(s(qa)(P)), 1))), 128)),
              u("div", Gs, [
                u("label", Hs, [
                  v[10] || (v[10] = B("Title", -1)),
                  h(s(Ve), {
                    modelValue: w.title,
                    "onUpdate:modelValue": (P) => w.title = P,
                    "aria-label": "Field title",
                    maxlength: "255",
                    placeholder: s(Ke)(w)
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder"])
                ]),
                u("label", Ys, [
                  v[11] || (v[11] = B("Kind", -1)),
                  h(s(me), {
                    "aria-label": "Kind",
                    "model-value": ce(w),
                    "onUpdate:modelValue": (P) => L(w, P),
                    appendTo: "self",
                    options: Q.value,
                    optionLabel: "label",
                    optionValue: "value"
                  }, null, 8, ["model-value", "onUpdate:modelValue", "options"])
                ]),
                u("label", Xs, [
                  v[12] || (v[12] = B("Values allowed", -1)),
                  h(s(me), {
                    "aria-label": "Values allowed",
                    "model-value": w.cardinality ?? "one",
                    "onUpdate:modelValue": (P) => w.cardinality = P,
                    appendTo: "self",
                    options: [{ label: "One value", value: "one" }, { label: "Multiple unique values", value: "set" }, { label: "Ordered values", value: "list" }],
                    optionLabel: "label",
                    optionValue: "value"
                  }, null, 8, ["model-value", "onUpdate:modelValue"])
                ])
              ]),
              w.type === "item" ? (n(), b("label", Js, [
                v[13] || (v[13] = B("Which items can be referenced? ", -1)),
                h(s(me), {
                  "model-value": w.config?.item_type ?? "",
                  "aria-label": "Reference target",
                  appendTo: "self",
                  optionLabel: "label",
                  optionValue: "value",
                  options: [{ value: "", label: "Any item type" }, ...d.value],
                  "onUpdate:modelValue": (P) => M(w, P)
                }, null, 8, ["model-value", "options", "onUpdate:modelValue"]),
                v[14] || (v[14] = u("span", { class: "work-muted work-small" }, "A reference stores the selected item as a value. To show a named relationship on both items, use Links.", -1))
              ])) : U("", !0),
              we(w) ? (n(), H(go, {
                key: w.type,
                schema: we(w),
                "model-value": w.config ?? K,
                "onUpdate:modelValue": (P) => w.config = P,
                onValidity: (P) => l("validity", "config-" + ee, P)
              }, null, 8, ["schema", "model-value", "onUpdate:modelValue", "onValidity"])) : U("", !0),
              w.type === "option" ? (n(), H(Ms, {
                key: 3,
                field: w,
                onValidity: v[6] || (v[6] = (P, G) => l("validity", G, P))
              }, null, 8, ["field"])) : U("", !0),
              w.type === "formula" || w.type === "rollup" ? (n(), b("label", Zs, [
                v[15] || (v[15] = B("Result type", -1)),
                h(s(me), {
                  "model-value": w.form,
                  "onUpdate:modelValue": (P) => D(w, P),
                  "aria-label": "Result type",
                  options: s($).slice(0, 8),
                  optionLabel: "label",
                  optionValue: "value",
                  appendTo: "self"
                }, null, 8, ["model-value", "onUpdate:modelValue", "options"])
              ])) : U("", !0),
              w.type === "formula" ? (n(), b("label", Qs, [
                v[16] || (v[16] = B("Expression", -1)),
                h(s(Ve), {
                  modelValue: w.expression,
                  "onUpdate:modelValue": (P) => w.expression = P,
                  "aria-label": "Expression"
                }, null, 8, ["modelValue", "onUpdate:modelValue"])
              ])) : U("", !0),
              w.type === "rollup" ? (n(), b(te, { key: 6 }, [
                u("label", _s, [
                  v[17] || (v[17] = B("Of", -1)),
                  h(s(Ve), {
                    modelValue: w.of,
                    "onUpdate:modelValue": (P) => w.of = P,
                    "aria-label": "Related items"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                u("label", er, [
                  v[18] || (v[18] = B("Function", -1)),
                  h(s(Ve), {
                    modelValue: w.fn,
                    "onUpdate:modelValue": (P) => w.fn = P,
                    "aria-label": "Calculation"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                u("label", tr, [
                  v[19] || (v[19] = B("Field", -1)),
                  h(s(Ve), {
                    modelValue: w.field,
                    "onUpdate:modelValue": (P) => w.field = P,
                    "aria-label": "Calculated field"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                u("label", ar, [
                  v[20] || (v[20] = B("Order by", -1)),
                  h(s(me), {
                    "model-value": w.by,
                    "aria-label": "Rollup order",
                    options: ["rank", "time"],
                    showClear: "",
                    appendTo: "self",
                    "onUpdate:modelValue": (P) => w.by = P || void 0
                  }, null, 8, ["model-value", "onUpdate:modelValue"])
                ]),
                h(Tl, {
                  modelValue: w.where,
                  "onUpdate:modelValue": (P) => w.where = P,
                  draft: e.draft,
                  "board-id": e.boardId,
                  label: "Include related items when",
                  onValidity: (P) => l("validity", "rollup-" + ee, P)
                }, null, 8, ["modelValue", "onUpdate:modelValue", "draft", "board-id", "onValidity"])
              ], 64)) : U("", !0),
              h(Le, {
                class: "work-disclosure",
                label: "Advanced field settings"
              }, {
                default: W(() => [
                  u("div", lr, [
                    u("label", or, [
                      v[21] || (v[21] = B("Field identifier for integrations", -1)),
                      h(s(Ve), {
                        value: w.code,
                        "aria-label": "Field code",
                        required: "",
                        pattern: "[a-z][a-z0-9_]*",
                        onInput: (P) => ie(w, P.target)
                      }, null, 8, ["value", "onInput"])
                    ]),
                    u("label", ir, [
                      v[22] || (v[22] = B("Allow filters to use", -1)),
                      h(s(me), {
                        "aria-label": "Allow filters to use",
                        "model-value": w.index ?? "none",
                        "onUpdate:modelValue": (P) => w.index = P,
                        appendTo: "self",
                        options: z(w),
                        optionLabel: "label",
                        optionValue: "value"
                      }, null, 8, ["model-value", "onUpdate:modelValue", "options"])
                    ]),
                    u("section", nr, [
                      v[25] || (v[25] = u("h4", { class: "work-group-title" }, "History", -1)),
                      u("div", sr, [
                        u("div", rr, [
                          v[23] || (v[23] = u("div", { class: "work-row-main" }, [
                            u("strong", null, "Track changes"),
                            u("p", { class: "work-muted work-small" }, "Record each value change in the item history.")
                          ], -1)),
                          h(s(Je), {
                            modelValue: w.track,
                            "onUpdate:modelValue": (P) => w.track = P,
                            "aria-label": "Track changes"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        u("div", dr, [
                          v[24] || (v[24] = u("div", { class: "work-row-main" }, [
                            u("strong", null, "Track intervals"),
                            u("p", { class: "work-muted work-small" }, "Measure how long each value stays in effect.")
                          ], -1)),
                          h(s(Je), {
                            modelValue: w.intervals,
                            "onUpdate:modelValue": (P) => w.intervals = P,
                            "aria-label": "Track intervals"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ])
                      ])
                    ]),
                    !we(w) && ke(w) ? (n(), H(Ut, {
                      key: 0,
                      label: "Field configuration",
                      "model-value": w.config,
                      shape: "object",
                      "onUpdate:modelValue": (P) => w.config = P,
                      onValidity: (P) => l("validity", "config-" + ee, P)
                    }, null, 8, ["model-value", "onUpdate:modelValue", "onValidity"])) : U("", !0),
                    u("section", ur, [
                      v[26] || (v[26] = u("h4", { class: "work-group-title" }, "Access", -1)),
                      (n(), b(te, null, se(["read", "write"], (P) => h(xo, {
                        "board-id": e.boardId,
                        key: P,
                        label: P === "read" ? "Who can read" : "Who can edit",
                        "model-value": w.access?.[P],
                        "onUpdate:modelValue": (G) => w.access = { ...w.access, [P]: G },
                        onValidity: (G) => l("validity", "access-" + ee + P, G)
                      }, null, 8, ["board-id", "label", "model-value", "onUpdate:modelValue", "onValidity"])), 64))
                    ]),
                    h(s(_), {
                      label: "Remove field",
                      severity: "danger",
                      text: "",
                      disabled: !!g.value,
                      onClick: (P) => V(w)
                    }, null, 8, ["disabled", "onClick"])
                  ])
                ]),
                _: 2
              }, 1024)
            ]),
            _: 2
          }, 1032, ["title", "initial-open", "kind"]))), 128))
        ]),
        _: 1
      }, 8, ["count"])), [
        [s(k)]
      ])
    ]));
  }
}), vr = {
  class: "work-stack",
  "aria-label": "Item types editor"
}, mr = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, fr = { class: "work-definition-meta" }, pr = { class: "work-settings-grid" }, br = { class: "work-stack work-tight" }, hr = { class: "work-stack work-tight" }, gr = { class: "work-stack" }, yr = { class: "work-stack work-tight" }, kr = {
  key: 0,
  class: "work-row work-wrap"
}, wr = { class: "work-stack work-tight" }, Vr = {
  key: 1,
  class: "work-stack work-tight work-small"
}, $r = {
  key: 0,
  class: "kx-empty"
}, xr = { class: "work-row work-add-definition" }, Cr = { class: "work-stack work-tight" }, Sr = /* @__PURE__ */ $e({
  __name: "TypesEditor",
  props: {
    draft: {},
    guardRemoval: { type: Function },
    issues: {}
  },
  setup(e) {
    const a = e, t = q(() => a.draft.item_types ?? []), l = N(""), o = N(""), r = N(""), f = q(() => l.value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "").slice(0, 40)), p = q(() => !!l.value.trim());
    function c() {
      const S = /^[a-z]/.test(f.value) ? f.value : "type_" + (f.value || "new");
      let V = S.slice(0, 40), $ = 2;
      for (; t.value.some((E) => E.id === V); ) {
        const E = "_" + $++;
        V = S.slice(0, 40 - E.length) + E;
      }
      return V;
    }
    function i() {
      p.value && ((a.draft.item_types ??= []).push({ id: c(), title: l.value.trim(), process: a.draft.processes?.[0]?.id ?? "", fields: [] }), l.value = "");
    }
    function d(S, V) {
      const $ = S.id;
      S.id = V;
      for (const E of t.value) E.parent_types && (E.parent_types = E.parent_types.map((C) => C === $ ? V : C));
    }
    function m(S, V) {
      S.fields = V, S.inherit && (S.inherit = S.inherit.filter(($) => V.includes($)));
    }
    function y(S) {
      return (S.parent_types ?? []).filter((V) => typeof V == "string");
    }
    function g(S, V, $) {
      S.parent_types = $ && V.length ? [...V, !1] : V;
    }
    function x(S) {
      return t.value.filter((V) => V.id !== S.id && V.parent_types?.includes(S.id)).map((V) => V.title || Ne(V.id));
    }
    async function k(S) {
      if (!r.value) {
        if (x(S).length) {
          o.value = `${S.title || Ne(S.id)} is a parent type for ${x(S).join(", ")}. Remove those parent selections first.`;
          return;
        }
        r.value = S.id, o.value = "";
        try {
          const V = await a.guardRemoval?.("item_types", S.id);
          V ? o.value = V : ga(a.draft, "item_types", S.id);
        } finally {
          r.value = "";
        }
      }
    }
    return (S, V) => (n(), b("section", vr, [
      o.value ? (n(), b("p", mr, A(o.value), 1)) : U("", !0),
      h(Ka, {
        columns: "types",
        count: t.value.length
      }, {
        default: W(() => [
          (n(!0), b(te, null, se(t.value, ($, E) => (n(), H(Wa, {
            title: $.title || s(Ne)($.id),
            kind: e.draft.processes?.find((C) => C.id === $.process)?.name || s(Ne)($.process),
            key: E,
            class: "work-type-card"
          }, {
            usage: W(() => [
              u("span", fr, [
                h(s(Ze), {
                  class: "kx-tag-sm",
                  severity: "secondary"
                }, {
                  default: W(() => [
                    B(A($.fields.length) + " " + A($.fields.length === 1 ? "field" : "fields"), 1)
                  ]),
                  _: 2
                }, 1024),
                x($).length ? (n(), H(s(Ze), {
                  key: 0,
                  class: "kx-tag-sm",
                  severity: "secondary"
                }, {
                  default: W(() => [
                    B("Parent of " + A(x($).join(", ")), 1)
                  ]),
                  _: 2
                }, 1024)) : U("", !0)
              ])
            ]),
            default: W(() => [
              (n(!0), b(te, null, se(e.issues?.filter((C) => C.code === "item_type " + $.id) ?? [], (C) => (n(), b("p", {
                key: C.what,
                class: "work-error work-small",
                role: "alert"
              }, A(s(qa)(C)), 1))), 128)),
              u("div", pr, [
                u("label", br, [
                  V[1] || (V[1] = B("Title", -1)),
                  h(s(Ve), {
                    modelValue: $.title,
                    "onUpdate:modelValue": (C) => $.title = C,
                    placeholder: s(Ne)($.id)
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder"])
                ]),
                u("label", hr, [
                  V[2] || (V[2] = B("Workflow", -1)),
                  h(s(me), {
                    modelValue: $.process,
                    "onUpdate:modelValue": (C) => $.process = C,
                    "aria-label": "Workflow",
                    required: "",
                    appendTo: "self",
                    optionLabel: "label",
                    optionValue: "value",
                    optionDisabled: "disabled",
                    options: [...(e.draft.processes ?? []).map((C) => ({ label: C.name || s(Ne)(C.id), value: C.id, disabled: !1 }))]
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                ])
              ]),
              h(ut, {
                label: "Fields",
                options: (e.draft.fields ?? []).map((C) => ({ value: C.code, label: s(Ke)(C) })),
                "model-value": $.fields,
                "onUpdate:modelValue": (C) => m($, C)
              }, null, 8, ["options", "model-value", "onUpdate:modelValue"]),
              h(Le, {
                class: "work-disclosure",
                label: "Advanced item type settings"
              }, {
                default: W(() => [
                  u("div", gr, [
                    u("label", yr, [
                      V[3] || (V[3] = B("Identifier", -1)),
                      h(s(Ve), {
                        value: $.id,
                        onChange: (C) => d($, C.target.value),
                        required: "",
                        pattern: "[a-z][a-z0-9_]*"
                      }, null, 8, ["value", "onChange"])
                    ]),
                    V[7] || (V[7] = B()),
                    h(ut, {
                      label: "Parent types",
                      options: t.value.map((C) => ({ value: C.id, label: C.title || s(Ne)(C.id) })),
                      "model-value": y($),
                      "onUpdate:modelValue": (C) => g($, C, !!$.parent_types?.includes(!1))
                    }, null, 8, ["options", "model-value", "onUpdate:modelValue"]),
                    y($).length ? (n(), b("label", kr, [
                      h(s(Je), {
                        "model-value": !!$.parent_types?.includes(!1),
                        "aria-label": "Allow top-level items",
                        "onUpdate:modelValue": (C) => g($, y($), C)
                      }, null, 8, ["model-value", "onUpdate:modelValue"]),
                      V[4] || (V[4] = B("Allow top-level items", -1))
                    ])) : U("", !0),
                    u("div", wr, [
                      h(ut, {
                        label: "Inherit from parent",
                        options: $.fields.map((C) => ({ value: C, label: s(Ke)(e.draft.fields?.find((Z) => Z.code === C) ?? { code: C }) })),
                        modelValue: $.inherit,
                        "onUpdate:modelValue": (C) => $.inherit = C
                      }, null, 8, ["options", "modelValue", "onUpdate:modelValue"]),
                      V[5] || (V[5] = u("p", { class: "work-muted work-small" }, "These fields resolve from the parent when this item has no own value.", -1))
                    ]),
                    y($).length ? (n(), b("label", Vr, [
                      V[6] || (V[6] = B("When the parent moves", -1)),
                      h(s(me), {
                        modelValue: $.move_children,
                        "onUpdate:modelValue": (C) => $.move_children = C,
                        "aria-label": "When the parent moves",
                        appendTo: "self",
                        optionLabel: "label",
                        optionValue: "value",
                        optionDisabled: "disabled",
                        options: [{ label: "Default", value: void 0, disabled: !1 }, { label: "Move children", value: "move", disabled: !1 }, { label: "Refuse while children exist", value: "refuse", disabled: !1 }]
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ])) : U("", !0),
                    h(s(_), {
                      label: "Remove type",
                      severity: "danger",
                      text: "",
                      disabled: !!r.value,
                      onClick: (C) => k($)
                    }, null, 8, ["disabled", "onClick"])
                  ])
                ]),
                _: 2
              }, 1024)
            ]),
            _: 2
          }, 1032, ["title", "kind"]))), 128)),
          t.value.length ? U("", !0) : (n(), b("p", $r, "Add a type for the work people create, such as a delivery task or customer request.")),
          u("div", xr, [
            u("label", Cr, [
              V[8] || (V[8] = B("New item type name", -1)),
              h(s(Ve), {
                modelValue: l.value,
                "onUpdate:modelValue": V[0] || (V[0] = ($) => l.value = $),
                placeholder: "e.g. Customer request",
                onKeydown: Ae(Ie(i, ["prevent"]), ["enter"])
              }, null, 8, ["modelValue", "onKeydown"])
            ]),
            h(s(_), {
              label: "Add type",
              severity: "secondary",
              disabled: !p.value,
              onClick: i,
              outlined: ""
            }, {
              icon: W(() => [
                h(s(ue), {
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
}), Tr = ".work-process-canvas>svg{height:480px;width:100%}.work-process-canvas:focus-visible{outline:var(--p-focus-ring-width) var(--p-focus-ring-style) var(--p-focus-ring-color);outline-offset:var(--p-focus-ring-offset)}.work-state-card{fill:var(--p-content-background);stroke:var(--p-content-border-color);stroke-width:1.5}.work-graph-node.work-selected .work-state-card{stroke:var(--p-primary-color);stroke-width:2.5;fill:color-mix(in srgb,var(--p-primary-color) 6%,var(--p-content-background))}.work-graph-node:focus-visible .work-state-card{stroke:var(--p-focus-ring-color);stroke-width:var(--p-focus-ring-width)}.work-process-canvas .work-edge-label{font-size:12px;fill:var(--p-text-color)}.work-process-canvas .work-edge-label-bg{fill:var(--p-content-background);stroke:var(--p-content-border-color);stroke-width:1}.work-edge-line{stroke:var(--p-primary-color);stroke-width:1.5}.work-edge-return .work-edge-line{stroke:var(--p-text-muted-color);stroke-dasharray:5 4}.work-graph-arrow{fill:context-stroke}.work-lane-line{fill:none;stroke:var(--p-text-muted-color);stroke-width:1.5;stroke-dasharray:2 4}.work-node-connector{fill:var(--p-content-background);stroke:var(--p-primary-color);stroke-width:1.5}.work-node-connector:hover,.work-node-connector:focus-visible,.work-node-connector[aria-pressed=true]{fill:var(--p-primary-color)}.work-any-transition:focus-visible text,.work-any-transition[aria-pressed=true] text{fill:var(--p-primary-color);text-decoration:underline}.work-process-legend{position:static;flex-wrap:wrap;padding:10px 16px;border-top:1px solid var(--p-content-border-color);background:var(--p-content-background)}@media(max-width:700px){.work-process-canvas>svg{height:420px}}.work-process-more{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:8px;padding:8px 16px;border-top:1px solid var(--p-content-border-color);background:var(--p-content-background);color:var(--p-text-muted-color);font-size:12px}.work-process-canvas .work-graph-edge.work-selected .work-edge-label-bg{fill:var(--p-primary-color);stroke:var(--p-primary-color)}.work-process-canvas .work-graph-edge.work-selected .work-edge-label{fill:var(--p-primary-contrast-color)}", lo = /* @__PURE__ */ new WeakSet();
function Ir(e) {
  const a = e.getRootNode();
  if (a instanceof ShadowRoot && !lo.has(a)) {
    const t = e.ownerDocument.createElement("style");
    t.textContent = Tr, a.append(t), lo.add(a);
  }
}
const Bo = 0.8;
function Dr(e, a, t) {
  const l = Math.min(1, a.width / e.width, a.height / e.height);
  if (l >= Bo) return { zoom: l, pan: { x: (e.width - a.width / l) / 2, y: (e.height - a.height / l) / 2 } };
  const o = e.nodes.find((f) => f.state.id === t) ?? e.nodes[0], r = Math.min(1, a.width / ((o?.width ?? 190) + 64));
  return { zoom: r, pan: o ? { x: e.direction === "TB" ? o.x - a.width / r / 2 : o.x - o.width / 2 - 32, y: e.direction === "TB" ? o.y - o.height / 2 - 32 : o.y - a.height / r / 2 } : { x: 0, y: 0 } };
}
const Ur = ["onKeydown"], Er = {
  key: 0,
  class: "work-process-instruction",
  role: "status"
}, Ar = ["viewBox"], Or = ["id"], Pr = ["d", "marker-end"], Rr = ["aria-label", "aria-pressed", "aria-keyshortcuts", "onKeydown", "onFocus", "onClick"], Nr = ["d"], Mr = ["d", "marker-end"], Fr = ["x", "y", "width", "height"], Lr = ["x", "y"], Br = ["x", "dy"], zr = ["aria-label", "aria-pressed", "onClick", "onKeydown", "onFocus", "onPointerup"], jr = ["x", "y", "width", "height"], qr = ["cx", "cy"], Wr = ["x", "y"], Kr = ["x", "dy"], Gr = ["x", "y"], Hr = ["x", "dy"], Yr = {
  key: 0,
  class: "work-limit-text"
}, Xr = ["aria-label", "aria-pressed", "aria-keyshortcuts", "onFocus", "onKeydown", "onClick"], Jr = ["x", "y"], Zr = ["x", "dy"], Qr = ["cx", "cy", "aria-label", "aria-pressed", "onFocus", "onPointerdown", "onClick", "onKeydown"], _r = ["d"], ed = {
  key: 1,
  class: "work-process-more",
  role: "status"
}, td = { class: "work-process-legend" }, ad = /* @__PURE__ */ $e({
  __name: "ProcessGraph",
  props: {
    process: {},
    draft: {},
    selectedState: {},
    selectedTransition: {},
    fitOnOpen: { type: Boolean }
  },
  emits: ["state", "transition", "connect", "removeTransition", "clear"],
  setup(e, { expose: a, emit: t }) {
    const l = e, o = t, r = ja().replace(/:/g, "_"), f = N(""), p = N(), c = N();
    let i;
    const d = N(900), m = N(!1), y = q(() => d.value < 700 ? 420 : 480), g = q(() => Ei(l.process, l.draft, {
      width: d.value,
      height: y.value,
      direction: l.fitOnOpen ? "TB" : void 0
    })), x = N(1), k = N({ x: 0, y: 0 }), S = N({ x: 0, y: 0 }), V = q(() => {
      const T = Math.min(1, d.value / g.value.width);
      return l.fitOnOpen ? Math.max(Bo, T) : T;
    }), $ = q(() => ({
      width: d.value,
      height: m.value ? Math.max(y.value, Math.ceil(g.value.height * V.value)) : y.value
    })), E = q(() => g.value.nodes.filter((T) => T.x - T.width / 2 >= k.value.x && T.x + T.width / 2 <= k.value.x + $.value.width / x.value && T.y - T.height / 2 >= k.value.y && T.y + T.height / 2 <= k.value.y + $.value.height / x.value).length);
    function C() {
      m.value = !1;
      const T = Dr(g.value, $.value, l.process.initial);
      x.value = T.zoom, k.value = T.pan;
    }
    const Z = q(() => `${k.value.x} ${k.value.y} ${$.value.width / x.value} ${$.value.height / x.value}`), Q = q(() => g.value.nodes.find((T) => T.state.id === f.value));
    function K() {
      m.value = !0, x.value = V.value;
      const T = $.value.width / x.value, X = g.value.nodes.find((I) => I.state.id === l.process.initial);
      k.value = {
        x: g.value.width > T && X ? X.x - T / 2 : (g.value.width - T) / 2,
        y: 0
      };
    }
    function ce(T) {
      l.fitOnOpen && (m.value = !1);
      const X = Math.max(0.02, Math.min(3, x.value * T)), I = 1 / x.value - 1 / X;
      k.value = { x: k.value.x + $.value.width * I / 2, y: k.value.y + $.value.height * I / 2 }, x.value = X;
    }
    function ve(T) {
      const X = $.value.width / x.value, I = $.value.height / x.value;
      (T.x - T.width / 2 < k.value.x || T.x + T.width / 2 > k.value.x + X || T.y - T.height / 2 < k.value.y || T.y + T.height / 2 > k.value.y + I) && (k.value = { x: T.x - X / 2, y: T.y - I / 2 });
    }
    function we() {
      const T = g.value.nodes.find((X) => X.state === l.selectedState) ?? g.value.edges.find((X) => X.transition === l.selectedTransition);
      if (!T) {
        l.fitOnOpen && m.value && K();
        return;
      }
      ve(T);
    }
    De([g, () => l.selectedState, () => l.selectedTransition], we, { flush: "post" });
    function ke() {
      l.fitOnOpen ? K() : C();
    }
    De(() => l.process.id, () => {
      de(), ke();
    }, { flush: "post" });
    function z(T) {
      if (T.target !== p.value) return;
      (T.key === "+" || T.key === "=") && (T.preventDefault(), ce(1.2)), T.key === "-" && (T.preventDefault(), ce(1 / 1.2)), T.key === "0" && (T.preventDefault(), K());
      const X = 60 / x.value;
      T.key.startsWith("Arrow") && (T.preventDefault(), k.value = { x: k.value.x + (T.key === "ArrowRight" ? X : T.key === "ArrowLeft" ? -X : 0), y: k.value.y + (T.key === "ArrowDown" ? X : T.key === "ArrowUp" ? -X : 0) });
    }
    function O(T, X) {
      const I = X.currentTarget;
      if (!f.value) o("state", T, I);
      else if (f.value !== T.id) {
        const oe = f.value;
        f.value = "", o("connect", oe, T.id, I);
      }
    }
    function L(T) {
      f.value = T.state.id, S.value = { x: g.value.direction === "TB" ? T.x : T.x + T.width / 2, y: g.value.direction === "TB" ? T.y + T.height / 2 : T.y };
    }
    function D(T, X) {
      if (T.pointerType === "touch" || T.button !== 0) return;
      i = T.pointerId, L(X);
      const I = T.currentTarget;
      I.hasPointerCapture?.(T.pointerId) && I.releasePointerCapture(T.pointerId);
    }
    function M(T, X) {
      i === T.pointerId && (i = void 0, !(!f.value || f.value === X.id) && O(X, T));
    }
    function re(T, X) {
      if ((T.key === "Enter" || T.key === " ") && (T.preventDefault(), O(X, T)), ["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp"].includes(T.key)) {
        T.preventDefault();
        const I = Array.from(c.value?.querySelectorAll(".work-graph-node") ?? []), oe = g.value.nodes.findIndex((be) => be.state === X), ge = ["ArrowRight", "ArrowDown"].includes(T.key) ? 1 : -1;
        I[(oe + ge + I.length) % I.length]?.focus();
      }
    }
    function ie(T, X) {
      l.selectedTransition === X && o("removeTransition", T);
    }
    function de() {
      f.value = "", i = void 0, Se.clear(), j = 0;
    }
    function ne() {
      de(), o("clear");
    }
    const Se = /* @__PURE__ */ new Map();
    let j = 0;
    function v(T) {
      if (!T.target.closest('[role="button"]') && (Se.set(T.pointerId, { x: T.clientX, y: T.clientY }), p.value?.setPointerCapture?.(T.pointerId), Se.size === 2)) {
        const [X, I] = [...Se.values()];
        j = Math.hypot(X.x - I.x, X.y - I.y);
      }
    }
    function w(T) {
      const X = c.value?.getBoundingClientRect();
      if (!X?.width) return;
      if (i === T.pointerId && f.value) {
        S.value = { x: k.value.x + (T.clientX - X.left) * $.value.width / x.value / X.width, y: k.value.y + (T.clientY - X.top) * $.value.height / x.value / X.height };
        return;
      }
      const I = Se.get(T.pointerId);
      if (I)
        if (Se.set(T.pointerId, { x: T.clientX, y: T.clientY }), Se.size === 2) {
          const [oe, ge] = [...Se.values()], be = Math.hypot(oe.x - ge.x, oe.y - ge.y);
          j && ce(be / j), j = be;
        } else k.value = { x: k.value.x - (T.clientX - I.x) * $.value.width / x.value / X.width, y: k.value.y - (T.clientY - I.y) * $.value.height / x.value / X.height };
    }
    function ee(T) {
      i === T.pointerId && (f.value = "", i = void 0);
    }
    function P(T) {
      Se.delete(T.pointerId), j = 0, ee(T);
    }
    function G(T) {
      T.ctrlKey && (T.preventDefault(), ce(Math.exp(-T.deltaY * 0.01)));
    }
    let R;
    ha(() => {
      if (p.value && Ir(p.value), typeof ResizeObserver < "u" && c.value) {
        let T = !0;
        R = new ResizeObserver(() => {
          const X = c.value?.getBoundingClientRect();
          if (!X?.width || !X.height) return;
          const I = $.value.width;
          d.value = X.width, (T || Math.abs(X.width - I) > 1) && (T ? ke() : m.value ? K() : C(), T = !1), we();
        }), R.observe(c.value);
      }
    }), Vt(() => R?.disconnect()), a({ fit: K, focus: () => p.value?.focus(), zoomIn: () => ce(1.2), zoomOut: () => ce(1 / 1.2) });
    function F(T) {
      return T.category === "completed" ? "check" : T.category === "canceled" ? "x" : T.id === l.process.initial ? "arrow-bar-to-right" : { gate: "shield-check", automated: "bolt", parallel: "arrows-split" }[T.kind ?? ""] ?? "user";
    }
    return (T, X) => (n(), b("section", {
      ref_key: "canvas",
      ref: p,
      class: vt(["work-process-canvas", { "work-process-scrollable": e.fitOnOpen && m.value }]),
      "aria-label": "Process map",
      tabindex: "0",
      onKeydown: [
        z,
        Ae(Ie(ne, ["stop"]), ["esc"])
      ],
      onPointerdown: v,
      onPointermove: w,
      onPointerup: P,
      onPointerleave: ee,
      onPointercancel: de,
      onWheel: G
    }, [
      f.value ? (n(), b("p", Er, "Choose the next stop. Escape cancels.")) : U("", !0),
      (n(), b("svg", {
        ref_key: "svg",
        ref: c,
        style: ii({ height: $.value.height + "px" }),
        viewBox: Z.value,
        role: "group",
        "aria-label": "States and transitions"
      }, [
        u("defs", null, [
          u("marker", {
            id: s(r) + "-arrow",
            viewBox: "0 0 8 8",
            refX: "7",
            refY: "4",
            markerWidth: "6",
            markerHeight: "6",
            orient: "auto"
          }, [...X[1] || (X[1] = [
            u("path", {
              d: "M0 0 L8 4 L0 8 z",
              class: "work-graph-arrow"
            }, null, -1)
          ])], 8, Or)
        ]),
        (n(!0), b(te, null, se(g.value.parallels, (I) => (n(), b("path", {
          key: I.key,
          d: I.path,
          class: "work-lane-line",
          "marker-end": `url(#${s(r)}-arrow)`
        }, [
          u("title", null, "Parallel lane from " + A(s(ye)(I.state)), 1)
        ], 8, Pr))), 128)),
        (n(!0), b(te, null, se(g.value.edges, (I) => (n(), b("g", {
          key: I.key,
          class: vt(["work-graph-edge", ["work-edge-" + I.type, { "work-selected": e.selectedTransition === I.transition }]]),
          role: "button",
          tabindex: "0",
          "aria-label": "Edit transition " + s(ze)(I.transition),
          "aria-pressed": e.selectedTransition === I.transition,
          "aria-keyshortcuts": e.selectedTransition === I.transition ? "Delete Backspace" : void 0,
          onKeydown: [
            Ae((oe) => ie(oe, I.transition), ["delete"]),
            Ae((oe) => ie(oe, I.transition), ["backspace"]),
            Ae(Ie((oe) => o("transition", I.transition, oe.currentTarget), ["prevent"]), ["enter"]),
            Ae(Ie((oe) => o("transition", I.transition, oe.currentTarget), ["prevent"]), ["space"])
          ],
          onFocus: (oe) => ve(I),
          onClick: (oe) => o("transition", I.transition, oe.currentTarget)
        }, [
          u("path", {
            d: I.path,
            class: "work-edge-hit"
          }, null, 8, Nr),
          u("path", {
            d: I.path,
            class: "work-edge-line",
            "marker-end": `url(#${s(r)}-arrow)`
          }, null, 8, Mr),
          u("rect", {
            x: I.x - I.width / 2,
            y: I.y - I.height / 2,
            width: I.width,
            height: I.height,
            rx: "6",
            class: "work-edge-label-bg"
          }, null, 8, Fr),
          u("text", {
            x: I.x,
            y: I.y - (I.lines.length - 1) * 8 + 4,
            class: "work-edge-label",
            "text-anchor": "middle"
          }, [
            (n(!0), b(te, null, se(I.lines, (oe, ge) => (n(), b("tspan", {
              key: ge,
              x: I.x,
              dy: ge ? 16 : 0
            }, A(oe), 9, Br))), 128))
          ], 8, Lr)
        ], 42, Rr))), 128)),
        (n(!0), b(te, null, se(g.value.nodes, (I) => (n(), b("g", {
          key: I.state.id,
          class: vt(["work-graph-node", ["work-stop-" + I.state.category, { "work-selected": e.selectedState === I.state }]]),
          role: "button",
          tabindex: "0",
          "aria-label": "Edit state " + s(ye)(I.state),
          "aria-pressed": e.selectedState === I.state,
          onClick: (oe) => O(I.state, oe),
          onKeydown: (oe) => re(oe, I.state),
          onFocus: (oe) => ve(I),
          onPointerup: (oe) => M(oe, I.state)
        }, [
          u("rect", {
            x: I.x - I.width / 2,
            y: I.y - I.height / 2,
            width: I.width,
            height: I.height,
            rx: "10",
            class: "work-state-card"
          }, null, 8, jr),
          u("circle", {
            cx: I.x - I.width / 2 + 22,
            cy: I.y - I.height / 2 + 25,
            r: "10",
            class: "work-stop-ring"
          }, null, 8, qr),
          h(s(ue), {
            icon: "tabler:" + F(I.state),
            x: I.x - I.width / 2 + 15,
            y: I.y - I.height / 2 + 18,
            width: "14",
            height: "14",
            class: "work-stop-icon",
            "aria-hidden": "true"
          }, null, 8, ["icon", "x", "y"]),
          u("text", {
            x: I.x - I.width / 2 + 42,
            y: I.y - I.height / 2 + 29,
            class: "work-node-name"
          }, [
            (n(!0), b(te, null, se(I.title, (oe, ge) => (n(), b("tspan", {
              key: ge,
              x: I.x - I.width / 2 + 42,
              dy: ge ? 18 : 0
            }, A(oe), 9, Kr))), 128))
          ], 8, Wr),
          u("text", {
            x: I.x - I.width / 2 + 16,
            y: I.y - I.height / 2 + 33 + I.title.length * 18,
            class: "work-node-meta"
          }, [
            (n(!0), b(te, null, se(I.caption, (oe, ge) => (n(), b("tspan", {
              key: ge,
              x: I.x - I.width / 2 + 16,
              dy: ge ? 16 : 0
            }, A(oe), 9, Hr))), 128)),
            e.draft.policy?.wip?.[I.state.id] ? (n(), b("tspan", Yr, " · limit " + A(e.draft.policy.wip[I.state.id].limit), 1)) : U("", !0)
          ], 8, Gr),
          (n(!0), b(te, null, se(I.badges, (oe, ge) => (n(), b("g", {
            key: oe.id,
            class: "work-any-transition",
            role: "button",
            tabindex: "0",
            "aria-label": "Edit transition " + s(ze)(oe),
            "aria-pressed": e.selectedTransition === oe,
            "aria-keyshortcuts": e.selectedTransition === oe ? "Delete Backspace" : void 0,
            onFocus: (be) => ve(I),
            onKeydown: [
              Ae((be) => ie(be, oe), ["delete"]),
              Ae((be) => ie(be, oe), ["backspace"]),
              Ae(Ie((be) => o("transition", oe, be.currentTarget), ["stop", "prevent"]), ["enter"]),
              Ae(Ie((be) => o("transition", oe, be.currentTarget), ["stop", "prevent"]), ["space"])
            ],
            onClick: Ie((be) => o("transition", oe, be.currentTarget), ["stop"])
          }, [
            u("text", {
              x: I.x - I.width / 2 + 16,
              y: I.y - I.height / 2 + 33 + I.title.length * 18 + I.caption.length * 16 + I.badges.slice(0, ge).reduce((be, Ue) => be + s(Zt)(s(ze)(Ue) + " works from any state").length * 18, 0),
              class: "work-node-meta"
            }, [
              (n(!0), b(te, null, se(s(Zt)(s(ze)(oe) + " works from any state"), (be, Ue) => (n(), b("tspan", {
                key: Ue,
                x: I.x - I.width / 2 + 16,
                dy: Ue ? 18 : 0
              }, A(be), 9, Zr))), 128))
            ], 8, Jr)
          ], 40, Xr))), 128)),
          ["completed", "canceled"].includes(I.state.category) ? U("", !0) : (n(), b("circle", {
            key: 0,
            cx: g.value.direction === "TB" ? I.x : I.x + I.width / 2,
            cy: g.value.direction === "TB" ? I.y + I.height / 2 : I.y,
            r: "9",
            class: "work-node-connector",
            role: "button",
            tabindex: "0",
            "aria-label": "Connect from " + s(ye)(I.state),
            "aria-pressed": f.value === I.state.id,
            onFocus: (oe) => ve(I),
            onPointerdown: Ie((oe) => D(oe, I), ["stop"]),
            onClick: Ie((oe) => L(I), ["stop"]),
            onKeydown: [
              Ae(Ie((oe) => L(I), ["stop", "prevent"]), ["enter"]),
              Ae(Ie((oe) => L(I), ["stop", "prevent"]), ["space"])
            ]
          }, null, 40, Qr))
        ], 42, zr))), 128)),
        Q.value ? (n(), b("path", {
          key: 0,
          d: `M ${g.value.direction === "TB" ? Q.value.x : Q.value.x + Q.value.width / 2} ${g.value.direction === "TB" ? Q.value.y + Q.value.height / 2 : Q.value.y} L ${S.value.x} ${S.value.y}`,
          class: "work-connect-ghost"
        }, null, 8, _r)) : U("", !0)
      ], 12, Ar)),
      E.value < e.process.states.length ? (n(), b("div", ed, [
        u("span", null, A(E.value) + " of " + A(e.process.states.length) + " states in view · Pan to see more", 1),
        m.value ? U("", !0) : (n(), H(s(_), {
          key: 0,
          label: "Fit map",
          size: "small",
          text: "",
          onClick: X[0] || (X[0] = (I) => K())
        }))
      ])) : U("", !0),
      u("div", td, [
        u("span", null, A(e.process.states.length) + " states · " + A(Math.round(x.value * 100)) + "%", 1),
        X[2] || (X[2] = u("span", null, [
          u("i"),
          B("Transition")
        ], -1)),
        X[3] || (X[3] = u("span", null, [
          u("i", { class: "work-return-key" }),
          B("Return / loop")
        ], -1)),
        X[4] || (X[4] = u("span", null, "Drag to pan · Ctrl + scroll to zoom · Fit to reset the view", -1))
      ])
    ], 42, Ur));
  }
}), ld = {
  class: "work-process-list work-stack",
  "aria-label": "Process list"
}, od = { class: "work-table-scroll" }, id = {
  class: "work-settings-table work-process-table",
  role: "table",
  "aria-label": "States"
}, nd = { role: "rowgroup" }, sd = ["aria-selected"], rd = { role: "cell" }, dd = {
  key: 0,
  class: "work-muted work-small"
}, ud = { role: "cell" }, cd = { role: "cell" }, vd = {
  role: "cell",
  class: "work-process-list-actions"
}, md = { class: "work-table-scroll" }, fd = {
  class: "work-settings-table work-process-table",
  role: "table",
  "aria-label": "Transitions"
}, pd = { role: "rowgroup" }, bd = ["aria-selected"], hd = { role: "cell" }, gd = {
  key: 0,
  class: "work-muted"
}, yd = { role: "cell" }, kd = { role: "cell" }, wd = {
  role: "cell",
  class: "work-process-list-actions"
}, Vd = /* @__PURE__ */ $e({
  __name: "ProcessList",
  props: {
    process: {},
    selectedState: {},
    selectedTransition: {},
    counts: {}
  },
  emits: ["state", "transition", "removeState", "removeTransition"],
  setup(e) {
    return (a, t) => (n(), b("section", ld, [
      t[6] || (t[6] = u("h3", null, "States", -1)),
      u("div", od, [
        u("table", id, [
          t[2] || (t[2] = u("thead", { role: "rowgroup" }, [
            u("tr", { role: "row" }, [
              u("th", {
                role: "columnheader",
                scope: "col"
              }, "Name"),
              u("th", {
                role: "columnheader",
                scope: "col"
              }, "Phase"),
              u("th", {
                role: "columnheader",
                scope: "col"
              }, "Kind"),
              u("th", {
                role: "columnheader",
                scope: "col"
              }, "Actions")
            ])
          ], -1)),
          u("tbody", nd, [
            (n(!0), b(te, null, se(e.process.states, (l) => (n(), b("tr", {
              key: l.id,
              "aria-selected": e.selectedState === l,
              role: "row"
            }, [
              u("td", rd, [
                h(s(Ve), {
                  modelValue: l.name,
                  "onUpdate:modelValue": (o) => l.name = o,
                  "aria-label": "Name of " + s(ye)(l)
                }, null, 8, ["modelValue", "onUpdate:modelValue", "aria-label"]),
                e.counts ? (n(), b("p", dd, A(e.counts[l.id] ?? 0) + " here", 1)) : U("", !0)
              ]),
              u("td", ud, [
                t[0] || (t[0] = u("span", {
                  class: "work-process-cell-label",
                  "aria-hidden": "true"
                }, "Phase", -1)),
                B(A(s(qt)(l.category)), 1)
              ]),
              u("td", cd, [
                t[1] || (t[1] = u("span", {
                  class: "work-process-cell-label",
                  "aria-hidden": "true"
                }, "Kind", -1)),
                h(s(Ze), { severity: "secondary" }, {
                  default: W(() => [
                    B(A(s(Ra)(l.kind)), 1)
                  ]),
                  _: 2
                }, 1024)
              ]),
              u("td", vd, [
                h(s(_), {
                  size: "small",
                  text: "",
                  severity: "secondary",
                  "aria-label": "Edit state " + s(ye)(l),
                  onClick: (o) => a.$emit("state", l, o.currentTarget)
                }, {
                  default: W(() => [
                    h(s(ue), { icon: "tabler:pencil" })
                  ]),
                  _: 1
                }, 8, ["aria-label", "onClick"]),
                h(s(_), {
                  size: "small",
                  text: "",
                  severity: "danger",
                  "aria-label": "Remove state " + s(ye)(l),
                  onClick: (o) => a.$emit("removeState", l)
                }, {
                  default: W(() => [
                    h(s(ue), { icon: "tabler:trash" })
                  ]),
                  _: 1
                }, 8, ["aria-label", "onClick"])
              ])
            ], 8, sd))), 128))
          ])
        ])
      ]),
      t[7] || (t[7] = u("h3", null, "Transitions", -1)),
      u("div", md, [
        u("table", fd, [
          t[5] || (t[5] = u("thead", { role: "rowgroup" }, [
            u("tr", { role: "row" }, [
              u("th", {
                role: "columnheader",
                scope: "col"
              }, "Name"),
              u("th", {
                role: "columnheader",
                scope: "col"
              }, "From"),
              u("th", {
                role: "columnheader",
                scope: "col"
              }, "To"),
              u("th", {
                role: "columnheader",
                scope: "col"
              }, "Actions")
            ])
          ], -1)),
          u("tbody", pd, [
            (n(!0), b(te, null, se(e.process.transitions ?? [], (l) => (n(), b("tr", {
              key: l.id,
              "aria-selected": e.selectedTransition === l,
              role: "row"
            }, [
              u("td", hd, [
                h(s(Ve), {
                  modelValue: l.name,
                  "onUpdate:modelValue": (o) => l.name = o,
                  placeholder: s(ze)(l),
                  "aria-label": "Name of " + s(ze)(l)
                }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder", "aria-label"]),
                l.when || l.require?.length || l.guards?.length ? (n(), b("p", gd, "Has requirements")) : U("", !0)
              ]),
              u("td", yd, [
                t[3] || (t[3] = u("span", {
                  class: "work-process-cell-label",
                  "aria-hidden": "true"
                }, "From", -1)),
                B(" " + A(l.from === "any" ? "Any state" : l.from.map((o) => s(ye)(e.process.states.find((r) => r.id === o))).join(", ")), 1)
              ]),
              u("td", kd, [
                t[4] || (t[4] = u("span", {
                  class: "work-process-cell-label",
                  "aria-hidden": "true"
                }, "To", -1)),
                B(A(s(ye)(e.process.states.find((o) => o.id === l.to))), 1)
              ]),
              u("td", wd, [
                h(s(_), {
                  size: "small",
                  text: "",
                  severity: "secondary",
                  "aria-label": "Edit transition " + s(ze)(l),
                  onClick: (o) => a.$emit("transition", l, o.currentTarget)
                }, {
                  default: W(() => [
                    h(s(ue), { icon: "tabler:pencil" })
                  ]),
                  _: 1
                }, 8, ["aria-label", "onClick"]),
                h(s(_), {
                  size: "small",
                  text: "",
                  severity: "danger",
                  "aria-label": "Remove transition " + s(ze)(l),
                  onClick: (o) => a.$emit("removeTransition", l)
                }, {
                  default: W(() => [
                    h(s(ue), { icon: "tabler:trash" })
                  ]),
                  _: 1
                }, 8, ["aria-label", "onClick"])
              ])
            ], 8, bd))), 128))
          ])
        ])
      ])
    ]));
  }
}), $d = { class: "work-stack work-transition-settings" }, xd = { class: "work-stack work-tight" }, Cd = { class: "work-row" }, Sd = { key: 0 }, Td = { class: "work-stack" }, Id = { class: "work-row" }, Dd = { class: "work-row" }, Ud = { class: "work-stack work-tight" }, Ed = { class: "work-row" }, Ad = { class: "work-stack work-tight" }, Od = { class: "work-stack work-tight" }, Pd = /* @__PURE__ */ $e({
  __name: "TransitionSettings",
  props: {
    transition: {},
    process: {},
    draft: {},
    boardId: {},
    guards: {}
  },
  emits: ["validity"],
  setup(e, { emit: a }) {
    const t = e, l = a;
    function o() {
      (t.transition.set ??= []).push({ field: t.draft.fields?.[0]?.code ?? "", value: "" });
    }
    function r(f, p) {
      const c = t.transition.set?.[f];
      !c || !t.transition.set || (t.transition.set[f] = { field: c.field, ...p === "clear" ? { clear: !0 } : p === "copy" ? { copy: "" } : { value: "" } });
    }
    return (f, p) => (n(), b("div", $d, [
      u("label", xd, [
        p[15] || (p[15] = B("To state", -1)),
        h(s(me), {
          modelValue: e.transition.to,
          "onUpdate:modelValue": p[0] || (p[0] = (c) => e.transition.to = c),
          "aria-label": "To state",
          appendTo: "self",
          optionLabel: "label",
          optionValue: "value",
          options: e.process.states.map((c) => ({ label: s(ye)(c), value: c.id }))
        }, null, 8, ["modelValue", "options"])
      ]),
      u("label", Cd, [
        p[16] || (p[16] = u("span", { class: "work-spacer" }, "Works from any state", -1)),
        h(s(Je), {
          "model-value": e.transition.from === "any",
          "aria-label": "Works from any state",
          "onUpdate:modelValue": p[1] || (p[1] = (c) => e.transition.from = c ? "any" : [])
        }, null, 8, ["model-value"])
      ]),
      e.transition.from !== "any" ? (n(), H(ut, {
        key: 0,
        label: "From states",
        options: e.process.states.map((c) => ({ value: c.id, label: s(ye)(c) })),
        modelValue: e.transition.from,
        "onUpdate:modelValue": p[2] || (p[2] = (c) => e.transition.from = c)
      }, null, 8, ["options", "modelValue"])) : U("", !0),
      p[24] || (p[24] = u("h4", { class: "work-process-group" }, "Must be filled", -1)),
      h(ut, {
        label: "Required fields",
        options: e.draft.fields?.map((c) => ({ value: c.code, label: c.title || c.code })) ?? [],
        modelValue: e.transition.require,
        "onUpdate:modelValue": p[3] || (p[3] = (c) => e.transition.require = c)
      }, null, 8, ["options", "modelValue"]),
      p[25] || (p[25] = u("h4", { class: "work-process-group" }, "Only when", -1)),
      h(Tl, {
        label: "Allow this transition when",
        draft: e.draft,
        "board-id": e.boardId,
        "model-value": e.transition.when,
        "onUpdate:modelValue": p[4] || (p[4] = (c) => e.transition.when = c),
        onValidity: p[5] || (p[5] = (c) => l("validity", "when", c))
      }, null, 8, ["draft", "board-id", "model-value"]),
      e.guards?.length || e.transition.guards?.length ? (n(), H(ut, {
        key: 1,
        label: "Installed checks",
        options: [...(e.guards ?? []).map((c) => ({ value: c.id, label: c.title })), ...(e.transition.guards ?? []).filter((c) => !e.guards?.some((i) => i.id === c)).map((c) => ({ value: c, label: e.guards ? "Unavailable check" : "Configured check" }))],
        modelValue: e.transition.guards,
        "onUpdate:modelValue": p[6] || (p[6] = (c) => e.transition.guards = c)
      }, null, 8, ["options", "modelValue"])) : U("", !0),
      (n(!0), b(te, null, se(e.guards?.filter((c) => e.transition.guards?.includes(c.id)) ?? [], (c) => (n(), b("p", {
        key: c.id,
        class: "work-muted work-small"
      }, [
        B(A(c.description || c.title + " can stop this transition.") + " ", 1),
        c.reads?.length ? (n(), b("span", Sd, " Checks " + A(c.reads.map((i) => e.draft.fields?.find((d) => d.code === i)?.title || "a configured field").join(", ")) + ".", 1)) : U("", !0)
      ]))), 128)),
      h(Le, {
        class: "work-disclosure",
        label: "Advanced transition settings"
      }, {
        default: W(() => [
          u("div", Td, [
            u("label", Id, [
              p[17] || (p[17] = u("span", { class: "work-spacer" }, "Happens automatically", -1)),
              h(s(Je), {
                "model-value": e.transition.auto,
                "onUpdate:modelValue": p[7] || (p[7] = (c) => {
                  e.transition.auto = c, c || delete e.transition.default;
                }),
                "aria-label": "Automatic transition"
              }, null, 8, ["model-value"])
            ]),
            u("label", Dd, [
              p[18] || (p[18] = u("span", { class: "work-spacer" }, "Default automatic transition", -1)),
              h(s(Je), {
                modelValue: e.transition.default,
                "onUpdate:modelValue": p[8] || (p[8] = (c) => e.transition.default = c),
                disabled: !e.transition.auto,
                "aria-label": "Default transition"
              }, null, 8, ["modelValue", "disabled"])
            ]),
            p[23] || (p[23] = u("h4", { class: "work-process-group" }, "Also sets", -1)),
            (n(!0), b(te, null, se(e.transition.set ?? [], (c, i) => (n(), b("div", {
              key: i,
              class: "work-process-value work-stack work-tight"
            }, [
              u("label", Ud, [
                p[19] || (p[19] = B("Field", -1)),
                h(s(me), {
                  modelValue: c.field,
                  "onUpdate:modelValue": (d) => c.field = d,
                  appendTo: "self",
                  optionLabel: "label",
                  optionValue: "value",
                  options: e.draft.fields?.map((d) => ({ value: d.code, label: d.title || d.code })) ?? []
                }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
              ]),
              u("div", Ed, [
                h(s(me), {
                  "model-value": c.clear ? "clear" : c.copy !== void 0 ? "copy" : "value",
                  "aria-label": "Value action",
                  appendTo: "self",
                  options: [
                    { label: "Set value", value: "value" },
                    { label: "Clear value", value: "clear" },
                    { label: "Copy field", value: "copy" }
                  ],
                  optionLabel: "label",
                  optionValue: "value",
                  "onUpdate:modelValue": (d) => r(i, d)
                }, null, 8, ["model-value", "onUpdate:modelValue"]),
                h(s(_), {
                  text: "",
                  severity: "danger",
                  "aria-label": "Remove value " + (i + 1),
                  onClick: (d) => e.transition.set?.splice(i, 1)
                }, {
                  default: W(() => [
                    h(s(ue), { icon: "tabler:trash" })
                  ]),
                  _: 1
                }, 8, ["aria-label", "onClick"])
              ]),
              c.copy !== void 0 ? (n(), H(s(me), {
                key: 0,
                modelValue: c.copy,
                "onUpdate:modelValue": (d) => c.copy = d,
                "aria-label": "Copy from field",
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                options: e.draft.fields?.map((d) => ({ value: d.code, label: d.title || d.code })) ?? []
              }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])) : c.clear ? U("", !0) : (n(!0), b(te, { key: 1 }, se(e.draft.fields?.filter((d) => d.code === c.field) ?? [], (d) => (n(), H($o, {
                key: d.code,
                "board-id": e.boardId ?? "",
                field: d,
                modelValue: c.value,
                "onUpdate:modelValue": (m) => c.value = m,
                onValidity: (m) => l("validity", "effect-" + i, m)
              }, null, 8, ["board-id", "field", "modelValue", "onUpdate:modelValue", "onValidity"]))), 128))
            ]))), 128)),
            h(s(_), {
              label: "Add value",
              severity: "secondary",
              outlined: "",
              size: "small",
              onClick: o
            }, {
              icon: W(() => [
                h(s(ue), { icon: "tabler:plus" })
              ]),
              _: 1
            }),
            u("label", Ad, [
              p[20] || (p[20] = B("Offer to people", -1)),
              h(s(me), {
                "model-value": e.transition.people,
                "aria-label": "Offer to people",
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                options: [{ label: "Work default", value: void 0 }, { label: "Offer explicitly", value: !0 }, { label: "Process engine only", value: !1 }],
                "onUpdate:modelValue": p[9] || (p[9] = (c) => e.transition.people = c)
              }, null, 8, ["model-value"]),
              p[21] || (p[21] = u("span", { class: "work-muted work-small" }, "Work default can hide a stage route from the list while still allowing it by name. Process engine only reserves the route for the engine and board administrators using force.", -1))
            ]),
            u("label", Od, [
              p[22] || (p[22] = B("Evaluation order", -1)),
              h(s(yt), {
                "model-value": e.transition.order ?? null,
                "aria-label": "Transition order",
                min: 0,
                useGrouping: !1,
                "onUpdate:modelValue": p[10] || (p[10] = (c) => e.transition.order = c ?? void 0)
              }, null, 8, ["model-value"])
            ]),
            h(Ut, {
              label: "Set values",
              "model-value": e.transition.set,
              shape: "array",
              "onUpdate:modelValue": p[11] || (p[11] = (c) => e.transition.set = c),
              onValidity: p[12] || (p[12] = (c) => l("validity", "set", c))
            }, null, 8, ["model-value"]),
            h(Ut, {
              label: "Guards",
              "model-value": e.transition.guards,
              shape: "array",
              "onUpdate:modelValue": p[13] || (p[13] = (c) => e.transition.guards = c),
              onValidity: p[14] || (p[14] = (c) => l("validity", "guards", c))
            }, null, 8, ["model-value"])
          ])
        ]),
        _: 1
      })
    ]));
  }
}), oo = /* @__PURE__ */ $e({
  __name: "CapacityControl",
  props: {
    draft: {},
    state: {},
    label: {},
    hard: { type: Boolean }
  },
  setup(e) {
    const a = e, t = q(() => a.draft.policy?.wip?.[a.state]);
    function l(r) {
      if (r === null) {
        a.draft.policy?.wip && delete a.draft.policy.wip[a.state];
        return;
      }
      const f = a.draft.policy ??= {}, p = f.wip ??= {};
      p[a.state] = { ...p[a.state], limit: r };
    }
    function o(r) {
      t.value && (t.value.hard = r);
    }
    return (r, f) => e.hard ? (n(), H(s(Je), {
      key: 0,
      "aria-label": e.label,
      disabled: !t.value,
      "model-value": t.value?.hard ?? !1,
      "onUpdate:modelValue": o
    }, null, 8, ["aria-label", "disabled", "model-value"])) : (n(), H(s(yt), {
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
async function ml(e, a) {
  try {
    const { data: t } = await bl.get(e, a ? { params: a } : void 0);
    if (!t?.success) {
      const l = t?.message || (typeof t?.error == "string" ? t.error : t?.error?.message) || "Could not read published Flow.";
      throw new fl({ message: l, details: t?.details }, "Published Flow");
    }
    return t;
  } catch (t) {
    throw fi(t, "Published Flow");
  }
}
const io = (e) => `/api/v1/workflows/${encodeURIComponent(e)}/versions`, Vl = {
  title: async (e) => (await ml("/api/v1/workflows/published", { id: e })).item?.title,
  versions: async (e) => (await ml(io(e))).versions ?? [],
  check: async (e) => {
    if ((await ml(`${io(e.id)}/${e.version}`)).version?.version !== e.version) throw new Error("The published version is unavailable.");
  }
}, Rd = {
  class: "work-stack work-tight",
  "aria-label": "Stage Flow"
}, Nd = {
  key: 0,
  class: "work-muted work-small"
}, Md = {
  key: 1,
  class: "kx-err work-alert-actions"
}, Fd = { role: "alert" }, Ld = ["schema", "config", "title"], Bd = {
  key: 3,
  class: "kx-err",
  role: "alert"
}, zd = {
  key: 4,
  class: "work-stack work-tight"
}, jd = ["value", "aria-busy", "disabled"], qd = {
  value: "",
  disabled: ""
}, Wd = ["value"], Kd = {
  key: 5,
  class: "work-muted work-small",
  role: "status"
}, Gd = /* @__PURE__ */ $e({
  __name: "StageFlow",
  props: {
    modelValue: {}
  },
  emits: ["update:modelValue", "validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = N(!1), r = N(""), f = N([]), p = N(!1), c = N(""), i = N(!1), d = q(() => r.value || t.modelValue?.id), m = JSON.stringify({ properties: { flow_ref: { title: "Published Flow", picker: "wc-workflow-picker" } } }), y = q(() => JSON.stringify(t.modelValue ? { flow_ref: t.modelValue } : {}));
    let g = 0;
    async function x() {
      o.value = await Dt("wc-workflow-picker");
    }
    x();
    async function k() {
      const E = ++g, C = d.value, Z = t.modelValue;
      if (p.value = !!C, c.value = "", f.value = [], !!C)
        try {
          const [Q] = await Promise.all([Vl.versions(C), !i.value && Z ? Vl.check(Z) : Promise.resolve()]);
          if (E !== g) return;
          if (f.value = Q.filter((K) => Number.isInteger(K.version) && K.version > 0), !i.value && Z && !f.value.some((K) => K.version === Z.version)) throw new Error("The published version is unavailable.");
        } catch (Q) {
          E === g && (c.value = at(Q, "Could not read published Flow."));
        } finally {
          E === g && (p.value = !1);
        }
    }
    De([d, () => t.modelValue?.version, i], k, { immediate: !0 }), De(i, (E) => l("validity", !E), { immediate: !0 });
    function S(E) {
      const C = E.detail?.flow_ref;
      C?.kind !== "flow" || !C.id || (i.value = !0, r.value = C.id);
    }
    function V(E) {
      !d.value || !f.value.some((C) => C.version === E) || (l("update:modelValue", { kind: "flow", id: d.value, version: E }), i.value = !1, r.value = "");
    }
    function $() {
      l("update:modelValue", void 0), i.value = !1, r.value = "";
    }
    return Vt(() => {
      g++, l("validity", !0);
    }), (E, C) => (n(), b("section", Rd, [
      C[4] || (C[4] = u("h4", { class: "work-field-label" }, "What runs", -1)),
      e.modelValue ? U("", !0) : (n(), b("p", Nd, "No Flow bound. This stage keeps its existing external execution contract.")),
      c.value ? (n(), b("div", Md, [
        u("p", Fd, [
          B(A(i.value ? "Flow versions unavailable" : "Flow binding unavailable"), 1),
          !i.value && e.modelValue ? (n(), b(te, { key: 0 }, [
            B(" (v" + A(e.modelValue.version) + ")", 1)
          ], 64)) : U("", !0),
          B(". " + A(c.value), 1)
        ]),
        h(s(_), {
          label: "Reload Flow",
          severity: "secondary",
          text: "",
          onClick: k
        })
      ])) : U("", !0),
      o.value ? (n(), b("wc-workflow-picker", {
        key: 2,
        schema: s(m),
        config: y.value,
        title: e.modelValue?.id,
        onChange: S
      }, null, 40, Ld)) : (n(), b("p", Bd, [
        C[2] || (C[2] = B("Published Flow picker unavailable.", -1)),
        h(s(_), {
          label: "Reload Flow picker",
          text: "",
          severity: "secondary",
          onClick: x
        })
      ])),
      d.value ? (n(), b("label", zd, [
        C[3] || (C[3] = B(" Published version ", -1)),
        u("select", {
          class: "p-inputtext work-flow-version",
          value: i.value ? "" : e.modelValue?.version,
          "aria-busy": p.value,
          disabled: p.value || !!c.value,
          onChange: C[0] || (C[0] = (Z) => V(Number(Z.target.value)))
        }, [
          u("option", qd, A(p.value ? "Loading versions…" : "Choose a published version"), 1),
          (n(!0), b(te, null, se(f.value, (Z) => (n(), b("option", {
            key: Z.version,
            value: Z.version
          }, "v" + A(Z.version), 9, Wd))), 128))
        ], 40, jd)
      ])) : U("", !0),
      i.value ? (n(), b("p", Kd, "Choose a published version to finish selecting the Flow.")) : U("", !0),
      e.modelValue || i.value ? (n(), H(s(_), {
        key: 6,
        label: i.value ? "Cancel Flow selection" : "Remove Flow binding",
        "aria-label": i.value ? "Cancel Flow selection" : "Remove Flow binding",
        severity: "secondary",
        text: "",
        onClick: C[1] || (C[1] = (Z) => i.value ? (i.value = !1, r.value = "") : $())
      }, null, 8, ["label", "aria-label"])) : U("", !0)
    ]));
  }
}), $l = { seconds: 1, minutes: 60, hours: 3600, days: 86400 };
function ra(e, a) {
  const t = /^P(\d+)W$/.exec(e), l = /^P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+\.?\d*)S)?)?$/.exec(e);
  if (!t && (!l || e === "P" || e.endsWith("T"))) return;
  const o = t ? Number(t[1]) * 604800 : Number(l[1] ?? 0) * 86400 + Number(l[2] ?? 0) * 3600 + Number(l[3] ?? 0) * 60 + Number(l[4] ?? 0);
  if (!Number.isFinite(o) || o <= 0) return;
  const r = a ?? (o % 86400 === 0 ? "days" : o % 3600 === 0 ? "hours" : o < 60 ? "seconds" : "minutes");
  return { amount: o / $l[r], unit: r };
}
function Hd(e, a) {
  if (e == null) return;
  if (!Number.isFinite(e * $l[a]) || e <= 0) throw new Error("Enter a positive duration.");
  const t = (o) => o.toLocaleString("en-US", { useGrouping: !1, maximumSignificantDigits: 21 });
  if (!Number.isInteger(e)) return `PT${t(e * $l[a])}S`;
  const l = { seconds: "S", minutes: "M", hours: "H", days: "D" }[a];
  return (a === "days" ? "P" : "PT") + t(e) + l;
}
const Yd = { class: "work-stack work-tight" }, Xd = {
  key: 0,
  class: "work-error",
  role: "alert"
}, Bt = /* @__PURE__ */ $e({
  __name: "DurationControl",
  props: {
    modelValue: {},
    label: {},
    disabled: { type: Boolean }
  },
  emits: ["update:modelValue", "validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = "duration:" + ja(), r = N(), f = N(""), p = q(() => t.modelValue ? ra(t.modelValue) : void 0), c = q(() => r.value ?? p.value?.unit ?? "days");
    De(() => t.modelValue, (V) => {
      f.value = "", l("validity", !V || !!p.value, o);
    }, { immediate: !0 });
    const i = q(() => t.modelValue ? ra(t.modelValue, c.value)?.amount ?? null : null);
    function d(V) {
      try {
        const $ = Hd(V, c.value);
        f.value = "", l("update:modelValue", $), l("validity", !0, o);
      } catch ($) {
        f.value = $.message, l("validity", !1, o);
      }
    }
    let m;
    function y(V) {
      V.target instanceof HTMLInputElement && (m = V.target.value);
    }
    function g(V) {
      if (m === void 0) return;
      const $ = m;
      m = void 0, k(V, $);
    }
    function x(V) {
      m = void 0;
      const $ = V.originalEvent?.target instanceof HTMLInputElement ? V.originalEvent.target.value : V.formattedValue;
      k(V.value, $);
    }
    function k(V, $) {
      if ($.trim() && (typeof V != "number" || !Number.isFinite(V))) {
        f.value = "Enter a positive duration.", l("validity", !1, o);
        return;
      }
      r.value = c.value, d(typeof V == "number" ? V : null);
    }
    function S(V) {
      const $ = i.value;
      r.value = V, !(t.modelValue && !p.value) && d($);
    }
    return Vt(() => l("validity", !0, o)), (V, $) => (n(), b("label", Yd, [
      B(A(e.label), 1),
      u("span", {
        class: "work-duration-control",
        style: { "max-width": "360px" },
        onInputCapture: y
      }, [
        h(s(yt), {
          "model-value": i.value,
          "aria-label": e.label,
          min: 0,
          "aria-invalid": !!f.value || !!e.modelValue && !s(ra)(e.modelValue),
          disabled: e.disabled,
          useGrouping: !1,
          "max-fraction-digits": c.value === "seconds" ? 20 : 3,
          onInput: x,
          "onUpdate:modelValue": g
        }, null, 8, ["model-value", "aria-label", "aria-invalid", "disabled", "max-fraction-digits"]),
        h(s(me), {
          "model-value": c.value,
          "aria-label": e.label + " unit",
          disabled: e.disabled,
          options: [{ label: "Seconds", value: "seconds" }, { label: "Minutes", value: "minutes" }, { label: "Hours", value: "hours" }, { label: "Days", value: "days" }],
          optionLabel: "label",
          optionValue: "value",
          appendTo: "self",
          "onUpdate:modelValue": $[0] || ($[0] = (E) => S(E))
        }, null, 8, ["model-value", "aria-label", "disabled"])
      ], 32),
      f.value || e.modelValue && !s(ra)(e.modelValue) ? (n(), b("span", Xd, A(f.value || `Unsupported duration: ${e.modelValue}`), 1)) : U("", !0)
    ]));
  }
}), Jd = { class: "work-stack" }, Zd = { class: "work-settings-grid" }, Qd = { class: "work-stack work-tight" }, _d = { class: "work-stack work-tight" }, eu = {
  key: 1,
  class: "work-stack work-tight"
}, tu = { class: "work-stack work-tight" }, au = { class: "work-settings-grid" }, lu = { class: "work-row" }, ou = { class: "work-stack work-tight" }, iu = {
  key: 0,
  class: "work-stack work-tight"
}, nu = /* @__PURE__ */ $e({
  __name: "TimersEditor",
  props: {
    state: {},
    draft: {}
  },
  emits: ["validity"],
  setup(e, { emit: a }) {
    const t = e, l = a;
    function o() {
      return t.state.timers ?? [];
    }
    function r() {
      const i = t.state.timers ?? (t.state.timers = []);
      i.push({ id: Lt("timer", i), after: "P1D", then: { emit: "reminder" } });
    }
    function f(i, d) {
      delete i.after, delete i.at_field, d === "after" ? i.after = "P1D" : i.at_field = "";
    }
    function p(i, d, m) {
      m ? i[d] = m : (delete i[d], delete i.table);
    }
    function c(i, d) {
      i.then = d === "emit" ? { emit: "" } : { transition: "" };
    }
    return (i, d) => (n(), b("section", Jd, [
      d[8] || (d[8] = u("h4", null, "Timers", -1)),
      (n(!0), b(te, null, se(o(), (m, y) => (n(), b("article", {
        key: m.id,
        class: "work-settings-card work-stack"
      }, [
        u("div", Zd, [
          u("label", Qd, [
            d[2] || (d[2] = B("Timer ID", -1)),
            h(s(Ve), {
              modelValue: m.id,
              "onUpdate:modelValue": (g) => m.id = g,
              required: "",
              pattern: "[a-z][a-z0-9_]*"
            }, null, 8, ["modelValue", "onUpdate:modelValue"])
          ]),
          u("label", _d, [
            d[3] || (d[3] = B("Deadline", -1)),
            h(s(me), {
              "model-value": m.at_field !== void 0 ? "at_field" : "after",
              "onUpdate:modelValue": (g) => f(m, g),
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
          m.after !== void 0 ? (n(), H(Bt, {
            key: 0,
            modelValue: m.after,
            "onUpdate:modelValue": (g) => m.after = g,
            label: "After",
            onValidity: d[0] || (d[0] = (g, x) => l("validity", x, g))
          }, null, 8, ["modelValue", "onUpdate:modelValue"])) : (n(), b("label", eu, [
            d[4] || (d[4] = B("At field", -1)),
            h(s(me), {
              modelValue: m.at_field,
              "onUpdate:modelValue": (g) => m.at_field = g,
              appendTo: "self",
              optionLabel: "label",
              optionValue: "value",
              optionDisabled: "disabled",
              options: [
                ...(e.draft.fields?.filter((g) => g.form === "time") ?? []).map((g) => ({
                  label: g.code,
                  value: g.code,
                  disabled: !1
                }))
              ]
            }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
          ])),
          u("label", tu, [
            d[5] || (d[5] = B("Duration by field", -1)),
            h(s(me), {
              "model-value": m.by ?? "",
              "onUpdate:modelValue": (g) => p(m, "by", g),
              appendTo: "self",
              optionLabel: "label",
              optionValue: "value",
              optionDisabled: "disabled",
              options: [
                { label: "Fixed duration", value: "", disabled: !1 },
                ...(e.draft.fields ?? []).map((g) => ({
                  label: g.code,
                  value: g.code,
                  disabled: !1
                }))
              ]
            }, null, 8, ["model-value", "onUpdate:modelValue", "options"])
          ])
        ]),
        m.by ? (n(), H(Ut, {
          key: 0,
          label: "Duration table",
          hint: "Map field values to ISO durations.",
          "model-value": m.table,
          shape: "object",
          "onUpdate:modelValue": (g) => m.table = g,
          onValidity: (g) => l("validity", "table-" + y, g)
        }, null, 8, ["model-value", "onUpdate:modelValue", "onValidity"])) : U("", !0),
        u("div", au, [
          h(Bt, {
            modelValue: m.repeat,
            "onUpdate:modelValue": (g) => m.repeat = g,
            label: "Repeat every",
            onValidity: d[1] || (d[1] = (g, x) => l("validity", x, g)),
            disabled: m.interrupting
          }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"]),
          u("label", lu, [
            h(s(jt), {
              modelValue: m.interrupting,
              "onUpdate:modelValue": [(g) => m.interrupting = g, (g) => m.interrupting && delete m.repeat],
              binary: ""
            }, null, 8, ["modelValue", "onUpdate:modelValue"]),
            d[6] || (d[6] = B("Interrupting", -1))
          ]),
          u("label", ou, [
            d[7] || (d[7] = B("Then", -1)),
            h(s(me), {
              "model-value": m.then?.transition !== void 0 ? "transition" : "emit",
              "onUpdate:modelValue": (g) => c(m, g),
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
          m.then ? (n(), b("label", iu, [
            B(A(m.then.transition !== void 0 ? "Transition ID" : "Event name"), 1),
            m.then.transition !== void 0 ? (n(), H(s(Ve), {
              key: 0,
              modelValue: m.then.transition,
              "onUpdate:modelValue": (g) => m.then.transition = g
            }, null, 8, ["modelValue", "onUpdate:modelValue"])) : (n(), H(s(Ve), {
              key: 1,
              modelValue: m.then.emit,
              "onUpdate:modelValue": (g) => m.then.emit = g
            }, null, 8, ["modelValue", "onUpdate:modelValue"]))
          ])) : U("", !0)
        ]),
        h(s(_), {
          severity: "secondary",
          onClick: (g) => o().splice(y, 1),
          "aria-label": "Remove timer",
          text: "",
          size: "small"
        }, {
          default: W(() => [
            h(s(ue), {
              icon: "tabler:trash",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        }, 8, ["onClick"])
      ]))), 128)),
      h(s(_), {
        label: "Add timer",
        severity: "secondary",
        onClick: r,
        outlined: ""
      }, {
        icon: W(() => [
          h(s(ue), {
            icon: "tabler:plus",
            "aria-hidden": "true"
          })
        ]),
        _: 1
      })
    ]));
  }
}), su = ["aria-label"], ru = { class: "work-stack work-tight" }, du = {
  key: 0,
  class: "work-stack work-tight"
}, uu = /* @__PURE__ */ $e({
  __name: "PrincipalSourceEditor",
  props: {
    modelValue: {},
    draft: {},
    boardId: {},
    label: {}
  },
  emits: ["update:modelValue", "validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = q(() => Array.isArray(t.modelValue) ? "principals" : "field" in t.modelValue ? "field" : "group"), r = q(() => Array.isArray(t.modelValue) ? t.modelValue : "group" in t.modelValue && t.modelValue.group ? [{ kind: "group", id: t.modelValue.group }] : []);
    function f(c) {
      l("update:modelValue", c === "field" ? { field: "" } : c === "group" ? { group: "" } : []);
    }
    function p(c) {
      l("update:modelValue", o.value === "group" ? { group: c.at(-1)?.id ?? "" } : c);
    }
    return fo(() => l("validity", Array.isArray(t.modelValue) ? t.modelValue.length > 0 : "field" in t.modelValue ? !!t.modelValue.field : !!t.modelValue.group)), Vt(() => l("validity", !0)), (c, i) => (n(), b("section", {
      class: "work-stack work-tight",
      "aria-label": e.label
    }, [
      u("label", ru, [
        B(A(e.label) + " source", 1),
        h(s(me), {
          "model-value": o.value,
          "aria-label": e.label + " source",
          options: [{ label: "Group", value: "group" }, { label: "People and groups", value: "principals" }, { label: "Principal field", value: "field" }],
          optionLabel: "label",
          optionValue: "value",
          appendTo: "self",
          "onUpdate:modelValue": f
        }, null, 8, ["model-value", "aria-label"])
      ]),
      "field" in e.modelValue ? (n(), b("label", du, [
        i[1] || (i[1] = B("Principal field", -1)),
        h(s(me), {
          "model-value": e.modelValue.field,
          "aria-label": e.label + " field",
          options: e.draft.fields?.filter((d) => d.type === "principal").map((d) => ({ label: d.title || d.code, value: d.code })) ?? [],
          optionLabel: "label",
          optionValue: "value",
          appendTo: "self",
          "onUpdate:modelValue": i[0] || (i[0] = (d) => l("update:modelValue", { field: d }))
        }, null, 8, ["model-value", "aria-label", "options"])
      ])) : (n(), H(Il, {
        key: 1,
        "board-id": e.boardId,
        label: e.label,
        kinds: o.value === "group" ? "group" : "user,group,service",
        "model-value": r.value,
        "onUpdate:modelValue": p
      }, null, 8, ["board-id", "label", "kinds", "model-value"]))
    ], 8, su));
  }
}), cu = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, vu = {
  class: "work-stack work-tight",
  "aria-label": "Approval sources"
}, mu = { class: "work-row" }, fu = {
  key: 0,
  class: "work-stack work-tight"
}, pu = ["kinds", "value"], bu = {
  key: 2,
  class: "work-muted work-small",
  role: "status"
}, hu = {
  key: 3,
  class: "work-chips"
}, gu = { class: "work-row work-small" }, yu = { class: "work-stack work-tight" }, ku = {
  key: 4,
  class: "work-error work-small",
  role: "alert"
}, wu = {
  key: 5,
  class: "work-muted work-small"
}, Vu = /* @__PURE__ */ $e({
  __name: "ApproversEditor",
  props: {
    approvals: {},
    boardId: {}
  },
  emits: ["validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, { principalLabel: o, rememberPrincipal: r, nameError: f } = po(() => t.boardId ?? "", () => Array.isArray(t.approvals.from) ? t.approvals.from : "group" in t.approvals.from ? [{ kind: "group", id: t.approvals.from.group }] : []), p = N(!1), c = q(() => Array.isArray(t.approvals.from) ? "principals" : "field" in t.approvals.from ? "field" : "group"), i = q(() => Array.isArray(t.approvals.from) ? t.approvals.from.some((g) => g.kind === "group") || t.approvals.from.length >= t.approvals.min : "field" in t.approvals.from ? !!t.approvals.from.field : !!t.approvals.from.group);
    fo(() => l("validity", Number.isSafeInteger(t.approvals.min) && t.approvals.min > 0 && i.value)), Vt(() => l("validity", !0)), ha(async () => {
      p.value = await Dt("wc-principal-picker");
    });
    function d(g) {
      t.approvals.from = g === "group" ? { group: "" } : g === "field" ? { field: "" } : [];
    }
    function m(g) {
      const x = g.detail, k = x?.principal_id ?? x?.id;
      if (c.value === "group") {
        t.approvals.from = { group: k ?? "" };
        return;
      }
      if (!k || !Array.isArray(t.approvals.from)) return;
      const S = { kind: x.type ?? x.kind ?? "user", id: k };
      x.label && r(S, x.label), t.approvals.from.some((V) => V.id === k && V.kind === S.kind) || t.approvals.from.push(S);
    }
    function y(g) {
      Array.isArray(t.approvals.from) && t.approvals.from.splice(g, 1);
    }
    return (g, x) => (n(), b(te, null, [
      s(f) ? (n(), b("p", cu, A(s(f)), 1)) : U("", !0),
      u("section", vu, [
        u("label", mu, [
          x[4] || (x[4] = u("span", { class: "work-spacer" }, "Approvals needed", -1)),
          h(s(yt), {
            modelValue: e.approvals.min,
            "onUpdate:modelValue": x[0] || (x[0] = (k) => e.approvals.min = k),
            min: 1,
            required: "",
            useGrouping: !1
          }, null, 8, ["modelValue"])
        ]),
        x[8] || (x[8] = u("span", { class: "work-field-label" }, "Approvers", -1)),
        "field" in e.approvals.from ? (n(), b("label", fu, [
          x[5] || (x[5] = B("Principal field", -1)),
          h(s(Ve), {
            modelValue: e.approvals.from.field,
            "onUpdate:modelValue": x[1] || (x[1] = (k) => e.approvals.from.field = k),
            "aria-label": "Principal field"
          }, null, 8, ["modelValue"])
        ])) : p.value ? (n(), b("wc-principal-picker", {
          key: c.value,
          kinds: c.value === "group" ? "group" : "user,group,service",
          value: JSON.stringify("group" in e.approvals.from ? { type: "group", principal_id: e.approvals.from.group } : {}),
          onConfigChanged: m
        }, null, 40, pu)) : (n(), b("p", bu, "The principal picker is unavailable.")),
        Array.isArray(e.approvals.from) ? (n(), b("div", hu, [
          (n(!0), b(te, null, se(e.approvals.from, (k, S) => (n(), H(s(Ze), {
            key: k.kind + ":" + k.id,
            class: "kx-tag-sm",
            severity: "secondary"
          }, {
            default: W(() => [
              B(A(s(o)(k)), 1),
              h(s(_), {
                "aria-label": "Remove approver " + (S + 1),
                text: "",
                severity: "secondary",
                size: "small",
                onClick: (V) => y(S)
              }, {
                default: W(() => [
                  h(s(ue), {
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
        u("label", gu, [
          x[6] || (x[6] = u("span", { class: "work-spacer" }, "The person who moves the item here cannot approve this visit", -1)),
          h(s(Je), {
            modelValue: e.approvals.prevent_self,
            "onUpdate:modelValue": x[2] || (x[2] = (k) => e.approvals.prevent_self = k),
            "aria-label": "The person who moves the item here cannot approve this visit"
          }, null, 8, ["modelValue"])
        ]),
        h(Le, {
          class: "work-process-options",
          label: "Approval options"
        }, {
          default: W(() => [
            u("label", yu, [
              x[7] || (x[7] = B("Approval source", -1)),
              h(s(me), {
                "model-value": c.value,
                "onUpdate:modelValue": x[3] || (x[3] = (k) => d(k)),
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                options: [{ label: "Group members", value: "group" }, { label: "People and groups", value: "principals" }, { label: "Principal field", value: "field" }]
              }, null, 8, ["model-value"])
            ])
          ]),
          _: 1
        }),
        Array.isArray(e.approvals.from) && !i.value ? (n(), b("p", ku, "Select at least " + A(e.approvals.min) + " distinct principals, or lower the minimum.", 1)) : "group" in e.approvals.from && !e.approvals.from.group ? (n(), b("p", wu, "Choose the group that can approve this state.")) : U("", !0)
      ])
    ], 64));
  }
}), $u = {
  class: "work-state-settings work-stack",
  "aria-label": "State settings"
}, xu = { class: "work-process-kind" }, Cu = { class: "work-row" }, Su = { class: "work-row" }, Tu = { class: "work-stack" }, Iu = { class: "work-row" }, Du = { class: "work-stack work-tight" }, Uu = { class: "work-row" }, Eu = { class: "work-stack work-tight" }, Au = { class: "work-row" }, Ou = { class: "work-row" }, Pu = { class: "work-stack work-tight" }, Ru = { class: "work-stack" }, Nu = { class: "work-row" }, Mu = { class: "work-row" }, Fu = { class: "work-stack work-tight" }, Lu = { class: "work-stack work-tight" }, Bu = {
  key: 0,
  class: "work-row"
}, zu = { class: "work-stack" }, ju = { class: "work-stack work-tight" }, qu = { class: "work-row" }, Wu = /* @__PURE__ */ $e({
  __name: "StateSettings",
  props: {
    state: {},
    process: {},
    draft: {},
    boardId: {}
  },
  emits: ["validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = q(() => (t.process.transitions ?? []).filter((c) => c.from === "any" || c.from.includes(t.state.id))), r = [{ value: "human", icon: "user" }, { value: "gate", icon: "shield-check" }, { value: "automated", icon: "bolt" }, { value: "parallel", icon: "arrows-split" }];
    function f(c) {
      const i = t.state;
      i.kind = c, delete i.run, delete i.release_when, delete i.regions, delete i.join, delete i.due, (c === "automated" || c === "gate") && delete i.awaiting, c === "automated" && (i.run = { stage: i.id, retry: { max: 1, backoff: "PT1M" } }), c === "gate" && (i.release_when = { approvals: { min: 1, from: { group: "" }, prevent_self: !0 } }), c === "parallel" && (i.regions = [{ id: "region_1", initial: t.process.states.find((d) => d.id !== i.id)?.id ?? "" }], i.join = "all");
    }
    function p(c) {
      t.state.run && (c ? t.state.run.on_fail = c : delete t.state.run.on_fail);
    }
    return (c, i) => (n(), b("section", $u, [
      i[57] || (i[57] = u("h4", { class: "work-process-group" }, "Who moves the item on", -1)),
      h(s(Cl), {
        class: "work-process-kinds",
        "model-value": e.state.kind ?? "human",
        options: r.map((d) => ({
          ...d,
          label: s(Ra)(d.value)
        })),
        optionLabel: "label",
        optionValue: "value",
        optionDisabled: "disabled",
        "allow-empty": !1,
        "aria-label": "Who moves the item on",
        "onUpdate:modelValue": f
      }, {
        option: W(({ option: d }) => [
          u("span", xu, [
            h(s(ue), {
              icon: "tabler:" + d.icon
            }, null, 8, ["icon"]),
            u("span", null, A(d.label), 1)
          ])
        ]),
        _: 1
      }, 8, ["model-value", "options"]),
      i[58] || (i[58] = u("h4", { class: "work-process-group" }, "Limit", -1)),
      u("label", Cu, [
        i[34] || (i[34] = u("span", { class: "work-spacer" }, "Items allowed here", -1)),
        h(oo, {
          draft: e.draft,
          state: e.state.id,
          label: "Items allowed here"
        }, null, 8, ["draft", "state"])
      ]),
      u("label", Su, [
        i[35] || (i[35] = u("span", { class: "work-spacer" }, [
          B("Refuse moves over the limit"),
          u("small", { class: "work-muted work-block" }, "Off only warns")
        ], -1)),
        h(oo, {
          draft: e.draft,
          state: e.state.id,
          label: "Refuse moves over the limit",
          hard: ""
        }, null, 8, ["draft", "state"])
      ]),
      i[59] || (i[59] = u("h4", { class: "work-process-group" }, "Required on entry", -1)),
      h(ut, {
        label: "Required fields",
        options: e.draft.fields?.map((d) => ({ value: d.code, label: d.title || d.code })) ?? [],
        modelValue: e.state.require,
        "onUpdate:modelValue": i[0] || (i[0] = (d) => e.state.require = d)
      }, null, 8, ["options", "modelValue"]),
      !e.state.kind || e.state.kind === "human" ? (n(), H(Bt, {
        key: 0,
        modelValue: e.state.due,
        "onUpdate:modelValue": i[1] || (i[1] = (d) => e.state.due = d),
        label: "Time allowed in this state",
        onValidity: i[2] || (i[2] = (d, m) => l("validity", m, d))
      }, null, 8, ["modelValue"])) : U("", !0),
      e.state.kind === "gate" && e.state.release_when ? (n(), b(te, { key: 1 }, [
        i[37] || (i[37] = u("h4", { class: "work-process-group" }, "Approval", -1)),
        e.state.release_when.approvals ? (n(), H(Vu, {
          key: 0,
          "board-id": e.boardId,
          approvals: e.state.release_when.approvals,
          onValidity: i[3] || (i[3] = (d) => l("validity", "approvers", d))
        }, null, 8, ["board-id", "approvals"])) : U("", !0),
        h(Le, {
          class: "work-process-options",
          label: "Release options"
        }, {
          default: W(() => [
            u("div", Tu, [
              u("label", Iu, [
                i[36] || (i[36] = u("span", { class: "work-spacer" }, "Require approvals", -1)),
                h(s(Je), {
                  "model-value": !!e.state.release_when.approvals,
                  "aria-label": "Require approvals",
                  "onUpdate:modelValue": i[4] || (i[4] = (d) => e.state.release_when.approvals = d ? { min: 1, from: { group: "" }, prevent_self: !0 } : void 0)
                }, null, 8, ["model-value"])
              ]),
              h(Bt, {
                modelValue: e.state.release_when.wait,
                "onUpdate:modelValue": i[5] || (i[5] = (d) => e.state.release_when.wait = d),
                label: "Wait before release",
                onValidity: i[6] || (i[6] = (d, m) => l("validity", m, d))
              }, null, 8, ["modelValue"]),
              h(Tl, {
                label: "Release when",
                draft: e.draft,
                "board-id": e.boardId,
                modelValue: e.state.release_when.when,
                "onUpdate:modelValue": i[7] || (i[7] = (d) => e.state.release_when.when = d),
                onValidity: i[8] || (i[8] = (d) => l("validity", "release", d))
              }, null, 8, ["draft", "board-id", "modelValue"])
            ])
          ]),
          _: 1
        })
      ], 64)) : U("", !0),
      e.state.kind === "automated" && e.state.run ? (n(), b(te, { key: 2 }, [
        i[46] || (i[46] = u("h4", { class: "work-process-group" }, "Automation", -1)),
        u("label", Du, [
          i[38] || (i[38] = B("Run label", -1)),
          h(s(Ve), {
            modelValue: e.state.run.stage,
            "onUpdate:modelValue": i[9] || (i[9] = (d) => e.state.run.stage = d),
            "aria-label": "Run label",
            required: ""
          }, null, 8, ["modelValue"])
        ]),
        h(Gd, {
          modelValue: e.state.run.flow_ref,
          "onUpdate:modelValue": i[10] || (i[10] = (d) => e.state.run.flow_ref = d),
          onValidity: i[11] || (i[11] = (d) => l("validity", "flow", d))
        }, null, 8, ["modelValue"]),
        h(Bt, {
          modelValue: e.state.run.timeout,
          "onUpdate:modelValue": i[12] || (i[12] = (d) => e.state.run.timeout = d),
          label: "Attempt timeout",
          onValidity: i[13] || (i[13] = (d, m) => l("validity", m, d))
        }, null, 8, ["modelValue"]),
        i[47] || (i[47] = u("small", { class: "work-muted" }, "Blank uses the board timeout, or one hour.", -1)),
        u("label", Uu, [
          i[39] || (i[39] = u("span", { class: "work-spacer" }, "Maximum visits", -1)),
          h(s(yt), {
            "model-value": e.state.run.max_visits ?? null,
            "aria-label": "Maximum visits",
            min: 1,
            useGrouping: !1,
            placeholder: "Board default",
            "onUpdate:modelValue": i[14] || (i[14] = (d) => e.state.run.max_visits = d ?? void 0)
          }, null, 8, ["model-value"])
        ]),
        u("label", Eu, [
          i[40] || (i[40] = B("When visits are exhausted", -1)),
          h(s(me), {
            "model-value": e.state.run.on_exhausted,
            "aria-label": "When visits are exhausted",
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            showClear: "",
            options: (e.process.transitions ?? []).filter((d) => !d.auto).map((d) => ({ label: s(ze)(d), value: d.id })),
            "onUpdate:modelValue": i[15] || (i[15] = (d) => e.state.run.on_exhausted = d || void 0)
          }, null, 8, ["model-value", "options"])
        ]),
        i[48] || (i[48] = u("small", { class: "work-muted" }, "Blank records a failed run and stops automation. A route must leave every incoming state or be global.", -1)),
        u("label", Au, [
          i[41] || (i[41] = u("span", { class: "work-spacer" }, "Retry if it fails", -1)),
          h(s(Je), {
            "model-value": !!e.state.run.retry,
            "aria-label": "Retry if it fails",
            "onUpdate:modelValue": i[16] || (i[16] = (d) => e.state.run.retry = d ? { max: 1, backoff: "PT1M" } : void 0)
          }, null, 8, ["model-value"])
        ]),
        e.state.run.retry ? (n(), b(te, { key: 0 }, [
          u("label", Ou, [
            i[42] || (i[42] = u("span", { class: "work-spacer" }, "Maximum attempts", -1)),
            h(s(yt), {
              modelValue: e.state.run.retry.max,
              "onUpdate:modelValue": i[17] || (i[17] = (d) => e.state.run.retry.max = d),
              min: 1,
              useGrouping: !1
            }, null, 8, ["modelValue"])
          ]),
          h(Bt, {
            modelValue: e.state.run.retry.backoff,
            "onUpdate:modelValue": i[18] || (i[18] = (d) => e.state.run.retry.backoff = d),
            label: "Wait between attempts",
            onValidity: i[19] || (i[19] = (d, m) => l("validity", m, d))
          }, null, 8, ["modelValue"])
        ], 64)) : U("", !0),
        (n(), b(te, null, se([{ key: "on_pass", label: "On success" }, { key: "on_cancel", label: "On cancellation" }], (d) => u("label", {
          key: d.key,
          class: "work-stack work-tight"
        }, [
          B(A(d.label), 1),
          h(s(me), {
            "model-value": e.state.run[d.key],
            "aria-label": d.label,
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            showClear: "",
            options: o.value.map((m) => ({ label: s(ze)(m), value: m.id })),
            "onUpdate:modelValue": (m) => e.state.run[d.key] = m || void 0
          }, null, 8, ["model-value", "aria-label", "options", "onUpdate:modelValue"])
        ])), 64)),
        u("label", Pu, [
          i[43] || (i[43] = B("If it fails, go to", -1)),
          h(s(me), {
            "aria-label": "If it fails, go to",
            "model-value": e.state.run.on_fail,
            "onUpdate:modelValue": p,
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            showClear: "",
            options: o.value.map((d) => ({
              label: s(ze)(d) + " → " + s(ye)(e.process.states.find((m) => m.id === d.to)),
              value: d.id
            }))
          }, null, 8, ["model-value", "options"])
        ]),
        h(Le, {
          class: "work-disclosure",
          label: "Board automation defaults"
        }, {
          default: W(() => [
            u("div", Ru, [
              i[45] || (i[45] = u("p", { class: "work-muted" }, "These values apply to automated states without their own limit.", -1)),
              h(Bt, {
                "model-value": e.draft.policy?.stage_timeout,
                label: "Default attempt timeout",
                "onUpdate:modelValue": i[20] || (i[20] = (d) => (e.draft.policy ??= {}).stage_timeout = d),
                onValidity: i[21] || (i[21] = (d, m) => l("validity", m, d))
              }, null, 8, ["model-value"]),
              u("label", Nu, [
                i[44] || (i[44] = u("span", { class: "work-spacer" }, "Default maximum visits", -1)),
                h(s(yt), {
                  "model-value": e.draft.policy?.stage_max_visits ?? null,
                  "aria-label": "Default maximum visits",
                  min: 1,
                  useGrouping: !1,
                  placeholder: "5",
                  "onUpdate:modelValue": i[22] || (i[22] = (d) => (e.draft.policy ??= {}).stage_max_visits = d ?? void 0)
                }, null, 8, ["model-value"])
              ])
            ])
          ]),
          _: 1
        })
      ], 64)) : U("", !0),
      e.state.kind === "parallel" && e.state.regions ? (n(), b(te, { key: 3 }, [
        i[53] || (i[53] = u("h4", { class: "work-process-group" }, "Lanes", -1)),
        (n(!0), b(te, null, se(e.state.regions, (d, m) => (n(), b("div", {
          key: m,
          class: "work-process-value work-stack work-tight"
        }, [
          u("div", Mu, [
            u("span", null, "Lane " + A(m + 1), 1),
            i[49] || (i[49] = u("span", { class: "work-spacer" }, null, -1)),
            h(s(_), {
              severity: "danger",
              text: "",
              size: "small",
              "aria-label": "Remove lane",
              onClick: (y) => e.state.regions.splice(m, 1)
            }, {
              default: W(() => [
                h(s(ue), { icon: "tabler:trash" })
              ]),
              _: 1
            }, 8, ["onClick"])
          ]),
          u("label", Fu, [
            i[50] || (i[50] = B("Starts at", -1)),
            h(s(me), {
              "aria-label": "Lane starts at",
              modelValue: d.initial,
              "onUpdate:modelValue": (y) => d.initial = y,
              appendTo: "self",
              optionLabel: "label",
              optionValue: "value",
              options: e.process.states.filter((y) => y.id !== e.state.id).map((y) => ({ label: s(ye)(y), value: y.id }))
            }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
          ])
        ]))), 128)),
        h(s(_), {
          label: "Add lane",
          severity: "secondary",
          outlined: "",
          size: "small",
          onClick: i[23] || (i[23] = (d) => e.state.regions.push({
            id: s(Lt)("region", e.state.regions),
            initial: e.process.states.find((m) => m.id !== e.state.id)?.id ?? ""
          }))
        }, {
          icon: W(() => [
            h(s(ue), { icon: "tabler:plus" })
          ]),
          _: 1
        }),
        u("label", Lu, [
          i[51] || (i[51] = B("Finish rule", -1)),
          h(s(me), {
            "model-value": typeof e.state.join == "number" ? "count" : e.state.join ?? "all",
            appendTo: "self",
            options: [
              { label: "All must pass", value: "all" },
              { label: "Any may pass", value: "any" },
              { label: "A number must pass", value: "count" }
            ],
            optionLabel: "label",
            optionValue: "value",
            "onUpdate:modelValue": i[24] || (i[24] = (d) => e.state.join = d === "count" ? 1 : d)
          }, null, 8, ["model-value"])
        ]),
        typeof e.state.join == "number" ? (n(), b("label", Bu, [
          i[52] || (i[52] = u("span", { class: "work-spacer" }, "Lanes needed", -1)),
          h(s(yt), {
            modelValue: e.state.join,
            "onUpdate:modelValue": i[25] || (i[25] = (d) => e.state.join = d),
            min: 1,
            max: e.state.regions.length,
            useGrouping: !1
          }, null, 8, ["modelValue", "max"])
        ])) : U("", !0)
      ], 64)) : U("", !0),
      h(Le, {
        class: "work-disclosure",
        label: "Advanced state settings"
      }, {
        default: W(() => [
          u("div", zu, [
            i[56] || (i[56] = u("h4", { class: "work-process-group" }, "Assignment and conditions", -1)),
            u("label", ju, [
              i[54] || (i[54] = B("Stage label", -1)),
              h(s(Ve), {
                "model-value": e.state.stage,
                "aria-label": "Stage label",
                "onUpdate:modelValue": i[26] || (i[26] = (d) => e.state.stage = d || void 0)
              }, null, 8, ["model-value"])
            ]),
            !e.state.kind || e.state.kind === "human" || e.state.kind === "parallel" ? (n(), b(te, { key: 0 }, [
              u("label", qu, [
                h(s(Je), {
                  "model-value": !!e.state.awaiting,
                  "aria-label": "Awaiting people",
                  "onUpdate:modelValue": i[27] || (i[27] = (d) => e.state.awaiting = d ? { group: "" } : void 0)
                }, null, 8, ["model-value"]),
                i[55] || (i[55] = B("Awaiting people", -1))
              ]),
              e.state.awaiting ? (n(), H(uu, {
                key: 0,
                modelValue: e.state.awaiting,
                "onUpdate:modelValue": i[28] || (i[28] = (d) => e.state.awaiting = d),
                draft: e.draft,
                "board-id": e.boardId,
                label: "Awaiting",
                onValidity: i[29] || (i[29] = (d) => l("validity", "awaiting", d))
              }, null, 8, ["modelValue", "draft", "board-id"])) : U("", !0)
            ], 64)) : U("", !0),
            h(Il, {
              "board-id": e.boardId,
              modelValue: e.state.assign,
              "onUpdate:modelValue": i[30] || (i[30] = (d) => e.state.assign = d),
              label: "Assign to"
            }, null, 8, ["board-id", "modelValue"]),
            h(Ut, {
              label: "State checks",
              example: ["installed-check"],
              "model-value": e.state.invariants,
              shape: "array",
              "onUpdate:modelValue": i[31] || (i[31] = (d) => e.state.invariants = d),
              onValidity: i[32] || (i[32] = (d) => l("validity", "invariants", d))
            }, null, 8, ["model-value"]),
            h(nu, {
              state: e.state,
              draft: e.draft,
              onValidity: i[33] || (i[33] = (d, m) => l("validity", "timer-" + d, m))
            }, null, 8, ["state", "draft"])
          ])
        ]),
        _: 1
      })
    ]));
  }
}), Ku = {
  key: 0,
  class: "work-ia-toolbar"
}, Gu = {
  key: 1,
  class: "kx-err",
  role: "alert"
}, Hu = { class: "work-muted" }, Yu = {
  key: 1,
  class: "work-map-zoom",
  role: "group",
  "aria-label": "Map zoom"
}, Xu = ["aria-label", "aria-keyshortcuts", "onKeydown"], Ju = { class: "work-row" }, Zu = { class: "work-process-meaning" }, Qu = {
  key: 0,
  class: "work-muted"
}, _u = { class: "work-stack work-tight" }, ec = { class: "work-process-inspector-foot" }, tc = { class: "work-row work-transition-actions" }, ac = { class: "work-process-meaning" }, lc = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, oc = { class: "work-stack work-tight" }, ic = { class: "work-stack" }, nc = { class: "work-stack work-tight" }, sc = {
  key: 0,
  class: "work-muted"
}, rc = { class: "work-stack work-tight" }, dc = { class: "work-dialog-actions" }, uc = /* @__PURE__ */ $e({
  __name: "ProcessEditor",
  props: {
    draft: {},
    guardRemoval: { type: Function },
    issues: {},
    boardId: {},
    counts: {},
    countTypes: {},
    guards: {}
  },
  emits: ["validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = q(() => t.draft.processes ?? []), r = N(!1), f = N(""), p = N(""), c = N(""), i = N("Map"), d = N(""), m = N(), y = N(), g = N(), x = N(), k = N(), S = N(), V = N(!1);
    let $;
    async function E() {
      V.value = !0, await Jt(), k.value?.querySelector('[aria-label="State name"]')?.focus();
    }
    const C = q(() => o.value.find((G) => G.id === p.value) ?? o.value[0]), Z = N(!1);
    function Q(G) {
      Z.value = !0, i.value = G;
    }
    function K() {
      !Z.value && x.value?.clientWidth && (i.value = x.value.clientWidth < 480 && (C.value?.states.length ?? 0) > 6 ? "List" : "Map");
    }
    let ce;
    ha(() => {
      K(), x.value && typeof ResizeObserver < "u" && (ce = new ResizeObserver(K), ce.observe(x.value));
    }), Vt(() => ce?.disconnect()), De(C, () => {
      Z.value = !1, K();
    });
    function ve() {
      V.value = !1, m.value = void 0, y.value = void 0, c.value = "", $ = void 0;
    }
    async function we() {
      const G = $;
      ve(), await Jt(), G?.isConnected ? G.focus() : ke();
    }
    function ke() {
      i.value === "Map" ? g.value?.focus() : S.value?.focus();
    }
    async function z() {
      await Jt(), k.value && (k.value.scrollTop = 0, k.value.focus({ preventScroll: !0 }), (k.value.closest(".work-settings-shell")?.clientWidth ?? 1 / 0) <= 700 && k.value.scrollIntoView?.({ block: "nearest" }));
    }
    function O(G, R) {
      $ = R, V.value = !1, m.value = G, y.value = void 0, d.value = "", c.value = "", z();
    }
    function L(G, R) {
      $ = R, V.value = !1, y.value = G, m.value = void 0, c.value = "", z();
    }
    De([C, i], ve);
    const D = q(() => {
      if (!t.counts || !C.value) return;
      const G = t.countTypes?.filter((R) => R.process === C.value?.id) ?? [];
      return Object.fromEntries(C.value.states.map((R) => [
        R.id,
        G.reduce((F, T) => F + (t.counts?.[T.id]?.[R.id] ?? 0), 0)
      ]));
    }), M = q(() => (t.guards ?? []).filter((G) => t.draft.plugins?.some((R) => R.use === G.plugin))), re = q(() => Object.keys(t.draft.policy?.wip ?? {}).filter((G) => !o.value.some((R) => R.states.some((F) => F.id === G))));
    function ie(G) {
      G === "__new" ? r.value = !0 : p.value = G;
    }
    function de() {
      const G = f.value.trim();
      if (!G) return;
      const R = G.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "") || "process", F = (/^[a-z]/.test(R) ? R : "process_" + R).slice(0, 40), T = o.value.some((X) => X.id === F) ? Lt(F, o.value) : F;
      (t.draft.processes ??= []).push({ id: T, name: G, initial: "todo", states: [{ id: "todo", name: "To do", category: "unstarted" }], transitions: [] }), p.value = T, f.value = "", r.value = !1;
    }
    async function ne(G, R) {
      const F = { id: Lt("state", G.states), name: "New state", category: "started" }, T = Ua(G), X = T.at(-1), I = m.value ?? (X?.category === "completed" ? T.at(-2) : X), oe = I && (G.transitions?.find((ge) => ge.default && ge.from !== "any" && ge.from.includes(I.id)) ?? G.transitions?.find((ge) => ge.from !== "any" && ge.from.includes(I.id) && G.states.findIndex((be) => be.id === ge.to) > G.states.indexOf(I)));
      if (G.states.splice(I ? G.states.indexOf(I) + 1 : G.states.length, 0, F), I && I.category !== "completed" && I.category !== "canceled")
        if (oe) {
          const ge = oe.to;
          oe.to = F.id, (G.transitions ??= []).push({ id: Lt("transition", G.transitions ?? []), name: "Continue", from: [F.id], to: ge, ...oe.auto && oe.default ? { auto: !0, default: !0 } : {} });
        } else (G.transitions ??= []).push({ id: Lt("transition", G.transitions ?? []), name: "Continue", from: [I.id], to: F.id });
      O(F, R), await E();
    }
    function Se(G, R, F = $) {
      const T = C.value;
      if (!T || !R || G === R) return;
      const X = T.transitions ??= [], I = `to_${R}`;
      let oe = I.slice(0, 40), ge = 2;
      for (; X.some((Ue) => Ue.id === oe); ) {
        const Ue = `_${ge++}`;
        oe = I.slice(0, 40 - Ue.length) + Ue;
      }
      const be = { id: oe, name: `To ${ye(T.states.find((Ue) => Ue.id === R)).toLowerCase()}`, from: [G], to: R };
      X.push(be), L(be, F);
    }
    function j(G, R) {
      const F = m.value ?? G.states.find((I) => I.id === G.initial) ?? G.states[0], T = G.states.find((I) => I.id !== F?.id);
      if (!F || !T) return;
      const X = { id: Lt("transition", G.transitions ?? []), name: "To " + ye(T), from: [F.id], to: T.id };
      (G.transitions ??= []).push(X), L(X, R);
    }
    async function v(G) {
      const R = C.value, F = R?.transitions?.indexOf(G) ?? -1;
      if (!R || F < 0) return;
      const T = bi(R, G);
      if (T.length) {
        c.value = `Used by ${T.join(", ")}. Update those references first.`;
        return;
      }
      R.transitions.splice(F, 1), ve(), await Jt(), ke();
    }
    function w(G) {
      !y.value || G.defaultPrevented || G.repeat || (G.preventDefault(), v(y.value));
    }
    function ee(G, R) {
      const F = hi(G, R);
      if (F.length) {
        c.value = `${ye(R)} is used by ${F.join(", ")}. Update these references first.`;
        return;
      }
      G.states.splice(G.states.indexOf(R), 1), we();
    }
    async function P(G) {
      const R = t.draft.item_types?.filter((T) => T.process === G.id).map((T) => T.title || "Untitled item type") ?? [];
      if (R.length) {
        c.value = `Used by ${R.join(", ")}. Choose a different process for those item types first.`;
        return;
      }
      const F = await t.guardRemoval?.("processes", G.id);
      if (F) {
        c.value = F;
        return;
      }
      ga(t.draft, "processes", G.id), p.value = "", ve();
    }
    return (G, R) => (n(), b("section", {
      ref_key: "editor",
      ref: x,
      class: "work-process-editor work-stack",
      "aria-label": "Process editor",
      onKeydown: R[16] || (R[16] = Ae((F) => k.value && we(), ["esc"]))
    }, [
      C.value ? (n(), b("div", Ku, [
        u("div", null, [
          u("h3", null, A(C.value.name || "Workflow"), 1),
          R[17] || (R[17] = u("p", { class: "work-muted" }, "Select a state or a named transition to edit it.", -1))
        ])
      ])) : U("", !0),
      c.value && !y.value ? (n(), b("p", Gu, A(c.value), 1)) : U("", !0),
      (n(!0), b(te, null, se(e.issues?.filter((F) => F.code === "process " + C.value?.id) ?? [], (F) => (n(), b("p", {
        key: F.what + F.detail,
        class: "work-error work-small",
        role: "alert"
      }, A(s(qa)(F)) + " · " + A(F.what), 1))), 128)),
      C.value ? (n(), b("div", {
        key: 2,
        class: vt(["work-process-builder", { "work-process-inspecting": m.value || y.value }])
      }, [
        u("div", {
          ref_key: "tools",
          ref: S,
          class: "work-process-controls",
          role: "toolbar",
          "aria-label": "Process tools",
          tabindex: "-1"
        }, [
          o.value.length > 1 ? (n(), H(s(me), {
            key: 0,
            "model-value": C.value.id,
            "aria-label": "Process",
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            options: [
              ...o.value.map((F) => ({ label: F.name || "Untitled process", value: F.id })),
              { label: "New process…", value: "__new" }
            ],
            "onUpdate:modelValue": ie
          }, null, 8, ["model-value", "options"])) : U("", !0),
          h(s(_), {
            label: "Add state",
            severity: "secondary",
            outlined: "",
            size: "small",
            onClick: R[0] || (R[0] = (F) => ne(C.value, F.currentTarget))
          }, {
            icon: W(() => [
              h(s(ue), { icon: "tabler:plus" })
            ]),
            _: 1
          }),
          h(s(_), {
            label: "Add transition",
            severity: "secondary",
            outlined: "",
            size: "small",
            disabled: C.value.states.length < 2,
            onClick: R[1] || (R[1] = (F) => j(C.value, F.currentTarget))
          }, null, 8, ["disabled"]),
          h(s(me), {
            modelValue: C.value.initial,
            "onUpdate:modelValue": R[2] || (R[2] = (F) => C.value.initial = F),
            "aria-label": "Starts in " + s(ye)(C.value.states.find((F) => F.id === C.value.initial)),
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            options: C.value.states.map((F) => ({ label: s(ye)(F), value: F.id }))
          }, {
            value: W(() => [
              u("span", Hu, "Starts in " + A(s(ye)(C.value.states.find((F) => F.id === C.value.initial))), 1)
            ]),
            _: 1
          }, 8, ["modelValue", "aria-label", "options"]),
          R[18] || (R[18] = u("span", { class: "work-spacer" }, null, -1)),
          i.value === "Map" ? (n(), b("div", Yu, [
            h(s(_), {
              label: "Fit",
              title: "Fit the map to a readable width",
              text: "",
              severity: "secondary",
              size: "small",
              onClick: R[3] || (R[3] = (F) => g.value?.fit())
            }, {
              icon: W(() => [
                h(s(ue), { icon: "tabler:arrows-maximize" })
              ]),
              _: 1
            }),
            i.value === "Map" ? (n(), H(s(_), {
              key: 0,
              "aria-label": "Zoom out",
              title: "Zoom out",
              text: "",
              severity: "secondary",
              size: "small",
              onClick: R[4] || (R[4] = (F) => g.value?.zoomOut())
            }, {
              default: W(() => [
                h(s(ue), { icon: "tabler:minus" })
              ]),
              _: 1
            })) : U("", !0),
            i.value === "Map" ? (n(), H(s(_), {
              key: 1,
              "aria-label": "Zoom in",
              title: "Zoom in",
              text: "",
              severity: "secondary",
              size: "small",
              onClick: R[5] || (R[5] = (F) => g.value?.zoomIn())
            }, {
              default: W(() => [
                h(s(ue), { icon: "tabler:plus" })
              ]),
              _: 1
            })) : U("", !0)
          ])) : U("", !0),
          h(s(Cl), {
            "model-value": i.value,
            "onUpdate:modelValue": Q,
            options: ["Map", "List"],
            "allow-empty": !1,
            "aria-label": "Process layout"
          }, null, 8, ["model-value"]),
          o.value.length === 1 ? (n(), H(s(_), {
            key: 2,
            label: "New process",
            "aria-label": "New process",
            text: "",
            severity: "secondary",
            size: "small",
            onClick: R[6] || (R[6] = (F) => r.value = !0)
          }, {
            icon: W(() => [
              h(s(ue), { icon: "tabler:plus" })
            ]),
            _: 1
          })) : U("", !0)
        ], 512),
        i.value === "Map" ? (n(), H(ad, {
          key: 0,
          ref_key: "graph",
          ref: g,
          process: C.value,
          draft: e.draft,
          "fit-on-open": "",
          "selected-state": m.value,
          "selected-transition": y.value,
          onState: O,
          onTransition: L,
          onRemoveTransition: w,
          onConnect: Se,
          onClear: we
        }, null, 8, ["process", "draft", "selected-state", "selected-transition"])) : (n(), H(Vd, {
          key: 1,
          process: C.value,
          "selected-state": m.value,
          "selected-transition": y.value,
          counts: D.value,
          onState: O,
          onTransition: L,
          onRemoveState: R[7] || (R[7] = (F) => ee(C.value, F)),
          onRemoveTransition: v
        }, null, 8, ["process", "selected-state", "selected-transition", "counts"])),
        h(vo, { name: "work-panel" }, {
          default: W(() => [
            m.value || y.value ? (n(), b("aside", {
              key: 0,
              ref_key: "inspector",
              ref: k,
              class: "work-process-sideform",
              tabindex: "-1",
              "aria-label": m.value ? "State inspector" : "Transition inspector",
              "aria-keyshortcuts": y.value ? "Delete Backspace" : void 0,
              onKeydown: [
                Ae(Ie(w, ["self"]), ["delete"]),
                Ae(Ie(w, ["self"]), ["backspace"])
              ]
            }, [
              (n(!0), b(te, null, se(m.value ? [m.value] : [], (F) => (n(), b(te, {
                key: F.id
              }, [
                u("header", Ju, [
                  V.value ? (n(), H(s(Ve), {
                    key: 1,
                    modelValue: F.name,
                    "onUpdate:modelValue": (T) => F.name = T,
                    class: "work-process-name",
                    "aria-label": "State name",
                    onBlur: R[8] || (R[8] = (T) => V.value = !1)
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])) : (n(), H(Sl, {
                    key: 0,
                    class: "work-process-state-title",
                    "aria-label": "Rename state",
                    onActivate: E
                  }, {
                    default: W(() => [
                      u("span", null, A(s(ye)(F)), 1)
                    ]),
                    _: 2
                  }, 1024)),
                  h(s(_), {
                    severity: "secondary",
                    text: "",
                    size: "small",
                    "aria-label": "Close state editor",
                    onClick: we
                  }, {
                    default: W(() => [
                      h(s(ue), { icon: "tabler:x" })
                    ]),
                    _: 1
                  })
                ]),
                u("p", Zu, A(s(pi)(F, e.draft)), 1),
                D.value ? (n(), b("p", Qu, A(D.value[F.id] ?? 0) + " " + A(D.value[F.id] === 1 ? "item" : "items") + " currently here", 1)) : U("", !0),
                h(Wu, {
                  state: F,
                  process: C.value,
                  draft: e.draft,
                  "board-id": e.boardId,
                  onValidity: (T, X) => l("validity", T.includes("duration:") ? T : C.value.id + ":" + F.id + ":" + T, X)
                }, null, 8, ["state", "process", "draft", "board-id", "onValidity"]),
                u("label", _u, [
                  R[19] || (R[19] = B("Phase", -1)),
                  h(s(me), {
                    "aria-label": "Phase",
                    modelValue: F.category,
                    "onUpdate:modelValue": (T) => F.category = T,
                    appendTo: "self",
                    optionLabel: "label",
                    optionValue: "value",
                    options: ["triage", "backlog", ...s(bo)].map((T) => ({ label: s(qt)(T), value: T }))
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                ]),
                R[20] || (R[20] = u("h4", { class: "work-process-group" }, "Next stop", -1)),
                h(s(me), {
                  modelValue: d.value,
                  "onUpdate:modelValue": R[9] || (R[9] = (T) => d.value = T),
                  "aria-label": "Add transition to…",
                  placeholder: "Add transition to…",
                  appendTo: "self",
                  optionLabel: "label",
                  optionValue: "value",
                  options: C.value.states.filter((T) => T !== F).map((T) => ({ label: s(ye)(T), value: T.id }))
                }, null, 8, ["modelValue", "options"]),
                h(s(_), {
                  label: "Add transition",
                  severity: "secondary",
                  outlined: "",
                  size: "small",
                  disabled: !d.value,
                  onClick: (T) => Se(F.id, d.value)
                }, {
                  icon: W(() => [
                    h(s(ue), { icon: "tabler:arrow-right" })
                  ]),
                  _: 1
                }, 8, ["disabled", "onClick"]),
                u("footer", ec, [
                  h(s(_), {
                    label: "Remove state",
                    severity: "danger",
                    text: "",
                    size: "small",
                    onClick: (T) => ee(C.value, F)
                  }, {
                    icon: W(() => [
                      h(s(ue), { icon: "tabler:trash" })
                    ]),
                    _: 1
                  }, 8, ["onClick"])
                ])
              ], 64))), 128)),
              (n(!0), b(te, null, se(y.value ? [y.value] : [], (F) => (n(), b(te, {
                key: F.id
              }, [
                u("header", tc, [
                  R[21] || (R[21] = u("h3", null, "Transition", -1)),
                  h(s(_), {
                    type: "button",
                    label: "Remove transition",
                    severity: "danger",
                    text: "",
                    size: "small",
                    onClick: (T) => v(F)
                  }, {
                    icon: W(() => [
                      h(s(ue), { icon: "tabler:trash" })
                    ]),
                    _: 1
                  }, 8, ["onClick"]),
                  h(s(_), {
                    severity: "secondary",
                    text: "",
                    size: "small",
                    "aria-label": "Close transition editor",
                    onClick: we
                  }, {
                    default: W(() => [
                      h(s(ue), { icon: "tabler:x" })
                    ]),
                    _: 1
                  })
                ]),
                u("p", ac, A(F.from === "any" ? "Any state" : F.from.map((T) => s(ye)(C.value.states.find((X) => X.id === T))).join(", ")) + " → " + A(s(ye)(C.value.states.find((T) => T.id === F.to))), 1),
                c.value ? (n(), b("p", lc, A(c.value), 1)) : U("", !0),
                u("label", oc, [
                  R[22] || (R[22] = B("Name", -1)),
                  h(s(Ve), {
                    modelValue: F.name,
                    "onUpdate:modelValue": (T) => F.name = T,
                    placeholder: s(ze)(F),
                    "aria-label": "Transition name"
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder"])
                ]),
                h(Pd, {
                  transition: F,
                  process: C.value,
                  draft: e.draft,
                  "board-id": e.boardId,
                  guards: M.value,
                  onValidity: (T, X) => l("validity", C.value.id + ":transition-" + F.id + ":" + T, X)
                }, null, 8, ["transition", "process", "draft", "board-id", "guards", "onValidity"])
              ], 64))), 128))
            ], 40, Xu)) : U("", !0)
          ]),
          _: 1
        })
      ], 2)) : (n(), H(s(_), {
        key: 3,
        label: "New process",
        severity: "secondary",
        outlined: "",
        onClick: R[10] || (R[10] = (F) => r.value = !0)
      }, {
        icon: W(() => [
          h(s(ue), { icon: "tabler:plus" })
        ]),
        _: 1
      })),
      C.value ? (n(), H(Le, {
        key: 4,
        class: "work-settings-card work-disclosure",
        label: "Advanced workflow settings"
      }, {
        default: W(() => [
          u("div", ic, [
            u("label", nc, [
              R[23] || (R[23] = B("Workflow name", -1)),
              h(s(Ve), {
                modelValue: C.value.name,
                "onUpdate:modelValue": R[11] || (R[11] = (F) => C.value.name = F),
                "aria-label": "Workflow name"
              }, null, 8, ["modelValue"])
            ]),
            re.value.length ? (n(), b("p", sc, "Some item limits belong to removed states.")) : U("", !0),
            (n(!0), b(te, null, se(re.value, (F, T) => (n(), H(s(_), {
              key: F,
              label: "Clear limit for removed state " + (T + 1),
              severity: "secondary",
              text: "",
              onClick: (X) => delete e.draft.policy.wip[F]
            }, null, 8, ["label", "onClick"]))), 128)),
            h(s(_), {
              label: "Remove workflow",
              severity: "danger",
              text: "",
              size: "small",
              onClick: R[12] || (R[12] = (F) => P(C.value))
            })
          ])
        ]),
        _: 1
      })) : U("", !0),
      h(pl, {
        visible: r.value,
        label: "New process",
        onClose: R[15] || (R[15] = (F) => r.value = !1)
      }, {
        default: W(() => [
          u("form", {
            class: "work-dialog-box",
            "aria-label": "New process",
            onSubmit: Ie(de, ["stop", "prevent"])
          }, [
            R[25] || (R[25] = u("h2", null, "New process", -1)),
            u("label", rc, [
              R[24] || (R[24] = B("Name", -1)),
              h(s(Ve), {
                modelValue: f.value,
                "onUpdate:modelValue": R[13] || (R[13] = (F) => f.value = F),
                "aria-label": "New process name",
                autofocus: "",
                required: ""
              }, null, 8, ["modelValue"])
            ]),
            u("div", dc, [
              h(s(_), {
                label: "Cancel",
                severity: "secondary",
                outlined: "",
                onClick: R[14] || (R[14] = (F) => r.value = !1)
              }),
              h(s(_), {
                label: "Create process",
                type: "submit",
                disabled: !f.value.trim()
              }, null, 8, ["disabled"])
            ])
          ], 32)
        ]),
        _: 1
      }, 8, ["visible"])
    ], 544));
  }
}), cc = {
  class: "work-settings-card work-stack",
  "aria-label": "Existing items"
}, vc = {
  key: 0,
  class: "work-stack work-tight"
}, mc = { class: "work-row" }, fc = /* @__PURE__ */ $e({
  __name: "ProcessMigration",
  props: {
    removed: {},
    renamed: {},
    disabled: { type: Boolean },
    confirmed: { type: Boolean }
  },
  emits: ["destination", "update:confirmed"],
  setup(e) {
    const a = (t) => t + (t === 1 ? " item" : " items");
    return (t, l) => (n(), b("section", cc, [
      l[2] || (l[2] = u("h3", { class: "work-row-title" }, "Items in changed states", -1)),
      (n(!0), b(te, null, se(e.removed, ({ process: o, state: r, count: f }) => (n(), b("label", {
        key: o.id + "/" + r.id,
        class: "work-stack work-tight"
      }, [
        B(" Move " + A(a(f)) + " from " + A(s(ye)(r)) + " to ", 1),
        h(s(me), {
          disabled: e.disabled,
          "model-value": o.map?.[r.id],
          "aria-label": "Move items from " + s(ye)(r) + " to",
          placeholder: "Choose a state",
          appendTo: "self",
          optionLabel: "label",
          optionValue: "value",
          options: o.states.map((p) => ({ label: s(ye)(p), value: p.id })),
          "onUpdate:modelValue": (p) => t.$emit("destination", o, r.id, p)
        }, null, 8, ["disabled", "model-value", "aria-label", "options", "onUpdate:modelValue"])
      ]))), 128)),
      e.renamed.length ? (n(), b("div", vc, [
        (n(!0), b(te, null, se(e.renamed, ({ process: o, state: r, count: f, name: p }) => (n(), b("p", {
          key: o.id + "/" + r.id
        }, [
          B(A(s(ye)(r)) + " becomes ", 1),
          u("strong", null, A(p), 1),
          B(" for " + A(a(f)) + ". ", 1)
        ]))), 128)),
        u("label", mc, [
          h(s(jt), {
            binary: "",
            "model-value": e.confirmed,
            disabled: e.disabled,
            "onUpdate:modelValue": l[0] || (l[0] = (o) => t.$emit("update:confirmed", o))
          }, null, 8, ["model-value", "disabled"]),
          l[1] || (l[1] = B(" Keep these items in their renamed states ", -1))
        ])
      ])) : U("", !0)
    ]));
  }
}), pc = {
  class: "work-stack",
  "aria-label": "Links editor"
}, bc = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, hc = { class: "work-definition-meta work-muted work-small" }, gc = { class: "work-settings-grid" }, yc = { class: "work-stack work-tight" }, kc = { class: "work-stack work-tight" }, wc = { class: "work-stack work-tight" }, Vc = { class: "work-row" }, $c = {
  key: 0,
  class: "work-muted work-small"
}, xc = {
  key: 1,
  class: "work-settings-grid"
}, Cc = { class: "work-stack work-tight" }, Sc = { class: "work-stack work-tight" }, Tc = {
  key: 0,
  class: "work-chips"
}, Ic = { class: "work-stack work-tight" }, Dc = { class: "work-relation-preview work-small" }, Uc = { class: "work-muted" }, Ec = {
  key: 0,
  class: "kx-empty"
}, Ac = { class: "work-row work-add-definition" }, Oc = { class: "work-stack work-tight" }, Pc = /* @__PURE__ */ $e({
  __name: "RelationsEditor",
  props: {
    draft: {},
    guardRemoval: { type: Function }
  },
  setup(e) {
    const a = e, t = q(() => a.draft.relation_types ?? []), l = q(() => (a.draft.item_types ?? []).map((k) => ({ value: k.id, label: k.title || Ne(k.id) }))), o = ni(/* @__PURE__ */ new WeakMap());
    function r(k, S, V) {
      V.length ? k[S] = V : delete k[S];
    }
    function f(k, S = "") {
      const V = S.trim();
      return /^[a-z][a-z0-9_]{0,39}$/.test(V) && !k.to_types?.includes(V);
    }
    function p(k) {
      const S = o.get(k)?.trim();
      !S || !f(k, S) || (r(k, "to_types", [...k.to_types ?? [], S]), o.delete(k));
    }
    const c = N(""), i = N(""), d = N(!1), m = q(() => !!c.value.trim());
    function y() {
      const k = c.value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "").slice(0, 40), S = /^[a-z]/.test(k) ? k : "link_" + (k || "new");
      let V = S, $ = 2;
      for (; t.value.some((E) => E.id === V); ) V = S + "_" + $++;
      return V;
    }
    function g() {
      m.value && ((a.draft.relation_types ??= []).push({ id: y(), outward: c.value.trim(), inward: c.value.trim(), cardinality: "many" }), c.value = "");
    }
    async function x(k) {
      if (!d.value) {
        d.value = !0, i.value = "";
        try {
          const S = await a.guardRemoval?.("relation_types", k);
          S ? i.value = S : ga(a.draft, "relation_types", k);
        } finally {
          d.value = !1;
        }
      }
    }
    return (k, S) => (n(), b("section", pc, [
      i.value ? (n(), b("p", bc, A(i.value), 1)) : U("", !0),
      h(Ka, {
        columns: "relations",
        count: t.value.length
      }, {
        default: W(() => [
          (n(!0), b(te, null, se(t.value, (V, $) => (n(), H(Wa, {
            title: V.outward || s(Ne)(V.id),
            kind: V.symmetric ? "Same both ways" : "Different each way",
            key: $,
            class: "work-stack"
          }, {
            usage: W(() => [
              u("span", hc, A(V.outward || "Related work") + " · " + A(V.inward || "Reverse relation"), 1)
            ]),
            actions: W(() => [
              h(s(_), {
                severity: "secondary",
                text: "",
                disabled: d.value,
                onClick: (E) => x(V.id),
                "aria-label": "Remove link type",
                size: "small"
              }, {
                default: W(() => [
                  h(s(ue), {
                    icon: "tabler:trash",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["disabled", "onClick"])
            ]),
            default: W(() => [
              u("div", gc, [
                u("label", yc, [
                  S[1] || (S[1] = B("Shown on this item ", -1)),
                  h(s(Ve), {
                    modelValue: V.outward,
                    "onUpdate:modelValue": (E) => V.outward = E,
                    "aria-label": "Shown on this item"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                u("label", kc, [
                  S[2] || (S[2] = B("Shown on the other item ", -1)),
                  h(s(Ve), {
                    modelValue: V.inward,
                    "onUpdate:modelValue": (E) => V.inward = E,
                    "aria-label": "Shown on the other item"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                u("label", wc, [
                  S[3] || (S[3] = B("Links allowed ", -1)),
                  h(s(me), {
                    "model-value": V.cardinality ?? "many",
                    "onUpdate:modelValue": (E) => V.cardinality = E,
                    "aria-label": "Links allowed",
                    appendTo: "self",
                    optionLabel: "label",
                    optionValue: "value",
                    optionDisabled: "disabled",
                    options: [{ label: "One link", value: "one", disabled: !1 }, { label: "Many links", value: "many", disabled: !1 }]
                  }, null, 8, ["model-value", "onUpdate:modelValue"])
                ]),
                u("label", Vc, [
                  h(s(jt), {
                    modelValue: V.symmetric,
                    "onUpdate:modelValue": (E) => V.symmetric = E,
                    disabled: !!(V.from_types?.length || V.to_types?.length),
                    "aria-label": "Same meaning in both directions",
                    binary: ""
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"]),
                  S[4] || (S[4] = B("Same meaning in both directions ", -1))
                ])
              ]),
              V.from_types?.length || V.to_types?.length ? (n(), b("p", $c, " Clear the source and target types to use the same meaning in both directions. ")) : U("", !0),
              V.symmetric ? U("", !0) : (n(), b("div", xc, [
                h(ut, {
                  label: "Source item types",
                  options: l.value,
                  "model-value": V.from_types,
                  "onUpdate:modelValue": (E) => r(V, "from_types", E)
                }, null, 8, ["options", "model-value", "onUpdate:modelValue"]),
                u("div", Cc, [
                  u("label", Sc, [
                    S[5] || (S[5] = B("Target type ID ", -1)),
                    h(s(Ve), {
                      "model-value": o.get(V) ?? "",
                      "onUpdate:modelValue": (E) => o.set(V, E ?? ""),
                      "aria-label": "Target type ID",
                      placeholder: "e.g. release",
                      maxlength: "40",
                      onKeydown: Ae(Ie((E) => p(V), ["stop", "prevent"]), ["enter"])
                    }, null, 8, ["model-value", "onUpdate:modelValue", "onKeydown"])
                  ]),
                  S[6] || (S[6] = u("p", { class: "work-muted work-small" }, "Use the type ID from this board or a peer board. Leave either end empty to allow any type there.", -1)),
                  h(s(_), {
                    label: "Add target type",
                    severity: "secondary",
                    outlined: "",
                    size: "small",
                    disabled: !f(V, o.get(V)),
                    onClick: (E) => p(V)
                  }, null, 8, ["disabled", "onClick"]),
                  V.to_types?.length ? (n(), b("div", Tc, [
                    (n(!0), b(te, null, se(V.to_types, (E) => (n(), H(s(_), {
                      key: E,
                      severity: "secondary",
                      text: "",
                      size: "small",
                      label: E + " ×",
                      "aria-label": "Remove target type " + E,
                      onClick: (C) => r(V, "to_types", V.to_types.filter((Z) => Z !== E))
                    }, null, 8, ["label", "aria-label", "onClick"]))), 128))
                  ])) : U("", !0)
                ])
              ])),
              h(Le, {
                class: "work-disclosure",
                label: "Advanced link settings"
              }, {
                default: W(() => [
                  u("label", Ic, [
                    S[7] || (S[7] = B("Identifier ", -1)),
                    h(s(Ve), {
                      modelValue: V.id,
                      "onUpdate:modelValue": (E) => V.id = E,
                      required: "",
                      pattern: "[a-z][a-z0-9_]*",
                      "aria-label": "Relation ID"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ])
                ]),
                _: 2
              }, 1024),
              u("p", Dc, [
                S[8] || (S[8] = u("strong", null, "This item", -1)),
                B(" " + A(V.outward || "relates to") + " ", 1),
                S[9] || (S[9] = u("strong", null, "another item", -1)),
                u("span", Uc, " · reverse: " + A(V.symmetric ? V.outward : V.inward), 1)
              ])
            ]),
            _: 2
          }, 1032, ["title", "kind"]))), 128)),
          t.value.length ? U("", !0) : (n(), b("p", Ec, "No link types yet. Add one to connect related work.")),
          u("div", Ac, [
            u("label", Oc, [
              S[10] || (S[10] = B("New link name ", -1)),
              h(s(Ve), {
                modelValue: c.value,
                "onUpdate:modelValue": S[0] || (S[0] = (V) => c.value = V),
                placeholder: "e.g. Blocks",
                onKeydown: Ae(Ie(g, ["prevent"]), ["enter"])
              }, null, 8, ["modelValue", "onKeydown"])
            ]),
            h(s(_), {
              label: "Add link type",
              severity: "secondary",
              disabled: !m.value,
              onClick: g,
              outlined: ""
            }, {
              icon: W(() => [
                h(s(ue), {
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
function zo(e) {
  return typeof e.error == "string" ? e.error : e.error?.message;
}
function no(e, a) {
  const t = zo(e);
  return e.parked ? "Stopped: " + (t ?? "Projection is parked") : t ? "Degraded: " + t : e.bootstrapping ? "Initializing" : e.last_seq >= a ? "Up to date" : "Catching up";
}
function Rc(e, a) {
  const t = a?.lifecycle.error, l = a?.problem ?? e.problem;
  if (e.installed === !1)
    return { kind: "missing", status: "Not installed", cause: "This board still references a plugin that is no longer installed." };
  if (l?.code === "plugin_config_invalid" || t?.code === "plugin_config_invalid")
    return { kind: "configuration", status: "Misconfigured", cause: l?.message ?? t?.message };
  if (l) return { kind: "manifest", status: "Plugin unavailable", cause: l.message };
  if (t?.source === "schema_provider")
    return { kind: "provider", status: "Schema provider failed", cause: t.message };
  if (t?.code === "plugin_projection_gap")
    return { kind: "history", status: "History gap", cause: t.message, floor: t.floor };
  if (a?.lifecycle.state === "failed")
    return { kind: "setup", status: "Attachment setup failed", cause: t?.message ?? "Work could not prepare the plugin attachment." };
  const o = Object.values(a?.projections ?? {});
  if (o.some((r) => r.parked)) return { kind: "reset", status: "Needs reset" };
  if (o.some(zo)) return { kind: "degraded", status: "Degraded" };
}
const Nc = {
  class: "work-stack",
  "aria-label": "Plugins editor"
}, Mc = { class: "work-form-actions" }, Fc = {
  key: 0,
  class: "kx-loading"
}, Lc = {
  key: 1,
  class: "kx-err",
  role: "alert"
}, Bc = {
  key: 2,
  class: "work-notice",
  role: "status"
}, zc = {
  key: 0,
  class: "work-row"
}, jc = {
  key: 0,
  class: "work-muted work-small"
}, qc = {
  key: 1,
  class: "work-notice"
}, Wc = {
  key: 2,
  class: "work-stack work-tight work-plugin-status"
}, Kc = {
  key: 0,
  class: "work-muted"
}, Gc = { key: 1 }, Hc = {
  key: 2,
  class: "work-row"
}, Yc = {
  key: 3,
  class: "work-row"
}, Xc = {
  key: 0,
  class: "work-small"
}, Jc = {
  key: 6,
  class: "work-row"
}, Zc = {
  key: 7,
  class: "work-row"
}, Qc = {
  key: 8,
  class: "work-row"
}, _c = {
  key: 3,
  class: "work-stack work-tight"
}, ev = {
  key: 0,
  class: "work-muted"
}, tv = { class: "work-form-actions" }, av = "kickside.work.planning:plugin", so = /* @__PURE__ */ $e({
  __name: "PluginsEditor",
  props: {
    boardId: {},
    draft: {},
    schema: {},
    options: {},
    configs: {},
    disabled: { type: Boolean },
    activationLocked: { type: Boolean },
    filters: {}
  },
  emits: ["configured", "refresh", "review", "validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = N({}), r = N(""), f = N(""), p = N(""), c = N(/* @__PURE__ */ new Set()), i = N(/* @__PURE__ */ new Set()), d = q(() => t.options.map((L) => {
      const D = Z(L.plugin);
      return { plugin: L, current: D, issue: Rc(L, D) };
    })), m = q(() => !!r.value || t.disabled), y = q(() => m.value || t.activationLocked), g = {}, x = q(() => (t.draft.item_types ?? []).filter((L) => !["issue", "sprint", "milestone"].includes(L.id)).map((L) => ({ value: L.id, label: L.title || Ne(L.id) }))), k = q(() => ["current_sprint", "milestone"].every((L) => t.schema.compiled?.fields?.some((D) => D.code === L))), S = q(() => {
      const L = t.filters;
      return L ? (t.draft.scopes ?? []).filter((D) => !L.some((M) => M.id === D && t.options.some((re) => re.plugin === M.plugin))) : [];
    });
    function V(L) {
      return (t.filters ?? []).filter((D) => D.plugin === L);
    }
    function $(L, D) {
      const M = new Set(V(L).map((de) => de.id)), re = t.draft.scopes ?? [], ie = [...re.filter((de) => !M.has(de)), ...D];
      (ie.length !== re.length || ie.some((de) => !re.includes(de))) && (t.draft.scopes = ie);
    }
    function E(L, D) {
      ke(L, { ...we(L), issue_types: D });
    }
    function C(L) {
      return !!L.config_schema && yo(L.config_schema).length > 0;
    }
    function Z(L) {
      return t.schema.plugins?.find((D) => D.plugin === L);
    }
    function Q(L) {
      return Z(L)?.active === !0;
    }
    function K(L) {
      return t.draft.plugins?.some((D) => D.use === L) === !0;
    }
    function ce(L, D) {
      const M = t.draft.plugins ?? [];
      D && !K(L) && (t.draft.plugins = [...M, { use: L }]), D || (t.draft.plugins = M.filter((re) => re.use !== L), delete t.configs[L], c.value.delete(L), l("validity", L, !0), $(L, []));
    }
    function ve(L, D) {
      ce(L, !1), l("review", D.currentTarget);
    }
    function we(L) {
      return Q(L) ? o.value[L] ?? Z(L)?.config ?? g : t.configs[L] ?? g;
    }
    function ke(L, D) {
      Q(L) ? o.value[L] = D : t.configs[L] = D;
    }
    function z(L, D) {
      D ? c.value.delete(L) : c.value.add(L), Q(L) || l("validity", L, D);
    }
    async function O(L, D = !1) {
      if (!(m.value || !D && c.value.has(L))) {
        r.value = L, f.value = "", p.value = "";
        try {
          D ? await Ct.configure(t.boardId, L) : (await Ct.configure(t.boardId, L, we(L)), delete o.value[L], i.value.delete(L)), p.value = D ? "Plugin recovery started." : "Plugin configuration saved.", l("configured");
        } catch (M) {
          f.value = at(M, D ? "Could not recover the plugin." : "Could not configure plugin.");
        } finally {
          r.value = "";
        }
      }
    }
    return (L, D) => (n(), b("section", Nc, [
      u("div", Mc, [
        h(s(_), {
          label: "Refresh status",
          severity: "secondary",
          outlined: "",
          disabled: !!r.value || e.disabled,
          onClick: D[0] || (D[0] = (M) => l("refresh"))
        }, {
          icon: W(() => [
            h(s(ue), {
              icon: "tabler:refresh",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        }, 8, ["disabled"])
      ]),
      e.options.length ? U("", !0) : (n(), b("p", Fc, "No installed plugins are visible to you.")),
      f.value ? (n(), b("div", Lc, A(f.value), 1)) : U("", !0),
      p.value ? (n(), b("p", Bc, A(p.value), 1)) : U("", !0),
      h(Ka, {
        columns: "plugins",
        count: e.options.length
      }, {
        default: W(() => [
          (n(!0), b(te, null, se(d.value, ({ plugin: M, current: re, issue: ie }) => (n(), H(Wa, {
            key: M.plugin,
            title: M.installed === !1 ? M.plugin : M.title || M.plugin,
            description: M.description,
            kind: K(M.plugin) !== Q(M.plugin) ? "Pending review" : ie?.status,
            class: "work-stack"
          }, {
            actions: W(() => [
              ie?.kind !== "missing" ? (n(), b("label", zc, [
                h(s(Je), {
                  "model-value": K(M.plugin),
                  "aria-label": "Enable " + (M.title || "plugin"),
                  disabled: y.value || !!M.problem && !K(M.plugin),
                  "onUpdate:modelValue": (de) => ce(M.plugin, de)
                }, null, 8, ["model-value", "aria-label", "disabled", "onUpdate:modelValue"]),
                D[2] || (D[2] = B("On this board ", -1))
              ])) : U("", !0)
            ]),
            default: W(() => [
              M.requires.length ? (n(), b("p", jc, "Requires " + A(M.requires.map((de) => e.options.find((ne) => ne.plugin === de)?.title || "Another capability").join(", ")), 1)) : U("", !0),
              re?.outdated ? (n(), b("p", qc, "The stored declaration differs from the installed plugin. Review activation to update it.")) : U("", !0),
              ie || re?.active ? (n(), b("div", Wc, [
                ie && "cause" in ie ? (n(), b("p", Kc, A(ie.cause), 1)) : ie ? U("", !0) : (n(), b("p", Gc, A(re?.lifecycle.state === "ready" ? "Ready to use" : "Getting ready"), 1)),
                (n(!0), b(te, null, se(re?.projections, (de, ne) => (n(), b("div", {
                  key: ne,
                  class: "work-stack work-tight"
                }, [
                  u("p", null, A(s(no)(de, e.schema.as_of)) + " · Indexed through " + A(de.last_seq) + " of " + A(e.schema.as_of) + " events.", 1)
                ]))), 128)),
                ie?.kind === "setup" && re?.active ? (n(), b("div", Hc, [
                  h(s(_), {
                    label: "Retry setup",
                    severity: "secondary",
                    outlined: "",
                    disabled: m.value,
                    onClick: (de) => O(M.plugin, !0)
                  }, null, 8, ["disabled", "onClick"])
                ])) : ie?.kind === "provider" ? (n(), b("div", Yc, [
                  h(s(_), {
                    label: "Retry schema check",
                    severity: "secondary",
                    outlined: "",
                    disabled: m.value,
                    onClick: D[1] || (D[1] = (de) => l("refresh"))
                  }, null, 8, ["disabled"])
                ])) : ie?.kind === "degraded" ? (n(), H(Le, {
                  key: 4,
                  class: "work-small",
                  label: "Inspect worker"
                }, {
                  default: W(() => [
                    D[3] || (D[3] = u("p", null, "Check the failing worker before resetting a projection.", -1)),
                    (n(!0), b(te, null, se(re?.projections, (de, ne) => (n(), b("p", { key: ne }, A(ne) + " · " + A(s(no)(de, e.schema.as_of)), 1))), 128))
                  ]),
                  _: 2
                }, 1024)) : ie?.kind === "history" ? (n(), b(te, { key: 5 }, [
                  ie.floor !== void 0 ? (n(), b("p", Xc, "Earliest retained event sequence is " + A(ie.floor) + ".", 1)) : U("", !0),
                  h(Le, {
                    class: "work-small",
                    label: "Review retained history"
                  }, {
                    default: W(() => [...D[4] || (D[4] = [
                      u("p", null, "Ask the plugin maintainer to review the event projection’s start sequence. The plugin needs a declaration that can run with the retained history.", -1)
                    ])]),
                    _: 1
                  })
                ], 64)) : ie?.kind === "reset" ? (n(), b("div", Jc, [
                  h(s(_), {
                    label: "Reset projection",
                    severity: "secondary",
                    outlined: "",
                    disabled: m.value,
                    onClick: (de) => O(M.plugin, !0)
                  }, null, 8, ["disabled", "onClick"]),
                  D[5] || (D[5] = u("span", { class: "work-muted work-small" }, "Resolve the worker error before resetting.", -1))
                ])) : ie?.kind === "configuration" && K(M.plugin) && C(M) && !i.value.has(M.plugin) ? (n(), b("div", Zc, [
                  h(s(_), {
                    label: "Edit configuration",
                    severity: "secondary",
                    outlined: "",
                    disabled: m.value,
                    onClick: (de) => i.value.add(M.plugin)
                  }, null, 8, ["disabled", "onClick"])
                ])) : ie?.kind === "missing" && K(M.plugin) ? (n(), b("div", Qc, [
                  h(s(_), {
                    label: "Review references",
                    severity: "secondary",
                    outlined: "",
                    disabled: y.value,
                    onClick: (de) => ve(M.plugin, de)
                  }, null, 8, ["disabled", "onClick"])
                ])) : U("", !0)
              ])) : U("", !0),
              V(M.plugin).length && (K(M.plugin) || Q(M.plugin)) ? (n(), b("section", _c, [
                D[6] || (D[6] = u("h4", null, "Query filters", -1)),
                D[7] || (D[7] = u("p", { class: "work-muted" }, "Choose which filters people can use to narrow down work on this board.", -1)),
                h(ut, {
                  label: "Available filters",
                  disabled: !!r.value || e.disabled || !K(M.plugin),
                  options: V(M.plugin).map((de) => ({ value: de.id, label: de.title })),
                  "model-value": e.draft.scopes?.filter((de) => V(M.plugin).some((ne) => ne.id === de)),
                  "onUpdate:modelValue": (de) => $(M.plugin, de)
                }, null, 8, ["disabled", "options", "model-value", "onUpdate:modelValue"])
              ])) : U("", !0),
              K(M.plugin) && C(M) && ie?.kind !== "manifest" && ie?.kind !== "missing" && (ie?.kind !== "configuration" || i.value.has(M.plugin)) ? (n(), H(ba(ie && ie.kind !== "configuration" ? Le : "div"), {
                key: 4,
                label: ie && ie.kind !== "configuration" ? "Plugin settings" : void 0,
                class: "work-stack work-tight"
              }, {
                default: W(() => [
                  M.plugin === av ? (n(), b(te, { key: 0 }, [
                    k.value ? (n(), H(ut, {
                      key: 1,
                      label: "Plan these item types",
                      options: x.value,
                      "model-value": we(M.plugin).issue_types,
                      disabled: !!r.value || e.disabled,
                      "onUpdate:modelValue": (de) => E(M.plugin, de)
                    }, null, 8, ["options", "model-value", "disabled", "onUpdate:modelValue"])) : (n(), b("p", ev, "The Planning pack supplies sprint and milestone fields for item types.")),
                    D[8] || (D[8] = u("p", { class: "work-muted" }, "Selected types get Current sprint and Milestone fields.", -1))
                  ], 64)) : (n(), H(go, {
                    key: 1,
                    disabled: !!r.value || e.disabled,
                    schema: M.config_schema,
                    "model-value": we(M.plugin),
                    "onUpdate:modelValue": (de) => ke(M.plugin, de),
                    onValidity: (de) => z(M.plugin, de)
                  }, null, 8, ["disabled", "schema", "model-value", "onUpdate:modelValue", "onValidity"])),
                  u("div", tv, [
                    h(s(_), {
                      label: ie ? "Reset form values" : "Reset",
                      severity: "secondary",
                      outlined: "",
                      disabled: !!r.value || e.disabled,
                      onClick: (de) => ke(M.plugin, Q(M.plugin) ? s(Mt)(Z(M.plugin)?.config ?? {}) : {})
                    }, null, 8, ["label", "disabled", "onClick"]),
                    Q(M.plugin) ? (n(), H(s(_), {
                      key: 0,
                      label: "Save plugin settings",
                      disabled: !!r.value || e.disabled || c.value.has(M.plugin) || !o.value[M.plugin],
                      loading: r.value === M.plugin,
                      onClick: (de) => O(M.plugin)
                    }, null, 8, ["disabled", "loading", "onClick"])) : U("", !0)
                  ])
                ]),
                _: 2
              }, 1032, ["label"])) : U("", !0)
            ]),
            _: 2
          }, 1032, ["title", "description", "kind"]))), 128))
        ]),
        _: 1
      }, 8, ["count"]),
      S.value.length ? (n(), H(Le, {
        key: 3,
        class: "work-settings-card work-disclosure",
        label: "Unavailable query filters"
      }, {
        default: W(() => [
          D[9] || (D[9] = u("p", { class: "work-muted" }, "These filters came from a plugin that is unavailable. Remove one to stop using it on this board.", -1)),
          (n(!0), b(te, null, se(S.value, (M, re) => (n(), H(s(_), {
            key: M,
            label: "Remove unavailable filter " + (re + 1),
            severity: "secondary",
            text: "",
            onClick: (ie) => e.draft.scopes = e.draft.scopes?.filter((de) => de !== M)
          }, null, 8, ["label", "onClick"]))), 128))
        ]),
        _: 1
      })) : U("", !0),
      (n(!0), b(te, null, se(e.draft.plugins?.filter((M) => !e.options.some((re) => re.plugin === M.use)) ?? [], (M) => (n(), b("article", {
        key: M.use,
        class: "work-settings-card work-stack"
      }, [
        u("p", null, [
          u("strong", null, A(M.use), 1),
          D[10] || (D[10] = B(" · Not installed", -1))
        ]),
        D[11] || (D[11] = u("p", { class: "work-muted" }, "This board still references a plugin that is no longer installed.", -1)),
        h(s(_), {
          label: "Review references",
          severity: "secondary",
          outlined: "",
          disabled: y.value,
          onClick: (re) => ve(M.use, re)
        }, null, 8, ["disabled", "onClick"])
      ]))), 128))
    ]));
  }
}), lv = {
  key: 0,
  class: "work-dirty"
}, ov = /* @__PURE__ */ $e({
  __name: "SettingsActions",
  props: {
    dirty: { type: Boolean },
    busy: { type: Boolean },
    checkingRemoval: { type: Boolean },
    disabled: { type: Boolean }
  },
  emits: ["discard", "primary"],
  setup(e) {
    return (a, t) => (n(), b(te, null, [
      e.dirty ? (n(), b("span", lv, "Unsaved changes")) : U("", !0),
      h(s(_), {
        class: "work-discard",
        label: "Discard",
        "aria-label": "Discard",
        title: "Discard",
        severity: "secondary",
        outlined: "",
        disabled: !e.dirty || e.busy || e.checkingRemoval,
        onClick: t[0] || (t[0] = (l) => a.$emit("discard"))
      }, {
        icon: W(() => [
          h(s(ue), { icon: "tabler:restore" })
        ]),
        _: 1
      }, 8, ["disabled"]),
      h(s(_), {
        label: "Review changes",
        disabled: e.disabled,
        loading: e.busy,
        onClick: t[1] || (t[1] = (l) => a.$emit("primary", l.currentTarget))
      }, null, 8, ["disabled", "loading"])
    ], 64));
  }
}), iv = { class: "system-section-head work-ia-head" }, nv = { class: "system-section-head-text" }, sv = {
  key: 0,
  class: "kx-head-actions"
}, rv = {
  key: 0,
  class: "kx-err work-ia-share-error",
  role: "alert"
}, dv = ["config"], uv = /* @__PURE__ */ $e({
  __name: "SettingsHead",
  props: {
    title: {},
    description: {},
    board: {},
    authorized: { type: Boolean },
    busy: { type: Boolean }
  },
  emits: ["shared"],
  setup(e, { expose: a }) {
    const t = e, l = N(!1), o = N(!1), r = N("");
    async function f() {
      const c = t.board;
      if (!(!t.authorized || !c || t.busy || o.value)) {
        o.value = !0, r.value = "";
        try {
          const i = await Dt("kickside-share");
          if (t.board?.board_id !== c.board_id || !t.authorized) return;
          i ? l.value = !0 : r.value = "Sharing is unavailable. Try opening it again.";
        } finally {
          o.value = !1;
        }
      }
    }
    De([() => t.authorized, () => t.board?.board_id], () => {
      l.value = !1, r.value = "";
    });
    const p = q(() => {
      const c = encodeURIComponent(t.board?.board_id ?? "");
      return JSON.stringify({
        resource_id: t.board?.board_id,
        title: t.board?.title,
        access_url: "/api/v1/component-access/grants/" + c,
        share_url: "/api/v1/component-access/share/" + c
      });
    });
    return a({ share: f }), (c, i) => (n(), b(te, null, [
      u("header", iv, [
        u("div", nv, [
          u("h1", null, A(e.title), 1),
          u("p", null, A(e.description), 1)
        ]),
        e.authorized && e.board ? (n(), b("div", sv, [
          h(s(_), {
            label: "Share board",
            severity: "secondary",
            outlined: "",
            loading: o.value,
            disabled: e.busy,
            onClick: f
          }, {
            icon: W(() => [
              h(s(ue), {
                icon: "tabler:share",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["loading", "disabled"]),
          lt(c.$slots, "default")
        ])) : U("", !0)
      ]),
      r.value ? (n(), b("p", rv, A(r.value), 1)) : U("", !0),
      l.value && e.authorized ? (n(), b("kickside-share", {
        key: 1,
        config: p.value,
        onClose: i[0] || (i[0] = (d) => l.value = !1),
        onChanged: i[1] || (i[1] = (d) => c.$emit("shared"))
      }, null, 40, dv)) : U("", !0)
    ], 64));
  }
}), cv = {
  key: 0,
  class: "work-muted"
}, jo = /* @__PURE__ */ $e({
  __name: "SectionSummary",
  props: {
    facts: {}
  },
  setup(e) {
    return (a, t) => e.facts.length ? (n(), b("p", cv, A(e.facts.join(" · ")), 1)) : U("", !0);
  }
}), vv = {
  class: "work-stack",
  "aria-label": "Board visibility"
}, mv = { class: "work-stack work-tight" }, fv = {
  key: 0,
  class: "work-row"
}, pv = { class: "work-stack work-tight" }, bv = { class: "work-settings-list" }, hv = { class: "work-row-main" }, gv = { class: "work-small work-muted" }, yv = { class: "work-row-control" }, kv = { class: "work-row" }, wv = /* @__PURE__ */ $e({
  __name: "VisibilityEditor",
  props: {
    draft: {},
    boardId: {}
  },
  emits: ["validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = q(() => t.draft.visibility), r = q(() => (t.draft.fields ?? []).filter((m) => m.form === "text" && (!m.cardinality || m.cardinality === "one") && m.type !== "rollup" && m.index !== "number" && m.config?.case !== "insensitive")), f = N(""), p = q(() => r.value.find((m) => m.code === o.value?.field)?.type !== "option");
    function c() {
      !f.value || !o.value || o.value.levels.some((m) => m.id === f.value) || (o.value.levels.push({ id: f.value, holders: [] }), f.value = "");
    }
    function i(m) {
      if (!m) {
        delete t.draft.visibility;
        return;
      }
      const y = r.value.find((g) => g.code === m);
      t.draft.visibility = { field: m, levels: (y?.options ?? []).map((g) => ({ id: g.id, holders: [] })) };
    }
    function d(m, y) {
      const g = o.value?.levels.find((x) => x.id === m);
      g && (g.holders = y ?? []);
    }
    return (m, y) => (n(), b("section", vv, [
      y[10] || (y[10] = u("h3", { class: "work-group-title" }, "Board visibility", -1)),
      y[11] || (y[11] = u("p", { class: "work-small work-muted" }, "Restrict items by their visibility level. People still need access to the board.", -1)),
      u("label", mv, [
        y[7] || (y[7] = B("Visibility field", -1)),
        h(s(me), {
          "aria-label": "Visibility field",
          placeholder: "No additional restriction",
          "model-value": o.value?.field ?? "",
          options: [{ label: "No additional restriction", value: "" }, ...r.value.map((g) => ({ label: s(Ke)(g), value: g.code }))],
          optionLabel: "label",
          optionValue: "value",
          appendTo: "self",
          "onUpdate:modelValue": y[0] || (y[0] = (g) => i(g))
        }, null, 8, ["model-value", "options"])
      ]),
      o.value ? (n(), b(te, { key: 0 }, [
        p.value ? (n(), b("div", fv, [
          u("label", pv, [
            y[8] || (y[8] = B("Level ID", -1)),
            h(s(Ve), {
              modelValue: f.value,
              "onUpdate:modelValue": y[1] || (y[1] = (g) => f.value = g),
              "aria-label": "New visibility level",
              onKeydown: Ae(Ie(c, ["prevent"]), ["enter"])
            }, null, 8, ["modelValue", "onKeydown"])
          ]),
          h(s(_), {
            label: "Add level",
            severity: "secondary",
            outlined: "",
            disabled: !f.value || o.value.levels.some((g) => g.id === f.value),
            onClick: c
          }, null, 8, ["disabled"])
        ])) : U("", !0),
        u("div", bv, [
          (n(!0), b(te, null, se(o.value.levels, (g, x) => (n(), b("div", {
            key: g.id,
            class: "work-settings-row"
          }, [
            u("div", hv, [
              u("strong", null, A(r.value.find((k) => k.code === o.value.field)?.options?.find((k) => k.id === g.id)?.label || g.id), 1),
              u("p", gv, "Level " + A(x + 1), 1)
            ]),
            u("div", yv, [
              h(xo, {
                "board-id": e.boardId,
                label: "Who can see these items",
                "model-value": g.holders,
                "onUpdate:modelValue": (k) => d(g.id, k),
                onValidity: y[2] || (y[2] = (k) => l("validity", k))
              }, null, 8, ["board-id", "model-value", "onUpdate:modelValue"])
            ])
          ]))), 128))
        ]),
        u("label", kv, [
          h(s(Je), {
            "model-value": o.value.bypass === "admin",
            "onUpdate:modelValue": y[3] || (y[3] = (g) => g ? o.value.bypass = "admin" : delete o.value.bypass)
          }, null, 8, ["model-value"]),
          y[9] || (y[9] = B("Board administrators can see every level", -1))
        ]),
        h(s(_), {
          label: "Remove visibility restriction",
          severity: "secondary",
          text: "",
          onClick: y[4] || (y[4] = (g) => delete e.draft.visibility)
        })
      ], 64)) : U("", !0),
      h(Ut, {
        label: "Visibility rules",
        "model-value": o.value,
        shape: "object",
        example: { field: "visibility", levels: [{ id: "internal", holders: [] }], bypass: "admin" },
        "onUpdate:modelValue": y[5] || (y[5] = (g) => e.draft.visibility = g),
        onValidity: y[6] || (y[6] = (g) => l("validity", g))
      }, null, 8, ["model-value"])
    ]));
  }
}), Vv = { class: "work-ia-section" }, $v = {
  class: "work-settings-list",
  "aria-labelledby": "work-sharing-title"
}, xv = { class: "work-settings-row" }, Cv = {
  key: 0,
  class: "work-member-preview",
  "aria-label": "People and groups with direct access"
}, Sv = { class: "work-spacer" }, Tv = {
  key: 1,
  class: "work-chips"
}, Iv = {
  key: 1,
  class: "work-settings-row work-muted work-small"
}, Dv = {
  key: 2,
  class: "work-settings-row work-muted"
}, Uv = {
  key: 3,
  class: "work-settings-row"
}, Ev = {
  key: 4,
  class: "work-settings-row work-muted",
  role: "status"
}, Av = /* @__PURE__ */ $e({
  __name: "BoardAccessSettings",
  props: {
    boardId: {},
    draft: {},
    active: { type: Boolean },
    grantsVersion: {}
  },
  emits: ["share", "validity"],
  setup(e) {
    const a = e, t = N(), l = N([]), o = q(() => t.value?.filter((k) => k.subject_type === "group").length ?? 0), r = q(() => (t.value?.length ?? 0) - o.value), f = q(() => [...t.value ?? []].sort((k, S) => +!!S.owner - +!!k.owner || S.access_mask - k.access_mask).slice(0, 6)), p = q(() => f.value.map((k) => ({ id: k.subject_id, kind: k.subject_type ?? "user" }))), c = ko(() => a.boardId, p);
    function i(k) {
      return k.full_name || c.label({ id: k.subject_id, kind: k.subject_type ?? "user", email: k.email });
    }
    function d(k) {
      return l.value.filter((S) => (k.access_mask & S.bit) === S.bit);
    }
    const m = N(!1), y = ua(), g = q(() => [
      ...t.value ? [
        r.value + (r.value === 1 ? " person with direct access" : " people with direct access"),
        o.value + (o.value === 1 ? " group with access" : " groups with access")
      ] : [m.value ? "Member summary unavailable" : "Loading members…"],
      a.draft.visibility ? "Item visibility rules set" : "No item visibility rules"
    ]);
    async function x() {
      const k = y();
      m.value = !1;
      try {
        const [{ data: S }, V] = await Promise.all([
          bl.get("/api/v1/component-access/grants/" + encodeURIComponent(a.boardId)),
          bl.get("/api/v1/components/access-model")
        ]);
        if (!k()) return;
        if (!S?.success || !Array.isArray(S.access)) throw new Error("Grants unavailable");
        t.value = S.access, l.value = V.data?.success && Array.isArray(V.data.capabilities) ? V.data.capabilities : [];
      } catch {
        k() && (t.value = void 0, m.value = !0);
      }
    }
    return xl(() => y()), De(() => [a.active, a.boardId, a.grantsVersion], () => {
      a.active && x();
    }, { immediate: !0 }), (k, S) => (n(), b("section", Vv, [
      h(jo, { facts: g.value }, null, 8, ["facts"]),
      u("section", $v, [
        u("div", xv, [
          S[2] || (S[2] = u("div", { class: "work-row-main" }, [
            u("h3", {
              id: "work-sharing-title",
              class: "work-row-title"
            }, "Members and sharing"),
            u("p", { class: "work-muted work-small" }, "Invite people and groups, or change the access they already have.")
          ], -1)),
          h(s(_), {
            label: "Manage access",
            severity: "secondary",
            outlined: "",
            onClick: S[0] || (S[0] = (V) => k.$emit("share"))
          }, {
            icon: W(() => [
              h(s(ue), {
                icon: "tabler:users",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          })
        ]),
        f.value.length ? (n(), b("ul", Cv, [
          (n(!0), b(te, null, se(f.value, (V) => (n(), b("li", {
            key: V.subject_type + V.subject_id,
            class: "work-settings-row"
          }, [
            h(s(ue), {
              icon: V.subject_type === "group" ? "tabler:users" : "tabler:user",
              "aria-hidden": "true"
            }, null, 8, ["icon"]),
            u("strong", Sv, A(i(V)), 1),
            V.owner ? (n(), H(s(Ze), {
              key: 0,
              severity: "secondary",
              value: "Owner"
            })) : (n(), b("span", Tv, [
              (n(!0), b(te, null, se(d(V), ($) => (n(), H(s(Ze), {
                key: $.key,
                severity: "secondary",
                value: $.label
              }, null, 8, ["value"]))), 128))
            ]))
          ]))), 128))
        ])) : U("", !0),
        t.value && t.value.length > f.value.length ? (n(), b("p", Iv, " See all " + A(t.value.length) + " people and groups in Manage access. ", 1)) : t.value && !t.value.length ? (n(), b("p", Dv, "No direct grants yet.")) : m.value ? (n(), b("div", Uv, [
          S[3] || (S[3] = u("p", {
            class: "work-spacer work-muted",
            role: "alert"
          }, "Member summary is unavailable.", -1)),
          h(s(_), {
            label: "Reload members",
            severity: "secondary",
            text: "",
            onClick: x
          })
        ])) : t.value ? U("", !0) : (n(), b("p", Ev, "Loading members…"))
      ]),
      h(Le, {
        class: "work-settings-card work-disclosure",
        label: "Advanced · Item visibility"
      }, {
        default: W(() => [
          h(wv, {
            "board-id": e.boardId,
            draft: e.draft,
            onValidity: S[1] || (S[1] = (V) => k.$emit("validity", V))
          }, null, 8, ["board-id", "draft"])
        ]),
        _: 1
      })
    ]));
  }
}), Ov = { class: "work-board-identity work-stack work-tight" }, Pv = { class: "work-stack work-tight" }, Rv = { class: "work-stack work-tight" }, Nv = { class: "work-stack work-tight" }, Mv = ["value", "inert"], Fv = {
  key: 1,
  class: "work-muted work-small"
}, Lv = {
  key: 0,
  class: "work-stack work-tight"
}, Bv = { class: "work-row" }, zv = {
  key: 1,
  class: "work-row work-wrap"
}, jv = { class: "work-spacer" }, qv = { class: "work-muted work-small" }, Wv = { class: "work-row" }, Kv = { class: "work-row work-board-title" }, Gv = {
  key: 1,
  class: "work-identity-actions"
}, Hv = ["title"], Yv = {
  key: 3,
  class: "kx-err work-inline",
  role: "alert"
}, Xv = {
  key: 4,
  class: "work-muted work-small",
  role: "status"
}, Jv = /* @__PURE__ */ $e({
  __name: "BoardIdentity",
  props: {
    board: {},
    boardApps: {},
    compact: { type: Boolean },
    detail: { type: Boolean },
    subtitle: {}
  },
  emits: ["saved", "dirty-change"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = N(!1), r = N(""), f = N(""), p = N(""), c = N(""), i = N(!1), d = N(!1), m = N(""), y = N(""), g = q(() => t.board?.access?.admin === !0), x = N({ title: "", description: "", icon: "", app: "" }), k = q(() => [
      { id: "", title: "Default app" },
      ...t.boardApps ?? [],
      ...t.board?.ui_app && !t.boardApps?.some((Q) => Q.id === t.board?.ui_app) ? [{ id: t.board.ui_app, title: t.boardApps ? "Unavailable app" : "Configured board app", disabled: !0 }] : []
    ]), S = q(() => k.value.find((Q) => Q.id === (t.board?.ui_app ?? ""))?.title), V = q(() => !!t.boardApps?.length || !!t.board?.ui_app);
    function $() {
      x.value = { title: t.board?.title ?? "", icon: t.board?.icon ?? "", description: t.board?.description ?? "", app: t.board?.ui_app ?? "" }, r.value = x.value.title, p.value = x.value.icon, f.value = x.value.description, c.value = x.value.app, m.value = "", y.value = "", o.value = !0, Dt("wc-icon-picker").then((Q) => i.value = Q);
    }
    const E = q(() => {
      const Q = {};
      return r.value.trim() !== x.value.title && (Q.title = r.value.trim()), f.value !== x.value.description && (Q.description = f.value), p.value !== x.value.icon && (Q.icon = p.value), c.value !== x.value.app && (Q.ui_app = c.value), Q;
    });
    De(g, (Q) => {
      Q || C();
    }), De(() => o.value && Object.keys(E.value).length > 0, (Q) => l("dirty-change", Q));
    function C() {
      o.value = !1, m.value = "";
    }
    async function Z() {
      if (!g.value || !t.board || d.value || !r.value.trim()) return;
      const Q = E.value;
      if (!Object.keys(Q).length) {
        o.value = !1, y.value = "Nothing changed.";
        return;
      }
      d.value = !0, m.value = "";
      try {
        const K = await gt.updateBoard(t.board.board_id, Q);
        o.value = !1, y.value = K.status === "unchanged" ? "Nothing changed." : "Board saved.", l("saved");
      } catch (K) {
        m.value = at(K, "Could not save the board.");
      } finally {
        d.value = !1;
      }
    }
    return (Q, K) => (n(), b("div", Ov, [
      o.value ? (n(), b("form", {
        key: 0,
        class: "work-identity-edit",
        "aria-label": "Edit board",
        onClick: K[4] || (K[4] = Ie(() => {
        }, ["stop"])),
        onSubmit: Ie(Z, ["prevent"])
      }, [
        u("label", Pv, [
          K[5] || (K[5] = B("Title", -1)),
          h(s(Ve), {
            modelValue: r.value,
            "onUpdate:modelValue": K[0] || (K[0] = (ce) => r.value = ce),
            required: "",
            autofocus: "",
            disabled: d.value
          }, null, 8, ["modelValue", "disabled"])
        ]),
        u("label", Rv, [
          K[6] || (K[6] = B("Description", -1)),
          h(s(Na), {
            modelValue: f.value,
            "onUpdate:modelValue": K[1] || (K[1] = (ce) => f.value = ce),
            rows: "1",
            disabled: d.value
          }, null, 8, ["modelValue", "disabled"])
        ]),
        u("div", Nv, [
          K[7] || (K[7] = u("span", null, "Board icon", -1)),
          i.value ? (n(), b("wc-icon-picker", {
            key: 0,
            value: p.value,
            fallback: "tabler:layout-kanban",
            inert: d.value || void 0,
            onSelect: K[2] || (K[2] = (ce) => p.value = ce.detail)
          }, null, 40, Mv)) : (n(), b("p", Fv, "The icon picker is unavailable."))
        ]),
        e.detail && V.value ? (n(), b("label", Lv, [
          K[8] || (K[8] = B("Open board in ", -1)),
          h(s(me), {
            modelValue: c.value,
            "onUpdate:modelValue": K[3] || (K[3] = (ce) => c.value = ce),
            "aria-label": "Open board in",
            options: k.value,
            optionLabel: "title",
            optionValue: "id",
            optionDisabled: "disabled",
            appendTo: "self",
            disabled: d.value
          }, null, 8, ["modelValue", "options", "disabled"]),
          K[9] || (K[9] = u("span", { class: "work-muted work-small" }, "This is where people open the board from Work navigation.", -1))
        ])) : U("", !0),
        u("div", Bv, [
          h(s(_), {
            label: "Save",
            severity: "secondary",
            type: "submit",
            disabled: !r.value.trim() || d.value,
            loading: d.value,
            outlined: ""
          }, {
            icon: W(() => [
              h(s(ue), {
                icon: "tabler:device-floppy",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled", "loading"]),
          h(s(_), {
            label: "Cancel",
            severity: "secondary",
            disabled: d.value,
            onClick: C,
            outlined: ""
          }, {
            icon: W(() => [
              h(s(ue), {
                icon: "tabler:x",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled"])
        ])
      ], 32)) : e.detail ? (n(), b("div", zv, [
        u("div", jv, [
          K[10] || (K[10] = u("h3", { class: "work-row-title" }, "Board app", -1)),
          u("p", qv, A(S.value), 1)
        ]),
        g.value ? (n(), H(s(_), {
          key: 0,
          label: "Edit board",
          severity: "secondary",
          outlined: "",
          onClick: Ie($, ["stop"])
        }, {
          icon: W(() => [
            h(s(ue), {
              icon: "tabler:pencil",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        })) : U("", !0)
      ])) : (n(), b(te, { key: 2 }, [
        u("div", Wv, [
          u("div", Kv, [
            e.board?.icon ? (n(), H(s(ue), {
              key: 0,
              icon: e.board.icon,
              "aria-hidden": "true"
            }, null, 8, ["icon"])) : U("", !0),
            (n(), H(ba(e.compact ? "h2" : "h1"), {
              class: vt(e.compact ? "kx-card-name" : "kx-title")
            }, {
              default: W(() => [
                B(A(e.board?.title || "Untitled board"), 1)
              ]),
              _: 1
            }, 8, ["class"]))
          ]),
          e.compact ? lt(Q.$slots, "title-end", {}, void 0, void 0, 0) : U("", !0),
          e.compact ? (n(), b("span", Gv, [
            g.value ? (n(), H(s(_), {
              key: 0,
              severity: "secondary",
              text: "",
              size: "small",
              onClick: Ie($, ["stop"]),
              "aria-label": "Edit board"
            }, {
              default: W(() => [
                h(s(ue), {
                  icon: "tabler:pencil",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            })) : U("", !0),
            lt(Q.$slots, "actions")
          ])) : g.value ? (n(), H(s(_), {
            key: 2,
            severity: "secondary",
            text: "",
            size: "small",
            onClick: Ie($, ["stop"]),
            "aria-label": "Edit board"
          }, {
            default: W(() => [
              h(s(ue), {
                icon: "tabler:pencil",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          })) : U("", !0),
          e.compact ? U("", !0) : lt(Q.$slots, "title-end", {}, void 0, void 0, 3)
        ]),
        !e.compact && (e.subtitle || e.board?.description) ? (n(), b("p", {
          key: 0,
          class: "kx-head-sub",
          title: e.subtitle || e.board?.description
        }, A(e.subtitle || e.board?.description), 9, Hv)) : U("", !0)
      ], 64)),
      m.value ? (n(), b("p", Yv, A(m.value), 1)) : U("", !0),
      y.value ? (n(), b("p", Xv, A(y.value), 1)) : U("", !0)
    ]));
  }
}), Zv = { class: "work-ia-section work-ia-general" }, Qv = {
  class: "work-settings-list work-board-details",
  "aria-label": "Board details"
}, _v = { class: "work-settings-row work-board-details-identity" }, em = { class: "work-stack work-tight" }, tm = {
  key: 0,
  class: "work-muted work-small"
}, am = { class: "work-settings-row" }, lm = { class: "work-row-main" }, om = { class: "work-muted work-small" }, im = {
  class: "work-settings-list",
  "aria-label": "Board summary"
}, nm = { class: "work-settings-row" }, sm = {
  key: 0,
  class: "work-muted"
}, rm = { class: "work-settings-row" }, dm = { class: "work-row-main" }, um = { class: "work-muted work-small" }, cm = { key: 0 }, vm = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, mm = {
  key: 0,
  class: "work-stack work-tight"
}, fm = {
  key: 1,
  class: "work-muted"
}, pm = { class: "work-stack work-tight" }, bm = { class: "work-spacer" }, hm = /* @__PURE__ */ $e({
  __name: "GeneralSettings",
  props: {
    draft: {},
    schema: {},
    board: {},
    boardApps: {},
    active: { type: Boolean },
    draftForm: {},
    disabled: { type: Boolean },
    packTitle: {},
    outdated: { type: Boolean },
    upgradeReason: {},
    canUpgrade: { type: Boolean },
    canInstall: { type: Boolean },
    packError: {}
  },
  emits: ["upgrade", "install", "retry", "saved", "dirty-change"],
  setup(e) {
    const a = e, t = {
      comments_per_item: "Comments per item",
      audit: "Change history",
      audit_days: "Change history retention",
      interval_days: "Time-in-state history retention",
      trash_days: "Trash retention",
      tombstone_days: "Deletion record retention"
    }, l = q(() => Object.keys(t).filter((m) => a.draft.policy?.[m] !== void 0));
    function o(m) {
      const y = a.draft.policy?.[m];
      return m === "audit" ? y === "off" ? "Off" : "Track field changes" : m === "comments_per_item" ? y : y === 0 ? m === "audit_days" || m === "interval_days" ? "365 days" : "Clean up immediately" : y === 1 ? "1 day" : y + " days";
    }
    const r = N(), f = N(!1);
    let p = "";
    De([() => a.active, () => a.board?.board_id, () => a.schema.generation], async ([m, y, g], x, k) => {
      if (!m || !y || p === y + "/" + g) return;
      r.value = void 0, f.value = !1;
      let S = !0;
      k(() => S = !1);
      try {
        const V = await Promise.all(Array.from(
          { length: Math.min(3, Math.max(0, g - 1)) },
          ($, E) => gt.schema(y, g - E - 1)
        ));
        S && (r.value = V, p = y + "/" + g);
      } catch {
        S && (f.value = !0);
      }
    }, { immediate: !0 });
    function c(m) {
      return JSON.stringify(m, (y, g) => g && typeof g == "object" && !Array.isArray(g) ? Object.fromEntries(Object.entries(g).sort(([x], [k]) => x.localeCompare(k))) : g);
    }
    function i(m, y) {
      if (!y) return ["Initial board setup"];
      const g = m.declaration, x = y.declaration, k = [], S = [
        ["Fields", g.fields, x.fields],
        ["Item types", g.item_types, x.item_types],
        ["Workflow", g.processes, x.processes],
        ["Links", g.relation_types, x.relation_types],
        ["Plugins and filters", [g.plugins, g.scopes], [x.plugins, x.scopes]],
        ["Item visibility", g.visibility, x.visibility],
        ["Board rules", g.policy, x.policy],
        ["Starting pack", m.pack, y.pack],
        ["Item key prefix", m.key_prefix, y.key_prefix]
      ];
      if (c(g.fields) !== c(x.fields)) {
        const $ = g.fields?.filter((E) => !x.fields?.some((C) => C.code === E.code)) ?? [];
        $.length === 1 && k.push("Added " + Ke($[0]));
      }
      const V = S.filter(([, $, E]) => c($) !== c(E)).map(([$]) => $).filter(($) => $ !== "Fields" || !k.length);
      return V.length && k.push(V.join(", ") + " updated"), k.length ? k : ["Board setup updated"];
    }
    const d = q(() => {
      if (!r.value || a.schema.generation < 1) return [];
      const m = [a.schema, ...r.value];
      return m.slice(0, 3).map((y, g) => i(y, m[g + 1]));
    });
    return (m, y) => (n(), b("section", Zv, [
      u("section", Qv, [
        u("div", _v, [
          u("div", em, [
            y[6] || (y[6] = u("h3", { class: "work-row-title" }, "Board name", -1)),
            u("p", null, A(e.board?.title), 1),
            e.board?.description ? (n(), b("p", tm, A(e.board.description), 1)) : U("", !0)
          ]),
          (n(), H(Jv, {
            key: e.board?.board_id,
            board: e.board,
            "board-apps": e.boardApps,
            detail: "",
            onDirtyChange: y[0] || (y[0] = (g) => m.$emit("dirty-change", g)),
            onSaved: y[1] || (y[1] = (g) => m.$emit("saved"))
          }, null, 8, ["board", "board-apps"]))
        ]),
        u("div", am, [
          u("div", lm, [
            y[7] || (y[7] = u("h3", { class: "work-row-title" }, "Item key prefix", -1)),
            u("p", om, "Shown on items, for example " + A(e.draft.key_prefix || "WORK") + "-1.", 1)
          ]),
          h(s(Ve), {
            modelValue: e.draft.key_prefix,
            "onUpdate:modelValue": y[2] || (y[2] = (g) => e.draft.key_prefix = g),
            form: e.draftForm,
            disabled: e.disabled,
            "aria-label": "Item key prefix",
            required: "",
            pattern: "[A-Z][A-Z0-9]{1,9}",
            maxlength: "10"
          }, null, 8, ["modelValue", "form", "disabled"])
        ])
      ]),
      u("section", im, [
        u("header", nm, [
          y[8] || (y[8] = u("h3", { class: "work-row-main work-row-title" }, "Board summary", -1)),
          e.board?.open_count !== void 0 && e.board.item_count !== void 0 ? (n(), b("p", sm, A(e.board.open_count) + " open · " + A(e.board.item_count) + " total ", 1)) : U("", !0)
        ]),
        u("div", rm, [
          u("div", dm, [
            y[9] || (y[9] = u("h4", { class: "work-row-title" }, "Board pack", -1)),
            u("p", um, [
              B(A(e.packTitle || "No pack installed"), 1),
              e.outdated ? (n(), b("span", cm, " · Update available")) : U("", !0)
            ])
          ]),
          e.packError ? (n(), b("p", vm, A(e.packError), 1)) : U("", !0),
          e.packError ? (n(), H(s(_), {
            key: 1,
            label: "Reload packs",
            severity: "secondary",
            outlined: "",
            onClick: y[3] || (y[3] = (g) => m.$emit("retry"))
          })) : e.packTitle ? e.outdated ? (n(), H(s(_), {
            key: 3,
            label: "Update pack",
            severity: "secondary",
            outlined: "",
            disabled: !e.canUpgrade,
            title: e.upgradeReason,
            onClick: y[5] || (y[5] = (g) => m.$emit("upgrade"))
          }, null, 8, ["disabled", "title"])) : U("", !0) : (n(), H(s(_), {
            key: 2,
            label: "Install pack",
            severity: "secondary",
            outlined: "",
            disabled: !e.canInstall,
            onClick: y[4] || (y[4] = (g) => m.$emit("install"))
          }, null, 8, ["disabled"]))
        ])
      ]),
      h(Le, {
        class: "work-disclosure",
        label: "Recent setup changes"
      }, {
        default: W(() => [
          d.value.length ? (n(), b("ul", mm, [
            (n(!0), b(te, null, se(d.value, (g, x) => (n(), b("li", { key: x }, A(g.join(" · ")), 1))), 128))
          ])) : (n(), b("p", fm, A(f.value ? "Recent changes are unavailable." : r.value ? "No setup changes yet." : "Loading recent changes…"), 1))
        ]),
        _: 1
      }),
      l.value.length ? (n(), H(Le, {
        key: 0,
        class: "work-settings-card work-disclosure",
        label: "Advanced · Existing board overrides"
      }, {
        default: W(() => [
          y[10] || (y[10] = u("p", { class: "work-muted" }, "Clear an override to use the Work application default.", -1)),
          u("ul", pm, [
            (n(!0), b(te, null, se(l.value, (g) => (n(), b("li", {
              key: g,
              class: "work-row work-wrap"
            }, [
              u("span", bm, A(t[g]) + " · " + A(o(g)), 1),
              h(s(_), {
                label: "Use default for " + t[g].toLowerCase(),
                disabled: e.disabled,
                size: "small",
                text: "",
                onClick: (x) => delete e.draft.policy[g]
              }, null, 8, ["label", "disabled", "onClick"])
            ]))), 128))
          ])
        ]),
        _: 1
      })) : U("", !0)
    ]));
  }
}), Be = (e, a) => `${e} → ${a}`, ro = (e, a) => {
  const t = e.fields?.find((l) => l.code === a);
  return t ? Ke(t) : "Untitled field";
}, uo = {
  comments_per_item: "Comments per item",
  stage_timeout: "Default attempt timeout",
  stage_max_visits: "Default maximum visits",
  audit: "Audit trail",
  audit_days: "Audit history",
  trash_days: "Keep trashed items",
  tombstone_days: "Keep deletion records",
  interval_days: "Keep state history"
};
function co(e, a) {
  if (a === void 0) return "Application default";
  if (e === "audit") return Ne(String(a));
  if (e === "stage_timeout") {
    const t = ra(String(a));
    if (t) return `${t.amount.toLocaleString()} ${t.amount === 1 ? t.unit.slice(0, -1) : t.unit}`;
  }
  if (e.endsWith("_days")) {
    const t = a === 0 && (e === "audit_days" || e === "interval_days") ? 365 : a;
    return `${t} ${t === 1 ? "day" : "days"}`;
  }
  return String(a);
}
function gm(e, a) {
  const t = e.policy ?? {}, l = a.policy ?? {}, o = Object.keys(uo).flatMap((p) => t[p] === l[p] ? [] : [`${uo[p]} · ${Be(co(p, t[p]), co(p, l[p]))}`]), r = (p) => p ? `${p.limit}${p.hard ? " (hard limit)" : ""}` : "No limit", f = /* @__PURE__ */ new Set([...Object.keys(t.wip ?? {}), ...Object.keys(l.wip ?? {})]);
  for (const p of f) {
    const c = r(t.wip?.[p]), i = r(l.wip?.[p]);
    if (c === i) continue;
    const d = (a.processes ?? []).flatMap((m) => m.states).find((m) => m.id === p) ?? (e.processes ?? []).flatMap((m) => m.states).find((m) => m.id === p);
    o.push(`${ye(d)} limit · ${Be(c, i)}`);
  }
  return o;
}
function ym(e, a, t) {
  const l = e.visibility, o = a.visibility, r = [];
  l?.field !== o?.field && r.push(Be(
    l ? ro(e, l.field) : "No additional restriction",
    o ? ro(a, o.field) : "No additional restriction"
  ));
  const f = l?.levels ?? [], p = o?.levels ?? [], c = new Set([...f, ...p].map((i) => i.id));
  for (const i of c) {
    const d = f.find((k) => k.id === i), m = p.find((k) => k.id === i);
    if (d && m && JSON.stringify(d.holders) === JSON.stringify(m.holders)) continue;
    const y = (k) => k.fields?.find((S) => S.code === k.visibility?.field)?.options?.find((S) => S.id === i)?.label, g = y(a) || y(e) || Ne(i), x = (k) => k ? k.holders.map(t).join(", ") || "No extra access" : "No level";
    r.push(`${g} · ${Be(x(d), x(m))}`);
  }
  return l?.bypass !== o?.bypass && r.push(o?.bypass === "admin" ? "Board administrators can see every level." : "Visibility levels now apply to board administrators."), r;
}
const da = {
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
function km(e, a, t) {
  const { what: l, detail: o, to: r } = e, p = `${t?.name || a?.name || "Untitled workflow"} · ${da[l] ?? "Workflow changed"}`, c = l.startsWith("state.") ? a?.states.find((g) => g.id === o) : void 0, i = l.startsWith("state.") ? t?.states.find((g) => g.id === o) : void 0, d = l.startsWith("transition.") ? a?.transitions?.find((g) => g.id === o) : void 0, m = l.startsWith("transition.") ? t?.transitions?.find((g) => g.id === o) : void 0;
  let y = "";
  return l === "state.map" ? y = Be(ye(c), ye(t?.states.find((g) => g.id === r))) : l === "state.name" ? y = Be(ye(c), ye(i)) : l === "state.kind" ? y = `${ye(i)} · ${Be(Ra(c?.kind), Ra(i?.kind))}` : l === "state.category" && c && i ? y = `${ye(i)} · ${Be(qt(c.category), qt(i.category))}` : i || c ? y = ye(i ?? c) : l === "transition.name" && d && m ? y = Be(ze(d), ze(m)) : m ? y = ze(m) : d ? y = ze(d) : l === "initial" ? y = Be(ye(a?.states.find((g) => g.id === a.initial)), ye(t?.states.find((g) => g.id === t.initial))) : l === "name" && (y = Be(a?.name || "Untitled workflow", t?.name || "Untitled workflow")), { title: p, details: y ? [y] : [] };
}
function wm(e, a, t, l) {
  const { code: o, what: r, detail: f } = e;
  if (o === "schema" || r === "visibility.remove")
    return r === "policy" ? { title: "Board limits and defaults", details: gm(a, t) } : r.startsWith("visibility") ? { title: "Who can see items", details: ym(a, t, l) } : r === "key_prefix" ? { title: "Item key prefix", details: [Be(a.key_prefix ?? "Default", t.key_prefix ?? "Default")] } : { title: { plugins: "Board plugins changed", scopes: "Saved query filters changed", "rollup.recompute": "Calculated totals will update" }[r] ?? "Board settings changed", details: [] };
  if (o.startsWith("process ")) {
    const m = o.slice(8);
    return km(e, a.processes?.find((y) => y.id === m), t.processes?.find((y) => y.id === m));
  }
  if (o.startsWith("item_type ")) {
    const m = o.slice(10), y = a.item_types?.find((k) => k.id === m), g = t.item_types?.find((k) => k.id === m);
    return { title: `${g?.title || y?.title || "Item type"} · ${da[r] ?? "Item type changed"}`, details: r === "title" ? [Be(y?.title || "Untitled item type", g?.title || "Untitled item type")] : [] };
  }
  if (o.startsWith("relation ")) {
    const m = o.slice(9), y = a.relation_types?.find((k) => k.id === m), g = t.relation_types?.find((k) => k.id === m), x = r === "label" ? [Be([y?.outward, y?.inward].filter(Boolean).join(" / "), [g?.outward, g?.inward].filter(Boolean).join(" / "))] : [];
    return { title: `${g?.outward || y?.outward || "Link type"} · ${da[r] ?? "Link type changed"}`, details: x };
  }
  const p = t.fields?.find((m) => m.code === o), c = a.fields?.find((m) => p?.id !== void 0 ? m.id === p.id : m.code === (r.startsWith("renamed from ") ? r.slice(13) : o)), i = p ?? c;
  if (!i) return { title: da[r] ?? "Board settings changed", details: [] };
  const d = `${Ke(i)} · ${r.startsWith("renamed from ") ? "Field key" : da[r] ?? "Field settings changed"}`;
  if (r.startsWith("options.")) {
    const m = c?.options ?? [], y = p?.options ?? [], g = m.findIndex((E) => E.id === f), x = y.findIndex((E) => E.id === f), k = m[g], S = y[x], V = S?.label || k?.label || "Untitled choice", $ = k && S && k.label !== S.label ? [] : [V];
    if (k && S) {
      k.label !== S.label && $.push(Be(k.label || "Untitled choice", S.label || "Untitled choice")), k.category !== S.category && $.push(`Category · ${Be(k.category ? qt(k.category) : "None", S.category ? qt(S.category) : "None")}`);
      const E = k.order ?? g + 1, C = S.order ?? x + 1;
      E !== C && $.push(`Order · ${Be(E, C)}`), k.color !== S.color && $.push(`Color · ${Be(k.color ?? "Default", S.color ?? "Default")}`);
    }
    return { title: d, details: $ };
  }
  return r === "title" && c && p ? { title: d, details: [Be(Ke(c), Ke(p))] } : { title: d, details: [] };
}
const Vm = {
  key: 0,
  class: "work-settings-card work-schema-plan work-stack",
  "aria-label": "Schema review"
}, $m = { key: 0 }, xm = { class: "work-row work-wrap" }, Cm = { class: "work-muted" }, Sm = {
  key: 0,
  class: "work-notice"
}, Tm = {
  key: 1,
  class: "work-notice"
}, Im = {
  key: 2,
  class: "work-stack work-tight",
  "aria-label": "Reviewed Flow bindings"
}, Dm = { key: 3 }, Um = {
  key: 4,
  class: "work-settings-table"
}, Em = { key: 0 }, Am = /* @__PURE__ */ $e({
  __name: "SchemaReview",
  props: {
    boardId: {},
    original: {},
    declaration: {},
    plan: {},
    generation: {},
    follows: {},
    configCount: {},
    packReview: { type: Boolean },
    plugins: {}
  },
  setup(e) {
    const a = e, t = {}, l = q(() => a.original ?? t), o = q(() => a.declaration ?? t), r = q(() => (o.value.processes ?? []).flatMap(($) => $.states.flatMap((E) => {
      const C = E.run?.flow_ref;
      return C ? [{ key: $.id + ":" + E.id, process: $.name || "Untitled process", state: ye(E), reference: C }] : [];
    }))), f = N(/* @__PURE__ */ new Map());
    De(r, async ($, E, C) => {
      const Z = /* @__PURE__ */ new Map();
      f.value = Z;
      let Q = !0;
      C(() => Q = !1), await Promise.all([...new Set($.map((K) => K.reference.id))].map(async (K) => {
        try {
          const ce = (await Vl.title(K))?.trim();
          Q && ce && !gi(ce) && f.value.set(K, ce);
        } catch {
          Q && f.value.set(K, "Flow title unavailable");
        }
      }));
    }, { immediate: !0 });
    const p = q(() => [l.value, o.value].flatMap(($) => ($.visibility?.levels ?? []).flatMap((E) => E.holders.flatMap((C) => "group" in C ? [{ kind: "group", id: C.group }] : "user" in C ? [{ kind: "user", id: C.user }] : [])))), c = ko(() => a.boardId ?? "", p);
    function i($) {
      if ("user" in $) return c.label({ kind: "user", id: $.user });
      if ("group" in $) return c.label({ kind: "group", id: $.group });
      if ("field" in $) {
        const E = o.value.fields?.find((C) => C.code === $.field) ?? l.value.fields?.find((C) => C.code === $.field);
        return E ? Ke(E) : "People from a field";
      }
      return "Service";
    }
    const d = ($) => $.map((E) => {
      const C = wm(E, l.value, o.value, i);
      if (E.what === "plugins") {
        const Z = new Set(l.value.plugins?.map((K) => K.use)), Q = new Set(o.value.plugins?.map((K) => K.use));
        for (const K of a.plugins ?? [])
          Z.has(K.plugin) !== Q.has(K.plugin) && C.details.push((Q.has(K.plugin) ? "Enable " : "Turn off ") + (K.title || "an available plugin"));
      }
      return { change: E, ...C };
    }), m = q(() => d(a.plan?.changes.filter(($) => $.class !== "refused") ?? [])), y = q(() => d(a.plan?.refused ?? [])), g = q(() => {
      const $ = a.plan?.migration;
      return !$ || !y.value.length ? $ : y.value.every((E) => E.change.what === "options.remove") ? "Add a new field with the choices you want to keep. Copy existing values into it before removing the old field." : y.value.every((E) => E.change.what === "state.remove") ? "Choose where existing items should move before removing their state." : $;
    }), x = {
      unchanged: ["No changes", "secondary"],
      cosmetic: ["Labels or settings", "secondary"],
      additive: ["New definitions", "success"],
      semantic: ["Affects existing items", "warn"],
      refused: ["Blocked", "danger"],
      initial: ["First setup", "secondary"]
    }, k = ($) => x[$]?.[0] ?? "Review needed", S = ($) => x[$]?.[1] ?? "secondary";
    function V($) {
      const { detail: E, ...C } = $;
      return qa($.what === "invalid" || $.what.startsWith("views.") || $.what.startsWith("automation") ? $ : C);
    }
    return ($, E) => e.plan ? (n(), b("section", Vm, [
      !e.plan.changes.length && !e.plan.refused.length && !e.configCount && !e.packReview ? (n(), b("p", $m, "No changes to apply.")) : (n(), b(te, { key: 1 }, [
        u("header", xm, [
          E[0] || (E[0] = u("h3", null, "Impact on this board", -1)),
          h(s(Ze), {
            class: "kx-tag-sm",
            severity: S(e.plan.class)
          }, {
            default: W(() => [
              B(A(k(e.plan.class)), 1)
            ]),
            _: 1
          }, 8, ["severity"])
        ]),
        u("p", Cm, A(s(yi)[e.plan.class] || "Review the changes below."), 1),
        g.value ? (n(), b("p", Sm, A(g.value), 1)) : e.follows.length ? (n(), b("p", Tm, "Existing items in " + A(e.follows.join(", ")) + " will follow the updated workflow.", 1)) : U("", !0),
        r.value.length ? (n(), b("section", Im, [
          E[1] || (E[1] = u("h3", null, "Flow bindings", -1)),
          (n(!0), b(te, null, se(r.value, (C) => (n(), b("p", {
            key: C.key
          }, [
            B(A(C.process) + " / " + A(C.state) + " · ", 1),
            u("strong", null, A(f.value.get(C.reference.id) ?? "Published Flow") + " · v" + A(C.reference.version), 1)
          ]))), 128)),
          E[2] || (E[2] = u("p", { class: "work-muted work-small" }, "New entries use these exact published versions. Before replacing a binding, stop new entries, let existing runs and deliveries finish, pause the old launcher, save, then resume entries.", -1))
        ])) : U("", !0),
        lt($.$slots, "default"),
        y.value.length ? (n(), b("h3", Dm, "Blocked changes")) : U("", !0),
        (n(!0), b(te, null, se(y.value, (C, Z) => (n(), H(s(Di), {
          key: Z,
          severity: "error",
          role: "alert"
        }, {
          default: W(() => [
            u("strong", null, A(C.title), 1),
            (n(!0), b(te, null, se(C.details, (Q, K) => (n(), b("p", { key: K }, A(Q), 1))), 128)),
            u("p", null, A(V(C.change)), 1),
            h(Le, {
              class: "work-small",
              label: "Technical details"
            }, {
              default: W(() => [
                u("code", null, A(C.change.what), 1)
              ]),
              _: 2
            }, 1024)
          ]),
          _: 2
        }, 1024))), 128)),
        m.value.length ? (n(), b("table", Um, [
          E[3] || (E[3] = u("thead", null, [
            u("tr", null, [
              u("th", { scope: "col" }, "Change"),
              u("th", { scope: "col" }, "Impact")
            ])
          ], -1)),
          u("tbody", null, [
            (n(!0), b(te, null, se(m.value, (C, Z) => (n(), b("tr", { key: Z }, [
              u("td", null, [
                u("strong", null, A(C.title), 1),
                (n(!0), b(te, null, se(C.details, (Q, K) => (n(), b("p", { key: K }, A(Q), 1))), 128)),
                C.change.count ? (n(), b("p", Em, A(C.change.count) + " " + A(C.change.count === 1 ? "item" : "items"), 1)) : U("", !0)
              ]),
              u("td", null, [
                h(s(Ze), {
                  class: "kx-tag-sm",
                  severity: S(C.change.class)
                }, {
                  default: W(() => [
                    B(A(k(C.change.class)), 1)
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
}), Om = {
  key: 0,
  class: "work-stack",
  "aria-label": "Pack conflicts"
}, Pm = { class: "work-stack work-tight work-pack-review-field" }, Rm = { class: "work-config-fields" }, Nm = { class: "work-json-example" }, Mm = { class: "work-json-example" }, Fm = {
  key: 1,
  class: "work-stack",
  "aria-label": "Pack state maps"
}, Lm = /* @__PURE__ */ $e({
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
    function o(i) {
      return t.original.processes?.find((d) => d.id === i)?.name || Ne(i);
    }
    function r(i) {
      const [d, ...m] = i.split("."), y = m.join(".");
      return d === "processes" ? o(y) : d === "fields" ? t.original.fields?.find((g) => g.code === y)?.title || Ne(y) : d === "item_types" ? t.original.item_types?.find((g) => g.id === y)?.title || Ne(y) : Ne(d);
    }
    function f(i) {
      return JSON.stringify(i ?? null, null, 2);
    }
    function p(i, d) {
      (t.request.resolutions ??= {})[i] = d, l("change");
    }
    function c(i, d, m) {
      ((t.request.maps ??= {})[i] ??= {})[d] = m, l("change");
    }
    return (i, d) => (n(), b(te, null, [
      e.plan.conflicts.length ? (n(), b("section", Om, [
        d[2] || (d[2] = u("h3", null, "Local edits conflict", -1)),
        d[3] || (d[3] = u("p", { class: "work-muted work-small" }, "Choose which declaration to keep for each conflict, then review again.", -1)),
        (n(!0), b(te, null, se(e.plan.conflicts, (m) => (n(), b("div", {
          key: m.path,
          class: "work-stack work-tight"
        }, [
          u("label", Pm, [
            B(A(r(m.path)), 1),
            h(s(me), {
              "model-value": e.request.resolutions?.[m.path],
              "aria-label": "Resolution for " + r(m.path),
              disabled: e.disabled,
              appendTo: "self",
              placeholder: "Choose a resolution",
              optionLabel: "label",
              optionValue: "value",
              options: [{ label: "Keep local edits", value: "local" }, { label: "Use pack changes", value: "incoming" }],
              "onUpdate:modelValue": (y) => p(m.path, y)
            }, null, 8, ["model-value", "aria-label", "disabled", "onUpdate:modelValue"])
          ]),
          h(Le, {
            class: "work-json-disclosure",
            label: "Compare declarations"
          }, {
            default: W(() => [
              u("div", Rm, [
                u("section", null, [
                  d[0] || (d[0] = u("h4", null, "Local edits", -1)),
                  u("pre", Nm, A(f(m.local_value)), 1)
                ]),
                u("section", null, [
                  d[1] || (d[1] = u("h4", null, "Pack changes", -1)),
                  u("pre", Mm, A(f(m.incoming)), 1)
                ])
              ])
            ]),
            _: 2
          }, 1024)
        ]))), 128))
      ])) : U("", !0),
      Object.keys(e.plan.maps).length ? (n(), b("section", Fm, [
        d[4] || (d[4] = u("h3", null, "Required state maps", -1)),
        d[5] || (d[5] = u("p", { class: "work-muted work-small" }, "Review the proposed destinations for existing items. Each destination is editable.", -1)),
        (n(!0), b(te, null, se(e.plan.maps, (m, y) => (n(), b("div", {
          key: y,
          class: "work-stack"
        }, [
          u("h4", null, A(o(y)), 1),
          (n(!0), b(te, null, se(m, (g, x) => (n(), b("label", {
            key: x,
            class: "work-stack work-tight work-pack-review-field"
          }, [
            B("Move items from " + A(s(ye)(e.original.processes?.find((k) => k.id === y)?.states.find((k) => k.id === x))), 1),
            h(s(me), {
              "model-value": e.request.maps?.[y]?.[x],
              "aria-label": "Move items from " + s(ye)(e.original.processes?.find((k) => k.id === y)?.states.find((k) => k.id === x)),
              disabled: e.disabled,
              appendTo: "self",
              optionLabel: "label",
              optionValue: "value",
              options: e.plan.declaration.processes?.find((k) => k.id === y)?.states.map((k) => ({ label: s(ye)(k), value: k.id })) ?? [],
              "onUpdate:modelValue": (k) => c(y, x, k)
            }, null, 8, ["model-value", "aria-label", "disabled", "options", "onUpdate:modelValue"])
          ]))), 128))
        ]))), 128))
      ])) : U("", !0)
    ], 64));
  }
}), Bm = { class: "work-section-layout" }, zm = { class: "kx-main" }, jm = ["aria-label"], qm = {
  key: 1,
  class: "kx-err work-alert-actions"
}, Wm = { role: "alert" }, Km = {
  key: 2,
  class: "work-notice",
  role: "status"
}, Gm = {
  key: 3,
  class: "kx-loading",
  role: "status"
}, Hm = {
  key: 4,
  class: "work-notice",
  role: "alert"
}, Ym = {
  key: 5,
  class: "work-settings-body"
}, Xm = {
  key: 0,
  class: "work-notice",
  role: "alert"
}, Jm = {
  key: 1,
  class: "work-notice"
}, Zm = ["id"], Qm = ["disabled", "inert"], _m = {
  key: 3,
  class: "work-ia-section"
}, ef = {
  key: 0,
  class: "work-muted"
}, tf = {
  key: 5,
  class: "work-ia-section"
}, af = { class: "work-review-layout" }, lf = { class: "work-muted" }, of = ["aria-busy"], nf = {
  key: 0,
  role: "status"
}, sf = {
  key: 1,
  role: "alert",
  class: "kx-err"
}, rf = {
  key: 2,
  role: "alert"
}, df = { key: 6 }, uf = { class: "work-dialog-actions" }, cf = {
  key: 2,
  class: "work-muted",
  role: "status"
}, vf = { class: "work-stack work-tight" }, mf = {
  key: 0,
  class: "work-muted"
}, ff = { class: "work-dialog-actions" }, pf = /* @__PURE__ */ $e({
  __name: "BoardSettings",
  props: {
    boardId: {},
    embedded: { type: Boolean },
    focusBack: { type: Boolean }
  },
  emits: ["dirty-change"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = Mi(), r = ja(), f = N(), p = N(), c = N(0);
    function i() {
      c.value++, nt();
    }
    let d, m = "";
    const y = () => JSON.stringify([bt.value, M.value, I.value, [...He.value]]), g = q(() => ({
      value: "all-boards",
      label: t.embedded ? "All boards" : "Back to board",
      icon: t.embedded ? "tabler:table" : "tabler:layout-kanban"
    })), x = N();
    De(x, (J) => {
      t.focusBack && J?.$el.querySelector(".kx-settings-rail-item")?.focus();
    }, { flush: "post", once: !0 });
    const k = [
      { heading: "Board setup", items: [
        { value: "Item types", label: "Item types", icon: "tabler:list-details" },
        { value: "Fields", label: "Fields", icon: "tabler:forms" },
        { value: "Links", label: "Links", icon: "tabler:link" },
        { value: "Workflow", label: "Workflow", icon: "tabler:route" }
      ] },
      { heading: "Management", items: [
        { value: "Access", label: "Access", icon: "tabler:users" },
        { value: "Plugins", label: "Plugins", icon: "tabler:puzzle" }
      ] }
    ], S = N("General");
    function V(J) {
      if (J === g.value.value) {
        _o();
        return;
      }
      (J === "General" || k.some((Y) => Y.items.some((le) => le.value === J))) && (S.value = J);
    }
    const $ = {
      General: "Manage the board name, item key prefix and app.",
      "Item types": "Choose the fields, parent relationships and workflow for each kind of work.",
      Fields: "Choose what information people can capture on items.",
      Links: "Show relationships on both items, such as “Blocks” and “Blocked by.”",
      Workflow: "How does work move?",
      Access: "Who can use this board?",
      Plugins: "Choose which plugins this board uses."
    }, E = N(""), C = N(!1), Z = N(""), Q = N();
    De(S, () => f.value?.scrollTo({ top: 0 }));
    function K() {
      C.value = !1, Z.value = "", Va.value = !1;
    }
    function ce(J) {
      !it.value || !Jo() || He.value.size || (Q.value = J, C.value = !0, _a());
    }
    const ve = N(!1), we = N(""), ke = N(/* @__PURE__ */ new Set(["General"]));
    De(S, (J) => ke.value.add(J));
    const z = N(), O = N(), L = N(), D = N({}), M = N({}), re = N(), ie = N(!1), de = N(!0), ne = N(!1), Se = N(""), j = N(""), v = q(() => D.value.processes ?? []), w = q(() => ie.value && z.value ? [
      { heading: L.value?.title || "Board settings", items: [{ value: "General", label: "General", icon: "tabler:settings" }] },
      ...k
    ] : []), ee = q(() => v.value.flatMap((J) => J.transitions ?? []).filter((J) => J.when || J.guards?.length || J.require?.length).length), P = N(), G = N(!1), R = ua();
    async function F(J) {
      const Y = R();
      G.value = !1;
      try {
        const le = await gt.stateCounts(J);
        Y() && (P.value = le);
      } catch {
        Y() && (G.value = !0, P.value = void 0);
      }
    }
    De(S, (J) => {
      ie.value && J === "Workflow" && F(t.boardId);
    });
    const T = N(""), X = N([]), I = N(), oe = N(), ge = N(), be = N(), Ue = N(), pt = N(""), Et = N([]), Ha = q(() => [...Et.value, ...be.value?.refused ?? []]), ot = N(!1), Ol = N(0), He = N(/* @__PURE__ */ new Set()), Ya = N(), Pl = ua(), wa = ua(), bt = q(() => al(D.value, z.value?.declaration ?? {})), it = q(() => He.value.size > 0 || !!I.value || !!z.value && (JSON.stringify(bt.value) !== JSON.stringify(al(z.value.declaration, z.value.declaration)) || Object.keys(M.value).length > 0)), Xa = N(!1), Rl = q(() => it.value || Xa.value);
    De(Rl, (J) => l("dirty-change", J), { immediate: !0, flush: "sync" });
    const et = q(() => !!z.value && !!O.value && z.value.generation !== O.value.generation), qo = q(() => (!ta.value.renamed.length || Va.value) && ie.value && !ne.value && !ot.value && !At.value && !et.value && !He.value.size && be.value && (be.value.changes.length > 0 || Object.keys(M.value).length > 0) && be.value.class !== "refused" && !be.value.refused.length && Ue.value?.matches(bt.value, z.value?.generation ?? -1, M.value)), Va = N(!1), ta = q(() => {
      const J = z.value?.declaration, Y = [], le = [];
      for (const Te of v.value) {
        const st = J?.item_types?.filter((Pe) => Pe.process === Te.id) ?? [], je = J?.processes?.find((Pe) => Pe.id === Te.id);
        for (const Pe of je?.states ?? []) {
          const xa = Te.states.find((Ot) => Ot.id === Pe.id);
          if (xa && xa.name === Pe.name) continue;
          const tl = [...be.value?.refused ?? [], ...be.value?.changes ?? []].find((Ot) => Ot.code === "process " + Te.id && Ot.detail === Pe.id && ["state.remove", "state.map"].includes(Ot.what))?.count ?? st.reduce((Ot, ai) => Ot + (P.value?.[ai.id]?.[Pe.id] ?? 0), 0);
          tl && (xa ? le.push({ process: Te, state: Pe, name: ye(xa), count: tl }) : Y.push({ process: Te, state: Pe, count: tl }));
        }
      }
      return { removed: Y, renamed: le };
    });
    function Wo(J, Y, le) {
      J.map = { ...J.map, [Y]: le }, _a();
    }
    const Ja = q(() => X.value.find((J) => J.id === I.value?.pack)?.plugins.filter((J) => !z.value?.plugins?.some((Y) => Y.plugin === J.plugin && Y.active)).map((J) => ({ use: J.plugin })) ?? []), Nl = q(() => !!ge.value && JSON.stringify(ge.value) === JSON.stringify(I.value)), Ml = q(() => I.value ? ie.value && !ne.value && !He.value.size && !et.value && !At.value && Nl.value && be.value?.class !== "refused" && !be.value?.refused.length && oe.value?.conflicts.every((J) => !!I.value?.resolutions?.[J.path]) : qo.value), Fl = q(() => !!be.value && (!I.value || Nl.value)), Ko = q(() => X.value.find((J) => J.id === z.value?.pack?.id)?.title || "Installed pack"), Ll = q(() => !T.value && !!z.value?.outdated && !!X.value.find((J) => J.id === z.value?.pack?.id)), Go = q(() => T.value ? "Reload packs to check available upgrades." : Ll.value ? it.value ? "Discard the current draft before upgrading." : At.value ? "Finish the current migration before upgrading." : ne.value ? "Wait for the current request to finish." : void 0 : "Install an available version of this pack to upgrade.");
    function Bl() {
      I.value = void 0, oe.value = void 0, ge.value = void 0;
    }
    async function Ho() {
      if (!z.value?.pack || ne.value || it.value) return;
      const J = X.value.find((Y) => Y.id === z.value.pack.id);
      J && (Q.value = void 0, I.value = Kl(J, z.value.generation), C.value = !0, await Za());
    }
    async function Yo() {
      const J = X.value.find((Y) => Y.id === we.value);
      !z.value || !J || J.plugins.some((Y) => !Y.installed) || ne.value || it.value || (Q.value = void 0, I.value = Kl(J, z.value.generation), ve.value = !1, C.value = !0, await Za());
    }
    async function Za() {
      if (!I.value || ne.value || !ie.value || et.value || He.value.size) return;
      const J = wa(), Y = Mt(I.value), le = JSON.stringify(I.value);
      ne.value = !0, Z.value = "", j.value = "";
      try {
        const Te = await wi(Y, (st) => Ct.packPlan(t.boardId, st));
        if (!J() || le !== JSON.stringify(I.value)) return;
        oe.value = Te.plan, be.value = Te.plan, I.value = Te.request, ge.value = Mt(I.value), pt.value = crypto.randomUUID(), C.value = !0;
      } catch (Te) {
        J() && (ge.value = void 0, Z.value = at(Te, "Could not review the pack."));
      } finally {
        ne.value = !1;
      }
    }
    const zl = q(() => oe.value?.declaration ?? Ue.value?.declaration), Xo = q(() => {
      const J = zl.value;
      return !be.value || !J ? [] : ki(be.value, J).map((Y) => J.processes?.find((le) => le.id === Y)?.name || "Untitled process");
    }), At = q(() => !!O.value?.migration_error || L.value?.status === "migrating");
    function ht() {
      Et.value = [], wa(), be.value = void 0, Ue.value = void 0, ge.value = void 0, pt.value = "";
    }
    De([bt, M], ht, { deep: !0, flush: "sync" }), De(M, (J) => {
      I.value && (Object.keys(J).length ? I.value.plugin_configs = Mt(J) : delete I.value.plugin_configs);
    }, { deep: !0, flush: "sync" });
    function aa(J, Y) {
      Y ? He.value.delete(J) : He.value.add(J), ht();
    }
    function Qa(J) {
      Bl(), Ol.value++, z.value = J, D.value = Mt(J.declaration), M.value = {}, He.value.clear(), ht();
    }
    async function nt(J = !1) {
      const Y = Pl();
      try {
        const [le, Te, st] = await Promise.all([gt.schema(t.boardId, void 0, !0).catch((Pe) => {
          if (Pe instanceof fl && Pe.details?.code === "board_schema_missing") return { generation: 0, declaration: {}, compiled: {}, key_prefix: "", as_of: 0 };
          throw Pe;
        }), gt.options(t.boardId), gt.boards()]);
        if (!Y()) return;
        if (ie.value = Te.access.admin, re.value = Te, L.value = st.find((Pe) => Pe.board_id === t.boardId), !ie.value) {
          z.value = void 0, D.value = {}, ht();
          return;
        }
        Se.value = "";
        const je = Vi(le);
        O.value = je, d !== void 0 && je.generation >= d ? (d = void 0, m === y() && Qa(je), m = "") : (J || !z.value || !it.value && je.generation !== z.value.generation) && Qa(je), et.value && ht(), await jl(Y), Y() && S.value === "Workflow" && F(t.boardId);
      } catch (le) {
        if (!Y()) return;
        le instanceof fl && (le.status === 403 || le.kind?.toLowerCase() === "permission_denied") && (ie.value = !1), ht(), Se.value = at(le, "Could not load board settings.");
      } finally {
        Y() && (de.value = !1);
      }
    }
    async function jl(J = () => !0) {
      T.value = "";
      try {
        const Y = await gt.packs();
        J() && (X.value = Y.filter($i));
      } catch (Y) {
        J() && (T.value = at(Y, "Could not load packs."));
      }
    }
    function Jo() {
      for (const J of Array.from(Ya.value?.elements ?? []))
        if ((J instanceof HTMLInputElement || J instanceof HTMLSelectElement || J instanceof HTMLTextAreaElement) && !(J.form !== Ya.value || J.closest('[style*="display: none"]:not(.p-accordioncontent)')) && !J.reportValidity()) {
          const le = J.closest('.p-accordioncontent[style*="display: none"]')?.closest(".kx-disclosure")?.querySelector('.kx-disclosure-toggle[aria-expanded="false"]');
          return le && (le.click(), Jt(() => J.reportValidity())), !1;
        }
      return !0;
    }
    async function _a() {
      if (I.value) return Za();
      if (!z.value || ne.value || !ie.value || et.value || He.value.size) return;
      const J = wa(), Y = Gl(bt.value, z.value.generation, M.value);
      ne.value = !0, Z.value = "", j.value = "";
      try {
        const le = (Y.declaration.processes ?? []).some((st) => z.value?.declaration.processes?.find((je) => je.id === st.id)?.states.some((je) => st.states.some((Pe) => Pe.id === je.id && Pe.name !== je.name))), [Te] = await Promise.all([
          Ct.plan(t.boardId, Y),
          le ? F(t.boardId) : void 0
        ]);
        if (le && G.value) {
          ht(), Z.value = "Could not check which items use the renamed states. Check the impact again.";
          return;
        }
        if (!J() || He.value.size || !Y.matches(bt.value, z.value.generation, M.value)) return;
        be.value = Te, Ue.value = Y, pt.value = crypto.randomUUID(), C.value = !0;
      } catch (le) {
        J() && (ht(), Z.value = at(le, "Could not review changes."), Et.value = xi(le, bt.value));
      } finally {
        ne.value = !1;
      }
    }
    async function Zo() {
      if (!Ml.value) return;
      if (I.value && ge.value) {
        ne.value = !0, Z.value = "";
        const Y = y();
        try {
          const le = await Ct.packApply(t.boardId, Mt(ge.value), pt.value);
          d = le.generation, m = Y, await nt(), j.value = le.status === "done" ? "Pack applied." : "Pack installation continues in the background.", K();
        } catch (le) {
          Z.value = at(le, "Could not apply the pack upgrade.");
        } finally {
          ne.value = !1;
        }
        return;
      }
      if (!Ue.value) return;
      ne.value = !0, Z.value = "", j.value = "";
      const J = y();
      try {
        d = (await Ct.apply(t.boardId, Ue.value, pt.value)).generation, m = J, await nt(), j.value = "Board changes applied.", K();
      } catch (Y) {
        Z.value = at(Y, "Could not apply the board changes.");
      } finally {
        ne.value = !1;
      }
    }
    async function Qo() {
      if (!ne.value) {
        ne.value = !0, Se.value = "";
        try {
          const J = await Ct.resume(t.boardId);
          j.value = J.resumed ? "Migration resumes." : "Migration is already running.", await nt();
        } catch (J) {
          Se.value = at(J, "Could not resume migration.");
        } finally {
          ne.value = !1;
        }
      }
    }
    async function $a(J, Y) {
      if (!z.value || !ie.value || ne.value || ot.value) return "Wait for the current change to finish.";
      if (et.value) return "Discard the stale draft before removing a definition.";
      const le = z.value.generation, Te = JSON.stringify(bt.value), st = Mt(D.value);
      ga(st, J, Y), ot.value = !0;
      try {
        const je = await Ct.plan(t.boardId, Gl(al(st, z.value.declaration), le, M.value));
        if (!ie.value || et.value || z.value.generation !== le || JSON.stringify(bt.value) !== Te) return "The draft changes during the check. Try the removal again.";
        const Pe = Ci(je, J, Y);
        if (Pe) return Pe;
        if (je.class === "refused") return "Resolve the blocked changes in your draft before removing this definition.";
      } catch (je) {
        return at(je, "Could not check this removal.");
      } finally {
        ot.value = !1;
      }
    }
    async function _o() {
      if (t.embedded) {
        o({ name: "boards" });
        return;
      }
      Rl.value && !await Ti.confirm({ header: "Discard changes?", message: "Your unsaved board settings will be discarded.", acceptLabel: "Discard", rejectLabel: "Keep editing" }) || o({ name: "board", board: t.boardId });
    }
    function ei() {
      d = void 0, O.value && Qa(O.value), j.value = "", Se.value = "", K();
    }
    De(() => t.boardId, () => {
      Xa.value = !1, d = void 0, Bl(), X.value = [], z.value = void 0, O.value = void 0, L.value = void 0, M.value = {}, He.value.clear(), R(), P.value = void 0, E.value = "", ke.value = /* @__PURE__ */ new Set(["General"]), V("General"), K(), ie.value = !1, de.value = !0, nt(!0);
    });
    let el = () => {
    };
    De(() => t.boardId, (J) => {
      el(), el = Si(`component.${J}`, () => {
        nt();
      });
    }, { immediate: !0 }), ri(nt), xl(() => {
      el(), Pl(), wa(), R();
    });
    function ti(J) {
      J.button === 0 && J.target instanceof Element && J.target.closest(".kx-settings-rail-item:focus-visible")?.blur();
    }
    return (J, Y) => (n(), b("section", {
      class: vt(["work-settings-shell work-ia", { "work-embedded": e.embedded }])
    }, [
      u("div", Bm, [
        h(Ni, {
          ref_key: "rail",
          ref: x,
          label: "Board settings sections",
          value: S.value,
          groups: w.value,
          "leading-item": g.value,
          "onUpdate:value": V,
          onPointerdown: ti
        }, null, 8, ["value", "groups", "leading-item"]),
        u("div", zm, [
          u("div", {
            ref_key: "pane",
            ref: f,
            class: "kx-main-scroll work-settings-content",
            role: "region",
            "aria-label": S.value
          }, [
            ie.value && z.value ? (n(), H(uv, {
              key: 0,
              ref_key: "head",
              ref: p,
              title: S.value,
              description: $[S.value],
              board: L.value,
              authorized: ie.value,
              busy: ne.value,
              onShared: i
            }, {
              default: W(() => [
                h(ov, {
                  dirty: it.value,
                  busy: ne.value,
                  "checking-removal": ot.value,
                  disabled: !it.value || ne.value || ot.value || At.value || et.value || !!He.value.size,
                  onDiscard: ei,
                  onPrimary: ce
                }, null, 8, ["dirty", "busy", "checking-removal", "disabled"])
              ]),
              _: 1
            }, 8, ["title", "description", "board", "authorized", "busy"])) : U("", !0),
            Se.value ? (n(), b("div", qm, [
              u("p", Wm, A(Se.value), 1),
              h(s(_), {
                label: "Retry",
                severity: "secondary",
                outlined: "",
                onClick: Y[0] || (Y[0] = (le) => nt())
              })
            ])) : U("", !0),
            j.value ? (n(), b("p", Km, A(j.value), 1)) : U("", !0),
            de.value ? (n(), b("p", Gm, "Loading board settings…")) : !ie.value && !Se.value ? (n(), b("p", Hm, "Ask a board administrator to grant you access to these settings.")) : U("", !0),
            ie.value && z.value ? (n(), b("div", Ym, [
              et.value ? (n(), b("p", Xm, "Someone saved new settings while you were editing. Discard this draft to load their changes.")) : U("", !0),
              At.value ? (n(), b("div", Jm, [
                u("p", null, A(O.value?.migration_error ? "Updating existing items paused." : "Updating existing items…"), 1),
                O.value?.migration_error ? (n(), H(Le, {
                  key: 0,
                  label: "Technical details"
                }, {
                  default: W(() => [
                    B(A(O.value.migration_error), 1)
                  ]),
                  _: 1
                })) : U("", !0),
                O.value?.migration_error ? (n(), H(s(_), {
                  key: 1,
                  label: "Resume updating items",
                  severity: "secondary",
                  disabled: ne.value,
                  outlined: "",
                  onClick: Qo
                }, null, 8, ["disabled"])) : U("", !0)
              ])) : U("", !0),
              ct(h(hm, {
                draft: D.value,
                schema: O.value ?? z.value,
                board: L.value,
                active: S.value === "General",
                "board-apps": re.value?.board_apps,
                "draft-form": s(r),
                disabled: ne.value || ot.value,
                "pack-title": z.value.pack ? Ko.value : void 0,
                outdated: z.value.outdated,
                "upgrade-reason": Go.value,
                "can-upgrade": Ll.value && !it.value && !ne.value && !At.value,
                "can-install": !it.value && !ne.value && !At.value,
                "pack-error": T.value,
                onUpgrade: Ho,
                onInstall: Y[1] || (Y[1] = (le) => ve.value = !0),
                onRetry: Y[2] || (Y[2] = (le) => jl()),
                onDirtyChange: Y[3] || (Y[3] = (le) => Xa.value = le),
                onSaved: Y[4] || (Y[4] = (le) => nt())
              }, null, 8, ["draft", "schema", "board", "active", "board-apps", "draft-form", "disabled", "pack-title", "outdated", "upgrade-reason", "can-upgrade", "can-install", "pack-error"]), [
                [xt, S.value === "General"]
              ]),
              u("form", {
                id: s(r),
                ref_key: "editor",
                ref: Ya,
                onSubmit: Y[14] || (Y[14] = Ie((le) => ce(), ["prevent"]))
              }, [
                (n(), b("fieldset", {
                  key: Ol.value,
                  class: "work-settings-fieldset",
                  disabled: ne.value || ot.value,
                  inert: ne.value || ot.value || void 0
                }, [
                  ke.value.has("Item types") ? ct((n(), H(Sr, {
                    key: 0,
                    class: "work-ia-section",
                    draft: D.value,
                    "guard-removal": $a,
                    issues: Ha.value
                  }, null, 8, ["draft", "issues"])), [
                    [xt, S.value === "Item types"]
                  ]) : U("", !0),
                  ke.value.has("Fields") ? ct((n(), H(cr, {
                    key: 1,
                    class: "work-ia-section",
                    "board-id": e.boardId,
                    "installed-types": re.value?.installed_types,
                    draft: D.value,
                    "guard-removal": $a,
                    issues: Ha.value,
                    "item-type": E.value,
                    "onUpdate:itemType": Y[5] || (Y[5] = (le) => E.value = le),
                    onValidity: Y[6] || (Y[6] = (le, Te) => aa("fields:" + le, Te))
                  }, null, 8, ["board-id", "installed-types", "draft", "issues", "item-type"])), [
                    [xt, S.value === "Fields"]
                  ]) : U("", !0),
                  ke.value.has("Links") ? ct((n(), H(Pc, {
                    key: 2,
                    class: "work-ia-section",
                    draft: D.value,
                    "guard-removal": $a
                  }, null, 8, ["draft"])), [
                    [xt, S.value === "Links"]
                  ]) : U("", !0),
                  ke.value.has("Workflow") ? ct((n(), b("section", _m, [
                    h(jo, {
                      facts: [
                        v.value.length + (v.value.length === 1 ? " workflow" : " workflows"),
                        v.value.reduce((le, Te) => le + Te.states.length, 0) + " states",
                        ee.value + (ee.value === 1 ? " move has requirements" : " moves have requirements"),
                        ...typeof L.value?.open_count == "number" ? [L.value.open_count + " open items"] : []
                      ]
                    }, null, 8, ["facts"]),
                    G.value ? (n(), b("p", ef, [
                      Y[21] || (Y[21] = B("Item counts are unavailable. ", -1)),
                      h(s(_), {
                        label: "Reload counts",
                        text: "",
                        onClick: Y[7] || (Y[7] = (le) => F(e.boardId))
                      })
                    ])) : U("", !0),
                    h(uc, {
                      "board-id": e.boardId,
                      draft: D.value,
                      "guard-removal": $a,
                      issues: Ha.value,
                      counts: P.value,
                      "count-types": z.value.declaration.item_types,
                      guards: re.value?.guards,
                      onValidity: Y[8] || (Y[8] = (le, Te) => aa("process:" + le, Te))
                    }, null, 8, ["board-id", "draft", "issues", "counts", "count-types", "guards"])
                  ], 512)), [
                    [xt, S.value === "Workflow"]
                  ]) : U("", !0),
                  ke.value.has("Access") ? ct((n(), H(Av, {
                    key: 4,
                    active: S.value === "Access",
                    "board-id": e.boardId,
                    draft: D.value,
                    "grants-version": c.value,
                    onShare: Y[9] || (Y[9] = (le) => p.value?.share()),
                    onValidity: Y[10] || (Y[10] = (le) => aa("visibility", le))
                  }, null, 8, ["active", "board-id", "draft", "grants-version"])), [
                    [xt, S.value === "Access"]
                  ]) : U("", !0),
                  ke.value.has("Plugins") ? ct((n(), b("section", tf, [
                    h(so, {
                      "board-id": e.boardId,
                      draft: D.value,
                      schema: O.value ?? z.value,
                      options: re.value?.schema_options.plugins ?? [],
                      filters: re.value?.filters,
                      configs: M.value,
                      disabled: ne.value,
                      onConfigured: Y[11] || (Y[11] = (le) => {
                        ht(), nt();
                      }),
                      onRefresh: Y[12] || (Y[12] = (le) => nt()),
                      onReview: ce,
                      onValidity: Y[13] || (Y[13] = (le, Te) => aa("plugin:" + le, Te))
                    }, null, 8, ["board-id", "draft", "schema", "options", "filters", "configs", "disabled"])
                  ], 512)), [
                    [xt, S.value === "Plugins"]
                  ]) : U("", !0)
                ], 8, Qm))
              ], 40, Zm),
              h(pl, {
                visible: C.value,
                label: "Review changes",
                busy: ne.value,
                "return-focus": Q.value,
                class: "work-review-sheet",
                onClose: K
              }, {
                default: W(() => [
                  u("div", af, [
                    u("header", null, [
                      Y[22] || (Y[22] = u("h2", null, "Review changes", -1)),
                      u("p", lf, A(L.value?.title), 1)
                    ]),
                    u("div", {
                      class: "work-review-content work-stack",
                      "aria-busy": ne.value
                    }, [
                      ne.value ? (n(), b("p", nf, A(be.value ? "Applying or checking changes…" : "Checking the impact on your board…"), 1)) : U("", !0),
                      Z.value ? (n(), b("p", sf, A(Z.value), 1)) : U("", !0),
                      et.value ? (n(), b("p", rf, "The board changed while you were editing. Close this review and discard the draft to load the latest settings.")) : U("", !0),
                      C.value && !I.value && (ta.value.removed.length || ta.value.renamed.length) ? (n(), H(fc, {
                        key: 3,
                        removed: ta.value.removed,
                        renamed: ta.value.renamed,
                        disabled: ne.value || ot.value,
                        confirmed: Va.value,
                        "onUpdate:confirmed": Y[15] || (Y[15] = (le) => Va.value = le),
                        onDestination: Wo
                      }, null, 8, ["removed", "renamed", "disabled", "confirmed"])) : U("", !0),
                      C.value && I.value && Ja.value.length ? (n(), H(so, {
                        key: 4,
                        "board-id": e.boardId,
                        draft: { plugins: Ja.value },
                        schema: O.value ?? z.value,
                        options: re.value?.schema_options.plugins.filter((le) => Ja.value.some((Te) => Te.use === le.plugin)) ?? [],
                        configs: M.value,
                        disabled: ne.value,
                        "activation-locked": "",
                        onValidity: Y[16] || (Y[16] = (le, Te) => aa("pack-plugin:" + le, Te))
                      }, null, 8, ["board-id", "draft", "schema", "options", "configs", "disabled"])) : U("", !0),
                      C.value ? (n(), H(Am, {
                        key: 5,
                        "board-id": e.boardId,
                        original: z.value.declaration,
                        declaration: zl.value,
                        plan: be.value,
                        follows: Xo.value,
                        "config-count": Object.keys(M.value).length,
                        "pack-review": !!oe.value,
                        plugins: re.value?.schema_options.plugins
                      }, {
                        default: W(() => [
                          oe.value && I.value ? (n(), H(Lm, {
                            key: 0,
                            plan: oe.value,
                            request: I.value,
                            original: z.value.declaration,
                            disabled: ne.value,
                            onChange: Y[17] || (Y[17] = (le) => {
                              ge.value = void 0, pt.value = "";
                            })
                          }, null, 8, ["plan", "request", "original", "disabled"])) : U("", !0)
                        ]),
                        _: 1
                      }, 8, ["board-id", "original", "declaration", "plan", "follows", "config-count", "pack-review", "plugins"])) : U("", !0),
                      !ne.value && !Fl.value && !et.value && !Z.value ? (n(), b("p", df, "Check the impact again before applying.")) : U("", !0)
                    ], 8, of),
                    u("footer", uf, [
                      h(s(_), {
                        label: "Keep editing",
                        severity: "secondary",
                        outlined: "",
                        disabled: ne.value,
                        onClick: K
                      }, null, 8, ["disabled"]),
                      Fl.value ? (n(), H(s(_), {
                        key: 1,
                        label: "Apply changes",
                        disabled: !Ml.value,
                        loading: ne.value,
                        onClick: Zo
                      }, null, 8, ["disabled", "loading"])) : (n(), H(s(_), {
                        key: 0,
                        label: "Check impact",
                        disabled: ne.value || et.value || !!He.value.size,
                        onClick: _a
                      }, null, 8, ["disabled"]))
                    ])
                  ])
                ]),
                _: 1
              }, 8, ["visible", "busy", "return-focus"]),
              ot.value ? (n(), b("p", cf, "Checking what uses this setting…")) : U("", !0)
            ])) : U("", !0)
          ], 8, jm)
        ])
      ]),
      ie.value ? (n(), H(pl, {
        key: 0,
        visible: ve.value,
        label: "Install pack",
        busy: ne.value,
        onClose: Y[20] || (Y[20] = (le) => ve.value = !1)
      }, {
        default: W(() => [
          u("form", {
            class: "work-dialog-box work-stack",
            onSubmit: Ie(Yo, ["prevent"])
          }, [
            Y[24] || (Y[24] = u("h2", null, "Install a pack", -1)),
            Y[25] || (Y[25] = u("p", { class: "work-muted work-small" }, "Packs give an empty board a starting setup. Review checks whether this board is eligible.", -1)),
            u("label", vf, [
              Y[23] || (Y[23] = B("Pack", -1)),
              h(s(me), {
                modelValue: we.value,
                "onUpdate:modelValue": Y[18] || (Y[18] = (le) => we.value = le),
                "aria-label": "Pack to install",
                appendTo: "self",
                optionLabel: "title",
                optionValue: "id",
                optionDisabled: "disabled",
                options: X.value.map((le) => ({ ...le, disabled: le.plugins.some((Te) => !Te.installed) }))
              }, null, 8, ["modelValue", "options"])
            ]),
            X.value.length ? U("", !0) : (n(), b("p", mf, "No available packs were found.")),
            u("footer", ff, [
              h(s(_), {
                label: "Cancel",
                severity: "secondary",
                outlined: "",
                onClick: Y[19] || (Y[19] = (le) => ve.value = !1)
              }),
              h(s(_), {
                type: "submit",
                label: "Review pack",
                disabled: !we.value || ne.value || it.value
              }, null, 8, ["disabled"])
            ])
          ], 32)
        ]),
        _: 1
      }, 8, ["visible", "busy"])) : U("", !0)
    ], 2));
  }
}), bf = /* @__PURE__ */ $e({
  __name: "SettingsRoot",
  setup(e) {
    const a = di(), t = ui();
    return si(Vo, (l) => {
      a.value.embedded && l.name === "boards" ? t("back-to-boards", {}) : t("navigate", { route: Fi(l) });
    }), (l, o) => (n(), H(pf, {
      "board-id": s(a).boardId ?? "",
      embedded: s(a).embedded,
      "focus-back": s(a).focusBack,
      onDirtyChange: o[0] || (o[0] = (r) => s(t)("dirty-change", { dirty: r }))
    }, null, 8, ["board-id", "embedded", "focus-back"]));
  }
}), hf = ci(bf, {
  type: "object",
  properties: {
    "board-id": { type: "string", default: "", description: "Board to administer." },
    "focus-back": { type: "boolean", default: !1, description: "Focus the back arrow when opening settings from the board picker." },
    embedded: { type: "boolean", default: !1, description: "Fits in a System detail pane." }
  }
});
Ii(import.meta.url, hf);
//# sourceMappingURL=settings.js.map
