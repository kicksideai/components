import { defineComponent as we, computed as K, openBlock as n, createBlock as H, resolveDynamicComponent as _t, normalizeProps as _o, guardReactiveProps as ei, createSlots as ro, withCtx as G, createElementVNode as c, normalizeClass as ut, createElementBlock as g, Fragment as Q, renderList as re, toDisplayString as E, createCommentVNode as T, unref as s, renderSlot as Je, inject as ti, ref as B, useSlots as ai, createVNode as y, Transition as uo, withDirectives as vt, vShow as $t, watch as Ie, onMounted as ga, onUnmounted as Vl, resolveComponent as co, createTextVNode as q, onBeforeUnmount as wt, useId as zt, withKeys as ze, withModifiers as Ee, normalizeStyle as li, watchEffect as vo, nextTick as Yt, provide as oi } from "vue";
import { e as It, u as ii, b as ni, c as si, a as ri } from "./mount-CDzcrCyw.js";
import "pinia";
import { m as Ea, h as Bl, s as ke, i as di, t as je, g as ui, p as Wt, j as qt, r as zl, w as ht, f as ot, l as ua, k as Lt, n as Ke, o as Dt, u as mo, q as Re, v as Ne, x as fo, y as jt, z as po, A as ba, B as ja, d as bo, C as ya, c as ho, D as ci, E as Na, F as vl, G as vi, H as Mt, I as mi, _ as ml, J as fi, K as pi, L as Rt, M as go, N as bi, O as hi, P as el, Q as gi, R as jl, S as yi, T as ki, a as wi, U as Wl, V as Vi, W as $i } from "./latestRequest-Cv3QFlsy.js";
import me from "primevue/select";
import ee from "primevue/button";
import { Icon as fe } from "@iconify/vue";
import { api as fl, on as xi, host as Ci, define as Si } from "@wippy-fe/proxy";
import Ye from "primevue/tag";
import Qe from "primevue/toggleswitch";
import Bt from "primevue/checkbox";
import Se from "primevue/inputtext";
import ha from "primevue/textarea";
import gt from "primevue/inputnumber";
import $l from "primevue/selectbutton";
import Ti from "primevue/message";
const tl = (e, a) => e.x > a.x && e.x < a.x + a.width && e.y > a.y && e.y < a.y + a.height;
function Ii(e, a, t) {
  return e.x === a.x ? e.x > t.x && e.x < t.x + t.width && Math.max(e.y, a.y) > t.y && Math.min(e.y, a.y) < t.y + t.height : e.y > t.y && e.y < t.y + t.height && Math.max(e.x, a.x) > t.x && Math.min(e.x, a.x) < t.x + t.width;
}
function At(e, a, t) {
  const l = [.../* @__PURE__ */ new Set([e.x, a.x, ...t.flatMap((x) => [x.x, x.x + x.width])])].sort((x, C) => x - C), o = [.../* @__PURE__ */ new Set([e.y, a.y, ...t.flatMap((x) => [x.y, x.y + x.height])])].sort((x, C) => x - C);
  l.unshift(l[0] - 24), l.push(l.at(-1) + 24), o.unshift(o[0] - 24), o.push(o.at(-1) + 24);
  const d = l.length, f = o.indexOf(a.y) * d + l.indexOf(a.x), m = o.indexOf(e.y) * d + l.indexOf(e.x), r = (x) => ({ x: l[x % d], y: o[Math.floor(x / d)] }), i = /* @__PURE__ */ new Map(), u = /* @__PURE__ */ new Map(), p = [];
  function w(x) {
    p.push(x);
    let C = p.length - 1;
    for (; C; ) {
      const R = C - 1 >> 1;
      if (p[R].priority <= x.priority) break;
      p[C] = p[R], C = R;
    }
    p[C] = x;
  }
  function v() {
    const x = p[0], C = p.pop();
    if (p.length) {
      let R = 0;
      for (; R * 2 + 1 < p.length; ) {
        let M = R * 2 + 1;
        if (M + 1 < p.length && p[M + 1].priority < p[M].priority && M++, C.priority <= p[M].priority) break;
        p[R] = p[M], R = M;
      }
      p[R] = C;
    }
    return x;
  }
  const b = (x) => Math.abs(x.x - a.x) + Math.abs(x.y - a.y);
  for (const x of [0, 1]) {
    const C = m * 2 + x;
    i.set(C, 0), w({ key: C, cost: 0, priority: b(e) });
  }
  const k = /* @__PURE__ */ new Map(), D = /* @__PURE__ */ new Map();
  for (; p.length; ) {
    const x = v(), C = Math.floor(x.key / 2), R = x.key % 2;
    if (x.cost !== i.get(x.key)) continue;
    if (C === f) {
      const te = [];
      let ve = x.key;
      for (; ve !== void 0; )
        te.push(r(Math.floor(ve / 2))), ve = u.get(ve);
      return yo(te.reverse());
    }
    const M = r(C), L = C % d, le = Math.floor(C / d);
    for (const [te, ve] of [[L > 0 ? C - 1 : -1, 0], [L + 1 < d ? C + 1 : -1, 0], [le > 0 ? C - d : -1, 1], [le + 1 < o.length ? C + d : -1, 1]]) {
      if (te < 0) continue;
      const J = r(te);
      if (k.has(te) || k.set(te, !t.some((I) => tl(J, I))), !k.get(te)) continue;
      const ue = `${Math.min(C, te)}:${Math.max(C, te)}`;
      if (D.has(ue) || D.set(ue, !t.some((I) => Ii(M, J, I))), !D.get(ue)) continue;
      const pe = x.cost + Math.abs(M.x - J.x) + Math.abs(M.y - J.y) + (R === ve ? 0 : 18), _ = te * 2 + ve;
      pe >= (i.get(_) ?? 1 / 0) || (i.set(_, pe), u.set(_, x.key), w({ key: _, cost: pe, priority: pe + b(J) }));
    }
  }
  throw new Error("Process map has no collision-free route between its ports: " + JSON.stringify({ start: e, end: a, startInside: t.filter((x) => tl(e, x)), endInside: t.filter((x) => tl(a, x)) }));
}
function yo(e) {
  const a = [];
  for (const t of e) {
    const l = a.at(-1), o = a.at(-2);
    l && l.x === t.x && l.y === t.y || (o && l && (o.x === l.x && l.x === t.x || o.y === l.y && l.y === t.y) && a.pop(), a.push(t));
  }
  return a;
}
const la = (e) => Array.from(e).reduce((a, t) => a + (/[^\x20-\x7e]/u.test(t) ? 16 : /[MW@%]/.test(t) ? 11 : /[ilI.,:;!| ']/.test(t) ? 4 : 7.5), 0);
function Jt(e, a = 28) {
  const t = [];
  let l = "";
  for (const o of e.split(/\s+/u))
    for (let d = 0; d < o.length; d += a) {
      const f = o.slice(d, d + a);
      l && l.length + f.length + 1 > a && (t.push(l), l = ""), l = l ? l + " " + f : f;
    }
  return [...t, l].filter(Boolean);
}
function Sa(e) {
  if (e = yo(e), !e.length) return "";
  let a = `M ${e[0].x} ${e[0].y}`;
  for (let l = 1; l < e.length - 1; l++) {
    const o = e[l - 1], d = e[l], f = e[l + 1], m = Math.hypot(d.x - o.x, d.y - o.y), r = Math.hypot(f.x - d.x, f.y - d.y), i = Math.min(8, m / 3, r / 3);
    i && (a += ` L ${d.x + (o.x - d.x) * i / m} ${d.y + (o.y - d.y) * i / m} Q ${d.x} ${d.y} ${d.x + (f.x - d.x) * i / r} ${d.y + (f.y - d.y) * i / r}`);
  }
  const t = e.at(-1);
  return a + ` L ${t.x} ${t.y}`;
}
function Di(e, a = {}, t = { width: 1400, height: 480 }) {
  const l = t.direction ?? (t.width < 750 || Ea(e).length > 8 ? "TB" : "LR"), o = t.direction === "LR" && Ea(e).length > 6, d = new Bl.graphlib.Graph({ multigraph: !0 });
  d.setGraph({ rankdir: l, ranker: "network-simplex", acyclicer: "greedy", nodesep: 32, edgesep: 32, ranksep: 24, marginx: 32, marginy: 32 }), d.setDefaultEdgeLabel(() => ({}));
  const f = Ea(e), m = new Map(f.map((h, O) => [h.id, O])), r = e.states.map((h) => {
    const O = (e.transitions ?? []).filter((S) => S.from === "any" && S.to === h.id), se = Jt(ke(h), o ? 13 : 28), ne = Jt(di(h, e), o ? 13 : 28), ye = O.flatMap((S) => Jt(je(S) + " works from any state")), z = a.policy?.wip?.[h.id]?.limit, N = z === void 0 ? 0 : la(" · limit " + z), V = Math.max(o ? 122 : 168, ...se.map((S) => la(S) + 58), ...ne.map((S, oe) => la(S) + 32 + (oe === ne.length - 1 ? N : 0)), ...ye.map((S) => la(S) + 32)), P = Math.max(80, 42 + se.length * 18 + ne.length * 16 + ye.length * 18);
    return d.setNode(h.id, { width: V + (l === "LR" ? 36 : 0), height: P + (l === "TB" ? 36 : 0) }), { state: h, x: 0, y: 0, width: V, height: P, title: se, caption: ne, badges: O, row: m.has(h.id) ? 0 : 1 };
  }), i = new Set(r.map((h) => h.state.id)), u = (e.transitions ?? []).flatMap((h) => h.from === "any" ? [] : h.from.filter((O) => i.has(O) && i.has(h.to)).map((O) => {
    const se = `${h.id}-${O}`, ne = Jt(je(h), o ? 12 : 28), ye = Math.max(o ? 60 : 72, ...ne.map((N) => la(N) + 24)), z = Math.max(24, ne.length * 16 + 10);
    return { transition: h, from: O, key: se, lines: ne, width: ye, height: z };
  })), p = /* @__PURE__ */ new Set(), w = /* @__PURE__ */ new Set(), v = new Set(u.filter((h) => h.from === h.transition.to || h.transition.to === e.initial || ["completed", "canceled"].includes(r.find((O) => O.state.id === h.from).state.category)).map((h) => h.key));
  function b(h) {
    if (!w.has(h)) {
      p.add(h);
      for (const O of u.filter((se) => se.from === h))
        v.has(O.key) || (p.has(O.transition.to) ? v.add(O.key) : b(O.transition.to));
      p.delete(h), w.add(h);
    }
  }
  b(e.initial);
  for (const h of r) b(h.state.id);
  for (const h of u) if (!v.has(h.key)) {
    const O = m.get(h.from), se = m.get(h.transition.to);
    d.setEdge(h.from, h.transition.to, { width: h.width, height: h.height, labelpos: "c", weight: O !== void 0 && se === O + 1 ? 100 : 1 }, h.key);
  }
  for (const h of e.transitions ?? []) if (h.from === "any" && i.has(e.initial) && i.has(h.to) && !m.has(h.to)) {
    const O = e.states.find((se) => se.id === h.to);
    d.setEdge(e.initial, h.to, { minlen: ["completed", "canceled"].includes(O.category) ? Math.max(1, f.length - 1) : 1 }, `any:${h.id}`);
  }
  const k = e.states.flatMap((h) => (h.regions ?? []).filter((O) => i.has(O.initial)).map((O, se) => {
    const ne = `lane:${h.id}:${se}`;
    return d.setEdge(h.id, O.initial, {}, ne), { state: h, region: O, key: ne };
  }));
  if (!r.length) return { nodes: r, edges: [], parallels: [], main: f, direction: l, width: 320, height: 160 };
  Bl.layout(d);
  for (const h of r) Object.assign(h, { x: d.node(h.state.id).x, y: d.node(h.state.id).y });
  const D = l === "TB", x = u.filter((h) => !v.has(h.key)).map((h) => d.edge({ v: h.from, w: h.transition.to, name: h.key })), C = [...r, ...x], R = Math.max(...C.map((h) => h.x + h.width / 2)), M = Math.max(...C.map((h) => h.y + h.height / 2)), L = (h) => r.find((O) => O.state.id === h), le = u.filter((h) => v.has(h.key)).sort((h, O) => {
    const se = D ? "y" : "x";
    return Math.abs(L(h.from)[se] - L(h.transition.to)[se]) - Math.abs(L(O.from)[se] - L(O.transition.to)[se]);
  }), te = /* @__PURE__ */ new Map(), ve = Math.max(0, ...le.map((h) => h.width));
  let J = M + 32;
  for (const [h, O] of le.entries()) {
    const se = L(O.from), ne = L(O.transition.to), ye = D ? R + 16 + ve + 28 + h * 18 : J + O.height / 2, z = D ? R + 16 + ve / 2 : (se.x + ne.x) / 2;
    let N = D ? se.y + se.height / 2 + 18 : ye;
    if (D) for (const V of [...te.values()].sort((P, S) => P.y - S.y))
      N + O.height / 2 + 10 > V.y - V.height / 2 - 10 && N - O.height / 2 - 10 < V.y + V.height / 2 + 10 && (N = V.y + V.height / 2 + 24 + O.height / 2);
    te.set(O.key, { x: z, y: N, corridor: ye, height: O.height }), J = ye + O.height / 2 + 24;
  }
  const ue = u.map((h) => ({ ...h, ...te.get(h.key) ?? d.edge({ v: h.from, w: h.transition.to, name: h.key }) })), pe = (h, O) => ({ x: h.x - h.width / 2 - O, y: h.y - h.height / 2 - O, width: h.width + O * 2, height: h.height + O * 2 }), _ = [...r.map((h) => pe(h, 12)), ...ue.map((h) => pe(h, 10))], I = (h, O) => ({
    start: D ? { x: h.x, y: h.y + h.height / 2 } : { x: h.x + h.width / 2, y: h.y },
    end: D ? { x: O.x, y: O.y - O.height / 2 } : { x: O.x - O.width / 2, y: O.y }
  }), U = (h, O) => D ? { x: h.x, y: h.y + O } : { x: h.x + O, y: h.y }, $ = ue.map((h) => {
    const O = r.find((De) => De.state.id === h.from), se = r.find((De) => De.state.id === h.transition.to), { start: ne, end: ye } = I(O, se), z = v.has(h.key), N = U(ne, 18), V = U(ye, -18), P = (z || !D ? h.width : h.height) / 2 + 10, S = z ? { x: h.x + (D ? -P : P), y: h.y } : U(h, -P), oe = z ? { x: h.x + (D ? P : -P), y: h.y } : U(h, P);
    let xe;
    if (z) {
      const { corridor: De } = te.get(h.key), tt = D ? { x: De, y: h.y } : { x: N.x, y: De }, Be = D ? { x: De, y: V.y } : { x: V.x, y: De };
      xe = D ? [
        [ne, ...At(N, S, _)],
        [oe, tt, Be, ...At(Be, V, _), ye]
      ] : [
        [ne, ...At(N, tt, _), S],
        [oe, ...At(Be, V, _), ye]
      ];
    } else xe = [
      [ne, ...At(N, S, _)],
      [...At(oe, V, _), ye]
    ];
    const Ve = z ? "return" : m.get(h.transition.to) === (m.get(h.from) ?? -2) + 1 ? "main" : "forward";
    return { ...h, points: xe.flat(), segments: xe, path: xe.map(Sa).join(" "), type: Ve, targetOffset: 0 };
  }), j = k.map((h) => {
    const O = r.find((N) => N.state.id === h.state.id), se = r.find((N) => N.state.id === h.region.initial), { start: ne, end: ye } = I(O, se), z = [ne, ...At(U(ne, 18), U(ye, -18), _), ye];
    return { state: h.state, key: h.key, points: z, path: Sa(z) };
  }), X = [...r.flatMap((h) => [{ x: h.x - h.width / 2, y: h.y - h.height / 2 }, { x: h.x + h.width / 2, y: h.y + h.height / 2 }]), ...$.flatMap((h) => [...h.points, { x: h.x - h.width / 2, y: h.y - h.height / 2 }, { x: h.x + h.width / 2, y: h.y + h.height / 2 }]), ...j.flatMap((h) => h.points)], de = 32 - Math.min(...X.map((h) => h.x)), A = 32 - Math.min(...X.map((h) => h.y)), W = Math.max(...X.map((h) => h.x)) + de + 32, F = Math.max(...X.map((h) => h.y)) + A + 32, ce = (h) => ({ x: h.x + de, y: h.y + A });
  for (const h of r) Object.assign(h, ce(h));
  for (const h of $)
    Object.assign(h, ce(h)), h.segments = h.segments.map((O) => O.map(ce)), h.points = h.segments.flat(), h.path = h.segments.map(Sa).join(" ");
  for (const h of j)
    h.points = h.points.map(ce), h.path = Sa(h.points);
  return { nodes: r, edges: $, parallels: j, main: f, direction: l, width: W, height: F };
}
const Ui = ["aria-label"], Ei = {
  key: 0,
  class: "kx-settings-rail-group"
}, Ai = ["aria-current", "onClick"], Oi = { class: "kx-settings-rail-label" }, Pi = /* @__PURE__ */ we({
  __name: "SettingsRail",
  props: {
    label: {},
    title: {},
    count: {},
    value: {},
    groups: {},
    leadingItem: {}
  },
  emits: ["update:value"],
  setup(e) {
    const a = e, t = K(() => a.leadingItem ? [{ items: [a.leadingItem] }, ...a.groups] : a.groups);
    function l(o) {
      const d = [...o.currentTarget.querySelectorAll(".kx-settings-rail-item")], f = d.indexOf(o.target);
      if (f < 0) return;
      let m;
      switch (o.key) {
        case "ArrowDown":
        case "ArrowRight":
          m = (f + 1) % d.length;
          break;
        case "ArrowUp":
        case "ArrowLeft":
          m = (f + d.length - 1) % d.length;
          break;
        case "Home":
          m = 0;
          break;
        case "End":
          m = d.length - 1;
          break;
        default:
          return;
      }
      o.preventDefault(), d[m]?.focus();
    }
    return (o, d) => (n(), H(_t(e.title ? ui : "div"), _o(ei(e.title ? { title: e.title, count: e.count, settings: !0 } : { class: "kx-settings-rail-standalone" })), ro({
      default: G(() => [
        c("nav", {
          class: ut(["kx-settings-rail", { "kx-settings-rail-framed": e.title }]),
          "aria-label": e.label,
          onKeydown: l
        }, [
          (n(!0), g(Q, null, re(t.value, (f, m) => (n(), g("div", {
            key: f.items[0]?.value ?? m,
            class: ut(["kx-settings-rail-section", { "kx-settings-rail-leading": e.leadingItem && m === 0 }])
          }, [
            f.heading ? (n(), g("div", Ei, E(f.heading), 1)) : T("", !0),
            (n(!0), g(Q, null, re(f.items, (r) => (n(), g("button", {
              key: r.value,
              type: "button",
              class: "kx-settings-rail-item",
              "aria-current": r.value === e.value ? "true" : void 0,
              onClick: (i) => o.$emit("update:value", r.value)
            }, [
              r.icon ? (n(), H(s(fe), {
                key: 0,
                class: "kx-settings-rail-icon",
                icon: r.icon,
                "aria-hidden": "true"
              }, null, 8, ["icon"])) : T("", !0),
              c("span", Oi, E(r.label), 1)
            ], 8, Ai))), 128))
          ], 2))), 128))
        ], 42, Ui)
      ]),
      _: 2
    }, [
      e.title && o.$slots.actions ? {
        name: "actions",
        fn: G(() => [
          Je(o.$slots, "actions")
        ]),
        key: "0"
      } : void 0
    ]), 1040));
  }
}), ko = Symbol("work-navigation");
function Ri() {
  return ti(ko, () => {
  });
}
function Ni(e) {
  if (e.name === "boards") return "";
  const a = encodeURIComponent(e.board);
  return e.name === "settings" ? `${a}/settings` : a;
}
const Gt = (e) => `/api/v1/work/boards/${encodeURIComponent(e)}`, ql = (e) => ({ declaration: e.declaration, expected_generation: e.expected_generation, plugin_configs: e.plugin_configs }), xt = {
  packPlan: (e, a) => Wt(`${Gt(e)}/pack_plan`, a, "Pack plan"),
  packApply: (e, a, t) => Wt(`${Gt(e)}/pack_apply`, { ...a, key: t }, "Apply pack"),
  plan: (e, a) => Wt(`${Gt(e)}/plan_schema`, ql(a), "Schema plan"),
  apply: (e, a, t) => Wt(`${Gt(e)}/apply_schema`, { ...ql(a), key: t }, "Apply schema"),
  resume: (e) => Wt(`${Gt(e)}/resume_migration`, {}, "Resume migration"),
  configure: (e, a, t) => Wt(`${Gt(e)}/configure_plugin`, { plugin: a, ...t === void 0 ? {} : { config: t } }, "Configure plugin")
}, xl = /* @__PURE__ */ we({
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
      const m = f.target;
      if (m instanceof Element && m !== f.currentTarget) {
        const r = m.closest('[data-work-action], button, a, input, textarea, [role="combobox"], [role="checkbox"], [role="switch"], details');
        if (r && r !== f.currentTarget) return;
      }
      l("activate", f);
    }
    function d(f) {
      f.target !== f.currentTarget || !["Enter", " "].includes(f.key) || (f.preventDefault(), t.disabled || l("activate", f));
    }
    return (f, m) => (n(), H(_t(e.as), {
      "data-work-action": "",
      class: "work-content-action",
      type: e.as === "button" ? "button" : void 0,
      role: e.role,
      tabindex: e.disabled ? -1 : 0,
      disabled: e.as === "button" ? e.disabled : void 0,
      "aria-disabled": e.disabled || void 0,
      onClick: o,
      onKeydown: d
    }, {
      default: G(() => [
        Je(f.$slots, "default")
      ]),
      _: 3
    }, 40, ["type", "role", "tabindex", "disabled", "aria-disabled"]));
  }
}), Mi = { class: "work-definition" }, Fi = {
  key: 0,
  class: "work-definition-handle"
}, Li = { class: "work-definition-lead" }, Bi = ["title"], zi = {
  key: 0,
  class: "work-definition-description"
}, ji = { class: "work-definition-details" }, Wi = { class: "work-definition-code" }, qi = ["title"], Gi = { class: "work-definition-kind" }, Ki = { class: "work-definition-flags" }, Hi = { class: "work-definition-usage" }, Yi = { class: "work-definition-actions" }, Xi = ["inert"], Wa = /* @__PURE__ */ we({
  __name: "DefinitionRow",
  props: {
    title: {},
    code: {},
    kind: {},
    description: {},
    initialOpen: { type: Boolean }
  },
  setup(e) {
    const t = B(!!e.initialOpen), l = ai();
    return (o, d) => (n(), g("article", Mi, [
      c("header", {
        class: ut(["work-definition-head", { "work-definition-has-handle": s(l).handle }])
      }, [
        s(l).handle ? (n(), g("div", Fi, [
          Je(o.$slots, "handle")
        ])) : T("", !0),
        c("div", Li, [
          y(xl, {
            class: "work-definition-toggle",
            "aria-expanded": t.value,
            onActivate: d[0] || (d[0] = (f) => t.value = !t.value)
          }, {
            default: G(() => [
              y(s(fe), {
                icon: "tabler:chevron-right",
                "aria-hidden": "true"
              }),
              c("span", {
                class: "work-row-title",
                title: e.title
              }, E(e.title), 9, Bi)
            ]),
            _: 1
          }, 8, ["aria-expanded"]),
          e.description ? (n(), g("p", zi, E(e.description), 1)) : T("", !0)
        ]),
        c("div", ji, [
          c("span", Wi, [
            e.code ? (n(), g("code", {
              key: 0,
              class: "work-mono",
              title: e.code
            }, E(e.code), 9, qi)) : T("", !0)
          ]),
          c("span", Gi, [
            e.kind ? (n(), H(s(Ye), {
              key: 0,
              severity: "secondary",
              value: e.kind
            }, null, 8, ["value"])) : T("", !0)
          ]),
          c("span", Ki, [
            Je(o.$slots, "flags")
          ]),
          c("div", Hi, [
            Je(o.$slots, "usage")
          ])
        ]),
        c("div", Yi, [
          Je(o.$slots, "actions")
        ])
      ], 2),
      y(uo, {
        name: "work-panel",
        persisted: ""
      }, {
        default: G(() => [
          vt(c("div", {
            inert: !t.value,
            class: "work-definition-body work-stack"
          }, [
            Je(o.$slots, "default")
          ], 8, Xi), [
            [$t, t.value]
          ])
        ]),
        _: 3
      })
    ]));
  }
}), Ji = { class: "work-definition-scroll" }, Zi = {
  key: 0,
  class: "work-definition-columns",
  "aria-hidden": "true"
}, Qi = { key: 0 }, _i = { class: "work-definition-usage" }, qa = /* @__PURE__ */ we({
  __name: "DefinitionList",
  props: {
    count: {},
    columns: {}
  },
  setup(e) {
    return (a, t) => (n(), g("div", Ji, [
      c("div", {
        class: ut(["work-field-builder", "work-definitions-" + e.columns])
      }, [
        e.count > 3 && e.columns !== "plugins" ? (n(), g("div", Zi, [
          t[0] || (t[0] = c("span", null, null, -1)),
          t[1] || (t[1] = c("span", null, "Name", -1)),
          t[2] || (t[2] = c("span", { class: "work-definition-code" }, "Identifier", -1)),
          c("span", null, E(e.columns === "types" ? "Workflow" : "Kind"), 1),
          e.columns === "fields" ? (n(), g("span", Qi, "Details")) : T("", !0),
          c("span", _i, E(e.columns === "fields" ? "Used by" : "Details"), 1),
          t[3] || (t[3] = c("span", null, null, -1))
        ])) : T("", !0),
        Je(a.$slots, "default")
      ], 2)
    ]));
  }
}), en = [
  { code: "key", form: "text", index: "key" },
  { code: "type", form: "text", index: "key" },
  { code: "state", form: "text", index: "key" },
  { code: "category", form: "text", index: "key" },
  { code: "rank", form: "text", index: "key" },
  { code: "parent", form: "text", index: "key" },
  { code: "created_at", form: "time", index: "key" },
  { code: "updated_at", form: "time", index: "key" }
];
function tn(e) {
  const a = e.compiled.processes?.flatMap((t) => t.states.map((l) => ({ id: l.id, label: l.name }))) ?? [];
  return [...en.filter((t) => t.code !== "rank").map((t) => t.code === "state" ? { ...t, type: "option", options: a } : t.code === "category" ? { ...t, type: "option", options: ["triage", "backlog", "unstarted", "started", "completed", "canceled"].map((l) => ({ id: l })) } : t), ...(e.compiled.fields ?? []).filter((t) => t.index && t.index !== "none")];
}
function an(e) {
  if (e?.cardinality && e.cardinality !== "one") return ["has", "in", "nin", "is_null", ...e.type === "principal" ? ["member_of"] : []];
  const a = ["eq", "neq", "in", "nin", "is_null", ...e?.type === "principal" ? ["member_of"] : []];
  return e && (["int", "number", "dec", "time", "quantity"].includes(e.form ?? "") || e.index === "number") && a.push("lt", "lte", "gt", "gte", "between"), e?.form === "text" && e.type !== "option" && a.push("contains", "starts_with"), a;
}
const ln = { class: "work-field-control" }, on = ["id"], nn = {
  key: 1,
  class: "work-stack work-tight"
}, sn = { class: "work-chips" }, rn = {
  key: 5,
  class: "work-row"
}, dn = ["inert"], un = ["value"], cn = {
  key: 1,
  class: "work-muted"
}, vn = ["inert"], mn = ["value"], fn = {
  key: 1,
  class: "work-muted"
}, pn = {
  key: 11,
  class: "work-stack work-tight"
}, bn = {
  class: "work-stack work-tight",
  "aria-label": "Matching items"
}, hn = { class: "work-mono" }, gn = {
  key: 15,
  class: "work-error work-small",
  role: "alert"
}, wo = /* @__PURE__ */ we({
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
    const t = e, l = a, o = K(() => t.inputId ?? `field-${t.field.code}`), d = K(() => !!t.field.cardinality && t.field.cardinality !== "one"), f = K(() => Array.isArray(t.modelValue) ? t.modelValue : []), m = K(() => t.modelValue == null ? "" : typeof t.modelValue == "object" ? qt(t.modelValue) : String(t.modelValue)), r = K(() => {
      const h = t.modelValue;
      return h && typeof h == "object" && "ref" in h && Array.isArray(h.ref) ? String(h.ref[1] ?? "") : "";
    }), i = K(() => t.disabled || zl(t.field)), u = B(!1), p = B(!1), w = B(!1), v = B(""), b = B(""), k = B([]), D = ua(), x = B([]);
    let C = 0, R;
    const M = /* @__PURE__ */ new Set();
    Ie(f, (h) => {
      x.value = R ?? h.map((O, se) => x.value[se] ?? C++), R = void 0;
    }, { immediate: !0 });
    function L(h) {
      l("update:modelValue", h);
    }
    function le(h, O) {
      const se = [...f.value];
      se[h] = O, L(se);
    }
    function te(h, O) {
      O ? M.delete(h) : M.add(h), l("validity", !M.size);
    }
    function ve(h) {
      M.delete(x.value[h]), l("validity", !M.size), R = x.value.filter((O, se) => se !== h), L(f.value.filter((O, se) => se !== h));
    }
    function J() {
      R = [...x.value, C++], L([...f.value, t.field.form === "bool" ? !1 : t.field.form === "record" ? {} : ""]);
    }
    function ue(h) {
      const O = h.detail, se = O?.principal_id ?? O?.id;
      L(se ? { kind: O.type ?? "user", id: se } : void 0);
    }
    function pe(h) {
      const O = h.detail;
      L(O?.thread_id ? { ref: ["component", O.thread_id] } : void 0);
    }
    const _ = B("");
    let I = "";
    Ie(() => t.modelValue, (h) => {
      const O = JSON.stringify(h ?? {}, null, 2);
      O !== I && (I = O, _.value = O, v.value = "", l("validity", !0));
    }, { immediate: !0 });
    function U(h) {
      _.value = h;
      try {
        const O = JSON.parse(h);
        if (!O || typeof O != "object" || Array.isArray(O)) throw new Error("Enter a JSON object.");
        if (t.field.type === "rich_text" && !("type" in O && typeof O.type == "string")) throw new Error("The document needs a type.");
        I = JSON.stringify(O, null, 2), v.value = "", l("validity", !0), L(O);
      } catch (O) {
        v.value = O instanceof Error ? O.message : "Invalid JSON.", l("validity", !1);
      }
    }
    function $(h) {
      if (!h) {
        l("validity", !0), L(void 0);
        return;
      }
      const O = Number.isFinite(Number(h)) && (t.field.form !== "int" || Number.isSafeInteger(Number(h)));
      l("validity", O), O && L(t.field.form === "int" ? Number(h) : h);
    }
    const j = K(() => t.field.config?.format === "date");
    function X(h) {
      L(h ? j.value ? h : new Date(h).toISOString() : void 0);
    }
    const de = K(() => {
      if (typeof t.modelValue != "string") return "";
      if (j.value) return t.modelValue.slice(0, 10);
      const h = new Date(t.modelValue);
      return Number.isNaN(h.getTime()) ? "" : new Date(h.getTime() - h.getTimezoneOffset() * 6e4).toISOString().slice(0, 16);
    });
    function A(h) {
      L(h.detail?.ref);
    }
    function W(h) {
      L(h.detail?.value);
    }
    let F;
    Ie(b, () => {
      const h = D();
      if (clearTimeout(F), !b.value.trim()) {
        k.value = [];
        return;
      }
      F = setTimeout(async () => {
        try {
          const O = b.value.trim(), se = /^[A-Z][A-Z0-9]{1,9}-[0-9]+$/.test(O) ? [(await ht.item(t.boardId, { key: O })).item] : (await ht.query(t.boardId, { where: { field: "title", op: "contains", value: O }, limit: 8 })).items;
          h() && (k.value = se, v.value = "");
        } catch (O) {
          h() && (v.value = ot(O, "Could not search items."));
        }
      }, 200);
    });
    function ce(h) {
      L({ board: t.boardId, item: h.id }), b.value = "", k.value = [];
    }
    ga(async () => {
      t.field.type === "principal" ? u.value = await It("wc-principal-picker") : t.field.config?.target === "component" && (u.value = await It("wc-component-picker"));
    });
    for (const [h, O] of [[() => t.editorTag, w], [() => t.linkTag, p]])
      Ie(h, async (se, ne, ye) => {
        let z = !0;
        if (ye(() => {
          z = !1;
        }), O.value = !1, se) {
          const N = await It(se);
          z && (O.value = N);
        }
      }, { immediate: !0 });
    return Vl(() => {
      clearTimeout(F), D();
    }), (h, O) => {
      const se = co("FieldControl", !0);
      return n(), g("div", ln, [
        s(zl)(e.field) ? (n(), g("output", {
          key: 0,
          id: o.value,
          class: "work-read-value"
        }, E(s(qt)(e.modelValue, e.field)), 9, on)) : d.value ? (n(), g("div", nn, [
          c("div", sn, [
            (n(!0), g(Q, null, re(f.value, (ne, ye) => (n(), H(s(Ye), {
              key: x.value[ye],
              class: "kx-tag-sm",
              severity: "secondary"
            }, {
              default: G(() => [
                q(E(s(qt)(ne, e.field)) + " ", 1),
                y(s(ee), {
                  type: "button",
                  class: "work-icon-button",
                  disabled: i.value,
                  "aria-label": "Remove value " + (ye + 1),
                  onClick: (z) => ve(ye),
                  severity: "secondary",
                  text: "",
                  size: "small"
                }, {
                  default: G(() => [
                    y(s(fe), {
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
          (n(!0), g(Q, null, re(f.value, (ne, ye) => (n(), g("div", {
            key: x.value[ye],
            class: "work-stack work-tight"
          }, [
            y(se, {
              "board-id": e.boardId,
              field: { ...e.field, cardinality: "one" },
              "model-value": ne,
              "input-id": o.value + "-" + x.value[ye],
              disabled: i.value,
              "editor-tag": e.editorTag,
              "link-tag": e.linkTag,
              "onUpdate:modelValue": (z) => le(ye, z),
              onValidity: (z) => te(x.value[ye], z)
            }, null, 8, ["board-id", "field", "model-value", "input-id", "disabled", "editor-tag", "link-tag", "onUpdate:modelValue", "onValidity"])
          ]))), 128)),
          y(s(ee), {
            label: "Add value",
            severity: "secondary",
            size: "small",
            disabled: i.value,
            onClick: J,
            outlined: ""
          }, {
            icon: G(() => [
              y(s(fe), {
                icon: "tabler:plus",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled"])
        ])) : e.editorTag && w.value ? (n(), H(_t(e.editorTag), {
          key: 2,
          "board-id": e.boardId,
          value: JSON.stringify(e.modelValue ?? null),
          config: JSON.stringify(e.field.config ?? {}),
          readonly: i.value || void 0,
          onChange: W
        }, null, 40, ["board-id", "value", "config", "readonly"])) : e.linkTag && p.value ? (n(), H(_t(e.linkTag), {
          key: 3,
          "board-id": e.boardId,
          kind: e.field.config?.target ?? e.field.type,
          value: JSON.stringify(e.modelValue ?? null),
          readonly: i.value || void 0,
          onChange: A
        }, null, 40, ["board-id", "kind", "value", "readonly"])) : e.field.type === "option" ? (n(), H(s(me), {
          key: 4,
          placeholder: "Not set",
          inputId: o.value,
          "model-value": e.modelValue ?? "",
          disabled: i.value,
          "onUpdate:modelValue": O[0] || (O[0] = (ne) => L(ne || void 0)),
          appendTo: "self",
          optionLabel: "label",
          optionValue: "value",
          optionDisabled: "disabled",
          options: [{ label: "Not set", value: "", disabled: !1 }, ...(e.field.options ?? []).map((ne) => ({ label: ne.label ?? ne.id, value: ne.id, disabled: !1 }))]
        }, null, 8, ["inputId", "model-value", "disabled", "options"])) : e.field.form === "bool" ? (n(), g("label", rn, [
          y(s(Bt), {
            inputId: o.value,
            "model-value": e.modelValue === !0,
            disabled: i.value,
            "onUpdate:modelValue": O[1] || (O[1] = (ne) => L(ne)),
            binary: ""
          }, null, 8, ["inputId", "model-value", "disabled"]),
          q(E(e.modelValue === !0 ? "Yes" : e.modelValue === !1 ? "No" : "Not set"), 1)
        ])) : e.field.form === "int" ? (n(), H(s(gt), {
          key: 6,
          inputId: o.value,
          "model-value": m.value === "" ? null : Number(m.value),
          disabled: i.value,
          "onUpdate:modelValue": O[2] || (O[2] = (ne) => $(ne == null ? "" : String(ne))),
          useGrouping: !1
        }, null, 8, ["inputId", "model-value", "disabled"])) : e.field.form === "dec" ? (n(), H(s(Se), {
          key: 7,
          id: o.value,
          inputmode: "decimal",
          "model-value": m.value,
          disabled: i.value,
          "onUpdate:modelValue": O[3] || (O[3] = (ne) => $(ne ?? ""))
        }, null, 8, ["id", "model-value", "disabled"])) : e.field.form === "time" ? (n(), H(s(Se), {
          key: 8,
          id: o.value,
          type: j.value ? "date" : "datetime-local",
          value: de.value,
          disabled: i.value,
          onInput: O[4] || (O[4] = (ne) => X(ne.target.value))
        }, null, 8, ["id", "type", "value", "disabled"])) : e.field.type === "principal" ? (n(), g("div", {
          key: 9,
          inert: i.value || void 0,
          class: "work-stack work-tight"
        }, [
          u.value ? (n(), g("wc-principal-picker", {
            key: 0,
            value: JSON.stringify(e.modelValue ?? {}),
            kinds: "user,group",
            onConfigChanged: ue
          }, null, 40, un)) : (n(), g("span", cn, E(s(qt)(e.modelValue, e.field)) + " · Person picker is unavailable.", 1))
        ], 8, dn)) : e.field.config?.target === "component" ? (n(), g("div", {
          key: 10,
          inert: i.value || void 0
        }, [
          u.value ? (n(), g("wc-component-picker", {
            key: 0,
            value: JSON.stringify({ thread_id: r.value }),
            onChange: pe
          }, null, 40, mn)) : (n(), g("span", fn, "Component picker is unavailable."))
        ], 8, vn)) : e.field.type === "item" ? (n(), g("div", pn, [
          y(s(Ye), {
            class: "kx-tag-sm",
            severity: "secondary"
          }, {
            default: G(() => [
              q(E(s(qt)(e.modelValue, e.field)), 1)
            ]),
            _: 1
          }),
          y(s(Se), {
            id: o.value,
            modelValue: b.value,
            "onUpdate:modelValue": O[5] || (O[5] = (ne) => b.value = ne),
            disabled: i.value,
            placeholder: "Search a title or enter an item key",
            "aria-label": "Search items"
          }, null, 8, ["id", "modelValue", "disabled"]),
          c("div", bn, [
            (n(!0), g(Q, null, re(k.value, (ne) => (n(), H(xl, {
              key: ne.id,
              class: "work-match-item",
              disabled: i.value,
              onActivate: (ye) => ce(ne)
            }, {
              default: G(() => [
                c("code", hn, E(ne.key), 1),
                c("span", null, E(s(qt)(ne.values.title)), 1)
              ]),
              _: 2
            }, 1032, ["disabled", "onActivate"]))), 128))
          ]),
          e.modelValue ? (n(), H(s(ee), {
            key: 0,
            label: "Clear reference",
            severity: "secondary",
            size: "small",
            disabled: i.value,
            onClick: O[6] || (O[6] = (ne) => L(void 0)),
            outlined: ""
          }, {
            icon: G(() => [
              y(s(fe), {
                icon: "tabler:list-check",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled"])) : T("", !0)
        ])) : e.field.form === "record" || e.field.type === "rich_text" || e.field.form === "quantity" || e.field.form === "ref" ? (n(), H(s(ha), {
          key: 12,
          id: o.value,
          "model-value": _.value,
          rows: "3",
          disabled: i.value,
          "aria-invalid": !!v.value,
          "onUpdate:modelValue": O[7] || (O[7] = (ne) => U(ne ?? ""))
        }, null, 8, ["id", "model-value", "disabled", "aria-invalid"])) : e.field.code === "description" ? (n(), H(s(ha), {
          key: 13,
          id: o.value,
          "model-value": m.value,
          rows: "4",
          disabled: i.value,
          "onUpdate:modelValue": O[8] || (O[8] = (ne) => L(ne))
        }, null, 8, ["id", "model-value", "disabled"])) : (n(), H(s(Se), {
          key: 14,
          id: o.value,
          "model-value": m.value,
          disabled: i.value,
          "onUpdate:modelValue": O[9] || (O[9] = (ne) => L(ne))
        }, null, 8, ["id", "model-value", "disabled"])),
        v.value ? (n(), g("span", gn, E(v.value), 1)) : T("", !0)
      ]);
    };
  }
}), yn = { class: "work-stack work-tight work-operand-control" }, kn = { class: "work-row work-small" }, wn = {
  key: 1,
  class: "work-muted work-small"
}, Vn = {
  key: 2,
  class: "work-stack work-tight"
}, $n = { class: "work-small" }, xn = {
  key: 0,
  class: "work-error work-small",
  role: "alert"
}, oa = /* @__PURE__ */ we({
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
    const t = e, l = a, o = K(() => "$actor" in Lt(t.modelValue) ? "actor" : "$now" in Lt(t.modelValue) ? "now" : "literal"), d = B(""), f = B("");
    Ie(() => t.modelValue, (i) => {
      d.value = JSON.stringify(i ?? []), f.value = "";
    }, { immediate: !0 });
    function m(i) {
      l("update:modelValue", i === "actor" ? { $actor: "id" } : i === "now" ? { $now: "P0D" } : void 0), l("validity", !0);
    }
    function r(i) {
      d.value = i;
      try {
        const u = JSON.parse(i);
        if (!Array.isArray(u)) throw new Error("Enter a JSON list.");
        f.value = "", l("validity", !0), l("update:modelValue", u);
      } catch (u) {
        f.value = u instanceof Error ? u.message : "Invalid values.", l("validity", !1);
      }
    }
    return (i, u) => (n(), g("div", yn, [
      c("label", kn, [
        q(E(e.label), 1),
        y(s(me), {
          "aria-label": e.label + " operand",
          "model-value": o.value,
          disabled: e.disabled,
          "onUpdate:modelValue": u[0] || (u[0] = (p) => m(p)),
          appendTo: "self",
          optionLabel: "label",
          optionValue: "value",
          optionDisabled: "disabled",
          options: [{ label: "Value", value: "literal", disabled: !1 }, { label: "Current actor ($actor)", value: "actor", disabled: !1 }, { label: "Current time ($now)", value: "now", disabled: !1 }]
        }, null, 8, ["aria-label", "model-value", "disabled"])
      ]),
      o.value === "now" ? (n(), H(s(Se), {
        key: 0,
        "aria-label": e.label + " time offset",
        value: s(Lt)(e.modelValue).$now,
        disabled: e.disabled,
        placeholder: "-P7D",
        onInput: u[1] || (u[1] = (p) => l("update:modelValue", { $now: p.target.value }))
      }, null, 8, ["aria-label", "value", "disabled"])) : o.value === "actor" ? (n(), g("span", wn, "The signed-in actor’s id")) : e.multiple ? (n(), g("div", Vn, [
        c("label", $n, [
          u[5] || (u[5] = q("Values as JSON (operands may appear in the list)", -1)),
          y(s(ha), {
            class: "work-mono",
            "aria-label": e.label + " values",
            value: d.value,
            disabled: e.disabled,
            rows: "2",
            onInput: u[2] || (u[2] = (p) => r(p.target.value))
          }, null, 8, ["aria-label", "value", "disabled"])
        ]),
        f.value ? (n(), g("p", xn, E(f.value), 1)) : T("", !0)
      ])) : (n(), H(wo, {
        key: 3,
        "board-id": e.boardId,
        field: { ...e.field, cardinality: "one" },
        "model-value": e.modelValue,
        disabled: e.disabled,
        "input-id": e.label.replace(/[^a-z0-9]/gi, "-"),
        "onUpdate:modelValue": u[3] || (u[3] = (p) => l("update:modelValue", p)),
        onValidity: u[4] || (u[4] = (p) => l("validity", p))
      }, null, 8, ["board-id", "field", "model-value", "disabled", "input-id"]))
    ]));
  }
}), Cn = ["disabled"], Sn = { class: "work-small work-mono" }, Tn = { class: "work-row work-small" }, In = { class: "work-row work-wrap" }, Dn = { key: 3 }, Un = { class: "work-row work-wrap" }, En = { class: "work-row" }, An = { class: "work-row" }, On = { class: "work-row" }, Pn = {
  key: 3,
  class: "work-row work-wrap"
}, Rn = { class: "work-row work-wrap" }, Nn = /* @__PURE__ */ we({
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
    const t = e, l = a, o = K(() => t.path ?? "where"), d = K(() => t.depth ?? 1), f = K(() => ["and", "or", "not", "history", "match", "rel", "children"].find((_) => _ in t.modelValue) ?? "field"), m = K(() => tn(t.schema)), r = K(() => m.value.find((_) => _.code === t.modelValue.field) ?? { code: "value", form: "text" }), i = K(() => Lt(t.modelValue.history)), u = K(() => m.value.find((_) => _.code === i.value.field) ?? { code: "history", form: "text" }), p = K(() => Array.isArray(t.modelValue[f.value]) ? t.modelValue[f.value] : []), w = {
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
    }, v = {
      field: "Field value",
      and: "All conditions",
      or: "Any condition",
      not: "Condition is false",
      history: "Value history",
      rel: "Linked items",
      children: "Child items",
      match: "Search text"
    }, b = () => ({ field: "category", op: "eq", value: "unstarted" }), k = B(/* @__PURE__ */ new Set());
    function D(_, I) {
      I ? k.value.delete(_) : k.value.add(_), l("validity", k.value.size === 0);
    }
    Ie(f, () => {
      k.value.clear(), l("validity", !0);
    });
    function x(_) {
      const I = /* @__PURE__ */ new Set();
      for (const U of k.value) {
        const $ = Number(U);
        !Number.isNaN($) && $ !== _ && I.add(String($ > _ ? $ - 1 : $));
      }
      k.value = I, l("validity", I.size === 0), R({ [f.value]: p.value.filter((U, $) => $ !== _) });
    }
    function C(_) {
      l("update:modelValue", _);
    }
    function R(_) {
      C({ ...t.modelValue, ..._ });
    }
    function M(_) {
      C(_ === "field" ? b() : _ === "and" || _ === "or" ? { [_]: [b()] } : _ === "not" ? { not: b() } : _ === "history" ? { history: { field: "state", changed: !0 } } : _ === "match" ? { match: "" } : _ === "children" ? { children: !0, q: "some", where: b() } : { rel: t.schema.compiled.relation_types?.[0]?.id ?? "", dir: "outward", q: "some", where: b() });
    }
    function L(_, I) {
      R({ [f.value]: p.value.map((U, $) => $ === _ ? I : U) });
    }
    function le(_, I) {
      const U = { ...i.value };
      I === void 0 ? (delete U[_], D(_, !0)) : U[_] = I, R({ history: U });
    }
    function te(_) {
      k.value.clear(), l("validity", !0);
      const I = { ...i.value };
      delete I.was, delete I.changed, delete I.from, delete I.to, I[_] = _ === "changed" ? !0 : "", R({ history: I });
    }
    const ve = { code: "actor", form: "text" }, J = { code: "at", form: "time" }, ue = K(() => Array.isArray(i.value.during) ? i.value.during : []);
    function pe(_, I) {
      const U = [...ue.value];
      U[_] = I, le("during", U);
    }
    return (_, I) => {
      const U = co("FilterNode", !0);
      return n(), g("fieldset", {
        class: "work-filter-node",
        disabled: e.disabled
      }, [
        c("legend", Sn, E(o.value), 1),
        c("label", Tn, [
          I[21] || (I[21] = q("Condition", -1)),
          y(s(me), {
            "aria-label": o.value + " condition",
            "model-value": f.value,
            "onUpdate:modelValue": I[0] || (I[0] = ($) => M($)),
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            optionDisabled: "disabled",
            options: Object.entries(v).map(([$, j]) => ({ label: j, value: $, disabled: d.value >= 6 && ["and", "or", "not", "rel", "children"].includes($) }))
          }, null, 8, ["aria-label", "model-value", "options"])
        ]),
        f.value === "and" || f.value === "or" ? (n(), g(Q, { key: 0 }, [
          (n(!0), g(Q, null, re(p.value, ($, j) => (n(), g("div", {
            key: j,
            class: "work-stack work-tight"
          }, [
            y(U, {
              "board-id": e.boardId,
              schema: e.schema,
              "model-value": $,
              path: o.value + "." + f.value + "[" + j + "]",
              depth: d.value + 1,
              "onUpdate:modelValue": (X) => L(j, X),
              onValidity: (X) => D(String(j), X)
            }, null, 8, ["board-id", "schema", "model-value", "path", "depth", "onUpdate:modelValue", "onValidity"]),
            y(s(ee), {
              label: "Remove condition",
              size: "small",
              severity: "secondary",
              onClick: (X) => x(j),
              outlined: ""
            }, {
              icon: G(() => [
                y(s(fe), {
                  icon: "tabler:trash",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["onClick"])
          ]))), 128)),
          y(s(ee), {
            label: "Add condition",
            size: "small",
            severity: "secondary",
            disabled: d.value >= 6,
            onClick: I[1] || (I[1] = ($) => R({ [f.value]: [...p.value, b()] })),
            outlined: ""
          }, {
            icon: G(() => [
              y(s(fe), {
                icon: "tabler:plus",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled"])
        ], 64)) : f.value === "not" ? (n(), H(U, {
          key: 1,
          "board-id": e.boardId,
          schema: e.schema,
          "model-value": s(Lt)(e.modelValue.not),
          path: o.value + ".not",
          depth: d.value + 1,
          "onUpdate:modelValue": I[2] || (I[2] = ($) => R({ not: $ })),
          onValidity: I[3] || (I[3] = ($) => D("nested", $))
        }, null, 8, ["board-id", "schema", "model-value", "path", "depth"])) : f.value === "field" ? (n(), g(Q, { key: 2 }, [
          c("div", In, [
            c("label", null, [
              I[22] || (I[22] = q("Field", -1)),
              y(s(me), {
                "aria-label": o.value + " field",
                "model-value": e.modelValue.field,
                "onUpdate:modelValue": I[4] || (I[4] = ($) => R({ field: $, op: "eq", value: void 0 })),
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                optionDisabled: "disabled",
                options: [...(m.value ?? []).map(($) => ({ label: s(Ke)($), value: $.code, disabled: !1 }))]
              }, null, 8, ["aria-label", "model-value", "options"])
            ]),
            c("label", null, [
              I[23] || (I[23] = q("Comparison", -1)),
              y(s(me), {
                "aria-label": o.value + " operator",
                "model-value": e.modelValue.op,
                "onUpdate:modelValue": I[5] || (I[5] = ($) => R({ op: $, value: $ === "is_null" ? !0 : void 0 })),
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                options: s(an)(r.value).map(($) => ({ value: $, label: w[$] }))
              }, null, 8, ["aria-label", "model-value", "options"])
            ])
          ]),
          y(oa, {
            "board-id": e.boardId,
            field: e.modelValue.op === "is_null" ? { code: "null", form: "bool" } : r.value,
            "model-value": e.modelValue.value,
            multiple: ["in", "nin", "between"].includes(String(e.modelValue.op)),
            label: o.value + " value",
            "onUpdate:modelValue": I[6] || (I[6] = ($) => R({ value: $ })),
            onValidity: I[7] || (I[7] = ($) => D("value", $))
          }, null, 8, ["board-id", "field", "model-value", "multiple", "label"])
        ], 64)) : f.value === "match" ? (n(), g("label", Dn, [
          I[24] || (I[24] = q("Search", -1)),
          y(s(Se), {
            "aria-label": o.value + " search",
            value: e.modelValue.match,
            onInput: I[8] || (I[8] = ($) => R({ match: $.target.value }))
          }, null, 8, ["aria-label", "value"])
        ])) : f.value === "history" ? (n(), g(Q, { key: 4 }, [
          c("div", Un, [
            c("label", null, [
              I[25] || (I[25] = q("Field", -1)),
              y(s(me), {
                "aria-label": o.value + " history field",
                "model-value": i.value.field,
                "onUpdate:modelValue": I[9] || (I[9] = ($) => le("field", $)),
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                optionDisabled: "disabled",
                options: [...(m.value ?? []).map(($) => ({ label: s(Ke)($), value: $.code, disabled: !1 }))]
              }, null, 8, ["aria-label", "model-value", "options"])
            ]),
            c("label", null, [
              I[26] || (I[26] = q("History", -1)),
              y(s(me), {
                "aria-label": o.value + " history mode",
                "model-value": i.value.changed ? "changed" : "was",
                "onUpdate:modelValue": I[10] || (I[10] = ($) => te($)),
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                optionDisabled: "disabled",
                options: [{ label: "Changed", value: "changed", disabled: !1 }, { label: "Was", value: "was", disabled: !1 }]
              }, null, 8, ["aria-label", "model-value"])
            ])
          ]),
          i.value.changed ? (n(), g(Q, { key: 0 }, re(["from", "to"], ($) => c("div", { key: $ }, [
            c("label", En, [
              y(s(Bt), {
                "model-value": $ in i.value,
                "aria-label": "Constrain " + $,
                "onUpdate:modelValue": (j) => le($, j ? "" : void 0),
                binary: ""
              }, null, 8, ["model-value", "aria-label", "onUpdate:modelValue"]),
              q(E($), 1)
            ]),
            $ in i.value ? (n(), H(oa, {
              key: 0,
              "board-id": e.boardId,
              field: u.value,
              "model-value": i.value[$],
              label: o.value + " history " + $,
              "onUpdate:modelValue": (j) => le($, j),
              onValidity: (j) => D($, j)
            }, null, 8, ["board-id", "field", "model-value", "label", "onUpdate:modelValue", "onValidity"])) : T("", !0)
          ])), 64)) : (n(), H(oa, {
            key: 1,
            "board-id": e.boardId,
            field: u.value,
            "model-value": i.value.was,
            label: o.value + " history was",
            "onUpdate:modelValue": I[11] || (I[11] = ($) => le("was", $)),
            onValidity: I[12] || (I[12] = ($) => D("was", $))
          }, null, 8, ["board-id", "field", "model-value", "label"])),
          c("label", An, [
            y(s(Bt), {
              "model-value": "by" in i.value,
              "aria-label": "Constrain actor",
              "onUpdate:modelValue": I[13] || (I[13] = ($) => le("by", $ ? { $actor: "id" } : void 0)),
              binary: ""
            }, null, 8, ["model-value"]),
            I[27] || (I[27] = q("By actor", -1))
          ]),
          "by" in i.value ? (n(), H(oa, {
            key: 2,
            "board-id": e.boardId,
            field: ve,
            "model-value": i.value.by,
            label: o.value + " history by",
            "onUpdate:modelValue": I[14] || (I[14] = ($) => le("by", $))
          }, null, 8, ["board-id", "model-value", "label"])) : T("", !0),
          c("label", On, [
            y(s(Bt), {
              "model-value": "during" in i.value,
              "aria-label": "Constrain time window",
              "onUpdate:modelValue": I[15] || (I[15] = ($) => le("during", $ ? [{ $now: "-P30D" }, { $now: "P0D" }] : void 0)),
              binary: ""
            }, null, 8, ["model-value"]),
            I[28] || (I[28] = q("During", -1))
          ]),
          "during" in i.value ? (n(), g("div", Pn, [
            (n(), g(Q, null, re(["start", "end"], ($, j) => y(oa, {
              key: $,
              "board-id": e.boardId,
              field: J,
              "model-value": ue.value[j],
              label: o.value + " during " + $,
              "onUpdate:modelValue": (X) => pe(j, X)
            }, null, 8, ["board-id", "model-value", "label", "onUpdate:modelValue"])), 64))
          ])) : T("", !0)
        ], 64)) : (n(), g(Q, { key: 5 }, [
          c("div", Rn, [
            f.value === "rel" ? (n(), g(Q, { key: 0 }, [
              c("label", null, [
                I[29] || (I[29] = q("Relation", -1)),
                y(s(me), {
                  "model-value": e.modelValue.rel,
                  "onUpdate:modelValue": I[16] || (I[16] = ($) => R({ rel: $ })),
                  appendTo: "self",
                  optionLabel: "label",
                  optionValue: "value",
                  optionDisabled: "disabled",
                  options: [...(e.schema.compiled.relation_types ?? []).map(($) => ({ label: $.outward ?? $.id, value: $.id, disabled: !1 }))]
                }, null, 8, ["model-value", "options"])
              ]),
              c("label", null, [
                I[30] || (I[30] = q("Direction", -1)),
                y(s(me), {
                  "model-value": e.modelValue.dir,
                  "onUpdate:modelValue": I[17] || (I[17] = ($) => R({ dir: $ })),
                  appendTo: "self",
                  optionLabel: "label",
                  optionValue: "value",
                  optionDisabled: "disabled",
                  options: [{ label: "Outward", value: "outward", disabled: !1 }, { label: "Inward", value: "inward", disabled: !1 }]
                }, null, 8, ["model-value"])
              ])
            ], 64)) : T("", !0),
            c("label", null, [
              I[31] || (I[31] = q("Quantifier", -1)),
              y(s(me), {
                "model-value": e.modelValue.q,
                "onUpdate:modelValue": I[18] || (I[18] = ($) => R({ q: $ })),
                appendTo: "self",
                options: ["some", "every", "none"]
              }, null, 8, ["model-value"])
            ])
          ]),
          y(U, {
            "board-id": e.boardId,
            schema: e.schema,
            "model-value": s(Lt)(e.modelValue.where),
            path: o.value + ".where",
            depth: d.value + 1,
            "onUpdate:modelValue": I[19] || (I[19] = ($) => R({ where: $ })),
            onValidity: I[20] || (I[20] = ($) => D("nested", $))
          }, null, 8, ["board-id", "schema", "model-value", "path", "depth"])
        ], 64))
      ], 8, Cn);
    };
  }
}), Mn = { class: "work-stack work-tight" }, Fn = { class: "work-row work-small" }, Cl = /* @__PURE__ */ we({
  __name: "ConditionEditor",
  props: {
    modelValue: {},
    draft: {},
    boardId: {},
    label: {}
  },
  emits: ["update:modelValue", "validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = K(() => ({ declaration: t.draft, compiled: t.draft, generation: 0, as_of: 0, key_prefix: "" })), d = /* @__PURE__ */ new Set();
    function f(r, i) {
      i ? d.delete(r) : d.add(r), l("validity", !d.size);
    }
    function m(r) {
      l("update:modelValue", r ? { field: t.draft.fields?.[0]?.code ?? "state", op: "eq" } : void 0), r || (d.clear(), l("validity", !0));
    }
    return wt(() => l("validity", !0)), (r, i) => (n(), g("section", Mn, [
      c("label", Fn, [
        y(s(Qe), {
          "model-value": e.modelValue != null,
          "aria-label": e.label,
          "onUpdate:modelValue": m
        }, null, 8, ["model-value", "aria-label"]),
        q(E(e.label), 1)
      ]),
      e.modelValue != null ? (n(), H(Nn, {
        key: 0,
        schema: o.value,
        "board-id": e.boardId ?? "",
        "model-value": s(Lt)(e.modelValue),
        path: e.label,
        "onUpdate:modelValue": i[0] || (i[0] = (u) => l("update:modelValue", u)),
        onValidity: i[1] || (i[1] = (u) => f("structured", u))
      }, null, 8, ["schema", "board-id", "model-value", "path"])) : T("", !0),
      e.modelValue != null ? (n(), H(Dt, {
        key: 1,
        label: e.label + " predicate",
        "model-value": e.modelValue,
        hint: "Use any predicate accepted by Work, including installed or deeply nested forms.",
        "onUpdate:modelValue": i[2] || (i[2] = (u) => l("update:modelValue", u)),
        onValidity: i[3] || (i[3] = (u) => f("raw", u))
      }, null, 8, ["label", "model-value"])) : T("", !0)
    ]));
  }
}), Ln = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, Bn = ["aria-label"], zn = { class: "work-field-label" }, jn = {
  key: 0,
  class: "work-chips"
}, Wn = ["kinds"], qn = {
  key: 2,
  class: "work-muted work-small"
}, Sl = /* @__PURE__ */ we({
  __name: "PrincipalsPicker",
  props: {
    modelValue: {},
    label: {},
    kinds: {},
    boardId: {}
  },
  emits: ["update:modelValue"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = B(!1), d = B(0), f = K(() => t.modelValue ?? []), { principalLabel: m, rememberPrincipal: r, nameError: i } = mo(() => t.boardId ?? "", () => f.value);
    ga(async () => {
      o.value = await It("wc-principal-picker");
    });
    function u(p) {
      const w = p.detail, v = w?.principal_id ?? w?.id;
      if (!v) return;
      const b = { kind: w.type ?? "user", id: v };
      w.label && r(b, w.label), f.value.some((k) => k.id === v && k.kind === b.kind) || l("update:modelValue", [...f.value, b]), d.value++;
    }
    return (p, w) => (n(), g(Q, null, [
      s(i) ? (n(), g("p", Ln, E(s(i)), 1)) : T("", !0),
      c("section", {
        class: "work-stack work-tight work-principals-picker",
        "aria-label": e.label
      }, [
        c("h4", zn, E(e.label), 1),
        f.value.length ? (n(), g("div", jn, [
          (n(!0), g(Q, null, re(f.value, (v, b) => (n(), H(s(Ye), {
            key: v.kind + v.id,
            severity: "secondary",
            class: "kx-tag-sm"
          }, {
            default: G(() => [
              q(E(s(m)(v)), 1),
              y(s(ee), {
                text: "",
                severity: "secondary",
                size: "small",
                "aria-label": "Remove " + s(m)(v),
                onClick: (k) => l("update:modelValue", f.value.filter((D, x) => x !== b))
              }, {
                default: G(() => [
                  y(s(fe), { icon: "tabler:x" })
                ]),
                _: 1
              }, 8, ["aria-label", "onClick"])
            ]),
            _: 2
          }, 1024))), 128))
        ])) : T("", !0),
        o.value ? (n(), g("wc-principal-picker", {
          key: d.value,
          kinds: e.kinds ?? "user,group",
          onConfigChanged: u
        }, null, 40, Wn)) : (n(), g("p", qn, "People and group picker is unavailable."))
      ], 8, Bn)
    ], 64));
  }
}), Gn = { class: "work-stack work-tight" }, Vo = /* @__PURE__ */ we({
  __name: "HoldersPicker",
  props: {
    modelValue: {},
    label: {},
    boardId: {}
  },
  emits: ["update:modelValue", "validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = K(() => (t.modelValue ?? []).flatMap((f) => "user" in f ? [{ kind: "user", id: f.user }] : "group" in f ? [{ kind: "group", id: f.group }] : []));
    function d(f) {
      const m = [...(t.modelValue ?? []).filter((r) => "field" in r || "service" in r), ...f.map((r) => r.kind === "group" ? { group: r.id } : { user: r.id })];
      l("update:modelValue", m.length ? m : void 0);
    }
    return (f, m) => (n(), g("div", Gn, [
      y(Sl, {
        "board-id": e.boardId,
        label: e.label,
        "model-value": o.value,
        "onUpdate:modelValue": d
      }, null, 8, ["board-id", "label", "model-value"]),
      y(Dt, {
        label: e.label + " rules",
        "model-value": e.modelValue,
        shape: "array",
        example: [{ group: "selected-group" }],
        "onUpdate:modelValue": m[0] || (m[0] = (r) => l("update:modelValue", r)),
        onValidity: m[1] || (m[1] = (r) => l("validity", r))
      }, null, 8, ["label", "model-value"])
    ]));
  }
}), Kn = ["disabled"], Hn = { class: "work-chips" }, Yn = {
  key: 1,
  class: "work-muted work-small"
}, ct = /* @__PURE__ */ we({
  __name: "ChipPicker",
  props: {
    label: {},
    options: {},
    modelValue: {},
    disabled: { type: Boolean }
  },
  emits: ["update:modelValue"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = B(""), d = K(() => t.options.map((r) => typeof r == "string" ? { value: r } : r)), f = K(() => d.value.filter((r) => (r.label ?? Re(r.value)).toLocaleLowerCase().includes(o.value.toLocaleLowerCase())));
    function m(r) {
      if (t.disabled) return;
      const i = t.modelValue ?? [];
      l("update:modelValue", i.includes(r) ? i.filter((u) => u !== r) : [...i, r]);
    }
    return (r, i) => (n(), g("fieldset", {
      class: "work-chip-picker",
      disabled: e.disabled
    }, [
      c("legend", null, E(e.label), 1),
      e.options.length > 10 ? (n(), H(s(Se), {
        key: 0,
        modelValue: o.value,
        "onUpdate:modelValue": i[0] || (i[0] = (u) => o.value = u),
        type: "search",
        "aria-label": "Find " + e.label.toLowerCase(),
        placeholder: "Find a choice…"
      }, null, 8, ["modelValue", "aria-label"])) : T("", !0),
      c("div", Hn, [
        y(s($l), {
          "model-value": e.modelValue ?? [],
          options: f.value.map((u) => ({ value: u.value, label: u.label ?? s(Re)(u.value) })),
          optionLabel: "label",
          optionValue: "value",
          multiple: "",
          disabled: e.disabled,
          "aria-label": e.label,
          "onUpdate:modelValue": i[1] || (i[1] = (u) => l("update:modelValue", u ?? []))
        }, null, 8, ["model-value", "options", "disabled", "aria-label"]),
        (n(!0), g(Q, null, re(e.modelValue?.filter((u) => !d.value.some((p) => p.value === u)) ?? [], (u) => (n(), H(s(ee), {
          severity: "secondary",
          text: "",
          size: "small",
          key: u,
          type: "button",
          class: "work-choice work-unavailable",
          "aria-label": "Remove unavailable " + u,
          onClick: (p) => m(u)
        }, {
          default: G(() => [
            q(E(s(Re)(u)) + " · unavailable ×", 1)
          ]),
          _: 2
        }, 1032, ["aria-label", "onClick"]))), 128))
      ]),
      e.options.length ? T("", !0) : (n(), g("span", Yn, "No choices declared."))
    ], 8, Kn));
  }
});
/**!
 * Sortable 1.15.7
 * @author	RubaXa   <trash@rubaxa.org>
 * @author	owenm    <owen23355@gmail.com>
 * @license MIT
 */
function Xn(e, a, t) {
  return (a = _n(a)) in e ? Object.defineProperty(e, a, {
    value: t,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : e[a] = t, e;
}
function kt() {
  return kt = Object.assign ? Object.assign.bind() : function(e) {
    for (var a = 1; a < arguments.length; a++) {
      var t = arguments[a];
      for (var l in t) ({}).hasOwnProperty.call(t, l) && (e[l] = t[l]);
    }
    return e;
  }, kt.apply(null, arguments);
}
function Gl(e, a) {
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
    a % 2 ? Gl(Object(t), !0).forEach(function(l) {
      Xn(e, l, t[l]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : Gl(Object(t)).forEach(function(l) {
      Object.defineProperty(e, l, Object.getOwnPropertyDescriptor(t, l));
    });
  }
  return e;
}
function Jn(e, a) {
  if (e == null) return {};
  var t, l, o = Zn(e, a);
  if (Object.getOwnPropertySymbols) {
    var d = Object.getOwnPropertySymbols(e);
    for (l = 0; l < d.length; l++) t = d[l], a.indexOf(t) === -1 && {}.propertyIsEnumerable.call(e, t) && (o[t] = e[t]);
  }
  return o;
}
function Zn(e, a) {
  if (e == null) return {};
  var t = {};
  for (var l in e) if ({}.hasOwnProperty.call(e, l)) {
    if (a.indexOf(l) !== -1) continue;
    t[l] = e[l];
  }
  return t;
}
function Qn(e, a) {
  if (typeof e != "object" || !e) return e;
  var t = e[Symbol.toPrimitive];
  if (t !== void 0) {
    var l = t.call(e, a);
    if (typeof l != "object") return l;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (a === "string" ? String : Number)(e);
}
function _n(e) {
  var a = Qn(e, "string");
  return typeof a == "symbol" ? a : a + "";
}
function pl(e) {
  "@babel/helpers - typeof";
  return pl = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(a) {
    return typeof a;
  } : function(a) {
    return a && typeof Symbol == "function" && a.constructor === Symbol && a !== Symbol.prototype ? "symbol" : typeof a;
  }, pl(e);
}
var es = "1.15.7";
function yt(e) {
  if (typeof window < "u" && window.navigator)
    return !!/* @__PURE__ */ navigator.userAgent.match(e);
}
var Vt = yt(/(?:Trident.*rv[ :]?11\.|msie|iemobile|Windows Phone)/i), ka = yt(/Edge/i), Kl = yt(/firefox/i), ca = yt(/safari/i) && !yt(/chrome/i) && !yt(/android/i), Tl = yt(/iP(ad|od|hone)/i), $o = yt(/chrome/i) && yt(/android/i), xo = {
  capture: !1,
  passive: !1
};
function Ce(e, a, t) {
  e.addEventListener(a, t, !Vt && xo);
}
function $e(e, a, t) {
  e.removeEventListener(a, t, !Vt && xo);
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
function Co(e) {
  return e.host && e !== document && e.host.nodeType && e.host !== e ? e.host : e.parentNode;
}
function dt(e, a, t, l) {
  if (e) {
    t = t || document;
    do {
      if (a != null && (a[0] === ">" ? e.parentNode === t && Ma(e, a) : Ma(e, a)) || l && e === t)
        return e;
      if (e === t) break;
    } while (e = Co(e));
  }
  return null;
}
var Hl = /\s+/g;
function _e(e, a, t) {
  if (e && a)
    if (e.classList)
      e.classList[t ? "add" : "remove"](a);
    else {
      var l = (" " + e.className + " ").replace(Hl, " ").replace(" " + a + " ", " ");
      e.className = (l + (t ? " " + a : "")).replace(Hl, " ");
    }
}
function be(e, a, t) {
  var l = e && e.style;
  if (l) {
    if (t === void 0)
      return document.defaultView && document.defaultView.getComputedStyle ? t = document.defaultView.getComputedStyle(e, "") : e.currentStyle && (t = e.currentStyle), a === void 0 ? t : t[a];
    !(a in l) && a.indexOf("webkit") === -1 && (a = "-webkit-" + a), l[a] = t + (typeof t == "string" ? "" : "px");
  }
}
function Qt(e, a) {
  var t = "";
  if (typeof e == "string")
    t = e;
  else
    do {
      var l = be(e, "transform");
      l && l !== "none" && (t = l + " " + t);
    } while (!a && (e = e.parentNode));
  var o = window.DOMMatrix || window.WebKitCSSMatrix || window.CSSMatrix || window.MSCSSMatrix;
  return o && new o(t);
}
function So(e, a, t) {
  if (e) {
    var l = e.getElementsByTagName(a), o = 0, d = l.length;
    if (t)
      for (; o < d; o++)
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
    var d, f, m, r, i, u, p;
    if (e !== window && e.parentNode && e !== mt() ? (d = e.getBoundingClientRect(), f = d.top, m = d.left, r = d.bottom, i = d.right, u = d.height, p = d.width) : (f = 0, m = 0, r = window.innerHeight, i = window.innerWidth, u = window.innerHeight, p = window.innerWidth), (a || t) && e !== window && (o = o || e.parentNode, !Vt))
      do
        if (o && o.getBoundingClientRect && (be(o, "transform") !== "none" || t && be(o, "position") !== "static")) {
          var w = o.getBoundingClientRect();
          f -= w.top + parseInt(be(o, "border-top-width")), m -= w.left + parseInt(be(o, "border-left-width")), r = f + d.height, i = m + d.width;
          break;
        }
      while (o = o.parentNode);
    if (l && e !== window) {
      var v = Qt(o || e), b = v && v.a, k = v && v.d;
      v && (f /= k, m /= b, p /= b, u /= k, r = f + u, i = m + p);
    }
    return {
      top: f,
      left: m,
      bottom: r,
      right: i,
      width: p,
      height: u
    };
  }
}
function Yl(e, a, t) {
  for (var l = Tt(e, !0), o = Fe(e)[a]; l; ) {
    var d = Fe(l)[t], f = void 0;
    if (f = o >= d, !f) return l;
    if (l === mt()) break;
    l = Tt(l, !1);
  }
  return !1;
}
function ea(e, a, t, l) {
  for (var o = 0, d = 0, f = e.children; d < f.length; ) {
    if (f[d].style.display !== "none" && f[d] !== he.ghost && (l || f[d] !== he.dragged) && dt(f[d], t.draggable, e, !1)) {
      if (o === a)
        return f[d];
      o++;
    }
    d++;
  }
  return null;
}
function Il(e, a) {
  for (var t = e.lastElementChild; t && (t === he.ghost || be(t, "display") === "none" || a && !Ma(t, a)); )
    t = t.previousElementSibling;
  return t || null;
}
function lt(e, a) {
  var t = 0;
  if (!e || !e.parentNode)
    return -1;
  for (; e = e.previousElementSibling; )
    e.nodeName.toUpperCase() !== "TEMPLATE" && e !== he.clone && (!a || Ma(e, a)) && t++;
  return t;
}
function Xl(e) {
  var a = 0, t = 0, l = mt();
  if (e)
    do {
      var o = Qt(e), d = o.a, f = o.d;
      a += e.scrollLeft * d, t += e.scrollTop * f;
    } while (e !== l && (e = e.parentNode));
  return [a, t];
}
function ts(e, a) {
  for (var t in e)
    if (e.hasOwnProperty(t)) {
      for (var l in a)
        if (a.hasOwnProperty(l) && a[l] === e[t][l]) return Number(t);
    }
  return -1;
}
function Tt(e, a) {
  if (!e || !e.getBoundingClientRect) return mt();
  var t = e, l = !1;
  do
    if (t.clientWidth < t.scrollWidth || t.clientHeight < t.scrollHeight) {
      var o = be(t);
      if (t.clientWidth < t.scrollWidth && (o.overflowX == "auto" || o.overflowX == "scroll") || t.clientHeight < t.scrollHeight && (o.overflowY == "auto" || o.overflowY == "scroll")) {
        if (!t.getBoundingClientRect || t === document.body) return mt();
        if (l || a) return t;
        l = !0;
      }
    }
  while (t = t.parentNode);
  return mt();
}
function as(e, a) {
  if (e && a)
    for (var t in a)
      a.hasOwnProperty(t) && (e[t] = a[t]);
  return e;
}
function al(e, a) {
  return Math.round(e.top) === Math.round(a.top) && Math.round(e.left) === Math.round(a.left) && Math.round(e.height) === Math.round(a.height) && Math.round(e.width) === Math.round(a.width);
}
var va;
function To(e, a) {
  return function() {
    if (!va) {
      var t = arguments, l = this;
      t.length === 1 ? e.call(l, t[0]) : e.apply(l, t), va = setTimeout(function() {
        va = void 0;
      }, a);
    }
  };
}
function ls() {
  clearTimeout(va), va = void 0;
}
function Io(e, a, t) {
  e.scrollLeft += a, e.scrollTop += t;
}
function Do(e) {
  var a = window.Polymer, t = window.jQuery || window.Zepto;
  return a && a.dom ? a.dom(e).cloneNode(!0) : t ? t(e).clone(!0)[0] : e.cloneNode(!0);
}
function Uo(e, a, t) {
  var l = {};
  return Array.from(e.children).forEach(function(o) {
    var d, f, m, r;
    if (!(!dt(o, a.draggable, e, !1) || o.animated || o === t)) {
      var i = Fe(o);
      l.left = Math.min((d = l.left) !== null && d !== void 0 ? d : 1 / 0, i.left), l.top = Math.min((f = l.top) !== null && f !== void 0 ? f : 1 / 0, i.top), l.right = Math.max((m = l.right) !== null && m !== void 0 ? m : -1 / 0, i.right), l.bottom = Math.max((r = l.bottom) !== null && r !== void 0 ? r : -1 / 0, i.bottom);
    }
  }), l.width = l.right - l.left, l.height = l.bottom - l.top, l.x = l.left, l.y = l.top, l;
}
var Ze = "Sortable" + (/* @__PURE__ */ new Date()).getTime();
function os() {
  var e = [], a;
  return {
    captureAnimationState: function() {
      if (e = [], !!this.options.animation) {
        var l = [].slice.call(this.el.children);
        l.forEach(function(o) {
          if (!(be(o, "display") === "none" || o === he.ghost)) {
            e.push({
              target: o,
              rect: Fe(o)
            });
            var d = ft({}, e[e.length - 1].rect);
            if (o.thisAnimationDuration) {
              var f = Qt(o, !0);
              f && (d.top -= f.f, d.left -= f.e);
            }
            o.fromRect = d;
          }
        });
      }
    },
    addAnimationState: function(l) {
      e.push(l);
    },
    removeAnimationState: function(l) {
      e.splice(ts(e, {
        target: l
      }), 1);
    },
    animateAll: function(l) {
      var o = this;
      if (!this.options.animation) {
        clearTimeout(a), typeof l == "function" && l();
        return;
      }
      var d = !1, f = 0;
      e.forEach(function(m) {
        var r = 0, i = m.target, u = i.fromRect, p = Fe(i), w = i.prevFromRect, v = i.prevToRect, b = m.rect, k = Qt(i, !0);
        k && (p.top -= k.f, p.left -= k.e), i.toRect = p, i.thisAnimationDuration && al(w, p) && !al(u, p) && // Make sure animatingRect is on line between toRect & fromRect
        (b.top - p.top) / (b.left - p.left) === (u.top - p.top) / (u.left - p.left) && (r = ns(b, w, v, o.options)), al(p, u) || (i.prevFromRect = u, i.prevToRect = p, r || (r = o.options.animation), o.animate(i, b, p, r)), r && (d = !0, f = Math.max(f, r), clearTimeout(i.animationResetTimer), i.animationResetTimer = setTimeout(function() {
          i.animationTime = 0, i.prevFromRect = null, i.fromRect = null, i.prevToRect = null, i.thisAnimationDuration = null;
        }, r), i.thisAnimationDuration = r);
      }), clearTimeout(a), d ? a = setTimeout(function() {
        typeof l == "function" && l();
      }, f) : typeof l == "function" && l(), e = [];
    },
    animate: function(l, o, d, f) {
      if (f) {
        be(l, "transition", ""), be(l, "transform", "");
        var m = Qt(this.el), r = m && m.a, i = m && m.d, u = (o.left - d.left) / (r || 1), p = (o.top - d.top) / (i || 1);
        l.animatingX = !!u, l.animatingY = !!p, be(l, "transform", "translate3d(" + u + "px," + p + "px,0)"), this.forRepaintDummy = is(l), be(l, "transition", "transform " + f + "ms" + (this.options.easing ? " " + this.options.easing : "")), be(l, "transform", "translate3d(0,0,0)"), typeof l.animated == "number" && clearTimeout(l.animated), l.animated = setTimeout(function() {
          be(l, "transition", ""), be(l, "transform", ""), l.animated = !1, l.animatingX = !1, l.animatingY = !1;
        }, f);
      }
    }
  };
}
function is(e) {
  return e.offsetWidth;
}
function ns(e, a, t, l) {
  return Math.sqrt(Math.pow(a.top - e.top, 2) + Math.pow(a.left - e.left, 2)) / Math.sqrt(Math.pow(a.top - t.top, 2) + Math.pow(a.left - t.left, 2)) * l.animation;
}
var Kt = [], ll = {
  initializeByDefault: !0
}, wa = {
  mount: function(a) {
    for (var t in ll)
      ll.hasOwnProperty(t) && !(t in a) && (a[t] = ll[t]);
    Kt.forEach(function(l) {
      if (l.pluginName === a.pluginName)
        throw "Sortable: Cannot mount plugin ".concat(a.pluginName, " more than once");
    }), Kt.push(a);
  },
  pluginEvent: function(a, t, l) {
    var o = this;
    this.eventCanceled = !1, l.cancel = function() {
      o.eventCanceled = !0;
    };
    var d = a + "Global";
    Kt.forEach(function(f) {
      t[f.pluginName] && (t[f.pluginName][d] && t[f.pluginName][d](ft({
        sortable: t
      }, l)), t.options[f.pluginName] && t[f.pluginName][a] && t[f.pluginName][a](ft({
        sortable: t
      }, l)));
    });
  },
  initializePlugins: function(a, t, l, o) {
    Kt.forEach(function(m) {
      var r = m.pluginName;
      if (!(!a.options[r] && !m.initializeByDefault)) {
        var i = new m(a, t, a.options);
        i.sortable = a, i.options = a.options, a[r] = i, kt(l, i.defaults);
      }
    });
    for (var d in a.options)
      if (a.options.hasOwnProperty(d)) {
        var f = this.modifyOption(a, d, a.options[d]);
        typeof f < "u" && (a.options[d] = f);
      }
  },
  getEventProperties: function(a, t) {
    var l = {};
    return Kt.forEach(function(o) {
      typeof o.eventProperties == "function" && kt(l, o.eventProperties.call(t[o.pluginName], a));
    }), l;
  },
  modifyOption: function(a, t, l) {
    var o;
    return Kt.forEach(function(d) {
      a[d.pluginName] && d.optionListeners && typeof d.optionListeners[t] == "function" && (o = d.optionListeners[t].call(a[d.pluginName], l));
    }), o;
  }
};
function ss(e) {
  var a = e.sortable, t = e.rootEl, l = e.name, o = e.targetEl, d = e.cloneEl, f = e.toEl, m = e.fromEl, r = e.oldIndex, i = e.newIndex, u = e.oldDraggableIndex, p = e.newDraggableIndex, w = e.originalEvent, v = e.putSortable, b = e.extraEventProperties;
  if (a = a || t && t[Ze], !!a) {
    var k, D = a.options, x = "on" + l.charAt(0).toUpperCase() + l.substr(1);
    window.CustomEvent && !Vt && !ka ? k = new CustomEvent(l, {
      bubbles: !0,
      cancelable: !0
    }) : (k = document.createEvent("Event"), k.initEvent(l, !0, !0)), k.to = f || t, k.from = m || t, k.item = o || t, k.clone = d, k.oldIndex = r, k.newIndex = i, k.oldDraggableIndex = u, k.newDraggableIndex = p, k.originalEvent = w, k.pullMode = v ? v.lastPutMode : void 0;
    var C = ft(ft({}, b), wa.getEventProperties(l, a));
    for (var R in C)
      k[R] = C[R];
    t && t.dispatchEvent(k), D[x] && D[x].call(a, k);
  }
}
var rs = ["evt"], Xe = function(a, t) {
  var l = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, o = l.evt, d = Jn(l, rs);
  wa.pluginEvent.bind(he)(a, t, ft({
    dragEl: ae,
    parentEl: Pe,
    ghostEl: ge,
    rootEl: Ue,
    nextEl: Nt,
    lastDownEl: Aa,
    cloneEl: Ae,
    cloneHidden: St,
    dragStarted: ia,
    putSortable: qe,
    activeSortable: he.active,
    originalEvent: o,
    oldIndex: Zt,
    oldDraggableIndex: ma,
    newIndex: et,
    newDraggableIndex: Ct,
    hideGhostForTarget: Po,
    unhideGhostForTarget: Ro,
    cloneNowHidden: function() {
      St = !0;
    },
    cloneNowShown: function() {
      St = !1;
    },
    dispatchSortableEvent: function(m) {
      He({
        sortable: t,
        name: m,
        originalEvent: o
      });
    }
  }, d));
};
function He(e) {
  ss(ft({
    putSortable: qe,
    cloneEl: Ae,
    targetEl: ae,
    rootEl: Ue,
    oldIndex: Zt,
    oldDraggableIndex: ma,
    newIndex: et,
    newDraggableIndex: Ct
  }, e));
}
var ae, Pe, ge, Ue, Nt, Aa, Ae, St, Zt, et, ma, Ct, Ta, qe, Xt = !1, Fa = !1, La = [], Ot, rt, ol, il, Jl, Zl, ia, Ht, fa, pa = !1, Ia = !1, Oa, Ge, nl = [], bl = !1, Ba = [], Ga = typeof document < "u", Da = Tl, Ql = ka || Vt ? "cssFloat" : "float", ds = Ga && !$o && !Tl && "draggable" in document.createElement("div"), Eo = (function() {
  if (Ga) {
    if (Vt)
      return !1;
    var e = document.createElement("x");
    return e.style.cssText = "pointer-events:auto", e.style.pointerEvents === "auto";
  }
})(), Ao = function(a, t) {
  var l = be(a), o = parseInt(l.width) - parseInt(l.paddingLeft) - parseInt(l.paddingRight) - parseInt(l.borderLeftWidth) - parseInt(l.borderRightWidth), d = ea(a, 0, t), f = ea(a, 1, t), m = d && be(d), r = f && be(f), i = m && parseInt(m.marginLeft) + parseInt(m.marginRight) + Fe(d).width, u = r && parseInt(r.marginLeft) + parseInt(r.marginRight) + Fe(f).width;
  if (l.display === "flex")
    return l.flexDirection === "column" || l.flexDirection === "column-reverse" ? "vertical" : "horizontal";
  if (l.display === "grid")
    return l.gridTemplateColumns.split(" ").length <= 1 ? "vertical" : "horizontal";
  if (d && m.float && m.float !== "none") {
    var p = m.float === "left" ? "left" : "right";
    return f && (r.clear === "both" || r.clear === p) ? "vertical" : "horizontal";
  }
  return d && (m.display === "block" || m.display === "flex" || m.display === "table" || m.display === "grid" || i >= o && l[Ql] === "none" || f && l[Ql] === "none" && i + u > o) ? "vertical" : "horizontal";
}, us = function(a, t, l) {
  var o = l ? a.left : a.top, d = l ? a.right : a.bottom, f = l ? a.width : a.height, m = l ? t.left : t.top, r = l ? t.right : t.bottom, i = l ? t.width : t.height;
  return o === m || d === r || o + f / 2 === m + i / 2;
}, cs = function(a, t) {
  var l;
  return La.some(function(o) {
    var d = o[Ze].options.emptyInsertThreshold;
    if (!(!d || Il(o))) {
      var f = Fe(o), m = a >= f.left - d && a <= f.right + d, r = t >= f.top - d && t <= f.bottom + d;
      if (m && r)
        return l = o;
    }
  }), l;
}, Oo = function(a) {
  function t(d, f) {
    return function(m, r, i, u) {
      var p = m.options.group.name && r.options.group.name && m.options.group.name === r.options.group.name;
      if (d == null && (f || p))
        return !0;
      if (d == null || d === !1)
        return !1;
      if (f && d === "clone")
        return d;
      if (typeof d == "function")
        return t(d(m, r, i, u), f)(m, r, i, u);
      var w = (f ? m : r).options.group.name;
      return d === !0 || typeof d == "string" && d === w || d.join && d.indexOf(w) > -1;
    };
  }
  var l = {}, o = a.group;
  (!o || pl(o) != "object") && (o = {
    name: o
  }), l.name = o.name, l.checkPull = t(o.pull, !0), l.checkPut = t(o.put), l.revertClone = o.revertClone, a.group = l;
}, Po = function() {
  !Eo && ge && be(ge, "display", "none");
}, Ro = function() {
  !Eo && ge && be(ge, "display", "");
};
Ga && !$o && document.addEventListener("click", function(e) {
  if (Fa)
    return e.preventDefault(), e.stopPropagation && e.stopPropagation(), e.stopImmediatePropagation && e.stopImmediatePropagation(), Fa = !1, !1;
}, !0);
var Pt = function(a) {
  if (ae) {
    a = a.touches ? a.touches[0] : a;
    var t = cs(a.clientX, a.clientY);
    if (t) {
      var l = {};
      for (var o in a)
        a.hasOwnProperty(o) && (l[o] = a[o]);
      l.target = l.rootEl = t, l.preventDefault = void 0, l.stopPropagation = void 0, t[Ze]._onDragOver(l);
    }
  }
}, vs = function(a) {
  ae && ae.parentNode[Ze]._isOutsideThisEl(a.target);
};
function he(e, a) {
  if (!(e && e.nodeType && e.nodeType === 1))
    throw "Sortable: `el` must be an HTMLElement, not ".concat({}.toString.call(e));
  this.el = e, this.options = a = kt({}, a), e[Ze] = this;
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
      return Ao(e, this.options);
    },
    ghostClass: "sortable-ghost",
    chosenClass: "sortable-chosen",
    dragClass: "sortable-drag",
    ignore: "a, img",
    filter: null,
    preventOnFilter: !0,
    animation: 0,
    easing: null,
    setData: function(f, m) {
      f.setData("Text", m.textContent);
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
    supportPointer: he.supportPointer !== !1 && "PointerEvent" in window && (!ca || Tl),
    emptyInsertThreshold: 5
  };
  wa.initializePlugins(this, e, t);
  for (var l in t)
    !(l in a) && (a[l] = t[l]);
  Oo(a);
  for (var o in this)
    o.charAt(0) === "_" && typeof this[o] == "function" && (this[o] = this[o].bind(this));
  this.nativeDraggable = a.forceFallback ? !1 : ds, this.nativeDraggable && (this.options.touchStartThreshold = 1), a.supportPointer ? Ce(e, "pointerdown", this._onTapStart) : (Ce(e, "mousedown", this._onTapStart), Ce(e, "touchstart", this._onTapStart)), this.nativeDraggable && (Ce(e, "dragover", this), Ce(e, "dragenter", this)), La.push(this.el), a.store && a.store.get && this.sort(a.store.get(this) || []), kt(this, os());
}
he.prototype = /** @lends Sortable.prototype */
{
  constructor: he,
  _isOutsideThisEl: function(a) {
    !this.el.contains(a) && a !== this.el && (Ht = null);
  },
  _getDirection: function(a, t) {
    return typeof this.options.direction == "function" ? this.options.direction.call(this, a, t, ae) : this.options.direction;
  },
  _onTapStart: function(a) {
    if (a.cancelable) {
      var t = this, l = this.el, o = this.options, d = o.preventOnFilter, f = a.type, m = a.touches && a.touches[0] || a.pointerType && a.pointerType === "touch" && a, r = (m || a).target, i = a.target.shadowRoot && (a.path && a.path[0] || a.composedPath && a.composedPath()[0]) || r, u = o.filter;
      if (ks(l), !ae && !(/mousedown|pointerdown/.test(f) && a.button !== 0 || o.disabled) && !i.isContentEditable && !(!this.nativeDraggable && ca && r && r.tagName.toUpperCase() === "SELECT") && (r = dt(r, o.draggable, l, !1), !(r && r.animated) && Aa !== r)) {
        if (Zt = lt(r), ma = lt(r, o.draggable), typeof u == "function") {
          if (u.call(this, a, r, this)) {
            He({
              sortable: t,
              rootEl: i,
              name: "filter",
              targetEl: r,
              toEl: l,
              fromEl: l
            }), Xe("filter", t, {
              evt: a
            }), d && a.preventDefault();
            return;
          }
        } else if (u && (u = u.split(",").some(function(p) {
          if (p = dt(i, p.trim(), l, !1), p)
            return He({
              sortable: t,
              rootEl: p,
              name: "filter",
              targetEl: r,
              fromEl: l,
              toEl: l
            }), Xe("filter", t, {
              evt: a
            }), !0;
        }), u)) {
          d && a.preventDefault();
          return;
        }
        o.handle && !dt(i, o.handle, l, !1) || this._prepareDragStart(a, m, r);
      }
    }
  },
  _prepareDragStart: function(a, t, l) {
    var o = this, d = o.el, f = o.options, m = d.ownerDocument, r;
    if (l && !ae && l.parentNode === d) {
      var i = Fe(l);
      if (Ue = d, ae = l, Pe = ae.parentNode, Nt = ae.nextSibling, Aa = l, Ta = f.group, he.dragged = ae, Ot = {
        target: ae,
        clientX: (t || a).clientX,
        clientY: (t || a).clientY
      }, Jl = Ot.clientX - i.left, Zl = Ot.clientY - i.top, this._lastX = (t || a).clientX, this._lastY = (t || a).clientY, ae.style["will-change"] = "all", r = function() {
        if (Xe("delayEnded", o, {
          evt: a
        }), he.eventCanceled) {
          o._onDrop();
          return;
        }
        o._disableDelayedDragEvents(), !Kl && o.nativeDraggable && (ae.draggable = !0), o._triggerDragStart(a, t), He({
          sortable: o,
          name: "choose",
          originalEvent: a
        }), _e(ae, f.chosenClass, !0);
      }, f.ignore.split(",").forEach(function(u) {
        So(ae, u.trim(), sl);
      }), Ce(m, "dragover", Pt), Ce(m, "mousemove", Pt), Ce(m, "touchmove", Pt), f.supportPointer ? (Ce(m, "pointerup", o._onDrop), !this.nativeDraggable && Ce(m, "pointercancel", o._onDrop)) : (Ce(m, "mouseup", o._onDrop), Ce(m, "touchend", o._onDrop), Ce(m, "touchcancel", o._onDrop)), Kl && this.nativeDraggable && (this.options.touchStartThreshold = 4, ae.draggable = !0), Xe("delayStart", this, {
        evt: a
      }), f.delay && (!f.delayOnTouchOnly || t) && (!this.nativeDraggable || !(ka || Vt))) {
        if (he.eventCanceled) {
          this._onDrop();
          return;
        }
        f.supportPointer ? (Ce(m, "pointerup", o._disableDelayedDrag), Ce(m, "pointercancel", o._disableDelayedDrag)) : (Ce(m, "mouseup", o._disableDelayedDrag), Ce(m, "touchend", o._disableDelayedDrag), Ce(m, "touchcancel", o._disableDelayedDrag)), Ce(m, "mousemove", o._delayedDragTouchMoveHandler), Ce(m, "touchmove", o._delayedDragTouchMoveHandler), f.supportPointer && Ce(m, "pointermove", o._delayedDragTouchMoveHandler), o._dragStartTimer = setTimeout(r, f.delay);
      } else
        r();
    }
  },
  _delayedDragTouchMoveHandler: function(a) {
    var t = a.touches ? a.touches[0] : a;
    Math.max(Math.abs(t.clientX - this._lastX), Math.abs(t.clientY - this._lastY)) >= Math.floor(this.options.touchStartThreshold / (this.nativeDraggable && window.devicePixelRatio || 1)) && this._disableDelayedDrag();
  },
  _disableDelayedDrag: function() {
    ae && sl(ae), clearTimeout(this._dragStartTimer), this._disableDelayedDragEvents();
  },
  _disableDelayedDragEvents: function() {
    var a = this.el.ownerDocument;
    $e(a, "mouseup", this._disableDelayedDrag), $e(a, "touchend", this._disableDelayedDrag), $e(a, "touchcancel", this._disableDelayedDrag), $e(a, "pointerup", this._disableDelayedDrag), $e(a, "pointercancel", this._disableDelayedDrag), $e(a, "mousemove", this._delayedDragTouchMoveHandler), $e(a, "touchmove", this._delayedDragTouchMoveHandler), $e(a, "pointermove", this._delayedDragTouchMoveHandler);
  },
  _triggerDragStart: function(a, t) {
    t = t || a.pointerType == "touch" && a, !this.nativeDraggable || t ? this.options.supportPointer ? Ce(document, "pointermove", this._onTouchMove) : t ? Ce(document, "touchmove", this._onTouchMove) : Ce(document, "mousemove", this._onTouchMove) : (Ce(ae, "dragend", this), Ce(Ue, "dragstart", this._onDragStart));
    try {
      document.selection ? Pa(function() {
        document.selection.empty();
      }) : window.getSelection().removeAllRanges();
    } catch {
    }
  },
  _dragStarted: function(a, t) {
    if (Xt = !1, Ue && ae) {
      Xe("dragStarted", this, {
        evt: t
      }), this.nativeDraggable && Ce(document, "dragover", vs);
      var l = this.options;
      !a && _e(ae, l.dragClass, !1), _e(ae, l.ghostClass, !0), he.active = this, a && this._appendGhost(), He({
        sortable: this,
        name: "start",
        originalEvent: t
      });
    } else
      this._nulling();
  },
  _emulateDragOver: function() {
    if (rt) {
      this._lastX = rt.clientX, this._lastY = rt.clientY, Po();
      for (var a = document.elementFromPoint(rt.clientX, rt.clientY), t = a; a && a.shadowRoot && (a = a.shadowRoot.elementFromPoint(rt.clientX, rt.clientY), a !== t); )
        t = a;
      if (ae.parentNode[Ze]._isOutsideThisEl(a), t)
        do {
          if (t[Ze]) {
            var l = void 0;
            if (l = t[Ze]._onDragOver({
              clientX: rt.clientX,
              clientY: rt.clientY,
              target: a,
              rootEl: t
            }), l && !this.options.dragoverBubble)
              break;
          }
          a = t;
        } while (t = Co(t));
      Ro();
    }
  },
  _onTouchMove: function(a) {
    if (Ot) {
      var t = this.options, l = t.fallbackTolerance, o = t.fallbackOffset, d = a.touches ? a.touches[0] : a, f = ge && Qt(ge, !0), m = ge && f && f.a, r = ge && f && f.d, i = Da && Ge && Xl(Ge), u = (d.clientX - Ot.clientX + o.x) / (m || 1) + (i ? i[0] - nl[0] : 0) / (m || 1), p = (d.clientY - Ot.clientY + o.y) / (r || 1) + (i ? i[1] - nl[1] : 0) / (r || 1);
      if (!he.active && !Xt) {
        if (l && Math.max(Math.abs(d.clientX - this._lastX), Math.abs(d.clientY - this._lastY)) < l)
          return;
        this._onDragStart(a, !0);
      }
      if (ge) {
        f ? (f.e += u - (ol || 0), f.f += p - (il || 0)) : f = {
          a: 1,
          b: 0,
          c: 0,
          d: 1,
          e: u,
          f: p
        };
        var w = "matrix(".concat(f.a, ",").concat(f.b, ",").concat(f.c, ",").concat(f.d, ",").concat(f.e, ",").concat(f.f, ")");
        be(ge, "webkitTransform", w), be(ge, "mozTransform", w), be(ge, "msTransform", w), be(ge, "transform", w), ol = u, il = p, rt = d;
      }
      a.cancelable && a.preventDefault();
    }
  },
  _appendGhost: function() {
    if (!ge) {
      var a = this.options.fallbackOnBody ? document.body : Ue, t = Fe(ae, !0, Da, !0, a), l = this.options;
      if (Da) {
        for (Ge = a; be(Ge, "position") === "static" && be(Ge, "transform") === "none" && Ge !== document; )
          Ge = Ge.parentNode;
        Ge !== document.body && Ge !== document.documentElement ? (Ge === document && (Ge = mt()), t.top += Ge.scrollTop, t.left += Ge.scrollLeft) : Ge = mt(), nl = Xl(Ge);
      }
      ge = ae.cloneNode(!0), _e(ge, l.ghostClass, !1), _e(ge, l.fallbackClass, !0), _e(ge, l.dragClass, !0), be(ge, "transition", ""), be(ge, "transform", ""), be(ge, "box-sizing", "border-box"), be(ge, "margin", 0), be(ge, "top", t.top), be(ge, "left", t.left), be(ge, "width", t.width), be(ge, "height", t.height), be(ge, "opacity", "0.8"), be(ge, "position", Da ? "absolute" : "fixed"), be(ge, "zIndex", "100000"), be(ge, "pointerEvents", "none"), he.ghost = ge, a.appendChild(ge), be(ge, "transform-origin", Jl / parseInt(ge.style.width) * 100 + "% " + Zl / parseInt(ge.style.height) * 100 + "%");
    }
  },
  _onDragStart: function(a, t) {
    var l = this, o = a.dataTransfer, d = l.options;
    if (Xe("dragStart", this, {
      evt: a
    }), he.eventCanceled) {
      this._onDrop();
      return;
    }
    Xe("setupClone", this), he.eventCanceled || (Ae = Do(ae), Ae.removeAttribute("id"), Ae.draggable = !1, Ae.style["will-change"] = "", this._hideClone(), _e(Ae, this.options.chosenClass, !1), he.clone = Ae), l.cloneId = Pa(function() {
      Xe("clone", l), !he.eventCanceled && (l.options.removeCloneOnHide || Ue.insertBefore(Ae, ae), l._hideClone(), He({
        sortable: l,
        name: "clone"
      }));
    }), !t && _e(ae, d.dragClass, !0), t ? (Fa = !0, l._loopId = setInterval(l._emulateDragOver, 50)) : ($e(document, "mouseup", l._onDrop), $e(document, "touchend", l._onDrop), $e(document, "touchcancel", l._onDrop), o && (o.effectAllowed = "move", d.setData && d.setData.call(l, o, ae)), Ce(document, "drop", l), be(ae, "transform", "translateZ(0)")), Xt = !0, l._dragStartId = Pa(l._dragStarted.bind(l, t, a)), Ce(document, "selectstart", l), ia = !0, window.getSelection().removeAllRanges(), ca && be(document.body, "user-select", "none");
  },
  // Returns true - if no further action is needed (either inserted or another condition)
  _onDragOver: function(a) {
    var t = this.el, l = a.target, o, d, f, m = this.options, r = m.group, i = he.active, u = Ta === r, p = m.sort, w = qe || i, v, b = this, k = !1;
    if (bl) return;
    function D(de, A) {
      Xe(de, b, ft({
        evt: a,
        isOwner: u,
        axis: v ? "vertical" : "horizontal",
        revert: f,
        dragRect: o,
        targetRect: d,
        canSort: p,
        fromSortable: w,
        target: l,
        completed: C,
        onMove: function(F, ce) {
          return Ua(Ue, t, ae, o, F, Fe(F), a, ce);
        },
        changed: R
      }, A));
    }
    function x() {
      D("dragOverAnimationCapture"), b.captureAnimationState(), b !== w && w.captureAnimationState();
    }
    function C(de) {
      return D("dragOverCompleted", {
        insertion: de
      }), de && (u ? i._hideClone() : i._showClone(b), b !== w && (_e(ae, qe ? qe.options.ghostClass : i.options.ghostClass, !1), _e(ae, m.ghostClass, !0)), qe !== b && b !== he.active ? qe = b : b === he.active && qe && (qe = null), w === b && (b._ignoreWhileAnimating = l), b.animateAll(function() {
        D("dragOverAnimationComplete"), b._ignoreWhileAnimating = null;
      }), b !== w && (w.animateAll(), w._ignoreWhileAnimating = null)), (l === ae && !ae.animated || l === t && !l.animated) && (Ht = null), !m.dragoverBubble && !a.rootEl && l !== document && (ae.parentNode[Ze]._isOutsideThisEl(a.target), !de && Pt(a)), !m.dragoverBubble && a.stopPropagation && a.stopPropagation(), k = !0;
    }
    function R() {
      et = lt(ae), Ct = lt(ae, m.draggable), He({
        sortable: b,
        name: "change",
        toEl: t,
        newIndex: et,
        newDraggableIndex: Ct,
        originalEvent: a
      });
    }
    if (a.preventDefault !== void 0 && a.cancelable && a.preventDefault(), l = dt(l, m.draggable, t, !0), D("dragOver"), he.eventCanceled) return k;
    if (ae.contains(a.target) || l.animated && l.animatingX && l.animatingY || b._ignoreWhileAnimating === l)
      return C(!1);
    if (Fa = !1, i && !m.disabled && (u ? p || (f = Pe !== Ue) : qe === this || (this.lastPutMode = Ta.checkPull(this, i, ae, a)) && r.checkPut(this, i, ae, a))) {
      if (v = this._getDirection(a, l) === "vertical", o = Fe(ae), D("dragOverValid"), he.eventCanceled) return k;
      if (f)
        return Pe = Ue, x(), this._hideClone(), D("revert"), he.eventCanceled || (Nt ? Ue.insertBefore(ae, Nt) : Ue.appendChild(ae)), C(!0);
      var M = Il(t, m.draggable);
      if (!M || bs(a, v, this) && !M.animated) {
        if (M === ae)
          return C(!1);
        if (M && t === a.target && (l = M), l && (d = Fe(l)), Ua(Ue, t, ae, o, l, d, a, !!l) !== !1)
          return x(), M && M.nextSibling ? t.insertBefore(ae, M.nextSibling) : t.appendChild(ae), Pe = t, R(), C(!0);
      } else if (M && ps(a, v, this)) {
        var L = ea(t, 0, m, !0);
        if (L === ae)
          return C(!1);
        if (l = L, d = Fe(l), Ua(Ue, t, ae, o, l, d, a, !1) !== !1)
          return x(), t.insertBefore(ae, L), Pe = t, R(), C(!0);
      } else if (l.parentNode === t) {
        d = Fe(l);
        var le = 0, te, ve = ae.parentNode !== t, J = !us(ae.animated && ae.toRect || o, l.animated && l.toRect || d, v), ue = v ? "top" : "left", pe = Yl(l, "top", "top") || Yl(ae, "top", "top"), _ = pe ? pe.scrollTop : void 0;
        Ht !== l && (te = d[ue], pa = !1, Ia = !J && m.invertSwap || ve), le = hs(a, l, d, v, J ? 1 : m.swapThreshold, m.invertedSwapThreshold == null ? m.swapThreshold : m.invertedSwapThreshold, Ia, Ht === l);
        var I;
        if (le !== 0) {
          var U = lt(ae);
          do
            U -= le, I = Pe.children[U];
          while (I && (be(I, "display") === "none" || I === ge));
        }
        if (le === 0 || I === l)
          return C(!1);
        Ht = l, fa = le;
        var $ = l.nextElementSibling, j = !1;
        j = le === 1;
        var X = Ua(Ue, t, ae, o, l, d, a, j);
        if (X !== !1)
          return (X === 1 || X === -1) && (j = X === 1), bl = !0, setTimeout(fs, 30), x(), j && !$ ? t.appendChild(ae) : l.parentNode.insertBefore(ae, j ? $ : l), pe && Io(pe, 0, _ - pe.scrollTop), Pe = ae.parentNode, te !== void 0 && !Ia && (Oa = Math.abs(te - Fe(l)[ue])), R(), C(!0);
      }
      if (t.contains(ae))
        return C(!1);
    }
    return !1;
  },
  _ignoreWhileAnimating: null,
  _offMoveEvents: function() {
    $e(document, "mousemove", this._onTouchMove), $e(document, "touchmove", this._onTouchMove), $e(document, "pointermove", this._onTouchMove), $e(document, "dragover", Pt), $e(document, "mousemove", Pt), $e(document, "touchmove", Pt);
  },
  _offUpEvents: function() {
    var a = this.el.ownerDocument;
    $e(a, "mouseup", this._onDrop), $e(a, "touchend", this._onDrop), $e(a, "pointerup", this._onDrop), $e(a, "pointercancel", this._onDrop), $e(a, "touchcancel", this._onDrop), $e(document, "selectstart", this);
  },
  _onDrop: function(a) {
    var t = this.el, l = this.options;
    if (et = lt(ae), Ct = lt(ae, l.draggable), Xe("drop", this, {
      evt: a
    }), Pe = ae && ae.parentNode, et = lt(ae), Ct = lt(ae, l.draggable), he.eventCanceled) {
      this._nulling();
      return;
    }
    Xt = !1, Ia = !1, pa = !1, clearInterval(this._loopId), clearTimeout(this._dragStartTimer), hl(this.cloneId), hl(this._dragStartId), this.nativeDraggable && ($e(document, "drop", this), $e(t, "dragstart", this._onDragStart)), this._offMoveEvents(), this._offUpEvents(), ca && be(document.body, "user-select", ""), be(ae, "transform", ""), a && (ia && (a.cancelable && a.preventDefault(), !l.dropBubble && a.stopPropagation()), ge && ge.parentNode && ge.parentNode.removeChild(ge), (Ue === Pe || qe && qe.lastPutMode !== "clone") && Ae && Ae.parentNode && Ae.parentNode.removeChild(Ae), ae && (this.nativeDraggable && $e(ae, "dragend", this), sl(ae), ae.style["will-change"] = "", ia && !Xt && _e(ae, qe ? qe.options.ghostClass : this.options.ghostClass, !1), _e(ae, this.options.chosenClass, !1), He({
      sortable: this,
      name: "unchoose",
      toEl: Pe,
      newIndex: null,
      newDraggableIndex: null,
      originalEvent: a
    }), Ue !== Pe ? (et >= 0 && (He({
      rootEl: Pe,
      name: "add",
      toEl: Pe,
      fromEl: Ue,
      originalEvent: a
    }), He({
      sortable: this,
      name: "remove",
      toEl: Pe,
      originalEvent: a
    }), He({
      rootEl: Pe,
      name: "sort",
      toEl: Pe,
      fromEl: Ue,
      originalEvent: a
    }), He({
      sortable: this,
      name: "sort",
      toEl: Pe,
      originalEvent: a
    })), qe && qe.save()) : et !== Zt && et >= 0 && (He({
      sortable: this,
      name: "update",
      toEl: Pe,
      originalEvent: a
    }), He({
      sortable: this,
      name: "sort",
      toEl: Pe,
      originalEvent: a
    })), he.active && ((et == null || et === -1) && (et = Zt, Ct = ma), He({
      sortable: this,
      name: "end",
      toEl: Pe,
      originalEvent: a
    }), this.save()))), this._nulling();
  },
  _nulling: function() {
    Xe("nulling", this), Ue = ae = Pe = ge = Nt = Ae = Aa = St = Ot = rt = ia = et = Ct = Zt = ma = Ht = fa = qe = Ta = he.dragged = he.ghost = he.clone = he.active = null;
    var a = this.el;
    Ba.forEach(function(t) {
      a.contains(t) && (t.checked = !0);
    }), Ba.length = ol = il = 0;
  },
  handleEvent: function(a) {
    switch (a.type) {
      case "drop":
      case "dragend":
        this._onDrop(a);
        break;
      case "dragenter":
      case "dragover":
        ae && (this._onDragOver(a), ms(a));
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
    for (var a = [], t, l = this.el.children, o = 0, d = l.length, f = this.options; o < d; o++)
      t = l[o], dt(t, f.draggable, this.el, !1) && a.push(t.getAttribute(f.dataIdAttr) || ys(t));
    return a;
  },
  /**
   * Sorts the elements according to the array.
   * @param  {String[]}  order  order of the items
   */
  sort: function(a, t) {
    var l = {}, o = this.el;
    this.toArray().forEach(function(d, f) {
      var m = o.children[f];
      dt(m, this.options.draggable, o, !1) && (l[d] = m);
    }, this), t && this.captureAnimationState(), a.forEach(function(d) {
      l[d] && (o.removeChild(l[d]), o.appendChild(l[d]));
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
    var o = wa.modifyOption(this, a, t);
    typeof o < "u" ? l[a] = o : l[a] = t, a === "group" && Oo(l);
  },
  /**
   * Destroy
   */
  destroy: function() {
    Xe("destroy", this);
    var a = this.el;
    a[Ze] = null, $e(a, "mousedown", this._onTapStart), $e(a, "touchstart", this._onTapStart), $e(a, "pointerdown", this._onTapStart), this.nativeDraggable && ($e(a, "dragover", this), $e(a, "dragenter", this)), Array.prototype.forEach.call(a.querySelectorAll("[draggable]"), function(t) {
      t.removeAttribute("draggable");
    }), this._onDrop(), this._disableDelayedDragEvents(), La.splice(La.indexOf(this.el), 1), this.el = a = null;
  },
  _hideClone: function() {
    if (!St) {
      if (Xe("hideClone", this), he.eventCanceled) return;
      be(Ae, "display", "none"), this.options.removeCloneOnHide && Ae.parentNode && Ae.parentNode.removeChild(Ae), St = !0;
    }
  },
  _showClone: function(a) {
    if (a.lastPutMode !== "clone") {
      this._hideClone();
      return;
    }
    if (St) {
      if (Xe("showClone", this), he.eventCanceled) return;
      ae.parentNode == Ue && !this.options.group.revertClone ? Ue.insertBefore(Ae, ae) : Nt ? Ue.insertBefore(Ae, Nt) : Ue.appendChild(Ae), this.options.group.revertClone && this.animate(ae, Ae), be(Ae, "display", ""), St = !1;
    }
  }
};
function ms(e) {
  e.dataTransfer && (e.dataTransfer.dropEffect = "move"), e.cancelable && e.preventDefault();
}
function Ua(e, a, t, l, o, d, f, m) {
  var r, i = e[Ze], u = i.options.onMove, p;
  return window.CustomEvent && !Vt && !ka ? r = new CustomEvent("move", {
    bubbles: !0,
    cancelable: !0
  }) : (r = document.createEvent("Event"), r.initEvent("move", !0, !0)), r.to = a, r.from = e, r.dragged = t, r.draggedRect = l, r.related = o || a, r.relatedRect = d || Fe(a), r.willInsertAfter = m, r.originalEvent = f, e.dispatchEvent(r), u && (p = u.call(i, r, f)), p;
}
function sl(e) {
  e.draggable = !1;
}
function fs() {
  bl = !1;
}
function ps(e, a, t) {
  var l = Fe(ea(t.el, 0, t.options, !0)), o = Uo(t.el, t.options, ge), d = 10;
  return a ? e.clientX < o.left - d || e.clientY < l.top && e.clientX < l.right : e.clientY < o.top - d || e.clientY < l.bottom && e.clientX < l.left;
}
function bs(e, a, t) {
  var l = Fe(Il(t.el, t.options.draggable)), o = Uo(t.el, t.options, ge), d = 10;
  return a ? e.clientX > o.right + d || e.clientY > l.bottom && e.clientX > l.left : e.clientY > o.bottom + d || e.clientX > l.right && e.clientY > l.top;
}
function hs(e, a, t, l, o, d, f, m) {
  var r = l ? e.clientY : e.clientX, i = l ? t.height : t.width, u = l ? t.top : t.left, p = l ? t.bottom : t.right, w = !1;
  if (!f) {
    if (m && Oa < i * o) {
      if (!pa && (fa === 1 ? r > u + i * d / 2 : r < p - i * d / 2) && (pa = !0), pa)
        w = !0;
      else if (fa === 1 ? r < u + Oa : r > p - Oa)
        return -fa;
    } else if (r > u + i * (1 - o) / 2 && r < p - i * (1 - o) / 2)
      return gs(a);
  }
  return w = w || f, w && (r < u + i * d / 2 || r > p - i * d / 2) ? r > u + i / 2 ? 1 : -1 : 0;
}
function gs(e) {
  return lt(ae) < lt(e) ? 1 : -1;
}
function ys(e) {
  for (var a = e.tagName + e.className + e.src + e.href + e.textContent, t = a.length, l = 0; t--; )
    l += a.charCodeAt(t);
  return l.toString(36);
}
function ks(e) {
  Ba.length = 0;
  for (var a = e.getElementsByTagName("input"), t = a.length; t--; ) {
    var l = a[t];
    l.checked && Ba.push(l);
  }
}
function Pa(e) {
  return setTimeout(e, 0);
}
function hl(e) {
  return clearTimeout(e);
}
Ga && Ce(document, "touchmove", function(e) {
  (he.active || Xt) && e.cancelable && e.preventDefault();
});
he.utils = {
  on: Ce,
  off: $e,
  css: be,
  find: So,
  is: function(a, t) {
    return !!dt(a, t, a, !1);
  },
  extend: as,
  throttle: To,
  closest: dt,
  toggleClass: _e,
  clone: Do,
  index: lt,
  nextTick: Pa,
  cancelNextTick: hl,
  detectDirection: Ao,
  getChild: ea,
  expando: Ze
};
he.get = function(e) {
  return e[Ze];
};
he.mount = function() {
  for (var e = arguments.length, a = new Array(e), t = 0; t < e; t++)
    a[t] = arguments[t];
  a[0].constructor === Array && (a = a[0]), a.forEach(function(l) {
    if (!l.prototype || !l.prototype.constructor)
      throw "Sortable: Mounted plugin must be a constructor function, not ".concat({}.toString.call(l));
    l.utils && (he.utils = ft(ft({}, he.utils), l.utils)), wa.mount(l);
  });
};
he.create = function(e, a) {
  return new he(e, a);
};
he.version = es;
var Me = [], na, gl, yl = !1, rl, dl, za, sa;
function ws() {
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
      this.sortable.nativeDraggable ? $e(document, "dragover", this._handleAutoScroll) : ($e(document, "pointermove", this._handleFallbackAutoScroll), $e(document, "touchmove", this._handleFallbackAutoScroll), $e(document, "mousemove", this._handleFallbackAutoScroll)), _l(), Ra(), ls();
    },
    nulling: function() {
      za = gl = na = yl = sa = rl = dl = null, Me.length = 0;
    },
    _handleFallbackAutoScroll: function(t) {
      this._handleAutoScroll(t, !0);
    },
    _handleAutoScroll: function(t, l) {
      var o = this, d = (t.touches ? t.touches[0] : t).clientX, f = (t.touches ? t.touches[0] : t).clientY, m = document.elementFromPoint(d, f);
      if (za = t, l || this.options.forceAutoScrollFallback || ka || Vt || ca) {
        ul(t, this.options, m, l);
        var r = Tt(m, !0);
        yl && (!sa || d !== rl || f !== dl) && (sa && _l(), sa = setInterval(function() {
          var i = Tt(document.elementFromPoint(d, f), !0);
          i !== r && (r = i, Ra()), ul(t, o.options, i, l);
        }, 10), rl = d, dl = f);
      } else {
        if (!this.options.bubbleScroll || Tt(m, !0) === mt()) {
          Ra();
          return;
        }
        ul(t, this.options, Tt(m, !1), !1);
      }
    }
  }, kt(e, {
    pluginName: "scroll",
    initializeByDefault: !0
  });
}
function Ra() {
  Me.forEach(function(e) {
    clearInterval(e.pid);
  }), Me = [];
}
function _l() {
  clearInterval(sa);
}
var ul = To(function(e, a, t, l) {
  if (a.scroll) {
    var o = (e.touches ? e.touches[0] : e).clientX, d = (e.touches ? e.touches[0] : e).clientY, f = a.scrollSensitivity, m = a.scrollSpeed, r = mt(), i = !1, u;
    gl !== t && (gl = t, Ra(), na = a.scroll, u = a.scrollFn, na === !0 && (na = Tt(t, !0)));
    var p = 0, w = na;
    do {
      var v = w, b = Fe(v), k = b.top, D = b.bottom, x = b.left, C = b.right, R = b.width, M = b.height, L = void 0, le = void 0, te = v.scrollWidth, ve = v.scrollHeight, J = be(v), ue = v.scrollLeft, pe = v.scrollTop;
      v === r ? (L = R < te && (J.overflowX === "auto" || J.overflowX === "scroll" || J.overflowX === "visible"), le = M < ve && (J.overflowY === "auto" || J.overflowY === "scroll" || J.overflowY === "visible")) : (L = R < te && (J.overflowX === "auto" || J.overflowX === "scroll"), le = M < ve && (J.overflowY === "auto" || J.overflowY === "scroll"));
      var _ = L && (Math.abs(C - o) <= f && ue + R < te) - (Math.abs(x - o) <= f && !!ue), I = le && (Math.abs(D - d) <= f && pe + M < ve) - (Math.abs(k - d) <= f && !!pe);
      if (!Me[p])
        for (var U = 0; U <= p; U++)
          Me[U] || (Me[U] = {});
      (Me[p].vx != _ || Me[p].vy != I || Me[p].el !== v) && (Me[p].el = v, Me[p].vx = _, Me[p].vy = I, clearInterval(Me[p].pid), (_ != 0 || I != 0) && (i = !0, Me[p].pid = setInterval(function() {
        l && this.layer === 0 && he.active._onTouchMove(za);
        var $ = Me[this.layer].vy ? Me[this.layer].vy * m : 0, j = Me[this.layer].vx ? Me[this.layer].vx * m : 0;
        typeof u == "function" && u.call(he.dragged.parentNode[Ze], j, $, e, za, Me[this.layer].el) !== "continue" || Io(Me[this.layer].el, j, $);
      }.bind({
        layer: p
      }), 24))), p++;
    } while (a.bubbleScroll && w !== r && (w = Tt(w, !1)));
    yl = i;
  }
}, 30), No = function(a) {
  var t = a.originalEvent, l = a.putSortable, o = a.dragEl, d = a.activeSortable, f = a.dispatchSortableEvent, m = a.hideGhostForTarget, r = a.unhideGhostForTarget;
  if (t) {
    var i = l || d;
    m();
    var u = t.changedTouches && t.changedTouches.length ? t.changedTouches[0] : t, p = document.elementFromPoint(u.clientX, u.clientY);
    r(), i && !i.el.contains(p) && (f("spill"), this.onSpill({
      dragEl: o,
      putSortable: l
    }));
  }
};
function Dl() {
}
Dl.prototype = {
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
  drop: No
};
kt(Dl, {
  pluginName: "revertOnSpill"
});
function Ul() {
}
Ul.prototype = {
  onSpill: function(a) {
    var t = a.dragEl, l = a.putSortable, o = l || this.sortable;
    o.captureAnimationState(), t.parentNode && t.parentNode.removeChild(t), o.animateAll();
  },
  drop: No
};
kt(Ul, {
  pluginName: "removeOnSpill"
});
he.mount(new ws());
he.mount(Ul, Dl);
function Vs(e, a) {
  const t = e.oldDraggableIndex ?? e.oldIndex;
  e.item.remove();
  const l = [...e.from.children].filter((o) => o.matches(a));
  e.from.insertBefore(e.item, l[t ?? l.length] ?? null);
}
function Mo(e) {
  const a = /* @__PURE__ */ new Map();
  function t(l) {
    a.get(l)?.destroy(), a.delete(l);
  }
  return wt(() => {
    for (const l of a.keys()) t(l);
  }), {
    mounted(l) {
      const o = l.querySelector(".work-field-builder") ?? l;
      a.set(l, new he(o, {
        draggable: ".work-reorder-entry",
        handle: ".work-reorder-handle",
        forceFallback: !0,
        fallbackOnBody: !1,
        ghostClass: "work-drag-ghost",
        onEnd(d) {
          const f = d.oldDraggableIndex, m = d.newDraggableIndex;
          Vs(d, ".work-reorder-entry"), f !== void 0 && m !== void 0 && f !== m && e(f, m);
        }
      }));
    },
    unmounted: t
  };
}
const $s = { class: "work-stack work-tight work-option-builder" }, xs = { class: "work-stack work-tight" }, Cs = { class: "work-stack work-tight work-small" }, Ss = { class: "work-stack work-tight work-small" }, Ts = { class: "work-stack work-tight" }, Is = { class: "work-stack work-tight work-small" }, Ds = { class: "work-row" }, Us = { class: "work-stack work-tight work-small" }, Es = { class: "work-row" }, As = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, Os = { class: "work-add-option" }, Ps = {
  key: 0,
  class: "work-muted work-small"
}, Rs = /* @__PURE__ */ we({
  __name: "OptionsEditor",
  props: {
    field: {}
  },
  emits: ["validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = "options:" + zt(), d = K(() => t.field.options ?? []), f = K(() => d.value.every((p, w) => !!p.id && d.value.findIndex((v) => v.id === p.id) === w));
    Ie(f, (p) => l("validity", p, o), { immediate: !0 }), wt(() => l("validity", !0, o));
    function m(p, w) {
      po(d.value, p, w - p), d.value.forEach((v, b) => v.order = b);
    }
    const r = Mo(m), i = ["primary", "success", "info", "warn", "danger", "secondary"];
    function u() {
      let p = d.value.length + 1;
      for (; d.value.some((w) => w.id === `option_${p}`); ) p++;
      (t.field.options ??= []).push({ id: `option_${p}`, label: "New option", order: d.value.length });
    }
    return (p, w) => (n(), g("section", $s, [
      w[4] || (w[4] = c("header", { class: "work-row" }, [
        c("h4", null, "Options"),
        c("span", { class: "work-muted work-small" }, "Renaming a choice keeps it selected on existing items."),
        c("span", { class: "work-spacer" })
      ], -1)),
      vt((n(), g("div", xs, [
        (n(!0), g(Q, null, re(d.value, (v, b) => (n(), g("div", {
          key: b,
          class: "work-option-row work-reorder-entry"
        }, [
          y(s(ee), {
            type: "button",
            class: "work-icon-button work-reorder-handle",
            "aria-label": "Drag option; arrow keys reorder",
            onKeydown: [
              ze(Ee((k) => m(b, b - 1), ["prevent"]), ["up"]),
              ze(Ee((k) => m(b, b + 1), ["prevent"]), ["down"])
            ],
            severity: "secondary",
            text: "",
            size: "small"
          }, {
            default: G(() => [
              y(s(fe), {
                icon: "tabler:grip-vertical",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["onKeydown"]),
          c("label", Cs, [
            w[0] || (w[0] = q("Label", -1)),
            y(s(Se), {
              modelValue: v.label,
              "onUpdate:modelValue": (k) => v.label = k,
              "aria-label": "Option label"
            }, null, 8, ["modelValue", "onUpdate:modelValue"])
          ]),
          y(Ne, {
            class: "work-disclosure",
            label: "Advanced"
          }, {
            default: G(() => [
              c("label", Ss, [
                w[1] || (w[1] = q("Integration identifier", -1)),
                y(s(Se), {
                  modelValue: v.id,
                  "onUpdate:modelValue": (k) => v.id = k,
                  class: "work-option-code",
                  required: "",
                  "aria-label": "Option ID"
                }, null, 8, ["modelValue", "onUpdate:modelValue"])
              ])
            ]),
            _: 2
          }, 1024),
          c("div", Ts, [
            c("label", Is, [
              w[2] || (w[2] = q("Color", -1)),
              c("span", Ds, [
                c("span", {
                  class: ut(["work-color-swatch", "work-swatch-" + (v.color || "secondary")]),
                  "aria-hidden": "true"
                }, null, 2),
                y(s(me), {
                  modelValue: v.color,
                  "onUpdate:modelValue": (k) => v.color = k,
                  "aria-label": "Option color",
                  appendTo: "self",
                  optionLabel: "label",
                  optionValue: "value",
                  optionDisabled: "disabled",
                  options: [{ label: "Default", value: void 0, disabled: !1 }, ...(i ?? []).map((k) => ({ label: k, value: k, disabled: !1 }))]
                }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
              ])
            ]),
            c("label", Us, [
              w[3] || (w[3] = q("Category", -1)),
              y(s(me), {
                "model-value": v.category,
                "aria-label": "Option category",
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                showClear: "",
                options: ["triage", "backlog", ...s(fo)].map((k) => ({ label: s(jt)(k), value: k })),
                "onUpdate:modelValue": (k) => v.category = k || void 0
              }, null, 8, ["model-value", "options", "onUpdate:modelValue"])
            ])
          ]),
          c("div", Es, [
            y(s(ee), {
              "aria-label": "Option earlier",
              severity: "secondary",
              size: "small",
              disabled: b === 0,
              onClick: (k) => m(b, b - 1),
              text: ""
            }, {
              default: G(() => [
                y(s(fe), {
                  icon: "tabler:arrow-up",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["disabled", "onClick"]),
            y(s(ee), {
              "aria-label": "Option later",
              severity: "secondary",
              size: "small",
              disabled: b === d.value.length - 1,
              onClick: (k) => m(b, b + 1),
              text: ""
            }, {
              default: G(() => [
                y(s(fe), {
                  icon: "tabler:arrow-down",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["disabled", "onClick"]),
            y(s(ee), {
              label: "Remove",
              "aria-label": "Remove option",
              severity: "secondary",
              text: "",
              size: "small",
              onClick: (k) => d.value.splice(b, 1)
            }, {
              icon: G(() => [
                y(s(fe), {
                  icon: "tabler:trash",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["onClick"])
          ])
        ]))), 128)),
        f.value ? T("", !0) : (n(), g("p", As, "Each choice needs a unique integration identifier.")),
        c("div", Os, [
          y(s(ee), {
            label: "Add option",
            severity: "secondary",
            size: "small",
            onClick: u,
            outlined: ""
          }, {
            icon: G(() => [
              y(s(fe), {
                icon: "tabler:plus",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          })
        ])
      ])), [
        [s(r)]
      ]),
      d.value.length ? T("", !0) : (n(), g("p", Ps, "Add the choices people can select for this field."))
    ]));
  }
}), Ns = {
  class: "work-stack",
  "aria-label": "Fields editor"
}, Ms = { class: "work-form-actions work-wrap" }, Fs = { class: "work-stack work-tight" }, Ls = {
  key: 0,
  class: "work-settings-card work-muted"
}, Bs = { class: "work-muted work-small" }, zs = {
  key: 0,
  class: "work-error work-small",
  role: "alert"
}, js = { class: "work-settings-grid work-field-properties" }, Ws = { class: "work-stack work-tight" }, qs = { class: "work-stack work-tight" }, Gs = { class: "work-stack work-tight" }, Ks = {
  key: 1,
  class: "work-stack work-tight"
}, Hs = {
  key: 4,
  class: "work-stack work-tight"
}, Ys = {
  key: 5,
  class: "work-stack work-tight"
}, Xs = { class: "work-stack work-tight" }, Js = { class: "work-stack work-tight" }, Zs = { class: "work-stack work-tight" }, Qs = { class: "work-stack work-tight" }, _s = { class: "work-stack" }, er = { class: "work-stack work-tight" }, tr = { class: "work-stack work-tight" }, ar = { class: "work-stack work-tight work-field-history" }, lr = { class: "work-settings-list" }, or = { class: "work-settings-row" }, ir = { class: "work-settings-row" }, nr = { class: "work-stack" }, sr = /* @__PURE__ */ we({
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
    const t = e, l = a, o = K(() => t.draft.fields ?? []), d = B("text"), f = B([]), m = K(() => (t.draft.item_types ?? []).map((A) => ({ value: A.id, label: A.title || Re(A.id) }))), r = K(() => t.draft.item_types?.find((A) => A.id === t.itemType)), i = K(() => o.value.map((A, W) => ({ field: A, index: W })).filter(({ field: A }) => !r.value || r.value.fields.includes(A.code))), u = B(""), p = B({}), w = Mo((A, W) => {
      const F = i.value[A]?.index, ce = i.value[W]?.index;
      F !== void 0 && ce !== void 0 && U(F, ce - F);
    });
    function v(A) {
      return (t.draft.item_types ?? []).filter((W) => W.fields.includes(A)).map((W) => W.title || Re(W.id));
    }
    async function b(A) {
      if (!u.value) {
        u.value = A.code;
        try {
          const W = await t.guardRemoval?.("fields", A.code);
          p.value[A.code] = W ?? "", W || ya(t.draft, "fields", A.code);
        } finally {
          u.value = "";
        }
      }
    }
    const k = Object.entries({ text: "Text", int: "Whole number", dec: "Decimal number", quantity: "Measurement", bool: "Yes or no", time: "Date or time", ref: "Reference", record: "Structured data", option: "Choice", principal: "Person or group", item: "Work item", rank: "Order", rich_text: "Formatted text", formula: "Formula", rollup: "Related item calculation", counter: "Counter" }).map(([A, W]) => ({ value: A, label: W })), D = [{ label: "None", value: "none" }, { label: "Exact matches", value: "key" }, { label: "Numeric ranges", value: "number" }], x = ["int", "dec", "quantity"], C = K(() => new Map(t.installedTypes?.map((A) => [A.id, A]))), R = K(() => [...k, ...(t.installedTypes ?? []).map((A) => ({ value: A.id, label: A.title }))]), M = {};
    function L(A) {
      return A.type && A.type !== "value" ? A.type : A.form ?? "text";
    }
    function le(A) {
      return A.type ? C.value.get(A.type) : void 0;
    }
    function te(A) {
      const W = le(A)?.config_schema;
      return W && ho(W).length ? W : void 0;
    }
    function ve(A) {
      const W = le(A);
      return !!W?.config_schema || ["dec", "quantity", "ref", "time", "record"].includes(W?.form ?? A.form ?? "") || !!A.config;
    }
    function J(A) {
      const W = le(A), F = W?.form ?? A.form ?? "text";
      return D.filter(({ value: ce }) => ce === "none" || (!W?.indexes || W.indexes.includes(ce)) && F !== "record" && (ce !== "number" || x.includes(F) || A.type === "option"));
    }
    function ue(A) {
      A.index && !J(A).some((W) => W.value === A.index) && delete A.index;
    }
    function pe(A, W) {
      const F = C.value.get(W);
      if (F) {
        if (F.id === A.type) return;
        A.type = F.id, A.form = F.form, delete A.options, delete A.config, ue(A);
        return;
      }
      le(A) && delete A.config;
      const ce = { option: "text", principal: "ref", item: "ref", rank: "text", rich_text: "text", formula: "int", rollup: "int", counter: "int" };
      ce[W] ? (A.type = W, A.form = ce[W]) : (delete A.type, A.form = W), W !== "option" ? delete A.options : A.options ??= [], W === "rich_text" && (A.config = { format: "json" }), ue(A);
    }
    function _(A, W) {
      A.form = W, ue(A);
    }
    function I(A, W) {
      const F = { ...A.config };
      W ? F.item_type = W : delete F.item_type, A.config = Object.keys(F).length ? F : void 0;
    }
    function U(A, W) {
      po(o.value, A, W);
      for (const F of t.draft.item_types ?? []) {
        const ce = new Set(F.fields);
        F.fields = o.value.filter((h) => ce.has(h.code)).map((h) => h.code);
      }
    }
    function $(A, W) {
      try {
        ci(t.draft, A, W.value), delete p.value[A.code];
      } catch (F) {
        p.value[A.code] = F.message, W.value = A.code;
      }
    }
    function j() {
      d.value = "text", f.value = r.value ? [r.value.id] : [];
    }
    function X(A) {
      const W = A.normalize("NFKD").replace(/\p{Mark}/gu, "").toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, ""), F = (/^[a-z]/.test(W) ? W : `field_${W || "new"}`).slice(0, 40);
      let ce = F, h = 2;
      for (; o.value.some((se) => se.code === ce); ) {
        const se = "_" + h++;
        ce = F.slice(0, 40 - se.length) + se;
      }
      const O = { code: ce, title: A, form: "text", cardinality: "one" };
      pe(O, d.value), (t.draft.fields ??= []).push(O);
      for (const se of t.draft.item_types ?? []) f.value.includes(se.id) && se.fields.push(ce);
      r.value && !f.value.includes(r.value.id) && l("update:itemType", ""), de.value = ce;
    }
    const de = B("");
    return (A, W) => (n(), g("section", Ns, [
      c("div", Ms, [
        y(s(me), {
          "model-value": r.value?.id ?? "",
          "aria-label": "Filter fields by item type",
          placeholder: "All item types",
          appendTo: "self",
          optionLabel: "label",
          optionValue: "value",
          options: [{ value: "", label: "All item types" }, ...m.value],
          "onUpdate:modelValue": W[0] || (W[0] = (F) => l("update:itemType", F))
        }, null, 8, ["model-value", "options"]),
        y(ba, {
          action: "Add field",
          label: "Field name",
          maxlength: 255,
          onOpen: j,
          onAdd: X
        }, {
          default: G(() => [
            c("label", Fs, [
              W[4] || (W[4] = q("Kind", -1)),
              y(s(me), {
                modelValue: d.value,
                "onUpdate:modelValue": W[1] || (W[1] = (F) => d.value = F),
                "aria-label": "New field kind",
                appendTo: "self",
                options: R.value,
                optionLabel: "label",
                optionValue: "value"
              }, null, 8, ["modelValue", "options"])
            ]),
            m.value.length ? (n(), H(ct, {
              key: 0,
              label: "Show on item types",
              options: m.value,
              modelValue: f.value,
              "onUpdate:modelValue": W[2] || (W[2] = (F) => f.value = F)
            }, null, 8, ["options", "modelValue"])) : T("", !0)
          ]),
          _: 1
        })
      ]),
      i.value.length ? T("", !0) : (n(), g("p", Ls, "No fields here yet. Add a field to capture information.")),
      vt((n(), H(qa, {
        columns: "fields",
        count: i.value.length
      }, {
        default: G(() => [
          (n(!0), g(Q, null, re(i.value, ({ field: F, index: ce }) => (n(), H(Wa, {
            title: s(Ke)(F),
            "initial-open": de.value === F.code,
            kind: le(F)?.title || s(k).find((h) => h.value === L(F))?.label || s(Re)(L(F)),
            key: F.id ?? ce,
            class: "work-field-row work-reorder-entry work-stack"
          }, {
            handle: G(() => [
              y(s(ee), {
                type: "button",
                class: "work-reorder-handle work-icon-button",
                "aria-label": "Drag " + s(Ke)(F) + " or use the arrow keys to reorder",
                onKeydown: [
                  ze(Ee((h) => U(ce, -1), ["prevent"]), ["up"]),
                  ze(Ee((h) => U(ce, 1), ["prevent"]), ["down"])
                ],
                severity: "secondary",
                text: "",
                size: "small"
              }, {
                default: G(() => [
                  y(s(fe), {
                    icon: "tabler:grip-vertical",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["aria-label", "onKeydown"])
            ]),
            flags: G(() => [
              F.track ? (n(), H(s(Ye), {
                key: 0,
                class: "kx-tag-sm",
                severity: "secondary",
                value: "Tracked"
              })) : T("", !0),
              F.intervals ? (n(), H(s(Ye), {
                key: 1,
                class: "kx-tag-sm",
                severity: "secondary",
                value: "Intervals"
              })) : T("", !0)
            ]),
            usage: G(() => [
              c("span", Bs, E(v(F.code).length ? v(F.code).join(", ") : "Unused"), 1)
            ]),
            actions: G(() => [
              y(s(ee), {
                "aria-label": "Move " + s(Ke)(F) + " earlier",
                severity: "secondary",
                disabled: ce === 0,
                onClick: (h) => U(ce, -1),
                text: "",
                size: "small"
              }, {
                default: G(() => [
                  y(s(fe), {
                    icon: "tabler:arrow-up",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["aria-label", "disabled", "onClick"]),
              y(s(ee), {
                "aria-label": "Move " + s(Ke)(F) + " later",
                severity: "secondary",
                disabled: ce === o.value.length - 1,
                onClick: (h) => U(ce, 1),
                text: "",
                size: "small"
              }, {
                default: G(() => [
                  y(s(fe), {
                    icon: "tabler:arrow-down",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["aria-label", "disabled", "onClick"])
            ]),
            default: G(() => [
              p.value[F.code] ? (n(), g("p", zs, E(p.value[F.code]), 1)) : T("", !0),
              (n(!0), g(Q, null, re(e.issues?.filter((h) => h.code === F.code) ?? [], (h) => (n(), g("p", {
                key: h.what,
                class: "work-error work-small",
                role: "alert"
              }, E(s(ja)(h)), 1))), 128)),
              c("div", js, [
                c("label", Ws, [
                  W[5] || (W[5] = q("Title", -1)),
                  y(s(Se), {
                    modelValue: F.title,
                    "onUpdate:modelValue": (h) => F.title = h,
                    "aria-label": "Field title",
                    maxlength: "255",
                    placeholder: s(Ke)(F)
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder"])
                ]),
                c("label", qs, [
                  W[6] || (W[6] = q("Kind", -1)),
                  y(s(me), {
                    "aria-label": "Kind",
                    "model-value": L(F),
                    "onUpdate:modelValue": (h) => pe(F, h),
                    appendTo: "self",
                    options: R.value,
                    optionLabel: "label",
                    optionValue: "value"
                  }, null, 8, ["model-value", "onUpdate:modelValue", "options"])
                ]),
                c("label", Gs, [
                  W[7] || (W[7] = q("Values allowed", -1)),
                  y(s(me), {
                    "aria-label": "Values allowed",
                    "model-value": F.cardinality ?? "one",
                    "onUpdate:modelValue": (h) => F.cardinality = h,
                    appendTo: "self",
                    options: [{ label: "One value", value: "one" }, { label: "Multiple unique values", value: "set" }, { label: "Ordered values", value: "list" }],
                    optionLabel: "label",
                    optionValue: "value"
                  }, null, 8, ["model-value", "onUpdate:modelValue"])
                ])
              ]),
              F.type === "item" ? (n(), g("label", Ks, [
                W[8] || (W[8] = q("Which items can be referenced? ", -1)),
                y(s(me), {
                  "model-value": F.config?.item_type ?? "",
                  "aria-label": "Reference target",
                  appendTo: "self",
                  optionLabel: "label",
                  optionValue: "value",
                  options: [{ value: "", label: "Any item type" }, ...m.value],
                  "onUpdate:modelValue": (h) => I(F, h)
                }, null, 8, ["model-value", "options", "onUpdate:modelValue"]),
                W[9] || (W[9] = c("span", { class: "work-muted work-small" }, "A reference stores the selected item as a value. To show a named relationship on both items, use Links.", -1))
              ])) : T("", !0),
              te(F) ? (n(), H(bo, {
                key: F.type,
                schema: te(F),
                "model-value": F.config ?? M,
                "onUpdate:modelValue": (h) => F.config = h,
                onValidity: (h) => l("validity", "config-" + ce, h)
              }, null, 8, ["schema", "model-value", "onUpdate:modelValue", "onValidity"])) : T("", !0),
              F.type === "option" ? (n(), H(Rs, {
                key: 3,
                field: F,
                onValidity: W[3] || (W[3] = (h, O) => l("validity", O, h))
              }, null, 8, ["field"])) : T("", !0),
              F.type === "formula" || F.type === "rollup" ? (n(), g("label", Hs, [
                W[10] || (W[10] = q("Result type", -1)),
                y(s(me), {
                  "model-value": F.form,
                  "onUpdate:modelValue": (h) => _(F, h),
                  "aria-label": "Result type",
                  options: s(k).slice(0, 8),
                  optionLabel: "label",
                  optionValue: "value",
                  appendTo: "self"
                }, null, 8, ["model-value", "onUpdate:modelValue", "options"])
              ])) : T("", !0),
              F.type === "formula" ? (n(), g("label", Ys, [
                W[11] || (W[11] = q("Expression", -1)),
                y(s(Se), {
                  modelValue: F.expression,
                  "onUpdate:modelValue": (h) => F.expression = h,
                  "aria-label": "Expression"
                }, null, 8, ["modelValue", "onUpdate:modelValue"])
              ])) : T("", !0),
              F.type === "rollup" ? (n(), g(Q, { key: 6 }, [
                c("label", Xs, [
                  W[12] || (W[12] = q("Of", -1)),
                  y(s(Se), {
                    modelValue: F.of,
                    "onUpdate:modelValue": (h) => F.of = h,
                    "aria-label": "Related items"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                c("label", Js, [
                  W[13] || (W[13] = q("Function", -1)),
                  y(s(Se), {
                    modelValue: F.fn,
                    "onUpdate:modelValue": (h) => F.fn = h,
                    "aria-label": "Calculation"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                c("label", Zs, [
                  W[14] || (W[14] = q("Field", -1)),
                  y(s(Se), {
                    modelValue: F.field,
                    "onUpdate:modelValue": (h) => F.field = h,
                    "aria-label": "Calculated field"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                c("label", Qs, [
                  W[15] || (W[15] = q("Order by", -1)),
                  y(s(me), {
                    "model-value": F.by,
                    "aria-label": "Rollup order",
                    options: ["rank", "time"],
                    showClear: "",
                    appendTo: "self",
                    "onUpdate:modelValue": (h) => F.by = h || void 0
                  }, null, 8, ["model-value", "onUpdate:modelValue"])
                ]),
                y(Cl, {
                  modelValue: F.where,
                  "onUpdate:modelValue": (h) => F.where = h,
                  draft: e.draft,
                  "board-id": e.boardId,
                  label: "Include related items when",
                  onValidity: (h) => l("validity", "rollup-" + ce, h)
                }, null, 8, ["modelValue", "onUpdate:modelValue", "draft", "board-id", "onValidity"])
              ], 64)) : T("", !0),
              y(Ne, {
                class: "work-disclosure",
                label: "Advanced field settings"
              }, {
                default: G(() => [
                  c("div", _s, [
                    c("label", er, [
                      W[16] || (W[16] = q("Field identifier for integrations", -1)),
                      y(s(Se), {
                        value: F.code,
                        "aria-label": "Field code",
                        required: "",
                        pattern: "[a-z][a-z0-9_]*",
                        onInput: (h) => $(F, h.target)
                      }, null, 8, ["value", "onInput"])
                    ]),
                    c("label", tr, [
                      W[17] || (W[17] = q("Allow filters to use", -1)),
                      y(s(me), {
                        "aria-label": "Allow filters to use",
                        "model-value": F.index ?? "none",
                        "onUpdate:modelValue": (h) => F.index = h,
                        appendTo: "self",
                        options: J(F),
                        optionLabel: "label",
                        optionValue: "value"
                      }, null, 8, ["model-value", "onUpdate:modelValue", "options"])
                    ]),
                    c("section", ar, [
                      W[20] || (W[20] = c("h4", { class: "work-group-title" }, "History", -1)),
                      c("div", lr, [
                        c("div", or, [
                          W[18] || (W[18] = c("div", { class: "work-row-main" }, [
                            c("strong", null, "Track changes"),
                            c("p", { class: "work-muted work-small" }, "Record each value change in the item history.")
                          ], -1)),
                          y(s(Qe), {
                            modelValue: F.track,
                            "onUpdate:modelValue": (h) => F.track = h,
                            "aria-label": "Track changes"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        c("div", ir, [
                          W[19] || (W[19] = c("div", { class: "work-row-main" }, [
                            c("strong", null, "Track intervals"),
                            c("p", { class: "work-muted work-small" }, "Measure how long each value stays in effect.")
                          ], -1)),
                          y(s(Qe), {
                            modelValue: F.intervals,
                            "onUpdate:modelValue": (h) => F.intervals = h,
                            "aria-label": "Track intervals"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ])
                      ])
                    ]),
                    !te(F) && ve(F) ? (n(), H(Dt, {
                      key: 0,
                      label: "Field configuration",
                      "model-value": F.config,
                      shape: "object",
                      "onUpdate:modelValue": (h) => F.config = h,
                      onValidity: (h) => l("validity", "config-" + ce, h)
                    }, null, 8, ["model-value", "onUpdate:modelValue", "onValidity"])) : T("", !0),
                    c("section", nr, [
                      W[21] || (W[21] = c("h4", { class: "work-group-title" }, "Access", -1)),
                      (n(), g(Q, null, re(["read", "write"], (h) => y(Vo, {
                        "board-id": e.boardId,
                        key: h,
                        label: h === "read" ? "Who can read" : "Who can edit",
                        "model-value": F.access?.[h],
                        "onUpdate:modelValue": (O) => F.access = { ...F.access, [h]: O },
                        onValidity: (O) => l("validity", "access-" + ce + h, O)
                      }, null, 8, ["board-id", "label", "model-value", "onUpdate:modelValue", "onValidity"])), 64))
                    ]),
                    y(s(ee), {
                      label: "Remove field",
                      severity: "danger",
                      text: "",
                      disabled: !!u.value,
                      onClick: (h) => b(F)
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
        [s(w)]
      ])
    ]));
  }
}), rr = {
  class: "work-stack",
  "aria-label": "Item types editor"
}, dr = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, ur = { class: "work-definition-meta" }, cr = { class: "work-settings-grid" }, vr = { class: "work-stack work-tight" }, mr = { class: "work-stack work-tight" }, fr = { class: "work-stack" }, pr = { class: "work-stack work-tight" }, br = {
  key: 0,
  class: "work-row work-wrap"
}, hr = { class: "work-stack work-tight" }, gr = {
  key: 1,
  class: "work-stack work-tight work-small"
}, yr = {
  key: 0,
  class: "kx-empty"
}, kr = /* @__PURE__ */ we({
  __name: "TypesEditor",
  props: {
    draft: {},
    guardRemoval: { type: Function },
    issues: {}
  },
  setup(e) {
    const a = e, t = K(() => a.draft.item_types ?? []), l = B(""), o = B("");
    function d(v) {
      const b = v.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, ""), k = /^[a-z]/.test(b) ? b : "type_" + (b || "new");
      let D = k.slice(0, 40), x = 2;
      for (; t.value.some((C) => C.id === D); ) {
        const C = "_" + x++;
        D = k.slice(0, 40 - C.length) + C;
      }
      return D;
    }
    function f(v) {
      (a.draft.item_types ??= []).push({ id: d(v), title: v, process: a.draft.processes?.[0]?.id ?? "", fields: [] });
    }
    function m(v, b) {
      const k = v.id;
      v.id = b;
      for (const D of t.value) D.parent_types && (D.parent_types = D.parent_types.map((x) => x === k ? b : x));
    }
    function r(v, b) {
      v.fields = b, v.inherit && (v.inherit = v.inherit.filter((k) => b.includes(k)));
    }
    function i(v) {
      return (v.parent_types ?? []).filter((b) => typeof b == "string");
    }
    function u(v, b, k) {
      v.parent_types = k && b.length ? [...b, !1] : b;
    }
    function p(v) {
      return t.value.filter((b) => b.id !== v.id && b.parent_types?.includes(v.id)).map((b) => b.title || Re(b.id));
    }
    async function w(v) {
      if (!o.value) {
        if (p(v).length) {
          l.value = `${v.title || Re(v.id)} is a parent type for ${p(v).join(", ")}. Remove those parent selections first.`;
          return;
        }
        o.value = v.id, l.value = "";
        try {
          const b = await a.guardRemoval?.("item_types", v.id);
          b ? l.value = b : ya(a.draft, "item_types", v.id);
        } finally {
          o.value = "";
        }
      }
    }
    return (v, b) => (n(), g("section", rr, [
      l.value ? (n(), g("p", dr, E(l.value), 1)) : T("", !0),
      y(qa, {
        columns: "types",
        count: t.value.length
      }, {
        default: G(() => [
          (n(!0), g(Q, null, re(t.value, (k, D) => (n(), H(Wa, {
            title: k.title || s(Re)(k.id),
            kind: e.draft.processes?.find((x) => x.id === k.process)?.name || s(Re)(k.process),
            key: D,
            class: "work-type-card"
          }, {
            usage: G(() => [
              c("span", ur, [
                y(s(Ye), {
                  class: "kx-tag-sm",
                  severity: "secondary"
                }, {
                  default: G(() => [
                    q(E(k.fields.length) + " " + E(k.fields.length === 1 ? "field" : "fields"), 1)
                  ]),
                  _: 2
                }, 1024),
                p(k).length ? (n(), H(s(Ye), {
                  key: 0,
                  class: "kx-tag-sm",
                  severity: "secondary"
                }, {
                  default: G(() => [
                    q("Parent of " + E(p(k).join(", ")), 1)
                  ]),
                  _: 2
                }, 1024)) : T("", !0)
              ])
            ]),
            default: G(() => [
              (n(!0), g(Q, null, re(e.issues?.filter((x) => x.code === "item_type " + k.id) ?? [], (x) => (n(), g("p", {
                key: x.what,
                class: "work-error work-small",
                role: "alert"
              }, E(s(ja)(x)), 1))), 128)),
              c("div", cr, [
                c("label", vr, [
                  b[0] || (b[0] = q("Title", -1)),
                  y(s(Se), {
                    modelValue: k.title,
                    "onUpdate:modelValue": (x) => k.title = x,
                    placeholder: s(Re)(k.id)
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder"])
                ]),
                c("label", mr, [
                  b[1] || (b[1] = q("Workflow", -1)),
                  y(s(me), {
                    modelValue: k.process,
                    "onUpdate:modelValue": (x) => k.process = x,
                    "aria-label": "Workflow",
                    required: "",
                    appendTo: "self",
                    optionLabel: "label",
                    optionValue: "value",
                    optionDisabled: "disabled",
                    options: [...(e.draft.processes ?? []).map((x) => ({ label: x.name || s(Re)(x.id), value: x.id, disabled: !1 }))]
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                ])
              ]),
              y(ct, {
                label: "Fields",
                options: (e.draft.fields ?? []).map((x) => ({ value: x.code, label: s(Ke)(x) })),
                "model-value": k.fields,
                "onUpdate:modelValue": (x) => r(k, x)
              }, null, 8, ["options", "model-value", "onUpdate:modelValue"]),
              y(Ne, {
                class: "work-disclosure",
                label: "Advanced item type settings"
              }, {
                default: G(() => [
                  c("div", fr, [
                    c("label", pr, [
                      b[2] || (b[2] = q("Identifier", -1)),
                      y(s(Se), {
                        value: k.id,
                        onChange: (x) => m(k, x.target.value),
                        required: "",
                        pattern: "[a-z][a-z0-9_]*"
                      }, null, 8, ["value", "onChange"])
                    ]),
                    b[6] || (b[6] = q()),
                    y(ct, {
                      label: "Parent types",
                      options: t.value.map((x) => ({ value: x.id, label: x.title || s(Re)(x.id) })),
                      "model-value": i(k),
                      "onUpdate:modelValue": (x) => u(k, x, !!k.parent_types?.includes(!1))
                    }, null, 8, ["options", "model-value", "onUpdate:modelValue"]),
                    i(k).length ? (n(), g("label", br, [
                      y(s(Qe), {
                        "model-value": !!k.parent_types?.includes(!1),
                        "aria-label": "Allow top-level items",
                        "onUpdate:modelValue": (x) => u(k, i(k), x)
                      }, null, 8, ["model-value", "onUpdate:modelValue"]),
                      b[3] || (b[3] = q("Allow top-level items", -1))
                    ])) : T("", !0),
                    c("div", hr, [
                      y(ct, {
                        label: "Inherit from parent",
                        options: k.fields.map((x) => ({ value: x, label: s(Ke)(e.draft.fields?.find((C) => C.code === x) ?? { code: x }) })),
                        modelValue: k.inherit,
                        "onUpdate:modelValue": (x) => k.inherit = x
                      }, null, 8, ["options", "modelValue", "onUpdate:modelValue"]),
                      b[4] || (b[4] = c("p", { class: "work-muted work-small" }, "These fields resolve from the parent when this item has no own value.", -1))
                    ]),
                    i(k).length ? (n(), g("label", gr, [
                      b[5] || (b[5] = q("When the parent moves", -1)),
                      y(s(me), {
                        modelValue: k.move_children,
                        "onUpdate:modelValue": (x) => k.move_children = x,
                        "aria-label": "When the parent moves",
                        appendTo: "self",
                        optionLabel: "label",
                        optionValue: "value",
                        optionDisabled: "disabled",
                        options: [{ label: "Default", value: void 0, disabled: !1 }, { label: "Move children", value: "move", disabled: !1 }, { label: "Refuse while children exist", value: "refuse", disabled: !1 }]
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ])) : T("", !0),
                    y(s(ee), {
                      label: "Remove type",
                      severity: "danger",
                      text: "",
                      disabled: !!o.value,
                      onClick: (x) => w(k)
                    }, null, 8, ["disabled", "onClick"])
                  ])
                ]),
                _: 2
              }, 1024)
            ]),
            _: 2
          }, 1032, ["title", "kind"]))), 128)),
          t.value.length ? T("", !0) : (n(), g("p", yr, "Add a type for the work people create, such as a delivery task or customer request.")),
          y(ba, {
            action: "Add item type",
            label: "Item type name",
            onAdd: f
          })
        ]),
        _: 1
      }, 8, ["count"])
    ]));
  }
}), wr = ".work-process-canvas>svg{height:480px;width:100%}.work-process-canvas:focus-visible{outline:var(--p-focus-ring-width) var(--p-focus-ring-style) var(--p-focus-ring-color);outline-offset:var(--p-focus-ring-offset)}.work-state-card{fill:var(--p-content-background);stroke:var(--p-content-border-color);stroke-width:1.5}.work-graph-node.work-selected .work-state-card{stroke:var(--p-primary-color);stroke-width:2.5;fill:color-mix(in srgb,var(--p-primary-color) 6%,var(--p-content-background))}.work-graph-node:focus-visible .work-state-card{stroke:var(--p-focus-ring-color);stroke-width:var(--p-focus-ring-width)}.work-process-canvas .work-edge-label{font-size:12px;fill:var(--p-text-color)}.work-process-canvas .work-edge-label-bg{fill:var(--p-content-background);stroke:var(--p-content-border-color);stroke-width:1}.work-edge-line{stroke:var(--p-primary-color);stroke-width:1.5}.work-edge-return .work-edge-line{stroke:var(--p-text-muted-color);stroke-dasharray:5 4}.work-graph-arrow{fill:context-stroke}.work-lane-line{fill:none;stroke:var(--p-text-muted-color);stroke-width:1.5;stroke-dasharray:2 4}.work-node-connector{fill:var(--p-content-background);stroke:var(--p-primary-color);stroke-width:1.5}.work-node-connector:hover,.work-node-connector:focus-visible,.work-node-connector[aria-pressed=true]{fill:var(--p-primary-color)}.work-any-transition:focus-visible text,.work-any-transition[aria-pressed=true] text{fill:var(--p-primary-color);text-decoration:underline}.work-process-legend{position:static;flex-wrap:wrap;padding:10px 16px;border-top:1px solid var(--p-content-border-color);background:var(--p-content-background)}@media(max-width:700px){.work-process-canvas>svg{height:420px}}.work-process-more{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:8px;padding:8px 16px;border-top:1px solid var(--p-content-border-color);background:var(--p-content-background);color:var(--p-text-muted-color);font-size:12px}.work-process-canvas .work-graph-edge.work-selected .work-edge-label-bg{fill:var(--p-primary-color);stroke:var(--p-primary-color)}.work-process-canvas .work-graph-edge.work-selected .work-edge-label{fill:var(--p-primary-contrast-color)}", eo = /* @__PURE__ */ new WeakSet();
function Vr(e) {
  const a = e.getRootNode();
  if (a instanceof ShadowRoot && !eo.has(a)) {
    const t = e.ownerDocument.createElement("style");
    t.textContent = wr, a.append(t), eo.add(a);
  }
}
const Fo = 0.8;
function $r(e, a, t) {
  const l = Math.min(1, a.width / e.width, a.height / e.height);
  if (l >= Fo) return { zoom: l, pan: { x: (e.width - a.width / l) / 2, y: (e.height - a.height / l) / 2 } };
  const o = e.nodes.find((f) => f.state.id === t) ?? e.nodes[0], d = Math.min(1, a.width / ((o?.width ?? 190) + 64));
  return { zoom: d, pan: o ? { x: e.direction === "TB" ? o.x - a.width / d / 2 : o.x - o.width / 2 - 32, y: e.direction === "TB" ? o.y - o.height / 2 - 32 : o.y - a.height / d / 2 } : { x: 0, y: 0 } };
}
const xr = ["onKeydown"], Cr = {
  key: 0,
  class: "work-process-instruction",
  role: "status"
}, Sr = ["viewBox"], Tr = ["id"], Ir = ["d", "marker-end"], Dr = ["aria-label", "aria-pressed", "aria-keyshortcuts", "onKeydown", "onFocus", "onClick"], Ur = ["d"], Er = ["d", "marker-end"], Ar = ["x", "y", "width", "height"], Or = ["x", "y"], Pr = ["x", "dy"], Rr = ["aria-label", "aria-pressed", "onClick", "onKeydown", "onFocus", "onPointerup"], Nr = ["x", "y", "width", "height"], Mr = ["cx", "cy"], Fr = ["x", "y"], Lr = ["x", "dy"], Br = ["x", "y"], zr = ["x", "dy"], jr = {
  key: 0,
  class: "work-limit-text"
}, Wr = ["aria-label", "aria-pressed", "aria-keyshortcuts", "onFocus", "onKeydown", "onClick"], qr = ["x", "y"], Gr = ["x", "dy"], Kr = ["cx", "cy", "aria-label", "aria-pressed", "onFocus", "onPointerdown", "onClick", "onKeydown"], Hr = ["d"], Yr = {
  key: 1,
  class: "work-process-more",
  role: "status"
}, Xr = { class: "work-process-legend" }, Jr = /* @__PURE__ */ we({
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
    const l = e, o = t, d = zt().replace(/:/g, "_"), f = B(""), m = B(), r = B();
    let i;
    const u = B(900), p = B(!1), w = K(() => u.value < 700 ? 420 : 480), v = K(() => Di(l.process, l.draft, {
      width: u.value,
      height: w.value,
      direction: l.fitOnOpen ? "TB" : void 0
    })), b = B(1), k = B({ x: 0, y: 0 }), D = B({ x: 0, y: 0 }), x = K(() => {
      const V = Math.min(1, u.value / v.value.width);
      return l.fitOnOpen ? Math.max(Fo, V) : V;
    }), C = K(() => ({
      width: u.value,
      height: p.value ? Math.max(w.value, Math.ceil(v.value.height * x.value)) : w.value
    })), R = K(() => v.value.nodes.filter((V) => V.x - V.width / 2 >= k.value.x && V.x + V.width / 2 <= k.value.x + C.value.width / b.value && V.y - V.height / 2 >= k.value.y && V.y + V.height / 2 <= k.value.y + C.value.height / b.value).length);
    function M() {
      p.value = !1;
      const V = $r(v.value, C.value, l.process.initial);
      b.value = V.zoom, k.value = V.pan;
    }
    const L = K(() => `${k.value.x} ${k.value.y} ${C.value.width / b.value} ${C.value.height / b.value}`), le = K(() => v.value.nodes.find((V) => V.state.id === f.value));
    function te() {
      p.value = !0, b.value = x.value;
      const V = C.value.width / b.value, P = v.value.nodes.find((S) => S.state.id === l.process.initial);
      k.value = {
        x: v.value.width > V && P ? P.x - V / 2 : (v.value.width - V) / 2,
        y: 0
      };
    }
    function ve(V) {
      l.fitOnOpen && (p.value = !1);
      const P = Math.max(0.02, Math.min(3, b.value * V)), S = 1 / b.value - 1 / P;
      k.value = { x: k.value.x + C.value.width * S / 2, y: k.value.y + C.value.height * S / 2 }, b.value = P;
    }
    function J(V) {
      const P = C.value.width / b.value, S = C.value.height / b.value;
      (V.x - V.width / 2 < k.value.x || V.x + V.width / 2 > k.value.x + P || V.y - V.height / 2 < k.value.y || V.y + V.height / 2 > k.value.y + S) && (k.value = { x: V.x - P / 2, y: V.y - S / 2 });
    }
    function ue() {
      const V = v.value.nodes.find((P) => P.state === l.selectedState) ?? v.value.edges.find((P) => P.transition === l.selectedTransition);
      if (!V) {
        l.fitOnOpen && p.value && te();
        return;
      }
      J(V);
    }
    Ie([v, () => l.selectedState, () => l.selectedTransition], ue, { flush: "post" });
    function pe() {
      l.fitOnOpen ? te() : M();
    }
    Ie(() => l.process.id, () => {
      A(), pe();
    }, { flush: "post" });
    function _(V) {
      if (V.target !== m.value) return;
      (V.key === "+" || V.key === "=") && (V.preventDefault(), ve(1.2)), V.key === "-" && (V.preventDefault(), ve(1 / 1.2)), V.key === "0" && (V.preventDefault(), te());
      const P = 60 / b.value;
      V.key.startsWith("Arrow") && (V.preventDefault(), k.value = { x: k.value.x + (V.key === "ArrowRight" ? P : V.key === "ArrowLeft" ? -P : 0), y: k.value.y + (V.key === "ArrowDown" ? P : V.key === "ArrowUp" ? -P : 0) });
    }
    function I(V, P) {
      const S = P.currentTarget;
      if (!f.value) o("state", V, S);
      else if (f.value !== V.id) {
        const oe = f.value;
        f.value = "", o("connect", oe, V.id, S);
      }
    }
    function U(V) {
      f.value = V.state.id, D.value = { x: v.value.direction === "TB" ? V.x : V.x + V.width / 2, y: v.value.direction === "TB" ? V.y + V.height / 2 : V.y };
    }
    function $(V, P) {
      if (V.pointerType === "touch" || V.button !== 0) return;
      i = V.pointerId, U(P);
      const S = V.currentTarget;
      S.hasPointerCapture?.(V.pointerId) && S.releasePointerCapture(V.pointerId);
    }
    function j(V, P) {
      i === V.pointerId && (i = void 0, !(!f.value || f.value === P.id) && I(P, V));
    }
    function X(V, P) {
      if ((V.key === "Enter" || V.key === " ") && (V.preventDefault(), I(P, V)), ["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp"].includes(V.key)) {
        V.preventDefault();
        const S = Array.from(r.value?.querySelectorAll(".work-graph-node") ?? []), oe = v.value.nodes.findIndex((Ve) => Ve.state === P), xe = ["ArrowRight", "ArrowDown"].includes(V.key) ? 1 : -1;
        S[(oe + xe + S.length) % S.length]?.focus();
      }
    }
    function de(V, P) {
      l.selectedTransition === P && o("removeTransition", V);
    }
    function A() {
      f.value = "", i = void 0, F.clear(), ce = 0;
    }
    function W() {
      A(), o("clear");
    }
    const F = /* @__PURE__ */ new Map();
    let ce = 0;
    function h(V) {
      if (!V.target.closest('[role="button"]') && (F.set(V.pointerId, { x: V.clientX, y: V.clientY }), m.value?.setPointerCapture?.(V.pointerId), F.size === 2)) {
        const [P, S] = [...F.values()];
        ce = Math.hypot(P.x - S.x, P.y - S.y);
      }
    }
    function O(V) {
      const P = r.value?.getBoundingClientRect();
      if (!P?.width) return;
      if (i === V.pointerId && f.value) {
        D.value = { x: k.value.x + (V.clientX - P.left) * C.value.width / b.value / P.width, y: k.value.y + (V.clientY - P.top) * C.value.height / b.value / P.height };
        return;
      }
      const S = F.get(V.pointerId);
      if (S)
        if (F.set(V.pointerId, { x: V.clientX, y: V.clientY }), F.size === 2) {
          const [oe, xe] = [...F.values()], Ve = Math.hypot(oe.x - xe.x, oe.y - xe.y);
          ce && ve(Ve / ce), ce = Ve;
        } else k.value = { x: k.value.x - (V.clientX - S.x) * C.value.width / b.value / P.width, y: k.value.y - (V.clientY - S.y) * C.value.height / b.value / P.height };
    }
    function se(V) {
      i === V.pointerId && (f.value = "", i = void 0);
    }
    function ne(V) {
      F.delete(V.pointerId), ce = 0, se(V);
    }
    function ye(V) {
      V.ctrlKey && (V.preventDefault(), ve(Math.exp(-V.deltaY * 0.01)));
    }
    let z;
    ga(() => {
      if (m.value && Vr(m.value), typeof ResizeObserver < "u" && r.value) {
        let V = !0;
        z = new ResizeObserver(() => {
          const P = r.value?.getBoundingClientRect();
          if (!P?.width || !P.height) return;
          const S = C.value.width;
          u.value = P.width, (V || Math.abs(P.width - S) > 1) && (V ? pe() : p.value ? te() : M(), V = !1), ue();
        }), z.observe(r.value);
      }
    }), wt(() => z?.disconnect()), a({ fit: te, focus: () => m.value?.focus(), zoomIn: () => ve(1.2), zoomOut: () => ve(1 / 1.2) });
    function N(V) {
      return V.category === "completed" ? "check" : V.category === "canceled" ? "x" : V.id === l.process.initial ? "arrow-bar-to-right" : { gate: "shield-check", automated: "bolt", parallel: "arrows-split" }[V.kind ?? ""] ?? "user";
    }
    return (V, P) => (n(), g("section", {
      ref_key: "canvas",
      ref: m,
      class: ut(["work-process-canvas", { "work-process-scrollable": e.fitOnOpen && p.value }]),
      "aria-label": "Process map",
      tabindex: "0",
      onKeydown: [
        _,
        ze(Ee(W, ["stop"]), ["esc"])
      ],
      onPointerdown: h,
      onPointermove: O,
      onPointerup: ne,
      onPointerleave: se,
      onPointercancel: A,
      onWheel: ye
    }, [
      f.value ? (n(), g("p", Cr, "Choose the next stop. Escape cancels.")) : T("", !0),
      (n(), g("svg", {
        ref_key: "svg",
        ref: r,
        style: li({ height: C.value.height + "px" }),
        viewBox: L.value,
        role: "group",
        "aria-label": "States and transitions"
      }, [
        c("defs", null, [
          c("marker", {
            id: s(d) + "-arrow",
            viewBox: "0 0 8 8",
            refX: "7",
            refY: "4",
            markerWidth: "6",
            markerHeight: "6",
            orient: "auto"
          }, [...P[1] || (P[1] = [
            c("path", {
              d: "M0 0 L8 4 L0 8 z",
              class: "work-graph-arrow"
            }, null, -1)
          ])], 8, Tr)
        ]),
        (n(!0), g(Q, null, re(v.value.parallels, (S) => (n(), g("path", {
          key: S.key,
          d: S.path,
          class: "work-lane-line",
          "marker-end": `url(#${s(d)}-arrow)`
        }, [
          c("title", null, "Parallel lane from " + E(s(ke)(S.state)), 1)
        ], 8, Ir))), 128)),
        (n(!0), g(Q, null, re(v.value.edges, (S) => (n(), g("g", {
          key: S.key,
          class: ut(["work-graph-edge", ["work-edge-" + S.type, { "work-selected": e.selectedTransition === S.transition }]]),
          role: "button",
          tabindex: "0",
          "aria-label": "Edit transition " + s(je)(S.transition),
          "aria-pressed": e.selectedTransition === S.transition,
          "aria-keyshortcuts": e.selectedTransition === S.transition ? "Delete Backspace" : void 0,
          onKeydown: [
            ze((oe) => de(oe, S.transition), ["delete"]),
            ze((oe) => de(oe, S.transition), ["backspace"]),
            ze(Ee((oe) => o("transition", S.transition, oe.currentTarget), ["prevent"]), ["enter"]),
            ze(Ee((oe) => o("transition", S.transition, oe.currentTarget), ["prevent"]), ["space"])
          ],
          onFocus: (oe) => J(S),
          onClick: (oe) => o("transition", S.transition, oe.currentTarget)
        }, [
          c("path", {
            d: S.path,
            class: "work-edge-hit"
          }, null, 8, Ur),
          c("path", {
            d: S.path,
            class: "work-edge-line",
            "marker-end": `url(#${s(d)}-arrow)`
          }, null, 8, Er),
          c("rect", {
            x: S.x - S.width / 2,
            y: S.y - S.height / 2,
            width: S.width,
            height: S.height,
            rx: "6",
            class: "work-edge-label-bg"
          }, null, 8, Ar),
          c("text", {
            x: S.x,
            y: S.y - (S.lines.length - 1) * 8 + 4,
            class: "work-edge-label",
            "text-anchor": "middle"
          }, [
            (n(!0), g(Q, null, re(S.lines, (oe, xe) => (n(), g("tspan", {
              key: xe,
              x: S.x,
              dy: xe ? 16 : 0
            }, E(oe), 9, Pr))), 128))
          ], 8, Or)
        ], 42, Dr))), 128)),
        (n(!0), g(Q, null, re(v.value.nodes, (S) => (n(), g("g", {
          key: S.state.id,
          class: ut(["work-graph-node", ["work-stop-" + S.state.category, { "work-selected": e.selectedState === S.state }]]),
          role: "button",
          tabindex: "0",
          "aria-label": "Edit state " + s(ke)(S.state),
          "aria-pressed": e.selectedState === S.state,
          onClick: (oe) => I(S.state, oe),
          onKeydown: (oe) => X(oe, S.state),
          onFocus: (oe) => J(S),
          onPointerup: (oe) => j(oe, S.state)
        }, [
          c("rect", {
            x: S.x - S.width / 2,
            y: S.y - S.height / 2,
            width: S.width,
            height: S.height,
            rx: "10",
            class: "work-state-card"
          }, null, 8, Nr),
          c("circle", {
            cx: S.x - S.width / 2 + 22,
            cy: S.y - S.height / 2 + 25,
            r: "10",
            class: "work-stop-ring"
          }, null, 8, Mr),
          y(s(fe), {
            icon: "tabler:" + N(S.state),
            x: S.x - S.width / 2 + 15,
            y: S.y - S.height / 2 + 18,
            width: "14",
            height: "14",
            class: "work-stop-icon",
            "aria-hidden": "true"
          }, null, 8, ["icon", "x", "y"]),
          c("text", {
            x: S.x - S.width / 2 + 42,
            y: S.y - S.height / 2 + 29,
            class: "work-node-name"
          }, [
            (n(!0), g(Q, null, re(S.title, (oe, xe) => (n(), g("tspan", {
              key: xe,
              x: S.x - S.width / 2 + 42,
              dy: xe ? 18 : 0
            }, E(oe), 9, Lr))), 128))
          ], 8, Fr),
          c("text", {
            x: S.x - S.width / 2 + 16,
            y: S.y - S.height / 2 + 33 + S.title.length * 18,
            class: "work-node-meta"
          }, [
            (n(!0), g(Q, null, re(S.caption, (oe, xe) => (n(), g("tspan", {
              key: xe,
              x: S.x - S.width / 2 + 16,
              dy: xe ? 16 : 0
            }, E(oe), 9, zr))), 128)),
            e.draft.policy?.wip?.[S.state.id] ? (n(), g("tspan", jr, " · limit " + E(e.draft.policy.wip[S.state.id].limit), 1)) : T("", !0)
          ], 8, Br),
          (n(!0), g(Q, null, re(S.badges, (oe, xe) => (n(), g("g", {
            key: oe.id,
            class: "work-any-transition",
            role: "button",
            tabindex: "0",
            "aria-label": "Edit transition " + s(je)(oe),
            "aria-pressed": e.selectedTransition === oe,
            "aria-keyshortcuts": e.selectedTransition === oe ? "Delete Backspace" : void 0,
            onFocus: (Ve) => J(S),
            onKeydown: [
              ze((Ve) => de(Ve, oe), ["delete"]),
              ze((Ve) => de(Ve, oe), ["backspace"]),
              ze(Ee((Ve) => o("transition", oe, Ve.currentTarget), ["stop", "prevent"]), ["enter"]),
              ze(Ee((Ve) => o("transition", oe, Ve.currentTarget), ["stop", "prevent"]), ["space"])
            ],
            onClick: Ee((Ve) => o("transition", oe, Ve.currentTarget), ["stop"])
          }, [
            c("text", {
              x: S.x - S.width / 2 + 16,
              y: S.y - S.height / 2 + 33 + S.title.length * 18 + S.caption.length * 16 + S.badges.slice(0, xe).reduce((Ve, De) => Ve + s(Jt)(s(je)(De) + " works from any state").length * 18, 0),
              class: "work-node-meta"
            }, [
              (n(!0), g(Q, null, re(s(Jt)(s(je)(oe) + " works from any state"), (Ve, De) => (n(), g("tspan", {
                key: De,
                x: S.x - S.width / 2 + 16,
                dy: De ? 18 : 0
              }, E(Ve), 9, Gr))), 128))
            ], 8, qr)
          ], 40, Wr))), 128)),
          ["completed", "canceled"].includes(S.state.category) ? T("", !0) : (n(), g("circle", {
            key: 0,
            cx: v.value.direction === "TB" ? S.x : S.x + S.width / 2,
            cy: v.value.direction === "TB" ? S.y + S.height / 2 : S.y,
            r: "9",
            class: "work-node-connector",
            role: "button",
            tabindex: "0",
            "aria-label": "Connect from " + s(ke)(S.state),
            "aria-pressed": f.value === S.state.id,
            onFocus: (oe) => J(S),
            onPointerdown: Ee((oe) => $(oe, S), ["stop"]),
            onClick: Ee((oe) => U(S), ["stop"]),
            onKeydown: [
              ze(Ee((oe) => U(S), ["stop", "prevent"]), ["enter"]),
              ze(Ee((oe) => U(S), ["stop", "prevent"]), ["space"])
            ]
          }, null, 40, Kr))
        ], 42, Rr))), 128)),
        le.value ? (n(), g("path", {
          key: 0,
          d: `M ${v.value.direction === "TB" ? le.value.x : le.value.x + le.value.width / 2} ${v.value.direction === "TB" ? le.value.y + le.value.height / 2 : le.value.y} L ${D.value.x} ${D.value.y}`,
          class: "work-connect-ghost"
        }, null, 8, Hr)) : T("", !0)
      ], 12, Sr)),
      R.value < e.process.states.length ? (n(), g("div", Yr, [
        c("span", null, E(R.value) + " of " + E(e.process.states.length) + " states in view · Pan to see more", 1),
        p.value ? T("", !0) : (n(), H(s(ee), {
          key: 0,
          label: "Fit map",
          size: "small",
          text: "",
          onClick: P[0] || (P[0] = (S) => te())
        }))
      ])) : T("", !0),
      c("div", Xr, [
        c("span", null, E(e.process.states.length) + " states · " + E(Math.round(b.value * 100)) + "%", 1),
        P[2] || (P[2] = c("span", null, [
          c("i"),
          q("Transition")
        ], -1)),
        P[3] || (P[3] = c("span", null, [
          c("i", { class: "work-return-key" }),
          q("Return / loop")
        ], -1)),
        P[4] || (P[4] = c("span", null, "Drag to pan · Ctrl + scroll to zoom · Fit to reset the view", -1))
      ])
    ], 42, xr));
  }
}), Zr = {
  class: "work-process-list work-stack",
  "aria-label": "Process list"
}, Qr = { class: "work-table-scroll" }, _r = {
  class: "work-settings-table work-process-table",
  role: "table",
  "aria-label": "States"
}, ed = { role: "rowgroup" }, td = ["aria-selected"], ad = { role: "cell" }, ld = {
  key: 0,
  class: "work-muted work-small"
}, od = { role: "cell" }, id = { role: "cell" }, nd = {
  role: "cell",
  class: "work-process-list-actions"
}, sd = { class: "work-table-scroll" }, rd = {
  class: "work-settings-table work-process-table",
  role: "table",
  "aria-label": "Transitions"
}, dd = { role: "rowgroup" }, ud = ["aria-selected"], cd = { role: "cell" }, vd = {
  key: 0,
  class: "work-muted"
}, md = { role: "cell" }, fd = { role: "cell" }, pd = {
  role: "cell",
  class: "work-process-list-actions"
}, bd = /* @__PURE__ */ we({
  __name: "ProcessList",
  props: {
    process: {},
    selectedState: {},
    selectedTransition: {},
    counts: {}
  },
  emits: ["state", "transition", "removeState", "removeTransition"],
  setup(e) {
    return (a, t) => (n(), g("section", Zr, [
      t[6] || (t[6] = c("h3", null, "States", -1)),
      c("div", Qr, [
        c("table", _r, [
          t[2] || (t[2] = c("thead", { role: "rowgroup" }, [
            c("tr", { role: "row" }, [
              c("th", {
                role: "columnheader",
                scope: "col"
              }, "Name"),
              c("th", {
                role: "columnheader",
                scope: "col"
              }, "Phase"),
              c("th", {
                role: "columnheader",
                scope: "col"
              }, "Kind"),
              c("th", {
                role: "columnheader",
                scope: "col"
              }, "Actions")
            ])
          ], -1)),
          c("tbody", ed, [
            (n(!0), g(Q, null, re(e.process.states, (l) => (n(), g("tr", {
              key: l.id,
              "aria-selected": e.selectedState === l,
              role: "row"
            }, [
              c("td", ad, [
                y(s(Se), {
                  modelValue: l.name,
                  "onUpdate:modelValue": (o) => l.name = o,
                  "aria-label": "Name of " + s(ke)(l)
                }, null, 8, ["modelValue", "onUpdate:modelValue", "aria-label"]),
                e.counts ? (n(), g("p", ld, E(e.counts[l.id] ?? 0) + " here", 1)) : T("", !0)
              ]),
              c("td", od, [
                t[0] || (t[0] = c("span", {
                  class: "work-process-cell-label",
                  "aria-hidden": "true"
                }, "Phase", -1)),
                q(E(s(jt)(l.category)), 1)
              ]),
              c("td", id, [
                t[1] || (t[1] = c("span", {
                  class: "work-process-cell-label",
                  "aria-hidden": "true"
                }, "Kind", -1)),
                y(s(Ye), { severity: "secondary" }, {
                  default: G(() => [
                    q(E(s(Na)(l.kind)), 1)
                  ]),
                  _: 2
                }, 1024)
              ]),
              c("td", nd, [
                y(s(ee), {
                  size: "small",
                  text: "",
                  severity: "secondary",
                  "aria-label": "Edit state " + s(ke)(l),
                  onClick: (o) => a.$emit("state", l, o.currentTarget)
                }, {
                  default: G(() => [
                    y(s(fe), { icon: "tabler:pencil" })
                  ]),
                  _: 1
                }, 8, ["aria-label", "onClick"]),
                y(s(ee), {
                  size: "small",
                  text: "",
                  severity: "danger",
                  "aria-label": "Remove state " + s(ke)(l),
                  onClick: (o) => a.$emit("removeState", l)
                }, {
                  default: G(() => [
                    y(s(fe), { icon: "tabler:trash" })
                  ]),
                  _: 1
                }, 8, ["aria-label", "onClick"])
              ])
            ], 8, td))), 128))
          ])
        ])
      ]),
      t[7] || (t[7] = c("h3", null, "Transitions", -1)),
      c("div", sd, [
        c("table", rd, [
          t[5] || (t[5] = c("thead", { role: "rowgroup" }, [
            c("tr", { role: "row" }, [
              c("th", {
                role: "columnheader",
                scope: "col"
              }, "Name"),
              c("th", {
                role: "columnheader",
                scope: "col"
              }, "From"),
              c("th", {
                role: "columnheader",
                scope: "col"
              }, "To"),
              c("th", {
                role: "columnheader",
                scope: "col"
              }, "Actions")
            ])
          ], -1)),
          c("tbody", dd, [
            (n(!0), g(Q, null, re(e.process.transitions ?? [], (l) => (n(), g("tr", {
              key: l.id,
              "aria-selected": e.selectedTransition === l,
              role: "row"
            }, [
              c("td", cd, [
                y(s(Se), {
                  modelValue: l.name,
                  "onUpdate:modelValue": (o) => l.name = o,
                  placeholder: s(je)(l),
                  "aria-label": "Name of " + s(je)(l)
                }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder", "aria-label"]),
                l.when || l.require?.length || l.guards?.length ? (n(), g("p", vd, "Has requirements")) : T("", !0)
              ]),
              c("td", md, [
                t[3] || (t[3] = c("span", {
                  class: "work-process-cell-label",
                  "aria-hidden": "true"
                }, "From", -1)),
                q(" " + E(l.from === "any" ? "Any state" : l.from.map((o) => s(ke)(e.process.states.find((d) => d.id === o))).join(", ")), 1)
              ]),
              c("td", fd, [
                t[4] || (t[4] = c("span", {
                  class: "work-process-cell-label",
                  "aria-hidden": "true"
                }, "To", -1)),
                q(E(s(ke)(e.process.states.find((o) => o.id === l.to))), 1)
              ]),
              c("td", pd, [
                y(s(ee), {
                  size: "small",
                  text: "",
                  severity: "secondary",
                  "aria-label": "Edit transition " + s(je)(l),
                  onClick: (o) => a.$emit("transition", l, o.currentTarget)
                }, {
                  default: G(() => [
                    y(s(fe), { icon: "tabler:pencil" })
                  ]),
                  _: 1
                }, 8, ["aria-label", "onClick"]),
                y(s(ee), {
                  size: "small",
                  text: "",
                  severity: "danger",
                  "aria-label": "Remove transition " + s(je)(l),
                  onClick: (o) => a.$emit("removeTransition", l)
                }, {
                  default: G(() => [
                    y(s(fe), { icon: "tabler:trash" })
                  ]),
                  _: 1
                }, 8, ["aria-label", "onClick"])
              ])
            ], 8, ud))), 128))
          ])
        ])
      ])
    ]));
  }
}), hd = { class: "work-stack work-transition-settings" }, gd = { class: "work-stack work-tight" }, yd = { class: "work-row" }, kd = { key: 0 }, wd = { class: "work-stack" }, Vd = { class: "work-row" }, $d = { class: "work-row" }, xd = { class: "work-stack work-tight" }, Cd = { class: "work-row" }, Sd = { class: "work-stack work-tight" }, Td = { class: "work-stack work-tight" }, Id = /* @__PURE__ */ we({
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
    function d(f, m) {
      const r = t.transition.set?.[f];
      !r || !t.transition.set || (t.transition.set[f] = { field: r.field, ...m === "clear" ? { clear: !0 } : m === "copy" ? { copy: "" } : { value: "" } });
    }
    return (f, m) => (n(), g("div", hd, [
      c("label", gd, [
        m[15] || (m[15] = q("To state", -1)),
        y(s(me), {
          modelValue: e.transition.to,
          "onUpdate:modelValue": m[0] || (m[0] = (r) => e.transition.to = r),
          "aria-label": "To state",
          appendTo: "self",
          optionLabel: "label",
          optionValue: "value",
          options: e.process.states.map((r) => ({ label: s(ke)(r), value: r.id }))
        }, null, 8, ["modelValue", "options"])
      ]),
      c("label", yd, [
        m[16] || (m[16] = c("span", { class: "work-spacer" }, "Works from any state", -1)),
        y(s(Qe), {
          "model-value": e.transition.from === "any",
          "aria-label": "Works from any state",
          "onUpdate:modelValue": m[1] || (m[1] = (r) => e.transition.from = r ? "any" : [])
        }, null, 8, ["model-value"])
      ]),
      e.transition.from !== "any" ? (n(), H(ct, {
        key: 0,
        label: "From states",
        options: e.process.states.map((r) => ({ value: r.id, label: s(ke)(r) })),
        modelValue: e.transition.from,
        "onUpdate:modelValue": m[2] || (m[2] = (r) => e.transition.from = r)
      }, null, 8, ["options", "modelValue"])) : T("", !0),
      m[24] || (m[24] = c("h4", { class: "work-process-group" }, "Must be filled", -1)),
      y(ct, {
        label: "Required fields",
        options: e.draft.fields?.map((r) => ({ value: r.code, label: r.title || r.code })) ?? [],
        modelValue: e.transition.require,
        "onUpdate:modelValue": m[3] || (m[3] = (r) => e.transition.require = r)
      }, null, 8, ["options", "modelValue"]),
      m[25] || (m[25] = c("h4", { class: "work-process-group" }, "Only when", -1)),
      y(Cl, {
        label: "Allow this transition when",
        draft: e.draft,
        "board-id": e.boardId,
        "model-value": e.transition.when,
        "onUpdate:modelValue": m[4] || (m[4] = (r) => e.transition.when = r),
        onValidity: m[5] || (m[5] = (r) => l("validity", "when", r))
      }, null, 8, ["draft", "board-id", "model-value"]),
      e.guards?.length || e.transition.guards?.length ? (n(), H(ct, {
        key: 1,
        label: "Installed checks",
        options: [...(e.guards ?? []).map((r) => ({ value: r.id, label: r.title })), ...(e.transition.guards ?? []).filter((r) => !e.guards?.some((i) => i.id === r)).map((r) => ({ value: r, label: e.guards ? "Unavailable check" : "Configured check" }))],
        modelValue: e.transition.guards,
        "onUpdate:modelValue": m[6] || (m[6] = (r) => e.transition.guards = r)
      }, null, 8, ["options", "modelValue"])) : T("", !0),
      (n(!0), g(Q, null, re(e.guards?.filter((r) => e.transition.guards?.includes(r.id)) ?? [], (r) => (n(), g("p", {
        key: r.id,
        class: "work-muted work-small"
      }, [
        q(E(r.description || r.title + " can stop this transition.") + " ", 1),
        r.reads?.length ? (n(), g("span", kd, " Checks " + E(r.reads.map((i) => e.draft.fields?.find((u) => u.code === i)?.title || "a configured field").join(", ")) + ".", 1)) : T("", !0)
      ]))), 128)),
      y(Ne, {
        class: "work-disclosure",
        label: "Advanced transition settings"
      }, {
        default: G(() => [
          c("div", wd, [
            c("label", Vd, [
              m[17] || (m[17] = c("span", { class: "work-spacer" }, "Happens automatically", -1)),
              y(s(Qe), {
                "model-value": e.transition.auto,
                "onUpdate:modelValue": m[7] || (m[7] = (r) => {
                  e.transition.auto = r, r || delete e.transition.default;
                }),
                "aria-label": "Automatic transition"
              }, null, 8, ["model-value"])
            ]),
            c("label", $d, [
              m[18] || (m[18] = c("span", { class: "work-spacer" }, "Default automatic transition", -1)),
              y(s(Qe), {
                modelValue: e.transition.default,
                "onUpdate:modelValue": m[8] || (m[8] = (r) => e.transition.default = r),
                disabled: !e.transition.auto,
                "aria-label": "Default transition"
              }, null, 8, ["modelValue", "disabled"])
            ]),
            m[23] || (m[23] = c("h4", { class: "work-process-group" }, "Also sets", -1)),
            (n(!0), g(Q, null, re(e.transition.set ?? [], (r, i) => (n(), g("div", {
              key: i,
              class: "work-process-value work-stack work-tight"
            }, [
              c("label", xd, [
                m[19] || (m[19] = q("Field", -1)),
                y(s(me), {
                  modelValue: r.field,
                  "onUpdate:modelValue": (u) => r.field = u,
                  appendTo: "self",
                  optionLabel: "label",
                  optionValue: "value",
                  options: e.draft.fields?.map((u) => ({ value: u.code, label: u.title || u.code })) ?? []
                }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
              ]),
              c("div", Cd, [
                y(s(me), {
                  "model-value": r.clear ? "clear" : r.copy !== void 0 ? "copy" : "value",
                  "aria-label": "Value action",
                  appendTo: "self",
                  options: [
                    { label: "Set value", value: "value" },
                    { label: "Clear value", value: "clear" },
                    { label: "Copy field", value: "copy" }
                  ],
                  optionLabel: "label",
                  optionValue: "value",
                  "onUpdate:modelValue": (u) => d(i, u)
                }, null, 8, ["model-value", "onUpdate:modelValue"]),
                y(s(ee), {
                  text: "",
                  severity: "danger",
                  "aria-label": "Remove value " + (i + 1),
                  onClick: (u) => e.transition.set?.splice(i, 1)
                }, {
                  default: G(() => [
                    y(s(fe), { icon: "tabler:trash" })
                  ]),
                  _: 1
                }, 8, ["aria-label", "onClick"])
              ]),
              r.copy !== void 0 ? (n(), H(s(me), {
                key: 0,
                modelValue: r.copy,
                "onUpdate:modelValue": (u) => r.copy = u,
                "aria-label": "Copy from field",
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                options: e.draft.fields?.map((u) => ({ value: u.code, label: u.title || u.code })) ?? []
              }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])) : r.clear ? T("", !0) : (n(!0), g(Q, { key: 1 }, re(e.draft.fields?.filter((u) => u.code === r.field) ?? [], (u) => (n(), H(wo, {
                key: u.code,
                "board-id": e.boardId ?? "",
                field: u,
                modelValue: r.value,
                "onUpdate:modelValue": (p) => r.value = p,
                onValidity: (p) => l("validity", "effect-" + i, p)
              }, null, 8, ["board-id", "field", "modelValue", "onUpdate:modelValue", "onValidity"]))), 128))
            ]))), 128)),
            y(s(ee), {
              label: "Add value",
              severity: "secondary",
              outlined: "",
              size: "small",
              onClick: o
            }, {
              icon: G(() => [
                y(s(fe), { icon: "tabler:plus" })
              ]),
              _: 1
            }),
            c("label", Sd, [
              m[20] || (m[20] = q("Offer to people", -1)),
              y(s(me), {
                "model-value": e.transition.people,
                "aria-label": "Offer to people",
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                options: [{ label: "Work default", value: void 0 }, { label: "Offer explicitly", value: !0 }, { label: "Process engine only", value: !1 }],
                "onUpdate:modelValue": m[9] || (m[9] = (r) => e.transition.people = r)
              }, null, 8, ["model-value"]),
              m[21] || (m[21] = c("span", { class: "work-muted work-small" }, "Work default can hide a stage route from the list while still allowing it by name. Process engine only reserves the route for the engine and board administrators using force.", -1))
            ]),
            c("label", Td, [
              m[22] || (m[22] = q("Evaluation order", -1)),
              y(s(gt), {
                "model-value": e.transition.order ?? null,
                "aria-label": "Transition order",
                min: 0,
                useGrouping: !1,
                "onUpdate:modelValue": m[10] || (m[10] = (r) => e.transition.order = r ?? void 0)
              }, null, 8, ["model-value"])
            ]),
            y(Dt, {
              label: "Set values",
              "model-value": e.transition.set,
              shape: "array",
              "onUpdate:modelValue": m[11] || (m[11] = (r) => e.transition.set = r),
              onValidity: m[12] || (m[12] = (r) => l("validity", "set", r))
            }, null, 8, ["model-value"]),
            y(Dt, {
              label: "Guards",
              "model-value": e.transition.guards,
              shape: "array",
              "onUpdate:modelValue": m[13] || (m[13] = (r) => e.transition.guards = r),
              onValidity: m[14] || (m[14] = (r) => l("validity", "guards", r))
            }, null, 8, ["model-value"])
          ])
        ]),
        _: 1
      })
    ]));
  }
}), to = /* @__PURE__ */ we({
  __name: "CapacityControl",
  props: {
    draft: {},
    state: {},
    label: {},
    hard: { type: Boolean }
  },
  setup(e) {
    const a = e, t = K(() => a.draft.policy?.wip?.[a.state]);
    function l(d) {
      if (d === null) {
        a.draft.policy?.wip && delete a.draft.policy.wip[a.state];
        return;
      }
      const f = a.draft.policy ??= {}, m = f.wip ??= {};
      m[a.state] = { ...m[a.state], limit: d };
    }
    function o(d) {
      t.value && (t.value.hard = d);
    }
    return (d, f) => e.hard ? (n(), H(s(Qe), {
      key: 0,
      "aria-label": e.label,
      disabled: !t.value,
      "model-value": t.value?.hard ?? !1,
      "onUpdate:modelValue": o
    }, null, 8, ["aria-label", "disabled", "model-value"])) : (n(), H(s(gt), {
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
async function cl(e, a) {
  try {
    const { data: t } = await fl.get(e, a ? { params: a } : void 0);
    if (!t?.success) {
      const l = t?.message || (typeof t?.error == "string" ? t.error : t?.error?.message) || "Could not read published Flow.";
      throw new vl({ message: l, details: t?.details }, "Published Flow");
    }
    return t;
  } catch (t) {
    throw vi(t, "Published Flow");
  }
}
const ao = (e) => `/api/v1/workflows/${encodeURIComponent(e)}/versions`, kl = {
  title: async (e) => (await cl("/api/v1/workflows/published", { id: e })).item?.title,
  versions: async (e) => (await cl(ao(e))).versions ?? [],
  check: async (e) => {
    if ((await cl(`${ao(e.id)}/${e.version}`)).version?.version !== e.version) throw new Error("The published version is unavailable.");
  }
}, Dd = {
  class: "work-stack work-tight",
  "aria-label": "Stage Flow"
}, Ud = {
  key: 0,
  class: "work-muted work-small"
}, Ed = {
  key: 1,
  class: "kx-err work-alert-actions"
}, Ad = { role: "alert" }, Od = ["schema", "config", "title"], Pd = {
  key: 3,
  class: "kx-err",
  role: "alert"
}, Rd = {
  key: 4,
  class: "work-stack work-tight"
}, Nd = ["value", "aria-busy", "disabled"], Md = {
  value: "",
  disabled: ""
}, Fd = ["value"], Ld = {
  key: 5,
  class: "work-muted work-small",
  role: "status"
}, Bd = /* @__PURE__ */ we({
  __name: "StageFlow",
  props: {
    modelValue: {}
  },
  emits: ["update:modelValue", "validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = B(!1), d = B(""), f = B([]), m = B(!1), r = B(""), i = B(!1), u = K(() => d.value || t.modelValue?.id), p = JSON.stringify({ properties: { flow_ref: { title: "Published Flow", picker: "wc-workflow-picker" } } }), w = K(() => JSON.stringify(t.modelValue ? { flow_ref: t.modelValue } : {}));
    let v = 0;
    async function b() {
      o.value = await It("wc-workflow-picker");
    }
    b();
    async function k() {
      const R = ++v, M = u.value, L = t.modelValue;
      if (m.value = !!M, r.value = "", f.value = [], !!M)
        try {
          const [le] = await Promise.all([kl.versions(M), !i.value && L ? kl.check(L) : Promise.resolve()]);
          if (R !== v) return;
          if (f.value = le.filter((te) => Number.isInteger(te.version) && te.version > 0), !i.value && L && !f.value.some((te) => te.version === L.version)) throw new Error("The published version is unavailable.");
        } catch (le) {
          R === v && (r.value = ot(le, "Could not read published Flow."));
        } finally {
          R === v && (m.value = !1);
        }
    }
    Ie([u, () => t.modelValue?.version, i], k, { immediate: !0 }), Ie(i, (R) => l("validity", !R), { immediate: !0 });
    function D(R) {
      const M = R.detail?.flow_ref;
      M?.kind !== "flow" || !M.id || (i.value = !0, d.value = M.id);
    }
    function x(R) {
      !u.value || !f.value.some((M) => M.version === R) || (l("update:modelValue", { kind: "flow", id: u.value, version: R }), i.value = !1, d.value = "");
    }
    function C() {
      l("update:modelValue", void 0), i.value = !1, d.value = "";
    }
    return wt(() => {
      v++, l("validity", !0);
    }), (R, M) => (n(), g("section", Dd, [
      M[4] || (M[4] = c("h4", { class: "work-field-label" }, "What runs", -1)),
      e.modelValue ? T("", !0) : (n(), g("p", Ud, "No Flow bound. This stage keeps its existing external execution contract.")),
      r.value ? (n(), g("div", Ed, [
        c("p", Ad, [
          q(E(i.value ? "Flow versions unavailable" : "Flow binding unavailable"), 1),
          !i.value && e.modelValue ? (n(), g(Q, { key: 0 }, [
            q(" (v" + E(e.modelValue.version) + ")", 1)
          ], 64)) : T("", !0),
          q(". " + E(r.value), 1)
        ]),
        y(s(ee), {
          label: "Reload Flow",
          severity: "secondary",
          text: "",
          onClick: k
        })
      ])) : T("", !0),
      o.value ? (n(), g("wc-workflow-picker", {
        key: 2,
        schema: s(p),
        config: w.value,
        title: e.modelValue?.id,
        onChange: D
      }, null, 40, Od)) : (n(), g("p", Pd, [
        M[2] || (M[2] = q("Published Flow picker unavailable.", -1)),
        y(s(ee), {
          label: "Reload Flow picker",
          text: "",
          severity: "secondary",
          onClick: b
        })
      ])),
      u.value ? (n(), g("label", Rd, [
        M[3] || (M[3] = q(" Published version ", -1)),
        c("select", {
          class: "p-inputtext work-flow-version",
          value: i.value ? "" : e.modelValue?.version,
          "aria-busy": m.value,
          disabled: m.value || !!r.value,
          onChange: M[0] || (M[0] = (L) => x(Number(L.target.value)))
        }, [
          c("option", Md, E(m.value ? "Loading versions…" : "Choose a published version"), 1),
          (n(!0), g(Q, null, re(f.value, (L) => (n(), g("option", {
            key: L.version,
            value: L.version
          }, "v" + E(L.version), 9, Fd))), 128))
        ], 40, Nd)
      ])) : T("", !0),
      i.value ? (n(), g("p", Ld, "Choose a published version to finish selecting the Flow.")) : T("", !0),
      e.modelValue || i.value ? (n(), H(s(ee), {
        key: 6,
        label: i.value ? "Cancel Flow selection" : "Remove Flow binding",
        "aria-label": i.value ? "Cancel Flow selection" : "Remove Flow binding",
        severity: "secondary",
        text: "",
        onClick: M[1] || (M[1] = (L) => i.value ? (i.value = !1, d.value = "") : C())
      }, null, 8, ["label", "aria-label"])) : T("", !0)
    ]));
  }
}), wl = { seconds: 1, minutes: 60, hours: 3600, days: 86400 };
function ra(e, a) {
  const t = /^P(\d+)W$/.exec(e), l = /^P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+\.?\d*)S)?)?$/.exec(e);
  if (!t && (!l || e === "P" || e.endsWith("T"))) return;
  const o = t ? Number(t[1]) * 604800 : Number(l[1] ?? 0) * 86400 + Number(l[2] ?? 0) * 3600 + Number(l[3] ?? 0) * 60 + Number(l[4] ?? 0);
  if (!Number.isFinite(o) || o <= 0) return;
  const d = a ?? (o % 86400 === 0 ? "days" : o % 3600 === 0 ? "hours" : o < 60 ? "seconds" : "minutes");
  return { amount: o / wl[d], unit: d };
}
function zd(e, a) {
  if (e == null) return;
  if (!Number.isFinite(e * wl[a]) || e <= 0) throw new Error("Enter a positive duration.");
  const t = (o) => o.toLocaleString("en-US", { useGrouping: !1, maximumSignificantDigits: 21 });
  if (!Number.isInteger(e)) return `PT${t(e * wl[a])}S`;
  const l = { seconds: "S", minutes: "M", hours: "H", days: "D" }[a];
  return (a === "days" ? "P" : "PT") + t(e) + l;
}
const jd = { class: "work-stack work-tight" }, Wd = {
  key: 0,
  class: "work-error",
  role: "alert"
}, Ft = /* @__PURE__ */ we({
  __name: "DurationControl",
  props: {
    modelValue: {},
    label: {},
    disabled: { type: Boolean }
  },
  emits: ["update:modelValue", "validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = "duration:" + zt(), d = B(), f = B(""), m = K(() => t.modelValue ? ra(t.modelValue) : void 0), r = K(() => d.value ?? m.value?.unit ?? "days");
    Ie(() => t.modelValue, (x) => {
      f.value = "", l("validity", !x || !!m.value, o);
    }, { immediate: !0 });
    const i = K(() => t.modelValue ? ra(t.modelValue, r.value)?.amount ?? null : null);
    function u(x) {
      try {
        const C = zd(x, r.value);
        f.value = "", l("update:modelValue", C), l("validity", !0, o);
      } catch (C) {
        f.value = C.message, l("validity", !1, o);
      }
    }
    let p;
    function w(x) {
      x.target instanceof HTMLInputElement && (p = x.target.value);
    }
    function v(x) {
      if (p === void 0) return;
      const C = p;
      p = void 0, k(x, C);
    }
    function b(x) {
      p = void 0;
      const C = x.originalEvent?.target instanceof HTMLInputElement ? x.originalEvent.target.value : x.formattedValue;
      k(x.value, C);
    }
    function k(x, C) {
      if (C.trim() && (typeof x != "number" || !Number.isFinite(x))) {
        f.value = "Enter a positive duration.", l("validity", !1, o);
        return;
      }
      d.value = r.value, u(typeof x == "number" ? x : null);
    }
    function D(x) {
      const C = i.value;
      d.value = x, !(t.modelValue && !m.value) && u(C);
    }
    return wt(() => l("validity", !0, o)), (x, C) => (n(), g("label", jd, [
      q(E(e.label), 1),
      c("span", {
        class: "work-duration-control",
        style: { "max-width": "360px" },
        onInputCapture: w
      }, [
        y(s(gt), {
          "model-value": i.value,
          "aria-label": e.label,
          min: 0,
          "aria-invalid": !!f.value || !!e.modelValue && !s(ra)(e.modelValue),
          disabled: e.disabled,
          useGrouping: !1,
          "max-fraction-digits": r.value === "seconds" ? 20 : 3,
          onInput: b,
          "onUpdate:modelValue": v
        }, null, 8, ["model-value", "aria-label", "aria-invalid", "disabled", "max-fraction-digits"]),
        y(s(me), {
          "model-value": r.value,
          "aria-label": e.label + " unit",
          disabled: e.disabled,
          options: [{ label: "Seconds", value: "seconds" }, { label: "Minutes", value: "minutes" }, { label: "Hours", value: "hours" }, { label: "Days", value: "days" }],
          optionLabel: "label",
          optionValue: "value",
          appendTo: "self",
          "onUpdate:modelValue": C[0] || (C[0] = (R) => D(R))
        }, null, 8, ["model-value", "aria-label", "disabled"])
      ], 32),
      f.value || e.modelValue && !s(ra)(e.modelValue) ? (n(), g("span", Wd, E(f.value || `Unsupported duration: ${e.modelValue}`), 1)) : T("", !0)
    ]));
  }
}), qd = { class: "work-stack" }, Gd = { class: "work-settings-grid" }, Kd = { class: "work-stack work-tight" }, Hd = { class: "work-stack work-tight" }, Yd = {
  key: 1,
  class: "work-stack work-tight"
}, Xd = { class: "work-stack work-tight" }, Jd = { class: "work-settings-grid" }, Zd = { class: "work-row" }, Qd = { class: "work-stack work-tight" }, _d = {
  key: 0,
  class: "work-stack work-tight"
}, eu = /* @__PURE__ */ we({
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
    function d() {
      const i = t.state.timers ?? (t.state.timers = []);
      i.push({ id: Mt("timer", i), after: "P1D", then: { emit: "reminder" } });
    }
    function f(i, u) {
      delete i.after, delete i.at_field, u === "after" ? i.after = "P1D" : i.at_field = "";
    }
    function m(i, u, p) {
      p ? i[u] = p : (delete i[u], delete i.table);
    }
    function r(i, u) {
      i.then = u === "emit" ? { emit: "" } : { transition: "" };
    }
    return (i, u) => (n(), g("section", qd, [
      u[8] || (u[8] = c("h4", null, "Timers", -1)),
      (n(!0), g(Q, null, re(o(), (p, w) => (n(), g("article", {
        key: p.id,
        class: "work-settings-card work-stack"
      }, [
        c("div", Gd, [
          c("label", Kd, [
            u[2] || (u[2] = q("Timer ID", -1)),
            y(s(Se), {
              modelValue: p.id,
              "onUpdate:modelValue": (v) => p.id = v,
              required: "",
              pattern: "[a-z][a-z0-9_]*"
            }, null, 8, ["modelValue", "onUpdate:modelValue"])
          ]),
          c("label", Hd, [
            u[3] || (u[3] = q("Deadline", -1)),
            y(s(me), {
              "model-value": p.at_field !== void 0 ? "at_field" : "after",
              "onUpdate:modelValue": (v) => f(p, v),
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
          p.after !== void 0 ? (n(), H(Ft, {
            key: 0,
            modelValue: p.after,
            "onUpdate:modelValue": (v) => p.after = v,
            label: "After",
            onValidity: u[0] || (u[0] = (v, b) => l("validity", b, v))
          }, null, 8, ["modelValue", "onUpdate:modelValue"])) : (n(), g("label", Yd, [
            u[4] || (u[4] = q("At field", -1)),
            y(s(me), {
              modelValue: p.at_field,
              "onUpdate:modelValue": (v) => p.at_field = v,
              appendTo: "self",
              optionLabel: "label",
              optionValue: "value",
              optionDisabled: "disabled",
              options: [
                ...(e.draft.fields?.filter((v) => v.form === "time") ?? []).map((v) => ({
                  label: v.code,
                  value: v.code,
                  disabled: !1
                }))
              ]
            }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
          ])),
          c("label", Xd, [
            u[5] || (u[5] = q("Duration by field", -1)),
            y(s(me), {
              "model-value": p.by ?? "",
              "onUpdate:modelValue": (v) => m(p, "by", v),
              appendTo: "self",
              optionLabel: "label",
              optionValue: "value",
              optionDisabled: "disabled",
              options: [
                { label: "Fixed duration", value: "", disabled: !1 },
                ...(e.draft.fields ?? []).map((v) => ({
                  label: v.code,
                  value: v.code,
                  disabled: !1
                }))
              ]
            }, null, 8, ["model-value", "onUpdate:modelValue", "options"])
          ])
        ]),
        p.by ? (n(), H(Dt, {
          key: 0,
          label: "Duration table",
          hint: "Map field values to ISO durations.",
          "model-value": p.table,
          shape: "object",
          "onUpdate:modelValue": (v) => p.table = v,
          onValidity: (v) => l("validity", "table-" + w, v)
        }, null, 8, ["model-value", "onUpdate:modelValue", "onValidity"])) : T("", !0),
        c("div", Jd, [
          y(Ft, {
            modelValue: p.repeat,
            "onUpdate:modelValue": (v) => p.repeat = v,
            label: "Repeat every",
            onValidity: u[1] || (u[1] = (v, b) => l("validity", b, v)),
            disabled: p.interrupting
          }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"]),
          c("label", Zd, [
            y(s(Bt), {
              modelValue: p.interrupting,
              "onUpdate:modelValue": [(v) => p.interrupting = v, (v) => p.interrupting && delete p.repeat],
              binary: ""
            }, null, 8, ["modelValue", "onUpdate:modelValue"]),
            u[6] || (u[6] = q("Interrupting", -1))
          ]),
          c("label", Qd, [
            u[7] || (u[7] = q("Then", -1)),
            y(s(me), {
              "model-value": p.then?.transition !== void 0 ? "transition" : "emit",
              "onUpdate:modelValue": (v) => r(p, v),
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
          p.then ? (n(), g("label", _d, [
            q(E(p.then.transition !== void 0 ? "Transition ID" : "Event name"), 1),
            p.then.transition !== void 0 ? (n(), H(s(Se), {
              key: 0,
              modelValue: p.then.transition,
              "onUpdate:modelValue": (v) => p.then.transition = v
            }, null, 8, ["modelValue", "onUpdate:modelValue"])) : (n(), H(s(Se), {
              key: 1,
              modelValue: p.then.emit,
              "onUpdate:modelValue": (v) => p.then.emit = v
            }, null, 8, ["modelValue", "onUpdate:modelValue"]))
          ])) : T("", !0)
        ]),
        y(s(ee), {
          severity: "secondary",
          onClick: (v) => o().splice(w, 1),
          "aria-label": "Remove timer",
          text: "",
          size: "small"
        }, {
          default: G(() => [
            y(s(fe), {
              icon: "tabler:trash",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        }, 8, ["onClick"])
      ]))), 128)),
      y(s(ee), {
        label: "Add timer",
        severity: "secondary",
        onClick: d,
        outlined: ""
      }, {
        icon: G(() => [
          y(s(fe), {
            icon: "tabler:plus",
            "aria-hidden": "true"
          })
        ]),
        _: 1
      })
    ]));
  }
}), tu = ["aria-label"], au = { class: "work-stack work-tight" }, lu = {
  key: 0,
  class: "work-stack work-tight"
}, ou = /* @__PURE__ */ we({
  __name: "PrincipalSourceEditor",
  props: {
    modelValue: {},
    draft: {},
    boardId: {},
    label: {}
  },
  emits: ["update:modelValue", "validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = K(() => Array.isArray(t.modelValue) ? "principals" : "field" in t.modelValue ? "field" : "group"), d = K(() => Array.isArray(t.modelValue) ? t.modelValue : "group" in t.modelValue && t.modelValue.group ? [{ kind: "group", id: t.modelValue.group }] : []);
    function f(r) {
      l("update:modelValue", r === "field" ? { field: "" } : r === "group" ? { group: "" } : []);
    }
    function m(r) {
      l("update:modelValue", o.value === "group" ? { group: r.at(-1)?.id ?? "" } : r);
    }
    return vo(() => l("validity", Array.isArray(t.modelValue) ? t.modelValue.length > 0 : "field" in t.modelValue ? !!t.modelValue.field : !!t.modelValue.group)), wt(() => l("validity", !0)), (r, i) => (n(), g("section", {
      class: "work-stack work-tight",
      "aria-label": e.label
    }, [
      c("label", au, [
        q(E(e.label) + " source", 1),
        y(s(me), {
          "model-value": o.value,
          "aria-label": e.label + " source",
          options: [{ label: "Group", value: "group" }, { label: "People and groups", value: "principals" }, { label: "Principal field", value: "field" }],
          optionLabel: "label",
          optionValue: "value",
          appendTo: "self",
          "onUpdate:modelValue": f
        }, null, 8, ["model-value", "aria-label"])
      ]),
      "field" in e.modelValue ? (n(), g("label", lu, [
        i[1] || (i[1] = q("Principal field", -1)),
        y(s(me), {
          "model-value": e.modelValue.field,
          "aria-label": e.label + " field",
          options: e.draft.fields?.filter((u) => u.type === "principal").map((u) => ({ label: u.title || u.code, value: u.code })) ?? [],
          optionLabel: "label",
          optionValue: "value",
          appendTo: "self",
          "onUpdate:modelValue": i[0] || (i[0] = (u) => l("update:modelValue", { field: u }))
        }, null, 8, ["model-value", "aria-label", "options"])
      ])) : (n(), H(Sl, {
        key: 1,
        "board-id": e.boardId,
        label: e.label,
        kinds: o.value === "group" ? "group" : "user,group,service",
        "model-value": d.value,
        "onUpdate:modelValue": m
      }, null, 8, ["board-id", "label", "kinds", "model-value"]))
    ], 8, tu));
  }
}), iu = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, nu = {
  class: "work-stack work-tight",
  "aria-label": "Approval sources"
}, su = { class: "work-row" }, ru = {
  key: 0,
  class: "work-stack work-tight"
}, du = ["kinds", "value"], uu = {
  key: 2,
  class: "work-muted work-small",
  role: "status"
}, cu = {
  key: 3,
  class: "work-chips"
}, vu = { class: "work-row work-small" }, mu = { class: "work-stack work-tight" }, fu = {
  key: 4,
  class: "work-error work-small",
  role: "alert"
}, pu = {
  key: 5,
  class: "work-muted work-small"
}, bu = /* @__PURE__ */ we({
  __name: "ApproversEditor",
  props: {
    approvals: {},
    boardId: {}
  },
  emits: ["validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, { principalLabel: o, rememberPrincipal: d, nameError: f } = mo(() => t.boardId ?? "", () => Array.isArray(t.approvals.from) ? t.approvals.from : "group" in t.approvals.from ? [{ kind: "group", id: t.approvals.from.group }] : []), m = B(!1), r = K(() => Array.isArray(t.approvals.from) ? "principals" : "field" in t.approvals.from ? "field" : "group"), i = K(() => Array.isArray(t.approvals.from) ? t.approvals.from.some((v) => v.kind === "group") || t.approvals.from.length >= t.approvals.min : "field" in t.approvals.from ? !!t.approvals.from.field : !!t.approvals.from.group);
    vo(() => l("validity", Number.isSafeInteger(t.approvals.min) && t.approvals.min > 0 && i.value)), wt(() => l("validity", !0)), ga(async () => {
      m.value = await It("wc-principal-picker");
    });
    function u(v) {
      t.approvals.from = v === "group" ? { group: "" } : v === "field" ? { field: "" } : [];
    }
    function p(v) {
      const b = v.detail, k = b?.principal_id ?? b?.id;
      if (r.value === "group") {
        t.approvals.from = { group: k ?? "" };
        return;
      }
      if (!k || !Array.isArray(t.approvals.from)) return;
      const D = { kind: b.type ?? b.kind ?? "user", id: k };
      b.label && d(D, b.label), t.approvals.from.some((x) => x.id === k && x.kind === D.kind) || t.approvals.from.push(D);
    }
    function w(v) {
      Array.isArray(t.approvals.from) && t.approvals.from.splice(v, 1);
    }
    return (v, b) => (n(), g(Q, null, [
      s(f) ? (n(), g("p", iu, E(s(f)), 1)) : T("", !0),
      c("section", nu, [
        c("label", su, [
          b[4] || (b[4] = c("span", { class: "work-spacer" }, "Approvals needed", -1)),
          y(s(gt), {
            modelValue: e.approvals.min,
            "onUpdate:modelValue": b[0] || (b[0] = (k) => e.approvals.min = k),
            min: 1,
            required: "",
            useGrouping: !1
          }, null, 8, ["modelValue"])
        ]),
        b[8] || (b[8] = c("span", { class: "work-field-label" }, "Approvers", -1)),
        "field" in e.approvals.from ? (n(), g("label", ru, [
          b[5] || (b[5] = q("Principal field", -1)),
          y(s(Se), {
            modelValue: e.approvals.from.field,
            "onUpdate:modelValue": b[1] || (b[1] = (k) => e.approvals.from.field = k),
            "aria-label": "Principal field"
          }, null, 8, ["modelValue"])
        ])) : m.value ? (n(), g("wc-principal-picker", {
          key: r.value,
          kinds: r.value === "group" ? "group" : "user,group,service",
          value: JSON.stringify("group" in e.approvals.from ? { type: "group", principal_id: e.approvals.from.group } : {}),
          onConfigChanged: p
        }, null, 40, du)) : (n(), g("p", uu, "The principal picker is unavailable.")),
        Array.isArray(e.approvals.from) ? (n(), g("div", cu, [
          (n(!0), g(Q, null, re(e.approvals.from, (k, D) => (n(), H(s(Ye), {
            key: k.kind + ":" + k.id,
            class: "kx-tag-sm",
            severity: "secondary"
          }, {
            default: G(() => [
              q(E(s(o)(k)), 1),
              y(s(ee), {
                "aria-label": "Remove approver " + (D + 1),
                text: "",
                severity: "secondary",
                size: "small",
                onClick: (x) => w(D)
              }, {
                default: G(() => [
                  y(s(fe), {
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
        c("label", vu, [
          b[6] || (b[6] = c("span", { class: "work-spacer" }, "The person who moves the item here cannot approve this visit", -1)),
          y(s(Qe), {
            modelValue: e.approvals.prevent_self,
            "onUpdate:modelValue": b[2] || (b[2] = (k) => e.approvals.prevent_self = k),
            "aria-label": "The person who moves the item here cannot approve this visit"
          }, null, 8, ["modelValue"])
        ]),
        y(Ne, {
          class: "work-process-options",
          label: "Approval options"
        }, {
          default: G(() => [
            c("label", mu, [
              b[7] || (b[7] = q("Approval source", -1)),
              y(s(me), {
                "model-value": r.value,
                "onUpdate:modelValue": b[3] || (b[3] = (k) => u(k)),
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                options: [{ label: "Group members", value: "group" }, { label: "People and groups", value: "principals" }, { label: "Principal field", value: "field" }]
              }, null, 8, ["model-value"])
            ])
          ]),
          _: 1
        }),
        Array.isArray(e.approvals.from) && !i.value ? (n(), g("p", fu, "Select at least " + E(e.approvals.min) + " distinct principals, or lower the minimum.", 1)) : "group" in e.approvals.from && !e.approvals.from.group ? (n(), g("p", pu, "Choose the group that can approve this state.")) : T("", !0)
      ])
    ], 64));
  }
}), hu = {
  class: "work-state-settings work-stack",
  "aria-label": "State settings"
}, gu = { class: "work-process-kind" }, yu = { class: "work-row" }, ku = { class: "work-row" }, wu = { class: "work-stack" }, Vu = { class: "work-row" }, $u = { class: "work-stack work-tight" }, xu = { class: "work-row" }, Cu = { class: "work-stack work-tight" }, Su = { class: "work-row" }, Tu = { class: "work-row" }, Iu = { class: "work-stack work-tight" }, Du = { class: "work-stack" }, Uu = { class: "work-row" }, Eu = { class: "work-row" }, Au = { class: "work-stack work-tight" }, Ou = { class: "work-stack work-tight" }, Pu = {
  key: 0,
  class: "work-row"
}, Ru = { class: "work-stack" }, Nu = { class: "work-stack work-tight" }, Mu = { class: "work-row" }, Fu = /* @__PURE__ */ we({
  __name: "StateSettings",
  props: {
    state: {},
    process: {},
    draft: {},
    boardId: {}
  },
  emits: ["validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = K(() => (t.process.transitions ?? []).filter((r) => r.from === "any" || r.from.includes(t.state.id))), d = [{ value: "human", icon: "user" }, { value: "gate", icon: "shield-check" }, { value: "automated", icon: "bolt" }, { value: "parallel", icon: "arrows-split" }];
    function f(r) {
      const i = t.state;
      i.kind = r, delete i.run, delete i.release_when, delete i.regions, delete i.join, delete i.due, (r === "automated" || r === "gate") && delete i.awaiting, r === "automated" && (i.run = { stage: i.id, retry: { max: 1, backoff: "PT1M" } }), r === "gate" && (i.release_when = { approvals: { min: 1, from: { group: "" }, prevent_self: !0 } }), r === "parallel" && (i.regions = [{ id: "region_1", initial: t.process.states.find((u) => u.id !== i.id)?.id ?? "" }], i.join = "all");
    }
    function m(r) {
      t.state.run && (r ? t.state.run.on_fail = r : delete t.state.run.on_fail);
    }
    return (r, i) => (n(), g("section", hu, [
      i[57] || (i[57] = c("h4", { class: "work-process-group" }, "Who moves the item on", -1)),
      y(s($l), {
        class: "work-process-kinds",
        "model-value": e.state.kind ?? "human",
        options: d.map((u) => ({
          ...u,
          label: s(Na)(u.value)
        })),
        optionLabel: "label",
        optionValue: "value",
        optionDisabled: "disabled",
        "allow-empty": !1,
        "aria-label": "Who moves the item on",
        "onUpdate:modelValue": f
      }, {
        option: G(({ option: u }) => [
          c("span", gu, [
            y(s(fe), {
              icon: "tabler:" + u.icon
            }, null, 8, ["icon"]),
            c("span", null, E(u.label), 1)
          ])
        ]),
        _: 1
      }, 8, ["model-value", "options"]),
      i[58] || (i[58] = c("h4", { class: "work-process-group" }, "Limit", -1)),
      c("label", yu, [
        i[34] || (i[34] = c("span", { class: "work-spacer" }, "Items allowed here", -1)),
        y(to, {
          draft: e.draft,
          state: e.state.id,
          label: "Items allowed here"
        }, null, 8, ["draft", "state"])
      ]),
      c("label", ku, [
        i[35] || (i[35] = c("span", { class: "work-spacer" }, [
          q("Refuse moves over the limit"),
          c("small", { class: "work-muted work-block" }, "Off only warns")
        ], -1)),
        y(to, {
          draft: e.draft,
          state: e.state.id,
          label: "Refuse moves over the limit",
          hard: ""
        }, null, 8, ["draft", "state"])
      ]),
      i[59] || (i[59] = c("h4", { class: "work-process-group" }, "Required on entry", -1)),
      y(ct, {
        label: "Required fields",
        options: e.draft.fields?.map((u) => ({ value: u.code, label: u.title || u.code })) ?? [],
        modelValue: e.state.require,
        "onUpdate:modelValue": i[0] || (i[0] = (u) => e.state.require = u)
      }, null, 8, ["options", "modelValue"]),
      !e.state.kind || e.state.kind === "human" ? (n(), H(Ft, {
        key: 0,
        modelValue: e.state.due,
        "onUpdate:modelValue": i[1] || (i[1] = (u) => e.state.due = u),
        label: "Time allowed in this state",
        onValidity: i[2] || (i[2] = (u, p) => l("validity", p, u))
      }, null, 8, ["modelValue"])) : T("", !0),
      e.state.kind === "gate" && e.state.release_when ? (n(), g(Q, { key: 1 }, [
        i[37] || (i[37] = c("h4", { class: "work-process-group" }, "Approval", -1)),
        e.state.release_when.approvals ? (n(), H(bu, {
          key: 0,
          "board-id": e.boardId,
          approvals: e.state.release_when.approvals,
          onValidity: i[3] || (i[3] = (u) => l("validity", "approvers", u))
        }, null, 8, ["board-id", "approvals"])) : T("", !0),
        y(Ne, {
          class: "work-process-options",
          label: "Release options"
        }, {
          default: G(() => [
            c("div", wu, [
              c("label", Vu, [
                i[36] || (i[36] = c("span", { class: "work-spacer" }, "Require approvals", -1)),
                y(s(Qe), {
                  "model-value": !!e.state.release_when.approvals,
                  "aria-label": "Require approvals",
                  "onUpdate:modelValue": i[4] || (i[4] = (u) => e.state.release_when.approvals = u ? { min: 1, from: { group: "" }, prevent_self: !0 } : void 0)
                }, null, 8, ["model-value"])
              ]),
              y(Ft, {
                modelValue: e.state.release_when.wait,
                "onUpdate:modelValue": i[5] || (i[5] = (u) => e.state.release_when.wait = u),
                label: "Wait before release",
                onValidity: i[6] || (i[6] = (u, p) => l("validity", p, u))
              }, null, 8, ["modelValue"]),
              y(Cl, {
                label: "Release when",
                draft: e.draft,
                "board-id": e.boardId,
                modelValue: e.state.release_when.when,
                "onUpdate:modelValue": i[7] || (i[7] = (u) => e.state.release_when.when = u),
                onValidity: i[8] || (i[8] = (u) => l("validity", "release", u))
              }, null, 8, ["draft", "board-id", "modelValue"])
            ])
          ]),
          _: 1
        })
      ], 64)) : T("", !0),
      e.state.kind === "automated" && e.state.run ? (n(), g(Q, { key: 2 }, [
        i[46] || (i[46] = c("h4", { class: "work-process-group" }, "Automation", -1)),
        c("label", $u, [
          i[38] || (i[38] = q("Run label", -1)),
          y(s(Se), {
            modelValue: e.state.run.stage,
            "onUpdate:modelValue": i[9] || (i[9] = (u) => e.state.run.stage = u),
            "aria-label": "Run label",
            required: ""
          }, null, 8, ["modelValue"])
        ]),
        y(Bd, {
          modelValue: e.state.run.flow_ref,
          "onUpdate:modelValue": i[10] || (i[10] = (u) => e.state.run.flow_ref = u),
          onValidity: i[11] || (i[11] = (u) => l("validity", "flow", u))
        }, null, 8, ["modelValue"]),
        y(Ft, {
          modelValue: e.state.run.timeout,
          "onUpdate:modelValue": i[12] || (i[12] = (u) => e.state.run.timeout = u),
          label: "Attempt timeout",
          onValidity: i[13] || (i[13] = (u, p) => l("validity", p, u))
        }, null, 8, ["modelValue"]),
        i[47] || (i[47] = c("small", { class: "work-muted" }, "Blank uses the board timeout, or one hour.", -1)),
        c("label", xu, [
          i[39] || (i[39] = c("span", { class: "work-spacer" }, "Maximum visits", -1)),
          y(s(gt), {
            "model-value": e.state.run.max_visits ?? null,
            "aria-label": "Maximum visits",
            min: 1,
            useGrouping: !1,
            placeholder: "Board default",
            "onUpdate:modelValue": i[14] || (i[14] = (u) => e.state.run.max_visits = u ?? void 0)
          }, null, 8, ["model-value"])
        ]),
        c("label", Cu, [
          i[40] || (i[40] = q("When visits are exhausted", -1)),
          y(s(me), {
            "model-value": e.state.run.on_exhausted,
            "aria-label": "When visits are exhausted",
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            showClear: "",
            options: (e.process.transitions ?? []).filter((u) => !u.auto).map((u) => ({ label: s(je)(u), value: u.id })),
            "onUpdate:modelValue": i[15] || (i[15] = (u) => e.state.run.on_exhausted = u || void 0)
          }, null, 8, ["model-value", "options"])
        ]),
        i[48] || (i[48] = c("small", { class: "work-muted" }, "Blank records a failed run and stops automation. A route must leave every incoming state or be global.", -1)),
        c("label", Su, [
          i[41] || (i[41] = c("span", { class: "work-spacer" }, "Retry if it fails", -1)),
          y(s(Qe), {
            "model-value": !!e.state.run.retry,
            "aria-label": "Retry if it fails",
            "onUpdate:modelValue": i[16] || (i[16] = (u) => e.state.run.retry = u ? { max: 1, backoff: "PT1M" } : void 0)
          }, null, 8, ["model-value"])
        ]),
        e.state.run.retry ? (n(), g(Q, { key: 0 }, [
          c("label", Tu, [
            i[42] || (i[42] = c("span", { class: "work-spacer" }, "Maximum attempts", -1)),
            y(s(gt), {
              modelValue: e.state.run.retry.max,
              "onUpdate:modelValue": i[17] || (i[17] = (u) => e.state.run.retry.max = u),
              min: 1,
              useGrouping: !1
            }, null, 8, ["modelValue"])
          ]),
          y(Ft, {
            modelValue: e.state.run.retry.backoff,
            "onUpdate:modelValue": i[18] || (i[18] = (u) => e.state.run.retry.backoff = u),
            label: "Wait between attempts",
            onValidity: i[19] || (i[19] = (u, p) => l("validity", p, u))
          }, null, 8, ["modelValue"])
        ], 64)) : T("", !0),
        (n(), g(Q, null, re([{ key: "on_pass", label: "On success" }, { key: "on_cancel", label: "On cancellation" }], (u) => c("label", {
          key: u.key,
          class: "work-stack work-tight"
        }, [
          q(E(u.label), 1),
          y(s(me), {
            "model-value": e.state.run[u.key],
            "aria-label": u.label,
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            showClear: "",
            options: o.value.map((p) => ({ label: s(je)(p), value: p.id })),
            "onUpdate:modelValue": (p) => e.state.run[u.key] = p || void 0
          }, null, 8, ["model-value", "aria-label", "options", "onUpdate:modelValue"])
        ])), 64)),
        c("label", Iu, [
          i[43] || (i[43] = q("If it fails, go to", -1)),
          y(s(me), {
            "aria-label": "If it fails, go to",
            "model-value": e.state.run.on_fail,
            "onUpdate:modelValue": m,
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            showClear: "",
            options: o.value.map((u) => ({
              label: s(je)(u) + " → " + s(ke)(e.process.states.find((p) => p.id === u.to)),
              value: u.id
            }))
          }, null, 8, ["model-value", "options"])
        ]),
        y(Ne, {
          class: "work-disclosure",
          label: "Board automation defaults"
        }, {
          default: G(() => [
            c("div", Du, [
              i[45] || (i[45] = c("p", { class: "work-muted" }, "These values apply to automated states without their own limit.", -1)),
              y(Ft, {
                "model-value": e.draft.policy?.stage_timeout,
                label: "Default attempt timeout",
                "onUpdate:modelValue": i[20] || (i[20] = (u) => (e.draft.policy ??= {}).stage_timeout = u),
                onValidity: i[21] || (i[21] = (u, p) => l("validity", p, u))
              }, null, 8, ["model-value"]),
              c("label", Uu, [
                i[44] || (i[44] = c("span", { class: "work-spacer" }, "Default maximum visits", -1)),
                y(s(gt), {
                  "model-value": e.draft.policy?.stage_max_visits ?? null,
                  "aria-label": "Default maximum visits",
                  min: 1,
                  useGrouping: !1,
                  placeholder: "5",
                  "onUpdate:modelValue": i[22] || (i[22] = (u) => (e.draft.policy ??= {}).stage_max_visits = u ?? void 0)
                }, null, 8, ["model-value"])
              ])
            ])
          ]),
          _: 1
        })
      ], 64)) : T("", !0),
      e.state.kind === "parallel" && e.state.regions ? (n(), g(Q, { key: 3 }, [
        i[53] || (i[53] = c("h4", { class: "work-process-group" }, "Lanes", -1)),
        (n(!0), g(Q, null, re(e.state.regions, (u, p) => (n(), g("div", {
          key: p,
          class: "work-process-value work-stack work-tight"
        }, [
          c("div", Eu, [
            c("span", null, "Lane " + E(p + 1), 1),
            i[49] || (i[49] = c("span", { class: "work-spacer" }, null, -1)),
            y(s(ee), {
              severity: "danger",
              text: "",
              size: "small",
              "aria-label": "Remove lane",
              onClick: (w) => e.state.regions.splice(p, 1)
            }, {
              default: G(() => [
                y(s(fe), { icon: "tabler:trash" })
              ]),
              _: 1
            }, 8, ["onClick"])
          ]),
          c("label", Au, [
            i[50] || (i[50] = q("Starts at", -1)),
            y(s(me), {
              "aria-label": "Lane starts at",
              modelValue: u.initial,
              "onUpdate:modelValue": (w) => u.initial = w,
              appendTo: "self",
              optionLabel: "label",
              optionValue: "value",
              options: e.process.states.filter((w) => w.id !== e.state.id).map((w) => ({ label: s(ke)(w), value: w.id }))
            }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
          ])
        ]))), 128)),
        y(s(ee), {
          label: "Add lane",
          severity: "secondary",
          outlined: "",
          size: "small",
          onClick: i[23] || (i[23] = (u) => e.state.regions.push({
            id: s(Mt)("region", e.state.regions),
            initial: e.process.states.find((p) => p.id !== e.state.id)?.id ?? ""
          }))
        }, {
          icon: G(() => [
            y(s(fe), { icon: "tabler:plus" })
          ]),
          _: 1
        }),
        c("label", Ou, [
          i[51] || (i[51] = q("Finish rule", -1)),
          y(s(me), {
            "model-value": typeof e.state.join == "number" ? "count" : e.state.join ?? "all",
            appendTo: "self",
            options: [
              { label: "All must pass", value: "all" },
              { label: "Any may pass", value: "any" },
              { label: "A number must pass", value: "count" }
            ],
            optionLabel: "label",
            optionValue: "value",
            "onUpdate:modelValue": i[24] || (i[24] = (u) => e.state.join = u === "count" ? 1 : u)
          }, null, 8, ["model-value"])
        ]),
        typeof e.state.join == "number" ? (n(), g("label", Pu, [
          i[52] || (i[52] = c("span", { class: "work-spacer" }, "Lanes needed", -1)),
          y(s(gt), {
            modelValue: e.state.join,
            "onUpdate:modelValue": i[25] || (i[25] = (u) => e.state.join = u),
            min: 1,
            max: e.state.regions.length,
            useGrouping: !1
          }, null, 8, ["modelValue", "max"])
        ])) : T("", !0)
      ], 64)) : T("", !0),
      y(Ne, {
        class: "work-disclosure",
        label: "Advanced state settings"
      }, {
        default: G(() => [
          c("div", Ru, [
            i[56] || (i[56] = c("h4", { class: "work-process-group" }, "Assignment and conditions", -1)),
            c("label", Nu, [
              i[54] || (i[54] = q("Stage label", -1)),
              y(s(Se), {
                "model-value": e.state.stage,
                "aria-label": "Stage label",
                "onUpdate:modelValue": i[26] || (i[26] = (u) => e.state.stage = u || void 0)
              }, null, 8, ["model-value"])
            ]),
            !e.state.kind || e.state.kind === "human" || e.state.kind === "parallel" ? (n(), g(Q, { key: 0 }, [
              c("label", Mu, [
                y(s(Qe), {
                  "model-value": !!e.state.awaiting,
                  "aria-label": "Awaiting people",
                  "onUpdate:modelValue": i[27] || (i[27] = (u) => e.state.awaiting = u ? { group: "" } : void 0)
                }, null, 8, ["model-value"]),
                i[55] || (i[55] = q("Awaiting people", -1))
              ]),
              e.state.awaiting ? (n(), H(ou, {
                key: 0,
                modelValue: e.state.awaiting,
                "onUpdate:modelValue": i[28] || (i[28] = (u) => e.state.awaiting = u),
                draft: e.draft,
                "board-id": e.boardId,
                label: "Awaiting",
                onValidity: i[29] || (i[29] = (u) => l("validity", "awaiting", u))
              }, null, 8, ["modelValue", "draft", "board-id"])) : T("", !0)
            ], 64)) : T("", !0),
            y(Sl, {
              "board-id": e.boardId,
              modelValue: e.state.assign,
              "onUpdate:modelValue": i[30] || (i[30] = (u) => e.state.assign = u),
              label: "Assign to"
            }, null, 8, ["board-id", "modelValue"]),
            y(Dt, {
              label: "State checks",
              example: ["installed-check"],
              "model-value": e.state.invariants,
              shape: "array",
              "onUpdate:modelValue": i[31] || (i[31] = (u) => e.state.invariants = u),
              onValidity: i[32] || (i[32] = (u) => l("validity", "invariants", u))
            }, null, 8, ["model-value"]),
            y(eu, {
              state: e.state,
              draft: e.draft,
              onValidity: i[33] || (i[33] = (u, p) => l("validity", "timer-" + u, p))
            }, null, 8, ["state", "draft"])
          ])
        ]),
        _: 1
      })
    ]));
  }
}), Lu = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, Bu = { key: 1 }, zu = { class: "work-muted" }, ju = {
  key: 2,
  class: "work-map-zoom",
  role: "group",
  "aria-label": "Map zoom"
}, Wu = ["aria-label", "aria-keyshortcuts", "onKeydown"], qu = { class: "work-row" }, Gu = { class: "work-process-meaning" }, Ku = {
  key: 0,
  class: "work-muted"
}, Hu = { class: "work-stack work-tight" }, Yu = { class: "work-next-transition work-stack work-tight" }, Xu = { class: "work-row work-wrap" }, Ju = { class: "work-process-inspector-foot" }, Zu = { class: "work-row work-transition-actions" }, Qu = { class: "work-process-meaning" }, _u = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, ec = { class: "work-stack work-tight" }, tc = { class: "work-stack" }, ac = { class: "work-stack work-tight" }, lc = {
  key: 0,
  class: "work-muted"
}, oc = { class: "work-stack work-tight" }, ic = { class: "work-dialog-actions" }, nc = /* @__PURE__ */ we({
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
    const t = e, l = a, o = K(() => t.draft.processes ?? []), d = B(!1), f = B(""), m = B(""), r = B(""), i = B("Map"), u = B(""), p = B(!1), w = B(), v = B(), b = B(), k = B(), D = B(), x = B(), C = B(!1);
    let R;
    async function M() {
      C.value = !0, await Yt(), D.value?.querySelector('[aria-label="State name"]')?.focus();
    }
    const L = K(() => o.value.find((z) => z.id === m.value) ?? o.value[0]), le = B(!1);
    function te(z) {
      le.value = !0, i.value = z;
    }
    function ve() {
      !le.value && k.value?.clientWidth && (i.value = k.value.clientWidth < 480 && (L.value?.states.length ?? 0) > 6 ? "List" : "Map");
    }
    let J;
    ga(() => {
      ve(), k.value && typeof ResizeObserver < "u" && (J = new ResizeObserver(ve), J.observe(k.value));
    }), wt(() => J?.disconnect()), Ie(L, () => {
      le.value = !1, ve();
    });
    function ue() {
      C.value = !1, p.value = !1, w.value = void 0, v.value = void 0, r.value = "", R = void 0;
    }
    async function pe() {
      const z = R;
      ue(), await Yt(), z?.isConnected ? z.focus() : _();
    }
    function _() {
      i.value === "Map" ? b.value?.focus() : x.value?.focus();
    }
    async function I() {
      await Yt(), D.value && (D.value.scrollTop = 0, D.value.focus({ preventScroll: !0 }), (D.value.closest(".work-settings-shell")?.clientWidth ?? 1 / 0) <= 700 && D.value.scrollIntoView?.({ block: "nearest" }));
    }
    function U(z, N) {
      R = N, C.value = !1, p.value = !1, w.value = z, v.value = void 0, u.value = "", r.value = "", I();
    }
    async function $(z) {
      u.value = "", p.value = z, await Yt();
      const N = z ? '[role="combobox"]' : "button";
      D.value?.querySelector(".work-next-transition " + N)?.focus();
    }
    function j(z, N) {
      R = N, C.value = !1, v.value = z, w.value = void 0, r.value = "", I();
    }
    Ie([L, i], ue);
    const X = K(() => {
      if (!t.counts || !L.value) return;
      const z = t.countTypes?.filter((N) => N.process === L.value?.id) ?? [];
      return Object.fromEntries(L.value.states.map((N) => [
        N.id,
        z.reduce((V, P) => V + (t.counts?.[P.id]?.[N.id] ?? 0), 0)
      ]));
    }), de = K(() => (t.guards ?? []).filter((z) => t.draft.plugins?.some((N) => N.use === z.plugin))), A = K(() => Object.keys(t.draft.policy?.wip ?? {}).filter((z) => !o.value.some((N) => N.states.some((V) => V.id === z))));
    function W() {
      const z = f.value.trim();
      if (!z) return;
      const N = z.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "") || "process", V = (/^[a-z]/.test(N) ? N : "process_" + N).slice(0, 40), P = o.value.some((S) => S.id === V) ? Mt(V, o.value) : V;
      (t.draft.processes ??= []).push({ id: P, name: z, initial: "todo", states: [{ id: "todo", name: "To do", category: "unstarted" }], transitions: [] }), m.value = P, f.value = "", d.value = !1;
    }
    async function F(z, N) {
      const V = { id: Mt("state", z.states), name: "New state", category: "started" }, P = Ea(z), S = P.at(-1), oe = w.value ?? (S?.category === "completed" ? P.at(-2) : S), xe = oe && (z.transitions?.find((Ve) => Ve.default && Ve.from !== "any" && Ve.from.includes(oe.id)) ?? z.transitions?.find((Ve) => Ve.from !== "any" && Ve.from.includes(oe.id) && z.states.findIndex((De) => De.id === Ve.to) > z.states.indexOf(oe)));
      if (z.states.splice(oe ? z.states.indexOf(oe) + 1 : z.states.length, 0, V), oe && oe.category !== "completed" && oe.category !== "canceled")
        if (xe) {
          const Ve = xe.to;
          xe.to = V.id, (z.transitions ??= []).push({ id: Mt("transition", z.transitions ?? []), name: "Continue", from: [V.id], to: Ve, ...xe.auto && xe.default ? { auto: !0, default: !0 } : {} });
        } else (z.transitions ??= []).push({ id: Mt("transition", z.transitions ?? []), name: "Continue", from: [oe.id], to: V.id });
      U(V, N), await M();
    }
    function ce(z, N, V = R) {
      const P = L.value;
      if (!P || !N || z === N) return;
      const S = P.transitions ??= [], oe = `to_${N}`;
      let xe = oe.slice(0, 40), Ve = 2;
      for (; S.some((tt) => tt.id === xe); ) {
        const tt = `_${Ve++}`;
        xe = oe.slice(0, 40 - tt.length) + tt;
      }
      const De = { id: xe, name: `To ${ke(P.states.find((tt) => tt.id === N)).toLowerCase()}`, from: [z], to: N };
      S.push(De), j(De, V);
    }
    function h(z, N) {
      const V = w.value ?? z.states.find((oe) => oe.id === z.initial) ?? z.states[0], P = z.states.find((oe) => oe.id !== V?.id);
      if (!V || !P) return;
      const S = { id: Mt("transition", z.transitions ?? []), name: "To " + ke(P), from: [V.id], to: P.id };
      (z.transitions ??= []).push(S), j(S, N);
    }
    async function O(z) {
      const N = L.value, V = N?.transitions?.indexOf(z) ?? -1;
      if (!N || V < 0) return;
      const P = fi(N, z);
      if (P.length) {
        r.value = `Used by ${P.join(", ")}. Update those references first.`;
        return;
      }
      N.transitions.splice(V, 1), ue(), await Yt(), _();
    }
    function se(z) {
      !v.value || z.defaultPrevented || z.repeat || (z.preventDefault(), O(v.value));
    }
    function ne(z, N) {
      const V = pi(z, N);
      if (V.length) {
        r.value = `${ke(N)} is used by ${V.join(", ")}. Update these references first.`;
        return;
      }
      z.states.splice(z.states.indexOf(N), 1), pe();
    }
    async function ye(z) {
      const N = t.draft.item_types?.filter((P) => P.process === z.id).map((P) => P.title || "Untitled item type") ?? [];
      if (N.length) {
        r.value = `Used by ${N.join(", ")}. Choose a different process for those item types first.`;
        return;
      }
      const V = await t.guardRemoval?.("processes", z.id);
      if (V) {
        r.value = V;
        return;
      }
      ya(t.draft, "processes", z.id), m.value = "", ue();
    }
    return (z, N) => (n(), g("section", {
      ref_key: "editor",
      ref: k,
      class: "work-process-editor work-stack",
      "aria-label": "Process editor",
      onKeydown: N[19] || (N[19] = ze((V) => D.value && pe(), ["esc"]))
    }, [
      r.value && !v.value ? (n(), g("p", Lu, E(r.value), 1)) : T("", !0),
      (n(!0), g(Q, null, re(e.issues?.filter((V) => V.code === "process " + L.value?.id) ?? [], (V) => (n(), g("p", {
        key: V.what + V.detail,
        class: "work-error work-small",
        role: "alert"
      }, E(s(ja)(V)) + " · " + E(V.what), 1))), 128)),
      L.value ? (n(), g("div", {
        key: 1,
        class: ut(["work-process-builder", { "work-process-inspecting": w.value || v.value }])
      }, [
        c("div", {
          ref_key: "tools",
          ref: x,
          class: "work-process-controls",
          role: "toolbar",
          "aria-label": "Process tools",
          tabindex: "-1"
        }, [
          o.value.length > 1 ? (n(), H(s(me), {
            key: 0,
            "model-value": L.value.id,
            "aria-label": "Process",
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            options: o.value.map((V) => ({ label: V.name || "Untitled process", value: V.id })),
            "onUpdate:modelValue": N[0] || (N[0] = (V) => m.value = V)
          }, null, 8, ["model-value", "options"])) : (n(), g("strong", Bu, E(L.value.name || "Untitled process"), 1)),
          y(s(ee), {
            label: "Add state",
            severity: "secondary",
            outlined: "",
            size: "small",
            onClick: N[1] || (N[1] = (V) => F(L.value, V.currentTarget))
          }, {
            icon: G(() => [
              y(s(fe), { icon: "tabler:plus" })
            ]),
            _: 1
          }),
          y(s(ee), {
            label: "Add transition",
            severity: "secondary",
            outlined: "",
            size: "small",
            disabled: L.value.states.length < 2,
            onClick: N[2] || (N[2] = (V) => h(L.value, V.currentTarget))
          }, null, 8, ["disabled"]),
          y(s(me), {
            modelValue: L.value.initial,
            "onUpdate:modelValue": N[3] || (N[3] = (V) => L.value.initial = V),
            "aria-label": "Starts in " + s(ke)(L.value.states.find((V) => V.id === L.value.initial)),
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            options: L.value.states.map((V) => ({ label: s(ke)(V), value: V.id }))
          }, {
            value: G(() => [
              c("span", zu, "Starts in " + E(s(ke)(L.value.states.find((V) => V.id === L.value.initial))), 1)
            ]),
            _: 1
          }, 8, ["modelValue", "aria-label", "options"]),
          N[20] || (N[20] = c("span", { class: "work-spacer" }, null, -1)),
          i.value === "Map" ? (n(), g("div", ju, [
            y(s(ee), {
              label: "Fit",
              title: "Fit the map to a readable width",
              text: "",
              severity: "secondary",
              size: "small",
              onClick: N[4] || (N[4] = (V) => b.value?.fit())
            }, {
              icon: G(() => [
                y(s(fe), { icon: "tabler:arrows-maximize" })
              ]),
              _: 1
            }),
            i.value === "Map" ? (n(), H(s(ee), {
              key: 0,
              "aria-label": "Zoom out",
              title: "Zoom out",
              text: "",
              severity: "secondary",
              size: "small",
              onClick: N[5] || (N[5] = (V) => b.value?.zoomOut())
            }, {
              default: G(() => [
                y(s(fe), { icon: "tabler:minus" })
              ]),
              _: 1
            })) : T("", !0),
            i.value === "Map" ? (n(), H(s(ee), {
              key: 1,
              "aria-label": "Zoom in",
              title: "Zoom in",
              text: "",
              severity: "secondary",
              size: "small",
              onClick: N[6] || (N[6] = (V) => b.value?.zoomIn())
            }, {
              default: G(() => [
                y(s(fe), { icon: "tabler:plus" })
              ]),
              _: 1
            })) : T("", !0)
          ])) : T("", !0),
          y(s($l), {
            "model-value": i.value,
            "onUpdate:modelValue": te,
            options: ["Map", "List"],
            "allow-empty": !1,
            "aria-label": "Process layout"
          }, null, 8, ["model-value"]),
          y(s(ee), {
            label: "New process",
            "aria-label": "New process",
            text: "",
            severity: "secondary",
            size: "small",
            onClick: N[7] || (N[7] = (V) => d.value = !0)
          }, {
            icon: G(() => [
              y(s(fe), { icon: "tabler:plus" })
            ]),
            _: 1
          })
        ], 512),
        i.value === "Map" ? (n(), H(Jr, {
          key: 0,
          ref_key: "graph",
          ref: b,
          process: L.value,
          draft: e.draft,
          "fit-on-open": "",
          "selected-state": w.value,
          "selected-transition": v.value,
          onState: U,
          onTransition: j,
          onRemoveTransition: se,
          onConnect: ce,
          onClear: pe
        }, null, 8, ["process", "draft", "selected-state", "selected-transition"])) : (n(), H(bd, {
          key: 1,
          process: L.value,
          "selected-state": w.value,
          "selected-transition": v.value,
          counts: X.value,
          onState: U,
          onTransition: j,
          onRemoveState: N[8] || (N[8] = (V) => ne(L.value, V)),
          onRemoveTransition: O
        }, null, 8, ["process", "selected-state", "selected-transition", "counts"])),
        y(uo, { name: "work-panel" }, {
          default: G(() => [
            w.value || v.value ? (n(), g("aside", {
              key: 0,
              ref_key: "inspector",
              ref: D,
              class: "work-process-sideform",
              tabindex: "-1",
              "aria-label": w.value ? "State inspector" : "Transition inspector",
              "aria-keyshortcuts": v.value ? "Delete Backspace" : void 0,
              onKeydown: [
                ze(Ee(se, ["self"]), ["delete"]),
                ze(Ee(se, ["self"]), ["backspace"])
              ]
            }, [
              (n(!0), g(Q, null, re(w.value ? [w.value] : [], (V) => (n(), g(Q, {
                key: V.id
              }, [
                c("header", qu, [
                  C.value ? (n(), H(s(Se), {
                    key: 1,
                    modelValue: V.name,
                    "onUpdate:modelValue": (P) => V.name = P,
                    class: "work-process-name",
                    "aria-label": "State name",
                    onBlur: N[9] || (N[9] = (P) => C.value = !1)
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])) : (n(), H(xl, {
                    key: 0,
                    class: "work-process-state-title",
                    "aria-label": "Rename state",
                    onActivate: M
                  }, {
                    default: G(() => [
                      c("span", null, E(s(ke)(V)), 1)
                    ]),
                    _: 2
                  }, 1024)),
                  y(s(ee), {
                    severity: "secondary",
                    text: "",
                    size: "small",
                    "aria-label": "Close state editor",
                    onClick: pe
                  }, {
                    default: G(() => [
                      y(s(fe), { icon: "tabler:x" })
                    ]),
                    _: 1
                  })
                ]),
                c("p", Gu, E(s(mi)(V, e.draft)), 1),
                X.value ? (n(), g("p", Ku, E(X.value[V.id] ?? 0) + " " + E(X.value[V.id] === 1 ? "item" : "items") + " currently here", 1)) : T("", !0),
                y(Fu, {
                  state: V,
                  process: L.value,
                  draft: e.draft,
                  "board-id": e.boardId,
                  onValidity: (P, S) => l("validity", P.includes("duration:") ? P : L.value.id + ":" + V.id + ":" + P, S)
                }, null, 8, ["state", "process", "draft", "board-id", "onValidity"]),
                c("label", Hu, [
                  N[21] || (N[21] = q("Phase", -1)),
                  y(s(me), {
                    "aria-label": "Phase",
                    modelValue: V.category,
                    "onUpdate:modelValue": (P) => V.category = P,
                    appendTo: "self",
                    optionLabel: "label",
                    optionValue: "value",
                    options: ["triage", "backlog", ...s(fo)].map((P) => ({ label: s(jt)(P), value: P }))
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                ]),
                c("div", Yu, [
                  p.value ? (n(), g(Q, { key: 1 }, [
                    y(s(me), {
                      modelValue: u.value,
                      "onUpdate:modelValue": N[11] || (N[11] = (P) => u.value = P),
                      "aria-label": "Next state",
                      placeholder: "Choose the next state",
                      appendTo: "self",
                      optionLabel: "label",
                      optionValue: "value",
                      options: L.value.states.filter((P) => P !== V).map((P) => ({ label: s(ke)(P), value: P.id }))
                    }, null, 8, ["modelValue", "options"]),
                    c("div", Xu, [
                      y(s(ee), {
                        label: "Add transition",
                        size: "small",
                        disabled: !u.value,
                        onClick: (P) => ce(V.id, u.value)
                      }, null, 8, ["disabled", "onClick"]),
                      y(s(ee), {
                        label: "Cancel",
                        severity: "secondary",
                        text: "",
                        size: "small",
                        onClick: N[12] || (N[12] = (P) => $(!1))
                      })
                    ])
                  ], 64)) : (n(), H(s(ee), {
                    key: 0,
                    label: "Add transition",
                    severity: "secondary",
                    outlined: "",
                    size: "small",
                    "aria-expanded": "false",
                    disabled: L.value.states.length < 2,
                    onClick: N[10] || (N[10] = (P) => $(!0))
                  }, {
                    icon: G(() => [
                      y(s(fe), {
                        icon: "tabler:plus",
                        "aria-hidden": "true"
                      })
                    ]),
                    _: 1
                  }, 8, ["disabled"]))
                ]),
                c("footer", Ju, [
                  y(s(ee), {
                    label: "Remove state",
                    severity: "danger",
                    text: "",
                    size: "small",
                    onClick: (P) => ne(L.value, V)
                  }, {
                    icon: G(() => [
                      y(s(fe), { icon: "tabler:trash" })
                    ]),
                    _: 1
                  }, 8, ["onClick"])
                ])
              ], 64))), 128)),
              (n(!0), g(Q, null, re(v.value ? [v.value] : [], (V) => (n(), g(Q, {
                key: V.id
              }, [
                c("header", Zu, [
                  N[22] || (N[22] = c("h3", null, "Transition", -1)),
                  y(s(ee), {
                    type: "button",
                    label: "Remove transition",
                    severity: "danger",
                    text: "",
                    size: "small",
                    onClick: (P) => O(V)
                  }, {
                    icon: G(() => [
                      y(s(fe), { icon: "tabler:trash" })
                    ]),
                    _: 1
                  }, 8, ["onClick"]),
                  y(s(ee), {
                    severity: "secondary",
                    text: "",
                    size: "small",
                    "aria-label": "Close transition editor",
                    onClick: pe
                  }, {
                    default: G(() => [
                      y(s(fe), { icon: "tabler:x" })
                    ]),
                    _: 1
                  })
                ]),
                c("p", Qu, E(V.from === "any" ? "Any state" : V.from.map((P) => s(ke)(L.value.states.find((S) => S.id === P))).join(", ")) + " → " + E(s(ke)(L.value.states.find((P) => P.id === V.to))), 1),
                r.value ? (n(), g("p", _u, E(r.value), 1)) : T("", !0),
                c("label", ec, [
                  N[23] || (N[23] = q("Name", -1)),
                  y(s(Se), {
                    modelValue: V.name,
                    "onUpdate:modelValue": (P) => V.name = P,
                    placeholder: s(je)(V),
                    "aria-label": "Transition name"
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder"])
                ]),
                y(Id, {
                  transition: V,
                  process: L.value,
                  draft: e.draft,
                  "board-id": e.boardId,
                  guards: de.value,
                  onValidity: (P, S) => l("validity", L.value.id + ":transition-" + V.id + ":" + P, S)
                }, null, 8, ["transition", "process", "draft", "board-id", "guards", "onValidity"])
              ], 64))), 128))
            ], 40, Wu)) : T("", !0)
          ]),
          _: 1
        })
      ], 2)) : (n(), H(s(ee), {
        key: 2,
        label: "New process",
        severity: "secondary",
        outlined: "",
        onClick: N[13] || (N[13] = (V) => d.value = !0)
      }, {
        icon: G(() => [
          y(s(fe), { icon: "tabler:plus" })
        ]),
        _: 1
      })),
      L.value ? (n(), H(Ne, {
        key: 3,
        class: "work-settings-card work-disclosure",
        label: "Advanced workflow settings"
      }, {
        default: G(() => [
          c("div", tc, [
            c("label", ac, [
              N[24] || (N[24] = q("Workflow name", -1)),
              y(s(Se), {
                modelValue: L.value.name,
                "onUpdate:modelValue": N[14] || (N[14] = (V) => L.value.name = V),
                "aria-label": "Workflow name"
              }, null, 8, ["modelValue"])
            ]),
            A.value.length ? (n(), g("p", lc, "Some item limits belong to removed states.")) : T("", !0),
            (n(!0), g(Q, null, re(A.value, (V, P) => (n(), H(s(ee), {
              key: V,
              label: "Clear limit for removed state " + (P + 1),
              severity: "secondary",
              text: "",
              onClick: (S) => delete e.draft.policy.wip[V]
            }, null, 8, ["label", "onClick"]))), 128)),
            y(s(ee), {
              label: "Remove workflow",
              severity: "danger",
              text: "",
              size: "small",
              onClick: N[15] || (N[15] = (V) => ye(L.value))
            })
          ])
        ]),
        _: 1
      })) : T("", !0),
      y(ml, {
        visible: d.value,
        label: "New process",
        onClose: N[18] || (N[18] = (V) => d.value = !1)
      }, {
        default: G(() => [
          c("form", {
            class: "work-dialog-box",
            "aria-label": "New process",
            onSubmit: Ee(W, ["stop", "prevent"])
          }, [
            N[26] || (N[26] = c("h2", null, "New process", -1)),
            c("label", oc, [
              N[25] || (N[25] = q("Name", -1)),
              y(s(Se), {
                modelValue: f.value,
                "onUpdate:modelValue": N[16] || (N[16] = (V) => f.value = V),
                "aria-label": "New process name",
                autofocus: "",
                required: ""
              }, null, 8, ["modelValue"])
            ]),
            c("div", ic, [
              y(s(ee), {
                label: "Cancel",
                severity: "secondary",
                outlined: "",
                onClick: N[17] || (N[17] = (V) => d.value = !1)
              }),
              y(s(ee), {
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
}), sc = {
  class: "work-settings-card work-stack",
  "aria-label": "Existing items"
}, rc = {
  key: 0,
  class: "work-stack work-tight"
}, dc = { class: "work-row" }, uc = /* @__PURE__ */ we({
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
    return (t, l) => (n(), g("section", sc, [
      l[2] || (l[2] = c("h3", { class: "work-row-title" }, "Items in changed states", -1)),
      (n(!0), g(Q, null, re(e.removed, ({ process: o, state: d, count: f }) => (n(), g("label", {
        key: o.id + "/" + d.id,
        class: "work-stack work-tight"
      }, [
        q(" Move " + E(a(f)) + " from " + E(s(ke)(d)) + " to ", 1),
        y(s(me), {
          disabled: e.disabled,
          "model-value": o.map?.[d.id],
          "aria-label": "Move items from " + s(ke)(d) + " to",
          placeholder: "Choose a state",
          appendTo: "self",
          optionLabel: "label",
          optionValue: "value",
          options: o.states.map((m) => ({ label: s(ke)(m), value: m.id })),
          "onUpdate:modelValue": (m) => t.$emit("destination", o, d.id, m)
        }, null, 8, ["disabled", "model-value", "aria-label", "options", "onUpdate:modelValue"])
      ]))), 128)),
      e.renamed.length ? (n(), g("div", rc, [
        (n(!0), g(Q, null, re(e.renamed, ({ process: o, state: d, count: f, name: m }) => (n(), g("p", {
          key: o.id + "/" + d.id
        }, [
          q(E(s(ke)(d)) + " becomes ", 1),
          c("strong", null, E(m), 1),
          q(" for " + E(a(f)) + ". ", 1)
        ]))), 128)),
        c("label", dc, [
          y(s(Bt), {
            binary: "",
            "model-value": e.confirmed,
            disabled: e.disabled,
            "onUpdate:modelValue": l[0] || (l[0] = (o) => t.$emit("update:confirmed", o))
          }, null, 8, ["model-value", "disabled"]),
          l[1] || (l[1] = q(" Keep these items in their renamed states ", -1))
        ])
      ])) : T("", !0)
    ]));
  }
}), cc = {
  class: "work-stack",
  "aria-label": "Links editor"
}, vc = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, mc = { class: "work-definition-meta work-muted work-small" }, fc = { class: "work-settings-grid" }, pc = { class: "work-stack work-tight" }, bc = { class: "work-stack work-tight" }, hc = { class: "work-stack work-tight" }, gc = { class: "work-row" }, yc = {
  key: 0,
  class: "work-muted work-small"
}, kc = {
  key: 1,
  class: "work-settings-grid"
}, wc = { class: "work-stack work-tight" }, Vc = {
  key: 0,
  class: "work-chips"
}, $c = { class: "work-stack work-tight" }, xc = { class: "work-relation-preview work-small" }, Cc = { class: "work-muted" }, Sc = {
  key: 0,
  class: "kx-empty"
}, Tc = /* @__PURE__ */ we({
  __name: "RelationsEditor",
  props: {
    draft: {},
    guardRemoval: { type: Function }
  },
  setup(e) {
    const a = e, t = K(() => a.draft.relation_types ?? []), l = K(() => (a.draft.item_types ?? []).map((w) => ({ value: w.id, label: w.title || Re(w.id) })));
    function o(w, v, b) {
      b.length ? w[v] = b : delete w[v];
    }
    function d(w, v) {
      if (!/^[a-z][a-z0-9_]{0,39}$/.test(v)) return "Start with a lowercase letter and use only lowercase letters, numbers or underscores.";
      if (w.to_types?.includes(v)) return "This ID is already in use.";
    }
    function f(w, v) {
      o(w, "to_types", [...w.to_types ?? [], v]);
    }
    const m = B(""), r = B(!1);
    function i(w) {
      const v = w.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, ""), b = (/^[a-z]/.test(v) ? v : "link_" + (v || "new")).slice(0, 40);
      let k = b, D = 2;
      for (; t.value.some((x) => x.id === k); ) {
        const x = "_" + D++;
        k = b.slice(0, 40 - x.length) + x;
      }
      return k;
    }
    function u(w) {
      (a.draft.relation_types ??= []).push({ id: i(w), outward: w, inward: w, cardinality: "many" });
    }
    async function p(w) {
      if (!r.value) {
        r.value = !0, m.value = "";
        try {
          const v = await a.guardRemoval?.("relation_types", w);
          v ? m.value = v : ya(a.draft, "relation_types", w);
        } finally {
          r.value = !1;
        }
      }
    }
    return (w, v) => (n(), g("section", cc, [
      m.value ? (n(), g("p", vc, E(m.value), 1)) : T("", !0),
      y(qa, {
        columns: "relations",
        count: t.value.length
      }, {
        default: G(() => [
          (n(!0), g(Q, null, re(t.value, (b, k) => (n(), H(Wa, {
            title: b.outward || s(Re)(b.id),
            kind: b.symmetric ? "Same both ways" : "Different each way",
            key: k,
            class: "work-stack"
          }, {
            usage: G(() => [
              c("span", mc, E(b.outward || "Related work") + " · " + E(b.inward || "Reverse relation"), 1)
            ]),
            actions: G(() => [
              y(s(ee), {
                severity: "secondary",
                text: "",
                disabled: r.value,
                onClick: (D) => p(b.id),
                "aria-label": "Remove link type",
                size: "small"
              }, {
                default: G(() => [
                  y(s(fe), {
                    icon: "tabler:trash",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["disabled", "onClick"])
            ]),
            default: G(() => [
              c("div", fc, [
                c("label", pc, [
                  v[0] || (v[0] = q("Shown on this item ", -1)),
                  y(s(Se), {
                    modelValue: b.outward,
                    "onUpdate:modelValue": (D) => b.outward = D,
                    "aria-label": "Shown on this item"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                c("label", bc, [
                  v[1] || (v[1] = q("Shown on the other item ", -1)),
                  y(s(Se), {
                    modelValue: b.inward,
                    "onUpdate:modelValue": (D) => b.inward = D,
                    "aria-label": "Shown on the other item"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                c("label", hc, [
                  v[2] || (v[2] = q("Links allowed ", -1)),
                  y(s(me), {
                    "model-value": b.cardinality ?? "many",
                    "onUpdate:modelValue": (D) => b.cardinality = D,
                    "aria-label": "Links allowed",
                    appendTo: "self",
                    optionLabel: "label",
                    optionValue: "value",
                    optionDisabled: "disabled",
                    options: [{ label: "One link", value: "one", disabled: !1 }, { label: "Many links", value: "many", disabled: !1 }]
                  }, null, 8, ["model-value", "onUpdate:modelValue"])
                ]),
                c("label", gc, [
                  y(s(Bt), {
                    modelValue: b.symmetric,
                    "onUpdate:modelValue": (D) => b.symmetric = D,
                    disabled: !!(b.from_types?.length || b.to_types?.length),
                    "aria-label": "Same meaning in both directions",
                    binary: ""
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"]),
                  v[3] || (v[3] = q("Same meaning in both directions ", -1))
                ])
              ]),
              b.from_types?.length || b.to_types?.length ? (n(), g("p", yc, " Clear the source and target types to use the same meaning in both directions. ")) : T("", !0),
              b.symmetric ? T("", !0) : (n(), g("div", kc, [
                y(ct, {
                  label: "Source item types",
                  options: l.value,
                  "model-value": b.from_types,
                  "onUpdate:modelValue": (D) => o(b, "from_types", D)
                }, null, 8, ["options", "model-value", "onUpdate:modelValue"]),
                c("div", wc, [
                  v[4] || (v[4] = c("p", { class: "work-muted work-small" }, "Use the type ID from this board or a peer board. Leave either end empty to allow any type there.", -1)),
                  b.to_types?.length ? (n(), g("div", Vc, [
                    (n(!0), g(Q, null, re(b.to_types, (D) => (n(), H(s(ee), {
                      key: D,
                      severity: "secondary",
                      text: "",
                      size: "small",
                      label: D + " ×",
                      "aria-label": "Remove target type " + D,
                      onClick: (x) => o(b, "to_types", b.to_types.filter((C) => C !== D))
                    }, null, 8, ["label", "aria-label", "onClick"]))), 128))
                  ])) : T("", !0),
                  y(ba, {
                    action: "Add target type",
                    label: "Target type ID",
                    maxlength: 40,
                    validate: (D) => d(b, D),
                    onAdd: (D) => f(b, D)
                  }, null, 8, ["validate", "onAdd"])
                ])
              ])),
              y(Ne, {
                class: "work-disclosure",
                label: "Advanced link settings"
              }, {
                default: G(() => [
                  c("label", $c, [
                    v[5] || (v[5] = q("Identifier ", -1)),
                    y(s(Se), {
                      modelValue: b.id,
                      "onUpdate:modelValue": (D) => b.id = D,
                      required: "",
                      pattern: "[a-z][a-z0-9_]*",
                      "aria-label": "Relation ID"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ])
                ]),
                _: 2
              }, 1024),
              c("p", xc, [
                v[6] || (v[6] = c("strong", null, "This item", -1)),
                q(" " + E(b.outward || "relates to") + " ", 1),
                v[7] || (v[7] = c("strong", null, "another item", -1)),
                c("span", Cc, " · reverse: " + E(b.symmetric ? b.outward : b.inward), 1)
              ])
            ]),
            _: 2
          }, 1032, ["title", "kind"]))), 128)),
          t.value.length ? T("", !0) : (n(), g("p", Sc, "No link types yet. Add one to connect related work.")),
          y(ba, {
            action: "Add link type",
            label: "Link name",
            onAdd: u
          })
        ]),
        _: 1
      }, 8, ["count"])
    ]));
  }
});
function Lo(e) {
  return typeof e.error == "string" ? e.error : e.error?.message;
}
function lo(e, a) {
  const t = Lo(e);
  return e.parked ? "Stopped: " + (t ?? "Projection is parked") : t ? "Degraded: " + t : e.bootstrapping ? "Initializing" : e.last_seq >= a ? "Up to date" : "Catching up";
}
function Ic(e, a) {
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
  if (o.some((d) => d.parked)) return { kind: "reset", status: "Needs reset" };
  if (o.some(Lo)) return { kind: "degraded", status: "Degraded" };
}
const Dc = {
  class: "work-stack",
  "aria-label": "Plugins editor"
}, Uc = {
  key: 0,
  class: "kx-loading"
}, Ec = {
  key: 1,
  class: "kx-err",
  role: "alert"
}, Ac = {
  key: 2,
  class: "work-notice",
  role: "status"
}, Oc = {
  key: 0,
  class: "work-muted work-small"
}, Pc = {
  key: 1,
  class: "work-notice"
}, Rc = {
  key: 2,
  class: "work-stack work-tight work-plugin-status"
}, Nc = {
  key: 0,
  class: "work-muted"
}, Mc = { key: 1 }, Fc = {
  key: 2,
  class: "work-row"
}, Lc = {
  key: 3,
  class: "work-row"
}, Bc = {
  key: 0,
  class: "work-small"
}, zc = {
  key: 6,
  class: "work-row"
}, jc = {
  key: 7,
  class: "work-row"
}, Wc = {
  key: 8,
  class: "work-row"
}, qc = {
  key: 3,
  class: "work-stack work-tight"
}, Gc = {
  key: 0,
  class: "work-muted"
}, Kc = { class: "work-form-actions" }, Hc = "kickside.work.planning:plugin", oo = /* @__PURE__ */ we({
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
    const t = e, l = a, o = B({}), d = B(""), f = B(""), m = B(""), r = B(/* @__PURE__ */ new Set()), i = B(/* @__PURE__ */ new Set()), u = K(() => t.options.map((U) => {
      const $ = L(U.plugin);
      return { plugin: U, current: $, issue: Ic(U, $) };
    })), p = K(() => !!d.value || t.disabled), w = K(() => p.value || t.activationLocked), v = {}, b = K(() => (t.draft.item_types ?? []).filter((U) => !["issue", "sprint", "milestone"].includes(U.id)).map((U) => ({ value: U.id, label: U.title || Re(U.id) }))), k = K(() => ["current_sprint", "milestone"].every((U) => t.schema.compiled?.fields?.some(($) => $.code === U))), D = K(() => {
      const U = t.filters;
      return U ? (t.draft.scopes ?? []).filter(($) => !U.some((j) => j.id === $ && t.options.some((X) => X.plugin === j.plugin))) : [];
    });
    function x(U) {
      return (t.filters ?? []).filter(($) => $.plugin === U);
    }
    function C(U, $) {
      const j = new Set(x(U).map((A) => A.id)), X = t.draft.scopes ?? [], de = [...X.filter((A) => !j.has(A)), ...$];
      (de.length !== X.length || de.some((A) => !X.includes(A))) && (t.draft.scopes = de);
    }
    function R(U, $) {
      pe(U, { ...ue(U), issue_types: $ });
    }
    function M(U) {
      return !!U.config_schema && ho(U.config_schema).length > 0;
    }
    function L(U) {
      return t.schema.plugins?.find(($) => $.plugin === U);
    }
    function le(U) {
      return L(U)?.active === !0;
    }
    function te(U) {
      return t.draft.plugins?.some(($) => $.use === U) === !0;
    }
    function ve(U, $) {
      const j = t.draft.plugins ?? [];
      $ && !te(U) && (t.draft.plugins = [...j, { use: U }]), $ || (t.draft.plugins = j.filter((X) => X.use !== U), delete t.configs[U], r.value.delete(U), l("validity", U, !0), C(U, []));
    }
    function J(U, $) {
      ve(U, !1), l("review", $.currentTarget);
    }
    function ue(U) {
      return le(U) ? o.value[U] ?? L(U)?.config ?? v : t.configs[U] ?? v;
    }
    function pe(U, $) {
      le(U) ? o.value[U] = $ : t.configs[U] = $;
    }
    function _(U, $) {
      $ ? r.value.delete(U) : r.value.add(U), le(U) || l("validity", U, $);
    }
    async function I(U, $ = !1) {
      if (!(p.value || !$ && r.value.has(U))) {
        d.value = U, f.value = "", m.value = "";
        try {
          $ ? await xt.configure(t.boardId, U) : (await xt.configure(t.boardId, U, ue(U)), delete o.value[U], i.value.delete(U)), m.value = $ ? "Plugin recovery started." : "Plugin configuration saved.", l("configured");
        } catch (j) {
          f.value = ot(j, $ ? "Could not recover the plugin." : "Could not configure plugin.");
        } finally {
          d.value = "";
        }
      }
    }
    return (U, $) => (n(), g("section", Dc, [
      e.options.length ? T("", !0) : (n(), g("p", Uc, "No installed plugins are visible to you.")),
      f.value ? (n(), g("div", Ec, E(f.value), 1)) : T("", !0),
      m.value ? (n(), g("p", Ac, E(m.value), 1)) : T("", !0),
      y(qa, {
        columns: "plugins",
        count: e.options.length
      }, {
        default: G(() => [
          (n(!0), g(Q, null, re(u.value, ({ plugin: j, current: X, issue: de }) => (n(), H(Wa, {
            key: j.plugin,
            title: j.installed === !1 ? j.plugin : j.title || j.plugin,
            description: j.description,
            kind: te(j.plugin) !== le(j.plugin) ? "Pending review" : de?.status,
            class: "work-stack"
          }, {
            actions: G(() => [
              de?.kind !== "missing" ? (n(), H(s(Qe), {
                key: 0,
                "model-value": te(j.plugin),
                "aria-label": "Enable " + (j.title || j.plugin),
                disabled: w.value || !!j.problem && !te(j.plugin),
                "onUpdate:modelValue": (A) => ve(j.plugin, A)
              }, null, 8, ["model-value", "aria-label", "disabled", "onUpdate:modelValue"])) : T("", !0)
            ]),
            default: G(() => [
              j.requires.length ? (n(), g("p", Oc, "Requires " + E(j.requires.map((A) => e.options.find((W) => W.plugin === A)?.title || "Another capability").join(", ")), 1)) : T("", !0),
              X?.outdated ? (n(), g("p", Pc, "The stored declaration differs from the installed plugin. Review activation to update it.")) : T("", !0),
              de || X?.active ? (n(), g("div", Rc, [
                de && "cause" in de ? (n(), g("p", Nc, E(de.cause), 1)) : de ? T("", !0) : (n(), g("p", Mc, E(X?.lifecycle.state === "ready" ? "Ready to use" : "Getting ready"), 1)),
                (n(!0), g(Q, null, re(X?.projections, (A, W) => (n(), g("div", {
                  key: W,
                  class: "work-stack work-tight"
                }, [
                  c("p", null, E(s(lo)(A, e.schema.as_of)) + " · Indexed through " + E(A.last_seq) + " of " + E(e.schema.as_of) + " events.", 1)
                ]))), 128)),
                de?.kind === "setup" && X?.active ? (n(), g("div", Fc, [
                  y(s(ee), {
                    label: "Retry setup",
                    severity: "secondary",
                    outlined: "",
                    disabled: p.value,
                    onClick: (A) => I(j.plugin, !0)
                  }, null, 8, ["disabled", "onClick"])
                ])) : de?.kind === "provider" ? (n(), g("div", Lc, [
                  y(s(ee), {
                    label: "Retry schema check",
                    severity: "secondary",
                    outlined: "",
                    disabled: p.value,
                    onClick: $[0] || ($[0] = (A) => l("refresh"))
                  }, null, 8, ["disabled"])
                ])) : de?.kind === "degraded" ? (n(), H(Ne, {
                  key: 4,
                  class: "work-small",
                  label: "Inspect worker"
                }, {
                  default: G(() => [
                    $[1] || ($[1] = c("p", null, "Check the failing worker before resetting a projection.", -1)),
                    (n(!0), g(Q, null, re(X?.projections, (A, W) => (n(), g("p", { key: W }, E(W) + " · " + E(s(lo)(A, e.schema.as_of)), 1))), 128))
                  ]),
                  _: 2
                }, 1024)) : de?.kind === "history" ? (n(), g(Q, { key: 5 }, [
                  de.floor !== void 0 ? (n(), g("p", Bc, "Earliest retained event sequence is " + E(de.floor) + ".", 1)) : T("", !0),
                  y(Ne, {
                    class: "work-small",
                    label: "Review retained history"
                  }, {
                    default: G(() => [...$[2] || ($[2] = [
                      c("p", null, "Ask the plugin maintainer to review the event projection’s start sequence. The plugin needs a declaration that can run with the retained history.", -1)
                    ])]),
                    _: 1
                  })
                ], 64)) : de?.kind === "reset" ? (n(), g("div", zc, [
                  y(s(ee), {
                    label: "Reset projection",
                    severity: "secondary",
                    outlined: "",
                    disabled: p.value,
                    onClick: (A) => I(j.plugin, !0)
                  }, null, 8, ["disabled", "onClick"]),
                  $[3] || ($[3] = c("span", { class: "work-muted work-small" }, "Resolve the worker error before resetting.", -1))
                ])) : de?.kind === "configuration" && te(j.plugin) && M(j) && !i.value.has(j.plugin) ? (n(), g("div", jc, [
                  y(s(ee), {
                    label: "Edit configuration",
                    severity: "secondary",
                    outlined: "",
                    disabled: p.value,
                    onClick: (A) => i.value.add(j.plugin)
                  }, null, 8, ["disabled", "onClick"])
                ])) : de?.kind === "missing" && te(j.plugin) ? (n(), g("div", Wc, [
                  y(s(ee), {
                    label: "Review references",
                    severity: "secondary",
                    outlined: "",
                    disabled: w.value,
                    onClick: (A) => J(j.plugin, A)
                  }, null, 8, ["disabled", "onClick"])
                ])) : T("", !0)
              ])) : T("", !0),
              x(j.plugin).length && (te(j.plugin) || le(j.plugin)) ? (n(), g("section", qc, [
                $[4] || ($[4] = c("h4", null, "Query filters", -1)),
                $[5] || ($[5] = c("p", { class: "work-muted" }, "Choose which filters people can use to narrow down work on this board.", -1)),
                y(ct, {
                  label: "Available filters",
                  disabled: !!d.value || e.disabled || !te(j.plugin),
                  options: x(j.plugin).map((A) => ({ value: A.id, label: A.title })),
                  "model-value": e.draft.scopes?.filter((A) => x(j.plugin).some((W) => W.id === A)),
                  "onUpdate:modelValue": (A) => C(j.plugin, A)
                }, null, 8, ["disabled", "options", "model-value", "onUpdate:modelValue"])
              ])) : T("", !0),
              te(j.plugin) && M(j) && de?.kind !== "manifest" && de?.kind !== "missing" && (de?.kind !== "configuration" || i.value.has(j.plugin)) ? (n(), H(_t(de && de.kind !== "configuration" ? Ne : "div"), {
                key: 4,
                label: de && de.kind !== "configuration" ? "Plugin settings" : void 0,
                class: "work-stack work-tight"
              }, {
                default: G(() => [
                  j.plugin === Hc ? (n(), g(Q, { key: 0 }, [
                    k.value ? (n(), H(ct, {
                      key: 1,
                      label: "Plan these item types",
                      options: b.value,
                      "model-value": ue(j.plugin).issue_types,
                      disabled: !!d.value || e.disabled,
                      "onUpdate:modelValue": (A) => R(j.plugin, A)
                    }, null, 8, ["options", "model-value", "disabled", "onUpdate:modelValue"])) : (n(), g("p", Gc, "The Planning pack supplies sprint and milestone fields for item types.")),
                    $[6] || ($[6] = c("p", { class: "work-muted" }, "Selected types get Current sprint and Milestone fields.", -1))
                  ], 64)) : (n(), H(bo, {
                    key: 1,
                    disabled: !!d.value || e.disabled,
                    schema: j.config_schema,
                    "model-value": ue(j.plugin),
                    "onUpdate:modelValue": (A) => pe(j.plugin, A),
                    onValidity: (A) => _(j.plugin, A)
                  }, null, 8, ["disabled", "schema", "model-value", "onUpdate:modelValue", "onValidity"])),
                  c("div", Kc, [
                    y(s(ee), {
                      label: de ? "Reset form values" : "Reset",
                      severity: "secondary",
                      outlined: "",
                      disabled: !!d.value || e.disabled,
                      onClick: (A) => pe(j.plugin, le(j.plugin) ? s(Rt)(L(j.plugin)?.config ?? {}) : {})
                    }, null, 8, ["label", "disabled", "onClick"]),
                    le(j.plugin) ? (n(), H(s(ee), {
                      key: 0,
                      label: "Save plugin settings",
                      disabled: !!d.value || e.disabled || r.value.has(j.plugin) || !o.value[j.plugin],
                      loading: d.value === j.plugin,
                      onClick: (A) => I(j.plugin)
                    }, null, 8, ["disabled", "loading", "onClick"])) : T("", !0)
                  ])
                ]),
                _: 2
              }, 1032, ["label"])) : T("", !0)
            ]),
            _: 2
          }, 1032, ["title", "description", "kind"]))), 128))
        ]),
        _: 1
      }, 8, ["count"]),
      D.value.length ? (n(), H(Ne, {
        key: 3,
        class: "work-settings-card work-disclosure",
        label: "Unavailable query filters"
      }, {
        default: G(() => [
          $[7] || ($[7] = c("p", { class: "work-muted" }, "These filters came from a plugin that is unavailable. Remove one to stop using it on this board.", -1)),
          (n(!0), g(Q, null, re(D.value, (j, X) => (n(), H(s(ee), {
            key: j,
            label: "Remove unavailable filter " + (X + 1),
            severity: "secondary",
            text: "",
            onClick: (de) => e.draft.scopes = e.draft.scopes?.filter((A) => A !== j)
          }, null, 8, ["label", "onClick"]))), 128))
        ]),
        _: 1
      })) : T("", !0),
      (n(!0), g(Q, null, re(e.draft.plugins?.filter((j) => !e.options.some((X) => X.plugin === j.use)) ?? [], (j) => (n(), g("article", {
        key: j.use,
        class: "work-settings-card work-stack"
      }, [
        c("p", null, [
          c("strong", null, E(j.use), 1),
          $[8] || ($[8] = q(" · Not installed", -1))
        ]),
        $[9] || ($[9] = c("p", { class: "work-muted" }, "This board still references a plugin that is no longer installed.", -1)),
        y(s(ee), {
          label: "Review references",
          severity: "secondary",
          outlined: "",
          disabled: w.value,
          onClick: (X) => J(j.use, X)
        }, null, 8, ["disabled", "onClick"])
      ]))), 128))
    ]));
  }
}), Yc = { class: "system-section-head" }, Xc = { class: "system-section-head-text" }, Jc = {
  key: 0,
  class: "kx-head-actions"
}, Zc = /* @__PURE__ */ we({
  __name: "SettingsSectionHead",
  props: {
    title: {},
    description: {}
  },
  setup(e) {
    return (a, t) => (n(), g("header", Yc, [
      c("div", Xc, [
        c("h1", null, E(e.title), 1),
        c("p", null, E(e.description), 1)
      ]),
      a.$slots.actions ? (n(), g("div", Jc, [
        Je(a.$slots, "actions")
      ])) : T("", !0)
    ]));
  }
}), Qc = /* @__PURE__ */ we({
  __name: "SettingsDraftActions",
  props: {
    busy: { type: Boolean },
    discardDisabled: { type: Boolean },
    reviewDisabled: { type: Boolean }
  },
  emits: ["discard", "review"],
  setup(e) {
    return (a, t) => (n(), g(Q, null, [
      y(s(Ye), {
        severity: "warn",
        value: "Unsaved changes"
      }),
      y(s(ee), {
        label: "Discard",
        type: "button",
        severity: "secondary",
        outlined: "",
        disabled: e.busy || e.discardDisabled,
        onClick: t[0] || (t[0] = (l) => a.$emit("discard"))
      }, {
        icon: G(() => [
          y(s(fe), {
            icon: "tabler:restore",
            "aria-hidden": "true"
          })
        ]),
        _: 1
      }, 8, ["disabled"]),
      y(s(ee), {
        label: "Review changes",
        type: "button",
        disabled: e.busy || e.reviewDisabled,
        loading: e.busy,
        onClick: t[1] || (t[1] = (l) => a.$emit("review", l.currentTarget))
      }, null, 8, ["disabled", "loading"])
    ], 64));
  }
}), _c = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, ev = ["config"], tv = /* @__PURE__ */ we({
  __name: "BoardShare",
  props: {
    board: {},
    busy: { type: Boolean }
  },
  emits: ["shared"],
  setup(e) {
    const a = e, t = B(!1), l = B(!1), o = B("");
    async function d() {
      const m = a.board;
      if (!(a.busy || l.value)) {
        l.value = !0, o.value = "";
        try {
          const r = await It("kickside-share");
          if (a.board.board_id !== m.board_id) return;
          r ? t.value = !0 : o.value = "Sharing is unavailable. Try opening it again.";
        } finally {
          l.value = !1;
        }
      }
    }
    Ie(() => a.board.board_id, () => {
      t.value = !1, o.value = "";
    });
    const f = K(() => {
      const m = encodeURIComponent(a.board.board_id);
      return JSON.stringify({
        resource_id: a.board.board_id,
        title: a.board.title,
        access_url: "/api/v1/component-access/grants/" + m,
        share_url: "/api/v1/component-access/share/" + m
      });
    });
    return (m, r) => (n(), g(Q, null, [
      y(s(ee), {
        label: "Share board",
        severity: "secondary",
        outlined: "",
        loading: l.value,
        disabled: e.busy,
        onClick: d
      }, {
        icon: G(() => [
          y(s(fe), {
            icon: "tabler:share",
            "aria-hidden": "true"
          })
        ]),
        _: 1
      }, 8, ["loading", "disabled"]),
      o.value ? (n(), g("p", _c, E(o.value), 1)) : T("", !0),
      t.value ? (n(), g("kickside-share", {
        key: 1,
        config: f.value,
        onClose: r[0] || (r[0] = (i) => t.value = !1),
        onChanged: r[1] || (r[1] = (i) => m.$emit("shared"))
      }, null, 40, ev)) : T("", !0)
    ], 64));
  }
}), av = {
  class: "work-stack",
  "aria-label": "Board visibility"
}, lv = { class: "work-stack work-tight" }, ov = {
  key: 0,
  class: "work-settings-list"
}, iv = { class: "work-row-main" }, nv = { class: "work-small work-muted" }, sv = { class: "work-row-control" }, rv = { class: "work-row" }, dv = /* @__PURE__ */ we({
  __name: "VisibilityEditor",
  props: {
    draft: {},
    boardId: {}
  },
  emits: ["validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = K(() => t.draft.visibility), d = K(() => (t.draft.fields ?? []).filter((p) => p.form === "text" && (!p.cardinality || p.cardinality === "one") && p.type !== "rollup" && p.index !== "number" && p.config?.case !== "insensitive")), f = K(() => d.value.find((p) => p.code === o.value?.field)?.type !== "option");
    function m(p) {
      if (o.value?.levels.some((w) => w.id === p)) return "This level is already in use.";
    }
    function r(p) {
      o.value?.levels.push({ id: p, holders: [] });
    }
    function i(p) {
      if (!p) {
        delete t.draft.visibility;
        return;
      }
      const w = d.value.find((v) => v.code === p);
      t.draft.visibility = { field: p, levels: (w?.options ?? []).map((v) => ({ id: v.id, holders: [] })) };
    }
    function u(p, w) {
      const v = o.value?.levels.find((b) => b.id === p);
      v && (v.holders = w ?? []);
    }
    return (p, w) => (n(), g("section", av, [
      w[7] || (w[7] = c("h3", { class: "work-group-title" }, "Board visibility", -1)),
      w[8] || (w[8] = c("p", { class: "work-small work-muted" }, "Restrict items by their visibility level. People still need access to the board.", -1)),
      c("label", lv, [
        w[5] || (w[5] = q("Visibility field ", -1)),
        y(s(me), {
          "aria-label": "Visibility field",
          "model-value": o.value?.field ?? "",
          options: [{ label: "No additional restriction", value: "" }, ...d.value.map((v) => ({ label: s(Ke)(v), value: v.code }))],
          optionLabel: "label",
          optionValue: "value",
          appendTo: "self",
          "onUpdate:modelValue": i
        }, null, 8, ["model-value", "options"])
      ]),
      o.value ? (n(), g(Q, { key: 0 }, [
        o.value.levels.length ? (n(), g("div", ov, [
          (n(!0), g(Q, null, re(o.value.levels, (v, b) => (n(), g("div", {
            key: v.id,
            class: "work-settings-row"
          }, [
            c("div", iv, [
              c("strong", null, E(d.value.find((k) => k.code === o.value.field)?.options?.find((k) => k.id === v.id)?.label || v.id), 1),
              c("p", nv, "Level " + E(b + 1), 1)
            ]),
            c("div", sv, [
              y(Vo, {
                "board-id": e.boardId,
                label: "Who can see these items",
                "model-value": v.holders,
                "onUpdate:modelValue": (k) => u(v.id, k),
                onValidity: w[0] || (w[0] = (k) => l("validity", k))
              }, null, 8, ["board-id", "model-value", "onUpdate:modelValue"])
            ])
          ]))), 128))
        ])) : T("", !0),
        f.value ? (n(), H(ba, {
          key: o.value.field,
          action: "Add level",
          label: "New visibility level",
          validate: m,
          onAdd: r
        })) : T("", !0),
        c("label", rv, [
          y(s(Qe), {
            "model-value": o.value.bypass === "admin",
            "onUpdate:modelValue": w[1] || (w[1] = (v) => v ? o.value.bypass = "admin" : delete o.value.bypass)
          }, null, 8, ["model-value"]),
          w[6] || (w[6] = q(" Board administrators can see every level ", -1))
        ]),
        y(s(ee), {
          label: "Remove visibility restriction",
          severity: "secondary",
          text: "",
          onClick: w[2] || (w[2] = (v) => delete e.draft.visibility)
        })
      ], 64)) : T("", !0),
      y(Dt, {
        label: "Visibility rules",
        "model-value": o.value,
        shape: "object",
        example: { field: "visibility", levels: [{ id: "internal", holders: [] }], bypass: "admin" },
        "onUpdate:modelValue": w[3] || (w[3] = (v) => e.draft.visibility = v),
        onValidity: w[4] || (w[4] = (v) => l("validity", v))
      }, null, 8, ["model-value"])
    ]));
  }
}), uv = { class: "work-ia-section" }, cv = {
  class: "work-settings-list",
  "aria-labelledby": "work-sharing-title"
}, vv = { class: "work-settings-row" }, mv = { class: "work-row-main" }, fv = {
  key: 0,
  class: "work-muted work-small"
}, pv = {
  key: 0,
  class: "work-member-preview",
  "aria-label": "People and groups with direct access"
}, bv = { class: "work-spacer" }, hv = {
  key: 1,
  class: "work-chips"
}, gv = {
  key: 1,
  class: "work-settings-row work-muted work-small"
}, yv = {
  key: 2,
  class: "work-settings-row work-muted"
}, kv = {
  key: 3,
  class: "work-settings-row"
}, wv = {
  key: 4,
  class: "work-settings-row work-muted",
  role: "status"
}, Vv = /* @__PURE__ */ we({
  __name: "BoardAccessSettings",
  props: {
    boardId: {},
    draft: {},
    active: { type: Boolean },
    board: {},
    busy: { type: Boolean }
  },
  emits: ["validity"],
  setup(e) {
    const a = e, t = B(), l = B([]), o = K(() => t.value?.filter((b) => b.subject_type === "group").length ?? 0), d = K(() => (t.value?.length ?? 0) - o.value), f = K(() => [...t.value ?? []].sort((b, k) => +!!k.owner - +!!b.owner || k.access_mask - b.access_mask).slice(0, 6)), m = K(() => f.value.map((b) => ({ id: b.subject_id, kind: b.subject_type ?? "user" }))), r = go(() => a.boardId, m);
    function i(b) {
      return b.full_name || r.label({ id: b.subject_id, kind: b.subject_type ?? "user", email: b.email });
    }
    function u(b) {
      return l.value.filter((k) => (b.access_mask & k.bit) === k.bit);
    }
    const p = B(!1), w = ua();
    async function v() {
      const b = w();
      p.value = !1;
      try {
        const [{ data: k }, D] = await Promise.all([
          fl.get("/api/v1/component-access/grants/" + encodeURIComponent(a.boardId)),
          fl.get("/api/v1/components/access-model")
        ]);
        if (!b()) return;
        if (!k?.success || !Array.isArray(k.access)) throw new Error("Grants unavailable");
        t.value = k.access, l.value = D.data?.success && Array.isArray(D.data.capabilities) ? D.data.capabilities : [];
      } catch {
        b() && (t.value = void 0, p.value = !0);
      }
    }
    return Vl(() => w()), Ie(() => [a.active, a.boardId], () => {
      a.active && v();
    }, { immediate: !0 }), (b, k) => (n(), g("section", uv, [
      c("section", cv, [
        c("div", vv, [
          c("div", mv, [
            k[1] || (k[1] = c("h3", {
              id: "work-sharing-title",
              class: "work-row-title"
            }, "Members and sharing", -1)),
            t.value ? (n(), g("p", fv, E(d.value) + " " + E(d.value === 1 ? "person" : "people") + " and " + E(o.value) + " " + E(o.value === 1 ? "group" : "groups") + " with direct access", 1)) : T("", !0)
          ]),
          e.board ? (n(), H(tv, {
            key: 0,
            board: e.board,
            busy: e.busy,
            onShared: v
          }, null, 8, ["board", "busy"])) : T("", !0)
        ]),
        f.value.length ? (n(), g("ul", pv, [
          (n(!0), g(Q, null, re(f.value, (D) => (n(), g("li", {
            key: D.subject_type + D.subject_id,
            class: "work-settings-row"
          }, [
            y(s(fe), {
              icon: D.subject_type === "group" ? "tabler:users" : "tabler:user",
              "aria-hidden": "true"
            }, null, 8, ["icon"]),
            c("strong", bv, E(i(D)), 1),
            D.owner ? (n(), H(s(Ye), {
              key: 0,
              severity: "secondary",
              value: "Owner"
            })) : (n(), g("span", hv, [
              (n(!0), g(Q, null, re(u(D), (x) => (n(), H(s(Ye), {
                key: x.key,
                severity: "secondary",
                value: x.label
              }, null, 8, ["value"]))), 128))
            ]))
          ]))), 128))
        ])) : T("", !0),
        t.value && t.value.length > f.value.length ? (n(), g("p", gv, " See all " + E(t.value.length) + " people and groups under Share board. ", 1)) : t.value && !t.value.length ? (n(), g("p", yv, "No direct grants yet.")) : p.value ? (n(), g("div", kv, [
          k[2] || (k[2] = c("p", {
            class: "work-spacer work-muted",
            role: "alert"
          }, "Member summary is unavailable.", -1)),
          y(s(ee), {
            label: "Reload members",
            severity: "secondary",
            text: "",
            onClick: v
          })
        ])) : t.value ? T("", !0) : (n(), g("p", wv, "Loading members…"))
      ]),
      y(Ne, {
        class: "work-settings-card work-disclosure",
        label: e.draft.visibility ? "Advanced · Item visibility rules set" : "Advanced · Item visibility"
      }, {
        default: G(() => [
          y(dv, {
            "board-id": e.boardId,
            draft: e.draft,
            onValidity: k[0] || (k[0] = (D) => b.$emit("validity", D))
          }, null, 8, ["board-id", "draft"])
        ]),
        _: 1
      }, 8, ["label"])
    ]));
  }
}), $v = { class: "work-settings-row" }, xv = ["for"], Cv = { class: "work-settings-row" }, Sv = { class: "work-row-main" }, Tv = ["id"], Iv = { class: "work-settings-grid" }, Dv = { class: "work-stack work-tight" }, Uv = { class: "work-stack work-tight" }, Ev = ["value", "inert"], Av = {
  key: 1,
  class: "work-muted work-small"
}, Ov = {
  key: 0,
  class: "work-settings-row"
}, Pv = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, Rv = {
  key: 1,
  class: "work-muted work-small",
  role: "status"
}, Nv = {
  key: 1,
  class: "work-board-identity work-stack work-tight"
}, Mv = { class: "work-stack work-tight" }, Fv = { class: "work-stack work-tight" }, Lv = { class: "work-stack work-tight" }, Bv = ["value", "inert"], zv = {
  key: 1,
  class: "work-muted work-small"
}, jv = { class: "work-row" }, Wv = { class: "work-row" }, qv = { class: "work-row work-board-title" }, Gv = {
  key: 1,
  class: "work-identity-actions"
}, Kv = ["title"], Hv = {
  key: 2,
  class: "kx-err work-inline",
  role: "alert"
}, Yv = {
  key: 3,
  class: "work-muted work-small",
  role: "status"
}, Xv = /* @__PURE__ */ we({
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
    const t = e, l = a, o = B(!1), d = B(!1), f = B(""), m = B(""), r = B(""), i = B(""), u = B(!1), p = B(!1), w = B(""), v = B(""), b = K(() => t.board?.access?.admin === !0), k = zt(), D = zt(), x = B({ title: "", description: "", icon: "", app: "" }), C = K(() => [
      { id: "", title: "Default app" },
      ...t.boardApps ?? [],
      ...t.board?.ui_app && !t.boardApps?.some((I) => I.id === t.board?.ui_app) ? [{ id: t.board.ui_app, title: t.boardApps ? "Unavailable app" : "Configured board app", disabled: !0 }] : []
    ]), R = K(() => C.value.find((I) => I.id === i.value)?.title), M = K(() => !!t.boardApps?.length || !!t.board?.ui_app), L = K(() => ({
      title: t.board?.title ?? "",
      icon: t.board?.icon ?? "",
      description: t.board?.description ?? "",
      app: t.board?.ui_app ?? ""
    }));
    function le() {
      x.value = L.value, f.value = L.value.title, r.value = L.value.icon, m.value = L.value.description, i.value = L.value.app;
    }
    function te() {
      It("wc-icon-picker").then((I) => u.value = I);
    }
    function ve() {
      le(), w.value = "", v.value = "", o.value = !0, te();
    }
    const J = K(() => {
      const I = {};
      return f.value.trim() !== x.value.title && (I.title = f.value.trim()), m.value !== x.value.description && (I.description = m.value), r.value !== x.value.icon && (I.icon = r.value), i.value !== x.value.app && (I.ui_app = i.value), I;
    }), ue = K(() => (t.detail || o.value) && Object.keys(J.value).length > 0);
    Ie(L, () => {
      t.detail && !ue.value && le();
    }, { immediate: !0 }), Ie(d, (I) => {
      I && te();
    }), Ie(b, (I) => {
      I || pe();
    }), Ie(ue, (I) => l("dirty-change", I));
    function pe() {
      o.value = !1, w.value = "", v.value = "", le();
    }
    async function _() {
      if (!b.value || !t.board || p.value || !f.value.trim()) return;
      const I = J.value;
      if (!Object.keys(I).length) {
        o.value = !1, v.value = "Nothing changed.";
        return;
      }
      p.value = !0, w.value = "";
      try {
        const U = await ht.updateBoard(t.board.board_id, I);
        f.value = f.value.trim(), x.value = { title: f.value, description: m.value, icon: r.value, app: i.value }, o.value = !1, v.value = U.status === "unchanged" ? "Nothing changed." : "Board saved.", l("saved");
      } catch (U) {
        w.value = ot(U, "Could not save the board.");
      } finally {
        p.value = !1;
      }
    }
    return (I, U) => e.detail ? (n(), g("form", {
      key: 0,
      class: "work-board-identity",
      "aria-label": "Edit board details",
      onSubmit: Ee(_, ["prevent"])
    }, [
      c("div", $v, [
        c("label", {
          for: s(k),
          class: "work-row-main work-row-title"
        }, "Board name", 8, xv),
        y(s(Se), {
          id: s(k),
          modelValue: f.value,
          "onUpdate:modelValue": U[0] || (U[0] = ($) => f.value = $),
          required: "",
          disabled: p.value || !b.value
        }, null, 8, ["id", "modelValue", "disabled"])
      ]),
      c("div", Cv, [
        c("div", Sv, [
          c("h3", {
            class: "work-row-title",
            id: s(D)
          }, "Board app", 8, Tv),
          U[9] || (U[9] = c("p", { class: "work-muted work-small" }, "Opens the board from Work navigation.", -1))
        ]),
        y(s(me), {
          modelValue: i.value,
          "onUpdate:modelValue": U[1] || (U[1] = ($) => i.value = $),
          "aria-labelledby": s(D),
          options: C.value,
          placeholder: R.value,
          optionLabel: "title",
          optionValue: "id",
          optionDisabled: "disabled",
          appendTo: "self",
          disabled: p.value || !b.value || !M.value
        }, null, 8, ["modelValue", "aria-labelledby", "options", "placeholder", "disabled"])
      ]),
      Je(I.$slots, "default"),
      y(Ne, {
        open: d.value,
        "onUpdate:open": U[4] || (U[4] = ($) => d.value = $),
        class: "work-board-appearance",
        label: "Board description and icon"
      }, {
        default: G(() => [
          c("div", Iv, [
            c("label", Dv, [
              U[10] || (U[10] = q("Description", -1)),
              y(s(ha), {
                modelValue: m.value,
                "onUpdate:modelValue": U[2] || (U[2] = ($) => m.value = $),
                rows: "1",
                disabled: p.value || !b.value
              }, null, 8, ["modelValue", "disabled"])
            ]),
            c("div", Uv, [
              U[11] || (U[11] = c("span", null, "Board icon", -1)),
              u.value ? (n(), g("wc-icon-picker", {
                key: 0,
                value: r.value,
                fallback: "tabler:layout-kanban",
                inert: p.value || !b.value || void 0,
                onSelect: U[3] || (U[3] = ($) => r.value = $.detail)
              }, null, 40, Ev)) : (n(), g("p", Av, "The icon picker is unavailable."))
            ])
          ])
        ]),
        _: 1
      }, 8, ["open"]),
      ue.value || w.value || v.value ? (n(), g("div", Ov, [
        w.value ? (n(), g("p", Pv, E(w.value), 1)) : v.value && !ue.value ? (n(), g("p", Rv, E(v.value), 1)) : T("", !0),
        ue.value ? (n(), g(Q, { key: 2 }, [
          y(s(ee), {
            label: "Save board details",
            type: "submit",
            size: "small",
            disabled: !f.value.trim() || p.value || !b.value,
            loading: p.value
          }, null, 8, ["disabled", "loading"]),
          y(s(ee), {
            label: "Cancel",
            type: "button",
            severity: "secondary",
            text: "",
            size: "small",
            disabled: p.value,
            onClick: pe
          }, null, 8, ["disabled"])
        ], 64)) : T("", !0)
      ])) : T("", !0)
    ], 32)) : (n(), g("div", Nv, [
      o.value ? (n(), g("form", {
        key: 0,
        class: "work-identity-edit",
        "aria-label": "Edit board",
        onClick: U[8] || (U[8] = Ee(() => {
        }, ["stop"])),
        onSubmit: Ee(_, ["prevent"])
      }, [
        c("label", Mv, [
          U[12] || (U[12] = q("Title", -1)),
          y(s(Se), {
            modelValue: f.value,
            "onUpdate:modelValue": U[5] || (U[5] = ($) => f.value = $),
            required: "",
            autofocus: "",
            disabled: p.value
          }, null, 8, ["modelValue", "disabled"])
        ]),
        c("label", Fv, [
          U[13] || (U[13] = q("Description", -1)),
          y(s(ha), {
            modelValue: m.value,
            "onUpdate:modelValue": U[6] || (U[6] = ($) => m.value = $),
            rows: "1",
            disabled: p.value
          }, null, 8, ["modelValue", "disabled"])
        ]),
        c("div", Lv, [
          U[14] || (U[14] = c("span", null, "Board icon", -1)),
          u.value ? (n(), g("wc-icon-picker", {
            key: 0,
            value: r.value,
            fallback: "tabler:layout-kanban",
            inert: p.value || void 0,
            onSelect: U[7] || (U[7] = ($) => r.value = $.detail)
          }, null, 40, Bv)) : (n(), g("p", zv, "The icon picker is unavailable."))
        ]),
        c("div", jv, [
          y(s(ee), {
            label: "Save",
            severity: "secondary",
            type: "submit",
            disabled: !f.value.trim() || p.value,
            loading: p.value,
            outlined: ""
          }, {
            icon: G(() => [
              y(s(fe), {
                icon: "tabler:device-floppy",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled", "loading"]),
          y(s(ee), {
            label: "Cancel",
            severity: "secondary",
            disabled: p.value,
            onClick: pe,
            outlined: ""
          }, {
            icon: G(() => [
              y(s(fe), {
                icon: "tabler:x",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled"])
        ])
      ], 32)) : (n(), g(Q, { key: 1 }, [
        c("div", Wv, [
          c("div", qv, [
            e.board?.icon ? (n(), H(s(fe), {
              key: 0,
              icon: e.board.icon,
              "aria-hidden": "true"
            }, null, 8, ["icon"])) : T("", !0),
            (n(), H(_t(e.compact ? "h2" : "h1"), {
              class: ut(e.compact ? "kx-card-name" : "kx-title")
            }, {
              default: G(() => [
                q(E(e.board?.title || "Untitled board"), 1)
              ]),
              _: 1
            }, 8, ["class"]))
          ]),
          e.compact ? Je(I.$slots, "title-end", {}, void 0, void 0, 0) : T("", !0),
          e.compact ? (n(), g("span", Gv, [
            b.value ? (n(), H(s(ee), {
              key: 0,
              severity: "secondary",
              text: "",
              size: "small",
              onClick: Ee(ve, ["stop"]),
              "aria-label": "Edit board"
            }, {
              default: G(() => [
                y(s(fe), {
                  icon: "tabler:pencil",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            })) : T("", !0),
            Je(I.$slots, "actions")
          ])) : b.value ? (n(), H(s(ee), {
            key: 2,
            severity: "secondary",
            text: "",
            size: "small",
            onClick: Ee(ve, ["stop"]),
            "aria-label": "Edit board"
          }, {
            default: G(() => [
              y(s(fe), {
                icon: "tabler:pencil",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          })) : T("", !0),
          e.compact ? T("", !0) : Je(I.$slots, "title-end", {}, void 0, void 0, 3)
        ]),
        !e.compact && (e.subtitle || e.board?.description) ? (n(), g("p", {
          key: 0,
          class: "kx-head-sub",
          title: e.subtitle || e.board?.description
        }, E(e.subtitle || e.board?.description), 9, Kv)) : T("", !0)
      ], 64)),
      w.value ? (n(), g("p", Hv, E(w.value), 1)) : T("", !0),
      v.value ? (n(), g("p", Yv, E(v.value), 1)) : T("", !0)
    ]));
  }
}), Jv = { class: "work-ia-section work-ia-general" }, Zv = {
  class: "work-settings-list work-board-details",
  "aria-label": "Board details"
}, Qv = { class: "work-settings-row" }, _v = { class: "work-row-main" }, em = ["for"], tm = { class: "work-muted work-small" }, am = {
  class: "work-board-summary work-row work-wrap work-small",
  "aria-label": "Board summary"
}, lm = { class: "work-muted" }, om = { key: 0 }, im = { key: 1 }, nm = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, sm = {
  key: 0,
  class: "work-stack work-tight"
}, rm = {
  key: 1,
  class: "work-muted"
}, dm = { class: "work-stack work-tight" }, um = { class: "work-spacer" }, cm = /* @__PURE__ */ we({
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
    const a = e, t = zt(), l = {
      comments_per_item: "Comments per item",
      audit: "Change history",
      audit_days: "Change history retention",
      interval_days: "Time-in-state history retention",
      trash_days: "Trash retention",
      tombstone_days: "Deletion record retention"
    }, o = K(() => Object.keys(l).filter((w) => a.draft.policy?.[w] !== void 0));
    function d(w) {
      const v = a.draft.policy?.[w];
      return w === "audit" ? v === "off" ? "Off" : "Track field changes" : w === "comments_per_item" ? v : v === 0 ? w === "audit_days" || w === "interval_days" ? "365 days" : "Clean up immediately" : v === 1 ? "1 day" : v + " days";
    }
    const f = B(), m = B(!1);
    let r = "";
    Ie([() => a.active, () => a.board?.board_id, () => a.schema.generation], async ([w, v, b], k, D) => {
      if (!w || !v || r === v + "/" + b) return;
      f.value = void 0, m.value = !1;
      let x = !0;
      D(() => x = !1);
      try {
        const C = await Promise.all(Array.from(
          { length: Math.min(3, Math.max(0, b - 1)) },
          (R, M) => ht.schema(v, b - M - 1)
        ));
        x && (f.value = C, r = v + "/" + b);
      } catch {
        x && (m.value = !0);
      }
    }, { immediate: !0 });
    function i(w) {
      return JSON.stringify(w, (v, b) => b && typeof b == "object" && !Array.isArray(b) ? Object.fromEntries(Object.entries(b).sort(([k], [D]) => k.localeCompare(D))) : b);
    }
    function u(w, v) {
      if (!v) return ["Initial board setup"];
      const b = w.declaration, k = v.declaration, D = [], x = [
        ["Fields", b.fields, k.fields],
        ["Item types", b.item_types, k.item_types],
        ["Workflow", b.processes, k.processes],
        ["Links", b.relation_types, k.relation_types],
        ["Plugins and filters", [b.plugins, b.scopes], [k.plugins, k.scopes]],
        ["Item visibility", b.visibility, k.visibility],
        ["Board rules", b.policy, k.policy],
        ["Starting pack", w.pack, v.pack],
        ["Item key prefix", w.key_prefix, v.key_prefix]
      ];
      if (i(b.fields) !== i(k.fields)) {
        const R = b.fields?.filter((M) => !k.fields?.some((L) => L.code === M.code)) ?? [];
        R.length === 1 && D.push("Added " + Ke(R[0]));
      }
      const C = x.filter(([, R, M]) => i(R) !== i(M)).map(([R]) => R).filter((R) => R !== "Fields" || !D.length);
      return C.length && D.push(C.join(", ") + " updated"), D.length ? D : ["Board setup updated"];
    }
    const p = K(() => {
      if (!f.value || a.schema.generation < 1) return [];
      const w = [a.schema, ...f.value];
      return w.slice(0, 3).map((v, b) => u(v, w[b + 1]));
    });
    return (w, v) => (n(), g("section", Jv, [
      c("section", Zv, [
        (n(), H(Xv, {
          key: e.board?.board_id,
          board: e.board,
          "board-apps": e.boardApps,
          detail: "",
          onDirtyChange: v[1] || (v[1] = (b) => w.$emit("dirty-change", b)),
          onSaved: v[2] || (v[2] = (b) => w.$emit("saved"))
        }, {
          default: G(() => [
            c("div", Qv, [
              c("div", _v, [
                c("label", {
                  class: "work-row-title",
                  for: s(t)
                }, "Item key prefix", 8, em),
                c("p", tm, "Shown on items, for example " + E(e.draft.key_prefix || "WORK") + "-1.", 1)
              ]),
              y(s(Se), {
                id: s(t),
                modelValue: e.draft.key_prefix,
                "onUpdate:modelValue": v[0] || (v[0] = (b) => e.draft.key_prefix = b),
                form: e.draftForm,
                disabled: e.disabled,
                "aria-label": "Item key prefix",
                required: "",
                pattern: "[A-Z][A-Z0-9]{1,9}",
                maxlength: "10"
              }, null, 8, ["id", "modelValue", "form", "disabled"])
            ])
          ]),
          _: 1
        }, 8, ["board", "board-apps"]))
      ]),
      c("section", am, [
        c("p", lm, [
          e.board?.open_count !== void 0 && e.board.item_count !== void 0 ? (n(), g("span", om, E(e.board.open_count) + " open · " + E(e.board.item_count) + " total · ", 1)) : T("", !0),
          q(" " + E(e.packTitle || "No pack installed"), 1),
          e.outdated ? (n(), g("span", im, " · Update available")) : T("", !0)
        ]),
        e.packError ? (n(), g("p", nm, E(e.packError), 1)) : T("", !0),
        e.packError ? (n(), H(s(ee), {
          key: 1,
          label: "Reload packs",
          severity: "secondary",
          outlined: "",
          size: "small",
          onClick: v[3] || (v[3] = (b) => w.$emit("retry"))
        })) : e.packTitle ? e.outdated ? (n(), H(s(ee), {
          key: 3,
          label: "Update pack",
          severity: "secondary",
          outlined: "",
          size: "small",
          disabled: !e.canUpgrade,
          title: e.upgradeReason,
          onClick: v[5] || (v[5] = (b) => w.$emit("upgrade"))
        }, null, 8, ["disabled", "title"])) : T("", !0) : (n(), H(s(ee), {
          key: 2,
          label: "Install pack",
          severity: "secondary",
          outlined: "",
          size: "small",
          disabled: !e.canInstall,
          onClick: v[4] || (v[4] = (b) => w.$emit("install"))
        }, null, 8, ["disabled"]))
      ]),
      y(Ne, {
        class: "work-disclosure",
        label: "Recent setup changes"
      }, {
        default: G(() => [
          p.value.length ? (n(), g("ul", sm, [
            (n(!0), g(Q, null, re(p.value, (b, k) => (n(), g("li", { key: k }, E(b.join(" · ")), 1))), 128))
          ])) : (n(), g("p", rm, E(m.value ? "Recent changes are unavailable." : f.value ? "No setup changes yet." : "Loading recent changes…"), 1))
        ]),
        _: 1
      }),
      o.value.length ? (n(), H(Ne, {
        key: 0,
        class: "work-settings-card work-disclosure",
        label: "Advanced · Existing board overrides"
      }, {
        default: G(() => [
          v[6] || (v[6] = c("p", { class: "work-muted" }, "Clear an override to use the Work application default.", -1)),
          c("ul", dm, [
            (n(!0), g(Q, null, re(o.value, (b) => (n(), g("li", {
              key: b,
              class: "work-row work-wrap"
            }, [
              c("span", um, E(l[b]) + " · " + E(d(b)), 1),
              y(s(ee), {
                label: "Use default for " + l[b].toLowerCase(),
                disabled: e.disabled,
                size: "small",
                text: "",
                onClick: (k) => delete e.draft.policy[b]
              }, null, 8, ["label", "disabled", "onClick"])
            ]))), 128))
          ])
        ]),
        _: 1
      })) : T("", !0)
    ]));
  }
}), Le = (e, a) => `${e} → ${a}`, io = (e, a) => {
  const t = e.fields?.find((l) => l.code === a);
  return t ? Ke(t) : "Untitled field";
}, no = {
  comments_per_item: "Comments per item",
  stage_timeout: "Default attempt timeout",
  stage_max_visits: "Default maximum visits",
  audit: "Audit trail",
  audit_days: "Audit history",
  trash_days: "Keep trashed items",
  tombstone_days: "Keep deletion records",
  interval_days: "Keep state history"
};
function so(e, a) {
  if (a === void 0) return "Application default";
  if (e === "audit") return Re(String(a));
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
function vm(e, a) {
  const t = e.policy ?? {}, l = a.policy ?? {}, o = Object.keys(no).flatMap((m) => t[m] === l[m] ? [] : [`${no[m]} · ${Le(so(m, t[m]), so(m, l[m]))}`]), d = (m) => m ? `${m.limit}${m.hard ? " (hard limit)" : ""}` : "No limit", f = /* @__PURE__ */ new Set([...Object.keys(t.wip ?? {}), ...Object.keys(l.wip ?? {})]);
  for (const m of f) {
    const r = d(t.wip?.[m]), i = d(l.wip?.[m]);
    if (r === i) continue;
    const u = (a.processes ?? []).flatMap((p) => p.states).find((p) => p.id === m) ?? (e.processes ?? []).flatMap((p) => p.states).find((p) => p.id === m);
    o.push(`${ke(u)} limit · ${Le(r, i)}`);
  }
  return o;
}
function mm(e, a, t) {
  const l = e.visibility, o = a.visibility, d = [];
  l?.field !== o?.field && d.push(Le(
    l ? io(e, l.field) : "No additional restriction",
    o ? io(a, o.field) : "No additional restriction"
  ));
  const f = l?.levels ?? [], m = o?.levels ?? [], r = new Set([...f, ...m].map((i) => i.id));
  for (const i of r) {
    const u = f.find((k) => k.id === i), p = m.find((k) => k.id === i);
    if (u && p && JSON.stringify(u.holders) === JSON.stringify(p.holders)) continue;
    const w = (k) => k.fields?.find((D) => D.code === k.visibility?.field)?.options?.find((D) => D.id === i)?.label, v = w(a) || w(e) || Re(i), b = (k) => k ? k.holders.map(t).join(", ") || "No extra access" : "No level";
    d.push(`${v} · ${Le(b(u), b(p))}`);
  }
  return l?.bypass !== o?.bypass && d.push(o?.bypass === "admin" ? "Board administrators can see every level." : "Visibility levels now apply to board administrators."), d;
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
function fm(e, a, t) {
  const { what: l, detail: o, to: d } = e, m = `${t?.name || a?.name || "Untitled workflow"} · ${da[l] ?? "Workflow changed"}`, r = l.startsWith("state.") ? a?.states.find((v) => v.id === o) : void 0, i = l.startsWith("state.") ? t?.states.find((v) => v.id === o) : void 0, u = l.startsWith("transition.") ? a?.transitions?.find((v) => v.id === o) : void 0, p = l.startsWith("transition.") ? t?.transitions?.find((v) => v.id === o) : void 0;
  let w = "";
  return l === "state.map" ? w = Le(ke(r), ke(t?.states.find((v) => v.id === d))) : l === "state.name" ? w = Le(ke(r), ke(i)) : l === "state.kind" ? w = `${ke(i)} · ${Le(Na(r?.kind), Na(i?.kind))}` : l === "state.category" && r && i ? w = `${ke(i)} · ${Le(jt(r.category), jt(i.category))}` : i || r ? w = ke(i ?? r) : l === "transition.name" && u && p ? w = Le(je(u), je(p)) : p ? w = je(p) : u ? w = je(u) : l === "initial" ? w = Le(ke(a?.states.find((v) => v.id === a.initial)), ke(t?.states.find((v) => v.id === t.initial))) : l === "name" && (w = Le(a?.name || "Untitled workflow", t?.name || "Untitled workflow")), { title: m, details: w ? [w] : [] };
}
function pm(e, a, t, l) {
  const { code: o, what: d, detail: f } = e;
  if (o === "schema" || d === "visibility.remove")
    return d === "policy" ? { title: "Board limits and defaults", details: vm(a, t) } : d.startsWith("visibility") ? { title: "Who can see items", details: mm(a, t, l) } : d === "key_prefix" ? { title: "Item key prefix", details: [Le(a.key_prefix ?? "Default", t.key_prefix ?? "Default")] } : { title: { plugins: "Board plugins changed", scopes: "Saved query filters changed", "rollup.recompute": "Calculated totals will update" }[d] ?? "Board settings changed", details: [] };
  if (o.startsWith("process ")) {
    const p = o.slice(8);
    return fm(e, a.processes?.find((w) => w.id === p), t.processes?.find((w) => w.id === p));
  }
  if (o.startsWith("item_type ")) {
    const p = o.slice(10), w = a.item_types?.find((k) => k.id === p), v = t.item_types?.find((k) => k.id === p);
    return { title: `${v?.title || w?.title || "Item type"} · ${da[d] ?? "Item type changed"}`, details: d === "title" ? [Le(w?.title || "Untitled item type", v?.title || "Untitled item type")] : [] };
  }
  if (o.startsWith("relation ")) {
    const p = o.slice(9), w = a.relation_types?.find((k) => k.id === p), v = t.relation_types?.find((k) => k.id === p), b = d === "label" ? [Le([w?.outward, w?.inward].filter(Boolean).join(" / "), [v?.outward, v?.inward].filter(Boolean).join(" / "))] : [];
    return { title: `${v?.outward || w?.outward || "Link type"} · ${da[d] ?? "Link type changed"}`, details: b };
  }
  const m = t.fields?.find((p) => p.code === o), r = a.fields?.find((p) => m?.id !== void 0 ? p.id === m.id : p.code === (d.startsWith("renamed from ") ? d.slice(13) : o)), i = m ?? r;
  if (!i) return { title: da[d] ?? "Board settings changed", details: [] };
  const u = `${Ke(i)} · ${d.startsWith("renamed from ") ? "Field key" : da[d] ?? "Field settings changed"}`;
  if (d.startsWith("options.")) {
    const p = r?.options ?? [], w = m?.options ?? [], v = p.findIndex((R) => R.id === f), b = w.findIndex((R) => R.id === f), k = p[v], D = w[b], x = D?.label || k?.label || "Untitled choice", C = k && D && k.label !== D.label ? [] : [x];
    if (k && D) {
      k.label !== D.label && C.push(Le(k.label || "Untitled choice", D.label || "Untitled choice")), k.category !== D.category && C.push(`Category · ${Le(k.category ? jt(k.category) : "None", D.category ? jt(D.category) : "None")}`);
      const R = k.order ?? v + 1, M = D.order ?? b + 1;
      R !== M && C.push(`Order · ${Le(R, M)}`), k.color !== D.color && C.push(`Color · ${Le(k.color ?? "Default", D.color ?? "Default")}`);
    }
    return { title: u, details: C };
  }
  return d === "title" && r && m ? { title: u, details: [Le(Ke(r), Ke(m))] } : { title: u, details: [] };
}
const bm = {
  key: 0,
  class: "work-settings-card work-schema-plan work-stack",
  "aria-label": "Schema review"
}, hm = { key: 0 }, gm = { class: "work-row work-wrap" }, ym = { class: "work-muted" }, km = {
  key: 0,
  class: "work-notice"
}, wm = {
  key: 1,
  class: "work-notice"
}, Vm = {
  key: 2,
  class: "work-stack work-tight",
  "aria-label": "Reviewed Flow bindings"
}, $m = { key: 3 }, xm = {
  key: 4,
  class: "work-settings-table"
}, Cm = { key: 0 }, Sm = /* @__PURE__ */ we({
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
    const a = e, t = {}, l = K(() => a.original ?? t), o = K(() => a.declaration ?? t), d = K(() => (o.value.processes ?? []).flatMap((C) => C.states.flatMap((R) => {
      const M = R.run?.flow_ref;
      return M ? [{ key: C.id + ":" + R.id, process: C.name || "Untitled process", state: ke(R), reference: M }] : [];
    }))), f = B(/* @__PURE__ */ new Map());
    Ie(d, async (C, R, M) => {
      const L = /* @__PURE__ */ new Map();
      f.value = L;
      let le = !0;
      M(() => le = !1), await Promise.all([...new Set(C.map((te) => te.reference.id))].map(async (te) => {
        try {
          const ve = (await kl.title(te))?.trim();
          le && ve && !bi(ve) && f.value.set(te, ve);
        } catch {
          le && f.value.set(te, "Flow title unavailable");
        }
      }));
    }, { immediate: !0 });
    const m = K(() => [l.value, o.value].flatMap((C) => (C.visibility?.levels ?? []).flatMap((R) => R.holders.flatMap((M) => "group" in M ? [{ kind: "group", id: M.group }] : "user" in M ? [{ kind: "user", id: M.user }] : [])))), r = go(() => a.boardId ?? "", m);
    function i(C) {
      if ("user" in C) return r.label({ kind: "user", id: C.user });
      if ("group" in C) return r.label({ kind: "group", id: C.group });
      if ("field" in C) {
        const R = o.value.fields?.find((M) => M.code === C.field) ?? l.value.fields?.find((M) => M.code === C.field);
        return R ? Ke(R) : "People from a field";
      }
      return "Service";
    }
    const u = (C) => C.map((R) => {
      const M = pm(R, l.value, o.value, i);
      if (R.what === "plugins") {
        const L = new Set(l.value.plugins?.map((te) => te.use)), le = new Set(o.value.plugins?.map((te) => te.use));
        for (const te of a.plugins ?? [])
          L.has(te.plugin) !== le.has(te.plugin) && M.details.push((le.has(te.plugin) ? "Enable " : "Turn off ") + (te.title || "an available plugin"));
      }
      return { change: R, ...M };
    }), p = K(() => u(a.plan?.changes.filter((C) => C.class !== "refused") ?? [])), w = K(() => u(a.plan?.refused ?? [])), v = K(() => {
      const C = a.plan?.migration;
      return !C || !w.value.length ? C : w.value.every((R) => R.change.what === "options.remove") ? "Add a new field with the choices you want to keep. Copy existing values into it before removing the old field." : w.value.every((R) => R.change.what === "state.remove") ? "Choose where existing items should move before removing their state." : C;
    }), b = {
      unchanged: ["No changes", "secondary"],
      cosmetic: ["Labels or settings", "secondary"],
      additive: ["New definitions", "success"],
      semantic: ["Affects existing items", "warn"],
      refused: ["Blocked", "danger"],
      initial: ["First setup", "secondary"]
    }, k = (C) => b[C]?.[0] ?? "Review needed", D = (C) => b[C]?.[1] ?? "secondary";
    function x(C) {
      const { detail: R, ...M } = C;
      return ja(C.what === "invalid" || C.what.startsWith("views.") || C.what.startsWith("automation") ? C : M);
    }
    return (C, R) => e.plan ? (n(), g("section", bm, [
      !e.plan.changes.length && !e.plan.refused.length && !e.configCount && !e.packReview ? (n(), g("p", hm, "No changes to apply.")) : (n(), g(Q, { key: 1 }, [
        c("header", gm, [
          R[0] || (R[0] = c("h3", null, "Impact on this board", -1)),
          y(s(Ye), {
            class: "kx-tag-sm",
            severity: D(e.plan.class)
          }, {
            default: G(() => [
              q(E(k(e.plan.class)), 1)
            ]),
            _: 1
          }, 8, ["severity"])
        ]),
        c("p", ym, E(s(hi)[e.plan.class] || "Review the changes below."), 1),
        v.value ? (n(), g("p", km, E(v.value), 1)) : e.follows.length ? (n(), g("p", wm, "Existing items in " + E(e.follows.join(", ")) + " will follow the updated workflow.", 1)) : T("", !0),
        d.value.length ? (n(), g("section", Vm, [
          R[1] || (R[1] = c("h3", null, "Flow bindings", -1)),
          (n(!0), g(Q, null, re(d.value, (M) => (n(), g("p", {
            key: M.key
          }, [
            q(E(M.process) + " / " + E(M.state) + " · ", 1),
            c("strong", null, E(f.value.get(M.reference.id) ?? "Published Flow") + " · v" + E(M.reference.version), 1)
          ]))), 128)),
          R[2] || (R[2] = c("p", { class: "work-muted work-small" }, "New entries use these exact published versions. Before replacing a binding, stop new entries, let existing runs and deliveries finish, pause the old launcher, save, then resume entries.", -1))
        ])) : T("", !0),
        Je(C.$slots, "default"),
        w.value.length ? (n(), g("h3", $m, "Blocked changes")) : T("", !0),
        (n(!0), g(Q, null, re(w.value, (M, L) => (n(), H(s(Ti), {
          key: L,
          severity: "error",
          role: "alert"
        }, {
          default: G(() => [
            c("strong", null, E(M.title), 1),
            (n(!0), g(Q, null, re(M.details, (le, te) => (n(), g("p", { key: te }, E(le), 1))), 128)),
            c("p", null, E(x(M.change)), 1),
            y(Ne, {
              class: "work-small",
              label: "Technical details"
            }, {
              default: G(() => [
                c("code", null, E(M.change.what), 1)
              ]),
              _: 2
            }, 1024)
          ]),
          _: 2
        }, 1024))), 128)),
        p.value.length ? (n(), g("table", xm, [
          R[3] || (R[3] = c("thead", null, [
            c("tr", null, [
              c("th", { scope: "col" }, "Change"),
              c("th", { scope: "col" }, "Impact")
            ])
          ], -1)),
          c("tbody", null, [
            (n(!0), g(Q, null, re(p.value, (M, L) => (n(), g("tr", { key: L }, [
              c("td", null, [
                c("strong", null, E(M.title), 1),
                (n(!0), g(Q, null, re(M.details, (le, te) => (n(), g("p", { key: te }, E(le), 1))), 128)),
                M.change.count ? (n(), g("p", Cm, E(M.change.count) + " " + E(M.change.count === 1 ? "item" : "items"), 1)) : T("", !0)
              ]),
              c("td", null, [
                y(s(Ye), {
                  class: "kx-tag-sm",
                  severity: D(M.change.class)
                }, {
                  default: G(() => [
                    q(E(k(M.change.class)), 1)
                  ]),
                  _: 2
                }, 1032, ["severity"])
              ])
            ]))), 128))
          ])
        ])) : T("", !0)
      ], 64))
    ])) : T("", !0);
  }
}), Tm = {
  key: 0,
  class: "work-stack",
  "aria-label": "Pack conflicts"
}, Im = { class: "work-stack work-tight work-pack-review-field" }, Dm = { class: "work-config-fields" }, Um = { class: "work-json-example" }, Em = { class: "work-json-example" }, Am = {
  key: 1,
  class: "work-stack",
  "aria-label": "Pack state maps"
}, Om = /* @__PURE__ */ we({
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
      return t.original.processes?.find((u) => u.id === i)?.name || Re(i);
    }
    function d(i) {
      const [u, ...p] = i.split("."), w = p.join(".");
      return u === "processes" ? o(w) : u === "fields" ? t.original.fields?.find((v) => v.code === w)?.title || Re(w) : u === "item_types" ? t.original.item_types?.find((v) => v.id === w)?.title || Re(w) : Re(u);
    }
    function f(i) {
      return JSON.stringify(i ?? null, null, 2);
    }
    function m(i, u) {
      (t.request.resolutions ??= {})[i] = u, l("change");
    }
    function r(i, u, p) {
      ((t.request.maps ??= {})[i] ??= {})[u] = p, l("change");
    }
    return (i, u) => (n(), g(Q, null, [
      e.plan.conflicts.length ? (n(), g("section", Tm, [
        u[2] || (u[2] = c("h3", null, "Local edits conflict", -1)),
        u[3] || (u[3] = c("p", { class: "work-muted work-small" }, "Choose which declaration to keep for each conflict, then review again.", -1)),
        (n(!0), g(Q, null, re(e.plan.conflicts, (p) => (n(), g("div", {
          key: p.path,
          class: "work-stack work-tight"
        }, [
          c("label", Im, [
            q(E(d(p.path)), 1),
            y(s(me), {
              "model-value": e.request.resolutions?.[p.path],
              "aria-label": "Resolution for " + d(p.path),
              disabled: e.disabled,
              appendTo: "self",
              placeholder: "Choose a resolution",
              optionLabel: "label",
              optionValue: "value",
              options: [{ label: "Keep local edits", value: "local" }, { label: "Use pack changes", value: "incoming" }],
              "onUpdate:modelValue": (w) => m(p.path, w)
            }, null, 8, ["model-value", "aria-label", "disabled", "onUpdate:modelValue"])
          ]),
          y(Ne, {
            class: "work-json-disclosure",
            label: "Compare declarations"
          }, {
            default: G(() => [
              c("div", Dm, [
                c("section", null, [
                  u[0] || (u[0] = c("h4", null, "Local edits", -1)),
                  c("pre", Um, E(f(p.local_value)), 1)
                ]),
                c("section", null, [
                  u[1] || (u[1] = c("h4", null, "Pack changes", -1)),
                  c("pre", Em, E(f(p.incoming)), 1)
                ])
              ])
            ]),
            _: 2
          }, 1024)
        ]))), 128))
      ])) : T("", !0),
      Object.keys(e.plan.maps).length ? (n(), g("section", Am, [
        u[4] || (u[4] = c("h3", null, "Required state maps", -1)),
        u[5] || (u[5] = c("p", { class: "work-muted work-small" }, "Review the proposed destinations for existing items. Each destination is editable.", -1)),
        (n(!0), g(Q, null, re(e.plan.maps, (p, w) => (n(), g("div", {
          key: w,
          class: "work-stack"
        }, [
          c("h4", null, E(o(w)), 1),
          (n(!0), g(Q, null, re(p, (v, b) => (n(), g("label", {
            key: b,
            class: "work-stack work-tight work-pack-review-field"
          }, [
            q("Move items from " + E(s(ke)(e.original.processes?.find((k) => k.id === w)?.states.find((k) => k.id === b))), 1),
            y(s(me), {
              "model-value": e.request.maps?.[w]?.[b],
              "aria-label": "Move items from " + s(ke)(e.original.processes?.find((k) => k.id === w)?.states.find((k) => k.id === b)),
              disabled: e.disabled,
              appendTo: "self",
              optionLabel: "label",
              optionValue: "value",
              options: e.plan.declaration.processes?.find((k) => k.id === w)?.states.map((k) => ({ label: s(ke)(k), value: k.id })) ?? [],
              "onUpdate:modelValue": (k) => r(w, b, k)
            }, null, 8, ["model-value", "aria-label", "disabled", "options", "onUpdate:modelValue"])
          ]))), 128))
        ]))), 128))
      ])) : T("", !0)
    ], 64));
  }
}), Pm = { class: "work-section-layout" }, Rm = { class: "kx-main" }, Nm = ["aria-label"], Mm = {
  key: 1,
  class: "kx-err work-alert-actions"
}, Fm = { role: "alert" }, Lm = {
  key: 2,
  class: "work-notice",
  role: "status"
}, Bm = {
  key: 3,
  class: "kx-loading",
  role: "status"
}, zm = {
  key: 4,
  class: "work-notice",
  role: "alert"
}, jm = {
  key: 5,
  class: "work-settings-body"
}, Wm = {
  key: 0,
  class: "work-notice",
  role: "alert"
}, qm = {
  key: 1,
  class: "work-notice"
}, Gm = ["id"], Km = ["disabled", "inert"], Hm = {
  key: 3,
  class: "work-ia-section"
}, Ym = {
  key: 0,
  class: "work-muted"
}, Xm = {
  key: 5,
  class: "work-ia-section"
}, Jm = { class: "work-review-layout" }, Zm = { class: "work-muted" }, Qm = ["aria-busy"], _m = {
  key: 0,
  role: "status"
}, ef = {
  key: 1,
  role: "alert",
  class: "kx-err"
}, tf = {
  key: 2,
  role: "alert"
}, af = { key: 6 }, lf = { class: "work-dialog-actions" }, of = {
  key: 2,
  class: "work-muted",
  role: "status"
}, nf = { class: "work-stack work-tight" }, sf = {
  key: 0,
  class: "work-muted"
}, rf = { class: "work-dialog-actions" }, df = /* @__PURE__ */ we({
  __name: "BoardSettings",
  props: {
    boardId: {},
    embedded: { type: Boolean },
    focusBack: { type: Boolean },
    directoryCount: {}
  },
  emits: ["dirty-change"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = Ri(), d = zt(), f = B();
    let m, r = "";
    const i = () => JSON.stringify([pt.value, I.value, z.value, [...Be.value]]), u = K(() => ({
      value: "all-boards",
      label: t.embedded ? "All boards" : "Back to board",
      icon: t.embedded ? "tabler:table" : "tabler:layout-kanban"
    })), p = B();
    Ie(p, (Z) => {
      t.focusBack && Z?.$el.querySelector(".kx-settings-rail-item")?.focus();
    }, { flush: "post", once: !0 });
    const w = [
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
    ], v = B("General");
    function b(Z) {
      if (Z === u.value.value) {
        Jo();
        return;
      }
      (Z === "General" || w.some((Y) => Y.items.some((ie) => ie.value === Z))) && (v.value = Z);
    }
    const k = {
      General: "Manage the board name, item key prefix and app.",
      "Item types": "Choose the fields, parent relationships and workflow for each kind of work.",
      Fields: "Choose what information people can capture on items.",
      Links: "Show relationships on both items, such as “Blocks” and “Blocked by.”",
      Workflow: "Select a state or transition to edit how work moves.",
      Access: "Who can use this board?",
      Plugins: "Choose which plugins this board uses."
    }, D = B(""), x = B(!1), C = B(""), R = B();
    Ie(v, () => f.value?.scrollTo({ top: 0 }));
    function M() {
      x.value = !1, C.value = "", $a.value = !1;
    }
    function L(Z) {
      !it.value || !Ho() || Be.value.size || (R.value = Z, x.value = !0, Za());
    }
    const le = B(!1), te = B(""), ve = B(/* @__PURE__ */ new Set(["General"]));
    Ie(v, (Z) => ve.value.add(Z));
    const J = B(), ue = B(), pe = B(), _ = B({}), I = B({}), U = B(), $ = B(!1), j = B(!0), X = B(!1), de = B(""), A = B(""), W = K(() => _.value.processes ?? []), F = K(() => $.value && J.value ? [
      { heading: pe.value?.title || "Board settings", items: [{ value: "General", label: "General", icon: "tabler:settings" }] },
      ...w
    ] : []), ce = B(), h = B(!1), O = ua();
    async function se(Z) {
      const Y = O();
      h.value = !1;
      try {
        const ie = await ht.stateCounts(Z);
        Y() && (ce.value = ie);
      } catch {
        Y() && (h.value = !0, ce.value = void 0);
      }
    }
    Ie(v, (Z) => {
      $.value && Z === "Workflow" && se(t.boardId);
    });
    const ne = B(""), ye = B([]), z = B(), N = B(), V = B(), P = B(), S = B(), oe = B(""), xe = B([]), Ve = K(() => [...xe.value, ...P.value?.refused ?? []]), De = B(!1), tt = B(0), Be = B(/* @__PURE__ */ new Set()), Ka = B(), El = ua(), Va = ua(), pt = K(() => el(_.value, J.value?.declaration ?? {})), it = K(() => Be.value.size > 0 || !!z.value || !!J.value && (JSON.stringify(pt.value) !== JSON.stringify(el(J.value.declaration, J.value.declaration)) || Object.keys(I.value).length > 0)), Ha = B(!1), Al = K(() => it.value || Ha.value);
    Ie(Al, (Z) => l("dirty-change", Z), { immediate: !0, flush: "sync" });
    const at = K(() => !!J.value && !!ue.value && J.value.generation !== ue.value.generation), Bo = K(() => (!ta.value.renamed.length || $a.value) && $.value && !X.value && !De.value && !Ut.value && !at.value && !Be.value.size && P.value && (P.value.changes.length > 0 || Object.keys(I.value).length > 0) && P.value.class !== "refused" && !P.value.refused.length && S.value?.matches(pt.value, J.value?.generation ?? -1, I.value)), $a = B(!1), ta = K(() => {
      const Z = J.value?.declaration, Y = [], ie = [];
      for (const Te of W.value) {
        const st = Z?.item_types?.filter((Oe) => Oe.process === Te.id) ?? [], We = Z?.processes?.find((Oe) => Oe.id === Te.id);
        for (const Oe of We?.states ?? []) {
          const Ca = Te.states.find((Et) => Et.id === Oe.id);
          if (Ca && Ca.name === Oe.name) continue;
          const _a = [...P.value?.refused ?? [], ...P.value?.changes ?? []].find((Et) => Et.code === "process " + Te.id && Et.detail === Oe.id && ["state.remove", "state.map"].includes(Et.what))?.count ?? st.reduce((Et, Qo) => Et + (ce.value?.[Qo.id]?.[Oe.id] ?? 0), 0);
          _a && (Ca ? ie.push({ process: Te, state: Oe, name: ke(Ca), count: _a }) : Y.push({ process: Te, state: Oe, count: _a }));
        }
      }
      return { removed: Y, renamed: ie };
    });
    function zo(Z, Y, ie) {
      Z.map = { ...Z.map, [Y]: ie }, Za();
    }
    const Ya = K(() => ye.value.find((Z) => Z.id === z.value?.pack)?.plugins.filter((Z) => !J.value?.plugins?.some((Y) => Y.plugin === Z.plugin && Y.active)).map((Z) => ({ use: Z.plugin })) ?? []), Ol = K(() => !!V.value && JSON.stringify(V.value) === JSON.stringify(z.value)), Pl = K(() => z.value ? $.value && !X.value && !Be.value.size && !at.value && !Ut.value && Ol.value && P.value?.class !== "refused" && !P.value?.refused.length && N.value?.conflicts.every((Z) => !!z.value?.resolutions?.[Z.path]) : Bo.value), Rl = K(() => !!P.value && (!z.value || Ol.value)), jo = K(() => ye.value.find((Z) => Z.id === J.value?.pack?.id)?.title || "Installed pack"), Nl = K(() => !ne.value && !!J.value?.outdated && !!ye.value.find((Z) => Z.id === J.value?.pack?.id)), Wo = K(() => ne.value ? "Reload packs to check available upgrades." : Nl.value ? it.value ? "Discard the current draft before upgrading." : Ut.value ? "Finish the current migration before upgrading." : X.value ? "Wait for the current request to finish." : void 0 : "Install an available version of this pack to upgrade.");
    function Ml() {
      z.value = void 0, N.value = void 0, V.value = void 0;
    }
    async function qo() {
      if (!J.value?.pack || X.value || it.value) return;
      const Z = ye.value.find((Y) => Y.id === J.value.pack.id);
      Z && (R.value = void 0, z.value = jl(Z, J.value.generation), x.value = !0, await Xa());
    }
    async function Go() {
      const Z = ye.value.find((Y) => Y.id === te.value);
      !J.value || !Z || Z.plugins.some((Y) => !Y.installed) || X.value || it.value || (R.value = void 0, z.value = jl(Z, J.value.generation), le.value = !1, x.value = !0, await Xa());
    }
    async function Xa() {
      if (!z.value || X.value || !$.value || at.value || Be.value.size) return;
      const Z = Va(), Y = Rt(z.value), ie = JSON.stringify(z.value);
      X.value = !0, C.value = "", A.value = "";
      try {
        const Te = await yi(Y, (st) => xt.packPlan(t.boardId, st));
        if (!Z() || ie !== JSON.stringify(z.value)) return;
        N.value = Te.plan, P.value = Te.plan, z.value = Te.request, V.value = Rt(z.value), oe.value = crypto.randomUUID(), x.value = !0;
      } catch (Te) {
        Z() && (V.value = void 0, C.value = ot(Te, "Could not review the pack."));
      } finally {
        X.value = !1;
      }
    }
    const Fl = K(() => N.value?.declaration ?? S.value?.declaration), Ko = K(() => {
      const Z = Fl.value;
      return !P.value || !Z ? [] : gi(P.value, Z).map((Y) => Z.processes?.find((ie) => ie.id === Y)?.name || "Untitled process");
    }), Ut = K(() => !!ue.value?.migration_error || pe.value?.status === "migrating");
    function bt() {
      xe.value = [], Va(), P.value = void 0, S.value = void 0, V.value = void 0, oe.value = "";
    }
    Ie([pt, I], bt, { deep: !0, flush: "sync" }), Ie(I, (Z) => {
      z.value && (Object.keys(Z).length ? z.value.plugin_configs = Rt(Z) : delete z.value.plugin_configs);
    }, { deep: !0, flush: "sync" });
    function aa(Z, Y) {
      Y ? Be.value.delete(Z) : Be.value.add(Z), bt();
    }
    function Ja(Z) {
      Ml(), tt.value++, J.value = Z, _.value = Rt(Z.declaration), I.value = {}, Be.value.clear(), bt();
    }
    async function nt(Z = !1) {
      const Y = El();
      try {
        const [ie, Te, st] = await Promise.all([ht.schema(t.boardId, void 0, !0).catch((Oe) => {
          if (Oe instanceof vl && Oe.details?.code === "board_schema_missing") return { generation: 0, declaration: {}, compiled: {}, key_prefix: "", as_of: 0 };
          throw Oe;
        }), ht.options(t.boardId), ht.boards()]);
        if (!Y()) return;
        if ($.value = Te.access.admin, U.value = Te, pe.value = st.find((Oe) => Oe.board_id === t.boardId), !$.value) {
          J.value = void 0, _.value = {}, bt();
          return;
        }
        de.value = "";
        const We = ki(ie);
        ue.value = We, m !== void 0 && We.generation >= m ? (m = void 0, r === i() && Ja(We), r = "") : (Z || !J.value || !it.value && We.generation !== J.value.generation) && Ja(We), at.value && bt(), await Ll(Y), Y() && v.value === "Workflow" && se(t.boardId);
      } catch (ie) {
        if (!Y()) return;
        ie instanceof vl && (ie.status === 403 || ie.kind?.toLowerCase() === "permission_denied") && ($.value = !1), bt(), de.value = ot(ie, "Could not load board settings.");
      } finally {
        Y() && (j.value = !1);
      }
    }
    async function Ll(Z = () => !0) {
      ne.value = "";
      try {
        const Y = await ht.packs();
        Z() && (ye.value = Y.filter(wi));
      } catch (Y) {
        Z() && (ne.value = ot(Y, "Could not load packs."));
      }
    }
    function Ho() {
      for (const Z of Array.from(Ka.value?.elements ?? []))
        if ((Z instanceof HTMLInputElement || Z instanceof HTMLSelectElement || Z instanceof HTMLTextAreaElement) && !(Z.form !== Ka.value || Z.closest('[style*="display: none"]:not(.p-accordioncontent)')) && !Z.reportValidity()) {
          const ie = Z.closest('.p-accordioncontent[style*="display: none"]')?.closest(".kx-disclosure")?.querySelector('.kx-disclosure-toggle[aria-expanded="false"]');
          return ie && (ie.click(), Yt(() => Z.reportValidity())), !1;
        }
      return !0;
    }
    async function Za() {
      if (z.value) return Xa();
      if (!J.value || X.value || !$.value || at.value || Be.value.size) return;
      const Z = Va(), Y = Wl(pt.value, J.value.generation, I.value);
      X.value = !0, C.value = "", A.value = "";
      try {
        const ie = (Y.declaration.processes ?? []).some((st) => J.value?.declaration.processes?.find((We) => We.id === st.id)?.states.some((We) => st.states.some((Oe) => Oe.id === We.id && Oe.name !== We.name))), [Te] = await Promise.all([
          xt.plan(t.boardId, Y),
          ie ? se(t.boardId) : void 0
        ]);
        if (ie && h.value) {
          bt(), C.value = "Could not check which items use the renamed states. Check the impact again.";
          return;
        }
        if (!Z() || Be.value.size || !Y.matches(pt.value, J.value.generation, I.value)) return;
        P.value = Te, S.value = Y, oe.value = crypto.randomUUID(), x.value = !0;
      } catch (ie) {
        Z() && (bt(), C.value = ot(ie, "Could not review changes."), xe.value = Vi(ie, pt.value));
      } finally {
        X.value = !1;
      }
    }
    async function Yo() {
      if (!Pl.value) return;
      if (z.value && V.value) {
        X.value = !0, C.value = "";
        const Y = i();
        try {
          const ie = await xt.packApply(t.boardId, Rt(V.value), oe.value);
          m = ie.generation, r = Y, await nt(), A.value = ie.status === "done" ? "Pack applied." : "Pack installation continues in the background.", M();
        } catch (ie) {
          C.value = ot(ie, "Could not apply the pack upgrade.");
        } finally {
          X.value = !1;
        }
        return;
      }
      if (!S.value) return;
      X.value = !0, C.value = "", A.value = "";
      const Z = i();
      try {
        m = (await xt.apply(t.boardId, S.value, oe.value)).generation, r = Z, await nt(), A.value = "Board changes applied.", M();
      } catch (Y) {
        C.value = ot(Y, "Could not apply the board changes.");
      } finally {
        X.value = !1;
      }
    }
    async function Xo() {
      if (!X.value) {
        X.value = !0, de.value = "";
        try {
          const Z = await xt.resume(t.boardId);
          A.value = Z.resumed ? "Migration resumes." : "Migration is already running.", await nt();
        } catch (Z) {
          de.value = ot(Z, "Could not resume migration.");
        } finally {
          X.value = !1;
        }
      }
    }
    async function xa(Z, Y) {
      if (!J.value || !$.value || X.value || De.value) return "Wait for the current change to finish.";
      if (at.value) return "Discard the stale draft before removing a definition.";
      const ie = J.value.generation, Te = JSON.stringify(pt.value), st = Rt(_.value);
      ya(st, Z, Y), De.value = !0;
      try {
        const We = await xt.plan(t.boardId, Wl(el(st, J.value.declaration), ie, I.value));
        if (!$.value || at.value || J.value.generation !== ie || JSON.stringify(pt.value) !== Te) return "The draft changes during the check. Try the removal again.";
        const Oe = $i(We, Z, Y);
        if (Oe) return Oe;
        if (We.class === "refused") return "Resolve the blocked changes in your draft before removing this definition.";
      } catch (We) {
        return ot(We, "Could not check this removal.");
      } finally {
        De.value = !1;
      }
    }
    async function Jo() {
      if (t.embedded) {
        o({ name: "boards" });
        return;
      }
      Al.value && !await Ci.confirm({ header: "Discard changes?", message: "Your unsaved board settings will be discarded.", acceptLabel: "Discard", rejectLabel: "Keep editing" }) || o({ name: "board", board: t.boardId });
    }
    function Zo() {
      m = void 0, ue.value && Ja(ue.value), A.value = "", de.value = "", M();
    }
    Ie(() => t.boardId, () => {
      Ha.value = !1, m = void 0, Ml(), ye.value = [], J.value = void 0, ue.value = void 0, pe.value = void 0, I.value = {}, Be.value.clear(), O(), ce.value = void 0, D.value = "", ve.value = /* @__PURE__ */ new Set(["General"]), b("General"), M(), $.value = !1, j.value = !0, nt(!0);
    });
    let Qa = () => {
    };
    return Ie(() => t.boardId, (Z) => {
      Qa(), Qa = xi(`component.${Z}`, () => {
        nt();
      });
    }, { immediate: !0 }), ii(nt), Vl(() => {
      Qa(), El(), Va(), O();
    }), (Z, Y) => (n(), g("section", {
      class: ut(["work-settings-shell work-ia", { "work-embedded": e.embedded }])
    }, [
      c("div", Pm, [
        y(Pi, {
          ref_key: "rail",
          ref: p,
          label: "Board settings sections",
          value: v.value,
          title: e.embedded ? "Boards" : void 0,
          count: e.directoryCount,
          groups: F.value,
          "leading-item": u.value,
          "onUpdate:value": b
        }, null, 8, ["value", "title", "count", "groups", "leading-item"]),
        c("div", Rm, [
          c("div", {
            ref_key: "pane",
            ref: f,
            class: "kx-main-scroll work-settings-content",
            role: "region",
            "aria-label": v.value
          }, [
            $.value && J.value ? (n(), H(Zc, {
              key: 0,
              title: v.value,
              description: k[v.value]
            }, ro({ _: 2 }, [
              it.value || v.value === "Plugins" ? {
                name: "actions",
                fn: G(() => [
                  v.value === "Plugins" ? (n(), H(s(ee), {
                    key: 0,
                    label: "Refresh status",
                    severity: "secondary",
                    outlined: "",
                    disabled: X.value || j.value,
                    onClick: Y[0] || (Y[0] = (ie) => nt())
                  }, {
                    icon: G(() => [
                      y(s(fe), {
                        icon: "tabler:refresh",
                        "aria-hidden": "true"
                      })
                    ]),
                    _: 1
                  }, 8, ["disabled"])) : T("", !0),
                  it.value ? (n(), H(Qc, {
                    key: 1,
                    busy: X.value,
                    "discard-disabled": De.value,
                    "review-disabled": De.value || Ut.value || at.value || !!Be.value.size,
                    onDiscard: Zo,
                    onReview: L
                  }, null, 8, ["busy", "discard-disabled", "review-disabled"])) : T("", !0)
                ]),
                key: "0"
              } : void 0
            ]), 1032, ["title", "description"])) : T("", !0),
            de.value ? (n(), g("div", Mm, [
              c("p", Fm, E(de.value), 1),
              y(s(ee), {
                label: "Retry",
                severity: "secondary",
                outlined: "",
                onClick: Y[1] || (Y[1] = (ie) => nt())
              })
            ])) : T("", !0),
            A.value ? (n(), g("p", Lm, E(A.value), 1)) : T("", !0),
            j.value ? (n(), g("p", Bm, "Loading board settings…")) : !$.value && !de.value ? (n(), g("p", zm, "Ask a board administrator to grant you access to these settings.")) : T("", !0),
            $.value && J.value ? (n(), g("div", jm, [
              at.value ? (n(), g("p", Wm, "Someone saved new settings while you were editing. Discard this draft to load their changes.")) : T("", !0),
              Ut.value ? (n(), g("div", qm, [
                c("p", null, E(ue.value?.migration_error ? "Updating existing items paused." : "Updating existing items…"), 1),
                ue.value?.migration_error ? (n(), H(Ne, {
                  key: 0,
                  label: "Technical details"
                }, {
                  default: G(() => [
                    q(E(ue.value.migration_error), 1)
                  ]),
                  _: 1
                })) : T("", !0),
                ue.value?.migration_error ? (n(), H(s(ee), {
                  key: 1,
                  label: "Resume updating items",
                  severity: "secondary",
                  disabled: X.value,
                  outlined: "",
                  onClick: Xo
                }, null, 8, ["disabled"])) : T("", !0)
              ])) : T("", !0),
              vt(y(cm, {
                draft: _.value,
                schema: ue.value ?? J.value,
                board: pe.value,
                active: v.value === "General",
                "board-apps": U.value?.board_apps,
                "draft-form": s(d),
                disabled: X.value || De.value,
                "pack-title": J.value.pack ? jo.value : void 0,
                outdated: J.value.outdated,
                "upgrade-reason": Wo.value,
                "can-upgrade": Nl.value && !it.value && !X.value && !Ut.value,
                "can-install": !it.value && !X.value && !Ut.value,
                "pack-error": ne.value,
                onUpgrade: qo,
                onInstall: Y[2] || (Y[2] = (ie) => le.value = !0),
                onRetry: Y[3] || (Y[3] = (ie) => Ll()),
                onDirtyChange: Y[4] || (Y[4] = (ie) => Ha.value = ie),
                onSaved: Y[5] || (Y[5] = (ie) => nt())
              }, null, 8, ["draft", "schema", "board", "active", "board-apps", "draft-form", "disabled", "pack-title", "outdated", "upgrade-reason", "can-upgrade", "can-install", "pack-error"]), [
                [$t, v.value === "General"]
              ]),
              c("form", {
                id: s(d),
                ref_key: "editor",
                ref: Ka,
                onSubmit: Y[14] || (Y[14] = Ee((ie) => L(), ["prevent"]))
              }, [
                (n(), g("fieldset", {
                  key: tt.value,
                  class: "work-settings-fieldset",
                  disabled: X.value || De.value,
                  inert: X.value || De.value || void 0
                }, [
                  ve.value.has("Item types") ? vt((n(), H(kr, {
                    key: 0,
                    class: "work-ia-section",
                    draft: _.value,
                    "guard-removal": xa,
                    issues: Ve.value
                  }, null, 8, ["draft", "issues"])), [
                    [$t, v.value === "Item types"]
                  ]) : T("", !0),
                  ve.value.has("Fields") ? vt((n(), H(sr, {
                    key: 1,
                    class: "work-ia-section",
                    "board-id": e.boardId,
                    "installed-types": U.value?.installed_types,
                    draft: _.value,
                    "guard-removal": xa,
                    issues: Ve.value,
                    "item-type": D.value,
                    "onUpdate:itemType": Y[6] || (Y[6] = (ie) => D.value = ie),
                    onValidity: Y[7] || (Y[7] = (ie, Te) => aa("fields:" + ie, Te))
                  }, null, 8, ["board-id", "installed-types", "draft", "issues", "item-type"])), [
                    [$t, v.value === "Fields"]
                  ]) : T("", !0),
                  ve.value.has("Links") ? vt((n(), H(Tc, {
                    key: 2,
                    class: "work-ia-section",
                    draft: _.value,
                    "guard-removal": xa
                  }, null, 8, ["draft"])), [
                    [$t, v.value === "Links"]
                  ]) : T("", !0),
                  ve.value.has("Workflow") ? vt((n(), g("section", Hm, [
                    h.value ? (n(), g("p", Ym, [
                      Y[21] || (Y[21] = q("Item counts are unavailable. ", -1)),
                      y(s(ee), {
                        label: "Reload counts",
                        text: "",
                        onClick: Y[8] || (Y[8] = (ie) => se(e.boardId))
                      })
                    ])) : T("", !0),
                    y(nc, {
                      "board-id": e.boardId,
                      draft: _.value,
                      "guard-removal": xa,
                      issues: Ve.value,
                      counts: ce.value,
                      "count-types": J.value.declaration.item_types,
                      guards: U.value?.guards,
                      onValidity: Y[9] || (Y[9] = (ie, Te) => aa("process:" + ie, Te))
                    }, null, 8, ["board-id", "draft", "issues", "counts", "count-types", "guards"])
                  ], 512)), [
                    [$t, v.value === "Workflow"]
                  ]) : T("", !0),
                  ve.value.has("Access") ? vt((n(), H(Vv, {
                    key: 4,
                    active: v.value === "Access",
                    "board-id": e.boardId,
                    draft: _.value,
                    board: pe.value,
                    busy: X.value,
                    onValidity: Y[10] || (Y[10] = (ie) => aa("visibility", ie))
                  }, null, 8, ["active", "board-id", "draft", "board", "busy"])), [
                    [$t, v.value === "Access"]
                  ]) : T("", !0),
                  ve.value.has("Plugins") ? vt((n(), g("section", Xm, [
                    y(oo, {
                      "board-id": e.boardId,
                      draft: _.value,
                      schema: ue.value ?? J.value,
                      options: U.value?.schema_options.plugins ?? [],
                      filters: U.value?.filters,
                      configs: I.value,
                      disabled: X.value,
                      onConfigured: Y[11] || (Y[11] = (ie) => {
                        bt(), nt();
                      }),
                      onRefresh: Y[12] || (Y[12] = (ie) => nt()),
                      onReview: L,
                      onValidity: Y[13] || (Y[13] = (ie, Te) => aa("plugin:" + ie, Te))
                    }, null, 8, ["board-id", "draft", "schema", "options", "filters", "configs", "disabled"])
                  ], 512)), [
                    [$t, v.value === "Plugins"]
                  ]) : T("", !0)
                ], 8, Km))
              ], 40, Gm),
              y(ml, {
                visible: x.value,
                label: "Review changes",
                busy: X.value,
                "return-focus": R.value,
                class: "work-review-sheet",
                onClose: M
              }, {
                default: G(() => [
                  c("div", Jm, [
                    c("header", null, [
                      Y[22] || (Y[22] = c("h2", null, "Review changes", -1)),
                      c("p", Zm, E(pe.value?.title), 1)
                    ]),
                    c("div", {
                      class: "work-review-content work-stack",
                      "aria-busy": X.value
                    }, [
                      X.value ? (n(), g("p", _m, E(P.value ? "Applying or checking changes…" : "Checking the impact on your board…"), 1)) : T("", !0),
                      C.value ? (n(), g("p", ef, E(C.value), 1)) : T("", !0),
                      at.value ? (n(), g("p", tf, "The board changed while you were editing. Close this review and discard the draft to load the latest settings.")) : T("", !0),
                      x.value && !z.value && (ta.value.removed.length || ta.value.renamed.length) ? (n(), H(uc, {
                        key: 3,
                        removed: ta.value.removed,
                        renamed: ta.value.renamed,
                        disabled: X.value || De.value,
                        confirmed: $a.value,
                        "onUpdate:confirmed": Y[15] || (Y[15] = (ie) => $a.value = ie),
                        onDestination: zo
                      }, null, 8, ["removed", "renamed", "disabled", "confirmed"])) : T("", !0),
                      x.value && z.value && Ya.value.length ? (n(), H(oo, {
                        key: 4,
                        "board-id": e.boardId,
                        draft: { plugins: Ya.value },
                        schema: ue.value ?? J.value,
                        options: U.value?.schema_options.plugins.filter((ie) => Ya.value.some((Te) => Te.use === ie.plugin)) ?? [],
                        configs: I.value,
                        disabled: X.value,
                        "activation-locked": "",
                        onValidity: Y[16] || (Y[16] = (ie, Te) => aa("pack-plugin:" + ie, Te))
                      }, null, 8, ["board-id", "draft", "schema", "options", "configs", "disabled"])) : T("", !0),
                      x.value ? (n(), H(Sm, {
                        key: 5,
                        "board-id": e.boardId,
                        original: J.value.declaration,
                        declaration: Fl.value,
                        plan: P.value,
                        follows: Ko.value,
                        "config-count": Object.keys(I.value).length,
                        "pack-review": !!N.value,
                        plugins: U.value?.schema_options.plugins
                      }, {
                        default: G(() => [
                          N.value && z.value ? (n(), H(Om, {
                            key: 0,
                            plan: N.value,
                            request: z.value,
                            original: J.value.declaration,
                            disabled: X.value,
                            onChange: Y[17] || (Y[17] = (ie) => {
                              V.value = void 0, oe.value = "";
                            })
                          }, null, 8, ["plan", "request", "original", "disabled"])) : T("", !0)
                        ]),
                        _: 1
                      }, 8, ["board-id", "original", "declaration", "plan", "follows", "config-count", "pack-review", "plugins"])) : T("", !0),
                      !X.value && !Rl.value && !at.value && !C.value ? (n(), g("p", af, "Check the impact again before applying.")) : T("", !0)
                    ], 8, Qm),
                    c("footer", lf, [
                      y(s(ee), {
                        label: "Keep editing",
                        severity: "secondary",
                        outlined: "",
                        disabled: X.value,
                        onClick: M
                      }, null, 8, ["disabled"]),
                      Rl.value ? (n(), H(s(ee), {
                        key: 1,
                        label: "Apply changes",
                        disabled: !Pl.value,
                        loading: X.value,
                        onClick: Yo
                      }, null, 8, ["disabled", "loading"])) : (n(), H(s(ee), {
                        key: 0,
                        label: "Check impact",
                        disabled: X.value || at.value || !!Be.value.size,
                        onClick: Za
                      }, null, 8, ["disabled"]))
                    ])
                  ])
                ]),
                _: 1
              }, 8, ["visible", "busy", "return-focus"]),
              De.value ? (n(), g("p", of, "Checking what uses this setting…")) : T("", !0)
            ])) : T("", !0)
          ], 8, Nm)
        ])
      ]),
      $.value ? (n(), H(ml, {
        key: 0,
        visible: le.value,
        label: "Install pack",
        busy: X.value,
        onClose: Y[20] || (Y[20] = (ie) => le.value = !1)
      }, {
        default: G(() => [
          c("form", {
            class: "work-dialog-box work-stack",
            onSubmit: Ee(Go, ["prevent"])
          }, [
            Y[24] || (Y[24] = c("h2", null, "Install a pack", -1)),
            Y[25] || (Y[25] = c("p", { class: "work-muted work-small" }, "Packs give an empty board a starting setup. Review checks whether this board is eligible.", -1)),
            c("label", nf, [
              Y[23] || (Y[23] = q("Pack", -1)),
              y(s(me), {
                modelValue: te.value,
                "onUpdate:modelValue": Y[18] || (Y[18] = (ie) => te.value = ie),
                "aria-label": "Pack to install",
                appendTo: "self",
                optionLabel: "title",
                optionValue: "id",
                optionDisabled: "disabled",
                options: ye.value.map((ie) => ({ ...ie, disabled: ie.plugins.some((Te) => !Te.installed) }))
              }, null, 8, ["modelValue", "options"])
            ]),
            ye.value.length ? T("", !0) : (n(), g("p", sf, "No available packs were found.")),
            c("footer", rf, [
              y(s(ee), {
                label: "Cancel",
                severity: "secondary",
                outlined: "",
                onClick: Y[19] || (Y[19] = (ie) => le.value = !1)
              }),
              y(s(ee), {
                type: "submit",
                label: "Review pack",
                disabled: !te.value || X.value || it.value
              }, null, 8, ["disabled"])
            ])
          ], 32)
        ]),
        _: 1
      }, 8, ["visible", "busy"])) : T("", !0)
    ], 2));
  }
}), uf = /* @__PURE__ */ we({
  __name: "SettingsRoot",
  setup(e) {
    const a = ni(), t = si();
    return oi(ko, (l) => {
      a.value.embedded && l.name === "boards" ? t("back-to-boards", {}) : t("navigate", { route: Ni(l) });
    }), (l, o) => (n(), H(df, {
      "board-id": s(a).boardId ?? "",
      embedded: s(a).embedded,
      "focus-back": s(a).focusBack,
      "directory-count": s(a).directoryCount,
      onDirtyChange: o[0] || (o[0] = (d) => s(t)("dirty-change", { dirty: d }))
    }, null, 8, ["board-id", "embedded", "focus-back", "directory-count"]));
  }
}), cf = ri(uf, {
  type: "object",
  properties: {
    "board-id": { type: "string", default: "", description: "Board to administer." },
    "focus-back": { type: "boolean", default: !1, description: "Focus the first rail action when opening settings from the board picker." },
    "directory-count": { type: "number", description: "Board count in the System picker." },
    embedded: { type: "boolean", default: !1, description: "Fits in a System detail pane." }
  }
});
Si(import.meta.url, cf);
//# sourceMappingURL=settings.js.map
