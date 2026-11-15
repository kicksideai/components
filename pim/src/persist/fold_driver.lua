-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local failure=require("failure")
-- The fold driver: the loop the catalog projection runs over a prefetched
-- batch of its thread's events. Each event of a type the fold takes is parsed
-- against the body schema its registry entry declares; events at or below the
-- applied position are skipped, so a redelivered batch folds once; the rest
-- apply in order; the batch stops after the event that brings the recomputed
-- rows to the budget, and the rest is delivered again.
local registry = require("registry")
local json = require("json")
local narrow = require("narrow")
local shape = require("shape")
local types = require("types")

local M = {}

-- Step is a parsed event: its position, type and a body that matches its schema.
type Step = { seq: integer, type: string, body: unknown, trace_context: types.TraceContext? }
-- Driver is what the fold supplies: its applied position, its row budget, the
-- event types it folds, its row count so far and its handler.
type Driver = {
    applied: integer, budget: integer, accepts: { [string]: boolean },
    rows: () -> integer, pending: (() -> boolean)?, apply: (Step) -> error?,
}
M.Step = Step

local function internal(message: string, code: string?): error
    if code=="row_corrupt" then return failure.corrupt(message) end
    return errors.new({ details = { code = code or "internal" }, kind = errors.INTERNAL, message = message })
end

-- body_schema returns the tolerant body schema the registry declares for an
-- event type, cached in schemas.
local function body_schema(schemas: { [string]: types.JsonObject }, t: string): (types.JsonObject?, error?)
    local cached = schemas[t]
    if cached then return cached, nil end
    local entry, err = registry.get(t)
    if err then return nil, errors.wrap(err, "event type lookup failed") end
    if not entry then return nil, internal("event type " .. t .. " is not declared") end
    local data = entry.data
    local schema = type(data) == "table" and (data :: { [string]: unknown }).schema or nil
    if type(schema) ~= "table" then return nil, internal("event type " .. t .. " declares no body schema") end
    local tolerant = shape.tolerant(schema :: types.JsonObject)
    schemas[t] = tolerant
    return tolerant, nil
end

-- parse turns a raw event of a folded type into a Step whose body matches its
-- declared schema.
local function parse(raw: types.RawEvent, schemas: { [string]: types.JsonObject }): (Step?, error?)
    local seq = narrow.int(raw.seq)
    if not seq then return nil, internal("event without a seq", "row_corrupt") end
    local t = raw.type
    local body: unknown = raw.body
    if type(body) == "string" then
        local decoded, derr = json.decode(body)
        if derr then return nil, internal("event " .. seq .. " (" .. t .. ") body is not JSON: " .. tostring(derr), "row_corrupt") end
        body = decoded
    end
    local schema, serr = body_schema(schemas, t)
    if serr or not schema then return nil, serr end
    local cerr = shape.check(schema, body, "event body")
    if cerr then return nil,failure.corrupt("event "..seq.." ("..t..") body breaks its schema: "..tostring(cerr)) end
    return { seq = seq, type = t, body = body, trace_context=raw.trace_context or {trace_id=raw.trace_id,run_id=raw.run_id,caused_by_event_id=raw.caused_by_event_id,correlation_key=raw.correlation_key} }, nil
end

-- run folds events through d and returns the seq it stopped after when the
-- row budget was reached, or nil when it folded the whole batch. On failure it
-- also returns the seq of the event that failed.
function M.run(events: { types.RawEvent }, d: Driver): (integer?, error?, integer?)
    local schemas: { [string]: types.JsonObject } = {}
    for _, raw in ipairs(events) do
        if d.accepts[raw.type] then
            local step, perr = parse(raw, schemas)
            if perr or not step then return nil, perr, narrow.int(raw.seq) end
            if step.seq > d.applied then
                local err = d.apply(step)
                if err then return nil, errors.wrap(err, "fold of event " .. step.seq .. " failed"), step.seq end
                if d.pending and d.pending() then return step.seq - 1, nil end
                if d.rows() >= d.budget then return step.seq, nil end
            end
        end
    end
    return nil, nil
end

return M
