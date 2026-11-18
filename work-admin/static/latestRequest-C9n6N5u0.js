import { defineComponent as ue, openBlock as Z, createBlock as Ce, resolveDynamicComponent as Le, withCtx as Me, renderSlot as ge, ref as ee, watch as ce, onBeforeUnmount as we, createElementBlock as ne, createElementVNode as Q, toDisplayString as q, createCommentVNode as be, createVNode as Te, unref as Re, onMounted as Se, nextTick as Ae, onUnmounted as Pe } from "vue";
import De from "primevue/textarea";
import { api as ye } from "@wippy-fe/proxy";
const Qe = /* @__PURE__ */ ue({
  __name: "ContentAction",
  props: {
    as: { default: "button" },
    disabled: { type: Boolean },
    role: { default: "button" }
  },
  emits: ["activate"],
  setup(e, { emit: d }) {
    const c = e, f = d;
    function h(l) {
      if (c.disabled || l.defaultPrevented) return;
      const i = l.target;
      if (i instanceof Element && i !== l.currentTarget) {
        const n = i.closest('[data-work-action], button, a, input, textarea, [role="combobox"], [role="checkbox"], [role="switch"], details');
        if (n && n !== l.currentTarget) return;
      }
      f("activate", l);
    }
    function p(l) {
      l.target !== l.currentTarget || !["Enter", " "].includes(l.key) || (l.preventDefault(), c.disabled || f("activate", l));
    }
    return (l, i) => (Z(), Ce(Le(e.as), {
      "data-work-action": "",
      class: "work-content-action",
      type: e.as === "button" ? "button" : void 0,
      role: e.role,
      tabindex: e.disabled ? -1 : 0,
      disabled: e.as === "button" ? e.disabled : void 0,
      "aria-disabled": e.disabled || void 0,
      onClick: h,
      onKeydown: p
    }, {
      default: Me(() => [
        ge(l.$slots, "default")
      ]),
      _: 3
    }, 40, ["type", "role", "tabindex", "disabled", "aria-disabled"]));
  }
}), Fe = { class: "work-json-disclosure" }, $e = { class: "work-stack work-tight" }, Ve = {
  key: 0,
  class: "work-small work-muted"
}, Ge = {
  key: 1,
  role: "alert",
  class: "work-error"
}, Be = { class: "work-json-example" }, qe = /* @__PURE__ */ ue({
  __name: "JsonInput",
  props: {
    label: {},
    modelValue: {},
    shape: {},
    hint: {},
    example: {}
  },
  emits: ["update:modelValue", "validity"],
  setup(e, { emit: d }) {
    const c = e, f = d, h = ee(""), p = ee("");
    ce(() => c.modelValue, (i) => {
      h.value = i === void 0 ? "" : JSON.stringify(i, null, 2), p.value = "", f("validity", !0);
    }, { immediate: !0 }), we(() => f("validity", !0));
    function l(i) {
      h.value = i;
      try {
        const n = i.trim() ? JSON.parse(i) : void 0;
        if (n !== void 0 && c.shape === "object" && (!n || typeof n != "object" || Array.isArray(n))) throw new Error("Enter a JSON object.");
        if (n !== void 0 && c.shape === "array" && !Array.isArray(n)) throw new Error("Enter a JSON array.");
        p.value = "", f("update:modelValue", n), f("validity", !0);
      } catch (n) {
        p.value = n instanceof Error ? n.message : "Invalid JSON.", f("validity", !1);
      }
    }
    return (i, n) => (Z(), ne("details", Fe, [
      Q("summary", null, "Edit as JSON · " + q(e.label), 1),
      Q("label", $e, [
        Q("span", null, q(e.label), 1),
        e.hint ? (Z(), ne("span", Ve, q(e.hint), 1)) : be("", !0),
        Te(Re(De), {
          class: "work-json-input",
          rows: "3",
          "aria-label": e.label,
          value: h.value,
          "aria-invalid": !!p.value,
          onInput: n[0] || (n[0] = (t) => l(t.target.value))
        }, null, 8, ["aria-label", "value", "aria-invalid"]),
        p.value ? (Z(), ne("span", Ge, q(p.value), 1)) : be("", !0)
      ]),
      n[1] || (n[1] = Q("p", { class: "work-small work-muted" }, "Example", -1)),
      Q("pre", Be, q(JSON.stringify(e.example ?? (e.shape === "array" ? [] : {}), null, 2)), 1)
    ]));
  }
}), We = ["aria-label", "aria-busy"], Ze = /* @__PURE__ */ ue({
  __name: "NativeDialog",
  props: {
    visible: { type: Boolean },
    label: {},
    busy: { type: Boolean }
  },
  emits: ["close"],
  setup(e, { emit: d }) {
    const c = e, f = d, h = ee(null);
    let p = null;
    async function l() {
      await Ae();
      const n = h.value;
      n && (c.visible && !n.open ? (p = n.getRootNode().activeElement, n.showModal()) : !c.visible && n.open && (n.close(), p?.focus()));
    }
    function i(n) {
      n.preventDefault(), c.busy || f("close");
    }
    return ce(() => c.visible, l), Se(l), we(() => {
      h.value?.open && h.value.close(), p?.focus();
    }), (n, t) => (Z(), ne("dialog", {
      ref_key: "dialog",
      ref: h,
      class: "work-native-dialog",
      "aria-label": e.label,
      "aria-modal": "true",
      "aria-busy": e.busy || void 0,
      onCancel: i,
      onClose: t[0] || (t[0] = () => {
        e.visible && !e.busy && f("close");
      })
    }, [
      ge(n.$slots, "default")
    ], 40, We));
  }
});
class X extends Error {
  kind;
  details;
  retryable;
  status;
  constructor(d, c, f) {
    super(d.message ?? d.error ?? `${c} failed`), this.name = "ApiError", this.kind = d.kind, this.details = d.details, this.retryable = d.retryable, this.status = f;
  }
}
function ve(e, d) {
  const c = e;
  if (c && typeof c == "object" && c.success === !1) throw new X(c, d);
  if (c && typeof c == "object" && c.success === !0 && c.data !== void 0) return c.data;
  throw new X({ kind: "INTERNAL", message: `${d}: invalid response envelope`, details: { code: "response_envelope_invalid" } }, d);
}
function Ee(e, d) {
  if (e instanceof X) return e;
  const c = e?.response;
  return c?.data ? new X(c.data, d, c.status) : e instanceof Error ? e : new X({ kind: "Unavailable" }, d);
}
async function le(e, d, c) {
  try {
    return ve((await ye.get(e, { params: c })).data, d);
  } catch (f) {
    throw Ee(f, d);
  }
}
async function H(e, d, c) {
  try {
    return ve((await ye.post(e, d)).data, c);
  } catch (f) {
    throw Ee(f, c);
  }
}
const re = "/api/v1/work", te = (e) => `${re}/boards/${encodeURIComponent(e)}`, et = {
  boards: async () => {
    const e = [];
    let d;
    do {
      const c = await le(`${re}/boards${d ? "?after=" + encodeURIComponent(d) : ""}`, "Boards");
      e.push(...c.boards), d = c.next;
    } while (d);
    return e;
  },
  packs: () => le(`${re}/packs`, "Packs").then((e) => e.packs),
  createBoard: (e, d, c, f = {}) => H(`${re}/boards`, { title: e, declaration: d, idempotency_key: c, ...f }, "Create board"),
  updateBoard: (e, d) => H(`${te(e)}/update`, d, "Update board"),
  schema: (e, d, c) => H(`${te(e)}/get_schema`, { generation: d, ...c ? { check_plugins: !0 } : {} }, "Schema"),
  // Typed operands in conditions and transition assignments can select an item.
  query: (e, d) => H(`${te(e)}/query`, d, "Item choices"),
  item: (e, d) => H(`${te(e)}/get`, { item: d }, "Item choice"),
  options: (e) => le(`/api/v1/work-admin/boards/${encodeURIComponent(e)}/options`, "Configuration options")
};
function tt(e) {
  return e && typeof e == "object" && !Array.isArray(e) ? e : {};
}
const se = (e) => /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}|^[\w.]+:[\w.]+$/i.test(e), de = /* @__PURE__ */ new Map();
function ie(e, d = /* @__PURE__ */ new Map()) {
  if (Array.isArray(e)) return e.map((f) => ie(f, d)).join(", ");
  if (typeof e == "string") return d.get("user:" + e) ?? (/^[^@\s]+@[^@\s]+$/.test(e) ? e : "Unavailable person");
  if (!e || typeof e != "object") return e ? "Unknown person" : "—";
  const c = e;
  for (const f of ["display_name", "displayName", "name", "label"]) if (typeof c[f] == "string" && c[f] && !se(c[f])) return c[f];
  return d.get(`${c.kind ?? "user"}:${c.id}`) ?? (typeof c.email == "string" && c.email ? c.email : c.kind === "group" ? "Unavailable group" : typeof c.id == "string" ? ie(c.id, d) : "Unavailable person");
}
async function Ue(e, d) {
  const c = [...new Map(d.map((i) => [`${i.kind}:${i.id}`, { type: i.kind, id: i.id }])).values()].sort((i, n) => `${i.type}:${i.id}`.localeCompare(`${n.type}:${n.id}`)), f = JSON.stringify([e, c]), h = de.get(f);
  if (h) return h;
  const l = (async () => {
    const i = /* @__PURE__ */ new Map();
    for (let n = 0; n < c.length; n += 200) {
      const t = await H(`/api/v1/work-admin/boards/${encodeURIComponent(e)}/principal_labels`, { refs: c.slice(n, n + 200) }, "Display names");
      for (const a of t.principals) a.label.trim() && !se(a.label) && a.label !== a.id && i.set(`${a.type}:${a.id}`, a.label.trim());
    }
    return i;
  })();
  de.set(f, l);
  try {
    return await l;
  } finally {
    de.delete(f);
  }
}
function Ye(e, d) {
  const c = ee(/* @__PURE__ */ new Map()), f = ee("");
  let h = 0;
  return ce([e, d], async ([p, l]) => {
    const i = ++h;
    if (c.value = /* @__PURE__ */ new Map(), f.value = "", !(!p || !l.length))
      try {
        const n = await Ue(p, l);
        i === h && (c.value = n);
      } catch (n) {
        i === h && (f.value = n instanceof Error ? n.message : "Display names are unavailable.");
      }
  }, { immediate: !0, deep: !0 }), Pe(() => {
    h++, c.value.clear();
  }), {
    labels: c,
    error: f,
    label: (p) => ie(p, c.value),
    remember: (p, l) => {
      l.trim() && !se(l) && l !== p.id && c.value.set(`${p.kind}:${p.id}`, l.trim());
    }
  };
}
function fe(e) {
  if (se(e)) return "Untitled";
  const d = e.replace(/[_-]+/g, " ");
  return d.charAt(0).toUpperCase() + d.slice(1);
}
function nt(e) {
  return e.title?.trim() || fe(e.code);
}
function ke(e, d, c = ie) {
  return e == null ? "—" : d?.type === "principal" ? c(e) : Array.isArray(e) ? e.map((f) => ke(f, d, c)).join(", ") : d?.type === "option" && typeof e == "string" ? d.options?.find((f) => f.id === e)?.label || fe(e) : typeof e == "boolean" ? e ? "Yes" : "No" : typeof e == "object" ? (d?.form === "ref" || d?.type === "item") && "unavailable" in e ? "Unavailable" : d?.form === "dec" && "m" in e && "e" in e && typeof e.m == "number" && typeof e.e == "number" ? (e.m * 10 ** e.e).toFixed(Math.max(0, -e.e)) : d?.form === "ref" && "ref" in e && Array.isArray(e.ref) || d?.form === "ref" && "id" in e && typeof e.id == "string" || d?.type === "item" && "item" in e && typeof e.item == "string" ? "Linked item" : JSON.stringify(e) : String(e);
}
function rt(e) {
  return ["formula", "rollup", "counter", "rank"].includes(e.type ?? "");
}
function it(e, d) {
  const c = Ye(e, d);
  return {
    display: (f, h) => ke(f, h, c.label),
    principalLabel: c.label,
    rememberPrincipal: c.remember,
    nameError: c.error,
    nameLabels: c.labels
  };
}
/*! @license MIT — @dagrejs/dagre 1.1.8 and @dagrejs/graphlib 2.2.4
Copyright (c) 2012-2014 Chris Pettitt

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/
const st = (function() {
  return (/* @__PURE__ */ (function() {
    function e(d, c, f) {
      function h(i, n) {
        if (!c[i]) {
          if (!d[i]) {
            var t = typeof require == "function" && require;
            if (!n && t) return t(i, !0);
            if (p) return p(i, !0);
            var a = new Error("Cannot find module '" + i + "'");
            throw a.code = "MODULE_NOT_FOUND", a;
          }
          var o = c[i] = { exports: {} };
          d[i][0].call(o.exports, function(u) {
            var r = d[i][1][u];
            return h(r || u);
          }, o, o.exports, e, d, c, f);
        }
        return c[i].exports;
      }
      for (var p = typeof require == "function" && require, l = 0; l < f.length; l++) h(f[l]);
      return h;
    }
    return e;
  })())({ 1: [function(e, d, c) {
    d.exports = { graphlib: e("@dagrejs/graphlib"), layout: e("./lib/layout"), debug: e("./lib/debug"), util: { time: e("./lib/util").time, notime: e("./lib/util").notime }, version: e("./lib/version") };
  }, { "./lib/debug": 6, "./lib/layout": 8, "./lib/util": 27, "./lib/version": 28, "@dagrejs/graphlib": 29 }], 2: [function(e, d, c) {
    let f = e("./greedy-fas"), h = e("./util").uniqueId;
    d.exports = { run: p, undo: i };
    function p(n) {
      (n.graph().acyclicer === "greedy" ? f(n, a(n)) : l(n)).forEach((o) => {
        let u = n.edge(o);
        n.removeEdge(o), u.forwardName = o.name, u.reversed = !0, n.setEdge(o.w, o.v, u, h("rev"));
      });
      function a(o) {
        return (u) => o.edge(u).weight;
      }
    }
    function l(n) {
      let t = [], a = {}, o = {};
      function u(r) {
        Object.hasOwn(o, r) || (o[r] = !0, a[r] = !0, n.outEdges(r).forEach((s) => {
          Object.hasOwn(a, s.w) ? t.push(s) : u(s.w);
        }), delete a[r]);
      }
      return n.nodes().forEach(u), t;
    }
    function i(n) {
      n.edges().forEach((t) => {
        let a = n.edge(t);
        if (a.reversed) {
          n.removeEdge(t);
          let o = a.forwardName;
          delete a.reversed, delete a.forwardName, n.setEdge(t.w, t.v, a, o);
        }
      });
    }
  }, { "./greedy-fas": 7, "./util": 27 }], 3: [function(e, d, c) {
    let f = e("./util");
    d.exports = h;
    function h(l) {
      function i(n) {
        let t = l.children(n), a = l.node(n);
        if (t.length && t.forEach(i), Object.hasOwn(a, "minRank")) {
          a.borderLeft = [], a.borderRight = [];
          for (let o = a.minRank, u = a.maxRank + 1; o < u; ++o)
            p(l, "borderLeft", "_bl", n, a, o), p(l, "borderRight", "_br", n, a, o);
        }
      }
      l.children().forEach(i);
    }
    function p(l, i, n, t, a, o) {
      let u = { width: 0, height: 0, rank: o, borderType: i }, r = a[i][o - 1], s = f.addDummyNode(l, "border", u, n);
      a[i][o] = s, l.setParent(s, t), r && l.setEdge(r, s, { weight: 1 });
    }
  }, { "./util": 27 }], 4: [function(e, d, c) {
    d.exports = { adjust: f, undo: h };
    function f(o) {
      let u = o.graph().rankdir.toLowerCase();
      (u === "lr" || u === "rl") && p(o);
    }
    function h(o) {
      let u = o.graph().rankdir.toLowerCase();
      (u === "bt" || u === "rl") && i(o), (u === "lr" || u === "rl") && (t(o), p(o));
    }
    function p(o) {
      o.nodes().forEach((u) => l(o.node(u))), o.edges().forEach((u) => l(o.edge(u)));
    }
    function l(o) {
      let u = o.width;
      o.width = o.height, o.height = u;
    }
    function i(o) {
      o.nodes().forEach((u) => n(o.node(u))), o.edges().forEach((u) => {
        let r = o.edge(u);
        r.points.forEach(n), Object.hasOwn(r, "y") && n(r);
      });
    }
    function n(o) {
      o.y = -o.y;
    }
    function t(o) {
      o.nodes().forEach((u) => a(o.node(u))), o.edges().forEach((u) => {
        let r = o.edge(u);
        r.points.forEach(a), Object.hasOwn(r, "x") && a(r);
      });
    }
    function a(o) {
      let u = o.x;
      o.x = o.y, o.y = u;
    }
  }, {}], 5: [function(e, d, c) {
    class f {
      constructor() {
        let i = {};
        i._next = i._prev = i, this._sentinel = i;
      }
      dequeue() {
        let i = this._sentinel, n = i._prev;
        if (n !== i)
          return h(n), n;
      }
      enqueue(i) {
        let n = this._sentinel;
        i._prev && i._next && h(i), i._next = n._next, n._next._prev = i, n._next = i, i._prev = n;
      }
      toString() {
        let i = [], n = this._sentinel, t = n._prev;
        for (; t !== n; )
          i.push(JSON.stringify(t, p)), t = t._prev;
        return "[" + i.join(", ") + "]";
      }
    }
    function h(l) {
      l._prev._next = l._next, l._next._prev = l._prev, delete l._next, delete l._prev;
    }
    function p(l, i) {
      if (l !== "_next" && l !== "_prev")
        return i;
    }
    d.exports = f;
  }, {}], 6: [function(e, d, c) {
    let f = e("./util"), h = e("@dagrejs/graphlib").Graph;
    d.exports = { debugOrdering: p };
    function p(l) {
      let i = f.buildLayerMatrix(l), n = new h({ compound: !0, multigraph: !0 }).setGraph({});
      return l.nodes().forEach((t) => {
        n.setNode(t, { label: t }), n.setParent(t, "layer" + l.node(t).rank);
      }), l.edges().forEach((t) => n.setEdge(t.v, t.w, {}, t.name)), i.forEach((t, a) => {
        let o = "layer" + a;
        n.setNode(o, { rank: "same" }), t.reduce((u, r) => (n.setEdge(u, r, { style: "invis" }), r));
      }), n;
    }
  }, { "./util": 27, "@dagrejs/graphlib": 29 }], 7: [function(e, d, c) {
    let f = e("@dagrejs/graphlib").Graph, h = e("./data/list");
    d.exports = l;
    let p = () => 1;
    function l(u, r) {
      if (u.nodeCount() <= 1)
        return [];
      let s = t(u, r || p);
      return i(s.graph, s.buckets, s.zeroIdx).flatMap((b) => u.outEdges(b.v, b.w));
    }
    function i(u, r, s) {
      let m = [], b = r[r.length - 1], k = r[0], L;
      for (; u.nodeCount(); ) {
        for (; L = k.dequeue(); )
          n(u, r, s, L);
        for (; L = b.dequeue(); )
          n(u, r, s, L);
        if (u.nodeCount()) {
          for (let w = r.length - 2; w > 0; --w)
            if (L = r[w].dequeue(), L) {
              m = m.concat(n(u, r, s, L, !0));
              break;
            }
        }
      }
      return m;
    }
    function n(u, r, s, m, b) {
      let k = b ? [] : void 0;
      return u.inEdges(m.v).forEach((L) => {
        let w = u.edge(L), x = u.node(L.v);
        b && k.push({ v: L.v, w: L.w }), x.out -= w, a(r, s, x);
      }), u.outEdges(m.v).forEach((L) => {
        let w = u.edge(L), x = L.w, y = u.node(x);
        y.in -= w, a(r, s, y);
      }), u.removeNode(m.v), k;
    }
    function t(u, r) {
      let s = new f(), m = 0, b = 0;
      u.nodes().forEach((w) => {
        s.setNode(w, { v: w, in: 0, out: 0 });
      }), u.edges().forEach((w) => {
        let x = s.edge(w.v, w.w) || 0, y = r(w), j = x + y;
        s.setEdge(w.v, w.w, j), b = Math.max(b, s.node(w.v).out += y), m = Math.max(m, s.node(w.w).in += y);
      });
      let k = o(b + m + 3).map(() => new h()), L = m + 1;
      return s.nodes().forEach((w) => {
        a(k, L, s.node(w));
      }), { graph: s, buckets: k, zeroIdx: L };
    }
    function a(u, r, s) {
      s.out ? s.in ? u[s.out - s.in + r].enqueue(s) : u[u.length - 1].enqueue(s) : u[0].enqueue(s);
    }
    function o(u) {
      const r = [];
      for (let s = 0; s < u; s++)
        r.push(s);
      return r;
    }
  }, { "./data/list": 5, "@dagrejs/graphlib": 29 }], 8: [function(e, d, c) {
    let f = e("./acyclic"), h = e("./normalize"), p = e("./rank"), l = e("./util").normalizeRanks, i = e("./parent-dummy-chains"), n = e("./util").removeEmptyRanks, t = e("./nesting-graph"), a = e("./add-border-segments"), o = e("./coordinate-system"), u = e("./order"), r = e("./position"), s = e("./util"), m = e("@dagrejs/graphlib").Graph;
    d.exports = b;
    function b(E, O) {
      let I = O && O.debugTiming ? s.time : s.notime;
      I("layout", () => {
        let S = I("  buildLayoutGraph", () => g(E));
        I("  runLayout", () => k(S, I, O)), I("  updateInputGraph", () => L(E, S));
      });
    }
    function k(E, O, I) {
      O("    makeSpaceForEdgeLabels", () => v(E)), O("    removeSelfEdges", () => Ne(E)), O("    acyclic", () => f.run(E)), O("    nestingGraph.run", () => t.run(E)), O("    rank", () => p(s.asNonCompoundGraph(E))), O("    injectEdgeLabelProxies", () => _(E)), O("    removeEmptyRanks", () => n(E)), O("    nestingGraph.cleanup", () => t.cleanup(E)), O("    normalizeRanks", () => l(E)), O("    assignRankMinMax", () => N(E)), O("    removeEdgeLabelProxies", () => M(E)), O("    normalize.run", () => h.run(E)), O("    parentDummyChains", () => i(E)), O("    addBorderSegments", () => a(E)), O("    order", () => u(E, I)), O("    insertSelfEdges", () => je(E)), O("    adjustCoordinateSystem", () => o.adjust(E)), O("    position", () => r(E)), O("    positionSelfEdges", () => Ie(E)), O("    removeBorderNodes", () => z(E)), O("    normalize.undo", () => h.undo(E)), O("    fixupEdgeLabelCoords", () => V(E)), O("    undoCoordinateSystem", () => o.undo(E)), O("    translateGraph", () => P(E)), O("    assignNodeIntersects", () => D(E)), O("    reversePoints", () => Y(E)), O("    acyclic.undo", () => f.undo(E));
    }
    function L(E, O) {
      E.nodes().forEach((I) => {
        let S = E.node(I), F = O.node(I);
        S && (S.x = F.x, S.y = F.y, S.rank = F.rank, O.children(I).length && (S.width = F.width, S.height = F.height));
      }), E.edges().forEach((I) => {
        let S = E.edge(I), F = O.edge(I);
        S.points = F.points, Object.hasOwn(F, "x") && (S.x = F.x, S.y = F.y);
      }), E.graph().width = O.graph().width, E.graph().height = O.graph().height;
    }
    let w = ["nodesep", "edgesep", "ranksep", "marginx", "marginy"], x = { ranksep: 50, edgesep: 20, nodesep: 50, rankdir: "tb" }, y = ["acyclicer", "ranker", "rankdir", "align"], j = ["width", "height", "rank"], C = { width: 0, height: 0 }, T = ["minlen", "weight", "width", "height", "labeloffset"], R = { minlen: 1, weight: 1, width: 0, height: 0, labeloffset: 10, labelpos: "r" }, A = ["labelpos"];
    function g(E) {
      let O = new m({ multigraph: !0, compound: !0 }), I = ae(E.graph());
      return O.setGraph(Object.assign({}, x, oe(I, w), s.pick(I, y))), E.nodes().forEach((S) => {
        let F = ae(E.node(S));
        const $ = oe(F, j);
        Object.keys(C).forEach((G) => {
          $[G] === void 0 && ($[G] = C[G]);
        }), O.setNode(S, $), O.setParent(S, E.parent(S));
      }), E.edges().forEach((S) => {
        let F = ae(E.edge(S));
        O.setEdge(S, Object.assign({}, R, oe(F, T), s.pick(F, A)));
      }), O;
    }
    function v(E) {
      let O = E.graph();
      O.ranksep /= 2, E.edges().forEach((I) => {
        let S = E.edge(I);
        S.minlen *= 2, S.labelpos.toLowerCase() !== "c" && (O.rankdir === "TB" || O.rankdir === "BT" ? S.width += S.labeloffset : S.height += S.labeloffset);
      });
    }
    function _(E) {
      E.edges().forEach((O) => {
        let I = E.edge(O);
        if (I.width && I.height) {
          let S = E.node(O.v), $ = { rank: (E.node(O.w).rank - S.rank) / 2 + S.rank, e: O };
          s.addDummyNode(E, "edge-proxy", $, "_ep");
        }
      });
    }
    function N(E) {
      let O = 0;
      E.nodes().forEach((I) => {
        let S = E.node(I);
        S.borderTop && (S.minRank = E.node(S.borderTop).rank, S.maxRank = E.node(S.borderBottom).rank, O = Math.max(O, S.maxRank));
      }), E.graph().maxRank = O;
    }
    function M(E) {
      E.nodes().forEach((O) => {
        let I = E.node(O);
        I.dummy === "edge-proxy" && (E.edge(I.e).labelRank = I.rank, E.removeNode(O));
      });
    }
    function P(E) {
      let O = Number.POSITIVE_INFINITY, I = 0, S = Number.POSITIVE_INFINITY, F = 0, $ = E.graph(), G = $.marginx || 0, W = $.marginy || 0;
      function he(U) {
        let B = U.x, K = U.y, pe = U.width, me = U.height;
        O = Math.min(O, B - pe / 2), I = Math.max(I, B + pe / 2), S = Math.min(S, K - me / 2), F = Math.max(F, K + me / 2);
      }
      E.nodes().forEach((U) => he(E.node(U))), E.edges().forEach((U) => {
        let B = E.edge(U);
        Object.hasOwn(B, "x") && he(B);
      }), O -= G, S -= W, E.nodes().forEach((U) => {
        let B = E.node(U);
        B.x -= O, B.y -= S;
      }), E.edges().forEach((U) => {
        let B = E.edge(U);
        B.points.forEach((K) => {
          K.x -= O, K.y -= S;
        }), Object.hasOwn(B, "x") && (B.x -= O), Object.hasOwn(B, "y") && (B.y -= S);
      }), $.width = I - O + G, $.height = F - S + W;
    }
    function D(E) {
      E.edges().forEach((O) => {
        let I = E.edge(O), S = E.node(O.v), F = E.node(O.w), $, G;
        I.points ? ($ = I.points[0], G = I.points[I.points.length - 1]) : (I.points = [], $ = F, G = S), I.points.unshift(s.intersectRect(S, $)), I.points.push(s.intersectRect(F, G));
      });
    }
    function V(E) {
      E.edges().forEach((O) => {
        let I = E.edge(O);
        if (Object.hasOwn(I, "x"))
          switch ((I.labelpos === "l" || I.labelpos === "r") && (I.width -= I.labeloffset), I.labelpos) {
            case "l":
              I.x -= I.width / 2 + I.labeloffset;
              break;
            case "r":
              I.x += I.width / 2 + I.labeloffset;
              break;
          }
      });
    }
    function Y(E) {
      E.edges().forEach((O) => {
        let I = E.edge(O);
        I.reversed && I.points.reverse();
      });
    }
    function z(E) {
      E.nodes().forEach((O) => {
        if (E.children(O).length) {
          let I = E.node(O), S = E.node(I.borderTop), F = E.node(I.borderBottom), $ = E.node(I.borderLeft[I.borderLeft.length - 1]), G = E.node(I.borderRight[I.borderRight.length - 1]);
          I.width = Math.abs(G.x - $.x), I.height = Math.abs(F.y - S.y), I.x = $.x + I.width / 2, I.y = S.y + I.height / 2;
        }
      }), E.nodes().forEach((O) => {
        E.node(O).dummy === "border" && E.removeNode(O);
      });
    }
    function Ne(E) {
      E.edges().forEach((O) => {
        if (O.v === O.w) {
          var I = E.node(O.v);
          I.selfEdges || (I.selfEdges = []), I.selfEdges.push({ e: O, label: E.edge(O) }), E.removeEdge(O);
        }
      });
    }
    function je(E) {
      var O = s.buildLayerMatrix(E);
      O.forEach((I) => {
        var S = 0;
        I.forEach((F, $) => {
          var G = E.node(F);
          G.order = $ + S, (G.selfEdges || []).forEach((W) => {
            s.addDummyNode(E, "selfedge", { width: W.label.width, height: W.label.height, rank: G.rank, order: $ + ++S, e: W.e, label: W.label }, "_se");
          }), delete G.selfEdges;
        });
      });
    }
    function Ie(E) {
      E.nodes().forEach((O) => {
        var I = E.node(O);
        if (I.dummy === "selfedge") {
          var S = E.node(I.e.v), F = S.x + S.width / 2, $ = S.y, G = I.x - F, W = S.height / 2;
          E.setEdge(I.e, I.label), E.removeNode(O), I.label.points = [{ x: F + 2 * G / 3, y: $ - W }, { x: F + 5 * G / 6, y: $ - W }, { x: F + G, y: $ }, { x: F + 5 * G / 6, y: $ + W }, { x: F + 2 * G / 3, y: $ + W }], I.label.x = I.x, I.label.y = I.y;
        }
      });
    }
    function oe(E, O) {
      return s.mapValues(s.pick(E, O), Number);
    }
    function ae(E) {
      var O = {};
      return E && Object.entries(E).forEach(([I, S]) => {
        typeof I == "string" && (I = I.toLowerCase()), O[I] = S;
      }), O;
    }
  }, { "./acyclic": 2, "./add-border-segments": 3, "./coordinate-system": 4, "./nesting-graph": 9, "./normalize": 10, "./order": 15, "./parent-dummy-chains": 20, "./position": 22, "./rank": 24, "./util": 27, "@dagrejs/graphlib": 29 }], 9: [function(e, d, c) {
    let f = e("./util");
    d.exports = { run: h, cleanup: n };
    function h(t) {
      let a = f.addDummyNode(t, "root", {}, "_root"), o = l(t), u = Object.values(o), r = f.applyWithChunking(Math.max, u) - 1, s = 2 * r + 1;
      t.graph().nestingRoot = a, t.edges().forEach((b) => t.edge(b).minlen *= s);
      let m = i(t) + 1;
      t.children().forEach((b) => p(t, a, s, m, r, o, b)), t.graph().nodeRankFactor = s;
    }
    function p(t, a, o, u, r, s, m) {
      let b = t.children(m);
      if (!b.length) {
        m !== a && t.setEdge(a, m, { weight: 0, minlen: o });
        return;
      }
      let k = f.addBorderNode(t, "_bt"), L = f.addBorderNode(t, "_bb"), w = t.node(m);
      t.setParent(k, m), w.borderTop = k, t.setParent(L, m), w.borderBottom = L, b.forEach((x) => {
        p(t, a, o, u, r, s, x);
        let y = t.node(x), j = y.borderTop ? y.borderTop : x, C = y.borderBottom ? y.borderBottom : x, T = y.borderTop ? u : 2 * u, R = j !== C ? 1 : r - s[m] + 1;
        t.setEdge(k, j, { weight: T, minlen: R, nestingEdge: !0 }), t.setEdge(C, L, { weight: T, minlen: R, nestingEdge: !0 });
      }), t.parent(m) || t.setEdge(a, k, { weight: 0, minlen: r + s[m] });
    }
    function l(t) {
      var a = {};
      function o(u, r) {
        var s = t.children(u);
        s && s.length && s.forEach((m) => o(m, r + 1)), a[u] = r;
      }
      return t.children().forEach((u) => o(u, 1)), a;
    }
    function i(t) {
      return t.edges().reduce((a, o) => a + t.edge(o).weight, 0);
    }
    function n(t) {
      var a = t.graph();
      t.removeNode(a.nestingRoot), delete a.nestingRoot, t.edges().forEach((o) => {
        var u = t.edge(o);
        u.nestingEdge && t.removeEdge(o);
      });
    }
  }, { "./util": 27 }], 10: [function(e, d, c) {
    let f = e("./util");
    d.exports = { run: h, undo: l };
    function h(i) {
      i.graph().dummyChains = [], i.edges().forEach((n) => p(i, n));
    }
    function p(i, n) {
      let t = n.v, a = i.node(t).rank, o = n.w, u = i.node(o).rank, r = n.name, s = i.edge(n), m = s.labelRank;
      if (u === a + 1) return;
      i.removeEdge(n);
      let b, k, L;
      for (L = 0, ++a; a < u; ++L, ++a)
        s.points = [], k = { width: 0, height: 0, edgeLabel: s, edgeObj: n, rank: a }, b = f.addDummyNode(i, "edge", k, "_d"), a === m && (k.width = s.width, k.height = s.height, k.dummy = "edge-label", k.labelpos = s.labelpos), i.setEdge(t, b, { weight: s.weight }, r), L === 0 && i.graph().dummyChains.push(b), t = b;
      i.setEdge(t, o, { weight: s.weight }, r);
    }
    function l(i) {
      i.graph().dummyChains.forEach((n) => {
        let t = i.node(n), a = t.edgeLabel, o;
        for (i.setEdge(t.edgeObj, a); t.dummy; )
          o = i.successors(n)[0], i.removeNode(n), a.points.push({ x: t.x, y: t.y }), t.dummy === "edge-label" && (a.x = t.x, a.y = t.y, a.width = t.width, a.height = t.height), n = o, t = i.node(n);
      });
    }
  }, { "./util": 27 }], 11: [function(e, d, c) {
    d.exports = f;
    function f(h, p, l) {
      let i = {}, n;
      l.forEach((t) => {
        let a = h.parent(t), o, u;
        for (; a; ) {
          if (o = h.parent(a), o ? (u = i[o], i[o] = a) : (u = n, n = a), u && u !== a) {
            p.setEdge(u, a);
            return;
          }
          a = o;
        }
      });
    }
  }, {}], 12: [function(e, d, c) {
    d.exports = f;
    function f(h, p = []) {
      return p.map((l) => {
        let i = h.inEdges(l);
        if (i.length) {
          let n = i.reduce((t, a) => {
            let o = h.edge(a), u = h.node(a.v);
            return { sum: t.sum + o.weight * u.order, weight: t.weight + o.weight };
          }, { sum: 0, weight: 0 });
          return { v: l, barycenter: n.sum / n.weight, weight: n.weight };
        } else
          return { v: l };
      });
    }
  }, {}], 13: [function(e, d, c) {
    let f = e("@dagrejs/graphlib").Graph, h = e("../util");
    d.exports = p;
    function p(i, n, t, a) {
      a || (a = i.nodes());
      let o = l(i), u = new f({ compound: !0 }).setGraph({ root: o }).setDefaultNodeLabel((r) => i.node(r));
      return a.forEach((r) => {
        let s = i.node(r), m = i.parent(r);
        (s.rank === n || s.minRank <= n && n <= s.maxRank) && (u.setNode(r), u.setParent(r, m || o), i[t](r).forEach((b) => {
          let k = b.v === r ? b.w : b.v, L = u.edge(k, r), w = L !== void 0 ? L.weight : 0;
          u.setEdge(k, r, { weight: i.edge(b).weight + w });
        }), Object.hasOwn(s, "minRank") && u.setNode(r, { borderLeft: s.borderLeft[n], borderRight: s.borderRight[n] }));
      }), u;
    }
    function l(i) {
      for (var n; i.hasNode(n = h.uniqueId("_root")); ) ;
      return n;
    }
  }, { "../util": 27, "@dagrejs/graphlib": 29 }], 14: [function(e, d, c) {
    let f = e("../util").zipObject;
    d.exports = h;
    function h(l, i) {
      let n = 0;
      for (let t = 1; t < i.length; ++t)
        n += p(l, i[t - 1], i[t]);
      return n;
    }
    function p(l, i, n) {
      let t = f(n, n.map((m, b) => b)), a = i.flatMap((m) => l.outEdges(m).map((b) => ({ pos: t[b.w], weight: l.edge(b).weight })).sort((b, k) => b.pos - k.pos)), o = 1;
      for (; o < n.length; ) o <<= 1;
      let u = 2 * o - 1;
      o -= 1;
      let r = new Array(u).fill(0), s = 0;
      return a.forEach((m) => {
        let b = m.pos + o;
        r[b] += m.weight;
        let k = 0;
        for (; b > 0; )
          b % 2 && (k += r[b + 1]), b = b - 1 >> 1, r[b] += m.weight;
        s += m.weight * k;
      }), s;
    }
  }, { "../util": 27 }], 15: [function(e, d, c) {
    let f = e("./init-order"), h = e("./cross-count"), p = e("./sort-subgraph"), l = e("./build-layer-graph"), i = e("./add-subgraph-constraints"), n = e("@dagrejs/graphlib").Graph, t = e("../util");
    d.exports = a;
    function a(s, m) {
      if (m && typeof m.customOrder == "function") {
        m.customOrder(s, a);
        return;
      }
      let b = t.maxRank(s), k = o(s, t.range(1, b + 1), "inEdges"), L = o(s, t.range(b - 1, -1, -1), "outEdges"), w = f(s);
      if (r(s, w), m && m.disableOptimalOrderHeuristic)
        return;
      let x = Number.POSITIVE_INFINITY, y;
      for (let j = 0, C = 0; C < 4; ++j, ++C) {
        u(j % 2 ? k : L, j % 4 >= 2), w = t.buildLayerMatrix(s);
        let T = h(s, w);
        T < x && (C = 0, y = Object.assign({}, w), x = T);
      }
      r(s, y);
    }
    function o(s, m, b) {
      const k = /* @__PURE__ */ new Map(), L = (w, x) => {
        k.has(w) || k.set(w, []), k.get(w).push(x);
      };
      for (const w of s.nodes()) {
        const x = s.node(w);
        if (typeof x.rank == "number" && L(x.rank, w), typeof x.minRank == "number" && typeof x.maxRank == "number")
          for (let y = x.minRank; y <= x.maxRank; y++)
            y !== x.rank && L(y, w);
      }
      return m.map(function(w) {
        return l(s, w, b, k.get(w) || []);
      });
    }
    function u(s, m) {
      let b = new n();
      s.forEach(function(k) {
        let L = k.graph().root, w = p(k, L, b, m);
        w.vs.forEach((x, y) => k.node(x).order = y), i(k, b, w.vs);
      });
    }
    function r(s, m) {
      Object.values(m).forEach((b) => b.forEach((k, L) => s.node(k).order = L));
    }
  }, { "../util": 27, "./add-subgraph-constraints": 11, "./build-layer-graph": 13, "./cross-count": 14, "./init-order": 16, "./sort-subgraph": 18, "@dagrejs/graphlib": 29 }], 16: [function(e, d, c) {
    let f = e("../util");
    d.exports = h;
    function h(p) {
      let l = {}, i = p.nodes().filter((r) => !p.children(r).length), n = i.map((r) => p.node(r).rank), t = f.applyWithChunking(Math.max, n), a = f.range(t + 1).map(() => []);
      function o(r) {
        if (l[r]) return;
        l[r] = !0;
        let s = p.node(r);
        a[s.rank].push(r), p.successors(r).forEach(o);
      }
      return i.sort((r, s) => p.node(r).rank - p.node(s).rank).forEach(o), a;
    }
  }, { "../util": 27 }], 17: [function(e, d, c) {
    let f = e("../util");
    d.exports = h;
    function h(i, n) {
      let t = {};
      i.forEach((o, u) => {
        let r = t[o.v] = { indegree: 0, in: [], out: [], vs: [o.v], i: u };
        o.barycenter !== void 0 && (r.barycenter = o.barycenter, r.weight = o.weight);
      }), n.edges().forEach((o) => {
        let u = t[o.v], r = t[o.w];
        u !== void 0 && r !== void 0 && (r.indegree++, u.out.push(t[o.w]));
      });
      let a = Object.values(t).filter((o) => !o.indegree);
      return p(a);
    }
    function p(i) {
      let n = [];
      function t(o) {
        return (u) => {
          u.merged || (u.barycenter === void 0 || o.barycenter === void 0 || u.barycenter >= o.barycenter) && l(o, u);
        };
      }
      function a(o) {
        return (u) => {
          u.in.push(o), --u.indegree === 0 && i.push(u);
        };
      }
      for (; i.length; ) {
        let o = i.pop();
        n.push(o), o.in.reverse().forEach(t(o)), o.out.forEach(a(o));
      }
      return n.filter((o) => !o.merged).map((o) => f.pick(o, ["vs", "i", "barycenter", "weight"]));
    }
    function l(i, n) {
      let t = 0, a = 0;
      i.weight && (t += i.barycenter * i.weight, a += i.weight), n.weight && (t += n.barycenter * n.weight, a += n.weight), i.vs = n.vs.concat(i.vs), i.barycenter = t / a, i.weight = a, i.i = Math.min(n.i, i.i), n.merged = !0;
    }
  }, { "../util": 27 }], 18: [function(e, d, c) {
    let f = e("./barycenter"), h = e("./resolve-conflicts"), p = e("./sort");
    d.exports = l;
    function l(t, a, o, u) {
      let r = t.children(a), s = t.node(a), m = s ? s.borderLeft : void 0, b = s ? s.borderRight : void 0, k = {};
      m && (r = r.filter((y) => y !== m && y !== b));
      let L = f(t, r);
      L.forEach((y) => {
        if (t.children(y.v).length) {
          let j = l(t, y.v, o, u);
          k[y.v] = j, Object.hasOwn(j, "barycenter") && n(y, j);
        }
      });
      let w = h(L, o);
      i(w, k);
      let x = p(w, u);
      if (m && (x.vs = [m, x.vs, b].flat(!0), t.predecessors(m).length)) {
        let y = t.node(t.predecessors(m)[0]), j = t.node(t.predecessors(b)[0]);
        Object.hasOwn(x, "barycenter") || (x.barycenter = 0, x.weight = 0), x.barycenter = (x.barycenter * x.weight + y.order + j.order) / (x.weight + 2), x.weight += 2;
      }
      return x;
    }
    function i(t, a) {
      t.forEach((o) => {
        o.vs = o.vs.flatMap((u) => a[u] ? a[u].vs : u);
      });
    }
    function n(t, a) {
      t.barycenter !== void 0 ? (t.barycenter = (t.barycenter * t.weight + a.barycenter * a.weight) / (t.weight + a.weight), t.weight += a.weight) : (t.barycenter = a.barycenter, t.weight = a.weight);
    }
  }, { "./barycenter": 12, "./resolve-conflicts": 17, "./sort": 19 }], 19: [function(e, d, c) {
    let f = e("../util");
    d.exports = h;
    function h(i, n) {
      let t = f.partition(i, (k) => Object.hasOwn(k, "barycenter")), a = t.lhs, o = t.rhs.sort((k, L) => L.i - k.i), u = [], r = 0, s = 0, m = 0;
      a.sort(l(!!n)), m = p(u, o, m), a.forEach((k) => {
        m += k.vs.length, u.push(k.vs), r += k.barycenter * k.weight, s += k.weight, m = p(u, o, m);
      });
      let b = { vs: u.flat(!0) };
      return s && (b.barycenter = r / s, b.weight = s), b;
    }
    function p(i, n, t) {
      let a;
      for (; n.length && (a = n[n.length - 1]).i <= t; )
        n.pop(), i.push(a.vs), t++;
      return t;
    }
    function l(i) {
      return (n, t) => n.barycenter < t.barycenter ? -1 : n.barycenter > t.barycenter ? 1 : i ? t.i - n.i : n.i - t.i;
    }
  }, { "../util": 27 }], 20: [function(e, d, c) {
    d.exports = f;
    function f(l) {
      let i = p(l);
      l.graph().dummyChains.forEach((n) => {
        let t = l.node(n), a = t.edgeObj, o = h(l, i, a.v, a.w), u = o.path, r = o.lca, s = 0, m = u[s], b = !0;
        for (; n !== a.w; ) {
          if (t = l.node(n), b) {
            for (; (m = u[s]) !== r && l.node(m).maxRank < t.rank; )
              s++;
            m === r && (b = !1);
          }
          if (!b) {
            for (; s < u.length - 1 && l.node(m = u[s + 1]).minRank <= t.rank; )
              s++;
            m = u[s];
          }
          l.setParent(n, m), n = l.successors(n)[0];
        }
      });
    }
    function h(l, i, n, t) {
      let a = [], o = [], u = Math.min(i[n].low, i[t].low), r = Math.max(i[n].lim, i[t].lim), s, m;
      s = n;
      do
        s = l.parent(s), a.push(s);
      while (s && (i[s].low > u || r > i[s].lim));
      for (m = s, s = t; (s = l.parent(s)) !== m; )
        o.push(s);
      return { path: a.concat(o.reverse()), lca: m };
    }
    function p(l) {
      let i = {}, n = 0;
      function t(a) {
        let o = n;
        l.children(a).forEach(t), i[a] = { low: o, lim: n++ };
      }
      return l.children().forEach(t), i;
    }
  }, {}], 21: [function(e, d, c) {
    let f = e("@dagrejs/graphlib").Graph, h = e("../util");
    d.exports = { positionX: b, findType1Conflicts: p, findType2Conflicts: l, addConflict: n, hasConflict: t, verticalAlignment: a, horizontalCompaction: o, alignCoordinates: s, findSmallestWidthAlignment: r, balance: m };
    function p(w, x) {
      let y = {};
      function j(C, T) {
        let R = 0, A = 0, g = C.length, v = T[T.length - 1];
        return T.forEach((_, N) => {
          let M = i(w, _), P = M ? w.node(M).order : g;
          (M || _ === v) && (T.slice(A, N + 1).forEach((D) => {
            w.predecessors(D).forEach((V) => {
              let Y = w.node(V), z = Y.order;
              (z < R || P < z) && !(Y.dummy && w.node(D).dummy) && n(y, V, D);
            });
          }), A = N + 1, R = P);
        }), T;
      }
      return x.length && x.reduce(j), y;
    }
    function l(w, x) {
      let y = {};
      function j(T, R, A, g, v) {
        let _;
        h.range(R, A).forEach((N) => {
          _ = T[N], w.node(_).dummy && w.predecessors(_).forEach((M) => {
            let P = w.node(M);
            P.dummy && (P.order < g || P.order > v) && n(y, M, _);
          });
        });
      }
      function C(T, R) {
        let A = -1, g, v = 0;
        return R.forEach((_, N) => {
          if (w.node(_).dummy === "border") {
            let M = w.predecessors(_);
            M.length && (g = w.node(M[0]).order, j(R, v, N, A, g), v = N, A = g);
          }
          j(R, v, R.length, g, T.length);
        }), R;
      }
      return x.length && x.reduce(C), y;
    }
    function i(w, x) {
      if (w.node(x).dummy)
        return w.predecessors(x).find((y) => w.node(y).dummy);
    }
    function n(w, x, y) {
      if (x > y) {
        let C = x;
        x = y, y = C;
      }
      let j = w[x];
      j || (w[x] = j = {}), j[y] = !0;
    }
    function t(w, x, y) {
      if (x > y) {
        let j = x;
        x = y, y = j;
      }
      return !!w[x] && Object.hasOwn(w[x], y);
    }
    function a(w, x, y, j) {
      let C = {}, T = {}, R = {};
      return x.forEach((A) => {
        A.forEach((g, v) => {
          C[g] = g, T[g] = g, R[g] = v;
        });
      }), x.forEach((A) => {
        let g = -1;
        A.forEach((v) => {
          let _ = j(v);
          if (_.length) {
            _ = _.sort((M, P) => R[M] - R[P]);
            let N = (_.length - 1) / 2;
            for (let M = Math.floor(N), P = Math.ceil(N); M <= P; ++M) {
              let D = _[M];
              T[v] === v && g < R[D] && !t(y, v, D) && (T[D] = v, T[v] = C[v] = C[D], g = R[D]);
            }
          }
        });
      }), { root: C, align: T };
    }
    function o(w, x, y, j, C) {
      let T = {}, R = u(w, x, y, C), A = C ? "borderLeft" : "borderRight";
      function g(N, M) {
        let P = R.nodes(), D = P.pop(), V = {};
        for (; D; )
          V[D] ? N(D) : (V[D] = !0, P.push(D), P = P.concat(M(D))), D = P.pop();
      }
      function v(N) {
        T[N] = R.inEdges(N).reduce((M, P) => Math.max(M, T[P.v] + R.edge(P)), 0);
      }
      function _(N) {
        let M = R.outEdges(N).reduce((D, V) => Math.min(D, T[V.w] - R.edge(V)), Number.POSITIVE_INFINITY), P = w.node(N);
        M !== Number.POSITIVE_INFINITY && P.borderType !== A && (T[N] = Math.max(T[N], M));
      }
      return g(v, R.predecessors.bind(R)), g(_, R.successors.bind(R)), Object.keys(j).forEach((N) => T[N] = T[y[N]]), T;
    }
    function u(w, x, y, j) {
      let C = new f(), T = w.graph(), R = k(T.nodesep, T.edgesep, j);
      return x.forEach((A) => {
        let g;
        A.forEach((v) => {
          let _ = y[v];
          if (C.setNode(_), g) {
            var N = y[g], M = C.edge(N, _);
            C.setEdge(N, _, Math.max(R(w, v, g), M || 0));
          }
          g = v;
        });
      }), C;
    }
    function r(w, x) {
      return Object.values(x).reduce((y, j) => {
        let C = Number.NEGATIVE_INFINITY, T = Number.POSITIVE_INFINITY;
        Object.entries(j).forEach(([A, g]) => {
          let v = L(w, A) / 2;
          C = Math.max(g + v, C), T = Math.min(g - v, T);
        });
        const R = C - T;
        return R < y[0] && (y = [R, j]), y;
      }, [Number.POSITIVE_INFINITY, null])[1];
    }
    function s(w, x) {
      let y = Object.values(x), j = h.applyWithChunking(Math.min, y), C = h.applyWithChunking(Math.max, y);
      ["u", "d"].forEach((T) => {
        ["l", "r"].forEach((R) => {
          let A = T + R, g = w[A];
          if (g === x) return;
          let v = Object.values(g), _ = j - h.applyWithChunking(Math.min, v);
          R !== "l" && (_ = C - h.applyWithChunking(Math.max, v)), _ && (w[A] = h.mapValues(g, (N) => N + _));
        });
      });
    }
    function m(w, x) {
      return h.mapValues(w.ul, (y, j) => {
        if (x)
          return w[x.toLowerCase()][j];
        {
          let C = Object.values(w).map((T) => T[j]).sort((T, R) => T - R);
          return (C[1] + C[2]) / 2;
        }
      });
    }
    function b(w) {
      let x = h.buildLayerMatrix(w), y = Object.assign(p(w, x), l(w, x)), j = {}, C;
      ["u", "d"].forEach((R) => {
        C = R === "u" ? x : Object.values(x).reverse(), ["l", "r"].forEach((A) => {
          A === "r" && (C = C.map((N) => Object.values(N).reverse()));
          let g = (R === "u" ? w.predecessors : w.successors).bind(w), v = a(w, C, y, g), _ = o(w, C, v.root, v.align, A === "r");
          A === "r" && (_ = h.mapValues(_, (N) => -N)), j[R + A] = _;
        });
      });
      let T = r(w, j);
      return s(j, T), m(j, w.graph().align);
    }
    function k(w, x, y) {
      return (j, C, T) => {
        let R = j.node(C), A = j.node(T), g = 0, v;
        if (g += R.width / 2, Object.hasOwn(R, "labelpos"))
          switch (R.labelpos.toLowerCase()) {
            case "l":
              v = -R.width / 2;
              break;
            case "r":
              v = R.width / 2;
              break;
          }
        if (v && (g += y ? v : -v), v = 0, g += (R.dummy ? x : w) / 2, g += (A.dummy ? x : w) / 2, g += A.width / 2, Object.hasOwn(A, "labelpos"))
          switch (A.labelpos.toLowerCase()) {
            case "l":
              v = A.width / 2;
              break;
            case "r":
              v = -A.width / 2;
              break;
          }
        return v && (g += y ? v : -v), v = 0, g;
      };
    }
    function L(w, x) {
      return w.node(x).width;
    }
  }, { "../util": 27, "@dagrejs/graphlib": 29 }], 22: [function(e, d, c) {
    let f = e("../util"), h = e("./bk").positionX;
    d.exports = p;
    function p(i) {
      i = f.asNonCompoundGraph(i), l(i), Object.entries(h(i)).forEach(([n, t]) => i.node(n).x = t);
    }
    function l(i) {
      let n = f.buildLayerMatrix(i), t = i.graph().ranksep, a = 0;
      n.forEach((o) => {
        const u = o.reduce((r, s) => {
          const m = i.node(s).height;
          return r > m ? r : m;
        }, 0);
        o.forEach((r) => i.node(r).y = a + u / 2), a += u + t;
      });
    }
  }, { "../util": 27, "./bk": 21 }], 23: [function(e, d, c) {
    var f = e("@dagrejs/graphlib").Graph, h = e("./util").slack;
    d.exports = p;
    function p(t) {
      var a = new f({ directed: !1 }), o = t.nodes()[0], u = t.nodeCount();
      a.setNode(o, {});
      for (var r, s; l(a, t) < u; )
        r = i(a, t), s = a.hasNode(r.v) ? h(t, r) : -h(t, r), n(a, t, s);
      return a;
    }
    function l(t, a) {
      function o(u) {
        a.nodeEdges(u).forEach((r) => {
          var s = r.v, m = u === s ? r.w : s;
          !t.hasNode(m) && !h(a, r) && (t.setNode(m, {}), t.setEdge(u, m, {}), o(m));
        });
      }
      return t.nodes().forEach(o), t.nodeCount();
    }
    function i(t, a) {
      return a.edges().reduce((u, r) => {
        let s = Number.POSITIVE_INFINITY;
        return t.hasNode(r.v) !== t.hasNode(r.w) && (s = h(a, r)), s < u[0] ? [s, r] : u;
      }, [Number.POSITIVE_INFINITY, null])[1];
    }
    function n(t, a, o) {
      t.nodes().forEach((u) => a.node(u).rank += o);
    }
  }, { "./util": 26, "@dagrejs/graphlib": 29 }], 24: [function(e, d, c) {
    var f = e("./util"), h = f.longestPath, p = e("./feasible-tree"), l = e("./network-simplex");
    d.exports = i;
    function i(o) {
      var u = o.graph().ranker;
      if (u instanceof Function)
        return u(o);
      switch (o.graph().ranker) {
        case "network-simplex":
          a(o);
          break;
        case "tight-tree":
          t(o);
          break;
        case "longest-path":
          n(o);
          break;
        case "none":
          break;
        default:
          a(o);
      }
    }
    var n = h;
    function t(o) {
      h(o), p(o);
    }
    function a(o) {
      l(o);
    }
  }, { "./feasible-tree": 23, "./network-simplex": 25, "./util": 26 }], 25: [function(e, d, c) {
    var f = e("./feasible-tree"), h = e("./util").slack, p = e("./util").longestPath, l = e("@dagrejs/graphlib").alg.preorder, i = e("@dagrejs/graphlib").alg.postorder, n = e("../util").simplify;
    d.exports = t, t.initLowLimValues = r, t.initCutValues = a, t.calcCutValue = u, t.leaveEdge = m, t.enterEdge = b, t.exchangeEdges = k;
    function t(y) {
      y = n(y), p(y);
      var j = f(y);
      r(j), a(j, y);
      for (var C, T; C = m(j); )
        T = b(j, y, C), k(j, y, C, T);
    }
    function a(y, j) {
      var C = i(y, y.nodes());
      C = C.slice(0, C.length - 1), C.forEach((T) => o(y, j, T));
    }
    function o(y, j, C) {
      var T = y.node(C), R = T.parent;
      y.edge(C, R).cutvalue = u(y, j, C);
    }
    function u(y, j, C) {
      var T = y.node(C), R = T.parent, A = !0, g = j.edge(C, R), v = 0;
      return g || (A = !1, g = j.edge(R, C)), v = g.weight, j.nodeEdges(C).forEach((_) => {
        var N = _.v === C, M = N ? _.w : _.v;
        if (M !== R) {
          var P = N === A, D = j.edge(_).weight;
          if (v += P ? D : -D, w(y, C, M)) {
            var V = y.edge(C, M).cutvalue;
            v += P ? -V : V;
          }
        }
      }), v;
    }
    function r(y, j) {
      arguments.length < 2 && (j = y.nodes()[0]), s(y, {}, 1, j);
    }
    function s(y, j, C, T, R) {
      var A = C, g = y.node(T);
      return j[T] = !0, y.neighbors(T).forEach((v) => {
        Object.hasOwn(j, v) || (C = s(y, j, C, v, T));
      }), g.low = A, g.lim = C++, R ? g.parent = R : delete g.parent, C;
    }
    function m(y) {
      return y.edges().find((j) => y.edge(j).cutvalue < 0);
    }
    function b(y, j, C) {
      var T = C.v, R = C.w;
      j.hasEdge(T, R) || (T = C.w, R = C.v);
      var A = y.node(T), g = y.node(R), v = A, _ = !1;
      A.lim > g.lim && (v = g, _ = !0);
      var N = j.edges().filter((M) => _ === x(y, y.node(M.v), v) && _ !== x(y, y.node(M.w), v));
      return N.reduce((M, P) => h(j, P) < h(j, M) ? P : M);
    }
    function k(y, j, C, T) {
      var R = C.v, A = C.w;
      y.removeEdge(R, A), y.setEdge(T.v, T.w, {}), r(y), a(y, j), L(y, j);
    }
    function L(y, j) {
      var C = y.nodes().find((R) => !j.node(R).parent), T = l(y, C);
      T = T.slice(1), T.forEach((R) => {
        var A = y.node(R).parent, g = j.edge(R, A), v = !1;
        g || (g = j.edge(A, R), v = !0), j.node(R).rank = j.node(A).rank + (v ? g.minlen : -g.minlen);
      });
    }
    function w(y, j, C) {
      return y.hasEdge(j, C);
    }
    function x(y, j, C) {
      return C.low <= j.lim && j.lim <= C.lim;
    }
  }, { "../util": 27, "./feasible-tree": 23, "./util": 26, "@dagrejs/graphlib": 29 }], 26: [function(e, d, c) {
    const { applyWithChunking: f } = e("../util");
    d.exports = { longestPath: h, slack: p };
    function h(l) {
      var i = {};
      function n(t) {
        var a = l.node(t);
        if (Object.hasOwn(i, t))
          return a.rank;
        i[t] = !0;
        let o = l.outEdges(t).map((r) => r == null ? Number.POSITIVE_INFINITY : n(r.w) - l.edge(r).minlen);
        var u = f(Math.min, o);
        return u === Number.POSITIVE_INFINITY && (u = 0), a.rank = u;
      }
      l.sources().forEach(n);
    }
    function p(l, i) {
      return l.node(i.w).rank - l.node(i.v).rank - l.edge(i).minlen;
    }
  }, { "../util": 27 }], 27: [function(e, d, c) {
    let f = e("@dagrejs/graphlib").Graph;
    d.exports = { addBorderNode: r, addDummyNode: h, applyWithChunking: b, asNonCompoundGraph: l, buildLayerMatrix: a, intersectRect: t, mapValues: R, maxRank: k, normalizeRanks: o, notime: x, partition: L, pick: T, predecessorWeights: n, range: C, removeEmptyRanks: u, simplify: p, successorWeights: i, time: w, uniqueId: j, zipObject: A };
    function h(g, v, _, N) {
      for (var M = N; g.hasNode(M); )
        M = j(N);
      return _.dummy = v, g.setNode(M, _), M;
    }
    function p(g) {
      let v = new f().setGraph(g.graph());
      return g.nodes().forEach((_) => v.setNode(_, g.node(_))), g.edges().forEach((_) => {
        let N = v.edge(_.v, _.w) || { weight: 0, minlen: 1 }, M = g.edge(_);
        v.setEdge(_.v, _.w, { weight: N.weight + M.weight, minlen: Math.max(N.minlen, M.minlen) });
      }), v;
    }
    function l(g) {
      let v = new f({ multigraph: g.isMultigraph() }).setGraph(g.graph());
      return g.nodes().forEach((_) => {
        g.children(_).length || v.setNode(_, g.node(_));
      }), g.edges().forEach((_) => {
        v.setEdge(_, g.edge(_));
      }), v;
    }
    function i(g) {
      let v = g.nodes().map((_) => {
        let N = {};
        return g.outEdges(_).forEach((M) => {
          N[M.w] = (N[M.w] || 0) + g.edge(M).weight;
        }), N;
      });
      return A(g.nodes(), v);
    }
    function n(g) {
      let v = g.nodes().map((_) => {
        let N = {};
        return g.inEdges(_).forEach((M) => {
          N[M.v] = (N[M.v] || 0) + g.edge(M).weight;
        }), N;
      });
      return A(g.nodes(), v);
    }
    function t(g, v) {
      let _ = g.x, N = g.y, M = v.x - _, P = v.y - N, D = g.width / 2, V = g.height / 2;
      if (!M && !P)
        throw new Error("Not possible to find intersection inside of the rectangle");
      let Y, z;
      return Math.abs(P) * D > Math.abs(M) * V ? (P < 0 && (V = -V), Y = V * M / P, z = V) : (M < 0 && (D = -D), Y = D, z = D * P / M), { x: _ + Y, y: N + z };
    }
    function a(g) {
      let v = C(k(g) + 1).map(() => []);
      return g.nodes().forEach((_) => {
        let N = g.node(_), M = N.rank;
        M !== void 0 && (v[M][N.order] = _);
      }), v;
    }
    function o(g) {
      let v = g.nodes().map((N) => {
        let M = g.node(N).rank;
        return M === void 0 ? Number.MAX_VALUE : M;
      }), _ = b(Math.min, v);
      g.nodes().forEach((N) => {
        let M = g.node(N);
        Object.hasOwn(M, "rank") && (M.rank -= _);
      });
    }
    function u(g) {
      let v = g.nodes().map((D) => g.node(D).rank), _ = b(Math.min, v), N = [];
      g.nodes().forEach((D) => {
        let V = g.node(D).rank - _;
        N[V] || (N[V] = []), N[V].push(D);
      });
      let M = 0, P = g.graph().nodeRankFactor;
      Array.from(N).forEach((D, V) => {
        D === void 0 && V % P !== 0 ? --M : D !== void 0 && M && D.forEach((Y) => g.node(Y).rank += M);
      });
    }
    function r(g, v, _, N) {
      let M = { width: 0, height: 0 };
      return arguments.length >= 4 && (M.rank = _, M.order = N), h(g, "border", M, v);
    }
    function s(g, v = m) {
      const _ = [];
      for (let N = 0; N < g.length; N += v) {
        const M = g.slice(N, N + v);
        _.push(M);
      }
      return _;
    }
    const m = 65535;
    function b(g, v) {
      if (v.length > m) {
        const _ = s(v);
        return g.apply(null, _.map((N) => g.apply(null, N)));
      } else
        return g.apply(null, v);
    }
    function k(g) {
      const _ = g.nodes().map((N) => {
        let M = g.node(N).rank;
        return M === void 0 ? Number.MIN_VALUE : M;
      });
      return b(Math.max, _);
    }
    function L(g, v) {
      let _ = { lhs: [], rhs: [] };
      return g.forEach((N) => {
        v(N) ? _.lhs.push(N) : _.rhs.push(N);
      }), _;
    }
    function w(g, v) {
      let _ = Date.now();
      try {
        return v();
      } finally {
        console.log(g + " time: " + (Date.now() - _) + "ms");
      }
    }
    function x(g, v) {
      return v();
    }
    let y = 0;
    function j(g) {
      var v = ++y;
      return g + ("" + v);
    }
    function C(g, v, _ = 1) {
      v == null && (v = g, g = 0);
      let N = (P) => P < v;
      _ < 0 && (N = (P) => v < P);
      const M = [];
      for (let P = g; N(P); P += _)
        M.push(P);
      return M;
    }
    function T(g, v) {
      const _ = {};
      for (const N of v)
        g[N] !== void 0 && (_[N] = g[N]);
      return _;
    }
    function R(g, v) {
      let _ = v;
      return typeof v == "string" && (_ = (N) => N[v]), Object.entries(g).reduce((N, [M, P]) => (N[M] = _(P, M), N), {});
    }
    function A(g, v) {
      return g.reduce((_, N, M) => (_[N] = v[M], _), {});
    }
  }, { "@dagrejs/graphlib": 29 }], 28: [function(e, d, c) {
    d.exports = "1.1.8";
  }, {}], 29: [function(e, d, c) {
    var f = e("./lib");
    d.exports = { Graph: f.Graph, json: e("./lib/json"), alg: e("./lib/alg"), version: f.version };
  }, { "./lib": 45, "./lib/alg": 36, "./lib/json": 46 }], 30: [function(e, d, c) {
    d.exports = f;
    function f(h) {
      var p = {}, l = [], i;
      function n(t) {
        Object.hasOwn(p, t) || (p[t] = !0, i.push(t), h.successors(t).forEach(n), h.predecessors(t).forEach(n));
      }
      return h.nodes().forEach(function(t) {
        i = [], n(t), i.length && l.push(i);
      }), l;
    }
  }, {}], 31: [function(e, d, c) {
    d.exports = f;
    function f(i, n, t) {
      Array.isArray(n) || (n = [n]);
      var a = i.isDirected() ? (s) => i.successors(s) : (s) => i.neighbors(s), o = t === "post" ? h : p, u = [], r = {};
      return n.forEach((s) => {
        if (!i.hasNode(s))
          throw new Error("Graph does not have node: " + s);
        o(s, a, r, u);
      }), u;
    }
    function h(i, n, t, a) {
      for (var o = [[i, !1]]; o.length > 0; ) {
        var u = o.pop();
        u[1] ? a.push(u[0]) : Object.hasOwn(t, u[0]) || (t[u[0]] = !0, o.push([u[0], !0]), l(n(u[0]), (r) => o.push([r, !1])));
      }
    }
    function p(i, n, t, a) {
      for (var o = [i]; o.length > 0; ) {
        var u = o.pop();
        Object.hasOwn(t, u) || (t[u] = !0, a.push(u), l(n(u), (r) => o.push(r)));
      }
    }
    function l(i, n) {
      for (var t = i.length; t--; )
        n(i[t], t, i);
      return i;
    }
  }, {}], 32: [function(e, d, c) {
    var f = e("./dijkstra");
    d.exports = h;
    function h(p, l, i) {
      return p.nodes().reduce(function(n, t) {
        return n[t] = f(p, t, l, i), n;
      }, {});
    }
  }, { "./dijkstra": 33 }], 33: [function(e, d, c) {
    var f = e("../data/priority-queue");
    d.exports = p;
    var h = () => 1;
    function p(i, n, t, a) {
      return l(i, String(n), t || h, a || function(o) {
        return i.outEdges(o);
      });
    }
    function l(i, n, t, a) {
      var o = {}, u = new f(), r, s, m = function(b) {
        var k = b.v !== r ? b.v : b.w, L = o[k], w = t(b), x = s.distance + w;
        if (w < 0)
          throw new Error("dijkstra does not allow negative edge weights. Bad edge: " + b + " Weight: " + w);
        x < L.distance && (L.distance = x, L.predecessor = r, u.decrease(k, x));
      };
      for (i.nodes().forEach(function(b) {
        var k = b === n ? 0 : Number.POSITIVE_INFINITY;
        o[b] = { distance: k }, u.add(b, k);
      }); u.size() > 0 && (r = u.removeMin(), s = o[r], s.distance !== Number.POSITIVE_INFINITY); )
        a(r).forEach(m);
      return o;
    }
  }, { "../data/priority-queue": 43 }], 34: [function(e, d, c) {
    var f = e("./tarjan");
    d.exports = h;
    function h(p) {
      return f(p).filter(function(l) {
        return l.length > 1 || l.length === 1 && p.hasEdge(l[0], l[0]);
      });
    }
  }, { "./tarjan": 41 }], 35: [function(e, d, c) {
    d.exports = h;
    var f = () => 1;
    function h(l, i, n) {
      return p(l, i || f, n || function(t) {
        return l.outEdges(t);
      });
    }
    function p(l, i, n) {
      var t = {}, a = l.nodes();
      return a.forEach(function(o) {
        t[o] = {}, t[o][o] = { distance: 0 }, a.forEach(function(u) {
          o !== u && (t[o][u] = { distance: Number.POSITIVE_INFINITY });
        }), n(o).forEach(function(u) {
          var r = u.v === o ? u.w : u.v, s = i(u);
          t[o][r] = { distance: s, predecessor: o };
        });
      }), a.forEach(function(o) {
        var u = t[o];
        a.forEach(function(r) {
          var s = t[r];
          a.forEach(function(m) {
            var b = s[o], k = u[m], L = s[m], w = b.distance + k.distance;
            w < L.distance && (L.distance = w, L.predecessor = k.predecessor);
          });
        });
      }), t;
    }
  }, {}], 36: [function(e, d, c) {
    d.exports = { components: e("./components"), dijkstra: e("./dijkstra"), dijkstraAll: e("./dijkstra-all"), findCycles: e("./find-cycles"), floydWarshall: e("./floyd-warshall"), isAcyclic: e("./is-acyclic"), postorder: e("./postorder"), preorder: e("./preorder"), prim: e("./prim"), tarjan: e("./tarjan"), topsort: e("./topsort") };
  }, { "./components": 30, "./dijkstra": 33, "./dijkstra-all": 32, "./find-cycles": 34, "./floyd-warshall": 35, "./is-acyclic": 37, "./postorder": 38, "./preorder": 39, "./prim": 40, "./tarjan": 41, "./topsort": 42 }], 37: [function(e, d, c) {
    var f = e("./topsort");
    d.exports = h;
    function h(p) {
      try {
        f(p);
      } catch (l) {
        if (l instanceof f.CycleException)
          return !1;
        throw l;
      }
      return !0;
    }
  }, { "./topsort": 42 }], 38: [function(e, d, c) {
    var f = e("./dfs");
    d.exports = h;
    function h(p, l) {
      return f(p, l, "post");
    }
  }, { "./dfs": 31 }], 39: [function(e, d, c) {
    var f = e("./dfs");
    d.exports = h;
    function h(p, l) {
      return f(p, l, "pre");
    }
  }, { "./dfs": 31 }], 40: [function(e, d, c) {
    var f = e("../graph"), h = e("../data/priority-queue");
    d.exports = p;
    function p(l, i) {
      var n = new f(), t = {}, a = new h(), o;
      function u(s) {
        var m = s.v === o ? s.w : s.v, b = a.priority(m);
        if (b !== void 0) {
          var k = i(s);
          k < b && (t[m] = o, a.decrease(m, k));
        }
      }
      if (l.nodeCount() === 0)
        return n;
      l.nodes().forEach(function(s) {
        a.add(s, Number.POSITIVE_INFINITY), n.setNode(s);
      }), a.decrease(l.nodes()[0], 0);
      for (var r = !1; a.size() > 0; ) {
        if (o = a.removeMin(), Object.hasOwn(t, o))
          n.setEdge(o, t[o]);
        else {
          if (r)
            throw new Error("Input graph is not connected: " + l);
          r = !0;
        }
        l.nodeEdges(o).forEach(u);
      }
      return n;
    }
  }, { "../data/priority-queue": 43, "../graph": 44 }], 41: [function(e, d, c) {
    d.exports = f;
    function f(h) {
      var p = 0, l = [], i = {}, n = [];
      function t(a) {
        var o = i[a] = { onStack: !0, lowlink: p, index: p++ };
        if (l.push(a), h.successors(a).forEach(function(s) {
          Object.hasOwn(i, s) ? i[s].onStack && (o.lowlink = Math.min(o.lowlink, i[s].index)) : (t(s), o.lowlink = Math.min(o.lowlink, i[s].lowlink));
        }), o.lowlink === o.index) {
          var u = [], r;
          do
            r = l.pop(), i[r].onStack = !1, u.push(r);
          while (a !== r);
          n.push(u);
        }
      }
      return h.nodes().forEach(function(a) {
        Object.hasOwn(i, a) || t(a);
      }), n;
    }
  }, {}], 42: [function(e, d, c) {
    function f(p) {
      var l = {}, i = {}, n = [];
      function t(a) {
        if (Object.hasOwn(i, a))
          throw new h();
        Object.hasOwn(l, a) || (i[a] = !0, l[a] = !0, p.predecessors(a).forEach(t), delete i[a], n.push(a));
      }
      if (p.sinks().forEach(t), Object.keys(l).length !== p.nodeCount())
        throw new h();
      return n;
    }
    class h extends Error {
      constructor() {
        super(...arguments);
      }
    }
    d.exports = f, f.CycleException = h;
  }, {}], 43: [function(e, d, c) {
    class f {
      _arr = [];
      _keyIndices = {};
      /**
         * Returns the number of elements in the queue. Takes `O(1)` time.
         */
      size() {
        return this._arr.length;
      }
      /**
         * Returns the keys that are in the queue. Takes `O(n)` time.
         */
      keys() {
        return this._arr.map(function(p) {
          return p.key;
        });
      }
      /**
         * Returns `true` if **key** is in the queue and `false` if not.
         */
      has(p) {
        return Object.hasOwn(this._keyIndices, p);
      }
      /**
         * Returns the priority for **key**. If **key** is not present in the queue
         * then this function returns `undefined`. Takes `O(1)` time.
         *
         * @param {Object} key
         */
      priority(p) {
        var l = this._keyIndices[p];
        if (l !== void 0)
          return this._arr[l].priority;
      }
      /**
         * Returns the key for the minimum element in this queue. If the queue is
         * empty this function throws an Error. Takes `O(1)` time.
         */
      min() {
        if (this.size() === 0)
          throw new Error("Queue underflow");
        return this._arr[0].key;
      }
      /**
         * Inserts a new key into the priority queue. If the key already exists in
         * the queue this function returns `false`; otherwise it will return `true`.
         * Takes `O(n)` time.
         *
         * @param {Object} key the key to add
         * @param {Number} priority the initial priority for the key
         */
      add(p, l) {
        var i = this._keyIndices;
        if (p = String(p), !Object.hasOwn(i, p)) {
          var n = this._arr, t = n.length;
          return i[p] = t, n.push({ key: p, priority: l }), this._decrease(t), !0;
        }
        return !1;
      }
      /**
         * Removes and returns the smallest key in the queue. Takes `O(log n)` time.
         */
      removeMin() {
        this._swap(0, this._arr.length - 1);
        var p = this._arr.pop();
        return delete this._keyIndices[p.key], this._heapify(0), p.key;
      }
      /**
         * Decreases the priority for **key** to **priority**. If the new priority is
         * greater than the previous priority, this function will throw an Error.
         *
         * @param {Object} key the key for which to raise priority
         * @param {Number} priority the new priority for the key
         */
      decrease(p, l) {
        var i = this._keyIndices[p];
        if (l > this._arr[i].priority)
          throw new Error("New priority is greater than current priority. Key: " + p + " Old: " + this._arr[i].priority + " New: " + l);
        this._arr[i].priority = l, this._decrease(i);
      }
      _heapify(p) {
        var l = this._arr, i = 2 * p, n = i + 1, t = p;
        i < l.length && (t = l[i].priority < l[t].priority ? i : t, n < l.length && (t = l[n].priority < l[t].priority ? n : t), t !== p && (this._swap(p, t), this._heapify(t)));
      }
      _decrease(p) {
        for (var l = this._arr, i = l[p].priority, n; p !== 0 && (n = p >> 1, !(l[n].priority < i)); )
          this._swap(p, n), p = n;
      }
      _swap(p, l) {
        var i = this._arr, n = this._keyIndices, t = i[p], a = i[l];
        i[p] = a, i[l] = t, n[a.key] = p, n[t.key] = l;
      }
    }
    d.exports = f;
  }, {}], 44: [function(e, d, c) {
    var f = "\0", h = "\0", p = "";
    class l {
      _isDirected = !0;
      _isMultigraph = !1;
      _isCompound = !1;
      // Label for the graph itself
      _label;
      // Defaults to be set when creating a new node
      _defaultNodeLabelFn = () => {
      };
      // Defaults to be set when creating a new edge
      _defaultEdgeLabelFn = () => {
      };
      // v -> label
      _nodes = {};
      // v -> edgeObj
      _in = {};
      // u -> v -> Number
      _preds = {};
      // v -> edgeObj
      _out = {};
      // v -> w -> Number
      _sucs = {};
      // e -> edgeObj
      _edgeObjs = {};
      // e -> label
      _edgeLabels = {};
      /* Number of nodes in the graph. Should only be changed by the implementation. */
      _nodeCount = 0;
      /* Number of edges in the graph. Should only be changed by the implementation. */
      _edgeCount = 0;
      _parent;
      _children;
      constructor(r) {
        r && (this._isDirected = Object.hasOwn(r, "directed") ? r.directed : !0, this._isMultigraph = Object.hasOwn(r, "multigraph") ? r.multigraph : !1, this._isCompound = Object.hasOwn(r, "compound") ? r.compound : !1), this._isCompound && (this._parent = {}, this._children = {}, this._children[h] = {});
      }
      /* === Graph functions ========= */
      /**
         * Whether graph was created with 'directed' flag set to true or not.
         */
      isDirected() {
        return this._isDirected;
      }
      /**
         * Whether graph was created with 'multigraph' flag set to true or not.
         */
      isMultigraph() {
        return this._isMultigraph;
      }
      /**
         * Whether graph was created with 'compound' flag set to true or not.
         */
      isCompound() {
        return this._isCompound;
      }
      /**
         * Sets the label of the graph.
         */
      setGraph(r) {
        return this._label = r, this;
      }
      /**
         * Gets the graph label.
         */
      graph() {
        return this._label;
      }
      /* === Node functions ========== */
      /**
         * Sets the default node label. If newDefault is a function, it will be
         * invoked ach time when setting a label for a node. Otherwise, this label
         * will be assigned as default label in case if no label was specified while
         * setting a node.
         * Complexity: O(1).
         */
      setDefaultNodeLabel(r) {
        return this._defaultNodeLabelFn = r, typeof r != "function" && (this._defaultNodeLabelFn = () => r), this;
      }
      /**
         * Gets the number of nodes in the graph.
         * Complexity: O(1).
         */
      nodeCount() {
        return this._nodeCount;
      }
      /**
         * Gets all nodes of the graph. Note, the in case of compound graph subnodes are
         * not included in list.
         * Complexity: O(1).
         */
      nodes() {
        return Object.keys(this._nodes);
      }
      /**
         * Gets list of nodes without in-edges.
         * Complexity: O(|V|).
         */
      sources() {
        var r = this;
        return this.nodes().filter((s) => Object.keys(r._in[s]).length === 0);
      }
      /**
         * Gets list of nodes without out-edges.
         * Complexity: O(|V|).
         */
      sinks() {
        var r = this;
        return this.nodes().filter((s) => Object.keys(r._out[s]).length === 0);
      }
      /**
         * Invokes setNode method for each node in names list.
         * Complexity: O(|names|).
         */
      setNodes(r, s) {
        var m = arguments, b = this;
        return r.forEach(function(k) {
          m.length > 1 ? b.setNode(k, s) : b.setNode(k);
        }), this;
      }
      /**
         * Creates or updates the value for the node v in the graph. If label is supplied
         * it is set as the value for the node. If label is not supplied and the node was
         * created by this call then the default node label will be assigned.
         * Complexity: O(1).
         */
      setNode(r, s) {
        return Object.hasOwn(this._nodes, r) ? (arguments.length > 1 && (this._nodes[r] = s), this) : (this._nodes[r] = arguments.length > 1 ? s : this._defaultNodeLabelFn(r), this._isCompound && (this._parent[r] = h, this._children[r] = {}, this._children[h][r] = !0), this._in[r] = {}, this._preds[r] = {}, this._out[r] = {}, this._sucs[r] = {}, ++this._nodeCount, this);
      }
      /**
         * Gets the label of node with specified name.
         * Complexity: O(|V|).
         */
      node(r) {
        return this._nodes[r];
      }
      /**
         * Detects whether graph has a node with specified name or not.
         */
      hasNode(r) {
        return Object.hasOwn(this._nodes, r);
      }
      /**
         * Remove the node with the name from the graph or do nothing if the node is not in
         * the graph. If the node was removed this function also removes any incident
         * edges.
         * Complexity: O(1).
         */
      removeNode(r) {
        var s = this;
        if (Object.hasOwn(this._nodes, r)) {
          var m = (b) => s.removeEdge(s._edgeObjs[b]);
          delete this._nodes[r], this._isCompound && (this._removeFromParentsChildList(r), delete this._parent[r], this.children(r).forEach(function(b) {
            s.setParent(b);
          }), delete this._children[r]), Object.keys(this._in[r]).forEach(m), delete this._in[r], delete this._preds[r], Object.keys(this._out[r]).forEach(m), delete this._out[r], delete this._sucs[r], --this._nodeCount;
        }
        return this;
      }
      /**
         * Sets node p as a parent for node v if it is defined, or removes the
         * parent for v if p is undefined. Method throws an exception in case of
         * invoking it in context of noncompound graph.
         * Average-case complexity: O(1).
         */
      setParent(r, s) {
        if (!this._isCompound)
          throw new Error("Cannot set parent in a non-compound graph");
        if (s === void 0)
          s = h;
        else {
          s += "";
          for (var m = s; m !== void 0; m = this.parent(m))
            if (m === r)
              throw new Error("Setting " + s + " as parent of " + r + " would create a cycle");
          this.setNode(s);
        }
        return this.setNode(r), this._removeFromParentsChildList(r), this._parent[r] = s, this._children[s][r] = !0, this;
      }
      _removeFromParentsChildList(r) {
        delete this._children[this._parent[r]][r];
      }
      /**
         * Gets parent node for node v.
         * Complexity: O(1).
         */
      parent(r) {
        if (this._isCompound) {
          var s = this._parent[r];
          if (s !== h)
            return s;
        }
      }
      /**
         * Gets list of direct children of node v.
         * Complexity: O(1).
         */
      children(r = h) {
        if (this._isCompound) {
          var s = this._children[r];
          if (s)
            return Object.keys(s);
        } else {
          if (r === h)
            return this.nodes();
          if (this.hasNode(r))
            return [];
        }
      }
      /**
         * Return all nodes that are predecessors of the specified node or undefined if node v is not in
         * the graph. Behavior is undefined for undirected graphs - use neighbors instead.
         * Complexity: O(|V|).
         */
      predecessors(r) {
        var s = this._preds[r];
        if (s)
          return Object.keys(s);
      }
      /**
         * Return all nodes that are successors of the specified node or undefined if node v is not in
         * the graph. Behavior is undefined for undirected graphs - use neighbors instead.
         * Complexity: O(|V|).
         */
      successors(r) {
        var s = this._sucs[r];
        if (s)
          return Object.keys(s);
      }
      /**
         * Return all nodes that are predecessors or successors of the specified node or undefined if
         * node v is not in the graph.
         * Complexity: O(|V|).
         */
      neighbors(r) {
        var s = this.predecessors(r);
        if (s) {
          const b = new Set(s);
          for (var m of this.successors(r))
            b.add(m);
          return Array.from(b.values());
        }
      }
      isLeaf(r) {
        var s;
        return this.isDirected() ? s = this.successors(r) : s = this.neighbors(r), s.length === 0;
      }
      /**
         * Creates new graph with nodes filtered via filter. Edges incident to rejected node
         * are also removed. In case of compound graph, if parent is rejected by filter,
         * than all its children are rejected too.
         * Average-case complexity: O(|E|+|V|).
         */
      filterNodes(r) {
        var s = new this.constructor({ directed: this._isDirected, multigraph: this._isMultigraph, compound: this._isCompound });
        s.setGraph(this.graph());
        var m = this;
        Object.entries(this._nodes).forEach(function([L, w]) {
          r(L) && s.setNode(L, w);
        }), Object.values(this._edgeObjs).forEach(function(L) {
          s.hasNode(L.v) && s.hasNode(L.w) && s.setEdge(L, m.edge(L));
        });
        var b = {};
        function k(L) {
          var w = m.parent(L);
          return w === void 0 || s.hasNode(w) ? (b[L] = w, w) : w in b ? b[w] : k(w);
        }
        return this._isCompound && s.nodes().forEach((L) => s.setParent(L, k(L))), s;
      }
      /* === Edge functions ========== */
      /**
         * Sets the default edge label or factory function. This label will be
         * assigned as default label in case if no label was specified while setting
         * an edge or this function will be invoked each time when setting an edge
         * with no label specified and returned value * will be used as a label for edge.
         * Complexity: O(1).
         */
      setDefaultEdgeLabel(r) {
        return this._defaultEdgeLabelFn = r, typeof r != "function" && (this._defaultEdgeLabelFn = () => r), this;
      }
      /**
         * Gets the number of edges in the graph.
         * Complexity: O(1).
         */
      edgeCount() {
        return this._edgeCount;
      }
      /**
         * Gets edges of the graph. In case of compound graph subgraphs are not considered.
         * Complexity: O(|E|).
         */
      edges() {
        return Object.values(this._edgeObjs);
      }
      /**
         * Establish an edges path over the nodes in nodes list. If some edge is already
         * exists, it will update its label, otherwise it will create an edge between pair
         * of nodes with label provided or default label if no label provided.
         * Complexity: O(|nodes|).
         */
      setPath(r, s) {
        var m = this, b = arguments;
        return r.reduce(function(k, L) {
          return b.length > 1 ? m.setEdge(k, L, s) : m.setEdge(k, L), L;
        }), this;
      }
      /**
         * Creates or updates the label for the edge (v, w) with the optionally supplied
         * name. If label is supplied it is set as the value for the edge. If label is not
         * supplied and the edge was created by this call then the default edge label will
         * be assigned. The name parameter is only useful with multigraphs.
         */
      setEdge() {
        var r, s, m, b, k = !1, L = arguments[0];
        typeof L == "object" && L !== null && "v" in L ? (r = L.v, s = L.w, m = L.name, arguments.length === 2 && (b = arguments[1], k = !0)) : (r = L, s = arguments[1], m = arguments[3], arguments.length > 2 && (b = arguments[2], k = !0)), r = "" + r, s = "" + s, m !== void 0 && (m = "" + m);
        var w = t(this._isDirected, r, s, m);
        if (Object.hasOwn(this._edgeLabels, w))
          return k && (this._edgeLabels[w] = b), this;
        if (m !== void 0 && !this._isMultigraph)
          throw new Error("Cannot set a named edge when isMultigraph = false");
        this.setNode(r), this.setNode(s), this._edgeLabels[w] = k ? b : this._defaultEdgeLabelFn(r, s, m);
        var x = a(this._isDirected, r, s, m);
        return r = x.v, s = x.w, Object.freeze(x), this._edgeObjs[w] = x, i(this._preds[s], r), i(this._sucs[r], s), this._in[s][w] = x, this._out[r][w] = x, this._edgeCount++, this;
      }
      /**
         * Gets the label for the specified edge.
         * Complexity: O(1).
         */
      edge(r, s, m) {
        var b = arguments.length === 1 ? o(this._isDirected, arguments[0]) : t(this._isDirected, r, s, m);
        return this._edgeLabels[b];
      }
      /**
         * Gets the label for the specified edge and converts it to an object.
         * Complexity: O(1)
         */
      edgeAsObj() {
        const r = this.edge(...arguments);
        return typeof r != "object" ? { label: r } : r;
      }
      /**
         * Detects whether the graph contains specified edge or not. No subgraphs are considered.
         * Complexity: O(1).
         */
      hasEdge(r, s, m) {
        var b = arguments.length === 1 ? o(this._isDirected, arguments[0]) : t(this._isDirected, r, s, m);
        return Object.hasOwn(this._edgeLabels, b);
      }
      /**
         * Removes the specified edge from the graph. No subgraphs are considered.
         * Complexity: O(1).
         */
      removeEdge(r, s, m) {
        var b = arguments.length === 1 ? o(this._isDirected, arguments[0]) : t(this._isDirected, r, s, m), k = this._edgeObjs[b];
        return k && (r = k.v, s = k.w, delete this._edgeLabels[b], delete this._edgeObjs[b], n(this._preds[s], r), n(this._sucs[r], s), delete this._in[s][b], delete this._out[r][b], this._edgeCount--), this;
      }
      /**
         * Return all edges that point to the node v. Optionally filters those edges down to just those
         * coming from node u. Behavior is undefined for undirected graphs - use nodeEdges instead.
         * Complexity: O(|E|).
         */
      inEdges(r, s) {
        var m = this._in[r];
        if (m) {
          var b = Object.values(m);
          return s ? b.filter((k) => k.v === s) : b;
        }
      }
      /**
         * Return all edges that are pointed at by node v. Optionally filters those edges down to just
         * those point to w. Behavior is undefined for undirected graphs - use nodeEdges instead.
         * Complexity: O(|E|).
         */
      outEdges(r, s) {
        var m = this._out[r];
        if (m) {
          var b = Object.values(m);
          return s ? b.filter((k) => k.w === s) : b;
        }
      }
      /**
         * Returns all edges to or from node v regardless of direction. Optionally filters those edges
         * down to just those between nodes v and w regardless of direction.
         * Complexity: O(|E|).
         */
      nodeEdges(r, s) {
        var m = this.inEdges(r, s);
        if (m)
          return m.concat(this.outEdges(r, s));
      }
    }
    function i(u, r) {
      u[r] ? u[r]++ : u[r] = 1;
    }
    function n(u, r) {
      --u[r] || delete u[r];
    }
    function t(u, r, s, m) {
      var b = "" + r, k = "" + s;
      if (!u && b > k) {
        var L = b;
        b = k, k = L;
      }
      return b + p + k + p + (m === void 0 ? f : m);
    }
    function a(u, r, s, m) {
      var b = "" + r, k = "" + s;
      if (!u && b > k) {
        var L = b;
        b = k, k = L;
      }
      var w = { v: b, w: k };
      return m && (w.name = m), w;
    }
    function o(u, r) {
      return t(u, r.v, r.w, r.name);
    }
    d.exports = l;
  }, {}], 45: [function(e, d, c) {
    d.exports = { Graph: e("./graph"), version: e("./version") };
  }, { "./graph": 44, "./version": 47 }], 46: [function(e, d, c) {
    var f = e("./graph");
    d.exports = { write: h, read: i };
    function h(n) {
      var t = { options: { directed: n.isDirected(), multigraph: n.isMultigraph(), compound: n.isCompound() }, nodes: p(n), edges: l(n) };
      return n.graph() !== void 0 && (t.value = structuredClone(n.graph())), t;
    }
    function p(n) {
      return n.nodes().map(function(t) {
        var a = n.node(t), o = n.parent(t), u = { v: t };
        return a !== void 0 && (u.value = a), o !== void 0 && (u.parent = o), u;
      });
    }
    function l(n) {
      return n.edges().map(function(t) {
        var a = n.edge(t), o = { v: t.v, w: t.w };
        return t.name !== void 0 && (o.name = t.name), a !== void 0 && (o.value = a), o;
      });
    }
    function i(n) {
      var t = new f(n.options).setGraph(n.value);
      return n.nodes.forEach(function(a) {
        t.setNode(a.v, a.value), a.parent && t.setParent(a.v, a.parent);
      }), n.edges.forEach(function(a) {
        t.setEdge({ v: a.v, w: a.w, name: a.name }, a.value);
      }), t;
    }
  }, { "./graph": 44 }], 47: [function(e, d, c) {
    d.exports = "2.2.4";
  }, {}] }, {}, [1])(1);
})(), ot = ["unstarted", "started", "completed", "canceled"];
function at(e, d) {
  let c = 1;
  const f = () => `${e.slice(0, 40 - String(c).length - 1)}_${c}`;
  for (; d.some((h) => h.id === f()); ) c++;
  return f();
}
function lt(e, d) {
  return [
    ...e.initial === d.id ? ["the initial state"] : [],
    ...(e.transitions ?? []).filter((c) => c.to === d.id || c.from !== "any" && c.from.includes(d.id)).map((c) => `transition ${ze(c)}`),
    ...e.states.filter((c) => c.regions?.some((f) => f.initial === d.id)).map((c) => `lanes in ${xe(c)}`),
    ...Object.entries(e.map ?? {}).filter(([, c]) => c === d.id).map(() => "existing item migration")
  ];
}
function dt(e, d) {
  return e.states.flatMap((c) => [
    ...["on_pass", "on_fail", "on_cancel", "on_exhausted"].filter((f) => c.run?.[f] === d.id).map((f) => `${{ on_pass: "success", on_fail: "failure", on_cancel: "cancellation", on_exhausted: "exhaustion" }[f]} handler in ${xe(c)}`),
    ...(c.timers ?? []).filter((f) => f.then?.transition === d.id).map(() => "a timer")
  ]);
}
const xe = (e) => e?.name || "Untitled state", ze = (e) => e.name?.trim() || fe(e.id), ut = (e) => ({ unstarted: "Not started", triage: "Triage", backlog: "Backlog", started: "In progress", completed: "Done", canceled: "Canceled" })[e] ?? "In progress", ct = (e) => ({ human: "Person", gate: "Approval", automated: "Automation", parallel: "Parallel" })[e ?? "human"] ?? "Person";
function ft(e, d) {
  if (e.id === d.initial) return "Starts here";
  if (e.category === "completed") return "Finished";
  if (e.category === "canceled") return "Work stops here";
  if (e.kind === "gate") {
    const c = e.release_when?.approvals?.min;
    return c ? `Needs ${c} approval${c === 1 ? "" : "s"}` : "Waits for release";
  }
  return e.kind === "automated" ? "Runs automatically" : e.kind === "parallel" ? _e(e) : "A person moves it";
}
function _e(e) {
  return e.join === "any" ? "any may pass" : typeof e.join == "number" ? `${e.join} must pass` : e.regions?.length === 2 ? "both must pass" : "all must pass";
}
function ht(e, d) {
  const c = e.release_when?.approvals?.min ?? 1, f = e.category === "completed" ? "Work is finished here." : e.category === "canceled" ? "Work stops here." : e.kind === "gate" ? e.release_when?.approvals ? `Items wait here until ${c === 1 ? "one person approves" : `${c} people approve`}.` : "Items wait until the release rules are met." : e.kind === "automated" ? "An automation runs when an item arrives." : e.kind === "parallel" ? `Items travel through lanes; ${_e(e)}.` : "A person chooses when to move the item on.", h = d.policy?.wip?.[e.id]?.limit;
  return f + (h !== void 0 ? ` At most ${h} at a time.` : "");
}
function pt(e) {
  const d = e.transitions ?? [], c = [], f = /* @__PURE__ */ new Set();
  let h = e.states.find((l) => l.id === e.initial);
  const p = new Map(e.states.map((l, i) => [l.id, i]));
  for (; h && !f.has(h.id) && (c.push(h), f.add(h.id), !(h.category === "completed" || h.category === "canceled")); ) {
    const l = h, i = d.filter((t) => t.from !== "any" && t.from.includes(l.id)), n = i.find((t) => t.default) ?? i.find((t) => !f.has(t.to) && (p.get(t.to) ?? -1) > (p.get(l.id) ?? 0));
    h = e.states.find((t) => t.id === n?.to);
  }
  return c;
}
function Oe(e) {
  const d = e.states.find((c) => c.id === e.initial);
  return e.migration ?? (d?.kind === "automated" || d?.kind === "parallel" ? "pin" : "follow");
}
const J = (e) => JSON.parse(JSON.stringify(e));
function mt(e) {
  return e?.admin === !0;
}
function bt(e, d, c) {
  const f = d + c;
  if (d < 0 || d >= e.length || f < 0 || f >= e.length) return;
  const [h] = e.splice(d, 1);
  e.splice(f, 0, h);
}
function gt(e, d, c) {
  const f = d.code;
  if (f === c) return;
  if (e.fields?.some((n) => n.expression)) throw new Error("Clear formula expressions before renaming a field, then restore them with the new code.");
  d.code = c;
  const h = (n) => n === f ? c : n;
  for (const n of e.item_types ?? [])
    n.fields = n.fields.map(h), n.inherit && (n.inherit = n.inherit.map(h));
  const p = (n) => {
    for (const t of n ?? []) "field" in t && t.field === f && (t.field = c);
  }, l = (n) => {
    n && typeof n == "object" && !Array.isArray(n) && "field" in n && typeof n.field == "string" && (n.field = h(n.field));
  }, i = (n) => {
    if (!(!n || typeof n != "object")) {
      if (Array.isArray(n)) {
        n.forEach(i);
        return;
      }
      l(n);
      for (const [t, a] of Object.entries(n)) ["value", "values", "ctx"].includes(t) || i(a);
    }
  };
  for (const n of e.fields ?? [])
    n.field && (n.field = h(n.field)), i(n.where), p(n.access?.read), p(n.access?.write);
  if (e.visibility) {
    e.visibility.field = h(e.visibility.field);
    for (const n of e.visibility.levels) p(n.holders);
  }
  for (const n of e.processes ?? []) {
    for (const t of n.states) {
      l(t.awaiting), l(t.release_when?.approvals?.from), i(t.release_when?.when), t.require && (t.require = t.require.map(h));
      for (const a of t.timers ?? [])
        a.at_field && (a.at_field = h(a.at_field)), a.by && (a.by = h(a.by));
    }
    for (const t of n.transitions ?? []) {
      i(t.when), t.require && (t.require = t.require.map(h));
      for (const a of t.set ?? [])
        a.field = h(a.field), a.copy && (a.copy = h(a.copy));
    }
  }
}
function wt(e, d) {
  const c = J(e), f = { ...c.remove };
  d.visibility && !c.visibility ? f.visibility = !0 : delete f.visibility;
  for (const h of ["fields", "item_types", "processes", "relation_types"]) {
    const p = (d[h] ?? []).filter((l) => {
      if (h === "fields") {
        const i = l;
        return !c.fields?.some((n) => i.id !== void 0 ? n.id === i.id : n.code === i.code);
      }
      return !(c[h] ?? []).some((i) => "id" in i && i.id === ("id" in l ? l.id : void 0));
    }).map((l) => "code" in l ? l.code : l.id);
    p.length ? f[h] = [.../* @__PURE__ */ new Set([...f[h] ?? [], ...p])] : delete f[h];
  }
  return Object.keys(f).length ? c.remove = f : delete c.remove, c;
}
function yt(e, d, c) {
  const f = JSON.stringify({ declaration: e, configs: c });
  return {
    declaration: J(e),
    expected_generation: d,
    plugin_configs: J(c),
    matches: (h, p, l) => d === p && f === JSON.stringify({ declaration: h, configs: l })
  };
}
function vt(e) {
  const d = J(e), c = [...new Set(d.declaration.item_types?.flatMap((h) => h.fields) ?? [])], f = (h) => {
    const p = c.indexOf(h);
    return p < 0 ? c.length : p;
  };
  d.declaration.fields?.sort((h, p) => f(h.code) - f(p.code));
  for (const h of d.declaration.fields ?? []) {
    const p = d.compiled.fields?.find((l) => l.code === h.code);
    h.id ??= p?.id, h.form ??= p?.form;
  }
  for (const h of d.declaration.processes ?? []) h.migration ??= d.compiled.processes?.find((p) => p.id === h.id)?.migration ?? Oe(h);
  return d;
}
function Et(e, d) {
  return (d.processes ?? []).filter((c) => Oe(c) !== "pin" && e.changes.some((f) => f.code === "process " + c.id && f.class !== "cosmetic" && f.class !== "refused")).map((c) => c.id);
}
function kt(e, d, c) {
  const f = [c, `item_type ${c}`, `relation ${c}`, `process ${c}`], h = e.refused.filter((p) => f.includes(p.code));
  return d === "fields" && h.push(...e.changes.filter((p) => p.code === c && p.what === "removed" && p.class === "semantic")), h.length ? h.map(Je).join(" ") : void 0;
}
function xt(e, d, c) {
  if (d === "fields") {
    e.fields = e.fields?.filter((f) => f.code !== c);
    for (const f of e.item_types ?? [])
      f.fields = f.fields.filter((h) => h !== c), f.inherit = f.inherit?.filter((h) => h !== c);
  } else d === "item_types" ? e.item_types = e.item_types?.filter((f) => f.id !== c) : d === "processes" ? e.processes = e.processes?.filter((f) => f.id !== c) : e.relation_types = e.relation_types?.filter((f) => f.id !== c);
}
function Je(e) {
  return e.what === "invalid" ? e.detail || "The definition is invalid." : [e.what === "removed" ? "Items still hold values in this field." : e.code.startsWith("item_type ") && e.what === "remove" ? "Items still use this item type." : e.code.startsWith("relation ") && e.what === "remove" ? "Links still use this relation type." : e.what === "options.remove" ? "Items still hold values in this option field." : e.what === "state.remove" ? "Items still occupy this state. Map them to a surviving state." : e.what === "process" ? "An existing item type cannot change process." : ["type", "form", "cardinality"].includes(e.what) || e.what.startsWith("config.") ? "This change alters the representation of stored values. Add a new field and migrate values first." : e.what === "state.kind" ? "An existing state cannot change kind. Create a new state and map existing items to it." : e.what === "shape" && e.code.startsWith("relation ") ? "Existing links prevent a cardinality or symmetry change." : "Stored data or a schema dependency prevents this change.", e.detail, e.count ? `${e.count} items` : ""].filter(Boolean).join(" ");
}
function _t(e, d) {
  if (!(e instanceof X)) return [];
  const c = e.details ?? {};
  let f = typeof c.field == "string" ? c.field : "";
  if (!f) {
    const h = d.processes?.find((p) => p.id === c.process || p.states.some((l) => l.id === c.state) || e.message.includes(`process ${p.id}`));
    h ? f = `process ${h.id}` : typeof c.item_type == "string" && (f = `item_type ${c.item_type}`);
  }
  return f ? [{ code: f, class: "refused", what: "invalid", detail: e.message }] : [];
}
const Ot = {
  unchanged: "Nothing changes.",
  cosmetic: "Presentation or policy changes. Stored item values keep their meaning.",
  additive: "New definitions become available to items.",
  semantic: "The board updates its indexes or process generations after apply.",
  refused: "Resolve the refused changes before applying this draft.",
  initial: "The first schema defines the board."
}, Nt = (e) => !("problem" in e);
function jt(e, d) {
  return { pack: e.id, version: e.version, expected_generation: d };
}
async function It(e, d) {
  const c = { ...J(e), resolutions: J(e.resolutions ?? {}) };
  let f = await d(c);
  return c.maps || (c.maps = J(f.maps), f = await d(c)), { request: c, plan: f };
}
function Ct() {
  let e = 0;
  return () => {
    const d = ++e;
    return () => d === e;
  };
}
export {
  at as A,
  ht as B,
  dt as C,
  lt as D,
  Oe as E,
  J as F,
  Ot as G,
  wt as H,
  Et as I,
  jt as J,
  It as K,
  X as L,
  vt as M,
  yt as N,
  _t as O,
  kt as P,
  Ze as _,
  Nt as a,
  qe as b,
  mt as c,
  Qe as d,
  st as e,
  ft as f,
  ke as g,
  tt as h,
  nt as i,
  ot as j,
  ut as k,
  Ct as l,
  pt as m,
  bt as n,
  fe as o,
  H as p,
  Je as q,
  rt as r,
  xe as s,
  ze as t,
  it as u,
  xt as v,
  et as w,
  gt as x,
  ct as y,
  Ee as z
};
//# sourceMappingURL=latestRequest-C9n6N5u0.js.map
