-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local types = require("types")
local security = require("security")
local time = require("time")
local database = require("database")
local library = require("library")
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

local M = {}

local function write_item(tx: types.Transaction, item: types.Resource, change: types.RevisionChange): (types.Resource?, error?)
    local written, err = library_repo.write(tx, item, change)
    if err then return nil, err end
    local _, release_err = asset_file_repo.release(tx, written.released, time.now():unix_nano() // 1000000)
    if release_err then return nil, release_err end
    return written.item, nil
end

local function remove_asset(tx: types.Transaction, key: types.ResourceKey, deleting: boolean): error?
    local released, err = library_repo.remove(tx, key, deleting)
    if err then return err end
    local _, release_err = asset_file_repo.release(tx, released :: {types.Record}, time.now():unix_nano() // 1000000)
    return release_err
end

local function apply_asset(operation: string, edit: types.LibraryEdit, author: string): (types.Resource?, error?)
    local key = edit.key
    local saved, err = database.with_tx(function(tx: types.Transaction, dialect: string): (types.Resource?, error?)
        local _, lock_err = library_repo.lock(tx, dialect)
        if lock_err then return nil, lock_err end
        local workspace, load_err = edit_ops.workspace(tx)
        if load_err then return nil, load_err end
        local read_err = edit_ops.load(workspace, key)
        if read_err then return nil, read_err end
        local candidate, invalid, restored_from = edit_ops.prepare(tx, edit, operation, workspace.items, workspace.originals)
        if invalid then return nil, invalid end
        local id = resources.subject(key)
        local current, original = workspace.items[id], workspace.originals[id]
        if operation == "delete" then
            local sources, ref_err = library.referrers(tx, key, workspace.originals)
            if ref_err then return nil, ref_err end
            if #sources > 0 then
                return nil, errors.new({kind = errors.CONFLICT, retryable = false, message = "Library resources use this mail resource",
                    details = {code = "mail_resource_in_use", resource = key, messages = library.message_names(sources),
                        resources = sources}})
            end
            local remove_err = remove_asset(tx, key, true)
            if remove_err then return nil, remove_err end
            return current, nil
        end
        local stored = candidate :: types.Resource
        local now = time.now():unix_nano() // 1000000
        stored.author, stored.updated_at, stored.created_at = author, now, current and current.created_at or now
        stored.state = original and "customized" or "created"
        stored.origin = original and original.resource.origin or nil
        stored.origin_label = original and original.resource.origin_label or nil
        if stored.asset and edit.content then
            local _, activate_err = asset_file_repo.activate(tx, (stored.asset :: types.Asset).upload_id :: string,
                edit.asset_deadline :: integer, now)
            if activate_err then return nil, activate_err end
        end
        local resetting = operation == "reset" or (stored.asset ~= nil and stored.asset.source == "original")
        local action = restored_from and "restored" or resetting and "reset" or current and "edited" or "created"
        local item, write_err = write_item(tx, stored, {action = action, state = resetting and "original" or stored.state,
            restored_from = restored_from, note = edit.note})
        if write_err then return nil, write_err end
        if resetting then
            local remove_err = remove_asset(tx, key, false)
            if remove_err then return nil, remove_err end
            item.state, item.author, item.created_at, item.updated_at = "original", nil, nil, nil
        end
        if edit.content then
            local sources, ref_err = library.referrers(tx, key, workspace.originals)
            if ref_err then return nil, ref_err end
            item.used_by = {messages = library.message_names(sources)}
        end
        return item, nil
    end)
    if err then return nil, err end
    notify.retention()
    notify.library()
    return saved, nil
end

local function catching_up(): error
    return errors.new({kind = errors.CONFLICT, retryable = true, message = "Mail library is catching up",
        details = {code = "mail_library_catching_up"}})
end

local function result(threads_api: types.LibraryThreads, operation: string, requested: {types.LibraryEdit},
    seq: integer): (types.LibrarySaveResult?, error?)
    local complete, err = threads.catch_up(threads_api, seq)
    local mark = database.with_db(live_repo.get)
    if not complete and (not mark or mark.projected_seq < seq) then
        logger:warn("Mail library write is committed and awaiting projection", {seq = seq, error = tostring(err)})
        return {seq = seq, projected = false, committed = true}, nil
    end
    notify.nudge()
    local receipt: types.LibrarySaveResult = {seq = seq, projected = true, committed = true, items = {}}
    if operation == "delete" then return receipt, nil end
    local items, read_err = database.with_db(function(ex: types.Executor): ({[integer]: types.Resource}?, error?)
        local rows: {[integer]: types.Resource} = {}
        for i, edit in ipairs(requested) do
            local row, row_err = library_reader.write_result(ex, edit.key, seq - #requested + i)
            if row_err then return nil, row_err end
            rows[i] = row
        end
        return rows, nil
    end)
    for i = 1, #requested do
        local item = items and items[i]
        if not item then
            item, read_err = thread_events.resource_at(threads_api, seq - #requested + i)
            if read_err then
                logger:warn("Mail library write is committed and its result is unavailable", {seq = seq, error = tostring(read_err)})
                receipt.items = nil
                return receipt, nil
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

function M.apply(operation: string, edits: {types.LibraryEdit}, opts: types.LibraryWriteOptions): (types.LibrarySaveResult?, error?)
    local invalid = edit_rules.validate(edits, operation)
    if invalid then return nil, invalid end
    local command_id, id_err = edit_rules.command_id(opts.command_id)
    if id_err then return nil, id_err end
    local actor, actor_err = security.actor()
    if actor_err then return nil, actor_err end
    if not actor then return nil, resources.error(errors.PERMISSION_DENIED, "mail_library_denied", "A principal must edit the mail library") end
    local denied = library.require_write()
    if denied then return nil, denied end
    if operation == "restore" then
        local read_denied = library.require_read()
        if read_denied then return nil, read_denied end
    end
    local author = actor:id()
    if edits[1].key.kind == "asset" then
        local item, err = apply_asset(operation, edits[1], author)
        if err then return nil, err end
        return {items = {item :: types.Resource}}, nil
    end
    local opened, open_err = thread_events.open()
    if open_err then return nil, open_err end
    local api = opened :: types.LibraryThreads
    local signature, hash_err = canonical.hash({edits = edits, preview_id = opts.preview_id})
    if hash_err then return nil, hash_err end
    local identity_op = opts.identity_op or operation
    local first_type = edit_rules.event_type(operation, edits[1].key)
    local function replay(): (integer?, error?)
        return threads.replay(api, author, identity_op, command_id :: string, first_type, signature :: string, #edits)
    end
    if opts.command_id then
        local seq, replay_err = replay()
        if replay_err then return nil, replay_err end
        if seq then return result(api, operation, edits, seq) end
    end
    local cursor, head_err = thread_events.head(api)
    if head_err then return nil, head_err end
    local mark, mark_err = database.with_db(live_repo.get)
    if mark_err then return nil, mark_err end
    if mark.projected_seq < cursor.event_count then
        local ready = threads.catch_up(api, cursor.event_count)
        if not ready then return nil, catching_up() end
    end
    local batch, plan_err = database.with_tx(function(tx: types.Transaction, dialect: string): ({types.LibraryEvent}?, error?)
        local _, lock_err = library_repo.lock(tx, dialect)
        if lock_err then return nil, lock_err end
        return edit_ops.plan(tx, operation, edits, opts, author, signature :: string, cursor.event_count)
    end)
    if plan_err then
        if opts.command_id then
            local seq, replay_err = replay()
            if replay_err then return nil, replay_err end
            if seq then return result(api, operation, edits, seq) end
        end
        return nil, plan_err
    end
    local expect: types.ThreadExpect = {head = cursor.event_count}
    if #batch == 1 then expect.subject, expect.version = batch[1].subject, batch[1].body.revision - 1 end
    local receipt, err = threads.append(api, author, identity_op, command_id :: string, expect, batch)
    if err or receipt.duplicates > 0 then
        if not err or errors.is(err, errors.CONFLICT) or (err:details() or {}).cause ~= nil then
            local seq, replay_err = replay()
            if replay_err then return nil, replay_err end
            if seq then return result(api, operation, edits, seq) end
        end
        if err then return nil, conflict(api, err, edits, batch) end
    end
    return result(api, operation, edits, receipt.max_seq)
end

function M.one(edit: types.LibraryEdit, operation: string, opts: types.LibraryWriteOptions?): (types.Resource?, error?)
    local saved, err = M.apply(operation, {edit}, opts or {})
    if err then return nil, err end
    if not saved.items then
        return {seq = saved.seq, projected = saved.projected, committed = true} :: types.Resource, nil
    end
    return saved.items[1], nil
end

return M
