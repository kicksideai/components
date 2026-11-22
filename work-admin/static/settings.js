import { defineComponent as Ve, computed as W, openBlock as n, createBlock as K, resolveDynamicComponent as oa, normalizeProps as fi, guardReactiveProps as pi, createSlots as Pl, withCtx as q, createElementVNode as r, normalizeClass as ct, createElementBlock as b, Fragment as ee, renderList as ue, toDisplayString as I, createCommentVNode as S, unref as s, renderSlot as Xe, inject as bi, ref as B, useSlots as hi, createVNode as y, Transition as $o, withDirectives as mt, vShow as xt, watch as Ie, onMounted as Sa, onUnmounted as Rl, resolveComponent as xo, createTextVNode as j, onBeforeUnmount as Vt, useId as zt, withKeys as ze, withModifiers as Ee, normalizeStyle as gi, watchEffect as Co, nextTick as _t, useModel as yi, mergeModels as _l, provide as ki } from "vue";
import { e as Ut, u as wi, b as Vi, c as $i, a as xi } from "./mount-Chf6MiNr.js";
import "pinia";
import { m as La, h as eo, s as ke, i as Ci, t as je, g as Si, j as Ht, k as Yt, r as to, w as It, f as nt, l as ga, n as Lt, o as He, q as Et, v as So, x as Oe, y as Ne, z as To, A as jt, B as Io, C as xa, D as Ja, d as Do, E as Ta, c as Uo, F as Ti, G as qa, H as xl, I as Ii, J as Mt, K as Di, _ as Cl, L as Ui, M as Ei, N as Eo, O as Ai, P as Oi, u as Pi, a as Ri, p as Ni, Q as vl, R as Mi, S as Xt, T as ao, U as Fi, V as Li, W as lo, X as Bi, Y as zi } from "./usePackDiscovery-CfANJ1PP.js";
import fe from "primevue/select";
import _ from "primevue/button";
import { Icon as pe } from "@iconify/vue";
import { api as Sl, host as Ao, on as ji, define as Wi } from "@wippy-fe/proxy";
import tt from "primevue/tag";
import et from "primevue/toggleswitch";
import Bt from "primevue/checkbox";
import Se from "primevue/inputtext";
import Ca from "primevue/textarea";
import yt from "primevue/inputnumber";
import Nl from "primevue/selectbutton";
import qi from "primevue/message";
const ml = (e, a) => e.x > a.x && e.x < a.x + a.width && e.y > a.y && e.y < a.y + a.height;
function Gi(e, a, t) {
  return e.x === a.x ? e.x > t.x && e.x < t.x + t.width && Math.max(e.y, a.y) > t.y && Math.min(e.y, a.y) < t.y + t.height : e.y > t.y && e.y < t.y + t.height && Math.max(e.x, a.x) > t.x && Math.min(e.x, a.x) < t.x + t.width;
}
function Ot(e, a, t) {
  const l = [.../* @__PURE__ */ new Set([e.x, a.x, ...t.flatMap(($) => [$.x, $.x + $.width])])].sort(($, C) => $ - C), o = [.../* @__PURE__ */ new Set([e.y, a.y, ...t.flatMap(($) => [$.y, $.y + $.height])])].sort(($, C) => $ - C);
  l.unshift(l[0] - 24), l.push(l.at(-1) + 24), o.unshift(o[0] - 24), o.push(o.at(-1) + 24);
  const u = l.length, f = o.indexOf(a.y) * u + l.indexOf(a.x), m = o.indexOf(e.y) * u + l.indexOf(e.x), d = ($) => ({ x: l[$ % u], y: o[Math.floor($ / u)] }), i = /* @__PURE__ */ new Map(), c = /* @__PURE__ */ new Map(), p = [];
  function w($) {
    p.push($);
    let C = p.length - 1;
    for (; C; ) {
      const N = C - 1 >> 1;
      if (p[N].priority <= $.priority) break;
      p[C] = p[N], C = N;
    }
    p[C] = $;
  }
  function v() {
    const $ = p[0], C = p.pop();
    if (p.length) {
      let N = 0;
      for (; N * 2 + 1 < p.length; ) {
        let F = N * 2 + 1;
        if (F + 1 < p.length && p[F + 1].priority < p[F].priority && F++, C.priority <= p[F].priority) break;
        p[N] = p[F], N = F;
      }
      p[N] = C;
    }
    return $;
  }
  const g = ($) => Math.abs($.x - a.x) + Math.abs($.y - a.y);
  for (const $ of [0, 1]) {
    const C = m * 2 + $;
    i.set(C, 0), w({ key: C, cost: 0, priority: g(e) });
  }
  const k = /* @__PURE__ */ new Map(), T = /* @__PURE__ */ new Map();
  for (; p.length; ) {
    const $ = v(), C = Math.floor($.key / 2), N = $.key % 2;
    if ($.cost !== i.get($.key)) continue;
    if (C === f) {
      const le = [];
      let de = $.key;
      for (; de !== void 0; )
        le.push(d(Math.floor(de / 2))), de = c.get(de);
      return Oo(le.reverse());
    }
    const F = d(C), z = C % u, ie = Math.floor(C / u);
    for (const [le, de] of [[z > 0 ? C - 1 : -1, 0], [z + 1 < u ? C + 1 : -1, 0], [ie > 0 ? C - u : -1, 1], [ie + 1 < o.length ? C + u : -1, 1]]) {
      if (le < 0) continue;
      const Z = d(le);
      if (k.has(le) || k.set(le, !t.some((U) => ml(Z, U))), !k.get(le)) continue;
      const ve = `${Math.min(C, le)}:${Math.max(C, le)}`;
      if (T.has(ve) || T.set(ve, !t.some((U) => Gi(F, Z, U))), !T.get(ve)) continue;
      const be = $.cost + Math.abs(F.x - Z.x) + Math.abs(F.y - Z.y) + (N === de ? 0 : 18), te = le * 2 + de;
      be >= (i.get(te) ?? 1 / 0) || (i.set(te, be), c.set(te, $.key), w({ key: te, cost: be, priority: be + g(Z) }));
    }
  }
  throw new Error("Process map has no collision-free route between its ports: " + JSON.stringify({ start: e, end: a, startInside: t.filter(($) => ml(e, $)), endInside: t.filter(($) => ml(a, $)) }));
}
function Oo(e) {
  const a = [];
  for (const t of e) {
    const l = a.at(-1), o = a.at(-2);
    l && l.x === t.x && l.y === t.y || (o && l && (o.x === l.x && l.x === t.x || o.y === l.y && l.y === t.y) && a.pop(), a.push(t));
  }
  return a;
}
const ca = (e) => Array.from(e).reduce((a, t) => a + (/[^\x20-\x7e]/u.test(t) ? 16 : /[MW@%]/.test(t) ? 11 : /[ilI.,:;!| ']/.test(t) ? 4 : 7.5), 0);
function ta(e, a = 28) {
  const t = [];
  let l = "";
  for (const o of e.split(/\s+/u))
    for (let u = 0; u < o.length; u += a) {
      const f = o.slice(u, u + a);
      l && l.length + f.length + 1 > a && (t.push(l), l = ""), l = l ? l + " " + f : f;
    }
  return [...t, l].filter(Boolean);
}
function Pa(e) {
  if (e = Oo(e), !e.length) return "";
  let a = `M ${e[0].x} ${e[0].y}`;
  for (let l = 1; l < e.length - 1; l++) {
    const o = e[l - 1], u = e[l], f = e[l + 1], m = Math.hypot(u.x - o.x, u.y - o.y), d = Math.hypot(f.x - u.x, f.y - u.y), i = Math.min(8, m / 3, d / 3);
    i && (a += ` L ${u.x + (o.x - u.x) * i / m} ${u.y + (o.y - u.y) * i / m} Q ${u.x} ${u.y} ${u.x + (f.x - u.x) * i / d} ${u.y + (f.y - u.y) * i / d}`);
  }
  const t = e.at(-1);
  return a + ` L ${t.x} ${t.y}`;
}
function Ki(e, a = {}, t = { width: 1400, height: 480 }) {
  const l = t.direction ?? (t.width < 750 || La(e).length > 8 ? "TB" : "LR"), o = t.direction === "LR" && La(e).length > 6, u = new eo.graphlib.Graph({ multigraph: !0 });
  u.setGraph({ rankdir: l, ranker: "network-simplex", acyclicer: "greedy", nodesep: 32, edgesep: 32, ranksep: 24, marginx: 32, marginy: 32 }), u.setDefaultEdgeLabel(() => ({}));
  const f = La(e), m = new Map(f.map((h, A) => [h.id, A])), d = e.states.map((h) => {
    const A = (e.transitions ?? []).filter((D) => D.from === "any" && D.to === h.id), se = ta(ke(h), o ? 13 : 28), re = ta(Ci(h, e), o ? 13 : 28), $e = A.flatMap((D) => ta(je(D) + " works from any state")), H = a.policy?.wip?.[h.id]?.limit, L = H === void 0 ? 0 : ca(" · limit " + H), V = Math.max(o ? 122 : 168, ...se.map((D) => ca(D) + 58), ...re.map((D, ne) => ca(D) + 32 + (ne === re.length - 1 ? L : 0)), ...$e.map((D) => ca(D) + 32)), R = Math.max(80, 42 + se.length * 18 + re.length * 16 + $e.length * 18);
    return u.setNode(h.id, { width: V + (l === "LR" ? 36 : 0), height: R + (l === "TB" ? 36 : 0) }), { state: h, x: 0, y: 0, width: V, height: R, title: se, caption: re, badges: A, row: m.has(h.id) ? 0 : 1 };
  }), i = new Set(d.map((h) => h.state.id)), c = (e.transitions ?? []).flatMap((h) => h.from === "any" ? [] : h.from.filter((A) => i.has(A) && i.has(h.to)).map((A) => {
    const se = `${h.id}-${A}`, re = ta(je(h), o ? 12 : 28), $e = Math.max(o ? 60 : 72, ...re.map((L) => ca(L) + 24)), H = Math.max(24, re.length * 16 + 10);
    return { transition: h, from: A, key: se, lines: re, width: $e, height: H };
  })), p = /* @__PURE__ */ new Set(), w = /* @__PURE__ */ new Set(), v = new Set(c.filter((h) => h.from === h.transition.to || h.transition.to === e.initial || ["completed", "canceled"].includes(d.find((A) => A.state.id === h.from).state.category)).map((h) => h.key));
  function g(h) {
    if (!w.has(h)) {
      p.add(h);
      for (const A of c.filter((se) => se.from === h))
        v.has(A.key) || (p.has(A.transition.to) ? v.add(A.key) : g(A.transition.to));
      p.delete(h), w.add(h);
    }
  }
  g(e.initial);
  for (const h of d) g(h.state.id);
  for (const h of c) if (!v.has(h.key)) {
    const A = m.get(h.from), se = m.get(h.transition.to);
    u.setEdge(h.from, h.transition.to, { width: h.width, height: h.height, labelpos: "c", weight: A !== void 0 && se === A + 1 ? 100 : 1 }, h.key);
  }
  for (const h of e.transitions ?? []) if (h.from === "any" && i.has(e.initial) && i.has(h.to) && !m.has(h.to)) {
    const A = e.states.find((se) => se.id === h.to);
    u.setEdge(e.initial, h.to, { minlen: ["completed", "canceled"].includes(A.category) ? Math.max(1, f.length - 1) : 1 }, `any:${h.id}`);
  }
  const k = e.states.flatMap((h) => (h.regions ?? []).filter((A) => i.has(A.initial)).map((A, se) => {
    const re = `lane:${h.id}:${se}`;
    return u.setEdge(h.id, A.initial, {}, re), { state: h, region: A, key: re };
  }));
  if (!d.length) return { nodes: d, edges: [], parallels: [], main: f, direction: l, width: 320, height: 160 };
  eo.layout(u);
  for (const h of d) Object.assign(h, { x: u.node(h.state.id).x, y: u.node(h.state.id).y });
  const T = l === "TB", $ = c.filter((h) => !v.has(h.key)).map((h) => u.edge({ v: h.from, w: h.transition.to, name: h.key })), C = [...d, ...$], N = Math.max(...C.map((h) => h.x + h.width / 2)), F = Math.max(...C.map((h) => h.y + h.height / 2)), z = (h) => d.find((A) => A.state.id === h), ie = c.filter((h) => v.has(h.key)).sort((h, A) => {
    const se = T ? "y" : "x";
    return Math.abs(z(h.from)[se] - z(h.transition.to)[se]) - Math.abs(z(A.from)[se] - z(A.transition.to)[se]);
  }), le = /* @__PURE__ */ new Map(), de = Math.max(0, ...ie.map((h) => h.width));
  let Z = F + 32;
  for (const [h, A] of ie.entries()) {
    const se = z(A.from), re = z(A.transition.to), $e = T ? N + 16 + de + 28 + h * 18 : Z + A.height / 2, H = T ? N + 16 + de / 2 : (se.x + re.x) / 2;
    let L = T ? se.y + se.height / 2 + 18 : $e;
    if (T) for (const V of [...le.values()].sort((R, D) => R.y - D.y))
      L + A.height / 2 + 10 > V.y - V.height / 2 - 10 && L - A.height / 2 - 10 < V.y + V.height / 2 + 10 && (L = V.y + V.height / 2 + 24 + A.height / 2);
    le.set(A.key, { x: H, y: L, corridor: $e, height: A.height }), Z = $e + A.height / 2 + 24;
  }
  const ve = c.map((h) => ({ ...h, ...le.get(h.key) ?? u.edge({ v: h.from, w: h.transition.to, name: h.key }) })), be = (h, A) => ({ x: h.x - h.width / 2 - A, y: h.y - h.height / 2 - A, width: h.width + A * 2, height: h.height + A * 2 }), te = [...d.map((h) => be(h, 12)), ...ve.map((h) => be(h, 10))], U = (h, A) => ({
    start: T ? { x: h.x, y: h.y + h.height / 2 } : { x: h.x + h.width / 2, y: h.y },
    end: T ? { x: A.x, y: A.y - A.height / 2 } : { x: A.x - A.width / 2, y: A.y }
  }), Y = (h, A) => T ? { x: h.x, y: h.y + A } : { x: h.x + A, y: h.y }, P = ve.map((h) => {
    const A = d.find((De) => De.state.id === h.from), se = d.find((De) => De.state.id === h.transition.to), { start: re, end: $e } = U(A, se), H = v.has(h.key), L = Y(re, 18), V = Y($e, -18), R = (H || !T ? h.width : h.height) / 2 + 10, D = H ? { x: h.x + (T ? -R : R), y: h.y } : Y(h, -R), ne = H ? { x: h.x + (T ? R : -R), y: h.y } : Y(h, R);
    let ce;
    if (H) {
      const { corridor: De } = le.get(h.key), Le = T ? { x: De, y: h.y } : { x: L.x, y: De }, bt = T ? { x: De, y: V.y } : { x: V.x, y: De };
      ce = T ? [
        [re, ...Ot(L, D, te)],
        [ne, Le, bt, ...Ot(bt, V, te), $e]
      ] : [
        [re, ...Ot(L, Le, te), D],
        [ne, ...Ot(bt, V, te), $e]
      ];
    } else ce = [
      [re, ...Ot(L, D, te)],
      [...Ot(ne, V, te), $e]
    ];
    const we = H ? "return" : m.get(h.transition.to) === (m.get(h.from) ?? -2) + 1 ? "main" : "forward";
    return { ...h, points: ce.flat(), segments: ce, path: ce.map(Pa).join(" "), type: we, targetOffset: 0 };
  }), me = k.map((h) => {
    const A = d.find((L) => L.state.id === h.state.id), se = d.find((L) => L.state.id === h.region.initial), { start: re, end: $e } = U(A, se), H = [re, ...Ot(Y(re, 18), Y($e, -18), te), $e];
    return { state: h.state, key: h.key, points: H, path: Pa(H) };
  }), O = [...d.flatMap((h) => [{ x: h.x - h.width / 2, y: h.y - h.height / 2 }, { x: h.x + h.width / 2, y: h.y + h.height / 2 }]), ...P.flatMap((h) => [...h.points, { x: h.x - h.width / 2, y: h.y - h.height / 2 }, { x: h.x + h.width / 2, y: h.y + h.height / 2 }]), ...me.flatMap((h) => h.points)], Q = 32 - Math.min(...O.map((h) => h.x)), x = 32 - Math.min(...O.map((h) => h.y)), M = Math.max(...O.map((h) => h.x)) + Q + 32, E = Math.max(...O.map((h) => h.y)) + x + 32, X = (h) => ({ x: h.x + Q, y: h.y + x });
  for (const h of d) Object.assign(h, X(h));
  for (const h of P)
    Object.assign(h, X(h)), h.segments = h.segments.map((A) => A.map(X)), h.points = h.segments.flat(), h.path = h.segments.map(Pa).join(" ");
  for (const h of me)
    h.points = h.points.map(X), h.path = Pa(h.points);
  return { nodes: d, edges: P, parallels: me, main: f, direction: l, width: M, height: E };
}
const Hi = ["aria-label"], Yi = {
  key: 0,
  class: "kx-settings-rail-group"
}, Xi = ["aria-current", "onClick"], Ji = { class: "kx-settings-rail-label" }, Zi = /* @__PURE__ */ Ve({
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
    const a = e, t = W(() => a.leadingItem ? [{ items: [a.leadingItem] }, ...a.groups] : a.groups);
    function l(o) {
      const u = [...o.currentTarget.querySelectorAll(".kx-settings-rail-item")], f = u.indexOf(o.target);
      if (f < 0) return;
      let m;
      switch (o.key) {
        case "ArrowDown":
        case "ArrowRight":
          m = (f + 1) % u.length;
          break;
        case "ArrowUp":
        case "ArrowLeft":
          m = (f + u.length - 1) % u.length;
          break;
        case "Home":
          m = 0;
          break;
        case "End":
          m = u.length - 1;
          break;
        default:
          return;
      }
      o.preventDefault(), u[m]?.focus();
    }
    return (o, u) => (n(), K(oa(e.title ? Si : "div"), fi(pi(e.title ? { title: e.title, count: e.count, settings: !0 } : { class: "kx-settings-rail-standalone" })), Pl({
      default: q(() => [
        r("nav", {
          class: ct(["kx-settings-rail", { "kx-settings-rail-framed": e.title }]),
          "aria-label": e.label,
          onKeydown: l
        }, [
          (n(!0), b(ee, null, ue(t.value, (f, m) => (n(), b("div", {
            key: f.items[0]?.value ?? m,
            class: ct(["kx-settings-rail-section", { "kx-settings-rail-leading": e.leadingItem && m === 0 }])
          }, [
            f.heading ? (n(), b("div", Yi, I(f.heading), 1)) : S("", !0),
            (n(!0), b(ee, null, ue(f.items, (d) => (n(), b("button", {
              key: d.value,
              type: "button",
              class: "kx-settings-rail-item",
              "aria-current": d.value === e.value ? "true" : void 0,
              onClick: (i) => o.$emit("update:value", d.value)
            }, [
              d.icon ? (n(), K(s(pe), {
                key: 0,
                class: "kx-settings-rail-icon",
                icon: d.icon,
                "aria-hidden": "true"
              }, null, 8, ["icon"])) : S("", !0),
              r("span", Ji, I(d.label), 1)
            ], 8, Xi))), 128))
          ], 2))), 128))
        ], 42, Hi)
      ]),
      _: 2
    }, [
      e.title && o.$slots.actions ? {
        name: "actions",
        fn: q(() => [
          Xe(o.$slots, "actions")
        ]),
        key: "0"
      } : void 0
    ]), 1040));
  }
}), Po = Symbol("work-navigation");
function Qi() {
  return bi(Po, () => {
  });
}
function _i(e) {
  if (e.name === "boards") return "";
  const a = encodeURIComponent(e.board);
  return e.name === "settings" ? `${a}/settings` : a;
}
const Jt = (e) => `/api/v1/work/boards/${encodeURIComponent(e)}`, oo = (e) => ({ declaration: e.declaration, expected_generation: e.expected_generation, plugin_configs: e.plugin_configs }), Ct = {
  packPlan: (e, a) => Ht(`${Jt(e)}/pack_plan`, a, "Pack plan"),
  packApply: (e, a, t) => Ht(`${Jt(e)}/pack_apply`, { ...a, key: t }, "Apply pack"),
  plan: (e, a) => Ht(`${Jt(e)}/plan_schema`, oo(a), "Schema plan"),
  apply: (e, a, t) => Ht(`${Jt(e)}/apply_schema`, { ...oo(a), key: t }, "Apply schema"),
  resume: (e) => Ht(`${Jt(e)}/resume_migration`, {}, "Resume migration"),
  configure: (e, a, t) => Ht(`${Jt(e)}/configure_plugin`, { plugin: a, ...t === void 0 ? {} : { config: t } }, "Configure plugin")
}, Ml = /* @__PURE__ */ Ve({
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
        const d = m.closest('[data-work-action], button, a, input, textarea, [role="combobox"], [role="checkbox"], [role="switch"], details');
        if (d && d !== f.currentTarget) return;
      }
      l("activate", f);
    }
    function u(f) {
      f.target !== f.currentTarget || !["Enter", " "].includes(f.key) || (f.preventDefault(), t.disabled || l("activate", f));
    }
    return (f, m) => (n(), K(oa(e.as), {
      "data-work-action": "",
      class: "work-content-action",
      type: e.as === "button" ? "button" : void 0,
      role: e.role,
      tabindex: e.disabled ? -1 : 0,
      disabled: e.as === "button" ? e.disabled : void 0,
      "aria-disabled": e.disabled || void 0,
      onClick: o,
      onKeydown: u
    }, {
      default: q(() => [
        Xe(f.$slots, "default")
      ]),
      _: 3
    }, 40, ["type", "role", "tabindex", "disabled", "aria-disabled"]));
  }
}), en = { class: "work-definition" }, tn = {
  key: 0,
  class: "work-definition-handle"
}, an = { class: "work-definition-lead" }, ln = ["title"], on = {
  key: 0,
  class: "work-definition-description"
}, nn = { class: "work-definition-details" }, sn = { class: "work-definition-code" }, rn = ["title"], dn = { class: "work-definition-kind" }, un = {
  key: 0,
  class: "work-definition-kind-label"
}, cn = { class: "work-definition-kind-value" }, vn = { class: "work-definition-flags" }, mn = { class: "work-definition-usage" }, fn = { class: "work-definition-actions" }, pn = ["inert"], Za = /* @__PURE__ */ Ve({
  __name: "DefinitionRow",
  props: {
    title: {},
    code: {},
    kind: {},
    kindLabel: {},
    description: {},
    initialOpen: { type: Boolean }
  },
  setup(e) {
    const t = B(!!e.initialOpen), l = hi();
    return (o, u) => (n(), b("article", en, [
      r("header", {
        class: ct(["work-definition-head", { "work-definition-has-handle": s(l).handle }])
      }, [
        s(l).handle ? (n(), b("div", tn, [
          Xe(o.$slots, "handle")
        ])) : S("", !0),
        r("div", an, [
          y(Ml, {
            class: "work-definition-toggle",
            "aria-expanded": t.value,
            onActivate: u[0] || (u[0] = (f) => t.value = !t.value)
          }, {
            default: q(() => [
              y(s(pe), {
                icon: "tabler:chevron-right",
                "aria-hidden": "true"
              }),
              r("span", {
                class: "work-row-title",
                title: e.title
              }, I(e.title), 9, ln)
            ]),
            _: 1
          }, 8, ["aria-expanded"]),
          e.description ? (n(), b("p", on, I(e.description), 1)) : S("", !0)
        ]),
        r("div", nn, [
          r("span", sn, [
            e.code ? (n(), b("code", {
              key: 0,
              class: "work-mono",
              title: e.code
            }, I(e.code), 9, rn)) : S("", !0)
          ]),
          r("span", dn, [
            e.kind ? (n(), K(s(tt), {
              key: 0,
              severity: "secondary"
            }, {
              default: q(() => [
                e.kindLabel ? (n(), b("span", un, I(e.kindLabel) + ":", 1)) : S("", !0),
                r("span", cn, I(e.kind), 1)
              ]),
              _: 1
            })) : S("", !0),
            Xe(o.$slots, "status")
          ]),
          r("span", vn, [
            Xe(o.$slots, "flags")
          ]),
          r("div", mn, [
            Xe(o.$slots, "usage")
          ])
        ]),
        r("div", fn, [
          Xe(o.$slots, "actions")
        ])
      ], 2),
      y($o, {
        name: "work-panel",
        persisted: ""
      }, {
        default: q(() => [
          mt(r("div", {
            inert: !t.value,
            class: "work-definition-body work-stack"
          }, [
            Xe(o.$slots, "default")
          ], 8, pn), [
            [xt, t.value]
          ])
        ]),
        _: 3
      })
    ]));
  }
}), bn = { class: "work-definition-scroll" }, hn = {
  key: 0,
  class: "work-definition-columns",
  "aria-hidden": "true"
}, gn = { key: 0 }, yn = { class: "work-definition-usage" }, Qa = /* @__PURE__ */ Ve({
  __name: "DefinitionList",
  props: {
    count: {},
    columns: {}
  },
  setup(e) {
    return (a, t) => (n(), b("div", bn, [
      r("div", {
        class: ct(["work-field-builder", "work-definitions-" + e.columns])
      }, [
        e.count > 3 && e.columns !== "plugins" ? (n(), b("div", hn, [
          t[0] || (t[0] = r("span", null, null, -1)),
          t[1] || (t[1] = r("span", null, "Name", -1)),
          t[2] || (t[2] = r("span", { class: "work-definition-code" }, "Identifier", -1)),
          r("span", null, I(e.columns === "types" ? "Workflow" : "Kind"), 1),
          e.columns === "fields" ? (n(), b("span", gn, "Details")) : S("", !0),
          r("span", yn, I(e.columns === "fields" ? "Used by" : "Details"), 1),
          t[3] || (t[3] = r("span", null, null, -1))
        ])) : S("", !0),
        Xe(a.$slots, "default")
      ], 2)
    ]));
  }
}), kn = [
  { code: "key", form: "text", index: "key" },
  { code: "type", form: "text", index: "key" },
  { code: "state", form: "text", index: "key" },
  { code: "category", form: "text", index: "key" },
  { code: "rank", form: "text", index: "key" },
  { code: "parent", form: "text", index: "key" },
  { code: "created_at", form: "time", index: "key" },
  { code: "updated_at", form: "time", index: "key" }
];
function wn(e) {
  const a = e.compiled.processes?.flatMap((t) => t.states.map((l) => ({ id: l.id, label: l.name }))) ?? [];
  return [...kn.filter((t) => t.code !== "rank").map((t) => t.code === "state" ? { ...t, type: "option", options: a } : t.code === "category" ? { ...t, type: "option", options: ["triage", "backlog", "unstarted", "started", "completed", "canceled"].map((l) => ({ id: l })) } : t), ...(e.compiled.fields ?? []).filter((t) => t.index && t.index !== "none")];
}
function Vn(e) {
  if (e?.cardinality && e.cardinality !== "one") return ["has", "in", "nin", "is_null", ...e.type === "principal" ? ["member_of"] : []];
  const a = ["eq", "neq", "in", "nin", "is_null", ...e?.type === "principal" ? ["member_of"] : []];
  return e && (["int", "number", "dec", "time", "quantity"].includes(e.form ?? "") || e.index === "number") && a.push("lt", "lte", "gt", "gte", "between"), e?.form === "text" && e.type !== "option" && a.push("contains", "starts_with"), a;
}
const $n = { class: "work-field-control" }, xn = ["id"], Cn = {
  key: 1,
  class: "work-stack work-tight"
}, Sn = { class: "work-chips" }, Tn = {
  key: 5,
  class: "work-row"
}, In = ["inert"], Dn = ["value"], Un = {
  key: 1,
  class: "work-muted"
}, En = ["inert"], An = ["value"], On = {
  key: 1,
  class: "work-muted"
}, Pn = {
  key: 11,
  class: "work-stack work-tight"
}, Rn = {
  class: "work-stack work-tight",
  "aria-label": "Matching items"
}, Nn = { class: "work-mono" }, Mn = {
  key: 15,
  class: "work-error work-small",
  role: "alert"
}, Ro = /* @__PURE__ */ Ve({
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
    const t = e, l = a, o = W(() => t.inputId ?? `field-${t.field.code}`), u = W(() => !!t.field.cardinality && t.field.cardinality !== "one"), f = W(() => Array.isArray(t.modelValue) ? t.modelValue : []), m = W(() => t.modelValue == null ? "" : typeof t.modelValue == "object" ? Yt(t.modelValue) : String(t.modelValue)), d = W(() => {
      const h = t.modelValue;
      return h && typeof h == "object" && "ref" in h && Array.isArray(h.ref) ? String(h.ref[1] ?? "") : "";
    }), i = W(() => t.disabled || to(t.field)), c = B(!1), p = B(!1), w = B(!1), v = B(""), g = B(""), k = B([]), T = ga(), $ = B([]);
    let C = 0, N;
    const F = /* @__PURE__ */ new Set();
    Ie(f, (h) => {
      $.value = N ?? h.map((A, se) => $.value[se] ?? C++), N = void 0;
    }, { immediate: !0 });
    function z(h) {
      l("update:modelValue", h);
    }
    function ie(h, A) {
      const se = [...f.value];
      se[h] = A, z(se);
    }
    function le(h, A) {
      A ? F.delete(h) : F.add(h), l("validity", !F.size);
    }
    function de(h) {
      F.delete($.value[h]), l("validity", !F.size), N = $.value.filter((A, se) => se !== h), z(f.value.filter((A, se) => se !== h));
    }
    function Z() {
      N = [...$.value, C++], z([...f.value, t.field.form === "bool" ? !1 : t.field.form === "record" ? {} : ""]);
    }
    function ve(h) {
      const A = h.detail, se = A?.principal_id ?? A?.id;
      z(se ? { kind: A.type ?? "user", id: se } : void 0);
    }
    function be(h) {
      const A = h.detail;
      z(A?.thread_id ? { ref: ["component", A.thread_id] } : void 0);
    }
    const te = B("");
    let U = "";
    Ie(() => t.modelValue, (h) => {
      const A = JSON.stringify(h ?? {}, null, 2);
      A !== U && (U = A, te.value = A, v.value = "", l("validity", !0));
    }, { immediate: !0 });
    function Y(h) {
      te.value = h;
      try {
        const A = JSON.parse(h);
        if (!A || typeof A != "object" || Array.isArray(A)) throw new Error("Enter a JSON object.");
        if (t.field.type === "rich_text" && !("type" in A && typeof A.type == "string")) throw new Error("The document needs a type.");
        U = JSON.stringify(A, null, 2), v.value = "", l("validity", !0), z(A);
      } catch (A) {
        v.value = A instanceof Error ? A.message : "Invalid JSON.", l("validity", !1);
      }
    }
    function P(h) {
      if (!h) {
        l("validity", !0), z(void 0);
        return;
      }
      const A = Number.isFinite(Number(h)) && (t.field.form !== "int" || Number.isSafeInteger(Number(h)));
      l("validity", A), A && z(t.field.form === "int" ? Number(h) : h);
    }
    const me = W(() => t.field.config?.format === "date");
    function O(h) {
      z(h ? me.value ? h : new Date(h).toISOString() : void 0);
    }
    const Q = W(() => {
      if (typeof t.modelValue != "string") return "";
      if (me.value) return t.modelValue.slice(0, 10);
      const h = new Date(t.modelValue);
      return Number.isNaN(h.getTime()) ? "" : new Date(h.getTime() - h.getTimezoneOffset() * 6e4).toISOString().slice(0, 16);
    });
    function x(h) {
      z(h.detail?.ref);
    }
    function M(h) {
      z(h.detail?.value);
    }
    let E;
    Ie(g, () => {
      const h = T();
      if (clearTimeout(E), !g.value.trim()) {
        k.value = [];
        return;
      }
      E = setTimeout(async () => {
        try {
          const A = g.value.trim(), se = /^[A-Z][A-Z0-9]{1,9}-[0-9]+$/.test(A) ? [(await It.item(t.boardId, { key: A })).item] : (await It.query(t.boardId, { where: { field: "title", op: "contains", value: A }, limit: 8 })).items;
          h() && (k.value = se, v.value = "");
        } catch (A) {
          h() && (v.value = nt(A, "Could not search items."));
        }
      }, 200);
    });
    function X(h) {
      z({ board: t.boardId, item: h.id }), g.value = "", k.value = [];
    }
    Sa(async () => {
      t.field.type === "principal" ? c.value = await Ut("wc-principal-picker") : t.field.config?.target === "component" && (c.value = await Ut("wc-component-picker"));
    });
    for (const [h, A] of [[() => t.editorTag, w], [() => t.linkTag, p]])
      Ie(h, async (se, re, $e) => {
        let H = !0;
        if ($e(() => {
          H = !1;
        }), A.value = !1, se) {
          const L = await Ut(se);
          H && (A.value = L);
        }
      }, { immediate: !0 });
    return Rl(() => {
      clearTimeout(E), T();
    }), (h, A) => {
      const se = xo("FieldControl", !0);
      return n(), b("div", $n, [
        s(to)(e.field) ? (n(), b("output", {
          key: 0,
          id: o.value,
          class: "work-read-value"
        }, I(s(Yt)(e.modelValue, e.field)), 9, xn)) : u.value ? (n(), b("div", Cn, [
          r("div", Sn, [
            (n(!0), b(ee, null, ue(f.value, (re, $e) => (n(), K(s(tt), {
              key: $.value[$e],
              class: "kx-tag-sm",
              severity: "secondary"
            }, {
              default: q(() => [
                j(I(s(Yt)(re, e.field)) + " ", 1),
                y(s(_), {
                  type: "button",
                  class: "work-icon-button",
                  disabled: i.value,
                  "aria-label": "Remove value " + ($e + 1),
                  onClick: (H) => de($e),
                  severity: "secondary",
                  text: "",
                  size: "small"
                }, {
                  default: q(() => [
                    y(s(pe), {
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
          (n(!0), b(ee, null, ue(f.value, (re, $e) => (n(), b("div", {
            key: $.value[$e],
            class: "work-stack work-tight"
          }, [
            y(se, {
              "board-id": e.boardId,
              field: { ...e.field, cardinality: "one" },
              "model-value": re,
              "input-id": o.value + "-" + $.value[$e],
              disabled: i.value,
              "editor-tag": e.editorTag,
              "link-tag": e.linkTag,
              "onUpdate:modelValue": (H) => ie($e, H),
              onValidity: (H) => le($.value[$e], H)
            }, null, 8, ["board-id", "field", "model-value", "input-id", "disabled", "editor-tag", "link-tag", "onUpdate:modelValue", "onValidity"])
          ]))), 128)),
          y(s(_), {
            label: "Add value",
            severity: "secondary",
            size: "small",
            disabled: i.value,
            onClick: Z,
            outlined: ""
          }, {
            icon: q(() => [
              y(s(pe), {
                icon: "tabler:plus",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled"])
        ])) : e.editorTag && w.value ? (n(), K(oa(e.editorTag), {
          key: 2,
          "board-id": e.boardId,
          value: JSON.stringify(e.modelValue ?? null),
          config: JSON.stringify(e.field.config ?? {}),
          readonly: i.value || void 0,
          onChange: M
        }, null, 40, ["board-id", "value", "config", "readonly"])) : e.linkTag && p.value ? (n(), K(oa(e.linkTag), {
          key: 3,
          "board-id": e.boardId,
          kind: e.field.config?.target ?? e.field.type,
          value: JSON.stringify(e.modelValue ?? null),
          readonly: i.value || void 0,
          onChange: x
        }, null, 40, ["board-id", "kind", "value", "readonly"])) : e.field.type === "option" ? (n(), K(s(fe), {
          key: 4,
          placeholder: "Not set",
          inputId: o.value,
          "model-value": e.modelValue ?? "",
          disabled: i.value,
          "onUpdate:modelValue": A[0] || (A[0] = (re) => z(re || void 0)),
          appendTo: "self",
          optionLabel: "label",
          optionValue: "value",
          optionDisabled: "disabled",
          options: [{ label: "Not set", value: "", disabled: !1 }, ...(e.field.options ?? []).map((re) => ({ label: re.label ?? re.id, value: re.id, disabled: !1 }))]
        }, null, 8, ["inputId", "model-value", "disabled", "options"])) : e.field.form === "bool" ? (n(), b("label", Tn, [
          y(s(Bt), {
            inputId: o.value,
            "model-value": e.modelValue === !0,
            disabled: i.value,
            "onUpdate:modelValue": A[1] || (A[1] = (re) => z(re)),
            binary: ""
          }, null, 8, ["inputId", "model-value", "disabled"]),
          j(I(e.modelValue === !0 ? "Yes" : e.modelValue === !1 ? "No" : "Not set"), 1)
        ])) : e.field.form === "int" ? (n(), K(s(yt), {
          key: 6,
          inputId: o.value,
          "model-value": m.value === "" ? null : Number(m.value),
          disabled: i.value,
          "onUpdate:modelValue": A[2] || (A[2] = (re) => P(re == null ? "" : String(re))),
          useGrouping: !1
        }, null, 8, ["inputId", "model-value", "disabled"])) : e.field.form === "dec" ? (n(), K(s(Se), {
          key: 7,
          id: o.value,
          inputmode: "decimal",
          "model-value": m.value,
          disabled: i.value,
          "onUpdate:modelValue": A[3] || (A[3] = (re) => P(re ?? ""))
        }, null, 8, ["id", "model-value", "disabled"])) : e.field.form === "time" ? (n(), K(s(Se), {
          key: 8,
          id: o.value,
          type: me.value ? "date" : "datetime-local",
          value: Q.value,
          disabled: i.value,
          onInput: A[4] || (A[4] = (re) => O(re.target.value))
        }, null, 8, ["id", "type", "value", "disabled"])) : e.field.type === "principal" ? (n(), b("div", {
          key: 9,
          inert: i.value || void 0,
          class: "work-stack work-tight"
        }, [
          c.value ? (n(), b("wc-principal-picker", {
            key: 0,
            value: JSON.stringify(e.modelValue ?? {}),
            kinds: "user,group",
            onConfigChanged: ve
          }, null, 40, Dn)) : (n(), b("span", Un, I(s(Yt)(e.modelValue, e.field)) + " · Person picker is unavailable.", 1))
        ], 8, In)) : e.field.config?.target === "component" ? (n(), b("div", {
          key: 10,
          inert: i.value || void 0
        }, [
          c.value ? (n(), b("wc-component-picker", {
            key: 0,
            value: JSON.stringify({ thread_id: d.value }),
            onChange: be
          }, null, 40, An)) : (n(), b("span", On, "Component picker is unavailable."))
        ], 8, En)) : e.field.type === "item" ? (n(), b("div", Pn, [
          y(s(tt), {
            class: "kx-tag-sm",
            severity: "secondary"
          }, {
            default: q(() => [
              j(I(s(Yt)(e.modelValue, e.field)), 1)
            ]),
            _: 1
          }),
          y(s(Se), {
            id: o.value,
            modelValue: g.value,
            "onUpdate:modelValue": A[5] || (A[5] = (re) => g.value = re),
            disabled: i.value,
            placeholder: "Search a title or enter an item key",
            "aria-label": "Search items"
          }, null, 8, ["id", "modelValue", "disabled"]),
          r("div", Rn, [
            (n(!0), b(ee, null, ue(k.value, (re) => (n(), K(Ml, {
              key: re.id,
              class: "work-match-item",
              disabled: i.value,
              onActivate: ($e) => X(re)
            }, {
              default: q(() => [
                r("code", Nn, I(re.key), 1),
                r("span", null, I(s(Yt)(re.values.title)), 1)
              ]),
              _: 2
            }, 1032, ["disabled", "onActivate"]))), 128))
          ]),
          e.modelValue ? (n(), K(s(_), {
            key: 0,
            label: "Clear reference",
            severity: "secondary",
            size: "small",
            disabled: i.value,
            onClick: A[6] || (A[6] = (re) => z(void 0)),
            outlined: ""
          }, {
            icon: q(() => [
              y(s(pe), {
                icon: "tabler:list-check",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled"])) : S("", !0)
        ])) : e.field.form === "record" || e.field.type === "rich_text" || e.field.form === "quantity" || e.field.form === "ref" ? (n(), K(s(Ca), {
          key: 12,
          id: o.value,
          "model-value": te.value,
          rows: "3",
          disabled: i.value,
          "aria-invalid": !!v.value,
          "onUpdate:modelValue": A[7] || (A[7] = (re) => Y(re ?? ""))
        }, null, 8, ["id", "model-value", "disabled", "aria-invalid"])) : e.field.code === "description" ? (n(), K(s(Ca), {
          key: 13,
          id: o.value,
          "model-value": m.value,
          rows: "4",
          disabled: i.value,
          "onUpdate:modelValue": A[8] || (A[8] = (re) => z(re))
        }, null, 8, ["id", "model-value", "disabled"])) : (n(), K(s(Se), {
          key: 14,
          id: o.value,
          "model-value": m.value,
          disabled: i.value,
          "onUpdate:modelValue": A[9] || (A[9] = (re) => z(re))
        }, null, 8, ["id", "model-value", "disabled"])),
        v.value ? (n(), b("span", Mn, I(v.value), 1)) : S("", !0)
      ]);
    };
  }
}), Fn = { class: "work-stack work-tight work-operand-control" }, Ln = { class: "work-row work-small" }, Bn = {
  key: 1,
  class: "work-muted work-small"
}, zn = {
  key: 2,
  class: "work-stack work-tight"
}, jn = { class: "work-small" }, Wn = {
  key: 0,
  class: "work-error work-small",
  role: "alert"
}, va = /* @__PURE__ */ Ve({
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
    const t = e, l = a, o = W(() => "$actor" in Lt(t.modelValue) ? "actor" : "$now" in Lt(t.modelValue) ? "now" : "literal"), u = B(""), f = B("");
    Ie(() => t.modelValue, (i) => {
      u.value = JSON.stringify(i ?? []), f.value = "";
    }, { immediate: !0 });
    function m(i) {
      l("update:modelValue", i === "actor" ? { $actor: "id" } : i === "now" ? { $now: "P0D" } : void 0), l("validity", !0);
    }
    function d(i) {
      u.value = i;
      try {
        const c = JSON.parse(i);
        if (!Array.isArray(c)) throw new Error("Enter a JSON list.");
        f.value = "", l("validity", !0), l("update:modelValue", c);
      } catch (c) {
        f.value = c instanceof Error ? c.message : "Invalid values.", l("validity", !1);
      }
    }
    return (i, c) => (n(), b("div", Fn, [
      r("label", Ln, [
        j(I(e.label), 1),
        y(s(fe), {
          "aria-label": e.label + " operand",
          "model-value": o.value,
          disabled: e.disabled,
          "onUpdate:modelValue": c[0] || (c[0] = (p) => m(p)),
          appendTo: "self",
          optionLabel: "label",
          optionValue: "value",
          optionDisabled: "disabled",
          options: [{ label: "Value", value: "literal", disabled: !1 }, { label: "Current actor ($actor)", value: "actor", disabled: !1 }, { label: "Current time ($now)", value: "now", disabled: !1 }]
        }, null, 8, ["aria-label", "model-value", "disabled"])
      ]),
      o.value === "now" ? (n(), K(s(Se), {
        key: 0,
        "aria-label": e.label + " time offset",
        value: s(Lt)(e.modelValue).$now,
        disabled: e.disabled,
        placeholder: "-P7D",
        onInput: c[1] || (c[1] = (p) => l("update:modelValue", { $now: p.target.value }))
      }, null, 8, ["aria-label", "value", "disabled"])) : o.value === "actor" ? (n(), b("span", Bn, "The signed-in actor’s id")) : e.multiple ? (n(), b("div", zn, [
        r("label", jn, [
          c[5] || (c[5] = j("Values as JSON (operands may appear in the list)", -1)),
          y(s(Ca), {
            class: "work-mono",
            "aria-label": e.label + " values",
            value: u.value,
            disabled: e.disabled,
            rows: "2",
            onInput: c[2] || (c[2] = (p) => d(p.target.value))
          }, null, 8, ["aria-label", "value", "disabled"])
        ]),
        f.value ? (n(), b("p", Wn, I(f.value), 1)) : S("", !0)
      ])) : (n(), K(Ro, {
        key: 3,
        "board-id": e.boardId,
        field: { ...e.field, cardinality: "one" },
        "model-value": e.modelValue,
        disabled: e.disabled,
        "input-id": e.label.replace(/[^a-z0-9]/gi, "-"),
        "onUpdate:modelValue": c[3] || (c[3] = (p) => l("update:modelValue", p)),
        onValidity: c[4] || (c[4] = (p) => l("validity", p))
      }, null, 8, ["board-id", "field", "model-value", "disabled", "input-id"]))
    ]));
  }
}), qn = ["disabled"], Gn = { class: "work-small work-mono" }, Kn = { class: "work-row work-small" }, Hn = { class: "work-row work-wrap" }, Yn = { key: 3 }, Xn = { class: "work-row work-wrap" }, Jn = { class: "work-row" }, Zn = { class: "work-row" }, Qn = { class: "work-row" }, _n = {
  key: 3,
  class: "work-row work-wrap"
}, es = { class: "work-row work-wrap" }, ts = /* @__PURE__ */ Ve({
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
    const t = e, l = a, o = W(() => t.path ?? "where"), u = W(() => t.depth ?? 1), f = W(() => ["and", "or", "not", "history", "match", "rel", "children"].find((te) => te in t.modelValue) ?? "field"), m = W(() => wn(t.schema)), d = W(() => m.value.find((te) => te.code === t.modelValue.field) ?? { code: "value", form: "text" }), i = W(() => Lt(t.modelValue.history)), c = W(() => m.value.find((te) => te.code === i.value.field) ?? { code: "history", form: "text" }), p = W(() => Array.isArray(t.modelValue[f.value]) ? t.modelValue[f.value] : []), w = {
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
    }, g = () => ({ field: "category", op: "eq", value: "unstarted" }), k = B(/* @__PURE__ */ new Set());
    function T(te, U) {
      U ? k.value.delete(te) : k.value.add(te), l("validity", k.value.size === 0);
    }
    Ie(f, () => {
      k.value.clear(), l("validity", !0);
    });
    function $(te) {
      const U = /* @__PURE__ */ new Set();
      for (const Y of k.value) {
        const P = Number(Y);
        !Number.isNaN(P) && P !== te && U.add(String(P > te ? P - 1 : P));
      }
      k.value = U, l("validity", U.size === 0), N({ [f.value]: p.value.filter((Y, P) => P !== te) });
    }
    function C(te) {
      l("update:modelValue", te);
    }
    function N(te) {
      C({ ...t.modelValue, ...te });
    }
    function F(te) {
      C(te === "field" ? g() : te === "and" || te === "or" ? { [te]: [g()] } : te === "not" ? { not: g() } : te === "history" ? { history: { field: "state", changed: !0 } } : te === "match" ? { match: "" } : te === "children" ? { children: !0, q: "some", where: g() } : { rel: t.schema.compiled.relation_types?.[0]?.id ?? "", dir: "outward", q: "some", where: g() });
    }
    function z(te, U) {
      N({ [f.value]: p.value.map((Y, P) => P === te ? U : Y) });
    }
    function ie(te, U) {
      const Y = { ...i.value };
      U === void 0 ? (delete Y[te], T(te, !0)) : Y[te] = U, N({ history: Y });
    }
    function le(te) {
      k.value.clear(), l("validity", !0);
      const U = { ...i.value };
      delete U.was, delete U.changed, delete U.from, delete U.to, U[te] = te === "changed" ? !0 : "", N({ history: U });
    }
    const de = { code: "actor", form: "text" }, Z = { code: "at", form: "time" }, ve = W(() => Array.isArray(i.value.during) ? i.value.during : []);
    function be(te, U) {
      const Y = [...ve.value];
      Y[te] = U, ie("during", Y);
    }
    return (te, U) => {
      const Y = xo("FilterNode", !0);
      return n(), b("fieldset", {
        class: "work-filter-node",
        disabled: e.disabled
      }, [
        r("legend", Gn, I(o.value), 1),
        r("label", Kn, [
          U[21] || (U[21] = j("Condition", -1)),
          y(s(fe), {
            "aria-label": o.value + " condition",
            "model-value": f.value,
            "onUpdate:modelValue": U[0] || (U[0] = (P) => F(P)),
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            optionDisabled: "disabled",
            options: Object.entries(v).map(([P, me]) => ({ label: me, value: P, disabled: u.value >= 6 && ["and", "or", "not", "rel", "children"].includes(P) }))
          }, null, 8, ["aria-label", "model-value", "options"])
        ]),
        f.value === "and" || f.value === "or" ? (n(), b(ee, { key: 0 }, [
          (n(!0), b(ee, null, ue(p.value, (P, me) => (n(), b("div", {
            key: me,
            class: "work-stack work-tight"
          }, [
            y(Y, {
              "board-id": e.boardId,
              schema: e.schema,
              "model-value": P,
              path: o.value + "." + f.value + "[" + me + "]",
              depth: u.value + 1,
              "onUpdate:modelValue": (O) => z(me, O),
              onValidity: (O) => T(String(me), O)
            }, null, 8, ["board-id", "schema", "model-value", "path", "depth", "onUpdate:modelValue", "onValidity"]),
            y(s(_), {
              label: "Remove condition",
              size: "small",
              severity: "secondary",
              onClick: (O) => $(me),
              outlined: ""
            }, {
              icon: q(() => [
                y(s(pe), {
                  icon: "tabler:trash",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["onClick"])
          ]))), 128)),
          y(s(_), {
            label: "Add condition",
            size: "small",
            severity: "secondary",
            disabled: u.value >= 6,
            onClick: U[1] || (U[1] = (P) => N({ [f.value]: [...p.value, g()] })),
            outlined: ""
          }, {
            icon: q(() => [
              y(s(pe), {
                icon: "tabler:plus",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled"])
        ], 64)) : f.value === "not" ? (n(), K(Y, {
          key: 1,
          "board-id": e.boardId,
          schema: e.schema,
          "model-value": s(Lt)(e.modelValue.not),
          path: o.value + ".not",
          depth: u.value + 1,
          "onUpdate:modelValue": U[2] || (U[2] = (P) => N({ not: P })),
          onValidity: U[3] || (U[3] = (P) => T("nested", P))
        }, null, 8, ["board-id", "schema", "model-value", "path", "depth"])) : f.value === "field" ? (n(), b(ee, { key: 2 }, [
          r("div", Hn, [
            r("label", null, [
              U[22] || (U[22] = j("Field", -1)),
              y(s(fe), {
                "aria-label": o.value + " field",
                "model-value": e.modelValue.field,
                "onUpdate:modelValue": U[4] || (U[4] = (P) => N({ field: P, op: "eq", value: void 0 })),
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                optionDisabled: "disabled",
                options: [...(m.value ?? []).map((P) => ({ label: s(He)(P), value: P.code, disabled: !1 }))]
              }, null, 8, ["aria-label", "model-value", "options"])
            ]),
            r("label", null, [
              U[23] || (U[23] = j("Comparison", -1)),
              y(s(fe), {
                "aria-label": o.value + " operator",
                "model-value": e.modelValue.op,
                "onUpdate:modelValue": U[5] || (U[5] = (P) => N({ op: P, value: P === "is_null" ? !0 : void 0 })),
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                options: s(Vn)(d.value).map((P) => ({ value: P, label: w[P] }))
              }, null, 8, ["aria-label", "model-value", "options"])
            ])
          ]),
          y(va, {
            "board-id": e.boardId,
            field: e.modelValue.op === "is_null" ? { code: "null", form: "bool" } : d.value,
            "model-value": e.modelValue.value,
            multiple: ["in", "nin", "between"].includes(String(e.modelValue.op)),
            label: o.value + " value",
            "onUpdate:modelValue": U[6] || (U[6] = (P) => N({ value: P })),
            onValidity: U[7] || (U[7] = (P) => T("value", P))
          }, null, 8, ["board-id", "field", "model-value", "multiple", "label"])
        ], 64)) : f.value === "match" ? (n(), b("label", Yn, [
          U[24] || (U[24] = j("Search", -1)),
          y(s(Se), {
            "aria-label": o.value + " search",
            value: e.modelValue.match,
            onInput: U[8] || (U[8] = (P) => N({ match: P.target.value }))
          }, null, 8, ["aria-label", "value"])
        ])) : f.value === "history" ? (n(), b(ee, { key: 4 }, [
          r("div", Xn, [
            r("label", null, [
              U[25] || (U[25] = j("Field", -1)),
              y(s(fe), {
                "aria-label": o.value + " history field",
                "model-value": i.value.field,
                "onUpdate:modelValue": U[9] || (U[9] = (P) => ie("field", P)),
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                optionDisabled: "disabled",
                options: [...(m.value ?? []).map((P) => ({ label: s(He)(P), value: P.code, disabled: !1 }))]
              }, null, 8, ["aria-label", "model-value", "options"])
            ]),
            r("label", null, [
              U[26] || (U[26] = j("History", -1)),
              y(s(fe), {
                "aria-label": o.value + " history mode",
                "model-value": i.value.changed ? "changed" : "was",
                "onUpdate:modelValue": U[10] || (U[10] = (P) => le(P)),
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                optionDisabled: "disabled",
                options: [{ label: "Changed", value: "changed", disabled: !1 }, { label: "Was", value: "was", disabled: !1 }]
              }, null, 8, ["aria-label", "model-value"])
            ])
          ]),
          i.value.changed ? (n(), b(ee, { key: 0 }, ue(["from", "to"], (P) => r("div", { key: P }, [
            r("label", Jn, [
              y(s(Bt), {
                "model-value": P in i.value,
                "aria-label": "Constrain " + P,
                "onUpdate:modelValue": (me) => ie(P, me ? "" : void 0),
                binary: ""
              }, null, 8, ["model-value", "aria-label", "onUpdate:modelValue"]),
              j(I(P), 1)
            ]),
            P in i.value ? (n(), K(va, {
              key: 0,
              "board-id": e.boardId,
              field: c.value,
              "model-value": i.value[P],
              label: o.value + " history " + P,
              "onUpdate:modelValue": (me) => ie(P, me),
              onValidity: (me) => T(P, me)
            }, null, 8, ["board-id", "field", "model-value", "label", "onUpdate:modelValue", "onValidity"])) : S("", !0)
          ])), 64)) : (n(), K(va, {
            key: 1,
            "board-id": e.boardId,
            field: c.value,
            "model-value": i.value.was,
            label: o.value + " history was",
            "onUpdate:modelValue": U[11] || (U[11] = (P) => ie("was", P)),
            onValidity: U[12] || (U[12] = (P) => T("was", P))
          }, null, 8, ["board-id", "field", "model-value", "label"])),
          r("label", Zn, [
            y(s(Bt), {
              "model-value": "by" in i.value,
              "aria-label": "Constrain actor",
              "onUpdate:modelValue": U[13] || (U[13] = (P) => ie("by", P ? { $actor: "id" } : void 0)),
              binary: ""
            }, null, 8, ["model-value"]),
            U[27] || (U[27] = j("By actor", -1))
          ]),
          "by" in i.value ? (n(), K(va, {
            key: 2,
            "board-id": e.boardId,
            field: de,
            "model-value": i.value.by,
            label: o.value + " history by",
            "onUpdate:modelValue": U[14] || (U[14] = (P) => ie("by", P))
          }, null, 8, ["board-id", "model-value", "label"])) : S("", !0),
          r("label", Qn, [
            y(s(Bt), {
              "model-value": "during" in i.value,
              "aria-label": "Constrain time window",
              "onUpdate:modelValue": U[15] || (U[15] = (P) => ie("during", P ? [{ $now: "-P30D" }, { $now: "P0D" }] : void 0)),
              binary: ""
            }, null, 8, ["model-value"]),
            U[28] || (U[28] = j("During", -1))
          ]),
          "during" in i.value ? (n(), b("div", _n, [
            (n(), b(ee, null, ue(["start", "end"], (P, me) => y(va, {
              key: P,
              "board-id": e.boardId,
              field: Z,
              "model-value": ve.value[me],
              label: o.value + " during " + P,
              "onUpdate:modelValue": (O) => be(me, O)
            }, null, 8, ["board-id", "model-value", "label", "onUpdate:modelValue"])), 64))
          ])) : S("", !0)
        ], 64)) : (n(), b(ee, { key: 5 }, [
          r("div", es, [
            f.value === "rel" ? (n(), b(ee, { key: 0 }, [
              r("label", null, [
                U[29] || (U[29] = j("Relation", -1)),
                y(s(fe), {
                  "model-value": e.modelValue.rel,
                  "onUpdate:modelValue": U[16] || (U[16] = (P) => N({ rel: P })),
                  appendTo: "self",
                  optionLabel: "label",
                  optionValue: "value",
                  optionDisabled: "disabled",
                  options: [...(e.schema.compiled.relation_types ?? []).map((P) => ({ label: P.outward ?? P.id, value: P.id, disabled: !1 }))]
                }, null, 8, ["model-value", "options"])
              ]),
              r("label", null, [
                U[30] || (U[30] = j("Direction", -1)),
                y(s(fe), {
                  "model-value": e.modelValue.dir,
                  "onUpdate:modelValue": U[17] || (U[17] = (P) => N({ dir: P })),
                  appendTo: "self",
                  optionLabel: "label",
                  optionValue: "value",
                  optionDisabled: "disabled",
                  options: [{ label: "Outward", value: "outward", disabled: !1 }, { label: "Inward", value: "inward", disabled: !1 }]
                }, null, 8, ["model-value"])
              ])
            ], 64)) : S("", !0),
            r("label", null, [
              U[31] || (U[31] = j("Quantifier", -1)),
              y(s(fe), {
                "model-value": e.modelValue.q,
                "onUpdate:modelValue": U[18] || (U[18] = (P) => N({ q: P })),
                appendTo: "self",
                options: ["some", "every", "none"]
              }, null, 8, ["model-value"])
            ])
          ]),
          y(Y, {
            "board-id": e.boardId,
            schema: e.schema,
            "model-value": s(Lt)(e.modelValue.where),
            path: o.value + ".where",
            depth: u.value + 1,
            "onUpdate:modelValue": U[19] || (U[19] = (P) => N({ where: P })),
            onValidity: U[20] || (U[20] = (P) => T("nested", P))
          }, null, 8, ["board-id", "schema", "model-value", "path", "depth"])
        ], 64))
      ], 8, qn);
    };
  }
}), as = { class: "work-stack work-tight" }, ls = { class: "work-row work-small" }, Fl = /* @__PURE__ */ Ve({
  __name: "ConditionEditor",
  props: {
    modelValue: {},
    draft: {},
    boardId: {},
    label: {}
  },
  emits: ["update:modelValue", "validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = W(() => ({ declaration: t.draft, compiled: t.draft, generation: 0, as_of: 0, key_prefix: "" })), u = /* @__PURE__ */ new Set();
    function f(d, i) {
      i ? u.delete(d) : u.add(d), l("validity", !u.size);
    }
    function m(d) {
      l("update:modelValue", d ? { field: t.draft.fields?.[0]?.code ?? "state", op: "eq" } : void 0), d || (u.clear(), l("validity", !0));
    }
    return Vt(() => l("validity", !0)), (d, i) => (n(), b("section", as, [
      r("label", ls, [
        y(s(et), {
          "model-value": e.modelValue != null,
          "aria-label": e.label,
          "onUpdate:modelValue": m
        }, null, 8, ["model-value", "aria-label"]),
        j(I(e.label), 1)
      ]),
      e.modelValue != null ? (n(), K(ts, {
        key: 0,
        schema: o.value,
        "board-id": e.boardId ?? "",
        "model-value": s(Lt)(e.modelValue),
        path: e.label,
        "onUpdate:modelValue": i[0] || (i[0] = (c) => l("update:modelValue", c)),
        onValidity: i[1] || (i[1] = (c) => f("structured", c))
      }, null, 8, ["schema", "board-id", "model-value", "path"])) : S("", !0),
      e.modelValue != null ? (n(), K(Et, {
        key: 1,
        label: e.label + " predicate",
        "model-value": e.modelValue,
        hint: "Use any predicate accepted by Work, including installed or deeply nested forms.",
        "onUpdate:modelValue": i[2] || (i[2] = (c) => l("update:modelValue", c)),
        onValidity: i[3] || (i[3] = (c) => f("raw", c))
      }, null, 8, ["label", "model-value"])) : S("", !0)
    ]));
  }
}), os = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, is = ["aria-label"], ns = { class: "work-field-label" }, ss = {
  key: 0,
  class: "work-chips"
}, rs = ["kinds"], ds = {
  key: 2,
  class: "work-muted work-small"
}, Ll = /* @__PURE__ */ Ve({
  __name: "PrincipalsPicker",
  props: {
    modelValue: {},
    label: {},
    kinds: {},
    boardId: {}
  },
  emits: ["update:modelValue"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = B(!1), u = B(0), f = W(() => t.modelValue ?? []), { principalLabel: m, rememberPrincipal: d, nameError: i } = So(() => t.boardId ?? "", () => f.value);
    Sa(async () => {
      o.value = await Ut("wc-principal-picker");
    });
    function c(p) {
      const w = p.detail, v = w?.principal_id ?? w?.id;
      if (!v) return;
      const g = { kind: w.type ?? "user", id: v };
      w.label && d(g, w.label), f.value.some((k) => k.id === v && k.kind === g.kind) || l("update:modelValue", [...f.value, g]), u.value++;
    }
    return (p, w) => (n(), b(ee, null, [
      s(i) ? (n(), b("p", os, I(s(i)), 1)) : S("", !0),
      r("section", {
        class: "work-stack work-tight work-principals-picker",
        "aria-label": e.label
      }, [
        r("h4", ns, I(e.label), 1),
        f.value.length ? (n(), b("div", ss, [
          (n(!0), b(ee, null, ue(f.value, (v, g) => (n(), K(s(tt), {
            key: v.kind + v.id,
            severity: "secondary",
            class: "kx-tag-sm"
          }, {
            default: q(() => [
              j(I(s(m)(v)), 1),
              y(s(_), {
                text: "",
                severity: "secondary",
                size: "small",
                "aria-label": "Remove " + s(m)(v),
                onClick: (k) => l("update:modelValue", f.value.filter((T, $) => $ !== g))
              }, {
                default: q(() => [
                  y(s(pe), { icon: "tabler:x" })
                ]),
                _: 1
              }, 8, ["aria-label", "onClick"])
            ]),
            _: 2
          }, 1024))), 128))
        ])) : S("", !0),
        o.value ? (n(), b("wc-principal-picker", {
          key: u.value,
          kinds: e.kinds ?? "user,group",
          onConfigChanged: c
        }, null, 40, rs)) : (n(), b("p", ds, "People and group picker is unavailable."))
      ], 8, is)
    ], 64));
  }
}), us = { class: "work-stack work-tight" }, No = /* @__PURE__ */ Ve({
  __name: "HoldersPicker",
  props: {
    modelValue: {},
    label: {},
    boardId: {}
  },
  emits: ["update:modelValue", "validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = W(() => (t.modelValue ?? []).flatMap((f) => "user" in f ? [{ kind: "user", id: f.user }] : "group" in f ? [{ kind: "group", id: f.group }] : []));
    function u(f) {
      const m = [...(t.modelValue ?? []).filter((d) => "field" in d || "service" in d), ...f.map((d) => d.kind === "group" ? { group: d.id } : { user: d.id })];
      l("update:modelValue", m.length ? m : void 0);
    }
    return (f, m) => (n(), b("div", us, [
      y(Ll, {
        "board-id": e.boardId,
        label: e.label,
        "model-value": o.value,
        "onUpdate:modelValue": u
      }, null, 8, ["board-id", "label", "model-value"]),
      y(Et, {
        label: e.label + " rules",
        "model-value": e.modelValue,
        shape: "array",
        example: [{ group: "selected-group" }],
        "onUpdate:modelValue": m[0] || (m[0] = (d) => l("update:modelValue", d)),
        onValidity: m[1] || (m[1] = (d) => l("validity", d))
      }, null, 8, ["label", "model-value"])
    ]));
  }
}), cs = ["disabled"], vs = { class: "work-chips" }, ms = {
  key: 1,
  class: "work-muted work-small"
}, vt = /* @__PURE__ */ Ve({
  __name: "ChipPicker",
  props: {
    label: {},
    options: {},
    modelValue: {},
    disabled: { type: Boolean }
  },
  emits: ["update:modelValue"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = B(""), u = W(() => t.options.map((d) => typeof d == "string" ? { value: d } : d)), f = W(() => u.value.filter((d) => (d.label ?? Oe(d.value)).toLocaleLowerCase().includes(o.value.toLocaleLowerCase())));
    function m(d) {
      if (t.disabled) return;
      const i = t.modelValue ?? [];
      l("update:modelValue", i.includes(d) ? i.filter((c) => c !== d) : [...i, d]);
    }
    return (d, i) => (n(), b("fieldset", {
      class: "work-chip-picker",
      disabled: e.disabled
    }, [
      r("legend", null, I(e.label), 1),
      e.options.length > 10 ? (n(), K(s(Se), {
        key: 0,
        modelValue: o.value,
        "onUpdate:modelValue": i[0] || (i[0] = (c) => o.value = c),
        type: "search",
        "aria-label": "Find " + e.label.toLowerCase(),
        placeholder: "Find a choice…"
      }, null, 8, ["modelValue", "aria-label"])) : S("", !0),
      r("div", vs, [
        y(s(Nl), {
          "model-value": e.modelValue ?? [],
          options: f.value.map((c) => ({ value: c.value, label: c.label ?? s(Oe)(c.value) })),
          optionLabel: "label",
          optionValue: "value",
          multiple: "",
          disabled: e.disabled,
          "aria-label": e.label,
          "onUpdate:modelValue": i[1] || (i[1] = (c) => l("update:modelValue", c ?? []))
        }, null, 8, ["model-value", "options", "disabled", "aria-label"]),
        (n(!0), b(ee, null, ue(e.modelValue?.filter((c) => !u.value.some((p) => p.value === c)) ?? [], (c) => (n(), K(s(_), {
          severity: "secondary",
          text: "",
          size: "small",
          key: c,
          type: "button",
          class: "work-choice work-unavailable",
          "aria-label": "Remove unavailable " + c,
          onClick: (p) => m(c)
        }, {
          default: q(() => [
            j(I(s(Oe)(c)) + " · unavailable ×", 1)
          ]),
          _: 2
        }, 1032, ["aria-label", "onClick"]))), 128))
      ]),
      e.options.length ? S("", !0) : (n(), b("span", ms, "No choices declared."))
    ], 8, cs));
  }
});
/**!
 * Sortable 1.15.7
 * @author	RubaXa   <trash@rubaxa.org>
 * @author	owenm    <owen23355@gmail.com>
 * @license MIT
 */
function fs(e, a, t) {
  return (a = gs(a)) in e ? Object.defineProperty(e, a, {
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
function io(e, a) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(e);
    a && (l = l.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), t.push.apply(t, l);
  }
  return t;
}
function pt(e) {
  for (var a = 1; a < arguments.length; a++) {
    var t = arguments[a] != null ? arguments[a] : {};
    a % 2 ? io(Object(t), !0).forEach(function(l) {
      fs(e, l, t[l]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : io(Object(t)).forEach(function(l) {
      Object.defineProperty(e, l, Object.getOwnPropertyDescriptor(t, l));
    });
  }
  return e;
}
function ps(e, a) {
  if (e == null) return {};
  var t, l, o = bs(e, a);
  if (Object.getOwnPropertySymbols) {
    var u = Object.getOwnPropertySymbols(e);
    for (l = 0; l < u.length; l++) t = u[l], a.indexOf(t) === -1 && {}.propertyIsEnumerable.call(e, t) && (o[t] = e[t]);
  }
  return o;
}
function bs(e, a) {
  if (e == null) return {};
  var t = {};
  for (var l in e) if ({}.hasOwnProperty.call(e, l)) {
    if (a.indexOf(l) !== -1) continue;
    t[l] = e[l];
  }
  return t;
}
function hs(e, a) {
  if (typeof e != "object" || !e) return e;
  var t = e[Symbol.toPrimitive];
  if (t !== void 0) {
    var l = t.call(e, a);
    if (typeof l != "object") return l;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (a === "string" ? String : Number)(e);
}
function gs(e) {
  var a = hs(e, "string");
  return typeof a == "symbol" ? a : a + "";
}
function Tl(e) {
  "@babel/helpers - typeof";
  return Tl = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(a) {
    return typeof a;
  } : function(a) {
    return a && typeof Symbol == "function" && a.constructor === Symbol && a !== Symbol.prototype ? "symbol" : typeof a;
  }, Tl(e);
}
var ys = "1.15.7";
function kt(e) {
  if (typeof window < "u" && window.navigator)
    return !!/* @__PURE__ */ navigator.userAgent.match(e);
}
var $t = kt(/(?:Trident.*rv[ :]?11\.|msie|iemobile|Windows Phone)/i), Ia = kt(/Edge/i), no = kt(/firefox/i), ya = kt(/safari/i) && !kt(/chrome/i) && !kt(/android/i), Bl = kt(/iP(ad|od|hone)/i), Mo = kt(/chrome/i) && kt(/android/i), Fo = {
  capture: !1,
  passive: !1
};
function Ce(e, a, t) {
  e.addEventListener(a, t, !$t && Fo);
}
function xe(e, a, t) {
  e.removeEventListener(a, t, !$t && Fo);
}
function Ga(e, a) {
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
function Lo(e) {
  return e.host && e !== document && e.host.nodeType && e.host !== e ? e.host : e.parentNode;
}
function ut(e, a, t, l) {
  if (e) {
    t = t || document;
    do {
      if (a != null && (a[0] === ">" ? e.parentNode === t && Ga(e, a) : Ga(e, a)) || l && e === t)
        return e;
      if (e === t) break;
    } while (e = Lo(e));
  }
  return null;
}
var so = /\s+/g;
function at(e, a, t) {
  if (e && a)
    if (e.classList)
      e.classList[t ? "add" : "remove"](a);
    else {
      var l = (" " + e.className + " ").replace(so, " ").replace(" " + a + " ", " ");
      e.className = (l + (t ? " " + a : "")).replace(so, " ");
    }
}
function he(e, a, t) {
  var l = e && e.style;
  if (l) {
    if (t === void 0)
      return document.defaultView && document.defaultView.getComputedStyle ? t = document.defaultView.getComputedStyle(e, "") : e.currentStyle && (t = e.currentStyle), a === void 0 ? t : t[a];
    !(a in l) && a.indexOf("webkit") === -1 && (a = "-webkit-" + a), l[a] = t + (typeof t == "string" ? "" : "px");
  }
}
function la(e, a) {
  var t = "";
  if (typeof e == "string")
    t = e;
  else
    do {
      var l = he(e, "transform");
      l && l !== "none" && (t = l + " " + t);
    } while (!a && (e = e.parentNode));
  var o = window.DOMMatrix || window.WebKitCSSMatrix || window.CSSMatrix || window.MSCSSMatrix;
  return o && new o(t);
}
function Bo(e, a, t) {
  if (e) {
    var l = e.getElementsByTagName(a), o = 0, u = l.length;
    if (t)
      for (; o < u; o++)
        t(l[o], o);
    return l;
  }
  return [];
}
function ft() {
  var e = document.scrollingElement;
  return e || document.documentElement;
}
function Fe(e, a, t, l, o) {
  if (!(!e.getBoundingClientRect && e !== window)) {
    var u, f, m, d, i, c, p;
    if (e !== window && e.parentNode && e !== ft() ? (u = e.getBoundingClientRect(), f = u.top, m = u.left, d = u.bottom, i = u.right, c = u.height, p = u.width) : (f = 0, m = 0, d = window.innerHeight, i = window.innerWidth, c = window.innerHeight, p = window.innerWidth), (a || t) && e !== window && (o = o || e.parentNode, !$t))
      do
        if (o && o.getBoundingClientRect && (he(o, "transform") !== "none" || t && he(o, "position") !== "static")) {
          var w = o.getBoundingClientRect();
          f -= w.top + parseInt(he(o, "border-top-width")), m -= w.left + parseInt(he(o, "border-left-width")), d = f + u.height, i = m + u.width;
          break;
        }
      while (o = o.parentNode);
    if (l && e !== window) {
      var v = la(o || e), g = v && v.a, k = v && v.d;
      v && (f /= k, m /= g, p /= g, c /= k, d = f + c, i = m + p);
    }
    return {
      top: f,
      left: m,
      bottom: d,
      right: i,
      width: p,
      height: c
    };
  }
}
function ro(e, a, t) {
  for (var l = Dt(e, !0), o = Fe(e)[a]; l; ) {
    var u = Fe(l)[t], f = void 0;
    if (f = o >= u, !f) return l;
    if (l === ft()) break;
    l = Dt(l, !1);
  }
  return !1;
}
function ia(e, a, t, l) {
  for (var o = 0, u = 0, f = e.children; u < f.length; ) {
    if (f[u].style.display !== "none" && f[u] !== ge.ghost && (l || f[u] !== ge.dragged) && ut(f[u], t.draggable, e, !1)) {
      if (o === a)
        return f[u];
      o++;
    }
    u++;
  }
  return null;
}
function zl(e, a) {
  for (var t = e.lastElementChild; t && (t === ge.ghost || he(t, "display") === "none" || a && !Ga(t, a)); )
    t = t.previousElementSibling;
  return t || null;
}
function it(e, a) {
  var t = 0;
  if (!e || !e.parentNode)
    return -1;
  for (; e = e.previousElementSibling; )
    e.nodeName.toUpperCase() !== "TEMPLATE" && e !== ge.clone && (!a || Ga(e, a)) && t++;
  return t;
}
function uo(e) {
  var a = 0, t = 0, l = ft();
  if (e)
    do {
      var o = la(e), u = o.a, f = o.d;
      a += e.scrollLeft * u, t += e.scrollTop * f;
    } while (e !== l && (e = e.parentNode));
  return [a, t];
}
function ks(e, a) {
  for (var t in e)
    if (e.hasOwnProperty(t)) {
      for (var l in a)
        if (a.hasOwnProperty(l) && a[l] === e[t][l]) return Number(t);
    }
  return -1;
}
function Dt(e, a) {
  if (!e || !e.getBoundingClientRect) return ft();
  var t = e, l = !1;
  do
    if (t.clientWidth < t.scrollWidth || t.clientHeight < t.scrollHeight) {
      var o = he(t);
      if (t.clientWidth < t.scrollWidth && (o.overflowX == "auto" || o.overflowX == "scroll") || t.clientHeight < t.scrollHeight && (o.overflowY == "auto" || o.overflowY == "scroll")) {
        if (!t.getBoundingClientRect || t === document.body) return ft();
        if (l || a) return t;
        l = !0;
      }
    }
  while (t = t.parentNode);
  return ft();
}
function ws(e, a) {
  if (e && a)
    for (var t in a)
      a.hasOwnProperty(t) && (e[t] = a[t]);
  return e;
}
function fl(e, a) {
  return Math.round(e.top) === Math.round(a.top) && Math.round(e.left) === Math.round(a.left) && Math.round(e.height) === Math.round(a.height) && Math.round(e.width) === Math.round(a.width);
}
var ka;
function zo(e, a) {
  return function() {
    if (!ka) {
      var t = arguments, l = this;
      t.length === 1 ? e.call(l, t[0]) : e.apply(l, t), ka = setTimeout(function() {
        ka = void 0;
      }, a);
    }
  };
}
function Vs() {
  clearTimeout(ka), ka = void 0;
}
function jo(e, a, t) {
  e.scrollLeft += a, e.scrollTop += t;
}
function Wo(e) {
  var a = window.Polymer, t = window.jQuery || window.Zepto;
  return a && a.dom ? a.dom(e).cloneNode(!0) : t ? t(e).clone(!0)[0] : e.cloneNode(!0);
}
function qo(e, a, t) {
  var l = {};
  return Array.from(e.children).forEach(function(o) {
    var u, f, m, d;
    if (!(!ut(o, a.draggable, e, !1) || o.animated || o === t)) {
      var i = Fe(o);
      l.left = Math.min((u = l.left) !== null && u !== void 0 ? u : 1 / 0, i.left), l.top = Math.min((f = l.top) !== null && f !== void 0 ? f : 1 / 0, i.top), l.right = Math.max((m = l.right) !== null && m !== void 0 ? m : -1 / 0, i.right), l.bottom = Math.max((d = l.bottom) !== null && d !== void 0 ? d : -1 / 0, i.bottom);
    }
  }), l.width = l.right - l.left, l.height = l.bottom - l.top, l.x = l.left, l.y = l.top, l;
}
var _e = "Sortable" + (/* @__PURE__ */ new Date()).getTime();
function $s() {
  var e = [], a;
  return {
    captureAnimationState: function() {
      if (e = [], !!this.options.animation) {
        var l = [].slice.call(this.el.children);
        l.forEach(function(o) {
          if (!(he(o, "display") === "none" || o === ge.ghost)) {
            e.push({
              target: o,
              rect: Fe(o)
            });
            var u = pt({}, e[e.length - 1].rect);
            if (o.thisAnimationDuration) {
              var f = la(o, !0);
              f && (u.top -= f.f, u.left -= f.e);
            }
            o.fromRect = u;
          }
        });
      }
    },
    addAnimationState: function(l) {
      e.push(l);
    },
    removeAnimationState: function(l) {
      e.splice(ks(e, {
        target: l
      }), 1);
    },
    animateAll: function(l) {
      var o = this;
      if (!this.options.animation) {
        clearTimeout(a), typeof l == "function" && l();
        return;
      }
      var u = !1, f = 0;
      e.forEach(function(m) {
        var d = 0, i = m.target, c = i.fromRect, p = Fe(i), w = i.prevFromRect, v = i.prevToRect, g = m.rect, k = la(i, !0);
        k && (p.top -= k.f, p.left -= k.e), i.toRect = p, i.thisAnimationDuration && fl(w, p) && !fl(c, p) && // Make sure animatingRect is on line between toRect & fromRect
        (g.top - p.top) / (g.left - p.left) === (c.top - p.top) / (c.left - p.left) && (d = Cs(g, w, v, o.options)), fl(p, c) || (i.prevFromRect = c, i.prevToRect = p, d || (d = o.options.animation), o.animate(i, g, p, d)), d && (u = !0, f = Math.max(f, d), clearTimeout(i.animationResetTimer), i.animationResetTimer = setTimeout(function() {
          i.animationTime = 0, i.prevFromRect = null, i.fromRect = null, i.prevToRect = null, i.thisAnimationDuration = null;
        }, d), i.thisAnimationDuration = d);
      }), clearTimeout(a), u ? a = setTimeout(function() {
        typeof l == "function" && l();
      }, f) : typeof l == "function" && l(), e = [];
    },
    animate: function(l, o, u, f) {
      if (f) {
        he(l, "transition", ""), he(l, "transform", "");
        var m = la(this.el), d = m && m.a, i = m && m.d, c = (o.left - u.left) / (d || 1), p = (o.top - u.top) / (i || 1);
        l.animatingX = !!c, l.animatingY = !!p, he(l, "transform", "translate3d(" + c + "px," + p + "px,0)"), this.forRepaintDummy = xs(l), he(l, "transition", "transform " + f + "ms" + (this.options.easing ? " " + this.options.easing : "")), he(l, "transform", "translate3d(0,0,0)"), typeof l.animated == "number" && clearTimeout(l.animated), l.animated = setTimeout(function() {
          he(l, "transition", ""), he(l, "transform", ""), l.animated = !1, l.animatingX = !1, l.animatingY = !1;
        }, f);
      }
    }
  };
}
function xs(e) {
  return e.offsetWidth;
}
function Cs(e, a, t, l) {
  return Math.sqrt(Math.pow(a.top - e.top, 2) + Math.pow(a.left - e.left, 2)) / Math.sqrt(Math.pow(a.top - t.top, 2) + Math.pow(a.left - t.left, 2)) * l.animation;
}
var Zt = [], pl = {
  initializeByDefault: !0
}, Da = {
  mount: function(a) {
    for (var t in pl)
      pl.hasOwnProperty(t) && !(t in a) && (a[t] = pl[t]);
    Zt.forEach(function(l) {
      if (l.pluginName === a.pluginName)
        throw "Sortable: Cannot mount plugin ".concat(a.pluginName, " more than once");
    }), Zt.push(a);
  },
  pluginEvent: function(a, t, l) {
    var o = this;
    this.eventCanceled = !1, l.cancel = function() {
      o.eventCanceled = !0;
    };
    var u = a + "Global";
    Zt.forEach(function(f) {
      t[f.pluginName] && (t[f.pluginName][u] && t[f.pluginName][u](pt({
        sortable: t
      }, l)), t.options[f.pluginName] && t[f.pluginName][a] && t[f.pluginName][a](pt({
        sortable: t
      }, l)));
    });
  },
  initializePlugins: function(a, t, l, o) {
    Zt.forEach(function(m) {
      var d = m.pluginName;
      if (!(!a.options[d] && !m.initializeByDefault)) {
        var i = new m(a, t, a.options);
        i.sortable = a, i.options = a.options, a[d] = i, wt(l, i.defaults);
      }
    });
    for (var u in a.options)
      if (a.options.hasOwnProperty(u)) {
        var f = this.modifyOption(a, u, a.options[u]);
        typeof f < "u" && (a.options[u] = f);
      }
  },
  getEventProperties: function(a, t) {
    var l = {};
    return Zt.forEach(function(o) {
      typeof o.eventProperties == "function" && wt(l, o.eventProperties.call(t[o.pluginName], a));
    }), l;
  },
  modifyOption: function(a, t, l) {
    var o;
    return Zt.forEach(function(u) {
      a[u.pluginName] && u.optionListeners && typeof u.optionListeners[t] == "function" && (o = u.optionListeners[t].call(a[u.pluginName], l));
    }), o;
  }
};
function Ss(e) {
  var a = e.sortable, t = e.rootEl, l = e.name, o = e.targetEl, u = e.cloneEl, f = e.toEl, m = e.fromEl, d = e.oldIndex, i = e.newIndex, c = e.oldDraggableIndex, p = e.newDraggableIndex, w = e.originalEvent, v = e.putSortable, g = e.extraEventProperties;
  if (a = a || t && t[_e], !!a) {
    var k, T = a.options, $ = "on" + l.charAt(0).toUpperCase() + l.substr(1);
    window.CustomEvent && !$t && !Ia ? k = new CustomEvent(l, {
      bubbles: !0,
      cancelable: !0
    }) : (k = document.createEvent("Event"), k.initEvent(l, !0, !0)), k.to = f || t, k.from = m || t, k.item = o || t, k.clone = u, k.oldIndex = d, k.newIndex = i, k.oldDraggableIndex = c, k.newDraggableIndex = p, k.originalEvent = w, k.pullMode = v ? v.lastPutMode : void 0;
    var C = pt(pt({}, g), Da.getEventProperties(l, a));
    for (var N in C)
      k[N] = C[N];
    t && t.dispatchEvent(k), T[$] && T[$].call(a, k);
  }
}
var Ts = ["evt"], Qe = function(a, t) {
  var l = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, o = l.evt, u = ps(l, Ts);
  Da.pluginEvent.bind(ge)(a, t, pt({
    dragEl: ae,
    parentEl: Re,
    ghostEl: ye,
    rootEl: Ue,
    nextEl: Nt,
    lastDownEl: Ba,
    cloneEl: Ae,
    cloneHidden: Tt,
    dragStarted: ma,
    putSortable: Ge,
    activeSortable: ge.active,
    originalEvent: o,
    oldIndex: aa,
    oldDraggableIndex: wa,
    newIndex: lt,
    newDraggableIndex: St,
    hideGhostForTarget: Yo,
    unhideGhostForTarget: Xo,
    cloneNowHidden: function() {
      Tt = !0;
    },
    cloneNowShown: function() {
      Tt = !1;
    },
    dispatchSortableEvent: function(m) {
      Ye({
        sortable: t,
        name: m,
        originalEvent: o
      });
    }
  }, u));
};
function Ye(e) {
  Ss(pt({
    putSortable: Ge,
    cloneEl: Ae,
    targetEl: ae,
    rootEl: Ue,
    oldIndex: aa,
    oldDraggableIndex: wa,
    newIndex: lt,
    newDraggableIndex: St
  }, e));
}
var ae, Re, ye, Ue, Nt, Ba, Ae, Tt, aa, lt, wa, St, Ra, Ge, ea = !1, Ka = !1, Ha = [], Pt, dt, bl, hl, co, vo, ma, Qt, Va, $a = !1, Na = !1, za, Ke, gl = [], Il = !1, Ya = [], _a = typeof document < "u", Ma = Bl, mo = Ia || $t ? "cssFloat" : "float", Is = _a && !Mo && !Bl && "draggable" in document.createElement("div"), Go = (function() {
  if (_a) {
    if ($t)
      return !1;
    var e = document.createElement("x");
    return e.style.cssText = "pointer-events:auto", e.style.pointerEvents === "auto";
  }
})(), Ko = function(a, t) {
  var l = he(a), o = parseInt(l.width) - parseInt(l.paddingLeft) - parseInt(l.paddingRight) - parseInt(l.borderLeftWidth) - parseInt(l.borderRightWidth), u = ia(a, 0, t), f = ia(a, 1, t), m = u && he(u), d = f && he(f), i = m && parseInt(m.marginLeft) + parseInt(m.marginRight) + Fe(u).width, c = d && parseInt(d.marginLeft) + parseInt(d.marginRight) + Fe(f).width;
  if (l.display === "flex")
    return l.flexDirection === "column" || l.flexDirection === "column-reverse" ? "vertical" : "horizontal";
  if (l.display === "grid")
    return l.gridTemplateColumns.split(" ").length <= 1 ? "vertical" : "horizontal";
  if (u && m.float && m.float !== "none") {
    var p = m.float === "left" ? "left" : "right";
    return f && (d.clear === "both" || d.clear === p) ? "vertical" : "horizontal";
  }
  return u && (m.display === "block" || m.display === "flex" || m.display === "table" || m.display === "grid" || i >= o && l[mo] === "none" || f && l[mo] === "none" && i + c > o) ? "vertical" : "horizontal";
}, Ds = function(a, t, l) {
  var o = l ? a.left : a.top, u = l ? a.right : a.bottom, f = l ? a.width : a.height, m = l ? t.left : t.top, d = l ? t.right : t.bottom, i = l ? t.width : t.height;
  return o === m || u === d || o + f / 2 === m + i / 2;
}, Us = function(a, t) {
  var l;
  return Ha.some(function(o) {
    var u = o[_e].options.emptyInsertThreshold;
    if (!(!u || zl(o))) {
      var f = Fe(o), m = a >= f.left - u && a <= f.right + u, d = t >= f.top - u && t <= f.bottom + u;
      if (m && d)
        return l = o;
    }
  }), l;
}, Ho = function(a) {
  function t(u, f) {
    return function(m, d, i, c) {
      var p = m.options.group.name && d.options.group.name && m.options.group.name === d.options.group.name;
      if (u == null && (f || p))
        return !0;
      if (u == null || u === !1)
        return !1;
      if (f && u === "clone")
        return u;
      if (typeof u == "function")
        return t(u(m, d, i, c), f)(m, d, i, c);
      var w = (f ? m : d).options.group.name;
      return u === !0 || typeof u == "string" && u === w || u.join && u.indexOf(w) > -1;
    };
  }
  var l = {}, o = a.group;
  (!o || Tl(o) != "object") && (o = {
    name: o
  }), l.name = o.name, l.checkPull = t(o.pull, !0), l.checkPut = t(o.put), l.revertClone = o.revertClone, a.group = l;
}, Yo = function() {
  !Go && ye && he(ye, "display", "none");
}, Xo = function() {
  !Go && ye && he(ye, "display", "");
};
_a && !Mo && document.addEventListener("click", function(e) {
  if (Ka)
    return e.preventDefault(), e.stopPropagation && e.stopPropagation(), e.stopImmediatePropagation && e.stopImmediatePropagation(), Ka = !1, !1;
}, !0);
var Rt = function(a) {
  if (ae) {
    a = a.touches ? a.touches[0] : a;
    var t = Us(a.clientX, a.clientY);
    if (t) {
      var l = {};
      for (var o in a)
        a.hasOwnProperty(o) && (l[o] = a[o]);
      l.target = l.rootEl = t, l.preventDefault = void 0, l.stopPropagation = void 0, t[_e]._onDragOver(l);
    }
  }
}, Es = function(a) {
  ae && ae.parentNode[_e]._isOutsideThisEl(a.target);
};
function ge(e, a) {
  if (!(e && e.nodeType && e.nodeType === 1))
    throw "Sortable: `el` must be an HTMLElement, not ".concat({}.toString.call(e));
  this.el = e, this.options = a = wt({}, a), e[_e] = this;
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
      return Ko(e, this.options);
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
    supportPointer: ge.supportPointer !== !1 && "PointerEvent" in window && (!ya || Bl),
    emptyInsertThreshold: 5
  };
  Da.initializePlugins(this, e, t);
  for (var l in t)
    !(l in a) && (a[l] = t[l]);
  Ho(a);
  for (var o in this)
    o.charAt(0) === "_" && typeof this[o] == "function" && (this[o] = this[o].bind(this));
  this.nativeDraggable = a.forceFallback ? !1 : Is, this.nativeDraggable && (this.options.touchStartThreshold = 1), a.supportPointer ? Ce(e, "pointerdown", this._onTapStart) : (Ce(e, "mousedown", this._onTapStart), Ce(e, "touchstart", this._onTapStart)), this.nativeDraggable && (Ce(e, "dragover", this), Ce(e, "dragenter", this)), Ha.push(this.el), a.store && a.store.get && this.sort(a.store.get(this) || []), wt(this, $s());
}
ge.prototype = /** @lends Sortable.prototype */
{
  constructor: ge,
  _isOutsideThisEl: function(a) {
    !this.el.contains(a) && a !== this.el && (Qt = null);
  },
  _getDirection: function(a, t) {
    return typeof this.options.direction == "function" ? this.options.direction.call(this, a, t, ae) : this.options.direction;
  },
  _onTapStart: function(a) {
    if (a.cancelable) {
      var t = this, l = this.el, o = this.options, u = o.preventOnFilter, f = a.type, m = a.touches && a.touches[0] || a.pointerType && a.pointerType === "touch" && a, d = (m || a).target, i = a.target.shadowRoot && (a.path && a.path[0] || a.composedPath && a.composedPath()[0]) || d, c = o.filter;
      if (Ls(l), !ae && !(/mousedown|pointerdown/.test(f) && a.button !== 0 || o.disabled) && !i.isContentEditable && !(!this.nativeDraggable && ya && d && d.tagName.toUpperCase() === "SELECT") && (d = ut(d, o.draggable, l, !1), !(d && d.animated) && Ba !== d)) {
        if (aa = it(d), wa = it(d, o.draggable), typeof c == "function") {
          if (c.call(this, a, d, this)) {
            Ye({
              sortable: t,
              rootEl: i,
              name: "filter",
              targetEl: d,
              toEl: l,
              fromEl: l
            }), Qe("filter", t, {
              evt: a
            }), u && a.preventDefault();
            return;
          }
        } else if (c && (c = c.split(",").some(function(p) {
          if (p = ut(i, p.trim(), l, !1), p)
            return Ye({
              sortable: t,
              rootEl: p,
              name: "filter",
              targetEl: d,
              fromEl: l,
              toEl: l
            }), Qe("filter", t, {
              evt: a
            }), !0;
        }), c)) {
          u && a.preventDefault();
          return;
        }
        o.handle && !ut(i, o.handle, l, !1) || this._prepareDragStart(a, m, d);
      }
    }
  },
  _prepareDragStart: function(a, t, l) {
    var o = this, u = o.el, f = o.options, m = u.ownerDocument, d;
    if (l && !ae && l.parentNode === u) {
      var i = Fe(l);
      if (Ue = u, ae = l, Re = ae.parentNode, Nt = ae.nextSibling, Ba = l, Ra = f.group, ge.dragged = ae, Pt = {
        target: ae,
        clientX: (t || a).clientX,
        clientY: (t || a).clientY
      }, co = Pt.clientX - i.left, vo = Pt.clientY - i.top, this._lastX = (t || a).clientX, this._lastY = (t || a).clientY, ae.style["will-change"] = "all", d = function() {
        if (Qe("delayEnded", o, {
          evt: a
        }), ge.eventCanceled) {
          o._onDrop();
          return;
        }
        o._disableDelayedDragEvents(), !no && o.nativeDraggable && (ae.draggable = !0), o._triggerDragStart(a, t), Ye({
          sortable: o,
          name: "choose",
          originalEvent: a
        }), at(ae, f.chosenClass, !0);
      }, f.ignore.split(",").forEach(function(c) {
        Bo(ae, c.trim(), yl);
      }), Ce(m, "dragover", Rt), Ce(m, "mousemove", Rt), Ce(m, "touchmove", Rt), f.supportPointer ? (Ce(m, "pointerup", o._onDrop), !this.nativeDraggable && Ce(m, "pointercancel", o._onDrop)) : (Ce(m, "mouseup", o._onDrop), Ce(m, "touchend", o._onDrop), Ce(m, "touchcancel", o._onDrop)), no && this.nativeDraggable && (this.options.touchStartThreshold = 4, ae.draggable = !0), Qe("delayStart", this, {
        evt: a
      }), f.delay && (!f.delayOnTouchOnly || t) && (!this.nativeDraggable || !(Ia || $t))) {
        if (ge.eventCanceled) {
          this._onDrop();
          return;
        }
        f.supportPointer ? (Ce(m, "pointerup", o._disableDelayedDrag), Ce(m, "pointercancel", o._disableDelayedDrag)) : (Ce(m, "mouseup", o._disableDelayedDrag), Ce(m, "touchend", o._disableDelayedDrag), Ce(m, "touchcancel", o._disableDelayedDrag)), Ce(m, "mousemove", o._delayedDragTouchMoveHandler), Ce(m, "touchmove", o._delayedDragTouchMoveHandler), f.supportPointer && Ce(m, "pointermove", o._delayedDragTouchMoveHandler), o._dragStartTimer = setTimeout(d, f.delay);
      } else
        d();
    }
  },
  _delayedDragTouchMoveHandler: function(a) {
    var t = a.touches ? a.touches[0] : a;
    Math.max(Math.abs(t.clientX - this._lastX), Math.abs(t.clientY - this._lastY)) >= Math.floor(this.options.touchStartThreshold / (this.nativeDraggable && window.devicePixelRatio || 1)) && this._disableDelayedDrag();
  },
  _disableDelayedDrag: function() {
    ae && yl(ae), clearTimeout(this._dragStartTimer), this._disableDelayedDragEvents();
  },
  _disableDelayedDragEvents: function() {
    var a = this.el.ownerDocument;
    xe(a, "mouseup", this._disableDelayedDrag), xe(a, "touchend", this._disableDelayedDrag), xe(a, "touchcancel", this._disableDelayedDrag), xe(a, "pointerup", this._disableDelayedDrag), xe(a, "pointercancel", this._disableDelayedDrag), xe(a, "mousemove", this._delayedDragTouchMoveHandler), xe(a, "touchmove", this._delayedDragTouchMoveHandler), xe(a, "pointermove", this._delayedDragTouchMoveHandler);
  },
  _triggerDragStart: function(a, t) {
    t = t || a.pointerType == "touch" && a, !this.nativeDraggable || t ? this.options.supportPointer ? Ce(document, "pointermove", this._onTouchMove) : t ? Ce(document, "touchmove", this._onTouchMove) : Ce(document, "mousemove", this._onTouchMove) : (Ce(ae, "dragend", this), Ce(Ue, "dragstart", this._onDragStart));
    try {
      document.selection ? ja(function() {
        document.selection.empty();
      }) : window.getSelection().removeAllRanges();
    } catch {
    }
  },
  _dragStarted: function(a, t) {
    if (ea = !1, Ue && ae) {
      Qe("dragStarted", this, {
        evt: t
      }), this.nativeDraggable && Ce(document, "dragover", Es);
      var l = this.options;
      !a && at(ae, l.dragClass, !1), at(ae, l.ghostClass, !0), ge.active = this, a && this._appendGhost(), Ye({
        sortable: this,
        name: "start",
        originalEvent: t
      });
    } else
      this._nulling();
  },
  _emulateDragOver: function() {
    if (dt) {
      this._lastX = dt.clientX, this._lastY = dt.clientY, Yo();
      for (var a = document.elementFromPoint(dt.clientX, dt.clientY), t = a; a && a.shadowRoot && (a = a.shadowRoot.elementFromPoint(dt.clientX, dt.clientY), a !== t); )
        t = a;
      if (ae.parentNode[_e]._isOutsideThisEl(a), t)
        do {
          if (t[_e]) {
            var l = void 0;
            if (l = t[_e]._onDragOver({
              clientX: dt.clientX,
              clientY: dt.clientY,
              target: a,
              rootEl: t
            }), l && !this.options.dragoverBubble)
              break;
          }
          a = t;
        } while (t = Lo(t));
      Xo();
    }
  },
  _onTouchMove: function(a) {
    if (Pt) {
      var t = this.options, l = t.fallbackTolerance, o = t.fallbackOffset, u = a.touches ? a.touches[0] : a, f = ye && la(ye, !0), m = ye && f && f.a, d = ye && f && f.d, i = Ma && Ke && uo(Ke), c = (u.clientX - Pt.clientX + o.x) / (m || 1) + (i ? i[0] - gl[0] : 0) / (m || 1), p = (u.clientY - Pt.clientY + o.y) / (d || 1) + (i ? i[1] - gl[1] : 0) / (d || 1);
      if (!ge.active && !ea) {
        if (l && Math.max(Math.abs(u.clientX - this._lastX), Math.abs(u.clientY - this._lastY)) < l)
          return;
        this._onDragStart(a, !0);
      }
      if (ye) {
        f ? (f.e += c - (bl || 0), f.f += p - (hl || 0)) : f = {
          a: 1,
          b: 0,
          c: 0,
          d: 1,
          e: c,
          f: p
        };
        var w = "matrix(".concat(f.a, ",").concat(f.b, ",").concat(f.c, ",").concat(f.d, ",").concat(f.e, ",").concat(f.f, ")");
        he(ye, "webkitTransform", w), he(ye, "mozTransform", w), he(ye, "msTransform", w), he(ye, "transform", w), bl = c, hl = p, dt = u;
      }
      a.cancelable && a.preventDefault();
    }
  },
  _appendGhost: function() {
    if (!ye) {
      var a = this.options.fallbackOnBody ? document.body : Ue, t = Fe(ae, !0, Ma, !0, a), l = this.options;
      if (Ma) {
        for (Ke = a; he(Ke, "position") === "static" && he(Ke, "transform") === "none" && Ke !== document; )
          Ke = Ke.parentNode;
        Ke !== document.body && Ke !== document.documentElement ? (Ke === document && (Ke = ft()), t.top += Ke.scrollTop, t.left += Ke.scrollLeft) : Ke = ft(), gl = uo(Ke);
      }
      ye = ae.cloneNode(!0), at(ye, l.ghostClass, !1), at(ye, l.fallbackClass, !0), at(ye, l.dragClass, !0), he(ye, "transition", ""), he(ye, "transform", ""), he(ye, "box-sizing", "border-box"), he(ye, "margin", 0), he(ye, "top", t.top), he(ye, "left", t.left), he(ye, "width", t.width), he(ye, "height", t.height), he(ye, "opacity", "0.8"), he(ye, "position", Ma ? "absolute" : "fixed"), he(ye, "zIndex", "100000"), he(ye, "pointerEvents", "none"), ge.ghost = ye, a.appendChild(ye), he(ye, "transform-origin", co / parseInt(ye.style.width) * 100 + "% " + vo / parseInt(ye.style.height) * 100 + "%");
    }
  },
  _onDragStart: function(a, t) {
    var l = this, o = a.dataTransfer, u = l.options;
    if (Qe("dragStart", this, {
      evt: a
    }), ge.eventCanceled) {
      this._onDrop();
      return;
    }
    Qe("setupClone", this), ge.eventCanceled || (Ae = Wo(ae), Ae.removeAttribute("id"), Ae.draggable = !1, Ae.style["will-change"] = "", this._hideClone(), at(Ae, this.options.chosenClass, !1), ge.clone = Ae), l.cloneId = ja(function() {
      Qe("clone", l), !ge.eventCanceled && (l.options.removeCloneOnHide || Ue.insertBefore(Ae, ae), l._hideClone(), Ye({
        sortable: l,
        name: "clone"
      }));
    }), !t && at(ae, u.dragClass, !0), t ? (Ka = !0, l._loopId = setInterval(l._emulateDragOver, 50)) : (xe(document, "mouseup", l._onDrop), xe(document, "touchend", l._onDrop), xe(document, "touchcancel", l._onDrop), o && (o.effectAllowed = "move", u.setData && u.setData.call(l, o, ae)), Ce(document, "drop", l), he(ae, "transform", "translateZ(0)")), ea = !0, l._dragStartId = ja(l._dragStarted.bind(l, t, a)), Ce(document, "selectstart", l), ma = !0, window.getSelection().removeAllRanges(), ya && he(document.body, "user-select", "none");
  },
  // Returns true - if no further action is needed (either inserted or another condition)
  _onDragOver: function(a) {
    var t = this.el, l = a.target, o, u, f, m = this.options, d = m.group, i = ge.active, c = Ra === d, p = m.sort, w = Ge || i, v, g = this, k = !1;
    if (Il) return;
    function T(Q, x) {
      Qe(Q, g, pt({
        evt: a,
        isOwner: c,
        axis: v ? "vertical" : "horizontal",
        revert: f,
        dragRect: o,
        targetRect: u,
        canSort: p,
        fromSortable: w,
        target: l,
        completed: C,
        onMove: function(E, X) {
          return Fa(Ue, t, ae, o, E, Fe(E), a, X);
        },
        changed: N
      }, x));
    }
    function $() {
      T("dragOverAnimationCapture"), g.captureAnimationState(), g !== w && w.captureAnimationState();
    }
    function C(Q) {
      return T("dragOverCompleted", {
        insertion: Q
      }), Q && (c ? i._hideClone() : i._showClone(g), g !== w && (at(ae, Ge ? Ge.options.ghostClass : i.options.ghostClass, !1), at(ae, m.ghostClass, !0)), Ge !== g && g !== ge.active ? Ge = g : g === ge.active && Ge && (Ge = null), w === g && (g._ignoreWhileAnimating = l), g.animateAll(function() {
        T("dragOverAnimationComplete"), g._ignoreWhileAnimating = null;
      }), g !== w && (w.animateAll(), w._ignoreWhileAnimating = null)), (l === ae && !ae.animated || l === t && !l.animated) && (Qt = null), !m.dragoverBubble && !a.rootEl && l !== document && (ae.parentNode[_e]._isOutsideThisEl(a.target), !Q && Rt(a)), !m.dragoverBubble && a.stopPropagation && a.stopPropagation(), k = !0;
    }
    function N() {
      lt = it(ae), St = it(ae, m.draggable), Ye({
        sortable: g,
        name: "change",
        toEl: t,
        newIndex: lt,
        newDraggableIndex: St,
        originalEvent: a
      });
    }
    if (a.preventDefault !== void 0 && a.cancelable && a.preventDefault(), l = ut(l, m.draggable, t, !0), T("dragOver"), ge.eventCanceled) return k;
    if (ae.contains(a.target) || l.animated && l.animatingX && l.animatingY || g._ignoreWhileAnimating === l)
      return C(!1);
    if (Ka = !1, i && !m.disabled && (c ? p || (f = Re !== Ue) : Ge === this || (this.lastPutMode = Ra.checkPull(this, i, ae, a)) && d.checkPut(this, i, ae, a))) {
      if (v = this._getDirection(a, l) === "vertical", o = Fe(ae), T("dragOverValid"), ge.eventCanceled) return k;
      if (f)
        return Re = Ue, $(), this._hideClone(), T("revert"), ge.eventCanceled || (Nt ? Ue.insertBefore(ae, Nt) : Ue.appendChild(ae)), C(!0);
      var F = zl(t, m.draggable);
      if (!F || Rs(a, v, this) && !F.animated) {
        if (F === ae)
          return C(!1);
        if (F && t === a.target && (l = F), l && (u = Fe(l)), Fa(Ue, t, ae, o, l, u, a, !!l) !== !1)
          return $(), F && F.nextSibling ? t.insertBefore(ae, F.nextSibling) : t.appendChild(ae), Re = t, N(), C(!0);
      } else if (F && Ps(a, v, this)) {
        var z = ia(t, 0, m, !0);
        if (z === ae)
          return C(!1);
        if (l = z, u = Fe(l), Fa(Ue, t, ae, o, l, u, a, !1) !== !1)
          return $(), t.insertBefore(ae, z), Re = t, N(), C(!0);
      } else if (l.parentNode === t) {
        u = Fe(l);
        var ie = 0, le, de = ae.parentNode !== t, Z = !Ds(ae.animated && ae.toRect || o, l.animated && l.toRect || u, v), ve = v ? "top" : "left", be = ro(l, "top", "top") || ro(ae, "top", "top"), te = be ? be.scrollTop : void 0;
        Qt !== l && (le = u[ve], $a = !1, Na = !Z && m.invertSwap || de), ie = Ns(a, l, u, v, Z ? 1 : m.swapThreshold, m.invertedSwapThreshold == null ? m.swapThreshold : m.invertedSwapThreshold, Na, Qt === l);
        var U;
        if (ie !== 0) {
          var Y = it(ae);
          do
            Y -= ie, U = Re.children[Y];
          while (U && (he(U, "display") === "none" || U === ye));
        }
        if (ie === 0 || U === l)
          return C(!1);
        Qt = l, Va = ie;
        var P = l.nextElementSibling, me = !1;
        me = ie === 1;
        var O = Fa(Ue, t, ae, o, l, u, a, me);
        if (O !== !1)
          return (O === 1 || O === -1) && (me = O === 1), Il = !0, setTimeout(Os, 30), $(), me && !P ? t.appendChild(ae) : l.parentNode.insertBefore(ae, me ? P : l), be && jo(be, 0, te - be.scrollTop), Re = ae.parentNode, le !== void 0 && !Na && (za = Math.abs(le - Fe(l)[ve])), N(), C(!0);
      }
      if (t.contains(ae))
        return C(!1);
    }
    return !1;
  },
  _ignoreWhileAnimating: null,
  _offMoveEvents: function() {
    xe(document, "mousemove", this._onTouchMove), xe(document, "touchmove", this._onTouchMove), xe(document, "pointermove", this._onTouchMove), xe(document, "dragover", Rt), xe(document, "mousemove", Rt), xe(document, "touchmove", Rt);
  },
  _offUpEvents: function() {
    var a = this.el.ownerDocument;
    xe(a, "mouseup", this._onDrop), xe(a, "touchend", this._onDrop), xe(a, "pointerup", this._onDrop), xe(a, "pointercancel", this._onDrop), xe(a, "touchcancel", this._onDrop), xe(document, "selectstart", this);
  },
  _onDrop: function(a) {
    var t = this.el, l = this.options;
    if (lt = it(ae), St = it(ae, l.draggable), Qe("drop", this, {
      evt: a
    }), Re = ae && ae.parentNode, lt = it(ae), St = it(ae, l.draggable), ge.eventCanceled) {
      this._nulling();
      return;
    }
    ea = !1, Na = !1, $a = !1, clearInterval(this._loopId), clearTimeout(this._dragStartTimer), Dl(this.cloneId), Dl(this._dragStartId), this.nativeDraggable && (xe(document, "drop", this), xe(t, "dragstart", this._onDragStart)), this._offMoveEvents(), this._offUpEvents(), ya && he(document.body, "user-select", ""), he(ae, "transform", ""), a && (ma && (a.cancelable && a.preventDefault(), !l.dropBubble && a.stopPropagation()), ye && ye.parentNode && ye.parentNode.removeChild(ye), (Ue === Re || Ge && Ge.lastPutMode !== "clone") && Ae && Ae.parentNode && Ae.parentNode.removeChild(Ae), ae && (this.nativeDraggable && xe(ae, "dragend", this), yl(ae), ae.style["will-change"] = "", ma && !ea && at(ae, Ge ? Ge.options.ghostClass : this.options.ghostClass, !1), at(ae, this.options.chosenClass, !1), Ye({
      sortable: this,
      name: "unchoose",
      toEl: Re,
      newIndex: null,
      newDraggableIndex: null,
      originalEvent: a
    }), Ue !== Re ? (lt >= 0 && (Ye({
      rootEl: Re,
      name: "add",
      toEl: Re,
      fromEl: Ue,
      originalEvent: a
    }), Ye({
      sortable: this,
      name: "remove",
      toEl: Re,
      originalEvent: a
    }), Ye({
      rootEl: Re,
      name: "sort",
      toEl: Re,
      fromEl: Ue,
      originalEvent: a
    }), Ye({
      sortable: this,
      name: "sort",
      toEl: Re,
      originalEvent: a
    })), Ge && Ge.save()) : lt !== aa && lt >= 0 && (Ye({
      sortable: this,
      name: "update",
      toEl: Re,
      originalEvent: a
    }), Ye({
      sortable: this,
      name: "sort",
      toEl: Re,
      originalEvent: a
    })), ge.active && ((lt == null || lt === -1) && (lt = aa, St = wa), Ye({
      sortable: this,
      name: "end",
      toEl: Re,
      originalEvent: a
    }), this.save()))), this._nulling();
  },
  _nulling: function() {
    Qe("nulling", this), Ue = ae = Re = ye = Nt = Ae = Ba = Tt = Pt = dt = ma = lt = St = aa = wa = Qt = Va = Ge = Ra = ge.dragged = ge.ghost = ge.clone = ge.active = null;
    var a = this.el;
    Ya.forEach(function(t) {
      a.contains(t) && (t.checked = !0);
    }), Ya.length = bl = hl = 0;
  },
  handleEvent: function(a) {
    switch (a.type) {
      case "drop":
      case "dragend":
        this._onDrop(a);
        break;
      case "dragenter":
      case "dragover":
        ae && (this._onDragOver(a), As(a));
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
    for (var a = [], t, l = this.el.children, o = 0, u = l.length, f = this.options; o < u; o++)
      t = l[o], ut(t, f.draggable, this.el, !1) && a.push(t.getAttribute(f.dataIdAttr) || Fs(t));
    return a;
  },
  /**
   * Sorts the elements according to the array.
   * @param  {String[]}  order  order of the items
   */
  sort: function(a, t) {
    var l = {}, o = this.el;
    this.toArray().forEach(function(u, f) {
      var m = o.children[f];
      ut(m, this.options.draggable, o, !1) && (l[u] = m);
    }, this), t && this.captureAnimationState(), a.forEach(function(u) {
      l[u] && (o.removeChild(l[u]), o.appendChild(l[u]));
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
    return ut(a, t || this.options.draggable, this.el, !1);
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
    var o = Da.modifyOption(this, a, t);
    typeof o < "u" ? l[a] = o : l[a] = t, a === "group" && Ho(l);
  },
  /**
   * Destroy
   */
  destroy: function() {
    Qe("destroy", this);
    var a = this.el;
    a[_e] = null, xe(a, "mousedown", this._onTapStart), xe(a, "touchstart", this._onTapStart), xe(a, "pointerdown", this._onTapStart), this.nativeDraggable && (xe(a, "dragover", this), xe(a, "dragenter", this)), Array.prototype.forEach.call(a.querySelectorAll("[draggable]"), function(t) {
      t.removeAttribute("draggable");
    }), this._onDrop(), this._disableDelayedDragEvents(), Ha.splice(Ha.indexOf(this.el), 1), this.el = a = null;
  },
  _hideClone: function() {
    if (!Tt) {
      if (Qe("hideClone", this), ge.eventCanceled) return;
      he(Ae, "display", "none"), this.options.removeCloneOnHide && Ae.parentNode && Ae.parentNode.removeChild(Ae), Tt = !0;
    }
  },
  _showClone: function(a) {
    if (a.lastPutMode !== "clone") {
      this._hideClone();
      return;
    }
    if (Tt) {
      if (Qe("showClone", this), ge.eventCanceled) return;
      ae.parentNode == Ue && !this.options.group.revertClone ? Ue.insertBefore(Ae, ae) : Nt ? Ue.insertBefore(Ae, Nt) : Ue.appendChild(Ae), this.options.group.revertClone && this.animate(ae, Ae), he(Ae, "display", ""), Tt = !1;
    }
  }
};
function As(e) {
  e.dataTransfer && (e.dataTransfer.dropEffect = "move"), e.cancelable && e.preventDefault();
}
function Fa(e, a, t, l, o, u, f, m) {
  var d, i = e[_e], c = i.options.onMove, p;
  return window.CustomEvent && !$t && !Ia ? d = new CustomEvent("move", {
    bubbles: !0,
    cancelable: !0
  }) : (d = document.createEvent("Event"), d.initEvent("move", !0, !0)), d.to = a, d.from = e, d.dragged = t, d.draggedRect = l, d.related = o || a, d.relatedRect = u || Fe(a), d.willInsertAfter = m, d.originalEvent = f, e.dispatchEvent(d), c && (p = c.call(i, d, f)), p;
}
function yl(e) {
  e.draggable = !1;
}
function Os() {
  Il = !1;
}
function Ps(e, a, t) {
  var l = Fe(ia(t.el, 0, t.options, !0)), o = qo(t.el, t.options, ye), u = 10;
  return a ? e.clientX < o.left - u || e.clientY < l.top && e.clientX < l.right : e.clientY < o.top - u || e.clientY < l.bottom && e.clientX < l.left;
}
function Rs(e, a, t) {
  var l = Fe(zl(t.el, t.options.draggable)), o = qo(t.el, t.options, ye), u = 10;
  return a ? e.clientX > o.right + u || e.clientY > l.bottom && e.clientX > l.left : e.clientY > o.bottom + u || e.clientX > l.right && e.clientY > l.top;
}
function Ns(e, a, t, l, o, u, f, m) {
  var d = l ? e.clientY : e.clientX, i = l ? t.height : t.width, c = l ? t.top : t.left, p = l ? t.bottom : t.right, w = !1;
  if (!f) {
    if (m && za < i * o) {
      if (!$a && (Va === 1 ? d > c + i * u / 2 : d < p - i * u / 2) && ($a = !0), $a)
        w = !0;
      else if (Va === 1 ? d < c + za : d > p - za)
        return -Va;
    } else if (d > c + i * (1 - o) / 2 && d < p - i * (1 - o) / 2)
      return Ms(a);
  }
  return w = w || f, w && (d < c + i * u / 2 || d > p - i * u / 2) ? d > c + i / 2 ? 1 : -1 : 0;
}
function Ms(e) {
  return it(ae) < it(e) ? 1 : -1;
}
function Fs(e) {
  for (var a = e.tagName + e.className + e.src + e.href + e.textContent, t = a.length, l = 0; t--; )
    l += a.charCodeAt(t);
  return l.toString(36);
}
function Ls(e) {
  Ya.length = 0;
  for (var a = e.getElementsByTagName("input"), t = a.length; t--; ) {
    var l = a[t];
    l.checked && Ya.push(l);
  }
}
function ja(e) {
  return setTimeout(e, 0);
}
function Dl(e) {
  return clearTimeout(e);
}
_a && Ce(document, "touchmove", function(e) {
  (ge.active || ea) && e.cancelable && e.preventDefault();
});
ge.utils = {
  on: Ce,
  off: xe,
  css: he,
  find: Bo,
  is: function(a, t) {
    return !!ut(a, t, a, !1);
  },
  extend: ws,
  throttle: zo,
  closest: ut,
  toggleClass: at,
  clone: Wo,
  index: it,
  nextTick: ja,
  cancelNextTick: Dl,
  detectDirection: Ko,
  getChild: ia,
  expando: _e
};
ge.get = function(e) {
  return e[_e];
};
ge.mount = function() {
  for (var e = arguments.length, a = new Array(e), t = 0; t < e; t++)
    a[t] = arguments[t];
  a[0].constructor === Array && (a = a[0]), a.forEach(function(l) {
    if (!l.prototype || !l.prototype.constructor)
      throw "Sortable: Mounted plugin must be a constructor function, not ".concat({}.toString.call(l));
    l.utils && (ge.utils = pt(pt({}, ge.utils), l.utils)), Da.mount(l);
  });
};
ge.create = function(e, a) {
  return new ge(e, a);
};
ge.version = ys;
var Me = [], fa, Ul, El = !1, kl, wl, Xa, pa;
function Bs() {
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
      this.sortable.nativeDraggable ? xe(document, "dragover", this._handleAutoScroll) : (xe(document, "pointermove", this._handleFallbackAutoScroll), xe(document, "touchmove", this._handleFallbackAutoScroll), xe(document, "mousemove", this._handleFallbackAutoScroll)), fo(), Wa(), Vs();
    },
    nulling: function() {
      Xa = Ul = fa = El = pa = kl = wl = null, Me.length = 0;
    },
    _handleFallbackAutoScroll: function(t) {
      this._handleAutoScroll(t, !0);
    },
    _handleAutoScroll: function(t, l) {
      var o = this, u = (t.touches ? t.touches[0] : t).clientX, f = (t.touches ? t.touches[0] : t).clientY, m = document.elementFromPoint(u, f);
      if (Xa = t, l || this.options.forceAutoScrollFallback || Ia || $t || ya) {
        Vl(t, this.options, m, l);
        var d = Dt(m, !0);
        El && (!pa || u !== kl || f !== wl) && (pa && fo(), pa = setInterval(function() {
          var i = Dt(document.elementFromPoint(u, f), !0);
          i !== d && (d = i, Wa()), Vl(t, o.options, i, l);
        }, 10), kl = u, wl = f);
      } else {
        if (!this.options.bubbleScroll || Dt(m, !0) === ft()) {
          Wa();
          return;
        }
        Vl(t, this.options, Dt(m, !1), !1);
      }
    }
  }, wt(e, {
    pluginName: "scroll",
    initializeByDefault: !0
  });
}
function Wa() {
  Me.forEach(function(e) {
    clearInterval(e.pid);
  }), Me = [];
}
function fo() {
  clearInterval(pa);
}
var Vl = zo(function(e, a, t, l) {
  if (a.scroll) {
    var o = (e.touches ? e.touches[0] : e).clientX, u = (e.touches ? e.touches[0] : e).clientY, f = a.scrollSensitivity, m = a.scrollSpeed, d = ft(), i = !1, c;
    Ul !== t && (Ul = t, Wa(), fa = a.scroll, c = a.scrollFn, fa === !0 && (fa = Dt(t, !0)));
    var p = 0, w = fa;
    do {
      var v = w, g = Fe(v), k = g.top, T = g.bottom, $ = g.left, C = g.right, N = g.width, F = g.height, z = void 0, ie = void 0, le = v.scrollWidth, de = v.scrollHeight, Z = he(v), ve = v.scrollLeft, be = v.scrollTop;
      v === d ? (z = N < le && (Z.overflowX === "auto" || Z.overflowX === "scroll" || Z.overflowX === "visible"), ie = F < de && (Z.overflowY === "auto" || Z.overflowY === "scroll" || Z.overflowY === "visible")) : (z = N < le && (Z.overflowX === "auto" || Z.overflowX === "scroll"), ie = F < de && (Z.overflowY === "auto" || Z.overflowY === "scroll"));
      var te = z && (Math.abs(C - o) <= f && ve + N < le) - (Math.abs($ - o) <= f && !!ve), U = ie && (Math.abs(T - u) <= f && be + F < de) - (Math.abs(k - u) <= f && !!be);
      if (!Me[p])
        for (var Y = 0; Y <= p; Y++)
          Me[Y] || (Me[Y] = {});
      (Me[p].vx != te || Me[p].vy != U || Me[p].el !== v) && (Me[p].el = v, Me[p].vx = te, Me[p].vy = U, clearInterval(Me[p].pid), (te != 0 || U != 0) && (i = !0, Me[p].pid = setInterval(function() {
        l && this.layer === 0 && ge.active._onTouchMove(Xa);
        var P = Me[this.layer].vy ? Me[this.layer].vy * m : 0, me = Me[this.layer].vx ? Me[this.layer].vx * m : 0;
        typeof c == "function" && c.call(ge.dragged.parentNode[_e], me, P, e, Xa, Me[this.layer].el) !== "continue" || jo(Me[this.layer].el, me, P);
      }.bind({
        layer: p
      }), 24))), p++;
    } while (a.bubbleScroll && w !== d && (w = Dt(w, !1)));
    El = i;
  }
}, 30), Jo = function(a) {
  var t = a.originalEvent, l = a.putSortable, o = a.dragEl, u = a.activeSortable, f = a.dispatchSortableEvent, m = a.hideGhostForTarget, d = a.unhideGhostForTarget;
  if (t) {
    var i = l || u;
    m();
    var c = t.changedTouches && t.changedTouches.length ? t.changedTouches[0] : t, p = document.elementFromPoint(c.clientX, c.clientY);
    d(), i && !i.el.contains(p) && (f("spill"), this.onSpill({
      dragEl: o,
      putSortable: l
    }));
  }
};
function jl() {
}
jl.prototype = {
  startIndex: null,
  dragStart: function(a) {
    var t = a.oldDraggableIndex;
    this.startIndex = t;
  },
  onSpill: function(a) {
    var t = a.dragEl, l = a.putSortable;
    this.sortable.captureAnimationState(), l && l.captureAnimationState();
    var o = ia(this.sortable.el, this.startIndex, this.options);
    o ? this.sortable.el.insertBefore(t, o) : this.sortable.el.appendChild(t), this.sortable.animateAll(), l && l.animateAll();
  },
  drop: Jo
};
wt(jl, {
  pluginName: "revertOnSpill"
});
function Wl() {
}
Wl.prototype = {
  onSpill: function(a) {
    var t = a.dragEl, l = a.putSortable, o = l || this.sortable;
    o.captureAnimationState(), t.parentNode && t.parentNode.removeChild(t), o.animateAll();
  },
  drop: Jo
};
wt(Wl, {
  pluginName: "removeOnSpill"
});
ge.mount(new Bs());
ge.mount(Wl, jl);
function zs(e, a) {
  const t = e.oldDraggableIndex ?? e.oldIndex;
  e.item.remove();
  const l = [...e.from.children].filter((o) => o.matches(a));
  e.from.insertBefore(e.item, l[t ?? l.length] ?? null);
}
function Zo(e) {
  const a = /* @__PURE__ */ new Map();
  function t(l) {
    a.get(l)?.destroy(), a.delete(l);
  }
  return Vt(() => {
    for (const l of a.keys()) t(l);
  }), {
    mounted(l) {
      const o = l.querySelector(".work-field-builder") ?? l;
      a.set(l, new ge(o, {
        draggable: ".work-reorder-entry",
        handle: ".work-reorder-handle",
        forceFallback: !0,
        fallbackOnBody: !1,
        ghostClass: "work-drag-ghost",
        onEnd(u) {
          const f = u.oldDraggableIndex, m = u.newDraggableIndex;
          zs(u, ".work-reorder-entry"), f !== void 0 && m !== void 0 && f !== m && e(f, m);
        }
      }));
    },
    unmounted: t
  };
}
const js = { class: "work-stack work-tight work-option-builder" }, Ws = { class: "work-stack work-tight" }, qs = { class: "work-stack work-tight work-small" }, Gs = { class: "work-stack work-tight work-small" }, Ks = { class: "work-stack work-tight" }, Hs = { class: "work-stack work-tight work-small" }, Ys = { class: "work-row" }, Xs = { class: "work-stack work-tight work-small" }, Js = { class: "work-row" }, Zs = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, Qs = { class: "work-add-option" }, _s = {
  key: 0,
  class: "work-muted work-small"
}, er = /* @__PURE__ */ Ve({
  __name: "OptionsEditor",
  props: {
    field: {}
  },
  emits: ["validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = "options:" + zt(), u = W(() => t.field.options ?? []), f = W(() => u.value.every((p, w) => !!p.id && u.value.findIndex((v) => v.id === p.id) === w));
    Ie(f, (p) => l("validity", p, o), { immediate: !0 }), Vt(() => l("validity", !0, o));
    function m(p, w) {
      Io(u.value, p, w - p), u.value.forEach((v, g) => v.order = g);
    }
    const d = Zo(m), i = ["primary", "success", "info", "warn", "danger", "secondary"];
    function c() {
      let p = u.value.length + 1;
      for (; u.value.some((w) => w.id === `option_${p}`); ) p++;
      (t.field.options ??= []).push({ id: `option_${p}`, label: "New option", order: u.value.length });
    }
    return (p, w) => (n(), b("section", js, [
      w[4] || (w[4] = r("header", { class: "work-row" }, [
        r("h4", null, "Options"),
        r("span", { class: "work-muted work-small" }, "Renaming a choice keeps it selected on existing items."),
        r("span", { class: "work-spacer" })
      ], -1)),
      mt((n(), b("div", Ws, [
        (n(!0), b(ee, null, ue(u.value, (v, g) => (n(), b("div", {
          key: g,
          class: "work-option-row work-reorder-entry"
        }, [
          y(s(_), {
            type: "button",
            class: "work-icon-button work-reorder-handle",
            "aria-label": "Drag option; arrow keys reorder",
            onKeydown: [
              ze(Ee((k) => m(g, g - 1), ["prevent"]), ["up"]),
              ze(Ee((k) => m(g, g + 1), ["prevent"]), ["down"])
            ],
            severity: "secondary",
            text: "",
            size: "small"
          }, {
            default: q(() => [
              y(s(pe), {
                icon: "tabler:grip-vertical",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["onKeydown"]),
          r("label", qs, [
            w[0] || (w[0] = j("Label", -1)),
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
            default: q(() => [
              r("label", Gs, [
                w[1] || (w[1] = j("Integration identifier", -1)),
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
          r("div", Ks, [
            r("label", Hs, [
              w[2] || (w[2] = j("Color", -1)),
              r("span", Ys, [
                r("span", {
                  class: ct(["work-color-swatch", "work-swatch-" + (v.color || "secondary")]),
                  "aria-hidden": "true"
                }, null, 2),
                y(s(fe), {
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
            r("label", Xs, [
              w[3] || (w[3] = j("Category", -1)),
              y(s(fe), {
                "model-value": v.category,
                "aria-label": "Option category",
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                showClear: "",
                options: ["triage", "backlog", ...s(To)].map((k) => ({ label: s(jt)(k), value: k })),
                "onUpdate:modelValue": (k) => v.category = k || void 0
              }, null, 8, ["model-value", "options", "onUpdate:modelValue"])
            ])
          ]),
          r("div", Js, [
            y(s(_), {
              "aria-label": "Option earlier",
              severity: "secondary",
              size: "small",
              disabled: g === 0,
              onClick: (k) => m(g, g - 1),
              text: ""
            }, {
              default: q(() => [
                y(s(pe), {
                  icon: "tabler:arrow-up",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["disabled", "onClick"]),
            y(s(_), {
              "aria-label": "Option later",
              severity: "secondary",
              size: "small",
              disabled: g === u.value.length - 1,
              onClick: (k) => m(g, g + 1),
              text: ""
            }, {
              default: q(() => [
                y(s(pe), {
                  icon: "tabler:arrow-down",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["disabled", "onClick"]),
            y(s(_), {
              label: "Remove",
              "aria-label": "Remove option",
              severity: "secondary",
              text: "",
              size: "small",
              onClick: (k) => u.value.splice(g, 1)
            }, {
              icon: q(() => [
                y(s(pe), {
                  icon: "tabler:trash",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["onClick"])
          ])
        ]))), 128)),
        f.value ? S("", !0) : (n(), b("p", Zs, "Each choice needs a unique integration identifier.")),
        r("div", Qs, [
          y(s(_), {
            label: "Add option",
            severity: "secondary",
            size: "small",
            onClick: c,
            outlined: ""
          }, {
            icon: q(() => [
              y(s(pe), {
                icon: "tabler:plus",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          })
        ])
      ])), [
        [s(d)]
      ]),
      u.value.length ? S("", !0) : (n(), b("p", _s, "Add the choices people can select for this field."))
    ]));
  }
}), tr = {
  class: "work-stack",
  "aria-label": "Fields editor"
}, ar = { class: "work-form-actions work-wrap" }, lr = { class: "work-stack work-tight" }, or = {
  key: 0,
  class: "work-settings-card work-muted"
}, ir = { class: "work-muted work-small" }, nr = {
  key: 0,
  class: "work-error work-small",
  role: "alert"
}, sr = { class: "work-settings-grid work-field-properties" }, rr = { class: "work-stack work-tight" }, dr = { class: "work-stack work-tight" }, ur = { class: "work-stack work-tight" }, cr = {
  key: 1,
  class: "work-stack work-tight"
}, vr = {
  key: 4,
  class: "work-stack work-tight"
}, mr = {
  key: 5,
  class: "work-stack work-tight"
}, fr = { class: "work-stack work-tight" }, pr = { class: "work-stack work-tight" }, br = { class: "work-stack work-tight" }, hr = { class: "work-stack work-tight" }, gr = { class: "work-stack" }, yr = { class: "work-stack work-tight" }, kr = { class: "work-stack work-tight" }, wr = { class: "work-stack work-tight work-field-history" }, Vr = { class: "work-settings-list" }, $r = { class: "work-settings-row" }, xr = { class: "work-settings-row" }, Cr = { class: "work-stack" }, Sr = /* @__PURE__ */ Ve({
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
    const t = e, l = a, o = W(() => t.draft.fields ?? []), u = B("text"), f = B([]), m = W(() => (t.draft.item_types ?? []).map((x) => ({ value: x.id, label: x.title || Oe(x.id) }))), d = W(() => t.draft.item_types?.find((x) => x.id === t.itemType)), i = W(() => o.value.map((x, M) => ({ field: x, index: M })).filter(({ field: x }) => !d.value || d.value.fields.includes(x.code))), c = B(""), p = B({}), w = Zo((x, M) => {
      const E = i.value[x]?.index, X = i.value[M]?.index;
      E !== void 0 && X !== void 0 && Y(E, X - E);
    });
    function v(x) {
      return (t.draft.item_types ?? []).filter((M) => M.fields.includes(x)).map((M) => M.title || Oe(M.id));
    }
    async function g(x) {
      if (!c.value) {
        c.value = x.code;
        try {
          const M = await t.guardRemoval?.("fields", x.code);
          p.value[x.code] = M ?? "", M || Ta(t.draft, "fields", x.code);
        } finally {
          c.value = "";
        }
      }
    }
    const k = Object.entries({ text: "Text", int: "Whole number", dec: "Decimal number", quantity: "Measurement", bool: "Yes or no", time: "Date or time", ref: "Reference", record: "Structured data", option: "Choice", principal: "Person or group", item: "Work item", rank: "Order", rich_text: "Formatted text", formula: "Formula", rollup: "Related item calculation", counter: "Counter" }).map(([x, M]) => ({ value: x, label: M })), T = [{ label: "None", value: "none" }, { label: "Exact matches", value: "key" }, { label: "Numeric ranges", value: "number" }], $ = ["int", "dec", "quantity"], C = W(() => new Map(t.installedTypes?.map((x) => [x.id, x]))), N = W(() => [...k, ...(t.installedTypes ?? []).map((x) => ({ value: x.id, label: x.title }))]), F = {};
    function z(x) {
      return x.type && x.type !== "value" ? x.type : x.form ?? "text";
    }
    function ie(x) {
      return x.type ? C.value.get(x.type) : void 0;
    }
    function le(x) {
      const M = ie(x)?.config_schema;
      return M && Uo(M).length ? M : void 0;
    }
    function de(x) {
      const M = ie(x);
      return !!M?.config_schema || ["dec", "quantity", "ref", "time", "record"].includes(M?.form ?? x.form ?? "") || !!x.config;
    }
    function Z(x) {
      const M = ie(x), E = M?.form ?? x.form ?? "text";
      return T.filter(({ value: X }) => X === "none" || (!M?.indexes || M.indexes.includes(X)) && E !== "record" && (X !== "number" || $.includes(E) || x.type === "option"));
    }
    function ve(x) {
      x.index && !Z(x).some((M) => M.value === x.index) && delete x.index;
    }
    function be(x, M) {
      const E = C.value.get(M);
      if (E) {
        if (E.id === x.type) return;
        x.type = E.id, x.form = E.form, delete x.options, delete x.config, ve(x);
        return;
      }
      ie(x) && delete x.config;
      const X = { option: "text", principal: "ref", item: "ref", rank: "text", rich_text: "text", formula: "int", rollup: "int", counter: "int" };
      X[M] ? (x.type = M, x.form = X[M]) : (delete x.type, x.form = M), M !== "option" ? delete x.options : x.options ??= [], M === "rich_text" && (x.config = { format: "json" }), ve(x);
    }
    function te(x, M) {
      x.form = M, ve(x);
    }
    function U(x, M) {
      const E = { ...x.config };
      M ? E.item_type = M : delete E.item_type, x.config = Object.keys(E).length ? E : void 0;
    }
    function Y(x, M) {
      Io(o.value, x, M);
      for (const E of t.draft.item_types ?? []) {
        const X = new Set(E.fields);
        E.fields = o.value.filter((h) => X.has(h.code)).map((h) => h.code);
      }
    }
    function P(x, M) {
      try {
        Ti(t.draft, x, M.value), delete p.value[x.code];
      } catch (E) {
        p.value[x.code] = E.message, M.value = x.code;
      }
    }
    function me() {
      u.value = "text", f.value = d.value ? [d.value.id] : [];
    }
    function O(x) {
      const M = x.normalize("NFKD").replace(/\p{Mark}/gu, "").toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, ""), E = (/^[a-z]/.test(M) ? M : `field_${M || "new"}`).slice(0, 40);
      let X = E, h = 2;
      for (; o.value.some((se) => se.code === X); ) {
        const se = "_" + h++;
        X = E.slice(0, 40 - se.length) + se;
      }
      const A = { code: X, title: x, form: "text", cardinality: "one" };
      be(A, u.value), (t.draft.fields ??= []).push(A);
      for (const se of t.draft.item_types ?? []) f.value.includes(se.id) && se.fields.push(X);
      d.value && !f.value.includes(d.value.id) && l("update:itemType", ""), Q.value = X;
    }
    const Q = B("");
    return (x, M) => (n(), b("section", tr, [
      r("div", ar, [
        y(s(fe), {
          "model-value": d.value?.id ?? "",
          "aria-label": "Filter fields by item type",
          placeholder: "All item types",
          appendTo: "self",
          optionLabel: "label",
          optionValue: "value",
          options: [{ value: "", label: "All item types" }, ...m.value],
          "onUpdate:modelValue": M[0] || (M[0] = (E) => l("update:itemType", E))
        }, null, 8, ["model-value", "options"]),
        y(xa, {
          action: "Add field",
          label: "Field name",
          maxlength: 255,
          regular: "",
          onOpen: me,
          onAdd: O
        }, {
          default: q(() => [
            r("label", lr, [
              M[4] || (M[4] = j("Kind", -1)),
              y(s(fe), {
                modelValue: u.value,
                "onUpdate:modelValue": M[1] || (M[1] = (E) => u.value = E),
                "aria-label": "New field kind",
                appendTo: "self",
                options: N.value,
                optionLabel: "label",
                optionValue: "value"
              }, null, 8, ["modelValue", "options"])
            ]),
            m.value.length ? (n(), K(vt, {
              key: 0,
              label: "Show on item types",
              options: m.value,
              modelValue: f.value,
              "onUpdate:modelValue": M[2] || (M[2] = (E) => f.value = E)
            }, null, 8, ["options", "modelValue"])) : S("", !0)
          ]),
          _: 1
        })
      ]),
      i.value.length ? S("", !0) : (n(), b("p", or, "No fields here yet. Add a field to capture information.")),
      mt((n(), K(Qa, {
        columns: "fields",
        count: i.value.length
      }, {
        default: q(() => [
          (n(!0), b(ee, null, ue(i.value, ({ field: E, index: X }) => (n(), K(Za, {
            title: s(He)(E),
            "initial-open": Q.value === E.code,
            kind: ie(E)?.title || s(k).find((h) => h.value === z(E))?.label || s(Oe)(z(E)),
            key: E.id ?? X,
            class: "work-field-row work-reorder-entry work-stack"
          }, {
            handle: q(() => [
              y(s(_), {
                type: "button",
                class: "work-reorder-handle work-icon-button",
                "aria-label": "Drag " + s(He)(E) + " or use the arrow keys to reorder",
                onKeydown: [
                  ze(Ee((h) => Y(X, -1), ["prevent"]), ["up"]),
                  ze(Ee((h) => Y(X, 1), ["prevent"]), ["down"])
                ],
                severity: "secondary",
                text: "",
                size: "small"
              }, {
                default: q(() => [
                  y(s(pe), {
                    icon: "tabler:grip-vertical",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["aria-label", "onKeydown"])
            ]),
            flags: q(() => [
              E.track ? (n(), K(s(tt), {
                key: 0,
                class: "kx-tag-sm",
                severity: "secondary",
                value: "Tracked"
              })) : S("", !0),
              E.intervals ? (n(), K(s(tt), {
                key: 1,
                class: "kx-tag-sm",
                severity: "secondary",
                value: "Intervals"
              })) : S("", !0)
            ]),
            usage: q(() => [
              r("span", ir, I(v(E.code).length ? v(E.code).join(", ") : "Unused"), 1)
            ]),
            actions: q(() => [
              y(s(_), {
                "aria-label": "Move " + s(He)(E) + " earlier",
                severity: "secondary",
                disabled: X === 0,
                onClick: (h) => Y(X, -1),
                text: "",
                size: "small"
              }, {
                default: q(() => [
                  y(s(pe), {
                    icon: "tabler:arrow-up",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["aria-label", "disabled", "onClick"]),
              y(s(_), {
                "aria-label": "Move " + s(He)(E) + " later",
                severity: "secondary",
                disabled: X === o.value.length - 1,
                onClick: (h) => Y(X, 1),
                text: "",
                size: "small"
              }, {
                default: q(() => [
                  y(s(pe), {
                    icon: "tabler:arrow-down",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["aria-label", "disabled", "onClick"])
            ]),
            default: q(() => [
              p.value[E.code] ? (n(), b("p", nr, I(p.value[E.code]), 1)) : S("", !0),
              (n(!0), b(ee, null, ue(e.issues?.filter((h) => h.code === E.code) ?? [], (h) => (n(), b("p", {
                key: h.what,
                class: "work-error work-small",
                role: "alert"
              }, I(s(Ja)(h)), 1))), 128)),
              r("div", sr, [
                r("label", rr, [
                  M[5] || (M[5] = j("Title", -1)),
                  y(s(Se), {
                    modelValue: E.title,
                    "onUpdate:modelValue": (h) => E.title = h,
                    "aria-label": "Field title",
                    maxlength: "255",
                    placeholder: s(He)(E)
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder"])
                ]),
                r("label", dr, [
                  M[6] || (M[6] = j("Kind", -1)),
                  y(s(fe), {
                    "aria-label": "Kind",
                    "model-value": z(E),
                    "onUpdate:modelValue": (h) => be(E, h),
                    appendTo: "self",
                    options: N.value,
                    optionLabel: "label",
                    optionValue: "value"
                  }, null, 8, ["model-value", "onUpdate:modelValue", "options"])
                ]),
                r("label", ur, [
                  M[7] || (M[7] = j("Values allowed", -1)),
                  y(s(fe), {
                    "aria-label": "Values allowed",
                    "model-value": E.cardinality ?? "one",
                    "onUpdate:modelValue": (h) => E.cardinality = h,
                    appendTo: "self",
                    options: [{ label: "One value", value: "one" }, { label: "Multiple unique values", value: "set" }, { label: "Ordered values", value: "list" }],
                    optionLabel: "label",
                    optionValue: "value"
                  }, null, 8, ["model-value", "onUpdate:modelValue"])
                ])
              ]),
              E.type === "item" ? (n(), b("label", cr, [
                M[8] || (M[8] = j("Which items can be referenced? ", -1)),
                y(s(fe), {
                  "model-value": E.config?.item_type ?? "",
                  "aria-label": "Reference target",
                  appendTo: "self",
                  optionLabel: "label",
                  optionValue: "value",
                  options: [{ value: "", label: "Any item type" }, ...m.value],
                  "onUpdate:modelValue": (h) => U(E, h)
                }, null, 8, ["model-value", "options", "onUpdate:modelValue"]),
                M[9] || (M[9] = r("span", { class: "work-muted work-small" }, "A reference stores the selected item as a value. To show a named relationship on both items, use Links.", -1))
              ])) : S("", !0),
              le(E) ? (n(), K(Do, {
                key: E.type,
                schema: le(E),
                "model-value": E.config ?? F,
                "onUpdate:modelValue": (h) => E.config = h,
                onValidity: (h) => l("validity", "config-" + X, h)
              }, null, 8, ["schema", "model-value", "onUpdate:modelValue", "onValidity"])) : S("", !0),
              E.type === "option" ? (n(), K(er, {
                key: 3,
                field: E,
                onValidity: M[3] || (M[3] = (h, A) => l("validity", A, h))
              }, null, 8, ["field"])) : S("", !0),
              E.type === "formula" || E.type === "rollup" ? (n(), b("label", vr, [
                M[10] || (M[10] = j("Result type", -1)),
                y(s(fe), {
                  "model-value": E.form,
                  "onUpdate:modelValue": (h) => te(E, h),
                  "aria-label": "Result type",
                  options: s(k).slice(0, 8),
                  optionLabel: "label",
                  optionValue: "value",
                  appendTo: "self"
                }, null, 8, ["model-value", "onUpdate:modelValue", "options"])
              ])) : S("", !0),
              E.type === "formula" ? (n(), b("label", mr, [
                M[11] || (M[11] = j("Expression", -1)),
                y(s(Se), {
                  modelValue: E.expression,
                  "onUpdate:modelValue": (h) => E.expression = h,
                  "aria-label": "Expression"
                }, null, 8, ["modelValue", "onUpdate:modelValue"])
              ])) : S("", !0),
              E.type === "rollup" ? (n(), b(ee, { key: 6 }, [
                r("label", fr, [
                  M[12] || (M[12] = j("Of", -1)),
                  y(s(Se), {
                    modelValue: E.of,
                    "onUpdate:modelValue": (h) => E.of = h,
                    "aria-label": "Related items"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                r("label", pr, [
                  M[13] || (M[13] = j("Function", -1)),
                  y(s(Se), {
                    modelValue: E.fn,
                    "onUpdate:modelValue": (h) => E.fn = h,
                    "aria-label": "Calculation"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                r("label", br, [
                  M[14] || (M[14] = j("Field", -1)),
                  y(s(Se), {
                    modelValue: E.field,
                    "onUpdate:modelValue": (h) => E.field = h,
                    "aria-label": "Calculated field"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                r("label", hr, [
                  M[15] || (M[15] = j("Order by", -1)),
                  y(s(fe), {
                    "model-value": E.by,
                    "aria-label": "Rollup order",
                    options: ["rank", "time"],
                    showClear: "",
                    appendTo: "self",
                    "onUpdate:modelValue": (h) => E.by = h || void 0
                  }, null, 8, ["model-value", "onUpdate:modelValue"])
                ]),
                y(Fl, {
                  modelValue: E.where,
                  "onUpdate:modelValue": (h) => E.where = h,
                  draft: e.draft,
                  "board-id": e.boardId,
                  label: "Include related items when",
                  onValidity: (h) => l("validity", "rollup-" + X, h)
                }, null, 8, ["modelValue", "onUpdate:modelValue", "draft", "board-id", "onValidity"])
              ], 64)) : S("", !0),
              y(Ne, {
                class: "work-disclosure",
                label: "Advanced field settings"
              }, {
                default: q(() => [
                  r("div", gr, [
                    r("label", yr, [
                      M[16] || (M[16] = j("Field identifier for integrations", -1)),
                      y(s(Se), {
                        value: E.code,
                        "aria-label": "Field code",
                        required: "",
                        pattern: "[a-z][a-z0-9_]*",
                        onInput: (h) => P(E, h.target)
                      }, null, 8, ["value", "onInput"])
                    ]),
                    r("label", kr, [
                      M[17] || (M[17] = j("Allow filters to use", -1)),
                      y(s(fe), {
                        "aria-label": "Allow filters to use",
                        "model-value": E.index ?? "none",
                        "onUpdate:modelValue": (h) => E.index = h,
                        appendTo: "self",
                        options: Z(E),
                        optionLabel: "label",
                        optionValue: "value"
                      }, null, 8, ["model-value", "onUpdate:modelValue", "options"])
                    ]),
                    r("section", wr, [
                      M[20] || (M[20] = r("h4", { class: "work-group-title" }, "History", -1)),
                      r("div", Vr, [
                        r("div", $r, [
                          M[18] || (M[18] = r("div", { class: "work-row-main" }, [
                            r("strong", null, "Track changes"),
                            r("p", { class: "work-muted work-small" }, "Record each value change in the item history.")
                          ], -1)),
                          y(s(et), {
                            modelValue: E.track,
                            "onUpdate:modelValue": (h) => E.track = h,
                            "aria-label": "Track changes"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        r("div", xr, [
                          M[19] || (M[19] = r("div", { class: "work-row-main" }, [
                            r("strong", null, "Track intervals"),
                            r("p", { class: "work-muted work-small" }, "Measure how long each value stays in effect.")
                          ], -1)),
                          y(s(et), {
                            modelValue: E.intervals,
                            "onUpdate:modelValue": (h) => E.intervals = h,
                            "aria-label": "Track intervals"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ])
                      ])
                    ]),
                    !le(E) && de(E) ? (n(), K(Et, {
                      key: 0,
                      label: "Field configuration",
                      "model-value": E.config,
                      shape: "object",
                      "onUpdate:modelValue": (h) => E.config = h,
                      onValidity: (h) => l("validity", "config-" + X, h)
                    }, null, 8, ["model-value", "onUpdate:modelValue", "onValidity"])) : S("", !0),
                    r("section", Cr, [
                      M[21] || (M[21] = r("h4", { class: "work-group-title" }, "Access", -1)),
                      (n(), b(ee, null, ue(["read", "write"], (h) => y(No, {
                        "board-id": e.boardId,
                        key: h,
                        label: h === "read" ? "Who can read" : "Who can edit",
                        "model-value": E.access?.[h],
                        "onUpdate:modelValue": (A) => E.access = { ...E.access, [h]: A },
                        onValidity: (A) => l("validity", "access-" + X + h, A)
                      }, null, 8, ["board-id", "label", "model-value", "onUpdate:modelValue", "onValidity"])), 64))
                    ]),
                    y(s(_), {
                      label: "Remove field",
                      severity: "danger",
                      text: "",
                      disabled: !!c.value,
                      onClick: (h) => g(E)
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
}), Tr = {
  class: "work-stack",
  "aria-label": "Item types editor"
}, Ir = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, Dr = { class: "work-definition-meta" }, Ur = { class: "work-settings-grid" }, Er = { class: "work-stack work-tight" }, Ar = { class: "work-stack work-tight" }, Or = { class: "work-stack" }, Pr = { class: "work-stack work-tight" }, Rr = {
  key: 0,
  class: "work-row work-wrap"
}, Nr = { class: "work-stack work-tight" }, Mr = {
  key: 1,
  class: "work-stack work-tight work-small"
}, Fr = {
  key: 0,
  class: "kx-empty"
}, Lr = /* @__PURE__ */ Ve({
  __name: "TypesEditor",
  props: {
    draft: {},
    guardRemoval: { type: Function },
    issues: {}
  },
  setup(e) {
    const a = e, t = W(() => a.draft.item_types ?? []), l = B(""), o = B("");
    function u(v) {
      const g = v.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, ""), k = /^[a-z]/.test(g) ? g : "type_" + (g || "new");
      let T = k.slice(0, 40), $ = 2;
      for (; t.value.some((C) => C.id === T); ) {
        const C = "_" + $++;
        T = k.slice(0, 40 - C.length) + C;
      }
      return T;
    }
    function f(v) {
      (a.draft.item_types ??= []).push({ id: u(v), title: v, process: a.draft.processes?.[0]?.id ?? "", fields: [] });
    }
    function m(v, g) {
      const k = v.id;
      v.id = g;
      for (const T of t.value) T.parent_types && (T.parent_types = T.parent_types.map(($) => $ === k ? g : $));
    }
    function d(v, g) {
      v.fields = g, v.inherit && (v.inherit = v.inherit.filter((k) => g.includes(k)));
    }
    function i(v) {
      return (v.parent_types ?? []).filter((g) => typeof g == "string");
    }
    function c(v, g, k) {
      v.parent_types = k && g.length ? [...g, !1] : g;
    }
    function p(v) {
      return t.value.filter((g) => g.id !== v.id && g.parent_types?.includes(v.id)).map((g) => g.title || Oe(g.id));
    }
    async function w(v) {
      if (!o.value) {
        if (p(v).length) {
          l.value = `${v.title || Oe(v.id)} is a parent type for ${p(v).join(", ")}. Remove those parent selections first.`;
          return;
        }
        o.value = v.id, l.value = "";
        try {
          const g = await a.guardRemoval?.("item_types", v.id);
          g ? l.value = g : Ta(a.draft, "item_types", v.id);
        } finally {
          o.value = "";
        }
      }
    }
    return (v, g) => (n(), b("section", Tr, [
      l.value ? (n(), b("p", Ir, I(l.value), 1)) : S("", !0),
      y(Qa, {
        columns: "types",
        count: t.value.length
      }, {
        default: q(() => [
          (n(!0), b(ee, null, ue(t.value, (k, T) => (n(), K(Za, {
            title: k.title || s(Oe)(k.id),
            "kind-label": "Workflow",
            kind: e.draft.processes?.find(($) => $.id === k.process)?.name || s(Oe)(k.process),
            key: T,
            class: "work-type-card"
          }, {
            usage: q(() => [
              r("span", Dr, [
                y(s(tt), {
                  class: "kx-tag-sm",
                  severity: "secondary"
                }, {
                  default: q(() => [
                    j(I(k.fields.length) + " " + I(k.fields.length === 1 ? "field" : "fields"), 1)
                  ]),
                  _: 2
                }, 1024),
                p(k).length ? (n(), K(s(tt), {
                  key: 0,
                  class: "kx-tag-sm",
                  severity: "secondary"
                }, {
                  default: q(() => [
                    j("Parent of " + I(p(k).join(", ")), 1)
                  ]),
                  _: 2
                }, 1024)) : S("", !0)
              ])
            ]),
            default: q(() => [
              (n(!0), b(ee, null, ue(e.issues?.filter(($) => $.code === "item_type " + k.id) ?? [], ($) => (n(), b("p", {
                key: $.what,
                class: "work-error work-small",
                role: "alert"
              }, I(s(Ja)($)), 1))), 128)),
              r("div", Ur, [
                r("label", Er, [
                  g[0] || (g[0] = j("Title", -1)),
                  y(s(Se), {
                    modelValue: k.title,
                    "onUpdate:modelValue": ($) => k.title = $,
                    placeholder: s(Oe)(k.id)
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder"])
                ]),
                r("label", Ar, [
                  g[1] || (g[1] = j("Workflow", -1)),
                  y(s(fe), {
                    modelValue: k.process,
                    "onUpdate:modelValue": ($) => k.process = $,
                    "aria-label": "Workflow",
                    required: "",
                    appendTo: "self",
                    optionLabel: "label",
                    optionValue: "value",
                    optionDisabled: "disabled",
                    options: [...(e.draft.processes ?? []).map(($) => ({ label: $.name || s(Oe)($.id), value: $.id, disabled: !1 }))]
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                ])
              ]),
              y(vt, {
                label: "Fields",
                options: (e.draft.fields ?? []).map(($) => ({ value: $.code, label: s(He)($) })),
                "model-value": k.fields,
                "onUpdate:modelValue": ($) => d(k, $)
              }, null, 8, ["options", "model-value", "onUpdate:modelValue"]),
              y(Ne, {
                class: "work-disclosure",
                label: "Advanced item type settings"
              }, {
                default: q(() => [
                  r("div", Or, [
                    r("label", Pr, [
                      g[2] || (g[2] = j("Identifier", -1)),
                      y(s(Se), {
                        value: k.id,
                        onChange: ($) => m(k, $.target.value),
                        required: "",
                        pattern: "[a-z][a-z0-9_]*"
                      }, null, 8, ["value", "onChange"])
                    ]),
                    g[6] || (g[6] = j()),
                    y(vt, {
                      label: "Parent types",
                      options: t.value.map(($) => ({ value: $.id, label: $.title || s(Oe)($.id) })),
                      "model-value": i(k),
                      "onUpdate:modelValue": ($) => c(k, $, !!k.parent_types?.includes(!1))
                    }, null, 8, ["options", "model-value", "onUpdate:modelValue"]),
                    i(k).length ? (n(), b("label", Rr, [
                      y(s(et), {
                        "model-value": !!k.parent_types?.includes(!1),
                        "aria-label": "Allow top-level items",
                        "onUpdate:modelValue": ($) => c(k, i(k), $)
                      }, null, 8, ["model-value", "onUpdate:modelValue"]),
                      g[3] || (g[3] = j("Allow top-level items", -1))
                    ])) : S("", !0),
                    r("div", Nr, [
                      y(vt, {
                        label: "Inherit from parent",
                        options: k.fields.map(($) => ({ value: $, label: s(He)(e.draft.fields?.find((C) => C.code === $) ?? { code: $ }) })),
                        modelValue: k.inherit,
                        "onUpdate:modelValue": ($) => k.inherit = $
                      }, null, 8, ["options", "modelValue", "onUpdate:modelValue"]),
                      g[4] || (g[4] = r("p", { class: "work-muted work-small" }, "These fields resolve from the parent when this item has no own value.", -1))
                    ]),
                    i(k).length ? (n(), b("label", Mr, [
                      g[5] || (g[5] = j("When the parent moves", -1)),
                      y(s(fe), {
                        modelValue: k.move_children,
                        "onUpdate:modelValue": ($) => k.move_children = $,
                        "aria-label": "When the parent moves",
                        appendTo: "self",
                        optionLabel: "label",
                        optionValue: "value",
                        optionDisabled: "disabled",
                        options: [{ label: "Default", value: void 0, disabled: !1 }, { label: "Move children", value: "move", disabled: !1 }, { label: "Refuse while children exist", value: "refuse", disabled: !1 }]
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ])) : S("", !0),
                    y(s(_), {
                      label: "Remove type",
                      severity: "danger",
                      text: "",
                      disabled: !!o.value,
                      onClick: ($) => w(k)
                    }, null, 8, ["disabled", "onClick"])
                  ])
                ]),
                _: 2
              }, 1024)
            ]),
            _: 2
          }, 1032, ["title", "kind"]))), 128)),
          t.value.length ? S("", !0) : (n(), b("p", Fr, "Add a type for the work people create, such as a delivery task or customer request.")),
          y(xa, {
            action: "Add item type",
            label: "Item type name",
            onAdd: f
          })
        ]),
        _: 1
      }, 8, ["count"])
    ]));
  }
}), Br = ".work-process-canvas>svg{height:480px;width:100%}.work-process-canvas:focus-visible{outline:var(--p-focus-ring-width) var(--p-focus-ring-style) var(--p-focus-ring-color);outline-offset:var(--p-focus-ring-offset)}.work-state-card{fill:var(--p-content-background);stroke:var(--p-content-border-color);stroke-width:1.5}.work-graph-node.work-selected .work-state-card{stroke:var(--p-primary-color);stroke-width:2.5;fill:color-mix(in srgb,var(--p-primary-color) 6%,var(--p-content-background))}.work-graph-node:focus-visible .work-state-card{stroke:var(--p-focus-ring-color);stroke-width:var(--p-focus-ring-width)}.work-process-canvas .work-edge-label{font-size:12px;fill:var(--p-text-color)}.work-process-canvas .work-edge-label-bg{fill:var(--p-content-background);stroke:var(--p-content-border-color);stroke-width:1}.work-edge-line{stroke:var(--p-primary-color);stroke-width:1.5}.work-edge-return .work-edge-line{stroke:var(--p-text-muted-color);stroke-dasharray:5 4}.work-graph-arrow{fill:context-stroke}.work-lane-line{fill:none;stroke:var(--p-text-muted-color);stroke-width:1.5;stroke-dasharray:2 4}.work-node-connector{fill:var(--p-content-background);stroke:var(--p-primary-color);stroke-width:1.5}.work-node-connector:hover,.work-node-connector:focus-visible,.work-node-connector[aria-pressed=true]{fill:var(--p-primary-color)}.work-any-transition:focus-visible text,.work-any-transition[aria-pressed=true] text{fill:var(--p-primary-color);text-decoration:underline}.work-process-legend{position:static;flex-wrap:wrap;padding:10px 16px;border-top:1px solid var(--p-content-border-color);background:var(--p-content-background)}@media(max-width:700px){.work-process-canvas>svg{height:420px}}.work-process-more{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:8px;padding:8px 16px;border-top:1px solid var(--p-content-border-color);background:var(--p-content-background);color:var(--p-text-muted-color);font-size:12px}.work-process-canvas .work-graph-edge.work-selected .work-edge-label-bg{fill:var(--p-primary-color);stroke:var(--p-primary-color)}.work-process-canvas .work-graph-edge.work-selected .work-edge-label{fill:var(--p-primary-contrast-color)}", po = /* @__PURE__ */ new WeakSet();
function zr(e) {
  const a = e.getRootNode();
  if (a instanceof ShadowRoot && !po.has(a)) {
    const t = e.ownerDocument.createElement("style");
    t.textContent = Br, a.append(t), po.add(a);
  }
}
const Qo = 0.8;
function jr(e, a, t) {
  const l = Math.min(1, a.width / e.width, a.height / e.height);
  if (l >= Qo) return { zoom: l, pan: { x: (e.width - a.width / l) / 2, y: (e.height - a.height / l) / 2 } };
  const o = e.nodes.find((f) => f.state.id === t) ?? e.nodes[0], u = Math.min(1, a.width / ((o?.width ?? 190) + 64));
  return { zoom: u, pan: o ? { x: e.direction === "TB" ? o.x - a.width / u / 2 : o.x - o.width / 2 - 32, y: e.direction === "TB" ? o.y - o.height / 2 - 32 : o.y - a.height / u / 2 } : { x: 0, y: 0 } };
}
const Wr = ["onKeydown"], qr = {
  key: 0,
  class: "work-process-instruction",
  role: "status"
}, Gr = ["viewBox"], Kr = ["id"], Hr = ["d", "marker-end"], Yr = ["aria-label", "aria-pressed", "aria-keyshortcuts", "onKeydown", "onFocus", "onClick"], Xr = ["d"], Jr = ["d", "marker-end"], Zr = ["x", "y", "width", "height"], Qr = ["x", "y"], _r = ["x", "dy"], ed = ["aria-label", "aria-pressed", "onClick", "onKeydown", "onFocus", "onPointerup"], td = ["x", "y", "width", "height"], ad = ["cx", "cy"], ld = ["x", "y"], od = ["x", "dy"], id = ["x", "y"], nd = ["x", "dy"], sd = {
  key: 0,
  class: "work-limit-text"
}, rd = ["aria-label", "aria-pressed", "aria-keyshortcuts", "onFocus", "onKeydown", "onClick"], dd = ["x", "y"], ud = ["x", "dy"], cd = ["cx", "cy", "aria-label", "aria-pressed", "onFocus", "onPointerdown", "onClick", "onKeydown"], vd = ["d"], md = {
  key: 1,
  class: "work-process-more",
  role: "status"
}, fd = { class: "work-process-legend" }, pd = /* @__PURE__ */ Ve({
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
    const l = e, o = t, u = zt().replace(/:/g, "_"), f = B(""), m = B(), d = B();
    let i;
    const c = B(900), p = B(!1), w = W(() => c.value < 700 ? 420 : 480), v = W(() => Ki(l.process, l.draft, {
      width: c.value,
      height: w.value,
      direction: l.fitOnOpen ? "TB" : void 0
    })), g = B(1), k = B({ x: 0, y: 0 }), T = B({ x: 0, y: 0 }), $ = W(() => {
      const V = Math.min(1, c.value / v.value.width);
      return l.fitOnOpen ? Math.max(Qo, V) : V;
    }), C = W(() => ({
      width: c.value,
      height: p.value ? Math.max(w.value, Math.ceil(v.value.height * $.value)) : w.value
    })), N = W(() => v.value.nodes.filter((V) => V.x - V.width / 2 >= k.value.x && V.x + V.width / 2 <= k.value.x + C.value.width / g.value && V.y - V.height / 2 >= k.value.y && V.y + V.height / 2 <= k.value.y + C.value.height / g.value).length);
    function F() {
      p.value = !1;
      const V = jr(v.value, C.value, l.process.initial);
      g.value = V.zoom, k.value = V.pan;
    }
    const z = W(() => `${k.value.x} ${k.value.y} ${C.value.width / g.value} ${C.value.height / g.value}`), ie = W(() => v.value.nodes.find((V) => V.state.id === f.value));
    function le() {
      p.value = !0, g.value = $.value;
      const V = C.value.width / g.value, R = v.value.nodes.find((D) => D.state.id === l.process.initial);
      k.value = {
        x: v.value.width > V && R ? R.x - V / 2 : (v.value.width - V) / 2,
        y: 0
      };
    }
    function de(V) {
      l.fitOnOpen && (p.value = !1);
      const R = Math.max(0.02, Math.min(3, g.value * V)), D = 1 / g.value - 1 / R;
      k.value = { x: k.value.x + C.value.width * D / 2, y: k.value.y + C.value.height * D / 2 }, g.value = R;
    }
    function Z(V) {
      const R = C.value.width / g.value, D = C.value.height / g.value;
      (V.x - V.width / 2 < k.value.x || V.x + V.width / 2 > k.value.x + R || V.y - V.height / 2 < k.value.y || V.y + V.height / 2 > k.value.y + D) && (k.value = { x: V.x - R / 2, y: V.y - D / 2 });
    }
    function ve() {
      const V = v.value.nodes.find((R) => R.state === l.selectedState) ?? v.value.edges.find((R) => R.transition === l.selectedTransition);
      if (!V) {
        l.fitOnOpen && p.value && le();
        return;
      }
      Z(V);
    }
    Ie([v, () => l.selectedState, () => l.selectedTransition], ve, { flush: "post" });
    function be() {
      l.fitOnOpen ? le() : F();
    }
    Ie(() => l.process.id, () => {
      x(), be();
    }, { flush: "post" });
    function te(V) {
      if (V.target !== m.value) return;
      (V.key === "+" || V.key === "=") && (V.preventDefault(), de(1.2)), V.key === "-" && (V.preventDefault(), de(1 / 1.2)), V.key === "0" && (V.preventDefault(), le());
      const R = 60 / g.value;
      V.key.startsWith("Arrow") && (V.preventDefault(), k.value = { x: k.value.x + (V.key === "ArrowRight" ? R : V.key === "ArrowLeft" ? -R : 0), y: k.value.y + (V.key === "ArrowDown" ? R : V.key === "ArrowUp" ? -R : 0) });
    }
    function U(V, R) {
      const D = R.currentTarget;
      if (!f.value) o("state", V, D);
      else if (f.value !== V.id) {
        const ne = f.value;
        f.value = "", o("connect", ne, V.id, D);
      }
    }
    function Y(V) {
      f.value = V.state.id, T.value = { x: v.value.direction === "TB" ? V.x : V.x + V.width / 2, y: v.value.direction === "TB" ? V.y + V.height / 2 : V.y };
    }
    function P(V, R) {
      if (V.pointerType === "touch" || V.button !== 0) return;
      i = V.pointerId, Y(R);
      const D = V.currentTarget;
      D.hasPointerCapture?.(V.pointerId) && D.releasePointerCapture(V.pointerId);
    }
    function me(V, R) {
      i === V.pointerId && (i = void 0, !(!f.value || f.value === R.id) && U(R, V));
    }
    function O(V, R) {
      if ((V.key === "Enter" || V.key === " ") && (V.preventDefault(), U(R, V)), ["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp"].includes(V.key)) {
        V.preventDefault();
        const D = Array.from(d.value?.querySelectorAll(".work-graph-node") ?? []), ne = v.value.nodes.findIndex((we) => we.state === R), ce = ["ArrowRight", "ArrowDown"].includes(V.key) ? 1 : -1;
        D[(ne + ce + D.length) % D.length]?.focus();
      }
    }
    function Q(V, R) {
      l.selectedTransition === R && o("removeTransition", V);
    }
    function x() {
      f.value = "", i = void 0, E.clear(), X = 0;
    }
    function M() {
      x(), o("clear");
    }
    const E = /* @__PURE__ */ new Map();
    let X = 0;
    function h(V) {
      if (!V.target.closest('[role="button"]') && (E.set(V.pointerId, { x: V.clientX, y: V.clientY }), m.value?.setPointerCapture?.(V.pointerId), E.size === 2)) {
        const [R, D] = [...E.values()];
        X = Math.hypot(R.x - D.x, R.y - D.y);
      }
    }
    function A(V) {
      const R = d.value?.getBoundingClientRect();
      if (!R?.width) return;
      if (i === V.pointerId && f.value) {
        T.value = { x: k.value.x + (V.clientX - R.left) * C.value.width / g.value / R.width, y: k.value.y + (V.clientY - R.top) * C.value.height / g.value / R.height };
        return;
      }
      const D = E.get(V.pointerId);
      if (D)
        if (E.set(V.pointerId, { x: V.clientX, y: V.clientY }), E.size === 2) {
          const [ne, ce] = [...E.values()], we = Math.hypot(ne.x - ce.x, ne.y - ce.y);
          X && de(we / X), X = we;
        } else k.value = { x: k.value.x - (V.clientX - D.x) * C.value.width / g.value / R.width, y: k.value.y - (V.clientY - D.y) * C.value.height / g.value / R.height };
    }
    function se(V) {
      i === V.pointerId && (f.value = "", i = void 0);
    }
    function re(V) {
      E.delete(V.pointerId), X = 0, se(V);
    }
    function $e(V) {
      V.ctrlKey && (V.preventDefault(), de(Math.exp(-V.deltaY * 0.01)));
    }
    let H;
    Sa(() => {
      if (m.value && zr(m.value), typeof ResizeObserver < "u" && d.value) {
        let V = !0;
        H = new ResizeObserver(() => {
          const R = d.value?.getBoundingClientRect();
          if (!R?.width || !R.height) return;
          const D = C.value.width;
          c.value = R.width, (V || Math.abs(R.width - D) > 1) && (V ? be() : p.value ? le() : F(), V = !1), ve();
        }), H.observe(d.value);
      }
    }), Vt(() => H?.disconnect()), a({ fit: le, focus: () => m.value?.focus(), zoomIn: () => de(1.2), zoomOut: () => de(1 / 1.2) });
    function L(V) {
      return V.category === "completed" ? "check" : V.category === "canceled" ? "x" : V.id === l.process.initial ? "arrow-bar-to-right" : { gate: "shield-check", automated: "bolt", parallel: "arrows-split" }[V.kind ?? ""] ?? "user";
    }
    return (V, R) => (n(), b("section", {
      ref_key: "canvas",
      ref: m,
      class: ct(["work-process-canvas", { "work-process-scrollable": e.fitOnOpen && p.value }]),
      "aria-label": "Process map",
      tabindex: "0",
      onKeydown: [
        te,
        ze(Ee(M, ["stop"]), ["esc"])
      ],
      onPointerdown: h,
      onPointermove: A,
      onPointerup: re,
      onPointerleave: se,
      onPointercancel: x,
      onWheel: $e
    }, [
      f.value ? (n(), b("p", qr, "Choose the next stop. Escape cancels.")) : S("", !0),
      (n(), b("svg", {
        ref_key: "svg",
        ref: d,
        style: gi({ height: C.value.height + "px" }),
        viewBox: z.value,
        role: "group",
        "aria-label": "States and transitions"
      }, [
        r("defs", null, [
          r("marker", {
            id: s(u) + "-arrow",
            viewBox: "0 0 8 8",
            refX: "7",
            refY: "4",
            markerWidth: "6",
            markerHeight: "6",
            orient: "auto"
          }, [...R[1] || (R[1] = [
            r("path", {
              d: "M0 0 L8 4 L0 8 z",
              class: "work-graph-arrow"
            }, null, -1)
          ])], 8, Kr)
        ]),
        (n(!0), b(ee, null, ue(v.value.parallels, (D) => (n(), b("path", {
          key: D.key,
          d: D.path,
          class: "work-lane-line",
          "marker-end": `url(#${s(u)}-arrow)`
        }, [
          r("title", null, "Parallel lane from " + I(s(ke)(D.state)), 1)
        ], 8, Hr))), 128)),
        (n(!0), b(ee, null, ue(v.value.edges, (D) => (n(), b("g", {
          key: D.key,
          class: ct(["work-graph-edge", ["work-edge-" + D.type, { "work-selected": e.selectedTransition === D.transition }]]),
          role: "button",
          tabindex: "0",
          "aria-label": "Edit transition " + s(je)(D.transition),
          "aria-pressed": e.selectedTransition === D.transition,
          "aria-keyshortcuts": e.selectedTransition === D.transition ? "Delete Backspace" : void 0,
          onKeydown: [
            ze((ne) => Q(ne, D.transition), ["delete"]),
            ze((ne) => Q(ne, D.transition), ["backspace"]),
            ze(Ee((ne) => o("transition", D.transition, ne.currentTarget), ["prevent"]), ["enter"]),
            ze(Ee((ne) => o("transition", D.transition, ne.currentTarget), ["prevent"]), ["space"])
          ],
          onFocus: (ne) => Z(D),
          onClick: (ne) => o("transition", D.transition, ne.currentTarget)
        }, [
          r("path", {
            d: D.path,
            class: "work-edge-hit"
          }, null, 8, Xr),
          r("path", {
            d: D.path,
            class: "work-edge-line",
            "marker-end": `url(#${s(u)}-arrow)`
          }, null, 8, Jr),
          r("rect", {
            x: D.x - D.width / 2,
            y: D.y - D.height / 2,
            width: D.width,
            height: D.height,
            rx: "6",
            class: "work-edge-label-bg"
          }, null, 8, Zr),
          r("text", {
            x: D.x,
            y: D.y - (D.lines.length - 1) * 8 + 4,
            class: "work-edge-label",
            "text-anchor": "middle"
          }, [
            (n(!0), b(ee, null, ue(D.lines, (ne, ce) => (n(), b("tspan", {
              key: ce,
              x: D.x,
              dy: ce ? 16 : 0
            }, I(ne), 9, _r))), 128))
          ], 8, Qr)
        ], 42, Yr))), 128)),
        (n(!0), b(ee, null, ue(v.value.nodes, (D) => (n(), b("g", {
          key: D.state.id,
          class: ct(["work-graph-node", ["work-stop-" + D.state.category, { "work-selected": e.selectedState === D.state }]]),
          role: "button",
          tabindex: "0",
          "aria-label": "Edit state " + s(ke)(D.state),
          "aria-pressed": e.selectedState === D.state,
          onClick: (ne) => U(D.state, ne),
          onKeydown: (ne) => O(ne, D.state),
          onFocus: (ne) => Z(D),
          onPointerup: (ne) => me(ne, D.state)
        }, [
          r("rect", {
            x: D.x - D.width / 2,
            y: D.y - D.height / 2,
            width: D.width,
            height: D.height,
            rx: "10",
            class: "work-state-card"
          }, null, 8, td),
          r("circle", {
            cx: D.x - D.width / 2 + 22,
            cy: D.y - D.height / 2 + 25,
            r: "10",
            class: "work-stop-ring"
          }, null, 8, ad),
          y(s(pe), {
            icon: "tabler:" + L(D.state),
            x: D.x - D.width / 2 + 15,
            y: D.y - D.height / 2 + 18,
            width: "14",
            height: "14",
            class: "work-stop-icon",
            "aria-hidden": "true"
          }, null, 8, ["icon", "x", "y"]),
          r("text", {
            x: D.x - D.width / 2 + 42,
            y: D.y - D.height / 2 + 29,
            class: "work-node-name"
          }, [
            (n(!0), b(ee, null, ue(D.title, (ne, ce) => (n(), b("tspan", {
              key: ce,
              x: D.x - D.width / 2 + 42,
              dy: ce ? 18 : 0
            }, I(ne), 9, od))), 128))
          ], 8, ld),
          r("text", {
            x: D.x - D.width / 2 + 16,
            y: D.y - D.height / 2 + 33 + D.title.length * 18,
            class: "work-node-meta"
          }, [
            (n(!0), b(ee, null, ue(D.caption, (ne, ce) => (n(), b("tspan", {
              key: ce,
              x: D.x - D.width / 2 + 16,
              dy: ce ? 16 : 0
            }, I(ne), 9, nd))), 128)),
            e.draft.policy?.wip?.[D.state.id] ? (n(), b("tspan", sd, " · limit " + I(e.draft.policy.wip[D.state.id].limit), 1)) : S("", !0)
          ], 8, id),
          (n(!0), b(ee, null, ue(D.badges, (ne, ce) => (n(), b("g", {
            key: ne.id,
            class: "work-any-transition",
            role: "button",
            tabindex: "0",
            "aria-label": "Edit transition " + s(je)(ne),
            "aria-pressed": e.selectedTransition === ne,
            "aria-keyshortcuts": e.selectedTransition === ne ? "Delete Backspace" : void 0,
            onFocus: (we) => Z(D),
            onKeydown: [
              ze((we) => Q(we, ne), ["delete"]),
              ze((we) => Q(we, ne), ["backspace"]),
              ze(Ee((we) => o("transition", ne, we.currentTarget), ["stop", "prevent"]), ["enter"]),
              ze(Ee((we) => o("transition", ne, we.currentTarget), ["stop", "prevent"]), ["space"])
            ],
            onClick: Ee((we) => o("transition", ne, we.currentTarget), ["stop"])
          }, [
            r("text", {
              x: D.x - D.width / 2 + 16,
              y: D.y - D.height / 2 + 33 + D.title.length * 18 + D.caption.length * 16 + D.badges.slice(0, ce).reduce((we, De) => we + s(ta)(s(je)(De) + " works from any state").length * 18, 0),
              class: "work-node-meta"
            }, [
              (n(!0), b(ee, null, ue(s(ta)(s(je)(ne) + " works from any state"), (we, De) => (n(), b("tspan", {
                key: De,
                x: D.x - D.width / 2 + 16,
                dy: De ? 18 : 0
              }, I(we), 9, ud))), 128))
            ], 8, dd)
          ], 40, rd))), 128)),
          ["completed", "canceled"].includes(D.state.category) ? S("", !0) : (n(), b("circle", {
            key: 0,
            cx: v.value.direction === "TB" ? D.x : D.x + D.width / 2,
            cy: v.value.direction === "TB" ? D.y + D.height / 2 : D.y,
            r: "9",
            class: "work-node-connector",
            role: "button",
            tabindex: "0",
            "aria-label": "Connect from " + s(ke)(D.state),
            "aria-pressed": f.value === D.state.id,
            onFocus: (ne) => Z(D),
            onPointerdown: Ee((ne) => P(ne, D), ["stop"]),
            onClick: Ee((ne) => Y(D), ["stop"]),
            onKeydown: [
              ze(Ee((ne) => Y(D), ["stop", "prevent"]), ["enter"]),
              ze(Ee((ne) => Y(D), ["stop", "prevent"]), ["space"])
            ]
          }, null, 40, cd))
        ], 42, ed))), 128)),
        ie.value ? (n(), b("path", {
          key: 0,
          d: `M ${v.value.direction === "TB" ? ie.value.x : ie.value.x + ie.value.width / 2} ${v.value.direction === "TB" ? ie.value.y + ie.value.height / 2 : ie.value.y} L ${T.value.x} ${T.value.y}`,
          class: "work-connect-ghost"
        }, null, 8, vd)) : S("", !0)
      ], 12, Gr)),
      N.value < e.process.states.length ? (n(), b("div", md, [
        r("span", null, I(N.value) + " of " + I(e.process.states.length) + " states in view · Pan to see more", 1),
        p.value ? S("", !0) : (n(), K(s(_), {
          key: 0,
          label: "Fit map",
          size: "small",
          text: "",
          onClick: R[0] || (R[0] = (D) => le())
        }))
      ])) : S("", !0),
      r("div", fd, [
        r("span", null, I(e.process.states.length) + " states · " + I(Math.round(g.value * 100)) + "%", 1),
        R[2] || (R[2] = r("span", null, [
          r("i"),
          j("Transition")
        ], -1)),
        R[3] || (R[3] = r("span", null, [
          r("i", { class: "work-return-key" }),
          j("Return / loop")
        ], -1)),
        R[4] || (R[4] = r("span", null, "Drag to pan · Ctrl + scroll to zoom · Fit to reset the view", -1))
      ])
    ], 42, Wr));
  }
}), bd = {
  class: "work-process-list work-stack",
  "aria-label": "Process list"
}, hd = { class: "work-table-scroll" }, gd = {
  class: "work-settings-table work-process-table",
  role: "table",
  "aria-label": "States"
}, yd = { role: "rowgroup" }, kd = ["aria-selected"], wd = { role: "cell" }, Vd = {
  key: 0,
  class: "work-muted work-small"
}, $d = { role: "cell" }, xd = { role: "cell" }, Cd = {
  role: "cell",
  class: "work-process-list-actions"
}, Sd = { class: "work-table-scroll" }, Td = {
  class: "work-settings-table work-process-table",
  role: "table",
  "aria-label": "Transitions"
}, Id = { role: "rowgroup" }, Dd = ["aria-selected"], Ud = { role: "cell" }, Ed = {
  key: 0,
  class: "work-muted"
}, Ad = { role: "cell" }, Od = { role: "cell" }, Pd = {
  role: "cell",
  class: "work-process-list-actions"
}, Rd = /* @__PURE__ */ Ve({
  __name: "ProcessList",
  props: {
    process: {},
    selectedState: {},
    selectedTransition: {},
    counts: {}
  },
  emits: ["state", "transition", "removeState", "removeTransition"],
  setup(e) {
    return (a, t) => (n(), b("section", bd, [
      t[6] || (t[6] = r("h3", null, "States", -1)),
      r("div", hd, [
        r("table", gd, [
          t[2] || (t[2] = r("thead", { role: "rowgroup" }, [
            r("tr", { role: "row" }, [
              r("th", {
                role: "columnheader",
                scope: "col"
              }, "Name"),
              r("th", {
                role: "columnheader",
                scope: "col"
              }, "Phase"),
              r("th", {
                role: "columnheader",
                scope: "col"
              }, "Kind"),
              r("th", {
                role: "columnheader",
                scope: "col"
              }, "Actions")
            ])
          ], -1)),
          r("tbody", yd, [
            (n(!0), b(ee, null, ue(e.process.states, (l) => (n(), b("tr", {
              key: l.id,
              "aria-selected": e.selectedState === l,
              role: "row"
            }, [
              r("td", wd, [
                y(s(Se), {
                  modelValue: l.name,
                  "onUpdate:modelValue": (o) => l.name = o,
                  "aria-label": "Name of " + s(ke)(l)
                }, null, 8, ["modelValue", "onUpdate:modelValue", "aria-label"]),
                e.counts ? (n(), b("p", Vd, I(e.counts[l.id] ?? 0) + " here", 1)) : S("", !0)
              ]),
              r("td", $d, [
                t[0] || (t[0] = r("span", {
                  class: "work-process-cell-label",
                  "aria-hidden": "true"
                }, "Phase", -1)),
                j(I(s(jt)(l.category)), 1)
              ]),
              r("td", xd, [
                t[1] || (t[1] = r("span", {
                  class: "work-process-cell-label",
                  "aria-hidden": "true"
                }, "Kind", -1)),
                y(s(tt), { severity: "secondary" }, {
                  default: q(() => [
                    j(I(s(qa)(l.kind)), 1)
                  ]),
                  _: 2
                }, 1024)
              ]),
              r("td", Cd, [
                y(s(_), {
                  size: "small",
                  text: "",
                  severity: "secondary",
                  "aria-label": "Edit state " + s(ke)(l),
                  onClick: (o) => a.$emit("state", l, o.currentTarget)
                }, {
                  default: q(() => [
                    y(s(pe), { icon: "tabler:pencil" })
                  ]),
                  _: 1
                }, 8, ["aria-label", "onClick"]),
                y(s(_), {
                  size: "small",
                  text: "",
                  severity: "danger",
                  "aria-label": "Remove state " + s(ke)(l),
                  onClick: (o) => a.$emit("removeState", l)
                }, {
                  default: q(() => [
                    y(s(pe), { icon: "tabler:trash" })
                  ]),
                  _: 1
                }, 8, ["aria-label", "onClick"])
              ])
            ], 8, kd))), 128))
          ])
        ])
      ]),
      t[7] || (t[7] = r("h3", null, "Transitions", -1)),
      r("div", Sd, [
        r("table", Td, [
          t[5] || (t[5] = r("thead", { role: "rowgroup" }, [
            r("tr", { role: "row" }, [
              r("th", {
                role: "columnheader",
                scope: "col"
              }, "Name"),
              r("th", {
                role: "columnheader",
                scope: "col"
              }, "From"),
              r("th", {
                role: "columnheader",
                scope: "col"
              }, "To"),
              r("th", {
                role: "columnheader",
                scope: "col"
              }, "Actions")
            ])
          ], -1)),
          r("tbody", Id, [
            (n(!0), b(ee, null, ue(e.process.transitions ?? [], (l) => (n(), b("tr", {
              key: l.id,
              "aria-selected": e.selectedTransition === l,
              role: "row"
            }, [
              r("td", Ud, [
                y(s(Se), {
                  modelValue: l.name,
                  "onUpdate:modelValue": (o) => l.name = o,
                  placeholder: s(je)(l),
                  "aria-label": "Name of " + s(je)(l)
                }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder", "aria-label"]),
                l.when || l.require?.length || l.guards?.length ? (n(), b("p", Ed, "Has requirements")) : S("", !0)
              ]),
              r("td", Ad, [
                t[3] || (t[3] = r("span", {
                  class: "work-process-cell-label",
                  "aria-hidden": "true"
                }, "From", -1)),
                j(" " + I(l.from === "any" ? "Any state" : l.from.map((o) => s(ke)(e.process.states.find((u) => u.id === o))).join(", ")), 1)
              ]),
              r("td", Od, [
                t[4] || (t[4] = r("span", {
                  class: "work-process-cell-label",
                  "aria-hidden": "true"
                }, "To", -1)),
                j(I(s(ke)(e.process.states.find((o) => o.id === l.to))), 1)
              ]),
              r("td", Pd, [
                y(s(_), {
                  size: "small",
                  text: "",
                  severity: "secondary",
                  "aria-label": "Edit transition " + s(je)(l),
                  onClick: (o) => a.$emit("transition", l, o.currentTarget)
                }, {
                  default: q(() => [
                    y(s(pe), { icon: "tabler:pencil" })
                  ]),
                  _: 1
                }, 8, ["aria-label", "onClick"]),
                y(s(_), {
                  size: "small",
                  text: "",
                  severity: "danger",
                  "aria-label": "Remove transition " + s(je)(l),
                  onClick: (o) => a.$emit("removeTransition", l)
                }, {
                  default: q(() => [
                    y(s(pe), { icon: "tabler:trash" })
                  ]),
                  _: 1
                }, 8, ["aria-label", "onClick"])
              ])
            ], 8, Dd))), 128))
          ])
        ])
      ])
    ]));
  }
}), Nd = { class: "work-stack work-transition-settings" }, Md = { class: "work-stack work-tight" }, Fd = { class: "work-row" }, Ld = { key: 0 }, Bd = { class: "work-stack" }, zd = { class: "work-row" }, jd = { class: "work-row" }, Wd = { class: "work-stack work-tight" }, qd = { class: "work-row" }, Gd = { class: "work-stack work-tight" }, Kd = { class: "work-stack work-tight" }, Hd = /* @__PURE__ */ Ve({
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
    function u(f, m) {
      const d = t.transition.set?.[f];
      !d || !t.transition.set || (t.transition.set[f] = { field: d.field, ...m === "clear" ? { clear: !0 } : m === "copy" ? { copy: "" } : { value: "" } });
    }
    return (f, m) => (n(), b("div", Nd, [
      r("label", Md, [
        m[15] || (m[15] = j("To state", -1)),
        y(s(fe), {
          modelValue: e.transition.to,
          "onUpdate:modelValue": m[0] || (m[0] = (d) => e.transition.to = d),
          "aria-label": "To state",
          appendTo: "self",
          optionLabel: "label",
          optionValue: "value",
          options: e.process.states.map((d) => ({ label: s(ke)(d), value: d.id }))
        }, null, 8, ["modelValue", "options"])
      ]),
      r("label", Fd, [
        m[16] || (m[16] = r("span", { class: "work-spacer" }, "Works from any state", -1)),
        y(s(et), {
          "model-value": e.transition.from === "any",
          "aria-label": "Works from any state",
          "onUpdate:modelValue": m[1] || (m[1] = (d) => e.transition.from = d ? "any" : [])
        }, null, 8, ["model-value"])
      ]),
      e.transition.from !== "any" ? (n(), K(vt, {
        key: 0,
        label: "From states",
        options: e.process.states.map((d) => ({ value: d.id, label: s(ke)(d) })),
        modelValue: e.transition.from,
        "onUpdate:modelValue": m[2] || (m[2] = (d) => e.transition.from = d)
      }, null, 8, ["options", "modelValue"])) : S("", !0),
      m[24] || (m[24] = r("h4", { class: "work-process-group" }, "Must be filled", -1)),
      y(vt, {
        label: "Required fields",
        options: e.draft.fields?.map((d) => ({ value: d.code, label: d.title || d.code })) ?? [],
        modelValue: e.transition.require,
        "onUpdate:modelValue": m[3] || (m[3] = (d) => e.transition.require = d)
      }, null, 8, ["options", "modelValue"]),
      m[25] || (m[25] = r("h4", { class: "work-process-group" }, "Only when", -1)),
      y(Fl, {
        label: "Allow this transition when",
        draft: e.draft,
        "board-id": e.boardId,
        "model-value": e.transition.when,
        "onUpdate:modelValue": m[4] || (m[4] = (d) => e.transition.when = d),
        onValidity: m[5] || (m[5] = (d) => l("validity", "when", d))
      }, null, 8, ["draft", "board-id", "model-value"]),
      e.guards?.length || e.transition.guards?.length ? (n(), K(vt, {
        key: 1,
        label: "Installed checks",
        options: [...(e.guards ?? []).map((d) => ({ value: d.id, label: d.title })), ...(e.transition.guards ?? []).filter((d) => !e.guards?.some((i) => i.id === d)).map((d) => ({ value: d, label: e.guards ? "Unavailable check" : "Configured check" }))],
        modelValue: e.transition.guards,
        "onUpdate:modelValue": m[6] || (m[6] = (d) => e.transition.guards = d)
      }, null, 8, ["options", "modelValue"])) : S("", !0),
      (n(!0), b(ee, null, ue(e.guards?.filter((d) => e.transition.guards?.includes(d.id)) ?? [], (d) => (n(), b("p", {
        key: d.id,
        class: "work-muted work-small"
      }, [
        j(I(d.description || d.title + " can stop this transition.") + " ", 1),
        d.reads?.length ? (n(), b("span", Ld, " Checks " + I(d.reads.map((i) => e.draft.fields?.find((c) => c.code === i)?.title || "a configured field").join(", ")) + ".", 1)) : S("", !0)
      ]))), 128)),
      y(Ne, {
        class: "work-disclosure",
        label: "Advanced transition settings"
      }, {
        default: q(() => [
          r("div", Bd, [
            r("label", zd, [
              m[17] || (m[17] = r("span", { class: "work-spacer" }, "Happens automatically", -1)),
              y(s(et), {
                "model-value": e.transition.auto,
                "onUpdate:modelValue": m[7] || (m[7] = (d) => {
                  e.transition.auto = d, d || delete e.transition.default;
                }),
                "aria-label": "Automatic transition"
              }, null, 8, ["model-value"])
            ]),
            r("label", jd, [
              m[18] || (m[18] = r("span", { class: "work-spacer" }, "Default automatic transition", -1)),
              y(s(et), {
                modelValue: e.transition.default,
                "onUpdate:modelValue": m[8] || (m[8] = (d) => e.transition.default = d),
                disabled: !e.transition.auto,
                "aria-label": "Default transition"
              }, null, 8, ["modelValue", "disabled"])
            ]),
            m[23] || (m[23] = r("h4", { class: "work-process-group" }, "Also sets", -1)),
            (n(!0), b(ee, null, ue(e.transition.set ?? [], (d, i) => (n(), b("div", {
              key: i,
              class: "work-process-value work-stack work-tight"
            }, [
              r("label", Wd, [
                m[19] || (m[19] = j("Field", -1)),
                y(s(fe), {
                  modelValue: d.field,
                  "onUpdate:modelValue": (c) => d.field = c,
                  appendTo: "self",
                  optionLabel: "label",
                  optionValue: "value",
                  options: e.draft.fields?.map((c) => ({ value: c.code, label: c.title || c.code })) ?? []
                }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
              ]),
              r("div", qd, [
                y(s(fe), {
                  "model-value": d.clear ? "clear" : d.copy !== void 0 ? "copy" : "value",
                  "aria-label": "Value action",
                  appendTo: "self",
                  options: [
                    { label: "Set value", value: "value" },
                    { label: "Clear value", value: "clear" },
                    { label: "Copy field", value: "copy" }
                  ],
                  optionLabel: "label",
                  optionValue: "value",
                  "onUpdate:modelValue": (c) => u(i, c)
                }, null, 8, ["model-value", "onUpdate:modelValue"]),
                y(s(_), {
                  text: "",
                  severity: "danger",
                  "aria-label": "Remove value " + (i + 1),
                  onClick: (c) => e.transition.set?.splice(i, 1)
                }, {
                  default: q(() => [
                    y(s(pe), { icon: "tabler:trash" })
                  ]),
                  _: 1
                }, 8, ["aria-label", "onClick"])
              ]),
              d.copy !== void 0 ? (n(), K(s(fe), {
                key: 0,
                modelValue: d.copy,
                "onUpdate:modelValue": (c) => d.copy = c,
                "aria-label": "Copy from field",
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                options: e.draft.fields?.map((c) => ({ value: c.code, label: c.title || c.code })) ?? []
              }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])) : d.clear ? S("", !0) : (n(!0), b(ee, { key: 1 }, ue(e.draft.fields?.filter((c) => c.code === d.field) ?? [], (c) => (n(), K(Ro, {
                key: c.code,
                "board-id": e.boardId ?? "",
                field: c,
                modelValue: d.value,
                "onUpdate:modelValue": (p) => d.value = p,
                onValidity: (p) => l("validity", "effect-" + i, p)
              }, null, 8, ["board-id", "field", "modelValue", "onUpdate:modelValue", "onValidity"]))), 128))
            ]))), 128)),
            y(s(_), {
              label: "Add value",
              severity: "secondary",
              outlined: "",
              size: "small",
              onClick: o
            }, {
              icon: q(() => [
                y(s(pe), { icon: "tabler:plus" })
              ]),
              _: 1
            }),
            r("label", Gd, [
              m[20] || (m[20] = j("Offer to people", -1)),
              y(s(fe), {
                "model-value": e.transition.people,
                "aria-label": "Offer to people",
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                options: [{ label: "Work default", value: void 0 }, { label: "Offer explicitly", value: !0 }, { label: "Process engine only", value: !1 }],
                "onUpdate:modelValue": m[9] || (m[9] = (d) => e.transition.people = d)
              }, null, 8, ["model-value"]),
              m[21] || (m[21] = r("span", { class: "work-muted work-small" }, "Work default can hide a stage route from the list while still allowing it by name. Process engine only reserves the route for the engine and board administrators using force.", -1))
            ]),
            r("label", Kd, [
              m[22] || (m[22] = j("Evaluation order", -1)),
              y(s(yt), {
                "model-value": e.transition.order ?? null,
                "aria-label": "Transition order",
                min: 0,
                useGrouping: !1,
                "onUpdate:modelValue": m[10] || (m[10] = (d) => e.transition.order = d ?? void 0)
              }, null, 8, ["model-value"])
            ]),
            y(Et, {
              label: "Set values",
              "model-value": e.transition.set,
              shape: "array",
              "onUpdate:modelValue": m[11] || (m[11] = (d) => e.transition.set = d),
              onValidity: m[12] || (m[12] = (d) => l("validity", "set", d))
            }, null, 8, ["model-value"]),
            y(Et, {
              label: "Guards",
              "model-value": e.transition.guards,
              shape: "array",
              "onUpdate:modelValue": m[13] || (m[13] = (d) => e.transition.guards = d),
              onValidity: m[14] || (m[14] = (d) => l("validity", "guards", d))
            }, null, 8, ["model-value"])
          ])
        ]),
        _: 1
      })
    ]));
  }
}), bo = /* @__PURE__ */ Ve({
  __name: "CapacityControl",
  props: {
    draft: {},
    state: {},
    label: {},
    hard: { type: Boolean }
  },
  setup(e) {
    const a = e, t = W(() => a.draft.policy?.wip?.[a.state]);
    function l(u) {
      if (u === null) {
        a.draft.policy?.wip && delete a.draft.policy.wip[a.state];
        return;
      }
      const f = a.draft.policy ??= {}, m = f.wip ??= {};
      m[a.state] = { ...m[a.state], limit: u };
    }
    function o(u) {
      t.value && (t.value.hard = u);
    }
    return (u, f) => e.hard ? (n(), K(s(et), {
      key: 0,
      "aria-label": e.label,
      disabled: !t.value,
      "model-value": t.value?.hard ?? !1,
      "onUpdate:modelValue": o
    }, null, 8, ["aria-label", "disabled", "model-value"])) : (n(), K(s(yt), {
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
async function $l(e, a) {
  try {
    const { data: t } = await Sl.get(e, a ? { params: a } : void 0);
    if (!t?.success) {
      const l = t?.message || (typeof t?.error == "string" ? t.error : t?.error?.message) || "Could not read published Flow.";
      throw new xl({ message: l, details: t?.details }, "Published Flow");
    }
    return t;
  } catch (t) {
    throw Ii(t, "Published Flow");
  }
}
const ho = (e) => `/api/v1/workflows/${encodeURIComponent(e)}/versions`, Al = {
  title: async (e) => (await $l("/api/v1/workflows/published", { id: e })).item?.title,
  versions: async (e) => (await $l(ho(e))).versions ?? [],
  check: async (e) => {
    if ((await $l(`${ho(e.id)}/${e.version}`)).version?.version !== e.version) throw new Error("The published version is unavailable.");
  }
}, Yd = {
  class: "work-stack work-tight",
  "aria-label": "Stage Flow"
}, Xd = {
  key: 0,
  class: "work-muted work-small"
}, Jd = {
  key: 1,
  class: "kx-err work-alert-actions"
}, Zd = { role: "alert" }, Qd = ["schema", "config", "title"], _d = {
  key: 3,
  class: "kx-err",
  role: "alert"
}, eu = {
  key: 4,
  class: "work-stack work-tight"
}, tu = ["value", "aria-busy", "disabled"], au = {
  value: "",
  disabled: ""
}, lu = ["value"], ou = {
  key: 5,
  class: "work-muted work-small",
  role: "status"
}, iu = /* @__PURE__ */ Ve({
  __name: "StageFlow",
  props: {
    modelValue: {}
  },
  emits: ["update:modelValue", "validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = B(!1), u = B(""), f = B([]), m = B(!1), d = B(""), i = B(!1), c = W(() => u.value || t.modelValue?.id), p = JSON.stringify({ properties: { flow_ref: { title: "Published Flow", picker: "wc-workflow-picker" } } }), w = W(() => JSON.stringify(t.modelValue ? { flow_ref: t.modelValue } : {}));
    let v = 0;
    async function g() {
      o.value = await Ut("wc-workflow-picker");
    }
    g();
    async function k() {
      const N = ++v, F = c.value, z = t.modelValue;
      if (m.value = !!F, d.value = "", f.value = [], !!F)
        try {
          const [ie] = await Promise.all([Al.versions(F), !i.value && z ? Al.check(z) : Promise.resolve()]);
          if (N !== v) return;
          if (f.value = ie.filter((le) => Number.isInteger(le.version) && le.version > 0), !i.value && z && !f.value.some((le) => le.version === z.version)) throw new Error("The published version is unavailable.");
        } catch (ie) {
          N === v && (d.value = nt(ie, "Could not read published Flow."));
        } finally {
          N === v && (m.value = !1);
        }
    }
    Ie([c, () => t.modelValue?.version, i], k, { immediate: !0 }), Ie(i, (N) => l("validity", !N), { immediate: !0 });
    function T(N) {
      const F = N.detail?.flow_ref;
      F?.kind !== "flow" || !F.id || (i.value = !0, u.value = F.id);
    }
    function $(N) {
      !c.value || !f.value.some((F) => F.version === N) || (l("update:modelValue", { kind: "flow", id: c.value, version: N }), i.value = !1, u.value = "");
    }
    function C() {
      l("update:modelValue", void 0), i.value = !1, u.value = "";
    }
    return Vt(() => {
      v++, l("validity", !0);
    }), (N, F) => (n(), b("section", Yd, [
      F[4] || (F[4] = r("h4", { class: "work-field-label" }, "What runs", -1)),
      e.modelValue ? S("", !0) : (n(), b("p", Xd, "No Flow bound. This stage keeps its existing external execution contract.")),
      d.value ? (n(), b("div", Jd, [
        r("p", Zd, [
          j(I(i.value ? "Flow versions unavailable" : "Flow binding unavailable"), 1),
          !i.value && e.modelValue ? (n(), b(ee, { key: 0 }, [
            j(" (v" + I(e.modelValue.version) + ")", 1)
          ], 64)) : S("", !0),
          j(". " + I(d.value), 1)
        ]),
        y(s(_), {
          label: "Reload Flow",
          severity: "secondary",
          text: "",
          onClick: k
        })
      ])) : S("", !0),
      o.value ? (n(), b("wc-workflow-picker", {
        key: 2,
        schema: s(p),
        config: w.value,
        title: e.modelValue?.id,
        onChange: T
      }, null, 40, Qd)) : (n(), b("p", _d, [
        F[2] || (F[2] = j("Published Flow picker unavailable.", -1)),
        y(s(_), {
          label: "Reload Flow picker",
          text: "",
          severity: "secondary",
          onClick: g
        })
      ])),
      c.value ? (n(), b("label", eu, [
        F[3] || (F[3] = j(" Published version ", -1)),
        r("select", {
          class: "p-inputtext work-flow-version",
          value: i.value ? "" : e.modelValue?.version,
          "aria-busy": m.value,
          disabled: m.value || !!d.value,
          onChange: F[0] || (F[0] = (z) => $(Number(z.target.value)))
        }, [
          r("option", au, I(m.value ? "Loading versions…" : "Choose a published version"), 1),
          (n(!0), b(ee, null, ue(f.value, (z) => (n(), b("option", {
            key: z.version,
            value: z.version
          }, "v" + I(z.version), 9, lu))), 128))
        ], 40, tu)
      ])) : S("", !0),
      i.value ? (n(), b("p", ou, "Choose a published version to finish selecting the Flow.")) : S("", !0),
      e.modelValue || i.value ? (n(), K(s(_), {
        key: 6,
        label: i.value ? "Cancel Flow selection" : "Remove Flow binding",
        "aria-label": i.value ? "Cancel Flow selection" : "Remove Flow binding",
        severity: "secondary",
        text: "",
        onClick: F[1] || (F[1] = (z) => i.value ? (i.value = !1, u.value = "") : C())
      }, null, 8, ["label", "aria-label"])) : S("", !0)
    ]));
  }
}), Ol = { seconds: 1, minutes: 60, hours: 3600, days: 86400 };
function ba(e, a) {
  const t = /^P(\d+)W$/.exec(e), l = /^P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+\.?\d*)S)?)?$/.exec(e);
  if (!t && (!l || e === "P" || e.endsWith("T"))) return;
  const o = t ? Number(t[1]) * 604800 : Number(l[1] ?? 0) * 86400 + Number(l[2] ?? 0) * 3600 + Number(l[3] ?? 0) * 60 + Number(l[4] ?? 0);
  if (!Number.isFinite(o) || o <= 0) return;
  const u = a ?? (o % 86400 === 0 ? "days" : o % 3600 === 0 ? "hours" : o < 60 ? "seconds" : "minutes");
  return { amount: o / Ol[u], unit: u };
}
function nu(e, a) {
  if (e == null) return;
  if (!Number.isFinite(e * Ol[a]) || e <= 0) throw new Error("Enter a positive duration.");
  const t = (o) => o.toLocaleString("en-US", { useGrouping: !1, maximumSignificantDigits: 21 });
  if (!Number.isInteger(e)) return `PT${t(e * Ol[a])}S`;
  const l = { seconds: "S", minutes: "M", hours: "H", days: "D" }[a];
  return (a === "days" ? "P" : "PT") + t(e) + l;
}
const su = { class: "work-stack work-tight" }, ru = {
  key: 0,
  class: "work-error",
  role: "alert"
}, Ft = /* @__PURE__ */ Ve({
  __name: "DurationControl",
  props: {
    modelValue: {},
    label: {},
    disabled: { type: Boolean }
  },
  emits: ["update:modelValue", "validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = "duration:" + zt(), u = B(), f = B(""), m = W(() => t.modelValue ? ba(t.modelValue) : void 0), d = W(() => u.value ?? m.value?.unit ?? "days");
    Ie(() => t.modelValue, ($) => {
      f.value = "", l("validity", !$ || !!m.value, o);
    }, { immediate: !0 });
    const i = W(() => t.modelValue ? ba(t.modelValue, d.value)?.amount ?? null : null);
    function c($) {
      try {
        const C = nu($, d.value);
        f.value = "", l("update:modelValue", C), l("validity", !0, o);
      } catch (C) {
        f.value = C.message, l("validity", !1, o);
      }
    }
    let p;
    function w($) {
      $.target instanceof HTMLInputElement && (p = $.target.value);
    }
    function v($) {
      if (p === void 0) return;
      const C = p;
      p = void 0, k($, C);
    }
    function g($) {
      p = void 0;
      const C = $.originalEvent?.target instanceof HTMLInputElement ? $.originalEvent.target.value : $.formattedValue;
      k($.value, C);
    }
    function k($, C) {
      if (C.trim() && (typeof $ != "number" || !Number.isFinite($))) {
        f.value = "Enter a positive duration.", l("validity", !1, o);
        return;
      }
      u.value = d.value, c(typeof $ == "number" ? $ : null);
    }
    function T($) {
      const C = i.value;
      u.value = $, !(t.modelValue && !m.value) && c(C);
    }
    return Vt(() => l("validity", !0, o)), ($, C) => (n(), b("label", su, [
      j(I(e.label), 1),
      r("span", {
        class: "work-duration-control",
        style: { "max-width": "360px" },
        onInputCapture: w
      }, [
        y(s(yt), {
          "model-value": i.value,
          "aria-label": e.label,
          min: 0,
          "aria-invalid": !!f.value || !!e.modelValue && !s(ba)(e.modelValue),
          disabled: e.disabled,
          useGrouping: !1,
          "max-fraction-digits": d.value === "seconds" ? 20 : 3,
          onInput: g,
          "onUpdate:modelValue": v
        }, null, 8, ["model-value", "aria-label", "aria-invalid", "disabled", "max-fraction-digits"]),
        y(s(fe), {
          "model-value": d.value,
          "aria-label": e.label + " unit",
          disabled: e.disabled,
          options: [{ label: "Seconds", value: "seconds" }, { label: "Minutes", value: "minutes" }, { label: "Hours", value: "hours" }, { label: "Days", value: "days" }],
          optionLabel: "label",
          optionValue: "value",
          appendTo: "self",
          "onUpdate:modelValue": C[0] || (C[0] = (N) => T(N))
        }, null, 8, ["model-value", "aria-label", "disabled"])
      ], 32),
      f.value || e.modelValue && !s(ba)(e.modelValue) ? (n(), b("span", ru, I(f.value || `Unsupported duration: ${e.modelValue}`), 1)) : S("", !0)
    ]));
  }
}), du = { class: "work-stack" }, uu = { class: "work-settings-grid" }, cu = { class: "work-stack work-tight" }, vu = { class: "work-stack work-tight" }, mu = {
  key: 1,
  class: "work-stack work-tight"
}, fu = { class: "work-stack work-tight" }, pu = { class: "work-settings-grid" }, bu = { class: "work-row" }, hu = { class: "work-stack work-tight" }, gu = {
  key: 0,
  class: "work-stack work-tight"
}, yu = /* @__PURE__ */ Ve({
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
    function u() {
      const i = t.state.timers ?? (t.state.timers = []);
      i.push({ id: Mt("timer", i), after: "P1D", then: { emit: "reminder" } });
    }
    function f(i, c) {
      delete i.after, delete i.at_field, c === "after" ? i.after = "P1D" : i.at_field = "";
    }
    function m(i, c, p) {
      p ? i[c] = p : (delete i[c], delete i.table);
    }
    function d(i, c) {
      i.then = c === "emit" ? { emit: "" } : { transition: "" };
    }
    return (i, c) => (n(), b("section", du, [
      c[8] || (c[8] = r("h4", null, "Timers", -1)),
      (n(!0), b(ee, null, ue(o(), (p, w) => (n(), b("article", {
        key: p.id,
        class: "work-settings-card work-stack"
      }, [
        r("div", uu, [
          r("label", cu, [
            c[2] || (c[2] = j("Timer ID", -1)),
            y(s(Se), {
              modelValue: p.id,
              "onUpdate:modelValue": (v) => p.id = v,
              required: "",
              pattern: "[a-z][a-z0-9_]*"
            }, null, 8, ["modelValue", "onUpdate:modelValue"])
          ]),
          r("label", vu, [
            c[3] || (c[3] = j("Deadline", -1)),
            y(s(fe), {
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
          p.after !== void 0 ? (n(), K(Ft, {
            key: 0,
            modelValue: p.after,
            "onUpdate:modelValue": (v) => p.after = v,
            label: "After",
            onValidity: c[0] || (c[0] = (v, g) => l("validity", g, v))
          }, null, 8, ["modelValue", "onUpdate:modelValue"])) : (n(), b("label", mu, [
            c[4] || (c[4] = j("At field", -1)),
            y(s(fe), {
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
          r("label", fu, [
            c[5] || (c[5] = j("Duration by field", -1)),
            y(s(fe), {
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
        p.by ? (n(), K(Et, {
          key: 0,
          label: "Duration table",
          hint: "Map field values to ISO durations.",
          "model-value": p.table,
          shape: "object",
          "onUpdate:modelValue": (v) => p.table = v,
          onValidity: (v) => l("validity", "table-" + w, v)
        }, null, 8, ["model-value", "onUpdate:modelValue", "onValidity"])) : S("", !0),
        r("div", pu, [
          y(Ft, {
            modelValue: p.repeat,
            "onUpdate:modelValue": (v) => p.repeat = v,
            label: "Repeat every",
            onValidity: c[1] || (c[1] = (v, g) => l("validity", g, v)),
            disabled: p.interrupting
          }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"]),
          r("label", bu, [
            y(s(Bt), {
              modelValue: p.interrupting,
              "onUpdate:modelValue": [(v) => p.interrupting = v, (v) => p.interrupting && delete p.repeat],
              binary: ""
            }, null, 8, ["modelValue", "onUpdate:modelValue"]),
            c[6] || (c[6] = j("Interrupting", -1))
          ]),
          r("label", hu, [
            c[7] || (c[7] = j("Then", -1)),
            y(s(fe), {
              "model-value": p.then?.transition !== void 0 ? "transition" : "emit",
              "onUpdate:modelValue": (v) => d(p, v),
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
          p.then ? (n(), b("label", gu, [
            j(I(p.then.transition !== void 0 ? "Transition ID" : "Event name"), 1),
            p.then.transition !== void 0 ? (n(), K(s(Se), {
              key: 0,
              modelValue: p.then.transition,
              "onUpdate:modelValue": (v) => p.then.transition = v
            }, null, 8, ["modelValue", "onUpdate:modelValue"])) : (n(), K(s(Se), {
              key: 1,
              modelValue: p.then.emit,
              "onUpdate:modelValue": (v) => p.then.emit = v
            }, null, 8, ["modelValue", "onUpdate:modelValue"]))
          ])) : S("", !0)
        ]),
        y(s(_), {
          severity: "secondary",
          onClick: (v) => o().splice(w, 1),
          "aria-label": "Remove timer",
          text: "",
          size: "small"
        }, {
          default: q(() => [
            y(s(pe), {
              icon: "tabler:trash",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        }, 8, ["onClick"])
      ]))), 128)),
      y(s(_), {
        label: "Add timer",
        severity: "secondary",
        onClick: u,
        outlined: ""
      }, {
        icon: q(() => [
          y(s(pe), {
            icon: "tabler:plus",
            "aria-hidden": "true"
          })
        ]),
        _: 1
      })
    ]));
  }
}), ku = ["aria-label"], wu = { class: "work-stack work-tight" }, Vu = {
  key: 0,
  class: "work-stack work-tight"
}, $u = /* @__PURE__ */ Ve({
  __name: "PrincipalSourceEditor",
  props: {
    modelValue: {},
    draft: {},
    boardId: {},
    label: {}
  },
  emits: ["update:modelValue", "validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = W(() => Array.isArray(t.modelValue) ? "principals" : "field" in t.modelValue ? "field" : "group"), u = W(() => Array.isArray(t.modelValue) ? t.modelValue : "group" in t.modelValue && t.modelValue.group ? [{ kind: "group", id: t.modelValue.group }] : []);
    function f(d) {
      l("update:modelValue", d === "field" ? { field: "" } : d === "group" ? { group: "" } : []);
    }
    function m(d) {
      l("update:modelValue", o.value === "group" ? { group: d.at(-1)?.id ?? "" } : d);
    }
    return Co(() => l("validity", Array.isArray(t.modelValue) ? t.modelValue.length > 0 : "field" in t.modelValue ? !!t.modelValue.field : !!t.modelValue.group)), Vt(() => l("validity", !0)), (d, i) => (n(), b("section", {
      class: "work-stack work-tight",
      "aria-label": e.label
    }, [
      r("label", wu, [
        j(I(e.label) + " source", 1),
        y(s(fe), {
          "model-value": o.value,
          "aria-label": e.label + " source",
          options: [{ label: "Group", value: "group" }, { label: "People and groups", value: "principals" }, { label: "Principal field", value: "field" }],
          optionLabel: "label",
          optionValue: "value",
          appendTo: "self",
          "onUpdate:modelValue": f
        }, null, 8, ["model-value", "aria-label"])
      ]),
      "field" in e.modelValue ? (n(), b("label", Vu, [
        i[1] || (i[1] = j("Principal field", -1)),
        y(s(fe), {
          "model-value": e.modelValue.field,
          "aria-label": e.label + " field",
          options: e.draft.fields?.filter((c) => c.type === "principal").map((c) => ({ label: c.title || c.code, value: c.code })) ?? [],
          optionLabel: "label",
          optionValue: "value",
          appendTo: "self",
          "onUpdate:modelValue": i[0] || (i[0] = (c) => l("update:modelValue", { field: c }))
        }, null, 8, ["model-value", "aria-label", "options"])
      ])) : (n(), K(Ll, {
        key: 1,
        "board-id": e.boardId,
        label: e.label,
        kinds: o.value === "group" ? "group" : "user,group,service",
        "model-value": u.value,
        "onUpdate:modelValue": m
      }, null, 8, ["board-id", "label", "kinds", "model-value"]))
    ], 8, ku));
  }
}), xu = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, Cu = {
  class: "work-stack work-tight",
  "aria-label": "Approval sources"
}, Su = { class: "work-row" }, Tu = {
  key: 0,
  class: "work-stack work-tight"
}, Iu = ["kinds", "value"], Du = {
  key: 2,
  class: "work-muted work-small",
  role: "status"
}, Uu = {
  key: 3,
  class: "work-chips"
}, Eu = { class: "work-row work-small" }, Au = { class: "work-stack work-tight" }, Ou = {
  key: 4,
  class: "work-error work-small",
  role: "alert"
}, Pu = {
  key: 5,
  class: "work-muted work-small"
}, Ru = /* @__PURE__ */ Ve({
  __name: "ApproversEditor",
  props: {
    approvals: {},
    boardId: {}
  },
  emits: ["validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, { principalLabel: o, rememberPrincipal: u, nameError: f } = So(() => t.boardId ?? "", () => Array.isArray(t.approvals.from) ? t.approvals.from : "group" in t.approvals.from ? [{ kind: "group", id: t.approvals.from.group }] : []), m = B(!1), d = W(() => Array.isArray(t.approvals.from) ? "principals" : "field" in t.approvals.from ? "field" : "group"), i = W(() => Array.isArray(t.approvals.from) ? t.approvals.from.some((v) => v.kind === "group") || t.approvals.from.length >= t.approvals.min : "field" in t.approvals.from ? !!t.approvals.from.field : !!t.approvals.from.group);
    Co(() => l("validity", Number.isSafeInteger(t.approvals.min) && t.approvals.min > 0 && i.value)), Vt(() => l("validity", !0)), Sa(async () => {
      m.value = await Ut("wc-principal-picker");
    });
    function c(v) {
      t.approvals.from = v === "group" ? { group: "" } : v === "field" ? { field: "" } : [];
    }
    function p(v) {
      const g = v.detail, k = g?.principal_id ?? g?.id;
      if (d.value === "group") {
        t.approvals.from = { group: k ?? "" };
        return;
      }
      if (!k || !Array.isArray(t.approvals.from)) return;
      const T = { kind: g.type ?? g.kind ?? "user", id: k };
      g.label && u(T, g.label), t.approvals.from.some(($) => $.id === k && $.kind === T.kind) || t.approvals.from.push(T);
    }
    function w(v) {
      Array.isArray(t.approvals.from) && t.approvals.from.splice(v, 1);
    }
    return (v, g) => (n(), b(ee, null, [
      s(f) ? (n(), b("p", xu, I(s(f)), 1)) : S("", !0),
      r("section", Cu, [
        r("label", Su, [
          g[4] || (g[4] = r("span", { class: "work-spacer" }, "Approvals needed", -1)),
          y(s(yt), {
            modelValue: e.approvals.min,
            "onUpdate:modelValue": g[0] || (g[0] = (k) => e.approvals.min = k),
            min: 1,
            required: "",
            useGrouping: !1
          }, null, 8, ["modelValue"])
        ]),
        g[8] || (g[8] = r("span", { class: "work-field-label" }, "Approvers", -1)),
        "field" in e.approvals.from ? (n(), b("label", Tu, [
          g[5] || (g[5] = j("Principal field", -1)),
          y(s(Se), {
            modelValue: e.approvals.from.field,
            "onUpdate:modelValue": g[1] || (g[1] = (k) => e.approvals.from.field = k),
            "aria-label": "Principal field"
          }, null, 8, ["modelValue"])
        ])) : m.value ? (n(), b("wc-principal-picker", {
          key: d.value,
          kinds: d.value === "group" ? "group" : "user,group,service",
          value: JSON.stringify("group" in e.approvals.from ? { type: "group", principal_id: e.approvals.from.group } : {}),
          onConfigChanged: p
        }, null, 40, Iu)) : (n(), b("p", Du, "The principal picker is unavailable.")),
        Array.isArray(e.approvals.from) ? (n(), b("div", Uu, [
          (n(!0), b(ee, null, ue(e.approvals.from, (k, T) => (n(), K(s(tt), {
            key: k.kind + ":" + k.id,
            class: "kx-tag-sm",
            severity: "secondary"
          }, {
            default: q(() => [
              j(I(s(o)(k)), 1),
              y(s(_), {
                "aria-label": "Remove approver " + (T + 1),
                text: "",
                severity: "secondary",
                size: "small",
                onClick: ($) => w(T)
              }, {
                default: q(() => [
                  y(s(pe), {
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
        r("label", Eu, [
          g[6] || (g[6] = r("span", { class: "work-spacer" }, "The person who moves the item here cannot approve this visit", -1)),
          y(s(et), {
            modelValue: e.approvals.prevent_self,
            "onUpdate:modelValue": g[2] || (g[2] = (k) => e.approvals.prevent_self = k),
            "aria-label": "The person who moves the item here cannot approve this visit"
          }, null, 8, ["modelValue"])
        ]),
        y(Ne, {
          class: "work-process-options",
          label: "Approval options"
        }, {
          default: q(() => [
            r("label", Au, [
              g[7] || (g[7] = j("Approval source", -1)),
              y(s(fe), {
                "model-value": d.value,
                "onUpdate:modelValue": g[3] || (g[3] = (k) => c(k)),
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                options: [{ label: "Group members", value: "group" }, { label: "People and groups", value: "principals" }, { label: "Principal field", value: "field" }]
              }, null, 8, ["model-value"])
            ])
          ]),
          _: 1
        }),
        Array.isArray(e.approvals.from) && !i.value ? (n(), b("p", Ou, "Select at least " + I(e.approvals.min) + " distinct principals, or lower the minimum.", 1)) : "group" in e.approvals.from && !e.approvals.from.group ? (n(), b("p", Pu, "Choose the group that can approve this state.")) : S("", !0)
      ])
    ], 64));
  }
}), Nu = {
  class: "work-state-settings work-stack",
  "aria-label": "State settings"
}, Mu = { class: "work-process-kind" }, Fu = { class: "work-row" }, Lu = { class: "work-row" }, Bu = { class: "work-stack" }, zu = { class: "work-row" }, ju = { class: "work-stack work-tight" }, Wu = { class: "work-row" }, qu = { class: "work-stack work-tight" }, Gu = { class: "work-row" }, Ku = { class: "work-row" }, Hu = { class: "work-stack work-tight" }, Yu = { class: "work-stack" }, Xu = { class: "work-row" }, Ju = { class: "work-row" }, Zu = { class: "work-stack work-tight" }, Qu = { class: "work-stack work-tight" }, _u = {
  key: 0,
  class: "work-row"
}, ec = { class: "work-stack" }, tc = { class: "work-stack work-tight" }, ac = { class: "work-row" }, lc = /* @__PURE__ */ Ve({
  __name: "StateSettings",
  props: {
    state: {},
    process: {},
    draft: {},
    boardId: {}
  },
  emits: ["validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = W(() => (t.process.transitions ?? []).filter((d) => d.from === "any" || d.from.includes(t.state.id))), u = [{ value: "human", icon: "user" }, { value: "gate", icon: "shield-check" }, { value: "automated", icon: "bolt" }, { value: "parallel", icon: "arrows-split" }];
    function f(d) {
      const i = t.state;
      i.kind = d, delete i.run, delete i.release_when, delete i.regions, delete i.join, delete i.due, (d === "automated" || d === "gate") && delete i.awaiting, d === "automated" && (i.run = { stage: i.id, retry: { max: 1, backoff: "PT1M" } }), d === "gate" && (i.release_when = { approvals: { min: 1, from: { group: "" }, prevent_self: !0 } }), d === "parallel" && (i.regions = [{ id: "region_1", initial: t.process.states.find((c) => c.id !== i.id)?.id ?? "" }], i.join = "all");
    }
    function m(d) {
      t.state.run && (d ? t.state.run.on_fail = d : delete t.state.run.on_fail);
    }
    return (d, i) => (n(), b("section", Nu, [
      i[57] || (i[57] = r("h4", { class: "work-process-group" }, "Who moves the item on", -1)),
      y(s(Nl), {
        class: "work-process-kinds",
        "model-value": e.state.kind ?? "human",
        options: u.map((c) => ({
          ...c,
          label: s(qa)(c.value)
        })),
        optionLabel: "label",
        optionValue: "value",
        optionDisabled: "disabled",
        "allow-empty": !1,
        "aria-label": "Who moves the item on",
        "onUpdate:modelValue": f
      }, {
        option: q(({ option: c }) => [
          r("span", Mu, [
            y(s(pe), {
              icon: "tabler:" + c.icon
            }, null, 8, ["icon"]),
            r("span", null, I(c.label), 1)
          ])
        ]),
        _: 1
      }, 8, ["model-value", "options"]),
      i[58] || (i[58] = r("h4", { class: "work-process-group" }, "Limit", -1)),
      r("label", Fu, [
        i[34] || (i[34] = r("span", { class: "work-spacer" }, "Items allowed here", -1)),
        y(bo, {
          draft: e.draft,
          state: e.state.id,
          label: "Items allowed here"
        }, null, 8, ["draft", "state"])
      ]),
      r("label", Lu, [
        i[35] || (i[35] = r("span", { class: "work-spacer" }, [
          j("Refuse moves over the limit"),
          r("small", { class: "work-muted work-block" }, "Off only warns")
        ], -1)),
        y(bo, {
          draft: e.draft,
          state: e.state.id,
          label: "Refuse moves over the limit",
          hard: ""
        }, null, 8, ["draft", "state"])
      ]),
      i[59] || (i[59] = r("h4", { class: "work-process-group" }, "Required on entry", -1)),
      y(vt, {
        label: "Required fields",
        options: e.draft.fields?.map((c) => ({ value: c.code, label: c.title || c.code })) ?? [],
        modelValue: e.state.require,
        "onUpdate:modelValue": i[0] || (i[0] = (c) => e.state.require = c)
      }, null, 8, ["options", "modelValue"]),
      !e.state.kind || e.state.kind === "human" ? (n(), K(Ft, {
        key: 0,
        modelValue: e.state.due,
        "onUpdate:modelValue": i[1] || (i[1] = (c) => e.state.due = c),
        label: "Time allowed in this state",
        onValidity: i[2] || (i[2] = (c, p) => l("validity", p, c))
      }, null, 8, ["modelValue"])) : S("", !0),
      e.state.kind === "gate" && e.state.release_when ? (n(), b(ee, { key: 1 }, [
        i[37] || (i[37] = r("h4", { class: "work-process-group" }, "Approval", -1)),
        e.state.release_when.approvals ? (n(), K(Ru, {
          key: 0,
          "board-id": e.boardId,
          approvals: e.state.release_when.approvals,
          onValidity: i[3] || (i[3] = (c) => l("validity", "approvers", c))
        }, null, 8, ["board-id", "approvals"])) : S("", !0),
        y(Ne, {
          class: "work-process-options",
          label: "Release options"
        }, {
          default: q(() => [
            r("div", Bu, [
              r("label", zu, [
                i[36] || (i[36] = r("span", { class: "work-spacer" }, "Require approvals", -1)),
                y(s(et), {
                  "model-value": !!e.state.release_when.approvals,
                  "aria-label": "Require approvals",
                  "onUpdate:modelValue": i[4] || (i[4] = (c) => e.state.release_when.approvals = c ? { min: 1, from: { group: "" }, prevent_self: !0 } : void 0)
                }, null, 8, ["model-value"])
              ]),
              y(Ft, {
                modelValue: e.state.release_when.wait,
                "onUpdate:modelValue": i[5] || (i[5] = (c) => e.state.release_when.wait = c),
                label: "Wait before release",
                onValidity: i[6] || (i[6] = (c, p) => l("validity", p, c))
              }, null, 8, ["modelValue"]),
              y(Fl, {
                label: "Release when",
                draft: e.draft,
                "board-id": e.boardId,
                modelValue: e.state.release_when.when,
                "onUpdate:modelValue": i[7] || (i[7] = (c) => e.state.release_when.when = c),
                onValidity: i[8] || (i[8] = (c) => l("validity", "release", c))
              }, null, 8, ["draft", "board-id", "modelValue"])
            ])
          ]),
          _: 1
        })
      ], 64)) : S("", !0),
      e.state.kind === "automated" && e.state.run ? (n(), b(ee, { key: 2 }, [
        i[46] || (i[46] = r("h4", { class: "work-process-group" }, "Automation", -1)),
        r("label", ju, [
          i[38] || (i[38] = j("Run label", -1)),
          y(s(Se), {
            modelValue: e.state.run.stage,
            "onUpdate:modelValue": i[9] || (i[9] = (c) => e.state.run.stage = c),
            "aria-label": "Run label",
            required: ""
          }, null, 8, ["modelValue"])
        ]),
        y(iu, {
          modelValue: e.state.run.flow_ref,
          "onUpdate:modelValue": i[10] || (i[10] = (c) => e.state.run.flow_ref = c),
          onValidity: i[11] || (i[11] = (c) => l("validity", "flow", c))
        }, null, 8, ["modelValue"]),
        y(Ft, {
          modelValue: e.state.run.timeout,
          "onUpdate:modelValue": i[12] || (i[12] = (c) => e.state.run.timeout = c),
          label: "Attempt timeout",
          onValidity: i[13] || (i[13] = (c, p) => l("validity", p, c))
        }, null, 8, ["modelValue"]),
        i[47] || (i[47] = r("small", { class: "work-muted" }, "Blank uses the board timeout, or one hour.", -1)),
        r("label", Wu, [
          i[39] || (i[39] = r("span", { class: "work-spacer" }, "Maximum visits", -1)),
          y(s(yt), {
            "model-value": e.state.run.max_visits ?? null,
            "aria-label": "Maximum visits",
            min: 1,
            useGrouping: !1,
            placeholder: "Board default",
            "onUpdate:modelValue": i[14] || (i[14] = (c) => e.state.run.max_visits = c ?? void 0)
          }, null, 8, ["model-value"])
        ]),
        r("label", qu, [
          i[40] || (i[40] = j("When visits are exhausted", -1)),
          y(s(fe), {
            "model-value": e.state.run.on_exhausted,
            "aria-label": "When visits are exhausted",
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            showClear: "",
            options: (e.process.transitions ?? []).filter((c) => !c.auto).map((c) => ({ label: s(je)(c), value: c.id })),
            "onUpdate:modelValue": i[15] || (i[15] = (c) => e.state.run.on_exhausted = c || void 0)
          }, null, 8, ["model-value", "options"])
        ]),
        i[48] || (i[48] = r("small", { class: "work-muted" }, "Blank records a failed run and stops automation. A route must leave every incoming state or be global.", -1)),
        r("label", Gu, [
          i[41] || (i[41] = r("span", { class: "work-spacer" }, "Retry if it fails", -1)),
          y(s(et), {
            "model-value": !!e.state.run.retry,
            "aria-label": "Retry if it fails",
            "onUpdate:modelValue": i[16] || (i[16] = (c) => e.state.run.retry = c ? { max: 1, backoff: "PT1M" } : void 0)
          }, null, 8, ["model-value"])
        ]),
        e.state.run.retry ? (n(), b(ee, { key: 0 }, [
          r("label", Ku, [
            i[42] || (i[42] = r("span", { class: "work-spacer" }, "Maximum attempts", -1)),
            y(s(yt), {
              modelValue: e.state.run.retry.max,
              "onUpdate:modelValue": i[17] || (i[17] = (c) => e.state.run.retry.max = c),
              min: 1,
              useGrouping: !1
            }, null, 8, ["modelValue"])
          ]),
          y(Ft, {
            modelValue: e.state.run.retry.backoff,
            "onUpdate:modelValue": i[18] || (i[18] = (c) => e.state.run.retry.backoff = c),
            label: "Wait between attempts",
            onValidity: i[19] || (i[19] = (c, p) => l("validity", p, c))
          }, null, 8, ["modelValue"])
        ], 64)) : S("", !0),
        (n(), b(ee, null, ue([{ key: "on_pass", label: "On success" }, { key: "on_cancel", label: "On cancellation" }], (c) => r("label", {
          key: c.key,
          class: "work-stack work-tight"
        }, [
          j(I(c.label), 1),
          y(s(fe), {
            "model-value": e.state.run[c.key],
            "aria-label": c.label,
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            showClear: "",
            options: o.value.map((p) => ({ label: s(je)(p), value: p.id })),
            "onUpdate:modelValue": (p) => e.state.run[c.key] = p || void 0
          }, null, 8, ["model-value", "aria-label", "options", "onUpdate:modelValue"])
        ])), 64)),
        r("label", Hu, [
          i[43] || (i[43] = j("If it fails, go to", -1)),
          y(s(fe), {
            "aria-label": "If it fails, go to",
            "model-value": e.state.run.on_fail,
            "onUpdate:modelValue": m,
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            showClear: "",
            options: o.value.map((c) => ({
              label: s(je)(c) + " → " + s(ke)(e.process.states.find((p) => p.id === c.to)),
              value: c.id
            }))
          }, null, 8, ["model-value", "options"])
        ]),
        y(Ne, {
          class: "work-disclosure",
          label: "Board automation defaults"
        }, {
          default: q(() => [
            r("div", Yu, [
              i[45] || (i[45] = r("p", { class: "work-muted" }, "These values apply to automated states without their own limit.", -1)),
              y(Ft, {
                "model-value": e.draft.policy?.stage_timeout,
                label: "Default attempt timeout",
                "onUpdate:modelValue": i[20] || (i[20] = (c) => (e.draft.policy ??= {}).stage_timeout = c),
                onValidity: i[21] || (i[21] = (c, p) => l("validity", p, c))
              }, null, 8, ["model-value"]),
              r("label", Xu, [
                i[44] || (i[44] = r("span", { class: "work-spacer" }, "Default maximum visits", -1)),
                y(s(yt), {
                  "model-value": e.draft.policy?.stage_max_visits ?? null,
                  "aria-label": "Default maximum visits",
                  min: 1,
                  useGrouping: !1,
                  placeholder: "5",
                  "onUpdate:modelValue": i[22] || (i[22] = (c) => (e.draft.policy ??= {}).stage_max_visits = c ?? void 0)
                }, null, 8, ["model-value"])
              ])
            ])
          ]),
          _: 1
        })
      ], 64)) : S("", !0),
      e.state.kind === "parallel" && e.state.regions ? (n(), b(ee, { key: 3 }, [
        i[53] || (i[53] = r("h4", { class: "work-process-group" }, "Lanes", -1)),
        (n(!0), b(ee, null, ue(e.state.regions, (c, p) => (n(), b("div", {
          key: p,
          class: "work-process-value work-stack work-tight"
        }, [
          r("div", Ju, [
            r("span", null, "Lane " + I(p + 1), 1),
            i[49] || (i[49] = r("span", { class: "work-spacer" }, null, -1)),
            y(s(_), {
              severity: "danger",
              text: "",
              size: "small",
              "aria-label": "Remove lane",
              onClick: (w) => e.state.regions.splice(p, 1)
            }, {
              default: q(() => [
                y(s(pe), { icon: "tabler:trash" })
              ]),
              _: 1
            }, 8, ["onClick"])
          ]),
          r("label", Zu, [
            i[50] || (i[50] = j("Starts at", -1)),
            y(s(fe), {
              "aria-label": "Lane starts at",
              modelValue: c.initial,
              "onUpdate:modelValue": (w) => c.initial = w,
              appendTo: "self",
              optionLabel: "label",
              optionValue: "value",
              options: e.process.states.filter((w) => w.id !== e.state.id).map((w) => ({ label: s(ke)(w), value: w.id }))
            }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
          ])
        ]))), 128)),
        y(s(_), {
          label: "Add lane",
          severity: "secondary",
          outlined: "",
          size: "small",
          onClick: i[23] || (i[23] = (c) => e.state.regions.push({
            id: s(Mt)("region", e.state.regions),
            initial: e.process.states.find((p) => p.id !== e.state.id)?.id ?? ""
          }))
        }, {
          icon: q(() => [
            y(s(pe), { icon: "tabler:plus" })
          ]),
          _: 1
        }),
        r("label", Qu, [
          i[51] || (i[51] = j("Finish rule", -1)),
          y(s(fe), {
            "model-value": typeof e.state.join == "number" ? "count" : e.state.join ?? "all",
            appendTo: "self",
            options: [
              { label: "All must pass", value: "all" },
              { label: "Any may pass", value: "any" },
              { label: "A number must pass", value: "count" }
            ],
            optionLabel: "label",
            optionValue: "value",
            "onUpdate:modelValue": i[24] || (i[24] = (c) => e.state.join = c === "count" ? 1 : c)
          }, null, 8, ["model-value"])
        ]),
        typeof e.state.join == "number" ? (n(), b("label", _u, [
          i[52] || (i[52] = r("span", { class: "work-spacer" }, "Lanes needed", -1)),
          y(s(yt), {
            modelValue: e.state.join,
            "onUpdate:modelValue": i[25] || (i[25] = (c) => e.state.join = c),
            min: 1,
            max: e.state.regions.length,
            useGrouping: !1
          }, null, 8, ["modelValue", "max"])
        ])) : S("", !0)
      ], 64)) : S("", !0),
      y(Ne, {
        class: "work-disclosure",
        label: "Advanced state settings"
      }, {
        default: q(() => [
          r("div", ec, [
            i[56] || (i[56] = r("h4", { class: "work-process-group" }, "Assignment and conditions", -1)),
            r("label", tc, [
              i[54] || (i[54] = j("Stage label", -1)),
              y(s(Se), {
                "model-value": e.state.stage,
                "aria-label": "Stage label",
                "onUpdate:modelValue": i[26] || (i[26] = (c) => e.state.stage = c || void 0)
              }, null, 8, ["model-value"])
            ]),
            !e.state.kind || e.state.kind === "human" || e.state.kind === "parallel" ? (n(), b(ee, { key: 0 }, [
              r("label", ac, [
                y(s(et), {
                  "model-value": !!e.state.awaiting,
                  "aria-label": "Awaiting people",
                  "onUpdate:modelValue": i[27] || (i[27] = (c) => e.state.awaiting = c ? { group: "" } : void 0)
                }, null, 8, ["model-value"]),
                i[55] || (i[55] = j("Awaiting people", -1))
              ]),
              e.state.awaiting ? (n(), K($u, {
                key: 0,
                modelValue: e.state.awaiting,
                "onUpdate:modelValue": i[28] || (i[28] = (c) => e.state.awaiting = c),
                draft: e.draft,
                "board-id": e.boardId,
                label: "Awaiting",
                onValidity: i[29] || (i[29] = (c) => l("validity", "awaiting", c))
              }, null, 8, ["modelValue", "draft", "board-id"])) : S("", !0)
            ], 64)) : S("", !0),
            y(Ll, {
              "board-id": e.boardId,
              modelValue: e.state.assign,
              "onUpdate:modelValue": i[30] || (i[30] = (c) => e.state.assign = c),
              label: "Assign to"
            }, null, 8, ["board-id", "modelValue"]),
            y(Et, {
              label: "State checks",
              example: ["installed-check"],
              "model-value": e.state.invariants,
              shape: "array",
              "onUpdate:modelValue": i[31] || (i[31] = (c) => e.state.invariants = c),
              onValidity: i[32] || (i[32] = (c) => l("validity", "invariants", c))
            }, null, 8, ["model-value"]),
            y(yu, {
              state: e.state,
              draft: e.draft,
              onValidity: i[33] || (i[33] = (c, p) => l("validity", "timer-" + c, p))
            }, null, 8, ["state", "draft"])
          ])
        ]),
        _: 1
      })
    ]));
  }
}), oc = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, ic = { key: 1 }, nc = { class: "work-muted" }, sc = {
  key: 2,
  class: "work-map-zoom",
  role: "group",
  "aria-label": "Map zoom"
}, rc = ["aria-label", "aria-keyshortcuts", "onKeydown"], dc = { class: "work-row" }, uc = { class: "work-process-meaning" }, cc = {
  key: 0,
  class: "work-muted"
}, vc = { class: "work-stack work-tight" }, mc = { class: "work-next-transition work-stack work-tight" }, fc = { class: "work-row work-wrap" }, pc = { class: "work-process-inspector-foot" }, bc = { class: "work-row work-transition-actions" }, hc = { class: "work-process-meaning" }, gc = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, yc = { class: "work-stack work-tight" }, kc = { class: "work-stack" }, wc = { class: "work-stack work-tight" }, Vc = {
  key: 0,
  class: "work-muted"
}, $c = { class: "work-stack work-tight" }, xc = { class: "work-dialog-actions" }, Cc = /* @__PURE__ */ Ve({
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
    const t = e, l = a, o = W(() => t.draft.processes ?? []), u = B(!1), f = B(""), m = B(""), d = B(""), i = B("Map"), c = B(""), p = B(!1), w = B(), v = B(), g = B(), k = B(), T = B(), $ = B(), C = B(!1);
    let N;
    async function F() {
      C.value = !0, await _t(), T.value?.querySelector('[aria-label="State name"]')?.focus();
    }
    const z = W(() => o.value.find((H) => H.id === m.value) ?? o.value[0]), ie = B(!1);
    function le(H) {
      ie.value = !0, i.value = H;
    }
    function de() {
      !ie.value && k.value?.clientWidth && (i.value = k.value.clientWidth < 480 && (z.value?.states.length ?? 0) > 6 ? "List" : "Map");
    }
    let Z;
    Sa(() => {
      de(), k.value && typeof ResizeObserver < "u" && (Z = new ResizeObserver(de), Z.observe(k.value));
    }), Vt(() => Z?.disconnect()), Ie(z, () => {
      ie.value = !1, de();
    });
    function ve() {
      C.value = !1, p.value = !1, w.value = void 0, v.value = void 0, d.value = "", N = void 0;
    }
    async function be() {
      const H = N;
      ve(), await _t(), H?.isConnected ? H.focus() : te();
    }
    function te() {
      i.value === "Map" ? g.value?.focus() : $.value?.focus();
    }
    async function U() {
      await _t(), T.value && (T.value.scrollTop = 0, T.value.focus({ preventScroll: !0 }), (T.value.closest(".work-settings-shell")?.clientWidth ?? 1 / 0) <= 700 && T.value.scrollIntoView?.({ block: "nearest" }));
    }
    function Y(H, L) {
      N = L, C.value = !1, p.value = !1, w.value = H, v.value = void 0, c.value = "", d.value = "", U();
    }
    async function P(H) {
      c.value = "", p.value = H, await _t();
      const L = H ? '[role="combobox"]' : "button";
      T.value?.querySelector(".work-next-transition " + L)?.focus();
    }
    function me(H, L) {
      N = L, C.value = !1, v.value = H, w.value = void 0, d.value = "", U();
    }
    Ie([z, i], ve);
    const O = W(() => {
      if (!t.counts || !z.value) return;
      const H = t.countTypes?.filter((L) => L.process === z.value?.id) ?? [];
      return Object.fromEntries(z.value.states.map((L) => [
        L.id,
        H.reduce((V, R) => V + (t.counts?.[R.id]?.[L.id] ?? 0), 0)
      ]));
    }), Q = W(() => (t.guards ?? []).filter((H) => t.draft.plugins?.some((L) => L.use === H.plugin))), x = W(() => Object.keys(t.draft.policy?.wip ?? {}).filter((H) => !o.value.some((L) => L.states.some((V) => V.id === H))));
    function M() {
      const H = f.value.trim();
      if (!H) return;
      const L = H.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "") || "process", V = (/^[a-z]/.test(L) ? L : "process_" + L).slice(0, 40), R = o.value.some((D) => D.id === V) ? Mt(V, o.value) : V;
      (t.draft.processes ??= []).push({ id: R, name: H, initial: "todo", states: [{ id: "todo", name: "To do", category: "unstarted" }], transitions: [] }), m.value = R, f.value = "", u.value = !1;
    }
    async function E(H, L) {
      const V = { id: Mt("state", H.states), name: "New state", category: "started" }, R = La(H), D = R.at(-1), ne = w.value ?? (D?.category === "completed" ? R.at(-2) : D), ce = ne && (H.transitions?.find((we) => we.default && we.from !== "any" && we.from.includes(ne.id)) ?? H.transitions?.find((we) => we.from !== "any" && we.from.includes(ne.id) && H.states.findIndex((De) => De.id === we.to) > H.states.indexOf(ne)));
      if (H.states.splice(ne ? H.states.indexOf(ne) + 1 : H.states.length, 0, V), ne && ne.category !== "completed" && ne.category !== "canceled")
        if (ce) {
          const we = ce.to;
          ce.to = V.id, (H.transitions ??= []).push({ id: Mt("transition", H.transitions ?? []), name: "Continue", from: [V.id], to: we, ...ce.auto && ce.default ? { auto: !0, default: !0 } : {} });
        } else (H.transitions ??= []).push({ id: Mt("transition", H.transitions ?? []), name: "Continue", from: [ne.id], to: V.id });
      Y(V, L), await F();
    }
    function X(H, L, V = N) {
      const R = z.value;
      if (!R || !L || H === L) return;
      const D = R.transitions ??= [], ne = `to_${L}`;
      let ce = ne.slice(0, 40), we = 2;
      for (; D.some((Le) => Le.id === ce); ) {
        const Le = `_${we++}`;
        ce = ne.slice(0, 40 - Le.length) + Le;
      }
      const De = { id: ce, name: `To ${ke(R.states.find((Le) => Le.id === L)).toLowerCase()}`, from: [H], to: L };
      D.push(De), me(De, V);
    }
    function h(H, L) {
      const V = w.value ?? H.states.find((ne) => ne.id === H.initial) ?? H.states[0], R = H.states.find((ne) => ne.id !== V?.id);
      if (!V || !R) return;
      const D = { id: Mt("transition", H.transitions ?? []), name: "To " + ke(R), from: [V.id], to: R.id };
      (H.transitions ??= []).push(D), me(D, L);
    }
    async function A(H) {
      const L = z.value, V = L?.transitions?.indexOf(H) ?? -1;
      if (!L || V < 0) return;
      const R = Ui(L, H);
      if (R.length) {
        d.value = `Used by ${R.join(", ")}. Update those references first.`;
        return;
      }
      L.transitions.splice(V, 1), ve(), await _t(), te();
    }
    function se(H) {
      !v.value || H.defaultPrevented || H.repeat || (H.preventDefault(), A(v.value));
    }
    function re(H, L) {
      const V = Ei(H, L);
      if (V.length) {
        d.value = `${ke(L)} is used by ${V.join(", ")}. Update these references first.`;
        return;
      }
      H.states.splice(H.states.indexOf(L), 1), be();
    }
    async function $e(H) {
      const L = t.draft.item_types?.filter((R) => R.process === H.id).map((R) => R.title || "Untitled item type") ?? [];
      if (L.length) {
        d.value = `Used by ${L.join(", ")}. Choose a different process for those item types first.`;
        return;
      }
      const V = await t.guardRemoval?.("processes", H.id);
      if (V) {
        d.value = V;
        return;
      }
      Ta(t.draft, "processes", H.id), m.value = "", ve();
    }
    return (H, L) => (n(), b("section", {
      ref_key: "editor",
      ref: k,
      class: "work-process-editor work-stack",
      "aria-label": "Process editor",
      onKeydown: L[19] || (L[19] = ze((V) => T.value && be(), ["esc"]))
    }, [
      d.value && !v.value ? (n(), b("p", oc, I(d.value), 1)) : S("", !0),
      (n(!0), b(ee, null, ue(e.issues?.filter((V) => V.code === "process " + z.value?.id) ?? [], (V) => (n(), b("p", {
        key: V.what + V.detail,
        class: "work-error work-small",
        role: "alert"
      }, I(s(Ja)(V)) + " · " + I(V.what), 1))), 128)),
      z.value ? (n(), b("div", {
        key: 1,
        class: ct(["work-process-builder", { "work-process-inspecting": w.value || v.value }])
      }, [
        r("div", {
          ref_key: "tools",
          ref: $,
          class: "work-process-controls",
          role: "toolbar",
          "aria-label": "Process tools",
          tabindex: "-1"
        }, [
          o.value.length > 1 ? (n(), K(s(fe), {
            key: 0,
            "model-value": z.value.id,
            "aria-label": "Process",
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            options: o.value.map((V) => ({ label: V.name || "Untitled process", value: V.id })),
            "onUpdate:modelValue": L[0] || (L[0] = (V) => m.value = V)
          }, null, 8, ["model-value", "options"])) : (n(), b("strong", ic, I(z.value.name || "Untitled process"), 1)),
          y(s(_), {
            label: "Add state",
            severity: "secondary",
            outlined: "",
            onClick: L[1] || (L[1] = (V) => E(z.value, V.currentTarget))
          }, {
            icon: q(() => [
              y(s(pe), { icon: "tabler:plus" })
            ]),
            _: 1
          }),
          y(s(_), {
            label: "Add transition",
            severity: "secondary",
            outlined: "",
            disabled: z.value.states.length < 2,
            onClick: L[2] || (L[2] = (V) => h(z.value, V.currentTarget))
          }, null, 8, ["disabled"]),
          y(s(fe), {
            modelValue: z.value.initial,
            "onUpdate:modelValue": L[3] || (L[3] = (V) => z.value.initial = V),
            "aria-label": "Starts in " + s(ke)(z.value.states.find((V) => V.id === z.value.initial)),
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            options: z.value.states.map((V) => ({ label: s(ke)(V), value: V.id }))
          }, {
            value: q(() => [
              r("span", nc, "Starts in " + I(s(ke)(z.value.states.find((V) => V.id === z.value.initial))), 1)
            ]),
            _: 1
          }, 8, ["modelValue", "aria-label", "options"]),
          L[20] || (L[20] = r("span", { class: "work-spacer" }, null, -1)),
          i.value === "Map" ? (n(), b("div", sc, [
            y(s(_), {
              label: "Fit",
              title: "Fit the map to a readable width",
              text: "",
              severity: "secondary",
              size: "small",
              onClick: L[4] || (L[4] = (V) => g.value?.fit())
            }, {
              icon: q(() => [
                y(s(pe), { icon: "tabler:arrows-maximize" })
              ]),
              _: 1
            }),
            i.value === "Map" ? (n(), K(s(_), {
              key: 0,
              "aria-label": "Zoom out",
              title: "Zoom out",
              text: "",
              severity: "secondary",
              size: "small",
              onClick: L[5] || (L[5] = (V) => g.value?.zoomOut())
            }, {
              default: q(() => [
                y(s(pe), { icon: "tabler:minus" })
              ]),
              _: 1
            })) : S("", !0),
            i.value === "Map" ? (n(), K(s(_), {
              key: 1,
              "aria-label": "Zoom in",
              title: "Zoom in",
              text: "",
              severity: "secondary",
              size: "small",
              onClick: L[6] || (L[6] = (V) => g.value?.zoomIn())
            }, {
              default: q(() => [
                y(s(pe), { icon: "tabler:plus" })
              ]),
              _: 1
            })) : S("", !0)
          ])) : S("", !0),
          y(s(Nl), {
            "model-value": i.value,
            "onUpdate:modelValue": le,
            options: ["Map", "List"],
            "allow-empty": !1,
            "aria-label": "Process layout"
          }, null, 8, ["model-value"]),
          y(s(_), {
            label: "New process",
            "aria-label": "New process",
            text: "",
            severity: "secondary",
            onClick: L[7] || (L[7] = (V) => u.value = !0)
          }, {
            icon: q(() => [
              y(s(pe), { icon: "tabler:plus" })
            ]),
            _: 1
          })
        ], 512),
        i.value === "Map" ? (n(), K(pd, {
          key: 0,
          ref_key: "graph",
          ref: g,
          process: z.value,
          draft: e.draft,
          "fit-on-open": "",
          "selected-state": w.value,
          "selected-transition": v.value,
          onState: Y,
          onTransition: me,
          onRemoveTransition: se,
          onConnect: X,
          onClear: be
        }, null, 8, ["process", "draft", "selected-state", "selected-transition"])) : (n(), K(Rd, {
          key: 1,
          process: z.value,
          "selected-state": w.value,
          "selected-transition": v.value,
          counts: O.value,
          onState: Y,
          onTransition: me,
          onRemoveState: L[8] || (L[8] = (V) => re(z.value, V)),
          onRemoveTransition: A
        }, null, 8, ["process", "selected-state", "selected-transition", "counts"])),
        y($o, { name: "work-panel" }, {
          default: q(() => [
            w.value || v.value ? (n(), b("aside", {
              key: 0,
              ref_key: "inspector",
              ref: T,
              class: "work-process-sideform",
              tabindex: "-1",
              "aria-label": w.value ? "State inspector" : "Transition inspector",
              "aria-keyshortcuts": v.value ? "Delete Backspace" : void 0,
              onKeydown: [
                ze(Ee(se, ["self"]), ["delete"]),
                ze(Ee(se, ["self"]), ["backspace"])
              ]
            }, [
              (n(!0), b(ee, null, ue(w.value ? [w.value] : [], (V) => (n(), b(ee, {
                key: V.id
              }, [
                r("header", dc, [
                  C.value ? (n(), K(s(Se), {
                    key: 1,
                    modelValue: V.name,
                    "onUpdate:modelValue": (R) => V.name = R,
                    class: "work-process-name",
                    "aria-label": "State name",
                    onBlur: L[9] || (L[9] = (R) => C.value = !1)
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])) : (n(), K(Ml, {
                    key: 0,
                    class: "work-process-state-title",
                    "aria-label": "Rename state",
                    onActivate: F
                  }, {
                    default: q(() => [
                      r("span", null, I(s(ke)(V)), 1)
                    ]),
                    _: 2
                  }, 1024)),
                  y(s(_), {
                    severity: "secondary",
                    text: "",
                    size: "small",
                    "aria-label": "Close state editor",
                    onClick: be
                  }, {
                    default: q(() => [
                      y(s(pe), { icon: "tabler:x" })
                    ]),
                    _: 1
                  })
                ]),
                r("p", uc, I(s(Di)(V, e.draft)), 1),
                O.value ? (n(), b("p", cc, I(O.value[V.id] ?? 0) + " " + I(O.value[V.id] === 1 ? "item" : "items") + " currently here", 1)) : S("", !0),
                y(lc, {
                  state: V,
                  process: z.value,
                  draft: e.draft,
                  "board-id": e.boardId,
                  onValidity: (R, D) => l("validity", R.includes("duration:") ? R : z.value.id + ":" + V.id + ":" + R, D)
                }, null, 8, ["state", "process", "draft", "board-id", "onValidity"]),
                r("label", vc, [
                  L[21] || (L[21] = j("Phase", -1)),
                  y(s(fe), {
                    "aria-label": "Phase",
                    modelValue: V.category,
                    "onUpdate:modelValue": (R) => V.category = R,
                    appendTo: "self",
                    optionLabel: "label",
                    optionValue: "value",
                    options: ["triage", "backlog", ...s(To)].map((R) => ({ label: s(jt)(R), value: R }))
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                ]),
                r("div", mc, [
                  p.value ? (n(), b(ee, { key: 1 }, [
                    y(s(fe), {
                      modelValue: c.value,
                      "onUpdate:modelValue": L[11] || (L[11] = (R) => c.value = R),
                      "aria-label": "Next state",
                      placeholder: "Choose the next state",
                      appendTo: "self",
                      optionLabel: "label",
                      optionValue: "value",
                      options: z.value.states.filter((R) => R !== V).map((R) => ({ label: s(ke)(R), value: R.id }))
                    }, null, 8, ["modelValue", "options"]),
                    r("div", fc, [
                      y(s(_), {
                        label: "Add transition",
                        size: "small",
                        disabled: !c.value,
                        onClick: (R) => X(V.id, c.value)
                      }, null, 8, ["disabled", "onClick"]),
                      y(s(_), {
                        label: "Cancel",
                        severity: "secondary",
                        text: "",
                        size: "small",
                        onClick: L[12] || (L[12] = (R) => P(!1))
                      })
                    ])
                  ], 64)) : (n(), K(s(_), {
                    key: 0,
                    label: "Add transition",
                    severity: "secondary",
                    outlined: "",
                    size: "small",
                    "aria-expanded": "false",
                    disabled: z.value.states.length < 2,
                    onClick: L[10] || (L[10] = (R) => P(!0))
                  }, {
                    icon: q(() => [
                      y(s(pe), {
                        icon: "tabler:plus",
                        "aria-hidden": "true"
                      })
                    ]),
                    _: 1
                  }, 8, ["disabled"]))
                ]),
                r("footer", pc, [
                  y(s(_), {
                    label: "Remove state",
                    severity: "danger",
                    text: "",
                    size: "small",
                    onClick: (R) => re(z.value, V)
                  }, {
                    icon: q(() => [
                      y(s(pe), { icon: "tabler:trash" })
                    ]),
                    _: 1
                  }, 8, ["onClick"])
                ])
              ], 64))), 128)),
              (n(!0), b(ee, null, ue(v.value ? [v.value] : [], (V) => (n(), b(ee, {
                key: V.id
              }, [
                r("header", bc, [
                  L[22] || (L[22] = r("h3", null, "Transition", -1)),
                  y(s(_), {
                    type: "button",
                    label: "Remove transition",
                    severity: "danger",
                    text: "",
                    size: "small",
                    onClick: (R) => A(V)
                  }, {
                    icon: q(() => [
                      y(s(pe), { icon: "tabler:trash" })
                    ]),
                    _: 1
                  }, 8, ["onClick"]),
                  y(s(_), {
                    severity: "secondary",
                    text: "",
                    size: "small",
                    "aria-label": "Close transition editor",
                    onClick: be
                  }, {
                    default: q(() => [
                      y(s(pe), { icon: "tabler:x" })
                    ]),
                    _: 1
                  })
                ]),
                r("p", hc, I(V.from === "any" ? "Any state" : V.from.map((R) => s(ke)(z.value.states.find((D) => D.id === R))).join(", ")) + " → " + I(s(ke)(z.value.states.find((R) => R.id === V.to))), 1),
                d.value ? (n(), b("p", gc, I(d.value), 1)) : S("", !0),
                r("label", yc, [
                  L[23] || (L[23] = j("Name", -1)),
                  y(s(Se), {
                    modelValue: V.name,
                    "onUpdate:modelValue": (R) => V.name = R,
                    placeholder: s(je)(V),
                    "aria-label": "Transition name"
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder"])
                ]),
                y(Hd, {
                  transition: V,
                  process: z.value,
                  draft: e.draft,
                  "board-id": e.boardId,
                  guards: Q.value,
                  onValidity: (R, D) => l("validity", z.value.id + ":transition-" + V.id + ":" + R, D)
                }, null, 8, ["transition", "process", "draft", "board-id", "guards", "onValidity"])
              ], 64))), 128))
            ], 40, rc)) : S("", !0)
          ]),
          _: 1
        })
      ], 2)) : (n(), K(s(_), {
        key: 2,
        label: "New process",
        severity: "secondary",
        outlined: "",
        onClick: L[13] || (L[13] = (V) => u.value = !0)
      }, {
        icon: q(() => [
          y(s(pe), { icon: "tabler:plus" })
        ]),
        _: 1
      })),
      z.value ? (n(), K(Ne, {
        key: 3,
        class: "work-disclosure",
        label: "Advanced workflow settings"
      }, {
        default: q(() => [
          r("div", kc, [
            r("label", wc, [
              L[24] || (L[24] = j("Workflow name", -1)),
              y(s(Se), {
                modelValue: z.value.name,
                "onUpdate:modelValue": L[14] || (L[14] = (V) => z.value.name = V),
                "aria-label": "Workflow name"
              }, null, 8, ["modelValue"])
            ]),
            x.value.length ? (n(), b("p", Vc, "Some item limits belong to removed states.")) : S("", !0),
            (n(!0), b(ee, null, ue(x.value, (V, R) => (n(), K(s(_), {
              key: V,
              label: "Clear limit for removed state " + (R + 1),
              severity: "secondary",
              text: "",
              onClick: (D) => delete e.draft.policy.wip[V]
            }, null, 8, ["label", "onClick"]))), 128)),
            y(s(_), {
              label: "Remove workflow",
              severity: "danger",
              text: "",
              size: "small",
              onClick: L[15] || (L[15] = (V) => $e(z.value))
            })
          ])
        ]),
        _: 1
      })) : S("", !0),
      y(Cl, {
        visible: u.value,
        label: "New process",
        onClose: L[18] || (L[18] = (V) => u.value = !1)
      }, {
        default: q(() => [
          r("form", {
            class: "work-dialog-box",
            "aria-label": "New process",
            onSubmit: Ee(M, ["stop", "prevent"])
          }, [
            L[26] || (L[26] = r("h2", null, "New process", -1)),
            r("label", $c, [
              L[25] || (L[25] = j("Name", -1)),
              y(s(Se), {
                modelValue: f.value,
                "onUpdate:modelValue": L[16] || (L[16] = (V) => f.value = V),
                "aria-label": "New process name",
                autofocus: "",
                required: ""
              }, null, 8, ["modelValue"])
            ]),
            r("div", xc, [
              y(s(_), {
                label: "Cancel",
                severity: "secondary",
                outlined: "",
                onClick: L[17] || (L[17] = (V) => u.value = !1)
              }),
              y(s(_), {
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
}), Sc = {
  class: "work-settings-card work-stack",
  "aria-label": "Existing items"
}, Tc = {
  key: 0,
  class: "work-stack work-tight"
}, Ic = { class: "work-row" }, Dc = /* @__PURE__ */ Ve({
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
    return (t, l) => (n(), b("section", Sc, [
      l[2] || (l[2] = r("h3", { class: "work-row-title" }, "Items in changed states", -1)),
      (n(!0), b(ee, null, ue(e.removed, ({ process: o, state: u, count: f }) => (n(), b("label", {
        key: o.id + "/" + u.id,
        class: "work-stack work-tight"
      }, [
        j(" Move " + I(a(f)) + " from " + I(s(ke)(u)) + " to ", 1),
        y(s(fe), {
          disabled: e.disabled,
          "model-value": o.map?.[u.id],
          "aria-label": "Move items from " + s(ke)(u) + " to",
          placeholder: "Choose a state",
          appendTo: "self",
          optionLabel: "label",
          optionValue: "value",
          options: o.states.map((m) => ({ label: s(ke)(m), value: m.id })),
          "onUpdate:modelValue": (m) => t.$emit("destination", o, u.id, m)
        }, null, 8, ["disabled", "model-value", "aria-label", "options", "onUpdate:modelValue"])
      ]))), 128)),
      e.renamed.length ? (n(), b("div", Tc, [
        (n(!0), b(ee, null, ue(e.renamed, ({ process: o, state: u, count: f, name: m }) => (n(), b("p", {
          key: o.id + "/" + u.id
        }, [
          j(I(s(ke)(u)) + " becomes ", 1),
          r("strong", null, I(m), 1),
          j(" for " + I(a(f)) + ". ", 1)
        ]))), 128)),
        r("label", Ic, [
          y(s(Bt), {
            binary: "",
            "model-value": e.confirmed,
            disabled: e.disabled,
            "onUpdate:modelValue": l[0] || (l[0] = (o) => t.$emit("update:confirmed", o))
          }, null, 8, ["model-value", "disabled"]),
          l[1] || (l[1] = j(" Keep these items in their renamed states ", -1))
        ])
      ])) : S("", !0)
    ]));
  }
}), Uc = {
  class: "work-stack",
  "aria-label": "Links editor"
}, Ec = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, Ac = { class: "work-definition-meta work-muted work-small" }, Oc = { class: "work-settings-grid" }, Pc = { class: "work-stack work-tight" }, Rc = { class: "work-stack work-tight" }, Nc = { class: "work-stack work-tight" }, Mc = { class: "work-row" }, Fc = {
  key: 0,
  class: "work-muted work-small"
}, Lc = {
  key: 1,
  class: "work-settings-grid"
}, Bc = { class: "work-stack work-tight" }, zc = {
  key: 0,
  class: "work-chips"
}, jc = { class: "work-stack work-tight" }, Wc = { class: "work-relation-preview work-small" }, qc = { class: "work-muted" }, Gc = {
  key: 0,
  class: "kx-empty"
}, Kc = /* @__PURE__ */ Ve({
  __name: "RelationsEditor",
  props: {
    draft: {},
    guardRemoval: { type: Function }
  },
  setup(e) {
    const a = e, t = W(() => a.draft.relation_types ?? []), l = W(() => (a.draft.item_types ?? []).map((w) => ({ value: w.id, label: w.title || Oe(w.id) })));
    function o(w, v, g) {
      g.length ? w[v] = g : delete w[v];
    }
    function u(w, v) {
      if (!/^[a-z][a-z0-9_]{0,39}$/.test(v)) return "Start with a lowercase letter and use only lowercase letters, numbers or underscores.";
      if (w.to_types?.includes(v)) return "This ID is already in use.";
    }
    function f(w, v) {
      o(w, "to_types", [...w.to_types ?? [], v]);
    }
    const m = B(""), d = B(!1);
    function i(w) {
      const v = w.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, ""), g = (/^[a-z]/.test(v) ? v : "link_" + (v || "new")).slice(0, 40);
      let k = g, T = 2;
      for (; t.value.some(($) => $.id === k); ) {
        const $ = "_" + T++;
        k = g.slice(0, 40 - $.length) + $;
      }
      return k;
    }
    function c(w) {
      (a.draft.relation_types ??= []).push({ id: i(w), outward: w, inward: w, cardinality: "many" });
    }
    async function p(w) {
      if (!d.value) {
        d.value = !0, m.value = "";
        try {
          const v = await a.guardRemoval?.("relation_types", w);
          v ? m.value = v : Ta(a.draft, "relation_types", w);
        } finally {
          d.value = !1;
        }
      }
    }
    return (w, v) => (n(), b("section", Uc, [
      m.value ? (n(), b("p", Ec, I(m.value), 1)) : S("", !0),
      y(Qa, {
        columns: "relations",
        count: t.value.length
      }, {
        default: q(() => [
          (n(!0), b(ee, null, ue(t.value, (g, k) => (n(), K(Za, {
            title: g.outward || s(Oe)(g.id),
            kind: g.symmetric ? "Same both ways" : "Different each way",
            key: k,
            class: "work-stack"
          }, {
            usage: q(() => [
              r("span", Ac, I(g.outward || "Related work") + " · " + I(g.inward || "Reverse relation"), 1)
            ]),
            actions: q(() => [
              y(s(_), {
                severity: "secondary",
                text: "",
                disabled: d.value,
                onClick: (T) => p(g.id),
                "aria-label": "Remove link type",
                size: "small"
              }, {
                default: q(() => [
                  y(s(pe), {
                    icon: "tabler:trash",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["disabled", "onClick"])
            ]),
            default: q(() => [
              r("div", Oc, [
                r("label", Pc, [
                  v[0] || (v[0] = j("Shown on this item ", -1)),
                  y(s(Se), {
                    modelValue: g.outward,
                    "onUpdate:modelValue": (T) => g.outward = T,
                    "aria-label": "Shown on this item"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                r("label", Rc, [
                  v[1] || (v[1] = j("Shown on the other item ", -1)),
                  y(s(Se), {
                    modelValue: g.inward,
                    "onUpdate:modelValue": (T) => g.inward = T,
                    "aria-label": "Shown on the other item"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                r("label", Nc, [
                  v[2] || (v[2] = j("Links allowed ", -1)),
                  y(s(fe), {
                    "model-value": g.cardinality ?? "many",
                    "onUpdate:modelValue": (T) => g.cardinality = T,
                    "aria-label": "Links allowed",
                    appendTo: "self",
                    optionLabel: "label",
                    optionValue: "value",
                    optionDisabled: "disabled",
                    options: [{ label: "One link", value: "one", disabled: !1 }, { label: "Many links", value: "many", disabled: !1 }]
                  }, null, 8, ["model-value", "onUpdate:modelValue"])
                ]),
                r("label", Mc, [
                  y(s(Bt), {
                    modelValue: g.symmetric,
                    "onUpdate:modelValue": (T) => g.symmetric = T,
                    disabled: !!(g.from_types?.length || g.to_types?.length),
                    "aria-label": "Same meaning in both directions",
                    binary: ""
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"]),
                  v[3] || (v[3] = j("Same meaning in both directions ", -1))
                ])
              ]),
              g.from_types?.length || g.to_types?.length ? (n(), b("p", Fc, " Clear the source and target types to use the same meaning in both directions. ")) : S("", !0),
              g.symmetric ? S("", !0) : (n(), b("div", Lc, [
                y(vt, {
                  label: "Source item types",
                  options: l.value,
                  "model-value": g.from_types,
                  "onUpdate:modelValue": (T) => o(g, "from_types", T)
                }, null, 8, ["options", "model-value", "onUpdate:modelValue"]),
                r("div", Bc, [
                  v[4] || (v[4] = r("p", { class: "work-muted work-small" }, "Use the type ID from this board or a peer board. Leave either end empty to allow any type there.", -1)),
                  g.to_types?.length ? (n(), b("div", zc, [
                    (n(!0), b(ee, null, ue(g.to_types, (T) => (n(), K(s(_), {
                      key: T,
                      severity: "secondary",
                      text: "",
                      size: "small",
                      label: T + " ×",
                      "aria-label": "Remove target type " + T,
                      onClick: ($) => o(g, "to_types", g.to_types.filter((C) => C !== T))
                    }, null, 8, ["label", "aria-label", "onClick"]))), 128))
                  ])) : S("", !0),
                  y(xa, {
                    action: "Add target type",
                    label: "Target type ID",
                    maxlength: 40,
                    validate: (T) => u(g, T),
                    onAdd: (T) => f(g, T)
                  }, null, 8, ["validate", "onAdd"])
                ])
              ])),
              y(Ne, {
                class: "work-disclosure",
                label: "Advanced link settings"
              }, {
                default: q(() => [
                  r("label", jc, [
                    v[5] || (v[5] = j("Identifier ", -1)),
                    y(s(Se), {
                      modelValue: g.id,
                      "onUpdate:modelValue": (T) => g.id = T,
                      required: "",
                      pattern: "[a-z][a-z0-9_]*",
                      "aria-label": "Relation ID"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ])
                ]),
                _: 2
              }, 1024),
              r("p", Wc, [
                v[6] || (v[6] = r("strong", null, "This item", -1)),
                j(" " + I(g.outward || "relates to") + " ", 1),
                v[7] || (v[7] = r("strong", null, "another item", -1)),
                r("span", qc, " · reverse: " + I(g.symmetric ? g.outward : g.inward), 1)
              ])
            ]),
            _: 2
          }, 1032, ["title", "kind"]))), 128)),
          t.value.length ? S("", !0) : (n(), b("p", Gc, "No link types yet. Add one to connect related work.")),
          y(xa, {
            action: "Add link type",
            label: "Link name",
            onAdd: c
          })
        ]),
        _: 1
      }, 8, ["count"])
    ]));
  }
});
function _o(e) {
  return typeof e.error == "string" ? e.error : e.error?.message;
}
function go(e, a) {
  const t = _o(e);
  return e.parked ? "Stopped: " + (t ?? "Projection is parked") : t ? "Degraded: " + t : e.bootstrapping ? "Initializing" : e.last_seq >= a ? "Up to date" : "Catching up";
}
function Hc(e, a) {
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
  if (o.some((u) => u.parked)) return { kind: "reset", status: "Needs reset" };
  if (o.some(_o)) return { kind: "degraded", status: "Degraded" };
}
const Yc = {
  class: "work-stack",
  "aria-label": "Plugins editor"
}, Xc = {
  key: 0,
  class: "kx-loading"
}, Jc = {
  key: 1,
  class: "kx-err",
  role: "alert"
}, Zc = {
  key: 2,
  class: "work-notice",
  role: "status"
}, Qc = { class: "work-block work-small work-error" }, _c = {
  key: 0,
  class: "work-muted work-small"
}, ev = {
  key: 1,
  class: "work-notice"
}, tv = {
  key: 2,
  class: "work-stack work-tight work-plugin-status"
}, av = {
  key: 0,
  class: "work-muted"
}, lv = { key: 1 }, ov = {
  key: 2,
  class: "work-row"
}, iv = {
  key: 3,
  class: "work-row"
}, nv = {
  key: 0,
  class: "work-small"
}, sv = {
  key: 6,
  class: "work-row"
}, rv = {
  key: 7,
  class: "work-row"
}, dv = {
  key: 8,
  class: "work-row"
}, uv = {
  key: 3,
  class: "work-stack work-tight"
}, cv = {
  key: 0,
  class: "work-muted"
}, vv = { class: "work-form-actions" }, mv = "kickside.work.planning:plugin", yo = /* @__PURE__ */ Ve({
  __name: "PluginsEditor",
  props: /* @__PURE__ */ _l({
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
  emits: /* @__PURE__ */ _l(["configured", "refresh", "review", "validity"], ["update:activeConfigs"]),
  setup(e, { emit: a }) {
    const t = e, l = a, o = yi(e, "activeConfigs"), u = B(""), f = B(""), m = B(""), d = B(/* @__PURE__ */ new Set()), i = B({}), c = B(/* @__PURE__ */ new Set()), p = W(() => t.options.map((O) => {
      const Q = ie(O.plugin);
      return { plugin: O, current: Q, issue: Hc(O, Q) };
    })), w = W(() => !!u.value || t.disabled), v = W(() => w.value || t.activationLocked), g = {}, k = W(() => (t.draft.item_types ?? []).filter((O) => !["issue", "sprint", "milestone"].includes(O.id)).map((O) => ({ value: O.id, label: O.title || Oe(O.id) }))), T = W(() => ["current_sprint", "milestone"].every((O) => t.schema.compiled?.fields?.some((Q) => Q.code === O))), $ = W(() => {
      const O = t.filters;
      return O ? (t.draft.scopes ?? []).filter((Q) => !O.some((x) => x.id === Q && t.options.some((M) => M.plugin === x.plugin))) : [];
    });
    function C(O) {
      return (t.filters ?? []).filter((Q) => Q.plugin === O);
    }
    function N(O, Q) {
      const x = new Set(C(O).map((X) => X.id)), M = t.draft.scopes ?? [], E = [...M.filter((X) => !x.has(X)), ...Q];
      (E.length !== M.length || E.some((X) => !M.includes(X))) && (t.draft.scopes = E);
    }
    function F(O, Q) {
      te(O, { ...be(O), issue_types: Q });
    }
    function z(O) {
      return !!O.config_schema && Uo(O.config_schema).length > 0;
    }
    function ie(O) {
      return t.schema.plugins?.find((Q) => Q.plugin === O);
    }
    function le(O) {
      return ie(O)?.active === !0;
    }
    function de(O) {
      return t.draft.plugins?.some((Q) => Q.use === O) === !0;
    }
    function Z(O, Q) {
      const x = t.draft.plugins ?? [];
      Q && !de(O) && (t.draft.plugins = [...x, { use: O }]), Q || (t.draft.plugins = x.filter((M) => M.use !== O), delete t.configs[O], d.value.delete(O), l("validity", O, !0), N(O, []));
    }
    function ve(O, Q) {
      Z(O, !1), l("review", Q.currentTarget);
    }
    function be(O) {
      return le(O) ? o.value[O] ?? ie(O)?.config ?? g : t.configs[O] ?? g;
    }
    function te(O, Q) {
      le(O) ? o.value = { ...o.value, [O]: Q } : t.configs[O] = Q;
    }
    function U(O) {
      if (le(O)) {
        const Q = { ...o.value };
        delete Q[O], o.value = Q;
      } else delete t.configs[O];
    }
    function Y(O, Q) {
      Q ? d.value.delete(O) : d.value.add(O), le(O) || l("validity", O, Q);
    }
    async function P(O) {
      await Ao.confirm({
        header: "Reset projection?",
        message: "Resetting can rebuild from current items or replay retained events, depending on the projection.",
        acceptLabel: "Reset projection",
        rejectLabel: "Cancel"
      }) && await me(O, !0);
    }
    async function me(O, Q = !1) {
      if (!(w.value || !Q && d.value.has(O))) {
        u.value = O, f.value = "", m.value = "";
        try {
          Q ? await Ct.configure(t.boardId, O) : (await Ct.configure(t.boardId, O, be(O)), U(O), c.value.delete(O)), m.value = Q ? "Plugin recovery started." : "Plugin configuration saved.", l("configured");
        } catch (x) {
          f.value = nt(x, Q ? "Could not recover the plugin." : "Could not configure plugin.");
        } finally {
          u.value = "";
        }
      }
    }
    return (O, Q) => (n(), b("section", Yc, [
      e.options.length ? S("", !0) : (n(), b("p", Xc, "No installed plugins are visible to you.")),
      f.value ? (n(), b("div", Jc, I(f.value), 1)) : S("", !0),
      m.value ? (n(), b("p", Zc, I(m.value), 1)) : S("", !0),
      y(Qa, {
        columns: "plugins",
        count: e.options.length
      }, {
        default: q(() => [
          (n(!0), b(ee, null, ue(p.value, ({ plugin: x, current: M, issue: E }) => (n(), K(Za, {
            key: x.plugin,
            title: x.installed === !1 ? x.plugin : x.title || x.plugin,
            description: x.description,
            kind: de(x.plugin) && d.value.has(x.plugin) ? "Configuration needed" : de(x.plugin) !== le(x.plugin) ? "Pending review" : E?.status,
            class: "work-stack"
          }, Pl({
            actions: q(() => [
              E?.kind !== "missing" ? (n(), K(s(et), {
                key: 0,
                "model-value": de(x.plugin),
                "aria-label": "Enable " + (x.title || x.plugin),
                disabled: v.value || !!x.problem && !de(x.plugin),
                "onUpdate:modelValue": (X) => Z(x.plugin, X)
              }, null, 8, ["model-value", "aria-label", "disabled", "onUpdate:modelValue"])) : S("", !0)
            ]),
            default: q(() => [
              x.requires.length ? (n(), b("p", _c, "Requires " + I(x.requires.map((X) => e.options.find((h) => h.plugin === X)?.title || "Another capability").join(", ")), 1)) : S("", !0),
              M?.outdated ? (n(), b("p", ev, "The stored declaration differs from the installed plugin. Review activation to update it.")) : S("", !0),
              E || M?.active ? (n(), b("div", tv, [
                E && "cause" in E ? (n(), b("p", av, I(E.cause), 1)) : E ? S("", !0) : (n(), b("p", lv, I(M?.lifecycle.state === "ready" ? "Ready to use" : "Getting ready"), 1)),
                (n(!0), b(ee, null, ue(M?.projections, (X, h) => (n(), b("div", {
                  key: h,
                  class: "work-stack work-tight"
                }, [
                  r("p", null, I(s(go)(X, e.schema.as_of)) + " · Indexed through " + I(X.last_seq) + " of " + I(e.schema.as_of) + " events.", 1)
                ]))), 128)),
                E?.kind === "setup" && M?.active ? (n(), b("div", ov, [
                  y(s(_), {
                    label: "Retry setup",
                    severity: "secondary",
                    outlined: "",
                    disabled: w.value,
                    onClick: (X) => me(x.plugin, !0)
                  }, null, 8, ["disabled", "onClick"])
                ])) : E?.kind === "provider" ? (n(), b("div", iv, [
                  y(s(_), {
                    label: "Retry schema check",
                    severity: "secondary",
                    outlined: "",
                    disabled: w.value,
                    onClick: Q[0] || (Q[0] = (X) => l("refresh"))
                  }, null, 8, ["disabled"])
                ])) : E?.kind === "degraded" ? (n(), K(Ne, {
                  key: 4,
                  class: "work-small",
                  label: "Inspect worker"
                }, {
                  default: q(() => [
                    Q[1] || (Q[1] = r("p", null, "Check the failing worker before resetting a projection.", -1)),
                    (n(!0), b(ee, null, ue(M?.projections, (X, h) => (n(), b("p", { key: h }, I(h) + " · " + I(s(go)(X, e.schema.as_of)), 1))), 128))
                  ]),
                  _: 2
                }, 1024)) : E?.kind === "history" ? (n(), b(ee, { key: 5 }, [
                  E.floor !== void 0 ? (n(), b("p", nv, "Earliest retained event sequence is " + I(E.floor) + ".", 1)) : S("", !0),
                  y(Ne, {
                    class: "work-small",
                    label: "Review retained history"
                  }, {
                    default: q(() => [...Q[2] || (Q[2] = [
                      r("p", null, "Ask the plugin maintainer to review the event projection’s start sequence. The plugin needs a declaration that can run with the retained history.", -1)
                    ])]),
                    _: 1
                  })
                ], 64)) : E?.kind === "reset" ? (n(), b("div", sv, [
                  y(s(_), {
                    label: "Reset projection",
                    severity: "secondary",
                    outlined: "",
                    disabled: w.value,
                    onClick: (X) => P(x.plugin)
                  }, null, 8, ["disabled", "onClick"]),
                  Q[3] || (Q[3] = r("span", { class: "work-muted work-small" }, "Resolve the worker error before resetting.", -1))
                ])) : E?.kind === "configuration" && de(x.plugin) && z(x) && !c.value.has(x.plugin) ? (n(), b("div", rv, [
                  y(s(_), {
                    label: "Edit configuration",
                    severity: "secondary",
                    outlined: "",
                    disabled: w.value,
                    onClick: (X) => c.value.add(x.plugin)
                  }, null, 8, ["disabled", "onClick"])
                ])) : E?.kind === "missing" && de(x.plugin) ? (n(), b("div", dv, [
                  y(s(_), {
                    label: "Review references",
                    severity: "secondary",
                    outlined: "",
                    disabled: v.value,
                    onClick: (X) => ve(x.plugin, X)
                  }, null, 8, ["disabled", "onClick"])
                ])) : S("", !0)
              ])) : S("", !0),
              C(x.plugin).length && (de(x.plugin) || le(x.plugin)) ? (n(), b("section", uv, [
                Q[4] || (Q[4] = r("h4", null, "Query filters", -1)),
                Q[5] || (Q[5] = r("p", { class: "work-muted" }, "Choose which filters people can use to narrow down work on this board.", -1)),
                y(vt, {
                  label: "Available filters",
                  disabled: !!u.value || e.disabled || !de(x.plugin),
                  options: C(x.plugin).map((X) => ({ value: X.id, label: X.title })),
                  "model-value": e.draft.scopes?.filter((X) => C(x.plugin).some((h) => h.id === X)),
                  "onUpdate:modelValue": (X) => N(x.plugin, X)
                }, null, 8, ["disabled", "options", "model-value", "onUpdate:modelValue"])
              ])) : S("", !0),
              de(x.plugin) && z(x) && E?.kind !== "manifest" && E?.kind !== "missing" && (E?.kind !== "configuration" || c.value.has(x.plugin)) ? (n(), K(oa(E && E.kind !== "configuration" ? Ne : "div"), {
                key: 4,
                label: E && E.kind !== "configuration" ? "Plugin settings" : void 0,
                class: "work-stack work-tight"
              }, {
                default: q(() => [
                  x.plugin === mv ? (n(), b(ee, { key: 0 }, [
                    T.value ? (n(), K(vt, {
                      key: 1,
                      label: "Plan these item types",
                      options: k.value,
                      "model-value": be(x.plugin).issue_types,
                      disabled: !!u.value || e.disabled,
                      "onUpdate:modelValue": (X) => F(x.plugin, X)
                    }, null, 8, ["options", "model-value", "disabled", "onUpdate:modelValue"])) : (n(), b("p", cv, "The Planning pack supplies sprint and milestone fields for item types.")),
                    Q[6] || (Q[6] = r("p", { class: "work-muted" }, "Selected types get Current sprint and Milestone fields.", -1))
                  ], 64)) : (n(), K(Do, {
                    key: 1,
                    disabled: !!u.value || e.disabled,
                    schema: x.config_schema,
                    "model-value": be(x.plugin),
                    "suggest-defaults": "",
                    "onUpdate:modelValue": (X) => te(x.plugin, X),
                    onValidity: (X) => Y(x.plugin, X),
                    onValidationMessage: (X) => i.value[x.plugin] = X
                  }, null, 8, ["disabled", "schema", "model-value", "onUpdate:modelValue", "onValidity", "onValidationMessage"])),
                  r("div", vv, [
                    y(s(_), {
                      label: E ? "Reset form values" : "Reset",
                      severity: "secondary",
                      outlined: "",
                      disabled: !!u.value || e.disabled,
                      onClick: (X) => U(x.plugin)
                    }, null, 8, ["label", "disabled", "onClick"]),
                    le(x.plugin) ? (n(), K(s(_), {
                      key: 0,
                      label: "Save plugin settings",
                      disabled: !!u.value || e.disabled || d.value.has(x.plugin) || !o.value[x.plugin],
                      loading: u.value === x.plugin,
                      onClick: (X) => me(x.plugin)
                    }, null, 8, ["disabled", "loading", "onClick"])) : S("", !0)
                  ])
                ]),
                _: 2
              }, 1032, ["label"])) : S("", !0)
            ]),
            _: 2
          }, [
            de(x.plugin) && i.value[x.plugin] ? {
              name: "status",
              fn: q(() => [
                r("span", Qc, I(i.value[x.plugin]), 1)
              ]),
              key: "0"
            } : void 0
          ]), 1032, ["title", "description", "kind"]))), 128))
        ]),
        _: 1
      }, 8, ["count"]),
      $.value.length ? (n(), K(Ne, {
        key: 3,
        class: "work-settings-card work-disclosure",
        label: "Unavailable query filters"
      }, {
        default: q(() => [
          Q[7] || (Q[7] = r("p", { class: "work-muted" }, "These filters came from a plugin that is unavailable. Remove one to stop using it on this board.", -1)),
          (n(!0), b(ee, null, ue($.value, (x, M) => (n(), K(s(_), {
            key: x,
            label: "Remove unavailable filter " + (M + 1),
            severity: "secondary",
            text: "",
            onClick: (E) => e.draft.scopes = e.draft.scopes?.filter((X) => X !== x)
          }, null, 8, ["label", "onClick"]))), 128))
        ]),
        _: 1
      })) : S("", !0),
      (n(!0), b(ee, null, ue(e.draft.plugins?.filter((x) => !e.options.some((M) => M.plugin === x.use)) ?? [], (x) => (n(), b("article", {
        key: x.use,
        class: "work-settings-card work-stack"
      }, [
        r("p", null, [
          r("strong", null, I(x.use), 1),
          Q[8] || (Q[8] = j(" · Not installed", -1))
        ]),
        Q[9] || (Q[9] = r("p", { class: "work-muted" }, "This board still references a plugin that is no longer installed.", -1)),
        y(s(_), {
          label: "Review references",
          severity: "secondary",
          outlined: "",
          disabled: v.value,
          onClick: (M) => ve(x.use, M)
        }, null, 8, ["disabled", "onClick"])
      ]))), 128))
    ]));
  }
}), fv = { class: "system-section-head" }, pv = { class: "system-section-head-text" }, bv = {
  key: 0,
  class: "kx-head-actions"
}, hv = /* @__PURE__ */ Ve({
  __name: "SettingsSectionHead",
  props: {
    title: {},
    description: {}
  },
  setup(e) {
    return (a, t) => (n(), b("header", fv, [
      r("div", pv, [
        r("h1", null, I(e.title), 1),
        r("p", null, I(e.description), 1)
      ]),
      a.$slots.actions ? (n(), b("div", bv, [
        Xe(a.$slots, "actions")
      ])) : S("", !0)
    ]));
  }
}), gv = /* @__PURE__ */ Ve({
  __name: "SettingsDraftActions",
  props: {
    busy: { type: Boolean },
    discardDisabled: { type: Boolean },
    reviewDisabled: { type: Boolean }
  },
  emits: ["discard", "review"],
  setup(e) {
    return (a, t) => (n(), b(ee, null, [
      y(s(tt), {
        severity: "warn",
        value: "Unsaved changes"
      }),
      y(s(_), {
        label: "Discard",
        type: "button",
        severity: "secondary",
        outlined: "",
        disabled: e.busy || e.discardDisabled,
        onClick: t[0] || (t[0] = (l) => a.$emit("discard"))
      }, {
        icon: q(() => [
          y(s(pe), {
            icon: "tabler:restore",
            "aria-hidden": "true"
          })
        ]),
        _: 1
      }, 8, ["disabled"]),
      y(s(_), {
        label: "Review changes",
        type: "button",
        disabled: e.busy || e.reviewDisabled,
        loading: e.busy,
        onClick: t[1] || (t[1] = (l) => a.$emit("review", l.currentTarget))
      }, null, 8, ["disabled", "loading"])
    ], 64));
  }
}), yv = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, kv = ["config"], wv = /* @__PURE__ */ Ve({
  __name: "BoardShare",
  props: {
    board: {},
    busy: { type: Boolean }
  },
  emits: ["shared"],
  setup(e) {
    const a = e, t = B(!1), l = B(!1), o = B("");
    async function u() {
      const m = a.board;
      if (!(a.busy || l.value)) {
        l.value = !0, o.value = "";
        try {
          const d = await Ut("kickside-share");
          if (a.board.board_id !== m.board_id) return;
          d ? t.value = !0 : o.value = "Sharing is unavailable. Try opening it again.";
        } finally {
          l.value = !1;
        }
      }
    }
    Ie(() => a.board.board_id, () => {
      t.value = !1, o.value = "";
    });
    const f = W(() => {
      const m = encodeURIComponent(a.board.board_id);
      return JSON.stringify({
        resource_id: a.board.board_id,
        title: a.board.title,
        access_url: "/api/v1/component-access/grants/" + m,
        share_url: "/api/v1/component-access/share/" + m
      });
    });
    return (m, d) => (n(), b(ee, null, [
      y(s(_), {
        label: "Share board",
        severity: "secondary",
        outlined: "",
        loading: l.value,
        disabled: e.busy,
        onClick: u
      }, {
        icon: q(() => [
          y(s(pe), {
            icon: "tabler:share",
            "aria-hidden": "true"
          })
        ]),
        _: 1
      }, 8, ["loading", "disabled"]),
      o.value ? (n(), b("p", yv, I(o.value), 1)) : S("", !0),
      t.value ? (n(), b("kickside-share", {
        key: 1,
        config: f.value,
        onClose: d[0] || (d[0] = (i) => t.value = !1),
        onChanged: d[1] || (d[1] = (i) => m.$emit("shared"))
      }, null, 40, kv)) : S("", !0)
    ], 64));
  }
}), Vv = {
  class: "work-stack",
  "aria-label": "Board visibility"
}, $v = { class: "work-stack work-tight" }, xv = {
  key: 0,
  class: "work-settings-list"
}, Cv = { class: "work-row-main" }, Sv = { class: "work-small work-muted" }, Tv = { class: "work-row-control" }, Iv = { class: "work-row" }, Dv = /* @__PURE__ */ Ve({
  __name: "VisibilityEditor",
  props: {
    draft: {},
    boardId: {}
  },
  emits: ["validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = W(() => t.draft.visibility), u = W(() => (t.draft.fields ?? []).filter((p) => p.form === "text" && (!p.cardinality || p.cardinality === "one") && p.type !== "rollup" && p.index !== "number" && p.config?.case !== "insensitive")), f = W(() => u.value.find((p) => p.code === o.value?.field)?.type !== "option");
    function m(p) {
      if (o.value?.levels.some((w) => w.id === p)) return "This level is already in use.";
    }
    function d(p) {
      o.value?.levels.push({ id: p, holders: [] });
    }
    function i(p) {
      if (!p) {
        delete t.draft.visibility;
        return;
      }
      const w = u.value.find((v) => v.code === p);
      t.draft.visibility = { field: p, levels: (w?.options ?? []).map((v) => ({ id: v.id, holders: [] })) };
    }
    function c(p, w) {
      const v = o.value?.levels.find((g) => g.id === p);
      v && (v.holders = w ?? []);
    }
    return (p, w) => (n(), b("section", Vv, [
      w[7] || (w[7] = r("h3", { class: "work-group-title" }, "Board visibility", -1)),
      w[8] || (w[8] = r("p", { class: "work-small work-muted" }, "Restrict items by their visibility level. People still need access to the board.", -1)),
      r("label", $v, [
        w[5] || (w[5] = j("Visibility field ", -1)),
        y(s(fe), {
          "aria-label": "Visibility field",
          "model-value": o.value?.field ?? "",
          options: [{ label: "No additional restriction", value: "" }, ...u.value.map((v) => ({ label: s(He)(v), value: v.code }))],
          optionLabel: "label",
          optionValue: "value",
          appendTo: "self",
          "onUpdate:modelValue": i
        }, null, 8, ["model-value", "options"])
      ]),
      o.value ? (n(), b(ee, { key: 0 }, [
        o.value.levels.length ? (n(), b("div", xv, [
          (n(!0), b(ee, null, ue(o.value.levels, (v, g) => (n(), b("div", {
            key: v.id,
            class: "work-settings-row"
          }, [
            r("div", Cv, [
              r("strong", null, I(u.value.find((k) => k.code === o.value.field)?.options?.find((k) => k.id === v.id)?.label || v.id), 1),
              r("p", Sv, "Level " + I(g + 1), 1)
            ]),
            r("div", Tv, [
              y(No, {
                "board-id": e.boardId,
                label: "Who can see these items",
                "model-value": v.holders,
                "onUpdate:modelValue": (k) => c(v.id, k),
                onValidity: w[0] || (w[0] = (k) => l("validity", k))
              }, null, 8, ["board-id", "model-value", "onUpdate:modelValue"])
            ])
          ]))), 128))
        ])) : S("", !0),
        f.value ? (n(), K(xa, {
          key: o.value.field,
          action: "Add level",
          label: "New visibility level",
          validate: m,
          onAdd: d
        })) : S("", !0),
        r("label", Iv, [
          y(s(et), {
            "model-value": o.value.bypass === "admin",
            "onUpdate:modelValue": w[1] || (w[1] = (v) => v ? o.value.bypass = "admin" : delete o.value.bypass)
          }, null, 8, ["model-value"]),
          w[6] || (w[6] = j(" Board administrators can see every level ", -1))
        ]),
        y(s(_), {
          label: "Remove visibility restriction",
          severity: "secondary",
          text: "",
          onClick: w[2] || (w[2] = (v) => delete e.draft.visibility)
        })
      ], 64)) : S("", !0),
      y(Et, {
        label: "Visibility rules",
        "model-value": o.value,
        shape: "object",
        example: { field: "visibility", levels: [{ id: "internal", holders: [] }], bypass: "admin" },
        "onUpdate:modelValue": w[3] || (w[3] = (v) => e.draft.visibility = v),
        onValidity: w[4] || (w[4] = (v) => l("validity", v))
      }, null, 8, ["model-value"])
    ]));
  }
}), Uv = { class: "work-ia-section" }, Ev = {
  class: "work-settings-list",
  "aria-labelledby": "work-sharing-title"
}, Av = { class: "work-settings-row" }, Ov = { class: "work-row-main" }, Pv = {
  key: 0,
  class: "work-muted work-small"
}, Rv = {
  key: 0,
  class: "work-member-preview",
  "aria-label": "People and groups with direct access"
}, Nv = { class: "work-spacer" }, Mv = {
  key: 1,
  class: "work-settings-row work-muted work-small"
}, Fv = {
  key: 2,
  class: "work-settings-row work-muted"
}, Lv = {
  key: 3,
  class: "work-settings-row"
}, Bv = {
  key: 4,
  class: "work-settings-row work-muted",
  role: "status"
}, zv = /* @__PURE__ */ Ve({
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
    const a = e, t = B(), l = B([]), o = W(() => t.value?.filter((g) => g.subject_type === "group").length ?? 0), u = W(() => (t.value?.length ?? 0) - o.value), f = W(() => [...t.value ?? []].sort((g, k) => +!!k.owner - +!!g.owner || k.access_mask - g.access_mask).slice(0, 6).map((g) => ({ ...g, permissions: c(g) }))), m = W(() => f.value.map((g) => ({ id: g.subject_id, kind: g.subject_type ?? "user" }))), d = Eo(() => a.boardId, m);
    function i(g) {
      return g.full_name || d.label({ id: g.subject_id, kind: g.subject_type ?? "user", email: g.email });
    }
    function c(g) {
      return g.owner ? "Owner" : l.value.filter((k) => (g.access_mask & k.bit) === k.bit).map((k) => k.label).join(", ");
    }
    const p = B(!1), w = ga();
    async function v() {
      const g = w();
      p.value = !1;
      try {
        const [{ data: k }, T] = await Promise.all([
          Sl.get("/api/v1/component-access/grants/" + encodeURIComponent(a.boardId)),
          Sl.get("/api/v1/components/access-model")
        ]);
        if (!g()) return;
        if (!k?.success || !Array.isArray(k.access)) throw new Error("Grants unavailable");
        t.value = k.access, l.value = T.data?.success && Array.isArray(T.data.capabilities) ? T.data.capabilities : [];
      } catch {
        g() && (t.value = void 0, p.value = !0);
      }
    }
    return Rl(() => w()), Ie(() => [a.active, a.boardId], () => {
      a.active && v();
    }, { immediate: !0 }), (g, k) => (n(), b("section", Uv, [
      r("section", Ev, [
        r("div", Av, [
          r("div", Ov, [
            k[1] || (k[1] = r("h3", {
              id: "work-sharing-title",
              class: "work-row-title"
            }, "Members and sharing", -1)),
            t.value ? (n(), b("p", Pv, I(u.value) + " " + I(u.value === 1 ? "person" : "people") + " and " + I(o.value) + " " + I(o.value === 1 ? "group" : "groups") + " with direct access", 1)) : S("", !0)
          ]),
          e.board ? (n(), K(wv, {
            key: 0,
            board: e.board,
            busy: e.busy,
            onShared: v
          }, null, 8, ["board", "busy"])) : S("", !0)
        ]),
        f.value.length ? (n(), b("ul", Rv, [
          (n(!0), b(ee, null, ue(f.value, (T) => (n(), b("li", {
            key: T.subject_type + T.subject_id,
            class: "work-settings-row"
          }, [
            y(s(pe), {
              icon: T.subject_type === "group" ? "tabler:users" : "tabler:user",
              "aria-hidden": "true"
            }, null, 8, ["icon"]),
            r("strong", Nv, I(i(T)), 1),
            T.permissions ? (n(), K(s(tt), {
              key: 0,
              class: "kx-tag-sm",
              severity: "secondary",
              value: T.permissions
            }, null, 8, ["value"])) : S("", !0)
          ]))), 128))
        ])) : S("", !0),
        t.value && t.value.length > f.value.length ? (n(), b("p", Mv, " See all " + I(t.value.length) + " people and groups under Share board. ", 1)) : t.value && !t.value.length ? (n(), b("p", Fv, "No direct grants yet.")) : p.value ? (n(), b("div", Lv, [
          k[2] || (k[2] = r("p", {
            class: "work-spacer work-muted",
            role: "alert"
          }, "Member summary is unavailable.", -1)),
          y(s(_), {
            label: "Reload members",
            severity: "secondary",
            text: "",
            onClick: v
          })
        ])) : t.value ? S("", !0) : (n(), b("p", Bv, "Loading members…"))
      ]),
      y(Ne, {
        class: "work-disclosure",
        label: e.draft.visibility ? "Advanced · Item visibility rules set" : "Advanced · Item visibility"
      }, {
        default: q(() => [
          y(Dv, {
            "board-id": e.boardId,
            draft: e.draft,
            onValidity: k[0] || (k[0] = (T) => g.$emit("validity", T))
          }, null, 8, ["board-id", "draft"])
        ]),
        _: 1
      }, 8, ["label"])
    ]));
  }
}), jv = { class: "work-settings-row" }, Wv = ["for"], qv = { class: "work-settings-row" }, Gv = { class: "work-row-main" }, Kv = ["id"], Hv = { class: "work-settings-grid" }, Yv = { class: "work-stack work-tight" }, Xv = { class: "work-stack work-tight" }, Jv = ["value", "inert"], Zv = {
  key: 1,
  class: "work-muted work-small"
}, Qv = {
  key: 0,
  class: "work-settings-row"
}, _v = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, em = {
  key: 1,
  class: "work-muted work-small",
  role: "status"
}, tm = {
  key: 1,
  class: "work-board-identity work-stack work-tight"
}, am = { class: "work-stack work-tight" }, lm = { class: "work-stack work-tight" }, om = { class: "work-stack work-tight" }, im = ["value", "inert"], nm = {
  key: 1,
  class: "work-muted work-small"
}, sm = { class: "work-row" }, rm = { class: "work-row" }, dm = { class: "work-row work-board-title" }, um = {
  key: 1,
  class: "work-identity-actions"
}, cm = ["title"], vm = {
  key: 2,
  class: "kx-err work-inline",
  role: "alert"
}, mm = {
  key: 3,
  class: "work-muted work-small",
  role: "status"
}, fm = /* @__PURE__ */ Ve({
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
    const t = e, l = a, o = B(!1), u = B(!1), f = B(""), m = B(""), d = B(""), i = B(""), c = B(!1), p = B(!1), w = B(""), v = B(""), g = W(() => t.board?.access?.admin === !0), k = zt(), T = zt(), $ = B({ title: "", description: "", icon: "", app: "" }), C = W(() => [
      { id: "", title: "Default app" },
      ...t.boardApps ?? [],
      ...t.board?.ui_app && !t.boardApps?.some((U) => U.id === t.board?.ui_app) ? [{ id: t.board.ui_app, title: t.boardApps ? "Unavailable app" : "Configured board app", disabled: !0 }] : []
    ]), N = W(() => C.value.find((U) => U.id === i.value)?.title), F = W(() => !!t.boardApps?.length || !!t.board?.ui_app), z = W(() => ({
      title: t.board?.title ?? "",
      icon: t.board?.icon ?? "",
      description: t.board?.description ?? "",
      app: t.board?.ui_app ?? ""
    }));
    function ie() {
      $.value = z.value, f.value = z.value.title, d.value = z.value.icon, m.value = z.value.description, i.value = z.value.app;
    }
    function le() {
      Ut("wc-icon-picker").then((U) => c.value = U);
    }
    function de() {
      ie(), w.value = "", v.value = "", o.value = !0, le();
    }
    const Z = W(() => {
      const U = {};
      return f.value.trim() !== $.value.title && (U.title = f.value.trim()), m.value !== $.value.description && (U.description = m.value), d.value !== $.value.icon && (U.icon = d.value), i.value !== $.value.app && (U.ui_app = i.value), U;
    }), ve = W(() => (t.detail || o.value) && Object.keys(Z.value).length > 0);
    Ie(z, () => {
      t.detail && !ve.value && ie();
    }, { immediate: !0 }), Ie(u, (U) => {
      U && le();
    }), Ie(g, (U) => {
      U || be();
    }), Ie(ve, (U) => l("dirty-change", U));
    function be() {
      o.value = !1, w.value = "", v.value = "", ie();
    }
    async function te() {
      if (!g.value || !t.board || p.value || !f.value.trim()) return;
      const U = Z.value;
      if (!Object.keys(U).length) {
        o.value = !1, v.value = "Nothing changed.";
        return;
      }
      p.value = !0, w.value = "";
      try {
        const Y = await It.updateBoard(t.board.board_id, U);
        f.value = f.value.trim(), $.value = { title: f.value, description: m.value, icon: d.value, app: i.value }, o.value = !1, v.value = Y.status === "unchanged" ? "Nothing changed." : "Board saved.", l("saved");
      } catch (Y) {
        w.value = nt(Y, "Could not save the board.");
      } finally {
        p.value = !1;
      }
    }
    return (U, Y) => e.detail ? (n(), b("form", {
      key: 0,
      class: "work-board-identity",
      "aria-label": "Edit board details",
      onSubmit: Ee(te, ["prevent"])
    }, [
      r("div", jv, [
        r("label", {
          for: s(k),
          class: "work-row-main work-row-title"
        }, "Board name", 8, Wv),
        y(s(Se), {
          id: s(k),
          modelValue: f.value,
          "onUpdate:modelValue": Y[0] || (Y[0] = (P) => f.value = P),
          required: "",
          disabled: p.value || !g.value
        }, null, 8, ["id", "modelValue", "disabled"])
      ]),
      r("div", qv, [
        r("div", Gv, [
          r("h3", {
            class: "work-row-title",
            id: s(T)
          }, "Board app", 8, Kv),
          Y[9] || (Y[9] = r("p", { class: "work-muted work-small" }, "Opens the board from Work navigation.", -1))
        ]),
        y(s(fe), {
          modelValue: i.value,
          "onUpdate:modelValue": Y[1] || (Y[1] = (P) => i.value = P),
          "aria-labelledby": s(T),
          options: C.value,
          placeholder: N.value,
          optionLabel: "title",
          optionValue: "id",
          optionDisabled: "disabled",
          appendTo: "self",
          disabled: p.value || !g.value || !F.value
        }, null, 8, ["modelValue", "aria-labelledby", "options", "placeholder", "disabled"])
      ]),
      Xe(U.$slots, "default"),
      y(Ne, {
        open: u.value,
        "onUpdate:open": Y[4] || (Y[4] = (P) => u.value = P),
        class: "work-board-appearance",
        label: "Board description and icon"
      }, {
        default: q(() => [
          r("div", Hv, [
            r("label", Yv, [
              Y[10] || (Y[10] = j("Description", -1)),
              y(s(Ca), {
                modelValue: m.value,
                "onUpdate:modelValue": Y[2] || (Y[2] = (P) => m.value = P),
                rows: "1",
                disabled: p.value || !g.value
              }, null, 8, ["modelValue", "disabled"])
            ]),
            r("div", Xv, [
              Y[11] || (Y[11] = r("span", null, "Board icon", -1)),
              c.value ? (n(), b("wc-icon-picker", {
                key: 0,
                value: d.value,
                fallback: "tabler:layout-kanban",
                inert: p.value || !g.value || void 0,
                onSelect: Y[3] || (Y[3] = (P) => d.value = P.detail)
              }, null, 40, Jv)) : (n(), b("p", Zv, "The icon picker is unavailable."))
            ])
          ])
        ]),
        _: 1
      }, 8, ["open"]),
      ve.value || w.value || v.value ? (n(), b("div", Qv, [
        w.value ? (n(), b("p", _v, I(w.value), 1)) : v.value && !ve.value ? (n(), b("p", em, I(v.value), 1)) : S("", !0),
        ve.value ? (n(), b(ee, { key: 2 }, [
          y(s(_), {
            label: "Save board details",
            type: "submit",
            size: "small",
            disabled: !f.value.trim() || p.value || !g.value,
            loading: p.value
          }, null, 8, ["disabled", "loading"]),
          y(s(_), {
            label: "Cancel",
            type: "button",
            severity: "secondary",
            text: "",
            size: "small",
            disabled: p.value,
            onClick: be
          }, null, 8, ["disabled"])
        ], 64)) : S("", !0)
      ])) : S("", !0)
    ], 32)) : (n(), b("div", tm, [
      o.value ? (n(), b("form", {
        key: 0,
        class: "work-identity-edit",
        "aria-label": "Edit board",
        onClick: Y[8] || (Y[8] = Ee(() => {
        }, ["stop"])),
        onSubmit: Ee(te, ["prevent"])
      }, [
        r("label", am, [
          Y[12] || (Y[12] = j("Title", -1)),
          y(s(Se), {
            modelValue: f.value,
            "onUpdate:modelValue": Y[5] || (Y[5] = (P) => f.value = P),
            required: "",
            autofocus: "",
            disabled: p.value
          }, null, 8, ["modelValue", "disabled"])
        ]),
        r("label", lm, [
          Y[13] || (Y[13] = j("Description", -1)),
          y(s(Ca), {
            modelValue: m.value,
            "onUpdate:modelValue": Y[6] || (Y[6] = (P) => m.value = P),
            rows: "1",
            disabled: p.value
          }, null, 8, ["modelValue", "disabled"])
        ]),
        r("div", om, [
          Y[14] || (Y[14] = r("span", null, "Board icon", -1)),
          c.value ? (n(), b("wc-icon-picker", {
            key: 0,
            value: d.value,
            fallback: "tabler:layout-kanban",
            inert: p.value || void 0,
            onSelect: Y[7] || (Y[7] = (P) => d.value = P.detail)
          }, null, 40, im)) : (n(), b("p", nm, "The icon picker is unavailable."))
        ]),
        r("div", sm, [
          y(s(_), {
            label: "Save",
            severity: "secondary",
            type: "submit",
            disabled: !f.value.trim() || p.value,
            loading: p.value,
            outlined: ""
          }, {
            icon: q(() => [
              y(s(pe), {
                icon: "tabler:device-floppy",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled", "loading"]),
          y(s(_), {
            label: "Cancel",
            severity: "secondary",
            disabled: p.value,
            onClick: be,
            outlined: ""
          }, {
            icon: q(() => [
              y(s(pe), {
                icon: "tabler:x",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled"])
        ])
      ], 32)) : (n(), b(ee, { key: 1 }, [
        r("div", rm, [
          r("div", dm, [
            e.board?.icon ? (n(), K(s(pe), {
              key: 0,
              icon: e.board.icon,
              "aria-hidden": "true"
            }, null, 8, ["icon"])) : S("", !0),
            (n(), K(oa(e.compact ? "h2" : "h1"), {
              class: ct(e.compact ? "kx-card-name" : "kx-title")
            }, {
              default: q(() => [
                j(I(e.board?.title || "Untitled board"), 1)
              ]),
              _: 1
            }, 8, ["class"]))
          ]),
          e.compact ? Xe(U.$slots, "title-end", {}, void 0, void 0, 0) : S("", !0),
          e.compact ? (n(), b("span", um, [
            g.value ? (n(), K(s(_), {
              key: 0,
              severity: "secondary",
              text: "",
              size: "small",
              onClick: Ee(de, ["stop"]),
              "aria-label": "Edit board"
            }, {
              default: q(() => [
                y(s(pe), {
                  icon: "tabler:pencil",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            })) : S("", !0),
            Xe(U.$slots, "actions")
          ])) : g.value ? (n(), K(s(_), {
            key: 2,
            severity: "secondary",
            text: "",
            size: "small",
            onClick: Ee(de, ["stop"]),
            "aria-label": "Edit board"
          }, {
            default: q(() => [
              y(s(pe), {
                icon: "tabler:pencil",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          })) : S("", !0),
          e.compact ? S("", !0) : Xe(U.$slots, "title-end", {}, void 0, void 0, 3)
        ]),
        !e.compact && (e.subtitle || e.board?.description) ? (n(), b("p", {
          key: 0,
          class: "kx-head-sub",
          title: e.subtitle || e.board?.description
        }, I(e.subtitle || e.board?.description), 9, cm)) : S("", !0)
      ], 64)),
      w.value ? (n(), b("p", vm, I(w.value), 1)) : S("", !0),
      v.value ? (n(), b("p", mm, I(v.value), 1)) : S("", !0)
    ]));
  }
}), pm = { class: "work-ia-section work-ia-general" }, bm = {
  class: "work-settings-list work-board-details",
  "aria-label": "Board details"
}, hm = { class: "work-settings-row" }, gm = { class: "work-row-main" }, ym = ["for"], km = { class: "work-muted work-small" }, wm = {
  class: "work-board-summary work-row work-wrap work-small",
  "aria-label": "Board summary"
}, Vm = { class: "work-muted" }, $m = { key: 0 }, xm = { key: 1 }, Cm = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, Sm = {
  key: 0,
  class: "work-stack work-tight"
}, Tm = {
  key: 1,
  class: "work-muted"
}, Im = { class: "work-stack work-tight" }, Dm = { class: "work-spacer" }, Um = /* @__PURE__ */ Ve({
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
    }, o = W(() => Object.keys(l).filter((w) => a.draft.policy?.[w] !== void 0));
    function u(w) {
      const v = a.draft.policy?.[w];
      return w === "audit" ? v === "off" ? "Off" : "Track field changes" : w === "comments_per_item" ? v : v === 0 ? w === "audit_days" || w === "interval_days" ? "365 days" : "Clean up immediately" : v === 1 ? "1 day" : v + " days";
    }
    const f = B(), m = B(!1);
    let d = "";
    Ie([() => a.active, () => a.board?.board_id, () => a.schema.generation], async ([w, v, g], k, T) => {
      if (!w || !v || d === v + "/" + g) return;
      f.value = void 0, m.value = !1;
      let $ = !0;
      T(() => $ = !1);
      try {
        const C = await Promise.all(Array.from(
          { length: Math.min(3, Math.max(0, g - 1)) },
          (N, F) => It.schema(v, g - F - 1)
        ));
        $ && (f.value = C, d = v + "/" + g);
      } catch {
        $ && (m.value = !0);
      }
    }, { immediate: !0 });
    function i(w) {
      return JSON.stringify(w, (v, g) => g && typeof g == "object" && !Array.isArray(g) ? Object.fromEntries(Object.entries(g).sort(([k], [T]) => k.localeCompare(T))) : g);
    }
    function c(w, v) {
      if (!v) return ["Initial board setup"];
      const g = w.declaration, k = v.declaration, T = [], $ = [
        ["Fields", g.fields, k.fields],
        ["Item types", g.item_types, k.item_types],
        ["Workflow", g.processes, k.processes],
        ["Links", g.relation_types, k.relation_types],
        ["Plugins and filters", [g.plugins, g.scopes], [k.plugins, k.scopes]],
        ["Item visibility", g.visibility, k.visibility],
        ["Board rules", g.policy, k.policy],
        ["Starting pack", w.pack, v.pack],
        ["Item key prefix", w.key_prefix, v.key_prefix]
      ];
      if (i(g.fields) !== i(k.fields)) {
        const N = g.fields?.filter((F) => !k.fields?.some((z) => z.code === F.code)) ?? [];
        N.length === 1 && T.push("Added " + He(N[0]));
      }
      const C = $.filter(([, N, F]) => i(N) !== i(F)).map(([N]) => N).filter((N) => N !== "Fields" || !T.length);
      return C.length && T.push(C.join(", ") + " updated"), T.length ? T : ["Board setup updated"];
    }
    const p = W(() => {
      if (!f.value || a.schema.generation < 1) return [];
      const w = [a.schema, ...f.value];
      return w.slice(0, 3).map((v, g) => c(v, w[g + 1]));
    });
    return (w, v) => (n(), b("section", pm, [
      r("section", bm, [
        (n(), K(fm, {
          key: e.board?.board_id,
          board: e.board,
          "board-apps": e.boardApps,
          detail: "",
          onDirtyChange: v[1] || (v[1] = (g) => w.$emit("dirty-change", g)),
          onSaved: v[2] || (v[2] = (g) => w.$emit("saved"))
        }, {
          default: q(() => [
            r("div", hm, [
              r("div", gm, [
                r("label", {
                  class: "work-row-title",
                  for: s(t)
                }, "Item key prefix", 8, ym),
                r("p", km, "Shown on items, for example " + I(e.draft.key_prefix || "WORK") + "-1.", 1)
              ]),
              y(s(Se), {
                id: s(t),
                modelValue: e.draft.key_prefix,
                "onUpdate:modelValue": v[0] || (v[0] = (g) => e.draft.key_prefix = g),
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
      r("section", wm, [
        r("p", Vm, [
          e.board?.open_count !== void 0 && e.board.item_count !== void 0 ? (n(), b("span", $m, I(e.board.open_count) + " open · " + I(e.board.item_count) + " total · ", 1)) : S("", !0),
          j(" " + I(e.packTitle || "No pack installed"), 1),
          e.outdated ? (n(), b("span", xm, " · Update available")) : S("", !0)
        ]),
        e.packError ? (n(), b("p", Cm, I(e.packError), 1)) : S("", !0),
        e.packError ? (n(), K(s(_), {
          key: 1,
          label: "Reload packs",
          severity: "secondary",
          outlined: "",
          size: "small",
          onClick: v[3] || (v[3] = (g) => w.$emit("retry"))
        })) : S("", !0),
        e.packTitle ? e.outdated ? (n(), K(s(_), {
          key: 3,
          label: "Update pack",
          severity: "secondary",
          outlined: "",
          size: "small",
          disabled: !e.canUpgrade,
          title: e.upgradeReason,
          onClick: v[5] || (v[5] = (g) => w.$emit("upgrade"))
        }, null, 8, ["disabled", "title"])) : S("", !0) : (n(), K(s(_), {
          key: 2,
          label: "Install pack",
          severity: "secondary",
          outlined: "",
          size: "small",
          disabled: !e.canInstall,
          onClick: v[4] || (v[4] = (g) => w.$emit("install"))
        }, null, 8, ["disabled"]))
      ]),
      y(Ne, {
        class: "work-disclosure",
        label: "Recent setup changes"
      }, {
        default: q(() => [
          p.value.length ? (n(), b("ul", Sm, [
            (n(!0), b(ee, null, ue(p.value, (g, k) => (n(), b("li", { key: k }, I(g.join(" · ")), 1))), 128))
          ])) : (n(), b("p", Tm, I(m.value ? "Recent changes are unavailable." : f.value ? "No setup changes yet." : "Loading recent changes…"), 1))
        ]),
        _: 1
      }),
      o.value.length ? (n(), K(Ne, {
        key: 0,
        class: "work-settings-card work-disclosure",
        label: "Advanced · Existing board overrides"
      }, {
        default: q(() => [
          v[6] || (v[6] = r("p", { class: "work-muted" }, "Clear an override to use the Work application default.", -1)),
          r("ul", Im, [
            (n(!0), b(ee, null, ue(o.value, (g) => (n(), b("li", {
              key: g,
              class: "work-row work-wrap"
            }, [
              r("span", Dm, I(l[g]) + " · " + I(u(g)), 1),
              y(s(_), {
                label: "Use default for " + l[g].toLowerCase(),
                disabled: e.disabled,
                size: "small",
                text: "",
                onClick: (k) => delete e.draft.policy[g]
              }, null, 8, ["label", "disabled", "onClick"])
            ]))), 128))
          ])
        ]),
        _: 1
      })) : S("", !0)
    ]));
  }
}), Be = (e, a) => `${e} → ${a}`, ko = (e, a) => {
  const t = e.fields?.find((l) => l.code === a);
  return t ? He(t) : "Untitled field";
}, wo = {
  comments_per_item: "Comments per item",
  stage_timeout: "Default attempt timeout",
  stage_max_visits: "Default maximum visits",
  audit: "Audit trail",
  audit_days: "Audit history",
  trash_days: "Keep trashed items",
  tombstone_days: "Keep deletion records",
  interval_days: "Keep state history"
};
function Vo(e, a) {
  if (a === void 0) return "Application default";
  if (e === "audit") return Oe(String(a));
  if (e === "stage_timeout") {
    const t = ba(String(a));
    if (t) return `${t.amount.toLocaleString()} ${t.amount === 1 ? t.unit.slice(0, -1) : t.unit}`;
  }
  if (e.endsWith("_days")) {
    const t = a === 0 && (e === "audit_days" || e === "interval_days") ? 365 : a;
    return `${t} ${t === 1 ? "day" : "days"}`;
  }
  return String(a);
}
function Em(e, a) {
  const t = e.policy ?? {}, l = a.policy ?? {}, o = Object.keys(wo).flatMap((m) => t[m] === l[m] ? [] : [`${wo[m]} · ${Be(Vo(m, t[m]), Vo(m, l[m]))}`]), u = (m) => m ? `${m.limit}${m.hard ? " (hard limit)" : ""}` : "No limit", f = /* @__PURE__ */ new Set([...Object.keys(t.wip ?? {}), ...Object.keys(l.wip ?? {})]);
  for (const m of f) {
    const d = u(t.wip?.[m]), i = u(l.wip?.[m]);
    if (d === i) continue;
    const c = (a.processes ?? []).flatMap((p) => p.states).find((p) => p.id === m) ?? (e.processes ?? []).flatMap((p) => p.states).find((p) => p.id === m);
    o.push(`${ke(c)} limit · ${Be(d, i)}`);
  }
  return o;
}
function Am(e, a, t) {
  const l = e.visibility, o = a.visibility, u = [];
  l?.field !== o?.field && u.push(Be(
    l ? ko(e, l.field) : "No additional restriction",
    o ? ko(a, o.field) : "No additional restriction"
  ));
  const f = l?.levels ?? [], m = o?.levels ?? [], d = new Set([...f, ...m].map((i) => i.id));
  for (const i of d) {
    const c = f.find((k) => k.id === i), p = m.find((k) => k.id === i);
    if (c && p && JSON.stringify(c.holders) === JSON.stringify(p.holders)) continue;
    const w = (k) => k.fields?.find((T) => T.code === k.visibility?.field)?.options?.find((T) => T.id === i)?.label, v = w(a) || w(e) || Oe(i), g = (k) => k ? k.holders.map(t).join(", ") || "No extra access" : "No level";
    u.push(`${v} · ${Be(g(c), g(p))}`);
  }
  return l?.bypass !== o?.bypass && u.push(o?.bypass === "admin" ? "Board administrators can see every level." : "Visibility levels now apply to board administrators."), u;
}
const ha = {
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
function Om(e, a, t) {
  const { what: l, detail: o, to: u } = e, m = `${t?.name || a?.name || "Untitled workflow"} · ${ha[l] ?? "Workflow changed"}`, d = l.startsWith("state.") ? a?.states.find((v) => v.id === o) : void 0, i = l.startsWith("state.") ? t?.states.find((v) => v.id === o) : void 0, c = l.startsWith("transition.") ? a?.transitions?.find((v) => v.id === o) : void 0, p = l.startsWith("transition.") ? t?.transitions?.find((v) => v.id === o) : void 0;
  let w = "";
  return l === "state.map" ? w = Be(ke(d), ke(t?.states.find((v) => v.id === u))) : l === "state.name" ? w = Be(ke(d), ke(i)) : l === "state.kind" ? w = `${ke(i)} · ${Be(qa(d?.kind), qa(i?.kind))}` : l === "state.category" && d && i ? w = `${ke(i)} · ${Be(jt(d.category), jt(i.category))}` : i || d ? w = ke(i ?? d) : l === "transition.name" && c && p ? w = Be(je(c), je(p)) : p ? w = je(p) : c ? w = je(c) : l === "initial" ? w = Be(ke(a?.states.find((v) => v.id === a.initial)), ke(t?.states.find((v) => v.id === t.initial))) : l === "name" && (w = Be(a?.name || "Untitled workflow", t?.name || "Untitled workflow")), { title: m, details: w ? [w] : [] };
}
function Pm(e, a, t, l) {
  const { code: o, what: u, detail: f } = e;
  if (o === "schema" || u === "visibility.remove")
    return u === "policy" ? { title: "Board limits and defaults", details: Em(a, t) } : u.startsWith("visibility") ? { title: "Who can see items", details: Am(a, t, l) } : u === "key_prefix" ? { title: "Item key prefix", details: [Be(a.key_prefix ?? "Default", t.key_prefix ?? "Default")] } : { title: { plugins: "Board plugins changed", scopes: "Saved query filters changed", "rollup.recompute": "Calculated totals will update" }[u] ?? "Board settings changed", details: [] };
  if (o.startsWith("process ")) {
    const p = o.slice(8);
    return Om(e, a.processes?.find((w) => w.id === p), t.processes?.find((w) => w.id === p));
  }
  if (o.startsWith("item_type ")) {
    const p = o.slice(10), w = a.item_types?.find((k) => k.id === p), v = t.item_types?.find((k) => k.id === p);
    return { title: `${v?.title || w?.title || "Item type"} · ${ha[u] ?? "Item type changed"}`, details: u === "title" ? [Be(w?.title || "Untitled item type", v?.title || "Untitled item type")] : [] };
  }
  if (o.startsWith("relation ")) {
    const p = o.slice(9), w = a.relation_types?.find((k) => k.id === p), v = t.relation_types?.find((k) => k.id === p), g = u === "label" ? [Be([w?.outward, w?.inward].filter(Boolean).join(" / "), [v?.outward, v?.inward].filter(Boolean).join(" / "))] : [];
    return { title: `${v?.outward || w?.outward || "Link type"} · ${ha[u] ?? "Link type changed"}`, details: g };
  }
  const m = t.fields?.find((p) => p.code === o), d = a.fields?.find((p) => m?.id !== void 0 ? p.id === m.id : p.code === (u.startsWith("renamed from ") ? u.slice(13) : o)), i = m ?? d;
  if (!i) return { title: ha[u] ?? "Board settings changed", details: [] };
  const c = `${He(i)} · ${u.startsWith("renamed from ") ? "Field key" : ha[u] ?? "Field settings changed"}`;
  if (u.startsWith("options.")) {
    const p = d?.options ?? [], w = m?.options ?? [], v = p.findIndex((N) => N.id === f), g = w.findIndex((N) => N.id === f), k = p[v], T = w[g], $ = T?.label || k?.label || "Untitled choice", C = k && T && k.label !== T.label ? [] : [$];
    if (k && T) {
      k.label !== T.label && C.push(Be(k.label || "Untitled choice", T.label || "Untitled choice")), k.category !== T.category && C.push(`Category · ${Be(k.category ? jt(k.category) : "None", T.category ? jt(T.category) : "None")}`);
      const N = k.order ?? v + 1, F = T.order ?? g + 1;
      N !== F && C.push(`Order · ${Be(N, F)}`), k.color !== T.color && C.push(`Color · ${Be(k.color ?? "Default", T.color ?? "Default")}`);
    }
    return { title: c, details: C };
  }
  return u === "title" && d && m ? { title: c, details: [Be(He(d), He(m))] } : { title: c, details: [] };
}
const Rm = {
  key: 0,
  class: "work-settings-card work-schema-plan work-stack",
  "aria-label": "Schema review"
}, Nm = { key: 0 }, Mm = { class: "work-row work-wrap" }, Fm = { class: "work-muted" }, Lm = {
  key: 0,
  class: "work-notice"
}, Bm = {
  key: 1,
  class: "work-notice"
}, zm = {
  key: 2,
  class: "work-stack work-tight",
  "aria-label": "Reviewed Flow bindings"
}, jm = { key: 3 }, Wm = {
  key: 4,
  class: "work-settings-table"
}, qm = { key: 0 }, Gm = /* @__PURE__ */ Ve({
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
    const a = e, t = {}, l = W(() => a.original ?? t), o = W(() => a.declaration ?? t), u = W(() => (o.value.processes ?? []).flatMap((C) => C.states.flatMap((N) => {
      const F = N.run?.flow_ref;
      return F ? [{ key: C.id + ":" + N.id, process: C.name || "Untitled process", state: ke(N), reference: F }] : [];
    }))), f = B(/* @__PURE__ */ new Map());
    Ie(u, async (C, N, F) => {
      const z = /* @__PURE__ */ new Map();
      f.value = z;
      let ie = !0;
      F(() => ie = !1), await Promise.all([...new Set(C.map((le) => le.reference.id))].map(async (le) => {
        try {
          const de = (await Al.title(le))?.trim();
          ie && de && !Ai(de) && f.value.set(le, de);
        } catch {
          ie && f.value.set(le, "Flow title unavailable");
        }
      }));
    }, { immediate: !0 });
    const m = W(() => [l.value, o.value].flatMap((C) => (C.visibility?.levels ?? []).flatMap((N) => N.holders.flatMap((F) => "group" in F ? [{ kind: "group", id: F.group }] : "user" in F ? [{ kind: "user", id: F.user }] : [])))), d = Eo(() => a.boardId ?? "", m);
    function i(C) {
      if ("user" in C) return d.label({ kind: "user", id: C.user });
      if ("group" in C) return d.label({ kind: "group", id: C.group });
      if ("field" in C) {
        const N = o.value.fields?.find((F) => F.code === C.field) ?? l.value.fields?.find((F) => F.code === C.field);
        return N ? He(N) : "People from a field";
      }
      return "Service";
    }
    const c = (C) => C.map((N) => {
      const F = Pm(N, l.value, o.value, i);
      if (N.what === "plugins") {
        const z = new Set(l.value.plugins?.map((le) => le.use)), ie = new Set(o.value.plugins?.map((le) => le.use));
        for (const le of a.plugins ?? [])
          z.has(le.plugin) !== ie.has(le.plugin) && F.details.push((ie.has(le.plugin) ? "Enable " : "Turn off ") + (le.title || "an available plugin"));
      }
      return { change: N, ...F };
    }), p = W(() => c(a.plan?.changes.filter((C) => C.class !== "refused") ?? [])), w = W(() => c(a.plan?.refused ?? [])), v = W(() => {
      const C = a.plan?.migration;
      return !C || !w.value.length ? C : w.value.every((N) => N.change.what === "options.remove") ? "Add a new field with the choices you want to keep. Copy existing values into it before removing the old field." : w.value.every((N) => N.change.what === "state.remove") ? "Choose where existing items should move before removing their state." : C;
    }), g = {
      unchanged: ["No changes", "secondary"],
      cosmetic: ["Labels or settings", "secondary"],
      additive: ["New definitions", "success"],
      semantic: ["Affects existing items", "warn"],
      refused: ["Blocked", "danger"],
      initial: ["First setup", "secondary"]
    }, k = (C) => g[C]?.[0] ?? "Review needed", T = (C) => g[C]?.[1] ?? "secondary";
    function $(C) {
      const { detail: N, ...F } = C;
      return Ja(C.what === "invalid" || C.what.startsWith("views.") || C.what.startsWith("automation") ? C : F);
    }
    return (C, N) => e.plan ? (n(), b("section", Rm, [
      !e.plan.changes.length && !e.plan.refused.length && !e.configCount && !e.packReview ? (n(), b("p", Nm, "No changes to apply.")) : (n(), b(ee, { key: 1 }, [
        r("header", Mm, [
          N[0] || (N[0] = r("h3", null, "Impact on this board", -1)),
          y(s(tt), {
            class: "kx-tag-sm",
            severity: T(e.plan.class)
          }, {
            default: q(() => [
              j(I(k(e.plan.class)), 1)
            ]),
            _: 1
          }, 8, ["severity"])
        ]),
        r("p", Fm, I(s(Oi)[e.plan.class] || "Review the changes below."), 1),
        v.value ? (n(), b("p", Lm, I(v.value), 1)) : e.follows.length ? (n(), b("p", Bm, "Existing items in " + I(e.follows.join(", ")) + " will follow the updated workflow.", 1)) : S("", !0),
        u.value.length ? (n(), b("section", zm, [
          N[1] || (N[1] = r("h3", null, "Flow bindings", -1)),
          (n(!0), b(ee, null, ue(u.value, (F) => (n(), b("p", {
            key: F.key
          }, [
            j(I(F.process) + " / " + I(F.state) + " · ", 1),
            r("strong", null, I(f.value.get(F.reference.id) ?? "Published Flow") + " · v" + I(F.reference.version), 1)
          ]))), 128)),
          N[2] || (N[2] = r("p", { class: "work-muted work-small" }, "New entries use these exact published versions. Before replacing a binding, stop new entries, let existing runs and deliveries finish, pause the old launcher, save, then resume entries.", -1))
        ])) : S("", !0),
        Xe(C.$slots, "default"),
        w.value.length ? (n(), b("h3", jm, "Blocked changes")) : S("", !0),
        (n(!0), b(ee, null, ue(w.value, (F, z) => (n(), K(s(qi), {
          key: z,
          severity: "error",
          role: "alert"
        }, {
          default: q(() => [
            r("strong", null, I(F.title), 1),
            (n(!0), b(ee, null, ue(F.details, (ie, le) => (n(), b("p", { key: le }, I(ie), 1))), 128)),
            r("p", null, I($(F.change)), 1),
            y(Ne, {
              class: "work-small",
              label: "Technical details"
            }, {
              default: q(() => [
                r("code", null, I(F.change.what), 1)
              ]),
              _: 2
            }, 1024)
          ]),
          _: 2
        }, 1024))), 128)),
        p.value.length ? (n(), b("table", Wm, [
          N[3] || (N[3] = r("thead", null, [
            r("tr", null, [
              r("th", { scope: "col" }, "Change"),
              r("th", { scope: "col" }, "Impact")
            ])
          ], -1)),
          r("tbody", null, [
            (n(!0), b(ee, null, ue(p.value, (F, z) => (n(), b("tr", { key: z }, [
              r("td", null, [
                r("strong", null, I(F.title), 1),
                (n(!0), b(ee, null, ue(F.details, (ie, le) => (n(), b("p", { key: le }, I(ie), 1))), 128)),
                F.change.count ? (n(), b("p", qm, I(F.change.count) + " " + I(F.change.count === 1 ? "item" : "items"), 1)) : S("", !0)
              ]),
              r("td", null, [
                y(s(tt), {
                  class: "kx-tag-sm",
                  severity: T(F.change.class)
                }, {
                  default: q(() => [
                    j(I(k(F.change.class)), 1)
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
}), Km = {
  class: "work-stack work-tight",
  "aria-label": "Pack resources"
}, Hm = {
  key: 0,
  class: "work-muted work-small"
}, Ym = {
  key: 0,
  class: "work-stack",
  "aria-label": "Pack conflicts"
}, Xm = { class: "work-stack work-tight work-pack-review-field" }, Jm = { class: "work-config-fields" }, Zm = { class: "work-json-example" }, Qm = { class: "work-json-example" }, _m = {
  key: 1,
  class: "work-stack",
  "aria-label": "Pack state maps"
}, ef = /* @__PURE__ */ Ve({
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
    const t = e, l = a, o = W(() => [
      { label: "Saved views", entries: t.plan.views?.map((c) => ({ id: c.id, name: c.title || c.id })) },
      { label: "Automations", entries: t.plan.automations?.map((c) => ({ id: c.id, name: c.id })) },
      { label: "Traits", entries: t.plan.traits?.map((c) => ({ id: c, name: c })) },
      { label: "Required plugins", entries: t.plan.plugins?.map((c) => ({ id: c, name: t.plugins?.find((p) => p.plugin === c)?.title || c })) }
    ].filter((c) => c.entries?.length));
    function u(c) {
      return t.original.processes?.find((p) => p.id === c)?.name || Oe(c);
    }
    function f(c) {
      const [p, ...w] = c.split("."), v = w.join(".");
      return p === "processes" ? u(v) : p === "fields" ? t.original.fields?.find((g) => g.code === v)?.title || Oe(v) : p === "item_types" ? t.original.item_types?.find((g) => g.id === v)?.title || Oe(v) : Oe(p);
    }
    function m(c) {
      return JSON.stringify(c ?? null, null, 2);
    }
    function d(c, p) {
      (t.request.resolutions ??= {})[c] = p, l("change");
    }
    function i(c, p, w) {
      ((t.request.maps ??= {})[c] ??= {})[p] = w, l("change");
    }
    return (c, p) => (n(), b(ee, null, [
      r("section", Km, [
        p[1] || (p[1] = r("h3", null, "Pack resources", -1)),
        r("p", null, [
          p[0] || (p[0] = j("Target version ", -1)),
          r("strong", null, I(e.plan.version), 1)
        ]),
        o.value.length ? (n(), b("p", Hm, "Resources included in this plan.")) : S("", !0),
        (n(!0), b(ee, null, ue(o.value, (w) => (n(), b("div", {
          key: w.label
        }, [
          r("h4", null, I(w.label), 1),
          r("ul", null, [
            (n(!0), b(ee, null, ue(w.entries, (v) => (n(), b("li", {
              key: v.id
            }, I(v.name), 1))), 128))
          ])
        ]))), 128))
      ]),
      e.plan.conflicts.length ? (n(), b("section", Ym, [
        p[4] || (p[4] = r("h3", null, "Local edits conflict", -1)),
        p[5] || (p[5] = r("p", { class: "work-muted work-small" }, "Choose which declaration to keep for each conflict, then review again.", -1)),
        (n(!0), b(ee, null, ue(e.plan.conflicts, (w) => (n(), b("div", {
          key: w.path,
          class: "work-stack work-tight"
        }, [
          r("label", Xm, [
            j(I(f(w.path)), 1),
            y(s(fe), {
              "model-value": e.request.resolutions?.[w.path],
              "aria-label": "Resolution for " + f(w.path),
              disabled: e.disabled,
              appendTo: "self",
              placeholder: "Choose a resolution",
              optionLabel: "label",
              optionValue: "value",
              options: [{ label: "Keep local edits", value: "local" }, { label: "Use pack changes", value: "incoming" }],
              "onUpdate:modelValue": (v) => d(w.path, v)
            }, null, 8, ["model-value", "aria-label", "disabled", "onUpdate:modelValue"])
          ]),
          y(Ne, {
            class: "work-json-disclosure",
            label: "Compare declarations"
          }, {
            default: q(() => [
              r("div", Jm, [
                r("section", null, [
                  p[2] || (p[2] = r("h4", null, "Local edits", -1)),
                  r("pre", Zm, I(m(w.local_value)), 1)
                ]),
                r("section", null, [
                  p[3] || (p[3] = r("h4", null, "Pack changes", -1)),
                  r("pre", Qm, I(m(w.incoming)), 1)
                ])
              ])
            ]),
            _: 2
          }, 1024)
        ]))), 128))
      ])) : S("", !0),
      Object.keys(e.plan.maps).length ? (n(), b("section", _m, [
        p[6] || (p[6] = r("h3", null, "Required state maps", -1)),
        p[7] || (p[7] = r("p", { class: "work-muted work-small" }, "Review the proposed destinations for existing items. Each destination is editable.", -1)),
        (n(!0), b(ee, null, ue(e.plan.maps, (w, v) => (n(), b("div", {
          key: v,
          class: "work-stack"
        }, [
          r("h4", null, I(u(v)), 1),
          (n(!0), b(ee, null, ue(w, (g, k) => (n(), b("label", {
            key: k,
            class: "work-stack work-tight work-pack-review-field"
          }, [
            j("Move items from " + I(s(ke)(e.original.processes?.find((T) => T.id === v)?.states.find((T) => T.id === k))), 1),
            y(s(fe), {
              "model-value": e.request.maps?.[v]?.[k],
              "aria-label": "Move items from " + s(ke)(e.original.processes?.find((T) => T.id === v)?.states.find((T) => T.id === k)),
              disabled: e.disabled,
              appendTo: "self",
              optionLabel: "label",
              optionValue: "value",
              options: e.plan.declaration.processes?.find((T) => T.id === v)?.states.map((T) => ({ label: s(ke)(T), value: T.id })) ?? [],
              "onUpdate:modelValue": (T) => i(v, k, T)
            }, null, 8, ["model-value", "aria-label", "disabled", "options", "onUpdate:modelValue"])
          ]))), 128))
        ]))), 128))
      ])) : S("", !0)
    ], 64));
  }
}), tf = { class: "work-section-layout" }, af = { class: "kx-main" }, lf = ["aria-label"], of = {
  key: 1,
  class: "kx-err work-alert-actions"
}, nf = { role: "alert" }, sf = {
  key: 2,
  class: "work-notice",
  role: "status"
}, rf = {
  key: 3,
  class: "kx-loading",
  role: "status"
}, df = {
  key: 4,
  class: "work-notice",
  role: "alert"
}, uf = {
  key: 5,
  class: "work-settings-body"
}, cf = {
  key: 0,
  class: "work-notice work-stack work-tight",
  "aria-label": "Pack installation"
}, vf = {
  key: 0,
  role: "status"
}, mf = {
  key: 1,
  role: "status"
}, ff = { class: "work-small" }, pf = {
  key: 2,
  class: "kx-err",
  role: "alert"
}, bf = { key: 3 }, hf = {
  key: 1,
  class: "work-notice",
  role: "alert"
}, gf = {
  key: 2,
  class: "work-notice"
}, yf = ["id"], kf = ["disabled", "inert"], wf = {
  key: 3,
  class: "work-ia-section"
}, Vf = {
  key: 0,
  class: "work-muted"
}, $f = {
  key: 5,
  class: "work-ia-section"
}, xf = { class: "work-review-layout" }, Cf = { class: "work-muted" }, Sf = ["aria-busy"], Tf = {
  key: 0,
  role: "status"
}, If = {
  key: 1,
  role: "alert",
  class: "kx-err"
}, Df = {
  key: 2,
  role: "alert"
}, Uf = { key: 6 }, Ef = { class: "work-dialog-actions" }, Af = {
  key: 3,
  class: "work-muted",
  role: "status"
}, Of = {
  key: 0,
  class: "work-muted",
  role: "status"
}, Pf = {
  key: 1,
  class: "kx-err work-alert-actions"
}, Rf = { role: "alert" }, Nf = {
  key: 2,
  class: "work-stack work-tight"
}, Mf = {
  key: 0,
  class: "work-pack-unavailable work-block"
}, Ff = {
  key: 3,
  class: "work-muted"
}, Lf = { class: "work-dialog-actions" }, Bf = /* @__PURE__ */ Ve({
  __name: "BoardSettings",
  props: {
    boardId: {},
    embedded: { type: Boolean },
    focusBack: { type: Boolean }
  },
  emits: ["dirty-change"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = Qi(), u = zt(), f = B();
    let m, d = "";
    const i = () => JSON.stringify([ht.value, U.value, ce.value, [...Je.value]]), c = W(() => ({
      value: "all-boards",
      label: t.embedded ? "All boards" : "Back to board",
      icon: t.embedded ? "tabler:table" : "tabler:layout-kanban"
    })), p = B();
    Ie(p, (J) => {
      t.focusBack && J?.$el.querySelector(".kx-settings-rail-item")?.focus();
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
    function g(J) {
      if (J === c.value.value) {
        ci();
        return;
      }
      (J === "General" || w.some((G) => G.items.some((oe) => oe.value === J))) && (v.value = J);
    }
    const k = {
      General: "Manage the board name, item key prefix and app.",
      "Item types": "Choose the fields, parent relationships and workflow for each kind of work.",
      Fields: "Choose what information people can capture on items.",
      Links: "Show relationships on both items, such as “Blocks” and “Blocked by.”",
      Workflow: "Select a state or transition to edit how work moves.",
      Access: "Who can use this board?",
      Plugins: "Choose which plugins this board uses."
    }, T = B(""), $ = B(!1), C = B(""), N = B();
    Ie(v, () => f.value?.scrollTo({ top: 0 }));
    function F() {
      $.value = !1, C.value = "", Ea.value = !1;
    }
    function z(J) {
      !el.value || !si() || Je.value.size || (N.value = J, $.value = !0, dl());
    }
    const ie = B(!1), le = B(""), de = B(/* @__PURE__ */ new Set(["General"]));
    Ie(v, (J) => de.value.add(J));
    const Z = B(), ve = B(), be = B(), te = B({}), U = B({}), Y = B(), P = B(!1), me = B(!0), O = B(!1), Q = B(""), x = B(""), M = W(() => te.value.processes ?? []), E = W(() => P.value && Z.value ? [
      { heading: be.value?.title || "Board settings", items: [{ value: "General", label: "General", icon: "tabler:settings" }] },
      ...w
    ] : []), X = B(), h = B(!1), A = ga();
    async function se(J) {
      const G = A();
      h.value = !1;
      try {
        const oe = await It.stateCounts(J);
        G() && (X.value = oe);
      } catch {
        G() && (h.value = !0, X.value = void 0);
      }
    }
    Ie(v, (J) => {
      P.value && J === "Workflow" && se(t.boardId);
    });
    const { packs: re, loading: $e, error: H, load: L, reset: V } = Pi(), R = W(() => re.value.filter(Ri)), D = W(() => re.value.map(Ni)), ne = W(() => D.value.find((J) => J.id === le.value && !J.disabled)), ce = B(), we = B(), De = B(), Le = B(), bt = B(""), Wt = W(() => !!Le.value && Le.value.result.status !== "done"), na = W(() => !O.value && !sa.value && !Kt.value && !Wt.value), el = W(() => sa.value && !(Wt.value && ce.value)), We = B(), qt = B(), Gt = B(""), tl = B([]), al = W(() => [...tl.value, ...We.value?.refused ?? []]), st = B(!1), ql = B(0), Je = B(/* @__PURE__ */ new Set()), ll = B(), Gl = ga(), Ua = ga(), ht = W(() => vl(te.value, Z.value?.declaration ?? {})), sa = W(() => Je.value.size > 0 || !!ce.value || !!Z.value && (JSON.stringify(ht.value) !== JSON.stringify(vl(Z.value.declaration, Z.value.declaration)) || Object.keys(U.value).length > 0)), ol = B(!1), ra = B({}), Kl = W(() => sa.value || ol.value || Object.keys(ra.value).length > 0);
    Ie(Kl, (J) => l("dirty-change", J), { immediate: !0, flush: "sync" });
    const ot = W(() => !!Z.value && !!ve.value && Z.value.generation !== ve.value.generation), ei = W(() => (!da.value.renamed.length || Ea.value) && P.value && !O.value && !st.value && !Kt.value && !ot.value && !Je.value.size && We.value && (We.value.changes.length > 0 || Object.keys(U.value).length > 0) && We.value.class !== "refused" && !We.value.refused.length && qt.value?.matches(ht.value, Z.value?.generation ?? -1, U.value)), Ea = B(!1), da = W(() => {
      const J = Z.value?.declaration, G = [], oe = [];
      for (const Te of M.value) {
        const Ze = J?.item_types?.filter((Pe) => Pe.process === Te.id) ?? [], qe = J?.processes?.find((Pe) => Pe.id === Te.id);
        for (const Pe of qe?.states ?? []) {
          const Oa = Te.states.find((At) => At.id === Pe.id);
          if (Oa && Oa.name === Pe.name) continue;
          const cl = [...We.value?.refused ?? [], ...We.value?.changes ?? []].find((At) => At.code === "process " + Te.id && At.detail === Pe.id && ["state.remove", "state.map"].includes(At.what))?.count ?? Ze.reduce((At, mi) => At + (X.value?.[mi.id]?.[Pe.id] ?? 0), 0);
          cl && (Oa ? oe.push({ process: Te, state: Pe, name: ke(Oa), count: cl }) : G.push({ process: Te, state: Pe, count: cl }));
        }
      }
      return { removed: G, renamed: oe };
    });
    function ti(J, G, oe) {
      J.map = { ...J.map, [G]: oe }, dl();
    }
    const il = W(() => R.value.find((J) => J.id === ce.value?.pack)?.plugins.filter((J) => !Z.value?.plugins?.some((G) => G.plugin === J.plugin && G.active)).map((J) => ({ use: J.plugin })) ?? []), Hl = W(() => !!De.value && JSON.stringify(De.value) === JSON.stringify(ce.value)), Yl = W(() => ce.value ? P.value && !O.value && !Je.value.size && !ot.value && !Kt.value && Hl.value && We.value?.class !== "refused" && !We.value?.refused.length && we.value?.conflicts.every((J) => !!ce.value?.resolutions?.[J.path]) : ei.value), Xl = W(() => !!We.value && (!ce.value || Hl.value)), ai = W(() => R.value.find((J) => J.id === Z.value?.pack?.id)?.title || "Installed pack"), nl = W(() => !H.value && !!Z.value?.outdated && !!D.value.find((J) => J.id === Z.value?.pack?.id && !J.disabled)), li = W(() => H.value ? "Reload packs to check available upgrades." : Wt.value ? "Finish the current pack installation before upgrading." : nl.value ? sa.value ? "Discard the current draft before upgrading." : Kt.value ? "Finish the current migration before upgrading." : O.value ? "Wait for the current request to finish." : void 0 : "Install an available version of this pack to upgrade.");
    function Jl() {
      ce.value = void 0, we.value = void 0, De.value = void 0;
    }
    async function oi() {
      if (!Z.value?.pack || !na.value || !nl.value) return;
      const J = R.value.find((G) => G.id === Z.value.pack.id);
      J && (N.value = void 0, ce.value = ao(J, Z.value.generation), $.value = !0, await sl());
    }
    async function ii() {
      const J = R.value.find((G) => G.id === le.value);
      !Z.value || !J || !ne.value || !na.value || $e.value || (N.value = void 0, ce.value = ao(J, Z.value.generation), ie.value = !1, $.value = !0, await sl());
    }
    async function sl() {
      if (!ce.value || O.value || !P.value || ot.value || Je.value.size) return;
      const J = Ua(), G = Xt(ce.value), oe = JSON.stringify(ce.value);
      O.value = !0, C.value = "", x.value = "";
      try {
        const Te = await Fi(G, (Ze) => Ct.packPlan(t.boardId, Ze));
        if (!J() || oe !== JSON.stringify(ce.value)) return;
        we.value = Te.plan, We.value = Te.plan, ce.value = Te.request, De.value = Xt(ce.value), Gt.value = crypto.randomUUID(), $.value = !0;
      } catch (Te) {
        J() && (De.value = void 0, C.value = nt(Te, "Could not review the pack."));
      } finally {
        O.value = !1;
      }
    }
    const Zl = W(() => we.value?.declaration ?? qt.value?.declaration), ni = W(() => {
      const J = Zl.value;
      return !We.value || !J ? [] : Mi(We.value, J).map((G) => J.processes?.find((oe) => oe.id === G)?.name || "Untitled process");
    }), Kt = W(() => !!ve.value?.migration_error || be.value?.status === "migrating");
    function gt() {
      tl.value = [], Ua(), We.value = void 0, qt.value = void 0, De.value = void 0, Gt.value = "";
    }
    Ie([ht, U], gt, { deep: !0, flush: "sync" }), Ie(U, (J) => {
      ce.value && (Object.keys(J).length ? ce.value.plugin_configs = Xt(J) : delete ce.value.plugin_configs);
    }, { deep: !0, flush: "sync" });
    function ua(J, G) {
      G ? Je.value.delete(J) : Je.value.add(J), gt();
    }
    function rl(J) {
      Jl(), ql.value++, Z.value = J, te.value = Xt(J.declaration), U.value = {}, Je.value.clear(), gt();
    }
    async function rt(J = !1) {
      const G = Gl();
      try {
        const [oe, Te, Ze] = await Promise.all([It.schema(t.boardId, void 0, !0).catch((Pe) => {
          if (Pe instanceof xl && Pe.details?.code === "board_schema_missing") return { generation: 0, declaration: {}, compiled: {}, key_prefix: "", as_of: 0 };
          throw Pe;
        }), It.options(t.boardId), It.boards()]);
        if (!G()) return;
        if (P.value = Te.access.admin, Y.value = Te, be.value = Ze.find((Pe) => Pe.board_id === t.boardId), !P.value) {
          Z.value = void 0, te.value = {}, gt();
          return;
        }
        Q.value = "";
        const qe = Li(oe);
        ve.value = qe, m !== void 0 && qe.generation >= m ? (m = void 0, d === i() && rl(qe), d = "") : (J || !Z.value || !sa.value && qe.generation !== Z.value.generation) && rl(qe), ot.value && gt(), await L(G), G() && v.value === "Workflow" && se(t.boardId);
      } catch (oe) {
        if (!G()) return;
        oe instanceof xl && (oe.status === 403 || oe.kind?.toLowerCase() === "permission_denied") && (P.value = !1), gt(), Q.value = nt(oe, "Could not load board settings.");
      } finally {
        G() && (me.value = !1);
      }
    }
    function si() {
      for (const J of Array.from(ll.value?.elements ?? []))
        if ((J instanceof HTMLInputElement || J instanceof HTMLSelectElement || J instanceof HTMLTextAreaElement) && !(J.form !== ll.value || J.closest('[style*="display: none"]:not(.p-accordioncontent)')) && !J.reportValidity()) {
          const oe = J.closest('.p-accordioncontent[style*="display: none"]')?.closest(".kx-disclosure")?.querySelector('.kx-disclosure-toggle[aria-expanded="false"]');
          return oe && (oe.click(), _t(() => J.reportValidity())), !1;
        }
      return !0;
    }
    async function dl() {
      if (ce.value) return sl();
      if (!Z.value || O.value || !P.value || ot.value || Je.value.size) return;
      const J = Ua(), G = lo(ht.value, Z.value.generation, U.value);
      O.value = !0, C.value = "", x.value = "";
      try {
        const oe = (G.declaration.processes ?? []).some((Ze) => Z.value?.declaration.processes?.find((qe) => qe.id === Ze.id)?.states.some((qe) => Ze.states.some((Pe) => Pe.id === qe.id && Pe.name !== qe.name))), [Te] = await Promise.all([
          Ct.plan(t.boardId, G),
          oe ? se(t.boardId) : void 0
        ]);
        if (oe && h.value) {
          gt(), C.value = "Could not check which items use the renamed states. Check the impact again.";
          return;
        }
        if (!J() || Je.value.size || !G.matches(ht.value, Z.value.generation, U.value)) return;
        We.value = Te, qt.value = G, Gt.value = crypto.randomUUID(), $.value = !0;
      } catch (oe) {
        J() && (gt(), C.value = nt(oe, "Could not review changes."), tl.value = Bi(oe, ht.value));
      } finally {
        O.value = !1;
      }
    }
    async function ri() {
      if (!Yl.value) return;
      if (ce.value && De.value) {
        O.value = !0, C.value = "";
        try {
          await Ql(Xt(De.value), Gt.value, i()), F();
        } catch (G) {
          C.value = nt(G, "Could not apply the pack upgrade.");
        } finally {
          O.value = !1;
        }
        return;
      }
      if (!qt.value) return;
      O.value = !0, C.value = "", x.value = "";
      const J = i();
      try {
        m = (await Ct.apply(t.boardId, qt.value, Gt.value)).generation, d = J, await rt(), x.value = "Board changes applied.", F();
      } catch (G) {
        C.value = nt(G, "Could not apply the board changes.");
      } finally {
        O.value = !1;
      }
    }
    async function Ql(J, G, oe) {
      const Te = t.boardId, Ze = await Ct.packApply(Te, J, G);
      t.boardId === Te && (Le.value = { request: J, key: G, result: Ze, draft: oe }, oe === i() && (m = Ze.generation, d = oe), await rt());
    }
    async function di() {
      const J = Le.value;
      if (!(!J || !Wt.value || O.value || !P.value)) {
        O.value = !0, bt.value = "";
        try {
          await Ql(J.request, J.key, J.draft);
        } catch (G) {
          bt.value = nt(G, "Could not continue the pack installation.");
        } finally {
          O.value = !1;
        }
      }
    }
    async function ui() {
      if (!O.value) {
        O.value = !0, Q.value = "";
        try {
          const J = await Ct.resume(t.boardId);
          x.value = J.resumed ? "Migration resumes." : "Migration is already running.", await rt();
        } catch (J) {
          Q.value = nt(J, "Could not resume migration.");
        } finally {
          O.value = !1;
        }
      }
    }
    async function Aa(J, G) {
      if (!Z.value || !P.value || O.value || st.value) return "Wait for the current change to finish.";
      if (ot.value) return "Discard the stale draft before removing a definition.";
      const oe = Z.value.generation, Te = JSON.stringify(ht.value), Ze = Xt(te.value);
      Ta(Ze, J, G), st.value = !0;
      try {
        const qe = await Ct.plan(t.boardId, lo(vl(Ze, Z.value.declaration), oe, U.value));
        if (!P.value || ot.value || Z.value.generation !== oe || JSON.stringify(ht.value) !== Te) return "The draft changes during the check. Try the removal again.";
        const Pe = zi(qe, J, G);
        if (Pe) return Pe;
        if (qe.class === "refused") return "Resolve the blocked changes in your draft before removing this definition.";
      } catch (qe) {
        return nt(qe, "Could not check this removal.");
      } finally {
        st.value = !1;
      }
    }
    async function ci() {
      if (t.embedded) {
        o({ name: "boards" });
        return;
      }
      Kl.value && !await Ao.confirm({ header: "Discard changes?", message: "Your unsaved board settings will be discarded.", acceptLabel: "Discard", rejectLabel: "Keep editing" }) || o({ name: "board", board: t.boardId });
    }
    function vi() {
      m = void 0, ra.value = {}, ve.value && rl(ve.value), x.value = "", Q.value = "", F();
    }
    Ie(() => t.boardId, () => {
      ol.value = !1, ra.value = {}, m = void 0, Jl(), V(), Le.value = void 0, bt.value = "", Z.value = void 0, ve.value = void 0, be.value = void 0, U.value = {}, Je.value.clear(), A(), X.value = void 0, T.value = "", de.value = /* @__PURE__ */ new Set(["General"]), g("General"), F(), P.value = !1, me.value = !0, rt(!0);
    });
    let ul = () => {
    };
    return Ie(() => t.boardId, (J) => {
      ul(), ul = ji(`component.${J}`, () => {
        rt();
      });
    }, { immediate: !0 }), wi(rt), Rl(() => {
      ul(), Gl(), Ua(), A();
    }), (J, G) => (n(), b("section", {
      class: ct(["work-settings-shell work-ia", { "work-embedded": e.embedded }])
    }, [
      r("div", tf, [
        y(Zi, {
          ref_key: "rail",
          ref: p,
          label: "Board settings sections",
          value: v.value,
          groups: E.value,
          "leading-item": c.value,
          "onUpdate:value": g
        }, null, 8, ["value", "groups", "leading-item"]),
        r("div", af, [
          r("div", {
            ref_key: "pane",
            ref: f,
            class: "kx-main-scroll work-settings-content",
            role: "region",
            "aria-label": v.value
          }, [
            P.value && Z.value ? (n(), K(hv, {
              key: 0,
              title: v.value,
              description: k[v.value]
            }, Pl({ _: 2 }, [
              el.value || v.value === "Plugins" ? {
                name: "actions",
                fn: q(() => [
                  v.value === "Plugins" ? (n(), K(s(_), {
                    key: 0,
                    label: "Refresh status",
                    severity: "secondary",
                    outlined: "",
                    disabled: O.value || me.value,
                    onClick: G[0] || (G[0] = (oe) => rt())
                  }, {
                    icon: q(() => [
                      y(s(pe), {
                        icon: "tabler:refresh",
                        "aria-hidden": "true"
                      })
                    ]),
                    _: 1
                  }, 8, ["disabled"])) : S("", !0),
                  el.value ? (n(), K(gv, {
                    key: 1,
                    busy: O.value,
                    "discard-disabled": st.value,
                    "review-disabled": st.value || Kt.value || ot.value || !!Je.value.size,
                    onDiscard: vi,
                    onReview: z
                  }, null, 8, ["busy", "discard-disabled", "review-disabled"])) : S("", !0)
                ]),
                key: "0"
              } : void 0
            ]), 1032, ["title", "description"])) : S("", !0),
            Q.value ? (n(), b("div", of, [
              r("p", nf, I(Q.value), 1),
              y(s(_), {
                label: "Retry",
                severity: "secondary",
                outlined: "",
                onClick: G[1] || (G[1] = (oe) => rt())
              })
            ])) : S("", !0),
            x.value ? (n(), b("p", sf, I(x.value), 1)) : S("", !0),
            me.value ? (n(), b("p", rf, "Loading board settings…")) : !P.value && !Q.value ? (n(), b("p", df, "Ask a board administrator to grant you access to these settings.")) : S("", !0),
            P.value && Z.value ? (n(), b("div", uf, [
              Le.value ? (n(), b("section", cf, [
                Wt.value ? (n(), b("p", vf, [
                  G[23] || (G[23] = j("Pack installation status ", -1)),
                  r("strong", null, I(s(Oe)(Le.value.result.status)), 1)
                ])) : (n(), b("p", mf, "Pack applied.")),
                r("p", ff, [
                  G[24] || (G[24] = j("Operation ", -1)),
                  r("code", null, I(Le.value.result.operation_id), 1),
                  G[25] || (G[25] = j(" · Job ", -1)),
                  r("code", null, I(Le.value.result.job_id), 1)
                ]),
                bt.value ? (n(), b("p", pf, I(bt.value), 1)) : S("", !0),
                Wt.value ? (n(), b("div", bf, [
                  y(s(_), {
                    label: "Continue pack installation",
                    severity: "secondary",
                    outlined: "",
                    loading: O.value,
                    disabled: O.value,
                    onClick: di
                  }, null, 8, ["loading", "disabled"])
                ])) : S("", !0)
              ])) : S("", !0),
              ot.value ? (n(), b("p", hf, "Someone saved new settings while you were editing. Discard this draft to load their changes.")) : S("", !0),
              Kt.value ? (n(), b("div", gf, [
                r("p", null, I(ve.value?.migration_error ? "Updating existing items paused." : "Updating existing items…"), 1),
                ve.value?.migration_error ? (n(), K(Ne, {
                  key: 0,
                  label: "Technical details"
                }, {
                  default: q(() => [
                    j(I(ve.value.migration_error), 1)
                  ]),
                  _: 1
                })) : S("", !0),
                ve.value?.migration_error ? (n(), K(s(_), {
                  key: 1,
                  label: "Resume updating items",
                  severity: "secondary",
                  disabled: O.value,
                  outlined: "",
                  onClick: ui
                }, null, 8, ["disabled"])) : S("", !0)
              ])) : S("", !0),
              mt(y(Um, {
                draft: te.value,
                schema: ve.value ?? Z.value,
                board: be.value,
                active: v.value === "General",
                "board-apps": Y.value?.board_apps,
                "draft-form": s(u),
                disabled: O.value || st.value,
                "pack-title": Z.value.pack ? ai.value : void 0,
                outdated: Z.value.outdated,
                "upgrade-reason": li.value,
                "can-upgrade": nl.value && na.value,
                "can-install": na.value,
                "pack-error": s(H),
                onUpgrade: oi,
                onInstall: G[2] || (G[2] = (oe) => ie.value = !0),
                onRetry: G[3] || (G[3] = (oe) => s(L)()),
                onDirtyChange: G[4] || (G[4] = (oe) => ol.value = oe),
                onSaved: G[5] || (G[5] = (oe) => rt())
              }, null, 8, ["draft", "schema", "board", "active", "board-apps", "draft-form", "disabled", "pack-title", "outdated", "upgrade-reason", "can-upgrade", "can-install", "pack-error"]), [
                [xt, v.value === "General"]
              ]),
              r("form", {
                id: s(u),
                ref_key: "editor",
                ref: ll,
                onSubmit: G[15] || (G[15] = Ee((oe) => z(), ["prevent"]))
              }, [
                (n(), b("fieldset", {
                  key: ql.value,
                  class: "work-settings-fieldset",
                  disabled: O.value || st.value,
                  inert: O.value || st.value || void 0
                }, [
                  de.value.has("Item types") ? mt((n(), K(Lr, {
                    key: 0,
                    class: "work-ia-section",
                    draft: te.value,
                    "guard-removal": Aa,
                    issues: al.value
                  }, null, 8, ["draft", "issues"])), [
                    [xt, v.value === "Item types"]
                  ]) : S("", !0),
                  de.value.has("Fields") ? mt((n(), K(Sr, {
                    key: 1,
                    class: "work-ia-section",
                    "board-id": e.boardId,
                    "installed-types": Y.value?.installed_types,
                    draft: te.value,
                    "guard-removal": Aa,
                    issues: al.value,
                    "item-type": T.value,
                    "onUpdate:itemType": G[6] || (G[6] = (oe) => T.value = oe),
                    onValidity: G[7] || (G[7] = (oe, Te) => ua("fields:" + oe, Te))
                  }, null, 8, ["board-id", "installed-types", "draft", "issues", "item-type"])), [
                    [xt, v.value === "Fields"]
                  ]) : S("", !0),
                  de.value.has("Links") ? mt((n(), K(Kc, {
                    key: 2,
                    class: "work-ia-section",
                    draft: te.value,
                    "guard-removal": Aa
                  }, null, 8, ["draft"])), [
                    [xt, v.value === "Links"]
                  ]) : S("", !0),
                  de.value.has("Workflow") ? mt((n(), b("section", wf, [
                    h.value ? (n(), b("p", Vf, [
                      G[26] || (G[26] = j("Item counts are unavailable. ", -1)),
                      y(s(_), {
                        label: "Reload counts",
                        text: "",
                        onClick: G[8] || (G[8] = (oe) => se(e.boardId))
                      })
                    ])) : S("", !0),
                    y(Cc, {
                      "board-id": e.boardId,
                      draft: te.value,
                      "guard-removal": Aa,
                      issues: al.value,
                      counts: X.value,
                      "count-types": Z.value.declaration.item_types,
                      guards: Y.value?.guards,
                      onValidity: G[9] || (G[9] = (oe, Te) => ua("process:" + oe, Te))
                    }, null, 8, ["board-id", "draft", "issues", "counts", "count-types", "guards"])
                  ], 512)), [
                    [xt, v.value === "Workflow"]
                  ]) : S("", !0),
                  de.value.has("Access") ? mt((n(), K(zv, {
                    key: 4,
                    active: v.value === "Access",
                    "board-id": e.boardId,
                    draft: te.value,
                    board: be.value,
                    busy: O.value,
                    onValidity: G[10] || (G[10] = (oe) => ua("visibility", oe))
                  }, null, 8, ["active", "board-id", "draft", "board", "busy"])), [
                    [xt, v.value === "Access"]
                  ]) : S("", !0),
                  de.value.has("Plugins") ? mt((n(), b("section", $f, [
                    y(yo, {
                      "board-id": e.boardId,
                      draft: te.value,
                      schema: ve.value ?? Z.value,
                      options: Y.value?.schema_options.plugins ?? [],
                      "active-configs": ra.value,
                      "onUpdate:activeConfigs": G[11] || (G[11] = (oe) => ra.value = oe),
                      filters: Y.value?.filters,
                      configs: U.value,
                      disabled: O.value,
                      onConfigured: G[12] || (G[12] = (oe) => {
                        gt(), rt();
                      }),
                      onRefresh: G[13] || (G[13] = (oe) => rt()),
                      onReview: z,
                      onValidity: G[14] || (G[14] = (oe, Te) => ua("plugin:" + oe, Te))
                    }, null, 8, ["board-id", "draft", "schema", "options", "active-configs", "filters", "configs", "disabled"])
                  ], 512)), [
                    [xt, v.value === "Plugins"]
                  ]) : S("", !0)
                ], 8, kf))
              ], 40, yf),
              y(Cl, {
                visible: $.value,
                label: "Review changes",
                busy: O.value,
                "return-focus": N.value,
                class: "work-review-sheet",
                onClose: F
              }, {
                default: q(() => [
                  r("div", xf, [
                    r("header", null, [
                      G[27] || (G[27] = r("h2", null, "Review changes", -1)),
                      r("p", Cf, I(be.value?.title), 1)
                    ]),
                    r("div", {
                      class: "work-review-content work-stack",
                      "aria-busy": O.value
                    }, [
                      O.value ? (n(), b("p", Tf, I(We.value ? "Applying or checking changes…" : "Checking the impact on your board…"), 1)) : S("", !0),
                      C.value ? (n(), b("p", If, I(C.value), 1)) : S("", !0),
                      ot.value ? (n(), b("p", Df, "The board changed while you were editing. Close this review and discard the draft to load the latest settings.")) : S("", !0),
                      $.value && !ce.value && (da.value.removed.length || da.value.renamed.length) ? (n(), K(Dc, {
                        key: 3,
                        removed: da.value.removed,
                        renamed: da.value.renamed,
                        disabled: O.value || st.value,
                        confirmed: Ea.value,
                        "onUpdate:confirmed": G[16] || (G[16] = (oe) => Ea.value = oe),
                        onDestination: ti
                      }, null, 8, ["removed", "renamed", "disabled", "confirmed"])) : S("", !0),
                      $.value && ce.value && il.value.length ? (n(), K(yo, {
                        key: 4,
                        "board-id": e.boardId,
                        draft: { plugins: il.value },
                        schema: ve.value ?? Z.value,
                        options: Y.value?.schema_options.plugins.filter((oe) => il.value.some((Te) => Te.use === oe.plugin)) ?? [],
                        configs: U.value,
                        disabled: O.value,
                        "activation-locked": "",
                        onValidity: G[17] || (G[17] = (oe, Te) => ua("pack-plugin:" + oe, Te))
                      }, null, 8, ["board-id", "draft", "schema", "options", "configs", "disabled"])) : S("", !0),
                      $.value ? (n(), K(Gm, {
                        key: 5,
                        "board-id": e.boardId,
                        original: Z.value.declaration,
                        declaration: Zl.value,
                        plan: We.value,
                        follows: ni.value,
                        "config-count": Object.keys(U.value).length,
                        "pack-review": !!we.value,
                        plugins: Y.value?.schema_options.plugins
                      }, {
                        default: q(() => [
                          we.value && ce.value ? (n(), K(ef, {
                            key: 0,
                            plan: we.value,
                            request: ce.value,
                            original: Z.value.declaration,
                            plugins: Y.value?.schema_options.plugins,
                            disabled: O.value,
                            onChange: G[18] || (G[18] = (oe) => {
                              De.value = void 0, Gt.value = "";
                            })
                          }, null, 8, ["plan", "request", "original", "plugins", "disabled"])) : S("", !0)
                        ]),
                        _: 1
                      }, 8, ["board-id", "original", "declaration", "plan", "follows", "config-count", "pack-review", "plugins"])) : S("", !0),
                      !O.value && !Xl.value && !ot.value && !C.value ? (n(), b("p", Uf, "Check the impact again before applying.")) : S("", !0)
                    ], 8, Sf),
                    r("footer", Ef, [
                      y(s(_), {
                        label: "Keep editing",
                        severity: "secondary",
                        outlined: "",
                        disabled: O.value,
                        onClick: F
                      }, null, 8, ["disabled"]),
                      Xl.value ? (n(), K(s(_), {
                        key: 1,
                        label: "Apply changes",
                        disabled: !Yl.value,
                        loading: O.value,
                        onClick: ri
                      }, null, 8, ["disabled", "loading"])) : (n(), K(s(_), {
                        key: 0,
                        label: "Check impact",
                        disabled: O.value || ot.value || !!Je.value.size,
                        onClick: dl
                      }, null, 8, ["disabled"]))
                    ])
                  ])
                ]),
                _: 1
              }, 8, ["visible", "busy", "return-focus"]),
              st.value ? (n(), b("p", Af, "Checking what uses this setting…")) : S("", !0)
            ])) : S("", !0)
          ], 8, lf)
        ])
      ]),
      P.value ? (n(), K(Cl, {
        key: 0,
        visible: ie.value,
        label: "Install pack",
        busy: O.value,
        onClose: G[22] || (G[22] = (oe) => ie.value = !1)
      }, {
        default: q(() => [
          ie.value ? (n(), b("form", {
            key: 0,
            class: "work-dialog-box work-stack",
            onSubmit: Ee(ii, ["prevent"])
          }, [
            G[29] || (G[29] = r("h2", null, "Install a pack", -1)),
            G[30] || (G[30] = r("p", { class: "work-muted work-small" }, "Packs give an empty board a starting setup. Review checks whether this board is eligible.", -1)),
            s($e) ? (n(), b("p", Of, "Loading packs…")) : s(H) ? (n(), b("div", Pf, [
              r("p", Rf, I(s(H)), 1),
              y(s(_), {
                label: "Reload packs",
                severity: "secondary",
                outlined: "",
                onClick: G[19] || (G[19] = (oe) => s(L)())
              })
            ])) : D.value.length ? (n(), b("label", Nf, [
              G[28] || (G[28] = j("Pack ", -1)),
              y(s(fe), {
                modelValue: le.value,
                "onUpdate:modelValue": G[20] || (G[20] = (oe) => le.value = oe),
                "aria-label": "Pack to install",
                appendTo: "self",
                optionLabel: "title",
                optionValue: "id",
                optionDisabled: "disabled",
                options: D.value,
                pt: { option: ({ context: oe }) => ({ "aria-label": [oe.option.title, oe.option.unavailable].filter(Boolean).join(". ") }) }
              }, {
                option: q(({ option: oe }) => [
                  r("span", null, [
                    j(I(oe.title), 1),
                    oe.unavailable ? (n(), b("small", Mf, I(oe.unavailable), 1)) : S("", !0)
                  ])
                ]),
                _: 1
              }, 8, ["modelValue", "options", "pt"])
            ])) : (n(), b("p", Ff, "No available packs were found.")),
            r("footer", Lf, [
              y(s(_), {
                label: "Cancel",
                severity: "secondary",
                outlined: "",
                onClick: G[21] || (G[21] = (oe) => ie.value = !1)
              }),
              y(s(_), {
                type: "submit",
                label: "Review pack",
                disabled: !ne.value || !na.value || s($e) || !!s(H)
              }, null, 8, ["disabled"])
            ])
          ], 32)) : S("", !0)
        ]),
        _: 1
      }, 8, ["visible", "busy"])) : S("", !0)
    ], 2));
  }
}), zf = /* @__PURE__ */ Ve({
  __name: "SettingsRoot",
  setup(e) {
    const a = Vi(), t = $i();
    return ki(Po, (l) => {
      a.value.embedded && l.name === "boards" ? t("back-to-boards", {}) : t("navigate", { route: _i(l) });
    }), (l, o) => (n(), K(Bf, {
      "board-id": s(a).boardId ?? "",
      embedded: s(a).embedded,
      "focus-back": s(a).focusBack,
      onDirtyChange: o[0] || (o[0] = (u) => s(t)("dirty-change", { dirty: u }))
    }, null, 8, ["board-id", "embedded", "focus-back"]));
  }
}), jf = xi(zf, {
  type: "object",
  properties: {
    "board-id": { type: "string", default: "", description: "Board to administer." },
    "focus-back": { type: "boolean", default: !1, description: "Focus the first rail action when opening settings from the board picker." },
    embedded: { type: "boolean", default: !1, description: "Fits in a System detail pane." }
  }
});
Wi(import.meta.url, jf);
//# sourceMappingURL=settings.js.map
