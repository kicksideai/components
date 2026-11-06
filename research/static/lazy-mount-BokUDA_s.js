import { defineComponent as le, ref as _, computed as ce, onMounted as ue, onBeforeUnmount as de, resolveComponent as W, openBlock as i, createElementBlock as r, createElementVNode as n, createVNode as p, unref as c, withModifiers as he, withDirectives as Y, vModelText as j, normalizeClass as w, createTextVNode as g, toDisplayString as o, createCommentVNode as x, createBlock as K, Fragment as b, renderList as A } from "vue";
import { Icon as k } from "@iconify/vue";
import { loadByTagName as $, on as pe, api as T } from "@wippy-fe/proxy";
const z = {
  request: "kickside.research.events:request",
  progress: "kickside.research.events:progress",
  result: "kickside.research.events:result",
  failed: "kickside.research.events:failed"
}, ke = Object.fromEntries(
  Object.keys(z).map((u) => [z[u], u])
);
function N(u) {
  return ke[String(u?.type ?? "")] ?? "progress";
}
function G(u) {
  const m = typeof u == "string" ? u : "";
  return m.trim() ? m : "";
}
function fe(u, m) {
  for (const d of u) {
    if (N(d) !== "result") continue;
    const f = G(d.body?.markdown);
    if (f) return f;
  }
  return G(m);
}
function me(u) {
  return u === "failed" ? "No report was produced." : u === "complete" ? "This run completed without a report." : "The report will appear here when the run completes.";
}
const ve = { class: "kx" }, _e = { class: "kx-head" }, ge = { class: "kx-head-icon" }, xe = { class: "kx-body" }, ye = ["disabled"], be = { class: "kx-controls" }, we = { class: "kx-field" }, Te = { class: "kx-field" }, Ne = ["disabled"], Ee = ["disabled"], Ce = {
  key: 0,
  class: "kx-err"
}, Se = {
  key: 1,
  class: "kx-empty"
}, Ae = {
  key: 2,
  class: "kx-section"
}, Re = { class: "kx-section-title" }, Ie = { class: "kx-list" }, Be = ["onClick"], Pe = { class: "kx-id" }, Me = ["title"], Ue = { class: "kx-sub" }, Ve = {
  key: 0,
  class: "kx-detail"
}, qe = { class: "kx-detail-head" }, Le = { class: "kx-run-summary" }, De = {
  key: 0,
  class: "kx-run-time"
}, Fe = {
  key: 0,
  class: "kx-source-strip",
  "aria-label": "Sources"
}, Oe = ["href"], We = {
  key: 0,
  class: "kx-source-more"
}, Ye = { class: "kx-detail-grid" }, je = { class: "kx-panel kx-timeline-panel" }, Ke = { class: "kx-panel-title" }, $e = { class: "kx-timeline" }, ze = { class: "kx-timeline-dot" }, Ge = { class: "kx-timeline-body" }, Je = { class: "kx-timeline-title" }, Qe = { class: "kx-timeline-text" }, He = {
  key: 0,
  class: "kx-finding-list"
}, Xe = {
  key: 1,
  class: "kx-next-step"
}, Ze = {
  key: 0,
  class: "kx-timeline-row live"
}, et = { class: "kx-timeline-dot" }, tt = { class: "kx-timeline-body" }, st = { class: "kx-timeline-title" }, nt = { class: "kx-timeline-text" }, it = { class: "kx-panel kx-report-panel" }, rt = { class: "kx-panel-title" }, at = {
  key: 1,
  class: "kx-report-empty"
}, ot = {
  key: 3,
  class: "kx-empty"
}, U = "kickside.research.agents:researcher", lt = "kickside.threads", ct = /* @__PURE__ */ le({
  __name: "research",
  setup(u) {
    const m = _(""), d = _(!1), f = _(""), R = _(U), I = _(20), E = _([]), v = _(""), y = _([]), B = _(!0);
    let P = null, C = null;
    async function V() {
      if (T)
        try {
          const { data: e } = await T.get("/api/v1/research/list?limit=100");
          e?.success && (E.value = e.items ?? []), f.value = "";
        } catch (e) {
          f.value = e?.message || "failed to load research";
        } finally {
          B.value = !1;
        }
    }
    function J(e) {
      const t = e.detail, l = t && Array.isArray(t.selected) ? t.selected.map(String) : [];
      R.value = l[0] || U;
    }
    async function M(e) {
      if (!(!T || !e))
        try {
          const { data: t } = await T.get(`/api/v1/research/${encodeURIComponent(e)}/events`);
          t?.success && v.value === e && (y.value = t.events ?? []);
        } catch {
        }
    }
    function Q() {
      C || (C = setTimeout(() => {
        C = null, V(), v.value && M(v.value);
      }, 400));
    }
    async function H() {
      const e = m.value.trim();
      if (!(!e || d.value || !T)) {
        d.value = !0, f.value = "";
        try {
          const t = R.value || U, l = Math.max(1, Math.min(Number(I.value) || 20, 50)), { data: h } = await T.post("/api/v1/research", { prompt: e, agent_id: t, max_iterations: l });
          if (!h?.success) {
            f.value = h?.error || "failed to start research";
            return;
          }
          m.value = "", E.value.unshift({
            research_id: h.research_id,
            thread_id: h.thread_id,
            agent_id: t,
            status: h.status || "running",
            title: e
          }), v.value = h.research_id, y.value = [], M(h.research_id);
        } catch (t) {
          f.value = t?.message || "request failed";
        } finally {
          d.value = !1;
        }
      }
    }
    function X(e) {
      if (v.value === e) {
        v.value = "", y.value = [];
        return;
      }
      v.value = e, y.value = [], M(e);
    }
    function q() {
      return y.value.filter((e) => N(e) !== "result");
    }
    function Z(e) {
      const t = N(e), l = e.body || {};
      return t === "request" ? "Brief received" : t === "failed" ? "Run failed" : t === "result" ? "Report ready" : l.status ? String(l.status) : "Progress update";
    }
    function ee(e) {
      const t = e.body || {}, l = N(e);
      return l === "request" ? t.prompt || "The research brief was queued." : l === "progress" ? t.step || "Working through the research plan." : l === "failed" ? t.error || "The research run failed." : "The final report is ready.";
    }
    function te(e) {
      const t = N(e);
      return t === "request" ? "tabler:clipboard-text" : t === "failed" ? "tabler:alert-triangle" : t === "result" ? "tabler:file-check" : "tabler:activity";
    }
    function L(e) {
      return (e.body && Array.isArray(e.body.findings) ? e.body.findings : []).map(String).filter(Boolean);
    }
    function se(e) {
      return (e.body && Array.isArray(e.body.urls) ? e.body.urls : []).map(String).filter(Boolean);
    }
    function D(e) {
      return fe(y.value, e?.result_md);
    }
    function S(e) {
      const t = /* @__PURE__ */ new Set(), l = [], h = (s) => {
        const a = String(s || "").trim();
        !a || t.has(a) || (t.add(a), l.push(a));
      };
      for (const s of e.urls || []) h(s);
      for (const s of y.value) for (const a of se(s)) h(a);
      return l;
    }
    function ne(e) {
      try {
        return new URL(e).hostname.replace(/^www\./, "");
      } catch {
        return e;
      }
    }
    function F(e) {
      if (!e) return "";
      const t = new Date(e);
      return Number.isNaN(t.getTime()) ? "" : t.toLocaleString(void 0, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
    }
    function O(e) {
      return e === "complete" ? "tabler:circle-check" : e === "failed" ? "tabler:alert-circle" : "tabler:loader-2";
    }
    function ie(e) {
      return e === "complete" ? "Complete" : e === "failed" ? "Failed" : e === "pending" ? "Queued" : "Running";
    }
    const re = ce(() => E.value.some((e) => e.status === "running" || e.status === "pending"));
    return ue(async () => {
      try {
        $("wc-agent-picker", { timeoutMs: 8e3 }).catch(() => {
        }), $("wc-render-markdown", { timeoutMs: 8e3 }).catch(() => {
        }), await V(), P = pe(lt, Q);
      } catch (e) {
        f.value = e instanceof Error ? e.message : "host API unavailable", B.value = !1;
      }
    }), de(() => {
      if (P)
        try {
          P();
        } catch {
        }
      C && clearTimeout(C);
    }), (e, t) => {
      const l = W("wc-agent-picker"), h = W("wc-render-markdown");
      return i(), r("div", ve, [
        n("header", _e, [
          n("div", ge, [
            p(c(k), {
              icon: "tabler:world-search",
              "aria-hidden": "true"
            })
          ]),
          t[2] || (t[2] = n("div", { class: "kx-head-text" }, [
            n("h1", { class: "kx-title" }, "Research"),
            n("p", { class: "kx-sub" }, "Enter a prompt — an agent researches it and reports back here live.")
          ], -1))
        ]),
        n("div", xe, [
          n("form", {
            class: "kx-compose",
            onSubmit: he(H, ["prevent"])
          }, [
            Y(n("textarea", {
              "onUpdate:modelValue": t[0] || (t[0] = (s) => m.value = s),
              rows: "2",
              class: "kx-input kx-prompt",
              placeholder: "What should the agent research? e.g. The economic impact of solar power in 2026",
              disabled: d.value
            }, null, 8, ye), [
              [j, m.value]
            ]),
            n("div", be, [
              n("label", we, [
                t[3] || (t[3] = n("span", { class: "kx-field-label" }, "Agent", -1)),
                p(l, {
                  placeholder: "Pick an agent…",
                  multi: "false",
                  selected: JSON.stringify([R.value]),
                  onChange: J
                }, null, 8, ["selected"])
              ]),
              n("label", Te, [
                t[4] || (t[4] = n("span", { class: "kx-field-label" }, "Iterations", -1)),
                Y(n("input", {
                  "onUpdate:modelValue": t[1] || (t[1] = (s) => I.value = s),
                  type: "number",
                  min: "1",
                  max: "50",
                  class: "kx-input kx-iter-input",
                  disabled: d.value
                }, null, 8, Ne), [
                  [
                    j,
                    I.value,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ]),
              n("button", {
                type: "submit",
                class: "kx-btn kx-btn-primary kx-controls-btn",
                disabled: d.value || !m.value.trim()
              }, [
                p(c(k), {
                  icon: d.value ? "tabler:loader-2" : "tabler:search",
                  class: w(d.value && "spin"),
                  "aria-hidden": "true"
                }, null, 8, ["icon", "class"]),
                g(" " + o(d.value ? "Starting…" : "Research"), 1)
              ], 8, Ee)
            ])
          ], 32),
          f.value ? (i(), r("div", Ce, o(f.value), 1)) : x("", !0),
          B.value ? (i(), r("div", Se, [...t[5] || (t[5] = [
            n("div", { class: "kx-empty-sub" }, "Loading…", -1)
          ])])) : E.value.length ? (i(), r("section", Ae, [
            n("h2", Re, [
              t[6] || (t[6] = g(" Your research ", -1)),
              re.value ? (i(), K(c(k), {
                key: 0,
                icon: "tabler:loader-2",
                class: "spin kx-live",
                "aria-hidden": "true"
              })) : x("", !0)
            ]),
            n("ul", Ie, [
              (i(!0), r(b, null, A(E.value, (s) => (i(), r("li", {
                key: s.research_id,
                class: w(["kx-row", { open: v.value === s.research_id }])
              }, [
                n("button", {
                  class: "kx-row-head",
                  onClick: (a) => X(s.research_id)
                }, [
                  p(c(k), {
                    icon: O(s.status),
                    class: w(["kx-row-ico", s.status, (s.status === "running" || s.status === "pending") && "spin"]),
                    "aria-hidden": "true"
                  }, null, 8, ["icon", "class"]),
                  n("div", Pe, [
                    n("div", {
                      class: "kx-name",
                      title: s.title
                    }, o(s.title || "Untitled research"), 9, Me),
                    n("div", Ue, [
                      s.status === "complete" ? (i(), r(b, { key: 0 }, [
                        g("Complete")
                      ], 64)) : s.status === "failed" ? (i(), r(b, { key: 1 }, [
                        g("Failed" + o(s.latest_step ? ": " + s.latest_step : ""), 1)
                      ], 64)) : (i(), r(b, { key: 2 }, [
                        g(o(s.latest_step || "Researching…"), 1)
                      ], 64))
                    ])
                  ]),
                  p(c(k), {
                    icon: v.value === s.research_id ? "tabler:chevron-up" : "tabler:chevron-down",
                    class: "kx-chev",
                    "aria-hidden": "true"
                  }, null, 8, ["icon"])
                ], 8, Be),
                v.value === s.research_id ? (i(), r("div", Ve, [
                  n("div", qe, [
                    n("div", Le, [
                      n("span", {
                        class: w(["kx-status-pill", s.status])
                      }, [
                        p(c(k), {
                          icon: O(s.status),
                          class: w((s.status === "running" || s.status === "pending") && "spin"),
                          "aria-hidden": "true"
                        }, null, 8, ["icon", "class"]),
                        g(" " + o(ie(s.status)), 1)
                      ], 2),
                      F(s.updated_at || s.created_at) ? (i(), r("span", De, o(F(s.updated_at || s.created_at)), 1)) : x("", !0)
                    ]),
                    S(s).length ? (i(), r("div", Fe, [
                      (i(!0), r(b, null, A(S(s).slice(0, 6), (a) => (i(), r("a", {
                        key: a,
                        class: "kx-source-chip",
                        href: a,
                        target: "_blank",
                        rel: "noreferrer"
                      }, [
                        p(c(k), {
                          icon: "tabler:link",
                          "aria-hidden": "true"
                        }),
                        g(" " + o(ne(a)), 1)
                      ], 8, Oe))), 128)),
                      S(s).length > 6 ? (i(), r("span", We, "+" + o(S(s).length - 6), 1)) : x("", !0)
                    ])) : x("", !0)
                  ]),
                  n("div", Ye, [
                    n("section", je, [
                      n("div", Ke, [
                        p(c(k), {
                          icon: "tabler:timeline-event",
                          "aria-hidden": "true"
                        }),
                        t[7] || (t[7] = g(" Progress ", -1))
                      ]),
                      n("ol", $e, [
                        (i(!0), r(b, null, A(q(), (a) => (i(), r("li", {
                          key: a.seq,
                          class: w(["kx-timeline-row", c(N)(a)])
                        }, [
                          n("div", ze, [
                            p(c(k), {
                              icon: te(a),
                              "aria-hidden": "true"
                            }, null, 8, ["icon"])
                          ]),
                          n("div", Ge, [
                            n("div", Je, o(Z(a)), 1),
                            n("div", Qe, o(ee(a)), 1),
                            L(a).length ? (i(), r("ul", He, [
                              (i(!0), r(b, null, A(L(a), (ae, oe) => (i(), r("li", { key: oe }, o(ae), 1))), 128))
                            ])) : x("", !0),
                            a.body && a.body.eta ? (i(), r("div", Xe, "Next: " + o(a.body.eta), 1)) : x("", !0)
                          ])
                        ], 2))), 128)),
                        s.status === "running" || s.status === "pending" ? (i(), r("li", Ze, [
                          n("div", et, [
                            p(c(k), {
                              icon: "tabler:loader-2",
                              class: "spin",
                              "aria-hidden": "true"
                            })
                          ]),
                          n("div", tt, [
                            n("div", st, o(q().length ? "Agent working" : "Waiting for first update"), 1),
                            n("div", nt, o(s.latest_step || "The run is active. Progress appears here as the agent reports back."), 1)
                          ])
                        ])) : x("", !0)
                      ])
                    ]),
                    n("section", it, [
                      n("div", rt, [
                        p(c(k), {
                          icon: "tabler:file-analytics",
                          "aria-hidden": "true"
                        }),
                        t[8] || (t[8] = g(" Report ", -1))
                      ]),
                      D(s) ? (i(), K(h, {
                        key: 0,
                        class: "kx-result",
                        source: D(s)
                      }, null, 8, ["source"])) : (i(), r("div", at, [
                        p(c(k), {
                          icon: "tabler:hourglass",
                          "aria-hidden": "true"
                        }),
                        n("span", null, o(c(me)(s.status)), 1)
                      ]))
                    ])
                  ])
                ])) : x("", !0)
              ], 2))), 128))
            ])
          ])) : (i(), r("div", ot, [...t[9] || (t[9] = [
            n("div", { class: "kx-empty-title" }, "No research yet", -1),
            n("div", { class: "kx-empty-sub" }, "Enter a prompt above to run a research pass. Progress appears here live.", -1)
          ])]))
        ])
      ]);
    };
  }
}), pt = {
  rootComponent: ct
};
export {
  pt as mountConfig
};
//# sourceMappingURL=lazy-mount-BokUDA_s.js.map
