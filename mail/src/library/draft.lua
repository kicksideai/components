-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local types = require("types")
local registry = require("registry")
local error_envelope = require("error_envelope")
local render = require("render")
local catalog = require("catalog")
local globals = require("globals")
local resources = require("resources")
local jet = require("jet")
local asset_refs = require("asset_refs")

local M = {}
local HTML = jet.draft_namespace .. "html"
local TEXT = jet.draft_namespace .. "text"

local function add_set(changes: registry.Changes, id: string, escape: string): error?
    local _, err = changes:create({id = id, kind = "template.set", data = {engine = {escape = escape}}})
    return err
end

local function clear(overlay: registry.Snapshot): (boolean?, error?)
    local entries, err = overlay:entries()
    if err then return nil, err end
    if #entries == 0 then return false, nil end
    local ids = {}
    for _, entry in ipairs(entries) do
        ids[#ids + 1] = entry.id
    end
    local changes = overlay:changes()
    local _, stage_err = changes:delete(ids)
    if stage_err then return nil, stage_err end
    local _, apply_err = changes:apply()
    if apply_err then return nil, apply_err end
    return true, nil
end

function M.clear_workspace(): (boolean?, error?)
    local overlay, err = registry.overlay(jet.draft_owner)
    if err then return nil, err end
    return clear(overlay)
end

local function open(items: types.ResourceMap, checked: {types.ResourceContent}): error?
    local overlay, err = registry.overlay(jet.draft_owner)
    if err then return err end
    local cleared, clear_err = clear(overlay)
    if clear_err then return clear_err end
    if cleared then
        overlay, err = registry.overlay(jet.draft_owner)
        if err then return err end
    end
    local changes = overlay:changes()
    local html_err = add_set(changes, HTML, "html")
    if html_err then return html_err end
    local text_err = add_set(changes, TEXT, "none")
    if text_err then return text_err end

    for _, item in pairs(items) do
        for _, entry in ipairs(jet.entries(item, jet.draft_namespace, HTML, TEXT)) do
            local _, stage_err = changes:create(entry)
            if stage_err then return stage_err end
        end
    end
    for _, item in ipairs(checked) do
        if item.kind == "part" then
            local name = "check/" .. item.name
            local source = '{{ include "/' .. jet.name(item) .. '" vars }}'
            local _, html_err = changes:create(jet.entry(jet.draft_namespace .. "check.html." .. item.name, HTML, name, source))
            if html_err then return html_err end
            local _, text_err = changes:create(jet.entry(jet.draft_namespace .. "check.text." .. item.name, TEXT, name, source))
            if text_err then return text_err end
        end
    end
    local _, apply_err = changes:apply()
    return apply_err
end

local function with_draft<T>(items: types.ResourceMap, checked: {types.ResourceContent},
    run: (types.TemplateSet, types.TemplateSet) -> (T?, error?)): (T?, error?)
    local open_err = open(items, checked)
    if open_err then
        if open_err:kind() ~= errors.CONFLICT then return nil, open_err end
        local details = open_err:details() or {}
        details.code = "mail_draft_workspace_unavailable"
        return nil, errors.new({kind = errors.CONFLICT, retryable = open_err:retryable() == true,
            message = "The draft workspace is unavailable.", details = details})
    end
    local value, err = render.with_sets(HTML, TEXT, run)
    local final_err = error_envelope.cleanup(M.clear_workspace, err, "Cannot close the mail draft sets")
    if final_err then return nil, final_err end
    return value, nil
end

local function invalid(err: error): error
    return errors.new({kind = errors.INVALID, retryable = false, message = err:message(), details = err:details()})
end

local function diagnostic(err: error, item: types.ResourceContent, changed: {types.ResourceContent}): error
    local details = err:details()
    local candidates: {types.ResourceKey} = {}
    local seen: {[string]: boolean} = {}
    local function add(resource: types.ResourceKey)
        local key = resources.key(resource)
        if seen[key] then return end
        seen[key] = true
        candidates[#candidates + 1] = {kind = resource.kind, name = resource.name}
    end
    add(item)
    if item.base then add({kind = "base", name = item.base}) end
    for _, candidate in ipairs(changed) do add(candidate) end
    details.candidate_resources = candidates
    return errors.new({kind = err:kind(), retryable = false, message = err:message(), details = details})
end

local function render_message(item: types.ResourceContent, vars: types.JsonObject, values: types.RenderGlobals,
    html: types.TemplateSet, text: types.TemplateSet, attachments: {types.AttachmentRef}?): (types.Rendered?, error?)
    local result, err = render.faces(item, vars, values, html, text, attachments)
    if not err then return result, nil end
    if not (err:details() or {}).face then err = render.face_error(item, "variables", err) end
    return nil, invalid(err)
end

local function record_usage(usage: types.AssetUsage, name: string, refs: {types.AssetRef}?)
    for _, ref in ipairs(refs or {}) do
        usage[ref.name] = usage[ref.name] or {}
        usage[ref.name][#usage[ref.name] + 1] = name
    end
end

local function validate_faces(item: types.ResourceContent, values: types.RenderGlobals, html: types.TemplateSet,
    text: types.TemplateSet, usage: types.AssetUsage): error?
    if item.kind == "asset" then return nil end
    if item.kind == "message" then
        local rendered, err = render_message(item, item.samples, values, html, text)
        if rendered then record_usage(usage, item.name, rendered.library_assets) end
        return err
    end
    local schema_err = catalog.validate_vars(item.schema, item.samples)
    if schema_err then return invalid(render.face_error(item, "samples", schema_err)) end
    local context = globals.data(values, item.samples, "")
    local name = item.kind == "part" and ("check/" .. item.name) or jet.name(item)
    context.assets = asset_refs.context(values.assets or {})
    local _, html_err = html:render(name, context)
    if html_err then return invalid(render.face_error(item, "html", html_err, true)) end
    context.assets = nil
    local _, text_err = text:render(name, context)
    if text_err then return invalid(render.face_error(item, "text", text_err, true)) end
    return nil
end

local function issue(err: error): types.DraftIssue
    local details = err:details()
    return {code = details.code :: string, message = err:message(), resource = details.resource :: types.ResourceKey,
        face = details.face :: string, engine_message = details.engine_message :: string?, candidate_resources = details.candidate_resources :: {types.ResourceKey}}
end

local function check(candidates: {types.ResourceContent}, dependants: {types.Resource}, values: types.RenderGlobals,
    html: types.TemplateSet, text: types.TemplateSet): (types.DraftPreview, error?, error?, types.AssetUsage)
    local result: types.DraftPreview = {errors = {}, dependent_messages = {}}
    local usage: types.AssetUsage = {}
    local candidate_error: error?
    local dependent_error: error?
    for _, candidate in ipairs(candidates) do
        local err = validate_faces(candidate, values, html, text, usage)
        if err then
            err = diagnostic(err, candidate, candidates)
            result.errors[#result.errors + 1] = issue(err)
            candidate_error = candidate_error or err
        end
    end
    for _, item in ipairs(dependants) do
        local err = validate_faces(item, values, html, text, usage)
        if err then
            err = diagnostic(err, item, candidates)
            result.errors[#result.errors + 1] = issue(err)
            result.dependent_messages[#result.dependent_messages + 1] = item.name
            dependent_error = dependent_error or err
        end
    end
    return result, candidate_error, dependent_error, usage
end

function M.validate(items: types.ResourceMap, key: types.ResourceKey, candidates: {types.ResourceContent},
    dependants: {types.Resource}, values: types.RenderGlobals): (types.AssetUsage?, error?)
    values.assets = asset_refs.from_items(items)
    return with_draft(items, candidates, function(html: types.TemplateSet, text: types.TemplateSet): (types.AssetUsage?, error?)
        local result, candidate_error, dependent_error, usage = check(candidates, dependants, values, html, text)
        if candidate_error then return nil, candidate_error end
        if not dependent_error then return usage, nil end
        if #candidates == 0 then
            return nil, errors.new({kind = errors.CONFLICT, retryable = false, message = dependent_error:message(),
                details = {code = "mail_resource_in_use", resource = key, dependent = dependent_error:details(),
                    messages = result.dependent_messages}})
        end
        local details = dependent_error:details()
        details.dependent_messages = result.dependent_messages
        details.errors = result.errors
        return nil, errors.new({kind = dependent_error:kind(), retryable = false, message = dependent_error:message(),
            details = details})
    end)
end

function M.preview(items: types.ResourceMap, item: types.Resource, vars: types.JsonObject, candidates: {types.ResourceContent},
    dependants: {types.Resource}, values: types.RenderGlobals, attachments: {types.AttachmentRef}?): (types.DraftPreview?, error?)
    values.assets = asset_refs.from_items(items)
    return with_draft(items, candidates, function(html: types.TemplateSet, text: types.TemplateSet): (types.DraftPreview?, error?)
        local result = check(candidates, dependants, values, html, text)
        local rendered, err = render_message(item, vars, values, html, text, attachments)
        if err then
            local problem = issue(diagnostic(err, item, candidates))
            for _, existing in ipairs(result.errors) do
                if existing.resource.kind == problem.resource.kind and existing.resource.name == problem.resource.name
                    and existing.face == problem.face and existing.message == problem.message
                    and existing.engine_message == problem.engine_message then
                    return result, nil
                end
            end
            result.errors[#result.errors + 1] = problem
        else
            result.subject, result.html, result.text = rendered.subject, rendered.html, rendered.text
            result.library_assets = rendered.library_assets
        end
        return result, nil
    end)
end

function M.asset_usage(items: types.ResourceMap, values: types.RenderGlobals): (types.AssetUsage?, error?)
    values.assets = asset_refs.from_items(items)
    return with_draft(items, {}, function(html: types.TemplateSet, text: types.TemplateSet): (types.AssetUsage?, error?)
        local usage: types.AssetUsage = {}
        for _, item in pairs(items) do
            if item.kind == "message" then
                local rendered, err = render_message(item, item.samples, values, html, text)
                if err then return nil, err end
                record_usage(usage, item.name, rendered.library_assets)
            end
        end
        return usage, nil
    end)
end

function M.render(items: types.ResourceMap, item: types.Resource, vars: types.JsonObject,
    candidates: {types.ResourceContent}, values: types.RenderGlobals,
    attachments: {types.AttachmentRef}?): (types.Rendered?, error?)
    values.assets = asset_refs.from_items(items)
    return with_draft(items, {}, function(html: types.TemplateSet, text: types.TemplateSet): (types.Rendered?, error?)
        local result, err = render_message(item, vars, values, html, text, attachments)
        if err then return nil, diagnostic(err, item, candidates) end
        return result, nil
    end)
end

return M
