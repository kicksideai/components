-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local types = require("types")
local client = require("client")
local resources = require("resource")
local edit_rules = require("edit")
local edits = require("library_edits")
local library = require("library")
local message = require("message")
local vars_schema = require("vars")
local globals = require("globals")
local settings = require("settings")
local database = require("database")
local library_repo = require("library_repo")
local preview_repo = require("preview_repo")
local digest = require("digest")
local notify = require("notify")
local scratch = require("scratch")
local security = require("security")
local time = require("time")
local uuid = require("uuid")
local renderer = require("render")
local live_preview = require("live_preview")

local M = {render = live_preview.preview}

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
    if bind then
        local proposed, op, shape_err = review_edits(input)
        if shape_err then return nil, shape_err end
        batch, operation = proposed :: {types.LibraryEdit}, op
        local invalid = edit_rules.validate(batch, operation :: string)
        if invalid then return nil, invalid end
        local actor, actor_err = security.actor()
        if actor_err then return nil, actor_err end
        if not actor then return nil, resources.error(errors.PERMISSION_DENIED, "mail_library_denied", "A principal must edit the mail library") end
        author = actor:id()
        local write_denied = library.require_write()
        if write_denied then return nil, write_denied end
        if operation == "restore" then
            local read_denied = library.require_read()
            if read_denied then return nil, read_denied end
        end
    elseif input.create ~= nil or input.set_base ~= nil or input.reset ~= nil or input.restore ~= nil
        or (input.resource ~= nil and (type(input.resource) ~= "table" or input.resources ~= nil))
        or (input.resources ~= nil and edit_rules.count(input.resources) == 0) then
        return nil, resources.error(errors.INVALID, "invalid_mail_resources", "Provide one draft resource or an array of draft resources")
    end

    local appearance, globals_err = settings.appearance()
    if globals_err then return nil, globals_err end
    local values = globals.data(appearance :: types.Appearance)
    local rendered, render_err = database.with_tx(function(tx: types.Transaction, dialect: string): (types.Rendered | types.DraftPreview | nil, error?)
        local _, lock_err = library_repo.lock(tx, dialect)
        if lock_err then return nil, lock_err end
        local loaded, load_err = edits.workspace(tx)
        if load_err then return nil, load_err end
        local workspace = loaded :: types.LibraryWorkspace
        local items = workspace.items
        local candidates: {types.ResourceContent} = {}
        local keys: {types.ResourceKey} = {}
        local changed: {[string]: boolean} = {}
        local expected: {[string]: integer} = {}
        local function add(candidate: types.ResourceContent): error?
            if candidate.kind == "asset" then
                return resources.error(errors.INVALID, "invalid_mail_asset", "Assets are added from an upload", candidate)
            end
            local id = resources.subject(candidate)
            if changed[id] then
                return resources.error(errors.INVALID, "duplicate_mail_resource", "A resource can appear only once per draft", candidate)
            end
            changed[id], items[id], workspace.loaded[id] = true, candidate :: types.Resource, true
            candidates[#candidates + 1], keys[#keys + 1] = candidate, candidate
            return nil
        end

        if bind then
            for _, edit in ipairs(batch) do
                if edit.key.kind == "asset" then
                    return nil, resources.error(errors.INVALID, "invalid_mail_asset", "Assets are added from an upload", edit.key)
                end
                local err = edits.load(workspace, edit.key)
                if err then return nil, err end
                if edit.from then
                    local source_err = edits.load(workspace, edit.from)
                    if source_err then return nil, source_err end
                end
                local candidate, invalid = edits.prepare(tx, edit, operation :: string, items, workspace.originals)
                if invalid then return nil, invalid end
                local revision, revision_err = edits.current_revision(workspace, edit.key)
                if revision_err then return nil, revision_err end
                expected[resources.subject(edit.key)] = revision :: integer
                local add_err = add(candidate :: types.ResourceContent)
                if add_err then return nil, add_err end
            end
        else
            local draft: {types.ResourceContent} = input.resource and {input.resource} or (input.resources :: {types.ResourceContent}?) or {}
            for _, input_resource in ipairs(draft) do
                local invalid = resources.check_content(input_resource)
                if invalid then return nil, invalid end
                local candidate, normalize_err = resources.normalize(input_resource)
                if normalize_err then return nil, normalize_err end
                local add_err = add(candidate :: types.ResourceContent)
                if add_err then return nil, add_err end
            end
        end
        local read_err = edits.load(workspace, key)
        if read_err then return nil, read_err end
        local item = items[resources.subject(key)]
        if not item or item.archived then return nil, edit_rules.missing(key) end
        local dependants: {types.Resource} = {}
        if bind then
            local found, dependants_err = edits.dependants(workspace, keys, changed)
            if dependants_err then return nil, dependants_err end
            dependants = found :: {types.Resource}
        end
        local roots: {types.ResourceContent} = {item}
        for _, candidate in ipairs(candidates) do roots[#roots + 1] = candidate end
        for _, dependant in ipairs(dependants) do roots[#roots + 1] = dependant end
        local dependency_err = edits.dependencies(workspace, roots)
        if dependency_err then return nil, dependency_err end
        for _, candidate in ipairs(candidates) do
            local base_err = edit_rules.base_exists(items, candidate)
            if base_err then return nil, base_err end
        end

        local vars = input.vars or item.samples
        local _, clear_err = scratch.clear_workspace()
        if clear_err then return nil, clear_err end
        if not bind then
            return scratch.render(items, item, vars, candidates, values, input.attachments)
        end
        local result, draft_err = scratch.preview(items, item, vars, candidates, dependants, values, input.attachments)
        if draft_err then return nil, draft_err end
        if #result.errors == 0 then
            local hash, hash_err = digest.preview(operation :: string, candidates, expected, batch[1].restore)
            if hash_err then return nil, hash_err end
            local id, insert_err = preview_repo.insert(tx, {id = uuid.v4(), actor = author :: string,
                operation = operation :: string, digest = hash :: string, expected = expected, expires_at = time.now():unix() + 15 * 60})
            if insert_err then return nil, insert_err end
            result.preview_id = id
        end
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
    if output.preview_id then notify.retention() end
    return rendered, nil
end

function M.render_draft(input: types.EditPreview): (types.Rendered?, error?)
    local result, err = preview(input, false)
    return result :: types.Rendered?, err
end

function M.preview_edits(input: types.EditPreview): (types.DraftPreview?, error?)
    local result, err = preview(input, true)
    return result :: types.DraftPreview?, err
end

return M
