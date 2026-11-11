import { api as i } from "@wippy-fe/proxy";
/*! SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 */
const l = (e) => `/api/v1/docscout/${encodeURIComponent(e)}`;
function o(e) {
  if (e.success === !1) throw new Error(e.error || "Request failed");
  return e;
}
const b = (e) => e.response?.data, j = {
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
  async run(e, t, a) {
    const r = { upload_id: t };
    a !== void 0 && (r.pages = a);
    try {
      return o((await i.post(l(e) + "/run", r)).data);
    } catch (s) {
      const n = b(s), u = n?.details?.trace;
      if (!u) throw s;
      return { run_id: n?.details?.run_id ?? "", upload_id: t, config_revision: 0, values: {}, fields: [], trace: u, duration_ms: u.reduce((m, p) => m + p.duration_ms, 0), tokens: u.reduce((m, p) => m + p.input_tokens + p.output_tokens, 0), status: "failed", error: n?.error };
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
}, k = /* @__PURE__ */ JSON.parse(`{"retention":{"type":"string","minLength":1,"title":"Retention window","description":"Positive duration for new processed documents and runs, for example 24h. Omit to use the global Docscout retention setting. Existing rows keep their expiry."},"fields":{"type":"array","default":[],"items":{"type":"object","additionalProperties":false,"properties":{"name":{"type":"string","default":"","maxLength":80,"pattern":"^[A-Za-z][A-Za-z0-9_]*$"},"type":{"type":"string","default":"text","enum":["text","number","boolean","date","enum","list","object"]},"description":{"type":"string","default":"","maxLength":4000},"enum_values":{"type":"array","default":[],"items":{"type":"string","minLength":1,"maxLength":200},"uniqueItems":true,"maxItems":100},"required":{"type":"boolean","default":false},"search_hints":{"type":"string","default":"","maxLength":4000},"validation_hints":{"type":"string","default":"","maxLength":4000},"expected_format":{"type":"string","default":"","maxLength":400},"strategy":{"type":"string","default":"standard","enum":["standard","deep"]},"search_within":{"type":"string","default":"document","enum":["document","sections"]},"group":{"type":"string","default":"","maxLength":320,"pattern":"^(?:[a-z][a-z0-9]*(?:_[a-z0-9]+)*(?:\\\\.[a-z][a-z0-9]*(?:_[a-z0-9]+)*)*)?$"},"evidence_required":{"type":"boolean","default":true},"chunks":{"type":"integer","default":5,"minimum":1,"maximum":1000},"properties":{"type":"array","minItems":1,"maxItems":100,"items":{"$ref":"#/$defs/property2"}},"item":{"$ref":"#/$defs/shape2"}},"required":["name","type","description","enum_values","required","search_hints","validation_hints","expected_format","strategy","search_within","group","evidence_required","chunks"],"default":{"name":"","type":"text","description":"","enum_values":[],"required":false,"search_hints":"","validation_hints":"","expected_format":"","strategy":"standard","search_within":"document","group":"","evidence_required":true,"chunks":5},"allOf":[{"if":{"properties":{"type":{"const":"object"}}},"then":{"required":["properties"]}},{"if":{"properties":{"type":{"const":"list"}}},"then":{"required":["item"]}}]},"maxItems":100},"stages":{"type":"object","additionalProperties":false,"properties":{"map":{"type":"object","additionalProperties":false,"properties":{"enabled":{"type":"boolean","default":true},"model":{"type":"string","default":"class:fast","minLength":1,"maxLength":200},"outline":{"type":"string","default":"find_or_build","enum":["find_or_build","build"]},"section_summaries":{"type":"boolean","default":false},"temperature":{"type":"number","minimum":0,"maximum":2,"default":0,"description":"Sampling temperature for this stage's model calls. Defaults to 0; unset uses the provider default."},"max_tokens":{"type":"integer","minimum":256,"maximum":64000,"description":"Output token limit for this stage's model calls. Unset uses the provider default."}},"required":["enabled","model","outline","section_summaries"],"default":{"enabled":true,"model":"class:fast","outline":"find_or_build","section_summaries":false,"temperature":0}},"prefetch":{"type":"object","additionalProperties":false,"properties":{"enabled":{"type":"boolean","default":true},"queries":{"type":"array","default":[],"items":{"type":"object","additionalProperties":false,"properties":{"name":{"type":"string","minLength":1,"maxLength":200,"default":""},"query":{"type":"string","minLength":1,"maxLength":4000,"default":""},"chunks":{"type":"integer","default":5,"minimum":1,"maximum":1000}},"required":["name","query","chunks"],"default":{"name":"","query":"","chunks":5}},"maxItems":100}},"required":["enabled","queries"],"default":{"enabled":true,"queries":[]}},"scout":{"type":"object","additionalProperties":false,"properties":{"enabled":{"type":"boolean","default":true},"mode":{"type":"string","default":"loop","enum":["loop","agent"]},"model":{"type":"string","default":"class:fast","minLength":1,"maxLength":200},"max_rounds":{"type":"integer","default":0,"minimum":0,"maximum":30,"description":"Extra search rounds for structured scouting. Agent mode requires at least one round, including when a user agent is selected."},"target_confidence":{"type":"number","default":0.7,"minimum":0,"maximum":1},"max_extra_queries":{"type":"integer","default":3,"minimum":0,"maximum":20,"description":"Search budget per round. Agent mode requires a positive value; selected agents use max_rounds * max_extra_queries + 1 native iterations, including the final answer."},"max_tokens":{"type":"integer","default":4096,"minimum":256,"maximum":64000},"drop_noise":{"type":"boolean","default":true},"share_notes":{"type":"boolean","default":true},"tools":{"type":"array","default":["keyword_search","semantic_search","read_section","read_outline"],"items":{"type":"string","enum":["keyword_search","semantic_search","read_section","read_outline"]},"uniqueItems":true},"agent_id":{"type":"string","minLength":1,"title":"Scouting agent","description":"Agent component id readable by the saver and runner. Applies to agent mode; omit to use the built-in loop.","picker":"wc-component-picker","class":"agent"},"temperature":{"type":"number","minimum":0,"maximum":2,"default":0,"description":"Sampling temperature for the built-in loop and agent model calls; a selected agent uses its own settings. Defaults to 0; unset uses the provider default."}},"required":["enabled","mode","model","max_rounds","target_confidence","max_extra_queries","max_tokens","drop_noise","share_notes","tools"],"default":{"enabled":true,"mode":"loop","model":"class:fast","max_rounds":0,"target_confidence":0.7,"max_extra_queries":3,"max_tokens":4096,"drop_noise":true,"share_notes":true,"tools":["keyword_search","semantic_search","read_section","read_outline"],"temperature":0}},"deep":{"type":"object","additionalProperties":false,"properties":{"enabled":{"type":"boolean","default":true},"model":{"type":"string","default":"class:fast","minLength":1,"maxLength":200},"query_model":{"type":"string","default":"class:fast","minLength":1,"maxLength":200},"read":{"type":"string","default":"chunks","enum":["chunks","sections"]},"parallel_fields":{"type":"integer","default":4,"minimum":1,"maximum":20},"max_queries":{"type":"integer","default":5,"minimum":1,"maximum":100},"chunks_per_query":{"type":"integer","default":50,"minimum":1,"maximum":1000},"chunk_cap":{"type":"integer","default":100,"minimum":1,"maximum":10000},"min_similarity":{"type":"number","default":0.2,"minimum":0,"maximum":1},"query_temperature":{"type":"number","default":0.2,"minimum":0,"maximum":2},"analysis_temperature":{"type":"number","default":0.2,"minimum":0,"maximum":2},"max_tokens":{"type":"integer","minimum":256,"maximum":64000,"description":"Output token limit for the analysis. Unset uses the provider default; an analysis cut at the limit fails its field."}},"required":["enabled","model","query_model","read","parallel_fields","max_queries","chunks_per_query","chunk_cap","min_similarity","query_temperature","analysis_temperature"],"default":{"enabled":true,"model":"class:fast","query_model":"class:fast","read":"chunks","parallel_fields":4,"max_queries":5,"chunks_per_query":50,"chunk_cap":100,"min_similarity":0.2,"query_temperature":0.2,"analysis_temperature":0.2}},"extract":{"type":"object","additionalProperties":false,"properties":{"model":{"type":"string","default":"class:fast","minLength":1,"maxLength":200},"max_output_tokens":{"type":"integer","default":4096,"minimum":256,"maximum":64000},"max_fields_per_call":{"type":"integer","default":20,"minimum":1,"maximum":100},"temperature":{"type":"number","minimum":0,"maximum":2,"default":0,"description":"Sampling temperature for this stage's model calls. Defaults to 0; unset uses the provider default."}},"required":["model","max_output_tokens","max_fields_per_call"],"default":{"model":"class:fast","max_output_tokens":4096,"max_fields_per_call":20,"temperature":0}},"verify":{"type":"object","additionalProperties":false,"properties":{"enabled":{"type":"boolean","default":false},"model":{"type":"string","default":"class:fast","minLength":1,"maxLength":200},"check_quotes":{"type":"boolean","default":true},"check_support":{"type":"boolean","default":true},"temperature":{"type":"number","minimum":0,"maximum":2,"default":0,"description":"Sampling temperature for this stage's model calls. Defaults to 0; unset uses the provider default."},"max_tokens":{"type":"integer","minimum":256,"maximum":64000,"description":"Output token limit for this stage's model calls. Unset uses the provider default."},"check_completeness":{"type":"boolean","default":false,"description":"Opt in to field-aware support and completeness of requested text and list values. Requires quote support; adds source input tokens. An unknown judgment remains absent from complete."}},"required":["enabled","model","check_quotes","check_support"],"default":{"enabled":false,"model":"class:fast","check_quotes":true,"check_support":true,"temperature":0,"check_completeness":false}}},"required":["map","prefetch","scout","deep","extract","verify"],"default":{"map":{"enabled":true,"model":"class:fast","outline":"find_or_build","section_summaries":false,"temperature":0},"prefetch":{"enabled":true,"queries":[]},"scout":{"enabled":true,"mode":"loop","model":"class:fast","max_rounds":0,"target_confidence":0.7,"max_extra_queries":3,"max_tokens":4096,"drop_noise":true,"share_notes":true,"tools":["keyword_search","semantic_search","read_section","read_outline"],"temperature":0},"deep":{"enabled":true,"model":"class:fast","query_model":"class:fast","read":"chunks","parallel_fields":4,"max_queries":5,"chunks_per_query":50,"chunk_cap":100,"min_similarity":0.2,"query_temperature":0.2,"analysis_temperature":0.2},"extract":{"model":"class:fast","max_output_tokens":4096,"max_fields_per_call":20,"temperature":0},"verify":{"enabled":false,"model":"class:fast","check_quotes":true,"check_support":true,"temperature":0,"check_completeness":false}}},"retrieval":{"type":"object","additionalProperties":false,"properties":{"chunk_size":{"type":"integer","default":1200,"minimum":100,"maximum":16000},"overlap":{"type":"integer","default":150,"minimum":0,"maximum":4000},"split_headings":{"type":"boolean","default":true},"keep_tables":{"type":"boolean","default":true},"search_mode":{"type":"string","default":"hybrid","enum":["keyword","semantic","hybrid"]},"embedding_model":{"type":"string","default":"class:embed","minLength":1,"maxLength":200},"context":{"type":"string","default":"headings","enum":["none","headings","generated"]},"context_model":{"type":"string","default":"class:fast","minLength":1,"maxLength":200},"highlighter":{"type":"boolean","default":false},"highlighter_model":{"type":"string","default":"class:fast","minLength":1,"maxLength":200},"highlighter_temperature":{"type":"number","minimum":0,"maximum":2,"description":"Sampling temperature for the highlighter's model calls. Unset uses the provider default."},"highlighter_max_tokens":{"type":"integer","minimum":256,"maximum":64000,"description":"Output token limit for the highlighter's model calls. Unset uses the provider default."},"section_budget":{"type":"integer","default":6000,"minimum":500,"maximum":64000}},"required":["chunk_size","overlap","split_headings","keep_tables","search_mode","embedding_model","context","context_model","highlighter","highlighter_model","section_budget"],"default":{"chunk_size":1200,"overlap":150,"split_headings":true,"keep_tables":true,"search_mode":"hybrid","embedding_model":"class:embed","context":"headings","context_model":"class:fast","highlighter":false,"highlighter_model":"class:fast","section_budget":6000}},"tags":{"type":"array","default":[],"items":{"type":"string","minLength":1,"maxLength":80},"uniqueItems":true,"maxItems":50}}`), f = {
  properties: k,
  default: { fields: [], stages: { map: { enabled: !0, model: "class:fast", outline: "find_or_build", section_summaries: !1, temperature: 0 }, prefetch: { enabled: !0, queries: [] }, scout: { enabled: !0, mode: "loop", model: "class:fast", max_rounds: 0, target_confidence: 0.7, max_extra_queries: 3, max_tokens: 4096, drop_noise: !0, share_notes: !0, tools: ["keyword_search", "semantic_search", "read_section", "read_outline"], temperature: 0 }, deep: { enabled: !0, model: "class:fast", query_model: "class:fast", read: "chunks", parallel_fields: 4, max_queries: 5, chunks_per_query: 50, chunk_cap: 100, min_similarity: 0.2, query_temperature: 0.2, analysis_temperature: 0.2 }, extract: { model: "class:fast", max_output_tokens: 4096, max_fields_per_call: 20, temperature: 0 }, verify: { enabled: !1, model: "class:fast", check_quotes: !0, check_support: !0, temperature: 0, check_completeness: !1 } }, retrieval: { chunk_size: 1200, overlap: 150, split_headings: !0, keep_tables: !0, search_mode: "hybrid", embedding_model: "class:embed", context: "headings", context_model: "class:fast", highlighter: !1, highlighter_model: "class:fast", section_budget: 6e3 }, tags: [] }
}, v = 4, z = () => ({ name: "", type: "text", description: "", enum_values: [], expected_format: "", required: !1 }), A = () => ({ type: "text", description: "", enum_values: [], expected_format: "" }), c = (e) => e.group ? `${e.group}.${e.name}` : e.name, q = /^(?:[a-z][a-z0-9]*(?:_[a-z0-9]+)*(?:\.[a-z][a-z0-9]*(?:_[a-z0-9]+)*)*)?$/;
function S(e) {
  return e.find((t) => e.some((a) => a !== t && a.startsWith(t + ".")));
}
function P(e, t) {
  let a = e;
  for (const r of t.split(".")) {
    if (a === null || typeof a != "object" || !Object.hasOwn(a, r)) return;
    a = a[r];
  }
  return a;
}
function C(e, t, a) {
  const r = t.split(".");
  let s = e;
  for (const n of r.slice(0, -1))
    Object.hasOwn(s, n) || (s[n] = {}), s = s[n];
  Object.defineProperty(s, r.at(-1), { value: a, writable: !0, enumerable: !0, configurable: !0 });
}
function O(e) {
  const t = { name: "", path: "", indices: [], children: [] };
  return e.forEach((a, r) => {
    let s = t;
    for (const n of a.split(".").slice(0, -1)) {
      let u = s.children.find((m) => m.name === n);
      u || (u = { name: n, path: s.path ? `${s.path}.${n}` : n, indices: [], children: [] }, s.children.push(u)), s = u;
    }
    s.indices.push(r);
  }), t;
}
function U() {
  return structuredClone(f.default);
}
const I = () => structuredClone(f.properties.fields.items.default), D = () => ({ name: "", query: "", chunks: 5 }), E = () => [...f.properties.stages.properties.scout.properties.tools.default], _ = f, g = (e) => ({ min: e?.minimum ?? 0, max: e?.maximum ?? 100 }), M = (e, t) => g(_.properties.stages.properties[e]?.properties[t]), N = (e) => g(_.properties.retrieval.properties[e]), F = { map: "Map the document", prefetch: "Prefetch", scout: "Scout loop", deep: "Deep analysis", extract: "Extract", verify: "Verify" }, B = { map: "tabler:list-tree", prefetch: "tabler:search", scout: "tabler:radar-2", deep: "tabler:microscope", extract: "tabler:table-export", verify: "tabler:shield-check" }, R = {
  map: "Find the table of contents or build an outline, then pick the sections each field should read.",
  prefetch: "Search for every field by its name, description and hints, plus any fixed queries, to fill the evidence pool.",
  scout: "Judge the evidence, drop noise and look for more until confident.",
  deep: "Give each deep field its own searches and a written analysis, several fields at a time.",
  extract: "Fill the fields from the evidence, one group of fields per call.",
  verify: "Check that each quote exists in the document and supports its value."
}, W = (e, t) => t === "extract" || e.stages[t].enabled, d = (e, t) => `${e} ${e === 1 ? t : t.endsWith("y") ? t.slice(0, -1) + "ies" : t + "s"}`;
function y(e) {
  const t = /* @__PURE__ */ new Map();
  for (const a of e.fields) {
    const r = a.group.trim() || "Default";
    t.set(r, [...t.get(r) ?? [], a]);
  }
  return [...t].map(([a, r]) => ({ name: a, fields: r }));
}
function w(e) {
  return y(e).reduce((t, a) => t + Math.max(1, Math.ceil(a.fields.length / e.stages.extract.max_fields_per_call)), 0);
}
function J(e, t) {
  const a = t.stages;
  switch (e) {
    case "map": {
      const r = t.fields.filter((s) => s.search_within === "sections").length;
      return [a.map.outline === "build" ? "Always build an outline" : "Contents first, else build", r ? `${d(r, "field")} read Map's sections` : ""].filter(Boolean).join(" · ");
    }
    case "prefetch": {
      const r = t.fields.filter((n) => n.strategy !== "deep" || !a.deep.enabled).length, s = t.fields.filter((n) => n.search_hints.trim()).length;
      return [d(r, "field"), s ? d(s, "field hint") : "", a.prefetch.queries.length ? d(a.prefetch.queries.length, "query") : ""].filter(Boolean).join(" · ");
    }
    case "scout":
      return a.scout.mode === "agent" ? `Agent with tools · up to ${d(a.scout.max_rounds * a.scout.max_extra_queries, "tool call")}` : `Structured loop · ${a.scout.max_rounds ? `up to ${d(a.scout.max_rounds, "round")}, stop at ${Math.round(a.scout.target_confidence * 100)}%` : "single pass"}`;
    case "deep": {
      const r = t.fields.filter((s) => s.strategy === "deep").length;
      return r ? `${d(r, "field")} · reads ${a.deep.read} · ${a.deep.parallel_fields} at a time` : "No deep fields";
    }
    case "extract": {
      const r = w(t);
      return `Structured output · ${d(y(t).length, "group")}, ${d(r, "call")}`;
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
const Z = (e, t = !0) => e.type === "enum" || !t && e.type === "text";
function h(e, t = 1) {
  if (t > v) return "Shapes support at most four levels.";
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
    for (const r of e.properties) {
      const s = x(r.name, [...a]) || h(r, t + 1);
      if (s) return `${r.name || "New property"}: ${s}`;
      a.add(r.name);
    }
  } else if (e.properties) return "Properties apply to object shapes.";
  return e.type === "list" ? e.item ? h(e.item, t + 1) : "Declare the item shape." : e.item ? "Item shapes apply to lists." : "";
}
function x(e, t) {
  return e ? e.length > 80 ? "Use at most 80 characters for a name." : /^[A-Za-z][A-Za-z0-9_]*$/.test(e) ? t.includes(e) ? "Another field already uses this name." : "" : "Start with a letter; use letters, numbers and underscores." : "Name the field.";
}
function L(e, t) {
  const a = x(e.name, t.includes(c(e)) ? [e.name] : []);
  return a || (t.some((r) => r !== c(e) && (r.startsWith(c(e) + ".") || c(e).startsWith(r + "."))) ? `Group path collides with field ${c(e)}.` : e.group.length > 320 ? "Use at most 320 characters for a group path." : q.test(e.group) ? e.search_hints.length > 4e3 || e.validation_hints.length > 4e3 ? "Use at most 4000 characters for hints." : !Number.isInteger(e.chunks) || e.chunks < 1 || e.chunks > 1e3 ? "Chunks to read must be an integer from 1 to 1000." : e.enum_values.length && e.type !== "enum" ? "Allowed values apply to enum fields and text items." : h(e) : "Use a dotted path of snake_case group names.");
}
function G(e) {
  const t = e.type === "list" ? e.item?.type : e.type;
  return { text: "For example, full legal name", number: "For example, decimal with 2 places", date: "For example, YYYY-MM-DD", object: "Describe the object format", boolean: "", enum: "" }[t ?? ""] ?? "";
}
function H(e) {
  if (e.fields.length > 100) return "Use at most 100 fields.";
  for (const [r, s] of e.fields.entries()) {
    const n = L(s, e.fields.filter((u, m) => m !== r).map(c));
    if (n) return `${s.name || "New field"}: ${n}`;
  }
  const t = e.stages;
  if (t.prefetch.queries.some((r) => !r.name.trim() || !r.query.trim())) return "Prefetch queries need a name and a query.";
  if (!t.map.enabled && e.fields.some((r) => r.search_within === "sections")) return "Fields that read sections need Map the document.";
  const a = e.fields.find((r) => !(r.strategy === "deep" && t.deep.enabled) && !t.prefetch.enabled && !t.scout.enabled);
  return a ? `Turn on Prefetch or Scout so extraction has passages to read for ${a.name}.` : t.scout.enabled && t.scout.mode === "agent" && !t.scout.tools.length ? "Agent scouting needs at least one tool." : t.scout.enabled && t.scout.mode === "agent" && (!t.scout.max_rounds || !t.scout.max_extra_queries) ? "Agent scouting needs at least one round and one tool call per round." : t.verify.check_completeness && !t.verify.check_support ? "Completeness requires quote support." : t.verify.enabled && !t.verify.check_quotes && !t.verify.check_support ? "Verify needs at least one check." : e.retrieval.overlap >= e.retrieval.chunk_size ? "Overlap must be smaller than chunk size." : "";
}
function Q(e, t) {
  const a = (r, s) => s !== null && typeof s == "object" && !Array.isArray(s) ? Object.fromEntries(Object.keys(s).sort().map((n) => [n, s[n]])) : s;
  return JSON.stringify(e, a) === JSON.stringify(t, a);
}
export {
  S as A,
  O as B,
  T as C,
  P as D,
  H as E,
  Q as F,
  v as M,
  B as a,
  J as b,
  j as c,
  c as d,
  C as e,
  y as f,
  z as g,
  I as h,
  W as i,
  A as j,
  x as k,
  h as l,
  V as m,
  U as n,
  Z as o,
  G as p,
  L as q,
  q as r,
  F as s,
  Y as t,
  E as u,
  R as v,
  D as w,
  w as x,
  M as y,
  N as z
};
