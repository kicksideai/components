-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local sql = require("sql")
local time = require("time")
local uuid = require("uuid")
local types = require("types")
local input = require("input")
local rows = require("rows")
local access = require("access")
local storage = require("storage")
local config = require("config")
local work = require("work")
local document = require("document")
local writer = require("writer")
local sprint_reference = require("sprint_reference")

local M = {}

type Context = {
    admission: access.Admission, position: types.Position, board: work.Board, settings: config.Config, today: string, cutoff: string,
    sprint: string?, sprint_error: error?,
}
type Mutation = (sql.Transaction, Context) -> (types.Result?, error?)
type Attribution = (sql.DB, access.Admission, types.Position, string, string) -> (string?, error?)

local function enabled(settings: config.Config, item_type: string): boolean
    for _, allowed in ipairs(settings.item_types) do
        if item_type == allowed then return true end
    end
    return false
end

local function transact(request: unknown, operation: string, apply: Mutation, attribute: Attribution?): (types.Result?, error?)
    local today, cutoff = input.dates(time.now())
    local invalid = input.validate(request, operation)
    if invalid then return nil, invalid end
    local db, err = storage.open()
    if err or not db then return nil, err end
    local admission, aerr = access.admit(db, (request :: types.Delete).board_id, operation)
    if aerr or not admission then
        local _, release_err = db:release()
        return nil, aerr or release_err
    end
    local position = { attachment_id = admission.attachment_id, board_id = admission.board.board_id }
    -- Planning may open its own Work snapshot on the same single-connection SQLite target.
    local sprint, sprint_error
    if attribute then sprint, sprint_error = attribute(db, admission, position, today, cutoff) end
    local result, failure = rows.transaction(db, function(tx: sql.Transaction): (types.Result?, error?)
        local ferr = rows.lock_attachment(tx, position)
        if ferr then return nil, ferr end
        local board, settings, cerr = access.current(tx, admission)
        if cerr or not board or not settings then return nil, cerr end
        return apply(tx, { admission = admission, position = position, board = board, settings = settings, today = today,
            cutoff = cutoff, sprint = sprint, sprint_error = sprint_error })
    end)
    local _, release_err = db:release()
    if failure or release_err then return nil, failure or release_err end
    return result, nil
end

local function item_for(tx: sql.Transaction, context: Context, id: string): (work.Item?, error?)
    local item, err = access.live_item(tx, context.board, id)
    if err or not item then return nil, err end
    local ferr = rows.lock_item(tx, context.position.attachment_id, id)
    if ferr then return nil, ferr end
    return item, nil
end

local function save_totals(tx: sql.Transaction, context: Context, item: work.Item, before: types.Entry?,
    after: types.Entry?, kind: string, version: integer): error?
    local attachment = context.position.attachment_id
    local total, err = rows.total(tx, attachment, item.item_id)
    if err or not total then return err end
    local was_over = total.over_estimate
    total.minutes = total.minutes - (before and before.minutes or 0)
    local new_minutes = after and after.minutes or 0
    if total.minutes > math.maxinteger - new_minutes then
        return access.problem(errors.INVALID, "worklog_minutes_invalid", "Total minutes exceed the supported integer range")
    end
    total.minutes = total.minutes + new_minutes
    total.entry_count = total.entry_count - (before and 1 or 0) + (after and 1 or 0)
    local estimate = context.board.model.fields.time_original_minutes
    local original = estimate and document.value(item.document, estimate.id)
    total.over_estimate = total.entry_count > 0 and type(original) == "number" and total.minutes > original
    local write_err = rows.replace_total(tx, context.position, item.item_id, total)
    if write_err then return write_err end
    if before then
        local derr = rows.remove_daily(tx, attachment, before)
        if derr then return derr end
    end
    if after then
        local aerr = rows.add_daily(tx, attachment, after)
        if aerr then return aerr end
    end
    local crossed = not was_over and total.over_estimate == true and context.board.compiled.visibility == nil
    return writer.mutation(tx, attachment, context.board.board_id, kind, ((after or before) :: types.Entry).id, version, crossed)
end

function M.create(raw: unknown): (types.Result?, error?)
    return transact(raw, "create", function(tx: sql.Transaction, context: Context): (types.Result?, error?)
        local request = raw :: types.Create
        local attachment, person = context.position.attachment_id, context.admission.person_id
        local receipt, err = rows.receipt(tx, attachment, person, request.key, context.today)
        if err then return nil, err end
        local item, ierr = item_for(tx, context, receipt and receipt.item_id or request.item)
        if ierr or not item then return nil, ierr end
        local digest, herr = input.fingerprint(request)
        if herr or not digest then return nil, herr end
        if receipt then
            if receipt.hash ~= digest then
                return nil, access.problem(errors.CONFLICT, "worklog_key_conflict", "Replay key already belongs to another worklog request")
            end
            return { id = receipt.id, version = receipt.version, replayed = true }, nil
        end
        if not enabled(context.settings, item.type) then
            return nil, access.problem(errors.INVALID, "worklog_type_disabled", "This item type does not accept worklogs")
        end
        local date_err = input.accept_date(request.work_date, context.today, context.cutoff)
        if date_err then return nil, date_err end
        local minutes, merr = input.round(request.minutes, context.settings.rounding_minutes)
        if merr or not minutes then return nil, merr end
        if context.sprint_error then return nil, context.sprint_error end
        local entry: types.Entry = { id = (uuid.v7()), item_id = item.item_id, person_id = person, version = 1,
            minutes = minutes, work_date = request.work_date, note = request.note, sprint_id = context.sprint }
        local werr = rows.insert(tx, context.position, entry, request.key, digest, context.today)
            or save_totals(tx, context, item, nil, entry, "create", entry.version)
        if werr then return nil, werr end
        return { id = entry.id, version = entry.version, replayed = false }, nil
    end, function(db, admission, _, today, cutoff)
        local request = raw :: types.Create
        local date_err = input.accept_date(request.work_date, today, cutoff)
        if date_err then return nil, date_err end
        local item, err = access.live_item(db, admission.board, request.item)
        if err or not item then return nil, err end
        return sprint_reference.resolve(db, request.board_id, item.item_id, request.work_date)
    end)
end

local function editable(admission: access.Admission, entry: types.Entry, version: integer, cutoff: string): error?
    if entry.work_date < cutoff then return access.missing() end
    if not access.can_edit(admission, entry.person_id) then
        return access.problem(errors.PERMISSION_DENIED, "worklog_author_required", "Only the author or a board ADMIN can change this worklog")
    end
    if version ~= entry.version then
        return access.problem(errors.CONFLICT, "worklog_version_conflict", "Worklog version has changed")
    end
    return nil
end

local function load(tx: sql.Transaction, context: Context, request: types.Delete): (types.Entry?, work.Item?, error?)
    local entry, err = rows.entry(tx, context.position, request.id)
    if err or not entry then return nil, nil, err end
    local item, ierr = item_for(tx, context, entry.item_id)
    if ierr or not item then return nil, nil, ierr end
    local denied = editable(context.admission, entry, request.expected_version, context.cutoff)
    if denied then return nil, nil, denied end
    return entry, item, nil
end

function M.edit(raw: unknown): (types.Result?, error?)
    return transact(raw, "edit", function(tx: sql.Transaction, context: Context): (types.Result?, error?)
        local request = raw :: types.Edit
        local existing, item, err = load(tx, context, request)
        if err or not existing or not item then return nil, err end
        local edited: types.Entry = {
            id = existing.id, item_id = existing.item_id, person_id = existing.person_id, version = existing.version + 1,
            work_date = existing.work_date, sprint_id = existing.sprint_id, minutes = existing.minutes, note = existing.note,
        }
        if request.work_date and request.work_date ~= existing.work_date then
            local date_err = input.accept_date(request.work_date, context.today, context.cutoff)
            if date_err then return nil, date_err end
            if context.sprint_error then return nil, context.sprint_error end
            edited.work_date, edited.sprint_id = request.work_date, context.sprint
        end
        if request.minutes ~= nil then
            local minutes, merr = input.round(request.minutes, context.settings.rounding_minutes)
            if merr or not minutes then return nil, merr end
            edited.minutes = minutes
        end
        if request.note ~= nil then edited.note = request.note end
        local werr = rows.update(tx, context.position.attachment_id, edited)
            or save_totals(tx, context, item, existing, edited, "edit", edited.version)
        if werr then return nil, werr end
        return { id = edited.id, version = edited.version }, nil
    end, function(db, admission, position, today, cutoff)
        local request = raw :: types.Edit
        if not request.work_date then return nil, nil end
        local entry, err = rows.entry(db, position, request.id)
        if err or not entry then return nil, err end
        local item, item_err = access.live_item(db, admission.board, entry.item_id)
        if item_err or not item then return nil, item_err end
        local denied = editable(admission, entry, request.expected_version, cutoff)
            or input.accept_date(request.work_date, today, cutoff)
        if denied then return nil, denied end
        if request.work_date == entry.work_date then return nil, nil end
        return sprint_reference.resolve(db, request.board_id, item.item_id, request.work_date, entry.sprint_id)
    end)
end

function M.delete(raw: unknown): (types.Result?, error?)
    return transact(raw, "delete", function(tx: sql.Transaction, context: Context): (types.Result?, error?)
        local request = raw :: types.Delete
        local existing, item, err = load(tx, context, request)
        if err or not existing or not item then return nil, err end
        local attachment = context.position.attachment_id
        local created, cerr = rows.receipt_created(tx, attachment, existing.id)
        if cerr or not created then return nil, cerr end
        local expires, eerr = input.explicit_delete_deadline(created)
        if eerr or not expires then return nil, eerr end
        local version = existing.version + 1
        local werr = rows.remove(tx, attachment, existing.id)
            or rows.expire_receipt(tx, attachment, existing.id, expires, context.today)
            or save_totals(tx, context, item, existing, nil, "delete", version)
        if werr then return nil, werr end
        return { id = existing.id, version = version }, nil
    end)
end

return M
