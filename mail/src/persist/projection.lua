-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local db = require("db")
local fold = require("fold")
local history = require("history_repo")
local jobs = require("jobs")
local library = require("library_repo")
local live = require("live_repo")
local reader = require("library_reader")
local references = require("reference_repo")
local time = require("time")
local types = require("types")
local uploads = require("upload_ref_repo")

local M = {}

local TIMESTAMP_LAYOUTS = {
    "2006-01-02T15:04:05.999999999Z07:00",
    "2006-01-02 15:04:05.999999999Z07:00",
    "2006-01-02 15:04:05.999999999-07",
    "2006-01-02 15:04:05.999999999",
}

local function error_with_code(code: string, message: string): error
    return errors.new({kind = errors.INTERNAL, message = message, retryable = false, details = {code = code}})
end

local function occurred_at(value: string): (integer?, error?)
    for _, layout in ipairs(TIMESTAMP_LAYOUTS) do
        local parsed = time.parse(layout, value)
        if parsed then return parsed:unix_nano() // 1000000, nil end
    end
    return nil, error_with_code("mail_projection_timestamp", "Invalid library event timestamp")
end

local function apply(tx: types.Transaction, event: types.PrefetchedLibraryEvent): (types.FoldEffect?, error?)
    local at, time_err = occurred_at(event.created_at)
    if time_err then return nil, time_err end
    local resource_key, key_err = fold.key(event)
    if key_err then return nil, key_err end
    local key = resource_key :: types.ResourceKey
    local current, read_err = reader.projected_state(tx, key)
    if read_err then return nil, read_err end
    local effect, fold_err = fold.apply(current, event, at :: integer)
    if fold_err then return nil, fold_err end
    local _, reason: error?
    if effect.upsert then
        _, reason = library.upsert(tx, effect.upsert :: types.ProjectedResource)
    elseif effect.upsert_asset then
        _, reason = library.upsert_asset(tx, effect.upsert_asset :: types.ProjectedAsset)
    elseif effect.archive then
        _, reason = library.archive(tx, effect.history)
    elseif effect.delete then
        if key.kind == "asset" then
            _, reason = library.delete_asset(tx, key.name, event.seq)
        else
            _, reason = library.delete(tx, key, event.seq)
        end
    end
    if reason then return nil, reason end
    if effect.refs then
        _, reason = references.replace(tx, key, effect.refs)
    elseif effect.delete then
        _, reason = references.delete_from(tx, key)
    end
    if reason then return nil, reason end
    if effect.retire then
        _, reason = uploads.retire(tx, effect.retire.upload_id, effect.retire.last_seq)
        if reason then return nil, reason end
    end
    if effect.upsert_asset then
        _, reason = uploads.activate(tx, effect.upsert_asset.upload_id, key.name, event.seq)
        if reason then return nil, reason end
    end
    if key.kind ~= "asset" then
        _, reason = library.snapshot_revision(tx, event, effect.history)
        if reason then return nil, reason end
    end
    _, reason = history.insert(tx, effect.history)
    if reason then return nil, reason end
    return effect, nil
end

local function gap(): error
    return error_with_code("mail_projection_source_gap", "The library projection input is missing events")
end

local function project(tx: types.Transaction, dialect: string, input: types.ProjectionInput): (integer?, error?)
    local mark, lock_err = live.lock(tx, dialect)
    if lock_err then return nil, lock_err end
    local initial = mark :: types.LiveState
    local last, template = initial.projected_seq, initial.template_seq
    if input.range.from_seq > last + 1 then return nil, gap() end
    local uploads_changed = false
    for _, event in ipairs(input.events) do
        if event.seq > last then
            if event.seq ~= last + 1 then return nil, gap() end
            local effect, err = apply(tx, event)
            if err then return nil, err end
            last = event.seq
            if effect.template_change then template = last end
            uploads_changed = uploads_changed or effect.upsert_asset ~= nil or effect.retire ~= nil
        end
    end
    if last < input.range.to_seq then return nil, gap() end
    if last == initial.projected_seq then return last, nil end
    local _, advance_err = live.advance(tx, last, template :: integer)
    if advance_err then return nil, advance_err end
    if template > initial.template_seq or uploads_changed then
        local _, enqueue_err = jobs.enqueue_tx(tx, dialect, {
            namespace = "kickside.mail", scope = "library", key = "library_sync:" .. last,
            owner_locator = {kind = "mail-library", id = input.thread_id},
            job_type = "kickside.mail.jobs:library_sync", immutable_payload = {seq = last, uploads_changed = uploads_changed},
            -- Explicit attempts keep Jobs from opening Settings inside this transaction.
            max_attempts = 3,
        })
        if enqueue_err then return nil, enqueue_err end
    end
    return last, nil
end

function M.run(input: types.ProjectionInput): ({body: {projected_seq: integer}, last_seq: integer}?, error?)
    local last, err = db.with_tx(function(tx: types.Transaction, dialect: string): (integer?, error?)
        return project(tx, dialect, input)
    end)
    if err then return nil, err end
    return {body = {projected_seq = last :: integer}, last_seq = input.range.to_seq}, nil
end

return M
