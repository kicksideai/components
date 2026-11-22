import { defineComponent as Ve, computed as G, openBlock as n, createBlock as Y, resolveDynamicComponent as ra, normalizeProps as Vi, guardReactiveProps as $i, createSlots as Ll, withCtx as q, createElementVNode as s, normalizeClass as ft, createElementBlock as h, Fragment as Q, renderList as se, toDisplayString as I, createCommentVNode as S, unref as r, renderSlot as Ze, inject as Bl, ref as B, useSlots as xi, watch as Ie, createVNode as k, Transition as Uo, withDirectives as pt, vShow as Tt, onMounted as Ea, onUnmounted as zl, resolveComponent as Eo, createTextVNode as z, onBeforeUnmount as Ct, useId as Kt, withKeys as qe, withModifiers as Oe, normalizeStyle as Ci, watchEffect as Ao, nextTick as Bt, useModel as Si, mergeModels as no, provide as Po } from "vue";
import { e as Pt, u as Ti, a as Ii, b as Di, c as Ui } from "./mount-DPTy0rBc.js";
import "pinia";
import { m as qa, h as so, s as ge, i as Ei, t as Ge, g as Ai, j as Qt, k as _t, r as ro, w as Et, f as rt, l as $a, n as qt, o as Xe, q as Ot, v as Oo, x as Me, y as Re, z as Ro, A as Ht, B as No, C as Da, D as tl, d as Mo, E as Aa, c as Fo, F as Pi, G as Xa, H as Dl, I as Oi, J as jt, K as Ri, _ as Ul, L as Ni, M as Mi, N as Lo, O as Fi, P as Li, u as Bi, a as zi, p as ji, Q as hl, R as Wi, S as ea, T as uo, U as qi, V as Gi, W as co, X as Ki, Y as Hi } from "./usePackDiscovery-BCCFCjF1.js";
import ce from "primevue/select";
import ee from "primevue/button";
import { Icon as ve } from "@iconify/vue";
import { api as El, host as Bo, on as Yi, define as Xi } from "@wippy-fe/proxy";
import at from "primevue/tag";
import tt from "primevue/toggleswitch";
import Gt from "primevue/checkbox";
import Se from "primevue/inputtext";
import Ua from "primevue/textarea";
import Vt from "primevue/inputnumber";
import jl from "primevue/selectbutton";
import Ji from "primevue/message";
const gl = (e, a) => e.x > a.x && e.x < a.x + a.width && e.y > a.y && e.y < a.y + a.height;
function Zi(e, a, t) {
  return e.x === a.x ? e.x > t.x && e.x < t.x + t.width && Math.max(e.y, a.y) > t.y && Math.min(e.y, a.y) < t.y + t.height : e.y > t.y && e.y < t.y + t.height && Math.max(e.x, a.x) > t.x && Math.min(e.x, a.x) < t.x + t.width;
}
function Mt(e, a, t) {
  const l = [.../* @__PURE__ */ new Set([e.x, a.x, ...t.flatMap((C) => [C.x, C.x + C.width])])].sort((C, U) => C - U), o = [.../* @__PURE__ */ new Set([e.y, a.y, ...t.flatMap((C) => [C.y, C.y + C.height])])].sort((C, U) => C - U);
  l.unshift(l[0] - 24), l.push(l.at(-1) + 24), o.unshift(o[0] - 24), o.push(o.at(-1) + 24);
  const d = l.length, p = o.indexOf(a.y) * d + l.indexOf(a.x), f = o.indexOf(e.y) * d + l.indexOf(e.x), c = (C) => ({ x: l[C % d], y: o[Math.floor(C / d)] }), i = /* @__PURE__ */ new Map(), u = /* @__PURE__ */ new Map(), m = [];
  function V(C) {
    m.push(C);
    let U = m.length - 1;
    for (; U; ) {
      const W = U - 1 >> 1;
      if (m[W].priority <= C.priority) break;
      m[U] = m[W], U = W;
    }
    m[U] = C;
  }
  function v() {
    const C = m[0], U = m.pop();
    if (m.length) {
      let W = 0;
      for (; W * 2 + 1 < m.length; ) {
        let L = W * 2 + 1;
        if (L + 1 < m.length && m[L + 1].priority < m[L].priority && L++, U.priority <= m[L].priority) break;
        m[W] = m[L], W = L;
      }
      m[W] = U;
    }
    return C;
  }
  const b = (C) => Math.abs(C.x - a.x) + Math.abs(C.y - a.y);
  for (const C of [0, 1]) {
    const U = f * 2 + C;
    i.set(U, 0), V({ key: U, cost: 0, priority: b(e) });
  }
  const y = /* @__PURE__ */ new Map(), T = /* @__PURE__ */ new Map();
  for (; m.length; ) {
    const C = v(), U = Math.floor(C.key / 2), W = C.key % 2;
    if (C.cost !== i.get(C.key)) continue;
    if (U === p) {
      const Z = [];
      let re = C.key;
      for (; re !== void 0; )
        Z.push(c(Math.floor(re / 2))), re = u.get(re);
      return zo(Z.reverse());
    }
    const L = c(U), _ = U % d, j = Math.floor(U / d);
    for (const [Z, re] of [[_ > 0 ? U - 1 : -1, 0], [_ + 1 < d ? U + 1 : -1, 0], [j > 0 ? U - d : -1, 1], [j + 1 < o.length ? U + d : -1, 1]]) {
      if (Z < 0) continue;
      const de = c(Z);
      if (y.has(Z) || y.set(Z, !t.some((A) => gl(de, A))), !y.get(Z)) continue;
      const ye = `${Math.min(U, Z)}:${Math.max(U, Z)}`;
      if (T.has(ye) || T.set(ye, !t.some((A) => Zi(L, de, A))), !T.get(ye)) continue;
      const fe = C.cost + Math.abs(L.x - de.x) + Math.abs(L.y - de.y) + (W === re ? 0 : 18), le = Z * 2 + re;
      fe >= (i.get(le) ?? 1 / 0) || (i.set(le, fe), u.set(le, C.key), V({ key: le, cost: fe, priority: fe + b(de) }));
    }
  }
  throw new Error("Process map has no collision-free route between its ports: " + JSON.stringify({ start: e, end: a, startInside: t.filter((C) => gl(e, C)), endInside: t.filter((C) => gl(a, C)) }));
}
function zo(e) {
  const a = [];
  for (const t of e) {
    const l = a.at(-1), o = a.at(-2);
    l && l.x === t.x && l.y === t.y || (o && l && (o.x === l.x && l.x === t.x || o.y === l.y && l.y === t.y) && a.pop(), a.push(t));
  }
  return a;
}
const ba = (e) => Array.from(e).reduce((a, t) => a + (/[^\x20-\x7e]/u.test(t) ? 16 : /[MW@%]/.test(t) ? 11 : /[ilI.,:;!| ']/.test(t) ? 4 : 7.5), 0);
function ia(e, a = 28) {
  const t = [];
  let l = "";
  for (const o of e.split(/\s+/u))
    for (let d = 0; d < o.length; d += a) {
      const p = o.slice(d, d + a);
      l && l.length + p.length + 1 > a && (t.push(l), l = ""), l = l ? l + " " + p : p;
    }
  return [...t, l].filter(Boolean);
}
function La(e) {
  if (e = zo(e), !e.length) return "";
  let a = `M ${e[0].x} ${e[0].y}`;
  for (let l = 1; l < e.length - 1; l++) {
    const o = e[l - 1], d = e[l], p = e[l + 1], f = Math.hypot(d.x - o.x, d.y - o.y), c = Math.hypot(p.x - d.x, p.y - d.y), i = Math.min(8, f / 3, c / 3);
    i && (a += ` L ${d.x + (o.x - d.x) * i / f} ${d.y + (o.y - d.y) * i / f} Q ${d.x} ${d.y} ${d.x + (p.x - d.x) * i / c} ${d.y + (p.y - d.y) * i / c}`);
  }
  const t = e.at(-1);
  return a + ` L ${t.x} ${t.y}`;
}
function Qi(e, a = {}, t = { width: 1400, height: 480 }) {
  const l = t.direction ?? (t.width < 750 || qa(e).length > 8 ? "TB" : "LR"), o = t.direction === "LR" && qa(e).length > 6, d = new so.graphlib.Graph({ multigraph: !0 });
  d.setGraph({ rankdir: l, ranker: "network-simplex", acyclicer: "greedy", nodesep: 32, edgesep: 32, ranksep: 24, marginx: 32, marginy: 32 }), d.setDefaultEdgeLabel(() => ({}));
  const p = qa(e), f = new Map(p.map((g, O) => [g.id, O])), c = e.states.map((g) => {
    const O = (e.transitions ?? []).filter(($) => $.from === "any" && $.to === g.id), ne = ia(ge(g), o ? 13 : 28), ie = ia(Ei(g, e), o ? 13 : 28), we = O.flatMap(($) => ia(Ge($) + " works from any state")), Te = a.policy?.wip?.[g.id]?.limit, J = Te === void 0 ? 0 : ba(" · limit " + Te), w = Math.max(o ? 122 : 168, ...ne.map(($) => ba($) + 58), ...ie.map(($, oe) => ba($) + 32 + (oe === ie.length - 1 ? J : 0)), ...we.map(($) => ba($) + 32)), D = Math.max(80, 42 + ne.length * 18 + ie.length * 16 + we.length * 18);
    return d.setNode(g.id, { width: w + (l === "LR" ? 36 : 0), height: D + (l === "TB" ? 36 : 0) }), { state: g, x: 0, y: 0, width: w, height: D, title: ne, caption: ie, badges: O, row: f.has(g.id) ? 0 : 1 };
  }), i = new Set(c.map((g) => g.state.id)), u = (e.transitions ?? []).flatMap((g) => g.from === "any" ? [] : g.from.filter((O) => i.has(O) && i.has(g.to)).map((O) => {
    const ne = `${g.id}-${O}`, ie = ia(Ge(g), o ? 12 : 28), we = Math.max(o ? 60 : 72, ...ie.map((J) => ba(J) + 24)), Te = Math.max(24, ie.length * 16 + 10);
    return { transition: g, from: O, key: ne, lines: ie, width: we, height: Te };
  })), m = /* @__PURE__ */ new Set(), V = /* @__PURE__ */ new Set(), v = new Set(u.filter((g) => g.from === g.transition.to || g.transition.to === e.initial || ["completed", "canceled"].includes(c.find((O) => O.state.id === g.from).state.category)).map((g) => g.key));
  function b(g) {
    if (!V.has(g)) {
      m.add(g);
      for (const O of u.filter((ne) => ne.from === g))
        v.has(O.key) || (m.has(O.transition.to) ? v.add(O.key) : b(O.transition.to));
      m.delete(g), V.add(g);
    }
  }
  b(e.initial);
  for (const g of c) b(g.state.id);
  for (const g of u) if (!v.has(g.key)) {
    const O = f.get(g.from), ne = f.get(g.transition.to);
    d.setEdge(g.from, g.transition.to, { width: g.width, height: g.height, labelpos: "c", weight: O !== void 0 && ne === O + 1 ? 100 : 1 }, g.key);
  }
  for (const g of e.transitions ?? []) if (g.from === "any" && i.has(e.initial) && i.has(g.to) && !f.has(g.to)) {
    const O = e.states.find((ne) => ne.id === g.to);
    d.setEdge(e.initial, g.to, { minlen: ["completed", "canceled"].includes(O.category) ? Math.max(1, p.length - 1) : 1 }, `any:${g.id}`);
  }
  const y = e.states.flatMap((g) => (g.regions ?? []).filter((O) => i.has(O.initial)).map((O, ne) => {
    const ie = `lane:${g.id}:${ne}`;
    return d.setEdge(g.id, O.initial, {}, ie), { state: g, region: O, key: ie };
  }));
  if (!c.length) return { nodes: c, edges: [], parallels: [], main: p, direction: l, width: 320, height: 160 };
  so.layout(d);
  for (const g of c) Object.assign(g, { x: d.node(g.state.id).x, y: d.node(g.state.id).y });
  const T = l === "TB", C = u.filter((g) => !v.has(g.key)).map((g) => d.edge({ v: g.from, w: g.transition.to, name: g.key })), U = [...c, ...C], W = Math.max(...U.map((g) => g.x + g.width / 2)), L = Math.max(...U.map((g) => g.y + g.height / 2)), _ = (g) => c.find((O) => O.state.id === g), j = u.filter((g) => v.has(g.key)).sort((g, O) => {
    const ne = T ? "y" : "x";
    return Math.abs(_(g.from)[ne] - _(g.transition.to)[ne]) - Math.abs(_(O.from)[ne] - _(O.transition.to)[ne]);
  }), Z = /* @__PURE__ */ new Map(), re = Math.max(0, ...j.map((g) => g.width));
  let de = L + 32;
  for (const [g, O] of j.entries()) {
    const ne = _(O.from), ie = _(O.transition.to), we = T ? W + 16 + re + 28 + g * 18 : de + O.height / 2, Te = T ? W + 16 + re / 2 : (ne.x + ie.x) / 2;
    let J = T ? ne.y + ne.height / 2 + 18 : we;
    if (T) for (const w of [...Z.values()].sort((D, $) => D.y - $.y))
      J + O.height / 2 + 10 > w.y - w.height / 2 - 10 && J - O.height / 2 - 10 < w.y + w.height / 2 + 10 && (J = w.y + w.height / 2 + 24 + O.height / 2);
    Z.set(O.key, { x: Te, y: J, corridor: we, height: O.height }), de = we + O.height / 2 + 24;
  }
  const ye = u.map((g) => ({ ...g, ...Z.get(g.key) ?? d.edge({ v: g.from, w: g.transition.to, name: g.key }) })), fe = (g, O) => ({ x: g.x - g.width / 2 - O, y: g.y - g.height / 2 - O, width: g.width + O * 2, height: g.height + O * 2 }), le = [...c.map((g) => fe(g, 12)), ...ye.map((g) => fe(g, 10))], A = (g, O) => ({
    start: T ? { x: g.x, y: g.y + g.height / 2 } : { x: g.x + g.width / 2, y: g.y },
    end: T ? { x: O.x, y: O.y - O.height / 2 } : { x: O.x - O.width / 2, y: O.y }
  }), F = (g, O) => T ? { x: g.x, y: g.y + O } : { x: g.x + O, y: g.y }, R = ye.map((g) => {
    const O = c.find((De) => De.state.id === g.from), ne = c.find((De) => De.state.id === g.transition.to), { start: ie, end: we } = A(O, ne), Te = v.has(g.key), J = F(ie, 18), w = F(we, -18), D = (Te || !T ? g.width : g.height) / 2 + 10, $ = Te ? { x: g.x + (T ? -D : D), y: g.y } : F(g, -D), oe = Te ? { x: g.x + (T ? D : -D), y: g.y } : F(g, D);
    let me;
    if (Te) {
      const { corridor: De } = Z.get(g.key), We = T ? { x: De, y: g.y } : { x: J.x, y: De }, lt = T ? { x: De, y: w.y } : { x: w.x, y: De };
      me = T ? [
        [ie, ...Mt(J, $, le)],
        [oe, We, lt, ...Mt(lt, w, le), we]
      ] : [
        [ie, ...Mt(J, We, le), $],
        [oe, ...Mt(lt, w, le), we]
      ];
    } else me = [
      [ie, ...Mt(J, $, le)],
      [...Mt(oe, w, le), we]
    ];
    const $e = Te ? "return" : f.get(g.transition.to) === (f.get(g.from) ?? -2) + 1 ? "main" : "forward";
    return { ...g, points: me.flat(), segments: me, path: me.map(La).join(" "), type: $e, targetOffset: 0 };
  }), ue = y.map((g) => {
    const O = c.find((J) => J.state.id === g.state.id), ne = c.find((J) => J.state.id === g.region.initial), { start: ie, end: we } = A(O, ne), Te = [ie, ...Mt(F(ie, 18), F(we, -18), le), we];
    return { state: g.state, key: g.key, points: Te, path: La(Te) };
  }), H = [...c.flatMap((g) => [{ x: g.x - g.width / 2, y: g.y - g.height / 2 }, { x: g.x + g.width / 2, y: g.y + g.height / 2 }]), ...R.flatMap((g) => [...g.points, { x: g.x - g.width / 2, y: g.y - g.height / 2 }, { x: g.x + g.width / 2, y: g.y + g.height / 2 }]), ...ue.flatMap((g) => g.points)], X = 32 - Math.min(...H.map((g) => g.x)), x = 32 - Math.min(...H.map((g) => g.y)), P = Math.max(...H.map((g) => g.x)) + X + 32, E = Math.max(...H.map((g) => g.y)) + x + 32, N = (g) => ({ x: g.x + X, y: g.y + x });
  for (const g of c) Object.assign(g, N(g));
  for (const g of R)
    Object.assign(g, N(g)), g.segments = g.segments.map((O) => O.map(N)), g.points = g.segments.flat(), g.path = g.segments.map(La).join(" ");
  for (const g of ue)
    g.points = g.points.map(N), g.path = La(g.points);
  return { nodes: c, edges: R, parallels: ue, main: p, direction: l, width: P, height: E };
}
const _i = ["aria-label"], en = {
  key: 0,
  class: "kx-settings-rail-group"
}, tn = ["aria-current", "onClick"], an = { class: "kx-settings-rail-label" }, ln = /* @__PURE__ */ Ve({
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
    const a = e, t = G(() => a.leadingItem ? [{ items: [a.leadingItem] }, ...a.groups] : a.groups);
    function l(o) {
      const d = [...o.currentTarget.querySelectorAll(".kx-settings-rail-item")], p = d.indexOf(o.target);
      if (p < 0) return;
      let f;
      switch (o.key) {
        case "ArrowDown":
        case "ArrowRight":
          f = (p + 1) % d.length;
          break;
        case "ArrowUp":
        case "ArrowLeft":
          f = (p + d.length - 1) % d.length;
          break;
        case "Home":
          f = 0;
          break;
        case "End":
          f = d.length - 1;
          break;
        default:
          return;
      }
      o.preventDefault(), d[f]?.focus();
    }
    return (o, d) => (n(), Y(ra(e.title ? Ai : "div"), Vi($i(e.title ? { title: e.title, count: e.count, settings: !0 } : { class: "kx-settings-rail-standalone" })), Ll({
      default: q(() => [
        s("nav", {
          class: ft(["kx-settings-rail", { "kx-settings-rail-framed": e.title }]),
          "aria-label": e.label,
          onKeydown: l
        }, [
          (n(!0), h(Q, null, se(t.value, (p, f) => (n(), h("div", {
            key: p.items[0]?.value ?? f,
            class: ft(["kx-settings-rail-section", { "kx-settings-rail-leading": e.leadingItem && f === 0 }])
          }, [
            p.heading ? (n(), h("div", en, I(p.heading), 1)) : S("", !0),
            (n(!0), h(Q, null, se(p.items, (c) => (n(), h("button", {
              key: c.value,
              type: "button",
              class: "kx-settings-rail-item",
              "aria-current": c.value === e.value ? "true" : void 0,
              onClick: (i) => o.$emit("update:value", c.value)
            }, [
              c.icon ? (n(), Y(r(ve), {
                key: 0,
                class: "kx-settings-rail-icon",
                icon: c.icon,
                "aria-hidden": "true"
              }, null, 8, ["icon"])) : S("", !0),
              s("span", an, I(c.label), 1)
            ], 8, tn))), 128))
          ], 2))), 128))
        ], 42, _i)
      ]),
      _: 2
    }, [
      e.title && o.$slots.actions ? {
        name: "actions",
        fn: q(() => [
          Ze(o.$slots, "actions")
        ]),
        key: "0"
      } : void 0
    ]), 1040));
  }
}), jo = Symbol("work-navigation");
function on() {
  return Bl(jo, () => {
  });
}
function nn(e) {
  if (e.name === "boards") return "";
  const a = encodeURIComponent(e.board);
  return e.name === "settings" ? `${a}/settings` : a;
}
const ta = (e) => `/api/v1/work/boards/${encodeURIComponent(e)}`, vo = (e) => ({ declaration: e.declaration, expected_generation: e.expected_generation, plugin_configs: e.plugin_configs }), It = {
  packPlan: (e, a) => Qt(`${ta(e)}/pack_plan`, a, "Pack plan"),
  packApply: (e, a, t) => Qt(`${ta(e)}/pack_apply`, { ...a, key: t }, "Apply pack"),
  plan: (e, a) => Qt(`${ta(e)}/plan_schema`, vo(a), "Schema plan"),
  apply: (e, a, t) => Qt(`${ta(e)}/apply_schema`, { ...vo(a), key: t }, "Apply schema"),
  resume: (e) => Qt(`${ta(e)}/resume_migration`, {}, "Resume migration"),
  configure: (e, a, t) => Qt(`${ta(e)}/configure_plugin`, { plugin: a, ...t === void 0 ? {} : { config: t } }, "Configure plugin")
}, Wl = /* @__PURE__ */ Ve({
  __name: "ContentAction",
  props: {
    as: { default: "button" },
    disabled: { type: Boolean },
    role: { default: "button" }
  },
  emits: ["activate"],
  setup(e, { emit: a }) {
    const t = e, l = a;
    function o(p) {
      if (t.disabled || p.defaultPrevented) return;
      const f = p.target;
      if (f instanceof Element && f !== p.currentTarget) {
        const c = f.closest('[data-work-action], button, a, input, textarea, [role="combobox"], [role="checkbox"], [role="switch"], details');
        if (c && c !== p.currentTarget) return;
      }
      l("activate", p);
    }
    function d(p) {
      p.target !== p.currentTarget || !["Enter", " "].includes(p.key) || (p.preventDefault(), t.disabled || l("activate", p));
    }
    return (p, f) => (n(), Y(ra(e.as), {
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
      default: q(() => [
        Ze(p.$slots, "default")
      ]),
      _: 3
    }, 40, ["type", "role", "tabindex", "disabled", "aria-disabled"]));
  }
}), ql = Symbol("section row"), sn = { class: "work-definition" }, rn = {
  key: 0,
  class: "work-definition-handle"
}, dn = { class: "work-definition-lead" }, un = ["title"], cn = {
  key: 0,
  class: "work-definition-description"
}, vn = { class: "work-definition-details" }, fn = { class: "work-definition-code" }, mn = ["title"], pn = { class: "work-definition-kind" }, bn = {
  key: 0,
  class: "work-definition-kind-label"
}, hn = { class: "work-definition-kind-value" }, gn = { class: "work-definition-flags" }, yn = { class: "work-definition-usage" }, kn = { class: "work-definition-actions" }, wn = ["inert"], al = /* @__PURE__ */ Ve({
  __name: "DefinitionRow",
  props: {
    title: {},
    code: {},
    kind: {},
    kindLabel: {},
    description: {},
    initialOpen: { type: Boolean },
    routeSection: {},
    routeId: {}
  },
  setup(e) {
    const a = e, t = B(!!a.initialOpen), l = xi(), o = Bl(ql, void 0);
    function d(f) {
      return !!a.routeSection && !!a.routeId && f === a.routeSection + "/" + a.routeId;
    }
    Ie(() => o?.selected.value, (f, c) => {
      d(f) ? t.value = !0 : d(c) && (t.value = !1);
    }, { immediate: !0 });
    function p() {
      t.value = !t.value, a.routeSection && a.routeId && o?.choose(a.routeSection, a.routeId, t.value);
    }
    return (f, c) => (n(), h("article", sn, [
      s("header", {
        class: ft(["work-definition-head", { "work-definition-has-handle": r(l).handle }])
      }, [
        r(l).handle ? (n(), h("div", rn, [
          Ze(f.$slots, "handle")
        ])) : S("", !0),
        s("div", dn, [
          k(Wl, {
            class: "work-definition-toggle",
            "aria-expanded": t.value,
            onActivate: p
          }, {
            default: q(() => [
              k(r(ve), {
                icon: "tabler:chevron-right",
                "aria-hidden": "true"
              }),
              s("span", {
                class: "work-row-title",
                title: e.title
              }, I(e.title), 9, un)
            ]),
            _: 1
          }, 8, ["aria-expanded"]),
          e.description ? (n(), h("p", cn, I(e.description), 1)) : S("", !0)
        ]),
        s("div", vn, [
          s("span", fn, [
            e.code ? (n(), h("code", {
              key: 0,
              class: "work-mono",
              title: e.code
            }, I(e.code), 9, mn)) : S("", !0)
          ]),
          s("span", pn, [
            e.kind ? (n(), Y(r(at), {
              key: 0,
              severity: "secondary"
            }, {
              default: q(() => [
                e.kindLabel ? (n(), h("span", bn, I(e.kindLabel) + ":", 1)) : S("", !0),
                s("span", hn, I(e.kind), 1)
              ]),
              _: 1
            })) : S("", !0),
            Ze(f.$slots, "status")
          ]),
          s("span", gn, [
            Ze(f.$slots, "flags")
          ]),
          s("div", yn, [
            Ze(f.$slots, "usage")
          ])
        ]),
        s("div", kn, [
          Ze(f.$slots, "actions")
        ])
      ], 2),
      k(Uo, {
        name: "work-panel",
        persisted: ""
      }, {
        default: q(() => [
          pt(s("div", {
            inert: !t.value,
            class: "work-definition-body work-stack"
          }, [
            Ze(f.$slots, "default")
          ], 8, wn), [
            [Tt, t.value]
          ])
        ]),
        _: 3
      })
    ]));
  }
}), Vn = { class: "work-definition-scroll" }, $n = {
  key: 0,
  class: "work-definition-columns",
  "aria-hidden": "true"
}, xn = { key: 0 }, Cn = { class: "work-definition-usage" }, ll = /* @__PURE__ */ Ve({
  __name: "DefinitionList",
  props: {
    count: {},
    columns: {}
  },
  setup(e) {
    return (a, t) => (n(), h("div", Vn, [
      s("div", {
        class: ft(["work-field-builder", "work-definitions-" + e.columns])
      }, [
        e.count > 3 && e.columns !== "plugins" ? (n(), h("div", $n, [
          t[0] || (t[0] = s("span", null, null, -1)),
          t[1] || (t[1] = s("span", null, "Name", -1)),
          t[2] || (t[2] = s("span", { class: "work-definition-code" }, "Identifier", -1)),
          s("span", null, I(e.columns === "types" ? "Workflow" : "Kind"), 1),
          e.columns === "fields" ? (n(), h("span", xn, "Details")) : S("", !0),
          s("span", Cn, I(e.columns === "fields" ? "Used by" : "Details"), 1),
          t[3] || (t[3] = s("span", null, null, -1))
        ])) : S("", !0),
        Ze(a.$slots, "default")
      ], 2)
    ]));
  }
}), Sn = [
  { code: "key", form: "text", index: "key" },
  { code: "type", form: "text", index: "key" },
  { code: "state", form: "text", index: "key" },
  { code: "category", form: "text", index: "key" },
  { code: "rank", form: "text", index: "key" },
  { code: "parent", form: "text", index: "key" },
  { code: "created_at", form: "time", index: "key" },
  { code: "updated_at", form: "time", index: "key" }
];
function Tn(e) {
  const a = e.compiled.processes?.flatMap((t) => t.states.map((l) => ({ id: l.id, label: l.name }))) ?? [];
  return [...Sn.filter((t) => t.code !== "rank").map((t) => t.code === "state" ? { ...t, type: "option", options: a } : t.code === "category" ? { ...t, type: "option", options: ["triage", "backlog", "unstarted", "started", "completed", "canceled"].map((l) => ({ id: l })) } : t), ...(e.compiled.fields ?? []).filter((t) => t.index && t.index !== "none")];
}
function In(e) {
  if (e?.cardinality && e.cardinality !== "one") return ["has", "in", "nin", "is_null", ...e.type === "principal" ? ["member_of"] : []];
  const a = ["eq", "neq", "in", "nin", "is_null", ...e?.type === "principal" ? ["member_of"] : []];
  return e && (["int", "number", "dec", "time", "quantity"].includes(e.form ?? "") || e.index === "number") && a.push("lt", "lte", "gt", "gte", "between"), e?.form === "text" && e.type !== "option" && a.push("contains", "starts_with"), a;
}
const Dn = { class: "work-field-control" }, Un = ["id"], En = {
  key: 1,
  class: "work-stack work-tight"
}, An = { class: "work-chips" }, Pn = {
  key: 5,
  class: "work-row"
}, On = ["inert"], Rn = ["value"], Nn = {
  key: 1,
  class: "work-muted"
}, Mn = ["inert"], Fn = ["value"], Ln = {
  key: 1,
  class: "work-muted"
}, Bn = {
  key: 11,
  class: "work-stack work-tight"
}, zn = {
  class: "work-stack work-tight",
  "aria-label": "Matching items"
}, jn = { class: "work-mono" }, Wn = {
  key: 15,
  class: "work-error work-small",
  role: "alert"
}, Wo = /* @__PURE__ */ Ve({
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
    const t = e, l = a, o = G(() => t.inputId ?? `field-${t.field.code}`), d = G(() => !!t.field.cardinality && t.field.cardinality !== "one"), p = G(() => Array.isArray(t.modelValue) ? t.modelValue : []), f = G(() => t.modelValue == null ? "" : typeof t.modelValue == "object" ? _t(t.modelValue) : String(t.modelValue)), c = G(() => {
      const g = t.modelValue;
      return g && typeof g == "object" && "ref" in g && Array.isArray(g.ref) ? String(g.ref[1] ?? "") : "";
    }), i = G(() => t.disabled || ro(t.field)), u = B(!1), m = B(!1), V = B(!1), v = B(""), b = B(""), y = B([]), T = $a(), C = B([]);
    let U = 0, W;
    const L = /* @__PURE__ */ new Set();
    Ie(p, (g) => {
      C.value = W ?? g.map((O, ne) => C.value[ne] ?? U++), W = void 0;
    }, { immediate: !0 });
    function _(g) {
      l("update:modelValue", g);
    }
    function j(g, O) {
      const ne = [...p.value];
      ne[g] = O, _(ne);
    }
    function Z(g, O) {
      O ? L.delete(g) : L.add(g), l("validity", !L.size);
    }
    function re(g) {
      L.delete(C.value[g]), l("validity", !L.size), W = C.value.filter((O, ne) => ne !== g), _(p.value.filter((O, ne) => ne !== g));
    }
    function de() {
      W = [...C.value, U++], _([...p.value, t.field.form === "bool" ? !1 : t.field.form === "record" ? {} : ""]);
    }
    function ye(g) {
      const O = g.detail, ne = O?.principal_id ?? O?.id;
      _(ne ? { kind: O.type ?? "user", id: ne } : void 0);
    }
    function fe(g) {
      const O = g.detail;
      _(O?.thread_id ? { ref: ["component", O.thread_id] } : void 0);
    }
    const le = B("");
    let A = "";
    Ie(() => t.modelValue, (g) => {
      const O = JSON.stringify(g ?? {}, null, 2);
      O !== A && (A = O, le.value = O, v.value = "", l("validity", !0));
    }, { immediate: !0 });
    function F(g) {
      le.value = g;
      try {
        const O = JSON.parse(g);
        if (!O || typeof O != "object" || Array.isArray(O)) throw new Error("Enter a JSON object.");
        if (t.field.type === "rich_text" && !("type" in O && typeof O.type == "string")) throw new Error("The document needs a type.");
        A = JSON.stringify(O, null, 2), v.value = "", l("validity", !0), _(O);
      } catch (O) {
        v.value = O instanceof Error ? O.message : "Invalid JSON.", l("validity", !1);
      }
    }
    function R(g) {
      if (!g) {
        l("validity", !0), _(void 0);
        return;
      }
      const O = Number.isFinite(Number(g)) && (t.field.form !== "int" || Number.isSafeInteger(Number(g)));
      l("validity", O), O && _(t.field.form === "int" ? Number(g) : g);
    }
    const ue = G(() => t.field.config?.format === "date");
    function H(g) {
      _(g ? ue.value ? g : new Date(g).toISOString() : void 0);
    }
    const X = G(() => {
      if (typeof t.modelValue != "string") return "";
      if (ue.value) return t.modelValue.slice(0, 10);
      const g = new Date(t.modelValue);
      return Number.isNaN(g.getTime()) ? "" : new Date(g.getTime() - g.getTimezoneOffset() * 6e4).toISOString().slice(0, 16);
    });
    function x(g) {
      _(g.detail?.ref);
    }
    function P(g) {
      _(g.detail?.value);
    }
    let E;
    Ie(b, () => {
      const g = T();
      if (clearTimeout(E), !b.value.trim()) {
        y.value = [];
        return;
      }
      E = setTimeout(async () => {
        try {
          const O = b.value.trim(), ne = /^[A-Z][A-Z0-9]{1,9}-[0-9]+$/.test(O) ? [(await Et.item(t.boardId, { key: O })).item] : (await Et.query(t.boardId, { where: { field: "title", op: "contains", value: O }, limit: 8 })).items;
          g() && (y.value = ne, v.value = "");
        } catch (O) {
          g() && (v.value = rt(O, "Could not search items."));
        }
      }, 200);
    });
    function N(g) {
      _({ board: t.boardId, item: g.id }), b.value = "", y.value = [];
    }
    Ea(async () => {
      t.field.type === "principal" ? u.value = await Pt("wc-principal-picker") : t.field.config?.target === "component" && (u.value = await Pt("wc-component-picker"));
    });
    for (const [g, O] of [[() => t.editorTag, V], [() => t.linkTag, m]])
      Ie(g, async (ne, ie, we) => {
        let Te = !0;
        if (we(() => {
          Te = !1;
        }), O.value = !1, ne) {
          const J = await Pt(ne);
          Te && (O.value = J);
        }
      }, { immediate: !0 });
    return zl(() => {
      clearTimeout(E), T();
    }), (g, O) => {
      const ne = Eo("FieldControl", !0);
      return n(), h("div", Dn, [
        r(ro)(e.field) ? (n(), h("output", {
          key: 0,
          id: o.value,
          class: "work-read-value"
        }, I(r(_t)(e.modelValue, e.field)), 9, Un)) : d.value ? (n(), h("div", En, [
          s("div", An, [
            (n(!0), h(Q, null, se(p.value, (ie, we) => (n(), Y(r(at), {
              key: C.value[we],
              class: "kx-tag-sm",
              severity: "secondary"
            }, {
              default: q(() => [
                z(I(r(_t)(ie, e.field)) + " ", 1),
                k(r(ee), {
                  type: "button",
                  class: "work-icon-button",
                  disabled: i.value,
                  "aria-label": "Remove value " + (we + 1),
                  onClick: (Te) => re(we),
                  severity: "secondary",
                  text: "",
                  size: "small"
                }, {
                  default: q(() => [
                    k(r(ve), {
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
          (n(!0), h(Q, null, se(p.value, (ie, we) => (n(), h("div", {
            key: C.value[we],
            class: "work-stack work-tight"
          }, [
            k(ne, {
              "board-id": e.boardId,
              field: { ...e.field, cardinality: "one" },
              "model-value": ie,
              "input-id": o.value + "-" + C.value[we],
              disabled: i.value,
              "editor-tag": e.editorTag,
              "link-tag": e.linkTag,
              "onUpdate:modelValue": (Te) => j(we, Te),
              onValidity: (Te) => Z(C.value[we], Te)
            }, null, 8, ["board-id", "field", "model-value", "input-id", "disabled", "editor-tag", "link-tag", "onUpdate:modelValue", "onValidity"])
          ]))), 128)),
          k(r(ee), {
            label: "Add value",
            severity: "secondary",
            size: "small",
            disabled: i.value,
            onClick: de,
            outlined: ""
          }, {
            icon: q(() => [
              k(r(ve), {
                icon: "tabler:plus",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled"])
        ])) : e.editorTag && V.value ? (n(), Y(ra(e.editorTag), {
          key: 2,
          "board-id": e.boardId,
          value: JSON.stringify(e.modelValue ?? null),
          config: JSON.stringify(e.field.config ?? {}),
          readonly: i.value || void 0,
          onChange: P
        }, null, 40, ["board-id", "value", "config", "readonly"])) : e.linkTag && m.value ? (n(), Y(ra(e.linkTag), {
          key: 3,
          "board-id": e.boardId,
          kind: e.field.config?.target ?? e.field.type,
          value: JSON.stringify(e.modelValue ?? null),
          readonly: i.value || void 0,
          onChange: x
        }, null, 40, ["board-id", "kind", "value", "readonly"])) : e.field.type === "option" ? (n(), Y(r(ce), {
          key: 4,
          placeholder: "Not set",
          inputId: o.value,
          "model-value": e.modelValue ?? "",
          disabled: i.value,
          "onUpdate:modelValue": O[0] || (O[0] = (ie) => _(ie || void 0)),
          appendTo: "self",
          optionLabel: "label",
          optionValue: "value",
          optionDisabled: "disabled",
          options: [{ label: "Not set", value: "", disabled: !1 }, ...(e.field.options ?? []).map((ie) => ({ label: ie.label ?? ie.id, value: ie.id, disabled: !1 }))]
        }, null, 8, ["inputId", "model-value", "disabled", "options"])) : e.field.form === "bool" ? (n(), h("label", Pn, [
          k(r(Gt), {
            inputId: o.value,
            "model-value": e.modelValue === !0,
            disabled: i.value,
            "onUpdate:modelValue": O[1] || (O[1] = (ie) => _(ie)),
            binary: ""
          }, null, 8, ["inputId", "model-value", "disabled"]),
          z(I(e.modelValue === !0 ? "Yes" : e.modelValue === !1 ? "No" : "Not set"), 1)
        ])) : e.field.form === "int" ? (n(), Y(r(Vt), {
          key: 6,
          inputId: o.value,
          "model-value": f.value === "" ? null : Number(f.value),
          disabled: i.value,
          "onUpdate:modelValue": O[2] || (O[2] = (ie) => R(ie == null ? "" : String(ie))),
          useGrouping: !1
        }, null, 8, ["inputId", "model-value", "disabled"])) : e.field.form === "dec" ? (n(), Y(r(Se), {
          key: 7,
          id: o.value,
          inputmode: "decimal",
          "model-value": f.value,
          disabled: i.value,
          "onUpdate:modelValue": O[3] || (O[3] = (ie) => R(ie ?? ""))
        }, null, 8, ["id", "model-value", "disabled"])) : e.field.form === "time" ? (n(), Y(r(Se), {
          key: 8,
          id: o.value,
          type: ue.value ? "date" : "datetime-local",
          value: X.value,
          disabled: i.value,
          onInput: O[4] || (O[4] = (ie) => H(ie.target.value))
        }, null, 8, ["id", "type", "value", "disabled"])) : e.field.type === "principal" ? (n(), h("div", {
          key: 9,
          inert: i.value || void 0,
          class: "work-stack work-tight"
        }, [
          u.value ? (n(), h("wc-principal-picker", {
            key: 0,
            value: JSON.stringify(e.modelValue ?? {}),
            kinds: "user,group",
            onConfigChanged: ye
          }, null, 40, Rn)) : (n(), h("span", Nn, I(r(_t)(e.modelValue, e.field)) + " · Person picker is unavailable.", 1))
        ], 8, On)) : e.field.config?.target === "component" ? (n(), h("div", {
          key: 10,
          inert: i.value || void 0
        }, [
          u.value ? (n(), h("wc-component-picker", {
            key: 0,
            value: JSON.stringify({ thread_id: c.value }),
            onChange: fe
          }, null, 40, Fn)) : (n(), h("span", Ln, "Component picker is unavailable."))
        ], 8, Mn)) : e.field.type === "item" ? (n(), h("div", Bn, [
          k(r(at), {
            class: "kx-tag-sm",
            severity: "secondary"
          }, {
            default: q(() => [
              z(I(r(_t)(e.modelValue, e.field)), 1)
            ]),
            _: 1
          }),
          k(r(Se), {
            id: o.value,
            modelValue: b.value,
            "onUpdate:modelValue": O[5] || (O[5] = (ie) => b.value = ie),
            disabled: i.value,
            placeholder: "Search a title or enter an item key",
            "aria-label": "Search items"
          }, null, 8, ["id", "modelValue", "disabled"]),
          s("div", zn, [
            (n(!0), h(Q, null, se(y.value, (ie) => (n(), Y(Wl, {
              key: ie.id,
              class: "work-match-item",
              disabled: i.value,
              onActivate: (we) => N(ie)
            }, {
              default: q(() => [
                s("code", jn, I(ie.key), 1),
                s("span", null, I(r(_t)(ie.values.title)), 1)
              ]),
              _: 2
            }, 1032, ["disabled", "onActivate"]))), 128))
          ]),
          e.modelValue ? (n(), Y(r(ee), {
            key: 0,
            label: "Clear reference",
            severity: "secondary",
            size: "small",
            disabled: i.value,
            onClick: O[6] || (O[6] = (ie) => _(void 0)),
            outlined: ""
          }, {
            icon: q(() => [
              k(r(ve), {
                icon: "tabler:list-check",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled"])) : S("", !0)
        ])) : e.field.form === "record" || e.field.type === "rich_text" || e.field.form === "quantity" || e.field.form === "ref" ? (n(), Y(r(Ua), {
          key: 12,
          id: o.value,
          "model-value": le.value,
          rows: "3",
          disabled: i.value,
          "aria-invalid": !!v.value,
          "onUpdate:modelValue": O[7] || (O[7] = (ie) => F(ie ?? ""))
        }, null, 8, ["id", "model-value", "disabled", "aria-invalid"])) : e.field.code === "description" ? (n(), Y(r(Ua), {
          key: 13,
          id: o.value,
          "model-value": f.value,
          rows: "4",
          disabled: i.value,
          "onUpdate:modelValue": O[8] || (O[8] = (ie) => _(ie))
        }, null, 8, ["id", "model-value", "disabled"])) : (n(), Y(r(Se), {
          key: 14,
          id: o.value,
          "model-value": f.value,
          disabled: i.value,
          "onUpdate:modelValue": O[9] || (O[9] = (ie) => _(ie))
        }, null, 8, ["id", "model-value", "disabled"])),
        v.value ? (n(), h("span", Wn, I(v.value), 1)) : S("", !0)
      ]);
    };
  }
}), qn = { class: "work-stack work-tight work-operand-control" }, Gn = { class: "work-row work-small" }, Kn = {
  key: 1,
  class: "work-muted work-small"
}, Hn = {
  key: 2,
  class: "work-stack work-tight"
}, Yn = { class: "work-small" }, Xn = {
  key: 0,
  class: "work-error work-small",
  role: "alert"
}, ha = /* @__PURE__ */ Ve({
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
    const t = e, l = a, o = G(() => "$actor" in qt(t.modelValue) ? "actor" : "$now" in qt(t.modelValue) ? "now" : "literal"), d = B(""), p = B("");
    Ie(() => t.modelValue, (i) => {
      d.value = JSON.stringify(i ?? []), p.value = "";
    }, { immediate: !0 });
    function f(i) {
      l("update:modelValue", i === "actor" ? { $actor: "id" } : i === "now" ? { $now: "P0D" } : void 0), l("validity", !0);
    }
    function c(i) {
      d.value = i;
      try {
        const u = JSON.parse(i);
        if (!Array.isArray(u)) throw new Error("Enter a JSON list.");
        p.value = "", l("validity", !0), l("update:modelValue", u);
      } catch (u) {
        p.value = u instanceof Error ? u.message : "Invalid values.", l("validity", !1);
      }
    }
    return (i, u) => (n(), h("div", qn, [
      s("label", Gn, [
        z(I(e.label), 1),
        k(r(ce), {
          "aria-label": e.label + " operand",
          "model-value": o.value,
          disabled: e.disabled,
          "onUpdate:modelValue": u[0] || (u[0] = (m) => f(m)),
          appendTo: "self",
          optionLabel: "label",
          optionValue: "value",
          optionDisabled: "disabled",
          options: [{ label: "Value", value: "literal", disabled: !1 }, { label: "Current actor ($actor)", value: "actor", disabled: !1 }, { label: "Current time ($now)", value: "now", disabled: !1 }]
        }, null, 8, ["aria-label", "model-value", "disabled"])
      ]),
      o.value === "now" ? (n(), Y(r(Se), {
        key: 0,
        "aria-label": e.label + " time offset",
        value: r(qt)(e.modelValue).$now,
        disabled: e.disabled,
        placeholder: "-P7D",
        onInput: u[1] || (u[1] = (m) => l("update:modelValue", { $now: m.target.value }))
      }, null, 8, ["aria-label", "value", "disabled"])) : o.value === "actor" ? (n(), h("span", Kn, "The signed-in actor’s id")) : e.multiple ? (n(), h("div", Hn, [
        s("label", Yn, [
          u[5] || (u[5] = z("Values as JSON (operands may appear in the list)", -1)),
          k(r(Ua), {
            class: "work-mono",
            "aria-label": e.label + " values",
            value: d.value,
            disabled: e.disabled,
            rows: "2",
            onInput: u[2] || (u[2] = (m) => c(m.target.value))
          }, null, 8, ["aria-label", "value", "disabled"])
        ]),
        p.value ? (n(), h("p", Xn, I(p.value), 1)) : S("", !0)
      ])) : (n(), Y(Wo, {
        key: 3,
        "board-id": e.boardId,
        field: { ...e.field, cardinality: "one" },
        "model-value": e.modelValue,
        disabled: e.disabled,
        "input-id": e.label.replace(/[^a-z0-9]/gi, "-"),
        "onUpdate:modelValue": u[3] || (u[3] = (m) => l("update:modelValue", m)),
        onValidity: u[4] || (u[4] = (m) => l("validity", m))
      }, null, 8, ["board-id", "field", "model-value", "disabled", "input-id"]))
    ]));
  }
}), Jn = ["disabled"], Zn = { class: "work-small work-mono" }, Qn = { class: "work-row work-small" }, _n = { class: "work-row work-wrap" }, es = { key: 3 }, ts = { class: "work-row work-wrap" }, as = { class: "work-row" }, ls = { class: "work-row" }, os = { class: "work-row" }, is = {
  key: 3,
  class: "work-row work-wrap"
}, ns = { class: "work-row work-wrap" }, ss = /* @__PURE__ */ Ve({
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
    const t = e, l = a, o = G(() => t.path ?? "where"), d = G(() => t.depth ?? 1), p = G(() => ["and", "or", "not", "history", "match", "rel", "children"].find((le) => le in t.modelValue) ?? "field"), f = G(() => Tn(t.schema)), c = G(() => f.value.find((le) => le.code === t.modelValue.field) ?? { code: "value", form: "text" }), i = G(() => qt(t.modelValue.history)), u = G(() => f.value.find((le) => le.code === i.value.field) ?? { code: "history", form: "text" }), m = G(() => Array.isArray(t.modelValue[p.value]) ? t.modelValue[p.value] : []), V = {
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
    }, b = () => ({ field: "category", op: "eq", value: "unstarted" }), y = B(/* @__PURE__ */ new Set());
    function T(le, A) {
      A ? y.value.delete(le) : y.value.add(le), l("validity", y.value.size === 0);
    }
    Ie(p, () => {
      y.value.clear(), l("validity", !0);
    });
    function C(le) {
      const A = /* @__PURE__ */ new Set();
      for (const F of y.value) {
        const R = Number(F);
        !Number.isNaN(R) && R !== le && A.add(String(R > le ? R - 1 : R));
      }
      y.value = A, l("validity", A.size === 0), W({ [p.value]: m.value.filter((F, R) => R !== le) });
    }
    function U(le) {
      l("update:modelValue", le);
    }
    function W(le) {
      U({ ...t.modelValue, ...le });
    }
    function L(le) {
      U(le === "field" ? b() : le === "and" || le === "or" ? { [le]: [b()] } : le === "not" ? { not: b() } : le === "history" ? { history: { field: "state", changed: !0 } } : le === "match" ? { match: "" } : le === "children" ? { children: !0, q: "some", where: b() } : { rel: t.schema.compiled.relation_types?.[0]?.id ?? "", dir: "outward", q: "some", where: b() });
    }
    function _(le, A) {
      W({ [p.value]: m.value.map((F, R) => R === le ? A : F) });
    }
    function j(le, A) {
      const F = { ...i.value };
      A === void 0 ? (delete F[le], T(le, !0)) : F[le] = A, W({ history: F });
    }
    function Z(le) {
      y.value.clear(), l("validity", !0);
      const A = { ...i.value };
      delete A.was, delete A.changed, delete A.from, delete A.to, A[le] = le === "changed" ? !0 : "", W({ history: A });
    }
    const re = { code: "actor", form: "text" }, de = { code: "at", form: "time" }, ye = G(() => Array.isArray(i.value.during) ? i.value.during : []);
    function fe(le, A) {
      const F = [...ye.value];
      F[le] = A, j("during", F);
    }
    return (le, A) => {
      const F = Eo("FilterNode", !0);
      return n(), h("fieldset", {
        class: "work-filter-node",
        disabled: e.disabled
      }, [
        s("legend", Zn, I(o.value), 1),
        s("label", Qn, [
          A[21] || (A[21] = z("Condition", -1)),
          k(r(ce), {
            "aria-label": o.value + " condition",
            "model-value": p.value,
            "onUpdate:modelValue": A[0] || (A[0] = (R) => L(R)),
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            optionDisabled: "disabled",
            options: Object.entries(v).map(([R, ue]) => ({ label: ue, value: R, disabled: d.value >= 6 && ["and", "or", "not", "rel", "children"].includes(R) }))
          }, null, 8, ["aria-label", "model-value", "options"])
        ]),
        p.value === "and" || p.value === "or" ? (n(), h(Q, { key: 0 }, [
          (n(!0), h(Q, null, se(m.value, (R, ue) => (n(), h("div", {
            key: ue,
            class: "work-stack work-tight"
          }, [
            k(F, {
              "board-id": e.boardId,
              schema: e.schema,
              "model-value": R,
              path: o.value + "." + p.value + "[" + ue + "]",
              depth: d.value + 1,
              "onUpdate:modelValue": (H) => _(ue, H),
              onValidity: (H) => T(String(ue), H)
            }, null, 8, ["board-id", "schema", "model-value", "path", "depth", "onUpdate:modelValue", "onValidity"]),
            k(r(ee), {
              label: "Remove condition",
              size: "small",
              severity: "secondary",
              onClick: (H) => C(ue),
              outlined: ""
            }, {
              icon: q(() => [
                k(r(ve), {
                  icon: "tabler:trash",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["onClick"])
          ]))), 128)),
          k(r(ee), {
            label: "Add condition",
            size: "small",
            severity: "secondary",
            disabled: d.value >= 6,
            onClick: A[1] || (A[1] = (R) => W({ [p.value]: [...m.value, b()] })),
            outlined: ""
          }, {
            icon: q(() => [
              k(r(ve), {
                icon: "tabler:plus",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled"])
        ], 64)) : p.value === "not" ? (n(), Y(F, {
          key: 1,
          "board-id": e.boardId,
          schema: e.schema,
          "model-value": r(qt)(e.modelValue.not),
          path: o.value + ".not",
          depth: d.value + 1,
          "onUpdate:modelValue": A[2] || (A[2] = (R) => W({ not: R })),
          onValidity: A[3] || (A[3] = (R) => T("nested", R))
        }, null, 8, ["board-id", "schema", "model-value", "path", "depth"])) : p.value === "field" ? (n(), h(Q, { key: 2 }, [
          s("div", _n, [
            s("label", null, [
              A[22] || (A[22] = z("Field", -1)),
              k(r(ce), {
                "aria-label": o.value + " field",
                "model-value": e.modelValue.field,
                "onUpdate:modelValue": A[4] || (A[4] = (R) => W({ field: R, op: "eq", value: void 0 })),
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                optionDisabled: "disabled",
                options: [...(f.value ?? []).map((R) => ({ label: r(Xe)(R), value: R.code, disabled: !1 }))]
              }, null, 8, ["aria-label", "model-value", "options"])
            ]),
            s("label", null, [
              A[23] || (A[23] = z("Comparison", -1)),
              k(r(ce), {
                "aria-label": o.value + " operator",
                "model-value": e.modelValue.op,
                "onUpdate:modelValue": A[5] || (A[5] = (R) => W({ op: R, value: R === "is_null" ? !0 : void 0 })),
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                options: r(In)(c.value).map((R) => ({ value: R, label: V[R] }))
              }, null, 8, ["aria-label", "model-value", "options"])
            ])
          ]),
          k(ha, {
            "board-id": e.boardId,
            field: e.modelValue.op === "is_null" ? { code: "null", form: "bool" } : c.value,
            "model-value": e.modelValue.value,
            multiple: ["in", "nin", "between"].includes(String(e.modelValue.op)),
            label: o.value + " value",
            "onUpdate:modelValue": A[6] || (A[6] = (R) => W({ value: R })),
            onValidity: A[7] || (A[7] = (R) => T("value", R))
          }, null, 8, ["board-id", "field", "model-value", "multiple", "label"])
        ], 64)) : p.value === "match" ? (n(), h("label", es, [
          A[24] || (A[24] = z("Search", -1)),
          k(r(Se), {
            "aria-label": o.value + " search",
            value: e.modelValue.match,
            onInput: A[8] || (A[8] = (R) => W({ match: R.target.value }))
          }, null, 8, ["aria-label", "value"])
        ])) : p.value === "history" ? (n(), h(Q, { key: 4 }, [
          s("div", ts, [
            s("label", null, [
              A[25] || (A[25] = z("Field", -1)),
              k(r(ce), {
                "aria-label": o.value + " history field",
                "model-value": i.value.field,
                "onUpdate:modelValue": A[9] || (A[9] = (R) => j("field", R)),
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                optionDisabled: "disabled",
                options: [...(f.value ?? []).map((R) => ({ label: r(Xe)(R), value: R.code, disabled: !1 }))]
              }, null, 8, ["aria-label", "model-value", "options"])
            ]),
            s("label", null, [
              A[26] || (A[26] = z("History", -1)),
              k(r(ce), {
                "aria-label": o.value + " history mode",
                "model-value": i.value.changed ? "changed" : "was",
                "onUpdate:modelValue": A[10] || (A[10] = (R) => Z(R)),
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                optionDisabled: "disabled",
                options: [{ label: "Changed", value: "changed", disabled: !1 }, { label: "Was", value: "was", disabled: !1 }]
              }, null, 8, ["aria-label", "model-value"])
            ])
          ]),
          i.value.changed ? (n(), h(Q, { key: 0 }, se(["from", "to"], (R) => s("div", { key: R }, [
            s("label", as, [
              k(r(Gt), {
                "model-value": R in i.value,
                "aria-label": "Constrain " + R,
                "onUpdate:modelValue": (ue) => j(R, ue ? "" : void 0),
                binary: ""
              }, null, 8, ["model-value", "aria-label", "onUpdate:modelValue"]),
              z(I(R), 1)
            ]),
            R in i.value ? (n(), Y(ha, {
              key: 0,
              "board-id": e.boardId,
              field: u.value,
              "model-value": i.value[R],
              label: o.value + " history " + R,
              "onUpdate:modelValue": (ue) => j(R, ue),
              onValidity: (ue) => T(R, ue)
            }, null, 8, ["board-id", "field", "model-value", "label", "onUpdate:modelValue", "onValidity"])) : S("", !0)
          ])), 64)) : (n(), Y(ha, {
            key: 1,
            "board-id": e.boardId,
            field: u.value,
            "model-value": i.value.was,
            label: o.value + " history was",
            "onUpdate:modelValue": A[11] || (A[11] = (R) => j("was", R)),
            onValidity: A[12] || (A[12] = (R) => T("was", R))
          }, null, 8, ["board-id", "field", "model-value", "label"])),
          s("label", ls, [
            k(r(Gt), {
              "model-value": "by" in i.value,
              "aria-label": "Constrain actor",
              "onUpdate:modelValue": A[13] || (A[13] = (R) => j("by", R ? { $actor: "id" } : void 0)),
              binary: ""
            }, null, 8, ["model-value"]),
            A[27] || (A[27] = z("By actor", -1))
          ]),
          "by" in i.value ? (n(), Y(ha, {
            key: 2,
            "board-id": e.boardId,
            field: re,
            "model-value": i.value.by,
            label: o.value + " history by",
            "onUpdate:modelValue": A[14] || (A[14] = (R) => j("by", R))
          }, null, 8, ["board-id", "model-value", "label"])) : S("", !0),
          s("label", os, [
            k(r(Gt), {
              "model-value": "during" in i.value,
              "aria-label": "Constrain time window",
              "onUpdate:modelValue": A[15] || (A[15] = (R) => j("during", R ? [{ $now: "-P30D" }, { $now: "P0D" }] : void 0)),
              binary: ""
            }, null, 8, ["model-value"]),
            A[28] || (A[28] = z("During", -1))
          ]),
          "during" in i.value ? (n(), h("div", is, [
            (n(), h(Q, null, se(["start", "end"], (R, ue) => k(ha, {
              key: R,
              "board-id": e.boardId,
              field: de,
              "model-value": ye.value[ue],
              label: o.value + " during " + R,
              "onUpdate:modelValue": (H) => fe(ue, H)
            }, null, 8, ["board-id", "model-value", "label", "onUpdate:modelValue"])), 64))
          ])) : S("", !0)
        ], 64)) : (n(), h(Q, { key: 5 }, [
          s("div", ns, [
            p.value === "rel" ? (n(), h(Q, { key: 0 }, [
              s("label", null, [
                A[29] || (A[29] = z("Relation", -1)),
                k(r(ce), {
                  "model-value": e.modelValue.rel,
                  "onUpdate:modelValue": A[16] || (A[16] = (R) => W({ rel: R })),
                  appendTo: "self",
                  optionLabel: "label",
                  optionValue: "value",
                  optionDisabled: "disabled",
                  options: [...(e.schema.compiled.relation_types ?? []).map((R) => ({ label: R.outward ?? R.id, value: R.id, disabled: !1 }))]
                }, null, 8, ["model-value", "options"])
              ]),
              s("label", null, [
                A[30] || (A[30] = z("Direction", -1)),
                k(r(ce), {
                  "model-value": e.modelValue.dir,
                  "onUpdate:modelValue": A[17] || (A[17] = (R) => W({ dir: R })),
                  appendTo: "self",
                  optionLabel: "label",
                  optionValue: "value",
                  optionDisabled: "disabled",
                  options: [{ label: "Outward", value: "outward", disabled: !1 }, { label: "Inward", value: "inward", disabled: !1 }]
                }, null, 8, ["model-value"])
              ])
            ], 64)) : S("", !0),
            s("label", null, [
              A[31] || (A[31] = z("Quantifier", -1)),
              k(r(ce), {
                "model-value": e.modelValue.q,
                "onUpdate:modelValue": A[18] || (A[18] = (R) => W({ q: R })),
                appendTo: "self",
                options: ["some", "every", "none"]
              }, null, 8, ["model-value"])
            ])
          ]),
          k(F, {
            "board-id": e.boardId,
            schema: e.schema,
            "model-value": r(qt)(e.modelValue.where),
            path: o.value + ".where",
            depth: d.value + 1,
            "onUpdate:modelValue": A[19] || (A[19] = (R) => W({ where: R })),
            onValidity: A[20] || (A[20] = (R) => T("nested", R))
          }, null, 8, ["board-id", "schema", "model-value", "path", "depth"])
        ], 64))
      ], 8, Jn);
    };
  }
}), rs = { class: "work-stack work-tight" }, ds = { class: "work-row work-small" }, Gl = /* @__PURE__ */ Ve({
  __name: "ConditionEditor",
  props: {
    modelValue: {},
    draft: {},
    boardId: {},
    label: {}
  },
  emits: ["update:modelValue", "validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = G(() => ({ declaration: t.draft, compiled: t.draft, generation: 0, as_of: 0, key_prefix: "" })), d = /* @__PURE__ */ new Set();
    function p(c, i) {
      i ? d.delete(c) : d.add(c), l("validity", !d.size);
    }
    function f(c) {
      l("update:modelValue", c ? { field: t.draft.fields?.[0]?.code ?? "state", op: "eq" } : void 0), c || (d.clear(), l("validity", !0));
    }
    return Ct(() => l("validity", !0)), (c, i) => (n(), h("section", rs, [
      s("label", ds, [
        k(r(tt), {
          "model-value": e.modelValue != null,
          "aria-label": e.label,
          "onUpdate:modelValue": f
        }, null, 8, ["model-value", "aria-label"]),
        z(I(e.label), 1)
      ]),
      e.modelValue != null ? (n(), Y(ss, {
        key: 0,
        schema: o.value,
        "board-id": e.boardId ?? "",
        "model-value": r(qt)(e.modelValue),
        path: e.label,
        "onUpdate:modelValue": i[0] || (i[0] = (u) => l("update:modelValue", u)),
        onValidity: i[1] || (i[1] = (u) => p("structured", u))
      }, null, 8, ["schema", "board-id", "model-value", "path"])) : S("", !0),
      e.modelValue != null ? (n(), Y(Ot, {
        key: 1,
        label: e.label + " predicate",
        "model-value": e.modelValue,
        hint: "Use any predicate accepted by Work, including installed or deeply nested forms.",
        "onUpdate:modelValue": i[2] || (i[2] = (u) => l("update:modelValue", u)),
        onValidity: i[3] || (i[3] = (u) => p("raw", u))
      }, null, 8, ["label", "model-value"])) : S("", !0)
    ]));
  }
}), us = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, cs = ["aria-label"], vs = { class: "work-field-label" }, fs = {
  key: 0,
  class: "work-chips"
}, ms = ["kinds"], ps = {
  key: 2,
  class: "work-muted work-small"
}, Kl = /* @__PURE__ */ Ve({
  __name: "PrincipalsPicker",
  props: {
    modelValue: {},
    label: {},
    kinds: {},
    boardId: {}
  },
  emits: ["update:modelValue"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = B(!1), d = B(0), p = G(() => t.modelValue ?? []), { principalLabel: f, rememberPrincipal: c, nameError: i } = Oo(() => t.boardId ?? "", () => p.value);
    Ea(async () => {
      o.value = await Pt("wc-principal-picker");
    });
    function u(m) {
      const V = m.detail, v = V?.principal_id ?? V?.id;
      if (!v) return;
      const b = { kind: V.type ?? "user", id: v };
      V.label && c(b, V.label), p.value.some((y) => y.id === v && y.kind === b.kind) || l("update:modelValue", [...p.value, b]), d.value++;
    }
    return (m, V) => (n(), h(Q, null, [
      r(i) ? (n(), h("p", us, I(r(i)), 1)) : S("", !0),
      s("section", {
        class: "work-stack work-tight work-principals-picker",
        "aria-label": e.label
      }, [
        s("h4", vs, I(e.label), 1),
        p.value.length ? (n(), h("div", fs, [
          (n(!0), h(Q, null, se(p.value, (v, b) => (n(), Y(r(at), {
            key: v.kind + v.id,
            severity: "secondary",
            class: "kx-tag-sm"
          }, {
            default: q(() => [
              z(I(r(f)(v)), 1),
              k(r(ee), {
                text: "",
                severity: "secondary",
                size: "small",
                "aria-label": "Remove " + r(f)(v),
                onClick: (y) => l("update:modelValue", p.value.filter((T, C) => C !== b))
              }, {
                default: q(() => [
                  k(r(ve), { icon: "tabler:x" })
                ]),
                _: 1
              }, 8, ["aria-label", "onClick"])
            ]),
            _: 2
          }, 1024))), 128))
        ])) : S("", !0),
        o.value ? (n(), h("wc-principal-picker", {
          key: d.value,
          kinds: e.kinds ?? "user,group",
          onConfigChanged: u
        }, null, 40, ms)) : (n(), h("p", ps, "People and group picker is unavailable."))
      ], 8, cs)
    ], 64));
  }
}), bs = { class: "work-stack work-tight" }, qo = /* @__PURE__ */ Ve({
  __name: "HoldersPicker",
  props: {
    modelValue: {},
    label: {},
    boardId: {}
  },
  emits: ["update:modelValue", "validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = G(() => (t.modelValue ?? []).flatMap((p) => "user" in p ? [{ kind: "user", id: p.user }] : "group" in p ? [{ kind: "group", id: p.group }] : []));
    function d(p) {
      const f = [...(t.modelValue ?? []).filter((c) => "field" in c || "service" in c), ...p.map((c) => c.kind === "group" ? { group: c.id } : { user: c.id })];
      l("update:modelValue", f.length ? f : void 0);
    }
    return (p, f) => (n(), h("div", bs, [
      k(Kl, {
        "board-id": e.boardId,
        label: e.label,
        "model-value": o.value,
        "onUpdate:modelValue": d
      }, null, 8, ["board-id", "label", "model-value"]),
      k(Ot, {
        label: e.label + " rules",
        "model-value": e.modelValue,
        shape: "array",
        example: [{ group: "selected-group" }],
        "onUpdate:modelValue": f[0] || (f[0] = (c) => l("update:modelValue", c)),
        onValidity: f[1] || (f[1] = (c) => l("validity", c))
      }, null, 8, ["label", "model-value"])
    ]));
  }
}), hs = ["disabled"], gs = { class: "work-chips" }, ys = {
  key: 1,
  class: "work-muted work-small"
}, mt = /* @__PURE__ */ Ve({
  __name: "ChipPicker",
  props: {
    label: {},
    options: {},
    modelValue: {},
    disabled: { type: Boolean }
  },
  emits: ["update:modelValue"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = B(""), d = G(() => t.options.map((c) => typeof c == "string" ? { value: c } : c)), p = G(() => d.value.filter((c) => (c.label ?? Me(c.value)).toLocaleLowerCase().includes(o.value.toLocaleLowerCase())));
    function f(c) {
      if (t.disabled) return;
      const i = t.modelValue ?? [];
      l("update:modelValue", i.includes(c) ? i.filter((u) => u !== c) : [...i, c]);
    }
    return (c, i) => (n(), h("fieldset", {
      class: "work-chip-picker",
      disabled: e.disabled
    }, [
      s("legend", null, I(e.label), 1),
      e.options.length > 10 ? (n(), Y(r(Se), {
        key: 0,
        modelValue: o.value,
        "onUpdate:modelValue": i[0] || (i[0] = (u) => o.value = u),
        type: "search",
        "aria-label": "Find " + e.label.toLowerCase(),
        placeholder: "Find a choice…"
      }, null, 8, ["modelValue", "aria-label"])) : S("", !0),
      s("div", gs, [
        k(r(jl), {
          "model-value": e.modelValue ?? [],
          options: p.value.map((u) => ({ value: u.value, label: u.label ?? r(Me)(u.value) })),
          optionLabel: "label",
          optionValue: "value",
          multiple: "",
          disabled: e.disabled,
          "aria-label": e.label,
          "onUpdate:modelValue": i[1] || (i[1] = (u) => l("update:modelValue", u ?? []))
        }, null, 8, ["model-value", "options", "disabled", "aria-label"]),
        (n(!0), h(Q, null, se(e.modelValue?.filter((u) => !d.value.some((m) => m.value === u)) ?? [], (u) => (n(), Y(r(ee), {
          severity: "secondary",
          text: "",
          size: "small",
          key: u,
          type: "button",
          class: "work-choice work-unavailable",
          "aria-label": "Remove unavailable " + u,
          onClick: (m) => f(u)
        }, {
          default: q(() => [
            z(I(r(Me)(u)) + " · unavailable ×", 1)
          ]),
          _: 2
        }, 1032, ["aria-label", "onClick"]))), 128))
      ]),
      e.options.length ? S("", !0) : (n(), h("span", ys, "No choices declared."))
    ], 8, hs));
  }
});
/**!
 * Sortable 1.15.7
 * @author	RubaXa   <trash@rubaxa.org>
 * @author	owenm    <owen23355@gmail.com>
 * @license MIT
 */
function ks(e, a, t) {
  return (a = xs(a)) in e ? Object.defineProperty(e, a, {
    value: t,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : e[a] = t, e;
}
function xt() {
  return xt = Object.assign ? Object.assign.bind() : function(e) {
    for (var a = 1; a < arguments.length; a++) {
      var t = arguments[a];
      for (var l in t) ({}).hasOwnProperty.call(t, l) && (e[l] = t[l]);
    }
    return e;
  }, xt.apply(null, arguments);
}
function fo(e, a) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(e);
    a && (l = l.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), t.push.apply(t, l);
  }
  return t;
}
function ht(e) {
  for (var a = 1; a < arguments.length; a++) {
    var t = arguments[a] != null ? arguments[a] : {};
    a % 2 ? fo(Object(t), !0).forEach(function(l) {
      ks(e, l, t[l]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : fo(Object(t)).forEach(function(l) {
      Object.defineProperty(e, l, Object.getOwnPropertyDescriptor(t, l));
    });
  }
  return e;
}
function ws(e, a) {
  if (e == null) return {};
  var t, l, o = Vs(e, a);
  if (Object.getOwnPropertySymbols) {
    var d = Object.getOwnPropertySymbols(e);
    for (l = 0; l < d.length; l++) t = d[l], a.indexOf(t) === -1 && {}.propertyIsEnumerable.call(e, t) && (o[t] = e[t]);
  }
  return o;
}
function Vs(e, a) {
  if (e == null) return {};
  var t = {};
  for (var l in e) if ({}.hasOwnProperty.call(e, l)) {
    if (a.indexOf(l) !== -1) continue;
    t[l] = e[l];
  }
  return t;
}
function $s(e, a) {
  if (typeof e != "object" || !e) return e;
  var t = e[Symbol.toPrimitive];
  if (t !== void 0) {
    var l = t.call(e, a);
    if (typeof l != "object") return l;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (a === "string" ? String : Number)(e);
}
function xs(e) {
  var a = $s(e, "string");
  return typeof a == "symbol" ? a : a + "";
}
function Al(e) {
  "@babel/helpers - typeof";
  return Al = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(a) {
    return typeof a;
  } : function(a) {
    return a && typeof Symbol == "function" && a.constructor === Symbol && a !== Symbol.prototype ? "symbol" : typeof a;
  }, Al(e);
}
var Cs = "1.15.7";
function $t(e) {
  if (typeof window < "u" && window.navigator)
    return !!/* @__PURE__ */ navigator.userAgent.match(e);
}
var St = $t(/(?:Trident.*rv[ :]?11\.|msie|iemobile|Windows Phone)/i), Pa = $t(/Edge/i), mo = $t(/firefox/i), xa = $t(/safari/i) && !$t(/chrome/i) && !$t(/android/i), Hl = $t(/iP(ad|od|hone)/i), Go = $t(/chrome/i) && $t(/android/i), Ko = {
  capture: !1,
  passive: !1
};
function Ce(e, a, t) {
  e.addEventListener(a, t, !St && Ko);
}
function xe(e, a, t) {
  e.removeEventListener(a, t, !St && Ko);
}
function Ja(e, a) {
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
function Ho(e) {
  return e.host && e !== document && e.host.nodeType && e.host !== e ? e.host : e.parentNode;
}
function vt(e, a, t, l) {
  if (e) {
    t = t || document;
    do {
      if (a != null && (a[0] === ">" ? e.parentNode === t && Ja(e, a) : Ja(e, a)) || l && e === t)
        return e;
      if (e === t) break;
    } while (e = Ho(e));
  }
  return null;
}
var po = /\s+/g;
function ot(e, a, t) {
  if (e && a)
    if (e.classList)
      e.classList[t ? "add" : "remove"](a);
    else {
      var l = (" " + e.className + " ").replace(po, " ").replace(" " + a + " ", " ");
      e.className = (l + (t ? " " + a : "")).replace(po, " ");
    }
}
function pe(e, a, t) {
  var l = e && e.style;
  if (l) {
    if (t === void 0)
      return document.defaultView && document.defaultView.getComputedStyle ? t = document.defaultView.getComputedStyle(e, "") : e.currentStyle && (t = e.currentStyle), a === void 0 ? t : t[a];
    !(a in l) && a.indexOf("webkit") === -1 && (a = "-webkit-" + a), l[a] = t + (typeof t == "string" ? "" : "px");
  }
}
function sa(e, a) {
  var t = "";
  if (typeof e == "string")
    t = e;
  else
    do {
      var l = pe(e, "transform");
      l && l !== "none" && (t = l + " " + t);
    } while (!a && (e = e.parentNode));
  var o = window.DOMMatrix || window.WebKitCSSMatrix || window.CSSMatrix || window.MSCSSMatrix;
  return o && new o(t);
}
function Yo(e, a, t) {
  if (e) {
    var l = e.getElementsByTagName(a), o = 0, d = l.length;
    if (t)
      for (; o < d; o++)
        t(l[o], o);
    return l;
  }
  return [];
}
function bt() {
  var e = document.scrollingElement;
  return e || document.documentElement;
}
function ze(e, a, t, l, o) {
  if (!(!e.getBoundingClientRect && e !== window)) {
    var d, p, f, c, i, u, m;
    if (e !== window && e.parentNode && e !== bt() ? (d = e.getBoundingClientRect(), p = d.top, f = d.left, c = d.bottom, i = d.right, u = d.height, m = d.width) : (p = 0, f = 0, c = window.innerHeight, i = window.innerWidth, u = window.innerHeight, m = window.innerWidth), (a || t) && e !== window && (o = o || e.parentNode, !St))
      do
        if (o && o.getBoundingClientRect && (pe(o, "transform") !== "none" || t && pe(o, "position") !== "static")) {
          var V = o.getBoundingClientRect();
          p -= V.top + parseInt(pe(o, "border-top-width")), f -= V.left + parseInt(pe(o, "border-left-width")), c = p + d.height, i = f + d.width;
          break;
        }
      while (o = o.parentNode);
    if (l && e !== window) {
      var v = sa(o || e), b = v && v.a, y = v && v.d;
      v && (p /= y, f /= b, m /= b, u /= y, c = p + u, i = f + m);
    }
    return {
      top: p,
      left: f,
      bottom: c,
      right: i,
      width: m,
      height: u
    };
  }
}
function bo(e, a, t) {
  for (var l = At(e, !0), o = ze(e)[a]; l; ) {
    var d = ze(l)[t], p = void 0;
    if (p = o >= d, !p) return l;
    if (l === bt()) break;
    l = At(l, !1);
  }
  return !1;
}
function da(e, a, t, l) {
  for (var o = 0, d = 0, p = e.children; d < p.length; ) {
    if (p[d].style.display !== "none" && p[d] !== be.ghost && (l || p[d] !== be.dragged) && vt(p[d], t.draggable, e, !1)) {
      if (o === a)
        return p[d];
      o++;
    }
    d++;
  }
  return null;
}
function Yl(e, a) {
  for (var t = e.lastElementChild; t && (t === be.ghost || pe(t, "display") === "none" || a && !Ja(t, a)); )
    t = t.previousElementSibling;
  return t || null;
}
function st(e, a) {
  var t = 0;
  if (!e || !e.parentNode)
    return -1;
  for (; e = e.previousElementSibling; )
    e.nodeName.toUpperCase() !== "TEMPLATE" && e !== be.clone && (!a || Ja(e, a)) && t++;
  return t;
}
function ho(e) {
  var a = 0, t = 0, l = bt();
  if (e)
    do {
      var o = sa(e), d = o.a, p = o.d;
      a += e.scrollLeft * d, t += e.scrollTop * p;
    } while (e !== l && (e = e.parentNode));
  return [a, t];
}
function Ss(e, a) {
  for (var t in e)
    if (e.hasOwnProperty(t)) {
      for (var l in a)
        if (a.hasOwnProperty(l) && a[l] === e[t][l]) return Number(t);
    }
  return -1;
}
function At(e, a) {
  if (!e || !e.getBoundingClientRect) return bt();
  var t = e, l = !1;
  do
    if (t.clientWidth < t.scrollWidth || t.clientHeight < t.scrollHeight) {
      var o = pe(t);
      if (t.clientWidth < t.scrollWidth && (o.overflowX == "auto" || o.overflowX == "scroll") || t.clientHeight < t.scrollHeight && (o.overflowY == "auto" || o.overflowY == "scroll")) {
        if (!t.getBoundingClientRect || t === document.body) return bt();
        if (l || a) return t;
        l = !0;
      }
    }
  while (t = t.parentNode);
  return bt();
}
function Ts(e, a) {
  if (e && a)
    for (var t in a)
      a.hasOwnProperty(t) && (e[t] = a[t]);
  return e;
}
function yl(e, a) {
  return Math.round(e.top) === Math.round(a.top) && Math.round(e.left) === Math.round(a.left) && Math.round(e.height) === Math.round(a.height) && Math.round(e.width) === Math.round(a.width);
}
var Ca;
function Xo(e, a) {
  return function() {
    if (!Ca) {
      var t = arguments, l = this;
      t.length === 1 ? e.call(l, t[0]) : e.apply(l, t), Ca = setTimeout(function() {
        Ca = void 0;
      }, a);
    }
  };
}
function Is() {
  clearTimeout(Ca), Ca = void 0;
}
function Jo(e, a, t) {
  e.scrollLeft += a, e.scrollTop += t;
}
function Zo(e) {
  var a = window.Polymer, t = window.jQuery || window.Zepto;
  return a && a.dom ? a.dom(e).cloneNode(!0) : t ? t(e).clone(!0)[0] : e.cloneNode(!0);
}
function Qo(e, a, t) {
  var l = {};
  return Array.from(e.children).forEach(function(o) {
    var d, p, f, c;
    if (!(!vt(o, a.draggable, e, !1) || o.animated || o === t)) {
      var i = ze(o);
      l.left = Math.min((d = l.left) !== null && d !== void 0 ? d : 1 / 0, i.left), l.top = Math.min((p = l.top) !== null && p !== void 0 ? p : 1 / 0, i.top), l.right = Math.max((f = l.right) !== null && f !== void 0 ? f : -1 / 0, i.right), l.bottom = Math.max((c = l.bottom) !== null && c !== void 0 ? c : -1 / 0, i.bottom);
    }
  }), l.width = l.right - l.left, l.height = l.bottom - l.top, l.x = l.left, l.y = l.top, l;
}
var et = "Sortable" + (/* @__PURE__ */ new Date()).getTime();
function Ds() {
  var e = [], a;
  return {
    captureAnimationState: function() {
      if (e = [], !!this.options.animation) {
        var l = [].slice.call(this.el.children);
        l.forEach(function(o) {
          if (!(pe(o, "display") === "none" || o === be.ghost)) {
            e.push({
              target: o,
              rect: ze(o)
            });
            var d = ht({}, e[e.length - 1].rect);
            if (o.thisAnimationDuration) {
              var p = sa(o, !0);
              p && (d.top -= p.f, d.left -= p.e);
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
      e.splice(Ss(e, {
        target: l
      }), 1);
    },
    animateAll: function(l) {
      var o = this;
      if (!this.options.animation) {
        clearTimeout(a), typeof l == "function" && l();
        return;
      }
      var d = !1, p = 0;
      e.forEach(function(f) {
        var c = 0, i = f.target, u = i.fromRect, m = ze(i), V = i.prevFromRect, v = i.prevToRect, b = f.rect, y = sa(i, !0);
        y && (m.top -= y.f, m.left -= y.e), i.toRect = m, i.thisAnimationDuration && yl(V, m) && !yl(u, m) && // Make sure animatingRect is on line between toRect & fromRect
        (b.top - m.top) / (b.left - m.left) === (u.top - m.top) / (u.left - m.left) && (c = Es(b, V, v, o.options)), yl(m, u) || (i.prevFromRect = u, i.prevToRect = m, c || (c = o.options.animation), o.animate(i, b, m, c)), c && (d = !0, p = Math.max(p, c), clearTimeout(i.animationResetTimer), i.animationResetTimer = setTimeout(function() {
          i.animationTime = 0, i.prevFromRect = null, i.fromRect = null, i.prevToRect = null, i.thisAnimationDuration = null;
        }, c), i.thisAnimationDuration = c);
      }), clearTimeout(a), d ? a = setTimeout(function() {
        typeof l == "function" && l();
      }, p) : typeof l == "function" && l(), e = [];
    },
    animate: function(l, o, d, p) {
      if (p) {
        pe(l, "transition", ""), pe(l, "transform", "");
        var f = sa(this.el), c = f && f.a, i = f && f.d, u = (o.left - d.left) / (c || 1), m = (o.top - d.top) / (i || 1);
        l.animatingX = !!u, l.animatingY = !!m, pe(l, "transform", "translate3d(" + u + "px," + m + "px,0)"), this.forRepaintDummy = Us(l), pe(l, "transition", "transform " + p + "ms" + (this.options.easing ? " " + this.options.easing : "")), pe(l, "transform", "translate3d(0,0,0)"), typeof l.animated == "number" && clearTimeout(l.animated), l.animated = setTimeout(function() {
          pe(l, "transition", ""), pe(l, "transform", ""), l.animated = !1, l.animatingX = !1, l.animatingY = !1;
        }, p);
      }
    }
  };
}
function Us(e) {
  return e.offsetWidth;
}
function Es(e, a, t, l) {
  return Math.sqrt(Math.pow(a.top - e.top, 2) + Math.pow(a.left - e.left, 2)) / Math.sqrt(Math.pow(a.top - t.top, 2) + Math.pow(a.left - t.left, 2)) * l.animation;
}
var aa = [], kl = {
  initializeByDefault: !0
}, Oa = {
  mount: function(a) {
    for (var t in kl)
      kl.hasOwnProperty(t) && !(t in a) && (a[t] = kl[t]);
    aa.forEach(function(l) {
      if (l.pluginName === a.pluginName)
        throw "Sortable: Cannot mount plugin ".concat(a.pluginName, " more than once");
    }), aa.push(a);
  },
  pluginEvent: function(a, t, l) {
    var o = this;
    this.eventCanceled = !1, l.cancel = function() {
      o.eventCanceled = !0;
    };
    var d = a + "Global";
    aa.forEach(function(p) {
      t[p.pluginName] && (t[p.pluginName][d] && t[p.pluginName][d](ht({
        sortable: t
      }, l)), t.options[p.pluginName] && t[p.pluginName][a] && t[p.pluginName][a](ht({
        sortable: t
      }, l)));
    });
  },
  initializePlugins: function(a, t, l, o) {
    aa.forEach(function(f) {
      var c = f.pluginName;
      if (!(!a.options[c] && !f.initializeByDefault)) {
        var i = new f(a, t, a.options);
        i.sortable = a, i.options = a.options, a[c] = i, xt(l, i.defaults);
      }
    });
    for (var d in a.options)
      if (a.options.hasOwnProperty(d)) {
        var p = this.modifyOption(a, d, a.options[d]);
        typeof p < "u" && (a.options[d] = p);
      }
  },
  getEventProperties: function(a, t) {
    var l = {};
    return aa.forEach(function(o) {
      typeof o.eventProperties == "function" && xt(l, o.eventProperties.call(t[o.pluginName], a));
    }), l;
  },
  modifyOption: function(a, t, l) {
    var o;
    return aa.forEach(function(d) {
      a[d.pluginName] && d.optionListeners && typeof d.optionListeners[t] == "function" && (o = d.optionListeners[t].call(a[d.pluginName], l));
    }), o;
  }
};
function As(e) {
  var a = e.sortable, t = e.rootEl, l = e.name, o = e.targetEl, d = e.cloneEl, p = e.toEl, f = e.fromEl, c = e.oldIndex, i = e.newIndex, u = e.oldDraggableIndex, m = e.newDraggableIndex, V = e.originalEvent, v = e.putSortable, b = e.extraEventProperties;
  if (a = a || t && t[et], !!a) {
    var y, T = a.options, C = "on" + l.charAt(0).toUpperCase() + l.substr(1);
    window.CustomEvent && !St && !Pa ? y = new CustomEvent(l, {
      bubbles: !0,
      cancelable: !0
    }) : (y = document.createEvent("Event"), y.initEvent(l, !0, !0)), y.to = p || t, y.from = f || t, y.item = o || t, y.clone = d, y.oldIndex = c, y.newIndex = i, y.oldDraggableIndex = u, y.newDraggableIndex = m, y.originalEvent = V, y.pullMode = v ? v.lastPutMode : void 0;
    var U = ht(ht({}, b), Oa.getEventProperties(l, a));
    for (var W in U)
      y[W] = U[W];
    t && t.dispatchEvent(y), T[C] && T[C].call(a, y);
  }
}
var Ps = ["evt"], _e = function(a, t) {
  var l = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, o = l.evt, d = ws(l, Ps);
  Oa.pluginEvent.bind(be)(a, t, ht({
    dragEl: ae,
    parentEl: Fe,
    ghostEl: he,
    rootEl: Pe,
    nextEl: zt,
    lastDownEl: Ga,
    cloneEl: Ne,
    cloneHidden: Ut,
    dragStarted: ga,
    putSortable: He,
    activeSortable: be.active,
    originalEvent: o,
    oldIndex: na,
    oldDraggableIndex: Sa,
    newIndex: it,
    newDraggableIndex: Dt,
    hideGhostForTarget: ai,
    unhideGhostForTarget: li,
    cloneNowHidden: function() {
      Ut = !0;
    },
    cloneNowShown: function() {
      Ut = !1;
    },
    dispatchSortableEvent: function(f) {
      Je({
        sortable: t,
        name: f,
        originalEvent: o
      });
    }
  }, d));
};
function Je(e) {
  As(ht({
    putSortable: He,
    cloneEl: Ne,
    targetEl: ae,
    rootEl: Pe,
    oldIndex: na,
    oldDraggableIndex: Sa,
    newIndex: it,
    newDraggableIndex: Dt
  }, e));
}
var ae, Fe, he, Pe, zt, Ga, Ne, Ut, na, it, Sa, Dt, Ba, He, oa = !1, Za = !1, Qa = [], Ft, ct, wl, Vl, go, yo, ga, la, Ta, Ia = !1, za = !1, Ka, Ye, $l = [], Pl = !1, _a = [], ol = typeof document < "u", ja = Hl, ko = Pa || St ? "cssFloat" : "float", Os = ol && !Go && !Hl && "draggable" in document.createElement("div"), _o = (function() {
  if (ol) {
    if (St)
      return !1;
    var e = document.createElement("x");
    return e.style.cssText = "pointer-events:auto", e.style.pointerEvents === "auto";
  }
})(), ei = function(a, t) {
  var l = pe(a), o = parseInt(l.width) - parseInt(l.paddingLeft) - parseInt(l.paddingRight) - parseInt(l.borderLeftWidth) - parseInt(l.borderRightWidth), d = da(a, 0, t), p = da(a, 1, t), f = d && pe(d), c = p && pe(p), i = f && parseInt(f.marginLeft) + parseInt(f.marginRight) + ze(d).width, u = c && parseInt(c.marginLeft) + parseInt(c.marginRight) + ze(p).width;
  if (l.display === "flex")
    return l.flexDirection === "column" || l.flexDirection === "column-reverse" ? "vertical" : "horizontal";
  if (l.display === "grid")
    return l.gridTemplateColumns.split(" ").length <= 1 ? "vertical" : "horizontal";
  if (d && f.float && f.float !== "none") {
    var m = f.float === "left" ? "left" : "right";
    return p && (c.clear === "both" || c.clear === m) ? "vertical" : "horizontal";
  }
  return d && (f.display === "block" || f.display === "flex" || f.display === "table" || f.display === "grid" || i >= o && l[ko] === "none" || p && l[ko] === "none" && i + u > o) ? "vertical" : "horizontal";
}, Rs = function(a, t, l) {
  var o = l ? a.left : a.top, d = l ? a.right : a.bottom, p = l ? a.width : a.height, f = l ? t.left : t.top, c = l ? t.right : t.bottom, i = l ? t.width : t.height;
  return o === f || d === c || o + p / 2 === f + i / 2;
}, Ns = function(a, t) {
  var l;
  return Qa.some(function(o) {
    var d = o[et].options.emptyInsertThreshold;
    if (!(!d || Yl(o))) {
      var p = ze(o), f = a >= p.left - d && a <= p.right + d, c = t >= p.top - d && t <= p.bottom + d;
      if (f && c)
        return l = o;
    }
  }), l;
}, ti = function(a) {
  function t(d, p) {
    return function(f, c, i, u) {
      var m = f.options.group.name && c.options.group.name && f.options.group.name === c.options.group.name;
      if (d == null && (p || m))
        return !0;
      if (d == null || d === !1)
        return !1;
      if (p && d === "clone")
        return d;
      if (typeof d == "function")
        return t(d(f, c, i, u), p)(f, c, i, u);
      var V = (p ? f : c).options.group.name;
      return d === !0 || typeof d == "string" && d === V || d.join && d.indexOf(V) > -1;
    };
  }
  var l = {}, o = a.group;
  (!o || Al(o) != "object") && (o = {
    name: o
  }), l.name = o.name, l.checkPull = t(o.pull, !0), l.checkPut = t(o.put), l.revertClone = o.revertClone, a.group = l;
}, ai = function() {
  !_o && he && pe(he, "display", "none");
}, li = function() {
  !_o && he && pe(he, "display", "");
};
ol && !Go && document.addEventListener("click", function(e) {
  if (Za)
    return e.preventDefault(), e.stopPropagation && e.stopPropagation(), e.stopImmediatePropagation && e.stopImmediatePropagation(), Za = !1, !1;
}, !0);
var Lt = function(a) {
  if (ae) {
    a = a.touches ? a.touches[0] : a;
    var t = Ns(a.clientX, a.clientY);
    if (t) {
      var l = {};
      for (var o in a)
        a.hasOwnProperty(o) && (l[o] = a[o]);
      l.target = l.rootEl = t, l.preventDefault = void 0, l.stopPropagation = void 0, t[et]._onDragOver(l);
    }
  }
}, Ms = function(a) {
  ae && ae.parentNode[et]._isOutsideThisEl(a.target);
};
function be(e, a) {
  if (!(e && e.nodeType && e.nodeType === 1))
    throw "Sortable: `el` must be an HTMLElement, not ".concat({}.toString.call(e));
  this.el = e, this.options = a = xt({}, a), e[et] = this;
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
      return ei(e, this.options);
    },
    ghostClass: "sortable-ghost",
    chosenClass: "sortable-chosen",
    dragClass: "sortable-drag",
    ignore: "a, img",
    filter: null,
    preventOnFilter: !0,
    animation: 0,
    easing: null,
    setData: function(p, f) {
      p.setData("Text", f.textContent);
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
    supportPointer: be.supportPointer !== !1 && "PointerEvent" in window && (!xa || Hl),
    emptyInsertThreshold: 5
  };
  Oa.initializePlugins(this, e, t);
  for (var l in t)
    !(l in a) && (a[l] = t[l]);
  ti(a);
  for (var o in this)
    o.charAt(0) === "_" && typeof this[o] == "function" && (this[o] = this[o].bind(this));
  this.nativeDraggable = a.forceFallback ? !1 : Os, this.nativeDraggable && (this.options.touchStartThreshold = 1), a.supportPointer ? Ce(e, "pointerdown", this._onTapStart) : (Ce(e, "mousedown", this._onTapStart), Ce(e, "touchstart", this._onTapStart)), this.nativeDraggable && (Ce(e, "dragover", this), Ce(e, "dragenter", this)), Qa.push(this.el), a.store && a.store.get && this.sort(a.store.get(this) || []), xt(this, Ds());
}
be.prototype = /** @lends Sortable.prototype */
{
  constructor: be,
  _isOutsideThisEl: function(a) {
    !this.el.contains(a) && a !== this.el && (la = null);
  },
  _getDirection: function(a, t) {
    return typeof this.options.direction == "function" ? this.options.direction.call(this, a, t, ae) : this.options.direction;
  },
  _onTapStart: function(a) {
    if (a.cancelable) {
      var t = this, l = this.el, o = this.options, d = o.preventOnFilter, p = a.type, f = a.touches && a.touches[0] || a.pointerType && a.pointerType === "touch" && a, c = (f || a).target, i = a.target.shadowRoot && (a.path && a.path[0] || a.composedPath && a.composedPath()[0]) || c, u = o.filter;
      if (Gs(l), !ae && !(/mousedown|pointerdown/.test(p) && a.button !== 0 || o.disabled) && !i.isContentEditable && !(!this.nativeDraggable && xa && c && c.tagName.toUpperCase() === "SELECT") && (c = vt(c, o.draggable, l, !1), !(c && c.animated) && Ga !== c)) {
        if (na = st(c), Sa = st(c, o.draggable), typeof u == "function") {
          if (u.call(this, a, c, this)) {
            Je({
              sortable: t,
              rootEl: i,
              name: "filter",
              targetEl: c,
              toEl: l,
              fromEl: l
            }), _e("filter", t, {
              evt: a
            }), d && a.preventDefault();
            return;
          }
        } else if (u && (u = u.split(",").some(function(m) {
          if (m = vt(i, m.trim(), l, !1), m)
            return Je({
              sortable: t,
              rootEl: m,
              name: "filter",
              targetEl: c,
              fromEl: l,
              toEl: l
            }), _e("filter", t, {
              evt: a
            }), !0;
        }), u)) {
          d && a.preventDefault();
          return;
        }
        o.handle && !vt(i, o.handle, l, !1) || this._prepareDragStart(a, f, c);
      }
    }
  },
  _prepareDragStart: function(a, t, l) {
    var o = this, d = o.el, p = o.options, f = d.ownerDocument, c;
    if (l && !ae && l.parentNode === d) {
      var i = ze(l);
      if (Pe = d, ae = l, Fe = ae.parentNode, zt = ae.nextSibling, Ga = l, Ba = p.group, be.dragged = ae, Ft = {
        target: ae,
        clientX: (t || a).clientX,
        clientY: (t || a).clientY
      }, go = Ft.clientX - i.left, yo = Ft.clientY - i.top, this._lastX = (t || a).clientX, this._lastY = (t || a).clientY, ae.style["will-change"] = "all", c = function() {
        if (_e("delayEnded", o, {
          evt: a
        }), be.eventCanceled) {
          o._onDrop();
          return;
        }
        o._disableDelayedDragEvents(), !mo && o.nativeDraggable && (ae.draggable = !0), o._triggerDragStart(a, t), Je({
          sortable: o,
          name: "choose",
          originalEvent: a
        }), ot(ae, p.chosenClass, !0);
      }, p.ignore.split(",").forEach(function(u) {
        Yo(ae, u.trim(), xl);
      }), Ce(f, "dragover", Lt), Ce(f, "mousemove", Lt), Ce(f, "touchmove", Lt), p.supportPointer ? (Ce(f, "pointerup", o._onDrop), !this.nativeDraggable && Ce(f, "pointercancel", o._onDrop)) : (Ce(f, "mouseup", o._onDrop), Ce(f, "touchend", o._onDrop), Ce(f, "touchcancel", o._onDrop)), mo && this.nativeDraggable && (this.options.touchStartThreshold = 4, ae.draggable = !0), _e("delayStart", this, {
        evt: a
      }), p.delay && (!p.delayOnTouchOnly || t) && (!this.nativeDraggable || !(Pa || St))) {
        if (be.eventCanceled) {
          this._onDrop();
          return;
        }
        p.supportPointer ? (Ce(f, "pointerup", o._disableDelayedDrag), Ce(f, "pointercancel", o._disableDelayedDrag)) : (Ce(f, "mouseup", o._disableDelayedDrag), Ce(f, "touchend", o._disableDelayedDrag), Ce(f, "touchcancel", o._disableDelayedDrag)), Ce(f, "mousemove", o._delayedDragTouchMoveHandler), Ce(f, "touchmove", o._delayedDragTouchMoveHandler), p.supportPointer && Ce(f, "pointermove", o._delayedDragTouchMoveHandler), o._dragStartTimer = setTimeout(c, p.delay);
      } else
        c();
    }
  },
  _delayedDragTouchMoveHandler: function(a) {
    var t = a.touches ? a.touches[0] : a;
    Math.max(Math.abs(t.clientX - this._lastX), Math.abs(t.clientY - this._lastY)) >= Math.floor(this.options.touchStartThreshold / (this.nativeDraggable && window.devicePixelRatio || 1)) && this._disableDelayedDrag();
  },
  _disableDelayedDrag: function() {
    ae && xl(ae), clearTimeout(this._dragStartTimer), this._disableDelayedDragEvents();
  },
  _disableDelayedDragEvents: function() {
    var a = this.el.ownerDocument;
    xe(a, "mouseup", this._disableDelayedDrag), xe(a, "touchend", this._disableDelayedDrag), xe(a, "touchcancel", this._disableDelayedDrag), xe(a, "pointerup", this._disableDelayedDrag), xe(a, "pointercancel", this._disableDelayedDrag), xe(a, "mousemove", this._delayedDragTouchMoveHandler), xe(a, "touchmove", this._delayedDragTouchMoveHandler), xe(a, "pointermove", this._delayedDragTouchMoveHandler);
  },
  _triggerDragStart: function(a, t) {
    t = t || a.pointerType == "touch" && a, !this.nativeDraggable || t ? this.options.supportPointer ? Ce(document, "pointermove", this._onTouchMove) : t ? Ce(document, "touchmove", this._onTouchMove) : Ce(document, "mousemove", this._onTouchMove) : (Ce(ae, "dragend", this), Ce(Pe, "dragstart", this._onDragStart));
    try {
      document.selection ? Ha(function() {
        document.selection.empty();
      }) : window.getSelection().removeAllRanges();
    } catch {
    }
  },
  _dragStarted: function(a, t) {
    if (oa = !1, Pe && ae) {
      _e("dragStarted", this, {
        evt: t
      }), this.nativeDraggable && Ce(document, "dragover", Ms);
      var l = this.options;
      !a && ot(ae, l.dragClass, !1), ot(ae, l.ghostClass, !0), be.active = this, a && this._appendGhost(), Je({
        sortable: this,
        name: "start",
        originalEvent: t
      });
    } else
      this._nulling();
  },
  _emulateDragOver: function() {
    if (ct) {
      this._lastX = ct.clientX, this._lastY = ct.clientY, ai();
      for (var a = document.elementFromPoint(ct.clientX, ct.clientY), t = a; a && a.shadowRoot && (a = a.shadowRoot.elementFromPoint(ct.clientX, ct.clientY), a !== t); )
        t = a;
      if (ae.parentNode[et]._isOutsideThisEl(a), t)
        do {
          if (t[et]) {
            var l = void 0;
            if (l = t[et]._onDragOver({
              clientX: ct.clientX,
              clientY: ct.clientY,
              target: a,
              rootEl: t
            }), l && !this.options.dragoverBubble)
              break;
          }
          a = t;
        } while (t = Ho(t));
      li();
    }
  },
  _onTouchMove: function(a) {
    if (Ft) {
      var t = this.options, l = t.fallbackTolerance, o = t.fallbackOffset, d = a.touches ? a.touches[0] : a, p = he && sa(he, !0), f = he && p && p.a, c = he && p && p.d, i = ja && Ye && ho(Ye), u = (d.clientX - Ft.clientX + o.x) / (f || 1) + (i ? i[0] - $l[0] : 0) / (f || 1), m = (d.clientY - Ft.clientY + o.y) / (c || 1) + (i ? i[1] - $l[1] : 0) / (c || 1);
      if (!be.active && !oa) {
        if (l && Math.max(Math.abs(d.clientX - this._lastX), Math.abs(d.clientY - this._lastY)) < l)
          return;
        this._onDragStart(a, !0);
      }
      if (he) {
        p ? (p.e += u - (wl || 0), p.f += m - (Vl || 0)) : p = {
          a: 1,
          b: 0,
          c: 0,
          d: 1,
          e: u,
          f: m
        };
        var V = "matrix(".concat(p.a, ",").concat(p.b, ",").concat(p.c, ",").concat(p.d, ",").concat(p.e, ",").concat(p.f, ")");
        pe(he, "webkitTransform", V), pe(he, "mozTransform", V), pe(he, "msTransform", V), pe(he, "transform", V), wl = u, Vl = m, ct = d;
      }
      a.cancelable && a.preventDefault();
    }
  },
  _appendGhost: function() {
    if (!he) {
      var a = this.options.fallbackOnBody ? document.body : Pe, t = ze(ae, !0, ja, !0, a), l = this.options;
      if (ja) {
        for (Ye = a; pe(Ye, "position") === "static" && pe(Ye, "transform") === "none" && Ye !== document; )
          Ye = Ye.parentNode;
        Ye !== document.body && Ye !== document.documentElement ? (Ye === document && (Ye = bt()), t.top += Ye.scrollTop, t.left += Ye.scrollLeft) : Ye = bt(), $l = ho(Ye);
      }
      he = ae.cloneNode(!0), ot(he, l.ghostClass, !1), ot(he, l.fallbackClass, !0), ot(he, l.dragClass, !0), pe(he, "transition", ""), pe(he, "transform", ""), pe(he, "box-sizing", "border-box"), pe(he, "margin", 0), pe(he, "top", t.top), pe(he, "left", t.left), pe(he, "width", t.width), pe(he, "height", t.height), pe(he, "opacity", "0.8"), pe(he, "position", ja ? "absolute" : "fixed"), pe(he, "zIndex", "100000"), pe(he, "pointerEvents", "none"), be.ghost = he, a.appendChild(he), pe(he, "transform-origin", go / parseInt(he.style.width) * 100 + "% " + yo / parseInt(he.style.height) * 100 + "%");
    }
  },
  _onDragStart: function(a, t) {
    var l = this, o = a.dataTransfer, d = l.options;
    if (_e("dragStart", this, {
      evt: a
    }), be.eventCanceled) {
      this._onDrop();
      return;
    }
    _e("setupClone", this), be.eventCanceled || (Ne = Zo(ae), Ne.removeAttribute("id"), Ne.draggable = !1, Ne.style["will-change"] = "", this._hideClone(), ot(Ne, this.options.chosenClass, !1), be.clone = Ne), l.cloneId = Ha(function() {
      _e("clone", l), !be.eventCanceled && (l.options.removeCloneOnHide || Pe.insertBefore(Ne, ae), l._hideClone(), Je({
        sortable: l,
        name: "clone"
      }));
    }), !t && ot(ae, d.dragClass, !0), t ? (Za = !0, l._loopId = setInterval(l._emulateDragOver, 50)) : (xe(document, "mouseup", l._onDrop), xe(document, "touchend", l._onDrop), xe(document, "touchcancel", l._onDrop), o && (o.effectAllowed = "move", d.setData && d.setData.call(l, o, ae)), Ce(document, "drop", l), pe(ae, "transform", "translateZ(0)")), oa = !0, l._dragStartId = Ha(l._dragStarted.bind(l, t, a)), Ce(document, "selectstart", l), ga = !0, window.getSelection().removeAllRanges(), xa && pe(document.body, "user-select", "none");
  },
  // Returns true - if no further action is needed (either inserted or another condition)
  _onDragOver: function(a) {
    var t = this.el, l = a.target, o, d, p, f = this.options, c = f.group, i = be.active, u = Ba === c, m = f.sort, V = He || i, v, b = this, y = !1;
    if (Pl) return;
    function T(X, x) {
      _e(X, b, ht({
        evt: a,
        isOwner: u,
        axis: v ? "vertical" : "horizontal",
        revert: p,
        dragRect: o,
        targetRect: d,
        canSort: m,
        fromSortable: V,
        target: l,
        completed: U,
        onMove: function(E, N) {
          return Wa(Pe, t, ae, o, E, ze(E), a, N);
        },
        changed: W
      }, x));
    }
    function C() {
      T("dragOverAnimationCapture"), b.captureAnimationState(), b !== V && V.captureAnimationState();
    }
    function U(X) {
      return T("dragOverCompleted", {
        insertion: X
      }), X && (u ? i._hideClone() : i._showClone(b), b !== V && (ot(ae, He ? He.options.ghostClass : i.options.ghostClass, !1), ot(ae, f.ghostClass, !0)), He !== b && b !== be.active ? He = b : b === be.active && He && (He = null), V === b && (b._ignoreWhileAnimating = l), b.animateAll(function() {
        T("dragOverAnimationComplete"), b._ignoreWhileAnimating = null;
      }), b !== V && (V.animateAll(), V._ignoreWhileAnimating = null)), (l === ae && !ae.animated || l === t && !l.animated) && (la = null), !f.dragoverBubble && !a.rootEl && l !== document && (ae.parentNode[et]._isOutsideThisEl(a.target), !X && Lt(a)), !f.dragoverBubble && a.stopPropagation && a.stopPropagation(), y = !0;
    }
    function W() {
      it = st(ae), Dt = st(ae, f.draggable), Je({
        sortable: b,
        name: "change",
        toEl: t,
        newIndex: it,
        newDraggableIndex: Dt,
        originalEvent: a
      });
    }
    if (a.preventDefault !== void 0 && a.cancelable && a.preventDefault(), l = vt(l, f.draggable, t, !0), T("dragOver"), be.eventCanceled) return y;
    if (ae.contains(a.target) || l.animated && l.animatingX && l.animatingY || b._ignoreWhileAnimating === l)
      return U(!1);
    if (Za = !1, i && !f.disabled && (u ? m || (p = Fe !== Pe) : He === this || (this.lastPutMode = Ba.checkPull(this, i, ae, a)) && c.checkPut(this, i, ae, a))) {
      if (v = this._getDirection(a, l) === "vertical", o = ze(ae), T("dragOverValid"), be.eventCanceled) return y;
      if (p)
        return Fe = Pe, C(), this._hideClone(), T("revert"), be.eventCanceled || (zt ? Pe.insertBefore(ae, zt) : Pe.appendChild(ae)), U(!0);
      var L = Yl(t, f.draggable);
      if (!L || zs(a, v, this) && !L.animated) {
        if (L === ae)
          return U(!1);
        if (L && t === a.target && (l = L), l && (d = ze(l)), Wa(Pe, t, ae, o, l, d, a, !!l) !== !1)
          return C(), L && L.nextSibling ? t.insertBefore(ae, L.nextSibling) : t.appendChild(ae), Fe = t, W(), U(!0);
      } else if (L && Bs(a, v, this)) {
        var _ = da(t, 0, f, !0);
        if (_ === ae)
          return U(!1);
        if (l = _, d = ze(l), Wa(Pe, t, ae, o, l, d, a, !1) !== !1)
          return C(), t.insertBefore(ae, _), Fe = t, W(), U(!0);
      } else if (l.parentNode === t) {
        d = ze(l);
        var j = 0, Z, re = ae.parentNode !== t, de = !Rs(ae.animated && ae.toRect || o, l.animated && l.toRect || d, v), ye = v ? "top" : "left", fe = bo(l, "top", "top") || bo(ae, "top", "top"), le = fe ? fe.scrollTop : void 0;
        la !== l && (Z = d[ye], Ia = !1, za = !de && f.invertSwap || re), j = js(a, l, d, v, de ? 1 : f.swapThreshold, f.invertedSwapThreshold == null ? f.swapThreshold : f.invertedSwapThreshold, za, la === l);
        var A;
        if (j !== 0) {
          var F = st(ae);
          do
            F -= j, A = Fe.children[F];
          while (A && (pe(A, "display") === "none" || A === he));
        }
        if (j === 0 || A === l)
          return U(!1);
        la = l, Ta = j;
        var R = l.nextElementSibling, ue = !1;
        ue = j === 1;
        var H = Wa(Pe, t, ae, o, l, d, a, ue);
        if (H !== !1)
          return (H === 1 || H === -1) && (ue = H === 1), Pl = !0, setTimeout(Ls, 30), C(), ue && !R ? t.appendChild(ae) : l.parentNode.insertBefore(ae, ue ? R : l), fe && Jo(fe, 0, le - fe.scrollTop), Fe = ae.parentNode, Z !== void 0 && !za && (Ka = Math.abs(Z - ze(l)[ye])), W(), U(!0);
      }
      if (t.contains(ae))
        return U(!1);
    }
    return !1;
  },
  _ignoreWhileAnimating: null,
  _offMoveEvents: function() {
    xe(document, "mousemove", this._onTouchMove), xe(document, "touchmove", this._onTouchMove), xe(document, "pointermove", this._onTouchMove), xe(document, "dragover", Lt), xe(document, "mousemove", Lt), xe(document, "touchmove", Lt);
  },
  _offUpEvents: function() {
    var a = this.el.ownerDocument;
    xe(a, "mouseup", this._onDrop), xe(a, "touchend", this._onDrop), xe(a, "pointerup", this._onDrop), xe(a, "pointercancel", this._onDrop), xe(a, "touchcancel", this._onDrop), xe(document, "selectstart", this);
  },
  _onDrop: function(a) {
    var t = this.el, l = this.options;
    if (it = st(ae), Dt = st(ae, l.draggable), _e("drop", this, {
      evt: a
    }), Fe = ae && ae.parentNode, it = st(ae), Dt = st(ae, l.draggable), be.eventCanceled) {
      this._nulling();
      return;
    }
    oa = !1, za = !1, Ia = !1, clearInterval(this._loopId), clearTimeout(this._dragStartTimer), Ol(this.cloneId), Ol(this._dragStartId), this.nativeDraggable && (xe(document, "drop", this), xe(t, "dragstart", this._onDragStart)), this._offMoveEvents(), this._offUpEvents(), xa && pe(document.body, "user-select", ""), pe(ae, "transform", ""), a && (ga && (a.cancelable && a.preventDefault(), !l.dropBubble && a.stopPropagation()), he && he.parentNode && he.parentNode.removeChild(he), (Pe === Fe || He && He.lastPutMode !== "clone") && Ne && Ne.parentNode && Ne.parentNode.removeChild(Ne), ae && (this.nativeDraggable && xe(ae, "dragend", this), xl(ae), ae.style["will-change"] = "", ga && !oa && ot(ae, He ? He.options.ghostClass : this.options.ghostClass, !1), ot(ae, this.options.chosenClass, !1), Je({
      sortable: this,
      name: "unchoose",
      toEl: Fe,
      newIndex: null,
      newDraggableIndex: null,
      originalEvent: a
    }), Pe !== Fe ? (it >= 0 && (Je({
      rootEl: Fe,
      name: "add",
      toEl: Fe,
      fromEl: Pe,
      originalEvent: a
    }), Je({
      sortable: this,
      name: "remove",
      toEl: Fe,
      originalEvent: a
    }), Je({
      rootEl: Fe,
      name: "sort",
      toEl: Fe,
      fromEl: Pe,
      originalEvent: a
    }), Je({
      sortable: this,
      name: "sort",
      toEl: Fe,
      originalEvent: a
    })), He && He.save()) : it !== na && it >= 0 && (Je({
      sortable: this,
      name: "update",
      toEl: Fe,
      originalEvent: a
    }), Je({
      sortable: this,
      name: "sort",
      toEl: Fe,
      originalEvent: a
    })), be.active && ((it == null || it === -1) && (it = na, Dt = Sa), Je({
      sortable: this,
      name: "end",
      toEl: Fe,
      originalEvent: a
    }), this.save()))), this._nulling();
  },
  _nulling: function() {
    _e("nulling", this), Pe = ae = Fe = he = zt = Ne = Ga = Ut = Ft = ct = ga = it = Dt = na = Sa = la = Ta = He = Ba = be.dragged = be.ghost = be.clone = be.active = null;
    var a = this.el;
    _a.forEach(function(t) {
      a.contains(t) && (t.checked = !0);
    }), _a.length = wl = Vl = 0;
  },
  handleEvent: function(a) {
    switch (a.type) {
      case "drop":
      case "dragend":
        this._onDrop(a);
        break;
      case "dragenter":
      case "dragover":
        ae && (this._onDragOver(a), Fs(a));
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
    for (var a = [], t, l = this.el.children, o = 0, d = l.length, p = this.options; o < d; o++)
      t = l[o], vt(t, p.draggable, this.el, !1) && a.push(t.getAttribute(p.dataIdAttr) || qs(t));
    return a;
  },
  /**
   * Sorts the elements according to the array.
   * @param  {String[]}  order  order of the items
   */
  sort: function(a, t) {
    var l = {}, o = this.el;
    this.toArray().forEach(function(d, p) {
      var f = o.children[p];
      vt(f, this.options.draggable, o, !1) && (l[d] = f);
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
    return vt(a, t || this.options.draggable, this.el, !1);
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
    var o = Oa.modifyOption(this, a, t);
    typeof o < "u" ? l[a] = o : l[a] = t, a === "group" && ti(l);
  },
  /**
   * Destroy
   */
  destroy: function() {
    _e("destroy", this);
    var a = this.el;
    a[et] = null, xe(a, "mousedown", this._onTapStart), xe(a, "touchstart", this._onTapStart), xe(a, "pointerdown", this._onTapStart), this.nativeDraggable && (xe(a, "dragover", this), xe(a, "dragenter", this)), Array.prototype.forEach.call(a.querySelectorAll("[draggable]"), function(t) {
      t.removeAttribute("draggable");
    }), this._onDrop(), this._disableDelayedDragEvents(), Qa.splice(Qa.indexOf(this.el), 1), this.el = a = null;
  },
  _hideClone: function() {
    if (!Ut) {
      if (_e("hideClone", this), be.eventCanceled) return;
      pe(Ne, "display", "none"), this.options.removeCloneOnHide && Ne.parentNode && Ne.parentNode.removeChild(Ne), Ut = !0;
    }
  },
  _showClone: function(a) {
    if (a.lastPutMode !== "clone") {
      this._hideClone();
      return;
    }
    if (Ut) {
      if (_e("showClone", this), be.eventCanceled) return;
      ae.parentNode == Pe && !this.options.group.revertClone ? Pe.insertBefore(Ne, ae) : zt ? Pe.insertBefore(Ne, zt) : Pe.appendChild(Ne), this.options.group.revertClone && this.animate(ae, Ne), pe(Ne, "display", ""), Ut = !1;
    }
  }
};
function Fs(e) {
  e.dataTransfer && (e.dataTransfer.dropEffect = "move"), e.cancelable && e.preventDefault();
}
function Wa(e, a, t, l, o, d, p, f) {
  var c, i = e[et], u = i.options.onMove, m;
  return window.CustomEvent && !St && !Pa ? c = new CustomEvent("move", {
    bubbles: !0,
    cancelable: !0
  }) : (c = document.createEvent("Event"), c.initEvent("move", !0, !0)), c.to = a, c.from = e, c.dragged = t, c.draggedRect = l, c.related = o || a, c.relatedRect = d || ze(a), c.willInsertAfter = f, c.originalEvent = p, e.dispatchEvent(c), u && (m = u.call(i, c, p)), m;
}
function xl(e) {
  e.draggable = !1;
}
function Ls() {
  Pl = !1;
}
function Bs(e, a, t) {
  var l = ze(da(t.el, 0, t.options, !0)), o = Qo(t.el, t.options, he), d = 10;
  return a ? e.clientX < o.left - d || e.clientY < l.top && e.clientX < l.right : e.clientY < o.top - d || e.clientY < l.bottom && e.clientX < l.left;
}
function zs(e, a, t) {
  var l = ze(Yl(t.el, t.options.draggable)), o = Qo(t.el, t.options, he), d = 10;
  return a ? e.clientX > o.right + d || e.clientY > l.bottom && e.clientX > l.left : e.clientY > o.bottom + d || e.clientX > l.right && e.clientY > l.top;
}
function js(e, a, t, l, o, d, p, f) {
  var c = l ? e.clientY : e.clientX, i = l ? t.height : t.width, u = l ? t.top : t.left, m = l ? t.bottom : t.right, V = !1;
  if (!p) {
    if (f && Ka < i * o) {
      if (!Ia && (Ta === 1 ? c > u + i * d / 2 : c < m - i * d / 2) && (Ia = !0), Ia)
        V = !0;
      else if (Ta === 1 ? c < u + Ka : c > m - Ka)
        return -Ta;
    } else if (c > u + i * (1 - o) / 2 && c < m - i * (1 - o) / 2)
      return Ws(a);
  }
  return V = V || p, V && (c < u + i * d / 2 || c > m - i * d / 2) ? c > u + i / 2 ? 1 : -1 : 0;
}
function Ws(e) {
  return st(ae) < st(e) ? 1 : -1;
}
function qs(e) {
  for (var a = e.tagName + e.className + e.src + e.href + e.textContent, t = a.length, l = 0; t--; )
    l += a.charCodeAt(t);
  return l.toString(36);
}
function Gs(e) {
  _a.length = 0;
  for (var a = e.getElementsByTagName("input"), t = a.length; t--; ) {
    var l = a[t];
    l.checked && _a.push(l);
  }
}
function Ha(e) {
  return setTimeout(e, 0);
}
function Ol(e) {
  return clearTimeout(e);
}
ol && Ce(document, "touchmove", function(e) {
  (be.active || oa) && e.cancelable && e.preventDefault();
});
be.utils = {
  on: Ce,
  off: xe,
  css: pe,
  find: Yo,
  is: function(a, t) {
    return !!vt(a, t, a, !1);
  },
  extend: Ts,
  throttle: Xo,
  closest: vt,
  toggleClass: ot,
  clone: Zo,
  index: st,
  nextTick: Ha,
  cancelNextTick: Ol,
  detectDirection: ei,
  getChild: da,
  expando: et
};
be.get = function(e) {
  return e[et];
};
be.mount = function() {
  for (var e = arguments.length, a = new Array(e), t = 0; t < e; t++)
    a[t] = arguments[t];
  a[0].constructor === Array && (a = a[0]), a.forEach(function(l) {
    if (!l.prototype || !l.prototype.constructor)
      throw "Sortable: Mounted plugin must be a constructor function, not ".concat({}.toString.call(l));
    l.utils && (be.utils = ht(ht({}, be.utils), l.utils)), Oa.mount(l);
  });
};
be.create = function(e, a) {
  return new be(e, a);
};
be.version = Cs;
var Be = [], ya, Rl, Nl = !1, Cl, Sl, el, ka;
function Ks() {
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
      this.sortable.nativeDraggable ? xe(document, "dragover", this._handleAutoScroll) : (xe(document, "pointermove", this._handleFallbackAutoScroll), xe(document, "touchmove", this._handleFallbackAutoScroll), xe(document, "mousemove", this._handleFallbackAutoScroll)), wo(), Ya(), Is();
    },
    nulling: function() {
      el = Rl = ya = Nl = ka = Cl = Sl = null, Be.length = 0;
    },
    _handleFallbackAutoScroll: function(t) {
      this._handleAutoScroll(t, !0);
    },
    _handleAutoScroll: function(t, l) {
      var o = this, d = (t.touches ? t.touches[0] : t).clientX, p = (t.touches ? t.touches[0] : t).clientY, f = document.elementFromPoint(d, p);
      if (el = t, l || this.options.forceAutoScrollFallback || Pa || St || xa) {
        Tl(t, this.options, f, l);
        var c = At(f, !0);
        Nl && (!ka || d !== Cl || p !== Sl) && (ka && wo(), ka = setInterval(function() {
          var i = At(document.elementFromPoint(d, p), !0);
          i !== c && (c = i, Ya()), Tl(t, o.options, i, l);
        }, 10), Cl = d, Sl = p);
      } else {
        if (!this.options.bubbleScroll || At(f, !0) === bt()) {
          Ya();
          return;
        }
        Tl(t, this.options, At(f, !1), !1);
      }
    }
  }, xt(e, {
    pluginName: "scroll",
    initializeByDefault: !0
  });
}
function Ya() {
  Be.forEach(function(e) {
    clearInterval(e.pid);
  }), Be = [];
}
function wo() {
  clearInterval(ka);
}
var Tl = Xo(function(e, a, t, l) {
  if (a.scroll) {
    var o = (e.touches ? e.touches[0] : e).clientX, d = (e.touches ? e.touches[0] : e).clientY, p = a.scrollSensitivity, f = a.scrollSpeed, c = bt(), i = !1, u;
    Rl !== t && (Rl = t, Ya(), ya = a.scroll, u = a.scrollFn, ya === !0 && (ya = At(t, !0)));
    var m = 0, V = ya;
    do {
      var v = V, b = ze(v), y = b.top, T = b.bottom, C = b.left, U = b.right, W = b.width, L = b.height, _ = void 0, j = void 0, Z = v.scrollWidth, re = v.scrollHeight, de = pe(v), ye = v.scrollLeft, fe = v.scrollTop;
      v === c ? (_ = W < Z && (de.overflowX === "auto" || de.overflowX === "scroll" || de.overflowX === "visible"), j = L < re && (de.overflowY === "auto" || de.overflowY === "scroll" || de.overflowY === "visible")) : (_ = W < Z && (de.overflowX === "auto" || de.overflowX === "scroll"), j = L < re && (de.overflowY === "auto" || de.overflowY === "scroll"));
      var le = _ && (Math.abs(U - o) <= p && ye + W < Z) - (Math.abs(C - o) <= p && !!ye), A = j && (Math.abs(T - d) <= p && fe + L < re) - (Math.abs(y - d) <= p && !!fe);
      if (!Be[m])
        for (var F = 0; F <= m; F++)
          Be[F] || (Be[F] = {});
      (Be[m].vx != le || Be[m].vy != A || Be[m].el !== v) && (Be[m].el = v, Be[m].vx = le, Be[m].vy = A, clearInterval(Be[m].pid), (le != 0 || A != 0) && (i = !0, Be[m].pid = setInterval(function() {
        l && this.layer === 0 && be.active._onTouchMove(el);
        var R = Be[this.layer].vy ? Be[this.layer].vy * f : 0, ue = Be[this.layer].vx ? Be[this.layer].vx * f : 0;
        typeof u == "function" && u.call(be.dragged.parentNode[et], ue, R, e, el, Be[this.layer].el) !== "continue" || Jo(Be[this.layer].el, ue, R);
      }.bind({
        layer: m
      }), 24))), m++;
    } while (a.bubbleScroll && V !== c && (V = At(V, !1)));
    Nl = i;
  }
}, 30), oi = function(a) {
  var t = a.originalEvent, l = a.putSortable, o = a.dragEl, d = a.activeSortable, p = a.dispatchSortableEvent, f = a.hideGhostForTarget, c = a.unhideGhostForTarget;
  if (t) {
    var i = l || d;
    f();
    var u = t.changedTouches && t.changedTouches.length ? t.changedTouches[0] : t, m = document.elementFromPoint(u.clientX, u.clientY);
    c(), i && !i.el.contains(m) && (p("spill"), this.onSpill({
      dragEl: o,
      putSortable: l
    }));
  }
};
function Xl() {
}
Xl.prototype = {
  startIndex: null,
  dragStart: function(a) {
    var t = a.oldDraggableIndex;
    this.startIndex = t;
  },
  onSpill: function(a) {
    var t = a.dragEl, l = a.putSortable;
    this.sortable.captureAnimationState(), l && l.captureAnimationState();
    var o = da(this.sortable.el, this.startIndex, this.options);
    o ? this.sortable.el.insertBefore(t, o) : this.sortable.el.appendChild(t), this.sortable.animateAll(), l && l.animateAll();
  },
  drop: oi
};
xt(Xl, {
  pluginName: "revertOnSpill"
});
function Jl() {
}
Jl.prototype = {
  onSpill: function(a) {
    var t = a.dragEl, l = a.putSortable, o = l || this.sortable;
    o.captureAnimationState(), t.parentNode && t.parentNode.removeChild(t), o.animateAll();
  },
  drop: oi
};
xt(Jl, {
  pluginName: "removeOnSpill"
});
be.mount(new Ks());
be.mount(Jl, Xl);
function Hs(e, a) {
  const t = e.oldDraggableIndex ?? e.oldIndex;
  e.item.remove();
  const l = [...e.from.children].filter((o) => o.matches(a));
  e.from.insertBefore(e.item, l[t ?? l.length] ?? null);
}
function ii(e) {
  const a = /* @__PURE__ */ new Map();
  function t(l) {
    a.get(l)?.destroy(), a.delete(l);
  }
  return Ct(() => {
    for (const l of a.keys()) t(l);
  }), {
    mounted(l) {
      const o = l.querySelector(".work-field-builder") ?? l;
      a.set(l, new be(o, {
        draggable: ".work-reorder-entry",
        handle: ".work-reorder-handle",
        forceFallback: !0,
        fallbackOnBody: !1,
        ghostClass: "work-drag-ghost",
        onEnd(d) {
          const p = d.oldDraggableIndex, f = d.newDraggableIndex;
          Hs(d, ".work-reorder-entry"), p !== void 0 && f !== void 0 && p !== f && e(p, f);
        }
      }));
    },
    unmounted: t
  };
}
const Ys = { class: "work-stack work-tight work-option-builder" }, Xs = { class: "work-stack work-tight" }, Js = { class: "work-stack work-tight work-small" }, Zs = { class: "work-stack work-tight work-small" }, Qs = { class: "work-stack work-tight" }, _s = { class: "work-stack work-tight work-small" }, er = { class: "work-row" }, tr = { class: "work-stack work-tight work-small" }, ar = { class: "work-row" }, lr = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, or = { class: "work-add-option" }, ir = {
  key: 0,
  class: "work-muted work-small"
}, nr = /* @__PURE__ */ Ve({
  __name: "OptionsEditor",
  props: {
    field: {}
  },
  emits: ["validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = "options:" + Kt(), d = G(() => t.field.options ?? []), p = G(() => d.value.every((m, V) => !!m.id && d.value.findIndex((v) => v.id === m.id) === V));
    Ie(p, (m) => l("validity", m, o), { immediate: !0 }), Ct(() => l("validity", !0, o));
    function f(m, V) {
      No(d.value, m, V - m), d.value.forEach((v, b) => v.order = b);
    }
    const c = ii(f), i = ["primary", "success", "info", "warn", "danger", "secondary"];
    function u() {
      let m = d.value.length + 1;
      for (; d.value.some((V) => V.id === `option_${m}`); ) m++;
      (t.field.options ??= []).push({ id: `option_${m}`, label: "New option", order: d.value.length });
    }
    return (m, V) => (n(), h("section", Ys, [
      V[4] || (V[4] = s("header", { class: "work-row" }, [
        s("h4", null, "Options"),
        s("span", { class: "work-muted work-small" }, "Renaming a choice keeps it selected on existing items."),
        s("span", { class: "work-spacer" })
      ], -1)),
      pt((n(), h("div", Xs, [
        (n(!0), h(Q, null, se(d.value, (v, b) => (n(), h("div", {
          key: b,
          class: "work-option-row work-reorder-entry"
        }, [
          k(r(ee), {
            type: "button",
            class: "work-icon-button work-reorder-handle",
            "aria-label": "Drag option; arrow keys reorder",
            onKeydown: [
              qe(Oe((y) => f(b, b - 1), ["prevent"]), ["up"]),
              qe(Oe((y) => f(b, b + 1), ["prevent"]), ["down"])
            ],
            severity: "secondary",
            text: "",
            size: "small"
          }, {
            default: q(() => [
              k(r(ve), {
                icon: "tabler:grip-vertical",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["onKeydown"]),
          s("label", Js, [
            V[0] || (V[0] = z("Label", -1)),
            k(r(Se), {
              modelValue: v.label,
              "onUpdate:modelValue": (y) => v.label = y,
              "aria-label": "Option label"
            }, null, 8, ["modelValue", "onUpdate:modelValue"])
          ]),
          k(Re, {
            class: "work-disclosure",
            label: "Advanced"
          }, {
            default: q(() => [
              s("label", Zs, [
                V[1] || (V[1] = z("Integration identifier", -1)),
                k(r(Se), {
                  modelValue: v.id,
                  "onUpdate:modelValue": (y) => v.id = y,
                  class: "work-option-code",
                  required: "",
                  "aria-label": "Option ID"
                }, null, 8, ["modelValue", "onUpdate:modelValue"])
              ])
            ]),
            _: 2
          }, 1024),
          s("div", Qs, [
            s("label", _s, [
              V[2] || (V[2] = z("Color", -1)),
              s("span", er, [
                s("span", {
                  class: ft(["work-color-swatch", "work-swatch-" + (v.color || "secondary")]),
                  "aria-hidden": "true"
                }, null, 2),
                k(r(ce), {
                  modelValue: v.color,
                  "onUpdate:modelValue": (y) => v.color = y,
                  "aria-label": "Option color",
                  appendTo: "self",
                  optionLabel: "label",
                  optionValue: "value",
                  optionDisabled: "disabled",
                  options: [{ label: "Default", value: void 0, disabled: !1 }, ...(i ?? []).map((y) => ({ label: y, value: y, disabled: !1 }))]
                }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
              ])
            ]),
            s("label", tr, [
              V[3] || (V[3] = z("Category", -1)),
              k(r(ce), {
                "model-value": v.category,
                "aria-label": "Option category",
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                showClear: "",
                options: ["triage", "backlog", ...r(Ro)].map((y) => ({ label: r(Ht)(y), value: y })),
                "onUpdate:modelValue": (y) => v.category = y || void 0
              }, null, 8, ["model-value", "options", "onUpdate:modelValue"])
            ])
          ]),
          s("div", ar, [
            k(r(ee), {
              "aria-label": "Option earlier",
              severity: "secondary",
              size: "small",
              disabled: b === 0,
              onClick: (y) => f(b, b - 1),
              text: ""
            }, {
              default: q(() => [
                k(r(ve), {
                  icon: "tabler:arrow-up",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["disabled", "onClick"]),
            k(r(ee), {
              "aria-label": "Option later",
              severity: "secondary",
              size: "small",
              disabled: b === d.value.length - 1,
              onClick: (y) => f(b, b + 1),
              text: ""
            }, {
              default: q(() => [
                k(r(ve), {
                  icon: "tabler:arrow-down",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["disabled", "onClick"]),
            k(r(ee), {
              label: "Remove",
              "aria-label": "Remove option",
              severity: "secondary",
              text: "",
              size: "small",
              onClick: (y) => d.value.splice(b, 1)
            }, {
              icon: q(() => [
                k(r(ve), {
                  icon: "tabler:trash",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["onClick"])
          ])
        ]))), 128)),
        p.value ? S("", !0) : (n(), h("p", lr, "Each choice needs a unique integration identifier.")),
        s("div", or, [
          k(r(ee), {
            label: "Add option",
            severity: "secondary",
            size: "small",
            onClick: u,
            outlined: ""
          }, {
            icon: q(() => [
              k(r(ve), {
                icon: "tabler:plus",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          })
        ])
      ])), [
        [r(c)]
      ]),
      d.value.length ? S("", !0) : (n(), h("p", ir, "Add the choices people can select for this field."))
    ]));
  }
}), sr = {
  class: "work-stack",
  "aria-label": "Fields editor"
}, rr = { class: "work-form-actions work-wrap" }, dr = { class: "work-stack work-tight" }, ur = {
  key: 0,
  class: "work-settings-card work-muted"
}, cr = { class: "work-muted work-small" }, vr = {
  key: 0,
  class: "work-error work-small",
  role: "alert"
}, fr = { class: "work-settings-grid work-field-properties" }, mr = { class: "work-stack work-tight" }, pr = { class: "work-stack work-tight" }, br = { class: "work-stack work-tight" }, hr = {
  key: 1,
  class: "work-stack work-tight"
}, gr = {
  key: 4,
  class: "work-stack work-tight"
}, yr = {
  key: 5,
  class: "work-stack work-tight"
}, kr = { class: "work-stack work-tight" }, wr = { class: "work-stack work-tight" }, Vr = { class: "work-stack work-tight" }, $r = { class: "work-stack work-tight" }, xr = { class: "work-stack" }, Cr = { class: "work-stack work-tight" }, Sr = { class: "work-stack work-tight" }, Tr = { class: "work-stack work-tight work-field-history" }, Ir = { class: "work-settings-list" }, Dr = { class: "work-settings-row" }, Ur = { class: "work-settings-row" }, Er = { class: "work-stack" }, Ar = /* @__PURE__ */ Ve({
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
    const t = e, l = a, o = G(() => t.draft.fields ?? []), d = B("text"), p = B([]), f = G(() => (t.draft.item_types ?? []).map((x) => ({ value: x.id, label: x.title || Me(x.id) }))), c = G(() => t.draft.item_types?.find((x) => x.id === t.itemType)), i = G(() => o.value.map((x, P) => ({ field: x, index: P })).filter(({ field: x }) => !c.value || c.value.fields.includes(x.code))), u = B(""), m = B({}), V = ii((x, P) => {
      const E = i.value[x]?.index, N = i.value[P]?.index;
      E !== void 0 && N !== void 0 && F(E, N - E);
    });
    function v(x) {
      return (t.draft.item_types ?? []).filter((P) => P.fields.includes(x)).map((P) => P.title || Me(P.id));
    }
    async function b(x) {
      if (!u.value) {
        u.value = x.code;
        try {
          const P = await t.guardRemoval?.("fields", x.code);
          m.value[x.code] = P ?? "", P || Aa(t.draft, "fields", x.code);
        } finally {
          u.value = "";
        }
      }
    }
    const y = Object.entries({ text: "Text", int: "Whole number", dec: "Decimal number", quantity: "Measurement", bool: "Yes or no", time: "Date or time", ref: "Reference", record: "Structured data", option: "Choice", principal: "Person or group", item: "Work item", rank: "Order", rich_text: "Formatted text", formula: "Formula", rollup: "Related item calculation", counter: "Counter" }).map(([x, P]) => ({ value: x, label: P })), T = [{ label: "None", value: "none" }, { label: "Exact matches", value: "key" }, { label: "Numeric ranges", value: "number" }], C = ["int", "dec", "quantity"], U = G(() => new Map(t.installedTypes?.map((x) => [x.id, x]))), W = G(() => [...y, ...(t.installedTypes ?? []).map((x) => ({ value: x.id, label: x.title }))]), L = {};
    function _(x) {
      return x.type && x.type !== "value" ? x.type : x.form ?? "text";
    }
    function j(x) {
      return x.type ? U.value.get(x.type) : void 0;
    }
    function Z(x) {
      const P = j(x)?.config_schema;
      return P && Fo(P).length ? P : void 0;
    }
    function re(x) {
      const P = j(x);
      return !!P?.config_schema || ["dec", "quantity", "ref", "time", "record"].includes(P?.form ?? x.form ?? "") || !!x.config;
    }
    function de(x) {
      const P = j(x), E = P?.form ?? x.form ?? "text";
      return T.filter(({ value: N }) => N === "none" || (!P?.indexes || P.indexes.includes(N)) && E !== "record" && (N !== "number" || C.includes(E) || x.type === "option"));
    }
    function ye(x) {
      x.index && !de(x).some((P) => P.value === x.index) && delete x.index;
    }
    function fe(x, P) {
      const E = U.value.get(P);
      if (E) {
        if (E.id === x.type) return;
        x.type = E.id, x.form = E.form, delete x.options, delete x.config, ye(x);
        return;
      }
      j(x) && delete x.config;
      const N = { option: "text", principal: "ref", item: "ref", rank: "text", rich_text: "text", formula: "int", rollup: "int", counter: "int" };
      N[P] ? (x.type = P, x.form = N[P]) : (delete x.type, x.form = P), P !== "option" ? delete x.options : x.options ??= [], P === "rich_text" && (x.config = { format: "json" }), ye(x);
    }
    function le(x, P) {
      x.form = P, ye(x);
    }
    function A(x, P) {
      const E = { ...x.config };
      P ? E.item_type = P : delete E.item_type, x.config = Object.keys(E).length ? E : void 0;
    }
    function F(x, P) {
      No(o.value, x, P);
      for (const E of t.draft.item_types ?? []) {
        const N = new Set(E.fields);
        E.fields = o.value.filter((g) => N.has(g.code)).map((g) => g.code);
      }
    }
    function R(x, P) {
      try {
        Pi(t.draft, x, P.value), delete m.value[x.code];
      } catch (E) {
        m.value[x.code] = E.message, P.value = x.code;
      }
    }
    function ue() {
      d.value = "text", p.value = c.value ? [c.value.id] : [];
    }
    function H(x) {
      const P = x.normalize("NFKD").replace(/\p{Mark}/gu, "").toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, ""), E = (/^[a-z]/.test(P) ? P : `field_${P || "new"}`).slice(0, 40);
      let N = E, g = 2;
      for (; o.value.some((ne) => ne.code === N); ) {
        const ne = "_" + g++;
        N = E.slice(0, 40 - ne.length) + ne;
      }
      const O = { code: N, title: x, form: "text", cardinality: "one" };
      fe(O, d.value), (t.draft.fields ??= []).push(O);
      for (const ne of t.draft.item_types ?? []) p.value.includes(ne.id) && ne.fields.push(N);
      c.value && !p.value.includes(c.value.id) && l("update:itemType", ""), X.value = N;
    }
    const X = B("");
    return (x, P) => (n(), h("section", sr, [
      s("div", rr, [
        k(r(ce), {
          "model-value": c.value?.id ?? "",
          "aria-label": "Filter fields by item type",
          placeholder: "All item types",
          appendTo: "self",
          optionLabel: "label",
          optionValue: "value",
          options: [{ value: "", label: "All item types" }, ...f.value],
          "onUpdate:modelValue": P[0] || (P[0] = (E) => l("update:itemType", E))
        }, null, 8, ["model-value", "options"]),
        k(Da, {
          action: "Add field",
          label: "Field name",
          maxlength: 255,
          regular: "",
          onOpen: ue,
          onAdd: H
        }, {
          default: q(() => [
            s("label", dr, [
              P[4] || (P[4] = z("Kind", -1)),
              k(r(ce), {
                modelValue: d.value,
                "onUpdate:modelValue": P[1] || (P[1] = (E) => d.value = E),
                "aria-label": "New field kind",
                appendTo: "self",
                options: W.value,
                optionLabel: "label",
                optionValue: "value"
              }, null, 8, ["modelValue", "options"])
            ]),
            f.value.length ? (n(), Y(mt, {
              key: 0,
              label: "Show on item types",
              options: f.value,
              modelValue: p.value,
              "onUpdate:modelValue": P[2] || (P[2] = (E) => p.value = E)
            }, null, 8, ["options", "modelValue"])) : S("", !0)
          ]),
          _: 1
        })
      ]),
      i.value.length ? S("", !0) : (n(), h("p", ur, "No fields here yet. Add a field to capture information.")),
      pt((n(), Y(ll, {
        columns: "fields",
        count: i.value.length
      }, {
        default: q(() => [
          (n(!0), h(Q, null, se(i.value, ({ field: E, index: N }) => (n(), Y(al, {
            "route-section": "fields",
            "route-id": E.code,
            title: r(Xe)(E),
            "initial-open": X.value === E.code,
            kind: j(E)?.title || r(y).find((g) => g.value === _(E))?.label || r(Me)(_(E)),
            key: E.id ?? N,
            class: "work-field-row work-reorder-entry work-stack"
          }, {
            handle: q(() => [
              k(r(ee), {
                type: "button",
                class: "work-reorder-handle work-icon-button",
                "aria-label": "Drag " + r(Xe)(E) + " or use the arrow keys to reorder",
                onKeydown: [
                  qe(Oe((g) => F(N, -1), ["prevent"]), ["up"]),
                  qe(Oe((g) => F(N, 1), ["prevent"]), ["down"])
                ],
                severity: "secondary",
                text: "",
                size: "small"
              }, {
                default: q(() => [
                  k(r(ve), {
                    icon: "tabler:grip-vertical",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["aria-label", "onKeydown"])
            ]),
            flags: q(() => [
              E.track ? (n(), Y(r(at), {
                key: 0,
                class: "kx-tag-sm",
                severity: "secondary",
                value: "Tracked"
              })) : S("", !0),
              E.intervals ? (n(), Y(r(at), {
                key: 1,
                class: "kx-tag-sm",
                severity: "secondary",
                value: "Intervals"
              })) : S("", !0)
            ]),
            usage: q(() => [
              s("span", cr, I(v(E.code).length ? v(E.code).join(", ") : "Unused"), 1)
            ]),
            actions: q(() => [
              k(r(ee), {
                "aria-label": "Move " + r(Xe)(E) + " earlier",
                severity: "secondary",
                disabled: N === 0,
                onClick: (g) => F(N, -1),
                text: "",
                size: "small"
              }, {
                default: q(() => [
                  k(r(ve), {
                    icon: "tabler:arrow-up",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["aria-label", "disabled", "onClick"]),
              k(r(ee), {
                "aria-label": "Move " + r(Xe)(E) + " later",
                severity: "secondary",
                disabled: N === o.value.length - 1,
                onClick: (g) => F(N, 1),
                text: "",
                size: "small"
              }, {
                default: q(() => [
                  k(r(ve), {
                    icon: "tabler:arrow-down",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["aria-label", "disabled", "onClick"])
            ]),
            default: q(() => [
              m.value[E.code] ? (n(), h("p", vr, I(m.value[E.code]), 1)) : S("", !0),
              (n(!0), h(Q, null, se(e.issues?.filter((g) => g.code === E.code) ?? [], (g) => (n(), h("p", {
                key: g.what,
                class: "work-error work-small",
                role: "alert"
              }, I(r(tl)(g)), 1))), 128)),
              s("div", fr, [
                s("label", mr, [
                  P[5] || (P[5] = z("Title", -1)),
                  k(r(Se), {
                    modelValue: E.title,
                    "onUpdate:modelValue": (g) => E.title = g,
                    "aria-label": "Field title",
                    maxlength: "255",
                    placeholder: r(Xe)(E)
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder"])
                ]),
                s("label", pr, [
                  P[6] || (P[6] = z("Kind", -1)),
                  k(r(ce), {
                    "aria-label": "Kind",
                    "model-value": _(E),
                    "onUpdate:modelValue": (g) => fe(E, g),
                    appendTo: "self",
                    options: W.value,
                    optionLabel: "label",
                    optionValue: "value"
                  }, null, 8, ["model-value", "onUpdate:modelValue", "options"])
                ]),
                s("label", br, [
                  P[7] || (P[7] = z("Values allowed", -1)),
                  k(r(ce), {
                    "aria-label": "Values allowed",
                    "model-value": E.cardinality ?? "one",
                    "onUpdate:modelValue": (g) => E.cardinality = g,
                    appendTo: "self",
                    options: [{ label: "One value", value: "one" }, { label: "Multiple unique values", value: "set" }, { label: "Ordered values", value: "list" }],
                    optionLabel: "label",
                    optionValue: "value"
                  }, null, 8, ["model-value", "onUpdate:modelValue"])
                ])
              ]),
              E.type === "item" ? (n(), h("label", hr, [
                P[8] || (P[8] = z("Which items can be referenced? ", -1)),
                k(r(ce), {
                  "model-value": E.config?.item_type ?? "",
                  "aria-label": "Reference target",
                  appendTo: "self",
                  optionLabel: "label",
                  optionValue: "value",
                  options: [{ value: "", label: "Any item type" }, ...f.value],
                  "onUpdate:modelValue": (g) => A(E, g)
                }, null, 8, ["model-value", "options", "onUpdate:modelValue"]),
                P[9] || (P[9] = s("span", { class: "work-muted work-small" }, "A reference stores the selected item as a value. To show a named relationship on both items, use Links.", -1))
              ])) : S("", !0),
              Z(E) ? (n(), Y(Mo, {
                key: E.type,
                schema: Z(E),
                "model-value": E.config ?? L,
                "onUpdate:modelValue": (g) => E.config = g,
                onValidity: (g) => l("validity", "config-" + N, g)
              }, null, 8, ["schema", "model-value", "onUpdate:modelValue", "onValidity"])) : S("", !0),
              E.type === "option" ? (n(), Y(nr, {
                key: 3,
                field: E,
                onValidity: P[3] || (P[3] = (g, O) => l("validity", O, g))
              }, null, 8, ["field"])) : S("", !0),
              E.type === "formula" || E.type === "rollup" ? (n(), h("label", gr, [
                P[10] || (P[10] = z("Result type", -1)),
                k(r(ce), {
                  "model-value": E.form,
                  "onUpdate:modelValue": (g) => le(E, g),
                  "aria-label": "Result type",
                  options: r(y).slice(0, 8),
                  optionLabel: "label",
                  optionValue: "value",
                  appendTo: "self"
                }, null, 8, ["model-value", "onUpdate:modelValue", "options"])
              ])) : S("", !0),
              E.type === "formula" ? (n(), h("label", yr, [
                P[11] || (P[11] = z("Expression", -1)),
                k(r(Se), {
                  modelValue: E.expression,
                  "onUpdate:modelValue": (g) => E.expression = g,
                  "aria-label": "Expression"
                }, null, 8, ["modelValue", "onUpdate:modelValue"])
              ])) : S("", !0),
              E.type === "rollup" ? (n(), h(Q, { key: 6 }, [
                s("label", kr, [
                  P[12] || (P[12] = z("Of", -1)),
                  k(r(Se), {
                    modelValue: E.of,
                    "onUpdate:modelValue": (g) => E.of = g,
                    "aria-label": "Related items"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                s("label", wr, [
                  P[13] || (P[13] = z("Function", -1)),
                  k(r(Se), {
                    modelValue: E.fn,
                    "onUpdate:modelValue": (g) => E.fn = g,
                    "aria-label": "Calculation"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                s("label", Vr, [
                  P[14] || (P[14] = z("Field", -1)),
                  k(r(Se), {
                    modelValue: E.field,
                    "onUpdate:modelValue": (g) => E.field = g,
                    "aria-label": "Calculated field"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                s("label", $r, [
                  P[15] || (P[15] = z("Order by", -1)),
                  k(r(ce), {
                    "model-value": E.by,
                    "aria-label": "Rollup order",
                    options: ["rank", "time"],
                    showClear: "",
                    appendTo: "self",
                    "onUpdate:modelValue": (g) => E.by = g || void 0
                  }, null, 8, ["model-value", "onUpdate:modelValue"])
                ]),
                k(Gl, {
                  modelValue: E.where,
                  "onUpdate:modelValue": (g) => E.where = g,
                  draft: e.draft,
                  "board-id": e.boardId,
                  label: "Include related items when",
                  onValidity: (g) => l("validity", "rollup-" + N, g)
                }, null, 8, ["modelValue", "onUpdate:modelValue", "draft", "board-id", "onValidity"])
              ], 64)) : S("", !0),
              k(Re, {
                class: "work-disclosure",
                label: "Advanced field settings"
              }, {
                default: q(() => [
                  s("div", xr, [
                    s("label", Cr, [
                      P[16] || (P[16] = z("Field identifier for integrations", -1)),
                      k(r(Se), {
                        value: E.code,
                        "aria-label": "Field code",
                        required: "",
                        pattern: "[a-z][a-z0-9_]*",
                        onInput: (g) => R(E, g.target)
                      }, null, 8, ["value", "onInput"])
                    ]),
                    s("label", Sr, [
                      P[17] || (P[17] = z("Allow filters to use", -1)),
                      k(r(ce), {
                        "aria-label": "Allow filters to use",
                        "model-value": E.index ?? "none",
                        "onUpdate:modelValue": (g) => E.index = g,
                        appendTo: "self",
                        options: de(E),
                        optionLabel: "label",
                        optionValue: "value"
                      }, null, 8, ["model-value", "onUpdate:modelValue", "options"])
                    ]),
                    s("section", Tr, [
                      P[20] || (P[20] = s("h4", { class: "work-group-title" }, "History", -1)),
                      s("div", Ir, [
                        s("div", Dr, [
                          P[18] || (P[18] = s("div", { class: "work-row-main" }, [
                            s("strong", null, "Track changes"),
                            s("p", { class: "work-muted work-small" }, "Record each value change in the item history.")
                          ], -1)),
                          k(r(tt), {
                            modelValue: E.track,
                            "onUpdate:modelValue": (g) => E.track = g,
                            "aria-label": "Track changes"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        s("div", Ur, [
                          P[19] || (P[19] = s("div", { class: "work-row-main" }, [
                            s("strong", null, "Track intervals"),
                            s("p", { class: "work-muted work-small" }, "Measure how long each value stays in effect.")
                          ], -1)),
                          k(r(tt), {
                            modelValue: E.intervals,
                            "onUpdate:modelValue": (g) => E.intervals = g,
                            "aria-label": "Track intervals"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ])
                      ])
                    ]),
                    !Z(E) && re(E) ? (n(), Y(Ot, {
                      key: 0,
                      label: "Field configuration",
                      "model-value": E.config,
                      shape: "object",
                      "onUpdate:modelValue": (g) => E.config = g,
                      onValidity: (g) => l("validity", "config-" + N, g)
                    }, null, 8, ["model-value", "onUpdate:modelValue", "onValidity"])) : S("", !0),
                    s("section", Er, [
                      P[21] || (P[21] = s("h4", { class: "work-group-title" }, "Access", -1)),
                      (n(), h(Q, null, se(["read", "write"], (g) => k(qo, {
                        "board-id": e.boardId,
                        key: g,
                        label: g === "read" ? "Who can read" : "Who can edit",
                        "model-value": E.access?.[g],
                        "onUpdate:modelValue": (O) => E.access = { ...E.access, [g]: O },
                        onValidity: (O) => l("validity", "access-" + N + g, O)
                      }, null, 8, ["board-id", "label", "model-value", "onUpdate:modelValue", "onValidity"])), 64))
                    ]),
                    k(r(ee), {
                      label: "Remove field",
                      severity: "danger",
                      text: "",
                      disabled: !!u.value,
                      onClick: (g) => b(E)
                    }, null, 8, ["disabled", "onClick"])
                  ])
                ]),
                _: 2
              }, 1024)
            ]),
            _: 2
          }, 1032, ["route-id", "title", "initial-open", "kind"]))), 128))
        ]),
        _: 1
      }, 8, ["count"])), [
        [r(V)]
      ])
    ]));
  }
}), Pr = {
  class: "work-stack",
  "aria-label": "Item types editor"
}, Or = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, Rr = { class: "work-definition-meta" }, Nr = { class: "work-settings-grid" }, Mr = { class: "work-stack work-tight" }, Fr = { class: "work-stack work-tight" }, Lr = { class: "work-stack" }, Br = { class: "work-stack work-tight" }, zr = {
  key: 0,
  class: "work-row work-wrap"
}, jr = { class: "work-stack work-tight" }, Wr = {
  key: 1,
  class: "work-stack work-tight work-small"
}, qr = {
  key: 0,
  class: "kx-empty"
}, Gr = /* @__PURE__ */ Ve({
  __name: "TypesEditor",
  props: {
    draft: {},
    guardRemoval: { type: Function },
    issues: {}
  },
  setup(e) {
    const a = e, t = G(() => a.draft.item_types ?? []), l = B(""), o = B("");
    function d(v) {
      const b = v.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, ""), y = /^[a-z]/.test(b) ? b : "type_" + (b || "new");
      let T = y.slice(0, 40), C = 2;
      for (; t.value.some((U) => U.id === T); ) {
        const U = "_" + C++;
        T = y.slice(0, 40 - U.length) + U;
      }
      return T;
    }
    function p(v) {
      (a.draft.item_types ??= []).push({ id: d(v), title: v, process: a.draft.processes?.[0]?.id ?? "", fields: [] });
    }
    function f(v, b) {
      const y = v.id;
      v.id = b;
      for (const T of t.value) T.parent_types && (T.parent_types = T.parent_types.map((C) => C === y ? b : C));
    }
    function c(v, b) {
      v.fields = b, v.inherit && (v.inherit = v.inherit.filter((y) => b.includes(y)));
    }
    function i(v) {
      return (v.parent_types ?? []).filter((b) => typeof b == "string");
    }
    function u(v, b, y) {
      v.parent_types = y && b.length ? [...b, !1] : b;
    }
    function m(v) {
      return t.value.filter((b) => b.id !== v.id && b.parent_types?.includes(v.id)).map((b) => b.title || Me(b.id));
    }
    async function V(v) {
      if (!o.value) {
        if (m(v).length) {
          l.value = `${v.title || Me(v.id)} is a parent type for ${m(v).join(", ")}. Remove those parent selections first.`;
          return;
        }
        o.value = v.id, l.value = "";
        try {
          const b = await a.guardRemoval?.("item_types", v.id);
          b ? l.value = b : Aa(a.draft, "item_types", v.id);
        } finally {
          o.value = "";
        }
      }
    }
    return (v, b) => (n(), h("section", Pr, [
      l.value ? (n(), h("p", Or, I(l.value), 1)) : S("", !0),
      k(ll, {
        columns: "types",
        count: t.value.length
      }, {
        default: q(() => [
          (n(!0), h(Q, null, se(t.value, (y, T) => (n(), Y(al, {
            "route-section": "items",
            "route-id": y.id,
            title: y.title || r(Me)(y.id),
            "kind-label": "Workflow",
            kind: e.draft.processes?.find((C) => C.id === y.process)?.name || r(Me)(y.process),
            key: T,
            class: "work-type-card"
          }, {
            usage: q(() => [
              s("span", Rr, [
                k(r(at), {
                  class: "kx-tag-sm",
                  severity: "secondary"
                }, {
                  default: q(() => [
                    z(I(y.fields.length) + " " + I(y.fields.length === 1 ? "field" : "fields"), 1)
                  ]),
                  _: 2
                }, 1024),
                m(y).length ? (n(), Y(r(at), {
                  key: 0,
                  class: "kx-tag-sm",
                  severity: "secondary"
                }, {
                  default: q(() => [
                    z("Parent of " + I(m(y).join(", ")), 1)
                  ]),
                  _: 2
                }, 1024)) : S("", !0)
              ])
            ]),
            default: q(() => [
              (n(!0), h(Q, null, se(e.issues?.filter((C) => C.code === "item_type " + y.id) ?? [], (C) => (n(), h("p", {
                key: C.what,
                class: "work-error work-small",
                role: "alert"
              }, I(r(tl)(C)), 1))), 128)),
              s("div", Nr, [
                s("label", Mr, [
                  b[0] || (b[0] = z("Title", -1)),
                  k(r(Se), {
                    modelValue: y.title,
                    "onUpdate:modelValue": (C) => y.title = C,
                    placeholder: r(Me)(y.id)
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder"])
                ]),
                s("label", Fr, [
                  b[1] || (b[1] = z("Workflow", -1)),
                  k(r(ce), {
                    modelValue: y.process,
                    "onUpdate:modelValue": (C) => y.process = C,
                    "aria-label": "Workflow",
                    required: "",
                    appendTo: "self",
                    optionLabel: "label",
                    optionValue: "value",
                    optionDisabled: "disabled",
                    options: [...(e.draft.processes ?? []).map((C) => ({ label: C.name || r(Me)(C.id), value: C.id, disabled: !1 }))]
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                ])
              ]),
              k(mt, {
                label: "Fields",
                options: (e.draft.fields ?? []).map((C) => ({ value: C.code, label: r(Xe)(C) })),
                "model-value": y.fields,
                "onUpdate:modelValue": (C) => c(y, C)
              }, null, 8, ["options", "model-value", "onUpdate:modelValue"]),
              k(Re, {
                class: "work-disclosure",
                label: "Advanced item type settings"
              }, {
                default: q(() => [
                  s("div", Lr, [
                    s("label", Br, [
                      b[2] || (b[2] = z("Identifier", -1)),
                      k(r(Se), {
                        value: y.id,
                        onChange: (C) => f(y, C.target.value),
                        required: "",
                        pattern: "[a-z][a-z0-9_]*"
                      }, null, 8, ["value", "onChange"])
                    ]),
                    b[6] || (b[6] = z()),
                    k(mt, {
                      label: "Parent types",
                      options: t.value.map((C) => ({ value: C.id, label: C.title || r(Me)(C.id) })),
                      "model-value": i(y),
                      "onUpdate:modelValue": (C) => u(y, C, !!y.parent_types?.includes(!1))
                    }, null, 8, ["options", "model-value", "onUpdate:modelValue"]),
                    i(y).length ? (n(), h("label", zr, [
                      k(r(tt), {
                        "model-value": !!y.parent_types?.includes(!1),
                        "aria-label": "Allow top-level items",
                        "onUpdate:modelValue": (C) => u(y, i(y), C)
                      }, null, 8, ["model-value", "onUpdate:modelValue"]),
                      b[3] || (b[3] = z("Allow top-level items", -1))
                    ])) : S("", !0),
                    s("div", jr, [
                      k(mt, {
                        label: "Inherit from parent",
                        options: y.fields.map((C) => ({ value: C, label: r(Xe)(e.draft.fields?.find((U) => U.code === C) ?? { code: C }) })),
                        modelValue: y.inherit,
                        "onUpdate:modelValue": (C) => y.inherit = C
                      }, null, 8, ["options", "modelValue", "onUpdate:modelValue"]),
                      b[4] || (b[4] = s("p", { class: "work-muted work-small" }, "These fields resolve from the parent when this item has no own value.", -1))
                    ]),
                    i(y).length ? (n(), h("label", Wr, [
                      b[5] || (b[5] = z("When the parent moves", -1)),
                      k(r(ce), {
                        modelValue: y.move_children,
                        "onUpdate:modelValue": (C) => y.move_children = C,
                        "aria-label": "When the parent moves",
                        appendTo: "self",
                        optionLabel: "label",
                        optionValue: "value",
                        optionDisabled: "disabled",
                        options: [{ label: "Default", value: void 0, disabled: !1 }, { label: "Move children", value: "move", disabled: !1 }, { label: "Refuse while children exist", value: "refuse", disabled: !1 }]
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ])) : S("", !0),
                    k(r(ee), {
                      label: "Remove type",
                      severity: "danger",
                      text: "",
                      disabled: !!o.value,
                      onClick: (C) => V(y)
                    }, null, 8, ["disabled", "onClick"])
                  ])
                ]),
                _: 2
              }, 1024)
            ]),
            _: 2
          }, 1032, ["route-id", "title", "kind"]))), 128)),
          t.value.length ? S("", !0) : (n(), h("p", qr, "Add a type for the work people create, such as a delivery task or customer request.")),
          k(Da, {
            action: "Add item type",
            label: "Item type name",
            onAdd: p
          })
        ]),
        _: 1
      }, 8, ["count"])
    ]));
  }
}), Kr = ".work-process-canvas>svg{height:480px;width:100%}.work-process-canvas:focus-visible{outline:var(--p-focus-ring-width) var(--p-focus-ring-style) var(--p-focus-ring-color);outline-offset:var(--p-focus-ring-offset)}.work-state-card{fill:var(--p-content-background);stroke:var(--p-content-border-color);stroke-width:1.5}.work-graph-node.work-selected .work-state-card{stroke:var(--p-primary-color);stroke-width:2.5;fill:color-mix(in srgb,var(--p-primary-color) 6%,var(--p-content-background))}.work-graph-node:focus-visible .work-state-card{stroke:var(--p-focus-ring-color);stroke-width:var(--p-focus-ring-width)}.work-process-canvas .work-edge-label{font-size:12px;fill:var(--p-text-color)}.work-process-canvas .work-edge-label-bg{fill:var(--p-content-background);stroke:var(--p-content-border-color);stroke-width:1}.work-edge-line{stroke:var(--p-primary-color);stroke-width:1.5}.work-edge-return .work-edge-line{stroke:var(--p-text-muted-color);stroke-dasharray:5 4}.work-graph-arrow{fill:context-stroke}.work-lane-line{fill:none;stroke:var(--p-text-muted-color);stroke-width:1.5;stroke-dasharray:2 4}.work-node-connector{fill:var(--p-content-background);stroke:var(--p-primary-color);stroke-width:1.5}.work-node-connector:hover,.work-node-connector:focus-visible,.work-node-connector[aria-pressed=true]{fill:var(--p-primary-color)}.work-any-transition:focus-visible text,.work-any-transition[aria-pressed=true] text{fill:var(--p-primary-color);text-decoration:underline}.work-process-legend{position:static;flex-wrap:wrap;padding:10px 16px;border-top:1px solid var(--p-content-border-color);background:var(--p-content-background)}@media(max-width:700px){.work-process-canvas>svg{height:420px}}.work-process-more{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:8px;padding:8px 16px;border-top:1px solid var(--p-content-border-color);background:var(--p-content-background);color:var(--p-text-muted-color);font-size:12px}.work-process-canvas .work-graph-edge.work-selected .work-edge-label-bg{fill:var(--p-primary-color);stroke:var(--p-primary-color)}.work-process-canvas .work-graph-edge.work-selected .work-edge-label{fill:var(--p-primary-contrast-color)}", Vo = /* @__PURE__ */ new WeakSet();
function Hr(e) {
  const a = e.getRootNode();
  if (a instanceof ShadowRoot && !Vo.has(a)) {
    const t = e.ownerDocument.createElement("style");
    t.textContent = Kr, a.append(t), Vo.add(a);
  }
}
const ni = 0.8;
function Yr(e, a, t) {
  const l = Math.min(1, a.width / e.width, a.height / e.height);
  if (l >= ni) return { zoom: l, pan: { x: (e.width - a.width / l) / 2, y: (e.height - a.height / l) / 2 } };
  const o = e.nodes.find((p) => p.state.id === t) ?? e.nodes[0], d = Math.min(1, a.width / ((o?.width ?? 190) + 64));
  return { zoom: d, pan: o ? { x: e.direction === "TB" ? o.x - a.width / d / 2 : o.x - o.width / 2 - 32, y: e.direction === "TB" ? o.y - o.height / 2 - 32 : o.y - a.height / d / 2 } : { x: 0, y: 0 } };
}
const Xr = ["onKeydown"], Jr = {
  key: 0,
  class: "work-process-instruction",
  role: "status"
}, Zr = ["viewBox"], Qr = ["id"], _r = ["d", "marker-end"], ed = ["aria-label", "aria-pressed", "aria-keyshortcuts", "onKeydown", "onFocus", "onClick"], td = ["d"], ad = ["d", "marker-end"], ld = ["x", "y", "width", "height"], od = ["x", "y"], id = ["x", "dy"], nd = ["aria-label", "aria-pressed", "onClick", "onKeydown", "onFocus", "onPointerup"], sd = ["x", "y", "width", "height"], rd = ["cx", "cy"], dd = ["x", "y"], ud = ["x", "dy"], cd = ["x", "y"], vd = ["x", "dy"], fd = {
  key: 0,
  class: "work-limit-text"
}, md = ["aria-label", "aria-pressed", "aria-keyshortcuts", "onFocus", "onKeydown", "onClick"], pd = ["x", "y"], bd = ["x", "dy"], hd = ["cx", "cy", "aria-label", "aria-pressed", "onFocus", "onPointerdown", "onClick", "onKeydown"], gd = ["d"], yd = {
  key: 1,
  class: "work-process-more",
  role: "status"
}, kd = { class: "work-process-legend" }, wd = /* @__PURE__ */ Ve({
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
    const l = e, o = t, d = Kt().replace(/:/g, "_"), p = B(""), f = B(), c = B();
    let i;
    const u = B(900), m = B(!1), V = G(() => u.value < 700 ? 420 : 480), v = G(() => Qi(l.process, l.draft, {
      width: u.value,
      height: V.value,
      direction: l.fitOnOpen ? "TB" : void 0
    })), b = B(1), y = B({ x: 0, y: 0 }), T = B({ x: 0, y: 0 }), C = G(() => {
      const w = Math.min(1, u.value / v.value.width);
      return l.fitOnOpen ? Math.max(ni, w) : w;
    }), U = G(() => ({
      width: u.value,
      height: m.value ? Math.max(V.value, Math.ceil(v.value.height * C.value)) : V.value
    })), W = G(() => v.value.nodes.filter((w) => w.x - w.width / 2 >= y.value.x && w.x + w.width / 2 <= y.value.x + U.value.width / b.value && w.y - w.height / 2 >= y.value.y && w.y + w.height / 2 <= y.value.y + U.value.height / b.value).length);
    function L() {
      m.value = !1;
      const w = Yr(v.value, U.value, l.process.initial);
      b.value = w.zoom, y.value = w.pan;
    }
    const _ = G(() => `${y.value.x} ${y.value.y} ${U.value.width / b.value} ${U.value.height / b.value}`), j = G(() => v.value.nodes.find((w) => w.state.id === p.value));
    function Z() {
      m.value = !0, b.value = C.value;
      const w = U.value.width / b.value, D = v.value.nodes.find(($) => $.state.id === l.process.initial);
      y.value = {
        x: v.value.width > w && D ? D.x - w / 2 : (v.value.width - w) / 2,
        y: 0
      };
    }
    function re(w) {
      l.fitOnOpen && (m.value = !1);
      const D = Math.max(0.02, Math.min(3, b.value * w)), $ = 1 / b.value - 1 / D;
      y.value = { x: y.value.x + U.value.width * $ / 2, y: y.value.y + U.value.height * $ / 2 }, b.value = D;
    }
    function de(w) {
      const D = U.value.width / b.value, $ = U.value.height / b.value;
      (w.x - w.width / 2 < y.value.x || w.x + w.width / 2 > y.value.x + D || w.y - w.height / 2 < y.value.y || w.y + w.height / 2 > y.value.y + $) && (y.value = { x: w.x - D / 2, y: w.y - $ / 2 });
    }
    function ye() {
      const w = v.value.nodes.find((D) => D.state === l.selectedState) ?? v.value.edges.find((D) => D.transition === l.selectedTransition);
      if (!w) {
        l.fitOnOpen && m.value && Z();
        return;
      }
      de(w);
    }
    Ie([v, () => l.selectedState, () => l.selectedTransition], ye, { flush: "post" });
    function fe() {
      l.fitOnOpen ? Z() : L();
    }
    Ie(() => l.process.id, () => {
      x(), fe();
    }, { flush: "post" });
    function le(w) {
      if (w.target !== f.value) return;
      (w.key === "+" || w.key === "=") && (w.preventDefault(), re(1.2)), w.key === "-" && (w.preventDefault(), re(1 / 1.2)), w.key === "0" && (w.preventDefault(), Z());
      const D = 60 / b.value;
      w.key.startsWith("Arrow") && (w.preventDefault(), y.value = { x: y.value.x + (w.key === "ArrowRight" ? D : w.key === "ArrowLeft" ? -D : 0), y: y.value.y + (w.key === "ArrowDown" ? D : w.key === "ArrowUp" ? -D : 0) });
    }
    function A(w, D) {
      const $ = D.currentTarget;
      if (!p.value) o("state", w, $);
      else if (p.value !== w.id) {
        const oe = p.value;
        p.value = "", o("connect", oe, w.id, $);
      }
    }
    function F(w) {
      p.value = w.state.id, T.value = { x: v.value.direction === "TB" ? w.x : w.x + w.width / 2, y: v.value.direction === "TB" ? w.y + w.height / 2 : w.y };
    }
    function R(w, D) {
      if (w.pointerType === "touch" || w.button !== 0) return;
      i = w.pointerId, F(D);
      const $ = w.currentTarget;
      $.hasPointerCapture?.(w.pointerId) && $.releasePointerCapture(w.pointerId);
    }
    function ue(w, D) {
      i === w.pointerId && (i = void 0, !(!p.value || p.value === D.id) && A(D, w));
    }
    function H(w, D) {
      if ((w.key === "Enter" || w.key === " ") && (w.preventDefault(), A(D, w)), ["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp"].includes(w.key)) {
        w.preventDefault();
        const $ = Array.from(c.value?.querySelectorAll(".work-graph-node") ?? []), oe = v.value.nodes.findIndex(($e) => $e.state === D), me = ["ArrowRight", "ArrowDown"].includes(w.key) ? 1 : -1;
        $[(oe + me + $.length) % $.length]?.focus();
      }
    }
    function X(w, D) {
      l.selectedTransition === D && o("removeTransition", w);
    }
    function x() {
      p.value = "", i = void 0, E.clear(), N = 0;
    }
    function P() {
      x(), o("clear");
    }
    const E = /* @__PURE__ */ new Map();
    let N = 0;
    function g(w) {
      if (!w.target.closest('[role="button"]') && (E.set(w.pointerId, { x: w.clientX, y: w.clientY }), f.value?.setPointerCapture?.(w.pointerId), E.size === 2)) {
        const [D, $] = [...E.values()];
        N = Math.hypot(D.x - $.x, D.y - $.y);
      }
    }
    function O(w) {
      const D = c.value?.getBoundingClientRect();
      if (!D?.width) return;
      if (i === w.pointerId && p.value) {
        T.value = { x: y.value.x + (w.clientX - D.left) * U.value.width / b.value / D.width, y: y.value.y + (w.clientY - D.top) * U.value.height / b.value / D.height };
        return;
      }
      const $ = E.get(w.pointerId);
      if ($)
        if (E.set(w.pointerId, { x: w.clientX, y: w.clientY }), E.size === 2) {
          const [oe, me] = [...E.values()], $e = Math.hypot(oe.x - me.x, oe.y - me.y);
          N && re($e / N), N = $e;
        } else y.value = { x: y.value.x - (w.clientX - $.x) * U.value.width / b.value / D.width, y: y.value.y - (w.clientY - $.y) * U.value.height / b.value / D.height };
    }
    function ne(w) {
      i === w.pointerId && (p.value = "", i = void 0);
    }
    function ie(w) {
      E.delete(w.pointerId), N = 0, ne(w);
    }
    function we(w) {
      w.ctrlKey && (w.preventDefault(), re(Math.exp(-w.deltaY * 0.01)));
    }
    let Te;
    Ea(() => {
      if (f.value && Hr(f.value), typeof ResizeObserver < "u" && c.value) {
        let w = !0;
        Te = new ResizeObserver(() => {
          const D = c.value?.getBoundingClientRect();
          if (!D?.width || !D.height) return;
          const $ = U.value.width;
          u.value = D.width, (w || Math.abs(D.width - $) > 1) && (w ? fe() : m.value ? Z() : L(), w = !1), ye();
        }), Te.observe(c.value);
      }
    }), Ct(() => Te?.disconnect()), a({ fit: Z, focus: () => f.value?.focus(), zoomIn: () => re(1.2), zoomOut: () => re(1 / 1.2) });
    function J(w) {
      return w.category === "completed" ? "check" : w.category === "canceled" ? "x" : w.id === l.process.initial ? "arrow-bar-to-right" : { gate: "shield-check", automated: "bolt", parallel: "arrows-split" }[w.kind ?? ""] ?? "user";
    }
    return (w, D) => (n(), h("section", {
      ref_key: "canvas",
      ref: f,
      class: ft(["work-process-canvas", { "work-process-scrollable": e.fitOnOpen && m.value }]),
      "aria-label": "Process map",
      tabindex: "0",
      onKeydown: [
        le,
        qe(Oe(P, ["stop"]), ["esc"])
      ],
      onPointerdown: g,
      onPointermove: O,
      onPointerup: ie,
      onPointerleave: ne,
      onPointercancel: x,
      onWheel: we
    }, [
      p.value ? (n(), h("p", Jr, "Choose the next stop. Escape cancels.")) : S("", !0),
      (n(), h("svg", {
        ref_key: "svg",
        ref: c,
        style: Ci({ height: U.value.height + "px" }),
        viewBox: _.value,
        role: "group",
        "aria-label": "States and transitions"
      }, [
        s("defs", null, [
          s("marker", {
            id: r(d) + "-arrow",
            viewBox: "0 0 8 8",
            refX: "7",
            refY: "4",
            markerWidth: "6",
            markerHeight: "6",
            orient: "auto"
          }, [...D[1] || (D[1] = [
            s("path", {
              d: "M0 0 L8 4 L0 8 z",
              class: "work-graph-arrow"
            }, null, -1)
          ])], 8, Qr)
        ]),
        (n(!0), h(Q, null, se(v.value.parallels, ($) => (n(), h("path", {
          key: $.key,
          d: $.path,
          class: "work-lane-line",
          "marker-end": `url(#${r(d)}-arrow)`
        }, [
          s("title", null, "Parallel lane from " + I(r(ge)($.state)), 1)
        ], 8, _r))), 128)),
        (n(!0), h(Q, null, se(v.value.edges, ($) => (n(), h("g", {
          key: $.key,
          class: ft(["work-graph-edge", ["work-edge-" + $.type, { "work-selected": e.selectedTransition === $.transition }]]),
          role: "button",
          tabindex: "0",
          "aria-label": "Edit transition " + r(Ge)($.transition),
          "aria-pressed": e.selectedTransition === $.transition,
          "aria-keyshortcuts": e.selectedTransition === $.transition ? "Delete Backspace" : void 0,
          onKeydown: [
            qe((oe) => X(oe, $.transition), ["delete"]),
            qe((oe) => X(oe, $.transition), ["backspace"]),
            qe(Oe((oe) => o("transition", $.transition, oe.currentTarget), ["prevent"]), ["enter"]),
            qe(Oe((oe) => o("transition", $.transition, oe.currentTarget), ["prevent"]), ["space"])
          ],
          onFocus: (oe) => de($),
          onClick: (oe) => o("transition", $.transition, oe.currentTarget)
        }, [
          s("path", {
            d: $.path,
            class: "work-edge-hit"
          }, null, 8, td),
          s("path", {
            d: $.path,
            class: "work-edge-line",
            "marker-end": `url(#${r(d)}-arrow)`
          }, null, 8, ad),
          s("rect", {
            x: $.x - $.width / 2,
            y: $.y - $.height / 2,
            width: $.width,
            height: $.height,
            rx: "6",
            class: "work-edge-label-bg"
          }, null, 8, ld),
          s("text", {
            x: $.x,
            y: $.y - ($.lines.length - 1) * 8 + 4,
            class: "work-edge-label",
            "text-anchor": "middle"
          }, [
            (n(!0), h(Q, null, se($.lines, (oe, me) => (n(), h("tspan", {
              key: me,
              x: $.x,
              dy: me ? 16 : 0
            }, I(oe), 9, id))), 128))
          ], 8, od)
        ], 42, ed))), 128)),
        (n(!0), h(Q, null, se(v.value.nodes, ($) => (n(), h("g", {
          key: $.state.id,
          class: ft(["work-graph-node", ["work-stop-" + $.state.category, { "work-selected": e.selectedState === $.state }]]),
          role: "button",
          tabindex: "0",
          "aria-label": "Edit state " + r(ge)($.state),
          "aria-pressed": e.selectedState === $.state,
          onClick: (oe) => A($.state, oe),
          onKeydown: (oe) => H(oe, $.state),
          onFocus: (oe) => de($),
          onPointerup: (oe) => ue(oe, $.state)
        }, [
          s("rect", {
            x: $.x - $.width / 2,
            y: $.y - $.height / 2,
            width: $.width,
            height: $.height,
            rx: "10",
            class: "work-state-card"
          }, null, 8, sd),
          s("circle", {
            cx: $.x - $.width / 2 + 22,
            cy: $.y - $.height / 2 + 25,
            r: "10",
            class: "work-stop-ring"
          }, null, 8, rd),
          k(r(ve), {
            icon: "tabler:" + J($.state),
            x: $.x - $.width / 2 + 15,
            y: $.y - $.height / 2 + 18,
            width: "14",
            height: "14",
            class: "work-stop-icon",
            "aria-hidden": "true"
          }, null, 8, ["icon", "x", "y"]),
          s("text", {
            x: $.x - $.width / 2 + 42,
            y: $.y - $.height / 2 + 29,
            class: "work-node-name"
          }, [
            (n(!0), h(Q, null, se($.title, (oe, me) => (n(), h("tspan", {
              key: me,
              x: $.x - $.width / 2 + 42,
              dy: me ? 18 : 0
            }, I(oe), 9, ud))), 128))
          ], 8, dd),
          s("text", {
            x: $.x - $.width / 2 + 16,
            y: $.y - $.height / 2 + 33 + $.title.length * 18,
            class: "work-node-meta"
          }, [
            (n(!0), h(Q, null, se($.caption, (oe, me) => (n(), h("tspan", {
              key: me,
              x: $.x - $.width / 2 + 16,
              dy: me ? 16 : 0
            }, I(oe), 9, vd))), 128)),
            e.draft.policy?.wip?.[$.state.id] ? (n(), h("tspan", fd, " · limit " + I(e.draft.policy.wip[$.state.id].limit), 1)) : S("", !0)
          ], 8, cd),
          (n(!0), h(Q, null, se($.badges, (oe, me) => (n(), h("g", {
            key: oe.id,
            class: "work-any-transition",
            role: "button",
            tabindex: "0",
            "aria-label": "Edit transition " + r(Ge)(oe),
            "aria-pressed": e.selectedTransition === oe,
            "aria-keyshortcuts": e.selectedTransition === oe ? "Delete Backspace" : void 0,
            onFocus: ($e) => de($),
            onKeydown: [
              qe(($e) => X($e, oe), ["delete"]),
              qe(($e) => X($e, oe), ["backspace"]),
              qe(Oe(($e) => o("transition", oe, $e.currentTarget), ["stop", "prevent"]), ["enter"]),
              qe(Oe(($e) => o("transition", oe, $e.currentTarget), ["stop", "prevent"]), ["space"])
            ],
            onClick: Oe(($e) => o("transition", oe, $e.currentTarget), ["stop"])
          }, [
            s("text", {
              x: $.x - $.width / 2 + 16,
              y: $.y - $.height / 2 + 33 + $.title.length * 18 + $.caption.length * 16 + $.badges.slice(0, me).reduce(($e, De) => $e + r(ia)(r(Ge)(De) + " works from any state").length * 18, 0),
              class: "work-node-meta"
            }, [
              (n(!0), h(Q, null, se(r(ia)(r(Ge)(oe) + " works from any state"), ($e, De) => (n(), h("tspan", {
                key: De,
                x: $.x - $.width / 2 + 16,
                dy: De ? 18 : 0
              }, I($e), 9, bd))), 128))
            ], 8, pd)
          ], 40, md))), 128)),
          ["completed", "canceled"].includes($.state.category) ? S("", !0) : (n(), h("circle", {
            key: 0,
            cx: v.value.direction === "TB" ? $.x : $.x + $.width / 2,
            cy: v.value.direction === "TB" ? $.y + $.height / 2 : $.y,
            r: "9",
            class: "work-node-connector",
            role: "button",
            tabindex: "0",
            "aria-label": "Connect from " + r(ge)($.state),
            "aria-pressed": p.value === $.state.id,
            onFocus: (oe) => de($),
            onPointerdown: Oe((oe) => R(oe, $), ["stop"]),
            onClick: Oe((oe) => F($), ["stop"]),
            onKeydown: [
              qe(Oe((oe) => F($), ["stop", "prevent"]), ["enter"]),
              qe(Oe((oe) => F($), ["stop", "prevent"]), ["space"])
            ]
          }, null, 40, hd))
        ], 42, nd))), 128)),
        j.value ? (n(), h("path", {
          key: 0,
          d: `M ${v.value.direction === "TB" ? j.value.x : j.value.x + j.value.width / 2} ${v.value.direction === "TB" ? j.value.y + j.value.height / 2 : j.value.y} L ${T.value.x} ${T.value.y}`,
          class: "work-connect-ghost"
        }, null, 8, gd)) : S("", !0)
      ], 12, Zr)),
      W.value < e.process.states.length ? (n(), h("div", yd, [
        s("span", null, I(W.value) + " of " + I(e.process.states.length) + " states in view · Pan to see more", 1),
        m.value ? S("", !0) : (n(), Y(r(ee), {
          key: 0,
          label: "Fit map",
          size: "small",
          text: "",
          onClick: D[0] || (D[0] = ($) => Z())
        }))
      ])) : S("", !0),
      s("div", kd, [
        s("span", null, I(e.process.states.length) + " states · " + I(Math.round(b.value * 100)) + "%", 1),
        D[2] || (D[2] = s("span", null, [
          s("i"),
          z("Transition")
        ], -1)),
        D[3] || (D[3] = s("span", null, [
          s("i", { class: "work-return-key" }),
          z("Return / loop")
        ], -1)),
        D[4] || (D[4] = s("span", null, "Drag to pan · Ctrl + scroll to zoom · Fit to reset the view", -1))
      ])
    ], 42, Xr));
  }
}), Vd = {
  class: "work-process-list work-stack",
  "aria-label": "Process list"
}, $d = { class: "work-table-scroll" }, xd = {
  class: "work-settings-table work-process-table",
  role: "table",
  "aria-label": "States"
}, Cd = { role: "rowgroup" }, Sd = ["aria-selected"], Td = { role: "cell" }, Id = {
  key: 0,
  class: "work-muted work-small"
}, Dd = { role: "cell" }, Ud = { role: "cell" }, Ed = {
  role: "cell",
  class: "work-process-list-actions"
}, Ad = { class: "work-table-scroll" }, Pd = {
  class: "work-settings-table work-process-table",
  role: "table",
  "aria-label": "Transitions"
}, Od = { role: "rowgroup" }, Rd = ["aria-selected"], Nd = { role: "cell" }, Md = {
  key: 0,
  class: "work-muted"
}, Fd = { role: "cell" }, Ld = { role: "cell" }, Bd = {
  role: "cell",
  class: "work-process-list-actions"
}, zd = /* @__PURE__ */ Ve({
  __name: "ProcessList",
  props: {
    process: {},
    selectedState: {},
    selectedTransition: {},
    counts: {}
  },
  emits: ["state", "transition", "removeState", "removeTransition"],
  setup(e) {
    return (a, t) => (n(), h("section", Vd, [
      t[6] || (t[6] = s("h3", null, "States", -1)),
      s("div", $d, [
        s("table", xd, [
          t[2] || (t[2] = s("thead", { role: "rowgroup" }, [
            s("tr", { role: "row" }, [
              s("th", {
                role: "columnheader",
                scope: "col"
              }, "Name"),
              s("th", {
                role: "columnheader",
                scope: "col"
              }, "Phase"),
              s("th", {
                role: "columnheader",
                scope: "col"
              }, "Kind"),
              s("th", {
                role: "columnheader",
                scope: "col"
              }, "Actions")
            ])
          ], -1)),
          s("tbody", Cd, [
            (n(!0), h(Q, null, se(e.process.states, (l) => (n(), h("tr", {
              key: l.id,
              "aria-selected": e.selectedState === l,
              role: "row"
            }, [
              s("td", Td, [
                k(r(Se), {
                  modelValue: l.name,
                  "onUpdate:modelValue": (o) => l.name = o,
                  "aria-label": "Name of " + r(ge)(l)
                }, null, 8, ["modelValue", "onUpdate:modelValue", "aria-label"]),
                e.counts ? (n(), h("p", Id, I(e.counts[l.id] ?? 0) + " here", 1)) : S("", !0)
              ]),
              s("td", Dd, [
                t[0] || (t[0] = s("span", {
                  class: "work-process-cell-label",
                  "aria-hidden": "true"
                }, "Phase", -1)),
                z(I(r(Ht)(l.category)), 1)
              ]),
              s("td", Ud, [
                t[1] || (t[1] = s("span", {
                  class: "work-process-cell-label",
                  "aria-hidden": "true"
                }, "Kind", -1)),
                k(r(at), { severity: "secondary" }, {
                  default: q(() => [
                    z(I(r(Xa)(l.kind)), 1)
                  ]),
                  _: 2
                }, 1024)
              ]),
              s("td", Ed, [
                k(r(ee), {
                  size: "small",
                  text: "",
                  severity: "secondary",
                  "aria-label": "Edit state " + r(ge)(l),
                  onClick: (o) => a.$emit("state", l, o.currentTarget)
                }, {
                  default: q(() => [
                    k(r(ve), { icon: "tabler:pencil" })
                  ]),
                  _: 1
                }, 8, ["aria-label", "onClick"]),
                k(r(ee), {
                  size: "small",
                  text: "",
                  severity: "danger",
                  "aria-label": "Remove state " + r(ge)(l),
                  onClick: (o) => a.$emit("removeState", l)
                }, {
                  default: q(() => [
                    k(r(ve), { icon: "tabler:trash" })
                  ]),
                  _: 1
                }, 8, ["aria-label", "onClick"])
              ])
            ], 8, Sd))), 128))
          ])
        ])
      ]),
      t[7] || (t[7] = s("h3", null, "Transitions", -1)),
      s("div", Ad, [
        s("table", Pd, [
          t[5] || (t[5] = s("thead", { role: "rowgroup" }, [
            s("tr", { role: "row" }, [
              s("th", {
                role: "columnheader",
                scope: "col"
              }, "Name"),
              s("th", {
                role: "columnheader",
                scope: "col"
              }, "From"),
              s("th", {
                role: "columnheader",
                scope: "col"
              }, "To"),
              s("th", {
                role: "columnheader",
                scope: "col"
              }, "Actions")
            ])
          ], -1)),
          s("tbody", Od, [
            (n(!0), h(Q, null, se(e.process.transitions ?? [], (l) => (n(), h("tr", {
              key: l.id,
              "aria-selected": e.selectedTransition === l,
              role: "row"
            }, [
              s("td", Nd, [
                k(r(Se), {
                  modelValue: l.name,
                  "onUpdate:modelValue": (o) => l.name = o,
                  placeholder: r(Ge)(l),
                  "aria-label": "Name of " + r(Ge)(l)
                }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder", "aria-label"]),
                l.when || l.require?.length || l.guards?.length ? (n(), h("p", Md, "Has requirements")) : S("", !0)
              ]),
              s("td", Fd, [
                t[3] || (t[3] = s("span", {
                  class: "work-process-cell-label",
                  "aria-hidden": "true"
                }, "From", -1)),
                z(" " + I(l.from === "any" ? "Any state" : l.from.map((o) => r(ge)(e.process.states.find((d) => d.id === o))).join(", ")), 1)
              ]),
              s("td", Ld, [
                t[4] || (t[4] = s("span", {
                  class: "work-process-cell-label",
                  "aria-hidden": "true"
                }, "To", -1)),
                z(I(r(ge)(e.process.states.find((o) => o.id === l.to))), 1)
              ]),
              s("td", Bd, [
                k(r(ee), {
                  size: "small",
                  text: "",
                  severity: "secondary",
                  "aria-label": "Edit transition " + r(Ge)(l),
                  onClick: (o) => a.$emit("transition", l, o.currentTarget)
                }, {
                  default: q(() => [
                    k(r(ve), { icon: "tabler:pencil" })
                  ]),
                  _: 1
                }, 8, ["aria-label", "onClick"]),
                k(r(ee), {
                  size: "small",
                  text: "",
                  severity: "danger",
                  "aria-label": "Remove transition " + r(Ge)(l),
                  onClick: (o) => a.$emit("removeTransition", l)
                }, {
                  default: q(() => [
                    k(r(ve), { icon: "tabler:trash" })
                  ]),
                  _: 1
                }, 8, ["aria-label", "onClick"])
              ])
            ], 8, Rd))), 128))
          ])
        ])
      ])
    ]));
  }
}), jd = { class: "work-stack work-transition-settings" }, Wd = { class: "work-stack work-tight" }, qd = { class: "work-row" }, Gd = { key: 0 }, Kd = { class: "work-stack" }, Hd = { class: "work-row" }, Yd = { class: "work-row" }, Xd = { class: "work-stack work-tight" }, Jd = { class: "work-row" }, Zd = { class: "work-stack work-tight" }, Qd = { class: "work-stack work-tight" }, _d = /* @__PURE__ */ Ve({
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
    function d(p, f) {
      const c = t.transition.set?.[p];
      !c || !t.transition.set || (t.transition.set[p] = { field: c.field, ...f === "clear" ? { clear: !0 } : f === "copy" ? { copy: "" } : { value: "" } });
    }
    return (p, f) => (n(), h("div", jd, [
      s("label", Wd, [
        f[15] || (f[15] = z("To state", -1)),
        k(r(ce), {
          modelValue: e.transition.to,
          "onUpdate:modelValue": f[0] || (f[0] = (c) => e.transition.to = c),
          "aria-label": "To state",
          appendTo: "self",
          optionLabel: "label",
          optionValue: "value",
          options: e.process.states.map((c) => ({ label: r(ge)(c), value: c.id }))
        }, null, 8, ["modelValue", "options"])
      ]),
      s("label", qd, [
        f[16] || (f[16] = s("span", { class: "work-spacer" }, "Works from any state", -1)),
        k(r(tt), {
          "model-value": e.transition.from === "any",
          "aria-label": "Works from any state",
          "onUpdate:modelValue": f[1] || (f[1] = (c) => e.transition.from = c ? "any" : [])
        }, null, 8, ["model-value"])
      ]),
      e.transition.from !== "any" ? (n(), Y(mt, {
        key: 0,
        label: "From states",
        options: e.process.states.map((c) => ({ value: c.id, label: r(ge)(c) })),
        modelValue: e.transition.from,
        "onUpdate:modelValue": f[2] || (f[2] = (c) => e.transition.from = c)
      }, null, 8, ["options", "modelValue"])) : S("", !0),
      f[24] || (f[24] = s("h4", { class: "work-process-group" }, "Must be filled", -1)),
      k(mt, {
        label: "Required fields",
        options: e.draft.fields?.map((c) => ({ value: c.code, label: c.title || c.code })) ?? [],
        modelValue: e.transition.require,
        "onUpdate:modelValue": f[3] || (f[3] = (c) => e.transition.require = c)
      }, null, 8, ["options", "modelValue"]),
      f[25] || (f[25] = s("h4", { class: "work-process-group" }, "Only when", -1)),
      k(Gl, {
        label: "Allow this transition when",
        draft: e.draft,
        "board-id": e.boardId,
        "model-value": e.transition.when,
        "onUpdate:modelValue": f[4] || (f[4] = (c) => e.transition.when = c),
        onValidity: f[5] || (f[5] = (c) => l("validity", "when", c))
      }, null, 8, ["draft", "board-id", "model-value"]),
      e.guards?.length || e.transition.guards?.length ? (n(), Y(mt, {
        key: 1,
        label: "Installed checks",
        options: [...(e.guards ?? []).map((c) => ({ value: c.id, label: c.title })), ...(e.transition.guards ?? []).filter((c) => !e.guards?.some((i) => i.id === c)).map((c) => ({ value: c, label: e.guards ? "Unavailable check" : "Configured check" }))],
        modelValue: e.transition.guards,
        "onUpdate:modelValue": f[6] || (f[6] = (c) => e.transition.guards = c)
      }, null, 8, ["options", "modelValue"])) : S("", !0),
      (n(!0), h(Q, null, se(e.guards?.filter((c) => e.transition.guards?.includes(c.id)) ?? [], (c) => (n(), h("p", {
        key: c.id,
        class: "work-muted work-small"
      }, [
        z(I(c.description || c.title + " can stop this transition.") + " ", 1),
        c.reads?.length ? (n(), h("span", Gd, " Checks " + I(c.reads.map((i) => e.draft.fields?.find((u) => u.code === i)?.title || "a configured field").join(", ")) + ".", 1)) : S("", !0)
      ]))), 128)),
      k(Re, {
        class: "work-disclosure",
        label: "Advanced transition settings"
      }, {
        default: q(() => [
          s("div", Kd, [
            s("label", Hd, [
              f[17] || (f[17] = s("span", { class: "work-spacer" }, "Happens automatically", -1)),
              k(r(tt), {
                "model-value": e.transition.auto,
                "onUpdate:modelValue": f[7] || (f[7] = (c) => {
                  e.transition.auto = c, c || delete e.transition.default;
                }),
                "aria-label": "Automatic transition"
              }, null, 8, ["model-value"])
            ]),
            s("label", Yd, [
              f[18] || (f[18] = s("span", { class: "work-spacer" }, "Default automatic transition", -1)),
              k(r(tt), {
                modelValue: e.transition.default,
                "onUpdate:modelValue": f[8] || (f[8] = (c) => e.transition.default = c),
                disabled: !e.transition.auto,
                "aria-label": "Default transition"
              }, null, 8, ["modelValue", "disabled"])
            ]),
            f[23] || (f[23] = s("h4", { class: "work-process-group" }, "Also sets", -1)),
            (n(!0), h(Q, null, se(e.transition.set ?? [], (c, i) => (n(), h("div", {
              key: i,
              class: "work-process-value work-stack work-tight"
            }, [
              s("label", Xd, [
                f[19] || (f[19] = z("Field", -1)),
                k(r(ce), {
                  modelValue: c.field,
                  "onUpdate:modelValue": (u) => c.field = u,
                  appendTo: "self",
                  optionLabel: "label",
                  optionValue: "value",
                  options: e.draft.fields?.map((u) => ({ value: u.code, label: u.title || u.code })) ?? []
                }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
              ]),
              s("div", Jd, [
                k(r(ce), {
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
                  "onUpdate:modelValue": (u) => d(i, u)
                }, null, 8, ["model-value", "onUpdate:modelValue"]),
                k(r(ee), {
                  text: "",
                  severity: "danger",
                  "aria-label": "Remove value " + (i + 1),
                  onClick: (u) => e.transition.set?.splice(i, 1)
                }, {
                  default: q(() => [
                    k(r(ve), { icon: "tabler:trash" })
                  ]),
                  _: 1
                }, 8, ["aria-label", "onClick"])
              ]),
              c.copy !== void 0 ? (n(), Y(r(ce), {
                key: 0,
                modelValue: c.copy,
                "onUpdate:modelValue": (u) => c.copy = u,
                "aria-label": "Copy from field",
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                options: e.draft.fields?.map((u) => ({ value: u.code, label: u.title || u.code })) ?? []
              }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])) : c.clear ? S("", !0) : (n(!0), h(Q, { key: 1 }, se(e.draft.fields?.filter((u) => u.code === c.field) ?? [], (u) => (n(), Y(Wo, {
                key: u.code,
                "board-id": e.boardId ?? "",
                field: u,
                modelValue: c.value,
                "onUpdate:modelValue": (m) => c.value = m,
                onValidity: (m) => l("validity", "effect-" + i, m)
              }, null, 8, ["board-id", "field", "modelValue", "onUpdate:modelValue", "onValidity"]))), 128))
            ]))), 128)),
            k(r(ee), {
              label: "Add value",
              severity: "secondary",
              outlined: "",
              size: "small",
              onClick: o
            }, {
              icon: q(() => [
                k(r(ve), { icon: "tabler:plus" })
              ]),
              _: 1
            }),
            s("label", Zd, [
              f[20] || (f[20] = z("Offer to people", -1)),
              k(r(ce), {
                "model-value": e.transition.people,
                "aria-label": "Offer to people",
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                options: [{ label: "Work default", value: void 0 }, { label: "Offer explicitly", value: !0 }, { label: "Process engine only", value: !1 }],
                "onUpdate:modelValue": f[9] || (f[9] = (c) => e.transition.people = c)
              }, null, 8, ["model-value"]),
              f[21] || (f[21] = s("span", { class: "work-muted work-small" }, "Work default can hide a stage route from the list while still allowing it by name. Process engine only reserves the route for the engine and board administrators using force.", -1))
            ]),
            s("label", Qd, [
              f[22] || (f[22] = z("Evaluation order", -1)),
              k(r(Vt), {
                "model-value": e.transition.order ?? null,
                "aria-label": "Transition order",
                min: 0,
                useGrouping: !1,
                "onUpdate:modelValue": f[10] || (f[10] = (c) => e.transition.order = c ?? void 0)
              }, null, 8, ["model-value"])
            ]),
            k(Ot, {
              label: "Set values",
              "model-value": e.transition.set,
              shape: "array",
              "onUpdate:modelValue": f[11] || (f[11] = (c) => e.transition.set = c),
              onValidity: f[12] || (f[12] = (c) => l("validity", "set", c))
            }, null, 8, ["model-value"]),
            k(Ot, {
              label: "Guards",
              "model-value": e.transition.guards,
              shape: "array",
              "onUpdate:modelValue": f[13] || (f[13] = (c) => e.transition.guards = c),
              onValidity: f[14] || (f[14] = (c) => l("validity", "guards", c))
            }, null, 8, ["model-value"])
          ])
        ]),
        _: 1
      })
    ]));
  }
}), $o = /* @__PURE__ */ Ve({
  __name: "CapacityControl",
  props: {
    draft: {},
    state: {},
    label: {},
    hard: { type: Boolean }
  },
  setup(e) {
    const a = e, t = G(() => a.draft.policy?.wip?.[a.state]);
    function l(d) {
      if (d === null) {
        a.draft.policy?.wip && delete a.draft.policy.wip[a.state];
        return;
      }
      const p = a.draft.policy ??= {}, f = p.wip ??= {};
      f[a.state] = { ...f[a.state], limit: d };
    }
    function o(d) {
      t.value && (t.value.hard = d);
    }
    return (d, p) => e.hard ? (n(), Y(r(tt), {
      key: 0,
      "aria-label": e.label,
      disabled: !t.value,
      "model-value": t.value?.hard ?? !1,
      "onUpdate:modelValue": o
    }, null, 8, ["aria-label", "disabled", "model-value"])) : (n(), Y(r(Vt), {
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
async function Il(e, a) {
  try {
    const { data: t } = await El.get(e, a ? { params: a } : void 0);
    if (!t?.success) {
      const l = t?.message || (typeof t?.error == "string" ? t.error : t?.error?.message) || "Could not read published Flow.";
      throw new Dl({ message: l, details: t?.details }, "Published Flow");
    }
    return t;
  } catch (t) {
    throw Oi(t, "Published Flow");
  }
}
const xo = (e) => `/api/v1/workflows/${encodeURIComponent(e)}/versions`, Ml = {
  title: async (e) => (await Il("/api/v1/workflows/published", { id: e })).item?.title,
  versions: async (e) => (await Il(xo(e))).versions ?? [],
  check: async (e) => {
    if ((await Il(`${xo(e.id)}/${e.version}`)).version?.version !== e.version) throw new Error("The published version is unavailable.");
  }
}, eu = {
  class: "work-stack work-tight",
  "aria-label": "Stage Flow"
}, tu = {
  key: 0,
  class: "work-muted work-small"
}, au = {
  key: 1,
  class: "kx-err work-alert-actions"
}, lu = { role: "alert" }, ou = ["schema", "config", "title"], iu = {
  key: 3,
  class: "kx-err",
  role: "alert"
}, nu = {
  key: 4,
  class: "work-stack work-tight"
}, su = ["value", "aria-busy", "disabled"], ru = {
  value: "",
  disabled: ""
}, du = ["value"], uu = {
  key: 5,
  class: "work-muted work-small",
  role: "status"
}, cu = /* @__PURE__ */ Ve({
  __name: "StageFlow",
  props: {
    modelValue: {}
  },
  emits: ["update:modelValue", "validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = B(!1), d = B(""), p = B([]), f = B(!1), c = B(""), i = B(!1), u = G(() => d.value || t.modelValue?.id), m = JSON.stringify({ properties: { flow_ref: { title: "Published Flow", picker: "wc-workflow-picker" } } }), V = G(() => JSON.stringify(t.modelValue ? { flow_ref: t.modelValue } : {}));
    let v = 0;
    async function b() {
      o.value = await Pt("wc-workflow-picker");
    }
    b();
    async function y() {
      const W = ++v, L = u.value, _ = t.modelValue;
      if (f.value = !!L, c.value = "", p.value = [], !!L)
        try {
          const [j] = await Promise.all([Ml.versions(L), !i.value && _ ? Ml.check(_) : Promise.resolve()]);
          if (W !== v) return;
          if (p.value = j.filter((Z) => Number.isInteger(Z.version) && Z.version > 0), !i.value && _ && !p.value.some((Z) => Z.version === _.version)) throw new Error("The published version is unavailable.");
        } catch (j) {
          W === v && (c.value = rt(j, "Could not read published Flow."));
        } finally {
          W === v && (f.value = !1);
        }
    }
    Ie([u, () => t.modelValue?.version, i], y, { immediate: !0 }), Ie(i, (W) => l("validity", !W), { immediate: !0 });
    function T(W) {
      const L = W.detail?.flow_ref;
      L?.kind !== "flow" || !L.id || (i.value = !0, d.value = L.id);
    }
    function C(W) {
      !u.value || !p.value.some((L) => L.version === W) || (l("update:modelValue", { kind: "flow", id: u.value, version: W }), i.value = !1, d.value = "");
    }
    function U() {
      l("update:modelValue", void 0), i.value = !1, d.value = "";
    }
    return Ct(() => {
      v++, l("validity", !0);
    }), (W, L) => (n(), h("section", eu, [
      L[4] || (L[4] = s("h4", { class: "work-field-label" }, "What runs", -1)),
      e.modelValue ? S("", !0) : (n(), h("p", tu, "No Flow bound. This stage keeps its existing external execution contract.")),
      c.value ? (n(), h("div", au, [
        s("p", lu, [
          z(I(i.value ? "Flow versions unavailable" : "Flow binding unavailable"), 1),
          !i.value && e.modelValue ? (n(), h(Q, { key: 0 }, [
            z(" (v" + I(e.modelValue.version) + ")", 1)
          ], 64)) : S("", !0),
          z(". " + I(c.value), 1)
        ]),
        k(r(ee), {
          label: "Reload Flow",
          severity: "secondary",
          text: "",
          onClick: y
        })
      ])) : S("", !0),
      o.value ? (n(), h("wc-workflow-picker", {
        key: 2,
        schema: r(m),
        config: V.value,
        title: e.modelValue?.id,
        onChange: T
      }, null, 40, ou)) : (n(), h("p", iu, [
        L[2] || (L[2] = z("Published Flow picker unavailable.", -1)),
        k(r(ee), {
          label: "Reload Flow picker",
          text: "",
          severity: "secondary",
          onClick: b
        })
      ])),
      u.value ? (n(), h("label", nu, [
        L[3] || (L[3] = z(" Published version ", -1)),
        s("select", {
          class: "p-inputtext work-flow-version",
          value: i.value ? "" : e.modelValue?.version,
          "aria-busy": f.value,
          disabled: f.value || !!c.value,
          onChange: L[0] || (L[0] = (_) => C(Number(_.target.value)))
        }, [
          s("option", ru, I(f.value ? "Loading versions…" : "Choose a published version"), 1),
          (n(!0), h(Q, null, se(p.value, (_) => (n(), h("option", {
            key: _.version,
            value: _.version
          }, "v" + I(_.version), 9, du))), 128))
        ], 40, su)
      ])) : S("", !0),
      i.value ? (n(), h("p", uu, "Choose a published version to finish selecting the Flow.")) : S("", !0),
      e.modelValue || i.value ? (n(), Y(r(ee), {
        key: 6,
        label: i.value ? "Cancel Flow selection" : "Remove Flow binding",
        "aria-label": i.value ? "Cancel Flow selection" : "Remove Flow binding",
        severity: "secondary",
        text: "",
        onClick: L[1] || (L[1] = (_) => i.value ? (i.value = !1, d.value = "") : U())
      }, null, 8, ["label", "aria-label"])) : S("", !0)
    ]));
  }
}), Fl = { seconds: 1, minutes: 60, hours: 3600, days: 86400 };
function wa(e, a) {
  const t = /^P(\d+)W$/.exec(e), l = /^P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+\.?\d*)S)?)?$/.exec(e);
  if (!t && (!l || e === "P" || e.endsWith("T"))) return;
  const o = t ? Number(t[1]) * 604800 : Number(l[1] ?? 0) * 86400 + Number(l[2] ?? 0) * 3600 + Number(l[3] ?? 0) * 60 + Number(l[4] ?? 0);
  if (!Number.isFinite(o) || o <= 0) return;
  const d = a ?? (o % 86400 === 0 ? "days" : o % 3600 === 0 ? "hours" : o < 60 ? "seconds" : "minutes");
  return { amount: o / Fl[d], unit: d };
}
function vu(e, a) {
  if (e == null) return;
  if (!Number.isFinite(e * Fl[a]) || e <= 0) throw new Error("Enter a positive duration.");
  const t = (o) => o.toLocaleString("en-US", { useGrouping: !1, maximumSignificantDigits: 21 });
  if (!Number.isInteger(e)) return `PT${t(e * Fl[a])}S`;
  const l = { seconds: "S", minutes: "M", hours: "H", days: "D" }[a];
  return (a === "days" ? "P" : "PT") + t(e) + l;
}
const fu = { class: "work-stack work-tight" }, mu = {
  key: 0,
  class: "work-error",
  role: "alert"
}, Wt = /* @__PURE__ */ Ve({
  __name: "DurationControl",
  props: {
    modelValue: {},
    label: {},
    disabled: { type: Boolean }
  },
  emits: ["update:modelValue", "validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = "duration:" + Kt(), d = B(), p = B(""), f = G(() => t.modelValue ? wa(t.modelValue) : void 0), c = G(() => d.value ?? f.value?.unit ?? "days");
    Ie(() => t.modelValue, (C) => {
      p.value = "", l("validity", !C || !!f.value, o);
    }, { immediate: !0 });
    const i = G(() => t.modelValue ? wa(t.modelValue, c.value)?.amount ?? null : null);
    function u(C) {
      try {
        const U = vu(C, c.value);
        p.value = "", l("update:modelValue", U), l("validity", !0, o);
      } catch (U) {
        p.value = U.message, l("validity", !1, o);
      }
    }
    let m;
    function V(C) {
      C.target instanceof HTMLInputElement && (m = C.target.value);
    }
    function v(C) {
      if (m === void 0) return;
      const U = m;
      m = void 0, y(C, U);
    }
    function b(C) {
      m = void 0;
      const U = C.originalEvent?.target instanceof HTMLInputElement ? C.originalEvent.target.value : C.formattedValue;
      y(C.value, U);
    }
    function y(C, U) {
      if (U.trim() && (typeof C != "number" || !Number.isFinite(C))) {
        p.value = "Enter a positive duration.", l("validity", !1, o);
        return;
      }
      d.value = c.value, u(typeof C == "number" ? C : null);
    }
    function T(C) {
      const U = i.value;
      d.value = C, !(t.modelValue && !f.value) && u(U);
    }
    return Ct(() => l("validity", !0, o)), (C, U) => (n(), h("label", fu, [
      z(I(e.label), 1),
      s("span", {
        class: "work-duration-control",
        style: { "max-width": "360px" },
        onInputCapture: V
      }, [
        k(r(Vt), {
          "model-value": i.value,
          "aria-label": e.label,
          min: 0,
          "aria-invalid": !!p.value || !!e.modelValue && !r(wa)(e.modelValue),
          disabled: e.disabled,
          useGrouping: !1,
          "max-fraction-digits": c.value === "seconds" ? 20 : 3,
          onInput: b,
          "onUpdate:modelValue": v
        }, null, 8, ["model-value", "aria-label", "aria-invalid", "disabled", "max-fraction-digits"]),
        k(r(ce), {
          "model-value": c.value,
          "aria-label": e.label + " unit",
          disabled: e.disabled,
          options: [{ label: "Seconds", value: "seconds" }, { label: "Minutes", value: "minutes" }, { label: "Hours", value: "hours" }, { label: "Days", value: "days" }],
          optionLabel: "label",
          optionValue: "value",
          appendTo: "self",
          "onUpdate:modelValue": U[0] || (U[0] = (W) => T(W))
        }, null, 8, ["model-value", "aria-label", "disabled"])
      ], 32),
      p.value || e.modelValue && !r(wa)(e.modelValue) ? (n(), h("span", mu, I(p.value || `Unsupported duration: ${e.modelValue}`), 1)) : S("", !0)
    ]));
  }
}), pu = { class: "work-stack" }, bu = { class: "work-settings-grid" }, hu = { class: "work-stack work-tight" }, gu = { class: "work-stack work-tight" }, yu = {
  key: 1,
  class: "work-stack work-tight"
}, ku = { class: "work-stack work-tight" }, wu = { class: "work-settings-grid" }, Vu = { class: "work-row" }, $u = { class: "work-stack work-tight" }, xu = {
  key: 0,
  class: "work-stack work-tight"
}, Cu = /* @__PURE__ */ Ve({
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
      i.push({ id: jt("timer", i), after: "P1D", then: { emit: "reminder" } });
    }
    function p(i, u) {
      delete i.after, delete i.at_field, u === "after" ? i.after = "P1D" : i.at_field = "";
    }
    function f(i, u, m) {
      m ? i[u] = m : (delete i[u], delete i.table);
    }
    function c(i, u) {
      i.then = u === "emit" ? { emit: "" } : { transition: "" };
    }
    return (i, u) => (n(), h("section", pu, [
      u[8] || (u[8] = s("h4", null, "Timers", -1)),
      (n(!0), h(Q, null, se(o(), (m, V) => (n(), h("article", {
        key: m.id,
        class: "work-settings-card work-stack"
      }, [
        s("div", bu, [
          s("label", hu, [
            u[2] || (u[2] = z("Timer ID", -1)),
            k(r(Se), {
              modelValue: m.id,
              "onUpdate:modelValue": (v) => m.id = v,
              required: "",
              pattern: "[a-z][a-z0-9_]*"
            }, null, 8, ["modelValue", "onUpdate:modelValue"])
          ]),
          s("label", gu, [
            u[3] || (u[3] = z("Deadline", -1)),
            k(r(ce), {
              "model-value": m.at_field !== void 0 ? "at_field" : "after",
              "onUpdate:modelValue": (v) => p(m, v),
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
          m.after !== void 0 ? (n(), Y(Wt, {
            key: 0,
            modelValue: m.after,
            "onUpdate:modelValue": (v) => m.after = v,
            label: "After",
            onValidity: u[0] || (u[0] = (v, b) => l("validity", b, v))
          }, null, 8, ["modelValue", "onUpdate:modelValue"])) : (n(), h("label", yu, [
            u[4] || (u[4] = z("At field", -1)),
            k(r(ce), {
              modelValue: m.at_field,
              "onUpdate:modelValue": (v) => m.at_field = v,
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
          s("label", ku, [
            u[5] || (u[5] = z("Duration by field", -1)),
            k(r(ce), {
              "model-value": m.by ?? "",
              "onUpdate:modelValue": (v) => f(m, "by", v),
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
        m.by ? (n(), Y(Ot, {
          key: 0,
          label: "Duration table",
          hint: "Map field values to ISO durations.",
          "model-value": m.table,
          shape: "object",
          "onUpdate:modelValue": (v) => m.table = v,
          onValidity: (v) => l("validity", "table-" + V, v)
        }, null, 8, ["model-value", "onUpdate:modelValue", "onValidity"])) : S("", !0),
        s("div", wu, [
          k(Wt, {
            modelValue: m.repeat,
            "onUpdate:modelValue": (v) => m.repeat = v,
            label: "Repeat every",
            onValidity: u[1] || (u[1] = (v, b) => l("validity", b, v)),
            disabled: m.interrupting
          }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"]),
          s("label", Vu, [
            k(r(Gt), {
              modelValue: m.interrupting,
              "onUpdate:modelValue": [(v) => m.interrupting = v, (v) => m.interrupting && delete m.repeat],
              binary: ""
            }, null, 8, ["modelValue", "onUpdate:modelValue"]),
            u[6] || (u[6] = z("Interrupting", -1))
          ]),
          s("label", $u, [
            u[7] || (u[7] = z("Then", -1)),
            k(r(ce), {
              "model-value": m.then?.transition !== void 0 ? "transition" : "emit",
              "onUpdate:modelValue": (v) => c(m, v),
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
          m.then ? (n(), h("label", xu, [
            z(I(m.then.transition !== void 0 ? "Transition ID" : "Event name"), 1),
            m.then.transition !== void 0 ? (n(), Y(r(Se), {
              key: 0,
              modelValue: m.then.transition,
              "onUpdate:modelValue": (v) => m.then.transition = v
            }, null, 8, ["modelValue", "onUpdate:modelValue"])) : (n(), Y(r(Se), {
              key: 1,
              modelValue: m.then.emit,
              "onUpdate:modelValue": (v) => m.then.emit = v
            }, null, 8, ["modelValue", "onUpdate:modelValue"]))
          ])) : S("", !0)
        ]),
        k(r(ee), {
          severity: "secondary",
          onClick: (v) => o().splice(V, 1),
          "aria-label": "Remove timer",
          text: "",
          size: "small"
        }, {
          default: q(() => [
            k(r(ve), {
              icon: "tabler:trash",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        }, 8, ["onClick"])
      ]))), 128)),
      k(r(ee), {
        label: "Add timer",
        severity: "secondary",
        onClick: d,
        outlined: ""
      }, {
        icon: q(() => [
          k(r(ve), {
            icon: "tabler:plus",
            "aria-hidden": "true"
          })
        ]),
        _: 1
      })
    ]));
  }
}), Su = ["aria-label"], Tu = { class: "work-stack work-tight" }, Iu = {
  key: 0,
  class: "work-stack work-tight"
}, Du = /* @__PURE__ */ Ve({
  __name: "PrincipalSourceEditor",
  props: {
    modelValue: {},
    draft: {},
    boardId: {},
    label: {}
  },
  emits: ["update:modelValue", "validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = G(() => Array.isArray(t.modelValue) ? "principals" : "field" in t.modelValue ? "field" : "group"), d = G(() => Array.isArray(t.modelValue) ? t.modelValue : "group" in t.modelValue && t.modelValue.group ? [{ kind: "group", id: t.modelValue.group }] : []);
    function p(c) {
      l("update:modelValue", c === "field" ? { field: "" } : c === "group" ? { group: "" } : []);
    }
    function f(c) {
      l("update:modelValue", o.value === "group" ? { group: c.at(-1)?.id ?? "" } : c);
    }
    return Ao(() => l("validity", Array.isArray(t.modelValue) ? t.modelValue.length > 0 : "field" in t.modelValue ? !!t.modelValue.field : !!t.modelValue.group)), Ct(() => l("validity", !0)), (c, i) => (n(), h("section", {
      class: "work-stack work-tight",
      "aria-label": e.label
    }, [
      s("label", Tu, [
        z(I(e.label) + " source", 1),
        k(r(ce), {
          "model-value": o.value,
          "aria-label": e.label + " source",
          options: [{ label: "Group", value: "group" }, { label: "People and groups", value: "principals" }, { label: "Principal field", value: "field" }],
          optionLabel: "label",
          optionValue: "value",
          appendTo: "self",
          "onUpdate:modelValue": p
        }, null, 8, ["model-value", "aria-label"])
      ]),
      "field" in e.modelValue ? (n(), h("label", Iu, [
        i[1] || (i[1] = z("Principal field", -1)),
        k(r(ce), {
          "model-value": e.modelValue.field,
          "aria-label": e.label + " field",
          options: e.draft.fields?.filter((u) => u.type === "principal").map((u) => ({ label: u.title || u.code, value: u.code })) ?? [],
          optionLabel: "label",
          optionValue: "value",
          appendTo: "self",
          "onUpdate:modelValue": i[0] || (i[0] = (u) => l("update:modelValue", { field: u }))
        }, null, 8, ["model-value", "aria-label", "options"])
      ])) : (n(), Y(Kl, {
        key: 1,
        "board-id": e.boardId,
        label: e.label,
        kinds: o.value === "group" ? "group" : "user,group,service",
        "model-value": d.value,
        "onUpdate:modelValue": f
      }, null, 8, ["board-id", "label", "kinds", "model-value"]))
    ], 8, Su));
  }
}), Uu = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, Eu = {
  class: "work-stack work-tight",
  "aria-label": "Approval sources"
}, Au = { class: "work-row" }, Pu = {
  key: 0,
  class: "work-stack work-tight"
}, Ou = ["kinds", "value"], Ru = {
  key: 2,
  class: "work-muted work-small",
  role: "status"
}, Nu = {
  key: 3,
  class: "work-chips"
}, Mu = { class: "work-row work-small" }, Fu = { class: "work-stack work-tight" }, Lu = {
  key: 4,
  class: "work-error work-small",
  role: "alert"
}, Bu = {
  key: 5,
  class: "work-muted work-small"
}, zu = /* @__PURE__ */ Ve({
  __name: "ApproversEditor",
  props: {
    approvals: {},
    boardId: {}
  },
  emits: ["validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, { principalLabel: o, rememberPrincipal: d, nameError: p } = Oo(() => t.boardId ?? "", () => Array.isArray(t.approvals.from) ? t.approvals.from : "group" in t.approvals.from ? [{ kind: "group", id: t.approvals.from.group }] : []), f = B(!1), c = G(() => Array.isArray(t.approvals.from) ? "principals" : "field" in t.approvals.from ? "field" : "group"), i = G(() => Array.isArray(t.approvals.from) ? t.approvals.from.some((v) => v.kind === "group") || t.approvals.from.length >= t.approvals.min : "field" in t.approvals.from ? !!t.approvals.from.field : !!t.approvals.from.group);
    Ao(() => l("validity", Number.isSafeInteger(t.approvals.min) && t.approvals.min > 0 && i.value)), Ct(() => l("validity", !0)), Ea(async () => {
      f.value = await Pt("wc-principal-picker");
    });
    function u(v) {
      t.approvals.from = v === "group" ? { group: "" } : v === "field" ? { field: "" } : [];
    }
    function m(v) {
      const b = v.detail, y = b?.principal_id ?? b?.id;
      if (c.value === "group") {
        t.approvals.from = { group: y ?? "" };
        return;
      }
      if (!y || !Array.isArray(t.approvals.from)) return;
      const T = { kind: b.type ?? b.kind ?? "user", id: y };
      b.label && d(T, b.label), t.approvals.from.some((C) => C.id === y && C.kind === T.kind) || t.approvals.from.push(T);
    }
    function V(v) {
      Array.isArray(t.approvals.from) && t.approvals.from.splice(v, 1);
    }
    return (v, b) => (n(), h(Q, null, [
      r(p) ? (n(), h("p", Uu, I(r(p)), 1)) : S("", !0),
      s("section", Eu, [
        s("label", Au, [
          b[4] || (b[4] = s("span", { class: "work-spacer" }, "Approvals needed", -1)),
          k(r(Vt), {
            modelValue: e.approvals.min,
            "onUpdate:modelValue": b[0] || (b[0] = (y) => e.approvals.min = y),
            min: 1,
            required: "",
            useGrouping: !1
          }, null, 8, ["modelValue"])
        ]),
        b[8] || (b[8] = s("span", { class: "work-field-label" }, "Approvers", -1)),
        "field" in e.approvals.from ? (n(), h("label", Pu, [
          b[5] || (b[5] = z("Principal field", -1)),
          k(r(Se), {
            modelValue: e.approvals.from.field,
            "onUpdate:modelValue": b[1] || (b[1] = (y) => e.approvals.from.field = y),
            "aria-label": "Principal field"
          }, null, 8, ["modelValue"])
        ])) : f.value ? (n(), h("wc-principal-picker", {
          key: c.value,
          kinds: c.value === "group" ? "group" : "user,group,service",
          value: JSON.stringify("group" in e.approvals.from ? { type: "group", principal_id: e.approvals.from.group } : {}),
          onConfigChanged: m
        }, null, 40, Ou)) : (n(), h("p", Ru, "The principal picker is unavailable.")),
        Array.isArray(e.approvals.from) ? (n(), h("div", Nu, [
          (n(!0), h(Q, null, se(e.approvals.from, (y, T) => (n(), Y(r(at), {
            key: y.kind + ":" + y.id,
            class: "kx-tag-sm",
            severity: "secondary"
          }, {
            default: q(() => [
              z(I(r(o)(y)), 1),
              k(r(ee), {
                "aria-label": "Remove approver " + (T + 1),
                text: "",
                severity: "secondary",
                size: "small",
                onClick: (C) => V(T)
              }, {
                default: q(() => [
                  k(r(ve), {
                    icon: "tabler:x",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["aria-label", "onClick"])
            ]),
            _: 2
          }, 1024))), 128))
        ])) : S("", !0),
        s("label", Mu, [
          b[6] || (b[6] = s("span", { class: "work-spacer" }, "The person who moves the item here cannot approve this visit", -1)),
          k(r(tt), {
            modelValue: e.approvals.prevent_self,
            "onUpdate:modelValue": b[2] || (b[2] = (y) => e.approvals.prevent_self = y),
            "aria-label": "The person who moves the item here cannot approve this visit"
          }, null, 8, ["modelValue"])
        ]),
        k(Re, {
          class: "work-process-options",
          label: "Approval options"
        }, {
          default: q(() => [
            s("label", Fu, [
              b[7] || (b[7] = z("Approval source", -1)),
              k(r(ce), {
                "model-value": c.value,
                "onUpdate:modelValue": b[3] || (b[3] = (y) => u(y)),
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                options: [{ label: "Group members", value: "group" }, { label: "People and groups", value: "principals" }, { label: "Principal field", value: "field" }]
              }, null, 8, ["model-value"])
            ])
          ]),
          _: 1
        }),
        Array.isArray(e.approvals.from) && !i.value ? (n(), h("p", Lu, "Select at least " + I(e.approvals.min) + " distinct principals, or lower the minimum.", 1)) : "group" in e.approvals.from && !e.approvals.from.group ? (n(), h("p", Bu, "Choose the group that can approve this state.")) : S("", !0)
      ])
    ], 64));
  }
}), ju = {
  class: "work-state-settings work-stack",
  "aria-label": "State settings"
}, Wu = { class: "work-process-kind" }, qu = { class: "work-row" }, Gu = { class: "work-row" }, Ku = { class: "work-stack" }, Hu = { class: "work-row" }, Yu = { class: "work-stack work-tight" }, Xu = { class: "work-row" }, Ju = { class: "work-stack work-tight" }, Zu = { class: "work-row" }, Qu = { class: "work-row" }, _u = { class: "work-stack work-tight" }, ec = { class: "work-stack" }, tc = { class: "work-row" }, ac = { class: "work-row" }, lc = { class: "work-stack work-tight" }, oc = { class: "work-stack work-tight" }, ic = {
  key: 0,
  class: "work-row"
}, nc = { class: "work-stack" }, sc = { class: "work-stack work-tight" }, rc = { class: "work-row" }, dc = /* @__PURE__ */ Ve({
  __name: "StateSettings",
  props: {
    state: {},
    process: {},
    draft: {},
    boardId: {}
  },
  emits: ["validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = G(() => (t.process.transitions ?? []).filter((c) => c.from === "any" || c.from.includes(t.state.id))), d = [{ value: "human", icon: "user" }, { value: "gate", icon: "shield-check" }, { value: "automated", icon: "bolt" }, { value: "parallel", icon: "arrows-split" }];
    function p(c) {
      const i = t.state;
      i.kind = c, delete i.run, delete i.release_when, delete i.regions, delete i.join, delete i.due, (c === "automated" || c === "gate") && delete i.awaiting, c === "automated" && (i.run = { stage: i.id, retry: { max: 1, backoff: "PT1M" } }), c === "gate" && (i.release_when = { approvals: { min: 1, from: { group: "" }, prevent_self: !0 } }), c === "parallel" && (i.regions = [{ id: "region_1", initial: t.process.states.find((u) => u.id !== i.id)?.id ?? "" }], i.join = "all");
    }
    function f(c) {
      t.state.run && (c ? t.state.run.on_fail = c : delete t.state.run.on_fail);
    }
    return (c, i) => (n(), h("section", ju, [
      i[57] || (i[57] = s("h4", { class: "work-process-group" }, "Who moves the item on", -1)),
      k(r(jl), {
        class: "work-process-kinds",
        "model-value": e.state.kind ?? "human",
        options: d.map((u) => ({
          ...u,
          label: r(Xa)(u.value)
        })),
        optionLabel: "label",
        optionValue: "value",
        optionDisabled: "disabled",
        "allow-empty": !1,
        "aria-label": "Who moves the item on",
        "onUpdate:modelValue": p
      }, {
        option: q(({ option: u }) => [
          s("span", Wu, [
            k(r(ve), {
              icon: "tabler:" + u.icon
            }, null, 8, ["icon"]),
            s("span", null, I(u.label), 1)
          ])
        ]),
        _: 1
      }, 8, ["model-value", "options"]),
      i[58] || (i[58] = s("h4", { class: "work-process-group" }, "Limit", -1)),
      s("label", qu, [
        i[34] || (i[34] = s("span", { class: "work-spacer" }, "Items allowed here", -1)),
        k($o, {
          draft: e.draft,
          state: e.state.id,
          label: "Items allowed here"
        }, null, 8, ["draft", "state"])
      ]),
      s("label", Gu, [
        i[35] || (i[35] = s("span", { class: "work-spacer" }, [
          z("Refuse moves over the limit"),
          s("small", { class: "work-muted work-block" }, "Off only warns")
        ], -1)),
        k($o, {
          draft: e.draft,
          state: e.state.id,
          label: "Refuse moves over the limit",
          hard: ""
        }, null, 8, ["draft", "state"])
      ]),
      i[59] || (i[59] = s("h4", { class: "work-process-group" }, "Required on entry", -1)),
      k(mt, {
        label: "Required fields",
        options: e.draft.fields?.map((u) => ({ value: u.code, label: u.title || u.code })) ?? [],
        modelValue: e.state.require,
        "onUpdate:modelValue": i[0] || (i[0] = (u) => e.state.require = u)
      }, null, 8, ["options", "modelValue"]),
      !e.state.kind || e.state.kind === "human" ? (n(), Y(Wt, {
        key: 0,
        modelValue: e.state.due,
        "onUpdate:modelValue": i[1] || (i[1] = (u) => e.state.due = u),
        label: "Time allowed in this state",
        onValidity: i[2] || (i[2] = (u, m) => l("validity", m, u))
      }, null, 8, ["modelValue"])) : S("", !0),
      e.state.kind === "gate" && e.state.release_when ? (n(), h(Q, { key: 1 }, [
        i[37] || (i[37] = s("h4", { class: "work-process-group" }, "Approval", -1)),
        e.state.release_when.approvals ? (n(), Y(zu, {
          key: 0,
          "board-id": e.boardId,
          approvals: e.state.release_when.approvals,
          onValidity: i[3] || (i[3] = (u) => l("validity", "approvers", u))
        }, null, 8, ["board-id", "approvals"])) : S("", !0),
        k(Re, {
          class: "work-process-options",
          label: "Release options"
        }, {
          default: q(() => [
            s("div", Ku, [
              s("label", Hu, [
                i[36] || (i[36] = s("span", { class: "work-spacer" }, "Require approvals", -1)),
                k(r(tt), {
                  "model-value": !!e.state.release_when.approvals,
                  "aria-label": "Require approvals",
                  "onUpdate:modelValue": i[4] || (i[4] = (u) => e.state.release_when.approvals = u ? { min: 1, from: { group: "" }, prevent_self: !0 } : void 0)
                }, null, 8, ["model-value"])
              ]),
              k(Wt, {
                modelValue: e.state.release_when.wait,
                "onUpdate:modelValue": i[5] || (i[5] = (u) => e.state.release_when.wait = u),
                label: "Wait before release",
                onValidity: i[6] || (i[6] = (u, m) => l("validity", m, u))
              }, null, 8, ["modelValue"]),
              k(Gl, {
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
      ], 64)) : S("", !0),
      e.state.kind === "automated" && e.state.run ? (n(), h(Q, { key: 2 }, [
        i[46] || (i[46] = s("h4", { class: "work-process-group" }, "Automation", -1)),
        s("label", Yu, [
          i[38] || (i[38] = z("Run label", -1)),
          k(r(Se), {
            modelValue: e.state.run.stage,
            "onUpdate:modelValue": i[9] || (i[9] = (u) => e.state.run.stage = u),
            "aria-label": "Run label",
            required: ""
          }, null, 8, ["modelValue"])
        ]),
        k(cu, {
          modelValue: e.state.run.flow_ref,
          "onUpdate:modelValue": i[10] || (i[10] = (u) => e.state.run.flow_ref = u),
          onValidity: i[11] || (i[11] = (u) => l("validity", "flow", u))
        }, null, 8, ["modelValue"]),
        k(Wt, {
          modelValue: e.state.run.timeout,
          "onUpdate:modelValue": i[12] || (i[12] = (u) => e.state.run.timeout = u),
          label: "Attempt timeout",
          onValidity: i[13] || (i[13] = (u, m) => l("validity", m, u))
        }, null, 8, ["modelValue"]),
        i[47] || (i[47] = s("small", { class: "work-muted" }, "Blank uses the board timeout, or one hour.", -1)),
        s("label", Xu, [
          i[39] || (i[39] = s("span", { class: "work-spacer" }, "Maximum visits", -1)),
          k(r(Vt), {
            "model-value": e.state.run.max_visits ?? null,
            "aria-label": "Maximum visits",
            min: 1,
            useGrouping: !1,
            placeholder: "Board default",
            "onUpdate:modelValue": i[14] || (i[14] = (u) => e.state.run.max_visits = u ?? void 0)
          }, null, 8, ["model-value"])
        ]),
        s("label", Ju, [
          i[40] || (i[40] = z("When visits are exhausted", -1)),
          k(r(ce), {
            "model-value": e.state.run.on_exhausted,
            "aria-label": "When visits are exhausted",
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            showClear: "",
            options: (e.process.transitions ?? []).filter((u) => !u.auto).map((u) => ({ label: r(Ge)(u), value: u.id })),
            "onUpdate:modelValue": i[15] || (i[15] = (u) => e.state.run.on_exhausted = u || void 0)
          }, null, 8, ["model-value", "options"])
        ]),
        i[48] || (i[48] = s("small", { class: "work-muted" }, "Blank records a failed run and stops automation. A route must leave every incoming state or be global.", -1)),
        s("label", Zu, [
          i[41] || (i[41] = s("span", { class: "work-spacer" }, "Retry if it fails", -1)),
          k(r(tt), {
            "model-value": !!e.state.run.retry,
            "aria-label": "Retry if it fails",
            "onUpdate:modelValue": i[16] || (i[16] = (u) => e.state.run.retry = u ? { max: 1, backoff: "PT1M" } : void 0)
          }, null, 8, ["model-value"])
        ]),
        e.state.run.retry ? (n(), h(Q, { key: 0 }, [
          s("label", Qu, [
            i[42] || (i[42] = s("span", { class: "work-spacer" }, "Maximum attempts", -1)),
            k(r(Vt), {
              modelValue: e.state.run.retry.max,
              "onUpdate:modelValue": i[17] || (i[17] = (u) => e.state.run.retry.max = u),
              min: 1,
              useGrouping: !1
            }, null, 8, ["modelValue"])
          ]),
          k(Wt, {
            modelValue: e.state.run.retry.backoff,
            "onUpdate:modelValue": i[18] || (i[18] = (u) => e.state.run.retry.backoff = u),
            label: "Wait between attempts",
            onValidity: i[19] || (i[19] = (u, m) => l("validity", m, u))
          }, null, 8, ["modelValue"])
        ], 64)) : S("", !0),
        (n(), h(Q, null, se([{ key: "on_pass", label: "On success" }, { key: "on_cancel", label: "On cancellation" }], (u) => s("label", {
          key: u.key,
          class: "work-stack work-tight"
        }, [
          z(I(u.label), 1),
          k(r(ce), {
            "model-value": e.state.run[u.key],
            "aria-label": u.label,
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            showClear: "",
            options: o.value.map((m) => ({ label: r(Ge)(m), value: m.id })),
            "onUpdate:modelValue": (m) => e.state.run[u.key] = m || void 0
          }, null, 8, ["model-value", "aria-label", "options", "onUpdate:modelValue"])
        ])), 64)),
        s("label", _u, [
          i[43] || (i[43] = z("If it fails, go to", -1)),
          k(r(ce), {
            "aria-label": "If it fails, go to",
            "model-value": e.state.run.on_fail,
            "onUpdate:modelValue": f,
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            showClear: "",
            options: o.value.map((u) => ({
              label: r(Ge)(u) + " → " + r(ge)(e.process.states.find((m) => m.id === u.to)),
              value: u.id
            }))
          }, null, 8, ["model-value", "options"])
        ]),
        k(Re, {
          class: "work-disclosure",
          label: "Board automation defaults"
        }, {
          default: q(() => [
            s("div", ec, [
              i[45] || (i[45] = s("p", { class: "work-muted" }, "These values apply to automated states without their own limit.", -1)),
              k(Wt, {
                "model-value": e.draft.policy?.stage_timeout,
                label: "Default attempt timeout",
                "onUpdate:modelValue": i[20] || (i[20] = (u) => (e.draft.policy ??= {}).stage_timeout = u),
                onValidity: i[21] || (i[21] = (u, m) => l("validity", m, u))
              }, null, 8, ["model-value"]),
              s("label", tc, [
                i[44] || (i[44] = s("span", { class: "work-spacer" }, "Default maximum visits", -1)),
                k(r(Vt), {
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
      ], 64)) : S("", !0),
      e.state.kind === "parallel" && e.state.regions ? (n(), h(Q, { key: 3 }, [
        i[53] || (i[53] = s("h4", { class: "work-process-group" }, "Lanes", -1)),
        (n(!0), h(Q, null, se(e.state.regions, (u, m) => (n(), h("div", {
          key: m,
          class: "work-process-value work-stack work-tight"
        }, [
          s("div", ac, [
            s("span", null, "Lane " + I(m + 1), 1),
            i[49] || (i[49] = s("span", { class: "work-spacer" }, null, -1)),
            k(r(ee), {
              severity: "danger",
              text: "",
              size: "small",
              "aria-label": "Remove lane",
              onClick: (V) => e.state.regions.splice(m, 1)
            }, {
              default: q(() => [
                k(r(ve), { icon: "tabler:trash" })
              ]),
              _: 1
            }, 8, ["onClick"])
          ]),
          s("label", lc, [
            i[50] || (i[50] = z("Starts at", -1)),
            k(r(ce), {
              "aria-label": "Lane starts at",
              modelValue: u.initial,
              "onUpdate:modelValue": (V) => u.initial = V,
              appendTo: "self",
              optionLabel: "label",
              optionValue: "value",
              options: e.process.states.filter((V) => V.id !== e.state.id).map((V) => ({ label: r(ge)(V), value: V.id }))
            }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
          ])
        ]))), 128)),
        k(r(ee), {
          label: "Add lane",
          severity: "secondary",
          outlined: "",
          size: "small",
          onClick: i[23] || (i[23] = (u) => e.state.regions.push({
            id: r(jt)("region", e.state.regions),
            initial: e.process.states.find((m) => m.id !== e.state.id)?.id ?? ""
          }))
        }, {
          icon: q(() => [
            k(r(ve), { icon: "tabler:plus" })
          ]),
          _: 1
        }),
        s("label", oc, [
          i[51] || (i[51] = z("Finish rule", -1)),
          k(r(ce), {
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
        typeof e.state.join == "number" ? (n(), h("label", ic, [
          i[52] || (i[52] = s("span", { class: "work-spacer" }, "Lanes needed", -1)),
          k(r(Vt), {
            modelValue: e.state.join,
            "onUpdate:modelValue": i[25] || (i[25] = (u) => e.state.join = u),
            min: 1,
            max: e.state.regions.length,
            useGrouping: !1
          }, null, 8, ["modelValue", "max"])
        ])) : S("", !0)
      ], 64)) : S("", !0),
      k(Re, {
        class: "work-disclosure",
        label: "Advanced state settings"
      }, {
        default: q(() => [
          s("div", nc, [
            i[56] || (i[56] = s("h4", { class: "work-process-group" }, "Assignment and conditions", -1)),
            s("label", sc, [
              i[54] || (i[54] = z("Stage label", -1)),
              k(r(Se), {
                "model-value": e.state.stage,
                "aria-label": "Stage label",
                "onUpdate:modelValue": i[26] || (i[26] = (u) => e.state.stage = u || void 0)
              }, null, 8, ["model-value"])
            ]),
            !e.state.kind || e.state.kind === "human" || e.state.kind === "parallel" ? (n(), h(Q, { key: 0 }, [
              s("label", rc, [
                k(r(tt), {
                  "model-value": !!e.state.awaiting,
                  "aria-label": "Awaiting people",
                  "onUpdate:modelValue": i[27] || (i[27] = (u) => e.state.awaiting = u ? { group: "" } : void 0)
                }, null, 8, ["model-value"]),
                i[55] || (i[55] = z("Awaiting people", -1))
              ]),
              e.state.awaiting ? (n(), Y(Du, {
                key: 0,
                modelValue: e.state.awaiting,
                "onUpdate:modelValue": i[28] || (i[28] = (u) => e.state.awaiting = u),
                draft: e.draft,
                "board-id": e.boardId,
                label: "Awaiting",
                onValidity: i[29] || (i[29] = (u) => l("validity", "awaiting", u))
              }, null, 8, ["modelValue", "draft", "board-id"])) : S("", !0)
            ], 64)) : S("", !0),
            k(Kl, {
              "board-id": e.boardId,
              modelValue: e.state.assign,
              "onUpdate:modelValue": i[30] || (i[30] = (u) => e.state.assign = u),
              label: "Assign to"
            }, null, 8, ["board-id", "modelValue"]),
            k(Ot, {
              label: "State checks",
              example: ["installed-check"],
              "model-value": e.state.invariants,
              shape: "array",
              "onUpdate:modelValue": i[31] || (i[31] = (u) => e.state.invariants = u),
              onValidity: i[32] || (i[32] = (u) => l("validity", "invariants", u))
            }, null, 8, ["model-value"]),
            k(Cu, {
              state: e.state,
              draft: e.draft,
              onValidity: i[33] || (i[33] = (u, m) => l("validity", "timer-" + u, m))
            }, null, 8, ["state", "draft"])
          ])
        ]),
        _: 1
      })
    ]));
  }
}), uc = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, cc = { key: 1 }, vc = { class: "work-muted" }, fc = {
  key: 2,
  class: "work-map-zoom",
  role: "group",
  "aria-label": "Map zoom"
}, mc = ["aria-label", "aria-keyshortcuts", "onKeydown"], pc = { class: "work-row" }, bc = { class: "work-process-meaning" }, hc = {
  key: 0,
  class: "work-muted"
}, gc = { class: "work-stack work-tight" }, yc = { class: "work-next-transition work-stack work-tight" }, kc = { class: "work-row work-wrap" }, wc = { class: "work-process-inspector-foot" }, Vc = { class: "work-row work-transition-actions" }, $c = { class: "work-process-meaning" }, xc = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, Cc = { class: "work-stack work-tight" }, Sc = { class: "work-stack" }, Tc = { class: "work-stack work-tight" }, Ic = {
  key: 0,
  class: "work-muted"
}, Dc = { class: "work-stack work-tight" }, Uc = { class: "work-dialog-actions" }, Ec = /* @__PURE__ */ Ve({
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
    const t = e, l = a, o = Bl(ql, void 0), d = G(() => t.draft.processes ?? []), p = B(!1), f = B(""), c = B(""), i = B(""), u = B("Map"), m = B(""), V = B(!1), v = B(), b = B(), y = B(), T = B(), C = B(), U = B(), W = B(!1);
    let L;
    async function _() {
      W.value = !0, await Bt(), C.value?.querySelector('[aria-label="State name"]')?.focus();
    }
    const j = G(() => d.value.find((J) => J.id === c.value) ?? d.value[0]), Z = B(!1);
    function re(J) {
      Z.value = !0, u.value = J;
    }
    function de() {
      !Z.value && T.value?.clientWidth && (u.value = T.value.clientWidth < 480 && (j.value?.states.length ?? 0) > 6 ? "List" : "Map");
    }
    let ye;
    Ea(() => {
      de(), T.value && typeof ResizeObserver < "u" && (ye = new ResizeObserver(de), ye.observe(T.value));
    }), Ct(() => ye?.disconnect()), Ie(j, () => {
      Z.value = !1, de();
    });
    function fe() {
      W.value = !1, V.value = !1, v.value = void 0, b.value = void 0, i.value = "", L = void 0;
    }
    async function le() {
      const J = L, w = o?.selected.value;
      w?.startsWith("workflow/") && o?.choose("workflow", w.slice(9), !1), fe(), await Bt(), J?.isConnected ? J.focus() : A();
    }
    function A() {
      u.value === "Map" ? y.value?.focus() : U.value?.focus();
    }
    async function F() {
      await Bt(), C.value && (C.value.scrollTop = 0, C.value.focus({ preventScroll: !0 }), (C.value.closest(".work-settings-shell")?.clientWidth ?? 1 / 0) <= 700 && C.value.scrollIntoView?.({ block: "nearest" }));
    }
    function R(J, w) {
      L = w, W.value = !1, V.value = !1, v.value = J, b.value = void 0, m.value = "", i.value = "", j.value && o?.choose("workflow", j.value.id + ".state." + J.id, !0), F();
    }
    async function ue(J) {
      m.value = "", V.value = J, await Bt();
      const w = J ? '[role="combobox"]' : "button";
      C.value?.querySelector(".work-next-transition " + w)?.focus();
    }
    function H(J, w) {
      L = w, W.value = !1, b.value = J, v.value = void 0, i.value = "", j.value && o?.choose("workflow", j.value.id + ".transition." + J.id, !0), F();
    }
    Ie([j, u], fe), Ie([() => o?.selected.value, d], async ([J], w) => {
      if (!J?.startsWith("workflow/")) {
        w?.[0]?.startsWith("workflow/") && fe();
        return;
      }
      const [D, $, oe] = J.slice(9).split("."), me = d.value.find((We) => We.id === D);
      if (!me || j.value !== me && (c.value = me.id, await Bt(), o?.selected.value !== J))
        return;
      const $e = $ === "state" ? me.states.find((We) => We.id === oe) : void 0, De = $ === "transition" ? me.transitions?.find((We) => We.id === oe) : void 0;
      $e === v.value && De === b.value || (fe(), v.value = $e, b.value = De);
    }, { immediate: !0, flush: "post" });
    const X = G(() => {
      if (!t.counts || !j.value) return;
      const J = t.countTypes?.filter((w) => w.process === j.value?.id) ?? [];
      return Object.fromEntries(j.value.states.map((w) => [
        w.id,
        J.reduce((D, $) => D + (t.counts?.[$.id]?.[w.id] ?? 0), 0)
      ]));
    }), x = G(() => (t.guards ?? []).filter((J) => t.draft.plugins?.some((w) => w.use === J.plugin))), P = G(() => Object.keys(t.draft.policy?.wip ?? {}).filter((J) => !d.value.some((w) => w.states.some((D) => D.id === J))));
    function E() {
      const J = f.value.trim();
      if (!J) return;
      const w = J.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "") || "process", D = (/^[a-z]/.test(w) ? w : "process_" + w).slice(0, 40), $ = d.value.some((oe) => oe.id === D) ? jt(D, d.value) : D;
      (t.draft.processes ??= []).push({ id: $, name: J, initial: "todo", states: [{ id: "todo", name: "To do", category: "unstarted" }], transitions: [] }), c.value = $, f.value = "", p.value = !1;
    }
    async function N(J, w) {
      const D = { id: jt("state", J.states), name: "New state", category: "started" }, $ = qa(J), oe = $.at(-1), me = v.value ?? (oe?.category === "completed" ? $.at(-2) : oe), $e = me && (J.transitions?.find((De) => De.default && De.from !== "any" && De.from.includes(me.id)) ?? J.transitions?.find((De) => De.from !== "any" && De.from.includes(me.id) && J.states.findIndex((We) => We.id === De.to) > J.states.indexOf(me)));
      if (J.states.splice(me ? J.states.indexOf(me) + 1 : J.states.length, 0, D), me && me.category !== "completed" && me.category !== "canceled")
        if ($e) {
          const De = $e.to;
          $e.to = D.id, (J.transitions ??= []).push({ id: jt("transition", J.transitions ?? []), name: "Continue", from: [D.id], to: De, ...$e.auto && $e.default ? { auto: !0, default: !0 } : {} });
        } else (J.transitions ??= []).push({ id: jt("transition", J.transitions ?? []), name: "Continue", from: [me.id], to: D.id });
      R(D, w), await _();
    }
    function g(J, w, D = L) {
      const $ = j.value;
      if (!$ || !w || J === w) return;
      const oe = $.transitions ??= [], me = `to_${w}`;
      let $e = me.slice(0, 40), De = 2;
      for (; oe.some((lt) => lt.id === $e); ) {
        const lt = `_${De++}`;
        $e = me.slice(0, 40 - lt.length) + lt;
      }
      const We = { id: $e, name: `To ${ge($.states.find((lt) => lt.id === w)).toLowerCase()}`, from: [J], to: w };
      oe.push(We), H(We, D);
    }
    function O(J, w) {
      const D = v.value ?? J.states.find((me) => me.id === J.initial) ?? J.states[0], $ = J.states.find((me) => me.id !== D?.id);
      if (!D || !$) return;
      const oe = { id: jt("transition", J.transitions ?? []), name: "To " + ge($), from: [D.id], to: $.id };
      (J.transitions ??= []).push(oe), H(oe, w);
    }
    async function ne(J) {
      const w = j.value, D = w?.transitions?.indexOf(J) ?? -1;
      if (!w || D < 0) return;
      const $ = Ni(w, J);
      if ($.length) {
        i.value = `Used by ${$.join(", ")}. Update those references first.`;
        return;
      }
      w.transitions.splice(D, 1), fe(), await Bt(), A();
    }
    function ie(J) {
      !b.value || J.defaultPrevented || J.repeat || (J.preventDefault(), ne(b.value));
    }
    function we(J, w) {
      const D = Mi(J, w);
      if (D.length) {
        i.value = `${ge(w)} is used by ${D.join(", ")}. Update these references first.`;
        return;
      }
      J.states.splice(J.states.indexOf(w), 1), le();
    }
    async function Te(J) {
      const w = t.draft.item_types?.filter(($) => $.process === J.id).map(($) => $.title || "Untitled item type") ?? [];
      if (w.length) {
        i.value = `Used by ${w.join(", ")}. Choose a different process for those item types first.`;
        return;
      }
      const D = await t.guardRemoval?.("processes", J.id);
      if (D) {
        i.value = D;
        return;
      }
      Aa(t.draft, "processes", J.id), c.value = "", fe();
    }
    return (J, w) => (n(), h("section", {
      ref_key: "editor",
      ref: T,
      class: "work-process-editor work-stack",
      "aria-label": "Process editor",
      onKeydown: w[19] || (w[19] = qe((D) => C.value && le(), ["esc"]))
    }, [
      i.value && !b.value ? (n(), h("p", uc, I(i.value), 1)) : S("", !0),
      (n(!0), h(Q, null, se(e.issues?.filter((D) => D.code === "process " + j.value?.id) ?? [], (D) => (n(), h("p", {
        key: D.what + D.detail,
        class: "work-error work-small",
        role: "alert"
      }, I(r(tl)(D)) + " · " + I(D.what), 1))), 128)),
      j.value ? (n(), h("div", {
        key: 1,
        class: ft(["work-process-builder", { "work-process-inspecting": v.value || b.value }])
      }, [
        s("div", {
          ref_key: "tools",
          ref: U,
          class: "work-process-controls",
          role: "toolbar",
          "aria-label": "Process tools",
          tabindex: "-1"
        }, [
          d.value.length > 1 ? (n(), Y(r(ce), {
            key: 0,
            "model-value": j.value.id,
            "aria-label": "Process",
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            options: d.value.map((D) => ({ label: D.name || "Untitled process", value: D.id })),
            "onUpdate:modelValue": w[0] || (w[0] = (D) => c.value = D)
          }, null, 8, ["model-value", "options"])) : (n(), h("strong", cc, I(j.value.name || "Untitled process"), 1)),
          k(r(ee), {
            label: "Add state",
            severity: "secondary",
            outlined: "",
            onClick: w[1] || (w[1] = (D) => N(j.value, D.currentTarget))
          }, {
            icon: q(() => [
              k(r(ve), { icon: "tabler:plus" })
            ]),
            _: 1
          }),
          k(r(ee), {
            label: "Add transition",
            severity: "secondary",
            outlined: "",
            disabled: j.value.states.length < 2,
            onClick: w[2] || (w[2] = (D) => O(j.value, D.currentTarget))
          }, null, 8, ["disabled"]),
          k(r(ce), {
            modelValue: j.value.initial,
            "onUpdate:modelValue": w[3] || (w[3] = (D) => j.value.initial = D),
            "aria-label": "Starts in " + r(ge)(j.value.states.find((D) => D.id === j.value.initial)),
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            options: j.value.states.map((D) => ({ label: r(ge)(D), value: D.id }))
          }, {
            value: q(() => [
              s("span", vc, "Starts in " + I(r(ge)(j.value.states.find((D) => D.id === j.value.initial))), 1)
            ]),
            _: 1
          }, 8, ["modelValue", "aria-label", "options"]),
          w[20] || (w[20] = s("span", { class: "work-spacer" }, null, -1)),
          u.value === "Map" ? (n(), h("div", fc, [
            k(r(ee), {
              label: "Fit",
              title: "Fit the map to a readable width",
              text: "",
              severity: "secondary",
              size: "small",
              onClick: w[4] || (w[4] = (D) => y.value?.fit())
            }, {
              icon: q(() => [
                k(r(ve), { icon: "tabler:arrows-maximize" })
              ]),
              _: 1
            }),
            u.value === "Map" ? (n(), Y(r(ee), {
              key: 0,
              "aria-label": "Zoom out",
              title: "Zoom out",
              text: "",
              severity: "secondary",
              size: "small",
              onClick: w[5] || (w[5] = (D) => y.value?.zoomOut())
            }, {
              default: q(() => [
                k(r(ve), { icon: "tabler:minus" })
              ]),
              _: 1
            })) : S("", !0),
            u.value === "Map" ? (n(), Y(r(ee), {
              key: 1,
              "aria-label": "Zoom in",
              title: "Zoom in",
              text: "",
              severity: "secondary",
              size: "small",
              onClick: w[6] || (w[6] = (D) => y.value?.zoomIn())
            }, {
              default: q(() => [
                k(r(ve), { icon: "tabler:plus" })
              ]),
              _: 1
            })) : S("", !0)
          ])) : S("", !0),
          k(r(jl), {
            "model-value": u.value,
            "onUpdate:modelValue": re,
            options: ["Map", "List"],
            "allow-empty": !1,
            "aria-label": "Process layout"
          }, null, 8, ["model-value"]),
          k(r(ee), {
            label: "New process",
            "aria-label": "New process",
            text: "",
            severity: "secondary",
            onClick: w[7] || (w[7] = (D) => p.value = !0)
          }, {
            icon: q(() => [
              k(r(ve), { icon: "tabler:plus" })
            ]),
            _: 1
          })
        ], 512),
        u.value === "Map" ? (n(), Y(wd, {
          key: 0,
          ref_key: "graph",
          ref: y,
          process: j.value,
          draft: e.draft,
          "fit-on-open": "",
          "selected-state": v.value,
          "selected-transition": b.value,
          onState: R,
          onTransition: H,
          onRemoveTransition: ie,
          onConnect: g,
          onClear: le
        }, null, 8, ["process", "draft", "selected-state", "selected-transition"])) : (n(), Y(zd, {
          key: 1,
          process: j.value,
          "selected-state": v.value,
          "selected-transition": b.value,
          counts: X.value,
          onState: R,
          onTransition: H,
          onRemoveState: w[8] || (w[8] = (D) => we(j.value, D)),
          onRemoveTransition: ne
        }, null, 8, ["process", "selected-state", "selected-transition", "counts"])),
        k(Uo, { name: "work-panel" }, {
          default: q(() => [
            v.value || b.value ? (n(), h("aside", {
              key: 0,
              ref_key: "inspector",
              ref: C,
              class: "work-process-sideform",
              tabindex: "-1",
              "aria-label": v.value ? "State inspector" : "Transition inspector",
              "aria-keyshortcuts": b.value ? "Delete Backspace" : void 0,
              onKeydown: [
                qe(Oe(ie, ["self"]), ["delete"]),
                qe(Oe(ie, ["self"]), ["backspace"])
              ]
            }, [
              (n(!0), h(Q, null, se(v.value ? [v.value] : [], (D) => (n(), h(Q, {
                key: D.id
              }, [
                s("header", pc, [
                  W.value ? (n(), Y(r(Se), {
                    key: 1,
                    modelValue: D.name,
                    "onUpdate:modelValue": ($) => D.name = $,
                    class: "work-process-name",
                    "aria-label": "State name",
                    onBlur: w[9] || (w[9] = ($) => W.value = !1)
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])) : (n(), Y(Wl, {
                    key: 0,
                    class: "work-process-state-title",
                    "aria-label": "Rename state",
                    onActivate: _
                  }, {
                    default: q(() => [
                      s("span", null, I(r(ge)(D)), 1)
                    ]),
                    _: 2
                  }, 1024)),
                  k(r(ee), {
                    severity: "secondary",
                    text: "",
                    size: "small",
                    "aria-label": "Close state editor",
                    onClick: le
                  }, {
                    default: q(() => [
                      k(r(ve), { icon: "tabler:x" })
                    ]),
                    _: 1
                  })
                ]),
                s("p", bc, I(r(Ri)(D, e.draft)), 1),
                X.value ? (n(), h("p", hc, I(X.value[D.id] ?? 0) + " " + I(X.value[D.id] === 1 ? "item" : "items") + " currently here", 1)) : S("", !0),
                k(dc, {
                  state: D,
                  process: j.value,
                  draft: e.draft,
                  "board-id": e.boardId,
                  onValidity: ($, oe) => l("validity", $.includes("duration:") ? $ : j.value.id + ":" + D.id + ":" + $, oe)
                }, null, 8, ["state", "process", "draft", "board-id", "onValidity"]),
                s("label", gc, [
                  w[21] || (w[21] = z("Phase", -1)),
                  k(r(ce), {
                    "aria-label": "Phase",
                    modelValue: D.category,
                    "onUpdate:modelValue": ($) => D.category = $,
                    appendTo: "self",
                    optionLabel: "label",
                    optionValue: "value",
                    options: ["triage", "backlog", ...r(Ro)].map(($) => ({ label: r(Ht)($), value: $ }))
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                ]),
                s("div", yc, [
                  V.value ? (n(), h(Q, { key: 1 }, [
                    k(r(ce), {
                      modelValue: m.value,
                      "onUpdate:modelValue": w[11] || (w[11] = ($) => m.value = $),
                      "aria-label": "Next state",
                      placeholder: "Choose the next state",
                      appendTo: "self",
                      optionLabel: "label",
                      optionValue: "value",
                      options: j.value.states.filter(($) => $ !== D).map(($) => ({ label: r(ge)($), value: $.id }))
                    }, null, 8, ["modelValue", "options"]),
                    s("div", kc, [
                      k(r(ee), {
                        label: "Add transition",
                        size: "small",
                        disabled: !m.value,
                        onClick: ($) => g(D.id, m.value)
                      }, null, 8, ["disabled", "onClick"]),
                      k(r(ee), {
                        label: "Cancel",
                        severity: "secondary",
                        text: "",
                        size: "small",
                        onClick: w[12] || (w[12] = ($) => ue(!1))
                      })
                    ])
                  ], 64)) : (n(), Y(r(ee), {
                    key: 0,
                    label: "Add transition",
                    severity: "secondary",
                    outlined: "",
                    size: "small",
                    "aria-expanded": "false",
                    disabled: j.value.states.length < 2,
                    onClick: w[10] || (w[10] = ($) => ue(!0))
                  }, {
                    icon: q(() => [
                      k(r(ve), {
                        icon: "tabler:plus",
                        "aria-hidden": "true"
                      })
                    ]),
                    _: 1
                  }, 8, ["disabled"]))
                ]),
                s("footer", wc, [
                  k(r(ee), {
                    label: "Remove state",
                    severity: "danger",
                    text: "",
                    size: "small",
                    onClick: ($) => we(j.value, D)
                  }, {
                    icon: q(() => [
                      k(r(ve), { icon: "tabler:trash" })
                    ]),
                    _: 1
                  }, 8, ["onClick"])
                ])
              ], 64))), 128)),
              (n(!0), h(Q, null, se(b.value ? [b.value] : [], (D) => (n(), h(Q, {
                key: D.id
              }, [
                s("header", Vc, [
                  w[22] || (w[22] = s("h3", null, "Transition", -1)),
                  k(r(ee), {
                    type: "button",
                    label: "Remove transition",
                    severity: "danger",
                    text: "",
                    size: "small",
                    onClick: ($) => ne(D)
                  }, {
                    icon: q(() => [
                      k(r(ve), { icon: "tabler:trash" })
                    ]),
                    _: 1
                  }, 8, ["onClick"]),
                  k(r(ee), {
                    severity: "secondary",
                    text: "",
                    size: "small",
                    "aria-label": "Close transition editor",
                    onClick: le
                  }, {
                    default: q(() => [
                      k(r(ve), { icon: "tabler:x" })
                    ]),
                    _: 1
                  })
                ]),
                s("p", $c, I(D.from === "any" ? "Any state" : D.from.map(($) => r(ge)(j.value.states.find((oe) => oe.id === $))).join(", ")) + " → " + I(r(ge)(j.value.states.find(($) => $.id === D.to))), 1),
                i.value ? (n(), h("p", xc, I(i.value), 1)) : S("", !0),
                s("label", Cc, [
                  w[23] || (w[23] = z("Name", -1)),
                  k(r(Se), {
                    modelValue: D.name,
                    "onUpdate:modelValue": ($) => D.name = $,
                    placeholder: r(Ge)(D),
                    "aria-label": "Transition name"
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder"])
                ]),
                k(_d, {
                  transition: D,
                  process: j.value,
                  draft: e.draft,
                  "board-id": e.boardId,
                  guards: x.value,
                  onValidity: ($, oe) => l("validity", j.value.id + ":transition-" + D.id + ":" + $, oe)
                }, null, 8, ["transition", "process", "draft", "board-id", "guards", "onValidity"])
              ], 64))), 128))
            ], 40, mc)) : S("", !0)
          ]),
          _: 1
        })
      ], 2)) : (n(), Y(r(ee), {
        key: 2,
        label: "New process",
        severity: "secondary",
        outlined: "",
        onClick: w[13] || (w[13] = (D) => p.value = !0)
      }, {
        icon: q(() => [
          k(r(ve), { icon: "tabler:plus" })
        ]),
        _: 1
      })),
      j.value ? (n(), Y(Re, {
        key: 3,
        class: "work-disclosure",
        label: "Advanced workflow settings"
      }, {
        default: q(() => [
          s("div", Sc, [
            k(Re, {
              class: "work-small",
              label: "Technical details"
            }, {
              default: q(() => [...w[24] || (w[24] = [
                s("p", null, [
                  z("Workflow definitions are "),
                  s("code", null, "processes"),
                  z(" in "),
                  s("code", null, "WorkGetSchema"),
                  z(" and "),
                  s("code", null, "WorkApplySchema"),
                  z(".")
                ], -1)
              ])]),
              _: 1
            }),
            s("label", Tc, [
              w[25] || (w[25] = z("Workflow name", -1)),
              k(r(Se), {
                modelValue: j.value.name,
                "onUpdate:modelValue": w[14] || (w[14] = (D) => j.value.name = D),
                "aria-label": "Workflow name"
              }, null, 8, ["modelValue"])
            ]),
            P.value.length ? (n(), h("p", Ic, "Some item limits belong to removed states.")) : S("", !0),
            (n(!0), h(Q, null, se(P.value, (D, $) => (n(), Y(r(ee), {
              key: D,
              label: "Clear limit for removed state " + ($ + 1),
              severity: "secondary",
              text: "",
              onClick: (oe) => delete e.draft.policy.wip[D]
            }, null, 8, ["label", "onClick"]))), 128)),
            k(r(ee), {
              label: "Remove workflow",
              severity: "danger",
              text: "",
              size: "small",
              onClick: w[15] || (w[15] = (D) => Te(j.value))
            })
          ])
        ]),
        _: 1
      })) : S("", !0),
      k(Ul, {
        visible: p.value,
        label: "New process",
        onClose: w[18] || (w[18] = (D) => p.value = !1)
      }, {
        default: q(() => [
          s("form", {
            class: "work-dialog-box",
            "aria-label": "New process",
            onSubmit: Oe(E, ["stop", "prevent"])
          }, [
            w[27] || (w[27] = s("h2", null, "New process", -1)),
            s("label", Dc, [
              w[26] || (w[26] = z("Name", -1)),
              k(r(Se), {
                modelValue: f.value,
                "onUpdate:modelValue": w[16] || (w[16] = (D) => f.value = D),
                "aria-label": "New process name",
                autofocus: "",
                required: ""
              }, null, 8, ["modelValue"])
            ]),
            s("div", Uc, [
              k(r(ee), {
                label: "Cancel",
                severity: "secondary",
                outlined: "",
                onClick: w[17] || (w[17] = (D) => p.value = !1)
              }),
              k(r(ee), {
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
}), Ac = {
  class: "work-settings-card work-stack",
  "aria-label": "Existing items"
}, Pc = {
  key: 0,
  class: "work-stack work-tight"
}, Oc = { class: "work-row" }, Rc = /* @__PURE__ */ Ve({
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
    return (t, l) => (n(), h("section", Ac, [
      l[2] || (l[2] = s("h3", { class: "work-row-title" }, "Items in changed states", -1)),
      (n(!0), h(Q, null, se(e.removed, ({ process: o, state: d, count: p }) => (n(), h("label", {
        key: o.id + "/" + d.id,
        class: "work-stack work-tight"
      }, [
        z(" Move " + I(a(p)) + " from " + I(r(ge)(d)) + " to ", 1),
        k(r(ce), {
          disabled: e.disabled,
          "model-value": o.map?.[d.id],
          "aria-label": "Move items from " + r(ge)(d) + " to",
          placeholder: "Choose a state",
          appendTo: "self",
          optionLabel: "label",
          optionValue: "value",
          options: o.states.map((f) => ({ label: r(ge)(f), value: f.id })),
          "onUpdate:modelValue": (f) => t.$emit("destination", o, d.id, f)
        }, null, 8, ["disabled", "model-value", "aria-label", "options", "onUpdate:modelValue"])
      ]))), 128)),
      e.renamed.length ? (n(), h("div", Pc, [
        (n(!0), h(Q, null, se(e.renamed, ({ process: o, state: d, count: p, name: f }) => (n(), h("p", {
          key: o.id + "/" + d.id
        }, [
          z(I(r(ge)(d)) + " becomes ", 1),
          s("strong", null, I(f), 1),
          z(" for " + I(a(p)) + ". ", 1)
        ]))), 128)),
        s("label", Oc, [
          k(r(Gt), {
            binary: "",
            "model-value": e.confirmed,
            disabled: e.disabled,
            "onUpdate:modelValue": l[0] || (l[0] = (o) => t.$emit("update:confirmed", o))
          }, null, 8, ["model-value", "disabled"]),
          l[1] || (l[1] = z(" Keep these items in their renamed states ", -1))
        ])
      ])) : S("", !0)
    ]));
  }
}), Nc = {
  class: "work-stack",
  "aria-label": "Links editor"
}, Mc = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, Fc = { class: "work-definition-meta work-muted work-small" }, Lc = { class: "work-settings-grid" }, Bc = { class: "work-stack work-tight" }, zc = { class: "work-stack work-tight" }, jc = { class: "work-stack work-tight" }, Wc = { class: "work-row" }, qc = {
  key: 0,
  class: "work-muted work-small"
}, Gc = {
  key: 1,
  class: "work-settings-grid"
}, Kc = { class: "work-stack work-tight" }, Hc = {
  key: 0,
  class: "work-chips"
}, Yc = { class: "work-stack work-tight" }, Xc = { class: "work-relation-preview work-small" }, Jc = { class: "work-muted" }, Zc = {
  key: 0,
  class: "kx-empty"
}, Qc = /* @__PURE__ */ Ve({
  __name: "RelationsEditor",
  props: {
    draft: {},
    guardRemoval: { type: Function }
  },
  setup(e) {
    const a = e, t = G(() => a.draft.relation_types ?? []), l = G(() => (a.draft.item_types ?? []).map((V) => ({ value: V.id, label: V.title || Me(V.id) })));
    function o(V, v, b) {
      b.length ? V[v] = b : delete V[v];
    }
    function d(V, v) {
      if (!/^[a-z][a-z0-9_]{0,39}$/.test(v)) return "Start with a lowercase letter and use only lowercase letters, numbers or underscores.";
      if (V.to_types?.includes(v)) return "This ID is already in use.";
    }
    function p(V, v) {
      o(V, "to_types", [...V.to_types ?? [], v]);
    }
    const f = B(""), c = B(!1);
    function i(V) {
      const v = V.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, ""), b = (/^[a-z]/.test(v) ? v : "link_" + (v || "new")).slice(0, 40);
      let y = b, T = 2;
      for (; t.value.some((C) => C.id === y); ) {
        const C = "_" + T++;
        y = b.slice(0, 40 - C.length) + C;
      }
      return y;
    }
    function u(V) {
      (a.draft.relation_types ??= []).push({ id: i(V), outward: V, inward: V, cardinality: "many" });
    }
    async function m(V) {
      if (!c.value) {
        c.value = !0, f.value = "";
        try {
          const v = await a.guardRemoval?.("relation_types", V);
          v ? f.value = v : Aa(a.draft, "relation_types", V);
        } finally {
          c.value = !1;
        }
      }
    }
    return (V, v) => (n(), h("section", Nc, [
      f.value ? (n(), h("p", Mc, I(f.value), 1)) : S("", !0),
      k(ll, {
        columns: "relations",
        count: t.value.length
      }, {
        default: q(() => [
          (n(!0), h(Q, null, se(t.value, (b, y) => (n(), Y(al, {
            "route-section": "links",
            "route-id": b.id,
            title: b.outward || r(Me)(b.id),
            kind: b.symmetric ? "Same both ways" : "Different each way",
            key: y,
            class: "work-stack"
          }, {
            usage: q(() => [
              s("span", Fc, I(b.outward || "Related work") + " · " + I(b.inward || "Reverse relation"), 1)
            ]),
            actions: q(() => [
              k(r(ee), {
                severity: "secondary",
                text: "",
                disabled: c.value,
                onClick: (T) => m(b.id),
                "aria-label": "Remove link type",
                size: "small"
              }, {
                default: q(() => [
                  k(r(ve), {
                    icon: "tabler:trash",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["disabled", "onClick"])
            ]),
            default: q(() => [
              s("div", Lc, [
                s("label", Bc, [
                  v[0] || (v[0] = z("Shown on this item ", -1)),
                  k(r(Se), {
                    modelValue: b.outward,
                    "onUpdate:modelValue": (T) => b.outward = T,
                    "aria-label": "Shown on this item"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                s("label", zc, [
                  v[1] || (v[1] = z("Shown on the other item ", -1)),
                  k(r(Se), {
                    modelValue: b.inward,
                    "onUpdate:modelValue": (T) => b.inward = T,
                    "aria-label": "Shown on the other item"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                s("label", jc, [
                  v[2] || (v[2] = z("Links allowed ", -1)),
                  k(r(ce), {
                    "model-value": b.cardinality ?? "many",
                    "onUpdate:modelValue": (T) => b.cardinality = T,
                    "aria-label": "Links allowed",
                    appendTo: "self",
                    optionLabel: "label",
                    optionValue: "value",
                    optionDisabled: "disabled",
                    options: [{ label: "One link", value: "one", disabled: !1 }, { label: "Many links", value: "many", disabled: !1 }]
                  }, null, 8, ["model-value", "onUpdate:modelValue"])
                ]),
                s("label", Wc, [
                  k(r(Gt), {
                    modelValue: b.symmetric,
                    "onUpdate:modelValue": (T) => b.symmetric = T,
                    disabled: !!(b.from_types?.length || b.to_types?.length),
                    "aria-label": "Same meaning in both directions",
                    binary: ""
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"]),
                  v[3] || (v[3] = z("Same meaning in both directions ", -1))
                ])
              ]),
              b.from_types?.length || b.to_types?.length ? (n(), h("p", qc, " Clear the source and target types to use the same meaning in both directions. ")) : S("", !0),
              b.symmetric ? S("", !0) : (n(), h("div", Gc, [
                k(mt, {
                  label: "Source item types",
                  options: l.value,
                  "model-value": b.from_types,
                  "onUpdate:modelValue": (T) => o(b, "from_types", T)
                }, null, 8, ["options", "model-value", "onUpdate:modelValue"]),
                s("div", Kc, [
                  v[4] || (v[4] = s("p", { class: "work-muted work-small" }, "Use the type ID from this board or a peer board. Leave either end empty to allow any type there.", -1)),
                  b.to_types?.length ? (n(), h("div", Hc, [
                    (n(!0), h(Q, null, se(b.to_types, (T) => (n(), Y(r(ee), {
                      key: T,
                      severity: "secondary",
                      text: "",
                      size: "small",
                      label: T + " ×",
                      "aria-label": "Remove target type " + T,
                      onClick: (C) => o(b, "to_types", b.to_types.filter((U) => U !== T))
                    }, null, 8, ["label", "aria-label", "onClick"]))), 128))
                  ])) : S("", !0),
                  k(Da, {
                    action: "Add target type",
                    label: "Target type ID",
                    maxlength: 40,
                    validate: (T) => d(b, T),
                    onAdd: (T) => p(b, T)
                  }, null, 8, ["validate", "onAdd"])
                ])
              ])),
              k(Re, {
                class: "work-disclosure",
                label: "Advanced link settings"
              }, {
                default: q(() => [
                  s("label", Yc, [
                    v[5] || (v[5] = z("Identifier ", -1)),
                    k(r(Se), {
                      modelValue: b.id,
                      "onUpdate:modelValue": (T) => b.id = T,
                      required: "",
                      pattern: "[a-z][a-z0-9_]*",
                      "aria-label": "Relation ID"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ])
                ]),
                _: 2
              }, 1024),
              s("p", Xc, [
                v[6] || (v[6] = s("strong", null, "This item", -1)),
                z(" " + I(b.outward || "relates to") + " ", 1),
                v[7] || (v[7] = s("strong", null, "another item", -1)),
                s("span", Jc, " · reverse: " + I(b.symmetric ? b.outward : b.inward), 1)
              ])
            ]),
            _: 2
          }, 1032, ["route-id", "title", "kind"]))), 128)),
          t.value.length ? S("", !0) : (n(), h("p", Zc, "No link types yet. Add one to connect related work.")),
          k(Da, {
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
function si(e) {
  return typeof e.error == "string" ? e.error : e.error?.message;
}
function Co(e, a) {
  const t = si(e);
  return e.parked ? "Stopped: " + (t ?? "Projection is parked") : t ? "Degraded: " + t : e.bootstrapping ? "Initializing" : e.last_seq >= a ? "Up to date" : "Catching up";
}
function _c(e, a) {
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
  if (o.some(si)) return { kind: "degraded", status: "Degraded" };
}
const ev = {
  class: "work-stack",
  "aria-label": "Plugins editor"
}, tv = {
  key: 0,
  class: "kx-loading"
}, av = {
  key: 1,
  class: "kx-err",
  role: "alert"
}, lv = {
  key: 2,
  class: "work-notice",
  role: "status"
}, ov = { class: "work-block work-small work-error" }, iv = {
  key: 0,
  class: "work-muted work-small"
}, nv = {
  key: 1,
  class: "work-notice"
}, sv = {
  key: 2,
  class: "work-stack work-tight work-plugin-status"
}, rv = {
  key: 0,
  class: "work-muted"
}, dv = { key: 1 }, uv = {
  key: 2,
  class: "work-row"
}, cv = {
  key: 3,
  class: "work-row"
}, vv = {
  key: 0,
  class: "work-small"
}, fv = {
  key: 6,
  class: "work-row"
}, mv = {
  key: 7,
  class: "work-row"
}, pv = {
  key: 8,
  class: "work-row"
}, bv = { class: "work-stack work-tight" }, hv = { key: 0 }, gv = { key: 1 }, yv = { key: 2 }, kv = {
  key: 4,
  class: "work-stack work-tight"
}, wv = {
  key: 0,
  class: "work-muted"
}, Vv = { class: "work-form-actions" }, $v = "kickside.work.planning:plugin", So = /* @__PURE__ */ Ve({
  __name: "PluginsEditor",
  props: /* @__PURE__ */ no({
    boardId: {},
    draft: {},
    schema: {},
    options: {},
    configs: {},
    disabled: { type: Boolean },
    activationLocked: { type: Boolean },
    filters: {}
  }, {
    activeConfigs: { default: () => ({}) },
    activeConfigsModifiers: {}
  }),
  emits: /* @__PURE__ */ no(["configured", "refresh", "review", "validity"], ["update:activeConfigs"]),
  setup(e, { emit: a }) {
    const t = e, l = a, o = Si(e, "activeConfigs"), d = B(""), p = B(""), f = B(""), c = B(/* @__PURE__ */ new Set()), i = B({}), u = B(/* @__PURE__ */ new Set()), m = G(() => t.options.map((H) => {
      const X = j(H.plugin);
      return { plugin: H, current: X, issue: _c(H, X) };
    })), V = G(() => !!d.value || t.disabled), v = G(() => V.value || t.activationLocked), b = {}, y = G(() => (t.draft.item_types ?? []).filter((H) => !["issue", "sprint", "milestone"].includes(H.id)).map((H) => ({ value: H.id, label: H.title || Me(H.id) }))), T = G(() => ["current_sprint", "milestone"].every((H) => t.schema.compiled?.fields?.some((X) => X.code === H))), C = G(() => {
      const H = t.filters;
      return H ? (t.draft.scopes ?? []).filter((X) => !H.some((x) => x.id === X && t.options.some((P) => P.plugin === x.plugin))) : [];
    });
    function U(H) {
      return (t.filters ?? []).filter((X) => X.plugin === H);
    }
    function W(H, X) {
      const x = new Set(U(H).map((N) => N.id)), P = t.draft.scopes ?? [], E = [...P.filter((N) => !x.has(N)), ...X];
      (E.length !== P.length || E.some((N) => !P.includes(N))) && (t.draft.scopes = E);
    }
    function L(H, X) {
      le(H, { ...fe(H), issue_types: X });
    }
    function _(H) {
      return !!H.config_schema && Fo(H.config_schema).length > 0;
    }
    function j(H) {
      return t.schema.plugins?.find((X) => X.plugin === H);
    }
    function Z(H) {
      return j(H)?.active === !0;
    }
    function re(H) {
      return t.draft.plugins?.some((X) => X.use === H) === !0;
    }
    function de(H, X) {
      const x = t.draft.plugins ?? [];
      X && !re(H) && (t.draft.plugins = [...x, { use: H }]), X || (t.draft.plugins = x.filter((P) => P.use !== H), delete t.configs[H], c.value.delete(H), l("validity", H, !0), W(H, []));
    }
    function ye(H, X) {
      de(H, !1), l("review", X.currentTarget);
    }
    function fe(H) {
      return Z(H) ? o.value[H] ?? j(H)?.config ?? b : t.configs[H] ?? b;
    }
    function le(H, X) {
      Z(H) ? o.value = { ...o.value, [H]: X } : t.configs[H] = X;
    }
    function A(H) {
      if (Z(H)) {
        const X = { ...o.value };
        delete X[H], o.value = X;
      } else delete t.configs[H];
    }
    function F(H, X) {
      X ? c.value.delete(H) : c.value.add(H), Z(H) || l("validity", H, X);
    }
    async function R(H) {
      await Bo.confirm({
        header: "Reset projection?",
        message: "Resetting can rebuild from current items or replay retained events, depending on the projection.",
        acceptLabel: "Reset projection",
        rejectLabel: "Cancel"
      }) && await ue(H, !0);
    }
    async function ue(H, X = !1) {
      if (!(V.value || !X && c.value.has(H))) {
        d.value = H, p.value = "", f.value = "";
        try {
          X ? await It.configure(t.boardId, H) : (await It.configure(t.boardId, H, fe(H)), A(H), u.value.delete(H)), f.value = X ? "Plugin recovery started." : "Plugin configuration saved.", l("configured");
        } catch (x) {
          p.value = rt(x, X ? "Could not recover the plugin." : "Could not configure plugin.");
        } finally {
          d.value = "";
        }
      }
    }
    return (H, X) => (n(), h("section", ev, [
      e.options.length ? S("", !0) : (n(), h("p", tv, "No installed plugins are visible to you.")),
      p.value ? (n(), h("div", av, I(p.value), 1)) : S("", !0),
      f.value ? (n(), h("p", lv, I(f.value), 1)) : S("", !0),
      k(ll, {
        columns: "plugins",
        count: e.options.length
      }, {
        default: q(() => [
          (n(!0), h(Q, null, se(m.value, ({ plugin: x, current: P, issue: E }) => (n(), Y(al, {
            "route-section": "plugins",
            "route-id": x.plugin,
            key: x.plugin,
            title: x.installed === !1 ? x.plugin : x.title || x.plugin,
            description: x.description,
            kind: re(x.plugin) && c.value.has(x.plugin) ? "Configuration needed" : re(x.plugin) !== Z(x.plugin) ? "Pending review" : E?.status,
            class: "work-stack"
          }, Ll({
            actions: q(() => [
              E?.kind !== "missing" ? (n(), Y(r(tt), {
                key: 0,
                "model-value": re(x.plugin),
                "aria-label": "Enable " + (x.title || x.plugin),
                disabled: v.value || !!x.problem && !re(x.plugin),
                "onUpdate:modelValue": (N) => de(x.plugin, N)
              }, null, 8, ["model-value", "aria-label", "disabled", "onUpdate:modelValue"])) : S("", !0)
            ]),
            default: q(() => [
              x.requires.length ? (n(), h("p", iv, "Requires " + I(x.requires.map((N) => e.options.find((g) => g.plugin === N)?.title || "Another capability").join(", ")), 1)) : S("", !0),
              P?.outdated ? (n(), h("p", nv, "The stored declaration differs from the installed plugin. Review activation to update it.")) : S("", !0),
              E || P?.active ? (n(), h("div", sv, [
                E && "cause" in E ? (n(), h("p", rv, I(E.cause), 1)) : E ? S("", !0) : (n(), h("p", dv, I(P?.lifecycle.state === "ready" ? "Ready to use" : "Getting ready"), 1)),
                (n(!0), h(Q, null, se(P?.projections, (N, g) => (n(), h("div", {
                  key: g,
                  class: "work-stack work-tight"
                }, [
                  s("p", null, I(r(Co)(N, e.schema.as_of)) + " · Indexed through " + I(N.last_seq) + " of " + I(e.schema.as_of) + " events.", 1)
                ]))), 128)),
                E?.kind === "setup" && P?.active ? (n(), h("div", uv, [
                  k(r(ee), {
                    label: "Retry setup",
                    severity: "secondary",
                    outlined: "",
                    disabled: V.value,
                    onClick: (N) => ue(x.plugin, !0)
                  }, null, 8, ["disabled", "onClick"])
                ])) : E?.kind === "provider" ? (n(), h("div", cv, [
                  k(r(ee), {
                    label: "Retry schema check",
                    severity: "secondary",
                    outlined: "",
                    disabled: V.value,
                    onClick: X[0] || (X[0] = (N) => l("refresh"))
                  }, null, 8, ["disabled"])
                ])) : E?.kind === "degraded" ? (n(), Y(Re, {
                  key: 4,
                  class: "work-small",
                  label: "Inspect worker"
                }, {
                  default: q(() => [
                    X[1] || (X[1] = s("p", null, "Check the failing worker before resetting a projection.", -1)),
                    (n(!0), h(Q, null, se(P?.projections, (N, g) => (n(), h("p", { key: g }, I(g) + " · " + I(r(Co)(N, e.schema.as_of)), 1))), 128))
                  ]),
                  _: 2
                }, 1024)) : E?.kind === "history" ? (n(), h(Q, { key: 5 }, [
                  E.floor !== void 0 ? (n(), h("p", vv, "Earliest retained event sequence is " + I(E.floor) + ".", 1)) : S("", !0),
                  k(Re, {
                    class: "work-small",
                    label: "Review retained history"
                  }, {
                    default: q(() => [...X[2] || (X[2] = [
                      s("p", null, "Ask the plugin maintainer to review the event projection’s start sequence. The plugin needs a declaration that can run with the retained history.", -1)
                    ])]),
                    _: 1
                  })
                ], 64)) : E?.kind === "reset" ? (n(), h("div", fv, [
                  k(r(ee), {
                    label: "Reset projection",
                    severity: "secondary",
                    outlined: "",
                    disabled: V.value,
                    onClick: (N) => R(x.plugin)
                  }, null, 8, ["disabled", "onClick"]),
                  X[3] || (X[3] = s("span", { class: "work-muted work-small" }, "Resolve the worker error before resetting.", -1))
                ])) : E?.kind === "configuration" && re(x.plugin) && _(x) && !u.value.has(x.plugin) ? (n(), h("div", mv, [
                  k(r(ee), {
                    label: "Edit configuration",
                    severity: "secondary",
                    outlined: "",
                    disabled: V.value,
                    onClick: (N) => u.value.add(x.plugin)
                  }, null, 8, ["disabled", "onClick"])
                ])) : E?.kind === "missing" && re(x.plugin) ? (n(), h("div", pv, [
                  k(r(ee), {
                    label: "Review references",
                    severity: "secondary",
                    outlined: "",
                    disabled: v.value,
                    onClick: (N) => ye(x.plugin, N)
                  }, null, 8, ["disabled", "onClick"])
                ])) : S("", !0)
              ])) : S("", !0),
              x.installed ? (n(), Y(Re, {
                key: 3,
                class: "work-disclosure work-small",
                label: "Technical details"
              }, {
                default: q(() => [
                  s("dl", bv, [
                    s("div", null, [
                      X[4] || (X[4] = s("dt", null, "Plugin ID", -1)),
                      s("dd", null, [
                        s("code", null, I(x.plugin), 1)
                      ])
                    ]),
                    (P?.interface_version ?? x.interface_version) != null ? (n(), h("div", hv, [
                      X[5] || (X[5] = s("dt", null, "Interface version", -1)),
                      s("dd", null, I(P?.interface_version ?? x.interface_version), 1)
                    ])) : S("", !0),
                    P?.version ? (n(), h("div", gv, [
                      X[6] || (X[6] = s("dt", null, "Active schema version", -1)),
                      s("dd", null, I(P.version), 1)
                    ])) : S("", !0),
                    X[8] || (X[8] = s("div", null, [
                      s("dt", null, "Configuration tool"),
                      s("dd", null, [
                        s("code", null, "WorkConfigurePlugin")
                      ])
                    ], -1)),
                    x.tools.length ? (n(), h("div", yv, [
                      X[7] || (X[7] = s("dt", null, "Plugin tools", -1)),
                      s("dd", null, [
                        (n(!0), h(Q, null, se(x.tools, (N) => (n(), h("code", {
                          key: N,
                          class: "work-block"
                        }, I(N), 1))), 128))
                      ])
                    ])) : S("", !0)
                  ])
                ]),
                _: 2
              }, 1024)) : S("", !0),
              U(x.plugin).length && (re(x.plugin) || Z(x.plugin)) ? (n(), h("section", kv, [
                X[9] || (X[9] = s("h4", null, "Query filters", -1)),
                X[10] || (X[10] = s("p", { class: "work-muted" }, "Choose which filters people can use to narrow down work on this board.", -1)),
                k(mt, {
                  label: "Available filters",
                  disabled: !!d.value || e.disabled || !re(x.plugin),
                  options: U(x.plugin).map((N) => ({ value: N.id, label: N.title })),
                  "model-value": e.draft.scopes?.filter((N) => U(x.plugin).some((g) => g.id === N)),
                  "onUpdate:modelValue": (N) => W(x.plugin, N)
                }, null, 8, ["disabled", "options", "model-value", "onUpdate:modelValue"])
              ])) : S("", !0),
              re(x.plugin) && _(x) && E?.kind !== "manifest" && E?.kind !== "missing" && (E?.kind !== "configuration" || u.value.has(x.plugin)) ? (n(), Y(ra(E && E.kind !== "configuration" ? Re : "div"), {
                key: 5,
                label: E && E.kind !== "configuration" ? "Plugin settings" : void 0,
                class: "work-stack work-tight"
              }, {
                default: q(() => [
                  x.plugin === $v ? (n(), h(Q, { key: 0 }, [
                    T.value ? (n(), Y(mt, {
                      key: 1,
                      label: "Plan these item types",
                      options: y.value,
                      "model-value": fe(x.plugin).issue_types,
                      disabled: !!d.value || e.disabled,
                      "onUpdate:modelValue": (N) => L(x.plugin, N)
                    }, null, 8, ["options", "model-value", "disabled", "onUpdate:modelValue"])) : (n(), h("p", wv, "The Planning pack supplies sprint and milestone fields for item types.")),
                    X[11] || (X[11] = s("p", { class: "work-muted" }, "Selected types get Current sprint and Milestone fields.", -1))
                  ], 64)) : (n(), Y(Mo, {
                    key: 1,
                    disabled: !!d.value || e.disabled,
                    schema: x.config_schema,
                    "model-value": fe(x.plugin),
                    "suggest-defaults": "",
                    "onUpdate:modelValue": (N) => le(x.plugin, N),
                    onValidity: (N) => F(x.plugin, N),
                    onValidationMessage: (N) => i.value[x.plugin] = N
                  }, null, 8, ["disabled", "schema", "model-value", "onUpdate:modelValue", "onValidity", "onValidationMessage"])),
                  s("div", Vv, [
                    k(r(ee), {
                      label: E ? "Reset form values" : "Reset",
                      severity: "secondary",
                      outlined: "",
                      disabled: !!d.value || e.disabled,
                      onClick: (N) => A(x.plugin)
                    }, null, 8, ["label", "disabled", "onClick"]),
                    Z(x.plugin) ? (n(), Y(r(ee), {
                      key: 0,
                      label: "Save plugin settings",
                      disabled: !!d.value || e.disabled || c.value.has(x.plugin) || !o.value[x.plugin],
                      loading: d.value === x.plugin,
                      onClick: (N) => ue(x.plugin)
                    }, null, 8, ["disabled", "loading", "onClick"])) : S("", !0)
                  ])
                ]),
                _: 2
              }, 1032, ["label"])) : S("", !0)
            ]),
            _: 2
          }, [
            re(x.plugin) && i.value[x.plugin] ? {
              name: "status",
              fn: q(() => [
                s("span", ov, I(i.value[x.plugin]), 1)
              ]),
              key: "0"
            } : void 0
          ]), 1032, ["route-id", "title", "description", "kind"]))), 128))
        ]),
        _: 1
      }, 8, ["count"]),
      C.value.length ? (n(), Y(Re, {
        key: 3,
        class: "work-settings-card work-disclosure",
        label: "Unavailable query filters"
      }, {
        default: q(() => [
          X[12] || (X[12] = s("p", { class: "work-muted" }, "These filters came from a plugin that is unavailable. Remove one to stop using it on this board.", -1)),
          (n(!0), h(Q, null, se(C.value, (x, P) => (n(), Y(r(ee), {
            key: x,
            label: "Remove unavailable filter " + (P + 1),
            severity: "secondary",
            text: "",
            onClick: (E) => e.draft.scopes = e.draft.scopes?.filter((N) => N !== x)
          }, null, 8, ["label", "onClick"]))), 128))
        ]),
        _: 1
      })) : S("", !0),
      (n(!0), h(Q, null, se(e.draft.plugins?.filter((x) => !e.options.some((P) => P.plugin === x.use)) ?? [], (x) => (n(), h("article", {
        key: x.use,
        class: "work-settings-card work-stack"
      }, [
        s("p", null, [
          s("strong", null, I(x.use), 1),
          X[13] || (X[13] = z(" · Not installed", -1))
        ]),
        X[14] || (X[14] = s("p", { class: "work-muted" }, "This board still references a plugin that is no longer installed.", -1)),
        k(r(ee), {
          label: "Review references",
          severity: "secondary",
          outlined: "",
          disabled: v.value,
          onClick: (P) => ye(x.use, P)
        }, null, 8, ["disabled", "onClick"])
      ]))), 128))
    ]));
  }
}), xv = { class: "system-section-head" }, Cv = { class: "system-section-head-text" }, Sv = {
  key: 0,
  class: "kx-head-actions"
}, Tv = /* @__PURE__ */ Ve({
  __name: "SettingsSectionHead",
  props: {
    title: {},
    description: {}
  },
  setup(e) {
    return (a, t) => (n(), h("header", xv, [
      s("div", Cv, [
        s("h1", null, I(e.title), 1),
        s("p", null, I(e.description), 1)
      ]),
      a.$slots.actions ? (n(), h("div", Sv, [
        Ze(a.$slots, "actions")
      ])) : S("", !0)
    ]));
  }
}), Iv = /* @__PURE__ */ Ve({
  __name: "SettingsDraftActions",
  props: {
    busy: { type: Boolean },
    discardDisabled: { type: Boolean },
    reviewDisabled: { type: Boolean }
  },
  emits: ["discard", "review"],
  setup(e) {
    return (a, t) => (n(), h(Q, null, [
      k(r(at), {
        severity: "warn",
        value: "Unsaved changes"
      }),
      k(r(ee), {
        label: "Discard",
        type: "button",
        severity: "secondary",
        outlined: "",
        disabled: e.busy || e.discardDisabled,
        onClick: t[0] || (t[0] = (l) => a.$emit("discard"))
      }, {
        icon: q(() => [
          k(r(ve), {
            icon: "tabler:restore",
            "aria-hidden": "true"
          })
        ]),
        _: 1
      }, 8, ["disabled"]),
      k(r(ee), {
        label: "Review changes",
        type: "button",
        disabled: e.busy || e.reviewDisabled,
        loading: e.busy,
        onClick: t[1] || (t[1] = (l) => a.$emit("review", l.currentTarget))
      }, null, 8, ["disabled", "loading"])
    ], 64));
  }
}), Dv = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, Uv = ["config"], Ev = /* @__PURE__ */ Ve({
  __name: "BoardShare",
  props: {
    board: {},
    busy: { type: Boolean }
  },
  emits: ["shared"],
  setup(e) {
    const a = e, t = B(!1), l = B(!1), o = B("");
    async function d() {
      const f = a.board;
      if (!(a.busy || l.value)) {
        l.value = !0, o.value = "";
        try {
          const c = await Pt("kickside-share");
          if (a.board.board_id !== f.board_id) return;
          c ? t.value = !0 : o.value = "Sharing is unavailable. Try opening it again.";
        } finally {
          l.value = !1;
        }
      }
    }
    Ie(() => a.board.board_id, () => {
      t.value = !1, o.value = "";
    });
    const p = G(() => {
      const f = encodeURIComponent(a.board.board_id);
      return JSON.stringify({
        resource_id: a.board.board_id,
        title: a.board.title,
        access_url: "/api/v1/component-access/grants/" + f,
        share_url: "/api/v1/component-access/share/" + f
      });
    });
    return (f, c) => (n(), h(Q, null, [
      k(r(ee), {
        label: "Share board",
        severity: "secondary",
        outlined: "",
        loading: l.value,
        disabled: e.busy,
        onClick: d
      }, {
        icon: q(() => [
          k(r(ve), {
            icon: "tabler:share",
            "aria-hidden": "true"
          })
        ]),
        _: 1
      }, 8, ["loading", "disabled"]),
      o.value ? (n(), h("p", Dv, I(o.value), 1)) : S("", !0),
      t.value ? (n(), h("kickside-share", {
        key: 1,
        config: p.value,
        onClose: c[0] || (c[0] = (i) => t.value = !1),
        onChanged: c[1] || (c[1] = (i) => f.$emit("shared"))
      }, null, 40, Uv)) : S("", !0)
    ], 64));
  }
}), Av = {
  class: "work-stack",
  "aria-label": "Board visibility"
}, Pv = { class: "work-stack work-tight" }, Ov = {
  key: 0,
  class: "work-settings-list"
}, Rv = { class: "work-row-main" }, Nv = { class: "work-small work-muted" }, Mv = { class: "work-row-control" }, Fv = { class: "work-row" }, Lv = /* @__PURE__ */ Ve({
  __name: "VisibilityEditor",
  props: {
    draft: {},
    boardId: {}
  },
  emits: ["validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = G(() => t.draft.visibility), d = G(() => (t.draft.fields ?? []).filter((m) => m.form === "text" && (!m.cardinality || m.cardinality === "one") && m.type !== "rollup" && m.index !== "number" && m.config?.case !== "insensitive")), p = G(() => d.value.find((m) => m.code === o.value?.field)?.type !== "option");
    function f(m) {
      if (o.value?.levels.some((V) => V.id === m)) return "This level is already in use.";
    }
    function c(m) {
      o.value?.levels.push({ id: m, holders: [] });
    }
    function i(m) {
      if (!m) {
        delete t.draft.visibility;
        return;
      }
      const V = d.value.find((v) => v.code === m);
      t.draft.visibility = { field: m, levels: (V?.options ?? []).map((v) => ({ id: v.id, holders: [] })) };
    }
    function u(m, V) {
      const v = o.value?.levels.find((b) => b.id === m);
      v && (v.holders = V ?? []);
    }
    return (m, V) => (n(), h("section", Av, [
      V[7] || (V[7] = s("h3", { class: "work-group-title" }, "Board visibility", -1)),
      V[8] || (V[8] = s("p", { class: "work-small work-muted" }, "Restrict items by their visibility level. People still need access to the board.", -1)),
      s("label", Pv, [
        V[5] || (V[5] = z("Visibility field ", -1)),
        k(r(ce), {
          "aria-label": "Visibility field",
          "model-value": o.value?.field ?? "",
          options: [{ label: "No additional restriction", value: "" }, ...d.value.map((v) => ({ label: r(Xe)(v), value: v.code }))],
          optionLabel: "label",
          optionValue: "value",
          appendTo: "self",
          "onUpdate:modelValue": i
        }, null, 8, ["model-value", "options"])
      ]),
      o.value ? (n(), h(Q, { key: 0 }, [
        o.value.levels.length ? (n(), h("div", Ov, [
          (n(!0), h(Q, null, se(o.value.levels, (v, b) => (n(), h("div", {
            key: v.id,
            class: "work-settings-row"
          }, [
            s("div", Rv, [
              s("strong", null, I(d.value.find((y) => y.code === o.value.field)?.options?.find((y) => y.id === v.id)?.label || v.id), 1),
              s("p", Nv, "Level " + I(b + 1), 1)
            ]),
            s("div", Mv, [
              k(qo, {
                "board-id": e.boardId,
                label: "Who can see these items",
                "model-value": v.holders,
                "onUpdate:modelValue": (y) => u(v.id, y),
                onValidity: V[0] || (V[0] = (y) => l("validity", y))
              }, null, 8, ["board-id", "model-value", "onUpdate:modelValue"])
            ])
          ]))), 128))
        ])) : S("", !0),
        p.value ? (n(), Y(Da, {
          key: o.value.field,
          action: "Add level",
          label: "New visibility level",
          validate: f,
          onAdd: c
        })) : S("", !0),
        s("label", Fv, [
          k(r(tt), {
            "model-value": o.value.bypass === "admin",
            "onUpdate:modelValue": V[1] || (V[1] = (v) => v ? o.value.bypass = "admin" : delete o.value.bypass)
          }, null, 8, ["model-value"]),
          V[6] || (V[6] = z(" Board administrators can see every level ", -1))
        ]),
        k(r(ee), {
          label: "Remove visibility restriction",
          severity: "secondary",
          text: "",
          onClick: V[2] || (V[2] = (v) => delete e.draft.visibility)
        })
      ], 64)) : S("", !0),
      k(Ot, {
        label: "Visibility rules",
        "model-value": o.value,
        shape: "object",
        example: { field: "visibility", levels: [{ id: "internal", holders: [] }], bypass: "admin" },
        "onUpdate:modelValue": V[3] || (V[3] = (v) => e.draft.visibility = v),
        onValidity: V[4] || (V[4] = (v) => l("validity", v))
      }, null, 8, ["model-value"])
    ]));
  }
}), Bv = { class: "work-ia-section" }, zv = {
  class: "work-settings-list",
  "aria-labelledby": "work-sharing-title"
}, jv = { class: "work-settings-row" }, Wv = { class: "work-row-main" }, qv = {
  key: 0,
  class: "work-muted work-small"
}, Gv = {
  key: 0,
  class: "work-member-preview",
  "aria-label": "People and groups with direct access"
}, Kv = { class: "work-spacer" }, Hv = {
  key: 1,
  class: "work-settings-row work-muted work-small"
}, Yv = {
  key: 2,
  class: "work-settings-row work-muted"
}, Xv = {
  key: 3,
  class: "work-settings-row"
}, Jv = {
  key: 4,
  class: "work-settings-row work-muted",
  role: "status"
}, Zv = /* @__PURE__ */ Ve({
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
    const a = e, t = B(), l = B([]), o = G(() => t.value?.filter((b) => b.subject_type === "group").length ?? 0), d = G(() => (t.value?.length ?? 0) - o.value), p = G(() => [...t.value ?? []].sort((b, y) => +!!y.owner - +!!b.owner || y.access_mask - b.access_mask).slice(0, 6).map((b) => ({ ...b, permissions: u(b) }))), f = G(() => p.value.map((b) => ({ id: b.subject_id, kind: b.subject_type ?? "user" }))), c = Lo(() => a.boardId, f);
    function i(b) {
      return b.full_name || c.label({ id: b.subject_id, kind: b.subject_type ?? "user", email: b.email });
    }
    function u(b) {
      return b.owner ? "Owner" : l.value.filter((y) => (b.access_mask & y.bit) === y.bit).map((y) => y.label).join(", ");
    }
    const m = B(!1), V = $a();
    async function v() {
      const b = V();
      m.value = !1;
      try {
        const [{ data: y }, T] = await Promise.all([
          El.get("/api/v1/component-access/grants/" + encodeURIComponent(a.boardId)),
          El.get("/api/v1/components/access-model")
        ]);
        if (!b()) return;
        if (!y?.success || !Array.isArray(y.access)) throw new Error("Grants unavailable");
        t.value = y.access, l.value = T.data?.success && Array.isArray(T.data.capabilities) ? T.data.capabilities : [];
      } catch {
        b() && (t.value = void 0, m.value = !0);
      }
    }
    return zl(() => V()), Ie(() => [a.active, a.boardId], () => {
      a.active && v();
    }, { immediate: !0 }), (b, y) => (n(), h("section", Bv, [
      s("section", zv, [
        s("div", jv, [
          s("div", Wv, [
            y[1] || (y[1] = s("h3", {
              id: "work-sharing-title",
              class: "work-row-title"
            }, "Members and sharing", -1)),
            t.value ? (n(), h("p", qv, I(d.value) + " " + I(d.value === 1 ? "person" : "people") + " and " + I(o.value) + " " + I(o.value === 1 ? "group" : "groups") + " with direct access", 1)) : S("", !0)
          ]),
          e.board ? (n(), Y(Ev, {
            key: 0,
            board: e.board,
            busy: e.busy,
            onShared: v
          }, null, 8, ["board", "busy"])) : S("", !0)
        ]),
        p.value.length ? (n(), h("ul", Gv, [
          (n(!0), h(Q, null, se(p.value, (T) => (n(), h("li", {
            key: T.subject_type + T.subject_id,
            class: "work-settings-row"
          }, [
            k(r(ve), {
              icon: T.subject_type === "group" ? "tabler:users" : "tabler:user",
              "aria-hidden": "true"
            }, null, 8, ["icon"]),
            s("strong", Kv, I(i(T)), 1),
            T.permissions ? (n(), Y(r(at), {
              key: 0,
              class: "kx-tag-sm",
              severity: "secondary",
              value: T.permissions
            }, null, 8, ["value"])) : S("", !0)
          ]))), 128))
        ])) : S("", !0),
        t.value && t.value.length > p.value.length ? (n(), h("p", Hv, " See all " + I(t.value.length) + " people and groups under Share board. ", 1)) : t.value && !t.value.length ? (n(), h("p", Yv, "No direct grants yet.")) : m.value ? (n(), h("div", Xv, [
          y[2] || (y[2] = s("p", {
            class: "work-spacer work-muted",
            role: "alert"
          }, "Member summary is unavailable.", -1)),
          k(r(ee), {
            label: "Reload members",
            severity: "secondary",
            text: "",
            onClick: v
          })
        ])) : t.value ? S("", !0) : (n(), h("p", Jv, "Loading members…"))
      ]),
      k(Re, {
        class: "work-disclosure",
        label: e.draft.visibility ? "Advanced · Item visibility rules set" : "Advanced · Item visibility"
      }, {
        default: q(() => [
          k(Lv, {
            "board-id": e.boardId,
            draft: e.draft,
            onValidity: y[0] || (y[0] = (T) => b.$emit("validity", T))
          }, null, 8, ["board-id", "draft"])
        ]),
        _: 1
      }, 8, ["label"])
    ]));
  }
}), Qv = { class: "work-settings-row" }, _v = ["for"], ef = { class: "work-settings-row" }, tf = { class: "work-row-main" }, af = ["id"], lf = { class: "work-settings-grid" }, of = { class: "work-stack work-tight" }, nf = { class: "work-stack work-tight" }, sf = ["value", "inert"], rf = {
  key: 1,
  class: "work-muted work-small"
}, df = {
  key: 0,
  class: "work-settings-row"
}, uf = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, cf = {
  key: 1,
  class: "work-muted work-small",
  role: "status"
}, vf = {
  key: 1,
  class: "work-board-identity work-stack work-tight"
}, ff = { class: "work-stack work-tight" }, mf = { class: "work-stack work-tight" }, pf = { class: "work-stack work-tight" }, bf = ["value", "inert"], hf = {
  key: 1,
  class: "work-muted work-small"
}, gf = { class: "work-row" }, yf = { class: "work-row" }, kf = { class: "work-row work-board-title" }, wf = {
  key: 1,
  class: "work-identity-actions"
}, Vf = ["title"], $f = {
  key: 2,
  class: "kx-err work-inline",
  role: "alert"
}, xf = {
  key: 3,
  class: "work-muted work-small",
  role: "status"
}, Cf = /* @__PURE__ */ Ve({
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
    const t = e, l = a, o = B(!1), d = B(!1), p = B(""), f = B(""), c = B(""), i = B(""), u = B(!1), m = B(!1), V = B(""), v = B(""), b = G(() => t.board?.access?.admin === !0), y = Kt(), T = Kt(), C = B({ title: "", description: "", icon: "", app: "" }), U = G(() => [
      { id: "", title: "Default app" },
      ...t.boardApps ?? [],
      ...t.board?.ui_app && !t.boardApps?.some((A) => A.id === t.board?.ui_app) ? [{ id: t.board.ui_app, title: t.boardApps ? "Unavailable app" : "Configured board app", disabled: !0 }] : []
    ]), W = G(() => U.value.find((A) => A.id === i.value)?.title), L = G(() => !!t.boardApps?.length || !!t.board?.ui_app), _ = G(() => ({
      title: t.board?.title ?? "",
      icon: t.board?.icon ?? "",
      description: t.board?.description ?? "",
      app: t.board?.ui_app ?? ""
    }));
    function j() {
      C.value = _.value, p.value = _.value.title, c.value = _.value.icon, f.value = _.value.description, i.value = _.value.app;
    }
    function Z() {
      Pt("wc-icon-picker").then((A) => u.value = A);
    }
    function re() {
      j(), V.value = "", v.value = "", o.value = !0, Z();
    }
    const de = G(() => {
      const A = {};
      return p.value.trim() !== C.value.title && (A.title = p.value.trim()), f.value !== C.value.description && (A.description = f.value), c.value !== C.value.icon && (A.icon = c.value), i.value !== C.value.app && (A.ui_app = i.value), A;
    }), ye = G(() => (t.detail || o.value) && Object.keys(de.value).length > 0);
    Ie(_, () => {
      t.detail && !ye.value && j();
    }, { immediate: !0 }), Ie(d, (A) => {
      A && Z();
    }), Ie(b, (A) => {
      A || fe();
    }), Ie(ye, (A) => l("dirty-change", A));
    function fe() {
      o.value = !1, V.value = "", v.value = "", j();
    }
    async function le() {
      if (!b.value || !t.board || m.value || !p.value.trim()) return;
      const A = de.value;
      if (!Object.keys(A).length) {
        o.value = !1, v.value = "Nothing changed.";
        return;
      }
      m.value = !0, V.value = "";
      try {
        const F = await Et.updateBoard(t.board.board_id, A);
        p.value = p.value.trim(), C.value = { title: p.value, description: f.value, icon: c.value, app: i.value }, o.value = !1, v.value = F.status === "unchanged" ? "Nothing changed." : "Board saved.", l("saved");
      } catch (F) {
        V.value = rt(F, "Could not save the board.");
      } finally {
        m.value = !1;
      }
    }
    return (A, F) => e.detail ? (n(), h("form", {
      key: 0,
      class: "work-board-identity",
      "aria-label": "Edit board details",
      onSubmit: Oe(le, ["prevent"])
    }, [
      s("div", Qv, [
        s("label", {
          for: r(y),
          class: "work-row-main work-row-title"
        }, "Board name", 8, _v),
        k(r(Se), {
          id: r(y),
          modelValue: p.value,
          "onUpdate:modelValue": F[0] || (F[0] = (R) => p.value = R),
          required: "",
          disabled: m.value || !b.value
        }, null, 8, ["id", "modelValue", "disabled"])
      ]),
      s("div", ef, [
        s("div", tf, [
          s("h3", {
            class: "work-row-title",
            id: r(T)
          }, "Board app", 8, af),
          F[9] || (F[9] = s("p", { class: "work-muted work-small" }, "Opens the board from Work navigation.", -1))
        ]),
        k(r(ce), {
          modelValue: i.value,
          "onUpdate:modelValue": F[1] || (F[1] = (R) => i.value = R),
          "aria-labelledby": r(T),
          options: U.value,
          placeholder: W.value,
          optionLabel: "title",
          optionValue: "id",
          optionDisabled: "disabled",
          appendTo: "self",
          disabled: m.value || !b.value || !L.value
        }, null, 8, ["modelValue", "aria-labelledby", "options", "placeholder", "disabled"])
      ]),
      Ze(A.$slots, "default"),
      k(Re, {
        open: d.value,
        "onUpdate:open": F[4] || (F[4] = (R) => d.value = R),
        class: "work-board-appearance",
        label: "Board description and icon"
      }, {
        default: q(() => [
          s("div", lf, [
            s("label", of, [
              F[10] || (F[10] = z("Description", -1)),
              k(r(Ua), {
                modelValue: f.value,
                "onUpdate:modelValue": F[2] || (F[2] = (R) => f.value = R),
                rows: "1",
                disabled: m.value || !b.value
              }, null, 8, ["modelValue", "disabled"])
            ]),
            s("div", nf, [
              F[11] || (F[11] = s("span", null, "Board icon", -1)),
              u.value ? (n(), h("wc-icon-picker", {
                key: 0,
                value: c.value,
                fallback: "tabler:layout-kanban",
                inert: m.value || !b.value || void 0,
                onSelect: F[3] || (F[3] = (R) => c.value = R.detail)
              }, null, 40, sf)) : (n(), h("p", rf, "The icon picker is unavailable."))
            ])
          ])
        ]),
        _: 1
      }, 8, ["open"]),
      ye.value || V.value || v.value ? (n(), h("div", df, [
        V.value ? (n(), h("p", uf, I(V.value), 1)) : v.value && !ye.value ? (n(), h("p", cf, I(v.value), 1)) : S("", !0),
        ye.value ? (n(), h(Q, { key: 2 }, [
          k(r(ee), {
            label: "Save board details",
            type: "submit",
            size: "small",
            disabled: !p.value.trim() || m.value || !b.value,
            loading: m.value
          }, null, 8, ["disabled", "loading"]),
          k(r(ee), {
            label: "Cancel",
            type: "button",
            severity: "secondary",
            text: "",
            size: "small",
            disabled: m.value,
            onClick: fe
          }, null, 8, ["disabled"])
        ], 64)) : S("", !0)
      ])) : S("", !0)
    ], 32)) : (n(), h("div", vf, [
      o.value ? (n(), h("form", {
        key: 0,
        class: "work-identity-edit",
        "aria-label": "Edit board",
        onClick: F[8] || (F[8] = Oe(() => {
        }, ["stop"])),
        onSubmit: Oe(le, ["prevent"])
      }, [
        s("label", ff, [
          F[12] || (F[12] = z("Title", -1)),
          k(r(Se), {
            modelValue: p.value,
            "onUpdate:modelValue": F[5] || (F[5] = (R) => p.value = R),
            required: "",
            autofocus: "",
            disabled: m.value
          }, null, 8, ["modelValue", "disabled"])
        ]),
        s("label", mf, [
          F[13] || (F[13] = z("Description", -1)),
          k(r(Ua), {
            modelValue: f.value,
            "onUpdate:modelValue": F[6] || (F[6] = (R) => f.value = R),
            rows: "1",
            disabled: m.value
          }, null, 8, ["modelValue", "disabled"])
        ]),
        s("div", pf, [
          F[14] || (F[14] = s("span", null, "Board icon", -1)),
          u.value ? (n(), h("wc-icon-picker", {
            key: 0,
            value: c.value,
            fallback: "tabler:layout-kanban",
            inert: m.value || void 0,
            onSelect: F[7] || (F[7] = (R) => c.value = R.detail)
          }, null, 40, bf)) : (n(), h("p", hf, "The icon picker is unavailable."))
        ]),
        s("div", gf, [
          k(r(ee), {
            label: "Save",
            severity: "secondary",
            type: "submit",
            disabled: !p.value.trim() || m.value,
            loading: m.value,
            outlined: ""
          }, {
            icon: q(() => [
              k(r(ve), {
                icon: "tabler:device-floppy",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled", "loading"]),
          k(r(ee), {
            label: "Cancel",
            severity: "secondary",
            disabled: m.value,
            onClick: fe,
            outlined: ""
          }, {
            icon: q(() => [
              k(r(ve), {
                icon: "tabler:x",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled"])
        ])
      ], 32)) : (n(), h(Q, { key: 1 }, [
        s("div", yf, [
          s("div", kf, [
            e.board?.icon ? (n(), Y(r(ve), {
              key: 0,
              icon: e.board.icon,
              "aria-hidden": "true"
            }, null, 8, ["icon"])) : S("", !0),
            (n(), Y(ra(e.compact ? "h2" : "h1"), {
              class: ft(e.compact ? "kx-card-name" : "kx-title")
            }, {
              default: q(() => [
                z(I(e.board?.title || "Untitled board"), 1)
              ]),
              _: 1
            }, 8, ["class"]))
          ]),
          e.compact ? Ze(A.$slots, "title-end", {}, void 0, void 0, 0) : S("", !0),
          e.compact ? (n(), h("span", wf, [
            b.value ? (n(), Y(r(ee), {
              key: 0,
              severity: "secondary",
              text: "",
              size: "small",
              onClick: Oe(re, ["stop"]),
              "aria-label": "Edit board"
            }, {
              default: q(() => [
                k(r(ve), {
                  icon: "tabler:pencil",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            })) : S("", !0),
            Ze(A.$slots, "actions")
          ])) : b.value ? (n(), Y(r(ee), {
            key: 2,
            severity: "secondary",
            text: "",
            size: "small",
            onClick: Oe(re, ["stop"]),
            "aria-label": "Edit board"
          }, {
            default: q(() => [
              k(r(ve), {
                icon: "tabler:pencil",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          })) : S("", !0),
          e.compact ? S("", !0) : Ze(A.$slots, "title-end", {}, void 0, void 0, 3)
        ]),
        !e.compact && (e.subtitle || e.board?.description) ? (n(), h("p", {
          key: 0,
          class: "kx-head-sub",
          title: e.subtitle || e.board?.description
        }, I(e.subtitle || e.board?.description), 9, Vf)) : S("", !0)
      ], 64)),
      V.value ? (n(), h("p", $f, I(V.value), 1)) : S("", !0),
      v.value ? (n(), h("p", xf, I(v.value), 1)) : S("", !0)
    ]));
  }
}), Sf = { class: "work-ia-section work-ia-general" }, Tf = {
  class: "work-settings-list work-board-details",
  "aria-label": "Board details"
}, If = { class: "work-settings-row" }, Df = { class: "work-row-main" }, Uf = ["for"], Ef = { class: "work-muted work-small" }, Af = {
  class: "work-board-summary work-row work-wrap work-small",
  "aria-label": "Board summary"
}, Pf = { class: "work-muted" }, Of = { key: 0 }, Rf = { key: 1 }, Nf = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, Mf = {
  key: 0,
  class: "work-stack work-tight"
}, Ff = {
  key: 0,
  class: "work-stack work-tight"
}, Lf = {
  key: 1,
  class: "work-muted"
}, Bf = { class: "work-stack work-tight" }, zf = { class: "work-spacer" }, jf = /* @__PURE__ */ Ve({
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
    const a = e, t = Kt(), l = {
      comments_per_item: "Comments per item",
      audit: "Change history",
      audit_days: "Change history retention",
      interval_days: "Time-in-state history retention",
      trash_days: "Trash retention",
      tombstone_days: "Deletion record retention"
    }, o = G(() => Object.keys(l).filter((v) => a.draft.policy?.[v] !== void 0));
    function d(v) {
      const b = a.draft.policy?.[v];
      return v === "audit" ? b === "off" ? "Off" : "Track field changes" : v === "comments_per_item" ? b : b === 0 ? v === "audit_days" || v === "interval_days" ? "365 days" : "Clean up immediately" : b === 1 ? "1 day" : b + " days";
    }
    const p = B(), f = B(!1);
    let c = "";
    Ie([() => a.active, () => a.board?.board_id, () => a.schema.generation], async ([v, b, y], T, C) => {
      if (!v || !b || c === b + "/" + y) return;
      p.value = void 0, f.value = !1;
      let U = !0;
      C(() => U = !1);
      try {
        const W = await Promise.all(Array.from(
          { length: Math.min(3, Math.max(0, y - 1)) },
          (L, _) => Et.schema(b, y - _ - 1)
        ));
        U && (p.value = W, c = b + "/" + y);
      } catch {
        U && (f.value = !0);
      }
    }, { immediate: !0 });
    function i(v) {
      return JSON.stringify(v, (b, y) => y && typeof y == "object" && !Array.isArray(y) ? Object.fromEntries(Object.entries(y).sort(([T], [C]) => T.localeCompare(C))) : y);
    }
    function u(v, b) {
      if (!b) return ["Initial board setup"];
      const y = v.declaration, T = b.declaration, C = [], U = [
        ["Fields", y.fields, T.fields],
        ["Item types", y.item_types, T.item_types],
        ["Workflow", y.processes, T.processes],
        ["Links", y.relation_types, T.relation_types],
        ["Plugins and filters", [y.plugins, y.scopes], [T.plugins, T.scopes]],
        ["Item visibility", y.visibility, T.visibility],
        ["Board rules", y.policy, T.policy],
        ["Starting pack", v.pack, b.pack],
        ["Item key prefix", v.key_prefix, b.key_prefix]
      ];
      if (i(y.fields) !== i(T.fields)) {
        const L = y.fields?.filter((_) => !T.fields?.some((j) => j.code === _.code)) ?? [];
        L.length === 1 && C.push("Added " + Xe(L[0]));
      }
      const W = U.filter(([, L, _]) => i(L) !== i(_)).map(([L]) => L).filter((L) => L !== "Fields" || !C.length);
      return W.length && C.push(W.join(", ") + " updated"), C.length ? C : ["Board setup updated"];
    }
    const m = B(!1), V = G(() => {
      if (!p.value || a.schema.generation < 1) return [];
      const v = [a.schema, ...p.value];
      return v.slice(0, 3).map((b, y) => u(b, v[y + 1]));
    });
    return (v, b) => (n(), h("section", Sf, [
      s("section", Tf, [
        (n(), Y(Cf, {
          key: e.board?.board_id,
          board: e.board,
          "board-apps": e.boardApps,
          detail: "",
          onDirtyChange: b[1] || (b[1] = (y) => v.$emit("dirty-change", y)),
          onSaved: b[2] || (b[2] = (y) => v.$emit("saved"))
        }, {
          default: q(() => [
            s("div", If, [
              s("div", Df, [
                s("label", {
                  class: "work-row-title",
                  for: r(t)
                }, "Item key prefix", 8, Uf),
                s("p", Ef, "Shown on items, for example " + I(e.draft.key_prefix || "WORK") + "-1.", 1)
              ]),
              k(r(Se), {
                id: r(t),
                modelValue: e.draft.key_prefix,
                "onUpdate:modelValue": b[0] || (b[0] = (y) => e.draft.key_prefix = y),
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
      s("section", Af, [
        s("p", Pf, [
          e.board?.open_count !== void 0 && e.board.item_count !== void 0 ? (n(), h("span", Of, I(e.board.open_count) + " open · " + I(e.board.item_count) + " total · ", 1)) : S("", !0),
          z(" " + I(e.packTitle || "No pack installed"), 1),
          e.outdated ? (n(), h("span", Rf, " · Update available")) : S("", !0)
        ]),
        e.packError ? (n(), h("p", Nf, I(e.packError), 1)) : S("", !0),
        e.packError ? (n(), Y(r(ee), {
          key: 1,
          label: "Reload packs",
          severity: "secondary",
          outlined: "",
          size: "small",
          onClick: b[3] || (b[3] = (y) => v.$emit("retry"))
        })) : S("", !0),
        e.packTitle ? e.outdated ? (n(), Y(r(ee), {
          key: 3,
          label: "Update pack",
          severity: "secondary",
          outlined: "",
          size: "small",
          disabled: !e.canUpgrade,
          title: e.upgradeReason,
          onClick: b[5] || (b[5] = (y) => v.$emit("upgrade"))
        }, null, 8, ["disabled", "title"])) : S("", !0) : (n(), Y(r(ee), {
          key: 2,
          label: "Install pack",
          severity: "secondary",
          outlined: "",
          size: "small",
          disabled: !e.canInstall,
          onClick: b[4] || (b[4] = (y) => v.$emit("install"))
        }, null, 8, ["disabled"]))
      ]),
      e.schema.pack ? (n(), Y(Re, {
        key: 0,
        open: m.value,
        "onUpdate:open": b[6] || (b[6] = (y) => m.value = y),
        class: "work-disclosure work-small",
        label: "Technical details"
      }, {
        default: q(() => [
          m.value ? (n(), h("dl", Mf, [
            s("div", null, [
              b[7] || (b[7] = s("dt", null, "Pack ID", -1)),
              s("dd", null, [
                s("code", null, I(e.schema.pack.id), 1)
              ])
            ]),
            s("div", null, [
              b[8] || (b[8] = s("dt", null, "Pack version", -1)),
              s("dd", null, I(e.schema.pack.version), 1)
            ]),
            b[9] || (b[9] = s("div", null, [
              s("dt", null, "Pack tools"),
              s("dd", null, [
                s("code", null, "WorkPackPlan"),
                z(", "),
                s("code", null, "WorkPackApply")
              ])
            ], -1))
          ])) : S("", !0)
        ]),
        _: 1
      }, 8, ["open"])) : S("", !0),
      k(Re, {
        class: "work-disclosure",
        label: "Recent setup changes"
      }, {
        default: q(() => [
          V.value.length ? (n(), h("ul", Ff, [
            (n(!0), h(Q, null, se(V.value, (y, T) => (n(), h("li", { key: T }, I(y.join(" · ")), 1))), 128))
          ])) : (n(), h("p", Lf, I(f.value ? "Recent changes are unavailable." : p.value ? "No setup changes yet." : "Loading recent changes…"), 1))
        ]),
        _: 1
      }),
      o.value.length ? (n(), Y(Re, {
        key: 1,
        class: "work-settings-card work-disclosure",
        label: "Advanced · Existing board overrides"
      }, {
        default: q(() => [
          b[10] || (b[10] = s("p", { class: "work-muted" }, "Clear an override to use the Work application default.", -1)),
          s("ul", Bf, [
            (n(!0), h(Q, null, se(o.value, (y) => (n(), h("li", {
              key: y,
              class: "work-row work-wrap"
            }, [
              s("span", zf, I(l[y]) + " · " + I(d(y)), 1),
              k(r(ee), {
                label: "Use default for " + l[y].toLowerCase(),
                disabled: e.disabled,
                size: "small",
                text: "",
                onClick: (T) => delete e.draft.policy[y]
              }, null, 8, ["label", "disabled", "onClick"])
            ]))), 128))
          ])
        ]),
        _: 1
      })) : S("", !0)
    ]));
  }
}), je = (e, a) => `${e} → ${a}`, To = (e, a) => {
  const t = e.fields?.find((l) => l.code === a);
  return t ? Xe(t) : "Untitled field";
}, Io = {
  comments_per_item: "Comments per item",
  stage_timeout: "Default attempt timeout",
  stage_max_visits: "Default maximum visits",
  audit: "Audit trail",
  audit_days: "Audit history",
  trash_days: "Keep trashed items",
  tombstone_days: "Keep deletion records",
  interval_days: "Keep state history"
};
function Do(e, a) {
  if (a === void 0) return "Application default";
  if (e === "audit") return Me(String(a));
  if (e === "stage_timeout") {
    const t = wa(String(a));
    if (t) return `${t.amount.toLocaleString()} ${t.amount === 1 ? t.unit.slice(0, -1) : t.unit}`;
  }
  if (e.endsWith("_days")) {
    const t = a === 0 && (e === "audit_days" || e === "interval_days") ? 365 : a;
    return `${t} ${t === 1 ? "day" : "days"}`;
  }
  return String(a);
}
function Wf(e, a) {
  const t = e.policy ?? {}, l = a.policy ?? {}, o = Object.keys(Io).flatMap((f) => t[f] === l[f] ? [] : [`${Io[f]} · ${je(Do(f, t[f]), Do(f, l[f]))}`]), d = (f) => f ? `${f.limit}${f.hard ? " (hard limit)" : ""}` : "No limit", p = /* @__PURE__ */ new Set([...Object.keys(t.wip ?? {}), ...Object.keys(l.wip ?? {})]);
  for (const f of p) {
    const c = d(t.wip?.[f]), i = d(l.wip?.[f]);
    if (c === i) continue;
    const u = (a.processes ?? []).flatMap((m) => m.states).find((m) => m.id === f) ?? (e.processes ?? []).flatMap((m) => m.states).find((m) => m.id === f);
    o.push(`${ge(u)} limit · ${je(c, i)}`);
  }
  return o;
}
function qf(e, a, t) {
  const l = e.visibility, o = a.visibility, d = [];
  l?.field !== o?.field && d.push(je(
    l ? To(e, l.field) : "No additional restriction",
    o ? To(a, o.field) : "No additional restriction"
  ));
  const p = l?.levels ?? [], f = o?.levels ?? [], c = new Set([...p, ...f].map((i) => i.id));
  for (const i of c) {
    const u = p.find((y) => y.id === i), m = f.find((y) => y.id === i);
    if (u && m && JSON.stringify(u.holders) === JSON.stringify(m.holders)) continue;
    const V = (y) => y.fields?.find((T) => T.code === y.visibility?.field)?.options?.find((T) => T.id === i)?.label, v = V(a) || V(e) || Me(i), b = (y) => y ? y.holders.map(t).join(", ") || "No extra access" : "No level";
    d.push(`${v} · ${je(b(u), b(m))}`);
  }
  return l?.bypass !== o?.bypass && d.push(o?.bypass === "admin" ? "Board administrators can see every level." : "Visibility levels now apply to board administrators."), d;
}
const Va = {
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
function Gf(e, a, t) {
  const { what: l, detail: o, to: d } = e, f = `${t?.name || a?.name || "Untitled workflow"} · ${Va[l] ?? "Workflow changed"}`, c = l.startsWith("state.") ? a?.states.find((v) => v.id === o) : void 0, i = l.startsWith("state.") ? t?.states.find((v) => v.id === o) : void 0, u = l.startsWith("transition.") ? a?.transitions?.find((v) => v.id === o) : void 0, m = l.startsWith("transition.") ? t?.transitions?.find((v) => v.id === o) : void 0;
  let V = "";
  return l === "state.map" ? V = je(ge(c), ge(t?.states.find((v) => v.id === d))) : l === "state.name" ? V = je(ge(c), ge(i)) : l === "state.kind" ? V = `${ge(i)} · ${je(Xa(c?.kind), Xa(i?.kind))}` : l === "state.category" && c && i ? V = `${ge(i)} · ${je(Ht(c.category), Ht(i.category))}` : i || c ? V = ge(i ?? c) : l === "transition.name" && u && m ? V = je(Ge(u), Ge(m)) : m ? V = Ge(m) : u ? V = Ge(u) : l === "initial" ? V = je(ge(a?.states.find((v) => v.id === a.initial)), ge(t?.states.find((v) => v.id === t.initial))) : l === "name" && (V = je(a?.name || "Untitled workflow", t?.name || "Untitled workflow")), { title: f, details: V ? [V] : [] };
}
function Kf(e, a, t, l) {
  const { code: o, what: d, detail: p } = e;
  if (o === "schema" || d === "visibility.remove")
    return d === "policy" ? { title: "Board limits and defaults", details: Wf(a, t) } : d.startsWith("visibility") ? { title: "Who can see items", details: qf(a, t, l) } : d === "key_prefix" ? { title: "Item key prefix", details: [je(a.key_prefix ?? "Default", t.key_prefix ?? "Default")] } : { title: { plugins: "Board plugins changed", scopes: "Saved query filters changed", "rollup.recompute": "Calculated totals will update" }[d] ?? "Board settings changed", details: [] };
  if (o.startsWith("process ")) {
    const m = o.slice(8);
    return Gf(e, a.processes?.find((V) => V.id === m), t.processes?.find((V) => V.id === m));
  }
  if (o.startsWith("item_type ")) {
    const m = o.slice(10), V = a.item_types?.find((y) => y.id === m), v = t.item_types?.find((y) => y.id === m);
    return { title: `${v?.title || V?.title || "Item type"} · ${Va[d] ?? "Item type changed"}`, details: d === "title" ? [je(V?.title || "Untitled item type", v?.title || "Untitled item type")] : [] };
  }
  if (o.startsWith("relation ")) {
    const m = o.slice(9), V = a.relation_types?.find((y) => y.id === m), v = t.relation_types?.find((y) => y.id === m), b = d === "label" ? [je([V?.outward, V?.inward].filter(Boolean).join(" / "), [v?.outward, v?.inward].filter(Boolean).join(" / "))] : [];
    return { title: `${v?.outward || V?.outward || "Link type"} · ${Va[d] ?? "Link type changed"}`, details: b };
  }
  const f = t.fields?.find((m) => m.code === o), c = a.fields?.find((m) => f?.id !== void 0 ? m.id === f.id : m.code === (d.startsWith("renamed from ") ? d.slice(13) : o)), i = f ?? c;
  if (!i) return { title: Va[d] ?? "Board settings changed", details: [] };
  const u = `${Xe(i)} · ${d.startsWith("renamed from ") ? "Field key" : Va[d] ?? "Field settings changed"}`;
  if (d.startsWith("options.")) {
    const m = c?.options ?? [], V = f?.options ?? [], v = m.findIndex((W) => W.id === p), b = V.findIndex((W) => W.id === p), y = m[v], T = V[b], C = T?.label || y?.label || "Untitled choice", U = y && T && y.label !== T.label ? [] : [C];
    if (y && T) {
      y.label !== T.label && U.push(je(y.label || "Untitled choice", T.label || "Untitled choice")), y.category !== T.category && U.push(`Category · ${je(y.category ? Ht(y.category) : "None", T.category ? Ht(T.category) : "None")}`);
      const W = y.order ?? v + 1, L = T.order ?? b + 1;
      W !== L && U.push(`Order · ${je(W, L)}`), y.color !== T.color && U.push(`Color · ${je(y.color ?? "Default", T.color ?? "Default")}`);
    }
    return { title: u, details: U };
  }
  return d === "title" && c && f ? { title: u, details: [je(Xe(c), Xe(f))] } : { title: u, details: [] };
}
const Hf = {
  key: 0,
  class: "work-settings-card work-schema-plan work-stack",
  "aria-label": "Schema review"
}, Yf = { key: 0 }, Xf = { class: "work-row work-wrap" }, Jf = { class: "work-muted" }, Zf = {
  key: 0,
  class: "work-notice"
}, Qf = {
  key: 1,
  class: "work-notice"
}, _f = {
  key: 2,
  class: "work-stack work-tight",
  "aria-label": "Reviewed Flow bindings"
}, em = { key: 3 }, tm = {
  key: 4,
  class: "work-settings-table"
}, am = { key: 0 }, lm = /* @__PURE__ */ Ve({
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
    const a = e, t = {}, l = G(() => a.original ?? t), o = G(() => a.declaration ?? t), d = G(() => (o.value.processes ?? []).flatMap((U) => U.states.flatMap((W) => {
      const L = W.run?.flow_ref;
      return L ? [{ key: U.id + ":" + W.id, process: U.name || "Untitled process", state: ge(W), reference: L }] : [];
    }))), p = B(/* @__PURE__ */ new Map());
    Ie(d, async (U, W, L) => {
      const _ = /* @__PURE__ */ new Map();
      p.value = _;
      let j = !0;
      L(() => j = !1), await Promise.all([...new Set(U.map((Z) => Z.reference.id))].map(async (Z) => {
        try {
          const re = (await Ml.title(Z))?.trim();
          j && re && !Fi(re) && p.value.set(Z, re);
        } catch {
          j && p.value.set(Z, "Flow title unavailable");
        }
      }));
    }, { immediate: !0 });
    const f = G(() => [l.value, o.value].flatMap((U) => (U.visibility?.levels ?? []).flatMap((W) => W.holders.flatMap((L) => "group" in L ? [{ kind: "group", id: L.group }] : "user" in L ? [{ kind: "user", id: L.user }] : [])))), c = Lo(() => a.boardId ?? "", f);
    function i(U) {
      if ("user" in U) return c.label({ kind: "user", id: U.user });
      if ("group" in U) return c.label({ kind: "group", id: U.group });
      if ("field" in U) {
        const W = o.value.fields?.find((L) => L.code === U.field) ?? l.value.fields?.find((L) => L.code === U.field);
        return W ? Xe(W) : "People from a field";
      }
      return "Service";
    }
    const u = (U) => U.map((W) => {
      const L = Kf(W, l.value, o.value, i);
      if (W.what === "plugins") {
        const _ = new Set(l.value.plugins?.map((Z) => Z.use)), j = new Set(o.value.plugins?.map((Z) => Z.use));
        for (const Z of a.plugins ?? [])
          _.has(Z.plugin) !== j.has(Z.plugin) && L.details.push((j.has(Z.plugin) ? "Enable " : "Turn off ") + (Z.title || "an available plugin"));
      }
      return { change: W, ...L };
    }), m = G(() => u(a.plan?.changes.filter((U) => U.class !== "refused") ?? [])), V = G(() => u(a.plan?.refused ?? [])), v = G(() => {
      const U = a.plan?.migration;
      return !U || !V.value.length ? U : V.value.every((W) => W.change.what === "options.remove") ? "Add a new field with the choices you want to keep. Copy existing values into it before removing the old field." : V.value.every((W) => W.change.what === "state.remove") ? "Choose where existing items should move before removing their state." : U;
    }), b = {
      unchanged: ["No changes", "secondary"],
      cosmetic: ["Labels or settings", "secondary"],
      additive: ["New definitions", "success"],
      semantic: ["Affects existing items", "warn"],
      refused: ["Blocked", "danger"],
      initial: ["First setup", "secondary"]
    }, y = (U) => b[U]?.[0] ?? "Review needed", T = (U) => b[U]?.[1] ?? "secondary";
    function C(U) {
      const { detail: W, ...L } = U;
      return tl(U.what === "invalid" || U.what.startsWith("views.") || U.what.startsWith("automation") ? U : L);
    }
    return (U, W) => e.plan ? (n(), h("section", Hf, [
      !e.plan.changes.length && !e.plan.refused.length && !e.configCount && !e.packReview ? (n(), h("p", Yf, "No changes to apply.")) : (n(), h(Q, { key: 1 }, [
        s("header", Xf, [
          W[0] || (W[0] = s("h3", null, "Impact on this board", -1)),
          k(r(at), {
            class: "kx-tag-sm",
            severity: T(e.plan.class)
          }, {
            default: q(() => [
              z(I(y(e.plan.class)), 1)
            ]),
            _: 1
          }, 8, ["severity"])
        ]),
        s("p", Jf, I(r(Li)[e.plan.class] || "Review the changes below."), 1),
        v.value ? (n(), h("p", Zf, I(v.value), 1)) : e.follows.length ? (n(), h("p", Qf, "Existing items in " + I(e.follows.join(", ")) + " will follow the updated workflow.", 1)) : S("", !0),
        d.value.length ? (n(), h("section", _f, [
          W[1] || (W[1] = s("h3", null, "Flow bindings", -1)),
          (n(!0), h(Q, null, se(d.value, (L) => (n(), h("p", {
            key: L.key
          }, [
            z(I(L.process) + " / " + I(L.state) + " · ", 1),
            s("strong", null, I(p.value.get(L.reference.id) ?? "Published Flow") + " · v" + I(L.reference.version), 1)
          ]))), 128)),
          W[2] || (W[2] = s("p", { class: "work-muted work-small" }, "New entries use these exact published versions. Before replacing a binding, stop new entries, let existing runs and deliveries finish, pause the old launcher, save, then resume entries.", -1))
        ])) : S("", !0),
        Ze(U.$slots, "default"),
        V.value.length ? (n(), h("h3", em, "Blocked changes")) : S("", !0),
        (n(!0), h(Q, null, se(V.value, (L, _) => (n(), Y(r(Ji), {
          key: _,
          severity: "error",
          role: "alert"
        }, {
          default: q(() => [
            s("strong", null, I(L.title), 1),
            (n(!0), h(Q, null, se(L.details, (j, Z) => (n(), h("p", { key: Z }, I(j), 1))), 128)),
            s("p", null, I(C(L.change)), 1),
            k(Re, {
              class: "work-small",
              label: "Technical details"
            }, {
              default: q(() => [
                s("code", null, I(L.change.what), 1)
              ]),
              _: 2
            }, 1024)
          ]),
          _: 2
        }, 1024))), 128)),
        m.value.length ? (n(), h("table", tm, [
          W[3] || (W[3] = s("thead", null, [
            s("tr", null, [
              s("th", { scope: "col" }, "Change"),
              s("th", { scope: "col" }, "Impact")
            ])
          ], -1)),
          s("tbody", null, [
            (n(!0), h(Q, null, se(m.value, (L, _) => (n(), h("tr", { key: _ }, [
              s("td", null, [
                s("strong", null, I(L.title), 1),
                (n(!0), h(Q, null, se(L.details, (j, Z) => (n(), h("p", { key: Z }, I(j), 1))), 128)),
                L.change.count ? (n(), h("p", am, I(L.change.count) + " " + I(L.change.count === 1 ? "item" : "items"), 1)) : S("", !0)
              ]),
              s("td", null, [
                k(r(at), {
                  class: "kx-tag-sm",
                  severity: T(L.change.class)
                }, {
                  default: q(() => [
                    z(I(y(L.change.class)), 1)
                  ]),
                  _: 2
                }, 1032, ["severity"])
              ])
            ]))), 128))
          ])
        ])) : S("", !0)
      ], 64))
    ])) : S("", !0);
  }
}), om = {
  class: "work-stack work-tight",
  "aria-label": "Pack resources"
}, im = {
  key: 0,
  class: "work-muted work-small"
}, nm = {
  key: 0,
  class: "work-stack",
  "aria-label": "Pack conflicts"
}, sm = { class: "work-stack work-tight work-pack-review-field" }, rm = { class: "work-config-fields" }, dm = { class: "work-json-example" }, um = { class: "work-json-example" }, cm = {
  key: 1,
  class: "work-stack",
  "aria-label": "Pack state maps"
}, vm = /* @__PURE__ */ Ve({
  __name: "PackReview",
  props: {
    plan: {},
    request: {},
    original: {},
    plugins: {},
    disabled: { type: Boolean }
  },
  emits: ["change"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = G(() => [
      { label: "Saved views", entries: t.plan.views?.map((u) => ({ id: u.id, name: u.title || u.id })) },
      { label: "Automations", entries: t.plan.automations?.map((u) => ({ id: u.id, name: u.id })) },
      { label: "Traits", entries: t.plan.traits?.map((u) => ({ id: u, name: u })) },
      { label: "Required plugins", entries: t.plan.plugins?.map((u) => ({ id: u, name: t.plugins?.find((m) => m.plugin === u)?.title || u })) }
    ].filter((u) => u.entries?.length));
    function d(u) {
      return t.original.processes?.find((m) => m.id === u)?.name || Me(u);
    }
    function p(u) {
      const [m, ...V] = u.split("."), v = V.join(".");
      return m === "processes" ? d(v) : m === "fields" ? t.original.fields?.find((b) => b.code === v)?.title || Me(v) : m === "item_types" ? t.original.item_types?.find((b) => b.id === v)?.title || Me(v) : Me(m);
    }
    function f(u) {
      return JSON.stringify(u ?? null, null, 2);
    }
    function c(u, m) {
      (t.request.resolutions ??= {})[u] = m, l("change");
    }
    function i(u, m, V) {
      ((t.request.maps ??= {})[u] ??= {})[m] = V, l("change");
    }
    return (u, m) => (n(), h(Q, null, [
      s("section", om, [
        m[1] || (m[1] = s("h3", null, "Pack resources", -1)),
        s("p", null, [
          m[0] || (m[0] = z("Target version ", -1)),
          s("strong", null, I(e.plan.version), 1)
        ]),
        o.value.length ? (n(), h("p", im, "Resources included in this plan.")) : S("", !0),
        (n(!0), h(Q, null, se(o.value, (V) => (n(), h("div", {
          key: V.label
        }, [
          s("h4", null, I(V.label), 1),
          s("ul", null, [
            (n(!0), h(Q, null, se(V.entries, (v) => (n(), h("li", {
              key: v.id
            }, I(v.name), 1))), 128))
          ])
        ]))), 128))
      ]),
      e.plan.conflicts.length ? (n(), h("section", nm, [
        m[4] || (m[4] = s("h3", null, "Local edits conflict", -1)),
        m[5] || (m[5] = s("p", { class: "work-muted work-small" }, "Choose which declaration to keep for each conflict, then review again.", -1)),
        (n(!0), h(Q, null, se(e.plan.conflicts, (V) => (n(), h("div", {
          key: V.path,
          class: "work-stack work-tight"
        }, [
          s("label", sm, [
            z(I(p(V.path)), 1),
            k(r(ce), {
              "model-value": e.request.resolutions?.[V.path],
              "aria-label": "Resolution for " + p(V.path),
              disabled: e.disabled,
              appendTo: "self",
              placeholder: "Choose a resolution",
              optionLabel: "label",
              optionValue: "value",
              options: [{ label: "Keep local edits", value: "local" }, { label: "Use pack changes", value: "incoming" }],
              "onUpdate:modelValue": (v) => c(V.path, v)
            }, null, 8, ["model-value", "aria-label", "disabled", "onUpdate:modelValue"])
          ]),
          k(Re, {
            class: "work-json-disclosure",
            label: "Compare declarations"
          }, {
            default: q(() => [
              s("div", rm, [
                s("section", null, [
                  m[2] || (m[2] = s("h4", null, "Local edits", -1)),
                  s("pre", dm, I(f(V.local_value)), 1)
                ]),
                s("section", null, [
                  m[3] || (m[3] = s("h4", null, "Pack changes", -1)),
                  s("pre", um, I(f(V.incoming)), 1)
                ])
              ])
            ]),
            _: 2
          }, 1024)
        ]))), 128))
      ])) : S("", !0),
      Object.keys(e.plan.maps).length ? (n(), h("section", cm, [
        m[6] || (m[6] = s("h3", null, "Required state maps", -1)),
        m[7] || (m[7] = s("p", { class: "work-muted work-small" }, "Review the proposed destinations for existing items. Each destination is editable.", -1)),
        (n(!0), h(Q, null, se(e.plan.maps, (V, v) => (n(), h("div", {
          key: v,
          class: "work-stack"
        }, [
          s("h4", null, I(d(v)), 1),
          (n(!0), h(Q, null, se(V, (b, y) => (n(), h("label", {
            key: y,
            class: "work-stack work-tight work-pack-review-field"
          }, [
            z("Move items from " + I(r(ge)(e.original.processes?.find((T) => T.id === v)?.states.find((T) => T.id === y))), 1),
            k(r(ce), {
              "model-value": e.request.maps?.[v]?.[y],
              "aria-label": "Move items from " + r(ge)(e.original.processes?.find((T) => T.id === v)?.states.find((T) => T.id === y)),
              disabled: e.disabled,
              appendTo: "self",
              optionLabel: "label",
              optionValue: "value",
              options: e.plan.declaration.processes?.find((T) => T.id === v)?.states.map((T) => ({ label: r(ge)(T), value: T.id })) ?? [],
              "onUpdate:modelValue": (T) => i(v, y, T)
            }, null, 8, ["model-value", "aria-label", "disabled", "options", "onUpdate:modelValue"])
          ]))), 128))
        ]))), 128))
      ])) : S("", !0)
    ], 64));
  }
}), fm = { class: "work-section-layout" }, mm = { class: "kx-main" }, pm = ["aria-label"], bm = {
  key: 1,
  class: "kx-err work-alert-actions"
}, hm = { role: "alert" }, gm = {
  key: 2,
  class: "work-notice",
  role: "status"
}, ym = {
  key: 3,
  class: "kx-loading",
  role: "status"
}, km = {
  key: 4,
  class: "work-notice",
  role: "alert"
}, wm = {
  key: 5,
  class: "work-settings-body"
}, Vm = {
  key: 0,
  class: "work-notice work-stack work-tight",
  "aria-label": "Pack installation"
}, $m = {
  key: 0,
  role: "status"
}, xm = {
  key: 1,
  role: "status"
}, Cm = { class: "work-small" }, Sm = {
  key: 2,
  class: "kx-err",
  role: "alert"
}, Tm = { key: 3 }, Im = {
  key: 1,
  class: "work-notice",
  role: "alert"
}, Dm = {
  key: 2,
  class: "work-notice"
}, Um = ["id"], Em = ["disabled", "inert"], Am = {
  key: 3,
  class: "work-ia-section"
}, Pm = {
  key: 0,
  class: "work-muted"
}, Om = {
  key: 5,
  class: "work-ia-section"
}, Rm = { class: "work-review-layout" }, Nm = { class: "work-muted" }, Mm = ["aria-busy"], Fm = {
  key: 0,
  role: "status"
}, Lm = {
  key: 1,
  role: "alert",
  class: "kx-err"
}, Bm = {
  key: 2,
  role: "alert"
}, zm = { key: 6 }, jm = { class: "work-dialog-actions" }, Wm = {
  key: 3,
  class: "work-muted",
  role: "status"
}, qm = {
  key: 0,
  class: "work-muted",
  role: "status"
}, Gm = {
  key: 1,
  class: "kx-err work-alert-actions"
}, Km = { role: "alert" }, Hm = {
  key: 2,
  class: "work-stack work-tight"
}, Ym = {
  key: 0,
  class: "work-pack-unavailable work-block"
}, Xm = {
  key: 3,
  class: "work-muted"
}, Jm = { class: "work-dialog-actions" }, Zm = /* @__PURE__ */ Ve({
  __name: "BoardSettings",
  props: {
    boardId: {},
    embedded: { type: Boolean },
    focusBack: { type: Boolean },
    route: {}
  },
  emits: ["dirty-change", "navigate"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = on(), d = Kt(), p = B();
    let f, c = "";
    const i = () => JSON.stringify([kt.value, X.value, Ee.value, [...Qe.value]]), u = G(() => ({
      value: "all-boards",
      label: t.embedded ? "All boards" : "Back to board",
      icon: t.embedded ? "tabler:table" : "tabler:layout-kanban"
    })), m = B();
    Ie(m, (K) => {
      t.focusBack && K?.$el.querySelector(".kx-settings-rail-item")?.focus();
    }, { flush: "post", once: !0 });
    const V = [
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
    ], v = B("General"), b = {
      General: "general",
      "Item types": "items",
      Fields: "fields",
      Links: "links",
      Workflow: "workflow",
      Access: "access",
      Plugins: "plugins"
    }, y = B("");
    function T(K, M = "") {
      v.value = K, y.value = M ? b[K] + "/" + M : "";
    }
    function C(K, M = "") {
      T(K, M), t.route !== void 0 && l("navigate", [b[K], ...M ? [encodeURIComponent(M)] : []].join("/"));
    }
    function U(K, M, te) {
      if (t.route === void 0 || b[v.value] !== K || !te && y.value !== K + "/" + M) return;
      const ke = F.value?.declaration;
      (K === "items" ? ke?.item_types?.some((Ue) => Ue.id === M) : K === "fields" ? ke?.fields?.some((Ue) => Ue.code === M) : K === "links" ? ke?.relation_types?.some((Ue) => Ue.id === M) : K === "plugins" ? x.value?.schema_options.plugins.some((Ue) => Ue.plugin === M) : K === "workflow" && ke?.processes?.some((Ue) => Ue.states.some((Ae) => Ue.id + ".state." + Ae.id === M) || Ue.transitions?.some((Ae) => Ue.id + ".transition." + Ae.id === M))) && C(v.value, te ? M : "");
    }
    Po(ql, { selected: y, choose: U });
    function W(K) {
      if (K === u.value.value) {
        yi();
        return;
      }
      (K === "General" || V.some((M) => M.items.some((te) => te.value === K))) && C(K);
    }
    const L = {
      General: "Manage the board name, item key prefix and app.",
      "Item types": "Choose the fields, parent relationships and workflow for each kind of work.",
      Fields: "Choose what information people can capture on items.",
      Links: "Show relationships on both items, such as “Blocks” and “Blocked by.”",
      Workflow: "Select a state or transition to edit how work moves.",
      Access: "Who can use this board?",
      Plugins: "Choose which plugins this board uses."
    }, _ = B(""), j = B(!1), Z = B(""), re = B();
    Ie(v, () => p.value?.scrollTo({ top: 0 }));
    function de() {
      j.value = !1, Z.value = "", Na.value = !1;
    }
    function ye(K) {
      !il.value || !pi() || Qe.value.size || (re.value = K, j.value = !0, ml());
    }
    const fe = B(!1), le = B(""), A = B(/* @__PURE__ */ new Set(["General"]));
    Ie(v, (K) => A.value.add(K));
    const F = B(), R = B(), ue = B(), H = B({}), X = B({}), x = B(), P = B(!1), E = B(!0), N = B(!1), g = B(""), O = B(""), ne = G(() => H.value.processes ?? []), ie = G(() => P.value && F.value ? [
      { heading: ue.value?.title || "Board settings", items: [{ value: "General", label: "General", icon: "tabler:settings" }] },
      ...V
    ] : []), we = B(), Te = B(!1), J = $a();
    async function w(K) {
      const M = J();
      Te.value = !1;
      try {
        const te = await Et.stateCounts(K);
        M() && (we.value = te);
      } catch {
        M() && (Te.value = !0, we.value = void 0);
      }
    }
    Ie(v, (K) => {
      P.value && K === "Workflow" && w(t.boardId);
    });
    const { packs: D, loading: $, error: oe, load: me, reset: $e } = Bi(), De = G(() => D.value.filter(zi)), We = G(() => D.value.map(ji)), lt = G(() => We.value.find((K) => K.id === le.value && !K.disabled)), Ee = B(), Rt = B(), gt = B(), yt = B(), ua = B(""), Yt = G(() => !!yt.value && yt.value.result.status !== "done"), ca = G(() => !N.value && !va.value && !Zt.value && !Yt.value), il = G(() => va.value && !(Yt.value && Ee.value)), Ke = B(), Xt = B(), Jt = B(""), nl = B([]), sl = G(() => [...nl.value, ...Ke.value?.refused ?? []]), dt = B(!1), Zl = B(0), Qe = B(/* @__PURE__ */ new Set()), rl = B(), Ql = $a(), Ra = $a(), kt = G(() => hl(H.value, F.value?.declaration ?? {})), va = G(() => Qe.value.size > 0 || !!Ee.value || !!F.value && (JSON.stringify(kt.value) !== JSON.stringify(hl(F.value.declaration, F.value.declaration)) || Object.keys(X.value).length > 0)), dl = B(!1), fa = B({}), _l = G(() => va.value || dl.value || Object.keys(fa.value).length > 0);
    Ie(_l, (K) => l("dirty-change", K), { immediate: !0, flush: "sync" });
    const nt = G(() => !!F.value && !!R.value && F.value.generation !== R.value.generation), ri = G(() => (!ma.value.renamed.length || Na.value) && P.value && !N.value && !dt.value && !Zt.value && !nt.value && !Qe.value.size && Ke.value && (Ke.value.changes.length > 0 || Object.keys(X.value).length > 0) && Ke.value.class !== "refused" && !Ke.value.refused.length && Xt.value?.matches(kt.value, F.value?.generation ?? -1, X.value)), Na = B(!1), ma = G(() => {
      const K = F.value?.declaration, M = [], te = [];
      for (const ke of ne.value) {
        const Le = K?.item_types?.filter((Ae) => Ae.process === ke.id) ?? [], Ue = K?.processes?.find((Ae) => Ae.id === ke.id);
        for (const Ae of Ue?.states ?? []) {
          const Fa = ke.states.find((Nt) => Nt.id === Ae.id);
          if (Fa && Fa.name === Ae.name) continue;
          const bl = [...Ke.value?.refused ?? [], ...Ke.value?.changes ?? []].find((Nt) => Nt.code === "process " + ke.id && Nt.detail === Ae.id && ["state.remove", "state.map"].includes(Nt.what))?.count ?? Le.reduce((Nt, wi) => Nt + (we.value?.[wi.id]?.[Ae.id] ?? 0), 0);
          bl && (Fa ? te.push({ process: ke, state: Ae, name: ge(Fa), count: bl }) : M.push({ process: ke, state: Ae, count: bl }));
        }
      }
      return { removed: M, renamed: te };
    });
    function di(K, M, te) {
      K.map = { ...K.map, [M]: te }, ml();
    }
    const ul = G(() => De.value.find((K) => K.id === Ee.value?.pack)?.plugins.filter((K) => !F.value?.plugins?.some((M) => M.plugin === K.plugin && M.active)).map((K) => ({ use: K.plugin })) ?? []), eo = G(() => !!gt.value && JSON.stringify(gt.value) === JSON.stringify(Ee.value)), to = G(() => Ee.value ? P.value && !N.value && !Qe.value.size && !nt.value && !Zt.value && eo.value && Ke.value?.class !== "refused" && !Ke.value?.refused.length && Rt.value?.conflicts.every((K) => !!Ee.value?.resolutions?.[K.path]) : ri.value), ao = G(() => !!Ke.value && (!Ee.value || eo.value)), ui = G(() => De.value.find((K) => K.id === F.value?.pack?.id)?.title || "Installed pack"), cl = G(() => !oe.value && !!F.value?.outdated && !!We.value.find((K) => K.id === F.value?.pack?.id && !K.disabled)), ci = G(() => oe.value ? "Reload packs to check available upgrades." : Yt.value ? "Finish the current pack installation before upgrading." : cl.value ? va.value ? "Discard the current draft before upgrading." : Zt.value ? "Finish the current migration before upgrading." : N.value ? "Wait for the current request to finish." : void 0 : "Install an available version of this pack to upgrade.");
    function lo() {
      Ee.value = void 0, Rt.value = void 0, gt.value = void 0;
    }
    async function vi() {
      if (!F.value?.pack || !ca.value || !cl.value) return;
      const K = De.value.find((M) => M.id === F.value.pack.id);
      K && (re.value = void 0, Ee.value = uo(K, F.value.generation), j.value = !0, await vl());
    }
    async function fi() {
      const K = De.value.find((M) => M.id === le.value);
      !F.value || !K || !lt.value || !ca.value || $.value || (re.value = void 0, Ee.value = uo(K, F.value.generation), fe.value = !1, j.value = !0, await vl());
    }
    async function vl() {
      if (!Ee.value || N.value || !P.value || nt.value || Qe.value.size) return;
      const K = Ra(), M = ea(Ee.value), te = JSON.stringify(Ee.value);
      N.value = !0, Z.value = "", O.value = "";
      try {
        const ke = await qi(M, (Le) => It.packPlan(t.boardId, Le));
        if (!K() || te !== JSON.stringify(Ee.value)) return;
        Rt.value = ke.plan, Ke.value = ke.plan, Ee.value = ke.request, gt.value = ea(Ee.value), Jt.value = crypto.randomUUID(), j.value = !0;
      } catch (ke) {
        K() && (gt.value = void 0, Z.value = rt(ke, "Could not review the pack."));
      } finally {
        N.value = !1;
      }
    }
    const oo = G(() => Rt.value?.declaration ?? Xt.value?.declaration), mi = G(() => {
      const K = oo.value;
      return !Ke.value || !K ? [] : Wi(Ke.value, K).map((M) => K.processes?.find((te) => te.id === M)?.name || "Untitled process");
    }), Zt = G(() => !!R.value?.migration_error || ue.value?.status === "migrating");
    function wt() {
      nl.value = [], Ra(), Ke.value = void 0, Xt.value = void 0, gt.value = void 0, Jt.value = "";
    }
    Ie([kt, X], wt, { deep: !0, flush: "sync" }), Ie(X, (K) => {
      Ee.value && (Object.keys(K).length ? Ee.value.plugin_configs = ea(K) : delete Ee.value.plugin_configs);
    }, { deep: !0, flush: "sync" });
    function pa(K, M) {
      M ? Qe.value.delete(K) : Qe.value.add(K), wt();
    }
    function fl(K) {
      lo(), Zl.value++, F.value = K, H.value = ea(K.declaration), X.value = {}, Qe.value.clear(), wt();
    }
    async function ut(K = !1) {
      const M = Ql();
      try {
        const [te, ke, Le] = await Promise.all([Et.schema(t.boardId, void 0, !0).catch((Ae) => {
          if (Ae instanceof Dl && Ae.details?.code === "board_schema_missing") return { generation: 0, declaration: {}, compiled: {}, key_prefix: "", as_of: 0 };
          throw Ae;
        }), Et.options(t.boardId), Et.boards()]);
        if (!M()) return;
        if (P.value = ke.access.admin, x.value = ke, ue.value = Le.find((Ae) => Ae.board_id === t.boardId), !P.value) {
          F.value = void 0, H.value = {}, wt();
          return;
        }
        g.value = "";
        const Ue = Gi(te);
        R.value = Ue, f !== void 0 && Ue.generation >= f ? (f = void 0, c === i() && fl(Ue), c = "") : (K || !F.value || !va.value && Ue.generation !== F.value.generation) && fl(Ue), nt.value && wt(), await me(M), M() && v.value === "Workflow" && w(t.boardId);
      } catch (te) {
        if (!M()) return;
        te instanceof Dl && (te.status === 403 || te.kind?.toLowerCase() === "permission_denied") && (P.value = !1), wt(), g.value = rt(te, "Could not load board settings.");
      } finally {
        M() && (E.value = !1);
      }
    }
    function pi() {
      for (const K of Array.from(rl.value?.elements ?? []))
        if ((K instanceof HTMLInputElement || K instanceof HTMLSelectElement || K instanceof HTMLTextAreaElement) && !(K.form !== rl.value || K.closest('[style*="display: none"]:not(.p-accordioncontent)')) && !K.reportValidity()) {
          const te = K.closest('.p-accordioncontent[style*="display: none"]')?.closest(".kx-disclosure")?.querySelector('.kx-disclosure-toggle[aria-expanded="false"]');
          return te && (te.click(), Bt(() => K.reportValidity())), !1;
        }
      return !0;
    }
    async function ml() {
      if (Ee.value) return vl();
      if (!F.value || N.value || !P.value || nt.value || Qe.value.size) return;
      const K = Ra(), M = co(kt.value, F.value.generation, X.value);
      N.value = !0, Z.value = "", O.value = "";
      try {
        const te = (M.declaration.processes ?? []).some((Le) => F.value?.declaration.processes?.find((Ue) => Ue.id === Le.id)?.states.some((Ue) => Le.states.some((Ae) => Ae.id === Ue.id && Ae.name !== Ue.name))), [ke] = await Promise.all([
          It.plan(t.boardId, M),
          te ? w(t.boardId) : void 0
        ]);
        if (te && Te.value) {
          wt(), Z.value = "Could not check which items use the renamed states. Check the impact again.";
          return;
        }
        if (!K() || Qe.value.size || !M.matches(kt.value, F.value.generation, X.value)) return;
        Ke.value = ke, Xt.value = M, Jt.value = crypto.randomUUID(), j.value = !0;
      } catch (te) {
        K() && (wt(), Z.value = rt(te, "Could not review changes."), nl.value = Ki(te, kt.value));
      } finally {
        N.value = !1;
      }
    }
    async function bi() {
      if (!to.value) return;
      if (Ee.value && gt.value) {
        N.value = !0, Z.value = "";
        try {
          await io(ea(gt.value), Jt.value, i()), de();
        } catch (M) {
          Z.value = rt(M, "Could not apply the pack upgrade.");
        } finally {
          N.value = !1;
        }
        return;
      }
      if (!Xt.value) return;
      N.value = !0, Z.value = "", O.value = "";
      const K = i();
      try {
        f = (await It.apply(t.boardId, Xt.value, Jt.value)).generation, c = K, await ut(), O.value = "Board changes applied.", de();
      } catch (M) {
        Z.value = rt(M, "Could not apply the board changes.");
      } finally {
        N.value = !1;
      }
    }
    async function io(K, M, te) {
      const ke = t.boardId, Le = await It.packApply(ke, K, M);
      t.boardId === ke && (yt.value = { request: K, key: M, result: Le, draft: te }, te === i() && (f = Le.generation, c = te), await ut());
    }
    async function hi() {
      const K = yt.value;
      if (!(!K || !Yt.value || N.value || !P.value)) {
        N.value = !0, ua.value = "";
        try {
          await io(K.request, K.key, K.draft);
        } catch (M) {
          ua.value = rt(M, "Could not continue the pack installation.");
        } finally {
          N.value = !1;
        }
      }
    }
    async function gi() {
      if (!N.value) {
        N.value = !0, g.value = "";
        try {
          const K = await It.resume(t.boardId);
          O.value = K.resumed ? "Migration resumes." : "Migration is already running.", await ut();
        } catch (K) {
          g.value = rt(K, "Could not resume migration.");
        } finally {
          N.value = !1;
        }
      }
    }
    async function Ma(K, M) {
      if (!F.value || !P.value || N.value || dt.value) return "Wait for the current change to finish.";
      if (nt.value) return "Discard the stale draft before removing a definition.";
      const te = F.value.generation, ke = JSON.stringify(kt.value), Le = ea(H.value);
      Aa(Le, K, M), dt.value = !0;
      try {
        const Ue = await It.plan(t.boardId, co(hl(Le, F.value.declaration), te, X.value));
        if (!P.value || nt.value || F.value.generation !== te || JSON.stringify(kt.value) !== ke) return "The draft changes during the check. Try the removal again.";
        const Ae = Hi(Ue, K, M);
        if (Ae) return Ae;
        if (Ue.class === "refused") return "Resolve the blocked changes in your draft before removing this definition.";
      } catch (Ue) {
        return rt(Ue, "Could not check this removal.");
      } finally {
        dt.value = !1;
      }
    }
    async function yi() {
      if (t.embedded) {
        o({ name: "boards" });
        return;
      }
      _l.value && !await Bo.confirm({ header: "Discard changes?", message: "Your unsaved board settings will be discarded.", acceptLabel: "Discard", rejectLabel: "Keep editing" }) || o({ name: "board", board: t.boardId });
    }
    function ki() {
      f = void 0, fa.value = {}, R.value && fl(R.value), O.value = "", g.value = "", de();
    }
    Ie(() => t.boardId, () => {
      dl.value = !1, fa.value = {}, f = void 0, lo(), $e(), yt.value = void 0, ua.value = "", F.value = void 0, R.value = void 0, ue.value = void 0, X.value = {}, Qe.value.clear(), J(), we.value = void 0, _.value = "", A.value = /* @__PURE__ */ new Set(["General"]), T("General"), de(), P.value = !1, E.value = !0, ut(!0);
    }), Ie([() => t.route, () => t.boardId], ([K]) => {
      if (K === void 0) return;
      const [M, te] = K.split("/"), ke = Object.keys(b).find((Ue) => b[Ue] === M) ?? "General";
      let Le = "";
      try {
        te && (Le = decodeURIComponent(te));
      } catch {
      }
      ke === "Fields" && Le && y.value !== "fields/" + Le && (_.value = ""), T(ke, Le), A.value.add(ke);
    }, { immediate: !0 });
    let pl = () => {
    };
    return Ie(() => t.boardId, (K) => {
      pl(), pl = Yi(`component.${K}`, () => {
        ut();
      });
    }, { immediate: !0 }), Ti(ut), zl(() => {
      pl(), Ql(), Ra(), J();
    }), (K, M) => (n(), h("section", {
      class: ft(["work-settings-shell work-ia", { "work-embedded": e.embedded }])
    }, [
      s("div", fm, [
        k(ln, {
          ref_key: "rail",
          ref: m,
          label: "Board settings sections",
          value: v.value,
          groups: ie.value,
          "leading-item": u.value,
          "onUpdate:value": W
        }, null, 8, ["value", "groups", "leading-item"]),
        s("div", mm, [
          s("div", {
            ref_key: "pane",
            ref: p,
            class: "kx-main-scroll work-settings-content",
            role: "region",
            "aria-label": v.value
          }, [
            P.value && F.value ? (n(), Y(Tv, {
              key: 0,
              title: v.value,
              description: L[v.value]
            }, Ll({ _: 2 }, [
              il.value || v.value === "Plugins" ? {
                name: "actions",
                fn: q(() => [
                  v.value === "Plugins" ? (n(), Y(r(ee), {
                    key: 0,
                    label: "Refresh status",
                    severity: "secondary",
                    outlined: "",
                    disabled: N.value || E.value,
                    onClick: M[0] || (M[0] = (te) => ut())
                  }, {
                    icon: q(() => [
                      k(r(ve), {
                        icon: "tabler:refresh",
                        "aria-hidden": "true"
                      })
                    ]),
                    _: 1
                  }, 8, ["disabled"])) : S("", !0),
                  il.value ? (n(), Y(Iv, {
                    key: 1,
                    busy: N.value,
                    "discard-disabled": dt.value,
                    "review-disabled": dt.value || Zt.value || nt.value || !!Qe.value.size,
                    onDiscard: ki,
                    onReview: ye
                  }, null, 8, ["busy", "discard-disabled", "review-disabled"])) : S("", !0)
                ]),
                key: "0"
              } : void 0
            ]), 1032, ["title", "description"])) : S("", !0),
            g.value ? (n(), h("div", bm, [
              s("p", hm, I(g.value), 1),
              k(r(ee), {
                label: "Retry",
                severity: "secondary",
                outlined: "",
                onClick: M[1] || (M[1] = (te) => ut())
              })
            ])) : S("", !0),
            O.value ? (n(), h("p", gm, I(O.value), 1)) : S("", !0),
            E.value ? (n(), h("p", ym, "Loading board settings…")) : !P.value && !g.value ? (n(), h("p", km, "Ask a board administrator to grant you access to these settings.")) : S("", !0),
            P.value && F.value ? (n(), h("div", wm, [
              yt.value ? (n(), h("section", Vm, [
                Yt.value ? (n(), h("p", $m, [
                  M[23] || (M[23] = z("Pack installation status ", -1)),
                  s("strong", null, I(r(Me)(yt.value.result.status)), 1)
                ])) : (n(), h("p", xm, "Pack applied.")),
                s("p", Cm, [
                  M[24] || (M[24] = z("Operation ", -1)),
                  s("code", null, I(yt.value.result.operation_id), 1),
                  M[25] || (M[25] = z(" · Job ", -1)),
                  s("code", null, I(yt.value.result.job_id), 1)
                ]),
                ua.value ? (n(), h("p", Sm, I(ua.value), 1)) : S("", !0),
                Yt.value ? (n(), h("div", Tm, [
                  k(r(ee), {
                    label: "Continue pack installation",
                    severity: "secondary",
                    outlined: "",
                    loading: N.value,
                    disabled: N.value,
                    onClick: hi
                  }, null, 8, ["loading", "disabled"])
                ])) : S("", !0)
              ])) : S("", !0),
              nt.value ? (n(), h("p", Im, "Someone saved new settings while you were editing. Discard this draft to load their changes.")) : S("", !0),
              Zt.value ? (n(), h("div", Dm, [
                s("p", null, I(R.value?.migration_error ? "Updating existing items paused." : "Updating existing items…"), 1),
                R.value?.migration_error ? (n(), Y(Re, {
                  key: 0,
                  label: "Technical details"
                }, {
                  default: q(() => [
                    z(I(R.value.migration_error), 1)
                  ]),
                  _: 1
                })) : S("", !0),
                R.value?.migration_error ? (n(), Y(r(ee), {
                  key: 1,
                  label: "Resume updating items",
                  severity: "secondary",
                  disabled: N.value,
                  outlined: "",
                  onClick: gi
                }, null, 8, ["disabled"])) : S("", !0)
              ])) : S("", !0),
              pt(k(jf, {
                draft: H.value,
                schema: R.value ?? F.value,
                board: ue.value,
                active: v.value === "General",
                "board-apps": x.value?.board_apps,
                "draft-form": r(d),
                disabled: N.value || dt.value,
                "pack-title": F.value.pack ? ui.value : void 0,
                outdated: F.value.outdated,
                "upgrade-reason": ci.value,
                "can-upgrade": cl.value && ca.value,
                "can-install": ca.value,
                "pack-error": r(oe),
                onUpgrade: vi,
                onInstall: M[2] || (M[2] = (te) => fe.value = !0),
                onRetry: M[3] || (M[3] = (te) => r(me)()),
                onDirtyChange: M[4] || (M[4] = (te) => dl.value = te),
                onSaved: M[5] || (M[5] = (te) => ut())
              }, null, 8, ["draft", "schema", "board", "active", "board-apps", "draft-form", "disabled", "pack-title", "outdated", "upgrade-reason", "can-upgrade", "can-install", "pack-error"]), [
                [Tt, v.value === "General"]
              ]),
              s("form", {
                id: r(d),
                ref_key: "editor",
                ref: rl,
                onSubmit: M[15] || (M[15] = Oe((te) => ye(), ["prevent"]))
              }, [
                (n(), h("fieldset", {
                  key: Zl.value,
                  class: "work-settings-fieldset",
                  disabled: N.value || dt.value,
                  inert: N.value || dt.value || void 0
                }, [
                  A.value.has("Item types") ? pt((n(), Y(Gr, {
                    key: 0,
                    class: "work-ia-section",
                    draft: H.value,
                    "guard-removal": Ma,
                    issues: sl.value
                  }, null, 8, ["draft", "issues"])), [
                    [Tt, v.value === "Item types"]
                  ]) : S("", !0),
                  A.value.has("Fields") ? pt((n(), Y(Ar, {
                    key: 1,
                    class: "work-ia-section",
                    "board-id": e.boardId,
                    "installed-types": x.value?.installed_types,
                    draft: H.value,
                    "guard-removal": Ma,
                    issues: sl.value,
                    "item-type": _.value,
                    "onUpdate:itemType": M[6] || (M[6] = (te) => _.value = te),
                    onValidity: M[7] || (M[7] = (te, ke) => pa("fields:" + te, ke))
                  }, null, 8, ["board-id", "installed-types", "draft", "issues", "item-type"])), [
                    [Tt, v.value === "Fields"]
                  ]) : S("", !0),
                  A.value.has("Links") ? pt((n(), Y(Qc, {
                    key: 2,
                    class: "work-ia-section",
                    draft: H.value,
                    "guard-removal": Ma
                  }, null, 8, ["draft"])), [
                    [Tt, v.value === "Links"]
                  ]) : S("", !0),
                  A.value.has("Workflow") ? pt((n(), h("section", Am, [
                    Te.value ? (n(), h("p", Pm, [
                      M[26] || (M[26] = z("Item counts are unavailable. ", -1)),
                      k(r(ee), {
                        label: "Reload counts",
                        text: "",
                        onClick: M[8] || (M[8] = (te) => w(e.boardId))
                      })
                    ])) : S("", !0),
                    k(Ec, {
                      "board-id": e.boardId,
                      draft: H.value,
                      "guard-removal": Ma,
                      issues: sl.value,
                      counts: we.value,
                      "count-types": F.value.declaration.item_types,
                      guards: x.value?.guards,
                      onValidity: M[9] || (M[9] = (te, ke) => pa("process:" + te, ke))
                    }, null, 8, ["board-id", "draft", "issues", "counts", "count-types", "guards"])
                  ], 512)), [
                    [Tt, v.value === "Workflow"]
                  ]) : S("", !0),
                  A.value.has("Access") ? pt((n(), Y(Zv, {
                    key: 4,
                    active: v.value === "Access",
                    "board-id": e.boardId,
                    draft: H.value,
                    board: ue.value,
                    busy: N.value,
                    onValidity: M[10] || (M[10] = (te) => pa("visibility", te))
                  }, null, 8, ["active", "board-id", "draft", "board", "busy"])), [
                    [Tt, v.value === "Access"]
                  ]) : S("", !0),
                  A.value.has("Plugins") ? pt((n(), h("section", Om, [
                    k(So, {
                      "board-id": e.boardId,
                      draft: H.value,
                      schema: R.value ?? F.value,
                      options: x.value?.schema_options.plugins ?? [],
                      "active-configs": fa.value,
                      "onUpdate:activeConfigs": M[11] || (M[11] = (te) => fa.value = te),
                      filters: x.value?.filters,
                      configs: X.value,
                      disabled: N.value,
                      onConfigured: M[12] || (M[12] = (te) => {
                        wt(), ut();
                      }),
                      onRefresh: M[13] || (M[13] = (te) => ut()),
                      onReview: ye,
                      onValidity: M[14] || (M[14] = (te, ke) => pa("plugin:" + te, ke))
                    }, null, 8, ["board-id", "draft", "schema", "options", "active-configs", "filters", "configs", "disabled"])
                  ], 512)), [
                    [Tt, v.value === "Plugins"]
                  ]) : S("", !0)
                ], 8, Em))
              ], 40, Um),
              k(Ul, {
                visible: j.value,
                label: "Review changes",
                busy: N.value,
                "return-focus": re.value,
                class: "work-review-sheet",
                onClose: de
              }, {
                default: q(() => [
                  s("div", Rm, [
                    s("header", null, [
                      M[27] || (M[27] = s("h2", null, "Review changes", -1)),
                      s("p", Nm, I(ue.value?.title), 1)
                    ]),
                    s("div", {
                      class: "work-review-content work-stack",
                      "aria-busy": N.value
                    }, [
                      N.value ? (n(), h("p", Fm, I(Ke.value ? "Applying or checking changes…" : "Checking the impact on your board…"), 1)) : S("", !0),
                      Z.value ? (n(), h("p", Lm, I(Z.value), 1)) : S("", !0),
                      nt.value ? (n(), h("p", Bm, "The board changed while you were editing. Close this review and discard the draft to load the latest settings.")) : S("", !0),
                      j.value && !Ee.value && (ma.value.removed.length || ma.value.renamed.length) ? (n(), Y(Rc, {
                        key: 3,
                        removed: ma.value.removed,
                        renamed: ma.value.renamed,
                        disabled: N.value || dt.value,
                        confirmed: Na.value,
                        "onUpdate:confirmed": M[16] || (M[16] = (te) => Na.value = te),
                        onDestination: di
                      }, null, 8, ["removed", "renamed", "disabled", "confirmed"])) : S("", !0),
                      j.value && Ee.value && ul.value.length ? (n(), Y(So, {
                        key: 4,
                        "board-id": e.boardId,
                        draft: { plugins: ul.value },
                        schema: R.value ?? F.value,
                        options: x.value?.schema_options.plugins.filter((te) => ul.value.some((ke) => ke.use === te.plugin)) ?? [],
                        configs: X.value,
                        disabled: N.value,
                        "activation-locked": "",
                        onValidity: M[17] || (M[17] = (te, ke) => pa("pack-plugin:" + te, ke))
                      }, null, 8, ["board-id", "draft", "schema", "options", "configs", "disabled"])) : S("", !0),
                      j.value ? (n(), Y(lm, {
                        key: 5,
                        "board-id": e.boardId,
                        original: F.value.declaration,
                        declaration: oo.value,
                        plan: Ke.value,
                        follows: mi.value,
                        "config-count": Object.keys(X.value).length,
                        "pack-review": !!Rt.value,
                        plugins: x.value?.schema_options.plugins
                      }, {
                        default: q(() => [
                          Rt.value && Ee.value ? (n(), Y(vm, {
                            key: 0,
                            plan: Rt.value,
                            request: Ee.value,
                            original: F.value.declaration,
                            plugins: x.value?.schema_options.plugins,
                            disabled: N.value,
                            onChange: M[18] || (M[18] = (te) => {
                              gt.value = void 0, Jt.value = "";
                            })
                          }, null, 8, ["plan", "request", "original", "plugins", "disabled"])) : S("", !0)
                        ]),
                        _: 1
                      }, 8, ["board-id", "original", "declaration", "plan", "follows", "config-count", "pack-review", "plugins"])) : S("", !0),
                      !N.value && !ao.value && !nt.value && !Z.value ? (n(), h("p", zm, "Check the impact again before applying.")) : S("", !0)
                    ], 8, Mm),
                    s("footer", jm, [
                      k(r(ee), {
                        label: "Keep editing",
                        severity: "secondary",
                        outlined: "",
                        disabled: N.value,
                        onClick: de
                      }, null, 8, ["disabled"]),
                      ao.value ? (n(), Y(r(ee), {
                        key: 1,
                        label: "Apply changes",
                        disabled: !to.value,
                        loading: N.value,
                        onClick: bi
                      }, null, 8, ["disabled", "loading"])) : (n(), Y(r(ee), {
                        key: 0,
                        label: "Check impact",
                        disabled: N.value || nt.value || !!Qe.value.size,
                        onClick: ml
                      }, null, 8, ["disabled"]))
                    ])
                  ])
                ]),
                _: 1
              }, 8, ["visible", "busy", "return-focus"]),
              dt.value ? (n(), h("p", Wm, "Checking what uses this setting…")) : S("", !0)
            ])) : S("", !0)
          ], 8, pm)
        ])
      ]),
      P.value ? (n(), Y(Ul, {
        key: 0,
        visible: fe.value,
        label: "Install pack",
        busy: N.value,
        onClose: M[22] || (M[22] = (te) => fe.value = !1)
      }, {
        default: q(() => [
          fe.value ? (n(), h("form", {
            key: 0,
            class: "work-dialog-box work-stack",
            onSubmit: Oe(fi, ["prevent"])
          }, [
            M[29] || (M[29] = s("h2", null, "Install a pack", -1)),
            M[30] || (M[30] = s("p", { class: "work-muted work-small" }, "Packs give an empty board a starting setup. Review checks whether this board is eligible.", -1)),
            r($) ? (n(), h("p", qm, "Loading packs…")) : r(oe) ? (n(), h("div", Gm, [
              s("p", Km, I(r(oe)), 1),
              k(r(ee), {
                label: "Reload packs",
                severity: "secondary",
                outlined: "",
                onClick: M[19] || (M[19] = (te) => r(me)())
              })
            ])) : We.value.length ? (n(), h("label", Hm, [
              M[28] || (M[28] = z("Pack ", -1)),
              k(r(ce), {
                modelValue: le.value,
                "onUpdate:modelValue": M[20] || (M[20] = (te) => le.value = te),
                "aria-label": "Pack to install",
                appendTo: "self",
                optionLabel: "title",
                optionValue: "id",
                optionDisabled: "disabled",
                options: We.value,
                pt: { option: ({ context: te }) => ({ "aria-label": [te.option.title, te.option.unavailable].filter(Boolean).join(". ") }) }
              }, {
                option: q(({ option: te }) => [
                  s("span", null, [
                    z(I(te.title), 1),
                    te.unavailable ? (n(), h("small", Ym, I(te.unavailable), 1)) : S("", !0)
                  ])
                ]),
                _: 1
              }, 8, ["modelValue", "options", "pt"])
            ])) : (n(), h("p", Xm, "No available packs were found.")),
            s("footer", Jm, [
              k(r(ee), {
                label: "Cancel",
                severity: "secondary",
                outlined: "",
                onClick: M[21] || (M[21] = (te) => fe.value = !1)
              }),
              k(r(ee), {
                type: "submit",
                label: "Review pack",
                disabled: !lt.value || !ca.value || r($) || !!r(oe)
              }, null, 8, ["disabled"])
            ])
          ], 32)) : S("", !0)
        ]),
        _: 1
      }, 8, ["visible", "busy"])) : S("", !0)
    ], 2));
  }
}), Qm = /* @__PURE__ */ Ve({
  __name: "SettingsRoot",
  setup(e) {
    const a = Ii(), t = Di();
    return Po(jo, (l) => {
      a.value.embedded && l.name === "boards" ? t("back-to-boards", {}) : t("navigate", { route: nn(l) });
    }), (l, o) => (n(), Y(Zm, {
      "board-id": r(a).boardId ?? "",
      embedded: r(a).embedded,
      "focus-back": r(a).focusBack,
      route: r(a).route,
      onNavigate: o[0] || (o[0] = (d) => r(t)("navigate", { route: d })),
      onDirtyChange: o[1] || (o[1] = (d) => r(t)("dirty-change", { dirty: d }))
    }, null, 8, ["board-id", "embedded", "focus-back", "route"]));
  }
}), _m = Ui(Qm, {
  type: "object",
  properties: {
    "board-id": { type: "string", default: "", description: "Board to administer." },
    "focus-back": { type: "boolean", default: !1, description: "Focus the first rail action when opening settings from the board picker." },
    route: { type: "string", description: "Section and selected row in System." },
    embedded: { type: "boolean", default: !1, description: "Fits in a System detail pane." }
  }
});
Xi(import.meta.url, _m);
//# sourceMappingURL=settings.js.map
