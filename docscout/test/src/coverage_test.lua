-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local json = require("json")
local registry = require("registry")
local uuid = require("uuid")
local ai = require("ai")
local stages = require("stages")
local shapes = require("shapes")
local store = require("store")
local data = require("data")

local function context(): any
    local schema = assert(json.decode(assert(registry.get("kickside.docscout:config_schema")).data.schema_json))
    local cfg, pool = schema.default, shapes.pool()
    cfg.fields = {}
    for _, name in ipairs({"fee", "rate"}) do
        local f = assert(json.decode(assert(registry.get("kickside.docscout:config_schema")).data.schema_json)).properties.fields.items.default
        f.name, f.group = name, name == "rate" and "terms" or ""
        cfg.fields[#cfg.fields + 1] = f
    end
    cfg.stages.scout.max_rounds, cfg.stages.scout.drop_noise, cfg.stages.scout.share_notes = 0, true, true
    cfg.stages.deep.enabled = false
    local outline, chunks = {}, {}
    for n = 1, 4 do
        local vector = {}
        for i=1,512 do vector[i] = i == 1 and 1.0 or 0.0 end
        chunks[n] = {vector=vector, ordinal=n, content="The total amount is 1250.", heading_path="Section " .. n, section_id="s" .. n}
        if n <= 3 then outline[n] = {id="s" .. n, title="Section " .. n, path="Section " .. n, level=1, chunk_start=n, chunk_end=n == 3 and 4 or n, tokens=10} end
    end
    shapes.add(pool, chunks)
    return {config=cfg, pool=pool, notes={}, regions={}, document={outline=outline}, chunks=chunks}
end
local function rejected(err: any, step: any)
    test.not_nil(err); test.eq(err:details().code, "structured_reply_invalid"); test.is_true(err:retryable())
    test.eq(step.meter.input_tokens, 12); test.eq(step.meter.output_tokens, 8)
end
local function save(run: any)
    local owner = uuid.v4()
    run.document.id = assert(store.save({owner_id=owner, component_id=data.extractor(owner), upload_id=uuid.v4(), checksum="coverage", processing_key="coverage",
        outline=run.document.outline, page_count=0, tokens=0, expires_at="2999-01-01T00:00:00Z"}, run.chunks))
end
return {run=test.run_cases(function()
    test.describe("Keyed stage response coverage", function()
        for _, mode in ipairs({"missing-evidence", "missing-note", "unknown"}) do
            test.it("rejects scout " .. mode .. " before pruning or admitting notes", function()
                local run, step = context(), {meter=ai.meter()}
                run.config.stages.scout.model = "class:docscout-scout-" .. mode
                rejected(stages.scout(run, step), step)
                test.eq(run.pool.count, 4); test.eq(#run.notes, 0)
            end)
        end
        test.it("accepts explicit empty scout evidence and suppresses blank notes", function()
            local run, step = context(), {meter=ai.meter()}
            run.config.stages.scout.model = "class:docscout-scout-empty"
            test.is_nil(stages.scout(run, step))
            test.eq(run.pool.count, 4); test.eq(#run.notes, 1)
            test.eq(run.notes[1].field, "fee"); test.eq(run.notes[1].text, "fee note")
            test.eq(step.uncited, 2); test.contains(step.message, "2 fields without cited evidence")
        end)
        for _, mode in ipairs({"missing", "unknown"}) do
            test.it("rejects summary " .. mode .. " without partially setting summaries", function()
                local run, step = context(), {meter=ai.meter()}
                save(run)
                run.config.stages.map.model, run.config.stages.map.section_summaries = "class:docscout-summary-" .. mode, true
                rejected(stages.map(run, step), step)
                for _, section in ipairs(run.document.outline) do test.is_nil(section.summary) end
            end)
        end
        test.it("accepts explicit blank summaries and trims nonblank summaries", function()
            local run, step = context(), {meter=ai.meter()}
            save(run)
            run.config.stages.map.model, run.config.stages.map.section_summaries = "class:docscout-summary-empty", true
            test.is_nil(stages.map(run, step))
            test.is_nil(run.document.outline[1].summary); test.is_nil(run.document.outline[2].summary)
            test.eq(run.document.outline[3].summary, "Payment terms")
        end)
        for _, mode in ipairs({"missing", "unknown"}) do
            test.it("rejects highlighter " .. mode .. " without removing passages", function()
                local run, step = context(), {meter=ai.meter()}
                run.config.retrieval.highlighter_model = "class:docscout-highlight-" .. mode
                rejected(stages.highlight(run, step), step)
                test.eq(run.pool.count, 4); test.eq(run.pool.by_ordinal[1].content, "The total amount is 1250.")
            end)
        end
        test.it("keeps genuine excerpts and removes empty, blank and invented highlights", function()
            local run, step = context(), {meter=ai.meter()}
            run.config.retrieval.highlighter_model = "class:docscout-highlight-empty"
            test.is_nil(stages.highlight(run, step))
            test.eq(run.pool.count, 1); test.eq(run.pool.by_ordinal[1].content, "total amount")
            for n=2,4 do test.is_nil(run.pool.by_ordinal[n]) end
        end)
    end)
end)}
