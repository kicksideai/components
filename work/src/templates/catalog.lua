-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local sql = require("sql")
local ctx = require("ctx")
local time = require("time")
local domain = require("domain")
local types = require("types")
local store = require("store")
local clock = require("clock")
local append = require("append")
local values = require("values")

local M = {}
M.PLUGIN = "kickside.work.templates:plugin"
M.CONTRACT = "kickside.work.templates:templates"
local CAPACITY = 128
local PAGE = 500

function M.problem(kind: string, code: string, message: string): error
    return errors.new({ kind = kind, message = message, retryable = false, details = { code = code } })
end

-- The board schema supplies active intent. Lifecycle readiness additionally
-- ensures the attachment thread exists before we use it as a catalog owner.
function M.attachment(db: sql.DB | sql.Transaction, board_id: string): (string?, error?)
    local rows, err = db:query([[SELECT attachment_id, lifecycle FROM kickside_work_plugin
        WHERE board_id = $1 AND plugin = $2 AND active = 1]], { board_id, M.PLUGIN })
    if err then return nil, err end
    local row = rows and rows[1]
    if not row then return nil, M.problem(errors.NOT_FOUND, "plugin_inactive", "Work Templates is inactive on this board") end
    local state, serr = store.stored(row.lifecycle, {} :: domain.PluginLifecycle)
    if serr or not state then return nil, serr end
    if state.state ~= "ready" then
        return nil, errors.new({ kind = errors.UNAVAILABLE, message = "Work Templates attachment is not ready",
            retryable = state.state == "pending", details = { code = "template_attachment_unavailable" } })
    end
    return store.need(row, "attachment_id")
end

local function decode(row: domain.Row): (types.Version?, error?)
    local record, err = store.stored(row.record, nil :: types.Record?)
    if err or not record then return nil, err end
    local identities, ierr = store.stored(row.field_identities, nil :: { [string]: string }?)
    if ierr or not identities then return nil, ierr end
    local identity, terr = store.need(row, "type_identity")
    if terr or not identity then return nil, terr end
    return { record = record, field_identities = identities, type_identity = identity, archived = store.int(row.archived) == 1 }, nil
end

function M.get(db: sql.DB | sql.Transaction, attachment: string, template: string, version: string): (types.Version?, error?)
    local rows, err = db:query([[SELECT record, field_identities, type_identity, archived FROM kickside_work_template_version
        WHERE attachment_id = $1 AND template_id = $2 AND version = $3
        AND (expires_at IS NULL OR expires_at > $4)]], { attachment, template, version, clock.now() })
    if err then return nil, err end
    if not rows or not rows[1] then
        return nil, M.problem(errors.NOT_FOUND, "template_version_not_found", "template version is unavailable on this board")
    end
    return decode(rows[1] :: domain.Row)
end

function M.active(db: sql.DB | sql.Transaction, attachment: string): ({ types.Version }?, error?)
    local rows, err = db:query([[SELECT record, field_identities, type_identity, archived FROM kickside_work_template_version
        WHERE attachment_id = $1 AND archived = 0 ORDER BY template_id, version LIMIT $2]], { attachment, CAPACITY })
    if err then return nil, err end
    local result: { types.Version } = {}
    for _, row in ipairs(rows or {}) do
        local version, derr = decode(row :: domain.Row)
        if derr or not version then return nil, derr end
        result[#result + 1] = version
    end
    return result, nil
end

local function transaction<T>(work: (sql.Transaction) -> (T?, error?)): (T?, error?)
    local db, err = store.open()
    if err or not db then return nil, err end
    local tx, terr = db:begin()
    if terr or not tx then
        local _, release_err = db:release()
        return nil, terr or release_err
    end
    local result, failure = work(tx)
    local _, cleanup_err
    if failure or result == nil then
        _, cleanup_err = tx:rollback()
    else
        _, failure = tx:commit()
    end
    local _, release_err = db:release()
    local final_err = failure or cleanup_err or release_err
    if final_err then return nil, final_err end
    return result, nil
end

local function fact(tx: sql.Transaction, attachment: string, event: string, record: types.Record): error?
    local _, err = append.append_tx(tx, { thread_id = attachment, events = { { event_type = event,
        payload = { template_id = record.template_id, version = record.version, schema_generation = record.schema_generation } } } })
    return err
end

function M.publish(attachment: string, version: types.Version): (types.Record?, error?)
    return transaction(function(tx: sql.Transaction): (types.Record?, error?)
        local record = version.record
        -- The native append locks the attachment thread and fences teardown.
        -- Its fact, quota check, and insertion commit together.
        local ferr = fact(tx, attachment, "kickside.work.templates:template.published", record)
        if ferr then return nil, ferr end
        local rows, err = tx:query([[SELECT 1 FROM kickside_work_template_version
            WHERE attachment_id = $1 ORDER BY template_id, version LIMIT 1 OFFSET $2]], { attachment, CAPACITY - 1 })
        if err then return nil, err end
        if rows and rows[1] then
            return nil, M.problem(errors.CONFLICT, "template_catalog_full", "this board retains 128 template versions")
        end
        local _, ierr = tx:execute([[INSERT INTO kickside_work_template_version
            (attachment_id, template_id, version, record, field_identities, type_identity) VALUES ($1,$2,$3,$4,$5,$6)]],
            { attachment, record.template_id, record.version, values.canonical(record),
                values.canonical(version.field_identities), version.type_identity })
        if ierr then return nil, ierr end
        return record, nil
    end)
end

function M.archive(attachment: string, version: types.Version, window: integer?): (types.Archive?, error?)
    local record = version.record
    local result = { template_id = record.template_id, version = record.version, archived = true }
    if version.archived then return result, nil end
    local expires = window and clock.deadline(window).at or sql.NULL
    return transaction(function(tx: sql.Transaction): (types.Archive?, error?)
        local updated, err = tx:execute([[UPDATE kickside_work_template_version SET archived = 1, expires_at = $1
            WHERE attachment_id = $2 AND template_id = $3 AND version = $4 AND archived = 0]],
            { expires, attachment, record.template_id, record.version })
        if err or not updated then return nil, err end
        if updated.rows_affected == 0 then
            local current, cerr = M.get(tx, attachment, record.template_id, record.version)
            if cerr or not current then return nil, cerr end
        else
            local ferr = fact(tx, attachment, "kickside.work.templates:template.archived", record)
            if ferr then return nil, ferr end
        end
        return result, nil
    end)
end

function M.delete(): ({ success: boolean }?, error?)
    local id = ctx.get("component_id")
    if type(id) ~= "string" or id == "" then
        return nil, M.problem(errors.INVALID, "component_id_required", "catalog attachment id is required")
    end
    local db, err = store.open()
    if err or not db then return nil, err end
    local _, derr = db:execute("DELETE FROM kickside_work_template_version WHERE attachment_id = $1", { id })
    local _, release_err = db:release()
    if derr or release_err then return nil, derr or release_err end
    return { success = true }, nil
end

function M.retire(): ({ success: boolean, deleted: integer, needs_continue: boolean, deadline_ms: integer? }?, error?)
    return transaction(function(tx: sql.Transaction): ({ success: boolean, deleted: integer, needs_continue: boolean, deadline_ms: integer? }?, error?)
        local now = clock.now()
        local deleted, err = tx:execute([[DELETE FROM kickside_work_template_version
            WHERE (attachment_id, template_id, version) IN (
                SELECT attachment_id, template_id, version FROM kickside_work_template_version
                WHERE expires_at <= $1 ORDER BY expires_at, attachment_id, template_id, version LIMIT $2
            )]], { now, PAGE })
        if err or not deleted then return nil, err end
        local n = deleted.rows_affected
        if n == PAGE then return { success = true, deleted = n, needs_continue = true }, nil end
        local rows, rerr = tx:query([[SELECT expires_at FROM kickside_work_template_version
            WHERE expires_at > $1 ORDER BY expires_at, attachment_id, template_id, version LIMIT 1]], { now })
        if rerr then return nil, rerr end
        local deadline: integer? = nil
        if rows and rows[1] then
            local due, derr = time.parse(time.RFC3339, rows[1].expires_at :: string)
            if derr or not due then return nil, derr end
            deadline = (due:unix_nano() + 999999) // 1000000
        end
        return { success = true, deleted = n, needs_continue = false, deadline_ms = deadline }, nil
    end)
end

return M
