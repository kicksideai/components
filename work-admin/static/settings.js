import { defineComponent as ye, useModel as Bl, openBlock as n, createBlock as J, unref as d, withCtx as j, createVNode as y, createTextVNode as W, toDisplayString as D, renderSlot as Be, mergeModels as zl, computed as F, resolveDynamicComponent as Va, normalizeProps as wi, guardReactiveProps as $i, createSlots as xa, createElementVNode as s, normalizeClass as dt, createElementBlock as f, Fragment as _, renderList as ue, createCommentVNode as I, inject as _a, useId as gt, useSlots as Uo, watch as Ve, Transition as jl, withDirectives as vt, vShow as Vt, ref as z, onBeforeUnmount as wt, onMounted as Sa, onUnmounted as ql, resolveComponent as Eo, withKeys as je, withModifiers as Pe, nextTick as mt, normalizeStyle as Vi, watchEffect as Oo, provide as Ro, reactive as xi } from "vue";
import { e as Rt, u as Po, a as Ci, b as Si, c as Ti, d as Ii } from "./mount-BjEzswH5.js";
import "pinia";
import Di from "primevue/accordion";
import Ai from "primevue/accordioncontent";
import Ui from "primevue/accordionheader";
import Ei from "primevue/accordionpanel";
import pe from "primevue/select";
import { m as Ba, g as ro, s as ge, h as Oi, t as Ge, d as Ri, i as Xt, j as Oe, k as He, n as Gt, r as uo, w as Et, f as rt, l as ia, o as nt, q as No, v as Mo, x as Nt, y as Fo, c as Wl, z as el, e as Ka, A as Ta, B as Pi, C as Ha, D as Tl, E as Ni, F as ta, G as Mi, H as Fi, _ as Il, I as co, J as Li, K as Bi, L as Lo, M as zi, N as ji, u as qi, a as Wi, p as Gi, O as aa, P as Ki, Q as vo, R as Hi, S as vl, T as Ji, U as Yi, V as fo, W as Xi, X as Zi } from "./usePackDiscovery-BegvP3gm.js";
import Q from "primevue/button";
import { Icon as fe } from "@iconify/vue";
import { api as Dl, host as Bo, on as Qi, define as _i } from "@wippy-fe/proxy";
import Pt from "primevue/checkbox";
import en from "primevue/radiobutton";
import Xe from "primevue/tag";
import lt from "primevue/toggleswitch";
import sa from "primevue/textarea";
import Ie from "primevue/inputtext";
import xt from "primevue/inputnumber";
import Gl from "primevue/selectbutton";
import zo from "primevue/message";
const fl = (e, a) => e.x > a.x && e.x < a.x + a.width && e.y > a.y && e.y < a.y + a.height;
function tn(e, a, t) {
  return e.x === a.x ? e.x > t.x && e.x < t.x + t.width && Math.max(e.y, a.y) > t.y && Math.min(e.y, a.y) < t.y + t.height : e.y > t.y && e.y < t.y + t.height && Math.max(e.x, a.x) > t.x && Math.min(e.x, a.x) < t.x + t.width;
}
function jt(e, a, t) {
  const l = [.../* @__PURE__ */ new Set([e.x, a.x, ...t.flatMap((S) => [S.x, S.x + S.width])])].sort((S, V) => S - V), o = [.../* @__PURE__ */ new Set([e.y, a.y, ...t.flatMap((S) => [S.y, S.y + S.height])])].sort((S, V) => S - V);
  l.unshift(l[0] - 24), l.push(l.at(-1) + 24), o.unshift(o[0] - 24), o.push(o.at(-1) + 24);
  const r = l.length, v = o.indexOf(a.y) * r + l.indexOf(a.x), m = o.indexOf(e.y) * r + l.indexOf(e.x), g = (S) => ({ x: l[S % r], y: o[Math.floor(S / r)] }), i = /* @__PURE__ */ new Map(), c = /* @__PURE__ */ new Map(), u = [];
  function C(S) {
    u.push(S);
    let V = u.length - 1;
    for (; V; ) {
      const A = V - 1 >> 1;
      if (u[A].priority <= S.priority) break;
      u[V] = u[A], V = A;
    }
    u[V] = S;
  }
  function h() {
    const S = u[0], V = u.pop();
    if (u.length) {
      let A = 0;
      for (; A * 2 + 1 < u.length; ) {
        let E = A * 2 + 1;
        if (E + 1 < u.length && u[E + 1].priority < u[E].priority && E++, V.priority <= u[E].priority) break;
        u[A] = u[E], A = E;
      }
      u[A] = V;
    }
    return S;
  }
  const b = (S) => Math.abs(S.x - a.x) + Math.abs(S.y - a.y);
  for (const S of [0, 1]) {
    const V = m * 2 + S;
    i.set(V, 0), C({ key: V, cost: 0, priority: b(e) });
  }
  const p = /* @__PURE__ */ new Map(), k = /* @__PURE__ */ new Map();
  for (; u.length; ) {
    const S = h(), V = Math.floor(S.key / 2), A = S.key % 2;
    if (S.cost !== i.get(S.key)) continue;
    if (V === v) {
      const Z = [];
      let se = S.key;
      for (; se !== void 0; )
        Z.push(g(Math.floor(se / 2))), se = c.get(se);
      return jo(Z.reverse());
    }
    const E = g(V), q = V % r, le = Math.floor(V / r);
    for (const [Z, se] of [[q > 0 ? V - 1 : -1, 0], [q + 1 < r ? V + 1 : -1, 0], [le > 0 ? V - r : -1, 1], [le + 1 < o.length ? V + r : -1, 1]]) {
      if (Z < 0) continue;
      const ce = g(Z);
      if (p.has(Z) || p.set(Z, !t.some((R) => fl(ce, R))), !p.get(Z)) continue;
      const ve = `${Math.min(V, Z)}:${Math.max(V, Z)}`;
      if (k.has(ve) || k.set(ve, !t.some((R) => tn(E, ce, R))), !k.get(ve)) continue;
      const me = S.cost + Math.abs(E.x - ce.x) + Math.abs(E.y - ce.y) + (A === se ? 0 : 18), oe = Z * 2 + se;
      me >= (i.get(oe) ?? 1 / 0) || (i.set(oe, me), c.set(oe, S.key), C({ key: oe, cost: me, priority: me + b(ce) }));
    }
  }
  throw new Error("Process map has no collision-free route between its ports: " + JSON.stringify({ start: e, end: a, startInside: t.filter((S) => fl(e, S)), endInside: t.filter((S) => fl(a, S)) }));
}
function jo(e) {
  const a = [];
  for (const t of e) {
    const l = a.at(-1), o = a.at(-2);
    l && l.x === t.x && l.y === t.y || (o && l && (o.x === l.x && l.x === t.x || o.y === l.y && l.y === t.y) && a.pop(), a.push(t));
  }
  return a;
}
const ca = (e) => Array.from(e).reduce((a, t) => a + (/[^\x20-\x7e]/u.test(t) ? 16 : /[MW@%]/.test(t) ? 11 : /[ilI.,:;!| ']/.test(t) ? 4 : 7.5), 0);
function la(e, a = 28) {
  const t = [];
  let l = "";
  for (const o of e.split(/\s+/u))
    for (let r = 0; r < o.length; r += a) {
      const v = o.slice(r, r + a);
      l && l.length + v.length + 1 > a && (t.push(l), l = ""), l = l ? l + " " + v : v;
    }
  return [...t, l].filter(Boolean);
}
function Pa(e) {
  if (e = jo(e), !e.length) return "";
  let a = `M ${e[0].x} ${e[0].y}`;
  for (let l = 1; l < e.length - 1; l++) {
    const o = e[l - 1], r = e[l], v = e[l + 1], m = Math.hypot(r.x - o.x, r.y - o.y), g = Math.hypot(v.x - r.x, v.y - r.y), i = Math.min(8, m / 3, g / 3);
    i && (a += ` L ${r.x + (o.x - r.x) * i / m} ${r.y + (o.y - r.y) * i / m} Q ${r.x} ${r.y} ${r.x + (v.x - r.x) * i / g} ${r.y + (v.y - r.y) * i / g}`);
  }
  const t = e.at(-1);
  return a + ` L ${t.x} ${t.y}`;
}
function an(e, a = {}, t = { width: 1400, height: 480 }) {
  const l = t.direction ?? (t.width < 750 || Ba(e).length > 8 ? "TB" : "LR"), o = t.direction === "LR" && Ba(e).length > 6, r = new ro.graphlib.Graph({ multigraph: !0 });
  r.setGraph({ rankdir: l, ranker: "network-simplex", acyclicer: "greedy", nodesep: 32, edgesep: 32, ranksep: 24, marginx: 32, marginy: 32 }), r.setDefaultEdgeLabel(() => ({}));
  const v = Ba(e), m = new Map(v.map((w, x) => [w.id, x])), g = e.states.map((w) => {
    const x = (e.transitions ?? []).filter((T) => T.from === "any" && T.to === w.id), P = la(ge(w), o ? 13 : 28), O = la(Oi(w, e), o ? 13 : 28), H = x.flatMap((T) => la(Ge(T) + " works from any state")), ne = a.policy?.wip?.[w.id]?.limit, U = ne === void 0 ? 0 : ca(" · limit " + ne), $ = Math.max(o ? 122 : 168, ...P.map((T) => ca(T) + 58), ...O.map((T, X) => ca(T) + 32 + (X === O.length - 1 ? U : 0)), ...H.map((T) => ca(T) + 32)), G = Math.max(80, 42 + P.length * 18 + O.length * 16 + H.length * 18);
    return r.setNode(w.id, { width: $ + (l === "LR" ? 36 : 0), height: G + (l === "TB" ? 36 : 0) }), { state: w, x: 0, y: 0, width: $, height: G, title: P, caption: O, badges: x, row: m.has(w.id) ? 0 : 1 };
  }), i = new Set(g.map((w) => w.state.id)), c = (e.transitions ?? []).flatMap((w) => w.from === "any" ? [] : w.from.filter((x) => i.has(x) && i.has(w.to)).map((x) => {
    const P = `${w.id}-${x}`, O = la(Ge(w), o ? 12 : 28), H = Math.max(o ? 60 : 72, ...O.map((U) => ca(U) + 24)), ne = Math.max(24, O.length * 16 + 10);
    return { transition: w, from: x, key: P, lines: O, width: H, height: ne };
  })), u = /* @__PURE__ */ new Set(), C = /* @__PURE__ */ new Set(), h = new Set(c.filter((w) => w.from === w.transition.to || w.transition.to === e.initial || ["completed", "canceled"].includes(g.find((x) => x.state.id === w.from).state.category)).map((w) => w.key));
  function b(w) {
    if (!C.has(w)) {
      u.add(w);
      for (const x of c.filter((P) => P.from === w))
        h.has(x.key) || (u.has(x.transition.to) ? h.add(x.key) : b(x.transition.to));
      u.delete(w), C.add(w);
    }
  }
  b(e.initial);
  for (const w of g) b(w.state.id);
  for (const w of c) if (!h.has(w.key)) {
    const x = m.get(w.from), P = m.get(w.transition.to);
    r.setEdge(w.from, w.transition.to, { width: w.width, height: w.height, labelpos: "c", weight: x !== void 0 && P === x + 1 ? 100 : 1 }, w.key);
  }
  for (const w of e.transitions ?? []) if (w.from === "any" && i.has(e.initial) && i.has(w.to) && !m.has(w.to)) {
    const x = e.states.find((P) => P.id === w.to);
    r.setEdge(e.initial, w.to, { minlen: ["completed", "canceled"].includes(x.category) ? Math.max(1, v.length - 1) : 1 }, `any:${w.id}`);
  }
  const p = e.states.flatMap((w) => (w.regions ?? []).filter((x) => i.has(x.initial)).map((x, P) => {
    const O = `lane:${w.id}:${P}`;
    return r.setEdge(w.id, x.initial, {}, O), { state: w, region: x, key: O };
  }));
  if (!g.length) return { nodes: g, edges: [], parallels: [], main: v, direction: l, width: 320, height: 160 };
  ro.layout(r);
  for (const w of g) Object.assign(w, { x: r.node(w.state.id).x, y: r.node(w.state.id).y });
  const k = l === "TB", S = c.filter((w) => !h.has(w.key)).map((w) => r.edge({ v: w.from, w: w.transition.to, name: w.key })), V = [...g, ...S], A = Math.max(...V.map((w) => w.x + w.width / 2)), E = Math.max(...V.map((w) => w.y + w.height / 2)), q = (w) => g.find((x) => x.state.id === w), le = c.filter((w) => h.has(w.key)).sort((w, x) => {
    const P = k ? "y" : "x";
    return Math.abs(q(w.from)[P] - q(w.transition.to)[P]) - Math.abs(q(x.from)[P] - q(x.transition.to)[P]);
  }), Z = /* @__PURE__ */ new Map(), se = Math.max(0, ...le.map((w) => w.width));
  let ce = E + 32;
  for (const [w, x] of le.entries()) {
    const P = q(x.from), O = q(x.transition.to), H = k ? A + 16 + se + 28 + w * 18 : ce + x.height / 2, ne = k ? A + 16 + se / 2 : (P.x + O.x) / 2;
    let U = k ? P.y + P.height / 2 + 18 : H;
    if (k) for (const $ of [...Z.values()].sort((G, T) => G.y - T.y))
      U + x.height / 2 + 10 > $.y - $.height / 2 - 10 && U - x.height / 2 - 10 < $.y + $.height / 2 + 10 && (U = $.y + $.height / 2 + 24 + x.height / 2);
    Z.set(x.key, { x: ne, y: U, corridor: H, height: x.height }), ce = H + x.height / 2 + 24;
  }
  const ve = c.map((w) => ({ ...w, ...Z.get(w.key) ?? r.edge({ v: w.from, w: w.transition.to, name: w.key }) })), me = (w, x) => ({ x: w.x - w.width / 2 - x, y: w.y - w.height / 2 - x, width: w.width + x * 2, height: w.height + x * 2 }), oe = [...g.map((w) => me(w, 12)), ...ve.map((w) => me(w, 10))], R = (w, x) => ({
    start: k ? { x: w.x, y: w.y + w.height / 2 } : { x: w.x + w.width / 2, y: w.y },
    end: k ? { x: x.x, y: x.y - x.height / 2 } : { x: x.x - x.width / 2, y: x.y }
  }), te = (w, x) => k ? { x: w.x, y: w.y + x } : { x: w.x + x, y: w.y }, M = ve.map((w) => {
    const x = g.find((Ce) => Ce.state.id === w.from), P = g.find((Ce) => Ce.state.id === w.transition.to), { start: O, end: H } = R(x, P), ne = h.has(w.key), U = te(O, 18), $ = te(H, -18), G = (ne || !k ? w.width : w.height) / 2 + 10, T = ne ? { x: w.x + (k ? -G : G), y: w.y } : te(w, -G), X = ne ? { x: w.x + (k ? G : -G), y: w.y } : te(w, G);
    let de;
    if (ne) {
      const { corridor: Ce } = Z.get(w.key), Ke = k ? { x: Ce, y: w.y } : { x: U.x, y: Ce }, Ze = k ? { x: Ce, y: $.y } : { x: $.x, y: Ce };
      de = k ? [
        [O, ...jt(U, T, oe)],
        [X, Ke, Ze, ...jt(Ze, $, oe), H]
      ] : [
        [O, ...jt(U, Ke, oe), T],
        [X, ...jt(Ze, $, oe), H]
      ];
    } else de = [
      [O, ...jt(U, T, oe)],
      [...jt(X, $, oe), H]
    ];
    const $e = ne ? "return" : m.get(w.transition.to) === (m.get(w.from) ?? -2) + 1 ? "main" : "forward";
    return { ...w, points: de.flat(), segments: de, path: de.map(Pa).join(" "), type: $e, targetOffset: 0 };
  }), ae = p.map((w) => {
    const x = g.find((U) => U.state.id === w.state.id), P = g.find((U) => U.state.id === w.region.initial), { start: O, end: H } = R(x, P), ne = [O, ...jt(te(O, 18), te(H, -18), oe), H];
    return { state: w.state, key: w.key, points: ne, path: Pa(ne) };
  }), ke = [...g.flatMap((w) => [{ x: w.x - w.width / 2, y: w.y - w.height / 2 }, { x: w.x + w.width / 2, y: w.y + w.height / 2 }]), ...M.flatMap((w) => [...w.points, { x: w.x - w.width / 2, y: w.y - w.height / 2 }, { x: w.x + w.width / 2, y: w.y + w.height / 2 }]), ...ae.flatMap((w) => w.points)], Ae = 32 - Math.min(...ke.map((w) => w.x)), Ue = 32 - Math.min(...ke.map((w) => w.y)), K = Math.max(...ke.map((w) => w.x)) + Ae + 32, B = Math.max(...ke.map((w) => w.y)) + Ue + 32, N = (w) => ({ x: w.x + Ae, y: w.y + Ue });
  for (const w of g) Object.assign(w, N(w));
  for (const w of M)
    Object.assign(w, N(w)), w.segments = w.segments.map((x) => x.map(N)), w.points = w.segments.flat(), w.path = w.segments.map(Pa).join(" ");
  for (const w of ae)
    w.points = w.points.map(N), w.path = Pa(w.points);
  return { nodes: g, edges: M, parallels: ae, main: v, direction: l, width: K, height: B };
}
const Me = /* @__PURE__ */ ye({
  __name: "Disclosure",
  props: /* @__PURE__ */ zl({
    label: {}
  }, {
    open: { type: Boolean, default: !1 },
    openModifiers: {}
  }),
  emits: ["update:open"],
  setup(e) {
    const a = Bl(e, "open");
    return (t, l) => (n(), J(d(Di), {
      class: "kx-disclosure",
      value: a.value ? "content" : void 0,
      "onUpdate:value": l[0] || (l[0] = (o) => a.value = o === "content")
    }, {
      default: j(() => [
        y(d(Ei), {
          class: "kx-disclosure-panel",
          value: "content"
        }, {
          default: j(() => [
            y(d(Ui), { class: "kx-disclosure-toggle" }, {
              default: j(() => [
                W(D(e.label), 1)
              ]),
              _: 1
            }),
            y(d(Ai), { pt: {
              transition: { name: "kx-disclosure-motion" },
              contentWrapper: { class: "kx-disclosure-content" }
            } }, {
              default: j(() => [
                Be(t.$slots, "default")
              ]),
              _: 3
            })
          ]),
          _: 3
        })
      ]),
      _: 3
    }, 8, ["value"]));
  }
}), ln = ["aria-label"], on = {
  key: 0,
  class: "kx-settings-rail-group"
}, nn = ["aria-current", "onClick"], sn = { class: "kx-settings-rail-label" }, rn = /* @__PURE__ */ ye({
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
    return (o, r) => (n(), J(Va(e.title ? Ri : "div"), wi($i(e.title ? { title: e.title, count: e.count, settings: !0 } : { class: "kx-settings-rail-standalone" })), xa({
      default: j(() => [
        s("nav", {
          class: dt(["kx-settings-rail", { "kx-settings-rail-framed": e.title }]),
          "aria-label": e.label,
          onKeydown: l
        }, [
          (n(!0), f(_, null, ue(t.value, (v, m) => (n(), f("div", {
            key: v.items[0]?.value ?? m,
            class: dt(["kx-settings-rail-section", { "kx-settings-rail-leading": e.leadingItem && m === 0 }])
          }, [
            v.heading ? (n(), f("div", on, D(v.heading), 1)) : I("", !0),
            (n(!0), f(_, null, ue(v.items, (g) => (n(), f("button", {
              key: g.value,
              type: "button",
              class: "kx-settings-rail-item",
              "aria-current": g.value === e.value ? "true" : void 0,
              onClick: (i) => o.$emit("update:value", g.value)
            }, [
              g.icon ? (n(), J(d(fe), {
                key: 0,
                class: "kx-settings-rail-icon",
                icon: g.icon,
                "aria-hidden": "true"
              }, null, 8, ["icon"])) : I("", !0),
              s("span", sn, D(g.label), 1)
            ], 8, nn))), 128))
          ], 2))), 128))
        ], 42, ln)
      ]),
      _: 2
    }, [
      e.title && o.$slots.actions ? {
        name: "actions",
        fn: j(() => [
          Be(o.$slots, "actions")
        ]),
        key: "0"
      } : void 0
    ]), 1040));
  }
}), qo = Symbol("work-navigation");
function dn() {
  return _a(qo, () => {
  });
}
function un(e) {
  if (e.name === "boards") return "";
  const a = encodeURIComponent(e.board);
  return e.name === "settings" ? `${a}/settings` : a;
}
const Zt = (e) => `/api/v1/work/boards/${encodeURIComponent(e)}`, mo = (e) => ({
  declaration: e.declaration,
  expected_generation: e.expected_generation,
  plugin_configs: e.plugin_configs,
  ...Object.keys(e.resolutions).length ? { resolutions: e.resolutions } : {}
}), Jt = {
  packPlan: (e, a) => Xt(`${Zt(e)}/pack_plan`, a, "Pack plan"),
  packApply: (e, a, t) => Xt(`${Zt(e)}/pack_apply`, { ...a, key: t }, "Apply pack"),
  plan: (e, a) => Xt(`${Zt(e)}/plan_schema`, mo(a), "Schema plan"),
  apply: (e, a, t) => Xt(`${Zt(e)}/apply_schema`, { ...mo(a), key: t }, "Apply schema"),
  resume: (e) => Xt(`${Zt(e)}/resume_migration`, {}, "Resume migration"),
  configure: (e, a, t) => Xt(`${Zt(e)}/configure_plugin`, { plugin: a, ...t === void 0 ? {} : { config: t } }, "Configure plugin")
}, cn = {
  class: "work-settings-card work-stack",
  "aria-label": "Fields with saved values"
}, vn = ["disabled"], fn = { key: 0 }, mn = { class: "work-small" }, pn = ["aria-label"], gn = { class: "work-muted work-small" }, hn = { key: 0 }, bn = {
  key: 0,
  class: "work-row work-field-removal-confirm"
}, yn = {
  key: 1,
  class: "work-muted work-small",
  role: "status"
}, kn = /* @__PURE__ */ ye({
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
    const t = e, l = a, o = gt(), r = [
      { value: "keep", label: "Keep the field" },
      { value: "archive", label: "Archive the values" },
      { value: "drop", label: "Delete the values" }
    ], v = F(() => t.removals.map((u) => {
      const C = t.original.fields?.find((k) => k.code === u.code) ?? t.draft.fields?.find((k) => k.code === u.code), h = u.item_type ? t.original.item_types?.find((k) => k.id === u.item_type) : void 0, b = u.item_type ? h?.title || Oe(u.item_type) : "", p = t.choices[u.path ?? ""] ?? "keep";
      return { change: u, path: u.path ?? "", field: C ? He(C) : Oe(u.code), typeTitle: b, choice: p };
    })), m = F(() => v.value.filter((u) => u.choice === "drop")), g = F(() => v.value.some((u) => u.choice === "keep")), i = (u) => u === void 0 ? "Items" : u === 1 ? "1 item" : u.toLocaleString() + " items";
    function c(u, C) {
      return u === "archive" ? C ? `${C} items stop showing the field. Saved values stay stored and return if the field is added back.` : "The field is removed. Saved values stay stored and return if the field is added back." : u === "drop" ? "Saved values are deleted. Audit history follows the board’s retention settings." : "Nothing changes for this field. To apply the rest of the draft, choose Archive or Delete.";
    }
    return (u, C) => (n(), f("section", cn, [
      C[4] || (C[4] = s("h3", { class: "work-row-title" }, "Fields with saved values", -1)),
      C[5] || (C[5] = s("p", { class: "work-muted work-small" }, "This draft removes fields that items still use. Choose what happens to their values.", -1)),
      (n(!0), f(_, null, ue(v.value, (h, b) => (n(), f("fieldset", {
        key: h.path,
        class: "work-field-removal work-stack work-tight",
        disabled: e.disabled
      }, [
        s("legend", null, [
          s("strong", null, D(h.field), 1),
          h.typeTitle ? (n(), f("span", fn, " · " + D(h.typeTitle), 1)) : I("", !0)
        ]),
        s("p", mn, D(i(h.change.count)) + " on this board " + D(h.change.count === 1 ? "holds a value" : "hold values") + " in this field" + D(h.typeTitle ? "; " + h.typeTitle + " items lose it." : "."), 1),
        s("div", {
          class: "work-row work-wrap",
          role: "radiogroup",
          "aria-label": "What happens to " + h.field + " values"
        }, [
          (n(), f(_, null, ue(r, (p) => s("label", {
            key: p.value,
            class: "work-row work-field-removal-choice"
          }, [
            y(d(en), {
              "input-id": d(o) + "-" + b + "-" + p.value,
              name: d(o) + "-" + b,
              value: p.value,
              "model-value": h.choice,
              "onUpdate:modelValue": (k) => l("choose", h.path, k)
            }, null, 8, ["input-id", "name", "value", "model-value", "onUpdate:modelValue"]),
            s("span", null, D(p.label), 1)
          ])), 64))
        ], 8, pn),
        s("p", gn, D(c(h.choice, h.typeTitle)), 1),
        y(Me, {
          class: "work-small",
          label: "Technical details"
        }, {
          default: j(() => [
            s("p", null, [
              C[2] || (C[2] = W("Field ", -1)),
              s("code", null, D(h.change.code), 1),
              h.change.item_type ? (n(), f("span", hn, [
                C[1] || (C[1] = W(" · item type ", -1)),
                s("code", null, D(h.change.item_type), 1)
              ])) : I("", !0)
            ]),
            s("p", null, [
              C[3] || (C[3] = W("Resolution path ", -1)),
              s("code", null, D(h.path), 1)
            ])
          ]),
          _: 2
        }, 1024)
      ], 8, vn))), 128)),
      m.value.length ? (n(), f("label", bn, [
        y(d(Pt), {
          binary: "",
          "model-value": e.dropConfirmed,
          disabled: e.disabled,
          "onUpdate:modelValue": C[0] || (C[0] = (h) => l("update:dropConfirmed", h))
        }, null, 8, ["model-value", "disabled"]),
        s("span", null, "Delete the saved values in " + D(m.value.map((h) => h.field).join(", ")) + ". This cannot be undone.", 1)
      ])) : I("", !0),
      g.value ? (n(), f("p", yn, "Fields set to Keep block this draft. Discard the draft to keep everything as it is.")) : I("", !0)
    ]));
  }
}), Kl = /* @__PURE__ */ ye({
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
        const g = m.closest('[data-work-action], button, a, input, textarea, [role="combobox"], [role="checkbox"], [role="switch"], details');
        if (g && g !== v.currentTarget) return;
      }
      l("activate", v);
    }
    function r(v) {
      v.target !== v.currentTarget || !["Enter", " "].includes(v.key) || (v.preventDefault(), t.disabled || l("activate", v));
    }
    return (v, m) => (n(), J(Va(e.as), {
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
      default: j(() => [
        Be(v.$slots, "default")
      ]),
      _: 3
    }, 40, ["type", "role", "tabindex", "disabled", "aria-disabled"]));
  }
}), tl = Symbol("section row"), wn = { class: "work-definition" }, $n = {
  key: 0,
  class: "work-definition-handle"
}, Vn = { class: "work-definition-lead" }, xn = ["title"], Cn = {
  key: 0,
  class: "work-definition-description"
}, Sn = { class: "work-definition-details" }, Tn = { class: "work-definition-code" }, In = ["title"], Dn = { class: "work-definition-kind" }, An = {
  key: 0,
  class: "work-definition-kind-label"
}, Un = { class: "work-definition-kind-value" }, En = { class: "work-definition-flags" }, On = { class: "work-definition-usage" }, Rn = { class: "work-definition-actions" }, Pn = ["inert"], Hl = /* @__PURE__ */ ye({
  __name: "DefinitionRow",
  props: /* @__PURE__ */ zl({
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
    const a = e, t = Bl(e, "open");
    a.initialOpen && (t.value = !0);
    const l = Uo(), o = _a(tl, void 0);
    function r(m) {
      return !!a.routeSection && !!a.routeId && m === a.routeSection + "/" + a.routeId;
    }
    Ve(() => o?.selected.value, (m, g) => {
      r(m) ? t.value = !0 : r(g) && (t.value = !1);
    }, { immediate: !0 });
    function v() {
      t.value = !t.value, a.routeSection && a.routeId && o?.choose(a.routeSection, a.routeId, t.value);
    }
    return (m, g) => (n(), f("article", wn, [
      s("header", {
        class: dt(["work-definition-head", { "work-definition-has-handle": d(l).handle }])
      }, [
        d(l).handle ? (n(), f("div", $n, [
          Be(m.$slots, "handle")
        ])) : I("", !0),
        s("div", Vn, [
          y(Kl, {
            class: "work-definition-toggle",
            "aria-expanded": t.value,
            onActivate: v
          }, {
            default: j(() => [
              y(d(fe), {
                icon: "tabler:chevron-right",
                "aria-hidden": "true"
              }),
              s("span", {
                class: "work-row-title",
                title: e.title
              }, D(e.title), 9, xn)
            ]),
            _: 1
          }, 8, ["aria-expanded"]),
          e.description ? (n(), f("p", Cn, D(e.description), 1)) : I("", !0)
        ]),
        s("div", Sn, [
          s("span", Tn, [
            e.code ? (n(), f("code", {
              key: 0,
              class: "work-mono",
              title: e.code
            }, D(e.code), 9, In)) : I("", !0)
          ]),
          s("span", Dn, [
            e.kind ? (n(), J(d(Xe), {
              key: 0,
              severity: "secondary"
            }, {
              default: j(() => [
                e.kindLabel ? (n(), f("span", An, D(e.kindLabel) + ":", 1)) : I("", !0),
                s("span", Un, D(e.kind), 1)
              ]),
              _: 1
            })) : I("", !0),
            Be(m.$slots, "status")
          ]),
          s("span", En, [
            Be(m.$slots, "flags")
          ]),
          s("div", On, [
            Be(m.$slots, "usage")
          ])
        ]),
        s("div", Rn, [
          Be(m.$slots, "actions")
        ])
      ], 2),
      y(jl, {
        name: "work-panel",
        persisted: ""
      }, {
        default: j(() => [
          vt(s("div", {
            inert: !t.value,
            class: "work-definition-body work-stack"
          }, [
            Be(m.$slots, "default")
          ], 8, Pn), [
            [Vt, t.value]
          ])
        ]),
        _: 3
      })
    ]));
  }
}), Nn = { class: "work-definition-scroll" }, Mn = {
  key: 0,
  class: "work-definition-columns",
  "aria-hidden": "true"
}, Fn = { key: 0 }, Ln = { class: "work-definition-usage" }, Jl = /* @__PURE__ */ ye({
  __name: "DefinitionList",
  props: {
    count: {},
    columns: {}
  },
  setup(e) {
    return (a, t) => (n(), f("div", Nn, [
      s("div", {
        class: dt(["work-field-builder", "work-definitions-" + e.columns])
      }, [
        e.count > 3 && e.columns !== "plugins" ? (n(), f("div", Mn, [
          t[0] || (t[0] = s("span", null, null, -1)),
          t[1] || (t[1] = s("span", null, "Name", -1)),
          t[2] || (t[2] = s("span", { class: "work-definition-code" }, "Identifier", -1)),
          s("span", null, D(e.columns === "types" ? "Workflow" : "Kind"), 1),
          e.columns === "fields" ? (n(), f("span", Fn, "Details")) : I("", !0),
          s("span", Ln, D(e.columns === "fields" ? "Used by" : "Details"), 1),
          t[3] || (t[3] = s("span", null, null, -1))
        ])) : I("", !0),
        Be(a.$slots, "default")
      ], 2)
    ]));
  }
}), Bn = { class: "work-stack work-tight" }, zn = {
  key: 0,
  class: "work-small work-muted"
}, jn = {
  key: 1,
  role: "alert",
  class: "work-error"
}, qn = { class: "work-json-example" }, Mt = /* @__PURE__ */ ye({
  __name: "JsonInput",
  props: {
    label: {},
    modelValue: {},
    shape: {},
    hint: {},
    example: {},
    commit: { type: Function }
  },
  emits: ["update:modelValue", "validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = z(""), r = z("");
    Ve(() => t.modelValue, (m) => {
      o.value = m === void 0 ? "" : JSON.stringify(m, null, 2), r.value = "", l("validity", !0);
    }, { immediate: !0 }), wt(() => l("validity", !0));
    function v(m) {
      o.value = m;
      try {
        const g = m.trim() ? JSON.parse(m) : void 0;
        if (g !== void 0 && t.shape === "object" && (!g || typeof g != "object" || Array.isArray(g))) throw new Error("Enter a JSON object.");
        if (g !== void 0 && t.shape === "array" && !Array.isArray(g)) throw new Error("Enter a JSON array.");
        if (t.commit) {
          const i = t.commit(g);
          if (i) throw new Error(i);
        } else l("update:modelValue", g);
        r.value = "", l("validity", !0);
      } catch (g) {
        r.value = g instanceof Error ? g.message : "Invalid JSON.", l("validity", !1);
      }
    }
    return (m, g) => (n(), J(Me, {
      class: "work-json-disclosure",
      label: `Edit as JSON · ${e.label}`
    }, {
      default: j(() => [
        s("label", Bn, [
          s("span", null, D(e.label), 1),
          e.hint ? (n(), f("span", zn, D(e.hint), 1)) : I("", !0),
          y(d(sa), {
            class: "work-json-input",
            rows: "3",
            "aria-label": e.label,
            value: o.value,
            "aria-invalid": !!r.value,
            onInput: g[0] || (g[0] = (i) => v(i.target.value))
          }, null, 8, ["aria-label", "value", "aria-invalid"]),
          r.value ? (n(), f("span", jn, D(r.value), 1)) : I("", !0)
        ]),
        g[1] || (g[1] = s("p", { class: "work-small work-muted" }, "Example", -1)),
        s("pre", qn, D(JSON.stringify(e.example ?? (e.shape === "array" ? [] : {}), null, 2)), 1)
      ]),
      _: 1
    }, 8, ["label"]));
  }
}), Wn = [
  { code: "key", form: "text", index: "key" },
  { code: "type", form: "text", index: "key" },
  { code: "state", form: "text", index: "key" },
  { code: "category", form: "text", index: "key" },
  { code: "rank", form: "text", index: "key" },
  { code: "parent", form: "text", index: "key" },
  { code: "created_at", form: "time", index: "key" },
  { code: "updated_at", form: "time", index: "key" }
];
function Gn(e) {
  const a = e.compiled.processes?.flatMap((t) => t.states.map((l) => ({ id: l.id, label: l.name }))) ?? [];
  return [...Wn.filter((t) => t.code !== "rank").map((t) => t.code === "state" ? { ...t, type: "option", options: a } : t.code === "category" ? { ...t, type: "option", options: ["triage", "backlog", "unstarted", "started", "completed", "canceled"].map((l) => ({ id: l })) } : t), ...(e.compiled.fields ?? []).filter((t) => t.index && t.index !== "none")];
}
function Kn(e) {
  if (e?.cardinality && e.cardinality !== "one") return ["has", "in", "nin", "is_null", ...e.type === "principal" ? ["member_of"] : []];
  const a = ["eq", "neq", "in", "nin", "is_null", ...e?.type === "principal" ? ["member_of"] : []];
  return e && (["int", "number", "dec", "time", "quantity"].includes(e.form ?? "") || e.index === "number") && a.push("lt", "lte", "gt", "gte", "between"), e?.form === "text" && e.type !== "option" && a.push("contains", "starts_with"), a;
}
const Hn = { class: "work-field-control" }, Jn = ["id"], Yn = {
  key: 1,
  class: "work-stack work-tight"
}, Xn = { class: "work-chips" }, Zn = {
  key: 5,
  class: "work-row"
}, Qn = ["inert"], _n = ["value"], es = {
  key: 1,
  class: "work-muted"
}, ts = ["inert"], as = ["value"], ls = {
  key: 1,
  class: "work-muted"
}, os = {
  key: 11,
  class: "work-stack work-tight"
}, is = {
  class: "work-stack work-tight",
  "aria-label": "Matching items"
}, ns = { class: "work-mono" }, ss = {
  key: 15,
  class: "work-error work-small",
  role: "alert"
}, Wo = /* @__PURE__ */ ye({
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
    const t = e, l = a, o = F(() => t.inputId ?? `field-${t.field.code}`), r = F(() => !!t.field.cardinality && t.field.cardinality !== "one"), v = F(() => Array.isArray(t.modelValue) ? t.modelValue : []), m = F(() => t.modelValue == null ? "" : typeof t.modelValue == "object" ? Gt(t.modelValue) : String(t.modelValue)), g = F(() => {
      const w = t.modelValue;
      return w && typeof w == "object" && "ref" in w && Array.isArray(w.ref) ? String(w.ref[1] ?? "") : "";
    }), i = F(() => t.disabled || uo(t.field)), c = z(!1), u = z(!1), C = z(!1), h = z(""), b = z(""), p = z([]), k = ia(), S = z([]);
    let V = 0, A;
    const E = /* @__PURE__ */ new Set();
    Ve(v, (w) => {
      S.value = A ?? w.map((x, P) => S.value[P] ?? V++), A = void 0;
    }, { immediate: !0 });
    function q(w) {
      l("update:modelValue", w);
    }
    function le(w, x) {
      const P = [...v.value];
      P[w] = x, q(P);
    }
    function Z(w, x) {
      x ? E.delete(w) : E.add(w), l("validity", !E.size);
    }
    function se(w) {
      E.delete(S.value[w]), l("validity", !E.size), A = S.value.filter((x, P) => P !== w), q(v.value.filter((x, P) => P !== w));
    }
    function ce() {
      A = [...S.value, V++], q([...v.value, t.field.form === "bool" ? !1 : t.field.form === "record" ? {} : ""]);
    }
    function ve(w) {
      const x = w.detail, P = x?.principal_id ?? x?.id;
      q(P ? { kind: x.type ?? "user", id: P } : void 0);
    }
    function me(w) {
      const x = w.detail;
      q(x?.thread_id ? { ref: ["component", x.thread_id] } : void 0);
    }
    const oe = z("");
    let R = "";
    Ve(() => t.modelValue, (w) => {
      const x = JSON.stringify(w ?? {}, null, 2);
      x !== R && (R = x, oe.value = x, h.value = "", l("validity", !0));
    }, { immediate: !0 });
    function te(w) {
      oe.value = w;
      try {
        const x = JSON.parse(w);
        if (!x || typeof x != "object" || Array.isArray(x)) throw new Error("Enter a JSON object.");
        if (t.field.type === "rich_text" && !("type" in x && typeof x.type == "string")) throw new Error("The document needs a type.");
        R = JSON.stringify(x, null, 2), h.value = "", l("validity", !0), q(x);
      } catch (x) {
        h.value = x instanceof Error ? x.message : "Invalid JSON.", l("validity", !1);
      }
    }
    function M(w) {
      if (!w) {
        l("validity", !0), q(void 0);
        return;
      }
      const x = Number.isFinite(Number(w)) && (t.field.form !== "int" || Number.isSafeInteger(Number(w)));
      l("validity", x), x && q(t.field.form === "int" ? Number(w) : w);
    }
    const ae = F(() => t.field.config?.format === "date");
    function ke(w) {
      q(w ? ae.value ? w : new Date(w).toISOString() : void 0);
    }
    const Ae = F(() => {
      if (typeof t.modelValue != "string") return "";
      if (ae.value) return t.modelValue.slice(0, 10);
      const w = new Date(t.modelValue);
      return Number.isNaN(w.getTime()) ? "" : new Date(w.getTime() - w.getTimezoneOffset() * 6e4).toISOString().slice(0, 16);
    });
    function Ue(w) {
      q(w.detail?.ref);
    }
    function K(w) {
      q(w.detail?.value);
    }
    let B;
    Ve(b, () => {
      const w = k();
      if (clearTimeout(B), !b.value.trim()) {
        p.value = [];
        return;
      }
      B = setTimeout(async () => {
        try {
          const x = b.value.trim(), P = /^[A-Z][A-Z0-9]{1,9}-[0-9]+$/.test(x) ? [(await Et.item(t.boardId, { key: x })).item] : (await Et.query(t.boardId, { where: { field: "title", op: "contains", value: x }, limit: 8 })).items;
          w() && (p.value = P, h.value = "");
        } catch (x) {
          w() && (h.value = rt(x, "Could not search items."));
        }
      }, 200);
    });
    function N(w) {
      q({ board: t.boardId, item: w.id }), b.value = "", p.value = [];
    }
    Sa(async () => {
      t.field.type === "principal" ? c.value = await Rt("wc-principal-picker") : t.field.config?.target === "component" && (c.value = await Rt("wc-component-picker"));
    });
    for (const [w, x] of [[() => t.editorTag, C], [() => t.linkTag, u]])
      Ve(w, async (P, O, H) => {
        let ne = !0;
        if (H(() => {
          ne = !1;
        }), x.value = !1, P) {
          const U = await Rt(P);
          ne && (x.value = U);
        }
      }, { immediate: !0 });
    return ql(() => {
      clearTimeout(B), k();
    }), (w, x) => {
      const P = Eo("FieldControl", !0);
      return n(), f("div", Hn, [
        d(uo)(e.field) ? (n(), f("output", {
          key: 0,
          id: o.value,
          class: "work-read-value"
        }, D(d(Gt)(e.modelValue, e.field)), 9, Jn)) : r.value ? (n(), f("div", Yn, [
          s("div", Xn, [
            (n(!0), f(_, null, ue(v.value, (O, H) => (n(), J(d(Xe), {
              key: S.value[H],
              class: "kx-tag-sm",
              severity: "secondary"
            }, {
              default: j(() => [
                W(D(d(Gt)(O, e.field)) + " ", 1),
                y(d(Q), {
                  type: "button",
                  class: "work-icon-button",
                  disabled: i.value,
                  "aria-label": "Remove value " + (H + 1),
                  onClick: (ne) => se(H),
                  severity: "secondary",
                  text: "",
                  size: "small"
                }, {
                  default: j(() => [
                    y(d(fe), {
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
          (n(!0), f(_, null, ue(v.value, (O, H) => (n(), f("div", {
            key: S.value[H],
            class: "work-stack work-tight"
          }, [
            y(P, {
              "board-id": e.boardId,
              field: { ...e.field, cardinality: "one" },
              "model-value": O,
              "input-id": o.value + "-" + S.value[H],
              disabled: i.value,
              "editor-tag": e.editorTag,
              "link-tag": e.linkTag,
              "onUpdate:modelValue": (ne) => le(H, ne),
              onValidity: (ne) => Z(S.value[H], ne)
            }, null, 8, ["board-id", "field", "model-value", "input-id", "disabled", "editor-tag", "link-tag", "onUpdate:modelValue", "onValidity"])
          ]))), 128)),
          y(d(Q), {
            label: "Add value",
            severity: "secondary",
            size: "small",
            disabled: i.value,
            onClick: ce,
            outlined: ""
          }, {
            icon: j(() => [
              y(d(fe), {
                icon: "tabler:plus",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled"])
        ])) : e.editorTag && C.value ? (n(), J(Va(e.editorTag), {
          key: 2,
          "board-id": e.boardId,
          value: JSON.stringify(e.modelValue ?? null),
          config: JSON.stringify(e.field.config ?? {}),
          readonly: i.value || void 0,
          onChange: K
        }, null, 40, ["board-id", "value", "config", "readonly"])) : e.linkTag && u.value ? (n(), J(Va(e.linkTag), {
          key: 3,
          "board-id": e.boardId,
          kind: e.field.config?.target ?? e.field.type,
          value: JSON.stringify(e.modelValue ?? null),
          readonly: i.value || void 0,
          onChange: Ue
        }, null, 40, ["board-id", "kind", "value", "readonly"])) : e.field.type === "option" ? (n(), J(d(pe), {
          key: 4,
          placeholder: "Not set",
          inputId: o.value,
          "model-value": e.modelValue ?? "",
          disabled: i.value,
          "onUpdate:modelValue": x[0] || (x[0] = (O) => q(O || void 0)),
          appendTo: "self",
          optionLabel: "label",
          optionValue: "value",
          optionDisabled: "disabled",
          options: [{ label: "Not set", value: "", disabled: !1 }, ...(e.field.options ?? []).map((O) => ({ label: O.label ?? O.id, value: O.id, disabled: !1 }))]
        }, null, 8, ["inputId", "model-value", "disabled", "options"])) : e.field.form === "bool" ? (n(), f("label", Zn, [
          y(d(Pt), {
            inputId: o.value,
            "model-value": e.modelValue === !0,
            disabled: i.value,
            "onUpdate:modelValue": x[1] || (x[1] = (O) => q(O)),
            binary: ""
          }, null, 8, ["inputId", "model-value", "disabled"]),
          W(D(e.modelValue === !0 ? "Yes" : e.modelValue === !1 ? "No" : "Not set"), 1)
        ])) : e.field.form === "int" ? (n(), J(d(xt), {
          key: 6,
          inputId: o.value,
          "model-value": m.value === "" ? null : Number(m.value),
          disabled: i.value,
          "onUpdate:modelValue": x[2] || (x[2] = (O) => M(O == null ? "" : String(O))),
          useGrouping: !1
        }, null, 8, ["inputId", "model-value", "disabled"])) : e.field.form === "dec" ? (n(), J(d(Ie), {
          key: 7,
          id: o.value,
          inputmode: "decimal",
          "model-value": m.value,
          disabled: i.value,
          "onUpdate:modelValue": x[3] || (x[3] = (O) => M(O ?? ""))
        }, null, 8, ["id", "model-value", "disabled"])) : e.field.form === "time" ? (n(), J(d(Ie), {
          key: 8,
          id: o.value,
          type: ae.value ? "date" : "datetime-local",
          value: Ae.value,
          disabled: i.value,
          onInput: x[4] || (x[4] = (O) => ke(O.target.value))
        }, null, 8, ["id", "type", "value", "disabled"])) : e.field.type === "principal" ? (n(), f("div", {
          key: 9,
          inert: i.value || void 0,
          class: "work-stack work-tight"
        }, [
          c.value ? (n(), f("wc-principal-picker", {
            key: 0,
            value: JSON.stringify(e.modelValue ?? {}),
            kinds: "user,group",
            onConfigChanged: ve
          }, null, 40, _n)) : (n(), f("span", es, D(d(Gt)(e.modelValue, e.field)) + " · Person picker is unavailable.", 1))
        ], 8, Qn)) : e.field.config?.target === "component" ? (n(), f("div", {
          key: 10,
          inert: i.value || void 0
        }, [
          c.value ? (n(), f("wc-component-picker", {
            key: 0,
            value: JSON.stringify({ thread_id: g.value }),
            onChange: me
          }, null, 40, as)) : (n(), f("span", ls, "Component picker is unavailable."))
        ], 8, ts)) : e.field.type === "item" ? (n(), f("div", os, [
          y(d(Xe), {
            class: "kx-tag-sm",
            severity: "secondary"
          }, {
            default: j(() => [
              W(D(d(Gt)(e.modelValue, e.field)), 1)
            ]),
            _: 1
          }),
          y(d(Ie), {
            id: o.value,
            modelValue: b.value,
            "onUpdate:modelValue": x[5] || (x[5] = (O) => b.value = O),
            disabled: i.value,
            placeholder: "Search a title or enter an item key",
            "aria-label": "Search items"
          }, null, 8, ["id", "modelValue", "disabled"]),
          s("div", is, [
            (n(!0), f(_, null, ue(p.value, (O) => (n(), J(Kl, {
              key: O.id,
              class: "work-match-item",
              disabled: i.value,
              onActivate: (H) => N(O)
            }, {
              default: j(() => [
                s("code", ns, D(O.key), 1),
                s("span", null, D(d(Gt)(O.values.title)), 1)
              ]),
              _: 2
            }, 1032, ["disabled", "onActivate"]))), 128))
          ]),
          e.modelValue ? (n(), J(d(Q), {
            key: 0,
            label: "Clear reference",
            severity: "secondary",
            size: "small",
            disabled: i.value,
            onClick: x[6] || (x[6] = (O) => q(void 0)),
            outlined: ""
          }, {
            icon: j(() => [
              y(d(fe), {
                icon: "tabler:list-check",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled"])) : I("", !0)
        ])) : e.field.form === "record" || e.field.type === "rich_text" || e.field.form === "quantity" || e.field.form === "ref" ? (n(), J(d(sa), {
          key: 12,
          id: o.value,
          "model-value": oe.value,
          rows: "3",
          disabled: i.value,
          "aria-invalid": !!h.value,
          "onUpdate:modelValue": x[7] || (x[7] = (O) => te(O ?? ""))
        }, null, 8, ["id", "model-value", "disabled", "aria-invalid"])) : e.field.code === "description" ? (n(), J(d(sa), {
          key: 13,
          id: o.value,
          "model-value": m.value,
          rows: "4",
          disabled: i.value,
          "onUpdate:modelValue": x[8] || (x[8] = (O) => q(O))
        }, null, 8, ["id", "model-value", "disabled"])) : (n(), J(d(Ie), {
          key: 14,
          id: o.value,
          "model-value": m.value,
          disabled: i.value,
          "onUpdate:modelValue": x[9] || (x[9] = (O) => q(O))
        }, null, 8, ["id", "model-value", "disabled"])),
        h.value ? (n(), f("span", ss, D(h.value), 1)) : I("", !0)
      ]);
    };
  }
}), rs = { class: "work-stack work-tight work-operand-control" }, ds = { class: "work-row work-small" }, us = {
  key: 1,
  class: "work-muted work-small"
}, cs = {
  key: 2,
  class: "work-stack work-tight"
}, vs = { class: "work-small" }, fs = {
  key: 0,
  class: "work-error work-small",
  role: "alert"
}, va = /* @__PURE__ */ ye({
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
    const t = e, l = a, o = F(() => "$actor" in nt(t.modelValue) ? "actor" : "$now" in nt(t.modelValue) ? "now" : "literal"), r = z(""), v = z("");
    Ve(() => t.modelValue, (i) => {
      r.value = JSON.stringify(i ?? []), v.value = "";
    }, { immediate: !0 });
    function m(i) {
      l("update:modelValue", i === "actor" ? { $actor: "id" } : i === "now" ? { $now: "P0D" } : void 0), l("validity", !0);
    }
    function g(i) {
      r.value = i;
      try {
        const c = JSON.parse(i);
        if (!Array.isArray(c)) throw new Error("Enter a JSON list.");
        v.value = "", l("validity", !0), l("update:modelValue", c);
      } catch (c) {
        v.value = c instanceof Error ? c.message : "Invalid values.", l("validity", !1);
      }
    }
    return (i, c) => (n(), f("div", rs, [
      s("label", ds, [
        W(D(e.label), 1),
        y(d(pe), {
          "aria-label": e.label + " operand",
          "model-value": o.value,
          disabled: e.disabled,
          "onUpdate:modelValue": c[0] || (c[0] = (u) => m(u)),
          appendTo: "self",
          optionLabel: "label",
          optionValue: "value",
          optionDisabled: "disabled",
          options: [{ label: "Value", value: "literal", disabled: !1 }, { label: "Current actor ($actor)", value: "actor", disabled: !1 }, { label: "Current time ($now)", value: "now", disabled: !1 }]
        }, null, 8, ["aria-label", "model-value", "disabled"])
      ]),
      o.value === "now" ? (n(), J(d(Ie), {
        key: 0,
        "aria-label": e.label + " time offset",
        value: d(nt)(e.modelValue).$now,
        disabled: e.disabled,
        placeholder: "-P7D",
        onInput: c[1] || (c[1] = (u) => l("update:modelValue", { $now: u.target.value }))
      }, null, 8, ["aria-label", "value", "disabled"])) : o.value === "actor" ? (n(), f("span", us, "The signed-in actor’s id")) : e.multiple ? (n(), f("div", cs, [
        s("label", vs, [
          c[5] || (c[5] = W("Values as JSON (operands may appear in the list)", -1)),
          y(d(sa), {
            class: "work-mono",
            "aria-label": e.label + " values",
            value: r.value,
            disabled: e.disabled,
            rows: "2",
            onInput: c[2] || (c[2] = (u) => g(u.target.value))
          }, null, 8, ["aria-label", "value", "disabled"])
        ]),
        v.value ? (n(), f("p", fs, D(v.value), 1)) : I("", !0)
      ])) : (n(), J(Wo, {
        key: 3,
        "board-id": e.boardId,
        field: { ...e.field, cardinality: "one" },
        "model-value": e.modelValue,
        disabled: e.disabled,
        "input-id": e.label.replace(/[^a-z0-9]/gi, "-"),
        "onUpdate:modelValue": c[3] || (c[3] = (u) => l("update:modelValue", u)),
        onValidity: c[4] || (c[4] = (u) => l("validity", u))
      }, null, 8, ["board-id", "field", "model-value", "disabled", "input-id"]))
    ]));
  }
}), ms = ["disabled"], ps = { class: "work-small work-mono" }, gs = { class: "work-row work-small" }, hs = { class: "work-row work-wrap" }, bs = { key: 3 }, ys = { class: "work-row work-wrap" }, ks = { class: "work-row" }, ws = { class: "work-row" }, $s = { class: "work-row" }, Vs = {
  key: 3,
  class: "work-row work-wrap"
}, xs = { class: "work-row work-wrap" }, Cs = /* @__PURE__ */ ye({
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
    const t = e, l = a, o = F(() => t.path ?? "where"), r = F(() => t.depth ?? 1), v = F(() => ["and", "or", "not", "history", "match", "rel", "children"].find((oe) => oe in t.modelValue) ?? "field"), m = F(() => Gn(t.schema)), g = F(() => m.value.find((oe) => oe.code === t.modelValue.field) ?? { code: "value", form: "text" }), i = F(() => nt(t.modelValue.history)), c = F(() => m.value.find((oe) => oe.code === i.value.field) ?? { code: "history", form: "text" }), u = F(() => Array.isArray(t.modelValue[v.value]) ? t.modelValue[v.value] : []), C = {
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
    }, h = {
      field: "Field value",
      and: "All conditions",
      or: "Any condition",
      not: "Condition is false",
      history: "Value history",
      rel: "Linked items",
      children: "Child items",
      match: "Search text"
    }, b = () => ({ field: "category", op: "eq", value: "unstarted" }), p = z(/* @__PURE__ */ new Set());
    function k(oe, R) {
      R ? p.value.delete(oe) : p.value.add(oe), l("validity", p.value.size === 0);
    }
    Ve(v, () => {
      p.value.clear(), l("validity", !0);
    });
    function S(oe) {
      const R = /* @__PURE__ */ new Set();
      for (const te of p.value) {
        const M = Number(te);
        !Number.isNaN(M) && M !== oe && R.add(String(M > oe ? M - 1 : M));
      }
      p.value = R, l("validity", R.size === 0), A({ [v.value]: u.value.filter((te, M) => M !== oe) });
    }
    function V(oe) {
      l("update:modelValue", oe);
    }
    function A(oe) {
      V({ ...t.modelValue, ...oe });
    }
    function E(oe) {
      V(oe === "field" ? b() : oe === "and" || oe === "or" ? { [oe]: [b()] } : oe === "not" ? { not: b() } : oe === "history" ? { history: { field: "state", changed: !0 } } : oe === "match" ? { match: "" } : oe === "children" ? { children: !0, q: "some", where: b() } : { rel: t.schema.compiled.relation_types?.[0]?.id ?? "", dir: "outward", q: "some", where: b() });
    }
    function q(oe, R) {
      A({ [v.value]: u.value.map((te, M) => M === oe ? R : te) });
    }
    function le(oe, R) {
      const te = { ...i.value };
      R === void 0 ? (delete te[oe], k(oe, !0)) : te[oe] = R, A({ history: te });
    }
    function Z(oe) {
      p.value.clear(), l("validity", !0);
      const R = { ...i.value };
      delete R.was, delete R.changed, delete R.from, delete R.to, R[oe] = oe === "changed" ? !0 : "", A({ history: R });
    }
    const se = { code: "actor", form: "text" }, ce = { code: "at", form: "time" }, ve = F(() => Array.isArray(i.value.during) ? i.value.during : []);
    function me(oe, R) {
      const te = [...ve.value];
      te[oe] = R, le("during", te);
    }
    return (oe, R) => {
      const te = Eo("FilterNode", !0);
      return n(), f("fieldset", {
        class: "work-filter-node",
        disabled: e.disabled
      }, [
        s("legend", ps, D(o.value), 1),
        s("label", gs, [
          R[21] || (R[21] = W("Condition", -1)),
          y(d(pe), {
            "aria-label": o.value + " condition",
            "model-value": v.value,
            "onUpdate:modelValue": R[0] || (R[0] = (M) => E(M)),
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            optionDisabled: "disabled",
            options: Object.entries(h).map(([M, ae]) => ({ label: ae, value: M, disabled: r.value >= 6 && ["and", "or", "not", "rel", "children"].includes(M) }))
          }, null, 8, ["aria-label", "model-value", "options"])
        ]),
        v.value === "and" || v.value === "or" ? (n(), f(_, { key: 0 }, [
          (n(!0), f(_, null, ue(u.value, (M, ae) => (n(), f("div", {
            key: ae,
            class: "work-stack work-tight"
          }, [
            y(te, {
              "board-id": e.boardId,
              schema: e.schema,
              "model-value": M,
              path: o.value + "." + v.value + "[" + ae + "]",
              depth: r.value + 1,
              "onUpdate:modelValue": (ke) => q(ae, ke),
              onValidity: (ke) => k(String(ae), ke)
            }, null, 8, ["board-id", "schema", "model-value", "path", "depth", "onUpdate:modelValue", "onValidity"]),
            y(d(Q), {
              label: "Remove condition",
              size: "small",
              severity: "secondary",
              onClick: (ke) => S(ae),
              outlined: ""
            }, {
              icon: j(() => [
                y(d(fe), {
                  icon: "tabler:trash",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["onClick"])
          ]))), 128)),
          y(d(Q), {
            label: "Add condition",
            size: "small",
            severity: "secondary",
            disabled: r.value >= 6,
            onClick: R[1] || (R[1] = (M) => A({ [v.value]: [...u.value, b()] })),
            outlined: ""
          }, {
            icon: j(() => [
              y(d(fe), {
                icon: "tabler:plus",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled"])
        ], 64)) : v.value === "not" ? (n(), J(te, {
          key: 1,
          "board-id": e.boardId,
          schema: e.schema,
          "model-value": d(nt)(e.modelValue.not),
          path: o.value + ".not",
          depth: r.value + 1,
          "onUpdate:modelValue": R[2] || (R[2] = (M) => A({ not: M })),
          onValidity: R[3] || (R[3] = (M) => k("nested", M))
        }, null, 8, ["board-id", "schema", "model-value", "path", "depth"])) : v.value === "field" ? (n(), f(_, { key: 2 }, [
          s("div", hs, [
            s("label", null, [
              R[22] || (R[22] = W("Field", -1)),
              y(d(pe), {
                "aria-label": o.value + " field",
                "model-value": e.modelValue.field,
                "onUpdate:modelValue": R[4] || (R[4] = (M) => A({ field: M, op: "eq", value: void 0 })),
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                optionDisabled: "disabled",
                options: [...(m.value ?? []).map((M) => ({ label: d(He)(M), value: M.code, disabled: !1 }))]
              }, null, 8, ["aria-label", "model-value", "options"])
            ]),
            s("label", null, [
              R[23] || (R[23] = W("Comparison", -1)),
              y(d(pe), {
                "aria-label": o.value + " operator",
                "model-value": e.modelValue.op,
                "onUpdate:modelValue": R[5] || (R[5] = (M) => A({ op: M, value: M === "is_null" ? !0 : void 0 })),
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                options: d(Kn)(g.value).map((M) => ({ value: M, label: C[M] }))
              }, null, 8, ["aria-label", "model-value", "options"])
            ])
          ]),
          y(va, {
            "board-id": e.boardId,
            field: e.modelValue.op === "is_null" ? { code: "null", form: "bool" } : g.value,
            "model-value": e.modelValue.value,
            multiple: ["in", "nin", "between"].includes(String(e.modelValue.op)),
            label: o.value + " value",
            "onUpdate:modelValue": R[6] || (R[6] = (M) => A({ value: M })),
            onValidity: R[7] || (R[7] = (M) => k("value", M))
          }, null, 8, ["board-id", "field", "model-value", "multiple", "label"])
        ], 64)) : v.value === "match" ? (n(), f("label", bs, [
          R[24] || (R[24] = W("Search", -1)),
          y(d(Ie), {
            "aria-label": o.value + " search",
            value: e.modelValue.match,
            onInput: R[8] || (R[8] = (M) => A({ match: M.target.value }))
          }, null, 8, ["aria-label", "value"])
        ])) : v.value === "history" ? (n(), f(_, { key: 4 }, [
          s("div", ys, [
            s("label", null, [
              R[25] || (R[25] = W("Field", -1)),
              y(d(pe), {
                "aria-label": o.value + " history field",
                "model-value": i.value.field,
                "onUpdate:modelValue": R[9] || (R[9] = (M) => le("field", M)),
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                optionDisabled: "disabled",
                options: [...(m.value ?? []).map((M) => ({ label: d(He)(M), value: M.code, disabled: !1 }))]
              }, null, 8, ["aria-label", "model-value", "options"])
            ]),
            s("label", null, [
              R[26] || (R[26] = W("History", -1)),
              y(d(pe), {
                "aria-label": o.value + " history mode",
                "model-value": i.value.changed ? "changed" : "was",
                "onUpdate:modelValue": R[10] || (R[10] = (M) => Z(M)),
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                optionDisabled: "disabled",
                options: [{ label: "Changed", value: "changed", disabled: !1 }, { label: "Was", value: "was", disabled: !1 }]
              }, null, 8, ["aria-label", "model-value"])
            ])
          ]),
          i.value.changed ? (n(), f(_, { key: 0 }, ue(["from", "to"], (M) => s("div", { key: M }, [
            s("label", ks, [
              y(d(Pt), {
                "model-value": M in i.value,
                "aria-label": "Constrain " + M,
                "onUpdate:modelValue": (ae) => le(M, ae ? "" : void 0),
                binary: ""
              }, null, 8, ["model-value", "aria-label", "onUpdate:modelValue"]),
              W(D(M), 1)
            ]),
            M in i.value ? (n(), J(va, {
              key: 0,
              "board-id": e.boardId,
              field: c.value,
              "model-value": i.value[M],
              label: o.value + " history " + M,
              "onUpdate:modelValue": (ae) => le(M, ae),
              onValidity: (ae) => k(M, ae)
            }, null, 8, ["board-id", "field", "model-value", "label", "onUpdate:modelValue", "onValidity"])) : I("", !0)
          ])), 64)) : (n(), J(va, {
            key: 1,
            "board-id": e.boardId,
            field: c.value,
            "model-value": i.value.was,
            label: o.value + " history was",
            "onUpdate:modelValue": R[11] || (R[11] = (M) => le("was", M)),
            onValidity: R[12] || (R[12] = (M) => k("was", M))
          }, null, 8, ["board-id", "field", "model-value", "label"])),
          s("label", ws, [
            y(d(Pt), {
              "model-value": "by" in i.value,
              "aria-label": "Constrain actor",
              "onUpdate:modelValue": R[13] || (R[13] = (M) => le("by", M ? { $actor: "id" } : void 0)),
              binary: ""
            }, null, 8, ["model-value"]),
            R[27] || (R[27] = W("By actor", -1))
          ]),
          "by" in i.value ? (n(), J(va, {
            key: 2,
            "board-id": e.boardId,
            field: se,
            "model-value": i.value.by,
            label: o.value + " history by",
            "onUpdate:modelValue": R[14] || (R[14] = (M) => le("by", M))
          }, null, 8, ["board-id", "model-value", "label"])) : I("", !0),
          s("label", $s, [
            y(d(Pt), {
              "model-value": "during" in i.value,
              "aria-label": "Constrain time window",
              "onUpdate:modelValue": R[15] || (R[15] = (M) => le("during", M ? [{ $now: "-P30D" }, { $now: "P0D" }] : void 0)),
              binary: ""
            }, null, 8, ["model-value"]),
            R[28] || (R[28] = W("During", -1))
          ]),
          "during" in i.value ? (n(), f("div", Vs, [
            (n(), f(_, null, ue(["start", "end"], (M, ae) => y(va, {
              key: M,
              "board-id": e.boardId,
              field: ce,
              "model-value": ve.value[ae],
              label: o.value + " during " + M,
              "onUpdate:modelValue": (ke) => me(ae, ke)
            }, null, 8, ["board-id", "model-value", "label", "onUpdate:modelValue"])), 64))
          ])) : I("", !0)
        ], 64)) : (n(), f(_, { key: 5 }, [
          s("div", xs, [
            v.value === "rel" ? (n(), f(_, { key: 0 }, [
              s("label", null, [
                R[29] || (R[29] = W("Relation", -1)),
                y(d(pe), {
                  "model-value": e.modelValue.rel,
                  "onUpdate:modelValue": R[16] || (R[16] = (M) => A({ rel: M })),
                  appendTo: "self",
                  optionLabel: "label",
                  optionValue: "value",
                  optionDisabled: "disabled",
                  options: [...(e.schema.compiled.relation_types ?? []).map((M) => ({ label: M.outward ?? M.id, value: M.id, disabled: !1 }))]
                }, null, 8, ["model-value", "options"])
              ]),
              s("label", null, [
                R[30] || (R[30] = W("Direction", -1)),
                y(d(pe), {
                  "model-value": e.modelValue.dir,
                  "onUpdate:modelValue": R[17] || (R[17] = (M) => A({ dir: M })),
                  appendTo: "self",
                  optionLabel: "label",
                  optionValue: "value",
                  optionDisabled: "disabled",
                  options: [{ label: "Outward", value: "outward", disabled: !1 }, { label: "Inward", value: "inward", disabled: !1 }]
                }, null, 8, ["model-value"])
              ])
            ], 64)) : I("", !0),
            s("label", null, [
              R[31] || (R[31] = W("Quantifier", -1)),
              y(d(pe), {
                "model-value": e.modelValue.q,
                "onUpdate:modelValue": R[18] || (R[18] = (M) => A({ q: M })),
                appendTo: "self",
                options: ["some", "every", "none"]
              }, null, 8, ["model-value"])
            ])
          ]),
          y(te, {
            "board-id": e.boardId,
            schema: e.schema,
            "model-value": d(nt)(e.modelValue.where),
            path: o.value + ".where",
            depth: r.value + 1,
            "onUpdate:modelValue": R[19] || (R[19] = (M) => A({ where: M })),
            onValidity: R[20] || (R[20] = (M) => k("nested", M))
          }, null, 8, ["board-id", "schema", "model-value", "path", "depth"])
        ], 64))
      ], 8, ms);
    };
  }
}), Ss = { class: "work-stack work-tight" }, Ts = { class: "work-row work-small" }, Yl = /* @__PURE__ */ ye({
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
    function v(g, i) {
      i ? r.delete(g) : r.add(g), l("validity", !r.size);
    }
    function m(g) {
      l("update:modelValue", g ? { field: t.draft.fields?.[0]?.code ?? "state", op: "eq" } : void 0), g || (r.clear(), l("validity", !0));
    }
    return wt(() => l("validity", !0)), (g, i) => (n(), f("section", Ss, [
      s("label", Ts, [
        y(d(lt), {
          "model-value": e.modelValue != null,
          "aria-label": e.label,
          "onUpdate:modelValue": m
        }, null, 8, ["model-value", "aria-label"]),
        W(D(e.label), 1)
      ]),
      e.modelValue != null ? (n(), J(Cs, {
        key: 0,
        schema: o.value,
        "board-id": e.boardId ?? "",
        "model-value": d(nt)(e.modelValue),
        path: e.label,
        "onUpdate:modelValue": i[0] || (i[0] = (c) => l("update:modelValue", c)),
        onValidity: i[1] || (i[1] = (c) => v("structured", c))
      }, null, 8, ["schema", "board-id", "model-value", "path"])) : I("", !0),
      e.modelValue != null ? (n(), J(Mt, {
        key: 1,
        label: e.label + " predicate",
        "model-value": e.modelValue,
        hint: "Use any predicate accepted by Work, including installed or deeply nested forms.",
        "onUpdate:modelValue": i[2] || (i[2] = (c) => l("update:modelValue", c)),
        onValidity: i[3] || (i[3] = (c) => v("raw", c))
      }, null, 8, ["label", "model-value"])) : I("", !0)
    ]));
  }
}), Is = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, Ds = ["aria-label"], As = { class: "work-field-label" }, Us = {
  key: 0,
  class: "work-chips"
}, Es = ["kinds"], Os = {
  key: 2,
  class: "work-muted work-small"
}, Xl = /* @__PURE__ */ ye({
  __name: "PrincipalsPicker",
  props: {
    modelValue: {},
    label: {},
    kinds: {},
    boardId: {}
  },
  emits: ["update:modelValue"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = z(!1), r = z(0), v = F(() => t.modelValue ?? []), { principalLabel: m, rememberPrincipal: g, nameError: i } = No(() => t.boardId ?? "", () => v.value);
    Sa(async () => {
      o.value = await Rt("wc-principal-picker");
    });
    function c(u) {
      const C = u.detail, h = C?.principal_id ?? C?.id;
      if (!h) return;
      const b = { kind: C.type ?? "user", id: h };
      C.label && g(b, C.label), v.value.some((p) => p.id === h && p.kind === b.kind) || l("update:modelValue", [...v.value, b]), r.value++;
    }
    return (u, C) => (n(), f(_, null, [
      d(i) ? (n(), f("p", Is, D(d(i)), 1)) : I("", !0),
      s("section", {
        class: "work-stack work-tight work-principals-picker",
        "aria-label": e.label
      }, [
        s("h4", As, D(e.label), 1),
        v.value.length ? (n(), f("div", Us, [
          (n(!0), f(_, null, ue(v.value, (h, b) => (n(), J(d(Xe), {
            key: h.kind + h.id,
            severity: "secondary",
            class: "kx-tag-sm"
          }, {
            default: j(() => [
              W(D(d(m)(h)), 1),
              y(d(Q), {
                text: "",
                severity: "secondary",
                size: "small",
                "aria-label": "Remove " + d(m)(h),
                onClick: (p) => l("update:modelValue", v.value.filter((k, S) => S !== b))
              }, {
                default: j(() => [
                  y(d(fe), { icon: "tabler:x" })
                ]),
                _: 1
              }, 8, ["aria-label", "onClick"])
            ]),
            _: 2
          }, 1024))), 128))
        ])) : I("", !0),
        o.value ? (n(), f("wc-principal-picker", {
          key: r.value,
          kinds: e.kinds ?? "user,group",
          onConfigChanged: c
        }, null, 40, Es)) : (n(), f("p", Os, "People and group picker is unavailable."))
      ], 8, Ds)
    ], 64));
  }
}), Rs = { class: "work-stack work-tight" }, Go = /* @__PURE__ */ ye({
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
      const m = [...(t.modelValue ?? []).filter((g) => "field" in g || "service" in g), ...v.map((g) => g.kind === "group" ? { group: g.id } : { user: g.id })];
      l("update:modelValue", m.length ? m : void 0);
    }
    return (v, m) => (n(), f("div", Rs, [
      y(Xl, {
        "board-id": e.boardId,
        label: e.label,
        "model-value": o.value,
        "onUpdate:modelValue": r
      }, null, 8, ["board-id", "label", "model-value"]),
      y(Mt, {
        label: e.label + " rules",
        "model-value": e.modelValue,
        shape: "array",
        example: [{ group: "selected-group" }],
        "onUpdate:modelValue": m[0] || (m[0] = (g) => l("update:modelValue", g)),
        onValidity: m[1] || (m[1] = (g) => l("validity", g))
      }, null, 8, ["label", "model-value"])
    ]));
  }
}), Ps = ["disabled"], Ns = { class: "work-chips" }, Ms = {
  key: 1,
  class: "work-muted work-small"
}, pt = /* @__PURE__ */ ye({
  __name: "ChipPicker",
  props: {
    label: {},
    options: {},
    modelValue: {},
    disabled: { type: Boolean }
  },
  emits: ["update:modelValue"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = z(""), r = F(() => t.options.map((g) => typeof g == "string" ? { value: g } : g)), v = F(() => r.value.filter((g) => (g.label ?? Oe(g.value)).toLocaleLowerCase().includes(o.value.toLocaleLowerCase())));
    function m(g) {
      if (t.disabled) return;
      const i = t.modelValue ?? [];
      l("update:modelValue", i.includes(g) ? i.filter((c) => c !== g) : [...i, g]);
    }
    return (g, i) => (n(), f("fieldset", {
      class: "work-chip-picker",
      disabled: e.disabled
    }, [
      s("legend", null, D(e.label), 1),
      e.options.length > 10 ? (n(), J(d(Ie), {
        key: 0,
        modelValue: o.value,
        "onUpdate:modelValue": i[0] || (i[0] = (c) => o.value = c),
        type: "search",
        "aria-label": "Find " + e.label.toLowerCase(),
        placeholder: "Find a choice…"
      }, null, 8, ["modelValue", "aria-label"])) : I("", !0),
      s("div", Ns, [
        y(d(Gl), {
          "model-value": e.modelValue ?? [],
          options: v.value.map((c) => ({ value: c.value, label: c.label ?? d(Oe)(c.value) })),
          optionLabel: "label",
          optionValue: "value",
          multiple: "",
          disabled: e.disabled,
          "aria-label": e.label,
          "onUpdate:modelValue": i[1] || (i[1] = (c) => l("update:modelValue", c ?? []))
        }, null, 8, ["model-value", "options", "disabled", "aria-label"]),
        (n(!0), f(_, null, ue(e.modelValue?.filter((c) => !r.value.some((u) => u.value === c)) ?? [], (c) => (n(), J(d(Q), {
          severity: "secondary",
          text: "",
          size: "small",
          key: c,
          type: "button",
          class: "work-choice work-unavailable",
          "aria-label": "Remove unavailable " + c,
          onClick: (u) => m(c)
        }, {
          default: j(() => [
            W(D(d(Oe)(c)) + " · unavailable ×", 1)
          ]),
          _: 2
        }, 1032, ["aria-label", "onClick"]))), 128))
      ]),
      e.options.length ? I("", !0) : (n(), f("span", Ms, "No choices declared."))
    ], 8, Ps));
  }
}), Fs = ["onKeydown"], Ls = { class: "work-stack work-tight" }, Bs = { class: "work-row work-wrap" }, zs = ["id"], Ca = /* @__PURE__ */ ye({
  __name: "AddDefinitionRow",
  props: {
    action: {},
    label: {},
    maxlength: {},
    regular: { type: Boolean },
    openOnEntry: { type: Boolean },
    validate: { type: Function }
  },
  emits: ["open", "add", "cancel"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = z(), r = z(!1), v = z(""), m = gt(), g = F(() => v.value.trim()), i = F(() => g.value ? t.validate?.(g.value) : void 0);
    async function c() {
      l("open"), r.value = !0, await mt(), o.value?.querySelector("input")?.focus();
    }
    async function u() {
      v.value = "", r.value = !1, await mt(), o.value?.querySelector("button")?.focus();
    }
    function C() {
      !g.value || i.value || (l("add", g.value), u());
    }
    function h() {
      l("cancel"), u();
    }
    return Ve(() => t.openOnEntry, (b, p) => {
      b ? c() : p && r.value && u();
    }, { immediate: !0 }), (b, p) => (n(), f("div", {
      ref_key: "row",
      ref: o,
      class: "work-add-definition"
    }, [
      r.value ? (n(), f("div", {
        key: 1,
        class: "work-add-editor",
        onKeydown: je(Pe(h, ["stop", "prevent"]), ["esc"])
      }, [
        s("label", Ls, [
          W(D(e.label) + " ", 1),
          y(d(Ie), {
            modelValue: v.value,
            "onUpdate:modelValue": p[0] || (p[0] = (k) => v.value = k),
            "aria-label": e.label,
            maxlength: e.maxlength,
            invalid: !!i.value,
            "aria-describedby": i.value ? d(m) : void 0,
            onKeydown: je(Pe(C, ["stop", "prevent"]), ["enter"])
          }, null, 8, ["modelValue", "aria-label", "maxlength", "invalid", "aria-describedby", "onKeydown"])
        ]),
        Be(b.$slots, "default"),
        s("div", Bs, [
          y(d(Q), {
            type: "button",
            label: e.action,
            size: e.regular ? void 0 : "small",
            disabled: !g.value || !!i.value,
            onClick: C
          }, null, 8, ["label", "size", "disabled"]),
          y(d(Q), {
            type: "button",
            label: "Cancel",
            text: "",
            severity: "secondary",
            size: e.regular ? void 0 : "small",
            onClick: h
          }, null, 8, ["size"])
        ]),
        i.value ? (n(), f("p", {
          key: 0,
          id: d(m),
          class: "work-error work-small",
          role: "status"
        }, D(i.value), 9, zs)) : I("", !0)
      ], 40, Fs)) : (n(), J(d(Q), {
        key: 0,
        type: "button",
        label: e.action,
        "aria-expanded": "false",
        severity: "secondary",
        outlined: "",
        size: e.regular ? void 0 : "small",
        onClick: c
      }, {
        icon: j(() => [
          y(d(fe), {
            icon: "tabler:plus",
            "aria-hidden": "true"
          })
        ]),
        _: 1
      }, 8, ["label", "size"]))
    ], 512));
  }
});
/**!
 * Sortable 1.15.7
 * @author	RubaXa   <trash@rubaxa.org>
 * @author	owenm    <owen23355@gmail.com>
 * @license MIT
 */
function js(e, a, t) {
  return (a = Ks(a)) in e ? Object.defineProperty(e, a, {
    value: t,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : e[a] = t, e;
}
function St() {
  return St = Object.assign ? Object.assign.bind() : function(e) {
    for (var a = 1; a < arguments.length; a++) {
      var t = arguments[a];
      for (var l in t) ({}).hasOwnProperty.call(t, l) && (e[l] = t[l]);
    }
    return e;
  }, St.apply(null, arguments);
}
function po(e, a) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(e);
    a && (l = l.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), t.push.apply(t, l);
  }
  return t;
}
function kt(e) {
  for (var a = 1; a < arguments.length; a++) {
    var t = arguments[a] != null ? arguments[a] : {};
    a % 2 ? po(Object(t), !0).forEach(function(l) {
      js(e, l, t[l]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : po(Object(t)).forEach(function(l) {
      Object.defineProperty(e, l, Object.getOwnPropertyDescriptor(t, l));
    });
  }
  return e;
}
function qs(e, a) {
  if (e == null) return {};
  var t, l, o = Ws(e, a);
  if (Object.getOwnPropertySymbols) {
    var r = Object.getOwnPropertySymbols(e);
    for (l = 0; l < r.length; l++) t = r[l], a.indexOf(t) === -1 && {}.propertyIsEnumerable.call(e, t) && (o[t] = e[t]);
  }
  return o;
}
function Ws(e, a) {
  if (e == null) return {};
  var t = {};
  for (var l in e) if ({}.hasOwnProperty.call(e, l)) {
    if (a.indexOf(l) !== -1) continue;
    t[l] = e[l];
  }
  return t;
}
function Gs(e, a) {
  if (typeof e != "object" || !e) return e;
  var t = e[Symbol.toPrimitive];
  if (t !== void 0) {
    var l = t.call(e, a);
    if (typeof l != "object") return l;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (a === "string" ? String : Number)(e);
}
function Ks(e) {
  var a = Gs(e, "string");
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
var Hs = "1.15.7";
function Ct(e) {
  if (typeof window < "u" && window.navigator)
    return !!/* @__PURE__ */ navigator.userAgent.match(e);
}
var Tt = Ct(/(?:Trident.*rv[ :]?11\.|msie|iemobile|Windows Phone)/i), Ia = Ct(/Edge/i), go = Ct(/firefox/i), ba = Ct(/safari/i) && !Ct(/chrome/i) && !Ct(/android/i), Zl = Ct(/iP(ad|od|hone)/i), Ko = Ct(/chrome/i) && Ct(/android/i), Ho = {
  capture: !1,
  passive: !1
};
function De(e, a, t) {
  e.addEventListener(a, t, !Tt && Ho);
}
function Te(e, a, t) {
  e.removeEventListener(a, t, !Tt && Ho);
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
function Jo(e) {
  return e.host && e !== document && e.host.nodeType && e.host !== e ? e.host : e.parentNode;
}
function ft(e, a, t, l) {
  if (e) {
    t = t || document;
    do {
      if (a != null && (a[0] === ">" ? e.parentNode === t && Ja(e, a) : Ja(e, a)) || l && e === t)
        return e;
      if (e === t) break;
    } while (e = Jo(e));
  }
  return null;
}
var ho = /\s+/g;
function ot(e, a, t) {
  if (e && a)
    if (e.classList)
      e.classList[t ? "add" : "remove"](a);
    else {
      var l = (" " + e.className + " ").replace(ho, " ").replace(" " + a + " ", " ");
      e.className = (l + (t ? " " + a : "")).replace(ho, " ");
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
function na(e, a) {
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
function Yo(e, a, t) {
  if (e) {
    var l = e.getElementsByTagName(a), o = 0, r = l.length;
    if (t)
      for (; o < r; o++)
        t(l[o], o);
    return l;
  }
  return [];
}
function yt() {
  var e = document.scrollingElement;
  return e || document.documentElement;
}
function qe(e, a, t, l, o) {
  if (!(!e.getBoundingClientRect && e !== window)) {
    var r, v, m, g, i, c, u;
    if (e !== window && e.parentNode && e !== yt() ? (r = e.getBoundingClientRect(), v = r.top, m = r.left, g = r.bottom, i = r.right, c = r.height, u = r.width) : (v = 0, m = 0, g = window.innerHeight, i = window.innerWidth, c = window.innerHeight, u = window.innerWidth), (a || t) && e !== window && (o = o || e.parentNode, !Tt))
      do
        if (o && o.getBoundingClientRect && (he(o, "transform") !== "none" || t && he(o, "position") !== "static")) {
          var C = o.getBoundingClientRect();
          v -= C.top + parseInt(he(o, "border-top-width")), m -= C.left + parseInt(he(o, "border-left-width")), g = v + r.height, i = m + r.width;
          break;
        }
      while (o = o.parentNode);
    if (l && e !== window) {
      var h = na(o || e), b = h && h.a, p = h && h.d;
      h && (v /= p, m /= b, u /= b, c /= p, g = v + c, i = m + u);
    }
    return {
      top: v,
      left: m,
      bottom: g,
      right: i,
      width: u,
      height: c
    };
  }
}
function bo(e, a, t) {
  for (var l = Ot(e, !0), o = qe(e)[a]; l; ) {
    var r = qe(l)[t], v = void 0;
    if (v = o >= r, !v) return l;
    if (l === yt()) break;
    l = Ot(l, !1);
  }
  return !1;
}
function ra(e, a, t, l) {
  for (var o = 0, r = 0, v = e.children; r < v.length; ) {
    if (v[r].style.display !== "none" && v[r] !== be.ghost && (l || v[r] !== be.dragged) && ft(v[r], t.draggable, e, !1)) {
      if (o === a)
        return v[r];
      o++;
    }
    r++;
  }
  return null;
}
function Ql(e, a) {
  for (var t = e.lastElementChild; t && (t === be.ghost || he(t, "display") === "none" || a && !Ja(t, a)); )
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
function yo(e) {
  var a = 0, t = 0, l = yt();
  if (e)
    do {
      var o = na(e), r = o.a, v = o.d;
      a += e.scrollLeft * r, t += e.scrollTop * v;
    } while (e !== l && (e = e.parentNode));
  return [a, t];
}
function Js(e, a) {
  for (var t in e)
    if (e.hasOwnProperty(t)) {
      for (var l in a)
        if (a.hasOwnProperty(l) && a[l] === e[t][l]) return Number(t);
    }
  return -1;
}
function Ot(e, a) {
  if (!e || !e.getBoundingClientRect) return yt();
  var t = e, l = !1;
  do
    if (t.clientWidth < t.scrollWidth || t.clientHeight < t.scrollHeight) {
      var o = he(t);
      if (t.clientWidth < t.scrollWidth && (o.overflowX == "auto" || o.overflowX == "scroll") || t.clientHeight < t.scrollHeight && (o.overflowY == "auto" || o.overflowY == "scroll")) {
        if (!t.getBoundingClientRect || t === document.body) return yt();
        if (l || a) return t;
        l = !0;
      }
    }
  while (t = t.parentNode);
  return yt();
}
function Ys(e, a) {
  if (e && a)
    for (var t in a)
      a.hasOwnProperty(t) && (e[t] = a[t]);
  return e;
}
function ml(e, a) {
  return Math.round(e.top) === Math.round(a.top) && Math.round(e.left) === Math.round(a.left) && Math.round(e.height) === Math.round(a.height) && Math.round(e.width) === Math.round(a.width);
}
var ya;
function Xo(e, a) {
  return function() {
    if (!ya) {
      var t = arguments, l = this;
      t.length === 1 ? e.call(l, t[0]) : e.apply(l, t), ya = setTimeout(function() {
        ya = void 0;
      }, a);
    }
  };
}
function Xs() {
  clearTimeout(ya), ya = void 0;
}
function Zo(e, a, t) {
  e.scrollLeft += a, e.scrollTop += t;
}
function Qo(e) {
  var a = window.Polymer, t = window.jQuery || window.Zepto;
  return a && a.dom ? a.dom(e).cloneNode(!0) : t ? t(e).clone(!0)[0] : e.cloneNode(!0);
}
function _o(e, a, t) {
  var l = {};
  return Array.from(e.children).forEach(function(o) {
    var r, v, m, g;
    if (!(!ft(o, a.draggable, e, !1) || o.animated || o === t)) {
      var i = qe(o);
      l.left = Math.min((r = l.left) !== null && r !== void 0 ? r : 1 / 0, i.left), l.top = Math.min((v = l.top) !== null && v !== void 0 ? v : 1 / 0, i.top), l.right = Math.max((m = l.right) !== null && m !== void 0 ? m : -1 / 0, i.right), l.bottom = Math.max((g = l.bottom) !== null && g !== void 0 ? g : -1 / 0, i.bottom);
    }
  }), l.width = l.right - l.left, l.height = l.bottom - l.top, l.x = l.left, l.y = l.top, l;
}
var at = "Sortable" + (/* @__PURE__ */ new Date()).getTime();
function Zs() {
  var e = [], a;
  return {
    captureAnimationState: function() {
      if (e = [], !!this.options.animation) {
        var l = [].slice.call(this.el.children);
        l.forEach(function(o) {
          if (!(he(o, "display") === "none" || o === be.ghost)) {
            e.push({
              target: o,
              rect: qe(o)
            });
            var r = kt({}, e[e.length - 1].rect);
            if (o.thisAnimationDuration) {
              var v = na(o, !0);
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
      e.splice(Js(e, {
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
        var g = 0, i = m.target, c = i.fromRect, u = qe(i), C = i.prevFromRect, h = i.prevToRect, b = m.rect, p = na(i, !0);
        p && (u.top -= p.f, u.left -= p.e), i.toRect = u, i.thisAnimationDuration && ml(C, u) && !ml(c, u) && // Make sure animatingRect is on line between toRect & fromRect
        (b.top - u.top) / (b.left - u.left) === (c.top - u.top) / (c.left - u.left) && (g = _s(b, C, h, o.options)), ml(u, c) || (i.prevFromRect = c, i.prevToRect = u, g || (g = o.options.animation), o.animate(i, b, u, g)), g && (r = !0, v = Math.max(v, g), clearTimeout(i.animationResetTimer), i.animationResetTimer = setTimeout(function() {
          i.animationTime = 0, i.prevFromRect = null, i.fromRect = null, i.prevToRect = null, i.thisAnimationDuration = null;
        }, g), i.thisAnimationDuration = g);
      }), clearTimeout(a), r ? a = setTimeout(function() {
        typeof l == "function" && l();
      }, v) : typeof l == "function" && l(), e = [];
    },
    animate: function(l, o, r, v) {
      if (v) {
        he(l, "transition", ""), he(l, "transform", "");
        var m = na(this.el), g = m && m.a, i = m && m.d, c = (o.left - r.left) / (g || 1), u = (o.top - r.top) / (i || 1);
        l.animatingX = !!c, l.animatingY = !!u, he(l, "transform", "translate3d(" + c + "px," + u + "px,0)"), this.forRepaintDummy = Qs(l), he(l, "transition", "transform " + v + "ms" + (this.options.easing ? " " + this.options.easing : "")), he(l, "transform", "translate3d(0,0,0)"), typeof l.animated == "number" && clearTimeout(l.animated), l.animated = setTimeout(function() {
          he(l, "transition", ""), he(l, "transform", ""), l.animated = !1, l.animatingX = !1, l.animatingY = !1;
        }, v);
      }
    }
  };
}
function Qs(e) {
  return e.offsetWidth;
}
function _s(e, a, t, l) {
  return Math.sqrt(Math.pow(a.top - e.top, 2) + Math.pow(a.left - e.left, 2)) / Math.sqrt(Math.pow(a.top - t.top, 2) + Math.pow(a.left - t.left, 2)) * l.animation;
}
var Qt = [], pl = {
  initializeByDefault: !0
}, Da = {
  mount: function(a) {
    for (var t in pl)
      pl.hasOwnProperty(t) && !(t in a) && (a[t] = pl[t]);
    Qt.forEach(function(l) {
      if (l.pluginName === a.pluginName)
        throw "Sortable: Cannot mount plugin ".concat(a.pluginName, " more than once");
    }), Qt.push(a);
  },
  pluginEvent: function(a, t, l) {
    var o = this;
    this.eventCanceled = !1, l.cancel = function() {
      o.eventCanceled = !0;
    };
    var r = a + "Global";
    Qt.forEach(function(v) {
      t[v.pluginName] && (t[v.pluginName][r] && t[v.pluginName][r](kt({
        sortable: t
      }, l)), t.options[v.pluginName] && t[v.pluginName][a] && t[v.pluginName][a](kt({
        sortable: t
      }, l)));
    });
  },
  initializePlugins: function(a, t, l, o) {
    Qt.forEach(function(m) {
      var g = m.pluginName;
      if (!(!a.options[g] && !m.initializeByDefault)) {
        var i = new m(a, t, a.options);
        i.sortable = a, i.options = a.options, a[g] = i, St(l, i.defaults);
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
    return Qt.forEach(function(o) {
      typeof o.eventProperties == "function" && St(l, o.eventProperties.call(t[o.pluginName], a));
    }), l;
  },
  modifyOption: function(a, t, l) {
    var o;
    return Qt.forEach(function(r) {
      a[r.pluginName] && r.optionListeners && typeof r.optionListeners[t] == "function" && (o = r.optionListeners[t].call(a[r.pluginName], l));
    }), o;
  }
};
function er(e) {
  var a = e.sortable, t = e.rootEl, l = e.name, o = e.targetEl, r = e.cloneEl, v = e.toEl, m = e.fromEl, g = e.oldIndex, i = e.newIndex, c = e.oldDraggableIndex, u = e.newDraggableIndex, C = e.originalEvent, h = e.putSortable, b = e.extraEventProperties;
  if (a = a || t && t[at], !!a) {
    var p, k = a.options, S = "on" + l.charAt(0).toUpperCase() + l.substr(1);
    window.CustomEvent && !Tt && !Ia ? p = new CustomEvent(l, {
      bubbles: !0,
      cancelable: !0
    }) : (p = document.createEvent("Event"), p.initEvent(l, !0, !0)), p.to = v || t, p.from = m || t, p.item = o || t, p.clone = r, p.oldIndex = g, p.newIndex = i, p.oldDraggableIndex = c, p.newDraggableIndex = u, p.originalEvent = C, p.pullMode = h ? h.lastPutMode : void 0;
    var V = kt(kt({}, b), Da.getEventProperties(l, a));
    for (var A in V)
      p[A] = V[A];
    t && t.dispatchEvent(p), k[S] && k[S].call(a, p);
  }
}
var tr = ["evt"], tt = function(a, t) {
  var l = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, o = l.evt, r = qs(l, tr);
  Da.pluginEvent.bind(be)(a, t, kt({
    dragEl: ie,
    parentEl: Le,
    ghostEl: we,
    rootEl: Ne,
    nextEl: Kt,
    lastDownEl: za,
    cloneEl: Fe,
    cloneHidden: Ut,
    dragStarted: fa,
    putSortable: Ye,
    activeSortable: be.active,
    originalEvent: o,
    oldIndex: oa,
    oldDraggableIndex: ka,
    newIndex: it,
    newDraggableIndex: At,
    hideGhostForTarget: li,
    unhideGhostForTarget: oi,
    cloneNowHidden: function() {
      Ut = !0;
    },
    cloneNowShown: function() {
      Ut = !1;
    },
    dispatchSortableEvent: function(m) {
      et({
        sortable: t,
        name: m,
        originalEvent: o
      });
    }
  }, r));
};
function et(e) {
  er(kt({
    putSortable: Ye,
    cloneEl: Fe,
    targetEl: ie,
    rootEl: Ne,
    oldIndex: oa,
    oldDraggableIndex: ka,
    newIndex: it,
    newDraggableIndex: At
  }, e));
}
var ie, Le, we, Ne, Kt, za, Fe, Ut, oa, it, ka, At, Na, Ye, ea = !1, Ya = !1, Xa = [], qt, ct, gl, hl, ko, wo, fa, _t, wa, $a = !1, Ma = !1, ja, _e, bl = [], Ul = !1, Za = [], al = typeof document < "u", Fa = Zl, $o = Ia || Tt ? "cssFloat" : "float", ar = al && !Ko && !Zl && "draggable" in document.createElement("div"), ei = (function() {
  if (al) {
    if (Tt)
      return !1;
    var e = document.createElement("x");
    return e.style.cssText = "pointer-events:auto", e.style.pointerEvents === "auto";
  }
})(), ti = function(a, t) {
  var l = he(a), o = parseInt(l.width) - parseInt(l.paddingLeft) - parseInt(l.paddingRight) - parseInt(l.borderLeftWidth) - parseInt(l.borderRightWidth), r = ra(a, 0, t), v = ra(a, 1, t), m = r && he(r), g = v && he(v), i = m && parseInt(m.marginLeft) + parseInt(m.marginRight) + qe(r).width, c = g && parseInt(g.marginLeft) + parseInt(g.marginRight) + qe(v).width;
  if (l.display === "flex")
    return l.flexDirection === "column" || l.flexDirection === "column-reverse" ? "vertical" : "horizontal";
  if (l.display === "grid")
    return l.gridTemplateColumns.split(" ").length <= 1 ? "vertical" : "horizontal";
  if (r && m.float && m.float !== "none") {
    var u = m.float === "left" ? "left" : "right";
    return v && (g.clear === "both" || g.clear === u) ? "vertical" : "horizontal";
  }
  return r && (m.display === "block" || m.display === "flex" || m.display === "table" || m.display === "grid" || i >= o && l[$o] === "none" || v && l[$o] === "none" && i + c > o) ? "vertical" : "horizontal";
}, lr = function(a, t, l) {
  var o = l ? a.left : a.top, r = l ? a.right : a.bottom, v = l ? a.width : a.height, m = l ? t.left : t.top, g = l ? t.right : t.bottom, i = l ? t.width : t.height;
  return o === m || r === g || o + v / 2 === m + i / 2;
}, or = function(a, t) {
  var l;
  return Xa.some(function(o) {
    var r = o[at].options.emptyInsertThreshold;
    if (!(!r || Ql(o))) {
      var v = qe(o), m = a >= v.left - r && a <= v.right + r, g = t >= v.top - r && t <= v.bottom + r;
      if (m && g)
        return l = o;
    }
  }), l;
}, ai = function(a) {
  function t(r, v) {
    return function(m, g, i, c) {
      var u = m.options.group.name && g.options.group.name && m.options.group.name === g.options.group.name;
      if (r == null && (v || u))
        return !0;
      if (r == null || r === !1)
        return !1;
      if (v && r === "clone")
        return r;
      if (typeof r == "function")
        return t(r(m, g, i, c), v)(m, g, i, c);
      var C = (v ? m : g).options.group.name;
      return r === !0 || typeof r == "string" && r === C || r.join && r.indexOf(C) > -1;
    };
  }
  var l = {}, o = a.group;
  (!o || Al(o) != "object") && (o = {
    name: o
  }), l.name = o.name, l.checkPull = t(o.pull, !0), l.checkPut = t(o.put), l.revertClone = o.revertClone, a.group = l;
}, li = function() {
  !ei && we && he(we, "display", "none");
}, oi = function() {
  !ei && we && he(we, "display", "");
};
al && !Ko && document.addEventListener("click", function(e) {
  if (Ya)
    return e.preventDefault(), e.stopPropagation && e.stopPropagation(), e.stopImmediatePropagation && e.stopImmediatePropagation(), Ya = !1, !1;
}, !0);
var Wt = function(a) {
  if (ie) {
    a = a.touches ? a.touches[0] : a;
    var t = or(a.clientX, a.clientY);
    if (t) {
      var l = {};
      for (var o in a)
        a.hasOwnProperty(o) && (l[o] = a[o]);
      l.target = l.rootEl = t, l.preventDefault = void 0, l.stopPropagation = void 0, t[at]._onDragOver(l);
    }
  }
}, ir = function(a) {
  ie && ie.parentNode[at]._isOutsideThisEl(a.target);
};
function be(e, a) {
  if (!(e && e.nodeType && e.nodeType === 1))
    throw "Sortable: `el` must be an HTMLElement, not ".concat({}.toString.call(e));
  this.el = e, this.options = a = St({}, a), e[at] = this;
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
      return ti(e, this.options);
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
    supportPointer: be.supportPointer !== !1 && "PointerEvent" in window && (!ba || Zl),
    emptyInsertThreshold: 5
  };
  Da.initializePlugins(this, e, t);
  for (var l in t)
    !(l in a) && (a[l] = t[l]);
  ai(a);
  for (var o in this)
    o.charAt(0) === "_" && typeof this[o] == "function" && (this[o] = this[o].bind(this));
  this.nativeDraggable = a.forceFallback ? !1 : ar, this.nativeDraggable && (this.options.touchStartThreshold = 1), a.supportPointer ? De(e, "pointerdown", this._onTapStart) : (De(e, "mousedown", this._onTapStart), De(e, "touchstart", this._onTapStart)), this.nativeDraggable && (De(e, "dragover", this), De(e, "dragenter", this)), Xa.push(this.el), a.store && a.store.get && this.sort(a.store.get(this) || []), St(this, Zs());
}
be.prototype = /** @lends Sortable.prototype */
{
  constructor: be,
  _isOutsideThisEl: function(a) {
    !this.el.contains(a) && a !== this.el && (_t = null);
  },
  _getDirection: function(a, t) {
    return typeof this.options.direction == "function" ? this.options.direction.call(this, a, t, ie) : this.options.direction;
  },
  _onTapStart: function(a) {
    if (a.cancelable) {
      var t = this, l = this.el, o = this.options, r = o.preventOnFilter, v = a.type, m = a.touches && a.touches[0] || a.pointerType && a.pointerType === "touch" && a, g = (m || a).target, i = a.target.shadowRoot && (a.path && a.path[0] || a.composedPath && a.composedPath()[0]) || g, c = o.filter;
      if (fr(l), !ie && !(/mousedown|pointerdown/.test(v) && a.button !== 0 || o.disabled) && !i.isContentEditable && !(!this.nativeDraggable && ba && g && g.tagName.toUpperCase() === "SELECT") && (g = ft(g, o.draggable, l, !1), !(g && g.animated) && za !== g)) {
        if (oa = st(g), ka = st(g, o.draggable), typeof c == "function") {
          if (c.call(this, a, g, this)) {
            et({
              sortable: t,
              rootEl: i,
              name: "filter",
              targetEl: g,
              toEl: l,
              fromEl: l
            }), tt("filter", t, {
              evt: a
            }), r && a.preventDefault();
            return;
          }
        } else if (c && (c = c.split(",").some(function(u) {
          if (u = ft(i, u.trim(), l, !1), u)
            return et({
              sortable: t,
              rootEl: u,
              name: "filter",
              targetEl: g,
              fromEl: l,
              toEl: l
            }), tt("filter", t, {
              evt: a
            }), !0;
        }), c)) {
          r && a.preventDefault();
          return;
        }
        o.handle && !ft(i, o.handle, l, !1) || this._prepareDragStart(a, m, g);
      }
    }
  },
  _prepareDragStart: function(a, t, l) {
    var o = this, r = o.el, v = o.options, m = r.ownerDocument, g;
    if (l && !ie && l.parentNode === r) {
      var i = qe(l);
      if (Ne = r, ie = l, Le = ie.parentNode, Kt = ie.nextSibling, za = l, Na = v.group, be.dragged = ie, qt = {
        target: ie,
        clientX: (t || a).clientX,
        clientY: (t || a).clientY
      }, ko = qt.clientX - i.left, wo = qt.clientY - i.top, this._lastX = (t || a).clientX, this._lastY = (t || a).clientY, ie.style["will-change"] = "all", g = function() {
        if (tt("delayEnded", o, {
          evt: a
        }), be.eventCanceled) {
          o._onDrop();
          return;
        }
        o._disableDelayedDragEvents(), !go && o.nativeDraggable && (ie.draggable = !0), o._triggerDragStart(a, t), et({
          sortable: o,
          name: "choose",
          originalEvent: a
        }), ot(ie, v.chosenClass, !0);
      }, v.ignore.split(",").forEach(function(c) {
        Yo(ie, c.trim(), yl);
      }), De(m, "dragover", Wt), De(m, "mousemove", Wt), De(m, "touchmove", Wt), v.supportPointer ? (De(m, "pointerup", o._onDrop), !this.nativeDraggable && De(m, "pointercancel", o._onDrop)) : (De(m, "mouseup", o._onDrop), De(m, "touchend", o._onDrop), De(m, "touchcancel", o._onDrop)), go && this.nativeDraggable && (this.options.touchStartThreshold = 4, ie.draggable = !0), tt("delayStart", this, {
        evt: a
      }), v.delay && (!v.delayOnTouchOnly || t) && (!this.nativeDraggable || !(Ia || Tt))) {
        if (be.eventCanceled) {
          this._onDrop();
          return;
        }
        v.supportPointer ? (De(m, "pointerup", o._disableDelayedDrag), De(m, "pointercancel", o._disableDelayedDrag)) : (De(m, "mouseup", o._disableDelayedDrag), De(m, "touchend", o._disableDelayedDrag), De(m, "touchcancel", o._disableDelayedDrag)), De(m, "mousemove", o._delayedDragTouchMoveHandler), De(m, "touchmove", o._delayedDragTouchMoveHandler), v.supportPointer && De(m, "pointermove", o._delayedDragTouchMoveHandler), o._dragStartTimer = setTimeout(g, v.delay);
      } else
        g();
    }
  },
  _delayedDragTouchMoveHandler: function(a) {
    var t = a.touches ? a.touches[0] : a;
    Math.max(Math.abs(t.clientX - this._lastX), Math.abs(t.clientY - this._lastY)) >= Math.floor(this.options.touchStartThreshold / (this.nativeDraggable && window.devicePixelRatio || 1)) && this._disableDelayedDrag();
  },
  _disableDelayedDrag: function() {
    ie && yl(ie), clearTimeout(this._dragStartTimer), this._disableDelayedDragEvents();
  },
  _disableDelayedDragEvents: function() {
    var a = this.el.ownerDocument;
    Te(a, "mouseup", this._disableDelayedDrag), Te(a, "touchend", this._disableDelayedDrag), Te(a, "touchcancel", this._disableDelayedDrag), Te(a, "pointerup", this._disableDelayedDrag), Te(a, "pointercancel", this._disableDelayedDrag), Te(a, "mousemove", this._delayedDragTouchMoveHandler), Te(a, "touchmove", this._delayedDragTouchMoveHandler), Te(a, "pointermove", this._delayedDragTouchMoveHandler);
  },
  _triggerDragStart: function(a, t) {
    t = t || a.pointerType == "touch" && a, !this.nativeDraggable || t ? this.options.supportPointer ? De(document, "pointermove", this._onTouchMove) : t ? De(document, "touchmove", this._onTouchMove) : De(document, "mousemove", this._onTouchMove) : (De(ie, "dragend", this), De(Ne, "dragstart", this._onDragStart));
    try {
      document.selection ? qa(function() {
        document.selection.empty();
      }) : window.getSelection().removeAllRanges();
    } catch {
    }
  },
  _dragStarted: function(a, t) {
    if (ea = !1, Ne && ie) {
      tt("dragStarted", this, {
        evt: t
      }), this.nativeDraggable && De(document, "dragover", ir);
      var l = this.options;
      !a && ot(ie, l.dragClass, !1), ot(ie, l.ghostClass, !0), be.active = this, a && this._appendGhost(), et({
        sortable: this,
        name: "start",
        originalEvent: t
      });
    } else
      this._nulling();
  },
  _emulateDragOver: function() {
    if (ct) {
      this._lastX = ct.clientX, this._lastY = ct.clientY, li();
      for (var a = document.elementFromPoint(ct.clientX, ct.clientY), t = a; a && a.shadowRoot && (a = a.shadowRoot.elementFromPoint(ct.clientX, ct.clientY), a !== t); )
        t = a;
      if (ie.parentNode[at]._isOutsideThisEl(a), t)
        do {
          if (t[at]) {
            var l = void 0;
            if (l = t[at]._onDragOver({
              clientX: ct.clientX,
              clientY: ct.clientY,
              target: a,
              rootEl: t
            }), l && !this.options.dragoverBubble)
              break;
          }
          a = t;
        } while (t = Jo(t));
      oi();
    }
  },
  _onTouchMove: function(a) {
    if (qt) {
      var t = this.options, l = t.fallbackTolerance, o = t.fallbackOffset, r = a.touches ? a.touches[0] : a, v = we && na(we, !0), m = we && v && v.a, g = we && v && v.d, i = Fa && _e && yo(_e), c = (r.clientX - qt.clientX + o.x) / (m || 1) + (i ? i[0] - bl[0] : 0) / (m || 1), u = (r.clientY - qt.clientY + o.y) / (g || 1) + (i ? i[1] - bl[1] : 0) / (g || 1);
      if (!be.active && !ea) {
        if (l && Math.max(Math.abs(r.clientX - this._lastX), Math.abs(r.clientY - this._lastY)) < l)
          return;
        this._onDragStart(a, !0);
      }
      if (we) {
        v ? (v.e += c - (gl || 0), v.f += u - (hl || 0)) : v = {
          a: 1,
          b: 0,
          c: 0,
          d: 1,
          e: c,
          f: u
        };
        var C = "matrix(".concat(v.a, ",").concat(v.b, ",").concat(v.c, ",").concat(v.d, ",").concat(v.e, ",").concat(v.f, ")");
        he(we, "webkitTransform", C), he(we, "mozTransform", C), he(we, "msTransform", C), he(we, "transform", C), gl = c, hl = u, ct = r;
      }
      a.cancelable && a.preventDefault();
    }
  },
  _appendGhost: function() {
    if (!we) {
      var a = this.options.fallbackOnBody ? document.body : Ne, t = qe(ie, !0, Fa, !0, a), l = this.options;
      if (Fa) {
        for (_e = a; he(_e, "position") === "static" && he(_e, "transform") === "none" && _e !== document; )
          _e = _e.parentNode;
        _e !== document.body && _e !== document.documentElement ? (_e === document && (_e = yt()), t.top += _e.scrollTop, t.left += _e.scrollLeft) : _e = yt(), bl = yo(_e);
      }
      we = ie.cloneNode(!0), ot(we, l.ghostClass, !1), ot(we, l.fallbackClass, !0), ot(we, l.dragClass, !0), he(we, "transition", ""), he(we, "transform", ""), he(we, "box-sizing", "border-box"), he(we, "margin", 0), he(we, "top", t.top), he(we, "left", t.left), he(we, "width", t.width), he(we, "height", t.height), he(we, "opacity", "0.8"), he(we, "position", Fa ? "absolute" : "fixed"), he(we, "zIndex", "100000"), he(we, "pointerEvents", "none"), be.ghost = we, a.appendChild(we), he(we, "transform-origin", ko / parseInt(we.style.width) * 100 + "% " + wo / parseInt(we.style.height) * 100 + "%");
    }
  },
  _onDragStart: function(a, t) {
    var l = this, o = a.dataTransfer, r = l.options;
    if (tt("dragStart", this, {
      evt: a
    }), be.eventCanceled) {
      this._onDrop();
      return;
    }
    tt("setupClone", this), be.eventCanceled || (Fe = Qo(ie), Fe.removeAttribute("id"), Fe.draggable = !1, Fe.style["will-change"] = "", this._hideClone(), ot(Fe, this.options.chosenClass, !1), be.clone = Fe), l.cloneId = qa(function() {
      tt("clone", l), !be.eventCanceled && (l.options.removeCloneOnHide || Ne.insertBefore(Fe, ie), l._hideClone(), et({
        sortable: l,
        name: "clone"
      }));
    }), !t && ot(ie, r.dragClass, !0), t ? (Ya = !0, l._loopId = setInterval(l._emulateDragOver, 50)) : (Te(document, "mouseup", l._onDrop), Te(document, "touchend", l._onDrop), Te(document, "touchcancel", l._onDrop), o && (o.effectAllowed = "move", r.setData && r.setData.call(l, o, ie)), De(document, "drop", l), he(ie, "transform", "translateZ(0)")), ea = !0, l._dragStartId = qa(l._dragStarted.bind(l, t, a)), De(document, "selectstart", l), fa = !0, window.getSelection().removeAllRanges(), ba && he(document.body, "user-select", "none");
  },
  // Returns true - if no further action is needed (either inserted or another condition)
  _onDragOver: function(a) {
    var t = this.el, l = a.target, o, r, v, m = this.options, g = m.group, i = be.active, c = Na === g, u = m.sort, C = Ye || i, h, b = this, p = !1;
    if (Ul) return;
    function k(Ae, Ue) {
      tt(Ae, b, kt({
        evt: a,
        isOwner: c,
        axis: h ? "vertical" : "horizontal",
        revert: v,
        dragRect: o,
        targetRect: r,
        canSort: u,
        fromSortable: C,
        target: l,
        completed: V,
        onMove: function(B, N) {
          return La(Ne, t, ie, o, B, qe(B), a, N);
        },
        changed: A
      }, Ue));
    }
    function S() {
      k("dragOverAnimationCapture"), b.captureAnimationState(), b !== C && C.captureAnimationState();
    }
    function V(Ae) {
      return k("dragOverCompleted", {
        insertion: Ae
      }), Ae && (c ? i._hideClone() : i._showClone(b), b !== C && (ot(ie, Ye ? Ye.options.ghostClass : i.options.ghostClass, !1), ot(ie, m.ghostClass, !0)), Ye !== b && b !== be.active ? Ye = b : b === be.active && Ye && (Ye = null), C === b && (b._ignoreWhileAnimating = l), b.animateAll(function() {
        k("dragOverAnimationComplete"), b._ignoreWhileAnimating = null;
      }), b !== C && (C.animateAll(), C._ignoreWhileAnimating = null)), (l === ie && !ie.animated || l === t && !l.animated) && (_t = null), !m.dragoverBubble && !a.rootEl && l !== document && (ie.parentNode[at]._isOutsideThisEl(a.target), !Ae && Wt(a)), !m.dragoverBubble && a.stopPropagation && a.stopPropagation(), p = !0;
    }
    function A() {
      it = st(ie), At = st(ie, m.draggable), et({
        sortable: b,
        name: "change",
        toEl: t,
        newIndex: it,
        newDraggableIndex: At,
        originalEvent: a
      });
    }
    if (a.preventDefault !== void 0 && a.cancelable && a.preventDefault(), l = ft(l, m.draggable, t, !0), k("dragOver"), be.eventCanceled) return p;
    if (ie.contains(a.target) || l.animated && l.animatingX && l.animatingY || b._ignoreWhileAnimating === l)
      return V(!1);
    if (Ya = !1, i && !m.disabled && (c ? u || (v = Le !== Ne) : Ye === this || (this.lastPutMode = Na.checkPull(this, i, ie, a)) && g.checkPut(this, i, ie, a))) {
      if (h = this._getDirection(a, l) === "vertical", o = qe(ie), k("dragOverValid"), be.eventCanceled) return p;
      if (v)
        return Le = Ne, S(), this._hideClone(), k("revert"), be.eventCanceled || (Kt ? Ne.insertBefore(ie, Kt) : Ne.appendChild(ie)), V(!0);
      var E = Ql(t, m.draggable);
      if (!E || dr(a, h, this) && !E.animated) {
        if (E === ie)
          return V(!1);
        if (E && t === a.target && (l = E), l && (r = qe(l)), La(Ne, t, ie, o, l, r, a, !!l) !== !1)
          return S(), E && E.nextSibling ? t.insertBefore(ie, E.nextSibling) : t.appendChild(ie), Le = t, A(), V(!0);
      } else if (E && rr(a, h, this)) {
        var q = ra(t, 0, m, !0);
        if (q === ie)
          return V(!1);
        if (l = q, r = qe(l), La(Ne, t, ie, o, l, r, a, !1) !== !1)
          return S(), t.insertBefore(ie, q), Le = t, A(), V(!0);
      } else if (l.parentNode === t) {
        r = qe(l);
        var le = 0, Z, se = ie.parentNode !== t, ce = !lr(ie.animated && ie.toRect || o, l.animated && l.toRect || r, h), ve = h ? "top" : "left", me = bo(l, "top", "top") || bo(ie, "top", "top"), oe = me ? me.scrollTop : void 0;
        _t !== l && (Z = r[ve], $a = !1, Ma = !ce && m.invertSwap || se), le = ur(a, l, r, h, ce ? 1 : m.swapThreshold, m.invertedSwapThreshold == null ? m.swapThreshold : m.invertedSwapThreshold, Ma, _t === l);
        var R;
        if (le !== 0) {
          var te = st(ie);
          do
            te -= le, R = Le.children[te];
          while (R && (he(R, "display") === "none" || R === we));
        }
        if (le === 0 || R === l)
          return V(!1);
        _t = l, wa = le;
        var M = l.nextElementSibling, ae = !1;
        ae = le === 1;
        var ke = La(Ne, t, ie, o, l, r, a, ae);
        if (ke !== !1)
          return (ke === 1 || ke === -1) && (ae = ke === 1), Ul = !0, setTimeout(sr, 30), S(), ae && !M ? t.appendChild(ie) : l.parentNode.insertBefore(ie, ae ? M : l), me && Zo(me, 0, oe - me.scrollTop), Le = ie.parentNode, Z !== void 0 && !Ma && (ja = Math.abs(Z - qe(l)[ve])), A(), V(!0);
      }
      if (t.contains(ie))
        return V(!1);
    }
    return !1;
  },
  _ignoreWhileAnimating: null,
  _offMoveEvents: function() {
    Te(document, "mousemove", this._onTouchMove), Te(document, "touchmove", this._onTouchMove), Te(document, "pointermove", this._onTouchMove), Te(document, "dragover", Wt), Te(document, "mousemove", Wt), Te(document, "touchmove", Wt);
  },
  _offUpEvents: function() {
    var a = this.el.ownerDocument;
    Te(a, "mouseup", this._onDrop), Te(a, "touchend", this._onDrop), Te(a, "pointerup", this._onDrop), Te(a, "pointercancel", this._onDrop), Te(a, "touchcancel", this._onDrop), Te(document, "selectstart", this);
  },
  _onDrop: function(a) {
    var t = this.el, l = this.options;
    if (it = st(ie), At = st(ie, l.draggable), tt("drop", this, {
      evt: a
    }), Le = ie && ie.parentNode, it = st(ie), At = st(ie, l.draggable), be.eventCanceled) {
      this._nulling();
      return;
    }
    ea = !1, Ma = !1, $a = !1, clearInterval(this._loopId), clearTimeout(this._dragStartTimer), El(this.cloneId), El(this._dragStartId), this.nativeDraggable && (Te(document, "drop", this), Te(t, "dragstart", this._onDragStart)), this._offMoveEvents(), this._offUpEvents(), ba && he(document.body, "user-select", ""), he(ie, "transform", ""), a && (fa && (a.cancelable && a.preventDefault(), !l.dropBubble && a.stopPropagation()), we && we.parentNode && we.parentNode.removeChild(we), (Ne === Le || Ye && Ye.lastPutMode !== "clone") && Fe && Fe.parentNode && Fe.parentNode.removeChild(Fe), ie && (this.nativeDraggable && Te(ie, "dragend", this), yl(ie), ie.style["will-change"] = "", fa && !ea && ot(ie, Ye ? Ye.options.ghostClass : this.options.ghostClass, !1), ot(ie, this.options.chosenClass, !1), et({
      sortable: this,
      name: "unchoose",
      toEl: Le,
      newIndex: null,
      newDraggableIndex: null,
      originalEvent: a
    }), Ne !== Le ? (it >= 0 && (et({
      rootEl: Le,
      name: "add",
      toEl: Le,
      fromEl: Ne,
      originalEvent: a
    }), et({
      sortable: this,
      name: "remove",
      toEl: Le,
      originalEvent: a
    }), et({
      rootEl: Le,
      name: "sort",
      toEl: Le,
      fromEl: Ne,
      originalEvent: a
    }), et({
      sortable: this,
      name: "sort",
      toEl: Le,
      originalEvent: a
    })), Ye && Ye.save()) : it !== oa && it >= 0 && (et({
      sortable: this,
      name: "update",
      toEl: Le,
      originalEvent: a
    }), et({
      sortable: this,
      name: "sort",
      toEl: Le,
      originalEvent: a
    })), be.active && ((it == null || it === -1) && (it = oa, At = ka), et({
      sortable: this,
      name: "end",
      toEl: Le,
      originalEvent: a
    }), this.save()))), this._nulling();
  },
  _nulling: function() {
    tt("nulling", this), Ne = ie = Le = we = Kt = Fe = za = Ut = qt = ct = fa = it = At = oa = ka = _t = wa = Ye = Na = be.dragged = be.ghost = be.clone = be.active = null;
    var a = this.el;
    Za.forEach(function(t) {
      a.contains(t) && (t.checked = !0);
    }), Za.length = gl = hl = 0;
  },
  handleEvent: function(a) {
    switch (a.type) {
      case "drop":
      case "dragend":
        this._onDrop(a);
        break;
      case "dragenter":
      case "dragover":
        ie && (this._onDragOver(a), nr(a));
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
      t = l[o], ft(t, v.draggable, this.el, !1) && a.push(t.getAttribute(v.dataIdAttr) || vr(t));
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
      ft(m, this.options.draggable, o, !1) && (l[r] = m);
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
    return ft(a, t || this.options.draggable, this.el, !1);
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
    typeof o < "u" ? l[a] = o : l[a] = t, a === "group" && ai(l);
  },
  /**
   * Destroy
   */
  destroy: function() {
    tt("destroy", this);
    var a = this.el;
    a[at] = null, Te(a, "mousedown", this._onTapStart), Te(a, "touchstart", this._onTapStart), Te(a, "pointerdown", this._onTapStart), this.nativeDraggable && (Te(a, "dragover", this), Te(a, "dragenter", this)), Array.prototype.forEach.call(a.querySelectorAll("[draggable]"), function(t) {
      t.removeAttribute("draggable");
    }), this._onDrop(), this._disableDelayedDragEvents(), Xa.splice(Xa.indexOf(this.el), 1), this.el = a = null;
  },
  _hideClone: function() {
    if (!Ut) {
      if (tt("hideClone", this), be.eventCanceled) return;
      he(Fe, "display", "none"), this.options.removeCloneOnHide && Fe.parentNode && Fe.parentNode.removeChild(Fe), Ut = !0;
    }
  },
  _showClone: function(a) {
    if (a.lastPutMode !== "clone") {
      this._hideClone();
      return;
    }
    if (Ut) {
      if (tt("showClone", this), be.eventCanceled) return;
      ie.parentNode == Ne && !this.options.group.revertClone ? Ne.insertBefore(Fe, ie) : Kt ? Ne.insertBefore(Fe, Kt) : Ne.appendChild(Fe), this.options.group.revertClone && this.animate(ie, Fe), he(Fe, "display", ""), Ut = !1;
    }
  }
};
function nr(e) {
  e.dataTransfer && (e.dataTransfer.dropEffect = "move"), e.cancelable && e.preventDefault();
}
function La(e, a, t, l, o, r, v, m) {
  var g, i = e[at], c = i.options.onMove, u;
  return window.CustomEvent && !Tt && !Ia ? g = new CustomEvent("move", {
    bubbles: !0,
    cancelable: !0
  }) : (g = document.createEvent("Event"), g.initEvent("move", !0, !0)), g.to = a, g.from = e, g.dragged = t, g.draggedRect = l, g.related = o || a, g.relatedRect = r || qe(a), g.willInsertAfter = m, g.originalEvent = v, e.dispatchEvent(g), c && (u = c.call(i, g, v)), u;
}
function yl(e) {
  e.draggable = !1;
}
function sr() {
  Ul = !1;
}
function rr(e, a, t) {
  var l = qe(ra(t.el, 0, t.options, !0)), o = _o(t.el, t.options, we), r = 10;
  return a ? e.clientX < o.left - r || e.clientY < l.top && e.clientX < l.right : e.clientY < o.top - r || e.clientY < l.bottom && e.clientX < l.left;
}
function dr(e, a, t) {
  var l = qe(Ql(t.el, t.options.draggable)), o = _o(t.el, t.options, we), r = 10;
  return a ? e.clientX > o.right + r || e.clientY > l.bottom && e.clientX > l.left : e.clientY > o.bottom + r || e.clientX > l.right && e.clientY > l.top;
}
function ur(e, a, t, l, o, r, v, m) {
  var g = l ? e.clientY : e.clientX, i = l ? t.height : t.width, c = l ? t.top : t.left, u = l ? t.bottom : t.right, C = !1;
  if (!v) {
    if (m && ja < i * o) {
      if (!$a && (wa === 1 ? g > c + i * r / 2 : g < u - i * r / 2) && ($a = !0), $a)
        C = !0;
      else if (wa === 1 ? g < c + ja : g > u - ja)
        return -wa;
    } else if (g > c + i * (1 - o) / 2 && g < u - i * (1 - o) / 2)
      return cr(a);
  }
  return C = C || v, C && (g < c + i * r / 2 || g > u - i * r / 2) ? g > c + i / 2 ? 1 : -1 : 0;
}
function cr(e) {
  return st(ie) < st(e) ? 1 : -1;
}
function vr(e) {
  for (var a = e.tagName + e.className + e.src + e.href + e.textContent, t = a.length, l = 0; t--; )
    l += a.charCodeAt(t);
  return l.toString(36);
}
function fr(e) {
  Za.length = 0;
  for (var a = e.getElementsByTagName("input"), t = a.length; t--; ) {
    var l = a[t];
    l.checked && Za.push(l);
  }
}
function qa(e) {
  return setTimeout(e, 0);
}
function El(e) {
  return clearTimeout(e);
}
al && De(document, "touchmove", function(e) {
  (be.active || ea) && e.cancelable && e.preventDefault();
});
be.utils = {
  on: De,
  off: Te,
  css: he,
  find: Yo,
  is: function(a, t) {
    return !!ft(a, t, a, !1);
  },
  extend: Ys,
  throttle: Xo,
  closest: ft,
  toggleClass: ot,
  clone: Qo,
  index: st,
  nextTick: qa,
  cancelNextTick: El,
  detectDirection: ti,
  getChild: ra,
  expando: at
};
be.get = function(e) {
  return e[at];
};
be.mount = function() {
  for (var e = arguments.length, a = new Array(e), t = 0; t < e; t++)
    a[t] = arguments[t];
  a[0].constructor === Array && (a = a[0]), a.forEach(function(l) {
    if (!l.prototype || !l.prototype.constructor)
      throw "Sortable: Mounted plugin must be a constructor function, not ".concat({}.toString.call(l));
    l.utils && (be.utils = kt(kt({}, be.utils), l.utils)), Da.mount(l);
  });
};
be.create = function(e, a) {
  return new be(e, a);
};
be.version = Hs;
var ze = [], ma, Ol, Rl = !1, kl, wl, Qa, pa;
function mr() {
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
      this.sortable.nativeDraggable ? De(document, "dragover", this._handleAutoScroll) : this.options.supportPointer ? De(document, "pointermove", this._handleFallbackAutoScroll) : l.touches ? De(document, "touchmove", this._handleFallbackAutoScroll) : De(document, "mousemove", this._handleFallbackAutoScroll);
    },
    dragOverCompleted: function(t) {
      var l = t.originalEvent;
      !this.options.dragOverBubble && !l.rootEl && this._handleAutoScroll(l);
    },
    drop: function() {
      this.sortable.nativeDraggable ? Te(document, "dragover", this._handleAutoScroll) : (Te(document, "pointermove", this._handleFallbackAutoScroll), Te(document, "touchmove", this._handleFallbackAutoScroll), Te(document, "mousemove", this._handleFallbackAutoScroll)), Vo(), Wa(), Xs();
    },
    nulling: function() {
      Qa = Ol = ma = Rl = pa = kl = wl = null, ze.length = 0;
    },
    _handleFallbackAutoScroll: function(t) {
      this._handleAutoScroll(t, !0);
    },
    _handleAutoScroll: function(t, l) {
      var o = this, r = (t.touches ? t.touches[0] : t).clientX, v = (t.touches ? t.touches[0] : t).clientY, m = document.elementFromPoint(r, v);
      if (Qa = t, l || this.options.forceAutoScrollFallback || Ia || Tt || ba) {
        $l(t, this.options, m, l);
        var g = Ot(m, !0);
        Rl && (!pa || r !== kl || v !== wl) && (pa && Vo(), pa = setInterval(function() {
          var i = Ot(document.elementFromPoint(r, v), !0);
          i !== g && (g = i, Wa()), $l(t, o.options, i, l);
        }, 10), kl = r, wl = v);
      } else {
        if (!this.options.bubbleScroll || Ot(m, !0) === yt()) {
          Wa();
          return;
        }
        $l(t, this.options, Ot(m, !1), !1);
      }
    }
  }, St(e, {
    pluginName: "scroll",
    initializeByDefault: !0
  });
}
function Wa() {
  ze.forEach(function(e) {
    clearInterval(e.pid);
  }), ze = [];
}
function Vo() {
  clearInterval(pa);
}
var $l = Xo(function(e, a, t, l) {
  if (a.scroll) {
    var o = (e.touches ? e.touches[0] : e).clientX, r = (e.touches ? e.touches[0] : e).clientY, v = a.scrollSensitivity, m = a.scrollSpeed, g = yt(), i = !1, c;
    Ol !== t && (Ol = t, Wa(), ma = a.scroll, c = a.scrollFn, ma === !0 && (ma = Ot(t, !0)));
    var u = 0, C = ma;
    do {
      var h = C, b = qe(h), p = b.top, k = b.bottom, S = b.left, V = b.right, A = b.width, E = b.height, q = void 0, le = void 0, Z = h.scrollWidth, se = h.scrollHeight, ce = he(h), ve = h.scrollLeft, me = h.scrollTop;
      h === g ? (q = A < Z && (ce.overflowX === "auto" || ce.overflowX === "scroll" || ce.overflowX === "visible"), le = E < se && (ce.overflowY === "auto" || ce.overflowY === "scroll" || ce.overflowY === "visible")) : (q = A < Z && (ce.overflowX === "auto" || ce.overflowX === "scroll"), le = E < se && (ce.overflowY === "auto" || ce.overflowY === "scroll"));
      var oe = q && (Math.abs(V - o) <= v && ve + A < Z) - (Math.abs(S - o) <= v && !!ve), R = le && (Math.abs(k - r) <= v && me + E < se) - (Math.abs(p - r) <= v && !!me);
      if (!ze[u])
        for (var te = 0; te <= u; te++)
          ze[te] || (ze[te] = {});
      (ze[u].vx != oe || ze[u].vy != R || ze[u].el !== h) && (ze[u].el = h, ze[u].vx = oe, ze[u].vy = R, clearInterval(ze[u].pid), (oe != 0 || R != 0) && (i = !0, ze[u].pid = setInterval(function() {
        l && this.layer === 0 && be.active._onTouchMove(Qa);
        var M = ze[this.layer].vy ? ze[this.layer].vy * m : 0, ae = ze[this.layer].vx ? ze[this.layer].vx * m : 0;
        typeof c == "function" && c.call(be.dragged.parentNode[at], ae, M, e, Qa, ze[this.layer].el) !== "continue" || Zo(ze[this.layer].el, ae, M);
      }.bind({
        layer: u
      }), 24))), u++;
    } while (a.bubbleScroll && C !== g && (C = Ot(C, !1)));
    Rl = i;
  }
}, 30), ii = function(a) {
  var t = a.originalEvent, l = a.putSortable, o = a.dragEl, r = a.activeSortable, v = a.dispatchSortableEvent, m = a.hideGhostForTarget, g = a.unhideGhostForTarget;
  if (t) {
    var i = l || r;
    m();
    var c = t.changedTouches && t.changedTouches.length ? t.changedTouches[0] : t, u = document.elementFromPoint(c.clientX, c.clientY);
    g(), i && !i.el.contains(u) && (v("spill"), this.onSpill({
      dragEl: o,
      putSortable: l
    }));
  }
};
function _l() {
}
_l.prototype = {
  startIndex: null,
  dragStart: function(a) {
    var t = a.oldDraggableIndex;
    this.startIndex = t;
  },
  onSpill: function(a) {
    var t = a.dragEl, l = a.putSortable;
    this.sortable.captureAnimationState(), l && l.captureAnimationState();
    var o = ra(this.sortable.el, this.startIndex, this.options);
    o ? this.sortable.el.insertBefore(t, o) : this.sortable.el.appendChild(t), this.sortable.animateAll(), l && l.animateAll();
  },
  drop: ii
};
St(_l, {
  pluginName: "revertOnSpill"
});
function eo() {
}
eo.prototype = {
  onSpill: function(a) {
    var t = a.dragEl, l = a.putSortable, o = l || this.sortable;
    o.captureAnimationState(), t.parentNode && t.parentNode.removeChild(t), o.animateAll();
  },
  drop: ii
};
St(eo, {
  pluginName: "removeOnSpill"
});
be.mount(new mr());
be.mount(eo, _l);
function pr(e, a) {
  const t = e.oldDraggableIndex ?? e.oldIndex;
  e.item.remove();
  const l = [...e.from.children].filter((o) => o.matches(a));
  e.from.insertBefore(e.item, l[t ?? l.length] ?? null);
}
function ni(e) {
  const a = /* @__PURE__ */ new Map();
  function t(l) {
    a.get(l)?.destroy(), a.delete(l);
  }
  return wt(() => {
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
        onEnd(r) {
          const v = r.oldDraggableIndex, m = r.newDraggableIndex;
          pr(r, ".work-reorder-entry"), v !== void 0 && m !== void 0 && v !== m && e(v, m);
        }
      }));
    },
    unmounted: t
  };
}
const gr = { class: "work-stack work-tight work-option-builder" }, hr = { class: "work-stack work-tight" }, br = { class: "work-stack work-tight work-small" }, yr = { class: "work-stack work-tight work-small" }, kr = { class: "work-stack work-tight" }, wr = { class: "work-stack work-tight work-small" }, $r = { class: "work-row" }, Vr = { class: "work-stack work-tight work-small" }, xr = { class: "work-row" }, Cr = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, Sr = { class: "work-add-option" }, Tr = {
  key: 0,
  class: "work-muted work-small"
}, Ir = /* @__PURE__ */ ye({
  __name: "OptionsEditor",
  props: {
    field: {}
  },
  emits: ["validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = "options:" + gt(), r = F(() => t.field.options ?? []), v = F(() => r.value.every((u, C) => !!u.id && r.value.findIndex((h) => h.id === u.id) === C));
    Ve(v, (u) => l("validity", u, o), { immediate: !0 }), wt(() => l("validity", !0, o));
    function m(u, C) {
      Fo(r.value, u, C - u), r.value.forEach((h, b) => h.order = b);
    }
    const g = ni(m), i = ["primary", "success", "info", "warn", "danger", "secondary"];
    function c() {
      let u = r.value.length + 1;
      for (; r.value.some((C) => C.id === `option_${u}`); ) u++;
      (t.field.options ??= []).push({ id: `option_${u}`, label: "New option", order: r.value.length });
    }
    return (u, C) => (n(), f("section", gr, [
      C[4] || (C[4] = s("header", { class: "work-row" }, [
        s("h4", null, "Options"),
        s("span", { class: "work-muted work-small" }, "Renaming a choice keeps it selected on existing items."),
        s("span", { class: "work-spacer" })
      ], -1)),
      vt((n(), f("div", hr, [
        (n(!0), f(_, null, ue(r.value, (h, b) => (n(), f("div", {
          key: b,
          class: "work-option-row work-reorder-entry"
        }, [
          y(d(Q), {
            type: "button",
            class: "work-icon-button work-reorder-handle",
            "aria-label": "Drag option; arrow keys reorder",
            onKeydown: [
              je(Pe((p) => m(b, b - 1), ["prevent"]), ["up"]),
              je(Pe((p) => m(b, b + 1), ["prevent"]), ["down"])
            ],
            severity: "secondary",
            text: "",
            size: "small"
          }, {
            default: j(() => [
              y(d(fe), {
                icon: "tabler:grip-vertical",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["onKeydown"]),
          s("label", br, [
            C[0] || (C[0] = W("Label", -1)),
            y(d(Ie), {
              modelValue: h.label,
              "onUpdate:modelValue": (p) => h.label = p,
              "aria-label": "Option label"
            }, null, 8, ["modelValue", "onUpdate:modelValue"])
          ]),
          y(Me, {
            class: "work-disclosure",
            label: "Advanced"
          }, {
            default: j(() => [
              s("label", yr, [
                C[1] || (C[1] = W("Integration identifier", -1)),
                y(d(Ie), {
                  modelValue: h.id,
                  "onUpdate:modelValue": (p) => h.id = p,
                  class: "work-option-code",
                  required: "",
                  "aria-label": "Option ID"
                }, null, 8, ["modelValue", "onUpdate:modelValue"])
              ])
            ]),
            _: 2
          }, 1024),
          s("div", kr, [
            s("label", wr, [
              C[2] || (C[2] = W("Color", -1)),
              s("span", $r, [
                s("span", {
                  class: dt(["work-color-swatch", "work-swatch-" + (h.color || "secondary")]),
                  "aria-hidden": "true"
                }, null, 2),
                y(d(pe), {
                  modelValue: h.color,
                  "onUpdate:modelValue": (p) => h.color = p,
                  "aria-label": "Option color",
                  appendTo: "self",
                  optionLabel: "label",
                  optionValue: "value",
                  optionDisabled: "disabled",
                  options: [{ label: "Default", value: void 0, disabled: !1 }, ...(i ?? []).map((p) => ({ label: p, value: p, disabled: !1 }))]
                }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
              ])
            ]),
            s("label", Vr, [
              C[3] || (C[3] = W("Category", -1)),
              y(d(pe), {
                "model-value": h.category,
                "aria-label": "Option category",
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                showClear: "",
                options: ["triage", "backlog", ...d(Mo)].map((p) => ({ label: d(Nt)(p), value: p })),
                "onUpdate:modelValue": (p) => h.category = p || void 0
              }, null, 8, ["model-value", "options", "onUpdate:modelValue"])
            ])
          ]),
          s("div", xr, [
            y(d(Q), {
              "aria-label": "Option earlier",
              severity: "secondary",
              size: "small",
              disabled: b === 0,
              onClick: (p) => m(b, b - 1),
              text: ""
            }, {
              default: j(() => [
                y(d(fe), {
                  icon: "tabler:arrow-up",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["disabled", "onClick"]),
            y(d(Q), {
              "aria-label": "Option later",
              severity: "secondary",
              size: "small",
              disabled: b === r.value.length - 1,
              onClick: (p) => m(b, b + 1),
              text: ""
            }, {
              default: j(() => [
                y(d(fe), {
                  icon: "tabler:arrow-down",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["disabled", "onClick"]),
            y(d(Q), {
              label: "Remove",
              "aria-label": "Remove option",
              severity: "secondary",
              text: "",
              size: "small",
              onClick: (p) => r.value.splice(b, 1)
            }, {
              icon: j(() => [
                y(d(fe), {
                  icon: "tabler:trash",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["onClick"])
          ])
        ]))), 128)),
        v.value ? I("", !0) : (n(), f("p", Cr, "Each choice needs a unique integration identifier.")),
        s("div", Sr, [
          y(d(Q), {
            label: "Add option",
            severity: "secondary",
            size: "small",
            onClick: c,
            outlined: ""
          }, {
            icon: j(() => [
              y(d(fe), {
                icon: "tabler:plus",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          })
        ])
      ])), [
        [d(g)]
      ]),
      r.value.length ? I("", !0) : (n(), f("p", Tr, "Add the choices people can select for this field."))
    ]));
  }
}), Dr = {
  class: "work-stack",
  "aria-label": "Fields editor"
}, Ar = { class: "work-form-actions work-wrap" }, Ur = { class: "work-stack work-tight" }, Er = {
  key: 0,
  class: "work-settings-card work-muted"
}, Or = { class: "work-muted work-small" }, Rr = {
  key: 0,
  class: "work-error work-small",
  role: "alert"
}, Pr = { class: "work-settings-grid work-field-properties" }, Nr = { class: "work-stack work-tight" }, Mr = { class: "work-stack work-tight" }, Fr = { class: "work-stack work-tight" }, Lr = {
  key: 1,
  class: "work-stack work-tight"
}, Br = ["schema", "config", "onConfigChanged", "onValidityChanged", "onVnodeBeforeUnmount"], zr = {
  key: 1,
  role: "alert",
  class: "kx-err"
}, jr = {
  key: 2,
  role: "status",
  class: "work-muted work-small"
}, qr = {
  key: 4,
  class: "work-stack work-tight"
}, Wr = {
  key: 5,
  class: "work-stack work-tight"
}, Gr = { class: "work-stack work-tight" }, Kr = { class: "work-stack work-tight" }, Hr = { class: "work-stack work-tight" }, Jr = { class: "work-stack work-tight" }, Yr = { class: "work-stack" }, Xr = { class: "work-stack work-tight" }, Zr = { class: "work-stack work-tight" }, Qr = { class: "work-stack work-tight work-field-history" }, _r = { class: "work-settings-list" }, ed = { class: "work-settings-row" }, td = { class: "work-settings-row" }, ad = { class: "work-stack" }, ld = /* @__PURE__ */ ye({
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
    const t = e, l = a, o = F(() => t.draft.fields ?? []), r = z("text"), v = z([]), m = F(() => (t.draft.item_types ?? []).map((K) => ({ value: K.id, label: K.title || Oe(K.id) }))), g = F(() => t.draft.item_types?.find((K) => K.id === t.itemType)), i = F(() => o.value.map((K, B) => ({ field: K, index: B })).filter(({ field: K }) => !g.value || g.value.fields.includes(K.code))), c = z(""), u = z({}), C = ni((K, B) => {
      const N = i.value[K]?.index, w = i.value[B]?.index;
      N !== void 0 && w !== void 0 && M(N, w - N);
    });
    function h(K) {
      return (t.draft.item_types ?? []).filter((B) => B.fields.includes(K)).map((B) => B.title || Oe(B.id));
    }
    async function b(K) {
      if (!c.value) {
        c.value = K.code;
        try {
          const B = await t.guardRemoval?.("fields", K.code);
          u.value[K.code] = B ?? "", B || Ta(t.draft, "fields", K.code);
        } finally {
          c.value = "";
        }
      }
    }
    const p = Object.entries({ text: "Text", int: "Whole number", dec: "Decimal number", quantity: "Measurement", bool: "Yes or no", time: "Date or time", ref: "Reference", record: "Structured data", option: "Choice", principal: "Person or group", item: "Work item", rank: "Order", rich_text: "Formatted text", formula: "Formula", rollup: "Related item calculation", counter: "Counter" }).map(([K, B]) => ({ value: K, label: B })), k = [{ label: "None", value: "none" }, { label: "Exact matches", value: "key" }, { label: "Numeric ranges", value: "number" }], S = ["int", "dec", "quantity"], V = F(() => new Map(t.installedTypes?.map((K) => [K.id, K]))), A = F(() => [...p, ...(t.installedTypes ?? []).map((K) => ({ value: K.id, label: K.title }))]), E = {}, q = Po("wc-schema-form");
    Ve(() => o.value.some((K) => se(K)), (K) => {
      K && q.load();
    }, { immediate: !0 });
    function le(K) {
      return K.type && K.type !== "value" ? K.type : K.form ?? "text";
    }
    function Z(K) {
      return K.type ? V.value.get(K.type) : void 0;
    }
    function se(K) {
      const B = Z(K)?.config_schema;
      return B && Wl(B).length ? B : void 0;
    }
    function ce(K) {
      const B = Z(K);
      return !!B?.config_schema || ["dec", "quantity", "ref", "time", "record"].includes(B?.form ?? K.form ?? "") || !!K.config;
    }
    function ve(K) {
      const B = Z(K), N = B?.form ?? K.form ?? "text";
      return k.filter(({ value: w }) => w === "none" || (!B?.indexes || B.indexes.includes(w)) && N !== "record" && (w !== "number" || S.includes(N) || K.type === "option"));
    }
    function me(K) {
      K.index && !ve(K).some((B) => B.value === K.index) && delete K.index;
    }
    function oe(K, B) {
      const N = V.value.get(B);
      if (N) {
        if (N.id === K.type) return;
        K.type = N.id, K.form = N.form, delete K.options, delete K.config, me(K);
        return;
      }
      Z(K) && delete K.config;
      const w = { option: "text", principal: "ref", item: "ref", rank: "text", rich_text: "text", formula: "int", rollup: "int", counter: "int" };
      w[B] ? (K.type = B, K.form = w[B]) : (delete K.type, K.form = B), B !== "option" ? delete K.options : K.options ??= [], B === "rich_text" && (K.config = { format: "json" }), me(K);
    }
    function R(K, B) {
      K.form = B, me(K);
    }
    function te(K, B) {
      const N = { ...K.config };
      B ? N.item_type = B : delete N.item_type, K.config = Object.keys(N).length ? N : void 0;
    }
    function M(K, B) {
      Fo(o.value, K, B);
      for (const N of t.draft.item_types ?? []) {
        const w = new Set(N.fields);
        N.fields = o.value.filter((x) => w.has(x.code)).map((x) => x.code);
      }
    }
    function ae(K, B) {
      try {
        Pi(t.draft, K, B.value), delete u.value[K.code];
      } catch (N) {
        u.value[K.code] = N.message, B.value = K.code;
      }
    }
    function ke() {
      r.value = "text", v.value = g.value ? [g.value.id] : [];
    }
    function Ae(K) {
      const B = K.normalize("NFKD").replace(/\p{Mark}/gu, "").toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, ""), N = (/^[a-z]/.test(B) ? B : `field_${B || "new"}`).slice(0, 40);
      let w = N, x = 2;
      for (; o.value.some((O) => O.code === w); ) {
        const O = "_" + x++;
        w = N.slice(0, 40 - O.length) + O;
      }
      const P = { code: w, title: K, form: "text", cardinality: "one" };
      oe(P, r.value), (t.draft.fields ??= []).push(P);
      for (const O of t.draft.item_types ?? []) v.value.includes(O.id) && O.fields.push(w);
      g.value && !v.value.includes(g.value.id) && l("update:itemType", ""), Ue.value = w, l("created");
    }
    const Ue = z("");
    return (K, B) => (n(), f("section", Dr, [
      s("div", Ar, [
        y(d(pe), {
          "model-value": g.value?.id ?? "",
          "aria-label": "Filter fields by item type",
          placeholder: "All item types",
          appendTo: "self",
          optionLabel: "label",
          optionValue: "value",
          options: [{ value: "", label: "All item types" }, ...m.value],
          "onUpdate:modelValue": B[0] || (B[0] = (N) => l("update:itemType", N))
        }, null, 8, ["model-value", "options"]),
        y(Ca, {
          action: "Add field",
          label: "Field name",
          maxlength: 255,
          regular: "",
          "open-on-entry": e.createForItemType,
          onOpen: ke,
          onAdd: Ae,
          onCancel: B[3] || (B[3] = (N) => l("cancel-creation"))
        }, {
          default: j(() => [
            s("label", Ur, [
              B[6] || (B[6] = W("Kind", -1)),
              y(d(pe), {
                modelValue: r.value,
                "onUpdate:modelValue": B[1] || (B[1] = (N) => r.value = N),
                "aria-label": "New field kind",
                appendTo: "self",
                options: A.value,
                optionLabel: "label",
                optionValue: "value"
              }, null, 8, ["modelValue", "options"])
            ]),
            m.value.length ? (n(), J(pt, {
              key: 0,
              label: "Show on item types",
              options: m.value,
              modelValue: v.value,
              "onUpdate:modelValue": B[2] || (B[2] = (N) => v.value = N)
            }, null, 8, ["options", "modelValue"])) : I("", !0)
          ]),
          _: 1
        }, 8, ["open-on-entry"])
      ]),
      i.value.length ? I("", !0) : (n(), f("p", Er, "No fields here yet. Add a field to capture information.")),
      vt((n(), J(Jl, {
        columns: "fields",
        count: i.value.length
      }, {
        default: j(() => [
          (n(!0), f(_, null, ue(i.value, ({ field: N, index: w }) => (n(), J(Hl, {
            "route-section": "fields",
            "route-id": N.code,
            title: d(He)(N),
            "initial-open": Ue.value === N.code,
            kind: Z(N)?.title || d(p).find((x) => x.value === le(N))?.label || d(Oe)(le(N)),
            key: N.id ?? w,
            class: "work-field-row work-reorder-entry work-stack"
          }, {
            handle: j(() => [
              y(d(Q), {
                type: "button",
                class: "work-reorder-handle work-icon-button",
                "aria-label": "Drag " + d(He)(N) + " or use the arrow keys to reorder",
                onKeydown: [
                  je(Pe((x) => M(w, -1), ["prevent"]), ["up"]),
                  je(Pe((x) => M(w, 1), ["prevent"]), ["down"])
                ],
                severity: "secondary",
                text: "",
                size: "small"
              }, {
                default: j(() => [
                  y(d(fe), {
                    icon: "tabler:grip-vertical",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["aria-label", "onKeydown"])
            ]),
            flags: j(() => [
              N.track ? (n(), J(d(Xe), {
                key: 0,
                class: "kx-tag-sm",
                severity: "secondary",
                value: "Tracked"
              })) : I("", !0),
              N.intervals ? (n(), J(d(Xe), {
                key: 1,
                class: "kx-tag-sm",
                severity: "secondary",
                value: "Intervals"
              })) : I("", !0)
            ]),
            usage: j(() => [
              s("span", Or, D(h(N.code).length ? h(N.code).join(", ") : "Unused"), 1)
            ]),
            actions: j(() => [
              y(d(Q), {
                "aria-label": "Move " + d(He)(N) + " earlier",
                severity: "secondary",
                disabled: w === 0,
                onClick: (x) => M(w, -1),
                text: "",
                size: "small"
              }, {
                default: j(() => [
                  y(d(fe), {
                    icon: "tabler:arrow-up",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["aria-label", "disabled", "onClick"]),
              y(d(Q), {
                "aria-label": "Move " + d(He)(N) + " later",
                severity: "secondary",
                disabled: w === o.value.length - 1,
                onClick: (x) => M(w, 1),
                text: "",
                size: "small"
              }, {
                default: j(() => [
                  y(d(fe), {
                    icon: "tabler:arrow-down",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["aria-label", "disabled", "onClick"])
            ]),
            default: j(() => [
              u.value[N.code] ? (n(), f("p", Rr, D(u.value[N.code]), 1)) : I("", !0),
              (n(!0), f(_, null, ue(e.issues?.filter((x) => x.code === N.code) ?? [], (x) => (n(), f("p", {
                key: x.what,
                class: "work-error work-small",
                role: "alert"
              }, D(d(el)(x)), 1))), 128)),
              s("div", Pr, [
                s("label", Nr, [
                  B[7] || (B[7] = W("Title", -1)),
                  y(d(Ie), {
                    modelValue: N.title,
                    "onUpdate:modelValue": (x) => N.title = x,
                    "aria-label": "Field title",
                    maxlength: "255",
                    placeholder: d(He)(N)
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder"])
                ]),
                s("label", Mr, [
                  B[8] || (B[8] = W("Kind", -1)),
                  y(d(pe), {
                    "aria-label": "Kind",
                    "model-value": le(N),
                    "onUpdate:modelValue": (x) => oe(N, x),
                    appendTo: "self",
                    options: A.value,
                    optionLabel: "label",
                    optionValue: "value"
                  }, null, 8, ["model-value", "onUpdate:modelValue", "options"])
                ]),
                s("label", Fr, [
                  B[9] || (B[9] = W("Values allowed", -1)),
                  y(d(pe), {
                    "aria-label": "Values allowed",
                    "model-value": N.cardinality ?? "one",
                    "onUpdate:modelValue": (x) => N.cardinality = x,
                    appendTo: "self",
                    options: [{ label: "One value", value: "one" }, { label: "Multiple unique values", value: "set" }, { label: "Ordered values", value: "list" }],
                    optionLabel: "label",
                    optionValue: "value"
                  }, null, 8, ["model-value", "onUpdate:modelValue"])
                ])
              ]),
              N.type === "item" ? (n(), f("label", Lr, [
                B[10] || (B[10] = W("Which items can be referenced? ", -1)),
                y(d(pe), {
                  "model-value": N.config?.item_type ?? "",
                  "aria-label": "Reference target",
                  appendTo: "self",
                  optionLabel: "label",
                  optionValue: "value",
                  options: [{ value: "", label: "Any item type" }, ...m.value],
                  "onUpdate:modelValue": (x) => te(N, x)
                }, null, 8, ["model-value", "options", "onUpdate:modelValue"]),
                B[11] || (B[11] = s("span", { class: "work-muted work-small" }, "A reference stores the selected item as a value. To show a named relationship on both items, use Links.", -1))
              ])) : I("", !0),
              se(N) ? (n(), f(_, { key: 2 }, [
                d(q).state.value === "ready" ? (n(), f("wc-schema-form", {
                  key: N.type,
                  class: "work-config-widget",
                  schema: JSON.stringify(se(N)),
                  config: JSON.stringify(N.config ?? E),
                  onConfigChanged: (x) => N.config = d(Ka)(x),
                  onValidityChanged: (x) => l("validity", "config-" + w, d(Ka)(x).valid),
                  onVnodeBeforeUnmount: (x) => l("validity", "config-" + w, !0)
                }, null, 40, Br)) : d(q).state.value === "failed" ? (n(), f("p", zr, [
                  B[12] || (B[12] = W("The configuration form is unavailable. ", -1)),
                  y(d(Q), {
                    label: "Reload configuration form",
                    severity: "secondary",
                    outlined: "",
                    size: "small",
                    onClick: B[4] || (B[4] = (x) => d(q).load())
                  })
                ])) : (n(), f("p", jr, "The configuration form is loading."))
              ], 64)) : I("", !0),
              N.type === "option" ? (n(), J(Ir, {
                key: 3,
                field: N,
                onValidity: B[5] || (B[5] = (x, P) => l("validity", P, x))
              }, null, 8, ["field"])) : I("", !0),
              N.type === "formula" || N.type === "rollup" ? (n(), f("label", qr, [
                B[13] || (B[13] = W("Result type", -1)),
                y(d(pe), {
                  "model-value": N.form,
                  "onUpdate:modelValue": (x) => R(N, x),
                  "aria-label": "Result type",
                  options: d(p).slice(0, 8),
                  optionLabel: "label",
                  optionValue: "value",
                  appendTo: "self"
                }, null, 8, ["model-value", "onUpdate:modelValue", "options"])
              ])) : I("", !0),
              N.type === "formula" ? (n(), f("label", Wr, [
                B[14] || (B[14] = W("Expression", -1)),
                y(d(Ie), {
                  modelValue: N.expression,
                  "onUpdate:modelValue": (x) => N.expression = x,
                  "aria-label": "Expression"
                }, null, 8, ["modelValue", "onUpdate:modelValue"])
              ])) : I("", !0),
              N.type === "rollup" ? (n(), f(_, { key: 6 }, [
                s("label", Gr, [
                  B[15] || (B[15] = W("Of", -1)),
                  y(d(Ie), {
                    modelValue: N.of,
                    "onUpdate:modelValue": (x) => N.of = x,
                    "aria-label": "Related items"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                s("label", Kr, [
                  B[16] || (B[16] = W("Function", -1)),
                  y(d(Ie), {
                    modelValue: N.fn,
                    "onUpdate:modelValue": (x) => N.fn = x,
                    "aria-label": "Calculation"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                s("label", Hr, [
                  B[17] || (B[17] = W("Field", -1)),
                  y(d(Ie), {
                    modelValue: N.field,
                    "onUpdate:modelValue": (x) => N.field = x,
                    "aria-label": "Calculated field"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                s("label", Jr, [
                  B[18] || (B[18] = W("Order by", -1)),
                  y(d(pe), {
                    "model-value": N.by,
                    "aria-label": "Rollup order",
                    options: ["rank", "time"],
                    showClear: "",
                    appendTo: "self",
                    "onUpdate:modelValue": (x) => N.by = x || void 0
                  }, null, 8, ["model-value", "onUpdate:modelValue"])
                ]),
                y(Yl, {
                  modelValue: N.where,
                  "onUpdate:modelValue": (x) => N.where = x,
                  draft: e.draft,
                  "board-id": e.boardId,
                  label: "Include related items when",
                  onValidity: (x) => l("validity", "rollup-" + w, x)
                }, null, 8, ["modelValue", "onUpdate:modelValue", "draft", "board-id", "onValidity"])
              ], 64)) : I("", !0),
              y(Me, {
                class: "work-disclosure",
                label: "Advanced field settings"
              }, {
                default: j(() => [
                  s("div", Yr, [
                    s("label", Xr, [
                      B[19] || (B[19] = W("Field identifier for integrations", -1)),
                      y(d(Ie), {
                        value: N.code,
                        "aria-label": "Field code",
                        required: "",
                        pattern: "[a-z][a-z0-9_]*",
                        onInput: (x) => ae(N, x.target)
                      }, null, 8, ["value", "onInput"])
                    ]),
                    s("label", Zr, [
                      B[20] || (B[20] = W("Allow filters to use", -1)),
                      y(d(pe), {
                        "aria-label": "Allow filters to use",
                        "model-value": N.index ?? "none",
                        "onUpdate:modelValue": (x) => N.index = x,
                        appendTo: "self",
                        options: ve(N),
                        optionLabel: "label",
                        optionValue: "value"
                      }, null, 8, ["model-value", "onUpdate:modelValue", "options"])
                    ]),
                    s("section", Qr, [
                      B[23] || (B[23] = s("h4", { class: "work-group-title" }, "History", -1)),
                      s("div", _r, [
                        s("div", ed, [
                          B[21] || (B[21] = s("div", { class: "work-row-main" }, [
                            s("strong", null, "Track changes"),
                            s("p", { class: "work-muted work-small" }, "Record each value change in the item history.")
                          ], -1)),
                          y(d(lt), {
                            modelValue: N.track,
                            "onUpdate:modelValue": (x) => N.track = x,
                            "aria-label": "Track changes"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        s("div", td, [
                          B[22] || (B[22] = s("div", { class: "work-row-main" }, [
                            s("strong", null, "Track intervals"),
                            s("p", { class: "work-muted work-small" }, "Measure how long each value stays in effect.")
                          ], -1)),
                          y(d(lt), {
                            modelValue: N.intervals,
                            "onUpdate:modelValue": (x) => N.intervals = x,
                            "aria-label": "Track intervals"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ])
                      ])
                    ]),
                    !se(N) && ce(N) ? (n(), J(Mt, {
                      key: 0,
                      label: "Field configuration",
                      "model-value": N.config,
                      shape: "object",
                      "onUpdate:modelValue": (x) => N.config = x,
                      onValidity: (x) => l("validity", "config-" + w, x)
                    }, null, 8, ["model-value", "onUpdate:modelValue", "onValidity"])) : I("", !0),
                    s("section", ad, [
                      B[24] || (B[24] = s("h4", { class: "work-group-title" }, "Access", -1)),
                      (n(), f(_, null, ue(["read", "write"], (x) => y(Go, {
                        "board-id": e.boardId,
                        key: x,
                        label: x === "read" ? "Who can read" : "Who can edit",
                        "model-value": N.access?.[x],
                        "onUpdate:modelValue": (P) => N.access = { ...N.access, [x]: P },
                        onValidity: (P) => l("validity", "access-" + w + x, P)
                      }, null, 8, ["board-id", "label", "model-value", "onUpdate:modelValue", "onValidity"])), 64))
                    ]),
                    y(d(Q), {
                      label: "Remove field",
                      severity: "danger",
                      text: "",
                      disabled: !!c.value,
                      onClick: (x) => b(N)
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
        [d(C)]
      ])
    ]));
  }
}), od = {
  class: "work-stack",
  "aria-label": "Item types editor"
}, id = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, nd = { class: "work-definition-meta" }, sd = { class: "work-settings-grid" }, rd = { class: "work-stack work-tight" }, dd = { class: "work-stack work-tight" }, ud = {
  key: 0,
  class: "work-stack work-tight"
}, cd = { key: 1 }, vd = { class: "work-stack work-tight" }, fd = { class: "work-stack" }, md = { class: "work-stack work-tight" }, pd = {
  key: 0,
  class: "work-row work-wrap"
}, gd = { class: "work-stack work-tight" }, hd = {
  key: 1,
  class: "work-stack work-tight work-small"
}, bd = {
  key: 0,
  class: "kx-empty"
}, yd = /* @__PURE__ */ ye({
  __name: "TypesEditor",
  props: {
    draft: {},
    guardRemoval: { type: Function },
    issues: {}
  },
  emits: ["create-field", "create-workflow"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = F(() => t.draft.item_types ?? []), r = z(""), v = z(""), m = z("");
    function g(k) {
      const S = k.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, ""), V = /^[a-z]/.test(S) ? S : "type_" + (S || "new");
      let A = V.slice(0, 40), E = 2;
      for (; o.value.some((q) => q.id === A); ) {
        const q = "_" + E++;
        A = V.slice(0, 40 - q.length) + q;
      }
      return A;
    }
    function i(k) {
      const S = g(k);
      (t.draft.item_types ??= []).push({ id: S, title: k, process: t.draft.processes?.[0]?.id ?? "", fields: [] }), r.value = S;
    }
    function c(k, S) {
      const V = k.id;
      k.id = S;
      for (const A of o.value) A.parent_types && (A.parent_types = A.parent_types.map((E) => E === V ? S : E));
    }
    function u(k, S) {
      k.fields = S, k.inherit && (k.inherit = k.inherit.filter((V) => S.includes(V)));
    }
    function C(k) {
      return (k.parent_types ?? []).filter((S) => typeof S == "string");
    }
    function h(k, S, V) {
      k.parent_types = V && S.length ? [...S, !1] : S;
    }
    function b(k) {
      return o.value.filter((S) => S.id !== k.id && S.parent_types?.includes(k.id)).map((S) => S.title || Oe(S.id));
    }
    async function p(k) {
      if (!m.value) {
        if (b(k).length) {
          v.value = `${k.title || Oe(k.id)} is a parent type for ${b(k).join(", ")}. Remove those parent selections first.`;
          return;
        }
        m.value = k.id, v.value = "";
        try {
          const S = await t.guardRemoval?.("item_types", k.id);
          S ? v.value = S : Ta(t.draft, "item_types", k.id);
        } finally {
          m.value = "";
        }
      }
    }
    return (k, S) => (n(), f("section", od, [
      v.value ? (n(), f("p", id, D(v.value), 1)) : I("", !0),
      y(Jl, {
        columns: "types",
        count: o.value.length
      }, {
        default: j(() => [
          (n(!0), f(_, null, ue(o.value, (V, A) => (n(), J(Hl, {
            "route-section": "items",
            "route-id": V.id,
            "initial-open": r.value === V.id,
            title: V.title || d(Oe)(V.id),
            "kind-label": "Workflow",
            kind: e.draft.processes?.find((E) => E.id === V.process)?.name || d(Oe)(V.process),
            key: A,
            class: "work-type-card"
          }, {
            usage: j(() => [
              s("span", nd, [
                y(d(Xe), {
                  class: "kx-tag-sm",
                  severity: "secondary"
                }, {
                  default: j(() => [
                    W(D(V.fields.length) + " " + D(V.fields.length === 1 ? "field" : "fields"), 1)
                  ]),
                  _: 2
                }, 1024),
                b(V).length ? (n(), J(d(Xe), {
                  key: 0,
                  class: "kx-tag-sm",
                  severity: "secondary"
                }, {
                  default: j(() => [
                    W("Parent of " + D(b(V).join(", ")), 1)
                  ]),
                  _: 2
                }, 1024)) : I("", !0)
              ])
            ]),
            default: j(() => [
              (n(!0), f(_, null, ue(e.issues?.filter((E) => E.code === "item_type " + V.id) ?? [], (E) => (n(), f("p", {
                key: E.what,
                class: "work-error work-small",
                role: "alert"
              }, D(d(el)(E)), 1))), 128)),
              s("div", sd, [
                s("label", rd, [
                  S[0] || (S[0] = W("Title", -1)),
                  y(d(Ie), {
                    modelValue: V.title,
                    "onUpdate:modelValue": (E) => V.title = E,
                    placeholder: d(Oe)(V.id)
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder"])
                ]),
                s("div", dd, [
                  e.draft.processes?.length ? (n(), f("label", ud, [
                    S[1] || (S[1] = W(" Workflow ", -1)),
                    y(d(pe), {
                      modelValue: V.process,
                      "onUpdate:modelValue": (E) => V.process = E,
                      "aria-label": "Workflow",
                      required: "",
                      appendTo: "self",
                      optionLabel: "label",
                      optionValue: "value",
                      options: e.draft.processes.map((E) => ({ label: E.name || d(Oe)(E.id), value: E.id }))
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                  ])) : (n(), f("span", cd, "Workflow")),
                  s("div", null, [
                    y(d(Q), {
                      label: "Create a workflow",
                      type: "button",
                      text: "",
                      size: "small",
                      onClick: (E) => l("create-workflow", V, E)
                    }, null, 8, ["onClick"])
                  ])
                ])
              ]),
              s("div", vd, [
                y(pt, {
                  label: "Fields",
                  options: (e.draft.fields ?? []).map((E) => ({ value: E.code, label: d(He)(E) })),
                  "model-value": V.fields,
                  "onUpdate:modelValue": (E) => u(V, E)
                }, null, 8, ["options", "model-value", "onUpdate:modelValue"]),
                s("div", null, [
                  y(d(Q), {
                    label: "Create a field",
                    type: "button",
                    text: "",
                    size: "small",
                    onClick: (E) => l("create-field", V, E)
                  }, null, 8, ["onClick"])
                ])
              ]),
              y(Me, {
                class: "work-disclosure",
                label: "Advanced item type settings"
              }, {
                default: j(() => [
                  s("div", fd, [
                    s("label", md, [
                      S[2] || (S[2] = W("Identifier", -1)),
                      y(d(Ie), {
                        value: V.id,
                        onChange: (E) => c(V, E.target.value),
                        required: "",
                        pattern: "[a-z][a-z0-9_]*"
                      }, null, 8, ["value", "onChange"])
                    ]),
                    S[6] || (S[6] = W()),
                    y(pt, {
                      label: "Parent types",
                      options: o.value.map((E) => ({ value: E.id, label: E.title || d(Oe)(E.id) })),
                      "model-value": C(V),
                      "onUpdate:modelValue": (E) => h(V, E, !!V.parent_types?.includes(!1))
                    }, null, 8, ["options", "model-value", "onUpdate:modelValue"]),
                    C(V).length ? (n(), f("label", pd, [
                      y(d(lt), {
                        "model-value": !!V.parent_types?.includes(!1),
                        "aria-label": "Allow top-level items",
                        "onUpdate:modelValue": (E) => h(V, C(V), E)
                      }, null, 8, ["model-value", "onUpdate:modelValue"]),
                      S[3] || (S[3] = W("Allow top-level items", -1))
                    ])) : I("", !0),
                    s("div", gd, [
                      y(pt, {
                        label: "Inherit from parent",
                        options: V.fields.map((E) => ({ value: E, label: d(He)(e.draft.fields?.find((q) => q.code === E) ?? { code: E }) })),
                        modelValue: V.inherit,
                        "onUpdate:modelValue": (E) => V.inherit = E
                      }, null, 8, ["options", "modelValue", "onUpdate:modelValue"]),
                      S[4] || (S[4] = s("p", { class: "work-muted work-small" }, "These fields resolve from the parent when this item has no own value.", -1))
                    ]),
                    C(V).length ? (n(), f("label", hd, [
                      S[5] || (S[5] = W("When the parent moves", -1)),
                      y(d(pe), {
                        modelValue: V.move_children,
                        "onUpdate:modelValue": (E) => V.move_children = E,
                        "aria-label": "When the parent moves",
                        appendTo: "self",
                        optionLabel: "label",
                        optionValue: "value",
                        optionDisabled: "disabled",
                        options: [{ label: "Default", value: void 0, disabled: !1 }, { label: "Move children", value: "move", disabled: !1 }, { label: "Refuse while children exist", value: "refuse", disabled: !1 }]
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ])) : I("", !0),
                    y(d(Q), {
                      label: "Remove type",
                      severity: "danger",
                      text: "",
                      disabled: !!m.value,
                      onClick: (E) => p(V)
                    }, null, 8, ["disabled", "onClick"])
                  ])
                ]),
                _: 2
              }, 1024)
            ]),
            _: 2
          }, 1032, ["route-id", "initial-open", "title", "kind"]))), 128)),
          o.value.length ? I("", !0) : (n(), f("p", bd, "Add a type for the work people create, such as a delivery task or customer request.")),
          y(Ca, {
            action: "Add item type",
            label: "Item type name",
            onAdd: i
          })
        ]),
        _: 1
      }, 8, ["count"])
    ]));
  }
}), kd = ".work-process-canvas>svg{height:480px;width:100%}.work-process-canvas:focus-visible{outline:var(--p-focus-ring-width) var(--p-focus-ring-style) var(--p-focus-ring-color);outline-offset:var(--p-focus-ring-offset)}.work-state-card{fill:var(--p-content-background);stroke:var(--p-content-border-color);stroke-width:1.5}.work-graph-node.work-selected .work-state-card{stroke:var(--p-primary-color);stroke-width:2.5;fill:color-mix(in srgb,var(--p-primary-color) 6%,var(--p-content-background))}.work-graph-node:focus-visible .work-state-card{stroke:var(--p-focus-ring-color);stroke-width:var(--p-focus-ring-width)}.work-process-canvas .work-edge-label{font-size:12px;fill:var(--p-text-color)}.work-process-canvas .work-edge-label-bg{fill:var(--p-content-background);stroke:var(--p-content-border-color);stroke-width:1}.work-edge-line{stroke:var(--p-primary-color);stroke-width:1.5}.work-edge-return .work-edge-line{stroke:var(--p-text-muted-color);stroke-dasharray:5 4}.work-graph-arrow{fill:context-stroke}.work-lane-line{fill:none;stroke:var(--p-text-muted-color);stroke-width:1.5;stroke-dasharray:2 4}.work-node-connector{fill:var(--p-content-background);stroke:var(--p-primary-color);stroke-width:1.5}.work-node-connector:hover,.work-node-connector:focus-visible,.work-node-connector[aria-pressed=true]{fill:var(--p-primary-color)}.work-any-transition:focus-visible text,.work-any-transition[aria-pressed=true] text{fill:var(--p-primary-color);text-decoration:underline}.work-process-legend{position:static;flex-wrap:wrap;padding:10px 16px;border-top:1px solid var(--p-content-border-color);background:var(--p-content-background)}@media(max-width:700px){.work-process-canvas>svg{height:420px}}.work-process-more{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:8px;padding:8px 16px;border-top:1px solid var(--p-content-border-color);background:var(--p-content-background);color:var(--p-text-muted-color);font-size:12px}.work-process-canvas .work-graph-edge.work-selected .work-edge-label-bg{fill:var(--p-primary-color);stroke:var(--p-primary-color)}.work-process-canvas .work-graph-edge.work-selected .work-edge-label{fill:var(--p-primary-contrast-color)}", xo = /* @__PURE__ */ new WeakSet();
function wd(e) {
  const a = e.getRootNode();
  if (a instanceof ShadowRoot && !xo.has(a)) {
    const t = e.ownerDocument.createElement("style");
    t.textContent = kd, a.append(t), xo.add(a);
  }
}
const si = 0.8;
function $d(e, a, t) {
  const l = Math.min(1, a.width / e.width, a.height / e.height);
  if (l >= si) return { zoom: l, pan: { x: (e.width - a.width / l) / 2, y: (e.height - a.height / l) / 2 } };
  const o = e.nodes.find((v) => v.state.id === t) ?? e.nodes[0], r = Math.min(1, a.width / ((o?.width ?? 190) + 64));
  return { zoom: r, pan: o ? { x: e.direction === "TB" ? o.x - a.width / r / 2 : o.x - o.width / 2 - 32, y: e.direction === "TB" ? o.y - o.height / 2 - 32 : o.y - a.height / r / 2 } : { x: 0, y: 0 } };
}
const Vd = ["onKeydown"], xd = {
  key: 0,
  class: "work-process-instruction",
  role: "status"
}, Cd = ["viewBox"], Sd = ["id"], Td = ["d", "marker-end"], Id = ["aria-label", "aria-pressed", "aria-keyshortcuts", "onKeydown", "onFocus", "onClick"], Dd = ["d"], Ad = ["d", "marker-end"], Ud = ["x", "y", "width", "height"], Ed = ["x", "y"], Od = ["x", "dy"], Rd = ["aria-label", "aria-pressed", "onClick", "onKeydown", "onFocus", "onPointerup"], Pd = ["x", "y", "width", "height"], Nd = ["cx", "cy"], Md = ["x", "y"], Fd = ["x", "dy"], Ld = ["x", "y"], Bd = ["x", "dy"], zd = {
  key: 0,
  class: "work-limit-text"
}, jd = ["aria-label", "aria-pressed", "aria-keyshortcuts", "onFocus", "onKeydown", "onClick"], qd = ["x", "y"], Wd = ["x", "dy"], Gd = ["cx", "cy", "aria-label", "aria-pressed", "onFocus", "onPointerdown", "onClick", "onKeydown"], Kd = ["d"], Hd = {
  key: 1,
  class: "work-process-more",
  role: "status"
}, Jd = { class: "work-process-legend" }, Yd = /* @__PURE__ */ ye({
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
    const l = e, o = t, r = gt().replace(/:/g, "_"), v = z(""), m = z(), g = z();
    let i;
    const c = z(900), u = z(!1), C = F(() => c.value < 700 ? 420 : 480), h = F(() => an(l.process, l.draft, {
      width: c.value,
      height: C.value,
      direction: l.fitOnOpen ? "TB" : void 0
    })), b = z(1), p = z({ x: 0, y: 0 }), k = z({ x: 0, y: 0 }), S = F(() => {
      const $ = Math.min(1, c.value / h.value.width);
      return l.fitOnOpen ? Math.max(si, $) : $;
    }), V = F(() => ({
      width: c.value,
      height: u.value ? Math.max(C.value, Math.ceil(h.value.height * S.value)) : C.value
    })), A = F(() => h.value.nodes.filter(($) => $.x - $.width / 2 >= p.value.x && $.x + $.width / 2 <= p.value.x + V.value.width / b.value && $.y - $.height / 2 >= p.value.y && $.y + $.height / 2 <= p.value.y + V.value.height / b.value).length);
    function E() {
      u.value = !1;
      const $ = $d(h.value, V.value, l.process.initial);
      b.value = $.zoom, p.value = $.pan;
    }
    const q = F(() => `${p.value.x} ${p.value.y} ${V.value.width / b.value} ${V.value.height / b.value}`), le = F(() => h.value.nodes.find(($) => $.state.id === v.value));
    function Z() {
      u.value = !0, b.value = S.value;
      const $ = V.value.width / b.value, G = h.value.nodes.find((T) => T.state.id === l.process.initial);
      p.value = {
        x: h.value.width > $ && G ? G.x - $ / 2 : (h.value.width - $) / 2,
        y: 0
      };
    }
    function se($) {
      l.fitOnOpen && (u.value = !1);
      const G = Math.max(0.02, Math.min(3, b.value * $)), T = 1 / b.value - 1 / G;
      p.value = { x: p.value.x + V.value.width * T / 2, y: p.value.y + V.value.height * T / 2 }, b.value = G;
    }
    function ce($) {
      const G = V.value.width / b.value, T = V.value.height / b.value;
      ($.x - $.width / 2 < p.value.x || $.x + $.width / 2 > p.value.x + G || $.y - $.height / 2 < p.value.y || $.y + $.height / 2 > p.value.y + T) && (p.value = { x: $.x - G / 2, y: $.y - T / 2 });
    }
    function ve() {
      const $ = h.value.nodes.find((G) => G.state === l.selectedState) ?? h.value.edges.find((G) => G.transition === l.selectedTransition);
      if (!$) {
        l.fitOnOpen && u.value && Z();
        return;
      }
      ce($);
    }
    Ve([h, () => l.selectedState, () => l.selectedTransition], ve, { flush: "post" });
    function me() {
      l.fitOnOpen ? Z() : E();
    }
    Ve(() => l.process.id, () => {
      Ue(), me();
    }, { flush: "post" });
    function oe($) {
      if ($.target !== m.value) return;
      ($.key === "+" || $.key === "=") && ($.preventDefault(), se(1.2)), $.key === "-" && ($.preventDefault(), se(1 / 1.2)), $.key === "0" && ($.preventDefault(), Z());
      const G = 60 / b.value;
      $.key.startsWith("Arrow") && ($.preventDefault(), p.value = { x: p.value.x + ($.key === "ArrowRight" ? G : $.key === "ArrowLeft" ? -G : 0), y: p.value.y + ($.key === "ArrowDown" ? G : $.key === "ArrowUp" ? -G : 0) });
    }
    function R($, G) {
      const T = G.currentTarget;
      if (!v.value) o("state", $, T);
      else if (v.value !== $.id) {
        const X = v.value;
        v.value = "", o("connect", X, $.id, T);
      }
    }
    function te($) {
      v.value = $.state.id, k.value = { x: h.value.direction === "TB" ? $.x : $.x + $.width / 2, y: h.value.direction === "TB" ? $.y + $.height / 2 : $.y };
    }
    function M($, G) {
      if ($.pointerType === "touch" || $.button !== 0) return;
      i = $.pointerId, te(G);
      const T = $.currentTarget;
      T.hasPointerCapture?.($.pointerId) && T.releasePointerCapture($.pointerId);
    }
    function ae($, G) {
      i === $.pointerId && (i = void 0, !(!v.value || v.value === G.id) && R(G, $));
    }
    function ke($, G) {
      if (($.key === "Enter" || $.key === " ") && ($.preventDefault(), R(G, $)), ["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp"].includes($.key)) {
        $.preventDefault();
        const T = Array.from(g.value?.querySelectorAll(".work-graph-node") ?? []), X = h.value.nodes.findIndex(($e) => $e.state === G), de = ["ArrowRight", "ArrowDown"].includes($.key) ? 1 : -1;
        T[(X + de + T.length) % T.length]?.focus();
      }
    }
    function Ae($, G) {
      l.selectedTransition === G && o("removeTransition", $);
    }
    function Ue() {
      v.value = "", i = void 0, B.clear(), N = 0;
    }
    function K() {
      Ue(), o("clear");
    }
    const B = /* @__PURE__ */ new Map();
    let N = 0;
    function w($) {
      if (!$.target.closest('[role="button"]') && (B.set($.pointerId, { x: $.clientX, y: $.clientY }), m.value?.setPointerCapture?.($.pointerId), B.size === 2)) {
        const [G, T] = [...B.values()];
        N = Math.hypot(G.x - T.x, G.y - T.y);
      }
    }
    function x($) {
      const G = g.value?.getBoundingClientRect();
      if (!G?.width) return;
      if (i === $.pointerId && v.value) {
        k.value = { x: p.value.x + ($.clientX - G.left) * V.value.width / b.value / G.width, y: p.value.y + ($.clientY - G.top) * V.value.height / b.value / G.height };
        return;
      }
      const T = B.get($.pointerId);
      if (T)
        if (B.set($.pointerId, { x: $.clientX, y: $.clientY }), B.size === 2) {
          const [X, de] = [...B.values()], $e = Math.hypot(X.x - de.x, X.y - de.y);
          N && se($e / N), N = $e;
        } else p.value = { x: p.value.x - ($.clientX - T.x) * V.value.width / b.value / G.width, y: p.value.y - ($.clientY - T.y) * V.value.height / b.value / G.height };
    }
    function P($) {
      i === $.pointerId && (v.value = "", i = void 0);
    }
    function O($) {
      B.delete($.pointerId), N = 0, P($);
    }
    function H($) {
      $.ctrlKey && ($.preventDefault(), se(Math.exp(-$.deltaY * 0.01)));
    }
    let ne;
    Sa(() => {
      if (m.value && wd(m.value), typeof ResizeObserver < "u" && g.value) {
        let $ = !0;
        ne = new ResizeObserver(() => {
          const G = g.value?.getBoundingClientRect();
          if (!G?.width || !G.height) return;
          const T = V.value.width;
          c.value = G.width, ($ || Math.abs(G.width - T) > 1) && ($ ? me() : u.value ? Z() : E(), $ = !1), ve();
        }), ne.observe(g.value);
      }
    }), wt(() => ne?.disconnect()), a({ fit: Z, focus: () => m.value?.focus(), zoomIn: () => se(1.2), zoomOut: () => se(1 / 1.2) });
    function U($) {
      return $.category === "completed" ? "check" : $.category === "canceled" ? "x" : $.id === l.process.initial ? "arrow-bar-to-right" : { gate: "shield-check", automated: "bolt", parallel: "arrows-split" }[$.kind ?? ""] ?? "user";
    }
    return ($, G) => (n(), f("section", {
      ref_key: "canvas",
      ref: m,
      class: dt(["work-process-canvas", { "work-process-scrollable": e.fitOnOpen && u.value }]),
      "aria-label": "Process map",
      tabindex: "0",
      onKeydown: [
        oe,
        je(Pe(K, ["stop"]), ["esc"])
      ],
      onPointerdown: w,
      onPointermove: x,
      onPointerup: O,
      onPointerleave: P,
      onPointercancel: Ue,
      onWheel: H
    }, [
      v.value ? (n(), f("p", xd, "Choose the next stop. Escape cancels.")) : I("", !0),
      (n(), f("svg", {
        ref_key: "svg",
        ref: g,
        style: Vi({ height: V.value.height + "px" }),
        viewBox: q.value,
        role: "group",
        "aria-label": "States and transitions"
      }, [
        s("defs", null, [
          s("marker", {
            id: d(r) + "-arrow",
            viewBox: "0 0 8 8",
            refX: "7",
            refY: "4",
            markerWidth: "6",
            markerHeight: "6",
            orient: "auto"
          }, [...G[1] || (G[1] = [
            s("path", {
              d: "M0 0 L8 4 L0 8 z",
              class: "work-graph-arrow"
            }, null, -1)
          ])], 8, Sd)
        ]),
        (n(!0), f(_, null, ue(h.value.parallels, (T) => (n(), f("path", {
          key: T.key,
          d: T.path,
          class: "work-lane-line",
          "marker-end": `url(#${d(r)}-arrow)`
        }, [
          s("title", null, "Parallel lane from " + D(d(ge)(T.state)), 1)
        ], 8, Td))), 128)),
        (n(!0), f(_, null, ue(h.value.edges, (T) => (n(), f("g", {
          key: T.key,
          class: dt(["work-graph-edge", ["work-edge-" + T.type, { "work-selected": e.selectedTransition === T.transition }]]),
          role: "button",
          tabindex: "0",
          "aria-label": "Edit transition " + d(Ge)(T.transition),
          "aria-pressed": e.selectedTransition === T.transition,
          "aria-keyshortcuts": e.selectedTransition === T.transition ? "Delete Backspace" : void 0,
          onKeydown: [
            je((X) => Ae(X, T.transition), ["delete"]),
            je((X) => Ae(X, T.transition), ["backspace"]),
            je(Pe((X) => o("transition", T.transition, X.currentTarget), ["prevent"]), ["enter"]),
            je(Pe((X) => o("transition", T.transition, X.currentTarget), ["prevent"]), ["space"])
          ],
          onFocus: (X) => ce(T),
          onClick: (X) => o("transition", T.transition, X.currentTarget)
        }, [
          s("path", {
            d: T.path,
            class: "work-edge-hit"
          }, null, 8, Dd),
          s("path", {
            d: T.path,
            class: "work-edge-line",
            "marker-end": `url(#${d(r)}-arrow)`
          }, null, 8, Ad),
          s("rect", {
            x: T.x - T.width / 2,
            y: T.y - T.height / 2,
            width: T.width,
            height: T.height,
            rx: "6",
            class: "work-edge-label-bg"
          }, null, 8, Ud),
          s("text", {
            x: T.x,
            y: T.y - (T.lines.length - 1) * 8 + 4,
            class: "work-edge-label",
            "text-anchor": "middle"
          }, [
            (n(!0), f(_, null, ue(T.lines, (X, de) => (n(), f("tspan", {
              key: de,
              x: T.x,
              dy: de ? 16 : 0
            }, D(X), 9, Od))), 128))
          ], 8, Ed)
        ], 42, Id))), 128)),
        (n(!0), f(_, null, ue(h.value.nodes, (T) => (n(), f("g", {
          key: T.state.id,
          class: dt(["work-graph-node", ["work-stop-" + T.state.category, { "work-selected": e.selectedState === T.state }]]),
          role: "button",
          tabindex: "0",
          "aria-label": "Edit state " + d(ge)(T.state),
          "aria-pressed": e.selectedState === T.state,
          onClick: (X) => R(T.state, X),
          onKeydown: (X) => ke(X, T.state),
          onFocus: (X) => ce(T),
          onPointerup: (X) => ae(X, T.state)
        }, [
          s("rect", {
            x: T.x - T.width / 2,
            y: T.y - T.height / 2,
            width: T.width,
            height: T.height,
            rx: "10",
            class: "work-state-card"
          }, null, 8, Pd),
          s("circle", {
            cx: T.x - T.width / 2 + 22,
            cy: T.y - T.height / 2 + 25,
            r: "10",
            class: "work-stop-ring"
          }, null, 8, Nd),
          y(d(fe), {
            icon: "tabler:" + U(T.state),
            x: T.x - T.width / 2 + 15,
            y: T.y - T.height / 2 + 18,
            width: "14",
            height: "14",
            class: "work-stop-icon",
            "aria-hidden": "true"
          }, null, 8, ["icon", "x", "y"]),
          s("text", {
            x: T.x - T.width / 2 + 42,
            y: T.y - T.height / 2 + 29,
            class: "work-node-name"
          }, [
            (n(!0), f(_, null, ue(T.title, (X, de) => (n(), f("tspan", {
              key: de,
              x: T.x - T.width / 2 + 42,
              dy: de ? 18 : 0
            }, D(X), 9, Fd))), 128))
          ], 8, Md),
          s("text", {
            x: T.x - T.width / 2 + 16,
            y: T.y - T.height / 2 + 33 + T.title.length * 18,
            class: "work-node-meta"
          }, [
            (n(!0), f(_, null, ue(T.caption, (X, de) => (n(), f("tspan", {
              key: de,
              x: T.x - T.width / 2 + 16,
              dy: de ? 16 : 0
            }, D(X), 9, Bd))), 128)),
            e.draft.policy?.wip?.[T.state.id] ? (n(), f("tspan", zd, " · limit " + D(e.draft.policy.wip[T.state.id].limit), 1)) : I("", !0)
          ], 8, Ld),
          (n(!0), f(_, null, ue(T.badges, (X, de) => (n(), f("g", {
            key: X.id,
            class: "work-any-transition",
            role: "button",
            tabindex: "0",
            "aria-label": "Edit transition " + d(Ge)(X),
            "aria-pressed": e.selectedTransition === X,
            "aria-keyshortcuts": e.selectedTransition === X ? "Delete Backspace" : void 0,
            onFocus: ($e) => ce(T),
            onKeydown: [
              je(($e) => Ae($e, X), ["delete"]),
              je(($e) => Ae($e, X), ["backspace"]),
              je(Pe(($e) => o("transition", X, $e.currentTarget), ["stop", "prevent"]), ["enter"]),
              je(Pe(($e) => o("transition", X, $e.currentTarget), ["stop", "prevent"]), ["space"])
            ],
            onClick: Pe(($e) => o("transition", X, $e.currentTarget), ["stop"])
          }, [
            s("text", {
              x: T.x - T.width / 2 + 16,
              y: T.y - T.height / 2 + 33 + T.title.length * 18 + T.caption.length * 16 + T.badges.slice(0, de).reduce(($e, Ce) => $e + d(la)(d(Ge)(Ce) + " works from any state").length * 18, 0),
              class: "work-node-meta"
            }, [
              (n(!0), f(_, null, ue(d(la)(d(Ge)(X) + " works from any state"), ($e, Ce) => (n(), f("tspan", {
                key: Ce,
                x: T.x - T.width / 2 + 16,
                dy: Ce ? 18 : 0
              }, D($e), 9, Wd))), 128))
            ], 8, qd)
          ], 40, jd))), 128)),
          ["completed", "canceled"].includes(T.state.category) ? I("", !0) : (n(), f("circle", {
            key: 0,
            cx: h.value.direction === "TB" ? T.x : T.x + T.width / 2,
            cy: h.value.direction === "TB" ? T.y + T.height / 2 : T.y,
            r: "9",
            class: "work-node-connector",
            role: "button",
            tabindex: "0",
            "aria-label": "Connect from " + d(ge)(T.state),
            "aria-pressed": v.value === T.state.id,
            onFocus: (X) => ce(T),
            onPointerdown: Pe((X) => M(X, T), ["stop"]),
            onClick: Pe((X) => te(T), ["stop"]),
            onKeydown: [
              je(Pe((X) => te(T), ["stop", "prevent"]), ["enter"]),
              je(Pe((X) => te(T), ["stop", "prevent"]), ["space"])
            ]
          }, null, 40, Gd))
        ], 42, Rd))), 128)),
        le.value ? (n(), f("path", {
          key: 0,
          d: `M ${h.value.direction === "TB" ? le.value.x : le.value.x + le.value.width / 2} ${h.value.direction === "TB" ? le.value.y + le.value.height / 2 : le.value.y} L ${k.value.x} ${k.value.y}`,
          class: "work-connect-ghost"
        }, null, 8, Kd)) : I("", !0)
      ], 12, Cd)),
      A.value < e.process.states.length ? (n(), f("div", Hd, [
        s("span", null, D(A.value) + " of " + D(e.process.states.length) + " states in view · Pan to see more", 1),
        u.value ? I("", !0) : (n(), J(d(Q), {
          key: 0,
          label: "Fit map",
          size: "small",
          text: "",
          onClick: G[0] || (G[0] = (T) => Z())
        }))
      ])) : I("", !0),
      s("div", Jd, [
        s("span", null, D(e.process.states.length) + " states · " + D(Math.round(b.value * 100)) + "%", 1),
        G[2] || (G[2] = s("span", null, [
          s("i"),
          W("Transition")
        ], -1)),
        G[3] || (G[3] = s("span", null, [
          s("i", { class: "work-return-key" }),
          W("Return / loop")
        ], -1)),
        G[4] || (G[4] = s("span", null, "Drag to pan · Ctrl + scroll to zoom · Fit to reset the view", -1))
      ])
    ], 42, Vd));
  }
}), Pl = new Intl.ListFormat("en", { type: "conjunction" }), Xd = new Intl.ListFormat("en", { type: "disjunction" }), Zd = {
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
}, Qd = { some: "At least one", every: "Every", none: "No" };
function Nl(e, a) {
  const t = a.fields?.find((l) => l.code === e);
  return t ? He(t) : Oe(e);
}
function Ml(e, a, t) {
  return Array.isArray(e) ? Pl.format(e.map((l) => Ml(l, a, t))) : a === "category" && typeof e == "string" ? Nt(e) : a === "state" && typeof e == "string" ? t.processes?.flatMap((l) => l.states).find((l) => l.id === e)?.name || Oe(e) : "$actor" in nt(e) ? "the person moving the item" : "$now" in nt(e) ? "the current time" : Gt(e, t.fields?.find((l) => l.code === a));
}
function _d(e) {
  const a = nt(e.where);
  if (!(e.rel !== "blocks" || e.dir !== "inward" || a.field !== "category" || a.op !== "nin" || !Array.isArray(a.value) || a.value.length !== 2 || !a.value.includes("completed") || !a.value.includes("canceled"))) {
    if (e.q === "none") return "Requires all blockers to be resolved.";
    if (e.q === "some") return "Requires an open blocker.";
  }
}
function Ga(e, a) {
  const t = nt(e), l = (r) => r.map((v) => Ga(v, a)), o = a.relation_types?.find((r) => r.id === t.rel);
  if (Array.isArray(t.and) && t.and.length) return `(${Pl.format(l(t.and))})`;
  if (Array.isArray(t.or) && t.or.length) return `(${Xd.format(l(t.or))})`;
  if (t.not) return `this condition is false (${Ga(t.not, a)})`;
  if (typeof t.match == "string" && t.match.trim()) return `the item matches “${t.match}”`;
  if (typeof t.rel == "string" || t.children) {
    const r = t.dir === "inward" && !o?.symmetric ? o?.inward : o?.outward, v = t.children ? "child item" : `item linked as “${r || Oe(String(t.rel))}”`;
    return `${Qd[String(t.q)] ?? "At least one"} ${v} matches (${Ga(t.where, a)})`;
  }
  if (t.history) {
    const r = nt(t.history);
    if (typeof r.field != "string") return "a value history condition";
    const v = Nl(r.field, a), m = (i) => Ml(i, String(r.field), a), g = Array.isArray(r.during) ? ` during ${Pl.format(r.during.map((i) => String(i)))}` : "";
    if (r.changed === !0) {
      const i = r.from === void 0 ? "" : ` from ${m(r.from)}`, c = r.to === void 0 ? "" : ` to ${m(r.to)}`;
      return `${v} changed${i}${c}${g}`;
    }
    return r.was !== void 0 ? `${v} was ${m(r.was)}${g}` : `a change in the history of ${v}${g}`;
  }
  if (typeof t.field == "string") {
    const r = Nl(t.field, a);
    if (t.op === "is_null") return `${r} is ${t.value === !1 ? "filled" : "empty"}`;
    if (t.op === "is_state") {
      const m = { absent: "has never been filled", cleared: "was cleared", provided: "has a value" }[String(t.value)];
      if (m) return `${r} ${m}`;
    }
    const v = Zd[String(t.op)];
    return v && t.value !== void 0 ? `${r} ${v} ${Ml(t.value, t.field, a)}` : `a condition on ${r}`;
  }
  return "a custom condition";
}
function eu(e, a, t, l = []) {
  const o = [], r = a.states.find((m) => m.id === e.to), v = [.../* @__PURE__ */ new Set([...e.require ?? [], ...r?.require ?? []])];
  v.length && o.push(`Required: ${v.map((m) => Nl(m, t)).join(", ")}`), e.when != null && o.push(_d(nt(e.when)) ?? `Only when ${Ga(e.when, t)}`);
  for (const m of e.guards ?? []) {
    const g = l.find((i) => i.id === m);
    o.push(g ? `Requires the “${g.title}” check to pass` : "Requires an unavailable check to pass");
  }
  return o;
}
const tu = {
  key: 0,
  class: "work-stack work-tight work-muted work-small"
}, ri = /* @__PURE__ */ ye({
  __name: "TransitionRules",
  props: {
    transition: {},
    process: {},
    draft: {},
    guards: {}
  },
  setup(e) {
    const a = e, t = F(() => eu(a.transition, a.process, a.draft, a.guards));
    return (l, o) => t.value.length ? (n(), f("div", tu, [
      (n(!0), f(_, null, ue(t.value, (r, v) => (n(), f("p", { key: v }, D(r), 1))), 128))
    ])) : I("", !0);
  }
}), au = {
  class: "work-process-list work-stack",
  "aria-label": "Process list"
}, lu = { class: "work-table-scroll" }, ou = {
  class: "work-settings-table work-process-table",
  role: "table",
  "aria-label": "States"
}, iu = { role: "rowgroup" }, nu = ["aria-selected"], su = { role: "cell" }, ru = {
  key: 0,
  class: "work-muted work-small"
}, du = { role: "cell" }, uu = { role: "cell" }, cu = {
  role: "cell",
  class: "work-process-list-actions"
}, vu = { class: "work-table-scroll" }, fu = {
  class: "work-settings-table work-process-table",
  role: "table",
  "aria-label": "Transitions"
}, mu = { role: "rowgroup" }, pu = ["aria-selected"], gu = { role: "cell" }, hu = { role: "cell" }, bu = { role: "cell" }, yu = {
  role: "cell",
  class: "work-process-list-actions"
}, ku = /* @__PURE__ */ ye({
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
    return (a, t) => (n(), f("section", au, [
      t[6] || (t[6] = s("h3", null, "States", -1)),
      s("div", lu, [
        s("table", ou, [
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
          s("tbody", iu, [
            (n(!0), f(_, null, ue(e.process.states, (l) => (n(), f("tr", {
              key: l.id,
              "aria-selected": e.selectedState === l,
              role: "row"
            }, [
              s("td", su, [
                y(d(Ie), {
                  modelValue: l.name,
                  "onUpdate:modelValue": (o) => l.name = o,
                  "aria-label": "Name of " + d(ge)(l)
                }, null, 8, ["modelValue", "onUpdate:modelValue", "aria-label"]),
                e.counts ? (n(), f("p", ru, D(e.counts[l.id] ?? 0) + " here", 1)) : I("", !0)
              ]),
              s("td", du, [
                t[0] || (t[0] = s("span", {
                  class: "work-process-cell-label",
                  "aria-hidden": "true"
                }, "Phase", -1)),
                W(D(d(Nt)(l.category)), 1)
              ]),
              s("td", uu, [
                t[1] || (t[1] = s("span", {
                  class: "work-process-cell-label",
                  "aria-hidden": "true"
                }, "Kind", -1)),
                y(d(Xe), { severity: "secondary" }, {
                  default: j(() => [
                    W(D(d(Ha)(l.kind)), 1)
                  ]),
                  _: 2
                }, 1024)
              ]),
              s("td", cu, [
                y(d(Q), {
                  size: "small",
                  text: "",
                  severity: "secondary",
                  "aria-label": "Edit state " + d(ge)(l),
                  onClick: (o) => a.$emit("state", l, o.currentTarget)
                }, {
                  default: j(() => [
                    y(d(fe), { icon: "tabler:pencil" })
                  ]),
                  _: 1
                }, 8, ["aria-label", "onClick"]),
                y(d(Q), {
                  size: "small",
                  text: "",
                  severity: "danger",
                  "aria-label": "Remove state " + d(ge)(l),
                  onClick: (o) => a.$emit("removeState", l)
                }, {
                  default: j(() => [
                    y(d(fe), { icon: "tabler:trash" })
                  ]),
                  _: 1
                }, 8, ["aria-label", "onClick"])
              ])
            ], 8, nu))), 128))
          ])
        ])
      ]),
      t[7] || (t[7] = s("h3", null, "Transitions", -1)),
      s("div", vu, [
        s("table", fu, [
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
          s("tbody", mu, [
            (n(!0), f(_, null, ue(e.process.transitions ?? [], (l) => (n(), f("tr", {
              key: l.id,
              "aria-selected": e.selectedTransition === l,
              role: "row"
            }, [
              s("td", gu, [
                y(d(Ie), {
                  modelValue: l.name,
                  "onUpdate:modelValue": (o) => l.name = o,
                  placeholder: d(Ge)(l),
                  "aria-label": "Name of " + d(Ge)(l)
                }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder", "aria-label"]),
                y(ri, {
                  transition: l,
                  process: e.process,
                  draft: e.draft,
                  guards: e.guards
                }, null, 8, ["transition", "process", "draft", "guards"])
              ]),
              s("td", hu, [
                t[3] || (t[3] = s("span", {
                  class: "work-process-cell-label",
                  "aria-hidden": "true"
                }, "From", -1)),
                W(" " + D(l.from === "any" ? "Any state" : l.from.map((o) => d(ge)(e.process.states.find((r) => r.id === o))).join(", ")), 1)
              ]),
              s("td", bu, [
                t[4] || (t[4] = s("span", {
                  class: "work-process-cell-label",
                  "aria-hidden": "true"
                }, "To", -1)),
                W(D(d(ge)(e.process.states.find((o) => o.id === l.to))), 1)
              ]),
              s("td", yu, [
                y(d(Q), {
                  size: "small",
                  text: "",
                  severity: "secondary",
                  "aria-label": "Edit transition " + d(Ge)(l),
                  onClick: (o) => a.$emit("transition", l, o.currentTarget)
                }, {
                  default: j(() => [
                    y(d(fe), { icon: "tabler:pencil" })
                  ]),
                  _: 1
                }, 8, ["aria-label", "onClick"]),
                y(d(Q), {
                  size: "small",
                  text: "",
                  severity: "danger",
                  "aria-label": "Remove transition " + d(Ge)(l),
                  onClick: (o) => a.$emit("removeTransition", l)
                }, {
                  default: j(() => [
                    y(d(fe), { icon: "tabler:trash" })
                  ]),
                  _: 1
                }, 8, ["aria-label", "onClick"])
              ])
            ], 8, pu))), 128))
          ])
        ])
      ])
    ]));
  }
}), Co = /* @__PURE__ */ ye({
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
    return (r, v) => e.hard ? (n(), J(d(lt), {
      key: 0,
      "aria-label": e.label,
      disabled: !t.value,
      "model-value": t.value?.hard ?? !1,
      "onUpdate:modelValue": o
    }, null, 8, ["aria-label", "disabled", "model-value"])) : (n(), J(d(xt), {
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
async function Vl(e, a) {
  try {
    const { data: t } = await Dl.get(e, a ? { params: a } : void 0);
    if (!t?.success) {
      const l = t?.message || (typeof t?.error == "string" ? t.error : t?.error?.message) || "Could not read published Flow.";
      throw new Tl({ message: l, details: t?.details }, "Published Flow");
    }
    return t;
  } catch (t) {
    throw Ni(t, "Published Flow");
  }
}
const So = (e) => `/api/v1/workflows/${encodeURIComponent(e)}/versions`, Fl = {
  title: async (e) => (await Vl("/api/v1/workflows/published", { id: e })).item?.title,
  versions: async (e) => (await Vl(So(e))).versions ?? [],
  check: async (e) => {
    if ((await Vl(`${So(e.id)}/${e.version}`)).version?.version !== e.version) throw new Error("The published version is unavailable.");
  }
}, wu = {
  class: "work-stack work-tight",
  "aria-label": "Stage Flow"
}, $u = {
  key: 0,
  class: "work-muted work-small"
}, Vu = {
  key: 1,
  class: "kx-err work-alert-actions"
}, xu = { role: "alert" }, Cu = ["schema", "config", "title"], Su = {
  key: 3,
  class: "kx-err",
  role: "alert"
}, Tu = {
  key: 4,
  class: "work-stack work-tight"
}, Iu = ["value", "aria-busy", "disabled"], Du = {
  value: "",
  disabled: ""
}, Au = ["value"], Uu = {
  key: 5,
  class: "work-muted work-small",
  role: "status"
}, Eu = /* @__PURE__ */ ye({
  __name: "StageFlow",
  props: {
    modelValue: {}
  },
  emits: ["update:modelValue", "validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = z(!1), r = z(""), v = z([]), m = z(!1), g = z(""), i = z(!1), c = F(() => r.value || t.modelValue?.id), u = JSON.stringify({ properties: { flow_ref: { title: "Published Flow", picker: "wc-workflow-picker" } } }), C = F(() => JSON.stringify(t.modelValue ? { flow_ref: t.modelValue } : {}));
    let h = 0;
    async function b() {
      o.value = await Rt("wc-workflow-picker");
    }
    b();
    async function p() {
      const A = ++h, E = c.value, q = t.modelValue;
      if (m.value = !!E, g.value = "", v.value = [], !!E)
        try {
          const [le] = await Promise.all([Fl.versions(E), !i.value && q ? Fl.check(q) : Promise.resolve()]);
          if (A !== h) return;
          if (v.value = le.filter((Z) => Number.isInteger(Z.version) && Z.version > 0), !i.value && q && !v.value.some((Z) => Z.version === q.version)) throw new Error("The published version is unavailable.");
        } catch (le) {
          A === h && (g.value = rt(le, "Could not read published Flow."));
        } finally {
          A === h && (m.value = !1);
        }
    }
    Ve([c, () => t.modelValue?.version, i], p, { immediate: !0 }), Ve(i, (A) => l("validity", !A), { immediate: !0 });
    function k(A) {
      const E = A.detail?.flow_ref;
      E?.kind !== "flow" || !E.id || (i.value = !0, r.value = E.id);
    }
    function S(A) {
      !c.value || !v.value.some((E) => E.version === A) || (l("update:modelValue", { kind: "flow", id: c.value, version: A }), i.value = !1, r.value = "");
    }
    function V() {
      l("update:modelValue", void 0), i.value = !1, r.value = "";
    }
    return wt(() => {
      h++, l("validity", !0);
    }), (A, E) => (n(), f("section", wu, [
      E[4] || (E[4] = s("h4", { class: "work-field-label" }, "What runs", -1)),
      e.modelValue ? I("", !0) : (n(), f("p", $u, "No Flow bound. This stage keeps its existing external execution contract.")),
      g.value ? (n(), f("div", Vu, [
        s("p", xu, [
          W(D(i.value ? "Flow versions unavailable" : "Flow binding unavailable"), 1),
          !i.value && e.modelValue ? (n(), f(_, { key: 0 }, [
            W(" (v" + D(e.modelValue.version) + ")", 1)
          ], 64)) : I("", !0),
          W(". " + D(g.value), 1)
        ]),
        y(d(Q), {
          label: "Reload Flow",
          severity: "secondary",
          text: "",
          onClick: p
        })
      ])) : I("", !0),
      o.value ? (n(), f("wc-workflow-picker", {
        key: 2,
        schema: d(u),
        config: C.value,
        title: e.modelValue?.id,
        onChange: k
      }, null, 40, Cu)) : (n(), f("p", Su, [
        E[2] || (E[2] = W("Published Flow picker unavailable.", -1)),
        y(d(Q), {
          label: "Reload Flow picker",
          text: "",
          severity: "secondary",
          onClick: b
        })
      ])),
      c.value ? (n(), f("label", Tu, [
        E[3] || (E[3] = W(" Published version ", -1)),
        s("select", {
          class: "p-inputtext work-flow-version",
          value: i.value ? "" : e.modelValue?.version,
          "aria-busy": m.value,
          disabled: m.value || !!g.value,
          onChange: E[0] || (E[0] = (q) => S(Number(q.target.value)))
        }, [
          s("option", Du, D(m.value ? "Loading versions…" : "Choose a published version"), 1),
          (n(!0), f(_, null, ue(v.value, (q) => (n(), f("option", {
            key: q.version,
            value: q.version
          }, "v" + D(q.version), 9, Au))), 128))
        ], 40, Iu)
      ])) : I("", !0),
      i.value ? (n(), f("p", Uu, "Choose a published version to finish selecting the Flow.")) : I("", !0),
      e.modelValue || i.value ? (n(), J(d(Q), {
        key: 6,
        label: i.value ? "Cancel Flow selection" : "Remove Flow binding",
        "aria-label": i.value ? "Cancel Flow selection" : "Remove Flow binding",
        severity: "secondary",
        text: "",
        onClick: E[1] || (E[1] = (q) => i.value ? (i.value = !1, r.value = "") : V())
      }, null, 8, ["label", "aria-label"])) : I("", !0)
    ]));
  }
}), Ll = { seconds: 1, minutes: 60, hours: 3600, days: 86400 };
function ga(e, a) {
  const t = /^P(\d+)W$/.exec(e), l = /^P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+\.?\d*)S)?)?$/.exec(e);
  if (!t && (!l || e === "P" || e.endsWith("T"))) return;
  const o = t ? Number(t[1]) * 604800 : Number(l[1] ?? 0) * 86400 + Number(l[2] ?? 0) * 3600 + Number(l[3] ?? 0) * 60 + Number(l[4] ?? 0);
  if (!Number.isFinite(o) || o <= 0) return;
  const r = a ?? (o % 86400 === 0 ? "days" : o % 3600 === 0 ? "hours" : o < 60 ? "seconds" : "minutes");
  return { amount: o / Ll[r], unit: r };
}
function Ou(e, a) {
  if (e == null) return;
  if (!Number.isFinite(e * Ll[a]) || e <= 0) throw new Error("Enter a positive duration.");
  const t = (o) => o.toLocaleString("en-US", { useGrouping: !1, maximumSignificantDigits: 21 });
  if (!Number.isInteger(e)) return `PT${t(e * Ll[a])}S`;
  const l = { seconds: "S", minutes: "M", hours: "H", days: "D" }[a];
  return (a === "days" ? "P" : "PT") + t(e) + l;
}
const Ru = { class: "work-stack work-tight" }, Pu = {
  key: 0,
  class: "work-error",
  role: "alert"
}, Ht = /* @__PURE__ */ ye({
  __name: "DurationControl",
  props: {
    modelValue: {},
    label: {},
    disabled: { type: Boolean }
  },
  emits: ["update:modelValue", "validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = "duration:" + gt(), r = z(), v = z(""), m = F(() => t.modelValue ? ga(t.modelValue) : void 0), g = F(() => r.value ?? m.value?.unit ?? "days");
    Ve(() => t.modelValue, (S) => {
      v.value = "", l("validity", !S || !!m.value, o);
    }, { immediate: !0 });
    const i = F(() => t.modelValue ? ga(t.modelValue, g.value)?.amount ?? null : null);
    function c(S) {
      try {
        const V = Ou(S, g.value);
        v.value = "", l("update:modelValue", V), l("validity", !0, o);
      } catch (V) {
        v.value = V.message, l("validity", !1, o);
      }
    }
    let u;
    function C(S) {
      S.target instanceof HTMLInputElement && (u = S.target.value);
    }
    function h(S) {
      if (u === void 0) return;
      const V = u;
      u = void 0, p(S, V);
    }
    function b(S) {
      u = void 0;
      const V = S.originalEvent?.target instanceof HTMLInputElement ? S.originalEvent.target.value : S.formattedValue;
      p(S.value, V);
    }
    function p(S, V) {
      if (V.trim() && (typeof S != "number" || !Number.isFinite(S))) {
        v.value = "Enter a positive duration.", l("validity", !1, o);
        return;
      }
      r.value = g.value, c(typeof S == "number" ? S : null);
    }
    function k(S) {
      const V = i.value;
      r.value = S, !(t.modelValue && !m.value) && c(V);
    }
    return wt(() => l("validity", !0, o)), (S, V) => (n(), f("label", Ru, [
      W(D(e.label), 1),
      s("span", {
        class: "work-duration-control",
        style: { "max-width": "360px" },
        onInputCapture: C
      }, [
        y(d(xt), {
          "model-value": i.value,
          "aria-label": e.label,
          min: 0,
          "aria-invalid": !!v.value || !!e.modelValue && !d(ga)(e.modelValue),
          disabled: e.disabled,
          useGrouping: !1,
          "max-fraction-digits": g.value === "seconds" ? 20 : 3,
          onInput: b,
          "onUpdate:modelValue": h
        }, null, 8, ["model-value", "aria-label", "aria-invalid", "disabled", "max-fraction-digits"]),
        y(d(pe), {
          "model-value": g.value,
          "aria-label": e.label + " unit",
          disabled: e.disabled,
          options: [{ label: "Seconds", value: "seconds" }, { label: "Minutes", value: "minutes" }, { label: "Hours", value: "hours" }, { label: "Days", value: "days" }],
          optionLabel: "label",
          optionValue: "value",
          appendTo: "self",
          "onUpdate:modelValue": V[0] || (V[0] = (A) => k(A))
        }, null, 8, ["model-value", "aria-label", "disabled"])
      ], 32),
      v.value || e.modelValue && !d(ga)(e.modelValue) ? (n(), f("span", Pu, D(v.value || `Unsupported duration: ${e.modelValue}`), 1)) : I("", !0)
    ]));
  }
}), Nu = { class: "work-stack" }, Mu = { class: "work-settings-grid" }, Fu = { class: "work-stack work-tight" }, Lu = { class: "work-stack work-tight" }, Bu = {
  key: 1,
  class: "work-stack work-tight"
}, zu = { class: "work-stack work-tight" }, ju = { class: "work-settings-grid" }, qu = { class: "work-row" }, Wu = { class: "work-stack work-tight" }, Gu = {
  key: 0,
  class: "work-stack work-tight"
}, Ku = /* @__PURE__ */ ye({
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
      i.push({ id: ta("timer", i), after: "P1D", then: { emit: "reminder" } });
    }
    function v(i, c) {
      delete i.after, delete i.at_field, c === "after" ? i.after = "P1D" : i.at_field = "";
    }
    function m(i, c, u) {
      u ? i[c] = u : (delete i[c], delete i.table);
    }
    function g(i, c) {
      i.then = c === "emit" ? { emit: "" } : { transition: "" };
    }
    return (i, c) => (n(), f("section", Nu, [
      c[8] || (c[8] = s("h4", null, "Timers", -1)),
      (n(!0), f(_, null, ue(o(), (u, C) => (n(), f("article", {
        key: u.id,
        class: "work-settings-card work-stack"
      }, [
        s("div", Mu, [
          s("label", Fu, [
            c[2] || (c[2] = W("Timer ID", -1)),
            y(d(Ie), {
              modelValue: u.id,
              "onUpdate:modelValue": (h) => u.id = h,
              required: "",
              pattern: "[a-z][a-z0-9_]*"
            }, null, 8, ["modelValue", "onUpdate:modelValue"])
          ]),
          s("label", Lu, [
            c[3] || (c[3] = W("Deadline", -1)),
            y(d(pe), {
              "model-value": u.at_field !== void 0 ? "at_field" : "after",
              "onUpdate:modelValue": (h) => v(u, h),
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
          u.after !== void 0 ? (n(), J(Ht, {
            key: 0,
            modelValue: u.after,
            "onUpdate:modelValue": (h) => u.after = h,
            label: "After",
            onValidity: c[0] || (c[0] = (h, b) => l("validity", b, h))
          }, null, 8, ["modelValue", "onUpdate:modelValue"])) : (n(), f("label", Bu, [
            c[4] || (c[4] = W("At field", -1)),
            y(d(pe), {
              modelValue: u.at_field,
              "onUpdate:modelValue": (h) => u.at_field = h,
              appendTo: "self",
              optionLabel: "label",
              optionValue: "value",
              optionDisabled: "disabled",
              options: [
                ...(e.draft.fields?.filter((h) => h.form === "time") ?? []).map((h) => ({
                  label: h.code,
                  value: h.code,
                  disabled: !1
                }))
              ]
            }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
          ])),
          s("label", zu, [
            c[5] || (c[5] = W("Duration by field", -1)),
            y(d(pe), {
              "model-value": u.by ?? "",
              "onUpdate:modelValue": (h) => m(u, "by", h),
              appendTo: "self",
              optionLabel: "label",
              optionValue: "value",
              optionDisabled: "disabled",
              options: [
                { label: "Fixed duration", value: "", disabled: !1 },
                ...(e.draft.fields ?? []).map((h) => ({
                  label: h.code,
                  value: h.code,
                  disabled: !1
                }))
              ]
            }, null, 8, ["model-value", "onUpdate:modelValue", "options"])
          ])
        ]),
        u.by ? (n(), J(Mt, {
          key: 0,
          label: "Duration table",
          hint: "Map field values to ISO durations.",
          "model-value": u.table,
          shape: "object",
          "onUpdate:modelValue": (h) => u.table = h,
          onValidity: (h) => l("validity", "table-" + C, h)
        }, null, 8, ["model-value", "onUpdate:modelValue", "onValidity"])) : I("", !0),
        s("div", ju, [
          y(Ht, {
            modelValue: u.repeat,
            "onUpdate:modelValue": (h) => u.repeat = h,
            label: "Repeat every",
            onValidity: c[1] || (c[1] = (h, b) => l("validity", b, h)),
            disabled: u.interrupting
          }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"]),
          s("label", qu, [
            y(d(Pt), {
              modelValue: u.interrupting,
              "onUpdate:modelValue": [(h) => u.interrupting = h, (h) => u.interrupting && delete u.repeat],
              binary: ""
            }, null, 8, ["modelValue", "onUpdate:modelValue"]),
            c[6] || (c[6] = W("Interrupting", -1))
          ]),
          s("label", Wu, [
            c[7] || (c[7] = W("Then", -1)),
            y(d(pe), {
              "model-value": u.then?.transition !== void 0 ? "transition" : "emit",
              "onUpdate:modelValue": (h) => g(u, h),
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
          u.then ? (n(), f("label", Gu, [
            W(D(u.then.transition !== void 0 ? "Transition ID" : "Event name"), 1),
            u.then.transition !== void 0 ? (n(), J(d(Ie), {
              key: 0,
              modelValue: u.then.transition,
              "onUpdate:modelValue": (h) => u.then.transition = h
            }, null, 8, ["modelValue", "onUpdate:modelValue"])) : (n(), J(d(Ie), {
              key: 1,
              modelValue: u.then.emit,
              "onUpdate:modelValue": (h) => u.then.emit = h
            }, null, 8, ["modelValue", "onUpdate:modelValue"]))
          ])) : I("", !0)
        ]),
        y(d(Q), {
          severity: "secondary",
          onClick: (h) => o().splice(C, 1),
          "aria-label": "Remove timer",
          text: "",
          size: "small"
        }, {
          default: j(() => [
            y(d(fe), {
              icon: "tabler:trash",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        }, 8, ["onClick"])
      ]))), 128)),
      y(d(Q), {
        label: "Add timer",
        severity: "secondary",
        onClick: r,
        outlined: ""
      }, {
        icon: j(() => [
          y(d(fe), {
            icon: "tabler:plus",
            "aria-hidden": "true"
          })
        ]),
        _: 1
      })
    ]));
  }
}), Hu = ["aria-label"], Ju = { class: "work-stack work-tight" }, Yu = {
  key: 0,
  class: "work-stack work-tight"
}, Xu = /* @__PURE__ */ ye({
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
    function v(g) {
      l("update:modelValue", g === "field" ? { field: "" } : g === "group" ? { group: "" } : []);
    }
    function m(g) {
      l("update:modelValue", o.value === "group" ? { group: g.at(-1)?.id ?? "" } : g);
    }
    return Oo(() => l("validity", Array.isArray(t.modelValue) ? t.modelValue.length > 0 : "field" in t.modelValue ? !!t.modelValue.field : !!t.modelValue.group)), wt(() => l("validity", !0)), (g, i) => (n(), f("section", {
      class: "work-stack work-tight",
      "aria-label": e.label
    }, [
      s("label", Ju, [
        W(D(e.label) + " source", 1),
        y(d(pe), {
          "model-value": o.value,
          "aria-label": e.label + " source",
          options: [{ label: "Group", value: "group" }, { label: "People and groups", value: "principals" }, { label: "Principal field", value: "field" }],
          optionLabel: "label",
          optionValue: "value",
          appendTo: "self",
          "onUpdate:modelValue": v
        }, null, 8, ["model-value", "aria-label"])
      ]),
      "field" in e.modelValue ? (n(), f("label", Yu, [
        i[1] || (i[1] = W("Principal field", -1)),
        y(d(pe), {
          "model-value": e.modelValue.field,
          "aria-label": e.label + " field",
          options: e.draft.fields?.filter((c) => c.type === "principal").map((c) => ({ label: c.title || c.code, value: c.code })) ?? [],
          optionLabel: "label",
          optionValue: "value",
          appendTo: "self",
          "onUpdate:modelValue": i[0] || (i[0] = (c) => l("update:modelValue", { field: c }))
        }, null, 8, ["model-value", "aria-label", "options"])
      ])) : (n(), J(Xl, {
        key: 1,
        "board-id": e.boardId,
        label: e.label,
        kinds: o.value === "group" ? "group" : "user,group,service",
        "model-value": r.value,
        "onUpdate:modelValue": m
      }, null, 8, ["board-id", "label", "kinds", "model-value"]))
    ], 8, Hu));
  }
}), Zu = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, Qu = {
  class: "work-stack work-tight",
  "aria-label": "Approval sources"
}, _u = { class: "work-stack work-tight" }, ec = {
  key: 0,
  class: "work-stack work-tight"
}, tc = ["kinds", "placeholder", "value"], ac = {
  key: 2,
  class: "work-muted work-small",
  role: "status"
}, lc = {
  key: 3,
  class: "work-chips"
}, oc = {
  key: 4,
  class: "work-error work-small",
  role: "alert"
}, ic = {
  key: 5,
  class: "work-muted work-small"
}, nc = { class: "work-row" }, sc = { class: "work-row work-small" }, rc = /* @__PURE__ */ ye({
  __name: "ApproversEditor",
  props: {
    approvals: {},
    boardId: {}
  },
  emits: ["validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, { principalLabel: o, rememberPrincipal: r, nameError: v } = No(() => t.boardId ?? "", () => {
      const p = t.approvals.from;
      return Array.isArray(p) ? Mi(p) : "group" in p && p.group ? [{ kind: "group", id: p.group }] : [];
    }), m = z(), g = F(() => Array.isArray(t.approvals.from) ? "principals" : "field" in t.approvals.from ? "field" : "group"), i = F(() => {
      const p = t.approvals.from;
      return "group" in p && p.group ? JSON.stringify({ type: "group", principal_id: p.group }) : "{}";
    }), c = [
      { label: "Group members", value: "group" },
      { label: "People and groups", value: "principals" },
      { label: "Principal field", value: "field" }
    ], u = F(() => Array.isArray(t.approvals.from) ? t.approvals.from.some((p) => p.kind === "group") || t.approvals.from.length >= t.approvals.min : "field" in t.approvals.from ? !!t.approvals.from.field : !!t.approvals.from.group);
    Oo(() => l("validity", Number.isSafeInteger(t.approvals.min) && t.approvals.min > 0 && u.value)), wt(() => l("validity", !0)), Sa(async () => {
      m.value = await Rt("wc-principal-picker");
    });
    function C(p) {
      t.approvals.from = p === "group" ? { group: "" } : p === "field" ? { field: "" } : [];
    }
    function h(p) {
      const k = p.detail, S = k?.principal_id ?? k?.id;
      if (g.value === "group") {
        t.approvals.from = { group: S ?? "" };
        return;
      }
      if (!S || !Array.isArray(t.approvals.from)) return;
      const V = { kind: k.type ?? k.kind ?? "user", id: S };
      k.label && r(V, k.label), t.approvals.from.some((A) => A.id === S && A.kind === V.kind) || t.approvals.from.push(V);
    }
    function b(p) {
      Array.isArray(t.approvals.from) && t.approvals.from.splice(p, 1);
    }
    return (p, k) => (n(), f(_, null, [
      d(v) ? (n(), f("p", Zu, D(d(v)), 1)) : I("", !0),
      s("section", Qu, [
        s("label", _u, [
          k[4] || (k[4] = W("Approval source ", -1)),
          y(d(pe), {
            "model-value": g.value,
            "aria-label": "Approval source",
            "onUpdate:modelValue": k[0] || (k[0] = (S) => C(S)),
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            options: c
          }, null, 8, ["model-value"])
        ]),
        "field" in e.approvals.from ? (n(), f("label", ec, [
          k[5] || (k[5] = W("Principal field", -1)),
          y(d(Ie), {
            modelValue: e.approvals.from.field,
            "onUpdate:modelValue": k[1] || (k[1] = (S) => e.approvals.from.field = S),
            "aria-label": "Principal field"
          }, null, 8, ["modelValue"])
        ])) : m.value ? (n(), f("wc-principal-picker", {
          key: g.value,
          kinds: g.value === "group" ? "group" : "user,group",
          placeholder: g.value === "group" ? "Select a group…" : "Select a person or group…",
          value: i.value,
          onConfigChanged: h
        }, null, 40, tc)) : (n(), f("p", ac, D(m.value === !1 ? "The principal picker is unavailable." : "Loading approver picker…"), 1)),
        Array.isArray(e.approvals.from) ? (n(), f("div", lc, [
          (n(!0), f(_, null, ue(e.approvals.from, (S, V) => (n(), J(d(Xe), {
            key: S.kind + ":" + S.id,
            class: "kx-tag-sm",
            severity: "secondary"
          }, {
            default: j(() => [
              W(D(d(o)(S)), 1),
              y(d(Q), {
                "aria-label": "Remove approver " + (V + 1),
                text: "",
                severity: "secondary",
                size: "small",
                onClick: (A) => b(V)
              }, {
                default: j(() => [
                  y(d(fe), {
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
        Array.isArray(e.approvals.from) && !u.value ? (n(), f("p", oc, "Select at least " + D(e.approvals.min) + " distinct principals, or lower the minimum.", 1)) : "group" in e.approvals.from && !e.approvals.from.group ? (n(), f("p", ic, "Choose the group that can approve this state.")) : I("", !0),
        s("label", nc, [
          k[6] || (k[6] = s("span", { class: "work-spacer" }, "Approvals needed", -1)),
          y(d(xt), {
            modelValue: e.approvals.min,
            "onUpdate:modelValue": k[2] || (k[2] = (S) => e.approvals.min = S),
            min: 1,
            required: "",
            useGrouping: !1
          }, null, 8, ["modelValue"])
        ]),
        s("label", sc, [
          k[7] || (k[7] = s("span", { class: "work-spacer" }, "The person who moves the item here cannot approve this visit", -1)),
          y(d(lt), {
            modelValue: e.approvals.prevent_self,
            "onUpdate:modelValue": k[3] || (k[3] = (S) => e.approvals.prevent_self = S),
            "aria-label": "The person who moves the item here cannot approve this visit"
          }, null, 8, ["modelValue"])
        ])
      ])
    ], 64));
  }
}), dc = {
  class: "work-state-settings work-stack",
  "aria-label": "State settings"
}, uc = { class: "work-process-kind" }, cc = { class: "work-stack" }, vc = { class: "work-row" }, fc = { class: "work-row" }, mc = { class: "work-row" }, pc = { class: "work-stack work-tight" }, gc = { class: "work-row" }, hc = { class: "work-stack work-tight" }, bc = { class: "work-row" }, yc = { class: "work-row" }, kc = { class: "work-stack work-tight" }, wc = { class: "work-stack" }, $c = { class: "work-row" }, Vc = { class: "work-row" }, xc = { class: "work-stack work-tight" }, Cc = { class: "work-stack work-tight" }, Sc = {
  key: 0,
  class: "work-row"
}, Tc = { class: "work-stack" }, Ic = { class: "work-stack work-tight" }, Dc = { class: "work-row" }, Ac = /* @__PURE__ */ ye({
  __name: "StateSettings",
  props: {
    state: {},
    process: {},
    draft: {},
    boardId: {}
  },
  emits: ["validity", "kind"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = F(() => (t.process.transitions ?? []).filter((g) => g.from === "any" || g.from.includes(t.state.id))), r = [{ value: "human", icon: "user" }, { value: "gate", icon: "shield-check" }, { value: "automated", icon: "bolt" }, { value: "parallel", icon: "arrows-split" }];
    function v(g) {
      const i = t.state;
      i.kind = g, delete i.run, delete i.release_when, delete i.regions, delete i.join, delete i.due, (g === "automated" || g === "gate") && delete i.awaiting, g === "automated" && (i.run = { stage: i.id, retry: { max: 1, backoff: "PT1M" } }), g === "gate" && (i.release_when = { approvals: { min: 1, from: { group: "" }, prevent_self: !0 } }), g === "parallel" && (i.regions = [{ id: "region_1", initial: t.process.states.find((c) => c.id !== i.id)?.id ?? "" }], i.join = "all"), l("kind", g);
    }
    function m(g) {
      t.state.run && (g ? t.state.run.on_fail = g : delete t.state.run.on_fail);
    }
    return (g, i) => (n(), f("section", dc, [
      i[57] || (i[57] = s("h4", { class: "work-process-group" }, "Who moves the item on", -1)),
      y(d(Gl), {
        class: "work-process-kinds",
        "model-value": e.state.kind ?? "human",
        options: r.map((c) => ({
          ...c,
          label: d(Ha)(c.value)
        })),
        optionLabel: "label",
        optionValue: "value",
        optionDisabled: "disabled",
        "allow-empty": !1,
        "aria-label": "Who moves the item on",
        "onUpdate:modelValue": v
      }, {
        option: j(({ option: c }) => [
          s("span", uc, [
            y(d(fe), {
              icon: "tabler:" + c.icon
            }, null, 8, ["icon"]),
            s("span", null, D(c.label), 1)
          ])
        ]),
        _: 1
      }, 8, ["model-value", "options"]),
      e.state.kind === "gate" && e.state.release_when ? (n(), f(_, { key: 0 }, [
        i[35] || (i[35] = s("h4", { class: "work-process-group" }, "Approval", -1)),
        e.state.release_when.approvals ? (n(), J(rc, {
          key: 0,
          "board-id": e.boardId,
          approvals: e.state.release_when.approvals,
          onValidity: i[0] || (i[0] = (c) => l("validity", "approvers", c))
        }, null, 8, ["board-id", "approvals"])) : I("", !0),
        y(Me, {
          class: "work-process-options",
          label: "Release options"
        }, {
          default: j(() => [
            s("div", cc, [
              s("label", vc, [
                i[34] || (i[34] = s("span", { class: "work-spacer" }, "Require approvals", -1)),
                y(d(lt), {
                  "model-value": !!e.state.release_when.approvals,
                  "aria-label": "Require approvals",
                  "onUpdate:modelValue": i[1] || (i[1] = (c) => e.state.release_when.approvals = c ? { min: 1, from: { group: "" }, prevent_self: !0 } : void 0)
                }, null, 8, ["model-value"])
              ]),
              y(Ht, {
                modelValue: e.state.release_when.wait,
                "onUpdate:modelValue": i[2] || (i[2] = (c) => e.state.release_when.wait = c),
                label: "Wait before release",
                onValidity: i[3] || (i[3] = (c, u) => l("validity", u, c))
              }, null, 8, ["modelValue"]),
              y(Yl, {
                label: "Release when",
                draft: e.draft,
                "board-id": e.boardId,
                modelValue: e.state.release_when.when,
                "onUpdate:modelValue": i[4] || (i[4] = (c) => e.state.release_when.when = c),
                onValidity: i[5] || (i[5] = (c) => l("validity", "release", c))
              }, null, 8, ["draft", "board-id", "modelValue"])
            ])
          ]),
          _: 1
        })
      ], 64)) : I("", !0),
      i[58] || (i[58] = s("h4", { class: "work-process-group" }, "Limit", -1)),
      s("label", fc, [
        i[36] || (i[36] = s("span", { class: "work-spacer" }, "Items allowed here", -1)),
        y(Co, {
          draft: e.draft,
          state: e.state.id,
          label: "Items allowed here"
        }, null, 8, ["draft", "state"])
      ]),
      s("label", mc, [
        i[37] || (i[37] = s("span", { class: "work-spacer" }, [
          W("Refuse moves over the limit"),
          s("small", { class: "work-muted work-block" }, "Off only warns")
        ], -1)),
        y(Co, {
          draft: e.draft,
          state: e.state.id,
          label: "Refuse moves over the limit",
          hard: ""
        }, null, 8, ["draft", "state"])
      ]),
      i[59] || (i[59] = s("h4", { class: "work-process-group" }, "Required on entry", -1)),
      y(pt, {
        label: "Required fields",
        options: e.draft.fields?.map((c) => ({ value: c.code, label: c.title || c.code })) ?? [],
        modelValue: e.state.require,
        "onUpdate:modelValue": i[6] || (i[6] = (c) => e.state.require = c)
      }, null, 8, ["options", "modelValue"]),
      !e.state.kind || e.state.kind === "human" ? (n(), J(Ht, {
        key: 1,
        modelValue: e.state.due,
        "onUpdate:modelValue": i[7] || (i[7] = (c) => e.state.due = c),
        label: "Time allowed in this state",
        onValidity: i[8] || (i[8] = (c, u) => l("validity", u, c))
      }, null, 8, ["modelValue"])) : I("", !0),
      e.state.kind === "automated" && e.state.run ? (n(), f(_, { key: 2 }, [
        i[46] || (i[46] = s("h4", { class: "work-process-group" }, "Automation", -1)),
        s("label", pc, [
          i[38] || (i[38] = W("Run label", -1)),
          y(d(Ie), {
            modelValue: e.state.run.stage,
            "onUpdate:modelValue": i[9] || (i[9] = (c) => e.state.run.stage = c),
            "aria-label": "Run label",
            required: ""
          }, null, 8, ["modelValue"])
        ]),
        y(Eu, {
          modelValue: e.state.run.flow_ref,
          "onUpdate:modelValue": i[10] || (i[10] = (c) => e.state.run.flow_ref = c),
          onValidity: i[11] || (i[11] = (c) => l("validity", "flow", c))
        }, null, 8, ["modelValue"]),
        y(Ht, {
          modelValue: e.state.run.timeout,
          "onUpdate:modelValue": i[12] || (i[12] = (c) => e.state.run.timeout = c),
          label: "Attempt timeout",
          onValidity: i[13] || (i[13] = (c, u) => l("validity", u, c))
        }, null, 8, ["modelValue"]),
        i[47] || (i[47] = s("small", { class: "work-muted" }, "Blank uses the board timeout, or one hour.", -1)),
        s("label", gc, [
          i[39] || (i[39] = s("span", { class: "work-spacer" }, "Maximum visits", -1)),
          y(d(xt), {
            "model-value": e.state.run.max_visits ?? null,
            "aria-label": "Maximum visits",
            min: 1,
            useGrouping: !1,
            placeholder: "Board default",
            "onUpdate:modelValue": i[14] || (i[14] = (c) => e.state.run.max_visits = c ?? void 0)
          }, null, 8, ["model-value"])
        ]),
        s("label", hc, [
          i[40] || (i[40] = W("When visits are exhausted", -1)),
          y(d(pe), {
            "model-value": e.state.run.on_exhausted,
            "aria-label": "When visits are exhausted",
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            showClear: "",
            options: (e.process.transitions ?? []).filter((c) => !c.auto).map((c) => ({ label: d(Ge)(c), value: c.id })),
            "onUpdate:modelValue": i[15] || (i[15] = (c) => e.state.run.on_exhausted = c || void 0)
          }, null, 8, ["model-value", "options"])
        ]),
        i[48] || (i[48] = s("small", { class: "work-muted" }, "Blank records a failed run and stops automation. A route must leave every incoming state or be global.", -1)),
        s("label", bc, [
          i[41] || (i[41] = s("span", { class: "work-spacer" }, "Retry if it fails", -1)),
          y(d(lt), {
            "model-value": !!e.state.run.retry,
            "aria-label": "Retry if it fails",
            "onUpdate:modelValue": i[16] || (i[16] = (c) => e.state.run.retry = c ? { max: 1, backoff: "PT1M" } : void 0)
          }, null, 8, ["model-value"])
        ]),
        e.state.run.retry ? (n(), f(_, { key: 0 }, [
          s("label", yc, [
            i[42] || (i[42] = s("span", { class: "work-spacer" }, "Maximum attempts", -1)),
            y(d(xt), {
              modelValue: e.state.run.retry.max,
              "onUpdate:modelValue": i[17] || (i[17] = (c) => e.state.run.retry.max = c),
              min: 1,
              useGrouping: !1
            }, null, 8, ["modelValue"])
          ]),
          y(Ht, {
            modelValue: e.state.run.retry.backoff,
            "onUpdate:modelValue": i[18] || (i[18] = (c) => e.state.run.retry.backoff = c),
            label: "Wait between attempts",
            onValidity: i[19] || (i[19] = (c, u) => l("validity", u, c))
          }, null, 8, ["modelValue"])
        ], 64)) : I("", !0),
        (n(), f(_, null, ue([{ key: "on_pass", label: "On success" }, { key: "on_cancel", label: "On cancellation" }], (c) => s("label", {
          key: c.key,
          class: "work-stack work-tight"
        }, [
          W(D(c.label), 1),
          y(d(pe), {
            "model-value": e.state.run[c.key],
            "aria-label": c.label,
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            showClear: "",
            options: o.value.map((u) => ({ label: d(Ge)(u), value: u.id })),
            "onUpdate:modelValue": (u) => e.state.run[c.key] = u || void 0
          }, null, 8, ["model-value", "aria-label", "options", "onUpdate:modelValue"])
        ])), 64)),
        s("label", kc, [
          i[43] || (i[43] = W("If it fails, go to", -1)),
          y(d(pe), {
            "aria-label": "If it fails, go to",
            "model-value": e.state.run.on_fail,
            "onUpdate:modelValue": m,
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            showClear: "",
            options: o.value.map((c) => ({
              label: d(Ge)(c) + " → " + d(ge)(e.process.states.find((u) => u.id === c.to)),
              value: c.id
            }))
          }, null, 8, ["model-value", "options"])
        ]),
        y(Me, {
          class: "work-disclosure",
          label: "Board automation defaults"
        }, {
          default: j(() => [
            s("div", wc, [
              i[45] || (i[45] = s("p", { class: "work-muted" }, "These values apply to automated states without their own limit.", -1)),
              y(Ht, {
                "model-value": e.draft.policy?.stage_timeout,
                label: "Default attempt timeout",
                "onUpdate:modelValue": i[20] || (i[20] = (c) => (e.draft.policy ??= {}).stage_timeout = c),
                onValidity: i[21] || (i[21] = (c, u) => l("validity", u, c))
              }, null, 8, ["model-value"]),
              s("label", $c, [
                i[44] || (i[44] = s("span", { class: "work-spacer" }, "Default maximum visits", -1)),
                y(d(xt), {
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
      ], 64)) : I("", !0),
      e.state.kind === "parallel" && e.state.regions ? (n(), f(_, { key: 3 }, [
        i[53] || (i[53] = s("h4", { class: "work-process-group" }, "Lanes", -1)),
        (n(!0), f(_, null, ue(e.state.regions, (c, u) => (n(), f("div", {
          key: u,
          class: "work-process-value work-stack work-tight"
        }, [
          s("div", Vc, [
            s("span", null, "Lane " + D(u + 1), 1),
            i[49] || (i[49] = s("span", { class: "work-spacer" }, null, -1)),
            y(d(Q), {
              severity: "danger",
              text: "",
              size: "small",
              "aria-label": "Remove lane",
              onClick: (C) => e.state.regions.splice(u, 1)
            }, {
              default: j(() => [
                y(d(fe), { icon: "tabler:trash" })
              ]),
              _: 1
            }, 8, ["onClick"])
          ]),
          s("label", xc, [
            i[50] || (i[50] = W("Starts at", -1)),
            y(d(pe), {
              "aria-label": "Lane starts at",
              modelValue: c.initial,
              "onUpdate:modelValue": (C) => c.initial = C,
              appendTo: "self",
              optionLabel: "label",
              optionValue: "value",
              options: e.process.states.filter((C) => C.id !== e.state.id).map((C) => ({ label: d(ge)(C), value: C.id }))
            }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
          ])
        ]))), 128)),
        y(d(Q), {
          label: "Add lane",
          severity: "secondary",
          outlined: "",
          size: "small",
          onClick: i[23] || (i[23] = (c) => e.state.regions.push({
            id: d(ta)("region", e.state.regions),
            initial: e.process.states.find((u) => u.id !== e.state.id)?.id ?? ""
          }))
        }, {
          icon: j(() => [
            y(d(fe), { icon: "tabler:plus" })
          ]),
          _: 1
        }),
        s("label", Cc, [
          i[51] || (i[51] = W("Finish rule", -1)),
          y(d(pe), {
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
        typeof e.state.join == "number" ? (n(), f("label", Sc, [
          i[52] || (i[52] = s("span", { class: "work-spacer" }, "Lanes needed", -1)),
          y(d(xt), {
            modelValue: e.state.join,
            "onUpdate:modelValue": i[25] || (i[25] = (c) => e.state.join = c),
            min: 1,
            max: e.state.regions.length,
            useGrouping: !1
          }, null, 8, ["modelValue", "max"])
        ])) : I("", !0)
      ], 64)) : I("", !0),
      y(Me, {
        class: "work-disclosure",
        label: "Advanced state settings"
      }, {
        default: j(() => [
          s("div", Tc, [
            i[56] || (i[56] = s("h4", { class: "work-process-group" }, "Assignment and conditions", -1)),
            s("label", Ic, [
              i[54] || (i[54] = W("Stage label", -1)),
              y(d(Ie), {
                "model-value": e.state.stage,
                "aria-label": "Stage label",
                "onUpdate:modelValue": i[26] || (i[26] = (c) => e.state.stage = c || void 0)
              }, null, 8, ["model-value"])
            ]),
            !e.state.kind || e.state.kind === "human" || e.state.kind === "parallel" ? (n(), f(_, { key: 0 }, [
              s("label", Dc, [
                y(d(lt), {
                  "model-value": !!e.state.awaiting,
                  "aria-label": "Awaiting people",
                  "onUpdate:modelValue": i[27] || (i[27] = (c) => e.state.awaiting = c ? { group: "" } : void 0)
                }, null, 8, ["model-value"]),
                i[55] || (i[55] = W("Awaiting people", -1))
              ]),
              e.state.awaiting ? (n(), J(Xu, {
                key: 0,
                modelValue: e.state.awaiting,
                "onUpdate:modelValue": i[28] || (i[28] = (c) => e.state.awaiting = c),
                draft: e.draft,
                "board-id": e.boardId,
                label: "Awaiting",
                onValidity: i[29] || (i[29] = (c) => l("validity", "awaiting", c))
              }, null, 8, ["modelValue", "draft", "board-id"])) : I("", !0)
            ], 64)) : I("", !0),
            y(Xl, {
              "board-id": e.boardId,
              modelValue: e.state.assign,
              "onUpdate:modelValue": i[30] || (i[30] = (c) => e.state.assign = c),
              label: "Assign to"
            }, null, 8, ["board-id", "modelValue"]),
            y(Mt, {
              label: "State checks",
              example: ["installed-check"],
              "model-value": e.state.invariants,
              shape: "array",
              "onUpdate:modelValue": i[31] || (i[31] = (c) => e.state.invariants = c),
              onValidity: i[32] || (i[32] = (c) => l("validity", "invariants", c))
            }, null, 8, ["model-value"]),
            y(Ku, {
              state: e.state,
              draft: e.draft,
              onValidity: i[33] || (i[33] = (c, u) => l("validity", "timer-" + c, u))
            }, null, 8, ["state", "draft"])
          ])
        ]),
        _: 1
      })
    ]));
  }
}), Uc = { class: "work-stack work-transition-settings" }, Ec = { class: "work-stack work-tight" }, Oc = { class: "work-row" }, Rc = { key: 0 }, Pc = { class: "work-stack" }, Nc = { class: "work-row" }, Mc = { class: "work-row" }, Fc = { class: "work-stack work-tight" }, Lc = { class: "work-row" }, Bc = { class: "work-stack work-tight" }, zc = { class: "work-stack work-tight" }, jc = /* @__PURE__ */ ye({
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
    function r(i, c) {
      const u = t.transition.set?.[i];
      !u || !t.transition.set || (t.transition.set[i] = { field: u.field, ...c === "clear" ? { clear: !0 } : c === "copy" ? { copy: "" } : { value: "" } });
    }
    function v(i) {
      return !i || typeof i != "object" || !("field" in i) || typeof i.field != "string" ? !1 : "clear" in i ? i.clear === !0 && !("copy" in i) && !("value" in i) : "copy" in i ? typeof i.copy == "string" && !("value" in i) : "value" in i;
    }
    function m(i) {
      if (i !== void 0 && (!Array.isArray(i) || !i.every(v)))
        return "Each effect needs a field and exactly one of value, clear (true), or copy (a source field).";
      t.transition.set = i;
    }
    function g(i) {
      if (i !== void 0 && (!Array.isArray(i) || !i.every((c) => typeof c == "string")))
        return "Enter guard IDs as strings.";
      t.transition.guards = i;
    }
    return (i, c) => (n(), f("div", Uc, [
      s("label", Ec, [
        c[13] || (c[13] = W("To state", -1)),
        y(d(pe), {
          modelValue: e.transition.to,
          "onUpdate:modelValue": c[0] || (c[0] = (u) => e.transition.to = u),
          "aria-label": "To state",
          appendTo: "self",
          optionLabel: "label",
          optionValue: "value",
          options: e.process.states.map((u) => ({ label: d(ge)(u), value: u.id }))
        }, null, 8, ["modelValue", "options"])
      ]),
      s("label", Oc, [
        c[14] || (c[14] = s("span", { class: "work-spacer" }, "Works from any state", -1)),
        y(d(lt), {
          "model-value": e.transition.from === "any",
          "aria-label": "Works from any state",
          "onUpdate:modelValue": c[1] || (c[1] = (u) => e.transition.from = u ? "any" : [])
        }, null, 8, ["model-value"])
      ]),
      e.transition.from !== "any" ? (n(), J(pt, {
        key: 0,
        label: "From states",
        options: e.process.states.map((u) => ({ value: u.id, label: d(ge)(u) })),
        modelValue: e.transition.from,
        "onUpdate:modelValue": c[2] || (c[2] = (u) => e.transition.from = u)
      }, null, 8, ["options", "modelValue"])) : I("", !0),
      c[22] || (c[22] = s("h4", { class: "work-process-group" }, "Must be filled", -1)),
      y(pt, {
        label: "Required fields",
        options: e.draft.fields?.map((u) => ({ value: u.code, label: u.title || u.code })) ?? [],
        modelValue: e.transition.require,
        "onUpdate:modelValue": c[3] || (c[3] = (u) => e.transition.require = u)
      }, null, 8, ["options", "modelValue"]),
      c[23] || (c[23] = s("h4", { class: "work-process-group" }, "Only when", -1)),
      y(Yl, {
        label: "Allow this transition when",
        draft: e.draft,
        "board-id": e.boardId,
        "model-value": e.transition.when,
        "onUpdate:modelValue": c[4] || (c[4] = (u) => e.transition.when = u),
        onValidity: c[5] || (c[5] = (u) => l("validity", "when", u))
      }, null, 8, ["draft", "board-id", "model-value"]),
      e.guards?.length || e.transition.guards?.length ? (n(), J(pt, {
        key: 1,
        label: "Installed checks",
        options: [...(e.guards ?? []).map((u) => ({ value: u.id, label: u.title })), ...(e.transition.guards ?? []).filter((u) => !e.guards?.some((C) => C.id === u)).map((u) => ({ value: u, label: e.guards ? "Unavailable check" : "Configured check" }))],
        modelValue: e.transition.guards,
        "onUpdate:modelValue": c[6] || (c[6] = (u) => e.transition.guards = u)
      }, null, 8, ["options", "modelValue"])) : I("", !0),
      (n(!0), f(_, null, ue(e.guards?.filter((u) => e.transition.guards?.includes(u.id)) ?? [], (u) => (n(), f("p", {
        key: u.id,
        class: "work-muted work-small"
      }, [
        W(D(u.description || u.title + " can stop this transition.") + " ", 1),
        u.reads?.length ? (n(), f("span", Rc, " Checks " + D(u.reads.map((C) => e.draft.fields?.find((h) => h.code === C)?.title || "a configured field").join(", ")) + ".", 1)) : I("", !0)
      ]))), 128)),
      y(Me, {
        class: "work-disclosure",
        label: "Advanced transition settings"
      }, {
        default: j(() => [
          s("div", Pc, [
            s("label", Nc, [
              c[15] || (c[15] = s("span", { class: "work-spacer" }, "Happens automatically", -1)),
              y(d(lt), {
                "model-value": e.transition.auto,
                "onUpdate:modelValue": c[7] || (c[7] = (u) => {
                  e.transition.auto = u, u || delete e.transition.default;
                }),
                "aria-label": "Automatic transition"
              }, null, 8, ["model-value"])
            ]),
            s("label", Mc, [
              c[16] || (c[16] = s("span", { class: "work-spacer" }, "Default automatic transition", -1)),
              y(d(lt), {
                modelValue: e.transition.default,
                "onUpdate:modelValue": c[8] || (c[8] = (u) => e.transition.default = u),
                disabled: !e.transition.auto,
                "aria-label": "Default transition"
              }, null, 8, ["modelValue", "disabled"])
            ]),
            c[21] || (c[21] = s("h4", { class: "work-process-group" }, "Also sets", -1)),
            (n(!0), f(_, null, ue(e.transition.set ?? [], (u, C) => (n(), f("div", {
              key: C,
              class: "work-process-value work-stack work-tight"
            }, [
              s("label", Fc, [
                c[17] || (c[17] = W("Field", -1)),
                y(d(pe), {
                  modelValue: u.field,
                  "onUpdate:modelValue": (h) => u.field = h,
                  appendTo: "self",
                  optionLabel: "label",
                  optionValue: "value",
                  options: e.draft.fields?.map((h) => ({ value: h.code, label: h.title || h.code })) ?? []
                }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
              ]),
              s("div", Lc, [
                y(d(pe), {
                  "model-value": u.clear ? "clear" : u.copy !== void 0 ? "copy" : "value",
                  "aria-label": "Value action",
                  appendTo: "self",
                  options: [
                    { label: "Set value", value: "value" },
                    { label: "Clear value", value: "clear" },
                    { label: "Copy field", value: "copy" }
                  ],
                  optionLabel: "label",
                  optionValue: "value",
                  "onUpdate:modelValue": (h) => r(C, h)
                }, null, 8, ["model-value", "onUpdate:modelValue"]),
                y(d(Q), {
                  text: "",
                  severity: "danger",
                  "aria-label": "Remove value " + (C + 1),
                  onClick: (h) => e.transition.set?.splice(C, 1)
                }, {
                  default: j(() => [
                    y(d(fe), { icon: "tabler:trash" })
                  ]),
                  _: 1
                }, 8, ["aria-label", "onClick"])
              ]),
              u.copy !== void 0 ? (n(), J(d(pe), {
                key: 0,
                modelValue: u.copy,
                "onUpdate:modelValue": (h) => u.copy = h,
                "aria-label": "Copy from field",
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                options: e.draft.fields?.map((h) => ({ value: h.code, label: h.title || h.code })) ?? []
              }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])) : u.clear ? I("", !0) : (n(!0), f(_, { key: 1 }, ue(e.draft.fields?.filter((h) => h.code === u.field) ?? [], (h) => (n(), J(Wo, {
                key: h.code,
                "board-id": e.boardId ?? "",
                field: h,
                modelValue: u.value,
                "onUpdate:modelValue": (b) => u.value = b,
                onValidity: (b) => l("validity", "effect-" + C, b)
              }, null, 8, ["board-id", "field", "modelValue", "onUpdate:modelValue", "onValidity"]))), 128))
            ]))), 128)),
            y(d(Q), {
              label: "Add value",
              severity: "secondary",
              outlined: "",
              size: "small",
              onClick: o
            }, {
              icon: j(() => [
                y(d(fe), { icon: "tabler:plus" })
              ]),
              _: 1
            }),
            s("label", Bc, [
              c[18] || (c[18] = W("Offer to people", -1)),
              y(d(pe), {
                "model-value": e.transition.people,
                "aria-label": "Offer to people",
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                options: [{ label: "Work default", value: void 0 }, { label: "Offer explicitly", value: !0 }, { label: "Process engine only", value: !1 }],
                "onUpdate:modelValue": c[9] || (c[9] = (u) => e.transition.people = u)
              }, null, 8, ["model-value"]),
              c[19] || (c[19] = s("span", { class: "work-muted work-small" }, "Work default can hide a stage route from the list while still allowing it by name. Process engine only reserves the route for the engine and board administrators using force.", -1))
            ]),
            s("label", zc, [
              c[20] || (c[20] = W("Evaluation order", -1)),
              y(d(xt), {
                "model-value": e.transition.order ?? null,
                "aria-label": "Transition order",
                min: 0,
                useGrouping: !1,
                "onUpdate:modelValue": c[10] || (c[10] = (u) => e.transition.order = u ?? void 0)
              }, null, 8, ["model-value"])
            ]),
            y(Mt, {
              label: "Set values",
              "model-value": e.transition.set,
              shape: "array",
              commit: m,
              onValidity: c[11] || (c[11] = (u) => l("validity", "set", u))
            }, null, 8, ["model-value"]),
            y(Mt, {
              label: "Guards",
              "model-value": e.transition.guards,
              shape: "array",
              commit: g,
              onValidity: c[12] || (c[12] = (u) => l("validity", "guards", u))
            }, null, 8, ["model-value"])
          ])
        ]),
        _: 1
      })
    ]));
  }
}), qc = ["aria-label", "aria-keyshortcuts", "onKeydown"], Wc = { class: "work-row" }, Gc = {
  key: 0,
  class: "work-stack work-tight"
}, Kc = { class: "work-process-meaning" }, Hc = {
  key: 1,
  class: "work-muted"
}, Jc = { class: "work-stack work-tight" }, Yc = { class: "work-next-transition work-stack work-tight" }, Xc = { class: "work-row work-wrap" }, Zc = { class: "work-process-inspector-foot" }, Qc = { class: "work-row work-transition-actions" }, _c = { class: "work-process-meaning" }, ev = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, tv = { class: "work-stack work-tight" }, av = /* @__PURE__ */ ye({
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
    const l = e, o = t, r = z(), v = z(!1), m = z(!1), g = z("");
    let i;
    function c() {
      i = void 0, v.value = !1, m.value = !1, g.value = "";
    }
    async function u(k) {
      c(), i = k, await mt(), r.value && (r.value.scrollTop = 0, r.value.focus({ preventScroll: !0 }), (r.value.closest(".work-settings-shell")?.clientWidth ?? 1 / 0) <= 700 && r.value.scrollIntoView?.({ block: "nearest" }));
    }
    async function C() {
      const k = i;
      o("close"), await mt(), k?.isConnected ? k.focus() : o("focus-editor");
    }
    async function h() {
      v.value = !0, await mt(), r.value?.querySelector('[aria-label="State name"]')?.focus();
    }
    async function b(k) {
      g.value = "", m.value = k, await mt();
      const S = k ? '[role="combobox"]' : "button";
      r.value?.querySelector(".work-next-transition " + S)?.focus();
    }
    function p(k) {
      !l.selectedTransition || k.defaultPrevented || k.repeat || (k.preventDefault(), o("remove-transition", l.selectedTransition));
    }
    return a({ open: u, close: C, reset: c, editName: h, removeByShortcut: p }), (k, S) => (n(), J(jl, { name: "work-panel" }, {
      default: j(() => [
        e.selectedState || e.selectedTransition ? (n(), f("aside", {
          key: 0,
          ref_key: "panel",
          ref: r,
          class: "work-process-sideform",
          tabindex: "-1",
          "aria-label": e.selectedState ? "State inspector" : "Transition inspector",
          "aria-keyshortcuts": e.selectedTransition ? "Delete Backspace" : void 0,
          onKeydown: [
            je(Pe(p, ["self"]), ["delete"]),
            je(Pe(p, ["self"]), ["backspace"])
          ]
        }, [
          (n(!0), f(_, null, ue(e.selectedState ? [e.selectedState] : [], (V) => (n(), f(_, {
            key: V.id
          }, [
            s("header", Wc, [
              v.value ? (n(), J(d(Ie), {
                key: 1,
                modelValue: V.name,
                "onUpdate:modelValue": (A) => V.name = A,
                class: "work-process-name",
                "aria-label": "State name",
                onBlur: S[0] || (S[0] = (A) => v.value = !1)
              }, null, 8, ["modelValue", "onUpdate:modelValue"])) : (n(), J(Kl, {
                key: 0,
                class: "work-process-state-title",
                "aria-label": "Rename state",
                onActivate: h
              }, {
                default: j(() => [
                  s("span", null, D(d(ge)(V)), 1)
                ]),
                _: 2
              }, 1024)),
              y(d(Q), {
                severity: "secondary",
                text: "",
                size: "small",
                "aria-label": "Close state editor",
                onClick: C
              }, {
                default: j(() => [
                  y(d(fe), { icon: "tabler:x" })
                ]),
                _: 1
              })
            ]),
            e.insertedRoute ? (n(), f("div", Gc, [
              S[4] || (S[4] = s("p", { class: "work-field-label" }, "New route", -1)),
              s("p", null, D(e.insertedRoute), 1)
            ])) : I("", !0),
            s("p", Kc, D(d(Fi)(V, e.draft)), 1),
            e.processCounts ? (n(), f("p", Hc, D(e.processCounts[V.id] ?? 0) + " " + D(e.processCounts[V.id] === 1 ? "item" : "items") + " currently here", 1)) : I("", !0),
            y(Ac, {
              state: V,
              process: e.process,
              draft: e.draft,
              "board-id": e.boardId,
              onKind: (A) => o("kind", V, A),
              onValidity: (A, E) => o("validity", A.includes("duration:") ? A : e.process.id + ":" + V.id + ":" + A, E)
            }, null, 8, ["state", "process", "draft", "board-id", "onKind", "onValidity"]),
            s("label", Jc, [
              S[5] || (S[5] = W("Phase", -1)),
              y(d(pe), {
                "aria-label": "Phase",
                modelValue: V.category,
                "onUpdate:modelValue": (A) => V.category = A,
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                options: ["triage", "backlog", ...d(Mo)].map((A) => ({ label: d(Nt)(A), value: A }))
              }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
            ]),
            s("div", Yc, [
              m.value ? (n(), f(_, { key: 1 }, [
                y(d(pe), {
                  modelValue: g.value,
                  "onUpdate:modelValue": S[2] || (S[2] = (A) => g.value = A),
                  "aria-label": "Next state",
                  placeholder: "Choose the next state",
                  appendTo: "self",
                  optionLabel: "label",
                  optionValue: "value",
                  options: e.process.states.filter((A) => A !== V).map((A) => ({ label: d(ge)(A), value: A.id }))
                }, null, 8, ["modelValue", "options"]),
                s("div", Xc, [
                  y(d(Q), {
                    label: "Add transition",
                    size: "small",
                    disabled: !g.value,
                    onClick: (A) => o("connect", V.id, g.value, d(i))
                  }, null, 8, ["disabled", "onClick"]),
                  y(d(Q), {
                    label: "Cancel",
                    severity: "secondary",
                    text: "",
                    size: "small",
                    onClick: S[3] || (S[3] = (A) => b(!1))
                  })
                ])
              ], 64)) : (n(), J(d(Q), {
                key: 0,
                label: "Add transition",
                severity: "secondary",
                outlined: "",
                size: "small",
                "aria-expanded": "false",
                disabled: e.process.states.length < 2,
                onClick: S[1] || (S[1] = (A) => b(!0))
              }, {
                icon: j(() => [
                  y(d(fe), {
                    icon: "tabler:plus",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["disabled"]))
            ]),
            s("footer", Zc, [
              y(d(Q), {
                label: "Remove state",
                severity: "danger",
                text: "",
                size: "small",
                onClick: (A) => o("remove-state", V)
              }, {
                icon: j(() => [
                  y(d(fe), { icon: "tabler:trash" })
                ]),
                _: 1
              }, 8, ["onClick"])
            ])
          ], 64))), 128)),
          (n(!0), f(_, null, ue(e.selectedTransition ? [e.selectedTransition] : [], (V) => (n(), f(_, {
            key: V.id
          }, [
            s("header", Qc, [
              S[6] || (S[6] = s("h3", null, "Transition", -1)),
              y(d(Q), {
                type: "button",
                label: "Remove transition",
                severity: "danger",
                text: "",
                size: "small",
                onClick: (A) => o("remove-transition", V)
              }, {
                icon: j(() => [
                  y(d(fe), { icon: "tabler:trash" })
                ]),
                _: 1
              }, 8, ["onClick"]),
              y(d(Q), {
                severity: "secondary",
                text: "",
                size: "small",
                "aria-label": "Close transition editor",
                onClick: C
              }, {
                default: j(() => [
                  y(d(fe), { icon: "tabler:x" })
                ]),
                _: 1
              })
            ]),
            s("p", _c, D(V.from === "any" ? "Any state" : V.from.map((A) => d(ge)(e.process.states.find((E) => E.id === A))).join(", ")) + " → " + D(d(ge)(e.process.states.find((A) => A.id === V.to))), 1),
            y(ri, {
              transition: V,
              process: e.process,
              draft: e.draft,
              guards: e.guards
            }, null, 8, ["transition", "process", "draft", "guards"]),
            e.error ? (n(), f("p", ev, D(e.error), 1)) : I("", !0),
            s("label", tv, [
              S[7] || (S[7] = W("Name", -1)),
              y(d(Ie), {
                modelValue: V.name,
                "onUpdate:modelValue": (A) => V.name = A,
                placeholder: d(Ge)(V),
                "aria-label": "Transition name"
              }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder"])
            ]),
            y(jc, {
              transition: V,
              process: e.process,
              draft: e.draft,
              "board-id": e.boardId,
              guards: e.guards,
              onValidity: (A, E) => o("validity", e.process.id + ":transition-" + V.id + ":" + A, E)
            }, null, 8, ["transition", "process", "draft", "board-id", "guards", "onValidity"])
          ], 64))), 128))
        ], 40, qc)) : I("", !0)
      ]),
      _: 1
    }));
  }
}), lv = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, ov = { key: 1 }, iv = { class: "work-muted" }, nv = {
  key: 2,
  class: "work-map-zoom",
  role: "group",
  "aria-label": "Map zoom"
}, sv = { class: "work-stack" }, rv = { class: "work-stack work-tight" }, dv = {
  key: 0,
  class: "work-muted"
}, uv = { class: "work-stack work-tight" }, cv = { class: "work-dialog-actions" }, vv = /* @__PURE__ */ ye({
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
    const t = e, l = a, o = _a(tl, void 0), r = F(() => t.draft.processes ?? []), v = z(!1), m = z(""), g = z(""), i = z(""), c = z("Map");
    Ve(() => t.createForItemType, (P, O) => {
      !P && !O || (m.value = "", v.value = !!P);
    }, { immediate: !0 });
    const u = z(), C = z(), h = z(), b = z(), p = z(), k = z(), S = /* @__PURE__ */ new WeakMap(), V = F(() => r.value.find((P) => P.id === g.value) ?? r.value[0]), A = F(() => {
      const P = u.value, O = V.value, H = P && S.get(P);
      if (!P || !O || !H) return;
      const { entry: ne, continuation: U } = H;
      if (!O.transitions?.includes(ne) || ne.to !== P.id) return;
      const $ = [
        ne.from === "any" ? "Any state" : ne.from.map((G) => ge(O.states.find((T) => T.id === G))).join(", "),
        ge(P)
      ];
      return U && O.transitions.includes(U) && (U.from === "any" || U.from.includes(P.id)) && $.push(ge(O.states.find((G) => G.id === U.to))), $.join(" → ");
    }), E = z(!1);
    function q(P) {
      E.value = !0, c.value = P;
    }
    function le() {
      !E.value && b.value?.clientWidth && (c.value = b.value.clientWidth < 480 && (V.value?.states.length ?? 0) > 6 ? "List" : "Map");
    }
    let Z;
    Sa(() => {
      le(), b.value && typeof ResizeObserver < "u" && (Z = new ResizeObserver(le), Z.observe(b.value));
    }), wt(() => Z?.disconnect()), Ve(V, () => {
      E.value = !1, le();
    });
    function se() {
      p.value?.reset(), u.value = void 0, C.value = void 0, i.value = "";
    }
    function ce() {
      const P = o?.selected.value;
      P?.startsWith("workflow/") && o?.choose("workflow", P.slice(9), !1), se();
    }
    function ve() {
      c.value === "Map" ? h.value?.focus() : k.value?.focus();
    }
    function me(P, O) {
      u.value = P, C.value = void 0, i.value = "", V.value && o?.choose("workflow", V.value.id + ".state." + P.id, !0), p.value?.open(O);
    }
    function oe(P, O) {
      C.value = P, u.value = void 0, i.value = "", V.value && o?.choose("workflow", V.value.id + ".transition." + P.id, !0), p.value?.open(O);
    }
    Ve([V, c], se), Ve([() => o?.selected.value, r], async ([P], O) => {
      if (!P?.startsWith("workflow/")) {
        O?.[0]?.startsWith("workflow/") && se();
        return;
      }
      const [H, ne, U] = P.slice(9).split("."), $ = r.value.find((X) => X.id === H);
      if (!$ || V.value !== $ && (g.value = $.id, await mt(), o?.selected.value !== P))
        return;
      const G = ne === "state" ? $.states.find((X) => X.id === U) : void 0, T = ne === "transition" ? $.transitions?.find((X) => X.id === U) : void 0;
      G === u.value && T === C.value || (se(), u.value = G, C.value = T);
    }, { immediate: !0, flush: "post" });
    const R = F(() => {
      if (!t.counts || !V.value) return;
      const P = t.countTypes?.filter((O) => O.process === V.value?.id) ?? [];
      return Object.fromEntries(V.value.states.map((O) => [
        O.id,
        P.reduce((H, ne) => H + (t.counts?.[ne.id]?.[O.id] ?? 0), 0)
      ]));
    }), te = F(() => (t.guards ?? []).filter((P) => t.draft.plugins?.some((O) => O.use === P.plugin))), M = F(() => Object.keys(t.draft.policy?.wip ?? {}).filter((P) => !r.value.some((O) => O.states.some((H) => H.id === P))));
    function ae() {
      const P = m.value.trim();
      if (!P) return;
      const O = P.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "") || "process", H = (/^[a-z]/.test(O) ? O : "process_" + O).slice(0, 40), ne = r.value.some((U) => U.id === H) ? ta(H, r.value) : H;
      (t.draft.processes ??= []).push({ id: ne, name: P, initial: "todo", states: [{ id: "todo", name: "To do", category: "unstarted" }], transitions: [] }), g.value = ne, m.value = "", v.value = !1, l("created", ne);
    }
    function ke() {
      v.value = !1, l("cancel-creation");
    }
    async function Ae(P, O) {
      const H = { id: ta("state", P.states), name: "New state", category: "started" }, ne = Ba(P), U = ne.at(-1), $ = u.value ?? (U?.category === "completed" ? ne.at(-2) : U), G = $ ? P.states.indexOf($) : -1, T = $ ? G + 1 : P.states.length, X = $ && P.transitions?.filter((Ce) => Ce.from !== "any" && Ce.from.length === 1 && Ce.from[0] === $.id && !co(P, Ce).length), de = X?.find((Ce) => Ce.default) ?? X?.find((Ce) => P.states.findIndex((Ke) => Ke.id === Ce.to) > G);
      P.states.splice(T, 0, H);
      const $e = P.states[T];
      if ($ && $.category !== "completed" && $.category !== "canceled") {
        const Ce = P.transitions ??= [], Ke = de?.auto === !0 && de.default === !0, Ze = {
          id: ta("transition", Ce),
          name: "Continue",
          from: [de ? $e.id : $.id],
          to: de?.to ?? $e.id,
          ...Ke ? { auto: !0, default: !0 } : {}
        };
        de && (de.to = $e.id), Ce.push(Ze);
        const It = Ce[Ce.length - 1];
        S.set($e, { entry: de ?? It, continuation: de ? It : void 0, automatic: Ke });
      }
      me($e, O), await p.value?.editName();
    }
    function Ue(P, O) {
      const H = S.get(P), ne = H?.continuation;
      !ne || H.automatic || ne.from === "any" || ne.from.length !== 1 || ne.from[0] !== P.id || (O === "gate" ? (ne.auto = !0, ne.default = !0) : (delete ne.auto, delete ne.default));
    }
    function K(P, O, H) {
      const ne = V.value;
      if (!ne || !O || P === O) return;
      const U = ne.transitions ??= [], $ = `to_${O}`;
      let G = $.slice(0, 40), T = 2;
      for (; U.some((de) => de.id === G); ) {
        const de = `_${T++}`;
        G = $.slice(0, 40 - de.length) + de;
      }
      const X = { id: G, name: `To ${ge(ne.states.find((de) => de.id === O)).toLowerCase()}`, from: [P], to: O };
      U.push(X), oe(X, H);
    }
    function B(P, O) {
      const H = u.value ?? P.states.find(($) => $.id === P.initial) ?? P.states[0], ne = P.states.find(($) => $.id !== H?.id);
      if (!H || !ne) return;
      const U = { id: ta("transition", P.transitions ?? []), name: "To " + ge(ne), from: [H.id], to: ne.id };
      (P.transitions ??= []).push(U), oe(U, O);
    }
    async function N(P) {
      const O = V.value, H = O?.transitions?.indexOf(P) ?? -1;
      if (!O || H < 0) return;
      const ne = co(O, P);
      if (ne.length) {
        i.value = `Used by ${ne.join(", ")}. Update those references first.`;
        return;
      }
      O.transitions.splice(H, 1), se(), await mt(), ve();
    }
    function w(P, O) {
      const H = Li(P, O);
      if (H.length) {
        i.value = `${ge(O)} is used by ${H.join(", ")}. Update these references first.`;
        return;
      }
      P.states.splice(P.states.indexOf(O), 1), p.value?.close();
    }
    async function x(P) {
      const O = t.draft.item_types?.filter((ne) => ne.process === P.id).map((ne) => ne.title || "Untitled item type") ?? [];
      if (O.length) {
        i.value = `Used by ${O.join(", ")}. Choose a different workflow for those item types first.`;
        return;
      }
      const H = await t.guardRemoval?.("processes", P.id);
      if (H) {
        i.value = H;
        return;
      }
      Ta(t.draft, "processes", P.id), g.value = "", se();
    }
    return (P, O) => (n(), f("section", {
      ref_key: "editor",
      ref: b,
      class: "work-process-editor work-stack",
      "aria-label": "Workflow editor",
      onKeydown: O[17] || (O[17] = je((H) => (u.value || C.value) && p.value?.close(), ["esc"]))
    }, [
      i.value && !C.value ? (n(), f("p", lv, D(i.value), 1)) : I("", !0),
      (n(!0), f(_, null, ue(e.issues?.filter((H) => H.code === "process " + V.value?.id) ?? [], (H) => (n(), f("p", {
        key: H.what + H.detail,
        class: "work-error work-small",
        role: "alert"
      }, D(d(el)(H)) + " · " + D(H.what), 1))), 128)),
      V.value ? (n(), f("div", {
        key: 1,
        class: dt(["work-process-builder", { "work-process-inspecting": u.value || C.value }])
      }, [
        s("div", {
          ref_key: "tools",
          ref: k,
          class: "work-process-controls",
          role: "toolbar",
          "aria-label": "Workflow tools",
          tabindex: "-1"
        }, [
          r.value.length > 1 ? (n(), J(d(pe), {
            key: 0,
            "model-value": V.value.id,
            "aria-label": "Workflow",
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            options: r.value.map((H) => ({ label: H.name || "Untitled workflow", value: H.id })),
            "onUpdate:modelValue": O[0] || (O[0] = (H) => g.value = H)
          }, null, 8, ["model-value", "options"])) : (n(), f("strong", ov, D(V.value.name || "Untitled workflow"), 1)),
          y(d(Q), {
            label: "Add state",
            severity: "secondary",
            outlined: "",
            onClick: O[1] || (O[1] = (H) => Ae(V.value, H.currentTarget))
          }, {
            icon: j(() => [
              y(d(fe), { icon: "tabler:plus" })
            ]),
            _: 1
          }),
          y(d(Q), {
            label: "Add transition",
            severity: "secondary",
            outlined: "",
            disabled: V.value.states.length < 2,
            onClick: O[2] || (O[2] = (H) => B(V.value, H.currentTarget))
          }, null, 8, ["disabled"]),
          y(d(pe), {
            modelValue: V.value.initial,
            "onUpdate:modelValue": O[3] || (O[3] = (H) => V.value.initial = H),
            "aria-label": "Starts in " + d(ge)(V.value.states.find((H) => H.id === V.value.initial)),
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            options: V.value.states.map((H) => ({ label: d(ge)(H), value: H.id }))
          }, {
            value: j(() => [
              s("span", iv, "Starts in " + D(d(ge)(V.value.states.find((H) => H.id === V.value.initial))), 1)
            ]),
            _: 1
          }, 8, ["modelValue", "aria-label", "options"]),
          O[18] || (O[18] = s("span", { class: "work-spacer" }, null, -1)),
          c.value === "Map" ? (n(), f("div", nv, [
            y(d(Q), {
              label: "Fit",
              title: "Fit the map to a readable width",
              text: "",
              severity: "secondary",
              size: "small",
              onClick: O[4] || (O[4] = (H) => h.value?.fit())
            }, {
              icon: j(() => [
                y(d(fe), { icon: "tabler:arrows-maximize" })
              ]),
              _: 1
            }),
            c.value === "Map" ? (n(), J(d(Q), {
              key: 0,
              "aria-label": "Zoom out",
              title: "Zoom out",
              text: "",
              severity: "secondary",
              size: "small",
              onClick: O[5] || (O[5] = (H) => h.value?.zoomOut())
            }, {
              default: j(() => [
                y(d(fe), { icon: "tabler:minus" })
              ]),
              _: 1
            })) : I("", !0),
            c.value === "Map" ? (n(), J(d(Q), {
              key: 1,
              "aria-label": "Zoom in",
              title: "Zoom in",
              text: "",
              severity: "secondary",
              size: "small",
              onClick: O[6] || (O[6] = (H) => h.value?.zoomIn())
            }, {
              default: j(() => [
                y(d(fe), { icon: "tabler:plus" })
              ]),
              _: 1
            })) : I("", !0)
          ])) : I("", !0),
          y(d(Gl), {
            "model-value": c.value,
            "onUpdate:modelValue": q,
            options: ["Map", "List"],
            "allow-empty": !1,
            "aria-label": "Workflow layout"
          }, null, 8, ["model-value"]),
          y(d(Q), {
            label: "New process",
            "aria-label": "New process",
            text: "",
            severity: "secondary",
            onClick: O[7] || (O[7] = (H) => v.value = !0)
          }, {
            icon: j(() => [
              y(d(fe), { icon: "tabler:plus" })
            ]),
            _: 1
          })
        ], 512),
        c.value === "Map" ? (n(), J(Yd, {
          key: 0,
          ref_key: "graph",
          ref: h,
          process: V.value,
          draft: e.draft,
          "fit-on-open": "",
          "selected-state": u.value,
          "selected-transition": C.value,
          onState: me,
          onTransition: oe,
          onRemoveTransition: O[8] || (O[8] = (H) => p.value?.removeByShortcut(H)),
          onConnect: K,
          onClear: O[9] || (O[9] = (H) => p.value?.close())
        }, null, 8, ["process", "draft", "selected-state", "selected-transition"])) : (n(), J(ku, {
          key: 1,
          process: V.value,
          draft: e.draft,
          guards: te.value,
          "selected-state": u.value,
          "selected-transition": C.value,
          counts: R.value,
          onState: me,
          onTransition: oe,
          onRemoveState: O[10] || (O[10] = (H) => w(V.value, H)),
          onRemoveTransition: N
        }, null, 8, ["process", "draft", "guards", "selected-state", "selected-transition", "counts"])),
        y(av, {
          ref_key: "inspector",
          ref: p,
          process: V.value,
          draft: e.draft,
          "board-id": e.boardId,
          guards: te.value,
          error: i.value,
          "selected-state": u.value,
          "selected-transition": C.value,
          "inserted-route": A.value,
          "process-counts": R.value,
          onClose: ce,
          onFocusEditor: ve,
          onKind: Ue,
          onConnect: K,
          onRemoveState: O[11] || (O[11] = (H) => w(V.value, H)),
          onRemoveTransition: N,
          onValidity: O[12] || (O[12] = (H, ne) => l("validity", H, ne))
        }, null, 8, ["process", "draft", "board-id", "guards", "error", "selected-state", "selected-transition", "inserted-route", "process-counts"])
      ], 2)) : (n(), J(d(Q), {
        key: 2,
        label: "New process",
        severity: "secondary",
        outlined: "",
        onClick: O[13] || (O[13] = (H) => v.value = !0)
      }, {
        icon: j(() => [
          y(d(fe), { icon: "tabler:plus" })
        ]),
        _: 1
      })),
      V.value ? (n(), J(Me, {
        key: 3,
        class: "work-disclosure",
        label: "Advanced workflow settings"
      }, {
        default: j(() => [
          s("div", sv, [
            y(Me, {
              class: "work-small",
              label: "Technical details"
            }, {
              default: j(() => [...O[19] || (O[19] = [
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
            s("label", rv, [
              O[20] || (O[20] = W("Workflow name", -1)),
              y(d(Ie), {
                modelValue: V.value.name,
                "onUpdate:modelValue": O[14] || (O[14] = (H) => V.value.name = H),
                "aria-label": "Workflow name"
              }, null, 8, ["modelValue"])
            ]),
            M.value.length ? (n(), f("p", dv, "Some item limits belong to removed states.")) : I("", !0),
            (n(!0), f(_, null, ue(M.value, (H, ne) => (n(), J(d(Q), {
              key: H,
              label: "Clear limit for removed state " + (ne + 1),
              severity: "secondary",
              text: "",
              onClick: (U) => delete e.draft.policy.wip[H]
            }, null, 8, ["label", "onClick"]))), 128)),
            y(d(Q), {
              label: "Remove workflow",
              severity: "danger",
              text: "",
              size: "small",
              onClick: O[15] || (O[15] = (H) => x(V.value))
            })
          ])
        ]),
        _: 1
      })) : I("", !0),
      y(Il, {
        visible: v.value,
        "return-focus": e.creationOpener,
        label: "New process",
        onClose: ke
      }, {
        default: j(() => [
          s("form", {
            class: "work-dialog-box",
            "aria-label": "New process",
            onSubmit: Pe(ae, ["stop", "prevent"])
          }, [
            O[22] || (O[22] = s("h2", null, "New process", -1)),
            s("label", uv, [
              O[21] || (O[21] = W("Name", -1)),
              y(d(Ie), {
                modelValue: m.value,
                "onUpdate:modelValue": O[16] || (O[16] = (H) => m.value = H),
                "aria-label": "New process name",
                autofocus: "",
                required: ""
              }, null, 8, ["modelValue"])
            ]),
            s("div", cv, [
              y(d(Q), {
                label: "Cancel",
                severity: "secondary",
                outlined: "",
                onClick: ke
              }),
              y(d(Q), {
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
}), fv = {
  class: "work-settings-card work-stack",
  "aria-label": "Existing items"
}, mv = {
  key: 0,
  class: "work-stack work-tight"
}, pv = { class: "work-row" }, gv = /* @__PURE__ */ ye({
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
    return (t, l) => (n(), f("section", fv, [
      l[2] || (l[2] = s("h3", { class: "work-row-title" }, "Items in changed states", -1)),
      (n(!0), f(_, null, ue(e.removed, ({ process: o, state: r, count: v }) => (n(), f("label", {
        key: o.id + "/" + r.id,
        class: "work-stack work-tight"
      }, [
        W(" Move " + D(a(v)) + " from " + D(d(ge)(r)) + " to ", 1),
        y(d(pe), {
          disabled: e.disabled,
          "model-value": o.map?.[r.id],
          "aria-label": "Move items from " + d(ge)(r) + " to",
          placeholder: "Choose a state",
          appendTo: "self",
          optionLabel: "label",
          optionValue: "value",
          options: o.states.map((m) => ({ label: d(ge)(m), value: m.id })),
          "onUpdate:modelValue": (m) => t.$emit("destination", o, r.id, m)
        }, null, 8, ["disabled", "model-value", "aria-label", "options", "onUpdate:modelValue"])
      ]))), 128)),
      e.renamed.length ? (n(), f("div", mv, [
        (n(!0), f(_, null, ue(e.renamed, ({ process: o, state: r, count: v, name: m }) => (n(), f("p", {
          key: o.id + "/" + r.id
        }, [
          W(D(d(ge)(r)) + " becomes ", 1),
          s("strong", null, D(m), 1),
          W(" for " + D(a(v)) + ". ", 1)
        ]))), 128)),
        s("label", pv, [
          y(d(Pt), {
            binary: "",
            "model-value": e.confirmed,
            disabled: e.disabled,
            "onUpdate:modelValue": l[0] || (l[0] = (o) => t.$emit("update:confirmed", o))
          }, null, 8, ["model-value", "disabled"]),
          l[1] || (l[1] = W(" Keep these items in their renamed states ", -1))
        ])
      ])) : I("", !0)
    ]));
  }
}), hv = {
  class: "work-stack",
  "aria-label": "Links editor"
}, bv = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, yv = { class: "work-definition-meta work-muted work-small" }, kv = { class: "work-settings-grid" }, wv = { class: "work-stack work-tight" }, $v = {
  key: 0,
  class: "work-stack work-tight"
}, Vv = { class: "work-stack work-tight" }, xv = { class: "work-row" }, Cv = {
  key: 0,
  class: "work-muted work-small"
}, Sv = {
  key: 1,
  class: "work-stack work-tight"
}, Tv = { class: "work-settings-grid" }, Iv = {
  key: 0,
  class: "work-chips"
}, Dv = { class: "work-stack work-tight" }, Av = { class: "work-relation-preview work-small" }, Uv = {
  key: 0,
  class: "work-muted"
}, Ev = {
  key: 0,
  class: "kx-empty"
}, Ov = /* @__PURE__ */ ye({
  __name: "RelationsEditor",
  props: {
    draft: {},
    guardRemoval: { type: Function }
  },
  setup(e) {
    const a = e, t = F(() => a.draft.relation_types ?? []), l = F(() => (a.draft.item_types ?? []).map((b) => ({ value: b.id, label: b.title || Oe(b.id) })));
    function o(b, p, k) {
      k.length ? b[p] = k : delete b[p];
    }
    function r(b, p) {
      if (!/^[a-z][a-z0-9_]{0,39}$/.test(p)) return "Start with a lowercase letter and use only lowercase letters, numbers or underscores.";
      if (b.to_types?.includes(p)) return "This ID is already in use.";
    }
    function v(b, p) {
      o(b, "to_types", [...b.to_types ?? [], p]);
    }
    function m(b) {
      return (b.to_types ?? []).filter((p) => l.value.some((k) => k.value === p));
    }
    function g(b) {
      return (b.to_types ?? []).filter((p) => !l.value.some((k) => k.value === p));
    }
    const i = z(""), c = z(!1);
    function u(b) {
      const p = b.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, ""), k = (/^[a-z]/.test(p) ? p : "link_" + (p || "new")).slice(0, 40);
      let S = k, V = 2;
      for (; t.value.some((A) => A.id === S); ) {
        const A = "_" + V++;
        S = k.slice(0, 40 - A.length) + A;
      }
      return S;
    }
    function C(b) {
      (a.draft.relation_types ??= []).push({ id: u(b), outward: b, inward: b, cardinality: "many" });
    }
    async function h(b) {
      if (!c.value) {
        c.value = !0, i.value = "";
        try {
          const p = await a.guardRemoval?.("relation_types", b);
          p ? i.value = p : Ta(a.draft, "relation_types", b);
        } finally {
          c.value = !1;
        }
      }
    }
    return (b, p) => (n(), f("section", hv, [
      i.value ? (n(), f("p", bv, D(i.value), 1)) : I("", !0),
      y(Jl, {
        columns: "relations",
        count: t.value.length
      }, {
        default: j(() => [
          (n(!0), f(_, null, ue(t.value, (k, S) => (n(), J(Hl, {
            "route-section": "links",
            "route-id": k.id,
            title: k.outward || d(Oe)(k.id),
            kind: k.symmetric ? "Same both ways" : "Different each way",
            key: S,
            class: "work-stack"
          }, xa({
            actions: j(() => [
              y(d(Q), {
                severity: "secondary",
                text: "",
                disabled: c.value,
                onClick: (V) => h(k.id),
                "aria-label": "Remove link type",
                size: "small"
              }, {
                default: j(() => [
                  y(d(fe), {
                    icon: "tabler:trash",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["disabled", "onClick"])
            ]),
            default: j(() => [
              s("div", kv, [
                s("label", wv, [
                  p[0] || (p[0] = W("Shown on this item ", -1)),
                  y(d(Ie), {
                    modelValue: k.outward,
                    "onUpdate:modelValue": (V) => k.outward = V,
                    "aria-label": "Shown on this item"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                k.symmetric ? I("", !0) : (n(), f("label", $v, [
                  p[1] || (p[1] = W("Shown on the other item ", -1)),
                  y(d(Ie), {
                    modelValue: k.inward,
                    "onUpdate:modelValue": (V) => k.inward = V,
                    "aria-label": "Shown on the other item"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ])),
                s("label", Vv, [
                  p[2] || (p[2] = W("Links allowed ", -1)),
                  y(d(pe), {
                    "model-value": k.cardinality ?? "many",
                    "onUpdate:modelValue": (V) => k.cardinality = V,
                    "aria-label": "Links allowed",
                    appendTo: "self",
                    optionLabel: "label",
                    optionValue: "value",
                    optionDisabled: "disabled",
                    options: [{ label: "One link", value: "one", disabled: !1 }, { label: "Many links", value: "many", disabled: !1 }]
                  }, null, 8, ["model-value", "onUpdate:modelValue"])
                ]),
                s("label", xv, [
                  y(d(Pt), {
                    modelValue: k.symmetric,
                    "onUpdate:modelValue": (V) => k.symmetric = V,
                    disabled: !!(k.from_types?.length || k.to_types?.length),
                    "aria-label": "Same meaning in both directions",
                    binary: ""
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"]),
                  p[3] || (p[3] = W("Same meaning in both directions ", -1))
                ])
              ]),
              k.from_types?.length || k.to_types?.length ? (n(), f("p", Cv, " Clear the source and target types to use the same meaning in both directions. ")) : I("", !0),
              k.symmetric ? I("", !0) : (n(), f("div", Sv, [
                p[5] || (p[5] = s("p", { class: "work-muted work-small" }, "Leave either end empty to allow any item type there.", -1)),
                s("div", Tv, [
                  y(pt, {
                    label: "Source item types",
                    options: l.value,
                    "model-value": k.from_types,
                    "onUpdate:modelValue": (V) => o(k, "from_types", V)
                  }, null, 8, ["options", "model-value", "onUpdate:modelValue"]),
                  y(pt, {
                    label: "Target item types",
                    options: l.value,
                    "model-value": m(k),
                    "onUpdate:modelValue": (V) => o(k, "to_types", [...V, ...g(k)])
                  }, null, 8, ["options", "model-value", "onUpdate:modelValue"])
                ]),
                y(Me, {
                  class: "work-disclosure",
                  label: "Peer board target types"
                }, {
                  default: j(() => [
                    p[4] || (p[4] = s("p", { class: "work-muted work-small" }, "Enter a type ID to allow that type from a peer board.", -1)),
                    g(k).length ? (n(), f("div", Iv, [
                      (n(!0), f(_, null, ue(g(k), (V) => (n(), J(d(Q), {
                        key: V,
                        severity: "secondary",
                        text: "",
                        size: "small",
                        label: V + " ×",
                        "aria-label": "Remove target type " + V,
                        onClick: (A) => o(k, "to_types", k.to_types?.filter((E) => E !== V) ?? [])
                      }, null, 8, ["label", "aria-label", "onClick"]))), 128))
                    ])) : I("", !0),
                    y(Ca, {
                      action: "Add target type",
                      label: "Target type ID",
                      maxlength: 40,
                      validate: (V) => r(k, V),
                      onAdd: (V) => v(k, V)
                    }, null, 8, ["validate", "onAdd"])
                  ]),
                  _: 2
                }, 1024)
              ])),
              y(Me, {
                class: "work-disclosure",
                label: "Advanced link settings"
              }, {
                default: j(() => [
                  s("label", Dv, [
                    p[6] || (p[6] = W("Identifier ", -1)),
                    y(d(Ie), {
                      modelValue: k.id,
                      "onUpdate:modelValue": (V) => k.id = V,
                      required: "",
                      pattern: "[a-z][a-z0-9_]*",
                      "aria-label": "Relation ID"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ])
                ]),
                _: 2
              }, 1024),
              s("p", Av, [
                p[7] || (p[7] = s("strong", null, "This item", -1)),
                W(" " + D(k.outward || "relates to") + " ", 1),
                p[8] || (p[8] = s("strong", null, "another item", -1)),
                !k.symmetric && k.inward && k.inward !== k.outward ? (n(), f("span", Uv, " · reverse: " + D(k.inward), 1)) : I("", !0)
              ])
            ]),
            _: 2
          }, [
            !k.symmetric && k.inward && k.inward !== k.outward ? {
              name: "usage",
              fn: j(() => [
                s("span", yv, D(k.inward), 1)
              ]),
              key: "0"
            } : void 0
          ]), 1032, ["route-id", "title", "kind"]))), 128)),
          t.value.length ? I("", !0) : (n(), f("p", Ev, "No link types yet. Add one to connect related work.")),
          y(Ca, {
            action: "Add link type",
            label: "Link name",
            onAdd: C
          })
        ]),
        _: 1
      }, 8, ["count"])
    ]));
  }
}), Rv = ["aria-labelledby"], Pv = {
  key: 0,
  class: "kx-settings-group-head"
}, Nv = ["id"], Mv = {
  key: 0,
  class: "kx-settings-group-count"
}, Fv = { class: "kx-settings-group-list" }, xl = /* @__PURE__ */ ye({
  __name: "SettingsGroup",
  props: {
    title: {},
    count: {}
  },
  setup(e) {
    const a = gt();
    return (t, l) => (n(), f("section", {
      class: "kx-settings-group",
      "aria-labelledby": e.title ? d(a) : void 0
    }, [
      e.title ? (n(), f("div", Pv, [
        s("h2", {
          id: d(a),
          class: "kx-settings-group-title"
        }, D(e.title), 9, Nv),
        e.count !== void 0 ? (n(), f("span", Mv, D(e.count), 1)) : I("", !0)
      ])) : I("", !0),
      s("div", Fv, [
        Be(t.$slots, "default")
      ])
    ], 8, Rv));
  }
}), Lv = { class: "kx-settings-item-head" }, Bv = { class: "kx-settings-item-main" }, zv = { class: "kx-settings-item-line" }, jv = { class: "kx-settings-item-title" }, qv = {
  key: 0,
  class: "kx-settings-item-desc"
}, Wv = {
  key: 1,
  class: "kx-settings-item-meta"
}, Gv = { class: "kx-settings-item-actions" }, Kv = ["aria-expanded", "aria-controls", "aria-label"], Hv = ["id", "inert"], Jv = { class: "kx-settings-item-clip" }, Yv = { class: "kx-settings-item-body" }, Cl = /* @__PURE__ */ ye({
  __name: "SettingsItem",
  props: /* @__PURE__ */ zl({
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
    const a = e, t = Bl(e, "open"), l = Uo(), o = gt(), r = z(t.value);
    return Ve(t, (v) => {
      v && (r.value = !0);
    }), (v, m) => (n(), f("article", {
      class: dt(["kx-settings-item", { "kx-settings-item-open": t.value && d(l).default }])
    }, [
      s("div", Lv, [
        s("div", Bv, [
          s("div", zv, [
            s("h3", jv, D(e.title), 1),
            Be(v.$slots, "status")
          ]),
          e.description ? (n(), f("p", qv, D(e.description), 1)) : I("", !0),
          d(l).meta ? (n(), f("p", Wv, [
            Be(v.$slots, "meta")
          ])) : I("", !0)
        ]),
        s("div", Gv, [
          d(l).default ? (n(), f("button", {
            key: 0,
            type: "button",
            class: "kx-settings-item-expand",
            "aria-expanded": t.value,
            "aria-controls": d(o),
            "aria-label": (e.expandLabel || "Details") + " " + e.title,
            onClick: m[0] || (m[0] = (g) => t.value = !t.value)
          }, [
            s("span", null, D(e.expandLabel || "Details"), 1),
            y(d(fe), {
              icon: "tabler:chevron-down",
              "aria-hidden": "true"
            })
          ], 8, Kv)) : I("", !0),
          Be(v.$slots, "actions")
        ])
      ]),
      d(l).default ? (n(), J(jl, {
        key: 0,
        name: "kx-settings-item-motion"
      }, {
        default: j(() => [
          r.value || a.keepMounted ? vt((n(), f("div", {
            key: 0,
            id: d(o),
            inert: !t.value,
            class: "kx-settings-item-panel"
          }, [
            s("div", Jv, [
              s("div", Yv, [
                Be(v.$slots, "default")
              ])
            ])
          ], 8, Hv)), [
            [Vt, t.value]
          ]) : I("", !0)
        ]),
        _: 3
      })) : I("", !0)
    ], 2));
  }
});
function to(e) {
  return typeof e.error == "string" ? e.error : e.error?.message;
}
function Xv(e, a) {
  const t = to(e);
  return e.parked ? "Stopped: " + (t ?? "Projection is parked") : t ? "Degraded: " + t : e.bootstrapping ? "Initializing" : e.last_seq >= a ? "Up to date" : "Catching up";
}
function Zv(e, a) {
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
  if (o.some(to)) return { kind: "degraded", status: "Needs attention" };
}
function Qv(e, a, t) {
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
function Sl(e) {
  return e.length < 2 ? e[0] ?? "" : e.slice(0, -1).join(", ") + " and " + e[e.length - 1];
}
const _v = {
  class: "work-stack work-plugins",
  "aria-label": "Plugins editor"
}, ef = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, tf = {
  key: 1,
  class: "work-notice",
  role: "status"
}, af = {
  key: 2,
  class: "work-muted work-small",
  role: "status"
}, lf = {
  key: 3,
  class: "kx-loading"
}, of = { class: "work-stack work-tight" }, nf = { key: 0 }, sf = { key: 0 }, rf = { key: 1 }, df = { key: 2 }, uf = {
  key: 3,
  class: "work-block work-error"
}, cf = { class: "work-stack work-tight" }, vf = { key: 0 }, ff = { key: 1 }, mf = { key: 2 }, pf = {
  key: 3,
  class: "work-small"
}, gf = {
  key: 4,
  class: "work-small"
}, hf = {
  key: 5,
  class: "work-small"
}, bf = { class: "work-row" }, yf = ["aria-label"], kf = ["disabled", "schema", "config", "choices", "onConfigChanged", "onValidityChanged", "onVnodeBeforeUnmount"], wf = {
  key: 1,
  role: "alert",
  class: "kx-err"
}, $f = {
  key: 2,
  role: "status",
  class: "work-muted work-small"
}, Vf = { class: "work-row" }, xf = {
  key: 2,
  class: "work-stack work-tight"
}, Cf = {
  key: 3,
  class: "work-muted work-small"
}, Sf = { class: "work-stack work-tight" }, Tf = { key: 0 }, If = { key: 1 }, Df = { key: 2 }, Af = { key: 3 }, To = /* @__PURE__ */ ye({
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
  emits: ["configured", "refresh", "review", "upgrade", "validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = z(""), r = z(""), v = z(""), m = z({}), g = _a(tl, void 0), i = z(/* @__PURE__ */ new Set()), c = z({}), u = Po("wc-schema-form"), C = z({}), h = { Enabled: "success", Available: "secondary", "Setting up": "info", "Catching up": "info", "Turns on when applied": "info", "Turns off when applied": "info" }, b = F(() => t.options.map((U) => {
      const $ = te(U.plugin), G = Zv(U, $), T = ae(U.plugin), X = $?.active === !0, de = T && i.value.has(U.plugin) ? "Needs configuration" : T !== X ? T ? "Turns on when applied" : "Turns off when applied" : G?.status ?? (X ? $.lifecycle.state !== "ready" ? "Setting up" : R($) ? "Catching up" : "Enabled" : "Available"), $e = h[de] ?? (G?.kind === "missing" || G?.kind === "manifest" ? "danger" : "warn"), Ce = U.installed === !1 ? "Unavailable plugin" : U.title || "Unnamed plugin", Ke = T && oe(U) && G?.kind !== "manifest" && G?.kind !== "missing", Ze = ve(U.plugin).length > 0 && (T || X);
      return { plugin: U, current: $, issue: G, chosen: T, enabled: X, status: de, severity: $e, title: Ce, configurable: Ke, filtered: Ze, needs: se(U), usedBy: ce(U.plugin) };
    })), p = F(() => Qv(b.value, (U) => U.plugin.category, (U) => U.enabled)), k = F(() => !!o.value || t.disabled), S = F(() => k.value || t.activationLocked), V = {}, A = F(() => JSON.stringify({
      board_item_types: (t.draft.item_types ?? []).map((U) => ({ value: U.id, label: U.title || Oe(U.id) }))
    }));
    Ve(() => b.value.some((U) => U.configurable), (U) => {
      U && u.load();
    }, { immediate: !0 });
    const E = F(() => {
      const U = t.filters;
      return U ? (t.draft.scopes ?? []).filter(($) => !U.some((G) => G.id === $ && t.options.some((T) => T.plugin === G.plugin))) : [];
    }), q = F(() => t.draft.plugins?.filter((U) => !t.options.some(($) => $.plugin === U.use)) ?? []), le = F(() => !t.activationLocked && b.value.some((U) => U.chosen !== U.enabled));
    function Z(U) {
      return t.options.find(($) => $.plugin === U)?.title || "Another plugin";
    }
    function se(U) {
      return U.requires.map(Z);
    }
    function ce(U) {
      return [
        ...t.pack?.requires.includes(U) ? [t.pack.title] : [],
        ...t.options.filter(($) => $.requires.includes(U) && ae($.plugin)).map(($) => $.title || "Another plugin")
      ];
    }
    function ve(U) {
      return (t.filters ?? []).filter(($) => $.plugin === U);
    }
    function me(U, $) {
      const G = new Set(ve(U).map((de) => de.id)), T = t.draft.scopes ?? [], X = [...T.filter((de) => !G.has(de)), ...$];
      (X.length !== T.length || X.some((de) => !T.includes(de))) && (t.draft.scopes = X);
    }
    function oe(U) {
      return !!U.config_schema && Wl(U.config_schema).length > 0;
    }
    function R(U) {
      return Object.values(U.projections).some(($) => !$.parked && ($.bootstrapping || $.last_seq < t.schema.as_of));
    }
    function te(U) {
      return t.schema.plugins?.find(($) => $.plugin === U);
    }
    function M(U) {
      return te(U)?.active === !0;
    }
    function ae(U) {
      return t.draft.plugins?.some(($) => $.use === U) === !0;
    }
    function ke(U, $) {
      return m.value[U] ?? !!$;
    }
    function Ae(U, $) {
      m.value[U] = $, g?.choose("plugins", U, $);
    }
    Ve(() => g?.selected.value, (U, $) => {
      for (const [G, T] of [[$, !1], [U, !0]])
        G?.startsWith("plugins/") && (m.value[G.slice(8)] = T);
    }, { immediate: !0 });
    function Ue(U, $) {
      const G = t.draft.plugins ?? [];
      $ && !ae(U) && (t.draft.plugins = [...G, { use: U }], t.options.some((T) => T.plugin === U && oe(T)) && Ae(U, !0)), $ || (t.draft.plugins = G.filter((T) => T.use !== U), delete t.configs[U], i.value.delete(U), l("validity", U, !0), me(U, []));
    }
    function K(U, $) {
      Ue(U, !1), l("review", $.currentTarget);
    }
    function B(U) {
      return t.configs[U] ?? te(U)?.config ?? V;
    }
    function N(U, $) {
      v.value = "", t.configs[U] = $;
    }
    function w(U) {
      delete t.configs[U], c.value[U] = (c.value[U] ?? 0) + 1;
    }
    function x(U, $) {
      C.value[U.plugin] = Bi(U.config_schema ?? {}, $.errors), P(U.plugin, $.valid);
    }
    function P(U, $) {
      $ ? i.value.delete(U) : i.value.add(U), l("validity", U, $ || !ae(U) || M(U) && !t.configs[U]);
    }
    function O(U) {
      for (const $ of Object.values(te(U)?.projections ?? {})) {
        const G = to($);
        if (G) return G;
      }
    }
    async function H(U) {
      await Bo.confirm({
        header: "Reset background updates?",
        message: "The plugin rebuilds its data from current items or replays retained events.",
        acceptLabel: "Reset background updates",
        rejectLabel: "Cancel"
      }) && await ne(U);
    }
    async function ne(U) {
      if (!k.value) {
        o.value = U, r.value = "", v.value = "";
        try {
          await Jt.configure(t.boardId, U), v.value = "Plugin recovery started.", l("configured");
        } catch ($) {
          r.value = rt($, "Could not recover the plugin.");
        } finally {
          o.value = "";
        }
      }
    }
    return (U, $) => (n(), f("section", _v, [
      r.value ? (n(), f("div", ef, D(r.value), 1)) : I("", !0),
      v.value ? (n(), f("p", tf, D(v.value), 1)) : I("", !0),
      le.value ? (n(), f("p", af, "Plugin changes take effect after you review and apply them.")) : I("", !0),
      !e.options.length && !e.pack ? (n(), f("p", lf, "No installed plugins are visible to you.")) : I("", !0),
      e.pack ? (n(), J(xl, {
        key: 4,
        title: "Pack",
        count: 1
      }, {
        default: j(() => [
          y(Cl, {
            title: e.pack.title,
            description: e.pack.description,
            "expand-label": "Details",
            open: ke("pack", !1),
            "onUpdate:open": $[1] || ($[1] = (G) => m.value.pack = G)
          }, xa({
            status: j(() => [
              y(d(Xe), {
                class: "kx-tag-sm work-plugin-state",
                severity: e.pack.outdated ? "info" : "success",
                value: e.pack.outdated ? "Update available" : "Installed"
              }, null, 8, ["severity", "value"])
            ]),
            default: j(() => [
              $[7] || ($[7] = s("p", { class: "work-muted work-small" }, "The pack set up this board’s item types, workflow and views. Turning off a plugin it needs can remove parts of that setup.", -1)),
              y(Me, {
                class: "work-disclosure work-small",
                label: "Technical details"
              }, {
                default: j(() => [
                  s("dl", of, [
                    s("div", null, [
                      $[4] || ($[4] = s("dt", null, "Pack ID", -1)),
                      s("dd", null, [
                        s("code", null, D(e.pack.id), 1)
                      ])
                    ]),
                    e.pack.version ? (n(), f("div", nf, [
                      $[5] || ($[5] = s("dt", null, "Installed version", -1)),
                      s("dd", null, D(e.pack.version), 1)
                    ])) : I("", !0),
                    $[6] || ($[6] = s("div", null, [
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
              fn: j(() => [
                W("Needs " + D(d(Sl)(e.pack.requires.map(Z))), 1)
              ]),
              key: "0"
            } : void 0,
            e.pack.outdated ? {
              name: "actions",
              fn: j(() => [
                y(d(Q), {
                  label: "Review update",
                  severity: "secondary",
                  outlined: "",
                  size: "small",
                  disabled: !e.pack.canUpgrade,
                  title: e.pack.upgradeReason,
                  onClick: $[0] || ($[0] = (G) => l("upgrade"))
                }, null, 8, ["disabled", "title"])
              ]),
              key: "1"
            } : void 0
          ]), 1032, ["title", "description", "open"])
        ]),
        _: 1
      })) : I("", !0),
      (n(!0), f(_, null, ue(p.value, (G) => (n(), J(xl, {
        key: G.title,
        title: G.title || void 0,
        count: G.title ? G.rows.length : void 0
      }, {
        default: j(() => [
          (n(!0), f(_, null, ue(G.rows, ({ plugin: T, current: X, issue: de, chosen: $e, status: Ce, severity: Ke, title: Ze, configurable: It, filtered: Ft, needs: Qe, usedBy: Lt }) => (n(), J(Cl, {
            key: T.plugin,
            "data-plugin": T.plugin,
            title: Ze,
            description: T.description,
            "expand-label": It || Ft ? "Configure" : "Details",
            "keep-mounted": $e,
            open: ke(T.plugin, de),
            "onUpdate:open": (xe) => Ae(T.plugin, xe)
          }, xa({
            status: j(() => [
              y(d(Xe), {
                class: "kx-tag-sm work-plugin-state",
                severity: Ke,
                value: Ce
              }, null, 8, ["severity", "value"])
            ]),
            default: j(() => [
              de ? (n(), J(d(zo), {
                key: 0,
                class: "work-plugin-issue",
                severity: "warn",
                closable: !1
              }, {
                default: j(() => [
                  s("div", cf, [
                    de.kind === "degraded" ? (n(), f("p", vf, D(O(T.plugin) ?? "A background update reported an error."), 1)) : de.kind === "reset" ? (n(), f("p", ff, "Background updates stopped" + D(O(T.plugin) ? ": " + O(T.plugin) : "."), 1)) : "cause" in de && de.cause ? (n(), f("p", mf, D(de.cause), 1)) : I("", !0),
                    de.kind === "configuration" ? (n(), f("p", pf, "Update the settings below, then review and apply your changes.")) : I("", !0),
                    de.kind === "history" && de.floor !== void 0 ? (n(), f("p", gf, "Earliest retained event sequence is " + D(de.floor) + ".", 1)) : I("", !0),
                    de.kind === "history" ? (n(), f("p", hf, "Ask the plugin maintainer to review the event projection’s start sequence. The plugin needs a declaration that can run with the retained history.")) : I("", !0),
                    s("div", bf, [
                      de.kind === "setup" && X?.active ? (n(), J(d(Q), {
                        key: 0,
                        label: "Retry setup",
                        severity: "secondary",
                        outlined: "",
                        size: "small",
                        disabled: k.value,
                        onClick: (xe) => ne(T.plugin)
                      }, null, 8, ["disabled", "onClick"])) : de.kind === "provider" || de.kind === "degraded" ? (n(), J(d(Q), {
                        key: 1,
                        label: "Check again",
                        severity: "secondary",
                        outlined: "",
                        size: "small",
                        onClick: $[2] || ($[2] = (xe) => l("refresh"))
                      })) : de.kind === "reset" ? (n(), J(d(Q), {
                        key: 2,
                        label: "Reset background updates",
                        severity: "secondary",
                        outlined: "",
                        size: "small",
                        disabled: k.value,
                        onClick: (xe) => H(T.plugin)
                      }, null, 8, ["disabled", "onClick"])) : de.kind === "missing" && $e ? (n(), J(d(Q), {
                        key: 3,
                        label: "Review references",
                        severity: "secondary",
                        outlined: "",
                        size: "small",
                        disabled: S.value,
                        onClick: (xe) => K(T.plugin, xe)
                      }, null, 8, ["disabled", "onClick"])) : I("", !0)
                    ])
                  ])
                ]),
                _: 2
              }, 1024)) : I("", !0),
              It ? (n(), f("section", {
                key: 1,
                class: "work-stack work-plugin-config",
                "aria-label": Ze + " settings"
              }, [
                d(u).state.value === "ready" ? (n(), f("wc-schema-form", {
                  key: c.value[T.plugin],
                  class: "work-config-widget",
                  disabled: k.value || void 0,
                  schema: JSON.stringify(T.config_schema),
                  config: JSON.stringify(B(T.plugin)),
                  choices: A.value,
                  onConfigChanged: (xe) => N(T.plugin, d(Ka)(xe)),
                  onValidityChanged: (xe) => x(T, d(Ka)(xe)),
                  onVnodeBeforeUnmount: (xe) => x(T, { valid: !0, errors: {} })
                }, null, 40, kf)) : d(u).state.value === "failed" ? (n(), f("p", wf, [
                  $[8] || ($[8] = W("The configuration form is unavailable. ", -1)),
                  y(d(Q), {
                    label: "Reload configuration form",
                    severity: "secondary",
                    outlined: "",
                    size: "small",
                    onClick: $[3] || ($[3] = (xe) => d(u).load())
                  })
                ])) : (n(), f("p", $f, "The configuration form is loading.")),
                s("div", Vf, [
                  y(d(Q), {
                    label: "Restore saved settings",
                    severity: "secondary",
                    outlined: "",
                    size: "small",
                    disabled: !!o.value || e.disabled,
                    onClick: (xe) => w(T.plugin)
                  }, null, 8, ["disabled", "onClick"])
                ])
              ], 8, yf)) : I("", !0),
              Ft ? (n(), f("section", xf, [
                $[9] || ($[9] = s("h4", null, "Filters", -1)),
                $[10] || ($[10] = s("p", { class: "work-muted work-small" }, "Choose which filters people can use to narrow down work on this board.", -1)),
                y(pt, {
                  label: "Available filters",
                  disabled: !!o.value || e.disabled || !$e,
                  options: ve(T.plugin).map((xe) => ({ value: xe.id, label: xe.title })),
                  "model-value": e.draft.scopes?.filter((xe) => ve(T.plugin).some((Dt) => Dt.id === xe)),
                  "onUpdate:modelValue": (xe) => me(T.plugin, xe)
                }, null, 8, ["disabled", "options", "model-value", "onUpdate:modelValue"])
              ])) : I("", !0),
              !It && !Ft && !de ? (n(), f("p", Cf, D($e ? "This plugin has no settings for this board." : "Turn the plugin on to use it on this board."), 1)) : I("", !0),
              y(Me, {
                class: "work-disclosure work-small",
                label: "Technical details"
              }, {
                default: j(() => [
                  s("dl", Sf, [
                    s("div", null, [
                      $[11] || ($[11] = s("dt", null, "Plugin ID", -1)),
                      s("dd", null, [
                        s("code", null, D(T.plugin), 1)
                      ])
                    ]),
                    (X?.interface_version ?? T.interface_version) != null ? (n(), f("div", Tf, [
                      $[12] || ($[12] = s("dt", null, "Interface version", -1)),
                      s("dd", null, D(X?.interface_version ?? T.interface_version), 1)
                    ])) : I("", !0),
                    X?.version ? (n(), f("div", If, [
                      $[13] || ($[13] = s("dt", null, "Active schema version", -1)),
                      s("dd", null, D(X.version), 1)
                    ])) : I("", !0),
                    T.installed ? (n(), f("div", Df, [...$[14] || ($[14] = [
                      s("dt", null, "Configuration tool", -1),
                      s("dd", null, [
                        s("code", null, "WorkConfigurePlugin")
                      ], -1)
                    ])])) : I("", !0),
                    T.tools.length ? (n(), f("div", Af, [
                      $[15] || ($[15] = s("dt", null, "Plugin tools", -1)),
                      s("dd", null, [
                        (n(!0), f(_, null, ue(T.tools, (xe) => (n(), f("code", {
                          key: xe,
                          class: "work-block"
                        }, D(xe), 1))), 128))
                      ])
                    ])) : I("", !0),
                    (n(!0), f(_, null, ue(X?.projections, (xe, Dt) => (n(), f("div", { key: Dt }, [
                      s("dt", null, D(d(Oe)(Dt)), 1),
                      s("dd", null, D(d(Xv)(xe, e.schema.as_of)) + " · Indexed through " + D(xe.last_seq) + " of " + D(e.schema.as_of) + " events.", 1)
                    ]))), 128))
                  ])
                ]),
                _: 2
              }, 1024)
            ]),
            _: 2
          }, [
            Qe.length || Lt.length || $e && C.value[T.plugin] ? {
              name: "meta",
              fn: j(() => [
                Qe.length ? (n(), f("span", sf, "Needs " + D(d(Sl)(Qe)), 1)) : I("", !0),
                Qe.length && Lt.length ? (n(), f("span", rf, " · ")) : I("", !0),
                Lt.length ? (n(), f("span", df, "Used by " + D(d(Sl)(Lt)), 1)) : I("", !0),
                $e && C.value[T.plugin] ? (n(), f("span", uf, D(C.value[T.plugin]), 1)) : I("", !0)
              ]),
              key: "0"
            } : void 0,
            de?.kind !== "missing" ? {
              name: "actions",
              fn: j(() => [
                y(d(lt), {
                  "model-value": $e,
                  "aria-label": "Enable " + Ze,
                  disabled: S.value || !!T.problem && !$e,
                  "onUpdate:modelValue": (xe) => Ue(T.plugin, xe)
                }, null, 8, ["model-value", "aria-label", "disabled", "onUpdate:modelValue"])
              ]),
              key: "1"
            } : void 0
          ]), 1032, ["data-plugin", "title", "description", "expand-label", "keep-mounted", "open", "onUpdate:open"]))), 128))
        ]),
        _: 2
      }, 1032, ["title", "count"]))), 128)),
      q.value.length ? (n(), J(xl, {
        key: 5,
        title: "Unavailable",
        count: q.value.length
      }, {
        default: j(() => [
          (n(!0), f(_, null, ue(q.value, (G) => (n(), J(Cl, {
            key: G.use,
            title: "Unavailable plugin",
            description: "This board still references a plugin that is no longer installed."
          }, {
            status: j(() => [
              y(d(Xe), {
                class: "kx-tag-sm work-plugin-state",
                severity: "danger",
                value: "Not installed"
              })
            ]),
            actions: j(() => [
              y(d(Q), {
                label: "Review references",
                severity: "secondary",
                outlined: "",
                size: "small",
                disabled: S.value,
                onClick: (T) => K(G.use, T)
              }, null, 8, ["disabled", "onClick"])
            ]),
            _: 2
          }, 1024))), 128))
        ]),
        _: 1
      }, 8, ["count"])) : I("", !0),
      E.value.length ? (n(), J(Me, {
        key: 6,
        class: "work-settings-card work-disclosure",
        label: "Unavailable query filters"
      }, {
        default: j(() => [
          $[16] || ($[16] = s("p", { class: "work-muted" }, "These filters came from a plugin that is unavailable. Remove one to stop using it on this board.", -1)),
          (n(!0), f(_, null, ue(E.value, (G, T) => (n(), J(d(Q), {
            key: G,
            label: "Remove unavailable filter " + (T + 1),
            severity: "secondary",
            text: "",
            onClick: (X) => e.draft.scopes = e.draft.scopes?.filter((de) => de !== G)
          }, null, 8, ["label", "onClick"]))), 128))
        ]),
        _: 1
      })) : I("", !0)
    ]));
  }
}), Uf = { class: "system-section-head" }, Ef = { class: "system-section-head-text" }, Of = {
  key: 0,
  class: "kx-head-actions"
}, Rf = /* @__PURE__ */ ye({
  __name: "SettingsSectionHead",
  props: {
    title: {},
    description: {}
  },
  setup(e) {
    return (a, t) => (n(), f("header", Uf, [
      s("div", Ef, [
        s("h1", null, D(e.title), 1),
        s("p", null, D(e.description), 1)
      ]),
      a.$slots.actions ? (n(), f("div", Of, [
        Be(a.$slots, "actions")
      ])) : I("", !0)
    ]));
  }
}), Pf = /* @__PURE__ */ ye({
  __name: "SettingsDraftActions",
  props: {
    busy: { type: Boolean },
    discardDisabled: { type: Boolean },
    reviewDisabled: { type: Boolean }
  },
  emits: ["discard", "review"],
  setup(e) {
    return (a, t) => (n(), f(_, null, [
      y(d(Xe), {
        severity: "warn",
        value: "Unsaved changes"
      }),
      y(d(Q), {
        label: "Discard",
        type: "button",
        severity: "secondary",
        outlined: "",
        disabled: e.busy || e.discardDisabled,
        onClick: t[0] || (t[0] = (l) => a.$emit("discard"))
      }, {
        icon: j(() => [
          y(d(fe), {
            icon: "tabler:restore",
            "aria-hidden": "true"
          })
        ]),
        _: 1
      }, 8, ["disabled"]),
      y(d(Q), {
        label: "Review changes",
        type: "button",
        disabled: e.busy || e.reviewDisabled,
        loading: e.busy,
        onClick: t[1] || (t[1] = (l) => a.$emit("review", l.currentTarget))
      }, null, 8, ["disabled", "loading"])
    ], 64));
  }
}), Nf = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, Mf = ["config"], Ff = /* @__PURE__ */ ye({
  __name: "BoardShare",
  props: {
    board: {},
    busy: { type: Boolean }
  },
  emits: ["shared"],
  setup(e) {
    const a = e, t = z(!1), l = z(!1), o = z("");
    async function r() {
      const m = a.board;
      if (!(a.busy || l.value)) {
        l.value = !0, o.value = "";
        try {
          const g = await Rt("kickside-share");
          if (a.board.board_id !== m.board_id) return;
          g ? t.value = !0 : o.value = "Sharing is unavailable. Try opening it again.";
        } finally {
          l.value = !1;
        }
      }
    }
    Ve(() => a.board.board_id, () => {
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
    return (m, g) => (n(), f(_, null, [
      y(d(Q), {
        label: "Share board",
        severity: "secondary",
        outlined: "",
        loading: l.value,
        disabled: e.busy,
        onClick: r
      }, {
        icon: j(() => [
          y(d(fe), {
            icon: "tabler:share",
            "aria-hidden": "true"
          })
        ]),
        _: 1
      }, 8, ["loading", "disabled"]),
      o.value ? (n(), f("p", Nf, D(o.value), 1)) : I("", !0),
      t.value ? (n(), f("kickside-share", {
        key: 1,
        config: v.value,
        onClose: g[0] || (g[0] = (i) => t.value = !1),
        onChanged: g[1] || (g[1] = (i) => m.$emit("shared"))
      }, null, 40, Mf)) : I("", !0)
    ], 64));
  }
}), Lf = {
  class: "work-stack",
  "aria-label": "Board visibility"
}, Bf = { class: "work-stack work-tight" }, zf = {
  key: 0,
  class: "work-settings-list"
}, jf = { class: "work-row-main" }, qf = { class: "work-small work-muted" }, Wf = { class: "work-row-control" }, Gf = { class: "work-row" }, Kf = /* @__PURE__ */ ye({
  __name: "VisibilityEditor",
  props: {
    draft: {},
    boardId: {}
  },
  emits: ["validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = F(() => t.draft.visibility), r = F(() => (t.draft.fields ?? []).filter((b) => b.form === "text" && (!b.cardinality || b.cardinality === "one") && b.type !== "rollup" && b.index !== "number" && b.config?.case !== "insensitive")), v = F(() => r.value.find((b) => b.code === o.value?.field)?.type !== "option");
    function m(b) {
      if (o.value?.levels.some((p) => p.id === b)) return "This level is already in use.";
    }
    function g(b) {
      o.value?.levels.push({ id: b, holders: [] });
    }
    function i(b) {
      if (!b) {
        delete t.draft.visibility;
        return;
      }
      const p = r.value.find((k) => k.code === b);
      t.draft.visibility = { field: b, levels: (p?.options ?? []).map((k) => ({ id: k.id, holders: [] })) };
    }
    function c(b, p) {
      const k = o.value?.levels.find((S) => S.id === b);
      k && (k.holders = p ?? []);
    }
    function u(b) {
      if (!b || typeof b != "object" || Array.isArray(b)) return !1;
      const p = Object.entries(b);
      if (p.length !== 1) return !1;
      const [k, S] = p[0];
      return ["group", "user", "service", "field"].includes(k) && typeof S == "string" && S.length > 0;
    }
    function C(b) {
      return !!b && typeof b == "object" && "field" in b && typeof b.field == "string" && (!("bypass" in b) || b.bypass === "admin") && "levels" in b && Array.isArray(b.levels) && b.levels.every((p) => !!p && typeof p == "object" && "id" in p && typeof p.id == "string" && p.id.length > 0 && "holders" in p && Array.isArray(p.holders) && p.holders.every(u));
    }
    function h(b) {
      if (b !== void 0 && !C(b)) return "Enter a field and levels with valid holder rules. Omit bypass or set it to admin.";
      t.draft.visibility = b;
    }
    return (b, p) => (n(), f("section", Lf, [
      p[6] || (p[6] = s("h3", { class: "work-group-title" }, "Board visibility", -1)),
      p[7] || (p[7] = s("p", { class: "work-small work-muted" }, "Restrict items by their visibility level. People still need access to the board.", -1)),
      s("label", Bf, [
        p[4] || (p[4] = W("Visibility field ", -1)),
        y(d(pe), {
          "aria-label": "Visibility field",
          "model-value": o.value?.field ?? "",
          placeholder: "No additional restriction",
          options: [{ label: "No additional restriction", value: "" }, ...r.value.map((k) => ({ label: d(He)(k), value: k.code }))],
          optionLabel: "label",
          optionValue: "value",
          appendTo: "self",
          "onUpdate:modelValue": i
        }, null, 8, ["model-value", "options"])
      ]),
      o.value ? (n(), f(_, { key: 0 }, [
        o.value.levels.length ? (n(), f("div", zf, [
          (n(!0), f(_, null, ue(o.value.levels, (k, S) => (n(), f("div", {
            key: k.id,
            class: "work-settings-row"
          }, [
            s("div", jf, [
              s("strong", null, D(r.value.find((V) => V.code === o.value.field)?.options?.find((V) => V.id === k.id)?.label || k.id), 1),
              s("p", qf, "Level " + D(S + 1), 1)
            ]),
            s("div", Wf, [
              y(Go, {
                "board-id": e.boardId,
                label: "Who can see these items",
                "model-value": k.holders,
                "onUpdate:modelValue": (V) => c(k.id, V),
                onValidity: p[0] || (p[0] = (V) => l("validity", V))
              }, null, 8, ["board-id", "model-value", "onUpdate:modelValue"])
            ])
          ]))), 128))
        ])) : I("", !0),
        v.value ? (n(), J(Ca, {
          key: o.value.field,
          action: "Add level",
          label: "New visibility level",
          validate: m,
          onAdd: g
        })) : I("", !0),
        s("label", Gf, [
          y(d(lt), {
            "model-value": o.value.bypass === "admin",
            "onUpdate:modelValue": p[1] || (p[1] = (k) => k ? o.value.bypass = "admin" : delete o.value.bypass)
          }, null, 8, ["model-value"]),
          p[5] || (p[5] = W(" Board administrators can see every level ", -1))
        ]),
        y(d(Q), {
          label: "Remove visibility restriction",
          severity: "secondary",
          text: "",
          onClick: p[2] || (p[2] = (k) => delete e.draft.visibility)
        })
      ], 64)) : I("", !0),
      y(Mt, {
        label: "Visibility rules",
        "model-value": o.value,
        shape: "object",
        example: { field: "visibility", levels: [{ id: "internal", holders: [] }], bypass: "admin" },
        commit: h,
        onValidity: p[3] || (p[3] = (k) => l("validity", k))
      }, null, 8, ["model-value"])
    ]));
  }
}), Hf = { class: "work-ia-section" }, Jf = {
  class: "work-settings-list",
  "aria-labelledby": "work-sharing-title"
}, Yf = { class: "work-settings-row" }, Xf = { class: "work-row-main" }, Zf = {
  key: 0,
  class: "work-muted work-small"
}, Qf = {
  key: 0,
  class: "work-member-preview",
  "aria-label": "People and groups with direct access"
}, _f = { class: "work-spacer" }, em = {
  key: 1,
  class: "work-settings-row work-muted work-small"
}, tm = {
  key: 2,
  class: "work-settings-row work-muted"
}, am = {
  key: 3,
  class: "work-settings-row"
}, lm = {
  key: 4,
  class: "work-settings-row work-muted",
  role: "status"
}, om = /* @__PURE__ */ ye({
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
    const a = e, t = z(), l = z([]), o = F(() => t.value?.filter((b) => b.subject_type === "group").length ?? 0), r = F(() => (t.value?.length ?? 0) - o.value), v = F(() => [...t.value ?? []].sort((b, p) => +!!p.owner - +!!b.owner || p.access_mask - b.access_mask).slice(0, 6).map((b) => ({ ...b, permissions: c(b) }))), m = F(() => v.value.map((b) => ({ id: b.subject_id, kind: b.subject_type ?? "user" }))), g = Lo(() => a.boardId, m);
    function i(b) {
      return b.full_name || g.label({ id: b.subject_id, kind: b.subject_type ?? "user", email: b.email });
    }
    function c(b) {
      return b.owner ? "Owner" : l.value.filter((p) => (b.access_mask & p.bit) === p.bit).map((p) => p.label).join(", ");
    }
    const u = z(!1), C = ia();
    async function h() {
      const b = C();
      u.value = !1;
      try {
        const [{ data: p }, k] = await Promise.all([
          Dl.get("/api/v1/component-access/grants/" + encodeURIComponent(a.boardId)),
          Dl.get("/api/v1/components/access-model")
        ]);
        if (!b()) return;
        if (!p?.success || !Array.isArray(p.access)) throw new Error("Grants unavailable");
        t.value = p.access, l.value = k.data?.success && Array.isArray(k.data.capabilities) ? k.data.capabilities : [];
      } catch {
        b() && (t.value = void 0, u.value = !0);
      }
    }
    return ql(() => C()), Ve(() => [a.active, a.boardId], () => {
      a.active && h();
    }, { immediate: !0 }), (b, p) => (n(), f("section", Hf, [
      s("section", Jf, [
        s("div", Yf, [
          s("div", Xf, [
            p[1] || (p[1] = s("h3", {
              id: "work-sharing-title",
              class: "work-row-title"
            }, "Members and sharing", -1)),
            t.value ? (n(), f("p", Zf, D(r.value) + " " + D(r.value === 1 ? "person" : "people") + " and " + D(o.value) + " " + D(o.value === 1 ? "group" : "groups") + " with direct access", 1)) : I("", !0)
          ]),
          e.board ? (n(), J(Ff, {
            key: 0,
            board: e.board,
            busy: e.busy,
            onShared: h
          }, null, 8, ["board", "busy"])) : I("", !0)
        ]),
        v.value.length ? (n(), f("ul", Qf, [
          (n(!0), f(_, null, ue(v.value, (k) => (n(), f("li", {
            key: k.subject_type + k.subject_id,
            class: "work-settings-row"
          }, [
            y(d(fe), {
              icon: k.subject_type === "group" ? "tabler:users" : "tabler:user",
              "aria-hidden": "true"
            }, null, 8, ["icon"]),
            s("strong", _f, D(i(k)), 1),
            k.permissions ? (n(), J(d(Xe), {
              key: 0,
              class: "kx-tag-sm",
              severity: "secondary",
              value: k.permissions
            }, null, 8, ["value"])) : I("", !0)
          ]))), 128))
        ])) : I("", !0),
        t.value && t.value.length > v.value.length ? (n(), f("p", em, " See all " + D(t.value.length) + " people and groups under Share board. ", 1)) : t.value && !t.value.length ? (n(), f("p", tm, "No direct grants yet.")) : u.value ? (n(), f("div", am, [
          p[2] || (p[2] = s("p", {
            class: "work-spacer work-muted",
            role: "alert"
          }, "Member summary is unavailable.", -1)),
          y(d(Q), {
            label: "Reload members",
            severity: "secondary",
            text: "",
            onClick: h
          })
        ])) : t.value ? I("", !0) : (n(), f("p", lm, "Loading members…"))
      ]),
      y(Me, {
        class: "work-disclosure work-visibility-disclosure",
        label: e.draft.visibility ? "Advanced · Item visibility rules set" : "Advanced · Item visibility"
      }, {
        default: j(() => [
          y(Kf, {
            "board-id": e.boardId,
            draft: e.draft,
            onValidity: p[0] || (p[0] = (k) => b.$emit("validity", k))
          }, null, 8, ["board-id", "draft"])
        ]),
        _: 1
      }, 8, ["label"])
    ]));
  }
}), im = { class: "work-settings-row" }, nm = ["for"], sm = { class: "work-settings-row" }, rm = { class: "work-row-main" }, dm = ["id"], um = { class: "work-settings-grid" }, cm = { class: "work-stack work-tight" }, vm = { class: "work-stack work-tight" }, fm = ["value", "inert"], mm = {
  key: 1,
  class: "work-muted work-small"
}, pm = {
  key: 0,
  class: "work-settings-row"
}, gm = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, hm = {
  key: 1,
  class: "work-muted work-small",
  role: "status"
}, bm = {
  key: 1,
  class: "work-board-identity work-stack work-tight"
}, ym = { class: "work-stack work-tight" }, km = { class: "work-stack work-tight" }, wm = { class: "work-stack work-tight" }, $m = ["value", "inert"], Vm = {
  key: 1,
  class: "work-muted work-small"
}, xm = { class: "work-row" }, Cm = { class: "work-row" }, Sm = { class: "work-row work-board-title" }, Tm = {
  key: 1,
  class: "work-identity-actions"
}, Im = ["title"], Dm = {
  key: 2,
  class: "kx-err work-inline",
  role: "alert"
}, Am = {
  key: 3,
  class: "work-muted work-small",
  role: "status"
}, Um = /* @__PURE__ */ ye({
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
    const t = e, l = a, o = z(!1), r = z(!1), v = z(""), m = z(""), g = z(""), i = z(""), c = z(!1), u = z(!1), C = z(""), h = z(""), b = F(() => t.board?.access?.admin === !0), p = gt(), k = gt(), S = z({ title: "", description: "", icon: "", app: "" }), V = F(() => [
      { id: "", title: "Default app" },
      ...t.boardApps ?? [],
      ...t.board?.ui_app && !t.boardApps?.some((R) => R.id === t.board?.ui_app) ? [{ id: t.board.ui_app, title: t.boardApps ? "Unavailable app" : "Configured board app", disabled: !0 }] : []
    ]), A = F(() => V.value.find((R) => R.id === i.value)?.title), E = F(() => !!t.boardApps?.length || !!t.board?.ui_app), q = F(() => ({
      title: t.board?.title ?? "",
      icon: t.board?.icon ?? "",
      description: t.board?.description ?? "",
      app: t.board?.ui_app ?? ""
    }));
    function le() {
      S.value = q.value, v.value = q.value.title, g.value = q.value.icon, m.value = q.value.description, i.value = q.value.app;
    }
    function Z() {
      Rt("wc-icon-picker").then((R) => c.value = R);
    }
    function se() {
      le(), C.value = "", h.value = "", o.value = !0, Z();
    }
    const ce = F(() => {
      const R = {};
      return v.value.trim() !== S.value.title && (R.title = v.value.trim()), m.value !== S.value.description && (R.description = m.value), g.value !== S.value.icon && (R.icon = g.value), i.value !== S.value.app && (R.ui_app = i.value), R;
    }), ve = F(() => (t.detail || o.value) && Object.keys(ce.value).length > 0);
    Ve(q, () => {
      t.detail && !ve.value && le();
    }, { immediate: !0 }), Ve(r, (R) => {
      R && Z();
    }), Ve(b, (R) => {
      R || me();
    }), Ve(ve, (R) => l("dirty-change", R));
    function me() {
      o.value = !1, C.value = "", h.value = "", le();
    }
    async function oe() {
      if (!b.value || !t.board || u.value || !v.value.trim()) return;
      const R = ce.value;
      if (!Object.keys(R).length) {
        o.value = !1, h.value = "Nothing changed.";
        return;
      }
      u.value = !0, C.value = "";
      try {
        const te = await Et.updateBoard(t.board.board_id, R);
        v.value = v.value.trim(), S.value = { title: v.value, description: m.value, icon: g.value, app: i.value }, o.value = !1, h.value = te.status === "unchanged" ? "Nothing changed." : "Board saved.", l("saved");
      } catch (te) {
        C.value = rt(te, "Could not save the board.");
      } finally {
        u.value = !1;
      }
    }
    return (R, te) => e.detail ? (n(), f("form", {
      key: 0,
      class: "work-board-identity",
      "aria-label": "Edit board details",
      onSubmit: Pe(oe, ["prevent"])
    }, [
      s("div", im, [
        s("label", {
          for: d(p),
          class: "work-row-main work-row-title"
        }, "Board name", 8, nm),
        y(d(Ie), {
          id: d(p),
          modelValue: v.value,
          "onUpdate:modelValue": te[0] || (te[0] = (M) => v.value = M),
          required: "",
          disabled: u.value || !b.value
        }, null, 8, ["id", "modelValue", "disabled"])
      ]),
      s("div", sm, [
        s("div", rm, [
          s("h3", {
            class: "work-row-title",
            id: d(k)
          }, "Board app", 8, dm),
          te[9] || (te[9] = s("p", { class: "work-muted work-small" }, "Opens the board from Work navigation.", -1))
        ]),
        y(d(pe), {
          modelValue: i.value,
          "onUpdate:modelValue": te[1] || (te[1] = (M) => i.value = M),
          "aria-labelledby": d(k),
          options: V.value,
          placeholder: A.value,
          optionLabel: "title",
          optionValue: "id",
          optionDisabled: "disabled",
          appendTo: "self",
          disabled: u.value || !b.value || !E.value
        }, null, 8, ["modelValue", "aria-labelledby", "options", "placeholder", "disabled"])
      ]),
      Be(R.$slots, "default"),
      y(Me, {
        open: r.value,
        "onUpdate:open": te[4] || (te[4] = (M) => r.value = M),
        class: "work-board-appearance",
        label: "Board description and icon"
      }, {
        default: j(() => [
          s("div", um, [
            s("label", cm, [
              te[10] || (te[10] = W("Description", -1)),
              y(d(sa), {
                modelValue: m.value,
                "onUpdate:modelValue": te[2] || (te[2] = (M) => m.value = M),
                rows: "1",
                disabled: u.value || !b.value
              }, null, 8, ["modelValue", "disabled"])
            ]),
            s("div", vm, [
              te[11] || (te[11] = s("span", null, "Board icon", -1)),
              c.value ? (n(), f("wc-icon-picker", {
                key: 0,
                value: g.value,
                fallback: "tabler:layout-kanban",
                inert: u.value || !b.value || void 0,
                onSelect: te[3] || (te[3] = (M) => g.value = M.detail)
              }, null, 40, fm)) : (n(), f("p", mm, "The icon picker is unavailable."))
            ])
          ])
        ]),
        _: 1
      }, 8, ["open"]),
      ve.value || C.value || h.value ? (n(), f("div", pm, [
        C.value ? (n(), f("p", gm, D(C.value), 1)) : h.value && !ve.value ? (n(), f("p", hm, D(h.value), 1)) : I("", !0),
        ve.value ? (n(), f(_, { key: 2 }, [
          y(d(Q), {
            label: "Save board details",
            type: "submit",
            size: "small",
            disabled: !v.value.trim() || u.value || !b.value,
            loading: u.value
          }, null, 8, ["disabled", "loading"]),
          y(d(Q), {
            label: "Cancel",
            type: "button",
            severity: "secondary",
            text: "",
            size: "small",
            disabled: u.value,
            onClick: me
          }, null, 8, ["disabled"])
        ], 64)) : I("", !0)
      ])) : I("", !0)
    ], 32)) : (n(), f("div", bm, [
      o.value ? (n(), f("form", {
        key: 0,
        class: "work-identity-edit",
        "aria-label": "Edit board",
        onClick: te[8] || (te[8] = Pe(() => {
        }, ["stop"])),
        onSubmit: Pe(oe, ["prevent"])
      }, [
        s("label", ym, [
          te[12] || (te[12] = W("Title", -1)),
          y(d(Ie), {
            modelValue: v.value,
            "onUpdate:modelValue": te[5] || (te[5] = (M) => v.value = M),
            required: "",
            autofocus: "",
            disabled: u.value
          }, null, 8, ["modelValue", "disabled"])
        ]),
        s("label", km, [
          te[13] || (te[13] = W("Description", -1)),
          y(d(sa), {
            modelValue: m.value,
            "onUpdate:modelValue": te[6] || (te[6] = (M) => m.value = M),
            rows: "1",
            disabled: u.value
          }, null, 8, ["modelValue", "disabled"])
        ]),
        s("div", wm, [
          te[14] || (te[14] = s("span", null, "Board icon", -1)),
          c.value ? (n(), f("wc-icon-picker", {
            key: 0,
            value: g.value,
            fallback: "tabler:layout-kanban",
            inert: u.value || void 0,
            onSelect: te[7] || (te[7] = (M) => g.value = M.detail)
          }, null, 40, $m)) : (n(), f("p", Vm, "The icon picker is unavailable."))
        ]),
        s("div", xm, [
          y(d(Q), {
            label: "Save",
            severity: "secondary",
            type: "submit",
            disabled: !v.value.trim() || u.value,
            loading: u.value,
            outlined: ""
          }, {
            icon: j(() => [
              y(d(fe), {
                icon: "tabler:device-floppy",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled", "loading"]),
          y(d(Q), {
            label: "Cancel",
            severity: "secondary",
            disabled: u.value,
            onClick: me,
            outlined: ""
          }, {
            icon: j(() => [
              y(d(fe), {
                icon: "tabler:x",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled"])
        ])
      ], 32)) : (n(), f(_, { key: 1 }, [
        s("div", Cm, [
          s("div", Sm, [
            e.board?.icon ? (n(), J(d(fe), {
              key: 0,
              icon: e.board.icon,
              "aria-hidden": "true"
            }, null, 8, ["icon"])) : I("", !0),
            (n(), J(Va(e.compact ? "h2" : "h1"), {
              class: dt(e.compact ? "kx-card-name" : "kx-title")
            }, {
              default: j(() => [
                W(D(e.board?.title || "Untitled board"), 1)
              ]),
              _: 1
            }, 8, ["class"]))
          ]),
          e.compact ? Be(R.$slots, "title-end", {}, void 0, void 0, 0) : I("", !0),
          e.compact ? (n(), f("span", Tm, [
            b.value ? (n(), J(d(Q), {
              key: 0,
              severity: "secondary",
              text: "",
              size: "small",
              onClick: Pe(se, ["stop"]),
              "aria-label": "Edit board"
            }, {
              default: j(() => [
                y(d(fe), {
                  icon: "tabler:pencil",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            })) : I("", !0),
            Be(R.$slots, "actions")
          ])) : b.value ? (n(), J(d(Q), {
            key: 2,
            severity: "secondary",
            text: "",
            size: "small",
            onClick: Pe(se, ["stop"]),
            "aria-label": "Edit board"
          }, {
            default: j(() => [
              y(d(fe), {
                icon: "tabler:pencil",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          })) : I("", !0),
          e.compact ? I("", !0) : Be(R.$slots, "title-end", {}, void 0, void 0, 3)
        ]),
        !e.compact && (e.subtitle || e.board?.description) ? (n(), f("p", {
          key: 0,
          class: "kx-head-sub",
          title: e.subtitle || e.board?.description
        }, D(e.subtitle || e.board?.description), 9, Im)) : I("", !0)
      ], 64)),
      C.value ? (n(), f("p", Dm, D(C.value), 1)) : I("", !0),
      h.value ? (n(), f("p", Am, D(h.value), 1)) : I("", !0)
    ]));
  }
}), Em = { class: "work-ia-section work-ia-general" }, Om = {
  class: "work-settings-list work-board-details",
  "aria-label": "Board details"
}, Rm = {
  key: 0,
  class: "work-settings-row"
}, Pm = { class: "work-settings-row" }, Nm = { class: "work-row-main" }, Mm = ["for"], Fm = { class: "work-muted work-small" }, Lm = {
  class: "work-board-summary work-row work-wrap work-small",
  "aria-label": "Board summary"
}, Bm = { class: "work-muted" }, zm = { key: 0 }, jm = { key: 1 }, qm = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, Wm = {
  key: 0,
  class: "work-stack work-tight"
}, Gm = {
  key: 0,
  class: "work-stack work-tight"
}, Km = {
  key: 1,
  class: "work-muted"
}, Hm = { class: "work-stack work-tight" }, Jm = { class: "work-spacer" }, Ym = /* @__PURE__ */ ye({
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
    const a = e, t = gt(), l = {
      comments_per_item: "Comments per item",
      audit: "Change history",
      audit_days: "Change history retention",
      interval_days: "Time-in-state history retention",
      trash_days: "Trash retention",
      tombstone_days: "Deletion record retention"
    }, o = F(() => Object.keys(l).filter((h) => a.draft.policy?.[h] !== void 0));
    function r(h) {
      const b = a.draft.policy?.[h];
      return h === "audit" ? b === "off" ? "Off" : "Track field changes" : h === "comments_per_item" ? b : b === 0 ? h === "audit_days" || h === "interval_days" ? "365 days" : "Clean up immediately" : b === 1 ? "1 day" : b + " days";
    }
    const v = z(), m = z(!1);
    let g = "";
    Ve([() => a.active, () => a.board?.board_id, () => a.schema.generation], async ([h, b, p], k, S) => {
      if (!h || !b || g === b + "/" + p) return;
      v.value = void 0, m.value = !1;
      let V = !0;
      S(() => V = !1);
      try {
        const A = await Promise.all(Array.from(
          { length: Math.min(3, Math.max(0, p - 1)) },
          (E, q) => Et.schema(b, p - q - 1)
        ));
        V && (v.value = A, g = b + "/" + p);
      } catch {
        V && (m.value = !0);
      }
    }, { immediate: !0 });
    function i(h) {
      return JSON.stringify(h, (b, p) => p && typeof p == "object" && !Array.isArray(p) ? Object.fromEntries(Object.entries(p).sort(([k], [S]) => k.localeCompare(S))) : p);
    }
    function c(h, b) {
      if (!b) return ["Initial board setup"];
      const p = h.declaration, k = b.declaration, S = [], V = [
        ["Fields", p.fields, k.fields],
        ["Item types", p.item_types, k.item_types],
        ["Workflow", p.processes, k.processes],
        ["Links", p.relation_types, k.relation_types],
        ["Plugins and filters", [p.plugins, p.scopes], [k.plugins, k.scopes]],
        ["Item visibility", p.visibility, k.visibility],
        ["Board rules", p.policy, k.policy],
        ["Starting pack", h.pack, b.pack],
        ["Item key prefix", h.key_prefix, b.key_prefix]
      ];
      if (i(p.fields) !== i(k.fields)) {
        const E = p.fields?.filter((q) => !k.fields?.some((le) => le.code === q.code)) ?? [];
        E.length === 1 && S.push("Added " + He(E[0]));
      }
      const A = V.filter(([, E, q]) => i(E) !== i(q)).map(([E]) => E).filter((E) => E !== "Fields" || !S.length);
      return A.length && S.push(A.join(", ") + " updated"), S.length ? S : ["Board setup updated"];
    }
    const u = z(!1), C = F(() => {
      if (!v.value || a.schema.generation < 1) return [];
      const h = [a.schema, ...v.value];
      return h.slice(0, 3).map((b, p) => c(b, h[p + 1]));
    });
    return (h, b) => (n(), f("section", Em, [
      s("section", Om, [
        e.board ? (n(), f("div", Rm, [
          b[8] || (b[8] = s("div", { class: "work-row-main" }, [
            s("h3", { class: "work-row-title" }, "Board access"),
            s("p", { class: "work-muted work-small" }, "Give people and groups access to this board.")
          ], -1)),
          s("div", null, [
            y(d(Q), {
              label: "Share board",
              type: "button",
              severity: "secondary",
              outlined: "",
              onClick: b[0] || (b[0] = (p) => h.$emit("share"))
            }, {
              icon: j(() => [
                y(d(fe), {
                  icon: "tabler:share",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            })
          ])
        ])) : I("", !0),
        (n(), J(Um, {
          key: e.board?.board_id,
          board: e.board,
          "board-apps": e.boardApps,
          detail: "",
          onDirtyChange: b[2] || (b[2] = (p) => h.$emit("dirty-change", p)),
          onSaved: b[3] || (b[3] = (p) => h.$emit("saved"))
        }, {
          default: j(() => [
            s("div", Pm, [
              s("div", Nm, [
                s("label", {
                  class: "work-row-title",
                  for: d(t)
                }, "Item key prefix", 8, Mm),
                s("p", Fm, "Shown on items, for example " + D(e.draft.key_prefix || "WORK") + "-1.", 1)
              ]),
              y(d(Ie), {
                id: d(t),
                modelValue: e.draft.key_prefix,
                "onUpdate:modelValue": b[1] || (b[1] = (p) => e.draft.key_prefix = p),
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
      s("section", Lm, [
        s("p", Bm, [
          e.board?.open_count !== void 0 && e.board.item_count !== void 0 ? (n(), f("span", zm, D(e.board.open_count) + " open · " + D(e.board.item_count) + " total · ", 1)) : I("", !0),
          W(" " + D(e.packTitle || "No pack installed"), 1),
          e.outdated ? (n(), f("span", jm, " · Update available")) : I("", !0)
        ]),
        e.packError ? (n(), f("p", qm, D(e.packError), 1)) : I("", !0),
        e.packError ? (n(), J(d(Q), {
          key: 1,
          label: "Reload packs",
          severity: "secondary",
          outlined: "",
          size: "small",
          onClick: b[4] || (b[4] = (p) => h.$emit("retry"))
        })) : I("", !0),
        e.packTitle ? e.outdated ? (n(), J(d(Q), {
          key: 3,
          label: "Update pack",
          severity: "secondary",
          outlined: "",
          size: "small",
          disabled: !e.canUpgrade,
          title: e.upgradeReason,
          onClick: b[6] || (b[6] = (p) => h.$emit("upgrade"))
        }, null, 8, ["disabled", "title"])) : I("", !0) : (n(), J(d(Q), {
          key: 2,
          label: "Install pack",
          severity: "secondary",
          outlined: "",
          size: "small",
          disabled: !e.canInstall,
          onClick: b[5] || (b[5] = (p) => h.$emit("install"))
        }, null, 8, ["disabled"]))
      ]),
      e.schema.pack ? (n(), J(Me, {
        key: 0,
        open: u.value,
        "onUpdate:open": b[7] || (b[7] = (p) => u.value = p),
        class: "work-disclosure work-small",
        label: "Technical details"
      }, {
        default: j(() => [
          u.value ? (n(), f("dl", Wm, [
            s("div", null, [
              b[9] || (b[9] = s("dt", null, "Pack ID", -1)),
              s("dd", null, [
                s("code", null, D(e.schema.pack.id), 1)
              ])
            ]),
            s("div", null, [
              b[10] || (b[10] = s("dt", null, "Pack version", -1)),
              s("dd", null, D(e.schema.pack.version), 1)
            ]),
            b[11] || (b[11] = s("div", null, [
              s("dt", null, "Pack tools"),
              s("dd", null, [
                s("code", null, "WorkPackPlan"),
                W(", "),
                s("code", null, "WorkPackApply")
              ])
            ], -1))
          ])) : I("", !0)
        ]),
        _: 1
      }, 8, ["open"])) : I("", !0),
      y(Me, {
        class: "work-disclosure",
        label: "Recent setup changes"
      }, {
        default: j(() => [
          C.value.length ? (n(), f("ul", Gm, [
            (n(!0), f(_, null, ue(C.value, (p, k) => (n(), f("li", { key: k }, D(p.join(" · ")), 1))), 128))
          ])) : (n(), f("p", Km, D(m.value ? "Recent changes are unavailable." : v.value ? "No setup changes yet." : "Loading recent changes…"), 1))
        ]),
        _: 1
      }),
      o.value.length ? (n(), J(Me, {
        key: 1,
        class: "work-settings-card work-disclosure",
        label: "Advanced · Existing board overrides"
      }, {
        default: j(() => [
          b[12] || (b[12] = s("p", { class: "work-muted" }, "Clear an override to use the Work application default.", -1)),
          s("ul", Hm, [
            (n(!0), f(_, null, ue(o.value, (p) => (n(), f("li", {
              key: p,
              class: "work-row work-wrap"
            }, [
              s("span", Jm, D(l[p]) + " · " + D(r(p)), 1),
              y(d(Q), {
                label: "Use default for " + l[p].toLowerCase(),
                disabled: e.disabled,
                size: "small",
                text: "",
                onClick: (k) => delete e.draft.policy[p]
              }, null, 8, ["label", "disabled", "onClick"])
            ]))), 128))
          ])
        ]),
        _: 1
      })) : I("", !0)
    ]));
  }
}), We = (e, a) => `${e} → ${a}`, Io = (e, a) => {
  const t = e.fields?.find((l) => l.code === a);
  return t ? He(t) : "Untitled field";
}, Do = {
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
  if (e === "audit") return Oe(String(a));
  if (e === "stage_timeout") {
    const t = ga(String(a));
    if (t) return `${t.amount.toLocaleString()} ${t.amount === 1 ? t.unit.slice(0, -1) : t.unit}`;
  }
  if (e.endsWith("_days")) {
    const t = a === 0 && (e === "audit_days" || e === "interval_days") ? 365 : a;
    return `${t} ${t === 1 ? "day" : "days"}`;
  }
  return String(a);
}
function Xm(e, a) {
  const t = e.policy ?? {}, l = a.policy ?? {}, o = Object.keys(Do).flatMap((m) => t[m] === l[m] ? [] : [`${Do[m]} · ${We(Ao(m, t[m]), Ao(m, l[m]))}`]), r = (m) => m ? `${m.limit}${m.hard ? " (hard limit)" : ""}` : "No limit", v = /* @__PURE__ */ new Set([...Object.keys(t.wip ?? {}), ...Object.keys(l.wip ?? {})]);
  for (const m of v) {
    const g = r(t.wip?.[m]), i = r(l.wip?.[m]);
    if (g === i) continue;
    const c = (a.processes ?? []).flatMap((u) => u.states).find((u) => u.id === m) ?? (e.processes ?? []).flatMap((u) => u.states).find((u) => u.id === m);
    o.push(`${ge(c)} limit · ${We(g, i)}`);
  }
  return o;
}
function Zm(e, a, t) {
  const l = e.visibility, o = a.visibility, r = [];
  l?.field !== o?.field && r.push(We(
    l ? Io(e, l.field) : "No additional restriction",
    o ? Io(a, o.field) : "No additional restriction"
  ));
  const v = l?.levels ?? [], m = o?.levels ?? [], g = new Set([...v, ...m].map((i) => i.id));
  for (const i of g) {
    const c = v.find((p) => p.id === i), u = m.find((p) => p.id === i);
    if (c && u && JSON.stringify(c.holders) === JSON.stringify(u.holders)) continue;
    const C = (p) => p.fields?.find((k) => k.code === p.visibility?.field)?.options?.find((k) => k.id === i)?.label, h = C(a) || C(e) || Oe(i), b = (p) => p ? p.holders.map(t).join(", ") || "No extra access" : "No level";
    r.push(`${h} · ${We(b(c), b(u))}`);
  }
  return l?.bypass !== o?.bypass && r.push(o?.bypass === "admin" ? "Board administrators can see every level." : "Visibility levels now apply to board administrators."), r;
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
function Qm(e, a, t) {
  const { what: l, detail: o, to: r } = e, m = `${t?.name || a?.name || "Untitled workflow"} · ${ha[l] ?? "Workflow changed"}`, g = l.startsWith("state.") ? a?.states.find((h) => h.id === o) : void 0, i = l.startsWith("state.") ? t?.states.find((h) => h.id === o) : void 0, c = l.startsWith("transition.") ? a?.transitions?.find((h) => h.id === o) : void 0, u = l.startsWith("transition.") ? t?.transitions?.find((h) => h.id === o) : void 0;
  let C = "";
  if (l === "state.map") C = We(ge(g), ge(t?.states.find((h) => h.id === r)));
  else if (l === "state.name") C = We(ge(g), ge(i));
  else if (l === "state.kind") C = `${ge(i)} · ${We(Ha(g?.kind), Ha(i?.kind))}`;
  else if (l === "state.category" && g && i) C = `${ge(i)} · ${We(Nt(g.category), Nt(i.category))}`;
  else if (i || g) C = ge(i ?? g);
  else if (l === "transition.name" && c && u) C = We(Ge(c), Ge(u));
  else if (u && c && u.to !== c.to) {
    const h = ge(a?.states.find((p) => p.id === c.to)), b = ge(t?.states.find((p) => p.id === u.to));
    return { title: m, details: [Ge(u), `Destination changes from ${h} to ${b}.`] };
  } else if (l === "transition.add" && u && t) {
    const h = u.from === "any" ? "Any state" : u.from.map((p) => ge(t.states.find((k) => k.id === p))).join(", "), b = ge(t.states.find((p) => p.id === u.to));
    return { title: m, details: [Ge(u), We(h, b), ...u.auto ? ["Runs automatically."] : []] };
  } else u ? C = Ge(u) : c ? C = Ge(c) : l === "initial" ? C = We(ge(a?.states.find((h) => h.id === a.initial)), ge(t?.states.find((h) => h.id === t.initial))) : l === "name" && (C = We(a?.name || "Untitled workflow", t?.name || "Untitled workflow"));
  return { title: m, details: C ? [C] : [] };
}
function _m(e, a, t, l) {
  const { code: o, what: r, detail: v } = e;
  if (o === "schema" || r === "visibility.remove")
    return r === "policy" ? { title: "Board limits and defaults", details: Xm(a, t) } : r.startsWith("visibility") ? { title: "Who can see items", details: Zm(a, t, l) } : r === "key_prefix" ? { title: "Item key prefix", details: [We(a.key_prefix ?? "Default", t.key_prefix ?? "Default")] } : { title: { plugins: "Board plugins changed", scopes: "Saved query filters changed", "rollup.recompute": "Calculated totals will update" }[r] ?? "Board settings changed", details: [] };
  if (o.startsWith("process ")) {
    const u = o.slice(8);
    return Qm(e, a.processes?.find((C) => C.id === u), t.processes?.find((C) => C.id === u));
  }
  if (o.startsWith("item_type ")) {
    const u = o.slice(10), C = a.item_types?.find((p) => p.id === u), h = t.item_types?.find((p) => p.id === u);
    return { title: `${h?.title || C?.title || "Item type"} · ${ha[r] ?? "Item type changed"}`, details: r === "title" ? [We(C?.title || "Untitled item type", h?.title || "Untitled item type")] : [] };
  }
  if (o.startsWith("relation ")) {
    const u = o.slice(9), C = a.relation_types?.find((p) => p.id === u), h = t.relation_types?.find((p) => p.id === u), b = r === "label" ? [We([C?.outward, C?.inward].filter(Boolean).join(" / "), [h?.outward, h?.inward].filter(Boolean).join(" / "))] : [];
    return { title: `${h?.outward || C?.outward || "Link type"} · ${ha[r] ?? "Link type changed"}`, details: b };
  }
  const m = t.fields?.find((u) => u.code === o), g = a.fields?.find((u) => m?.id !== void 0 ? u.id === m.id : u.code === (r.startsWith("renamed from ") ? r.slice(13) : o)), i = m ?? g;
  if (!i) return { title: ha[r] ?? "Board settings changed", details: [] };
  const c = `${He(i)} · ${r.startsWith("renamed from ") ? "Field key" : ha[r] ?? "Field settings changed"}`;
  if (r.startsWith("options.")) {
    const u = g?.options ?? [], C = m?.options ?? [], h = u.findIndex((A) => A.id === v), b = C.findIndex((A) => A.id === v), p = u[h], k = C[b], S = k?.label || p?.label || "Untitled choice", V = p && k && p.label !== k.label ? [] : [S];
    if (p && k) {
      p.label !== k.label && V.push(We(p.label || "Untitled choice", k.label || "Untitled choice")), p.category !== k.category && V.push(`Category · ${We(p.category ? Nt(p.category) : "None", k.category ? Nt(k.category) : "None")}`);
      const A = p.order ?? h + 1, E = k.order ?? b + 1;
      A !== E && V.push(`Order · ${We(A, E)}`), p.color !== k.color && V.push(`Color · ${We(p.color ?? "Default", k.color ?? "Default")}`);
    }
    return { title: c, details: V };
  }
  return r === "title" && g && m ? { title: c, details: [We(He(g), He(m))] } : { title: c, details: [] };
}
const ep = {
  key: 0,
  class: "work-settings-card work-schema-plan work-stack",
  "aria-label": "Schema review"
}, tp = { key: 0 }, ap = { class: "work-row work-wrap" }, lp = { class: "work-muted" }, op = {
  key: 0,
  class: "work-stack work-tight",
  "aria-label": "Plugin configuration"
}, ip = {
  key: 1,
  class: "work-notice"
}, np = {
  key: 2,
  class: "work-notice"
}, sp = {
  key: 3,
  class: "work-stack work-tight",
  "aria-label": "Reviewed Flow bindings"
}, rp = { key: 4 }, dp = {
  key: 5,
  class: "work-settings-table"
}, up = { key: 0 }, cp = /* @__PURE__ */ ye({
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
    const a = e, t = {}, l = F(() => a.original ?? t), o = F(() => a.declaration ?? t), r = F(() => (a.plugins ?? []).flatMap((A) => {
      if (!A.config_schema) return [];
      const E = a.pluginConfigs?.[A.plugin], q = !l.value.plugins?.some((Z) => Z.use === A.plugin) && o.value.plugins?.some((Z) => Z.use === A.plugin);
      if (!E && !q) return [];
      const le = Wl(A.config_schema).map((Z) => {
        const se = E?.[Z.key];
        return A.plugin === "kickside.work.planning:plugin" && Z.key === "issue_types" ? { title: "Plan these item types", value: (Array.isArray(se) ? se.map((ve) => o.value.item_types?.find((me) => me.id === ve)?.title || Oe(ve)) : []).join(", ") || "Uses default" } : se === void 0 ? { title: Z.title, value: "Uses default" } : Z.schema.writeOnly || Z.schema.format === "password" || typeof se == "object" ? { title: Z.title, value: "Set" } : { title: Z.title, value: typeof se == "boolean" ? se ? "On" : "Off" : String(se) };
      });
      return le.length ? [{ id: A.plugin, title: A.title || A.plugin, fields: le }] : [];
    })), v = F(() => (o.value.processes ?? []).flatMap((A) => A.states.flatMap((E) => {
      const q = E.run?.flow_ref;
      return q ? [{ key: A.id + ":" + E.id, process: A.name || "Untitled process", state: ge(E), reference: q }] : [];
    }))), m = z(/* @__PURE__ */ new Map());
    Ve(v, async (A, E, q) => {
      const le = /* @__PURE__ */ new Map();
      m.value = le;
      let Z = !0;
      q(() => Z = !1), await Promise.all([...new Set(A.map((se) => se.reference.id))].map(async (se) => {
        try {
          const ce = (await Fl.title(se))?.trim();
          Z && ce && !zi(ce) && m.value.set(se, ce);
        } catch {
          Z && m.value.set(se, "Flow title unavailable");
        }
      }));
    }, { immediate: !0 });
    const g = F(() => [l.value, o.value].flatMap((A) => (A.visibility?.levels ?? []).flatMap((E) => E.holders.flatMap((q) => "group" in q ? [{ kind: "group", id: q.group }] : "user" in q ? [{ kind: "user", id: q.user }] : [])))), i = Lo(() => a.boardId ?? "", g);
    function c(A) {
      if ("user" in A) return i.label({ kind: "user", id: A.user });
      if ("group" in A) return i.label({ kind: "group", id: A.group });
      if ("field" in A) {
        const E = o.value.fields?.find((q) => q.code === A.field) ?? l.value.fields?.find((q) => q.code === A.field);
        return E ? He(E) : "People from a field";
      }
      return "Service";
    }
    const u = (A) => A.map((E) => {
      const q = _m(E, l.value, o.value, c);
      if (E.what === "plugins") {
        const le = new Set(l.value.plugins?.map((se) => se.use)), Z = new Set(o.value.plugins?.map((se) => se.use));
        for (const se of a.plugins ?? [])
          le.has(se.plugin) !== Z.has(se.plugin) && q.details.push((Z.has(se.plugin) ? "Enable " : "Turn off ") + (se.title || "an available plugin"));
      }
      if (E.what === "plugin.config") {
        const le = a.plugins?.find((Z) => Z.plugin === E.code);
        return { change: E, title: (le?.title || "Plugin") + " settings changed", details: [] };
      }
      return { change: E, ...q };
    }), C = F(() => u(a.plan?.changes.filter((A) => A.class !== "refused" && A.what !== "field.remove") ?? [])), h = F(() => u(a.plan?.refused.filter((A) => A.what !== "field.remove") ?? [])), b = F(() => {
      const A = a.plan?.migration;
      return !A || !h.value.length ? A : h.value.every((E) => E.change.what === "options.remove") ? "Add a new field with the choices you want to keep. Copy existing values into it before removing the old field." : h.value.every((E) => E.change.what === "state.remove") ? "Choose where existing items should move before removing their state." : A;
    }), p = {
      unchanged: ["No changes", "secondary"],
      cosmetic: ["Labels or settings", "secondary"],
      additive: ["New definitions", "success"],
      semantic: ["Affects existing items", "warn"],
      refused: ["Blocked", "danger"],
      initial: ["First setup", "secondary"]
    }, k = (A) => p[A]?.[0] ?? "Review needed", S = (A) => p[A]?.[1] ?? "secondary";
    function V(A) {
      const { detail: E, ...q } = A;
      return el(A.what === "invalid" || A.what.startsWith("views.") || A.what.startsWith("automation") ? A : q);
    }
    return (A, E) => e.plan ? (n(), f("section", ep, [
      !e.plan.changes.length && !e.plan.refused.length && !e.configCount && !e.packReview ? (n(), f("p", tp, "No changes to apply.")) : (n(), f(_, { key: 1 }, [
        s("header", ap, [
          E[0] || (E[0] = s("h3", null, "Impact on this board", -1)),
          y(d(Xe), {
            class: "kx-tag-sm",
            severity: S(e.plan.class)
          }, {
            default: j(() => [
              W(D(k(e.plan.class)), 1)
            ]),
            _: 1
          }, 8, ["severity"])
        ]),
        s("p", lp, D(d(ji)[e.plan.class] || "Review the changes below."), 1),
        r.value.length ? (n(), f("section", op, [
          E[1] || (E[1] = s("h3", null, "Plugin configuration", -1)),
          (n(!0), f(_, null, ue(r.value, (q) => (n(), f("div", {
            key: q.id
          }, [
            s("strong", null, D(q.title), 1),
            (n(!0), f(_, null, ue(q.fields, (le) => (n(), f("p", {
              key: le.title
            }, D(le.title) + " · " + D(le.value), 1))), 128))
          ]))), 128))
        ])) : I("", !0),
        b.value ? (n(), f("p", ip, D(b.value), 1)) : e.follows.length ? (n(), f("p", np, "Existing items in " + D(e.follows.join(", ")) + " will follow the updated workflow.", 1)) : I("", !0),
        v.value.length ? (n(), f("section", sp, [
          E[2] || (E[2] = s("h3", null, "Flow bindings", -1)),
          (n(!0), f(_, null, ue(v.value, (q) => (n(), f("p", {
            key: q.key
          }, [
            W(D(q.process) + " / " + D(q.state) + " · ", 1),
            s("strong", null, D(m.value.get(q.reference.id) ?? "Published Flow") + " · v" + D(q.reference.version), 1)
          ]))), 128)),
          E[3] || (E[3] = s("p", { class: "work-muted work-small" }, "New entries use these exact published versions. Before replacing a binding, stop new entries, let existing runs and deliveries finish, pause the old launcher, save, then resume entries.", -1))
        ])) : I("", !0),
        Be(A.$slots, "default"),
        h.value.length ? (n(), f("h3", rp, "Blocked changes")) : I("", !0),
        (n(!0), f(_, null, ue(h.value, (q, le) => (n(), J(d(zo), {
          key: le,
          severity: "error",
          role: "alert"
        }, {
          default: j(() => [
            s("strong", null, D(q.title), 1),
            (n(!0), f(_, null, ue(q.details, (Z, se) => (n(), f("p", { key: se }, D(Z), 1))), 128)),
            s("p", null, D(V(q.change)), 1),
            y(Me, {
              class: "work-small",
              label: "Technical details"
            }, {
              default: j(() => [
                s("code", null, D(q.change.what), 1)
              ]),
              _: 2
            }, 1024)
          ]),
          _: 2
        }, 1024))), 128)),
        C.value.length ? (n(), f("table", dp, [
          E[4] || (E[4] = s("thead", null, [
            s("tr", null, [
              s("th", { scope: "col" }, "Change"),
              s("th", { scope: "col" }, "Impact")
            ])
          ], -1)),
          s("tbody", null, [
            (n(!0), f(_, null, ue(C.value, (q, le) => (n(), f("tr", { key: le }, [
              s("td", null, [
                s("strong", null, D(q.title), 1),
                (n(!0), f(_, null, ue(q.details, (Z, se) => (n(), f("p", { key: se }, D(Z), 1))), 128)),
                q.change.count ? (n(), f("p", up, D(q.change.count) + " " + D(q.change.count === 1 ? "item" : "items"), 1)) : I("", !0)
              ]),
              s("td", null, [
                y(d(Xe), {
                  class: "kx-tag-sm",
                  severity: S(q.change.class)
                }, {
                  default: j(() => [
                    W(D(k(q.change.class)), 1)
                  ]),
                  _: 2
                }, 1032, ["severity"])
              ])
            ]))), 128))
          ])
        ])) : I("", !0)
      ], 64))
    ])) : I("", !0);
  }
}), vp = {
  class: "work-stack work-tight",
  "aria-label": "Pack resources"
}, fp = {
  key: 0,
  class: "work-muted work-small"
}, mp = {
  key: 0,
  class: "work-stack",
  "aria-label": "Pack conflicts"
}, pp = { class: "work-stack work-tight work-pack-review-field" }, gp = { class: "work-config-fields" }, hp = { class: "work-json-example" }, bp = { class: "work-json-example" }, yp = {
  key: 1,
  class: "work-stack",
  "aria-label": "Pack state maps"
}, kp = /* @__PURE__ */ ye({
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
      { label: "Saved views", entries: t.plan.views?.map((c) => ({ id: c.id, name: c.title || c.id })) },
      { label: "Automations", entries: t.plan.automations?.map((c) => ({ id: c.id, name: c.id })) },
      { label: "Traits", entries: t.plan.traits?.map((c) => ({ id: c, name: c })) },
      { label: "Required plugins", entries: t.plan.plugins?.map((c) => ({ id: c, name: t.plugins?.find((u) => u.plugin === c)?.title || c })) }
    ].filter((c) => c.entries?.length));
    function r(c) {
      return t.original.processes?.find((u) => u.id === c)?.name || Oe(c);
    }
    function v(c) {
      const [u, ...C] = c.split("."), h = C.join(".");
      return u === "processes" ? r(h) : u === "fields" ? t.original.fields?.find((b) => b.code === h)?.title || Oe(h) : u === "item_types" ? t.original.item_types?.find((b) => b.id === h)?.title || Oe(h) : Oe(u);
    }
    function m(c) {
      return JSON.stringify(c ?? null, null, 2);
    }
    function g(c, u) {
      (t.request.resolutions ??= {})[c] = u, l("change");
    }
    function i(c, u, C) {
      ((t.request.maps ??= {})[c] ??= {})[u] = C, l("change");
    }
    return (c, u) => (n(), f(_, null, [
      s("section", vp, [
        u[1] || (u[1] = s("h3", null, "Pack resources", -1)),
        s("p", null, [
          u[0] || (u[0] = W("Target version ", -1)),
          s("strong", null, D(e.plan.version), 1)
        ]),
        o.value.length ? (n(), f("p", fp, "Resources included in this plan.")) : I("", !0),
        (n(!0), f(_, null, ue(o.value, (C) => (n(), f("div", {
          key: C.label
        }, [
          s("h4", null, D(C.label), 1),
          s("ul", null, [
            (n(!0), f(_, null, ue(C.entries, (h) => (n(), f("li", {
              key: h.id
            }, D(h.name), 1))), 128))
          ])
        ]))), 128))
      ]),
      e.plan.conflicts.length ? (n(), f("section", mp, [
        u[4] || (u[4] = s("h3", null, "Local edits conflict", -1)),
        u[5] || (u[5] = s("p", { class: "work-muted work-small" }, "Choose which declaration to keep for each conflict, then review again.", -1)),
        (n(!0), f(_, null, ue(e.plan.conflicts, (C) => (n(), f("div", {
          key: C.path,
          class: "work-stack work-tight"
        }, [
          s("label", pp, [
            W(D(v(C.path)), 1),
            y(d(pe), {
              "model-value": e.request.resolutions?.[C.path],
              "aria-label": "Resolution for " + v(C.path),
              disabled: e.disabled,
              appendTo: "self",
              placeholder: "Choose a resolution",
              optionLabel: "label",
              optionValue: "value",
              options: [{ label: "Keep local edits", value: "local" }, { label: "Use pack changes", value: "incoming" }],
              "onUpdate:modelValue": (h) => g(C.path, h)
            }, null, 8, ["model-value", "aria-label", "disabled", "onUpdate:modelValue"])
          ]),
          y(Me, {
            class: "work-json-disclosure",
            label: "Compare declarations"
          }, {
            default: j(() => [
              s("div", gp, [
                s("section", null, [
                  u[2] || (u[2] = s("h4", null, "Local edits", -1)),
                  s("pre", hp, D(m(C.local_value)), 1)
                ]),
                s("section", null, [
                  u[3] || (u[3] = s("h4", null, "Pack changes", -1)),
                  s("pre", bp, D(m(C.incoming)), 1)
                ])
              ])
            ]),
            _: 2
          }, 1024)
        ]))), 128))
      ])) : I("", !0),
      Object.keys(e.plan.maps).length ? (n(), f("section", yp, [
        u[6] || (u[6] = s("h3", null, "Required state maps", -1)),
        u[7] || (u[7] = s("p", { class: "work-muted work-small" }, "Review the proposed destinations for existing items. Each destination is editable.", -1)),
        (n(!0), f(_, null, ue(e.plan.maps, (C, h) => (n(), f("div", {
          key: h,
          class: "work-stack"
        }, [
          s("h4", null, D(r(h)), 1),
          (n(!0), f(_, null, ue(C, (b, p) => (n(), f("label", {
            key: p,
            class: "work-stack work-tight work-pack-review-field"
          }, [
            W("Move items from " + D(d(ge)(e.original.processes?.find((k) => k.id === h)?.states.find((k) => k.id === p))), 1),
            y(d(pe), {
              "model-value": e.request.maps?.[h]?.[p],
              "aria-label": "Move items from " + d(ge)(e.original.processes?.find((k) => k.id === h)?.states.find((k) => k.id === p)),
              disabled: e.disabled,
              appendTo: "self",
              optionLabel: "label",
              optionValue: "value",
              options: e.plan.declaration.processes?.find((k) => k.id === h)?.states.map((k) => ({ label: d(ge)(k), value: k.id })) ?? [],
              "onUpdate:modelValue": (k) => i(h, p, k)
            }, null, 8, ["model-value", "aria-label", "disabled", "options", "onUpdate:modelValue"])
          ]))), 128))
        ]))), 128))
      ])) : I("", !0)
    ], 64));
  }
});
function wp(e) {
  const { schema: a, configs: t, busy: l } = e, { packs: o, loading: r, error: v, load: m, reset: g } = qi(), i = F(() => o.value.filter(Wi)), c = F(() => o.value.map(Gi)), u = z(!1), C = z(""), h = F(() => c.value.find((U) => U.id === C.value && !U.disabled)), b = z(), p = z(), k = z(), S = z(!1), V = z(""), A = z(), E = z(""), q = F(() => A.value?.result), le = F(() => !!q.value && q.value.status !== "done"), Z = F(() => !!b.value || e.schemaDirty()), se = F(() => !l.value && !Z.value && !e.migrationPending() && !le.value), ce = F(() => S.value ? p.value : void 0), ve = F(() => !!ce.value && !!k.value && JSON.stringify(k.value.request) === JSON.stringify(b.value)), me = F(() => e.canReview() && !e.migrationPending() && !l.value && ve.value && ce.value?.class !== "refused" && !ce.value?.refused.length && p.value?.conflicts.every((U) => !!b.value?.resolutions?.[U.path])), oe = F(() => i.value.find((U) => U.id === b.value?.pack)?.plugins.filter((U) => !a.value?.plugins?.some(($) => $.plugin === U.plugin && $.active)).map((U) => ({ use: U.plugin })) ?? []), R = F(() => i.value.find((U) => U.id === a.value?.pack?.id)?.title || "Installed pack"), te = F(() => i.value.find((U) => U.id === a.value?.pack?.id)), M = F(() => !v.value && !!a.value?.outdated && c.value.some((U) => U.id === a.value?.pack?.id && !U.disabled)), ae = F(() => v.value ? "Reload packs to check available upgrades." : le.value ? "Finish the current pack installation before upgrading." : M.value ? Z.value ? "Discard the current draft before upgrading." : e.migrationPending() ? "Finish the current migration before upgrading." : l.value ? "Wait for the current request to finish." : void 0 : "Install an available version of this pack to upgrade."), ke = ia();
  function Ae() {
    k.value = void 0;
  }
  function Ue() {
    ke(), Ae(), S.value = !1;
  }
  function K() {
    b.value = void 0, p.value = void 0, Ue();
  }
  function B() {
    K(), g(), A.value = void 0, E.value = "";
  }
  function N() {
    V.value = "";
  }
  Ve(t, (U) => {
    b.value && (Object.keys(U).length ? b.value.plugin_configs = aa(U) : delete b.value.plugin_configs);
  }, { deep: !0, flush: "sync" });
  async function w() {
    if (!b.value || l.value || !e.canReview()) return;
    const U = ke(), $ = aa(b.value), G = JSON.stringify(b.value);
    l.value = !0, N(), e.clearSaved();
    try {
      const T = await Ki($, (X) => Jt.packPlan(e.boardId(), X));
      if (!U() || G !== JSON.stringify(b.value)) return;
      p.value = T.plan, S.value = !0, b.value = T.request, k.value = { request: aa(T.request), key: crypto.randomUUID() };
    } catch (T) {
      U() && (Ae(), V.value = rt(T, "Could not review the pack."));
    } finally {
      l.value = !1;
    }
  }
  async function x() {
    if (!a.value?.pack || !se.value || !M.value) return;
    const U = i.value.find(($) => $.id === a.value?.pack?.id);
    U && (b.value = vo(U, a.value.generation), e.openReview(), await w());
  }
  async function P() {
    const U = i.value.find(($) => $.id === C.value);
    !a.value || !U || !h.value || !se.value || r.value || (b.value = vo(U, a.value.generation), u.value = !1, e.openReview(), await w());
  }
  async function O(U, $, G) {
    const T = e.boardId(), X = await Jt.packApply(T, U, $);
    e.boardId() === T && (A.value = { request: U, key: $, result: X, draft: G }, await e.applied(X.generation, G));
  }
  async function H() {
    if (!me.value || !k.value) return !1;
    l.value = !0, N();
    try {
      return await O(aa(k.value.request), k.value.key, e.draftSnapshot()), !0;
    } catch (U) {
      return V.value = rt(U, "Could not apply the pack upgrade."), !1;
    } finally {
      l.value = !1;
    }
  }
  async function ne() {
    const U = A.value;
    if (!(!U || !le.value || l.value || !e.authorized())) {
      l.value = !0, E.value = "";
      try {
        await O(U.request, U.key, U.draft);
      } catch ($) {
        E.value = rt($, "Could not continue the pack installation.");
      } finally {
        l.value = !1;
      }
    }
  }
  return {
    choices: c,
    loading: r,
    error: v,
    load: m,
    installing: u,
    installPack: C,
    installChoice: h,
    canManage: se,
    title: R,
    installed: te,
    upgradeAvailable: M,
    upgradeReason: ae,
    request: b,
    preview: p,
    plan: ce,
    reviewError: V,
    isReviewed: ve,
    canApply: me,
    plugins: oe,
    result: q,
    inProgress: le,
    operationError: E,
    install: P,
    upgrade: x,
    review: w,
    apply: H,
    continueInstallation: ne,
    changed: Ae,
    invalidate: Ue,
    clearReviewError: N,
    clear: K,
    reset: B
  };
}
const $p = { class: "work-section-layout" }, Vp = { class: "kx-main" }, xp = ["aria-label"], Cp = {
  key: 1,
  class: "kx-err work-alert-actions"
}, Sp = { role: "alert" }, Tp = {
  key: 2,
  class: "work-notice",
  role: "status"
}, Ip = {
  key: 3,
  class: "kx-loading",
  role: "status"
}, Dp = {
  key: 4,
  class: "work-notice",
  role: "alert"
}, Ap = {
  key: 5,
  class: "work-settings-body"
}, Up = {
  key: 0,
  class: "work-notice work-stack work-tight",
  "aria-label": "Pack installation"
}, Ep = {
  key: 0,
  role: "status"
}, Op = {
  key: 1,
  role: "status"
}, Rp = { class: "work-small" }, Pp = {
  key: 2,
  class: "kx-err",
  role: "alert"
}, Np = { key: 3 }, Mp = {
  key: 1,
  class: "work-notice",
  role: "alert"
}, Fp = {
  key: 2,
  class: "work-notice"
}, Lp = ["id"], Bp = ["disabled", "inert"], zp = {
  key: 3,
  class: "work-ia-section"
}, jp = {
  key: 0,
  class: "work-muted"
}, qp = {
  key: 5,
  class: "work-ia-section"
}, Wp = { class: "work-review-layout" }, Gp = { class: "work-muted" }, Kp = ["aria-busy"], Hp = {
  key: 0,
  role: "status"
}, Jp = {
  key: 1,
  role: "alert",
  class: "kx-err"
}, Yp = {
  key: 2,
  role: "alert"
}, Xp = { key: 7 }, Zp = { class: "work-dialog-actions" }, Qp = {
  key: 3,
  class: "work-muted",
  role: "status"
}, _p = {
  key: 0,
  class: "work-muted",
  role: "status"
}, eg = {
  key: 1,
  class: "kx-err work-alert-actions"
}, tg = { role: "alert" }, ag = {
  key: 2,
  class: "work-stack work-tight"
}, lg = {
  key: 0,
  class: "work-pack-unavailable work-block"
}, og = {
  key: 3,
  class: "work-muted"
}, ig = { class: "work-dialog-actions" }, ng = /* @__PURE__ */ ye({
  __name: "BoardSettings",
  props: {
    boardId: {},
    embedded: { type: Boolean },
    focusBack: { type: Boolean },
    route: {}
  },
  emits: ["dirty-change", "navigate"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = dn(), r = gt(), v = z();
    let m, g = "";
    const i = () => JSON.stringify([ht.value, K.value, re.request, [...xe.value]]), c = F(() => ({
      value: "all-boards",
      label: t.embedded ? "All boards" : "Back to board",
      icon: t.embedded ? "tabler:table" : "tabler:layout-kanban"
    })), u = z();
    Ve(u, (Y) => {
      t.focusBack && Y?.$el.querySelector(".kx-settings-rail-item")?.focus();
    }, { flush: "post", once: !0 });
    const C = [
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
    ], h = z("General"), b = {
      General: "general",
      "Item types": "items",
      Fields: "fields",
      Links: "links",
      Workflow: "workflow",
      Access: "access",
      Plugins: "plugins"
    }, p = z("");
    function k(Y, L = "") {
      h.value = Y, p.value = L ? b[Y] + "/" + L : "";
    }
    function S(Y, L = "") {
      k(Y, L), t.route !== void 0 && l("navigate", [b[Y], ...L ? [encodeURIComponent(L)] : []].join("/"));
    }
    function V(Y, L, ee) {
      if (t.route === void 0 || b[h.value] !== Y || !ee && p.value !== Y + "/" + L) return;
      const Se = ae.value?.declaration;
      (Y === "items" ? Se?.item_types?.some((Ee) => Ee.id === L) : Y === "fields" ? Se?.fields?.some((Ee) => Ee.code === L) : Y === "links" ? Se?.relation_types?.some((Ee) => Ee.id === L) : Y === "plugins" ? B.value?.schema_options.plugins.some((Ee) => Ee.plugin === L) : Y === "workflow" && Se?.processes?.some((Ee) => Ee.states.some((Re) => Ee.id + ".state." + Re.id === L) || Ee.transitions?.some((Re) => Ee.id + ".transition." + Re.id === L))) && S(h.value, ee ? L : "");
    }
    Ro(tl, { selected: p, choose: V });
    function A(Y) {
      if (Y === c.value.value) {
        bi();
        return;
      }
      (Y === "General" || C.some((L) => L.items.some((ee) => ee.value === Y))) && S(Y);
    }
    async function E() {
      S("Access"), await mt(), v.value?.focus();
    }
    const q = {
      General: "Manage the board name, item key prefix and app.",
      "Item types": "Choose the fields, parent relationships and workflow for each kind of work.",
      Fields: "Choose what information people can capture on items.",
      Links: "Configure link types and how they appear on related items.",
      Workflow: "Select a state or transition to edit how work moves.",
      Access: "Who can use this board?",
      Plugins: "Choose which plugins this board uses."
    }, le = z(""), Z = z();
    function se(Y, L, ee) {
      ee.currentTarget instanceof HTMLElement && (Z.value = { section: Y, type: L, opener: ee.currentTarget }, Y === "Fields" && (le.value = L.id), S(Y));
    }
    function ce(Y) {
      const L = Z.value;
      if (!L) return;
      Y !== void 0 && (L.type.process = Y);
      const ee = L.type.id, Se = ae.value?.declaration.item_types?.some((Je) => Je.id === ee);
      S("Item types", Se ? ee : ""), Z.value = void 0, L.section === "Fields" && mt(() => L.opener.focus());
    }
    const ve = z(!1), me = z(""), oe = z();
    Ve(h, (Y) => {
      v.value?.scrollTo({ top: 0 }), Z.value && Y !== Z.value.section && (Z.value = void 0);
    });
    function R() {
      ve.value = !1, me.value = "", re.clearReviewError(), Ea.value = !1, Ke.value = !1;
    }
    async function te(Y) {
      sl.value && (!mi() || xe.value.size || (oe.value = Y, ve.value = !0, Oa()));
    }
    const M = z(/* @__PURE__ */ new Set(["General"]));
    Ve(h, (Y) => M.value.add(Y));
    const ae = z(), ke = z(), Ae = z(), Ue = z({}), K = z({}), B = z(), N = z(!1), w = z(!0), x = z(!1), P = z(""), O = z(""), H = F(() => Ue.value.processes ?? []), ne = F(() => N.value && ae.value ? [
      { heading: Ae.value?.title || "Board settings", items: [{ value: "General", label: "General", icon: "tabler:settings" }] },
      ...C
    ] : []), U = z(), $ = z(!1), G = ia();
    async function T(Y) {
      const L = G();
      $.value = !1;
      try {
        const ee = await Et.stateCounts(Y);
        L() && (U.value = ee);
      } catch {
        L() && ($.value = !0, U.value = void 0);
      }
    }
    Ve(h, (Y) => {
      N.value && Y === "Workflow" && T(t.boardId);
    });
    const X = z(), de = z(), $e = z(""), Ce = z({}), Ke = z(!1), Ze = F(() => re.request ? [] : Hi(X.value)), It = F(() => Ze.value.every((Y) => Y.resolution !== "keep") && (!Ze.value.some((Y) => Y.resolution === "drop") || Ke.value)), Ft = z([]), Qe = z(!1), Lt = z(0), xe = z(/* @__PURE__ */ new Set()), Dt = z(), ao = ia(), ll = ia(), ht = F(() => vl(Ue.value, ae.value?.declaration ?? {})), lo = F(() => xe.value.size > 0 || !!ae.value && (JSON.stringify(ht.value) !== JSON.stringify(vl(ae.value.declaration, ae.value.declaration)) || Object.keys(K.value).length > 0)), Aa = F(() => !!ke.value?.migration_error || Ae.value?.status === "migrating"), $t = F(() => !!ae.value && !!ke.value && ae.value.generation !== ke.value.generation), ol = () => N.value && !$t.value && !xe.value.size, re = xi(wp({
      boardId: () => t.boardId,
      schema: ae,
      configs: K,
      busy: x,
      schemaDirty: () => lo.value,
      migrationPending: () => Aa.value,
      canReview: ol,
      authorized: () => N.value,
      draftSnapshot: i,
      openReview: () => {
        oe.value = void 0, ve.value = !0;
      },
      clearSaved: () => {
        O.value = "";
      },
      applied: gi
    })), di = F(() => {
      const Y = ae.value?.pack;
      if (Y)
        return {
          id: Y.id,
          version: Y.version,
          title: re.title,
          description: re.installed?.description,
          requires: re.installed?.requires ?? [],
          outdated: ae.value?.outdated,
          canUpgrade: re.upgradeAvailable && re.canManage,
          upgradeReason: re.upgradeReason
        };
    }), Bt = F(() => re.request ? re.plan : X.value), il = F(() => re.request ? re.reviewError : me.value), nl = F(() => [...Ft.value, ...Bt.value?.refused ?? []]), Ua = F(() => !!re.request || lo.value), sl = F(() => Ua.value && !(re.inProgress && re.request)), rl = z(!1), oo = F(() => Ua.value || rl.value);
    Ve(oo, (Y) => l("dirty-change", Y), { immediate: !0, flush: "sync" });
    const ui = F(() => (!da.value.renamed.length || Ea.value) && ol() && !x.value && !Qe.value && !Aa.value && X.value && (X.value.changes.length > 0 || Object.keys(K.value).length > 0) && X.value.class !== "refused" && !X.value.refused.length && It.value && de.value?.matches(ht.value, ae.value?.generation ?? -1, K.value, Ce.value)), io = F(() => re.request ? re.canApply : ui.value), no = F(() => re.request ? re.isReviewed : !!X.value), Ea = z(!1), da = F(() => {
      const Y = ae.value?.declaration, L = [], ee = [];
      for (const Se of H.value) {
        const Je = Y?.item_types?.filter((Re) => Re.process === Se.id) ?? [], Ee = Y?.processes?.find((Re) => Re.id === Se.id);
        for (const Re of Ee?.states ?? []) {
          const Yt = Se.states.find((zt) => zt.id === Re.id);
          if (Yt && Yt.name === Re.name) continue;
          const cl = [...Bt.value?.refused ?? [], ...Bt.value?.changes ?? []].find((zt) => zt.code === "process " + Se.id && zt.detail === Re.id && ["state.remove", "state.map"].includes(zt.what))?.count ?? Je.reduce((zt, ki) => zt + (U.value?.[ki.id]?.[Re.id] ?? 0), 0);
          cl && (Yt ? ee.push({ process: Se, state: Re, name: ge(Yt), count: cl }) : L.push({ process: Se, state: Re, count: cl }));
        }
      }
      return { removed: L, renamed: ee };
    });
    function ci(Y, L, ee) {
      Y.map = { ...Y.map, [L]: ee }, Oa();
    }
    const so = F(() => re.preview?.declaration ?? de.value?.declaration), vi = F(() => {
      const Y = so.value;
      return !Bt.value || !Y ? [] : Ji(Bt.value, Y).map((L) => Y.processes?.find((ee) => ee.id === L)?.name || "Untitled process");
    });
    function bt() {
      Ft.value = [], ll(), X.value = void 0, de.value = void 0, $e.value = "", re.invalidate();
    }
    Ve([ht, K], () => {
      Ce.value = {}, Ke.value = !1, bt();
    }, { deep: !0, flush: "sync" });
    function fi(Y, L) {
      Ce.value = { ...Ce.value, [Y]: L }, Ke.value = !1, bt(), Oa();
    }
    Ve(Ua, (Y) => {
      Y && (O.value = "");
    });
    function ua(Y, L) {
      L ? xe.value.delete(Y) : xe.value.add(Y), bt();
    }
    function dl(Y) {
      re.clear(), Z.value = void 0, Lt.value++, ae.value = Y, Ue.value = aa(Y.declaration), K.value = {}, xe.value.clear(), bt();
    }
    async function ut(Y = !1) {
      const L = ao();
      try {
        const [ee, Se, Je] = await Promise.all([Et.schema(t.boardId, void 0, !0).catch((Re) => {
          if (Re instanceof Tl && Re.details?.code === "board_schema_missing") return { generation: 0, declaration: {}, compiled: {}, key_prefix: "", as_of: 0 };
          throw Re;
        }), Et.options(t.boardId), Et.boards()]);
        if (!L()) return;
        if (N.value = Se.access.admin, B.value = Se, Ae.value = Je.find((Re) => Re.board_id === t.boardId), !N.value) {
          ae.value = void 0, Ue.value = {}, bt();
          return;
        }
        P.value = "";
        const Ee = Yi(ee);
        ke.value = Ee, m !== void 0 && Ee.generation >= m ? (m = void 0, g === i() && dl(Ee), g = "") : (Y || !ae.value || !Ua.value && Ee.generation !== ae.value.generation) && dl(Ee), $t.value && bt(), await re.load(L), L() && h.value === "Workflow" && T(t.boardId);
      } catch (ee) {
        if (!L()) return;
        ee instanceof Tl && (ee.status === 403 || ee.kind?.toLowerCase() === "permission_denied") && (N.value = !1), bt(), P.value = rt(ee, "Could not load board settings.");
      } finally {
        L() && (w.value = !1);
      }
    }
    function mi() {
      for (const Y of Array.from(Dt.value?.elements ?? []))
        if ((Y instanceof HTMLInputElement || Y instanceof HTMLSelectElement || Y instanceof HTMLTextAreaElement) && !(Y.form !== Dt.value || Y.closest('[style*="display: none"]:not(.p-accordioncontent)')) && !Y.reportValidity()) {
          const ee = Y.closest('.p-accordioncontent[style*="display: none"]')?.closest(".kx-disclosure")?.querySelector('.kx-disclosure-toggle[aria-expanded="false"]');
          return ee && (ee.click(), mt(() => Y.reportValidity())), !1;
        }
      return !0;
    }
    async function Oa() {
      if (re.request) return re.review();
      if (!ae.value || x.value || !ol()) return;
      const Y = ll(), L = fo(ht.value, ae.value.generation, K.value, Ce.value);
      x.value = !0, me.value = "", O.value = "";
      try {
        const ee = (L.declaration.processes ?? []).some((Je) => ae.value?.declaration.processes?.find((Ee) => Ee.id === Je.id)?.states.some((Ee) => Je.states.some((Re) => Re.id === Ee.id && Re.name !== Ee.name))), [Se] = await Promise.all([
          Jt.plan(t.boardId, L),
          ee ? T(t.boardId) : void 0
        ]);
        if (ee && $.value) {
          bt(), me.value = "Could not check which items use the renamed states. Check the impact again.";
          return;
        }
        if (!Y() || xe.value.size || !L.matches(ht.value, ae.value.generation, K.value, Ce.value)) return;
        X.value = Se, de.value = L, $e.value = crypto.randomUUID(), ve.value = !0;
      } catch (ee) {
        Y() && (bt(), me.value = rt(ee, "Could not review changes."), Ft.value = Xi(ee, ht.value));
      } finally {
        x.value = !1;
      }
    }
    async function pi() {
      if (!io.value) return;
      if (re.request) {
        await re.apply() && R();
        return;
      }
      if (!de.value) return;
      x.value = !0, me.value = "", O.value = "";
      const Y = i();
      try {
        m = (await Jt.apply(t.boardId, de.value, $e.value)).generation, g = Y, await ut(), O.value = "Board changes applied.", R();
      } catch (L) {
        me.value = rt(L, "Could not apply the board changes.");
      } finally {
        x.value = !1;
      }
    }
    async function gi(Y, L) {
      L === i() && (m = Y, g = L), await ut();
    }
    async function hi() {
      if (!x.value) {
        x.value = !0, P.value = "";
        try {
          const Y = await Jt.resume(t.boardId);
          O.value = Y.resumed ? "Migration resumes." : "Migration is already running.", await ut();
        } catch (Y) {
          P.value = rt(Y, "Could not resume migration.");
        } finally {
          x.value = !1;
        }
      }
    }
    async function Ra(Y, L) {
      if (!ae.value || !N.value || x.value || Qe.value) return "Wait for the current change to finish.";
      if ($t.value) return "Discard the stale draft before removing a definition.";
      const ee = ae.value.generation, Se = JSON.stringify(ht.value), Je = aa(Ue.value);
      Ta(Je, Y, L), Qe.value = !0;
      try {
        const Ee = await Jt.plan(t.boardId, fo(vl(Je, ae.value.declaration), ee, K.value));
        if (!N.value || $t.value || ae.value.generation !== ee || JSON.stringify(ht.value) !== Se) return "The draft changes during the check. Try the removal again.";
        const Re = Zi(Ee, Y, L);
        if (Re) return Re;
        if (Ee.refused.some((Yt) => Yt.what !== "field.remove")) return "Resolve the blocked changes in your draft before removing this definition.";
      } catch (Ee) {
        return rt(Ee, "Could not check this removal.");
      } finally {
        Qe.value = !1;
      }
    }
    async function bi() {
      if (t.embedded) {
        o({ name: "boards" });
        return;
      }
      oo.value && !await Bo.confirm({ header: "Discard changes?", message: "Your unsaved board settings will be discarded.", acceptLabel: "Discard", rejectLabel: "Keep editing" }) || o({ name: "board", board: t.boardId });
    }
    function yi() {
      m = void 0, ke.value && dl(ke.value), O.value = "", P.value = "", R();
    }
    Ve(() => t.boardId, () => {
      rl.value = !1, m = void 0, re.reset(), ae.value = void 0, ke.value = void 0, Ae.value = void 0, K.value = {}, xe.value.clear(), G(), U.value = void 0, le.value = "", Z.value = void 0, M.value = /* @__PURE__ */ new Set(["General"]), k("General"), R(), N.value = !1, w.value = !0, ut(!0);
    }), Ve([() => t.route, () => t.boardId], ([Y]) => {
      if (Y === void 0) return;
      const [L, ee] = Y.split("/"), Se = Object.keys(b).find((Ee) => b[Ee] === L) ?? "General";
      let Je = "";
      try {
        ee && (Je = decodeURIComponent(ee));
      } catch {
      }
      Se === "Fields" && Je && p.value !== "fields/" + Je && (le.value = ""), k(Se, Je), M.value.add(Se);
    }, { immediate: !0 });
    let ul = () => {
    };
    return Ve(() => t.boardId, (Y) => {
      ul(), ul = Qi(`component.${Y}`, () => {
        ut();
      });
    }, { immediate: !0 }), Ci(ut), ql(() => {
      ul(), ao(), ll(), G(), re.invalidate();
    }), (Y, L) => (n(), f("section", {
      class: dt(["work-settings-shell work-ia", { "work-embedded": e.embedded }])
    }, [
      s("div", $p, [
        y(rn, {
          ref_key: "rail",
          ref: u,
          label: "Board settings sections",
          value: h.value,
          groups: ne.value,
          "leading-item": c.value,
          "onUpdate:value": A
        }, null, 8, ["value", "groups", "leading-item"]),
        s("div", Vp, [
          s("div", {
            ref_key: "pane",
            ref: v,
            class: "kx-main-scroll work-settings-content",
            role: "region",
            "aria-label": h.value,
            tabindex: "-1"
          }, [
            N.value && ae.value ? (n(), J(Rf, {
              key: 0,
              title: h.value,
              description: q[h.value]
            }, xa({ _: 2 }, [
              sl.value || h.value === "Plugins" ? {
                name: "actions",
                fn: j(() => [
                  h.value === "Plugins" ? (n(), J(d(Q), {
                    key: 0,
                    label: "Refresh status",
                    severity: "secondary",
                    outlined: "",
                    disabled: x.value || w.value,
                    onClick: L[0] || (L[0] = (ee) => ut())
                  }, {
                    icon: j(() => [
                      y(d(fe), {
                        icon: "tabler:refresh",
                        "aria-hidden": "true"
                      })
                    ]),
                    _: 1
                  }, 8, ["disabled"])) : I("", !0),
                  sl.value ? (n(), J(Pf, {
                    key: 1,
                    busy: x.value,
                    "discard-disabled": Qe.value,
                    "review-disabled": Qe.value || Aa.value || $t.value || xe.value.size > 0,
                    onDiscard: yi,
                    onReview: te
                  }, null, 8, ["busy", "discard-disabled", "review-disabled"])) : I("", !0)
                ]),
                key: "0"
              } : void 0
            ]), 1032, ["title", "description"])) : I("", !0),
            P.value ? (n(), f("div", Cp, [
              s("p", Sp, D(P.value), 1),
              y(d(Q), {
                label: "Retry",
                severity: "secondary",
                outlined: "",
                onClick: L[1] || (L[1] = (ee) => ut())
              })
            ])) : I("", !0),
            O.value ? (n(), f("p", Tp, D(O.value), 1)) : I("", !0),
            w.value ? (n(), f("p", Ip, "Loading board settings…")) : !N.value && !P.value ? (n(), f("p", Dp, "Ask a board administrator to grant you access to these settings.")) : I("", !0),
            N.value && ae.value ? (n(), f("div", Ap, [
              re.result ? (n(), f("section", Up, [
                re.inProgress ? (n(), f("p", Ep, [
                  L[28] || (L[28] = W("Pack installation status ", -1)),
                  s("strong", null, D(d(Oe)(re.result.status)), 1)
                ])) : (n(), f("p", Op, "Pack applied.")),
                s("p", Rp, [
                  L[29] || (L[29] = W("Operation ", -1)),
                  s("code", null, D(re.result.operation_id), 1),
                  L[30] || (L[30] = W(" · Job ", -1)),
                  s("code", null, D(re.result.job_id), 1)
                ]),
                re.operationError ? (n(), f("p", Pp, D(re.operationError), 1)) : I("", !0),
                re.inProgress ? (n(), f("div", Np, [
                  y(d(Q), {
                    label: "Continue pack installation",
                    severity: "secondary",
                    outlined: "",
                    loading: x.value,
                    disabled: x.value,
                    onClick: re.continueInstallation
                  }, null, 8, ["loading", "disabled", "onClick"])
                ])) : I("", !0)
              ])) : I("", !0),
              $t.value ? (n(), f("p", Mp, "Someone saved new settings while you were editing. Discard this draft to load their changes.")) : I("", !0),
              Aa.value ? (n(), f("div", Fp, [
                s("p", null, D(ke.value?.migration_error ? "Updating existing items paused." : "Updating existing items…"), 1),
                ke.value?.migration_error ? (n(), J(Me, {
                  key: 0,
                  label: "Technical details"
                }, {
                  default: j(() => [
                    W(D(ke.value.migration_error), 1)
                  ]),
                  _: 1
                })) : I("", !0),
                ke.value?.migration_error ? (n(), J(d(Q), {
                  key: 1,
                  label: "Resume updating items",
                  severity: "secondary",
                  disabled: x.value,
                  outlined: "",
                  onClick: hi
                }, null, 8, ["disabled"])) : I("", !0)
              ])) : I("", !0),
              vt(y(Ym, {
                draft: Ue.value,
                schema: ke.value ?? ae.value,
                board: Ae.value,
                active: h.value === "General",
                "board-apps": B.value?.board_apps,
                "draft-form": d(r),
                disabled: x.value || Qe.value,
                "pack-title": ae.value.pack ? re.title : void 0,
                outdated: ae.value.outdated,
                "upgrade-reason": re.upgradeReason,
                "can-upgrade": re.upgradeAvailable && re.canManage,
                "can-install": re.canManage,
                "pack-error": re.error,
                onUpgrade: re.upgrade,
                onInstall: L[2] || (L[2] = (ee) => re.installing = !0),
                onRetry: L[3] || (L[3] = (ee) => re.load()),
                onDirtyChange: L[4] || (L[4] = (ee) => rl.value = ee),
                onSaved: L[5] || (L[5] = (ee) => ut()),
                onShare: E
              }, null, 8, ["draft", "schema", "board", "active", "board-apps", "draft-form", "disabled", "pack-title", "outdated", "upgrade-reason", "can-upgrade", "can-install", "pack-error", "onUpgrade"]), [
                [Vt, h.value === "General"]
              ]),
              s("form", {
                id: d(r),
                ref_key: "editor",
                ref: Dt,
                onSubmit: L[19] || (L[19] = Pe((ee) => te(), ["prevent"]))
              }, [
                (n(), f("fieldset", {
                  key: Lt.value,
                  class: "work-settings-fieldset",
                  disabled: x.value || Qe.value,
                  inert: x.value || Qe.value || void 0
                }, [
                  M.value.has("Item types") ? vt((n(), J(yd, {
                    key: 0,
                    class: "work-ia-section",
                    draft: Ue.value,
                    "guard-removal": Ra,
                    issues: nl.value,
                    onCreateField: L[6] || (L[6] = (ee, Se) => se("Fields", ee, Se)),
                    onCreateWorkflow: L[7] || (L[7] = (ee, Se) => se("Workflow", ee, Se))
                  }, null, 8, ["draft", "issues"])), [
                    [Vt, h.value === "Item types"]
                  ]) : I("", !0),
                  M.value.has("Fields") ? vt((n(), J(ld, {
                    key: 1,
                    class: "work-ia-section",
                    "board-id": e.boardId,
                    "installed-types": B.value?.installed_types,
                    draft: Ue.value,
                    "guard-removal": Ra,
                    issues: nl.value,
                    "item-type": le.value,
                    "onUpdate:itemType": L[8] || (L[8] = (ee) => le.value = ee),
                    "create-for-item-type": Z.value?.section === "Fields",
                    onCreated: L[9] || (L[9] = (ee) => ce()),
                    onCancelCreation: L[10] || (L[10] = (ee) => ce()),
                    onValidity: L[11] || (L[11] = (ee, Se) => ua("fields:" + ee, Se))
                  }, null, 8, ["board-id", "installed-types", "draft", "issues", "item-type", "create-for-item-type"])), [
                    [Vt, h.value === "Fields"]
                  ]) : I("", !0),
                  M.value.has("Links") ? vt((n(), J(Ov, {
                    key: 2,
                    class: "work-ia-section",
                    draft: Ue.value,
                    "guard-removal": Ra
                  }, null, 8, ["draft"])), [
                    [Vt, h.value === "Links"]
                  ]) : I("", !0),
                  M.value.has("Workflow") ? vt((n(), f("section", zp, [
                    $.value ? (n(), f("p", jp, [
                      L[31] || (L[31] = W("Item counts are unavailable. ", -1)),
                      y(d(Q), {
                        label: "Reload counts",
                        text: "",
                        onClick: L[12] || (L[12] = (ee) => T(e.boardId))
                      })
                    ])) : I("", !0),
                    y(vv, {
                      "board-id": e.boardId,
                      draft: Ue.value,
                      "guard-removal": Ra,
                      issues: nl.value,
                      counts: U.value,
                      "count-types": ae.value.declaration.item_types,
                      guards: B.value?.guards,
                      "create-for-item-type": Z.value?.section === "Workflow",
                      "creation-opener": Z.value?.opener,
                      onCreated: ce,
                      onCancelCreation: L[13] || (L[13] = (ee) => ce()),
                      onValidity: L[14] || (L[14] = (ee, Se) => ua("process:" + ee, Se))
                    }, null, 8, ["board-id", "draft", "issues", "counts", "count-types", "guards", "create-for-item-type", "creation-opener"])
                  ], 512)), [
                    [Vt, h.value === "Workflow"]
                  ]) : I("", !0),
                  M.value.has("Access") ? vt((n(), J(om, {
                    key: 4,
                    active: h.value === "Access",
                    "board-id": e.boardId,
                    draft: Ue.value,
                    board: Ae.value,
                    busy: x.value,
                    onValidity: L[15] || (L[15] = (ee) => ua("visibility", ee))
                  }, null, 8, ["active", "board-id", "draft", "board", "busy"])), [
                    [Vt, h.value === "Access"]
                  ]) : I("", !0),
                  M.value.has("Plugins") ? vt((n(), f("section", qp, [
                    y(To, {
                      "board-id": e.boardId,
                      draft: Ue.value,
                      schema: ke.value ?? ae.value,
                      options: B.value?.schema_options.plugins ?? [],
                      filters: B.value?.filters,
                      configs: K.value,
                      disabled: x.value,
                      pack: di.value,
                      onConfigured: L[16] || (L[16] = (ee) => {
                        bt(), ut();
                      }),
                      onRefresh: L[17] || (L[17] = (ee) => ut()),
                      onReview: te,
                      onUpgrade: re.upgrade,
                      onValidity: L[18] || (L[18] = (ee, Se) => ua("plugin:" + ee, Se))
                    }, null, 8, ["board-id", "draft", "schema", "options", "filters", "configs", "disabled", "pack", "onUpgrade"])
                  ], 512)), [
                    [Vt, h.value === "Plugins"]
                  ]) : I("", !0)
                ], 8, Bp))
              ], 40, Lp),
              y(Il, {
                visible: ve.value,
                label: "Review changes",
                busy: x.value,
                "return-focus": oe.value,
                class: "work-review-sheet",
                onClose: R
              }, {
                default: j(() => [
                  s("div", Wp, [
                    s("header", null, [
                      L[32] || (L[32] = s("h2", null, "Review changes", -1)),
                      s("p", Gp, D(Ae.value?.title), 1)
                    ]),
                    s("div", {
                      class: "work-review-content work-stack",
                      "aria-busy": x.value
                    }, [
                      x.value ? (n(), f("p", Hp, D(Bt.value ? "Applying or checking changes…" : "Checking the impact on your board…"), 1)) : I("", !0),
                      il.value ? (n(), f("p", Jp, D(il.value), 1)) : I("", !0),
                      $t.value ? (n(), f("p", Yp, "The board changed while you were editing. Close this review and discard the draft to load the latest settings.")) : I("", !0),
                      ve.value && !re.request && (da.value.removed.length || da.value.renamed.length) ? (n(), J(gv, {
                        key: 3,
                        removed: da.value.removed,
                        renamed: da.value.renamed,
                        disabled: x.value || Qe.value,
                        confirmed: Ea.value,
                        "onUpdate:confirmed": L[20] || (L[20] = (ee) => Ea.value = ee),
                        onDestination: ci
                      }, null, 8, ["removed", "renamed", "disabled", "confirmed"])) : I("", !0),
                      ve.value && Ze.value.length ? (n(), J(kn, {
                        key: 4,
                        removals: Ze.value,
                        original: ae.value.declaration,
                        draft: ht.value,
                        choices: Ce.value,
                        disabled: x.value,
                        "drop-confirmed": Ke.value,
                        "onUpdate:dropConfirmed": L[21] || (L[21] = (ee) => Ke.value = ee),
                        onChoose: fi
                      }, null, 8, ["removals", "original", "draft", "choices", "disabled", "drop-confirmed"])) : I("", !0),
                      ve.value && re.request && re.plugins.length ? (n(), J(To, {
                        key: 5,
                        "board-id": e.boardId,
                        draft: { plugins: re.plugins },
                        schema: ke.value ?? ae.value,
                        options: B.value?.schema_options.plugins.filter((ee) => re.plugins.some((Se) => Se.use === ee.plugin)) ?? [],
                        configs: K.value,
                        disabled: x.value,
                        "activation-locked": "",
                        onValidity: L[22] || (L[22] = (ee, Se) => ua("pack-plugin:" + ee, Se))
                      }, null, 8, ["board-id", "draft", "schema", "options", "configs", "disabled"])) : I("", !0),
                      ve.value ? (n(), J(cp, {
                        key: 6,
                        "board-id": e.boardId,
                        original: ae.value.declaration,
                        declaration: so.value,
                        plan: Bt.value,
                        follows: vi.value,
                        "config-count": Object.keys(K.value).length,
                        "plugin-configs": de.value?.plugin_configs,
                        "pack-review": !!re.preview,
                        plugins: B.value?.schema_options.plugins
                      }, {
                        default: j(() => [
                          re.preview && re.request ? (n(), J(kp, {
                            key: 0,
                            plan: re.preview,
                            request: re.request,
                            original: ae.value.declaration,
                            plugins: B.value?.schema_options.plugins,
                            disabled: x.value,
                            onChange: re.changed
                          }, null, 8, ["plan", "request", "original", "plugins", "disabled", "onChange"])) : I("", !0)
                        ]),
                        _: 1
                      }, 8, ["board-id", "original", "declaration", "plan", "follows", "config-count", "plugin-configs", "pack-review", "plugins"])) : I("", !0),
                      !x.value && !no.value && !$t.value && !il.value ? (n(), f("p", Xp, "Check the impact again before applying.")) : I("", !0)
                    ], 8, Kp),
                    s("footer", Zp, [
                      y(d(Q), {
                        label: "Keep editing",
                        severity: "secondary",
                        outlined: "",
                        disabled: x.value,
                        onClick: R
                      }, null, 8, ["disabled"]),
                      no.value ? (n(), J(d(Q), {
                        key: 1,
                        label: "Apply changes",
                        disabled: !io.value,
                        loading: x.value,
                        onClick: pi
                      }, null, 8, ["disabled", "loading"])) : (n(), J(d(Q), {
                        key: 0,
                        label: "Check impact",
                        disabled: x.value || $t.value || !!xe.value.size,
                        onClick: Oa
                      }, null, 8, ["disabled"]))
                    ])
                  ])
                ]),
                _: 1
              }, 8, ["visible", "busy", "return-focus"]),
              Qe.value ? (n(), f("p", Qp, "Checking what uses this setting…")) : I("", !0)
            ])) : I("", !0)
          ], 8, xp)
        ])
      ]),
      N.value ? (n(), J(Il, {
        key: 0,
        visible: re.installing,
        label: "Install pack",
        busy: x.value,
        onClose: L[27] || (L[27] = (ee) => re.installing = !1)
      }, {
        default: j(() => [
          re.installing ? (n(), f("form", {
            key: 0,
            class: "work-dialog-box work-stack",
            onSubmit: L[26] || (L[26] = Pe(
              //@ts-ignore
              (...ee) => re.install && re.install(...ee),
              ["prevent"]
            ))
          }, [
            L[34] || (L[34] = s("h2", null, "Install a pack", -1)),
            L[35] || (L[35] = s("p", { class: "work-muted work-small" }, "Packs give an empty board a starting setup. Review checks whether this board is eligible.", -1)),
            re.loading ? (n(), f("p", _p, "Loading packs…")) : re.error ? (n(), f("div", eg, [
              s("p", tg, D(re.error), 1),
              y(d(Q), {
                label: "Reload packs",
                severity: "secondary",
                outlined: "",
                onClick: L[23] || (L[23] = (ee) => re.load())
              })
            ])) : re.choices.length ? (n(), f("label", ag, [
              L[33] || (L[33] = W("Pack ", -1)),
              y(d(pe), {
                modelValue: re.installPack,
                "onUpdate:modelValue": L[24] || (L[24] = (ee) => re.installPack = ee),
                "aria-label": "Pack to install",
                appendTo: "self",
                optionLabel: "title",
                optionValue: "id",
                optionDisabled: "disabled",
                options: re.choices,
                pt: { option: ({ context: ee }) => ({ "aria-label": [ee.option.title, ee.option.unavailable].filter(Boolean).join(". ") }) }
              }, {
                option: j(({ option: ee }) => [
                  s("span", null, [
                    W(D(ee.title), 1),
                    ee.unavailable ? (n(), f("small", lg, D(ee.unavailable), 1)) : I("", !0)
                  ])
                ]),
                _: 1
              }, 8, ["modelValue", "options", "pt"])
            ])) : (n(), f("p", og, "No available packs were found.")),
            s("footer", ig, [
              y(d(Q), {
                label: "Cancel",
                severity: "secondary",
                outlined: "",
                onClick: L[25] || (L[25] = (ee) => re.installing = !1)
              }),
              y(d(Q), {
                type: "submit",
                label: "Review pack",
                disabled: !re.installChoice || !re.canManage || re.loading || !!re.error
              }, null, 8, ["disabled"])
            ])
          ], 32)) : I("", !0)
        ]),
        _: 1
      }, 8, ["visible", "busy"])) : I("", !0)
    ], 2));
  }
}), sg = /* @__PURE__ */ ye({
  __name: "SettingsRoot",
  setup(e) {
    const a = Si(), t = Ti();
    return Ro(qo, (l) => {
      a.value.embedded && l.name === "boards" ? t("back-to-boards", {}) : t("navigate", { route: un(l) });
    }), (l, o) => (n(), J(ng, {
      "board-id": d(a).boardId ?? "",
      embedded: d(a).embedded,
      "focus-back": d(a).focusBack,
      route: d(a).route,
      onNavigate: o[0] || (o[0] = (r) => d(t)("navigate", { route: r })),
      onDirtyChange: o[1] || (o[1] = (r) => d(t)("dirty-change", { dirty: r }))
    }, null, 8, ["board-id", "embedded", "focus-back", "route"]));
  }
}), rg = Ii(sg, {
  type: "object",
  properties: {
    "board-id": { type: "string", default: "", description: "Board to administer." },
    "focus-back": { type: "boolean", default: !1, description: "Focus the first rail action when opening settings from the board picker." },
    route: { type: "string", description: "Section and selected row in System." },
    embedded: { type: "boolean", default: !1, description: "Fits in a System detail pane." }
  }
});
_i(import.meta.url, rg);
//# sourceMappingURL=settings.js.map
