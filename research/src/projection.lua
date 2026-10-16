local repo = require("research_repo")

-- Research read-model projection worker. The runner invokes it (input_mode =
-- prefetch_events) with a batch of new thread events, the projection cursor body,
-- and the thread_id. It folds each event INTO kickside_research_run (research's own
-- read-model table, via repo.apply) and advances the cursor. The table is the read
-- model state.lua serves; the carried body holds only the engine's worker config
-- (body.meta), which must be returned untouched so the next run keeps its binding.
local M = {}

-- run(input): input.thread_id is the run's thread, input.events is the new batch,
-- input.range.to_seq is the new head, input.projection.body carries the engine meta.
function M.run(input: any): any
    input = type(input) == "table" and input or {}
    local thread_id = type(input.thread_id) == "string" and input.thread_id or ""
    local projection = type(input.projection) == "table" and input.projection or {}
    local body: any = type(projection.body) == "table" and projection.body or {}

    local events = type(input.events) == "table" and input.events or {}
    for _, e in ipairs(events :: { any }) do
        local aerr = repo.apply(thread_id, e)
        if aerr then error("research projection apply: " .. tostring(aerr)) end
    end

    local range = type(input.range) == "table" and input.range or {}
    return { body = body, last_seq = tonumber(range.to_seq) or nil }
end

return M
