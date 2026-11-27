-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local types = require("types")
local client = require("client")
local resources = require("resource")
local edit_rules = require("edit")
local edits = require("library_edits")
local library = require("library")
local history = require("history")
local thread_events = require("thread_events")
local message = require("message")
local vars_schema = require("vars")
local globals = require("globals")
local settings = require("settings")
local database = require("database")
local library_repo = require("library_repo")
local preview_repo = require("preview_repo")
local notify = require("notify")
local scratch = require("scratch")
local time = require("time")
local policy = require("policy")
local uuid = require("uuid")
local renderer = require("render")
local live_preview = require("live_preview")

local M = {}

local function review_edits(input: types.EditPreview): ({types.LibraryEdit}?, string?, error?)
    local count = 0
    for _, field in ipairs({"resources", "create", "set_base", "reset", "restore"}) do
        if input[field] ~= nil then count = count + 1 end
    end
    if count ~= 1 or input.resource ~= nil then
        return nil, nil, resources.error(errors.INVALID, "invalid_mail_draft", "Provide one library operation to preview")
    end
    if input.create then return {edits.create(input.create)}, "create", nil end
    if input.set_base then return {edits.set_base(input.set_base)}, "set_base", nil end
    if input.reset then return {edits.revision(input.reset)}, "reset", nil end
    if input.restore then return {edits.restore(input.restore)}, "restore", nil end
    local batch, err = edits.save({resources = input.resources or {}})
    return batch, "update", err
end

local function preview(input: types.EditPreview, bind: boolean): (types.Rendered | types.DraftPreview | nil, error?)
    local denied = client.require_library()
    if denied then return nil, denied end
    if type(input) ~= "table" or type(input.message) ~= "string" then
        return nil, resources.error(errors.INVALID, "invalid_mail_draft", "Provide a message to preview")
    end
    local key = {kind = "message", name = input.message}
    local key_err = resources.check_key(key)
    if key_err then return nil, key_err end
    if input.attachments ~= nil then
        local invalid = message.attachments_error(input.attachments)
        if invalid then return nil, invalid end
    end
    local vars_err = vars_schema.check_vars(input.vars)
    if vars_err then return nil, vars_err end

    local batch: {types.LibraryEdit} = {}
    local operation: string?
    local author: string?
    local source: types.Resource?
    local versions: {[string]: integer}?
    if bind then
        local proposed, op, shape_err = review_edits(input)
        if shape_err then return nil, shape_err end
        batch, operation = proposed :: {types.LibraryEdit}, op
        local invalid = edit_rules.validate(batch, operation :: string)
        if invalid then return nil, invalid end
        local actor_err
        author, actor_err = library.author()
        if actor_err then return nil, actor_err end
        local write_denied = library.require_write()
        if write_denied then return nil, write_denied end
        if operation == "restore" then
            local read_denied = library.require_read()
            if read_denied then return nil, read_denied end
            local source_err
            source, source_err = history.restore_source(batch[1].key, batch[1].restore :: integer)
            if source_err then return nil, source_err end
        end
    else
        local read_denied = library.require_read()
        if read_denied then return nil, read_denied end
        if (input.resource ~= nil and (type(input.resource) ~= "table" or input.resources ~= nil))
            or (input.resources ~= nil and edit_rules.count(input.resources) == 0) then
            return nil, resources.error(errors.INVALID, "invalid_mail_resources", "Provide one draft resource or an array of draft resources")
        end
    end

    if bind then
        local api, open_err = thread_events.open()
        if open_err then return nil, open_err end
        local versions_err
        versions, versions_err = thread_events.versions(api :: types.LibraryThreads, batch)
        if versions_err then return nil, versions_err end
    end

    local appearance, globals_err = settings.appearance()
    if globals_err then return nil, globals_err end
    local values = globals.data(appearance :: types.Appearance)
    local id = uuid.v4()
    local expires_at = time.now():unix() + 15 * 60
    -- The reservation survives cancellation during scratch rendering.
    local _, reserve_err = database.with_db(function(ex: database.Executor): (boolean?, error?)
        return preview_repo.reserve(ex, id, expires_at)
    end)
    if reserve_err then return nil, reserve_err end
    notify.retention()
    local rendered, render_err = database.with_tx(function(tx: database.Transaction, dialect: string): (types.Rendered | types.DraftPreview | nil, error?)
        local _, lock_err = library_repo.lock(tx, dialect)
        if lock_err then return nil, lock_err end
        local loaded, load_err = edits.workspace(tx, versions)
        if load_err then return nil, load_err end
        local workspace = loaded :: edits.LibraryWorkspace
        local items = workspace.items
        local candidates: {types.ResourceContent} = {}
        local set: edits.CandidateSet?
        if bind then
            local candidate_err
            set, candidate_err = edits.candidates(workspace, operation :: string, batch, source, true)
            if candidate_err then return nil, candidate_err end
            candidates = set.items
        else
            local changed: {[string]: boolean} = {}
            local draft: {types.ResourceContent} = input.resource and {input.resource} or (input.resources :: {types.ResourceContent}?) or {}
            for _, input_resource in ipairs(draft) do
                local invalid = resources.check_content(input_resource)
                if invalid then return nil, invalid end
                local candidate, normalize_err = resources.normalize(input_resource)
                if normalize_err then return nil, normalize_err end
                if candidate.kind == "asset" then
                    return nil, resources.error(errors.INVALID, "invalid_mail_asset", "Assets are added from an upload", candidate)
                end
                local subject = resources.subject(candidate)
                if changed[subject] then
                    return nil, resources.error(errors.INVALID, "duplicate_mail_resource", "A resource can appear only once per draft", candidate)
                end
                changed[subject], items[subject], workspace.loaded[subject] = true, candidate :: types.Resource, true
                candidates[#candidates + 1] = candidate
            end
        end
        local read_err = edits.load(workspace, key)
        if read_err then return nil, read_err end
        local item = items[resources.subject(key)]
        if not item or item.archived then return nil, edit_rules.missing(key) end
        local dependants, dependency_err = edits.complete(workspace, candidates, set, item)
        if dependency_err then return nil, dependency_err end

        local vars = input.vars or item.samples
        local reserved, expiry_err = preview_repo.get(tx, id)
        if expiry_err then return nil, expiry_err end
        if not reserved or policy.expired(reserved.expires_at, time.now():unix()) then
            return nil, resources.error(errors.INVALID, "mail_preview_expired", "Start a new preview")
        end
        local _, clear_err = scratch.clear_workspace()
        if clear_err then return nil, clear_err end
        if not bind then
            local result, draft_err = scratch.render(id, items, item, vars, candidates, values, input.attachments)
            if draft_err then return nil, draft_err end
            local _, discard_err = preview_repo.discard(tx, id)
            if discard_err then return nil, discard_err end
            return result, nil
        end
        local result, draft_err = scratch.preview(id, items, item, vars, candidates, dependants, values, input.attachments)
        if draft_err then return nil, draft_err end
        if #result.errors ~= 0 then
            local _, discard_err = preview_repo.discard(tx, id)
            if discard_err then return nil, discard_err end
            return result, nil
        end
        local hash, hash_err = edits.preview_digest(operation :: string, set :: edits.CandidateSet, batch)
        if hash_err then return nil, hash_err end
        local completed, complete_err = preview_repo.complete(tx, {id = id, actor = author :: string,
            operation = operation :: string, digest = hash :: string, expected = set.expected, expires_at = expires_at})
        if complete_err then return nil, complete_err end
        if not completed then
            return nil, resources.error(errors.CONFLICT, "mail_preview_expired", "Start a new preview")
        end
        result.preview_id = id
        return result, nil
    end)
    if render_err then return nil, render_err end
    local output = rendered :: types.DraftPreview
    if output.html then
        local inline, inline_err = live_preview.inline_assets(output :: types.Rendered, input.attachments)
        if inline_err then return nil, inline_err end
        output.inline_assets = inline
        output.warnings = renderer.warnings(output.html)
    end
    output.library_assets = nil
    return rendered, nil
end

function M.preview(input: types.EditPreview): (types.DraftPreview | types.Rendered | nil, error?)
    local bind = false
    if type(input) == "table" then
        bind = input.create ~= nil or input.set_base ~= nil or input.reset ~= nil or input.restore ~= nil
        if not bind and type(input.resources) == "table" then
            for _, item in ipairs(input.resources) do
                if type(item) == "table" and item.expected_revision ~= nil then
                    bind = true
                    break
                end
            end
        end
    end
    return preview(input, bind)
end

return M
