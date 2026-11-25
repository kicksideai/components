-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local types = require("types")
local client = require("client")
local resources = require("resources")
local edit_ops = require("edits")
local message = require("message")
local vars_schema = require("vars")
local globals = require("globals")
local settings = require("settings")
local store = require("store")
local database = require("database")
local scratch = require("scratch")
local security = require("security")
local time = require("time")
local preview_id = require("preview_id")
local renderer = require("render")
local live_preview = require("live_preview")

local M = {}

local function preview(input: types.EditPreview, bind: boolean): (types.Rendered | types.DraftPreview | nil, error?)
    local denied = client.require_library()
    if denied then return nil, denied end
    if type(input) ~= "table" or type(input.message) ~= "string"
        or (input.resource ~= nil and (type(input.resource) ~= "table" or input.resources ~= nil or input.create ~= nil))
        or (input.create ~= nil and (not bind or type(input.create) ~= "table" or input.resources ~= nil)) then
        return nil, resources.error(errors.INVALID, "invalid_mail_draft", "Provide a message and either edited resources or one new resource")
    end
    if input.attachments ~= nil then
        local invalid = message.attachments_error(input.attachments)
        if invalid then return nil, invalid end
    end
    if (input.resources ~= nil and edit_ops.count(input.resources) == 0) or (bind and not (input.resources or input.create)) then
        return nil, resources.error(errors.INVALID, "invalid_mail_resources", "Provide draft resources or a new resource to preview")
    end
    local edits: {types.ResourceContent} = input.resource and {input.resource} or input.resources or {}
    local candidates: {types.ResourceContent} = {}
    local keys: {types.ResourceKey} = {}
    local changed: {[string]: boolean} = {}
    for i, edit in ipairs(edits) do
        if edit.kind == "asset" then
            return nil, resources.error(errors.INVALID, "invalid_mail_asset", "Assets are added from an upload", edit)
        end
        local content_err = resources.check_content(edit)
        if content_err then return nil, content_err end
        local candidate, invalid = resources.normalize(edit)
        if invalid then return nil, invalid end
        local id = resources.key(candidate)
        if changed[id] then
            return nil, resources.error(errors.INVALID, "duplicate_mail_resource", "A resource can appear only once per draft", candidate)
        end
        changed[id], candidates[i], keys[i] = true, candidate, candidate
    end
    if input.create then
        local key_err = resources.check_input_key(input.create)
        if key_err then return nil, key_err end
        local content_err = resources.check_content(input.create :: types.ResourceContent)
        if content_err then return nil, content_err end
        local note_err = resources.check_note(input.create.note)
        if note_err then return nil, note_err end
        if input.create.from ~= nil then
            local from_err = resources.check_key(input.create.from)
            if from_err then return nil, from_err end
        end
    end
    local vars_err = vars_schema.check_vars(input.vars)
    if vars_err then return nil, vars_err end
    local appearance, globals_err = settings.appearance()
    if globals_err then return nil, globals_err end
    local values = globals.data(appearance :: types.Appearance)
    local rendered, render_err = database.with_tx(function(tx: types.Transaction, dialect: string): (types.Rendered | types.DraftPreview | nil, error?)
        local lock_err = store.lock(tx, dialect)
        if lock_err then return nil, lock_err end
        local items, err, originals = resources.load(tx)
        if err then return nil, err end
        if input.create then
            if input.create.kind == "asset" then
                return nil, resources.error(errors.INVALID, "invalid_mail_asset", "Assets are added from an upload", input.create)
            end
            local candidate, create_err = edit_ops.prepare(tx, edit_ops.create(input.create), "create",
                items :: types.ResourceMap, originals :: types.OriginalMap)
            if create_err then return nil, create_err end
            changed[resources.key(candidate)] = true
            candidates[1], keys[1] = candidate, candidate
        end
        for _, candidate in ipairs(candidates) do
            items[resources.key(candidate)] = candidate :: types.Resource
        end
        for _, candidate in ipairs(candidates) do
            local base_err = edit_ops.base_exists(items :: types.ResourceMap, candidate)
            if base_err then return nil, base_err end
        end
        local key = {kind = "message", name = input.message}
        local item = items[resources.key(key)]
        if not item then return nil, edit_ops.missing(key) end
        local vars = input.vars
        if vars == nil then vars = item.samples end
        local _, clear_err = scratch.clear_workspace()
        if clear_err then return nil, clear_err end
        if not bind then
            return scratch.render(items :: types.ResourceMap, item, vars, candidates, values, input.attachments)
        end
        local dependent, dependants_err = edit_ops.dependants(tx, items :: types.ResourceMap, originals :: types.OriginalMap, keys, changed)
        if dependants_err then return nil, dependants_err end
        local result, draft_err = scratch.preview(items :: types.ResourceMap, item, vars, candidates, dependent :: {types.Resource},
            values, input.attachments)
        if draft_err then return nil, draft_err end
        if #result.errors == 0 then
            local actor, actor_err = security.actor()
            if actor_err then return nil, actor_err end
            if not actor then
                return nil, resources.error(errors.PERMISSION_DENIED, "mail_library_denied", "A principal must edit the mail library")
            end
            local receipt, sign_err = preview_id.issue(candidates, actor:id(), input.create and "create" or "update", time.now():unix())
            if sign_err then return nil, sign_err end
            result.preview_id = receipt
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
    return rendered, nil
end

function M.render_draft(input: types.DraftRequest): (types.Rendered?, error?)
    local result, err = preview(input, false)
    return result :: types.Rendered?, err
end

function M.preview_edits(input: types.EditPreview): (types.DraftPreview?, error?)
    local result, err = preview(input, true)
    return result :: types.DraftPreview?, err
end

M.render = live_preview.preview

return M
