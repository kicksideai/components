import { defineComponent as _e, useId as Pe, openBlock as ue, createElementBlock as ce, unref as ge, normalizeClass as De, createElementVNode as Q, createTextVNode as Fe, toDisplayString as be, createCommentVNode as $e, renderSlot as ee, ref as X, watch as xe, onUnmounted as Ge, onMounted as Ve, onBeforeUnmount as Be, nextTick as Ue } from "vue";
import { api as Oe } from "@wippy-fe/proxy";
const We = ["aria-labelledby"], Ye = { class: "kx-railhead" }, ze = ["id"], He = { key: 0 }, Je = { class: "kx-railhead-acts" }, Xe = { class: "kx-rail-body" }, at = /* @__PURE__ */ _e({
  __name: "ListRail",
  props: {
    title: {},
    count: {},
    settings: { type: Boolean }
  },
  setup(e) {
    const o = Pe();
    return (d, u) => (ue(), ce("aside", {
      class: De(["kx-rail", { "kx-settings-list-rail": e.settings }]),
      "aria-labelledby": ge(o)
    }, [
      Q("div", Ye, [
        Q("span", {
          id: ge(o),
          class: "kx-railhead-title"
        }, [
          Fe(be(e.title), 1),
          e.count !== void 0 ? (ue(), ce("b", He, be(e.count), 1)) : $e("", !0)
        ], 8, ze),
        Q("div", Je, [
          ee(d.$slots, "actions")
        ])
      ]),
      ee(d.$slots, "toolbar"),
      Q("div", Xe, [
        ee(d.$slots, "default")
      ])
    ], 10, We));
  }
});
class q extends Error {
  constructor(o, d, u) {
    super(o.message ?? o.error ?? `${d} failed`), this.name = "ApiError", this.kind = o.kind, this.details = o.details, this.retryable = o.retryable, this.status = u;
  }
}
function te(e) {
  return typeof e == "object" && e !== null && !Array.isArray(e);
}
function Ne(e, o, d) {
  return new q({
    message: typeof e.message == "string" ? e.message : void 0,
    error: typeof e.error == "string" ? e.error : void 0,
    kind: typeof e.kind == "string" ? e.kind : void 0,
    details: te(e.details) ? e.details : void 0,
    retryable: typeof e.retryable == "boolean" ? e.retryable : void 0
  }, o, d);
}
function qe(e, o) {
  if (e instanceof q) return e;
  if (te(e) && te(e.response) && te(e.response.data)) {
    const { data: d, status: u } = e.response;
    return Ne(d, o, typeof u == "number" ? u : void 0);
  }
  return e instanceof Error ? e : new q({ kind: "UNAVAILABLE" }, o);
}
async function je(e, o) {
  let d;
  try {
    d = (await e()).data;
  } catch (u) {
    throw qe(u, o);
  }
  if (d?.success === !0 && d.data !== void 0) return d.data;
  throw d?.success === !1 ? Ne(d, o) : new q({ kind: "INTERNAL", message: `${o}: invalid response envelope`, details: { code: "response_envelope_invalid" } }, o);
}
const we = {
  key_prefix_taken: "That item key prefix is already in use. Choose another prefix.",
  plugin_config_invalid: "The plugin rejected this configuration. Check its settings and try again.",
  generation_changed: "The board settings changed. Review your changes again before applying them.",
  no_parked_migration: "There is no paused migration to resume."
};
function fe(e, o) {
  const d = e instanceof q ? e.details?.code : void 0, u = e instanceof Error && e.message || o;
  return typeof d != "string" || !d.trim() ? u : `${Object.hasOwn(we, d) ? we[d] : u}
Error code: ${d}`;
}
function le(e, o, d) {
  return je(() => Oe.get(e, { params: d }), o);
}
function J(e, o, d) {
  return je(() => Oe.post(e, o), d);
}
function ye(e) {
  return e && typeof e == "object" && !Array.isArray(e) ? e : {};
}
const ie = (e) => /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}|^[\w.]+:[\w.]+$/i.test(e), de = /* @__PURE__ */ new Map();
function re(e, o = /* @__PURE__ */ new Map()) {
  if (Array.isArray(e)) return e.map((u) => re(u, o)).join(", ");
  if (typeof e == "string") return o.get("user:" + e) ?? (/^[^@\s]+@[^@\s]+$/.test(e) ? e : "Unavailable person");
  if (!e || typeof e != "object") return e ? "Unknown person" : "—";
  const d = e;
  for (const u of ["display_name", "displayName", "name", "label"]) if (typeof d[u] == "string" && d[u] && !ie(d[u])) return d[u];
  return o.get(`${d.kind ?? "user"}:${d.id}`) ?? (typeof d.email == "string" && d.email ? d.email : d.kind === "group" ? "Unavailable group" : typeof d.id == "string" ? re(d.id, o) : "Unavailable person");
}
function Ke(e) {
  if (Array.isArray(e)) return e.flatMap(Ke);
  if (typeof e == "string" && e) return [{ kind: "user", id: e }];
  if (!e || typeof e != "object") return [];
  const o = e;
  return typeof o.id == "string" && (o.kind === "user" || o.kind === "group") ? [{ kind: o.kind, id: o.id }] : [];
}
async function Qe(e, o) {
  const d = [...new Map(o.map((i) => [`${i.kind}:${i.id}`, { type: i.kind, id: i.id }])).values()].sort((i, n) => `${i.type}:${i.id}`.localeCompare(`${n.type}:${n.id}`)), u = JSON.stringify([e, d]), h = de.get(u);
  if (h) return h;
  const c = (async () => {
    const i = /* @__PURE__ */ new Map();
    for (let n = 0; n < d.length; n += 200) {
      const t = await J(`/api/v1/work-admin/boards/${encodeURIComponent(e)}/principal_labels`, { refs: d.slice(n, n + 200) }, "Display names");
      for (const l of t.principals) l.label.trim() && !ie(l.label) && l.label !== l.id && i.set(`${l.type}:${l.id}`, l.label.trim());
    }
    return i;
  })();
  de.set(u, c);
  try {
    return await c;
  } finally {
    de.delete(u);
  }
}
function Ze(e, o) {
  const d = X(/* @__PURE__ */ new Map()), u = X("");
  let h = 0;
  return xe([e, o], async ([p, c]) => {
    const i = ++h;
    if (d.value = /* @__PURE__ */ new Map(), u.value = "", !(!p || !c.length))
      try {
        const n = await Qe(p, c);
        i === h && (d.value = n);
      } catch (n) {
        i === h && (u.value = fe(n, "Display names are unavailable."));
      }
  }, { immediate: !0, deep: !0 }), Ge(() => {
    h++, d.value.clear();
  }), {
    labels: d,
    error: u,
    label: (p) => re(p, d.value),
    remember: (p, c) => {
      c.trim() && !ie(c) && c !== p.id && d.value.set(`${p.kind}:${p.id}`, c.trim());
    }
  };
}
function se(e) {
  if (ie(e)) return "Untitled";
  const o = e.replace(/[_-]+/g, " ");
  return o.charAt(0).toUpperCase() + o.slice(1);
}
function lt(e) {
  return e.title?.trim() || se(e.code);
}
function Ie(e, o, d = re) {
  return e == null ? "—" : o?.type === "principal" ? d(e) : Array.isArray(e) ? e.map((u) => Ie(u, o, d)).join(", ") : o?.type === "option" && typeof e == "string" ? o.options?.find((u) => u.id === e)?.label || se(e) : typeof e == "boolean" ? e ? "Yes" : "No" : typeof e == "object" ? (o?.form === "ref" || o?.type === "item") && "unavailable" in e ? "Unavailable" : o?.form === "dec" && "m" in e && "e" in e && typeof e.m == "number" && typeof e.e == "number" ? (e.m * 10 ** e.e).toFixed(Math.max(0, -e.e)) : o?.form === "ref" && "ref" in e && Array.isArray(e.ref) || o?.form === "ref" && "id" in e && typeof e.id == "string" || o?.type === "item" && "item" in e && typeof e.item == "string" ? "Linked item" : JSON.stringify(e) : String(e);
}
function dt(e) {
  return ["formula", "rollup", "counter", "rank"].includes(e.type ?? "");
}
function ut(e, o) {
  const d = Ze(e, o);
  return {
    display: (u, h) => Ie(u, h, d.label),
    principalLabel: d.label,
    rememberPrincipal: d.remember,
    nameError: d.error,
    nameLabels: d.labels
  };
}
function et(e) {
  return Object.entries(ye(e.properties)).map(([o, d]) => {
    const u = ye(d);
    return { key: o, title: typeof u.title == "string" && u.title.trim() ? u.title : se(o), description: typeof u.description == "string" ? u.description : "", required: Array.isArray(e.required) && e.required.includes(o), schema: u };
  });
}
function ct(e, o) {
  const d = et(e).find((u) => o[u.key]);
  return d ? d.title + ": " + o[d.key] : "";
}
function ft(e) {
  return e.detail;
}
const tt = ["aria-label", "aria-busy"], ht = /* @__PURE__ */ _e({
  __name: "NativeDialog",
  props: {
    visible: { type: Boolean },
    label: {},
    busy: { type: Boolean },
    returnFocus: {}
  },
  emits: ["close"],
  setup(e, { emit: o }) {
    const d = e, u = o, h = X(null);
    let p = null;
    async function c() {
      await Ue();
      const n = h.value;
      if (n)
        if (d.visible && !n.open) {
          const t = n.getRootNode();
          p = d.returnFocus ?? t.activeElement, n.showModal();
        } else !d.visible && n.open && (n.close(), p?.focus());
    }
    function i(n) {
      n.preventDefault(), d.busy || u("close");
    }
    return xe(() => d.visible, c), Ve(c), Be(() => {
      h.value?.open && h.value.close(), p?.focus();
    }), (n, t) => (ue(), ce("dialog", {
      ref_key: "dialog",
      ref: h,
      class: "work-native-dialog",
      "aria-label": e.label,
      "aria-modal": "true",
      "aria-busy": e.busy || void 0,
      onCancel: i,
      onClose: t[0] || (t[0] = () => {
        e.visible && !e.busy && u("close");
      })
    }, [
      ee(n.$slots, "default")
    ], 40, tt));
  }
}), ne = "/api/v1/work", Z = (e) => `${ne}/boards/${encodeURIComponent(e)}`, Ce = {
  boards: async () => {
    const e = [];
    let o;
    do {
      const d = await le(`${ne}/boards${o ? "?after=" + encodeURIComponent(o) : ""}`, "Boards");
      e.push(...d.boards), o = d.next;
    } while (o);
    return e;
  },
  packs: () => le(`${ne}/packs`, "Packs").then((e) => e.packs),
  createBoard: (e, o, d, u = {}) => J(`${ne}/boards`, { title: e, declaration: o, idempotency_key: d, ...u }, "Create board"),
  updateBoard: (e, o) => J(`${Z(e)}/update`, o, "Update board"),
  schema: (e, o, d) => J(`${Z(e)}/get_schema`, { generation: o, ...d ? { check_plugins: !0 } : {} }, "Schema"),
  // Typed operands in conditions and transition assignments can select an item.
  query: (e, o) => J(`${Z(e)}/query`, o, "Item choices"),
  async stateCounts(e) {
    const o = /* @__PURE__ */ Object.create(null);
    let d;
    do {
      const u = await Ce.query(e, { group_by: "type", sub_group_by: "state", group_after: d, limit: 1 });
      if (u.incomplete || u.reindexing) throw new Error("Counts unavailable");
      for (const h of u.groups ?? []) {
        if (typeof h.value != "string") continue;
        const p = o[h.value] ??= /* @__PURE__ */ Object.create(null);
        for (const c of h.groups ?? []) typeof c.value == "string" && (p[c.value] = c.count);
      }
      d = u.group_after;
    } while (d);
    return o;
  },
  item: (e, o) => J(`${Z(e)}/get`, { item: o }, "Item choice"),
  async options(e) {
    const o = await le(`/api/v1/work-admin/boards/${encodeURIComponent(e)}/options`, "Configuration options");
    return {
      ...o,
      guards: Array.isArray(o.guards) ? o.guards : [],
      filters: Array.isArray(o.filters) ? o.filters : [],
      board_apps: Array.isArray(o.board_apps) ? o.board_apps : []
    };
  }
};
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
const pt = (function() {
  return (/* @__PURE__ */ (function() {
    function e(o, d, u) {
      function h(i, n) {
        if (!d[i]) {
          if (!o[i]) {
            var t = typeof require == "function" && require;
            if (!n && t) return t(i, !0);
            if (p) return p(i, !0);
            var l = new Error("Cannot find module '" + i + "'");
            throw l.code = "MODULE_NOT_FOUND", l;
          }
          var a = d[i] = { exports: {} };
          o[i][0].call(a.exports, function(f) {
            var r = o[i][1][f];
            return h(r || f);
          }, a, a.exports, e, o, d, u);
        }
        return d[i].exports;
      }
      for (var p = typeof require == "function" && require, c = 0; c < u.length; c++) h(u[c]);
      return h;
    }
    return e;
  })())({ 1: [function(e, o, d) {
    o.exports = { graphlib: e("@dagrejs/graphlib"), layout: e("./lib/layout"), debug: e("./lib/debug"), util: { time: e("./lib/util").time, notime: e("./lib/util").notime }, version: e("./lib/version") };
  }, { "./lib/debug": 6, "./lib/layout": 8, "./lib/util": 27, "./lib/version": 28, "@dagrejs/graphlib": 29 }], 2: [function(e, o, d) {
    let u = e("./greedy-fas"), h = e("./util").uniqueId;
    o.exports = { run: p, undo: i };
    function p(n) {
      (n.graph().acyclicer === "greedy" ? u(n, l(n)) : c(n)).forEach((a) => {
        let f = n.edge(a);
        n.removeEdge(a), f.forwardName = a.name, f.reversed = !0, n.setEdge(a.w, a.v, f, h("rev"));
      });
      function l(a) {
        return (f) => a.edge(f).weight;
      }
    }
    function c(n) {
      let t = [], l = {}, a = {};
      function f(r) {
        Object.hasOwn(a, r) || (a[r] = !0, l[r] = !0, n.outEdges(r).forEach((s) => {
          Object.hasOwn(l, s.w) ? t.push(s) : f(s.w);
        }), delete l[r]);
      }
      return n.nodes().forEach(f), t;
    }
    function i(n) {
      n.edges().forEach((t) => {
        let l = n.edge(t);
        if (l.reversed) {
          n.removeEdge(t);
          let a = l.forwardName;
          delete l.reversed, delete l.forwardName, n.setEdge(t.w, t.v, l, a);
        }
      });
    }
  }, { "./greedy-fas": 7, "./util": 27 }], 3: [function(e, o, d) {
    let u = e("./util");
    o.exports = h;
    function h(c) {
      function i(n) {
        let t = c.children(n), l = c.node(n);
        if (t.length && t.forEach(i), Object.hasOwn(l, "minRank")) {
          l.borderLeft = [], l.borderRight = [];
          for (let a = l.minRank, f = l.maxRank + 1; a < f; ++a)
            p(c, "borderLeft", "_bl", n, l, a), p(c, "borderRight", "_br", n, l, a);
        }
      }
      c.children().forEach(i);
    }
    function p(c, i, n, t, l, a) {
      let f = { width: 0, height: 0, rank: a, borderType: i }, r = l[i][a - 1], s = u.addDummyNode(c, "border", f, n);
      l[i][a] = s, c.setParent(s, t), r && c.setEdge(r, s, { weight: 1 });
    }
  }, { "./util": 27 }], 4: [function(e, o, d) {
    o.exports = { adjust: u, undo: h };
    function u(a) {
      let f = a.graph().rankdir.toLowerCase();
      (f === "lr" || f === "rl") && p(a);
    }
    function h(a) {
      let f = a.graph().rankdir.toLowerCase();
      (f === "bt" || f === "rl") && i(a), (f === "lr" || f === "rl") && (t(a), p(a));
    }
    function p(a) {
      a.nodes().forEach((f) => c(a.node(f))), a.edges().forEach((f) => c(a.edge(f)));
    }
    function c(a) {
      let f = a.width;
      a.width = a.height, a.height = f;
    }
    function i(a) {
      a.nodes().forEach((f) => n(a.node(f))), a.edges().forEach((f) => {
        let r = a.edge(f);
        r.points.forEach(n), Object.hasOwn(r, "y") && n(r);
      });
    }
    function n(a) {
      a.y = -a.y;
    }
    function t(a) {
      a.nodes().forEach((f) => l(a.node(f))), a.edges().forEach((f) => {
        let r = a.edge(f);
        r.points.forEach(l), Object.hasOwn(r, "x") && l(r);
      });
    }
    function l(a) {
      let f = a.x;
      a.x = a.y, a.y = f;
    }
  }, {}], 5: [function(e, o, d) {
    class u {
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
    function h(c) {
      c._prev._next = c._next, c._next._prev = c._prev, delete c._next, delete c._prev;
    }
    function p(c, i) {
      if (c !== "_next" && c !== "_prev")
        return i;
    }
    o.exports = u;
  }, {}], 6: [function(e, o, d) {
    let u = e("./util"), h = e("@dagrejs/graphlib").Graph;
    o.exports = { debugOrdering: p };
    function p(c) {
      let i = u.buildLayerMatrix(c), n = new h({ compound: !0, multigraph: !0 }).setGraph({});
      return c.nodes().forEach((t) => {
        n.setNode(t, { label: t }), n.setParent(t, "layer" + c.node(t).rank);
      }), c.edges().forEach((t) => n.setEdge(t.v, t.w, {}, t.name)), i.forEach((t, l) => {
        let a = "layer" + l;
        n.setNode(a, { rank: "same" }), t.reduce((f, r) => (n.setEdge(f, r, { style: "invis" }), r));
      }), n;
    }
  }, { "./util": 27, "@dagrejs/graphlib": 29 }], 7: [function(e, o, d) {
    let u = e("@dagrejs/graphlib").Graph, h = e("./data/list");
    o.exports = c;
    let p = () => 1;
    function c(f, r) {
      if (f.nodeCount() <= 1)
        return [];
      let s = t(f, r || p);
      return i(s.graph, s.buckets, s.zeroIdx).flatMap((g) => f.outEdges(g.v, g.w));
    }
    function i(f, r, s) {
      let m = [], g = r[r.length - 1], k = r[0], L;
      for (; f.nodeCount(); ) {
        for (; L = k.dequeue(); )
          n(f, r, s, L);
        for (; L = g.dequeue(); )
          n(f, r, s, L);
        if (f.nodeCount()) {
          for (let w = r.length - 2; w > 0; --w)
            if (L = r[w].dequeue(), L) {
              m = m.concat(n(f, r, s, L, !0));
              break;
            }
        }
      }
      return m;
    }
    function n(f, r, s, m, g) {
      let k = g ? [] : void 0;
      return f.inEdges(m.v).forEach((L) => {
        let w = f.edge(L), _ = f.node(L.v);
        g && k.push({ v: L.v, w: L.w }), _.out -= w, l(r, s, _);
      }), f.outEdges(m.v).forEach((L) => {
        let w = f.edge(L), _ = L.w, y = f.node(_);
        y.in -= w, l(r, s, y);
      }), f.removeNode(m.v), k;
    }
    function t(f, r) {
      let s = new u(), m = 0, g = 0;
      f.nodes().forEach((w) => {
        s.setNode(w, { v: w, in: 0, out: 0 });
      }), f.edges().forEach((w) => {
        let _ = s.edge(w.v, w.w) || 0, y = r(w), j = _ + y;
        s.setEdge(w.v, w.w, j), g = Math.max(g, s.node(w.v).out += y), m = Math.max(m, s.node(w.w).in += y);
      });
      let k = a(g + m + 3).map(() => new h()), L = m + 1;
      return s.nodes().forEach((w) => {
        l(k, L, s.node(w));
      }), { graph: s, buckets: k, zeroIdx: L };
    }
    function l(f, r, s) {
      s.out ? s.in ? f[s.out - s.in + r].enqueue(s) : f[f.length - 1].enqueue(s) : f[0].enqueue(s);
    }
    function a(f) {
      const r = [];
      for (let s = 0; s < f; s++)
        r.push(s);
      return r;
    }
  }, { "./data/list": 5, "@dagrejs/graphlib": 29 }], 8: [function(e, o, d) {
    let u = e("./acyclic"), h = e("./normalize"), p = e("./rank"), c = e("./util").normalizeRanks, i = e("./parent-dummy-chains"), n = e("./util").removeEmptyRanks, t = e("./nesting-graph"), l = e("./add-border-segments"), a = e("./coordinate-system"), f = e("./order"), r = e("./position"), s = e("./util"), m = e("@dagrejs/graphlib").Graph;
    o.exports = g;
    function g(E, O) {
      let I = O && O.debugTiming ? s.time : s.notime;
      I("layout", () => {
        let A = I("  buildLayoutGraph", () => b(E));
        I("  runLayout", () => k(A, I, O)), I("  updateInputGraph", () => L(E, A));
      });
    }
    function k(E, O, I) {
      O("    makeSpaceForEdgeLabels", () => v(E)), O("    removeSelfEdges", () => Te(E)), O("    acyclic", () => u.run(E)), O("    nestingGraph.run", () => t.run(E)), O("    rank", () => p(s.asNonCompoundGraph(E))), O("    injectEdgeLabelProxies", () => x(E)), O("    removeEmptyRanks", () => n(E)), O("    nestingGraph.cleanup", () => t.cleanup(E)), O("    normalizeRanks", () => c(E)), O("    assignRankMinMax", () => N(E)), O("    removeEdgeLabelProxies", () => M(E)), O("    normalize.run", () => h.run(E)), O("    parentDummyChains", () => i(E)), O("    addBorderSegments", () => l(E)), O("    order", () => f(E, I)), O("    insertSelfEdges", () => Ae(E)), O("    adjustCoordinateSystem", () => a.adjust(E)), O("    position", () => r(E)), O("    positionSelfEdges", () => Se(E)), O("    removeBorderNodes", () => z(E)), O("    normalize.undo", () => h.undo(E)), O("    fixupEdgeLabelCoords", () => G(E)), O("    undoCoordinateSystem", () => a.undo(E)), O("    translateGraph", () => P(E)), O("    assignNodeIntersects", () => D(E)), O("    reversePoints", () => Y(E)), O("    acyclic.undo", () => u.undo(E));
    }
    function L(E, O) {
      E.nodes().forEach((I) => {
        let A = E.node(I), F = O.node(I);
        A && (A.x = F.x, A.y = F.y, A.rank = F.rank, O.children(I).length && (A.width = F.width, A.height = F.height));
      }), E.edges().forEach((I) => {
        let A = E.edge(I), F = O.edge(I);
        A.points = F.points, Object.hasOwn(F, "x") && (A.x = F.x, A.y = F.y);
      }), E.graph().width = O.graph().width, E.graph().height = O.graph().height;
    }
    let w = ["nodesep", "edgesep", "ranksep", "marginx", "marginy"], _ = { ranksep: 50, edgesep: 20, nodesep: 50, rankdir: "tb" }, y = ["acyclicer", "ranker", "rankdir", "align"], j = ["width", "height", "rank"], C = { width: 0, height: 0 }, R = ["minlen", "weight", "width", "height", "labeloffset"], T = { minlen: 1, weight: 1, width: 0, height: 0, labeloffset: 10, labelpos: "r" }, S = ["labelpos"];
    function b(E) {
      let O = new m({ multigraph: !0, compound: !0 }), I = ae(E.graph());
      return O.setGraph(Object.assign({}, _, oe(I, w), s.pick(I, y))), E.nodes().forEach((A) => {
        let F = ae(E.node(A));
        const $ = oe(F, j);
        Object.keys(C).forEach((V) => {
          $[V] === void 0 && ($[V] = C[V]);
        }), O.setNode(A, $), O.setParent(A, E.parent(A));
      }), E.edges().forEach((A) => {
        let F = ae(E.edge(A));
        O.setEdge(A, Object.assign({}, T, oe(F, R), s.pick(F, S)));
      }), O;
    }
    function v(E) {
      let O = E.graph();
      O.ranksep /= 2, E.edges().forEach((I) => {
        let A = E.edge(I);
        A.minlen *= 2, A.labelpos.toLowerCase() !== "c" && (O.rankdir === "TB" || O.rankdir === "BT" ? A.width += A.labeloffset : A.height += A.labeloffset);
      });
    }
    function x(E) {
      E.edges().forEach((O) => {
        let I = E.edge(O);
        if (I.width && I.height) {
          let A = E.node(O.v), $ = { rank: (E.node(O.w).rank - A.rank) / 2 + A.rank, e: O };
          s.addDummyNode(E, "edge-proxy", $, "_ep");
        }
      });
    }
    function N(E) {
      let O = 0;
      E.nodes().forEach((I) => {
        let A = E.node(I);
        A.borderTop && (A.minRank = E.node(A.borderTop).rank, A.maxRank = E.node(A.borderBottom).rank, O = Math.max(O, A.maxRank));
      }), E.graph().maxRank = O;
    }
    function M(E) {
      E.nodes().forEach((O) => {
        let I = E.node(O);
        I.dummy === "edge-proxy" && (E.edge(I.e).labelRank = I.rank, E.removeNode(O));
      });
    }
    function P(E) {
      let O = Number.POSITIVE_INFINITY, I = 0, A = Number.POSITIVE_INFINITY, F = 0, $ = E.graph(), V = $.marginx || 0, U = $.marginy || 0;
      function he(W) {
        let B = W.x, K = W.y, pe = W.width, me = W.height;
        O = Math.min(O, B - pe / 2), I = Math.max(I, B + pe / 2), A = Math.min(A, K - me / 2), F = Math.max(F, K + me / 2);
      }
      E.nodes().forEach((W) => he(E.node(W))), E.edges().forEach((W) => {
        let B = E.edge(W);
        Object.hasOwn(B, "x") && he(B);
      }), O -= V, A -= U, E.nodes().forEach((W) => {
        let B = E.node(W);
        B.x -= O, B.y -= A;
      }), E.edges().forEach((W) => {
        let B = E.edge(W);
        B.points.forEach((K) => {
          K.x -= O, K.y -= A;
        }), Object.hasOwn(B, "x") && (B.x -= O), Object.hasOwn(B, "y") && (B.y -= A);
      }), $.width = I - O + V, $.height = F - A + U;
    }
    function D(E) {
      E.edges().forEach((O) => {
        let I = E.edge(O), A = E.node(O.v), F = E.node(O.w), $, V;
        I.points ? ($ = I.points[0], V = I.points[I.points.length - 1]) : (I.points = [], $ = F, V = A), I.points.unshift(s.intersectRect(A, $)), I.points.push(s.intersectRect(F, V));
      });
    }
    function G(E) {
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
          let I = E.node(O), A = E.node(I.borderTop), F = E.node(I.borderBottom), $ = E.node(I.borderLeft[I.borderLeft.length - 1]), V = E.node(I.borderRight[I.borderRight.length - 1]);
          I.width = Math.abs(V.x - $.x), I.height = Math.abs(F.y - A.y), I.x = $.x + I.width / 2, I.y = A.y + I.height / 2;
        }
      }), E.nodes().forEach((O) => {
        E.node(O).dummy === "border" && E.removeNode(O);
      });
    }
    function Te(E) {
      E.edges().forEach((O) => {
        if (O.v === O.w) {
          var I = E.node(O.v);
          I.selfEdges || (I.selfEdges = []), I.selfEdges.push({ e: O, label: E.edge(O) }), E.removeEdge(O);
        }
      });
    }
    function Ae(E) {
      var O = s.buildLayerMatrix(E);
      O.forEach((I) => {
        var A = 0;
        I.forEach((F, $) => {
          var V = E.node(F);
          V.order = $ + A, (V.selfEdges || []).forEach((U) => {
            s.addDummyNode(E, "selfedge", { width: U.label.width, height: U.label.height, rank: V.rank, order: $ + ++A, e: U.e, label: U.label }, "_se");
          }), delete V.selfEdges;
        });
      });
    }
    function Se(E) {
      E.nodes().forEach((O) => {
        var I = E.node(O);
        if (I.dummy === "selfedge") {
          var A = E.node(I.e.v), F = A.x + A.width / 2, $ = A.y, V = I.x - F, U = A.height / 2;
          E.setEdge(I.e, I.label), E.removeNode(O), I.label.points = [{ x: F + 2 * V / 3, y: $ - U }, { x: F + 5 * V / 6, y: $ - U }, { x: F + V, y: $ }, { x: F + 5 * V / 6, y: $ + U }, { x: F + 2 * V / 3, y: $ + U }], I.label.x = I.x, I.label.y = I.y;
        }
      });
    }
    function oe(E, O) {
      return s.mapValues(s.pick(E, O), Number);
    }
    function ae(E) {
      var O = {};
      return E && Object.entries(E).forEach(([I, A]) => {
        typeof I == "string" && (I = I.toLowerCase()), O[I] = A;
      }), O;
    }
  }, { "./acyclic": 2, "./add-border-segments": 3, "./coordinate-system": 4, "./nesting-graph": 9, "./normalize": 10, "./order": 15, "./parent-dummy-chains": 20, "./position": 22, "./rank": 24, "./util": 27, "@dagrejs/graphlib": 29 }], 9: [function(e, o, d) {
    let u = e("./util");
    o.exports = { run: h, cleanup: n };
    function h(t) {
      let l = u.addDummyNode(t, "root", {}, "_root"), a = c(t), f = Object.values(a), r = u.applyWithChunking(Math.max, f) - 1, s = 2 * r + 1;
      t.graph().nestingRoot = l, t.edges().forEach((g) => t.edge(g).minlen *= s);
      let m = i(t) + 1;
      t.children().forEach((g) => p(t, l, s, m, r, a, g)), t.graph().nodeRankFactor = s;
    }
    function p(t, l, a, f, r, s, m) {
      let g = t.children(m);
      if (!g.length) {
        m !== l && t.setEdge(l, m, { weight: 0, minlen: a });
        return;
      }
      let k = u.addBorderNode(t, "_bt"), L = u.addBorderNode(t, "_bb"), w = t.node(m);
      t.setParent(k, m), w.borderTop = k, t.setParent(L, m), w.borderBottom = L, g.forEach((_) => {
        p(t, l, a, f, r, s, _);
        let y = t.node(_), j = y.borderTop ? y.borderTop : _, C = y.borderBottom ? y.borderBottom : _, R = y.borderTop ? f : 2 * f, T = j !== C ? 1 : r - s[m] + 1;
        t.setEdge(k, j, { weight: R, minlen: T, nestingEdge: !0 }), t.setEdge(C, L, { weight: R, minlen: T, nestingEdge: !0 });
      }), t.parent(m) || t.setEdge(l, k, { weight: 0, minlen: r + s[m] });
    }
    function c(t) {
      var l = {};
      function a(f, r) {
        var s = t.children(f);
        s && s.length && s.forEach((m) => a(m, r + 1)), l[f] = r;
      }
      return t.children().forEach((f) => a(f, 1)), l;
    }
    function i(t) {
      return t.edges().reduce((l, a) => l + t.edge(a).weight, 0);
    }
    function n(t) {
      var l = t.graph();
      t.removeNode(l.nestingRoot), delete l.nestingRoot, t.edges().forEach((a) => {
        var f = t.edge(a);
        f.nestingEdge && t.removeEdge(a);
      });
    }
  }, { "./util": 27 }], 10: [function(e, o, d) {
    let u = e("./util");
    o.exports = { run: h, undo: c };
    function h(i) {
      i.graph().dummyChains = [], i.edges().forEach((n) => p(i, n));
    }
    function p(i, n) {
      let t = n.v, l = i.node(t).rank, a = n.w, f = i.node(a).rank, r = n.name, s = i.edge(n), m = s.labelRank;
      if (f === l + 1) return;
      i.removeEdge(n);
      let g, k, L;
      for (L = 0, ++l; l < f; ++L, ++l)
        s.points = [], k = { width: 0, height: 0, edgeLabel: s, edgeObj: n, rank: l }, g = u.addDummyNode(i, "edge", k, "_d"), l === m && (k.width = s.width, k.height = s.height, k.dummy = "edge-label", k.labelpos = s.labelpos), i.setEdge(t, g, { weight: s.weight }, r), L === 0 && i.graph().dummyChains.push(g), t = g;
      i.setEdge(t, a, { weight: s.weight }, r);
    }
    function c(i) {
      i.graph().dummyChains.forEach((n) => {
        let t = i.node(n), l = t.edgeLabel, a;
        for (i.setEdge(t.edgeObj, l); t.dummy; )
          a = i.successors(n)[0], i.removeNode(n), l.points.push({ x: t.x, y: t.y }), t.dummy === "edge-label" && (l.x = t.x, l.y = t.y, l.width = t.width, l.height = t.height), n = a, t = i.node(n);
      });
    }
  }, { "./util": 27 }], 11: [function(e, o, d) {
    o.exports = u;
    function u(h, p, c) {
      let i = {}, n;
      c.forEach((t) => {
        let l = h.parent(t), a, f;
        for (; l; ) {
          if (a = h.parent(l), a ? (f = i[a], i[a] = l) : (f = n, n = l), f && f !== l) {
            p.setEdge(f, l);
            return;
          }
          l = a;
        }
      });
    }
  }, {}], 12: [function(e, o, d) {
    o.exports = u;
    function u(h, p = []) {
      return p.map((c) => {
        let i = h.inEdges(c);
        if (i.length) {
          let n = i.reduce((t, l) => {
            let a = h.edge(l), f = h.node(l.v);
            return { sum: t.sum + a.weight * f.order, weight: t.weight + a.weight };
          }, { sum: 0, weight: 0 });
          return { v: c, barycenter: n.sum / n.weight, weight: n.weight };
        } else
          return { v: c };
      });
    }
  }, {}], 13: [function(e, o, d) {
    let u = e("@dagrejs/graphlib").Graph, h = e("../util");
    o.exports = p;
    function p(i, n, t, l) {
      l || (l = i.nodes());
      let a = c(i), f = new u({ compound: !0 }).setGraph({ root: a }).setDefaultNodeLabel((r) => i.node(r));
      return l.forEach((r) => {
        let s = i.node(r), m = i.parent(r);
        (s.rank === n || s.minRank <= n && n <= s.maxRank) && (f.setNode(r), f.setParent(r, m || a), i[t](r).forEach((g) => {
          let k = g.v === r ? g.w : g.v, L = f.edge(k, r), w = L !== void 0 ? L.weight : 0;
          f.setEdge(k, r, { weight: i.edge(g).weight + w });
        }), Object.hasOwn(s, "minRank") && f.setNode(r, { borderLeft: s.borderLeft[n], borderRight: s.borderRight[n] }));
      }), f;
    }
    function c(i) {
      for (var n; i.hasNode(n = h.uniqueId("_root")); ) ;
      return n;
    }
  }, { "../util": 27, "@dagrejs/graphlib": 29 }], 14: [function(e, o, d) {
    let u = e("../util").zipObject;
    o.exports = h;
    function h(c, i) {
      let n = 0;
      for (let t = 1; t < i.length; ++t)
        n += p(c, i[t - 1], i[t]);
      return n;
    }
    function p(c, i, n) {
      let t = u(n, n.map((m, g) => g)), l = i.flatMap((m) => c.outEdges(m).map((g) => ({ pos: t[g.w], weight: c.edge(g).weight })).sort((g, k) => g.pos - k.pos)), a = 1;
      for (; a < n.length; ) a <<= 1;
      let f = 2 * a - 1;
      a -= 1;
      let r = new Array(f).fill(0), s = 0;
      return l.forEach((m) => {
        let g = m.pos + a;
        r[g] += m.weight;
        let k = 0;
        for (; g > 0; )
          g % 2 && (k += r[g + 1]), g = g - 1 >> 1, r[g] += m.weight;
        s += m.weight * k;
      }), s;
    }
  }, { "../util": 27 }], 15: [function(e, o, d) {
    let u = e("./init-order"), h = e("./cross-count"), p = e("./sort-subgraph"), c = e("./build-layer-graph"), i = e("./add-subgraph-constraints"), n = e("@dagrejs/graphlib").Graph, t = e("../util");
    o.exports = l;
    function l(s, m) {
      if (m && typeof m.customOrder == "function") {
        m.customOrder(s, l);
        return;
      }
      let g = t.maxRank(s), k = a(s, t.range(1, g + 1), "inEdges"), L = a(s, t.range(g - 1, -1, -1), "outEdges"), w = u(s);
      if (r(s, w), m && m.disableOptimalOrderHeuristic)
        return;
      let _ = Number.POSITIVE_INFINITY, y;
      for (let j = 0, C = 0; C < 4; ++j, ++C) {
        f(j % 2 ? k : L, j % 4 >= 2), w = t.buildLayerMatrix(s);
        let R = h(s, w);
        R < _ && (C = 0, y = Object.assign({}, w), _ = R);
      }
      r(s, y);
    }
    function a(s, m, g) {
      const k = /* @__PURE__ */ new Map(), L = (w, _) => {
        k.has(w) || k.set(w, []), k.get(w).push(_);
      };
      for (const w of s.nodes()) {
        const _ = s.node(w);
        if (typeof _.rank == "number" && L(_.rank, w), typeof _.minRank == "number" && typeof _.maxRank == "number")
          for (let y = _.minRank; y <= _.maxRank; y++)
            y !== _.rank && L(y, w);
      }
      return m.map(function(w) {
        return c(s, w, g, k.get(w) || []);
      });
    }
    function f(s, m) {
      let g = new n();
      s.forEach(function(k) {
        let L = k.graph().root, w = p(k, L, g, m);
        w.vs.forEach((_, y) => k.node(_).order = y), i(k, g, w.vs);
      });
    }
    function r(s, m) {
      Object.values(m).forEach((g) => g.forEach((k, L) => s.node(k).order = L));
    }
  }, { "../util": 27, "./add-subgraph-constraints": 11, "./build-layer-graph": 13, "./cross-count": 14, "./init-order": 16, "./sort-subgraph": 18, "@dagrejs/graphlib": 29 }], 16: [function(e, o, d) {
    let u = e("../util");
    o.exports = h;
    function h(p) {
      let c = {}, i = p.nodes().filter((r) => !p.children(r).length), n = i.map((r) => p.node(r).rank), t = u.applyWithChunking(Math.max, n), l = u.range(t + 1).map(() => []);
      function a(r) {
        if (c[r]) return;
        c[r] = !0;
        let s = p.node(r);
        l[s.rank].push(r), p.successors(r).forEach(a);
      }
      return i.sort((r, s) => p.node(r).rank - p.node(s).rank).forEach(a), l;
    }
  }, { "../util": 27 }], 17: [function(e, o, d) {
    let u = e("../util");
    o.exports = h;
    function h(i, n) {
      let t = {};
      i.forEach((a, f) => {
        let r = t[a.v] = { indegree: 0, in: [], out: [], vs: [a.v], i: f };
        a.barycenter !== void 0 && (r.barycenter = a.barycenter, r.weight = a.weight);
      }), n.edges().forEach((a) => {
        let f = t[a.v], r = t[a.w];
        f !== void 0 && r !== void 0 && (r.indegree++, f.out.push(t[a.w]));
      });
      let l = Object.values(t).filter((a) => !a.indegree);
      return p(l);
    }
    function p(i) {
      let n = [];
      function t(a) {
        return (f) => {
          f.merged || (f.barycenter === void 0 || a.barycenter === void 0 || f.barycenter >= a.barycenter) && c(a, f);
        };
      }
      function l(a) {
        return (f) => {
          f.in.push(a), --f.indegree === 0 && i.push(f);
        };
      }
      for (; i.length; ) {
        let a = i.pop();
        n.push(a), a.in.reverse().forEach(t(a)), a.out.forEach(l(a));
      }
      return n.filter((a) => !a.merged).map((a) => u.pick(a, ["vs", "i", "barycenter", "weight"]));
    }
    function c(i, n) {
      let t = 0, l = 0;
      i.weight && (t += i.barycenter * i.weight, l += i.weight), n.weight && (t += n.barycenter * n.weight, l += n.weight), i.vs = n.vs.concat(i.vs), i.barycenter = t / l, i.weight = l, i.i = Math.min(n.i, i.i), n.merged = !0;
    }
  }, { "../util": 27 }], 18: [function(e, o, d) {
    let u = e("./barycenter"), h = e("./resolve-conflicts"), p = e("./sort");
    o.exports = c;
    function c(t, l, a, f) {
      let r = t.children(l), s = t.node(l), m = s ? s.borderLeft : void 0, g = s ? s.borderRight : void 0, k = {};
      m && (r = r.filter((y) => y !== m && y !== g));
      let L = u(t, r);
      L.forEach((y) => {
        if (t.children(y.v).length) {
          let j = c(t, y.v, a, f);
          k[y.v] = j, Object.hasOwn(j, "barycenter") && n(y, j);
        }
      });
      let w = h(L, a);
      i(w, k);
      let _ = p(w, f);
      if (m && (_.vs = [m, _.vs, g].flat(!0), t.predecessors(m).length)) {
        let y = t.node(t.predecessors(m)[0]), j = t.node(t.predecessors(g)[0]);
        Object.hasOwn(_, "barycenter") || (_.barycenter = 0, _.weight = 0), _.barycenter = (_.barycenter * _.weight + y.order + j.order) / (_.weight + 2), _.weight += 2;
      }
      return _;
    }
    function i(t, l) {
      t.forEach((a) => {
        a.vs = a.vs.flatMap((f) => l[f] ? l[f].vs : f);
      });
    }
    function n(t, l) {
      t.barycenter !== void 0 ? (t.barycenter = (t.barycenter * t.weight + l.barycenter * l.weight) / (t.weight + l.weight), t.weight += l.weight) : (t.barycenter = l.barycenter, t.weight = l.weight);
    }
  }, { "./barycenter": 12, "./resolve-conflicts": 17, "./sort": 19 }], 19: [function(e, o, d) {
    let u = e("../util");
    o.exports = h;
    function h(i, n) {
      let t = u.partition(i, (k) => Object.hasOwn(k, "barycenter")), l = t.lhs, a = t.rhs.sort((k, L) => L.i - k.i), f = [], r = 0, s = 0, m = 0;
      l.sort(c(!!n)), m = p(f, a, m), l.forEach((k) => {
        m += k.vs.length, f.push(k.vs), r += k.barycenter * k.weight, s += k.weight, m = p(f, a, m);
      });
      let g = { vs: f.flat(!0) };
      return s && (g.barycenter = r / s, g.weight = s), g;
    }
    function p(i, n, t) {
      let l;
      for (; n.length && (l = n[n.length - 1]).i <= t; )
        n.pop(), i.push(l.vs), t++;
      return t;
    }
    function c(i) {
      return (n, t) => n.barycenter < t.barycenter ? -1 : n.barycenter > t.barycenter ? 1 : i ? t.i - n.i : n.i - t.i;
    }
  }, { "../util": 27 }], 20: [function(e, o, d) {
    o.exports = u;
    function u(c) {
      let i = p(c);
      c.graph().dummyChains.forEach((n) => {
        let t = c.node(n), l = t.edgeObj, a = h(c, i, l.v, l.w), f = a.path, r = a.lca, s = 0, m = f[s], g = !0;
        for (; n !== l.w; ) {
          if (t = c.node(n), g) {
            for (; (m = f[s]) !== r && c.node(m).maxRank < t.rank; )
              s++;
            m === r && (g = !1);
          }
          if (!g) {
            for (; s < f.length - 1 && c.node(m = f[s + 1]).minRank <= t.rank; )
              s++;
            m = f[s];
          }
          c.setParent(n, m), n = c.successors(n)[0];
        }
      });
    }
    function h(c, i, n, t) {
      let l = [], a = [], f = Math.min(i[n].low, i[t].low), r = Math.max(i[n].lim, i[t].lim), s, m;
      s = n;
      do
        s = c.parent(s), l.push(s);
      while (s && (i[s].low > f || r > i[s].lim));
      for (m = s, s = t; (s = c.parent(s)) !== m; )
        a.push(s);
      return { path: l.concat(a.reverse()), lca: m };
    }
    function p(c) {
      let i = {}, n = 0;
      function t(l) {
        let a = n;
        c.children(l).forEach(t), i[l] = { low: a, lim: n++ };
      }
      return c.children().forEach(t), i;
    }
  }, {}], 21: [function(e, o, d) {
    let u = e("@dagrejs/graphlib").Graph, h = e("../util");
    o.exports = { positionX: g, findType1Conflicts: p, findType2Conflicts: c, addConflict: n, hasConflict: t, verticalAlignment: l, horizontalCompaction: a, alignCoordinates: s, findSmallestWidthAlignment: r, balance: m };
    function p(w, _) {
      let y = {};
      function j(C, R) {
        let T = 0, S = 0, b = C.length, v = R[R.length - 1];
        return R.forEach((x, N) => {
          let M = i(w, x), P = M ? w.node(M).order : b;
          (M || x === v) && (R.slice(S, N + 1).forEach((D) => {
            w.predecessors(D).forEach((G) => {
              let Y = w.node(G), z = Y.order;
              (z < T || P < z) && !(Y.dummy && w.node(D).dummy) && n(y, G, D);
            });
          }), S = N + 1, T = P);
        }), R;
      }
      return _.length && _.reduce(j), y;
    }
    function c(w, _) {
      let y = {};
      function j(R, T, S, b, v) {
        let x;
        h.range(T, S).forEach((N) => {
          x = R[N], w.node(x).dummy && w.predecessors(x).forEach((M) => {
            let P = w.node(M);
            P.dummy && (P.order < b || P.order > v) && n(y, M, x);
          });
        });
      }
      function C(R, T) {
        let S = -1, b, v = 0;
        return T.forEach((x, N) => {
          if (w.node(x).dummy === "border") {
            let M = w.predecessors(x);
            M.length && (b = w.node(M[0]).order, j(T, v, N, S, b), v = N, S = b);
          }
          j(T, v, T.length, b, R.length);
        }), T;
      }
      return _.length && _.reduce(C), y;
    }
    function i(w, _) {
      if (w.node(_).dummy)
        return w.predecessors(_).find((y) => w.node(y).dummy);
    }
    function n(w, _, y) {
      if (_ > y) {
        let C = _;
        _ = y, y = C;
      }
      let j = w[_];
      j || (w[_] = j = {}), j[y] = !0;
    }
    function t(w, _, y) {
      if (_ > y) {
        let j = _;
        _ = y, y = j;
      }
      return !!w[_] && Object.hasOwn(w[_], y);
    }
    function l(w, _, y, j) {
      let C = {}, R = {}, T = {};
      return _.forEach((S) => {
        S.forEach((b, v) => {
          C[b] = b, R[b] = b, T[b] = v;
        });
      }), _.forEach((S) => {
        let b = -1;
        S.forEach((v) => {
          let x = j(v);
          if (x.length) {
            x = x.sort((M, P) => T[M] - T[P]);
            let N = (x.length - 1) / 2;
            for (let M = Math.floor(N), P = Math.ceil(N); M <= P; ++M) {
              let D = x[M];
              R[v] === v && b < T[D] && !t(y, v, D) && (R[D] = v, R[v] = C[v] = C[D], b = T[D]);
            }
          }
        });
      }), { root: C, align: R };
    }
    function a(w, _, y, j, C) {
      let R = {}, T = f(w, _, y, C), S = C ? "borderLeft" : "borderRight";
      function b(N, M) {
        let P = T.nodes(), D = P.pop(), G = {};
        for (; D; )
          G[D] ? N(D) : (G[D] = !0, P.push(D), P = P.concat(M(D))), D = P.pop();
      }
      function v(N) {
        R[N] = T.inEdges(N).reduce((M, P) => Math.max(M, R[P.v] + T.edge(P)), 0);
      }
      function x(N) {
        let M = T.outEdges(N).reduce((D, G) => Math.min(D, R[G.w] - T.edge(G)), Number.POSITIVE_INFINITY), P = w.node(N);
        M !== Number.POSITIVE_INFINITY && P.borderType !== S && (R[N] = Math.max(R[N], M));
      }
      return b(v, T.predecessors.bind(T)), b(x, T.successors.bind(T)), Object.keys(j).forEach((N) => R[N] = R[y[N]]), R;
    }
    function f(w, _, y, j) {
      let C = new u(), R = w.graph(), T = k(R.nodesep, R.edgesep, j);
      return _.forEach((S) => {
        let b;
        S.forEach((v) => {
          let x = y[v];
          if (C.setNode(x), b) {
            var N = y[b], M = C.edge(N, x);
            C.setEdge(N, x, Math.max(T(w, v, b), M || 0));
          }
          b = v;
        });
      }), C;
    }
    function r(w, _) {
      return Object.values(_).reduce((y, j) => {
        let C = Number.NEGATIVE_INFINITY, R = Number.POSITIVE_INFINITY;
        Object.entries(j).forEach(([S, b]) => {
          let v = L(w, S) / 2;
          C = Math.max(b + v, C), R = Math.min(b - v, R);
        });
        const T = C - R;
        return T < y[0] && (y = [T, j]), y;
      }, [Number.POSITIVE_INFINITY, null])[1];
    }
    function s(w, _) {
      let y = Object.values(_), j = h.applyWithChunking(Math.min, y), C = h.applyWithChunking(Math.max, y);
      ["u", "d"].forEach((R) => {
        ["l", "r"].forEach((T) => {
          let S = R + T, b = w[S];
          if (b === _) return;
          let v = Object.values(b), x = j - h.applyWithChunking(Math.min, v);
          T !== "l" && (x = C - h.applyWithChunking(Math.max, v)), x && (w[S] = h.mapValues(b, (N) => N + x));
        });
      });
    }
    function m(w, _) {
      return h.mapValues(w.ul, (y, j) => {
        if (_)
          return w[_.toLowerCase()][j];
        {
          let C = Object.values(w).map((R) => R[j]).sort((R, T) => R - T);
          return (C[1] + C[2]) / 2;
        }
      });
    }
    function g(w) {
      let _ = h.buildLayerMatrix(w), y = Object.assign(p(w, _), c(w, _)), j = {}, C;
      ["u", "d"].forEach((T) => {
        C = T === "u" ? _ : Object.values(_).reverse(), ["l", "r"].forEach((S) => {
          S === "r" && (C = C.map((N) => Object.values(N).reverse()));
          let b = (T === "u" ? w.predecessors : w.successors).bind(w), v = l(w, C, y, b), x = a(w, C, v.root, v.align, S === "r");
          S === "r" && (x = h.mapValues(x, (N) => -N)), j[T + S] = x;
        });
      });
      let R = r(w, j);
      return s(j, R), m(j, w.graph().align);
    }
    function k(w, _, y) {
      return (j, C, R) => {
        let T = j.node(C), S = j.node(R), b = 0, v;
        if (b += T.width / 2, Object.hasOwn(T, "labelpos"))
          switch (T.labelpos.toLowerCase()) {
            case "l":
              v = -T.width / 2;
              break;
            case "r":
              v = T.width / 2;
              break;
          }
        if (v && (b += y ? v : -v), v = 0, b += (T.dummy ? _ : w) / 2, b += (S.dummy ? _ : w) / 2, b += S.width / 2, Object.hasOwn(S, "labelpos"))
          switch (S.labelpos.toLowerCase()) {
            case "l":
              v = S.width / 2;
              break;
            case "r":
              v = -S.width / 2;
              break;
          }
        return v && (b += y ? v : -v), v = 0, b;
      };
    }
    function L(w, _) {
      return w.node(_).width;
    }
  }, { "../util": 27, "@dagrejs/graphlib": 29 }], 22: [function(e, o, d) {
    let u = e("../util"), h = e("./bk").positionX;
    o.exports = p;
    function p(i) {
      i = u.asNonCompoundGraph(i), c(i), Object.entries(h(i)).forEach(([n, t]) => i.node(n).x = t);
    }
    function c(i) {
      let n = u.buildLayerMatrix(i), t = i.graph().ranksep, l = 0;
      n.forEach((a) => {
        const f = a.reduce((r, s) => {
          const m = i.node(s).height;
          return r > m ? r : m;
        }, 0);
        a.forEach((r) => i.node(r).y = l + f / 2), l += f + t;
      });
    }
  }, { "../util": 27, "./bk": 21 }], 23: [function(e, o, d) {
    var u = e("@dagrejs/graphlib").Graph, h = e("./util").slack;
    o.exports = p;
    function p(t) {
      var l = new u({ directed: !1 }), a = t.nodes()[0], f = t.nodeCount();
      l.setNode(a, {});
      for (var r, s; c(l, t) < f; )
        r = i(l, t), s = l.hasNode(r.v) ? h(t, r) : -h(t, r), n(l, t, s);
      return l;
    }
    function c(t, l) {
      function a(f) {
        l.nodeEdges(f).forEach((r) => {
          var s = r.v, m = f === s ? r.w : s;
          !t.hasNode(m) && !h(l, r) && (t.setNode(m, {}), t.setEdge(f, m, {}), a(m));
        });
      }
      return t.nodes().forEach(a), t.nodeCount();
    }
    function i(t, l) {
      return l.edges().reduce((f, r) => {
        let s = Number.POSITIVE_INFINITY;
        return t.hasNode(r.v) !== t.hasNode(r.w) && (s = h(l, r)), s < f[0] ? [s, r] : f;
      }, [Number.POSITIVE_INFINITY, null])[1];
    }
    function n(t, l, a) {
      t.nodes().forEach((f) => l.node(f).rank += a);
    }
  }, { "./util": 26, "@dagrejs/graphlib": 29 }], 24: [function(e, o, d) {
    var u = e("./util"), h = u.longestPath, p = e("./feasible-tree"), c = e("./network-simplex");
    o.exports = i;
    function i(a) {
      var f = a.graph().ranker;
      if (f instanceof Function)
        return f(a);
      switch (a.graph().ranker) {
        case "network-simplex":
          l(a);
          break;
        case "tight-tree":
          t(a);
          break;
        case "longest-path":
          n(a);
          break;
        case "none":
          break;
        default:
          l(a);
      }
    }
    var n = h;
    function t(a) {
      h(a), p(a);
    }
    function l(a) {
      c(a);
    }
  }, { "./feasible-tree": 23, "./network-simplex": 25, "./util": 26 }], 25: [function(e, o, d) {
    var u = e("./feasible-tree"), h = e("./util").slack, p = e("./util").longestPath, c = e("@dagrejs/graphlib").alg.preorder, i = e("@dagrejs/graphlib").alg.postorder, n = e("../util").simplify;
    o.exports = t, t.initLowLimValues = r, t.initCutValues = l, t.calcCutValue = f, t.leaveEdge = m, t.enterEdge = g, t.exchangeEdges = k;
    function t(y) {
      y = n(y), p(y);
      var j = u(y);
      r(j), l(j, y);
      for (var C, R; C = m(j); )
        R = g(j, y, C), k(j, y, C, R);
    }
    function l(y, j) {
      var C = i(y, y.nodes());
      C = C.slice(0, C.length - 1), C.forEach((R) => a(y, j, R));
    }
    function a(y, j, C) {
      var R = y.node(C), T = R.parent;
      y.edge(C, T).cutvalue = f(y, j, C);
    }
    function f(y, j, C) {
      var R = y.node(C), T = R.parent, S = !0, b = j.edge(C, T), v = 0;
      return b || (S = !1, b = j.edge(T, C)), v = b.weight, j.nodeEdges(C).forEach((x) => {
        var N = x.v === C, M = N ? x.w : x.v;
        if (M !== T) {
          var P = N === S, D = j.edge(x).weight;
          if (v += P ? D : -D, w(y, C, M)) {
            var G = y.edge(C, M).cutvalue;
            v += P ? -G : G;
          }
        }
      }), v;
    }
    function r(y, j) {
      arguments.length < 2 && (j = y.nodes()[0]), s(y, {}, 1, j);
    }
    function s(y, j, C, R, T) {
      var S = C, b = y.node(R);
      return j[R] = !0, y.neighbors(R).forEach((v) => {
        Object.hasOwn(j, v) || (C = s(y, j, C, v, R));
      }), b.low = S, b.lim = C++, T ? b.parent = T : delete b.parent, C;
    }
    function m(y) {
      return y.edges().find((j) => y.edge(j).cutvalue < 0);
    }
    function g(y, j, C) {
      var R = C.v, T = C.w;
      j.hasEdge(R, T) || (R = C.w, T = C.v);
      var S = y.node(R), b = y.node(T), v = S, x = !1;
      S.lim > b.lim && (v = b, x = !0);
      var N = j.edges().filter((M) => x === _(y, y.node(M.v), v) && x !== _(y, y.node(M.w), v));
      return N.reduce((M, P) => h(j, P) < h(j, M) ? P : M);
    }
    function k(y, j, C, R) {
      var T = C.v, S = C.w;
      y.removeEdge(T, S), y.setEdge(R.v, R.w, {}), r(y), l(y, j), L(y, j);
    }
    function L(y, j) {
      var C = y.nodes().find((T) => !j.node(T).parent), R = c(y, C);
      R = R.slice(1), R.forEach((T) => {
        var S = y.node(T).parent, b = j.edge(T, S), v = !1;
        b || (b = j.edge(S, T), v = !0), j.node(T).rank = j.node(S).rank + (v ? b.minlen : -b.minlen);
      });
    }
    function w(y, j, C) {
      return y.hasEdge(j, C);
    }
    function _(y, j, C) {
      return C.low <= j.lim && j.lim <= C.lim;
    }
  }, { "../util": 27, "./feasible-tree": 23, "./util": 26, "@dagrejs/graphlib": 29 }], 26: [function(e, o, d) {
    const { applyWithChunking: u } = e("../util");
    o.exports = { longestPath: h, slack: p };
    function h(c) {
      var i = {};
      function n(t) {
        var l = c.node(t);
        if (Object.hasOwn(i, t))
          return l.rank;
        i[t] = !0;
        let a = c.outEdges(t).map((r) => r == null ? Number.POSITIVE_INFINITY : n(r.w) - c.edge(r).minlen);
        var f = u(Math.min, a);
        return f === Number.POSITIVE_INFINITY && (f = 0), l.rank = f;
      }
      c.sources().forEach(n);
    }
    function p(c, i) {
      return c.node(i.w).rank - c.node(i.v).rank - c.edge(i).minlen;
    }
  }, { "../util": 27 }], 27: [function(e, o, d) {
    let u = e("@dagrejs/graphlib").Graph;
    o.exports = { addBorderNode: r, addDummyNode: h, applyWithChunking: g, asNonCompoundGraph: c, buildLayerMatrix: l, intersectRect: t, mapValues: T, maxRank: k, normalizeRanks: a, notime: _, partition: L, pick: R, predecessorWeights: n, range: C, removeEmptyRanks: f, simplify: p, successorWeights: i, time: w, uniqueId: j, zipObject: S };
    function h(b, v, x, N) {
      for (var M = N; b.hasNode(M); )
        M = j(N);
      return x.dummy = v, b.setNode(M, x), M;
    }
    function p(b) {
      let v = new u().setGraph(b.graph());
      return b.nodes().forEach((x) => v.setNode(x, b.node(x))), b.edges().forEach((x) => {
        let N = v.edge(x.v, x.w) || { weight: 0, minlen: 1 }, M = b.edge(x);
        v.setEdge(x.v, x.w, { weight: N.weight + M.weight, minlen: Math.max(N.minlen, M.minlen) });
      }), v;
    }
    function c(b) {
      let v = new u({ multigraph: b.isMultigraph() }).setGraph(b.graph());
      return b.nodes().forEach((x) => {
        b.children(x).length || v.setNode(x, b.node(x));
      }), b.edges().forEach((x) => {
        v.setEdge(x, b.edge(x));
      }), v;
    }
    function i(b) {
      let v = b.nodes().map((x) => {
        let N = {};
        return b.outEdges(x).forEach((M) => {
          N[M.w] = (N[M.w] || 0) + b.edge(M).weight;
        }), N;
      });
      return S(b.nodes(), v);
    }
    function n(b) {
      let v = b.nodes().map((x) => {
        let N = {};
        return b.inEdges(x).forEach((M) => {
          N[M.v] = (N[M.v] || 0) + b.edge(M).weight;
        }), N;
      });
      return S(b.nodes(), v);
    }
    function t(b, v) {
      let x = b.x, N = b.y, M = v.x - x, P = v.y - N, D = b.width / 2, G = b.height / 2;
      if (!M && !P)
        throw new Error("Not possible to find intersection inside of the rectangle");
      let Y, z;
      return Math.abs(P) * D > Math.abs(M) * G ? (P < 0 && (G = -G), Y = G * M / P, z = G) : (M < 0 && (D = -D), Y = D, z = D * P / M), { x: x + Y, y: N + z };
    }
    function l(b) {
      let v = C(k(b) + 1).map(() => []);
      return b.nodes().forEach((x) => {
        let N = b.node(x), M = N.rank;
        M !== void 0 && (v[M][N.order] = x);
      }), v;
    }
    function a(b) {
      let v = b.nodes().map((N) => {
        let M = b.node(N).rank;
        return M === void 0 ? Number.MAX_VALUE : M;
      }), x = g(Math.min, v);
      b.nodes().forEach((N) => {
        let M = b.node(N);
        Object.hasOwn(M, "rank") && (M.rank -= x);
      });
    }
    function f(b) {
      let v = b.nodes().map((D) => b.node(D).rank), x = g(Math.min, v), N = [];
      b.nodes().forEach((D) => {
        let G = b.node(D).rank - x;
        N[G] || (N[G] = []), N[G].push(D);
      });
      let M = 0, P = b.graph().nodeRankFactor;
      Array.from(N).forEach((D, G) => {
        D === void 0 && G % P !== 0 ? --M : D !== void 0 && M && D.forEach((Y) => b.node(Y).rank += M);
      });
    }
    function r(b, v, x, N) {
      let M = { width: 0, height: 0 };
      return arguments.length >= 4 && (M.rank = x, M.order = N), h(b, "border", M, v);
    }
    function s(b, v = m) {
      const x = [];
      for (let N = 0; N < b.length; N += v) {
        const M = b.slice(N, N + v);
        x.push(M);
      }
      return x;
    }
    const m = 65535;
    function g(b, v) {
      if (v.length > m) {
        const x = s(v);
        return b.apply(null, x.map((N) => b.apply(null, N)));
      } else
        return b.apply(null, v);
    }
    function k(b) {
      const x = b.nodes().map((N) => {
        let M = b.node(N).rank;
        return M === void 0 ? Number.MIN_VALUE : M;
      });
      return g(Math.max, x);
    }
    function L(b, v) {
      let x = { lhs: [], rhs: [] };
      return b.forEach((N) => {
        v(N) ? x.lhs.push(N) : x.rhs.push(N);
      }), x;
    }
    function w(b, v) {
      let x = Date.now();
      try {
        return v();
      } finally {
        console.log(b + " time: " + (Date.now() - x) + "ms");
      }
    }
    function _(b, v) {
      return v();
    }
    let y = 0;
    function j(b) {
      var v = ++y;
      return b + ("" + v);
    }
    function C(b, v, x = 1) {
      v == null && (v = b, b = 0);
      let N = (P) => P < v;
      x < 0 && (N = (P) => v < P);
      const M = [];
      for (let P = b; N(P); P += x)
        M.push(P);
      return M;
    }
    function R(b, v) {
      const x = {};
      for (const N of v)
        b[N] !== void 0 && (x[N] = b[N]);
      return x;
    }
    function T(b, v) {
      let x = v;
      return typeof v == "string" && (x = (N) => N[v]), Object.entries(b).reduce((N, [M, P]) => (N[M] = x(P, M), N), {});
    }
    function S(b, v) {
      return b.reduce((x, N, M) => (x[N] = v[M], x), {});
    }
  }, { "@dagrejs/graphlib": 29 }], 28: [function(e, o, d) {
    o.exports = "1.1.8";
  }, {}], 29: [function(e, o, d) {
    var u = e("./lib");
    o.exports = { Graph: u.Graph, json: e("./lib/json"), alg: e("./lib/alg"), version: u.version };
  }, { "./lib": 45, "./lib/alg": 36, "./lib/json": 46 }], 30: [function(e, o, d) {
    o.exports = u;
    function u(h) {
      var p = {}, c = [], i;
      function n(t) {
        Object.hasOwn(p, t) || (p[t] = !0, i.push(t), h.successors(t).forEach(n), h.predecessors(t).forEach(n));
      }
      return h.nodes().forEach(function(t) {
        i = [], n(t), i.length && c.push(i);
      }), c;
    }
  }, {}], 31: [function(e, o, d) {
    o.exports = u;
    function u(i, n, t) {
      Array.isArray(n) || (n = [n]);
      var l = i.isDirected() ? (s) => i.successors(s) : (s) => i.neighbors(s), a = t === "post" ? h : p, f = [], r = {};
      return n.forEach((s) => {
        if (!i.hasNode(s))
          throw new Error("Graph does not have node: " + s);
        a(s, l, r, f);
      }), f;
    }
    function h(i, n, t, l) {
      for (var a = [[i, !1]]; a.length > 0; ) {
        var f = a.pop();
        f[1] ? l.push(f[0]) : Object.hasOwn(t, f[0]) || (t[f[0]] = !0, a.push([f[0], !0]), c(n(f[0]), (r) => a.push([r, !1])));
      }
    }
    function p(i, n, t, l) {
      for (var a = [i]; a.length > 0; ) {
        var f = a.pop();
        Object.hasOwn(t, f) || (t[f] = !0, l.push(f), c(n(f), (r) => a.push(r)));
      }
    }
    function c(i, n) {
      for (var t = i.length; t--; )
        n(i[t], t, i);
      return i;
    }
  }, {}], 32: [function(e, o, d) {
    var u = e("./dijkstra");
    o.exports = h;
    function h(p, c, i) {
      return p.nodes().reduce(function(n, t) {
        return n[t] = u(p, t, c, i), n;
      }, {});
    }
  }, { "./dijkstra": 33 }], 33: [function(e, o, d) {
    var u = e("../data/priority-queue");
    o.exports = p;
    var h = () => 1;
    function p(i, n, t, l) {
      return c(i, String(n), t || h, l || function(a) {
        return i.outEdges(a);
      });
    }
    function c(i, n, t, l) {
      var a = {}, f = new u(), r, s, m = function(g) {
        var k = g.v !== r ? g.v : g.w, L = a[k], w = t(g), _ = s.distance + w;
        if (w < 0)
          throw new Error("dijkstra does not allow negative edge weights. Bad edge: " + g + " Weight: " + w);
        _ < L.distance && (L.distance = _, L.predecessor = r, f.decrease(k, _));
      };
      for (i.nodes().forEach(function(g) {
        var k = g === n ? 0 : Number.POSITIVE_INFINITY;
        a[g] = { distance: k }, f.add(g, k);
      }); f.size() > 0 && (r = f.removeMin(), s = a[r], s.distance !== Number.POSITIVE_INFINITY); )
        l(r).forEach(m);
      return a;
    }
  }, { "../data/priority-queue": 43 }], 34: [function(e, o, d) {
    var u = e("./tarjan");
    o.exports = h;
    function h(p) {
      return u(p).filter(function(c) {
        return c.length > 1 || c.length === 1 && p.hasEdge(c[0], c[0]);
      });
    }
  }, { "./tarjan": 41 }], 35: [function(e, o, d) {
    o.exports = h;
    var u = () => 1;
    function h(c, i, n) {
      return p(c, i || u, n || function(t) {
        return c.outEdges(t);
      });
    }
    function p(c, i, n) {
      var t = {}, l = c.nodes();
      return l.forEach(function(a) {
        t[a] = {}, t[a][a] = { distance: 0 }, l.forEach(function(f) {
          a !== f && (t[a][f] = { distance: Number.POSITIVE_INFINITY });
        }), n(a).forEach(function(f) {
          var r = f.v === a ? f.w : f.v, s = i(f);
          t[a][r] = { distance: s, predecessor: a };
        });
      }), l.forEach(function(a) {
        var f = t[a];
        l.forEach(function(r) {
          var s = t[r];
          l.forEach(function(m) {
            var g = s[a], k = f[m], L = s[m], w = g.distance + k.distance;
            w < L.distance && (L.distance = w, L.predecessor = k.predecessor);
          });
        });
      }), t;
    }
  }, {}], 36: [function(e, o, d) {
    o.exports = { components: e("./components"), dijkstra: e("./dijkstra"), dijkstraAll: e("./dijkstra-all"), findCycles: e("./find-cycles"), floydWarshall: e("./floyd-warshall"), isAcyclic: e("./is-acyclic"), postorder: e("./postorder"), preorder: e("./preorder"), prim: e("./prim"), tarjan: e("./tarjan"), topsort: e("./topsort") };
  }, { "./components": 30, "./dijkstra": 33, "./dijkstra-all": 32, "./find-cycles": 34, "./floyd-warshall": 35, "./is-acyclic": 37, "./postorder": 38, "./preorder": 39, "./prim": 40, "./tarjan": 41, "./topsort": 42 }], 37: [function(e, o, d) {
    var u = e("./topsort");
    o.exports = h;
    function h(p) {
      try {
        u(p);
      } catch (c) {
        if (c instanceof u.CycleException)
          return !1;
        throw c;
      }
      return !0;
    }
  }, { "./topsort": 42 }], 38: [function(e, o, d) {
    var u = e("./dfs");
    o.exports = h;
    function h(p, c) {
      return u(p, c, "post");
    }
  }, { "./dfs": 31 }], 39: [function(e, o, d) {
    var u = e("./dfs");
    o.exports = h;
    function h(p, c) {
      return u(p, c, "pre");
    }
  }, { "./dfs": 31 }], 40: [function(e, o, d) {
    var u = e("../graph"), h = e("../data/priority-queue");
    o.exports = p;
    function p(c, i) {
      var n = new u(), t = {}, l = new h(), a;
      function f(s) {
        var m = s.v === a ? s.w : s.v, g = l.priority(m);
        if (g !== void 0) {
          var k = i(s);
          k < g && (t[m] = a, l.decrease(m, k));
        }
      }
      if (c.nodeCount() === 0)
        return n;
      c.nodes().forEach(function(s) {
        l.add(s, Number.POSITIVE_INFINITY), n.setNode(s);
      }), l.decrease(c.nodes()[0], 0);
      for (var r = !1; l.size() > 0; ) {
        if (a = l.removeMin(), Object.hasOwn(t, a))
          n.setEdge(a, t[a]);
        else {
          if (r)
            throw new Error("Input graph is not connected: " + c);
          r = !0;
        }
        c.nodeEdges(a).forEach(f);
      }
      return n;
    }
  }, { "../data/priority-queue": 43, "../graph": 44 }], 41: [function(e, o, d) {
    o.exports = u;
    function u(h) {
      var p = 0, c = [], i = {}, n = [];
      function t(l) {
        var a = i[l] = { onStack: !0, lowlink: p, index: p++ };
        if (c.push(l), h.successors(l).forEach(function(s) {
          Object.hasOwn(i, s) ? i[s].onStack && (a.lowlink = Math.min(a.lowlink, i[s].index)) : (t(s), a.lowlink = Math.min(a.lowlink, i[s].lowlink));
        }), a.lowlink === a.index) {
          var f = [], r;
          do
            r = c.pop(), i[r].onStack = !1, f.push(r);
          while (l !== r);
          n.push(f);
        }
      }
      return h.nodes().forEach(function(l) {
        Object.hasOwn(i, l) || t(l);
      }), n;
    }
  }, {}], 42: [function(e, o, d) {
    function u(p) {
      var c = {}, i = {}, n = [];
      function t(l) {
        if (Object.hasOwn(i, l))
          throw new h();
        Object.hasOwn(c, l) || (i[l] = !0, c[l] = !0, p.predecessors(l).forEach(t), delete i[l], n.push(l));
      }
      if (p.sinks().forEach(t), Object.keys(c).length !== p.nodeCount())
        throw new h();
      return n;
    }
    class h extends Error {
      constructor() {
        super(...arguments);
      }
    }
    o.exports = u, u.CycleException = h;
  }, {}], 43: [function(e, o, d) {
    class u {
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
        var c = this._keyIndices[p];
        if (c !== void 0)
          return this._arr[c].priority;
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
      add(p, c) {
        var i = this._keyIndices;
        if (p = String(p), !Object.hasOwn(i, p)) {
          var n = this._arr, t = n.length;
          return i[p] = t, n.push({ key: p, priority: c }), this._decrease(t), !0;
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
      decrease(p, c) {
        var i = this._keyIndices[p];
        if (c > this._arr[i].priority)
          throw new Error("New priority is greater than current priority. Key: " + p + " Old: " + this._arr[i].priority + " New: " + c);
        this._arr[i].priority = c, this._decrease(i);
      }
      _heapify(p) {
        var c = this._arr, i = 2 * p, n = i + 1, t = p;
        i < c.length && (t = c[i].priority < c[t].priority ? i : t, n < c.length && (t = c[n].priority < c[t].priority ? n : t), t !== p && (this._swap(p, t), this._heapify(t)));
      }
      _decrease(p) {
        for (var c = this._arr, i = c[p].priority, n; p !== 0 && (n = p >> 1, !(c[n].priority < i)); )
          this._swap(p, n), p = n;
      }
      _swap(p, c) {
        var i = this._arr, n = this._keyIndices, t = i[p], l = i[c];
        i[p] = l, i[c] = t, n[l.key] = p, n[t.key] = c;
      }
    }
    o.exports = u;
  }, {}], 44: [function(e, o, d) {
    var u = "\0", h = "\0", p = "";
    class c {
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
        var m = arguments, g = this;
        return r.forEach(function(k) {
          m.length > 1 ? g.setNode(k, s) : g.setNode(k);
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
          var m = (g) => s.removeEdge(s._edgeObjs[g]);
          delete this._nodes[r], this._isCompound && (this._removeFromParentsChildList(r), delete this._parent[r], this.children(r).forEach(function(g) {
            s.setParent(g);
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
          const g = new Set(s);
          for (var m of this.successors(r))
            g.add(m);
          return Array.from(g.values());
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
        var g = {};
        function k(L) {
          var w = m.parent(L);
          return w === void 0 || s.hasNode(w) ? (g[L] = w, w) : w in g ? g[w] : k(w);
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
        var m = this, g = arguments;
        return r.reduce(function(k, L) {
          return g.length > 1 ? m.setEdge(k, L, s) : m.setEdge(k, L), L;
        }), this;
      }
      /**
         * Creates or updates the label for the edge (v, w) with the optionally supplied
         * name. If label is supplied it is set as the value for the edge. If label is not
         * supplied and the edge was created by this call then the default edge label will
         * be assigned. The name parameter is only useful with multigraphs.
         */
      setEdge() {
        var r, s, m, g, k = !1, L = arguments[0];
        typeof L == "object" && L !== null && "v" in L ? (r = L.v, s = L.w, m = L.name, arguments.length === 2 && (g = arguments[1], k = !0)) : (r = L, s = arguments[1], m = arguments[3], arguments.length > 2 && (g = arguments[2], k = !0)), r = "" + r, s = "" + s, m !== void 0 && (m = "" + m);
        var w = t(this._isDirected, r, s, m);
        if (Object.hasOwn(this._edgeLabels, w))
          return k && (this._edgeLabels[w] = g), this;
        if (m !== void 0 && !this._isMultigraph)
          throw new Error("Cannot set a named edge when isMultigraph = false");
        this.setNode(r), this.setNode(s), this._edgeLabels[w] = k ? g : this._defaultEdgeLabelFn(r, s, m);
        var _ = l(this._isDirected, r, s, m);
        return r = _.v, s = _.w, Object.freeze(_), this._edgeObjs[w] = _, i(this._preds[s], r), i(this._sucs[r], s), this._in[s][w] = _, this._out[r][w] = _, this._edgeCount++, this;
      }
      /**
         * Gets the label for the specified edge.
         * Complexity: O(1).
         */
      edge(r, s, m) {
        var g = arguments.length === 1 ? a(this._isDirected, arguments[0]) : t(this._isDirected, r, s, m);
        return this._edgeLabels[g];
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
        var g = arguments.length === 1 ? a(this._isDirected, arguments[0]) : t(this._isDirected, r, s, m);
        return Object.hasOwn(this._edgeLabels, g);
      }
      /**
         * Removes the specified edge from the graph. No subgraphs are considered.
         * Complexity: O(1).
         */
      removeEdge(r, s, m) {
        var g = arguments.length === 1 ? a(this._isDirected, arguments[0]) : t(this._isDirected, r, s, m), k = this._edgeObjs[g];
        return k && (r = k.v, s = k.w, delete this._edgeLabels[g], delete this._edgeObjs[g], n(this._preds[s], r), n(this._sucs[r], s), delete this._in[s][g], delete this._out[r][g], this._edgeCount--), this;
      }
      /**
         * Return all edges that point to the node v. Optionally filters those edges down to just those
         * coming from node u. Behavior is undefined for undirected graphs - use nodeEdges instead.
         * Complexity: O(|E|).
         */
      inEdges(r, s) {
        var m = this._in[r];
        if (m) {
          var g = Object.values(m);
          return s ? g.filter((k) => k.v === s) : g;
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
          var g = Object.values(m);
          return s ? g.filter((k) => k.w === s) : g;
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
    function i(f, r) {
      f[r] ? f[r]++ : f[r] = 1;
    }
    function n(f, r) {
      --f[r] || delete f[r];
    }
    function t(f, r, s, m) {
      var g = "" + r, k = "" + s;
      if (!f && g > k) {
        var L = g;
        g = k, k = L;
      }
      return g + p + k + p + (m === void 0 ? u : m);
    }
    function l(f, r, s, m) {
      var g = "" + r, k = "" + s;
      if (!f && g > k) {
        var L = g;
        g = k, k = L;
      }
      var w = { v: g, w: k };
      return m && (w.name = m), w;
    }
    function a(f, r) {
      return t(f, r.v, r.w, r.name);
    }
    o.exports = c;
  }, {}], 45: [function(e, o, d) {
    o.exports = { Graph: e("./graph"), version: e("./version") };
  }, { "./graph": 44, "./version": 47 }], 46: [function(e, o, d) {
    var u = e("./graph");
    o.exports = { write: h, read: i };
    function h(n) {
      var t = { options: { directed: n.isDirected(), multigraph: n.isMultigraph(), compound: n.isCompound() }, nodes: p(n), edges: c(n) };
      return n.graph() !== void 0 && (t.value = structuredClone(n.graph())), t;
    }
    function p(n) {
      return n.nodes().map(function(t) {
        var l = n.node(t), a = n.parent(t), f = { v: t };
        return l !== void 0 && (f.value = l), a !== void 0 && (f.parent = a), f;
      });
    }
    function c(n) {
      return n.edges().map(function(t) {
        var l = n.edge(t), a = { v: t.v, w: t.w };
        return t.name !== void 0 && (a.name = t.name), l !== void 0 && (a.value = l), a;
      });
    }
    function i(n) {
      var t = new u(n.options).setGraph(n.value);
      return n.nodes.forEach(function(l) {
        t.setNode(l.v, l.value), l.parent && t.setParent(l.v, l.parent);
      }), n.edges.forEach(function(l) {
        t.setEdge({ v: l.v, w: l.w, name: l.name }, l.value);
      }), t;
    }
  }, { "./graph": 44 }], 47: [function(e, o, d) {
    o.exports = "2.2.4";
  }, {}] }, {}, [1])(1);
})(), mt = ["unstarted", "started", "completed", "canceled"];
function gt(e, o) {
  let d = 1;
  const u = () => `${e.slice(0, 40 - String(d).length - 1)}_${d}`;
  for (; o.some((h) => h.id === u()); ) d++;
  return u();
}
function bt(e, o) {
  return [
    ...e.initial === o.id ? ["the initial state"] : [],
    ...(e.transitions ?? []).filter((d) => d.to === o.id || d.from !== "any" && d.from.includes(o.id)).map((d) => `transition ${nt(d)}`),
    ...e.states.filter((d) => d.regions?.some((u) => u.initial === o.id)).map((d) => `lanes in ${Le(d)}`),
    ...Object.entries(e.map ?? {}).filter(([, d]) => d === o.id).map(() => "existing item migration")
  ];
}
function wt(e, o) {
  return e.states.flatMap((d) => [
    ...["on_pass", "on_fail", "on_cancel", "on_exhausted"].filter((u) => d.run?.[u] === o.id).map((u) => `${{ on_pass: "success", on_fail: "failure", on_cancel: "cancellation", on_exhausted: "exhaustion" }[u]} handler in ${Le(d)}`),
    ...(d.timers ?? []).filter((u) => u.then?.transition === o.id).map(() => "a timer")
  ]);
}
const Le = (e) => e?.name || "Untitled state", nt = (e) => e.name?.trim() || se(e.id), yt = (e) => ({ unstarted: "Not started", triage: "Triage", backlog: "Backlog", started: "In progress", completed: "Done", canceled: "Canceled" })[e] ?? "In progress", vt = (e) => ({ human: "Person", gate: "Approval", automated: "Automation", parallel: "Parallel" })[e ?? "human"] ?? "Person";
function Et(e, o) {
  if (e.id === o.initial) return "Starts here";
  if (e.category === "completed") return "Finished";
  if (e.category === "canceled") return "Work stops here";
  if (e.kind === "gate") {
    const d = e.release_when?.approvals?.min;
    return d ? `Needs ${d} approval${d === 1 ? "" : "s"}` : "Waits for release";
  }
  return e.kind === "automated" ? "Runs automatically" : e.kind === "parallel" ? Me(e) : "A person moves it";
}
function Me(e) {
  return e.join === "any" ? "any may pass" : typeof e.join == "number" ? `${e.join} must pass` : e.regions?.length === 2 ? "both must pass" : "all must pass";
}
function kt(e, o) {
  const d = e.release_when?.approvals?.min ?? 1, u = e.category === "completed" ? "Work is finished here." : e.category === "canceled" ? "Work stops here." : e.kind === "gate" ? e.release_when?.approvals ? `Items wait here until ${d === 1 ? "one person approves" : `${d} people approve`}.` : "Items wait until the release rules are met." : e.kind === "automated" ? "An automation runs when an item arrives." : e.kind === "parallel" ? `Items travel through lanes; ${Me(e)}.` : "A person chooses when to move the item on.", h = o.policy?.wip?.[e.id]?.limit;
  return u + (h !== void 0 ? ` At most ${h} at a time.` : "");
}
function _t(e) {
  const o = e.transitions ?? [], d = [], u = /* @__PURE__ */ new Set();
  let h = e.states.find((c) => c.id === e.initial);
  const p = new Map(e.states.map((c, i) => [c.id, i]));
  for (; h && !u.has(h.id) && (d.push(h), u.add(h.id), !(h.category === "completed" || h.category === "canceled")); ) {
    const c = h, i = o.filter((t) => t.from !== "any" && t.from.includes(c.id)), n = i.find((t) => t.default) ?? i.find((t) => !u.has(t.to) && (p.get(t.to) ?? -1) > (p.get(c.id) ?? 0));
    h = e.states.find((t) => t.id === n?.to);
  }
  return d;
}
function Re(e) {
  const o = e.states.find((d) => d.id === e.initial);
  return e.migration ?? (o?.kind === "automated" || o?.kind === "parallel" ? "pin" : "follow");
}
const H = (e) => JSON.parse(JSON.stringify(e));
function xt(e) {
  return e?.admin === !0;
}
function Ot(e, o, d) {
  const u = o + d;
  if (o < 0 || o >= e.length || u < 0 || u >= e.length) return;
  const [h] = e.splice(o, 1);
  e.splice(u, 0, h);
}
function Nt(e, o, d) {
  const u = o.code;
  if (u === d) return;
  if (e.fields?.some((n) => n.expression)) throw new Error("Clear formula expressions before renaming a field, then restore them with the new code.");
  o.code = d;
  const h = (n) => n === u ? d : n;
  for (const n of e.item_types ?? [])
    n.fields = n.fields.map(h), n.inherit && (n.inherit = n.inherit.map(h));
  const p = (n) => {
    for (const t of n ?? []) "field" in t && t.field === u && (t.field = d);
  }, c = (n) => {
    n && typeof n == "object" && !Array.isArray(n) && "field" in n && typeof n.field == "string" && (n.field = h(n.field));
  }, i = (n) => {
    if (!(!n || typeof n != "object")) {
      if (Array.isArray(n)) {
        n.forEach(i);
        return;
      }
      c(n);
      for (const [t, l] of Object.entries(n)) ["value", "values", "ctx"].includes(t) || i(l);
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
      c(t.awaiting), c(t.release_when?.approvals?.from), i(t.release_when?.when), t.require && (t.require = t.require.map(h));
      for (const l of t.timers ?? [])
        l.at_field && (l.at_field = h(l.at_field)), l.by && (l.by = h(l.by));
    }
    for (const t of n.transitions ?? []) {
      i(t.when), t.require && (t.require = t.require.map(h));
      for (const l of t.set ?? [])
        l.field = h(l.field), l.copy && (l.copy = h(l.copy));
    }
  }
}
function ve({ migration: e, map: o, ...d }) {
  return JSON.stringify(d);
}
function jt(e, o) {
  const d = H(e);
  for (const h of d.processes ?? []) {
    const p = o.processes?.find((c) => c.id === h.id);
    if (p && ve(h) !== ve(p) && (h.migration = "follow"), h.map) {
      for (const [c, i] of Object.entries(h.map))
        (h.states.some((n) => n.id === c) || !h.states.some((n) => n.id === i)) && delete h.map[c];
      Object.keys(h.map).length || delete h.map;
    }
  }
  d.plugins && (d.plugins = d.plugins.map(({ use: h }) => ({ use: h })));
  for (const h of d.fields ?? [])
    h.type?.includes(":") && delete h.form;
  const u = { ...d.remove };
  o.visibility && !d.visibility ? u.visibility = !0 : delete u.visibility;
  for (const h of ["fields", "item_types", "processes", "relation_types"]) {
    const p = (o[h] ?? []).filter((c) => {
      if (h === "fields") {
        const i = c;
        return !d.fields?.some((n) => i.id !== void 0 ? n.id === i.id : n.code === i.code);
      }
      return !(d[h] ?? []).some((i) => "id" in i && i.id === ("id" in c ? c.id : void 0));
    }).map((c) => "code" in c ? c.code : c.id);
    p.length ? u[h] = [.../* @__PURE__ */ new Set([...u[h] ?? [], ...p])] : delete u[h];
  }
  return Object.keys(u).length ? d.remove = u : delete d.remove, d;
}
function Ee(e) {
  return Object.fromEntries(Object.entries(e).filter(([, o]) => o !== "keep"));
}
function It(e, o, d, u = {}) {
  const h = Ee(u), p = JSON.stringify({ declaration: e, configs: d, resolutions: h });
  return {
    declaration: H(e),
    expected_generation: o,
    plugin_configs: H(d),
    resolutions: H(h),
    matches: (c, i, n, t = {}) => o === i && p === JSON.stringify({ declaration: c, configs: n, resolutions: Ee(t) })
  };
}
const Ct = (e) => [...e?.refused ?? [], ...e?.changes ?? []].filter((o) => o.what === "field.remove" && o.path);
function Lt(e) {
  const o = H(e), d = [...new Set(o.declaration.item_types?.flatMap((h) => h.fields) ?? [])], u = (h) => {
    const p = d.indexOf(h);
    return p < 0 ? d.length : p;
  };
  o.declaration.fields?.sort((h, p) => u(h.code) - u(p.code));
  for (const h of o.declaration.fields ?? []) {
    const p = o.compiled.fields?.find((c) => c.code === h.code);
    h.id ??= p?.id, h.form ??= p?.form;
  }
  for (const h of o.declaration.processes ?? []) h.migration ??= o.compiled.processes?.find((p) => p.id === h.id)?.migration ?? Re(h);
  return o;
}
function Mt(e, o) {
  return (o.processes ?? []).filter((d) => Re(d) !== "pin" && e.changes.some((u) => u.code === "process " + d.id && u.what !== "add" && u.class !== "cosmetic" && u.class !== "refused")).map((d) => d.id);
}
function Rt(e, o, d) {
  const u = [d, `item_type ${d}`, `relation ${d}`, `process ${d}`], h = e.refused.filter((p) => u.includes(p.code) && p.what !== "field.remove");
  return o === "fields" && h.push(...e.changes.filter((p) => p.code === d && p.what === "removed" && p.class === "semantic")), h.length ? h.map(rt).join(" ") : void 0;
}
function Tt(e, o, d) {
  if (o === "fields") {
    e.fields = e.fields?.filter((u) => u.code !== d);
    for (const u of e.item_types ?? [])
      u.fields = u.fields.filter((h) => h !== d), u.inherit = u.inherit?.filter((h) => h !== d);
  } else o === "item_types" ? e.item_types = e.item_types?.filter((u) => u.id !== d) : o === "processes" ? e.processes = e.processes?.filter((u) => u.id !== d) : e.relation_types = e.relation_types?.filter((u) => u.id !== d);
}
function rt(e) {
  return e.what === "invalid" ? e.detail || "The definition is invalid." : [e.what === "removed" ? "Items still hold values in this field." : e.code.startsWith("item_type ") && e.what === "remove" ? "Items still use this item type." : e.code.startsWith("relation ") && e.what === "remove" ? "Links still use this relation type." : e.what === "options.remove" ? "Items still hold values in this option field." : e.what === "state.remove" ? "Items still occupy this state. Map them to a surviving state." : e.what === "process" ? "An existing item type cannot change process." : ["type", "form", "cardinality"].includes(e.what) || e.what.startsWith("config.") ? "This change alters the representation of stored values. Add a new field and migrate values first." : e.what === "state.kind" ? "An existing state cannot change kind. Create a new state and map existing items to it." : e.what === "shape" && e.code.startsWith("relation ") ? "Existing links prevent a cardinality or symmetry change." : "Stored data or a schema dependency prevents this change.", e.detail, e.count ? `${e.count} items` : ""].filter(Boolean).join(" ");
}
function At(e, o) {
  if (!(e instanceof q)) return [];
  const d = e.details ?? {};
  let u = typeof d.field == "string" ? d.field : "";
  if (!u) {
    const h = o.processes ?? [], p = typeof d.process != "string" && typeof d.state == "string" ? h.filter((i) => i.states.some((n) => n.id === d.state)) : [], c = typeof d.process == "string" ? h.find((i) => i.id === d.process) : p.length === 1 ? p[0] : void 0;
    c ? u = `process ${c.id}` : typeof d.item_type == "string" && (u = `item_type ${d.item_type}`);
  }
  return u ? [{ code: u, class: "refused", what: "invalid", detail: fe(e, "The definition is invalid.") }] : [];
}
const St = {
  unchanged: "Nothing changes.",
  cosmetic: "These changes update labels or settings. Saved item values keep their meaning.",
  additive: "New choices or definitions become available to items.",
  semantic: "These changes can affect existing items or how they are found.",
  refused: "Resolve the blocked changes before applying this draft.",
  initial: "These settings will be used when the board is ready."
}, ke = (e) => !("problem" in e);
function Pt(e) {
  const o = ke(e) ? e.plugins.find((u) => u.problem && u.installed)?.problem : e.problem, d = o ? `${o.message} (Error code: ${o.code})` : ke(e) && e.plugins.some((u) => !u.installed) ? "A required plugin is unavailable." : void 0;
  return { ...e, title: e.title ?? "Unnamed pack", icon: e.icon ?? "tabler:package-off", disabled: !!d, unavailable: d };
}
function Dt(e, o) {
  return { pack: e.id, version: e.version, expected_generation: o };
}
async function Ft(e, o) {
  const d = { ...H(e), resolutions: H(e.resolutions ?? {}) };
  let u = await o(d);
  return d.maps || (d.maps = H(u.maps), u = await o(d)), { request: d, plan: u };
}
function it() {
  let e = 0;
  return () => {
    const o = ++e;
    return () => o === e;
  };
}
function $t() {
  const e = X([]), o = X(!1), d = X(""), u = it();
  async function h(c = () => !0) {
    const i = u();
    d.value = "", o.value = !0;
    try {
      const n = await Ce.packs();
      i() && c() && (e.value = n);
    } catch (n) {
      i() && c() && (d.value = fe(n, "Could not load packs."));
    } finally {
      i() && (o.value = !1);
    }
  }
  function p() {
    u(), e.value = [], d.value = "", o.value = !1;
  }
  return { packs: e, loading: o, error: d, load: h, reset: p };
}
export {
  Tt as A,
  Nt as B,
  vt as C,
  q as D,
  qe as E,
  gt as F,
  Ke as G,
  kt as H,
  wt as I,
  bt as J,
  ct as K,
  Ze as L,
  ie as M,
  St as N,
  H as O,
  Ft as P,
  Dt as Q,
  Ct as R,
  jt as S,
  Mt as T,
  Lt as U,
  It as V,
  At as W,
  Rt as X,
  ht as _,
  ke as a,
  xt as b,
  et as c,
  at as d,
  ft as e,
  fe as f,
  pt as g,
  Et as h,
  J as i,
  se as j,
  lt as k,
  it as l,
  _t as m,
  Ie as n,
  ye as o,
  Pt as p,
  ut as q,
  dt as r,
  Le as s,
  nt as t,
  $t as u,
  mt as v,
  Ce as w,
  yt as x,
  Ot as y,
  rt as z
};
//# sourceMappingURL=usePackDiscovery-BegvP3gm.js.map
