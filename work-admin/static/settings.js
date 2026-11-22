import { defineComponent as $e, computed as K, openBlock as n, createBlock as H, resolveDynamicComponent as da, normalizeProps as Si, guardReactiveProps as Ti, createSlots as jl, withCtx as q, createElementVNode as s, normalizeClass as ft, createElementBlock as b, Fragment as te, renderList as ne, toDisplayString as U, createCommentVNode as I, unref as r, renderSlot as Qe, inject as Wl, ref as B, useSlots as Ii, watch as Se, createVNode as k, Transition as Oo, withDirectives as pt, vShow as Dt, onMounted as Aa, onUnmounted as ql, resolveComponent as Ro, createTextVNode as z, onBeforeUnmount as St, useId as Ht, withKeys as Ge, withModifiers as Re, normalizeStyle as Di, watchEffect as No, nextTick as Vt, useModel as Ui, mergeModels as co, provide as Mo } from "vue";
import { e as Rt, u as Ei, a as Ai, b as Pi, c as Oi } from "./mount-DPTy0rBc.js";
import "pinia";
import { m as Ha, h as vo, s as we, i as Ri, t as Ke, g as Ni, j as _t, k as ea, r as fo, w as Pt, f as rt, l as xa, n as Gt, o as Je, q as Nt, v as Fo, x as Fe, y as Ne, z as Lo, A as Yt, B as Bo, C as Ua, D as ol, d as zo, E as Pa, c as jo, F as Mi, G as Qa, H as Al, I as Fi, J as Wt, K as Li, _ as Pl, L as Bi, M as zi, N as Wo, O as ji, P as Wi, u as qi, a as Gi, p as Ki, Q as yl, R as Hi, S as ta, T as mo, U as Yi, V as Xi, W as po, X as Ji, Y as Zi } from "./usePackDiscovery-DxOnata5.js";
import ue from "primevue/select";
import ee from "primevue/button";
import { Icon as de } from "@iconify/vue";
import { api as Ol, host as qo, on as Qi, define as _i } from "@wippy-fe/proxy";
import lt from "primevue/tag";
import at from "primevue/toggleswitch";
import Kt from "primevue/checkbox";
import Te from "primevue/inputtext";
import Ea from "primevue/textarea";
import $t from "primevue/inputnumber";
import Gl from "primevue/selectbutton";
import en from "primevue/message";
const wl = (e, a) => e.x > a.x && e.x < a.x + a.width && e.y > a.y && e.y < a.y + a.height;
function tn(e, a, t) {
  return e.x === a.x ? e.x > t.x && e.x < t.x + t.width && Math.max(e.y, a.y) > t.y && Math.min(e.y, a.y) < t.y + t.height : e.y > t.y && e.y < t.y + t.height && Math.max(e.x, a.x) > t.x && Math.min(e.x, a.x) < t.x + t.width;
}
function Lt(e, a, t) {
  const l = [.../* @__PURE__ */ new Set([e.x, a.x, ...t.flatMap((T) => [T.x, T.x + T.width])])].sort((T, x) => T - x), o = [.../* @__PURE__ */ new Set([e.y, a.y, ...t.flatMap((T) => [T.y, T.y + T.height])])].sort((T, x) => T - x);
  l.unshift(l[0] - 24), l.push(l.at(-1) + 24), o.unshift(o[0] - 24), o.push(o.at(-1) + 24);
  const d = l.length, f = o.indexOf(a.y) * d + l.indexOf(a.x), v = o.indexOf(e.y) * d + l.indexOf(e.x), c = (T) => ({ x: l[T % d], y: o[Math.floor(T / d)] }), i = /* @__PURE__ */ new Map(), u = /* @__PURE__ */ new Map(), m = [];
  function V(T) {
    m.push(T);
    let x = m.length - 1;
    for (; x; ) {
      const F = x - 1 >> 1;
      if (m[F].priority <= T.priority) break;
      m[x] = m[F], x = F;
    }
    m[x] = T;
  }
  function p() {
    const T = m[0], x = m.pop();
    if (m.length) {
      let F = 0;
      for (; F * 2 + 1 < m.length; ) {
        let E = F * 2 + 1;
        if (E + 1 < m.length && m[E + 1].priority < m[E].priority && E++, x.priority <= m[E].priority) break;
        m[F] = m[E], F = E;
      }
      m[F] = x;
    }
    return T;
  }
  const g = (T) => Math.abs(T.x - a.x) + Math.abs(T.y - a.y);
  for (const T of [0, 1]) {
    const x = v * 2 + T;
    i.set(x, 0), V({ key: x, cost: 0, priority: g(e) });
  }
  const y = /* @__PURE__ */ new Map(), C = /* @__PURE__ */ new Map();
  for (; m.length; ) {
    const T = p(), x = Math.floor(T.key / 2), F = T.key % 2;
    if (T.cost !== i.get(T.key)) continue;
    if (x === f) {
      const _ = [];
      let re = T.key;
      for (; re !== void 0; )
        _.push(c(Math.floor(re / 2))), re = u.get(re);
      return Go(_.reverse());
    }
    const E = c(x), Q = x % d, G = Math.floor(x / d);
    for (const [_, re] of [[Q > 0 ? x - 1 : -1, 0], [Q + 1 < d ? x + 1 : -1, 0], [G > 0 ? x - d : -1, 1], [G + 1 < o.length ? x + d : -1, 1]]) {
      if (_ < 0) continue;
      const ce = c(_);
      if (y.has(_) || y.set(_, !t.some((O) => wl(ce, O))), !y.get(_)) continue;
      const fe = `${Math.min(x, _)}:${Math.max(x, _)}`;
      if (C.has(fe) || C.set(fe, !t.some((O) => tn(E, ce, O))), !C.get(fe)) continue;
      const se = T.cost + Math.abs(E.x - ce.x) + Math.abs(E.y - ce.y) + (F === re ? 0 : 18), oe = _ * 2 + re;
      se >= (i.get(oe) ?? 1 / 0) || (i.set(oe, se), u.set(oe, T.key), V({ key: oe, cost: se, priority: se + g(ce) }));
    }
  }
  throw new Error("Process map has no collision-free route between its ports: " + JSON.stringify({ start: e, end: a, startInside: t.filter((T) => wl(e, T)), endInside: t.filter((T) => wl(a, T)) }));
}
function Go(e) {
  const a = [];
  for (const t of e) {
    const l = a.at(-1), o = a.at(-2);
    l && l.x === t.x && l.y === t.y || (o && l && (o.x === l.x && l.x === t.x || o.y === l.y && l.y === t.y) && a.pop(), a.push(t));
  }
  return a;
}
const ha = (e) => Array.from(e).reduce((a, t) => a + (/[^\x20-\x7e]/u.test(t) ? 16 : /[MW@%]/.test(t) ? 11 : /[ilI.,:;!| ']/.test(t) ? 4 : 7.5), 0);
function na(e, a = 28) {
  const t = [];
  let l = "";
  for (const o of e.split(/\s+/u))
    for (let d = 0; d < o.length; d += a) {
      const f = o.slice(d, d + a);
      l && l.length + f.length + 1 > a && (t.push(l), l = ""), l = l ? l + " " + f : f;
    }
  return [...t, l].filter(Boolean);
}
function ja(e) {
  if (e = Go(e), !e.length) return "";
  let a = `M ${e[0].x} ${e[0].y}`;
  for (let l = 1; l < e.length - 1; l++) {
    const o = e[l - 1], d = e[l], f = e[l + 1], v = Math.hypot(d.x - o.x, d.y - o.y), c = Math.hypot(f.x - d.x, f.y - d.y), i = Math.min(8, v / 3, c / 3);
    i && (a += ` L ${d.x + (o.x - d.x) * i / v} ${d.y + (o.y - d.y) * i / v} Q ${d.x} ${d.y} ${d.x + (f.x - d.x) * i / c} ${d.y + (f.y - d.y) * i / c}`);
  }
  const t = e.at(-1);
  return a + ` L ${t.x} ${t.y}`;
}
function an(e, a = {}, t = { width: 1400, height: 480 }) {
  const l = t.direction ?? (t.width < 750 || Ha(e).length > 8 ? "TB" : "LR"), o = t.direction === "LR" && Ha(e).length > 6, d = new vo.graphlib.Graph({ multigraph: !0 });
  d.setGraph({ rankdir: l, ranker: "network-simplex", acyclicer: "greedy", nodesep: 32, edgesep: 32, ranksep: 24, marginx: 32, marginy: 32 }), d.setDefaultEdgeLabel(() => ({}));
  const f = Ha(e), v = new Map(f.map((h, P) => [h.id, P])), c = e.states.map((h) => {
    const P = (e.transitions ?? []).filter((w) => w.from === "any" && w.to === h.id), ie = na(we(h), o ? 13 : 28), J = na(Ri(h, e), o ? 13 : 28), ye = P.flatMap((w) => na(Ke(w) + " works from any state")), Ve = a.policy?.wip?.[h.id]?.limit, Ae = Ve === void 0 ? 0 : ha(" · limit " + Ve), $ = Math.max(o ? 122 : 168, ...ie.map((w) => ha(w) + 58), ...J.map((w, W) => ha(w) + 32 + (W === J.length - 1 ? Ae : 0)), ...ye.map((w) => ha(w) + 32)), D = Math.max(80, 42 + ie.length * 18 + J.length * 16 + ye.length * 18);
    return d.setNode(h.id, { width: $ + (l === "LR" ? 36 : 0), height: D + (l === "TB" ? 36 : 0) }), { state: h, x: 0, y: 0, width: $, height: D, title: ie, caption: J, badges: P, row: v.has(h.id) ? 0 : 1 };
  }), i = new Set(c.map((h) => h.state.id)), u = (e.transitions ?? []).flatMap((h) => h.from === "any" ? [] : h.from.filter((P) => i.has(P) && i.has(h.to)).map((P) => {
    const ie = `${h.id}-${P}`, J = na(Ke(h), o ? 12 : 28), ye = Math.max(o ? 60 : 72, ...J.map((Ae) => ha(Ae) + 24)), Ve = Math.max(24, J.length * 16 + 10);
    return { transition: h, from: P, key: ie, lines: J, width: ye, height: Ve };
  })), m = /* @__PURE__ */ new Set(), V = /* @__PURE__ */ new Set(), p = new Set(u.filter((h) => h.from === h.transition.to || h.transition.to === e.initial || ["completed", "canceled"].includes(c.find((P) => P.state.id === h.from).state.category)).map((h) => h.key));
  function g(h) {
    if (!V.has(h)) {
      m.add(h);
      for (const P of u.filter((ie) => ie.from === h))
        p.has(P.key) || (m.has(P.transition.to) ? p.add(P.key) : g(P.transition.to));
      m.delete(h), V.add(h);
    }
  }
  g(e.initial);
  for (const h of c) g(h.state.id);
  for (const h of u) if (!p.has(h.key)) {
    const P = v.get(h.from), ie = v.get(h.transition.to);
    d.setEdge(h.from, h.transition.to, { width: h.width, height: h.height, labelpos: "c", weight: P !== void 0 && ie === P + 1 ? 100 : 1 }, h.key);
  }
  for (const h of e.transitions ?? []) if (h.from === "any" && i.has(e.initial) && i.has(h.to) && !v.has(h.to)) {
    const P = e.states.find((ie) => ie.id === h.to);
    d.setEdge(e.initial, h.to, { minlen: ["completed", "canceled"].includes(P.category) ? Math.max(1, f.length - 1) : 1 }, `any:${h.id}`);
  }
  const y = e.states.flatMap((h) => (h.regions ?? []).filter((P) => i.has(P.initial)).map((P, ie) => {
    const J = `lane:${h.id}:${ie}`;
    return d.setEdge(h.id, P.initial, {}, J), { state: h, region: P, key: J };
  }));
  if (!c.length) return { nodes: c, edges: [], parallels: [], main: f, direction: l, width: 320, height: 160 };
  vo.layout(d);
  for (const h of c) Object.assign(h, { x: d.node(h.state.id).x, y: d.node(h.state.id).y });
  const C = l === "TB", T = u.filter((h) => !p.has(h.key)).map((h) => d.edge({ v: h.from, w: h.transition.to, name: h.key })), x = [...c, ...T], F = Math.max(...x.map((h) => h.x + h.width / 2)), E = Math.max(...x.map((h) => h.y + h.height / 2)), Q = (h) => c.find((P) => P.state.id === h), G = u.filter((h) => p.has(h.key)).sort((h, P) => {
    const ie = C ? "y" : "x";
    return Math.abs(Q(h.from)[ie] - Q(h.transition.to)[ie]) - Math.abs(Q(P.from)[ie] - Q(P.transition.to)[ie]);
  }), _ = /* @__PURE__ */ new Map(), re = Math.max(0, ...G.map((h) => h.width));
  let ce = E + 32;
  for (const [h, P] of G.entries()) {
    const ie = Q(P.from), J = Q(P.transition.to), ye = C ? F + 16 + re + 28 + h * 18 : ce + P.height / 2, Ve = C ? F + 16 + re / 2 : (ie.x + J.x) / 2;
    let Ae = C ? ie.y + ie.height / 2 + 18 : ye;
    if (C) for (const $ of [..._.values()].sort((D, w) => D.y - w.y))
      Ae + P.height / 2 + 10 > $.y - $.height / 2 - 10 && Ae - P.height / 2 - 10 < $.y + $.height / 2 + 10 && (Ae = $.y + $.height / 2 + 24 + P.height / 2);
    _.set(P.key, { x: Ve, y: Ae, corridor: ye, height: P.height }), ce = ye + P.height / 2 + 24;
  }
  const fe = u.map((h) => ({ ...h, ..._.get(h.key) ?? d.edge({ v: h.from, w: h.transition.to, name: h.key }) })), se = (h, P) => ({ x: h.x - h.width / 2 - P, y: h.y - h.height / 2 - P, width: h.width + P * 2, height: h.height + P * 2 }), oe = [...c.map((h) => se(h, 12)), ...fe.map((h) => se(h, 10))], O = (h, P) => ({
    start: C ? { x: h.x, y: h.y + h.height / 2 } : { x: h.x + h.width / 2, y: h.y },
    end: C ? { x: P.x, y: P.y - P.height / 2 } : { x: P.x - P.width / 2, y: P.y }
  }), ae = (h, P) => C ? { x: h.x, y: h.y + P } : { x: h.x + P, y: h.y }, L = fe.map((h) => {
    const P = c.find((De) => De.state.id === h.from), ie = c.find((De) => De.state.id === h.transition.to), { start: J, end: ye } = O(P, ie), Ve = p.has(h.key), Ae = ae(J, 18), $ = ae(ye, -18), D = (Ve || !C ? h.width : h.height) / 2 + 10, w = Ve ? { x: h.x + (C ? -D : D), y: h.y } : ae(h, -D), W = Ve ? { x: h.x + (C ? D : -D), y: h.y } : ae(h, D);
    let he;
    if (Ve) {
      const { corridor: De } = _.get(h.key), Pe = C ? { x: De, y: h.y } : { x: Ae.x, y: De }, qe = C ? { x: De, y: $.y } : { x: $.x, y: De };
      he = C ? [
        [J, ...Lt(Ae, w, oe)],
        [W, Pe, qe, ...Lt(qe, $, oe), ye]
      ] : [
        [J, ...Lt(Ae, Pe, oe), w],
        [W, ...Lt(qe, $, oe), ye]
      ];
    } else he = [
      [J, ...Lt(Ae, w, oe)],
      [...Lt(W, $, oe), ye]
    ];
    const me = Ve ? "return" : v.get(h.transition.to) === (v.get(h.from) ?? -2) + 1 ? "main" : "forward";
    return { ...h, points: he.flat(), segments: he, path: he.map(ja).join(" "), type: me, targetOffset: 0 };
  }), ve = y.map((h) => {
    const P = c.find((Ae) => Ae.state.id === h.state.id), ie = c.find((Ae) => Ae.state.id === h.region.initial), { start: J, end: ye } = O(P, ie), Ve = [J, ...Lt(ae(J, 18), ae(ye, -18), oe), ye];
    return { state: h.state, key: h.key, points: Ve, path: ja(Ve) };
  }), Y = [...c.flatMap((h) => [{ x: h.x - h.width / 2, y: h.y - h.height / 2 }, { x: h.x + h.width / 2, y: h.y + h.height / 2 }]), ...L.flatMap((h) => [...h.points, { x: h.x - h.width / 2, y: h.y - h.height / 2 }, { x: h.x + h.width / 2, y: h.y + h.height / 2 }]), ...ve.flatMap((h) => h.points)], M = 32 - Math.min(...Y.map((h) => h.x)), S = 32 - Math.min(...Y.map((h) => h.y)), N = Math.max(...Y.map((h) => h.x)) + M + 32, A = Math.max(...Y.map((h) => h.y)) + S + 32, X = (h) => ({ x: h.x + M, y: h.y + S });
  for (const h of c) Object.assign(h, X(h));
  for (const h of L)
    Object.assign(h, X(h)), h.segments = h.segments.map((P) => P.map(X)), h.points = h.segments.flat(), h.path = h.segments.map(ja).join(" ");
  for (const h of ve)
    h.points = h.points.map(X), h.path = ja(h.points);
  return { nodes: c, edges: L, parallels: ve, main: f, direction: l, width: N, height: A };
}
const ln = ["aria-label"], on = {
  key: 0,
  class: "kx-settings-rail-group"
}, nn = ["aria-current", "onClick"], sn = { class: "kx-settings-rail-label" }, rn = /* @__PURE__ */ $e({
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
      let v;
      switch (o.key) {
        case "ArrowDown":
        case "ArrowRight":
          v = (f + 1) % d.length;
          break;
        case "ArrowUp":
        case "ArrowLeft":
          v = (f + d.length - 1) % d.length;
          break;
        case "Home":
          v = 0;
          break;
        case "End":
          v = d.length - 1;
          break;
        default:
          return;
      }
      o.preventDefault(), d[v]?.focus();
    }
    return (o, d) => (n(), H(da(e.title ? Ni : "div"), Si(Ti(e.title ? { title: e.title, count: e.count, settings: !0 } : { class: "kx-settings-rail-standalone" })), jl({
      default: q(() => [
        s("nav", {
          class: ft(["kx-settings-rail", { "kx-settings-rail-framed": e.title }]),
          "aria-label": e.label,
          onKeydown: l
        }, [
          (n(!0), b(te, null, ne(t.value, (f, v) => (n(), b("div", {
            key: f.items[0]?.value ?? v,
            class: ft(["kx-settings-rail-section", { "kx-settings-rail-leading": e.leadingItem && v === 0 }])
          }, [
            f.heading ? (n(), b("div", on, U(f.heading), 1)) : I("", !0),
            (n(!0), b(te, null, ne(f.items, (c) => (n(), b("button", {
              key: c.value,
              type: "button",
              class: "kx-settings-rail-item",
              "aria-current": c.value === e.value ? "true" : void 0,
              onClick: (i) => o.$emit("update:value", c.value)
            }, [
              c.icon ? (n(), H(r(de), {
                key: 0,
                class: "kx-settings-rail-icon",
                icon: c.icon,
                "aria-hidden": "true"
              }, null, 8, ["icon"])) : I("", !0),
              s("span", sn, U(c.label), 1)
            ], 8, nn))), 128))
          ], 2))), 128))
        ], 42, ln)
      ]),
      _: 2
    }, [
      e.title && o.$slots.actions ? {
        name: "actions",
        fn: q(() => [
          Qe(o.$slots, "actions")
        ]),
        key: "0"
      } : void 0
    ]), 1040));
  }
}), Ko = Symbol("work-navigation");
function dn() {
  return Wl(Ko, () => {
  });
}
function un(e) {
  if (e.name === "boards") return "";
  const a = encodeURIComponent(e.board);
  return e.name === "settings" ? `${a}/settings` : a;
}
const aa = (e) => `/api/v1/work/boards/${encodeURIComponent(e)}`, bo = (e) => ({ declaration: e.declaration, expected_generation: e.expected_generation, plugin_configs: e.plugin_configs }), Ut = {
  packPlan: (e, a) => _t(`${aa(e)}/pack_plan`, a, "Pack plan"),
  packApply: (e, a, t) => _t(`${aa(e)}/pack_apply`, { ...a, key: t }, "Apply pack"),
  plan: (e, a) => _t(`${aa(e)}/plan_schema`, bo(a), "Schema plan"),
  apply: (e, a, t) => _t(`${aa(e)}/apply_schema`, { ...bo(a), key: t }, "Apply schema"),
  resume: (e) => _t(`${aa(e)}/resume_migration`, {}, "Resume migration"),
  configure: (e, a, t) => _t(`${aa(e)}/configure_plugin`, { plugin: a, ...t === void 0 ? {} : { config: t } }, "Configure plugin")
}, Kl = /* @__PURE__ */ $e({
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
      const v = f.target;
      if (v instanceof Element && v !== f.currentTarget) {
        const c = v.closest('[data-work-action], button, a, input, textarea, [role="combobox"], [role="checkbox"], [role="switch"], details');
        if (c && c !== f.currentTarget) return;
      }
      l("activate", f);
    }
    function d(f) {
      f.target !== f.currentTarget || !["Enter", " "].includes(f.key) || (f.preventDefault(), t.disabled || l("activate", f));
    }
    return (f, v) => (n(), H(da(e.as), {
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
        Qe(f.$slots, "default")
      ]),
      _: 3
    }, 40, ["type", "role", "tabindex", "disabled", "aria-disabled"]));
  }
}), Hl = Symbol("section row"), cn = { class: "work-definition" }, vn = {
  key: 0,
  class: "work-definition-handle"
}, fn = { class: "work-definition-lead" }, mn = ["title"], pn = {
  key: 0,
  class: "work-definition-description"
}, bn = { class: "work-definition-details" }, hn = { class: "work-definition-code" }, gn = ["title"], kn = { class: "work-definition-kind" }, yn = {
  key: 0,
  class: "work-definition-kind-label"
}, wn = { class: "work-definition-kind-value" }, Vn = { class: "work-definition-flags" }, $n = { class: "work-definition-usage" }, xn = { class: "work-definition-actions" }, Cn = ["inert"], il = /* @__PURE__ */ $e({
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
    const a = e, t = B(!!a.initialOpen), l = Ii(), o = Wl(Hl, void 0);
    function d(v) {
      return !!a.routeSection && !!a.routeId && v === a.routeSection + "/" + a.routeId;
    }
    Se(() => o?.selected.value, (v, c) => {
      d(v) ? t.value = !0 : d(c) && (t.value = !1);
    }, { immediate: !0 });
    function f() {
      t.value = !t.value, a.routeSection && a.routeId && o?.choose(a.routeSection, a.routeId, t.value);
    }
    return (v, c) => (n(), b("article", cn, [
      s("header", {
        class: ft(["work-definition-head", { "work-definition-has-handle": r(l).handle }])
      }, [
        r(l).handle ? (n(), b("div", vn, [
          Qe(v.$slots, "handle")
        ])) : I("", !0),
        s("div", fn, [
          k(Kl, {
            class: "work-definition-toggle",
            "aria-expanded": t.value,
            onActivate: f
          }, {
            default: q(() => [
              k(r(de), {
                icon: "tabler:chevron-right",
                "aria-hidden": "true"
              }),
              s("span", {
                class: "work-row-title",
                title: e.title
              }, U(e.title), 9, mn)
            ]),
            _: 1
          }, 8, ["aria-expanded"]),
          e.description ? (n(), b("p", pn, U(e.description), 1)) : I("", !0)
        ]),
        s("div", bn, [
          s("span", hn, [
            e.code ? (n(), b("code", {
              key: 0,
              class: "work-mono",
              title: e.code
            }, U(e.code), 9, gn)) : I("", !0)
          ]),
          s("span", kn, [
            e.kind ? (n(), H(r(lt), {
              key: 0,
              severity: "secondary"
            }, {
              default: q(() => [
                e.kindLabel ? (n(), b("span", yn, U(e.kindLabel) + ":", 1)) : I("", !0),
                s("span", wn, U(e.kind), 1)
              ]),
              _: 1
            })) : I("", !0),
            Qe(v.$slots, "status")
          ]),
          s("span", Vn, [
            Qe(v.$slots, "flags")
          ]),
          s("div", $n, [
            Qe(v.$slots, "usage")
          ])
        ]),
        s("div", xn, [
          Qe(v.$slots, "actions")
        ])
      ], 2),
      k(Oo, {
        name: "work-panel",
        persisted: ""
      }, {
        default: q(() => [
          pt(s("div", {
            inert: !t.value,
            class: "work-definition-body work-stack"
          }, [
            Qe(v.$slots, "default")
          ], 8, Cn), [
            [Dt, t.value]
          ])
        ]),
        _: 3
      })
    ]));
  }
}), Sn = { class: "work-definition-scroll" }, Tn = {
  key: 0,
  class: "work-definition-columns",
  "aria-hidden": "true"
}, In = { key: 0 }, Dn = { class: "work-definition-usage" }, nl = /* @__PURE__ */ $e({
  __name: "DefinitionList",
  props: {
    count: {},
    columns: {}
  },
  setup(e) {
    return (a, t) => (n(), b("div", Sn, [
      s("div", {
        class: ft(["work-field-builder", "work-definitions-" + e.columns])
      }, [
        e.count > 3 && e.columns !== "plugins" ? (n(), b("div", Tn, [
          t[0] || (t[0] = s("span", null, null, -1)),
          t[1] || (t[1] = s("span", null, "Name", -1)),
          t[2] || (t[2] = s("span", { class: "work-definition-code" }, "Identifier", -1)),
          s("span", null, U(e.columns === "types" ? "Workflow" : "Kind"), 1),
          e.columns === "fields" ? (n(), b("span", In, "Details")) : I("", !0),
          s("span", Dn, U(e.columns === "fields" ? "Used by" : "Details"), 1),
          t[3] || (t[3] = s("span", null, null, -1))
        ])) : I("", !0),
        Qe(a.$slots, "default")
      ], 2)
    ]));
  }
}), Un = [
  { code: "key", form: "text", index: "key" },
  { code: "type", form: "text", index: "key" },
  { code: "state", form: "text", index: "key" },
  { code: "category", form: "text", index: "key" },
  { code: "rank", form: "text", index: "key" },
  { code: "parent", form: "text", index: "key" },
  { code: "created_at", form: "time", index: "key" },
  { code: "updated_at", form: "time", index: "key" }
];
function En(e) {
  const a = e.compiled.processes?.flatMap((t) => t.states.map((l) => ({ id: l.id, label: l.name }))) ?? [];
  return [...Un.filter((t) => t.code !== "rank").map((t) => t.code === "state" ? { ...t, type: "option", options: a } : t.code === "category" ? { ...t, type: "option", options: ["triage", "backlog", "unstarted", "started", "completed", "canceled"].map((l) => ({ id: l })) } : t), ...(e.compiled.fields ?? []).filter((t) => t.index && t.index !== "none")];
}
function An(e) {
  if (e?.cardinality && e.cardinality !== "one") return ["has", "in", "nin", "is_null", ...e.type === "principal" ? ["member_of"] : []];
  const a = ["eq", "neq", "in", "nin", "is_null", ...e?.type === "principal" ? ["member_of"] : []];
  return e && (["int", "number", "dec", "time", "quantity"].includes(e.form ?? "") || e.index === "number") && a.push("lt", "lte", "gt", "gte", "between"), e?.form === "text" && e.type !== "option" && a.push("contains", "starts_with"), a;
}
const Pn = { class: "work-field-control" }, On = ["id"], Rn = {
  key: 1,
  class: "work-stack work-tight"
}, Nn = { class: "work-chips" }, Mn = {
  key: 5,
  class: "work-row"
}, Fn = ["inert"], Ln = ["value"], Bn = {
  key: 1,
  class: "work-muted"
}, zn = ["inert"], jn = ["value"], Wn = {
  key: 1,
  class: "work-muted"
}, qn = {
  key: 11,
  class: "work-stack work-tight"
}, Gn = {
  class: "work-stack work-tight",
  "aria-label": "Matching items"
}, Kn = { class: "work-mono" }, Hn = {
  key: 15,
  class: "work-error work-small",
  role: "alert"
}, Ho = /* @__PURE__ */ $e({
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
    const t = e, l = a, o = K(() => t.inputId ?? `field-${t.field.code}`), d = K(() => !!t.field.cardinality && t.field.cardinality !== "one"), f = K(() => Array.isArray(t.modelValue) ? t.modelValue : []), v = K(() => t.modelValue == null ? "" : typeof t.modelValue == "object" ? ea(t.modelValue) : String(t.modelValue)), c = K(() => {
      const h = t.modelValue;
      return h && typeof h == "object" && "ref" in h && Array.isArray(h.ref) ? String(h.ref[1] ?? "") : "";
    }), i = K(() => t.disabled || fo(t.field)), u = B(!1), m = B(!1), V = B(!1), p = B(""), g = B(""), y = B([]), C = xa(), T = B([]);
    let x = 0, F;
    const E = /* @__PURE__ */ new Set();
    Se(f, (h) => {
      T.value = F ?? h.map((P, ie) => T.value[ie] ?? x++), F = void 0;
    }, { immediate: !0 });
    function Q(h) {
      l("update:modelValue", h);
    }
    function G(h, P) {
      const ie = [...f.value];
      ie[h] = P, Q(ie);
    }
    function _(h, P) {
      P ? E.delete(h) : E.add(h), l("validity", !E.size);
    }
    function re(h) {
      E.delete(T.value[h]), l("validity", !E.size), F = T.value.filter((P, ie) => ie !== h), Q(f.value.filter((P, ie) => ie !== h));
    }
    function ce() {
      F = [...T.value, x++], Q([...f.value, t.field.form === "bool" ? !1 : t.field.form === "record" ? {} : ""]);
    }
    function fe(h) {
      const P = h.detail, ie = P?.principal_id ?? P?.id;
      Q(ie ? { kind: P.type ?? "user", id: ie } : void 0);
    }
    function se(h) {
      const P = h.detail;
      Q(P?.thread_id ? { ref: ["component", P.thread_id] } : void 0);
    }
    const oe = B("");
    let O = "";
    Se(() => t.modelValue, (h) => {
      const P = JSON.stringify(h ?? {}, null, 2);
      P !== O && (O = P, oe.value = P, p.value = "", l("validity", !0));
    }, { immediate: !0 });
    function ae(h) {
      oe.value = h;
      try {
        const P = JSON.parse(h);
        if (!P || typeof P != "object" || Array.isArray(P)) throw new Error("Enter a JSON object.");
        if (t.field.type === "rich_text" && !("type" in P && typeof P.type == "string")) throw new Error("The document needs a type.");
        O = JSON.stringify(P, null, 2), p.value = "", l("validity", !0), Q(P);
      } catch (P) {
        p.value = P instanceof Error ? P.message : "Invalid JSON.", l("validity", !1);
      }
    }
    function L(h) {
      if (!h) {
        l("validity", !0), Q(void 0);
        return;
      }
      const P = Number.isFinite(Number(h)) && (t.field.form !== "int" || Number.isSafeInteger(Number(h)));
      l("validity", P), P && Q(t.field.form === "int" ? Number(h) : h);
    }
    const ve = K(() => t.field.config?.format === "date");
    function Y(h) {
      Q(h ? ve.value ? h : new Date(h).toISOString() : void 0);
    }
    const M = K(() => {
      if (typeof t.modelValue != "string") return "";
      if (ve.value) return t.modelValue.slice(0, 10);
      const h = new Date(t.modelValue);
      return Number.isNaN(h.getTime()) ? "" : new Date(h.getTime() - h.getTimezoneOffset() * 6e4).toISOString().slice(0, 16);
    });
    function S(h) {
      Q(h.detail?.ref);
    }
    function N(h) {
      Q(h.detail?.value);
    }
    let A;
    Se(g, () => {
      const h = C();
      if (clearTimeout(A), !g.value.trim()) {
        y.value = [];
        return;
      }
      A = setTimeout(async () => {
        try {
          const P = g.value.trim(), ie = /^[A-Z][A-Z0-9]{1,9}-[0-9]+$/.test(P) ? [(await Pt.item(t.boardId, { key: P })).item] : (await Pt.query(t.boardId, { where: { field: "title", op: "contains", value: P }, limit: 8 })).items;
          h() && (y.value = ie, p.value = "");
        } catch (P) {
          h() && (p.value = rt(P, "Could not search items."));
        }
      }, 200);
    });
    function X(h) {
      Q({ board: t.boardId, item: h.id }), g.value = "", y.value = [];
    }
    Aa(async () => {
      t.field.type === "principal" ? u.value = await Rt("wc-principal-picker") : t.field.config?.target === "component" && (u.value = await Rt("wc-component-picker"));
    });
    for (const [h, P] of [[() => t.editorTag, V], [() => t.linkTag, m]])
      Se(h, async (ie, J, ye) => {
        let Ve = !0;
        if (ye(() => {
          Ve = !1;
        }), P.value = !1, ie) {
          const Ae = await Rt(ie);
          Ve && (P.value = Ae);
        }
      }, { immediate: !0 });
    return ql(() => {
      clearTimeout(A), C();
    }), (h, P) => {
      const ie = Ro("FieldControl", !0);
      return n(), b("div", Pn, [
        r(fo)(e.field) ? (n(), b("output", {
          key: 0,
          id: o.value,
          class: "work-read-value"
        }, U(r(ea)(e.modelValue, e.field)), 9, On)) : d.value ? (n(), b("div", Rn, [
          s("div", Nn, [
            (n(!0), b(te, null, ne(f.value, (J, ye) => (n(), H(r(lt), {
              key: T.value[ye],
              class: "kx-tag-sm",
              severity: "secondary"
            }, {
              default: q(() => [
                z(U(r(ea)(J, e.field)) + " ", 1),
                k(r(ee), {
                  type: "button",
                  class: "work-icon-button",
                  disabled: i.value,
                  "aria-label": "Remove value " + (ye + 1),
                  onClick: (Ve) => re(ye),
                  severity: "secondary",
                  text: "",
                  size: "small"
                }, {
                  default: q(() => [
                    k(r(de), {
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
          (n(!0), b(te, null, ne(f.value, (J, ye) => (n(), b("div", {
            key: T.value[ye],
            class: "work-stack work-tight"
          }, [
            k(ie, {
              "board-id": e.boardId,
              field: { ...e.field, cardinality: "one" },
              "model-value": J,
              "input-id": o.value + "-" + T.value[ye],
              disabled: i.value,
              "editor-tag": e.editorTag,
              "link-tag": e.linkTag,
              "onUpdate:modelValue": (Ve) => G(ye, Ve),
              onValidity: (Ve) => _(T.value[ye], Ve)
            }, null, 8, ["board-id", "field", "model-value", "input-id", "disabled", "editor-tag", "link-tag", "onUpdate:modelValue", "onValidity"])
          ]))), 128)),
          k(r(ee), {
            label: "Add value",
            severity: "secondary",
            size: "small",
            disabled: i.value,
            onClick: ce,
            outlined: ""
          }, {
            icon: q(() => [
              k(r(de), {
                icon: "tabler:plus",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled"])
        ])) : e.editorTag && V.value ? (n(), H(da(e.editorTag), {
          key: 2,
          "board-id": e.boardId,
          value: JSON.stringify(e.modelValue ?? null),
          config: JSON.stringify(e.field.config ?? {}),
          readonly: i.value || void 0,
          onChange: N
        }, null, 40, ["board-id", "value", "config", "readonly"])) : e.linkTag && m.value ? (n(), H(da(e.linkTag), {
          key: 3,
          "board-id": e.boardId,
          kind: e.field.config?.target ?? e.field.type,
          value: JSON.stringify(e.modelValue ?? null),
          readonly: i.value || void 0,
          onChange: S
        }, null, 40, ["board-id", "kind", "value", "readonly"])) : e.field.type === "option" ? (n(), H(r(ue), {
          key: 4,
          placeholder: "Not set",
          inputId: o.value,
          "model-value": e.modelValue ?? "",
          disabled: i.value,
          "onUpdate:modelValue": P[0] || (P[0] = (J) => Q(J || void 0)),
          appendTo: "self",
          optionLabel: "label",
          optionValue: "value",
          optionDisabled: "disabled",
          options: [{ label: "Not set", value: "", disabled: !1 }, ...(e.field.options ?? []).map((J) => ({ label: J.label ?? J.id, value: J.id, disabled: !1 }))]
        }, null, 8, ["inputId", "model-value", "disabled", "options"])) : e.field.form === "bool" ? (n(), b("label", Mn, [
          k(r(Kt), {
            inputId: o.value,
            "model-value": e.modelValue === !0,
            disabled: i.value,
            "onUpdate:modelValue": P[1] || (P[1] = (J) => Q(J)),
            binary: ""
          }, null, 8, ["inputId", "model-value", "disabled"]),
          z(U(e.modelValue === !0 ? "Yes" : e.modelValue === !1 ? "No" : "Not set"), 1)
        ])) : e.field.form === "int" ? (n(), H(r($t), {
          key: 6,
          inputId: o.value,
          "model-value": v.value === "" ? null : Number(v.value),
          disabled: i.value,
          "onUpdate:modelValue": P[2] || (P[2] = (J) => L(J == null ? "" : String(J))),
          useGrouping: !1
        }, null, 8, ["inputId", "model-value", "disabled"])) : e.field.form === "dec" ? (n(), H(r(Te), {
          key: 7,
          id: o.value,
          inputmode: "decimal",
          "model-value": v.value,
          disabled: i.value,
          "onUpdate:modelValue": P[3] || (P[3] = (J) => L(J ?? ""))
        }, null, 8, ["id", "model-value", "disabled"])) : e.field.form === "time" ? (n(), H(r(Te), {
          key: 8,
          id: o.value,
          type: ve.value ? "date" : "datetime-local",
          value: M.value,
          disabled: i.value,
          onInput: P[4] || (P[4] = (J) => Y(J.target.value))
        }, null, 8, ["id", "type", "value", "disabled"])) : e.field.type === "principal" ? (n(), b("div", {
          key: 9,
          inert: i.value || void 0,
          class: "work-stack work-tight"
        }, [
          u.value ? (n(), b("wc-principal-picker", {
            key: 0,
            value: JSON.stringify(e.modelValue ?? {}),
            kinds: "user,group",
            onConfigChanged: fe
          }, null, 40, Ln)) : (n(), b("span", Bn, U(r(ea)(e.modelValue, e.field)) + " · Person picker is unavailable.", 1))
        ], 8, Fn)) : e.field.config?.target === "component" ? (n(), b("div", {
          key: 10,
          inert: i.value || void 0
        }, [
          u.value ? (n(), b("wc-component-picker", {
            key: 0,
            value: JSON.stringify({ thread_id: c.value }),
            onChange: se
          }, null, 40, jn)) : (n(), b("span", Wn, "Component picker is unavailable."))
        ], 8, zn)) : e.field.type === "item" ? (n(), b("div", qn, [
          k(r(lt), {
            class: "kx-tag-sm",
            severity: "secondary"
          }, {
            default: q(() => [
              z(U(r(ea)(e.modelValue, e.field)), 1)
            ]),
            _: 1
          }),
          k(r(Te), {
            id: o.value,
            modelValue: g.value,
            "onUpdate:modelValue": P[5] || (P[5] = (J) => g.value = J),
            disabled: i.value,
            placeholder: "Search a title or enter an item key",
            "aria-label": "Search items"
          }, null, 8, ["id", "modelValue", "disabled"]),
          s("div", Gn, [
            (n(!0), b(te, null, ne(y.value, (J) => (n(), H(Kl, {
              key: J.id,
              class: "work-match-item",
              disabled: i.value,
              onActivate: (ye) => X(J)
            }, {
              default: q(() => [
                s("code", Kn, U(J.key), 1),
                s("span", null, U(r(ea)(J.values.title)), 1)
              ]),
              _: 2
            }, 1032, ["disabled", "onActivate"]))), 128))
          ]),
          e.modelValue ? (n(), H(r(ee), {
            key: 0,
            label: "Clear reference",
            severity: "secondary",
            size: "small",
            disabled: i.value,
            onClick: P[6] || (P[6] = (J) => Q(void 0)),
            outlined: ""
          }, {
            icon: q(() => [
              k(r(de), {
                icon: "tabler:list-check",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled"])) : I("", !0)
        ])) : e.field.form === "record" || e.field.type === "rich_text" || e.field.form === "quantity" || e.field.form === "ref" ? (n(), H(r(Ea), {
          key: 12,
          id: o.value,
          "model-value": oe.value,
          rows: "3",
          disabled: i.value,
          "aria-invalid": !!p.value,
          "onUpdate:modelValue": P[7] || (P[7] = (J) => ae(J ?? ""))
        }, null, 8, ["id", "model-value", "disabled", "aria-invalid"])) : e.field.code === "description" ? (n(), H(r(Ea), {
          key: 13,
          id: o.value,
          "model-value": v.value,
          rows: "4",
          disabled: i.value,
          "onUpdate:modelValue": P[8] || (P[8] = (J) => Q(J))
        }, null, 8, ["id", "model-value", "disabled"])) : (n(), H(r(Te), {
          key: 14,
          id: o.value,
          "model-value": v.value,
          disabled: i.value,
          "onUpdate:modelValue": P[9] || (P[9] = (J) => Q(J))
        }, null, 8, ["id", "model-value", "disabled"])),
        p.value ? (n(), b("span", Hn, U(p.value), 1)) : I("", !0)
      ]);
    };
  }
}), Yn = { class: "work-stack work-tight work-operand-control" }, Xn = { class: "work-row work-small" }, Jn = {
  key: 1,
  class: "work-muted work-small"
}, Zn = {
  key: 2,
  class: "work-stack work-tight"
}, Qn = { class: "work-small" }, _n = {
  key: 0,
  class: "work-error work-small",
  role: "alert"
}, ga = /* @__PURE__ */ $e({
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
    const t = e, l = a, o = K(() => "$actor" in Gt(t.modelValue) ? "actor" : "$now" in Gt(t.modelValue) ? "now" : "literal"), d = B(""), f = B("");
    Se(() => t.modelValue, (i) => {
      d.value = JSON.stringify(i ?? []), f.value = "";
    }, { immediate: !0 });
    function v(i) {
      l("update:modelValue", i === "actor" ? { $actor: "id" } : i === "now" ? { $now: "P0D" } : void 0), l("validity", !0);
    }
    function c(i) {
      d.value = i;
      try {
        const u = JSON.parse(i);
        if (!Array.isArray(u)) throw new Error("Enter a JSON list.");
        f.value = "", l("validity", !0), l("update:modelValue", u);
      } catch (u) {
        f.value = u instanceof Error ? u.message : "Invalid values.", l("validity", !1);
      }
    }
    return (i, u) => (n(), b("div", Yn, [
      s("label", Xn, [
        z(U(e.label), 1),
        k(r(ue), {
          "aria-label": e.label + " operand",
          "model-value": o.value,
          disabled: e.disabled,
          "onUpdate:modelValue": u[0] || (u[0] = (m) => v(m)),
          appendTo: "self",
          optionLabel: "label",
          optionValue: "value",
          optionDisabled: "disabled",
          options: [{ label: "Value", value: "literal", disabled: !1 }, { label: "Current actor ($actor)", value: "actor", disabled: !1 }, { label: "Current time ($now)", value: "now", disabled: !1 }]
        }, null, 8, ["aria-label", "model-value", "disabled"])
      ]),
      o.value === "now" ? (n(), H(r(Te), {
        key: 0,
        "aria-label": e.label + " time offset",
        value: r(Gt)(e.modelValue).$now,
        disabled: e.disabled,
        placeholder: "-P7D",
        onInput: u[1] || (u[1] = (m) => l("update:modelValue", { $now: m.target.value }))
      }, null, 8, ["aria-label", "value", "disabled"])) : o.value === "actor" ? (n(), b("span", Jn, "The signed-in actor’s id")) : e.multiple ? (n(), b("div", Zn, [
        s("label", Qn, [
          u[5] || (u[5] = z("Values as JSON (operands may appear in the list)", -1)),
          k(r(Ea), {
            class: "work-mono",
            "aria-label": e.label + " values",
            value: d.value,
            disabled: e.disabled,
            rows: "2",
            onInput: u[2] || (u[2] = (m) => c(m.target.value))
          }, null, 8, ["aria-label", "value", "disabled"])
        ]),
        f.value ? (n(), b("p", _n, U(f.value), 1)) : I("", !0)
      ])) : (n(), H(Ho, {
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
}), es = ["disabled"], ts = { class: "work-small work-mono" }, as = { class: "work-row work-small" }, ls = { class: "work-row work-wrap" }, os = { key: 3 }, is = { class: "work-row work-wrap" }, ns = { class: "work-row" }, ss = { class: "work-row" }, rs = { class: "work-row" }, ds = {
  key: 3,
  class: "work-row work-wrap"
}, us = { class: "work-row work-wrap" }, cs = /* @__PURE__ */ $e({
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
    const t = e, l = a, o = K(() => t.path ?? "where"), d = K(() => t.depth ?? 1), f = K(() => ["and", "or", "not", "history", "match", "rel", "children"].find((oe) => oe in t.modelValue) ?? "field"), v = K(() => En(t.schema)), c = K(() => v.value.find((oe) => oe.code === t.modelValue.field) ?? { code: "value", form: "text" }), i = K(() => Gt(t.modelValue.history)), u = K(() => v.value.find((oe) => oe.code === i.value.field) ?? { code: "history", form: "text" }), m = K(() => Array.isArray(t.modelValue[f.value]) ? t.modelValue[f.value] : []), V = {
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
    }, p = {
      field: "Field value",
      and: "All conditions",
      or: "Any condition",
      not: "Condition is false",
      history: "Value history",
      rel: "Linked items",
      children: "Child items",
      match: "Search text"
    }, g = () => ({ field: "category", op: "eq", value: "unstarted" }), y = B(/* @__PURE__ */ new Set());
    function C(oe, O) {
      O ? y.value.delete(oe) : y.value.add(oe), l("validity", y.value.size === 0);
    }
    Se(f, () => {
      y.value.clear(), l("validity", !0);
    });
    function T(oe) {
      const O = /* @__PURE__ */ new Set();
      for (const ae of y.value) {
        const L = Number(ae);
        !Number.isNaN(L) && L !== oe && O.add(String(L > oe ? L - 1 : L));
      }
      y.value = O, l("validity", O.size === 0), F({ [f.value]: m.value.filter((ae, L) => L !== oe) });
    }
    function x(oe) {
      l("update:modelValue", oe);
    }
    function F(oe) {
      x({ ...t.modelValue, ...oe });
    }
    function E(oe) {
      x(oe === "field" ? g() : oe === "and" || oe === "or" ? { [oe]: [g()] } : oe === "not" ? { not: g() } : oe === "history" ? { history: { field: "state", changed: !0 } } : oe === "match" ? { match: "" } : oe === "children" ? { children: !0, q: "some", where: g() } : { rel: t.schema.compiled.relation_types?.[0]?.id ?? "", dir: "outward", q: "some", where: g() });
    }
    function Q(oe, O) {
      F({ [f.value]: m.value.map((ae, L) => L === oe ? O : ae) });
    }
    function G(oe, O) {
      const ae = { ...i.value };
      O === void 0 ? (delete ae[oe], C(oe, !0)) : ae[oe] = O, F({ history: ae });
    }
    function _(oe) {
      y.value.clear(), l("validity", !0);
      const O = { ...i.value };
      delete O.was, delete O.changed, delete O.from, delete O.to, O[oe] = oe === "changed" ? !0 : "", F({ history: O });
    }
    const re = { code: "actor", form: "text" }, ce = { code: "at", form: "time" }, fe = K(() => Array.isArray(i.value.during) ? i.value.during : []);
    function se(oe, O) {
      const ae = [...fe.value];
      ae[oe] = O, G("during", ae);
    }
    return (oe, O) => {
      const ae = Ro("FilterNode", !0);
      return n(), b("fieldset", {
        class: "work-filter-node",
        disabled: e.disabled
      }, [
        s("legend", ts, U(o.value), 1),
        s("label", as, [
          O[21] || (O[21] = z("Condition", -1)),
          k(r(ue), {
            "aria-label": o.value + " condition",
            "model-value": f.value,
            "onUpdate:modelValue": O[0] || (O[0] = (L) => E(L)),
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            optionDisabled: "disabled",
            options: Object.entries(p).map(([L, ve]) => ({ label: ve, value: L, disabled: d.value >= 6 && ["and", "or", "not", "rel", "children"].includes(L) }))
          }, null, 8, ["aria-label", "model-value", "options"])
        ]),
        f.value === "and" || f.value === "or" ? (n(), b(te, { key: 0 }, [
          (n(!0), b(te, null, ne(m.value, (L, ve) => (n(), b("div", {
            key: ve,
            class: "work-stack work-tight"
          }, [
            k(ae, {
              "board-id": e.boardId,
              schema: e.schema,
              "model-value": L,
              path: o.value + "." + f.value + "[" + ve + "]",
              depth: d.value + 1,
              "onUpdate:modelValue": (Y) => Q(ve, Y),
              onValidity: (Y) => C(String(ve), Y)
            }, null, 8, ["board-id", "schema", "model-value", "path", "depth", "onUpdate:modelValue", "onValidity"]),
            k(r(ee), {
              label: "Remove condition",
              size: "small",
              severity: "secondary",
              onClick: (Y) => T(ve),
              outlined: ""
            }, {
              icon: q(() => [
                k(r(de), {
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
            onClick: O[1] || (O[1] = (L) => F({ [f.value]: [...m.value, g()] })),
            outlined: ""
          }, {
            icon: q(() => [
              k(r(de), {
                icon: "tabler:plus",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled"])
        ], 64)) : f.value === "not" ? (n(), H(ae, {
          key: 1,
          "board-id": e.boardId,
          schema: e.schema,
          "model-value": r(Gt)(e.modelValue.not),
          path: o.value + ".not",
          depth: d.value + 1,
          "onUpdate:modelValue": O[2] || (O[2] = (L) => F({ not: L })),
          onValidity: O[3] || (O[3] = (L) => C("nested", L))
        }, null, 8, ["board-id", "schema", "model-value", "path", "depth"])) : f.value === "field" ? (n(), b(te, { key: 2 }, [
          s("div", ls, [
            s("label", null, [
              O[22] || (O[22] = z("Field", -1)),
              k(r(ue), {
                "aria-label": o.value + " field",
                "model-value": e.modelValue.field,
                "onUpdate:modelValue": O[4] || (O[4] = (L) => F({ field: L, op: "eq", value: void 0 })),
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                optionDisabled: "disabled",
                options: [...(v.value ?? []).map((L) => ({ label: r(Je)(L), value: L.code, disabled: !1 }))]
              }, null, 8, ["aria-label", "model-value", "options"])
            ]),
            s("label", null, [
              O[23] || (O[23] = z("Comparison", -1)),
              k(r(ue), {
                "aria-label": o.value + " operator",
                "model-value": e.modelValue.op,
                "onUpdate:modelValue": O[5] || (O[5] = (L) => F({ op: L, value: L === "is_null" ? !0 : void 0 })),
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                options: r(An)(c.value).map((L) => ({ value: L, label: V[L] }))
              }, null, 8, ["aria-label", "model-value", "options"])
            ])
          ]),
          k(ga, {
            "board-id": e.boardId,
            field: e.modelValue.op === "is_null" ? { code: "null", form: "bool" } : c.value,
            "model-value": e.modelValue.value,
            multiple: ["in", "nin", "between"].includes(String(e.modelValue.op)),
            label: o.value + " value",
            "onUpdate:modelValue": O[6] || (O[6] = (L) => F({ value: L })),
            onValidity: O[7] || (O[7] = (L) => C("value", L))
          }, null, 8, ["board-id", "field", "model-value", "multiple", "label"])
        ], 64)) : f.value === "match" ? (n(), b("label", os, [
          O[24] || (O[24] = z("Search", -1)),
          k(r(Te), {
            "aria-label": o.value + " search",
            value: e.modelValue.match,
            onInput: O[8] || (O[8] = (L) => F({ match: L.target.value }))
          }, null, 8, ["aria-label", "value"])
        ])) : f.value === "history" ? (n(), b(te, { key: 4 }, [
          s("div", is, [
            s("label", null, [
              O[25] || (O[25] = z("Field", -1)),
              k(r(ue), {
                "aria-label": o.value + " history field",
                "model-value": i.value.field,
                "onUpdate:modelValue": O[9] || (O[9] = (L) => G("field", L)),
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                optionDisabled: "disabled",
                options: [...(v.value ?? []).map((L) => ({ label: r(Je)(L), value: L.code, disabled: !1 }))]
              }, null, 8, ["aria-label", "model-value", "options"])
            ]),
            s("label", null, [
              O[26] || (O[26] = z("History", -1)),
              k(r(ue), {
                "aria-label": o.value + " history mode",
                "model-value": i.value.changed ? "changed" : "was",
                "onUpdate:modelValue": O[10] || (O[10] = (L) => _(L)),
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                optionDisabled: "disabled",
                options: [{ label: "Changed", value: "changed", disabled: !1 }, { label: "Was", value: "was", disabled: !1 }]
              }, null, 8, ["aria-label", "model-value"])
            ])
          ]),
          i.value.changed ? (n(), b(te, { key: 0 }, ne(["from", "to"], (L) => s("div", { key: L }, [
            s("label", ns, [
              k(r(Kt), {
                "model-value": L in i.value,
                "aria-label": "Constrain " + L,
                "onUpdate:modelValue": (ve) => G(L, ve ? "" : void 0),
                binary: ""
              }, null, 8, ["model-value", "aria-label", "onUpdate:modelValue"]),
              z(U(L), 1)
            ]),
            L in i.value ? (n(), H(ga, {
              key: 0,
              "board-id": e.boardId,
              field: u.value,
              "model-value": i.value[L],
              label: o.value + " history " + L,
              "onUpdate:modelValue": (ve) => G(L, ve),
              onValidity: (ve) => C(L, ve)
            }, null, 8, ["board-id", "field", "model-value", "label", "onUpdate:modelValue", "onValidity"])) : I("", !0)
          ])), 64)) : (n(), H(ga, {
            key: 1,
            "board-id": e.boardId,
            field: u.value,
            "model-value": i.value.was,
            label: o.value + " history was",
            "onUpdate:modelValue": O[11] || (O[11] = (L) => G("was", L)),
            onValidity: O[12] || (O[12] = (L) => C("was", L))
          }, null, 8, ["board-id", "field", "model-value", "label"])),
          s("label", ss, [
            k(r(Kt), {
              "model-value": "by" in i.value,
              "aria-label": "Constrain actor",
              "onUpdate:modelValue": O[13] || (O[13] = (L) => G("by", L ? { $actor: "id" } : void 0)),
              binary: ""
            }, null, 8, ["model-value"]),
            O[27] || (O[27] = z("By actor", -1))
          ]),
          "by" in i.value ? (n(), H(ga, {
            key: 2,
            "board-id": e.boardId,
            field: re,
            "model-value": i.value.by,
            label: o.value + " history by",
            "onUpdate:modelValue": O[14] || (O[14] = (L) => G("by", L))
          }, null, 8, ["board-id", "model-value", "label"])) : I("", !0),
          s("label", rs, [
            k(r(Kt), {
              "model-value": "during" in i.value,
              "aria-label": "Constrain time window",
              "onUpdate:modelValue": O[15] || (O[15] = (L) => G("during", L ? [{ $now: "-P30D" }, { $now: "P0D" }] : void 0)),
              binary: ""
            }, null, 8, ["model-value"]),
            O[28] || (O[28] = z("During", -1))
          ]),
          "during" in i.value ? (n(), b("div", ds, [
            (n(), b(te, null, ne(["start", "end"], (L, ve) => k(ga, {
              key: L,
              "board-id": e.boardId,
              field: ce,
              "model-value": fe.value[ve],
              label: o.value + " during " + L,
              "onUpdate:modelValue": (Y) => se(ve, Y)
            }, null, 8, ["board-id", "model-value", "label", "onUpdate:modelValue"])), 64))
          ])) : I("", !0)
        ], 64)) : (n(), b(te, { key: 5 }, [
          s("div", us, [
            f.value === "rel" ? (n(), b(te, { key: 0 }, [
              s("label", null, [
                O[29] || (O[29] = z("Relation", -1)),
                k(r(ue), {
                  "model-value": e.modelValue.rel,
                  "onUpdate:modelValue": O[16] || (O[16] = (L) => F({ rel: L })),
                  appendTo: "self",
                  optionLabel: "label",
                  optionValue: "value",
                  optionDisabled: "disabled",
                  options: [...(e.schema.compiled.relation_types ?? []).map((L) => ({ label: L.outward ?? L.id, value: L.id, disabled: !1 }))]
                }, null, 8, ["model-value", "options"])
              ]),
              s("label", null, [
                O[30] || (O[30] = z("Direction", -1)),
                k(r(ue), {
                  "model-value": e.modelValue.dir,
                  "onUpdate:modelValue": O[17] || (O[17] = (L) => F({ dir: L })),
                  appendTo: "self",
                  optionLabel: "label",
                  optionValue: "value",
                  optionDisabled: "disabled",
                  options: [{ label: "Outward", value: "outward", disabled: !1 }, { label: "Inward", value: "inward", disabled: !1 }]
                }, null, 8, ["model-value"])
              ])
            ], 64)) : I("", !0),
            s("label", null, [
              O[31] || (O[31] = z("Quantifier", -1)),
              k(r(ue), {
                "model-value": e.modelValue.q,
                "onUpdate:modelValue": O[18] || (O[18] = (L) => F({ q: L })),
                appendTo: "self",
                options: ["some", "every", "none"]
              }, null, 8, ["model-value"])
            ])
          ]),
          k(ae, {
            "board-id": e.boardId,
            schema: e.schema,
            "model-value": r(Gt)(e.modelValue.where),
            path: o.value + ".where",
            depth: d.value + 1,
            "onUpdate:modelValue": O[19] || (O[19] = (L) => F({ where: L })),
            onValidity: O[20] || (O[20] = (L) => C("nested", L))
          }, null, 8, ["board-id", "schema", "model-value", "path", "depth"])
        ], 64))
      ], 8, es);
    };
  }
}), vs = { class: "work-stack work-tight" }, fs = { class: "work-row work-small" }, Yl = /* @__PURE__ */ $e({
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
    function f(c, i) {
      i ? d.delete(c) : d.add(c), l("validity", !d.size);
    }
    function v(c) {
      l("update:modelValue", c ? { field: t.draft.fields?.[0]?.code ?? "state", op: "eq" } : void 0), c || (d.clear(), l("validity", !0));
    }
    return St(() => l("validity", !0)), (c, i) => (n(), b("section", vs, [
      s("label", fs, [
        k(r(at), {
          "model-value": e.modelValue != null,
          "aria-label": e.label,
          "onUpdate:modelValue": v
        }, null, 8, ["model-value", "aria-label"]),
        z(U(e.label), 1)
      ]),
      e.modelValue != null ? (n(), H(cs, {
        key: 0,
        schema: o.value,
        "board-id": e.boardId ?? "",
        "model-value": r(Gt)(e.modelValue),
        path: e.label,
        "onUpdate:modelValue": i[0] || (i[0] = (u) => l("update:modelValue", u)),
        onValidity: i[1] || (i[1] = (u) => f("structured", u))
      }, null, 8, ["schema", "board-id", "model-value", "path"])) : I("", !0),
      e.modelValue != null ? (n(), H(Nt, {
        key: 1,
        label: e.label + " predicate",
        "model-value": e.modelValue,
        hint: "Use any predicate accepted by Work, including installed or deeply nested forms.",
        "onUpdate:modelValue": i[2] || (i[2] = (u) => l("update:modelValue", u)),
        onValidity: i[3] || (i[3] = (u) => f("raw", u))
      }, null, 8, ["label", "model-value"])) : I("", !0)
    ]));
  }
}), ms = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, ps = ["aria-label"], bs = { class: "work-field-label" }, hs = {
  key: 0,
  class: "work-chips"
}, gs = ["kinds"], ks = {
  key: 2,
  class: "work-muted work-small"
}, Xl = /* @__PURE__ */ $e({
  __name: "PrincipalsPicker",
  props: {
    modelValue: {},
    label: {},
    kinds: {},
    boardId: {}
  },
  emits: ["update:modelValue"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = B(!1), d = B(0), f = K(() => t.modelValue ?? []), { principalLabel: v, rememberPrincipal: c, nameError: i } = Fo(() => t.boardId ?? "", () => f.value);
    Aa(async () => {
      o.value = await Rt("wc-principal-picker");
    });
    function u(m) {
      const V = m.detail, p = V?.principal_id ?? V?.id;
      if (!p) return;
      const g = { kind: V.type ?? "user", id: p };
      V.label && c(g, V.label), f.value.some((y) => y.id === p && y.kind === g.kind) || l("update:modelValue", [...f.value, g]), d.value++;
    }
    return (m, V) => (n(), b(te, null, [
      r(i) ? (n(), b("p", ms, U(r(i)), 1)) : I("", !0),
      s("section", {
        class: "work-stack work-tight work-principals-picker",
        "aria-label": e.label
      }, [
        s("h4", bs, U(e.label), 1),
        f.value.length ? (n(), b("div", hs, [
          (n(!0), b(te, null, ne(f.value, (p, g) => (n(), H(r(lt), {
            key: p.kind + p.id,
            severity: "secondary",
            class: "kx-tag-sm"
          }, {
            default: q(() => [
              z(U(r(v)(p)), 1),
              k(r(ee), {
                text: "",
                severity: "secondary",
                size: "small",
                "aria-label": "Remove " + r(v)(p),
                onClick: (y) => l("update:modelValue", f.value.filter((C, T) => T !== g))
              }, {
                default: q(() => [
                  k(r(de), { icon: "tabler:x" })
                ]),
                _: 1
              }, 8, ["aria-label", "onClick"])
            ]),
            _: 2
          }, 1024))), 128))
        ])) : I("", !0),
        o.value ? (n(), b("wc-principal-picker", {
          key: d.value,
          kinds: e.kinds ?? "user,group",
          onConfigChanged: u
        }, null, 40, gs)) : (n(), b("p", ks, "People and group picker is unavailable."))
      ], 8, ps)
    ], 64));
  }
}), ys = { class: "work-stack work-tight" }, Yo = /* @__PURE__ */ $e({
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
      const v = [...(t.modelValue ?? []).filter((c) => "field" in c || "service" in c), ...f.map((c) => c.kind === "group" ? { group: c.id } : { user: c.id })];
      l("update:modelValue", v.length ? v : void 0);
    }
    return (f, v) => (n(), b("div", ys, [
      k(Xl, {
        "board-id": e.boardId,
        label: e.label,
        "model-value": o.value,
        "onUpdate:modelValue": d
      }, null, 8, ["board-id", "label", "model-value"]),
      k(Nt, {
        label: e.label + " rules",
        "model-value": e.modelValue,
        shape: "array",
        example: [{ group: "selected-group" }],
        "onUpdate:modelValue": v[0] || (v[0] = (c) => l("update:modelValue", c)),
        onValidity: v[1] || (v[1] = (c) => l("validity", c))
      }, null, 8, ["label", "model-value"])
    ]));
  }
}), ws = ["disabled"], Vs = { class: "work-chips" }, $s = {
  key: 1,
  class: "work-muted work-small"
}, mt = /* @__PURE__ */ $e({
  __name: "ChipPicker",
  props: {
    label: {},
    options: {},
    modelValue: {},
    disabled: { type: Boolean }
  },
  emits: ["update:modelValue"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = B(""), d = K(() => t.options.map((c) => typeof c == "string" ? { value: c } : c)), f = K(() => d.value.filter((c) => (c.label ?? Fe(c.value)).toLocaleLowerCase().includes(o.value.toLocaleLowerCase())));
    function v(c) {
      if (t.disabled) return;
      const i = t.modelValue ?? [];
      l("update:modelValue", i.includes(c) ? i.filter((u) => u !== c) : [...i, c]);
    }
    return (c, i) => (n(), b("fieldset", {
      class: "work-chip-picker",
      disabled: e.disabled
    }, [
      s("legend", null, U(e.label), 1),
      e.options.length > 10 ? (n(), H(r(Te), {
        key: 0,
        modelValue: o.value,
        "onUpdate:modelValue": i[0] || (i[0] = (u) => o.value = u),
        type: "search",
        "aria-label": "Find " + e.label.toLowerCase(),
        placeholder: "Find a choice…"
      }, null, 8, ["modelValue", "aria-label"])) : I("", !0),
      s("div", Vs, [
        k(r(Gl), {
          "model-value": e.modelValue ?? [],
          options: f.value.map((u) => ({ value: u.value, label: u.label ?? r(Fe)(u.value) })),
          optionLabel: "label",
          optionValue: "value",
          multiple: "",
          disabled: e.disabled,
          "aria-label": e.label,
          "onUpdate:modelValue": i[1] || (i[1] = (u) => l("update:modelValue", u ?? []))
        }, null, 8, ["model-value", "options", "disabled", "aria-label"]),
        (n(!0), b(te, null, ne(e.modelValue?.filter((u) => !d.value.some((m) => m.value === u)) ?? [], (u) => (n(), H(r(ee), {
          severity: "secondary",
          text: "",
          size: "small",
          key: u,
          type: "button",
          class: "work-choice work-unavailable",
          "aria-label": "Remove unavailable " + u,
          onClick: (m) => v(u)
        }, {
          default: q(() => [
            z(U(r(Fe)(u)) + " · unavailable ×", 1)
          ]),
          _: 2
        }, 1032, ["aria-label", "onClick"]))), 128))
      ]),
      e.options.length ? I("", !0) : (n(), b("span", $s, "No choices declared."))
    ], 8, ws));
  }
});
/**!
 * Sortable 1.15.7
 * @author	RubaXa   <trash@rubaxa.org>
 * @author	owenm    <owen23355@gmail.com>
 * @license MIT
 */
function xs(e, a, t) {
  return (a = Is(a)) in e ? Object.defineProperty(e, a, {
    value: t,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : e[a] = t, e;
}
function Ct() {
  return Ct = Object.assign ? Object.assign.bind() : function(e) {
    for (var a = 1; a < arguments.length; a++) {
      var t = arguments[a];
      for (var l in t) ({}).hasOwnProperty.call(t, l) && (e[l] = t[l]);
    }
    return e;
  }, Ct.apply(null, arguments);
}
function ho(e, a) {
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
    a % 2 ? ho(Object(t), !0).forEach(function(l) {
      xs(e, l, t[l]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ho(Object(t)).forEach(function(l) {
      Object.defineProperty(e, l, Object.getOwnPropertyDescriptor(t, l));
    });
  }
  return e;
}
function Cs(e, a) {
  if (e == null) return {};
  var t, l, o = Ss(e, a);
  if (Object.getOwnPropertySymbols) {
    var d = Object.getOwnPropertySymbols(e);
    for (l = 0; l < d.length; l++) t = d[l], a.indexOf(t) === -1 && {}.propertyIsEnumerable.call(e, t) && (o[t] = e[t]);
  }
  return o;
}
function Ss(e, a) {
  if (e == null) return {};
  var t = {};
  for (var l in e) if ({}.hasOwnProperty.call(e, l)) {
    if (a.indexOf(l) !== -1) continue;
    t[l] = e[l];
  }
  return t;
}
function Ts(e, a) {
  if (typeof e != "object" || !e) return e;
  var t = e[Symbol.toPrimitive];
  if (t !== void 0) {
    var l = t.call(e, a);
    if (typeof l != "object") return l;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (a === "string" ? String : Number)(e);
}
function Is(e) {
  var a = Ts(e, "string");
  return typeof a == "symbol" ? a : a + "";
}
function Rl(e) {
  "@babel/helpers - typeof";
  return Rl = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(a) {
    return typeof a;
  } : function(a) {
    return a && typeof Symbol == "function" && a.constructor === Symbol && a !== Symbol.prototype ? "symbol" : typeof a;
  }, Rl(e);
}
var Ds = "1.15.7";
function xt(e) {
  if (typeof window < "u" && window.navigator)
    return !!/* @__PURE__ */ navigator.userAgent.match(e);
}
var Tt = xt(/(?:Trident.*rv[ :]?11\.|msie|iemobile|Windows Phone)/i), Oa = xt(/Edge/i), go = xt(/firefox/i), Ca = xt(/safari/i) && !xt(/chrome/i) && !xt(/android/i), Jl = xt(/iP(ad|od|hone)/i), Xo = xt(/chrome/i) && xt(/android/i), Jo = {
  capture: !1,
  passive: !1
};
function Ce(e, a, t) {
  e.addEventListener(a, t, !Tt && Jo);
}
function xe(e, a, t) {
  e.removeEventListener(a, t, !Tt && Jo);
}
function _a(e, a) {
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
function vt(e, a, t, l) {
  if (e) {
    t = t || document;
    do {
      if (a != null && (a[0] === ">" ? e.parentNode === t && _a(e, a) : _a(e, a)) || l && e === t)
        return e;
      if (e === t) break;
    } while (e = Zo(e));
  }
  return null;
}
var ko = /\s+/g;
function ot(e, a, t) {
  if (e && a)
    if (e.classList)
      e.classList[t ? "add" : "remove"](a);
    else {
      var l = (" " + e.className + " ").replace(ko, " ").replace(" " + a + " ", " ");
      e.className = (l + (t ? " " + a : "")).replace(ko, " ");
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
function ra(e, a) {
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
function Qo(e, a, t) {
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
function je(e, a, t, l, o) {
  if (!(!e.getBoundingClientRect && e !== window)) {
    var d, f, v, c, i, u, m;
    if (e !== window && e.parentNode && e !== bt() ? (d = e.getBoundingClientRect(), f = d.top, v = d.left, c = d.bottom, i = d.right, u = d.height, m = d.width) : (f = 0, v = 0, c = window.innerHeight, i = window.innerWidth, u = window.innerHeight, m = window.innerWidth), (a || t) && e !== window && (o = o || e.parentNode, !Tt))
      do
        if (o && o.getBoundingClientRect && (pe(o, "transform") !== "none" || t && pe(o, "position") !== "static")) {
          var V = o.getBoundingClientRect();
          f -= V.top + parseInt(pe(o, "border-top-width")), v -= V.left + parseInt(pe(o, "border-left-width")), c = f + d.height, i = v + d.width;
          break;
        }
      while (o = o.parentNode);
    if (l && e !== window) {
      var p = ra(o || e), g = p && p.a, y = p && p.d;
      p && (f /= y, v /= g, m /= g, u /= y, c = f + u, i = v + m);
    }
    return {
      top: f,
      left: v,
      bottom: c,
      right: i,
      width: m,
      height: u
    };
  }
}
function yo(e, a, t) {
  for (var l = Ot(e, !0), o = je(e)[a]; l; ) {
    var d = je(l)[t], f = void 0;
    if (f = o >= d, !f) return l;
    if (l === bt()) break;
    l = Ot(l, !1);
  }
  return !1;
}
function ua(e, a, t, l) {
  for (var o = 0, d = 0, f = e.children; d < f.length; ) {
    if (f[d].style.display !== "none" && f[d] !== be.ghost && (l || f[d] !== be.dragged) && vt(f[d], t.draggable, e, !1)) {
      if (o === a)
        return f[d];
      o++;
    }
    d++;
  }
  return null;
}
function Zl(e, a) {
  for (var t = e.lastElementChild; t && (t === be.ghost || pe(t, "display") === "none" || a && !_a(t, a)); )
    t = t.previousElementSibling;
  return t || null;
}
function st(e, a) {
  var t = 0;
  if (!e || !e.parentNode)
    return -1;
  for (; e = e.previousElementSibling; )
    e.nodeName.toUpperCase() !== "TEMPLATE" && e !== be.clone && (!a || _a(e, a)) && t++;
  return t;
}
function wo(e) {
  var a = 0, t = 0, l = bt();
  if (e)
    do {
      var o = ra(e), d = o.a, f = o.d;
      a += e.scrollLeft * d, t += e.scrollTop * f;
    } while (e !== l && (e = e.parentNode));
  return [a, t];
}
function Us(e, a) {
  for (var t in e)
    if (e.hasOwnProperty(t)) {
      for (var l in a)
        if (a.hasOwnProperty(l) && a[l] === e[t][l]) return Number(t);
    }
  return -1;
}
function Ot(e, a) {
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
function Es(e, a) {
  if (e && a)
    for (var t in a)
      a.hasOwnProperty(t) && (e[t] = a[t]);
  return e;
}
function Vl(e, a) {
  return Math.round(e.top) === Math.round(a.top) && Math.round(e.left) === Math.round(a.left) && Math.round(e.height) === Math.round(a.height) && Math.round(e.width) === Math.round(a.width);
}
var Sa;
function _o(e, a) {
  return function() {
    if (!Sa) {
      var t = arguments, l = this;
      t.length === 1 ? e.call(l, t[0]) : e.apply(l, t), Sa = setTimeout(function() {
        Sa = void 0;
      }, a);
    }
  };
}
function As() {
  clearTimeout(Sa), Sa = void 0;
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
    var d, f, v, c;
    if (!(!vt(o, a.draggable, e, !1) || o.animated || o === t)) {
      var i = je(o);
      l.left = Math.min((d = l.left) !== null && d !== void 0 ? d : 1 / 0, i.left), l.top = Math.min((f = l.top) !== null && f !== void 0 ? f : 1 / 0, i.top), l.right = Math.max((v = l.right) !== null && v !== void 0 ? v : -1 / 0, i.right), l.bottom = Math.max((c = l.bottom) !== null && c !== void 0 ? c : -1 / 0, i.bottom);
    }
  }), l.width = l.right - l.left, l.height = l.bottom - l.top, l.x = l.left, l.y = l.top, l;
}
var tt = "Sortable" + (/* @__PURE__ */ new Date()).getTime();
function Ps() {
  var e = [], a;
  return {
    captureAnimationState: function() {
      if (e = [], !!this.options.animation) {
        var l = [].slice.call(this.el.children);
        l.forEach(function(o) {
          if (!(pe(o, "display") === "none" || o === be.ghost)) {
            e.push({
              target: o,
              rect: je(o)
            });
            var d = ht({}, e[e.length - 1].rect);
            if (o.thisAnimationDuration) {
              var f = ra(o, !0);
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
      e.splice(Us(e, {
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
      e.forEach(function(v) {
        var c = 0, i = v.target, u = i.fromRect, m = je(i), V = i.prevFromRect, p = i.prevToRect, g = v.rect, y = ra(i, !0);
        y && (m.top -= y.f, m.left -= y.e), i.toRect = m, i.thisAnimationDuration && Vl(V, m) && !Vl(u, m) && // Make sure animatingRect is on line between toRect & fromRect
        (g.top - m.top) / (g.left - m.left) === (u.top - m.top) / (u.left - m.left) && (c = Rs(g, V, p, o.options)), Vl(m, u) || (i.prevFromRect = u, i.prevToRect = m, c || (c = o.options.animation), o.animate(i, g, m, c)), c && (d = !0, f = Math.max(f, c), clearTimeout(i.animationResetTimer), i.animationResetTimer = setTimeout(function() {
          i.animationTime = 0, i.prevFromRect = null, i.fromRect = null, i.prevToRect = null, i.thisAnimationDuration = null;
        }, c), i.thisAnimationDuration = c);
      }), clearTimeout(a), d ? a = setTimeout(function() {
        typeof l == "function" && l();
      }, f) : typeof l == "function" && l(), e = [];
    },
    animate: function(l, o, d, f) {
      if (f) {
        pe(l, "transition", ""), pe(l, "transform", "");
        var v = ra(this.el), c = v && v.a, i = v && v.d, u = (o.left - d.left) / (c || 1), m = (o.top - d.top) / (i || 1);
        l.animatingX = !!u, l.animatingY = !!m, pe(l, "transform", "translate3d(" + u + "px," + m + "px,0)"), this.forRepaintDummy = Os(l), pe(l, "transition", "transform " + f + "ms" + (this.options.easing ? " " + this.options.easing : "")), pe(l, "transform", "translate3d(0,0,0)"), typeof l.animated == "number" && clearTimeout(l.animated), l.animated = setTimeout(function() {
          pe(l, "transition", ""), pe(l, "transform", ""), l.animated = !1, l.animatingX = !1, l.animatingY = !1;
        }, f);
      }
    }
  };
}
function Os(e) {
  return e.offsetWidth;
}
function Rs(e, a, t, l) {
  return Math.sqrt(Math.pow(a.top - e.top, 2) + Math.pow(a.left - e.left, 2)) / Math.sqrt(Math.pow(a.top - t.top, 2) + Math.pow(a.left - t.left, 2)) * l.animation;
}
var la = [], $l = {
  initializeByDefault: !0
}, Ra = {
  mount: function(a) {
    for (var t in $l)
      $l.hasOwnProperty(t) && !(t in a) && (a[t] = $l[t]);
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
    var d = a + "Global";
    la.forEach(function(f) {
      t[f.pluginName] && (t[f.pluginName][d] && t[f.pluginName][d](ht({
        sortable: t
      }, l)), t.options[f.pluginName] && t[f.pluginName][a] && t[f.pluginName][a](ht({
        sortable: t
      }, l)));
    });
  },
  initializePlugins: function(a, t, l, o) {
    la.forEach(function(v) {
      var c = v.pluginName;
      if (!(!a.options[c] && !v.initializeByDefault)) {
        var i = new v(a, t, a.options);
        i.sortable = a, i.options = a.options, a[c] = i, Ct(l, i.defaults);
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
    return la.forEach(function(o) {
      typeof o.eventProperties == "function" && Ct(l, o.eventProperties.call(t[o.pluginName], a));
    }), l;
  },
  modifyOption: function(a, t, l) {
    var o;
    return la.forEach(function(d) {
      a[d.pluginName] && d.optionListeners && typeof d.optionListeners[t] == "function" && (o = d.optionListeners[t].call(a[d.pluginName], l));
    }), o;
  }
};
function Ns(e) {
  var a = e.sortable, t = e.rootEl, l = e.name, o = e.targetEl, d = e.cloneEl, f = e.toEl, v = e.fromEl, c = e.oldIndex, i = e.newIndex, u = e.oldDraggableIndex, m = e.newDraggableIndex, V = e.originalEvent, p = e.putSortable, g = e.extraEventProperties;
  if (a = a || t && t[tt], !!a) {
    var y, C = a.options, T = "on" + l.charAt(0).toUpperCase() + l.substr(1);
    window.CustomEvent && !Tt && !Oa ? y = new CustomEvent(l, {
      bubbles: !0,
      cancelable: !0
    }) : (y = document.createEvent("Event"), y.initEvent(l, !0, !0)), y.to = f || t, y.from = v || t, y.item = o || t, y.clone = d, y.oldIndex = c, y.newIndex = i, y.oldDraggableIndex = u, y.newDraggableIndex = m, y.originalEvent = V, y.pullMode = p ? p.lastPutMode : void 0;
    var x = ht(ht({}, g), Ra.getEventProperties(l, a));
    for (var F in x)
      y[F] = x[F];
    t && t.dispatchEvent(y), C[T] && C[T].call(a, y);
  }
}
var Ms = ["evt"], et = function(a, t) {
  var l = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, o = l.evt, d = Cs(l, Ms);
  Ra.pluginEvent.bind(be)(a, t, ht({
    dragEl: le,
    parentEl: Be,
    ghostEl: ke,
    rootEl: Oe,
    nextEl: jt,
    lastDownEl: Ya,
    cloneEl: Me,
    cloneHidden: At,
    dragStarted: ka,
    putSortable: Ye,
    activeSortable: be.active,
    originalEvent: o,
    oldIndex: sa,
    oldDraggableIndex: Ta,
    newIndex: it,
    newDraggableIndex: Et,
    hideGhostForTarget: ni,
    unhideGhostForTarget: si,
    cloneNowHidden: function() {
      At = !0;
    },
    cloneNowShown: function() {
      At = !1;
    },
    dispatchSortableEvent: function(v) {
      Ze({
        sortable: t,
        name: v,
        originalEvent: o
      });
    }
  }, d));
};
function Ze(e) {
  Ns(ht({
    putSortable: Ye,
    cloneEl: Me,
    targetEl: le,
    rootEl: Oe,
    oldIndex: sa,
    oldDraggableIndex: Ta,
    newIndex: it,
    newDraggableIndex: Et
  }, e));
}
var le, Be, ke, Oe, jt, Ya, Me, At, sa, it, Ta, Et, Wa, Ye, ia = !1, el = !1, tl = [], Bt, ct, xl, Cl, Vo, $o, ka, oa, Ia, Da = !1, qa = !1, Xa, Xe, Sl = [], Nl = !1, al = [], sl = typeof document < "u", Ga = Jl, xo = Oa || Tt ? "cssFloat" : "float", Fs = sl && !Xo && !Jl && "draggable" in document.createElement("div"), li = (function() {
  if (sl) {
    if (Tt)
      return !1;
    var e = document.createElement("x");
    return e.style.cssText = "pointer-events:auto", e.style.pointerEvents === "auto";
  }
})(), oi = function(a, t) {
  var l = pe(a), o = parseInt(l.width) - parseInt(l.paddingLeft) - parseInt(l.paddingRight) - parseInt(l.borderLeftWidth) - parseInt(l.borderRightWidth), d = ua(a, 0, t), f = ua(a, 1, t), v = d && pe(d), c = f && pe(f), i = v && parseInt(v.marginLeft) + parseInt(v.marginRight) + je(d).width, u = c && parseInt(c.marginLeft) + parseInt(c.marginRight) + je(f).width;
  if (l.display === "flex")
    return l.flexDirection === "column" || l.flexDirection === "column-reverse" ? "vertical" : "horizontal";
  if (l.display === "grid")
    return l.gridTemplateColumns.split(" ").length <= 1 ? "vertical" : "horizontal";
  if (d && v.float && v.float !== "none") {
    var m = v.float === "left" ? "left" : "right";
    return f && (c.clear === "both" || c.clear === m) ? "vertical" : "horizontal";
  }
  return d && (v.display === "block" || v.display === "flex" || v.display === "table" || v.display === "grid" || i >= o && l[xo] === "none" || f && l[xo] === "none" && i + u > o) ? "vertical" : "horizontal";
}, Ls = function(a, t, l) {
  var o = l ? a.left : a.top, d = l ? a.right : a.bottom, f = l ? a.width : a.height, v = l ? t.left : t.top, c = l ? t.right : t.bottom, i = l ? t.width : t.height;
  return o === v || d === c || o + f / 2 === v + i / 2;
}, Bs = function(a, t) {
  var l;
  return tl.some(function(o) {
    var d = o[tt].options.emptyInsertThreshold;
    if (!(!d || Zl(o))) {
      var f = je(o), v = a >= f.left - d && a <= f.right + d, c = t >= f.top - d && t <= f.bottom + d;
      if (v && c)
        return l = o;
    }
  }), l;
}, ii = function(a) {
  function t(d, f) {
    return function(v, c, i, u) {
      var m = v.options.group.name && c.options.group.name && v.options.group.name === c.options.group.name;
      if (d == null && (f || m))
        return !0;
      if (d == null || d === !1)
        return !1;
      if (f && d === "clone")
        return d;
      if (typeof d == "function")
        return t(d(v, c, i, u), f)(v, c, i, u);
      var V = (f ? v : c).options.group.name;
      return d === !0 || typeof d == "string" && d === V || d.join && d.indexOf(V) > -1;
    };
  }
  var l = {}, o = a.group;
  (!o || Rl(o) != "object") && (o = {
    name: o
  }), l.name = o.name, l.checkPull = t(o.pull, !0), l.checkPut = t(o.put), l.revertClone = o.revertClone, a.group = l;
}, ni = function() {
  !li && ke && pe(ke, "display", "none");
}, si = function() {
  !li && ke && pe(ke, "display", "");
};
sl && !Xo && document.addEventListener("click", function(e) {
  if (el)
    return e.preventDefault(), e.stopPropagation && e.stopPropagation(), e.stopImmediatePropagation && e.stopImmediatePropagation(), el = !1, !1;
}, !0);
var zt = function(a) {
  if (le) {
    a = a.touches ? a.touches[0] : a;
    var t = Bs(a.clientX, a.clientY);
    if (t) {
      var l = {};
      for (var o in a)
        a.hasOwnProperty(o) && (l[o] = a[o]);
      l.target = l.rootEl = t, l.preventDefault = void 0, l.stopPropagation = void 0, t[tt]._onDragOver(l);
    }
  }
}, zs = function(a) {
  le && le.parentNode[tt]._isOutsideThisEl(a.target);
};
function be(e, a) {
  if (!(e && e.nodeType && e.nodeType === 1))
    throw "Sortable: `el` must be an HTMLElement, not ".concat({}.toString.call(e));
  this.el = e, this.options = a = Ct({}, a), e[tt] = this;
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
    setData: function(f, v) {
      f.setData("Text", v.textContent);
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
    supportPointer: be.supportPointer !== !1 && "PointerEvent" in window && (!Ca || Jl),
    emptyInsertThreshold: 5
  };
  Ra.initializePlugins(this, e, t);
  for (var l in t)
    !(l in a) && (a[l] = t[l]);
  ii(a);
  for (var o in this)
    o.charAt(0) === "_" && typeof this[o] == "function" && (this[o] = this[o].bind(this));
  this.nativeDraggable = a.forceFallback ? !1 : Fs, this.nativeDraggable && (this.options.touchStartThreshold = 1), a.supportPointer ? Ce(e, "pointerdown", this._onTapStart) : (Ce(e, "mousedown", this._onTapStart), Ce(e, "touchstart", this._onTapStart)), this.nativeDraggable && (Ce(e, "dragover", this), Ce(e, "dragenter", this)), tl.push(this.el), a.store && a.store.get && this.sort(a.store.get(this) || []), Ct(this, Ps());
}
be.prototype = /** @lends Sortable.prototype */
{
  constructor: be,
  _isOutsideThisEl: function(a) {
    !this.el.contains(a) && a !== this.el && (oa = null);
  },
  _getDirection: function(a, t) {
    return typeof this.options.direction == "function" ? this.options.direction.call(this, a, t, le) : this.options.direction;
  },
  _onTapStart: function(a) {
    if (a.cancelable) {
      var t = this, l = this.el, o = this.options, d = o.preventOnFilter, f = a.type, v = a.touches && a.touches[0] || a.pointerType && a.pointerType === "touch" && a, c = (v || a).target, i = a.target.shadowRoot && (a.path && a.path[0] || a.composedPath && a.composedPath()[0]) || c, u = o.filter;
      if (Xs(l), !le && !(/mousedown|pointerdown/.test(f) && a.button !== 0 || o.disabled) && !i.isContentEditable && !(!this.nativeDraggable && Ca && c && c.tagName.toUpperCase() === "SELECT") && (c = vt(c, o.draggable, l, !1), !(c && c.animated) && Ya !== c)) {
        if (sa = st(c), Ta = st(c, o.draggable), typeof u == "function") {
          if (u.call(this, a, c, this)) {
            Ze({
              sortable: t,
              rootEl: i,
              name: "filter",
              targetEl: c,
              toEl: l,
              fromEl: l
            }), et("filter", t, {
              evt: a
            }), d && a.preventDefault();
            return;
          }
        } else if (u && (u = u.split(",").some(function(m) {
          if (m = vt(i, m.trim(), l, !1), m)
            return Ze({
              sortable: t,
              rootEl: m,
              name: "filter",
              targetEl: c,
              fromEl: l,
              toEl: l
            }), et("filter", t, {
              evt: a
            }), !0;
        }), u)) {
          d && a.preventDefault();
          return;
        }
        o.handle && !vt(i, o.handle, l, !1) || this._prepareDragStart(a, v, c);
      }
    }
  },
  _prepareDragStart: function(a, t, l) {
    var o = this, d = o.el, f = o.options, v = d.ownerDocument, c;
    if (l && !le && l.parentNode === d) {
      var i = je(l);
      if (Oe = d, le = l, Be = le.parentNode, jt = le.nextSibling, Ya = l, Wa = f.group, be.dragged = le, Bt = {
        target: le,
        clientX: (t || a).clientX,
        clientY: (t || a).clientY
      }, Vo = Bt.clientX - i.left, $o = Bt.clientY - i.top, this._lastX = (t || a).clientX, this._lastY = (t || a).clientY, le.style["will-change"] = "all", c = function() {
        if (et("delayEnded", o, {
          evt: a
        }), be.eventCanceled) {
          o._onDrop();
          return;
        }
        o._disableDelayedDragEvents(), !go && o.nativeDraggable && (le.draggable = !0), o._triggerDragStart(a, t), Ze({
          sortable: o,
          name: "choose",
          originalEvent: a
        }), ot(le, f.chosenClass, !0);
      }, f.ignore.split(",").forEach(function(u) {
        Qo(le, u.trim(), Tl);
      }), Ce(v, "dragover", zt), Ce(v, "mousemove", zt), Ce(v, "touchmove", zt), f.supportPointer ? (Ce(v, "pointerup", o._onDrop), !this.nativeDraggable && Ce(v, "pointercancel", o._onDrop)) : (Ce(v, "mouseup", o._onDrop), Ce(v, "touchend", o._onDrop), Ce(v, "touchcancel", o._onDrop)), go && this.nativeDraggable && (this.options.touchStartThreshold = 4, le.draggable = !0), et("delayStart", this, {
        evt: a
      }), f.delay && (!f.delayOnTouchOnly || t) && (!this.nativeDraggable || !(Oa || Tt))) {
        if (be.eventCanceled) {
          this._onDrop();
          return;
        }
        f.supportPointer ? (Ce(v, "pointerup", o._disableDelayedDrag), Ce(v, "pointercancel", o._disableDelayedDrag)) : (Ce(v, "mouseup", o._disableDelayedDrag), Ce(v, "touchend", o._disableDelayedDrag), Ce(v, "touchcancel", o._disableDelayedDrag)), Ce(v, "mousemove", o._delayedDragTouchMoveHandler), Ce(v, "touchmove", o._delayedDragTouchMoveHandler), f.supportPointer && Ce(v, "pointermove", o._delayedDragTouchMoveHandler), o._dragStartTimer = setTimeout(c, f.delay);
      } else
        c();
    }
  },
  _delayedDragTouchMoveHandler: function(a) {
    var t = a.touches ? a.touches[0] : a;
    Math.max(Math.abs(t.clientX - this._lastX), Math.abs(t.clientY - this._lastY)) >= Math.floor(this.options.touchStartThreshold / (this.nativeDraggable && window.devicePixelRatio || 1)) && this._disableDelayedDrag();
  },
  _disableDelayedDrag: function() {
    le && Tl(le), clearTimeout(this._dragStartTimer), this._disableDelayedDragEvents();
  },
  _disableDelayedDragEvents: function() {
    var a = this.el.ownerDocument;
    xe(a, "mouseup", this._disableDelayedDrag), xe(a, "touchend", this._disableDelayedDrag), xe(a, "touchcancel", this._disableDelayedDrag), xe(a, "pointerup", this._disableDelayedDrag), xe(a, "pointercancel", this._disableDelayedDrag), xe(a, "mousemove", this._delayedDragTouchMoveHandler), xe(a, "touchmove", this._delayedDragTouchMoveHandler), xe(a, "pointermove", this._delayedDragTouchMoveHandler);
  },
  _triggerDragStart: function(a, t) {
    t = t || a.pointerType == "touch" && a, !this.nativeDraggable || t ? this.options.supportPointer ? Ce(document, "pointermove", this._onTouchMove) : t ? Ce(document, "touchmove", this._onTouchMove) : Ce(document, "mousemove", this._onTouchMove) : (Ce(le, "dragend", this), Ce(Oe, "dragstart", this._onDragStart));
    try {
      document.selection ? Ja(function() {
        document.selection.empty();
      }) : window.getSelection().removeAllRanges();
    } catch {
    }
  },
  _dragStarted: function(a, t) {
    if (ia = !1, Oe && le) {
      et("dragStarted", this, {
        evt: t
      }), this.nativeDraggable && Ce(document, "dragover", zs);
      var l = this.options;
      !a && ot(le, l.dragClass, !1), ot(le, l.ghostClass, !0), be.active = this, a && this._appendGhost(), Ze({
        sortable: this,
        name: "start",
        originalEvent: t
      });
    } else
      this._nulling();
  },
  _emulateDragOver: function() {
    if (ct) {
      this._lastX = ct.clientX, this._lastY = ct.clientY, ni();
      for (var a = document.elementFromPoint(ct.clientX, ct.clientY), t = a; a && a.shadowRoot && (a = a.shadowRoot.elementFromPoint(ct.clientX, ct.clientY), a !== t); )
        t = a;
      if (le.parentNode[tt]._isOutsideThisEl(a), t)
        do {
          if (t[tt]) {
            var l = void 0;
            if (l = t[tt]._onDragOver({
              clientX: ct.clientX,
              clientY: ct.clientY,
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
    if (Bt) {
      var t = this.options, l = t.fallbackTolerance, o = t.fallbackOffset, d = a.touches ? a.touches[0] : a, f = ke && ra(ke, !0), v = ke && f && f.a, c = ke && f && f.d, i = Ga && Xe && wo(Xe), u = (d.clientX - Bt.clientX + o.x) / (v || 1) + (i ? i[0] - Sl[0] : 0) / (v || 1), m = (d.clientY - Bt.clientY + o.y) / (c || 1) + (i ? i[1] - Sl[1] : 0) / (c || 1);
      if (!be.active && !ia) {
        if (l && Math.max(Math.abs(d.clientX - this._lastX), Math.abs(d.clientY - this._lastY)) < l)
          return;
        this._onDragStart(a, !0);
      }
      if (ke) {
        f ? (f.e += u - (xl || 0), f.f += m - (Cl || 0)) : f = {
          a: 1,
          b: 0,
          c: 0,
          d: 1,
          e: u,
          f: m
        };
        var V = "matrix(".concat(f.a, ",").concat(f.b, ",").concat(f.c, ",").concat(f.d, ",").concat(f.e, ",").concat(f.f, ")");
        pe(ke, "webkitTransform", V), pe(ke, "mozTransform", V), pe(ke, "msTransform", V), pe(ke, "transform", V), xl = u, Cl = m, ct = d;
      }
      a.cancelable && a.preventDefault();
    }
  },
  _appendGhost: function() {
    if (!ke) {
      var a = this.options.fallbackOnBody ? document.body : Oe, t = je(le, !0, Ga, !0, a), l = this.options;
      if (Ga) {
        for (Xe = a; pe(Xe, "position") === "static" && pe(Xe, "transform") === "none" && Xe !== document; )
          Xe = Xe.parentNode;
        Xe !== document.body && Xe !== document.documentElement ? (Xe === document && (Xe = bt()), t.top += Xe.scrollTop, t.left += Xe.scrollLeft) : Xe = bt(), Sl = wo(Xe);
      }
      ke = le.cloneNode(!0), ot(ke, l.ghostClass, !1), ot(ke, l.fallbackClass, !0), ot(ke, l.dragClass, !0), pe(ke, "transition", ""), pe(ke, "transform", ""), pe(ke, "box-sizing", "border-box"), pe(ke, "margin", 0), pe(ke, "top", t.top), pe(ke, "left", t.left), pe(ke, "width", t.width), pe(ke, "height", t.height), pe(ke, "opacity", "0.8"), pe(ke, "position", Ga ? "absolute" : "fixed"), pe(ke, "zIndex", "100000"), pe(ke, "pointerEvents", "none"), be.ghost = ke, a.appendChild(ke), pe(ke, "transform-origin", Vo / parseInt(ke.style.width) * 100 + "% " + $o / parseInt(ke.style.height) * 100 + "%");
    }
  },
  _onDragStart: function(a, t) {
    var l = this, o = a.dataTransfer, d = l.options;
    if (et("dragStart", this, {
      evt: a
    }), be.eventCanceled) {
      this._onDrop();
      return;
    }
    et("setupClone", this), be.eventCanceled || (Me = ti(le), Me.removeAttribute("id"), Me.draggable = !1, Me.style["will-change"] = "", this._hideClone(), ot(Me, this.options.chosenClass, !1), be.clone = Me), l.cloneId = Ja(function() {
      et("clone", l), !be.eventCanceled && (l.options.removeCloneOnHide || Oe.insertBefore(Me, le), l._hideClone(), Ze({
        sortable: l,
        name: "clone"
      }));
    }), !t && ot(le, d.dragClass, !0), t ? (el = !0, l._loopId = setInterval(l._emulateDragOver, 50)) : (xe(document, "mouseup", l._onDrop), xe(document, "touchend", l._onDrop), xe(document, "touchcancel", l._onDrop), o && (o.effectAllowed = "move", d.setData && d.setData.call(l, o, le)), Ce(document, "drop", l), pe(le, "transform", "translateZ(0)")), ia = !0, l._dragStartId = Ja(l._dragStarted.bind(l, t, a)), Ce(document, "selectstart", l), ka = !0, window.getSelection().removeAllRanges(), Ca && pe(document.body, "user-select", "none");
  },
  // Returns true - if no further action is needed (either inserted or another condition)
  _onDragOver: function(a) {
    var t = this.el, l = a.target, o, d, f, v = this.options, c = v.group, i = be.active, u = Wa === c, m = v.sort, V = Ye || i, p, g = this, y = !1;
    if (Nl) return;
    function C(M, S) {
      et(M, g, ht({
        evt: a,
        isOwner: u,
        axis: p ? "vertical" : "horizontal",
        revert: f,
        dragRect: o,
        targetRect: d,
        canSort: m,
        fromSortable: V,
        target: l,
        completed: x,
        onMove: function(A, X) {
          return Ka(Oe, t, le, o, A, je(A), a, X);
        },
        changed: F
      }, S));
    }
    function T() {
      C("dragOverAnimationCapture"), g.captureAnimationState(), g !== V && V.captureAnimationState();
    }
    function x(M) {
      return C("dragOverCompleted", {
        insertion: M
      }), M && (u ? i._hideClone() : i._showClone(g), g !== V && (ot(le, Ye ? Ye.options.ghostClass : i.options.ghostClass, !1), ot(le, v.ghostClass, !0)), Ye !== g && g !== be.active ? Ye = g : g === be.active && Ye && (Ye = null), V === g && (g._ignoreWhileAnimating = l), g.animateAll(function() {
        C("dragOverAnimationComplete"), g._ignoreWhileAnimating = null;
      }), g !== V && (V.animateAll(), V._ignoreWhileAnimating = null)), (l === le && !le.animated || l === t && !l.animated) && (oa = null), !v.dragoverBubble && !a.rootEl && l !== document && (le.parentNode[tt]._isOutsideThisEl(a.target), !M && zt(a)), !v.dragoverBubble && a.stopPropagation && a.stopPropagation(), y = !0;
    }
    function F() {
      it = st(le), Et = st(le, v.draggable), Ze({
        sortable: g,
        name: "change",
        toEl: t,
        newIndex: it,
        newDraggableIndex: Et,
        originalEvent: a
      });
    }
    if (a.preventDefault !== void 0 && a.cancelable && a.preventDefault(), l = vt(l, v.draggable, t, !0), C("dragOver"), be.eventCanceled) return y;
    if (le.contains(a.target) || l.animated && l.animatingX && l.animatingY || g._ignoreWhileAnimating === l)
      return x(!1);
    if (el = !1, i && !v.disabled && (u ? m || (f = Be !== Oe) : Ye === this || (this.lastPutMode = Wa.checkPull(this, i, le, a)) && c.checkPut(this, i, le, a))) {
      if (p = this._getDirection(a, l) === "vertical", o = je(le), C("dragOverValid"), be.eventCanceled) return y;
      if (f)
        return Be = Oe, T(), this._hideClone(), C("revert"), be.eventCanceled || (jt ? Oe.insertBefore(le, jt) : Oe.appendChild(le)), x(!0);
      var E = Zl(t, v.draggable);
      if (!E || Gs(a, p, this) && !E.animated) {
        if (E === le)
          return x(!1);
        if (E && t === a.target && (l = E), l && (d = je(l)), Ka(Oe, t, le, o, l, d, a, !!l) !== !1)
          return T(), E && E.nextSibling ? t.insertBefore(le, E.nextSibling) : t.appendChild(le), Be = t, F(), x(!0);
      } else if (E && qs(a, p, this)) {
        var Q = ua(t, 0, v, !0);
        if (Q === le)
          return x(!1);
        if (l = Q, d = je(l), Ka(Oe, t, le, o, l, d, a, !1) !== !1)
          return T(), t.insertBefore(le, Q), Be = t, F(), x(!0);
      } else if (l.parentNode === t) {
        d = je(l);
        var G = 0, _, re = le.parentNode !== t, ce = !Ls(le.animated && le.toRect || o, l.animated && l.toRect || d, p), fe = p ? "top" : "left", se = yo(l, "top", "top") || yo(le, "top", "top"), oe = se ? se.scrollTop : void 0;
        oa !== l && (_ = d[fe], Da = !1, qa = !ce && v.invertSwap || re), G = Ks(a, l, d, p, ce ? 1 : v.swapThreshold, v.invertedSwapThreshold == null ? v.swapThreshold : v.invertedSwapThreshold, qa, oa === l);
        var O;
        if (G !== 0) {
          var ae = st(le);
          do
            ae -= G, O = Be.children[ae];
          while (O && (pe(O, "display") === "none" || O === ke));
        }
        if (G === 0 || O === l)
          return x(!1);
        oa = l, Ia = G;
        var L = l.nextElementSibling, ve = !1;
        ve = G === 1;
        var Y = Ka(Oe, t, le, o, l, d, a, ve);
        if (Y !== !1)
          return (Y === 1 || Y === -1) && (ve = Y === 1), Nl = !0, setTimeout(Ws, 30), T(), ve && !L ? t.appendChild(le) : l.parentNode.insertBefore(le, ve ? L : l), se && ei(se, 0, oe - se.scrollTop), Be = le.parentNode, _ !== void 0 && !qa && (Xa = Math.abs(_ - je(l)[fe])), F(), x(!0);
      }
      if (t.contains(le))
        return x(!1);
    }
    return !1;
  },
  _ignoreWhileAnimating: null,
  _offMoveEvents: function() {
    xe(document, "mousemove", this._onTouchMove), xe(document, "touchmove", this._onTouchMove), xe(document, "pointermove", this._onTouchMove), xe(document, "dragover", zt), xe(document, "mousemove", zt), xe(document, "touchmove", zt);
  },
  _offUpEvents: function() {
    var a = this.el.ownerDocument;
    xe(a, "mouseup", this._onDrop), xe(a, "touchend", this._onDrop), xe(a, "pointerup", this._onDrop), xe(a, "pointercancel", this._onDrop), xe(a, "touchcancel", this._onDrop), xe(document, "selectstart", this);
  },
  _onDrop: function(a) {
    var t = this.el, l = this.options;
    if (it = st(le), Et = st(le, l.draggable), et("drop", this, {
      evt: a
    }), Be = le && le.parentNode, it = st(le), Et = st(le, l.draggable), be.eventCanceled) {
      this._nulling();
      return;
    }
    ia = !1, qa = !1, Da = !1, clearInterval(this._loopId), clearTimeout(this._dragStartTimer), Ml(this.cloneId), Ml(this._dragStartId), this.nativeDraggable && (xe(document, "drop", this), xe(t, "dragstart", this._onDragStart)), this._offMoveEvents(), this._offUpEvents(), Ca && pe(document.body, "user-select", ""), pe(le, "transform", ""), a && (ka && (a.cancelable && a.preventDefault(), !l.dropBubble && a.stopPropagation()), ke && ke.parentNode && ke.parentNode.removeChild(ke), (Oe === Be || Ye && Ye.lastPutMode !== "clone") && Me && Me.parentNode && Me.parentNode.removeChild(Me), le && (this.nativeDraggable && xe(le, "dragend", this), Tl(le), le.style["will-change"] = "", ka && !ia && ot(le, Ye ? Ye.options.ghostClass : this.options.ghostClass, !1), ot(le, this.options.chosenClass, !1), Ze({
      sortable: this,
      name: "unchoose",
      toEl: Be,
      newIndex: null,
      newDraggableIndex: null,
      originalEvent: a
    }), Oe !== Be ? (it >= 0 && (Ze({
      rootEl: Be,
      name: "add",
      toEl: Be,
      fromEl: Oe,
      originalEvent: a
    }), Ze({
      sortable: this,
      name: "remove",
      toEl: Be,
      originalEvent: a
    }), Ze({
      rootEl: Be,
      name: "sort",
      toEl: Be,
      fromEl: Oe,
      originalEvent: a
    }), Ze({
      sortable: this,
      name: "sort",
      toEl: Be,
      originalEvent: a
    })), Ye && Ye.save()) : it !== sa && it >= 0 && (Ze({
      sortable: this,
      name: "update",
      toEl: Be,
      originalEvent: a
    }), Ze({
      sortable: this,
      name: "sort",
      toEl: Be,
      originalEvent: a
    })), be.active && ((it == null || it === -1) && (it = sa, Et = Ta), Ze({
      sortable: this,
      name: "end",
      toEl: Be,
      originalEvent: a
    }), this.save()))), this._nulling();
  },
  _nulling: function() {
    et("nulling", this), Oe = le = Be = ke = jt = Me = Ya = At = Bt = ct = ka = it = Et = sa = Ta = oa = Ia = Ye = Wa = be.dragged = be.ghost = be.clone = be.active = null;
    var a = this.el;
    al.forEach(function(t) {
      a.contains(t) && (t.checked = !0);
    }), al.length = xl = Cl = 0;
  },
  handleEvent: function(a) {
    switch (a.type) {
      case "drop":
      case "dragend":
        this._onDrop(a);
        break;
      case "dragenter":
      case "dragover":
        le && (this._onDragOver(a), js(a));
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
      t = l[o], vt(t, f.draggable, this.el, !1) && a.push(t.getAttribute(f.dataIdAttr) || Ys(t));
    return a;
  },
  /**
   * Sorts the elements according to the array.
   * @param  {String[]}  order  order of the items
   */
  sort: function(a, t) {
    var l = {}, o = this.el;
    this.toArray().forEach(function(d, f) {
      var v = o.children[f];
      vt(v, this.options.draggable, o, !1) && (l[d] = v);
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
    var o = Ra.modifyOption(this, a, t);
    typeof o < "u" ? l[a] = o : l[a] = t, a === "group" && ii(l);
  },
  /**
   * Destroy
   */
  destroy: function() {
    et("destroy", this);
    var a = this.el;
    a[tt] = null, xe(a, "mousedown", this._onTapStart), xe(a, "touchstart", this._onTapStart), xe(a, "pointerdown", this._onTapStart), this.nativeDraggable && (xe(a, "dragover", this), xe(a, "dragenter", this)), Array.prototype.forEach.call(a.querySelectorAll("[draggable]"), function(t) {
      t.removeAttribute("draggable");
    }), this._onDrop(), this._disableDelayedDragEvents(), tl.splice(tl.indexOf(this.el), 1), this.el = a = null;
  },
  _hideClone: function() {
    if (!At) {
      if (et("hideClone", this), be.eventCanceled) return;
      pe(Me, "display", "none"), this.options.removeCloneOnHide && Me.parentNode && Me.parentNode.removeChild(Me), At = !0;
    }
  },
  _showClone: function(a) {
    if (a.lastPutMode !== "clone") {
      this._hideClone();
      return;
    }
    if (At) {
      if (et("showClone", this), be.eventCanceled) return;
      le.parentNode == Oe && !this.options.group.revertClone ? Oe.insertBefore(Me, le) : jt ? Oe.insertBefore(Me, jt) : Oe.appendChild(Me), this.options.group.revertClone && this.animate(le, Me), pe(Me, "display", ""), At = !1;
    }
  }
};
function js(e) {
  e.dataTransfer && (e.dataTransfer.dropEffect = "move"), e.cancelable && e.preventDefault();
}
function Ka(e, a, t, l, o, d, f, v) {
  var c, i = e[tt], u = i.options.onMove, m;
  return window.CustomEvent && !Tt && !Oa ? c = new CustomEvent("move", {
    bubbles: !0,
    cancelable: !0
  }) : (c = document.createEvent("Event"), c.initEvent("move", !0, !0)), c.to = a, c.from = e, c.dragged = t, c.draggedRect = l, c.related = o || a, c.relatedRect = d || je(a), c.willInsertAfter = v, c.originalEvent = f, e.dispatchEvent(c), u && (m = u.call(i, c, f)), m;
}
function Tl(e) {
  e.draggable = !1;
}
function Ws() {
  Nl = !1;
}
function qs(e, a, t) {
  var l = je(ua(t.el, 0, t.options, !0)), o = ai(t.el, t.options, ke), d = 10;
  return a ? e.clientX < o.left - d || e.clientY < l.top && e.clientX < l.right : e.clientY < o.top - d || e.clientY < l.bottom && e.clientX < l.left;
}
function Gs(e, a, t) {
  var l = je(Zl(t.el, t.options.draggable)), o = ai(t.el, t.options, ke), d = 10;
  return a ? e.clientX > o.right + d || e.clientY > l.bottom && e.clientX > l.left : e.clientY > o.bottom + d || e.clientX > l.right && e.clientY > l.top;
}
function Ks(e, a, t, l, o, d, f, v) {
  var c = l ? e.clientY : e.clientX, i = l ? t.height : t.width, u = l ? t.top : t.left, m = l ? t.bottom : t.right, V = !1;
  if (!f) {
    if (v && Xa < i * o) {
      if (!Da && (Ia === 1 ? c > u + i * d / 2 : c < m - i * d / 2) && (Da = !0), Da)
        V = !0;
      else if (Ia === 1 ? c < u + Xa : c > m - Xa)
        return -Ia;
    } else if (c > u + i * (1 - o) / 2 && c < m - i * (1 - o) / 2)
      return Hs(a);
  }
  return V = V || f, V && (c < u + i * d / 2 || c > m - i * d / 2) ? c > u + i / 2 ? 1 : -1 : 0;
}
function Hs(e) {
  return st(le) < st(e) ? 1 : -1;
}
function Ys(e) {
  for (var a = e.tagName + e.className + e.src + e.href + e.textContent, t = a.length, l = 0; t--; )
    l += a.charCodeAt(t);
  return l.toString(36);
}
function Xs(e) {
  al.length = 0;
  for (var a = e.getElementsByTagName("input"), t = a.length; t--; ) {
    var l = a[t];
    l.checked && al.push(l);
  }
}
function Ja(e) {
  return setTimeout(e, 0);
}
function Ml(e) {
  return clearTimeout(e);
}
sl && Ce(document, "touchmove", function(e) {
  (be.active || ia) && e.cancelable && e.preventDefault();
});
be.utils = {
  on: Ce,
  off: xe,
  css: pe,
  find: Qo,
  is: function(a, t) {
    return !!vt(a, t, a, !1);
  },
  extend: Es,
  throttle: _o,
  closest: vt,
  toggleClass: ot,
  clone: ti,
  index: st,
  nextTick: Ja,
  cancelNextTick: Ml,
  detectDirection: oi,
  getChild: ua,
  expando: tt
};
be.get = function(e) {
  return e[tt];
};
be.mount = function() {
  for (var e = arguments.length, a = new Array(e), t = 0; t < e; t++)
    a[t] = arguments[t];
  a[0].constructor === Array && (a = a[0]), a.forEach(function(l) {
    if (!l.prototype || !l.prototype.constructor)
      throw "Sortable: Mounted plugin must be a constructor function, not ".concat({}.toString.call(l));
    l.utils && (be.utils = ht(ht({}, be.utils), l.utils)), Ra.mount(l);
  });
};
be.create = function(e, a) {
  return new be(e, a);
};
be.version = Ds;
var ze = [], ya, Fl, Ll = !1, Il, Dl, ll, wa;
function Js() {
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
      this.sortable.nativeDraggable ? xe(document, "dragover", this._handleAutoScroll) : (xe(document, "pointermove", this._handleFallbackAutoScroll), xe(document, "touchmove", this._handleFallbackAutoScroll), xe(document, "mousemove", this._handleFallbackAutoScroll)), Co(), Za(), As();
    },
    nulling: function() {
      ll = Fl = ya = Ll = wa = Il = Dl = null, ze.length = 0;
    },
    _handleFallbackAutoScroll: function(t) {
      this._handleAutoScroll(t, !0);
    },
    _handleAutoScroll: function(t, l) {
      var o = this, d = (t.touches ? t.touches[0] : t).clientX, f = (t.touches ? t.touches[0] : t).clientY, v = document.elementFromPoint(d, f);
      if (ll = t, l || this.options.forceAutoScrollFallback || Oa || Tt || Ca) {
        Ul(t, this.options, v, l);
        var c = Ot(v, !0);
        Ll && (!wa || d !== Il || f !== Dl) && (wa && Co(), wa = setInterval(function() {
          var i = Ot(document.elementFromPoint(d, f), !0);
          i !== c && (c = i, Za()), Ul(t, o.options, i, l);
        }, 10), Il = d, Dl = f);
      } else {
        if (!this.options.bubbleScroll || Ot(v, !0) === bt()) {
          Za();
          return;
        }
        Ul(t, this.options, Ot(v, !1), !1);
      }
    }
  }, Ct(e, {
    pluginName: "scroll",
    initializeByDefault: !0
  });
}
function Za() {
  ze.forEach(function(e) {
    clearInterval(e.pid);
  }), ze = [];
}
function Co() {
  clearInterval(wa);
}
var Ul = _o(function(e, a, t, l) {
  if (a.scroll) {
    var o = (e.touches ? e.touches[0] : e).clientX, d = (e.touches ? e.touches[0] : e).clientY, f = a.scrollSensitivity, v = a.scrollSpeed, c = bt(), i = !1, u;
    Fl !== t && (Fl = t, Za(), ya = a.scroll, u = a.scrollFn, ya === !0 && (ya = Ot(t, !0)));
    var m = 0, V = ya;
    do {
      var p = V, g = je(p), y = g.top, C = g.bottom, T = g.left, x = g.right, F = g.width, E = g.height, Q = void 0, G = void 0, _ = p.scrollWidth, re = p.scrollHeight, ce = pe(p), fe = p.scrollLeft, se = p.scrollTop;
      p === c ? (Q = F < _ && (ce.overflowX === "auto" || ce.overflowX === "scroll" || ce.overflowX === "visible"), G = E < re && (ce.overflowY === "auto" || ce.overflowY === "scroll" || ce.overflowY === "visible")) : (Q = F < _ && (ce.overflowX === "auto" || ce.overflowX === "scroll"), G = E < re && (ce.overflowY === "auto" || ce.overflowY === "scroll"));
      var oe = Q && (Math.abs(x - o) <= f && fe + F < _) - (Math.abs(T - o) <= f && !!fe), O = G && (Math.abs(C - d) <= f && se + E < re) - (Math.abs(y - d) <= f && !!se);
      if (!ze[m])
        for (var ae = 0; ae <= m; ae++)
          ze[ae] || (ze[ae] = {});
      (ze[m].vx != oe || ze[m].vy != O || ze[m].el !== p) && (ze[m].el = p, ze[m].vx = oe, ze[m].vy = O, clearInterval(ze[m].pid), (oe != 0 || O != 0) && (i = !0, ze[m].pid = setInterval(function() {
        l && this.layer === 0 && be.active._onTouchMove(ll);
        var L = ze[this.layer].vy ? ze[this.layer].vy * v : 0, ve = ze[this.layer].vx ? ze[this.layer].vx * v : 0;
        typeof u == "function" && u.call(be.dragged.parentNode[tt], ve, L, e, ll, ze[this.layer].el) !== "continue" || ei(ze[this.layer].el, ve, L);
      }.bind({
        layer: m
      }), 24))), m++;
    } while (a.bubbleScroll && V !== c && (V = Ot(V, !1)));
    Ll = i;
  }
}, 30), ri = function(a) {
  var t = a.originalEvent, l = a.putSortable, o = a.dragEl, d = a.activeSortable, f = a.dispatchSortableEvent, v = a.hideGhostForTarget, c = a.unhideGhostForTarget;
  if (t) {
    var i = l || d;
    v();
    var u = t.changedTouches && t.changedTouches.length ? t.changedTouches[0] : t, m = document.elementFromPoint(u.clientX, u.clientY);
    c(), i && !i.el.contains(m) && (f("spill"), this.onSpill({
      dragEl: o,
      putSortable: l
    }));
  }
};
function Ql() {
}
Ql.prototype = {
  startIndex: null,
  dragStart: function(a) {
    var t = a.oldDraggableIndex;
    this.startIndex = t;
  },
  onSpill: function(a) {
    var t = a.dragEl, l = a.putSortable;
    this.sortable.captureAnimationState(), l && l.captureAnimationState();
    var o = ua(this.sortable.el, this.startIndex, this.options);
    o ? this.sortable.el.insertBefore(t, o) : this.sortable.el.appendChild(t), this.sortable.animateAll(), l && l.animateAll();
  },
  drop: ri
};
Ct(Ql, {
  pluginName: "revertOnSpill"
});
function _l() {
}
_l.prototype = {
  onSpill: function(a) {
    var t = a.dragEl, l = a.putSortable, o = l || this.sortable;
    o.captureAnimationState(), t.parentNode && t.parentNode.removeChild(t), o.animateAll();
  },
  drop: ri
};
Ct(_l, {
  pluginName: "removeOnSpill"
});
be.mount(new Js());
be.mount(_l, Ql);
function Zs(e, a) {
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
  return St(() => {
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
          const f = d.oldDraggableIndex, v = d.newDraggableIndex;
          Zs(d, ".work-reorder-entry"), f !== void 0 && v !== void 0 && f !== v && e(f, v);
        }
      }));
    },
    unmounted: t
  };
}
const Qs = { class: "work-stack work-tight work-option-builder" }, _s = { class: "work-stack work-tight" }, er = { class: "work-stack work-tight work-small" }, tr = { class: "work-stack work-tight work-small" }, ar = { class: "work-stack work-tight" }, lr = { class: "work-stack work-tight work-small" }, or = { class: "work-row" }, ir = { class: "work-stack work-tight work-small" }, nr = { class: "work-row" }, sr = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, rr = { class: "work-add-option" }, dr = {
  key: 0,
  class: "work-muted work-small"
}, ur = /* @__PURE__ */ $e({
  __name: "OptionsEditor",
  props: {
    field: {}
  },
  emits: ["validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = "options:" + Ht(), d = K(() => t.field.options ?? []), f = K(() => d.value.every((m, V) => !!m.id && d.value.findIndex((p) => p.id === m.id) === V));
    Se(f, (m) => l("validity", m, o), { immediate: !0 }), St(() => l("validity", !0, o));
    function v(m, V) {
      Bo(d.value, m, V - m), d.value.forEach((p, g) => p.order = g);
    }
    const c = di(v), i = ["primary", "success", "info", "warn", "danger", "secondary"];
    function u() {
      let m = d.value.length + 1;
      for (; d.value.some((V) => V.id === `option_${m}`); ) m++;
      (t.field.options ??= []).push({ id: `option_${m}`, label: "New option", order: d.value.length });
    }
    return (m, V) => (n(), b("section", Qs, [
      V[4] || (V[4] = s("header", { class: "work-row" }, [
        s("h4", null, "Options"),
        s("span", { class: "work-muted work-small" }, "Renaming a choice keeps it selected on existing items."),
        s("span", { class: "work-spacer" })
      ], -1)),
      pt((n(), b("div", _s, [
        (n(!0), b(te, null, ne(d.value, (p, g) => (n(), b("div", {
          key: g,
          class: "work-option-row work-reorder-entry"
        }, [
          k(r(ee), {
            type: "button",
            class: "work-icon-button work-reorder-handle",
            "aria-label": "Drag option; arrow keys reorder",
            onKeydown: [
              Ge(Re((y) => v(g, g - 1), ["prevent"]), ["up"]),
              Ge(Re((y) => v(g, g + 1), ["prevent"]), ["down"])
            ],
            severity: "secondary",
            text: "",
            size: "small"
          }, {
            default: q(() => [
              k(r(de), {
                icon: "tabler:grip-vertical",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["onKeydown"]),
          s("label", er, [
            V[0] || (V[0] = z("Label", -1)),
            k(r(Te), {
              modelValue: p.label,
              "onUpdate:modelValue": (y) => p.label = y,
              "aria-label": "Option label"
            }, null, 8, ["modelValue", "onUpdate:modelValue"])
          ]),
          k(Ne, {
            class: "work-disclosure",
            label: "Advanced"
          }, {
            default: q(() => [
              s("label", tr, [
                V[1] || (V[1] = z("Integration identifier", -1)),
                k(r(Te), {
                  modelValue: p.id,
                  "onUpdate:modelValue": (y) => p.id = y,
                  class: "work-option-code",
                  required: "",
                  "aria-label": "Option ID"
                }, null, 8, ["modelValue", "onUpdate:modelValue"])
              ])
            ]),
            _: 2
          }, 1024),
          s("div", ar, [
            s("label", lr, [
              V[2] || (V[2] = z("Color", -1)),
              s("span", or, [
                s("span", {
                  class: ft(["work-color-swatch", "work-swatch-" + (p.color || "secondary")]),
                  "aria-hidden": "true"
                }, null, 2),
                k(r(ue), {
                  modelValue: p.color,
                  "onUpdate:modelValue": (y) => p.color = y,
                  "aria-label": "Option color",
                  appendTo: "self",
                  optionLabel: "label",
                  optionValue: "value",
                  optionDisabled: "disabled",
                  options: [{ label: "Default", value: void 0, disabled: !1 }, ...(i ?? []).map((y) => ({ label: y, value: y, disabled: !1 }))]
                }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
              ])
            ]),
            s("label", ir, [
              V[3] || (V[3] = z("Category", -1)),
              k(r(ue), {
                "model-value": p.category,
                "aria-label": "Option category",
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                showClear: "",
                options: ["triage", "backlog", ...r(Lo)].map((y) => ({ label: r(Yt)(y), value: y })),
                "onUpdate:modelValue": (y) => p.category = y || void 0
              }, null, 8, ["model-value", "options", "onUpdate:modelValue"])
            ])
          ]),
          s("div", nr, [
            k(r(ee), {
              "aria-label": "Option earlier",
              severity: "secondary",
              size: "small",
              disabled: g === 0,
              onClick: (y) => v(g, g - 1),
              text: ""
            }, {
              default: q(() => [
                k(r(de), {
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
              disabled: g === d.value.length - 1,
              onClick: (y) => v(g, g + 1),
              text: ""
            }, {
              default: q(() => [
                k(r(de), {
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
              onClick: (y) => d.value.splice(g, 1)
            }, {
              icon: q(() => [
                k(r(de), {
                  icon: "tabler:trash",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["onClick"])
          ])
        ]))), 128)),
        f.value ? I("", !0) : (n(), b("p", sr, "Each choice needs a unique integration identifier.")),
        s("div", rr, [
          k(r(ee), {
            label: "Add option",
            severity: "secondary",
            size: "small",
            onClick: u,
            outlined: ""
          }, {
            icon: q(() => [
              k(r(de), {
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
      d.value.length ? I("", !0) : (n(), b("p", dr, "Add the choices people can select for this field."))
    ]));
  }
}), cr = {
  class: "work-stack",
  "aria-label": "Fields editor"
}, vr = { class: "work-form-actions work-wrap" }, fr = { class: "work-stack work-tight" }, mr = {
  key: 0,
  class: "work-settings-card work-muted"
}, pr = { class: "work-muted work-small" }, br = {
  key: 0,
  class: "work-error work-small",
  role: "alert"
}, hr = { class: "work-settings-grid work-field-properties" }, gr = { class: "work-stack work-tight" }, kr = { class: "work-stack work-tight" }, yr = { class: "work-stack work-tight" }, wr = {
  key: 1,
  class: "work-stack work-tight"
}, Vr = {
  key: 4,
  class: "work-stack work-tight"
}, $r = {
  key: 5,
  class: "work-stack work-tight"
}, xr = { class: "work-stack work-tight" }, Cr = { class: "work-stack work-tight" }, Sr = { class: "work-stack work-tight" }, Tr = { class: "work-stack work-tight" }, Ir = { class: "work-stack" }, Dr = { class: "work-stack work-tight" }, Ur = { class: "work-stack work-tight" }, Er = { class: "work-stack work-tight work-field-history" }, Ar = { class: "work-settings-list" }, Pr = { class: "work-settings-row" }, Or = { class: "work-settings-row" }, Rr = { class: "work-stack" }, Nr = /* @__PURE__ */ $e({
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
    const t = e, l = a, o = K(() => t.draft.fields ?? []), d = B("text"), f = B([]), v = K(() => (t.draft.item_types ?? []).map((S) => ({ value: S.id, label: S.title || Fe(S.id) }))), c = K(() => t.draft.item_types?.find((S) => S.id === t.itemType)), i = K(() => o.value.map((S, N) => ({ field: S, index: N })).filter(({ field: S }) => !c.value || c.value.fields.includes(S.code))), u = B(""), m = B({}), V = di((S, N) => {
      const A = i.value[S]?.index, X = i.value[N]?.index;
      A !== void 0 && X !== void 0 && ae(A, X - A);
    });
    function p(S) {
      return (t.draft.item_types ?? []).filter((N) => N.fields.includes(S)).map((N) => N.title || Fe(N.id));
    }
    async function g(S) {
      if (!u.value) {
        u.value = S.code;
        try {
          const N = await t.guardRemoval?.("fields", S.code);
          m.value[S.code] = N ?? "", N || Pa(t.draft, "fields", S.code);
        } finally {
          u.value = "";
        }
      }
    }
    const y = Object.entries({ text: "Text", int: "Whole number", dec: "Decimal number", quantity: "Measurement", bool: "Yes or no", time: "Date or time", ref: "Reference", record: "Structured data", option: "Choice", principal: "Person or group", item: "Work item", rank: "Order", rich_text: "Formatted text", formula: "Formula", rollup: "Related item calculation", counter: "Counter" }).map(([S, N]) => ({ value: S, label: N })), C = [{ label: "None", value: "none" }, { label: "Exact matches", value: "key" }, { label: "Numeric ranges", value: "number" }], T = ["int", "dec", "quantity"], x = K(() => new Map(t.installedTypes?.map((S) => [S.id, S]))), F = K(() => [...y, ...(t.installedTypes ?? []).map((S) => ({ value: S.id, label: S.title }))]), E = {};
    function Q(S) {
      return S.type && S.type !== "value" ? S.type : S.form ?? "text";
    }
    function G(S) {
      return S.type ? x.value.get(S.type) : void 0;
    }
    function _(S) {
      const N = G(S)?.config_schema;
      return N && jo(N).length ? N : void 0;
    }
    function re(S) {
      const N = G(S);
      return !!N?.config_schema || ["dec", "quantity", "ref", "time", "record"].includes(N?.form ?? S.form ?? "") || !!S.config;
    }
    function ce(S) {
      const N = G(S), A = N?.form ?? S.form ?? "text";
      return C.filter(({ value: X }) => X === "none" || (!N?.indexes || N.indexes.includes(X)) && A !== "record" && (X !== "number" || T.includes(A) || S.type === "option"));
    }
    function fe(S) {
      S.index && !ce(S).some((N) => N.value === S.index) && delete S.index;
    }
    function se(S, N) {
      const A = x.value.get(N);
      if (A) {
        if (A.id === S.type) return;
        S.type = A.id, S.form = A.form, delete S.options, delete S.config, fe(S);
        return;
      }
      G(S) && delete S.config;
      const X = { option: "text", principal: "ref", item: "ref", rank: "text", rich_text: "text", formula: "int", rollup: "int", counter: "int" };
      X[N] ? (S.type = N, S.form = X[N]) : (delete S.type, S.form = N), N !== "option" ? delete S.options : S.options ??= [], N === "rich_text" && (S.config = { format: "json" }), fe(S);
    }
    function oe(S, N) {
      S.form = N, fe(S);
    }
    function O(S, N) {
      const A = { ...S.config };
      N ? A.item_type = N : delete A.item_type, S.config = Object.keys(A).length ? A : void 0;
    }
    function ae(S, N) {
      Bo(o.value, S, N);
      for (const A of t.draft.item_types ?? []) {
        const X = new Set(A.fields);
        A.fields = o.value.filter((h) => X.has(h.code)).map((h) => h.code);
      }
    }
    function L(S, N) {
      try {
        Mi(t.draft, S, N.value), delete m.value[S.code];
      } catch (A) {
        m.value[S.code] = A.message, N.value = S.code;
      }
    }
    function ve() {
      d.value = "text", f.value = c.value ? [c.value.id] : [];
    }
    function Y(S) {
      const N = S.normalize("NFKD").replace(/\p{Mark}/gu, "").toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, ""), A = (/^[a-z]/.test(N) ? N : `field_${N || "new"}`).slice(0, 40);
      let X = A, h = 2;
      for (; o.value.some((ie) => ie.code === X); ) {
        const ie = "_" + h++;
        X = A.slice(0, 40 - ie.length) + ie;
      }
      const P = { code: X, title: S, form: "text", cardinality: "one" };
      se(P, d.value), (t.draft.fields ??= []).push(P);
      for (const ie of t.draft.item_types ?? []) f.value.includes(ie.id) && ie.fields.push(X);
      c.value && !f.value.includes(c.value.id) && l("update:itemType", ""), M.value = X, l("created");
    }
    const M = B("");
    return (S, N) => (n(), b("section", cr, [
      s("div", vr, [
        k(r(ue), {
          "model-value": c.value?.id ?? "",
          "aria-label": "Filter fields by item type",
          placeholder: "All item types",
          appendTo: "self",
          optionLabel: "label",
          optionValue: "value",
          options: [{ value: "", label: "All item types" }, ...v.value],
          "onUpdate:modelValue": N[0] || (N[0] = (A) => l("update:itemType", A))
        }, null, 8, ["model-value", "options"]),
        k(Ua, {
          action: "Add field",
          label: "Field name",
          maxlength: 255,
          regular: "",
          "open-on-entry": e.createForItemType,
          onOpen: ve,
          onAdd: Y,
          onCancel: N[3] || (N[3] = (A) => l("cancel-creation"))
        }, {
          default: q(() => [
            s("label", fr, [
              N[5] || (N[5] = z("Kind", -1)),
              k(r(ue), {
                modelValue: d.value,
                "onUpdate:modelValue": N[1] || (N[1] = (A) => d.value = A),
                "aria-label": "New field kind",
                appendTo: "self",
                options: F.value,
                optionLabel: "label",
                optionValue: "value"
              }, null, 8, ["modelValue", "options"])
            ]),
            v.value.length ? (n(), H(mt, {
              key: 0,
              label: "Show on item types",
              options: v.value,
              modelValue: f.value,
              "onUpdate:modelValue": N[2] || (N[2] = (A) => f.value = A)
            }, null, 8, ["options", "modelValue"])) : I("", !0)
          ]),
          _: 1
        }, 8, ["open-on-entry"])
      ]),
      i.value.length ? I("", !0) : (n(), b("p", mr, "No fields here yet. Add a field to capture information.")),
      pt((n(), H(nl, {
        columns: "fields",
        count: i.value.length
      }, {
        default: q(() => [
          (n(!0), b(te, null, ne(i.value, ({ field: A, index: X }) => (n(), H(il, {
            "route-section": "fields",
            "route-id": A.code,
            title: r(Je)(A),
            "initial-open": M.value === A.code,
            kind: G(A)?.title || r(y).find((h) => h.value === Q(A))?.label || r(Fe)(Q(A)),
            key: A.id ?? X,
            class: "work-field-row work-reorder-entry work-stack"
          }, {
            handle: q(() => [
              k(r(ee), {
                type: "button",
                class: "work-reorder-handle work-icon-button",
                "aria-label": "Drag " + r(Je)(A) + " or use the arrow keys to reorder",
                onKeydown: [
                  Ge(Re((h) => ae(X, -1), ["prevent"]), ["up"]),
                  Ge(Re((h) => ae(X, 1), ["prevent"]), ["down"])
                ],
                severity: "secondary",
                text: "",
                size: "small"
              }, {
                default: q(() => [
                  k(r(de), {
                    icon: "tabler:grip-vertical",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["aria-label", "onKeydown"])
            ]),
            flags: q(() => [
              A.track ? (n(), H(r(lt), {
                key: 0,
                class: "kx-tag-sm",
                severity: "secondary",
                value: "Tracked"
              })) : I("", !0),
              A.intervals ? (n(), H(r(lt), {
                key: 1,
                class: "kx-tag-sm",
                severity: "secondary",
                value: "Intervals"
              })) : I("", !0)
            ]),
            usage: q(() => [
              s("span", pr, U(p(A.code).length ? p(A.code).join(", ") : "Unused"), 1)
            ]),
            actions: q(() => [
              k(r(ee), {
                "aria-label": "Move " + r(Je)(A) + " earlier",
                severity: "secondary",
                disabled: X === 0,
                onClick: (h) => ae(X, -1),
                text: "",
                size: "small"
              }, {
                default: q(() => [
                  k(r(de), {
                    icon: "tabler:arrow-up",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["aria-label", "disabled", "onClick"]),
              k(r(ee), {
                "aria-label": "Move " + r(Je)(A) + " later",
                severity: "secondary",
                disabled: X === o.value.length - 1,
                onClick: (h) => ae(X, 1),
                text: "",
                size: "small"
              }, {
                default: q(() => [
                  k(r(de), {
                    icon: "tabler:arrow-down",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["aria-label", "disabled", "onClick"])
            ]),
            default: q(() => [
              m.value[A.code] ? (n(), b("p", br, U(m.value[A.code]), 1)) : I("", !0),
              (n(!0), b(te, null, ne(e.issues?.filter((h) => h.code === A.code) ?? [], (h) => (n(), b("p", {
                key: h.what,
                class: "work-error work-small",
                role: "alert"
              }, U(r(ol)(h)), 1))), 128)),
              s("div", hr, [
                s("label", gr, [
                  N[6] || (N[6] = z("Title", -1)),
                  k(r(Te), {
                    modelValue: A.title,
                    "onUpdate:modelValue": (h) => A.title = h,
                    "aria-label": "Field title",
                    maxlength: "255",
                    placeholder: r(Je)(A)
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder"])
                ]),
                s("label", kr, [
                  N[7] || (N[7] = z("Kind", -1)),
                  k(r(ue), {
                    "aria-label": "Kind",
                    "model-value": Q(A),
                    "onUpdate:modelValue": (h) => se(A, h),
                    appendTo: "self",
                    options: F.value,
                    optionLabel: "label",
                    optionValue: "value"
                  }, null, 8, ["model-value", "onUpdate:modelValue", "options"])
                ]),
                s("label", yr, [
                  N[8] || (N[8] = z("Values allowed", -1)),
                  k(r(ue), {
                    "aria-label": "Values allowed",
                    "model-value": A.cardinality ?? "one",
                    "onUpdate:modelValue": (h) => A.cardinality = h,
                    appendTo: "self",
                    options: [{ label: "One value", value: "one" }, { label: "Multiple unique values", value: "set" }, { label: "Ordered values", value: "list" }],
                    optionLabel: "label",
                    optionValue: "value"
                  }, null, 8, ["model-value", "onUpdate:modelValue"])
                ])
              ]),
              A.type === "item" ? (n(), b("label", wr, [
                N[9] || (N[9] = z("Which items can be referenced? ", -1)),
                k(r(ue), {
                  "model-value": A.config?.item_type ?? "",
                  "aria-label": "Reference target",
                  appendTo: "self",
                  optionLabel: "label",
                  optionValue: "value",
                  options: [{ value: "", label: "Any item type" }, ...v.value],
                  "onUpdate:modelValue": (h) => O(A, h)
                }, null, 8, ["model-value", "options", "onUpdate:modelValue"]),
                N[10] || (N[10] = s("span", { class: "work-muted work-small" }, "A reference stores the selected item as a value. To show a named relationship on both items, use Links.", -1))
              ])) : I("", !0),
              _(A) ? (n(), H(zo, {
                key: A.type,
                schema: _(A),
                "model-value": A.config ?? E,
                "onUpdate:modelValue": (h) => A.config = h,
                onValidity: (h) => l("validity", "config-" + X, h)
              }, null, 8, ["schema", "model-value", "onUpdate:modelValue", "onValidity"])) : I("", !0),
              A.type === "option" ? (n(), H(ur, {
                key: 3,
                field: A,
                onValidity: N[4] || (N[4] = (h, P) => l("validity", P, h))
              }, null, 8, ["field"])) : I("", !0),
              A.type === "formula" || A.type === "rollup" ? (n(), b("label", Vr, [
                N[11] || (N[11] = z("Result type", -1)),
                k(r(ue), {
                  "model-value": A.form,
                  "onUpdate:modelValue": (h) => oe(A, h),
                  "aria-label": "Result type",
                  options: r(y).slice(0, 8),
                  optionLabel: "label",
                  optionValue: "value",
                  appendTo: "self"
                }, null, 8, ["model-value", "onUpdate:modelValue", "options"])
              ])) : I("", !0),
              A.type === "formula" ? (n(), b("label", $r, [
                N[12] || (N[12] = z("Expression", -1)),
                k(r(Te), {
                  modelValue: A.expression,
                  "onUpdate:modelValue": (h) => A.expression = h,
                  "aria-label": "Expression"
                }, null, 8, ["modelValue", "onUpdate:modelValue"])
              ])) : I("", !0),
              A.type === "rollup" ? (n(), b(te, { key: 6 }, [
                s("label", xr, [
                  N[13] || (N[13] = z("Of", -1)),
                  k(r(Te), {
                    modelValue: A.of,
                    "onUpdate:modelValue": (h) => A.of = h,
                    "aria-label": "Related items"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                s("label", Cr, [
                  N[14] || (N[14] = z("Function", -1)),
                  k(r(Te), {
                    modelValue: A.fn,
                    "onUpdate:modelValue": (h) => A.fn = h,
                    "aria-label": "Calculation"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                s("label", Sr, [
                  N[15] || (N[15] = z("Field", -1)),
                  k(r(Te), {
                    modelValue: A.field,
                    "onUpdate:modelValue": (h) => A.field = h,
                    "aria-label": "Calculated field"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                s("label", Tr, [
                  N[16] || (N[16] = z("Order by", -1)),
                  k(r(ue), {
                    "model-value": A.by,
                    "aria-label": "Rollup order",
                    options: ["rank", "time"],
                    showClear: "",
                    appendTo: "self",
                    "onUpdate:modelValue": (h) => A.by = h || void 0
                  }, null, 8, ["model-value", "onUpdate:modelValue"])
                ]),
                k(Yl, {
                  modelValue: A.where,
                  "onUpdate:modelValue": (h) => A.where = h,
                  draft: e.draft,
                  "board-id": e.boardId,
                  label: "Include related items when",
                  onValidity: (h) => l("validity", "rollup-" + X, h)
                }, null, 8, ["modelValue", "onUpdate:modelValue", "draft", "board-id", "onValidity"])
              ], 64)) : I("", !0),
              k(Ne, {
                class: "work-disclosure",
                label: "Advanced field settings"
              }, {
                default: q(() => [
                  s("div", Ir, [
                    s("label", Dr, [
                      N[17] || (N[17] = z("Field identifier for integrations", -1)),
                      k(r(Te), {
                        value: A.code,
                        "aria-label": "Field code",
                        required: "",
                        pattern: "[a-z][a-z0-9_]*",
                        onInput: (h) => L(A, h.target)
                      }, null, 8, ["value", "onInput"])
                    ]),
                    s("label", Ur, [
                      N[18] || (N[18] = z("Allow filters to use", -1)),
                      k(r(ue), {
                        "aria-label": "Allow filters to use",
                        "model-value": A.index ?? "none",
                        "onUpdate:modelValue": (h) => A.index = h,
                        appendTo: "self",
                        options: ce(A),
                        optionLabel: "label",
                        optionValue: "value"
                      }, null, 8, ["model-value", "onUpdate:modelValue", "options"])
                    ]),
                    s("section", Er, [
                      N[21] || (N[21] = s("h4", { class: "work-group-title" }, "History", -1)),
                      s("div", Ar, [
                        s("div", Pr, [
                          N[19] || (N[19] = s("div", { class: "work-row-main" }, [
                            s("strong", null, "Track changes"),
                            s("p", { class: "work-muted work-small" }, "Record each value change in the item history.")
                          ], -1)),
                          k(r(at), {
                            modelValue: A.track,
                            "onUpdate:modelValue": (h) => A.track = h,
                            "aria-label": "Track changes"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        s("div", Or, [
                          N[20] || (N[20] = s("div", { class: "work-row-main" }, [
                            s("strong", null, "Track intervals"),
                            s("p", { class: "work-muted work-small" }, "Measure how long each value stays in effect.")
                          ], -1)),
                          k(r(at), {
                            modelValue: A.intervals,
                            "onUpdate:modelValue": (h) => A.intervals = h,
                            "aria-label": "Track intervals"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ])
                      ])
                    ]),
                    !_(A) && re(A) ? (n(), H(Nt, {
                      key: 0,
                      label: "Field configuration",
                      "model-value": A.config,
                      shape: "object",
                      "onUpdate:modelValue": (h) => A.config = h,
                      onValidity: (h) => l("validity", "config-" + X, h)
                    }, null, 8, ["model-value", "onUpdate:modelValue", "onValidity"])) : I("", !0),
                    s("section", Rr, [
                      N[22] || (N[22] = s("h4", { class: "work-group-title" }, "Access", -1)),
                      (n(), b(te, null, ne(["read", "write"], (h) => k(Yo, {
                        "board-id": e.boardId,
                        key: h,
                        label: h === "read" ? "Who can read" : "Who can edit",
                        "model-value": A.access?.[h],
                        "onUpdate:modelValue": (P) => A.access = { ...A.access, [h]: P },
                        onValidity: (P) => l("validity", "access-" + X + h, P)
                      }, null, 8, ["board-id", "label", "model-value", "onUpdate:modelValue", "onValidity"])), 64))
                    ]),
                    k(r(ee), {
                      label: "Remove field",
                      severity: "danger",
                      text: "",
                      disabled: !!u.value,
                      onClick: (h) => g(A)
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
}), Mr = {
  class: "work-stack",
  "aria-label": "Item types editor"
}, Fr = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, Lr = { class: "work-definition-meta" }, Br = { class: "work-settings-grid" }, zr = { class: "work-stack work-tight" }, jr = { class: "work-stack work-tight" }, Wr = {
  key: 0,
  class: "work-stack work-tight"
}, qr = { key: 1 }, Gr = { class: "work-stack work-tight" }, Kr = { class: "work-stack" }, Hr = { class: "work-stack work-tight" }, Yr = {
  key: 0,
  class: "work-row work-wrap"
}, Xr = { class: "work-stack work-tight" }, Jr = {
  key: 1,
  class: "work-stack work-tight work-small"
}, Zr = {
  key: 0,
  class: "kx-empty"
}, Qr = /* @__PURE__ */ $e({
  __name: "TypesEditor",
  props: {
    draft: {},
    guardRemoval: { type: Function },
    issues: {}
  },
  emits: ["create-field", "create-workflow"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = K(() => t.draft.item_types ?? []), d = B(""), f = B(""), v = B("");
    function c(C) {
      const T = C.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, ""), x = /^[a-z]/.test(T) ? T : "type_" + (T || "new");
      let F = x.slice(0, 40), E = 2;
      for (; o.value.some((Q) => Q.id === F); ) {
        const Q = "_" + E++;
        F = x.slice(0, 40 - Q.length) + Q;
      }
      return F;
    }
    function i(C) {
      const T = c(C);
      (t.draft.item_types ??= []).push({ id: T, title: C, process: t.draft.processes?.[0]?.id ?? "", fields: [] }), d.value = T;
    }
    function u(C, T) {
      const x = C.id;
      C.id = T;
      for (const F of o.value) F.parent_types && (F.parent_types = F.parent_types.map((E) => E === x ? T : E));
    }
    function m(C, T) {
      C.fields = T, C.inherit && (C.inherit = C.inherit.filter((x) => T.includes(x)));
    }
    function V(C) {
      return (C.parent_types ?? []).filter((T) => typeof T == "string");
    }
    function p(C, T, x) {
      C.parent_types = x && T.length ? [...T, !1] : T;
    }
    function g(C) {
      return o.value.filter((T) => T.id !== C.id && T.parent_types?.includes(C.id)).map((T) => T.title || Fe(T.id));
    }
    async function y(C) {
      if (!v.value) {
        if (g(C).length) {
          f.value = `${C.title || Fe(C.id)} is a parent type for ${g(C).join(", ")}. Remove those parent selections first.`;
          return;
        }
        v.value = C.id, f.value = "";
        try {
          const T = await t.guardRemoval?.("item_types", C.id);
          T ? f.value = T : Pa(t.draft, "item_types", C.id);
        } finally {
          v.value = "";
        }
      }
    }
    return (C, T) => (n(), b("section", Mr, [
      f.value ? (n(), b("p", Fr, U(f.value), 1)) : I("", !0),
      k(nl, {
        columns: "types",
        count: o.value.length
      }, {
        default: q(() => [
          (n(!0), b(te, null, ne(o.value, (x, F) => (n(), H(il, {
            "route-section": "items",
            "route-id": x.id,
            "initial-open": d.value === x.id,
            title: x.title || r(Fe)(x.id),
            "kind-label": "Workflow",
            kind: e.draft.processes?.find((E) => E.id === x.process)?.name || r(Fe)(x.process),
            key: F,
            class: "work-type-card"
          }, {
            usage: q(() => [
              s("span", Lr, [
                k(r(lt), {
                  class: "kx-tag-sm",
                  severity: "secondary"
                }, {
                  default: q(() => [
                    z(U(x.fields.length) + " " + U(x.fields.length === 1 ? "field" : "fields"), 1)
                  ]),
                  _: 2
                }, 1024),
                g(x).length ? (n(), H(r(lt), {
                  key: 0,
                  class: "kx-tag-sm",
                  severity: "secondary"
                }, {
                  default: q(() => [
                    z("Parent of " + U(g(x).join(", ")), 1)
                  ]),
                  _: 2
                }, 1024)) : I("", !0)
              ])
            ]),
            default: q(() => [
              (n(!0), b(te, null, ne(e.issues?.filter((E) => E.code === "item_type " + x.id) ?? [], (E) => (n(), b("p", {
                key: E.what,
                class: "work-error work-small",
                role: "alert"
              }, U(r(ol)(E)), 1))), 128)),
              s("div", Br, [
                s("label", zr, [
                  T[0] || (T[0] = z("Title", -1)),
                  k(r(Te), {
                    modelValue: x.title,
                    "onUpdate:modelValue": (E) => x.title = E,
                    placeholder: r(Fe)(x.id)
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder"])
                ]),
                s("div", jr, [
                  e.draft.processes?.length ? (n(), b("label", Wr, [
                    T[1] || (T[1] = z(" Workflow ", -1)),
                    k(r(ue), {
                      modelValue: x.process,
                      "onUpdate:modelValue": (E) => x.process = E,
                      "aria-label": "Workflow",
                      required: "",
                      appendTo: "self",
                      optionLabel: "label",
                      optionValue: "value",
                      options: e.draft.processes.map((E) => ({ label: E.name || r(Fe)(E.id), value: E.id }))
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                  ])) : (n(), b("span", qr, "Workflow")),
                  s("div", null, [
                    k(r(ee), {
                      label: "Create a workflow",
                      type: "button",
                      text: "",
                      size: "small",
                      onClick: (E) => l("create-workflow", x, E)
                    }, null, 8, ["onClick"])
                  ])
                ])
              ]),
              s("div", Gr, [
                k(mt, {
                  label: "Fields",
                  options: (e.draft.fields ?? []).map((E) => ({ value: E.code, label: r(Je)(E) })),
                  "model-value": x.fields,
                  "onUpdate:modelValue": (E) => m(x, E)
                }, null, 8, ["options", "model-value", "onUpdate:modelValue"]),
                s("div", null, [
                  k(r(ee), {
                    label: "Create a field",
                    type: "button",
                    text: "",
                    size: "small",
                    onClick: (E) => l("create-field", x, E)
                  }, null, 8, ["onClick"])
                ])
              ]),
              k(Ne, {
                class: "work-disclosure",
                label: "Advanced item type settings"
              }, {
                default: q(() => [
                  s("div", Kr, [
                    s("label", Hr, [
                      T[2] || (T[2] = z("Identifier", -1)),
                      k(r(Te), {
                        value: x.id,
                        onChange: (E) => u(x, E.target.value),
                        required: "",
                        pattern: "[a-z][a-z0-9_]*"
                      }, null, 8, ["value", "onChange"])
                    ]),
                    T[6] || (T[6] = z()),
                    k(mt, {
                      label: "Parent types",
                      options: o.value.map((E) => ({ value: E.id, label: E.title || r(Fe)(E.id) })),
                      "model-value": V(x),
                      "onUpdate:modelValue": (E) => p(x, E, !!x.parent_types?.includes(!1))
                    }, null, 8, ["options", "model-value", "onUpdate:modelValue"]),
                    V(x).length ? (n(), b("label", Yr, [
                      k(r(at), {
                        "model-value": !!x.parent_types?.includes(!1),
                        "aria-label": "Allow top-level items",
                        "onUpdate:modelValue": (E) => p(x, V(x), E)
                      }, null, 8, ["model-value", "onUpdate:modelValue"]),
                      T[3] || (T[3] = z("Allow top-level items", -1))
                    ])) : I("", !0),
                    s("div", Xr, [
                      k(mt, {
                        label: "Inherit from parent",
                        options: x.fields.map((E) => ({ value: E, label: r(Je)(e.draft.fields?.find((Q) => Q.code === E) ?? { code: E }) })),
                        modelValue: x.inherit,
                        "onUpdate:modelValue": (E) => x.inherit = E
                      }, null, 8, ["options", "modelValue", "onUpdate:modelValue"]),
                      T[4] || (T[4] = s("p", { class: "work-muted work-small" }, "These fields resolve from the parent when this item has no own value.", -1))
                    ]),
                    V(x).length ? (n(), b("label", Jr, [
                      T[5] || (T[5] = z("When the parent moves", -1)),
                      k(r(ue), {
                        modelValue: x.move_children,
                        "onUpdate:modelValue": (E) => x.move_children = E,
                        "aria-label": "When the parent moves",
                        appendTo: "self",
                        optionLabel: "label",
                        optionValue: "value",
                        optionDisabled: "disabled",
                        options: [{ label: "Default", value: void 0, disabled: !1 }, { label: "Move children", value: "move", disabled: !1 }, { label: "Refuse while children exist", value: "refuse", disabled: !1 }]
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ])) : I("", !0),
                    k(r(ee), {
                      label: "Remove type",
                      severity: "danger",
                      text: "",
                      disabled: !!v.value,
                      onClick: (E) => y(x)
                    }, null, 8, ["disabled", "onClick"])
                  ])
                ]),
                _: 2
              }, 1024)
            ]),
            _: 2
          }, 1032, ["route-id", "initial-open", "title", "kind"]))), 128)),
          o.value.length ? I("", !0) : (n(), b("p", Zr, "Add a type for the work people create, such as a delivery task or customer request.")),
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
}), _r = ".work-process-canvas>svg{height:480px;width:100%}.work-process-canvas:focus-visible{outline:var(--p-focus-ring-width) var(--p-focus-ring-style) var(--p-focus-ring-color);outline-offset:var(--p-focus-ring-offset)}.work-state-card{fill:var(--p-content-background);stroke:var(--p-content-border-color);stroke-width:1.5}.work-graph-node.work-selected .work-state-card{stroke:var(--p-primary-color);stroke-width:2.5;fill:color-mix(in srgb,var(--p-primary-color) 6%,var(--p-content-background))}.work-graph-node:focus-visible .work-state-card{stroke:var(--p-focus-ring-color);stroke-width:var(--p-focus-ring-width)}.work-process-canvas .work-edge-label{font-size:12px;fill:var(--p-text-color)}.work-process-canvas .work-edge-label-bg{fill:var(--p-content-background);stroke:var(--p-content-border-color);stroke-width:1}.work-edge-line{stroke:var(--p-primary-color);stroke-width:1.5}.work-edge-return .work-edge-line{stroke:var(--p-text-muted-color);stroke-dasharray:5 4}.work-graph-arrow{fill:context-stroke}.work-lane-line{fill:none;stroke:var(--p-text-muted-color);stroke-width:1.5;stroke-dasharray:2 4}.work-node-connector{fill:var(--p-content-background);stroke:var(--p-primary-color);stroke-width:1.5}.work-node-connector:hover,.work-node-connector:focus-visible,.work-node-connector[aria-pressed=true]{fill:var(--p-primary-color)}.work-any-transition:focus-visible text,.work-any-transition[aria-pressed=true] text{fill:var(--p-primary-color);text-decoration:underline}.work-process-legend{position:static;flex-wrap:wrap;padding:10px 16px;border-top:1px solid var(--p-content-border-color);background:var(--p-content-background)}@media(max-width:700px){.work-process-canvas>svg{height:420px}}.work-process-more{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:8px;padding:8px 16px;border-top:1px solid var(--p-content-border-color);background:var(--p-content-background);color:var(--p-text-muted-color);font-size:12px}.work-process-canvas .work-graph-edge.work-selected .work-edge-label-bg{fill:var(--p-primary-color);stroke:var(--p-primary-color)}.work-process-canvas .work-graph-edge.work-selected .work-edge-label{fill:var(--p-primary-contrast-color)}", So = /* @__PURE__ */ new WeakSet();
function ed(e) {
  const a = e.getRootNode();
  if (a instanceof ShadowRoot && !So.has(a)) {
    const t = e.ownerDocument.createElement("style");
    t.textContent = _r, a.append(t), So.add(a);
  }
}
const ui = 0.8;
function td(e, a, t) {
  const l = Math.min(1, a.width / e.width, a.height / e.height);
  if (l >= ui) return { zoom: l, pan: { x: (e.width - a.width / l) / 2, y: (e.height - a.height / l) / 2 } };
  const o = e.nodes.find((f) => f.state.id === t) ?? e.nodes[0], d = Math.min(1, a.width / ((o?.width ?? 190) + 64));
  return { zoom: d, pan: o ? { x: e.direction === "TB" ? o.x - a.width / d / 2 : o.x - o.width / 2 - 32, y: e.direction === "TB" ? o.y - o.height / 2 - 32 : o.y - a.height / d / 2 } : { x: 0, y: 0 } };
}
const ad = ["onKeydown"], ld = {
  key: 0,
  class: "work-process-instruction",
  role: "status"
}, od = ["viewBox"], id = ["id"], nd = ["d", "marker-end"], sd = ["aria-label", "aria-pressed", "aria-keyshortcuts", "onKeydown", "onFocus", "onClick"], rd = ["d"], dd = ["d", "marker-end"], ud = ["x", "y", "width", "height"], cd = ["x", "y"], vd = ["x", "dy"], fd = ["aria-label", "aria-pressed", "onClick", "onKeydown", "onFocus", "onPointerup"], md = ["x", "y", "width", "height"], pd = ["cx", "cy"], bd = ["x", "y"], hd = ["x", "dy"], gd = ["x", "y"], kd = ["x", "dy"], yd = {
  key: 0,
  class: "work-limit-text"
}, wd = ["aria-label", "aria-pressed", "aria-keyshortcuts", "onFocus", "onKeydown", "onClick"], Vd = ["x", "y"], $d = ["x", "dy"], xd = ["cx", "cy", "aria-label", "aria-pressed", "onFocus", "onPointerdown", "onClick", "onKeydown"], Cd = ["d"], Sd = {
  key: 1,
  class: "work-process-more",
  role: "status"
}, Td = { class: "work-process-legend" }, Id = /* @__PURE__ */ $e({
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
    const l = e, o = t, d = Ht().replace(/:/g, "_"), f = B(""), v = B(), c = B();
    let i;
    const u = B(900), m = B(!1), V = K(() => u.value < 700 ? 420 : 480), p = K(() => an(l.process, l.draft, {
      width: u.value,
      height: V.value,
      direction: l.fitOnOpen ? "TB" : void 0
    })), g = B(1), y = B({ x: 0, y: 0 }), C = B({ x: 0, y: 0 }), T = K(() => {
      const $ = Math.min(1, u.value / p.value.width);
      return l.fitOnOpen ? Math.max(ui, $) : $;
    }), x = K(() => ({
      width: u.value,
      height: m.value ? Math.max(V.value, Math.ceil(p.value.height * T.value)) : V.value
    })), F = K(() => p.value.nodes.filter(($) => $.x - $.width / 2 >= y.value.x && $.x + $.width / 2 <= y.value.x + x.value.width / g.value && $.y - $.height / 2 >= y.value.y && $.y + $.height / 2 <= y.value.y + x.value.height / g.value).length);
    function E() {
      m.value = !1;
      const $ = td(p.value, x.value, l.process.initial);
      g.value = $.zoom, y.value = $.pan;
    }
    const Q = K(() => `${y.value.x} ${y.value.y} ${x.value.width / g.value} ${x.value.height / g.value}`), G = K(() => p.value.nodes.find(($) => $.state.id === f.value));
    function _() {
      m.value = !0, g.value = T.value;
      const $ = x.value.width / g.value, D = p.value.nodes.find((w) => w.state.id === l.process.initial);
      y.value = {
        x: p.value.width > $ && D ? D.x - $ / 2 : (p.value.width - $) / 2,
        y: 0
      };
    }
    function re($) {
      l.fitOnOpen && (m.value = !1);
      const D = Math.max(0.02, Math.min(3, g.value * $)), w = 1 / g.value - 1 / D;
      y.value = { x: y.value.x + x.value.width * w / 2, y: y.value.y + x.value.height * w / 2 }, g.value = D;
    }
    function ce($) {
      const D = x.value.width / g.value, w = x.value.height / g.value;
      ($.x - $.width / 2 < y.value.x || $.x + $.width / 2 > y.value.x + D || $.y - $.height / 2 < y.value.y || $.y + $.height / 2 > y.value.y + w) && (y.value = { x: $.x - D / 2, y: $.y - w / 2 });
    }
    function fe() {
      const $ = p.value.nodes.find((D) => D.state === l.selectedState) ?? p.value.edges.find((D) => D.transition === l.selectedTransition);
      if (!$) {
        l.fitOnOpen && m.value && _();
        return;
      }
      ce($);
    }
    Se([p, () => l.selectedState, () => l.selectedTransition], fe, { flush: "post" });
    function se() {
      l.fitOnOpen ? _() : E();
    }
    Se(() => l.process.id, () => {
      S(), se();
    }, { flush: "post" });
    function oe($) {
      if ($.target !== v.value) return;
      ($.key === "+" || $.key === "=") && ($.preventDefault(), re(1.2)), $.key === "-" && ($.preventDefault(), re(1 / 1.2)), $.key === "0" && ($.preventDefault(), _());
      const D = 60 / g.value;
      $.key.startsWith("Arrow") && ($.preventDefault(), y.value = { x: y.value.x + ($.key === "ArrowRight" ? D : $.key === "ArrowLeft" ? -D : 0), y: y.value.y + ($.key === "ArrowDown" ? D : $.key === "ArrowUp" ? -D : 0) });
    }
    function O($, D) {
      const w = D.currentTarget;
      if (!f.value) o("state", $, w);
      else if (f.value !== $.id) {
        const W = f.value;
        f.value = "", o("connect", W, $.id, w);
      }
    }
    function ae($) {
      f.value = $.state.id, C.value = { x: p.value.direction === "TB" ? $.x : $.x + $.width / 2, y: p.value.direction === "TB" ? $.y + $.height / 2 : $.y };
    }
    function L($, D) {
      if ($.pointerType === "touch" || $.button !== 0) return;
      i = $.pointerId, ae(D);
      const w = $.currentTarget;
      w.hasPointerCapture?.($.pointerId) && w.releasePointerCapture($.pointerId);
    }
    function ve($, D) {
      i === $.pointerId && (i = void 0, !(!f.value || f.value === D.id) && O(D, $));
    }
    function Y($, D) {
      if (($.key === "Enter" || $.key === " ") && ($.preventDefault(), O(D, $)), ["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp"].includes($.key)) {
        $.preventDefault();
        const w = Array.from(c.value?.querySelectorAll(".work-graph-node") ?? []), W = p.value.nodes.findIndex((me) => me.state === D), he = ["ArrowRight", "ArrowDown"].includes($.key) ? 1 : -1;
        w[(W + he + w.length) % w.length]?.focus();
      }
    }
    function M($, D) {
      l.selectedTransition === D && o("removeTransition", $);
    }
    function S() {
      f.value = "", i = void 0, A.clear(), X = 0;
    }
    function N() {
      S(), o("clear");
    }
    const A = /* @__PURE__ */ new Map();
    let X = 0;
    function h($) {
      if (!$.target.closest('[role="button"]') && (A.set($.pointerId, { x: $.clientX, y: $.clientY }), v.value?.setPointerCapture?.($.pointerId), A.size === 2)) {
        const [D, w] = [...A.values()];
        X = Math.hypot(D.x - w.x, D.y - w.y);
      }
    }
    function P($) {
      const D = c.value?.getBoundingClientRect();
      if (!D?.width) return;
      if (i === $.pointerId && f.value) {
        C.value = { x: y.value.x + ($.clientX - D.left) * x.value.width / g.value / D.width, y: y.value.y + ($.clientY - D.top) * x.value.height / g.value / D.height };
        return;
      }
      const w = A.get($.pointerId);
      if (w)
        if (A.set($.pointerId, { x: $.clientX, y: $.clientY }), A.size === 2) {
          const [W, he] = [...A.values()], me = Math.hypot(W.x - he.x, W.y - he.y);
          X && re(me / X), X = me;
        } else y.value = { x: y.value.x - ($.clientX - w.x) * x.value.width / g.value / D.width, y: y.value.y - ($.clientY - w.y) * x.value.height / g.value / D.height };
    }
    function ie($) {
      i === $.pointerId && (f.value = "", i = void 0);
    }
    function J($) {
      A.delete($.pointerId), X = 0, ie($);
    }
    function ye($) {
      $.ctrlKey && ($.preventDefault(), re(Math.exp(-$.deltaY * 0.01)));
    }
    let Ve;
    Aa(() => {
      if (v.value && ed(v.value), typeof ResizeObserver < "u" && c.value) {
        let $ = !0;
        Ve = new ResizeObserver(() => {
          const D = c.value?.getBoundingClientRect();
          if (!D?.width || !D.height) return;
          const w = x.value.width;
          u.value = D.width, ($ || Math.abs(D.width - w) > 1) && ($ ? se() : m.value ? _() : E(), $ = !1), fe();
        }), Ve.observe(c.value);
      }
    }), St(() => Ve?.disconnect()), a({ fit: _, focus: () => v.value?.focus(), zoomIn: () => re(1.2), zoomOut: () => re(1 / 1.2) });
    function Ae($) {
      return $.category === "completed" ? "check" : $.category === "canceled" ? "x" : $.id === l.process.initial ? "arrow-bar-to-right" : { gate: "shield-check", automated: "bolt", parallel: "arrows-split" }[$.kind ?? ""] ?? "user";
    }
    return ($, D) => (n(), b("section", {
      ref_key: "canvas",
      ref: v,
      class: ft(["work-process-canvas", { "work-process-scrollable": e.fitOnOpen && m.value }]),
      "aria-label": "Process map",
      tabindex: "0",
      onKeydown: [
        oe,
        Ge(Re(N, ["stop"]), ["esc"])
      ],
      onPointerdown: h,
      onPointermove: P,
      onPointerup: J,
      onPointerleave: ie,
      onPointercancel: S,
      onWheel: ye
    }, [
      f.value ? (n(), b("p", ld, "Choose the next stop. Escape cancels.")) : I("", !0),
      (n(), b("svg", {
        ref_key: "svg",
        ref: c,
        style: Di({ height: x.value.height + "px" }),
        viewBox: Q.value,
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
          ])], 8, id)
        ]),
        (n(!0), b(te, null, ne(p.value.parallels, (w) => (n(), b("path", {
          key: w.key,
          d: w.path,
          class: "work-lane-line",
          "marker-end": `url(#${r(d)}-arrow)`
        }, [
          s("title", null, "Parallel lane from " + U(r(we)(w.state)), 1)
        ], 8, nd))), 128)),
        (n(!0), b(te, null, ne(p.value.edges, (w) => (n(), b("g", {
          key: w.key,
          class: ft(["work-graph-edge", ["work-edge-" + w.type, { "work-selected": e.selectedTransition === w.transition }]]),
          role: "button",
          tabindex: "0",
          "aria-label": "Edit transition " + r(Ke)(w.transition),
          "aria-pressed": e.selectedTransition === w.transition,
          "aria-keyshortcuts": e.selectedTransition === w.transition ? "Delete Backspace" : void 0,
          onKeydown: [
            Ge((W) => M(W, w.transition), ["delete"]),
            Ge((W) => M(W, w.transition), ["backspace"]),
            Ge(Re((W) => o("transition", w.transition, W.currentTarget), ["prevent"]), ["enter"]),
            Ge(Re((W) => o("transition", w.transition, W.currentTarget), ["prevent"]), ["space"])
          ],
          onFocus: (W) => ce(w),
          onClick: (W) => o("transition", w.transition, W.currentTarget)
        }, [
          s("path", {
            d: w.path,
            class: "work-edge-hit"
          }, null, 8, rd),
          s("path", {
            d: w.path,
            class: "work-edge-line",
            "marker-end": `url(#${r(d)}-arrow)`
          }, null, 8, dd),
          s("rect", {
            x: w.x - w.width / 2,
            y: w.y - w.height / 2,
            width: w.width,
            height: w.height,
            rx: "6",
            class: "work-edge-label-bg"
          }, null, 8, ud),
          s("text", {
            x: w.x,
            y: w.y - (w.lines.length - 1) * 8 + 4,
            class: "work-edge-label",
            "text-anchor": "middle"
          }, [
            (n(!0), b(te, null, ne(w.lines, (W, he) => (n(), b("tspan", {
              key: he,
              x: w.x,
              dy: he ? 16 : 0
            }, U(W), 9, vd))), 128))
          ], 8, cd)
        ], 42, sd))), 128)),
        (n(!0), b(te, null, ne(p.value.nodes, (w) => (n(), b("g", {
          key: w.state.id,
          class: ft(["work-graph-node", ["work-stop-" + w.state.category, { "work-selected": e.selectedState === w.state }]]),
          role: "button",
          tabindex: "0",
          "aria-label": "Edit state " + r(we)(w.state),
          "aria-pressed": e.selectedState === w.state,
          onClick: (W) => O(w.state, W),
          onKeydown: (W) => Y(W, w.state),
          onFocus: (W) => ce(w),
          onPointerup: (W) => ve(W, w.state)
        }, [
          s("rect", {
            x: w.x - w.width / 2,
            y: w.y - w.height / 2,
            width: w.width,
            height: w.height,
            rx: "10",
            class: "work-state-card"
          }, null, 8, md),
          s("circle", {
            cx: w.x - w.width / 2 + 22,
            cy: w.y - w.height / 2 + 25,
            r: "10",
            class: "work-stop-ring"
          }, null, 8, pd),
          k(r(de), {
            icon: "tabler:" + Ae(w.state),
            x: w.x - w.width / 2 + 15,
            y: w.y - w.height / 2 + 18,
            width: "14",
            height: "14",
            class: "work-stop-icon",
            "aria-hidden": "true"
          }, null, 8, ["icon", "x", "y"]),
          s("text", {
            x: w.x - w.width / 2 + 42,
            y: w.y - w.height / 2 + 29,
            class: "work-node-name"
          }, [
            (n(!0), b(te, null, ne(w.title, (W, he) => (n(), b("tspan", {
              key: he,
              x: w.x - w.width / 2 + 42,
              dy: he ? 18 : 0
            }, U(W), 9, hd))), 128))
          ], 8, bd),
          s("text", {
            x: w.x - w.width / 2 + 16,
            y: w.y - w.height / 2 + 33 + w.title.length * 18,
            class: "work-node-meta"
          }, [
            (n(!0), b(te, null, ne(w.caption, (W, he) => (n(), b("tspan", {
              key: he,
              x: w.x - w.width / 2 + 16,
              dy: he ? 16 : 0
            }, U(W), 9, kd))), 128)),
            e.draft.policy?.wip?.[w.state.id] ? (n(), b("tspan", yd, " · limit " + U(e.draft.policy.wip[w.state.id].limit), 1)) : I("", !0)
          ], 8, gd),
          (n(!0), b(te, null, ne(w.badges, (W, he) => (n(), b("g", {
            key: W.id,
            class: "work-any-transition",
            role: "button",
            tabindex: "0",
            "aria-label": "Edit transition " + r(Ke)(W),
            "aria-pressed": e.selectedTransition === W,
            "aria-keyshortcuts": e.selectedTransition === W ? "Delete Backspace" : void 0,
            onFocus: (me) => ce(w),
            onKeydown: [
              Ge((me) => M(me, W), ["delete"]),
              Ge((me) => M(me, W), ["backspace"]),
              Ge(Re((me) => o("transition", W, me.currentTarget), ["stop", "prevent"]), ["enter"]),
              Ge(Re((me) => o("transition", W, me.currentTarget), ["stop", "prevent"]), ["space"])
            ],
            onClick: Re((me) => o("transition", W, me.currentTarget), ["stop"])
          }, [
            s("text", {
              x: w.x - w.width / 2 + 16,
              y: w.y - w.height / 2 + 33 + w.title.length * 18 + w.caption.length * 16 + w.badges.slice(0, he).reduce((me, De) => me + r(na)(r(Ke)(De) + " works from any state").length * 18, 0),
              class: "work-node-meta"
            }, [
              (n(!0), b(te, null, ne(r(na)(r(Ke)(W) + " works from any state"), (me, De) => (n(), b("tspan", {
                key: De,
                x: w.x - w.width / 2 + 16,
                dy: De ? 18 : 0
              }, U(me), 9, $d))), 128))
            ], 8, Vd)
          ], 40, wd))), 128)),
          ["completed", "canceled"].includes(w.state.category) ? I("", !0) : (n(), b("circle", {
            key: 0,
            cx: p.value.direction === "TB" ? w.x : w.x + w.width / 2,
            cy: p.value.direction === "TB" ? w.y + w.height / 2 : w.y,
            r: "9",
            class: "work-node-connector",
            role: "button",
            tabindex: "0",
            "aria-label": "Connect from " + r(we)(w.state),
            "aria-pressed": f.value === w.state.id,
            onFocus: (W) => ce(w),
            onPointerdown: Re((W) => L(W, w), ["stop"]),
            onClick: Re((W) => ae(w), ["stop"]),
            onKeydown: [
              Ge(Re((W) => ae(w), ["stop", "prevent"]), ["enter"]),
              Ge(Re((W) => ae(w), ["stop", "prevent"]), ["space"])
            ]
          }, null, 40, xd))
        ], 42, fd))), 128)),
        G.value ? (n(), b("path", {
          key: 0,
          d: `M ${p.value.direction === "TB" ? G.value.x : G.value.x + G.value.width / 2} ${p.value.direction === "TB" ? G.value.y + G.value.height / 2 : G.value.y} L ${C.value.x} ${C.value.y}`,
          class: "work-connect-ghost"
        }, null, 8, Cd)) : I("", !0)
      ], 12, od)),
      F.value < e.process.states.length ? (n(), b("div", Sd, [
        s("span", null, U(F.value) + " of " + U(e.process.states.length) + " states in view · Pan to see more", 1),
        m.value ? I("", !0) : (n(), H(r(ee), {
          key: 0,
          label: "Fit map",
          size: "small",
          text: "",
          onClick: D[0] || (D[0] = (w) => _())
        }))
      ])) : I("", !0),
      s("div", Td, [
        s("span", null, U(e.process.states.length) + " states · " + U(Math.round(g.value * 100)) + "%", 1),
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
    ], 42, ad));
  }
}), Dd = {
  class: "work-process-list work-stack",
  "aria-label": "Process list"
}, Ud = { class: "work-table-scroll" }, Ed = {
  class: "work-settings-table work-process-table",
  role: "table",
  "aria-label": "States"
}, Ad = { role: "rowgroup" }, Pd = ["aria-selected"], Od = { role: "cell" }, Rd = {
  key: 0,
  class: "work-muted work-small"
}, Nd = { role: "cell" }, Md = { role: "cell" }, Fd = {
  role: "cell",
  class: "work-process-list-actions"
}, Ld = { class: "work-table-scroll" }, Bd = {
  class: "work-settings-table work-process-table",
  role: "table",
  "aria-label": "Transitions"
}, zd = { role: "rowgroup" }, jd = ["aria-selected"], Wd = { role: "cell" }, qd = {
  key: 0,
  class: "work-muted"
}, Gd = { role: "cell" }, Kd = { role: "cell" }, Hd = {
  role: "cell",
  class: "work-process-list-actions"
}, Yd = /* @__PURE__ */ $e({
  __name: "ProcessList",
  props: {
    process: {},
    selectedState: {},
    selectedTransition: {},
    counts: {}
  },
  emits: ["state", "transition", "removeState", "removeTransition"],
  setup(e) {
    return (a, t) => (n(), b("section", Dd, [
      t[6] || (t[6] = s("h3", null, "States", -1)),
      s("div", Ud, [
        s("table", Ed, [
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
          s("tbody", Ad, [
            (n(!0), b(te, null, ne(e.process.states, (l) => (n(), b("tr", {
              key: l.id,
              "aria-selected": e.selectedState === l,
              role: "row"
            }, [
              s("td", Od, [
                k(r(Te), {
                  modelValue: l.name,
                  "onUpdate:modelValue": (o) => l.name = o,
                  "aria-label": "Name of " + r(we)(l)
                }, null, 8, ["modelValue", "onUpdate:modelValue", "aria-label"]),
                e.counts ? (n(), b("p", Rd, U(e.counts[l.id] ?? 0) + " here", 1)) : I("", !0)
              ]),
              s("td", Nd, [
                t[0] || (t[0] = s("span", {
                  class: "work-process-cell-label",
                  "aria-hidden": "true"
                }, "Phase", -1)),
                z(U(r(Yt)(l.category)), 1)
              ]),
              s("td", Md, [
                t[1] || (t[1] = s("span", {
                  class: "work-process-cell-label",
                  "aria-hidden": "true"
                }, "Kind", -1)),
                k(r(lt), { severity: "secondary" }, {
                  default: q(() => [
                    z(U(r(Qa)(l.kind)), 1)
                  ]),
                  _: 2
                }, 1024)
              ]),
              s("td", Fd, [
                k(r(ee), {
                  size: "small",
                  text: "",
                  severity: "secondary",
                  "aria-label": "Edit state " + r(we)(l),
                  onClick: (o) => a.$emit("state", l, o.currentTarget)
                }, {
                  default: q(() => [
                    k(r(de), { icon: "tabler:pencil" })
                  ]),
                  _: 1
                }, 8, ["aria-label", "onClick"]),
                k(r(ee), {
                  size: "small",
                  text: "",
                  severity: "danger",
                  "aria-label": "Remove state " + r(we)(l),
                  onClick: (o) => a.$emit("removeState", l)
                }, {
                  default: q(() => [
                    k(r(de), { icon: "tabler:trash" })
                  ]),
                  _: 1
                }, 8, ["aria-label", "onClick"])
              ])
            ], 8, Pd))), 128))
          ])
        ])
      ]),
      t[7] || (t[7] = s("h3", null, "Transitions", -1)),
      s("div", Ld, [
        s("table", Bd, [
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
          s("tbody", zd, [
            (n(!0), b(te, null, ne(e.process.transitions ?? [], (l) => (n(), b("tr", {
              key: l.id,
              "aria-selected": e.selectedTransition === l,
              role: "row"
            }, [
              s("td", Wd, [
                k(r(Te), {
                  modelValue: l.name,
                  "onUpdate:modelValue": (o) => l.name = o,
                  placeholder: r(Ke)(l),
                  "aria-label": "Name of " + r(Ke)(l)
                }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder", "aria-label"]),
                l.when || l.require?.length || l.guards?.length ? (n(), b("p", qd, "Has requirements")) : I("", !0)
              ]),
              s("td", Gd, [
                t[3] || (t[3] = s("span", {
                  class: "work-process-cell-label",
                  "aria-hidden": "true"
                }, "From", -1)),
                z(" " + U(l.from === "any" ? "Any state" : l.from.map((o) => r(we)(e.process.states.find((d) => d.id === o))).join(", ")), 1)
              ]),
              s("td", Kd, [
                t[4] || (t[4] = s("span", {
                  class: "work-process-cell-label",
                  "aria-hidden": "true"
                }, "To", -1)),
                z(U(r(we)(e.process.states.find((o) => o.id === l.to))), 1)
              ]),
              s("td", Hd, [
                k(r(ee), {
                  size: "small",
                  text: "",
                  severity: "secondary",
                  "aria-label": "Edit transition " + r(Ke)(l),
                  onClick: (o) => a.$emit("transition", l, o.currentTarget)
                }, {
                  default: q(() => [
                    k(r(de), { icon: "tabler:pencil" })
                  ]),
                  _: 1
                }, 8, ["aria-label", "onClick"]),
                k(r(ee), {
                  size: "small",
                  text: "",
                  severity: "danger",
                  "aria-label": "Remove transition " + r(Ke)(l),
                  onClick: (o) => a.$emit("removeTransition", l)
                }, {
                  default: q(() => [
                    k(r(de), { icon: "tabler:trash" })
                  ]),
                  _: 1
                }, 8, ["aria-label", "onClick"])
              ])
            ], 8, jd))), 128))
          ])
        ])
      ])
    ]));
  }
}), Xd = { class: "work-stack work-transition-settings" }, Jd = { class: "work-stack work-tight" }, Zd = { class: "work-row" }, Qd = { key: 0 }, _d = { class: "work-stack" }, eu = { class: "work-row" }, tu = { class: "work-row" }, au = { class: "work-stack work-tight" }, lu = { class: "work-row" }, ou = { class: "work-stack work-tight" }, iu = { class: "work-stack work-tight" }, nu = /* @__PURE__ */ $e({
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
    function d(f, v) {
      const c = t.transition.set?.[f];
      !c || !t.transition.set || (t.transition.set[f] = { field: c.field, ...v === "clear" ? { clear: !0 } : v === "copy" ? { copy: "" } : { value: "" } });
    }
    return (f, v) => (n(), b("div", Xd, [
      s("label", Jd, [
        v[15] || (v[15] = z("To state", -1)),
        k(r(ue), {
          modelValue: e.transition.to,
          "onUpdate:modelValue": v[0] || (v[0] = (c) => e.transition.to = c),
          "aria-label": "To state",
          appendTo: "self",
          optionLabel: "label",
          optionValue: "value",
          options: e.process.states.map((c) => ({ label: r(we)(c), value: c.id }))
        }, null, 8, ["modelValue", "options"])
      ]),
      s("label", Zd, [
        v[16] || (v[16] = s("span", { class: "work-spacer" }, "Works from any state", -1)),
        k(r(at), {
          "model-value": e.transition.from === "any",
          "aria-label": "Works from any state",
          "onUpdate:modelValue": v[1] || (v[1] = (c) => e.transition.from = c ? "any" : [])
        }, null, 8, ["model-value"])
      ]),
      e.transition.from !== "any" ? (n(), H(mt, {
        key: 0,
        label: "From states",
        options: e.process.states.map((c) => ({ value: c.id, label: r(we)(c) })),
        modelValue: e.transition.from,
        "onUpdate:modelValue": v[2] || (v[2] = (c) => e.transition.from = c)
      }, null, 8, ["options", "modelValue"])) : I("", !0),
      v[24] || (v[24] = s("h4", { class: "work-process-group" }, "Must be filled", -1)),
      k(mt, {
        label: "Required fields",
        options: e.draft.fields?.map((c) => ({ value: c.code, label: c.title || c.code })) ?? [],
        modelValue: e.transition.require,
        "onUpdate:modelValue": v[3] || (v[3] = (c) => e.transition.require = c)
      }, null, 8, ["options", "modelValue"]),
      v[25] || (v[25] = s("h4", { class: "work-process-group" }, "Only when", -1)),
      k(Yl, {
        label: "Allow this transition when",
        draft: e.draft,
        "board-id": e.boardId,
        "model-value": e.transition.when,
        "onUpdate:modelValue": v[4] || (v[4] = (c) => e.transition.when = c),
        onValidity: v[5] || (v[5] = (c) => l("validity", "when", c))
      }, null, 8, ["draft", "board-id", "model-value"]),
      e.guards?.length || e.transition.guards?.length ? (n(), H(mt, {
        key: 1,
        label: "Installed checks",
        options: [...(e.guards ?? []).map((c) => ({ value: c.id, label: c.title })), ...(e.transition.guards ?? []).filter((c) => !e.guards?.some((i) => i.id === c)).map((c) => ({ value: c, label: e.guards ? "Unavailable check" : "Configured check" }))],
        modelValue: e.transition.guards,
        "onUpdate:modelValue": v[6] || (v[6] = (c) => e.transition.guards = c)
      }, null, 8, ["options", "modelValue"])) : I("", !0),
      (n(!0), b(te, null, ne(e.guards?.filter((c) => e.transition.guards?.includes(c.id)) ?? [], (c) => (n(), b("p", {
        key: c.id,
        class: "work-muted work-small"
      }, [
        z(U(c.description || c.title + " can stop this transition.") + " ", 1),
        c.reads?.length ? (n(), b("span", Qd, " Checks " + U(c.reads.map((i) => e.draft.fields?.find((u) => u.code === i)?.title || "a configured field").join(", ")) + ".", 1)) : I("", !0)
      ]))), 128)),
      k(Ne, {
        class: "work-disclosure",
        label: "Advanced transition settings"
      }, {
        default: q(() => [
          s("div", _d, [
            s("label", eu, [
              v[17] || (v[17] = s("span", { class: "work-spacer" }, "Happens automatically", -1)),
              k(r(at), {
                "model-value": e.transition.auto,
                "onUpdate:modelValue": v[7] || (v[7] = (c) => {
                  e.transition.auto = c, c || delete e.transition.default;
                }),
                "aria-label": "Automatic transition"
              }, null, 8, ["model-value"])
            ]),
            s("label", tu, [
              v[18] || (v[18] = s("span", { class: "work-spacer" }, "Default automatic transition", -1)),
              k(r(at), {
                modelValue: e.transition.default,
                "onUpdate:modelValue": v[8] || (v[8] = (c) => e.transition.default = c),
                disabled: !e.transition.auto,
                "aria-label": "Default transition"
              }, null, 8, ["modelValue", "disabled"])
            ]),
            v[23] || (v[23] = s("h4", { class: "work-process-group" }, "Also sets", -1)),
            (n(!0), b(te, null, ne(e.transition.set ?? [], (c, i) => (n(), b("div", {
              key: i,
              class: "work-process-value work-stack work-tight"
            }, [
              s("label", au, [
                v[19] || (v[19] = z("Field", -1)),
                k(r(ue), {
                  modelValue: c.field,
                  "onUpdate:modelValue": (u) => c.field = u,
                  appendTo: "self",
                  optionLabel: "label",
                  optionValue: "value",
                  options: e.draft.fields?.map((u) => ({ value: u.code, label: u.title || u.code })) ?? []
                }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
              ]),
              s("div", lu, [
                k(r(ue), {
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
                    k(r(de), { icon: "tabler:trash" })
                  ]),
                  _: 1
                }, 8, ["aria-label", "onClick"])
              ]),
              c.copy !== void 0 ? (n(), H(r(ue), {
                key: 0,
                modelValue: c.copy,
                "onUpdate:modelValue": (u) => c.copy = u,
                "aria-label": "Copy from field",
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                options: e.draft.fields?.map((u) => ({ value: u.code, label: u.title || u.code })) ?? []
              }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])) : c.clear ? I("", !0) : (n(!0), b(te, { key: 1 }, ne(e.draft.fields?.filter((u) => u.code === c.field) ?? [], (u) => (n(), H(Ho, {
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
                k(r(de), { icon: "tabler:plus" })
              ]),
              _: 1
            }),
            s("label", ou, [
              v[20] || (v[20] = z("Offer to people", -1)),
              k(r(ue), {
                "model-value": e.transition.people,
                "aria-label": "Offer to people",
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                options: [{ label: "Work default", value: void 0 }, { label: "Offer explicitly", value: !0 }, { label: "Process engine only", value: !1 }],
                "onUpdate:modelValue": v[9] || (v[9] = (c) => e.transition.people = c)
              }, null, 8, ["model-value"]),
              v[21] || (v[21] = s("span", { class: "work-muted work-small" }, "Work default can hide a stage route from the list while still allowing it by name. Process engine only reserves the route for the engine and board administrators using force.", -1))
            ]),
            s("label", iu, [
              v[22] || (v[22] = z("Evaluation order", -1)),
              k(r($t), {
                "model-value": e.transition.order ?? null,
                "aria-label": "Transition order",
                min: 0,
                useGrouping: !1,
                "onUpdate:modelValue": v[10] || (v[10] = (c) => e.transition.order = c ?? void 0)
              }, null, 8, ["model-value"])
            ]),
            k(Nt, {
              label: "Set values",
              "model-value": e.transition.set,
              shape: "array",
              "onUpdate:modelValue": v[11] || (v[11] = (c) => e.transition.set = c),
              onValidity: v[12] || (v[12] = (c) => l("validity", "set", c))
            }, null, 8, ["model-value"]),
            k(Nt, {
              label: "Guards",
              "model-value": e.transition.guards,
              shape: "array",
              "onUpdate:modelValue": v[13] || (v[13] = (c) => e.transition.guards = c),
              onValidity: v[14] || (v[14] = (c) => l("validity", "guards", c))
            }, null, 8, ["model-value"])
          ])
        ]),
        _: 1
      })
    ]));
  }
}), To = /* @__PURE__ */ $e({
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
      const f = a.draft.policy ??= {}, v = f.wip ??= {};
      v[a.state] = { ...v[a.state], limit: d };
    }
    function o(d) {
      t.value && (t.value.hard = d);
    }
    return (d, f) => e.hard ? (n(), H(r(at), {
      key: 0,
      "aria-label": e.label,
      disabled: !t.value,
      "model-value": t.value?.hard ?? !1,
      "onUpdate:modelValue": o
    }, null, 8, ["aria-label", "disabled", "model-value"])) : (n(), H(r($t), {
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
async function El(e, a) {
  try {
    const { data: t } = await Ol.get(e, a ? { params: a } : void 0);
    if (!t?.success) {
      const l = t?.message || (typeof t?.error == "string" ? t.error : t?.error?.message) || "Could not read published Flow.";
      throw new Al({ message: l, details: t?.details }, "Published Flow");
    }
    return t;
  } catch (t) {
    throw Fi(t, "Published Flow");
  }
}
const Io = (e) => `/api/v1/workflows/${encodeURIComponent(e)}/versions`, Bl = {
  title: async (e) => (await El("/api/v1/workflows/published", { id: e })).item?.title,
  versions: async (e) => (await El(Io(e))).versions ?? [],
  check: async (e) => {
    if ((await El(`${Io(e.id)}/${e.version}`)).version?.version !== e.version) throw new Error("The published version is unavailable.");
  }
}, su = {
  class: "work-stack work-tight",
  "aria-label": "Stage Flow"
}, ru = {
  key: 0,
  class: "work-muted work-small"
}, du = {
  key: 1,
  class: "kx-err work-alert-actions"
}, uu = { role: "alert" }, cu = ["schema", "config", "title"], vu = {
  key: 3,
  class: "kx-err",
  role: "alert"
}, fu = {
  key: 4,
  class: "work-stack work-tight"
}, mu = ["value", "aria-busy", "disabled"], pu = {
  value: "",
  disabled: ""
}, bu = ["value"], hu = {
  key: 5,
  class: "work-muted work-small",
  role: "status"
}, gu = /* @__PURE__ */ $e({
  __name: "StageFlow",
  props: {
    modelValue: {}
  },
  emits: ["update:modelValue", "validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = B(!1), d = B(""), f = B([]), v = B(!1), c = B(""), i = B(!1), u = K(() => d.value || t.modelValue?.id), m = JSON.stringify({ properties: { flow_ref: { title: "Published Flow", picker: "wc-workflow-picker" } } }), V = K(() => JSON.stringify(t.modelValue ? { flow_ref: t.modelValue } : {}));
    let p = 0;
    async function g() {
      o.value = await Rt("wc-workflow-picker");
    }
    g();
    async function y() {
      const F = ++p, E = u.value, Q = t.modelValue;
      if (v.value = !!E, c.value = "", f.value = [], !!E)
        try {
          const [G] = await Promise.all([Bl.versions(E), !i.value && Q ? Bl.check(Q) : Promise.resolve()]);
          if (F !== p) return;
          if (f.value = G.filter((_) => Number.isInteger(_.version) && _.version > 0), !i.value && Q && !f.value.some((_) => _.version === Q.version)) throw new Error("The published version is unavailable.");
        } catch (G) {
          F === p && (c.value = rt(G, "Could not read published Flow."));
        } finally {
          F === p && (v.value = !1);
        }
    }
    Se([u, () => t.modelValue?.version, i], y, { immediate: !0 }), Se(i, (F) => l("validity", !F), { immediate: !0 });
    function C(F) {
      const E = F.detail?.flow_ref;
      E?.kind !== "flow" || !E.id || (i.value = !0, d.value = E.id);
    }
    function T(F) {
      !u.value || !f.value.some((E) => E.version === F) || (l("update:modelValue", { kind: "flow", id: u.value, version: F }), i.value = !1, d.value = "");
    }
    function x() {
      l("update:modelValue", void 0), i.value = !1, d.value = "";
    }
    return St(() => {
      p++, l("validity", !0);
    }), (F, E) => (n(), b("section", su, [
      E[4] || (E[4] = s("h4", { class: "work-field-label" }, "What runs", -1)),
      e.modelValue ? I("", !0) : (n(), b("p", ru, "No Flow bound. This stage keeps its existing external execution contract.")),
      c.value ? (n(), b("div", du, [
        s("p", uu, [
          z(U(i.value ? "Flow versions unavailable" : "Flow binding unavailable"), 1),
          !i.value && e.modelValue ? (n(), b(te, { key: 0 }, [
            z(" (v" + U(e.modelValue.version) + ")", 1)
          ], 64)) : I("", !0),
          z(". " + U(c.value), 1)
        ]),
        k(r(ee), {
          label: "Reload Flow",
          severity: "secondary",
          text: "",
          onClick: y
        })
      ])) : I("", !0),
      o.value ? (n(), b("wc-workflow-picker", {
        key: 2,
        schema: r(m),
        config: V.value,
        title: e.modelValue?.id,
        onChange: C
      }, null, 40, cu)) : (n(), b("p", vu, [
        E[2] || (E[2] = z("Published Flow picker unavailable.", -1)),
        k(r(ee), {
          label: "Reload Flow picker",
          text: "",
          severity: "secondary",
          onClick: g
        })
      ])),
      u.value ? (n(), b("label", fu, [
        E[3] || (E[3] = z(" Published version ", -1)),
        s("select", {
          class: "p-inputtext work-flow-version",
          value: i.value ? "" : e.modelValue?.version,
          "aria-busy": v.value,
          disabled: v.value || !!c.value,
          onChange: E[0] || (E[0] = (Q) => T(Number(Q.target.value)))
        }, [
          s("option", pu, U(v.value ? "Loading versions…" : "Choose a published version"), 1),
          (n(!0), b(te, null, ne(f.value, (Q) => (n(), b("option", {
            key: Q.version,
            value: Q.version
          }, "v" + U(Q.version), 9, bu))), 128))
        ], 40, mu)
      ])) : I("", !0),
      i.value ? (n(), b("p", hu, "Choose a published version to finish selecting the Flow.")) : I("", !0),
      e.modelValue || i.value ? (n(), H(r(ee), {
        key: 6,
        label: i.value ? "Cancel Flow selection" : "Remove Flow binding",
        "aria-label": i.value ? "Cancel Flow selection" : "Remove Flow binding",
        severity: "secondary",
        text: "",
        onClick: E[1] || (E[1] = (Q) => i.value ? (i.value = !1, d.value = "") : x())
      }, null, 8, ["label", "aria-label"])) : I("", !0)
    ]));
  }
}), zl = { seconds: 1, minutes: 60, hours: 3600, days: 86400 };
function Va(e, a) {
  const t = /^P(\d+)W$/.exec(e), l = /^P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+\.?\d*)S)?)?$/.exec(e);
  if (!t && (!l || e === "P" || e.endsWith("T"))) return;
  const o = t ? Number(t[1]) * 604800 : Number(l[1] ?? 0) * 86400 + Number(l[2] ?? 0) * 3600 + Number(l[3] ?? 0) * 60 + Number(l[4] ?? 0);
  if (!Number.isFinite(o) || o <= 0) return;
  const d = a ?? (o % 86400 === 0 ? "days" : o % 3600 === 0 ? "hours" : o < 60 ? "seconds" : "minutes");
  return { amount: o / zl[d], unit: d };
}
function ku(e, a) {
  if (e == null) return;
  if (!Number.isFinite(e * zl[a]) || e <= 0) throw new Error("Enter a positive duration.");
  const t = (o) => o.toLocaleString("en-US", { useGrouping: !1, maximumSignificantDigits: 21 });
  if (!Number.isInteger(e)) return `PT${t(e * zl[a])}S`;
  const l = { seconds: "S", minutes: "M", hours: "H", days: "D" }[a];
  return (a === "days" ? "P" : "PT") + t(e) + l;
}
const yu = { class: "work-stack work-tight" }, wu = {
  key: 0,
  class: "work-error",
  role: "alert"
}, qt = /* @__PURE__ */ $e({
  __name: "DurationControl",
  props: {
    modelValue: {},
    label: {},
    disabled: { type: Boolean }
  },
  emits: ["update:modelValue", "validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = "duration:" + Ht(), d = B(), f = B(""), v = K(() => t.modelValue ? Va(t.modelValue) : void 0), c = K(() => d.value ?? v.value?.unit ?? "days");
    Se(() => t.modelValue, (T) => {
      f.value = "", l("validity", !T || !!v.value, o);
    }, { immediate: !0 });
    const i = K(() => t.modelValue ? Va(t.modelValue, c.value)?.amount ?? null : null);
    function u(T) {
      try {
        const x = ku(T, c.value);
        f.value = "", l("update:modelValue", x), l("validity", !0, o);
      } catch (x) {
        f.value = x.message, l("validity", !1, o);
      }
    }
    let m;
    function V(T) {
      T.target instanceof HTMLInputElement && (m = T.target.value);
    }
    function p(T) {
      if (m === void 0) return;
      const x = m;
      m = void 0, y(T, x);
    }
    function g(T) {
      m = void 0;
      const x = T.originalEvent?.target instanceof HTMLInputElement ? T.originalEvent.target.value : T.formattedValue;
      y(T.value, x);
    }
    function y(T, x) {
      if (x.trim() && (typeof T != "number" || !Number.isFinite(T))) {
        f.value = "Enter a positive duration.", l("validity", !1, o);
        return;
      }
      d.value = c.value, u(typeof T == "number" ? T : null);
    }
    function C(T) {
      const x = i.value;
      d.value = T, !(t.modelValue && !v.value) && u(x);
    }
    return St(() => l("validity", !0, o)), (T, x) => (n(), b("label", yu, [
      z(U(e.label), 1),
      s("span", {
        class: "work-duration-control",
        style: { "max-width": "360px" },
        onInputCapture: V
      }, [
        k(r($t), {
          "model-value": i.value,
          "aria-label": e.label,
          min: 0,
          "aria-invalid": !!f.value || !!e.modelValue && !r(Va)(e.modelValue),
          disabled: e.disabled,
          useGrouping: !1,
          "max-fraction-digits": c.value === "seconds" ? 20 : 3,
          onInput: g,
          "onUpdate:modelValue": p
        }, null, 8, ["model-value", "aria-label", "aria-invalid", "disabled", "max-fraction-digits"]),
        k(r(ue), {
          "model-value": c.value,
          "aria-label": e.label + " unit",
          disabled: e.disabled,
          options: [{ label: "Seconds", value: "seconds" }, { label: "Minutes", value: "minutes" }, { label: "Hours", value: "hours" }, { label: "Days", value: "days" }],
          optionLabel: "label",
          optionValue: "value",
          appendTo: "self",
          "onUpdate:modelValue": x[0] || (x[0] = (F) => C(F))
        }, null, 8, ["model-value", "aria-label", "disabled"])
      ], 32),
      f.value || e.modelValue && !r(Va)(e.modelValue) ? (n(), b("span", wu, U(f.value || `Unsupported duration: ${e.modelValue}`), 1)) : I("", !0)
    ]));
  }
}), Vu = { class: "work-stack" }, $u = { class: "work-settings-grid" }, xu = { class: "work-stack work-tight" }, Cu = { class: "work-stack work-tight" }, Su = {
  key: 1,
  class: "work-stack work-tight"
}, Tu = { class: "work-stack work-tight" }, Iu = { class: "work-settings-grid" }, Du = { class: "work-row" }, Uu = { class: "work-stack work-tight" }, Eu = {
  key: 0,
  class: "work-stack work-tight"
}, Au = /* @__PURE__ */ $e({
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
      i.push({ id: Wt("timer", i), after: "P1D", then: { emit: "reminder" } });
    }
    function f(i, u) {
      delete i.after, delete i.at_field, u === "after" ? i.after = "P1D" : i.at_field = "";
    }
    function v(i, u, m) {
      m ? i[u] = m : (delete i[u], delete i.table);
    }
    function c(i, u) {
      i.then = u === "emit" ? { emit: "" } : { transition: "" };
    }
    return (i, u) => (n(), b("section", Vu, [
      u[8] || (u[8] = s("h4", null, "Timers", -1)),
      (n(!0), b(te, null, ne(o(), (m, V) => (n(), b("article", {
        key: m.id,
        class: "work-settings-card work-stack"
      }, [
        s("div", $u, [
          s("label", xu, [
            u[2] || (u[2] = z("Timer ID", -1)),
            k(r(Te), {
              modelValue: m.id,
              "onUpdate:modelValue": (p) => m.id = p,
              required: "",
              pattern: "[a-z][a-z0-9_]*"
            }, null, 8, ["modelValue", "onUpdate:modelValue"])
          ]),
          s("label", Cu, [
            u[3] || (u[3] = z("Deadline", -1)),
            k(r(ue), {
              "model-value": m.at_field !== void 0 ? "at_field" : "after",
              "onUpdate:modelValue": (p) => f(m, p),
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
          m.after !== void 0 ? (n(), H(qt, {
            key: 0,
            modelValue: m.after,
            "onUpdate:modelValue": (p) => m.after = p,
            label: "After",
            onValidity: u[0] || (u[0] = (p, g) => l("validity", g, p))
          }, null, 8, ["modelValue", "onUpdate:modelValue"])) : (n(), b("label", Su, [
            u[4] || (u[4] = z("At field", -1)),
            k(r(ue), {
              modelValue: m.at_field,
              "onUpdate:modelValue": (p) => m.at_field = p,
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
          s("label", Tu, [
            u[5] || (u[5] = z("Duration by field", -1)),
            k(r(ue), {
              "model-value": m.by ?? "",
              "onUpdate:modelValue": (p) => v(m, "by", p),
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
        m.by ? (n(), H(Nt, {
          key: 0,
          label: "Duration table",
          hint: "Map field values to ISO durations.",
          "model-value": m.table,
          shape: "object",
          "onUpdate:modelValue": (p) => m.table = p,
          onValidity: (p) => l("validity", "table-" + V, p)
        }, null, 8, ["model-value", "onUpdate:modelValue", "onValidity"])) : I("", !0),
        s("div", Iu, [
          k(qt, {
            modelValue: m.repeat,
            "onUpdate:modelValue": (p) => m.repeat = p,
            label: "Repeat every",
            onValidity: u[1] || (u[1] = (p, g) => l("validity", g, p)),
            disabled: m.interrupting
          }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"]),
          s("label", Du, [
            k(r(Kt), {
              modelValue: m.interrupting,
              "onUpdate:modelValue": [(p) => m.interrupting = p, (p) => m.interrupting && delete m.repeat],
              binary: ""
            }, null, 8, ["modelValue", "onUpdate:modelValue"]),
            u[6] || (u[6] = z("Interrupting", -1))
          ]),
          s("label", Uu, [
            u[7] || (u[7] = z("Then", -1)),
            k(r(ue), {
              "model-value": m.then?.transition !== void 0 ? "transition" : "emit",
              "onUpdate:modelValue": (p) => c(m, p),
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
          m.then ? (n(), b("label", Eu, [
            z(U(m.then.transition !== void 0 ? "Transition ID" : "Event name"), 1),
            m.then.transition !== void 0 ? (n(), H(r(Te), {
              key: 0,
              modelValue: m.then.transition,
              "onUpdate:modelValue": (p) => m.then.transition = p
            }, null, 8, ["modelValue", "onUpdate:modelValue"])) : (n(), H(r(Te), {
              key: 1,
              modelValue: m.then.emit,
              "onUpdate:modelValue": (p) => m.then.emit = p
            }, null, 8, ["modelValue", "onUpdate:modelValue"]))
          ])) : I("", !0)
        ]),
        k(r(ee), {
          severity: "secondary",
          onClick: (p) => o().splice(V, 1),
          "aria-label": "Remove timer",
          text: "",
          size: "small"
        }, {
          default: q(() => [
            k(r(de), {
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
          k(r(de), {
            icon: "tabler:plus",
            "aria-hidden": "true"
          })
        ]),
        _: 1
      })
    ]));
  }
}), Pu = ["aria-label"], Ou = { class: "work-stack work-tight" }, Ru = {
  key: 0,
  class: "work-stack work-tight"
}, Nu = /* @__PURE__ */ $e({
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
    function f(c) {
      l("update:modelValue", c === "field" ? { field: "" } : c === "group" ? { group: "" } : []);
    }
    function v(c) {
      l("update:modelValue", o.value === "group" ? { group: c.at(-1)?.id ?? "" } : c);
    }
    return No(() => l("validity", Array.isArray(t.modelValue) ? t.modelValue.length > 0 : "field" in t.modelValue ? !!t.modelValue.field : !!t.modelValue.group)), St(() => l("validity", !0)), (c, i) => (n(), b("section", {
      class: "work-stack work-tight",
      "aria-label": e.label
    }, [
      s("label", Ou, [
        z(U(e.label) + " source", 1),
        k(r(ue), {
          "model-value": o.value,
          "aria-label": e.label + " source",
          options: [{ label: "Group", value: "group" }, { label: "People and groups", value: "principals" }, { label: "Principal field", value: "field" }],
          optionLabel: "label",
          optionValue: "value",
          appendTo: "self",
          "onUpdate:modelValue": f
        }, null, 8, ["model-value", "aria-label"])
      ]),
      "field" in e.modelValue ? (n(), b("label", Ru, [
        i[1] || (i[1] = z("Principal field", -1)),
        k(r(ue), {
          "model-value": e.modelValue.field,
          "aria-label": e.label + " field",
          options: e.draft.fields?.filter((u) => u.type === "principal").map((u) => ({ label: u.title || u.code, value: u.code })) ?? [],
          optionLabel: "label",
          optionValue: "value",
          appendTo: "self",
          "onUpdate:modelValue": i[0] || (i[0] = (u) => l("update:modelValue", { field: u }))
        }, null, 8, ["model-value", "aria-label", "options"])
      ])) : (n(), H(Xl, {
        key: 1,
        "board-id": e.boardId,
        label: e.label,
        kinds: o.value === "group" ? "group" : "user,group,service",
        "model-value": d.value,
        "onUpdate:modelValue": v
      }, null, 8, ["board-id", "label", "kinds", "model-value"]))
    ], 8, Pu));
  }
}), Mu = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, Fu = {
  class: "work-stack work-tight",
  "aria-label": "Approval sources"
}, Lu = { class: "work-row" }, Bu = {
  key: 0,
  class: "work-stack work-tight"
}, zu = ["kinds", "value"], ju = {
  key: 2,
  class: "work-muted work-small",
  role: "status"
}, Wu = {
  key: 3,
  class: "work-chips"
}, qu = { class: "work-row work-small" }, Gu = { class: "work-stack work-tight" }, Ku = {
  key: 4,
  class: "work-error work-small",
  role: "alert"
}, Hu = {
  key: 5,
  class: "work-muted work-small"
}, Yu = /* @__PURE__ */ $e({
  __name: "ApproversEditor",
  props: {
    approvals: {},
    boardId: {}
  },
  emits: ["validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, { principalLabel: o, rememberPrincipal: d, nameError: f } = Fo(() => t.boardId ?? "", () => Array.isArray(t.approvals.from) ? t.approvals.from : "group" in t.approvals.from ? [{ kind: "group", id: t.approvals.from.group }] : []), v = B(!1), c = K(() => Array.isArray(t.approvals.from) ? "principals" : "field" in t.approvals.from ? "field" : "group"), i = K(() => Array.isArray(t.approvals.from) ? t.approvals.from.some((p) => p.kind === "group") || t.approvals.from.length >= t.approvals.min : "field" in t.approvals.from ? !!t.approvals.from.field : !!t.approvals.from.group);
    No(() => l("validity", Number.isSafeInteger(t.approvals.min) && t.approvals.min > 0 && i.value)), St(() => l("validity", !0)), Aa(async () => {
      v.value = await Rt("wc-principal-picker");
    });
    function u(p) {
      t.approvals.from = p === "group" ? { group: "" } : p === "field" ? { field: "" } : [];
    }
    function m(p) {
      const g = p.detail, y = g?.principal_id ?? g?.id;
      if (c.value === "group") {
        t.approvals.from = { group: y ?? "" };
        return;
      }
      if (!y || !Array.isArray(t.approvals.from)) return;
      const C = { kind: g.type ?? g.kind ?? "user", id: y };
      g.label && d(C, g.label), t.approvals.from.some((T) => T.id === y && T.kind === C.kind) || t.approvals.from.push(C);
    }
    function V(p) {
      Array.isArray(t.approvals.from) && t.approvals.from.splice(p, 1);
    }
    return (p, g) => (n(), b(te, null, [
      r(f) ? (n(), b("p", Mu, U(r(f)), 1)) : I("", !0),
      s("section", Fu, [
        s("label", Lu, [
          g[4] || (g[4] = s("span", { class: "work-spacer" }, "Approvals needed", -1)),
          k(r($t), {
            modelValue: e.approvals.min,
            "onUpdate:modelValue": g[0] || (g[0] = (y) => e.approvals.min = y),
            min: 1,
            required: "",
            useGrouping: !1
          }, null, 8, ["modelValue"])
        ]),
        g[8] || (g[8] = s("span", { class: "work-field-label" }, "Approvers", -1)),
        "field" in e.approvals.from ? (n(), b("label", Bu, [
          g[5] || (g[5] = z("Principal field", -1)),
          k(r(Te), {
            modelValue: e.approvals.from.field,
            "onUpdate:modelValue": g[1] || (g[1] = (y) => e.approvals.from.field = y),
            "aria-label": "Principal field"
          }, null, 8, ["modelValue"])
        ])) : v.value ? (n(), b("wc-principal-picker", {
          key: c.value,
          kinds: c.value === "group" ? "group" : "user,group,service",
          value: JSON.stringify("group" in e.approvals.from ? { type: "group", principal_id: e.approvals.from.group } : {}),
          onConfigChanged: m
        }, null, 40, zu)) : (n(), b("p", ju, "The principal picker is unavailable.")),
        Array.isArray(e.approvals.from) ? (n(), b("div", Wu, [
          (n(!0), b(te, null, ne(e.approvals.from, (y, C) => (n(), H(r(lt), {
            key: y.kind + ":" + y.id,
            class: "kx-tag-sm",
            severity: "secondary"
          }, {
            default: q(() => [
              z(U(r(o)(y)), 1),
              k(r(ee), {
                "aria-label": "Remove approver " + (C + 1),
                text: "",
                severity: "secondary",
                size: "small",
                onClick: (T) => V(C)
              }, {
                default: q(() => [
                  k(r(de), {
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
        s("label", qu, [
          g[6] || (g[6] = s("span", { class: "work-spacer" }, "The person who moves the item here cannot approve this visit", -1)),
          k(r(at), {
            modelValue: e.approvals.prevent_self,
            "onUpdate:modelValue": g[2] || (g[2] = (y) => e.approvals.prevent_self = y),
            "aria-label": "The person who moves the item here cannot approve this visit"
          }, null, 8, ["modelValue"])
        ]),
        k(Ne, {
          class: "work-process-options",
          label: "Approval options"
        }, {
          default: q(() => [
            s("label", Gu, [
              g[7] || (g[7] = z("Approval source", -1)),
              k(r(ue), {
                "model-value": c.value,
                "onUpdate:modelValue": g[3] || (g[3] = (y) => u(y)),
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                options: [{ label: "Group members", value: "group" }, { label: "People and groups", value: "principals" }, { label: "Principal field", value: "field" }]
              }, null, 8, ["model-value"])
            ])
          ]),
          _: 1
        }),
        Array.isArray(e.approvals.from) && !i.value ? (n(), b("p", Ku, "Select at least " + U(e.approvals.min) + " distinct principals, or lower the minimum.", 1)) : "group" in e.approvals.from && !e.approvals.from.group ? (n(), b("p", Hu, "Choose the group that can approve this state.")) : I("", !0)
      ])
    ], 64));
  }
}), Xu = {
  class: "work-state-settings work-stack",
  "aria-label": "State settings"
}, Ju = { class: "work-process-kind" }, Zu = { class: "work-row" }, Qu = { class: "work-row" }, _u = { class: "work-stack" }, ec = { class: "work-row" }, tc = { class: "work-stack work-tight" }, ac = { class: "work-row" }, lc = { class: "work-stack work-tight" }, oc = { class: "work-row" }, ic = { class: "work-row" }, nc = { class: "work-stack work-tight" }, sc = { class: "work-stack" }, rc = { class: "work-row" }, dc = { class: "work-row" }, uc = { class: "work-stack work-tight" }, cc = { class: "work-stack work-tight" }, vc = {
  key: 0,
  class: "work-row"
}, fc = { class: "work-stack" }, mc = { class: "work-stack work-tight" }, pc = { class: "work-row" }, bc = /* @__PURE__ */ $e({
  __name: "StateSettings",
  props: {
    state: {},
    process: {},
    draft: {},
    boardId: {}
  },
  emits: ["validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = K(() => (t.process.transitions ?? []).filter((c) => c.from === "any" || c.from.includes(t.state.id))), d = [{ value: "human", icon: "user" }, { value: "gate", icon: "shield-check" }, { value: "automated", icon: "bolt" }, { value: "parallel", icon: "arrows-split" }];
    function f(c) {
      const i = t.state;
      i.kind = c, delete i.run, delete i.release_when, delete i.regions, delete i.join, delete i.due, (c === "automated" || c === "gate") && delete i.awaiting, c === "automated" && (i.run = { stage: i.id, retry: { max: 1, backoff: "PT1M" } }), c === "gate" && (i.release_when = { approvals: { min: 1, from: { group: "" }, prevent_self: !0 } }), c === "parallel" && (i.regions = [{ id: "region_1", initial: t.process.states.find((u) => u.id !== i.id)?.id ?? "" }], i.join = "all");
    }
    function v(c) {
      t.state.run && (c ? t.state.run.on_fail = c : delete t.state.run.on_fail);
    }
    return (c, i) => (n(), b("section", Xu, [
      i[57] || (i[57] = s("h4", { class: "work-process-group" }, "Who moves the item on", -1)),
      k(r(Gl), {
        class: "work-process-kinds",
        "model-value": e.state.kind ?? "human",
        options: d.map((u) => ({
          ...u,
          label: r(Qa)(u.value)
        })),
        optionLabel: "label",
        optionValue: "value",
        optionDisabled: "disabled",
        "allow-empty": !1,
        "aria-label": "Who moves the item on",
        "onUpdate:modelValue": f
      }, {
        option: q(({ option: u }) => [
          s("span", Ju, [
            k(r(de), {
              icon: "tabler:" + u.icon
            }, null, 8, ["icon"]),
            s("span", null, U(u.label), 1)
          ])
        ]),
        _: 1
      }, 8, ["model-value", "options"]),
      i[58] || (i[58] = s("h4", { class: "work-process-group" }, "Limit", -1)),
      s("label", Zu, [
        i[34] || (i[34] = s("span", { class: "work-spacer" }, "Items allowed here", -1)),
        k(To, {
          draft: e.draft,
          state: e.state.id,
          label: "Items allowed here"
        }, null, 8, ["draft", "state"])
      ]),
      s("label", Qu, [
        i[35] || (i[35] = s("span", { class: "work-spacer" }, [
          z("Refuse moves over the limit"),
          s("small", { class: "work-muted work-block" }, "Off only warns")
        ], -1)),
        k(To, {
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
      !e.state.kind || e.state.kind === "human" ? (n(), H(qt, {
        key: 0,
        modelValue: e.state.due,
        "onUpdate:modelValue": i[1] || (i[1] = (u) => e.state.due = u),
        label: "Time allowed in this state",
        onValidity: i[2] || (i[2] = (u, m) => l("validity", m, u))
      }, null, 8, ["modelValue"])) : I("", !0),
      e.state.kind === "gate" && e.state.release_when ? (n(), b(te, { key: 1 }, [
        i[37] || (i[37] = s("h4", { class: "work-process-group" }, "Approval", -1)),
        e.state.release_when.approvals ? (n(), H(Yu, {
          key: 0,
          "board-id": e.boardId,
          approvals: e.state.release_when.approvals,
          onValidity: i[3] || (i[3] = (u) => l("validity", "approvers", u))
        }, null, 8, ["board-id", "approvals"])) : I("", !0),
        k(Ne, {
          class: "work-process-options",
          label: "Release options"
        }, {
          default: q(() => [
            s("div", _u, [
              s("label", ec, [
                i[36] || (i[36] = s("span", { class: "work-spacer" }, "Require approvals", -1)),
                k(r(at), {
                  "model-value": !!e.state.release_when.approvals,
                  "aria-label": "Require approvals",
                  "onUpdate:modelValue": i[4] || (i[4] = (u) => e.state.release_when.approvals = u ? { min: 1, from: { group: "" }, prevent_self: !0 } : void 0)
                }, null, 8, ["model-value"])
              ]),
              k(qt, {
                modelValue: e.state.release_when.wait,
                "onUpdate:modelValue": i[5] || (i[5] = (u) => e.state.release_when.wait = u),
                label: "Wait before release",
                onValidity: i[6] || (i[6] = (u, m) => l("validity", m, u))
              }, null, 8, ["modelValue"]),
              k(Yl, {
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
      ], 64)) : I("", !0),
      e.state.kind === "automated" && e.state.run ? (n(), b(te, { key: 2 }, [
        i[46] || (i[46] = s("h4", { class: "work-process-group" }, "Automation", -1)),
        s("label", tc, [
          i[38] || (i[38] = z("Run label", -1)),
          k(r(Te), {
            modelValue: e.state.run.stage,
            "onUpdate:modelValue": i[9] || (i[9] = (u) => e.state.run.stage = u),
            "aria-label": "Run label",
            required: ""
          }, null, 8, ["modelValue"])
        ]),
        k(gu, {
          modelValue: e.state.run.flow_ref,
          "onUpdate:modelValue": i[10] || (i[10] = (u) => e.state.run.flow_ref = u),
          onValidity: i[11] || (i[11] = (u) => l("validity", "flow", u))
        }, null, 8, ["modelValue"]),
        k(qt, {
          modelValue: e.state.run.timeout,
          "onUpdate:modelValue": i[12] || (i[12] = (u) => e.state.run.timeout = u),
          label: "Attempt timeout",
          onValidity: i[13] || (i[13] = (u, m) => l("validity", m, u))
        }, null, 8, ["modelValue"]),
        i[47] || (i[47] = s("small", { class: "work-muted" }, "Blank uses the board timeout, or one hour.", -1)),
        s("label", ac, [
          i[39] || (i[39] = s("span", { class: "work-spacer" }, "Maximum visits", -1)),
          k(r($t), {
            "model-value": e.state.run.max_visits ?? null,
            "aria-label": "Maximum visits",
            min: 1,
            useGrouping: !1,
            placeholder: "Board default",
            "onUpdate:modelValue": i[14] || (i[14] = (u) => e.state.run.max_visits = u ?? void 0)
          }, null, 8, ["model-value"])
        ]),
        s("label", lc, [
          i[40] || (i[40] = z("When visits are exhausted", -1)),
          k(r(ue), {
            "model-value": e.state.run.on_exhausted,
            "aria-label": "When visits are exhausted",
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            showClear: "",
            options: (e.process.transitions ?? []).filter((u) => !u.auto).map((u) => ({ label: r(Ke)(u), value: u.id })),
            "onUpdate:modelValue": i[15] || (i[15] = (u) => e.state.run.on_exhausted = u || void 0)
          }, null, 8, ["model-value", "options"])
        ]),
        i[48] || (i[48] = s("small", { class: "work-muted" }, "Blank records a failed run and stops automation. A route must leave every incoming state or be global.", -1)),
        s("label", oc, [
          i[41] || (i[41] = s("span", { class: "work-spacer" }, "Retry if it fails", -1)),
          k(r(at), {
            "model-value": !!e.state.run.retry,
            "aria-label": "Retry if it fails",
            "onUpdate:modelValue": i[16] || (i[16] = (u) => e.state.run.retry = u ? { max: 1, backoff: "PT1M" } : void 0)
          }, null, 8, ["model-value"])
        ]),
        e.state.run.retry ? (n(), b(te, { key: 0 }, [
          s("label", ic, [
            i[42] || (i[42] = s("span", { class: "work-spacer" }, "Maximum attempts", -1)),
            k(r($t), {
              modelValue: e.state.run.retry.max,
              "onUpdate:modelValue": i[17] || (i[17] = (u) => e.state.run.retry.max = u),
              min: 1,
              useGrouping: !1
            }, null, 8, ["modelValue"])
          ]),
          k(qt, {
            modelValue: e.state.run.retry.backoff,
            "onUpdate:modelValue": i[18] || (i[18] = (u) => e.state.run.retry.backoff = u),
            label: "Wait between attempts",
            onValidity: i[19] || (i[19] = (u, m) => l("validity", m, u))
          }, null, 8, ["modelValue"])
        ], 64)) : I("", !0),
        (n(), b(te, null, ne([{ key: "on_pass", label: "On success" }, { key: "on_cancel", label: "On cancellation" }], (u) => s("label", {
          key: u.key,
          class: "work-stack work-tight"
        }, [
          z(U(u.label), 1),
          k(r(ue), {
            "model-value": e.state.run[u.key],
            "aria-label": u.label,
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            showClear: "",
            options: o.value.map((m) => ({ label: r(Ke)(m), value: m.id })),
            "onUpdate:modelValue": (m) => e.state.run[u.key] = m || void 0
          }, null, 8, ["model-value", "aria-label", "options", "onUpdate:modelValue"])
        ])), 64)),
        s("label", nc, [
          i[43] || (i[43] = z("If it fails, go to", -1)),
          k(r(ue), {
            "aria-label": "If it fails, go to",
            "model-value": e.state.run.on_fail,
            "onUpdate:modelValue": v,
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            showClear: "",
            options: o.value.map((u) => ({
              label: r(Ke)(u) + " → " + r(we)(e.process.states.find((m) => m.id === u.to)),
              value: u.id
            }))
          }, null, 8, ["model-value", "options"])
        ]),
        k(Ne, {
          class: "work-disclosure",
          label: "Board automation defaults"
        }, {
          default: q(() => [
            s("div", sc, [
              i[45] || (i[45] = s("p", { class: "work-muted" }, "These values apply to automated states without their own limit.", -1)),
              k(qt, {
                "model-value": e.draft.policy?.stage_timeout,
                label: "Default attempt timeout",
                "onUpdate:modelValue": i[20] || (i[20] = (u) => (e.draft.policy ??= {}).stage_timeout = u),
                onValidity: i[21] || (i[21] = (u, m) => l("validity", m, u))
              }, null, 8, ["model-value"]),
              s("label", rc, [
                i[44] || (i[44] = s("span", { class: "work-spacer" }, "Default maximum visits", -1)),
                k(r($t), {
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
      ], 64)) : I("", !0),
      e.state.kind === "parallel" && e.state.regions ? (n(), b(te, { key: 3 }, [
        i[53] || (i[53] = s("h4", { class: "work-process-group" }, "Lanes", -1)),
        (n(!0), b(te, null, ne(e.state.regions, (u, m) => (n(), b("div", {
          key: m,
          class: "work-process-value work-stack work-tight"
        }, [
          s("div", dc, [
            s("span", null, "Lane " + U(m + 1), 1),
            i[49] || (i[49] = s("span", { class: "work-spacer" }, null, -1)),
            k(r(ee), {
              severity: "danger",
              text: "",
              size: "small",
              "aria-label": "Remove lane",
              onClick: (V) => e.state.regions.splice(m, 1)
            }, {
              default: q(() => [
                k(r(de), { icon: "tabler:trash" })
              ]),
              _: 1
            }, 8, ["onClick"])
          ]),
          s("label", uc, [
            i[50] || (i[50] = z("Starts at", -1)),
            k(r(ue), {
              "aria-label": "Lane starts at",
              modelValue: u.initial,
              "onUpdate:modelValue": (V) => u.initial = V,
              appendTo: "self",
              optionLabel: "label",
              optionValue: "value",
              options: e.process.states.filter((V) => V.id !== e.state.id).map((V) => ({ label: r(we)(V), value: V.id }))
            }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
          ])
        ]))), 128)),
        k(r(ee), {
          label: "Add lane",
          severity: "secondary",
          outlined: "",
          size: "small",
          onClick: i[23] || (i[23] = (u) => e.state.regions.push({
            id: r(Wt)("region", e.state.regions),
            initial: e.process.states.find((m) => m.id !== e.state.id)?.id ?? ""
          }))
        }, {
          icon: q(() => [
            k(r(de), { icon: "tabler:plus" })
          ]),
          _: 1
        }),
        s("label", cc, [
          i[51] || (i[51] = z("Finish rule", -1)),
          k(r(ue), {
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
        typeof e.state.join == "number" ? (n(), b("label", vc, [
          i[52] || (i[52] = s("span", { class: "work-spacer" }, "Lanes needed", -1)),
          k(r($t), {
            modelValue: e.state.join,
            "onUpdate:modelValue": i[25] || (i[25] = (u) => e.state.join = u),
            min: 1,
            max: e.state.regions.length,
            useGrouping: !1
          }, null, 8, ["modelValue", "max"])
        ])) : I("", !0)
      ], 64)) : I("", !0),
      k(Ne, {
        class: "work-disclosure",
        label: "Advanced state settings"
      }, {
        default: q(() => [
          s("div", fc, [
            i[56] || (i[56] = s("h4", { class: "work-process-group" }, "Assignment and conditions", -1)),
            s("label", mc, [
              i[54] || (i[54] = z("Stage label", -1)),
              k(r(Te), {
                "model-value": e.state.stage,
                "aria-label": "Stage label",
                "onUpdate:modelValue": i[26] || (i[26] = (u) => e.state.stage = u || void 0)
              }, null, 8, ["model-value"])
            ]),
            !e.state.kind || e.state.kind === "human" || e.state.kind === "parallel" ? (n(), b(te, { key: 0 }, [
              s("label", pc, [
                k(r(at), {
                  "model-value": !!e.state.awaiting,
                  "aria-label": "Awaiting people",
                  "onUpdate:modelValue": i[27] || (i[27] = (u) => e.state.awaiting = u ? { group: "" } : void 0)
                }, null, 8, ["model-value"]),
                i[55] || (i[55] = z("Awaiting people", -1))
              ]),
              e.state.awaiting ? (n(), H(Nu, {
                key: 0,
                modelValue: e.state.awaiting,
                "onUpdate:modelValue": i[28] || (i[28] = (u) => e.state.awaiting = u),
                draft: e.draft,
                "board-id": e.boardId,
                label: "Awaiting",
                onValidity: i[29] || (i[29] = (u) => l("validity", "awaiting", u))
              }, null, 8, ["modelValue", "draft", "board-id"])) : I("", !0)
            ], 64)) : I("", !0),
            k(Xl, {
              "board-id": e.boardId,
              modelValue: e.state.assign,
              "onUpdate:modelValue": i[30] || (i[30] = (u) => e.state.assign = u),
              label: "Assign to"
            }, null, 8, ["board-id", "modelValue"]),
            k(Nt, {
              label: "State checks",
              example: ["installed-check"],
              "model-value": e.state.invariants,
              shape: "array",
              "onUpdate:modelValue": i[31] || (i[31] = (u) => e.state.invariants = u),
              onValidity: i[32] || (i[32] = (u) => l("validity", "invariants", u))
            }, null, 8, ["model-value"]),
            k(Au, {
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
}), hc = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, gc = { key: 1 }, kc = { class: "work-muted" }, yc = {
  key: 2,
  class: "work-map-zoom",
  role: "group",
  "aria-label": "Map zoom"
}, wc = ["aria-label", "aria-keyshortcuts", "onKeydown"], Vc = { class: "work-row" }, $c = { class: "work-process-meaning" }, xc = {
  key: 0,
  class: "work-muted"
}, Cc = { class: "work-stack work-tight" }, Sc = { class: "work-next-transition work-stack work-tight" }, Tc = { class: "work-row work-wrap" }, Ic = { class: "work-process-inspector-foot" }, Dc = { class: "work-row work-transition-actions" }, Uc = { class: "work-process-meaning" }, Ec = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, Ac = { class: "work-stack work-tight" }, Pc = { class: "work-stack" }, Oc = { class: "work-stack work-tight" }, Rc = {
  key: 0,
  class: "work-muted"
}, Nc = { class: "work-stack work-tight" }, Mc = { class: "work-dialog-actions" }, Fc = /* @__PURE__ */ $e({
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
    const t = e, l = a, o = Wl(Hl, void 0), d = K(() => t.draft.processes ?? []), f = B(!1), v = B(""), c = B(""), i = B(""), u = B("Map"), m = B("");
    Se(() => t.createForItemType, ($, D) => {
      !$ && !D || (v.value = "", f.value = !!$);
    }, { immediate: !0 });
    const V = B(!1), p = B(), g = B(), y = B(), C = B(), T = B(), x = B(), F = B(!1);
    let E;
    async function Q() {
      F.value = !0, await Vt(), T.value?.querySelector('[aria-label="State name"]')?.focus();
    }
    const G = K(() => d.value.find(($) => $.id === c.value) ?? d.value[0]), _ = B(!1);
    function re($) {
      _.value = !0, u.value = $;
    }
    function ce() {
      !_.value && C.value?.clientWidth && (u.value = C.value.clientWidth < 480 && (G.value?.states.length ?? 0) > 6 ? "List" : "Map");
    }
    let fe;
    Aa(() => {
      ce(), C.value && typeof ResizeObserver < "u" && (fe = new ResizeObserver(ce), fe.observe(C.value));
    }), St(() => fe?.disconnect()), Se(G, () => {
      _.value = !1, ce();
    });
    function se() {
      F.value = !1, V.value = !1, p.value = void 0, g.value = void 0, i.value = "", E = void 0;
    }
    async function oe() {
      const $ = E, D = o?.selected.value;
      D?.startsWith("workflow/") && o?.choose("workflow", D.slice(9), !1), se(), await Vt(), $?.isConnected ? $.focus() : O();
    }
    function O() {
      u.value === "Map" ? y.value?.focus() : x.value?.focus();
    }
    async function ae() {
      await Vt(), T.value && (T.value.scrollTop = 0, T.value.focus({ preventScroll: !0 }), (T.value.closest(".work-settings-shell")?.clientWidth ?? 1 / 0) <= 700 && T.value.scrollIntoView?.({ block: "nearest" }));
    }
    function L($, D) {
      E = D, F.value = !1, V.value = !1, p.value = $, g.value = void 0, m.value = "", i.value = "", G.value && o?.choose("workflow", G.value.id + ".state." + $.id, !0), ae();
    }
    async function ve($) {
      m.value = "", V.value = $, await Vt();
      const D = $ ? '[role="combobox"]' : "button";
      T.value?.querySelector(".work-next-transition " + D)?.focus();
    }
    function Y($, D) {
      E = D, F.value = !1, g.value = $, p.value = void 0, i.value = "", G.value && o?.choose("workflow", G.value.id + ".transition." + $.id, !0), ae();
    }
    Se([G, u], se), Se([() => o?.selected.value, d], async ([$], D) => {
      if (!$?.startsWith("workflow/")) {
        D?.[0]?.startsWith("workflow/") && se();
        return;
      }
      const [w, W, he] = $.slice(9).split("."), me = d.value.find((qe) => qe.id === w);
      if (!me || G.value !== me && (c.value = me.id, await Vt(), o?.selected.value !== $))
        return;
      const De = W === "state" ? me.states.find((qe) => qe.id === he) : void 0, Pe = W === "transition" ? me.transitions?.find((qe) => qe.id === he) : void 0;
      De === p.value && Pe === g.value || (se(), p.value = De, g.value = Pe);
    }, { immediate: !0, flush: "post" });
    const M = K(() => {
      if (!t.counts || !G.value) return;
      const $ = t.countTypes?.filter((D) => D.process === G.value?.id) ?? [];
      return Object.fromEntries(G.value.states.map((D) => [
        D.id,
        $.reduce((w, W) => w + (t.counts?.[W.id]?.[D.id] ?? 0), 0)
      ]));
    }), S = K(() => (t.guards ?? []).filter(($) => t.draft.plugins?.some((D) => D.use === $.plugin))), N = K(() => Object.keys(t.draft.policy?.wip ?? {}).filter(($) => !d.value.some((D) => D.states.some((w) => w.id === $))));
    function A() {
      const $ = v.value.trim();
      if (!$) return;
      const D = $.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "") || "process", w = (/^[a-z]/.test(D) ? D : "process_" + D).slice(0, 40), W = d.value.some((he) => he.id === w) ? Wt(w, d.value) : w;
      (t.draft.processes ??= []).push({ id: W, name: $, initial: "todo", states: [{ id: "todo", name: "To do", category: "unstarted" }], transitions: [] }), c.value = W, v.value = "", f.value = !1, l("created", W);
    }
    function X() {
      f.value = !1, l("cancel-creation");
    }
    async function h($, D) {
      const w = { id: Wt("state", $.states), name: "New state", category: "started" }, W = Ha($), he = W.at(-1), me = p.value ?? (he?.category === "completed" ? W.at(-2) : he), De = me && ($.transitions?.find((Pe) => Pe.default && Pe.from !== "any" && Pe.from.includes(me.id)) ?? $.transitions?.find((Pe) => Pe.from !== "any" && Pe.from.includes(me.id) && $.states.findIndex((qe) => qe.id === Pe.to) > $.states.indexOf(me)));
      if ($.states.splice(me ? $.states.indexOf(me) + 1 : $.states.length, 0, w), me && me.category !== "completed" && me.category !== "canceled")
        if (De) {
          const Pe = De.to;
          De.to = w.id, ($.transitions ??= []).push({ id: Wt("transition", $.transitions ?? []), name: "Continue", from: [w.id], to: Pe, ...De.auto && De.default ? { auto: !0, default: !0 } : {} });
        } else ($.transitions ??= []).push({ id: Wt("transition", $.transitions ?? []), name: "Continue", from: [me.id], to: w.id });
      L(w, D), await Q();
    }
    function P($, D, w = E) {
      const W = G.value;
      if (!W || !D || $ === D) return;
      const he = W.transitions ??= [], me = `to_${D}`;
      let De = me.slice(0, 40), Pe = 2;
      for (; he.some((It) => It.id === De); ) {
        const It = `_${Pe++}`;
        De = me.slice(0, 40 - It.length) + It;
      }
      const qe = { id: De, name: `To ${we(W.states.find((It) => It.id === D)).toLowerCase()}`, from: [$], to: D };
      he.push(qe), Y(qe, w);
    }
    function ie($, D) {
      const w = p.value ?? $.states.find((me) => me.id === $.initial) ?? $.states[0], W = $.states.find((me) => me.id !== w?.id);
      if (!w || !W) return;
      const he = { id: Wt("transition", $.transitions ?? []), name: "To " + we(W), from: [w.id], to: W.id };
      ($.transitions ??= []).push(he), Y(he, D);
    }
    async function J($) {
      const D = G.value, w = D?.transitions?.indexOf($) ?? -1;
      if (!D || w < 0) return;
      const W = Bi(D, $);
      if (W.length) {
        i.value = `Used by ${W.join(", ")}. Update those references first.`;
        return;
      }
      D.transitions.splice(w, 1), se(), await Vt(), O();
    }
    function ye($) {
      !g.value || $.defaultPrevented || $.repeat || ($.preventDefault(), J(g.value));
    }
    function Ve($, D) {
      const w = zi($, D);
      if (w.length) {
        i.value = `${we(D)} is used by ${w.join(", ")}. Update these references first.`;
        return;
      }
      $.states.splice($.states.indexOf(D), 1), oe();
    }
    async function Ae($) {
      const D = t.draft.item_types?.filter((W) => W.process === $.id).map((W) => W.title || "Untitled item type") ?? [];
      if (D.length) {
        i.value = `Used by ${D.join(", ")}. Choose a different process for those item types first.`;
        return;
      }
      const w = await t.guardRemoval?.("processes", $.id);
      if (w) {
        i.value = w;
        return;
      }
      Pa(t.draft, "processes", $.id), c.value = "", se();
    }
    return ($, D) => (n(), b("section", {
      ref_key: "editor",
      ref: C,
      class: "work-process-editor work-stack",
      "aria-label": "Process editor",
      onKeydown: D[17] || (D[17] = Ge((w) => T.value && oe(), ["esc"]))
    }, [
      i.value && !g.value ? (n(), b("p", hc, U(i.value), 1)) : I("", !0),
      (n(!0), b(te, null, ne(e.issues?.filter((w) => w.code === "process " + G.value?.id) ?? [], (w) => (n(), b("p", {
        key: w.what + w.detail,
        class: "work-error work-small",
        role: "alert"
      }, U(r(ol)(w)) + " · " + U(w.what), 1))), 128)),
      G.value ? (n(), b("div", {
        key: 1,
        class: ft(["work-process-builder", { "work-process-inspecting": p.value || g.value }])
      }, [
        s("div", {
          ref_key: "tools",
          ref: x,
          class: "work-process-controls",
          role: "toolbar",
          "aria-label": "Process tools",
          tabindex: "-1"
        }, [
          d.value.length > 1 ? (n(), H(r(ue), {
            key: 0,
            "model-value": G.value.id,
            "aria-label": "Process",
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            options: d.value.map((w) => ({ label: w.name || "Untitled process", value: w.id })),
            "onUpdate:modelValue": D[0] || (D[0] = (w) => c.value = w)
          }, null, 8, ["model-value", "options"])) : (n(), b("strong", gc, U(G.value.name || "Untitled process"), 1)),
          k(r(ee), {
            label: "Add state",
            severity: "secondary",
            outlined: "",
            onClick: D[1] || (D[1] = (w) => h(G.value, w.currentTarget))
          }, {
            icon: q(() => [
              k(r(de), { icon: "tabler:plus" })
            ]),
            _: 1
          }),
          k(r(ee), {
            label: "Add transition",
            severity: "secondary",
            outlined: "",
            disabled: G.value.states.length < 2,
            onClick: D[2] || (D[2] = (w) => ie(G.value, w.currentTarget))
          }, null, 8, ["disabled"]),
          k(r(ue), {
            modelValue: G.value.initial,
            "onUpdate:modelValue": D[3] || (D[3] = (w) => G.value.initial = w),
            "aria-label": "Starts in " + r(we)(G.value.states.find((w) => w.id === G.value.initial)),
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            options: G.value.states.map((w) => ({ label: r(we)(w), value: w.id }))
          }, {
            value: q(() => [
              s("span", kc, "Starts in " + U(r(we)(G.value.states.find((w) => w.id === G.value.initial))), 1)
            ]),
            _: 1
          }, 8, ["modelValue", "aria-label", "options"]),
          D[18] || (D[18] = s("span", { class: "work-spacer" }, null, -1)),
          u.value === "Map" ? (n(), b("div", yc, [
            k(r(ee), {
              label: "Fit",
              title: "Fit the map to a readable width",
              text: "",
              severity: "secondary",
              size: "small",
              onClick: D[4] || (D[4] = (w) => y.value?.fit())
            }, {
              icon: q(() => [
                k(r(de), { icon: "tabler:arrows-maximize" })
              ]),
              _: 1
            }),
            u.value === "Map" ? (n(), H(r(ee), {
              key: 0,
              "aria-label": "Zoom out",
              title: "Zoom out",
              text: "",
              severity: "secondary",
              size: "small",
              onClick: D[5] || (D[5] = (w) => y.value?.zoomOut())
            }, {
              default: q(() => [
                k(r(de), { icon: "tabler:minus" })
              ]),
              _: 1
            })) : I("", !0),
            u.value === "Map" ? (n(), H(r(ee), {
              key: 1,
              "aria-label": "Zoom in",
              title: "Zoom in",
              text: "",
              severity: "secondary",
              size: "small",
              onClick: D[6] || (D[6] = (w) => y.value?.zoomIn())
            }, {
              default: q(() => [
                k(r(de), { icon: "tabler:plus" })
              ]),
              _: 1
            })) : I("", !0)
          ])) : I("", !0),
          k(r(Gl), {
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
            onClick: D[7] || (D[7] = (w) => f.value = !0)
          }, {
            icon: q(() => [
              k(r(de), { icon: "tabler:plus" })
            ]),
            _: 1
          })
        ], 512),
        u.value === "Map" ? (n(), H(Id, {
          key: 0,
          ref_key: "graph",
          ref: y,
          process: G.value,
          draft: e.draft,
          "fit-on-open": "",
          "selected-state": p.value,
          "selected-transition": g.value,
          onState: L,
          onTransition: Y,
          onRemoveTransition: ye,
          onConnect: P,
          onClear: oe
        }, null, 8, ["process", "draft", "selected-state", "selected-transition"])) : (n(), H(Yd, {
          key: 1,
          process: G.value,
          "selected-state": p.value,
          "selected-transition": g.value,
          counts: M.value,
          onState: L,
          onTransition: Y,
          onRemoveState: D[8] || (D[8] = (w) => Ve(G.value, w)),
          onRemoveTransition: J
        }, null, 8, ["process", "selected-state", "selected-transition", "counts"])),
        k(Oo, { name: "work-panel" }, {
          default: q(() => [
            p.value || g.value ? (n(), b("aside", {
              key: 0,
              ref_key: "inspector",
              ref: T,
              class: "work-process-sideform",
              tabindex: "-1",
              "aria-label": p.value ? "State inspector" : "Transition inspector",
              "aria-keyshortcuts": g.value ? "Delete Backspace" : void 0,
              onKeydown: [
                Ge(Re(ye, ["self"]), ["delete"]),
                Ge(Re(ye, ["self"]), ["backspace"])
              ]
            }, [
              (n(!0), b(te, null, ne(p.value ? [p.value] : [], (w) => (n(), b(te, {
                key: w.id
              }, [
                s("header", Vc, [
                  F.value ? (n(), H(r(Te), {
                    key: 1,
                    modelValue: w.name,
                    "onUpdate:modelValue": (W) => w.name = W,
                    class: "work-process-name",
                    "aria-label": "State name",
                    onBlur: D[9] || (D[9] = (W) => F.value = !1)
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])) : (n(), H(Kl, {
                    key: 0,
                    class: "work-process-state-title",
                    "aria-label": "Rename state",
                    onActivate: Q
                  }, {
                    default: q(() => [
                      s("span", null, U(r(we)(w)), 1)
                    ]),
                    _: 2
                  }, 1024)),
                  k(r(ee), {
                    severity: "secondary",
                    text: "",
                    size: "small",
                    "aria-label": "Close state editor",
                    onClick: oe
                  }, {
                    default: q(() => [
                      k(r(de), { icon: "tabler:x" })
                    ]),
                    _: 1
                  })
                ]),
                s("p", $c, U(r(Li)(w, e.draft)), 1),
                M.value ? (n(), b("p", xc, U(M.value[w.id] ?? 0) + " " + U(M.value[w.id] === 1 ? "item" : "items") + " currently here", 1)) : I("", !0),
                k(bc, {
                  state: w,
                  process: G.value,
                  draft: e.draft,
                  "board-id": e.boardId,
                  onValidity: (W, he) => l("validity", W.includes("duration:") ? W : G.value.id + ":" + w.id + ":" + W, he)
                }, null, 8, ["state", "process", "draft", "board-id", "onValidity"]),
                s("label", Cc, [
                  D[19] || (D[19] = z("Phase", -1)),
                  k(r(ue), {
                    "aria-label": "Phase",
                    modelValue: w.category,
                    "onUpdate:modelValue": (W) => w.category = W,
                    appendTo: "self",
                    optionLabel: "label",
                    optionValue: "value",
                    options: ["triage", "backlog", ...r(Lo)].map((W) => ({ label: r(Yt)(W), value: W }))
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                ]),
                s("div", Sc, [
                  V.value ? (n(), b(te, { key: 1 }, [
                    k(r(ue), {
                      modelValue: m.value,
                      "onUpdate:modelValue": D[11] || (D[11] = (W) => m.value = W),
                      "aria-label": "Next state",
                      placeholder: "Choose the next state",
                      appendTo: "self",
                      optionLabel: "label",
                      optionValue: "value",
                      options: G.value.states.filter((W) => W !== w).map((W) => ({ label: r(we)(W), value: W.id }))
                    }, null, 8, ["modelValue", "options"]),
                    s("div", Tc, [
                      k(r(ee), {
                        label: "Add transition",
                        size: "small",
                        disabled: !m.value,
                        onClick: (W) => P(w.id, m.value)
                      }, null, 8, ["disabled", "onClick"]),
                      k(r(ee), {
                        label: "Cancel",
                        severity: "secondary",
                        text: "",
                        size: "small",
                        onClick: D[12] || (D[12] = (W) => ve(!1))
                      })
                    ])
                  ], 64)) : (n(), H(r(ee), {
                    key: 0,
                    label: "Add transition",
                    severity: "secondary",
                    outlined: "",
                    size: "small",
                    "aria-expanded": "false",
                    disabled: G.value.states.length < 2,
                    onClick: D[10] || (D[10] = (W) => ve(!0))
                  }, {
                    icon: q(() => [
                      k(r(de), {
                        icon: "tabler:plus",
                        "aria-hidden": "true"
                      })
                    ]),
                    _: 1
                  }, 8, ["disabled"]))
                ]),
                s("footer", Ic, [
                  k(r(ee), {
                    label: "Remove state",
                    severity: "danger",
                    text: "",
                    size: "small",
                    onClick: (W) => Ve(G.value, w)
                  }, {
                    icon: q(() => [
                      k(r(de), { icon: "tabler:trash" })
                    ]),
                    _: 1
                  }, 8, ["onClick"])
                ])
              ], 64))), 128)),
              (n(!0), b(te, null, ne(g.value ? [g.value] : [], (w) => (n(), b(te, {
                key: w.id
              }, [
                s("header", Dc, [
                  D[20] || (D[20] = s("h3", null, "Transition", -1)),
                  k(r(ee), {
                    type: "button",
                    label: "Remove transition",
                    severity: "danger",
                    text: "",
                    size: "small",
                    onClick: (W) => J(w)
                  }, {
                    icon: q(() => [
                      k(r(de), { icon: "tabler:trash" })
                    ]),
                    _: 1
                  }, 8, ["onClick"]),
                  k(r(ee), {
                    severity: "secondary",
                    text: "",
                    size: "small",
                    "aria-label": "Close transition editor",
                    onClick: oe
                  }, {
                    default: q(() => [
                      k(r(de), { icon: "tabler:x" })
                    ]),
                    _: 1
                  })
                ]),
                s("p", Uc, U(w.from === "any" ? "Any state" : w.from.map((W) => r(we)(G.value.states.find((he) => he.id === W))).join(", ")) + " → " + U(r(we)(G.value.states.find((W) => W.id === w.to))), 1),
                i.value ? (n(), b("p", Ec, U(i.value), 1)) : I("", !0),
                s("label", Ac, [
                  D[21] || (D[21] = z("Name", -1)),
                  k(r(Te), {
                    modelValue: w.name,
                    "onUpdate:modelValue": (W) => w.name = W,
                    placeholder: r(Ke)(w),
                    "aria-label": "Transition name"
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder"])
                ]),
                k(nu, {
                  transition: w,
                  process: G.value,
                  draft: e.draft,
                  "board-id": e.boardId,
                  guards: S.value,
                  onValidity: (W, he) => l("validity", G.value.id + ":transition-" + w.id + ":" + W, he)
                }, null, 8, ["transition", "process", "draft", "board-id", "guards", "onValidity"])
              ], 64))), 128))
            ], 40, wc)) : I("", !0)
          ]),
          _: 1
        })
      ], 2)) : (n(), H(r(ee), {
        key: 2,
        label: "New process",
        severity: "secondary",
        outlined: "",
        onClick: D[13] || (D[13] = (w) => f.value = !0)
      }, {
        icon: q(() => [
          k(r(de), { icon: "tabler:plus" })
        ]),
        _: 1
      })),
      G.value ? (n(), H(Ne, {
        key: 3,
        class: "work-disclosure",
        label: "Advanced workflow settings"
      }, {
        default: q(() => [
          s("div", Pc, [
            k(Ne, {
              class: "work-small",
              label: "Technical details"
            }, {
              default: q(() => [...D[22] || (D[22] = [
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
            s("label", Oc, [
              D[23] || (D[23] = z("Workflow name", -1)),
              k(r(Te), {
                modelValue: G.value.name,
                "onUpdate:modelValue": D[14] || (D[14] = (w) => G.value.name = w),
                "aria-label": "Workflow name"
              }, null, 8, ["modelValue"])
            ]),
            N.value.length ? (n(), b("p", Rc, "Some item limits belong to removed states.")) : I("", !0),
            (n(!0), b(te, null, ne(N.value, (w, W) => (n(), H(r(ee), {
              key: w,
              label: "Clear limit for removed state " + (W + 1),
              severity: "secondary",
              text: "",
              onClick: (he) => delete e.draft.policy.wip[w]
            }, null, 8, ["label", "onClick"]))), 128)),
            k(r(ee), {
              label: "Remove workflow",
              severity: "danger",
              text: "",
              size: "small",
              onClick: D[15] || (D[15] = (w) => Ae(G.value))
            })
          ])
        ]),
        _: 1
      })) : I("", !0),
      k(Pl, {
        visible: f.value,
        "return-focus": e.creationOpener,
        label: "New process",
        onClose: X
      }, {
        default: q(() => [
          s("form", {
            class: "work-dialog-box",
            "aria-label": "New process",
            onSubmit: Re(A, ["stop", "prevent"])
          }, [
            D[25] || (D[25] = s("h2", null, "New process", -1)),
            s("label", Nc, [
              D[24] || (D[24] = z("Name", -1)),
              k(r(Te), {
                modelValue: v.value,
                "onUpdate:modelValue": D[16] || (D[16] = (w) => v.value = w),
                "aria-label": "New process name",
                autofocus: "",
                required: ""
              }, null, 8, ["modelValue"])
            ]),
            s("div", Mc, [
              k(r(ee), {
                label: "Cancel",
                severity: "secondary",
                outlined: "",
                onClick: X
              }),
              k(r(ee), {
                label: "Create process",
                type: "submit",
                disabled: !v.value.trim()
              }, null, 8, ["disabled"])
            ])
          ], 32)
        ]),
        _: 1
      }, 8, ["visible", "return-focus"])
    ], 544));
  }
}), Lc = {
  class: "work-settings-card work-stack",
  "aria-label": "Existing items"
}, Bc = {
  key: 0,
  class: "work-stack work-tight"
}, zc = { class: "work-row" }, jc = /* @__PURE__ */ $e({
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
    return (t, l) => (n(), b("section", Lc, [
      l[2] || (l[2] = s("h3", { class: "work-row-title" }, "Items in changed states", -1)),
      (n(!0), b(te, null, ne(e.removed, ({ process: o, state: d, count: f }) => (n(), b("label", {
        key: o.id + "/" + d.id,
        class: "work-stack work-tight"
      }, [
        z(" Move " + U(a(f)) + " from " + U(r(we)(d)) + " to ", 1),
        k(r(ue), {
          disabled: e.disabled,
          "model-value": o.map?.[d.id],
          "aria-label": "Move items from " + r(we)(d) + " to",
          placeholder: "Choose a state",
          appendTo: "self",
          optionLabel: "label",
          optionValue: "value",
          options: o.states.map((v) => ({ label: r(we)(v), value: v.id })),
          "onUpdate:modelValue": (v) => t.$emit("destination", o, d.id, v)
        }, null, 8, ["disabled", "model-value", "aria-label", "options", "onUpdate:modelValue"])
      ]))), 128)),
      e.renamed.length ? (n(), b("div", Bc, [
        (n(!0), b(te, null, ne(e.renamed, ({ process: o, state: d, count: f, name: v }) => (n(), b("p", {
          key: o.id + "/" + d.id
        }, [
          z(U(r(we)(d)) + " becomes ", 1),
          s("strong", null, U(v), 1),
          z(" for " + U(a(f)) + ". ", 1)
        ]))), 128)),
        s("label", zc, [
          k(r(Kt), {
            binary: "",
            "model-value": e.confirmed,
            disabled: e.disabled,
            "onUpdate:modelValue": l[0] || (l[0] = (o) => t.$emit("update:confirmed", o))
          }, null, 8, ["model-value", "disabled"]),
          l[1] || (l[1] = z(" Keep these items in their renamed states ", -1))
        ])
      ])) : I("", !0)
    ]));
  }
}), Wc = {
  class: "work-stack",
  "aria-label": "Links editor"
}, qc = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, Gc = { class: "work-definition-meta work-muted work-small" }, Kc = { class: "work-settings-grid" }, Hc = { class: "work-stack work-tight" }, Yc = { class: "work-stack work-tight" }, Xc = { class: "work-stack work-tight" }, Jc = { class: "work-row" }, Zc = {
  key: 0,
  class: "work-muted work-small"
}, Qc = {
  key: 1,
  class: "work-settings-grid"
}, _c = { class: "work-stack work-tight" }, ev = {
  key: 0,
  class: "work-chips"
}, tv = { class: "work-stack work-tight" }, av = { class: "work-relation-preview work-small" }, lv = { class: "work-muted" }, ov = {
  key: 0,
  class: "kx-empty"
}, iv = /* @__PURE__ */ $e({
  __name: "RelationsEditor",
  props: {
    draft: {},
    guardRemoval: { type: Function }
  },
  setup(e) {
    const a = e, t = K(() => a.draft.relation_types ?? []), l = K(() => (a.draft.item_types ?? []).map((V) => ({ value: V.id, label: V.title || Fe(V.id) })));
    function o(V, p, g) {
      g.length ? V[p] = g : delete V[p];
    }
    function d(V, p) {
      if (!/^[a-z][a-z0-9_]{0,39}$/.test(p)) return "Start with a lowercase letter and use only lowercase letters, numbers or underscores.";
      if (V.to_types?.includes(p)) return "This ID is already in use.";
    }
    function f(V, p) {
      o(V, "to_types", [...V.to_types ?? [], p]);
    }
    const v = B(""), c = B(!1);
    function i(V) {
      const p = V.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, ""), g = (/^[a-z]/.test(p) ? p : "link_" + (p || "new")).slice(0, 40);
      let y = g, C = 2;
      for (; t.value.some((T) => T.id === y); ) {
        const T = "_" + C++;
        y = g.slice(0, 40 - T.length) + T;
      }
      return y;
    }
    function u(V) {
      (a.draft.relation_types ??= []).push({ id: i(V), outward: V, inward: V, cardinality: "many" });
    }
    async function m(V) {
      if (!c.value) {
        c.value = !0, v.value = "";
        try {
          const p = await a.guardRemoval?.("relation_types", V);
          p ? v.value = p : Pa(a.draft, "relation_types", V);
        } finally {
          c.value = !1;
        }
      }
    }
    return (V, p) => (n(), b("section", Wc, [
      v.value ? (n(), b("p", qc, U(v.value), 1)) : I("", !0),
      k(nl, {
        columns: "relations",
        count: t.value.length
      }, {
        default: q(() => [
          (n(!0), b(te, null, ne(t.value, (g, y) => (n(), H(il, {
            "route-section": "links",
            "route-id": g.id,
            title: g.outward || r(Fe)(g.id),
            kind: g.symmetric ? "Same both ways" : "Different each way",
            key: y,
            class: "work-stack"
          }, {
            usage: q(() => [
              s("span", Gc, U(g.outward || "Related work") + " · " + U(g.inward || "Reverse relation"), 1)
            ]),
            actions: q(() => [
              k(r(ee), {
                severity: "secondary",
                text: "",
                disabled: c.value,
                onClick: (C) => m(g.id),
                "aria-label": "Remove link type",
                size: "small"
              }, {
                default: q(() => [
                  k(r(de), {
                    icon: "tabler:trash",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["disabled", "onClick"])
            ]),
            default: q(() => [
              s("div", Kc, [
                s("label", Hc, [
                  p[0] || (p[0] = z("Shown on this item ", -1)),
                  k(r(Te), {
                    modelValue: g.outward,
                    "onUpdate:modelValue": (C) => g.outward = C,
                    "aria-label": "Shown on this item"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                s("label", Yc, [
                  p[1] || (p[1] = z("Shown on the other item ", -1)),
                  k(r(Te), {
                    modelValue: g.inward,
                    "onUpdate:modelValue": (C) => g.inward = C,
                    "aria-label": "Shown on the other item"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                s("label", Xc, [
                  p[2] || (p[2] = z("Links allowed ", -1)),
                  k(r(ue), {
                    "model-value": g.cardinality ?? "many",
                    "onUpdate:modelValue": (C) => g.cardinality = C,
                    "aria-label": "Links allowed",
                    appendTo: "self",
                    optionLabel: "label",
                    optionValue: "value",
                    optionDisabled: "disabled",
                    options: [{ label: "One link", value: "one", disabled: !1 }, { label: "Many links", value: "many", disabled: !1 }]
                  }, null, 8, ["model-value", "onUpdate:modelValue"])
                ]),
                s("label", Jc, [
                  k(r(Kt), {
                    modelValue: g.symmetric,
                    "onUpdate:modelValue": (C) => g.symmetric = C,
                    disabled: !!(g.from_types?.length || g.to_types?.length),
                    "aria-label": "Same meaning in both directions",
                    binary: ""
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"]),
                  p[3] || (p[3] = z("Same meaning in both directions ", -1))
                ])
              ]),
              g.from_types?.length || g.to_types?.length ? (n(), b("p", Zc, " Clear the source and target types to use the same meaning in both directions. ")) : I("", !0),
              g.symmetric ? I("", !0) : (n(), b("div", Qc, [
                k(mt, {
                  label: "Source item types",
                  options: l.value,
                  "model-value": g.from_types,
                  "onUpdate:modelValue": (C) => o(g, "from_types", C)
                }, null, 8, ["options", "model-value", "onUpdate:modelValue"]),
                s("div", _c, [
                  p[4] || (p[4] = s("p", { class: "work-muted work-small" }, "Use the type ID from this board or a peer board. Leave either end empty to allow any type there.", -1)),
                  g.to_types?.length ? (n(), b("div", ev, [
                    (n(!0), b(te, null, ne(g.to_types, (C) => (n(), H(r(ee), {
                      key: C,
                      severity: "secondary",
                      text: "",
                      size: "small",
                      label: C + " ×",
                      "aria-label": "Remove target type " + C,
                      onClick: (T) => o(g, "to_types", g.to_types.filter((x) => x !== C))
                    }, null, 8, ["label", "aria-label", "onClick"]))), 128))
                  ])) : I("", !0),
                  k(Ua, {
                    action: "Add target type",
                    label: "Target type ID",
                    maxlength: 40,
                    validate: (C) => d(g, C),
                    onAdd: (C) => f(g, C)
                  }, null, 8, ["validate", "onAdd"])
                ])
              ])),
              k(Ne, {
                class: "work-disclosure",
                label: "Advanced link settings"
              }, {
                default: q(() => [
                  s("label", tv, [
                    p[5] || (p[5] = z("Identifier ", -1)),
                    k(r(Te), {
                      modelValue: g.id,
                      "onUpdate:modelValue": (C) => g.id = C,
                      required: "",
                      pattern: "[a-z][a-z0-9_]*",
                      "aria-label": "Relation ID"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ])
                ]),
                _: 2
              }, 1024),
              s("p", av, [
                p[6] || (p[6] = s("strong", null, "This item", -1)),
                z(" " + U(g.outward || "relates to") + " ", 1),
                p[7] || (p[7] = s("strong", null, "another item", -1)),
                s("span", lv, " · reverse: " + U(g.symmetric ? g.outward : g.inward), 1)
              ])
            ]),
            _: 2
          }, 1032, ["route-id", "title", "kind"]))), 128)),
          t.value.length ? I("", !0) : (n(), b("p", ov, "No link types yet. Add one to connect related work.")),
          k(Ua, {
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
function ci(e) {
  return typeof e.error == "string" ? e.error : e.error?.message;
}
function Do(e, a) {
  const t = ci(e);
  return e.parked ? "Stopped: " + (t ?? "Projection is parked") : t ? "Degraded: " + t : e.bootstrapping ? "Initializing" : e.last_seq >= a ? "Up to date" : "Catching up";
}
function nv(e, a) {
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
  if (o.some(ci)) return { kind: "degraded", status: "Degraded" };
}
const sv = {
  class: "work-stack",
  "aria-label": "Plugins editor"
}, rv = {
  key: 0,
  class: "kx-loading"
}, dv = {
  key: 1,
  class: "kx-err",
  role: "alert"
}, uv = {
  key: 2,
  class: "work-notice",
  role: "status"
}, cv = { class: "work-block work-small work-error" }, vv = {
  key: 0,
  class: "work-muted work-small"
}, fv = {
  key: 1,
  class: "work-notice"
}, mv = {
  key: 2,
  class: "work-stack work-tight work-plugin-status"
}, pv = {
  key: 0,
  class: "work-muted"
}, bv = { key: 1 }, hv = {
  key: 2,
  class: "work-row"
}, gv = {
  key: 3,
  class: "work-row"
}, kv = {
  key: 0,
  class: "work-small"
}, yv = {
  key: 6,
  class: "work-row"
}, wv = {
  key: 7,
  class: "work-row"
}, Vv = {
  key: 8,
  class: "work-row"
}, $v = { class: "work-stack work-tight" }, xv = { key: 0 }, Cv = { key: 1 }, Sv = { key: 2 }, Tv = {
  key: 4,
  class: "work-stack work-tight"
}, Iv = {
  key: 0,
  class: "work-muted"
}, Dv = { class: "work-form-actions" }, Uv = "kickside.work.planning:plugin", Uo = /* @__PURE__ */ $e({
  __name: "PluginsEditor",
  props: /* @__PURE__ */ co({
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
  emits: /* @__PURE__ */ co(["configured", "refresh", "review", "validity"], ["update:activeConfigs"]),
  setup(e, { emit: a }) {
    const t = e, l = a, o = Ui(e, "activeConfigs"), d = B(""), f = B(""), v = B(""), c = B(/* @__PURE__ */ new Set()), i = B({}), u = B(/* @__PURE__ */ new Set()), m = K(() => t.options.map((Y) => {
      const M = G(Y.plugin);
      return { plugin: Y, current: M, issue: nv(Y, M) };
    })), V = K(() => !!d.value || t.disabled), p = K(() => V.value || t.activationLocked), g = {}, y = K(() => (t.draft.item_types ?? []).filter((Y) => !["issue", "sprint", "milestone"].includes(Y.id)).map((Y) => ({ value: Y.id, label: Y.title || Fe(Y.id) }))), C = K(() => ["current_sprint", "milestone"].every((Y) => t.schema.compiled?.fields?.some((M) => M.code === Y))), T = K(() => {
      const Y = t.filters;
      return Y ? (t.draft.scopes ?? []).filter((M) => !Y.some((S) => S.id === M && t.options.some((N) => N.plugin === S.plugin))) : [];
    });
    function x(Y) {
      return (t.filters ?? []).filter((M) => M.plugin === Y);
    }
    function F(Y, M) {
      const S = new Set(x(Y).map((X) => X.id)), N = t.draft.scopes ?? [], A = [...N.filter((X) => !S.has(X)), ...M];
      (A.length !== N.length || A.some((X) => !N.includes(X))) && (t.draft.scopes = A);
    }
    function E(Y, M) {
      oe(Y, { ...se(Y), issue_types: M });
    }
    function Q(Y) {
      return !!Y.config_schema && jo(Y.config_schema).length > 0;
    }
    function G(Y) {
      return t.schema.plugins?.find((M) => M.plugin === Y);
    }
    function _(Y) {
      return G(Y)?.active === !0;
    }
    function re(Y) {
      return t.draft.plugins?.some((M) => M.use === Y) === !0;
    }
    function ce(Y, M) {
      const S = t.draft.plugins ?? [];
      M && !re(Y) && (t.draft.plugins = [...S, { use: Y }]), M || (t.draft.plugins = S.filter((N) => N.use !== Y), delete t.configs[Y], c.value.delete(Y), l("validity", Y, !0), F(Y, []));
    }
    function fe(Y, M) {
      ce(Y, !1), l("review", M.currentTarget);
    }
    function se(Y) {
      return _(Y) ? o.value[Y] ?? G(Y)?.config ?? g : t.configs[Y] ?? g;
    }
    function oe(Y, M) {
      _(Y) ? o.value = { ...o.value, [Y]: M } : t.configs[Y] = M;
    }
    function O(Y) {
      if (_(Y)) {
        const M = { ...o.value };
        delete M[Y], o.value = M;
      } else delete t.configs[Y];
    }
    function ae(Y, M) {
      M ? c.value.delete(Y) : c.value.add(Y), _(Y) || l("validity", Y, M);
    }
    async function L(Y) {
      await qo.confirm({
        header: "Reset projection?",
        message: "Resetting can rebuild from current items or replay retained events, depending on the projection.",
        acceptLabel: "Reset projection",
        rejectLabel: "Cancel"
      }) && await ve(Y, !0);
    }
    async function ve(Y, M = !1) {
      if (!(V.value || !M && c.value.has(Y))) {
        d.value = Y, f.value = "", v.value = "";
        try {
          M ? await Ut.configure(t.boardId, Y) : (await Ut.configure(t.boardId, Y, se(Y)), O(Y), u.value.delete(Y)), v.value = M ? "Plugin recovery started." : "Plugin configuration saved.", l("configured");
        } catch (S) {
          f.value = rt(S, M ? "Could not recover the plugin." : "Could not configure plugin.");
        } finally {
          d.value = "";
        }
      }
    }
    return (Y, M) => (n(), b("section", sv, [
      e.options.length ? I("", !0) : (n(), b("p", rv, "No installed plugins are visible to you.")),
      f.value ? (n(), b("div", dv, U(f.value), 1)) : I("", !0),
      v.value ? (n(), b("p", uv, U(v.value), 1)) : I("", !0),
      k(nl, {
        columns: "plugins",
        count: e.options.length
      }, {
        default: q(() => [
          (n(!0), b(te, null, ne(m.value, ({ plugin: S, current: N, issue: A }) => (n(), H(il, {
            "route-section": "plugins",
            "route-id": S.plugin,
            key: S.plugin,
            title: S.installed === !1 ? S.plugin : S.title || S.plugin,
            description: S.description,
            kind: re(S.plugin) && c.value.has(S.plugin) ? "Configuration needed" : re(S.plugin) !== _(S.plugin) ? "Pending review" : A?.status,
            class: "work-stack"
          }, jl({
            actions: q(() => [
              A?.kind !== "missing" ? (n(), H(r(at), {
                key: 0,
                "model-value": re(S.plugin),
                "aria-label": "Enable " + (S.title || S.plugin),
                disabled: p.value || !!S.problem && !re(S.plugin),
                "onUpdate:modelValue": (X) => ce(S.plugin, X)
              }, null, 8, ["model-value", "aria-label", "disabled", "onUpdate:modelValue"])) : I("", !0)
            ]),
            default: q(() => [
              S.requires.length ? (n(), b("p", vv, "Requires " + U(S.requires.map((X) => e.options.find((h) => h.plugin === X)?.title || "Another capability").join(", ")), 1)) : I("", !0),
              N?.outdated ? (n(), b("p", fv, "The stored declaration differs from the installed plugin. Review activation to update it.")) : I("", !0),
              A || N?.active ? (n(), b("div", mv, [
                A && "cause" in A ? (n(), b("p", pv, U(A.cause), 1)) : A ? I("", !0) : (n(), b("p", bv, U(N?.lifecycle.state === "ready" ? "Ready to use" : "Getting ready"), 1)),
                (n(!0), b(te, null, ne(N?.projections, (X, h) => (n(), b("div", {
                  key: h,
                  class: "work-stack work-tight"
                }, [
                  s("p", null, U(r(Do)(X, e.schema.as_of)) + " · Indexed through " + U(X.last_seq) + " of " + U(e.schema.as_of) + " events.", 1)
                ]))), 128)),
                A?.kind === "setup" && N?.active ? (n(), b("div", hv, [
                  k(r(ee), {
                    label: "Retry setup",
                    severity: "secondary",
                    outlined: "",
                    disabled: V.value,
                    onClick: (X) => ve(S.plugin, !0)
                  }, null, 8, ["disabled", "onClick"])
                ])) : A?.kind === "provider" ? (n(), b("div", gv, [
                  k(r(ee), {
                    label: "Retry schema check",
                    severity: "secondary",
                    outlined: "",
                    disabled: V.value,
                    onClick: M[0] || (M[0] = (X) => l("refresh"))
                  }, null, 8, ["disabled"])
                ])) : A?.kind === "degraded" ? (n(), H(Ne, {
                  key: 4,
                  class: "work-small",
                  label: "Inspect worker"
                }, {
                  default: q(() => [
                    M[1] || (M[1] = s("p", null, "Check the failing worker before resetting a projection.", -1)),
                    (n(!0), b(te, null, ne(N?.projections, (X, h) => (n(), b("p", { key: h }, U(h) + " · " + U(r(Do)(X, e.schema.as_of)), 1))), 128))
                  ]),
                  _: 2
                }, 1024)) : A?.kind === "history" ? (n(), b(te, { key: 5 }, [
                  A.floor !== void 0 ? (n(), b("p", kv, "Earliest retained event sequence is " + U(A.floor) + ".", 1)) : I("", !0),
                  k(Ne, {
                    class: "work-small",
                    label: "Review retained history"
                  }, {
                    default: q(() => [...M[2] || (M[2] = [
                      s("p", null, "Ask the plugin maintainer to review the event projection’s start sequence. The plugin needs a declaration that can run with the retained history.", -1)
                    ])]),
                    _: 1
                  })
                ], 64)) : A?.kind === "reset" ? (n(), b("div", yv, [
                  k(r(ee), {
                    label: "Reset projection",
                    severity: "secondary",
                    outlined: "",
                    disabled: V.value,
                    onClick: (X) => L(S.plugin)
                  }, null, 8, ["disabled", "onClick"]),
                  M[3] || (M[3] = s("span", { class: "work-muted work-small" }, "Resolve the worker error before resetting.", -1))
                ])) : A?.kind === "configuration" && re(S.plugin) && Q(S) && !u.value.has(S.plugin) ? (n(), b("div", wv, [
                  k(r(ee), {
                    label: "Edit configuration",
                    severity: "secondary",
                    outlined: "",
                    disabled: V.value,
                    onClick: (X) => u.value.add(S.plugin)
                  }, null, 8, ["disabled", "onClick"])
                ])) : A?.kind === "missing" && re(S.plugin) ? (n(), b("div", Vv, [
                  k(r(ee), {
                    label: "Review references",
                    severity: "secondary",
                    outlined: "",
                    disabled: p.value,
                    onClick: (X) => fe(S.plugin, X)
                  }, null, 8, ["disabled", "onClick"])
                ])) : I("", !0)
              ])) : I("", !0),
              S.installed ? (n(), H(Ne, {
                key: 3,
                class: "work-disclosure work-small",
                label: "Technical details"
              }, {
                default: q(() => [
                  s("dl", $v, [
                    s("div", null, [
                      M[4] || (M[4] = s("dt", null, "Plugin ID", -1)),
                      s("dd", null, [
                        s("code", null, U(S.plugin), 1)
                      ])
                    ]),
                    (N?.interface_version ?? S.interface_version) != null ? (n(), b("div", xv, [
                      M[5] || (M[5] = s("dt", null, "Interface version", -1)),
                      s("dd", null, U(N?.interface_version ?? S.interface_version), 1)
                    ])) : I("", !0),
                    N?.version ? (n(), b("div", Cv, [
                      M[6] || (M[6] = s("dt", null, "Active schema version", -1)),
                      s("dd", null, U(N.version), 1)
                    ])) : I("", !0),
                    M[8] || (M[8] = s("div", null, [
                      s("dt", null, "Configuration tool"),
                      s("dd", null, [
                        s("code", null, "WorkConfigurePlugin")
                      ])
                    ], -1)),
                    S.tools.length ? (n(), b("div", Sv, [
                      M[7] || (M[7] = s("dt", null, "Plugin tools", -1)),
                      s("dd", null, [
                        (n(!0), b(te, null, ne(S.tools, (X) => (n(), b("code", {
                          key: X,
                          class: "work-block"
                        }, U(X), 1))), 128))
                      ])
                    ])) : I("", !0)
                  ])
                ]),
                _: 2
              }, 1024)) : I("", !0),
              x(S.plugin).length && (re(S.plugin) || _(S.plugin)) ? (n(), b("section", Tv, [
                M[9] || (M[9] = s("h4", null, "Query filters", -1)),
                M[10] || (M[10] = s("p", { class: "work-muted" }, "Choose which filters people can use to narrow down work on this board.", -1)),
                k(mt, {
                  label: "Available filters",
                  disabled: !!d.value || e.disabled || !re(S.plugin),
                  options: x(S.plugin).map((X) => ({ value: X.id, label: X.title })),
                  "model-value": e.draft.scopes?.filter((X) => x(S.plugin).some((h) => h.id === X)),
                  "onUpdate:modelValue": (X) => F(S.plugin, X)
                }, null, 8, ["disabled", "options", "model-value", "onUpdate:modelValue"])
              ])) : I("", !0),
              re(S.plugin) && Q(S) && A?.kind !== "manifest" && A?.kind !== "missing" && (A?.kind !== "configuration" || u.value.has(S.plugin)) ? (n(), H(da(A && A.kind !== "configuration" ? Ne : "div"), {
                key: 5,
                label: A && A.kind !== "configuration" ? "Plugin settings" : void 0,
                class: "work-stack work-tight"
              }, {
                default: q(() => [
                  S.plugin === Uv ? (n(), b(te, { key: 0 }, [
                    C.value ? (n(), H(mt, {
                      key: 1,
                      label: "Plan these item types",
                      options: y.value,
                      "model-value": se(S.plugin).issue_types,
                      disabled: !!d.value || e.disabled,
                      "onUpdate:modelValue": (X) => E(S.plugin, X)
                    }, null, 8, ["options", "model-value", "disabled", "onUpdate:modelValue"])) : (n(), b("p", Iv, "The Planning pack supplies sprint and milestone fields for item types.")),
                    M[11] || (M[11] = s("p", { class: "work-muted" }, "Selected types get Current sprint and Milestone fields.", -1))
                  ], 64)) : (n(), H(zo, {
                    key: 1,
                    disabled: !!d.value || e.disabled,
                    schema: S.config_schema,
                    "model-value": se(S.plugin),
                    "suggest-defaults": "",
                    "onUpdate:modelValue": (X) => oe(S.plugin, X),
                    onValidity: (X) => ae(S.plugin, X),
                    onValidationMessage: (X) => i.value[S.plugin] = X
                  }, null, 8, ["disabled", "schema", "model-value", "onUpdate:modelValue", "onValidity", "onValidationMessage"])),
                  s("div", Dv, [
                    k(r(ee), {
                      label: A ? "Reset form values" : "Reset",
                      severity: "secondary",
                      outlined: "",
                      disabled: !!d.value || e.disabled,
                      onClick: (X) => O(S.plugin)
                    }, null, 8, ["label", "disabled", "onClick"]),
                    _(S.plugin) ? (n(), H(r(ee), {
                      key: 0,
                      label: "Save plugin settings",
                      disabled: !!d.value || e.disabled || c.value.has(S.plugin) || !o.value[S.plugin],
                      loading: d.value === S.plugin,
                      onClick: (X) => ve(S.plugin)
                    }, null, 8, ["disabled", "loading", "onClick"])) : I("", !0)
                  ])
                ]),
                _: 2
              }, 1032, ["label"])) : I("", !0)
            ]),
            _: 2
          }, [
            re(S.plugin) && i.value[S.plugin] ? {
              name: "status",
              fn: q(() => [
                s("span", cv, U(i.value[S.plugin]), 1)
              ]),
              key: "0"
            } : void 0
          ]), 1032, ["route-id", "title", "description", "kind"]))), 128))
        ]),
        _: 1
      }, 8, ["count"]),
      T.value.length ? (n(), H(Ne, {
        key: 3,
        class: "work-settings-card work-disclosure",
        label: "Unavailable query filters"
      }, {
        default: q(() => [
          M[12] || (M[12] = s("p", { class: "work-muted" }, "These filters came from a plugin that is unavailable. Remove one to stop using it on this board.", -1)),
          (n(!0), b(te, null, ne(T.value, (S, N) => (n(), H(r(ee), {
            key: S,
            label: "Remove unavailable filter " + (N + 1),
            severity: "secondary",
            text: "",
            onClick: (A) => e.draft.scopes = e.draft.scopes?.filter((X) => X !== S)
          }, null, 8, ["label", "onClick"]))), 128))
        ]),
        _: 1
      })) : I("", !0),
      (n(!0), b(te, null, ne(e.draft.plugins?.filter((S) => !e.options.some((N) => N.plugin === S.use)) ?? [], (S) => (n(), b("article", {
        key: S.use,
        class: "work-settings-card work-stack"
      }, [
        s("p", null, [
          s("strong", null, U(S.use), 1),
          M[13] || (M[13] = z(" · Not installed", -1))
        ]),
        M[14] || (M[14] = s("p", { class: "work-muted" }, "This board still references a plugin that is no longer installed.", -1)),
        k(r(ee), {
          label: "Review references",
          severity: "secondary",
          outlined: "",
          disabled: p.value,
          onClick: (N) => fe(S.use, N)
        }, null, 8, ["disabled", "onClick"])
      ]))), 128))
    ]));
  }
}), Ev = { class: "system-section-head" }, Av = { class: "system-section-head-text" }, Pv = {
  key: 0,
  class: "kx-head-actions"
}, Ov = /* @__PURE__ */ $e({
  __name: "SettingsSectionHead",
  props: {
    title: {},
    description: {}
  },
  setup(e) {
    return (a, t) => (n(), b("header", Ev, [
      s("div", Av, [
        s("h1", null, U(e.title), 1),
        s("p", null, U(e.description), 1)
      ]),
      a.$slots.actions ? (n(), b("div", Pv, [
        Qe(a.$slots, "actions")
      ])) : I("", !0)
    ]));
  }
}), Rv = /* @__PURE__ */ $e({
  __name: "SettingsDraftActions",
  props: {
    busy: { type: Boolean },
    discardDisabled: { type: Boolean },
    reviewDisabled: { type: Boolean }
  },
  emits: ["discard", "review"],
  setup(e) {
    return (a, t) => (n(), b(te, null, [
      k(r(lt), {
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
          k(r(de), {
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
}), Nv = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, Mv = ["config"], Fv = /* @__PURE__ */ $e({
  __name: "BoardShare",
  props: {
    board: {},
    busy: { type: Boolean }
  },
  emits: ["shared"],
  setup(e) {
    const a = e, t = B(!1), l = B(!1), o = B("");
    async function d() {
      const v = a.board;
      if (!(a.busy || l.value)) {
        l.value = !0, o.value = "";
        try {
          const c = await Rt("kickside-share");
          if (a.board.board_id !== v.board_id) return;
          c ? t.value = !0 : o.value = "Sharing is unavailable. Try opening it again.";
        } finally {
          l.value = !1;
        }
      }
    }
    Se(() => a.board.board_id, () => {
      t.value = !1, o.value = "";
    });
    const f = K(() => {
      const v = encodeURIComponent(a.board.board_id);
      return JSON.stringify({
        resource_id: a.board.board_id,
        title: a.board.title,
        access_url: "/api/v1/component-access/grants/" + v,
        share_url: "/api/v1/component-access/share/" + v
      });
    });
    return (v, c) => (n(), b(te, null, [
      k(r(ee), {
        label: "Share board",
        severity: "secondary",
        outlined: "",
        loading: l.value,
        disabled: e.busy,
        onClick: d
      }, {
        icon: q(() => [
          k(r(de), {
            icon: "tabler:share",
            "aria-hidden": "true"
          })
        ]),
        _: 1
      }, 8, ["loading", "disabled"]),
      o.value ? (n(), b("p", Nv, U(o.value), 1)) : I("", !0),
      t.value ? (n(), b("kickside-share", {
        key: 1,
        config: f.value,
        onClose: c[0] || (c[0] = (i) => t.value = !1),
        onChanged: c[1] || (c[1] = (i) => v.$emit("shared"))
      }, null, 40, Mv)) : I("", !0)
    ], 64));
  }
}), Lv = {
  class: "work-stack",
  "aria-label": "Board visibility"
}, Bv = { class: "work-stack work-tight" }, zv = {
  key: 0,
  class: "work-settings-list"
}, jv = { class: "work-row-main" }, Wv = { class: "work-small work-muted" }, qv = { class: "work-row-control" }, Gv = { class: "work-row" }, Kv = /* @__PURE__ */ $e({
  __name: "VisibilityEditor",
  props: {
    draft: {},
    boardId: {}
  },
  emits: ["validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = K(() => t.draft.visibility), d = K(() => (t.draft.fields ?? []).filter((m) => m.form === "text" && (!m.cardinality || m.cardinality === "one") && m.type !== "rollup" && m.index !== "number" && m.config?.case !== "insensitive")), f = K(() => d.value.find((m) => m.code === o.value?.field)?.type !== "option");
    function v(m) {
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
      const V = d.value.find((p) => p.code === m);
      t.draft.visibility = { field: m, levels: (V?.options ?? []).map((p) => ({ id: p.id, holders: [] })) };
    }
    function u(m, V) {
      const p = o.value?.levels.find((g) => g.id === m);
      p && (p.holders = V ?? []);
    }
    return (m, V) => (n(), b("section", Lv, [
      V[7] || (V[7] = s("h3", { class: "work-group-title" }, "Board visibility", -1)),
      V[8] || (V[8] = s("p", { class: "work-small work-muted" }, "Restrict items by their visibility level. People still need access to the board.", -1)),
      s("label", Bv, [
        V[5] || (V[5] = z("Visibility field ", -1)),
        k(r(ue), {
          "aria-label": "Visibility field",
          "model-value": o.value?.field ?? "",
          options: [{ label: "No additional restriction", value: "" }, ...d.value.map((p) => ({ label: r(Je)(p), value: p.code }))],
          optionLabel: "label",
          optionValue: "value",
          appendTo: "self",
          "onUpdate:modelValue": i
        }, null, 8, ["model-value", "options"])
      ]),
      o.value ? (n(), b(te, { key: 0 }, [
        o.value.levels.length ? (n(), b("div", zv, [
          (n(!0), b(te, null, ne(o.value.levels, (p, g) => (n(), b("div", {
            key: p.id,
            class: "work-settings-row"
          }, [
            s("div", jv, [
              s("strong", null, U(d.value.find((y) => y.code === o.value.field)?.options?.find((y) => y.id === p.id)?.label || p.id), 1),
              s("p", Wv, "Level " + U(g + 1), 1)
            ]),
            s("div", qv, [
              k(Yo, {
                "board-id": e.boardId,
                label: "Who can see these items",
                "model-value": p.holders,
                "onUpdate:modelValue": (y) => u(p.id, y),
                onValidity: V[0] || (V[0] = (y) => l("validity", y))
              }, null, 8, ["board-id", "model-value", "onUpdate:modelValue"])
            ])
          ]))), 128))
        ])) : I("", !0),
        f.value ? (n(), H(Ua, {
          key: o.value.field,
          action: "Add level",
          label: "New visibility level",
          validate: v,
          onAdd: c
        })) : I("", !0),
        s("label", Gv, [
          k(r(at), {
            "model-value": o.value.bypass === "admin",
            "onUpdate:modelValue": V[1] || (V[1] = (p) => p ? o.value.bypass = "admin" : delete o.value.bypass)
          }, null, 8, ["model-value"]),
          V[6] || (V[6] = z(" Board administrators can see every level ", -1))
        ]),
        k(r(ee), {
          label: "Remove visibility restriction",
          severity: "secondary",
          text: "",
          onClick: V[2] || (V[2] = (p) => delete e.draft.visibility)
        })
      ], 64)) : I("", !0),
      k(Nt, {
        label: "Visibility rules",
        "model-value": o.value,
        shape: "object",
        example: { field: "visibility", levels: [{ id: "internal", holders: [] }], bypass: "admin" },
        "onUpdate:modelValue": V[3] || (V[3] = (p) => e.draft.visibility = p),
        onValidity: V[4] || (V[4] = (p) => l("validity", p))
      }, null, 8, ["model-value"])
    ]));
  }
}), Hv = { class: "work-ia-section" }, Yv = {
  class: "work-settings-list",
  "aria-labelledby": "work-sharing-title"
}, Xv = { class: "work-settings-row" }, Jv = { class: "work-row-main" }, Zv = {
  key: 0,
  class: "work-muted work-small"
}, Qv = {
  key: 0,
  class: "work-member-preview",
  "aria-label": "People and groups with direct access"
}, _v = { class: "work-spacer" }, ef = {
  key: 1,
  class: "work-settings-row work-muted work-small"
}, tf = {
  key: 2,
  class: "work-settings-row work-muted"
}, af = {
  key: 3,
  class: "work-settings-row"
}, lf = {
  key: 4,
  class: "work-settings-row work-muted",
  role: "status"
}, of = /* @__PURE__ */ $e({
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
    const a = e, t = B(), l = B([]), o = K(() => t.value?.filter((g) => g.subject_type === "group").length ?? 0), d = K(() => (t.value?.length ?? 0) - o.value), f = K(() => [...t.value ?? []].sort((g, y) => +!!y.owner - +!!g.owner || y.access_mask - g.access_mask).slice(0, 6).map((g) => ({ ...g, permissions: u(g) }))), v = K(() => f.value.map((g) => ({ id: g.subject_id, kind: g.subject_type ?? "user" }))), c = Wo(() => a.boardId, v);
    function i(g) {
      return g.full_name || c.label({ id: g.subject_id, kind: g.subject_type ?? "user", email: g.email });
    }
    function u(g) {
      return g.owner ? "Owner" : l.value.filter((y) => (g.access_mask & y.bit) === y.bit).map((y) => y.label).join(", ");
    }
    const m = B(!1), V = xa();
    async function p() {
      const g = V();
      m.value = !1;
      try {
        const [{ data: y }, C] = await Promise.all([
          Ol.get("/api/v1/component-access/grants/" + encodeURIComponent(a.boardId)),
          Ol.get("/api/v1/components/access-model")
        ]);
        if (!g()) return;
        if (!y?.success || !Array.isArray(y.access)) throw new Error("Grants unavailable");
        t.value = y.access, l.value = C.data?.success && Array.isArray(C.data.capabilities) ? C.data.capabilities : [];
      } catch {
        g() && (t.value = void 0, m.value = !0);
      }
    }
    return ql(() => V()), Se(() => [a.active, a.boardId], () => {
      a.active && p();
    }, { immediate: !0 }), (g, y) => (n(), b("section", Hv, [
      s("section", Yv, [
        s("div", Xv, [
          s("div", Jv, [
            y[1] || (y[1] = s("h3", {
              id: "work-sharing-title",
              class: "work-row-title"
            }, "Members and sharing", -1)),
            t.value ? (n(), b("p", Zv, U(d.value) + " " + U(d.value === 1 ? "person" : "people") + " and " + U(o.value) + " " + U(o.value === 1 ? "group" : "groups") + " with direct access", 1)) : I("", !0)
          ]),
          e.board ? (n(), H(Fv, {
            key: 0,
            board: e.board,
            busy: e.busy,
            onShared: p
          }, null, 8, ["board", "busy"])) : I("", !0)
        ]),
        f.value.length ? (n(), b("ul", Qv, [
          (n(!0), b(te, null, ne(f.value, (C) => (n(), b("li", {
            key: C.subject_type + C.subject_id,
            class: "work-settings-row"
          }, [
            k(r(de), {
              icon: C.subject_type === "group" ? "tabler:users" : "tabler:user",
              "aria-hidden": "true"
            }, null, 8, ["icon"]),
            s("strong", _v, U(i(C)), 1),
            C.permissions ? (n(), H(r(lt), {
              key: 0,
              class: "kx-tag-sm",
              severity: "secondary",
              value: C.permissions
            }, null, 8, ["value"])) : I("", !0)
          ]))), 128))
        ])) : I("", !0),
        t.value && t.value.length > f.value.length ? (n(), b("p", ef, " See all " + U(t.value.length) + " people and groups under Share board. ", 1)) : t.value && !t.value.length ? (n(), b("p", tf, "No direct grants yet.")) : m.value ? (n(), b("div", af, [
          y[2] || (y[2] = s("p", {
            class: "work-spacer work-muted",
            role: "alert"
          }, "Member summary is unavailable.", -1)),
          k(r(ee), {
            label: "Reload members",
            severity: "secondary",
            text: "",
            onClick: p
          })
        ])) : t.value ? I("", !0) : (n(), b("p", lf, "Loading members…"))
      ]),
      k(Ne, {
        class: "work-disclosure",
        label: e.draft.visibility ? "Advanced · Item visibility rules set" : "Advanced · Item visibility"
      }, {
        default: q(() => [
          k(Kv, {
            "board-id": e.boardId,
            draft: e.draft,
            onValidity: y[0] || (y[0] = (C) => g.$emit("validity", C))
          }, null, 8, ["board-id", "draft"])
        ]),
        _: 1
      }, 8, ["label"])
    ]));
  }
}), nf = { class: "work-settings-row" }, sf = ["for"], rf = { class: "work-settings-row" }, df = { class: "work-row-main" }, uf = ["id"], cf = { class: "work-settings-grid" }, vf = { class: "work-stack work-tight" }, ff = { class: "work-stack work-tight" }, mf = ["value", "inert"], pf = {
  key: 1,
  class: "work-muted work-small"
}, bf = {
  key: 0,
  class: "work-settings-row"
}, hf = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, gf = {
  key: 1,
  class: "work-muted work-small",
  role: "status"
}, kf = {
  key: 1,
  class: "work-board-identity work-stack work-tight"
}, yf = { class: "work-stack work-tight" }, wf = { class: "work-stack work-tight" }, Vf = { class: "work-stack work-tight" }, $f = ["value", "inert"], xf = {
  key: 1,
  class: "work-muted work-small"
}, Cf = { class: "work-row" }, Sf = { class: "work-row" }, Tf = { class: "work-row work-board-title" }, If = {
  key: 1,
  class: "work-identity-actions"
}, Df = ["title"], Uf = {
  key: 2,
  class: "kx-err work-inline",
  role: "alert"
}, Ef = {
  key: 3,
  class: "work-muted work-small",
  role: "status"
}, Af = /* @__PURE__ */ $e({
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
    const t = e, l = a, o = B(!1), d = B(!1), f = B(""), v = B(""), c = B(""), i = B(""), u = B(!1), m = B(!1), V = B(""), p = B(""), g = K(() => t.board?.access?.admin === !0), y = Ht(), C = Ht(), T = B({ title: "", description: "", icon: "", app: "" }), x = K(() => [
      { id: "", title: "Default app" },
      ...t.boardApps ?? [],
      ...t.board?.ui_app && !t.boardApps?.some((O) => O.id === t.board?.ui_app) ? [{ id: t.board.ui_app, title: t.boardApps ? "Unavailable app" : "Configured board app", disabled: !0 }] : []
    ]), F = K(() => x.value.find((O) => O.id === i.value)?.title), E = K(() => !!t.boardApps?.length || !!t.board?.ui_app), Q = K(() => ({
      title: t.board?.title ?? "",
      icon: t.board?.icon ?? "",
      description: t.board?.description ?? "",
      app: t.board?.ui_app ?? ""
    }));
    function G() {
      T.value = Q.value, f.value = Q.value.title, c.value = Q.value.icon, v.value = Q.value.description, i.value = Q.value.app;
    }
    function _() {
      Rt("wc-icon-picker").then((O) => u.value = O);
    }
    function re() {
      G(), V.value = "", p.value = "", o.value = !0, _();
    }
    const ce = K(() => {
      const O = {};
      return f.value.trim() !== T.value.title && (O.title = f.value.trim()), v.value !== T.value.description && (O.description = v.value), c.value !== T.value.icon && (O.icon = c.value), i.value !== T.value.app && (O.ui_app = i.value), O;
    }), fe = K(() => (t.detail || o.value) && Object.keys(ce.value).length > 0);
    Se(Q, () => {
      t.detail && !fe.value && G();
    }, { immediate: !0 }), Se(d, (O) => {
      O && _();
    }), Se(g, (O) => {
      O || se();
    }), Se(fe, (O) => l("dirty-change", O));
    function se() {
      o.value = !1, V.value = "", p.value = "", G();
    }
    async function oe() {
      if (!g.value || !t.board || m.value || !f.value.trim()) return;
      const O = ce.value;
      if (!Object.keys(O).length) {
        o.value = !1, p.value = "Nothing changed.";
        return;
      }
      m.value = !0, V.value = "";
      try {
        const ae = await Pt.updateBoard(t.board.board_id, O);
        f.value = f.value.trim(), T.value = { title: f.value, description: v.value, icon: c.value, app: i.value }, o.value = !1, p.value = ae.status === "unchanged" ? "Nothing changed." : "Board saved.", l("saved");
      } catch (ae) {
        V.value = rt(ae, "Could not save the board.");
      } finally {
        m.value = !1;
      }
    }
    return (O, ae) => e.detail ? (n(), b("form", {
      key: 0,
      class: "work-board-identity",
      "aria-label": "Edit board details",
      onSubmit: Re(oe, ["prevent"])
    }, [
      s("div", nf, [
        s("label", {
          for: r(y),
          class: "work-row-main work-row-title"
        }, "Board name", 8, sf),
        k(r(Te), {
          id: r(y),
          modelValue: f.value,
          "onUpdate:modelValue": ae[0] || (ae[0] = (L) => f.value = L),
          required: "",
          disabled: m.value || !g.value
        }, null, 8, ["id", "modelValue", "disabled"])
      ]),
      s("div", rf, [
        s("div", df, [
          s("h3", {
            class: "work-row-title",
            id: r(C)
          }, "Board app", 8, uf),
          ae[9] || (ae[9] = s("p", { class: "work-muted work-small" }, "Opens the board from Work navigation.", -1))
        ]),
        k(r(ue), {
          modelValue: i.value,
          "onUpdate:modelValue": ae[1] || (ae[1] = (L) => i.value = L),
          "aria-labelledby": r(C),
          options: x.value,
          placeholder: F.value,
          optionLabel: "title",
          optionValue: "id",
          optionDisabled: "disabled",
          appendTo: "self",
          disabled: m.value || !g.value || !E.value
        }, null, 8, ["modelValue", "aria-labelledby", "options", "placeholder", "disabled"])
      ]),
      Qe(O.$slots, "default"),
      k(Ne, {
        open: d.value,
        "onUpdate:open": ae[4] || (ae[4] = (L) => d.value = L),
        class: "work-board-appearance",
        label: "Board description and icon"
      }, {
        default: q(() => [
          s("div", cf, [
            s("label", vf, [
              ae[10] || (ae[10] = z("Description", -1)),
              k(r(Ea), {
                modelValue: v.value,
                "onUpdate:modelValue": ae[2] || (ae[2] = (L) => v.value = L),
                rows: "1",
                disabled: m.value || !g.value
              }, null, 8, ["modelValue", "disabled"])
            ]),
            s("div", ff, [
              ae[11] || (ae[11] = s("span", null, "Board icon", -1)),
              u.value ? (n(), b("wc-icon-picker", {
                key: 0,
                value: c.value,
                fallback: "tabler:layout-kanban",
                inert: m.value || !g.value || void 0,
                onSelect: ae[3] || (ae[3] = (L) => c.value = L.detail)
              }, null, 40, mf)) : (n(), b("p", pf, "The icon picker is unavailable."))
            ])
          ])
        ]),
        _: 1
      }, 8, ["open"]),
      fe.value || V.value || p.value ? (n(), b("div", bf, [
        V.value ? (n(), b("p", hf, U(V.value), 1)) : p.value && !fe.value ? (n(), b("p", gf, U(p.value), 1)) : I("", !0),
        fe.value ? (n(), b(te, { key: 2 }, [
          k(r(ee), {
            label: "Save board details",
            type: "submit",
            size: "small",
            disabled: !f.value.trim() || m.value || !g.value,
            loading: m.value
          }, null, 8, ["disabled", "loading"]),
          k(r(ee), {
            label: "Cancel",
            type: "button",
            severity: "secondary",
            text: "",
            size: "small",
            disabled: m.value,
            onClick: se
          }, null, 8, ["disabled"])
        ], 64)) : I("", !0)
      ])) : I("", !0)
    ], 32)) : (n(), b("div", kf, [
      o.value ? (n(), b("form", {
        key: 0,
        class: "work-identity-edit",
        "aria-label": "Edit board",
        onClick: ae[8] || (ae[8] = Re(() => {
        }, ["stop"])),
        onSubmit: Re(oe, ["prevent"])
      }, [
        s("label", yf, [
          ae[12] || (ae[12] = z("Title", -1)),
          k(r(Te), {
            modelValue: f.value,
            "onUpdate:modelValue": ae[5] || (ae[5] = (L) => f.value = L),
            required: "",
            autofocus: "",
            disabled: m.value
          }, null, 8, ["modelValue", "disabled"])
        ]),
        s("label", wf, [
          ae[13] || (ae[13] = z("Description", -1)),
          k(r(Ea), {
            modelValue: v.value,
            "onUpdate:modelValue": ae[6] || (ae[6] = (L) => v.value = L),
            rows: "1",
            disabled: m.value
          }, null, 8, ["modelValue", "disabled"])
        ]),
        s("div", Vf, [
          ae[14] || (ae[14] = s("span", null, "Board icon", -1)),
          u.value ? (n(), b("wc-icon-picker", {
            key: 0,
            value: c.value,
            fallback: "tabler:layout-kanban",
            inert: m.value || void 0,
            onSelect: ae[7] || (ae[7] = (L) => c.value = L.detail)
          }, null, 40, $f)) : (n(), b("p", xf, "The icon picker is unavailable."))
        ]),
        s("div", Cf, [
          k(r(ee), {
            label: "Save",
            severity: "secondary",
            type: "submit",
            disabled: !f.value.trim() || m.value,
            loading: m.value,
            outlined: ""
          }, {
            icon: q(() => [
              k(r(de), {
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
            onClick: se,
            outlined: ""
          }, {
            icon: q(() => [
              k(r(de), {
                icon: "tabler:x",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled"])
        ])
      ], 32)) : (n(), b(te, { key: 1 }, [
        s("div", Sf, [
          s("div", Tf, [
            e.board?.icon ? (n(), H(r(de), {
              key: 0,
              icon: e.board.icon,
              "aria-hidden": "true"
            }, null, 8, ["icon"])) : I("", !0),
            (n(), H(da(e.compact ? "h2" : "h1"), {
              class: ft(e.compact ? "kx-card-name" : "kx-title")
            }, {
              default: q(() => [
                z(U(e.board?.title || "Untitled board"), 1)
              ]),
              _: 1
            }, 8, ["class"]))
          ]),
          e.compact ? Qe(O.$slots, "title-end", {}, void 0, void 0, 0) : I("", !0),
          e.compact ? (n(), b("span", If, [
            g.value ? (n(), H(r(ee), {
              key: 0,
              severity: "secondary",
              text: "",
              size: "small",
              onClick: Re(re, ["stop"]),
              "aria-label": "Edit board"
            }, {
              default: q(() => [
                k(r(de), {
                  icon: "tabler:pencil",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            })) : I("", !0),
            Qe(O.$slots, "actions")
          ])) : g.value ? (n(), H(r(ee), {
            key: 2,
            severity: "secondary",
            text: "",
            size: "small",
            onClick: Re(re, ["stop"]),
            "aria-label": "Edit board"
          }, {
            default: q(() => [
              k(r(de), {
                icon: "tabler:pencil",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          })) : I("", !0),
          e.compact ? I("", !0) : Qe(O.$slots, "title-end", {}, void 0, void 0, 3)
        ]),
        !e.compact && (e.subtitle || e.board?.description) ? (n(), b("p", {
          key: 0,
          class: "kx-head-sub",
          title: e.subtitle || e.board?.description
        }, U(e.subtitle || e.board?.description), 9, Df)) : I("", !0)
      ], 64)),
      V.value ? (n(), b("p", Uf, U(V.value), 1)) : I("", !0),
      p.value ? (n(), b("p", Ef, U(p.value), 1)) : I("", !0)
    ]));
  }
}), Pf = { class: "work-ia-section work-ia-general" }, Of = {
  class: "work-settings-list work-board-details",
  "aria-label": "Board details"
}, Rf = {
  key: 0,
  class: "work-settings-row"
}, Nf = { class: "work-settings-row" }, Mf = { class: "work-row-main" }, Ff = ["for"], Lf = { class: "work-muted work-small" }, Bf = {
  class: "work-board-summary work-row work-wrap work-small",
  "aria-label": "Board summary"
}, zf = { class: "work-muted" }, jf = { key: 0 }, Wf = { key: 1 }, qf = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, Gf = {
  key: 0,
  class: "work-stack work-tight"
}, Kf = {
  key: 0,
  class: "work-stack work-tight"
}, Hf = {
  key: 1,
  class: "work-muted"
}, Yf = { class: "work-stack work-tight" }, Xf = { class: "work-spacer" }, Jf = /* @__PURE__ */ $e({
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
    const a = e, t = Ht(), l = {
      comments_per_item: "Comments per item",
      audit: "Change history",
      audit_days: "Change history retention",
      interval_days: "Time-in-state history retention",
      trash_days: "Trash retention",
      tombstone_days: "Deletion record retention"
    }, o = K(() => Object.keys(l).filter((p) => a.draft.policy?.[p] !== void 0));
    function d(p) {
      const g = a.draft.policy?.[p];
      return p === "audit" ? g === "off" ? "Off" : "Track field changes" : p === "comments_per_item" ? g : g === 0 ? p === "audit_days" || p === "interval_days" ? "365 days" : "Clean up immediately" : g === 1 ? "1 day" : g + " days";
    }
    const f = B(), v = B(!1);
    let c = "";
    Se([() => a.active, () => a.board?.board_id, () => a.schema.generation], async ([p, g, y], C, T) => {
      if (!p || !g || c === g + "/" + y) return;
      f.value = void 0, v.value = !1;
      let x = !0;
      T(() => x = !1);
      try {
        const F = await Promise.all(Array.from(
          { length: Math.min(3, Math.max(0, y - 1)) },
          (E, Q) => Pt.schema(g, y - Q - 1)
        ));
        x && (f.value = F, c = g + "/" + y);
      } catch {
        x && (v.value = !0);
      }
    }, { immediate: !0 });
    function i(p) {
      return JSON.stringify(p, (g, y) => y && typeof y == "object" && !Array.isArray(y) ? Object.fromEntries(Object.entries(y).sort(([C], [T]) => C.localeCompare(T))) : y);
    }
    function u(p, g) {
      if (!g) return ["Initial board setup"];
      const y = p.declaration, C = g.declaration, T = [], x = [
        ["Fields", y.fields, C.fields],
        ["Item types", y.item_types, C.item_types],
        ["Workflow", y.processes, C.processes],
        ["Links", y.relation_types, C.relation_types],
        ["Plugins and filters", [y.plugins, y.scopes], [C.plugins, C.scopes]],
        ["Item visibility", y.visibility, C.visibility],
        ["Board rules", y.policy, C.policy],
        ["Starting pack", p.pack, g.pack],
        ["Item key prefix", p.key_prefix, g.key_prefix]
      ];
      if (i(y.fields) !== i(C.fields)) {
        const E = y.fields?.filter((Q) => !C.fields?.some((G) => G.code === Q.code)) ?? [];
        E.length === 1 && T.push("Added " + Je(E[0]));
      }
      const F = x.filter(([, E, Q]) => i(E) !== i(Q)).map(([E]) => E).filter((E) => E !== "Fields" || !T.length);
      return F.length && T.push(F.join(", ") + " updated"), T.length ? T : ["Board setup updated"];
    }
    const m = B(!1), V = K(() => {
      if (!f.value || a.schema.generation < 1) return [];
      const p = [a.schema, ...f.value];
      return p.slice(0, 3).map((g, y) => u(g, p[y + 1]));
    });
    return (p, g) => (n(), b("section", Pf, [
      s("section", Of, [
        e.board ? (n(), b("div", Rf, [
          g[8] || (g[8] = s("div", { class: "work-row-main" }, [
            s("h3", { class: "work-row-title" }, "Board access"),
            s("p", { class: "work-muted work-small" }, "Give people and groups access to this board.")
          ], -1)),
          s("div", null, [
            k(r(ee), {
              label: "Share board",
              type: "button",
              severity: "secondary",
              outlined: "",
              onClick: g[0] || (g[0] = (y) => p.$emit("share"))
            }, {
              icon: q(() => [
                k(r(de), {
                  icon: "tabler:share",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            })
          ])
        ])) : I("", !0),
        (n(), H(Af, {
          key: e.board?.board_id,
          board: e.board,
          "board-apps": e.boardApps,
          detail: "",
          onDirtyChange: g[2] || (g[2] = (y) => p.$emit("dirty-change", y)),
          onSaved: g[3] || (g[3] = (y) => p.$emit("saved"))
        }, {
          default: q(() => [
            s("div", Nf, [
              s("div", Mf, [
                s("label", {
                  class: "work-row-title",
                  for: r(t)
                }, "Item key prefix", 8, Ff),
                s("p", Lf, "Shown on items, for example " + U(e.draft.key_prefix || "WORK") + "-1.", 1)
              ]),
              k(r(Te), {
                id: r(t),
                modelValue: e.draft.key_prefix,
                "onUpdate:modelValue": g[1] || (g[1] = (y) => e.draft.key_prefix = y),
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
      s("section", Bf, [
        s("p", zf, [
          e.board?.open_count !== void 0 && e.board.item_count !== void 0 ? (n(), b("span", jf, U(e.board.open_count) + " open · " + U(e.board.item_count) + " total · ", 1)) : I("", !0),
          z(" " + U(e.packTitle || "No pack installed"), 1),
          e.outdated ? (n(), b("span", Wf, " · Update available")) : I("", !0)
        ]),
        e.packError ? (n(), b("p", qf, U(e.packError), 1)) : I("", !0),
        e.packError ? (n(), H(r(ee), {
          key: 1,
          label: "Reload packs",
          severity: "secondary",
          outlined: "",
          size: "small",
          onClick: g[4] || (g[4] = (y) => p.$emit("retry"))
        })) : I("", !0),
        e.packTitle ? e.outdated ? (n(), H(r(ee), {
          key: 3,
          label: "Update pack",
          severity: "secondary",
          outlined: "",
          size: "small",
          disabled: !e.canUpgrade,
          title: e.upgradeReason,
          onClick: g[6] || (g[6] = (y) => p.$emit("upgrade"))
        }, null, 8, ["disabled", "title"])) : I("", !0) : (n(), H(r(ee), {
          key: 2,
          label: "Install pack",
          severity: "secondary",
          outlined: "",
          size: "small",
          disabled: !e.canInstall,
          onClick: g[5] || (g[5] = (y) => p.$emit("install"))
        }, null, 8, ["disabled"]))
      ]),
      e.schema.pack ? (n(), H(Ne, {
        key: 0,
        open: m.value,
        "onUpdate:open": g[7] || (g[7] = (y) => m.value = y),
        class: "work-disclosure work-small",
        label: "Technical details"
      }, {
        default: q(() => [
          m.value ? (n(), b("dl", Gf, [
            s("div", null, [
              g[9] || (g[9] = s("dt", null, "Pack ID", -1)),
              s("dd", null, [
                s("code", null, U(e.schema.pack.id), 1)
              ])
            ]),
            s("div", null, [
              g[10] || (g[10] = s("dt", null, "Pack version", -1)),
              s("dd", null, U(e.schema.pack.version), 1)
            ]),
            g[11] || (g[11] = s("div", null, [
              s("dt", null, "Pack tools"),
              s("dd", null, [
                s("code", null, "WorkPackPlan"),
                z(", "),
                s("code", null, "WorkPackApply")
              ])
            ], -1))
          ])) : I("", !0)
        ]),
        _: 1
      }, 8, ["open"])) : I("", !0),
      k(Ne, {
        class: "work-disclosure",
        label: "Recent setup changes"
      }, {
        default: q(() => [
          V.value.length ? (n(), b("ul", Kf, [
            (n(!0), b(te, null, ne(V.value, (y, C) => (n(), b("li", { key: C }, U(y.join(" · ")), 1))), 128))
          ])) : (n(), b("p", Hf, U(v.value ? "Recent changes are unavailable." : f.value ? "No setup changes yet." : "Loading recent changes…"), 1))
        ]),
        _: 1
      }),
      o.value.length ? (n(), H(Ne, {
        key: 1,
        class: "work-settings-card work-disclosure",
        label: "Advanced · Existing board overrides"
      }, {
        default: q(() => [
          g[12] || (g[12] = s("p", { class: "work-muted" }, "Clear an override to use the Work application default.", -1)),
          s("ul", Yf, [
            (n(!0), b(te, null, ne(o.value, (y) => (n(), b("li", {
              key: y,
              class: "work-row work-wrap"
            }, [
              s("span", Xf, U(l[y]) + " · " + U(d(y)), 1),
              k(r(ee), {
                label: "Use default for " + l[y].toLowerCase(),
                disabled: e.disabled,
                size: "small",
                text: "",
                onClick: (C) => delete e.draft.policy[y]
              }, null, 8, ["label", "disabled", "onClick"])
            ]))), 128))
          ])
        ]),
        _: 1
      })) : I("", !0)
    ]));
  }
}), We = (e, a) => `${e} → ${a}`, Eo = (e, a) => {
  const t = e.fields?.find((l) => l.code === a);
  return t ? Je(t) : "Untitled field";
}, Ao = {
  comments_per_item: "Comments per item",
  stage_timeout: "Default attempt timeout",
  stage_max_visits: "Default maximum visits",
  audit: "Audit trail",
  audit_days: "Audit history",
  trash_days: "Keep trashed items",
  tombstone_days: "Keep deletion records",
  interval_days: "Keep state history"
};
function Po(e, a) {
  if (a === void 0) return "Application default";
  if (e === "audit") return Fe(String(a));
  if (e === "stage_timeout") {
    const t = Va(String(a));
    if (t) return `${t.amount.toLocaleString()} ${t.amount === 1 ? t.unit.slice(0, -1) : t.unit}`;
  }
  if (e.endsWith("_days")) {
    const t = a === 0 && (e === "audit_days" || e === "interval_days") ? 365 : a;
    return `${t} ${t === 1 ? "day" : "days"}`;
  }
  return String(a);
}
function Zf(e, a) {
  const t = e.policy ?? {}, l = a.policy ?? {}, o = Object.keys(Ao).flatMap((v) => t[v] === l[v] ? [] : [`${Ao[v]} · ${We(Po(v, t[v]), Po(v, l[v]))}`]), d = (v) => v ? `${v.limit}${v.hard ? " (hard limit)" : ""}` : "No limit", f = /* @__PURE__ */ new Set([...Object.keys(t.wip ?? {}), ...Object.keys(l.wip ?? {})]);
  for (const v of f) {
    const c = d(t.wip?.[v]), i = d(l.wip?.[v]);
    if (c === i) continue;
    const u = (a.processes ?? []).flatMap((m) => m.states).find((m) => m.id === v) ?? (e.processes ?? []).flatMap((m) => m.states).find((m) => m.id === v);
    o.push(`${we(u)} limit · ${We(c, i)}`);
  }
  return o;
}
function Qf(e, a, t) {
  const l = e.visibility, o = a.visibility, d = [];
  l?.field !== o?.field && d.push(We(
    l ? Eo(e, l.field) : "No additional restriction",
    o ? Eo(a, o.field) : "No additional restriction"
  ));
  const f = l?.levels ?? [], v = o?.levels ?? [], c = new Set([...f, ...v].map((i) => i.id));
  for (const i of c) {
    const u = f.find((y) => y.id === i), m = v.find((y) => y.id === i);
    if (u && m && JSON.stringify(u.holders) === JSON.stringify(m.holders)) continue;
    const V = (y) => y.fields?.find((C) => C.code === y.visibility?.field)?.options?.find((C) => C.id === i)?.label, p = V(a) || V(e) || Fe(i), g = (y) => y ? y.holders.map(t).join(", ") || "No extra access" : "No level";
    d.push(`${p} · ${We(g(u), g(m))}`);
  }
  return l?.bypass !== o?.bypass && d.push(o?.bypass === "admin" ? "Board administrators can see every level." : "Visibility levels now apply to board administrators."), d;
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
function _f(e, a, t) {
  const { what: l, detail: o, to: d } = e, v = `${t?.name || a?.name || "Untitled workflow"} · ${$a[l] ?? "Workflow changed"}`, c = l.startsWith("state.") ? a?.states.find((p) => p.id === o) : void 0, i = l.startsWith("state.") ? t?.states.find((p) => p.id === o) : void 0, u = l.startsWith("transition.") ? a?.transitions?.find((p) => p.id === o) : void 0, m = l.startsWith("transition.") ? t?.transitions?.find((p) => p.id === o) : void 0;
  let V = "";
  return l === "state.map" ? V = We(we(c), we(t?.states.find((p) => p.id === d))) : l === "state.name" ? V = We(we(c), we(i)) : l === "state.kind" ? V = `${we(i)} · ${We(Qa(c?.kind), Qa(i?.kind))}` : l === "state.category" && c && i ? V = `${we(i)} · ${We(Yt(c.category), Yt(i.category))}` : i || c ? V = we(i ?? c) : l === "transition.name" && u && m ? V = We(Ke(u), Ke(m)) : m ? V = Ke(m) : u ? V = Ke(u) : l === "initial" ? V = We(we(a?.states.find((p) => p.id === a.initial)), we(t?.states.find((p) => p.id === t.initial))) : l === "name" && (V = We(a?.name || "Untitled workflow", t?.name || "Untitled workflow")), { title: v, details: V ? [V] : [] };
}
function em(e, a, t, l) {
  const { code: o, what: d, detail: f } = e;
  if (o === "schema" || d === "visibility.remove")
    return d === "policy" ? { title: "Board limits and defaults", details: Zf(a, t) } : d.startsWith("visibility") ? { title: "Who can see items", details: Qf(a, t, l) } : d === "key_prefix" ? { title: "Item key prefix", details: [We(a.key_prefix ?? "Default", t.key_prefix ?? "Default")] } : { title: { plugins: "Board plugins changed", scopes: "Saved query filters changed", "rollup.recompute": "Calculated totals will update" }[d] ?? "Board settings changed", details: [] };
  if (o.startsWith("process ")) {
    const m = o.slice(8);
    return _f(e, a.processes?.find((V) => V.id === m), t.processes?.find((V) => V.id === m));
  }
  if (o.startsWith("item_type ")) {
    const m = o.slice(10), V = a.item_types?.find((y) => y.id === m), p = t.item_types?.find((y) => y.id === m);
    return { title: `${p?.title || V?.title || "Item type"} · ${$a[d] ?? "Item type changed"}`, details: d === "title" ? [We(V?.title || "Untitled item type", p?.title || "Untitled item type")] : [] };
  }
  if (o.startsWith("relation ")) {
    const m = o.slice(9), V = a.relation_types?.find((y) => y.id === m), p = t.relation_types?.find((y) => y.id === m), g = d === "label" ? [We([V?.outward, V?.inward].filter(Boolean).join(" / "), [p?.outward, p?.inward].filter(Boolean).join(" / "))] : [];
    return { title: `${p?.outward || V?.outward || "Link type"} · ${$a[d] ?? "Link type changed"}`, details: g };
  }
  const v = t.fields?.find((m) => m.code === o), c = a.fields?.find((m) => v?.id !== void 0 ? m.id === v.id : m.code === (d.startsWith("renamed from ") ? d.slice(13) : o)), i = v ?? c;
  if (!i) return { title: $a[d] ?? "Board settings changed", details: [] };
  const u = `${Je(i)} · ${d.startsWith("renamed from ") ? "Field key" : $a[d] ?? "Field settings changed"}`;
  if (d.startsWith("options.")) {
    const m = c?.options ?? [], V = v?.options ?? [], p = m.findIndex((F) => F.id === f), g = V.findIndex((F) => F.id === f), y = m[p], C = V[g], T = C?.label || y?.label || "Untitled choice", x = y && C && y.label !== C.label ? [] : [T];
    if (y && C) {
      y.label !== C.label && x.push(We(y.label || "Untitled choice", C.label || "Untitled choice")), y.category !== C.category && x.push(`Category · ${We(y.category ? Yt(y.category) : "None", C.category ? Yt(C.category) : "None")}`);
      const F = y.order ?? p + 1, E = C.order ?? g + 1;
      F !== E && x.push(`Order · ${We(F, E)}`), y.color !== C.color && x.push(`Color · ${We(y.color ?? "Default", C.color ?? "Default")}`);
    }
    return { title: u, details: x };
  }
  return d === "title" && c && v ? { title: u, details: [We(Je(c), Je(v))] } : { title: u, details: [] };
}
const tm = {
  key: 0,
  class: "work-settings-card work-schema-plan work-stack",
  "aria-label": "Schema review"
}, am = { key: 0 }, lm = { class: "work-row work-wrap" }, om = { class: "work-muted" }, im = {
  key: 0,
  class: "work-notice"
}, nm = {
  key: 1,
  class: "work-notice"
}, sm = {
  key: 2,
  class: "work-stack work-tight",
  "aria-label": "Reviewed Flow bindings"
}, rm = { key: 3 }, dm = {
  key: 4,
  class: "work-settings-table"
}, um = { key: 0 }, cm = /* @__PURE__ */ $e({
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
    const a = e, t = {}, l = K(() => a.original ?? t), o = K(() => a.declaration ?? t), d = K(() => (o.value.processes ?? []).flatMap((x) => x.states.flatMap((F) => {
      const E = F.run?.flow_ref;
      return E ? [{ key: x.id + ":" + F.id, process: x.name || "Untitled process", state: we(F), reference: E }] : [];
    }))), f = B(/* @__PURE__ */ new Map());
    Se(d, async (x, F, E) => {
      const Q = /* @__PURE__ */ new Map();
      f.value = Q;
      let G = !0;
      E(() => G = !1), await Promise.all([...new Set(x.map((_) => _.reference.id))].map(async (_) => {
        try {
          const re = (await Bl.title(_))?.trim();
          G && re && !ji(re) && f.value.set(_, re);
        } catch {
          G && f.value.set(_, "Flow title unavailable");
        }
      }));
    }, { immediate: !0 });
    const v = K(() => [l.value, o.value].flatMap((x) => (x.visibility?.levels ?? []).flatMap((F) => F.holders.flatMap((E) => "group" in E ? [{ kind: "group", id: E.group }] : "user" in E ? [{ kind: "user", id: E.user }] : [])))), c = Wo(() => a.boardId ?? "", v);
    function i(x) {
      if ("user" in x) return c.label({ kind: "user", id: x.user });
      if ("group" in x) return c.label({ kind: "group", id: x.group });
      if ("field" in x) {
        const F = o.value.fields?.find((E) => E.code === x.field) ?? l.value.fields?.find((E) => E.code === x.field);
        return F ? Je(F) : "People from a field";
      }
      return "Service";
    }
    const u = (x) => x.map((F) => {
      const E = em(F, l.value, o.value, i);
      if (F.what === "plugins") {
        const Q = new Set(l.value.plugins?.map((_) => _.use)), G = new Set(o.value.plugins?.map((_) => _.use));
        for (const _ of a.plugins ?? [])
          Q.has(_.plugin) !== G.has(_.plugin) && E.details.push((G.has(_.plugin) ? "Enable " : "Turn off ") + (_.title || "an available plugin"));
      }
      return { change: F, ...E };
    }), m = K(() => u(a.plan?.changes.filter((x) => x.class !== "refused") ?? [])), V = K(() => u(a.plan?.refused ?? [])), p = K(() => {
      const x = a.plan?.migration;
      return !x || !V.value.length ? x : V.value.every((F) => F.change.what === "options.remove") ? "Add a new field with the choices you want to keep. Copy existing values into it before removing the old field." : V.value.every((F) => F.change.what === "state.remove") ? "Choose where existing items should move before removing their state." : x;
    }), g = {
      unchanged: ["No changes", "secondary"],
      cosmetic: ["Labels or settings", "secondary"],
      additive: ["New definitions", "success"],
      semantic: ["Affects existing items", "warn"],
      refused: ["Blocked", "danger"],
      initial: ["First setup", "secondary"]
    }, y = (x) => g[x]?.[0] ?? "Review needed", C = (x) => g[x]?.[1] ?? "secondary";
    function T(x) {
      const { detail: F, ...E } = x;
      return ol(x.what === "invalid" || x.what.startsWith("views.") || x.what.startsWith("automation") ? x : E);
    }
    return (x, F) => e.plan ? (n(), b("section", tm, [
      !e.plan.changes.length && !e.plan.refused.length && !e.configCount && !e.packReview ? (n(), b("p", am, "No changes to apply.")) : (n(), b(te, { key: 1 }, [
        s("header", lm, [
          F[0] || (F[0] = s("h3", null, "Impact on this board", -1)),
          k(r(lt), {
            class: "kx-tag-sm",
            severity: C(e.plan.class)
          }, {
            default: q(() => [
              z(U(y(e.plan.class)), 1)
            ]),
            _: 1
          }, 8, ["severity"])
        ]),
        s("p", om, U(r(Wi)[e.plan.class] || "Review the changes below."), 1),
        p.value ? (n(), b("p", im, U(p.value), 1)) : e.follows.length ? (n(), b("p", nm, "Existing items in " + U(e.follows.join(", ")) + " will follow the updated workflow.", 1)) : I("", !0),
        d.value.length ? (n(), b("section", sm, [
          F[1] || (F[1] = s("h3", null, "Flow bindings", -1)),
          (n(!0), b(te, null, ne(d.value, (E) => (n(), b("p", {
            key: E.key
          }, [
            z(U(E.process) + " / " + U(E.state) + " · ", 1),
            s("strong", null, U(f.value.get(E.reference.id) ?? "Published Flow") + " · v" + U(E.reference.version), 1)
          ]))), 128)),
          F[2] || (F[2] = s("p", { class: "work-muted work-small" }, "New entries use these exact published versions. Before replacing a binding, stop new entries, let existing runs and deliveries finish, pause the old launcher, save, then resume entries.", -1))
        ])) : I("", !0),
        Qe(x.$slots, "default"),
        V.value.length ? (n(), b("h3", rm, "Blocked changes")) : I("", !0),
        (n(!0), b(te, null, ne(V.value, (E, Q) => (n(), H(r(en), {
          key: Q,
          severity: "error",
          role: "alert"
        }, {
          default: q(() => [
            s("strong", null, U(E.title), 1),
            (n(!0), b(te, null, ne(E.details, (G, _) => (n(), b("p", { key: _ }, U(G), 1))), 128)),
            s("p", null, U(T(E.change)), 1),
            k(Ne, {
              class: "work-small",
              label: "Technical details"
            }, {
              default: q(() => [
                s("code", null, U(E.change.what), 1)
              ]),
              _: 2
            }, 1024)
          ]),
          _: 2
        }, 1024))), 128)),
        m.value.length ? (n(), b("table", dm, [
          F[3] || (F[3] = s("thead", null, [
            s("tr", null, [
              s("th", { scope: "col" }, "Change"),
              s("th", { scope: "col" }, "Impact")
            ])
          ], -1)),
          s("tbody", null, [
            (n(!0), b(te, null, ne(m.value, (E, Q) => (n(), b("tr", { key: Q }, [
              s("td", null, [
                s("strong", null, U(E.title), 1),
                (n(!0), b(te, null, ne(E.details, (G, _) => (n(), b("p", { key: _ }, U(G), 1))), 128)),
                E.change.count ? (n(), b("p", um, U(E.change.count) + " " + U(E.change.count === 1 ? "item" : "items"), 1)) : I("", !0)
              ]),
              s("td", null, [
                k(r(lt), {
                  class: "kx-tag-sm",
                  severity: C(E.change.class)
                }, {
                  default: q(() => [
                    z(U(y(E.change.class)), 1)
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
}), vm = {
  class: "work-stack work-tight",
  "aria-label": "Pack resources"
}, fm = {
  key: 0,
  class: "work-muted work-small"
}, mm = {
  key: 0,
  class: "work-stack",
  "aria-label": "Pack conflicts"
}, pm = { class: "work-stack work-tight work-pack-review-field" }, bm = { class: "work-config-fields" }, hm = { class: "work-json-example" }, gm = { class: "work-json-example" }, km = {
  key: 1,
  class: "work-stack",
  "aria-label": "Pack state maps"
}, ym = /* @__PURE__ */ $e({
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
    const t = e, l = a, o = K(() => [
      { label: "Saved views", entries: t.plan.views?.map((u) => ({ id: u.id, name: u.title || u.id })) },
      { label: "Automations", entries: t.plan.automations?.map((u) => ({ id: u.id, name: u.id })) },
      { label: "Traits", entries: t.plan.traits?.map((u) => ({ id: u, name: u })) },
      { label: "Required plugins", entries: t.plan.plugins?.map((u) => ({ id: u, name: t.plugins?.find((m) => m.plugin === u)?.title || u })) }
    ].filter((u) => u.entries?.length));
    function d(u) {
      return t.original.processes?.find((m) => m.id === u)?.name || Fe(u);
    }
    function f(u) {
      const [m, ...V] = u.split("."), p = V.join(".");
      return m === "processes" ? d(p) : m === "fields" ? t.original.fields?.find((g) => g.code === p)?.title || Fe(p) : m === "item_types" ? t.original.item_types?.find((g) => g.id === p)?.title || Fe(p) : Fe(m);
    }
    function v(u) {
      return JSON.stringify(u ?? null, null, 2);
    }
    function c(u, m) {
      (t.request.resolutions ??= {})[u] = m, l("change");
    }
    function i(u, m, V) {
      ((t.request.maps ??= {})[u] ??= {})[m] = V, l("change");
    }
    return (u, m) => (n(), b(te, null, [
      s("section", vm, [
        m[1] || (m[1] = s("h3", null, "Pack resources", -1)),
        s("p", null, [
          m[0] || (m[0] = z("Target version ", -1)),
          s("strong", null, U(e.plan.version), 1)
        ]),
        o.value.length ? (n(), b("p", fm, "Resources included in this plan.")) : I("", !0),
        (n(!0), b(te, null, ne(o.value, (V) => (n(), b("div", {
          key: V.label
        }, [
          s("h4", null, U(V.label), 1),
          s("ul", null, [
            (n(!0), b(te, null, ne(V.entries, (p) => (n(), b("li", {
              key: p.id
            }, U(p.name), 1))), 128))
          ])
        ]))), 128))
      ]),
      e.plan.conflicts.length ? (n(), b("section", mm, [
        m[4] || (m[4] = s("h3", null, "Local edits conflict", -1)),
        m[5] || (m[5] = s("p", { class: "work-muted work-small" }, "Choose which declaration to keep for each conflict, then review again.", -1)),
        (n(!0), b(te, null, ne(e.plan.conflicts, (V) => (n(), b("div", {
          key: V.path,
          class: "work-stack work-tight"
        }, [
          s("label", pm, [
            z(U(f(V.path)), 1),
            k(r(ue), {
              "model-value": e.request.resolutions?.[V.path],
              "aria-label": "Resolution for " + f(V.path),
              disabled: e.disabled,
              appendTo: "self",
              placeholder: "Choose a resolution",
              optionLabel: "label",
              optionValue: "value",
              options: [{ label: "Keep local edits", value: "local" }, { label: "Use pack changes", value: "incoming" }],
              "onUpdate:modelValue": (p) => c(V.path, p)
            }, null, 8, ["model-value", "aria-label", "disabled", "onUpdate:modelValue"])
          ]),
          k(Ne, {
            class: "work-json-disclosure",
            label: "Compare declarations"
          }, {
            default: q(() => [
              s("div", bm, [
                s("section", null, [
                  m[2] || (m[2] = s("h4", null, "Local edits", -1)),
                  s("pre", hm, U(v(V.local_value)), 1)
                ]),
                s("section", null, [
                  m[3] || (m[3] = s("h4", null, "Pack changes", -1)),
                  s("pre", gm, U(v(V.incoming)), 1)
                ])
              ])
            ]),
            _: 2
          }, 1024)
        ]))), 128))
      ])) : I("", !0),
      Object.keys(e.plan.maps).length ? (n(), b("section", km, [
        m[6] || (m[6] = s("h3", null, "Required state maps", -1)),
        m[7] || (m[7] = s("p", { class: "work-muted work-small" }, "Review the proposed destinations for existing items. Each destination is editable.", -1)),
        (n(!0), b(te, null, ne(e.plan.maps, (V, p) => (n(), b("div", {
          key: p,
          class: "work-stack"
        }, [
          s("h4", null, U(d(p)), 1),
          (n(!0), b(te, null, ne(V, (g, y) => (n(), b("label", {
            key: y,
            class: "work-stack work-tight work-pack-review-field"
          }, [
            z("Move items from " + U(r(we)(e.original.processes?.find((C) => C.id === p)?.states.find((C) => C.id === y))), 1),
            k(r(ue), {
              "model-value": e.request.maps?.[p]?.[y],
              "aria-label": "Move items from " + r(we)(e.original.processes?.find((C) => C.id === p)?.states.find((C) => C.id === y)),
              disabled: e.disabled,
              appendTo: "self",
              optionLabel: "label",
              optionValue: "value",
              options: e.plan.declaration.processes?.find((C) => C.id === p)?.states.map((C) => ({ label: r(we)(C), value: C.id })) ?? [],
              "onUpdate:modelValue": (C) => i(p, y, C)
            }, null, 8, ["model-value", "aria-label", "disabled", "options", "onUpdate:modelValue"])
          ]))), 128))
        ]))), 128))
      ])) : I("", !0)
    ], 64));
  }
}), wm = { class: "work-section-layout" }, Vm = { class: "kx-main" }, $m = ["aria-label"], xm = {
  key: 1,
  class: "kx-err work-alert-actions"
}, Cm = { role: "alert" }, Sm = {
  key: 2,
  class: "work-notice",
  role: "status"
}, Tm = {
  key: 3,
  class: "kx-loading",
  role: "status"
}, Im = {
  key: 4,
  class: "work-notice",
  role: "alert"
}, Dm = {
  key: 5,
  class: "work-settings-body"
}, Um = {
  key: 0,
  class: "work-notice work-stack work-tight",
  "aria-label": "Pack installation"
}, Em = {
  key: 0,
  role: "status"
}, Am = {
  key: 1,
  role: "status"
}, Pm = { class: "work-small" }, Om = {
  key: 2,
  class: "kx-err",
  role: "alert"
}, Rm = { key: 3 }, Nm = {
  key: 1,
  class: "work-notice",
  role: "alert"
}, Mm = {
  key: 2,
  class: "work-notice"
}, Fm = ["id"], Lm = ["disabled", "inert"], Bm = {
  key: 3,
  class: "work-ia-section"
}, zm = {
  key: 0,
  class: "work-muted"
}, jm = {
  key: 5,
  class: "work-ia-section"
}, Wm = { class: "work-review-layout" }, qm = { class: "work-muted" }, Gm = ["aria-busy"], Km = {
  key: 0,
  role: "status"
}, Hm = {
  key: 1,
  role: "alert",
  class: "kx-err"
}, Ym = {
  key: 2,
  role: "alert"
}, Xm = { key: 6 }, Jm = { class: "work-dialog-actions" }, Zm = {
  key: 3,
  class: "work-muted",
  role: "status"
}, Qm = {
  key: 0,
  class: "work-muted",
  role: "status"
}, _m = {
  key: 1,
  class: "kx-err work-alert-actions"
}, ep = { role: "alert" }, tp = {
  key: 2,
  class: "work-stack work-tight"
}, ap = {
  key: 0,
  class: "work-pack-unavailable work-block"
}, lp = {
  key: 3,
  class: "work-muted"
}, op = { class: "work-dialog-actions" }, ip = /* @__PURE__ */ $e({
  __name: "BoardSettings",
  props: {
    boardId: {},
    embedded: { type: Boolean },
    focusBack: { type: Boolean },
    route: {}
  },
  emits: ["dirty-change", "navigate"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = dn(), d = Ht(), f = B();
    let v, c = "";
    const i = () => JSON.stringify([yt.value, X.value, Ue.value, [..._e.value]]), u = K(() => ({
      value: "all-boards",
      label: t.embedded ? "All boards" : "Back to board",
      icon: t.embedded ? "tabler:table" : "tabler:layout-kanban"
    })), m = B();
    Se(m, (j) => {
      t.focusBack && j?.$el.querySelector(".kx-settings-rail-item")?.focus();
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
    ], p = B("General"), g = {
      General: "general",
      "Item types": "items",
      Fields: "fields",
      Links: "links",
      Workflow: "workflow",
      Access: "access",
      Plugins: "plugins"
    }, y = B("");
    function C(j, R = "") {
      p.value = j, y.value = R ? g[j] + "/" + R : "";
    }
    function T(j, R = "") {
      C(j, R), t.route !== void 0 && l("navigate", [g[j], ...R ? [encodeURIComponent(R)] : []].join("/"));
    }
    function x(j, R, Z) {
      if (t.route === void 0 || g[p.value] !== j || !Z && y.value !== j + "/" + R) return;
      const ge = M.value?.declaration;
      (j === "items" ? ge?.item_types?.some((Ie) => Ie.id === R) : j === "fields" ? ge?.fields?.some((Ie) => Ie.code === R) : j === "links" ? ge?.relation_types?.some((Ie) => Ie.id === R) : j === "plugins" ? h.value?.schema_options.plugins.some((Ie) => Ie.plugin === R) : j === "workflow" && ge?.processes?.some((Ie) => Ie.states.some((Ee) => Ie.id + ".state." + Ee.id === R) || Ie.transitions?.some((Ee) => Ie.id + ".transition." + Ee.id === R))) && T(p.value, Z ? R : "");
    }
    Mo(Hl, { selected: y, choose: x });
    function F(j) {
      if (j === u.value.value) {
        $i();
        return;
      }
      (j === "General" || V.some((R) => R.items.some((Z) => Z.value === j))) && T(j);
    }
    async function E() {
      T("Access"), await Vt(), f.value?.focus();
    }
    const Q = {
      General: "Manage the board name, item key prefix and app.",
      "Item types": "Choose the fields, parent relationships and workflow for each kind of work.",
      Fields: "Choose what information people can capture on items.",
      Links: "Show relationships on both items, such as “Blocks” and “Blocked by.”",
      Workflow: "Select a state or transition to edit how work moves.",
      Access: "Who can use this board?",
      Plugins: "Choose which plugins this board uses."
    }, G = B(""), _ = B();
    function re(j, R, Z) {
      Z.currentTarget instanceof HTMLElement && (_.value = { section: j, type: R, opener: Z.currentTarget }, j === "Fields" && (G.value = R.id), T(j));
    }
    function ce(j) {
      const R = _.value;
      if (!R) return;
      j !== void 0 && (R.type.process = j);
      const Z = R.type.id, ge = M.value?.declaration.item_types?.some((Le) => Le.id === Z);
      T("Item types", ge ? Z : ""), _.value = void 0, R.section === "Fields" && Vt(() => R.opener.focus());
    }
    const fe = B(!1), se = B(""), oe = B();
    Se(p, (j) => {
      f.value?.scrollTo({ top: 0 }), _.value && j !== _.value.section && (_.value = void 0);
    });
    function O() {
      fe.value = !1, se.value = "", La.value = !1;
    }
    function ae(j) {
      !rl.value || !ki() || _e.value.size || (oe.value = j, fe.value = !0, hl());
    }
    const L = B(!1), ve = B(""), Y = B(/* @__PURE__ */ new Set(["General"]));
    Se(p, (j) => Y.value.add(j));
    const M = B(), S = B(), N = B(), A = B({}), X = B({}), h = B(), P = B(!1), ie = B(!0), J = B(!1), ye = B(""), Ve = B(""), Ae = K(() => A.value.processes ?? []), $ = K(() => P.value && M.value ? [
      { heading: N.value?.title || "Board settings", items: [{ value: "General", label: "General", icon: "tabler:settings" }] },
      ...V
    ] : []), D = B(), w = B(!1), W = xa();
    async function he(j) {
      const R = W();
      w.value = !1;
      try {
        const Z = await Pt.stateCounts(j);
        R() && (D.value = Z);
      } catch {
        R() && (w.value = !0, D.value = void 0);
      }
    }
    Se(p, (j) => {
      P.value && j === "Workflow" && he(t.boardId);
    });
    const { packs: me, loading: De, error: Pe, load: qe, reset: It } = qi(), Na = K(() => me.value.filter(Gi)), Ma = K(() => me.value.map(Ki)), eo = K(() => Ma.value.find((j) => j.id === ve.value && !j.disabled)), Ue = B(), Mt = B(), gt = B(), kt = B(), ca = B(""), Xt = K(() => !!kt.value && kt.value.result.status !== "done"), va = K(() => !J.value && !fa.value && !Qt.value && !Xt.value), rl = K(() => fa.value && !(Xt.value && Ue.value)), He = B(), Jt = B(), Zt = B(""), dl = B([]), ul = K(() => [...dl.value, ...He.value?.refused ?? []]), dt = B(!1), to = B(0), _e = B(/* @__PURE__ */ new Set()), cl = B(), ao = xa(), Fa = xa(), yt = K(() => yl(A.value, M.value?.declaration ?? {})), fa = K(() => _e.value.size > 0 || !!Ue.value || !!M.value && (JSON.stringify(yt.value) !== JSON.stringify(yl(M.value.declaration, M.value.declaration)) || Object.keys(X.value).length > 0)), vl = B(!1), ma = B({}), lo = K(() => fa.value || vl.value || Object.keys(ma.value).length > 0);
    Se(lo, (j) => l("dirty-change", j), { immediate: !0, flush: "sync" });
    const nt = K(() => !!M.value && !!S.value && M.value.generation !== S.value.generation), vi = K(() => (!pa.value.renamed.length || La.value) && P.value && !J.value && !dt.value && !Qt.value && !nt.value && !_e.value.size && He.value && (He.value.changes.length > 0 || Object.keys(X.value).length > 0) && He.value.class !== "refused" && !He.value.refused.length && Jt.value?.matches(yt.value, M.value?.generation ?? -1, X.value)), La = B(!1), pa = K(() => {
      const j = M.value?.declaration, R = [], Z = [];
      for (const ge of Ae.value) {
        const Le = j?.item_types?.filter((Ee) => Ee.process === ge.id) ?? [], Ie = j?.processes?.find((Ee) => Ee.id === ge.id);
        for (const Ee of Ie?.states ?? []) {
          const za = ge.states.find((Ft) => Ft.id === Ee.id);
          if (za && za.name === Ee.name) continue;
          const kl = [...He.value?.refused ?? [], ...He.value?.changes ?? []].find((Ft) => Ft.code === "process " + ge.id && Ft.detail === Ee.id && ["state.remove", "state.map"].includes(Ft.what))?.count ?? Le.reduce((Ft, Ci) => Ft + (D.value?.[Ci.id]?.[Ee.id] ?? 0), 0);
          kl && (za ? Z.push({ process: ge, state: Ee, name: we(za), count: kl }) : R.push({ process: ge, state: Ee, count: kl }));
        }
      }
      return { removed: R, renamed: Z };
    });
    function fi(j, R, Z) {
      j.map = { ...j.map, [R]: Z }, hl();
    }
    const fl = K(() => Na.value.find((j) => j.id === Ue.value?.pack)?.plugins.filter((j) => !M.value?.plugins?.some((R) => R.plugin === j.plugin && R.active)).map((j) => ({ use: j.plugin })) ?? []), oo = K(() => !!gt.value && JSON.stringify(gt.value) === JSON.stringify(Ue.value)), io = K(() => Ue.value ? P.value && !J.value && !_e.value.size && !nt.value && !Qt.value && oo.value && He.value?.class !== "refused" && !He.value?.refused.length && Mt.value?.conflicts.every((j) => !!Ue.value?.resolutions?.[j.path]) : vi.value), no = K(() => !!He.value && (!Ue.value || oo.value)), mi = K(() => Na.value.find((j) => j.id === M.value?.pack?.id)?.title || "Installed pack"), ml = K(() => !Pe.value && !!M.value?.outdated && !!Ma.value.find((j) => j.id === M.value?.pack?.id && !j.disabled)), pi = K(() => Pe.value ? "Reload packs to check available upgrades." : Xt.value ? "Finish the current pack installation before upgrading." : ml.value ? fa.value ? "Discard the current draft before upgrading." : Qt.value ? "Finish the current migration before upgrading." : J.value ? "Wait for the current request to finish." : void 0 : "Install an available version of this pack to upgrade.");
    function so() {
      Ue.value = void 0, Mt.value = void 0, gt.value = void 0;
    }
    async function bi() {
      if (!M.value?.pack || !va.value || !ml.value) return;
      const j = Na.value.find((R) => R.id === M.value.pack.id);
      j && (oe.value = void 0, Ue.value = mo(j, M.value.generation), fe.value = !0, await pl());
    }
    async function hi() {
      const j = Na.value.find((R) => R.id === ve.value);
      !M.value || !j || !eo.value || !va.value || De.value || (oe.value = void 0, Ue.value = mo(j, M.value.generation), L.value = !1, fe.value = !0, await pl());
    }
    async function pl() {
      if (!Ue.value || J.value || !P.value || nt.value || _e.value.size) return;
      const j = Fa(), R = ta(Ue.value), Z = JSON.stringify(Ue.value);
      J.value = !0, se.value = "", Ve.value = "";
      try {
        const ge = await Yi(R, (Le) => Ut.packPlan(t.boardId, Le));
        if (!j() || Z !== JSON.stringify(Ue.value)) return;
        Mt.value = ge.plan, He.value = ge.plan, Ue.value = ge.request, gt.value = ta(Ue.value), Zt.value = crypto.randomUUID(), fe.value = !0;
      } catch (ge) {
        j() && (gt.value = void 0, se.value = rt(ge, "Could not review the pack."));
      } finally {
        J.value = !1;
      }
    }
    const ro = K(() => Mt.value?.declaration ?? Jt.value?.declaration), gi = K(() => {
      const j = ro.value;
      return !He.value || !j ? [] : Hi(He.value, j).map((R) => j.processes?.find((Z) => Z.id === R)?.name || "Untitled process");
    }), Qt = K(() => !!S.value?.migration_error || N.value?.status === "migrating");
    function wt() {
      dl.value = [], Fa(), He.value = void 0, Jt.value = void 0, gt.value = void 0, Zt.value = "";
    }
    Se([yt, X], wt, { deep: !0, flush: "sync" }), Se(X, (j) => {
      Ue.value && (Object.keys(j).length ? Ue.value.plugin_configs = ta(j) : delete Ue.value.plugin_configs);
    }, { deep: !0, flush: "sync" });
    function ba(j, R) {
      R ? _e.value.delete(j) : _e.value.add(j), wt();
    }
    function bl(j) {
      so(), _.value = void 0, to.value++, M.value = j, A.value = ta(j.declaration), X.value = {}, _e.value.clear(), wt();
    }
    async function ut(j = !1) {
      const R = ao();
      try {
        const [Z, ge, Le] = await Promise.all([Pt.schema(t.boardId, void 0, !0).catch((Ee) => {
          if (Ee instanceof Al && Ee.details?.code === "board_schema_missing") return { generation: 0, declaration: {}, compiled: {}, key_prefix: "", as_of: 0 };
          throw Ee;
        }), Pt.options(t.boardId), Pt.boards()]);
        if (!R()) return;
        if (P.value = ge.access.admin, h.value = ge, N.value = Le.find((Ee) => Ee.board_id === t.boardId), !P.value) {
          M.value = void 0, A.value = {}, wt();
          return;
        }
        ye.value = "";
        const Ie = Xi(Z);
        S.value = Ie, v !== void 0 && Ie.generation >= v ? (v = void 0, c === i() && bl(Ie), c = "") : (j || !M.value || !fa.value && Ie.generation !== M.value.generation) && bl(Ie), nt.value && wt(), await qe(R), R() && p.value === "Workflow" && he(t.boardId);
      } catch (Z) {
        if (!R()) return;
        Z instanceof Al && (Z.status === 403 || Z.kind?.toLowerCase() === "permission_denied") && (P.value = !1), wt(), ye.value = rt(Z, "Could not load board settings.");
      } finally {
        R() && (ie.value = !1);
      }
    }
    function ki() {
      for (const j of Array.from(cl.value?.elements ?? []))
        if ((j instanceof HTMLInputElement || j instanceof HTMLSelectElement || j instanceof HTMLTextAreaElement) && !(j.form !== cl.value || j.closest('[style*="display: none"]:not(.p-accordioncontent)')) && !j.reportValidity()) {
          const Z = j.closest('.p-accordioncontent[style*="display: none"]')?.closest(".kx-disclosure")?.querySelector('.kx-disclosure-toggle[aria-expanded="false"]');
          return Z && (Z.click(), Vt(() => j.reportValidity())), !1;
        }
      return !0;
    }
    async function hl() {
      if (Ue.value) return pl();
      if (!M.value || J.value || !P.value || nt.value || _e.value.size) return;
      const j = Fa(), R = po(yt.value, M.value.generation, X.value);
      J.value = !0, se.value = "", Ve.value = "";
      try {
        const Z = (R.declaration.processes ?? []).some((Le) => M.value?.declaration.processes?.find((Ie) => Ie.id === Le.id)?.states.some((Ie) => Le.states.some((Ee) => Ee.id === Ie.id && Ee.name !== Ie.name))), [ge] = await Promise.all([
          Ut.plan(t.boardId, R),
          Z ? he(t.boardId) : void 0
        ]);
        if (Z && w.value) {
          wt(), se.value = "Could not check which items use the renamed states. Check the impact again.";
          return;
        }
        if (!j() || _e.value.size || !R.matches(yt.value, M.value.generation, X.value)) return;
        He.value = ge, Jt.value = R, Zt.value = crypto.randomUUID(), fe.value = !0;
      } catch (Z) {
        j() && (wt(), se.value = rt(Z, "Could not review changes."), dl.value = Ji(Z, yt.value));
      } finally {
        J.value = !1;
      }
    }
    async function yi() {
      if (!io.value) return;
      if (Ue.value && gt.value) {
        J.value = !0, se.value = "";
        try {
          await uo(ta(gt.value), Zt.value, i()), O();
        } catch (R) {
          se.value = rt(R, "Could not apply the pack upgrade.");
        } finally {
          J.value = !1;
        }
        return;
      }
      if (!Jt.value) return;
      J.value = !0, se.value = "", Ve.value = "";
      const j = i();
      try {
        v = (await Ut.apply(t.boardId, Jt.value, Zt.value)).generation, c = j, await ut(), Ve.value = "Board changes applied.", O();
      } catch (R) {
        se.value = rt(R, "Could not apply the board changes.");
      } finally {
        J.value = !1;
      }
    }
    async function uo(j, R, Z) {
      const ge = t.boardId, Le = await Ut.packApply(ge, j, R);
      t.boardId === ge && (kt.value = { request: j, key: R, result: Le, draft: Z }, Z === i() && (v = Le.generation, c = Z), await ut());
    }
    async function wi() {
      const j = kt.value;
      if (!(!j || !Xt.value || J.value || !P.value)) {
        J.value = !0, ca.value = "";
        try {
          await uo(j.request, j.key, j.draft);
        } catch (R) {
          ca.value = rt(R, "Could not continue the pack installation.");
        } finally {
          J.value = !1;
        }
      }
    }
    async function Vi() {
      if (!J.value) {
        J.value = !0, ye.value = "";
        try {
          const j = await Ut.resume(t.boardId);
          Ve.value = j.resumed ? "Migration resumes." : "Migration is already running.", await ut();
        } catch (j) {
          ye.value = rt(j, "Could not resume migration.");
        } finally {
          J.value = !1;
        }
      }
    }
    async function Ba(j, R) {
      if (!M.value || !P.value || J.value || dt.value) return "Wait for the current change to finish.";
      if (nt.value) return "Discard the stale draft before removing a definition.";
      const Z = M.value.generation, ge = JSON.stringify(yt.value), Le = ta(A.value);
      Pa(Le, j, R), dt.value = !0;
      try {
        const Ie = await Ut.plan(t.boardId, po(yl(Le, M.value.declaration), Z, X.value));
        if (!P.value || nt.value || M.value.generation !== Z || JSON.stringify(yt.value) !== ge) return "The draft changes during the check. Try the removal again.";
        const Ee = Zi(Ie, j, R);
        if (Ee) return Ee;
        if (Ie.class === "refused") return "Resolve the blocked changes in your draft before removing this definition.";
      } catch (Ie) {
        return rt(Ie, "Could not check this removal.");
      } finally {
        dt.value = !1;
      }
    }
    async function $i() {
      if (t.embedded) {
        o({ name: "boards" });
        return;
      }
      lo.value && !await qo.confirm({ header: "Discard changes?", message: "Your unsaved board settings will be discarded.", acceptLabel: "Discard", rejectLabel: "Keep editing" }) || o({ name: "board", board: t.boardId });
    }
    function xi() {
      v = void 0, ma.value = {}, S.value && bl(S.value), Ve.value = "", ye.value = "", O();
    }
    Se(() => t.boardId, () => {
      vl.value = !1, ma.value = {}, v = void 0, so(), It(), kt.value = void 0, ca.value = "", M.value = void 0, S.value = void 0, N.value = void 0, X.value = {}, _e.value.clear(), W(), D.value = void 0, G.value = "", _.value = void 0, Y.value = /* @__PURE__ */ new Set(["General"]), C("General"), O(), P.value = !1, ie.value = !0, ut(!0);
    }), Se([() => t.route, () => t.boardId], ([j]) => {
      if (j === void 0) return;
      const [R, Z] = j.split("/"), ge = Object.keys(g).find((Ie) => g[Ie] === R) ?? "General";
      let Le = "";
      try {
        Z && (Le = decodeURIComponent(Z));
      } catch {
      }
      ge === "Fields" && Le && y.value !== "fields/" + Le && (G.value = ""), C(ge, Le), Y.value.add(ge);
    }, { immediate: !0 });
    let gl = () => {
    };
    return Se(() => t.boardId, (j) => {
      gl(), gl = Qi(`component.${j}`, () => {
        ut();
      });
    }, { immediate: !0 }), Ei(ut), ql(() => {
      gl(), ao(), Fa(), W();
    }), (j, R) => (n(), b("section", {
      class: ft(["work-settings-shell work-ia", { "work-embedded": e.embedded }])
    }, [
      s("div", wm, [
        k(rn, {
          ref_key: "rail",
          ref: m,
          label: "Board settings sections",
          value: p.value,
          groups: $.value,
          "leading-item": u.value,
          "onUpdate:value": F
        }, null, 8, ["value", "groups", "leading-item"]),
        s("div", Vm, [
          s("div", {
            ref_key: "pane",
            ref: f,
            class: "kx-main-scroll work-settings-content",
            role: "region",
            "aria-label": p.value,
            tabindex: "-1"
          }, [
            P.value && M.value ? (n(), H(Ov, {
              key: 0,
              title: p.value,
              description: Q[p.value]
            }, jl({ _: 2 }, [
              rl.value || p.value === "Plugins" ? {
                name: "actions",
                fn: q(() => [
                  p.value === "Plugins" ? (n(), H(r(ee), {
                    key: 0,
                    label: "Refresh status",
                    severity: "secondary",
                    outlined: "",
                    disabled: J.value || ie.value,
                    onClick: R[0] || (R[0] = (Z) => ut())
                  }, {
                    icon: q(() => [
                      k(r(de), {
                        icon: "tabler:refresh",
                        "aria-hidden": "true"
                      })
                    ]),
                    _: 1
                  }, 8, ["disabled"])) : I("", !0),
                  rl.value ? (n(), H(Rv, {
                    key: 1,
                    busy: J.value,
                    "discard-disabled": dt.value,
                    "review-disabled": dt.value || Qt.value || nt.value || !!_e.value.size,
                    onDiscard: xi,
                    onReview: ae
                  }, null, 8, ["busy", "discard-disabled", "review-disabled"])) : I("", !0)
                ]),
                key: "0"
              } : void 0
            ]), 1032, ["title", "description"])) : I("", !0),
            ye.value ? (n(), b("div", xm, [
              s("p", Cm, U(ye.value), 1),
              k(r(ee), {
                label: "Retry",
                severity: "secondary",
                outlined: "",
                onClick: R[1] || (R[1] = (Z) => ut())
              })
            ])) : I("", !0),
            Ve.value ? (n(), b("p", Sm, U(Ve.value), 1)) : I("", !0),
            ie.value ? (n(), b("p", Tm, "Loading board settings…")) : !P.value && !ye.value ? (n(), b("p", Im, "Ask a board administrator to grant you access to these settings.")) : I("", !0),
            P.value && M.value ? (n(), b("div", Dm, [
              kt.value ? (n(), b("section", Um, [
                Xt.value ? (n(), b("p", Em, [
                  R[28] || (R[28] = z("Pack installation status ", -1)),
                  s("strong", null, U(r(Fe)(kt.value.result.status)), 1)
                ])) : (n(), b("p", Am, "Pack applied.")),
                s("p", Pm, [
                  R[29] || (R[29] = z("Operation ", -1)),
                  s("code", null, U(kt.value.result.operation_id), 1),
                  R[30] || (R[30] = z(" · Job ", -1)),
                  s("code", null, U(kt.value.result.job_id), 1)
                ]),
                ca.value ? (n(), b("p", Om, U(ca.value), 1)) : I("", !0),
                Xt.value ? (n(), b("div", Rm, [
                  k(r(ee), {
                    label: "Continue pack installation",
                    severity: "secondary",
                    outlined: "",
                    loading: J.value,
                    disabled: J.value,
                    onClick: wi
                  }, null, 8, ["loading", "disabled"])
                ])) : I("", !0)
              ])) : I("", !0),
              nt.value ? (n(), b("p", Nm, "Someone saved new settings while you were editing. Discard this draft to load their changes.")) : I("", !0),
              Qt.value ? (n(), b("div", Mm, [
                s("p", null, U(S.value?.migration_error ? "Updating existing items paused." : "Updating existing items…"), 1),
                S.value?.migration_error ? (n(), H(Ne, {
                  key: 0,
                  label: "Technical details"
                }, {
                  default: q(() => [
                    z(U(S.value.migration_error), 1)
                  ]),
                  _: 1
                })) : I("", !0),
                S.value?.migration_error ? (n(), H(r(ee), {
                  key: 1,
                  label: "Resume updating items",
                  severity: "secondary",
                  disabled: J.value,
                  outlined: "",
                  onClick: Vi
                }, null, 8, ["disabled"])) : I("", !0)
              ])) : I("", !0),
              pt(k(Jf, {
                draft: A.value,
                schema: S.value ?? M.value,
                board: N.value,
                active: p.value === "General",
                "board-apps": h.value?.board_apps,
                "draft-form": r(d),
                disabled: J.value || dt.value,
                "pack-title": M.value.pack ? mi.value : void 0,
                outdated: M.value.outdated,
                "upgrade-reason": pi.value,
                "can-upgrade": ml.value && va.value,
                "can-install": va.value,
                "pack-error": r(Pe),
                onUpgrade: bi,
                onInstall: R[2] || (R[2] = (Z) => L.value = !0),
                onRetry: R[3] || (R[3] = (Z) => r(qe)()),
                onDirtyChange: R[4] || (R[4] = (Z) => vl.value = Z),
                onSaved: R[5] || (R[5] = (Z) => ut()),
                onShare: E
              }, null, 8, ["draft", "schema", "board", "active", "board-apps", "draft-form", "disabled", "pack-title", "outdated", "upgrade-reason", "can-upgrade", "can-install", "pack-error"]), [
                [Dt, p.value === "General"]
              ]),
              s("form", {
                id: r(d),
                ref_key: "editor",
                ref: cl,
                onSubmit: R[20] || (R[20] = Re((Z) => ae(), ["prevent"]))
              }, [
                (n(), b("fieldset", {
                  key: to.value,
                  class: "work-settings-fieldset",
                  disabled: J.value || dt.value,
                  inert: J.value || dt.value || void 0
                }, [
                  Y.value.has("Item types") ? pt((n(), H(Qr, {
                    key: 0,
                    class: "work-ia-section",
                    draft: A.value,
                    "guard-removal": Ba,
                    issues: ul.value,
                    onCreateField: R[6] || (R[6] = (Z, ge) => re("Fields", Z, ge)),
                    onCreateWorkflow: R[7] || (R[7] = (Z, ge) => re("Workflow", Z, ge))
                  }, null, 8, ["draft", "issues"])), [
                    [Dt, p.value === "Item types"]
                  ]) : I("", !0),
                  Y.value.has("Fields") ? pt((n(), H(Nr, {
                    key: 1,
                    class: "work-ia-section",
                    "board-id": e.boardId,
                    "installed-types": h.value?.installed_types,
                    draft: A.value,
                    "guard-removal": Ba,
                    issues: ul.value,
                    "item-type": G.value,
                    "onUpdate:itemType": R[8] || (R[8] = (Z) => G.value = Z),
                    "create-for-item-type": _.value?.section === "Fields",
                    onCreated: R[9] || (R[9] = (Z) => ce()),
                    onCancelCreation: R[10] || (R[10] = (Z) => ce()),
                    onValidity: R[11] || (R[11] = (Z, ge) => ba("fields:" + Z, ge))
                  }, null, 8, ["board-id", "installed-types", "draft", "issues", "item-type", "create-for-item-type"])), [
                    [Dt, p.value === "Fields"]
                  ]) : I("", !0),
                  Y.value.has("Links") ? pt((n(), H(iv, {
                    key: 2,
                    class: "work-ia-section",
                    draft: A.value,
                    "guard-removal": Ba
                  }, null, 8, ["draft"])), [
                    [Dt, p.value === "Links"]
                  ]) : I("", !0),
                  Y.value.has("Workflow") ? pt((n(), b("section", Bm, [
                    w.value ? (n(), b("p", zm, [
                      R[31] || (R[31] = z("Item counts are unavailable. ", -1)),
                      k(r(ee), {
                        label: "Reload counts",
                        text: "",
                        onClick: R[12] || (R[12] = (Z) => he(e.boardId))
                      })
                    ])) : I("", !0),
                    k(Fc, {
                      "board-id": e.boardId,
                      draft: A.value,
                      "guard-removal": Ba,
                      issues: ul.value,
                      counts: D.value,
                      "count-types": M.value.declaration.item_types,
                      guards: h.value?.guards,
                      "create-for-item-type": _.value?.section === "Workflow",
                      "creation-opener": _.value?.opener,
                      onCreated: ce,
                      onCancelCreation: R[13] || (R[13] = (Z) => ce()),
                      onValidity: R[14] || (R[14] = (Z, ge) => ba("process:" + Z, ge))
                    }, null, 8, ["board-id", "draft", "issues", "counts", "count-types", "guards", "create-for-item-type", "creation-opener"])
                  ], 512)), [
                    [Dt, p.value === "Workflow"]
                  ]) : I("", !0),
                  Y.value.has("Access") ? pt((n(), H(of, {
                    key: 4,
                    active: p.value === "Access",
                    "board-id": e.boardId,
                    draft: A.value,
                    board: N.value,
                    busy: J.value,
                    onValidity: R[15] || (R[15] = (Z) => ba("visibility", Z))
                  }, null, 8, ["active", "board-id", "draft", "board", "busy"])), [
                    [Dt, p.value === "Access"]
                  ]) : I("", !0),
                  Y.value.has("Plugins") ? pt((n(), b("section", jm, [
                    k(Uo, {
                      "board-id": e.boardId,
                      draft: A.value,
                      schema: S.value ?? M.value,
                      options: h.value?.schema_options.plugins ?? [],
                      "active-configs": ma.value,
                      "onUpdate:activeConfigs": R[16] || (R[16] = (Z) => ma.value = Z),
                      filters: h.value?.filters,
                      configs: X.value,
                      disabled: J.value,
                      onConfigured: R[17] || (R[17] = (Z) => {
                        wt(), ut();
                      }),
                      onRefresh: R[18] || (R[18] = (Z) => ut()),
                      onReview: ae,
                      onValidity: R[19] || (R[19] = (Z, ge) => ba("plugin:" + Z, ge))
                    }, null, 8, ["board-id", "draft", "schema", "options", "active-configs", "filters", "configs", "disabled"])
                  ], 512)), [
                    [Dt, p.value === "Plugins"]
                  ]) : I("", !0)
                ], 8, Lm))
              ], 40, Fm),
              k(Pl, {
                visible: fe.value,
                label: "Review changes",
                busy: J.value,
                "return-focus": oe.value,
                class: "work-review-sheet",
                onClose: O
              }, {
                default: q(() => [
                  s("div", Wm, [
                    s("header", null, [
                      R[32] || (R[32] = s("h2", null, "Review changes", -1)),
                      s("p", qm, U(N.value?.title), 1)
                    ]),
                    s("div", {
                      class: "work-review-content work-stack",
                      "aria-busy": J.value
                    }, [
                      J.value ? (n(), b("p", Km, U(He.value ? "Applying or checking changes…" : "Checking the impact on your board…"), 1)) : I("", !0),
                      se.value ? (n(), b("p", Hm, U(se.value), 1)) : I("", !0),
                      nt.value ? (n(), b("p", Ym, "The board changed while you were editing. Close this review and discard the draft to load the latest settings.")) : I("", !0),
                      fe.value && !Ue.value && (pa.value.removed.length || pa.value.renamed.length) ? (n(), H(jc, {
                        key: 3,
                        removed: pa.value.removed,
                        renamed: pa.value.renamed,
                        disabled: J.value || dt.value,
                        confirmed: La.value,
                        "onUpdate:confirmed": R[21] || (R[21] = (Z) => La.value = Z),
                        onDestination: fi
                      }, null, 8, ["removed", "renamed", "disabled", "confirmed"])) : I("", !0),
                      fe.value && Ue.value && fl.value.length ? (n(), H(Uo, {
                        key: 4,
                        "board-id": e.boardId,
                        draft: { plugins: fl.value },
                        schema: S.value ?? M.value,
                        options: h.value?.schema_options.plugins.filter((Z) => fl.value.some((ge) => ge.use === Z.plugin)) ?? [],
                        configs: X.value,
                        disabled: J.value,
                        "activation-locked": "",
                        onValidity: R[22] || (R[22] = (Z, ge) => ba("pack-plugin:" + Z, ge))
                      }, null, 8, ["board-id", "draft", "schema", "options", "configs", "disabled"])) : I("", !0),
                      fe.value ? (n(), H(cm, {
                        key: 5,
                        "board-id": e.boardId,
                        original: M.value.declaration,
                        declaration: ro.value,
                        plan: He.value,
                        follows: gi.value,
                        "config-count": Object.keys(X.value).length,
                        "pack-review": !!Mt.value,
                        plugins: h.value?.schema_options.plugins
                      }, {
                        default: q(() => [
                          Mt.value && Ue.value ? (n(), H(ym, {
                            key: 0,
                            plan: Mt.value,
                            request: Ue.value,
                            original: M.value.declaration,
                            plugins: h.value?.schema_options.plugins,
                            disabled: J.value,
                            onChange: R[23] || (R[23] = (Z) => {
                              gt.value = void 0, Zt.value = "";
                            })
                          }, null, 8, ["plan", "request", "original", "plugins", "disabled"])) : I("", !0)
                        ]),
                        _: 1
                      }, 8, ["board-id", "original", "declaration", "plan", "follows", "config-count", "pack-review", "plugins"])) : I("", !0),
                      !J.value && !no.value && !nt.value && !se.value ? (n(), b("p", Xm, "Check the impact again before applying.")) : I("", !0)
                    ], 8, Gm),
                    s("footer", Jm, [
                      k(r(ee), {
                        label: "Keep editing",
                        severity: "secondary",
                        outlined: "",
                        disabled: J.value,
                        onClick: O
                      }, null, 8, ["disabled"]),
                      no.value ? (n(), H(r(ee), {
                        key: 1,
                        label: "Apply changes",
                        disabled: !io.value,
                        loading: J.value,
                        onClick: yi
                      }, null, 8, ["disabled", "loading"])) : (n(), H(r(ee), {
                        key: 0,
                        label: "Check impact",
                        disabled: J.value || nt.value || !!_e.value.size,
                        onClick: hl
                      }, null, 8, ["disabled"]))
                    ])
                  ])
                ]),
                _: 1
              }, 8, ["visible", "busy", "return-focus"]),
              dt.value ? (n(), b("p", Zm, "Checking what uses this setting…")) : I("", !0)
            ])) : I("", !0)
          ], 8, $m)
        ])
      ]),
      P.value ? (n(), H(Pl, {
        key: 0,
        visible: L.value,
        label: "Install pack",
        busy: J.value,
        onClose: R[27] || (R[27] = (Z) => L.value = !1)
      }, {
        default: q(() => [
          L.value ? (n(), b("form", {
            key: 0,
            class: "work-dialog-box work-stack",
            onSubmit: Re(hi, ["prevent"])
          }, [
            R[34] || (R[34] = s("h2", null, "Install a pack", -1)),
            R[35] || (R[35] = s("p", { class: "work-muted work-small" }, "Packs give an empty board a starting setup. Review checks whether this board is eligible.", -1)),
            r(De) ? (n(), b("p", Qm, "Loading packs…")) : r(Pe) ? (n(), b("div", _m, [
              s("p", ep, U(r(Pe)), 1),
              k(r(ee), {
                label: "Reload packs",
                severity: "secondary",
                outlined: "",
                onClick: R[24] || (R[24] = (Z) => r(qe)())
              })
            ])) : Ma.value.length ? (n(), b("label", tp, [
              R[33] || (R[33] = z("Pack ", -1)),
              k(r(ue), {
                modelValue: ve.value,
                "onUpdate:modelValue": R[25] || (R[25] = (Z) => ve.value = Z),
                "aria-label": "Pack to install",
                appendTo: "self",
                optionLabel: "title",
                optionValue: "id",
                optionDisabled: "disabled",
                options: Ma.value,
                pt: { option: ({ context: Z }) => ({ "aria-label": [Z.option.title, Z.option.unavailable].filter(Boolean).join(". ") }) }
              }, {
                option: q(({ option: Z }) => [
                  s("span", null, [
                    z(U(Z.title), 1),
                    Z.unavailable ? (n(), b("small", ap, U(Z.unavailable), 1)) : I("", !0)
                  ])
                ]),
                _: 1
              }, 8, ["modelValue", "options", "pt"])
            ])) : (n(), b("p", lp, "No available packs were found.")),
            s("footer", op, [
              k(r(ee), {
                label: "Cancel",
                severity: "secondary",
                outlined: "",
                onClick: R[26] || (R[26] = (Z) => L.value = !1)
              }),
              k(r(ee), {
                type: "submit",
                label: "Review pack",
                disabled: !eo.value || !va.value || r(De) || !!r(Pe)
              }, null, 8, ["disabled"])
            ])
          ], 32)) : I("", !0)
        ]),
        _: 1
      }, 8, ["visible", "busy"])) : I("", !0)
    ], 2));
  }
}), np = /* @__PURE__ */ $e({
  __name: "SettingsRoot",
  setup(e) {
    const a = Ai(), t = Pi();
    return Mo(Ko, (l) => {
      a.value.embedded && l.name === "boards" ? t("back-to-boards", {}) : t("navigate", { route: un(l) });
    }), (l, o) => (n(), H(ip, {
      "board-id": r(a).boardId ?? "",
      embedded: r(a).embedded,
      "focus-back": r(a).focusBack,
      route: r(a).route,
      onNavigate: o[0] || (o[0] = (d) => r(t)("navigate", { route: d })),
      onDirtyChange: o[1] || (o[1] = (d) => r(t)("dirty-change", { dirty: d }))
    }, null, 8, ["board-id", "embedded", "focus-back", "route"]));
  }
}), sp = Oi(np, {
  type: "object",
  properties: {
    "board-id": { type: "string", default: "", description: "Board to administer." },
    "focus-back": { type: "boolean", default: !1, description: "Focus the first rail action when opening settings from the board picker." },
    route: { type: "string", description: "Section and selected row in System." },
    embedded: { type: "boolean", default: !1, description: "Fits in a System detail pane." }
  }
});
_i(import.meta.url, sp);
//# sourceMappingURL=settings.js.map
