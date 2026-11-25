-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local types = require("types")
local security = require("security")
local time = require("time")
local uuid = require("uuid")
local events = require("events")
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

local function asset_event(tx: types.Transaction, operation: string, edit: types.LibraryEdit, author: string,
    signature: string, source: types.Resource?, head: integer, token: string): (types.LibraryEvent?, error?)
    local key = edit.key
    local workspace, load_err = edit_ops.workspace(tx)
    if load_err then return nil, load_err end
    local read_err = edit_ops.load(workspace, key)
    if read_err then return nil, read_err end
    if source then edit.content = source end
    local candidate, invalid = edit_ops.prepare(tx, edit, operation, workspace.items, workspace.originals)
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
        local sources, ref_err = library.referrers(tx, key, workspace.originals)
        if ref_err then return nil, ref_err end
        if #sources > 0 then
            return nil, errors.new({kind = errors.CONFLICT, message = "Library resources use this mail resource",
                details = {code = "mail_resource_in_use", resource = key, messages = library.message_names(sources),
                    resources = sources}})
        end
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
            if source then
                _, reserve_err = asset_file_repo.hold_restore(tx, upload_id, head, head + 1, token)
            else
                _, reserve_err = asset_file_repo.hold_adoption(tx, upload_id, edit.asset_deadline :: integer,
                    time.now():unix_nano() // 1000000, head + 1, token)
            end
            if reserve_err then return nil, reserve_err end
            body.asset = {upload_id = upload_id, filename = asset.filename :: string,
                content_type = asset.content_type :: string, size = asset.size :: integer}
            body.title, body.description = item.title, item.description
        end
    end
    return events.build(event_type, body)
end

local function asset_source(api: types.LibraryThreads, edit: types.LibraryEdit): (types.Resource?, error?)
    local seq = edit.source_seq
    if not seq then
        local resolved, err = database.with_db(function(ex: types.Executor): (integer?, error?)
            return library_reader.event_seq(ex, edit.key, edit.restore :: integer)
        end)
        if err then return nil, err end
        if not resolved then return nil, resources.error(errors.NOT_FOUND, "mail_revision_pruned", "Mail library revision is unavailable", edit.key) end
        seq = resolved
    end
    local event, err = thread_events.event_at(api, seq :: integer)
    if err then return nil, err end
    if event.subject ~= resources.subject(edit.key) then
        return nil, resources.error(errors.NOT_FOUND, "mail_revision_not_found", "Mail library revision was not found", edit.key)
    end
    return thread_events.event_resource(event :: types.ThreadEvent)
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
        if item.kind == "asset" then
            local usage, usage_err = library.used_by(item)
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
    local actor, actor_err = security.actor()
    if actor_err then return nil, actor_err end
    if not actor then return nil, resources.error(errors.PERMISSION_DENIED, "mail_library_denied", "A principal must edit the mail library") end
    local api, open_err = thread_events.open()
    if open_err then return nil, open_err end
    local seq, err = threads.replay(api :: types.LibraryThreads, actor:id(), operation, command_id, events.ASSET_ADDED, signature, 1)
    if err or not seq then return nil, err end
    local saved, result_err = result(api :: types.LibraryThreads, operation, {{key = key}}, seq)
    if result_err then return nil, result_err end
    return single(saved :: types.LibrarySaveResult)
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
    local source: types.Resource?
    if asset and operation == "restore" then
        local source_err
        source, source_err = asset_source(api, edit)
        if source_err then return nil, source_err end
    end
    local token = uuid.v4()
    local batch, plan_err = database.with_tx(function(tx: types.Transaction, dialect: string): ({types.LibraryEvent}?, error?)
        if asset then
            local checkpoint, lock_err = live_repo.lock(tx, dialect)
            if lock_err then return nil, lock_err end
            if checkpoint.projected_seq ~= cursor.event_count then return nil, catching_up() end
            local event, event_err = asset_event(tx, operation, edit, author, signature :: string, source,
                cursor.event_count, token)
            if event_err then return nil, event_err end
            return {event :: types.LibraryEvent}, nil
        end
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
        if err then
            local upload = batch[1].body.asset
            if upload then
                local _, release_err = database.with_tx(function(tx: types.Transaction): (boolean?, error?)
                    return asset_file_repo.release_hold(tx, upload.upload_id, token)
                end)
                if release_err then return nil, release_err end
            end
            return nil, conflict(api, err, edits, batch)
        end
    end
    local adopted = asset and operation ~= "restore" and batch[1].body.asset
    if adopted then
        local _, settle_err = database.with_tx(function(tx: types.Transaction): (boolean?, error?)
            return asset_file_repo.finish_adoption(tx, adopted.upload_id, token)
        end)
        if settle_err then logger:warn("Mail asset adoption is committed", {error = tostring(settle_err)}) end
    end
    return result(api, operation, edits, receipt.max_seq :: integer)
end

function M.one(edit: types.LibraryEdit, operation: string, opts: types.LibraryWriteOptions?): (types.Resource?, error?)
    local saved, err = M.apply(operation, {edit}, opts or {})
    if err then return nil, err end
    return single(saved :: types.LibrarySaveResult)
end

return M
