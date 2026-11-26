-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local types = require("types")
local time = require("time")
local uuid = require("uuid")
local events = require("events")
local database = require("database")
local library = require("library")
local usage_reader = require("usage")
local history = require("history")
local resources = require("resource")
local edit_rules = require("edit")
local edit_ops = require("library_edits")
local notify = require("notify")
local library_reader = require("library_reader")
local library_repo = require("library_repo")
local asset_file_repo = require("asset_file_repo")
local thread_events = require("thread_events")
local threads = require("threads")
local canonical = require("canonical_json")
local logger = require("logger")
local live_repo = require("live_repo")
local asset_refs = require("upload_ref_repo")
local history_repo = require("history_repo")
local reference_repo = require("reference_repo")
local preview_repo = require("preview_repo")
local live = require("live")

local M = {}
local RESTORE_GRACE_MS = 15 * 60 * 1000

local function asset_event(tx: database.Transaction, operation: string, edit: types.LibraryEdit, author: string,
    signature: string, source: types.Resource?, head: integer, token: string, command_id: string,
    versions: {[string]: integer}): (types.LibraryEvent?, error?)
    local key = edit.key
    local workspace, load_err = edit_ops.workspace(tx, versions)
    if load_err then return nil, load_err end
    local read_err = edit_ops.load(workspace, key)
    if read_err then return nil, read_err end
    local candidate, invalid = edit_ops.prepare(edit, operation, workspace.items, workspace.originals, source)
    if invalid then return nil, invalid end
    local id = resources.subject(key)
    local current, original = workspace.items[id], workspace.originals[id]
    local revision, revision_err = edit_ops.current_revision(workspace, key)
    if revision_err then return nil, revision_err end
    local body: types.LibraryEventBody = {key = {kind = key.kind, name = key.name}, author = author,
        revision = (revision :: integer) + 1, command_hash = signature, note = edit.note,
        change = current and "edited" or "created"}
    local event_type = edit_rules.event_type(operation, key)
    if operation == "delete" then
        local in_use = usage_reader.require_unused(tx, key, workspace.originals)
        if in_use then return nil, in_use end
        body.change = "deleted"
    else
        local item = candidate :: types.ResourceContent
        local asset = item.asset :: types.Asset
        body.origin = original and original.resource.origin or nil
        body.origin_label = original and original.resource.origin_label or nil
        if source then
            body.change, body.from_seq, body.from_version = "restored", source.seq, source.revision
        end
        if asset.source == "original" then
            event_type = events.RESET
            body.content, body.state = events.snapshot(item), "original"
            if not source then body.change = "reset" end
        else
            local upload_id = asset.upload_id :: string
            local reserve_err: error?
            local now = time.now():unix_nano() // 1000000
            if source then
                _, reserve_err = asset_file_repo.hold_restore(tx, upload_id, head, token, author, command_id,
                    now, now + RESTORE_GRACE_MS)
            else
                _, reserve_err = asset_file_repo.hold_adoption(tx, upload_id, edit.asset_deadline :: integer, now, head + 1, token)
            end
            if reserve_err then return nil, reserve_err end
            body.asset = {upload_id = upload_id, filename = asset.filename :: string,
                content_type = asset.content_type :: string, size = asset.size :: integer}
            body.title, body.description = item.title, item.description
        end
    end
    return events.build(event_type, body)
end

local function result(threads_api: types.LibraryThreads, operation: string, requested: {types.LibraryEdit},
    seq: integer, deadline: string): (types.LibrarySaveResult?, error?)
    local complete, err = threads.catch_up(seq, deadline)
    if err and not err:retryable() and not errors.is(err, errors.CONFLICT) then return nil, err end
    if not complete then
        local mark, mark_err = database.with_db(live_repo.get)
        if mark_err then return nil, mark_err end
        if mark.projected_seq < seq then
            logger:warn("Mail library write is committed and awaiting projection", {seq = seq, error = tostring(err)})
            return {seq = seq, projected = false, committed = true}, nil
        end
    end
    notify.nudge()
    local receipt: types.LibrarySaveResult = {seq = seq, projected = true, committed = true, items = {}}
    if operation == "delete" then return receipt, nil end
    local items, read_err = database.with_db(function(ex: database.Executor): ({[integer]: types.Resource}?, error?)
        local rows: {[integer]: types.Resource} = {}
        for i, edit in ipairs(requested) do
            local row, row_err = library_reader.write_result(ex, edit.key, seq - #requested + i)
            if row_err then return nil, row_err end
            rows[i] = row
        end
        return rows, nil
    end)
    if read_err then return nil, read_err end
    for i = 1, #requested do
        local item = items and items[i]
        if not item then
            item, read_err = thread_events.resource_at(threads_api, seq - #requested + i)
            if read_err then
                if not errors.is(read_err, errors.NOT_FOUND) then return nil, read_err end
                logger:warn("Mail library write is committed and its result is unavailable", {seq = seq, error = tostring(read_err)})
                receipt.items = nil
                return receipt, nil
            end
        end
        if item.kind == "asset" then
            local usage, usage_err = usage_reader.used_by(item)
            if usage_err then
                logger:warn("Mail asset usage is unavailable", {seq = seq, error = tostring(usage_err)})
            else
                item.used_by = usage
            end
        end
        item.committed, item.projected = true, true
        receipt.items[i] = item
    end
    return receipt, nil
end

local function conflict(threads_api: types.LibraryThreads, err: error, edits: {types.LibraryEdit}, batch: {types.LibraryEvent}): error
    local reason = (err:details() or {}).reason
    if reason ~= "head_mismatch" and reason ~= "version_mismatch" then return err end
    for i, edit in ipairs(edits) do
        local row, read_err = thread_events.head(threads_api, batch[i].subject)
        if read_err then return read_err end
        local version = row.subject_version or 0
        if version ~= batch[i].body.revision - 1 then return edit_rules.conflict(edit.key, version) end
    end
    return errors.new({kind = errors.CONFLICT, retryable = true, message = "Mail library has changed",
        details = {code = "mail_library_changed"}})
end

local function single(saved: types.LibrarySaveResult): (types.Resource?, error?)
    if not saved.items then return {seq = saved.seq, projected = saved.projected, committed = true} :: types.Resource, nil end
    return saved.items[1], nil
end

function M.replay_asset(key: types.ResourceKey, operation: string, command_id: string, signature: string): (types.Resource?, error?)
    local author, actor_err = library.author()
    if actor_err then return nil, actor_err end
    local api, open_err = thread_events.open()
    if open_err then return nil, open_err end
    local seq, err = threads.replay(api :: types.LibraryThreads, author :: string, operation, command_id, events.ASSET_ADDED, signature, 1)
    if err or not seq then return nil, err end
    local saved, result_err = result(api :: types.LibraryThreads, operation, {{key = key}}, seq, threads.wait_deadline())
    if result_err then return nil, result_err end
    return single(saved :: types.LibrarySaveResult)
end

function M.apply(operation: string, edits: {types.LibraryEdit}, opts: types.LibraryWriteOptions): (types.LibrarySaveResult?, error?)
    local invalid = edit_rules.validate(edits, operation)
    if invalid then return nil, invalid end
    local deadline = threads.wait_deadline()
    local command_id, id_err = edit_rules.command_id(opts.command_id or uuid.v4())
    if id_err then return nil, id_err end
    local principal, actor_err = library.author()
    if actor_err then return nil, actor_err end
    local author = principal :: string
    local denied = library.require_write()
    if denied then return nil, denied end
    if operation == "restore" then
        local read_denied = library.require_read()
        if read_denied then return nil, read_denied end
    end
    local opened, open_err = thread_events.open()
    if open_err then return nil, open_err end
    local api = opened :: types.LibraryThreads
    local signature = opts.command_hash
    if not signature then
        local hash_err
        signature, hash_err = canonical.hash({edits = edits, preview_id = opts.preview_id})
        if hash_err then return nil, hash_err end
    end
    local identity_op = opts.identity_op or operation
    local edit = edits[1]
    local asset = edit.key.kind == "asset"
    local first_type = edit_rules.event_type(operation, edit.key)
    local function replay(): (integer?, error?)
        local seq, err = threads.replay(api, author, identity_op, command_id :: string, first_type, signature :: string, #edits)
        if seq or err or not (asset and operation == "restore") then return seq, err end
        return threads.replay(api, author, identity_op, command_id :: string, events.RESET, signature :: string, #edits)
    end
    if opts.command_id then
        local seq, replay_err = replay()
        if replay_err then return nil, replay_err end
        if seq then return result(api, operation, edits, seq, deadline) end
    end
    local cursor, head_err = thread_events.head(api)
    if head_err then return nil, head_err end
    local mark, mark_err = database.with_db(live_repo.get)
    if mark_err then return nil, mark_err end
    if mark.projected_seq < cursor.event_count then
        local ready, catch_err = threads.catch_up(cursor.event_count, deadline)
        if catch_err and not errors.is(catch_err, errors.CONFLICT) then return nil, catch_err end
        if not ready then return nil, edit_rules.catching_up(cursor.event_count, mark.projected_seq :: integer) end
    end
    local source: types.Resource?
    if operation == "restore" then
        local source_err
        source, source_err = history.restore_source(edit.key, edit.restore :: integer, api)
        if source_err then return nil, source_err end
    end
    local versions, versions_err = thread_events.versions(api, edits)
    if versions_err then return nil, versions_err end
    local token = uuid.v4()
    local batch, plan_err = database.with_tx(function(tx: database.Transaction, dialect: string): ({types.LibraryEvent}?, error?)
        if asset then
            local checkpoint, lock_err = live_repo.lock(tx, dialect)
            if lock_err then return nil, lock_err end
            if checkpoint.projected_seq ~= cursor.event_count then
                return nil, edit_rules.catching_up(cursor.event_count, checkpoint.projected_seq :: integer)
            end
            local event, event_err = asset_event(tx, operation, edit, author, signature :: string, source,
                cursor.event_count, token, command_id :: string, versions :: {[string]: integer})
            if event_err then return nil, event_err end
            return {event :: types.LibraryEvent}, nil
        end
        local _, lock_err = library_repo.lock(tx, dialect)
        if lock_err then return nil, lock_err end
        return edit_ops.plan(tx, operation, edits, opts, author, signature :: string, cursor.event_count, source, versions :: {[string]: integer})
    end)
    if plan_err then
        if opts.command_id then
            local seq, replay_err = replay()
            if replay_err then return nil, replay_err end
            if seq then return result(api, operation, edits, seq, deadline) end
        end
        return nil, plan_err
    end
    local expect: types.ThreadExpect = {head = cursor.event_count}
    if #batch == 1 then expect.subject, expect.version = batch[1].subject, batch[1].body.revision - 1 end
    if batch[1].type == events.ASSET_RESTORED then notify.retention() end
    local receipt, err = threads.append(api, author, identity_op, command_id :: string, expect, batch)
    if err or receipt.duplicates > 0 then
        local details = err and err:details() or {}
        if not err or batch[1].body.asset or errors.is(err, errors.CONFLICT) or details.cause ~= nil then
            local seq, replay_err = replay()
            if replay_err then return nil, replay_err end
            if seq then return result(api, operation, edits, seq, deadline) end
        end
        if err then
            local upload = batch[1].body.asset
            if upload and details.cause == nil then
                local _, release_err = database.with_tx(function(tx: database.Transaction): (boolean?, error?)
                    return asset_file_repo.release_hold(tx, upload.upload_id, token)
                end)
                if release_err then return nil, release_err end
            end
            return nil, conflict(api, err, edits, batch)
        end
    end
    return result(api, operation, edits, receipt.max_seq :: integer, deadline)
end

function M.one(edit: types.LibraryEdit, operation: string, opts: types.LibraryWriteOptions?): (types.Resource?, error?)
    local saved, err = M.apply(operation, {edit}, opts or {})
    if err then return nil, err end
    return single(saved :: types.LibrarySaveResult)
end

function M.teardown(component_id: string?): (boolean?, error?)
    if component_id ~= thread_events.library_thread_id() then
        return nil, errors.new({kind = errors.INVALID, message = "Mail library component context is required",
            details = {code = "mail_library_component_required"}})
    end
    local now = time.now():unix_nano() // 1000000
    local _, err = database.with_tx(function(tx: database.Transaction, dialect: string): (boolean?, error?)
        local _, lock_err = live_repo.lock(tx, dialect)
        if lock_err then return nil, lock_err end
        local _, library_lock_err = library_repo.lock(tx, dialect)
        if library_lock_err then return nil, library_lock_err end
        local _, release_err = asset_file_repo.release_library(tx, now)
        if release_err then return nil, release_err end
        for _, delete in ipairs({library_repo.delete_all, history_repo.delete_all, reference_repo.delete_all,
            preview_repo.delete_all, asset_refs.delete_all, live_repo.delete}) do
            local _, delete_err = delete(tx)
            if delete_err then return nil, delete_err end
        end
        return true, nil
    end)
    if err then return nil, err end
    local cleared, clear_err = live.clear()
    if clear_err then return nil, clear_err end
    notify.retention()
    return cleared, nil
end

return M
