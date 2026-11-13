-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local ai = require("ai")
local shapes = require("shapes")
local pages = require("pages")
local page_calls = require("page_calls")
local store = require("store")
local error_envelope = require("error_envelope")
local types = require("types")
local M = {}

local SYSTEM = [[You extract field values from physical page images of one document. Read only the supplied pages.
For each field say whether it is found, give its value (null when not found), confidence from 0 to 1, and evidence: a supplied page number and an exact quote visible on that page.
Do not treat absent pages as proof that a value is absent or complete.
]] .. shapes.DATA_RULE

function M.failed(run: types.PageRun, field: types.Field, err: error)
    run.values[#run.values + 1] = {name = field.name, path = shapes.path(field), confidence = 0, evidence = {},
        verified = false, missing = false, failed = true, error = error_envelope.encode(err),
        extraction_kind = "page_image", source_revision = run.page_images.revision,
        verification = {kind = "page_image", status = "unavailable", checks = {}}}
end

local function input(fields: {types.Field}, numbers: {integer}): string
    return "Fields (eligible pages for every field: " .. table.concat(numbers, ", ") .. "):\n" .. shapes.field_lines(fields)
end

function M.extract(run: types.PageRun, step: types.PageStep, calls: {types.PageCall}, allocate: types.PageAllocation): error?
    local cfg = run.config.stages.extract
    local chunks, chunks_err = store.all_chunks(run.document.id)
    if chunks_err then return chunks_err end
    local fits, _, fit_err = ai.fitter(cfg.model, cfg.max_output_tokens)
    if fit_err then return fit_err end
    local failure: error? = nil
    local made, failed = 0, 0
    for _, field in ipairs(run.config.fields) do
        local err = run.field_errors and run.field_errors[shapes.path(field)]
        if err then M.failed(run, field, err); failed = failed + 1; failure = failure or err end
    end
    for _, call in ipairs(calls) do
        local allowed, boundary_err = pages.allowed(run, call.fields[1], chunks)
        if boundary_err then
            for _, field in ipairs(call.fields) do M.failed(run, field, boundary_err); failed = failed + 1 end
            failure = failure or boundary_err
            goto continue
        end
        local candidates, pool = page_calls.candidates(run, call, allowed)
        local selected = allocate(pool, candidates, shapes.paths(call.fields), function(list: {types.PageCandidate}): boolean
            return #list <= cfg.max_pages
        end)
        local read_err = page_calls.load(run.page_images, selected)
        if read_err then
            for _, field in ipairs(call.fields) do M.failed(run, field, read_err); failed = failed + 1 end
            failure = failure or read_err
            goto continue
        end
        local function plan(fields: {types.Field})
            local function accepts(list: {types.PageCandidate}): boolean
                local numbers = page_calls.numbers(list)
                return fits(SYSTEM, page_calls.message(list, input(fields, numbers)), shapes.group_schema(fields, {}, numbers))
            end
            local kept = allocate(pool, selected, shapes.paths(fields), accepts)
            local numbers = page_calls.numbers(kept)
            return {fields = fields, kept = kept, numbers = numbers, usable = #kept > 0 and accepts(kept)}
        end
        local batches, rejected = shapes.batches(call.fields, function(fields: {types.Field}): boolean return plan(fields).usable end)
        for _, field in ipairs(rejected) do
            local _, estimated, available = fits(SYSTEM, page_calls.message(selected, input({field}, page_calls.numbers(selected))),
                shapes.group_schema({field}, {}, page_calls.numbers(selected)))
            local err = ai.budget_error(cfg.model, estimated, available)
            M.failed(run, field, err); failed = failed + 1; failure = failure or err
        end
        for _, batch in ipairs(batches) do
            local prepared = plan(batch)
            local result, err = ai.structured(step.meter, cfg.model, shapes.group_schema(batch, {}, prepared.numbers), SYSTEM,
                page_calls.message(prepared.kept, input(batch, prepared.numbers)),
                {max_tokens = cfg.max_output_tokens, temperature = cfg.temperature, stage = "extract", fields = shapes.paths(batch), pages = prepared.numbers,
                    image_bytes = page_calls.bytes(prepared.kept), estimated_input_tokens = ai.estimate(SYSTEM,
                        page_calls.message(prepared.kept, input(batch, prepared.numbers)), shapes.group_schema(batch, {}, prepared.numbers))})
            if not err then err = shapes.extraction_error(batch, result, cfg.model) end
            made = made + 1
            if err then
                for _, field in ipairs(batch) do M.failed(run, field, err); failed = failed + 1 end
                failure = failure or err
            else
                local images = {}
                for _, candidate in ipairs(prepared.kept) do images[candidate.ordinal] = candidate.image end
                for _, field in ipairs(batch) do
                    local item = shapes.get(result, shapes.path(field))
                    local extracted = shapes.extracted_value(field, item.value)
                    local found = item.found and extracted ~= nil
                    local evidence = {}
                    for _, quote in ipairs(item.evidence) do
                        local image = images[quote.page]
                        if image then evidence[#evidence + 1] = {quote = quote.quote, page = quote.page, section = "",
                            image_checksum = image.image_checksum, source_revision = image.revision} end
                    end
                    local value: types.PageValue = {name = field.name, path = shapes.path(field),
                        confidence = found and item.confidence or 0, evidence = found and evidence or {},
                        verified = false, missing = not found, failed = false,
                        extraction_kind = "page_image", source_revision = run.page_images.revision,
                        verification = {kind = "page_image", status = "not_run", checks = {}}}
                    if found then value.value = extracted end
                    if not found and field.search_within == "sections" then value.codes = {"missing_in_sections"} end
                    if #prepared.kept < #allowed or (run.budget_dropped and run.budget_dropped[shapes.path(field)]) then
                        value.codes = value.codes or {}
                        value.codes[#value.codes + 1] = "context_budget_partial"
                    end
                    if found and field.evidence_required and #evidence == 0 then
                        value.reason, value.codes = "No quote supports this value", value.codes or {}
                        value.codes[#value.codes + 1] = "no_quote"
                    end
                    run.values[#run.values + 1] = value
                end
            end
        end
        ::continue::
    end
    local order = {}
    for i, field in ipairs(run.config.fields) do order[shapes.path(field)] = i end
    table.sort(run.values, function(a: types.PageValue, b: types.PageValue): boolean return order[a.path] < order[b.path] end)
    step.message = made .. " calls · " .. #run.values .. " values"
    step.status = failed == #run.config.fields and "failed" or (failed > 0 and "partial" or "completed")
    if failed == #run.config.fields then return failure end
    return nil
end

return M
