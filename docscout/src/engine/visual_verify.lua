-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local ai = require("ai")
local pages = require("pages")
local page_calls = require("page_calls")
local shapes = require("shapes")
local store = require("store")
local types = require("types")
local M = {}

local SYSTEM = [[Check each field against only the supplied physical page images within its eligible page range.
quote_on_page: yes if every quote appears on its cited page, no if any does not, unreadable if the images cannot settle it.
states_value: yes if the visible evidence states this value for this field's description, no if not, unreadable if uncertain.
For fields asking for completeness, answer complete, incomplete, or insufficient_evidence. Missing pages cannot establish completeness.
Return one check per field with a reason.
]] .. shapes.DATA_RULE

local function schema(value: types.PageValue, complete: boolean): types.Json
    local properties = {quote_on_page = {type = "string", enum = {"yes", "no", "unreadable"}},
        states_value = {type = "string", enum = {"yes", "no", "unreadable"}}, reason = {type = "string"}}
    local required = {"quote_on_page", "states_value", "reason"}
    if complete then
        properties.complete = {type = "string", enum = {"complete", "incomplete", "insufficient_evidence"}}
        required[#required + 1] = "complete"
    end
    return shapes.keyed({value.path}, {type = "object", additionalProperties = false, required = required, properties = properties})
end

local function input(field: types.Field, value: types.PageValue, allowed: {integer}, support_line: types.SupportLine): string
    return "Eligible physical pages for " .. value.path .. ": " .. table.concat(allowed, ", ") .. "\n" .. support_line(field, value, nil)
end

local function status(verdict: string): string
    return verdict == "yes" and "passed" or (verdict == "no" and "failed" or "unavailable")
end

function M.verify(run: types.PageRun, step: types.PageStep, support_line: types.SupportLine): error?
    local cfg = run.config.stages.verify
    local chunks, chunks_err = store.all_chunks(run.document.id)
    if chunks_err then return chunks_err end
    local fields = {}
    for _, field in ipairs(run.config.fields) do fields[shapes.path(field)] = field end
    local fits
    if cfg.check_support then
        local fit_err
        fits, _, fit_err = ai.fitter(cfg.model, cfg.max_tokens)
        if fit_err then return fit_err end
    end
    for _, value in ipairs(run.values) do
        if value.failed or value.missing then goto continue end
        local field = fields[value.path]
        local checks = value.verification.checks
        if cfg.check_quotes then
            local agreement = true
            for _, evidence in ipairs(value.evidence) do
                local found = false
                for _, chunk in ipairs(chunks) do
                    for _, span in ipairs(chunk.page_spans) do
                        if span.page == evidence.page and shapes.normalize(span.text):find(shapes.normalize(evidence.quote), 1, true) then found = true end
                    end
                end
                if not found then agreement = false end
            end
            checks.text_agreement = agreement and "passed" or "failed"
        end
        if not cfg.check_support then goto continue end
        if #value.evidence == 0 then
            value.verification.status = "unavailable"
            value.reason, value.codes = "No page quote supports this value", {"no_quote"}
            goto continue
        end
        local allowed, boundary_err = pages.allowed(run, field, chunks)
        if boundary_err then value.verification.status = "unavailable"; return boundary_err end
        local eligible, required, selected = {}, {}, {}
        for _, page in ipairs(allowed) do eligible[page] = true end
        for _, evidence in ipairs(value.evidence) do
            if not eligible[evidence.page] then
                value.verification.status = "unavailable"
                return pages.error("page_evidence_outside_region", "Image evidence is outside the field's eligible pages")
            end
            required[evidence.page] = true
        end
        for _, page in ipairs(allowed) do if required[page] then selected[#selected + 1] = {ordinal = page} end end
        local required_count = #selected
        local limit = run.config.stages.extract.max_pages
        if required_count > limit then value.verification.status = "unavailable"; return ai.budget_error(cfg.model, nil, nil) end
        local cut = false
        for _, evidence in ipairs(value.evidence) do
            local next_page = evidence.page + 1
            if eligible[next_page] and not required[next_page] and #selected < limit then
                selected[#selected + 1] = {ordinal = next_page}; required[next_page] = true
            elseif eligible[next_page] and not required[next_page] then cut = true end
        end
        local read_err = page_calls.load(run.page_images, selected)
        if read_err then value.verification.status = "unavailable"; return read_err end
        local complete = cfg.check_completeness == true and (field.type == "text" or field.type == "list")
        local reply_schema = schema(value, complete)
        local user = input(field, value, allowed, support_line)
        while #selected > required_count and not fits(SYSTEM, page_calls.message(selected, user), reply_schema) do
            table.remove(selected); cut = true
        end
        local ok, estimated, available = fits(SYSTEM, page_calls.message(selected, user), reply_schema)
        if not ok then value.verification.status = "unavailable"; return ai.budget_error(cfg.model, estimated, available) end
        local result, err = ai.structured(step.meter, cfg.model, reply_schema, SYSTEM, page_calls.message(selected, user),
            {max_tokens = cfg.max_tokens, temperature = cfg.temperature, stage = "support", fields = {value.path}, pages = page_calls.numbers(selected),
                image_bytes = page_calls.bytes(selected), estimated_input_tokens = estimated})
        if err then value.verification.status = "unavailable"; return err end
        local verdict = result[value.path]
        checks.visual_quote, checks.value_support = status(verdict.quote_on_page), status(verdict.states_value)
        if complete then
            local partial = cut or #selected < #allowed
            for _, code in ipairs(value.codes or {}) do if code == "context_budget_partial" then partial = true end end
            checks.completeness = (partial or verdict.complete == "insufficient_evidence") and "unavailable" or
                (verdict.complete == "complete" and "passed" or "failed")
            value.complete = nil
            if checks.completeness == "unavailable" then
                value.codes = value.codes or {}
                value.codes[#value.codes + 1] = "visual_completeness_unavailable"
            else value.complete = checks.completeness == "passed" end
        end
        local passed, unavailable = true, false
        for name, check in pairs(checks) do
            if name ~= "text_agreement" and not (name == "completeness" and check == "unavailable") then
                if check ~= "passed" then passed = false end
                if check == "unavailable" then unavailable = true end
            end
        end
        local format_issue = shapes.format_issue(field, value.value)
        value.verified = passed and not format_issue
        value.verification.status = value.verified and "passed" or (unavailable and "unavailable" or "failed")
        if not value.verified then
            value.reason = format_issue or verdict.reason
            value.codes = value.codes or {}
            value.codes[#value.codes + 1] = format_issue and "format_mismatch" or (unavailable and "visual_evidence_unavailable" or "visual_support_failed")
        end
        for _, evidence in ipairs(value.evidence) do evidence.found = checks.visual_quote == "passed" end
        ::continue::
    end
    return nil
end

return M
