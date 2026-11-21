-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Leased lifecycle batches converge one plugin independently of its neighbours.
local threads = require("threads")
local manifests = require("manifests")
local attachments = require("attachments")
local store = require("store")
local plugin_rows = require("plugin_rows")
local plugins = require("plugins")
local types = require("types")
local local_types = require("local_types")
local component = require("component")
local json = require("json")
local values = require("values")
local jobs = require("jobs")
local consts = require("consts")
local limits = require("limits")
local M = {}
local PREFIX = "kickside.work.plugin:"

local function converge(board_id: string, row: types.PluginState, settings: types.OperationalLimits): (boolean?, error?)
    local projections: { types.PluginProjection } = {}
    local config: types.JsonObject? = nil
    if row.active then
        local plugin, err = manifests.load(row.plugin)
        if err or not plugin then return nil, err end
        local effective, cerr = plugins.effective(plugin, row.config)
        if cerr or not effective then return nil, cerr end
        config, projections = effective, plugin.projections
    end
    local client, err = threads.open()
    if err or not client then return nil, err end
    local progress = row.progress
    if not progress.scanned then
        local expected: { [string]: boolean } = {}
        for _, p in ipairs(projections) do expected[p.kind] = true end
        local raw, lerr = client:list_projections({ thread_id = board_id, limit = settings.plugin_discovery_batch, projections_cursor = progress.projection_after })
        if lerr then return nil, lerr end
        local page = raw :: local_types.Page
        for _, p in ipairs(page.projections) do
            if p.projection_key == PREFIX .. row.plugin and not expected[p.kind] then
                local _, rerr = client:remove_projection({ thread_id = board_id, projection_id = p.id })
                if rerr then return nil, rerr end
            end
        end
        progress.projection_after = page.projections_has_more and page.projections_cursor or nil
        if page.projections_has_more then return false, nil end
        progress.scanned = true
    end
    if not row.active then
        local rerr = attachments.remove(board_id, row)
        return rerr == nil, rerr
    end
    local aerr = attachments.ensure(board_id, row)
    if aerr then return nil, aerr end
    local first = (progress.registered or 0) + 1
    for index = first, math.min(#projections, first + settings.plugin_projection_batch - 1) do
        local p = projections[index]
        local mode = p.input == "state" and "cursor_only" or "prefetch_events"
        local previous: local_types.Config? = nil
        local parked = false
        local raw, perr = client:get_projection_cursor({ thread_id = board_id, kind = p.kind, projection_key = PREFIX .. row.plugin })
        if perr and perr:kind() ~= errors.NOT_FOUND then return nil, perr end
        if raw then
            local pair = raw :: local_types.Pair
            parked = pair.cursor.status == "invalid"
            local body = pair.projection.body
            if type(body) == "string" then
                local decoded, jerr = json.decode(body)
                if jerr then return nil, jerr end
                body = decoded
            end
            local definition = body :: local_types.Body
            previous = definition.worker_config
        end
        local changed = previous ~= nil and (not values.equal(previous.config, config) or previous.revision ~= p.revision)
        local reset = changed or parked
        if previous and reset and (changed or p.input == "state") and previous.start_seq == row.revision then
            local _, rerr = client:append_events({ writes = { { thread_id = board_id, events = { { type = consts.EVENTS.PLUGIN_REBUILD,
                subject = "plugin:" .. row.plugin, body = { plugin = row.plugin } } } } } })
            return rerr == nil, rerr
        end
        if not previous or reset or previous.input ~= p.input then
            local start_seq = previous and not reset and previous.start_seq or p.start_seq or row.revision
            if previous and parked and not changed and p.input == "events" then start_seq = previous.start_seq end
            local events: { { type: string } } = {}
            if p.input == "state" then
                for _, event_type in pairs(consts.EVENTS) do events[#events + 1] = { type = event_type } end
            else
                for _, event_type in ipairs(p.events) do events[#events + 1] = { type = event_type } end
            end
            local _, rerr = client:register_projection({ thread_id = board_id, kind = p.kind, projection_key = PREFIX .. row.plugin,
                worker_ref = p.worker_ref, worker_input_mode = mode,
                events = { input = events }, start_seq = start_seq - 1, reset = reset,
                worker_config = { plugin = row.plugin, board_id = board_id, attachment_id = row.attachment_id, config = config,
                    input = p.input, revision = p.revision, start_seq = start_seq } })
            if rerr then
                if p.input == "events" and rerr:kind() == errors.CONFLICT then
                    -- Core checks retention atomically when it installs the cursor. Read the floor only to describe a refusal.
                    local boundary, berr = client:prune_boundary({ thread_id = board_id })
                    if berr then return nil, berr end
                    if boundary and start_seq <= boundary.max_pruned_seq then
                        return nil, errors.new({ kind = errors.CONFLICT, message = "event projection start is below retained history",
                            details = { code = "plugin_projection_gap", floor = boundary.max_pruned_seq + 1 } })
                    end
                end
                return nil, rerr
            end
        end
        progress.registered = index
    end
    return (progress.registered or 0) >= #projections, nil
end

function M.batch(input: { board_id: string }): ({ done: boolean }?, error?)
    local settings, settings_err = limits.read()
    if settings_err or not settings then return nil, settings_err end
    local _, aerr = component.validate_access(input.board_id, component.ACCESS.WRITE)
    if aerr then return nil, aerr end
    local db, oerr = store.open()
    if oerr or not db then return nil, oerr end
    local rows, lerr = plugin_rows.list(db, input.board_id, true, settings.plugin_batch+1)
    local _, rerr = db:release()
    if lerr or rerr then return nil, lerr or rerr end
    local pending = #(rows or {}) > settings.plugin_batch
    for i = 1, math.min(#(rows or {}), settings.plugin_batch) do
        local row = rows[i]
        local complete, err = converge(input.board_id, row, settings)
        pending = pending or (not complete and not err)
        local lifecycle: types.PluginLifecycle = { state = complete and "ready" or "pending" }
        if err then lifecycle = { state = "failed", error = plugins.failure(err) } end
        if lifecycle.state ~= "pending" then row.progress = {} end
        local ferr = plugin_rows.finish(input.board_id, row, lifecycle)
        if ferr then return nil, ferr end
    end
    return { done = not pending, inspected = math.min(#(rows or {}), settings.plugin_batch) }, nil
end

function M.run(input: { board_id: string }): (boolean?, error?)
    local _, aerr = component.validate_access(input.board_id, component.ACCESS.ADMIN)
    if aerr then return nil, aerr end
    local db, oerr = store.open()
    if oerr or not db then return nil, oerr end
    local tx, terr = db:begin()
    if terr or not tx then db:release(); return nil, terr end
    local _, uerr = tx:execute([[UPDATE kickside_work_plugin SET applied_revision = 0, progress = '{}', lifecycle = '{"state":"pending"}' WHERE board_id = $1]], { input.board_id })
    local job_id, jerr = nil, uerr
    if not jerr then job_id, jerr = plugin_rows.enroll(tx, db:type(), input.board_id) end
    if jerr then tx:rollback(); db:release(); return nil, jerr end
    local _, cerr = tx:commit()
    local _, rerr = db:release()
    if cerr or rerr then return nil, cerr or rerr end
    if job_id then
        local _, werr = jobs.wake_job(job_id, { control = true, ensure_due = true })
        if werr then return nil, werr end
    end
    return true, nil
end
return M
