-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- The projection owns desired per-board attachment configuration.
local sql = require("sql")
local json = require("json")
local store = require("store")
local codec = require("row_decode")
local domain = require("domain")
local storage = require("storage")
local jobs = require("jobs")
local values = require("values")
local M = {}
local function decode(raw: domain.Row): (domain.PluginState?, error?)
    local row, err = codec.object(raw, { "plugin", "attachment_id", "impl_id" },
        { "active", "revision", "applied_revision" }, { "config", "lifecycle", "progress" })
    if err or not row then return nil, err end
    return { plugin = row.plugin :: string, attachment_id = row.attachment_id :: string,
        revision = row.revision :: integer, applied_revision = row.applied_revision :: integer,
        impl_id = row.impl_id :: string, config = row.config :: domain.JsonObject, active = row.active == 1,
        lifecycle = row.lifecycle :: domain.PluginLifecycle, progress = row.progress :: domain.PluginProgress,
        stored_progress = raw.progress :: string }, nil
end

function M.active(tx: storage.Executor, board_id: string, plugin: string): (domain.PluginState?, error?)
    local rows, err = tx:query("SELECT * FROM kickside_work_plugin WHERE board_id = $1 AND plugin = $2 AND active = 1", { board_id, plugin })
    if err or not rows or not rows[1] then return nil, err end
    return decode(rows[1])
end

function M.list(tx: storage.Executor, board_id: string, pending: boolean?, limit: integer?): ({ domain.PluginState }?, error?)
    local where = pending and " AND revision > applied_revision" or ""
    local params: domain.SqlParams = {board_id}
    if limit then params[2]=limit end
    local rows, err = tx:query("SELECT * FROM kickside_work_plugin WHERE board_id = $1" .. where .. " ORDER BY plugin" .. (limit and " LIMIT $2" or ""), params)
    if err then return nil, err end
    local out: { domain.PluginState } = {}
    for _, raw in ipairs(rows or {}) do
        local row, row_err = decode(raw)
        if row_err or not row then return nil, row_err end
        out[#out + 1] = row
    end
    return out, nil
end

local function configure(tx: sql.Transaction, board_id: string, plugin: string, seq: integer, config: domain.JsonObject): error?
    local _, err = tx:execute([[UPDATE kickside_work_plugin SET config = $1, lifecycle = '{"state":"pending"}', progress = '{}', revision = $2 WHERE board_id = $3 AND plugin = $4 AND active = 1]],
        { json.encode(config), seq, board_id, plugin })
    return err
end

function M.schema(tx: sql.Transaction, board_id: string, compiled: domain.Compiled, seq: integer, configs: { [string]: domain.JsonObject }?): error?
    local rows, err = M.list(tx, board_id)
    if err then return err end
    local existing: { [string]: domain.PluginState } = {}
    local listed: { [string]: boolean } = {}
    for _, row in ipairs(rows or {}) do existing[row.plugin] = row end
    for _, plugin in ipairs(compiled.plugins or {}) do
        listed[plugin.use] = true
        local old = existing[plugin.use]
        local config = (configs or {})[plugin.use]
        if not old or not old.active or old.attachment_id ~= plugin.attachment_id then
            local _, perr = tx:execute([[INSERT INTO kickside_work_plugin (board_id, plugin, attachment_id, impl_id, config, active, revision, applied_revision)
                VALUES ($1, $2, $3, $4, $5, 1, $6, 0) ON CONFLICT (board_id, plugin) DO UPDATE SET active = 1,
                config = excluded.config, attachment_id = excluded.attachment_id, impl_id = excluded.impl_id, revision = excluded.revision, applied_revision = 0, lifecycle = '{"state":"pending"}', progress = '{}']],
                { board_id, plugin.use, plugin.attachment_id, plugin.attachment_kind, json.encode(config or {}), seq })
            if perr then return perr end
        elseif config and not values.equal(old.config, config) then
            local cerr = configure(tx, board_id, plugin.use, seq, config)
            if cerr then return cerr end
        end
    end
    for _, row in ipairs(rows or {}) do
        if row.active and not listed[row.plugin] then
            local _, derr = tx:execute([[UPDATE kickside_work_plugin SET active = 0, lifecycle = '{"state":"pending"}', progress = '{}', revision = $1 WHERE board_id = $2 AND plugin = $3]], { seq, board_id, row.plugin })
            if derr then return derr end
        end
    end
    return nil
end
function M.configure(tx: sql.Transaction, board_id: string, event: domain.FoldEvent): error?
    return configure(tx, board_id, event.body.plugin :: string, event.seq, (event.body.config or {}) :: domain.JsonObject)
end
function M.rebuild(tx: sql.Transaction, board_id: string, event: domain.FoldEvent): error?
    local _, err = tx:execute([[UPDATE kickside_work_plugin SET revision = $1, lifecycle = '{"state":"pending"}', progress = '{}' WHERE board_id = $2 AND plugin = $3 AND active = 1]], { event.seq, board_id, event.body.plugin })
    return err
end
function M.finish(board_id: string, row: domain.PluginState, lifecycle: domain.PluginLifecycle): error?
    local db, err = store.open()
    if not db then return err end
    local query = "UPDATE kickside_work_plugin SET lifecycle = $1, progress = $2, applied_revision = $3 WHERE board_id = $4 AND plugin = $5 AND revision = $6 AND progress = $7"
    if not row.active and lifecycle.state == "ready" then query = "DELETE FROM kickside_work_plugin WHERE revision = $1 AND board_id = $2 AND plugin = $3" end
    local params: domain.SqlParams = { json.encode(lifecycle), json.encode(row.progress),
        lifecycle.state == "pending" and row.applied_revision or row.revision, board_id, row.plugin, row.revision, row.stored_progress }
    if not row.active and lifecycle.state == "ready" then params = { row.revision, board_id, row.plugin } end
    local _, uerr = db:execute(query, params)
    local _, rerr = db:release()
    return uerr or rerr
end

local function enqueue(tx: sql.Transaction, dialect: string, board_id: string): (string?, error?)
    local job, jerr = jobs.enqueue_tx(tx, dialect, { namespace = "kickside.work", scope = "plugins", key = board_id,
        owner_locator = { kind = "component", id = board_id }, slot = true, demand = true,
        job_type = "kickside.work.jobs:plugins", immutable_payload = { board_id = board_id } })
    if jerr then return nil, jerr end
    return job.id :: string, nil
end

function M.enroll(tx: sql.Transaction, dialect: string, board_id: string): (string?, error?)
    local rows, err = M.list(tx, board_id, true, 1)
    if err then return nil, err end
    if #(rows or {}) == 0 then return nil, nil end
    return enqueue(tx, dialect, board_id)
end

function M.refresh_page(tx: sql.Transaction, dialect: string, plugin: string, after: string, limit: integer, refresh: string): ({ next: string?, enrolled: boolean }?, error?)
    local rows, err = tx:query([[SELECT board_id FROM kickside_work_plugin
        WHERE plugin = $1 AND active = 1 AND board_id > $2 ORDER BY board_id LIMIT $3]], { plugin, after, limit })
    if err or not rows then return nil, err end
    local enrolled = false
    for _, row in ipairs(rows) do
        local board_id = row.board_id :: string
        -- A new refresh token fences a lifecycle batch holding progress from the old manifest.
        local updated, uerr = tx:query([[UPDATE kickside_work_plugin SET applied_revision = 0, progress = $1, lifecycle = '{"state":"pending"}'
            WHERE board_id = $2 AND plugin = $3 AND active = 1 RETURNING board_id]], { refresh, board_id, plugin })
        if uerr then return nil, uerr end
        if updated and updated[1] then
            local _, jerr = enqueue(tx, dialect, board_id)
            if jerr then return nil, jerr end
            enrolled = true
        end
        after = board_id
    end
    return { next = #rows == limit and after or nil, enrolled = enrolled }, nil
end
return M
