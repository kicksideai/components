import { api as s } from "@wippy-fe/proxy";
import { h as F, B as j, l as L, c as R, s as B, f as w, R as V } from "./wc-runtime-CWPiLYui.js";
import { openBlock as g, createElementBlock as v, mergeProps as c, createElementVNode as W, renderSlot as y, createTextVNode as Z, toDisplayString as O, resolveComponent as C, resolveDirective as G, withDirectives as J, createBlock as S, resolveDynamicComponent as Y, withCtx as H, createCommentVNode as $, normalizeClass as A } from "vue";
/*! SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 */
const p = (t) => `/api/v1/docscout/${encodeURIComponent(t)}`;
function u(t) {
  if (t.success === !1) throw new Error(t.error || "Request failed");
  return t;
}
const K = (t) => t.response?.data, jt = {
  async list(t = {}) {
    return u((await s.get("/api/v1/docscout", { params: t })).data);
  },
  async get(t) {
    return u((await s.get(p(t))).data);
  },
  async create(t) {
    return u((await s.post("/api/v1/docscout", t)).data);
  },
  async update(t, e) {
    return u((await s.put(p(t), e)).data);
  },
  async addCase(t, e) {
    return u((await s.post(p(t) + "/cases", e)).data);
  },
  async deleteCase(t, e) {
    u((await s.delete(p(t) + "/cases/" + encodeURIComponent(e))).data);
  },
  // A run that stops partway still answers with its run id and step trace.
  async run(t, e, n) {
    const o = { upload_id: e };
    n !== void 0 && (o.pages = n);
    try {
      return u((await s.post(p(t) + "/run", o)).data);
    } catch (r) {
      const a = K(r), d = a?.details?.trace;
      if (!d) throw r;
      return { run_id: a?.details?.run_id ?? "", upload_id: e, config_revision: 0, values: {}, fields: [], trace: d, duration_ms: d.reduce((b, h) => b + h.duration_ms, 0), tokens: d.reduce((b, h) => b + h.input_tokens + h.output_tokens, 0), status: "failed", error: a?.error };
    }
  },
  async evaluate(t) {
    return u((await s.post(p(t) + "/evaluations", {})).data);
  },
  async evaluations(t) {
    return u((await s.get(p(t) + "/evaluations")).data).items;
  },
  async evaluation(t, e) {
    return u((await s.get(p(t) + "/evaluations/" + encodeURIComponent(e))).data).evaluation;
  },
  async remove(t) {
    u((await s.delete(p(t))).data);
  }
}, Q = /* @__PURE__ */ JSON.parse(`{"retention":{"type":"string","minLength":1,"title":"Retention window","description":"Positive duration for new processed documents and runs, for example 24h. Omit to use the global Docscout retention setting. Existing rows keep their expiry."},"fields":{"type":"array","default":[],"items":{"type":"object","additionalProperties":false,"properties":{"name":{"type":"string","default":"","maxLength":80,"pattern":"^[A-Za-z][A-Za-z0-9_]*$"},"type":{"type":"string","default":"text","enum":["text","number","boolean","date","enum","list","object"]},"description":{"type":"string","default":"","maxLength":4000},"enum_values":{"type":"array","default":[],"items":{"type":"string","minLength":1,"maxLength":200},"uniqueItems":true,"maxItems":100},"required":{"type":"boolean","default":false},"search_hints":{"type":"string","default":"","maxLength":4000},"validation_hints":{"type":"string","default":"","maxLength":4000},"expected_format":{"type":"string","default":"","maxLength":400},"strategy":{"type":"string","default":"standard","enum":["standard","deep"]},"search_within":{"type":"string","default":"document","enum":["document","sections"]},"group":{"type":"string","default":"","maxLength":320,"pattern":"^(?:[a-z][a-z0-9]*(?:_[a-z0-9]+)*(?:\\\\.[a-z][a-z0-9]*(?:_[a-z0-9]+)*)*)?$"},"evidence_required":{"type":"boolean","default":true},"chunks":{"type":"integer","default":5,"minimum":1,"maximum":1000},"properties":{"type":"array","minItems":1,"maxItems":100,"items":{"$ref":"#/$defs/property2"}},"item":{"$ref":"#/$defs/shape2"}},"required":["name","type","description","enum_values","required","search_hints","validation_hints","expected_format","strategy","search_within","group","evidence_required","chunks"],"default":{"name":"","type":"text","description":"","enum_values":[],"required":false,"search_hints":"","validation_hints":"","expected_format":"","strategy":"standard","search_within":"document","group":"","evidence_required":true,"chunks":5},"allOf":[{"if":{"properties":{"type":{"const":"object"}}},"then":{"required":["properties"]}},{"if":{"properties":{"type":{"const":"list"}}},"then":{"required":["item"]}}]},"maxItems":100},"stages":{"type":"object","additionalProperties":false,"properties":{"map":{"type":"object","additionalProperties":false,"properties":{"enabled":{"type":"boolean","default":true},"model":{"type":"string","default":"class:fast","minLength":1,"maxLength":200},"outline":{"type":"string","default":"find_or_build","enum":["find_or_build","build"]},"section_summaries":{"type":"boolean","default":false},"temperature":{"type":"number","minimum":0,"maximum":2,"default":0,"description":"Sampling temperature for this stage's model calls. Defaults to 0; unset uses the provider default."},"max_tokens":{"type":"integer","minimum":256,"maximum":64000,"description":"Output token limit for this stage's model calls. Unset uses the provider default."}},"required":["enabled","model","outline","section_summaries"],"default":{"enabled":true,"model":"class:fast","outline":"find_or_build","section_summaries":false,"temperature":0}},"prefetch":{"type":"object","additionalProperties":false,"properties":{"enabled":{"type":"boolean","default":true},"queries":{"type":"array","default":[],"items":{"type":"object","additionalProperties":false,"properties":{"name":{"type":"string","minLength":1,"maxLength":200,"default":""},"query":{"type":"string","minLength":1,"maxLength":4000,"default":""},"chunks":{"type":"integer","default":5,"minimum":1,"maximum":1000}},"required":["name","query","chunks"],"default":{"name":"","query":"","chunks":5}},"maxItems":100}},"required":["enabled","queries"],"default":{"enabled":true,"queries":[]}},"scout":{"type":"object","additionalProperties":false,"properties":{"enabled":{"type":"boolean","default":true},"mode":{"type":"string","default":"loop","enum":["loop","agent"]},"model":{"type":"string","default":"class:fast","minLength":1,"maxLength":200},"max_rounds":{"type":"integer","default":0,"minimum":0,"maximum":30,"description":"Extra search rounds for structured scouting. Agent mode requires at least one round, including when a user agent is selected."},"target_confidence":{"type":"number","default":0.7,"minimum":0,"maximum":1},"max_extra_queries":{"type":"integer","default":3,"minimum":0,"maximum":20,"description":"Search budget per round. Agent mode requires a positive value; selected agents use max_rounds * max_extra_queries + 1 native iterations, including the final answer."},"max_tokens":{"type":"integer","default":4096,"minimum":256,"maximum":64000},"drop_noise":{"type":"boolean","default":true},"share_notes":{"type":"boolean","default":true},"tools":{"type":"array","default":["keyword_search","semantic_search","read_section","read_outline"],"items":{"type":"string","enum":["keyword_search","semantic_search","read_section","read_outline"]},"uniqueItems":true},"agent_id":{"type":"string","minLength":1,"title":"Scouting agent","description":"Agent component id readable by the saver and runner. Applies to agent mode; omit to use the built-in loop.","picker":"wc-component-picker","class":"agent"},"temperature":{"type":"number","minimum":0,"maximum":2,"default":0,"description":"Sampling temperature for the built-in loop and agent model calls; a selected agent uses its own settings. Defaults to 0; unset uses the provider default."}},"required":["enabled","mode","model","max_rounds","target_confidence","max_extra_queries","max_tokens","drop_noise","share_notes","tools"],"default":{"enabled":true,"mode":"loop","model":"class:fast","max_rounds":0,"target_confidence":0.7,"max_extra_queries":3,"max_tokens":4096,"drop_noise":true,"share_notes":true,"tools":["keyword_search","semantic_search","read_section","read_outline"],"temperature":0}},"deep":{"type":"object","additionalProperties":false,"properties":{"enabled":{"type":"boolean","default":true},"model":{"type":"string","default":"class:fast","minLength":1,"maxLength":200},"query_model":{"type":"string","default":"class:fast","minLength":1,"maxLength":200},"read":{"type":"string","default":"chunks","enum":["chunks","sections"]},"parallel_fields":{"type":"integer","default":4,"minimum":1,"maximum":20},"max_queries":{"type":"integer","default":5,"minimum":1,"maximum":100},"chunks_per_query":{"type":"integer","default":50,"minimum":1,"maximum":1000},"chunk_cap":{"type":"integer","default":100,"minimum":1,"maximum":10000},"min_similarity":{"type":"number","default":0.2,"minimum":0,"maximum":1},"query_temperature":{"type":"number","default":0.2,"minimum":0,"maximum":2},"analysis_temperature":{"type":"number","default":0.2,"minimum":0,"maximum":2},"max_tokens":{"type":"integer","minimum":256,"maximum":64000,"description":"Output token limit for the analysis. Unset uses the provider default; an analysis cut at the limit fails its field."}},"required":["enabled","model","query_model","read","parallel_fields","max_queries","chunks_per_query","chunk_cap","min_similarity","query_temperature","analysis_temperature"],"default":{"enabled":true,"model":"class:fast","query_model":"class:fast","read":"chunks","parallel_fields":4,"max_queries":5,"chunks_per_query":50,"chunk_cap":100,"min_similarity":0.2,"query_temperature":0.2,"analysis_temperature":0.2}},"extract":{"type":"object","additionalProperties":false,"properties":{"reads":{"type":"string","enum":["text","pages"],"description":"Read values from processed text or physical page images. Unset reads text."},"max_pages":{"type":"integer","minimum":1,"maximum":32,"description":"Maximum page images per extraction or visual verification call. Context budgeting can admit fewer."},"model":{"type":"string","default":"class:fast","minLength":1,"maxLength":200},"max_output_tokens":{"type":"integer","default":4096,"minimum":256,"maximum":64000},"max_fields_per_call":{"type":"integer","default":20,"minimum":1,"maximum":100},"temperature":{"type":"number","minimum":0,"maximum":2,"default":0,"description":"Sampling temperature for this stage's model calls. Defaults to 0; unset uses the provider default."}},"if":{"required":["reads"],"properties":{"reads":{"const":"pages"}}},"then":{"required":["max_pages"]},"required":["model","max_output_tokens","max_fields_per_call"],"default":{"model":"class:fast","max_output_tokens":4096,"max_fields_per_call":20,"temperature":0}},"verify":{"type":"object","additionalProperties":false,"properties":{"enabled":{"type":"boolean","default":false},"model":{"type":"string","default":"class:fast","minLength":1,"maxLength":200},"check_quotes":{"type":"boolean","default":true},"check_support":{"type":"boolean","default":true},"temperature":{"type":"number","minimum":0,"maximum":2,"default":0,"description":"Sampling temperature for this stage's model calls. Defaults to 0; unset uses the provider default."},"max_tokens":{"type":"integer","minimum":256,"maximum":64000,"description":"Output token limit for this stage's model calls. Unset uses the provider default."},"check_completeness":{"type":"boolean","default":false,"description":"Opt in to field-aware support and completeness of requested text and list values. Requires quote support; adds source input tokens. An unknown judgment remains absent from complete."}},"required":["enabled","model","check_quotes","check_support"],"default":{"enabled":false,"model":"class:fast","check_quotes":true,"check_support":true,"temperature":0,"check_completeness":false}}},"required":["map","prefetch","scout","deep","extract","verify"],"default":{"map":{"enabled":true,"model":"class:fast","outline":"find_or_build","section_summaries":false,"temperature":0},"prefetch":{"enabled":true,"queries":[]},"scout":{"enabled":true,"mode":"loop","model":"class:fast","max_rounds":0,"target_confidence":0.7,"max_extra_queries":3,"max_tokens":4096,"drop_noise":true,"share_notes":true,"tools":["keyword_search","semantic_search","read_section","read_outline"],"temperature":0},"deep":{"enabled":true,"model":"class:fast","query_model":"class:fast","read":"chunks","parallel_fields":4,"max_queries":5,"chunks_per_query":50,"chunk_cap":100,"min_similarity":0.2,"query_temperature":0.2,"analysis_temperature":0.2},"extract":{"model":"class:fast","max_output_tokens":4096,"max_fields_per_call":20,"temperature":0},"verify":{"enabled":false,"model":"class:fast","check_quotes":true,"check_support":true,"temperature":0,"check_completeness":false}}},"retrieval":{"type":"object","additionalProperties":false,"properties":{"chunk_size":{"type":"integer","default":1200,"minimum":100,"maximum":16000},"overlap":{"type":"integer","default":150,"minimum":0,"maximum":4000},"split_headings":{"type":"boolean","default":true},"keep_tables":{"type":"boolean","default":true},"search_mode":{"type":"string","default":"hybrid","enum":["keyword","semantic","hybrid"]},"embedding_model":{"type":"string","default":"class:embed","minLength":1,"maxLength":200},"context":{"type":"string","default":"headings","enum":["none","headings","generated"]},"context_model":{"type":"string","default":"class:fast","minLength":1,"maxLength":200},"highlighter":{"type":"boolean","default":false},"highlighter_model":{"type":"string","default":"class:fast","minLength":1,"maxLength":200},"highlighter_temperature":{"type":"number","minimum":0,"maximum":2,"description":"Sampling temperature for the highlighter's model calls. Unset uses the provider default."},"highlighter_max_tokens":{"type":"integer","minimum":256,"maximum":64000,"description":"Output token limit for the highlighter's model calls. Unset uses the provider default."},"section_budget":{"type":"integer","default":6000,"minimum":500,"maximum":64000}},"required":["chunk_size","overlap","split_headings","keep_tables","search_mode","embedding_model","context","context_model","highlighter","highlighter_model","section_budget"],"default":{"chunk_size":1200,"overlap":150,"split_headings":true,"keep_tables":true,"search_mode":"hybrid","embedding_model":"class:embed","context":"headings","context_model":"class:fast","highlighter":false,"highlighter_model":"class:fast","section_budget":6000}},"tags":{"type":"array","default":[],"items":{"type":"string","minLength":1,"maxLength":80},"uniqueItems":true,"maxItems":50}}`), q = {
  properties: Q,
  default: { fields: [], stages: { map: { enabled: !0, model: "class:fast", outline: "find_or_build", section_summaries: !1, temperature: 0 }, prefetch: { enabled: !0, queries: [] }, scout: { enabled: !0, mode: "loop", model: "class:fast", max_rounds: 0, target_confidence: 0.7, max_extra_queries: 3, max_tokens: 4096, drop_noise: !0, share_notes: !0, tools: ["keyword_search", "semantic_search", "read_section", "read_outline"], temperature: 0 }, deep: { enabled: !0, model: "class:fast", query_model: "class:fast", read: "chunks", parallel_fields: 4, max_queries: 5, chunks_per_query: 50, chunk_cap: 100, min_similarity: 0.2, query_temperature: 0.2, analysis_temperature: 0.2 }, extract: { model: "class:fast", max_output_tokens: 4096, max_fields_per_call: 20, temperature: 0 }, verify: { enabled: !1, model: "class:fast", check_quotes: !0, check_support: !0, temperature: 0, check_completeness: !1 } }, retrieval: { chunk_size: 1200, overlap: 150, split_headings: !0, keep_tables: !0, search_mode: "hybrid", embedding_model: "class:embed", context: "headings", context_model: "class:fast", highlighter: !1, highlighter_model: "class:fast", section_budget: 6e3 }, tags: [] }
}, X = 4, Lt = () => ({ name: "", type: "text", description: "", enum_values: [], expected_format: "", required: !1 }), Bt = () => ({ type: "text", description: "", enum_values: [], expected_format: "" }), f = (t) => t.group ? `${t.group}.${t.name}` : t.name, tt = /^(?:[a-z][a-z0-9]*(?:_[a-z0-9]+)*(?:\.[a-z][a-z0-9]*(?:_[a-z0-9]+)*)*)?$/;
function Ot(t) {
  return t.find((e) => t.some((n) => n !== e && n.startsWith(e + ".")));
}
function Ut(t, e) {
  let n = t;
  for (const o of e.split(".")) {
    if (n === null || typeof n != "object" || !Object.hasOwn(n, o)) return;
    n = n[o];
  }
  return n;
}
function Nt(t, e, n) {
  const o = e.split(".");
  let r = t;
  for (const a of o.slice(0, -1))
    Object.hasOwn(r, a) || (r[a] = {}), r = r[a];
  Object.defineProperty(r, o.at(-1), { value: n, writable: !0, enumerable: !0, configurable: !0 });
}
function Et(t) {
  const e = { name: "", path: "", indices: [], children: [] };
  return t.forEach((n, o) => {
    let r = e;
    for (const a of n.split(".").slice(0, -1)) {
      let d = r.children.find((b) => b.name === a);
      d || (d = { name: a, path: r.path ? `${r.path}.${a}` : a, indices: [], children: [] }, r.children.push(d)), r = d;
    }
    r.indices.push(o);
  }), e;
}
function Tt() {
  return structuredClone(q.default);
}
const Dt = () => structuredClone(q.properties.fields.items.default), Mt = () => ({ name: "", query: "", chunks: 5 }), Ft = () => [...q.properties.stages.properties.scout.properties.tools.default], U = q, N = (t) => ({ min: t?.minimum ?? 0, max: t?.maximum ?? 100 }), Rt = (t, e) => N(U.properties.stages.properties[t]?.properties[e]), Vt = (t) => N(U.properties.retrieval.properties[t]), Wt = { map: "Map the document", prefetch: "Prefetch", scout: "Scout loop", deep: "Deep analysis", extract: "Extract", verify: "Verify" }, Zt = { map: "tabler:list-tree", prefetch: "tabler:search", scout: "tabler:radar-2", deep: "tabler:microscope", extract: "tabler:table-export", verify: "tabler:shield-check" }, Gt = {
  map: "Find the table of contents or build an outline, then pick the sections each field should read.",
  prefetch: "Search for every field by its name, description and hints, plus any fixed queries, to fill the evidence pool.",
  scout: "Judge the evidence, drop noise and look for more until confident.",
  deep: "Give each deep field its own searches and a written analysis, several fields at a time.",
  extract: "Fill the fields from the evidence, one group of fields per call.",
  verify: "Check that each quote exists in the document and supports its value."
}, Jt = (t, e) => e === "extract" || t.stages[e].enabled, m = (t, e) => `${t} ${t === 1 ? e : e.endsWith("y") ? e.slice(0, -1) + "ies" : e + "s"}`;
function E(t) {
  const e = /* @__PURE__ */ new Map();
  for (const n of t.fields) {
    const o = n.group.trim() || "Default";
    e.set(o, [...e.get(o) ?? [], n]);
  }
  return [...e].map(([n, o]) => ({ name: n, fields: o }));
}
function et(t) {
  return E(t).reduce((e, n) => e + Math.max(1, Math.ceil(n.fields.length / t.stages.extract.max_fields_per_call)), 0);
}
function Yt(t, e) {
  const n = e.stages;
  switch (t) {
    case "map": {
      const o = e.fields.filter((r) => r.search_within === "sections").length;
      return [n.map.outline === "build" ? "Always build an outline" : "Contents first, else build", o ? `${m(o, "field")} read Map's sections` : ""].filter(Boolean).join(" · ");
    }
    case "prefetch": {
      const o = e.fields.filter((a) => a.strategy !== "deep" || !n.deep.enabled).length, r = e.fields.filter((a) => a.search_hints.trim()).length;
      return [m(o, "field"), r ? m(r, "field hint") : "", n.prefetch.queries.length ? m(n.prefetch.queries.length, "query") : ""].filter(Boolean).join(" · ");
    }
    case "scout":
      return n.scout.mode === "agent" ? `Agent with tools · up to ${m(n.scout.max_rounds * n.scout.max_extra_queries, "tool call")}` : `Structured loop · ${n.scout.max_rounds ? `up to ${m(n.scout.max_rounds, "round")}, stop at ${Math.round(n.scout.target_confidence * 100)}%` : "single pass"}`;
    case "deep": {
      const o = e.fields.filter((r) => r.strategy === "deep").length;
      return o ? `${m(o, "field")} · reads ${n.deep.read} · ${n.deep.parallel_fields} at a time` : "No deep fields";
    }
    case "extract": {
      const o = et(e);
      return `Structured output · ${m(E(e).length, "group")}, ${m(o, "call")}`;
    }
    case "verify":
      return [n.verify.check_quotes ? "quotes exist" : "", n.verify.check_support ? "quotes support values" : ""].filter(Boolean).join(" · ") || "No checks";
  }
}
function Ht(t) {
  const e = t.context === "generated" ? "generated context" : t.context === "headings" ? "heading context" : "";
  return [`${t.chunk_size.toLocaleString()}-token chunks`, `${t.search_mode} search`, e, t.highlighter ? "highlighter" : ""].filter(Boolean).join(" · ");
}
function Kt(t) {
  return t ? t.startsWith("class:") ? t.slice(6).replace(/^\w/, (e) => e.toUpperCase()) : t.split("/").pop() ?? t : "";
}
function Qt(t) {
  return t.replace(/_/g, " ").replace(/^\w/, (e) => e.toUpperCase());
}
const Xt = (t, e = !0) => t.type === "enum" || !e && t.type === "text";
function P(t, e = 1) {
  if (e > X) return "Shapes support at most four levels.";
  const n = t;
  if (n.max_length !== void 0 && (!["text", "date", "enum"].includes(t.type) || !Number.isInteger(n.max_length) || n.max_length < 1)) return "Maximum characters must be a positive integer for text, date or enum members.";
  if ((t.description?.length ?? 0) > 4e3) return "Use at most 4000 characters for the description.";
  if ((t.expected_format?.length ?? 0) > 400) return "Use at most 400 characters for the expected format.";
  if ((t.enum_values?.length ?? 0) > 100) return "Use at most 100 allowed values.";
  if (t.enum_values?.some((o) => !o.length || o.length > 200)) return "Allowed values need 1 to 200 characters.";
  if (new Set(t.enum_values).size !== (t.enum_values?.length ?? 0)) return "Allowed values must be unique.";
  if (t.type === "enum" && !t.enum_values?.length) return "Add at least one allowed value.";
  if (t.enum_values?.length && t.type !== "enum" && t.type !== "text") return "Allowed values apply to enum fields and text items.";
  if (t.type === "object") {
    if (!t.properties?.length) return "Add at least one declared property.";
    if (t.properties.length > 100) return "Use at most 100 properties.";
    const o = /* @__PURE__ */ new Set();
    for (const r of t.properties) {
      const a = T(r.name, [...o]) || P(r, e + 1);
      if (a) return `${r.name || "New property"}: ${a}`;
      o.add(r.name);
    }
  } else if (t.properties) return "Properties apply to object shapes.";
  return t.type === "list" ? t.item ? P(t.item, e + 1) : "Declare the item shape." : t.item ? "Item shapes apply to lists." : "";
}
function T(t, e) {
  return t ? t.length > 80 ? "Use at most 80 characters for a name." : /^[A-Za-z][A-Za-z0-9_]*$/.test(t) ? e.includes(t) ? "Another field already uses this name." : "" : "Start with a letter; use letters, numbers and underscores." : "Name the field.";
}
function nt(t, e) {
  const n = T(t.name, e.includes(f(t)) ? [t.name] : []);
  return n || (e.some((o) => o !== f(t) && (o.startsWith(f(t) + ".") || f(t).startsWith(o + "."))) ? `Group path collides with field ${f(t)}.` : t.group.length > 320 ? "Use at most 320 characters for a group path." : tt.test(t.group) ? t.search_hints.length > 4e3 || t.validation_hints.length > 4e3 ? "Use at most 4000 characters for hints." : !Number.isInteger(t.chunks) || t.chunks < 1 || t.chunks > 1e3 ? "Chunks to read must be an integer from 1 to 1000." : t.enum_values.length && t.type !== "enum" ? "Allowed values apply to enum fields and text items." : P(t) : "Use a dotted path of snake_case group names.");
}
function te(t) {
  const e = t.type === "list" ? t.item?.type : t.type;
  return { text: "For example, full legal name", number: "For example, decimal with 2 places", date: "For example, YYYY-MM-DD", object: "Describe the object format", boolean: "", enum: "" }[e ?? ""] ?? "";
}
function ee(t) {
  if (t.fields.length > 100) return "Use at most 100 fields.";
  for (const [o, r] of t.fields.entries()) {
    const a = nt(r, t.fields.filter((d, b) => b !== o).map(f));
    if (a) return `${r.name || "New field"}: ${a}`;
  }
  const e = t.stages;
  if (e.prefetch.queries.some((o) => !o.name.trim() || !o.query.trim())) return "Prefetch queries need a name and a query.";
  if (!e.map.enabled && t.fields.some((o) => o.search_within === "sections")) return "Fields that read sections need Map the document.";
  const n = t.fields.find((o) => !(o.strategy === "deep" && e.deep.enabled) && !e.prefetch.enabled && !e.scout.enabled);
  return n ? `Turn on Prefetch or Scout so extraction has passages to read for ${n.name}.` : e.scout.enabled && e.scout.mode === "agent" && !e.scout.tools.length ? "Agent scouting needs at least one tool." : e.scout.enabled && e.scout.mode === "agent" && (!e.scout.max_rounds || !e.scout.max_extra_queries) ? "Agent scouting needs at least one round and one tool call per round." : e.extract.reads === "pages" && (!Number.isInteger(e.extract.max_pages) || e.extract.max_pages < 1 || e.extract.max_pages > 32) ? "Page images per call must be an integer from 1 to 32." : e.verify.check_completeness && !e.verify.check_support ? "Completeness requires quote support." : e.verify.enabled && !e.verify.check_quotes && !e.verify.check_support ? "Verify needs at least one check." : t.retrieval.overlap >= t.retrieval.chunk_size ? "Overlap must be smaller than chunk size." : "";
}
function ne(t, e) {
  const n = (o, r) => r !== null && typeof r == "object" && !Array.isArray(r) ? Object.fromEntries(Object.keys(r).sort().map((a) => [a, r[a]])) : r;
  return JSON.stringify(t, n) === JSON.stringify(e, n);
}
var D = {
  name: "SpinnerIcon",
  extends: F
};
function ot(t) {
  return dt(t) || it(t) || at(t) || rt();
}
function rt() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function at(t, e) {
  if (t) {
    if (typeof t == "string") return z(t, e);
    var n = {}.toString.call(t).slice(8, -1);
    return n === "Object" && t.constructor && (n = t.constructor.name), n === "Map" || n === "Set" ? Array.from(t) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? z(t, e) : void 0;
  }
}
function it(t) {
  if (typeof Symbol < "u" && t[Symbol.iterator] != null || t["@@iterator"] != null) return Array.from(t);
}
function dt(t) {
  if (Array.isArray(t)) return z(t);
}
function z(t, e) {
  (e == null || e > t.length) && (e = t.length);
  for (var n = 0, o = Array(e); n < e; n++) o[n] = t[n];
  return o;
}
function st(t, e, n, o, r, a) {
  return g(), v("svg", c({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, t.pti()), ot(e[0] || (e[0] = [W("path", {
    d: "M6.99701 14C5.85441 13.999 4.72939 13.7186 3.72012 13.1832C2.71084 12.6478 1.84795 11.8737 1.20673 10.9284C0.565504 9.98305 0.165424 8.89526 0.041387 7.75989C-0.0826496 6.62453 0.073125 5.47607 0.495122 4.4147C0.917119 3.35333 1.59252 2.4113 2.46241 1.67077C3.33229 0.930247 4.37024 0.413729 5.4857 0.166275C6.60117 -0.0811796 7.76026 -0.0520535 8.86188 0.251112C9.9635 0.554278 10.9742 1.12227 11.8057 1.90555C11.915 2.01493 11.9764 2.16319 11.9764 2.31778C11.9764 2.47236 11.915 2.62062 11.8057 2.73C11.7521 2.78503 11.688 2.82877 11.6171 2.85864C11.5463 2.8885 11.4702 2.90389 11.3933 2.90389C11.3165 2.90389 11.2404 2.8885 11.1695 2.85864C11.0987 2.82877 11.0346 2.78503 10.9809 2.73C9.9998 1.81273 8.73246 1.26138 7.39226 1.16876C6.05206 1.07615 4.72086 1.44794 3.62279 2.22152C2.52471 2.99511 1.72683 4.12325 1.36345 5.41602C1.00008 6.70879 1.09342 8.08723 1.62775 9.31926C2.16209 10.5513 3.10478 11.5617 4.29713 12.1803C5.48947 12.7989 6.85865 12.988 8.17414 12.7157C9.48963 12.4435 10.6711 11.7264 11.5196 10.6854C12.3681 9.64432 12.8319 8.34282 12.8328 7C12.8328 6.84529 12.8943 6.69692 13.0038 6.58752C13.1132 6.47812 13.2616 6.41667 13.4164 6.41667C13.5712 6.41667 13.7196 6.47812 13.8291 6.58752C13.9385 6.69692 14 6.84529 14 7C14 8.85651 13.2622 10.637 11.9489 11.9497C10.6356 13.2625 8.85432 14 6.99701 14Z",
    fill: "currentColor"
  }, null, -1)])), 16);
}
D.render = st;
var ut = `
    .p-badge {
        display: inline-flex;
        border-radius: dt('badge.border.radius');
        align-items: center;
        justify-content: center;
        padding: dt('badge.padding');
        background: dt('badge.primary.background');
        color: dt('badge.primary.color');
        font-size: dt('badge.font.size');
        font-weight: dt('badge.font.weight');
        min-width: dt('badge.min.width');
        height: dt('badge.height');
    }

    .p-badge-dot {
        width: dt('badge.dot.size');
        min-width: dt('badge.dot.size');
        height: dt('badge.dot.size');
        border-radius: 50%;
        padding: 0;
    }

    .p-badge-circle {
        padding: 0;
        border-radius: 50%;
    }

    .p-badge-secondary {
        background: dt('badge.secondary.background');
        color: dt('badge.secondary.color');
    }

    .p-badge-success {
        background: dt('badge.success.background');
        color: dt('badge.success.color');
    }

    .p-badge-info {
        background: dt('badge.info.background');
        color: dt('badge.info.color');
    }

    .p-badge-warn {
        background: dt('badge.warn.background');
        color: dt('badge.warn.color');
    }

    .p-badge-danger {
        background: dt('badge.danger.background');
        color: dt('badge.danger.color');
    }

    .p-badge-contrast {
        background: dt('badge.contrast.background');
        color: dt('badge.contrast.color');
    }

    .p-badge-sm {
        font-size: dt('badge.sm.font.size');
        min-width: dt('badge.sm.min.width');
        height: dt('badge.sm.height');
    }

    .p-badge-lg {
        font-size: dt('badge.lg.font.size');
        min-width: dt('badge.lg.min.width');
        height: dt('badge.lg.height');
    }

    .p-badge-xl {
        font-size: dt('badge.xl.font.size');
        min-width: dt('badge.xl.min.width');
        height: dt('badge.xl.height');
    }
`, lt = {
  root: function(e) {
    var n = e.props, o = e.instance;
    return ["p-badge p-component", {
      "p-badge-circle": R(n.value) && String(n.value).length === 1,
      "p-badge-dot": L(n.value) && !o.$slots.default,
      "p-badge-sm": n.size === "small",
      "p-badge-lg": n.size === "large",
      "p-badge-xl": n.size === "xlarge",
      "p-badge-info": n.severity === "info",
      "p-badge-success": n.severity === "success",
      "p-badge-warn": n.severity === "warn",
      "p-badge-danger": n.severity === "danger",
      "p-badge-secondary": n.severity === "secondary",
      "p-badge-contrast": n.severity === "contrast"
    }];
  }
}, ct = j.extend({
  name: "badge",
  style: ut,
  classes: lt
}), bt = {
  name: "BaseBadge",
  extends: B,
  props: {
    value: {
      type: [String, Number],
      default: null
    },
    severity: {
      type: String,
      default: null
    },
    size: {
      type: String,
      default: null
    }
  },
  style: ct,
  provide: function() {
    return {
      $pcBadge: this,
      $parentInstance: this
    };
  }
};
function x(t) {
  "@babel/helpers - typeof";
  return x = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
    return typeof e;
  } : function(e) {
    return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
  }, x(t);
}
function I(t, e, n) {
  return (e = pt(e)) in t ? Object.defineProperty(t, e, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : t[e] = n, t;
}
function pt(t) {
  var e = mt(t, "string");
  return x(e) == "symbol" ? e : e + "";
}
function mt(t, e) {
  if (x(t) != "object" || !t) return t;
  var n = t[Symbol.toPrimitive];
  if (n !== void 0) {
    var o = n.call(t, e);
    if (x(o) != "object") return o;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (e === "string" ? String : Number)(t);
}
var M = {
  name: "Badge",
  extends: bt,
  inheritAttrs: !1,
  computed: {
    dataP: function() {
      return w(I(I({
        circle: this.value != null && String(this.value).length === 1,
        empty: this.value == null && !this.$slots.default
      }, this.severity, this.severity), this.size, this.size));
    }
  }
}, gt = ["data-p"];
function ht(t, e, n, o, r, a) {
  return g(), v("span", c({
    class: t.cx("root"),
    "data-p": a.dataP
  }, t.ptmi("root")), [y(t.$slots, "default", {}, function() {
    return [Z(O(t.value), 1)];
  })], 16, gt);
}
M.render = ht;
var ft = `
    .p-button {
        display: inline-flex;
        cursor: pointer;
        user-select: none;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        position: relative;
        color: dt('button.primary.color');
        background: dt('button.primary.background');
        border: 1px solid dt('button.primary.border.color');
        padding: dt('button.padding.y') dt('button.padding.x');
        font-size: 1rem;
        font-family: inherit;
        font-feature-settings: inherit;
        transition:
            background dt('button.transition.duration'),
            color dt('button.transition.duration'),
            border-color dt('button.transition.duration'),
            outline-color dt('button.transition.duration'),
            box-shadow dt('button.transition.duration');
        border-radius: dt('button.border.radius');
        outline-color: transparent;
        gap: dt('button.gap');
    }

    .p-button:disabled {
        cursor: default;
    }

    .p-button-icon-right {
        order: 1;
    }

    .p-button-icon-right:dir(rtl) {
        order: -1;
    }

    .p-button:not(.p-button-vertical) .p-button-icon:not(.p-button-icon-right):dir(rtl) {
        order: 1;
    }

    .p-button-icon-bottom {
        order: 2;
    }

    .p-button-icon-only {
        width: dt('button.icon.only.width');
        padding-inline-start: 0;
        padding-inline-end: 0;
        gap: 0;
    }

    .p-button-icon-only.p-button-rounded {
        border-radius: 50%;
        height: dt('button.icon.only.width');
    }

    .p-button-icon-only .p-button-label {
        visibility: hidden;
        width: 0;
    }

    .p-button-icon-only::after {
        content: " ";
        visibility: hidden;
        width: 0;
    }

    .p-button-sm {
        font-size: dt('button.sm.font.size');
        padding: dt('button.sm.padding.y') dt('button.sm.padding.x');
    }

    .p-button-sm .p-button-icon {
        font-size: dt('button.sm.font.size');
    }

    .p-button-sm.p-button-icon-only {
        width: dt('button.sm.icon.only.width');
    }

    .p-button-sm.p-button-icon-only.p-button-rounded {
        height: dt('button.sm.icon.only.width');
    }

    .p-button-lg {
        font-size: dt('button.lg.font.size');
        padding: dt('button.lg.padding.y') dt('button.lg.padding.x');
    }

    .p-button-lg .p-button-icon {
        font-size: dt('button.lg.font.size');
    }

    .p-button-lg.p-button-icon-only {
        width: dt('button.lg.icon.only.width');
    }

    .p-button-lg.p-button-icon-only.p-button-rounded {
        height: dt('button.lg.icon.only.width');
    }

    .p-button-vertical {
        flex-direction: column;
    }

    .p-button-label {
        font-weight: dt('button.label.font.weight');
    }

    .p-button-fluid {
        width: 100%;
    }

    .p-button-fluid.p-button-icon-only {
        width: dt('button.icon.only.width');
    }

    .p-button:not(:disabled):hover {
        background: dt('button.primary.hover.background');
        border: 1px solid dt('button.primary.hover.border.color');
        color: dt('button.primary.hover.color');
    }

    .p-button:not(:disabled):active {
        background: dt('button.primary.active.background');
        border: 1px solid dt('button.primary.active.border.color');
        color: dt('button.primary.active.color');
    }

    .p-button:focus-visible {
        box-shadow: dt('button.primary.focus.ring.shadow');
        outline: dt('button.focus.ring.width') dt('button.focus.ring.style') dt('button.primary.focus.ring.color');
        outline-offset: dt('button.focus.ring.offset');
    }

    .p-button .p-badge {
        min-width: dt('button.badge.size');
        height: dt('button.badge.size');
        line-height: dt('button.badge.size');
    }

    .p-button-raised {
        box-shadow: dt('button.raised.shadow');
    }

    .p-button-rounded {
        border-radius: dt('button.rounded.border.radius');
    }

    .p-button-secondary {
        background: dt('button.secondary.background');
        border: 1px solid dt('button.secondary.border.color');
        color: dt('button.secondary.color');
    }

    .p-button-secondary:not(:disabled):hover {
        background: dt('button.secondary.hover.background');
        border: 1px solid dt('button.secondary.hover.border.color');
        color: dt('button.secondary.hover.color');
    }

    .p-button-secondary:not(:disabled):active {
        background: dt('button.secondary.active.background');
        border: 1px solid dt('button.secondary.active.border.color');
        color: dt('button.secondary.active.color');
    }

    .p-button-secondary:focus-visible {
        outline-color: dt('button.secondary.focus.ring.color');
        box-shadow: dt('button.secondary.focus.ring.shadow');
    }

    .p-button-success {
        background: dt('button.success.background');
        border: 1px solid dt('button.success.border.color');
        color: dt('button.success.color');
    }

    .p-button-success:not(:disabled):hover {
        background: dt('button.success.hover.background');
        border: 1px solid dt('button.success.hover.border.color');
        color: dt('button.success.hover.color');
    }

    .p-button-success:not(:disabled):active {
        background: dt('button.success.active.background');
        border: 1px solid dt('button.success.active.border.color');
        color: dt('button.success.active.color');
    }

    .p-button-success:focus-visible {
        outline-color: dt('button.success.focus.ring.color');
        box-shadow: dt('button.success.focus.ring.shadow');
    }

    .p-button-info {
        background: dt('button.info.background');
        border: 1px solid dt('button.info.border.color');
        color: dt('button.info.color');
    }

    .p-button-info:not(:disabled):hover {
        background: dt('button.info.hover.background');
        border: 1px solid dt('button.info.hover.border.color');
        color: dt('button.info.hover.color');
    }

    .p-button-info:not(:disabled):active {
        background: dt('button.info.active.background');
        border: 1px solid dt('button.info.active.border.color');
        color: dt('button.info.active.color');
    }

    .p-button-info:focus-visible {
        outline-color: dt('button.info.focus.ring.color');
        box-shadow: dt('button.info.focus.ring.shadow');
    }

    .p-button-warn {
        background: dt('button.warn.background');
        border: 1px solid dt('button.warn.border.color');
        color: dt('button.warn.color');
    }

    .p-button-warn:not(:disabled):hover {
        background: dt('button.warn.hover.background');
        border: 1px solid dt('button.warn.hover.border.color');
        color: dt('button.warn.hover.color');
    }

    .p-button-warn:not(:disabled):active {
        background: dt('button.warn.active.background');
        border: 1px solid dt('button.warn.active.border.color');
        color: dt('button.warn.active.color');
    }

    .p-button-warn:focus-visible {
        outline-color: dt('button.warn.focus.ring.color');
        box-shadow: dt('button.warn.focus.ring.shadow');
    }

    .p-button-help {
        background: dt('button.help.background');
        border: 1px solid dt('button.help.border.color');
        color: dt('button.help.color');
    }

    .p-button-help:not(:disabled):hover {
        background: dt('button.help.hover.background');
        border: 1px solid dt('button.help.hover.border.color');
        color: dt('button.help.hover.color');
    }

    .p-button-help:not(:disabled):active {
        background: dt('button.help.active.background');
        border: 1px solid dt('button.help.active.border.color');
        color: dt('button.help.active.color');
    }

    .p-button-help:focus-visible {
        outline-color: dt('button.help.focus.ring.color');
        box-shadow: dt('button.help.focus.ring.shadow');
    }

    .p-button-danger {
        background: dt('button.danger.background');
        border: 1px solid dt('button.danger.border.color');
        color: dt('button.danger.color');
    }

    .p-button-danger:not(:disabled):hover {
        background: dt('button.danger.hover.background');
        border: 1px solid dt('button.danger.hover.border.color');
        color: dt('button.danger.hover.color');
    }

    .p-button-danger:not(:disabled):active {
        background: dt('button.danger.active.background');
        border: 1px solid dt('button.danger.active.border.color');
        color: dt('button.danger.active.color');
    }

    .p-button-danger:focus-visible {
        outline-color: dt('button.danger.focus.ring.color');
        box-shadow: dt('button.danger.focus.ring.shadow');
    }

    .p-button-contrast {
        background: dt('button.contrast.background');
        border: 1px solid dt('button.contrast.border.color');
        color: dt('button.contrast.color');
    }

    .p-button-contrast:not(:disabled):hover {
        background: dt('button.contrast.hover.background');
        border: 1px solid dt('button.contrast.hover.border.color');
        color: dt('button.contrast.hover.color');
    }

    .p-button-contrast:not(:disabled):active {
        background: dt('button.contrast.active.background');
        border: 1px solid dt('button.contrast.active.border.color');
        color: dt('button.contrast.active.color');
    }

    .p-button-contrast:focus-visible {
        outline-color: dt('button.contrast.focus.ring.color');
        box-shadow: dt('button.contrast.focus.ring.shadow');
    }

    .p-button-outlined {
        background: transparent;
        border-color: dt('button.outlined.primary.border.color');
        color: dt('button.outlined.primary.color');
    }

    .p-button-outlined:not(:disabled):hover {
        background: dt('button.outlined.primary.hover.background');
        border-color: dt('button.outlined.primary.border.color');
        color: dt('button.outlined.primary.color');
    }

    .p-button-outlined:not(:disabled):active {
        background: dt('button.outlined.primary.active.background');
        border-color: dt('button.outlined.primary.border.color');
        color: dt('button.outlined.primary.color');
    }

    .p-button-outlined.p-button-secondary {
        border-color: dt('button.outlined.secondary.border.color');
        color: dt('button.outlined.secondary.color');
    }

    .p-button-outlined.p-button-secondary:not(:disabled):hover {
        background: dt('button.outlined.secondary.hover.background');
        border-color: dt('button.outlined.secondary.border.color');
        color: dt('button.outlined.secondary.color');
    }

    .p-button-outlined.p-button-secondary:not(:disabled):active {
        background: dt('button.outlined.secondary.active.background');
        border-color: dt('button.outlined.secondary.border.color');
        color: dt('button.outlined.secondary.color');
    }

    .p-button-outlined.p-button-success {
        border-color: dt('button.outlined.success.border.color');
        color: dt('button.outlined.success.color');
    }

    .p-button-outlined.p-button-success:not(:disabled):hover {
        background: dt('button.outlined.success.hover.background');
        border-color: dt('button.outlined.success.border.color');
        color: dt('button.outlined.success.color');
    }

    .p-button-outlined.p-button-success:not(:disabled):active {
        background: dt('button.outlined.success.active.background');
        border-color: dt('button.outlined.success.border.color');
        color: dt('button.outlined.success.color');
    }

    .p-button-outlined.p-button-info {
        border-color: dt('button.outlined.info.border.color');
        color: dt('button.outlined.info.color');
    }

    .p-button-outlined.p-button-info:not(:disabled):hover {
        background: dt('button.outlined.info.hover.background');
        border-color: dt('button.outlined.info.border.color');
        color: dt('button.outlined.info.color');
    }

    .p-button-outlined.p-button-info:not(:disabled):active {
        background: dt('button.outlined.info.active.background');
        border-color: dt('button.outlined.info.border.color');
        color: dt('button.outlined.info.color');
    }

    .p-button-outlined.p-button-warn {
        border-color: dt('button.outlined.warn.border.color');
        color: dt('button.outlined.warn.color');
    }

    .p-button-outlined.p-button-warn:not(:disabled):hover {
        background: dt('button.outlined.warn.hover.background');
        border-color: dt('button.outlined.warn.border.color');
        color: dt('button.outlined.warn.color');
    }

    .p-button-outlined.p-button-warn:not(:disabled):active {
        background: dt('button.outlined.warn.active.background');
        border-color: dt('button.outlined.warn.border.color');
        color: dt('button.outlined.warn.color');
    }

    .p-button-outlined.p-button-help {
        border-color: dt('button.outlined.help.border.color');
        color: dt('button.outlined.help.color');
    }

    .p-button-outlined.p-button-help:not(:disabled):hover {
        background: dt('button.outlined.help.hover.background');
        border-color: dt('button.outlined.help.border.color');
        color: dt('button.outlined.help.color');
    }

    .p-button-outlined.p-button-help:not(:disabled):active {
        background: dt('button.outlined.help.active.background');
        border-color: dt('button.outlined.help.border.color');
        color: dt('button.outlined.help.color');
    }

    .p-button-outlined.p-button-danger {
        border-color: dt('button.outlined.danger.border.color');
        color: dt('button.outlined.danger.color');
    }

    .p-button-outlined.p-button-danger:not(:disabled):hover {
        background: dt('button.outlined.danger.hover.background');
        border-color: dt('button.outlined.danger.border.color');
        color: dt('button.outlined.danger.color');
    }

    .p-button-outlined.p-button-danger:not(:disabled):active {
        background: dt('button.outlined.danger.active.background');
        border-color: dt('button.outlined.danger.border.color');
        color: dt('button.outlined.danger.color');
    }

    .p-button-outlined.p-button-contrast {
        border-color: dt('button.outlined.contrast.border.color');
        color: dt('button.outlined.contrast.color');
    }

    .p-button-outlined.p-button-contrast:not(:disabled):hover {
        background: dt('button.outlined.contrast.hover.background');
        border-color: dt('button.outlined.contrast.border.color');
        color: dt('button.outlined.contrast.color');
    }

    .p-button-outlined.p-button-contrast:not(:disabled):active {
        background: dt('button.outlined.contrast.active.background');
        border-color: dt('button.outlined.contrast.border.color');
        color: dt('button.outlined.contrast.color');
    }

    .p-button-outlined.p-button-plain {
        border-color: dt('button.outlined.plain.border.color');
        color: dt('button.outlined.plain.color');
    }

    .p-button-outlined.p-button-plain:not(:disabled):hover {
        background: dt('button.outlined.plain.hover.background');
        border-color: dt('button.outlined.plain.border.color');
        color: dt('button.outlined.plain.color');
    }

    .p-button-outlined.p-button-plain:not(:disabled):active {
        background: dt('button.outlined.plain.active.background');
        border-color: dt('button.outlined.plain.border.color');
        color: dt('button.outlined.plain.color');
    }

    .p-button-text {
        background: transparent;
        border-color: transparent;
        color: dt('button.text.primary.color');
    }

    .p-button-text:not(:disabled):hover {
        background: dt('button.text.primary.hover.background');
        border-color: transparent;
        color: dt('button.text.primary.color');
    }

    .p-button-text:not(:disabled):active {
        background: dt('button.text.primary.active.background');
        border-color: transparent;
        color: dt('button.text.primary.color');
    }

    .p-button-text.p-button-secondary {
        background: transparent;
        border-color: transparent;
        color: dt('button.text.secondary.color');
    }

    .p-button-text.p-button-secondary:not(:disabled):hover {
        background: dt('button.text.secondary.hover.background');
        border-color: transparent;
        color: dt('button.text.secondary.color');
    }

    .p-button-text.p-button-secondary:not(:disabled):active {
        background: dt('button.text.secondary.active.background');
        border-color: transparent;
        color: dt('button.text.secondary.color');
    }

    .p-button-text.p-button-success {
        background: transparent;
        border-color: transparent;
        color: dt('button.text.success.color');
    }

    .p-button-text.p-button-success:not(:disabled):hover {
        background: dt('button.text.success.hover.background');
        border-color: transparent;
        color: dt('button.text.success.color');
    }

    .p-button-text.p-button-success:not(:disabled):active {
        background: dt('button.text.success.active.background');
        border-color: transparent;
        color: dt('button.text.success.color');
    }

    .p-button-text.p-button-info {
        background: transparent;
        border-color: transparent;
        color: dt('button.text.info.color');
    }

    .p-button-text.p-button-info:not(:disabled):hover {
        background: dt('button.text.info.hover.background');
        border-color: transparent;
        color: dt('button.text.info.color');
    }

    .p-button-text.p-button-info:not(:disabled):active {
        background: dt('button.text.info.active.background');
        border-color: transparent;
        color: dt('button.text.info.color');
    }

    .p-button-text.p-button-warn {
        background: transparent;
        border-color: transparent;
        color: dt('button.text.warn.color');
    }

    .p-button-text.p-button-warn:not(:disabled):hover {
        background: dt('button.text.warn.hover.background');
        border-color: transparent;
        color: dt('button.text.warn.color');
    }

    .p-button-text.p-button-warn:not(:disabled):active {
        background: dt('button.text.warn.active.background');
        border-color: transparent;
        color: dt('button.text.warn.color');
    }

    .p-button-text.p-button-help {
        background: transparent;
        border-color: transparent;
        color: dt('button.text.help.color');
    }

    .p-button-text.p-button-help:not(:disabled):hover {
        background: dt('button.text.help.hover.background');
        border-color: transparent;
        color: dt('button.text.help.color');
    }

    .p-button-text.p-button-help:not(:disabled):active {
        background: dt('button.text.help.active.background');
        border-color: transparent;
        color: dt('button.text.help.color');
    }

    .p-button-text.p-button-danger {
        background: transparent;
        border-color: transparent;
        color: dt('button.text.danger.color');
    }

    .p-button-text.p-button-danger:not(:disabled):hover {
        background: dt('button.text.danger.hover.background');
        border-color: transparent;
        color: dt('button.text.danger.color');
    }

    .p-button-text.p-button-danger:not(:disabled):active {
        background: dt('button.text.danger.active.background');
        border-color: transparent;
        color: dt('button.text.danger.color');
    }

    .p-button-text.p-button-contrast {
        background: transparent;
        border-color: transparent;
        color: dt('button.text.contrast.color');
    }

    .p-button-text.p-button-contrast:not(:disabled):hover {
        background: dt('button.text.contrast.hover.background');
        border-color: transparent;
        color: dt('button.text.contrast.color');
    }

    .p-button-text.p-button-contrast:not(:disabled):active {
        background: dt('button.text.contrast.active.background');
        border-color: transparent;
        color: dt('button.text.contrast.color');
    }

    .p-button-text.p-button-plain {
        background: transparent;
        border-color: transparent;
        color: dt('button.text.plain.color');
    }

    .p-button-text.p-button-plain:not(:disabled):hover {
        background: dt('button.text.plain.hover.background');
        border-color: transparent;
        color: dt('button.text.plain.color');
    }

    .p-button-text.p-button-plain:not(:disabled):active {
        background: dt('button.text.plain.active.background');
        border-color: transparent;
        color: dt('button.text.plain.color');
    }

    .p-button-link {
        background: transparent;
        border-color: transparent;
        color: dt('button.link.color');
    }

    .p-button-link:not(:disabled):hover {
        background: transparent;
        border-color: transparent;
        color: dt('button.link.hover.color');
    }

    .p-button-link:not(:disabled):hover .p-button-label {
        text-decoration: underline;
    }

    .p-button-link:not(:disabled):active {
        background: transparent;
        border-color: transparent;
        color: dt('button.link.active.color');
    }
`;
function k(t) {
  "@babel/helpers - typeof";
  return k = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
    return typeof e;
  } : function(e) {
    return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
  }, k(t);
}
function l(t, e, n) {
  return (e = yt(e)) in t ? Object.defineProperty(t, e, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : t[e] = n, t;
}
function yt(t) {
  var e = vt(t, "string");
  return k(e) == "symbol" ? e : e + "";
}
function vt(t, e) {
  if (k(t) != "object" || !t) return t;
  var n = t[Symbol.toPrimitive];
  if (n !== void 0) {
    var o = n.call(t, e);
    if (k(o) != "object") return o;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (e === "string" ? String : Number)(t);
}
var xt = {
  root: function(e) {
    var n = e.instance, o = e.props;
    return ["p-button p-component", l(l(l(l(l(l(l(l(l({
      "p-button-icon-only": n.hasIcon && !o.label && !o.badge,
      "p-button-vertical": (o.iconPos === "top" || o.iconPos === "bottom") && o.label,
      "p-button-loading": o.loading,
      "p-button-link": o.link || o.variant === "link"
    }, "p-button-".concat(o.severity), o.severity), "p-button-raised", o.raised), "p-button-rounded", o.rounded), "p-button-text", o.text || o.variant === "text"), "p-button-outlined", o.outlined || o.variant === "outlined"), "p-button-sm", o.size === "small"), "p-button-lg", o.size === "large"), "p-button-plain", o.plain), "p-button-fluid", n.hasFluid)];
  },
  loadingIcon: "p-button-loading-icon",
  icon: function(e) {
    var n = e.props;
    return ["p-button-icon", l({}, "p-button-icon-".concat(n.iconPos), n.label)];
  },
  label: "p-button-label"
}, kt = j.extend({
  name: "button",
  style: ft,
  classes: xt
}), _t = {
  name: "BaseButton",
  extends: B,
  props: {
    label: {
      type: String,
      default: null
    },
    icon: {
      type: String,
      default: null
    },
    iconPos: {
      type: String,
      default: "left"
    },
    iconClass: {
      type: [String, Object],
      default: null
    },
    badge: {
      type: String,
      default: null
    },
    badgeClass: {
      type: [String, Object],
      default: null
    },
    badgeSeverity: {
      type: String,
      default: "secondary"
    },
    loading: {
      type: Boolean,
      default: !1
    },
    loadingIcon: {
      type: String,
      default: void 0
    },
    as: {
      type: [String, Object],
      default: "BUTTON"
    },
    asChild: {
      type: Boolean,
      default: !1
    },
    link: {
      type: Boolean,
      default: !1
    },
    severity: {
      type: String,
      default: null
    },
    raised: {
      type: Boolean,
      default: !1
    },
    rounded: {
      type: Boolean,
      default: !1
    },
    text: {
      type: Boolean,
      default: !1
    },
    outlined: {
      type: Boolean,
      default: !1
    },
    size: {
      type: String,
      default: null
    },
    variant: {
      type: String,
      default: null
    },
    plain: {
      type: Boolean,
      default: !1
    },
    fluid: {
      type: Boolean,
      default: null
    }
  },
  style: kt,
  provide: function() {
    return {
      $pcButton: this,
      $parentInstance: this
    };
  }
};
function _(t) {
  "@babel/helpers - typeof";
  return _ = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
    return typeof e;
  } : function(e) {
    return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
  }, _(t);
}
function i(t, e, n) {
  return (e = wt(e)) in t ? Object.defineProperty(t, e, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : t[e] = n, t;
}
function wt(t) {
  var e = qt(t, "string");
  return _(e) == "symbol" ? e : e + "";
}
function qt(t, e) {
  if (_(t) != "object" || !t) return t;
  var n = t[Symbol.toPrimitive];
  if (n !== void 0) {
    var o = n.call(t, e);
    if (_(o) != "object") return o;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (e === "string" ? String : Number)(t);
}
var St = {
  name: "Button",
  extends: _t,
  inheritAttrs: !1,
  inject: {
    $pcFluid: {
      default: null
    }
  },
  methods: {
    getPTOptions: function(e) {
      var n = e === "root" ? this.ptmi : this.ptm;
      return n(e, {
        context: {
          disabled: this.disabled
        }
      });
    }
  },
  computed: {
    disabled: function() {
      return this.$attrs.disabled || this.$attrs.disabled === "" || this.loading;
    },
    defaultAriaLabel: function() {
      return this.label ? this.label + (this.badge ? " " + this.badge : "") : this.$attrs.ariaLabel;
    },
    hasIcon: function() {
      return this.icon || this.$slots.icon;
    },
    attrs: function() {
      return c(this.asAttrs, this.a11yAttrs, this.getPTOptions("root"));
    },
    asAttrs: function() {
      return this.as === "BUTTON" ? {
        type: "button",
        disabled: this.disabled
      } : void 0;
    },
    a11yAttrs: function() {
      return {
        "aria-label": this.defaultAriaLabel,
        "data-pc-name": "button",
        "data-p-disabled": this.disabled,
        "data-p-severity": this.severity
      };
    },
    hasFluid: function() {
      return L(this.fluid) ? !!this.$pcFluid : this.fluid;
    },
    dataP: function() {
      return w(i(i(i(i(i(i(i(i(i(i({}, this.size, this.size), "icon-only", this.hasIcon && !this.label && !this.badge), "loading", this.loading), "fluid", this.hasFluid), "rounded", this.rounded), "raised", this.raised), "outlined", this.outlined || this.variant === "outlined"), "text", this.text || this.variant === "text"), "link", this.link || this.variant === "link"), "vertical", (this.iconPos === "top" || this.iconPos === "bottom") && this.label));
    },
    dataIconP: function() {
      return w(i(i({}, this.iconPos, this.iconPos), this.size, this.size));
    },
    dataLabelP: function() {
      return w(i(i({}, this.size, this.size), "icon-only", this.hasIcon && !this.label && !this.badge));
    }
  },
  components: {
    SpinnerIcon: D,
    Badge: M
  },
  directives: {
    ripple: V
  }
}, $t = ["data-p"], Pt = ["data-p"];
function zt(t, e, n, o, r, a) {
  var d = C("SpinnerIcon"), b = C("Badge"), h = G("ripple");
  return t.asChild ? y(t.$slots, "default", {
    key: 1,
    class: A(t.cx("root")),
    a11yAttrs: a.a11yAttrs
  }) : J((g(), S(Y(t.as), c({
    key: 0,
    class: t.cx("root"),
    "data-p": a.dataP
  }, a.attrs), {
    default: H(function() {
      return [y(t.$slots, "default", {}, function() {
        return [t.loading ? y(t.$slots, "loadingicon", c({
          key: 0,
          class: [t.cx("loadingIcon"), t.cx("icon")]
        }, t.ptm("loadingIcon")), function() {
          return [t.loadingIcon ? (g(), v("span", c({
            key: 0,
            class: [t.cx("loadingIcon"), t.cx("icon"), t.loadingIcon]
          }, t.ptm("loadingIcon")), null, 16)) : (g(), S(d, c({
            key: 1,
            class: [t.cx("loadingIcon"), t.cx("icon")],
            spin: ""
          }, t.ptm("loadingIcon")), null, 16, ["class"]))];
        }) : y(t.$slots, "icon", c({
          key: 1,
          class: [t.cx("icon")]
        }, t.ptm("icon")), function() {
          return [t.icon ? (g(), v("span", c({
            key: 0,
            class: [t.cx("icon"), t.icon, t.iconClass],
            "data-p": a.dataIconP
          }, t.ptm("icon")), null, 16, $t)) : $("", !0)];
        }), t.label ? (g(), v("span", c({
          key: 2,
          class: t.cx("label")
        }, t.ptm("label"), {
          "data-p": a.dataLabelP
        }), O(t.label), 17, Pt)) : $("", !0), t.badge ? (g(), S(b, {
          key: 3,
          value: t.badge,
          class: A(t.badgeClass),
          severity: t.badgeSeverity,
          unstyled: t.unstyled,
          pt: t.ptm("pcBadge")
        }, null, 8, ["value", "class", "severity", "unstyled", "pt"])) : $("", !0)];
      })];
    }),
    _: 3
  }, 16, ["class", "data-p"])), [[h]]);
}
St.render = zt;
export {
  Vt as A,
  Ot as B,
  Et as C,
  Ht as D,
  Ut as E,
  ee as F,
  ne as G,
  X as M,
  Wt as a,
  Zt as b,
  jt as c,
  Yt as d,
  f as e,
  E as f,
  Nt as g,
  Lt as h,
  Jt as i,
  Dt as j,
  Bt as k,
  T as l,
  Kt as m,
  Tt as n,
  P as o,
  Xt as p,
  te as q,
  nt as r,
  St as s,
  Qt as t,
  tt as u,
  Ft as v,
  Gt as w,
  Mt as x,
  et as y,
  Rt as z
};
