import { inject as Ql, defineComponent as ue, ref as z, useSlots as _l, openBlock as m, createElementBlock as h, createElementVNode as u, createVNode as f, normalizeClass as ct, unref as d, withCtx as L, renderSlot as Ye, toDisplayString as U, createCommentVNode as I, createBlock as B, withDirectives as at, vShow as bt, watch as Ee, onBeforeUnmount as $t, computed as W, onMounted as ha, onUnmounted as yl, resolveComponent as gl, Fragment as q, renderList as _, createTextVNode as M, resolveDynamicComponent as Oa, withKeys as Ie, withModifiers as ye, useId as eo, normalizeStyle as to, watchEffect as kl, nextTick as ao, provide as lo } from "vue";
import { Icon as Z } from "@iconify/vue";
import { on as oo, define as io } from "@wippy-fe/proxy";
import "pinia";
import { m as Ra, d as _a, s as he, f as no, t as qe, p as St, a as qa, g as Ct, r as el, w as kt, e as Pt, l as Na, h as He, i as Vt, j as wl, k as Vl, n as Wa, o as $l, q as ge, v as ya, x as Jt, y as so, z as xl, A as gt, B as ro, _ as uo, C as co, D as mo, E as tl, F as _e, G as vo, H as al, I as fo, u as po, J as bo, K as ll, L as ho, M as yo, N as go, O as ko, b as wo } from "./latestRequest-ChYtJT1O.js";
import Re from "primevue/toggleswitch";
import K from "primevue/button";
import Ae from "primevue/tag";
import Xt from "primevue/textarea";
import Ot from "primevue/checkbox";
import se from "primevue/inputtext";
import ee from "primevue/select";
import Ze from "primevue/inputnumber";
import Ga from "primevue/selectbutton";
import Vo from "primevue/chip";
import $o from "primevue/tabs";
import xo from "primevue/tablist";
import So from "primevue/tab";
import Co from "primevue/message";
const xa = (e, a) => e.x > a.x && e.x < a.x + a.width && e.y > a.y && e.y < a.y + a.height;
function Eo(e, a, t) {
  return e.x === a.x ? e.x > t.x && e.x < t.x + t.width && Math.max(e.y, a.y) > t.y && Math.min(e.y, a.y) < t.y + t.height : e.y > t.y && e.y < t.y + t.height && Math.max(e.x, a.x) > t.x && Math.min(e.x, a.x) < t.x + t.width;
}
function vt(e, a, t) {
  const l = [.../* @__PURE__ */ new Set([e.x, a.x, ...t.flatMap(($) => [$.x, $.x + $.width])])].sort(($, D) => $ - D), o = [.../* @__PURE__ */ new Set([e.y, a.y, ...t.flatMap(($) => [$.y, $.y + $.height])])].sort(($, D) => $ - D);
  l.unshift(l[0] - 24), l.push(l.at(-1) + 24), o.unshift(o[0] - 24), o.push(o.at(-1) + 24);
  const s = l.length, v = o.indexOf(a.y) * s + l.indexOf(a.x), c = o.indexOf(e.y) * s + l.indexOf(e.x), r = ($) => ({ x: l[$ % s], y: o[Math.floor($ / s)] }), i = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map(), b = [];
  function w($) {
    b.push($);
    let D = b.length - 1;
    for (; D; ) {
      const E = D - 1 >> 1;
      if (b[E].priority <= $.priority) break;
      b[D] = b[E], D = E;
    }
    b[D] = $;
  }
  function y() {
    const $ = b[0], D = b.pop();
    if (b.length) {
      let E = 0;
      for (; E * 2 + 1 < b.length; ) {
        let T = E * 2 + 1;
        if (T + 1 < b.length && b[T + 1].priority < b[T].priority && T++, D.priority <= b[T].priority) break;
        b[E] = b[T], E = T;
      }
      b[E] = D;
    }
    return $;
  }
  const k = ($) => Math.abs($.x - a.x) + Math.abs($.y - a.y);
  for (const $ of [0, 1]) {
    const D = c * 2 + $;
    i.set(D, 0), w({ key: D, cost: 0, priority: k(e) });
  }
  const C = /* @__PURE__ */ new Map(), R = /* @__PURE__ */ new Map();
  for (; b.length; ) {
    const $ = y(), D = Math.floor($.key / 2), E = $.key % 2;
    if ($.cost !== i.get($.key)) continue;
    if (D === v) {
      const G = [];
      let ce = $.key;
      for (; ce !== void 0; )
        G.push(r(Math.floor(ce / 2))), ce = n.get(ce);
      return Sl(G.reverse());
    }
    const T = r(D), V = D % s, P = Math.floor(D / s);
    for (const [G, ce] of [[V > 0 ? D - 1 : -1, 0], [V + 1 < s ? D + 1 : -1, 0], [P > 0 ? D - s : -1, 1], [P + 1 < o.length ? D + s : -1, 1]]) {
      if (G < 0) continue;
      const re = r(G);
      if (C.has(G) || C.set(G, !t.some((S) => xa(re, S))), !C.get(G)) continue;
      const J = `${Math.min(D, G)}:${Math.max(D, G)}`;
      if (R.has(J) || R.set(J, !t.some((S) => Eo(T, re, S))), !R.get(J)) continue;
      const O = $.cost + Math.abs(T.x - re.x) + Math.abs(T.y - re.y) + (E === ce ? 0 : 18), te = G * 2 + ce;
      O >= (i.get(te) ?? 1 / 0) || (i.set(te, O), n.set(te, $.key), w({ key: te, cost: O, priority: O + k(re) }));
    }
  }
  throw new Error("Process map has no collision-free route between its ports: " + JSON.stringify({ start: e, end: a, startInside: t.filter(($) => xa(e, $)), endInside: t.filter(($) => xa(a, $)) }));
}
function Sl(e) {
  const a = [];
  for (const t of e) {
    const l = a.at(-1), o = a.at(-2);
    l && l.x === t.x && l.y === t.y || (o && l && (o.x === l.x && l.x === t.x || o.y === l.y && l.y === t.y) && a.pop(), a.push(t));
  }
  return a;
}
const zt = (e) => Array.from(e).reduce((a, t) => a + (/[^\x20-\x7e]/u.test(t) ? 16 : /[MW@%]/.test(t) ? 11 : /[ilI.,:;!| ']/.test(t) ? 4 : 7.5), 0);
function It(e, a = 28) {
  const t = [];
  let l = "";
  for (const o of e.split(/\s+/u))
    for (let s = 0; s < o.length; s += a) {
      const v = o.slice(s, s + a);
      l && l.length + v.length + 1 > a && (t.push(l), l = ""), l = l ? l + " " + v : v;
    }
  return [...t, l].filter(Boolean);
}
function ta(e) {
  if (e = Sl(e), !e.length) return "";
  let a = `M ${e[0].x} ${e[0].y}`;
  for (let l = 1; l < e.length - 1; l++) {
    const o = e[l - 1], s = e[l], v = e[l + 1], c = Math.hypot(s.x - o.x, s.y - o.y), r = Math.hypot(v.x - s.x, v.y - s.y), i = Math.min(8, c / 3, r / 3);
    i && (a += ` L ${s.x + (o.x - s.x) * i / c} ${s.y + (o.y - s.y) * i / c} Q ${s.x} ${s.y} ${s.x + (v.x - s.x) * i / r} ${s.y + (v.y - s.y) * i / r}`);
  }
  const t = e.at(-1);
  return a + ` L ${t.x} ${t.y}`;
}
function To(e, a = {}, t = { width: 1400, height: 480 }) {
  const l = t.width < 750 || Ra(e).length > 8 ? "TB" : "LR", o = new _a.graphlib.Graph({ multigraph: !0 });
  o.setGraph({ rankdir: l, ranker: "network-simplex", acyclicer: "greedy", nodesep: 32, edgesep: 32, ranksep: 24, marginx: 32, marginy: 32 }), o.setDefaultEdgeLabel(() => ({}));
  const s = Ra(e), v = new Map(s.map((p, x) => [p.id, x])), c = e.states.map((p) => {
    const x = (e.transitions ?? []).filter((Te) => Te.from === "any" && Te.to === p.id), g = It(he(p)), j = It(no(p, e)), Y = x.flatMap((Te) => It(qe(Te) + " works from any state")), ne = a.policy?.wip?.[p.id]?.limit, pe = ne === void 0 ? 0 : zt(" · limit " + ne), ze = Math.max(168, ...g.map((Te) => zt(Te) + 58), ...j.map((Te, mt) => zt(Te) + 32 + (mt === j.length - 1 ? pe : 0)), ...Y.map((Te) => zt(Te) + 32)), Ke = Math.max(80, 42 + g.length * 18 + j.length * 16 + Y.length * 18);
    return o.setNode(p.id, { width: ze + (l === "LR" ? 36 : 0), height: Ke + (l === "TB" ? 36 : 0) }), { state: p, x: 0, y: 0, width: ze, height: Ke, title: g, caption: j, badges: x, row: v.has(p.id) ? 0 : 1 };
  }), r = new Set(c.map((p) => p.state.id)), i = (e.transitions ?? []).flatMap((p) => p.from === "any" ? [] : p.from.filter((x) => r.has(x) && r.has(p.to)).map((x) => {
    const g = `${p.id}-${x}`, j = It(qe(p)), Y = Math.max(72, ...j.map((pe) => zt(pe) + 24)), ne = Math.max(24, j.length * 16 + 10);
    return { transition: p, from: x, key: g, lines: j, width: Y, height: ne };
  })), n = /* @__PURE__ */ new Set(), b = /* @__PURE__ */ new Set(), w = new Set(i.filter((p) => p.from === p.transition.to || p.transition.to === e.initial || ["completed", "canceled"].includes(c.find((x) => x.state.id === p.from).state.category)).map((p) => p.key));
  function y(p) {
    if (!b.has(p)) {
      n.add(p);
      for (const x of i.filter((g) => g.from === p))
        w.has(x.key) || (n.has(x.transition.to) ? w.add(x.key) : y(x.transition.to));
      n.delete(p), b.add(p);
    }
  }
  y(e.initial);
  for (const p of c) y(p.state.id);
  for (const p of i) if (!w.has(p.key)) {
    const x = v.get(p.from), g = v.get(p.transition.to);
    o.setEdge(p.from, p.transition.to, { width: p.width, height: p.height, labelpos: "c", weight: x !== void 0 && g === x + 1 ? 100 : 1 }, p.key);
  }
  for (const p of e.transitions ?? []) if (p.from === "any" && r.has(e.initial) && r.has(p.to) && !v.has(p.to)) {
    const x = e.states.find((g) => g.id === p.to);
    o.setEdge(e.initial, p.to, { minlen: ["completed", "canceled"].includes(x.category) ? Math.max(1, s.length - 1) : 1 }, `any:${p.id}`);
  }
  const k = e.states.flatMap((p) => (p.regions ?? []).filter((x) => r.has(x.initial)).map((x, g) => {
    const j = `lane:${p.id}:${g}`;
    return o.setEdge(p.id, x.initial, {}, j), { state: p, region: x, key: j };
  }));
  if (!c.length) return { nodes: c, edges: [], parallels: [], main: s, direction: l, width: 320, height: 160 };
  _a.layout(o);
  for (const p of c) Object.assign(p, { x: o.node(p.state.id).x, y: o.node(p.state.id).y });
  const C = l === "TB", R = i.filter((p) => !w.has(p.key)).map((p) => o.edge({ v: p.from, w: p.transition.to, name: p.key })), $ = [...c, ...R], D = Math.max(...$.map((p) => p.x + p.width / 2)), E = Math.max(...$.map((p) => p.y + p.height / 2)), T = (p) => c.find((x) => x.state.id === p), V = i.filter((p) => w.has(p.key)).sort((p, x) => {
    const g = C ? "y" : "x";
    return Math.abs(T(p.from)[g] - T(p.transition.to)[g]) - Math.abs(T(x.from)[g] - T(x.transition.to)[g]);
  }), P = /* @__PURE__ */ new Map(), G = Math.max(0, ...V.map((p) => p.width));
  let ce = E + 32;
  for (const [p, x] of V.entries()) {
    const g = T(x.from), j = T(x.transition.to), Y = C ? D + 16 + G + 18 + p * 18 : ce + x.height / 2, ne = C ? (D + 16 + Y) / 2 : (g.x + j.x) / 2, pe = C ? g.y + g.height / 2 + 18 : Y;
    P.set(x.key, { x: ne, y: pe, corridor: Y }), ce = Y + x.height / 2 + 24;
  }
  const re = i.map((p) => ({ ...p, ...P.get(p.key) ?? o.edge({ v: p.from, w: p.transition.to, name: p.key }) })), J = (p, x) => ({ x: p.x - p.width / 2 - x, y: p.y - p.height / 2 - x, width: p.width + x * 2, height: p.height + x * 2 }), O = [...c.map((p) => J(p, 12)), ...re.map((p) => J(p, 10))], te = (p, x) => ({
    start: C ? { x: p.x, y: p.y + p.height / 2 } : { x: p.x + p.width / 2, y: p.y },
    end: C ? { x: x.x, y: x.y - x.height / 2 } : { x: x.x - x.width / 2, y: x.y }
  }), S = (p, x) => C ? { x: p.x, y: p.y + x } : { x: p.x + x, y: p.y }, A = re.map((p) => {
    const x = c.find((Ne) => Ne.state.id === p.from), g = c.find((Ne) => Ne.state.id === p.transition.to), { start: j, end: Y } = te(x, g), ne = w.has(p.key), pe = S(j, 18), ze = S(Y, -18), Ke = (ne || !C ? p.width : p.height) / 2 + 10, Te = ne ? { x: p.x + (C ? -Ke : Ke), y: p.y } : S(p, -Ke), mt = ne ? { x: p.x + (C ? Ke : -Ke), y: p.y } : S(p, Ke);
    let We;
    if (ne) {
      const { corridor: Ne } = P.get(p.key), Lt = C ? { x: Ne, y: pe.y } : { x: pe.x, y: Ne }, Be = C ? { x: Ne, y: ze.y } : { x: ze.x, y: Ne };
      We = C ? [
        [j, ...vt(pe, Te, O)],
        [mt, Lt, Be, ...vt(Be, ze, O), Y]
      ] : [
        [j, ...vt(pe, Lt, O), Te],
        [mt, ...vt(Be, ze, O), Y]
      ];
    } else We = [
      [j, ...vt(pe, Te, O)],
      [...vt(mt, ze, O), Y]
    ];
    const Qe = ne ? "return" : v.get(p.transition.to) === (v.get(p.from) ?? -2) + 1 ? "main" : "forward";
    return { ...p, points: We.flat(), segments: We, path: We.map(ta).join(" "), type: Qe, targetOffset: 0 };
  }), N = k.map((p) => {
    const x = c.find((pe) => pe.state.id === p.state.id), g = c.find((pe) => pe.state.id === p.region.initial), { start: j, end: Y } = te(x, g), ne = [j, ...vt(S(j, 18), S(Y, -18), O), Y];
    return { state: p.state, key: p.key, points: ne, path: ta(ne) };
  }), X = [...c.flatMap((p) => [{ x: p.x - p.width / 2, y: p.y - p.height / 2 }, { x: p.x + p.width / 2, y: p.y + p.height / 2 }]), ...A.flatMap((p) => [...p.points, { x: p.x - p.width / 2, y: p.y - p.height / 2 }, { x: p.x + p.width / 2, y: p.y + p.height / 2 }]), ...N.flatMap((p) => p.points)], de = 32 - Math.min(...X.map((p) => p.x)), fe = 32 - Math.min(...X.map((p) => p.y)), be = Math.max(...X.map((p) => p.x)) + de + 32, xe = Math.max(...X.map((p) => p.y)) + fe + 32, Pe = (p) => ({ x: p.x + de, y: p.y + fe });
  for (const p of c) Object.assign(p, Pe(p));
  for (const p of A)
    Object.assign(p, Pe(p)), p.segments = p.segments.map((x) => x.map(Pe)), p.points = p.segments.flat(), p.path = p.segments.map(ta).join(" ");
  for (const p of N)
    p.points = p.points.map(Pe), p.path = ta(p.points);
  return { nodes: c, edges: A, parallels: N, main: s, direction: l, width: be, height: xe };
}
const Cl = Symbol("work-navigation");
function Uo() {
  return Ql(Cl, () => {
  });
}
function Do(e) {
  if (e.name === "boards") return "";
  const a = encodeURIComponent(e.board);
  return e.name === "settings" ? `${a}/settings` : a;
}
const Et = (e) => `/api/v1/work/boards/${encodeURIComponent(e)}`, ol = (e) => ({ declaration: e.declaration, expected_generation: e.expected_generation, plugin_configs: e.plugin_configs }), ht = {
  packPlan: (e, a) => St(`${Et(e)}/pack_plan`, a, "Pack plan"),
  packApply: (e, a, t) => St(`${Et(e)}/pack_apply`, { ...a, key: t }, "Apply pack"),
  plan: (e, a) => St(`${Et(e)}/plan_schema`, ol(a), "Schema plan"),
  apply: (e, a, t) => St(`${Et(e)}/apply_schema`, { ...ol(a), key: t }, "Apply schema"),
  resume: (e) => St(`${Et(e)}/resume_migration`, {}, "Resume migration"),
  configure: (e, a, t) => St(`${Et(e)}/configure_plugin`, { plugin: a, config: t }, "Configure plugin")
}, Io = { class: "work-definition" }, Ao = { class: "work-definition-head" }, Po = { class: "work-definition-affordances" }, Oo = ["title"], Ro = { class: "work-definition-code" }, No = ["title"], Mo = { class: "work-definition-kind" }, Lo = { class: "work-definition-flags" }, zo = { class: "work-definition-usage" }, Bo = { class: "work-definition-actions" }, Fo = {
  key: 0,
  class: "work-definition-description"
}, jo = { class: "work-definition-body work-stack" }, ga = /* @__PURE__ */ ue({
  __name: "DefinitionRow",
  props: {
    title: {},
    code: {},
    kind: {},
    description: {}
  },
  setup(e) {
    const a = z(!1), t = _l();
    return (l, o) => (m(), h("article", Io, [
      u("header", Ao, [
        f(qa, {
          as: "article",
          class: ct(["work-definition-toggle", { "work-definition-has-handle": d(t).handle }]),
          "aria-expanded": a.value,
          onActivate: o[0] || (o[0] = (s) => a.value = !a.value)
        }, {
          default: L(() => [
            u("span", Po, [
              Ye(l.$slots, "handle"),
              f(d(Z), {
                icon: a.value ? "tabler:chevron-down" : "tabler:chevron-right"
              }, null, 8, ["icon"])
            ]),
            u("span", {
              class: "work-row-title",
              title: e.title
            }, U(e.title), 9, Oo)
          ]),
          _: 3
        }, 8, ["class", "aria-expanded"]),
        u("span", Ro, [
          e.code ? (m(), h("code", {
            key: 0,
            class: "work-mono",
            title: e.code
          }, U(e.code), 9, No)) : I("", !0)
        ]),
        u("span", Mo, [
          e.kind ? (m(), B(d(Ae), {
            key: 0,
            severity: "secondary",
            value: e.kind
          }, null, 8, ["value"])) : I("", !0)
        ]),
        u("span", Lo, [
          Ye(l.$slots, "flags")
        ]),
        u("div", zo, [
          Ye(l.$slots, "usage")
        ]),
        u("div", Bo, [
          Ye(l.$slots, "actions")
        ]),
        e.description ? (m(), h("p", Fo, U(e.description), 1)) : I("", !0)
      ]),
      at(u("div", jo, [
        Ye(l.$slots, "default")
      ], 512), [
        [bt, a.value]
      ])
    ]));
  }
}), qo = { class: "work-definition-scroll" }, Wo = {
  key: 0,
  class: "work-definition-columns",
  "aria-hidden": "true"
}, Go = { key: 0 }, Yo = { key: 1 }, Ho = {
  key: 2,
  class: "work-definition-usage"
}, ka = /* @__PURE__ */ ue({
  __name: "DefinitionList",
  props: {
    count: {},
    columns: {}
  },
  setup(e) {
    return (a, t) => (m(), h("div", qo, [
      u("div", {
        class: ct(["work-field-builder", "work-definitions-" + e.columns])
      }, [
        e.count > 3 ? (m(), h("div", Wo, [
          t[0] || (t[0] = u("span", null, null, -1)),
          t[1] || (t[1] = u("span", null, "Name", -1)),
          e.columns !== "plugins" ? (m(), h("span", Go, "Code")) : I("", !0),
          u("span", null, U(e.columns === "plugins" ? "State" : e.columns === "types" ? "Process" : "Kind"), 1),
          e.columns === "fields" || e.columns === "plugins" ? (m(), h("span", Yo, "Details")) : I("", !0),
          e.columns !== "plugins" ? (m(), h("span", Ho, U(e.columns === "fields" ? "Used by" : "Details"), 1)) : I("", !0),
          t[2] || (t[2] = u("span", null, null, -1))
        ])) : I("", !0),
        Ye(a.$slots, "default")
      ], 2)
    ]));
  }
}), Ko = { class: "work-json-disclosure" }, Xo = { class: "work-stack work-tight" }, Jo = {
  key: 0,
  class: "work-small work-muted"
}, Zo = {
  key: 1,
  role: "alert",
  class: "work-error"
}, Qo = { class: "work-json-example" }, ot = /* @__PURE__ */ ue({
  __name: "JsonInput",
  props: {
    label: {},
    modelValue: {},
    shape: {},
    hint: {},
    example: {}
  },
  emits: ["update:modelValue", "validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = z(""), s = z("");
    Ee(() => t.modelValue, (c) => {
      o.value = c === void 0 ? "" : JSON.stringify(c, null, 2), s.value = "", l("validity", !0);
    }, { immediate: !0 }), $t(() => l("validity", !0));
    function v(c) {
      o.value = c;
      try {
        const r = c.trim() ? JSON.parse(c) : void 0;
        if (r !== void 0 && t.shape === "object" && (!r || typeof r != "object" || Array.isArray(r))) throw new Error("Enter a JSON object.");
        if (r !== void 0 && t.shape === "array" && !Array.isArray(r)) throw new Error("Enter a JSON array.");
        s.value = "", l("update:modelValue", r), l("validity", !0);
      } catch (r) {
        s.value = r instanceof Error ? r.message : "Invalid JSON.", l("validity", !1);
      }
    }
    return (c, r) => (m(), h("details", Ko, [
      u("summary", null, "Edit as JSON · " + U(e.label), 1),
      u("label", Xo, [
        u("span", null, U(e.label), 1),
        e.hint ? (m(), h("span", Jo, U(e.hint), 1)) : I("", !0),
        f(d(Xt), {
          class: "work-json-input",
          rows: "3",
          "aria-label": e.label,
          value: o.value,
          "aria-invalid": !!s.value,
          onInput: r[0] || (r[0] = (i) => v(i.target.value))
        }, null, 8, ["aria-label", "value", "aria-invalid"]),
        s.value ? (m(), h("span", Zo, U(s.value), 1)) : I("", !0)
      ]),
      r[1] || (r[1] = u("p", { class: "work-small work-muted" }, "Example", -1)),
      u("pre", Qo, U(JSON.stringify(e.example ?? (e.shape === "array" ? [] : {}), null, 2)), 1)
    ]));
  }
}), _o = [
  { code: "key", form: "text", index: "key" },
  { code: "type", form: "text", index: "key" },
  { code: "state", form: "text", index: "key" },
  { code: "category", form: "text", index: "key" },
  { code: "rank", form: "text", index: "key" },
  { code: "parent", form: "text", index: "key" },
  { code: "created_at", form: "time", index: "key" },
  { code: "updated_at", form: "time", index: "key" }
];
function ei(e) {
  const a = e.compiled.processes?.flatMap((t) => t.states.map((l) => ({ id: l.id, label: l.name }))) ?? [];
  return [..._o.filter((t) => t.code !== "rank").map((t) => t.code === "state" ? { ...t, type: "option", options: a } : t.code === "category" ? { ...t, type: "option", options: ["triage", "backlog", "unstarted", "started", "completed", "canceled"].map((l) => ({ id: l })) } : t), ...(e.compiled.fields ?? []).filter((t) => t.index && t.index !== "none")];
}
function ti(e) {
  if (e?.cardinality && e.cardinality !== "one") return ["has", "in", "nin", "is_null", ...e.type === "principal" ? ["member_of"] : []];
  const a = ["eq", "neq", "in", "nin", "is_null", ...e?.type === "principal" ? ["member_of"] : []];
  return e && (["int", "number", "dec", "time", "quantity"].includes(e.form) || e.index === "number") && a.push("lt", "lte", "gt", "gte", "between"), e?.form === "text" && e.type !== "option" && a.push("contains", "starts_with"), a;
}
const ai = { class: "work-field-control" }, li = ["id"], oi = {
  key: 1,
  class: "work-stack work-tight"
}, ii = { class: "work-chips" }, ni = {
  key: 5,
  class: "work-row"
}, si = ["inert"], ri = ["value"], di = {
  key: 1,
  class: "work-muted"
}, ui = ["inert"], ci = ["value"], mi = {
  key: 1,
  class: "work-muted"
}, vi = {
  key: 11,
  class: "work-stack work-tight"
}, fi = {
  class: "work-stack work-tight",
  "aria-label": "Matching items"
}, pi = { class: "work-mono" }, bi = {
  key: 15,
  class: "work-error work-small",
  role: "alert"
}, El = /* @__PURE__ */ ue({
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
    const t = e, l = a, o = W(() => t.inputId ?? `field-${t.field.code}`), s = W(() => !!t.field.cardinality && t.field.cardinality !== "one"), v = W(() => Array.isArray(t.modelValue) ? t.modelValue : []), c = W(() => t.modelValue == null ? "" : typeof t.modelValue == "object" ? Ct(t.modelValue) : String(t.modelValue)), r = W(() => {
      const x = t.modelValue;
      return x && typeof x == "object" && "ref" in x && Array.isArray(x.ref) ? String(x.ref[1] ?? "") : "";
    }), i = W(() => t.disabled || el(t.field)), n = z(!1), b = z(!1), w = z(!1), y = z(""), k = z(""), C = z([]), R = Na(), $ = z([]);
    let D = 0, E;
    const T = /* @__PURE__ */ new Set();
    Ee(v, (x) => {
      $.value = E ?? x.map((g, j) => $.value[j] ?? D++), E = void 0;
    }, { immediate: !0 });
    function V(x) {
      l("update:modelValue", x);
    }
    function P(x, g) {
      const j = [...v.value];
      j[x] = g, V(j);
    }
    function G(x, g) {
      g ? T.delete(x) : T.add(x), l("validity", !T.size);
    }
    function ce(x) {
      T.delete($.value[x]), l("validity", !T.size), E = $.value.filter((g, j) => j !== x), V(v.value.filter((g, j) => j !== x));
    }
    function re() {
      E = [...$.value, D++], V([...v.value, t.field.form === "bool" ? !1 : t.field.form === "record" ? {} : ""]);
    }
    function J(x) {
      const g = x.detail, j = g?.principal_id ?? g?.id;
      V(j ? { kind: g.type ?? "user", id: j } : void 0);
    }
    function O(x) {
      const g = x.detail;
      V(g?.thread_id ? { ref: ["component", g.thread_id] } : void 0);
    }
    const te = z("");
    let S = "";
    Ee(() => t.modelValue, (x) => {
      const g = JSON.stringify(x ?? {}, null, 2);
      g !== S && (S = g, te.value = g, y.value = "", l("validity", !0));
    }, { immediate: !0 });
    function A(x) {
      te.value = x;
      try {
        const g = JSON.parse(x);
        if (!g || typeof g != "object" || Array.isArray(g)) throw new Error("Enter a JSON object.");
        if (t.field.type === "rich_text" && !("type" in g && typeof g.type == "string")) throw new Error("The document needs a type.");
        S = JSON.stringify(g, null, 2), y.value = "", l("validity", !0), V(g);
      } catch (g) {
        y.value = g instanceof Error ? g.message : "Invalid JSON.", l("validity", !1);
      }
    }
    function N(x) {
      if (!x) {
        l("validity", !0), V(void 0);
        return;
      }
      const g = Number.isFinite(Number(x)) && (t.field.form !== "int" || Number.isSafeInteger(Number(x)));
      l("validity", g), g && V(t.field.form === "int" ? Number(x) : x);
    }
    const X = W(() => t.field.config?.format === "date");
    function de(x) {
      V(x ? X.value ? x : new Date(x).toISOString() : void 0);
    }
    const fe = W(() => {
      if (typeof t.modelValue != "string") return "";
      if (X.value) return t.modelValue.slice(0, 10);
      const x = new Date(t.modelValue);
      return Number.isNaN(x.getTime()) ? "" : new Date(x.getTime() - x.getTimezoneOffset() * 6e4).toISOString().slice(0, 16);
    });
    function be(x) {
      V(x.detail?.ref);
    }
    function xe(x) {
      V(x.detail?.value);
    }
    let Pe;
    Ee(k, () => {
      const x = R();
      if (clearTimeout(Pe), !k.value.trim()) {
        C.value = [];
        return;
      }
      Pe = setTimeout(async () => {
        try {
          const g = k.value.trim(), j = /^[A-Z][A-Z0-9]{1,9}-[0-9]+$/.test(g) ? [(await kt.item(t.boardId, { key: g })).item] : (await kt.query(t.boardId, { where: { field: "title", op: "contains", value: g }, limit: 8 })).items;
          x() && (C.value = j, y.value = "");
        } catch (g) {
          x() && (y.value = g instanceof Error ? g.message : "Could not search items.");
        }
      }, 200);
    });
    function p(x) {
      V({ board: t.boardId, item: x.id }), k.value = "", C.value = [];
    }
    ha(async () => {
      t.field.type === "principal" ? n.value = await Pt("wc-principal-picker") : t.field.config?.target === "component" && (n.value = await Pt("wc-component-picker"));
    });
    for (const [x, g] of [[() => t.editorTag, w], [() => t.linkTag, b]])
      Ee(x, async (j, Y, ne) => {
        let pe = !0;
        if (ne(() => {
          pe = !1;
        }), g.value = !1, j) {
          const ze = await Pt(j);
          pe && (g.value = ze);
        }
      }, { immediate: !0 });
    return yl(() => {
      clearTimeout(Pe), R();
    }), (x, g) => {
      const j = gl("FieldControl", !0);
      return m(), h("div", ai, [
        d(el)(e.field) ? (m(), h("output", {
          key: 0,
          id: o.value,
          class: "work-read-value"
        }, U(d(Ct)(e.modelValue, e.field)), 9, li)) : s.value ? (m(), h("div", oi, [
          u("div", ii, [
            (m(!0), h(q, null, _(v.value, (Y, ne) => (m(), B(d(Ae), {
              key: $.value[ne],
              class: "kx-tag-sm",
              severity: "secondary"
            }, {
              default: L(() => [
                M(U(d(Ct)(Y, e.field)) + " ", 1),
                f(d(K), {
                  type: "button",
                  class: "work-icon-button",
                  disabled: i.value,
                  "aria-label": "Remove value " + (ne + 1),
                  onClick: (pe) => ce(ne),
                  severity: "secondary",
                  text: "",
                  size: "small"
                }, {
                  default: L(() => [
                    f(d(Z), {
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
          (m(!0), h(q, null, _(v.value, (Y, ne) => (m(), h("div", {
            key: $.value[ne],
            class: "work-stack work-tight"
          }, [
            f(j, {
              "board-id": e.boardId,
              field: { ...e.field, cardinality: "one" },
              "model-value": Y,
              "input-id": o.value + "-" + $.value[ne],
              disabled: i.value,
              "editor-tag": e.editorTag,
              "link-tag": e.linkTag,
              "onUpdate:modelValue": (pe) => P(ne, pe),
              onValidity: (pe) => G($.value[ne], pe)
            }, null, 8, ["board-id", "field", "model-value", "input-id", "disabled", "editor-tag", "link-tag", "onUpdate:modelValue", "onValidity"])
          ]))), 128)),
          f(d(K), {
            label: "Add value",
            severity: "secondary",
            size: "small",
            disabled: i.value,
            onClick: re,
            outlined: ""
          }, {
            icon: L(() => [
              f(d(Z), {
                icon: "tabler:plus",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled"])
        ])) : e.editorTag && w.value ? (m(), B(Oa(e.editorTag), {
          key: 2,
          "board-id": e.boardId,
          value: JSON.stringify(e.modelValue ?? null),
          config: JSON.stringify(e.field.config ?? {}),
          readonly: i.value || void 0,
          onChange: xe
        }, null, 40, ["board-id", "value", "config", "readonly"])) : e.linkTag && b.value ? (m(), B(Oa(e.linkTag), {
          key: 3,
          "board-id": e.boardId,
          kind: e.field.config?.target ?? e.field.type,
          value: JSON.stringify(e.modelValue ?? null),
          readonly: i.value || void 0,
          onChange: be
        }, null, 40, ["board-id", "kind", "value", "readonly"])) : e.field.type === "option" ? (m(), B(d(ee), {
          key: 4,
          placeholder: "Not set",
          inputId: o.value,
          "model-value": e.modelValue ?? "",
          disabled: i.value,
          "onUpdate:modelValue": g[0] || (g[0] = (Y) => V(Y || void 0)),
          appendTo: "self",
          optionLabel: "label",
          optionValue: "value",
          optionDisabled: "disabled",
          options: [{ label: "Not set", value: "", disabled: !1 }, ...(e.field.options ?? []).map((Y) => ({ label: Y.label ?? Y.id, value: Y.id, disabled: !1 }))]
        }, null, 8, ["inputId", "model-value", "disabled", "options"])) : e.field.form === "bool" ? (m(), h("label", ni, [
          f(d(Ot), {
            inputId: o.value,
            "model-value": e.modelValue === !0,
            disabled: i.value,
            "onUpdate:modelValue": g[1] || (g[1] = (Y) => V(Y)),
            binary: ""
          }, null, 8, ["inputId", "model-value", "disabled"]),
          M(U(e.modelValue === !0 ? "Yes" : e.modelValue === !1 ? "No" : "Not set"), 1)
        ])) : e.field.form === "int" ? (m(), B(d(Ze), {
          key: 6,
          inputId: o.value,
          "model-value": c.value === "" ? null : Number(c.value),
          disabled: i.value,
          "onUpdate:modelValue": g[2] || (g[2] = (Y) => N(Y == null ? "" : String(Y))),
          useGrouping: !1
        }, null, 8, ["inputId", "model-value", "disabled"])) : e.field.form === "dec" ? (m(), B(d(se), {
          key: 7,
          id: o.value,
          inputmode: "decimal",
          "model-value": c.value,
          disabled: i.value,
          "onUpdate:modelValue": g[3] || (g[3] = (Y) => N(Y ?? ""))
        }, null, 8, ["id", "model-value", "disabled"])) : e.field.form === "time" ? (m(), B(d(se), {
          key: 8,
          id: o.value,
          type: X.value ? "date" : "datetime-local",
          value: fe.value,
          disabled: i.value,
          onInput: g[4] || (g[4] = (Y) => de(Y.target.value))
        }, null, 8, ["id", "type", "value", "disabled"])) : e.field.type === "principal" ? (m(), h("div", {
          key: 9,
          inert: i.value || void 0,
          class: "work-stack work-tight"
        }, [
          n.value ? (m(), h("wc-principal-picker", {
            key: 0,
            value: JSON.stringify(e.modelValue ?? {}),
            kinds: "user,group",
            onConfigChanged: J
          }, null, 40, ri)) : (m(), h("span", di, U(d(Ct)(e.modelValue, e.field)) + " · Person picker is unavailable.", 1))
        ], 8, si)) : e.field.config?.target === "component" ? (m(), h("div", {
          key: 10,
          inert: i.value || void 0
        }, [
          n.value ? (m(), h("wc-component-picker", {
            key: 0,
            value: JSON.stringify({ thread_id: r.value }),
            onChange: O
          }, null, 40, ci)) : (m(), h("span", mi, "Component picker is unavailable."))
        ], 8, ui)) : e.field.type === "item" ? (m(), h("div", vi, [
          f(d(Ae), {
            class: "kx-tag-sm",
            severity: "secondary"
          }, {
            default: L(() => [
              M(U(d(Ct)(e.modelValue, e.field)), 1)
            ]),
            _: 1
          }),
          f(d(se), {
            id: o.value,
            modelValue: k.value,
            "onUpdate:modelValue": g[5] || (g[5] = (Y) => k.value = Y),
            disabled: i.value,
            placeholder: "Search a title or enter an item key",
            "aria-label": "Search items"
          }, null, 8, ["id", "modelValue", "disabled"]),
          u("div", fi, [
            (m(!0), h(q, null, _(C.value, (Y) => (m(), B(qa, {
              key: Y.id,
              class: "work-match-item",
              disabled: i.value,
              onActivate: (ne) => p(Y)
            }, {
              default: L(() => [
                u("code", pi, U(Y.key), 1),
                u("span", null, U(d(Ct)(Y.values.title)), 1)
              ]),
              _: 2
            }, 1032, ["disabled", "onActivate"]))), 128))
          ]),
          e.modelValue ? (m(), B(d(K), {
            key: 0,
            label: "Clear reference",
            severity: "secondary",
            size: "small",
            disabled: i.value,
            onClick: g[6] || (g[6] = (Y) => V(void 0)),
            outlined: ""
          }, {
            icon: L(() => [
              f(d(Z), {
                icon: "tabler:list-check",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled"])) : I("", !0)
        ])) : e.field.form === "record" || e.field.type === "rich_text" || e.field.form === "quantity" || e.field.form === "ref" ? (m(), B(d(Xt), {
          key: 12,
          id: o.value,
          "model-value": te.value,
          rows: "3",
          disabled: i.value,
          "aria-invalid": !!y.value,
          "onUpdate:modelValue": g[7] || (g[7] = (Y) => A(Y ?? ""))
        }, null, 8, ["id", "model-value", "disabled", "aria-invalid"])) : e.field.code === "description" ? (m(), B(d(Xt), {
          key: 13,
          id: o.value,
          "model-value": c.value,
          rows: "4",
          disabled: i.value,
          "onUpdate:modelValue": g[8] || (g[8] = (Y) => V(Y))
        }, null, 8, ["id", "model-value", "disabled"])) : (m(), B(d(se), {
          key: 14,
          id: o.value,
          "model-value": c.value,
          disabled: i.value,
          "onUpdate:modelValue": g[9] || (g[9] = (Y) => V(Y))
        }, null, 8, ["id", "model-value", "disabled"])),
        y.value ? (m(), h("span", bi, U(y.value), 1)) : I("", !0)
      ]);
    };
  }
}), hi = { class: "work-stack work-tight work-operand-control" }, yi = { class: "work-row work-small" }, gi = {
  key: 1,
  class: "work-muted work-small"
}, ki = {
  key: 2,
  class: "work-stack work-tight"
}, wi = { class: "work-small" }, Vi = {
  key: 0,
  class: "work-error work-small",
  role: "alert"
}, Bt = /* @__PURE__ */ ue({
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
    const t = e, l = a, o = W(() => "$actor" in He(t.modelValue) ? "actor" : "$now" in He(t.modelValue) ? "now" : "literal"), s = z(""), v = z("");
    Ee(() => t.modelValue, (i) => {
      s.value = JSON.stringify(i ?? []), v.value = "";
    }, { immediate: !0 });
    function c(i) {
      l("update:modelValue", i === "actor" ? { $actor: "id" } : i === "now" ? { $now: "P0D" } : void 0), l("validity", !0);
    }
    function r(i) {
      s.value = i;
      try {
        const n = JSON.parse(i);
        if (!Array.isArray(n)) throw new Error("Enter a JSON list.");
        v.value = "", l("validity", !0), l("update:modelValue", n);
      } catch (n) {
        v.value = n instanceof Error ? n.message : "Invalid values.", l("validity", !1);
      }
    }
    return (i, n) => (m(), h("div", hi, [
      u("label", yi, [
        M(U(e.label), 1),
        f(d(ee), {
          "aria-label": e.label + " operand",
          "model-value": o.value,
          disabled: e.disabled,
          "onUpdate:modelValue": n[0] || (n[0] = (b) => c(b)),
          appendTo: "self",
          optionLabel: "label",
          optionValue: "value",
          optionDisabled: "disabled",
          options: [{ label: "Value", value: "literal", disabled: !1 }, { label: "Current actor ($actor)", value: "actor", disabled: !1 }, { label: "Current time ($now)", value: "now", disabled: !1 }]
        }, null, 8, ["aria-label", "model-value", "disabled"])
      ]),
      o.value === "now" ? (m(), B(d(se), {
        key: 0,
        "aria-label": e.label + " time offset",
        value: d(He)(e.modelValue).$now,
        disabled: e.disabled,
        placeholder: "-P7D",
        onInput: n[1] || (n[1] = (b) => l("update:modelValue", { $now: b.target.value }))
      }, null, 8, ["aria-label", "value", "disabled"])) : o.value === "actor" ? (m(), h("span", gi, "The signed-in actor’s id")) : e.multiple ? (m(), h("div", ki, [
        u("label", wi, [
          n[5] || (n[5] = M("Values as JSON (operands may appear in the list)", -1)),
          f(d(Xt), {
            class: "work-mono",
            "aria-label": e.label + " values",
            value: s.value,
            disabled: e.disabled,
            rows: "2",
            onInput: n[2] || (n[2] = (b) => r(b.target.value))
          }, null, 8, ["aria-label", "value", "disabled"])
        ]),
        v.value ? (m(), h("p", Vi, U(v.value), 1)) : I("", !0)
      ])) : (m(), B(El, {
        key: 3,
        "board-id": e.boardId,
        field: { ...e.field, cardinality: "one" },
        "model-value": e.modelValue,
        disabled: e.disabled,
        "input-id": e.label.replace(/[^a-z0-9]/gi, "-"),
        "onUpdate:modelValue": n[3] || (n[3] = (b) => l("update:modelValue", b)),
        onValidity: n[4] || (n[4] = (b) => l("validity", b))
      }, null, 8, ["board-id", "field", "model-value", "disabled", "input-id"]))
    ]));
  }
}), $i = ["disabled"], xi = { class: "work-small work-mono" }, Si = { class: "work-row work-small" }, Ci = { class: "work-row work-wrap" }, Ei = { key: 3 }, Ti = { class: "work-row work-wrap" }, Ui = { class: "work-row" }, Di = { class: "work-row" }, Ii = { class: "work-row" }, Ai = {
  key: 3,
  class: "work-row work-wrap"
}, Pi = { class: "work-row work-wrap" }, Oi = /* @__PURE__ */ ue({
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
    const t = e, l = a, o = W(() => t.path ?? "where"), s = W(() => t.depth ?? 1), v = W(() => ["and", "or", "not", "history", "match", "rel", "children"].find((J) => J in t.modelValue) ?? "field"), c = W(() => ei(t.schema)), r = W(() => c.value.find((J) => J.code === t.modelValue.field) ?? { code: "value", form: "text" }), i = W(() => He(t.modelValue.history)), n = W(() => c.value.find((J) => J.code === i.value.field) ?? { code: "history", form: "text" }), b = W(() => Array.isArray(t.modelValue[v.value]) ? t.modelValue[v.value] : []), w = () => ({ field: "category", op: "eq", value: "unstarted" }), y = z(/* @__PURE__ */ new Set());
    function k(J, O) {
      O ? y.value.delete(J) : y.value.add(J), l("validity", y.value.size === 0);
    }
    Ee(v, () => {
      y.value.clear(), l("validity", !0);
    });
    function C(J) {
      const O = /* @__PURE__ */ new Set();
      for (const te of y.value) {
        const S = Number(te);
        !Number.isNaN(S) && S !== J && O.add(String(S > J ? S - 1 : S));
      }
      y.value = O, l("validity", O.size === 0), $({ [v.value]: b.value.filter((te, S) => S !== J) });
    }
    function R(J) {
      l("update:modelValue", J);
    }
    function $(J) {
      R({ ...t.modelValue, ...J });
    }
    function D(J) {
      R(J === "field" ? w() : J === "and" || J === "or" ? { [J]: [w()] } : J === "not" ? { not: w() } : J === "history" ? { history: { field: "state", changed: !0 } } : J === "match" ? { match: "" } : J === "children" ? { children: !0, q: "some", where: w() } : { rel: t.schema.compiled.relation_types?.[0]?.id ?? "", dir: "outward", q: "some", where: w() });
    }
    function E(J, O) {
      $({ [v.value]: b.value.map((te, S) => S === J ? O : te) });
    }
    function T(J, O) {
      const te = { ...i.value };
      O === void 0 ? (delete te[J], k(J, !0)) : te[J] = O, $({ history: te });
    }
    function V(J) {
      y.value.clear(), l("validity", !0);
      const O = { ...i.value };
      delete O.was, delete O.changed, delete O.from, delete O.to, O[J] = J === "changed" ? !0 : "", $({ history: O });
    }
    const P = { code: "actor", form: "text" }, G = { code: "at", form: "time" }, ce = W(() => Array.isArray(i.value.during) ? i.value.during : []);
    function re(J, O) {
      const te = [...ce.value];
      te[J] = O, T("during", te);
    }
    return (J, O) => {
      const te = gl("FilterNode", !0);
      return m(), h("fieldset", {
        class: "work-filter-node",
        disabled: e.disabled
      }, [
        u("legend", xi, U(o.value), 1),
        u("label", Si, [
          O[21] || (O[21] = M("Condition", -1)),
          f(d(ee), {
            "aria-label": o.value + " condition",
            "model-value": v.value,
            "onUpdate:modelValue": O[0] || (O[0] = (S) => D(S)),
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            optionDisabled: "disabled",
            options: [{ label: "Field", value: "field", disabled: !1 }, ...["and", "or", "not", "history", "rel", "children", "match"].map((S) => ({ label: S, value: S, disabled: s.value >= 6 && ["and", "or", "not", "rel", "children"].includes(S) }))]
          }, null, 8, ["aria-label", "model-value", "options"])
        ]),
        v.value === "and" || v.value === "or" ? (m(), h(q, { key: 0 }, [
          (m(!0), h(q, null, _(b.value, (S, A) => (m(), h("div", {
            key: A,
            class: "work-stack work-tight"
          }, [
            f(te, {
              "board-id": e.boardId,
              schema: e.schema,
              "model-value": S,
              path: o.value + "." + v.value + "[" + A + "]",
              depth: s.value + 1,
              "onUpdate:modelValue": (N) => E(A, N),
              onValidity: (N) => k(String(A), N)
            }, null, 8, ["board-id", "schema", "model-value", "path", "depth", "onUpdate:modelValue", "onValidity"]),
            f(d(K), {
              label: "Remove condition",
              size: "small",
              severity: "secondary",
              onClick: (N) => C(A),
              outlined: ""
            }, {
              icon: L(() => [
                f(d(Z), {
                  icon: "tabler:trash",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["onClick"])
          ]))), 128)),
          f(d(K), {
            label: "Add condition",
            size: "small",
            severity: "secondary",
            disabled: s.value >= 6,
            onClick: O[1] || (O[1] = (S) => $({ [v.value]: [...b.value, w()] })),
            outlined: ""
          }, {
            icon: L(() => [
              f(d(Z), {
                icon: "tabler:plus",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled"])
        ], 64)) : v.value === "not" ? (m(), B(te, {
          key: 1,
          "board-id": e.boardId,
          schema: e.schema,
          "model-value": d(He)(e.modelValue.not),
          path: o.value + ".not",
          depth: s.value + 1,
          "onUpdate:modelValue": O[2] || (O[2] = (S) => $({ not: S })),
          onValidity: O[3] || (O[3] = (S) => k("nested", S))
        }, null, 8, ["board-id", "schema", "model-value", "path", "depth"])) : v.value === "field" ? (m(), h(q, { key: 2 }, [
          u("div", Ci, [
            u("label", null, [
              O[22] || (O[22] = M("Field", -1)),
              f(d(ee), {
                "aria-label": o.value + " field",
                "model-value": e.modelValue.field,
                "onUpdate:modelValue": O[4] || (O[4] = (S) => $({ field: S, op: "eq", value: void 0 })),
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                optionDisabled: "disabled",
                options: [...(c.value ?? []).map((S) => ({ label: d(Vt)(S), value: S.code, disabled: !1 }))]
              }, null, 8, ["aria-label", "model-value", "options"])
            ]),
            u("label", null, [
              O[23] || (O[23] = M("Operator", -1)),
              f(d(ee), {
                "aria-label": o.value + " operator",
                "model-value": e.modelValue.op,
                "onUpdate:modelValue": O[5] || (O[5] = (S) => $({ op: S, value: S === "is_null" ? !0 : void 0 })),
                appendTo: "self",
                options: d(ti)(r.value)
              }, null, 8, ["aria-label", "model-value", "options"])
            ])
          ]),
          f(Bt, {
            "board-id": e.boardId,
            field: e.modelValue.op === "is_null" ? { code: "null", form: "bool" } : r.value,
            "model-value": e.modelValue.value,
            multiple: ["in", "nin", "between"].includes(String(e.modelValue.op)),
            label: o.value + " value",
            "onUpdate:modelValue": O[6] || (O[6] = (S) => $({ value: S })),
            onValidity: O[7] || (O[7] = (S) => k("value", S))
          }, null, 8, ["board-id", "field", "model-value", "multiple", "label"])
        ], 64)) : v.value === "match" ? (m(), h("label", Ei, [
          O[24] || (O[24] = M("Search", -1)),
          f(d(se), {
            "aria-label": o.value + " search",
            value: e.modelValue.match,
            onInput: O[8] || (O[8] = (S) => $({ match: S.target.value }))
          }, null, 8, ["aria-label", "value"])
        ])) : v.value === "history" ? (m(), h(q, { key: 4 }, [
          u("div", Ti, [
            u("label", null, [
              O[25] || (O[25] = M("Field", -1)),
              f(d(ee), {
                "aria-label": o.value + " history field",
                "model-value": i.value.field,
                "onUpdate:modelValue": O[9] || (O[9] = (S) => T("field", S)),
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                optionDisabled: "disabled",
                options: [...(c.value ?? []).map((S) => ({ label: d(Vt)(S), value: S.code, disabled: !1 }))]
              }, null, 8, ["aria-label", "model-value", "options"])
            ]),
            u("label", null, [
              O[26] || (O[26] = M("History", -1)),
              f(d(ee), {
                "aria-label": o.value + " history mode",
                "model-value": i.value.changed ? "changed" : "was",
                "onUpdate:modelValue": O[10] || (O[10] = (S) => V(S)),
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                optionDisabled: "disabled",
                options: [{ label: "Changed", value: "changed", disabled: !1 }, { label: "Was", value: "was", disabled: !1 }]
              }, null, 8, ["aria-label", "model-value"])
            ])
          ]),
          i.value.changed ? (m(), h(q, { key: 0 }, _(["from", "to"], (S) => u("div", { key: S }, [
            u("label", Ui, [
              f(d(Ot), {
                "model-value": S in i.value,
                "aria-label": "Constrain " + S,
                "onUpdate:modelValue": (A) => T(S, A ? "" : void 0),
                binary: ""
              }, null, 8, ["model-value", "aria-label", "onUpdate:modelValue"]),
              M(U(S), 1)
            ]),
            S in i.value ? (m(), B(Bt, {
              key: 0,
              "board-id": e.boardId,
              field: n.value,
              "model-value": i.value[S],
              label: o.value + " history " + S,
              "onUpdate:modelValue": (A) => T(S, A),
              onValidity: (A) => k(S, A)
            }, null, 8, ["board-id", "field", "model-value", "label", "onUpdate:modelValue", "onValidity"])) : I("", !0)
          ])), 64)) : (m(), B(Bt, {
            key: 1,
            "board-id": e.boardId,
            field: n.value,
            "model-value": i.value.was,
            label: o.value + " history was",
            "onUpdate:modelValue": O[11] || (O[11] = (S) => T("was", S)),
            onValidity: O[12] || (O[12] = (S) => k("was", S))
          }, null, 8, ["board-id", "field", "model-value", "label"])),
          u("label", Di, [
            f(d(Ot), {
              "model-value": "by" in i.value,
              "aria-label": "Constrain actor",
              "onUpdate:modelValue": O[13] || (O[13] = (S) => T("by", S ? { $actor: "id" } : void 0)),
              binary: ""
            }, null, 8, ["model-value"]),
            O[27] || (O[27] = M("By actor", -1))
          ]),
          "by" in i.value ? (m(), B(Bt, {
            key: 2,
            "board-id": e.boardId,
            field: P,
            "model-value": i.value.by,
            label: o.value + " history by",
            "onUpdate:modelValue": O[14] || (O[14] = (S) => T("by", S))
          }, null, 8, ["board-id", "model-value", "label"])) : I("", !0),
          u("label", Ii, [
            f(d(Ot), {
              "model-value": "during" in i.value,
              "aria-label": "Constrain time window",
              "onUpdate:modelValue": O[15] || (O[15] = (S) => T("during", S ? [{ $now: "-P30D" }, { $now: "P0D" }] : void 0)),
              binary: ""
            }, null, 8, ["model-value"]),
            O[28] || (O[28] = M("During", -1))
          ]),
          "during" in i.value ? (m(), h("div", Ai, [
            (m(), h(q, null, _(["start", "end"], (S, A) => f(Bt, {
              key: S,
              "board-id": e.boardId,
              field: G,
              "model-value": ce.value[A],
              label: o.value + " during " + S,
              "onUpdate:modelValue": (N) => re(A, N)
            }, null, 8, ["board-id", "model-value", "label", "onUpdate:modelValue"])), 64))
          ])) : I("", !0)
        ], 64)) : (m(), h(q, { key: 5 }, [
          u("div", Pi, [
            v.value === "rel" ? (m(), h(q, { key: 0 }, [
              u("label", null, [
                O[29] || (O[29] = M("Relation", -1)),
                f(d(ee), {
                  "model-value": e.modelValue.rel,
                  "onUpdate:modelValue": O[16] || (O[16] = (S) => $({ rel: S })),
                  appendTo: "self",
                  optionLabel: "label",
                  optionValue: "value",
                  optionDisabled: "disabled",
                  options: [...(e.schema.compiled.relation_types ?? []).map((S) => ({ label: S.outward ?? S.id, value: S.id, disabled: !1 }))]
                }, null, 8, ["model-value", "options"])
              ]),
              u("label", null, [
                O[30] || (O[30] = M("Direction", -1)),
                f(d(ee), {
                  "model-value": e.modelValue.dir,
                  "onUpdate:modelValue": O[17] || (O[17] = (S) => $({ dir: S })),
                  appendTo: "self",
                  optionLabel: "label",
                  optionValue: "value",
                  optionDisabled: "disabled",
                  options: [{ label: "Outward", value: "outward", disabled: !1 }, { label: "Inward", value: "inward", disabled: !1 }]
                }, null, 8, ["model-value"])
              ])
            ], 64)) : I("", !0),
            u("label", null, [
              O[31] || (O[31] = M("Quantifier", -1)),
              f(d(ee), {
                "model-value": e.modelValue.q,
                "onUpdate:modelValue": O[18] || (O[18] = (S) => $({ q: S })),
                appendTo: "self",
                options: ["some", "every", "none"]
              }, null, 8, ["model-value"])
            ])
          ]),
          f(te, {
            "board-id": e.boardId,
            schema: e.schema,
            "model-value": d(He)(e.modelValue.where),
            path: o.value + ".where",
            depth: s.value + 1,
            "onUpdate:modelValue": O[19] || (O[19] = (S) => $({ where: S })),
            onValidity: O[20] || (O[20] = (S) => k("nested", S))
          }, null, 8, ["board-id", "schema", "model-value", "path", "depth"])
        ], 64))
      ], 8, $i);
    };
  }
}), Ri = { class: "work-stack work-tight" }, Ni = { class: "work-row work-small" }, Ya = /* @__PURE__ */ ue({
  __name: "ConditionEditor",
  props: {
    modelValue: {},
    draft: {},
    boardId: {},
    label: {}
  },
  emits: ["update:modelValue", "validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = W(() => ({ declaration: t.draft, compiled: t.draft, generation: 0, as_of: 0, key_prefix: "" })), s = /* @__PURE__ */ new Set();
    function v(r, i) {
      i ? s.delete(r) : s.add(r), l("validity", !s.size);
    }
    function c(r) {
      l("update:modelValue", r ? { field: t.draft.fields?.[0]?.code ?? "state", op: "eq" } : void 0), r || (s.clear(), l("validity", !0));
    }
    return $t(() => l("validity", !0)), (r, i) => (m(), h("section", Ri, [
      u("label", Ni, [
        f(d(Re), {
          "model-value": e.modelValue != null,
          "aria-label": e.label,
          "onUpdate:modelValue": c
        }, null, 8, ["model-value", "aria-label"]),
        M(U(e.label), 1)
      ]),
      e.modelValue != null ? (m(), B(Oi, {
        key: 0,
        schema: o.value,
        "board-id": e.boardId ?? "",
        "model-value": d(He)(e.modelValue),
        path: e.label,
        "onUpdate:modelValue": i[0] || (i[0] = (n) => l("update:modelValue", n)),
        onValidity: i[1] || (i[1] = (n) => v("structured", n))
      }, null, 8, ["schema", "board-id", "model-value", "path"])) : I("", !0),
      e.modelValue != null ? (m(), B(ot, {
        key: 1,
        label: e.label + " predicate",
        "model-value": e.modelValue,
        hint: "Use any predicate accepted by Work, including installed or deeply nested forms.",
        "onUpdate:modelValue": i[2] || (i[2] = (n) => l("update:modelValue", n)),
        onValidity: i[3] || (i[3] = (n) => v("raw", n))
      }, null, 8, ["label", "model-value"])) : I("", !0)
    ]));
  }
}), Mi = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, Li = ["aria-label"], zi = { class: "work-field-label" }, Bi = {
  key: 0,
  class: "work-chips"
}, Fi = ["kinds"], ji = {
  key: 2,
  class: "work-muted work-small"
}, Ha = /* @__PURE__ */ ue({
  __name: "PrincipalsPicker",
  props: {
    modelValue: {},
    label: {},
    kinds: {},
    boardId: {}
  },
  emits: ["update:modelValue"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = z(!1), s = z(0), v = W(() => t.modelValue ?? []), { principalLabel: c, rememberPrincipal: r, nameError: i } = wl(() => t.boardId ?? "", () => v.value);
    ha(async () => {
      o.value = await Pt("wc-principal-picker");
    });
    function n(b) {
      const w = b.detail, y = w?.principal_id ?? w?.id;
      if (!y) return;
      const k = { kind: w.type ?? "user", id: y };
      w.label && r(k, w.label), v.value.some((C) => C.id === y && C.kind === k.kind) || l("update:modelValue", [...v.value, k]), s.value++;
    }
    return (b, w) => (m(), h(q, null, [
      d(i) ? (m(), h("p", Mi, U(d(i)), 1)) : I("", !0),
      u("section", {
        class: "work-stack work-tight work-principals-picker",
        "aria-label": e.label
      }, [
        u("h4", zi, U(e.label), 1),
        v.value.length ? (m(), h("div", Bi, [
          (m(!0), h(q, null, _(v.value, (y, k) => (m(), B(d(Ae), {
            key: y.kind + y.id,
            severity: "secondary",
            class: "kx-tag-sm"
          }, {
            default: L(() => [
              M(U(d(c)(y)), 1),
              f(d(K), {
                text: "",
                severity: "secondary",
                size: "small",
                "aria-label": "Remove " + d(c)(y),
                onClick: (C) => l("update:modelValue", v.value.filter((R, $) => $ !== k))
              }, {
                default: L(() => [
                  f(d(Z), { icon: "tabler:x" })
                ]),
                _: 1
              }, 8, ["aria-label", "onClick"])
            ]),
            _: 2
          }, 1024))), 128))
        ])) : I("", !0),
        o.value ? (m(), h("wc-principal-picker", {
          key: s.value,
          kinds: e.kinds ?? "user,group",
          onConfigChanged: n
        }, null, 40, Fi)) : (m(), h("p", ji, "People and group picker is unavailable."))
      ], 8, Li)
    ], 64));
  }
}), qi = { class: "work-stack work-tight" }, Tl = /* @__PURE__ */ ue({
  __name: "HoldersPicker",
  props: {
    modelValue: {},
    label: {},
    boardId: {}
  },
  emits: ["update:modelValue", "validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = W(() => (t.modelValue ?? []).flatMap((v) => "user" in v ? [{ kind: "user", id: v.user }] : "group" in v ? [{ kind: "group", id: v.group }] : []));
    function s(v) {
      const c = [...(t.modelValue ?? []).filter((r) => "field" in r || "service" in r), ...v.map((r) => r.kind === "group" ? { group: r.id } : { user: r.id })];
      l("update:modelValue", c.length ? c : void 0);
    }
    return (v, c) => (m(), h("div", qi, [
      f(Ha, {
        "board-id": e.boardId,
        label: e.label,
        "model-value": o.value,
        "onUpdate:modelValue": s
      }, null, 8, ["board-id", "label", "model-value"]),
      f(ot, {
        label: e.label + " rules",
        "model-value": e.modelValue,
        shape: "array",
        example: [{ group: "selected-group" }],
        "onUpdate:modelValue": c[0] || (c[0] = (r) => l("update:modelValue", r)),
        onValidity: c[1] || (c[1] = (r) => l("validity", r))
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
function Wi(e, a, t) {
  return (a = Ki(a)) in e ? Object.defineProperty(e, a, {
    value: t,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : e[a] = t, e;
}
function it() {
  return it = Object.assign ? Object.assign.bind() : function(e) {
    for (var a = 1; a < arguments.length; a++) {
      var t = arguments[a];
      for (var l in t) ({}).hasOwnProperty.call(t, l) && (e[l] = t[l]);
    }
    return e;
  }, it.apply(null, arguments);
}
function il(e, a) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(e);
    a && (l = l.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), t.push.apply(t, l);
  }
  return t;
}
function tt(e) {
  for (var a = 1; a < arguments.length; a++) {
    var t = arguments[a] != null ? arguments[a] : {};
    a % 2 ? il(Object(t), !0).forEach(function(l) {
      Wi(e, l, t[l]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : il(Object(t)).forEach(function(l) {
      Object.defineProperty(e, l, Object.getOwnPropertyDescriptor(t, l));
    });
  }
  return e;
}
function Gi(e, a) {
  if (e == null) return {};
  var t, l, o = Yi(e, a);
  if (Object.getOwnPropertySymbols) {
    var s = Object.getOwnPropertySymbols(e);
    for (l = 0; l < s.length; l++) t = s[l], a.indexOf(t) === -1 && {}.propertyIsEnumerable.call(e, t) && (o[t] = e[t]);
  }
  return o;
}
function Yi(e, a) {
  if (e == null) return {};
  var t = {};
  for (var l in e) if ({}.hasOwnProperty.call(e, l)) {
    if (a.indexOf(l) !== -1) continue;
    t[l] = e[l];
  }
  return t;
}
function Hi(e, a) {
  if (typeof e != "object" || !e) return e;
  var t = e[Symbol.toPrimitive];
  if (t !== void 0) {
    var l = t.call(e, a);
    if (typeof l != "object") return l;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (a === "string" ? String : Number)(e);
}
function Ki(e) {
  var a = Hi(e, "string");
  return typeof a == "symbol" ? a : a + "";
}
function Ma(e) {
  "@babel/helpers - typeof";
  return Ma = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(a) {
    return typeof a;
  } : function(a) {
    return a && typeof Symbol == "function" && a.constructor === Symbol && a !== Symbol.prototype ? "symbol" : typeof a;
  }, Ma(e);
}
var Xi = "1.15.7";
function lt(e) {
  if (typeof window < "u" && window.navigator)
    return !!/* @__PURE__ */ navigator.userAgent.match(e);
}
var nt = lt(/(?:Trident.*rv[ :]?11\.|msie|iemobile|Windows Phone)/i), Zt = lt(/Edge/i), nl = lt(/firefox/i), Wt = lt(/safari/i) && !lt(/chrome/i) && !lt(/android/i), Ka = lt(/iP(ad|od|hone)/i), Ul = lt(/chrome/i) && lt(/android/i), Dl = {
  capture: !1,
  passive: !1
};
function ve(e, a, t) {
  e.addEventListener(a, t, !nt && Dl);
}
function me(e, a, t) {
  e.removeEventListener(a, t, !nt && Dl);
}
function ca(e, a) {
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
function Il(e) {
  return e.host && e !== document && e.host.nodeType && e.host !== e ? e.host : e.parentNode;
}
function Je(e, a, t, l) {
  if (e) {
    t = t || document;
    do {
      if (a != null && (a[0] === ">" ? e.parentNode === t && ca(e, a) : ca(e, a)) || l && e === t)
        return e;
      if (e === t) break;
    } while (e = Il(e));
  }
  return null;
}
var sl = /\s+/g;
function Fe(e, a, t) {
  if (e && a)
    if (e.classList)
      e.classList[t ? "add" : "remove"](a);
    else {
      var l = (" " + e.className + " ").replace(sl, " ").replace(" " + a + " ", " ");
      e.className = (l + (t ? " " + a : "")).replace(sl, " ");
    }
}
function ae(e, a, t) {
  var l = e && e.style;
  if (l) {
    if (t === void 0)
      return document.defaultView && document.defaultView.getComputedStyle ? t = document.defaultView.getComputedStyle(e, "") : e.currentStyle && (t = e.currentStyle), a === void 0 ? t : t[a];
    !(a in l) && a.indexOf("webkit") === -1 && (a = "-webkit-" + a), l[a] = t + (typeof t == "string" ? "" : "px");
  }
}
function Rt(e, a) {
  var t = "";
  if (typeof e == "string")
    t = e;
  else
    do {
      var l = ae(e, "transform");
      l && l !== "none" && (t = l + " " + t);
    } while (!a && (e = e.parentNode));
  var o = window.DOMMatrix || window.WebKitCSSMatrix || window.CSSMatrix || window.MSCSSMatrix;
  return o && new o(t);
}
function Al(e, a, t) {
  if (e) {
    var l = e.getElementsByTagName(a), o = 0, s = l.length;
    if (t)
      for (; o < s; o++)
        t(l[o], o);
    return l;
  }
  return [];
}
function et() {
  var e = document.scrollingElement;
  return e || document.documentElement;
}
function Ce(e, a, t, l, o) {
  if (!(!e.getBoundingClientRect && e !== window)) {
    var s, v, c, r, i, n, b;
    if (e !== window && e.parentNode && e !== et() ? (s = e.getBoundingClientRect(), v = s.top, c = s.left, r = s.bottom, i = s.right, n = s.height, b = s.width) : (v = 0, c = 0, r = window.innerHeight, i = window.innerWidth, n = window.innerHeight, b = window.innerWidth), (a || t) && e !== window && (o = o || e.parentNode, !nt))
      do
        if (o && o.getBoundingClientRect && (ae(o, "transform") !== "none" || t && ae(o, "position") !== "static")) {
          var w = o.getBoundingClientRect();
          v -= w.top + parseInt(ae(o, "border-top-width")), c -= w.left + parseInt(ae(o, "border-left-width")), r = v + s.height, i = c + s.width;
          break;
        }
      while (o = o.parentNode);
    if (l && e !== window) {
      var y = Rt(o || e), k = y && y.a, C = y && y.d;
      y && (v /= C, c /= k, b /= k, n /= C, r = v + n, i = c + b);
    }
    return {
      top: v,
      left: c,
      bottom: r,
      right: i,
      width: b,
      height: n
    };
  }
}
function rl(e, a, t) {
  for (var l = ut(e, !0), o = Ce(e)[a]; l; ) {
    var s = Ce(l)[t], v = void 0;
    if (v = o >= s, !v) return l;
    if (l === et()) break;
    l = ut(l, !1);
  }
  return !1;
}
function Mt(e, a, t, l) {
  for (var o = 0, s = 0, v = e.children; s < v.length; ) {
    if (v[s].style.display !== "none" && v[s] !== le.ghost && (l || v[s] !== le.dragged) && Je(v[s], t.draggable, e, !1)) {
      if (o === a)
        return v[s];
      o++;
    }
    s++;
  }
  return null;
}
function Xa(e, a) {
  for (var t = e.lastElementChild; t && (t === le.ghost || ae(t, "display") === "none" || a && !ca(t, a)); )
    t = t.previousElementSibling;
  return t || null;
}
function Ge(e, a) {
  var t = 0;
  if (!e || !e.parentNode)
    return -1;
  for (; e = e.previousElementSibling; )
    e.nodeName.toUpperCase() !== "TEMPLATE" && e !== le.clone && (!a || ca(e, a)) && t++;
  return t;
}
function dl(e) {
  var a = 0, t = 0, l = et();
  if (e)
    do {
      var o = Rt(e), s = o.a, v = o.d;
      a += e.scrollLeft * s, t += e.scrollTop * v;
    } while (e !== l && (e = e.parentNode));
  return [a, t];
}
function Ji(e, a) {
  for (var t in e)
    if (e.hasOwnProperty(t)) {
      for (var l in a)
        if (a.hasOwnProperty(l) && a[l] === e[t][l]) return Number(t);
    }
  return -1;
}
function ut(e, a) {
  if (!e || !e.getBoundingClientRect) return et();
  var t = e, l = !1;
  do
    if (t.clientWidth < t.scrollWidth || t.clientHeight < t.scrollHeight) {
      var o = ae(t);
      if (t.clientWidth < t.scrollWidth && (o.overflowX == "auto" || o.overflowX == "scroll") || t.clientHeight < t.scrollHeight && (o.overflowY == "auto" || o.overflowY == "scroll")) {
        if (!t.getBoundingClientRect || t === document.body) return et();
        if (l || a) return t;
        l = !0;
      }
    }
  while (t = t.parentNode);
  return et();
}
function Zi(e, a) {
  if (e && a)
    for (var t in a)
      a.hasOwnProperty(t) && (e[t] = a[t]);
  return e;
}
function Sa(e, a) {
  return Math.round(e.top) === Math.round(a.top) && Math.round(e.left) === Math.round(a.left) && Math.round(e.height) === Math.round(a.height) && Math.round(e.width) === Math.round(a.width);
}
var Gt;
function Pl(e, a) {
  return function() {
    if (!Gt) {
      var t = arguments, l = this;
      t.length === 1 ? e.call(l, t[0]) : e.apply(l, t), Gt = setTimeout(function() {
        Gt = void 0;
      }, a);
    }
  };
}
function Qi() {
  clearTimeout(Gt), Gt = void 0;
}
function Ol(e, a, t) {
  e.scrollLeft += a, e.scrollTop += t;
}
function Rl(e) {
  var a = window.Polymer, t = window.jQuery || window.Zepto;
  return a && a.dom ? a.dom(e).cloneNode(!0) : t ? t(e).clone(!0)[0] : e.cloneNode(!0);
}
function Nl(e, a, t) {
  var l = {};
  return Array.from(e.children).forEach(function(o) {
    var s, v, c, r;
    if (!(!Je(o, a.draggable, e, !1) || o.animated || o === t)) {
      var i = Ce(o);
      l.left = Math.min((s = l.left) !== null && s !== void 0 ? s : 1 / 0, i.left), l.top = Math.min((v = l.top) !== null && v !== void 0 ? v : 1 / 0, i.top), l.right = Math.max((c = l.right) !== null && c !== void 0 ? c : -1 / 0, i.right), l.bottom = Math.max((r = l.bottom) !== null && r !== void 0 ? r : -1 / 0, i.bottom);
    }
  }), l.width = l.right - l.left, l.height = l.bottom - l.top, l.x = l.left, l.y = l.top, l;
}
var Le = "Sortable" + (/* @__PURE__ */ new Date()).getTime();
function _i() {
  var e = [], a;
  return {
    captureAnimationState: function() {
      if (e = [], !!this.options.animation) {
        var l = [].slice.call(this.el.children);
        l.forEach(function(o) {
          if (!(ae(o, "display") === "none" || o === le.ghost)) {
            e.push({
              target: o,
              rect: Ce(o)
            });
            var s = tt({}, e[e.length - 1].rect);
            if (o.thisAnimationDuration) {
              var v = Rt(o, !0);
              v && (s.top -= v.f, s.left -= v.e);
            }
            o.fromRect = s;
          }
        });
      }
    },
    addAnimationState: function(l) {
      e.push(l);
    },
    removeAnimationState: function(l) {
      e.splice(Ji(e, {
        target: l
      }), 1);
    },
    animateAll: function(l) {
      var o = this;
      if (!this.options.animation) {
        clearTimeout(a), typeof l == "function" && l();
        return;
      }
      var s = !1, v = 0;
      e.forEach(function(c) {
        var r = 0, i = c.target, n = i.fromRect, b = Ce(i), w = i.prevFromRect, y = i.prevToRect, k = c.rect, C = Rt(i, !0);
        C && (b.top -= C.f, b.left -= C.e), i.toRect = b, i.thisAnimationDuration && Sa(w, b) && !Sa(n, b) && // Make sure animatingRect is on line between toRect & fromRect
        (k.top - b.top) / (k.left - b.left) === (n.top - b.top) / (n.left - b.left) && (r = tn(k, w, y, o.options)), Sa(b, n) || (i.prevFromRect = n, i.prevToRect = b, r || (r = o.options.animation), o.animate(i, k, b, r)), r && (s = !0, v = Math.max(v, r), clearTimeout(i.animationResetTimer), i.animationResetTimer = setTimeout(function() {
          i.animationTime = 0, i.prevFromRect = null, i.fromRect = null, i.prevToRect = null, i.thisAnimationDuration = null;
        }, r), i.thisAnimationDuration = r);
      }), clearTimeout(a), s ? a = setTimeout(function() {
        typeof l == "function" && l();
      }, v) : typeof l == "function" && l(), e = [];
    },
    animate: function(l, o, s, v) {
      if (v) {
        ae(l, "transition", ""), ae(l, "transform", "");
        var c = Rt(this.el), r = c && c.a, i = c && c.d, n = (o.left - s.left) / (r || 1), b = (o.top - s.top) / (i || 1);
        l.animatingX = !!n, l.animatingY = !!b, ae(l, "transform", "translate3d(" + n + "px," + b + "px,0)"), this.forRepaintDummy = en(l), ae(l, "transition", "transform " + v + "ms" + (this.options.easing ? " " + this.options.easing : "")), ae(l, "transform", "translate3d(0,0,0)"), typeof l.animated == "number" && clearTimeout(l.animated), l.animated = setTimeout(function() {
          ae(l, "transition", ""), ae(l, "transform", ""), l.animated = !1, l.animatingX = !1, l.animatingY = !1;
        }, v);
      }
    }
  };
}
function en(e) {
  return e.offsetWidth;
}
function tn(e, a, t, l) {
  return Math.sqrt(Math.pow(a.top - e.top, 2) + Math.pow(a.left - e.left, 2)) / Math.sqrt(Math.pow(a.top - t.top, 2) + Math.pow(a.left - t.left, 2)) * l.animation;
}
var Tt = [], Ca = {
  initializeByDefault: !0
}, Qt = {
  mount: function(a) {
    for (var t in Ca)
      Ca.hasOwnProperty(t) && !(t in a) && (a[t] = Ca[t]);
    Tt.forEach(function(l) {
      if (l.pluginName === a.pluginName)
        throw "Sortable: Cannot mount plugin ".concat(a.pluginName, " more than once");
    }), Tt.push(a);
  },
  pluginEvent: function(a, t, l) {
    var o = this;
    this.eventCanceled = !1, l.cancel = function() {
      o.eventCanceled = !0;
    };
    var s = a + "Global";
    Tt.forEach(function(v) {
      t[v.pluginName] && (t[v.pluginName][s] && t[v.pluginName][s](tt({
        sortable: t
      }, l)), t.options[v.pluginName] && t[v.pluginName][a] && t[v.pluginName][a](tt({
        sortable: t
      }, l)));
    });
  },
  initializePlugins: function(a, t, l, o) {
    Tt.forEach(function(c) {
      var r = c.pluginName;
      if (!(!a.options[r] && !c.initializeByDefault)) {
        var i = new c(a, t, a.options);
        i.sortable = a, i.options = a.options, a[r] = i, it(l, i.defaults);
      }
    });
    for (var s in a.options)
      if (a.options.hasOwnProperty(s)) {
        var v = this.modifyOption(a, s, a.options[s]);
        typeof v < "u" && (a.options[s] = v);
      }
  },
  getEventProperties: function(a, t) {
    var l = {};
    return Tt.forEach(function(o) {
      typeof o.eventProperties == "function" && it(l, o.eventProperties.call(t[o.pluginName], a));
    }), l;
  },
  modifyOption: function(a, t, l) {
    var o;
    return Tt.forEach(function(s) {
      a[s.pluginName] && s.optionListeners && typeof s.optionListeners[t] == "function" && (o = s.optionListeners[t].call(a[s.pluginName], l));
    }), o;
  }
};
function an(e) {
  var a = e.sortable, t = e.rootEl, l = e.name, o = e.targetEl, s = e.cloneEl, v = e.toEl, c = e.fromEl, r = e.oldIndex, i = e.newIndex, n = e.oldDraggableIndex, b = e.newDraggableIndex, w = e.originalEvent, y = e.putSortable, k = e.extraEventProperties;
  if (a = a || t && t[Le], !!a) {
    var C, R = a.options, $ = "on" + l.charAt(0).toUpperCase() + l.substr(1);
    window.CustomEvent && !nt && !Zt ? C = new CustomEvent(l, {
      bubbles: !0,
      cancelable: !0
    }) : (C = document.createEvent("Event"), C.initEvent(l, !0, !0)), C.to = v || t, C.from = c || t, C.item = o || t, C.clone = s, C.oldIndex = r, C.newIndex = i, C.oldDraggableIndex = n, C.newDraggableIndex = b, C.originalEvent = w, C.pullMode = y ? y.lastPutMode : void 0;
    var D = tt(tt({}, k), Qt.getEventProperties(l, a));
    for (var E in D)
      C[E] = D[E];
    t && t.dispatchEvent(C), R[$] && R[$].call(a, C);
  }
}
var ln = ["evt"], Me = function(a, t) {
  var l = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, o = l.evt, s = Gi(l, ln);
  Qt.pluginEvent.bind(le)(a, t, tt({
    dragEl: F,
    parentEl: Ve,
    ghostEl: oe,
    rootEl: ke,
    nextEl: yt,
    lastDownEl: sa,
    cloneEl: we,
    cloneHidden: dt,
    dragStarted: Ft,
    putSortable: Ue,
    activeSortable: le.active,
    originalEvent: o,
    oldIndex: At,
    oldDraggableIndex: Yt,
    newIndex: je,
    newDraggableIndex: rt,
    hideGhostForTarget: Bl,
    unhideGhostForTarget: Fl,
    cloneNowHidden: function() {
      dt = !0;
    },
    cloneNowShown: function() {
      dt = !1;
    },
    dispatchSortableEvent: function(c) {
      Oe({
        sortable: t,
        name: c,
        originalEvent: o
      });
    }
  }, s));
};
function Oe(e) {
  an(tt({
    putSortable: Ue,
    cloneEl: we,
    targetEl: F,
    rootEl: ke,
    oldIndex: At,
    oldDraggableIndex: Yt,
    newIndex: je,
    newDraggableIndex: rt
  }, e));
}
var F, Ve, oe, ke, yt, sa, we, dt, At, je, Yt, rt, aa, Ue, Dt = !1, ma = !1, va = [], ft, Xe, Ea, Ta, ul, cl, Ft, Ut, Ht, Kt = !1, la = !1, ra, De, Ua = [], La = !1, fa = [], wa = typeof document < "u", oa = Ka, ml = Zt || nt ? "cssFloat" : "float", on = wa && !Ul && !Ka && "draggable" in document.createElement("div"), Ml = (function() {
  if (wa) {
    if (nt)
      return !1;
    var e = document.createElement("x");
    return e.style.cssText = "pointer-events:auto", e.style.pointerEvents === "auto";
  }
})(), Ll = function(a, t) {
  var l = ae(a), o = parseInt(l.width) - parseInt(l.paddingLeft) - parseInt(l.paddingRight) - parseInt(l.borderLeftWidth) - parseInt(l.borderRightWidth), s = Mt(a, 0, t), v = Mt(a, 1, t), c = s && ae(s), r = v && ae(v), i = c && parseInt(c.marginLeft) + parseInt(c.marginRight) + Ce(s).width, n = r && parseInt(r.marginLeft) + parseInt(r.marginRight) + Ce(v).width;
  if (l.display === "flex")
    return l.flexDirection === "column" || l.flexDirection === "column-reverse" ? "vertical" : "horizontal";
  if (l.display === "grid")
    return l.gridTemplateColumns.split(" ").length <= 1 ? "vertical" : "horizontal";
  if (s && c.float && c.float !== "none") {
    var b = c.float === "left" ? "left" : "right";
    return v && (r.clear === "both" || r.clear === b) ? "vertical" : "horizontal";
  }
  return s && (c.display === "block" || c.display === "flex" || c.display === "table" || c.display === "grid" || i >= o && l[ml] === "none" || v && l[ml] === "none" && i + n > o) ? "vertical" : "horizontal";
}, nn = function(a, t, l) {
  var o = l ? a.left : a.top, s = l ? a.right : a.bottom, v = l ? a.width : a.height, c = l ? t.left : t.top, r = l ? t.right : t.bottom, i = l ? t.width : t.height;
  return o === c || s === r || o + v / 2 === c + i / 2;
}, sn = function(a, t) {
  var l;
  return va.some(function(o) {
    var s = o[Le].options.emptyInsertThreshold;
    if (!(!s || Xa(o))) {
      var v = Ce(o), c = a >= v.left - s && a <= v.right + s, r = t >= v.top - s && t <= v.bottom + s;
      if (c && r)
        return l = o;
    }
  }), l;
}, zl = function(a) {
  function t(s, v) {
    return function(c, r, i, n) {
      var b = c.options.group.name && r.options.group.name && c.options.group.name === r.options.group.name;
      if (s == null && (v || b))
        return !0;
      if (s == null || s === !1)
        return !1;
      if (v && s === "clone")
        return s;
      if (typeof s == "function")
        return t(s(c, r, i, n), v)(c, r, i, n);
      var w = (v ? c : r).options.group.name;
      return s === !0 || typeof s == "string" && s === w || s.join && s.indexOf(w) > -1;
    };
  }
  var l = {}, o = a.group;
  (!o || Ma(o) != "object") && (o = {
    name: o
  }), l.name = o.name, l.checkPull = t(o.pull, !0), l.checkPut = t(o.put), l.revertClone = o.revertClone, a.group = l;
}, Bl = function() {
  !Ml && oe && ae(oe, "display", "none");
}, Fl = function() {
  !Ml && oe && ae(oe, "display", "");
};
wa && !Ul && document.addEventListener("click", function(e) {
  if (ma)
    return e.preventDefault(), e.stopPropagation && e.stopPropagation(), e.stopImmediatePropagation && e.stopImmediatePropagation(), ma = !1, !1;
}, !0);
var pt = function(a) {
  if (F) {
    a = a.touches ? a.touches[0] : a;
    var t = sn(a.clientX, a.clientY);
    if (t) {
      var l = {};
      for (var o in a)
        a.hasOwnProperty(o) && (l[o] = a[o]);
      l.target = l.rootEl = t, l.preventDefault = void 0, l.stopPropagation = void 0, t[Le]._onDragOver(l);
    }
  }
}, rn = function(a) {
  F && F.parentNode[Le]._isOutsideThisEl(a.target);
};
function le(e, a) {
  if (!(e && e.nodeType && e.nodeType === 1))
    throw "Sortable: `el` must be an HTMLElement, not ".concat({}.toString.call(e));
  this.el = e, this.options = a = it({}, a), e[Le] = this;
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
      return Ll(e, this.options);
    },
    ghostClass: "sortable-ghost",
    chosenClass: "sortable-chosen",
    dragClass: "sortable-drag",
    ignore: "a, img",
    filter: null,
    preventOnFilter: !0,
    animation: 0,
    easing: null,
    setData: function(v, c) {
      v.setData("Text", c.textContent);
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
    supportPointer: le.supportPointer !== !1 && "PointerEvent" in window && (!Wt || Ka),
    emptyInsertThreshold: 5
  };
  Qt.initializePlugins(this, e, t);
  for (var l in t)
    !(l in a) && (a[l] = t[l]);
  zl(a);
  for (var o in this)
    o.charAt(0) === "_" && typeof this[o] == "function" && (this[o] = this[o].bind(this));
  this.nativeDraggable = a.forceFallback ? !1 : on, this.nativeDraggable && (this.options.touchStartThreshold = 1), a.supportPointer ? ve(e, "pointerdown", this._onTapStart) : (ve(e, "mousedown", this._onTapStart), ve(e, "touchstart", this._onTapStart)), this.nativeDraggable && (ve(e, "dragover", this), ve(e, "dragenter", this)), va.push(this.el), a.store && a.store.get && this.sort(a.store.get(this) || []), it(this, _i());
}
le.prototype = /** @lends Sortable.prototype */
{
  constructor: le,
  _isOutsideThisEl: function(a) {
    !this.el.contains(a) && a !== this.el && (Ut = null);
  },
  _getDirection: function(a, t) {
    return typeof this.options.direction == "function" ? this.options.direction.call(this, a, t, F) : this.options.direction;
  },
  _onTapStart: function(a) {
    if (a.cancelable) {
      var t = this, l = this.el, o = this.options, s = o.preventOnFilter, v = a.type, c = a.touches && a.touches[0] || a.pointerType && a.pointerType === "touch" && a, r = (c || a).target, i = a.target.shadowRoot && (a.path && a.path[0] || a.composedPath && a.composedPath()[0]) || r, n = o.filter;
      if (bn(l), !F && !(/mousedown|pointerdown/.test(v) && a.button !== 0 || o.disabled) && !i.isContentEditable && !(!this.nativeDraggable && Wt && r && r.tagName.toUpperCase() === "SELECT") && (r = Je(r, o.draggable, l, !1), !(r && r.animated) && sa !== r)) {
        if (At = Ge(r), Yt = Ge(r, o.draggable), typeof n == "function") {
          if (n.call(this, a, r, this)) {
            Oe({
              sortable: t,
              rootEl: i,
              name: "filter",
              targetEl: r,
              toEl: l,
              fromEl: l
            }), Me("filter", t, {
              evt: a
            }), s && a.preventDefault();
            return;
          }
        } else if (n && (n = n.split(",").some(function(b) {
          if (b = Je(i, b.trim(), l, !1), b)
            return Oe({
              sortable: t,
              rootEl: b,
              name: "filter",
              targetEl: r,
              fromEl: l,
              toEl: l
            }), Me("filter", t, {
              evt: a
            }), !0;
        }), n)) {
          s && a.preventDefault();
          return;
        }
        o.handle && !Je(i, o.handle, l, !1) || this._prepareDragStart(a, c, r);
      }
    }
  },
  _prepareDragStart: function(a, t, l) {
    var o = this, s = o.el, v = o.options, c = s.ownerDocument, r;
    if (l && !F && l.parentNode === s) {
      var i = Ce(l);
      if (ke = s, F = l, Ve = F.parentNode, yt = F.nextSibling, sa = l, aa = v.group, le.dragged = F, ft = {
        target: F,
        clientX: (t || a).clientX,
        clientY: (t || a).clientY
      }, ul = ft.clientX - i.left, cl = ft.clientY - i.top, this._lastX = (t || a).clientX, this._lastY = (t || a).clientY, F.style["will-change"] = "all", r = function() {
        if (Me("delayEnded", o, {
          evt: a
        }), le.eventCanceled) {
          o._onDrop();
          return;
        }
        o._disableDelayedDragEvents(), !nl && o.nativeDraggable && (F.draggable = !0), o._triggerDragStart(a, t), Oe({
          sortable: o,
          name: "choose",
          originalEvent: a
        }), Fe(F, v.chosenClass, !0);
      }, v.ignore.split(",").forEach(function(n) {
        Al(F, n.trim(), Da);
      }), ve(c, "dragover", pt), ve(c, "mousemove", pt), ve(c, "touchmove", pt), v.supportPointer ? (ve(c, "pointerup", o._onDrop), !this.nativeDraggable && ve(c, "pointercancel", o._onDrop)) : (ve(c, "mouseup", o._onDrop), ve(c, "touchend", o._onDrop), ve(c, "touchcancel", o._onDrop)), nl && this.nativeDraggable && (this.options.touchStartThreshold = 4, F.draggable = !0), Me("delayStart", this, {
        evt: a
      }), v.delay && (!v.delayOnTouchOnly || t) && (!this.nativeDraggable || !(Zt || nt))) {
        if (le.eventCanceled) {
          this._onDrop();
          return;
        }
        v.supportPointer ? (ve(c, "pointerup", o._disableDelayedDrag), ve(c, "pointercancel", o._disableDelayedDrag)) : (ve(c, "mouseup", o._disableDelayedDrag), ve(c, "touchend", o._disableDelayedDrag), ve(c, "touchcancel", o._disableDelayedDrag)), ve(c, "mousemove", o._delayedDragTouchMoveHandler), ve(c, "touchmove", o._delayedDragTouchMoveHandler), v.supportPointer && ve(c, "pointermove", o._delayedDragTouchMoveHandler), o._dragStartTimer = setTimeout(r, v.delay);
      } else
        r();
    }
  },
  _delayedDragTouchMoveHandler: function(a) {
    var t = a.touches ? a.touches[0] : a;
    Math.max(Math.abs(t.clientX - this._lastX), Math.abs(t.clientY - this._lastY)) >= Math.floor(this.options.touchStartThreshold / (this.nativeDraggable && window.devicePixelRatio || 1)) && this._disableDelayedDrag();
  },
  _disableDelayedDrag: function() {
    F && Da(F), clearTimeout(this._dragStartTimer), this._disableDelayedDragEvents();
  },
  _disableDelayedDragEvents: function() {
    var a = this.el.ownerDocument;
    me(a, "mouseup", this._disableDelayedDrag), me(a, "touchend", this._disableDelayedDrag), me(a, "touchcancel", this._disableDelayedDrag), me(a, "pointerup", this._disableDelayedDrag), me(a, "pointercancel", this._disableDelayedDrag), me(a, "mousemove", this._delayedDragTouchMoveHandler), me(a, "touchmove", this._delayedDragTouchMoveHandler), me(a, "pointermove", this._delayedDragTouchMoveHandler);
  },
  _triggerDragStart: function(a, t) {
    t = t || a.pointerType == "touch" && a, !this.nativeDraggable || t ? this.options.supportPointer ? ve(document, "pointermove", this._onTouchMove) : t ? ve(document, "touchmove", this._onTouchMove) : ve(document, "mousemove", this._onTouchMove) : (ve(F, "dragend", this), ve(ke, "dragstart", this._onDragStart));
    try {
      document.selection ? da(function() {
        document.selection.empty();
      }) : window.getSelection().removeAllRanges();
    } catch {
    }
  },
  _dragStarted: function(a, t) {
    if (Dt = !1, ke && F) {
      Me("dragStarted", this, {
        evt: t
      }), this.nativeDraggable && ve(document, "dragover", rn);
      var l = this.options;
      !a && Fe(F, l.dragClass, !1), Fe(F, l.ghostClass, !0), le.active = this, a && this._appendGhost(), Oe({
        sortable: this,
        name: "start",
        originalEvent: t
      });
    } else
      this._nulling();
  },
  _emulateDragOver: function() {
    if (Xe) {
      this._lastX = Xe.clientX, this._lastY = Xe.clientY, Bl();
      for (var a = document.elementFromPoint(Xe.clientX, Xe.clientY), t = a; a && a.shadowRoot && (a = a.shadowRoot.elementFromPoint(Xe.clientX, Xe.clientY), a !== t); )
        t = a;
      if (F.parentNode[Le]._isOutsideThisEl(a), t)
        do {
          if (t[Le]) {
            var l = void 0;
            if (l = t[Le]._onDragOver({
              clientX: Xe.clientX,
              clientY: Xe.clientY,
              target: a,
              rootEl: t
            }), l && !this.options.dragoverBubble)
              break;
          }
          a = t;
        } while (t = Il(t));
      Fl();
    }
  },
  _onTouchMove: function(a) {
    if (ft) {
      var t = this.options, l = t.fallbackTolerance, o = t.fallbackOffset, s = a.touches ? a.touches[0] : a, v = oe && Rt(oe, !0), c = oe && v && v.a, r = oe && v && v.d, i = oa && De && dl(De), n = (s.clientX - ft.clientX + o.x) / (c || 1) + (i ? i[0] - Ua[0] : 0) / (c || 1), b = (s.clientY - ft.clientY + o.y) / (r || 1) + (i ? i[1] - Ua[1] : 0) / (r || 1);
      if (!le.active && !Dt) {
        if (l && Math.max(Math.abs(s.clientX - this._lastX), Math.abs(s.clientY - this._lastY)) < l)
          return;
        this._onDragStart(a, !0);
      }
      if (oe) {
        v ? (v.e += n - (Ea || 0), v.f += b - (Ta || 0)) : v = {
          a: 1,
          b: 0,
          c: 0,
          d: 1,
          e: n,
          f: b
        };
        var w = "matrix(".concat(v.a, ",").concat(v.b, ",").concat(v.c, ",").concat(v.d, ",").concat(v.e, ",").concat(v.f, ")");
        ae(oe, "webkitTransform", w), ae(oe, "mozTransform", w), ae(oe, "msTransform", w), ae(oe, "transform", w), Ea = n, Ta = b, Xe = s;
      }
      a.cancelable && a.preventDefault();
    }
  },
  _appendGhost: function() {
    if (!oe) {
      var a = this.options.fallbackOnBody ? document.body : ke, t = Ce(F, !0, oa, !0, a), l = this.options;
      if (oa) {
        for (De = a; ae(De, "position") === "static" && ae(De, "transform") === "none" && De !== document; )
          De = De.parentNode;
        De !== document.body && De !== document.documentElement ? (De === document && (De = et()), t.top += De.scrollTop, t.left += De.scrollLeft) : De = et(), Ua = dl(De);
      }
      oe = F.cloneNode(!0), Fe(oe, l.ghostClass, !1), Fe(oe, l.fallbackClass, !0), Fe(oe, l.dragClass, !0), ae(oe, "transition", ""), ae(oe, "transform", ""), ae(oe, "box-sizing", "border-box"), ae(oe, "margin", 0), ae(oe, "top", t.top), ae(oe, "left", t.left), ae(oe, "width", t.width), ae(oe, "height", t.height), ae(oe, "opacity", "0.8"), ae(oe, "position", oa ? "absolute" : "fixed"), ae(oe, "zIndex", "100000"), ae(oe, "pointerEvents", "none"), le.ghost = oe, a.appendChild(oe), ae(oe, "transform-origin", ul / parseInt(oe.style.width) * 100 + "% " + cl / parseInt(oe.style.height) * 100 + "%");
    }
  },
  _onDragStart: function(a, t) {
    var l = this, o = a.dataTransfer, s = l.options;
    if (Me("dragStart", this, {
      evt: a
    }), le.eventCanceled) {
      this._onDrop();
      return;
    }
    Me("setupClone", this), le.eventCanceled || (we = Rl(F), we.removeAttribute("id"), we.draggable = !1, we.style["will-change"] = "", this._hideClone(), Fe(we, this.options.chosenClass, !1), le.clone = we), l.cloneId = da(function() {
      Me("clone", l), !le.eventCanceled && (l.options.removeCloneOnHide || ke.insertBefore(we, F), l._hideClone(), Oe({
        sortable: l,
        name: "clone"
      }));
    }), !t && Fe(F, s.dragClass, !0), t ? (ma = !0, l._loopId = setInterval(l._emulateDragOver, 50)) : (me(document, "mouseup", l._onDrop), me(document, "touchend", l._onDrop), me(document, "touchcancel", l._onDrop), o && (o.effectAllowed = "move", s.setData && s.setData.call(l, o, F)), ve(document, "drop", l), ae(F, "transform", "translateZ(0)")), Dt = !0, l._dragStartId = da(l._dragStarted.bind(l, t, a)), ve(document, "selectstart", l), Ft = !0, window.getSelection().removeAllRanges(), Wt && ae(document.body, "user-select", "none");
  },
  // Returns true - if no further action is needed (either inserted or another condition)
  _onDragOver: function(a) {
    var t = this.el, l = a.target, o, s, v, c = this.options, r = c.group, i = le.active, n = aa === r, b = c.sort, w = Ue || i, y, k = this, C = !1;
    if (La) return;
    function R(fe, be) {
      Me(fe, k, tt({
        evt: a,
        isOwner: n,
        axis: y ? "vertical" : "horizontal",
        revert: v,
        dragRect: o,
        targetRect: s,
        canSort: b,
        fromSortable: w,
        target: l,
        completed: D,
        onMove: function(Pe, p) {
          return ia(ke, t, F, o, Pe, Ce(Pe), a, p);
        },
        changed: E
      }, be));
    }
    function $() {
      R("dragOverAnimationCapture"), k.captureAnimationState(), k !== w && w.captureAnimationState();
    }
    function D(fe) {
      return R("dragOverCompleted", {
        insertion: fe
      }), fe && (n ? i._hideClone() : i._showClone(k), k !== w && (Fe(F, Ue ? Ue.options.ghostClass : i.options.ghostClass, !1), Fe(F, c.ghostClass, !0)), Ue !== k && k !== le.active ? Ue = k : k === le.active && Ue && (Ue = null), w === k && (k._ignoreWhileAnimating = l), k.animateAll(function() {
        R("dragOverAnimationComplete"), k._ignoreWhileAnimating = null;
      }), k !== w && (w.animateAll(), w._ignoreWhileAnimating = null)), (l === F && !F.animated || l === t && !l.animated) && (Ut = null), !c.dragoverBubble && !a.rootEl && l !== document && (F.parentNode[Le]._isOutsideThisEl(a.target), !fe && pt(a)), !c.dragoverBubble && a.stopPropagation && a.stopPropagation(), C = !0;
    }
    function E() {
      je = Ge(F), rt = Ge(F, c.draggable), Oe({
        sortable: k,
        name: "change",
        toEl: t,
        newIndex: je,
        newDraggableIndex: rt,
        originalEvent: a
      });
    }
    if (a.preventDefault !== void 0 && a.cancelable && a.preventDefault(), l = Je(l, c.draggable, t, !0), R("dragOver"), le.eventCanceled) return C;
    if (F.contains(a.target) || l.animated && l.animatingX && l.animatingY || k._ignoreWhileAnimating === l)
      return D(!1);
    if (ma = !1, i && !c.disabled && (n ? b || (v = Ve !== ke) : Ue === this || (this.lastPutMode = aa.checkPull(this, i, F, a)) && r.checkPut(this, i, F, a))) {
      if (y = this._getDirection(a, l) === "vertical", o = Ce(F), R("dragOverValid"), le.eventCanceled) return C;
      if (v)
        return Ve = ke, $(), this._hideClone(), R("revert"), le.eventCanceled || (yt ? ke.insertBefore(F, yt) : ke.appendChild(F)), D(!0);
      var T = Xa(t, c.draggable);
      if (!T || mn(a, y, this) && !T.animated) {
        if (T === F)
          return D(!1);
        if (T && t === a.target && (l = T), l && (s = Ce(l)), ia(ke, t, F, o, l, s, a, !!l) !== !1)
          return $(), T && T.nextSibling ? t.insertBefore(F, T.nextSibling) : t.appendChild(F), Ve = t, E(), D(!0);
      } else if (T && cn(a, y, this)) {
        var V = Mt(t, 0, c, !0);
        if (V === F)
          return D(!1);
        if (l = V, s = Ce(l), ia(ke, t, F, o, l, s, a, !1) !== !1)
          return $(), t.insertBefore(F, V), Ve = t, E(), D(!0);
      } else if (l.parentNode === t) {
        s = Ce(l);
        var P = 0, G, ce = F.parentNode !== t, re = !nn(F.animated && F.toRect || o, l.animated && l.toRect || s, y), J = y ? "top" : "left", O = rl(l, "top", "top") || rl(F, "top", "top"), te = O ? O.scrollTop : void 0;
        Ut !== l && (G = s[J], Kt = !1, la = !re && c.invertSwap || ce), P = vn(a, l, s, y, re ? 1 : c.swapThreshold, c.invertedSwapThreshold == null ? c.swapThreshold : c.invertedSwapThreshold, la, Ut === l);
        var S;
        if (P !== 0) {
          var A = Ge(F);
          do
            A -= P, S = Ve.children[A];
          while (S && (ae(S, "display") === "none" || S === oe));
        }
        if (P === 0 || S === l)
          return D(!1);
        Ut = l, Ht = P;
        var N = l.nextElementSibling, X = !1;
        X = P === 1;
        var de = ia(ke, t, F, o, l, s, a, X);
        if (de !== !1)
          return (de === 1 || de === -1) && (X = de === 1), La = !0, setTimeout(un, 30), $(), X && !N ? t.appendChild(F) : l.parentNode.insertBefore(F, X ? N : l), O && Ol(O, 0, te - O.scrollTop), Ve = F.parentNode, G !== void 0 && !la && (ra = Math.abs(G - Ce(l)[J])), E(), D(!0);
      }
      if (t.contains(F))
        return D(!1);
    }
    return !1;
  },
  _ignoreWhileAnimating: null,
  _offMoveEvents: function() {
    me(document, "mousemove", this._onTouchMove), me(document, "touchmove", this._onTouchMove), me(document, "pointermove", this._onTouchMove), me(document, "dragover", pt), me(document, "mousemove", pt), me(document, "touchmove", pt);
  },
  _offUpEvents: function() {
    var a = this.el.ownerDocument;
    me(a, "mouseup", this._onDrop), me(a, "touchend", this._onDrop), me(a, "pointerup", this._onDrop), me(a, "pointercancel", this._onDrop), me(a, "touchcancel", this._onDrop), me(document, "selectstart", this);
  },
  _onDrop: function(a) {
    var t = this.el, l = this.options;
    if (je = Ge(F), rt = Ge(F, l.draggable), Me("drop", this, {
      evt: a
    }), Ve = F && F.parentNode, je = Ge(F), rt = Ge(F, l.draggable), le.eventCanceled) {
      this._nulling();
      return;
    }
    Dt = !1, la = !1, Kt = !1, clearInterval(this._loopId), clearTimeout(this._dragStartTimer), za(this.cloneId), za(this._dragStartId), this.nativeDraggable && (me(document, "drop", this), me(t, "dragstart", this._onDragStart)), this._offMoveEvents(), this._offUpEvents(), Wt && ae(document.body, "user-select", ""), ae(F, "transform", ""), a && (Ft && (a.cancelable && a.preventDefault(), !l.dropBubble && a.stopPropagation()), oe && oe.parentNode && oe.parentNode.removeChild(oe), (ke === Ve || Ue && Ue.lastPutMode !== "clone") && we && we.parentNode && we.parentNode.removeChild(we), F && (this.nativeDraggable && me(F, "dragend", this), Da(F), F.style["will-change"] = "", Ft && !Dt && Fe(F, Ue ? Ue.options.ghostClass : this.options.ghostClass, !1), Fe(F, this.options.chosenClass, !1), Oe({
      sortable: this,
      name: "unchoose",
      toEl: Ve,
      newIndex: null,
      newDraggableIndex: null,
      originalEvent: a
    }), ke !== Ve ? (je >= 0 && (Oe({
      rootEl: Ve,
      name: "add",
      toEl: Ve,
      fromEl: ke,
      originalEvent: a
    }), Oe({
      sortable: this,
      name: "remove",
      toEl: Ve,
      originalEvent: a
    }), Oe({
      rootEl: Ve,
      name: "sort",
      toEl: Ve,
      fromEl: ke,
      originalEvent: a
    }), Oe({
      sortable: this,
      name: "sort",
      toEl: Ve,
      originalEvent: a
    })), Ue && Ue.save()) : je !== At && je >= 0 && (Oe({
      sortable: this,
      name: "update",
      toEl: Ve,
      originalEvent: a
    }), Oe({
      sortable: this,
      name: "sort",
      toEl: Ve,
      originalEvent: a
    })), le.active && ((je == null || je === -1) && (je = At, rt = Yt), Oe({
      sortable: this,
      name: "end",
      toEl: Ve,
      originalEvent: a
    }), this.save()))), this._nulling();
  },
  _nulling: function() {
    Me("nulling", this), ke = F = Ve = oe = yt = we = sa = dt = ft = Xe = Ft = je = rt = At = Yt = Ut = Ht = Ue = aa = le.dragged = le.ghost = le.clone = le.active = null;
    var a = this.el;
    fa.forEach(function(t) {
      a.contains(t) && (t.checked = !0);
    }), fa.length = Ea = Ta = 0;
  },
  handleEvent: function(a) {
    switch (a.type) {
      case "drop":
      case "dragend":
        this._onDrop(a);
        break;
      case "dragenter":
      case "dragover":
        F && (this._onDragOver(a), dn(a));
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
    for (var a = [], t, l = this.el.children, o = 0, s = l.length, v = this.options; o < s; o++)
      t = l[o], Je(t, v.draggable, this.el, !1) && a.push(t.getAttribute(v.dataIdAttr) || pn(t));
    return a;
  },
  /**
   * Sorts the elements according to the array.
   * @param  {String[]}  order  order of the items
   */
  sort: function(a, t) {
    var l = {}, o = this.el;
    this.toArray().forEach(function(s, v) {
      var c = o.children[v];
      Je(c, this.options.draggable, o, !1) && (l[s] = c);
    }, this), t && this.captureAnimationState(), a.forEach(function(s) {
      l[s] && (o.removeChild(l[s]), o.appendChild(l[s]));
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
    return Je(a, t || this.options.draggable, this.el, !1);
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
    var o = Qt.modifyOption(this, a, t);
    typeof o < "u" ? l[a] = o : l[a] = t, a === "group" && zl(l);
  },
  /**
   * Destroy
   */
  destroy: function() {
    Me("destroy", this);
    var a = this.el;
    a[Le] = null, me(a, "mousedown", this._onTapStart), me(a, "touchstart", this._onTapStart), me(a, "pointerdown", this._onTapStart), this.nativeDraggable && (me(a, "dragover", this), me(a, "dragenter", this)), Array.prototype.forEach.call(a.querySelectorAll("[draggable]"), function(t) {
      t.removeAttribute("draggable");
    }), this._onDrop(), this._disableDelayedDragEvents(), va.splice(va.indexOf(this.el), 1), this.el = a = null;
  },
  _hideClone: function() {
    if (!dt) {
      if (Me("hideClone", this), le.eventCanceled) return;
      ae(we, "display", "none"), this.options.removeCloneOnHide && we.parentNode && we.parentNode.removeChild(we), dt = !0;
    }
  },
  _showClone: function(a) {
    if (a.lastPutMode !== "clone") {
      this._hideClone();
      return;
    }
    if (dt) {
      if (Me("showClone", this), le.eventCanceled) return;
      F.parentNode == ke && !this.options.group.revertClone ? ke.insertBefore(we, F) : yt ? ke.insertBefore(we, yt) : ke.appendChild(we), this.options.group.revertClone && this.animate(F, we), ae(we, "display", ""), dt = !1;
    }
  }
};
function dn(e) {
  e.dataTransfer && (e.dataTransfer.dropEffect = "move"), e.cancelable && e.preventDefault();
}
function ia(e, a, t, l, o, s, v, c) {
  var r, i = e[Le], n = i.options.onMove, b;
  return window.CustomEvent && !nt && !Zt ? r = new CustomEvent("move", {
    bubbles: !0,
    cancelable: !0
  }) : (r = document.createEvent("Event"), r.initEvent("move", !0, !0)), r.to = a, r.from = e, r.dragged = t, r.draggedRect = l, r.related = o || a, r.relatedRect = s || Ce(a), r.willInsertAfter = c, r.originalEvent = v, e.dispatchEvent(r), n && (b = n.call(i, r, v)), b;
}
function Da(e) {
  e.draggable = !1;
}
function un() {
  La = !1;
}
function cn(e, a, t) {
  var l = Ce(Mt(t.el, 0, t.options, !0)), o = Nl(t.el, t.options, oe), s = 10;
  return a ? e.clientX < o.left - s || e.clientY < l.top && e.clientX < l.right : e.clientY < o.top - s || e.clientY < l.bottom && e.clientX < l.left;
}
function mn(e, a, t) {
  var l = Ce(Xa(t.el, t.options.draggable)), o = Nl(t.el, t.options, oe), s = 10;
  return a ? e.clientX > o.right + s || e.clientY > l.bottom && e.clientX > l.left : e.clientY > o.bottom + s || e.clientX > l.right && e.clientY > l.top;
}
function vn(e, a, t, l, o, s, v, c) {
  var r = l ? e.clientY : e.clientX, i = l ? t.height : t.width, n = l ? t.top : t.left, b = l ? t.bottom : t.right, w = !1;
  if (!v) {
    if (c && ra < i * o) {
      if (!Kt && (Ht === 1 ? r > n + i * s / 2 : r < b - i * s / 2) && (Kt = !0), Kt)
        w = !0;
      else if (Ht === 1 ? r < n + ra : r > b - ra)
        return -Ht;
    } else if (r > n + i * (1 - o) / 2 && r < b - i * (1 - o) / 2)
      return fn(a);
  }
  return w = w || v, w && (r < n + i * s / 2 || r > b - i * s / 2) ? r > n + i / 2 ? 1 : -1 : 0;
}
function fn(e) {
  return Ge(F) < Ge(e) ? 1 : -1;
}
function pn(e) {
  for (var a = e.tagName + e.className + e.src + e.href + e.textContent, t = a.length, l = 0; t--; )
    l += a.charCodeAt(t);
  return l.toString(36);
}
function bn(e) {
  fa.length = 0;
  for (var a = e.getElementsByTagName("input"), t = a.length; t--; ) {
    var l = a[t];
    l.checked && fa.push(l);
  }
}
function da(e) {
  return setTimeout(e, 0);
}
function za(e) {
  return clearTimeout(e);
}
wa && ve(document, "touchmove", function(e) {
  (le.active || Dt) && e.cancelable && e.preventDefault();
});
le.utils = {
  on: ve,
  off: me,
  css: ae,
  find: Al,
  is: function(a, t) {
    return !!Je(a, t, a, !1);
  },
  extend: Zi,
  throttle: Pl,
  closest: Je,
  toggleClass: Fe,
  clone: Rl,
  index: Ge,
  nextTick: da,
  cancelNextTick: za,
  detectDirection: Ll,
  getChild: Mt,
  expando: Le
};
le.get = function(e) {
  return e[Le];
};
le.mount = function() {
  for (var e = arguments.length, a = new Array(e), t = 0; t < e; t++)
    a[t] = arguments[t];
  a[0].constructor === Array && (a = a[0]), a.forEach(function(l) {
    if (!l.prototype || !l.prototype.constructor)
      throw "Sortable: Mounted plugin must be a constructor function, not ".concat({}.toString.call(l));
    l.utils && (le.utils = tt(tt({}, le.utils), l.utils)), Qt.mount(l);
  });
};
le.create = function(e, a) {
  return new le(e, a);
};
le.version = Xi;
var Se = [], jt, Ba, Fa = !1, Ia, Aa, pa, qt;
function hn() {
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
      this.sortable.nativeDraggable ? ve(document, "dragover", this._handleAutoScroll) : this.options.supportPointer ? ve(document, "pointermove", this._handleFallbackAutoScroll) : l.touches ? ve(document, "touchmove", this._handleFallbackAutoScroll) : ve(document, "mousemove", this._handleFallbackAutoScroll);
    },
    dragOverCompleted: function(t) {
      var l = t.originalEvent;
      !this.options.dragOverBubble && !l.rootEl && this._handleAutoScroll(l);
    },
    drop: function() {
      this.sortable.nativeDraggable ? me(document, "dragover", this._handleAutoScroll) : (me(document, "pointermove", this._handleFallbackAutoScroll), me(document, "touchmove", this._handleFallbackAutoScroll), me(document, "mousemove", this._handleFallbackAutoScroll)), vl(), ua(), Qi();
    },
    nulling: function() {
      pa = Ba = jt = Fa = qt = Ia = Aa = null, Se.length = 0;
    },
    _handleFallbackAutoScroll: function(t) {
      this._handleAutoScroll(t, !0);
    },
    _handleAutoScroll: function(t, l) {
      var o = this, s = (t.touches ? t.touches[0] : t).clientX, v = (t.touches ? t.touches[0] : t).clientY, c = document.elementFromPoint(s, v);
      if (pa = t, l || this.options.forceAutoScrollFallback || Zt || nt || Wt) {
        Pa(t, this.options, c, l);
        var r = ut(c, !0);
        Fa && (!qt || s !== Ia || v !== Aa) && (qt && vl(), qt = setInterval(function() {
          var i = ut(document.elementFromPoint(s, v), !0);
          i !== r && (r = i, ua()), Pa(t, o.options, i, l);
        }, 10), Ia = s, Aa = v);
      } else {
        if (!this.options.bubbleScroll || ut(c, !0) === et()) {
          ua();
          return;
        }
        Pa(t, this.options, ut(c, !1), !1);
      }
    }
  }, it(e, {
    pluginName: "scroll",
    initializeByDefault: !0
  });
}
function ua() {
  Se.forEach(function(e) {
    clearInterval(e.pid);
  }), Se = [];
}
function vl() {
  clearInterval(qt);
}
var Pa = Pl(function(e, a, t, l) {
  if (a.scroll) {
    var o = (e.touches ? e.touches[0] : e).clientX, s = (e.touches ? e.touches[0] : e).clientY, v = a.scrollSensitivity, c = a.scrollSpeed, r = et(), i = !1, n;
    Ba !== t && (Ba = t, ua(), jt = a.scroll, n = a.scrollFn, jt === !0 && (jt = ut(t, !0)));
    var b = 0, w = jt;
    do {
      var y = w, k = Ce(y), C = k.top, R = k.bottom, $ = k.left, D = k.right, E = k.width, T = k.height, V = void 0, P = void 0, G = y.scrollWidth, ce = y.scrollHeight, re = ae(y), J = y.scrollLeft, O = y.scrollTop;
      y === r ? (V = E < G && (re.overflowX === "auto" || re.overflowX === "scroll" || re.overflowX === "visible"), P = T < ce && (re.overflowY === "auto" || re.overflowY === "scroll" || re.overflowY === "visible")) : (V = E < G && (re.overflowX === "auto" || re.overflowX === "scroll"), P = T < ce && (re.overflowY === "auto" || re.overflowY === "scroll"));
      var te = V && (Math.abs(D - o) <= v && J + E < G) - (Math.abs($ - o) <= v && !!J), S = P && (Math.abs(R - s) <= v && O + T < ce) - (Math.abs(C - s) <= v && !!O);
      if (!Se[b])
        for (var A = 0; A <= b; A++)
          Se[A] || (Se[A] = {});
      (Se[b].vx != te || Se[b].vy != S || Se[b].el !== y) && (Se[b].el = y, Se[b].vx = te, Se[b].vy = S, clearInterval(Se[b].pid), (te != 0 || S != 0) && (i = !0, Se[b].pid = setInterval(function() {
        l && this.layer === 0 && le.active._onTouchMove(pa);
        var N = Se[this.layer].vy ? Se[this.layer].vy * c : 0, X = Se[this.layer].vx ? Se[this.layer].vx * c : 0;
        typeof n == "function" && n.call(le.dragged.parentNode[Le], X, N, e, pa, Se[this.layer].el) !== "continue" || Ol(Se[this.layer].el, X, N);
      }.bind({
        layer: b
      }), 24))), b++;
    } while (a.bubbleScroll && w !== r && (w = ut(w, !1)));
    Fa = i;
  }
}, 30), jl = function(a) {
  var t = a.originalEvent, l = a.putSortable, o = a.dragEl, s = a.activeSortable, v = a.dispatchSortableEvent, c = a.hideGhostForTarget, r = a.unhideGhostForTarget;
  if (t) {
    var i = l || s;
    c();
    var n = t.changedTouches && t.changedTouches.length ? t.changedTouches[0] : t, b = document.elementFromPoint(n.clientX, n.clientY);
    r(), i && !i.el.contains(b) && (v("spill"), this.onSpill({
      dragEl: o,
      putSortable: l
    }));
  }
};
function Ja() {
}
Ja.prototype = {
  startIndex: null,
  dragStart: function(a) {
    var t = a.oldDraggableIndex;
    this.startIndex = t;
  },
  onSpill: function(a) {
    var t = a.dragEl, l = a.putSortable;
    this.sortable.captureAnimationState(), l && l.captureAnimationState();
    var o = Mt(this.sortable.el, this.startIndex, this.options);
    o ? this.sortable.el.insertBefore(t, o) : this.sortable.el.appendChild(t), this.sortable.animateAll(), l && l.animateAll();
  },
  drop: jl
};
it(Ja, {
  pluginName: "revertOnSpill"
});
function Za() {
}
Za.prototype = {
  onSpill: function(a) {
    var t = a.dragEl, l = a.putSortable, o = l || this.sortable;
    o.captureAnimationState(), t.parentNode && t.parentNode.removeChild(t), o.animateAll();
  },
  drop: jl
};
it(Za, {
  pluginName: "removeOnSpill"
});
le.mount(new hn());
le.mount(Za, Ja);
function yn(e, a) {
  const t = e.oldDraggableIndex ?? e.oldIndex;
  e.item.remove();
  const l = [...e.from.children].filter((o) => o.matches(a));
  e.from.insertBefore(e.item, l[t ?? l.length] ?? null);
}
function ql(e) {
  const a = /* @__PURE__ */ new Map();
  function t(l) {
    a.get(l)?.destroy(), a.delete(l);
  }
  return $t(() => {
    for (const l of a.keys()) t(l);
  }), {
    mounted(l) {
      const o = l.querySelector(".work-field-builder") ?? l;
      a.set(l, new le(o, {
        draggable: ".work-reorder-entry",
        handle: ".work-reorder-handle",
        forceFallback: !0,
        fallbackOnBody: !1,
        ghostClass: "work-drag-ghost",
        onEnd(s) {
          const v = s.oldDraggableIndex, c = s.newDraggableIndex;
          yn(s, ".work-reorder-entry"), v !== void 0 && c !== void 0 && v !== c && e(v, c);
        }
      }));
    },
    unmounted: t
  };
}
const gn = { class: "work-stack work-tight work-option-builder" }, kn = { class: "work-stack work-tight" }, wn = { class: "work-stack work-tight work-small" }, Vn = { class: "work-stack work-tight work-small" }, $n = { class: "work-stack work-tight" }, xn = { class: "work-stack work-tight work-small" }, Sn = { class: "work-row" }, Cn = { class: "work-stack work-tight work-small" }, En = { class: "work-row" }, Tn = { class: "work-add-option" }, Un = {
  key: 0,
  class: "work-muted work-small"
}, Dn = /* @__PURE__ */ ue({
  __name: "OptionsEditor",
  props: {
    field: {}
  },
  setup(e) {
    const a = e, t = W(() => a.field.options ?? []);
    function l(c, r) {
      $l(t.value, c, r - c), t.value.forEach((i, n) => i.order = n);
    }
    const o = ql(l), s = ["primary", "success", "info", "warn", "danger", "secondary"];
    function v() {
      let c = t.value.length + 1;
      for (; t.value.some((r) => r.id === `option_${c}`); ) c++;
      (a.field.options ??= []).push({ id: `option_${c}`, label: "New option", order: t.value.length });
    }
    return (c, r) => (m(), h("section", gn, [
      r[4] || (r[4] = u("header", { class: "work-row" }, [
        u("h4", null, "Options"),
        u("span", { class: "work-muted work-small" }, "Stable IDs keep existing values when labels change."),
        u("span", { class: "work-spacer" })
      ], -1)),
      at((m(), h("div", kn, [
        (m(!0), h(q, null, _(t.value, (i, n) => (m(), h("div", {
          key: n,
          class: "work-option-row work-reorder-entry"
        }, [
          f(d(K), {
            type: "button",
            class: "work-icon-button work-reorder-handle",
            "aria-label": "Drag option; arrow keys reorder",
            onKeydown: [
              Ie(ye((b) => l(n, n - 1), ["prevent"]), ["up"]),
              Ie(ye((b) => l(n, n + 1), ["prevent"]), ["down"])
            ],
            severity: "secondary",
            text: "",
            size: "small"
          }, {
            default: L(() => [
              f(d(Z), {
                icon: "tabler:grip-vertical",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["onKeydown"]),
          u("label", wn, [
            r[0] || (r[0] = M("Label", -1)),
            f(d(se), {
              modelValue: i.label,
              "onUpdate:modelValue": (b) => i.label = b,
              "aria-label": "Option label"
            }, null, 8, ["modelValue", "onUpdate:modelValue"])
          ]),
          u("label", Vn, [
            r[1] || (r[1] = M("Code", -1)),
            f(d(se), {
              modelValue: i.id,
              "onUpdate:modelValue": (b) => i.id = b,
              class: "work-option-code",
              required: "",
              pattern: "[a-z][a-z0-9_]*",
              "aria-label": "Option ID"
            }, null, 8, ["modelValue", "onUpdate:modelValue"])
          ]),
          u("div", $n, [
            u("label", xn, [
              r[2] || (r[2] = M("Color", -1)),
              u("span", Sn, [
                u("span", {
                  class: ct(["work-color-swatch", "work-swatch-" + (i.color || "secondary")]),
                  "aria-hidden": "true"
                }, null, 2),
                f(d(ee), {
                  modelValue: i.color,
                  "onUpdate:modelValue": (b) => i.color = b,
                  "aria-label": "Option color",
                  appendTo: "self",
                  optionLabel: "label",
                  optionValue: "value",
                  optionDisabled: "disabled",
                  options: [{ label: "Default", value: void 0, disabled: !1 }, ...(s ?? []).map((b) => ({ label: b, value: b, disabled: !1 }))]
                }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
              ])
            ]),
            u("label", Cn, [
              r[3] || (r[3] = M("Category", -1)),
              f(d(ee), {
                "model-value": i.category,
                "aria-label": "Option category",
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                showClear: "",
                options: ["triage", "backlog", ...d(Vl)].map((b) => ({ label: d(Wa)(b), value: b })),
                "onUpdate:modelValue": (b) => i.category = b || void 0
              }, null, 8, ["model-value", "options", "onUpdate:modelValue"])
            ])
          ]),
          u("div", En, [
            f(d(K), {
              "aria-label": "Option earlier",
              severity: "secondary",
              size: "small",
              disabled: n === 0,
              onClick: (b) => l(n, n - 1),
              text: ""
            }, {
              default: L(() => [
                f(d(Z), {
                  icon: "tabler:arrow-up",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["disabled", "onClick"]),
            f(d(K), {
              "aria-label": "Option later",
              severity: "secondary",
              size: "small",
              disabled: n === t.value.length - 1,
              onClick: (b) => l(n, n + 1),
              text: ""
            }, {
              default: L(() => [
                f(d(Z), {
                  icon: "tabler:arrow-down",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["disabled", "onClick"]),
            f(d(K), {
              label: "Remove",
              "aria-label": "Remove option",
              severity: "secondary",
              text: "",
              size: "small",
              onClick: (b) => t.value.splice(n, 1)
            }, {
              icon: L(() => [
                f(d(Z), {
                  icon: "tabler:trash",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["onClick"])
          ])
        ]))), 128)),
        u("div", Tn, [
          f(d(K), {
            label: "Add option",
            severity: "secondary",
            size: "small",
            onClick: v,
            outlined: ""
          }, {
            icon: L(() => [
              f(d(Z), {
                icon: "tabler:plus",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          })
        ])
      ])), [
        [d(o)]
      ]),
      t.value.length ? I("", !0) : (m(), h("p", Un, "Add the choices people can select for this field."))
    ]));
  }
}), In = {
  class: "work-stack",
  "aria-label": "Fields editor"
}, An = { class: "work-section-heading" }, Pn = {
  key: 0,
  class: "work-used-by"
}, On = { class: "kx-tag-sm" }, Rn = { class: "work-small work-muted" }, Nn = {
  key: 0,
  class: "work-error work-small",
  role: "alert"
}, Mn = { class: "work-settings-grid work-field-properties" }, Ln = { class: "work-stack work-tight" }, zn = { class: "work-stack work-tight" }, Bn = { class: "work-stack work-tight" }, Fn = { class: "work-stack work-tight" }, jn = { class: "work-stack work-tight" }, qn = { class: "work-stack work-tight work-field-history" }, Wn = { class: "work-settings-list" }, Gn = { class: "work-settings-row" }, Yn = { class: "work-settings-row" }, Hn = {
  key: 2,
  class: "work-stack work-tight"
}, Kn = {
  key: 3,
  class: "work-stack work-tight"
}, Xn = { class: "work-stack work-tight" }, Jn = { class: "work-stack work-tight" }, Zn = { class: "work-stack work-tight" }, Qn = { class: "work-stack work-tight" }, _n = {
  key: 6,
  class: "work-stack"
}, es = {
  key: 0,
  class: "work-stack work-tight"
}, ts = { class: "work-row work-add-definition" }, as = { class: "work-stack work-tight" }, ls = /* @__PURE__ */ ue({
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
  setup(e, { emit: a }) {
    const t = e, l = a, o = W(() => t.draft.fields ?? []), s = z(""), v = z(""), c = z({}), r = ql(($, D) => k($, D - $));
    function i($) {
      return (t.draft.item_types ?? []).filter((D) => D.fields.includes($)).map((D) => D.title || ge(D.id));
    }
    async function n($) {
      if (!v.value) {
        v.value = $.code;
        try {
          const D = await t.guardRemoval?.("fields", $.code);
          c.value[$.code] = D ?? "", D || Jt(t.draft, "fields", $.code);
        } finally {
          v.value = "";
        }
      }
    }
    const b = ["text", "int", "dec", "quantity", "bool", "time", "ref", "record", "option", "principal", "item", "rank", "rich_text", "formula", "rollup", "counter"];
    function w($) {
      return $.type && $.type !== "value" ? $.type : $.form;
    }
    function y($, D) {
      const E = { option: "text", principal: "ref", item: "ref", rank: "text", rich_text: "text", formula: "int", rollup: "int", counter: "int" };
      E[D] ? ($.type = D, $.form = E[D]) : (delete $.type, $.form = D), D !== "option" ? delete $.options : $.options ??= [], D === "rich_text" && ($.config = { format: "json" });
    }
    function k($, D) {
      $l(o.value, $, D);
      for (const E of t.draft.item_types ?? []) {
        const T = new Set(E.fields);
        E.fields = o.value.filter((V) => T.has(V.code)).map((V) => V.code);
      }
    }
    function C($, D) {
      try {
        so(t.draft, $, D.value), delete c.value[$.code];
      } catch (E) {
        c.value[$.code] = E.message, D.value = $.code;
      }
    }
    function R() {
      !/^[a-z][a-z0-9_]*$/.test(s.value) || o.value.some(($) => $.code === s.value) || ((t.draft.fields ??= []).push({ code: s.value, form: "text", cardinality: "one" }), s.value = "");
    }
    return ($, D) => (m(), h("section", In, [
      u("header", An, [
        D[1] || (D[1] = u("div", null, [
          u("h2", null, "Fields"),
          u("p", { class: "work-muted work-small" }, "Shape the information each item carries. Drag the handle or use the arrows to arrange fields.")
        ], -1)),
        f(d(Ae), {
          class: "kx-tag-sm",
          severity: "secondary"
        }, {
          default: L(() => [
            M(U(o.value.length) + " " + U(o.value.length === 1 ? "field" : "fields"), 1)
          ]),
          _: 1
        })
      ]),
      at((m(), B(ka, {
        columns: "fields",
        count: o.value.length
      }, {
        default: L(() => [
          (m(!0), h(q, null, _(o.value, (E, T) => (m(), B(ga, {
            title: d(Vt)(E),
            code: E.code,
            kind: e.installedTypes?.find((V) => V.id === w(E))?.title || d(ge)(w(E)),
            key: E.id ?? T,
            class: "work-field-row work-reorder-entry work-stack"
          }, {
            handle: L(() => [
              f(d(K), {
                type: "button",
                class: "work-reorder-handle work-icon-button",
                "aria-label": "Drag " + E.code + "; arrow keys reorder",
                onKeydown: [
                  Ie(ye((V) => k(T, -1), ["prevent"]), ["up"]),
                  Ie(ye((V) => k(T, 1), ["prevent"]), ["down"])
                ],
                severity: "secondary",
                text: "",
                size: "small"
              }, {
                default: L(() => [
                  f(d(Z), {
                    icon: "tabler:grip-vertical",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["aria-label", "onKeydown"])
            ]),
            flags: L(() => [
              E.track ? (m(), B(d(Ae), {
                key: 0,
                class: "kx-tag-sm",
                severity: "secondary",
                value: "Tracked"
              })) : I("", !0),
              E.intervals ? (m(), B(d(Ae), {
                key: 1,
                class: "kx-tag-sm",
                severity: "secondary",
                value: "Intervals"
              })) : I("", !0)
            ]),
            usage: L(() => [
              i(E.code).length ? (m(), h("details", Pn, [
                u("summary", On, "Used by " + U(i(E.code).length) + " " + U(i(E.code).length === 1 ? "type" : "types"), 1),
                u("span", Rn, U(i(E.code).join(", ")), 1)
              ])) : I("", !0)
            ]),
            actions: L(() => [
              f(d(K), {
                "aria-label": "Move " + E.code + " earlier",
                severity: "secondary",
                disabled: T === 0,
                onClick: (V) => k(T, -1),
                text: "",
                size: "small"
              }, {
                default: L(() => [
                  f(d(Z), {
                    icon: "tabler:arrow-up",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["aria-label", "disabled", "onClick"]),
              f(d(K), {
                "aria-label": "Move " + E.code + " later",
                severity: "secondary",
                disabled: T === o.value.length - 1,
                onClick: (V) => k(T, 1),
                text: "",
                size: "small"
              }, {
                default: L(() => [
                  f(d(Z), {
                    icon: "tabler:arrow-down",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["aria-label", "disabled", "onClick"]),
              f(d(K), {
                severity: "secondary",
                text: "",
                size: "small",
                disabled: !!v.value,
                onClick: (V) => n(E),
                "aria-label": "Remove field"
              }, {
                default: L(() => [
                  f(d(Z), {
                    icon: "tabler:trash",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["disabled", "onClick"])
            ]),
            default: L(() => [
              c.value[E.code] ? (m(), h("p", Nn, U(c.value[E.code]), 1)) : I("", !0),
              (m(!0), h(q, null, _(e.issues?.filter((V) => V.code === E.code) ?? [], (V) => (m(), h("p", {
                key: V.what,
                class: "work-error work-small",
                role: "alert"
              }, U(d(ya)(V)) + " · " + U(V.what), 1))), 128)),
              u("div", Mn, [
                u("label", Ln, [
                  D[2] || (D[2] = M("Title", -1)),
                  f(d(se), {
                    modelValue: E.title,
                    "onUpdate:modelValue": (V) => E.title = V,
                    "aria-label": "Field title",
                    maxlength: "255",
                    placeholder: d(Vt)(E)
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder"])
                ]),
                u("label", zn, [
                  D[3] || (D[3] = M("Code", -1)),
                  f(d(se), {
                    value: E.code,
                    "aria-label": "Field code",
                    required: "",
                    pattern: "[a-z][a-z0-9_]*",
                    onInput: (V) => C(E, V.target)
                  }, null, 8, ["value", "onInput"])
                ]),
                u("label", Bn, [
                  D[4] || (D[4] = M("Kind", -1)),
                  f(d(ee), {
                    "model-value": w(E),
                    "onUpdate:modelValue": (V) => y(E, V),
                    appendTo: "self",
                    options: b
                  }, null, 8, ["model-value", "onUpdate:modelValue"])
                ]),
                u("label", Fn, [
                  D[5] || (D[5] = M("Cardinality", -1)),
                  f(d(ee), {
                    "model-value": E.cardinality ?? "one",
                    "onUpdate:modelValue": (V) => E.cardinality = V,
                    appendTo: "self",
                    options: ["one", "set", "list"]
                  }, null, 8, ["model-value", "onUpdate:modelValue"])
                ]),
                u("label", jn, [
                  D[6] || (D[6] = M("Index", -1)),
                  f(d(ee), {
                    "model-value": E.index ?? "none",
                    "onUpdate:modelValue": (V) => E.index = V,
                    appendTo: "self",
                    options: ["none", "key", "number"]
                  }, null, 8, ["model-value", "onUpdate:modelValue"])
                ])
              ]),
              u("section", qn, [
                D[9] || (D[9] = u("h4", { class: "work-group-title" }, "History", -1)),
                u("div", Wn, [
                  u("div", Gn, [
                    D[7] || (D[7] = u("div", { class: "work-row-main" }, [
                      u("strong", null, "Track changes"),
                      u("p", { class: "work-muted work-small" }, "Record each value change in the item history.")
                    ], -1)),
                    f(d(Re), {
                      modelValue: E.track,
                      "onUpdate:modelValue": (V) => E.track = V,
                      "aria-label": "Track changes"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ]),
                  u("div", Yn, [
                    D[8] || (D[8] = u("div", { class: "work-row-main" }, [
                      u("strong", null, "Track intervals"),
                      u("p", { class: "work-muted work-small" }, "Measure how long each value stays in effect.")
                    ], -1)),
                    f(d(Re), {
                      modelValue: E.intervals,
                      "onUpdate:modelValue": (V) => E.intervals = V,
                      "aria-label": "Track intervals"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ])
                ])
              ]),
              E.type === "option" ? (m(), B(Dn, {
                key: 1,
                field: E
              }, null, 8, ["field"])) : I("", !0),
              E.type === "formula" || E.type === "rollup" ? (m(), h("label", Hn, [
                D[10] || (D[10] = M("Result form", -1)),
                f(d(ee), {
                  modelValue: E.form,
                  "onUpdate:modelValue": (V) => E.form = V,
                  "aria-label": "Result form",
                  options: ["text", "int", "dec", "quantity", "bool", "time", "ref", "record"],
                  appendTo: "self"
                }, null, 8, ["modelValue", "onUpdate:modelValue"])
              ])) : I("", !0),
              E.type === "formula" ? (m(), h("label", Kn, [
                D[11] || (D[11] = M("Expression", -1)),
                f(d(se), {
                  modelValue: E.expression,
                  "onUpdate:modelValue": (V) => E.expression = V
                }, null, 8, ["modelValue", "onUpdate:modelValue"])
              ])) : I("", !0),
              E.type === "rollup" ? (m(), h(q, { key: 4 }, [
                u("label", Xn, [
                  D[12] || (D[12] = M("Of", -1)),
                  f(d(se), {
                    modelValue: E.of,
                    "onUpdate:modelValue": (V) => E.of = V
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                u("label", Jn, [
                  D[13] || (D[13] = M("Function", -1)),
                  f(d(se), {
                    modelValue: E.fn,
                    "onUpdate:modelValue": (V) => E.fn = V
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                u("label", Zn, [
                  D[14] || (D[14] = M("Field", -1)),
                  f(d(se), {
                    modelValue: E.field,
                    "onUpdate:modelValue": (V) => E.field = V
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                u("label", Qn, [
                  D[15] || (D[15] = M("Order by", -1)),
                  f(d(ee), {
                    "model-value": E.by,
                    "aria-label": "Rollup order",
                    options: ["rank", "time"],
                    showClear: "",
                    appendTo: "self",
                    "onUpdate:modelValue": (V) => E.by = V || void 0
                  }, null, 8, ["model-value", "onUpdate:modelValue"])
                ]),
                f(Ya, {
                  modelValue: E.where,
                  "onUpdate:modelValue": (V) => E.where = V,
                  draft: e.draft,
                  "board-id": e.boardId,
                  label: "Include related items when",
                  onValidity: (V) => l("validity", "rollup-" + T, V)
                }, null, 8, ["modelValue", "onUpdate:modelValue", "draft", "board-id", "onValidity"])
              ], 64)) : I("", !0),
              ["dec", "quantity", "ref", "time", "record"].includes(E.form) || E.config ? (m(), B(ot, {
                key: 5,
                label: "Field configuration",
                "model-value": E.config,
                shape: "object",
                "onUpdate:modelValue": (V) => E.config = V,
                onValidity: (V) => l("validity", "config-" + T, V)
              }, null, 8, ["model-value", "onUpdate:modelValue", "onValidity"])) : I("", !0),
              e.advanced ? (m(), h("section", _n, [
                D[17] || (D[17] = u("h4", { class: "work-group-title" }, "Access", -1)),
                e.installedTypes?.length ? (m(), h("label", es, [
                  D[16] || (D[16] = M("Custom field type", -1)),
                  f(d(ee), {
                    "model-value": E.type,
                    options: e.installedTypes,
                    optionLabel: "title",
                    optionValue: "id",
                    appendTo: "self",
                    "onUpdate:modelValue": (V) => E.type = V
                  }, null, 8, ["model-value", "options", "onUpdate:modelValue"])
                ])) : I("", !0),
                (m(), h(q, null, _(["read", "write"], (V) => f(Tl, {
                  "board-id": e.boardId,
                  key: V,
                  label: V === "read" ? "Who can read" : "Who can edit",
                  "model-value": E.access?.[V],
                  "onUpdate:modelValue": (P) => E.access = { ...E.access, [V]: P },
                  onValidity: (P) => l("validity", "access-" + T + V, P)
                }, null, 8, ["board-id", "label", "model-value", "onUpdate:modelValue", "onValidity"])), 64))
              ])) : I("", !0)
            ]),
            _: 2
          }, 1032, ["title", "code", "kind"]))), 128)),
          u("div", ts, [
            u("label", as, [
              D[18] || (D[18] = M("New field code", -1)),
              f(d(se), {
                modelValue: s.value,
                "onUpdate:modelValue": D[0] || (D[0] = (E) => s.value = E),
                onKeydown: Ie(ye(R, ["prevent"]), ["enter"])
              }, null, 8, ["modelValue", "onKeydown"])
            ]),
            f(d(K), {
              label: "Add field",
              severity: "secondary",
              disabled: !s.value.trim(),
              onClick: R,
              outlined: ""
            }, {
              icon: L(() => [
                f(d(Z), {
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
        [d(r)]
      ])
    ]));
  }
}), os = ["disabled"], is = { class: "work-chips" }, ns = {
  key: 1,
  class: "work-muted work-small"
}, Nt = /* @__PURE__ */ ue({
  __name: "ChipPicker",
  props: {
    label: {},
    options: {},
    modelValue: {},
    disabled: { type: Boolean }
  },
  emits: ["update:modelValue"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = z(""), s = W(() => t.options.map((r) => typeof r == "string" ? { value: r } : r)), v = W(() => s.value.filter((r) => (r.label ?? ge(r.value)).toLocaleLowerCase().includes(o.value.toLocaleLowerCase())));
    function c(r) {
      if (t.disabled) return;
      const i = t.modelValue ?? [];
      l("update:modelValue", i.includes(r) ? i.filter((n) => n !== r) : [...i, r]);
    }
    return (r, i) => (m(), h("fieldset", {
      class: "work-chip-picker",
      disabled: e.disabled
    }, [
      u("legend", null, U(e.label), 1),
      e.options.length > 10 ? (m(), B(d(se), {
        key: 0,
        modelValue: o.value,
        "onUpdate:modelValue": i[0] || (i[0] = (n) => o.value = n),
        type: "search",
        "aria-label": "Find " + e.label.toLowerCase(),
        placeholder: "Find a choice…"
      }, null, 8, ["modelValue", "aria-label"])) : I("", !0),
      u("div", is, [
        f(d(Ga), {
          "model-value": e.modelValue ?? [],
          options: v.value.map((n) => ({ value: n.value, label: n.label ?? d(ge)(n.value) })),
          optionLabel: "label",
          optionValue: "value",
          multiple: "",
          disabled: e.disabled,
          "aria-label": e.label,
          "onUpdate:modelValue": i[1] || (i[1] = (n) => l("update:modelValue", n ?? []))
        }, null, 8, ["model-value", "options", "disabled", "aria-label"]),
        (m(!0), h(q, null, _(e.modelValue?.filter((n) => !s.value.some((b) => b.value === n)) ?? [], (n) => (m(), B(d(K), {
          severity: "secondary",
          text: "",
          size: "small",
          key: n,
          type: "button",
          class: "work-choice work-unavailable",
          "aria-label": "Remove unavailable " + n,
          onClick: (b) => c(n)
        }, {
          default: L(() => [
            M(U(d(ge)(n)) + " · unavailable ×", 1)
          ]),
          _: 2
        }, 1032, ["aria-label", "onClick"]))), 128))
      ]),
      e.options.length ? I("", !0) : (m(), h("span", ns, "No choices declared."))
    ], 8, os));
  }
}), ss = {
  class: "work-stack",
  "aria-label": "Item types editor"
}, rs = { class: "work-section-heading" }, ds = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, us = { class: "work-definition-meta" }, cs = { class: "work-settings-grid" }, ms = { class: "work-stack work-tight" }, vs = { class: "work-stack work-tight" }, fs = { class: "work-stack work-tight" }, ps = { class: "work-stack work-tight" }, bs = {
  key: 0,
  class: "work-stack work-tight work-small"
}, hs = {
  key: 0,
  class: "kx-empty"
}, ys = { class: "work-row work-add-definition" }, gs = { class: "work-stack work-tight" }, ks = {
  key: 0,
  class: "work-error work-small"
}, ws = /* @__PURE__ */ ue({
  __name: "TypesEditor",
  props: {
    draft: {},
    guardRemoval: { type: Function },
    issues: {}
  },
  setup(e) {
    const a = e, t = W(() => a.draft.item_types ?? []), l = z(""), o = z(""), s = z(""), v = W(() => /^[a-z][a-z0-9_]*$/.test(l.value) && !t.value.some((w) => w.id === l.value));
    function c() {
      v.value && ((a.draft.item_types ??= []).push({ id: l.value, title: ge(l.value), process: a.draft.processes?.[0]?.id ?? "", fields: [] }), l.value = "");
    }
    function r(w, y) {
      const k = w.id;
      w.id = y;
      for (const C of t.value) C.parent_types && (C.parent_types = C.parent_types.map((R) => R === k ? y : R));
    }
    function i(w, y) {
      w.fields = y, w.inherit && (w.inherit = w.inherit.filter((k) => y.includes(k)));
    }
    function n(w) {
      return t.value.filter((y) => y.id !== w.id && y.parent_types?.includes(w.id)).map((y) => y.title || ge(y.id));
    }
    async function b(w) {
      if (!s.value) {
        if (n(w).length) {
          o.value = `${w.title || ge(w.id)} is a parent type for ${n(w).join(", ")}. Remove those parent selections first.`;
          return;
        }
        s.value = w.id, o.value = "";
        try {
          const y = await a.guardRemoval?.("item_types", w.id);
          y ? o.value = y : Jt(a.draft, "item_types", w.id);
        } finally {
          s.value = "";
        }
      }
    }
    return (w, y) => (m(), h("section", ss, [
      u("header", rs, [
        y[1] || (y[1] = u("div", null, [
          u("h2", null, "Item types"),
          u("p", { class: "work-muted work-small" }, "Choose the fields, parent relationships and process for each kind of work.")
        ], -1)),
        f(d(Ae), {
          class: "kx-tag-sm",
          severity: "secondary"
        }, {
          default: L(() => [
            M(U(t.value.length) + " " + U(t.value.length === 1 ? "type" : "types"), 1)
          ]),
          _: 1
        })
      ]),
      o.value ? (m(), h("p", ds, U(o.value), 1)) : I("", !0),
      f(ka, {
        columns: "types",
        count: t.value.length
      }, {
        default: L(() => [
          (m(!0), h(q, null, _(t.value, (k, C) => (m(), B(ga, {
            title: k.title || d(ge)(k.id),
            code: k.id,
            kind: e.draft.processes?.find((R) => R.id === k.process)?.name || d(ge)(k.process),
            key: C,
            class: "work-type-card"
          }, {
            usage: L(() => [
              u("span", us, [
                f(d(Ae), {
                  class: "kx-tag-sm",
                  severity: "secondary"
                }, {
                  default: L(() => [
                    M(U(k.fields.length) + " " + U(k.fields.length === 1 ? "field" : "fields"), 1)
                  ]),
                  _: 2
                }, 1024),
                n(k).length ? (m(), B(d(Ae), {
                  key: 0,
                  class: "kx-tag-sm",
                  severity: "secondary"
                }, {
                  default: L(() => [
                    M("Parent of " + U(n(k).join(", ")), 1)
                  ]),
                  _: 2
                }, 1024)) : I("", !0)
              ])
            ]),
            actions: L(() => [
              f(d(K), {
                severity: "secondary",
                text: "",
                size: "small",
                disabled: !!s.value,
                onClick: (R) => b(k),
                "aria-label": "Remove type"
              }, {
                default: L(() => [
                  f(d(Z), {
                    icon: "tabler:trash",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["disabled", "onClick"])
            ]),
            default: L(() => [
              (m(!0), h(q, null, _(e.issues?.filter((R) => R.code === "item_type " + k.id) ?? [], (R) => (m(), h("p", {
                key: R.what,
                class: "work-error work-small",
                role: "alert"
              }, U(d(ya)(R)), 1))), 128)),
              u("div", cs, [
                u("label", ms, [
                  y[2] || (y[2] = M("ID", -1)),
                  f(d(se), {
                    value: k.id,
                    onChange: (R) => r(k, R.target.value),
                    required: "",
                    pattern: "[a-z][a-z0-9_]*"
                  }, null, 8, ["value", "onChange"])
                ]),
                u("label", vs, [
                  y[3] || (y[3] = M("Title", -1)),
                  f(d(se), {
                    modelValue: k.title,
                    "onUpdate:modelValue": (R) => k.title = R,
                    placeholder: d(ge)(k.id)
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder"])
                ]),
                u("label", fs, [
                  y[4] || (y[4] = M("Process", -1)),
                  f(d(ee), {
                    modelValue: k.process,
                    "onUpdate:modelValue": (R) => k.process = R,
                    required: "",
                    appendTo: "self",
                    optionLabel: "label",
                    optionValue: "value",
                    optionDisabled: "disabled",
                    options: [...(e.draft.processes ?? []).map((R) => ({ label: R.name || d(ge)(R.id), value: R.id, disabled: !1 }))]
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                ])
              ]),
              f(Nt, {
                label: "Fields",
                options: (e.draft.fields ?? []).map((R) => ({ value: R.code, label: d(Vt)(R) })),
                "model-value": k.fields,
                "onUpdate:modelValue": (R) => i(k, R)
              }, null, 8, ["options", "model-value", "onUpdate:modelValue"]),
              f(Nt, {
                label: "Parent types",
                options: t.value.map((R) => ({ value: R.id, label: R.title || d(ge)(R.id) })),
                modelValue: k.parent_types,
                "onUpdate:modelValue": (R) => k.parent_types = R
              }, null, 8, ["options", "modelValue", "onUpdate:modelValue"]),
              u("div", ps, [
                f(Nt, {
                  label: "Inherit from parent",
                  options: k.fields.map((R) => ({ value: R, label: d(Vt)(e.draft.fields?.find(($) => $.code === R) ?? { code: R }) })),
                  modelValue: k.inherit,
                  "onUpdate:modelValue": (R) => k.inherit = R
                }, null, 8, ["options", "modelValue", "onUpdate:modelValue"]),
                y[5] || (y[5] = u("p", { class: "work-muted work-small" }, "These fields resolve from the parent when this item has no own value.", -1))
              ]),
              k.parent_types?.length ? (m(), h("label", bs, [
                y[6] || (y[6] = M("When the parent moves", -1)),
                f(d(ee), {
                  modelValue: k.move_children,
                  "onUpdate:modelValue": (R) => k.move_children = R,
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
          t.value.length ? I("", !0) : (m(), h("p", hs, "Add an item type to connect fields to a process.")),
          u("div", ys, [
            u("label", gs, [
              y[7] || (y[7] = M("New type ID", -1)),
              f(d(se), {
                modelValue: l.value,
                "onUpdate:modelValue": y[0] || (y[0] = (k) => l.value = k),
                placeholder: "new_type",
                onKeydown: Ie(ye(c, ["prevent"]), ["enter"])
              }, null, 8, ["modelValue", "onKeydown"])
            ]),
            f(d(K), {
              label: "Add type",
              severity: "secondary",
              disabled: !v.value,
              onClick: c,
              outlined: ""
            }, {
              icon: L(() => [
                f(d(Z), {
                  icon: "tabler:plus",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["disabled"]),
            l.value && !v.value ? (m(), h("span", ks, "Use a unique lowercase code with letters, numbers and underscores.")) : I("", !0)
          ])
        ]),
        _: 1
      }, 8, ["count"])
    ]));
  }
}), Vs = ".work-process-canvas>svg{height:480px;width:100%}.work-process-canvas:focus-visible{outline:var(--p-focus-ring-width) var(--p-focus-ring-style) var(--p-focus-ring-color);outline-offset:var(--p-focus-ring-offset)}.work-state-card{fill:var(--p-content-background);stroke:var(--p-content-border-color);stroke-width:1.5}.work-graph-node.work-selected .work-state-card{stroke:var(--p-primary-color);stroke-width:2.5;fill:color-mix(in srgb,var(--p-primary-color) 6%,var(--p-content-background))}.work-graph-node:focus-visible .work-state-card{stroke:var(--p-focus-ring-color);stroke-width:var(--p-focus-ring-width)}.work-process-canvas .work-edge-label{font-size:12px;fill:var(--p-text-color)}.work-process-canvas .work-edge-label-bg{fill:var(--p-content-background);stroke:var(--p-content-border-color);stroke-width:1}.work-edge-line{stroke:var(--p-primary-color);stroke-width:1.5}.work-edge-return .work-edge-line{stroke:var(--p-text-muted-color);stroke-dasharray:5 4}.work-graph-arrow{fill:context-stroke}.work-lane-line{fill:none;stroke:var(--p-text-muted-color);stroke-width:1.5;stroke-dasharray:2 4}.work-node-connector{fill:var(--p-content-background);stroke:var(--p-primary-color);stroke-width:1.5}.work-node-connector:hover,.work-node-connector:focus-visible{fill:var(--p-primary-color)}.work-process-legend{position:static;flex-wrap:wrap;padding:10px 16px;border-top:1px solid var(--p-content-border-color);background:var(--p-content-background)}@media(max-width:700px){.work-process-canvas>svg{height:420px}}.work-process-more{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:8px;padding:8px 16px;border-top:1px solid var(--p-content-border-color);background:var(--p-content-background);color:var(--p-text-muted-color);font-size:12px}.work-process-canvas .work-graph-edge.work-selected .work-edge-label-bg{fill:var(--p-primary-color);stroke:var(--p-primary-color)}.work-process-canvas .work-graph-edge.work-selected .work-edge-label{fill:var(--p-primary-contrast-color)}", fl = /* @__PURE__ */ new WeakSet();
function $s(e) {
  const a = e.getRootNode();
  if (a instanceof ShadowRoot && !fl.has(a)) {
    const t = e.ownerDocument.createElement("style");
    t.textContent = Vs, a.append(t), fl.add(a);
  }
}
const xs = 0.8;
function Ss(e, a, t) {
  const l = Math.min(1, a.width / e.width, a.height / e.height);
  if (l >= xs) return { zoom: l, pan: { x: (e.width - a.width / l) / 2, y: (e.height - a.height / l) / 2 } };
  const o = e.nodes.find((v) => v.state.id === t) ?? e.nodes[0], s = Math.min(1, a.width / ((o?.width ?? 190) + 64));
  return { zoom: s, pan: o ? { x: e.direction === "TB" ? o.x - a.width / s / 2 : o.x - o.width / 2 - 32, y: e.direction === "TB" ? o.y - o.height / 2 - 32 : o.y - a.height / s / 2 } : { x: 0, y: 0 } };
}
const Cs = ["onKeydown"], Es = {
  key: 0,
  class: "work-process-instruction",
  role: "status"
}, Ts = ["viewBox"], Us = ["id"], Ds = ["d", "marker-end"], Is = ["aria-label", "aria-pressed", "onFocus", "onClick", "onKeydown"], As = ["d"], Ps = ["d", "marker-end"], Os = ["x", "y", "width", "height"], Rs = ["x", "y"], Ns = ["x", "dy"], Ms = ["aria-label", "aria-pressed", "onClick", "onKeydown", "onFocus", "onPointerup"], Ls = ["x", "y", "width", "height"], zs = ["cx", "cy"], Bs = ["x", "y"], Fs = ["x", "dy"], js = ["x", "y"], qs = ["x", "dy"], Ws = {
  key: 0,
  class: "work-limit-text"
}, Gs = ["aria-label", "onClick", "onKeydown"], Ys = ["x", "y"], Hs = ["x", "dy"], Ks = ["cx", "cy", "aria-label", "onPointerdown", "onClick", "onKeydown"], Xs = ["d"], Js = {
  key: 1,
  class: "work-process-more",
  role: "status"
}, Zs = { class: "work-process-legend" }, Qs = /* @__PURE__ */ ue({
  __name: "ProcessGraph",
  props: {
    process: {},
    draft: {},
    selectedState: {},
    selectedTransition: {}
  },
  emits: ["state", "transition", "connect", "clear"],
  setup(e, { expose: a, emit: t }) {
    const l = e, o = t, s = eo().replace(/:/g, "_"), v = z(""), c = z(), r = z(), i = z(900), n = z(!1), b = W(() => i.value < 700 ? 420 : 480), w = W(() => To(l.process, l.draft, { width: i.value, height: b.value })), y = z(1), k = z({ x: 0, y: 0 }), C = z({ x: 0, y: 0 }), R = W(() => ({ width: i.value, height: n.value ? Math.max(b.value, w.value.height * Math.min(1, i.value / w.value.width)) : b.value })), $ = W(() => w.value.nodes.filter((p) => p.x - p.width / 2 >= k.value.x && p.x + p.width / 2 <= k.value.x + R.value.width / y.value && p.y - p.height / 2 >= k.value.y && p.y + p.height / 2 <= k.value.y + R.value.height / y.value).length);
    function D() {
      n.value = !1;
      const p = Ss(w.value, R.value, l.process.initial);
      y.value = p.zoom, k.value = p.pan;
    }
    const E = W(() => `${k.value.x} ${k.value.y} ${R.value.width / y.value} ${R.value.height / y.value}`), T = W(() => w.value.nodes.find((p) => p.state.id === v.value));
    function V() {
      n.value = !0, y.value = Math.min(1, R.value.width / w.value.width), k.value = { x: (w.value.width - R.value.width / y.value) / 2, y: 0 };
    }
    function P(p) {
      const x = Math.max(0.02, Math.min(3, y.value * p)), g = 1 / y.value - 1 / x;
      k.value = { x: k.value.x + R.value.width * g / 2, y: k.value.y + R.value.height * g / 2 }, y.value = x;
    }
    function G(p) {
      const x = R.value.width / y.value, g = R.value.height / y.value;
      (p.x - p.width / 2 < k.value.x || p.x + p.width / 2 > k.value.x + x || p.y - p.height / 2 < k.value.y || p.y + p.height / 2 > k.value.y + g) && (k.value = { x: p.x - x / 2, y: p.y - g / 2 });
    }
    function ce() {
      const p = w.value.nodes.find((x) => x.state === l.selectedState) ?? w.value.edges.find((x) => x.transition === l.selectedTransition);
      p && G(p);
    }
    Ee([w, () => l.selectedState, () => l.selectedTransition], ce, { flush: "post" }), Ee(() => l.process.id, () => {
      v.value = "", A.clear(), D();
    }, { flush: "post" });
    function re(p) {
      if (p.target !== c.value) return;
      (p.key === "+" || p.key === "=") && (p.preventDefault(), P(1.2)), p.key === "-" && (p.preventDefault(), P(1 / 1.2)), p.key === "0" && (p.preventDefault(), V());
      const x = 60 / y.value;
      p.key.startsWith("Arrow") && (p.preventDefault(), k.value = { x: k.value.x + (p.key === "ArrowRight" ? x : p.key === "ArrowLeft" ? -x : 0), y: k.value.y + (p.key === "ArrowDown" ? x : p.key === "ArrowUp" ? -x : 0) });
    }
    function J(p) {
      v.value && v.value !== p.id && o("connect", v.value, p.id), v.value = "";
    }
    function O(p, x) {
      v.value = x.state.id, C.value = { x: x.x, y: x.y };
      const g = p.target;
      g instanceof Element && g.hasPointerCapture?.(p.pointerId) && g.releasePointerCapture(p.pointerId);
    }
    function te(p, x) {
      if ((p.key === "Enter" || p.key === " ") && (p.preventDefault(), v.value ? J(x) : o("state", x)), ["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp"].includes(p.key)) {
        p.preventDefault();
        const g = Array.from(r.value?.querySelectorAll(".work-graph-node") ?? []), j = w.value.nodes.findIndex((ne) => ne.state === x), Y = ["ArrowRight", "ArrowDown"].includes(p.key) ? 1 : -1;
        g[(j + Y + g.length) % g.length]?.focus();
      }
    }
    function S() {
      v.value = "", A.clear(), o("clear");
    }
    const A = /* @__PURE__ */ new Map();
    let N = 0;
    function X(p) {
      if (!p.target.closest('[role="button"]') && (A.set(p.pointerId, { x: p.clientX, y: p.clientY }), c.value?.setPointerCapture?.(p.pointerId), A.size === 2)) {
        const [x, g] = [...A.values()];
        N = Math.hypot(x.x - g.x, x.y - g.y);
      }
    }
    function de(p) {
      const x = r.value?.getBoundingClientRect();
      if (!x?.width) return;
      if (v.value) {
        C.value = { x: k.value.x + (p.clientX - x.left) * R.value.width / y.value / x.width, y: k.value.y + (p.clientY - x.top) * R.value.height / y.value / x.height };
        return;
      }
      const g = A.get(p.pointerId);
      if (g)
        if (A.set(p.pointerId, { x: p.clientX, y: p.clientY }), A.size === 2) {
          const [j, Y] = [...A.values()], ne = Math.hypot(j.x - Y.x, j.y - Y.y);
          N && P(ne / N), N = ne;
        } else k.value = { x: k.value.x - (p.clientX - g.x) * R.value.width / y.value / x.width, y: k.value.y - (p.clientY - g.y) * R.value.height / y.value / x.height };
    }
    function fe(p) {
      A.delete(p.pointerId), N = 0, v.value = "";
    }
    function be(p) {
      p.ctrlKey && (p.preventDefault(), P(Math.exp(-p.deltaY * 0.01)));
    }
    let xe;
    ha(() => {
      if (c.value && $s(c.value), typeof ResizeObserver < "u" && r.value) {
        let p = !0;
        xe = new ResizeObserver(() => {
          const x = r.value?.getBoundingClientRect();
          if (!x?.width || !x.height) return;
          const g = R.value.width;
          i.value = x.width, (p || Math.abs(x.width - g) > 1) && (n.value ? V() : D(), p = !1), ce();
        }), xe.observe(r.value);
      }
    }), $t(() => xe?.disconnect()), a({ fit: V, zoomIn: () => P(1.2), zoomOut: () => P(1 / 1.2) });
    function Pe(p) {
      return p.category === "completed" ? "check" : p.category === "canceled" ? "x" : p.id === l.process.initial ? "arrow-bar-to-right" : { gate: "shield-check", automated: "bolt", parallel: "arrows-split" }[p.kind ?? ""] ?? "user";
    }
    return (p, x) => (m(), h("section", {
      ref_key: "canvas",
      ref: c,
      class: "work-process-canvas",
      "aria-label": "Process map",
      tabindex: "0",
      onKeydown: [
        re,
        Ie(ye(S, ["stop"]), ["esc"])
      ],
      onPointerdown: X,
      onPointermove: de,
      onPointerup: fe,
      onPointercancel: S,
      onWheel: be
    }, [
      v.value ? (m(), h("p", Es, "Choose the next stop. Escape cancels.")) : I("", !0),
      (m(), h("svg", {
        ref_key: "svg",
        ref: r,
        style: to({ height: R.value.height + "px" }),
        viewBox: E.value,
        role: "group",
        "aria-label": "States and transitions"
      }, [
        u("defs", null, [
          u("marker", {
            id: d(s) + "-arrow",
            viewBox: "0 0 8 8",
            refX: "7",
            refY: "4",
            markerWidth: "6",
            markerHeight: "6",
            orient: "auto"
          }, [...x[1] || (x[1] = [
            u("path", {
              d: "M0 0 L8 4 L0 8 z",
              class: "work-graph-arrow"
            }, null, -1)
          ])], 8, Us)
        ]),
        (m(!0), h(q, null, _(w.value.parallels, (g) => (m(), h("path", {
          key: g.key,
          d: g.path,
          class: "work-lane-line",
          "marker-end": `url(#${d(s)}-arrow)`
        }, [
          u("title", null, "Parallel lane from " + U(d(he)(g.state)), 1)
        ], 8, Ds))), 128)),
        (m(!0), h(q, null, _(w.value.edges, (g) => (m(), h("g", {
          key: g.key,
          class: ct(["work-graph-edge", ["work-edge-" + g.type, { "work-selected": e.selectedTransition === g.transition }]]),
          role: "button",
          tabindex: "0",
          "aria-label": "Edit transition " + d(qe)(g.transition),
          "aria-pressed": e.selectedTransition === g.transition,
          onFocus: (j) => G(g),
          onClick: (j) => o("transition", g.transition),
          onKeydown: [
            Ie(ye((j) => o("transition", g.transition), ["prevent"]), ["enter"]),
            Ie(ye((j) => o("transition", g.transition), ["prevent"]), ["space"])
          ]
        }, [
          u("path", {
            d: g.path,
            class: "work-edge-hit"
          }, null, 8, As),
          u("path", {
            d: g.path,
            class: "work-edge-line",
            "marker-end": `url(#${d(s)}-arrow)`
          }, null, 8, Ps),
          u("rect", {
            x: g.x - g.width / 2,
            y: g.y - g.height / 2,
            width: g.width,
            height: g.height,
            rx: "6",
            class: "work-edge-label-bg"
          }, null, 8, Os),
          u("text", {
            x: g.x,
            y: g.y - (g.lines.length - 1) * 8 + 4,
            class: "work-edge-label",
            "text-anchor": "middle"
          }, [
            (m(!0), h(q, null, _(g.lines, (j, Y) => (m(), h("tspan", {
              key: Y,
              x: g.x,
              dy: Y ? 16 : 0
            }, U(j), 9, Ns))), 128))
          ], 8, Rs)
        ], 42, Is))), 128)),
        (m(!0), h(q, null, _(w.value.nodes, (g) => (m(), h("g", {
          key: g.state.id,
          class: ct(["work-graph-node", ["work-stop-" + g.state.category, { "work-selected": e.selectedState === g.state }]]),
          role: "button",
          tabindex: "0",
          "aria-label": "Edit state " + d(he)(g.state),
          "aria-pressed": e.selectedState === g.state,
          onClick: (j) => o("state", g.state),
          onKeydown: (j) => te(j, g.state),
          onFocus: (j) => G(g),
          onPointerup: ye((j) => J(g.state), ["stop"])
        }, [
          u("rect", {
            x: g.x - g.width / 2,
            y: g.y - g.height / 2,
            width: g.width,
            height: g.height,
            rx: "10",
            class: "work-state-card"
          }, null, 8, Ls),
          u("circle", {
            cx: g.x - g.width / 2 + 22,
            cy: g.y - g.height / 2 + 25,
            r: "10",
            class: "work-stop-ring"
          }, null, 8, zs),
          f(d(Z), {
            icon: "tabler:" + Pe(g.state),
            x: g.x - g.width / 2 + 15,
            y: g.y - g.height / 2 + 18,
            width: "14",
            height: "14",
            class: "work-stop-icon",
            "aria-hidden": "true"
          }, null, 8, ["icon", "x", "y"]),
          u("text", {
            x: g.x - g.width / 2 + 42,
            y: g.y - g.height / 2 + 29,
            class: "work-node-name"
          }, [
            (m(!0), h(q, null, _(g.title, (j, Y) => (m(), h("tspan", {
              key: Y,
              x: g.x - g.width / 2 + 42,
              dy: Y ? 18 : 0
            }, U(j), 9, Fs))), 128))
          ], 8, Bs),
          u("text", {
            x: g.x - g.width / 2 + 16,
            y: g.y - g.height / 2 + 33 + g.title.length * 18,
            class: "work-node-meta"
          }, [
            (m(!0), h(q, null, _(g.caption, (j, Y) => (m(), h("tspan", {
              key: Y,
              x: g.x - g.width / 2 + 16,
              dy: Y ? 16 : 0
            }, U(j), 9, qs))), 128)),
            e.draft.policy?.wip?.[g.state.id] ? (m(), h("tspan", Ws, " · limit " + U(e.draft.policy.wip[g.state.id].limit), 1)) : I("", !0)
          ], 8, js),
          (m(!0), h(q, null, _(g.badges, (j, Y) => (m(), h("g", {
            key: j.id,
            class: "work-any-transition",
            role: "button",
            tabindex: "0",
            "aria-label": "Edit transition " + d(qe)(j),
            onClick: ye((ne) => o("transition", j), ["stop"]),
            onKeydown: [
              Ie(ye((ne) => o("transition", j), ["stop", "prevent"]), ["enter"]),
              Ie(ye((ne) => o("transition", j), ["stop", "prevent"]), ["space"])
            ]
          }, [
            u("text", {
              x: g.x - g.width / 2 + 16,
              y: g.y - g.height / 2 + 33 + g.title.length * 18 + g.caption.length * 16 + g.badges.slice(0, Y).reduce((ne, pe) => ne + d(It)(d(qe)(pe) + " works from any state").length * 18, 0),
              class: "work-node-meta"
            }, [
              (m(!0), h(q, null, _(d(It)(d(qe)(j) + " works from any state"), (ne, pe) => (m(), h("tspan", {
                key: pe,
                x: g.x - g.width / 2 + 16,
                dy: pe ? 18 : 0
              }, U(ne), 9, Hs))), 128))
            ], 8, Ys)
          ], 40, Gs))), 128)),
          ["completed", "canceled"].includes(g.state.category) ? I("", !0) : (m(), h("circle", {
            key: 0,
            cx: w.value.direction === "TB" ? g.x : g.x + g.width / 2,
            cy: w.value.direction === "TB" ? g.y + g.height / 2 : g.y,
            r: "7",
            class: "work-node-connector",
            role: "button",
            tabindex: "0",
            "aria-label": "Connect from " + d(he)(g.state),
            onPointerdown: ye((j) => O(j, g), ["stop", "prevent"]),
            onClick: ye((j) => o("state", g.state), ["stop"]),
            onKeydown: [
              Ie(ye((j) => {
                v.value = g.state.id, C.value = { x: g.x, y: g.y };
              }, ["stop", "prevent"]), ["enter"]),
              Ie(ye((j) => v.value = g.state.id, ["stop", "prevent"]), ["space"])
            ]
          }, null, 40, Ks))
        ], 42, Ms))), 128)),
        T.value ? (m(), h("path", {
          key: 0,
          d: `M ${w.value.direction === "TB" ? T.value.x : T.value.x + T.value.width / 2} ${w.value.direction === "TB" ? T.value.y + T.value.height / 2 : T.value.y} L ${C.value.x} ${C.value.y}`,
          class: "work-connect-ghost"
        }, null, 8, Xs)) : I("", !0)
      ], 12, Ts)),
      !n.value && $.value < e.process.states.length ? (m(), h("div", Js, [
        u("span", null, U($.value) + " of " + U(e.process.states.length) + " states in view · More " + U(w.value.direction === "TB" ? "below" : "to the right"), 1),
        f(d(K), {
          label: "Show full process",
          size: "small",
          text: "",
          onClick: x[0] || (x[0] = (g) => V())
        })
      ])) : I("", !0),
      u("div", Zs, [
        u("span", null, U(e.process.states.length) + " states · " + U(Math.round(y.value * 100)) + "%", 1),
        x[2] || (x[2] = u("span", null, [
          u("i"),
          M("Transition")
        ], -1)),
        x[3] || (x[3] = u("span", null, [
          u("i", { class: "work-return-key" }),
          M("Return / loop")
        ], -1)),
        x[4] || (x[4] = u("span", null, "Drag to pan · Ctrl + scroll to zoom · Fit for full process", -1))
      ])
    ], 40, Cs));
  }
}), _s = {
  class: "work-process-list work-stack",
  "aria-label": "Process list"
}, er = { class: "work-stack work-tight" }, tr = { class: "work-table-scroll" }, ar = { class: "work-settings-table work-process-table" }, lr = ["aria-selected"], or = { class: "work-process-list-actions" }, ir = { class: "work-table-scroll" }, nr = { class: "work-settings-table work-process-table" }, sr = ["aria-selected"], rr = { class: "work-process-list-actions" }, dr = /* @__PURE__ */ ue({
  __name: "ProcessList",
  props: {
    process: {},
    selectedState: {},
    selectedTransition: {}
  },
  emits: ["state", "transition", "removeState", "removeTransition", "addTransition"],
  setup(e) {
    return (a, t) => (m(), h("section", _s, [
      u("label", er, [
        t[2] || (t[2] = M("Process name", -1)),
        f(d(se), {
          modelValue: e.process.name,
          "onUpdate:modelValue": t[0] || (t[0] = (l) => e.process.name = l),
          "aria-label": "Process name"
        }, null, 8, ["modelValue"])
      ]),
      t[5] || (t[5] = u("h3", null, "States", -1)),
      u("div", tr, [
        u("table", ar, [
          t[3] || (t[3] = u("thead", null, [
            u("tr", null, [
              u("th", null, "Name"),
              u("th", null, "Phase"),
              u("th", null, "Kind"),
              u("th", null, "Actions")
            ])
          ], -1)),
          u("tbody", null, [
            (m(!0), h(q, null, _(e.process.states, (l) => (m(), h("tr", {
              key: l.id,
              "aria-selected": e.selectedState === l
            }, [
              u("td", null, [
                f(d(se), {
                  modelValue: l.name,
                  "onUpdate:modelValue": (o) => l.name = o,
                  "aria-label": "Name of " + d(he)(l)
                }, null, 8, ["modelValue", "onUpdate:modelValue", "aria-label"])
              ]),
              u("td", null, U(d(Wa)(l.category)), 1),
              u("td", null, [
                f(d(Ae), { severity: "secondary" }, {
                  default: L(() => [
                    M(U(d(xl)(l.kind)), 1)
                  ]),
                  _: 2
                }, 1024)
              ]),
              u("td", or, [
                f(d(K), {
                  size: "small",
                  text: "",
                  severity: "secondary",
                  "aria-label": "Edit state",
                  onClick: (o) => a.$emit("state", l)
                }, {
                  default: L(() => [
                    f(d(Z), { icon: "tabler:pencil" })
                  ]),
                  _: 1
                }, 8, ["onClick"]),
                f(d(K), {
                  size: "small",
                  text: "",
                  severity: "danger",
                  "aria-label": "Remove state " + d(he)(l),
                  onClick: (o) => a.$emit("removeState", l)
                }, {
                  default: L(() => [
                    f(d(Z), { icon: "tabler:trash" })
                  ]),
                  _: 1
                }, 8, ["aria-label", "onClick"])
              ])
            ], 8, lr))), 128))
          ])
        ])
      ]),
      t[6] || (t[6] = u("h3", null, "Transitions", -1)),
      u("div", ir, [
        u("table", nr, [
          t[4] || (t[4] = u("thead", null, [
            u("tr", null, [
              u("th", null, "Name"),
              u("th", null, "From"),
              u("th", null, "To"),
              u("th", null, "Actions")
            ])
          ], -1)),
          u("tbody", null, [
            (m(!0), h(q, null, _(e.process.transitions ?? [], (l) => (m(), h("tr", {
              key: l.id,
              "aria-selected": e.selectedTransition === l
            }, [
              u("td", null, [
                f(d(se), {
                  modelValue: l.name,
                  "onUpdate:modelValue": (o) => l.name = o,
                  placeholder: d(qe)(l),
                  "aria-label": "Name of " + d(qe)(l)
                }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder", "aria-label"])
              ]),
              u("td", null, U(l.from === "any" ? "Any state" : l.from.map((o) => d(he)(e.process.states.find((s) => s.id === o))).join(", ")), 1),
              u("td", null, U(d(he)(e.process.states.find((o) => o.id === l.to))), 1),
              u("td", rr, [
                f(d(K), {
                  size: "small",
                  text: "",
                  severity: "secondary",
                  "aria-label": "Edit transition",
                  onClick: (o) => a.$emit("transition", l)
                }, {
                  default: L(() => [
                    f(d(Z), { icon: "tabler:pencil" })
                  ]),
                  _: 1
                }, 8, ["onClick"]),
                f(d(K), {
                  size: "small",
                  text: "",
                  severity: "danger",
                  "aria-label": "Remove transition " + d(qe)(l),
                  onClick: (o) => a.$emit("removeTransition", l)
                }, {
                  default: L(() => [
                    f(d(Z), { icon: "tabler:trash" })
                  ]),
                  _: 1
                }, 8, ["aria-label", "onClick"])
              ])
            ], 8, sr))), 128))
          ])
        ])
      ]),
      f(d(K), {
        label: "Add transition",
        severity: "secondary",
        outlined: "",
        onClick: t[1] || (t[1] = (l) => a.$emit("addTransition"))
      }, {
        icon: L(() => [
          f(d(Z), { icon: "tabler:plus" })
        ]),
        _: 1
      })
    ]));
  }
}), ur = { class: "work-stack work-transition-settings" }, cr = { class: "work-stack work-tight" }, mr = { class: "work-row" }, vr = { class: "work-row" }, fr = { class: "work-row" }, pr = { class: "work-stack work-tight" }, br = { class: "work-row" }, hr = { class: "work-stack work-tight" }, yr = { class: "work-stack work-tight" }, gr = /* @__PURE__ */ ue({
  __name: "TransitionSettings",
  props: {
    transition: {},
    process: {},
    draft: {},
    advanced: { type: Boolean },
    boardId: {}
  },
  emits: ["validity"],
  setup(e, { emit: a }) {
    const t = e, l = a;
    function o() {
      (t.transition.set ??= []).push({ field: t.draft.fields?.[0]?.code ?? "", value: "" });
    }
    function s(v, c) {
      const r = t.transition.set?.[v];
      !r || !t.transition.set || (t.transition.set[v] = { field: r.field, ...c === "clear" ? { clear: !0 } : c === "copy" ? { copy: "" } : { value: "" } });
    }
    return (v, c) => (m(), h("div", ur, [
      u("label", cr, [
        c[14] || (c[14] = M("To state", -1)),
        f(d(ee), {
          modelValue: e.transition.to,
          "onUpdate:modelValue": c[0] || (c[0] = (r) => e.transition.to = r),
          "aria-label": "To state",
          appendTo: "self",
          optionLabel: "label",
          optionValue: "value",
          options: e.process.states.map((r) => ({ label: d(he)(r), value: r.id }))
        }, null, 8, ["modelValue", "options"])
      ]),
      u("label", mr, [
        c[15] || (c[15] = u("span", { class: "work-spacer" }, "Happens automatically", -1)),
        f(d(Re), {
          "model-value": e.transition.auto,
          "onUpdate:modelValue": c[1] || (c[1] = (r) => {
            e.transition.auto = r, r || delete e.transition.default;
          }),
          "aria-label": "Automatic transition"
        }, null, 8, ["model-value"])
      ]),
      u("label", vr, [
        c[16] || (c[16] = u("span", { class: "work-spacer" }, "Default automatic transition", -1)),
        f(d(Re), {
          modelValue: e.transition.default,
          "onUpdate:modelValue": c[2] || (c[2] = (r) => e.transition.default = r),
          disabled: !e.transition.auto,
          "aria-label": "Default transition"
        }, null, 8, ["modelValue", "disabled"])
      ]),
      u("label", fr, [
        c[17] || (c[17] = u("span", { class: "work-spacer" }, "Works from any state", -1)),
        f(d(Re), {
          "model-value": e.transition.from === "any",
          "aria-label": "Works from any state",
          "onUpdate:modelValue": c[3] || (c[3] = (r) => e.transition.from = r ? "any" : [])
        }, null, 8, ["model-value"])
      ]),
      e.transition.from !== "any" ? (m(), B(Nt, {
        key: 0,
        label: "From states",
        options: e.process.states.map((r) => ({ value: r.id, label: d(he)(r) })),
        modelValue: e.transition.from,
        "onUpdate:modelValue": c[4] || (c[4] = (r) => e.transition.from = r)
      }, null, 8, ["options", "modelValue"])) : I("", !0),
      c[22] || (c[22] = u("h4", { class: "work-process-group" }, "Must be filled", -1)),
      f(Nt, {
        label: "Required fields",
        options: e.draft.fields?.map((r) => ({ value: r.code, label: r.title || r.code })) ?? [],
        modelValue: e.transition.require,
        "onUpdate:modelValue": c[5] || (c[5] = (r) => e.transition.require = r)
      }, null, 8, ["options", "modelValue"]),
      c[23] || (c[23] = u("h4", { class: "work-process-group" }, "Also sets", -1)),
      (m(!0), h(q, null, _(e.transition.set ?? [], (r, i) => (m(), h("div", {
        key: i,
        class: "work-process-value work-stack work-tight"
      }, [
        u("label", pr, [
          c[18] || (c[18] = M("Field", -1)),
          f(d(ee), {
            modelValue: r.field,
            "onUpdate:modelValue": (n) => r.field = n,
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            options: e.draft.fields?.map((n) => ({ value: n.code, label: n.title || n.code })) ?? []
          }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
        ]),
        u("div", br, [
          f(d(ee), {
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
            "onUpdate:modelValue": (n) => s(i, n)
          }, null, 8, ["model-value", "onUpdate:modelValue"]),
          f(d(K), {
            text: "",
            severity: "danger",
            "aria-label": "Remove value " + (i + 1),
            onClick: (n) => e.transition.set?.splice(i, 1)
          }, {
            default: L(() => [
              f(d(Z), { icon: "tabler:trash" })
            ]),
            _: 1
          }, 8, ["aria-label", "onClick"])
        ]),
        r.copy !== void 0 ? (m(), B(d(ee), {
          key: 0,
          modelValue: r.copy,
          "onUpdate:modelValue": (n) => r.copy = n,
          "aria-label": "Copy from field",
          appendTo: "self",
          optionLabel: "label",
          optionValue: "value",
          options: e.draft.fields?.map((n) => ({ value: n.code, label: n.title || n.code })) ?? []
        }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])) : r.clear ? I("", !0) : (m(!0), h(q, { key: 1 }, _(e.draft.fields?.filter((n) => n.code === r.field) ?? [], (n) => (m(), B(El, {
          key: n.code,
          "board-id": e.boardId ?? "",
          field: n,
          modelValue: r.value,
          "onUpdate:modelValue": (b) => r.value = b,
          onValidity: (b) => l("validity", "effect-" + i, b)
        }, null, 8, ["board-id", "field", "modelValue", "onUpdate:modelValue", "onValidity"]))), 128))
      ]))), 128)),
      f(d(K), {
        label: "Add value",
        severity: "secondary",
        outlined: "",
        size: "small",
        onClick: o
      }, {
        icon: L(() => [
          f(d(Z), { icon: "tabler:plus" })
        ]),
        _: 1
      }),
      e.advanced ? (m(), h(q, { key: 1 }, [
        u("label", hr, [
          c[19] || (c[19] = M("Offer to people", -1)),
          f(d(ee), {
            "model-value": e.transition.people,
            "aria-label": "Offer to people",
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            options: [{ label: "Work default", value: void 0 }, { label: "Offer explicitly", value: !0 }, { label: "Hide from people", value: !1 }],
            "onUpdate:modelValue": c[6] || (c[6] = (r) => e.transition.people = r)
          }, null, 8, ["model-value"])
        ]),
        u("label", yr, [
          c[20] || (c[20] = M("Evaluation order", -1)),
          f(d(Ze), {
            "model-value": e.transition.order ?? null,
            "aria-label": "Transition order",
            min: 0,
            useGrouping: !1,
            "onUpdate:modelValue": c[7] || (c[7] = (r) => e.transition.order = r ?? void 0)
          }, null, 8, ["model-value"])
        ]),
        c[21] || (c[21] = u("h4", { class: "work-process-group" }, "Only when", -1)),
        f(Ya, {
          label: "Allow this transition when",
          draft: e.draft,
          "board-id": e.boardId,
          "model-value": e.transition.when,
          "onUpdate:modelValue": c[8] || (c[8] = (r) => e.transition.when = r),
          onValidity: c[9] || (c[9] = (r) => l("validity", "when", r))
        }, null, 8, ["draft", "board-id", "model-value"]),
        f(ot, {
          label: "Set values",
          "model-value": e.transition.set,
          shape: "array",
          "onUpdate:modelValue": c[10] || (c[10] = (r) => e.transition.set = r),
          onValidity: c[11] || (c[11] = (r) => l("validity", "set", r))
        }, null, 8, ["model-value"]),
        f(ot, {
          label: "Guards",
          "model-value": e.transition.guards,
          shape: "array",
          "onUpdate:modelValue": c[12] || (c[12] = (r) => e.transition.guards = r),
          onValidity: c[13] || (c[13] = (r) => l("validity", "guards", r))
        }, null, 8, ["model-value"])
      ], 64)) : I("", !0)
    ]));
  }
}), ba = /* @__PURE__ */ ue({
  __name: "CapacityControl",
  props: {
    draft: {},
    state: {},
    label: {},
    hard: { type: Boolean }
  },
  setup(e) {
    const a = e, t = W(() => a.draft.policy?.wip?.[a.state]);
    function l(s) {
      if (s === null) {
        a.draft.policy?.wip && delete a.draft.policy.wip[a.state];
        return;
      }
      const v = a.draft.policy ??= {}, c = v.wip ??= {};
      c[a.state] = { ...c[a.state], limit: s };
    }
    function o(s) {
      t.value && (t.value.hard = s);
    }
    return (s, v) => e.hard ? (m(), B(d(Re), {
      key: 0,
      "aria-label": e.label,
      disabled: !t.value,
      "model-value": t.value?.hard ?? !1,
      "onUpdate:modelValue": o
    }, null, 8, ["aria-label", "disabled", "model-value"])) : (m(), B(d(Ze), {
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
}), ja = { minutes: 60, hours: 3600, days: 86400 };
function na(e, a) {
  const t = /^P(\d+)W$/.exec(e), l = /^P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+\.?\d*)S)?)?$/.exec(e);
  if (!t && (!l || e === "P" || e.endsWith("T"))) return;
  const o = t ? Number(t[1]) * 604800 : Number(l[1] ?? 0) * 86400 + Number(l[2] ?? 0) * 3600 + Number(l[3] ?? 0) * 60 + Number(l[4] ?? 0);
  if (!Number.isFinite(o) || o <= 0) return;
  const s = a ?? (o % 86400 === 0 ? "days" : o % 3600 === 0 ? "hours" : "minutes");
  return { amount: o / ja[s], unit: s };
}
function kr(e, a) {
  if (e == null) return;
  if (!Number.isFinite(e * ja[a]) || e <= 0) throw new Error("Enter a positive duration.");
  const t = (l) => l.toLocaleString("en-US", { useGrouping: !1, maximumSignificantDigits: 21 });
  return Number.isInteger(e) ? a === "days" ? `P${t(e)}D` : a === "hours" ? `PT${t(e)}H` : `PT${t(e)}M` : `PT${t(e * ja[a])}S`;
}
const wr = { class: "work-stack work-tight" }, Vr = {
  class: "work-duration-control",
  style: { "max-width": "360px" }
}, $r = {
  key: 0,
  class: "work-error",
  role: "alert"
}, wt = /* @__PURE__ */ ue({
  __name: "DurationControl",
  props: {
    modelValue: {},
    label: {},
    disabled: { type: Boolean }
  },
  emits: ["update:modelValue"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = z("days"), s = z("");
    Ee(() => t.modelValue, (i) => {
      s.value = "";
      const n = i ? na(i) : void 0;
      n && (o.value = n.unit);
    }, { immediate: !0 });
    const v = W(() => t.modelValue ? na(t.modelValue, o.value)?.amount ?? null : null);
    function c(i) {
      try {
        const n = kr(i, o.value);
        s.value = "", l("update:modelValue", n);
      } catch (n) {
        s.value = n.message;
      }
    }
    function r(i) {
      const n = v.value;
      o.value = i, !(t.modelValue && !na(t.modelValue)) && c(n);
    }
    return (i, n) => (m(), h("label", wr, [
      M(U(e.label), 1),
      u("span", Vr, [
        f(d(Ze), {
          "model-value": v.value,
          "aria-label": e.label,
          min: 0,
          disabled: e.disabled,
          useGrouping: !1,
          "onUpdate:modelValue": n[0] || (n[0] = (b) => c(b))
        }, null, 8, ["model-value", "aria-label", "disabled"]),
        f(d(ee), {
          "model-value": o.value,
          "aria-label": e.label + " unit",
          disabled: e.disabled,
          options: [{ label: "Minutes", value: "minutes" }, { label: "Hours", value: "hours" }, { label: "Days", value: "days" }],
          optionLabel: "label",
          optionValue: "value",
          appendTo: "self",
          "onUpdate:modelValue": n[1] || (n[1] = (b) => r(b))
        }, null, 8, ["model-value", "aria-label", "disabled"])
      ]),
      s.value || e.modelValue && !d(na)(e.modelValue) ? (m(), h("span", $r, U(s.value || `Unsupported duration: ${e.modelValue}`), 1)) : I("", !0)
    ]));
  }
}), xr = { class: "work-stack" }, Sr = { class: "work-settings-grid" }, Cr = { class: "work-stack work-tight" }, Er = { class: "work-stack work-tight" }, Tr = {
  key: 1,
  class: "work-stack work-tight"
}, Ur = { class: "work-stack work-tight" }, Dr = { class: "work-settings-grid" }, Ir = { class: "work-row" }, Ar = { class: "work-stack work-tight" }, Pr = {
  key: 0,
  class: "work-stack work-tight"
}, Or = /* @__PURE__ */ ue({
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
    function s() {
      const i = t.state.timers ?? (t.state.timers = []);
      i.push({ id: gt("timer", i), after: "P1D", then: { emit: "reminder" } });
    }
    function v(i, n) {
      delete i.after, delete i.at_field, n === "after" ? i.after = "P1D" : i.at_field = "";
    }
    function c(i, n, b) {
      b ? i[n] = b : (delete i[n], delete i.table);
    }
    function r(i, n) {
      i.then = n === "emit" ? { emit: "" } : { transition: "" };
    }
    return (i, n) => (m(), h("section", xr, [
      n[6] || (n[6] = u("h4", null, "Timers", -1)),
      (m(!0), h(q, null, _(o(), (b, w) => (m(), h("article", {
        key: w,
        class: "work-settings-card work-stack"
      }, [
        u("div", Sr, [
          u("label", Cr, [
            n[0] || (n[0] = M("Timer ID", -1)),
            f(d(se), {
              modelValue: b.id,
              "onUpdate:modelValue": (y) => b.id = y,
              required: "",
              pattern: "[a-z][a-z0-9_]*"
            }, null, 8, ["modelValue", "onUpdate:modelValue"])
          ]),
          u("label", Er, [
            n[1] || (n[1] = M("Deadline", -1)),
            f(d(ee), {
              "model-value": b.at_field !== void 0 ? "at_field" : "after",
              "onUpdate:modelValue": (y) => v(b, y),
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
          b.after !== void 0 ? (m(), B(wt, {
            key: 0,
            modelValue: b.after,
            "onUpdate:modelValue": (y) => b.after = y,
            label: "After"
          }, null, 8, ["modelValue", "onUpdate:modelValue"])) : (m(), h("label", Tr, [
            n[2] || (n[2] = M("At field", -1)),
            f(d(ee), {
              modelValue: b.at_field,
              "onUpdate:modelValue": (y) => b.at_field = y,
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
          u("label", Ur, [
            n[3] || (n[3] = M("Duration by field", -1)),
            f(d(ee), {
              "model-value": b.by ?? "",
              "onUpdate:modelValue": (y) => c(b, "by", y),
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
        b.by ? (m(), B(ot, {
          key: 0,
          label: "Duration table",
          hint: "Map field values to ISO durations.",
          "model-value": b.table,
          shape: "object",
          "onUpdate:modelValue": (y) => b.table = y,
          onValidity: (y) => l("validity", "table-" + w, y)
        }, null, 8, ["model-value", "onUpdate:modelValue", "onValidity"])) : I("", !0),
        u("div", Dr, [
          f(wt, {
            modelValue: b.repeat,
            "onUpdate:modelValue": (y) => b.repeat = y,
            label: "Repeat every",
            disabled: b.interrupting
          }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"]),
          u("label", Ir, [
            f(d(Ot), {
              modelValue: b.interrupting,
              "onUpdate:modelValue": [(y) => b.interrupting = y, (y) => b.interrupting && delete b.repeat],
              binary: ""
            }, null, 8, ["modelValue", "onUpdate:modelValue"]),
            n[4] || (n[4] = M("Interrupting", -1))
          ]),
          u("label", Ar, [
            n[5] || (n[5] = M("Then", -1)),
            f(d(ee), {
              "model-value": b.then?.transition !== void 0 ? "transition" : "emit",
              "onUpdate:modelValue": (y) => r(b, y),
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
          b.then ? (m(), h("label", Pr, [
            M(U(b.then.transition !== void 0 ? "Transition ID" : "Event name"), 1),
            b.then.transition !== void 0 ? (m(), B(d(se), {
              key: 0,
              modelValue: b.then.transition,
              "onUpdate:modelValue": (y) => b.then.transition = y
            }, null, 8, ["modelValue", "onUpdate:modelValue"])) : (m(), B(d(se), {
              key: 1,
              modelValue: b.then.emit,
              "onUpdate:modelValue": (y) => b.then.emit = y
            }, null, 8, ["modelValue", "onUpdate:modelValue"]))
          ])) : I("", !0)
        ]),
        f(d(K), {
          severity: "secondary",
          onClick: (y) => o().splice(w, 1),
          "aria-label": "Remove timer",
          text: "",
          size: "small"
        }, {
          default: L(() => [
            f(d(Z), {
              icon: "tabler:trash",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        }, 8, ["onClick"])
      ]))), 128)),
      f(d(K), {
        label: "Add timer",
        severity: "secondary",
        onClick: s,
        outlined: ""
      }, {
        icon: L(() => [
          f(d(Z), {
            icon: "tabler:plus",
            "aria-hidden": "true"
          })
        ]),
        _: 1
      })
    ]));
  }
}), Rr = ["aria-label"], Nr = { class: "work-stack work-tight" }, Mr = {
  key: 0,
  class: "work-stack work-tight"
}, Lr = /* @__PURE__ */ ue({
  __name: "PrincipalSourceEditor",
  props: {
    modelValue: {},
    draft: {},
    boardId: {},
    label: {}
  },
  emits: ["update:modelValue", "validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = W(() => Array.isArray(t.modelValue) ? "principals" : "field" in t.modelValue ? "field" : "group"), s = W(() => Array.isArray(t.modelValue) ? t.modelValue : "group" in t.modelValue && t.modelValue.group ? [{ kind: "group", id: t.modelValue.group }] : []);
    function v(r) {
      l("update:modelValue", r === "field" ? { field: "" } : r === "group" ? { group: "" } : []);
    }
    function c(r) {
      l("update:modelValue", o.value === "group" ? { group: r.at(-1)?.id ?? "" } : r);
    }
    return kl(() => l("validity", Array.isArray(t.modelValue) ? t.modelValue.length > 0 : "field" in t.modelValue ? !!t.modelValue.field : !!t.modelValue.group)), $t(() => l("validity", !0)), (r, i) => (m(), h("section", {
      class: "work-stack work-tight",
      "aria-label": e.label
    }, [
      u("label", Nr, [
        M(U(e.label) + " source", 1),
        f(d(ee), {
          "model-value": o.value,
          "aria-label": e.label + " source",
          options: [{ label: "Group", value: "group" }, { label: "People and groups", value: "principals" }, { label: "Principal field", value: "field" }],
          optionLabel: "label",
          optionValue: "value",
          appendTo: "self",
          "onUpdate:modelValue": v
        }, null, 8, ["model-value", "aria-label"])
      ]),
      "field" in e.modelValue ? (m(), h("label", Mr, [
        i[1] || (i[1] = M("Principal field", -1)),
        f(d(ee), {
          "model-value": e.modelValue.field,
          "aria-label": e.label + " field",
          options: e.draft.fields?.filter((n) => n.type === "principal").map((n) => ({ label: n.title || n.code, value: n.code })) ?? [],
          optionLabel: "label",
          optionValue: "value",
          appendTo: "self",
          "onUpdate:modelValue": i[0] || (i[0] = (n) => l("update:modelValue", { field: n }))
        }, null, 8, ["model-value", "aria-label", "options"])
      ])) : (m(), B(Ha, {
        key: 1,
        "board-id": e.boardId,
        label: e.label,
        kinds: o.value === "group" ? "group" : "user,group,service",
        "model-value": s.value,
        "onUpdate:modelValue": c
      }, null, 8, ["board-id", "label", "kinds", "model-value"]))
    ], 8, Rr));
  }
}), zr = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, Br = {
  class: "work-stack work-tight",
  "aria-label": "Approval sources"
}, Fr = { class: "work-row" }, jr = {
  key: 0,
  class: "work-stack work-tight"
}, qr = ["kinds", "value"], Wr = {
  key: 2,
  class: "work-muted work-small",
  role: "status"
}, Gr = {
  key: 3,
  class: "work-chips"
}, Yr = { class: "work-row work-small" }, Hr = { class: "work-process-options" }, Kr = { class: "work-stack work-tight" }, Xr = {
  key: 4,
  class: "work-error work-small",
  role: "alert"
}, Jr = {
  key: 5,
  class: "work-muted work-small"
}, Zr = /* @__PURE__ */ ue({
  __name: "ApproversEditor",
  props: {
    approvals: {},
    boardId: {}
  },
  emits: ["validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, { principalLabel: o, rememberPrincipal: s, nameError: v } = wl(() => t.boardId ?? "", () => Array.isArray(t.approvals.from) ? t.approvals.from : "group" in t.approvals.from ? [{ kind: "group", id: t.approvals.from.group }] : []), c = z(!1), r = W(() => Array.isArray(t.approvals.from) ? "principals" : "field" in t.approvals.from ? "field" : "group"), i = W(() => Array.isArray(t.approvals.from) ? t.approvals.from.some((y) => y.kind === "group") || t.approvals.from.length >= t.approvals.min : "field" in t.approvals.from ? !!t.approvals.from.field : !!t.approvals.from.group);
    kl(() => l("validity", Number.isSafeInteger(t.approvals.min) && t.approvals.min > 0 && i.value)), $t(() => l("validity", !0)), ha(async () => {
      c.value = await Pt("wc-principal-picker");
    });
    function n(y) {
      t.approvals.from = y === "group" ? { group: "" } : y === "field" ? { field: "" } : [];
    }
    function b(y) {
      const k = y.detail, C = k?.principal_id ?? k?.id;
      if (r.value === "group") {
        t.approvals.from = { group: C ?? "" };
        return;
      }
      if (!C || !Array.isArray(t.approvals.from)) return;
      const R = { kind: k.type ?? k.kind ?? "user", id: C };
      k.label && s(R, k.label), t.approvals.from.some(($) => $.id === C && $.kind === R.kind) || t.approvals.from.push(R);
    }
    function w(y) {
      Array.isArray(t.approvals.from) && t.approvals.from.splice(y, 1);
    }
    return (y, k) => (m(), h(q, null, [
      d(v) ? (m(), h("p", zr, U(d(v)), 1)) : I("", !0),
      u("section", Br, [
        u("label", Fr, [
          k[4] || (k[4] = u("span", { class: "work-spacer" }, "Approvals needed", -1)),
          f(d(Ze), {
            modelValue: e.approvals.min,
            "onUpdate:modelValue": k[0] || (k[0] = (C) => e.approvals.min = C),
            min: 1,
            required: "",
            useGrouping: !1
          }, null, 8, ["modelValue"])
        ]),
        k[9] || (k[9] = u("span", { class: "work-field-label" }, "Approvers", -1)),
        "field" in e.approvals.from ? (m(), h("label", jr, [
          k[5] || (k[5] = M("Principal field", -1)),
          f(d(se), {
            modelValue: e.approvals.from.field,
            "onUpdate:modelValue": k[1] || (k[1] = (C) => e.approvals.from.field = C),
            "aria-label": "Principal field"
          }, null, 8, ["modelValue"])
        ])) : c.value ? (m(), h("wc-principal-picker", {
          key: r.value,
          kinds: r.value === "group" ? "group" : "user,group,service",
          value: JSON.stringify("group" in e.approvals.from ? { type: "group", principal_id: e.approvals.from.group } : {}),
          onConfigChanged: b
        }, null, 40, qr)) : (m(), h("p", Wr, "The principal picker is unavailable.")),
        Array.isArray(e.approvals.from) ? (m(), h("div", Gr, [
          (m(!0), h(q, null, _(e.approvals.from, (C, R) => (m(), B(d(Ae), {
            key: C.kind + ":" + C.id,
            class: "kx-tag-sm",
            severity: "secondary"
          }, {
            default: L(() => [
              M(U(d(o)(C)), 1),
              f(d(K), {
                "aria-label": "Remove approver " + (R + 1),
                text: "",
                severity: "secondary",
                size: "small",
                onClick: ($) => w(R)
              }, {
                default: L(() => [
                  f(d(Z), {
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
        u("label", Yr, [
          k[6] || (k[6] = u("span", { class: "work-spacer" }, "Author cannot approve their own item", -1)),
          f(d(Re), {
            modelValue: e.approvals.prevent_self,
            "onUpdate:modelValue": k[2] || (k[2] = (C) => e.approvals.prevent_self = C),
            "aria-label": "Author cannot approve their own item"
          }, null, 8, ["modelValue"])
        ]),
        u("details", Hr, [
          k[8] || (k[8] = u("summary", null, "Approval options", -1)),
          u("label", Kr, [
            k[7] || (k[7] = M("Approval source", -1)),
            f(d(ee), {
              "model-value": r.value,
              "onUpdate:modelValue": k[3] || (k[3] = (C) => n(C)),
              appendTo: "self",
              optionLabel: "label",
              optionValue: "value",
              options: [{ label: "Group members", value: "group" }, { label: "People and groups", value: "principals" }, { label: "Principal field", value: "field" }]
            }, null, 8, ["model-value"])
          ])
        ]),
        Array.isArray(e.approvals.from) && !i.value ? (m(), h("p", Xr, "Select at least " + U(e.approvals.min) + " distinct principals, or lower the minimum.", 1)) : "group" in e.approvals.from && !e.approvals.from.group ? (m(), h("p", Jr, "Choose the group that can approve this state.")) : I("", !0)
      ])
    ], 64));
  }
}), Qr = {
  class: "work-state-settings work-stack",
  "aria-label": "State settings"
}, _r = { class: "work-process-kind" }, ed = { class: "work-process-options" }, td = { class: "work-stack" }, ad = { class: "work-row" }, ld = { class: "work-stack work-tight" }, od = { class: "work-row" }, id = { class: "work-stack work-tight" }, nd = { class: "work-row" }, sd = { class: "work-row" }, rd = { class: "work-stack work-tight" }, dd = { class: "work-row" }, ud = { class: "work-stack work-tight" }, cd = { class: "work-stack work-tight" }, md = {
  key: 0,
  class: "work-row"
}, vd = {
  key: 1,
  class: "work-muted work-small"
}, fd = { class: "work-row" }, pd = { class: "work-row" }, bd = { class: "work-stack work-tight" }, hd = { class: "work-row" }, yd = /* @__PURE__ */ ue({
  __name: "StateSettings",
  props: {
    state: {},
    process: {},
    draft: {},
    advanced: { type: Boolean },
    boardId: {}
  },
  emits: ["validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = W(() => (t.process.transitions ?? []).filter((r) => r.from === "any" || r.from.includes(t.state.id))), s = [{ value: "human", icon: "user" }, { value: "gate", icon: "shield-check" }, { value: "automated", icon: "bolt" }, { value: "parallel", icon: "arrows-split" }];
    function v(r) {
      const i = t.state;
      i.kind = r, delete i.run, delete i.release_when, delete i.regions, delete i.join, delete i.due, (r === "automated" || r === "gate") && delete i.awaiting, r === "automated" && (i.run = { stage: "", retry: { max: 1, backoff: "PT1M" } }), r === "gate" && (i.release_when = { approvals: { min: 1, from: { group: "" }, prevent_self: !0 } }), r === "parallel" && (i.regions = [{ id: "region_1", initial: t.process.states.find((n) => n.id !== i.id)?.id ?? "" }], i.join = "all");
    }
    function c(r) {
      t.state.run && (r ? t.state.run.on_fail = r : delete t.state.run.on_fail);
    }
    return (r, i) => (m(), h("section", Qr, [
      i[47] || (i[47] = u("h4", { class: "work-process-group" }, "Who moves the item on", -1)),
      f(d(Ga), {
        class: "work-process-kinds",
        "model-value": e.state.kind ?? "human",
        options: s.map((n) => ({
          ...n,
          label: d(xl)(n.value),
          disabled: !e.advanced && n.value !== "human" && n.value !== e.state.kind
        })),
        optionLabel: "label",
        optionValue: "value",
        optionDisabled: "disabled",
        "allow-empty": !1,
        "aria-label": "Who moves the item on",
        "onUpdate:modelValue": v
      }, {
        option: L(({ option: n }) => [
          u("span", _r, [
            f(d(Z), {
              icon: "tabler:" + n.icon
            }, null, 8, ["icon"]),
            u("span", null, U(n.label), 1)
          ])
        ]),
        _: 1
      }, 8, ["model-value", "options"]),
      e.advanced ? (m(), h(q, { key: 0 }, [
        e.state.kind === "gate" && e.state.release_when ? (m(), h(q, { key: 0 }, [
          i[27] || (i[27] = u("h4", { class: "work-process-group" }, "Approval", -1)),
          e.state.release_when.approvals ? (m(), B(Zr, {
            key: 0,
            "board-id": e.boardId,
            approvals: e.state.release_when.approvals,
            onValidity: i[0] || (i[0] = (n) => l("validity", "approvers", n))
          }, null, 8, ["board-id", "approvals"])) : I("", !0),
          u("details", ed, [
            i[26] || (i[26] = u("summary", null, "Release options", -1)),
            u("div", td, [
              u("label", ad, [
                i[25] || (i[25] = u("span", { class: "work-spacer" }, "Require approvals", -1)),
                f(d(Re), {
                  "model-value": !!e.state.release_when.approvals,
                  "aria-label": "Require approvals",
                  "onUpdate:modelValue": i[1] || (i[1] = (n) => e.state.release_when.approvals = n ? { min: 1, from: { group: "" }, prevent_self: !0 } : void 0)
                }, null, 8, ["model-value"])
              ]),
              f(wt, {
                modelValue: e.state.release_when.wait,
                "onUpdate:modelValue": i[2] || (i[2] = (n) => e.state.release_when.wait = n),
                label: "Wait before release"
              }, null, 8, ["modelValue"]),
              f(Ya, {
                label: "Release when",
                draft: e.draft,
                "board-id": e.boardId,
                modelValue: e.state.release_when.when,
                "onUpdate:modelValue": i[3] || (i[3] = (n) => e.state.release_when.when = n),
                onValidity: i[4] || (i[4] = (n) => l("validity", "release", n))
              }, null, 8, ["draft", "board-id", "modelValue"])
            ])
          ])
        ], 64)) : I("", !0),
        e.state.kind === "automated" && e.state.run ? (m(), h(q, { key: 1 }, [
          i[34] || (i[34] = u("h4", { class: "work-process-group" }, "Automation", -1)),
          u("label", ld, [
            i[28] || (i[28] = M("What runs", -1)),
            f(d(se), {
              modelValue: e.state.run.stage,
              "onUpdate:modelValue": i[5] || (i[5] = (n) => e.state.run.stage = n),
              "aria-label": "Stage",
              required: ""
            }, null, 8, ["modelValue"])
          ]),
          f(wt, {
            modelValue: e.state.run.timeout,
            "onUpdate:modelValue": i[6] || (i[6] = (n) => e.state.run.timeout = n),
            label: "Attempt timeout"
          }, null, 8, ["modelValue"]),
          i[35] || (i[35] = u("small", { class: "work-muted" }, "Blank uses the board timeout, or one hour.", -1)),
          u("label", od, [
            i[29] || (i[29] = u("span", { class: "work-spacer" }, "Maximum visits", -1)),
            f(d(Ze), {
              "model-value": e.state.run.max_visits ?? null,
              "aria-label": "Maximum visits",
              min: 1,
              useGrouping: !1,
              placeholder: "Board default",
              "onUpdate:modelValue": i[7] || (i[7] = (n) => e.state.run.max_visits = n ?? void 0)
            }, null, 8, ["model-value"])
          ]),
          u("label", id, [
            i[30] || (i[30] = M("When visits are exhausted", -1)),
            f(d(ee), {
              "model-value": e.state.run.on_exhausted,
              "aria-label": "When visits are exhausted",
              appendTo: "self",
              optionLabel: "label",
              optionValue: "value",
              showClear: "",
              options: (e.process.transitions ?? []).filter((n) => !n.auto).map((n) => ({ label: d(qe)(n), value: n.id })),
              "onUpdate:modelValue": i[8] || (i[8] = (n) => e.state.run.on_exhausted = n || void 0)
            }, null, 8, ["model-value", "options"])
          ]),
          i[36] || (i[36] = u("small", { class: "work-muted" }, "Blank records a failed run and stops automation. A route must leave every incoming state or be global.", -1)),
          u("label", nd, [
            i[31] || (i[31] = u("span", { class: "work-spacer" }, "Retry if it fails", -1)),
            f(d(Re), {
              "model-value": !!e.state.run.retry,
              "aria-label": "Retry if it fails",
              "onUpdate:modelValue": i[9] || (i[9] = (n) => e.state.run.retry = n ? { max: 1, backoff: "PT1M" } : void 0)
            }, null, 8, ["model-value"])
          ]),
          e.state.run.retry ? (m(), h(q, { key: 0 }, [
            u("label", sd, [
              i[32] || (i[32] = u("span", { class: "work-spacer" }, "Maximum attempts", -1)),
              f(d(Ze), {
                modelValue: e.state.run.retry.max,
                "onUpdate:modelValue": i[10] || (i[10] = (n) => e.state.run.retry.max = n),
                min: 1,
                useGrouping: !1
              }, null, 8, ["modelValue"])
            ]),
            f(wt, {
              modelValue: e.state.run.retry.backoff,
              "onUpdate:modelValue": i[11] || (i[11] = (n) => e.state.run.retry.backoff = n),
              label: "Wait between attempts"
            }, null, 8, ["modelValue"])
          ], 64)) : I("", !0),
          (m(), h(q, null, _([{ key: "on_pass", label: "On success" }, { key: "on_cancel", label: "On cancellation" }], (n) => u("label", {
            key: n.key,
            class: "work-stack work-tight"
          }, [
            M(U(n.label), 1),
            f(d(ee), {
              "model-value": e.state.run[n.key],
              "aria-label": n.label,
              appendTo: "self",
              optionLabel: "label",
              optionValue: "value",
              showClear: "",
              options: o.value.map((b) => ({ label: d(qe)(b), value: b.id })),
              "onUpdate:modelValue": (b) => e.state.run[n.key] = b || void 0
            }, null, 8, ["model-value", "aria-label", "options", "onUpdate:modelValue"])
          ])), 64)),
          u("label", rd, [
            i[33] || (i[33] = M("If it fails, go to", -1)),
            f(d(ee), {
              "model-value": e.state.run.on_fail,
              "onUpdate:modelValue": c,
              appendTo: "self",
              optionLabel: "label",
              optionValue: "value",
              showClear: "",
              options: o.value.map((n) => ({
                label: d(qe)(n) + " → " + d(he)(e.process.states.find((b) => b.id === n.to)),
                value: n.id
              }))
            }, null, 8, ["model-value", "options"])
          ])
        ], 64)) : I("", !0),
        e.state.kind === "parallel" && e.state.regions ? (m(), h(q, { key: 2 }, [
          i[41] || (i[41] = u("h4", { class: "work-process-group" }, "Lanes", -1)),
          (m(!0), h(q, null, _(e.state.regions, (n, b) => (m(), h("div", {
            key: b,
            class: "work-process-value work-stack work-tight"
          }, [
            u("div", dd, [
              u("span", null, "Lane " + U(b + 1), 1),
              i[37] || (i[37] = u("span", { class: "work-spacer" }, null, -1)),
              f(d(K), {
                severity: "danger",
                text: "",
                size: "small",
                "aria-label": "Remove lane",
                onClick: (w) => e.state.regions.splice(b, 1)
              }, {
                default: L(() => [
                  f(d(Z), { icon: "tabler:trash" })
                ]),
                _: 1
              }, 8, ["onClick"])
            ]),
            u("label", ud, [
              i[38] || (i[38] = M("Starts at", -1)),
              f(d(ee), {
                modelValue: n.initial,
                "onUpdate:modelValue": (w) => n.initial = w,
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                options: e.process.states.filter((w) => w.id !== e.state.id).map((w) => ({ label: d(he)(w), value: w.id }))
              }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
            ])
          ]))), 128)),
          f(d(K), {
            label: "Add lane",
            severity: "secondary",
            outlined: "",
            size: "small",
            onClick: i[12] || (i[12] = (n) => e.state.regions.push({
              id: d(gt)("region", e.state.regions),
              initial: e.process.states.find((b) => b.id !== e.state.id)?.id ?? ""
            }))
          }, {
            icon: L(() => [
              f(d(Z), { icon: "tabler:plus" })
            ]),
            _: 1
          }),
          u("label", cd, [
            i[39] || (i[39] = M("Finish rule", -1)),
            f(d(ee), {
              "model-value": typeof e.state.join == "number" ? "count" : e.state.join ?? "all",
              appendTo: "self",
              options: [
                { label: "All must pass", value: "all" },
                { label: "Any may pass", value: "any" },
                { label: "A number must pass", value: "count" }
              ],
              optionLabel: "label",
              optionValue: "value",
              "onUpdate:modelValue": i[13] || (i[13] = (n) => e.state.join = n === "count" ? 1 : n)
            }, null, 8, ["model-value"])
          ]),
          typeof e.state.join == "number" ? (m(), h("label", md, [
            i[40] || (i[40] = u("span", { class: "work-spacer" }, "Lanes needed", -1)),
            f(d(Ze), {
              modelValue: e.state.join,
              "onUpdate:modelValue": i[14] || (i[14] = (n) => e.state.join = n),
              min: 1,
              max: e.state.regions.length,
              useGrouping: !1
            }, null, 8, ["modelValue", "max"])
          ])) : I("", !0)
        ], 64)) : I("", !0)
      ], 64)) : e.state.kind && e.state.kind !== "human" ? (m(), h("p", vd, " Enable Advanced to edit this state's execution settings. ")) : I("", !0),
      i[48] || (i[48] = u("h4", { class: "work-process-group" }, "Limit", -1)),
      u("label", fd, [
        i[42] || (i[42] = u("span", { class: "work-spacer" }, "Items allowed here", -1)),
        f(ba, {
          draft: e.draft,
          state: e.state.id,
          label: "Items allowed here"
        }, null, 8, ["draft", "state"])
      ]),
      u("label", pd, [
        i[43] || (i[43] = u("span", { class: "work-spacer" }, [
          M("Refuse moves over the limit"),
          u("small", { class: "work-muted work-block" }, "Off only warns")
        ], -1)),
        f(ba, {
          draft: e.draft,
          state: e.state.id,
          label: "Refuse moves over the limit",
          hard: ""
        }, null, 8, ["draft", "state"])
      ]),
      i[49] || (i[49] = u("h4", { class: "work-process-group" }, "Before leaving", -1)),
      f(Nt, {
        label: "Required fields",
        options: e.draft.fields?.map((n) => ({ value: n.code, label: n.title || n.code })) ?? [],
        modelValue: e.state.require,
        "onUpdate:modelValue": i[15] || (i[15] = (n) => e.state.require = n)
      }, null, 8, ["options", "modelValue"]),
      !e.state.kind || e.state.kind === "human" ? (m(), B(wt, {
        key: 2,
        modelValue: e.state.due,
        "onUpdate:modelValue": i[16] || (i[16] = (n) => e.state.due = n),
        label: "Due after"
      }, null, 8, ["modelValue"])) : I("", !0),
      e.advanced ? (m(), h(q, { key: 3 }, [
        i[46] || (i[46] = u("h4", { class: "work-process-group" }, "Assignment and conditions", -1)),
        u("label", bd, [
          i[44] || (i[44] = M("Stage label", -1)),
          f(d(se), {
            "model-value": e.state.stage,
            "aria-label": "Stage label",
            "onUpdate:modelValue": i[17] || (i[17] = (n) => e.state.stage = n || void 0)
          }, null, 8, ["model-value"])
        ]),
        !e.state.kind || e.state.kind === "human" || e.state.kind === "parallel" ? (m(), h(q, { key: 0 }, [
          u("label", hd, [
            f(d(Re), {
              "model-value": !!e.state.awaiting,
              "aria-label": "Awaiting people",
              "onUpdate:modelValue": i[18] || (i[18] = (n) => e.state.awaiting = n ? { group: "" } : void 0)
            }, null, 8, ["model-value"]),
            i[45] || (i[45] = M("Awaiting people", -1))
          ]),
          e.state.awaiting ? (m(), B(Lr, {
            key: 0,
            modelValue: e.state.awaiting,
            "onUpdate:modelValue": i[19] || (i[19] = (n) => e.state.awaiting = n),
            draft: e.draft,
            "board-id": e.boardId,
            label: "Awaiting",
            onValidity: i[20] || (i[20] = (n) => l("validity", "awaiting", n))
          }, null, 8, ["modelValue", "draft", "board-id"])) : I("", !0)
        ], 64)) : I("", !0),
        f(Ha, {
          "board-id": e.boardId,
          modelValue: e.state.assign,
          "onUpdate:modelValue": i[21] || (i[21] = (n) => e.state.assign = n),
          label: "Assign to"
        }, null, 8, ["board-id", "modelValue"]),
        f(ot, {
          label: "State checks",
          example: ["installed-check"],
          "model-value": e.state.invariants,
          shape: "array",
          "onUpdate:modelValue": i[22] || (i[22] = (n) => e.state.invariants = n),
          onValidity: i[23] || (i[23] = (n) => l("validity", "invariants", n))
        }, null, 8, ["model-value"]),
        f(Or, {
          state: e.state,
          draft: e.draft,
          onValidity: i[24] || (i[24] = (n, b) => l("validity", "timer-" + n, b))
        }, null, 8, ["state", "draft"])
      ], 64)) : I("", !0)
    ]));
  }
}), gd = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, kd = {
  class: "work-process-controls",
  role: "toolbar",
  "aria-label": "Process tools"
}, wd = {
  key: 1,
  class: "work-process-title"
}, Vd = { class: "work-muted" }, $d = {
  key: 2,
  class: "work-map-zoom",
  role: "group",
  "aria-label": "Map zoom"
}, xd = ["aria-label"], Sd = { class: "work-row" }, Cd = { class: "work-process-meaning" }, Ed = { class: "work-stack work-tight" }, Td = { class: "work-process-inspector-foot" }, Ud = { class: "work-row" }, Dd = { class: "work-process-meaning" }, Id = { class: "work-stack work-tight" }, Ad = { class: "work-process-inspector-foot" }, Pd = {
  key: 3,
  class: "work-row"
}, Od = { class: "work-stack work-tight" }, Rd = { class: "work-dialog-actions" }, Nd = /* @__PURE__ */ ue({
  __name: "ProcessEditor",
  props: {
    draft: {},
    advanced: { type: Boolean },
    guardRemoval: { type: Function },
    issues: {},
    boardId: {}
  },
  emits: ["validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = W(() => t.draft.processes ?? []), s = z(!1), v = z(""), c = z(""), r = z(""), i = z("Map"), n = z(""), b = z(), w = z(), y = z(), k = z(), C = z(!1);
    async function R() {
      C.value = !0, await ao(), k.value?.querySelector('[aria-label="State name"]')?.focus();
    }
    const $ = W(() => o.value.find((S) => S.id === c.value) ?? o.value[0]);
    function D() {
      C.value = !1, b.value = void 0, w.value = void 0, r.value = "";
    }
    function E(S) {
      C.value = !1, b.value = S, w.value = void 0, n.value = "", r.value = "";
    }
    function T(S) {
      C.value = !1, w.value = S, b.value = void 0, r.value = "";
    }
    Ee($, D);
    function V(S) {
      S === "__new" ? s.value = !0 : c.value = S;
    }
    function P() {
      const S = v.value.trim();
      if (!S) return;
      const A = S.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "") || "process", N = (/^[a-z]/.test(A) ? A : "process_" + A).slice(0, 40), X = o.value.some((de) => de.id === N) ? gt(N, o.value) : N;
      (t.draft.processes ??= []).push({ id: X, name: S, initial: "todo", states: [{ id: "todo", name: "To do", category: "unstarted" }], transitions: [] }), c.value = X, v.value = "", s.value = !1;
    }
    async function G(S) {
      const A = { id: gt("state", S.states), name: "New state", category: "started" }, N = Ra(S), X = N.at(-1), de = b.value ?? (X?.category === "completed" ? N.at(-2) : X), fe = de && (S.transitions?.find((be) => be.default && be.from !== "any" && be.from.includes(de.id)) ?? S.transitions?.find((be) => be.from !== "any" && be.from.includes(de.id) && S.states.findIndex((xe) => xe.id === be.to) > S.states.indexOf(de)));
      if (S.states.splice(de ? S.states.indexOf(de) + 1 : S.states.length, 0, A), de && de.category !== "completed" && de.category !== "canceled")
        if (fe) {
          const be = fe.to;
          fe.to = A.id, (S.transitions ??= []).push({ id: gt("transition", S.transitions ?? []), name: "Continue", from: [A.id], to: be, ...fe.auto && fe.default ? { auto: !0, default: !0 } : {} });
        } else (S.transitions ??= []).push({ id: gt("transition", S.transitions ?? []), name: "Continue", from: [de.id], to: A.id });
      E(A), await R();
    }
    function ce(S, A) {
      const N = $.value;
      if (!N || !A || S === A) return;
      let X = `to_${A}`, de = 2;
      for (; N.transitions?.some((be) => be.id === X); ) X = `to_${A}_${de++}`;
      const fe = { id: X, name: `To ${he(N.states.find((be) => be.id === A)).toLowerCase()}`, from: [S], to: A };
      (N.transitions ??= []).push(fe), T(fe);
    }
    function re(S) {
      const A = { id: gt("transition", S.transitions ?? []), name: "To " + he(S.states.at(-1)), from: [S.initial], to: S.states.at(-1)?.id ?? S.initial };
      (S.transitions ??= []).push(A), T(A);
    }
    function J(S, A) {
      const N = co(S, A);
      if (N.length) {
        r.value = `Used by ${N.join(", ")}. Update those references first.`;
        return;
      }
      S.transitions?.splice(S.transitions.indexOf(A), 1), D();
    }
    function O(S, A) {
      const N = mo(S, A);
      if (N.length) {
        r.value = `${he(A)} is used by ${N.join(", ")}. Update these references first.`;
        return;
      }
      S.states.splice(S.states.indexOf(A), 1), D();
    }
    async function te(S) {
      const A = t.draft.item_types?.filter((X) => X.process === S.id).map((X) => X.title || "Untitled item type") ?? [];
      if (A.length) {
        r.value = `Used by ${A.join(", ")}. Choose a different process for those item types first.`;
        return;
      }
      const N = await t.guardRemoval?.("processes", S.id);
      if (N) {
        r.value = N;
        return;
      }
      Jt(t.draft, "processes", S.id), c.value = "", D();
    }
    return (S, A) => (m(), h("section", {
      class: "work-process-editor work-stack",
      "aria-label": "Process editor",
      onKeydown: Ie(D, ["esc"])
    }, [
      r.value ? (m(), h("p", gd, U(r.value), 1)) : I("", !0),
      (m(!0), h(q, null, _(e.issues?.filter((N) => N.code === "process " + $.value?.id) ?? [], (N) => (m(), h("p", {
        key: N.what + N.detail,
        class: "work-error work-small",
        role: "alert"
      }, U(d(ya)(N)) + " · " + U(N.what), 1))), 128)),
      $.value ? (m(), h("div", {
        key: 1,
        class: ct(["work-process-builder", { "work-process-inspecting": b.value || w.value }])
      }, [
        u("div", kd, [
          o.value.length > 1 ? (m(), B(d(ee), {
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
          }, null, 8, ["model-value", "options"])) : (m(), h("span", wd, U($.value.name || "Process"), 1)),
          f(d(K), {
            label: "Add state",
            severity: "secondary",
            outlined: "",
            size: "small",
            onClick: A[0] || (A[0] = (N) => G($.value))
          }, {
            icon: L(() => [
              f(d(Z), { icon: "tabler:plus" })
            ]),
            _: 1
          }),
          f(d(ee), {
            modelValue: $.value.initial,
            "onUpdate:modelValue": A[1] || (A[1] = (N) => $.value.initial = N),
            "aria-label": "Starts in " + d(he)($.value.states.find((N) => N.id === $.value.initial)),
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            options: $.value.states.map((N) => ({ label: d(he)(N), value: N.id }))
          }, {
            value: L(() => [
              u("span", Vd, "Starts in " + U(d(he)($.value.states.find((N) => N.id === $.value.initial))), 1)
            ]),
            _: 1
          }, 8, ["modelValue", "aria-label", "options"]),
          A[17] || (A[17] = u("span", { class: "work-spacer" }, null, -1)),
          i.value === "Map" ? (m(), h("div", $d, [
            f(d(K), {
              label: "Fit",
              title: "Fit to width and show the full process",
              text: "",
              severity: "secondary",
              size: "small",
              onClick: A[2] || (A[2] = (N) => y.value?.fit())
            }, {
              icon: L(() => [
                f(d(Z), { icon: "tabler:arrows-maximize" })
              ]),
              _: 1
            }),
            i.value === "Map" ? (m(), B(d(K), {
              key: 0,
              "aria-label": "Zoom out",
              title: "Zoom out",
              text: "",
              severity: "secondary",
              size: "small",
              onClick: A[3] || (A[3] = (N) => y.value?.zoomOut())
            }, {
              default: L(() => [
                f(d(Z), { icon: "tabler:minus" })
              ]),
              _: 1
            })) : I("", !0),
            i.value === "Map" ? (m(), B(d(K), {
              key: 1,
              "aria-label": "Zoom in",
              title: "Zoom in",
              text: "",
              severity: "secondary",
              size: "small",
              onClick: A[4] || (A[4] = (N) => y.value?.zoomIn())
            }, {
              default: L(() => [
                f(d(Z), { icon: "tabler:plus" })
              ]),
              _: 1
            })) : I("", !0)
          ])) : I("", !0),
          f(d(Ga), {
            modelValue: i.value,
            "onUpdate:modelValue": A[5] || (A[5] = (N) => i.value = N),
            options: ["Map", "List"],
            "allow-empty": !1,
            "aria-label": "Process layout"
          }, null, 8, ["modelValue"]),
          o.value.length === 1 ? (m(), B(d(K), {
            key: 3,
            label: "New process",
            "aria-label": "New process",
            text: "",
            severity: "secondary",
            size: "small",
            onClick: A[6] || (A[6] = (N) => s.value = !0)
          }, {
            icon: L(() => [
              f(d(Z), { icon: "tabler:plus" })
            ]),
            _: 1
          })) : I("", !0)
        ]),
        i.value === "Map" ? (m(), B(Qs, {
          key: 0,
          ref_key: "graph",
          ref: y,
          process: $.value,
          draft: e.draft,
          "selected-state": b.value,
          "selected-transition": w.value,
          onState: E,
          onTransition: T,
          onConnect: ce,
          onClear: D
        }, null, 8, ["process", "draft", "selected-state", "selected-transition"])) : (m(), B(dr, {
          key: 1,
          process: $.value,
          "selected-state": b.value,
          "selected-transition": w.value,
          onState: E,
          onTransition: T,
          onRemoveState: A[7] || (A[7] = (N) => O($.value, N)),
          onRemoveTransition: A[8] || (A[8] = (N) => J($.value, N)),
          onAddTransition: A[9] || (A[9] = (N) => re($.value))
        }, null, 8, ["process", "selected-state", "selected-transition"])),
        b.value || w.value ? (m(), h("aside", {
          key: 2,
          ref_key: "inspector",
          ref: k,
          class: "work-process-sideform",
          "aria-label": b.value ? "State inspector" : "Transition inspector"
        }, [
          (m(!0), h(q, null, _(b.value ? [b.value] : [], (N) => (m(), h(q, {
            key: N.id
          }, [
            u("header", Sd, [
              C.value ? (m(), B(d(se), {
                key: 1,
                modelValue: N.name,
                "onUpdate:modelValue": (X) => N.name = X,
                class: "work-process-name",
                "aria-label": "State name",
                onBlur: A[10] || (A[10] = (X) => C.value = !1)
              }, null, 8, ["modelValue", "onUpdate:modelValue"])) : (m(), B(qa, {
                key: 0,
                class: "work-process-state-title",
                "aria-label": "Rename state",
                onActivate: R
              }, {
                default: L(() => [
                  u("span", null, U(d(he)(N)), 1)
                ]),
                _: 2
              }, 1024)),
              f(d(K), {
                severity: "secondary",
                text: "",
                size: "small",
                "aria-label": "Close state editor",
                onClick: D
              }, {
                default: L(() => [
                  f(d(Z), { icon: "tabler:x" })
                ]),
                _: 1
              })
            ]),
            u("p", Cd, U(d(ro)(N, e.draft)), 1),
            f(yd, {
              state: N,
              process: $.value,
              draft: e.draft,
              advanced: e.advanced,
              "board-id": e.boardId,
              onValidity: (X, de) => l("validity", $.value.id + ":" + N.id + ":" + X, de)
            }, null, 8, ["state", "process", "draft", "advanced", "board-id", "onValidity"]),
            u("label", Ed, [
              A[18] || (A[18] = M("Phase", -1)),
              f(d(ee), {
                modelValue: N.category,
                "onUpdate:modelValue": (X) => N.category = X,
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                options: ["triage", "backlog", ...d(Vl)].map((X) => ({ label: d(Wa)(X), value: X }))
              }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
            ]),
            A[19] || (A[19] = u("h4", { class: "work-process-group" }, "Next stop", -1)),
            f(d(ee), {
              modelValue: n.value,
              "onUpdate:modelValue": A[11] || (A[11] = (X) => n.value = X),
              "aria-label": "Add transition to…",
              placeholder: "Add transition to…",
              appendTo: "self",
              optionLabel: "label",
              optionValue: "value",
              options: $.value.states.filter((X) => X !== N).map((X) => ({ label: d(he)(X), value: X.id }))
            }, null, 8, ["modelValue", "options"]),
            f(d(K), {
              label: "Add transition",
              severity: "secondary",
              outlined: "",
              size: "small",
              disabled: !n.value,
              onClick: (X) => ce(N.id, n.value)
            }, {
              icon: L(() => [
                f(d(Z), { icon: "tabler:arrow-right" })
              ]),
              _: 1
            }, 8, ["disabled", "onClick"]),
            u("footer", Td, [
              f(d(K), {
                label: "Remove state",
                severity: "danger",
                text: "",
                size: "small",
                onClick: (X) => O($.value, N)
              }, {
                icon: L(() => [
                  f(d(Z), { icon: "tabler:trash" })
                ]),
                _: 1
              }, 8, ["onClick"])
            ])
          ], 64))), 128)),
          (m(!0), h(q, null, _(w.value ? [w.value] : [], (N) => (m(), h(q, {
            key: N.id
          }, [
            u("header", Ud, [
              A[20] || (A[20] = u("h3", null, "Transition", -1)),
              A[21] || (A[21] = u("span", { class: "work-spacer" }, null, -1)),
              f(d(K), {
                severity: "secondary",
                text: "",
                size: "small",
                "aria-label": "Close transition editor",
                onClick: D
              }, {
                default: L(() => [
                  f(d(Z), { icon: "tabler:x" })
                ]),
                _: 1
              })
            ]),
            u("p", Dd, U(N.from === "any" ? "Any state" : N.from.map((X) => d(he)($.value.states.find((de) => de.id === X))).join(", ")) + " → " + U(d(he)($.value.states.find((X) => X.id === N.to))), 1),
            u("label", Id, [
              A[22] || (A[22] = M("Name", -1)),
              f(d(se), {
                modelValue: N.name,
                "onUpdate:modelValue": (X) => N.name = X,
                placeholder: d(qe)(N),
                "aria-label": "Transition name"
              }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder"])
            ]),
            f(gr, {
              transition: N,
              process: $.value,
              draft: e.draft,
              advanced: e.advanced,
              "board-id": e.boardId,
              onValidity: (X, de) => l("validity", $.value.id + ":transition-" + N.id + ":" + X, de)
            }, null, 8, ["transition", "process", "draft", "advanced", "board-id", "onValidity"]),
            u("footer", Ad, [
              f(d(K), {
                label: "Remove transition",
                severity: "danger",
                text: "",
                size: "small",
                onClick: (X) => J($.value, N)
              }, {
                icon: L(() => [
                  f(d(Z), { icon: "tabler:trash" })
                ]),
                _: 1
              }, 8, ["onClick"])
            ])
          ], 64))), 128))
        ], 8, xd)) : I("", !0)
      ], 2)) : (m(), B(d(K), {
        key: 2,
        label: "New process",
        severity: "secondary",
        outlined: "",
        onClick: A[12] || (A[12] = (N) => s.value = !0)
      }, {
        icon: L(() => [
          f(d(Z), { icon: "tabler:plus" })
        ]),
        _: 1
      })),
      i.value === "List" && $.value ? (m(), h("div", Pd, [
        f(d(K), {
          label: "Remove process",
          severity: "danger",
          text: "",
          size: "small",
          onClick: A[13] || (A[13] = (N) => te($.value))
        }, {
          icon: L(() => [
            f(d(Z), { icon: "tabler:trash" })
          ]),
          _: 1
        })
      ])) : I("", !0),
      f(uo, {
        visible: s.value,
        label: "New process",
        onClose: A[16] || (A[16] = (N) => s.value = !1)
      }, {
        default: L(() => [
          u("form", {
            class: "work-dialog-box",
            "aria-label": "New process",
            onSubmit: ye(P, ["stop", "prevent"])
          }, [
            A[24] || (A[24] = u("h2", null, "New process", -1)),
            u("label", Od, [
              A[23] || (A[23] = M("Name", -1)),
              f(d(se), {
                modelValue: v.value,
                "onUpdate:modelValue": A[14] || (A[14] = (N) => v.value = N),
                "aria-label": "New process name",
                autofocus: "",
                required: ""
              }, null, 8, ["modelValue"])
            ]),
            u("div", Rd, [
              f(d(K), {
                label: "Cancel",
                severity: "secondary",
                outlined: "",
                onClick: A[15] || (A[15] = (N) => s.value = !1)
              }),
              f(d(K), {
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
}), Md = ["inert"], Ld = { class: "work-stack work-tight" }, zd = /* @__PURE__ */ ue({
  __name: "ProcessMigration",
  props: {
    draft: {},
    original: {},
    disabled: { type: Boolean }
  },
  setup(e) {
    const a = e;
    function t(o, s, v) {
      v ? (o.map ??= {})[s] = v : o.map && delete o.map[s];
    }
    function l(o) {
      return a.original.processes?.find((s) => s.id === o.id)?.states.filter((s) => !o.states.some((v) => v.id === s.id)) ?? [];
    }
    return (o, s) => (m(), h("section", {
      class: "work-stack work-settings-card",
      "aria-label": "Existing items",
      inert: e.disabled || void 0
    }, [
      s[0] || (s[0] = u("h3", null, "Existing items", -1)),
      s[1] || (s[1] = u("p", { class: "work-muted work-small" }, " Choose how existing items follow these changes, then review the impact before applying. ", -1)),
      (m(!0), h(q, null, _(e.draft.processes ?? [], (v) => (m(), h("div", {
        key: v.id,
        class: "work-stack"
      }, [
        u("label", Ld, [
          M(U(v.name || "Untitled process"), 1),
          f(d(ee), {
            disabled: e.disabled,
            "model-value": d(tl)(v),
            "aria-label": "Existing items in " + (v.name || "this process"),
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            options: [
              { label: "Follow new process", value: "follow" },
              { label: "Keep current process", value: "pin" }
            ],
            "onUpdate:modelValue": (c) => v.migration = c
          }, null, 8, ["disabled", "model-value", "aria-label", "onUpdate:modelValue"])
        ]),
        d(tl)(v) !== "pin" ? (m(!0), h(q, { key: 0 }, _(l(v), (c) => (m(), h("label", {
          key: c.id,
          class: "work-stack work-tight"
        }, [
          M("Move items from " + U(d(he)(c)) + " to", 1),
          f(d(ee), {
            disabled: e.disabled,
            "model-value": v.map?.[c.id],
            placeholder: "Choose a surviving state",
            appendTo: "self",
            showClear: "",
            optionLabel: "label",
            optionValue: "value",
            options: v.states.map((r) => ({ label: d(he)(r), value: r.id })),
            "onUpdate:modelValue": (r) => t(v, c.id, r)
          }, null, 8, ["disabled", "model-value", "options", "onUpdate:modelValue"])
        ]))), 128)) : I("", !0)
      ]))), 128))
    ], 8, Md));
  }
});
function Wl(e) {
  return Object.entries(He(e.properties)).map(([a, t]) => {
    const l = He(t);
    return { key: a, title: typeof l.title == "string" && l.title.trim() ? l.title : ge(a), description: typeof l.description == "string" ? l.description : "", schema: l };
  });
}
const Gl = (e) => e.type === "array" && He(e.items).type === "string";
function Bd(e, a) {
  const t = {};
  for (const l of Wl(e)) {
    const o = a[l.key] ?? l.schema.default, s = l.schema;
    let v = "";
    if (o == null)
      Array.isArray(e.required) && e.required.includes(l.key) && (v = "A value is required.");
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
      else if (Gl(s)) {
        const c = He(s.items);
        o.some((r) => typeof r != "string" || typeof c.minLength == "number" && r.length < c.minLength || typeof c.maxLength == "number" && r.length > c.maxLength) && (v = "Each entry must match the declared text length.");
      }
    } else s.type === "object" && (typeof o != "object" || Array.isArray(o)) && (v = "Enter an object.");
    v && (t[l.key] = v);
  }
  return t;
}
const Fd = { class: "work-stack" }, jd = ["schema", "config"], qd = {
  key: 1,
  role: "status",
  class: "work-muted work-small"
}, Wd = {
  key: 2,
  role: "alert",
  class: "kx-err"
}, Gd = { class: "work-config-fields" }, Yd = ["for"], Hd = {
  key: 1,
  class: "work-config-chips"
}, Kd = {
  key: 6,
  class: "work-muted work-small"
}, Xd = {
  key: 7,
  role: "alert",
  class: "work-error work-small"
}, Yl = /* @__PURE__ */ ue({
  __name: "ConfigForm",
  props: {
    schema: {},
    modelValue: {},
    disabled: { type: Boolean }
  },
  emits: ["update:modelValue", "validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = z({}), s = z(/* @__PURE__ */ new Set()), v = z(!1), c = z(!1), r = W(() => Wl(t.schema)), i = W(() => Bd(t.schema, t.modelValue)), n = W(() => r.value.filter((T) => typeof T.schema.picker == "string")), b = W(() => r.value.filter((T) => typeof T.schema.picker != "string")), w = W(() => ({ ...t.schema, properties: Object.fromEntries(n.value.map((T) => [T.key, { ...T.schema, title: T.title }])), required: Array.isArray(t.schema.required) ? t.schema.required.filter((T) => n.value.some((V) => V.key === T)) : [] })), y = W(() => Object.fromEntries(n.value.map((T) => [T.key, t.modelValue[T.key]])));
    Ee([i, s, () => n.value.length > 0 && !v.value], () => l("validity", !Object.keys(i.value).length && !s.value.size && (!n.value.length || v.value)), { immediate: !0, deep: !0 });
    async function k() {
      c.value = !0, v.value = await Pt("wc-schema-form"), c.value = !1;
    }
    Ee(() => n.value.length > 0, (T) => {
      T && k();
    }, { immediate: !0 }), $t(() => l("validity", !0));
    function C(T, V) {
      const P = { ...t.modelValue };
      V == null ? delete P[T] : P[T] = V, l("update:modelValue", P);
    }
    function R(T) {
      const V = t.modelValue[T];
      return Array.isArray(V) ? V.filter((P) => typeof P == "string") : [];
    }
    function $(T) {
      const V = o.value[T]?.trim();
      V && (C(T, [...R(T), V]), o.value[T] = "");
    }
    function D(T, V) {
      V ? s.value.delete(T) : s.value.add(T);
    }
    function E(T) {
      l("update:modelValue", { ...t.modelValue, ...He(T.detail) });
    }
    return (T, V) => (m(), h("div", Fd, [
      n.value.length && v.value ? (m(), h("wc-schema-form", {
        key: 0,
        class: "work-config-widget",
        schema: JSON.stringify(w.value),
        config: JSON.stringify(y.value),
        onConfigChanged: E
      }, null, 40, jd)) : n.value.length && c.value ? (m(), h("p", qd, "The configuration widget is loading.")) : n.value.length ? (m(), h("p", Wd, [
        V[0] || (V[0] = M("The configuration widget is unavailable.", -1)),
        f(d(K), {
          label: "Reload configuration widget",
          severity: "secondary",
          outlined: "",
          onClick: k
        })
      ])) : I("", !0),
      u("div", Gd, [
        (m(!0), h(q, null, _(b.value, (P) => (m(), h("div", {
          key: P.key,
          class: "work-config-field"
        }, [
          u("label", {
            class: "work-config-label",
            for: "config-" + P.key
          }, U(P.title), 9, Yd),
          Array.isArray(P.schema.enum) ? (m(), B(d(ee), {
            key: 0,
            "input-id": "config-" + P.key,
            "model-value": e.modelValue[P.key] ?? P.schema.default,
            options: P.schema.enum,
            appendTo: "self",
            "aria-label": P.title,
            disabled: e.disabled,
            "onUpdate:modelValue": (G) => C(P.key, G)
          }, null, 8, ["input-id", "model-value", "options", "aria-label", "disabled", "onUpdate:modelValue"])) : d(Gl)(P.schema) ? (m(), h("div", Hd, [
            (m(!0), h(q, null, _(R(P.key), (G, ce) => (m(), B(d(Vo), {
              key: ce,
              label: G,
              removable: !e.disabled,
              onRemove: (re) => C(P.key, R(P.key).filter((J, O) => O !== ce))
            }, null, 8, ["label", "removable", "onRemove"]))), 128)),
            f(d(se), {
              id: "config-" + P.key,
              modelValue: o.value[P.key],
              "onUpdate:modelValue": (G) => o.value[P.key] = G,
              "aria-label": "Add " + P.title.toLocaleLowerCase(),
              disabled: e.disabled,
              placeholder: "Type and press Enter",
              onKeydown: Ie(ye((G) => $(P.key), ["stop", "prevent"]), ["enter"]),
              onBlur: (G) => $(P.key)
            }, null, 8, ["id", "modelValue", "onUpdate:modelValue", "aria-label", "disabled", "onKeydown", "onBlur"])
          ])) : ["integer", "number"].includes(String(P.schema.type)) ? (m(), B(d(Ze), {
            key: 2,
            "input-id": "config-" + P.key,
            "model-value": e.modelValue[P.key] ?? P.schema.default,
            "max-fraction-digits": P.schema.type === "integer" ? 0 : 8,
            "use-grouping": !1,
            "aria-label": P.title,
            disabled: e.disabled,
            invalid: !!i.value[P.key],
            "onUpdate:modelValue": (G) => C(P.key, G)
          }, null, 8, ["input-id", "model-value", "max-fraction-digits", "aria-label", "disabled", "invalid", "onUpdate:modelValue"])) : P.schema.type === "boolean" ? (m(), B(d(Re), {
            key: 3,
            "input-id": "config-" + P.key,
            "model-value": !!(e.modelValue[P.key] ?? P.schema.default),
            "aria-label": P.title,
            disabled: e.disabled,
            "onUpdate:modelValue": (G) => C(P.key, G)
          }, null, 8, ["input-id", "model-value", "aria-label", "disabled", "onUpdate:modelValue"])) : ["array", "object"].includes(String(P.schema.type)) ? (m(), B(ot, {
            key: 4,
            label: P.title,
            "model-value": e.modelValue[P.key],
            shape: P.schema.type === "array" ? "array" : "object",
            example: P.schema.default ?? (P.schema.type === "array" ? [] : {}),
            "onUpdate:modelValue": (G) => C(P.key, G),
            onValidity: (G) => D(P.key, G)
          }, null, 8, ["label", "model-value", "shape", "example", "onUpdate:modelValue", "onValidity"])) : (m(), B(d(se), {
            key: 5,
            id: "config-" + P.key,
            "model-value": e.modelValue[P.key] ?? P.schema.default ?? "",
            disabled: e.disabled,
            invalid: !!i.value[P.key],
            "aria-label": P.title,
            "onUpdate:modelValue": (G) => C(P.key, G)
          }, null, 8, ["id", "model-value", "disabled", "invalid", "aria-label", "onUpdate:modelValue"])),
          P.description ? (m(), h("p", Kd, U(P.description), 1)) : I("", !0),
          i.value[P.key] ? (m(), h("p", Xd, U(i.value[P.key]), 1)) : I("", !0)
        ]))), 128))
      ])
    ]));
  }
}), Jd = {
  class: "work-stack",
  "aria-label": "Policy editor"
}, Zd = { class: "work-settings-list" }, Qd = { class: "work-settings-row" }, _d = { class: "work-row-control" }, eu = { class: "work-settings-list work-wip-container" }, tu = { class: "work-wip-table" }, au = { class: "work-mono" }, lu = { class: "work-row-main" }, ou = { class: "work-row" }, iu = { class: "work-settings-list" }, nu = { class: "work-settings-row" }, su = { class: "work-row-control" }, ru = { class: "work-row-main" }, du = { class: "work-row-title" }, uu = { class: "work-row-control" }, cu = /* @__PURE__ */ ue({
  __name: "PolicyEditor",
  props: {
    draft: {}
  },
  setup(e) {
    const a = e, t = W(() => a.draft.policy ?? {}), l = W(() => [...new Set(a.draft.processes?.flatMap((c) => c.states.map((r) => r.id)) ?? [])]), o = ["audit_days", "trash_days", "tombstone_days", "interval_days"];
    function s(c, r) {
      r === void 0 ? a.draft.policy && delete a.draft.policy[c] : (a.draft.policy ??= {})[c] = r;
    }
    function v(c, r) {
      s(c, r ?? void 0);
    }
    return (c, r) => (m(), h("section", Jd, [
      r[11] || (r[11] = u("header", { class: "work-section-heading" }, [
        u("div", null, [
          u("h2", null, "Policy"),
          u("p", { class: "work-muted work-small" }, "Set capacity and how long the board keeps its history.")
        ])
      ], -1)),
      r[12] || (r[12] = u("h3", { class: "work-group-title" }, "Item keys", -1)),
      u("div", Zd, [
        u("div", Qd, [
          r[5] || (r[5] = u("div", { class: "work-row-main" }, [
            u("strong", { class: "work-row-title" }, "Item key prefix"),
            u("p", { class: "work-muted work-small" }, "Work reviews and claims prefix changes when you apply the schema.")
          ], -1)),
          u("div", _d, [
            f(d(se), {
              modelValue: e.draft.key_prefix,
              "onUpdate:modelValue": r[0] || (r[0] = (i) => e.draft.key_prefix = i),
              "aria-label": "Item key prefix",
              required: "",
              pattern: "[A-Z][A-Z0-9]{1,9}",
              maxlength: "10"
            }, null, 8, ["modelValue"])
          ])
        ])
      ]),
      r[13] || (r[13] = u("h3", { class: "work-group-title" }, "Work in progress", -1)),
      r[14] || (r[14] = u("p", { class: "work-muted work-small" }, "A blank limit sets no restriction. A hard limit rejects transitions over capacity.", -1)),
      u("div", eu, [
        u("table", tu, [
          r[6] || (r[6] = u("thead", null, [
            u("tr", null, [
              u("th", null, "State"),
              u("th", null, "Limit"),
              u("th", null, "Hard limit")
            ])
          ], -1)),
          u("tbody", null, [
            (m(!0), h(q, null, _(l.value, (i) => (m(), h("tr", { key: i }, [
              u("td", null, [
                u("strong", null, U(e.draft.processes?.flatMap((n) => n.states).find((n) => n.id === i)?.name || d(ge)(i)), 1),
                u("code", au, U(i), 1)
              ]),
              u("td", null, [
                f(ba, {
                  draft: e.draft,
                  state: i,
                  label: i + " WIP limit"
                }, null, 8, ["draft", "state", "label"])
              ]),
              u("td", null, [
                f(ba, {
                  draft: e.draft,
                  state: i,
                  label: i + " hard WIP limit",
                  hard: ""
                }, null, 8, ["draft", "state", "label"])
              ])
            ]))), 128))
          ])
        ]),
        (m(!0), h(q, null, _(Object.keys(t.value.wip ?? {}).filter((i) => !l.value.includes(i)), (i) => (m(), h("div", {
          key: i,
          class: "work-settings-row"
        }, [
          u("div", lu, [
            M(U(d(ge)(i)) + " ", 1),
            r[7] || (r[7] = u("span", { class: "work-muted" }, "Removed state", -1))
          ]),
          f(d(K), {
            label: "Remove stale limit",
            severity: "secondary",
            outlined: "",
            onClick: (n) => delete t.value.wip[i]
          }, {
            icon: L(() => [
              f(d(Z), { icon: "tabler:trash" })
            ]),
            _: 1
          }, 8, ["onClick"])
        ]))), 128))
      ]),
      r[15] || (r[15] = u("h3", { class: "work-group-title" }, "Automated stages", -1)),
      f(wt, {
        "model-value": t.value.stage_timeout,
        "onUpdate:modelValue": r[1] || (r[1] = (i) => s("stage_timeout", i)),
        label: "Default attempt timeout"
      }, null, 8, ["model-value"]),
      r[16] || (r[16] = u("p", { class: "work-muted work-small" }, "Blank uses one hour. Each retry gets a new deadline.", -1)),
      u("label", ou, [
        r[8] || (r[8] = u("span", { class: "work-spacer" }, "Default maximum visits", -1)),
        f(d(Ze), {
          "model-value": t.value.stage_max_visits ?? null,
          "aria-label": "Default maximum visits",
          min: 1,
          useGrouping: !1,
          placeholder: "5",
          "onUpdate:modelValue": r[2] || (r[2] = (i) => s("stage_max_visits", i ?? void 0))
        }, null, 8, ["model-value"])
      ]),
      r[17] || (r[17] = u("h3", { class: "work-group-title" }, "Query scopes", -1)),
      r[18] || (r[18] = u("p", { class: "work-muted work-small" }, "Declare the installed scope identifiers available to board queries.", -1)),
      f(Yl, {
        schema: { type: "object", properties: { scopes: { type: "array", title: "Scope identifiers", items: { type: "string" } } } },
        "model-value": { scopes: e.draft.scopes },
        "onUpdate:modelValue": r[3] || (r[3] = (i) => e.draft.scopes = i.scopes)
      }, null, 8, ["model-value"]),
      r[19] || (r[19] = u("h3", { class: "work-group-title" }, "Audit and retention", -1)),
      u("div", iu, [
        u("div", nu, [
          r[9] || (r[9] = u("div", { class: "work-row-main" }, [
            u("strong", { class: "work-row-title" }, "Audit trail"),
            u("p", { class: "work-muted work-small" }, "Choose which item changes appear in history.")
          ], -1)),
          u("div", su, [
            f(d(ee), {
              "model-value": t.value.audit ?? "",
              "aria-label": "Audit trail",
              placeholder: "Installation default",
              appendTo: "self",
              optionLabel: "label",
              optionValue: "value",
              options: [{ label: "Installation default", value: "" }, { label: "Off", value: "off" }, { label: "Fields", value: "fields" }],
              "onUpdate:modelValue": r[4] || (r[4] = (i) => s("audit", i || void 0))
            }, null, 8, ["model-value"])
          ])
        ]),
        (m(), h(q, null, _(o, (i) => u("div", {
          key: i,
          class: "work-settings-row"
        }, [
          u("div", ru, [
            u("strong", du, U(d(ge)(i)), 1),
            r[10] || (r[10] = u("p", { class: "work-muted work-small" }, "Blank follows the installation default. Zero keeps records indefinitely.", -1))
          ]),
          u("label", uu, [
            f(d(Ze), {
              min: 0,
              "aria-label": d(ge)(i),
              "model-value": t.value[i] ?? null,
              placeholder: "Installation default",
              useGrouping: !1,
              "onUpdate:modelValue": (n) => v(i, n)
            }, null, 8, ["aria-label", "model-value", "onUpdate:modelValue"])
          ])
        ])), 64))
      ])
    ]));
  }
}), mu = {
  class: "work-stack",
  "aria-label": "Relation types editor"
}, vu = { class: "work-section-heading" }, fu = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, pu = { class: "work-definition-meta work-muted work-small" }, bu = { class: "work-settings-grid" }, hu = { class: "work-stack work-tight" }, yu = { class: "work-stack work-tight" }, gu = { class: "work-stack work-tight" }, ku = { class: "work-stack work-tight" }, wu = { class: "work-row" }, Vu = { class: "work-relation-preview work-small" }, $u = { class: "work-muted" }, xu = {
  key: 0,
  class: "kx-empty"
}, Su = { class: "work-row work-add-definition" }, Cu = { class: "work-stack work-tight" }, Eu = /* @__PURE__ */ ue({
  __name: "RelationsEditor",
  props: {
    draft: {},
    guardRemoval: { type: Function }
  },
  setup(e) {
    const a = e, t = W(() => a.draft.relation_types ?? []), l = z(""), o = z(""), s = z(!1), v = W(() => /^[a-z][a-z0-9_]*$/.test(l.value) && !t.value.some((i) => i.id === l.value));
    function c() {
      v.value && ((a.draft.relation_types ??= []).push({ id: l.value, outward: ge(l.value).toLowerCase(), inward: ge(l.value).toLowerCase(), cardinality: "many" }), l.value = "");
    }
    async function r(i) {
      if (!s.value) {
        s.value = !0, o.value = "";
        try {
          const n = await a.guardRemoval?.("relation_types", i);
          n ? o.value = n : Jt(a.draft, "relation_types", i);
        } finally {
          s.value = !1;
        }
      }
    }
    return (i, n) => (m(), h("section", mu, [
      u("header", vu, [
        n[1] || (n[1] = u("div", null, [
          u("h2", null, "Relation types"),
          u("p", { class: "work-muted work-small" }, "Give each direction a clear label. A used relation keeps its identity and shape.")
        ], -1)),
        f(d(Ae), {
          class: "kx-tag-sm",
          severity: "secondary"
        }, {
          default: L(() => [
            M(U(t.value.length) + " " + U(t.value.length === 1 ? "relation" : "relations"), 1)
          ]),
          _: 1
        })
      ]),
      o.value ? (m(), h("p", fu, U(o.value), 1)) : I("", !0),
      f(ka, {
        columns: "relations",
        count: t.value.length
      }, {
        default: L(() => [
          (m(!0), h(q, null, _(t.value, (b, w) => (m(), B(ga, {
            title: d(ge)(b.id),
            code: b.id,
            kind: b.symmetric ? "Symmetric" : "Directional",
            key: w,
            class: "work-stack"
          }, {
            usage: L(() => [
              u("span", pu, U(b.outward || "Related work") + " · " + U(b.inward || "Reverse relation"), 1)
            ]),
            actions: L(() => [
              f(d(K), {
                severity: "secondary",
                text: "",
                disabled: s.value,
                onClick: (y) => r(b.id),
                "aria-label": "Remove relation",
                size: "small"
              }, {
                default: L(() => [
                  f(d(Z), {
                    icon: "tabler:trash",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["disabled", "onClick"])
            ]),
            default: L(() => [
              u("div", bu, [
                u("label", hu, [
                  n[2] || (n[2] = M("ID ", -1)),
                  f(d(se), {
                    modelValue: b.id,
                    "onUpdate:modelValue": (y) => b.id = y,
                    required: "",
                    pattern: "[a-z][a-z0-9_]*",
                    "aria-label": "Relation ID"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                u("label", yu, [
                  n[3] || (n[3] = M("Outward label ", -1)),
                  f(d(se), {
                    modelValue: b.outward,
                    "onUpdate:modelValue": (y) => b.outward = y,
                    "aria-label": "Outward label"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                u("label", gu, [
                  n[4] || (n[4] = M("Inward label ", -1)),
                  f(d(se), {
                    modelValue: b.inward,
                    "onUpdate:modelValue": (y) => b.inward = y,
                    "aria-label": "Inward label"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                u("label", ku, [
                  n[5] || (n[5] = M("Cardinality ", -1)),
                  f(d(ee), {
                    "model-value": b.cardinality ?? "many",
                    "onUpdate:modelValue": (y) => b.cardinality = y,
                    "aria-label": "Relation cardinality",
                    appendTo: "self",
                    optionLabel: "label",
                    optionValue: "value",
                    optionDisabled: "disabled",
                    options: [{ label: "One link", value: "one", disabled: !1 }, { label: "Many links", value: "many", disabled: !1 }]
                  }, null, 8, ["model-value", "onUpdate:modelValue"])
                ]),
                u("label", wu, [
                  f(d(Ot), {
                    modelValue: b.symmetric,
                    "onUpdate:modelValue": (y) => b.symmetric = y,
                    "aria-label": "Symmetric",
                    binary: ""
                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                  n[6] || (n[6] = M("Same meaning in both directions ", -1))
                ])
              ]),
              u("p", Vu, [
                n[7] || (n[7] = u("strong", null, "This item", -1)),
                M(" " + U(b.outward || "relates to") + " ", 1),
                n[8] || (n[8] = u("strong", null, "another item", -1)),
                u("span", $u, " · reverse: " + U(b.symmetric ? b.outward : b.inward), 1)
              ])
            ]),
            _: 2
          }, 1032, ["title", "code", "kind"]))), 128)),
          t.value.length ? I("", !0) : (m(), h("p", xu, "No relation types yet. Add one to link related work.")),
          u("div", Su, [
            u("label", Cu, [
              n[9] || (n[9] = M("New relation ID ", -1)),
              f(d(se), {
                modelValue: l.value,
                "onUpdate:modelValue": n[0] || (n[0] = (b) => l.value = b),
                placeholder: "related_to",
                onKeydown: Ie(ye(c, ["prevent"]), ["enter"])
              }, null, 8, ["modelValue", "onKeydown"])
            ]),
            f(d(K), {
              label: "Add relation",
              severity: "secondary",
              disabled: !v.value,
              onClick: c,
              outlined: ""
            }, {
              icon: L(() => [
                f(d(Z), {
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
function Tu(e, a) {
  return e.parked ? "Stopped: " + (typeof e.error == "string" ? e.error : e.error?.message ?? "Projection is parked") : e.bootstrapping ? "Initializing" : e.last_seq >= a ? "Up to date" : "Catching up";
}
const Uu = {
  class: "work-stack",
  "aria-label": "Plugins editor"
}, Du = {
  key: 0,
  class: "kx-loading"
}, Iu = {
  key: 1,
  class: "kx-err",
  role: "alert"
}, Au = {
  key: 2,
  class: "work-notice",
  role: "status"
}, Pu = { class: "work-row" }, Ou = {
  key: 0,
  class: "work-muted work-small"
}, Ru = {
  key: 1,
  class: "kx-err"
}, Nu = {
  key: 2,
  class: "work-notice"
}, Mu = {
  key: 3,
  class: "work-stack work-tight work-plugin-status",
  role: "status"
}, Lu = {
  key: 0,
  class: "kx-err"
}, zu = { class: "work-muted work-small" }, Bu = { class: "work-form-actions" }, Fu = {
  key: 0,
  class: "work-muted work-small"
}, pl = /* @__PURE__ */ ue({
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
  setup(e, { emit: a }) {
    const t = e, l = a, o = z({}), s = z(""), v = z(""), c = z(""), r = z(/* @__PURE__ */ new Set()), i = {};
    function n(E) {
      return t.schema.plugins?.find((T) => T.plugin === E);
    }
    function b(E) {
      return n(E)?.active === !0;
    }
    function w(E) {
      return n(E)?.lifecycle.state === "ready";
    }
    function y(E) {
      return t.draft.plugins?.some((T) => T.use === E) === !0;
    }
    function k(E, T) {
      const V = t.draft.plugins ?? [];
      T && !y(E) && (t.draft.plugins = [...V, { use: E }]), T || (t.draft.plugins = V.filter((P) => P.use !== E), delete t.configs[E], r.value.delete(E), l("validity", E, !0));
    }
    function C(E) {
      return b(E) ? o.value[E] ?? n(E)?.config ?? i : t.configs[E] ?? i;
    }
    function R(E, T) {
      b(E) ? o.value[E] = T : t.configs[E] = T;
    }
    function $(E, T) {
      T ? r.value.delete(E) : r.value.add(E), b(E) || l("validity", E, T);
    }
    async function D(E) {
      if (!(s.value || r.value.has(E))) {
        s.value = E, v.value = "", c.value = "";
        try {
          await ht.configure(t.boardId, E, C(E)), delete o.value[E], c.value = "Plugin configuration saved.", l("configured");
        } catch (T) {
          v.value = T instanceof Error ? T.message : "Could not configure plugin.";
        } finally {
          s.value = "";
        }
      }
    }
    return (E, T) => (m(), h("section", Uu, [
      T[3] || (T[3] = u("header", { class: "work-section-heading" }, [
        u("div", null, [
          u("h2", null, "Plugins"),
          u("p", { class: "work-muted work-small" }, "Add capabilities from installed modules.")
        ])
      ], -1)),
      T[4] || (T[4] = u("p", { class: "work-muted work-small" }, "Activation joins the schema draft and requires review. Active plugin configuration saves separately.", -1)),
      e.options.length ? I("", !0) : (m(), h("p", Du, "No installed plugins are visible to you.")),
      v.value ? (m(), h("div", Iu, U(v.value), 1)) : I("", !0),
      c.value ? (m(), h("p", Au, U(c.value), 1)) : I("", !0),
      f(ka, {
        columns: "plugins",
        count: e.options.length
      }, {
        default: L(() => [
          (m(!0), h(q, null, _(e.options, (V) => (m(), B(ga, {
            key: V.plugin,
            title: V.title || "Unavailable capability",
            description: V.description,
            kind: b(V.plugin) ? "Active" : y(V.plugin) ? "Pending review" : "Inactive",
            class: "work-stack"
          }, {
            actions: L(() => [
              T[1] || (T[1] = u("span", { class: "work-spacer" }, null, -1)),
              u("label", Pu, [
                f(d(Re), {
                  "model-value": y(V.plugin),
                  disabled: !!s.value || e.disabled || e.activationLocked || !!V.problem,
                  "onUpdate:modelValue": (P) => k(V.plugin, P)
                }, null, 8, ["model-value", "disabled", "onUpdate:modelValue"]),
                T[0] || (T[0] = M("Activate on this board", -1))
              ])
            ]),
            default: L(() => [
              V.requires.length ? (m(), h("p", Ou, "Requires " + U(V.requires.map((P) => e.options.find((G) => G.plugin === P)?.title || "Another capability").join(", ")), 1)) : I("", !0),
              V.problem ? (m(), h("p", Ru, U(V.problem.message), 1)) : I("", !0),
              n(V.plugin)?.outdated ? (m(), h("p", Nu, "The stored declaration differs from the installed plugin. Review activation to update it.")) : I("", !0),
              b(V.plugin) ? (m(), h("div", Mu, [
                u("p", null, U(w(V.plugin) ? "Attachment configured" : n(V.plugin)?.lifecycle.state === "failed" ? "Configuration failed" : "Configuring attachment"), 1),
                n(V.plugin)?.lifecycle.error ? (m(), h("p", Lu, U(n(V.plugin)?.lifecycle.error?.message), 1)) : I("", !0),
                (m(!0), h(q, null, _(n(V.plugin)?.projections, (P, G) => (m(), h("div", { key: G }, [
                  u("p", null, U(d(Tu)(P, e.schema.as_of)), 1),
                  u("p", zu, "Position " + U(P.last_seq) + " · Board head " + U(e.schema.as_of), 1)
                ]))), 128))
              ])) : I("", !0),
              !V.problem && (y(V.plugin) || b(V.plugin)) ? (m(), h(q, { key: 4 }, [
                f(Yl, {
                  disabled: !!s.value || e.disabled,
                  schema: V.config_schema,
                  "model-value": C(V.plugin),
                  "onUpdate:modelValue": (P) => R(V.plugin, P),
                  onValidity: (P) => $(V.plugin, P)
                }, null, 8, ["disabled", "schema", "model-value", "onUpdate:modelValue", "onValidity"]),
                u("div", Bu, [
                  f(d(K), {
                    label: "Reset",
                    severity: "secondary",
                    outlined: "",
                    disabled: !!s.value || e.disabled,
                    onClick: (P) => R(V.plugin, b(V.plugin) ? d(_e)(n(V.plugin)?.config ?? {}) : {})
                  }, {
                    icon: L(() => [
                      f(d(Z), { icon: "tabler:restore" })
                    ]),
                    _: 1
                  }, 8, ["disabled", "onClick"]),
                  b(V.plugin) ? (m(), B(d(K), {
                    key: 0,
                    label: "Save configuration",
                    disabled: !!s.value || e.disabled || r.value.has(V.plugin),
                    loading: s.value === V.plugin,
                    onClick: (P) => D(V.plugin)
                  }, {
                    icon: L(() => [
                      f(d(Z), {
                        icon: "tabler:device-floppy",
                        "aria-hidden": "true"
                      })
                    ]),
                    _: 1
                  }, 8, ["disabled", "loading", "onClick"])) : I("", !0)
                ]),
                b(V.plugin) ? I("", !0) : (m(), h("p", Fu, "Initial configuration is included in Review and Apply."))
              ], 64)) : I("", !0)
            ]),
            _: 2
          }, 1032, ["title", "description", "kind"]))), 128))
        ]),
        _: 1
      }, 8, ["count"]),
      (m(!0), h(q, null, _(e.draft.plugins?.filter((V) => !e.options.some((P) => P.plugin === V.use)) ?? [], (V) => (m(), h("article", {
        key: V.use,
        class: "work-settings-card"
      }, [
        T[2] || (T[2] = u("p", null, "Unavailable plugin", -1)),
        f(d(K), {
          label: "Deactivate plugin",
          severity: "secondary",
          onClick: (P) => k(V.use, !1),
          outlined: ""
        }, {
          icon: L(() => [
            f(d(Z), {
              icon: "tabler:trash",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        }, 8, ["onClick"])
      ]))), 128))
    ]));
  }
}), ju = {
  class: "work-stack",
  "aria-label": "Board visibility"
}, qu = { class: "work-stack work-tight" }, Wu = { class: "work-settings-list" }, Gu = { class: "work-row-main" }, Yu = { class: "work-small work-muted" }, Hu = { class: "work-row-control" }, Ku = { class: "work-row" }, Xu = /* @__PURE__ */ ue({
  __name: "VisibilityEditor",
  props: {
    draft: {},
    boardId: {}
  },
  emits: ["validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = W(() => t.draft.visibility), s = W(() => (t.draft.fields ?? []).filter((r) => r.type === "option"));
    function v(r) {
      if (!r) {
        delete t.draft.visibility;
        return;
      }
      const i = s.value.find((n) => n.code === r);
      t.draft.visibility = { field: r, levels: (i?.options ?? []).map((n) => ({ id: n.id, holders: [] })) };
    }
    function c(r, i) {
      const n = o.value?.levels.find((b) => b.id === r);
      n && (n.holders = i ?? []);
    }
    return (r, i) => (m(), h("section", ju, [
      i[8] || (i[8] = u("h3", { class: "work-group-title" }, "Board visibility", -1)),
      i[9] || (i[9] = u("p", { class: "work-small work-muted" }, "Restrict items by their visibility level. People still need access to the board.", -1)),
      u("label", qu, [
        i[6] || (i[6] = M("Visibility field", -1)),
        f(d(ee), {
          placeholder: "No additional restriction",
          "model-value": o.value?.field ?? "",
          options: [{ label: "No additional restriction", value: "" }, ...s.value.map((n) => ({ label: d(Vt)(n), value: n.code }))],
          optionLabel: "label",
          optionValue: "value",
          appendTo: "self",
          "onUpdate:modelValue": i[0] || (i[0] = (n) => v(n))
        }, null, 8, ["model-value", "options"])
      ]),
      o.value ? (m(), h(q, { key: 0 }, [
        u("div", Wu, [
          (m(!0), h(q, null, _(o.value.levels, (n, b) => (m(), h("div", {
            key: n.id,
            class: "work-settings-row"
          }, [
            u("div", Gu, [
              u("strong", null, U(s.value.find((w) => w.code === o.value.field)?.options?.find((w) => w.id === n.id)?.label || "Visibility level"), 1),
              u("p", Yu, "Level " + U(b + 1), 1)
            ]),
            u("div", Hu, [
              f(Tl, {
                "board-id": e.boardId,
                label: "Who can see these items",
                "model-value": n.holders,
                "onUpdate:modelValue": (w) => c(n.id, w),
                onValidity: i[1] || (i[1] = (w) => l("validity", w))
              }, null, 8, ["board-id", "model-value", "onUpdate:modelValue"])
            ])
          ]))), 128))
        ]),
        u("label", Ku, [
          f(d(Re), {
            "model-value": o.value.bypass === "admin",
            "onUpdate:modelValue": i[2] || (i[2] = (n) => n ? o.value.bypass = "admin" : delete o.value.bypass)
          }, null, 8, ["model-value"]),
          i[7] || (i[7] = M("Board administrators can see every level", -1))
        ]),
        f(d(K), {
          label: "Remove visibility restriction",
          severity: "secondary",
          text: "",
          onClick: i[3] || (i[3] = (n) => delete e.draft.visibility)
        }),
        f(ot, {
          label: "Visibility rules",
          "model-value": o.value,
          shape: "object",
          example: { field: "visibility", levels: [{ id: "internal", holders: [] }], bypass: "admin" },
          "onUpdate:modelValue": i[4] || (i[4] = (n) => e.draft.visibility = n),
          onValidity: i[5] || (i[5] = (n) => l("validity", n))
        }, null, 8, ["model-value"])
      ], 64)) : I("", !0)
    ]));
  }
}), Ju = { class: "kx-head" }, Zu = { class: "kx-head-icon" }, Qu = { class: "kx-head-text" }, _u = { class: "kx-title" }, ec = ["title"], tc = { class: "kx-head-actions" }, ac = /* @__PURE__ */ ue({
  __name: "PageHead",
  props: {
    title: {},
    subtitle: {},
    icon: { default: "tabler:layout-kanban" },
    backLabel: {}
  },
  emits: ["back"],
  setup(e) {
    return (a, t) => (m(), h("header", Ju, [
      e.backLabel ? (m(), B(d(K), {
        key: 0,
        "aria-label": e.backLabel,
        severity: "secondary",
        text: "",
        onClick: t[0] || (t[0] = (l) => a.$emit("back"))
      }, {
        default: L(() => [
          f(d(Z), {
            icon: "tabler:arrow-left",
            "aria-hidden": "true"
          })
        ]),
        _: 1
      }, 8, ["aria-label"])) : I("", !0),
      u("div", Zu, [
        f(d(Z), {
          icon: e.icon,
          "aria-hidden": "true"
        }, null, 8, ["icon"])
      ]),
      u("div", Qu, [
        Ye(a.$slots, "identity", {}, () => [
          u("h1", _u, U(e.title), 1),
          e.subtitle ? (m(), h("p", {
            key: 0,
            class: "kx-head-sub",
            title: e.subtitle
          }, U(e.subtitle), 9, ec)) : I("", !0)
        ])
      ]),
      u("div", tc, [
        Ye(a.$slots, "default")
      ])
    ]));
  }
}), lc = { class: "work-board-identity work-stack work-tight" }, oc = { class: "work-stack work-tight" }, ic = { class: "work-stack work-tight" }, nc = { class: "work-row" }, sc = { class: "work-row" }, rc = {
  key: 1,
  class: "work-identity-actions"
}, dc = ["title"], uc = {
  key: 2,
  class: "kx-err work-inline",
  role: "alert"
}, cc = {
  key: 3,
  class: "work-muted work-small",
  role: "status"
}, bl = /* @__PURE__ */ ue({
  __name: "BoardIdentity",
  props: {
    board: {},
    compact: { type: Boolean },
    detail: { type: Boolean },
    subtitle: {}
  },
  emits: ["saved"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = z(!1), s = z(""), v = z(""), c = z(!1), r = z(""), i = z(""), n = W(() => t.board?.access?.admin === !0);
    function b() {
      s.value = t.board?.title ?? "", v.value = t.board?.description ?? "", r.value = "", i.value = "", o.value = !0;
    }
    Ee(n, (y) => {
      y || (o.value = !1);
    });
    async function w() {
      if (!n.value || !t.board || c.value || !s.value.trim()) return;
      const y = {};
      if (s.value.trim() !== t.board.title && (y.title = s.value.trim()), v.value !== (t.board.description ?? "") && (y.description = v.value), !Object.keys(y).length) {
        o.value = !1, i.value = "Nothing changed.";
        return;
      }
      c.value = !0, r.value = "";
      try {
        const k = await kt.updateBoard(t.board.board_id, y);
        o.value = !1, i.value = k.status === "unchanged" ? "Nothing changed." : "Board saved.", l("saved");
      } catch (k) {
        r.value = k instanceof Error ? k.message : "Could not save the board.";
      } finally {
        c.value = !1;
      }
    }
    return (y, k) => (m(), h("div", lc, [
      o.value ? (m(), h("form", {
        key: 0,
        class: "work-identity-edit",
        "aria-label": "Edit board",
        onClick: k[3] || (k[3] = ye(() => {
        }, ["stop"])),
        onSubmit: ye(w, ["prevent"])
      }, [
        u("label", oc, [
          k[4] || (k[4] = M("Title", -1)),
          f(d(se), {
            modelValue: s.value,
            "onUpdate:modelValue": k[0] || (k[0] = (C) => s.value = C),
            required: "",
            autofocus: "",
            disabled: c.value
          }, null, 8, ["modelValue", "disabled"])
        ]),
        u("label", ic, [
          k[5] || (k[5] = M("Description", -1)),
          f(d(Xt), {
            modelValue: v.value,
            "onUpdate:modelValue": k[1] || (k[1] = (C) => v.value = C),
            rows: "1",
            disabled: c.value
          }, null, 8, ["modelValue", "disabled"])
        ]),
        u("div", nc, [
          f(d(K), {
            label: "Save",
            severity: "secondary",
            type: "submit",
            disabled: !s.value.trim() || c.value,
            loading: c.value,
            outlined: ""
          }, {
            icon: L(() => [
              f(d(Z), {
                icon: "tabler:device-floppy",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled", "loading"]),
          f(d(K), {
            label: "Cancel",
            severity: "secondary",
            disabled: c.value,
            onClick: k[2] || (k[2] = (C) => o.value = !1),
            outlined: ""
          }, {
            icon: L(() => [
              f(d(Z), {
                icon: "tabler:x",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled"])
        ])
      ], 32)) : (m(), h(q, { key: 1 }, [
        u("div", sc, [
          (m(), B(Oa(e.compact || e.detail ? "h2" : "h1"), {
            class: ct(e.detail ? "work-detail-title" : e.compact ? "kx-card-name" : "kx-title")
          }, {
            default: L(() => [
              M(U(e.board?.title || "Untitled board"), 1)
            ]),
            _: 1
          }, 8, ["class"])),
          e.compact ? Ye(y.$slots, "title-end", {}, void 0, void 0, 0) : I("", !0),
          e.compact ? (m(), h("span", rc, [
            n.value ? (m(), B(d(K), {
              key: 0,
              severity: "secondary",
              text: "",
              size: "small",
              onClick: ye(b, ["stop"]),
              "aria-label": "Edit board"
            }, {
              default: L(() => [
                f(d(Z), {
                  icon: "tabler:pencil",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            })) : I("", !0),
            Ye(y.$slots, "actions")
          ])) : n.value ? (m(), B(d(K), {
            key: 2,
            severity: "secondary",
            text: "",
            size: "small",
            onClick: ye(b, ["stop"]),
            "aria-label": "Edit board"
          }, {
            default: L(() => [
              f(d(Z), {
                icon: "tabler:pencil",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          })) : I("", !0),
          e.compact ? I("", !0) : Ye(y.$slots, "title-end", {}, void 0, void 0, 3)
        ]),
        !e.compact && (e.subtitle || e.board?.description) ? (m(), h("p", {
          key: 0,
          class: "kx-head-sub",
          title: e.subtitle || e.board?.description
        }, U(e.subtitle || e.board?.description), 9, dc)) : I("", !0)
      ], 64)),
      r.value ? (m(), h("p", uc, U(r.value), 1)) : I("", !0),
      i.value ? (m(), h("p", cc, U(i.value), 1)) : I("", !0)
    ]));
  }
}), mc = {
  key: 0,
  class: "work-dirty"
}, hl = /* @__PURE__ */ ue({
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
    return (a, t) => (m(), h(q, null, [
      e.dirty ? (m(), h("span", mc, "Unsaved changes")) : I("", !0),
      f(d(K), {
        label: "Discard",
        severity: "secondary",
        outlined: "",
        disabled: !e.dirty || e.busy || e.checkingRemoval,
        onClick: t[0] || (t[0] = (l) => a.$emit("discard"))
      }, {
        icon: L(() => [
          f(d(Z), { icon: "tabler:restore" })
        ]),
        _: 1
      }, 8, ["disabled"]),
      f(d(K), {
        label: e.reviewed ? "Apply" : "Review changes",
        disabled: e.disabled,
        loading: e.busy,
        onClick: t[1] || (t[1] = (l) => a.$emit("primary"))
      }, null, 8, ["label", "disabled", "loading"])
    ], 64));
  }
}), vc = {
  key: 0,
  class: "work-detail-head"
}, fc = {
  key: 0,
  class: "work-row work-wrap work-draft-actions"
}, pc = /* @__PURE__ */ ue({
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
    const a = e, t = W(() => a.pack ? `${a.packTitle} ${a.pack.version}${a.outdated ? " · Outdated" : ""}` : ""), l = W(() => "Settings · generation " + (a.generation ?? "…") + (t.value ? " · " + t.value : ""));
    return (o, s) => e.embedded ? (m(), h("header", vc, [
      f(bl, {
        board: e.board,
        subtitle: t.value || void 0,
        detail: "",
        onSaved: s[0] || (s[0] = (v) => o.$emit("saved"))
      }, {
        "title-end": L(() => [
          f(d(Ae), {
            severity: "secondary",
            value: "Generation " + (e.generation ?? "…")
          }, null, 8, ["value"])
        ]),
        _: 1
      }, 8, ["board", "subtitle"]),
      e.authorized ? (m(), h("div", fc, [
        e.authorized && e.outdated && e.pack ? (m(), B(d(K), {
          key: 0,
          disabled: !e.canUpgrade,
          title: e.upgradeReason,
          label: "Upgrade pack",
          severity: "secondary",
          outlined: "",
          onClick: s[1] || (s[1] = (v) => o.$emit("upgrade"))
        }, {
          icon: L(() => [
            f(d(Z), { icon: "tabler:refresh" })
          ]),
          _: 1
        }, 8, ["disabled", "title"])) : I("", !0),
        f(hl, {
          dirty: e.dirty,
          busy: e.busy,
          "checking-removal": e.checkingRemoval,
          reviewed: e.reviewed,
          disabled: e.disabled,
          onDiscard: s[2] || (s[2] = (v) => o.$emit("discard")),
          onPrimary: s[3] || (s[3] = (v) => o.$emit("primary"))
        }, null, 8, ["dirty", "busy", "checking-removal", "reviewed", "disabled"])
      ])) : I("", !0)
    ])) : (m(), B(ac, {
      key: 1,
      title: e.board?.title || "Board",
      subtitle: l.value,
      "back-label": "Back to board",
      icon: "tabler:adjustments",
      onBack: s[8] || (s[8] = (v) => o.$emit("back"))
    }, {
      identity: L(() => [
        f(bl, {
          board: e.board,
          subtitle: l.value,
          onSaved: s[4] || (s[4] = (v) => o.$emit("saved"))
        }, null, 8, ["board", "subtitle"])
      ]),
      default: L(() => [
        e.authorized && e.outdated && e.pack ? (m(), B(d(K), {
          key: 0,
          disabled: !e.canUpgrade,
          title: e.upgradeReason,
          label: "Upgrade pack",
          severity: "secondary",
          outlined: "",
          onClick: s[5] || (s[5] = (v) => o.$emit("upgrade"))
        }, {
          icon: L(() => [
            f(d(Z), { icon: "tabler:refresh" })
          ]),
          _: 1
        }, 8, ["disabled", "title"])) : I("", !0),
        e.authorized ? (m(), B(hl, {
          key: 1,
          dirty: e.dirty,
          busy: e.busy,
          "checking-removal": e.checkingRemoval,
          reviewed: e.reviewed,
          disabled: e.disabled,
          onDiscard: s[6] || (s[6] = (v) => o.$emit("discard")),
          onPrimary: s[7] || (s[7] = (v) => o.$emit("primary"))
        }, null, 8, ["dirty", "busy", "checking-removal", "reviewed", "disabled"])) : I("", !0)
      ]),
      _: 1
    }, 8, ["title", "subtitle"]));
  }
}), bc = {
  key: 0,
  class: "work-settings-card work-schema-plan work-stack",
  "aria-label": "Schema review"
}, hc = { key: 0 }, yc = { class: "work-row" }, gc = { class: "work-muted work-small" }, kc = { class: "work-muted" }, wc = {
  key: 0,
  class: "work-notice"
}, Vc = {
  key: 1,
  class: "work-notice"
}, $c = {
  key: 2,
  class: "work-muted work-small"
}, xc = { key: 3 }, Sc = { key: 0 }, Cc = {
  key: 4,
  class: "work-settings-table"
}, Ec = { key: 0 }, Tc = { key: 1 }, Uc = { key: 2 }, Dc = { key: 5 }, Ic = /* @__PURE__ */ ue({
  __name: "SchemaReview",
  props: {
    plan: {},
    generation: {},
    follows: {},
    configCount: {},
    packReview: { type: Boolean }
  },
  setup(e) {
    return (a, t) => e.plan ? (m(), h("section", bc, [
      !e.plan.changes.length && !e.plan.refused.length && !e.configCount && !e.packReview ? (m(), h("p", hc, "No changes to apply.")) : (m(), h(q, { key: 1 }, [
        u("header", yc, [
          t[0] || (t[0] = u("h2", null, "Review", -1)),
          f(d(Ae), {
            class: "kx-tag-sm",
            severity: e.plan.class === "refused" ? "danger" : e.plan.class === "semantic" ? "warn" : e.plan.class === "additive" ? "success" : "secondary"
          }, {
            default: L(() => [
              M(U(e.plan.class), 1)
            ]),
            _: 1
          }, 8, ["severity"]),
          u("span", gc, "Generation " + U(e.generation) + " → " + U(e.plan.generation), 1)
        ]),
        u("p", kc, U(d(vo)[e.plan.class] || "Review the classified changes below."), 1),
        e.plan.migration ? (m(), h("p", wc, "Migration needed: " + U(e.plan.migration), 1)) : e.follows.length ? (m(), h("p", Vc, "Follow migration: " + U(e.follows.join(", ")) + ". Existing items move to the new process generation; declared state maps apply.", 1)) : (m(), h("p", $c, "No follow process migration is indicated by these changes.")),
        Ye(a.$slots, "default"),
        e.plan.refused.length ? (m(), h("h3", xc, "Refused changes")) : I("", !0),
        (m(!0), h(q, null, _(e.plan.refused, (l, o) => (m(), B(d(Co), {
          key: o,
          severity: "error",
          role: "alert"
        }, {
          default: L(() => [
            M(U(l.code) + " · " + U(l.what) + " · " + U(d(ya)(l)), 1),
            l.to ? (m(), h("span", Sc, " → " + U(l.to), 1)) : I("", !0)
          ]),
          _: 2
        }, 1024))), 128)),
        e.plan.changes.length ? (m(), h("table", Cc, [
          t[1] || (t[1] = u("thead", null, [
            u("tr", null, [
              u("th", null, "Entry"),
              u("th", null, "Class"),
              u("th", null, "Change")
            ])
          ], -1)),
          u("tbody", null, [
            (m(!0), h(q, null, _(e.plan.changes, (l, o) => (m(), h("tr", { key: o }, [
              u("td", null, U(l.code), 1),
              u("td", null, [
                f(d(Ae), {
                  class: "kx-tag-sm",
                  severity: l.class === "refused" ? "danger" : l.class === "semantic" ? "warn" : l.class === "additive" ? "success" : "secondary"
                }, {
                  default: L(() => [
                    M(U(l.class), 1)
                  ]),
                  _: 2
                }, 1032, ["severity"])
              ]),
              u("td", null, [
                M(U(l.what) + " ", 1),
                l.detail ? (m(), h("span", Ec, " · " + U(l.detail), 1)) : I("", !0),
                l.to ? (m(), h("span", Tc, " → " + U(l.to), 1)) : I("", !0),
                l.count ? (m(), h("span", Uc, " · " + U(l.count) + " items", 1)) : I("", !0)
              ])
            ]))), 128))
          ])
        ])) : (m(), h("p", Dc, "No declaration changes are reported."))
      ], 64))
    ])) : I("", !0);
  }
}), Ac = {
  key: 0,
  class: "work-stack",
  "aria-label": "Pack conflicts"
}, Pc = { class: "work-stack work-tight work-pack-review-field" }, Oc = { class: "work-json-disclosure" }, Rc = { class: "work-config-fields" }, Nc = { class: "work-json-example" }, Mc = { class: "work-json-example" }, Lc = {
  key: 1,
  class: "work-stack",
  "aria-label": "Pack state maps"
}, zc = /* @__PURE__ */ ue({
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
      return t.original.processes?.find((n) => n.id === i)?.name || ge(i);
    }
    function s(i) {
      const [n, ...b] = i.split("."), w = b.join(".");
      return n === "processes" ? o(w) : n === "fields" ? t.original.fields?.find((y) => y.code === w)?.title || ge(w) : n === "item_types" ? t.original.item_types?.find((y) => y.id === w)?.title || ge(w) : ge(n);
    }
    function v(i) {
      return JSON.stringify(i ?? null, null, 2);
    }
    function c(i, n) {
      (t.request.resolutions ??= {})[i] = n, l("change");
    }
    function r(i, n, b) {
      ((t.request.maps ??= {})[i] ??= {})[n] = b, l("change");
    }
    return (i, n) => (m(), h(q, null, [
      e.plan.conflicts.length ? (m(), h("section", Ac, [
        n[3] || (n[3] = u("h3", null, "Local edits conflict", -1)),
        n[4] || (n[4] = u("p", { class: "work-muted work-small" }, "Choose which declaration to keep for each conflict, then review again.", -1)),
        (m(!0), h(q, null, _(e.plan.conflicts, (b) => (m(), h("div", {
          key: b.path,
          class: "work-stack work-tight"
        }, [
          u("label", Pc, [
            M(U(s(b.path)), 1),
            f(d(ee), {
              "model-value": e.request.resolutions?.[b.path],
              "aria-label": "Resolution for " + s(b.path),
              disabled: e.disabled,
              appendTo: "self",
              placeholder: "Choose a resolution",
              optionLabel: "label",
              optionValue: "value",
              options: [{ label: "Keep local edits", value: "local" }, { label: "Use pack changes", value: "incoming" }],
              "onUpdate:modelValue": (w) => c(b.path, w)
            }, null, 8, ["model-value", "aria-label", "disabled", "onUpdate:modelValue"])
          ]),
          u("details", Oc, [
            n[2] || (n[2] = u("summary", null, "Compare declarations", -1)),
            u("div", Rc, [
              u("section", null, [
                n[0] || (n[0] = u("h4", null, "Local edits", -1)),
                u("pre", Nc, U(v(b.local_value)), 1)
              ]),
              u("section", null, [
                n[1] || (n[1] = u("h4", null, "Pack changes", -1)),
                u("pre", Mc, U(v(b.incoming)), 1)
              ])
            ])
          ])
        ]))), 128))
      ])) : I("", !0),
      Object.keys(e.plan.maps).length ? (m(), h("section", Lc, [
        n[5] || (n[5] = u("h3", null, "Required state maps", -1)),
        n[6] || (n[6] = u("p", { class: "work-muted work-small" }, "Review the proposed destinations for existing items. Each destination is editable.", -1)),
        (m(!0), h(q, null, _(e.plan.maps, (b, w) => (m(), h("div", {
          key: w,
          class: "work-stack"
        }, [
          u("h4", null, U(o(w)), 1),
          (m(!0), h(q, null, _(b, (y, k) => (m(), h("label", {
            key: k,
            class: "work-stack work-tight work-pack-review-field"
          }, [
            M("Move items from " + U(d(he)(e.original.processes?.find((C) => C.id === w)?.states.find((C) => C.id === k))), 1),
            f(d(ee), {
              "model-value": e.request.maps?.[w]?.[k],
              "aria-label": "Move items from " + d(he)(e.original.processes?.find((C) => C.id === w)?.states.find((C) => C.id === k)),
              disabled: e.disabled,
              appendTo: "self",
              optionLabel: "label",
              optionValue: "value",
              options: e.plan.declaration.processes?.find((C) => C.id === w)?.states.map((C) => ({ label: d(he)(C), value: C.id })) ?? [],
              "onUpdate:modelValue": (C) => r(w, k, C)
            }, null, 8, ["model-value", "aria-label", "disabled", "options", "onUpdate:modelValue"])
          ]))), 128))
        ]))), 128))
      ])) : I("", !0)
    ], 64));
  }
});
function Bc(e, a) {
  return { pack: e.id, version: e.version, expected_generation: a };
}
async function Fc(e, a) {
  const t = { ..._e(e), resolutions: _e(e.resolutions ?? {}) };
  let l = await a(t);
  return t.maps || (t.maps = _e(l.maps), l = await a(t)), { request: t, plan: l };
}
const jc = {
  key: 0,
  class: "work-settings-tabs"
}, qc = { class: "work-section-navigation" }, Wc = { class: "work-row work-small work-advanced" }, Gc = {
  key: 1,
  class: "kx-err",
  role: "alert"
}, Yc = {
  key: 2,
  class: "kx-err",
  role: "alert"
}, Hc = {
  key: 3,
  class: "work-notice",
  role: "status"
}, Kc = {
  key: 4,
  class: "kx-loading",
  role: "status"
}, Xc = {
  key: 5,
  class: "work-notice",
  role: "alert"
}, Jc = {
  key: 6,
  class: "work-settings-content work-pane"
}, Zc = {
  key: 0,
  class: "work-notice",
  role: "alert"
}, Qc = {
  key: 1,
  class: "work-notice"
}, _c = { key: 0 }, em = ["disabled", "inert"], tm = {
  key: 6,
  class: "work-settings-card work-stack work-advanced-settings"
}, am = {
  key: 5,
  class: "kx-empty"
}, lm = {
  key: 6,
  class: "work-muted work-small",
  role: "status"
}, om = /* @__PURE__ */ ue({
  __name: "BoardSettings",
  props: {
    boardId: {},
    embedded: { type: Boolean }
  },
  setup(e) {
    const a = e, t = Uo(), l = ["Fields", "Item types", "Process", "Policy", "Relation types", "Plugins", "Review"], o = z("Fields"), s = z(!1), v = z(/* @__PURE__ */ new Set(["Fields"]));
    Ee(o, (H) => v.value.add(H));
    const c = z(), r = z(), i = z(), n = z({}), b = z({}), w = z(), y = z(!1), k = z(!0), C = z(!1), R = z(""), $ = z(""), D = z(""), E = z([]), T = z(), V = z(), P = z(), G = z(), ce = z(), re = z(""), J = z([]), O = W(() => [...J.value, ...G.value?.refused ?? []]), te = z(!1), S = z(0), A = z(/* @__PURE__ */ new Set()), N = z(), X = Na(), de = Na(), fe = W(() => al(n.value, c.value?.declaration ?? {})), be = W(() => !!T.value || !!c.value && (JSON.stringify(fe.value) !== JSON.stringify(c.value.declaration) || Object.keys(b.value).length > 0)), xe = W(() => !!c.value && !!r.value && c.value.generation !== r.value.generation), Pe = W(() => y.value && !C.value && !te.value && !We.value && !xe.value && !A.value.size && G.value && (G.value.changes.length > 0 || Object.keys(b.value).length > 0) && G.value.class !== "refused" && !G.value.refused.length && ce.value?.matches(fe.value, c.value?.generation ?? -1, b.value)), p = W(() => E.value.find((H) => H.id === T.value?.pack)?.plugins.filter((H) => !c.value?.plugins?.some((Q) => Q.plugin === H.id && Q.active)).map((H) => ({ use: H.id })) ?? []), x = W(() => !!P.value && JSON.stringify(P.value) === JSON.stringify(T.value)), g = W(() => T.value ? y.value && !C.value && !xe.value && !We.value && x.value && G.value?.class !== "refused" && !G.value?.refused.length && V.value?.conflicts.every((H) => !!T.value?.resolutions?.[H.path]) : Pe.value), j = W(() => !!G.value && (!T.value || x.value)), Y = W(() => E.value.find((H) => H.id === c.value?.pack?.id)?.title || "Installed pack"), ne = W(() => !D.value && !!c.value?.outdated && !!E.value.find((H) => H.id === c.value?.pack?.id)), pe = W(() => D.value ? "Reload packs to check available upgrades." : ne.value ? be.value ? "Discard the current draft before upgrading." : We.value ? "Finish the current migration before upgrading." : C.value ? "Wait for the current request to finish." : void 0 : "Install an available version of this pack to upgrade.");
    function ze() {
      T.value = void 0, V.value = void 0, P.value = void 0;
    }
    async function Ke() {
      if (!c.value?.pack || C.value || be.value) return;
      const H = E.value.find((Q) => Q.id === c.value.pack.id);
      H && (T.value = Bc(H, c.value.generation), o.value = "Review", await Te());
    }
    async function Te() {
      if (!T.value || C.value || !y.value || xe.value) return;
      const H = de(), Q = _e(T.value), ie = JSON.stringify(T.value);
      C.value = !0, R.value = "", $.value = "";
      try {
        const $e = await Fc(Q, (xt) => ht.packPlan(a.boardId, xt));
        if (!H() || ie !== JSON.stringify(T.value)) return;
        V.value = $e.plan, G.value = $e.plan, T.value = $e.request, P.value = _e(T.value), re.value = crypto.randomUUID(), o.value = "Review";
      } catch ($e) {
        H() && (P.value = void 0, R.value = $e instanceof Error ? $e.message : "Could not plan the pack upgrade.");
      } finally {
        C.value = !1;
      }
    }
    const mt = W(() => G.value ? fo(G.value, fe.value) : []), We = W(() => !!r.value?.migration_error || i.value?.status === "migrating");
    function Qe() {
      J.value = [], de(), G.value = void 0, ce.value = void 0, P.value = void 0, re.value = "";
    }
    Ee([fe, b], Qe, { deep: !0, flush: "sync" }), Ee(b, (H) => {
      T.value && (Object.keys(H).length ? T.value.plugin_configs = _e(H) : delete T.value.plugin_configs);
    }, { deep: !0, flush: "sync" });
    function Ne(H, Q) {
      Q ? A.value.delete(H) : A.value.add(H), Qe();
    }
    function Lt(H) {
      ze(), S.value++, c.value = H, n.value = _e(H.declaration), b.value = {}, A.value.clear(), Qe();
    }
    async function Be(H = !1) {
      const Q = X();
      try {
        const [ie, $e, xt] = await Promise.all([kt.schema(a.boardId, void 0, !0), kt.options(a.boardId), kt.boards()]);
        if (!Q()) return;
        if (y.value = $e.access.admin, w.value = $e, i.value = xt.find((ea) => ea.board_id === a.boardId), !y.value) {
          c.value = void 0, n.value = {}, Qe();
          return;
        }
        R.value = "";
        const st = bo(ie);
        r.value = st, (H || !c.value || !be.value) && Lt(st), xe.value && Qe(), ie.pack && await Qa(Q);
      } catch (ie) {
        if (!Q()) return;
        y.value = !1, Qe(), R.value = ie instanceof Error ? ie.message : "Could not load board settings.";
      } finally {
        Q() && (k.value = !1);
      }
    }
    async function Qa(H = () => !0) {
      D.value = "";
      try {
        const Q = await kt.packs();
        H() && (E.value = Q);
      } catch (Q) {
        H() && (D.value = Q instanceof Error ? Q.message : "Could not load packs.");
      }
    }
    function Hl() {
      for (const H of N.value?.querySelectorAll("input, select, textarea") ?? [])
        if (!(H.form !== N.value || H.closest('[style*="display: none"]')) && !H.reportValidity())
          return !1;
      return !0;
    }
    function Kl(H) {
      o.value = H, H === "Review" && !G.value && Va();
    }
    async function Va() {
      if (T.value) return Te();
      if (!c.value || C.value || !y.value || xe.value || A.value.size || !Hl()) return;
      const H = de(), Q = ll(fe.value, c.value.generation, b.value);
      C.value = !0, R.value = "", $.value = "";
      try {
        const ie = await ht.plan(a.boardId, Q);
        if (!H() || A.value.size || !Q.matches(fe.value, c.value.generation, b.value)) return;
        G.value = ie, ce.value = Q, re.value = crypto.randomUUID(), o.value = "Review";
      } catch (ie) {
        H() && (Qe(), R.value = ie instanceof Error ? ie.message : "Could not review changes.", J.value = ho(ie, fe.value));
      } finally {
        C.value = !1;
      }
    }
    async function Xl() {
      if (g.value) {
        if (T.value && P.value) {
          C.value = !0, R.value = "";
          try {
            const H = await ht.packApply(a.boardId, _e(P.value), re.value);
            await Be(!0), $.value = H.status === "done" ? `Pack upgraded at generation ${H.generation}.` : "Pack installation continues in the background.";
          } catch (H) {
            R.value = H instanceof Error ? H.message : "Could not apply the pack upgrade.";
          } finally {
            C.value = !1;
          }
          return;
        }
        if (ce.value) {
          C.value = !0, R.value = "", $.value = "";
          try {
            const H = await ht.apply(a.boardId, ce.value, re.value);
            await Be(!0), $.value = `Applied generation ${H.generation} (${H.class}).`;
          } catch (H) {
            R.value = H instanceof Error ? H.message : "Could not apply schema.";
          } finally {
            C.value = !1;
          }
        }
      }
    }
    async function Jl() {
      if (!C.value) {
        C.value = !0, R.value = "";
        try {
          const H = await ht.resume(a.boardId);
          $.value = H.resumed ? "Migration resumes." : "Migration is already running.", await Be();
        } catch (H) {
          R.value = H instanceof Error ? H.message : "Could not resume migration.";
        } finally {
          C.value = !1;
        }
      }
    }
    async function _t(H, Q) {
      if (!c.value || !y.value || C.value || te.value) return "Wait for the current change to finish.";
      if (xe.value) return "Discard the stale draft before removing a definition.";
      const ie = c.value.generation, $e = JSON.stringify(fe.value), xt = _e(n.value);
      Jt(xt, H, Q), te.value = !0;
      try {
        const st = await ht.plan(a.boardId, ll(al(xt, c.value.declaration), ie, b.value));
        if (!y.value || xe.value || c.value.generation !== ie || JSON.stringify(fe.value) !== $e) return "The draft changes during the check. Try the removal again.";
        const ea = yo(st, H, Q);
        if (ea) return ea;
        if (st.class === "refused") return "Resolve the refused draft changes in Review before removing this definition.";
      } catch (st) {
        return st instanceof Error ? st.message : "Could not check this removal.";
      } finally {
        te.value = !1;
      }
    }
    function Zl() {
      r.value && Lt(r.value), $.value = "", R.value = "";
    }
    Ee(() => a.boardId, () => {
      ze(), E.value = [], c.value = void 0, r.value = void 0, i.value = void 0, b.value = {}, A.value.clear(), v.value = /* @__PURE__ */ new Set(["Fields"]), o.value = "Fields", y.value = !1, k.value = !0, Be(!0);
    });
    let $a = () => {
    };
    return Ee(() => a.boardId, (H) => {
      $a(), $a = oo(`component.${H}`, () => {
        Be();
      });
    }, { immediate: !0 }), po(Be), yl(() => {
      $a(), X(), de();
    }), (H, Q) => (m(), h("section", {
      class: ct(["work-settings-shell", { "work-embedded": e.embedded }])
    }, [
      f(pc, {
        board: i.value,
        embedded: e.embedded,
        generation: c.value?.generation,
        authorized: y.value,
        dirty: be.value,
        busy: C.value,
        "checking-removal": te.value,
        reviewed: j.value,
        pack: c.value?.pack,
        "pack-title": Y.value,
        outdated: c.value?.outdated,
        "upgrade-reason": pe.value,
        "can-upgrade": ne.value && !be.value && !C.value && !We.value && y.value,
        onUpgrade: Ke,
        disabled: !be.value || C.value || te.value || We.value || xe.value || !!A.value.size || j.value && !g.value,
        onBack: Q[0] || (Q[0] = (ie) => d(t)({ name: "board", board: e.boardId })),
        onDiscard: Zl,
        onPrimary: Q[1] || (Q[1] = (ie) => j.value ? Xl() : Va()),
        onSaved: Q[2] || (Q[2] = (ie) => Be())
      }, null, 8, ["board", "embedded", "generation", "authorized", "dirty", "busy", "checking-removal", "reviewed", "pack", "pack-title", "outdated", "upgrade-reason", "can-upgrade", "disabled"]),
      y.value && c.value ? (m(), h("div", jc, [
        u("div", qc, [
          f(d($o), {
            value: o.value,
            "onUpdate:value": Q[3] || (Q[3] = (ie) => Kl(ie))
          }, {
            default: L(() => [
              f(d(xo), { "aria-label": "Settings sections" }, {
                default: L(() => [
                  (m(), h(q, null, _(l, (ie) => f(d(So), {
                    key: ie,
                    value: ie
                  }, {
                    default: L(() => [
                      M(U(ie), 1)
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
        u("label", Wc, [
          f(d(Re), {
            modelValue: s.value,
            "onUpdate:modelValue": Q[4] || (Q[4] = (ie) => s.value = ie),
            "aria-label": "Advanced settings"
          }, null, 8, ["modelValue"]),
          Q[14] || (Q[14] = M("Advanced", -1))
        ])
      ])) : I("", !0),
      R.value ? (m(), h("div", Gc, [
        M(U(R.value) + " ", 1),
        f(d(K), {
          label: "Retry",
          severity: "secondary",
          onClick: Q[5] || (Q[5] = (ie) => Be()),
          outlined: ""
        }, {
          icon: L(() => [
            f(d(Z), {
              icon: "tabler:refresh",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        })
      ])) : I("", !0),
      D.value ? (m(), h("p", Yc, [
        M(U(D.value), 1),
        f(d(K), {
          label: "Reload packs",
          severity: "secondary",
          outlined: "",
          onClick: Q[6] || (Q[6] = (ie) => Qa())
        }, {
          icon: L(() => [
            f(d(Z), { icon: "tabler:refresh" })
          ]),
          _: 1
        })
      ])) : I("", !0),
      $.value ? (m(), h("p", Hc, U($.value), 1)) : I("", !0),
      k.value ? (m(), h("p", Kc, "Loading settings…")) : y.value ? I("", !0) : (m(), h("p", Xc, "Board administrator access is required.")),
      y.value && c.value ? (m(), h("div", Jc, [
        xe.value ? (m(), h("div", Zc, "The board advances to generation " + U(r.value?.generation) + " while you edit. Your draft keeps generation " + U(c.value.generation) + ". Discard to load the latest schema before reviewing again.", 1)) : I("", !0),
        We.value ? (m(), h("div", Qc, [
          u("p", null, [
            Q[15] || (Q[15] = M("Migration pending", -1)),
            r.value?.migration_error ? (m(), h("span", _c, ": " + U(r.value.migration_error), 1)) : I("", !0)
          ]),
          f(d(K), {
            label: "Resume migration",
            severity: "secondary",
            disabled: C.value,
            onClick: Jl,
            outlined: ""
          }, {
            icon: L(() => [
              f(d(Z), {
                icon: "tabler:refresh",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled"])
        ])) : I("", !0),
        u("form", {
          ref_key: "editor",
          ref: N,
          onSubmit: ye(Va, ["prevent"])
        }, [
          (m(), h("fieldset", {
            key: S.value,
            class: "work-settings-fieldset",
            disabled: C.value || te.value,
            inert: C.value || te.value || void 0
          }, [
            v.value.has("Fields") ? at((m(), B(ls, {
              key: 0,
              "board-id": e.boardId,
              "installed-types": w.value?.installed_types,
              draft: n.value,
              "guard-removal": _t,
              advanced: s.value,
              issues: O.value,
              onValidity: Q[7] || (Q[7] = (ie, $e) => Ne("fields:" + ie, $e))
            }, null, 8, ["board-id", "installed-types", "draft", "advanced", "issues"])), [
              [bt, o.value === "Fields"]
            ]) : I("", !0),
            v.value.has("Item types") ? at((m(), B(ws, {
              key: 1,
              draft: n.value,
              "guard-removal": _t,
              issues: O.value
            }, null, 8, ["draft", "issues"])), [
              [bt, o.value === "Item types"]
            ]) : I("", !0),
            v.value.has("Process") ? at((m(), B(Nd, {
              key: 2,
              "board-id": e.boardId,
              draft: n.value,
              "guard-removal": _t,
              advanced: s.value,
              issues: O.value,
              onValidity: Q[8] || (Q[8] = (ie, $e) => Ne("process:" + ie, $e))
            }, null, 8, ["board-id", "draft", "advanced", "issues"])), [
              [bt, o.value === "Process"]
            ]) : I("", !0),
            v.value.has("Policy") ? at((m(), B(cu, {
              key: 3,
              draft: n.value
            }, null, 8, ["draft"])), [
              [bt, o.value === "Policy"]
            ]) : I("", !0),
            v.value.has("Relation types") ? at((m(), B(Eu, {
              key: 4,
              draft: n.value,
              "guard-removal": _t
            }, null, 8, ["draft"])), [
              [bt, o.value === "Relation types"]
            ]) : I("", !0),
            v.value.has("Plugins") ? at((m(), B(pl, {
              key: 5,
              "board-id": e.boardId,
              draft: n.value,
              schema: r.value ?? c.value,
              options: w.value?.schema_options.plugins ?? [],
              configs: b.value,
              disabled: C.value,
              onConfigured: Q[9] || (Q[9] = (ie) => {
                Qe(), Be();
              }),
              onValidity: Q[10] || (Q[10] = (ie, $e) => Ne("plugin:" + ie, $e))
            }, null, 8, ["board-id", "draft", "schema", "options", "configs", "disabled"])), [
              [bt, o.value === "Plugins"]
            ]) : I("", !0),
            s.value && o.value === "Policy" ? (m(), h("section", tm, [
              f(Xu, {
                "board-id": e.boardId,
                draft: n.value,
                onValidity: Q[11] || (Q[11] = (ie) => Ne("visibility", ie))
              }, null, 8, ["board-id", "draft"])
            ])) : I("", !0)
          ], 8, em))
        ], 544),
        o.value === "Review" && !T.value ? (m(), B(zd, {
          key: 2,
          draft: n.value,
          original: c.value.declaration,
          disabled: C.value || te.value
        }, null, 8, ["draft", "original", "disabled"])) : I("", !0),
        o.value === "Review" && T.value && p.value.length ? (m(), B(pl, {
          key: 3,
          "board-id": e.boardId,
          draft: { plugins: p.value },
          schema: r.value ?? c.value,
          options: w.value?.schema_options.plugins.filter((ie) => p.value.some(($e) => $e.use === ie.plugin)) ?? [],
          configs: b.value,
          disabled: C.value,
          "activation-locked": "",
          onValidity: Q[12] || (Q[12] = (ie, $e) => Ne("pack-plugin:" + ie, $e))
        }, null, 8, ["board-id", "draft", "schema", "options", "configs", "disabled"])) : I("", !0),
        o.value === "Review" ? (m(), B(Ic, {
          key: 4,
          plan: G.value,
          generation: c.value.generation,
          follows: mt.value,
          "config-count": Object.keys(b.value).length,
          "pack-review": !!V.value
        }, {
          default: L(() => [
            V.value && T.value ? (m(), B(zc, {
              key: 0,
              plan: V.value,
              request: T.value,
              original: c.value.declaration,
              disabled: C.value,
              onChange: Q[13] || (Q[13] = (ie) => {
                P.value = void 0, re.value = "";
              })
            }, null, 8, ["plan", "request", "original", "disabled"])) : I("", !0)
          ]),
          _: 1
        }, 8, ["plan", "generation", "follows", "config-count", "pack-review"])) : I("", !0),
        o.value === "Review" && !G.value ? (m(), h("p", am, "Review your draft to see the changes, their impact and any migration required.")) : I("", !0),
        te.value ? (m(), h("p", lm, "Checking existing values and dependencies…")) : I("", !0)
      ])) : I("", !0)
    ], 2));
  }
}), im = /* @__PURE__ */ ue({
  __name: "SettingsRoot",
  setup(e) {
    const a = go(), t = ko();
    return lo(Cl, (l) => t("navigate", { route: Do(l) })), (l, o) => (m(), B(om, {
      "board-id": d(a).boardId ?? "",
      embedded: d(a).embedded
    }, null, 8, ["board-id", "embedded"]));
  }
}), nm = wo(im, {
  type: "object",
  properties: {
    "board-id": { type: "string", default: "", description: "Board to administer." },
    embedded: { type: "boolean", default: !1, description: "Fits in a System detail pane." }
  }
});
io(import.meta.url, nm);
//# sourceMappingURL=settings.js.map
