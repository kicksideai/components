import { api as i } from "@wippy-fe/proxy";
/*! SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 */
const l = (e) => `/api/v1/docscout/${encodeURIComponent(e)}`;
function o(e) {
  if (e.success === !1) throw new Error(e.error || "Request failed");
  return e;
}
const x = (e) => e.response?.data, $ = {
  async list(e = {}) {
    return o((await i.get("/api/v1/docscout", { params: e })).data);
  },
  async get(e) {
    return o((await i.get(l(e))).data);
  },
  async create(e) {
    return o((await i.post("/api/v1/docscout", e)).data);
  },
  async update(e, t) {
    return o((await i.put(l(e), t)).data);
  },
  async addCase(e, t) {
    return o((await i.post(l(e) + "/cases", t)).data);
  },
  async deleteCase(e, t) {
    o((await i.delete(l(e) + "/cases/" + encodeURIComponent(t))).data);
  },
  // A run that stops partway still answers with its run id and step trace.
  async run(e, t) {
    try {
      return o((await i.post(l(e) + "/run", { upload_id: t })).data);
    } catch (a) {
      const s = x(a), r = s?.details?.trace;
      if (!r) throw a;
      return { run_id: s?.details?.run_id ?? "", upload_id: t, config_revision: 0, values: {}, fields: [], trace: r, duration_ms: r.reduce((n, u) => n + u.duration_ms, 0), tokens: r.reduce((n, u) => n + u.input_tokens + u.output_tokens, 0), status: "failed", error: s?.error };
    }
  },
  async evaluate(e) {
    return o((await i.post(l(e) + "/evaluations", {})).data);
  },
  async evaluations(e) {
    return o((await i.get(l(e) + "/evaluations")).data).items;
  },
  async evaluation(e, t) {
    return o((await i.get(l(e) + "/evaluations/" + encodeURIComponent(t))).data).evaluation;
  },
  async remove(e) {
    o((await i.delete(l(e))).data);
  }
}, b = { fields: { items: { default: { name: "", type: "text", description: "", enum_values: [], required: !1, search_hints: "", validation_hints: "", expected_format: "", strategy: "standard", search_within: "document", group: "", evidence_required: !0, chunks: 5 } } }, stages: { properties: { map: { type: "object", additionalProperties: !1, properties: { enabled: { type: "boolean", default: !0 }, model: { type: "string", default: "class:fast", minLength: 1, maxLength: 200 }, outline: { type: "string", default: "find_or_build", enum: ["find_or_build", "build"] }, section_summaries: { type: "boolean", default: !1 } }, required: ["enabled", "model", "outline", "section_summaries"], default: { enabled: !0, model: "class:fast", outline: "find_or_build", section_summaries: !1 } }, prefetch: { type: "object", additionalProperties: !1, properties: { enabled: { type: "boolean", default: !0 }, queries: { type: "array", default: [], items: { type: "object", additionalProperties: !1, properties: { name: { type: "string", minLength: 1, maxLength: 200, default: "" }, query: { type: "string", minLength: 1, maxLength: 4e3, default: "" }, chunks: { type: "integer", default: 5, minimum: 1, maximum: 1e3 } }, required: ["name", "query", "chunks"], default: { name: "", query: "", chunks: 5 } }, maxItems: 100 } }, required: ["enabled", "queries"], default: { enabled: !0, queries: [] } }, scout: { type: "object", additionalProperties: !1, properties: { enabled: { type: "boolean", default: !0 }, mode: { type: "string", default: "loop", enum: ["loop", "agent"] }, model: { type: "string", default: "class:fast", minLength: 1, maxLength: 200 }, max_rounds: { type: "integer", default: 0, minimum: 0, maximum: 30, description: "Extra search rounds for structured scouting. Agent mode requires at least one round, including when a user agent is selected." }, target_confidence: { type: "number", default: 0.7, minimum: 0, maximum: 1 }, max_extra_queries: { type: "integer", default: 3, minimum: 0, maximum: 20, description: "Search budget per round. Agent mode requires a positive value; selected agents use max_rounds * max_extra_queries + 1 native iterations, including the final answer." }, max_tokens: { type: "integer", default: 4096, minimum: 256, maximum: 64e3 }, drop_noise: { type: "boolean", default: !0 }, share_notes: { type: "boolean", default: !0 }, tools: { type: "array", default: ["keyword_search", "semantic_search", "read_section", "read_outline"], items: { type: "string", enum: ["keyword_search", "semantic_search", "read_section", "read_outline"] }, uniqueItems: !0 }, agent_id: { type: "string", minLength: 1, title: "Scouting agent", description: "Agent component id readable by the saver and runner. Applies to agent mode; omit to use the built-in loop.", picker: "wc-component-picker", class: "agent" } }, required: ["enabled", "mode", "model", "max_rounds", "target_confidence", "max_extra_queries", "max_tokens", "drop_noise", "share_notes", "tools"], default: { enabled: !0, mode: "loop", model: "class:fast", max_rounds: 0, target_confidence: 0.7, max_extra_queries: 3, max_tokens: 4096, drop_noise: !0, share_notes: !0, tools: ["keyword_search", "semantic_search", "read_section", "read_outline"] } }, deep: { type: "object", additionalProperties: !1, properties: { enabled: { type: "boolean", default: !0 }, model: { type: "string", default: "class:fast", minLength: 1, maxLength: 200 }, query_model: { type: "string", default: "class:fast", minLength: 1, maxLength: 200 }, read: { type: "string", default: "chunks", enum: ["chunks", "sections"] }, parallel_fields: { type: "integer", default: 4, minimum: 1, maximum: 20 }, max_queries: { type: "integer", default: 5, minimum: 1, maximum: 100 }, chunks_per_query: { type: "integer", default: 50, minimum: 1, maximum: 1e3 }, chunk_cap: { type: "integer", default: 100, minimum: 1, maximum: 1e4 }, min_similarity: { type: "number", default: 0.2, minimum: 0, maximum: 1 }, query_temperature: { type: "number", default: 0.2, minimum: 0, maximum: 2 }, analysis_temperature: { type: "number", default: 0.2, minimum: 0, maximum: 2 } }, required: ["enabled", "model", "query_model", "read", "parallel_fields", "max_queries", "chunks_per_query", "chunk_cap", "min_similarity", "query_temperature", "analysis_temperature"], default: { enabled: !0, model: "class:fast", query_model: "class:fast", read: "chunks", parallel_fields: 4, max_queries: 5, chunks_per_query: 50, chunk_cap: 100, min_similarity: 0.2, query_temperature: 0.2, analysis_temperature: 0.2 } }, extract: { type: "object", additionalProperties: !1, properties: { model: { type: "string", default: "class:fast", minLength: 1, maxLength: 200 }, max_output_tokens: { type: "integer", default: 4096, minimum: 256, maximum: 64e3 }, max_fields_per_call: { type: "integer", default: 20, minimum: 1, maximum: 100 } }, required: ["model", "max_output_tokens", "max_fields_per_call"], default: { model: "class:fast", max_output_tokens: 4096, max_fields_per_call: 20 } }, verify: { type: "object", additionalProperties: !1, properties: { enabled: { type: "boolean", default: !1 }, model: { type: "string", default: "class:fast", minLength: 1, maxLength: 200 }, check_quotes: { type: "boolean", default: !0 }, check_support: { type: "boolean", default: !0 } }, required: ["enabled", "model", "check_quotes", "check_support"], default: { enabled: !1, model: "class:fast", check_quotes: !0, check_support: !0 } } } }, retrieval: { properties: { chunk_size: { type: "integer", default: 1200, minimum: 100, maximum: 16e3 }, overlap: { type: "integer", default: 150, minimum: 0, maximum: 4e3 }, split_headings: { type: "boolean", default: !0 }, keep_tables: { type: "boolean", default: !0 }, search_mode: { type: "string", default: "hybrid", enum: ["keyword", "semantic", "hybrid"] }, embedding_model: { type: "string", default: "class:embed", minLength: 1, maxLength: 200 }, context: { type: "string", default: "headings", enum: ["none", "headings", "generated"] }, context_model: { type: "string", default: "class:fast", minLength: 1, maxLength: 200 }, highlighter: { type: "boolean", default: !1 }, highlighter_model: { type: "string", default: "class:fast", minLength: 1, maxLength: 200 }, section_budget: { type: "integer", default: 6e3, minimum: 500, maximum: 64e3 } } } }, m = {
  properties: b,
  default: { fields: [], stages: { map: { enabled: !0, model: "class:fast", outline: "find_or_build", section_summaries: !1 }, prefetch: { enabled: !0, queries: [] }, scout: { enabled: !0, mode: "loop", model: "class:fast", max_rounds: 0, target_confidence: 0.7, max_extra_queries: 3, max_tokens: 4096, drop_noise: !0, share_notes: !0, tools: ["keyword_search", "semantic_search", "read_section", "read_outline"] }, deep: { enabled: !0, model: "class:fast", query_model: "class:fast", read: "chunks", parallel_fields: 4, max_queries: 5, chunks_per_query: 50, chunk_cap: 100, min_similarity: 0.2, query_temperature: 0.2, analysis_temperature: 0.2 }, extract: { model: "class:fast", max_output_tokens: 4096, max_fields_per_call: 20 }, verify: { enabled: !1, model: "class:fast", check_quotes: !0, check_support: !0 } }, retrieval: { chunk_size: 1200, overlap: 150, split_headings: !0, keep_tables: !0, search_mode: "hybrid", embedding_model: "class:embed", context: "headings", context_model: "class:fast", highlighter: !1, highlighter_model: "class:fast", section_budget: 6e3 }, tags: [] }
}, k = 4, j = () => ({ name: "", type: "text", description: "", enum_values: [], expected_format: "", required: !1 }), A = () => ({ type: "text", description: "", enum_values: [], expected_format: "" }), c = (e) => e.group ? `${e.group}.${e.name}` : e.name, q = /^(?:[a-z][a-z0-9]*(?:_[a-z0-9]+)*(?:\.[a-z][a-z0-9]*(?:_[a-z0-9]+)*)*)?$/;
function C(e) {
  return e.find((t) => e.some((a) => a !== t && a.startsWith(t + ".")));
}
function P(e, t) {
  let a = e;
  for (const s of t.split(".")) {
    if (a === null || typeof a != "object" || !Object.hasOwn(a, s)) return;
    a = a[s];
  }
  return a;
}
function S(e, t, a) {
  const s = t.split(".");
  let r = e;
  for (const n of s.slice(0, -1))
    Object.hasOwn(r, n) || (r[n] = {}), r = r[n];
  Object.defineProperty(r, s.at(-1), { value: a, writable: !0, enumerable: !0, configurable: !0 });
}
function z(e) {
  const t = { name: "", path: "", indices: [], children: [] };
  return e.forEach((a, s) => {
    let r = t;
    for (const n of a.split(".").slice(0, -1)) {
      let u = r.children.find((p) => p.name === n);
      u || (u = { name: n, path: r.path ? `${r.path}.${n}` : n, indices: [], children: [] }, r.children.push(u)), r = u;
    }
    r.indices.push(s);
  }), t;
}
function U() {
  const e = structuredClone(m.default), { max_output_tokens: t, max_fields_per_call: a } = e.stages.extract;
  return { ...e, stages: { ...e.stages, extract: { model: "class:fast", max_output_tokens: t, max_fields_per_call: a } } };
}
const E = () => structuredClone(m.properties.fields.items.default), M = () => ({ name: "", query: "", chunks: 5 }), O = () => [...m.properties.stages.properties.scout.properties.tools.default], h = m, _ = (e) => ({ min: e?.minimum ?? 0, max: e?.maximum ?? 100 }), I = (e, t) => _(h.properties.stages.properties[e]?.properties[t]), D = (e) => _(h.properties.retrieval.properties[e]), F = { map: "Map the document", prefetch: "Prefetch", scout: "Scout loop", deep: "Deep analysis", extract: "Extract", verify: "Verify" }, N = { map: "tabler:list-tree", prefetch: "tabler:search", scout: "tabler:radar-2", deep: "tabler:microscope", extract: "tabler:table-export", verify: "tabler:shield-check" }, B = {
  map: "Find the table of contents or build an outline, then pick the sections each field should read.",
  prefetch: "Search for every field by its name, description and hints, plus any fixed queries, to fill the evidence pool.",
  scout: "Judge the evidence, drop noise and look for more until confident.",
  deep: "Give each deep field its own searches and a written analysis, several fields at a time.",
  extract: "Fill the fields from the evidence, one group of fields per call.",
  verify: "Check that each quote exists in the document and supports its value."
}, W = (e, t) => t === "extract" || e.stages[t].enabled, d = (e, t) => `${e} ${e === 1 ? t : t.endsWith("y") ? t.slice(0, -1) + "ies" : t + "s"}`;
function g(e) {
  const t = /* @__PURE__ */ new Map();
  for (const a of e.fields) {
    const s = a.group.trim() || "Default";
    t.set(s, [...t.get(s) ?? [], a]);
  }
  return [...t].map(([a, s]) => ({ name: a, fields: s }));
}
function v(e) {
  return g(e).reduce((t, a) => t + Math.max(1, Math.ceil(a.fields.length / e.stages.extract.max_fields_per_call)), 0);
}
function R(e, t) {
  const a = t.stages;
  switch (e) {
    case "map": {
      const s = t.fields.filter((r) => r.search_within === "sections").length;
      return [a.map.outline === "build" ? "Always build an outline" : "Contents first, else build", s ? `${d(s, "field")} read Map's sections` : ""].filter(Boolean).join(" · ");
    }
    case "prefetch": {
      const s = t.fields.filter((n) => n.strategy !== "deep" || !a.deep.enabled).length, r = t.fields.filter((n) => n.search_hints.trim()).length;
      return [d(s, "field"), r ? d(r, "field hint") : "", a.prefetch.queries.length ? d(a.prefetch.queries.length, "query") : ""].filter(Boolean).join(" · ");
    }
    case "scout":
      return a.scout.mode === "agent" ? `Agent with tools · up to ${d(a.scout.max_rounds * a.scout.max_extra_queries, "tool call")}` : `Structured loop · ${a.scout.max_rounds ? `up to ${d(a.scout.max_rounds, "round")}, stop at ${Math.round(a.scout.target_confidence * 100)}%` : "single pass"}`;
    case "deep": {
      const s = t.fields.filter((r) => r.strategy === "deep").length;
      return s ? `${d(s, "field")} · reads ${a.deep.read} · ${a.deep.parallel_fields} at a time` : "No deep fields";
    }
    case "extract": {
      const s = v(t);
      return `Structured output · ${d(g(t).length, "group")}, ${d(s, "call")}`;
    }
    case "verify":
      return [a.verify.check_quotes ? "quotes exist" : "", a.verify.check_support ? "quotes support values" : ""].filter(Boolean).join(" · ") || "No checks";
  }
}
function T(e) {
  const t = e.context === "generated" ? "generated context" : e.context === "headings" ? "heading context" : "";
  return [`${e.chunk_size.toLocaleString()}-token chunks`, `${e.search_mode} search`, t, e.highlighter ? "highlighter" : ""].filter(Boolean).join(" · ");
}
function V(e) {
  return e ? e.startsWith("class:") ? e.slice(6).replace(/^\w/, (t) => t.toUpperCase()) : e.split("/").pop() ?? e : "";
}
function Y(e) {
  return e.replace(/_/g, " ").replace(/^\w/, (t) => t.toUpperCase());
}
const G = (e, t = !0) => e.type === "enum" || !t && e.type === "text";
function f(e, t = 1) {
  if (t > k) return "Shapes support at most four levels.";
  if ((e.description?.length ?? 0) > 4e3) return "Use at most 4000 characters for the description.";
  if ((e.expected_format?.length ?? 0) > 400) return "Use at most 400 characters for the expected format.";
  if ((e.enum_values?.length ?? 0) > 100) return "Use at most 100 allowed values.";
  if (e.enum_values?.some((a) => !a.length || a.length > 200)) return "Allowed values need 1 to 200 characters.";
  if (new Set(e.enum_values).size !== (e.enum_values?.length ?? 0)) return "Allowed values must be unique.";
  if (e.type === "enum" && !e.enum_values?.length) return "Add at least one allowed value.";
  if (e.enum_values?.length && e.type !== "enum" && e.type !== "text") return "Allowed values apply to enum fields and text items.";
  if (e.type === "object") {
    if (!e.properties?.length) return "Add at least one declared property.";
    if (e.properties.length > 100) return "Use at most 100 properties.";
    const a = /* @__PURE__ */ new Set();
    for (const s of e.properties) {
      const r = y(s.name, [...a]) || f(s, t + 1);
      if (r) return `${s.name || "New property"}: ${r}`;
      a.add(s.name);
    }
  } else if (e.properties) return "Properties apply to object shapes.";
  return e.type === "list" ? e.item ? f(e.item, t + 1) : "Declare the item shape." : e.item ? "Item shapes apply to lists." : "";
}
function y(e, t) {
  return e ? e.length > 80 ? "Use at most 80 characters for a name." : /^[A-Za-z][A-Za-z0-9_]*$/.test(e) ? t.includes(e) ? "Another field already uses this name." : "" : "Start with a letter; use letters, numbers and underscores." : "Name the field.";
}
function w(e, t) {
  const a = y(e.name, t.includes(c(e)) ? [e.name] : []);
  return a || (t.some((s) => s !== c(e) && (s.startsWith(c(e) + ".") || c(e).startsWith(s + "."))) ? `Group path collides with field ${c(e)}.` : e.group.length > 320 ? "Use at most 320 characters for a group path." : q.test(e.group) ? e.search_hints.length > 4e3 || e.validation_hints.length > 4e3 ? "Use at most 4000 characters for hints." : !Number.isInteger(e.chunks) || e.chunks < 1 || e.chunks > 1e3 ? "Chunks to read must be an integer from 1 to 1000." : e.enum_values.length && e.type !== "enum" ? "Allowed values apply to enum fields and text items." : f(e) : "Use a dotted path of snake_case group names.");
}
function J(e) {
  const t = e.type === "list" ? e.item?.type : e.type;
  return { text: "For example, full legal name", number: "For example, decimal with 2 places", date: "For example, YYYY-MM-DD", object: "Describe the object format", boolean: "", enum: "" }[t ?? ""] ?? "";
}
function H(e) {
  if (e.fields.length > 100) return "Use at most 100 fields.";
  for (const [s, r] of e.fields.entries()) {
    const n = w(r, e.fields.filter((u, p) => p !== s).map(c));
    if (n) return `${r.name || "New field"}: ${n}`;
  }
  const t = e.stages;
  if (t.prefetch.queries.some((s) => !s.name.trim() || !s.query.trim())) return "Prefetch queries need a name and a query.";
  if (!t.map.enabled && e.fields.some((s) => s.search_within === "sections")) return "Fields that read sections need Map the document.";
  const a = e.fields.find((s) => !(s.strategy === "deep" && t.deep.enabled) && !t.prefetch.enabled && !t.scout.enabled);
  return a ? `Turn on Prefetch or Scout so extraction has passages to read for ${a.name}.` : t.scout.enabled && t.scout.mode === "agent" && !t.scout.tools.length ? "Agent scouting needs at least one tool." : t.scout.enabled && t.scout.mode === "agent" && (!t.scout.max_rounds || !t.scout.max_extra_queries) ? "Agent scouting needs at least one round and one tool call per round." : t.verify.enabled && !t.verify.check_quotes && !t.verify.check_support ? "Verify needs at least one check." : e.retrieval.overlap >= e.retrieval.chunk_size ? "Overlap must be smaller than chunk size." : "";
}
function Z(e, t) {
  const a = (s, r) => r !== null && typeof r == "object" && !Array.isArray(r) ? Object.fromEntries(Object.keys(r).sort().map((n) => [n, r[n]])) : r;
  return JSON.stringify(e, a) === JSON.stringify(t, a);
}
export {
  C as A,
  z as B,
  T as C,
  P as D,
  H as E,
  Z as F,
  k as M,
  N as a,
  R as b,
  $ as c,
  c as d,
  S as e,
  g as f,
  j as g,
  E as h,
  W as i,
  A as j,
  y as k,
  f as l,
  V as m,
  U as n,
  G as o,
  J as p,
  w as q,
  q as r,
  F as s,
  Y as t,
  O as u,
  B as v,
  M as w,
  v as x,
  I as y,
  D as z
};
