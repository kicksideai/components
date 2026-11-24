import { defineComponent as Se, computed as F, openBlock as n, createBlock as K, resolveDynamicComponent as Ia, normalizeProps as xi, guardReactiveProps as Ci, createSlots as Da, withCtx as q, createElementVNode as s, normalizeClass as pt, createElementBlock as f, Fragment as ee, renderList as fe, toDisplayString as S, createCommentVNode as C, unref as c, renderSlot as Ye, inject as il, useId as $t, createVNode as k, createTextVNode as W, useModel as Eo, useSlots as Ro, watch as Ue, Transition as Gl, withDirectives as yt, vShow as It, mergeModels as Oo, ref as B, onMounted as Ea, onUnmounted as Kl, resolveComponent as Po, onBeforeUnmount as Et, withKeys as Je, withModifiers as Be, normalizeStyle as Si, watchEffect as No, nextTick as wt, provide as Mo, reactive as Ti } from "vue";
import { e as Ft, u as Ii, a as Di, b as Ui, c as Ai } from "./mount-Vm8EEgjb.js";
import "pinia";
import { m as Ka, h as uo, s as ke, i as Ei, t as Xe, g as Ri, j as ta, k as Me, n as Ze, o as je, q as Xt, r as co, w as Nt, f as mt, l as ua, v as ct, x as Bt, y as Fo, z as Lo, A as zt, B as Bo, C as Ua, D as nl, d as zo, E as Ra, c as Qa, F as Oi, G as _a, H as El, I as Pi, J as na, K as Ni, L as Mi, _ as Rl, M as vo, N as Fi, O as jo, P as Li, Q as Bi, u as zi, a as ji, p as qi, R as sa, S as Wi, T as fo, U as Gi, V as hl, W as Ki, X as Hi, Y as mo, Z as Yi, $ as Xi } from "./usePackDiscovery-eNQQwSzJ.js";
import he from "primevue/select";
import ae from "primevue/button";
import { Icon as pe } from "@iconify/vue";
import { api as Ol, host as qo, on as Ji, define as Zi } from "@wippy-fe/proxy";
import Lt from "primevue/checkbox";
import Qi from "primevue/radiobutton";
import et from "primevue/tag";
import st from "primevue/toggleswitch";
import Re from "primevue/inputtext";
import Aa from "primevue/textarea";
import Dt from "primevue/inputnumber";
import Hl from "primevue/selectbutton";
import Wo from "primevue/message";
const bl = (e, a) => e.x > a.x && e.x < a.x + a.width && e.y > a.y && e.y < a.y + a.height;
function _i(e, a, t) {
  return e.x === a.x ? e.x > t.x && e.x < t.x + t.width && Math.max(e.y, a.y) > t.y && Math.min(e.y, a.y) < t.y + t.height : e.y > t.y && e.y < t.y + t.height && Math.max(e.x, a.x) > t.x && Math.min(e.x, a.x) < t.x + t.width;
}
function Kt(e, a, t) {
  const l = [.../* @__PURE__ */ new Set([e.x, a.x, ...t.flatMap((x) => [x.x, x.x + x.width])])].sort((x, $) => x - $), o = [.../* @__PURE__ */ new Set([e.y, a.y, ...t.flatMap((x) => [x.y, x.y + x.height])])].sort((x, $) => x - $);
  l.unshift(l[0] - 24), l.push(l.at(-1) + 24), o.unshift(o[0] - 24), o.push(o.at(-1) + 24);
  const r = l.length, v = o.indexOf(a.y) * r + l.indexOf(a.x), m = o.indexOf(e.y) * r + l.indexOf(e.x), b = (x) => ({ x: l[x % r], y: o[Math.floor(x / r)] }), i = /* @__PURE__ */ new Map(), u = /* @__PURE__ */ new Map(), d = [];
  function V(x) {
    d.push(x);
    let $ = d.length - 1;
    for (; $; ) {
      const T = $ - 1 >> 1;
      if (d[T].priority <= x.priority) break;
      d[$] = d[T], $ = T;
    }
    d[$] = x;
  }
  function g() {
    const x = d[0], $ = d.pop();
    if (d.length) {
      let T = 0;
      for (; T * 2 + 1 < d.length; ) {
        let D = T * 2 + 1;
        if (D + 1 < d.length && d[D + 1].priority < d[D].priority && D++, $.priority <= d[D].priority) break;
        d[T] = d[D], T = D;
      }
      d[T] = $;
    }
    return x;
  }
  const h = (x) => Math.abs(x.x - a.x) + Math.abs(x.y - a.y);
  for (const x of [0, 1]) {
    const $ = m * 2 + x;
    i.set($, 0), V({ key: $, cost: 0, priority: h(e) });
  }
  const p = /* @__PURE__ */ new Map(), w = /* @__PURE__ */ new Map();
  for (; d.length; ) {
    const x = g(), $ = Math.floor(x.key / 2), T = x.key % 2;
    if (x.cost !== i.get(x.key)) continue;
    if ($ === v) {
      const Z = [];
      let ue = x.key;
      for (; ue !== void 0; )
        Z.push(b(Math.floor(ue / 2))), ue = u.get(ue);
      return Go(Z.reverse());
    }
    const D = b($), z = $ % r, le = Math.floor($ / r);
    for (const [Z, ue] of [[z > 0 ? $ - 1 : -1, 0], [z + 1 < r ? $ + 1 : -1, 0], [le > 0 ? $ - r : -1, 1], [le + 1 < o.length ? $ + r : -1, 1]]) {
      if (Z < 0) continue;
      const me = b(Z);
      if (p.has(Z) || p.set(Z, !t.some((R) => bl(me, R))), !p.get(Z)) continue;
      const ge = `${Math.min($, Z)}:${Math.max($, Z)}`;
      if (w.has(ge) || w.set(ge, !t.some((R) => _i(D, me, R))), !w.get(ge)) continue;
      const be = x.cost + Math.abs(D.x - me.x) + Math.abs(D.y - me.y) + (T === ue ? 0 : 18), se = Z * 2 + ue;
      be >= (i.get(se) ?? 1 / 0) || (i.set(se, be), u.set(se, x.key), V({ key: se, cost: be, priority: be + h(me) }));
    }
  }
  throw new Error("Process map has no collision-free route between its ports: " + JSON.stringify({ start: e, end: a, startInside: t.filter((x) => bl(e, x)), endInside: t.filter((x) => bl(a, x)) }));
}
function Go(e) {
  const a = [];
  for (const t of e) {
    const l = a.at(-1), o = a.at(-2);
    l && l.x === t.x && l.y === t.y || (o && l && (o.x === l.x && l.x === t.x || o.y === l.y && l.y === t.y) && a.pop(), a.push(t));
  }
  return a;
}
const ga = (e) => Array.from(e).reduce((a, t) => a + (/[^\x20-\x7e]/u.test(t) ? 16 : /[MW@%]/.test(t) ? 11 : /[ilI.,:;!| ']/.test(t) ? 4 : 7.5), 0);
function ra(e, a = 28) {
  const t = [];
  let l = "";
  for (const o of e.split(/\s+/u))
    for (let r = 0; r < o.length; r += a) {
      const v = o.slice(r, r + a);
      l && l.length + v.length + 1 > a && (t.push(l), l = ""), l = l ? l + " " + v : v;
    }
  return [...t, l].filter(Boolean);
}
function za(e) {
  if (e = Go(e), !e.length) return "";
  let a = `M ${e[0].x} ${e[0].y}`;
  for (let l = 1; l < e.length - 1; l++) {
    const o = e[l - 1], r = e[l], v = e[l + 1], m = Math.hypot(r.x - o.x, r.y - o.y), b = Math.hypot(v.x - r.x, v.y - r.y), i = Math.min(8, m / 3, b / 3);
    i && (a += ` L ${r.x + (o.x - r.x) * i / m} ${r.y + (o.y - r.y) * i / m} Q ${r.x} ${r.y} ${r.x + (v.x - r.x) * i / b} ${r.y + (v.y - r.y) * i / b}`);
  }
  const t = e.at(-1);
  return a + ` L ${t.x} ${t.y}`;
}
function en(e, a = {}, t = { width: 1400, height: 480 }) {
  const l = t.direction ?? (t.width < 750 || Ka(e).length > 8 ? "TB" : "LR"), o = t.direction === "LR" && Ka(e).length > 6, r = new uo.graphlib.Graph({ multigraph: !0 });
  r.setGraph({ rankdir: l, ranker: "network-simplex", acyclicer: "greedy", nodesep: 32, edgesep: 32, ranksep: 24, marginx: 32, marginy: 32 }), r.setDefaultEdgeLabel(() => ({}));
  const v = Ka(e), m = new Map(v.map((y, U) => [y.id, U])), b = e.states.map((y) => {
    const U = (e.transitions ?? []).filter((E) => E.from === "any" && E.to === y.id), P = ra(ke(y), o ? 13 : 28), A = ra(Ei(y, e), o ? 13 : 28), G = U.flatMap((E) => ra(Xe(E) + " works from any state")), re = a.policy?.wip?.[y.id]?.limit, te = re === void 0 ? 0 : ga(" · limit " + re), I = Math.max(o ? 122 : 168, ...P.map((E) => ga(E) + 58), ...A.map((E, oe) => ga(E) + 32 + (oe === A.length - 1 ? te : 0)), ...G.map((E) => ga(E) + 32)), Q = Math.max(80, 42 + P.length * 18 + A.length * 16 + G.length * 18);
    return r.setNode(y.id, { width: I + (l === "LR" ? 36 : 0), height: Q + (l === "TB" ? 36 : 0) }), { state: y, x: 0, y: 0, width: I, height: Q, title: P, caption: A, badges: U, row: m.has(y.id) ? 0 : 1 };
  }), i = new Set(b.map((y) => y.state.id)), u = (e.transitions ?? []).flatMap((y) => y.from === "any" ? [] : y.from.filter((U) => i.has(U) && i.has(y.to)).map((U) => {
    const P = `${y.id}-${U}`, A = ra(Xe(y), o ? 12 : 28), G = Math.max(o ? 60 : 72, ...A.map((te) => ga(te) + 24)), re = Math.max(24, A.length * 16 + 10);
    return { transition: y, from: U, key: P, lines: A, width: G, height: re };
  })), d = /* @__PURE__ */ new Set(), V = /* @__PURE__ */ new Set(), g = new Set(u.filter((y) => y.from === y.transition.to || y.transition.to === e.initial || ["completed", "canceled"].includes(b.find((U) => U.state.id === y.from).state.category)).map((y) => y.key));
  function h(y) {
    if (!V.has(y)) {
      d.add(y);
      for (const U of u.filter((P) => P.from === y))
        g.has(U.key) || (d.has(U.transition.to) ? g.add(U.key) : h(U.transition.to));
      d.delete(y), V.add(y);
    }
  }
  h(e.initial);
  for (const y of b) h(y.state.id);
  for (const y of u) if (!g.has(y.key)) {
    const U = m.get(y.from), P = m.get(y.transition.to);
    r.setEdge(y.from, y.transition.to, { width: y.width, height: y.height, labelpos: "c", weight: U !== void 0 && P === U + 1 ? 100 : 1 }, y.key);
  }
  for (const y of e.transitions ?? []) if (y.from === "any" && i.has(e.initial) && i.has(y.to) && !m.has(y.to)) {
    const U = e.states.find((P) => P.id === y.to);
    r.setEdge(e.initial, y.to, { minlen: ["completed", "canceled"].includes(U.category) ? Math.max(1, v.length - 1) : 1 }, `any:${y.id}`);
  }
  const p = e.states.flatMap((y) => (y.regions ?? []).filter((U) => i.has(U.initial)).map((U, P) => {
    const A = `lane:${y.id}:${P}`;
    return r.setEdge(y.id, U.initial, {}, A), { state: y, region: U, key: A };
  }));
  if (!b.length) return { nodes: b, edges: [], parallels: [], main: v, direction: l, width: 320, height: 160 };
  uo.layout(r);
  for (const y of b) Object.assign(y, { x: r.node(y.state.id).x, y: r.node(y.state.id).y });
  const w = l === "TB", x = u.filter((y) => !g.has(y.key)).map((y) => r.edge({ v: y.from, w: y.transition.to, name: y.key })), $ = [...b, ...x], T = Math.max(...$.map((y) => y.x + y.width / 2)), D = Math.max(...$.map((y) => y.y + y.height / 2)), z = (y) => b.find((U) => U.state.id === y), le = u.filter((y) => g.has(y.key)).sort((y, U) => {
    const P = w ? "y" : "x";
    return Math.abs(z(y.from)[P] - z(y.transition.to)[P]) - Math.abs(z(U.from)[P] - z(U.transition.to)[P]);
  }), Z = /* @__PURE__ */ new Map(), ue = Math.max(0, ...le.map((y) => y.width));
  let me = D + 32;
  for (const [y, U] of le.entries()) {
    const P = z(U.from), A = z(U.transition.to), G = w ? T + 16 + ue + 28 + y * 18 : me + U.height / 2, re = w ? T + 16 + ue / 2 : (P.x + A.x) / 2;
    let te = w ? P.y + P.height / 2 + 18 : G;
    if (w) for (const I of [...Z.values()].sort((Q, E) => Q.y - E.y))
      te + U.height / 2 + 10 > I.y - I.height / 2 - 10 && te - U.height / 2 - 10 < I.y + I.height / 2 + 10 && (te = I.y + I.height / 2 + 24 + U.height / 2);
    Z.set(U.key, { x: re, y: te, corridor: G, height: U.height }), me = G + U.height / 2 + 24;
  }
  const ge = u.map((y) => ({ ...y, ...Z.get(y.key) ?? r.edge({ v: y.from, w: y.transition.to, name: y.key }) })), be = (y, U) => ({ x: y.x - y.width / 2 - U, y: y.y - y.height / 2 - U, width: y.width + U * 2, height: y.height + U * 2 }), se = [...b.map((y) => be(y, 12)), ...ge.map((y) => be(y, 10))], R = (y, U) => ({
    start: w ? { x: y.x, y: y.y + y.height / 2 } : { x: y.x + y.width / 2, y: y.y },
    end: w ? { x: U.x, y: U.y - U.height / 2 } : { x: U.x - U.width / 2, y: U.y }
  }), _ = (y, U) => w ? { x: y.x, y: y.y + U } : { x: y.x + U, y: y.y }, L = ge.map((y) => {
    const U = b.find((O) => O.state.id === y.from), P = b.find((O) => O.state.id === y.transition.to), { start: A, end: G } = R(U, P), re = g.has(y.key), te = _(A, 18), I = _(G, -18), Q = (re || !w ? y.width : y.height) / 2 + 10, E = re ? { x: y.x + (w ? -Q : Q), y: y.y } : _(y, -Q), oe = re ? { x: y.x + (w ? Q : -Q), y: y.y } : _(y, Q);
    let Ve;
    if (re) {
      const { corridor: O } = Z.get(y.key), Y = w ? { x: O, y: y.y } : { x: te.x, y: O }, ye = w ? { x: O, y: I.y } : { x: I.x, y: O };
      Ve = w ? [
        [A, ...Kt(te, E, se)],
        [oe, Y, ye, ...Kt(ye, I, se), G]
      ] : [
        [A, ...Kt(te, Y, se), E],
        [oe, ...Kt(ye, I, se), G]
      ];
    } else Ve = [
      [A, ...Kt(te, E, se)],
      [...Kt(oe, I, se), G]
    ];
    const Pe = re ? "return" : m.get(y.transition.to) === (m.get(y.from) ?? -2) + 1 ? "main" : "forward";
    return { ...y, points: Ve.flat(), segments: Ve, path: Ve.map(za).join(" "), type: Pe, targetOffset: 0 };
  }), ie = p.map((y) => {
    const U = b.find((te) => te.state.id === y.state.id), P = b.find((te) => te.state.id === y.region.initial), { start: A, end: G } = R(U, P), re = [A, ...Kt(_(A, 18), _(G, -18), se), G];
    return { state: y.state, key: y.key, points: re, path: za(re) };
  }), xe = [...b.flatMap((y) => [{ x: y.x - y.width / 2, y: y.y - y.height / 2 }, { x: y.x + y.width / 2, y: y.y + y.height / 2 }]), ...L.flatMap((y) => [...y.points, { x: y.x - y.width / 2, y: y.y - y.height / 2 }, { x: y.x + y.width / 2, y: y.y + y.height / 2 }]), ...ie.flatMap((y) => y.points)], Oe = 32 - Math.min(...xe.map((y) => y.x)), H = 32 - Math.min(...xe.map((y) => y.y)), j = Math.max(...xe.map((y) => y.x)) + Oe + 32, M = Math.max(...xe.map((y) => y.y)) + H + 32, ce = (y) => ({ x: y.x + Oe, y: y.y + H });
  for (const y of b) Object.assign(y, ce(y));
  for (const y of L)
    Object.assign(y, ce(y)), y.segments = y.segments.map((U) => U.map(ce)), y.points = y.segments.flat(), y.path = y.segments.map(za).join(" ");
  for (const y of ie)
    y.points = y.points.map(ce), y.path = za(y.points);
  return { nodes: b, edges: L, parallels: ie, main: v, direction: l, width: j, height: M };
}
const tn = ["aria-label"], an = {
  key: 0,
  class: "kx-settings-rail-group"
}, ln = ["aria-current", "onClick"], on = { class: "kx-settings-rail-label" }, nn = /* @__PURE__ */ Se({
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
    const a = e, t = F(() => a.leadingItem ? [{ items: [a.leadingItem] }, ...a.groups] : a.groups);
    function l(o) {
      const r = [...o.currentTarget.querySelectorAll(".kx-settings-rail-item")], v = r.indexOf(o.target);
      if (v < 0) return;
      let m;
      switch (o.key) {
        case "ArrowDown":
        case "ArrowRight":
          m = (v + 1) % r.length;
          break;
        case "ArrowUp":
        case "ArrowLeft":
          m = (v + r.length - 1) % r.length;
          break;
        case "Home":
          m = 0;
          break;
        case "End":
          m = r.length - 1;
          break;
        default:
          return;
      }
      o.preventDefault(), r[m]?.focus();
    }
    return (o, r) => (n(), K(Ia(e.title ? Ri : "div"), xi(Ci(e.title ? { title: e.title, count: e.count, settings: !0 } : { class: "kx-settings-rail-standalone" })), Da({
      default: q(() => [
        s("nav", {
          class: pt(["kx-settings-rail", { "kx-settings-rail-framed": e.title }]),
          "aria-label": e.label,
          onKeydown: l
        }, [
          (n(!0), f(ee, null, fe(t.value, (v, m) => (n(), f("div", {
            key: v.items[0]?.value ?? m,
            class: pt(["kx-settings-rail-section", { "kx-settings-rail-leading": e.leadingItem && m === 0 }])
          }, [
            v.heading ? (n(), f("div", an, S(v.heading), 1)) : C("", !0),
            (n(!0), f(ee, null, fe(v.items, (b) => (n(), f("button", {
              key: b.value,
              type: "button",
              class: "kx-settings-rail-item",
              "aria-current": b.value === e.value ? "true" : void 0,
              onClick: (i) => o.$emit("update:value", b.value)
            }, [
              b.icon ? (n(), K(c(pe), {
                key: 0,
                class: "kx-settings-rail-icon",
                icon: b.icon,
                "aria-hidden": "true"
              }, null, 8, ["icon"])) : C("", !0),
              s("span", on, S(b.label), 1)
            ], 8, ln))), 128))
          ], 2))), 128))
        ], 42, tn)
      ]),
      _: 2
    }, [
      e.title && o.$slots.actions ? {
        name: "actions",
        fn: q(() => [
          Ye(o.$slots, "actions")
        ]),
        key: "0"
      } : void 0
    ]), 1040));
  }
}), Ko = Symbol("work-navigation");
function sn() {
  return il(Ko, () => {
  });
}
function rn(e) {
  if (e.name === "boards") return "";
  const a = encodeURIComponent(e.board);
  return e.name === "settings" ? `${a}/settings` : a;
}
const aa = (e) => `/api/v1/work/boards/${encodeURIComponent(e)}`, po = (e) => ({
  declaration: e.declaration,
  expected_generation: e.expected_generation,
  plugin_configs: e.plugin_configs,
  ...Object.keys(e.resolutions).length ? { resolutions: e.resolutions } : {}
}), Qt = {
  packPlan: (e, a) => ta(`${aa(e)}/pack_plan`, a, "Pack plan"),
  packApply: (e, a, t) => ta(`${aa(e)}/pack_apply`, { ...a, key: t }, "Apply pack"),
  plan: (e, a) => ta(`${aa(e)}/plan_schema`, po(a), "Schema plan"),
  apply: (e, a, t) => ta(`${aa(e)}/apply_schema`, { ...po(a), key: t }, "Apply schema"),
  resume: (e) => ta(`${aa(e)}/resume_migration`, {}, "Resume migration"),
  configure: (e, a, t) => ta(`${aa(e)}/configure_plugin`, { plugin: a, ...t === void 0 ? {} : { config: t } }, "Configure plugin")
}, dn = {
  class: "work-settings-card work-stack",
  "aria-label": "Fields with saved values"
}, un = ["disabled"], cn = { key: 0 }, vn = { class: "work-small" }, fn = ["aria-label"], mn = { class: "work-muted work-small" }, pn = { key: 0 }, gn = {
  key: 0,
  class: "work-row work-field-removal-confirm"
}, hn = {
  key: 1,
  class: "work-muted work-small",
  role: "status"
}, bn = /* @__PURE__ */ Se({
  __name: "FieldRemovals",
  props: {
    removals: {},
    original: {},
    draft: {},
    choices: {},
    disabled: { type: Boolean },
    dropConfirmed: { type: Boolean }
  },
  emits: ["choose", "update:dropConfirmed"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = $t(), r = [
      { value: "keep", label: "Keep the field" },
      { value: "archive", label: "Archive the values" },
      { value: "drop", label: "Delete the values" }
    ], v = F(() => t.removals.map((d) => {
      const V = t.original.fields?.find((w) => w.code === d.code) ?? t.draft.fields?.find((w) => w.code === d.code), g = d.item_type ? t.original.item_types?.find((w) => w.id === d.item_type) : void 0, h = d.item_type ? g?.title || Me(d.item_type) : "", p = t.choices[d.path ?? ""] ?? "keep";
      return { change: d, path: d.path ?? "", field: V ? Ze(V) : Me(d.code), typeTitle: h, choice: p };
    })), m = F(() => v.value.filter((d) => d.choice === "drop")), b = F(() => v.value.some((d) => d.choice === "keep")), i = (d) => d === void 0 ? "Items" : d === 1 ? "1 item" : d.toLocaleString() + " items";
    function u(d, V) {
      return d === "archive" ? V ? `${V} items stop showing the field. Saved values stay stored and return if the field is added back.` : "The field is removed. Saved values stay stored and return if the field is added back." : d === "drop" ? "Saved values are deleted. Audit history follows the board’s retention settings." : "Nothing changes for this field. To apply the rest of the draft, choose Archive or Delete.";
    }
    return (d, V) => (n(), f("section", dn, [
      V[4] || (V[4] = s("h3", { class: "work-row-title" }, "Fields with saved values", -1)),
      V[5] || (V[5] = s("p", { class: "work-muted work-small" }, "This draft removes fields that items still use. Choose what happens to their values.", -1)),
      (n(!0), f(ee, null, fe(v.value, (g, h) => (n(), f("fieldset", {
        key: g.path,
        class: "work-field-removal work-stack work-tight",
        disabled: e.disabled
      }, [
        s("legend", null, [
          s("strong", null, S(g.field), 1),
          g.typeTitle ? (n(), f("span", cn, " · " + S(g.typeTitle), 1)) : C("", !0)
        ]),
        s("p", vn, S(i(g.change.count)) + " on this board " + S(g.change.count === 1 ? "holds a value" : "hold values") + " in this field" + S(g.typeTitle ? "; " + g.typeTitle + " items lose it." : "."), 1),
        s("div", {
          class: "work-row work-wrap",
          role: "radiogroup",
          "aria-label": "What happens to " + g.field + " values"
        }, [
          (n(), f(ee, null, fe(r, (p) => s("label", {
            key: p.value,
            class: "work-row work-field-removal-choice"
          }, [
            k(c(Qi), {
              "input-id": c(o) + "-" + h + "-" + p.value,
              name: c(o) + "-" + h,
              value: p.value,
              "model-value": g.choice,
              "onUpdate:modelValue": (w) => l("choose", g.path, w)
            }, null, 8, ["input-id", "name", "value", "model-value", "onUpdate:modelValue"]),
            s("span", null, S(p.label), 1)
          ])), 64))
        ], 8, fn),
        s("p", mn, S(u(g.choice, g.typeTitle)), 1),
        k(je, {
          class: "work-small",
          label: "Technical details"
        }, {
          default: q(() => [
            s("p", null, [
              V[2] || (V[2] = W("Field ", -1)),
              s("code", null, S(g.change.code), 1),
              g.change.item_type ? (n(), f("span", pn, [
                V[1] || (V[1] = W(" · item type ", -1)),
                s("code", null, S(g.change.item_type), 1)
              ])) : C("", !0)
            ]),
            s("p", null, [
              V[3] || (V[3] = W("Resolution path ", -1)),
              s("code", null, S(g.path), 1)
            ])
          ]),
          _: 2
        }, 1024)
      ], 8, un))), 128)),
      m.value.length ? (n(), f("label", gn, [
        k(c(Lt), {
          binary: "",
          "model-value": e.dropConfirmed,
          disabled: e.disabled,
          "onUpdate:modelValue": V[0] || (V[0] = (g) => l("update:dropConfirmed", g))
        }, null, 8, ["model-value", "disabled"]),
        s("span", null, "Delete the saved values in " + S(m.value.map((g) => g.field).join(", ")) + ". This cannot be undone.", 1)
      ])) : C("", !0),
      b.value ? (n(), f("p", hn, "Fields set to Keep block this draft. Discard the draft to keep everything as it is.")) : C("", !0)
    ]));
  }
}), Yl = /* @__PURE__ */ Se({
  __name: "ContentAction",
  props: {
    as: { default: "button" },
    disabled: { type: Boolean },
    role: { default: "button" }
  },
  emits: ["activate"],
  setup(e, { emit: a }) {
    const t = e, l = a;
    function o(v) {
      if (t.disabled || v.defaultPrevented) return;
      const m = v.target;
      if (m instanceof Element && m !== v.currentTarget) {
        const b = m.closest('[data-work-action], button, a, input, textarea, [role="combobox"], [role="checkbox"], [role="switch"], details');
        if (b && b !== v.currentTarget) return;
      }
      l("activate", v);
    }
    function r(v) {
      v.target !== v.currentTarget || !["Enter", " "].includes(v.key) || (v.preventDefault(), t.disabled || l("activate", v));
    }
    return (v, m) => (n(), K(Ia(e.as), {
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
      default: q(() => [
        Ye(v.$slots, "default")
      ]),
      _: 3
    }, 40, ["type", "role", "tabindex", "disabled", "aria-disabled"]));
  }
}), sl = Symbol("section row"), yn = { class: "work-definition" }, kn = {
  key: 0,
  class: "work-definition-handle"
}, wn = { class: "work-definition-lead" }, $n = ["title"], Vn = {
  key: 0,
  class: "work-definition-description"
}, xn = { class: "work-definition-details" }, Cn = { class: "work-definition-code" }, Sn = ["title"], Tn = { class: "work-definition-kind" }, In = {
  key: 0,
  class: "work-definition-kind-label"
}, Dn = { class: "work-definition-kind-value" }, Un = { class: "work-definition-flags" }, An = { class: "work-definition-usage" }, En = { class: "work-definition-actions" }, Rn = ["inert"], Xl = /* @__PURE__ */ Se({
  __name: "DefinitionRow",
  props: /* @__PURE__ */ Oo({
    title: {},
    code: {},
    kind: {},
    kindLabel: {},
    description: {},
    initialOpen: { type: Boolean },
    routeSection: {},
    routeId: {}
  }, {
    open: { type: Boolean, default: !1 },
    openModifiers: {}
  }),
  emits: ["update:open"],
  setup(e) {
    const a = e, t = Eo(e, "open");
    a.initialOpen && (t.value = !0);
    const l = Ro(), o = il(sl, void 0);
    function r(m) {
      return !!a.routeSection && !!a.routeId && m === a.routeSection + "/" + a.routeId;
    }
    Ue(() => o?.selected.value, (m, b) => {
      r(m) ? t.value = !0 : r(b) && (t.value = !1);
    }, { immediate: !0 });
    function v() {
      t.value = !t.value, a.routeSection && a.routeId && o?.choose(a.routeSection, a.routeId, t.value);
    }
    return (m, b) => (n(), f("article", yn, [
      s("header", {
        class: pt(["work-definition-head", { "work-definition-has-handle": c(l).handle }])
      }, [
        c(l).handle ? (n(), f("div", kn, [
          Ye(m.$slots, "handle")
        ])) : C("", !0),
        s("div", wn, [
          k(Yl, {
            class: "work-definition-toggle",
            "aria-expanded": t.value,
            onActivate: v
          }, {
            default: q(() => [
              k(c(pe), {
                icon: "tabler:chevron-right",
                "aria-hidden": "true"
              }),
              s("span", {
                class: "work-row-title",
                title: e.title
              }, S(e.title), 9, $n)
            ]),
            _: 1
          }, 8, ["aria-expanded"]),
          e.description ? (n(), f("p", Vn, S(e.description), 1)) : C("", !0)
        ]),
        s("div", xn, [
          s("span", Cn, [
            e.code ? (n(), f("code", {
              key: 0,
              class: "work-mono",
              title: e.code
            }, S(e.code), 9, Sn)) : C("", !0)
          ]),
          s("span", Tn, [
            e.kind ? (n(), K(c(et), {
              key: 0,
              severity: "secondary"
            }, {
              default: q(() => [
                e.kindLabel ? (n(), f("span", In, S(e.kindLabel) + ":", 1)) : C("", !0),
                s("span", Dn, S(e.kind), 1)
              ]),
              _: 1
            })) : C("", !0),
            Ye(m.$slots, "status")
          ]),
          s("span", Un, [
            Ye(m.$slots, "flags")
          ]),
          s("div", An, [
            Ye(m.$slots, "usage")
          ])
        ]),
        s("div", En, [
          Ye(m.$slots, "actions")
        ])
      ], 2),
      k(Gl, {
        name: "work-panel",
        persisted: ""
      }, {
        default: q(() => [
          yt(s("div", {
            inert: !t.value,
            class: "work-definition-body work-stack"
          }, [
            Ye(m.$slots, "default")
          ], 8, Rn), [
            [It, t.value]
          ])
        ]),
        _: 3
      })
    ]));
  }
}), On = { class: "work-definition-scroll" }, Pn = {
  key: 0,
  class: "work-definition-columns",
  "aria-hidden": "true"
}, Nn = { key: 0 }, Mn = { class: "work-definition-usage" }, Jl = /* @__PURE__ */ Se({
  __name: "DefinitionList",
  props: {
    count: {},
    columns: {}
  },
  setup(e) {
    return (a, t) => (n(), f("div", On, [
      s("div", {
        class: pt(["work-field-builder", "work-definitions-" + e.columns])
      }, [
        e.count > 3 && e.columns !== "plugins" ? (n(), f("div", Pn, [
          t[0] || (t[0] = s("span", null, null, -1)),
          t[1] || (t[1] = s("span", null, "Name", -1)),
          t[2] || (t[2] = s("span", { class: "work-definition-code" }, "Identifier", -1)),
          s("span", null, S(e.columns === "types" ? "Workflow" : "Kind"), 1),
          e.columns === "fields" ? (n(), f("span", Nn, "Details")) : C("", !0),
          s("span", Mn, S(e.columns === "fields" ? "Used by" : "Details"), 1),
          t[3] || (t[3] = s("span", null, null, -1))
        ])) : C("", !0),
        Ye(a.$slots, "default")
      ], 2)
    ]));
  }
}), Fn = [
  { code: "key", form: "text", index: "key" },
  { code: "type", form: "text", index: "key" },
  { code: "state", form: "text", index: "key" },
  { code: "category", form: "text", index: "key" },
  { code: "rank", form: "text", index: "key" },
  { code: "parent", form: "text", index: "key" },
  { code: "created_at", form: "time", index: "key" },
  { code: "updated_at", form: "time", index: "key" }
];
function Ln(e) {
  const a = e.compiled.processes?.flatMap((t) => t.states.map((l) => ({ id: l.id, label: l.name }))) ?? [];
  return [...Fn.filter((t) => t.code !== "rank").map((t) => t.code === "state" ? { ...t, type: "option", options: a } : t.code === "category" ? { ...t, type: "option", options: ["triage", "backlog", "unstarted", "started", "completed", "canceled"].map((l) => ({ id: l })) } : t), ...(e.compiled.fields ?? []).filter((t) => t.index && t.index !== "none")];
}
function Bn(e) {
  if (e?.cardinality && e.cardinality !== "one") return ["has", "in", "nin", "is_null", ...e.type === "principal" ? ["member_of"] : []];
  const a = ["eq", "neq", "in", "nin", "is_null", ...e?.type === "principal" ? ["member_of"] : []];
  return e && (["int", "number", "dec", "time", "quantity"].includes(e.form ?? "") || e.index === "number") && a.push("lt", "lte", "gt", "gte", "between"), e?.form === "text" && e.type !== "option" && a.push("contains", "starts_with"), a;
}
const zn = { class: "work-field-control" }, jn = ["id"], qn = {
  key: 1,
  class: "work-stack work-tight"
}, Wn = { class: "work-chips" }, Gn = {
  key: 5,
  class: "work-row"
}, Kn = ["inert"], Hn = ["value"], Yn = {
  key: 1,
  class: "work-muted"
}, Xn = ["inert"], Jn = ["value"], Zn = {
  key: 1,
  class: "work-muted"
}, Qn = {
  key: 11,
  class: "work-stack work-tight"
}, _n = {
  class: "work-stack work-tight",
  "aria-label": "Matching items"
}, es = { class: "work-mono" }, ts = {
  key: 15,
  class: "work-error work-small",
  role: "alert"
}, Ho = /* @__PURE__ */ Se({
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
    const t = e, l = a, o = F(() => t.inputId ?? `field-${t.field.code}`), r = F(() => !!t.field.cardinality && t.field.cardinality !== "one"), v = F(() => Array.isArray(t.modelValue) ? t.modelValue : []), m = F(() => t.modelValue == null ? "" : typeof t.modelValue == "object" ? Xt(t.modelValue) : String(t.modelValue)), b = F(() => {
      const y = t.modelValue;
      return y && typeof y == "object" && "ref" in y && Array.isArray(y.ref) ? String(y.ref[1] ?? "") : "";
    }), i = F(() => t.disabled || co(t.field)), u = B(!1), d = B(!1), V = B(!1), g = B(""), h = B(""), p = B([]), w = ua(), x = B([]);
    let $ = 0, T;
    const D = /* @__PURE__ */ new Set();
    Ue(v, (y) => {
      x.value = T ?? y.map((U, P) => x.value[P] ?? $++), T = void 0;
    }, { immediate: !0 });
    function z(y) {
      l("update:modelValue", y);
    }
    function le(y, U) {
      const P = [...v.value];
      P[y] = U, z(P);
    }
    function Z(y, U) {
      U ? D.delete(y) : D.add(y), l("validity", !D.size);
    }
    function ue(y) {
      D.delete(x.value[y]), l("validity", !D.size), T = x.value.filter((U, P) => P !== y), z(v.value.filter((U, P) => P !== y));
    }
    function me() {
      T = [...x.value, $++], z([...v.value, t.field.form === "bool" ? !1 : t.field.form === "record" ? {} : ""]);
    }
    function ge(y) {
      const U = y.detail, P = U?.principal_id ?? U?.id;
      z(P ? { kind: U.type ?? "user", id: P } : void 0);
    }
    function be(y) {
      const U = y.detail;
      z(U?.thread_id ? { ref: ["component", U.thread_id] } : void 0);
    }
    const se = B("");
    let R = "";
    Ue(() => t.modelValue, (y) => {
      const U = JSON.stringify(y ?? {}, null, 2);
      U !== R && (R = U, se.value = U, g.value = "", l("validity", !0));
    }, { immediate: !0 });
    function _(y) {
      se.value = y;
      try {
        const U = JSON.parse(y);
        if (!U || typeof U != "object" || Array.isArray(U)) throw new Error("Enter a JSON object.");
        if (t.field.type === "rich_text" && !("type" in U && typeof U.type == "string")) throw new Error("The document needs a type.");
        R = JSON.stringify(U, null, 2), g.value = "", l("validity", !0), z(U);
      } catch (U) {
        g.value = U instanceof Error ? U.message : "Invalid JSON.", l("validity", !1);
      }
    }
    function L(y) {
      if (!y) {
        l("validity", !0), z(void 0);
        return;
      }
      const U = Number.isFinite(Number(y)) && (t.field.form !== "int" || Number.isSafeInteger(Number(y)));
      l("validity", U), U && z(t.field.form === "int" ? Number(y) : y);
    }
    const ie = F(() => t.field.config?.format === "date");
    function xe(y) {
      z(y ? ie.value ? y : new Date(y).toISOString() : void 0);
    }
    const Oe = F(() => {
      if (typeof t.modelValue != "string") return "";
      if (ie.value) return t.modelValue.slice(0, 10);
      const y = new Date(t.modelValue);
      return Number.isNaN(y.getTime()) ? "" : new Date(y.getTime() - y.getTimezoneOffset() * 6e4).toISOString().slice(0, 16);
    });
    function H(y) {
      z(y.detail?.ref);
    }
    function j(y) {
      z(y.detail?.value);
    }
    let M;
    Ue(h, () => {
      const y = w();
      if (clearTimeout(M), !h.value.trim()) {
        p.value = [];
        return;
      }
      M = setTimeout(async () => {
        try {
          const U = h.value.trim(), P = /^[A-Z][A-Z0-9]{1,9}-[0-9]+$/.test(U) ? [(await Nt.item(t.boardId, { key: U })).item] : (await Nt.query(t.boardId, { where: { field: "title", op: "contains", value: U }, limit: 8 })).items;
          y() && (p.value = P, g.value = "");
        } catch (U) {
          y() && (g.value = mt(U, "Could not search items."));
        }
      }, 200);
    });
    function ce(y) {
      z({ board: t.boardId, item: y.id }), h.value = "", p.value = [];
    }
    Ea(async () => {
      t.field.type === "principal" ? u.value = await Ft("wc-principal-picker") : t.field.config?.target === "component" && (u.value = await Ft("wc-component-picker"));
    });
    for (const [y, U] of [[() => t.editorTag, V], [() => t.linkTag, d]])
      Ue(y, async (P, A, G) => {
        let re = !0;
        if (G(() => {
          re = !1;
        }), U.value = !1, P) {
          const te = await Ft(P);
          re && (U.value = te);
        }
      }, { immediate: !0 });
    return Kl(() => {
      clearTimeout(M), w();
    }), (y, U) => {
      const P = Po("FieldControl", !0);
      return n(), f("div", zn, [
        c(co)(e.field) ? (n(), f("output", {
          key: 0,
          id: o.value,
          class: "work-read-value"
        }, S(c(Xt)(e.modelValue, e.field)), 9, jn)) : r.value ? (n(), f("div", qn, [
          s("div", Wn, [
            (n(!0), f(ee, null, fe(v.value, (A, G) => (n(), K(c(et), {
              key: x.value[G],
              class: "kx-tag-sm",
              severity: "secondary"
            }, {
              default: q(() => [
                W(S(c(Xt)(A, e.field)) + " ", 1),
                k(c(ae), {
                  type: "button",
                  class: "work-icon-button",
                  disabled: i.value,
                  "aria-label": "Remove value " + (G + 1),
                  onClick: (re) => ue(G),
                  severity: "secondary",
                  text: "",
                  size: "small"
                }, {
                  default: q(() => [
                    k(c(pe), {
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
          (n(!0), f(ee, null, fe(v.value, (A, G) => (n(), f("div", {
            key: x.value[G],
            class: "work-stack work-tight"
          }, [
            k(P, {
              "board-id": e.boardId,
              field: { ...e.field, cardinality: "one" },
              "model-value": A,
              "input-id": o.value + "-" + x.value[G],
              disabled: i.value,
              "editor-tag": e.editorTag,
              "link-tag": e.linkTag,
              "onUpdate:modelValue": (re) => le(G, re),
              onValidity: (re) => Z(x.value[G], re)
            }, null, 8, ["board-id", "field", "model-value", "input-id", "disabled", "editor-tag", "link-tag", "onUpdate:modelValue", "onValidity"])
          ]))), 128)),
          k(c(ae), {
            label: "Add value",
            severity: "secondary",
            size: "small",
            disabled: i.value,
            onClick: me,
            outlined: ""
          }, {
            icon: q(() => [
              k(c(pe), {
                icon: "tabler:plus",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled"])
        ])) : e.editorTag && V.value ? (n(), K(Ia(e.editorTag), {
          key: 2,
          "board-id": e.boardId,
          value: JSON.stringify(e.modelValue ?? null),
          config: JSON.stringify(e.field.config ?? {}),
          readonly: i.value || void 0,
          onChange: j
        }, null, 40, ["board-id", "value", "config", "readonly"])) : e.linkTag && d.value ? (n(), K(Ia(e.linkTag), {
          key: 3,
          "board-id": e.boardId,
          kind: e.field.config?.target ?? e.field.type,
          value: JSON.stringify(e.modelValue ?? null),
          readonly: i.value || void 0,
          onChange: H
        }, null, 40, ["board-id", "kind", "value", "readonly"])) : e.field.type === "option" ? (n(), K(c(he), {
          key: 4,
          placeholder: "Not set",
          inputId: o.value,
          "model-value": e.modelValue ?? "",
          disabled: i.value,
          "onUpdate:modelValue": U[0] || (U[0] = (A) => z(A || void 0)),
          appendTo: "self",
          optionLabel: "label",
          optionValue: "value",
          optionDisabled: "disabled",
          options: [{ label: "Not set", value: "", disabled: !1 }, ...(e.field.options ?? []).map((A) => ({ label: A.label ?? A.id, value: A.id, disabled: !1 }))]
        }, null, 8, ["inputId", "model-value", "disabled", "options"])) : e.field.form === "bool" ? (n(), f("label", Gn, [
          k(c(Lt), {
            inputId: o.value,
            "model-value": e.modelValue === !0,
            disabled: i.value,
            "onUpdate:modelValue": U[1] || (U[1] = (A) => z(A)),
            binary: ""
          }, null, 8, ["inputId", "model-value", "disabled"]),
          W(S(e.modelValue === !0 ? "Yes" : e.modelValue === !1 ? "No" : "Not set"), 1)
        ])) : e.field.form === "int" ? (n(), K(c(Dt), {
          key: 6,
          inputId: o.value,
          "model-value": m.value === "" ? null : Number(m.value),
          disabled: i.value,
          "onUpdate:modelValue": U[2] || (U[2] = (A) => L(A == null ? "" : String(A))),
          useGrouping: !1
        }, null, 8, ["inputId", "model-value", "disabled"])) : e.field.form === "dec" ? (n(), K(c(Re), {
          key: 7,
          id: o.value,
          inputmode: "decimal",
          "model-value": m.value,
          disabled: i.value,
          "onUpdate:modelValue": U[3] || (U[3] = (A) => L(A ?? ""))
        }, null, 8, ["id", "model-value", "disabled"])) : e.field.form === "time" ? (n(), K(c(Re), {
          key: 8,
          id: o.value,
          type: ie.value ? "date" : "datetime-local",
          value: Oe.value,
          disabled: i.value,
          onInput: U[4] || (U[4] = (A) => xe(A.target.value))
        }, null, 8, ["id", "type", "value", "disabled"])) : e.field.type === "principal" ? (n(), f("div", {
          key: 9,
          inert: i.value || void 0,
          class: "work-stack work-tight"
        }, [
          u.value ? (n(), f("wc-principal-picker", {
            key: 0,
            value: JSON.stringify(e.modelValue ?? {}),
            kinds: "user,group",
            onConfigChanged: ge
          }, null, 40, Hn)) : (n(), f("span", Yn, S(c(Xt)(e.modelValue, e.field)) + " · Person picker is unavailable.", 1))
        ], 8, Kn)) : e.field.config?.target === "component" ? (n(), f("div", {
          key: 10,
          inert: i.value || void 0
        }, [
          u.value ? (n(), f("wc-component-picker", {
            key: 0,
            value: JSON.stringify({ thread_id: b.value }),
            onChange: be
          }, null, 40, Jn)) : (n(), f("span", Zn, "Component picker is unavailable."))
        ], 8, Xn)) : e.field.type === "item" ? (n(), f("div", Qn, [
          k(c(et), {
            class: "kx-tag-sm",
            severity: "secondary"
          }, {
            default: q(() => [
              W(S(c(Xt)(e.modelValue, e.field)), 1)
            ]),
            _: 1
          }),
          k(c(Re), {
            id: o.value,
            modelValue: h.value,
            "onUpdate:modelValue": U[5] || (U[5] = (A) => h.value = A),
            disabled: i.value,
            placeholder: "Search a title or enter an item key",
            "aria-label": "Search items"
          }, null, 8, ["id", "modelValue", "disabled"]),
          s("div", _n, [
            (n(!0), f(ee, null, fe(p.value, (A) => (n(), K(Yl, {
              key: A.id,
              class: "work-match-item",
              disabled: i.value,
              onActivate: (G) => ce(A)
            }, {
              default: q(() => [
                s("code", es, S(A.key), 1),
                s("span", null, S(c(Xt)(A.values.title)), 1)
              ]),
              _: 2
            }, 1032, ["disabled", "onActivate"]))), 128))
          ]),
          e.modelValue ? (n(), K(c(ae), {
            key: 0,
            label: "Clear reference",
            severity: "secondary",
            size: "small",
            disabled: i.value,
            onClick: U[6] || (U[6] = (A) => z(void 0)),
            outlined: ""
          }, {
            icon: q(() => [
              k(c(pe), {
                icon: "tabler:list-check",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled"])) : C("", !0)
        ])) : e.field.form === "record" || e.field.type === "rich_text" || e.field.form === "quantity" || e.field.form === "ref" ? (n(), K(c(Aa), {
          key: 12,
          id: o.value,
          "model-value": se.value,
          rows: "3",
          disabled: i.value,
          "aria-invalid": !!g.value,
          "onUpdate:modelValue": U[7] || (U[7] = (A) => _(A ?? ""))
        }, null, 8, ["id", "model-value", "disabled", "aria-invalid"])) : e.field.code === "description" ? (n(), K(c(Aa), {
          key: 13,
          id: o.value,
          "model-value": m.value,
          rows: "4",
          disabled: i.value,
          "onUpdate:modelValue": U[8] || (U[8] = (A) => z(A))
        }, null, 8, ["id", "model-value", "disabled"])) : (n(), K(c(Re), {
          key: 14,
          id: o.value,
          "model-value": m.value,
          disabled: i.value,
          "onUpdate:modelValue": U[9] || (U[9] = (A) => z(A))
        }, null, 8, ["id", "model-value", "disabled"])),
        g.value ? (n(), f("span", ts, S(g.value), 1)) : C("", !0)
      ]);
    };
  }
}), as = { class: "work-stack work-tight work-operand-control" }, ls = { class: "work-row work-small" }, os = {
  key: 1,
  class: "work-muted work-small"
}, is = {
  key: 2,
  class: "work-stack work-tight"
}, ns = { class: "work-small" }, ss = {
  key: 0,
  class: "work-error work-small",
  role: "alert"
}, ha = /* @__PURE__ */ Se({
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
    const t = e, l = a, o = F(() => "$actor" in ct(t.modelValue) ? "actor" : "$now" in ct(t.modelValue) ? "now" : "literal"), r = B(""), v = B("");
    Ue(() => t.modelValue, (i) => {
      r.value = JSON.stringify(i ?? []), v.value = "";
    }, { immediate: !0 });
    function m(i) {
      l("update:modelValue", i === "actor" ? { $actor: "id" } : i === "now" ? { $now: "P0D" } : void 0), l("validity", !0);
    }
    function b(i) {
      r.value = i;
      try {
        const u = JSON.parse(i);
        if (!Array.isArray(u)) throw new Error("Enter a JSON list.");
        v.value = "", l("validity", !0), l("update:modelValue", u);
      } catch (u) {
        v.value = u instanceof Error ? u.message : "Invalid values.", l("validity", !1);
      }
    }
    return (i, u) => (n(), f("div", as, [
      s("label", ls, [
        W(S(e.label), 1),
        k(c(he), {
          "aria-label": e.label + " operand",
          "model-value": o.value,
          disabled: e.disabled,
          "onUpdate:modelValue": u[0] || (u[0] = (d) => m(d)),
          appendTo: "self",
          optionLabel: "label",
          optionValue: "value",
          optionDisabled: "disabled",
          options: [{ label: "Value", value: "literal", disabled: !1 }, { label: "Current actor ($actor)", value: "actor", disabled: !1 }, { label: "Current time ($now)", value: "now", disabled: !1 }]
        }, null, 8, ["aria-label", "model-value", "disabled"])
      ]),
      o.value === "now" ? (n(), K(c(Re), {
        key: 0,
        "aria-label": e.label + " time offset",
        value: c(ct)(e.modelValue).$now,
        disabled: e.disabled,
        placeholder: "-P7D",
        onInput: u[1] || (u[1] = (d) => l("update:modelValue", { $now: d.target.value }))
      }, null, 8, ["aria-label", "value", "disabled"])) : o.value === "actor" ? (n(), f("span", os, "The signed-in actor’s id")) : e.multiple ? (n(), f("div", is, [
        s("label", ns, [
          u[5] || (u[5] = W("Values as JSON (operands may appear in the list)", -1)),
          k(c(Aa), {
            class: "work-mono",
            "aria-label": e.label + " values",
            value: r.value,
            disabled: e.disabled,
            rows: "2",
            onInput: u[2] || (u[2] = (d) => b(d.target.value))
          }, null, 8, ["aria-label", "value", "disabled"])
        ]),
        v.value ? (n(), f("p", ss, S(v.value), 1)) : C("", !0)
      ])) : (n(), K(Ho, {
        key: 3,
        "board-id": e.boardId,
        field: { ...e.field, cardinality: "one" },
        "model-value": e.modelValue,
        disabled: e.disabled,
        "input-id": e.label.replace(/[^a-z0-9]/gi, "-"),
        "onUpdate:modelValue": u[3] || (u[3] = (d) => l("update:modelValue", d)),
        onValidity: u[4] || (u[4] = (d) => l("validity", d))
      }, null, 8, ["board-id", "field", "model-value", "disabled", "input-id"]))
    ]));
  }
}), rs = ["disabled"], ds = { class: "work-small work-mono" }, us = { class: "work-row work-small" }, cs = { class: "work-row work-wrap" }, vs = { key: 3 }, fs = { class: "work-row work-wrap" }, ms = { class: "work-row" }, ps = { class: "work-row" }, gs = { class: "work-row" }, hs = {
  key: 3,
  class: "work-row work-wrap"
}, bs = { class: "work-row work-wrap" }, ys = /* @__PURE__ */ Se({
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
    const t = e, l = a, o = F(() => t.path ?? "where"), r = F(() => t.depth ?? 1), v = F(() => ["and", "or", "not", "history", "match", "rel", "children"].find((se) => se in t.modelValue) ?? "field"), m = F(() => Ln(t.schema)), b = F(() => m.value.find((se) => se.code === t.modelValue.field) ?? { code: "value", form: "text" }), i = F(() => ct(t.modelValue.history)), u = F(() => m.value.find((se) => se.code === i.value.field) ?? { code: "history", form: "text" }), d = F(() => Array.isArray(t.modelValue[v.value]) ? t.modelValue[v.value] : []), V = {
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
    }, h = () => ({ field: "category", op: "eq", value: "unstarted" }), p = B(/* @__PURE__ */ new Set());
    function w(se, R) {
      R ? p.value.delete(se) : p.value.add(se), l("validity", p.value.size === 0);
    }
    Ue(v, () => {
      p.value.clear(), l("validity", !0);
    });
    function x(se) {
      const R = /* @__PURE__ */ new Set();
      for (const _ of p.value) {
        const L = Number(_);
        !Number.isNaN(L) && L !== se && R.add(String(L > se ? L - 1 : L));
      }
      p.value = R, l("validity", R.size === 0), T({ [v.value]: d.value.filter((_, L) => L !== se) });
    }
    function $(se) {
      l("update:modelValue", se);
    }
    function T(se) {
      $({ ...t.modelValue, ...se });
    }
    function D(se) {
      $(se === "field" ? h() : se === "and" || se === "or" ? { [se]: [h()] } : se === "not" ? { not: h() } : se === "history" ? { history: { field: "state", changed: !0 } } : se === "match" ? { match: "" } : se === "children" ? { children: !0, q: "some", where: h() } : { rel: t.schema.compiled.relation_types?.[0]?.id ?? "", dir: "outward", q: "some", where: h() });
    }
    function z(se, R) {
      T({ [v.value]: d.value.map((_, L) => L === se ? R : _) });
    }
    function le(se, R) {
      const _ = { ...i.value };
      R === void 0 ? (delete _[se], w(se, !0)) : _[se] = R, T({ history: _ });
    }
    function Z(se) {
      p.value.clear(), l("validity", !0);
      const R = { ...i.value };
      delete R.was, delete R.changed, delete R.from, delete R.to, R[se] = se === "changed" ? !0 : "", T({ history: R });
    }
    const ue = { code: "actor", form: "text" }, me = { code: "at", form: "time" }, ge = F(() => Array.isArray(i.value.during) ? i.value.during : []);
    function be(se, R) {
      const _ = [...ge.value];
      _[se] = R, le("during", _);
    }
    return (se, R) => {
      const _ = Po("FilterNode", !0);
      return n(), f("fieldset", {
        class: "work-filter-node",
        disabled: e.disabled
      }, [
        s("legend", ds, S(o.value), 1),
        s("label", us, [
          R[21] || (R[21] = W("Condition", -1)),
          k(c(he), {
            "aria-label": o.value + " condition",
            "model-value": v.value,
            "onUpdate:modelValue": R[0] || (R[0] = (L) => D(L)),
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            optionDisabled: "disabled",
            options: Object.entries(g).map(([L, ie]) => ({ label: ie, value: L, disabled: r.value >= 6 && ["and", "or", "not", "rel", "children"].includes(L) }))
          }, null, 8, ["aria-label", "model-value", "options"])
        ]),
        v.value === "and" || v.value === "or" ? (n(), f(ee, { key: 0 }, [
          (n(!0), f(ee, null, fe(d.value, (L, ie) => (n(), f("div", {
            key: ie,
            class: "work-stack work-tight"
          }, [
            k(_, {
              "board-id": e.boardId,
              schema: e.schema,
              "model-value": L,
              path: o.value + "." + v.value + "[" + ie + "]",
              depth: r.value + 1,
              "onUpdate:modelValue": (xe) => z(ie, xe),
              onValidity: (xe) => w(String(ie), xe)
            }, null, 8, ["board-id", "schema", "model-value", "path", "depth", "onUpdate:modelValue", "onValidity"]),
            k(c(ae), {
              label: "Remove condition",
              size: "small",
              severity: "secondary",
              onClick: (xe) => x(ie),
              outlined: ""
            }, {
              icon: q(() => [
                k(c(pe), {
                  icon: "tabler:trash",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["onClick"])
          ]))), 128)),
          k(c(ae), {
            label: "Add condition",
            size: "small",
            severity: "secondary",
            disabled: r.value >= 6,
            onClick: R[1] || (R[1] = (L) => T({ [v.value]: [...d.value, h()] })),
            outlined: ""
          }, {
            icon: q(() => [
              k(c(pe), {
                icon: "tabler:plus",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled"])
        ], 64)) : v.value === "not" ? (n(), K(_, {
          key: 1,
          "board-id": e.boardId,
          schema: e.schema,
          "model-value": c(ct)(e.modelValue.not),
          path: o.value + ".not",
          depth: r.value + 1,
          "onUpdate:modelValue": R[2] || (R[2] = (L) => T({ not: L })),
          onValidity: R[3] || (R[3] = (L) => w("nested", L))
        }, null, 8, ["board-id", "schema", "model-value", "path", "depth"])) : v.value === "field" ? (n(), f(ee, { key: 2 }, [
          s("div", cs, [
            s("label", null, [
              R[22] || (R[22] = W("Field", -1)),
              k(c(he), {
                "aria-label": o.value + " field",
                "model-value": e.modelValue.field,
                "onUpdate:modelValue": R[4] || (R[4] = (L) => T({ field: L, op: "eq", value: void 0 })),
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                optionDisabled: "disabled",
                options: [...(m.value ?? []).map((L) => ({ label: c(Ze)(L), value: L.code, disabled: !1 }))]
              }, null, 8, ["aria-label", "model-value", "options"])
            ]),
            s("label", null, [
              R[23] || (R[23] = W("Comparison", -1)),
              k(c(he), {
                "aria-label": o.value + " operator",
                "model-value": e.modelValue.op,
                "onUpdate:modelValue": R[5] || (R[5] = (L) => T({ op: L, value: L === "is_null" ? !0 : void 0 })),
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                options: c(Bn)(b.value).map((L) => ({ value: L, label: V[L] }))
              }, null, 8, ["aria-label", "model-value", "options"])
            ])
          ]),
          k(ha, {
            "board-id": e.boardId,
            field: e.modelValue.op === "is_null" ? { code: "null", form: "bool" } : b.value,
            "model-value": e.modelValue.value,
            multiple: ["in", "nin", "between"].includes(String(e.modelValue.op)),
            label: o.value + " value",
            "onUpdate:modelValue": R[6] || (R[6] = (L) => T({ value: L })),
            onValidity: R[7] || (R[7] = (L) => w("value", L))
          }, null, 8, ["board-id", "field", "model-value", "multiple", "label"])
        ], 64)) : v.value === "match" ? (n(), f("label", vs, [
          R[24] || (R[24] = W("Search", -1)),
          k(c(Re), {
            "aria-label": o.value + " search",
            value: e.modelValue.match,
            onInput: R[8] || (R[8] = (L) => T({ match: L.target.value }))
          }, null, 8, ["aria-label", "value"])
        ])) : v.value === "history" ? (n(), f(ee, { key: 4 }, [
          s("div", fs, [
            s("label", null, [
              R[25] || (R[25] = W("Field", -1)),
              k(c(he), {
                "aria-label": o.value + " history field",
                "model-value": i.value.field,
                "onUpdate:modelValue": R[9] || (R[9] = (L) => le("field", L)),
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                optionDisabled: "disabled",
                options: [...(m.value ?? []).map((L) => ({ label: c(Ze)(L), value: L.code, disabled: !1 }))]
              }, null, 8, ["aria-label", "model-value", "options"])
            ]),
            s("label", null, [
              R[26] || (R[26] = W("History", -1)),
              k(c(he), {
                "aria-label": o.value + " history mode",
                "model-value": i.value.changed ? "changed" : "was",
                "onUpdate:modelValue": R[10] || (R[10] = (L) => Z(L)),
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                optionDisabled: "disabled",
                options: [{ label: "Changed", value: "changed", disabled: !1 }, { label: "Was", value: "was", disabled: !1 }]
              }, null, 8, ["aria-label", "model-value"])
            ])
          ]),
          i.value.changed ? (n(), f(ee, { key: 0 }, fe(["from", "to"], (L) => s("div", { key: L }, [
            s("label", ms, [
              k(c(Lt), {
                "model-value": L in i.value,
                "aria-label": "Constrain " + L,
                "onUpdate:modelValue": (ie) => le(L, ie ? "" : void 0),
                binary: ""
              }, null, 8, ["model-value", "aria-label", "onUpdate:modelValue"]),
              W(S(L), 1)
            ]),
            L in i.value ? (n(), K(ha, {
              key: 0,
              "board-id": e.boardId,
              field: u.value,
              "model-value": i.value[L],
              label: o.value + " history " + L,
              "onUpdate:modelValue": (ie) => le(L, ie),
              onValidity: (ie) => w(L, ie)
            }, null, 8, ["board-id", "field", "model-value", "label", "onUpdate:modelValue", "onValidity"])) : C("", !0)
          ])), 64)) : (n(), K(ha, {
            key: 1,
            "board-id": e.boardId,
            field: u.value,
            "model-value": i.value.was,
            label: o.value + " history was",
            "onUpdate:modelValue": R[11] || (R[11] = (L) => le("was", L)),
            onValidity: R[12] || (R[12] = (L) => w("was", L))
          }, null, 8, ["board-id", "field", "model-value", "label"])),
          s("label", ps, [
            k(c(Lt), {
              "model-value": "by" in i.value,
              "aria-label": "Constrain actor",
              "onUpdate:modelValue": R[13] || (R[13] = (L) => le("by", L ? { $actor: "id" } : void 0)),
              binary: ""
            }, null, 8, ["model-value"]),
            R[27] || (R[27] = W("By actor", -1))
          ]),
          "by" in i.value ? (n(), K(ha, {
            key: 2,
            "board-id": e.boardId,
            field: ue,
            "model-value": i.value.by,
            label: o.value + " history by",
            "onUpdate:modelValue": R[14] || (R[14] = (L) => le("by", L))
          }, null, 8, ["board-id", "model-value", "label"])) : C("", !0),
          s("label", gs, [
            k(c(Lt), {
              "model-value": "during" in i.value,
              "aria-label": "Constrain time window",
              "onUpdate:modelValue": R[15] || (R[15] = (L) => le("during", L ? [{ $now: "-P30D" }, { $now: "P0D" }] : void 0)),
              binary: ""
            }, null, 8, ["model-value"]),
            R[28] || (R[28] = W("During", -1))
          ]),
          "during" in i.value ? (n(), f("div", hs, [
            (n(), f(ee, null, fe(["start", "end"], (L, ie) => k(ha, {
              key: L,
              "board-id": e.boardId,
              field: me,
              "model-value": ge.value[ie],
              label: o.value + " during " + L,
              "onUpdate:modelValue": (xe) => be(ie, xe)
            }, null, 8, ["board-id", "model-value", "label", "onUpdate:modelValue"])), 64))
          ])) : C("", !0)
        ], 64)) : (n(), f(ee, { key: 5 }, [
          s("div", bs, [
            v.value === "rel" ? (n(), f(ee, { key: 0 }, [
              s("label", null, [
                R[29] || (R[29] = W("Relation", -1)),
                k(c(he), {
                  "model-value": e.modelValue.rel,
                  "onUpdate:modelValue": R[16] || (R[16] = (L) => T({ rel: L })),
                  appendTo: "self",
                  optionLabel: "label",
                  optionValue: "value",
                  optionDisabled: "disabled",
                  options: [...(e.schema.compiled.relation_types ?? []).map((L) => ({ label: L.outward ?? L.id, value: L.id, disabled: !1 }))]
                }, null, 8, ["model-value", "options"])
              ]),
              s("label", null, [
                R[30] || (R[30] = W("Direction", -1)),
                k(c(he), {
                  "model-value": e.modelValue.dir,
                  "onUpdate:modelValue": R[17] || (R[17] = (L) => T({ dir: L })),
                  appendTo: "self",
                  optionLabel: "label",
                  optionValue: "value",
                  optionDisabled: "disabled",
                  options: [{ label: "Outward", value: "outward", disabled: !1 }, { label: "Inward", value: "inward", disabled: !1 }]
                }, null, 8, ["model-value"])
              ])
            ], 64)) : C("", !0),
            s("label", null, [
              R[31] || (R[31] = W("Quantifier", -1)),
              k(c(he), {
                "model-value": e.modelValue.q,
                "onUpdate:modelValue": R[18] || (R[18] = (L) => T({ q: L })),
                appendTo: "self",
                options: ["some", "every", "none"]
              }, null, 8, ["model-value"])
            ])
          ]),
          k(_, {
            "board-id": e.boardId,
            schema: e.schema,
            "model-value": c(ct)(e.modelValue.where),
            path: o.value + ".where",
            depth: r.value + 1,
            "onUpdate:modelValue": R[19] || (R[19] = (L) => T({ where: L })),
            onValidity: R[20] || (R[20] = (L) => w("nested", L))
          }, null, 8, ["board-id", "schema", "model-value", "path", "depth"])
        ], 64))
      ], 8, rs);
    };
  }
}), ks = { class: "work-stack work-tight" }, ws = { class: "work-row work-small" }, Zl = /* @__PURE__ */ Se({
  __name: "ConditionEditor",
  props: {
    modelValue: {},
    draft: {},
    boardId: {},
    label: {}
  },
  emits: ["update:modelValue", "validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = F(() => ({ declaration: t.draft, compiled: t.draft, generation: 0, as_of: 0, key_prefix: "" })), r = /* @__PURE__ */ new Set();
    function v(b, i) {
      i ? r.delete(b) : r.add(b), l("validity", !r.size);
    }
    function m(b) {
      l("update:modelValue", b ? { field: t.draft.fields?.[0]?.code ?? "state", op: "eq" } : void 0), b || (r.clear(), l("validity", !0));
    }
    return Et(() => l("validity", !0)), (b, i) => (n(), f("section", ks, [
      s("label", ws, [
        k(c(st), {
          "model-value": e.modelValue != null,
          "aria-label": e.label,
          "onUpdate:modelValue": m
        }, null, 8, ["model-value", "aria-label"]),
        W(S(e.label), 1)
      ]),
      e.modelValue != null ? (n(), K(ys, {
        key: 0,
        schema: o.value,
        "board-id": e.boardId ?? "",
        "model-value": c(ct)(e.modelValue),
        path: e.label,
        "onUpdate:modelValue": i[0] || (i[0] = (u) => l("update:modelValue", u)),
        onValidity: i[1] || (i[1] = (u) => v("structured", u))
      }, null, 8, ["schema", "board-id", "model-value", "path"])) : C("", !0),
      e.modelValue != null ? (n(), K(Bt, {
        key: 1,
        label: e.label + " predicate",
        "model-value": e.modelValue,
        hint: "Use any predicate accepted by Work, including installed or deeply nested forms.",
        "onUpdate:modelValue": i[2] || (i[2] = (u) => l("update:modelValue", u)),
        onValidity: i[3] || (i[3] = (u) => v("raw", u))
      }, null, 8, ["label", "model-value"])) : C("", !0)
    ]));
  }
}), $s = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, Vs = ["aria-label"], xs = { class: "work-field-label" }, Cs = {
  key: 0,
  class: "work-chips"
}, Ss = ["kinds"], Ts = {
  key: 2,
  class: "work-muted work-small"
}, Ql = /* @__PURE__ */ Se({
  __name: "PrincipalsPicker",
  props: {
    modelValue: {},
    label: {},
    kinds: {},
    boardId: {}
  },
  emits: ["update:modelValue"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = B(!1), r = B(0), v = F(() => t.modelValue ?? []), { principalLabel: m, rememberPrincipal: b, nameError: i } = Fo(() => t.boardId ?? "", () => v.value);
    Ea(async () => {
      o.value = await Ft("wc-principal-picker");
    });
    function u(d) {
      const V = d.detail, g = V?.principal_id ?? V?.id;
      if (!g) return;
      const h = { kind: V.type ?? "user", id: g };
      V.label && b(h, V.label), v.value.some((p) => p.id === g && p.kind === h.kind) || l("update:modelValue", [...v.value, h]), r.value++;
    }
    return (d, V) => (n(), f(ee, null, [
      c(i) ? (n(), f("p", $s, S(c(i)), 1)) : C("", !0),
      s("section", {
        class: "work-stack work-tight work-principals-picker",
        "aria-label": e.label
      }, [
        s("h4", xs, S(e.label), 1),
        v.value.length ? (n(), f("div", Cs, [
          (n(!0), f(ee, null, fe(v.value, (g, h) => (n(), K(c(et), {
            key: g.kind + g.id,
            severity: "secondary",
            class: "kx-tag-sm"
          }, {
            default: q(() => [
              W(S(c(m)(g)), 1),
              k(c(ae), {
                text: "",
                severity: "secondary",
                size: "small",
                "aria-label": "Remove " + c(m)(g),
                onClick: (p) => l("update:modelValue", v.value.filter((w, x) => x !== h))
              }, {
                default: q(() => [
                  k(c(pe), { icon: "tabler:x" })
                ]),
                _: 1
              }, 8, ["aria-label", "onClick"])
            ]),
            _: 2
          }, 1024))), 128))
        ])) : C("", !0),
        o.value ? (n(), f("wc-principal-picker", {
          key: r.value,
          kinds: e.kinds ?? "user,group",
          onConfigChanged: u
        }, null, 40, Ss)) : (n(), f("p", Ts, "People and group picker is unavailable."))
      ], 8, Vs)
    ], 64));
  }
}), Is = { class: "work-stack work-tight" }, Yo = /* @__PURE__ */ Se({
  __name: "HoldersPicker",
  props: {
    modelValue: {},
    label: {},
    boardId: {}
  },
  emits: ["update:modelValue", "validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = F(() => (t.modelValue ?? []).flatMap((v) => "user" in v ? [{ kind: "user", id: v.user }] : "group" in v ? [{ kind: "group", id: v.group }] : []));
    function r(v) {
      const m = [...(t.modelValue ?? []).filter((b) => "field" in b || "service" in b), ...v.map((b) => b.kind === "group" ? { group: b.id } : { user: b.id })];
      l("update:modelValue", m.length ? m : void 0);
    }
    return (v, m) => (n(), f("div", Is, [
      k(Ql, {
        "board-id": e.boardId,
        label: e.label,
        "model-value": o.value,
        "onUpdate:modelValue": r
      }, null, 8, ["board-id", "label", "model-value"]),
      k(Bt, {
        label: e.label + " rules",
        "model-value": e.modelValue,
        shape: "array",
        example: [{ group: "selected-group" }],
        "onUpdate:modelValue": m[0] || (m[0] = (b) => l("update:modelValue", b)),
        onValidity: m[1] || (m[1] = (b) => l("validity", b))
      }, null, 8, ["label", "model-value"])
    ]));
  }
}), Ds = ["disabled"], Us = { class: "work-chips" }, As = {
  key: 1,
  class: "work-muted work-small"
}, gt = /* @__PURE__ */ Se({
  __name: "ChipPicker",
  props: {
    label: {},
    options: {},
    modelValue: {},
    disabled: { type: Boolean }
  },
  emits: ["update:modelValue"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = B(""), r = F(() => t.options.map((b) => typeof b == "string" ? { value: b } : b)), v = F(() => r.value.filter((b) => (b.label ?? Me(b.value)).toLocaleLowerCase().includes(o.value.toLocaleLowerCase())));
    function m(b) {
      if (t.disabled) return;
      const i = t.modelValue ?? [];
      l("update:modelValue", i.includes(b) ? i.filter((u) => u !== b) : [...i, b]);
    }
    return (b, i) => (n(), f("fieldset", {
      class: "work-chip-picker",
      disabled: e.disabled
    }, [
      s("legend", null, S(e.label), 1),
      e.options.length > 10 ? (n(), K(c(Re), {
        key: 0,
        modelValue: o.value,
        "onUpdate:modelValue": i[0] || (i[0] = (u) => o.value = u),
        type: "search",
        "aria-label": "Find " + e.label.toLowerCase(),
        placeholder: "Find a choice…"
      }, null, 8, ["modelValue", "aria-label"])) : C("", !0),
      s("div", Us, [
        k(c(Hl), {
          "model-value": e.modelValue ?? [],
          options: v.value.map((u) => ({ value: u.value, label: u.label ?? c(Me)(u.value) })),
          optionLabel: "label",
          optionValue: "value",
          multiple: "",
          disabled: e.disabled,
          "aria-label": e.label,
          "onUpdate:modelValue": i[1] || (i[1] = (u) => l("update:modelValue", u ?? []))
        }, null, 8, ["model-value", "options", "disabled", "aria-label"]),
        (n(!0), f(ee, null, fe(e.modelValue?.filter((u) => !r.value.some((d) => d.value === u)) ?? [], (u) => (n(), K(c(ae), {
          severity: "secondary",
          text: "",
          size: "small",
          key: u,
          type: "button",
          class: "work-choice work-unavailable",
          "aria-label": "Remove unavailable " + u,
          onClick: (d) => m(u)
        }, {
          default: q(() => [
            W(S(c(Me)(u)) + " · unavailable ×", 1)
          ]),
          _: 2
        }, 1032, ["aria-label", "onClick"]))), 128))
      ]),
      e.options.length ? C("", !0) : (n(), f("span", As, "No choices declared."))
    ], 8, Ds));
  }
});
/**!
 * Sortable 1.15.7
 * @author	RubaXa   <trash@rubaxa.org>
 * @author	owenm    <owen23355@gmail.com>
 * @license MIT
 */
function Es(e, a, t) {
  return (a = Ns(a)) in e ? Object.defineProperty(e, a, {
    value: t,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : e[a] = t, e;
}
function At() {
  return At = Object.assign ? Object.assign.bind() : function(e) {
    for (var a = 1; a < arguments.length; a++) {
      var t = arguments[a];
      for (var l in t) ({}).hasOwnProperty.call(t, l) && (e[l] = t[l]);
    }
    return e;
  }, At.apply(null, arguments);
}
function go(e, a) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(e);
    a && (l = l.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), t.push.apply(t, l);
  }
  return t;
}
function Ct(e) {
  for (var a = 1; a < arguments.length; a++) {
    var t = arguments[a] != null ? arguments[a] : {};
    a % 2 ? go(Object(t), !0).forEach(function(l) {
      Es(e, l, t[l]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : go(Object(t)).forEach(function(l) {
      Object.defineProperty(e, l, Object.getOwnPropertyDescriptor(t, l));
    });
  }
  return e;
}
function Rs(e, a) {
  if (e == null) return {};
  var t, l, o = Os(e, a);
  if (Object.getOwnPropertySymbols) {
    var r = Object.getOwnPropertySymbols(e);
    for (l = 0; l < r.length; l++) t = r[l], a.indexOf(t) === -1 && {}.propertyIsEnumerable.call(e, t) && (o[t] = e[t]);
  }
  return o;
}
function Os(e, a) {
  if (e == null) return {};
  var t = {};
  for (var l in e) if ({}.hasOwnProperty.call(e, l)) {
    if (a.indexOf(l) !== -1) continue;
    t[l] = e[l];
  }
  return t;
}
function Ps(e, a) {
  if (typeof e != "object" || !e) return e;
  var t = e[Symbol.toPrimitive];
  if (t !== void 0) {
    var l = t.call(e, a);
    if (typeof l != "object") return l;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (a === "string" ? String : Number)(e);
}
function Ns(e) {
  var a = Ps(e, "string");
  return typeof a == "symbol" ? a : a + "";
}
function Pl(e) {
  "@babel/helpers - typeof";
  return Pl = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(a) {
    return typeof a;
  } : function(a) {
    return a && typeof Symbol == "function" && a.constructor === Symbol && a !== Symbol.prototype ? "symbol" : typeof a;
  }, Pl(e);
}
var Ms = "1.15.7";
function Ut(e) {
  if (typeof window < "u" && window.navigator)
    return !!/* @__PURE__ */ navigator.userAgent.match(e);
}
var Rt = Ut(/(?:Trident.*rv[ :]?11\.|msie|iemobile|Windows Phone)/i), Oa = Ut(/Edge/i), ho = Ut(/firefox/i), Va = Ut(/safari/i) && !Ut(/chrome/i) && !Ut(/android/i), _l = Ut(/iP(ad|od|hone)/i), Xo = Ut(/chrome/i) && Ut(/android/i), Jo = {
  capture: !1,
  passive: !1
};
function Ee(e, a, t) {
  e.addEventListener(a, t, !Rt && Jo);
}
function Ae(e, a, t) {
  e.removeEventListener(a, t, !Rt && Jo);
}
function el(e, a) {
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
function Zo(e) {
  return e.host && e !== document && e.host.nodeType && e.host !== e ? e.host : e.parentNode;
}
function kt(e, a, t, l) {
  if (e) {
    t = t || document;
    do {
      if (a != null && (a[0] === ">" ? e.parentNode === t && el(e, a) : el(e, a)) || l && e === t)
        return e;
      if (e === t) break;
    } while (e = Zo(e));
  }
  return null;
}
var bo = /\s+/g;
function dt(e, a, t) {
  if (e && a)
    if (e.classList)
      e.classList[t ? "add" : "remove"](a);
    else {
      var l = (" " + e.className + " ").replace(bo, " ").replace(" " + a + " ", " ");
      e.className = (l + (t ? " " + a : "")).replace(bo, " ");
    }
}
function we(e, a, t) {
  var l = e && e.style;
  if (l) {
    if (t === void 0)
      return document.defaultView && document.defaultView.getComputedStyle ? t = document.defaultView.getComputedStyle(e, "") : e.currentStyle && (t = e.currentStyle), a === void 0 ? t : t[a];
    !(a in l) && a.indexOf("webkit") === -1 && (a = "-webkit-" + a), l[a] = t + (typeof t == "string" ? "" : "px");
  }
}
function ca(e, a) {
  var t = "";
  if (typeof e == "string")
    t = e;
  else
    do {
      var l = we(e, "transform");
      l && l !== "none" && (t = l + " " + t);
    } while (!a && (e = e.parentNode));
  var o = window.DOMMatrix || window.WebKitCSSMatrix || window.CSSMatrix || window.MSCSSMatrix;
  return o && new o(t);
}
function Qo(e, a, t) {
  if (e) {
    var l = e.getElementsByTagName(a), o = 0, r = l.length;
    if (t)
      for (; o < r; o++)
        t(l[o], o);
    return l;
  }
  return [];
}
function xt() {
  var e = document.scrollingElement;
  return e || document.documentElement;
}
function Ke(e, a, t, l, o) {
  if (!(!e.getBoundingClientRect && e !== window)) {
    var r, v, m, b, i, u, d;
    if (e !== window && e.parentNode && e !== xt() ? (r = e.getBoundingClientRect(), v = r.top, m = r.left, b = r.bottom, i = r.right, u = r.height, d = r.width) : (v = 0, m = 0, b = window.innerHeight, i = window.innerWidth, u = window.innerHeight, d = window.innerWidth), (a || t) && e !== window && (o = o || e.parentNode, !Rt))
      do
        if (o && o.getBoundingClientRect && (we(o, "transform") !== "none" || t && we(o, "position") !== "static")) {
          var V = o.getBoundingClientRect();
          v -= V.top + parseInt(we(o, "border-top-width")), m -= V.left + parseInt(we(o, "border-left-width")), b = v + r.height, i = m + r.width;
          break;
        }
      while (o = o.parentNode);
    if (l && e !== window) {
      var g = ca(o || e), h = g && g.a, p = g && g.d;
      g && (v /= p, m /= h, d /= h, u /= p, b = v + u, i = m + d);
    }
    return {
      top: v,
      left: m,
      bottom: b,
      right: i,
      width: d,
      height: u
    };
  }
}
function yo(e, a, t) {
  for (var l = Mt(e, !0), o = Ke(e)[a]; l; ) {
    var r = Ke(l)[t], v = void 0;
    if (v = o >= r, !v) return l;
    if (l === xt()) break;
    l = Mt(l, !1);
  }
  return !1;
}
function va(e, a, t, l) {
  for (var o = 0, r = 0, v = e.children; r < v.length; ) {
    if (v[r].style.display !== "none" && v[r] !== $e.ghost && (l || v[r] !== $e.dragged) && kt(v[r], t.draggable, e, !1)) {
      if (o === a)
        return v[r];
      o++;
    }
    r++;
  }
  return null;
}
function eo(e, a) {
  for (var t = e.lastElementChild; t && (t === $e.ghost || we(t, "display") === "none" || a && !el(t, a)); )
    t = t.previousElementSibling;
  return t || null;
}
function ft(e, a) {
  var t = 0;
  if (!e || !e.parentNode)
    return -1;
  for (; e = e.previousElementSibling; )
    e.nodeName.toUpperCase() !== "TEMPLATE" && e !== $e.clone && (!a || el(e, a)) && t++;
  return t;
}
function ko(e) {
  var a = 0, t = 0, l = xt();
  if (e)
    do {
      var o = ca(e), r = o.a, v = o.d;
      a += e.scrollLeft * r, t += e.scrollTop * v;
    } while (e !== l && (e = e.parentNode));
  return [a, t];
}
function Fs(e, a) {
  for (var t in e)
    if (e.hasOwnProperty(t)) {
      for (var l in a)
        if (a.hasOwnProperty(l) && a[l] === e[t][l]) return Number(t);
    }
  return -1;
}
function Mt(e, a) {
  if (!e || !e.getBoundingClientRect) return xt();
  var t = e, l = !1;
  do
    if (t.clientWidth < t.scrollWidth || t.clientHeight < t.scrollHeight) {
      var o = we(t);
      if (t.clientWidth < t.scrollWidth && (o.overflowX == "auto" || o.overflowX == "scroll") || t.clientHeight < t.scrollHeight && (o.overflowY == "auto" || o.overflowY == "scroll")) {
        if (!t.getBoundingClientRect || t === document.body) return xt();
        if (l || a) return t;
        l = !0;
      }
    }
  while (t = t.parentNode);
  return xt();
}
function Ls(e, a) {
  if (e && a)
    for (var t in a)
      a.hasOwnProperty(t) && (e[t] = a[t]);
  return e;
}
function yl(e, a) {
  return Math.round(e.top) === Math.round(a.top) && Math.round(e.left) === Math.round(a.left) && Math.round(e.height) === Math.round(a.height) && Math.round(e.width) === Math.round(a.width);
}
var xa;
function _o(e, a) {
  return function() {
    if (!xa) {
      var t = arguments, l = this;
      t.length === 1 ? e.call(l, t[0]) : e.apply(l, t), xa = setTimeout(function() {
        xa = void 0;
      }, a);
    }
  };
}
function Bs() {
  clearTimeout(xa), xa = void 0;
}
function ei(e, a, t) {
  e.scrollLeft += a, e.scrollTop += t;
}
function ti(e) {
  var a = window.Polymer, t = window.jQuery || window.Zepto;
  return a && a.dom ? a.dom(e).cloneNode(!0) : t ? t(e).clone(!0)[0] : e.cloneNode(!0);
}
function ai(e, a, t) {
  var l = {};
  return Array.from(e.children).forEach(function(o) {
    var r, v, m, b;
    if (!(!kt(o, a.draggable, e, !1) || o.animated || o === t)) {
      var i = Ke(o);
      l.left = Math.min((r = l.left) !== null && r !== void 0 ? r : 1 / 0, i.left), l.top = Math.min((v = l.top) !== null && v !== void 0 ? v : 1 / 0, i.top), l.right = Math.max((m = l.right) !== null && m !== void 0 ? m : -1 / 0, i.right), l.bottom = Math.max((b = l.bottom) !== null && b !== void 0 ? b : -1 / 0, i.bottom);
    }
  }), l.width = l.right - l.left, l.height = l.bottom - l.top, l.x = l.left, l.y = l.top, l;
}
var nt = "Sortable" + (/* @__PURE__ */ new Date()).getTime();
function zs() {
  var e = [], a;
  return {
    captureAnimationState: function() {
      if (e = [], !!this.options.animation) {
        var l = [].slice.call(this.el.children);
        l.forEach(function(o) {
          if (!(we(o, "display") === "none" || o === $e.ghost)) {
            e.push({
              target: o,
              rect: Ke(o)
            });
            var r = Ct({}, e[e.length - 1].rect);
            if (o.thisAnimationDuration) {
              var v = ca(o, !0);
              v && (r.top -= v.f, r.left -= v.e);
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
      e.splice(Fs(e, {
        target: l
      }), 1);
    },
    animateAll: function(l) {
      var o = this;
      if (!this.options.animation) {
        clearTimeout(a), typeof l == "function" && l();
        return;
      }
      var r = !1, v = 0;
      e.forEach(function(m) {
        var b = 0, i = m.target, u = i.fromRect, d = Ke(i), V = i.prevFromRect, g = i.prevToRect, h = m.rect, p = ca(i, !0);
        p && (d.top -= p.f, d.left -= p.e), i.toRect = d, i.thisAnimationDuration && yl(V, d) && !yl(u, d) && // Make sure animatingRect is on line between toRect & fromRect
        (h.top - d.top) / (h.left - d.left) === (u.top - d.top) / (u.left - d.left) && (b = qs(h, V, g, o.options)), yl(d, u) || (i.prevFromRect = u, i.prevToRect = d, b || (b = o.options.animation), o.animate(i, h, d, b)), b && (r = !0, v = Math.max(v, b), clearTimeout(i.animationResetTimer), i.animationResetTimer = setTimeout(function() {
          i.animationTime = 0, i.prevFromRect = null, i.fromRect = null, i.prevToRect = null, i.thisAnimationDuration = null;
        }, b), i.thisAnimationDuration = b);
      }), clearTimeout(a), r ? a = setTimeout(function() {
        typeof l == "function" && l();
      }, v) : typeof l == "function" && l(), e = [];
    },
    animate: function(l, o, r, v) {
      if (v) {
        we(l, "transition", ""), we(l, "transform", "");
        var m = ca(this.el), b = m && m.a, i = m && m.d, u = (o.left - r.left) / (b || 1), d = (o.top - r.top) / (i || 1);
        l.animatingX = !!u, l.animatingY = !!d, we(l, "transform", "translate3d(" + u + "px," + d + "px,0)"), this.forRepaintDummy = js(l), we(l, "transition", "transform " + v + "ms" + (this.options.easing ? " " + this.options.easing : "")), we(l, "transform", "translate3d(0,0,0)"), typeof l.animated == "number" && clearTimeout(l.animated), l.animated = setTimeout(function() {
          we(l, "transition", ""), we(l, "transform", ""), l.animated = !1, l.animatingX = !1, l.animatingY = !1;
        }, v);
      }
    }
  };
}
function js(e) {
  return e.offsetWidth;
}
function qs(e, a, t, l) {
  return Math.sqrt(Math.pow(a.top - e.top, 2) + Math.pow(a.left - e.left, 2)) / Math.sqrt(Math.pow(a.top - t.top, 2) + Math.pow(a.left - t.left, 2)) * l.animation;
}
var la = [], kl = {
  initializeByDefault: !0
}, Pa = {
  mount: function(a) {
    for (var t in kl)
      kl.hasOwnProperty(t) && !(t in a) && (a[t] = kl[t]);
    la.forEach(function(l) {
      if (l.pluginName === a.pluginName)
        throw "Sortable: Cannot mount plugin ".concat(a.pluginName, " more than once");
    }), la.push(a);
  },
  pluginEvent: function(a, t, l) {
    var o = this;
    this.eventCanceled = !1, l.cancel = function() {
      o.eventCanceled = !0;
    };
    var r = a + "Global";
    la.forEach(function(v) {
      t[v.pluginName] && (t[v.pluginName][r] && t[v.pluginName][r](Ct({
        sortable: t
      }, l)), t.options[v.pluginName] && t[v.pluginName][a] && t[v.pluginName][a](Ct({
        sortable: t
      }, l)));
    });
  },
  initializePlugins: function(a, t, l, o) {
    la.forEach(function(m) {
      var b = m.pluginName;
      if (!(!a.options[b] && !m.initializeByDefault)) {
        var i = new m(a, t, a.options);
        i.sortable = a, i.options = a.options, a[b] = i, At(l, i.defaults);
      }
    });
    for (var r in a.options)
      if (a.options.hasOwnProperty(r)) {
        var v = this.modifyOption(a, r, a.options[r]);
        typeof v < "u" && (a.options[r] = v);
      }
  },
  getEventProperties: function(a, t) {
    var l = {};
    return la.forEach(function(o) {
      typeof o.eventProperties == "function" && At(l, o.eventProperties.call(t[o.pluginName], a));
    }), l;
  },
  modifyOption: function(a, t, l) {
    var o;
    return la.forEach(function(r) {
      a[r.pluginName] && r.optionListeners && typeof r.optionListeners[t] == "function" && (o = r.optionListeners[t].call(a[r.pluginName], l));
    }), o;
  }
};
function Ws(e) {
  var a = e.sortable, t = e.rootEl, l = e.name, o = e.targetEl, r = e.cloneEl, v = e.toEl, m = e.fromEl, b = e.oldIndex, i = e.newIndex, u = e.oldDraggableIndex, d = e.newDraggableIndex, V = e.originalEvent, g = e.putSortable, h = e.extraEventProperties;
  if (a = a || t && t[nt], !!a) {
    var p, w = a.options, x = "on" + l.charAt(0).toUpperCase() + l.substr(1);
    window.CustomEvent && !Rt && !Oa ? p = new CustomEvent(l, {
      bubbles: !0,
      cancelable: !0
    }) : (p = document.createEvent("Event"), p.initEvent(l, !0, !0)), p.to = v || t, p.from = m || t, p.item = o || t, p.clone = r, p.oldIndex = b, p.newIndex = i, p.oldDraggableIndex = u, p.newDraggableIndex = d, p.originalEvent = V, p.pullMode = g ? g.lastPutMode : void 0;
    var $ = Ct(Ct({}, h), Pa.getEventProperties(l, a));
    for (var T in $)
      p[T] = $[T];
    t && t.dispatchEvent(p), w[x] && w[x].call(a, p);
  }
}
var Gs = ["evt"], it = function(a, t) {
  var l = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, o = l.evt, r = Rs(l, Gs);
  Pa.pluginEvent.bind($e)(a, t, Ct({
    dragEl: ne,
    parentEl: qe,
    ghostEl: Ce,
    rootEl: Le,
    nextEl: Jt,
    lastDownEl: Ha,
    cloneEl: ze,
    cloneHidden: Pt,
    dragStarted: ba,
    putSortable: _e,
    activeSortable: $e.active,
    originalEvent: o,
    oldIndex: da,
    oldDraggableIndex: Ca,
    newIndex: ut,
    newDraggableIndex: Ot,
    hideGhostForTarget: ni,
    unhideGhostForTarget: si,
    cloneNowHidden: function() {
      Pt = !0;
    },
    cloneNowShown: function() {
      Pt = !1;
    },
    dispatchSortableEvent: function(m) {
      ot({
        sortable: t,
        name: m,
        originalEvent: o
      });
    }
  }, r));
};
function ot(e) {
  Ws(Ct({
    putSortable: _e,
    cloneEl: ze,
    targetEl: ne,
    rootEl: Le,
    oldIndex: da,
    oldDraggableIndex: Ca,
    newIndex: ut,
    newDraggableIndex: Ot
  }, e));
}
var ne, qe, Ce, Le, Jt, Ha, ze, Pt, da, ut, Ca, Ot, ja, _e, ia = !1, tl = !1, al = [], Ht, bt, wl, $l, wo, $o, ba, oa, Sa, Ta = !1, qa = !1, Ya, tt, Vl = [], Nl = !1, ll = [], rl = typeof document < "u", Wa = _l, Vo = Oa || Rt ? "cssFloat" : "float", Ks = rl && !Xo && !_l && "draggable" in document.createElement("div"), li = (function() {
  if (rl) {
    if (Rt)
      return !1;
    var e = document.createElement("x");
    return e.style.cssText = "pointer-events:auto", e.style.pointerEvents === "auto";
  }
})(), oi = function(a, t) {
  var l = we(a), o = parseInt(l.width) - parseInt(l.paddingLeft) - parseInt(l.paddingRight) - parseInt(l.borderLeftWidth) - parseInt(l.borderRightWidth), r = va(a, 0, t), v = va(a, 1, t), m = r && we(r), b = v && we(v), i = m && parseInt(m.marginLeft) + parseInt(m.marginRight) + Ke(r).width, u = b && parseInt(b.marginLeft) + parseInt(b.marginRight) + Ke(v).width;
  if (l.display === "flex")
    return l.flexDirection === "column" || l.flexDirection === "column-reverse" ? "vertical" : "horizontal";
  if (l.display === "grid")
    return l.gridTemplateColumns.split(" ").length <= 1 ? "vertical" : "horizontal";
  if (r && m.float && m.float !== "none") {
    var d = m.float === "left" ? "left" : "right";
    return v && (b.clear === "both" || b.clear === d) ? "vertical" : "horizontal";
  }
  return r && (m.display === "block" || m.display === "flex" || m.display === "table" || m.display === "grid" || i >= o && l[Vo] === "none" || v && l[Vo] === "none" && i + u > o) ? "vertical" : "horizontal";
}, Hs = function(a, t, l) {
  var o = l ? a.left : a.top, r = l ? a.right : a.bottom, v = l ? a.width : a.height, m = l ? t.left : t.top, b = l ? t.right : t.bottom, i = l ? t.width : t.height;
  return o === m || r === b || o + v / 2 === m + i / 2;
}, Ys = function(a, t) {
  var l;
  return al.some(function(o) {
    var r = o[nt].options.emptyInsertThreshold;
    if (!(!r || eo(o))) {
      var v = Ke(o), m = a >= v.left - r && a <= v.right + r, b = t >= v.top - r && t <= v.bottom + r;
      if (m && b)
        return l = o;
    }
  }), l;
}, ii = function(a) {
  function t(r, v) {
    return function(m, b, i, u) {
      var d = m.options.group.name && b.options.group.name && m.options.group.name === b.options.group.name;
      if (r == null && (v || d))
        return !0;
      if (r == null || r === !1)
        return !1;
      if (v && r === "clone")
        return r;
      if (typeof r == "function")
        return t(r(m, b, i, u), v)(m, b, i, u);
      var V = (v ? m : b).options.group.name;
      return r === !0 || typeof r == "string" && r === V || r.join && r.indexOf(V) > -1;
    };
  }
  var l = {}, o = a.group;
  (!o || Pl(o) != "object") && (o = {
    name: o
  }), l.name = o.name, l.checkPull = t(o.pull, !0), l.checkPut = t(o.put), l.revertClone = o.revertClone, a.group = l;
}, ni = function() {
  !li && Ce && we(Ce, "display", "none");
}, si = function() {
  !li && Ce && we(Ce, "display", "");
};
rl && !Xo && document.addEventListener("click", function(e) {
  if (tl)
    return e.preventDefault(), e.stopPropagation && e.stopPropagation(), e.stopImmediatePropagation && e.stopImmediatePropagation(), tl = !1, !1;
}, !0);
var Yt = function(a) {
  if (ne) {
    a = a.touches ? a.touches[0] : a;
    var t = Ys(a.clientX, a.clientY);
    if (t) {
      var l = {};
      for (var o in a)
        a.hasOwnProperty(o) && (l[o] = a[o]);
      l.target = l.rootEl = t, l.preventDefault = void 0, l.stopPropagation = void 0, t[nt]._onDragOver(l);
    }
  }
}, Xs = function(a) {
  ne && ne.parentNode[nt]._isOutsideThisEl(a.target);
};
function $e(e, a) {
  if (!(e && e.nodeType && e.nodeType === 1))
    throw "Sortable: `el` must be an HTMLElement, not ".concat({}.toString.call(e));
  this.el = e, this.options = a = At({}, a), e[nt] = this;
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
      return oi(e, this.options);
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
    supportPointer: $e.supportPointer !== !1 && "PointerEvent" in window && (!Va || _l),
    emptyInsertThreshold: 5
  };
  Pa.initializePlugins(this, e, t);
  for (var l in t)
    !(l in a) && (a[l] = t[l]);
  ii(a);
  for (var o in this)
    o.charAt(0) === "_" && typeof this[o] == "function" && (this[o] = this[o].bind(this));
  this.nativeDraggable = a.forceFallback ? !1 : Ks, this.nativeDraggable && (this.options.touchStartThreshold = 1), a.supportPointer ? Ee(e, "pointerdown", this._onTapStart) : (Ee(e, "mousedown", this._onTapStart), Ee(e, "touchstart", this._onTapStart)), this.nativeDraggable && (Ee(e, "dragover", this), Ee(e, "dragenter", this)), al.push(this.el), a.store && a.store.get && this.sort(a.store.get(this) || []), At(this, zs());
}
$e.prototype = /** @lends Sortable.prototype */
{
  constructor: $e,
  _isOutsideThisEl: function(a) {
    !this.el.contains(a) && a !== this.el && (oa = null);
  },
  _getDirection: function(a, t) {
    return typeof this.options.direction == "function" ? this.options.direction.call(this, a, t, ne) : this.options.direction;
  },
  _onTapStart: function(a) {
    if (a.cancelable) {
      var t = this, l = this.el, o = this.options, r = o.preventOnFilter, v = a.type, m = a.touches && a.touches[0] || a.pointerType && a.pointerType === "touch" && a, b = (m || a).target, i = a.target.shadowRoot && (a.path && a.path[0] || a.composedPath && a.composedPath()[0]) || b, u = o.filter;
      if (lr(l), !ne && !(/mousedown|pointerdown/.test(v) && a.button !== 0 || o.disabled) && !i.isContentEditable && !(!this.nativeDraggable && Va && b && b.tagName.toUpperCase() === "SELECT") && (b = kt(b, o.draggable, l, !1), !(b && b.animated) && Ha !== b)) {
        if (da = ft(b), Ca = ft(b, o.draggable), typeof u == "function") {
          if (u.call(this, a, b, this)) {
            ot({
              sortable: t,
              rootEl: i,
              name: "filter",
              targetEl: b,
              toEl: l,
              fromEl: l
            }), it("filter", t, {
              evt: a
            }), r && a.preventDefault();
            return;
          }
        } else if (u && (u = u.split(",").some(function(d) {
          if (d = kt(i, d.trim(), l, !1), d)
            return ot({
              sortable: t,
              rootEl: d,
              name: "filter",
              targetEl: b,
              fromEl: l,
              toEl: l
            }), it("filter", t, {
              evt: a
            }), !0;
        }), u)) {
          r && a.preventDefault();
          return;
        }
        o.handle && !kt(i, o.handle, l, !1) || this._prepareDragStart(a, m, b);
      }
    }
  },
  _prepareDragStart: function(a, t, l) {
    var o = this, r = o.el, v = o.options, m = r.ownerDocument, b;
    if (l && !ne && l.parentNode === r) {
      var i = Ke(l);
      if (Le = r, ne = l, qe = ne.parentNode, Jt = ne.nextSibling, Ha = l, ja = v.group, $e.dragged = ne, Ht = {
        target: ne,
        clientX: (t || a).clientX,
        clientY: (t || a).clientY
      }, wo = Ht.clientX - i.left, $o = Ht.clientY - i.top, this._lastX = (t || a).clientX, this._lastY = (t || a).clientY, ne.style["will-change"] = "all", b = function() {
        if (it("delayEnded", o, {
          evt: a
        }), $e.eventCanceled) {
          o._onDrop();
          return;
        }
        o._disableDelayedDragEvents(), !ho && o.nativeDraggable && (ne.draggable = !0), o._triggerDragStart(a, t), ot({
          sortable: o,
          name: "choose",
          originalEvent: a
        }), dt(ne, v.chosenClass, !0);
      }, v.ignore.split(",").forEach(function(u) {
        Qo(ne, u.trim(), xl);
      }), Ee(m, "dragover", Yt), Ee(m, "mousemove", Yt), Ee(m, "touchmove", Yt), v.supportPointer ? (Ee(m, "pointerup", o._onDrop), !this.nativeDraggable && Ee(m, "pointercancel", o._onDrop)) : (Ee(m, "mouseup", o._onDrop), Ee(m, "touchend", o._onDrop), Ee(m, "touchcancel", o._onDrop)), ho && this.nativeDraggable && (this.options.touchStartThreshold = 4, ne.draggable = !0), it("delayStart", this, {
        evt: a
      }), v.delay && (!v.delayOnTouchOnly || t) && (!this.nativeDraggable || !(Oa || Rt))) {
        if ($e.eventCanceled) {
          this._onDrop();
          return;
        }
        v.supportPointer ? (Ee(m, "pointerup", o._disableDelayedDrag), Ee(m, "pointercancel", o._disableDelayedDrag)) : (Ee(m, "mouseup", o._disableDelayedDrag), Ee(m, "touchend", o._disableDelayedDrag), Ee(m, "touchcancel", o._disableDelayedDrag)), Ee(m, "mousemove", o._delayedDragTouchMoveHandler), Ee(m, "touchmove", o._delayedDragTouchMoveHandler), v.supportPointer && Ee(m, "pointermove", o._delayedDragTouchMoveHandler), o._dragStartTimer = setTimeout(b, v.delay);
      } else
        b();
    }
  },
  _delayedDragTouchMoveHandler: function(a) {
    var t = a.touches ? a.touches[0] : a;
    Math.max(Math.abs(t.clientX - this._lastX), Math.abs(t.clientY - this._lastY)) >= Math.floor(this.options.touchStartThreshold / (this.nativeDraggable && window.devicePixelRatio || 1)) && this._disableDelayedDrag();
  },
  _disableDelayedDrag: function() {
    ne && xl(ne), clearTimeout(this._dragStartTimer), this._disableDelayedDragEvents();
  },
  _disableDelayedDragEvents: function() {
    var a = this.el.ownerDocument;
    Ae(a, "mouseup", this._disableDelayedDrag), Ae(a, "touchend", this._disableDelayedDrag), Ae(a, "touchcancel", this._disableDelayedDrag), Ae(a, "pointerup", this._disableDelayedDrag), Ae(a, "pointercancel", this._disableDelayedDrag), Ae(a, "mousemove", this._delayedDragTouchMoveHandler), Ae(a, "touchmove", this._delayedDragTouchMoveHandler), Ae(a, "pointermove", this._delayedDragTouchMoveHandler);
  },
  _triggerDragStart: function(a, t) {
    t = t || a.pointerType == "touch" && a, !this.nativeDraggable || t ? this.options.supportPointer ? Ee(document, "pointermove", this._onTouchMove) : t ? Ee(document, "touchmove", this._onTouchMove) : Ee(document, "mousemove", this._onTouchMove) : (Ee(ne, "dragend", this), Ee(Le, "dragstart", this._onDragStart));
    try {
      document.selection ? Xa(function() {
        document.selection.empty();
      }) : window.getSelection().removeAllRanges();
    } catch {
    }
  },
  _dragStarted: function(a, t) {
    if (ia = !1, Le && ne) {
      it("dragStarted", this, {
        evt: t
      }), this.nativeDraggable && Ee(document, "dragover", Xs);
      var l = this.options;
      !a && dt(ne, l.dragClass, !1), dt(ne, l.ghostClass, !0), $e.active = this, a && this._appendGhost(), ot({
        sortable: this,
        name: "start",
        originalEvent: t
      });
    } else
      this._nulling();
  },
  _emulateDragOver: function() {
    if (bt) {
      this._lastX = bt.clientX, this._lastY = bt.clientY, ni();
      for (var a = document.elementFromPoint(bt.clientX, bt.clientY), t = a; a && a.shadowRoot && (a = a.shadowRoot.elementFromPoint(bt.clientX, bt.clientY), a !== t); )
        t = a;
      if (ne.parentNode[nt]._isOutsideThisEl(a), t)
        do {
          if (t[nt]) {
            var l = void 0;
            if (l = t[nt]._onDragOver({
              clientX: bt.clientX,
              clientY: bt.clientY,
              target: a,
              rootEl: t
            }), l && !this.options.dragoverBubble)
              break;
          }
          a = t;
        } while (t = Zo(t));
      si();
    }
  },
  _onTouchMove: function(a) {
    if (Ht) {
      var t = this.options, l = t.fallbackTolerance, o = t.fallbackOffset, r = a.touches ? a.touches[0] : a, v = Ce && ca(Ce, !0), m = Ce && v && v.a, b = Ce && v && v.d, i = Wa && tt && ko(tt), u = (r.clientX - Ht.clientX + o.x) / (m || 1) + (i ? i[0] - Vl[0] : 0) / (m || 1), d = (r.clientY - Ht.clientY + o.y) / (b || 1) + (i ? i[1] - Vl[1] : 0) / (b || 1);
      if (!$e.active && !ia) {
        if (l && Math.max(Math.abs(r.clientX - this._lastX), Math.abs(r.clientY - this._lastY)) < l)
          return;
        this._onDragStart(a, !0);
      }
      if (Ce) {
        v ? (v.e += u - (wl || 0), v.f += d - ($l || 0)) : v = {
          a: 1,
          b: 0,
          c: 0,
          d: 1,
          e: u,
          f: d
        };
        var V = "matrix(".concat(v.a, ",").concat(v.b, ",").concat(v.c, ",").concat(v.d, ",").concat(v.e, ",").concat(v.f, ")");
        we(Ce, "webkitTransform", V), we(Ce, "mozTransform", V), we(Ce, "msTransform", V), we(Ce, "transform", V), wl = u, $l = d, bt = r;
      }
      a.cancelable && a.preventDefault();
    }
  },
  _appendGhost: function() {
    if (!Ce) {
      var a = this.options.fallbackOnBody ? document.body : Le, t = Ke(ne, !0, Wa, !0, a), l = this.options;
      if (Wa) {
        for (tt = a; we(tt, "position") === "static" && we(tt, "transform") === "none" && tt !== document; )
          tt = tt.parentNode;
        tt !== document.body && tt !== document.documentElement ? (tt === document && (tt = xt()), t.top += tt.scrollTop, t.left += tt.scrollLeft) : tt = xt(), Vl = ko(tt);
      }
      Ce = ne.cloneNode(!0), dt(Ce, l.ghostClass, !1), dt(Ce, l.fallbackClass, !0), dt(Ce, l.dragClass, !0), we(Ce, "transition", ""), we(Ce, "transform", ""), we(Ce, "box-sizing", "border-box"), we(Ce, "margin", 0), we(Ce, "top", t.top), we(Ce, "left", t.left), we(Ce, "width", t.width), we(Ce, "height", t.height), we(Ce, "opacity", "0.8"), we(Ce, "position", Wa ? "absolute" : "fixed"), we(Ce, "zIndex", "100000"), we(Ce, "pointerEvents", "none"), $e.ghost = Ce, a.appendChild(Ce), we(Ce, "transform-origin", wo / parseInt(Ce.style.width) * 100 + "% " + $o / parseInt(Ce.style.height) * 100 + "%");
    }
  },
  _onDragStart: function(a, t) {
    var l = this, o = a.dataTransfer, r = l.options;
    if (it("dragStart", this, {
      evt: a
    }), $e.eventCanceled) {
      this._onDrop();
      return;
    }
    it("setupClone", this), $e.eventCanceled || (ze = ti(ne), ze.removeAttribute("id"), ze.draggable = !1, ze.style["will-change"] = "", this._hideClone(), dt(ze, this.options.chosenClass, !1), $e.clone = ze), l.cloneId = Xa(function() {
      it("clone", l), !$e.eventCanceled && (l.options.removeCloneOnHide || Le.insertBefore(ze, ne), l._hideClone(), ot({
        sortable: l,
        name: "clone"
      }));
    }), !t && dt(ne, r.dragClass, !0), t ? (tl = !0, l._loopId = setInterval(l._emulateDragOver, 50)) : (Ae(document, "mouseup", l._onDrop), Ae(document, "touchend", l._onDrop), Ae(document, "touchcancel", l._onDrop), o && (o.effectAllowed = "move", r.setData && r.setData.call(l, o, ne)), Ee(document, "drop", l), we(ne, "transform", "translateZ(0)")), ia = !0, l._dragStartId = Xa(l._dragStarted.bind(l, t, a)), Ee(document, "selectstart", l), ba = !0, window.getSelection().removeAllRanges(), Va && we(document.body, "user-select", "none");
  },
  // Returns true - if no further action is needed (either inserted or another condition)
  _onDragOver: function(a) {
    var t = this.el, l = a.target, o, r, v, m = this.options, b = m.group, i = $e.active, u = ja === b, d = m.sort, V = _e || i, g, h = this, p = !1;
    if (Nl) return;
    function w(Oe, H) {
      it(Oe, h, Ct({
        evt: a,
        isOwner: u,
        axis: g ? "vertical" : "horizontal",
        revert: v,
        dragRect: o,
        targetRect: r,
        canSort: d,
        fromSortable: V,
        target: l,
        completed: $,
        onMove: function(M, ce) {
          return Ga(Le, t, ne, o, M, Ke(M), a, ce);
        },
        changed: T
      }, H));
    }
    function x() {
      w("dragOverAnimationCapture"), h.captureAnimationState(), h !== V && V.captureAnimationState();
    }
    function $(Oe) {
      return w("dragOverCompleted", {
        insertion: Oe
      }), Oe && (u ? i._hideClone() : i._showClone(h), h !== V && (dt(ne, _e ? _e.options.ghostClass : i.options.ghostClass, !1), dt(ne, m.ghostClass, !0)), _e !== h && h !== $e.active ? _e = h : h === $e.active && _e && (_e = null), V === h && (h._ignoreWhileAnimating = l), h.animateAll(function() {
        w("dragOverAnimationComplete"), h._ignoreWhileAnimating = null;
      }), h !== V && (V.animateAll(), V._ignoreWhileAnimating = null)), (l === ne && !ne.animated || l === t && !l.animated) && (oa = null), !m.dragoverBubble && !a.rootEl && l !== document && (ne.parentNode[nt]._isOutsideThisEl(a.target), !Oe && Yt(a)), !m.dragoverBubble && a.stopPropagation && a.stopPropagation(), p = !0;
    }
    function T() {
      ut = ft(ne), Ot = ft(ne, m.draggable), ot({
        sortable: h,
        name: "change",
        toEl: t,
        newIndex: ut,
        newDraggableIndex: Ot,
        originalEvent: a
      });
    }
    if (a.preventDefault !== void 0 && a.cancelable && a.preventDefault(), l = kt(l, m.draggable, t, !0), w("dragOver"), $e.eventCanceled) return p;
    if (ne.contains(a.target) || l.animated && l.animatingX && l.animatingY || h._ignoreWhileAnimating === l)
      return $(!1);
    if (tl = !1, i && !m.disabled && (u ? d || (v = qe !== Le) : _e === this || (this.lastPutMode = ja.checkPull(this, i, ne, a)) && b.checkPut(this, i, ne, a))) {
      if (g = this._getDirection(a, l) === "vertical", o = Ke(ne), w("dragOverValid"), $e.eventCanceled) return p;
      if (v)
        return qe = Le, x(), this._hideClone(), w("revert"), $e.eventCanceled || (Jt ? Le.insertBefore(ne, Jt) : Le.appendChild(ne)), $(!0);
      var D = eo(t, m.draggable);
      if (!D || _s(a, g, this) && !D.animated) {
        if (D === ne)
          return $(!1);
        if (D && t === a.target && (l = D), l && (r = Ke(l)), Ga(Le, t, ne, o, l, r, a, !!l) !== !1)
          return x(), D && D.nextSibling ? t.insertBefore(ne, D.nextSibling) : t.appendChild(ne), qe = t, T(), $(!0);
      } else if (D && Qs(a, g, this)) {
        var z = va(t, 0, m, !0);
        if (z === ne)
          return $(!1);
        if (l = z, r = Ke(l), Ga(Le, t, ne, o, l, r, a, !1) !== !1)
          return x(), t.insertBefore(ne, z), qe = t, T(), $(!0);
      } else if (l.parentNode === t) {
        r = Ke(l);
        var le = 0, Z, ue = ne.parentNode !== t, me = !Hs(ne.animated && ne.toRect || o, l.animated && l.toRect || r, g), ge = g ? "top" : "left", be = yo(l, "top", "top") || yo(ne, "top", "top"), se = be ? be.scrollTop : void 0;
        oa !== l && (Z = r[ge], Ta = !1, qa = !me && m.invertSwap || ue), le = er(a, l, r, g, me ? 1 : m.swapThreshold, m.invertedSwapThreshold == null ? m.swapThreshold : m.invertedSwapThreshold, qa, oa === l);
        var R;
        if (le !== 0) {
          var _ = ft(ne);
          do
            _ -= le, R = qe.children[_];
          while (R && (we(R, "display") === "none" || R === Ce));
        }
        if (le === 0 || R === l)
          return $(!1);
        oa = l, Sa = le;
        var L = l.nextElementSibling, ie = !1;
        ie = le === 1;
        var xe = Ga(Le, t, ne, o, l, r, a, ie);
        if (xe !== !1)
          return (xe === 1 || xe === -1) && (ie = xe === 1), Nl = !0, setTimeout(Zs, 30), x(), ie && !L ? t.appendChild(ne) : l.parentNode.insertBefore(ne, ie ? L : l), be && ei(be, 0, se - be.scrollTop), qe = ne.parentNode, Z !== void 0 && !qa && (Ya = Math.abs(Z - Ke(l)[ge])), T(), $(!0);
      }
      if (t.contains(ne))
        return $(!1);
    }
    return !1;
  },
  _ignoreWhileAnimating: null,
  _offMoveEvents: function() {
    Ae(document, "mousemove", this._onTouchMove), Ae(document, "touchmove", this._onTouchMove), Ae(document, "pointermove", this._onTouchMove), Ae(document, "dragover", Yt), Ae(document, "mousemove", Yt), Ae(document, "touchmove", Yt);
  },
  _offUpEvents: function() {
    var a = this.el.ownerDocument;
    Ae(a, "mouseup", this._onDrop), Ae(a, "touchend", this._onDrop), Ae(a, "pointerup", this._onDrop), Ae(a, "pointercancel", this._onDrop), Ae(a, "touchcancel", this._onDrop), Ae(document, "selectstart", this);
  },
  _onDrop: function(a) {
    var t = this.el, l = this.options;
    if (ut = ft(ne), Ot = ft(ne, l.draggable), it("drop", this, {
      evt: a
    }), qe = ne && ne.parentNode, ut = ft(ne), Ot = ft(ne, l.draggable), $e.eventCanceled) {
      this._nulling();
      return;
    }
    ia = !1, qa = !1, Ta = !1, clearInterval(this._loopId), clearTimeout(this._dragStartTimer), Ml(this.cloneId), Ml(this._dragStartId), this.nativeDraggable && (Ae(document, "drop", this), Ae(t, "dragstart", this._onDragStart)), this._offMoveEvents(), this._offUpEvents(), Va && we(document.body, "user-select", ""), we(ne, "transform", ""), a && (ba && (a.cancelable && a.preventDefault(), !l.dropBubble && a.stopPropagation()), Ce && Ce.parentNode && Ce.parentNode.removeChild(Ce), (Le === qe || _e && _e.lastPutMode !== "clone") && ze && ze.parentNode && ze.parentNode.removeChild(ze), ne && (this.nativeDraggable && Ae(ne, "dragend", this), xl(ne), ne.style["will-change"] = "", ba && !ia && dt(ne, _e ? _e.options.ghostClass : this.options.ghostClass, !1), dt(ne, this.options.chosenClass, !1), ot({
      sortable: this,
      name: "unchoose",
      toEl: qe,
      newIndex: null,
      newDraggableIndex: null,
      originalEvent: a
    }), Le !== qe ? (ut >= 0 && (ot({
      rootEl: qe,
      name: "add",
      toEl: qe,
      fromEl: Le,
      originalEvent: a
    }), ot({
      sortable: this,
      name: "remove",
      toEl: qe,
      originalEvent: a
    }), ot({
      rootEl: qe,
      name: "sort",
      toEl: qe,
      fromEl: Le,
      originalEvent: a
    }), ot({
      sortable: this,
      name: "sort",
      toEl: qe,
      originalEvent: a
    })), _e && _e.save()) : ut !== da && ut >= 0 && (ot({
      sortable: this,
      name: "update",
      toEl: qe,
      originalEvent: a
    }), ot({
      sortable: this,
      name: "sort",
      toEl: qe,
      originalEvent: a
    })), $e.active && ((ut == null || ut === -1) && (ut = da, Ot = Ca), ot({
      sortable: this,
      name: "end",
      toEl: qe,
      originalEvent: a
    }), this.save()))), this._nulling();
  },
  _nulling: function() {
    it("nulling", this), Le = ne = qe = Ce = Jt = ze = Ha = Pt = Ht = bt = ba = ut = Ot = da = Ca = oa = Sa = _e = ja = $e.dragged = $e.ghost = $e.clone = $e.active = null;
    var a = this.el;
    ll.forEach(function(t) {
      a.contains(t) && (t.checked = !0);
    }), ll.length = wl = $l = 0;
  },
  handleEvent: function(a) {
    switch (a.type) {
      case "drop":
      case "dragend":
        this._onDrop(a);
        break;
      case "dragenter":
      case "dragover":
        ne && (this._onDragOver(a), Js(a));
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
    for (var a = [], t, l = this.el.children, o = 0, r = l.length, v = this.options; o < r; o++)
      t = l[o], kt(t, v.draggable, this.el, !1) && a.push(t.getAttribute(v.dataIdAttr) || ar(t));
    return a;
  },
  /**
   * Sorts the elements according to the array.
   * @param  {String[]}  order  order of the items
   */
  sort: function(a, t) {
    var l = {}, o = this.el;
    this.toArray().forEach(function(r, v) {
      var m = o.children[v];
      kt(m, this.options.draggable, o, !1) && (l[r] = m);
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
    return kt(a, t || this.options.draggable, this.el, !1);
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
    var o = Pa.modifyOption(this, a, t);
    typeof o < "u" ? l[a] = o : l[a] = t, a === "group" && ii(l);
  },
  /**
   * Destroy
   */
  destroy: function() {
    it("destroy", this);
    var a = this.el;
    a[nt] = null, Ae(a, "mousedown", this._onTapStart), Ae(a, "touchstart", this._onTapStart), Ae(a, "pointerdown", this._onTapStart), this.nativeDraggable && (Ae(a, "dragover", this), Ae(a, "dragenter", this)), Array.prototype.forEach.call(a.querySelectorAll("[draggable]"), function(t) {
      t.removeAttribute("draggable");
    }), this._onDrop(), this._disableDelayedDragEvents(), al.splice(al.indexOf(this.el), 1), this.el = a = null;
  },
  _hideClone: function() {
    if (!Pt) {
      if (it("hideClone", this), $e.eventCanceled) return;
      we(ze, "display", "none"), this.options.removeCloneOnHide && ze.parentNode && ze.parentNode.removeChild(ze), Pt = !0;
    }
  },
  _showClone: function(a) {
    if (a.lastPutMode !== "clone") {
      this._hideClone();
      return;
    }
    if (Pt) {
      if (it("showClone", this), $e.eventCanceled) return;
      ne.parentNode == Le && !this.options.group.revertClone ? Le.insertBefore(ze, ne) : Jt ? Le.insertBefore(ze, Jt) : Le.appendChild(ze), this.options.group.revertClone && this.animate(ne, ze), we(ze, "display", ""), Pt = !1;
    }
  }
};
function Js(e) {
  e.dataTransfer && (e.dataTransfer.dropEffect = "move"), e.cancelable && e.preventDefault();
}
function Ga(e, a, t, l, o, r, v, m) {
  var b, i = e[nt], u = i.options.onMove, d;
  return window.CustomEvent && !Rt && !Oa ? b = new CustomEvent("move", {
    bubbles: !0,
    cancelable: !0
  }) : (b = document.createEvent("Event"), b.initEvent("move", !0, !0)), b.to = a, b.from = e, b.dragged = t, b.draggedRect = l, b.related = o || a, b.relatedRect = r || Ke(a), b.willInsertAfter = m, b.originalEvent = v, e.dispatchEvent(b), u && (d = u.call(i, b, v)), d;
}
function xl(e) {
  e.draggable = !1;
}
function Zs() {
  Nl = !1;
}
function Qs(e, a, t) {
  var l = Ke(va(t.el, 0, t.options, !0)), o = ai(t.el, t.options, Ce), r = 10;
  return a ? e.clientX < o.left - r || e.clientY < l.top && e.clientX < l.right : e.clientY < o.top - r || e.clientY < l.bottom && e.clientX < l.left;
}
function _s(e, a, t) {
  var l = Ke(eo(t.el, t.options.draggable)), o = ai(t.el, t.options, Ce), r = 10;
  return a ? e.clientX > o.right + r || e.clientY > l.bottom && e.clientX > l.left : e.clientY > o.bottom + r || e.clientX > l.right && e.clientY > l.top;
}
function er(e, a, t, l, o, r, v, m) {
  var b = l ? e.clientY : e.clientX, i = l ? t.height : t.width, u = l ? t.top : t.left, d = l ? t.bottom : t.right, V = !1;
  if (!v) {
    if (m && Ya < i * o) {
      if (!Ta && (Sa === 1 ? b > u + i * r / 2 : b < d - i * r / 2) && (Ta = !0), Ta)
        V = !0;
      else if (Sa === 1 ? b < u + Ya : b > d - Ya)
        return -Sa;
    } else if (b > u + i * (1 - o) / 2 && b < d - i * (1 - o) / 2)
      return tr(a);
  }
  return V = V || v, V && (b < u + i * r / 2 || b > d - i * r / 2) ? b > u + i / 2 ? 1 : -1 : 0;
}
function tr(e) {
  return ft(ne) < ft(e) ? 1 : -1;
}
function ar(e) {
  for (var a = e.tagName + e.className + e.src + e.href + e.textContent, t = a.length, l = 0; t--; )
    l += a.charCodeAt(t);
  return l.toString(36);
}
function lr(e) {
  ll.length = 0;
  for (var a = e.getElementsByTagName("input"), t = a.length; t--; ) {
    var l = a[t];
    l.checked && ll.push(l);
  }
}
function Xa(e) {
  return setTimeout(e, 0);
}
function Ml(e) {
  return clearTimeout(e);
}
rl && Ee(document, "touchmove", function(e) {
  ($e.active || ia) && e.cancelable && e.preventDefault();
});
$e.utils = {
  on: Ee,
  off: Ae,
  css: we,
  find: Qo,
  is: function(a, t) {
    return !!kt(a, t, a, !1);
  },
  extend: Ls,
  throttle: _o,
  closest: kt,
  toggleClass: dt,
  clone: ti,
  index: ft,
  nextTick: Xa,
  cancelNextTick: Ml,
  detectDirection: oi,
  getChild: va,
  expando: nt
};
$e.get = function(e) {
  return e[nt];
};
$e.mount = function() {
  for (var e = arguments.length, a = new Array(e), t = 0; t < e; t++)
    a[t] = arguments[t];
  a[0].constructor === Array && (a = a[0]), a.forEach(function(l) {
    if (!l.prototype || !l.prototype.constructor)
      throw "Sortable: Mounted plugin must be a constructor function, not ".concat({}.toString.call(l));
    l.utils && ($e.utils = Ct(Ct({}, $e.utils), l.utils)), Pa.mount(l);
  });
};
$e.create = function(e, a) {
  return new $e(e, a);
};
$e.version = Ms;
var Ge = [], ya, Fl, Ll = !1, Cl, Sl, ol, ka;
function or() {
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
      this.sortable.nativeDraggable ? Ee(document, "dragover", this._handleAutoScroll) : this.options.supportPointer ? Ee(document, "pointermove", this._handleFallbackAutoScroll) : l.touches ? Ee(document, "touchmove", this._handleFallbackAutoScroll) : Ee(document, "mousemove", this._handleFallbackAutoScroll);
    },
    dragOverCompleted: function(t) {
      var l = t.originalEvent;
      !this.options.dragOverBubble && !l.rootEl && this._handleAutoScroll(l);
    },
    drop: function() {
      this.sortable.nativeDraggable ? Ae(document, "dragover", this._handleAutoScroll) : (Ae(document, "pointermove", this._handleFallbackAutoScroll), Ae(document, "touchmove", this._handleFallbackAutoScroll), Ae(document, "mousemove", this._handleFallbackAutoScroll)), xo(), Ja(), Bs();
    },
    nulling: function() {
      ol = Fl = ya = Ll = ka = Cl = Sl = null, Ge.length = 0;
    },
    _handleFallbackAutoScroll: function(t) {
      this._handleAutoScroll(t, !0);
    },
    _handleAutoScroll: function(t, l) {
      var o = this, r = (t.touches ? t.touches[0] : t).clientX, v = (t.touches ? t.touches[0] : t).clientY, m = document.elementFromPoint(r, v);
      if (ol = t, l || this.options.forceAutoScrollFallback || Oa || Rt || Va) {
        Tl(t, this.options, m, l);
        var b = Mt(m, !0);
        Ll && (!ka || r !== Cl || v !== Sl) && (ka && xo(), ka = setInterval(function() {
          var i = Mt(document.elementFromPoint(r, v), !0);
          i !== b && (b = i, Ja()), Tl(t, o.options, i, l);
        }, 10), Cl = r, Sl = v);
      } else {
        if (!this.options.bubbleScroll || Mt(m, !0) === xt()) {
          Ja();
          return;
        }
        Tl(t, this.options, Mt(m, !1), !1);
      }
    }
  }, At(e, {
    pluginName: "scroll",
    initializeByDefault: !0
  });
}
function Ja() {
  Ge.forEach(function(e) {
    clearInterval(e.pid);
  }), Ge = [];
}
function xo() {
  clearInterval(ka);
}
var Tl = _o(function(e, a, t, l) {
  if (a.scroll) {
    var o = (e.touches ? e.touches[0] : e).clientX, r = (e.touches ? e.touches[0] : e).clientY, v = a.scrollSensitivity, m = a.scrollSpeed, b = xt(), i = !1, u;
    Fl !== t && (Fl = t, Ja(), ya = a.scroll, u = a.scrollFn, ya === !0 && (ya = Mt(t, !0)));
    var d = 0, V = ya;
    do {
      var g = V, h = Ke(g), p = h.top, w = h.bottom, x = h.left, $ = h.right, T = h.width, D = h.height, z = void 0, le = void 0, Z = g.scrollWidth, ue = g.scrollHeight, me = we(g), ge = g.scrollLeft, be = g.scrollTop;
      g === b ? (z = T < Z && (me.overflowX === "auto" || me.overflowX === "scroll" || me.overflowX === "visible"), le = D < ue && (me.overflowY === "auto" || me.overflowY === "scroll" || me.overflowY === "visible")) : (z = T < Z && (me.overflowX === "auto" || me.overflowX === "scroll"), le = D < ue && (me.overflowY === "auto" || me.overflowY === "scroll"));
      var se = z && (Math.abs($ - o) <= v && ge + T < Z) - (Math.abs(x - o) <= v && !!ge), R = le && (Math.abs(w - r) <= v && be + D < ue) - (Math.abs(p - r) <= v && !!be);
      if (!Ge[d])
        for (var _ = 0; _ <= d; _++)
          Ge[_] || (Ge[_] = {});
      (Ge[d].vx != se || Ge[d].vy != R || Ge[d].el !== g) && (Ge[d].el = g, Ge[d].vx = se, Ge[d].vy = R, clearInterval(Ge[d].pid), (se != 0 || R != 0) && (i = !0, Ge[d].pid = setInterval(function() {
        l && this.layer === 0 && $e.active._onTouchMove(ol);
        var L = Ge[this.layer].vy ? Ge[this.layer].vy * m : 0, ie = Ge[this.layer].vx ? Ge[this.layer].vx * m : 0;
        typeof u == "function" && u.call($e.dragged.parentNode[nt], ie, L, e, ol, Ge[this.layer].el) !== "continue" || ei(Ge[this.layer].el, ie, L);
      }.bind({
        layer: d
      }), 24))), d++;
    } while (a.bubbleScroll && V !== b && (V = Mt(V, !1)));
    Ll = i;
  }
}, 30), ri = function(a) {
  var t = a.originalEvent, l = a.putSortable, o = a.dragEl, r = a.activeSortable, v = a.dispatchSortableEvent, m = a.hideGhostForTarget, b = a.unhideGhostForTarget;
  if (t) {
    var i = l || r;
    m();
    var u = t.changedTouches && t.changedTouches.length ? t.changedTouches[0] : t, d = document.elementFromPoint(u.clientX, u.clientY);
    b(), i && !i.el.contains(d) && (v("spill"), this.onSpill({
      dragEl: o,
      putSortable: l
    }));
  }
};
function to() {
}
to.prototype = {
  startIndex: null,
  dragStart: function(a) {
    var t = a.oldDraggableIndex;
    this.startIndex = t;
  },
  onSpill: function(a) {
    var t = a.dragEl, l = a.putSortable;
    this.sortable.captureAnimationState(), l && l.captureAnimationState();
    var o = va(this.sortable.el, this.startIndex, this.options);
    o ? this.sortable.el.insertBefore(t, o) : this.sortable.el.appendChild(t), this.sortable.animateAll(), l && l.animateAll();
  },
  drop: ri
};
At(to, {
  pluginName: "revertOnSpill"
});
function ao() {
}
ao.prototype = {
  onSpill: function(a) {
    var t = a.dragEl, l = a.putSortable, o = l || this.sortable;
    o.captureAnimationState(), t.parentNode && t.parentNode.removeChild(t), o.animateAll();
  },
  drop: ri
};
At(ao, {
  pluginName: "removeOnSpill"
});
$e.mount(new or());
$e.mount(ao, to);
function ir(e, a) {
  const t = e.oldDraggableIndex ?? e.oldIndex;
  e.item.remove();
  const l = [...e.from.children].filter((o) => o.matches(a));
  e.from.insertBefore(e.item, l[t ?? l.length] ?? null);
}
function di(e) {
  const a = /* @__PURE__ */ new Map();
  function t(l) {
    a.get(l)?.destroy(), a.delete(l);
  }
  return Et(() => {
    for (const l of a.keys()) t(l);
  }), {
    mounted(l) {
      const o = l.querySelector(".work-field-builder") ?? l;
      a.set(l, new $e(o, {
        draggable: ".work-reorder-entry",
        handle: ".work-reorder-handle",
        forceFallback: !0,
        fallbackOnBody: !1,
        ghostClass: "work-drag-ghost",
        onEnd(r) {
          const v = r.oldDraggableIndex, m = r.newDraggableIndex;
          ir(r, ".work-reorder-entry"), v !== void 0 && m !== void 0 && v !== m && e(v, m);
        }
      }));
    },
    unmounted: t
  };
}
const nr = { class: "work-stack work-tight work-option-builder" }, sr = { class: "work-stack work-tight" }, rr = { class: "work-stack work-tight work-small" }, dr = { class: "work-stack work-tight work-small" }, ur = { class: "work-stack work-tight" }, cr = { class: "work-stack work-tight work-small" }, vr = { class: "work-row" }, fr = { class: "work-stack work-tight work-small" }, mr = { class: "work-row" }, pr = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, gr = { class: "work-add-option" }, hr = {
  key: 0,
  class: "work-muted work-small"
}, br = /* @__PURE__ */ Se({
  __name: "OptionsEditor",
  props: {
    field: {}
  },
  emits: ["validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = "options:" + $t(), r = F(() => t.field.options ?? []), v = F(() => r.value.every((d, V) => !!d.id && r.value.findIndex((g) => g.id === d.id) === V));
    Ue(v, (d) => l("validity", d, o), { immediate: !0 }), Et(() => l("validity", !0, o));
    function m(d, V) {
      Bo(r.value, d, V - d), r.value.forEach((g, h) => g.order = h);
    }
    const b = di(m), i = ["primary", "success", "info", "warn", "danger", "secondary"];
    function u() {
      let d = r.value.length + 1;
      for (; r.value.some((V) => V.id === `option_${d}`); ) d++;
      (t.field.options ??= []).push({ id: `option_${d}`, label: "New option", order: r.value.length });
    }
    return (d, V) => (n(), f("section", nr, [
      V[4] || (V[4] = s("header", { class: "work-row" }, [
        s("h4", null, "Options"),
        s("span", { class: "work-muted work-small" }, "Renaming a choice keeps it selected on existing items."),
        s("span", { class: "work-spacer" })
      ], -1)),
      yt((n(), f("div", sr, [
        (n(!0), f(ee, null, fe(r.value, (g, h) => (n(), f("div", {
          key: h,
          class: "work-option-row work-reorder-entry"
        }, [
          k(c(ae), {
            type: "button",
            class: "work-icon-button work-reorder-handle",
            "aria-label": "Drag option; arrow keys reorder",
            onKeydown: [
              Je(Be((p) => m(h, h - 1), ["prevent"]), ["up"]),
              Je(Be((p) => m(h, h + 1), ["prevent"]), ["down"])
            ],
            severity: "secondary",
            text: "",
            size: "small"
          }, {
            default: q(() => [
              k(c(pe), {
                icon: "tabler:grip-vertical",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["onKeydown"]),
          s("label", rr, [
            V[0] || (V[0] = W("Label", -1)),
            k(c(Re), {
              modelValue: g.label,
              "onUpdate:modelValue": (p) => g.label = p,
              "aria-label": "Option label"
            }, null, 8, ["modelValue", "onUpdate:modelValue"])
          ]),
          k(je, {
            class: "work-disclosure",
            label: "Advanced"
          }, {
            default: q(() => [
              s("label", dr, [
                V[1] || (V[1] = W("Integration identifier", -1)),
                k(c(Re), {
                  modelValue: g.id,
                  "onUpdate:modelValue": (p) => g.id = p,
                  class: "work-option-code",
                  required: "",
                  "aria-label": "Option ID"
                }, null, 8, ["modelValue", "onUpdate:modelValue"])
              ])
            ]),
            _: 2
          }, 1024),
          s("div", ur, [
            s("label", cr, [
              V[2] || (V[2] = W("Color", -1)),
              s("span", vr, [
                s("span", {
                  class: pt(["work-color-swatch", "work-swatch-" + (g.color || "secondary")]),
                  "aria-hidden": "true"
                }, null, 2),
                k(c(he), {
                  modelValue: g.color,
                  "onUpdate:modelValue": (p) => g.color = p,
                  "aria-label": "Option color",
                  appendTo: "self",
                  optionLabel: "label",
                  optionValue: "value",
                  optionDisabled: "disabled",
                  options: [{ label: "Default", value: void 0, disabled: !1 }, ...(i ?? []).map((p) => ({ label: p, value: p, disabled: !1 }))]
                }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
              ])
            ]),
            s("label", fr, [
              V[3] || (V[3] = W("Category", -1)),
              k(c(he), {
                "model-value": g.category,
                "aria-label": "Option category",
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                showClear: "",
                options: ["triage", "backlog", ...c(Lo)].map((p) => ({ label: c(zt)(p), value: p })),
                "onUpdate:modelValue": (p) => g.category = p || void 0
              }, null, 8, ["model-value", "options", "onUpdate:modelValue"])
            ])
          ]),
          s("div", mr, [
            k(c(ae), {
              "aria-label": "Option earlier",
              severity: "secondary",
              size: "small",
              disabled: h === 0,
              onClick: (p) => m(h, h - 1),
              text: ""
            }, {
              default: q(() => [
                k(c(pe), {
                  icon: "tabler:arrow-up",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["disabled", "onClick"]),
            k(c(ae), {
              "aria-label": "Option later",
              severity: "secondary",
              size: "small",
              disabled: h === r.value.length - 1,
              onClick: (p) => m(h, h + 1),
              text: ""
            }, {
              default: q(() => [
                k(c(pe), {
                  icon: "tabler:arrow-down",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["disabled", "onClick"]),
            k(c(ae), {
              label: "Remove",
              "aria-label": "Remove option",
              severity: "secondary",
              text: "",
              size: "small",
              onClick: (p) => r.value.splice(h, 1)
            }, {
              icon: q(() => [
                k(c(pe), {
                  icon: "tabler:trash",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["onClick"])
          ])
        ]))), 128)),
        v.value ? C("", !0) : (n(), f("p", pr, "Each choice needs a unique integration identifier.")),
        s("div", gr, [
          k(c(ae), {
            label: "Add option",
            severity: "secondary",
            size: "small",
            onClick: u,
            outlined: ""
          }, {
            icon: q(() => [
              k(c(pe), {
                icon: "tabler:plus",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          })
        ])
      ])), [
        [c(b)]
      ]),
      r.value.length ? C("", !0) : (n(), f("p", hr, "Add the choices people can select for this field."))
    ]));
  }
}), yr = {
  class: "work-stack",
  "aria-label": "Fields editor"
}, kr = { class: "work-form-actions work-wrap" }, wr = { class: "work-stack work-tight" }, $r = {
  key: 0,
  class: "work-settings-card work-muted"
}, Vr = { class: "work-muted work-small" }, xr = {
  key: 0,
  class: "work-error work-small",
  role: "alert"
}, Cr = { class: "work-settings-grid work-field-properties" }, Sr = { class: "work-stack work-tight" }, Tr = { class: "work-stack work-tight" }, Ir = { class: "work-stack work-tight" }, Dr = {
  key: 1,
  class: "work-stack work-tight"
}, Ur = {
  key: 4,
  class: "work-stack work-tight"
}, Ar = {
  key: 5,
  class: "work-stack work-tight"
}, Er = { class: "work-stack work-tight" }, Rr = { class: "work-stack work-tight" }, Or = { class: "work-stack work-tight" }, Pr = { class: "work-stack work-tight" }, Nr = { class: "work-stack" }, Mr = { class: "work-stack work-tight" }, Fr = { class: "work-stack work-tight" }, Lr = { class: "work-stack work-tight work-field-history" }, Br = { class: "work-settings-list" }, zr = { class: "work-settings-row" }, jr = { class: "work-settings-row" }, qr = { class: "work-stack" }, Wr = /* @__PURE__ */ Se({
  __name: "FieldsEditor",
  props: {
    draft: {},
    guardRemoval: { type: Function },
    issues: {},
    boardId: {},
    installedTypes: {},
    itemType: {},
    createForItemType: { type: Boolean }
  },
  emits: ["validity", "update:itemType", "created", "cancel-creation"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = F(() => t.draft.fields ?? []), r = B("text"), v = B([]), m = F(() => (t.draft.item_types ?? []).map((H) => ({ value: H.id, label: H.title || Me(H.id) }))), b = F(() => t.draft.item_types?.find((H) => H.id === t.itemType)), i = F(() => o.value.map((H, j) => ({ field: H, index: j })).filter(({ field: H }) => !b.value || b.value.fields.includes(H.code))), u = B(""), d = B({}), V = di((H, j) => {
      const M = i.value[H]?.index, ce = i.value[j]?.index;
      M !== void 0 && ce !== void 0 && _(M, ce - M);
    });
    function g(H) {
      return (t.draft.item_types ?? []).filter((j) => j.fields.includes(H)).map((j) => j.title || Me(j.id));
    }
    async function h(H) {
      if (!u.value) {
        u.value = H.code;
        try {
          const j = await t.guardRemoval?.("fields", H.code);
          d.value[H.code] = j ?? "", j || Ra(t.draft, "fields", H.code);
        } finally {
          u.value = "";
        }
      }
    }
    const p = Object.entries({ text: "Text", int: "Whole number", dec: "Decimal number", quantity: "Measurement", bool: "Yes or no", time: "Date or time", ref: "Reference", record: "Structured data", option: "Choice", principal: "Person or group", item: "Work item", rank: "Order", rich_text: "Formatted text", formula: "Formula", rollup: "Related item calculation", counter: "Counter" }).map(([H, j]) => ({ value: H, label: j })), w = [{ label: "None", value: "none" }, { label: "Exact matches", value: "key" }, { label: "Numeric ranges", value: "number" }], x = ["int", "dec", "quantity"], $ = F(() => new Map(t.installedTypes?.map((H) => [H.id, H]))), T = F(() => [...p, ...(t.installedTypes ?? []).map((H) => ({ value: H.id, label: H.title }))]), D = {};
    function z(H) {
      return H.type && H.type !== "value" ? H.type : H.form ?? "text";
    }
    function le(H) {
      return H.type ? $.value.get(H.type) : void 0;
    }
    function Z(H) {
      const j = le(H)?.config_schema;
      return j && Qa(j).length ? j : void 0;
    }
    function ue(H) {
      const j = le(H);
      return !!j?.config_schema || ["dec", "quantity", "ref", "time", "record"].includes(j?.form ?? H.form ?? "") || !!H.config;
    }
    function me(H) {
      const j = le(H), M = j?.form ?? H.form ?? "text";
      return w.filter(({ value: ce }) => ce === "none" || (!j?.indexes || j.indexes.includes(ce)) && M !== "record" && (ce !== "number" || x.includes(M) || H.type === "option"));
    }
    function ge(H) {
      H.index && !me(H).some((j) => j.value === H.index) && delete H.index;
    }
    function be(H, j) {
      const M = $.value.get(j);
      if (M) {
        if (M.id === H.type) return;
        H.type = M.id, H.form = M.form, delete H.options, delete H.config, ge(H);
        return;
      }
      le(H) && delete H.config;
      const ce = { option: "text", principal: "ref", item: "ref", rank: "text", rich_text: "text", formula: "int", rollup: "int", counter: "int" };
      ce[j] ? (H.type = j, H.form = ce[j]) : (delete H.type, H.form = j), j !== "option" ? delete H.options : H.options ??= [], j === "rich_text" && (H.config = { format: "json" }), ge(H);
    }
    function se(H, j) {
      H.form = j, ge(H);
    }
    function R(H, j) {
      const M = { ...H.config };
      j ? M.item_type = j : delete M.item_type, H.config = Object.keys(M).length ? M : void 0;
    }
    function _(H, j) {
      Bo(o.value, H, j);
      for (const M of t.draft.item_types ?? []) {
        const ce = new Set(M.fields);
        M.fields = o.value.filter((y) => ce.has(y.code)).map((y) => y.code);
      }
    }
    function L(H, j) {
      try {
        Oi(t.draft, H, j.value), delete d.value[H.code];
      } catch (M) {
        d.value[H.code] = M.message, j.value = H.code;
      }
    }
    function ie() {
      r.value = "text", v.value = b.value ? [b.value.id] : [];
    }
    function xe(H) {
      const j = H.normalize("NFKD").replace(/\p{Mark}/gu, "").toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, ""), M = (/^[a-z]/.test(j) ? j : `field_${j || "new"}`).slice(0, 40);
      let ce = M, y = 2;
      for (; o.value.some((P) => P.code === ce); ) {
        const P = "_" + y++;
        ce = M.slice(0, 40 - P.length) + P;
      }
      const U = { code: ce, title: H, form: "text", cardinality: "one" };
      be(U, r.value), (t.draft.fields ??= []).push(U);
      for (const P of t.draft.item_types ?? []) v.value.includes(P.id) && P.fields.push(ce);
      b.value && !v.value.includes(b.value.id) && l("update:itemType", ""), Oe.value = ce, l("created");
    }
    const Oe = B("");
    return (H, j) => (n(), f("section", yr, [
      s("div", kr, [
        k(c(he), {
          "model-value": b.value?.id ?? "",
          "aria-label": "Filter fields by item type",
          placeholder: "All item types",
          appendTo: "self",
          optionLabel: "label",
          optionValue: "value",
          options: [{ value: "", label: "All item types" }, ...m.value],
          "onUpdate:modelValue": j[0] || (j[0] = (M) => l("update:itemType", M))
        }, null, 8, ["model-value", "options"]),
        k(Ua, {
          action: "Add field",
          label: "Field name",
          maxlength: 255,
          regular: "",
          "open-on-entry": e.createForItemType,
          onOpen: ie,
          onAdd: xe,
          onCancel: j[3] || (j[3] = (M) => l("cancel-creation"))
        }, {
          default: q(() => [
            s("label", wr, [
              j[5] || (j[5] = W("Kind", -1)),
              k(c(he), {
                modelValue: r.value,
                "onUpdate:modelValue": j[1] || (j[1] = (M) => r.value = M),
                "aria-label": "New field kind",
                appendTo: "self",
                options: T.value,
                optionLabel: "label",
                optionValue: "value"
              }, null, 8, ["modelValue", "options"])
            ]),
            m.value.length ? (n(), K(gt, {
              key: 0,
              label: "Show on item types",
              options: m.value,
              modelValue: v.value,
              "onUpdate:modelValue": j[2] || (j[2] = (M) => v.value = M)
            }, null, 8, ["options", "modelValue"])) : C("", !0)
          ]),
          _: 1
        }, 8, ["open-on-entry"])
      ]),
      i.value.length ? C("", !0) : (n(), f("p", $r, "No fields here yet. Add a field to capture information.")),
      yt((n(), K(Jl, {
        columns: "fields",
        count: i.value.length
      }, {
        default: q(() => [
          (n(!0), f(ee, null, fe(i.value, ({ field: M, index: ce }) => (n(), K(Xl, {
            "route-section": "fields",
            "route-id": M.code,
            title: c(Ze)(M),
            "initial-open": Oe.value === M.code,
            kind: le(M)?.title || c(p).find((y) => y.value === z(M))?.label || c(Me)(z(M)),
            key: M.id ?? ce,
            class: "work-field-row work-reorder-entry work-stack"
          }, {
            handle: q(() => [
              k(c(ae), {
                type: "button",
                class: "work-reorder-handle work-icon-button",
                "aria-label": "Drag " + c(Ze)(M) + " or use the arrow keys to reorder",
                onKeydown: [
                  Je(Be((y) => _(ce, -1), ["prevent"]), ["up"]),
                  Je(Be((y) => _(ce, 1), ["prevent"]), ["down"])
                ],
                severity: "secondary",
                text: "",
                size: "small"
              }, {
                default: q(() => [
                  k(c(pe), {
                    icon: "tabler:grip-vertical",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["aria-label", "onKeydown"])
            ]),
            flags: q(() => [
              M.track ? (n(), K(c(et), {
                key: 0,
                class: "kx-tag-sm",
                severity: "secondary",
                value: "Tracked"
              })) : C("", !0),
              M.intervals ? (n(), K(c(et), {
                key: 1,
                class: "kx-tag-sm",
                severity: "secondary",
                value: "Intervals"
              })) : C("", !0)
            ]),
            usage: q(() => [
              s("span", Vr, S(g(M.code).length ? g(M.code).join(", ") : "Unused"), 1)
            ]),
            actions: q(() => [
              k(c(ae), {
                "aria-label": "Move " + c(Ze)(M) + " earlier",
                severity: "secondary",
                disabled: ce === 0,
                onClick: (y) => _(ce, -1),
                text: "",
                size: "small"
              }, {
                default: q(() => [
                  k(c(pe), {
                    icon: "tabler:arrow-up",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["aria-label", "disabled", "onClick"]),
              k(c(ae), {
                "aria-label": "Move " + c(Ze)(M) + " later",
                severity: "secondary",
                disabled: ce === o.value.length - 1,
                onClick: (y) => _(ce, 1),
                text: "",
                size: "small"
              }, {
                default: q(() => [
                  k(c(pe), {
                    icon: "tabler:arrow-down",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["aria-label", "disabled", "onClick"])
            ]),
            default: q(() => [
              d.value[M.code] ? (n(), f("p", xr, S(d.value[M.code]), 1)) : C("", !0),
              (n(!0), f(ee, null, fe(e.issues?.filter((y) => y.code === M.code) ?? [], (y) => (n(), f("p", {
                key: y.what,
                class: "work-error work-small",
                role: "alert"
              }, S(c(nl)(y)), 1))), 128)),
              s("div", Cr, [
                s("label", Sr, [
                  j[6] || (j[6] = W("Title", -1)),
                  k(c(Re), {
                    modelValue: M.title,
                    "onUpdate:modelValue": (y) => M.title = y,
                    "aria-label": "Field title",
                    maxlength: "255",
                    placeholder: c(Ze)(M)
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder"])
                ]),
                s("label", Tr, [
                  j[7] || (j[7] = W("Kind", -1)),
                  k(c(he), {
                    "aria-label": "Kind",
                    "model-value": z(M),
                    "onUpdate:modelValue": (y) => be(M, y),
                    appendTo: "self",
                    options: T.value,
                    optionLabel: "label",
                    optionValue: "value"
                  }, null, 8, ["model-value", "onUpdate:modelValue", "options"])
                ]),
                s("label", Ir, [
                  j[8] || (j[8] = W("Values allowed", -1)),
                  k(c(he), {
                    "aria-label": "Values allowed",
                    "model-value": M.cardinality ?? "one",
                    "onUpdate:modelValue": (y) => M.cardinality = y,
                    appendTo: "self",
                    options: [{ label: "One value", value: "one" }, { label: "Multiple unique values", value: "set" }, { label: "Ordered values", value: "list" }],
                    optionLabel: "label",
                    optionValue: "value"
                  }, null, 8, ["model-value", "onUpdate:modelValue"])
                ])
              ]),
              M.type === "item" ? (n(), f("label", Dr, [
                j[9] || (j[9] = W("Which items can be referenced? ", -1)),
                k(c(he), {
                  "model-value": M.config?.item_type ?? "",
                  "aria-label": "Reference target",
                  appendTo: "self",
                  optionLabel: "label",
                  optionValue: "value",
                  options: [{ value: "", label: "Any item type" }, ...m.value],
                  "onUpdate:modelValue": (y) => R(M, y)
                }, null, 8, ["model-value", "options", "onUpdate:modelValue"]),
                j[10] || (j[10] = s("span", { class: "work-muted work-small" }, "A reference stores the selected item as a value. To show a named relationship on both items, use Links.", -1))
              ])) : C("", !0),
              Z(M) ? (n(), K(zo, {
                key: M.type,
                schema: Z(M),
                "model-value": M.config ?? D,
                "onUpdate:modelValue": (y) => M.config = y,
                onValidity: (y) => l("validity", "config-" + ce, y)
              }, null, 8, ["schema", "model-value", "onUpdate:modelValue", "onValidity"])) : C("", !0),
              M.type === "option" ? (n(), K(br, {
                key: 3,
                field: M,
                onValidity: j[4] || (j[4] = (y, U) => l("validity", U, y))
              }, null, 8, ["field"])) : C("", !0),
              M.type === "formula" || M.type === "rollup" ? (n(), f("label", Ur, [
                j[11] || (j[11] = W("Result type", -1)),
                k(c(he), {
                  "model-value": M.form,
                  "onUpdate:modelValue": (y) => se(M, y),
                  "aria-label": "Result type",
                  options: c(p).slice(0, 8),
                  optionLabel: "label",
                  optionValue: "value",
                  appendTo: "self"
                }, null, 8, ["model-value", "onUpdate:modelValue", "options"])
              ])) : C("", !0),
              M.type === "formula" ? (n(), f("label", Ar, [
                j[12] || (j[12] = W("Expression", -1)),
                k(c(Re), {
                  modelValue: M.expression,
                  "onUpdate:modelValue": (y) => M.expression = y,
                  "aria-label": "Expression"
                }, null, 8, ["modelValue", "onUpdate:modelValue"])
              ])) : C("", !0),
              M.type === "rollup" ? (n(), f(ee, { key: 6 }, [
                s("label", Er, [
                  j[13] || (j[13] = W("Of", -1)),
                  k(c(Re), {
                    modelValue: M.of,
                    "onUpdate:modelValue": (y) => M.of = y,
                    "aria-label": "Related items"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                s("label", Rr, [
                  j[14] || (j[14] = W("Function", -1)),
                  k(c(Re), {
                    modelValue: M.fn,
                    "onUpdate:modelValue": (y) => M.fn = y,
                    "aria-label": "Calculation"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                s("label", Or, [
                  j[15] || (j[15] = W("Field", -1)),
                  k(c(Re), {
                    modelValue: M.field,
                    "onUpdate:modelValue": (y) => M.field = y,
                    "aria-label": "Calculated field"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                s("label", Pr, [
                  j[16] || (j[16] = W("Order by", -1)),
                  k(c(he), {
                    "model-value": M.by,
                    "aria-label": "Rollup order",
                    options: ["rank", "time"],
                    showClear: "",
                    appendTo: "self",
                    "onUpdate:modelValue": (y) => M.by = y || void 0
                  }, null, 8, ["model-value", "onUpdate:modelValue"])
                ]),
                k(Zl, {
                  modelValue: M.where,
                  "onUpdate:modelValue": (y) => M.where = y,
                  draft: e.draft,
                  "board-id": e.boardId,
                  label: "Include related items when",
                  onValidity: (y) => l("validity", "rollup-" + ce, y)
                }, null, 8, ["modelValue", "onUpdate:modelValue", "draft", "board-id", "onValidity"])
              ], 64)) : C("", !0),
              k(je, {
                class: "work-disclosure",
                label: "Advanced field settings"
              }, {
                default: q(() => [
                  s("div", Nr, [
                    s("label", Mr, [
                      j[17] || (j[17] = W("Field identifier for integrations", -1)),
                      k(c(Re), {
                        value: M.code,
                        "aria-label": "Field code",
                        required: "",
                        pattern: "[a-z][a-z0-9_]*",
                        onInput: (y) => L(M, y.target)
                      }, null, 8, ["value", "onInput"])
                    ]),
                    s("label", Fr, [
                      j[18] || (j[18] = W("Allow filters to use", -1)),
                      k(c(he), {
                        "aria-label": "Allow filters to use",
                        "model-value": M.index ?? "none",
                        "onUpdate:modelValue": (y) => M.index = y,
                        appendTo: "self",
                        options: me(M),
                        optionLabel: "label",
                        optionValue: "value"
                      }, null, 8, ["model-value", "onUpdate:modelValue", "options"])
                    ]),
                    s("section", Lr, [
                      j[21] || (j[21] = s("h4", { class: "work-group-title" }, "History", -1)),
                      s("div", Br, [
                        s("div", zr, [
                          j[19] || (j[19] = s("div", { class: "work-row-main" }, [
                            s("strong", null, "Track changes"),
                            s("p", { class: "work-muted work-small" }, "Record each value change in the item history.")
                          ], -1)),
                          k(c(st), {
                            modelValue: M.track,
                            "onUpdate:modelValue": (y) => M.track = y,
                            "aria-label": "Track changes"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        s("div", jr, [
                          j[20] || (j[20] = s("div", { class: "work-row-main" }, [
                            s("strong", null, "Track intervals"),
                            s("p", { class: "work-muted work-small" }, "Measure how long each value stays in effect.")
                          ], -1)),
                          k(c(st), {
                            modelValue: M.intervals,
                            "onUpdate:modelValue": (y) => M.intervals = y,
                            "aria-label": "Track intervals"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ])
                      ])
                    ]),
                    !Z(M) && ue(M) ? (n(), K(Bt, {
                      key: 0,
                      label: "Field configuration",
                      "model-value": M.config,
                      shape: "object",
                      "onUpdate:modelValue": (y) => M.config = y,
                      onValidity: (y) => l("validity", "config-" + ce, y)
                    }, null, 8, ["model-value", "onUpdate:modelValue", "onValidity"])) : C("", !0),
                    s("section", qr, [
                      j[22] || (j[22] = s("h4", { class: "work-group-title" }, "Access", -1)),
                      (n(), f(ee, null, fe(["read", "write"], (y) => k(Yo, {
                        "board-id": e.boardId,
                        key: y,
                        label: y === "read" ? "Who can read" : "Who can edit",
                        "model-value": M.access?.[y],
                        "onUpdate:modelValue": (U) => M.access = { ...M.access, [y]: U },
                        onValidity: (U) => l("validity", "access-" + ce + y, U)
                      }, null, 8, ["board-id", "label", "model-value", "onUpdate:modelValue", "onValidity"])), 64))
                    ]),
                    k(c(ae), {
                      label: "Remove field",
                      severity: "danger",
                      text: "",
                      disabled: !!u.value,
                      onClick: (y) => h(M)
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
        [c(V)]
      ])
    ]));
  }
}), Gr = {
  class: "work-stack",
  "aria-label": "Item types editor"
}, Kr = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, Hr = { class: "work-definition-meta" }, Yr = { class: "work-settings-grid" }, Xr = { class: "work-stack work-tight" }, Jr = { class: "work-stack work-tight" }, Zr = {
  key: 0,
  class: "work-stack work-tight"
}, Qr = { key: 1 }, _r = { class: "work-stack work-tight" }, ed = { class: "work-stack" }, td = { class: "work-stack work-tight" }, ad = {
  key: 0,
  class: "work-row work-wrap"
}, ld = { class: "work-stack work-tight" }, od = {
  key: 1,
  class: "work-stack work-tight work-small"
}, id = {
  key: 0,
  class: "kx-empty"
}, nd = /* @__PURE__ */ Se({
  __name: "TypesEditor",
  props: {
    draft: {},
    guardRemoval: { type: Function },
    issues: {}
  },
  emits: ["create-field", "create-workflow"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = F(() => t.draft.item_types ?? []), r = B(""), v = B(""), m = B("");
    function b(w) {
      const x = w.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, ""), $ = /^[a-z]/.test(x) ? x : "type_" + (x || "new");
      let T = $.slice(0, 40), D = 2;
      for (; o.value.some((z) => z.id === T); ) {
        const z = "_" + D++;
        T = $.slice(0, 40 - z.length) + z;
      }
      return T;
    }
    function i(w) {
      const x = b(w);
      (t.draft.item_types ??= []).push({ id: x, title: w, process: t.draft.processes?.[0]?.id ?? "", fields: [] }), r.value = x;
    }
    function u(w, x) {
      const $ = w.id;
      w.id = x;
      for (const T of o.value) T.parent_types && (T.parent_types = T.parent_types.map((D) => D === $ ? x : D));
    }
    function d(w, x) {
      w.fields = x, w.inherit && (w.inherit = w.inherit.filter(($) => x.includes($)));
    }
    function V(w) {
      return (w.parent_types ?? []).filter((x) => typeof x == "string");
    }
    function g(w, x, $) {
      w.parent_types = $ && x.length ? [...x, !1] : x;
    }
    function h(w) {
      return o.value.filter((x) => x.id !== w.id && x.parent_types?.includes(w.id)).map((x) => x.title || Me(x.id));
    }
    async function p(w) {
      if (!m.value) {
        if (h(w).length) {
          v.value = `${w.title || Me(w.id)} is a parent type for ${h(w).join(", ")}. Remove those parent selections first.`;
          return;
        }
        m.value = w.id, v.value = "";
        try {
          const x = await t.guardRemoval?.("item_types", w.id);
          x ? v.value = x : Ra(t.draft, "item_types", w.id);
        } finally {
          m.value = "";
        }
      }
    }
    return (w, x) => (n(), f("section", Gr, [
      v.value ? (n(), f("p", Kr, S(v.value), 1)) : C("", !0),
      k(Jl, {
        columns: "types",
        count: o.value.length
      }, {
        default: q(() => [
          (n(!0), f(ee, null, fe(o.value, ($, T) => (n(), K(Xl, {
            "route-section": "items",
            "route-id": $.id,
            "initial-open": r.value === $.id,
            title: $.title || c(Me)($.id),
            "kind-label": "Workflow",
            kind: e.draft.processes?.find((D) => D.id === $.process)?.name || c(Me)($.process),
            key: T,
            class: "work-type-card"
          }, {
            usage: q(() => [
              s("span", Hr, [
                k(c(et), {
                  class: "kx-tag-sm",
                  severity: "secondary"
                }, {
                  default: q(() => [
                    W(S($.fields.length) + " " + S($.fields.length === 1 ? "field" : "fields"), 1)
                  ]),
                  _: 2
                }, 1024),
                h($).length ? (n(), K(c(et), {
                  key: 0,
                  class: "kx-tag-sm",
                  severity: "secondary"
                }, {
                  default: q(() => [
                    W("Parent of " + S(h($).join(", ")), 1)
                  ]),
                  _: 2
                }, 1024)) : C("", !0)
              ])
            ]),
            default: q(() => [
              (n(!0), f(ee, null, fe(e.issues?.filter((D) => D.code === "item_type " + $.id) ?? [], (D) => (n(), f("p", {
                key: D.what,
                class: "work-error work-small",
                role: "alert"
              }, S(c(nl)(D)), 1))), 128)),
              s("div", Yr, [
                s("label", Xr, [
                  x[0] || (x[0] = W("Title", -1)),
                  k(c(Re), {
                    modelValue: $.title,
                    "onUpdate:modelValue": (D) => $.title = D,
                    placeholder: c(Me)($.id)
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder"])
                ]),
                s("div", Jr, [
                  e.draft.processes?.length ? (n(), f("label", Zr, [
                    x[1] || (x[1] = W(" Workflow ", -1)),
                    k(c(he), {
                      modelValue: $.process,
                      "onUpdate:modelValue": (D) => $.process = D,
                      "aria-label": "Workflow",
                      required: "",
                      appendTo: "self",
                      optionLabel: "label",
                      optionValue: "value",
                      options: e.draft.processes.map((D) => ({ label: D.name || c(Me)(D.id), value: D.id }))
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                  ])) : (n(), f("span", Qr, "Workflow")),
                  s("div", null, [
                    k(c(ae), {
                      label: "Create a workflow",
                      type: "button",
                      text: "",
                      size: "small",
                      onClick: (D) => l("create-workflow", $, D)
                    }, null, 8, ["onClick"])
                  ])
                ])
              ]),
              s("div", _r, [
                k(gt, {
                  label: "Fields",
                  options: (e.draft.fields ?? []).map((D) => ({ value: D.code, label: c(Ze)(D) })),
                  "model-value": $.fields,
                  "onUpdate:modelValue": (D) => d($, D)
                }, null, 8, ["options", "model-value", "onUpdate:modelValue"]),
                s("div", null, [
                  k(c(ae), {
                    label: "Create a field",
                    type: "button",
                    text: "",
                    size: "small",
                    onClick: (D) => l("create-field", $, D)
                  }, null, 8, ["onClick"])
                ])
              ]),
              k(je, {
                class: "work-disclosure",
                label: "Advanced item type settings"
              }, {
                default: q(() => [
                  s("div", ed, [
                    s("label", td, [
                      x[2] || (x[2] = W("Identifier", -1)),
                      k(c(Re), {
                        value: $.id,
                        onChange: (D) => u($, D.target.value),
                        required: "",
                        pattern: "[a-z][a-z0-9_]*"
                      }, null, 8, ["value", "onChange"])
                    ]),
                    x[6] || (x[6] = W()),
                    k(gt, {
                      label: "Parent types",
                      options: o.value.map((D) => ({ value: D.id, label: D.title || c(Me)(D.id) })),
                      "model-value": V($),
                      "onUpdate:modelValue": (D) => g($, D, !!$.parent_types?.includes(!1))
                    }, null, 8, ["options", "model-value", "onUpdate:modelValue"]),
                    V($).length ? (n(), f("label", ad, [
                      k(c(st), {
                        "model-value": !!$.parent_types?.includes(!1),
                        "aria-label": "Allow top-level items",
                        "onUpdate:modelValue": (D) => g($, V($), D)
                      }, null, 8, ["model-value", "onUpdate:modelValue"]),
                      x[3] || (x[3] = W("Allow top-level items", -1))
                    ])) : C("", !0),
                    s("div", ld, [
                      k(gt, {
                        label: "Inherit from parent",
                        options: $.fields.map((D) => ({ value: D, label: c(Ze)(e.draft.fields?.find((z) => z.code === D) ?? { code: D }) })),
                        modelValue: $.inherit,
                        "onUpdate:modelValue": (D) => $.inherit = D
                      }, null, 8, ["options", "modelValue", "onUpdate:modelValue"]),
                      x[4] || (x[4] = s("p", { class: "work-muted work-small" }, "These fields resolve from the parent when this item has no own value.", -1))
                    ]),
                    V($).length ? (n(), f("label", od, [
                      x[5] || (x[5] = W("When the parent moves", -1)),
                      k(c(he), {
                        modelValue: $.move_children,
                        "onUpdate:modelValue": (D) => $.move_children = D,
                        "aria-label": "When the parent moves",
                        appendTo: "self",
                        optionLabel: "label",
                        optionValue: "value",
                        optionDisabled: "disabled",
                        options: [{ label: "Default", value: void 0, disabled: !1 }, { label: "Move children", value: "move", disabled: !1 }, { label: "Refuse while children exist", value: "refuse", disabled: !1 }]
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ])) : C("", !0),
                    k(c(ae), {
                      label: "Remove type",
                      severity: "danger",
                      text: "",
                      disabled: !!m.value,
                      onClick: (D) => p($)
                    }, null, 8, ["disabled", "onClick"])
                  ])
                ]),
                _: 2
              }, 1024)
            ]),
            _: 2
          }, 1032, ["route-id", "initial-open", "title", "kind"]))), 128)),
          o.value.length ? C("", !0) : (n(), f("p", id, "Add a type for the work people create, such as a delivery task or customer request.")),
          k(Ua, {
            action: "Add item type",
            label: "Item type name",
            onAdd: i
          })
        ]),
        _: 1
      }, 8, ["count"])
    ]));
  }
}), sd = ".work-process-canvas>svg{height:480px;width:100%}.work-process-canvas:focus-visible{outline:var(--p-focus-ring-width) var(--p-focus-ring-style) var(--p-focus-ring-color);outline-offset:var(--p-focus-ring-offset)}.work-state-card{fill:var(--p-content-background);stroke:var(--p-content-border-color);stroke-width:1.5}.work-graph-node.work-selected .work-state-card{stroke:var(--p-primary-color);stroke-width:2.5;fill:color-mix(in srgb,var(--p-primary-color) 6%,var(--p-content-background))}.work-graph-node:focus-visible .work-state-card{stroke:var(--p-focus-ring-color);stroke-width:var(--p-focus-ring-width)}.work-process-canvas .work-edge-label{font-size:12px;fill:var(--p-text-color)}.work-process-canvas .work-edge-label-bg{fill:var(--p-content-background);stroke:var(--p-content-border-color);stroke-width:1}.work-edge-line{stroke:var(--p-primary-color);stroke-width:1.5}.work-edge-return .work-edge-line{stroke:var(--p-text-muted-color);stroke-dasharray:5 4}.work-graph-arrow{fill:context-stroke}.work-lane-line{fill:none;stroke:var(--p-text-muted-color);stroke-width:1.5;stroke-dasharray:2 4}.work-node-connector{fill:var(--p-content-background);stroke:var(--p-primary-color);stroke-width:1.5}.work-node-connector:hover,.work-node-connector:focus-visible,.work-node-connector[aria-pressed=true]{fill:var(--p-primary-color)}.work-any-transition:focus-visible text,.work-any-transition[aria-pressed=true] text{fill:var(--p-primary-color);text-decoration:underline}.work-process-legend{position:static;flex-wrap:wrap;padding:10px 16px;border-top:1px solid var(--p-content-border-color);background:var(--p-content-background)}@media(max-width:700px){.work-process-canvas>svg{height:420px}}.work-process-more{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:8px;padding:8px 16px;border-top:1px solid var(--p-content-border-color);background:var(--p-content-background);color:var(--p-text-muted-color);font-size:12px}.work-process-canvas .work-graph-edge.work-selected .work-edge-label-bg{fill:var(--p-primary-color);stroke:var(--p-primary-color)}.work-process-canvas .work-graph-edge.work-selected .work-edge-label{fill:var(--p-primary-contrast-color)}", Co = /* @__PURE__ */ new WeakSet();
function rd(e) {
  const a = e.getRootNode();
  if (a instanceof ShadowRoot && !Co.has(a)) {
    const t = e.ownerDocument.createElement("style");
    t.textContent = sd, a.append(t), Co.add(a);
  }
}
const ui = 0.8;
function dd(e, a, t) {
  const l = Math.min(1, a.width / e.width, a.height / e.height);
  if (l >= ui) return { zoom: l, pan: { x: (e.width - a.width / l) / 2, y: (e.height - a.height / l) / 2 } };
  const o = e.nodes.find((v) => v.state.id === t) ?? e.nodes[0], r = Math.min(1, a.width / ((o?.width ?? 190) + 64));
  return { zoom: r, pan: o ? { x: e.direction === "TB" ? o.x - a.width / r / 2 : o.x - o.width / 2 - 32, y: e.direction === "TB" ? o.y - o.height / 2 - 32 : o.y - a.height / r / 2 } : { x: 0, y: 0 } };
}
const ud = ["onKeydown"], cd = {
  key: 0,
  class: "work-process-instruction",
  role: "status"
}, vd = ["viewBox"], fd = ["id"], md = ["d", "marker-end"], pd = ["aria-label", "aria-pressed", "aria-keyshortcuts", "onKeydown", "onFocus", "onClick"], gd = ["d"], hd = ["d", "marker-end"], bd = ["x", "y", "width", "height"], yd = ["x", "y"], kd = ["x", "dy"], wd = ["aria-label", "aria-pressed", "onClick", "onKeydown", "onFocus", "onPointerup"], $d = ["x", "y", "width", "height"], Vd = ["cx", "cy"], xd = ["x", "y"], Cd = ["x", "dy"], Sd = ["x", "y"], Td = ["x", "dy"], Id = {
  key: 0,
  class: "work-limit-text"
}, Dd = ["aria-label", "aria-pressed", "aria-keyshortcuts", "onFocus", "onKeydown", "onClick"], Ud = ["x", "y"], Ad = ["x", "dy"], Ed = ["cx", "cy", "aria-label", "aria-pressed", "onFocus", "onPointerdown", "onClick", "onKeydown"], Rd = ["d"], Od = {
  key: 1,
  class: "work-process-more",
  role: "status"
}, Pd = { class: "work-process-legend" }, Nd = /* @__PURE__ */ Se({
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
    const l = e, o = t, r = $t().replace(/:/g, "_"), v = B(""), m = B(), b = B();
    let i;
    const u = B(900), d = B(!1), V = F(() => u.value < 700 ? 420 : 480), g = F(() => en(l.process, l.draft, {
      width: u.value,
      height: V.value,
      direction: l.fitOnOpen ? "TB" : void 0
    })), h = B(1), p = B({ x: 0, y: 0 }), w = B({ x: 0, y: 0 }), x = F(() => {
      const I = Math.min(1, u.value / g.value.width);
      return l.fitOnOpen ? Math.max(ui, I) : I;
    }), $ = F(() => ({
      width: u.value,
      height: d.value ? Math.max(V.value, Math.ceil(g.value.height * x.value)) : V.value
    })), T = F(() => g.value.nodes.filter((I) => I.x - I.width / 2 >= p.value.x && I.x + I.width / 2 <= p.value.x + $.value.width / h.value && I.y - I.height / 2 >= p.value.y && I.y + I.height / 2 <= p.value.y + $.value.height / h.value).length);
    function D() {
      d.value = !1;
      const I = dd(g.value, $.value, l.process.initial);
      h.value = I.zoom, p.value = I.pan;
    }
    const z = F(() => `${p.value.x} ${p.value.y} ${$.value.width / h.value} ${$.value.height / h.value}`), le = F(() => g.value.nodes.find((I) => I.state.id === v.value));
    function Z() {
      d.value = !0, h.value = x.value;
      const I = $.value.width / h.value, Q = g.value.nodes.find((E) => E.state.id === l.process.initial);
      p.value = {
        x: g.value.width > I && Q ? Q.x - I / 2 : (g.value.width - I) / 2,
        y: 0
      };
    }
    function ue(I) {
      l.fitOnOpen && (d.value = !1);
      const Q = Math.max(0.02, Math.min(3, h.value * I)), E = 1 / h.value - 1 / Q;
      p.value = { x: p.value.x + $.value.width * E / 2, y: p.value.y + $.value.height * E / 2 }, h.value = Q;
    }
    function me(I) {
      const Q = $.value.width / h.value, E = $.value.height / h.value;
      (I.x - I.width / 2 < p.value.x || I.x + I.width / 2 > p.value.x + Q || I.y - I.height / 2 < p.value.y || I.y + I.height / 2 > p.value.y + E) && (p.value = { x: I.x - Q / 2, y: I.y - E / 2 });
    }
    function ge() {
      const I = g.value.nodes.find((Q) => Q.state === l.selectedState) ?? g.value.edges.find((Q) => Q.transition === l.selectedTransition);
      if (!I) {
        l.fitOnOpen && d.value && Z();
        return;
      }
      me(I);
    }
    Ue([g, () => l.selectedState, () => l.selectedTransition], ge, { flush: "post" });
    function be() {
      l.fitOnOpen ? Z() : D();
    }
    Ue(() => l.process.id, () => {
      H(), be();
    }, { flush: "post" });
    function se(I) {
      if (I.target !== m.value) return;
      (I.key === "+" || I.key === "=") && (I.preventDefault(), ue(1.2)), I.key === "-" && (I.preventDefault(), ue(1 / 1.2)), I.key === "0" && (I.preventDefault(), Z());
      const Q = 60 / h.value;
      I.key.startsWith("Arrow") && (I.preventDefault(), p.value = { x: p.value.x + (I.key === "ArrowRight" ? Q : I.key === "ArrowLeft" ? -Q : 0), y: p.value.y + (I.key === "ArrowDown" ? Q : I.key === "ArrowUp" ? -Q : 0) });
    }
    function R(I, Q) {
      const E = Q.currentTarget;
      if (!v.value) o("state", I, E);
      else if (v.value !== I.id) {
        const oe = v.value;
        v.value = "", o("connect", oe, I.id, E);
      }
    }
    function _(I) {
      v.value = I.state.id, w.value = { x: g.value.direction === "TB" ? I.x : I.x + I.width / 2, y: g.value.direction === "TB" ? I.y + I.height / 2 : I.y };
    }
    function L(I, Q) {
      if (I.pointerType === "touch" || I.button !== 0) return;
      i = I.pointerId, _(Q);
      const E = I.currentTarget;
      E.hasPointerCapture?.(I.pointerId) && E.releasePointerCapture(I.pointerId);
    }
    function ie(I, Q) {
      i === I.pointerId && (i = void 0, !(!v.value || v.value === Q.id) && R(Q, I));
    }
    function xe(I, Q) {
      if ((I.key === "Enter" || I.key === " ") && (I.preventDefault(), R(Q, I)), ["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp"].includes(I.key)) {
        I.preventDefault();
        const E = Array.from(b.value?.querySelectorAll(".work-graph-node") ?? []), oe = g.value.nodes.findIndex((Pe) => Pe.state === Q), Ve = ["ArrowRight", "ArrowDown"].includes(I.key) ? 1 : -1;
        E[(oe + Ve + E.length) % E.length]?.focus();
      }
    }
    function Oe(I, Q) {
      l.selectedTransition === Q && o("removeTransition", I);
    }
    function H() {
      v.value = "", i = void 0, M.clear(), ce = 0;
    }
    function j() {
      H(), o("clear");
    }
    const M = /* @__PURE__ */ new Map();
    let ce = 0;
    function y(I) {
      if (!I.target.closest('[role="button"]') && (M.set(I.pointerId, { x: I.clientX, y: I.clientY }), m.value?.setPointerCapture?.(I.pointerId), M.size === 2)) {
        const [Q, E] = [...M.values()];
        ce = Math.hypot(Q.x - E.x, Q.y - E.y);
      }
    }
    function U(I) {
      const Q = b.value?.getBoundingClientRect();
      if (!Q?.width) return;
      if (i === I.pointerId && v.value) {
        w.value = { x: p.value.x + (I.clientX - Q.left) * $.value.width / h.value / Q.width, y: p.value.y + (I.clientY - Q.top) * $.value.height / h.value / Q.height };
        return;
      }
      const E = M.get(I.pointerId);
      if (E)
        if (M.set(I.pointerId, { x: I.clientX, y: I.clientY }), M.size === 2) {
          const [oe, Ve] = [...M.values()], Pe = Math.hypot(oe.x - Ve.x, oe.y - Ve.y);
          ce && ue(Pe / ce), ce = Pe;
        } else p.value = { x: p.value.x - (I.clientX - E.x) * $.value.width / h.value / Q.width, y: p.value.y - (I.clientY - E.y) * $.value.height / h.value / Q.height };
    }
    function P(I) {
      i === I.pointerId && (v.value = "", i = void 0);
    }
    function A(I) {
      M.delete(I.pointerId), ce = 0, P(I);
    }
    function G(I) {
      I.ctrlKey && (I.preventDefault(), ue(Math.exp(-I.deltaY * 0.01)));
    }
    let re;
    Ea(() => {
      if (m.value && rd(m.value), typeof ResizeObserver < "u" && b.value) {
        let I = !0;
        re = new ResizeObserver(() => {
          const Q = b.value?.getBoundingClientRect();
          if (!Q?.width || !Q.height) return;
          const E = $.value.width;
          u.value = Q.width, (I || Math.abs(Q.width - E) > 1) && (I ? be() : d.value ? Z() : D(), I = !1), ge();
        }), re.observe(b.value);
      }
    }), Et(() => re?.disconnect()), a({ fit: Z, focus: () => m.value?.focus(), zoomIn: () => ue(1.2), zoomOut: () => ue(1 / 1.2) });
    function te(I) {
      return I.category === "completed" ? "check" : I.category === "canceled" ? "x" : I.id === l.process.initial ? "arrow-bar-to-right" : { gate: "shield-check", automated: "bolt", parallel: "arrows-split" }[I.kind ?? ""] ?? "user";
    }
    return (I, Q) => (n(), f("section", {
      ref_key: "canvas",
      ref: m,
      class: pt(["work-process-canvas", { "work-process-scrollable": e.fitOnOpen && d.value }]),
      "aria-label": "Process map",
      tabindex: "0",
      onKeydown: [
        se,
        Je(Be(j, ["stop"]), ["esc"])
      ],
      onPointerdown: y,
      onPointermove: U,
      onPointerup: A,
      onPointerleave: P,
      onPointercancel: H,
      onWheel: G
    }, [
      v.value ? (n(), f("p", cd, "Choose the next stop. Escape cancels.")) : C("", !0),
      (n(), f("svg", {
        ref_key: "svg",
        ref: b,
        style: Si({ height: $.value.height + "px" }),
        viewBox: z.value,
        role: "group",
        "aria-label": "States and transitions"
      }, [
        s("defs", null, [
          s("marker", {
            id: c(r) + "-arrow",
            viewBox: "0 0 8 8",
            refX: "7",
            refY: "4",
            markerWidth: "6",
            markerHeight: "6",
            orient: "auto"
          }, [...Q[1] || (Q[1] = [
            s("path", {
              d: "M0 0 L8 4 L0 8 z",
              class: "work-graph-arrow"
            }, null, -1)
          ])], 8, fd)
        ]),
        (n(!0), f(ee, null, fe(g.value.parallels, (E) => (n(), f("path", {
          key: E.key,
          d: E.path,
          class: "work-lane-line",
          "marker-end": `url(#${c(r)}-arrow)`
        }, [
          s("title", null, "Parallel lane from " + S(c(ke)(E.state)), 1)
        ], 8, md))), 128)),
        (n(!0), f(ee, null, fe(g.value.edges, (E) => (n(), f("g", {
          key: E.key,
          class: pt(["work-graph-edge", ["work-edge-" + E.type, { "work-selected": e.selectedTransition === E.transition }]]),
          role: "button",
          tabindex: "0",
          "aria-label": "Edit transition " + c(Xe)(E.transition),
          "aria-pressed": e.selectedTransition === E.transition,
          "aria-keyshortcuts": e.selectedTransition === E.transition ? "Delete Backspace" : void 0,
          onKeydown: [
            Je((oe) => Oe(oe, E.transition), ["delete"]),
            Je((oe) => Oe(oe, E.transition), ["backspace"]),
            Je(Be((oe) => o("transition", E.transition, oe.currentTarget), ["prevent"]), ["enter"]),
            Je(Be((oe) => o("transition", E.transition, oe.currentTarget), ["prevent"]), ["space"])
          ],
          onFocus: (oe) => me(E),
          onClick: (oe) => o("transition", E.transition, oe.currentTarget)
        }, [
          s("path", {
            d: E.path,
            class: "work-edge-hit"
          }, null, 8, gd),
          s("path", {
            d: E.path,
            class: "work-edge-line",
            "marker-end": `url(#${c(r)}-arrow)`
          }, null, 8, hd),
          s("rect", {
            x: E.x - E.width / 2,
            y: E.y - E.height / 2,
            width: E.width,
            height: E.height,
            rx: "6",
            class: "work-edge-label-bg"
          }, null, 8, bd),
          s("text", {
            x: E.x,
            y: E.y - (E.lines.length - 1) * 8 + 4,
            class: "work-edge-label",
            "text-anchor": "middle"
          }, [
            (n(!0), f(ee, null, fe(E.lines, (oe, Ve) => (n(), f("tspan", {
              key: Ve,
              x: E.x,
              dy: Ve ? 16 : 0
            }, S(oe), 9, kd))), 128))
          ], 8, yd)
        ], 42, pd))), 128)),
        (n(!0), f(ee, null, fe(g.value.nodes, (E) => (n(), f("g", {
          key: E.state.id,
          class: pt(["work-graph-node", ["work-stop-" + E.state.category, { "work-selected": e.selectedState === E.state }]]),
          role: "button",
          tabindex: "0",
          "aria-label": "Edit state " + c(ke)(E.state),
          "aria-pressed": e.selectedState === E.state,
          onClick: (oe) => R(E.state, oe),
          onKeydown: (oe) => xe(oe, E.state),
          onFocus: (oe) => me(E),
          onPointerup: (oe) => ie(oe, E.state)
        }, [
          s("rect", {
            x: E.x - E.width / 2,
            y: E.y - E.height / 2,
            width: E.width,
            height: E.height,
            rx: "10",
            class: "work-state-card"
          }, null, 8, $d),
          s("circle", {
            cx: E.x - E.width / 2 + 22,
            cy: E.y - E.height / 2 + 25,
            r: "10",
            class: "work-stop-ring"
          }, null, 8, Vd),
          k(c(pe), {
            icon: "tabler:" + te(E.state),
            x: E.x - E.width / 2 + 15,
            y: E.y - E.height / 2 + 18,
            width: "14",
            height: "14",
            class: "work-stop-icon",
            "aria-hidden": "true"
          }, null, 8, ["icon", "x", "y"]),
          s("text", {
            x: E.x - E.width / 2 + 42,
            y: E.y - E.height / 2 + 29,
            class: "work-node-name"
          }, [
            (n(!0), f(ee, null, fe(E.title, (oe, Ve) => (n(), f("tspan", {
              key: Ve,
              x: E.x - E.width / 2 + 42,
              dy: Ve ? 18 : 0
            }, S(oe), 9, Cd))), 128))
          ], 8, xd),
          s("text", {
            x: E.x - E.width / 2 + 16,
            y: E.y - E.height / 2 + 33 + E.title.length * 18,
            class: "work-node-meta"
          }, [
            (n(!0), f(ee, null, fe(E.caption, (oe, Ve) => (n(), f("tspan", {
              key: Ve,
              x: E.x - E.width / 2 + 16,
              dy: Ve ? 16 : 0
            }, S(oe), 9, Td))), 128)),
            e.draft.policy?.wip?.[E.state.id] ? (n(), f("tspan", Id, " · limit " + S(e.draft.policy.wip[E.state.id].limit), 1)) : C("", !0)
          ], 8, Sd),
          (n(!0), f(ee, null, fe(E.badges, (oe, Ve) => (n(), f("g", {
            key: oe.id,
            class: "work-any-transition",
            role: "button",
            tabindex: "0",
            "aria-label": "Edit transition " + c(Xe)(oe),
            "aria-pressed": e.selectedTransition === oe,
            "aria-keyshortcuts": e.selectedTransition === oe ? "Delete Backspace" : void 0,
            onFocus: (Pe) => me(E),
            onKeydown: [
              Je((Pe) => Oe(Pe, oe), ["delete"]),
              Je((Pe) => Oe(Pe, oe), ["backspace"]),
              Je(Be((Pe) => o("transition", oe, Pe.currentTarget), ["stop", "prevent"]), ["enter"]),
              Je(Be((Pe) => o("transition", oe, Pe.currentTarget), ["stop", "prevent"]), ["space"])
            ],
            onClick: Be((Pe) => o("transition", oe, Pe.currentTarget), ["stop"])
          }, [
            s("text", {
              x: E.x - E.width / 2 + 16,
              y: E.y - E.height / 2 + 33 + E.title.length * 18 + E.caption.length * 16 + E.badges.slice(0, Ve).reduce((Pe, O) => Pe + c(ra)(c(Xe)(O) + " works from any state").length * 18, 0),
              class: "work-node-meta"
            }, [
              (n(!0), f(ee, null, fe(c(ra)(c(Xe)(oe) + " works from any state"), (Pe, O) => (n(), f("tspan", {
                key: O,
                x: E.x - E.width / 2 + 16,
                dy: O ? 18 : 0
              }, S(Pe), 9, Ad))), 128))
            ], 8, Ud)
          ], 40, Dd))), 128)),
          ["completed", "canceled"].includes(E.state.category) ? C("", !0) : (n(), f("circle", {
            key: 0,
            cx: g.value.direction === "TB" ? E.x : E.x + E.width / 2,
            cy: g.value.direction === "TB" ? E.y + E.height / 2 : E.y,
            r: "9",
            class: "work-node-connector",
            role: "button",
            tabindex: "0",
            "aria-label": "Connect from " + c(ke)(E.state),
            "aria-pressed": v.value === E.state.id,
            onFocus: (oe) => me(E),
            onPointerdown: Be((oe) => L(oe, E), ["stop"]),
            onClick: Be((oe) => _(E), ["stop"]),
            onKeydown: [
              Je(Be((oe) => _(E), ["stop", "prevent"]), ["enter"]),
              Je(Be((oe) => _(E), ["stop", "prevent"]), ["space"])
            ]
          }, null, 40, Ed))
        ], 42, wd))), 128)),
        le.value ? (n(), f("path", {
          key: 0,
          d: `M ${g.value.direction === "TB" ? le.value.x : le.value.x + le.value.width / 2} ${g.value.direction === "TB" ? le.value.y + le.value.height / 2 : le.value.y} L ${w.value.x} ${w.value.y}`,
          class: "work-connect-ghost"
        }, null, 8, Rd)) : C("", !0)
      ], 12, vd)),
      T.value < e.process.states.length ? (n(), f("div", Od, [
        s("span", null, S(T.value) + " of " + S(e.process.states.length) + " states in view · Pan to see more", 1),
        d.value ? C("", !0) : (n(), K(c(ae), {
          key: 0,
          label: "Fit map",
          size: "small",
          text: "",
          onClick: Q[0] || (Q[0] = (E) => Z())
        }))
      ])) : C("", !0),
      s("div", Pd, [
        s("span", null, S(e.process.states.length) + " states · " + S(Math.round(h.value * 100)) + "%", 1),
        Q[2] || (Q[2] = s("span", null, [
          s("i"),
          W("Transition")
        ], -1)),
        Q[3] || (Q[3] = s("span", null, [
          s("i", { class: "work-return-key" }),
          W("Return / loop")
        ], -1)),
        Q[4] || (Q[4] = s("span", null, "Drag to pan · Ctrl + scroll to zoom · Fit to reset the view", -1))
      ])
    ], 42, ud));
  }
}), Bl = new Intl.ListFormat("en", { type: "conjunction" }), Md = new Intl.ListFormat("en", { type: "disjunction" }), Fd = {
  eq: "is",
  neq: "is different from",
  in: "is one of",
  nin: "is none of",
  lt: "is less than",
  lte: "is at most",
  gt: "is greater than",
  gte: "is at least",
  between: "is between",
  has: "includes",
  contains: "contains",
  starts_with: "starts with",
  member_of: "belongs to"
}, Ld = { some: "At least one", every: "Every", none: "No" };
function zl(e, a) {
  const t = a.fields?.find((l) => l.code === e);
  return t ? Ze(t) : Me(e);
}
function jl(e, a, t) {
  return Array.isArray(e) ? Bl.format(e.map((l) => jl(l, a, t))) : a === "category" && typeof e == "string" ? zt(e) : a === "state" && typeof e == "string" ? t.processes?.flatMap((l) => l.states).find((l) => l.id === e)?.name || Me(e) : "$actor" in ct(e) ? "the person moving the item" : "$now" in ct(e) ? "the current time" : Xt(e, t.fields?.find((l) => l.code === a));
}
function Bd(e) {
  const a = ct(e.where);
  if (!(e.rel !== "blocks" || e.dir !== "inward" || a.field !== "category" || a.op !== "nin" || !Array.isArray(a.value) || a.value.length !== 2 || !a.value.includes("completed") || !a.value.includes("canceled"))) {
    if (e.q === "none") return "Requires all blockers to be resolved.";
    if (e.q === "some") return "Requires an open blocker.";
  }
}
function Za(e, a) {
  const t = ct(e), l = (r) => r.map((v) => Za(v, a)), o = a.relation_types?.find((r) => r.id === t.rel);
  if (Array.isArray(t.and) && t.and.length) return `(${Bl.format(l(t.and))})`;
  if (Array.isArray(t.or) && t.or.length) return `(${Md.format(l(t.or))})`;
  if (t.not) return `this condition is false (${Za(t.not, a)})`;
  if (typeof t.match == "string" && t.match.trim()) return `the item matches “${t.match}”`;
  if (typeof t.rel == "string" || t.children) {
    const r = t.dir === "inward" && !o?.symmetric ? o?.inward : o?.outward, v = t.children ? "child item" : `item linked as “${r || Me(String(t.rel))}”`;
    return `${Ld[String(t.q)] ?? "At least one"} ${v} matches (${Za(t.where, a)})`;
  }
  if (t.history) {
    const r = ct(t.history);
    if (typeof r.field != "string") return "a value history condition";
    const v = zl(r.field, a), m = (i) => jl(i, String(r.field), a), b = Array.isArray(r.during) ? ` during ${Bl.format(r.during.map((i) => String(i)))}` : "";
    if (r.changed === !0) {
      const i = r.from === void 0 ? "" : ` from ${m(r.from)}`, u = r.to === void 0 ? "" : ` to ${m(r.to)}`;
      return `${v} changed${i}${u}${b}`;
    }
    return r.was !== void 0 ? `${v} was ${m(r.was)}${b}` : `a change in the history of ${v}${b}`;
  }
  if (typeof t.field == "string") {
    const r = zl(t.field, a);
    if (t.op === "is_null") return `${r} is ${t.value === !1 ? "filled" : "empty"}`;
    if (t.op === "is_state") {
      const m = { absent: "has never been filled", cleared: "was cleared", provided: "has a value" }[String(t.value)];
      if (m) return `${r} ${m}`;
    }
    const v = Fd[String(t.op)];
    return v && t.value !== void 0 ? `${r} ${v} ${jl(t.value, t.field, a)}` : `a condition on ${r}`;
  }
  return "a custom condition";
}
function zd(e, a, t, l = []) {
  const o = [], r = a.states.find((m) => m.id === e.to), v = [.../* @__PURE__ */ new Set([...e.require ?? [], ...r?.require ?? []])];
  v.length && o.push(`Required: ${v.map((m) => zl(m, t)).join(", ")}`), e.when != null && o.push(Bd(ct(e.when)) ?? `Only when ${Za(e.when, t)}`);
  for (const m of e.guards ?? []) {
    const b = l.find((i) => i.id === m);
    o.push(b ? `Requires the “${b.title}” check to pass` : "Requires an unavailable check to pass");
  }
  return o;
}
const jd = {
  key: 0,
  class: "work-stack work-tight work-muted work-small"
}, ci = /* @__PURE__ */ Se({
  __name: "TransitionRules",
  props: {
    transition: {},
    process: {},
    draft: {},
    guards: {}
  },
  setup(e) {
    const a = e, t = F(() => zd(a.transition, a.process, a.draft, a.guards));
    return (l, o) => t.value.length ? (n(), f("div", jd, [
      (n(!0), f(ee, null, fe(t.value, (r, v) => (n(), f("p", { key: v }, S(r), 1))), 128))
    ])) : C("", !0);
  }
}), qd = {
  class: "work-process-list work-stack",
  "aria-label": "Process list"
}, Wd = { class: "work-table-scroll" }, Gd = {
  class: "work-settings-table work-process-table",
  role: "table",
  "aria-label": "States"
}, Kd = { role: "rowgroup" }, Hd = ["aria-selected"], Yd = { role: "cell" }, Xd = {
  key: 0,
  class: "work-muted work-small"
}, Jd = { role: "cell" }, Zd = { role: "cell" }, Qd = {
  role: "cell",
  class: "work-process-list-actions"
}, _d = { class: "work-table-scroll" }, eu = {
  class: "work-settings-table work-process-table",
  role: "table",
  "aria-label": "Transitions"
}, tu = { role: "rowgroup" }, au = ["aria-selected"], lu = { role: "cell" }, ou = { role: "cell" }, iu = { role: "cell" }, nu = {
  role: "cell",
  class: "work-process-list-actions"
}, su = /* @__PURE__ */ Se({
  __name: "ProcessList",
  props: {
    process: {},
    draft: {},
    guards: {},
    selectedState: {},
    selectedTransition: {},
    counts: {}
  },
  emits: ["state", "transition", "removeState", "removeTransition"],
  setup(e) {
    return (a, t) => (n(), f("section", qd, [
      t[6] || (t[6] = s("h3", null, "States", -1)),
      s("div", Wd, [
        s("table", Gd, [
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
          s("tbody", Kd, [
            (n(!0), f(ee, null, fe(e.process.states, (l) => (n(), f("tr", {
              key: l.id,
              "aria-selected": e.selectedState === l,
              role: "row"
            }, [
              s("td", Yd, [
                k(c(Re), {
                  modelValue: l.name,
                  "onUpdate:modelValue": (o) => l.name = o,
                  "aria-label": "Name of " + c(ke)(l)
                }, null, 8, ["modelValue", "onUpdate:modelValue", "aria-label"]),
                e.counts ? (n(), f("p", Xd, S(e.counts[l.id] ?? 0) + " here", 1)) : C("", !0)
              ]),
              s("td", Jd, [
                t[0] || (t[0] = s("span", {
                  class: "work-process-cell-label",
                  "aria-hidden": "true"
                }, "Phase", -1)),
                W(S(c(zt)(l.category)), 1)
              ]),
              s("td", Zd, [
                t[1] || (t[1] = s("span", {
                  class: "work-process-cell-label",
                  "aria-hidden": "true"
                }, "Kind", -1)),
                k(c(et), { severity: "secondary" }, {
                  default: q(() => [
                    W(S(c(_a)(l.kind)), 1)
                  ]),
                  _: 2
                }, 1024)
              ]),
              s("td", Qd, [
                k(c(ae), {
                  size: "small",
                  text: "",
                  severity: "secondary",
                  "aria-label": "Edit state " + c(ke)(l),
                  onClick: (o) => a.$emit("state", l, o.currentTarget)
                }, {
                  default: q(() => [
                    k(c(pe), { icon: "tabler:pencil" })
                  ]),
                  _: 1
                }, 8, ["aria-label", "onClick"]),
                k(c(ae), {
                  size: "small",
                  text: "",
                  severity: "danger",
                  "aria-label": "Remove state " + c(ke)(l),
                  onClick: (o) => a.$emit("removeState", l)
                }, {
                  default: q(() => [
                    k(c(pe), { icon: "tabler:trash" })
                  ]),
                  _: 1
                }, 8, ["aria-label", "onClick"])
              ])
            ], 8, Hd))), 128))
          ])
        ])
      ]),
      t[7] || (t[7] = s("h3", null, "Transitions", -1)),
      s("div", _d, [
        s("table", eu, [
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
          s("tbody", tu, [
            (n(!0), f(ee, null, fe(e.process.transitions ?? [], (l) => (n(), f("tr", {
              key: l.id,
              "aria-selected": e.selectedTransition === l,
              role: "row"
            }, [
              s("td", lu, [
                k(c(Re), {
                  modelValue: l.name,
                  "onUpdate:modelValue": (o) => l.name = o,
                  placeholder: c(Xe)(l),
                  "aria-label": "Name of " + c(Xe)(l)
                }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder", "aria-label"]),
                k(ci, {
                  transition: l,
                  process: e.process,
                  draft: e.draft,
                  guards: e.guards
                }, null, 8, ["transition", "process", "draft", "guards"])
              ]),
              s("td", ou, [
                t[3] || (t[3] = s("span", {
                  class: "work-process-cell-label",
                  "aria-hidden": "true"
                }, "From", -1)),
                W(" " + S(l.from === "any" ? "Any state" : l.from.map((o) => c(ke)(e.process.states.find((r) => r.id === o))).join(", ")), 1)
              ]),
              s("td", iu, [
                t[4] || (t[4] = s("span", {
                  class: "work-process-cell-label",
                  "aria-hidden": "true"
                }, "To", -1)),
                W(S(c(ke)(e.process.states.find((o) => o.id === l.to))), 1)
              ]),
              s("td", nu, [
                k(c(ae), {
                  size: "small",
                  text: "",
                  severity: "secondary",
                  "aria-label": "Edit transition " + c(Xe)(l),
                  onClick: (o) => a.$emit("transition", l, o.currentTarget)
                }, {
                  default: q(() => [
                    k(c(pe), { icon: "tabler:pencil" })
                  ]),
                  _: 1
                }, 8, ["aria-label", "onClick"]),
                k(c(ae), {
                  size: "small",
                  text: "",
                  severity: "danger",
                  "aria-label": "Remove transition " + c(Xe)(l),
                  onClick: (o) => a.$emit("removeTransition", l)
                }, {
                  default: q(() => [
                    k(c(pe), { icon: "tabler:trash" })
                  ]),
                  _: 1
                }, 8, ["aria-label", "onClick"])
              ])
            ], 8, au))), 128))
          ])
        ])
      ])
    ]));
  }
}), So = /* @__PURE__ */ Se({
  __name: "CapacityControl",
  props: {
    draft: {},
    state: {},
    label: {},
    hard: { type: Boolean }
  },
  setup(e) {
    const a = e, t = F(() => a.draft.policy?.wip?.[a.state]);
    function l(r) {
      if (r === null) {
        a.draft.policy?.wip && delete a.draft.policy.wip[a.state];
        return;
      }
      const v = a.draft.policy ??= {}, m = v.wip ??= {};
      m[a.state] = { ...m[a.state], limit: r };
    }
    function o(r) {
      t.value && (t.value.hard = r);
    }
    return (r, v) => e.hard ? (n(), K(c(st), {
      key: 0,
      "aria-label": e.label,
      disabled: !t.value,
      "model-value": t.value?.hard ?? !1,
      "onUpdate:modelValue": o
    }, null, 8, ["aria-label", "disabled", "model-value"])) : (n(), K(c(Dt), {
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
    const { data: t } = await Ol.get(e, a ? { params: a } : void 0);
    if (!t?.success) {
      const l = t?.message || (typeof t?.error == "string" ? t.error : t?.error?.message) || "Could not read published Flow.";
      throw new El({ message: l, details: t?.details }, "Published Flow");
    }
    return t;
  } catch (t) {
    throw Pi(t, "Published Flow");
  }
}
const To = (e) => `/api/v1/workflows/${encodeURIComponent(e)}/versions`, ql = {
  title: async (e) => (await Il("/api/v1/workflows/published", { id: e })).item?.title,
  versions: async (e) => (await Il(To(e))).versions ?? [],
  check: async (e) => {
    if ((await Il(`${To(e.id)}/${e.version}`)).version?.version !== e.version) throw new Error("The published version is unavailable.");
  }
}, ru = {
  class: "work-stack work-tight",
  "aria-label": "Stage Flow"
}, du = {
  key: 0,
  class: "work-muted work-small"
}, uu = {
  key: 1,
  class: "kx-err work-alert-actions"
}, cu = { role: "alert" }, vu = ["schema", "config", "title"], fu = {
  key: 3,
  class: "kx-err",
  role: "alert"
}, mu = {
  key: 4,
  class: "work-stack work-tight"
}, pu = ["value", "aria-busy", "disabled"], gu = {
  value: "",
  disabled: ""
}, hu = ["value"], bu = {
  key: 5,
  class: "work-muted work-small",
  role: "status"
}, yu = /* @__PURE__ */ Se({
  __name: "StageFlow",
  props: {
    modelValue: {}
  },
  emits: ["update:modelValue", "validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = B(!1), r = B(""), v = B([]), m = B(!1), b = B(""), i = B(!1), u = F(() => r.value || t.modelValue?.id), d = JSON.stringify({ properties: { flow_ref: { title: "Published Flow", picker: "wc-workflow-picker" } } }), V = F(() => JSON.stringify(t.modelValue ? { flow_ref: t.modelValue } : {}));
    let g = 0;
    async function h() {
      o.value = await Ft("wc-workflow-picker");
    }
    h();
    async function p() {
      const T = ++g, D = u.value, z = t.modelValue;
      if (m.value = !!D, b.value = "", v.value = [], !!D)
        try {
          const [le] = await Promise.all([ql.versions(D), !i.value && z ? ql.check(z) : Promise.resolve()]);
          if (T !== g) return;
          if (v.value = le.filter((Z) => Number.isInteger(Z.version) && Z.version > 0), !i.value && z && !v.value.some((Z) => Z.version === z.version)) throw new Error("The published version is unavailable.");
        } catch (le) {
          T === g && (b.value = mt(le, "Could not read published Flow."));
        } finally {
          T === g && (m.value = !1);
        }
    }
    Ue([u, () => t.modelValue?.version, i], p, { immediate: !0 }), Ue(i, (T) => l("validity", !T), { immediate: !0 });
    function w(T) {
      const D = T.detail?.flow_ref;
      D?.kind !== "flow" || !D.id || (i.value = !0, r.value = D.id);
    }
    function x(T) {
      !u.value || !v.value.some((D) => D.version === T) || (l("update:modelValue", { kind: "flow", id: u.value, version: T }), i.value = !1, r.value = "");
    }
    function $() {
      l("update:modelValue", void 0), i.value = !1, r.value = "";
    }
    return Et(() => {
      g++, l("validity", !0);
    }), (T, D) => (n(), f("section", ru, [
      D[4] || (D[4] = s("h4", { class: "work-field-label" }, "What runs", -1)),
      e.modelValue ? C("", !0) : (n(), f("p", du, "No Flow bound. This stage keeps its existing external execution contract.")),
      b.value ? (n(), f("div", uu, [
        s("p", cu, [
          W(S(i.value ? "Flow versions unavailable" : "Flow binding unavailable"), 1),
          !i.value && e.modelValue ? (n(), f(ee, { key: 0 }, [
            W(" (v" + S(e.modelValue.version) + ")", 1)
          ], 64)) : C("", !0),
          W(". " + S(b.value), 1)
        ]),
        k(c(ae), {
          label: "Reload Flow",
          severity: "secondary",
          text: "",
          onClick: p
        })
      ])) : C("", !0),
      o.value ? (n(), f("wc-workflow-picker", {
        key: 2,
        schema: c(d),
        config: V.value,
        title: e.modelValue?.id,
        onChange: w
      }, null, 40, vu)) : (n(), f("p", fu, [
        D[2] || (D[2] = W("Published Flow picker unavailable.", -1)),
        k(c(ae), {
          label: "Reload Flow picker",
          text: "",
          severity: "secondary",
          onClick: h
        })
      ])),
      u.value ? (n(), f("label", mu, [
        D[3] || (D[3] = W(" Published version ", -1)),
        s("select", {
          class: "p-inputtext work-flow-version",
          value: i.value ? "" : e.modelValue?.version,
          "aria-busy": m.value,
          disabled: m.value || !!b.value,
          onChange: D[0] || (D[0] = (z) => x(Number(z.target.value)))
        }, [
          s("option", gu, S(m.value ? "Loading versions…" : "Choose a published version"), 1),
          (n(!0), f(ee, null, fe(v.value, (z) => (n(), f("option", {
            key: z.version,
            value: z.version
          }, "v" + S(z.version), 9, hu))), 128))
        ], 40, pu)
      ])) : C("", !0),
      i.value ? (n(), f("p", bu, "Choose a published version to finish selecting the Flow.")) : C("", !0),
      e.modelValue || i.value ? (n(), K(c(ae), {
        key: 6,
        label: i.value ? "Cancel Flow selection" : "Remove Flow binding",
        "aria-label": i.value ? "Cancel Flow selection" : "Remove Flow binding",
        severity: "secondary",
        text: "",
        onClick: D[1] || (D[1] = (z) => i.value ? (i.value = !1, r.value = "") : $())
      }, null, 8, ["label", "aria-label"])) : C("", !0)
    ]));
  }
}), Wl = { seconds: 1, minutes: 60, hours: 3600, days: 86400 };
function wa(e, a) {
  const t = /^P(\d+)W$/.exec(e), l = /^P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+\.?\d*)S)?)?$/.exec(e);
  if (!t && (!l || e === "P" || e.endsWith("T"))) return;
  const o = t ? Number(t[1]) * 604800 : Number(l[1] ?? 0) * 86400 + Number(l[2] ?? 0) * 3600 + Number(l[3] ?? 0) * 60 + Number(l[4] ?? 0);
  if (!Number.isFinite(o) || o <= 0) return;
  const r = a ?? (o % 86400 === 0 ? "days" : o % 3600 === 0 ? "hours" : o < 60 ? "seconds" : "minutes");
  return { amount: o / Wl[r], unit: r };
}
function ku(e, a) {
  if (e == null) return;
  if (!Number.isFinite(e * Wl[a]) || e <= 0) throw new Error("Enter a positive duration.");
  const t = (o) => o.toLocaleString("en-US", { useGrouping: !1, maximumSignificantDigits: 21 });
  if (!Number.isInteger(e)) return `PT${t(e * Wl[a])}S`;
  const l = { seconds: "S", minutes: "M", hours: "H", days: "D" }[a];
  return (a === "days" ? "P" : "PT") + t(e) + l;
}
const wu = { class: "work-stack work-tight" }, $u = {
  key: 0,
  class: "work-error",
  role: "alert"
}, Zt = /* @__PURE__ */ Se({
  __name: "DurationControl",
  props: {
    modelValue: {},
    label: {},
    disabled: { type: Boolean }
  },
  emits: ["update:modelValue", "validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = "duration:" + $t(), r = B(), v = B(""), m = F(() => t.modelValue ? wa(t.modelValue) : void 0), b = F(() => r.value ?? m.value?.unit ?? "days");
    Ue(() => t.modelValue, (x) => {
      v.value = "", l("validity", !x || !!m.value, o);
    }, { immediate: !0 });
    const i = F(() => t.modelValue ? wa(t.modelValue, b.value)?.amount ?? null : null);
    function u(x) {
      try {
        const $ = ku(x, b.value);
        v.value = "", l("update:modelValue", $), l("validity", !0, o);
      } catch ($) {
        v.value = $.message, l("validity", !1, o);
      }
    }
    let d;
    function V(x) {
      x.target instanceof HTMLInputElement && (d = x.target.value);
    }
    function g(x) {
      if (d === void 0) return;
      const $ = d;
      d = void 0, p(x, $);
    }
    function h(x) {
      d = void 0;
      const $ = x.originalEvent?.target instanceof HTMLInputElement ? x.originalEvent.target.value : x.formattedValue;
      p(x.value, $);
    }
    function p(x, $) {
      if ($.trim() && (typeof x != "number" || !Number.isFinite(x))) {
        v.value = "Enter a positive duration.", l("validity", !1, o);
        return;
      }
      r.value = b.value, u(typeof x == "number" ? x : null);
    }
    function w(x) {
      const $ = i.value;
      r.value = x, !(t.modelValue && !m.value) && u($);
    }
    return Et(() => l("validity", !0, o)), (x, $) => (n(), f("label", wu, [
      W(S(e.label), 1),
      s("span", {
        class: "work-duration-control",
        style: { "max-width": "360px" },
        onInputCapture: V
      }, [
        k(c(Dt), {
          "model-value": i.value,
          "aria-label": e.label,
          min: 0,
          "aria-invalid": !!v.value || !!e.modelValue && !c(wa)(e.modelValue),
          disabled: e.disabled,
          useGrouping: !1,
          "max-fraction-digits": b.value === "seconds" ? 20 : 3,
          onInput: h,
          "onUpdate:modelValue": g
        }, null, 8, ["model-value", "aria-label", "aria-invalid", "disabled", "max-fraction-digits"]),
        k(c(he), {
          "model-value": b.value,
          "aria-label": e.label + " unit",
          disabled: e.disabled,
          options: [{ label: "Seconds", value: "seconds" }, { label: "Minutes", value: "minutes" }, { label: "Hours", value: "hours" }, { label: "Days", value: "days" }],
          optionLabel: "label",
          optionValue: "value",
          appendTo: "self",
          "onUpdate:modelValue": $[0] || ($[0] = (T) => w(T))
        }, null, 8, ["model-value", "aria-label", "disabled"])
      ], 32),
      v.value || e.modelValue && !c(wa)(e.modelValue) ? (n(), f("span", $u, S(v.value || `Unsupported duration: ${e.modelValue}`), 1)) : C("", !0)
    ]));
  }
}), Vu = { class: "work-stack" }, xu = { class: "work-settings-grid" }, Cu = { class: "work-stack work-tight" }, Su = { class: "work-stack work-tight" }, Tu = {
  key: 1,
  class: "work-stack work-tight"
}, Iu = { class: "work-stack work-tight" }, Du = { class: "work-settings-grid" }, Uu = { class: "work-row" }, Au = { class: "work-stack work-tight" }, Eu = {
  key: 0,
  class: "work-stack work-tight"
}, Ru = /* @__PURE__ */ Se({
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
      i.push({ id: na("timer", i), after: "P1D", then: { emit: "reminder" } });
    }
    function v(i, u) {
      delete i.after, delete i.at_field, u === "after" ? i.after = "P1D" : i.at_field = "";
    }
    function m(i, u, d) {
      d ? i[u] = d : (delete i[u], delete i.table);
    }
    function b(i, u) {
      i.then = u === "emit" ? { emit: "" } : { transition: "" };
    }
    return (i, u) => (n(), f("section", Vu, [
      u[8] || (u[8] = s("h4", null, "Timers", -1)),
      (n(!0), f(ee, null, fe(o(), (d, V) => (n(), f("article", {
        key: d.id,
        class: "work-settings-card work-stack"
      }, [
        s("div", xu, [
          s("label", Cu, [
            u[2] || (u[2] = W("Timer ID", -1)),
            k(c(Re), {
              modelValue: d.id,
              "onUpdate:modelValue": (g) => d.id = g,
              required: "",
              pattern: "[a-z][a-z0-9_]*"
            }, null, 8, ["modelValue", "onUpdate:modelValue"])
          ]),
          s("label", Su, [
            u[3] || (u[3] = W("Deadline", -1)),
            k(c(he), {
              "model-value": d.at_field !== void 0 ? "at_field" : "after",
              "onUpdate:modelValue": (g) => v(d, g),
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
          d.after !== void 0 ? (n(), K(Zt, {
            key: 0,
            modelValue: d.after,
            "onUpdate:modelValue": (g) => d.after = g,
            label: "After",
            onValidity: u[0] || (u[0] = (g, h) => l("validity", h, g))
          }, null, 8, ["modelValue", "onUpdate:modelValue"])) : (n(), f("label", Tu, [
            u[4] || (u[4] = W("At field", -1)),
            k(c(he), {
              modelValue: d.at_field,
              "onUpdate:modelValue": (g) => d.at_field = g,
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
          s("label", Iu, [
            u[5] || (u[5] = W("Duration by field", -1)),
            k(c(he), {
              "model-value": d.by ?? "",
              "onUpdate:modelValue": (g) => m(d, "by", g),
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
        d.by ? (n(), K(Bt, {
          key: 0,
          label: "Duration table",
          hint: "Map field values to ISO durations.",
          "model-value": d.table,
          shape: "object",
          "onUpdate:modelValue": (g) => d.table = g,
          onValidity: (g) => l("validity", "table-" + V, g)
        }, null, 8, ["model-value", "onUpdate:modelValue", "onValidity"])) : C("", !0),
        s("div", Du, [
          k(Zt, {
            modelValue: d.repeat,
            "onUpdate:modelValue": (g) => d.repeat = g,
            label: "Repeat every",
            onValidity: u[1] || (u[1] = (g, h) => l("validity", h, g)),
            disabled: d.interrupting
          }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"]),
          s("label", Uu, [
            k(c(Lt), {
              modelValue: d.interrupting,
              "onUpdate:modelValue": [(g) => d.interrupting = g, (g) => d.interrupting && delete d.repeat],
              binary: ""
            }, null, 8, ["modelValue", "onUpdate:modelValue"]),
            u[6] || (u[6] = W("Interrupting", -1))
          ]),
          s("label", Au, [
            u[7] || (u[7] = W("Then", -1)),
            k(c(he), {
              "model-value": d.then?.transition !== void 0 ? "transition" : "emit",
              "onUpdate:modelValue": (g) => b(d, g),
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
          d.then ? (n(), f("label", Eu, [
            W(S(d.then.transition !== void 0 ? "Transition ID" : "Event name"), 1),
            d.then.transition !== void 0 ? (n(), K(c(Re), {
              key: 0,
              modelValue: d.then.transition,
              "onUpdate:modelValue": (g) => d.then.transition = g
            }, null, 8, ["modelValue", "onUpdate:modelValue"])) : (n(), K(c(Re), {
              key: 1,
              modelValue: d.then.emit,
              "onUpdate:modelValue": (g) => d.then.emit = g
            }, null, 8, ["modelValue", "onUpdate:modelValue"]))
          ])) : C("", !0)
        ]),
        k(c(ae), {
          severity: "secondary",
          onClick: (g) => o().splice(V, 1),
          "aria-label": "Remove timer",
          text: "",
          size: "small"
        }, {
          default: q(() => [
            k(c(pe), {
              icon: "tabler:trash",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        }, 8, ["onClick"])
      ]))), 128)),
      k(c(ae), {
        label: "Add timer",
        severity: "secondary",
        onClick: r,
        outlined: ""
      }, {
        icon: q(() => [
          k(c(pe), {
            icon: "tabler:plus",
            "aria-hidden": "true"
          })
        ]),
        _: 1
      })
    ]));
  }
}), Ou = ["aria-label"], Pu = { class: "work-stack work-tight" }, Nu = {
  key: 0,
  class: "work-stack work-tight"
}, Mu = /* @__PURE__ */ Se({
  __name: "PrincipalSourceEditor",
  props: {
    modelValue: {},
    draft: {},
    boardId: {},
    label: {}
  },
  emits: ["update:modelValue", "validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = F(() => Array.isArray(t.modelValue) ? "principals" : "field" in t.modelValue ? "field" : "group"), r = F(() => Array.isArray(t.modelValue) ? t.modelValue : "group" in t.modelValue && t.modelValue.group ? [{ kind: "group", id: t.modelValue.group }] : []);
    function v(b) {
      l("update:modelValue", b === "field" ? { field: "" } : b === "group" ? { group: "" } : []);
    }
    function m(b) {
      l("update:modelValue", o.value === "group" ? { group: b.at(-1)?.id ?? "" } : b);
    }
    return No(() => l("validity", Array.isArray(t.modelValue) ? t.modelValue.length > 0 : "field" in t.modelValue ? !!t.modelValue.field : !!t.modelValue.group)), Et(() => l("validity", !0)), (b, i) => (n(), f("section", {
      class: "work-stack work-tight",
      "aria-label": e.label
    }, [
      s("label", Pu, [
        W(S(e.label) + " source", 1),
        k(c(he), {
          "model-value": o.value,
          "aria-label": e.label + " source",
          options: [{ label: "Group", value: "group" }, { label: "People and groups", value: "principals" }, { label: "Principal field", value: "field" }],
          optionLabel: "label",
          optionValue: "value",
          appendTo: "self",
          "onUpdate:modelValue": v
        }, null, 8, ["model-value", "aria-label"])
      ]),
      "field" in e.modelValue ? (n(), f("label", Nu, [
        i[1] || (i[1] = W("Principal field", -1)),
        k(c(he), {
          "model-value": e.modelValue.field,
          "aria-label": e.label + " field",
          options: e.draft.fields?.filter((u) => u.type === "principal").map((u) => ({ label: u.title || u.code, value: u.code })) ?? [],
          optionLabel: "label",
          optionValue: "value",
          appendTo: "self",
          "onUpdate:modelValue": i[0] || (i[0] = (u) => l("update:modelValue", { field: u }))
        }, null, 8, ["model-value", "aria-label", "options"])
      ])) : (n(), K(Ql, {
        key: 1,
        "board-id": e.boardId,
        label: e.label,
        kinds: o.value === "group" ? "group" : "user,group,service",
        "model-value": r.value,
        "onUpdate:modelValue": m
      }, null, 8, ["board-id", "label", "kinds", "model-value"]))
    ], 8, Ou));
  }
}), Fu = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, Lu = {
  class: "work-stack work-tight",
  "aria-label": "Approval sources"
}, Bu = { class: "work-stack work-tight" }, zu = {
  key: 0,
  class: "work-stack work-tight"
}, ju = ["kinds", "placeholder", "value"], qu = {
  key: 2,
  class: "work-muted work-small",
  role: "status"
}, Wu = {
  key: 3,
  class: "work-chips"
}, Gu = {
  key: 4,
  class: "work-error work-small",
  role: "alert"
}, Ku = {
  key: 5,
  class: "work-muted work-small"
}, Hu = { class: "work-row" }, Yu = { class: "work-row work-small" }, Xu = /* @__PURE__ */ Se({
  __name: "ApproversEditor",
  props: {
    approvals: {},
    boardId: {}
  },
  emits: ["validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, { principalLabel: o, rememberPrincipal: r, nameError: v } = Fo(() => t.boardId ?? "", () => {
      const p = t.approvals.from;
      return Array.isArray(p) ? Ni(p) : "group" in p && p.group ? [{ kind: "group", id: p.group }] : [];
    }), m = B(), b = F(() => Array.isArray(t.approvals.from) ? "principals" : "field" in t.approvals.from ? "field" : "group"), i = F(() => {
      const p = t.approvals.from;
      return "group" in p && p.group ? JSON.stringify({ type: "group", principal_id: p.group }) : "{}";
    }), u = [
      { label: "Group members", value: "group" },
      { label: "People and groups", value: "principals" },
      { label: "Principal field", value: "field" }
    ], d = F(() => Array.isArray(t.approvals.from) ? t.approvals.from.some((p) => p.kind === "group") || t.approvals.from.length >= t.approvals.min : "field" in t.approvals.from ? !!t.approvals.from.field : !!t.approvals.from.group);
    No(() => l("validity", Number.isSafeInteger(t.approvals.min) && t.approvals.min > 0 && d.value)), Et(() => l("validity", !0)), Ea(async () => {
      m.value = await Ft("wc-principal-picker");
    });
    function V(p) {
      t.approvals.from = p === "group" ? { group: "" } : p === "field" ? { field: "" } : [];
    }
    function g(p) {
      const w = p.detail, x = w?.principal_id ?? w?.id;
      if (b.value === "group") {
        t.approvals.from = { group: x ?? "" };
        return;
      }
      if (!x || !Array.isArray(t.approvals.from)) return;
      const $ = { kind: w.type ?? w.kind ?? "user", id: x };
      w.label && r($, w.label), t.approvals.from.some((T) => T.id === x && T.kind === $.kind) || t.approvals.from.push($);
    }
    function h(p) {
      Array.isArray(t.approvals.from) && t.approvals.from.splice(p, 1);
    }
    return (p, w) => (n(), f(ee, null, [
      c(v) ? (n(), f("p", Fu, S(c(v)), 1)) : C("", !0),
      s("section", Lu, [
        s("label", Bu, [
          w[4] || (w[4] = W("Approval source ", -1)),
          k(c(he), {
            "model-value": b.value,
            "aria-label": "Approval source",
            "onUpdate:modelValue": w[0] || (w[0] = (x) => V(x)),
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            options: u
          }, null, 8, ["model-value"])
        ]),
        "field" in e.approvals.from ? (n(), f("label", zu, [
          w[5] || (w[5] = W("Principal field", -1)),
          k(c(Re), {
            modelValue: e.approvals.from.field,
            "onUpdate:modelValue": w[1] || (w[1] = (x) => e.approvals.from.field = x),
            "aria-label": "Principal field"
          }, null, 8, ["modelValue"])
        ])) : m.value ? (n(), f("wc-principal-picker", {
          key: b.value,
          kinds: b.value === "group" ? "group" : "user,group",
          placeholder: b.value === "group" ? "Select a group…" : "Select a person or group…",
          value: i.value,
          onConfigChanged: g
        }, null, 40, ju)) : (n(), f("p", qu, S(m.value === !1 ? "The principal picker is unavailable." : "Loading approver picker…"), 1)),
        Array.isArray(e.approvals.from) ? (n(), f("div", Wu, [
          (n(!0), f(ee, null, fe(e.approvals.from, (x, $) => (n(), K(c(et), {
            key: x.kind + ":" + x.id,
            class: "kx-tag-sm",
            severity: "secondary"
          }, {
            default: q(() => [
              W(S(c(o)(x)), 1),
              k(c(ae), {
                "aria-label": "Remove approver " + ($ + 1),
                text: "",
                severity: "secondary",
                size: "small",
                onClick: (T) => h($)
              }, {
                default: q(() => [
                  k(c(pe), {
                    icon: "tabler:x",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["aria-label", "onClick"])
            ]),
            _: 2
          }, 1024))), 128))
        ])) : C("", !0),
        Array.isArray(e.approvals.from) && !d.value ? (n(), f("p", Gu, "Select at least " + S(e.approvals.min) + " distinct principals, or lower the minimum.", 1)) : "group" in e.approvals.from && !e.approvals.from.group ? (n(), f("p", Ku, "Choose the group that can approve this state.")) : C("", !0),
        s("label", Hu, [
          w[6] || (w[6] = s("span", { class: "work-spacer" }, "Approvals needed", -1)),
          k(c(Dt), {
            modelValue: e.approvals.min,
            "onUpdate:modelValue": w[2] || (w[2] = (x) => e.approvals.min = x),
            min: 1,
            required: "",
            useGrouping: !1
          }, null, 8, ["modelValue"])
        ]),
        s("label", Yu, [
          w[7] || (w[7] = s("span", { class: "work-spacer" }, "The person who moves the item here cannot approve this visit", -1)),
          k(c(st), {
            modelValue: e.approvals.prevent_self,
            "onUpdate:modelValue": w[3] || (w[3] = (x) => e.approvals.prevent_self = x),
            "aria-label": "The person who moves the item here cannot approve this visit"
          }, null, 8, ["modelValue"])
        ])
      ])
    ], 64));
  }
}), Ju = {
  class: "work-state-settings work-stack",
  "aria-label": "State settings"
}, Zu = { class: "work-process-kind" }, Qu = { class: "work-stack" }, _u = { class: "work-row" }, ec = { class: "work-row" }, tc = { class: "work-row" }, ac = { class: "work-stack work-tight" }, lc = { class: "work-row" }, oc = { class: "work-stack work-tight" }, ic = { class: "work-row" }, nc = { class: "work-row" }, sc = { class: "work-stack work-tight" }, rc = { class: "work-stack" }, dc = { class: "work-row" }, uc = { class: "work-row" }, cc = { class: "work-stack work-tight" }, vc = { class: "work-stack work-tight" }, fc = {
  key: 0,
  class: "work-row"
}, mc = { class: "work-stack" }, pc = { class: "work-stack work-tight" }, gc = { class: "work-row" }, hc = /* @__PURE__ */ Se({
  __name: "StateSettings",
  props: {
    state: {},
    process: {},
    draft: {},
    boardId: {}
  },
  emits: ["validity", "kind"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = F(() => (t.process.transitions ?? []).filter((b) => b.from === "any" || b.from.includes(t.state.id))), r = [{ value: "human", icon: "user" }, { value: "gate", icon: "shield-check" }, { value: "automated", icon: "bolt" }, { value: "parallel", icon: "arrows-split" }];
    function v(b) {
      const i = t.state;
      i.kind = b, delete i.run, delete i.release_when, delete i.regions, delete i.join, delete i.due, (b === "automated" || b === "gate") && delete i.awaiting, b === "automated" && (i.run = { stage: i.id, retry: { max: 1, backoff: "PT1M" } }), b === "gate" && (i.release_when = { approvals: { min: 1, from: { group: "" }, prevent_self: !0 } }), b === "parallel" && (i.regions = [{ id: "region_1", initial: t.process.states.find((u) => u.id !== i.id)?.id ?? "" }], i.join = "all"), l("kind", b);
    }
    function m(b) {
      t.state.run && (b ? t.state.run.on_fail = b : delete t.state.run.on_fail);
    }
    return (b, i) => (n(), f("section", Ju, [
      i[57] || (i[57] = s("h4", { class: "work-process-group" }, "Who moves the item on", -1)),
      k(c(Hl), {
        class: "work-process-kinds",
        "model-value": e.state.kind ?? "human",
        options: r.map((u) => ({
          ...u,
          label: c(_a)(u.value)
        })),
        optionLabel: "label",
        optionValue: "value",
        optionDisabled: "disabled",
        "allow-empty": !1,
        "aria-label": "Who moves the item on",
        "onUpdate:modelValue": v
      }, {
        option: q(({ option: u }) => [
          s("span", Zu, [
            k(c(pe), {
              icon: "tabler:" + u.icon
            }, null, 8, ["icon"]),
            s("span", null, S(u.label), 1)
          ])
        ]),
        _: 1
      }, 8, ["model-value", "options"]),
      e.state.kind === "gate" && e.state.release_when ? (n(), f(ee, { key: 0 }, [
        i[35] || (i[35] = s("h4", { class: "work-process-group" }, "Approval", -1)),
        e.state.release_when.approvals ? (n(), K(Xu, {
          key: 0,
          "board-id": e.boardId,
          approvals: e.state.release_when.approvals,
          onValidity: i[0] || (i[0] = (u) => l("validity", "approvers", u))
        }, null, 8, ["board-id", "approvals"])) : C("", !0),
        k(je, {
          class: "work-process-options",
          label: "Release options"
        }, {
          default: q(() => [
            s("div", Qu, [
              s("label", _u, [
                i[34] || (i[34] = s("span", { class: "work-spacer" }, "Require approvals", -1)),
                k(c(st), {
                  "model-value": !!e.state.release_when.approvals,
                  "aria-label": "Require approvals",
                  "onUpdate:modelValue": i[1] || (i[1] = (u) => e.state.release_when.approvals = u ? { min: 1, from: { group: "" }, prevent_self: !0 } : void 0)
                }, null, 8, ["model-value"])
              ]),
              k(Zt, {
                modelValue: e.state.release_when.wait,
                "onUpdate:modelValue": i[2] || (i[2] = (u) => e.state.release_when.wait = u),
                label: "Wait before release",
                onValidity: i[3] || (i[3] = (u, d) => l("validity", d, u))
              }, null, 8, ["modelValue"]),
              k(Zl, {
                label: "Release when",
                draft: e.draft,
                "board-id": e.boardId,
                modelValue: e.state.release_when.when,
                "onUpdate:modelValue": i[4] || (i[4] = (u) => e.state.release_when.when = u),
                onValidity: i[5] || (i[5] = (u) => l("validity", "release", u))
              }, null, 8, ["draft", "board-id", "modelValue"])
            ])
          ]),
          _: 1
        })
      ], 64)) : C("", !0),
      i[58] || (i[58] = s("h4", { class: "work-process-group" }, "Limit", -1)),
      s("label", ec, [
        i[36] || (i[36] = s("span", { class: "work-spacer" }, "Items allowed here", -1)),
        k(So, {
          draft: e.draft,
          state: e.state.id,
          label: "Items allowed here"
        }, null, 8, ["draft", "state"])
      ]),
      s("label", tc, [
        i[37] || (i[37] = s("span", { class: "work-spacer" }, [
          W("Refuse moves over the limit"),
          s("small", { class: "work-muted work-block" }, "Off only warns")
        ], -1)),
        k(So, {
          draft: e.draft,
          state: e.state.id,
          label: "Refuse moves over the limit",
          hard: ""
        }, null, 8, ["draft", "state"])
      ]),
      i[59] || (i[59] = s("h4", { class: "work-process-group" }, "Required on entry", -1)),
      k(gt, {
        label: "Required fields",
        options: e.draft.fields?.map((u) => ({ value: u.code, label: u.title || u.code })) ?? [],
        modelValue: e.state.require,
        "onUpdate:modelValue": i[6] || (i[6] = (u) => e.state.require = u)
      }, null, 8, ["options", "modelValue"]),
      !e.state.kind || e.state.kind === "human" ? (n(), K(Zt, {
        key: 1,
        modelValue: e.state.due,
        "onUpdate:modelValue": i[7] || (i[7] = (u) => e.state.due = u),
        label: "Time allowed in this state",
        onValidity: i[8] || (i[8] = (u, d) => l("validity", d, u))
      }, null, 8, ["modelValue"])) : C("", !0),
      e.state.kind === "automated" && e.state.run ? (n(), f(ee, { key: 2 }, [
        i[46] || (i[46] = s("h4", { class: "work-process-group" }, "Automation", -1)),
        s("label", ac, [
          i[38] || (i[38] = W("Run label", -1)),
          k(c(Re), {
            modelValue: e.state.run.stage,
            "onUpdate:modelValue": i[9] || (i[9] = (u) => e.state.run.stage = u),
            "aria-label": "Run label",
            required: ""
          }, null, 8, ["modelValue"])
        ]),
        k(yu, {
          modelValue: e.state.run.flow_ref,
          "onUpdate:modelValue": i[10] || (i[10] = (u) => e.state.run.flow_ref = u),
          onValidity: i[11] || (i[11] = (u) => l("validity", "flow", u))
        }, null, 8, ["modelValue"]),
        k(Zt, {
          modelValue: e.state.run.timeout,
          "onUpdate:modelValue": i[12] || (i[12] = (u) => e.state.run.timeout = u),
          label: "Attempt timeout",
          onValidity: i[13] || (i[13] = (u, d) => l("validity", d, u))
        }, null, 8, ["modelValue"]),
        i[47] || (i[47] = s("small", { class: "work-muted" }, "Blank uses the board timeout, or one hour.", -1)),
        s("label", lc, [
          i[39] || (i[39] = s("span", { class: "work-spacer" }, "Maximum visits", -1)),
          k(c(Dt), {
            "model-value": e.state.run.max_visits ?? null,
            "aria-label": "Maximum visits",
            min: 1,
            useGrouping: !1,
            placeholder: "Board default",
            "onUpdate:modelValue": i[14] || (i[14] = (u) => e.state.run.max_visits = u ?? void 0)
          }, null, 8, ["model-value"])
        ]),
        s("label", oc, [
          i[40] || (i[40] = W("When visits are exhausted", -1)),
          k(c(he), {
            "model-value": e.state.run.on_exhausted,
            "aria-label": "When visits are exhausted",
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            showClear: "",
            options: (e.process.transitions ?? []).filter((u) => !u.auto).map((u) => ({ label: c(Xe)(u), value: u.id })),
            "onUpdate:modelValue": i[15] || (i[15] = (u) => e.state.run.on_exhausted = u || void 0)
          }, null, 8, ["model-value", "options"])
        ]),
        i[48] || (i[48] = s("small", { class: "work-muted" }, "Blank records a failed run and stops automation. A route must leave every incoming state or be global.", -1)),
        s("label", ic, [
          i[41] || (i[41] = s("span", { class: "work-spacer" }, "Retry if it fails", -1)),
          k(c(st), {
            "model-value": !!e.state.run.retry,
            "aria-label": "Retry if it fails",
            "onUpdate:modelValue": i[16] || (i[16] = (u) => e.state.run.retry = u ? { max: 1, backoff: "PT1M" } : void 0)
          }, null, 8, ["model-value"])
        ]),
        e.state.run.retry ? (n(), f(ee, { key: 0 }, [
          s("label", nc, [
            i[42] || (i[42] = s("span", { class: "work-spacer" }, "Maximum attempts", -1)),
            k(c(Dt), {
              modelValue: e.state.run.retry.max,
              "onUpdate:modelValue": i[17] || (i[17] = (u) => e.state.run.retry.max = u),
              min: 1,
              useGrouping: !1
            }, null, 8, ["modelValue"])
          ]),
          k(Zt, {
            modelValue: e.state.run.retry.backoff,
            "onUpdate:modelValue": i[18] || (i[18] = (u) => e.state.run.retry.backoff = u),
            label: "Wait between attempts",
            onValidity: i[19] || (i[19] = (u, d) => l("validity", d, u))
          }, null, 8, ["modelValue"])
        ], 64)) : C("", !0),
        (n(), f(ee, null, fe([{ key: "on_pass", label: "On success" }, { key: "on_cancel", label: "On cancellation" }], (u) => s("label", {
          key: u.key,
          class: "work-stack work-tight"
        }, [
          W(S(u.label), 1),
          k(c(he), {
            "model-value": e.state.run[u.key],
            "aria-label": u.label,
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            showClear: "",
            options: o.value.map((d) => ({ label: c(Xe)(d), value: d.id })),
            "onUpdate:modelValue": (d) => e.state.run[u.key] = d || void 0
          }, null, 8, ["model-value", "aria-label", "options", "onUpdate:modelValue"])
        ])), 64)),
        s("label", sc, [
          i[43] || (i[43] = W("If it fails, go to", -1)),
          k(c(he), {
            "aria-label": "If it fails, go to",
            "model-value": e.state.run.on_fail,
            "onUpdate:modelValue": m,
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            showClear: "",
            options: o.value.map((u) => ({
              label: c(Xe)(u) + " → " + c(ke)(e.process.states.find((d) => d.id === u.to)),
              value: u.id
            }))
          }, null, 8, ["model-value", "options"])
        ]),
        k(je, {
          class: "work-disclosure",
          label: "Board automation defaults"
        }, {
          default: q(() => [
            s("div", rc, [
              i[45] || (i[45] = s("p", { class: "work-muted" }, "These values apply to automated states without their own limit.", -1)),
              k(Zt, {
                "model-value": e.draft.policy?.stage_timeout,
                label: "Default attempt timeout",
                "onUpdate:modelValue": i[20] || (i[20] = (u) => (e.draft.policy ??= {}).stage_timeout = u),
                onValidity: i[21] || (i[21] = (u, d) => l("validity", d, u))
              }, null, 8, ["model-value"]),
              s("label", dc, [
                i[44] || (i[44] = s("span", { class: "work-spacer" }, "Default maximum visits", -1)),
                k(c(Dt), {
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
      ], 64)) : C("", !0),
      e.state.kind === "parallel" && e.state.regions ? (n(), f(ee, { key: 3 }, [
        i[53] || (i[53] = s("h4", { class: "work-process-group" }, "Lanes", -1)),
        (n(!0), f(ee, null, fe(e.state.regions, (u, d) => (n(), f("div", {
          key: d,
          class: "work-process-value work-stack work-tight"
        }, [
          s("div", uc, [
            s("span", null, "Lane " + S(d + 1), 1),
            i[49] || (i[49] = s("span", { class: "work-spacer" }, null, -1)),
            k(c(ae), {
              severity: "danger",
              text: "",
              size: "small",
              "aria-label": "Remove lane",
              onClick: (V) => e.state.regions.splice(d, 1)
            }, {
              default: q(() => [
                k(c(pe), { icon: "tabler:trash" })
              ]),
              _: 1
            }, 8, ["onClick"])
          ]),
          s("label", cc, [
            i[50] || (i[50] = W("Starts at", -1)),
            k(c(he), {
              "aria-label": "Lane starts at",
              modelValue: u.initial,
              "onUpdate:modelValue": (V) => u.initial = V,
              appendTo: "self",
              optionLabel: "label",
              optionValue: "value",
              options: e.process.states.filter((V) => V.id !== e.state.id).map((V) => ({ label: c(ke)(V), value: V.id }))
            }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
          ])
        ]))), 128)),
        k(c(ae), {
          label: "Add lane",
          severity: "secondary",
          outlined: "",
          size: "small",
          onClick: i[23] || (i[23] = (u) => e.state.regions.push({
            id: c(na)("region", e.state.regions),
            initial: e.process.states.find((d) => d.id !== e.state.id)?.id ?? ""
          }))
        }, {
          icon: q(() => [
            k(c(pe), { icon: "tabler:plus" })
          ]),
          _: 1
        }),
        s("label", vc, [
          i[51] || (i[51] = W("Finish rule", -1)),
          k(c(he), {
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
        typeof e.state.join == "number" ? (n(), f("label", fc, [
          i[52] || (i[52] = s("span", { class: "work-spacer" }, "Lanes needed", -1)),
          k(c(Dt), {
            modelValue: e.state.join,
            "onUpdate:modelValue": i[25] || (i[25] = (u) => e.state.join = u),
            min: 1,
            max: e.state.regions.length,
            useGrouping: !1
          }, null, 8, ["modelValue", "max"])
        ])) : C("", !0)
      ], 64)) : C("", !0),
      k(je, {
        class: "work-disclosure",
        label: "Advanced state settings"
      }, {
        default: q(() => [
          s("div", mc, [
            i[56] || (i[56] = s("h4", { class: "work-process-group" }, "Assignment and conditions", -1)),
            s("label", pc, [
              i[54] || (i[54] = W("Stage label", -1)),
              k(c(Re), {
                "model-value": e.state.stage,
                "aria-label": "Stage label",
                "onUpdate:modelValue": i[26] || (i[26] = (u) => e.state.stage = u || void 0)
              }, null, 8, ["model-value"])
            ]),
            !e.state.kind || e.state.kind === "human" || e.state.kind === "parallel" ? (n(), f(ee, { key: 0 }, [
              s("label", gc, [
                k(c(st), {
                  "model-value": !!e.state.awaiting,
                  "aria-label": "Awaiting people",
                  "onUpdate:modelValue": i[27] || (i[27] = (u) => e.state.awaiting = u ? { group: "" } : void 0)
                }, null, 8, ["model-value"]),
                i[55] || (i[55] = W("Awaiting people", -1))
              ]),
              e.state.awaiting ? (n(), K(Mu, {
                key: 0,
                modelValue: e.state.awaiting,
                "onUpdate:modelValue": i[28] || (i[28] = (u) => e.state.awaiting = u),
                draft: e.draft,
                "board-id": e.boardId,
                label: "Awaiting",
                onValidity: i[29] || (i[29] = (u) => l("validity", "awaiting", u))
              }, null, 8, ["modelValue", "draft", "board-id"])) : C("", !0)
            ], 64)) : C("", !0),
            k(Ql, {
              "board-id": e.boardId,
              modelValue: e.state.assign,
              "onUpdate:modelValue": i[30] || (i[30] = (u) => e.state.assign = u),
              label: "Assign to"
            }, null, 8, ["board-id", "modelValue"]),
            k(Bt, {
              label: "State checks",
              example: ["installed-check"],
              "model-value": e.state.invariants,
              shape: "array",
              "onUpdate:modelValue": i[31] || (i[31] = (u) => e.state.invariants = u),
              onValidity: i[32] || (i[32] = (u) => l("validity", "invariants", u))
            }, null, 8, ["model-value"]),
            k(Ru, {
              state: e.state,
              draft: e.draft,
              onValidity: i[33] || (i[33] = (u, d) => l("validity", "timer-" + u, d))
            }, null, 8, ["state", "draft"])
          ])
        ]),
        _: 1
      })
    ]));
  }
}), bc = { class: "work-stack work-transition-settings" }, yc = { class: "work-stack work-tight" }, kc = { class: "work-row" }, wc = { key: 0 }, $c = { class: "work-stack" }, Vc = { class: "work-row" }, xc = { class: "work-row" }, Cc = { class: "work-stack work-tight" }, Sc = { class: "work-row" }, Tc = { class: "work-stack work-tight" }, Ic = { class: "work-stack work-tight" }, Dc = /* @__PURE__ */ Se({
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
    function r(i, u) {
      const d = t.transition.set?.[i];
      !d || !t.transition.set || (t.transition.set[i] = { field: d.field, ...u === "clear" ? { clear: !0 } : u === "copy" ? { copy: "" } : { value: "" } });
    }
    function v(i) {
      return !i || typeof i != "object" || !("field" in i) || typeof i.field != "string" ? !1 : "clear" in i ? i.clear === !0 && !("copy" in i) && !("value" in i) : "copy" in i ? typeof i.copy == "string" && !("value" in i) : "value" in i;
    }
    function m(i) {
      if (i !== void 0 && (!Array.isArray(i) || !i.every(v)))
        return "Each effect needs a field and exactly one of value, clear (true), or copy (a source field).";
      t.transition.set = i;
    }
    function b(i) {
      if (i !== void 0 && (!Array.isArray(i) || !i.every((u) => typeof u == "string")))
        return "Enter guard IDs as strings.";
      t.transition.guards = i;
    }
    return (i, u) => (n(), f("div", bc, [
      s("label", yc, [
        u[13] || (u[13] = W("To state", -1)),
        k(c(he), {
          modelValue: e.transition.to,
          "onUpdate:modelValue": u[0] || (u[0] = (d) => e.transition.to = d),
          "aria-label": "To state",
          appendTo: "self",
          optionLabel: "label",
          optionValue: "value",
          options: e.process.states.map((d) => ({ label: c(ke)(d), value: d.id }))
        }, null, 8, ["modelValue", "options"])
      ]),
      s("label", kc, [
        u[14] || (u[14] = s("span", { class: "work-spacer" }, "Works from any state", -1)),
        k(c(st), {
          "model-value": e.transition.from === "any",
          "aria-label": "Works from any state",
          "onUpdate:modelValue": u[1] || (u[1] = (d) => e.transition.from = d ? "any" : [])
        }, null, 8, ["model-value"])
      ]),
      e.transition.from !== "any" ? (n(), K(gt, {
        key: 0,
        label: "From states",
        options: e.process.states.map((d) => ({ value: d.id, label: c(ke)(d) })),
        modelValue: e.transition.from,
        "onUpdate:modelValue": u[2] || (u[2] = (d) => e.transition.from = d)
      }, null, 8, ["options", "modelValue"])) : C("", !0),
      u[22] || (u[22] = s("h4", { class: "work-process-group" }, "Must be filled", -1)),
      k(gt, {
        label: "Required fields",
        options: e.draft.fields?.map((d) => ({ value: d.code, label: d.title || d.code })) ?? [],
        modelValue: e.transition.require,
        "onUpdate:modelValue": u[3] || (u[3] = (d) => e.transition.require = d)
      }, null, 8, ["options", "modelValue"]),
      u[23] || (u[23] = s("h4", { class: "work-process-group" }, "Only when", -1)),
      k(Zl, {
        label: "Allow this transition when",
        draft: e.draft,
        "board-id": e.boardId,
        "model-value": e.transition.when,
        "onUpdate:modelValue": u[4] || (u[4] = (d) => e.transition.when = d),
        onValidity: u[5] || (u[5] = (d) => l("validity", "when", d))
      }, null, 8, ["draft", "board-id", "model-value"]),
      e.guards?.length || e.transition.guards?.length ? (n(), K(gt, {
        key: 1,
        label: "Installed checks",
        options: [...(e.guards ?? []).map((d) => ({ value: d.id, label: d.title })), ...(e.transition.guards ?? []).filter((d) => !e.guards?.some((V) => V.id === d)).map((d) => ({ value: d, label: e.guards ? "Unavailable check" : "Configured check" }))],
        modelValue: e.transition.guards,
        "onUpdate:modelValue": u[6] || (u[6] = (d) => e.transition.guards = d)
      }, null, 8, ["options", "modelValue"])) : C("", !0),
      (n(!0), f(ee, null, fe(e.guards?.filter((d) => e.transition.guards?.includes(d.id)) ?? [], (d) => (n(), f("p", {
        key: d.id,
        class: "work-muted work-small"
      }, [
        W(S(d.description || d.title + " can stop this transition.") + " ", 1),
        d.reads?.length ? (n(), f("span", wc, " Checks " + S(d.reads.map((V) => e.draft.fields?.find((g) => g.code === V)?.title || "a configured field").join(", ")) + ".", 1)) : C("", !0)
      ]))), 128)),
      k(je, {
        class: "work-disclosure",
        label: "Advanced transition settings"
      }, {
        default: q(() => [
          s("div", $c, [
            s("label", Vc, [
              u[15] || (u[15] = s("span", { class: "work-spacer" }, "Happens automatically", -1)),
              k(c(st), {
                "model-value": e.transition.auto,
                "onUpdate:modelValue": u[7] || (u[7] = (d) => {
                  e.transition.auto = d, d || delete e.transition.default;
                }),
                "aria-label": "Automatic transition"
              }, null, 8, ["model-value"])
            ]),
            s("label", xc, [
              u[16] || (u[16] = s("span", { class: "work-spacer" }, "Default automatic transition", -1)),
              k(c(st), {
                modelValue: e.transition.default,
                "onUpdate:modelValue": u[8] || (u[8] = (d) => e.transition.default = d),
                disabled: !e.transition.auto,
                "aria-label": "Default transition"
              }, null, 8, ["modelValue", "disabled"])
            ]),
            u[21] || (u[21] = s("h4", { class: "work-process-group" }, "Also sets", -1)),
            (n(!0), f(ee, null, fe(e.transition.set ?? [], (d, V) => (n(), f("div", {
              key: V,
              class: "work-process-value work-stack work-tight"
            }, [
              s("label", Cc, [
                u[17] || (u[17] = W("Field", -1)),
                k(c(he), {
                  modelValue: d.field,
                  "onUpdate:modelValue": (g) => d.field = g,
                  appendTo: "self",
                  optionLabel: "label",
                  optionValue: "value",
                  options: e.draft.fields?.map((g) => ({ value: g.code, label: g.title || g.code })) ?? []
                }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
              ]),
              s("div", Sc, [
                k(c(he), {
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
                  "onUpdate:modelValue": (g) => r(V, g)
                }, null, 8, ["model-value", "onUpdate:modelValue"]),
                k(c(ae), {
                  text: "",
                  severity: "danger",
                  "aria-label": "Remove value " + (V + 1),
                  onClick: (g) => e.transition.set?.splice(V, 1)
                }, {
                  default: q(() => [
                    k(c(pe), { icon: "tabler:trash" })
                  ]),
                  _: 1
                }, 8, ["aria-label", "onClick"])
              ]),
              d.copy !== void 0 ? (n(), K(c(he), {
                key: 0,
                modelValue: d.copy,
                "onUpdate:modelValue": (g) => d.copy = g,
                "aria-label": "Copy from field",
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                options: e.draft.fields?.map((g) => ({ value: g.code, label: g.title || g.code })) ?? []
              }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])) : d.clear ? C("", !0) : (n(!0), f(ee, { key: 1 }, fe(e.draft.fields?.filter((g) => g.code === d.field) ?? [], (g) => (n(), K(Ho, {
                key: g.code,
                "board-id": e.boardId ?? "",
                field: g,
                modelValue: d.value,
                "onUpdate:modelValue": (h) => d.value = h,
                onValidity: (h) => l("validity", "effect-" + V, h)
              }, null, 8, ["board-id", "field", "modelValue", "onUpdate:modelValue", "onValidity"]))), 128))
            ]))), 128)),
            k(c(ae), {
              label: "Add value",
              severity: "secondary",
              outlined: "",
              size: "small",
              onClick: o
            }, {
              icon: q(() => [
                k(c(pe), { icon: "tabler:plus" })
              ]),
              _: 1
            }),
            s("label", Tc, [
              u[18] || (u[18] = W("Offer to people", -1)),
              k(c(he), {
                "model-value": e.transition.people,
                "aria-label": "Offer to people",
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                options: [{ label: "Work default", value: void 0 }, { label: "Offer explicitly", value: !0 }, { label: "Process engine only", value: !1 }],
                "onUpdate:modelValue": u[9] || (u[9] = (d) => e.transition.people = d)
              }, null, 8, ["model-value"]),
              u[19] || (u[19] = s("span", { class: "work-muted work-small" }, "Work default can hide a stage route from the list while still allowing it by name. Process engine only reserves the route for the engine and board administrators using force.", -1))
            ]),
            s("label", Ic, [
              u[20] || (u[20] = W("Evaluation order", -1)),
              k(c(Dt), {
                "model-value": e.transition.order ?? null,
                "aria-label": "Transition order",
                min: 0,
                useGrouping: !1,
                "onUpdate:modelValue": u[10] || (u[10] = (d) => e.transition.order = d ?? void 0)
              }, null, 8, ["model-value"])
            ]),
            k(Bt, {
              label: "Set values",
              "model-value": e.transition.set,
              shape: "array",
              commit: m,
              onValidity: u[11] || (u[11] = (d) => l("validity", "set", d))
            }, null, 8, ["model-value"]),
            k(Bt, {
              label: "Guards",
              "model-value": e.transition.guards,
              shape: "array",
              commit: b,
              onValidity: u[12] || (u[12] = (d) => l("validity", "guards", d))
            }, null, 8, ["model-value"])
          ])
        ]),
        _: 1
      })
    ]));
  }
}), Uc = ["aria-label", "aria-keyshortcuts", "onKeydown"], Ac = { class: "work-row" }, Ec = {
  key: 0,
  class: "work-stack work-tight"
}, Rc = { class: "work-process-meaning" }, Oc = {
  key: 1,
  class: "work-muted"
}, Pc = { class: "work-stack work-tight" }, Nc = { class: "work-next-transition work-stack work-tight" }, Mc = { class: "work-row work-wrap" }, Fc = { class: "work-process-inspector-foot" }, Lc = { class: "work-row work-transition-actions" }, Bc = { class: "work-process-meaning" }, zc = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, jc = { class: "work-stack work-tight" }, qc = /* @__PURE__ */ Se({
  __name: "ProcessInspector",
  props: {
    process: {},
    draft: {},
    boardId: {},
    guards: {},
    error: {},
    selectedState: {},
    selectedTransition: {},
    insertedRoute: {},
    processCounts: {}
  },
  emits: ["close", "focus-editor", "validity", "kind", "connect", "remove-state", "remove-transition"],
  setup(e, { expose: a, emit: t }) {
    const l = e, o = t, r = B(), v = B(!1), m = B(!1), b = B("");
    let i;
    function u() {
      i = void 0, v.value = !1, m.value = !1, b.value = "";
    }
    async function d(w) {
      u(), i = w, await wt(), r.value && (r.value.scrollTop = 0, r.value.focus({ preventScroll: !0 }), (r.value.closest(".work-settings-shell")?.clientWidth ?? 1 / 0) <= 700 && r.value.scrollIntoView?.({ block: "nearest" }));
    }
    async function V() {
      const w = i;
      o("close"), await wt(), w?.isConnected ? w.focus() : o("focus-editor");
    }
    async function g() {
      v.value = !0, await wt(), r.value?.querySelector('[aria-label="State name"]')?.focus();
    }
    async function h(w) {
      b.value = "", m.value = w, await wt();
      const x = w ? '[role="combobox"]' : "button";
      r.value?.querySelector(".work-next-transition " + x)?.focus();
    }
    function p(w) {
      !l.selectedTransition || w.defaultPrevented || w.repeat || (w.preventDefault(), o("remove-transition", l.selectedTransition));
    }
    return a({ open: d, close: V, reset: u, editName: g, removeByShortcut: p }), (w, x) => (n(), K(Gl, { name: "work-panel" }, {
      default: q(() => [
        e.selectedState || e.selectedTransition ? (n(), f("aside", {
          key: 0,
          ref_key: "panel",
          ref: r,
          class: "work-process-sideform",
          tabindex: "-1",
          "aria-label": e.selectedState ? "State inspector" : "Transition inspector",
          "aria-keyshortcuts": e.selectedTransition ? "Delete Backspace" : void 0,
          onKeydown: [
            Je(Be(p, ["self"]), ["delete"]),
            Je(Be(p, ["self"]), ["backspace"])
          ]
        }, [
          (n(!0), f(ee, null, fe(e.selectedState ? [e.selectedState] : [], ($) => (n(), f(ee, {
            key: $.id
          }, [
            s("header", Ac, [
              v.value ? (n(), K(c(Re), {
                key: 1,
                modelValue: $.name,
                "onUpdate:modelValue": (T) => $.name = T,
                class: "work-process-name",
                "aria-label": "State name",
                onBlur: x[0] || (x[0] = (T) => v.value = !1)
              }, null, 8, ["modelValue", "onUpdate:modelValue"])) : (n(), K(Yl, {
                key: 0,
                class: "work-process-state-title",
                "aria-label": "Rename state",
                onActivate: g
              }, {
                default: q(() => [
                  s("span", null, S(c(ke)($)), 1)
                ]),
                _: 2
              }, 1024)),
              k(c(ae), {
                severity: "secondary",
                text: "",
                size: "small",
                "aria-label": "Close state editor",
                onClick: V
              }, {
                default: q(() => [
                  k(c(pe), { icon: "tabler:x" })
                ]),
                _: 1
              })
            ]),
            e.insertedRoute ? (n(), f("div", Ec, [
              x[4] || (x[4] = s("p", { class: "work-field-label" }, "New route", -1)),
              s("p", null, S(e.insertedRoute), 1)
            ])) : C("", !0),
            s("p", Rc, S(c(Mi)($, e.draft)), 1),
            e.processCounts ? (n(), f("p", Oc, S(e.processCounts[$.id] ?? 0) + " " + S(e.processCounts[$.id] === 1 ? "item" : "items") + " currently here", 1)) : C("", !0),
            k(hc, {
              state: $,
              process: e.process,
              draft: e.draft,
              "board-id": e.boardId,
              onKind: (T) => o("kind", $, T),
              onValidity: (T, D) => o("validity", T.includes("duration:") ? T : e.process.id + ":" + $.id + ":" + T, D)
            }, null, 8, ["state", "process", "draft", "board-id", "onKind", "onValidity"]),
            s("label", Pc, [
              x[5] || (x[5] = W("Phase", -1)),
              k(c(he), {
                "aria-label": "Phase",
                modelValue: $.category,
                "onUpdate:modelValue": (T) => $.category = T,
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                options: ["triage", "backlog", ...c(Lo)].map((T) => ({ label: c(zt)(T), value: T }))
              }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
            ]),
            s("div", Nc, [
              m.value ? (n(), f(ee, { key: 1 }, [
                k(c(he), {
                  modelValue: b.value,
                  "onUpdate:modelValue": x[2] || (x[2] = (T) => b.value = T),
                  "aria-label": "Next state",
                  placeholder: "Choose the next state",
                  appendTo: "self",
                  optionLabel: "label",
                  optionValue: "value",
                  options: e.process.states.filter((T) => T !== $).map((T) => ({ label: c(ke)(T), value: T.id }))
                }, null, 8, ["modelValue", "options"]),
                s("div", Mc, [
                  k(c(ae), {
                    label: "Add transition",
                    size: "small",
                    disabled: !b.value,
                    onClick: (T) => o("connect", $.id, b.value, c(i))
                  }, null, 8, ["disabled", "onClick"]),
                  k(c(ae), {
                    label: "Cancel",
                    severity: "secondary",
                    text: "",
                    size: "small",
                    onClick: x[3] || (x[3] = (T) => h(!1))
                  })
                ])
              ], 64)) : (n(), K(c(ae), {
                key: 0,
                label: "Add transition",
                severity: "secondary",
                outlined: "",
                size: "small",
                "aria-expanded": "false",
                disabled: e.process.states.length < 2,
                onClick: x[1] || (x[1] = (T) => h(!0))
              }, {
                icon: q(() => [
                  k(c(pe), {
                    icon: "tabler:plus",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["disabled"]))
            ]),
            s("footer", Fc, [
              k(c(ae), {
                label: "Remove state",
                severity: "danger",
                text: "",
                size: "small",
                onClick: (T) => o("remove-state", $)
              }, {
                icon: q(() => [
                  k(c(pe), { icon: "tabler:trash" })
                ]),
                _: 1
              }, 8, ["onClick"])
            ])
          ], 64))), 128)),
          (n(!0), f(ee, null, fe(e.selectedTransition ? [e.selectedTransition] : [], ($) => (n(), f(ee, {
            key: $.id
          }, [
            s("header", Lc, [
              x[6] || (x[6] = s("h3", null, "Transition", -1)),
              k(c(ae), {
                type: "button",
                label: "Remove transition",
                severity: "danger",
                text: "",
                size: "small",
                onClick: (T) => o("remove-transition", $)
              }, {
                icon: q(() => [
                  k(c(pe), { icon: "tabler:trash" })
                ]),
                _: 1
              }, 8, ["onClick"]),
              k(c(ae), {
                severity: "secondary",
                text: "",
                size: "small",
                "aria-label": "Close transition editor",
                onClick: V
              }, {
                default: q(() => [
                  k(c(pe), { icon: "tabler:x" })
                ]),
                _: 1
              })
            ]),
            s("p", Bc, S($.from === "any" ? "Any state" : $.from.map((T) => c(ke)(e.process.states.find((D) => D.id === T))).join(", ")) + " → " + S(c(ke)(e.process.states.find((T) => T.id === $.to))), 1),
            k(ci, {
              transition: $,
              process: e.process,
              draft: e.draft,
              guards: e.guards
            }, null, 8, ["transition", "process", "draft", "guards"]),
            e.error ? (n(), f("p", zc, S(e.error), 1)) : C("", !0),
            s("label", jc, [
              x[7] || (x[7] = W("Name", -1)),
              k(c(Re), {
                modelValue: $.name,
                "onUpdate:modelValue": (T) => $.name = T,
                placeholder: c(Xe)($),
                "aria-label": "Transition name"
              }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder"])
            ]),
            k(Dc, {
              transition: $,
              process: e.process,
              draft: e.draft,
              "board-id": e.boardId,
              guards: e.guards,
              onValidity: (T, D) => o("validity", e.process.id + ":transition-" + $.id + ":" + T, D)
            }, null, 8, ["transition", "process", "draft", "board-id", "guards", "onValidity"])
          ], 64))), 128))
        ], 40, Uc)) : C("", !0)
      ]),
      _: 1
    }));
  }
}), Wc = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, Gc = { key: 1 }, Kc = { class: "work-muted" }, Hc = {
  key: 2,
  class: "work-map-zoom",
  role: "group",
  "aria-label": "Map zoom"
}, Yc = { class: "work-stack" }, Xc = { class: "work-stack work-tight" }, Jc = {
  key: 0,
  class: "work-muted"
}, Zc = { class: "work-stack work-tight" }, Qc = { class: "work-dialog-actions" }, _c = /* @__PURE__ */ Se({
  __name: "ProcessEditor",
  props: {
    draft: {},
    guardRemoval: { type: Function },
    issues: {},
    boardId: {},
    counts: {},
    countTypes: {},
    guards: {},
    createForItemType: { type: Boolean },
    creationOpener: {}
  },
  emits: ["validity", "created", "cancel-creation"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = il(sl, void 0), r = F(() => t.draft.processes ?? []), v = B(!1), m = B(""), b = B(""), i = B(""), u = B("Map");
    Ue(() => t.createForItemType, (P, A) => {
      !P && !A || (m.value = "", v.value = !!P);
    }, { immediate: !0 });
    const d = B(), V = B(), g = B(), h = B(), p = B(), w = B(), x = /* @__PURE__ */ new WeakMap(), $ = F(() => r.value.find((P) => P.id === b.value) ?? r.value[0]), T = F(() => {
      const P = d.value, A = $.value, G = P && x.get(P);
      if (!P || !A || !G) return;
      const { entry: re, continuation: te } = G;
      if (!A.transitions?.includes(re) || re.to !== P.id) return;
      const I = [
        re.from === "any" ? "Any state" : re.from.map((Q) => ke(A.states.find((E) => E.id === Q))).join(", "),
        ke(P)
      ];
      return te && A.transitions.includes(te) && (te.from === "any" || te.from.includes(P.id)) && I.push(ke(A.states.find((Q) => Q.id === te.to))), I.join(" → ");
    }), D = B(!1);
    function z(P) {
      D.value = !0, u.value = P;
    }
    function le() {
      !D.value && h.value?.clientWidth && (u.value = h.value.clientWidth < 480 && ($.value?.states.length ?? 0) > 6 ? "List" : "Map");
    }
    let Z;
    Ea(() => {
      le(), h.value && typeof ResizeObserver < "u" && (Z = new ResizeObserver(le), Z.observe(h.value));
    }), Et(() => Z?.disconnect()), Ue($, () => {
      D.value = !1, le();
    });
    function ue() {
      p.value?.reset(), d.value = void 0, V.value = void 0, i.value = "";
    }
    function me() {
      const P = o?.selected.value;
      P?.startsWith("workflow/") && o?.choose("workflow", P.slice(9), !1), ue();
    }
    function ge() {
      u.value === "Map" ? g.value?.focus() : w.value?.focus();
    }
    function be(P, A) {
      d.value = P, V.value = void 0, i.value = "", $.value && o?.choose("workflow", $.value.id + ".state." + P.id, !0), p.value?.open(A);
    }
    function se(P, A) {
      V.value = P, d.value = void 0, i.value = "", $.value && o?.choose("workflow", $.value.id + ".transition." + P.id, !0), p.value?.open(A);
    }
    Ue([$, u], ue), Ue([() => o?.selected.value, r], async ([P], A) => {
      if (!P?.startsWith("workflow/")) {
        A?.[0]?.startsWith("workflow/") && ue();
        return;
      }
      const [G, re, te] = P.slice(9).split("."), I = r.value.find((oe) => oe.id === G);
      if (!I || $.value !== I && (b.value = I.id, await wt(), o?.selected.value !== P))
        return;
      const Q = re === "state" ? I.states.find((oe) => oe.id === te) : void 0, E = re === "transition" ? I.transitions?.find((oe) => oe.id === te) : void 0;
      Q === d.value && E === V.value || (ue(), d.value = Q, V.value = E);
    }, { immediate: !0, flush: "post" });
    const R = F(() => {
      if (!t.counts || !$.value) return;
      const P = t.countTypes?.filter((A) => A.process === $.value?.id) ?? [];
      return Object.fromEntries($.value.states.map((A) => [
        A.id,
        P.reduce((G, re) => G + (t.counts?.[re.id]?.[A.id] ?? 0), 0)
      ]));
    }), _ = F(() => (t.guards ?? []).filter((P) => t.draft.plugins?.some((A) => A.use === P.plugin))), L = F(() => Object.keys(t.draft.policy?.wip ?? {}).filter((P) => !r.value.some((A) => A.states.some((G) => G.id === P))));
    function ie() {
      const P = m.value.trim();
      if (!P) return;
      const A = P.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "") || "process", G = (/^[a-z]/.test(A) ? A : "process_" + A).slice(0, 40), re = r.value.some((te) => te.id === G) ? na(G, r.value) : G;
      (t.draft.processes ??= []).push({ id: re, name: P, initial: "todo", states: [{ id: "todo", name: "To do", category: "unstarted" }], transitions: [] }), b.value = re, m.value = "", v.value = !1, l("created", re);
    }
    function xe() {
      v.value = !1, l("cancel-creation");
    }
    async function Oe(P, A) {
      const G = { id: na("state", P.states), name: "New state", category: "started" }, re = Ka(P), te = re.at(-1), I = d.value ?? (te?.category === "completed" ? re.at(-2) : te), Q = I ? P.states.indexOf(I) : -1, E = I ? Q + 1 : P.states.length, oe = I && P.transitions?.filter((O) => O.from !== "any" && O.from.length === 1 && O.from[0] === I.id && !vo(P, O).length), Ve = oe?.find((O) => O.default) ?? oe?.find((O) => P.states.findIndex((Y) => Y.id === O.to) > Q);
      P.states.splice(E, 0, G);
      const Pe = P.states[E];
      if (I && I.category !== "completed" && I.category !== "canceled") {
        const O = P.transitions ??= [], Y = Ve?.auto === !0 && Ve.default === !0, ye = {
          id: na("transition", O),
          name: "Continue",
          from: [Ve ? Pe.id : I.id],
          to: Ve?.to ?? Pe.id,
          ...Y ? { auto: !0, default: !0 } : {}
        };
        Ve && (Ve.to = Pe.id), O.push(ye);
        const ve = O[O.length - 1];
        x.set(Pe, { entry: Ve ?? ve, continuation: Ve ? ve : void 0, automatic: Y });
      }
      be(Pe, A), await p.value?.editName();
    }
    function H(P, A) {
      const G = x.get(P), re = G?.continuation;
      !re || G.automatic || re.from === "any" || re.from.length !== 1 || re.from[0] !== P.id || (A === "gate" ? (re.auto = !0, re.default = !0) : (delete re.auto, delete re.default));
    }
    function j(P, A, G) {
      const re = $.value;
      if (!re || !A || P === A) return;
      const te = re.transitions ??= [], I = `to_${A}`;
      let Q = I.slice(0, 40), E = 2;
      for (; te.some((Ve) => Ve.id === Q); ) {
        const Ve = `_${E++}`;
        Q = I.slice(0, 40 - Ve.length) + Ve;
      }
      const oe = { id: Q, name: `To ${ke(re.states.find((Ve) => Ve.id === A)).toLowerCase()}`, from: [P], to: A };
      te.push(oe), se(oe, G);
    }
    function M(P, A) {
      const G = d.value ?? P.states.find((I) => I.id === P.initial) ?? P.states[0], re = P.states.find((I) => I.id !== G?.id);
      if (!G || !re) return;
      const te = { id: na("transition", P.transitions ?? []), name: "To " + ke(re), from: [G.id], to: re.id };
      (P.transitions ??= []).push(te), se(te, A);
    }
    async function ce(P) {
      const A = $.value, G = A?.transitions?.indexOf(P) ?? -1;
      if (!A || G < 0) return;
      const re = vo(A, P);
      if (re.length) {
        i.value = `Used by ${re.join(", ")}. Update those references first.`;
        return;
      }
      A.transitions.splice(G, 1), ue(), await wt(), ge();
    }
    function y(P, A) {
      const G = Fi(P, A);
      if (G.length) {
        i.value = `${ke(A)} is used by ${G.join(", ")}. Update these references first.`;
        return;
      }
      P.states.splice(P.states.indexOf(A), 1), p.value?.close();
    }
    async function U(P) {
      const A = t.draft.item_types?.filter((re) => re.process === P.id).map((re) => re.title || "Untitled item type") ?? [];
      if (A.length) {
        i.value = `Used by ${A.join(", ")}. Choose a different workflow for those item types first.`;
        return;
      }
      const G = await t.guardRemoval?.("processes", P.id);
      if (G) {
        i.value = G;
        return;
      }
      Ra(t.draft, "processes", P.id), b.value = "", ue();
    }
    return (P, A) => (n(), f("section", {
      ref_key: "editor",
      ref: h,
      class: "work-process-editor work-stack",
      "aria-label": "Workflow editor",
      onKeydown: A[17] || (A[17] = Je((G) => (d.value || V.value) && p.value?.close(), ["esc"]))
    }, [
      i.value && !V.value ? (n(), f("p", Wc, S(i.value), 1)) : C("", !0),
      (n(!0), f(ee, null, fe(e.issues?.filter((G) => G.code === "process " + $.value?.id) ?? [], (G) => (n(), f("p", {
        key: G.what + G.detail,
        class: "work-error work-small",
        role: "alert"
      }, S(c(nl)(G)) + " · " + S(G.what), 1))), 128)),
      $.value ? (n(), f("div", {
        key: 1,
        class: pt(["work-process-builder", { "work-process-inspecting": d.value || V.value }])
      }, [
        s("div", {
          ref_key: "tools",
          ref: w,
          class: "work-process-controls",
          role: "toolbar",
          "aria-label": "Workflow tools",
          tabindex: "-1"
        }, [
          r.value.length > 1 ? (n(), K(c(he), {
            key: 0,
            "model-value": $.value.id,
            "aria-label": "Workflow",
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            options: r.value.map((G) => ({ label: G.name || "Untitled workflow", value: G.id })),
            "onUpdate:modelValue": A[0] || (A[0] = (G) => b.value = G)
          }, null, 8, ["model-value", "options"])) : (n(), f("strong", Gc, S($.value.name || "Untitled workflow"), 1)),
          k(c(ae), {
            label: "Add state",
            severity: "secondary",
            outlined: "",
            onClick: A[1] || (A[1] = (G) => Oe($.value, G.currentTarget))
          }, {
            icon: q(() => [
              k(c(pe), { icon: "tabler:plus" })
            ]),
            _: 1
          }),
          k(c(ae), {
            label: "Add transition",
            severity: "secondary",
            outlined: "",
            disabled: $.value.states.length < 2,
            onClick: A[2] || (A[2] = (G) => M($.value, G.currentTarget))
          }, null, 8, ["disabled"]),
          k(c(he), {
            modelValue: $.value.initial,
            "onUpdate:modelValue": A[3] || (A[3] = (G) => $.value.initial = G),
            "aria-label": "Starts in " + c(ke)($.value.states.find((G) => G.id === $.value.initial)),
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            options: $.value.states.map((G) => ({ label: c(ke)(G), value: G.id }))
          }, {
            value: q(() => [
              s("span", Kc, "Starts in " + S(c(ke)($.value.states.find((G) => G.id === $.value.initial))), 1)
            ]),
            _: 1
          }, 8, ["modelValue", "aria-label", "options"]),
          A[18] || (A[18] = s("span", { class: "work-spacer" }, null, -1)),
          u.value === "Map" ? (n(), f("div", Hc, [
            k(c(ae), {
              label: "Fit",
              title: "Fit the map to a readable width",
              text: "",
              severity: "secondary",
              size: "small",
              onClick: A[4] || (A[4] = (G) => g.value?.fit())
            }, {
              icon: q(() => [
                k(c(pe), { icon: "tabler:arrows-maximize" })
              ]),
              _: 1
            }),
            u.value === "Map" ? (n(), K(c(ae), {
              key: 0,
              "aria-label": "Zoom out",
              title: "Zoom out",
              text: "",
              severity: "secondary",
              size: "small",
              onClick: A[5] || (A[5] = (G) => g.value?.zoomOut())
            }, {
              default: q(() => [
                k(c(pe), { icon: "tabler:minus" })
              ]),
              _: 1
            })) : C("", !0),
            u.value === "Map" ? (n(), K(c(ae), {
              key: 1,
              "aria-label": "Zoom in",
              title: "Zoom in",
              text: "",
              severity: "secondary",
              size: "small",
              onClick: A[6] || (A[6] = (G) => g.value?.zoomIn())
            }, {
              default: q(() => [
                k(c(pe), { icon: "tabler:plus" })
              ]),
              _: 1
            })) : C("", !0)
          ])) : C("", !0),
          k(c(Hl), {
            "model-value": u.value,
            "onUpdate:modelValue": z,
            options: ["Map", "List"],
            "allow-empty": !1,
            "aria-label": "Workflow layout"
          }, null, 8, ["model-value"]),
          k(c(ae), {
            label: "New process",
            "aria-label": "New process",
            text: "",
            severity: "secondary",
            onClick: A[7] || (A[7] = (G) => v.value = !0)
          }, {
            icon: q(() => [
              k(c(pe), { icon: "tabler:plus" })
            ]),
            _: 1
          })
        ], 512),
        u.value === "Map" ? (n(), K(Nd, {
          key: 0,
          ref_key: "graph",
          ref: g,
          process: $.value,
          draft: e.draft,
          "fit-on-open": "",
          "selected-state": d.value,
          "selected-transition": V.value,
          onState: be,
          onTransition: se,
          onRemoveTransition: A[8] || (A[8] = (G) => p.value?.removeByShortcut(G)),
          onConnect: j,
          onClear: A[9] || (A[9] = (G) => p.value?.close())
        }, null, 8, ["process", "draft", "selected-state", "selected-transition"])) : (n(), K(su, {
          key: 1,
          process: $.value,
          draft: e.draft,
          guards: _.value,
          "selected-state": d.value,
          "selected-transition": V.value,
          counts: R.value,
          onState: be,
          onTransition: se,
          onRemoveState: A[10] || (A[10] = (G) => y($.value, G)),
          onRemoveTransition: ce
        }, null, 8, ["process", "draft", "guards", "selected-state", "selected-transition", "counts"])),
        k(qc, {
          ref_key: "inspector",
          ref: p,
          process: $.value,
          draft: e.draft,
          "board-id": e.boardId,
          guards: _.value,
          error: i.value,
          "selected-state": d.value,
          "selected-transition": V.value,
          "inserted-route": T.value,
          "process-counts": R.value,
          onClose: me,
          onFocusEditor: ge,
          onKind: H,
          onConnect: j,
          onRemoveState: A[11] || (A[11] = (G) => y($.value, G)),
          onRemoveTransition: ce,
          onValidity: A[12] || (A[12] = (G, re) => l("validity", G, re))
        }, null, 8, ["process", "draft", "board-id", "guards", "error", "selected-state", "selected-transition", "inserted-route", "process-counts"])
      ], 2)) : (n(), K(c(ae), {
        key: 2,
        label: "New process",
        severity: "secondary",
        outlined: "",
        onClick: A[13] || (A[13] = (G) => v.value = !0)
      }, {
        icon: q(() => [
          k(c(pe), { icon: "tabler:plus" })
        ]),
        _: 1
      })),
      $.value ? (n(), K(je, {
        key: 3,
        class: "work-disclosure",
        label: "Advanced workflow settings"
      }, {
        default: q(() => [
          s("div", Yc, [
            k(je, {
              class: "work-small",
              label: "Technical details"
            }, {
              default: q(() => [...A[19] || (A[19] = [
                s("p", null, [
                  W("Workflow definitions are "),
                  s("code", null, "processes"),
                  W(" in "),
                  s("code", null, "WorkGetSchema"),
                  W(" and "),
                  s("code", null, "WorkApplySchema"),
                  W(".")
                ], -1)
              ])]),
              _: 1
            }),
            s("label", Xc, [
              A[20] || (A[20] = W("Workflow name", -1)),
              k(c(Re), {
                modelValue: $.value.name,
                "onUpdate:modelValue": A[14] || (A[14] = (G) => $.value.name = G),
                "aria-label": "Workflow name"
              }, null, 8, ["modelValue"])
            ]),
            L.value.length ? (n(), f("p", Jc, "Some item limits belong to removed states.")) : C("", !0),
            (n(!0), f(ee, null, fe(L.value, (G, re) => (n(), K(c(ae), {
              key: G,
              label: "Clear limit for removed state " + (re + 1),
              severity: "secondary",
              text: "",
              onClick: (te) => delete e.draft.policy.wip[G]
            }, null, 8, ["label", "onClick"]))), 128)),
            k(c(ae), {
              label: "Remove workflow",
              severity: "danger",
              text: "",
              size: "small",
              onClick: A[15] || (A[15] = (G) => U($.value))
            })
          ])
        ]),
        _: 1
      })) : C("", !0),
      k(Rl, {
        visible: v.value,
        "return-focus": e.creationOpener,
        label: "New process",
        onClose: xe
      }, {
        default: q(() => [
          s("form", {
            class: "work-dialog-box",
            "aria-label": "New process",
            onSubmit: Be(ie, ["stop", "prevent"])
          }, [
            A[22] || (A[22] = s("h2", null, "New process", -1)),
            s("label", Zc, [
              A[21] || (A[21] = W("Name", -1)),
              k(c(Re), {
                modelValue: m.value,
                "onUpdate:modelValue": A[16] || (A[16] = (G) => m.value = G),
                "aria-label": "New process name",
                autofocus: "",
                required: ""
              }, null, 8, ["modelValue"])
            ]),
            s("div", Qc, [
              k(c(ae), {
                label: "Cancel",
                severity: "secondary",
                outlined: "",
                onClick: xe
              }),
              k(c(ae), {
                label: "Create process",
                type: "submit",
                disabled: !m.value.trim()
              }, null, 8, ["disabled"])
            ])
          ], 32)
        ]),
        _: 1
      }, 8, ["visible", "return-focus"])
    ], 544));
  }
}), ev = {
  class: "work-settings-card work-stack",
  "aria-label": "Existing items"
}, tv = {
  key: 0,
  class: "work-stack work-tight"
}, av = { class: "work-row" }, lv = /* @__PURE__ */ Se({
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
    return (t, l) => (n(), f("section", ev, [
      l[2] || (l[2] = s("h3", { class: "work-row-title" }, "Items in changed states", -1)),
      (n(!0), f(ee, null, fe(e.removed, ({ process: o, state: r, count: v }) => (n(), f("label", {
        key: o.id + "/" + r.id,
        class: "work-stack work-tight"
      }, [
        W(" Move " + S(a(v)) + " from " + S(c(ke)(r)) + " to ", 1),
        k(c(he), {
          disabled: e.disabled,
          "model-value": o.map?.[r.id],
          "aria-label": "Move items from " + c(ke)(r) + " to",
          placeholder: "Choose a state",
          appendTo: "self",
          optionLabel: "label",
          optionValue: "value",
          options: o.states.map((m) => ({ label: c(ke)(m), value: m.id })),
          "onUpdate:modelValue": (m) => t.$emit("destination", o, r.id, m)
        }, null, 8, ["disabled", "model-value", "aria-label", "options", "onUpdate:modelValue"])
      ]))), 128)),
      e.renamed.length ? (n(), f("div", tv, [
        (n(!0), f(ee, null, fe(e.renamed, ({ process: o, state: r, count: v, name: m }) => (n(), f("p", {
          key: o.id + "/" + r.id
        }, [
          W(S(c(ke)(r)) + " becomes ", 1),
          s("strong", null, S(m), 1),
          W(" for " + S(a(v)) + ". ", 1)
        ]))), 128)),
        s("label", av, [
          k(c(Lt), {
            binary: "",
            "model-value": e.confirmed,
            disabled: e.disabled,
            "onUpdate:modelValue": l[0] || (l[0] = (o) => t.$emit("update:confirmed", o))
          }, null, 8, ["model-value", "disabled"]),
          l[1] || (l[1] = W(" Keep these items in their renamed states ", -1))
        ])
      ])) : C("", !0)
    ]));
  }
}), ov = {
  class: "work-stack",
  "aria-label": "Links editor"
}, iv = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, nv = { class: "work-definition-meta work-muted work-small" }, sv = { class: "work-settings-grid" }, rv = { class: "work-stack work-tight" }, dv = {
  key: 0,
  class: "work-stack work-tight"
}, uv = { class: "work-stack work-tight" }, cv = { class: "work-row" }, vv = {
  key: 0,
  class: "work-muted work-small"
}, fv = {
  key: 1,
  class: "work-stack work-tight"
}, mv = { class: "work-settings-grid" }, pv = {
  key: 0,
  class: "work-chips"
}, gv = { class: "work-stack work-tight" }, hv = { class: "work-relation-preview work-small" }, bv = {
  key: 0,
  class: "work-muted"
}, yv = {
  key: 0,
  class: "kx-empty"
}, kv = /* @__PURE__ */ Se({
  __name: "RelationsEditor",
  props: {
    draft: {},
    guardRemoval: { type: Function }
  },
  setup(e) {
    const a = e, t = F(() => a.draft.relation_types ?? []), l = F(() => (a.draft.item_types ?? []).map((h) => ({ value: h.id, label: h.title || Me(h.id) })));
    function o(h, p, w) {
      w.length ? h[p] = w : delete h[p];
    }
    function r(h, p) {
      if (!/^[a-z][a-z0-9_]{0,39}$/.test(p)) return "Start with a lowercase letter and use only lowercase letters, numbers or underscores.";
      if (h.to_types?.includes(p)) return "This ID is already in use.";
    }
    function v(h, p) {
      o(h, "to_types", [...h.to_types ?? [], p]);
    }
    function m(h) {
      return (h.to_types ?? []).filter((p) => l.value.some((w) => w.value === p));
    }
    function b(h) {
      return (h.to_types ?? []).filter((p) => !l.value.some((w) => w.value === p));
    }
    const i = B(""), u = B(!1);
    function d(h) {
      const p = h.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, ""), w = (/^[a-z]/.test(p) ? p : "link_" + (p || "new")).slice(0, 40);
      let x = w, $ = 2;
      for (; t.value.some((T) => T.id === x); ) {
        const T = "_" + $++;
        x = w.slice(0, 40 - T.length) + T;
      }
      return x;
    }
    function V(h) {
      (a.draft.relation_types ??= []).push({ id: d(h), outward: h, inward: h, cardinality: "many" });
    }
    async function g(h) {
      if (!u.value) {
        u.value = !0, i.value = "";
        try {
          const p = await a.guardRemoval?.("relation_types", h);
          p ? i.value = p : Ra(a.draft, "relation_types", h);
        } finally {
          u.value = !1;
        }
      }
    }
    return (h, p) => (n(), f("section", ov, [
      i.value ? (n(), f("p", iv, S(i.value), 1)) : C("", !0),
      k(Jl, {
        columns: "relations",
        count: t.value.length
      }, {
        default: q(() => [
          (n(!0), f(ee, null, fe(t.value, (w, x) => (n(), K(Xl, {
            "route-section": "links",
            "route-id": w.id,
            title: w.outward || c(Me)(w.id),
            kind: w.symmetric ? "Same both ways" : "Different each way",
            key: x,
            class: "work-stack"
          }, Da({
            actions: q(() => [
              k(c(ae), {
                severity: "secondary",
                text: "",
                disabled: u.value,
                onClick: ($) => g(w.id),
                "aria-label": "Remove link type",
                size: "small"
              }, {
                default: q(() => [
                  k(c(pe), {
                    icon: "tabler:trash",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["disabled", "onClick"])
            ]),
            default: q(() => [
              s("div", sv, [
                s("label", rv, [
                  p[0] || (p[0] = W("Shown on this item ", -1)),
                  k(c(Re), {
                    modelValue: w.outward,
                    "onUpdate:modelValue": ($) => w.outward = $,
                    "aria-label": "Shown on this item"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                w.symmetric ? C("", !0) : (n(), f("label", dv, [
                  p[1] || (p[1] = W("Shown on the other item ", -1)),
                  k(c(Re), {
                    modelValue: w.inward,
                    "onUpdate:modelValue": ($) => w.inward = $,
                    "aria-label": "Shown on the other item"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ])),
                s("label", uv, [
                  p[2] || (p[2] = W("Links allowed ", -1)),
                  k(c(he), {
                    "model-value": w.cardinality ?? "many",
                    "onUpdate:modelValue": ($) => w.cardinality = $,
                    "aria-label": "Links allowed",
                    appendTo: "self",
                    optionLabel: "label",
                    optionValue: "value",
                    optionDisabled: "disabled",
                    options: [{ label: "One link", value: "one", disabled: !1 }, { label: "Many links", value: "many", disabled: !1 }]
                  }, null, 8, ["model-value", "onUpdate:modelValue"])
                ]),
                s("label", cv, [
                  k(c(Lt), {
                    modelValue: w.symmetric,
                    "onUpdate:modelValue": ($) => w.symmetric = $,
                    disabled: !!(w.from_types?.length || w.to_types?.length),
                    "aria-label": "Same meaning in both directions",
                    binary: ""
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"]),
                  p[3] || (p[3] = W("Same meaning in both directions ", -1))
                ])
              ]),
              w.from_types?.length || w.to_types?.length ? (n(), f("p", vv, " Clear the source and target types to use the same meaning in both directions. ")) : C("", !0),
              w.symmetric ? C("", !0) : (n(), f("div", fv, [
                p[5] || (p[5] = s("p", { class: "work-muted work-small" }, "Leave either end empty to allow any item type there.", -1)),
                s("div", mv, [
                  k(gt, {
                    label: "Source item types",
                    options: l.value,
                    "model-value": w.from_types,
                    "onUpdate:modelValue": ($) => o(w, "from_types", $)
                  }, null, 8, ["options", "model-value", "onUpdate:modelValue"]),
                  k(gt, {
                    label: "Target item types",
                    options: l.value,
                    "model-value": m(w),
                    "onUpdate:modelValue": ($) => o(w, "to_types", [...$, ...b(w)])
                  }, null, 8, ["options", "model-value", "onUpdate:modelValue"])
                ]),
                k(je, {
                  class: "work-disclosure",
                  label: "Peer board target types"
                }, {
                  default: q(() => [
                    p[4] || (p[4] = s("p", { class: "work-muted work-small" }, "Enter a type ID to allow that type from a peer board.", -1)),
                    b(w).length ? (n(), f("div", pv, [
                      (n(!0), f(ee, null, fe(b(w), ($) => (n(), K(c(ae), {
                        key: $,
                        severity: "secondary",
                        text: "",
                        size: "small",
                        label: $ + " ×",
                        "aria-label": "Remove target type " + $,
                        onClick: (T) => o(w, "to_types", w.to_types?.filter((D) => D !== $) ?? [])
                      }, null, 8, ["label", "aria-label", "onClick"]))), 128))
                    ])) : C("", !0),
                    k(Ua, {
                      action: "Add target type",
                      label: "Target type ID",
                      maxlength: 40,
                      validate: ($) => r(w, $),
                      onAdd: ($) => v(w, $)
                    }, null, 8, ["validate", "onAdd"])
                  ]),
                  _: 2
                }, 1024)
              ])),
              k(je, {
                class: "work-disclosure",
                label: "Advanced link settings"
              }, {
                default: q(() => [
                  s("label", gv, [
                    p[6] || (p[6] = W("Identifier ", -1)),
                    k(c(Re), {
                      modelValue: w.id,
                      "onUpdate:modelValue": ($) => w.id = $,
                      required: "",
                      pattern: "[a-z][a-z0-9_]*",
                      "aria-label": "Relation ID"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ])
                ]),
                _: 2
              }, 1024),
              s("p", hv, [
                p[7] || (p[7] = s("strong", null, "This item", -1)),
                W(" " + S(w.outward || "relates to") + " ", 1),
                p[8] || (p[8] = s("strong", null, "another item", -1)),
                !w.symmetric && w.inward && w.inward !== w.outward ? (n(), f("span", bv, " · reverse: " + S(w.inward), 1)) : C("", !0)
              ])
            ]),
            _: 2
          }, [
            !w.symmetric && w.inward && w.inward !== w.outward ? {
              name: "usage",
              fn: q(() => [
                s("span", nv, S(w.inward), 1)
              ]),
              key: "0"
            } : void 0
          ]), 1032, ["route-id", "title", "kind"]))), 128)),
          t.value.length ? C("", !0) : (n(), f("p", yv, "No link types yet. Add one to connect related work.")),
          k(Ua, {
            action: "Add link type",
            label: "Link name",
            onAdd: V
          })
        ]),
        _: 1
      }, 8, ["count"])
    ]));
  }
}), wv = ["aria-labelledby"], $v = {
  key: 0,
  class: "kx-settings-group-head"
}, Vv = ["id"], xv = {
  key: 0,
  class: "kx-settings-group-count"
}, Cv = { class: "kx-settings-group-list" }, Dl = /* @__PURE__ */ Se({
  __name: "SettingsGroup",
  props: {
    title: {},
    count: {}
  },
  setup(e) {
    const a = $t();
    return (t, l) => (n(), f("section", {
      class: "kx-settings-group",
      "aria-labelledby": e.title ? c(a) : void 0
    }, [
      e.title ? (n(), f("div", $v, [
        s("h2", {
          id: c(a),
          class: "kx-settings-group-title"
        }, S(e.title), 9, Vv),
        e.count !== void 0 ? (n(), f("span", xv, S(e.count), 1)) : C("", !0)
      ])) : C("", !0),
      s("div", Cv, [
        Ye(t.$slots, "default")
      ])
    ], 8, wv));
  }
}), Sv = { class: "kx-settings-item-head" }, Tv = { class: "kx-settings-item-main" }, Iv = { class: "kx-settings-item-line" }, Dv = { class: "kx-settings-item-title" }, Uv = {
  key: 0,
  class: "kx-settings-item-desc"
}, Av = {
  key: 1,
  class: "kx-settings-item-meta"
}, Ev = { class: "kx-settings-item-actions" }, Rv = ["aria-expanded", "aria-controls", "aria-label"], Ov = ["id", "inert"], Pv = { class: "kx-settings-item-clip" }, Nv = { class: "kx-settings-item-body" }, Ul = /* @__PURE__ */ Se({
  __name: "SettingsItem",
  props: /* @__PURE__ */ Oo({
    title: {},
    description: {},
    expandLabel: {},
    keepMounted: { type: Boolean }
  }, {
    open: { type: Boolean, default: !1 },
    openModifiers: {}
  }),
  emits: ["update:open"],
  setup(e) {
    const a = e, t = Eo(e, "open"), l = Ro(), o = $t(), r = B(t.value);
    return Ue(t, (v) => {
      v && (r.value = !0);
    }), (v, m) => (n(), f("article", {
      class: pt(["kx-settings-item", { "kx-settings-item-open": t.value && c(l).default }])
    }, [
      s("div", Sv, [
        s("div", Tv, [
          s("div", Iv, [
            s("h3", Dv, S(e.title), 1),
            Ye(v.$slots, "status")
          ]),
          e.description ? (n(), f("p", Uv, S(e.description), 1)) : C("", !0),
          c(l).meta ? (n(), f("p", Av, [
            Ye(v.$slots, "meta")
          ])) : C("", !0)
        ]),
        s("div", Ev, [
          c(l).default ? (n(), f("button", {
            key: 0,
            type: "button",
            class: "kx-settings-item-expand",
            "aria-expanded": t.value,
            "aria-controls": c(o),
            "aria-label": (e.expandLabel || "Details") + " " + e.title,
            onClick: m[0] || (m[0] = (b) => t.value = !t.value)
          }, [
            s("span", null, S(e.expandLabel || "Details"), 1),
            k(c(pe), {
              icon: "tabler:chevron-down",
              "aria-hidden": "true"
            })
          ], 8, Rv)) : C("", !0),
          Ye(v.$slots, "actions")
        ])
      ]),
      c(l).default ? (n(), K(Gl, {
        key: 0,
        name: "kx-settings-item-motion"
      }, {
        default: q(() => [
          r.value || a.keepMounted ? yt((n(), f("div", {
            key: 0,
            id: c(o),
            inert: !t.value,
            class: "kx-settings-item-panel"
          }, [
            s("div", Pv, [
              s("div", Nv, [
                Ye(v.$slots, "default")
              ])
            ])
          ], 8, Ov)), [
            [It, t.value]
          ]) : C("", !0)
        ]),
        _: 3
      })) : C("", !0)
    ], 2));
  }
});
function lo(e) {
  return typeof e.error == "string" ? e.error : e.error?.message;
}
function Mv(e, a) {
  const t = lo(e);
  return e.parked ? "Stopped: " + (t ?? "Projection is parked") : t ? "Degraded: " + t : e.bootstrapping ? "Initializing" : e.last_seq >= a ? "Up to date" : "Catching up";
}
function Fv(e, a) {
  const t = a?.lifecycle.error, l = a?.problem ?? e.problem;
  if (e.installed === !1)
    return { kind: "missing", status: "Not installed", cause: "This board still references a plugin that is no longer installed." };
  if (l?.code === "plugin_config_invalid" || t?.code === "plugin_config_invalid")
    return { kind: "configuration", status: "Needs configuration", cause: l?.message ?? t?.message };
  if (l) return { kind: "manifest", status: "Unavailable", cause: l.message };
  if (t?.source === "schema_provider")
    return { kind: "provider", status: "Setup failed", cause: "The plugin could not prepare its fields: " + t.message };
  if (t?.code === "plugin_projection_gap")
    return { kind: "history", status: "Needs attention", cause: t.message, floor: t.floor };
  if (a?.lifecycle.state === "failed")
    return { kind: "setup", status: "Setup failed", cause: t?.message ?? "Work could not prepare the plugin attachment." };
  const o = Object.values(a?.projections ?? {});
  if (o.some((r) => r.parked)) return { kind: "reset", status: "Stopped" };
  if (o.some(lo)) return { kind: "degraded", status: "Needs attention" };
}
function Lv(e, a, t) {
  const l = /* @__PURE__ */ new Map();
  for (const r of e) {
    const v = a(r)?.trim() ?? "", m = l.get(v);
    m ? m.push(r) : l.set(v, [r]);
  }
  const o = [...l].map(([r, v]) => ({
    title: r,
    rows: [...v.filter(t), ...v.filter((m) => !t(m))]
  }));
  return o.length === 1 && o[0].title === "" ? o : o.map((r) => r.title ? r : { ...r, title: "Other" }).sort((r, v) => r.title === "Other" ? 1 : v.title === "Other" ? -1 : r.title.localeCompare(v.title));
}
function Al(e) {
  return e.length < 2 ? e[0] ?? "" : e.slice(0, -1).join(", ") + " and " + e[e.length - 1];
}
const Bv = {
  class: "work-stack work-plugins",
  "aria-label": "Plugins editor"
}, zv = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, jv = {
  key: 1,
  class: "work-notice",
  role: "status"
}, qv = {
  key: 2,
  class: "work-muted work-small",
  role: "status"
}, Wv = {
  key: 3,
  class: "kx-loading"
}, Gv = { class: "work-stack work-tight" }, Kv = { key: 0 }, Hv = { key: 0 }, Yv = { key: 1 }, Xv = { key: 2 }, Jv = {
  key: 3,
  class: "work-block work-error"
}, Zv = { class: "work-stack work-tight" }, Qv = { key: 0 }, _v = { key: 1 }, ef = { key: 2 }, tf = {
  key: 3,
  class: "work-small"
}, af = {
  key: 4,
  class: "work-small"
}, lf = {
  key: 5,
  class: "work-small"
}, of = { class: "work-row" }, nf = ["aria-label"], sf = {
  key: 0,
  class: "work-muted"
}, rf = ["id"], df = { class: "work-row" }, uf = {
  key: 2,
  class: "work-stack work-tight"
}, cf = {
  key: 3,
  class: "work-muted work-small"
}, vf = { class: "work-stack work-tight" }, ff = { key: 0 }, mf = { key: 1 }, pf = { key: 2 }, gf = { key: 3 }, hf = "kickside.work.planning:plugin", Io = /* @__PURE__ */ Se({
  __name: "PluginsEditor",
  props: {
    boardId: {},
    draft: {},
    schema: {},
    options: {},
    configs: {},
    disabled: { type: Boolean },
    activationLocked: { type: Boolean },
    filters: {},
    pack: {}
  },
  emits: ["configured", "refresh", "review", "upgrade", "validity", "widget-validity"],
  setup(e, { expose: a, emit: t }) {
    const l = e, o = t, r = B(""), v = B(""), m = B(""), b = B({}), i = il(sl, void 0), u = B(/* @__PURE__ */ new Set()), d = B(/* @__PURE__ */ new Set()), V = B({}), g = /* @__PURE__ */ new Map(), h = B({}), p = { Enabled: "success", Available: "secondary", "Setting up": "info", "Catching up": "info", "Turns on when applied": "info", "Turns off when applied": "info" }, w = F(() => l.options.map((O) => {
      const Y = j(O.plugin), ye = Fv(O, Y), ve = ce(O.plugin), We = Y?.active === !0, Te = ve && u.value.has(O.plugin) ? "Needs configuration" : ve !== We ? ve ? "Turns on when applied" : "Turns off when applied" : ye?.status ?? (We ? Y.lifecycle.state !== "ready" ? "Setting up" : H(Y) ? "Catching up" : "Enabled" : "Available"), rt = p[Te] ?? (ye?.kind === "missing" || ye?.kind === "manifest" ? "danger" : "warn"), at = O.installed === !1 ? "Unavailable plugin" : O.title || "Unnamed plugin", jt = ve && xe(O) && ye?.kind !== "manifest" && ye?.kind !== "missing", St = _(O.plugin).length > 0 && (ve || We);
      return { plugin: O, current: Y, issue: ye, chosen: ve, enabled: We, status: Te, severity: rt, title: at, configurable: jt, filtered: St, needs: se(O), usedBy: R(O.plugin) };
    })), x = F(() => Lv(w.value, (O) => O.plugin.category, (O) => O.enabled)), $ = F(() => !!r.value || l.disabled), T = F(() => $.value || l.activationLocked), D = {}, z = $t(), le = F(() => (l.draft.item_types ?? []).filter((O) => !["issue", "sprint", "milestone"].includes(O.id)).map((O) => ({ value: O.id, label: O.title || Me(O.id) }))), Z = F(() => ["current_sprint", "milestone"].every((O) => l.schema.compiled?.fields?.some((Y) => Y.code === O))), ue = F(() => {
      const O = l.filters;
      return O ? (l.draft.scopes ?? []).filter((Y) => !O.some((ye) => ye.id === Y && l.options.some((ve) => ve.plugin === ye.plugin))) : [];
    }), me = F(() => l.draft.plugins?.filter((O) => !l.options.some((Y) => Y.plugin === O.use)) ?? []), ge = F(() => !l.activationLocked && w.value.some((O) => O.chosen !== O.enabled));
    function be(O) {
      return l.options.find((Y) => Y.plugin === O)?.title || "Another plugin";
    }
    function se(O) {
      return O.requires.map(be);
    }
    function R(O) {
      return [
        ...l.pack?.requires.includes(O) ? [l.pack.title] : [],
        ...l.options.filter((Y) => Y.requires.includes(O) && ce(Y.plugin)).map((Y) => Y.title || "Another plugin")
      ];
    }
    function _(O) {
      return (l.filters ?? []).filter((Y) => Y.plugin === O);
    }
    function L(O, Y) {
      const ye = new Set(_(O).map((Te) => Te.id)), ve = l.draft.scopes ?? [], We = [...ve.filter((Te) => !ye.has(Te)), ...Y];
      (We.length !== ve.length || We.some((Te) => !ve.includes(Te))) && (l.draft.scopes = We);
    }
    function ie(O, Y) {
      re(O, { ...G(O), issue_types: Y });
    }
    function xe(O) {
      return !!O.config_schema && Qa(O.config_schema).length > 0;
    }
    function Oe(O, Y) {
      return Qa(O.config_schema ?? {}).find((ye) => ye.key === Y)?.title ?? Me(Y);
    }
    function H(O) {
      return Object.values(O.projections).some((Y) => !Y.parked && (Y.bootstrapping || Y.last_seq < l.schema.as_of));
    }
    function j(O) {
      return l.schema.plugins?.find((Y) => Y.plugin === O);
    }
    function M(O) {
      return j(O)?.active === !0;
    }
    function ce(O) {
      return l.draft.plugins?.some((Y) => Y.use === O) === !0;
    }
    function y(O, Y) {
      return b.value[O] ?? !!Y;
    }
    function U(O, Y) {
      b.value[O] = Y, i?.choose("plugins", O, Y);
    }
    Ue(() => i?.selected.value, (O, Y) => {
      for (const [ye, ve] of [[Y, !1], [O, !0]])
        ye?.startsWith("plugins/") && (b.value[ye.slice(8)] = ve);
    }, { immediate: !0 });
    function P(O, Y) {
      const ye = l.draft.plugins ?? [];
      Y && !ce(O) && (l.draft.plugins = [...ye, { use: O }], l.options.some((ve) => ve.plugin === O && xe(ve)) && U(O, !0)), Y || (l.draft.plugins = ye.filter((ve) => ve.use !== O), delete l.configs[O], u.value.delete(O), o("validity", O, !0), I(O, !0), L(O, []));
    }
    function A(O, Y) {
      P(O, !1), o("review", Y.currentTarget);
    }
    function G(O) {
      return l.configs[O] ?? j(O)?.config ?? D;
    }
    function re(O, Y) {
      m.value = "", l.configs[O] = Y;
    }
    function te(O) {
      delete l.configs[O], V.value[O] = (V.value[O] ?? 0) + 1;
    }
    function I(O, Y) {
      Y || !ce(O) ? d.value.delete(O) : d.value.add(O), o("widget-validity", O, !d.value.has(O));
    }
    async function Q() {
      const O = w.value.find(({ plugin: Y, chosen: ye }) => ye && d.value.has(Y.plugin));
      return O ? (b.value[O.plugin.plugin] = !0, await wt(), g.get(O.plugin.plugin)?.reportValidity(), !1) : !0;
    }
    a({ reportValidity: Q });
    function E(O, Y) {
      Y ? u.value.delete(O) : u.value.add(O), o("validity", O, Y || !ce(O) || M(O) && !l.configs[O]);
    }
    function oe(O) {
      for (const Y of Object.values(j(O)?.projections ?? {})) {
        const ye = lo(Y);
        if (ye) return ye;
      }
    }
    async function Ve(O) {
      await qo.confirm({
        header: "Reset background updates?",
        message: "The plugin rebuilds its data from current items or replays retained events.",
        acceptLabel: "Reset background updates",
        rejectLabel: "Cancel"
      }) && await Pe(O);
    }
    async function Pe(O) {
      if (!$.value) {
        r.value = O, v.value = "", m.value = "";
        try {
          await Qt.configure(l.boardId, O), m.value = "Plugin recovery started.", o("configured");
        } catch (Y) {
          v.value = mt(Y, "Could not recover the plugin.");
        } finally {
          r.value = "";
        }
      }
    }
    return (O, Y) => (n(), f("section", Bv, [
      v.value ? (n(), f("div", zv, S(v.value), 1)) : C("", !0),
      m.value ? (n(), f("p", jv, S(m.value), 1)) : C("", !0),
      ge.value ? (n(), f("p", qv, "Plugin changes take effect after you review and apply them.")) : C("", !0),
      !e.options.length && !e.pack ? (n(), f("p", Wv, "No installed plugins are visible to you.")) : C("", !0),
      e.pack ? (n(), K(Dl, {
        key: 4,
        title: "Pack",
        count: 1
      }, {
        default: q(() => [
          k(Ul, {
            title: e.pack.title,
            description: e.pack.description,
            "expand-label": "Details",
            open: y("pack", !1),
            "onUpdate:open": Y[1] || (Y[1] = (ye) => b.value.pack = ye)
          }, Da({
            status: q(() => [
              k(c(et), {
                class: "kx-tag-sm work-plugin-state",
                severity: e.pack.outdated ? "info" : "success",
                value: e.pack.outdated ? "Update available" : "Installed"
              }, null, 8, ["severity", "value"])
            ]),
            default: q(() => [
              Y[6] || (Y[6] = s("p", { class: "work-muted work-small" }, "The pack set up this board’s item types, workflow and views. Turning off a plugin it needs can remove parts of that setup.", -1)),
              k(je, {
                class: "work-disclosure work-small",
                label: "Technical details"
              }, {
                default: q(() => [
                  s("dl", Gv, [
                    s("div", null, [
                      Y[3] || (Y[3] = s("dt", null, "Pack ID", -1)),
                      s("dd", null, [
                        s("code", null, S(e.pack.id), 1)
                      ])
                    ]),
                    e.pack.version ? (n(), f("div", Kv, [
                      Y[4] || (Y[4] = s("dt", null, "Installed version", -1)),
                      s("dd", null, S(e.pack.version), 1)
                    ])) : C("", !0),
                    Y[5] || (Y[5] = s("div", null, [
                      s("dt", null, "Pack tools"),
                      s("dd", null, [
                        s("code", null, "WorkPackPlan"),
                        W(", "),
                        s("code", null, "WorkPackApply")
                      ])
                    ], -1))
                  ])
                ]),
                _: 1
              })
            ]),
            _: 2
          }, [
            e.pack.requires.length ? {
              name: "meta",
              fn: q(() => [
                W("Needs " + S(c(Al)(e.pack.requires.map(be))), 1)
              ]),
              key: "0"
            } : void 0,
            e.pack.outdated ? {
              name: "actions",
              fn: q(() => [
                k(c(ae), {
                  label: "Review update",
                  severity: "secondary",
                  outlined: "",
                  size: "small",
                  disabled: !e.pack.canUpgrade,
                  title: e.pack.upgradeReason,
                  onClick: Y[0] || (Y[0] = (ye) => o("upgrade"))
                }, null, 8, ["disabled", "title"])
              ]),
              key: "1"
            } : void 0
          ]), 1032, ["title", "description", "open"])
        ]),
        _: 1
      })) : C("", !0),
      (n(!0), f(ee, null, fe(x.value, (ye) => (n(), K(Dl, {
        key: ye.title,
        title: ye.title || void 0,
        count: ye.title ? ye.rows.length : void 0
      }, {
        default: q(() => [
          (n(!0), f(ee, null, fe(ye.rows, ({ plugin: ve, current: We, issue: Te, chosen: rt, status: at, severity: jt, title: St, configurable: vt, filtered: fa, needs: _t, usedBy: qt }) => (n(), K(Ul, {
            key: ve.plugin,
            "data-plugin": ve.plugin,
            title: St,
            description: ve.description,
            "expand-label": vt || fa ? "Configure" : "Details",
            "keep-mounted": rt,
            open: y(ve.plugin, Te),
            "onUpdate:open": (Ie) => U(ve.plugin, Ie)
          }, Da({
            status: q(() => [
              k(c(et), {
                class: "kx-tag-sm work-plugin-state",
                severity: jt,
                value: at
              }, null, 8, ["severity", "value"])
            ]),
            default: q(() => [
              Te ? (n(), K(c(Wo), {
                key: 0,
                class: "work-plugin-issue",
                severity: "warn",
                closable: !1
              }, {
                default: q(() => [
                  s("div", Zv, [
                    Te.kind === "degraded" ? (n(), f("p", Qv, S(oe(ve.plugin) ?? "A background update reported an error."), 1)) : Te.kind === "reset" ? (n(), f("p", _v, "Background updates stopped" + S(oe(ve.plugin) ? ": " + oe(ve.plugin) : "."), 1)) : "cause" in Te && Te.cause ? (n(), f("p", ef, S(Te.cause), 1)) : C("", !0),
                    Te.kind === "configuration" ? (n(), f("p", tf, "Update the settings below, then review and apply your changes.")) : C("", !0),
                    Te.kind === "history" && Te.floor !== void 0 ? (n(), f("p", af, "Earliest retained event sequence is " + S(Te.floor) + ".", 1)) : C("", !0),
                    Te.kind === "history" ? (n(), f("p", lf, "Ask the plugin maintainer to review the event projection’s start sequence. The plugin needs a declaration that can run with the retained history.")) : C("", !0),
                    s("div", of, [
                      Te.kind === "setup" && We?.active ? (n(), K(c(ae), {
                        key: 0,
                        label: "Retry setup",
                        severity: "secondary",
                        outlined: "",
                        size: "small",
                        disabled: $.value,
                        onClick: (Ie) => Pe(ve.plugin)
                      }, null, 8, ["disabled", "onClick"])) : Te.kind === "provider" || Te.kind === "degraded" ? (n(), K(c(ae), {
                        key: 1,
                        label: "Check again",
                        severity: "secondary",
                        outlined: "",
                        size: "small",
                        onClick: Y[2] || (Y[2] = (Ie) => o("refresh"))
                      })) : Te.kind === "reset" ? (n(), K(c(ae), {
                        key: 2,
                        label: "Reset background updates",
                        severity: "secondary",
                        outlined: "",
                        size: "small",
                        disabled: $.value,
                        onClick: (Ie) => Ve(ve.plugin)
                      }, null, 8, ["disabled", "onClick"])) : Te.kind === "missing" && rt ? (n(), K(c(ae), {
                        key: 3,
                        label: "Review references",
                        severity: "secondary",
                        outlined: "",
                        size: "small",
                        disabled: T.value,
                        onClick: (Ie) => A(ve.plugin, Ie)
                      }, null, 8, ["disabled", "onClick"])) : C("", !0)
                    ])
                  ])
                ]),
                _: 2
              }, 1024)) : C("", !0),
              vt ? (n(), f("section", {
                key: 1,
                class: "work-stack work-plugin-config",
                "aria-label": St + " settings"
              }, [
                ve.plugin === hf ? (n(), f(ee, { key: 0 }, [
                  Z.value ? (n(), K(gt, {
                    key: 1,
                    label: Oe(ve, "issue_types"),
                    "aria-describedby": c(z),
                    options: le.value,
                    "model-value": G(ve.plugin).issue_types,
                    disabled: !!r.value || e.disabled,
                    "onUpdate:modelValue": (Ie) => ie(ve.plugin, Ie)
                  }, null, 8, ["label", "aria-describedby", "options", "model-value", "disabled", "onUpdate:modelValue"])) : (n(), f("p", sf, "The Planning pack supplies sprint and milestone fields for item types.")),
                  s("p", {
                    id: c(z),
                    class: "work-muted work-small"
                  }, "Selected types get Current sprint and Milestone fields.", 8, rf)
                ], 64)) : (n(), K(zo, {
                  key: V.value[ve.plugin],
                  ref_for: !0,
                  ref: (Ie) => {
                    Ie ? c(g).set(ve.plugin, Ie) : c(g).delete(ve.plugin);
                  },
                  disabled: !!r.value || e.disabled,
                  schema: ve.config_schema ?? {},
                  "model-value": G(ve.plugin),
                  "suggest-defaults": "",
                  "onUpdate:modelValue": (Ie) => re(ve.plugin, Ie),
                  onValidity: (Ie) => E(ve.plugin, Ie),
                  onWidgetValidity: (Ie) => I(ve.plugin, Ie),
                  onValidationMessage: (Ie) => h.value[ve.plugin] = Ie
                }, null, 8, ["disabled", "schema", "model-value", "onUpdate:modelValue", "onValidity", "onWidgetValidity", "onValidationMessage"])),
                s("div", df, [
                  k(c(ae), {
                    label: "Restore saved settings",
                    severity: "secondary",
                    outlined: "",
                    size: "small",
                    disabled: !!r.value || e.disabled,
                    onClick: (Ie) => te(ve.plugin)
                  }, null, 8, ["disabled", "onClick"])
                ])
              ], 8, nf)) : C("", !0),
              fa ? (n(), f("section", uf, [
                Y[7] || (Y[7] = s("h4", null, "Filters", -1)),
                Y[8] || (Y[8] = s("p", { class: "work-muted work-small" }, "Choose which filters people can use to narrow down work on this board.", -1)),
                k(gt, {
                  label: "Available filters",
                  disabled: !!r.value || e.disabled || !rt,
                  options: _(ve.plugin).map((Ie) => ({ value: Ie.id, label: Ie.title })),
                  "model-value": e.draft.scopes?.filter((Ie) => _(ve.plugin).some((lt) => lt.id === Ie)),
                  "onUpdate:modelValue": (Ie) => L(ve.plugin, Ie)
                }, null, 8, ["disabled", "options", "model-value", "onUpdate:modelValue"])
              ])) : C("", !0),
              !vt && !fa && !Te ? (n(), f("p", cf, S(rt ? "This plugin has no settings for this board." : "Turn the plugin on to use it on this board."), 1)) : C("", !0),
              k(je, {
                class: "work-disclosure work-small",
                label: "Technical details"
              }, {
                default: q(() => [
                  s("dl", vf, [
                    s("div", null, [
                      Y[9] || (Y[9] = s("dt", null, "Plugin ID", -1)),
                      s("dd", null, [
                        s("code", null, S(ve.plugin), 1)
                      ])
                    ]),
                    (We?.interface_version ?? ve.interface_version) != null ? (n(), f("div", ff, [
                      Y[10] || (Y[10] = s("dt", null, "Interface version", -1)),
                      s("dd", null, S(We?.interface_version ?? ve.interface_version), 1)
                    ])) : C("", !0),
                    We?.version ? (n(), f("div", mf, [
                      Y[11] || (Y[11] = s("dt", null, "Active schema version", -1)),
                      s("dd", null, S(We.version), 1)
                    ])) : C("", !0),
                    ve.installed ? (n(), f("div", pf, [...Y[12] || (Y[12] = [
                      s("dt", null, "Configuration tool", -1),
                      s("dd", null, [
                        s("code", null, "WorkConfigurePlugin")
                      ], -1)
                    ])])) : C("", !0),
                    ve.tools.length ? (n(), f("div", gf, [
                      Y[13] || (Y[13] = s("dt", null, "Plugin tools", -1)),
                      s("dd", null, [
                        (n(!0), f(ee, null, fe(ve.tools, (Ie) => (n(), f("code", {
                          key: Ie,
                          class: "work-block"
                        }, S(Ie), 1))), 128))
                      ])
                    ])) : C("", !0),
                    (n(!0), f(ee, null, fe(We?.projections, (Ie, lt) => (n(), f("div", { key: lt }, [
                      s("dt", null, S(c(Me)(lt)), 1),
                      s("dd", null, S(c(Mv)(Ie, e.schema.as_of)) + " · Indexed through " + S(Ie.last_seq) + " of " + S(e.schema.as_of) + " events.", 1)
                    ]))), 128))
                  ])
                ]),
                _: 2
              }, 1024)
            ]),
            _: 2
          }, [
            _t.length || qt.length || rt && h.value[ve.plugin] ? {
              name: "meta",
              fn: q(() => [
                _t.length ? (n(), f("span", Hv, "Needs " + S(c(Al)(_t)), 1)) : C("", !0),
                _t.length && qt.length ? (n(), f("span", Yv, " · ")) : C("", !0),
                qt.length ? (n(), f("span", Xv, "Used by " + S(c(Al)(qt)), 1)) : C("", !0),
                rt && h.value[ve.plugin] ? (n(), f("span", Jv, S(h.value[ve.plugin]), 1)) : C("", !0)
              ]),
              key: "0"
            } : void 0,
            Te?.kind !== "missing" ? {
              name: "actions",
              fn: q(() => [
                k(c(st), {
                  "model-value": rt,
                  "aria-label": "Enable " + St,
                  disabled: T.value || !!ve.problem && !rt,
                  "onUpdate:modelValue": (Ie) => P(ve.plugin, Ie)
                }, null, 8, ["model-value", "aria-label", "disabled", "onUpdate:modelValue"])
              ]),
              key: "1"
            } : void 0
          ]), 1032, ["data-plugin", "title", "description", "expand-label", "keep-mounted", "open", "onUpdate:open"]))), 128))
        ]),
        _: 2
      }, 1032, ["title", "count"]))), 128)),
      me.value.length ? (n(), K(Dl, {
        key: 5,
        title: "Unavailable",
        count: me.value.length
      }, {
        default: q(() => [
          (n(!0), f(ee, null, fe(me.value, (ye) => (n(), K(Ul, {
            key: ye.use,
            title: "Unavailable plugin",
            description: "This board still references a plugin that is no longer installed."
          }, {
            status: q(() => [
              k(c(et), {
                class: "kx-tag-sm work-plugin-state",
                severity: "danger",
                value: "Not installed"
              })
            ]),
            actions: q(() => [
              k(c(ae), {
                label: "Review references",
                severity: "secondary",
                outlined: "",
                size: "small",
                disabled: T.value,
                onClick: (ve) => A(ye.use, ve)
              }, null, 8, ["disabled", "onClick"])
            ]),
            _: 2
          }, 1024))), 128))
        ]),
        _: 1
      }, 8, ["count"])) : C("", !0),
      ue.value.length ? (n(), K(je, {
        key: 6,
        class: "work-settings-card work-disclosure",
        label: "Unavailable query filters"
      }, {
        default: q(() => [
          Y[14] || (Y[14] = s("p", { class: "work-muted" }, "These filters came from a plugin that is unavailable. Remove one to stop using it on this board.", -1)),
          (n(!0), f(ee, null, fe(ue.value, (ye, ve) => (n(), K(c(ae), {
            key: ye,
            label: "Remove unavailable filter " + (ve + 1),
            severity: "secondary",
            text: "",
            onClick: (We) => e.draft.scopes = e.draft.scopes?.filter((Te) => Te !== ye)
          }, null, 8, ["label", "onClick"]))), 128))
        ]),
        _: 1
      })) : C("", !0)
    ]));
  }
}), bf = { class: "system-section-head" }, yf = { class: "system-section-head-text" }, kf = {
  key: 0,
  class: "kx-head-actions"
}, wf = /* @__PURE__ */ Se({
  __name: "SettingsSectionHead",
  props: {
    title: {},
    description: {}
  },
  setup(e) {
    return (a, t) => (n(), f("header", bf, [
      s("div", yf, [
        s("h1", null, S(e.title), 1),
        s("p", null, S(e.description), 1)
      ]),
      a.$slots.actions ? (n(), f("div", kf, [
        Ye(a.$slots, "actions")
      ])) : C("", !0)
    ]));
  }
}), $f = /* @__PURE__ */ Se({
  __name: "SettingsDraftActions",
  props: {
    busy: { type: Boolean },
    discardDisabled: { type: Boolean },
    reviewDisabled: { type: Boolean }
  },
  emits: ["discard", "review"],
  setup(e) {
    return (a, t) => (n(), f(ee, null, [
      k(c(et), {
        severity: "warn",
        value: "Unsaved changes"
      }),
      k(c(ae), {
        label: "Discard",
        type: "button",
        severity: "secondary",
        outlined: "",
        disabled: e.busy || e.discardDisabled,
        onClick: t[0] || (t[0] = (l) => a.$emit("discard"))
      }, {
        icon: q(() => [
          k(c(pe), {
            icon: "tabler:restore",
            "aria-hidden": "true"
          })
        ]),
        _: 1
      }, 8, ["disabled"]),
      k(c(ae), {
        label: "Review changes",
        type: "button",
        disabled: e.busy || e.reviewDisabled,
        loading: e.busy,
        onClick: t[1] || (t[1] = (l) => a.$emit("review", l.currentTarget))
      }, null, 8, ["disabled", "loading"])
    ], 64));
  }
}), Vf = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, xf = ["config"], Cf = /* @__PURE__ */ Se({
  __name: "BoardShare",
  props: {
    board: {},
    busy: { type: Boolean }
  },
  emits: ["shared"],
  setup(e) {
    const a = e, t = B(!1), l = B(!1), o = B("");
    async function r() {
      const m = a.board;
      if (!(a.busy || l.value)) {
        l.value = !0, o.value = "";
        try {
          const b = await Ft("kickside-share");
          if (a.board.board_id !== m.board_id) return;
          b ? t.value = !0 : o.value = "Sharing is unavailable. Try opening it again.";
        } finally {
          l.value = !1;
        }
      }
    }
    Ue(() => a.board.board_id, () => {
      t.value = !1, o.value = "";
    });
    const v = F(() => {
      const m = encodeURIComponent(a.board.board_id);
      return JSON.stringify({
        resource_id: a.board.board_id,
        title: a.board.title,
        access_url: "/api/v1/component-access/grants/" + m,
        share_url: "/api/v1/component-access/share/" + m
      });
    });
    return (m, b) => (n(), f(ee, null, [
      k(c(ae), {
        label: "Share board",
        severity: "secondary",
        outlined: "",
        loading: l.value,
        disabled: e.busy,
        onClick: r
      }, {
        icon: q(() => [
          k(c(pe), {
            icon: "tabler:share",
            "aria-hidden": "true"
          })
        ]),
        _: 1
      }, 8, ["loading", "disabled"]),
      o.value ? (n(), f("p", Vf, S(o.value), 1)) : C("", !0),
      t.value ? (n(), f("kickside-share", {
        key: 1,
        config: v.value,
        onClose: b[0] || (b[0] = (i) => t.value = !1),
        onChanged: b[1] || (b[1] = (i) => m.$emit("shared"))
      }, null, 40, xf)) : C("", !0)
    ], 64));
  }
}), Sf = {
  class: "work-stack",
  "aria-label": "Board visibility"
}, Tf = { class: "work-stack work-tight" }, If = {
  key: 0,
  class: "work-settings-list"
}, Df = { class: "work-row-main" }, Uf = { class: "work-small work-muted" }, Af = { class: "work-row-control" }, Ef = { class: "work-row" }, Rf = /* @__PURE__ */ Se({
  __name: "VisibilityEditor",
  props: {
    draft: {},
    boardId: {}
  },
  emits: ["validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = F(() => t.draft.visibility), r = F(() => (t.draft.fields ?? []).filter((h) => h.form === "text" && (!h.cardinality || h.cardinality === "one") && h.type !== "rollup" && h.index !== "number" && h.config?.case !== "insensitive")), v = F(() => r.value.find((h) => h.code === o.value?.field)?.type !== "option");
    function m(h) {
      if (o.value?.levels.some((p) => p.id === h)) return "This level is already in use.";
    }
    function b(h) {
      o.value?.levels.push({ id: h, holders: [] });
    }
    function i(h) {
      if (!h) {
        delete t.draft.visibility;
        return;
      }
      const p = r.value.find((w) => w.code === h);
      t.draft.visibility = { field: h, levels: (p?.options ?? []).map((w) => ({ id: w.id, holders: [] })) };
    }
    function u(h, p) {
      const w = o.value?.levels.find((x) => x.id === h);
      w && (w.holders = p ?? []);
    }
    function d(h) {
      if (!h || typeof h != "object" || Array.isArray(h)) return !1;
      const p = Object.entries(h);
      if (p.length !== 1) return !1;
      const [w, x] = p[0];
      return ["group", "user", "service", "field"].includes(w) && typeof x == "string" && x.length > 0;
    }
    function V(h) {
      return !!h && typeof h == "object" && "field" in h && typeof h.field == "string" && (!("bypass" in h) || h.bypass === "admin") && "levels" in h && Array.isArray(h.levels) && h.levels.every((p) => !!p && typeof p == "object" && "id" in p && typeof p.id == "string" && p.id.length > 0 && "holders" in p && Array.isArray(p.holders) && p.holders.every(d));
    }
    function g(h) {
      if (h !== void 0 && !V(h)) return "Enter a field and levels with valid holder rules. Omit bypass or set it to admin.";
      t.draft.visibility = h;
    }
    return (h, p) => (n(), f("section", Sf, [
      p[6] || (p[6] = s("h3", { class: "work-group-title" }, "Board visibility", -1)),
      p[7] || (p[7] = s("p", { class: "work-small work-muted" }, "Restrict items by their visibility level. People still need access to the board.", -1)),
      s("label", Tf, [
        p[4] || (p[4] = W("Visibility field ", -1)),
        k(c(he), {
          "aria-label": "Visibility field",
          "model-value": o.value?.field ?? "",
          placeholder: "No additional restriction",
          options: [{ label: "No additional restriction", value: "" }, ...r.value.map((w) => ({ label: c(Ze)(w), value: w.code }))],
          optionLabel: "label",
          optionValue: "value",
          appendTo: "self",
          "onUpdate:modelValue": i
        }, null, 8, ["model-value", "options"])
      ]),
      o.value ? (n(), f(ee, { key: 0 }, [
        o.value.levels.length ? (n(), f("div", If, [
          (n(!0), f(ee, null, fe(o.value.levels, (w, x) => (n(), f("div", {
            key: w.id,
            class: "work-settings-row"
          }, [
            s("div", Df, [
              s("strong", null, S(r.value.find(($) => $.code === o.value.field)?.options?.find(($) => $.id === w.id)?.label || w.id), 1),
              s("p", Uf, "Level " + S(x + 1), 1)
            ]),
            s("div", Af, [
              k(Yo, {
                "board-id": e.boardId,
                label: "Who can see these items",
                "model-value": w.holders,
                "onUpdate:modelValue": ($) => u(w.id, $),
                onValidity: p[0] || (p[0] = ($) => l("validity", $))
              }, null, 8, ["board-id", "model-value", "onUpdate:modelValue"])
            ])
          ]))), 128))
        ])) : C("", !0),
        v.value ? (n(), K(Ua, {
          key: o.value.field,
          action: "Add level",
          label: "New visibility level",
          validate: m,
          onAdd: b
        })) : C("", !0),
        s("label", Ef, [
          k(c(st), {
            "model-value": o.value.bypass === "admin",
            "onUpdate:modelValue": p[1] || (p[1] = (w) => w ? o.value.bypass = "admin" : delete o.value.bypass)
          }, null, 8, ["model-value"]),
          p[5] || (p[5] = W(" Board administrators can see every level ", -1))
        ]),
        k(c(ae), {
          label: "Remove visibility restriction",
          severity: "secondary",
          text: "",
          onClick: p[2] || (p[2] = (w) => delete e.draft.visibility)
        })
      ], 64)) : C("", !0),
      k(Bt, {
        label: "Visibility rules",
        "model-value": o.value,
        shape: "object",
        example: { field: "visibility", levels: [{ id: "internal", holders: [] }], bypass: "admin" },
        commit: g,
        onValidity: p[3] || (p[3] = (w) => l("validity", w))
      }, null, 8, ["model-value"])
    ]));
  }
}), Of = { class: "work-ia-section" }, Pf = {
  class: "work-settings-list",
  "aria-labelledby": "work-sharing-title"
}, Nf = { class: "work-settings-row" }, Mf = { class: "work-row-main" }, Ff = {
  key: 0,
  class: "work-muted work-small"
}, Lf = {
  key: 0,
  class: "work-member-preview",
  "aria-label": "People and groups with direct access"
}, Bf = { class: "work-spacer" }, zf = {
  key: 1,
  class: "work-settings-row work-muted work-small"
}, jf = {
  key: 2,
  class: "work-settings-row work-muted"
}, qf = {
  key: 3,
  class: "work-settings-row"
}, Wf = {
  key: 4,
  class: "work-settings-row work-muted",
  role: "status"
}, Gf = /* @__PURE__ */ Se({
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
    const a = e, t = B(), l = B([]), o = F(() => t.value?.filter((h) => h.subject_type === "group").length ?? 0), r = F(() => (t.value?.length ?? 0) - o.value), v = F(() => [...t.value ?? []].sort((h, p) => +!!p.owner - +!!h.owner || p.access_mask - h.access_mask).slice(0, 6).map((h) => ({ ...h, permissions: u(h) }))), m = F(() => v.value.map((h) => ({ id: h.subject_id, kind: h.subject_type ?? "user" }))), b = jo(() => a.boardId, m);
    function i(h) {
      return h.full_name || b.label({ id: h.subject_id, kind: h.subject_type ?? "user", email: h.email });
    }
    function u(h) {
      return h.owner ? "Owner" : l.value.filter((p) => (h.access_mask & p.bit) === p.bit).map((p) => p.label).join(", ");
    }
    const d = B(!1), V = ua();
    async function g() {
      const h = V();
      d.value = !1;
      try {
        const [{ data: p }, w] = await Promise.all([
          Ol.get("/api/v1/component-access/grants/" + encodeURIComponent(a.boardId)),
          Ol.get("/api/v1/components/access-model")
        ]);
        if (!h()) return;
        if (!p?.success || !Array.isArray(p.access)) throw new Error("Grants unavailable");
        t.value = p.access, l.value = w.data?.success && Array.isArray(w.data.capabilities) ? w.data.capabilities : [];
      } catch {
        h() && (t.value = void 0, d.value = !0);
      }
    }
    return Kl(() => V()), Ue(() => [a.active, a.boardId], () => {
      a.active && g();
    }, { immediate: !0 }), (h, p) => (n(), f("section", Of, [
      s("section", Pf, [
        s("div", Nf, [
          s("div", Mf, [
            p[1] || (p[1] = s("h3", {
              id: "work-sharing-title",
              class: "work-row-title"
            }, "Members and sharing", -1)),
            t.value ? (n(), f("p", Ff, S(r.value) + " " + S(r.value === 1 ? "person" : "people") + " and " + S(o.value) + " " + S(o.value === 1 ? "group" : "groups") + " with direct access", 1)) : C("", !0)
          ]),
          e.board ? (n(), K(Cf, {
            key: 0,
            board: e.board,
            busy: e.busy,
            onShared: g
          }, null, 8, ["board", "busy"])) : C("", !0)
        ]),
        v.value.length ? (n(), f("ul", Lf, [
          (n(!0), f(ee, null, fe(v.value, (w) => (n(), f("li", {
            key: w.subject_type + w.subject_id,
            class: "work-settings-row"
          }, [
            k(c(pe), {
              icon: w.subject_type === "group" ? "tabler:users" : "tabler:user",
              "aria-hidden": "true"
            }, null, 8, ["icon"]),
            s("strong", Bf, S(i(w)), 1),
            w.permissions ? (n(), K(c(et), {
              key: 0,
              class: "kx-tag-sm",
              severity: "secondary",
              value: w.permissions
            }, null, 8, ["value"])) : C("", !0)
          ]))), 128))
        ])) : C("", !0),
        t.value && t.value.length > v.value.length ? (n(), f("p", zf, " See all " + S(t.value.length) + " people and groups under Share board. ", 1)) : t.value && !t.value.length ? (n(), f("p", jf, "No direct grants yet.")) : d.value ? (n(), f("div", qf, [
          p[2] || (p[2] = s("p", {
            class: "work-spacer work-muted",
            role: "alert"
          }, "Member summary is unavailable.", -1)),
          k(c(ae), {
            label: "Reload members",
            severity: "secondary",
            text: "",
            onClick: g
          })
        ])) : t.value ? C("", !0) : (n(), f("p", Wf, "Loading members…"))
      ]),
      k(je, {
        class: "work-disclosure work-visibility-disclosure",
        label: e.draft.visibility ? "Advanced · Item visibility rules set" : "Advanced · Item visibility"
      }, {
        default: q(() => [
          k(Rf, {
            "board-id": e.boardId,
            draft: e.draft,
            onValidity: p[0] || (p[0] = (w) => h.$emit("validity", w))
          }, null, 8, ["board-id", "draft"])
        ]),
        _: 1
      }, 8, ["label"])
    ]));
  }
}), Kf = { class: "work-settings-row" }, Hf = ["for"], Yf = { class: "work-settings-row" }, Xf = { class: "work-row-main" }, Jf = ["id"], Zf = { class: "work-settings-grid" }, Qf = { class: "work-stack work-tight" }, _f = { class: "work-stack work-tight" }, em = ["value", "inert"], tm = {
  key: 1,
  class: "work-muted work-small"
}, am = {
  key: 0,
  class: "work-settings-row"
}, lm = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, om = {
  key: 1,
  class: "work-muted work-small",
  role: "status"
}, im = {
  key: 1,
  class: "work-board-identity work-stack work-tight"
}, nm = { class: "work-stack work-tight" }, sm = { class: "work-stack work-tight" }, rm = { class: "work-stack work-tight" }, dm = ["value", "inert"], um = {
  key: 1,
  class: "work-muted work-small"
}, cm = { class: "work-row" }, vm = { class: "work-row" }, fm = { class: "work-row work-board-title" }, mm = {
  key: 1,
  class: "work-identity-actions"
}, pm = ["title"], gm = {
  key: 2,
  class: "kx-err work-inline",
  role: "alert"
}, hm = {
  key: 3,
  class: "work-muted work-small",
  role: "status"
}, bm = /* @__PURE__ */ Se({
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
    const t = e, l = a, o = B(!1), r = B(!1), v = B(""), m = B(""), b = B(""), i = B(""), u = B(!1), d = B(!1), V = B(""), g = B(""), h = F(() => t.board?.access?.admin === !0), p = $t(), w = $t(), x = B({ title: "", description: "", icon: "", app: "" }), $ = F(() => [
      { id: "", title: "Default app" },
      ...t.boardApps ?? [],
      ...t.board?.ui_app && !t.boardApps?.some((R) => R.id === t.board?.ui_app) ? [{ id: t.board.ui_app, title: t.boardApps ? "Unavailable app" : "Configured board app", disabled: !0 }] : []
    ]), T = F(() => $.value.find((R) => R.id === i.value)?.title), D = F(() => !!t.boardApps?.length || !!t.board?.ui_app), z = F(() => ({
      title: t.board?.title ?? "",
      icon: t.board?.icon ?? "",
      description: t.board?.description ?? "",
      app: t.board?.ui_app ?? ""
    }));
    function le() {
      x.value = z.value, v.value = z.value.title, b.value = z.value.icon, m.value = z.value.description, i.value = z.value.app;
    }
    function Z() {
      Ft("wc-icon-picker").then((R) => u.value = R);
    }
    function ue() {
      le(), V.value = "", g.value = "", o.value = !0, Z();
    }
    const me = F(() => {
      const R = {};
      return v.value.trim() !== x.value.title && (R.title = v.value.trim()), m.value !== x.value.description && (R.description = m.value), b.value !== x.value.icon && (R.icon = b.value), i.value !== x.value.app && (R.ui_app = i.value), R;
    }), ge = F(() => (t.detail || o.value) && Object.keys(me.value).length > 0);
    Ue(z, () => {
      t.detail && !ge.value && le();
    }, { immediate: !0 }), Ue(r, (R) => {
      R && Z();
    }), Ue(h, (R) => {
      R || be();
    }), Ue(ge, (R) => l("dirty-change", R));
    function be() {
      o.value = !1, V.value = "", g.value = "", le();
    }
    async function se() {
      if (!h.value || !t.board || d.value || !v.value.trim()) return;
      const R = me.value;
      if (!Object.keys(R).length) {
        o.value = !1, g.value = "Nothing changed.";
        return;
      }
      d.value = !0, V.value = "";
      try {
        const _ = await Nt.updateBoard(t.board.board_id, R);
        v.value = v.value.trim(), x.value = { title: v.value, description: m.value, icon: b.value, app: i.value }, o.value = !1, g.value = _.status === "unchanged" ? "Nothing changed." : "Board saved.", l("saved");
      } catch (_) {
        V.value = mt(_, "Could not save the board.");
      } finally {
        d.value = !1;
      }
    }
    return (R, _) => e.detail ? (n(), f("form", {
      key: 0,
      class: "work-board-identity",
      "aria-label": "Edit board details",
      onSubmit: Be(se, ["prevent"])
    }, [
      s("div", Kf, [
        s("label", {
          for: c(p),
          class: "work-row-main work-row-title"
        }, "Board name", 8, Hf),
        k(c(Re), {
          id: c(p),
          modelValue: v.value,
          "onUpdate:modelValue": _[0] || (_[0] = (L) => v.value = L),
          required: "",
          disabled: d.value || !h.value
        }, null, 8, ["id", "modelValue", "disabled"])
      ]),
      s("div", Yf, [
        s("div", Xf, [
          s("h3", {
            class: "work-row-title",
            id: c(w)
          }, "Board app", 8, Jf),
          _[9] || (_[9] = s("p", { class: "work-muted work-small" }, "Opens the board from Work navigation.", -1))
        ]),
        k(c(he), {
          modelValue: i.value,
          "onUpdate:modelValue": _[1] || (_[1] = (L) => i.value = L),
          "aria-labelledby": c(w),
          options: $.value,
          placeholder: T.value,
          optionLabel: "title",
          optionValue: "id",
          optionDisabled: "disabled",
          appendTo: "self",
          disabled: d.value || !h.value || !D.value
        }, null, 8, ["modelValue", "aria-labelledby", "options", "placeholder", "disabled"])
      ]),
      Ye(R.$slots, "default"),
      k(je, {
        open: r.value,
        "onUpdate:open": _[4] || (_[4] = (L) => r.value = L),
        class: "work-board-appearance",
        label: "Board description and icon"
      }, {
        default: q(() => [
          s("div", Zf, [
            s("label", Qf, [
              _[10] || (_[10] = W("Description", -1)),
              k(c(Aa), {
                modelValue: m.value,
                "onUpdate:modelValue": _[2] || (_[2] = (L) => m.value = L),
                rows: "1",
                disabled: d.value || !h.value
              }, null, 8, ["modelValue", "disabled"])
            ]),
            s("div", _f, [
              _[11] || (_[11] = s("span", null, "Board icon", -1)),
              u.value ? (n(), f("wc-icon-picker", {
                key: 0,
                value: b.value,
                fallback: "tabler:layout-kanban",
                inert: d.value || !h.value || void 0,
                onSelect: _[3] || (_[3] = (L) => b.value = L.detail)
              }, null, 40, em)) : (n(), f("p", tm, "The icon picker is unavailable."))
            ])
          ])
        ]),
        _: 1
      }, 8, ["open"]),
      ge.value || V.value || g.value ? (n(), f("div", am, [
        V.value ? (n(), f("p", lm, S(V.value), 1)) : g.value && !ge.value ? (n(), f("p", om, S(g.value), 1)) : C("", !0),
        ge.value ? (n(), f(ee, { key: 2 }, [
          k(c(ae), {
            label: "Save board details",
            type: "submit",
            size: "small",
            disabled: !v.value.trim() || d.value || !h.value,
            loading: d.value
          }, null, 8, ["disabled", "loading"]),
          k(c(ae), {
            label: "Cancel",
            type: "button",
            severity: "secondary",
            text: "",
            size: "small",
            disabled: d.value,
            onClick: be
          }, null, 8, ["disabled"])
        ], 64)) : C("", !0)
      ])) : C("", !0)
    ], 32)) : (n(), f("div", im, [
      o.value ? (n(), f("form", {
        key: 0,
        class: "work-identity-edit",
        "aria-label": "Edit board",
        onClick: _[8] || (_[8] = Be(() => {
        }, ["stop"])),
        onSubmit: Be(se, ["prevent"])
      }, [
        s("label", nm, [
          _[12] || (_[12] = W("Title", -1)),
          k(c(Re), {
            modelValue: v.value,
            "onUpdate:modelValue": _[5] || (_[5] = (L) => v.value = L),
            required: "",
            autofocus: "",
            disabled: d.value
          }, null, 8, ["modelValue", "disabled"])
        ]),
        s("label", sm, [
          _[13] || (_[13] = W("Description", -1)),
          k(c(Aa), {
            modelValue: m.value,
            "onUpdate:modelValue": _[6] || (_[6] = (L) => m.value = L),
            rows: "1",
            disabled: d.value
          }, null, 8, ["modelValue", "disabled"])
        ]),
        s("div", rm, [
          _[14] || (_[14] = s("span", null, "Board icon", -1)),
          u.value ? (n(), f("wc-icon-picker", {
            key: 0,
            value: b.value,
            fallback: "tabler:layout-kanban",
            inert: d.value || void 0,
            onSelect: _[7] || (_[7] = (L) => b.value = L.detail)
          }, null, 40, dm)) : (n(), f("p", um, "The icon picker is unavailable."))
        ]),
        s("div", cm, [
          k(c(ae), {
            label: "Save",
            severity: "secondary",
            type: "submit",
            disabled: !v.value.trim() || d.value,
            loading: d.value,
            outlined: ""
          }, {
            icon: q(() => [
              k(c(pe), {
                icon: "tabler:device-floppy",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled", "loading"]),
          k(c(ae), {
            label: "Cancel",
            severity: "secondary",
            disabled: d.value,
            onClick: be,
            outlined: ""
          }, {
            icon: q(() => [
              k(c(pe), {
                icon: "tabler:x",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled"])
        ])
      ], 32)) : (n(), f(ee, { key: 1 }, [
        s("div", vm, [
          s("div", fm, [
            e.board?.icon ? (n(), K(c(pe), {
              key: 0,
              icon: e.board.icon,
              "aria-hidden": "true"
            }, null, 8, ["icon"])) : C("", !0),
            (n(), K(Ia(e.compact ? "h2" : "h1"), {
              class: pt(e.compact ? "kx-card-name" : "kx-title")
            }, {
              default: q(() => [
                W(S(e.board?.title || "Untitled board"), 1)
              ]),
              _: 1
            }, 8, ["class"]))
          ]),
          e.compact ? Ye(R.$slots, "title-end", {}, void 0, void 0, 0) : C("", !0),
          e.compact ? (n(), f("span", mm, [
            h.value ? (n(), K(c(ae), {
              key: 0,
              severity: "secondary",
              text: "",
              size: "small",
              onClick: Be(ue, ["stop"]),
              "aria-label": "Edit board"
            }, {
              default: q(() => [
                k(c(pe), {
                  icon: "tabler:pencil",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            })) : C("", !0),
            Ye(R.$slots, "actions")
          ])) : h.value ? (n(), K(c(ae), {
            key: 2,
            severity: "secondary",
            text: "",
            size: "small",
            onClick: Be(ue, ["stop"]),
            "aria-label": "Edit board"
          }, {
            default: q(() => [
              k(c(pe), {
                icon: "tabler:pencil",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          })) : C("", !0),
          e.compact ? C("", !0) : Ye(R.$slots, "title-end", {}, void 0, void 0, 3)
        ]),
        !e.compact && (e.subtitle || e.board?.description) ? (n(), f("p", {
          key: 0,
          class: "kx-head-sub",
          title: e.subtitle || e.board?.description
        }, S(e.subtitle || e.board?.description), 9, pm)) : C("", !0)
      ], 64)),
      V.value ? (n(), f("p", gm, S(V.value), 1)) : C("", !0),
      g.value ? (n(), f("p", hm, S(g.value), 1)) : C("", !0)
    ]));
  }
}), ym = { class: "work-ia-section work-ia-general" }, km = {
  class: "work-settings-list work-board-details",
  "aria-label": "Board details"
}, wm = {
  key: 0,
  class: "work-settings-row"
}, $m = { class: "work-settings-row" }, Vm = { class: "work-row-main" }, xm = ["for"], Cm = { class: "work-muted work-small" }, Sm = {
  class: "work-board-summary work-row work-wrap work-small",
  "aria-label": "Board summary"
}, Tm = { class: "work-muted" }, Im = { key: 0 }, Dm = { key: 1 }, Um = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, Am = {
  key: 0,
  class: "work-stack work-tight"
}, Em = {
  key: 0,
  class: "work-stack work-tight"
}, Rm = {
  key: 1,
  class: "work-muted"
}, Om = { class: "work-stack work-tight" }, Pm = { class: "work-spacer" }, Nm = /* @__PURE__ */ Se({
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
  emits: ["upgrade", "install", "retry", "saved", "share", "dirty-change"],
  setup(e) {
    const a = e, t = $t(), l = {
      comments_per_item: "Comments per item",
      audit: "Change history",
      audit_days: "Change history retention",
      interval_days: "Time-in-state history retention",
      trash_days: "Trash retention",
      tombstone_days: "Deletion record retention"
    }, o = F(() => Object.keys(l).filter((g) => a.draft.policy?.[g] !== void 0));
    function r(g) {
      const h = a.draft.policy?.[g];
      return g === "audit" ? h === "off" ? "Off" : "Track field changes" : g === "comments_per_item" ? h : h === 0 ? g === "audit_days" || g === "interval_days" ? "365 days" : "Clean up immediately" : h === 1 ? "1 day" : h + " days";
    }
    const v = B(), m = B(!1);
    let b = "";
    Ue([() => a.active, () => a.board?.board_id, () => a.schema.generation], async ([g, h, p], w, x) => {
      if (!g || !h || b === h + "/" + p) return;
      v.value = void 0, m.value = !1;
      let $ = !0;
      x(() => $ = !1);
      try {
        const T = await Promise.all(Array.from(
          { length: Math.min(3, Math.max(0, p - 1)) },
          (D, z) => Nt.schema(h, p - z - 1)
        ));
        $ && (v.value = T, b = h + "/" + p);
      } catch {
        $ && (m.value = !0);
      }
    }, { immediate: !0 });
    function i(g) {
      return JSON.stringify(g, (h, p) => p && typeof p == "object" && !Array.isArray(p) ? Object.fromEntries(Object.entries(p).sort(([w], [x]) => w.localeCompare(x))) : p);
    }
    function u(g, h) {
      if (!h) return ["Initial board setup"];
      const p = g.declaration, w = h.declaration, x = [], $ = [
        ["Fields", p.fields, w.fields],
        ["Item types", p.item_types, w.item_types],
        ["Workflow", p.processes, w.processes],
        ["Links", p.relation_types, w.relation_types],
        ["Plugins and filters", [p.plugins, p.scopes], [w.plugins, w.scopes]],
        ["Item visibility", p.visibility, w.visibility],
        ["Board rules", p.policy, w.policy],
        ["Starting pack", g.pack, h.pack],
        ["Item key prefix", g.key_prefix, h.key_prefix]
      ];
      if (i(p.fields) !== i(w.fields)) {
        const D = p.fields?.filter((z) => !w.fields?.some((le) => le.code === z.code)) ?? [];
        D.length === 1 && x.push("Added " + Ze(D[0]));
      }
      const T = $.filter(([, D, z]) => i(D) !== i(z)).map(([D]) => D).filter((D) => D !== "Fields" || !x.length);
      return T.length && x.push(T.join(", ") + " updated"), x.length ? x : ["Board setup updated"];
    }
    const d = B(!1), V = F(() => {
      if (!v.value || a.schema.generation < 1) return [];
      const g = [a.schema, ...v.value];
      return g.slice(0, 3).map((h, p) => u(h, g[p + 1]));
    });
    return (g, h) => (n(), f("section", ym, [
      s("section", km, [
        e.board ? (n(), f("div", wm, [
          h[8] || (h[8] = s("div", { class: "work-row-main" }, [
            s("h3", { class: "work-row-title" }, "Board access"),
            s("p", { class: "work-muted work-small" }, "Give people and groups access to this board.")
          ], -1)),
          s("div", null, [
            k(c(ae), {
              label: "Share board",
              type: "button",
              severity: "secondary",
              outlined: "",
              onClick: h[0] || (h[0] = (p) => g.$emit("share"))
            }, {
              icon: q(() => [
                k(c(pe), {
                  icon: "tabler:share",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            })
          ])
        ])) : C("", !0),
        (n(), K(bm, {
          key: e.board?.board_id,
          board: e.board,
          "board-apps": e.boardApps,
          detail: "",
          onDirtyChange: h[2] || (h[2] = (p) => g.$emit("dirty-change", p)),
          onSaved: h[3] || (h[3] = (p) => g.$emit("saved"))
        }, {
          default: q(() => [
            s("div", $m, [
              s("div", Vm, [
                s("label", {
                  class: "work-row-title",
                  for: c(t)
                }, "Item key prefix", 8, xm),
                s("p", Cm, "Shown on items, for example " + S(e.draft.key_prefix || "WORK") + "-1.", 1)
              ]),
              k(c(Re), {
                id: c(t),
                modelValue: e.draft.key_prefix,
                "onUpdate:modelValue": h[1] || (h[1] = (p) => e.draft.key_prefix = p),
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
      s("section", Sm, [
        s("p", Tm, [
          e.board?.open_count !== void 0 && e.board.item_count !== void 0 ? (n(), f("span", Im, S(e.board.open_count) + " open · " + S(e.board.item_count) + " total · ", 1)) : C("", !0),
          W(" " + S(e.packTitle || "No pack installed"), 1),
          e.outdated ? (n(), f("span", Dm, " · Update available")) : C("", !0)
        ]),
        e.packError ? (n(), f("p", Um, S(e.packError), 1)) : C("", !0),
        e.packError ? (n(), K(c(ae), {
          key: 1,
          label: "Reload packs",
          severity: "secondary",
          outlined: "",
          size: "small",
          onClick: h[4] || (h[4] = (p) => g.$emit("retry"))
        })) : C("", !0),
        e.packTitle ? e.outdated ? (n(), K(c(ae), {
          key: 3,
          label: "Update pack",
          severity: "secondary",
          outlined: "",
          size: "small",
          disabled: !e.canUpgrade,
          title: e.upgradeReason,
          onClick: h[6] || (h[6] = (p) => g.$emit("upgrade"))
        }, null, 8, ["disabled", "title"])) : C("", !0) : (n(), K(c(ae), {
          key: 2,
          label: "Install pack",
          severity: "secondary",
          outlined: "",
          size: "small",
          disabled: !e.canInstall,
          onClick: h[5] || (h[5] = (p) => g.$emit("install"))
        }, null, 8, ["disabled"]))
      ]),
      e.schema.pack ? (n(), K(je, {
        key: 0,
        open: d.value,
        "onUpdate:open": h[7] || (h[7] = (p) => d.value = p),
        class: "work-disclosure work-small",
        label: "Technical details"
      }, {
        default: q(() => [
          d.value ? (n(), f("dl", Am, [
            s("div", null, [
              h[9] || (h[9] = s("dt", null, "Pack ID", -1)),
              s("dd", null, [
                s("code", null, S(e.schema.pack.id), 1)
              ])
            ]),
            s("div", null, [
              h[10] || (h[10] = s("dt", null, "Pack version", -1)),
              s("dd", null, S(e.schema.pack.version), 1)
            ]),
            h[11] || (h[11] = s("div", null, [
              s("dt", null, "Pack tools"),
              s("dd", null, [
                s("code", null, "WorkPackPlan"),
                W(", "),
                s("code", null, "WorkPackApply")
              ])
            ], -1))
          ])) : C("", !0)
        ]),
        _: 1
      }, 8, ["open"])) : C("", !0),
      k(je, {
        class: "work-disclosure",
        label: "Recent setup changes"
      }, {
        default: q(() => [
          V.value.length ? (n(), f("ul", Em, [
            (n(!0), f(ee, null, fe(V.value, (p, w) => (n(), f("li", { key: w }, S(p.join(" · ")), 1))), 128))
          ])) : (n(), f("p", Rm, S(m.value ? "Recent changes are unavailable." : v.value ? "No setup changes yet." : "Loading recent changes…"), 1))
        ]),
        _: 1
      }),
      o.value.length ? (n(), K(je, {
        key: 1,
        class: "work-settings-card work-disclosure",
        label: "Advanced · Existing board overrides"
      }, {
        default: q(() => [
          h[12] || (h[12] = s("p", { class: "work-muted" }, "Clear an override to use the Work application default.", -1)),
          s("ul", Om, [
            (n(!0), f(ee, null, fe(o.value, (p) => (n(), f("li", {
              key: p,
              class: "work-row work-wrap"
            }, [
              s("span", Pm, S(l[p]) + " · " + S(r(p)), 1),
              k(c(ae), {
                label: "Use default for " + l[p].toLowerCase(),
                disabled: e.disabled,
                size: "small",
                text: "",
                onClick: (w) => delete e.draft.policy[p]
              }, null, 8, ["label", "disabled", "onClick"])
            ]))), 128))
          ])
        ]),
        _: 1
      })) : C("", !0)
    ]));
  }
}), He = (e, a) => `${e} → ${a}`, Do = (e, a) => {
  const t = e.fields?.find((l) => l.code === a);
  return t ? Ze(t) : "Untitled field";
}, Uo = {
  comments_per_item: "Comments per item",
  stage_timeout: "Default attempt timeout",
  stage_max_visits: "Default maximum visits",
  audit: "Audit trail",
  audit_days: "Audit history",
  trash_days: "Keep trashed items",
  tombstone_days: "Keep deletion records",
  interval_days: "Keep state history"
};
function Ao(e, a) {
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
function Mm(e, a) {
  const t = e.policy ?? {}, l = a.policy ?? {}, o = Object.keys(Uo).flatMap((m) => t[m] === l[m] ? [] : [`${Uo[m]} · ${He(Ao(m, t[m]), Ao(m, l[m]))}`]), r = (m) => m ? `${m.limit}${m.hard ? " (hard limit)" : ""}` : "No limit", v = /* @__PURE__ */ new Set([...Object.keys(t.wip ?? {}), ...Object.keys(l.wip ?? {})]);
  for (const m of v) {
    const b = r(t.wip?.[m]), i = r(l.wip?.[m]);
    if (b === i) continue;
    const u = (a.processes ?? []).flatMap((d) => d.states).find((d) => d.id === m) ?? (e.processes ?? []).flatMap((d) => d.states).find((d) => d.id === m);
    o.push(`${ke(u)} limit · ${He(b, i)}`);
  }
  return o;
}
function Fm(e, a, t) {
  const l = e.visibility, o = a.visibility, r = [];
  l?.field !== o?.field && r.push(He(
    l ? Do(e, l.field) : "No additional restriction",
    o ? Do(a, o.field) : "No additional restriction"
  ));
  const v = l?.levels ?? [], m = o?.levels ?? [], b = new Set([...v, ...m].map((i) => i.id));
  for (const i of b) {
    const u = v.find((p) => p.id === i), d = m.find((p) => p.id === i);
    if (u && d && JSON.stringify(u.holders) === JSON.stringify(d.holders)) continue;
    const V = (p) => p.fields?.find((w) => w.code === p.visibility?.field)?.options?.find((w) => w.id === i)?.label, g = V(a) || V(e) || Me(i), h = (p) => p ? p.holders.map(t).join(", ") || "No extra access" : "No level";
    r.push(`${g} · ${He(h(u), h(d))}`);
  }
  return l?.bypass !== o?.bypass && r.push(o?.bypass === "admin" ? "Board administrators can see every level." : "Visibility levels now apply to board administrators."), r;
}
const $a = {
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
function Lm(e, a, t) {
  const { what: l, detail: o, to: r } = e, m = `${t?.name || a?.name || "Untitled workflow"} · ${$a[l] ?? "Workflow changed"}`, b = l.startsWith("state.") ? a?.states.find((g) => g.id === o) : void 0, i = l.startsWith("state.") ? t?.states.find((g) => g.id === o) : void 0, u = l.startsWith("transition.") ? a?.transitions?.find((g) => g.id === o) : void 0, d = l.startsWith("transition.") ? t?.transitions?.find((g) => g.id === o) : void 0;
  let V = "";
  if (l === "state.map") V = He(ke(b), ke(t?.states.find((g) => g.id === r)));
  else if (l === "state.name") V = He(ke(b), ke(i));
  else if (l === "state.kind") V = `${ke(i)} · ${He(_a(b?.kind), _a(i?.kind))}`;
  else if (l === "state.category" && b && i) V = `${ke(i)} · ${He(zt(b.category), zt(i.category))}`;
  else if (i || b) V = ke(i ?? b);
  else if (l === "transition.name" && u && d) V = He(Xe(u), Xe(d));
  else if (d && u && d.to !== u.to) {
    const g = ke(a?.states.find((p) => p.id === u.to)), h = ke(t?.states.find((p) => p.id === d.to));
    return { title: m, details: [Xe(d), `Destination changes from ${g} to ${h}.`] };
  } else if (l === "transition.add" && d && t) {
    const g = d.from === "any" ? "Any state" : d.from.map((p) => ke(t.states.find((w) => w.id === p))).join(", "), h = ke(t.states.find((p) => p.id === d.to));
    return { title: m, details: [Xe(d), He(g, h), ...d.auto ? ["Runs automatically."] : []] };
  } else d ? V = Xe(d) : u ? V = Xe(u) : l === "initial" ? V = He(ke(a?.states.find((g) => g.id === a.initial)), ke(t?.states.find((g) => g.id === t.initial))) : l === "name" && (V = He(a?.name || "Untitled workflow", t?.name || "Untitled workflow"));
  return { title: m, details: V ? [V] : [] };
}
function Bm(e, a, t, l) {
  const { code: o, what: r, detail: v } = e;
  if (o === "schema" || r === "visibility.remove")
    return r === "policy" ? { title: "Board limits and defaults", details: Mm(a, t) } : r.startsWith("visibility") ? { title: "Who can see items", details: Fm(a, t, l) } : r === "key_prefix" ? { title: "Item key prefix", details: [He(a.key_prefix ?? "Default", t.key_prefix ?? "Default")] } : { title: { plugins: "Board plugins changed", scopes: "Saved query filters changed", "rollup.recompute": "Calculated totals will update" }[r] ?? "Board settings changed", details: [] };
  if (o.startsWith("process ")) {
    const d = o.slice(8);
    return Lm(e, a.processes?.find((V) => V.id === d), t.processes?.find((V) => V.id === d));
  }
  if (o.startsWith("item_type ")) {
    const d = o.slice(10), V = a.item_types?.find((p) => p.id === d), g = t.item_types?.find((p) => p.id === d);
    return { title: `${g?.title || V?.title || "Item type"} · ${$a[r] ?? "Item type changed"}`, details: r === "title" ? [He(V?.title || "Untitled item type", g?.title || "Untitled item type")] : [] };
  }
  if (o.startsWith("relation ")) {
    const d = o.slice(9), V = a.relation_types?.find((p) => p.id === d), g = t.relation_types?.find((p) => p.id === d), h = r === "label" ? [He([V?.outward, V?.inward].filter(Boolean).join(" / "), [g?.outward, g?.inward].filter(Boolean).join(" / "))] : [];
    return { title: `${g?.outward || V?.outward || "Link type"} · ${$a[r] ?? "Link type changed"}`, details: h };
  }
  const m = t.fields?.find((d) => d.code === o), b = a.fields?.find((d) => m?.id !== void 0 ? d.id === m.id : d.code === (r.startsWith("renamed from ") ? r.slice(13) : o)), i = m ?? b;
  if (!i) return { title: $a[r] ?? "Board settings changed", details: [] };
  const u = `${Ze(i)} · ${r.startsWith("renamed from ") ? "Field key" : $a[r] ?? "Field settings changed"}`;
  if (r.startsWith("options.")) {
    const d = b?.options ?? [], V = m?.options ?? [], g = d.findIndex((T) => T.id === v), h = V.findIndex((T) => T.id === v), p = d[g], w = V[h], x = w?.label || p?.label || "Untitled choice", $ = p && w && p.label !== w.label ? [] : [x];
    if (p && w) {
      p.label !== w.label && $.push(He(p.label || "Untitled choice", w.label || "Untitled choice")), p.category !== w.category && $.push(`Category · ${He(p.category ? zt(p.category) : "None", w.category ? zt(w.category) : "None")}`);
      const T = p.order ?? g + 1, D = w.order ?? h + 1;
      T !== D && $.push(`Order · ${He(T, D)}`), p.color !== w.color && $.push(`Color · ${He(p.color ?? "Default", w.color ?? "Default")}`);
    }
    return { title: u, details: $ };
  }
  return r === "title" && b && m ? { title: u, details: [He(Ze(b), Ze(m))] } : { title: u, details: [] };
}
const zm = {
  key: 0,
  class: "work-settings-card work-schema-plan work-stack",
  "aria-label": "Schema review"
}, jm = { key: 0 }, qm = { class: "work-row work-wrap" }, Wm = { class: "work-muted" }, Gm = {
  key: 0,
  class: "work-stack work-tight",
  "aria-label": "Plugin configuration"
}, Km = {
  key: 1,
  class: "work-notice"
}, Hm = {
  key: 2,
  class: "work-notice"
}, Ym = {
  key: 3,
  class: "work-stack work-tight",
  "aria-label": "Reviewed Flow bindings"
}, Xm = { key: 4 }, Jm = {
  key: 5,
  class: "work-settings-table"
}, Zm = { key: 0 }, Qm = /* @__PURE__ */ Se({
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
    plugins: {},
    pluginConfigs: {}
  },
  setup(e) {
    const a = e, t = {}, l = F(() => a.original ?? t), o = F(() => a.declaration ?? t), r = F(() => (a.plugins ?? []).flatMap((T) => {
      if (!T.config_schema) return [];
      const D = a.pluginConfigs?.[T.plugin], z = !l.value.plugins?.some((Z) => Z.use === T.plugin) && o.value.plugins?.some((Z) => Z.use === T.plugin);
      if (!D && !z) return [];
      const le = Qa(T.config_schema).map((Z) => {
        const ue = D?.[Z.key];
        return T.plugin === "kickside.work.planning:plugin" && Z.key === "issue_types" ? { title: "Plan these item types", value: (Array.isArray(ue) ? ue.map((ge) => o.value.item_types?.find((be) => be.id === ge)?.title || Me(ge)) : []).join(", ") || "Uses default" } : ue === void 0 ? { title: Z.title, value: "Uses default" } : Z.schema.writeOnly || Z.schema.format === "password" || typeof ue == "object" ? { title: Z.title, value: "Set" } : { title: Z.title, value: typeof ue == "boolean" ? ue ? "On" : "Off" : String(ue) };
      });
      return le.length ? [{ id: T.plugin, title: T.title || T.plugin, fields: le }] : [];
    })), v = F(() => (o.value.processes ?? []).flatMap((T) => T.states.flatMap((D) => {
      const z = D.run?.flow_ref;
      return z ? [{ key: T.id + ":" + D.id, process: T.name || "Untitled process", state: ke(D), reference: z }] : [];
    }))), m = B(/* @__PURE__ */ new Map());
    Ue(v, async (T, D, z) => {
      const le = /* @__PURE__ */ new Map();
      m.value = le;
      let Z = !0;
      z(() => Z = !1), await Promise.all([...new Set(T.map((ue) => ue.reference.id))].map(async (ue) => {
        try {
          const me = (await ql.title(ue))?.trim();
          Z && me && !Li(me) && m.value.set(ue, me);
        } catch {
          Z && m.value.set(ue, "Flow title unavailable");
        }
      }));
    }, { immediate: !0 });
    const b = F(() => [l.value, o.value].flatMap((T) => (T.visibility?.levels ?? []).flatMap((D) => D.holders.flatMap((z) => "group" in z ? [{ kind: "group", id: z.group }] : "user" in z ? [{ kind: "user", id: z.user }] : [])))), i = jo(() => a.boardId ?? "", b);
    function u(T) {
      if ("user" in T) return i.label({ kind: "user", id: T.user });
      if ("group" in T) return i.label({ kind: "group", id: T.group });
      if ("field" in T) {
        const D = o.value.fields?.find((z) => z.code === T.field) ?? l.value.fields?.find((z) => z.code === T.field);
        return D ? Ze(D) : "People from a field";
      }
      return "Service";
    }
    const d = (T) => T.map((D) => {
      const z = Bm(D, l.value, o.value, u);
      if (D.what === "plugins") {
        const le = new Set(l.value.plugins?.map((ue) => ue.use)), Z = new Set(o.value.plugins?.map((ue) => ue.use));
        for (const ue of a.plugins ?? [])
          le.has(ue.plugin) !== Z.has(ue.plugin) && z.details.push((Z.has(ue.plugin) ? "Enable " : "Turn off ") + (ue.title || "an available plugin"));
      }
      if (D.what === "plugin.config") {
        const le = a.plugins?.find((Z) => Z.plugin === D.code);
        return { change: D, title: (le?.title || "Plugin") + " settings changed", details: [] };
      }
      return { change: D, ...z };
    }), V = F(() => d(a.plan?.changes.filter((T) => T.class !== "refused" && T.what !== "field.remove") ?? [])), g = F(() => d(a.plan?.refused.filter((T) => T.what !== "field.remove") ?? [])), h = F(() => {
      const T = a.plan?.migration;
      return !T || !g.value.length ? T : g.value.every((D) => D.change.what === "options.remove") ? "Add a new field with the choices you want to keep. Copy existing values into it before removing the old field." : g.value.every((D) => D.change.what === "state.remove") ? "Choose where existing items should move before removing their state." : T;
    }), p = {
      unchanged: ["No changes", "secondary"],
      cosmetic: ["Labels or settings", "secondary"],
      additive: ["New definitions", "success"],
      semantic: ["Affects existing items", "warn"],
      refused: ["Blocked", "danger"],
      initial: ["First setup", "secondary"]
    }, w = (T) => p[T]?.[0] ?? "Review needed", x = (T) => p[T]?.[1] ?? "secondary";
    function $(T) {
      const { detail: D, ...z } = T;
      return nl(T.what === "invalid" || T.what.startsWith("views.") || T.what.startsWith("automation") ? T : z);
    }
    return (T, D) => e.plan ? (n(), f("section", zm, [
      !e.plan.changes.length && !e.plan.refused.length && !e.configCount && !e.packReview ? (n(), f("p", jm, "No changes to apply.")) : (n(), f(ee, { key: 1 }, [
        s("header", qm, [
          D[0] || (D[0] = s("h3", null, "Impact on this board", -1)),
          k(c(et), {
            class: "kx-tag-sm",
            severity: x(e.plan.class)
          }, {
            default: q(() => [
              W(S(w(e.plan.class)), 1)
            ]),
            _: 1
          }, 8, ["severity"])
        ]),
        s("p", Wm, S(c(Bi)[e.plan.class] || "Review the changes below."), 1),
        r.value.length ? (n(), f("section", Gm, [
          D[1] || (D[1] = s("h3", null, "Plugin configuration", -1)),
          (n(!0), f(ee, null, fe(r.value, (z) => (n(), f("div", {
            key: z.id
          }, [
            s("strong", null, S(z.title), 1),
            (n(!0), f(ee, null, fe(z.fields, (le) => (n(), f("p", {
              key: le.title
            }, S(le.title) + " · " + S(le.value), 1))), 128))
          ]))), 128))
        ])) : C("", !0),
        h.value ? (n(), f("p", Km, S(h.value), 1)) : e.follows.length ? (n(), f("p", Hm, "Existing items in " + S(e.follows.join(", ")) + " will follow the updated workflow.", 1)) : C("", !0),
        v.value.length ? (n(), f("section", Ym, [
          D[2] || (D[2] = s("h3", null, "Flow bindings", -1)),
          (n(!0), f(ee, null, fe(v.value, (z) => (n(), f("p", {
            key: z.key
          }, [
            W(S(z.process) + " / " + S(z.state) + " · ", 1),
            s("strong", null, S(m.value.get(z.reference.id) ?? "Published Flow") + " · v" + S(z.reference.version), 1)
          ]))), 128)),
          D[3] || (D[3] = s("p", { class: "work-muted work-small" }, "New entries use these exact published versions. Before replacing a binding, stop new entries, let existing runs and deliveries finish, pause the old launcher, save, then resume entries.", -1))
        ])) : C("", !0),
        Ye(T.$slots, "default"),
        g.value.length ? (n(), f("h3", Xm, "Blocked changes")) : C("", !0),
        (n(!0), f(ee, null, fe(g.value, (z, le) => (n(), K(c(Wo), {
          key: le,
          severity: "error",
          role: "alert"
        }, {
          default: q(() => [
            s("strong", null, S(z.title), 1),
            (n(!0), f(ee, null, fe(z.details, (Z, ue) => (n(), f("p", { key: ue }, S(Z), 1))), 128)),
            s("p", null, S($(z.change)), 1),
            k(je, {
              class: "work-small",
              label: "Technical details"
            }, {
              default: q(() => [
                s("code", null, S(z.change.what), 1)
              ]),
              _: 2
            }, 1024)
          ]),
          _: 2
        }, 1024))), 128)),
        V.value.length ? (n(), f("table", Jm, [
          D[4] || (D[4] = s("thead", null, [
            s("tr", null, [
              s("th", { scope: "col" }, "Change"),
              s("th", { scope: "col" }, "Impact")
            ])
          ], -1)),
          s("tbody", null, [
            (n(!0), f(ee, null, fe(V.value, (z, le) => (n(), f("tr", { key: le }, [
              s("td", null, [
                s("strong", null, S(z.title), 1),
                (n(!0), f(ee, null, fe(z.details, (Z, ue) => (n(), f("p", { key: ue }, S(Z), 1))), 128)),
                z.change.count ? (n(), f("p", Zm, S(z.change.count) + " " + S(z.change.count === 1 ? "item" : "items"), 1)) : C("", !0)
              ]),
              s("td", null, [
                k(c(et), {
                  class: "kx-tag-sm",
                  severity: x(z.change.class)
                }, {
                  default: q(() => [
                    W(S(w(z.change.class)), 1)
                  ]),
                  _: 2
                }, 1032, ["severity"])
              ])
            ]))), 128))
          ])
        ])) : C("", !0)
      ], 64))
    ])) : C("", !0);
  }
}), _m = {
  class: "work-stack work-tight",
  "aria-label": "Pack resources"
}, ep = {
  key: 0,
  class: "work-muted work-small"
}, tp = {
  key: 0,
  class: "work-stack",
  "aria-label": "Pack conflicts"
}, ap = { class: "work-stack work-tight work-pack-review-field" }, lp = { class: "work-config-fields" }, op = { class: "work-json-example" }, ip = { class: "work-json-example" }, np = {
  key: 1,
  class: "work-stack",
  "aria-label": "Pack state maps"
}, sp = /* @__PURE__ */ Se({
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
    const t = e, l = a, o = F(() => [
      { label: "Saved views", entries: t.plan.views?.map((u) => ({ id: u.id, name: u.title || u.id })) },
      { label: "Automations", entries: t.plan.automations?.map((u) => ({ id: u.id, name: u.id })) },
      { label: "Traits", entries: t.plan.traits?.map((u) => ({ id: u, name: u })) },
      { label: "Required plugins", entries: t.plan.plugins?.map((u) => ({ id: u, name: t.plugins?.find((d) => d.plugin === u)?.title || u })) }
    ].filter((u) => u.entries?.length));
    function r(u) {
      return t.original.processes?.find((d) => d.id === u)?.name || Me(u);
    }
    function v(u) {
      const [d, ...V] = u.split("."), g = V.join(".");
      return d === "processes" ? r(g) : d === "fields" ? t.original.fields?.find((h) => h.code === g)?.title || Me(g) : d === "item_types" ? t.original.item_types?.find((h) => h.id === g)?.title || Me(g) : Me(d);
    }
    function m(u) {
      return JSON.stringify(u ?? null, null, 2);
    }
    function b(u, d) {
      (t.request.resolutions ??= {})[u] = d, l("change");
    }
    function i(u, d, V) {
      ((t.request.maps ??= {})[u] ??= {})[d] = V, l("change");
    }
    return (u, d) => (n(), f(ee, null, [
      s("section", _m, [
        d[1] || (d[1] = s("h3", null, "Pack resources", -1)),
        s("p", null, [
          d[0] || (d[0] = W("Target version ", -1)),
          s("strong", null, S(e.plan.version), 1)
        ]),
        o.value.length ? (n(), f("p", ep, "Resources included in this plan.")) : C("", !0),
        (n(!0), f(ee, null, fe(o.value, (V) => (n(), f("div", {
          key: V.label
        }, [
          s("h4", null, S(V.label), 1),
          s("ul", null, [
            (n(!0), f(ee, null, fe(V.entries, (g) => (n(), f("li", {
              key: g.id
            }, S(g.name), 1))), 128))
          ])
        ]))), 128))
      ]),
      e.plan.conflicts.length ? (n(), f("section", tp, [
        d[4] || (d[4] = s("h3", null, "Local edits conflict", -1)),
        d[5] || (d[5] = s("p", { class: "work-muted work-small" }, "Choose which declaration to keep for each conflict, then review again.", -1)),
        (n(!0), f(ee, null, fe(e.plan.conflicts, (V) => (n(), f("div", {
          key: V.path,
          class: "work-stack work-tight"
        }, [
          s("label", ap, [
            W(S(v(V.path)), 1),
            k(c(he), {
              "model-value": e.request.resolutions?.[V.path],
              "aria-label": "Resolution for " + v(V.path),
              disabled: e.disabled,
              appendTo: "self",
              placeholder: "Choose a resolution",
              optionLabel: "label",
              optionValue: "value",
              options: [{ label: "Keep local edits", value: "local" }, { label: "Use pack changes", value: "incoming" }],
              "onUpdate:modelValue": (g) => b(V.path, g)
            }, null, 8, ["model-value", "aria-label", "disabled", "onUpdate:modelValue"])
          ]),
          k(je, {
            class: "work-json-disclosure",
            label: "Compare declarations"
          }, {
            default: q(() => [
              s("div", lp, [
                s("section", null, [
                  d[2] || (d[2] = s("h4", null, "Local edits", -1)),
                  s("pre", op, S(m(V.local_value)), 1)
                ]),
                s("section", null, [
                  d[3] || (d[3] = s("h4", null, "Pack changes", -1)),
                  s("pre", ip, S(m(V.incoming)), 1)
                ])
              ])
            ]),
            _: 2
          }, 1024)
        ]))), 128))
      ])) : C("", !0),
      Object.keys(e.plan.maps).length ? (n(), f("section", np, [
        d[6] || (d[6] = s("h3", null, "Required state maps", -1)),
        d[7] || (d[7] = s("p", { class: "work-muted work-small" }, "Review the proposed destinations for existing items. Each destination is editable.", -1)),
        (n(!0), f(ee, null, fe(e.plan.maps, (V, g) => (n(), f("div", {
          key: g,
          class: "work-stack"
        }, [
          s("h4", null, S(r(g)), 1),
          (n(!0), f(ee, null, fe(V, (h, p) => (n(), f("label", {
            key: p,
            class: "work-stack work-tight work-pack-review-field"
          }, [
            W("Move items from " + S(c(ke)(e.original.processes?.find((w) => w.id === g)?.states.find((w) => w.id === p))), 1),
            k(c(he), {
              "model-value": e.request.maps?.[g]?.[p],
              "aria-label": "Move items from " + c(ke)(e.original.processes?.find((w) => w.id === g)?.states.find((w) => w.id === p)),
              disabled: e.disabled,
              appendTo: "self",
              optionLabel: "label",
              optionValue: "value",
              options: e.plan.declaration.processes?.find((w) => w.id === g)?.states.map((w) => ({ label: c(ke)(w), value: w.id })) ?? [],
              "onUpdate:modelValue": (w) => i(g, p, w)
            }, null, 8, ["model-value", "aria-label", "disabled", "options", "onUpdate:modelValue"])
          ]))), 128))
        ]))), 128))
      ])) : C("", !0)
    ], 64));
  }
});
function rp(e) {
  const { schema: a, configs: t, busy: l } = e, { packs: o, loading: r, error: v, load: m, reset: b } = zi(), i = F(() => o.value.filter(ji)), u = F(() => o.value.map(qi)), d = B(!1), V = B(""), g = F(() => u.value.find((te) => te.id === V.value && !te.disabled)), h = B(), p = B(), w = B(), x = B(!1), $ = B(""), T = B(), D = B(""), z = F(() => T.value?.result), le = F(() => !!z.value && z.value.status !== "done"), Z = F(() => !!h.value || e.schemaDirty()), ue = F(() => !l.value && !Z.value && !e.migrationPending() && !le.value), me = F(() => x.value ? p.value : void 0), ge = F(() => !!me.value && !!w.value && JSON.stringify(w.value.request) === JSON.stringify(h.value)), be = F(() => e.canReview() && !e.migrationPending() && !l.value && ge.value && me.value?.class !== "refused" && !me.value?.refused.length && p.value?.conflicts.every((te) => !!h.value?.resolutions?.[te.path])), se = F(() => i.value.find((te) => te.id === h.value?.pack)?.plugins.filter((te) => !a.value?.plugins?.some((I) => I.plugin === te.plugin && I.active)).map((te) => ({ use: te.plugin })) ?? []), R = F(() => i.value.find((te) => te.id === a.value?.pack?.id)?.title || "Installed pack"), _ = F(() => i.value.find((te) => te.id === a.value?.pack?.id)), L = F(() => !v.value && !!a.value?.outdated && u.value.some((te) => te.id === a.value?.pack?.id && !te.disabled)), ie = F(() => v.value ? "Reload packs to check available upgrades." : le.value ? "Finish the current pack installation before upgrading." : L.value ? Z.value ? "Discard the current draft before upgrading." : e.migrationPending() ? "Finish the current migration before upgrading." : l.value ? "Wait for the current request to finish." : void 0 : "Install an available version of this pack to upgrade."), xe = ua();
  function Oe() {
    w.value = void 0;
  }
  function H() {
    xe(), Oe(), x.value = !1;
  }
  function j() {
    h.value = void 0, p.value = void 0, H();
  }
  function M() {
    j(), b(), T.value = void 0, D.value = "";
  }
  function ce() {
    $.value = "";
  }
  Ue(t, (te) => {
    h.value && (Object.keys(te).length ? h.value.plugin_configs = sa(te) : delete h.value.plugin_configs);
  }, { deep: !0, flush: "sync" });
  async function y() {
    if (!h.value || l.value || !e.canReview()) return;
    const te = xe(), I = sa(h.value), Q = JSON.stringify(h.value);
    l.value = !0, ce(), e.clearSaved();
    try {
      const E = await Wi(I, (oe) => Qt.packPlan(e.boardId(), oe));
      if (!te() || Q !== JSON.stringify(h.value)) return;
      p.value = E.plan, x.value = !0, h.value = E.request, w.value = { request: sa(E.request), key: crypto.randomUUID() };
    } catch (E) {
      te() && (Oe(), $.value = mt(E, "Could not review the pack."));
    } finally {
      l.value = !1;
    }
  }
  async function U() {
    if (!a.value?.pack || !ue.value || !L.value) return;
    const te = i.value.find((I) => I.id === a.value?.pack?.id);
    te && (h.value = fo(te, a.value.generation), e.openReview(), await y());
  }
  async function P() {
    const te = i.value.find((I) => I.id === V.value);
    !a.value || !te || !g.value || !ue.value || r.value || (h.value = fo(te, a.value.generation), d.value = !1, e.openReview(), await y());
  }
  async function A(te, I, Q) {
    const E = e.boardId(), oe = await Qt.packApply(E, te, I);
    e.boardId() === E && (T.value = { request: te, key: I, result: oe, draft: Q }, await e.applied(oe.generation, Q));
  }
  async function G() {
    if (!be.value || !w.value) return !1;
    l.value = !0, ce();
    try {
      return await A(sa(w.value.request), w.value.key, e.draftSnapshot()), !0;
    } catch (te) {
      return $.value = mt(te, "Could not apply the pack upgrade."), !1;
    } finally {
      l.value = !1;
    }
  }
  async function re() {
    const te = T.value;
    if (!(!te || !le.value || l.value || !e.authorized())) {
      l.value = !0, D.value = "";
      try {
        await A(te.request, te.key, te.draft);
      } catch (I) {
        D.value = mt(I, "Could not continue the pack installation.");
      } finally {
        l.value = !1;
      }
    }
  }
  return {
    choices: u,
    loading: r,
    error: v,
    load: m,
    installing: d,
    installPack: V,
    installChoice: g,
    canManage: ue,
    title: R,
    installed: _,
    upgradeAvailable: L,
    upgradeReason: ie,
    request: h,
    preview: p,
    plan: me,
    reviewError: $,
    isReviewed: ge,
    canApply: be,
    plugins: se,
    result: z,
    inProgress: le,
    operationError: D,
    install: P,
    upgrade: U,
    review: y,
    apply: G,
    continueInstallation: re,
    changed: Oe,
    invalidate: H,
    clearReviewError: ce,
    clear: j,
    reset: M
  };
}
const dp = { class: "work-section-layout" }, up = { class: "kx-main" }, cp = ["aria-label"], vp = {
  key: 1,
  class: "kx-err work-alert-actions"
}, fp = { role: "alert" }, mp = {
  key: 2,
  class: "work-notice",
  role: "status"
}, pp = {
  key: 3,
  class: "kx-loading",
  role: "status"
}, gp = {
  key: 4,
  class: "work-notice",
  role: "alert"
}, hp = {
  key: 5,
  class: "work-settings-body"
}, bp = {
  key: 0,
  class: "work-notice work-stack work-tight",
  "aria-label": "Pack installation"
}, yp = {
  key: 0,
  role: "status"
}, kp = {
  key: 1,
  role: "status"
}, wp = { class: "work-small" }, $p = {
  key: 2,
  class: "kx-err",
  role: "alert"
}, Vp = { key: 3 }, xp = {
  key: 1,
  class: "work-notice",
  role: "alert"
}, Cp = {
  key: 2,
  class: "work-notice"
}, Sp = ["id"], Tp = ["disabled", "inert"], Ip = {
  key: 3,
  class: "work-ia-section"
}, Dp = {
  key: 0,
  class: "work-muted"
}, Up = {
  key: 5,
  class: "work-ia-section"
}, Ap = { class: "work-review-layout" }, Ep = { class: "work-muted" }, Rp = ["aria-busy"], Op = {
  key: 0,
  role: "status"
}, Pp = {
  key: 1,
  role: "alert",
  class: "kx-err"
}, Np = {
  key: 2,
  role: "alert"
}, Mp = { key: 7 }, Fp = { class: "work-dialog-actions" }, Lp = {
  key: 3,
  class: "work-muted",
  role: "status"
}, Bp = {
  key: 0,
  class: "work-muted",
  role: "status"
}, zp = {
  key: 1,
  class: "kx-err work-alert-actions"
}, jp = { role: "alert" }, qp = {
  key: 2,
  class: "work-stack work-tight"
}, Wp = {
  key: 0,
  class: "work-pack-unavailable work-block"
}, Gp = {
  key: 3,
  class: "work-muted"
}, Kp = { class: "work-dialog-actions" }, Hp = /* @__PURE__ */ Se({
  __name: "BoardSettings",
  props: {
    boardId: {},
    embedded: { type: Boolean },
    focusBack: { type: Boolean },
    route: {}
  },
  emits: ["dirty-change", "navigate"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = sn(), r = $t(), v = B();
    let m, b = "";
    const i = () => JSON.stringify([lt.value, j.value, de.request, [...at.value]]), u = F(() => ({
      value: "all-boards",
      label: t.embedded ? "All boards" : "Back to board",
      icon: t.embedded ? "tabler:table" : "tabler:layout-kanban"
    })), d = B();
    Ue(d, (X) => {
      t.focusBack && X?.$el.querySelector(".kx-settings-rail-item")?.focus();
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
    ], g = B("General"), h = {
      General: "general",
      "Item types": "items",
      Fields: "fields",
      Links: "links",
      Workflow: "workflow",
      Access: "access",
      Plugins: "plugins"
    }, p = B("");
    function w(X, N = "") {
      g.value = X, p.value = N ? h[X] + "/" + N : "";
    }
    function x(X, N = "") {
      w(X, N), t.route !== void 0 && l("navigate", [h[X], ...N ? [encodeURIComponent(N)] : []].join("/"));
    }
    function $(X, N, J) {
      if (t.route === void 0 || h[g.value] !== X || !J && p.value !== X + "/" + N) return;
      const De = ie.value?.declaration;
      (X === "items" ? De?.item_types?.some((Ne) => Ne.id === N) : X === "fields" ? De?.fields?.some((Ne) => Ne.code === N) : X === "links" ? De?.relation_types?.some((Ne) => Ne.id === N) : X === "plugins" ? M.value?.schema_options.plugins.some((Ne) => Ne.plugin === N) : X === "workflow" && De?.processes?.some((Ne) => Ne.states.some((Fe) => Ne.id + ".state." + Fe.id === N) || Ne.transitions?.some((Fe) => Ne.id + ".transition." + Fe.id === N))) && x(g.value, J ? N : "");
    }
    Mo(sl, { selected: p, choose: $ });
    function T(X) {
      if (X === u.value.value) {
        wi();
        return;
      }
      (X === "General" || V.some((N) => N.items.some((J) => J.value === X))) && x(X);
    }
    async function D() {
      x("Access"), await wt(), v.value?.focus();
    }
    const z = {
      General: "Manage the board name, item key prefix and app.",
      "Item types": "Choose the fields, parent relationships and workflow for each kind of work.",
      Fields: "Choose what information people can capture on items.",
      Links: "Configure link types and how they appear on related items.",
      Workflow: "Select a state or transition to edit how work moves.",
      Access: "Who can use this board?",
      Plugins: "Choose which plugins this board uses."
    }, le = B(""), Z = B();
    function ue(X, N, J) {
      J.currentTarget instanceof HTMLElement && (Z.value = { section: X, type: N, opener: J.currentTarget }, X === "Fields" && (le.value = N.id), x(X));
    }
    function me(X) {
      const N = Z.value;
      if (!N) return;
      X !== void 0 && (N.type.process = X);
      const J = N.type.id, De = ie.value?.declaration.item_types?.some((Qe) => Qe.id === J);
      x("Item types", De ? J : ""), Z.value = void 0, N.section === "Fields" && wt(() => N.opener.focus());
    }
    const ge = B(!1), be = B(""), se = B();
    Ue(g, (X) => {
      v.value?.scrollTo({ top: 0 }), Z.value && X !== Z.value.section && (Z.value = void 0);
    });
    function R() {
      ge.value = !1, be.value = "", de.clearReviewError(), Fa.value = !1, Y.value = !1;
    }
    async function _(X) {
      vl.value && (vt.value.size && (g.value !== "Plugins" && (x("Plugins"), await wt()), St.value && !await St.value.reportValidity()) || !hi() || at.value.size || (se.value = X, ge.value = !0, La()));
    }
    const L = B(/* @__PURE__ */ new Set(["General"]));
    Ue(g, (X) => L.value.add(X));
    const ie = B(), xe = B(), Oe = B(), H = B({}), j = B({}), M = B(), ce = B(!1), y = B(!0), U = B(!1), P = B(""), A = B(""), G = F(() => H.value.processes ?? []), re = F(() => ce.value && ie.value ? [
      { heading: Oe.value?.title || "Board settings", items: [{ value: "General", label: "General", icon: "tabler:settings" }] },
      ...V
    ] : []), te = B(), I = B(!1), Q = ua();
    async function E(X) {
      const N = Q();
      I.value = !1;
      try {
        const J = await Nt.stateCounts(X);
        N() && (te.value = J);
      } catch {
        N() && (I.value = !0, te.value = void 0);
      }
    }
    Ue(g, (X) => {
      ce.value && X === "Workflow" && E(t.boardId);
    });
    const oe = B(), Ve = B(), Pe = B(""), O = B({}), Y = B(!1), ye = F(() => de.request ? [] : Gi(oe.value)), ve = F(() => ye.value.every((X) => X.resolution !== "keep") && (!ye.value.some((X) => X.resolution === "drop") || Y.value)), We = B([]), Te = B(!1), rt = B(0), at = B(/* @__PURE__ */ new Set()), jt = B(), St = B(), vt = B(/* @__PURE__ */ new Set()), fa = F(() => [...at.value].some((X) => !vt.value.has(X)));
    function _t(X, N) {
      const J = "plugin:" + X;
      N ? vt.value.delete(J) : vt.value.add(J);
    }
    const qt = ua(), Ie = ua(), lt = F(() => hl(H.value, ie.value?.declaration ?? {})), oo = F(() => at.value.size > 0 || vt.value.size > 0 || !!ie.value && (JSON.stringify(lt.value) !== JSON.stringify(hl(ie.value.declaration, ie.value.declaration)) || Object.keys(j.value).length > 0)), Na = F(() => !!xe.value?.migration_error || Oe.value?.status === "migrating"), Tt = F(() => !!ie.value && !!xe.value && ie.value.generation !== xe.value.generation), dl = () => ce.value && !Tt.value && !at.value.size && !vt.value.size, de = Ti(rp({
      boardId: () => t.boardId,
      schema: ie,
      configs: j,
      busy: U,
      schemaDirty: () => oo.value,
      migrationPending: () => Na.value,
      canReview: dl,
      authorized: () => ce.value,
      draftSnapshot: i,
      openReview: () => {
        se.value = void 0, ge.value = !0;
      },
      clearSaved: () => {
        A.value = "";
      },
      applied: yi
    })), vi = F(() => {
      const X = ie.value?.pack;
      if (X)
        return {
          id: X.id,
          version: X.version,
          title: de.title,
          description: de.installed?.description,
          requires: de.installed?.requires ?? [],
          outdated: ie.value?.outdated,
          canUpgrade: de.upgradeAvailable && de.canManage,
          upgradeReason: de.upgradeReason
        };
    }), Wt = F(() => de.request ? de.plan : oe.value), ul = F(() => de.request ? de.reviewError : be.value), cl = F(() => [...We.value, ...Wt.value?.refused ?? []]), Ma = F(() => !!de.request || oo.value), vl = F(() => Ma.value && !(de.inProgress && de.request)), fl = B(!1), io = F(() => Ma.value || fl.value);
    Ue(io, (X) => l("dirty-change", X), { immediate: !0, flush: "sync" });
    const fi = F(() => (!ma.value.renamed.length || Fa.value) && dl() && !U.value && !Te.value && !Na.value && oe.value && (oe.value.changes.length > 0 || Object.keys(j.value).length > 0) && oe.value.class !== "refused" && !oe.value.refused.length && ve.value && Ve.value?.matches(lt.value, ie.value?.generation ?? -1, j.value, O.value)), no = F(() => de.request ? de.canApply : fi.value), so = F(() => de.request ? de.isReviewed : !!oe.value), Fa = B(!1), ma = F(() => {
      const X = ie.value?.declaration, N = [], J = [];
      for (const De of G.value) {
        const Qe = X?.item_types?.filter((Fe) => Fe.process === De.id) ?? [], Ne = X?.processes?.find((Fe) => Fe.id === De.id);
        for (const Fe of Ne?.states ?? []) {
          const ea = De.states.find((Gt) => Gt.id === Fe.id);
          if (ea && ea.name === Fe.name) continue;
          const gl = [...Wt.value?.refused ?? [], ...Wt.value?.changes ?? []].find((Gt) => Gt.code === "process " + De.id && Gt.detail === Fe.id && ["state.remove", "state.map"].includes(Gt.what))?.count ?? Qe.reduce((Gt, Vi) => Gt + (te.value?.[Vi.id]?.[Fe.id] ?? 0), 0);
          gl && (ea ? J.push({ process: De, state: Fe, name: ke(ea), count: gl }) : N.push({ process: De, state: Fe, count: gl }));
        }
      }
      return { removed: N, renamed: J };
    });
    function mi(X, N, J) {
      X.map = { ...X.map, [N]: J }, La();
    }
    const ro = F(() => de.preview?.declaration ?? Ve.value?.declaration), pi = F(() => {
      const X = ro.value;
      return !Wt.value || !X ? [] : Ki(Wt.value, X).map((N) => X.processes?.find((J) => J.id === N)?.name || "Untitled process");
    });
    function Vt() {
      We.value = [], Ie(), oe.value = void 0, Ve.value = void 0, Pe.value = "", de.invalidate();
    }
    Ue([lt, j], () => {
      O.value = {}, Y.value = !1, Vt();
    }, { deep: !0, flush: "sync" });
    function gi(X, N) {
      O.value = { ...O.value, [X]: N }, Y.value = !1, Vt(), La();
    }
    Ue(Ma, (X) => {
      X && (A.value = "");
    });
    function pa(X, N) {
      N ? at.value.delete(X) : at.value.add(X), Vt();
    }
    function ml(X) {
      de.clear(), Z.value = void 0, rt.value++, ie.value = X, H.value = sa(X.declaration), j.value = {}, at.value.clear(), vt.value.clear(), Vt();
    }
    async function ht(X = !1) {
      const N = qt();
      try {
        const [J, De, Qe] = await Promise.all([Nt.schema(t.boardId, void 0, !0).catch((Fe) => {
          if (Fe instanceof El && Fe.details?.code === "board_schema_missing") return { generation: 0, declaration: {}, compiled: {}, key_prefix: "", as_of: 0 };
          throw Fe;
        }), Nt.options(t.boardId), Nt.boards()]);
        if (!N()) return;
        if (ce.value = De.access.admin, M.value = De, Oe.value = Qe.find((Fe) => Fe.board_id === t.boardId), !ce.value) {
          ie.value = void 0, H.value = {}, Vt();
          return;
        }
        P.value = "";
        const Ne = Hi(J);
        xe.value = Ne, m !== void 0 && Ne.generation >= m ? (m = void 0, b === i() && ml(Ne), b = "") : (X || !ie.value || !Ma.value && Ne.generation !== ie.value.generation) && ml(Ne), Tt.value && Vt(), await de.load(N), N() && g.value === "Workflow" && E(t.boardId);
      } catch (J) {
        if (!N()) return;
        J instanceof El && (J.status === 403 || J.kind?.toLowerCase() === "permission_denied") && (ce.value = !1), Vt(), P.value = mt(J, "Could not load board settings.");
      } finally {
        N() && (y.value = !1);
      }
    }
    function hi() {
      for (const X of Array.from(jt.value?.elements ?? []))
        if ((X instanceof HTMLInputElement || X instanceof HTMLSelectElement || X instanceof HTMLTextAreaElement) && !(X.form !== jt.value || X.closest('[style*="display: none"]:not(.p-accordioncontent)')) && !X.reportValidity()) {
          const J = X.closest('.p-accordioncontent[style*="display: none"]')?.closest(".kx-disclosure")?.querySelector('.kx-disclosure-toggle[aria-expanded="false"]');
          return J && (J.click(), wt(() => X.reportValidity())), !1;
        }
      return !0;
    }
    async function La() {
      if (de.request) return de.review();
      if (!ie.value || U.value || !dl()) return;
      const X = Ie(), N = mo(lt.value, ie.value.generation, j.value, O.value);
      U.value = !0, be.value = "", A.value = "";
      try {
        const J = (N.declaration.processes ?? []).some((Qe) => ie.value?.declaration.processes?.find((Ne) => Ne.id === Qe.id)?.states.some((Ne) => Qe.states.some((Fe) => Fe.id === Ne.id && Fe.name !== Ne.name))), [De] = await Promise.all([
          Qt.plan(t.boardId, N),
          J ? E(t.boardId) : void 0
        ]);
        if (J && I.value) {
          Vt(), be.value = "Could not check which items use the renamed states. Check the impact again.";
          return;
        }
        if (!X() || at.value.size || !N.matches(lt.value, ie.value.generation, j.value, O.value)) return;
        oe.value = De, Ve.value = N, Pe.value = crypto.randomUUID(), ge.value = !0;
      } catch (J) {
        X() && (Vt(), be.value = mt(J, "Could not review changes."), We.value = Yi(J, lt.value));
      } finally {
        U.value = !1;
      }
    }
    async function bi() {
      if (!no.value) return;
      if (de.request) {
        await de.apply() && R();
        return;
      }
      if (!Ve.value) return;
      U.value = !0, be.value = "", A.value = "";
      const X = i();
      try {
        m = (await Qt.apply(t.boardId, Ve.value, Pe.value)).generation, b = X, await ht(), A.value = "Board changes applied.", R();
      } catch (N) {
        be.value = mt(N, "Could not apply the board changes.");
      } finally {
        U.value = !1;
      }
    }
    async function yi(X, N) {
      N === i() && (m = X, b = N), await ht();
    }
    async function ki() {
      if (!U.value) {
        U.value = !0, P.value = "";
        try {
          const X = await Qt.resume(t.boardId);
          A.value = X.resumed ? "Migration resumes." : "Migration is already running.", await ht();
        } catch (X) {
          P.value = mt(X, "Could not resume migration.");
        } finally {
          U.value = !1;
        }
      }
    }
    async function Ba(X, N) {
      if (!ie.value || !ce.value || U.value || Te.value) return "Wait for the current change to finish.";
      if (Tt.value) return "Discard the stale draft before removing a definition.";
      const J = ie.value.generation, De = JSON.stringify(lt.value), Qe = sa(H.value);
      Ra(Qe, X, N), Te.value = !0;
      try {
        const Ne = await Qt.plan(t.boardId, mo(hl(Qe, ie.value.declaration), J, j.value));
        if (!ce.value || Tt.value || ie.value.generation !== J || JSON.stringify(lt.value) !== De) return "The draft changes during the check. Try the removal again.";
        const Fe = Xi(Ne, X, N);
        if (Fe) return Fe;
        if (Ne.refused.some((ea) => ea.what !== "field.remove")) return "Resolve the blocked changes in your draft before removing this definition.";
      } catch (Ne) {
        return mt(Ne, "Could not check this removal.");
      } finally {
        Te.value = !1;
      }
    }
    async function wi() {
      if (t.embedded) {
        o({ name: "boards" });
        return;
      }
      io.value && !await qo.confirm({ header: "Discard changes?", message: "Your unsaved board settings will be discarded.", acceptLabel: "Discard", rejectLabel: "Keep editing" }) || o({ name: "board", board: t.boardId });
    }
    function $i() {
      m = void 0, xe.value && ml(xe.value), A.value = "", P.value = "", R();
    }
    Ue(() => t.boardId, () => {
      fl.value = !1, m = void 0, de.reset(), ie.value = void 0, xe.value = void 0, Oe.value = void 0, j.value = {}, at.value.clear(), vt.value.clear(), Q(), te.value = void 0, le.value = "", Z.value = void 0, L.value = /* @__PURE__ */ new Set(["General"]), w("General"), R(), ce.value = !1, y.value = !0, ht(!0);
    }), Ue([() => t.route, () => t.boardId], ([X]) => {
      if (X === void 0) return;
      const [N, J] = X.split("/"), De = Object.keys(h).find((Ne) => h[Ne] === N) ?? "General";
      let Qe = "";
      try {
        J && (Qe = decodeURIComponent(J));
      } catch {
      }
      De === "Fields" && Qe && p.value !== "fields/" + Qe && (le.value = ""), w(De, Qe), L.value.add(De);
    }, { immediate: !0 });
    let pl = () => {
    };
    return Ue(() => t.boardId, (X) => {
      pl(), pl = Ji(`component.${X}`, () => {
        ht();
      });
    }, { immediate: !0 }), Ii(ht), Kl(() => {
      pl(), qt(), Ie(), Q(), de.invalidate();
    }), (X, N) => (n(), f("section", {
      class: pt(["work-settings-shell work-ia", { "work-embedded": e.embedded }])
    }, [
      s("div", dp, [
        k(nn, {
          ref_key: "rail",
          ref: d,
          label: "Board settings sections",
          value: g.value,
          groups: re.value,
          "leading-item": u.value,
          "onUpdate:value": T
        }, null, 8, ["value", "groups", "leading-item"]),
        s("div", up, [
          s("div", {
            ref_key: "pane",
            ref: v,
            class: "kx-main-scroll work-settings-content",
            role: "region",
            "aria-label": g.value,
            tabindex: "-1"
          }, [
            ce.value && ie.value ? (n(), K(wf, {
              key: 0,
              title: g.value,
              description: z[g.value]
            }, Da({ _: 2 }, [
              vl.value || g.value === "Plugins" ? {
                name: "actions",
                fn: q(() => [
                  g.value === "Plugins" ? (n(), K(c(ae), {
                    key: 0,
                    label: "Refresh status",
                    severity: "secondary",
                    outlined: "",
                    disabled: U.value || y.value,
                    onClick: N[0] || (N[0] = (J) => ht())
                  }, {
                    icon: q(() => [
                      k(c(pe), {
                        icon: "tabler:refresh",
                        "aria-hidden": "true"
                      })
                    ]),
                    _: 1
                  }, 8, ["disabled"])) : C("", !0),
                  vl.value ? (n(), K($f, {
                    key: 1,
                    busy: U.value,
                    "discard-disabled": Te.value,
                    "review-disabled": Te.value || Na.value || Tt.value || fa.value,
                    onDiscard: $i,
                    onReview: _
                  }, null, 8, ["busy", "discard-disabled", "review-disabled"])) : C("", !0)
                ]),
                key: "0"
              } : void 0
            ]), 1032, ["title", "description"])) : C("", !0),
            P.value ? (n(), f("div", vp, [
              s("p", fp, S(P.value), 1),
              k(c(ae), {
                label: "Retry",
                severity: "secondary",
                outlined: "",
                onClick: N[1] || (N[1] = (J) => ht())
              })
            ])) : C("", !0),
            A.value ? (n(), f("p", mp, S(A.value), 1)) : C("", !0),
            y.value ? (n(), f("p", pp, "Loading board settings…")) : !ce.value && !P.value ? (n(), f("p", gp, "Ask a board administrator to grant you access to these settings.")) : C("", !0),
            ce.value && ie.value ? (n(), f("div", hp, [
              de.result ? (n(), f("section", bp, [
                de.inProgress ? (n(), f("p", yp, [
                  N[28] || (N[28] = W("Pack installation status ", -1)),
                  s("strong", null, S(c(Me)(de.result.status)), 1)
                ])) : (n(), f("p", kp, "Pack applied.")),
                s("p", wp, [
                  N[29] || (N[29] = W("Operation ", -1)),
                  s("code", null, S(de.result.operation_id), 1),
                  N[30] || (N[30] = W(" · Job ", -1)),
                  s("code", null, S(de.result.job_id), 1)
                ]),
                de.operationError ? (n(), f("p", $p, S(de.operationError), 1)) : C("", !0),
                de.inProgress ? (n(), f("div", Vp, [
                  k(c(ae), {
                    label: "Continue pack installation",
                    severity: "secondary",
                    outlined: "",
                    loading: U.value,
                    disabled: U.value,
                    onClick: de.continueInstallation
                  }, null, 8, ["loading", "disabled", "onClick"])
                ])) : C("", !0)
              ])) : C("", !0),
              Tt.value ? (n(), f("p", xp, "Someone saved new settings while you were editing. Discard this draft to load their changes.")) : C("", !0),
              Na.value ? (n(), f("div", Cp, [
                s("p", null, S(xe.value?.migration_error ? "Updating existing items paused." : "Updating existing items…"), 1),
                xe.value?.migration_error ? (n(), K(je, {
                  key: 0,
                  label: "Technical details"
                }, {
                  default: q(() => [
                    W(S(xe.value.migration_error), 1)
                  ]),
                  _: 1
                })) : C("", !0),
                xe.value?.migration_error ? (n(), K(c(ae), {
                  key: 1,
                  label: "Resume updating items",
                  severity: "secondary",
                  disabled: U.value,
                  outlined: "",
                  onClick: ki
                }, null, 8, ["disabled"])) : C("", !0)
              ])) : C("", !0),
              yt(k(Nm, {
                draft: H.value,
                schema: xe.value ?? ie.value,
                board: Oe.value,
                active: g.value === "General",
                "board-apps": M.value?.board_apps,
                "draft-form": c(r),
                disabled: U.value || Te.value,
                "pack-title": ie.value.pack ? de.title : void 0,
                outdated: ie.value.outdated,
                "upgrade-reason": de.upgradeReason,
                "can-upgrade": de.upgradeAvailable && de.canManage,
                "can-install": de.canManage,
                "pack-error": de.error,
                onUpgrade: de.upgrade,
                onInstall: N[2] || (N[2] = (J) => de.installing = !0),
                onRetry: N[3] || (N[3] = (J) => de.load()),
                onDirtyChange: N[4] || (N[4] = (J) => fl.value = J),
                onSaved: N[5] || (N[5] = (J) => ht()),
                onShare: D
              }, null, 8, ["draft", "schema", "board", "active", "board-apps", "draft-form", "disabled", "pack-title", "outdated", "upgrade-reason", "can-upgrade", "can-install", "pack-error", "onUpgrade"]), [
                [It, g.value === "General"]
              ]),
              s("form", {
                id: c(r),
                ref_key: "editor",
                ref: jt,
                onSubmit: N[19] || (N[19] = Be((J) => _(), ["prevent"]))
              }, [
                (n(), f("fieldset", {
                  key: rt.value,
                  class: "work-settings-fieldset",
                  disabled: U.value || Te.value,
                  inert: U.value || Te.value || void 0
                }, [
                  L.value.has("Item types") ? yt((n(), K(nd, {
                    key: 0,
                    class: "work-ia-section",
                    draft: H.value,
                    "guard-removal": Ba,
                    issues: cl.value,
                    onCreateField: N[6] || (N[6] = (J, De) => ue("Fields", J, De)),
                    onCreateWorkflow: N[7] || (N[7] = (J, De) => ue("Workflow", J, De))
                  }, null, 8, ["draft", "issues"])), [
                    [It, g.value === "Item types"]
                  ]) : C("", !0),
                  L.value.has("Fields") ? yt((n(), K(Wr, {
                    key: 1,
                    class: "work-ia-section",
                    "board-id": e.boardId,
                    "installed-types": M.value?.installed_types,
                    draft: H.value,
                    "guard-removal": Ba,
                    issues: cl.value,
                    "item-type": le.value,
                    "onUpdate:itemType": N[8] || (N[8] = (J) => le.value = J),
                    "create-for-item-type": Z.value?.section === "Fields",
                    onCreated: N[9] || (N[9] = (J) => me()),
                    onCancelCreation: N[10] || (N[10] = (J) => me()),
                    onValidity: N[11] || (N[11] = (J, De) => pa("fields:" + J, De))
                  }, null, 8, ["board-id", "installed-types", "draft", "issues", "item-type", "create-for-item-type"])), [
                    [It, g.value === "Fields"]
                  ]) : C("", !0),
                  L.value.has("Links") ? yt((n(), K(kv, {
                    key: 2,
                    class: "work-ia-section",
                    draft: H.value,
                    "guard-removal": Ba
                  }, null, 8, ["draft"])), [
                    [It, g.value === "Links"]
                  ]) : C("", !0),
                  L.value.has("Workflow") ? yt((n(), f("section", Ip, [
                    I.value ? (n(), f("p", Dp, [
                      N[31] || (N[31] = W("Item counts are unavailable. ", -1)),
                      k(c(ae), {
                        label: "Reload counts",
                        text: "",
                        onClick: N[12] || (N[12] = (J) => E(e.boardId))
                      })
                    ])) : C("", !0),
                    k(_c, {
                      "board-id": e.boardId,
                      draft: H.value,
                      "guard-removal": Ba,
                      issues: cl.value,
                      counts: te.value,
                      "count-types": ie.value.declaration.item_types,
                      guards: M.value?.guards,
                      "create-for-item-type": Z.value?.section === "Workflow",
                      "creation-opener": Z.value?.opener,
                      onCreated: me,
                      onCancelCreation: N[13] || (N[13] = (J) => me()),
                      onValidity: N[14] || (N[14] = (J, De) => pa("process:" + J, De))
                    }, null, 8, ["board-id", "draft", "issues", "counts", "count-types", "guards", "create-for-item-type", "creation-opener"])
                  ], 512)), [
                    [It, g.value === "Workflow"]
                  ]) : C("", !0),
                  L.value.has("Access") ? yt((n(), K(Gf, {
                    key: 4,
                    active: g.value === "Access",
                    "board-id": e.boardId,
                    draft: H.value,
                    board: Oe.value,
                    busy: U.value,
                    onValidity: N[15] || (N[15] = (J) => pa("visibility", J))
                  }, null, 8, ["active", "board-id", "draft", "board", "busy"])), [
                    [It, g.value === "Access"]
                  ]) : C("", !0),
                  L.value.has("Plugins") ? yt((n(), f("section", Up, [
                    k(Io, {
                      ref_key: "pluginEditor",
                      ref: St,
                      "board-id": e.boardId,
                      draft: H.value,
                      schema: xe.value ?? ie.value,
                      options: M.value?.schema_options.plugins ?? [],
                      filters: M.value?.filters,
                      configs: j.value,
                      disabled: U.value,
                      pack: vi.value,
                      onConfigured: N[16] || (N[16] = (J) => {
                        Vt(), ht();
                      }),
                      onRefresh: N[17] || (N[17] = (J) => ht()),
                      onReview: _,
                      onUpgrade: de.upgrade,
                      onValidity: N[18] || (N[18] = (J, De) => pa("plugin:" + J, De)),
                      onWidgetValidity: _t
                    }, null, 8, ["board-id", "draft", "schema", "options", "filters", "configs", "disabled", "pack", "onUpgrade"])
                  ], 512)), [
                    [It, g.value === "Plugins"]
                  ]) : C("", !0)
                ], 8, Tp))
              ], 40, Sp),
              k(Rl, {
                visible: ge.value,
                label: "Review changes",
                busy: U.value,
                "return-focus": se.value,
                class: "work-review-sheet",
                onClose: R
              }, {
                default: q(() => [
                  s("div", Ap, [
                    s("header", null, [
                      N[32] || (N[32] = s("h2", null, "Review changes", -1)),
                      s("p", Ep, S(Oe.value?.title), 1)
                    ]),
                    s("div", {
                      class: "work-review-content work-stack",
                      "aria-busy": U.value
                    }, [
                      U.value ? (n(), f("p", Op, S(Wt.value ? "Applying or checking changes…" : "Checking the impact on your board…"), 1)) : C("", !0),
                      ul.value ? (n(), f("p", Pp, S(ul.value), 1)) : C("", !0),
                      Tt.value ? (n(), f("p", Np, "The board changed while you were editing. Close this review and discard the draft to load the latest settings.")) : C("", !0),
                      ge.value && !de.request && (ma.value.removed.length || ma.value.renamed.length) ? (n(), K(lv, {
                        key: 3,
                        removed: ma.value.removed,
                        renamed: ma.value.renamed,
                        disabled: U.value || Te.value,
                        confirmed: Fa.value,
                        "onUpdate:confirmed": N[20] || (N[20] = (J) => Fa.value = J),
                        onDestination: mi
                      }, null, 8, ["removed", "renamed", "disabled", "confirmed"])) : C("", !0),
                      ge.value && ye.value.length ? (n(), K(bn, {
                        key: 4,
                        removals: ye.value,
                        original: ie.value.declaration,
                        draft: lt.value,
                        choices: O.value,
                        disabled: U.value,
                        "drop-confirmed": Y.value,
                        "onUpdate:dropConfirmed": N[21] || (N[21] = (J) => Y.value = J),
                        onChoose: gi
                      }, null, 8, ["removals", "original", "draft", "choices", "disabled", "drop-confirmed"])) : C("", !0),
                      ge.value && de.request && de.plugins.length ? (n(), K(Io, {
                        key: 5,
                        "board-id": e.boardId,
                        draft: { plugins: de.plugins },
                        schema: xe.value ?? ie.value,
                        options: M.value?.schema_options.plugins.filter((J) => de.plugins.some((De) => De.use === J.plugin)) ?? [],
                        configs: j.value,
                        disabled: U.value,
                        "activation-locked": "",
                        onValidity: N[22] || (N[22] = (J, De) => pa("pack-plugin:" + J, De))
                      }, null, 8, ["board-id", "draft", "schema", "options", "configs", "disabled"])) : C("", !0),
                      ge.value ? (n(), K(Qm, {
                        key: 6,
                        "board-id": e.boardId,
                        original: ie.value.declaration,
                        declaration: ro.value,
                        plan: Wt.value,
                        follows: pi.value,
                        "config-count": Object.keys(j.value).length,
                        "plugin-configs": Ve.value?.plugin_configs,
                        "pack-review": !!de.preview,
                        plugins: M.value?.schema_options.plugins
                      }, {
                        default: q(() => [
                          de.preview && de.request ? (n(), K(sp, {
                            key: 0,
                            plan: de.preview,
                            request: de.request,
                            original: ie.value.declaration,
                            plugins: M.value?.schema_options.plugins,
                            disabled: U.value,
                            onChange: de.changed
                          }, null, 8, ["plan", "request", "original", "plugins", "disabled", "onChange"])) : C("", !0)
                        ]),
                        _: 1
                      }, 8, ["board-id", "original", "declaration", "plan", "follows", "config-count", "plugin-configs", "pack-review", "plugins"])) : C("", !0),
                      !U.value && !so.value && !Tt.value && !ul.value ? (n(), f("p", Mp, "Check the impact again before applying.")) : C("", !0)
                    ], 8, Rp),
                    s("footer", Fp, [
                      k(c(ae), {
                        label: "Keep editing",
                        severity: "secondary",
                        outlined: "",
                        disabled: U.value,
                        onClick: R
                      }, null, 8, ["disabled"]),
                      so.value ? (n(), K(c(ae), {
                        key: 1,
                        label: "Apply changes",
                        disabled: !no.value,
                        loading: U.value,
                        onClick: bi
                      }, null, 8, ["disabled", "loading"])) : (n(), K(c(ae), {
                        key: 0,
                        label: "Check impact",
                        disabled: U.value || Tt.value || !!at.value.size,
                        onClick: La
                      }, null, 8, ["disabled"]))
                    ])
                  ])
                ]),
                _: 1
              }, 8, ["visible", "busy", "return-focus"]),
              Te.value ? (n(), f("p", Lp, "Checking what uses this setting…")) : C("", !0)
            ])) : C("", !0)
          ], 8, cp)
        ])
      ]),
      ce.value ? (n(), K(Rl, {
        key: 0,
        visible: de.installing,
        label: "Install pack",
        busy: U.value,
        onClose: N[27] || (N[27] = (J) => de.installing = !1)
      }, {
        default: q(() => [
          de.installing ? (n(), f("form", {
            key: 0,
            class: "work-dialog-box work-stack",
            onSubmit: N[26] || (N[26] = Be(
              //@ts-ignore
              (...J) => de.install && de.install(...J),
              ["prevent"]
            ))
          }, [
            N[34] || (N[34] = s("h2", null, "Install a pack", -1)),
            N[35] || (N[35] = s("p", { class: "work-muted work-small" }, "Packs give an empty board a starting setup. Review checks whether this board is eligible.", -1)),
            de.loading ? (n(), f("p", Bp, "Loading packs…")) : de.error ? (n(), f("div", zp, [
              s("p", jp, S(de.error), 1),
              k(c(ae), {
                label: "Reload packs",
                severity: "secondary",
                outlined: "",
                onClick: N[23] || (N[23] = (J) => de.load())
              })
            ])) : de.choices.length ? (n(), f("label", qp, [
              N[33] || (N[33] = W("Pack ", -1)),
              k(c(he), {
                modelValue: de.installPack,
                "onUpdate:modelValue": N[24] || (N[24] = (J) => de.installPack = J),
                "aria-label": "Pack to install",
                appendTo: "self",
                optionLabel: "title",
                optionValue: "id",
                optionDisabled: "disabled",
                options: de.choices,
                pt: { option: ({ context: J }) => ({ "aria-label": [J.option.title, J.option.unavailable].filter(Boolean).join(". ") }) }
              }, {
                option: q(({ option: J }) => [
                  s("span", null, [
                    W(S(J.title), 1),
                    J.unavailable ? (n(), f("small", Wp, S(J.unavailable), 1)) : C("", !0)
                  ])
                ]),
                _: 1
              }, 8, ["modelValue", "options", "pt"])
            ])) : (n(), f("p", Gp, "No available packs were found.")),
            s("footer", Kp, [
              k(c(ae), {
                label: "Cancel",
                severity: "secondary",
                outlined: "",
                onClick: N[25] || (N[25] = (J) => de.installing = !1)
              }),
              k(c(ae), {
                type: "submit",
                label: "Review pack",
                disabled: !de.installChoice || !de.canManage || de.loading || !!de.error
              }, null, 8, ["disabled"])
            ])
          ], 32)) : C("", !0)
        ]),
        _: 1
      }, 8, ["visible", "busy"])) : C("", !0)
    ], 2));
  }
}), Yp = /* @__PURE__ */ Se({
  __name: "SettingsRoot",
  setup(e) {
    const a = Di(), t = Ui();
    return Mo(Ko, (l) => {
      a.value.embedded && l.name === "boards" ? t("back-to-boards", {}) : t("navigate", { route: rn(l) });
    }), (l, o) => (n(), K(Hp, {
      "board-id": c(a).boardId ?? "",
      embedded: c(a).embedded,
      "focus-back": c(a).focusBack,
      route: c(a).route,
      onNavigate: o[0] || (o[0] = (r) => c(t)("navigate", { route: r })),
      onDirtyChange: o[1] || (o[1] = (r) => c(t)("dirty-change", { dirty: r }))
    }, null, 8, ["board-id", "embedded", "focus-back", "route"]));
  }
}), Xp = Ai(Yp, {
  type: "object",
  properties: {
    "board-id": { type: "string", default: "", description: "Board to administer." },
    "focus-back": { type: "boolean", default: !1, description: "Focus the first rail action when opening settings from the board picker." },
    route: { type: "string", description: "Section and selected row in System." },
    embedded: { type: "boolean", default: !1, description: "Fits in a System detail pane." }
  }
});
Zi(import.meta.url, Xp);
//# sourceMappingURL=settings.js.map
