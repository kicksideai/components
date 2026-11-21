-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- The lifecycle job converges current intent independently for each plugin.
local threads = require("threads")
local plugins = require("plugins")
local attachments = require("attachments")
local store = require("store")
local types = require("types")
local component = require("component")
local jobs = require("jobs")
local values = require("values")
local json = require("json")
local consts = require("consts")
local writer = require("writer")
local sql = require("sql")
local M = {}
local PREFIX = "kickside.pim.plugin:"
type Definition = { id: string, kind: string, projection_key: string, body: unknown }
type Page = { projections: { Definition }, projections_has_more: boolean, projections_cursor: string? }

local function enqueue(tx: types.Executor, dialect: string, catalog_id: string): (string?, error?)
    local job, err = jobs.enqueue_tx(tx :: sql.Transaction, dialect, { namespace = "pim", scope = "plugins", key = catalog_id,
        owner_locator = { kind = "component", id = catalog_id }, slot = true, demand = true,
        job_type = "kickside.pim.jobs:plugins", immutable_payload = { catalog_id = catalog_id } })
    if err then return nil, err end
    return job.id :: string, nil
end

local function converge(catalog_id: string, id: string, intent: types.PluginIntent, plugin: types.Plugin?): (boolean?, error?)
    local client, err = threads.open()
    if err or not client then return nil, err end
    local key = PREFIX .. id
    local raw, lerr = client:list_projections({ thread_id = catalog_id, limit = 200, projections_cursor = intent.projection_after })
    if lerr then return nil, lerr end
    local page = raw :: Page
    local expected: { [string]: boolean } = {}
    for _, projection in ipairs((plugin and plugin.projections) or {}) do expected[projection.kind] = true end
    for _, projection in ipairs(page.projections) do
        if projection.projection_key == key and (not intent.active or not expected[projection.kind]) then
            local _, rerr = client:remove_projection({ thread_id = catalog_id, projection_id = projection.id })
            if rerr then return nil, rerr end
        end
    end
    intent.projection_after = page.projections_has_more and page.projections_cursor or nil
    for i=#(intent.removing or {}),math.max(1,#(intent.removing or {})-19),-1 do
        local rerr=attachments.remove((intent.removing :: {string})[i])
        if rerr then return nil,rerr end
        table.remove(intent.removing :: {string},i)
    end
    if #(intent.removing or {})>0 then return false,nil end
    if not intent.active then
        if page.projections_has_more then return false, nil end
        if intent.attachment_id then
            local err = attachments.remove(intent.attachment_id)
            if err then return nil, err end
        end
        return true, nil
    end
    local active=plugin :: types.Plugin
    local _, _, aerr = attachments.ensure(catalog_id, id, intent.generation, active.attachment :: string, active.title, intent.config, intent.attachment_id)
    if aerr then return nil, aerr end
    local floor: integer? = nil
    for _, p in ipairs((plugin and plugin.projections) or {}) do
        local previous: types.JsonObject? = nil
        local pair, perr = client:get_projection_cursor({thread_id=catalog_id,kind=p.kind,projection_key=key})
        if perr and perr:kind() ~= errors.NOT_FOUND then return nil, perr end
        if pair then
            local body = pair.projection.body
            if type(body) == "string" then
                local decoded, jerr = json.decode(body)
                if jerr then return nil, jerr end
                body = decoded
            end
            previous = (body :: types.JsonObject).worker_config :: types.JsonObject?
        end
        if previous and previous.revision ~= p.revision and previous.start_seq == intent.seq then
            local _, rerr = writer.rebuild_plugin(catalog_id, id)
            if rerr then return nil, rerr end
            return false, nil
        end
        local reset = previous ~= nil and (previous.start_seq ~= intent.seq or not values.equal(previous.config, intent.config) or previous.revision ~= p.revision or previous.attachment_id ~= intent.attachment_id)
        if not previous or reset then
            if floor == nil then
                local boundary, berr = client:prune_boundary({ thread_id = catalog_id })
                if berr then return nil, berr end
                floor = assert(boundary).max_pruned_seq
            end
            if intent.seq <= floor then
                return nil, errors.new({ kind = errors.CONFLICT, retryable = false,
                    message = "Plugin projection history was pruned. Reset the plugin to register at a new catalog event.",
                    details = { code = "plugin_projection_history_pruned", plugin = id, projection = p.kind,
                        start_seq = intent.seq, max_pruned_seq = floor } })
            end
            local inputs: { { type: string } } = {}
            local events = p.events
            if p.input == "state" then
                events = {}
                for _, event_type in pairs(consts.EVENTS) do events[#events + 1] = event_type end
            end
            local seen: { [string]: boolean } = {}
            for _, event_type in ipairs(events) do
                if not seen[event_type] then inputs[#inputs + 1] = { type = event_type }; seen[event_type] = true end
            end
            local _, rerr = client:register_projection({ thread_id = catalog_id, kind = p.kind, projection_key = key,
                worker_ref = p.worker_ref, worker_input_mode = "prefetch_events", events = { input = inputs }, start_seq = intent.seq - 1, reset = reset,
                worker_config = { attachment_id = intent.attachment_id, plugin = id, config = intent.config, input = p.input, revision = p.revision, start_seq = intent.seq } })
            if rerr then return nil, rerr end
        end
    end
    return not page.projections_has_more, nil
end

-- batch spends a bounded plugin budget; a failed declaration preserves its resources.
function M.batch(input: { catalog_id: string }): ({ done: boolean, reconcile: boolean? }?, error?)
    local _, aerr = component.validate_access(input.catalog_id, component.ACCESS.WRITE)
    if aerr then return nil, aerr end
    local db, oerr = store.open()
    if oerr or not db then return nil, oerr end
    local catalog, cerr = store.catalog(db, input.catalog_id)
    cerr = store.release(db, cerr)
    if cerr then return nil, cerr end
    if not catalog then return { done = true }, nil end
    local ids: {string}={}
    local wrapped_pending=false
    local active_plugins=false
    for id,intent in pairs(catalog.plugin_state) do
        active_plugins=active_plugins or intent.active==true
        if intent.lifecycle.state=="pending" or intent.active then
            if id>(catalog.plugin_after or "") then ids[#ids+1]=id
            elseif intent.lifecycle.state=="pending" then wrapped_pending=true end
        end
    end
    table.sort(ids)
    local pending=#ids>20 or wrapped_pending
    local retry_error: error?=nil
    for i = 1, math.min(#ids, 20) do
        local id = ids[i]
        local intent = catalog.plugin_state[id] :: types.PluginIntent
        local plugin: types.Plugin?=nil
        local err: error?=nil
        if intent.active then
            plugin, err = plugins.load(id)
            if plugin then
                local _, config_err = plugins.merged(plugin, {}, intent.config)
                err = config_err
            end
        end
        local complete = false
        if not err then complete, err = converge(input.catalog_id, id, intent, plugin) end
        pending = pending or (not complete and not err)
        local lifecycle: types.PluginLifecycle = { state = complete and "ready" or "pending" }
        if err then
            local retryable=err:retryable()==true or (err:retryable()==nil and (err:kind()==errors.UNAVAILABLE or err:kind()==errors.INTERNAL))
            if retryable then retry_error=retry_error or err; pending=true end
            lifecycle = { state = retryable and "pending" or "failed", error = { kind = err:kind(), code = err:details().code :: string?, message = tostring(err) } }
        end
        local _, serr = store.transaction("plugin lifecycle", function(tx: types.Executor, dialect: string): (boolean?, error?)
            local current, rerr = store.catalog(tx, input.catalog_id, dialect)
            if rerr or not current then return nil, rerr end
            local state = current.plugin_state[id]
            if state and state.seq == intent.seq then
                local before=values.canonical(current.plugin_state)
                state.projection_after = intent.projection_after
                state.removing = intent.removing
                if not intent.active and complete and not err then current.plugin_state[id] = nil
                else state.lifecycle = lifecycle end
                local encoded=values.canonical(current.plugin_state)
                if encoded~=before then
                    local _, uerr = tx:execute("UPDATE kickside_pim_catalog SET plugin_state = $1 WHERE catalog_id = $2", { encoded, input.catalog_id })
                    if uerr then return nil, uerr end
                end
            end
            return true, nil
        end)
        if serr then return nil, serr end
    end
    local after=#ids>20 and ids[20] or ""
    if after~=(catalog.plugin_after or "") then
        local _,aerr=store.transaction("plugin scan position",function(tx: types.Executor,_dialect: string): (boolean?,error?)
            local _,err=tx:execute("UPDATE kickside_pim_catalog SET plugin_after=$1 WHERE catalog_id=$2 AND plugin_after<>$1",{after,input.catalog_id})
            if err then return nil,err end
            return true,nil
        end)
        if aerr then return nil,aerr end
    end
    if retry_error then return nil,retry_error end
    return { done = not pending, reconcile = active_plugins }, nil
end

-- run demands convergence of stored intent without changing membership or config.
function M.run(input: { catalog_id: string }): (boolean?, error?)
    local _, aerr = component.validate_access(input.catalog_id, component.ACCESS.WRITE)
    if aerr then return nil, aerr end
    local job_id, err = store.transaction("plugin demand", function(tx: types.Executor, dialect: string): (string?, error?)
        local catalog, cerr = store.catalog(tx, input.catalog_id, dialect)
        if cerr or not catalog then return nil, cerr end
        local before=values.canonical(catalog.plugin_state)
        for _, state in pairs(catalog.plugin_state) do state.lifecycle = { state = "pending" } end
        local encoded=values.canonical(catalog.plugin_state)
        if encoded~=before then
            local _, uerr = tx:execute("UPDATE kickside_pim_catalog SET plugin_state = $1 WHERE catalog_id = $2", { encoded, input.catalog_id })
            if uerr then return nil, uerr end
        end
        return enqueue(tx, dialect, input.catalog_id)
    end)
    if err or not job_id then return nil, err end
    local _, werr = jobs.wake_job(job_id, { control = true, ensure_due = true })
    if werr then return nil, werr end
    return true, nil
end
return M
