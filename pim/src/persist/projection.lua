-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Catalog projection worker: folds each prefetched batch in one transaction.
-- Batches can be delivered again before the cursor advances; the fold skips events
-- at or below catalog.applied_seq, which commits with the folded rows.
local store = require("store")
local materializer = require("materializer")
local jobs = require("jobs")
local types = require("types")
local consts = require("consts")

local receipts = require("receipts")
local json = require("json")
local sql=require("sql")
local M = {}

type Output = { body: unknown, last_seq: integer }

local function plugin_change(tx: types.Executor, catalog_id: string, events: { types.RawEvent }): (boolean?, error?)
    for _, event in ipairs(events) do
        if event.type == consts.EVENTS.SCHEMA_APPLIED then
            local body = event.body :: types.SchemaBody
            if next(body.compiled.plugins) ~= nil then return true, nil end
            if body.generation > 1 then
                local before, err = store.declaration(tx, catalog_id, body.generation - 1)
                if err then return nil, err end
                if before and next(before.plugins or {}) ~= nil then return true, nil end
            end
        end
    end
    return false, nil
end

-- run folds one batch. The projection body is returned untouched: it carries the
-- engine's own configuration.
function M.run(raw: unknown): (Output?, error?)
    -- Core's projection runtime supplies this input; thread and range are checked
    -- because every fold depends on them.
    local input = raw :: types.ProjectionInput
    local catalog_id = type(raw) == "table" and input.thread_id or nil
    if type(catalog_id) ~= "string" or catalog_id == "" then
        return nil, errors.new({ details = { code = "projection_input_invalid" }, kind = errors.INVALID, message = "projection input missing thread_id" })
    end
    local to_seq = type(input.range) == "table" and math.tointeger(input.range.to_seq) or nil
    if not to_seq then return nil, errors.new({ details = { code = "projection_input_invalid" }, kind = errors.INVALID, message = "projection input missing range" }) end
    local lifecycle_job: string?=nil
    local folded,transaction_error=store.transaction("projection",function(tx: types.Executor,dialect: string): (materializer.FoldResult?,error?)
    local folded, fold_err = materializer.fold(tx :: sql.Transaction, dialect, catalog_id, input.events or {}, to_seq, consts.LIMITS.fold_rows)
    if fold_err or not folded then
        return nil, fold_err
    end
    local changed, perr = plugin_change(tx, catalog_id, input.events or {})
    if perr then return nil, perr end
    for _, event in ipairs(input.events or {}) do
        if (event.type == consts.EVENTS.PLUGIN_CONFIGURED or event.type == consts.EVENTS.PLUGIN_REBUILD) and event.seq <= folded.last_seq then
            local catalog, cerr = store.catalog(tx, catalog_id)
            if cerr or not catalog then return nil, cerr end
            local body = event.body :: { plugin: string, config: types.JsonObject? }
            local state = catalog.plugin_state[body.plugin]
            if state and state.active and event.seq > state.seq then
                state.config, state.seq, state.lifecycle = body.config or state.config, event.seq, { state = "pending" }
                local json = require("json")
                local _, uerr = tx:execute("UPDATE kickside_pim_catalog SET plugin_state = $1 WHERE catalog_id = $2", { json.encode(catalog.plugin_state), catalog_id })
                if uerr then return nil, uerr end
            end
            changed = true
        end
    end
    for _, event in ipairs(input.events or {}) do
        if event.seq <= folded.last_seq then
            local body: unknown = event.body
            if type(body)=="string" then body=assert(json.decode(body)) end
            local r=(body :: types.JsonObject).receipt
            if type(r)=="table" then
                local rerr=receipts.record(tx,catalog_id,r :: receipts.Receipt,event.seq :: integer,(body :: types.JsonObject).at :: string)
                if rerr then return nil,rerr end
            end
        end
    end
    if changed then
        local job, jerr = jobs.enqueue_tx(tx :: sql.Transaction, dialect, { namespace = "pim", scope = "plugins", key = catalog_id,
            owner_locator = { kind = "component", id = catalog_id }, slot = true, demand = true,
            job_type = "kickside.pim.jobs:plugins", immutable_payload = { catalog_id = catalog_id } })
        if jerr then return nil, jerr end
        lifecycle_job = job.id
    end
    return folded,nil
    end)
    if transaction_error or not folded then return nil,transaction_error end
    if lifecycle_job then
        local _, wake_err = jobs.wake_job(lifecycle_job, { control = true, ensure_due = true })
        if wake_err then return nil, wake_err end
    end
    if folded.rebuild_job then
        local _, wake_err = jobs.wake_job(folded.rebuild_job, { control = true, ensure_due = true })
        if wake_err then return nil, errors.wrap(wake_err, "rebuild wake failed") end
    end
    for _, job in ipairs(folded.jobs) do
        local _, wake_err = jobs.wake_job(job, { control = true, ensure_due = true })
        if wake_err then return nil, errors.wrap(wake_err, "catalog job wake failed") end
    end
    return { body = input.projection and input.projection.body or {}, last_seq = folded.last_seq }, nil
end

return M
